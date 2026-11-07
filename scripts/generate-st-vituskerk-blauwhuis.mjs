import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "st-vituskerk-blauwhuis");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
// Vlak door de gevellijn p0-p1, stijgend naar binnen (kant van 'inside') met helling t vanaf z0.
const facet = ([x0, y0], [x1, y1], z0, t, [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = -(y1 - y0) / len;
  let ny = (x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) < 0) {
    nx = -nx;
    ny = -ny;
  }
  return [t * nx, t * ny, z0 - t * (nx * x0 + ny * y0)];
};
// Doorsneden in plan voor de tussenstukken van een geleding (convexe veelhoeken).
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const diamond = ([cx, cy], r) => [[cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]];
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek]; verspringingen en spitsen.
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel: vierkante schacht met een piramide erop.
const pinnacle = (c, half, z0, shaft, point) =>
  loft([[z0, sq(c, half)], [z0 + shaft, sq(c, half)], [z0 + shaft + point, tip(c)]]);
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 59 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +u) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.9) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.4,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);

// St. Vituskerk (Blauwhuis, Súdwest-Fryslân), Vitusdijk 27: rooms-katholieke driebeukige transeptbasiliek van P.J.H. Cuypers
// (ontwerp 30 oktober 1867, gebouwd 1868-1871, ingewijd 15 oktober 1872; rijksmonument 515166). Voorstaande westtoren met
// drie geledingen, vier wimbergen en een achtkante naaldspits; dakruiter met spits op de kruising; het koor sluit met een
// absis van vijf zijden van een tienhoek (5/10). De eerste travee is uitgebouwd als een tweede, laag transept; naast het
// koor liggen twee vierkante kapellen. De pastorie aan de zuidkant, met traptorentje tussen pastorie en zuidtransept, en de
// lage sacristie en vleugels aan de zuidoostkant vallen in hetzelfde BAG-pand en zitten daarom in het model.
const SLUG = "st-vituskerk-blauwhuis";
const BASE = -0.6;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van schip en koor van de toren (zuidwest) naar de absis (noordoost),
// onder 33,9 graden in RD (BAG-gevels van schip, zijbeuken en transept; nok in de 3D BAG en het AHN), +v naar het
// noordwesten. Oorsprong RD (164841,17; 559515,29) in het hart van de toren op de as van het schip; z = 0 op NAP -0,4 m,
// het laagste maaiveld rond de voet (oost- en zuidkant; aan de west- en noordkant ligt het terrein tot NAP +0,4 m).
const AXIS_DEG = 33.9;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [164841.17, 559515.29];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints rond de voet (PDOK-terreintegels, november 2026):
// ten oosten van de sacristie 41,31, zuid van de zuidvleugel 41,55, ten zuiden van de pastorie 41,57, ten zuidwesten 41,52;
// NAP circa -0,4 m. Aan de westkant (plein voor de toren) ligt het PDOK-terrein op 42,1 en aan de noordkant op 42,5.
const GROUND_ELLIPSOID = 41.31;
const GROUND_SAMPLES = [[49.5, -3], [36, -18.5], [22, -27], [14.5, -17]];

// ---------- maten (meter boven z = 0, stelsel u/v; AHN-DSM 0,5 m, 3D BAG-dakvlakken, BAG-contour, foto's) ----------
// Schip: u = 3,5 .. 26,4 (westgevel achter de toren tot het transept), muren v = ±4,6; zadeldak nok +19,3, goot +13,9.
const NAVE_W = 3.5, NAVE_E = 26.4, NAVE_HW = 4.6, RIDGE = 19.3, EAVE = 13.9;
const PITCH = (RIDGE - EAVE) / NAVE_HW; // 1,17 (49,6 graden; 3D BAG 1,17 tot 1,20)
// Eerste travee (u = 3,5 .. 11,8) uitgebouwd tot v = ±9,65: dwarse zadeldaken met nok +12,8 op u = 7,65, helling 1,25.
const WB_W = 3.5, WB_E = 11.8, WB_HW = 9.65, WB_RIDGE = 12.8, WB_PITCH = 1.25, WB_U = 7.65;
// Zijbeuken (u = 11,8 .. 26,4) tot v = ±8,7: lessenaarsdak van +9,8 tegen het schip tot +7,8 aan de goot.
const AISLE_HW = 8.7, AISLE_HI = 9.8, AISLE_LO = 7.8;
// Transept: u = 26,4 .. 34,9, v = ±12,0; nok +19,3 op u = 30,65, helling 1,2, goot +14,2.
const TR_W = 26.4, TR_E = 34.9, TR_HW = 12.0, TR_U = 30.65, TR_PITCH = 1.2;
// Koor: u = 34,9 .. 40,8 recht, dan een absis van vijf zijden van een tienhoek (middelpunt u = 40,8, straal 4,6).
const CH_E = 40.8, APSE_R = 4.6;
// Kapellen naast het koor (u = 34,9 .. 41,5): lessenaarsdak van +10,0 tegen het koor naar +8,0 (noord, v = 7,85) en
// +7,2 (zuid, v = -9,45); hun oostelijke deel (u > 39,1) ligt lager en loopt naar de absis af.
const CHAP_E = 41.5, CHAP_N = 7.85, CHAP_S = -9.45;
// Westtoren: kern 6,0 m in het vierkant tot de wimbergen (+28,6), hoeksteunberen (0,9 m breed) die per geleding
// terugspringen, portaalrisaliet met wimberg, achtkante naaldspits tot +51,0 (AHN-DSM 49,9 m op 0,5 m; top geëxtrapoleerd).
const T_HW = 3.0, T_EAVE = 28.6, T_GABLE = 32.8, T_TOP = 51.0, T_SPIRE = 5.0;
// Dakruiter op de kruising (AHN 27,3 op 0,5 m): achtkante lantaarn 1,8 m tot +23,0, naald tot +29,0.
const FL = [TR_U, 0], FL_W = 1.8, FL_LANTERN = 23.0, FL_TOP = 29.0;
// Pastorie (BAG): u = 16,25 .. 29,3, v = -11,45 .. -24,85, schilddak met nok +12,9 langs v (helling 0,6) en afgewolfde
// einden; traptoren tussen pastorie en zuidtransept (3,3 m, tot +16,5, wimbergen +19,0, spits +24,5; AHN 23,4 op 0,5 m).
const P_W = 16.25, P_E = 29.3, P_N = -11.45, P_S = -24.85, P_EAVE = 9.0, P_PITCH = 0.6;
const P_U = (P_W + P_E) / 2, P_RIDGE = P_EAVE + P_PITCH * (P_E - P_W) / 2;
const ST = [24.8, -13.05], ST_HW = 1.65, ST_EAVE = 16.5, ST_GABLE = 19.0, ST_TOP = 24.5;

const sec = ([cx, cy], hx, hy = hx) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
const rad = (d) => (d * Math.PI) / 180;
// Nis in een gevel: middelpunt van de gevel (u, v), buitennormaal 'ang' (graden, 0 = +u), spitse top van 58 graden.
const nicheAt = (u, v, ang, w, z0, z1, d = 0.35) => niche([u, v], ang, 0, 0, w, z0, z1, d);
// Roosvenster of oculus als nis: cirkel met straal r rond zc, de bovenkant (waar het plafond vlakker dan 50 graden zou
// worden) vervangen door een punt, zodat de nis zonder steun print.
const roseAt = (u, v, ang, r, zc, d = 0.35) => {
  const pts = [];
  for (let k = 0; k <= 28; k++) {
    const t = rad(140 + (260 * k) / 28);
    pts.push([r * Math.cos(t), zc + r * Math.sin(t)]);
  }
  pts.push([0, zc + r * (Math.sin(rad(40)) + Math.cos(rad(40)) * Math.tan(rad(50)))]);
  return profileX(pts, -d, 0.4).rotate([0, 0, ang]).translate([u, v, 0]);
};
// Steunbeer (Apeldoorn-stijl): gevelpunt [x, y], buitennormaal 'out' (graden), breedte w, diepte d, schuine top van zo naar zw.
const buttressOut = (p, out, w, d, zw, zo) => buttress(p, out + 90, w, d, zw, zo);
function buttress([x, y], angle, w, d, zw, zo) {
  return profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
}
// Gootlijst langs een gevel van p0 naar p1 met buitennormaal n: 0,25 m uitstekend, ondervlak onder 40 graden.
const eaveLedge = (p0, p1, [nx, ny], z) =>
  Manifold.hull([p0, p1].flatMap(([x, y]) => [
    [x - 0.3 * nx, y - 0.3 * ny, z - 0.3], [x - 0.3 * nx, y - 0.3 * ny, z], [x, y, z - 0.3], [x + 0.25 * nx, y + 0.25 * ny, z],
  ]));
// Kruisende zadeldakjes (wimbergen) boven een vierkant c ± h vanaf z0 tot de nok op z1.
const crossGables = (c, h, z0, z1) => {
  const t = (z1 - z0) / h;
  return Manifold.union([
    roofed(sec(c, h), [[0, -t, z1 + t * c[1]], [0, t, z1 - t * c[1]]]).trimByPlane([0, 0, 1], z0 - 0.5),
    roofed(sec(c, h), [[-t, 0, z1 + t * c[0]], [t, 0, z1 - t * c[0]]]).trimByPlane([0, 0, 1], z0 - 0.5),
  ]);
};

// Absis: vijf zijden van een tienhoek rond (CH_E, 0); hoekpunten op 90, 54, 18, -18, -54, -90 graden.
const apsePts = [90, 54, 18, -18, -54, -90].map((a) => [CH_E + APSE_R * Math.cos(rad(a)), APSE_R * Math.sin(rad(a))]);

const church = [];
// ---------- schip, eerste travee, zijbeuken ----------
church.push(roofed(rect(NAVE_W, TR_U, -NAVE_HW, NAVE_HW), ridgeV(0, RIDGE, PITCH)));
// Aansluiting van het schip op de oostkant van de toren.
church.push(roofed(rect(T_HW - 0.5, NAVE_W + 0.1, -3.4, 3.4), ridgeV(0, RIDGE, PITCH)));
church.push(roofed(rect(WB_W, WB_E, -WB_HW, WB_HW), ridgeU(WB_U, WB_RIDGE, WB_PITCH)));
const aisleT = (AISLE_HI - AISLE_LO) / (AISLE_HW - NAVE_HW);
church.push(roofed(rect(WB_E - 0.5, NAVE_E + 0.5, 0, AISLE_HW), [[0, -aisleT, AISLE_HI + aisleT * NAVE_HW]]));
church.push(roofed(rect(WB_E - 0.5, NAVE_E + 0.5, -AISLE_HW, 0), [[0, aisleT, AISLE_HI + aisleT * NAVE_HW]]));
// ---------- transept en koor ----------
church.push(roofed(rect(TR_W, TR_E, -TR_HW, TR_HW), ridgeU(TR_U, RIDGE, TR_PITCH)));
church.push(roofed(rect(TR_U, CH_E + 0.01, -NAVE_HW, NAVE_HW), ridgeV(0, RIDGE, PITCH)));
// Absis: dakvlakken per zijde vanaf de goot (helling als het koor), de zijvlakken van het koor lopen door.
const apseRoof = [...ridgeV(0, RIDGE, PITCH)];
for (let k = 0; k < 5; k++) apseRoof.push(facet(apsePts[k], apsePts[k + 1], EAVE, PITCH, [CH_E - 1, 0]));
church.push(roofed([[CH_E - 0.5, -APSE_R], ...apsePts.slice().reverse(), [CH_E - 0.5, APSE_R]].reverse(), apseRoof));
// Kapellen naast het koor en hun lage oostelijke delen.
const chN = (10.0 - 8.0) / (CHAP_N - NAVE_HW), chS = (10.0 - 7.2) / (-CHAP_S - NAVE_HW);
church.push(roofed(rect(TR_E - 0.5, 39.1, 0, CHAP_N), [[0, -chN, 10.0 + chN * NAVE_HW]]));
church.push(roofed(rect(TR_E - 0.5, 39.1, CHAP_S, 0), [[0, chS, 10.0 + chS * NAVE_HW]]));
church.push(roofed(rect(38.9, CHAP_E, 0, CHAP_N), [[-0.5, 0, 6.8 + 0.5 * 38.9], [0, -chN, 10.0 + chN * NAVE_HW]]));
church.push(roofed(rect(38.9, CHAP_E, CHAP_S, 0), [[-0.4, 0, 7.0 + 0.4 * 38.9], [0, chS, 10.0 + chS * NAVE_HW]]));

// ---------- westtoren ----------
church.push(prism(sec([0, 0], T_HW), BASE, T_EAVE));
// Hoeksteunberen: per hoek één naar het westen/oosten en één naar het noorden/zuiden, 0,9 m breed; ze springen per
// geleding terug (+7,0, +14,2, +24,5) en lopen als lisenen door tot de wimbergen.
const PROJ = [[BASE, 0.75], [7.0, 0.75], [7.4, 0.55], [14.2, 0.55], [14.6, 0.35], [24.5, 0.35], [24.8, 0.15], [T_EAVE, 0.15]];
for (const su of [-1, 1]) for (const sv of [-1, 1]) {
  // naar ±u (gevel u = su*T_HW), strook v = sv*(2.0 .. 2.9)
  church.push(loft(PROJ.map(([z, p]) => [z, [[su * (T_HW - 0.2), sv * 2.0], [su * (T_HW + p), sv * 2.0], [su * (T_HW + p), sv * 2.9], [su * (T_HW - 0.2), sv * 2.9]]])));
  // naar ±v, strook u = su*(2.0 .. 2.9)
  church.push(loft(PROJ.map(([z, p]) => [z, [[su * 2.0, sv * (T_HW - 0.2)], [su * 2.0, sv * (T_HW + p)], [su * 2.9, sv * (T_HW + p)], [su * 2.9, sv * (T_HW - 0.2)]]])));
}
// Portaalrisaliet aan de westkant (BAG: westgevel 0,8 m voor de toren) met een wimberg tot +9,1.
church.push(roofed(rect(-T_HW - 0.8, -T_HW + 0.2, -1.7, 1.7), ridgeV(0, 9.1, (9.1 - 6.6) / 1.7)));
// Lijsten tussen de geledingen (+14,2 en +24,5) en onder de wimbergen: 0,15 m met een schuine onderkant.
for (const z of [14.2, 24.5, T_EAVE - 0.05]) church.push(loft([[z - 0.4, sec([0, 0], T_HW)], [z - 0.15, sec([0, 0], T_HW + 0.15)], [z, sec([0, 0], T_HW + 0.15)]]));
// Wimbergen en naaldspits.
church.push(crossGables([0, 0], T_HW, T_EAVE, T_GABLE));
church.push(loft([[T_EAVE - 0.1, oct([0, 0], T_SPIRE)], [T_TOP, tip([0, 0])]]));
// Pinakels op de hoeken, tussen de wimbergen.
for (const su of [-1, 1]) for (const sv of [-1, 1]) church.push(pinnacle([su * 2.55, sv * 2.55], 0.45, T_EAVE - 0.2, 1.6, 1.4));
// Ronde traptoren in de zuidoosthoek tussen toren en eerste travee, kegeldak tot +15,0.
const STAIR = [2.6, -3.75];
church.push(Manifold.cylinder(13.5 - BASE, 1.0, 1.0, 24).translate([STAIR[0], STAIR[1], BASE]));
church.push(Manifold.cylinder(1.6, 1.0, 0.0, 24).translate([STAIR[0], STAIR[1], 13.4]));

// ---------- dakruiter op de kruising ----------
church.push(loft([[RIDGE - 1.5, oct(FL, FL_W)], [FL_LANTERN, oct(FL, FL_W)], [FL_TOP, tip(FL)]]));
// Twee kleine dakkapellen op de dakvlakken van het schip.
for (const s of [-1, 1]) {
  const dpl = rect(17.4, 18.6, s > 0 ? 2.4 : -4.45, s > 0 ? 4.45 : -2.4);
  church.push(roofed(dpl, [...ridgeU(18.0, 16.15, 1.3), [0, 0, 20]]).trimByPlane([0, 0, 1], 13.5));
}

// ---------- traptoren tussen pastorie en zuidtransept ----------
church.push(prism(sec(ST, ST_HW), BASE, ST_EAVE));
church.push(crossGables(ST, ST_HW, ST_EAVE, ST_GABLE));
church.push(loft([[ST_EAVE - 0.1, oct(ST, 2.9)], [ST_TOP, tip(ST)]]));

// ---------- steunberen ----------
// Zijbeuken: tussen de vensters (twee zijbeuktraveeën per travee van het schip).
for (const u of [15.45, 19.1, 22.75]) for (const s of [-1, 1]) church.push(buttressOut([u, s * AISLE_HW], s > 0 ? 90 : 270, 0.9, 0.6, 6.4, 5.8));
// Kopgevels van transept en eerste travee: hoekpijlers met een pinakel.
for (const s of [-1, 1]) for (const u of [TR_W + 0.45, TR_E - 0.45]) {
  church.push(prism(sec([u, s * (TR_HW + 0.15)], 0.5, 0.45), BASE, 14.6));
  church.push(pinnacle([u, s * (TR_HW + 0.15)], 0.45, 14.5, 0.6, 1.6));
}
for (const s of [-1, 1]) for (const u of [WB_W + 0.45, WB_E - 0.45]) church.push(prism(sec([u, s * (WB_HW + 0.15)], 0.45, 0.45), BASE, 8.4));
// Absis: steunberen op de hoeken van de tienhoek, schuine top tot +12,4.
for (const a of [54, 18, -18, -54]) {
  const p = [CH_E + APSE_R * Math.cos(rad(a)), APSE_R * Math.sin(rad(a))];
  church.push(buttressOut(p, a, 0.9, 0.85, 12.4, 11.6));
}
// Plint rondom de kerk tot +1,0.
const plan = Manifold.union([
  prism(rect(WB_W, TR_U, -WB_HW, WB_HW), 0, 1), prism(rect(WB_E, NAVE_E, -AISLE_HW, AISLE_HW), 0, 1),
  prism(rect(TR_W, TR_E, -TR_HW, TR_HW), 0, 1), prism(rect(TR_E - 0.5, CHAP_E, CHAP_S, CHAP_N), 0, 1),
  prism([[CH_E - 0.5, -APSE_R], ...apsePts.slice().reverse(), [CH_E - 0.5, APSE_R]], 0, 1),
]).slice(0.5);
church.push(Manifold.extrude(plan.offset(0.15, "Miter", 2), 1.0 - BASE).translate([0, 0, BASE]));
// Gootlijsten langs schip, transept en koor.
for (const s of [-1, 1]) {
  church.push(eaveLedge([NAVE_W, s * NAVE_HW], [TR_W, s * NAVE_HW], [0, s], EAVE));
  church.push(eaveLedge([TR_E, s * NAVE_HW], [CH_E, s * NAVE_HW], [0, s], EAVE));
  church.push(eaveLedge([WB_E, s * AISLE_HW], [NAVE_E, s * AISLE_HW], [0, s], AISLE_LO));
}
for (const [u, n] of [[TR_W, -1], [TR_E, 1]]) for (const s of [-1, 1]) {
  const v0 = s * (u === TR_W ? AISLE_HW : s > 0 ? CHAP_N : -CHAP_S), v1 = s * TR_HW;
  church.push(eaveLedge([u, v0], [u, v1], [n, 0], 14.2));
}
for (let k = 0; k < 5; k++) {
  const [p0, p1] = [apsePts[k], apsePts[k + 1]];
  const a = rad((90 - 36 * k) - 18);
  church.push(eaveLedge(p0, p1, [Math.cos(a), Math.sin(a)], EAVE));
}

// ---------- nissen: vensters, deuren, rozetten, galmgaten en wijzerplaten ----------
const cuts = [];
// Toren, westgevel: portaal (spitse deur) in het risaliet, roosvenster, galmgaten en wijzerplaten op alle zijden.
cuts.push(nicheAt(-T_HW - 0.8, 0, 180, 1.7, BASE, 3.6, 0.5));
cuts.push(roseAt(-T_HW, 0, 180, 1.3, 11.1));
for (const ang of [0, 90, 180, 270]) {
  const n = [Math.cos(rad(ang)), Math.sin(rad(ang))];
  const t = [-n[1], n[0]];
  for (const s of [-0.62, 0.62]) for (const [z0, z1] of [[15.0, 17.6], [19.6, 21.9]]) {
    if (ang === 0 && z0 < RIDGE) continue; // oostzijde: onder de nok ligt het schip ertegen
    cuts.push(nicheAt(n[0] * T_HW + t[0] * s, n[1] * T_HW + t[1] * s, ang, 0.9, z0, z1, 0.4));
  }
  cuts.push(roseAt(n[0] * T_HW, n[1] * T_HW, ang, 1.15, 26.3));
  // Venster in elke wimberg.
  cuts.push(nicheAt(n[0] * T_HW, n[1] * T_HW, ang, 0.9, T_EAVE + 0.5, T_EAVE + 1.8, 0.4));
}
// Eerste travee: kopgevels met drie lancetvensters en een oculus, deuren in de westgevels.
for (const s of [-1, 1]) {
  const ang = s > 0 ? 90 : 270;
  for (const [du, z1] of [[-1.25, 5.6], [0, 6.3], [1.25, 5.6]]) cuts.push(nicheAt(WB_U + du, s * WB_HW, ang, 0.9, 2.4, z1));
  cuts.push(roseAt(WB_U, s * WB_HW, ang, 0.8, 9.0));
  cuts.push(nicheAt(WB_W, s * 6.9, 180, 1.4, BASE, 2.6, 0.45));
  cuts.push(nicheAt(WB_W, s * 6.9, 180, 0.9, 4.0, 6.0));
}
// Zijbeuken: enkelvoudige lancetten; lichtbeuk: drie lancetten per travee.
for (const s of [-1, 1]) {
  const ang = s > 0 ? 90 : 270;
  for (const u of [13.62, 17.27, 20.92, 24.57]) cuts.push(nicheAt(u, s * AISLE_HW, ang, 1.0, s < 0 && u > 18.4 ? 4.6 : 2.2, 5.6));
  for (const uc of [15.45, 22.75]) for (const du of [-1.2, 0, 1.2]) cuts.push(nicheAt(uc + du, s * NAVE_HW, ang, 0.8, 10.4, du ? 12.2 : 12.6));
  // Grote transeptarmen: vier lancetten met een roosvenster; lancetten in de zijgevels.
  for (const du of [-1.95, -0.65, 0.65, 1.95]) cuts.push(nicheAt(TR_U + du, s * TR_HW, ang, 0.9, 3.4, Math.abs(du) > 1 ? 8.4 : 9.0));
  cuts.push(roseAt(TR_U, s * TR_HW, ang, 1.7, 12.3));
  cuts.push(nicheAt(TR_W, s * 10.35, 180, 1.2, s < 0 ? 4.6 : 3.0, 10.4));
  cuts.push(nicheAt(TR_E, s * 10.35, 0, 1.2, 8.0, 11.6));
  // Koor: twee lancetten in de lichtbeuk boven de kapellen; kapellen: lancet in de buitengevel.
  for (const du of [-0.75, 0.75]) cuts.push(nicheAt(37.85 + du, s * NAVE_HW, ang, 0.8, 10.5, 12.5));
  if (s > 0) cuts.push(nicheAt(37.0, CHAP_N, ang, 1.1, 2.4, 6.0));
}
// Absis: enkelvoudige lancetten in alle vijf zijden.
for (let k = 0; k < 5; k++) {
  const a = 90 - 36 * k - 18;
  const [p0, p1] = [apsePts[k], apsePts[k + 1]];
  cuts.push(nicheAt((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, a, 1.1, k === 1 || k === 2 ? 4.4 : 6.6, 11.0));
}
// Traptoren: smalle vensters.
for (const ang of [90, 180, 270]) {
  const n = [Math.cos(rad(ang)), Math.sin(rad(ang))];
  cuts.push(nicheAt(ST[0] + n[0] * ST_HW, ST[1] + n[1] * ST_HW, ang, 0.9, 13.4, 15.2));
}
const churchSolid = Manifold.union(church).subtract(Manifold.union(cuts));

// ---------- pastorie, gang, zuidvleugel, sacristie ----------
const annex = [];
// Pastorie: schilddak langs v met afgewolfde einden, erker aan de westkant, gootlijst, twee schoorstenen.
annex.push(roofed(rect(P_W, P_E, P_S, P_N), [
  ...ridgeU(P_U, P_RIDGE, P_PITCH),
  [0, 1.5, 11.6 - 1.5 * P_S], [0, -1.5, 11.6 + 1.5 * P_N],
]));
annex.push(prism([[16.4, -20.46], [15.55, -20.9], [15.2, -21.4], [15.2, -22.7], [15.55, -23.2], [16.4, -23.66]], BASE, 7.6));
for (const [p0, p1, n] of [[[P_W, P_N], [P_W, P_S], [-1, 0]], [[P_W, P_S], [P_E, P_S], [0, -1]], [[P_E, P_S], [P_E, P_N], [1, 0]]])
  annex.push(eaveLedge(p0, p1, n, P_EAVE));
for (const v of [-13.2, -23.1]) annex.push(prism(sec([P_U, v], 0.45), 10.0, P_RIDGE + 1.4));
// Serre aan de zuidkant (3D BAG +5,2): glazen dak als laag schilddak.
annex.push(roofed(rect(22.9, 28.0, -28.35, P_S + 0.3), [[0, 0.5, 3.9 + 0.5 * 28.35], [0.5, 0, 3.9 - 0.5 * 22.9], [-0.5, 0, 3.9 + 0.5 * 28.0]]));
// Gang tussen zuidbeuk en pastorie, plat dak +4,0.
annex.push(prism(rect(18.4, TR_W + 0.3, P_N - 0.3, -AISLE_HW + 0.3), BASE, 4.0));
// Lage zuidvleugel langs koor en transept: lessenaarsdak van +7,2 naar +3,2 (3D BAG 7,6 tot 3,0).
const wingT = (7.2 - 3.2) / (16.88 - 9.45);
annex.push(roofed([[32.0, -9.2], [CHAP_E, -9.2], [CHAP_E, -13.61], [40.78, -13.61], [40.78, -16.88], [32.0, -16.88]], [[0, wingT, 7.2 + wingT * 9.45]]));
// Topgevel aan de zuidkant van de vleugel (foto vanuit het zuidoosten; AHN 0,7 m boven het lessenaarsdak): nok langs v +5,0.
annex.push(roofed(rect(35.3, 38.5, -16.88, -12.0), [[-1.12, 0, 5.0 + 1.12 * 36.9], [1.12, 0, 5.0 - 1.12 * 36.9]]));
// Sacristie aan de zuidoostkant: schilddak (goot +2,8, helling 0,9), schoorsteen.
annex.push(roofed(rect(CHAP_E - 1.0, 48.06, -8.06, -1.04), [
  [0, 0.9, 2.8 + 0.9 * 8.06], [0, -0.9, 2.8 - 0.9 * 1.04], [-0.9, 0, 2.8 + 0.9 * 48.06],
]));
annex.push(prism(sec([45.5, -4.55], 0.45), 4.0, 6.9));
// Pastorie: vensters op twee verdiepingen en de voordeur (nissen).
const pcuts = [];
for (const v of [-13.3, -15.6, -17.9]) for (const [z0, z1] of [[1.0, 2.9], [4.4, 6.6]]) pcuts.push(nicheAt(P_W, v, 180, 1.0, z0, z1, 0.3));
pcuts.push(nicheAt(15.2, -22.05, 180, 1.0, 0.2, 2.9, 0.3));
pcuts.push(nicheAt(15.2, -22.05, 180, 1.0, 4.4, 6.4, 0.3));
for (const u of [17.6, 20.4]) for (const [z0, z1] of [[1.0, 2.9], [4.4, 6.6]]) pcuts.push(nicheAt(u, P_S, 270, 1.0, z0, z1, 0.3));
for (const v of [-16.0, -18.7, -21.4, -23.6]) for (const [z0, z1] of [[1.0, 2.9], [4.4, 6.6]]) pcuts.push(nicheAt(P_E, v, 0, 1.0, z0, z1, 0.3));
const annexSolid = Manifold.union(annex).subtract(Manifold.union(pcuts));

let complex = Manifold.union([churchSolid, annexSolid]);
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "St. Vituskerk Blauwhuis",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0683100000292816"],
  plate: false,
  description:
    "Rooms-katholieke St. Vituskerk aan de Vitusdijk in Blauwhuis: driebeukige transeptbasiliek van P.J.H. Cuypers (1868-1871) met westtoren van drie geledingen, hoeksteunberen, portaal met wimberg, roosvenster, galmgaten en wijzerplaten, vier wimbergen en achtkante naaldspits tot +51 m; schip en koor onder één zadeldak (nok +19,3 m), uitgebouwde eerste travee met dwarse zadeldaken, zijbeuken met lessenaarsdaken en steunberen, transept met roosvensters en hoekpinakels, dakruiter met naald op de kruising, kapellen naast het koor, absis met 5/10-sluiting en steunberen; aan de zuidkant de pastorie met traptoren, gang, zuidvleugel en sacristie (zelfde BAG-pand). Oorsprong RD (164841,17; 559515,29) in het hart van de toren op maaiveld (NAP -0,4 m), X-as langs de nok van de toren naar de absis onder 33,9 graden.",
  realWorld: {
    built: "1868-1871 naar ontwerp van P.J.H. Cuypers (30 oktober 1867), ingewijd 15 oktober 1872; toren gerestaureerd 1969-1970, exterieur 1991-1993",
    monument: 515166,
    groundNapM: -0.4,
    towerTopM: T_TOP,
    towerGableTopM: T_GABLE,
    towerEaveM: T_EAVE,
    naveRidgeM: RIDGE,
    naveEaveM: EAVE,
    transeptEaveM: 14.2,
    aisleEaveM: AISLE_LO,
    westBayRidgeM: WB_RIDGE,
    flecheTopM: FL_TOP,
    stairTowerTopM: ST_TOP,
    presbyteryRidgeM: +P_RIDGE.toFixed(2),
    baseM: BASE,
  },
  sources: [
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/515166",
    "https://nl.wikipedia.org/wiki/Sint-Vituskerk_(Blauwhuis)",
    "https://www.wikidata.org/wiki/Q1899825",
    "https://www.openstreetmap.org/way/293329568",
    "https://commons.wikimedia.org/wiki/Category:Saint_Vitus_Church_(Blauwhuis) (o.a. tekeningen 1877; RCE 20424422, 20424418, 20345785; 20180817 Sint Vituskerk Blauwhuis; 2023 Blauhûs, Sint-Fitustsjerke; Vitus-2016)",
    "BAG pand 0683100000292816 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
    "PDOK AHN dsm_05m/dtm_05m en actuele luchtfoto",
  ],
};
// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (steep < 40) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
  }
}

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

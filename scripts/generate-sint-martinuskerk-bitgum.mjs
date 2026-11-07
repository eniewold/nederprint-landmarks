import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-martinuskerk-bitgum");
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


// Sint-Martinuskerk (Bitgum/Beetgum), Buorren 13: zaalkerk van 1669-1672 (op de fundamenten van de middeleeuwse Martinuskerk) met een
// driezijdig gesloten koor onder een steil leien dak met een knik bij de goot, steunberen, rondboogvensters en twee poortjes met fronton
// in de zuidgevel, aan de westkant de zestiende-eeuwse toren met blinde nissen en een ingesnoerde spits van 1862, en ten noorden van de
// toren de consistorie onder een zadeldak. Tegen de noordgevel staat een afdak. Kerk op een terprest (verhoogd kerkhof).
const SLUG = "sint-martinuskerk-bitgum";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van toren naar koor (RD-richting 2,24 graden, uit de BAG-gevels van het schip, die
// op 0,01 graad na evenwijdig lopen, en de nok in het AHN), +v naar het noorden. Oorsprong RD (175024,0; 583459,95) op de as van het
// schip, halverwege tussen de westgevel en het begin van het koor (BAG-gevels u = -12,68 .. 12,6, v = -4,39 .. 4,39), z = 0 op
// maaiveld NAP +5,9 m (laagste AHN-maaiveld langs de voet, west van de toren en bij het koor; de terp loopt naar het zuiden op tot
// +6,7 m).
const AXIS_DEG = 2.24;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [175024.0, 583459.95];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: pad west van de toren 47,36; bij het koor 47,46 .. 47,54, zuid
// 47,50 .. 47,88, noord 47,54 .. 48,08 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 47.36;
const GROUND_SAMPLES = [[17.8, 0], [16.6, 3.6], [16.6, -3.6], [13, -5.2], [0, -5.2], [-8, -5.2], [-15.5, -4.2], [-19.6, 0], [-14, 8.9], [-6, 5.2], [8, 5.2], [13, 5.2]];

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Schip met koor (BAG, het koor symmetrisch gemaakt): rechthoek u = -12,68 .. 12,6, v = -4,39 .. 4,39 en een vijfzijdige sluiting tot
// u = 16,77. Dak: hoofdvlakken met helling 1,52 (56,7 graden; AHN-mediaanprofiel over u = -10 .. 10: 1,51 zuid en 1,52 noord) tot de
// nok +13,3 op de as (AHN 13,25 .. 13,35), en onderaan een flauwere opschieter (helling 0,42) tot de goot +7,3 op 0,46 m buiten de
// gevel (AHN: 7,37 op v = 4,5 .. 4,75). Het koor heeft per zijde dezelfde twee vlakken (AHN langs de as: 1,45 .. 1,52 per meter).
const HALF = 4.39, WEST = -12.68, CHOIR_START = 12.6, EAST = 16.77;
const RIDGE = 13.3, PITCH = 1.52, KICK = 0.42, OVER = 0.46, EAVE_OUT = 7.3;
const MAIN_AT_WALL = RIDGE - PITCH * HALF;
const KICK_AT_WALL = EAVE_OUT + KICK * OVER;
const BODY = [[WEST, -HALF], [CHOIR_START, -HALF], [15.14, -3.44], [EAST, -1.38], [EAST, 1.38], [15.14, 3.44], [CHOIR_START, HALF], [WEST, HALF]];
// Toren (BAG): u = -18,83 .. -12,25, v = -3,33 .. 3,21; onderbouw tot de versnijding op +8,6 (foto), daarboven 0,14 m smaller tot de
// kroonlijst (+19,8 aan de buitenkant; AHN 19,6 .. 20,0 langs de randen). Ingesnoerde spits van 1862: vierkante voet met overstek,
// overgang naar een achtkant van 3,3 m op +21,6 en naald tot +33,5 (AHN-piek 33,8 naast de windvaan 39,5; foto: 12 m boven de goot).
const TC = [-15.54, -0.06], TH = 3.29, TH2 = 3.15, T_SET = 8.6, T_TOP = 19.8, SPIRE_TOP = 33.5;
// Consistorie (BAG): u = -18,6 .. -10,75, v = 3,21 .. 8,25 (zuidkant tegen toren en noordgevel), zadeldak met de nok langs u op v = 5,73,
// +7,0, helling 1,25 (AHN noordzijde), goot +3,85 aan de gevel en 0,3 m overstek; schoorsteen tegen de oostgevel tot +8,5 (AHN 8,2 .. 8,6).
const CO = [-18.6, -10.75, 3.21, 8.25], CO_RIDGE = 7.0, CO_PITCH = 1.25, CO_V = 5.73;
// Afdak tegen de noordgevel tussen de twee steunberen (AHN +3,1 .. 3,5; foto RCE 20029910).
const SHED = [-1.9, 4.9, HALF - 0.1, 6.6];

const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
const offsetPoly = (pts, d) => new CrossSection([ccw(pts)]).offset(d, "Miter").toPolygons()[0];

const solids = [];
// ---------- schip en koor: muren onder de dakvlakken (per gevelzijde een hoofdvlak en een opschieter) ----------
const inside = [0, 0];
const mainPlanes = [], kickPlanes = [];
for (let i = 0; i < BODY.length; i++) {
  const p0 = BODY[i], p1 = BODY[(i + 1) % BODY.length];
  if (p0[0] === WEST && p1[0] === WEST) continue; // westgevel: puntgevel achter de toren
  mainPlanes.push(facet(p0, p1, MAIN_AT_WALL, PITCH, inside));
  kickPlanes.push(facet(p0, p1, KICK_AT_WALL, KICK, inside));
}
// Het dak is het hoogste van de twee: de opschieter ligt alleen langs de goot boven het hoofdvlak.
solids.push(roofed(BODY, mainPlanes), roofed(BODY, kickPlanes));
// Dakvoet over de gootlijst: het dak loopt 0,46 m buiten de gevels door (niet langs de westgevel).
const grown = offsetPoly(BODY, OVER);
const westCut = (s) => s.trimByPlane([1, 0, 0], WEST);
solids.push(westCut(roofed(grown, kickPlanes).trimByPlane([0, 0, 1], EAVE_OUT - 0.05)));
// Gootlijst: onderkant 55 graden van de gevel (onder het hoofddakvlak) naar de dakvoet.
solids.push(westCut(Manifold.hull([...BODY.map(([x, y]) => [x, y, MAIN_AT_WALL - 0.1]), ...grown.map(([x, y]) => [x, y, EAVE_OUT - 0.05]), ...grown.map(([x, y]) => [x, y, EAVE_OUT])])));
// Plint van 0,08 m tot +0,6.
solids.push(westCut(Manifold.hull([...offsetPoly(BODY, 0.08).flatMap(([x, y]) => [[x, y, BASE], [x, y, 0.55]]), ...BODY.map(([x, y]) => [x, y, 0.65])])));
// Steunberen: 0,9 m breed, 0,75 m diep, voorkant tot +3,5, dan schuin terug tot de gevel op +6,2 (zuid vier, noord drie).
const buttress = (u, sv) => {
  const w = 0.45, d = 0.75;
  const pts = [];
  for (const du of [-w, w]) pts.push([u + du, sv * (HALF - 0.1), BASE], [u + du, sv * (HALF + d), BASE], [u + du, sv * (HALF + d), 3.5], [u + du, sv * (HALF - 0.1), 6.2]);
  return Manifold.hull(pts);
};
for (const u of [-11.25, -2.25, 5.35, 12.25]) solids.push(buttress(u, -1));
for (const u of [-2.25, 5.35, 12.25]) solids.push(buttress(u, 1));
// Poortjes in de zuidgevel (1669): omlijsting met pilasters en fronton, 2,0 m breed, 0,25 m uit de gevel.
const portal = (u) => {
  const prof = [[-0.1, BASE], [0.25, BASE], [0.25, 3.3], [0.0, 3.55], [-0.1, 3.55]];
  const top = [[-0.1, 4.35], [0.0, 4.35]];
  const pts = [];
  for (const [d, z] of prof) for (const du of [-1.0, 1.0]) pts.push([u + du, -(HALF + d), z]);
  for (const [d, z] of top) pts.push([u, -(HALF + d), z]);
  return Manifold.hull(pts);
};
solids.push(portal(-9.65), portal(8.95));
// ---------- toren: plint, onderbouw, versnijding, schacht, band onder de klokkenverdieping, kroonlijst en spits ----------
const tsq = (h) => rectSec(TC, h, h);
solids.push(prism(tsq(TH), BASE, T_SET));
solids.push(loft([[BASE, tsq(TH + 0.16)], [1.0, tsq(TH + 0.16)], [1.16, tsq(TH)]]));
solids.push(loft([[T_SET - 0.01, tsq(TH)], [T_SET + 0.15, tsq(TH2)]]));
solids.push(prism(tsq(TH2), T_SET, T_TOP - 0.55));
solids.push(loft([[16.8, tsq(TH2)], [16.95, tsq(TH2 + 0.1)], [17.05, tsq(TH2 + 0.1)], [17.06, tsq(TH2)]]));
solids.push(loft([[T_TOP - 0.6, tsq(TH2)], [T_TOP - 0.05, tsq(TH2 + 0.35)], [T_TOP, tsq(TH2 + 0.35)]]));
solids.push(loft([[T_TOP - 0.05, tsq(TH2 + 0.35)], [20.6, tsq(2.7)], [21.6, oct(TC, 3.3)], [SPIRE_TOP, tip(TC)]]));
// ---------- consistorie: zadeldak met overstek aan de noordkant, schoorsteen ----------
const CO_POLY = [[CO[0], CO[2]], [-12.28, CO[2]], [-12.28, HALF], [CO[1], HALF], [CO[1], CO[3]], [CO[0], CO[3]]];
const coPlanes = ridgeV(CO_V, CO_RIDGE, CO_PITCH);
solids.push(roofed(CO_POLY, coPlanes));
const coEaveLow = CO_RIDGE - CO_PITCH * (CO[3] + 0.3 - CO_V);
solids.push(roofed(rect(CO[0], CO[1], CO_V, CO[3] + 0.3), coPlanes).trimByPlane([0, 0, 1], coEaveLow));
solids.push(loft([[coEaveLow - 0.35, rect(CO[0], CO[1], CO_V, CO[3])], [coEaveLow, rect(CO[0], CO[1], CO_V, CO[3] + 0.3)], [coEaveLow + 0.05, rect(CO[0], CO[1], CO_V, CO[3] + 0.3)]]));
solids.push(prism(rect(-11.6, -10.75, CO_V - 0.45, CO_V + 0.45), 5.5, 8.5));
// ---------- afdak tegen de noordgevel ----------
solids.push(roofed(rect(...SHED), [[0, -0.2, 3.5 + 0.2 * HALF]]));

// ---------- nissen: vensters, deuren, poorten, blinde nissen en galmgaten ----------
const cuts = [];
// Rondboogvensters in de zuidgevel (zes) en het westelijke venster in de noordgevel; 1,4 m breed van +3,3 tot de top op +6,42.
for (const u of [-7.85, -4.05, -0.25, 3.55, 7.15, 10.75]) cuts.push(niche([0, 0], 270, HALF, u, 1.4, 3.3, 5.3, 0.4));
cuts.push(niche([0, 0], 90, HALF, 9.6, 1.4, 3.3, 5.3, 0.4));
// Deuren in de poortjes.
for (const u of [-9.65, 8.95]) cuts.push(niche([0, 0], 270, HALF + 0.25, u, 1.1, 0.0, 2.35, 0.55));
// Toren: westdeur in een spitsboognis met venster erboven.
cuts.push(niche(TC, 180, TH, 0, 2.1, 0.0, 3.2, 0.2));
cuts.push(niche(TC, 180, TH, 0, 1.3, 0.0, 2.3, 0.5));
cuts.push(niche(TC, 180, TH, 0, 0.7, 2.95, 3.55, 0.4));
// Twee rijen van vier hoge blinde nissen (paarsgewijs) en de klokkenverdieping met vijf bogen per zijde, waarvan de middelste drie
// galmgaten (dieper); de onderste rij niet aan de oostkant (achter het dak van het schip).
const PAIRS = [-1.75, -0.85, 0.85, 1.75];
for (const ang of [0, 90, 180, 270]) {
  for (const s of PAIRS) {
    if (ang !== 0) cuts.push(niche(TC, ang, TH2, s, 0.75, 10.2, 12.9, 0.3));
    cuts.push(niche(TC, ang, TH2, s, 0.75, 14.0, 15.85, 0.3));
  }
  for (const [s, w, d] of [[-2.3, 0.7, 0.3], [-1.25, 0.9, 0.5], [0, 1.0, 0.5], [1.25, 0.9, 0.5], [2.3, 0.7, 0.3]]) {
    cuts.push(niche(TC, ang, TH2, s, w, 17.45, 18.35, d));
  }
}
// Consistorie: twee vensters in de westgevel, deur in de oostgevel.
// Rechte vensters en deur met een steile latei (0,6 x breedte hoog, 50 graden) zodat de nis zonder steun print.
const box = ([cx, cy], ang, a, s, w, z0, z1, d) => profileX([[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 0.6 * w], [s - w / 2, z1]], a - d, a + 0.4).rotate([0, 0, ang]).translate([cx, cy, 0]);
const CO_C = [(CO[0] + CO[1]) / 2, CO_V];
for (const s of [-1.4, 1.2]) cuts.push(box(CO_C, 180, (CO[1] - CO[0]) / 2, s, 1.0, 0.8, 2.3, 0.3));
cuts.push(box(CO_C, 0, (CO[1] - CO[0]) / 2, 0.9, 1.0, 0.0, 2.3, 0.3));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Sint-Martinuskerk Bitgum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0083100000001948", "0083100000001963"],
  plate: false,
  description:
    "Sint-Martinuskerk aan de Buorren in Bitgum (Beetgum): zaalkerk van 1669-1672 met driezijdig gesloten koor onder een steil leien dak (nok +13,3 m) met opschieter en gootlijst, steunberen, plint, rondboogvensters en twee poortjes met fronton in de zuidgevel, de zestiende-eeuwse westtoren met plint, versnijding, twee rijen blinde nissen, klokkenverdieping met galmgaten, kroonlijst (+19,8 m) en de ingesnoerde spits van 1862 tot +33,5 m, de consistorie onder een zadeldak met schoorsteen en het afdak tegen de noordgevel. Oorsprong RD (175024,0; 583459,95) op de as van het schip op maaiveld (NAP +5,9 m), X-as langs de nok van toren naar koor onder 2,24 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "toren zestiende eeuw (met blinde nissen; zadeldak in 1862 vervangen door de spits), schip 1669-1672 op de fundamenten van de middeleeuwse kerk, gerestaureerd 1972-1980",
    monument: 28571,
    groundNapM: 5.9,
    naveRidgeM: RIDGE,
    naveEaveM: EAVE_OUT,
    navePitch: PITCH,
    towerCorniceM: T_TOP,
    towerTopM: SPIRE_TOP,
    consistoryRidgeM: CO_RIDGE,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Martinuskerk_(Beetgum)",
    "https://fy.wikipedia.org/wiki/Sint-Martinustsjerke_(Bitgum)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/28571",
    "https://www.wikidata.org/wiki/Q1856364",
    "https://commons.wikimedia.org/wiki/Category:Sint-Martinuskerk,_Bitgum (2023 Bitgum, Sint-Martinustsjerke; Beetgum, kerk foto2 2010-04-17; RCE 20029903, 20029905, 20029907, 20029908, 20029909, 20029910, 20029912, 20029916, 20377598)",
    "BAG pand 0083100000001948 (schip, koor en consistorie) en 0083100000001963 (toren)",
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
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
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

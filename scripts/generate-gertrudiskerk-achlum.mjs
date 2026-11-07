import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "gertrudiskerk-achlum");
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

// Nis met rechte bovenkant (deuren, kleine vensters): het plafond loopt naar binnen schuin af (helling 1,1 : 1),
// zodat er geen vlak plafond overhangt. Zelfde plaatsing als niche().
const rectNiche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.35) => {
  const y0 = s - w / 2, y1 = s + w / 2;
  const pts = [];
  for (const [x, top] of [[a + 0.4, z1], [a, z1], [a - d, z1 - 1.1 * d]]) {
    for (const y of [y0, y1]) pts.push([x, y, z0], [x, y, top]);
  }
  return Manifold.hull(pts).rotate([0, 0, angle]).translate([cx, cy, 0]);
};
// Rond venster als kegelvormige nis langs +u in de gevel u = a: straal r aan de gevel, (r - 1,17 d) achterin,
// zodat de bovenkant van de nis steiler dan 45 graden loopt.
const oculus = (a, v, z, r, d) => {
  const back = r - 1.17 * d, len = d + 0.4;
  const front = back + (len / d) * (r - back);
  return Manifold.cylinder(len, back, front, 48).rotate([0, 90, 0]).translate([a - d, v, z]);
};


// Gertrudiskerk (Achlum), De Terp 1: middeleeuwse zaalkerk op de terp. Schip met romaanse tufstenen muren (12e eeuw),
// eind 15e eeuw verhoogd en van spitsboogvensters voorzien, met een driezijdig gesloten gotisch koor met twee
// steunberen; westtoren met een bakstenen romp, een houten klokkeverdieping uit 1790 en een ingesnoerde achtkante spits;
// tegen de zuidkant van de toren een lage aanbouw onder een lessenaarsdak. Het BAG-bouwjaar 1900 is een fictieve waarde.
const SLUG = "gertrudiskerk-achlum";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok naar het koor (RD-richting -8,5 graden, uit de lange BAG-gevels:
// zuid -8,7, noord -8,3), +v naar het noorden. Oorsprong RD (161401,00; 573478,35) midden in het schip,
// z = 0 op het laagste maaiveld rond de voet (noordwesthoek van de toren, AHN-DTM NAP +4,58 m).
const AXIS_DEG = -8.5;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [161401.0, 573478.35];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 46,16 / 46,05 / 46,04, toren zuid 46,22,
// toren noord 46,18 (pad), schip 46,22 / 46,19 / 46,18 / 46,42, koor 46,17 / 46,31 / 46,35 / 46,24 / 46,22
// (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 46.04;
const GROUND_SAMPLES = [[-17, 0], [-17, -4], [-17, 4], [-13, -6], [-13, 4.5], [-5, -6], [-5, 6], [5, -6], [5, 6], [14, -6], [14, 6], [21.5, 0], [21, -4], [21, 4]];

// ---------- maten (meter boven z = 0, stelsel u/v) ----------
// Schip (BAG): u = -10,3 .. 16,0, v = -4,97 .. 4,97. Zadeldak 52 graden (helling 1,28; AHN-dwarsprofielen u = -8 .. 13:
// zuid 1,29, noord 1,27), nok +13,4 (NAP +17,98); goot aan de gevel +7,06 (foto: muur 6,9 m).
const NAVE_W = -10.3, NAVE_E = 16.0, HALF = 4.97;
const RIDGE = 13.4, PITCH = 1.28;
const EAVE = RIDGE - PITCH * HALF;
// Kroonlijst/goot: 0,25 m uitkragend vanaf +6,45 (45 graden), bovenkant in het dakvlak.
const CORNICE_Z = 6.45, CORNICE_OUT = 0.25;
// Koor: driezijdig gesloten, oostgevel op u = 20,0 tussen v = -2,45 en 2,45, schuine zijden vanaf de schiphoeken op
// u = 16,0 (BAG). Dakvlakken door de goot van elke zijde en het nokeinde op u = 16,5 (AHN: nok daalt vanaf u = 16,5
// met 1,75 per meter naar de oostgevel).
const CHOIR_E = 20.0, CHOIR_HALF = 2.45, APEX_U = 16.5;
// Steunberen op de twee oosthoeken, diagonaal (BAG 0,64 m breed, 1,15 m uit de hoek; verbreed tot 0,9 m), met een
// versnijding op +3,4 .. +3,9 en een schuine afdekking tot onder de goot (foto's RCE 20345398, 2014, 2023).
const BUTTRESS_W = 0.9;
// Toren (BAG): u = -15,53 .. -10,33, v = -2,63 .. 2,93; bakstenen romp tot +13,6 met een lijst, houten
// klokkeverdieping (1790) 0,5 m ingesprongen tot +15,5, kroonlijst tot +16,0, ingesnoerde spits: vierkante voet met
// uitzwaaiende voet tot een achtkant van 4,0 m op +17,2, naald tot +25,2 (AHN: hoogste pixel NAP +28,6 = +24,0 op 0,5 m
// van de top; helling 3,8 per meter straal; spitspunt geschat).
const TOWER = [-12.93, 0.15], T_HU = 2.6, T_HV = 2.78, T_TOP = 13.6;
const BELFRY_IN = 0.5, BELFRY_TOP = 15.5, BELFRY_CORNICE = 16.0, BELFRY_OUT = 0.45;
const KICK_TOP = 17.2, SPIRE_ACROSS = 4.0, SPIRE_TOP = 25.2;
// Lage aanbouw tegen de zuidkant van de toren (BAG): u = -15,1 .. -10,3, v = -4,93 .. -2,63, lessenaarsdak van +3,7
// tegen de toren naar +3,2 aan de zuidgevel (AHN NAP +8,0 .. +7,6).
const ANNEX = [-15.1, -10.3, -4.93, -2.63], ANNEX_HI = 3.7, ANNEX_LO = 3.2;

const solids = [];
// ---------- schip en koor: één plattegrond onder zes dakvlakken ----------
const plan = [
  [NAVE_W, -HALF], [NAVE_E, -HALF], [CHOIR_E, -CHOIR_HALF], [CHOIR_E, CHOIR_HALF], [NAVE_E, HALF], [NAVE_W, HALF],
];
// Vlak door de gootlijn p0-p1 (op hoogte EAVE) en het nokeinde (APEX_U, 0, RIDGE).
const throughApex = (p0, p1) => {
  const [x0, y0] = p0, [x1, y1] = p1;
  const len = Math.hypot(x1 - x0, y1 - y0);
  const dist = Math.abs((x1 - x0) * (0 - y0) - (y1 - y0) * (APEX_U - x0)) / len;
  return facet(p0, p1, EAVE, (RIDGE - EAVE) / dist, [APEX_U, 0]);
};
const roof = [
  ...ridgeV(0, RIDGE, PITCH),
  throughApex([NAVE_E, -HALF], [CHOIR_E, -CHOIR_HALF]),
  throughApex([CHOIR_E, -CHOIR_HALF], [CHOIR_E, CHOIR_HALF]),
  throughApex([CHOIR_E, CHOIR_HALF], [NAVE_E, HALF]),
];
solids.push(roofed(plan, roof));
// Kroonlijst rondom (niet langs de westgevel): 45 graden uitkragend, bovenkant 0,08 m boven het dakvlak.
const planOff = new CrossSection([ccw(plan)]).offset(CORNICE_OUT, "Miter", 2).toPolygons()[0];
const cornice = Manifold.hull([
  ...plan.map(([u, v]) => [u, v, CORNICE_Z]),
  ...planOff.flatMap(([u, v]) => [[u, v, CORNICE_Z + CORNICE_OUT + 0.05], [u, v, 20]]),
]).intersect(prism(rect(NAVE_W, CHOIR_E + 2, -HALF - 2, HALF + 2), 0, 21));
solids.push(roof.reduce((s, [a, b, c]) => cutBelow(s, [a, b, c + 0.08]), cornice));
// Westgevel van het schip: deklijst 0,25 m boven het dakvlak naast de toren.
solids.push(roofed(rect(NAVE_W, NAVE_W + 0.5, -HALF, HALF), ridgeV(0, RIDGE + 0.25, PITCH)));
// Steunberen op de oosthoeken van het koor (diagonaal, profiel als convexe huls).
for (const sgn of [-1, 1]) {
  const corner = [CHOIR_E, sgn * CHOIR_HALF];
  const dir = [1 + 0.549, sgn * 0.835];
  const dl = Math.hypot(...dir);
  const [du, dv] = [dir[0] / dl, dir[1] / dl];
  const [pu, pv] = [-dv, du];
  const stage = (profile) =>
    Manifold.hull(profile.flatMap(([out, z]) => [-BUTTRESS_W / 2, BUTTRESS_W / 2].map((s) => [corner[0] + du * out + pu * s, corner[1] + dv * out + pv * s, z])));
  solids.push(stage([[-0.6, BASE], [1.1, BASE], [1.1, 3.4], [0.6, 3.9], [-0.6, 3.9]]));
  solids.push(stage([[-0.6, 3.4], [0.6, 3.4], [0.6, 5.4], [-0.6, 6.5]]));
}
// ---------- toren: romp met lijst, klokkeverdieping, kroonlijst en ingesnoerde spits ----------
const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
solids.push(prism(rectSec(TOWER, T_HU, T_HV), BASE, T_TOP - 0.3));
// Verbinding toren-schip (BAG laat 3 cm tussen beide): onder de deklijst van de westgevel.
solids.push(roofed(rect(TOWER[0] + T_HU - 0.3, NAVE_W + 0.05, TOWER[1] - T_HV, TOWER[1] + T_HV), [...ridgeV(0, RIDGE + 0.25, PITCH), [0, 0, T_TOP - 0.1]]));
solids.push(loft([[T_TOP - 0.32, rectSec(TOWER, T_HU - 0.01, T_HV - 0.01)], [T_TOP - 0.15, rectSec(TOWER, T_HU + 0.15, T_HV + 0.15)], [T_TOP, rectSec(TOWER, T_HU + 0.15, T_HV + 0.15)]]));
const B_HU = T_HU - BELFRY_IN, B_HV = T_HV - BELFRY_IN;
solids.push(prism(rectSec(TOWER, B_HU, B_HV), T_TOP - 0.05, BELFRY_TOP));
solids.push(loft([
  [BELFRY_TOP - 0.01, rectSec(TOWER, B_HU - 0.02, B_HV - 0.02)],
  [BELFRY_CORNICE, rectSec(TOWER, B_HU + BELFRY_OUT, B_HV + BELFRY_OUT)],
  [KICK_TOP, oct(TOWER, SPIRE_ACROSS)],
  [SPIRE_TOP, tip(TOWER)],
]));
// ---------- aanbouw zuid van de toren (lessenaarsdak) ----------
const annexT = (ANNEX_HI - ANNEX_LO) / (ANNEX[3] - ANNEX[2]);
solids.push(roofed(rect(ANNEX[0], ANNEX[1] + 0.3, ANNEX[2], ANNEX[3] + 0.3), [[0, annexT, ANNEX_HI - annexT * ANNEX[3]]]));
// ---------- plint rondom (0,15 m buiten de gevels tot +0,6) ----------
const footprint = new CrossSection([ccw(plan)])
  .add(new CrossSection([ccw(rectSec(TOWER, T_HU, T_HV))]))
  .add(new CrossSection([ccw(rect(ANNEX[0], ANNEX[1] + 0.3, ANNEX[2], ANNEX[3] + 0.3))]));
solids.push(Manifold.extrude(footprint.offset(0.15, "Miter", 2), 0.6 - BASE).translate([0, 0, BASE]));

// ---------- nissen: vensters, deuren en galmgaten ----------
const cuts = [];
const O0 = [0, 0];
// Noordgevel: vier spitsboogvensters (1,3 m, borstwering +2,6, punt +6,35), het westelijke boven de noordingang
// (foto RCE 20004419: u = 13,9 / 9,7 / 0,0 / -7,2).
for (const u of [13.9, 9.7, 0.0]) cuts.push(niche(O0, 90, HALF, -u, 1.3, 2.6, 5.3, 0.35));
cuts.push(niche(O0, 90, HALF, 7.2, 1.1, 3.7, 5.45, 0.35));
cuts.push(rectNiche(O0, 90, HALF, 7.2, 1.4, 0, 2.3, 0.35));
// Zuidgevel: zes spitsboogvensters (foto 2018 vanuit het zuidoosten), regelmatig verdeeld.
for (const u of [14.0, 9.8, 5.6, 1.4, -2.8, -7.0]) cuts.push(niche(O0, 270, HALF, u, 1.3, 2.6, 5.3, 0.35));
// Oostgevel koor: één spitsboogvenster (1,5 m); de schuine koorzijden zijn blind.
cuts.push(niche(O0, 0, CHOIR_E, 0, 1.5, 2.4, 5.0, 0.35));
// Toren westgevel: spitsboogvenster beneden, smal venstertje boven; noord- en zuidgevel een smal venstertje.
cuts.push(niche(TOWER, 180, T_HU, 0, 1.0, 2.8, 4.6, 0.3));
cuts.push(rectNiche(TOWER, 180, T_HU, 0, 0.5, 9.0, 10.2, 0.3));
for (const ang of [90, 270]) cuts.push(rectNiche(TOWER, ang, T_HV, 0, 0.5, 9.0, 10.2, 0.3));
// Klokkeverdieping: twee galmgaten per zijde.
for (const ang of [0, 180]) for (const s of [-0.85, 0.85]) cuts.push(niche(TOWER, ang, B_HU, s, 0.7, 14.0, 14.75, 0.3));
for (const ang of [90, 270]) for (const s of [-0.85, 0.85]) cuts.push(niche(TOWER, ang, B_HV, s, 0.7, 14.0, 14.75, 0.3));
// Aanbouw: deur in de zuidgevel.
cuts.push(rectNiche(O0, 270, -ANNEX[2], -12.7, 1.0, 0, 2.2, 0.3));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Gertrudiskerk Achlum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0070100000325796"],
  plate: false,
  description:
    "Gertrudiskerk op de terp van Achlum: middeleeuwse zaalkerk (schip 12e eeuw, eind 15e eeuw verhoogd) met spitsboogvensters en een zadeldak van 52 graden (nok +13,4 m), een driezijdig gesloten gotisch koor met twee diagonale steunberen onder een meegaand schilddak, en een westtoren met bakstenen romp tot +13,6 m, houten klokkeverdieping (1790) met galmgaten en een ingesnoerde achtkante spits tot +25,2 m, plus een lage aanbouw onder lessenaarsdak tegen de zuidkant van de toren. Oorsprong RD (161401,00; 573478,35) midden in het schip op het laagste maaiveld (NAP +4,58 m), X-as langs de nok naar het koor onder -8,5 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "schip 12e eeuw (tufsteen), verhoogd en met koor en toren eind 15e eeuw, houten klokkeverdieping en spits 1790, restauraties 1995 en 2012",
    monument: 15822,
    groundNapM: 4.58,
    ridgeM: RIDGE,
    eaveM: +EAVE.toFixed(2),
    roofPitchDeg: +((Math.atan(PITCH) * 180) / Math.PI).toFixed(1),
    towerBodyTopM: T_TOP,
    belfryTopM: BELFRY_CORNICE,
    spireTopM: SPIRE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Gertrudiskerk_(Achlum)",
    "https://reliwiki.nl/index.php/Achlum,_De_Terp_1_-_Gertrudiskerk",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/15822",
    "https://www.wikidata.org/wiki/Q3915835",
    "https://commons.wikimedia.org/wiki/Category:Gertrudiskerk,_Achlum (RCE 20345398, 20004414, 20004419; 20140530 Kerk van Achlum; Gertrudiskerk van Achlum; De Terp 1; 2023 Achlum, Gertrudistsjerke (2), (3))",
    "BAG pand 0070100000325796 (voetafdruk) en 3D BAG",
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

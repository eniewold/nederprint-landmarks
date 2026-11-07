import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "bethelkerk-urk");
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

// Bethelkerk (Urk), Wijk 3 nr. 3 aan het Wilhelminaplein: zaalkerk uit 1885 (A.T. van Wijngaarden) van zes traveeën
// onder een zadeldak, met de tuitgevel op het noorden, aan de zuidzijde de consistorie-uitbouw van 1867 (twee bouwlagen,
// boven afgeschuinde hoeken, schilddak met de dakruiter van 1910) en een lage aanbouw onder schilddak aan de zuidwestkant.
const SLUG = "bethelkerk-urk";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van de consistorie naar de voorgevel (RD-richting 77,6 graden, uit de
// lange BAG-gevels, die op deze hoek binnen 3 cm recht liggen), +v naar het westen. Oorsprong RD (169076,12; 519359,47) in
// het midden van de zaal, z = 0 op het laagste maaiveld rond de voet (zuidkant, NAP +6,45 m; voorgevel NAP +7,0 m).
const AXIS_DEG = 77.6;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [169076.12, 519359.47];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: zuid 48,95 / 48,88 / 49,06, oost 49,17 / 49,27 /
// 49,35, west 49,42 / 49,45, noord 49,41 / 49,38 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 48.88;
const GROUND_SAMPLES = [[-27, 0], [-26.5, -6], [-26.5, 8], [-20, -7.5], [-10, -12], [5, -12], [5, 12], [-10, 12], [15.5, -6], [15.5, 6]];
// Het maaiveld loopt van NAP +6,45 (zuid) op naar +7,0 (voorgevel): openingen aan de noordkant liggen 0,45 m hoger.
const FRONT_LIFT = 0.45;

// ---------- maten (meter boven z = 0, stelsel u/v) ----------
// Zaal (BAG): u = -14,0 .. 13,9, v = -10,34 .. 10,34; lisenen van 1,0 m die 0,22 m uitspringen om de 4,55 m,
// hoekpenanten van 1 x 1 m.
const HALL_S = -14.0, HALL_N = 13.9, HALL_W = 10.34;
const PILASTERS = [-9.07, -4.6, -0.03, 4.53, 9.07];
// Zadeldak: nok +15,4 (NAP +21,85) op v = 0, helling 0,554 (29 graden) aan beide zijden (AHN-DSM dwarsprofielen
// u = -10 .. 10: 0,552 en 0,555; 3D BAG-nok NAP +21,9); goot aan de gevel +9,67.
const RIDGE = 15.4, PITCH = 0.554;
const EAVE = RIDGE - PITCH * HALL_W;
// Kroonlijst: 0,45 m uitkragend van +8,95 tot +9,45 (48 graden). Topgevels 0,35 m boven het dakvlak.
const CORNICE_Z = 8.95, CORNICE_OUT = 0.45, COPING = 0.35;
// Hoekpenanten tot +10,4 (foto voorgevel: 9,9 m boven het plein op NAP +7,0) met een piramidekapje.
const PIER_TOP = 10.4;
// Consistorie (BAG): u = -25,25 .. -14,0, v = -5,75 .. 5,95; begane grond rechthoekig tot +5,5, verdieping met
// afgeschuinde zuidhoeken (benen 2,0 m); de hoekdriehoeken eronder lopen af naar +3,9 op de hoek (foto RCE 20409919).
const CON_S = -25.25, CON_E = -5.75, CON_W = 5.95, CON_V = (CON_E + CON_W) / 2, CHAMFER = 2.0;
const STOREY = 5.5, CORNER_TIP = 3.9;
// Schilddak: nok +12,85 (NAP +19,35) op v = 0,1, helling 0,65 (33 graden; AHN), goot +9,05, kroonlijst vanaf +8,6.
const CON_RIDGE = 12.85, CON_PITCH = 0.65;
const CON_EAVE = CON_RIDGE - CON_PITCH * (CON_W - CON_V);
// Dakruiter (1910): vierkante onderbouw 2,4 m tot +16,05 met galmgaten, kroonlijst, achtkante spits tot +21,45
// (AHN-top van de spits NAP +27,1 op de dakruiter; verhouding onderbouw/spits van de foto).
const DR = [-21.1, 0.1], DR_HALF = 1.2, DR_TOP = 16.05, SPIRE_TOP = 21.45;
// Lage aanbouw zuidwest (BAG): u = -24,9 .. -16,0, v = 5,95 .. 10,36, schilddak 45 graden met nok +5,15 (AHN NAP +11,7);
// tussenlid u = -16,0 .. -14,0 met plat dak +3,05 (AHN NAP +9,5).
const ANNEX = [-24.9, -16.0, CON_W, 10.36], ANNEX_EAVE = 2.95, ANNEX_PITCH = 1.0, LINK_TOP = 3.05;

const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
const solids = [];
// ---------- zaal: rechthoek onder twee dakvlakken ----------
const hallPoly = rect(HALL_S, HALL_N, -HALL_W, HALL_W);
const hallRoof = ridgeV(0, RIDGE, PITCH);
solids.push(roofed(hallPoly, hallRoof));
// Kroonlijst langs de zijgevels: 45 graden uitkragend, bovenkant in het dakvlak (+0,08 m dik boven de dakrand).
const corniceHull = Manifold.hull([
  ...rect(HALL_S, HALL_N, -HALL_W, HALL_W).map(([u, v]) => [u, v, CORNICE_Z]),
  ...rect(HALL_S, HALL_N, -HALL_W - CORNICE_OUT, HALL_W + CORNICE_OUT).flatMap(([u, v]) => [[u, v, CORNICE_Z + CORNICE_OUT + 0.05], [u, v, 20]]),
]);
solids.push(hallRoof.reduce((s, [a, b, c]) => cutBelow(s, [a, b, c + 0.08]), corniceHull));
// Topgevels voor en achter: muurdikte 0,6 m, 0,35 m boven het dakvlak (deklijst), met een blok op de top.
solids.push(roofed(rect(HALL_N - 0.6, HALL_N, -HALL_W, HALL_W), hallRoof.map(([a, b, c]) => [a, b, c + COPING])));
solids.push(roofed(rect(HALL_S, HALL_S + 0.6, -HALL_W, HALL_W), hallRoof.map(([a, b, c]) => [a, b, c + COPING])));
solids.push(prism(rect(HALL_N - 0.6, HALL_N, -0.55, 0.55), RIDGE, 16.4));
solids.push(prism(rect(HALL_S, HALL_S + 0.6, -0.45, 0.45), RIDGE, 16.05));
// Lisenen op de zijgevels tot onder de kroonlijst.
for (const u of PILASTERS) for (const sgn of [-1, 1]) {
  solids.push(prism(rect(u - 0.5, u + 0.5, sgn > 0 ? HALL_W - 0.2 : -HALL_W - 0.22, sgn > 0 ? HALL_W + 0.22 : -HALL_W + 0.2), BASE, CORNICE_Z));
}
// Hoekpenanten (1 x 1 m, 0,25 m buiten beide gevels) met een piramidekapje.
for (const [pu, pv] of [[HALL_N - 0.75, -HALL_W - 0.25], [HALL_N - 0.75, HALL_W - 0.75], [HALL_S - 0.25, -HALL_W - 0.25], [HALL_S - 0.25, HALL_W - 0.75]]) {
  const c = [pu + 0.5, pv + 0.5];
  solids.push(loft([[BASE, sq(c, 0.5)], [PIER_TOP, sq(c, 0.5)], [PIER_TOP + 0.45, tip(c)]]));
}
// ---------- consistorie (1867): rechthoekige begane grond, verdieping met afgeschuinde zuidhoeken, schilddak ----------
const conUpper = [
  [CON_S + CHAMFER, CON_E], [HALL_S + 0.3, CON_E], [HALL_S + 0.3, CON_W], [CON_S + CHAMFER, CON_W],
  [CON_S, CON_W - CHAMFER], [CON_S, CON_E + CHAMFER],
];
const CON_IN = [-20, CON_V];
const conRoof = [
  ...ridgeV(CON_V, CON_RIDGE, CON_PITCH),
  facet([CON_S, CON_E + CHAMFER], [CON_S, CON_W - CHAMFER], CON_EAVE, CON_PITCH, CON_IN),
  facet([CON_S, CON_E + CHAMFER], [CON_S + CHAMFER, CON_E], CON_EAVE, CON_PITCH, CON_IN),
  facet([CON_S, CON_W - CHAMFER], [CON_S + CHAMFER, CON_W], CON_EAVE, CON_PITCH, CON_IN),
];
solids.push(roofed(conUpper, conRoof));
// Begane grond: de hoeken onder de afschuiningen met een dakje dat van +5,5 naar +3,9 op de hoek afloopt.
const TRI_T = (STOREY - CORNER_TIP) / (CHAMFER / Math.SQRT2);
solids.push(roofed(rect(CON_S, HALL_S + 0.3, CON_E, CON_W), [
  [0, 0, STOREY],
  facet([CON_S, CON_E + CHAMFER], [CON_S + CHAMFER, CON_E], STOREY, TRI_T, CON_IN),
  facet([CON_S, CON_W - CHAMFER], [CON_S + CHAMFER, CON_W], STOREY, TRI_T, CON_IN),
]));
// Kroonlijst rondom de verdieping: 0,35 m uitkragend tussen +8,6 en +9,0 (49 graden), bovenkant in de dakvlakken.
const conOff = new CrossSection([ccw(conUpper)]).offset(0.35, "Miter", 2).toPolygons()[0];
const conCornice = Manifold.hull([
  ...conUpper.map(([u, v]) => [u, v, 8.6]),
  ...conOff.flatMap(([u, v]) => [[u, v, 9.0], [u, v, 20]]),
]).intersect(prism(rect(CON_S - 1, HALL_S, CON_E - 1, CON_W + 1), 8, 21));
solids.push(conRoof.reduce((s, [a, b, c]) => cutBelow(s, [a, b, c + 0.08]), conCornice));
// Lisene op de oostgevel (BAG-uitsprong u = -16,97 .. -16,68), verbreed tot 0,4 m.
solids.push(prism(rect(-17.03, -16.63, CON_E - 0.28, CON_E + 0.2), BASE, 8.6));
// ---------- dakruiter: onderbouw met kroonlijst, achtkante spits ----------
solids.push(loft([
  [10.5, sq(DR, DR_HALF)], [DR_TOP - 0.5, sq(DR, DR_HALF)], [DR_TOP - 0.25, sq(DR, DR_HALF + 0.2)], [DR_TOP, sq(DR, DR_HALF + 0.2)],
]));
solids.push(loft([[DR_TOP - 0.05, oct(DR, 2.5)], [DR_TOP + 0.5, oct(DR, 1.9)], [SPIRE_TOP, tip(DR)]]));
// ---------- lage aanbouw zuidwest (schilddak) en tussenlid ----------
const annexPoly = rect(ANNEX[0], ANNEX[1], ANNEX[2] - 0.2, ANNEX[3]);
const ANNEX_IN = [(ANNEX[0] + ANNEX[1]) / 2, (ANNEX[2] + ANNEX[3]) / 2];
solids.push(roofed(annexPoly, [
  facet([ANNEX[0], ANNEX[2]], [ANNEX[0], ANNEX[3]], ANNEX_EAVE, ANNEX_PITCH, ANNEX_IN),
  facet([ANNEX[1], ANNEX[2]], [ANNEX[1], ANNEX[3]], ANNEX_EAVE, ANNEX_PITCH, ANNEX_IN),
  facet([ANNEX[0], ANNEX[3]], [ANNEX[1], ANNEX[3]], ANNEX_EAVE, ANNEX_PITCH, ANNEX_IN),
  facet([ANNEX[0], ANNEX[2]], [ANNEX[1], ANNEX[2]], ANNEX_EAVE, ANNEX_PITCH, ANNEX_IN),
]));
solids.push(prism(rect(ANNEX[1] - 0.2, HALL_S + 0.3, ANNEX[2] - 0.2, ANNEX[3]), BASE, LINK_TOP));
// ---------- plint rondom (0,15 m buiten de gevels tot +0,9) ----------
const plan = new CrossSection([ccw(hallPoly)])
  .add(new CrossSection([ccw(rect(CON_S, HALL_S + 0.3, CON_E, CON_W))]))
  .add(new CrossSection([ccw(rect(ANNEX[0], HALL_S + 0.3, ANNEX[2], ANNEX[3]))]));
solids.push(Manifold.extrude(plan.offset(0.15, "Miter", 2), 0.9 - BASE).translate([0, 0, BASE]));

// ---------- nissen: vensters, deuren, rondvenster en galmgaten ----------
const cuts = [];
const O0 = [0, 0];
// Zijgevels zaal: zes traveeën met een spitsboogvenster (1,9 m breed, van +2,8 tot de punt op +8,1).
const BAYS = [-11.36, -6.84, -2.32, 2.25, 6.8, 11.34];
for (const u of BAYS) {
  cuts.push(niche(O0, 270, HALL_W, u, 1.9, 2.8, 6.6, 0.35));
  cuts.push(niche(O0, 90, HALL_W, -u, 1.9, 2.8, 6.6, 0.35));
}
// Achtergevel zaal: een venster als in de zijgevels oostelijk van de consistorie (het westelijke zit achter de aanbouw).
cuts.push(niche(O0, 180, -HALL_S, 8.05, 1.9, 2.8, 6.6, 0.35));
// Voorgevel (tuitgevel op het noorden): drie deuren, twee groepjes van drie venstertjes en het rondvenster.
for (const v of [-7.65, 0, 7.65]) cuts.push(rectNiche(O0, 0, HALL_N, v, 2.0, FRONT_LIFT + 0.15, FRONT_LIFT + 3.0, 0.4));
for (const v0 of [-7.65, 7.65]) for (const dv of [-1.0, 0, 1.0]) cuts.push(rectNiche(O0, 0, HALL_N, v0 + dv, 0.65, FRONT_LIFT + 4.7, FRONT_LIFT + 5.8, 0.3));
cuts.push(oculus(HALL_N, 0, FRONT_LIFT + 8.5, 2.0, 0.3));
// Consistorie zuidgevel: drie spitsboogvensters beneden, drie smallere boven; een venster in elke afschuining.
for (const v of [-2.9, CON_V, 3.1]) {
  cuts.push(niche(O0, 180, -CON_S, -v, 1.2, 0.9, 3.3, 0.35));
  cuts.push(niche(O0, 180, -CON_S, -v, 0.9, 6.0, 7.6, 0.3));
}
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
cuts.push(niche(mid([CON_S, CON_E + CHAMFER], [CON_S + CHAMFER, CON_E]), 225, 0, 0, 0.9, 6.0, 7.6, 0.3));
cuts.push(niche(mid([CON_S, CON_W - CHAMFER], [CON_S + CHAMFER, CON_W]), 135, 0, 0, 0.9, 6.0, 7.6, 0.3));
// Consistorie oostgevel: ingang in de hoektravee, drie grote vensters in het gepleisterde deel, een venster achter de
// lisene; boven twee paren en een enkel venster. Westgevel boven gespiegeld (beneden achter de aanbouw).
cuts.push(rectNiche(O0, 270, -CON_E, -22.6, 1.8, 0, 3.1, 0.4));
for (const u of [-20.75, -19.1, -17.45]) cuts.push(niche(O0, 270, -CON_E, u, 1.4, 1.0, 3.4, 0.35));
cuts.push(niche(O0, 270, -CON_E, -15.35, 1.2, 1.0, 3.4, 0.35));
for (const u of [-22.1, -21.15, -19.25, -18.3, -15.35]) {
  cuts.push(niche(O0, 270, -CON_E, u, 0.75, 6.0, 7.6, 0.3));
  cuts.push(niche(O0, 90, CON_W, -u, 0.75, 6.0, 7.6, 0.3));
}
// Dakruiter: twee galmgaten per zijde.
for (const ang of [0, 90, 180, 270]) for (const s of [-0.5, 0.5]) cuts.push(niche(DR, ang, DR_HALF, s, 0.6, 13.2, 14.6, 0.3));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Bethelkerk Urk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0184100000002606"],
  plate: false,
  description:
    "Bethelkerk aan het Wilhelminaplein in Urk: zaalkerk uit 1885 (A.T. van Wijngaarden) van zes traveeën met lisenen, hoekpenanten, spitsboogvensters en een kroonlijst onder een zadeldak (nok +15,4 m), de tuitgevel op het noorden met drie deuren, venstertjes en rondvenster, aan de zuidkant de consistorie van 1867 (twee bouwlagen, afgeschuinde hoeken boven, schilddak) met de dakruiter van 1910 (achtkante spits tot +21,45 m) en een lage aanbouw onder schilddak. Oorsprong RD (169076,12; 519359,47) midden in de zaal op het laagste maaiveld (NAP +6,45 m), X-as langs de nok naar de voorgevel onder 77,6 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "consistorie 1867, zaal 1885 (A.T. van Wijngaarden) op de plaats van de kerk van 1851, dakruiter 1910, restauraties 1951, 1981 en 2000",
    monument: 515906,
    groundNapM: 6.45,
    hallRidgeM: RIDGE,
    hallEaveM: +EAVE.toFixed(2),
    hallPitchDeg: +((Math.atan(PITCH) * 180) / Math.PI).toFixed(1),
    consistoryRidgeM: CON_RIDGE,
    consistoryEaveM: +CON_EAVE.toFixed(2),
    belfryTopM: DR_TOP,
    spireTopM: SPIRE_TOP,
    annexRidgeM: +(ANNEX_EAVE + ANNEX_PITCH * (ANNEX[3] - ANNEX[2]) / 2).toFixed(2),
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Bethelkerk_(Urk)",
    "https://reliwiki.nl/index.php/Urk,_Wijk_3_-_3_-_Bethelkerk",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/515906",
    "https://commons.wikimedia.org/wiki/Category:Bethelkerk_(Urk) (RCE 20409916, 20409919; Bethelkerk Urk 2018; Bethelkerk.jpg; Urk-Bethelkerk.jpg; Urk Bethelkerk -006, -008, -026; Urk 2021 2)",
    "BAG pand 0184100000002606 (voetafdruk) en 3D BAG LoD2.2 (nokhoogte)",
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

import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-almelo");
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
// Steunbeer tegen een gevel die naar -v kijkt (zuid): breedte w, diepte d, bovenkant zw tegen de muur en zo aan de buitenkant.
// angle draait de gevel: 0 zuid, 90 oost, 180 noord, 270 west; [x, y] is het punt in de gevel.
const buttress = ([x, y], angle, w, d, zw, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
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



const SLUG = "grote-kerk-almelo";
const BASE = -0.4;
// Stelsel: oorsprong op het hart van de viering (maaiveld NAP +12,1 m), +u langs de nok van het
// westelijke kruisarm naar het koor (RD-richting 6,8 graden), +v naar het noorden van de kerk.
// Gemeten aan de BAG-contour (gevels evenwijdig onder 6,8 graden) en de nokken in het AHN-DSM.
const ORIGIN = [242136.11, 486377.5];
const AXIS_DEG = 6.8;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 55,24, noord 55,36, zuid 55,15,
// zuidwest 55,38, noordwest 55,45, oost 55,25 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 55.15;
const GROUND_SAMPLES = [[-27, 0], [0, 19.5], [0, -19], [-12, -9], [-12, 9], [23, 0]];

// ---------- maten (meter boven maaiveld) ----------
// 1738-kruisarmen: nok +20,0 (AHN en 3D BAG), dakhelling 1,30 (52 graden) op alle vlakken, ook de schilden.
const RIDGE = 20.0, PITCH = 1.3;
const ARM_U = 6.38, ARM_V = 16.49; // noord- en zuidarm (BAG)
const WEST_V = 6.55, WEST_END = -16.4; // westarm tot de toren (BAG)
// Laatgotisch koor van 1493: steiler en hoger dak (nok +21,7, helling 1,69), driezijdige sluiting.
const CHOIR_V = 5.5, CHOIR_W0 = 5.9, CHOIR_EAVE = 12.4, CHOIR_RIDGE = 21.7, CHOIR_PITCH = 1.69;
const APSE = [[17.4, -5.5], [20.65, -2.2], [20.65, 2.2], [17.4, 5.5]];
const CHOIR_RIDGE_END = 15.9; // nokeinde boven de sluiting (3D BAG 15,8)
// Toren 1738: twee geledingen, balustrade, achtkante lantaarn en koepelspits van 1777.
const TC = [-20.06, 0.04];
const T_LOW = [-23.72, -16.4, -4.07, 4.07]; // onderste geleding met hoekpilasters (BAG)
const T_CORNICE1 = 10.6, T_CORNICE2 = 23.2, T_TOP = 24.1, PARAPET = 25.2;
const LANTERN = 5.6, DOME_BASE = 33.7, SPIRE_TOP = 44.3;

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
// Rechthoekige paneelnis met een plafond van 45 graden; [cx, cy] midden, angle de normaal van de gevel,
// a de afstand van de gevel tot het midden, s0..s1 langs de gevel (links van de normaal), diepte d.
const recess = ([cx, cy], angle, a, s0, s1, z0, z1, d) =>
  Manifold.extrude(new CrossSection([ccw([[a - d, z0], [a + 1, z0], [a + 1, z1], [a, z1], [a - d, z1 - d - 0.05]])]), s1 - s0)
    .rotate([90, 0, 0])
    .translate([0, s1, 0])
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Ruitvormige nis (oculus) met plafonds van 50 graden.
const oculus = ([cx, cy], angle, a, s, z, r, d = 0.35) =>
  profileX([[s, z - 1.2 * r], [s + r, z], [s, z + 1.2 * r], [s - r, z]], a - d, a + 0.4)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);

// ---------- 1738-kruis: noord-zuidarm met schilden, westarm tot de toren ----------
solids.push(roofed(R(-ARM_U, ARM_U, -ARM_V, ARM_V), [
  ...ridgeU(0, RIDGE, PITCH),
  [0, -PITCH, RIDGE - PITCH * ARM_U + PITCH * ARM_V],
  [0, PITCH, RIDGE - PITCH * ARM_U + PITCH * ARM_V],
]));
// De west-oostkap loopt door de viering tot de westgevel van het koor (DSM: nok +20 tot u = 5,9).
solids.push(roofed(R(WEST_END, CHOIR_W0, -WEST_V, WEST_V), ridgeV(0, RIDGE, PITCH)));

// ---------- koor met driezijdige sluiting ----------
const choirPlan = [[CHOIR_W0, -CHOIR_V], ...APSE, [CHOIR_W0, CHOIR_V]];
const ridgeEnd = [CHOIR_RIDGE_END, 0];
const apsePlane = (p0, p1) => {
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const dist = Math.abs((p1[0] - p0[0]) * (p0[1] - ridgeEnd[1]) - (p0[0] - ridgeEnd[0]) * (p1[1] - p0[1])) / len;
  return facet(p0, p1, CHOIR_EAVE, (CHOIR_RIDGE - CHOIR_EAVE) / dist, [12, 0]);
};
solids.push(roofed(choirPlan, [
  ...ridgeV(0, CHOIR_RIDGE, CHOIR_PITCH),
  apsePlane(APSE[0], APSE[1]), apsePlane(APSE[1], APSE[2]), apsePlane(APSE[2], APSE[3]),
]));
// Steunberen van het koor: op de hoeken van de sluiting (BAG) en een paar op de zijmuren.
for (const [p, theta] of [[APSE[0], -67.5], [APSE[1], -22.5], [APSE[2], 22.5], [APSE[3], 67.5], [[12.0, 5.5], 90], [[12.0, -5.5], -90]])
  solids.push(buttress(p, theta + 90, 1.0, 1.0, 9.4, 8.2));

// ---------- lage aanbouwen ----------
// Noordoost: consistorie onder een schilddak (3D BAG: goot +4,0, nok +7,1 langs u = 9,0).
solids.push(roofed(R(ARM_U, 11.67, CHOIR_V, 15.5), [...ridgeU(9.03, 7.1, 1.17), [0, -1.7, 4.0 + 1.7 * 15.5], [0, 1.65, 4.0 - 1.65 * CHOIR_V]]));
// Zuidoost: platte tussenbouw (+4,9) met de ingang naar het koor en de achtkante kamer met tentdak.
solids.push(prism([[ARM_U, -CHOIR_V], [17.4, -CHOIR_V], [17.4, -6.9], [14.3, -9.9], [12.2, -12.5], [8.4, -16.0], [ARM_U, -16.0]], BASE, 4.9));
const OCT_C = [12.2, -14.7];
solids.push(loft([[BASE, oct(OCT_C, 7.9)], [4.6, oct(OCT_C, 7.9)], [4.85, oct(OCT_C, 8.3)], [5.05, oct(OCT_C, 8.3)], [9.3, oct(OCT_C, 0.9)], [10.2, tip(OCT_C)]]));

// ---------- gevelreliëf van het kruis ----------
// Plint van 0,7 m rond kruis, koor en toren.
const plan = CrossSection.union([
  new CrossSection([ccw(R(-ARM_U, ARM_U, -ARM_V, ARM_V))]),
  new CrossSection([ccw(R(WEST_END, CHOIR_W0, -WEST_V, WEST_V))]),
  new CrossSection([ccw(choirPlan)]),
  new CrossSection([ccw(R(T_LOW[0], T_LOW[1] + 0.5, T_LOW[2], T_LOW[3]))]),
]);
solids.push(Manifold.extrude(plan.offset(0.15, "Miter"), 0.7 - BASE).translate([0, 0, BASE]));
// Zandstenen hoekpilasters (1,2 m breed, 0,2 m voor de gevel) op de buitenhoeken en de binnenhoeken van de westarm.
const PIL = 1.2, PRO = 0.2, PIL_TOP = 11.3;
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  solids.push(prism(R(sx * (ARM_U - PIL), sx * (ARM_U + PRO), sy * (ARM_V - PIL), sy * (ARM_V + PRO)), BASE, PIL_TOP));
}
for (const sy of [-1, 1]) {
  solids.push(prism(R(WEST_END - PRO, WEST_END + PIL, sy * (WEST_V - PIL), sy * (WEST_V + PRO)), BASE, PIL_TOP));
  solids.push(prism(R(-ARM_U - PIL - PRO, -ARM_U, sy * WEST_V, sy * (WEST_V + PIL + PRO)), BASE, PIL_TOP));
  // Sokkel met vaas tegen de toren, op de hoek van de westarm (foto's noord- en westgevel).
  solids.push(prism(R(-17.25, -16.3, sy * 4.07, sy * 5.0), BASE, 12.3));
  solids.push(loft([[12.25, oct([-16.78, sy * 4.55], 0.9)], [13.2, oct([-16.78, sy * 4.55], 0.9)], [14.0, tip([-16.78, sy * 4.55])]]));
}
// Rondboogvensters (spits benaderd, 58 graden) van 2,2 m breed, 2,4 tot 8,4 m.
const WIN = (p, angle) => cuts.push(niche(p, angle, 0, 0, 2.2, 2.4, 6.6, 0.38));
for (const u of [-2.5, 2.5]) { WIN([u, ARM_V], 90); WIN([u, -ARM_V], 270); }
for (const sy of [-1, 1]) WIN([-ARM_U, sy * 11.5], 180);
// Westarm: venster naast de toren en de ingangspartij (zandstenen omlijsting, deur, wapen, venster erboven).
for (const sy of [-1, 1]) {
  const ang = sy > 0 ? 90 : 270;
  WIN([-13.6, sy * WEST_V], ang);
  solids.push(prism(R(-11.1, -8.1, sy * (WEST_V - 0.2), sy * (WEST_V + 0.25)), BASE, 5.0));
  cuts.push(niche([-9.6, sy * (WEST_V + 0.25)], ang, 0, 0, 1.8, 0.1, 3.3, 0.35));
  cuts.push(niche([-9.6, sy * WEST_V], ang, 0, 0, 2.0, 5.6, 7.4, 0.38));
}
// Blinde velden boven de vensters van de noord- en zuidgevel.
for (const sy of [-1, 1]) cuts.push(recess([0, 0], sy > 0 ? 90 : 270, ARM_V, -1.2, 1.2, 9.0, 10.6, 0.3));
// Koor: hoge spitsboogvensters in de sluiting en de zijmuren.
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const CWIN = (p, angle, z0) => cuts.push(niche(p, angle, 0, 0, 1.8, z0, 8.6, 0.38));
CWIN(mid(APSE[0], APSE[1]), -45, 3.0);
CWIN(mid(APSE[1], APSE[2]), 0, 3.0);
CWIN(mid(APSE[2], APSE[3]), 45, 3.0);
CWIN([14.7, CHOIR_V], 90, 3.0);
CWIN([14.7, -CHOIR_V], 270, 5.6);
// Aanbouwen: vensters van de consistorie en de achtkante kamer.
for (const u of [8.0, 10.2]) cuts.push(niche([u, 15.5], 90, 0, 0, 1.3, 1.2, 3.0, 0.3));
for (const ang of [-135, -90, -45, 0]) cuts.push(niche(OCT_C, ang, 3.95, 0, 1.5, 1.4, 3.6, 0.3));

// ---------- toren ----------
// Onderste geleding: kern met brede zandstenen hoekpilasters (1,3 m) op de vrije hoeken.
solids.push(prism(R(T_LOW[0] + 0.3, T_LOW[1], T_LOW[2] + 0.3, T_LOW[3] - 0.3), BASE, T_CORNICE1));
for (const sy of [-1, 1]) {
  solids.push(prism(R(T_LOW[0], T_LOW[0] + 1.3, sy * (4.07 - 1.3), sy * 4.07), BASE, T_CORNICE1));
  solids.push(prism(R(T_LOW[1] - 1.3, T_LOW[1], sy * (4.07 - 1.3), sy * 4.07), BASE, T_CORNICE1));
}
// Ingangspartij in het westen: omlijsting, deur met bovenlicht, gedenksteen erboven.
solids.push(prism(R(T_LOW[0] + 0.3, T_LOW[0] + 0.05, -1.6, 1.6), BASE, 7.0));
cuts.push(niche([T_LOW[0] + 0.05, TC[1]], 180, 0, 0, 1.7, 0.1, 3.1, 0.35));
cuts.push(recess([T_LOW[0] + 0.05, TC[1]], 180, 0, -1.1, 1.1, 4.4, 6.4, 0.2));
// Noord en zuid: oculus en rondboogvenster in de onderste geleding.
for (const sy of [-1, 1]) {
  const ang = sy > 0 ? 90 : 270;
  cuts.push(oculus([TC[0], sy * (4.07 - 0.3)], ang, 0, 0, 2.4, 0.55));
  cuts.push(niche([TC[0], sy * (4.07 - 0.3)], ang, 0, 0, 1.2, 4.5, 6.6, 0.38));
}
// Kroonlijst tussen de geledingen (45 graden).
const box = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
const TLC = [(T_LOW[0] + T_LOW[1]) / 2, 0.0];
solids.push(loft([[T_CORNICE1 - 0.7, box(TLC, 3.36, 3.77)], [T_CORNICE1 - 0.3, box(TLC, 3.66, 4.07)], [T_CORNICE1, box(TLC, 3.86, 4.27)], [T_CORNICE1 + 0.4, box(TLC, 3.86, 4.27)]]));
// Bovenste geleding: iets ingesprongen, met hoeklisenen van 1,0 m.
const UH = [3.2, 3.6], LIS = 1.0, LP = 0.25;
solids.push(prism(box(TC, UH[0], UH[1]), T_CORNICE1, T_CORNICE2 + 0.1));
for (const sx of [-1, 1]) for (const sy of [-1, 1])
  solids.push(prism(R(TC[0] + sx * (UH[0] - LIS), TC[0] + sx * (UH[0] + LP), TC[1] + sy * (UH[1] - LIS), TC[1] + sy * (UH[1] + LP)), T_CORNICE1, T_CORNICE2 + 0.1));
// Twee rondboogvensters boven elkaar op de west-, noord- en zuidzijde (galmgat boven).
for (const [ang, a] of [[180, UH[0]], [90, UH[1]], [270, UH[1]]]) {
  cuts.push(niche(TC, ang, a, 0, 1.1, 11.6, 13.4, 0.38));
  cuts.push(niche(TC, ang, a, 0, 1.3, 16.3, 18.9, 0.4));
  cuts.push(recess(TC, ang, a, -1.6, 1.6, 20.3, 22.6, 0.2));
}
// Kroonlijst, plat dak en gesloten balustrade.
solids.push(loft([[T_CORNICE2 - 0.35, box(TC, UH[0], UH[1])], [T_CORNICE2, box(TC, UH[0] + LP, UH[1] + LP)], [T_CORNICE2 + 0.35, box(TC, UH[0] + LP + 0.3, UH[1] + LP + 0.3)], [T_TOP, box(TC, UH[0] + LP + 0.3, UH[1] + LP + 0.3)]]));
solids.push(prism(box(TC, UH[0] + LP + 0.2, UH[1] + LP + 0.2), T_TOP - 0.1, PARAPET).subtract(prism(box(TC, UH[0] - 0.2, UH[1] - 0.2), T_TOP, PARAPET + 1)));
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c = [TC[0] + sx * (UH[0] + LP - 0.25), TC[1] + sy * (UH[1] + LP - 0.25)];
  solids.push(prism(sq(c, 0.45), T_TOP, PARAPET + 0.35));
}
// Lantaarn: achtkante voet met panelen, band, open boogstelling (als nissen), kroonlijst.
solids.push(loft([[T_TOP - 0.1, oct(TC, LANTERN)], [27.8, oct(TC, LANTERN)], [28.1, oct(TC, LANTERN + 0.4)], [28.4, oct(TC, LANTERN + 0.4)]]));
solids.push(loft([[28.3, oct(TC, LANTERN - 0.2)], [32.6, oct(TC, LANTERN - 0.2)], [32.95, oct(TC, LANTERN + 0.2)], [33.3, oct(TC, LANTERN + 0.5)], [DOME_BASE, oct(TC, LANTERN + 0.5)]]));
for (let k = 0; k < 8; k++) {
  cuts.push(niche(TC, k * 45, (LANTERN - 0.2) / 2, 0, 1.3, 28.7, 31.3, 0.45));
  cuts.push(niche(TC, k * 45, LANTERN / 2, 0, 1.1, 24.8, 26.6, 0.3));
}
// Klokvormige koepel, twee uien en de makelaar (DSM-top +44,3).
solids.push(loft([
  [DOME_BASE, oct(TC, 6.1)], [34.3, oct(TC, 5.6)], [35.3, oct(TC, 4.6)], [36.3, oct(TC, 3.4)], [37.2, oct(TC, 2.2)],
  [37.8, oct(TC, 1.3)], [38.2, oct(TC, 0.9)], [38.8, oct(TC, 1.5)], [39.6, oct(TC, 1.5)], [40.2, oct(TC, 0.9)],
  [40.8, oct(TC, 0.9)], [41.3, oct(TC, 1.2)], [41.8, oct(TC, 0.9)], [SPIRE_TOP, tip(TC)],
]));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Grote Kerk Almelo",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0141100000019525"],
  plate: false,
  description:
    "Grote Kerk aan het Kerkplein in Almelo: Grieks kruis van 1738 met schilddaken (nok +20 m), laatgotisch koor van 1493 met steiler dak (+21,7 m), driezijdige sluiting en steunberen, consistorie en achtkante kamer als lage aanbouwen, westtoren van twee geledingen met balustrade, achtkante lantaarn en koepelspits van 1777 tot +44,3 m. Oorsprong RD (242136,11; 486377,50) op het hart van de viering op maaiveld (NAP +12,1 m), X-as langs de west-oostnok onder 6,8 graden. Vensters en boogstelling als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "koor 1493, schip, transept en toren 1738, koepelspits 1777",
    monument: [7487, 7488],
    groundNapM: 12.1,
    armRidgeM: RIDGE,
    choirRidgeM: CHOIR_RIDGE,
    towerParapetM: PARAPET,
    domeBaseM: DOME_BASE,
    towerTopM: SPIRE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_Kerk_(Almelo)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/7487 (kerk: koor 1493, schip en transept 1738)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/7488 (toren 1738, koepelspits 1777)",
    "https://archimon.nl/overijssel/almeloherv.html",
    "https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Almelo (RCE-foto's 20276047, 20276050, 20276051, 20276052, 20276055, 20276057, 20006974; Grote Kerk church Almelo 2019.jpg)",
    "BAG pand 0141100000019525 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

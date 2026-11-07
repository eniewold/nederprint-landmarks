import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-leerdam");
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

const SLUG = "grote-kerk-leerdam";
const BASE = -0.4;
// Meetstelsel: +u langs de nok van schip en koor van west naar oost (RD-richting 18,2 graden, gemeten aan de
// evenwijdige BAG-gevels en de nokken in het AHN-DSM), +v naar het noorden van de kerk. Alle maten hieronder staan in
// dat stelsel; aan het eind schuift het model zodat de oorsprong op de viering ligt (u = 6,6, op de as van het schip
// v = 0,15), op maaiveld NAP +2,4 m.
const AXIS_DEG = 18.2;
const ORIGIN = [134751.223, 433659.204];
const SHIFT = [6.6, 0.15];
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (modelstelsel): west 46,21, noordwest 46,12,
// zuidwest 46,46, schip noord 46,22, schip zuid 46,56, zuidportaal 46,53, noordtransept 45,75 en 45,88, koor 45,99,
// sacristie 46,39 (PDOK-terreintegels, november 2026). De Kerkstraat aan de noordkant ligt het laagst.
const GROUND_ELLIPSOID = 45.75;
const GROUND_SAMPLES = [[-31.7, 0], [-28.5, 10.5], [-28.5, -10.5], [-16.6, 11], [-16.6, -10.6], [-5.6, -14.6], [-4, 17.6], [4, 17.6], [21.4, 0.4], [9.4, -11.4]];

// ---------- maten (meter boven maaiveld NAP +2,4) ----------
// Pseudobasilicaal schip (ca. 1550): drie beuken onder één zadeldak, gevels v = -9,43 en +9,70 (BAG), nok +18,8 op
// v = 0,15, helling 1,23 (51 graden) uit de vlakfit op het AHN-DSM (zuid 1,247, noord 1,216), goot +7,0.
const NAVE_W = -21.5, NAVE_S = -9.43, NAVE_N = 9.7, NAVE_RIDGE = 18.8, NAVE_AXIS = 0.15, NAVE_PITCH = 1.23;
// Koor (eerste helft 15e eeuw): vijfzijdige sluiting (5/10), breedte 9,7 m, nok +19,4 op v = 0,5, helling 1,526,
// goot +12,0; nokeinde boven het midden van de sluiting (u = 21,5).
const CHOIR_W = 2.25, CHOIR_S = -4.35, CHOIR_N = 5.35, CHOIR_AXIS = 0.5, CHOIR_RIDGE = 19.4, CHOIR_EAVE = 12.0;
const CHOIR_PITCH = (CHOIR_RIDGE - CHOIR_EAVE) / (CHOIR_N - CHOIR_AXIS);
const APSE_C = [21.5, CHOIR_AXIS], APSE_R = 4.85;
const APSE = [-90, -54, -18, 18, 54, 90].map((t) => [APSE_C[0] + APSE_R * Math.cos((t * Math.PI) / 180), APSE_C[1] + APSE_R * Math.sin((t * Math.PI) / 180)]);
// Noordtransept (begin 16e eeuw, breder dan de rest): u 2,0..11,2, nok +15,2 op u = 6,6, helling 1,57.
const NTR = { u0: 2.0, u1: 11.2, v1: 16.75, ridge: 15.2, pitch: 1.57 };
// Zuidtransept (15e eeuw): u 3,5..10,4, gevel op v = -11,9, nok +13,5, helling 1,58.
const STR = { u0: 3.5, u1: 10.4, v0: -11.9, ridge: 13.5, pitch: 1.58 };
// Zuidportaal (ca. 1550) met topgevel, u -1,38..3,51 tot v = -13,43, nok +10,8, helling 1,5.
const SPO = { u0: -1.38, u1: 3.51, v0: -13.43, ridge: 10.8, pitch: 1.5 };
// Sacristie (15e eeuw) tegen het koor: u 12,4..19,4 tot v = -10,2, nok +11,5, helling 1,6.
const SAC = { u0: 12.4, u1: 19.4, v0: -10.2, ridge: 11.5, pitch: 1.6 };
// Noordportaal (reconstructie 1954-1960): u -2,3..0,55 tot v = 12,2, nok +7,1.
const NPO = { u0: -2.3, u1: 0.55, v1: 12.2, ridge: 7.1, pitch: 1.8 };
// Traptoren naast het zuidportaal (reconstructie 1954-1960).
const STAIR_C = [-2.4, -10.15], STAIR_R = 1.05;
// Ingebouwde westtoren (13e eeuw, verhoogd 15e eeuw): u -21,5..-14,95, v -2,9..4,55 (AHN), borstwering +24,2,
// tentdak, vierkante lantaarn met uurwerk en naaldspits tot +33,7 (AHN-top NAP +36,1).
const TW = [-21.5, -14.95, -2.9, 4.55];
const TC = [(TW[0] + TW[1]) / 2, (TW[2] + TW[3]) / 2];
const T_CORBEL = 22.6, T_TOP = 24.2, T_GUTTER = 23.6, LANTERN = 2.4, LANTERN_BASE = 26.9, LANTERN_TOP = 29.1, SPIRE_BASE = 29.45, SPIRE_TOP = 33.7;

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
const box = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
// Rechthoekige paneelnis met een plafond van 45 graden (zie Almelo).
const recess = ([cx, cy], angle, a, s0, s1, z0, z1, d) =>
  Manifold.extrude(new CrossSection([ccw([[a - d, z0], [a + 1, z0], [a + 1, z1], [a, z1], [a - d, z1 - d - 0.05]])]), s1 - s0)
    .rotate([90, 0, 0])
    .translate([0, s1, 0])
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Ruitvormige nis (uurwerk) met plafonds van 50 graden.
const oculus = ([cx, cy], angle, a, s, z, r, d = 0.3) =>
  profileX([[s, z - 1.2 * r], [s + r, z], [s, z + 1.2 * r], [s - r, z]], a - d, a + 0.4)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Getrapte steunbeer: steps = [[diepte, hoogte], ...] van onder naar boven, telkens met een schuine waterlijst (45 graden
// omhoog naar de gevel) naar de volgende diepte; de laatste waterlijst loopt tot de gevel.
const stepped = ([x, y], angle, w, steps) => {
  const pts = [[0.1, BASE], [-steps[0][0], BASE]];
  steps.forEach(([d, z], i) => {
    if (i > 0) pts.push([-d, steps[i - 1][1] + (steps[i - 1][0] - d)]);
    pts.push([-d, z]);
  });
  const [dl, zl] = steps[steps.length - 1];
  pts.push([0, zl + dl], [0.1, zl + dl]);
  return profileX(pts, -w / 2, w / 2).rotate([0, 0, angle]).translate([x, y, 0]);
};
// Zadeldak met de nok langs v (dwarsarmen, portalen, sacristie) en een topgevel met een verhoogde rand van 0,35 m.
const gableBlock = (u0, u1, v0, v1, ridge, pitch, gableV) => {
  const uc = (u0 + u1) / 2;
  solids.push(roofed(R(u0, u1, v0, v1), ridgeU(uc, ridge, pitch)));
  const t = gableV < (v0 + v1) / 2 ? [gableV, gableV + 0.5] : [gableV - 0.5, gableV];
  solids.push(roofed(R(u0, u1, t[0], t[1]), ridgeU(uc, ridge + 0.35, pitch)));
};

// ---------- schip: één zadeldak over drie beuken, aan de oostkant op de zuidzijde afgewolfd naar het transept ----------
const navePlanes = [...ridgeV(NAVE_AXIS, NAVE_RIDGE, NAVE_PITCH), [-1.587, 0, 24.11]];
solids.push(roofed(R(NAVE_W, NTR.u0, NAVE_S, NAVE_N), navePlanes));
solids.push(roofed(R(NTR.u0, STR.u1, NAVE_S, CHOIR_S + 0.5), navePlanes));
// Westgevel: topgevel met een rand van 0,35 m boven het dak, aan weerszijden van de toren.
solids.push(roofed(R(NAVE_W, NAVE_W + 0.6, NAVE_S, NAVE_N), ridgeV(NAVE_AXIS, NAVE_RIDGE + 0.35, NAVE_PITCH)));

// ---------- koor met vijfzijdige sluiting ----------
const choirPlan = [[CHOIR_W, CHOIR_S], ...APSE, [CHOIR_W, CHOIR_N]];
const apsePlane = (p0, p1) => {
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const dist = Math.abs((p1[0] - p0[0]) * (p0[1] - APSE_C[1]) - (p0[0] - APSE_C[0]) * (p1[1] - p0[1])) / len;
  return facet(p0, p1, CHOIR_EAVE, (CHOIR_RIDGE - CHOIR_EAVE) / dist, [12, CHOIR_AXIS]);
};
solids.push(roofed(choirPlan, [...ridgeV(CHOIR_AXIS, CHOIR_RIDGE, CHOIR_PITCH), ...APSE.slice(1).map((p, i) => apsePlane(APSE[i], p))]));
// Hoge plint van het koor tot +2,6 met een afzaat van 45 graden.
{
  const off = new CrossSection([ccw(choirPlan)]).offset(0.25, "Miter").toPolygons()[0];
  solids.push(Manifold.hull([...off.map(([x, y]) => [x, y, BASE]), ...off.map(([x, y]) => [x, y, 2.6]), ...choirPlan.map(([x, y]) => [x, y, 2.84])]));
}
// Steunberen: op de vier hoeken van de sluiting (radiaal), vier op de noordwand en één op de zuidhoek (BAG).
const choirBut = (p, angle) => solids.push(stepped(p, angle, 0.85, [[1.25, 2.6], [1.0, 6.4], [0.75, 9.6]]));
for (const k of [1, 2, 3, 4]) choirBut(APSE[k], [-90, -54, -18, 18, 54, 90][k] + 90);
for (const u of [12.68, 15.51, 18.45]) choirBut([u, CHOIR_N], 180);
choirBut(APSE[5], 180);
choirBut(APSE[0], 0);
// Hoge spitsboogvensters: vijf in de sluiting, drie in de noordwand, twee boven de sacristie.
for (const t of [-72, -36, 0, 36, 72]) {
  const a = (t * Math.PI) / 180, r = APSE_R * Math.cos(Math.PI / 10);
  cuts.push(niche([APSE_C[0] + r * Math.cos(a), APSE_C[1] + r * Math.sin(a)], t, 0, 0, 1.6, 3.4, 9.6, 0.4));
}
for (const u of [14.1, 17.0, 19.95]) cuts.push(niche([u, CHOIR_N], 90, 0, 0, 1.6, 3.4, 9.6, 0.4));
for (const u of [13.6, 18.2]) cuts.push(niche([u, CHOIR_S], 270, 0, 0, 1.4, 8.0, 9.9, 0.4));

// ---------- dwarsarmen, portalen en sacristie ----------
gableBlock(NTR.u0, NTR.u1, 3.0, NTR.v1, NTR.ridge, NTR.pitch, NTR.v1);
gableBlock(STR.u0, STR.u1, STR.v0, -2.0, STR.ridge, STR.pitch, STR.v0);
gableBlock(SPO.u0, SPO.u1, SPO.v0, NAVE_S + 0.5, SPO.ridge, SPO.pitch, SPO.v0);
gableBlock(SAC.u0, SAC.u1, SAC.v0, CHOIR_S + 0.5, SAC.ridge, SAC.pitch, SAC.v0);
gableBlock(NPO.u0, NPO.u1, NAVE_N - 0.5, NPO.v1, NPO.ridge, NPO.pitch, NPO.v1);
// Lage, platte tussenbouw tussen het zuidtransept en de sacristie (+3,3).
solids.push(prism(R(STR.u1 - 0.5, SAC.u0 + 0.5, -8.5, CHOIR_S + 0.5), BASE, 3.3));
// Hoeksteunberen van de sacristie (diagonaal) en vensters: twee in de zuidgevel, een in de oostwand, oculus in de top.
solids.push(buttress([SAC.u0, SAC.v0], -45, 0.8, 0.9, 4.6, 3.7), buttress([SAC.u1, SAC.v0], 45, 0.8, 0.9, 4.6, 3.7));
for (const u of [14.4, 17.4]) cuts.push(niche([u, SAC.v0], 270, 0, 0, 1.1, 1.6, 3.6, 0.35));
cuts.push(niche([SAC.u1, -7.2], 0, 0, 0, 1.1, 1.6, 3.6, 0.35));
cuts.push(oculus([15.9, SAC.v0], 270, 0, 0, 7.9, 0.5));
// Traptoren: ronde schacht met kegeldak.
solids.push(Manifold.cylinder(6.6 - BASE, STAIR_R, STAIR_R, 24).translate([STAIR_C[0], STAIR_C[1], BASE]));
solids.push(Manifold.cylinder(2.1, STAIR_R, 0, 24).translate([STAIR_C[0], STAIR_C[1], 6.55]));
// Transeptgevels: groot spitsboogvenster; zijwanden van het noordtransept elk een venster.
cuts.push(niche([(STR.u0 + STR.u1) / 2, STR.v0], 270, 0, 0, 2.4, 2.6, 7.6, 0.4));
cuts.push(niche([(NTR.u0 + NTR.u1) / 2, NTR.v1], 90, 0, 0, 2.6, 2.8, 8.0, 0.4));
cuts.push(niche([NTR.u0, 13.4], 180, 0, 0, 1.6, 2.5, 5.6, 0.38));
cuts.push(niche([NTR.u1, 13.4], 0, 0, 0, 1.6, 2.5, 5.6, 0.38));
cuts.push(niche([NTR.u1, 8.4], 0, 0, 0, 1.6, 2.5, 5.6, 0.38));
// Portalen: spitsboogdeur en een venstertje in de topgevel.
cuts.push(niche([(SPO.u0 + SPO.u1) / 2, SPO.v0], 270, 0, 0, 1.8, 0.0, 2.4, 0.4));
cuts.push(niche([(SPO.u0 + SPO.u1) / 2, SPO.v0], 270, 0, 0, 0.8, 5.0, 6.2, 0.35));
cuts.push(niche([(NPO.u0 + NPO.u1) / 2, NPO.v1], 90, 0, 0, 1.5, 0.0, 2.2, 0.4));

// ---------- gevels van het schip: steunberen en vensters ----------
for (const u of [-15.9, -11.15, -6.4]) solids.push(buttress([u, NAVE_S], 0, 0.75, 0.95, 5.2, 4.3));
for (const u of [-16.5, -11.8, -7.0, -2.55]) solids.push(buttress([u, NAVE_N], 180, 0.75, 0.95, 5.2, 4.3));
solids.push(buttress([-20.6, NAVE_S], 0, 0.85, 1.0, 5.6, 4.6), buttress([-21.15, NAVE_N], 180, 0.85, 1.0, 5.6, 4.6));
for (const u of [-18.25, -13.55, -8.8]) cuts.push(niche([u, NAVE_S], 270, 0, 0, 1.9, 1.9, 4.8, 0.38));
cuts.push(niche([-4.75, NAVE_S], 270, 0, 0, 1.5, 1.9, 4.8, 0.38));
for (const u of [-18.85, -14.15, -9.4, -4.8]) cuts.push(niche([u, NAVE_N], 90, 0, 0, 1.9, 1.9, 4.8, 0.38));
// Westgevel van de zijbeuken: een venster aan weerszijden van de toren.
for (const v of [-6.4, 7.2]) cuts.push(niche([NAVE_W, v], 180, 0, 0, 1.6, 2.2, 4.6, 0.38));

// ---------- plint rond schip, dwarsarmen en toren ----------
const plan = CrossSection.union([
  new CrossSection([ccw(R(NAVE_W, STR.u1, NAVE_S, NAVE_N))]),
  new CrossSection([ccw(R(NTR.u0, NTR.u1, 3.0, NTR.v1))]),
  new CrossSection([ccw(R(STR.u0, STR.u1, STR.v0, -2.0))]),
  new CrossSection([ccw(R(SPO.u0, SPO.u1, SPO.v0, -8.0))]),
  new CrossSection([ccw(R(SAC.u0, SAC.u1, SAC.v0, CHOIR_S + 0.5))]),
]);
solids.push(Manifold.extrude(plan.offset(0.15, "Miter"), 0.7 - BASE).translate([0, 0, BASE]));

// ---------- toren ----------
// Schacht tot de kraag, kraag van bijna 45 graden, borstwering met een goot binnen de rand.
solids.push(prism(R(TW[0], TW[1], TW[2], TW[3]), BASE, T_CORBEL));
{
  const hx = (TW[1] - TW[0]) / 2, hy = (TW[3] - TW[2]) / 2;
  const parapet = loft([[T_CORBEL - 0.01, box(TC, hx, hy)], [T_CORBEL + 0.2, box(TC, hx + 0.19, hy + 0.19)], [T_TOP, box(TC, hx + 0.19, hy + 0.19)]]);
  solids.push(parapet.subtract(prism(box(TC, hx - 0.6, hy - 0.6), T_GUTTER, T_TOP + 1)));
  // Tentdak vanuit de goot naar de lantaarn.
  solids.push(Manifold.hull([...box(TC, hx - 0.6, hy - 0.6).map(([x, y]) => [x, y, T_GUTTER]), ...sq(TC, LANTERN / 2).map(([x, y]) => [x, y, LANTERN_BASE])]));
  // Galmgaten (twee naast elkaar) op noord, west en zuid boven het dak; blinde boogfries van vijf rondbogen; zes
  // boogjes in de borstwering. Op de oostzijde staat het dak van het schip hoger: alleen fries en borstwering.
  const faces = [[180, TC[1], TW[0], hy], [90, TC[0], TW[3], hx], [270, TC[0], TW[2], hx], [0, TC[1], TW[1], hy]];
  for (const [ang, mid, at, half] of faces) {
    const p = (s) => (ang === 180 || ang === 0 ? [at, mid + s] : [mid + s, at]);
    if (ang !== 0) for (const s of [-0.6, 0.6]) cuts.push(niche(p(s), ang, 0, 0, 0.8, 17.8, 19.5, 0.38));
    for (let k = 0; k < 5; k++) cuts.push(niche(p((k - 2) * ((2 * half - 1.4) / 4)), ang, 0, 0, 0.75, 20.6, 21.9, 0.25));
  }
  for (const [ang, mid, at, half] of faces) {
    const out = at + (ang === 180 || ang === 270 ? -0.19 : 0.19);
    const p = (s) => (ang === 180 || ang === 0 ? [out, mid + s] : [mid + s, out]);
    for (let k = 0; k < 6; k++) cuts.push(niche(p((k - 2.5) * ((2 * half - 1.2) / 5)), ang, 0, 0, 0.55, 23.05, 23.4, 0.25));
  }
}
// Lantaarn met uurwerk op vier zijden, kroonlijst en naaldspits.
solids.push(prism(sq(TC, LANTERN / 2), LANTERN_BASE - 0.05, LANTERN_TOP));
for (const ang of [0, 90, 180, 270]) cuts.push(oculus(TC, ang, LANTERN / 2, 0, 28.0, 0.5, 0.25));
solids.push(loft([[LANTERN_TOP - 0.01, sq(TC, LANTERN / 2)], [LANTERN_TOP + 0.2, sq(TC, LANTERN / 2 + 0.19)], [SPIRE_BASE, sq(TC, LANTERN / 2 + 0.19)]]));
solids.push(loft([[SPIRE_BASE - 0.01, sq(TC, LANTERN / 2 + 0.19)], [SPIRE_TOP, tip(TC)]]));
// Getrapte steunberen op de westgevel van de toren (BAG v -3,85..-2,47 en 2,62..4,0, 2,6 m diep), deur, venster en
// een klein rechthoekig licht erboven.
const TWEST = (2.62 + 4.0 - 2.47 - 3.85) / 4;
for (const v of [(-3.85 - 2.47) / 2, (2.62 + 4.0) / 2]) solids.push(stepped([NAVE_W, v], 270, 1.38, [[2.6, 3.2], [1.9, 8.0], [1.2, 12.8]]));
cuts.push(niche([NAVE_W, TWEST], 180, 0, 0, 1.7, 0.0, 2.6, 0.4));
cuts.push(niche([NAVE_W, TWEST], 180, 0, 0, 1.6, 5.0, 7.6, 0.4));
cuts.push(recess([NAVE_W, TWEST], 180, 0, -0.45, 0.45, 11.4, 12.6, 0.3));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE).translate([-SHIFT[0], -SHIFT[1], 0]);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Grote Kerk Leerdam",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0545100000345310"],
  plate: false,
  description:
    "Grote Kerk aan de Kerkstraat in Leerdam: laatgotische kruiskerk met een pseudobasilicaal schip van drie beuken onder één zadeldak (nok +18,8 m), koor met vijfzijdige sluiting en steunberen (nok +19,4 m), noord- en zuidtransept, sacristie, zuidportaal met traptoren en noordportaal, ingebouwde romaanse westtoren met getrapte steunberen, galmgaten, boogfries, borstwering, tentdak, lantaarn met uurwerk en naaldspits tot +33,7 m. Oorsprong RD (134751,22; 433659,20) op de viering op maaiveld (NAP +2,4 m), X-as langs de nok onder 18,2 graden. Vensters en boogjes als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "toren onderbouw 2e helft 13e eeuw, verhoogd 15e eeuw; koor, sacristie en zuidtransept 15e eeuw; noordtransept begin 16e eeuw; schip ca. 1550; restauratie 1954-1960 (spits, borstwering, noordportaal, traptoren)",
    monument: 24039,
    groundNapM: 2.4,
    naveRidgeM: NAVE_RIDGE,
    choirRidgeM: CHOIR_RIDGE,
    choirEaveM: CHOIR_EAVE,
    towerParapetM: T_TOP,
    towerTopM: SPIRE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_Kerk_(Leerdam)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/24039",
    "https://reliwiki.nl/index.php/Leerdam,_Kerkstraat_32_-_Grote_Kerk",
    "https://archimon.nl/utrecht/leerdamherv.html",
    "https://commons.wikimedia.org/wiki/Category:Exterior_of_Grote_Kerk,_Leerdam (RCE-foto's 20129943-20129973, 20129986, 20129987, 20376510; Toren Grote Kerk.JPG; WLM mchangsp)",
    "BAG pand 0545100000345310 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken ter controle)",
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

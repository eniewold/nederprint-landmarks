import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-goes");
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

// Grote of Maria Magdalenakerk, Goes: laatgotische kruisbasiliek met basilicaal koor (1455-1470) met
// drie bijna gelijke apsissen, transepten (voltooid 1506), vijfbeukig schip van 1619-1621 (Marcus
// Antonius) en de open achtkante dakruiter van 1620 op de viering.
const SLUG = "grote-kerk-goes";
const BASE = -0.4;
// Stelsel: oorsprong op het hart van de viering op maaiveld (NAP +1,9 m), +u langs de nok van schip
// en koor van west naar oost (RD-richting 7,7 graden), +v naar het noorden van de kerk. De nokken van
// schip, koor en transept (3D BAG LoD2.2) en de gevels van de BAG-contour lopen evenwijdig aan die as.
const ORIGIN = [51076.47, 391530.4];
const AXIS_DEG = 7.7;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 46,17, noordwest 46,44, zuidwest 46,35,
// noord 46,04, zuid 46,04 (PDOK-terreintegels, november 2026); het PDOK-pand staat op 46,02.
const GROUND_ELLIPSOID = 46.04;
const GROUND_SAMPLES = [[-35, 0], [-18, 17.5], [-18, -18], [0, 29], [0, -28.5]];

// ---------- maten (meter boven maaiveld) ----------
// Schip, koor en transept: zadeldaken met nok +31,5 (3D BAG 31,3 tot 32,0), helling 1,55 (57 graden),
// muren op v = +-5,9; goot +22,35 (3D BAG 22,3).
const RIDGE = 31.5, PITCH = 1.55, NAVE_V = 5.9, EAVE = RIDGE - PITCH * NAVE_V;
const WEST = -30.6; // westgevel (BAG)
// Transept: muren op u = -5,0 en 5,3 (BAG), nok op u = 0,15, helling 1,63 (3D BAG), kopgevels v = 25,7 en -25,2.
const TR_W = -5.0, TR_E = 5.3, TR_RIDGE_U = 0.15, TR_PITCH = 1.63, TR_N = 25.7, TR_S = -25.2;
const TR_EAVE = RIDGE - TR_PITCH * (TR_E - TR_RIDGE_U);
// Vijfbeukig schip: twee zijbeuken per kant onder één lessenaarsdak (3D BAG: helling 0,585, +16,55 tegen
// de lichtbeuk, goot +12,0); buitenmuren v = 13,7 en -14,2 (BAG).
const AISLE_N = 13.7, AISLE_S = -14.2, AISLE_TOP = 16.55, AISLE_SLOPE = 0.585;
// Koor: zijkoren v 5,9 tot 14,7 (noord) en -5,9 tot -14,0 (zuid), goot +12,2, dwarse zadeldaken met
// nok +16,0 en helling 1,75 om de 4,3 m, binnenste lessenaars tegen de lichtbeuk (3D BAG).
const CH_N = 14.7, CH_S = -14.0, CH_EAVE = 12.2, GABLE_RIDGE = 16.0, GABLE_PITCH = 1.75;
const GABLES = [5.45, 9.75, 14.05, 18.35, 22.65];
const CH_END = 34.4; // oostelijke punt van de drie apsissen (BAG)
// Dakruiter van 1620 (AHN-DSM: omgang en lantaarn +34 tot +37, spits tot circa +55).
const DR = [0.1, 0.2];

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
const box = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const normalDeg = (a, b, inside) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  let n = [dy, -dx];
  const m = mid(a, b);
  if (n[0] * (inside[0] - m[0]) + n[1] * (inside[1] - m[1]) > 0) n = [-n[0], -n[1]];
  return (Math.atan2(n[1], n[0]) * 180) / Math.PI;
};
// Rechthoekige blinde nis met een plafond van 45 graden (zie Almelo): normaal 'angle', s0..s1 langs de gevel.
const recess = ([cx, cy], angle, a, s0, s1, z0, z1, d) =>
  Manifold.extrude(new CrossSection([ccw([[a - d, z0], [a + 1, z0], [a + 1, z1], [a, z1], [a - d, z1 - d - 0.05]])]), s1 - s0)
    .rotate([90, 0, 0])
    .translate([0, s1, 0])
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
const win = (p, angle, w, z0, z1, d = 0.4) => cuts.push(niche(p, angle, 0, 0, w, z0, z1, d));

// ---------- schip, transept en koor: hoofddaken ----------
solids.push(roofed(R(WEST, TR_W + 0.5, -NAVE_V, NAVE_V), ridgeV(0, RIDGE, PITCH)));
// Transept met kopgevels die 0,6 m terugliggen achter een borstwering op gootniveau (foto's noord- en zuidgevel).
solids.push(roofed(R(TR_W, TR_E, TR_S + 0.6, TR_N - 0.6), ridgeU(TR_RIDGE_U, RIDGE, TR_PITCH)));
for (const [v0, v1] of [[TR_N - 0.6, TR_N], [TR_S, TR_S + 0.6]]) solids.push(prism(R(TR_W, TR_E, v0, v1), BASE, TR_EAVE + 0.9));
// Koor met vijfzijdige sluiting: schildvlakken met dezelfde helling als het zadeldak.
const choirPlan = [[TR_E - 0.5, -NAVE_V], [CH_END - 3.46, -NAVE_V], [CH_END, -2.44], [CH_END, 2.44], [CH_END - 3.46, NAVE_V], [TR_E - 0.5, NAVE_V]];
solids.push(roofed(choirPlan, [
  ...ridgeV(0, RIDGE, PITCH),
  facet(choirPlan[1], choirPlan[2], EAVE, PITCH, [20, 0]),
  facet(choirPlan[2], choirPlan[3], EAVE, PITCH, [20, 0]),
  facet(choirPlan[3], choirPlan[4], EAVE, PITCH, [20, 0]),
]));

// ---------- zijbeuken van het schip ----------
solids.push(roofed(R(WEST, TR_W + 0.3, NAVE_V - 0.3, AISLE_N), [[0, -AISLE_SLOPE, AISLE_TOP + AISLE_SLOPE * NAVE_V]]));
solids.push(roofed(R(WEST, TR_W + 0.3, AISLE_S, -NAVE_V + 0.3), [[0, AISLE_SLOPE, AISLE_TOP + AISLE_SLOPE * NAVE_V]]));
// Steunberen tussen de traveeën (BAG: 1,0 m breed, 1,1 m diep, om de 5 m).
const NAVE_BAYS = [-24.9, -19.9, -14.9, -9.9];
for (const u of NAVE_BAYS) {
  solids.push(buttress([u, AISLE_S], 0, 1.05, 1.1, 10.6, 9.4));
  solids.push(buttress([u, AISLE_N], 180, 1.05, 1.1, 10.6, 9.4));
}
// Westgevel: steunberen tussen de beuken (BAG) en de twee hoge steunberen naast de schipgevel met pinakels.
for (const v of [9.5, -10.07]) solids.push(buttress([WEST, v], 270, 1.0, 1.15, 10.6, 9.4));
for (const v of [4.25, -4.98]) {
  solids.push(prism(R(WEST - 1.2, WEST + 0.2, v - 0.55, v + 0.55), BASE, 22.6));
  solids.push(pinnacle([WEST - 0.5, v], 0.55, 22.6, 1.0, 2.0));
}
// Traptorens op de westhoeken: achtkant met loden koepeltje (DSM-top +16).
for (const c of [[-29.6, 14.35], [-29.4, -14.95]]) {
  solids.push(loft([[BASE, oct(c, 2.7)], [14.6, oct(c, 2.7)], [14.9, oct(c, 2.9)], [15.2, oct(c, 2.9)], [15.6, oct(c, 2.4)], [16.2, oct(c, 1.4)], [16.6, oct(c, 0.6)]]));
}
// Vensters: westgevel van het schip (groot venster, deur, topvenster), de vier zijbeuken en de lichtbeuk.
win([WEST, 0], 180, 5.0, 7.5, 17.5);
win([WEST, 0], 180, 2.4, 0.1, 3.8, 0.35);
win([WEST, 0], 180, 1.2, 24.0, 26.3, 0.3);
for (const v of [7.7, 11.6, -7.9, -12.1]) win([WEST, v], 180, 1.9, 2.6, 8.6);
const navePanels = [-27.75, -22.4, -17.4, -12.4, -7.45];
for (const u of navePanels) {
  win([u === -27.75 ? -26.85 : u, AISLE_N], 90, u === -27.75 ? 2.0 : 2.6, 2.8, 9.0);
  win([u === -27.75 ? -26.85 : u, AISLE_S], 270, u === -27.75 ? 2.0 : 2.6, 2.8, 9.0);
  win([u, NAVE_V], 90, 2.8, 17.3, 19.9);
  win([u, -NAVE_V], 270, 2.8, 17.3, 19.9);
}

// ---------- transept ----------
// Kopgevels: hoeksteunberen (BAG) met pinakeltorentjes naast de top.
for (const [p, hx, hy] of [[[-5.75, 25.1], 0.75, 0.6], [[-4.55, 26.4], 0.55, 0.7], [[4.7, 26.4], 0.6, 0.7], [[-5.5, -24.8], 0.7, 0.55], [[-4.1, -25.9], 0.5, 0.7], [[5.1, -25.85], 0.55, 0.75]]) {
  solids.push(prism(box(p, hx, hy), BASE, TR_EAVE + 0.4));
}
for (const p of [[-4.55, 26.2], [4.7, 26.2], [-4.1, -25.9], [5.1, -25.85]]) solids.push(pinnacle(p, 0.5, TR_EAVE + 0.4, 3.4, 2.4));
// Zijmuren van de transeptarmen: steunberen (BAG) en per travee een bovenvenster boven een blinde boog.
for (const v of [18.97, -18.97]) solids.push(buttress([TR_W, v], 270, 1.5, 1.4, 13.5, 12.0));
for (const v of [16.6, 22.1, -16.4, -21.7]) {
  win([TR_W, v], 180, 2.2, 14.5, 19.6);
  cuts.push(recess([TR_W, v], 180, 0, -1.2, 1.2, 1.0, 11.6, 0.3));
}
for (const v of [18.5, 22.6]) win([TR_E, v], 0, 2.2, 14.5, 19.6);
// Grote kopvensters, het dubbele portaal in de noordgevel (marktzijde), en de topgevels:
// noord met drie spitsboognissen (opengewerkte gevel), zuid met één venster; makelaar op beide toppen.
win([TR_RIDGE_U, TR_N], 90, 5.6, 7.2, 18.4);
win([TR_RIDGE_U, TR_N], 90, 3.6, 0.1, 4.6, 0.4);
win([TR_RIDGE_U, TR_S], 270, 5.2, 7.5, 18.4);
win([TR_RIDGE_U, TR_S], 270, 2.6, 0.1, 4.2, 0.35);
for (const s of [-2.1, 0, 2.1]) win([TR_RIDGE_U + s, TR_N - 0.6], 90, 1.5, 24.4, s === 0 ? 27.6 : 25.4, 0.35);
win([TR_RIDGE_U, TR_S + 0.6], 270, 2.0, 24.4, 27.2, 0.35);
for (const v of [TR_N - 1.05, TR_S + 1.05]) solids.push(pinnacle([TR_RIDGE_U, v], 0.45, RIDGE - 1.2, 1.4, 1.6));
// Ronde traptoren in de hoek van noordtransept en noordelijk zijkoor (DSM-top +27,5).
solids.push(loft([[BASE, oct([6.1, 15.3], 2.5)], [25.6, oct([6.1, 15.3], 2.5)], [26.0, oct([6.1, 15.3], 2.8)], [26.3, oct([6.1, 15.3], 2.8)], [28.0, tip([6.1, 15.3])]]));

// ---------- zijkoren met dwarse zadeldaken, apsissen met tentdaken ----------
const aisleApse = (side) => {
  const outer = side > 0 ? CH_N : CH_S, ch = side > 0 ? 2.6 : 2.4;
  return [[24.8, side * NAVE_V], [CH_END - ch, side * NAVE_V], [CH_END, side * NAVE_V + side * ch], [CH_END, outer - side * ch], [CH_END - ch, outer], [24.8, outer]];
};
const aisle = (side) => {
  const outer = side > 0 ? CH_N : CH_S;
  const half = Math.abs(outer - side * NAVE_V) / 2;
  const centre = side * NAVE_V + side * half;
  // Binnenste lessenaar tegen de lichtbeuk (3D BAG: +17,0 noord, +16,45 zuid tegen de muur).
  const lean = side > 0 ? [0, -1.18, 23.94] : [0, 1.11, 23.0];
  solids.push(prism(R(TR_E - 0.3, 24.8, side * (NAVE_V - 0.3), outer), BASE, CH_EAVE));
  solids.push(roofed(R(TR_E - 0.3, 24.8, side * (NAVE_V - 0.3), centre), [lean]));
  for (const u of GABLES) solids.push(roofed(R(u - 2.15, u + 2.15, side * (NAVE_V + 0.6), outer), ridgeU(u, GABLE_RIDGE, GABLE_PITCH)));
  // Apsis: driezijdige sluiting met een tentdak tot de top boven het hart van het zijkoor.
  const apse = aisleApse(side);
  const top = CH_EAVE + 1.6 * half;
  solids.push(prism(apse, BASE, CH_EAVE));
  solids.push(Manifold.hull([...apse.map(([x, y]) => [x, y, CH_EAVE - 0.01]), [29.6, centre, top]]));
  for (let i = 1; i < 4; i++) {
    const a = apse[i], b = apse[i + 1];
    win(mid(a, b), normalDeg(a, b, [29.6, centre]), 1.8, 2.6, 8.4);
  }
  // Steunberen onder de goten tussen de dwarskappen en op de hoeken van de apsis.
  for (const u of GABLES.slice(1)) solids.push(buttress([u, outer], side > 0 ? 180 : 0, 1.0, 1.0, 11.0, 9.8));
  for (const p of [apse[2], apse[3]]) solids.push(loft([[BASE, sq(p, 0.5)], [10.4, sq(p, 0.5)], [11.4, tip(p)]]));
  // Zijkoorvensters onder de kilgoten; luchtbogen: pijler met pinakel op elke nok en een dichte boog
  // naar de lichtbeuk (foto's noord- en zuidzijde van het koor).
  // Zuid: de eerste twee traveeën zitten achter de kapel.
  for (const u of side > 0 ? [7.6, 11.9, 16.2, 20.5] : [16.2, 20.5]) win([u, outer], side > 0 ? 90 : 270, 2.4, 3.3, 8.8);
  for (const u of GABLES.slice(1)) {
    const pv = side * 9.6;
    solids.push(prism(box([u, pv], 0.5, 0.6), BASE, 19.6));
    solids.push(pinnacle([u, pv], 0.5, 19.6, 0.4, 1.6));
    solids.push(profileX([[side * 5.8, 14.0], [pv, 12.0], [pv, 19.6], [side * 5.8, 21.9]], u - 0.45, u + 0.45));
  }
};
aisle(1);
aisle(-1);
// Lichtbeuk van het koor: vijf vensters per kant tussen de luchtbogen, drie hoge vensters in de sluiting
// met blinde bogen eronder.
for (const u of [7.6, 11.9, 16.2, 20.5, 24.8]) {
  win([u, NAVE_V], 90, 2.4, 17.6, 20.0);
  win([u, -NAVE_V], 270, 2.4, 17.6, 20.0);
}
for (let i = 1; i < 4; i++) {
  const a = choirPlan[i], b = choirPlan[i + 1], ang = normalDeg(a, b, [20, 0]);
  win(mid(a, b), ang, 2.2, 13.2, 20.0);
  cuts.push(recess(mid(a, b), ang, 0, -1.1, 1.1, 1.0, 11.2, 0.3));
}

// ---------- aanbouwen ----------
// Kapel tegen de oostwand van het zuidtransept: lessenaarsdak van +17,1 naar +11,0 (3D BAG), met vensters.
solids.push(roofed(R(TR_E - 0.3, 12.5, CH_S, -24.7), [[-0.84, 0, 21.54]]));
for (const v of [-17.0, -21.5]) win([12.5, v], 0, 1.6, 6.6, 8.9);
win([8.9, -24.7], 270, 2.0, 2.6, 8.0);
// Smalle aanbouw (+6,0), sacristie van circa 1520 met plat dak (+4,5) en de lage aanbouw noordoost (+3,0)
// met het zadeldak van de consistorie (goot +3,8, nok +6,9 langs v = 22,7).
solids.push(prism(R(12.4, 13.4, -24.7, CH_S), BASE, 6.0));
solids.push(prism(R(13.3, 20.4, -18.3, CH_S), BASE, 4.5));
solids.push(prism(R(TR_E - 0.3, 21.0, CH_N - 0.3, 19.7), BASE, 3.0));
solids.push(roofed(R(TR_E - 0.3, 14.7, 19.6, 25.6), [...ridgeV(22.65, 6.9, 1.06)]));
for (const u of [8.0, 12.0]) win([u, 25.6], 90, 1.4, 0.8, 2.4, 0.3);

// ---------- plint ----------
const plan = CrossSection.union([
  new CrossSection([ccw(R(WEST, TR_W + 0.5, AISLE_S, AISLE_N))]),
  new CrossSection([ccw(R(TR_W, TR_E, TR_S, TR_N))]),
  new CrossSection([ccw(choirPlan)]),
  new CrossSection([ccw(R(TR_E - 0.3, 24.9, CH_S, CH_N))]),
  new CrossSection([ccw(aisleApse(1))]),
  new CrossSection([ccw(aisleApse(-1))]),
]);
const plinth = Manifold.extrude(plan.offset(0.15, "Miter"), 0.8 - BASE).translate([0, 0, BASE]);

// ---------- dakruiter op de viering ----------
// Loden voet (3,6 m), omgang met dichte balustrade (5,0 m) op een kraag van 45 graden, open klokkenverdieping
// als nissen (4,3 m), kroonlijst, klokvormige voet van de spits en de naald (DSM tot +54 op 0,5 m).
solids.push(loft([[27.5, oct(DR, 3.6)], [32.85, oct(DR, 3.6)], [33.7, oct(DR, 5.0)], [34.6, oct(DR, 5.0)]]));
solids.push(loft([[34.5, oct(DR, 4.3)], [36.3, oct(DR, 4.3)], [36.65, oct(DR, 4.9)], [36.9, oct(DR, 5.1)], [37.15, oct(DR, 4.7)], [37.7, oct(DR, 3.3)], [38.4, oct(DR, 2.0)], [39.3, oct(DR, 1.5)], [55.0, tip(DR)]]));
for (let k = 0; k < 8; k++) cuts.push(niche(DR, k * 45, 4.3 / 2, 0, 1.1, 34.8, 35.5, 0.35));


// ---------- buurpanden tegen de koorsluiting ----------
// De PDOK-reconstructie van de twee huizen tegen de apsissen (BAG 0664100000015497 en 0664100000015314)
// heeft punten van het koor meegenomen en staat tot +17,6 m, terwijl het AHN-DSM er een plat dak op circa
// +9 m toont. Ze worden vervangen door blokken op die hoogte (BAG-contour, zonder de kerk).
const EAST_HOUSES = [
  [[38.9, 12.55], [34.53, 12.57], [34.5, 11.23], [33.72, 11.28], [33.54, 9.08], [34.47, 8.72], [34.42, 7.36], [32.98, 6.8], [32.8, 4.6], [34.18, 3.64], [34.17, 3.33], [38.94, 2.71]],
  [[38.94, 2.71], [34.17, 3.33], [34.14, 2.2], [33.46, 2.19], [33.5, 0.07], [34.19, -0.14], [34.21, -1.2], [33.46, -1.36], [32.72, -2.2], [32.71, -4.84], [33.57, -6.12], [39.06, -6.11]],
];
const housePrisms = Manifold.union(EAST_HOUSES.map((p) => prism(p, BASE, 9.0)));
const bodyMass = Manifold.union(solids);
const massing = Manifold.union([bodyMass, plinth.subtract(housePrisms)]);
let complex = massing.subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const houses = housePrisms.subtract(bodyMass);
const nodes = [["building:kerk", complex], ["building:huizen-tegen-het-koor", houses]], all = complex;
const META = {
  name: "Grote of Maria Magdalenakerk Goes",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0664100000008055", "0664100000015497", "0664100000015314"],
  plate: false,
  description:
    "Grote of Maria Magdalenakerk in Goes: laatgotische kruisbasiliek met vijfbeukig schip van 1619-1621 (lessenaarsdaken over twee zijbeuken per kant), transepten met kopgevels, borstweringen en hoekpinakels, basilicaal koor met vijfzijdige sluiting, zijkoren met dwarse zadeldaken, luchtbogen en apsissen met tentdaken, en de open achtkante dakruiter van 1620 met naaldspits tot circa +55 m. Oorsprong RD (51076,47; 391530,40) op het hart van de viering op maaiveld (NAP +1,9 m), X-as langs de nok van schip en koor onder 7,7 graden. Vensters en klokgaten als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "koor 1455-1470, transepten voltooid 1506, schip 1619-1621, dakruiter 1620",
    monument: 16375,
    groundNapM: 1.9,
    ridgeM: RIDGE,
    naveEaveM: +EAVE.toFixed(2),
    aisleEaveM: +(AISLE_TOP - AISLE_SLOPE * (AISLE_N - NAVE_V)).toFixed(2),
    choirAisleEaveM: CH_EAVE,
    spireTopM: 55.0,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_of_Maria_Magdalenakerk",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/16375",
    "https://archimon.nl/zeeland/goesherv.html",
    "https://commons.wikimedia.org/wiki/Category:Maria_Magdalenakerk_(Goes) (RCE-foto's 20079413, 20079416, 20079415, 20079417, 20079420, 20079422, 20307124, 20352790; 2019 Maria Magdalenakerk (Goes) (1).jpg; Goes Grote Kerk Sint Maria Magdalena Vierungsturm 1.jpg)",
    "BAG pand 0664100000008055 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

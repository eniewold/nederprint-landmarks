import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-willibrordusbasiliek-hulst");
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


// Sint-Willibrordusbasiliek, Hulst: laatgotische kruisbasiliek in Brabantse gotiek (circa 1462-1535,
// Spoorwater, De Waeghemaekere, Keldermans) met driebeukig schip, transepten met een westelijke zijbeuk
// onder een lessenaarsdak, koor met kooromgang en straalkapellen, en de vieringtoren met de betonnen
// bekroning 'De Prediker' van Jan Brouwers (1957) na de beschieting van 1944.
const SLUG = "sint-willibrordusbasiliek-hulst";
const BASE = -0.5;
// Stelsel: oorsprong op het hart van de vieringtoren op maaiveld (NAP +3,25 m), +u langs de nok van schip en
// koor van west naar oost (RD-richting 16,5 graden, gemeten uit de dakranden in het AHN-DSM), +v naar het
// noorden van de kerk. Nokken en gevels van de BAG-contour lopen evenwijdig aan die as.
const ORIGIN = [61990.0, 366551.86];
const AXIS_DEG = 16.5;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 47,88, noord 47,94 en 47,90,
// zuid 47,73 en 47,69, zuidoost 47,72, oost 48,19 (PDOK-terreintegels, november 2026); AHN-maaiveld NAP +3,25.
const GROUND_ELLIPSOID = 47.69;
const GROUND_SAMPLES = [[-47, 0], [-25, 16], [-25, -16], [0, 25], [0, -25], [30, -15], [39, 0]];

// ---------- maten (meter boven maaiveld, NAP +3,25) ----------
// Schip: zadeldak met nok +28,05 (3D BAG 27,8 tot 28,3), helling 1,58 (58 graden), lichtbeukmuren op 4,8 m
// van de nok (AHN-DSM), westgevel op u = -41,9 (BAG).
const NAVE_C = 0.1, NAVE_HALF = 4.8, NAVE_RIDGE = 28.05, NAVE_PITCH = 1.58;
const NAVE_EAVE = NAVE_RIDGE - NAVE_PITCH * NAVE_HALF;
const WEST = -41.9;
// Zijbeuken van het schip: lessenaarsdaken (3D BAG: helling 0,55) van +14,0 tegen de lichtbeuk tot circa +10,1
// aan de buitenmuren v = 11,85 en -11,9 (BAG).
const AISLE_N = 11.85, AISLE_S = -11.9, AISLE_TOP = 14.0, AISLE_SLOPE = 0.55;
const aisleN = [0, -AISLE_SLOPE, AISLE_TOP + AISLE_SLOPE * (NAVE_C + NAVE_HALF)];
const aisleS = [0, AISLE_SLOPE, AISLE_TOP - AISLE_SLOPE * (NAVE_C - NAVE_HALF)];
// Transept: hoge arm u -4,3 tot 4,1 met nok op u = -0,1 op +21,75 en helling 1,6 (3D BAG), kopgevels v = 20,45 en
// -20,4 (BAG); westelijke zijbeuk tot u = -11,9 onder een lessenaarsdak (helling 0,53) dat op +14,0 aansluit.
const TR_W = -4.3, TR_E = 4.1, TR_RIDGE_U = -0.1, TR_RIDGE = 21.75, TR_PITCH = 1.6, TR_N = 20.45, TR_S = -20.4;
const TR_EAVE = TR_RIDGE - TR_PITCH * (TR_E - TR_RIDGE_U);
const TRA_W = -11.9, TRA_SLOPE = 0.53;
const traPlane = [TRA_SLOPE, 0, AISLE_TOP - TRA_SLOPE * TR_W];
const TRA_EAVE = AISLE_TOP - TRA_SLOPE * (TR_W - TRA_W);
// Koor: zadeldak met nok +28,3 (3D BAG), helling 1,5, lichtbeukmuren op 4,9 m van de nok, achtzijdige sluiting
// met de oostzijde op u = 26,0 (3D BAG-schildvlakken).
const CH_C = -0.15, CH_HALF = 4.9, CH_RIDGE = 28.3, CH_PITCH = 1.5;
const CH_EAVE = CH_RIDGE - CH_PITCH * CH_HALF;
// Kooromgang: buitenmuren v = 12,6 en -12,4 (BAG), goot +10,3, lessenaar van +13,9 tegen de lichtbeuk (helling 0,9)
// en per travee een schilddak met de nok haaks op de as op +13,3 (3D BAG en luchtfoto).
const CHA_N = 12.6, CHA_S = -12.4, CHA_EAVE = 10.3, CHA_TOP = 13.9, CHA_SLOPE = 0.9, BAY_RIDGE = 13.3, BAY_PITCH = 1.1;
const BAYS = [TR_E, 9.2, 14.65, 20.05, 24.9]; // traveegrenzen = steunberen van de zuidelijke kooromgang (BAG)
// Vieringtoren (AHN-DSM, foto's): achtkant boven de daken, omgang op +31, bovenste achtkant tot +41,3,
// kroon van acht pinakels tot +52,6 en de middenschacht met beeldengroep tot circa +65,3 (AHN-DSM: +60 tot +62 over 2 m,
// top +65,1 op 0,5 m; Wikipedia noemt 68,7 m).
const TC = [-0.1, 0.0];

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
const win = (p, angle, w, z0, z1, d = 0.4) => cuts.push(niche(p, angle, 0, 0, w, z0, z1, d));
const hull2 = (pts) => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length > 1 && cross(lo.at(-2), lo.at(-1), q) <= 0) lo.pop(); lo.push(q); }
  for (const q of [...p].reverse()) { while (up.length > 1 && cross(up.at(-2), up.at(-1), q) <= 0) up.pop(); up.push(q); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
// Dakkapel op een dakvlak: voorgevel op v = vf, achterkant op vb (hoger in het dak), goot zf boven het dakvlak.
const dormer = (u, vb, vf, zRoof, side) => {
  const zf = zRoof + 1.3;
  solids.push(roofed(R(u - 0.7, u + 0.7, vb, vf), ridgeU(u, zf + 0.75, 1.07)).trimByPlane([0, 0, 1], zRoof - 2.5));
  return side;
};

// ---------- schip ----------
solids.push(roofed(R(WEST, TR_W + 0.5, NAVE_C - NAVE_HALF, NAVE_C + NAVE_HALF), ridgeV(NAVE_C, NAVE_RIDGE, NAVE_PITCH)));
solids.push(roofed(R(WEST, TR_W + 0.3, NAVE_C + NAVE_HALF - 0.3, AISLE_N), [aisleN]));
solids.push(roofed(R(WEST, TR_W + 0.3, AISLE_S, NAVE_C - NAVE_HALF + 0.3), [aisleS]));
// Steunberen met pinakels langs de zijbeuken (BAG: 1,25 m breed, 1,65 m diep, om de 5,9 m).
const NAVE_BUTTS_N = [-35.0, -28.97, -23.2, -17.3], NAVE_BUTTS_S = [-34.7, -28.8, -22.9, -17.1];
for (const u of NAVE_BUTTS_N) {
  solids.push(buttress([u, AISLE_N], 180, 1.25, 1.65, 9.7, 8.5));
  solids.push(pinnacle([u, AISLE_N + 1.0], 0.45, 8.0, 1.8, 1.9));
}
for (const u of NAVE_BUTTS_S) {
  solids.push(buttress([u, AISLE_S], 0, 1.25, 1.65, 9.6, 8.4));
  solids.push(pinnacle([u, AISLE_S - 1.0], 0.45, 7.9, 1.8, 1.9));
}
// Hoeksteunberen van de zijbeuken aan de westzijde (BAG: twee haakse beren per hoek) met pinakels.
for (const [v, s] of [[AISLE_N, 1], [AISLE_S, -1]]) {
  solids.push(buttress([WEST, v - s * 0.55], 270, 1.1, 1.5, 9.6, 8.4));
  solids.push(buttress([WEST + 0.6, v], s > 0 ? 180 : 0, 1.2, 1.6, 9.6, 8.4));
  solids.push(pinnacle([WEST - 0.6, v - s * 0.55], 0.45, 8.0, 2.4, 2.0));
}
// Vensters: zijbeuken en lichtbeuk per travee.
const NAVE_BAYS = [-38.4, -32.0, -26.1, -20.25, -14.5];
for (const u of NAVE_BAYS) {
  win([u, AISLE_N], 90, 2.6, 2.6, 7.3);
  win([u, AISLE_S], 270, 2.6, 2.6, 7.3);
  win([u, NAVE_C + NAVE_HALF], 90, 2.2, 15.3, 17.6);
  win([u, NAVE_C - NAVE_HALF], 270, 2.2, 15.3, 17.6);
}
// Dakkapellen op het schip (luchtfoto: drie per kant) en twee op de zuidelijke zijbeuk.
for (const u of [-33.0, -23.8, -13.8]) {
  const vfN = NAVE_C + 3.5, vfS = NAVE_C - 3.5;
  dormer(u, NAVE_C + 1.6, vfN, NAVE_RIDGE - NAVE_PITCH * 3.5, 1);
  dormer(u, vfS, NAVE_C - 1.6, NAVE_RIDGE - NAVE_PITCH * 3.5, -1);
}
for (const u of [-31.8, -19.4]) dormer(u, AISLE_S + 1.4, AISLE_S + 3.2, aisleS[1] * (AISLE_S + 1.4) + aisleS[2], -1);

// ---------- westgevel ----------
// Topgevel 0,8 m boven het dak met een kam van pinakels (bekroning), traptorentjes op de westelijke steunberen
// (BAG v = 3,7 en -4,0; AHN tot circa +24), groot westvenster, hoofdportaal van Matthijs Keldermans en
// zijbeukvensters.
solids.push(roofed(R(WEST, WEST + 0.6, NAVE_C - NAVE_HALF, NAVE_C + NAVE_HALF), ridgeV(NAVE_C, NAVE_RIDGE + 0.8, NAVE_PITCH)));
for (const dv of [-3.3, -2.0, -0.9, 0.9, 2.0, 3.3]) {
  const z = NAVE_RIDGE + 0.8 - NAVE_PITCH * Math.abs(dv);
  solids.push(pinnacle([WEST + 0.45, NAVE_C + dv], 0.45, z - 1.8, 2.2, 1.6));
}
solids.push(pinnacle([WEST + 0.5, NAVE_C], 0.5, NAVE_RIDGE - 1.2, 2.8, 2.4));
for (const v of [3.7, -4.0]) {
  const c = [WEST - 0.75, v];
  solids.push(prism(box(c, 0.75, 0.75), BASE, 14.0));
  solids.push(loft([[BASE, oct(c, 1.5)], [22.3, oct(c, 1.5)], [22.7, oct(c, 1.7)], [23.1, oct(c, 1.7)], [25.6, tip(c)]]));
}
win([WEST, NAVE_C], 180, 5.0, 10.0, 17.6);
win([WEST, NAVE_C], 180, 3.4, 0.0, 4.6, 0.8);
win([WEST, NAVE_C], 180, 1.4, 22.0, 23.6, 0.35);
for (const v of [8.2, -8.4]) win([WEST, v], 180, 2.6, 2.8, 7.2);

// ---------- transept ----------
solids.push(roofed(R(TR_W, TR_E, TR_S, TR_N), ridgeU(TR_RIDGE_U, TR_RIDGE, TR_PITCH)));
// Kopgevels 0,6 m boven het dak, met een pinakel op de top (AHN +23,3) en hoeksteunberen met pinakels (BAG).
for (const [v0, v1, s] of [[TR_N - 0.5, TR_N, 1], [TR_S, TR_S + 0.5, -1]]) {
  solids.push(roofed(R(TR_W - 0.1, TR_E + 0.1, v0, v1), ridgeU(TR_RIDGE_U, TR_RIDGE + 0.6, TR_PITCH)));
  solids.push(pinnacle([TR_RIDGE_U, s > 0 ? TR_N - 0.45 : TR_S + 0.45], 0.45, TR_RIDGE - 1.4, 2.6, 1.9));
}
for (const [c, hx, hy] of [[[-4.1, 21.0], 0.5, 0.55], [[4.5, 20.1], 0.55, 0.5], [[-3.95, -21.0], 0.75, 0.55], [[3.9, -20.95], 0.45, 0.55]]) {
  solids.push(prism(box(c, hx, hy), BASE, TR_EAVE - 0.6));
  solids.push(pinnacle(c, 0.45, TR_EAVE - 0.6, 1.4, 2.2));
}
// Slanke traptoren op de zuidoosthoek van het zuidtransept met lantaarnkapje (foto's, AHN +23).
{
  const c = [4.75, -19.4];
  solids.push(prism(box(c, 0.5, 1.0), BASE, 15.0));
  solids.push(loft([[BASE, oct(c, 1.4)], [20.6, oct(c, 1.4)], [21.0, oct(c, 1.6)], [21.4, oct(c, 1.6)], [23.4, tip(c)]]));
}
// Westelijke zijbeuk van beide transeptarmen: lessenaarsdak met een schild aan de kopse kant (luchtfoto).
solids.push(roofed(R(TRA_W, TR_W + 0.3, NAVE_C + NAVE_HALF - 0.3, TR_N), [traPlane, [0, -1.2, TRA_EAVE + 1.2 * TR_N]]));
solids.push(roofed(R(TRA_W - 0.2, TR_W + 0.3, TR_S, NAVE_C - NAVE_HALF + 0.3), [traPlane, [0, 1.2, TRA_EAVE - 1.2 * TR_S]]));
for (const [c, s] of [[[TRA_W - 0.5, TR_N - 0.5], 1], [[TRA_W - 0.6, TR_S + 0.6], -1]]) {
  solids.push(prism(box(c, 0.55, 0.55), BASE, 9.0));
  solids.push(pinnacle(c, 0.45, 9.0, 0.8, 1.8));
}
// Vensters: grote kopvensters, een klein venster in de top van het noordtransept, oostmuren en zijbeuken.
win([TR_RIDGE_U, TR_N], 90, 4.8, 4.0, 12.8);
win([TR_RIDGE_U, TR_S], 270, 4.8, 4.0, 12.8);
win([TR_RIDGE_U, TR_N], 90, 1.2, 17.2, 18.6, 0.35);
for (const v of [16.4, -16.4]) win([TR_E, v], 0, 2.4, 3.0, 10.4);
for (const v of [16.2, -16.2]) win([TRA_W, v], 180, 2.4, 2.6, 6.6);
win([-8.1, TR_N], 90, 2.4, 2.6, 6.4);
win([-8.1, TR_S], 270, 2.4, 2.6, 6.4);

// ---------- koor ----------
const choirPlan = [[TR_E - 0.5, CH_C - CH_HALF], [23.3, CH_C - CH_HALF], [26.0, CH_C - 2.0], [26.0, CH_C + 2.0], [23.3, CH_C + CH_HALF], [TR_E - 0.5, CH_C + CH_HALF]];
solids.push(roofed(choirPlan, [
  ...ridgeV(CH_C, CH_RIDGE, CH_PITCH),
  facet(choirPlan[1], choirPlan[2], CH_EAVE, CH_PITCH, [18, CH_C]),
  facet(choirPlan[2], choirPlan[3], CH_EAVE, CH_PITCH, [18, CH_C]),
  facet(choirPlan[3], choirPlan[4], CH_EAVE, CH_PITCH, [18, CH_C]),
]));
for (const u of [6.65, 11.9, 17.35, 21.4]) {
  win([u, CH_C + CH_HALF], 90, 2.2, 15.2, 18.0);
  win([u, CH_C - CH_HALF], 270, 2.2, 15.2, 18.0);
}
for (let i = 1; i < 4; i++) {
  const a = choirPlan[i], b = choirPlan[i + 1];
  win(mid(a, b), normalDeg(a, b, [18, CH_C]), 1.7, 14.6, 18.6);
}
// Dakkapellen op het koor (luchtfoto: twee per kant).
for (const u of [12.0, 18.0]) {
  dormer(u, CH_C + 1.6, CH_C + 3.5, CH_RIDGE - CH_PITCH * 3.5, 1);
  dormer(u, CH_C - 3.5, CH_C - 1.6, CH_RIDGE - CH_PITCH * 3.5, -1);
}

// ---------- zijbeuken van het koor ----------
for (const [outer, s] of [[CHA_N, 1], [CHA_S, -1]]) {
  const wall = CH_C + s * CH_HALF;
  const lean = [0, -s * CHA_SLOPE, CHA_TOP + s * CHA_SLOPE * wall];
  solids.push(prism(R(TR_E - 0.3, 24.0, wall - s * 0.3, outer), BASE, CHA_EAVE));
  solids.push(roofed(R(TR_E - 0.3, 24.0, wall - s * 0.3, outer), [lean]));
  // Schilddak per travee boven elk venster, met een dakkapel in het schild naar buiten.
  for (let i = 0; i < BAYS.length - 1; i++) {
    const u0 = BAYS[i], u1 = BAYS[i + 1], uc = (u0 + u1) / 2;
    const hip = [0, -s * BAY_PITCH, CHA_EAVE + s * BAY_PITCH * outer];
    solids.push(roofed(R(u0, u1, wall, outer), [...ridgeU(uc, BAY_RIDGE, BAY_PITCH), hip]));
    if (i < 3) {
      const vf = outer - s * 1.3, vb = outer - s * 2.9;
      dormer(uc, Math.min(vf, vb), Math.max(vf, vb), CHA_EAVE + BAY_PITCH * 1.3, s);
    }
  }
  // Steunberen van de buitenmuur en luchtbogen: pijler met pinakel en een boog van 47 graden naar de lichtbeuk.
  for (const u of BAYS.slice(1, 4)) {
    solids.push(buttress([u, outer], s > 0 ? 180 : 0, 1.0, 0.95, 9.6, 8.6));
    const pv = CH_C + s * 9.0;
    solids.push(prism(box([u, pv], 0.45, 0.6), BASE, 17.6));
    solids.push(pinnacle([u, pv], 0.45, 17.6, 0.4, 2.8));
    const zIn = 15.6, run = Math.abs(pv - wall) - 0.6;
    solids.push(profileX([[wall, zIn], [pv - s * 0.6, zIn - 1.07 * run], [pv - s * 0.6, 17.6], [wall, 19.9]], u - 0.45, u + 0.45));
  }
}
// Vensters van de kooromgang (noord: de derde travee zit achter de sacristie).
for (const u of [6.65, 11.9, 17.35, 22.5]) win([u, CHA_S], 270, 2.6, 2.5, 7.4);
for (const u of [6.65, 11.9, 22.5]) win([u, CHA_N], 90, 2.6, 2.5, 7.4);

// ---------- kooromgang en straalkapellen ----------
// Omgang: convexe omhullende van de BAG-contour van het oosteinde, goot +10,3, ringdak dat naar binnen oploopt
// (helling 0,6) tot +13,2 tegen de koorsluiting.
const EAST_PTS = [[22.0, -12.4], [24.7, -12.4], [27.7, -11.2], [29.9, -11.3], [32.5, -9.1], [32.7, -7.0], [33.7, -3.5], [35.6, -1.9], [35.7, 1.9], [33.7, 3.9], [32.7, 6.4], [32.7, 8.8], [30.5, 11.4], [27.4, 11.6], [26.8, 12.6], [22.0, 12.6]];
const amb = hull2(EAST_PTS);
const ambPlanes = [[0, 0, 13.2]];
for (let i = 0; i < amb.length; i++) {
  const a = amb[i], b = amb[(i + 1) % amb.length];
  if (a[0] < 22.1 && b[0] < 22.1) continue; // westelijke sluitlijn ligt in de zijbeuken
  ambPlanes.push(facet(a, b, CHA_EAVE, 0.6, [21.2, 0]));
}
solids.push(roofed(amb, ambPlanes));
// Vensters in de buitenmuren van de omgang en de kapellen (op elke zijde van minstens 2,8 m).
for (let i = 0; i < amb.length; i++) {
  const a = amb[i], b = amb[(i + 1) % amb.length];
  if ((a[0] < 22.1 && b[0] < 22.1) || Math.hypot(b[0] - a[0], b[1] - a[1]) < 2.8) continue;
  const m = mid(a, b);
  if (Math.abs(m[1]) > 12) continue; // langs de kooromgang staan de traveevensters al
  win(m, normalDeg(a, b, [21.2, 0]), 1.8, 2.4, 7.0);
}
// Drie straalkapellen (oost en schuin noordoost/zuidoost) met zadeldak en driezijdige sluiting:
// nokken op +14,6 vanuit het hart van de koorsluiting (3D BAG: 14,3 tot 15,2).
const APSE_C = [21.2, CH_C];
for (const ang of [-45, 0, 45]) {
  const L = 14.2, w = 3.4;
  const plan = [[4.5, -w], [L - 1.4, -w], [L, -1.4], [L, 1.4], [L - 1.4, w], [4.5, w]];
  const chapel = roofed(plan, [
    ...ridgeV(0, 14.6, 1.2),
    facet(plan[1], plan[2], CHA_EAVE, 1.2, [8, 0]),
    facet(plan[2], plan[3], CHA_EAVE, 1.2, [8, 0]),
    facet(plan[3], plan[4], CHA_EAVE, 1.2, [8, 0]),
  ]);
  solids.push(chapel.rotate([0, 0, ang]).translate([APSE_C[0], APSE_C[1], 0]));
  // Steunbeer met pinakel op de hoeken van de sluiting.
  for (const p of [plan[2], plan[3]]) {
    const q = [p[0] + 0.2, p[1]];
    const r = (ang * Math.PI) / 180;
    const wq = [APSE_C[0] + q[0] * Math.cos(r) - q[1] * Math.sin(r), APSE_C[1] + q[0] * Math.sin(r) + q[1] * Math.cos(r)];
    solids.push(loft([[BASE, sq(wq, 0.5)], [9.4, sq(wq, 0.5)], [11.6, tip(wq)]]));
  }
}

// ---------- sacristie en aanbouwen ----------
// Sacristie tegen de noordelijke kooromgang (BAG u 13,9 tot 20,2): zadeldak met de nok haaks op de as op +15,15,
// helling 1,69 (3D BAG), kopgevel naar het noorden met hoekpinakels.
solids.push(roofed(R(13.9, 20.2, CHA_N - 0.3, 18.0), ridgeU(17.05, 15.15, 1.69)));
for (const c of [[13.6, 17.6], [14.4, 18.3], [19.7, 18.3], [20.6, 17.6]]) solids.push(pinnacle(c, 0.45, BASE, 11.0, 2.0));
win([17.05, 18.0], 90, 2.0, 3.0, 8.4);
solids.push(prism(R(20.2, 22.0, CHA_N - 0.3, 14.5), BASE, 9.6));
// Traptorentje in de hoek van zuidtransept en zuidelijke kooromgang (BAG).
solids.push(prism(R(4.2, 6.0, CHA_S + 0.3, -14.0), BASE, 12.6));
solids.push(loft([[12.6, sq([5.1, -13.2], 0.8)], [14.6, tip([5.1, -13.2])]]));

// ---------- vieringtoren ----------
// Achtkant van het dak tot de omgang (+31,0), omgang met dichte balustrade op een kraag, bovenste achtkant met
// galmgaten en uurwerk tot de kroonlijst (+41,8), daarop de kroon van acht pinakels (+52,6) rond de
// middenschacht met de beeldengroep (AHN-DSM tot +65,3 op 0,5 m).
solids.push(loft([[BASE, oct(TC, 9.0)], [30.45, oct(TC, 9.0)], [31.0, oct(TC, 10.0)], [32.6, oct(TC, 10.0)]]));
solids.push(loft([[32.5, oct(TC, 8.6)], [40.65, oct(TC, 8.6)], [41.2, oct(TC, 9.6)], [41.8, oct(TC, 9.6)]]));
for (const [du, dv] of [[-4.0, -4.3], [-4.0, 4.3], [3.9, -4.3], [3.9, 4.3]]) solids.push(pinnacle([TC[0] + du, TC[1] + dv], 0.45, BASE, 29.0, 2.6));
for (let k = 0; k < 8; k++) {
  const a = Math.PI / 8 + (k * Math.PI) / 4;
  const p = [TC[0] + 3.45 * Math.cos(a), TC[1] + 3.45 * Math.sin(a)];
  solids.push(loft([[41.5, sq(p, 0.55)], [49.6, sq(p, 0.5)], [52.6, tip(p)]]));
}
solids.push(loft([[41.5, oct(TC, 4.0)], [49.0, oct(TC, 4.0)], [50.0, oct(TC, 3.2)], [57.5, oct(TC, 1.6)], [58.3, oct(TC, 2.0)], [61.6, oct(TC, 1.6)], [65.3, tip(TC)]]));
for (let k = 0; k < 8; k++) {
  cuts.push(niche(TC, k * 45, 4.3, 0, 1.4, 33.6, 38.4, 0.4));
  cuts.push(niche(TC, k * 45, 4.5, 0, 1.2, 28.7, 29.3, 0.35));
  cuts.push(niche(TC, k * 45, 2.0, 0, 0.9, 43.5, 47.0, 0.35));
}

// ---------- plint ----------
const plinthPlan = CrossSection.union([
  new CrossSection([ccw(R(WEST, TR_W + 0.5, AISLE_S, AISLE_N))]),
  new CrossSection([ccw(R(TRA_W, TR_E, TR_S, TR_N))]),
  new CrossSection([ccw(R(TR_E - 0.3, 24.0, CHA_S, CHA_N))]),
  new CrossSection([ccw(amb)]),
]);
const plinth = Manifold.extrude(plinthPlan.offset(0.15, "Miter"), 0.8 - BASE).translate([0, 0, BASE]);

let complex = Manifold.union([Manifold.union(solids), plinth]).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Sint-Willibrordusbasiliek Hulst",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0677100000608184"],
  plate: false,
  description:
    "Sint-Willibrordusbasiliek in Hulst: laatgotische kruisbasiliek in Brabantse gotiek met driebeukig schip (lessenaarsdaken over de zijbeuken, steunberen met pinakels, dakkapellen), westgevel met pinakelkam en traptorentjes, transepten met een westelijke zijbeuk onder een lessenaarsdak en kopgevels met pinakels, koor met achtzijdige sluiting, kooromgang met schilddaken per travee, luchtbogen en drie straalkapellen, de sacristie aan de noordzijde en de vieringtoren met omgang, bovenste achtkant en de betonnen kroon 'De Prediker' van Jan Brouwers (1957) tot circa +65,3 m. Oorsprong RD (61990,00; 366551,86) op het hart van de vieringtoren op maaiveld (NAP +3,25 m), X-as langs de nok van schip en koor onder 16,5 graden. Vensters en galmgaten als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "gotische kerk eerste helft 15e eeuw; herbouw 1462-1535 (Spoorwater, De Waeghemaekere, Matthijs en Laurens Keldermans); torenbekroning 1957 (Jan Brouwers)",
    monument: 22778,
    groundNapM: 3.25,
    naveRidgeM: NAVE_RIDGE,
    naveEaveM: +NAVE_EAVE.toFixed(2),
    choirRidgeM: CH_RIDGE,
    transeptRidgeM: TR_RIDGE,
    aisleEaveM: +(AISLE_TOP - AISLE_SLOPE * (AISLE_N - NAVE_C - NAVE_HALF)).toFixed(2),
    towerGalleryM: 31.0,
    towerCornicheM: 41.8,
    crownPinnaclesM: 52.6,
    towerTopM: 65.3,
    towerHeightWithCrossM: 68.7,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Willibrordusbasiliek_(Hulst)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/22778",
    "https://www.openstreetmap.org/way/272162693",
    "https://commons.wikimedia.org/wiki/Category:Sint-Willibrordusbasiliek_(Hulst) (Hulst Sint-Willibrordusbasiliek 18-06-2012 16-18-45.jpg; Sint-Willibrordusbasiliek Hulst 01-04.jpg; Hulst basiliek westergevel 18-06-2012 15-52-16.jpg; Hulst. Basiliek Sint-Willibrordus Exterieur, GD012129.jpg; RCE-foto's 20118615, 20292331, 20302851, 20302852)",
    "BAG pand 0677100000608184 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

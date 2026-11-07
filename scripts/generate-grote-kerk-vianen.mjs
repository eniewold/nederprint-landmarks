import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-vianen");
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


const SLUG = "grote-kerk-vianen";
const BASE = -0.4;
// Bouwstelsel (u, v): +u langs de nok van schip en koor van de toren naar het koor (RD-richting 15,5 graden),
// +v naar de noordzijde. Gemeten aan de BAG-contour (gevels evenwijdig onder 15,5 graden) en de nokken in de
// 3D BAG en het AHN-DSM. Het stelselpunt (0, 0) is RD (134830; 444930); de modeloorsprong ligt op de kruising
// van de nokken van schip en dwarsschip (u = 6,05) op maaiveld (NAP +3,5 m).
const AXIS_DEG = 15.5;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const FRAME = [134830, 444930];
const ORIGIN = [134835.83, 444931.62];
const SHIFT = [(ORIGIN[0] - FRAME[0]) * ca + (ORIGIN[1] - FRAME[1]) * sa, -(ORIGIN[0] - FRAME[0]) * sa + (ORIGIN[1] - FRAME[1]) * ca];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west van de toren 46,82, noord 47,06 en 46,97,
// zuid 47,11 en 47,28, oost 47,06 (PDOK-terreintegels, november 2026). Het maaiveld loopt naar het oosten 0,5 m op.
const GROUND_ELLIPSOID = 46.82;
const GROUND_SAMPLES = [[-40.6, 0], [-21, 16.5], [-1, 23.5], [-21, -17], [0, -23.5], [25.5, 0]];

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Schip en koor: één langskap van de toren tot de koorsluiting, nok +19,35, goot +13,5 (3D BAG en AHN).
const NAVE_V = 4.95, RIDGE = 19.35, NAVE_PITCH = 1.18;
const NAVE_W = -24.4; // oostgevel van de toren
// Zijbeuken (Haags halletype): drie dwarskappen per zijde met een topgevel naar buiten, nok +19,3, goot +13,6.
const AISLE_N = 14.45, AISLE_S = -15.0;
const BAYS = [-22.6, -14.75, -6.9, 0.95]; // kilgoten tussen de dwarskappen (3D BAG: nokken -18,35, -10,7, -2,6)
const AISLE_RIDGE = 19.3, AISLE_EAVE = 13.6;
const AISLE_PITCH = (AISLE_RIDGE - AISLE_EAVE) / ((BAYS[1] - BAYS[0]) / 2);
// Westelijke traveeën (korter dan een travee): langsnok met topgevel naast de toren.
const WEST_U = -26.65, WEST_RIDGE_N = 9.72, WEST_RIDGE_S = -10.0, WEST_PITCH = 1.25;
// Dwarsschip: nok langs v op u = 6,05, +19,3, goot +13,3; kopgevels noord en zuid.
const TR_U0 = 0.95, TR_U1 = 11.15, TR_N = 21.2, TR_S = -21.5, TR_RIDGE_U = 6.05, TR_PITCH = 1.18;
// Hoofdkoor met vijfzijdige sluiting (BAG), nokeinde op u = 24,85, goot +13,3.
const CHOIR_END = 26.5, CHOIR_EAVE = 13.3, CHOIR_RIDGE_END = [24.85, 0];
const APSE = [[26.5, -4.95], [28.3, -3.45], [29.6, -1.5], [29.6, 1.5], [28.3, 3.45], [26.5, 4.95]];
// Lagere zijkoren (XV B) met veelhoekige sluiting en schilddak, nok +13,5.
const NSC = [[10.9, 4.95], [19.64, 4.95], [21.27, 6.92], [21.35, 9.42], [19.96, 11.49], [17.43, 12.89], [10.9, 12.89]];
const NSC_APEX = [17.0, 8.4], NSC_RIDGE = 13.5, NSC_PITCH = 0.97, NSC_EAVE = 9.1;
const SSC = [[10.9, -12.7], [16.34, -12.65], [18.89, -11.91], [20.49, -10.02], [20.68, -7.34], [19.22, -4.95], [10.9, -4.95]];
const SSC_APEX = [16.3, -8.35], SSC_RIDGE = 13.55, SSC_PITCH = 1.26, SSC_EAVE = 8.1;
// Toren (XIV, verhoogd XV B / 1540): 7,6 x 7,75 m (BAG), vijf geledingen, plat dak +29,5 met borstwering,
// achtkante helm en open lantaarn met makelaar (AHN-top +40,1; volgens Reliwiki 41 m met windvaan).
const T = [-32.0, -24.4, -4.15, 3.6];
const TC = [(T[0] + T[1]) / 2, (T[2] + T[3]) / 2];
const THX = (T[1] - T[0]) / 2, THY = (T[3] - T[2]) / 2;
const BANDS = [7.4, 12.6, 18.0, 23.6];
const T_TOP = 29.5, PARAPET = 30.9, HELM_TOP = 34.7, LANTERN_TOP = 36.6, SPIRE_TOP = 40.3;

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
const box = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
// Ruitvormige nis (oculus) met plafonds van 50 graden.
const oculus = ([cx, cy], angle, s, z, r, d = 0.35) =>
  profileX([[s, z - 1.2 * r], [s + r, z], [s, z + 1.2 * r], [s - r, z]], -d, 0.4)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Vensternis in een gevel met de normaal 'angle' door het punt p.
const win = (p, angle, w, z0, z1, d = 0.38) => cuts.push(niche(p, angle, 0, 0, w, z0, z1, d));
// Dakvlakken van een veelhoekige sluiting: elk vlak door de gevellijn op de goot, oplopend naar het nokeinde.
const apsePlanes = (pts, eave, apex, ridge) =>
  pts.slice(0, -1).map((p0, i) => {
    const p1 = pts[i + 1];
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const dist = Math.abs((p1[0] - p0[0]) * (p0[1] - apex[1]) - (p0[0] - apex[0]) * (p1[1] - p0[1])) / len;
    return facet(p0, p1, eave, (ridge - eave) / dist, apex);
  });
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const normalDeg = (a, b, inside) => {
  const nx = b[1] - a[1], ny = -(b[0] - a[0]);
  const m = mid(a, b);
  const s = nx * (inside[0] - m[0]) + ny * (inside[1] - m[1]) > 0 ? -1 : 1;
  return (Math.atan2(s * ny, s * nx) * 180) / Math.PI;
};
// Topstuk op de top van een gevel: blokje van 0,9 m met een plat dek.
const apexBlock = (cu, cv, alongU, top) =>
  prism(alongU ? R(cu - 0.45, cu + 0.45, cv - 0.3, cv + 0.3) : R(cu - 0.3, cu + 0.3, cv - 0.45, cv + 0.45), 18.3, top);

// ---------- schip en koor: langskap ----------
// Het koor krijgt ook de sluitingsvlakken, zodat het schild bij het nokeinde begint.
solids.push(roofed(R(NAVE_W, 20, -NAVE_V, NAVE_V), ridgeV(0, RIDGE, NAVE_PITCH)));
solids.push(roofed([[19.5, -NAVE_V], ...APSE, [19.5, NAVE_V]], [
  ...ridgeV(0, RIDGE, NAVE_PITCH),
  ...apsePlanes(APSE, CHOIR_EAVE, CHOIR_RIDGE_END, RIDGE),
]));
// Smalle stroken naast de toren tot de westgevel (plat, +13,6).
solids.push(prism(R(WEST_U, NAVE_W + 0.2, -5.0, 5.0), BASE, 13.6));

// ---------- zijbeuken: drie dwarskappen per zijde ----------
for (let k = 0; k < 3; k++) {
  const u0 = BAYS[k], u1 = BAYS[k + 1], c = (u0 + u1) / 2;
  for (const [v0, v1, out] of [[0, AISLE_N, 90], [AISLE_S, 0, 270]]) {
    solids.push(roofed(R(u0, u1, v0, v1), ridgeU(c, AISLE_RIDGE, AISLE_PITCH)));
    // Topgevel met een iets verhoogde rand en het topstuk.
    const vg = out === 90 ? AISLE_N : AISLE_S, vi = out === 90 ? AISLE_N - 0.6 : AISLE_S + 0.6;
    solids.push(roofed(R(u0, u1, vi, vg), ridgeU(c, AISLE_RIDGE + 0.25, AISLE_PITCH)));
    solids.push(apexBlock(c, (vg + vi) / 2, true, 20.1));
    // Groot tweelichtvenster en oculus in de topgevel.
    // In de middelste noordtravee staat het portaal tegen de oostkant; het venster wijkt naar het westen.
    if (k === 1 && out === 90) win([c - 0.8, vg], out, 3.2, 4.2, 11.6);
    else win([c, vg], out, 3.8, 4.2, 11.3);
    cuts.push(oculus([c, vg], out, 0, 16.2, 0.6));
  }
}
// Westelijke traveeën met langsnok en topgevel naar het westen, naast de toren.
for (const [v0, v1, rc] of [[4.5, AISLE_N, WEST_RIDGE_N], [AISLE_S, -4.5, WEST_RIDGE_S]]) {
  solids.push(roofed(R(WEST_U, BAYS[0] + 3.9, v0, v1), ridgeV(rc, AISLE_RIDGE, WEST_PITCH)));
  solids.push(roofed(R(WEST_U, WEST_U + 0.6, v0, v1), ridgeV(rc, AISLE_RIDGE + 0.25, WEST_PITCH)));
  solids.push(apexBlock(WEST_U + 0.3, rc, false, 20.1));
  win([WEST_U, rc], 180, 2.8, 4.0, 11.2);
  // Venster in de langsgevel van de westelijke travee.
  const vo = rc > 0 ? AISLE_N : AISLE_S;
  win([(WEST_U + BAYS[0]) / 2, vo], rc > 0 ? 90 : 270, 2.2, 4.4, 10.6);
}
// Dakkapellen op de westdaken van beide zijbeuken (foto noordgevel en luchtfoto).
solids.push(roofed(R(-22.1, -20.9, 11.4, 13.6), ridgeU(-21.5, 16.3, 1.0)));
solids.push(roofed(R(-22.1, -20.9, -14.1, -11.9), ridgeU(-21.5, 16.3, 1.0)));

// ---------- dwarsschip ----------
solids.push(roofed(R(TR_U0, TR_U1, TR_S, TR_N), ridgeU(TR_RIDGE_U, AISLE_RIDGE, TR_PITCH)));
for (const [vg, vi, out] of [[TR_N, TR_N - 0.6, 90], [TR_S, TR_S + 0.6, 270]]) {
  solids.push(roofed(R(TR_U0, TR_U1, vi, vg), ridgeU(TR_RIDGE_U, AISLE_RIDGE + 0.25, TR_PITCH)));
  solids.push(apexBlock(TR_RIDGE_U, (vg + vi) / 2, true, 20.2));
  win([TR_RIDGE_U, vg], out, 4.2, 4.0, 12.0);
  cuts.push(oculus([TR_RIDGE_U, vg], out, 0, 16.4, 0.6));
}
// Vensters in de west- en oostwanden van de kruisarmen voor zover vrij.
win([TR_U0, 17.9], 180, 2.2, 4.2, 11.0);
win([TR_U0, -18.3], 180, 2.2, 4.2, 11.0);
win([TR_U1, 18.3], 0, 2.0, 4.2, 10.8);
win([TR_U1, -17.6], 0, 2.0, 4.2, 10.8);
// Hoeksteunberen van de kruisarmen (gevel en zijwand) met natuurstenen hoekblokken.
for (const [v, sgn] of [[TR_N, 1], [TR_S, -1]]) {
  for (const [u, side] of [[TR_U0, 180], [TR_U1, 0]]) {
    const back = u === TR_U0 ? 1.3 : -1.3;
    solids.push(buttress([u + back, v], sgn > 0 ? 180 : 0, 1.0, 1.0, 11.0, 9.6));
    solids.push(buttress([u, v - sgn * 1.3], side + 90, 1.0, 1.0, 11.0, 9.6));
  }
}
// Schoorsteen tegen de oostwand van de zuidarm.
solids.push(prism(R(TR_U1 - 0.2, TR_U1 + 0.85, -14.15, -13.15), BASE, 15.6));

// ---------- koren ----------
// Vensters in de sluiting van het hoofdkoor en in de vrije noordwand.
for (let i = 0; i < APSE.length - 1; i++) {
  const a = APSE[i], b = APSE[i + 1];
  const w = Math.min(2.0, Math.hypot(b[0] - a[0], b[1] - a[1]) - 0.8);
  win(mid(a, b), normalDeg(a, b, CHOIR_RIDGE_END), w, 4.2, 10.6);
}
win([23.9, NAVE_V], 90, 1.8, 6.0, 10.4);
// Steunberen op de hoeken van de sluiting.
for (let i = 1; i < APSE.length - 1; i++) {
  const p = APSE[i];
  const theta = (Math.atan2(p[1] - CHOIR_RIDGE_END[1], p[0] - CHOIR_RIDGE_END[0]) * 180) / Math.PI;
  solids.push(buttress(p, theta + 90, 1.0, 1.0, 10.4, 9.0));
}
// Zijkoren met schilddak over de sluiting; het noordelijke dakvlak loopt door over de aanbouw.
const nscNorth = [0, -NSC_PITCH, NSC_RIDGE + NSC_PITCH * NSC_APEX[1]];
solids.push(roofed(NSC, [
  ...ridgeV(NSC_APEX[1], NSC_RIDGE, NSC_PITCH),
  ...apsePlanes(NSC.slice(1, 6), NSC_EAVE, NSC_APEX, NSC_RIDGE),
]));
solids.push(roofed(R(11.2, 17.6, 12.6, 16.75), [nscNorth]));
solids.push(roofed(SSC, [
  ...ridgeV(SSC_APEX[1], SSC_RIDGE, SSC_PITCH),
  ...apsePlanes(SSC.slice(1, 6), SSC_EAVE, SSC_APEX, SSC_RIDGE),
]));
for (const [pts, apex, z1] of [[NSC.slice(1, 6), NSC_APEX, 6.8], [SSC.slice(1, 6), SSC_APEX, 6.2]]) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    win(mid(a, b), normalDeg(a, b, apex), 1.5, 2.6, z1, 0.35);
  }
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const theta = (Math.atan2(p[1] - apex[1], p[0] - apex[0]) * 180) / Math.PI;
    solids.push(buttress(p, theta + 90, 0.9, 0.8, 7.0, 6.0));
  }
}
// Vensters in de aanbouw tegen het noordkoor.
for (const u of [13.0, 15.6]) win([u, 16.75], 90, 1.0, 1.4, 2.6, 0.3);
// Consistorie (zuidoost) onder een schilddak, goot +5,2, nok +9,3 tegen het koor.
solids.push(roofed(R(22.5, 28.75, -11.0, -NAVE_V + 0.2), [[1.3, 0, 5.2 - 1.3 * 22.5], [-1.3, 0, 5.2 + 1.3 * 28.75], [0, 1.3, 5.2 + 1.3 * 11.0]]));
for (const u of [24.2, 27.0]) win([u, -11.0], 270, 1.0, 1.5, 3.0, 0.3);

// ---------- portaal tegen de noordbeuk (midden XIV) ----------
const PU = [-9.9, -5.1], PC = (PU[0] + PU[1]) / 2, PV = 18.85;
solids.push(roofed(R(PU[0], PU[1], AISLE_N - 0.5, PV), ridgeU(PC, 8.4, 1.2)));
// Trapgevel naar het noorden: treden van 0,8 tot 1,6 m.
for (const [half, top] of [[2.4, 5.6], [1.6, 7.0], [0.8, 8.1], [0.45, 9.1]]) solids.push(prism(R(PC - half, PC + half, PV - 0.5, PV), BASE, top));
win([PC, PV], 90, 1.5, 0.05, 2.5, 0.5);
win([PC, PV], 90, 0.9, 3.6, 4.6, 0.3);

// ---------- steunberen van de zijbeuken ----------
for (const u of [BAYS[0], BAYS[1], BAYS[2]]) {
  if (!(u > PU[0] - 0.6 && u < PU[1] + 0.6)) solids.push(buttress([u, AISLE_N], 180, 1.0, 1.1, 9.0, 7.6));
  solids.push(buttress([u, AISLE_S], 0, 1.0, 1.1, 9.0, 7.6));
}
for (const [v, ang] of [[AISLE_N, 180], [AISLE_S, 0]]) solids.push(buttress([WEST_U + 0.5, v], ang, 1.0, 1.0, 9.0, 7.6));
for (const v of [12.0, -12.4]) solids.push(buttress([WEST_U, v], 270, 1.0, 1.0, 9.0, 7.6));

// ---------- plint ----------
const plan = CrossSection.union([
  new CrossSection([ccw(R(WEST_U, TR_U0, AISLE_S, AISLE_N))]),
  new CrossSection([ccw(R(TR_U0, TR_U1, TR_S, TR_N))]),
  new CrossSection([ccw(R(TR_U1 - 0.1, CHOIR_END, -NAVE_V, NAVE_V))]),
  new CrossSection([ccw(APSE)]),
  new CrossSection([ccw(NSC)]),
  new CrossSection([ccw(SSC)]),
  new CrossSection([ccw(R(T[0], T[1], T[2], T[3]))]),
]);
solids.push(Manifold.extrude(plan.offset(0.15, "Miter"), 0.6 - BASE).translate([0, 0, BASE]));

// ---------- toren ----------
// Vijf geledingen, elk 0,1 m terugliggend, met een waterlijst (45 graden) op elke geledingsgrens.
const levels = [BASE, ...BANDS, T_TOP - 0.6];
levels.slice(0, -1).forEach((z0, i) => {
  const z1 = levels[i + 1], ins = 0.1 * i;
  solids.push(prism(box(TC, THX - ins, THY - ins), z0, z1 + 0.05));
});
BANDS.forEach((z, i) => {
  const h = 0.1 * i;
  solids.push(loft([[z - 0.45, box(TC, THX - h, THY - h)], [z - 0.2, box(TC, THX - h + 0.2, THY - h + 0.2)], [z, box(TC, THX - h + 0.2, THY - h + 0.2)]]));
});
// Kroonlijst onder de borstwering, plat dak en gesloten borstwering met acht pinakels.
const TI = 0.4; // insprong van de bovenste geleding
solids.push(loft([[T_TOP - 0.8, box(TC, THX - TI, THY - TI)], [T_TOP - 0.2, box(TC, THX - TI + 0.3, THY - TI + 0.3)], [T_TOP, box(TC, THX - TI + 0.3, THY - TI + 0.3)]]));
const PX = THX - TI + 0.3, PY = THY - TI + 0.3;
solids.push(prism(box(TC, PX, PY), T_TOP - 0.05, PARAPET).subtract(prism(box(TC, PX - 0.5, PY - 0.5), T_TOP, PARAPET + 1)));
for (const [sx, sy] of [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]]) {
  const c = [TC[0] + sx * (PX - 0.45), TC[1] + sy * (PY - 0.45)];
  solids.push(pinnacle(c, 0.45, T_TOP - 0.05, PARAPET + 0.45 - T_TOP, 1.3));
}
// Achtkante leien helm, open lantaarn (dicht gemodelleerd), koepeltje en makelaar (hals 0,9 m, de bol erop is weggelaten).
solids.push(loft([[T_TOP - 0.05, oct(TC, 5.0)], [HELM_TOP, oct(TC, 1.6)]]));
solids.push(loft([
  [HELM_TOP - 0.05, oct(TC, 1.5)], [LANTERN_TOP, oct(TC, 1.5)], [LANTERN_TOP + 0.25, oct(TC, 1.9)], [LANTERN_TOP + 0.45, oct(TC, 1.9)],
  [37.6, oct(TC, 1.2)], [38.1, oct(TC, 0.9)], [38.5, oct(TC, 0.9)], [SPIRE_TOP, tip(TC)],
]));
// Nissen: per geleding een fries van vier blinde boogjes onder de waterlijst (rondboogfries, vergroot tot 1 m),
// in de bovenste geleding drie hoge spitsboognissen per zijde (de middelste als galmgat).
const faces = [[180, THX], [0, THX], [90, THY], [270, THY]];
for (const [ang, a] of faces) {
  const along = ang === 90 || ang === 270 ? THX : THY;
  for (let i = 0; i < 4; i++) {
    const ins = 0.1 * i;
    // Fries alleen waar de toren vrij staat: de onderste drie geledingen niet aan de kant van het schip.
    if (ang === 0 && BANDS[i] < 20) continue;
    for (let k = 0; k < 4; k++) {
      const s = (k - 1.5) * 1.8;
      if (Math.abs(s) + 0.5 > along - 0.3) continue;
      // Noord- en zuidzijde: niet waar de smalle strook naast de toren tegen de wand staat (tot +13,6).
      const uc = ang === 90 ? TC[0] - s : ang === 270 ? TC[0] + s : 0;
      if ((ang === 90 || ang === 270) && BANDS[i] < 14 && uc + 0.5 > WEST_U - 0.1) continue;
      cuts.push(niche(TC, ang, a - ins, s, 1.0, BANDS[i] - 2.4, BANDS[i] - 1.4, 0.3));
    }
  }
  for (const s of [-2.2, 0, 2.2]) cuts.push(niche(TC, ang, a - 0.4, s, 1.4, 24.3, 27.2, s === 0 ? 0.5 : 0.32));
}
// Westingang (torenportaal) en de bogen in de noord- en zuidwand van de torenvoet.
cuts.push(niche(TC, 180, THX, 0, 1.9, 0.05, 3.0, 0.6));
cuts.push(niche([-29.3, T[3]], 90, 0, 0, 2.3, 0.05, 2.9, 0.9));
cuts.push(niche([-29.3, T[2]], 270, 0, 0, 2.3, 0.05, 2.9, 0.9));
// Spitsboogvenster boven de westingang in de tweede geleding.
cuts.push(niche(TC, 180, THX - 0.1, 0, 1.2, 7.9, 8.9, 0.35));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE).translate([-SHIFT[0], -SHIFT[1], 0]);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Grote Kerk Vianen",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0620100000008628"],
  plate: false,
  description:
    "Grote Kerk aan de Voorstraat in Vianen: kruiskerk met schip van het Haagse halletype (langskap met drie dwarskappen en topgevels per zijbeuk, westelijke traveeën met langsnok), dwarsschip met kopgevels, hoofdkoor met vijfzijdige sluiting (nok +19,35 m), lagere zijkoren met veelhoekige sluiting, consistorie en noordportaal met trapgevel, en de westtoren van vijf geledingen met borstwering, achtkante helm en lantaarn tot +40,3 m. Oorsprong RD (134835,83; 444931,62) op de kruising van de nokken van schip en dwarsschip op maaiveld (NAP +3,5 m), X-as langs de nok van toren naar koor onder 15,5 graden. Vensters en friezen als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "toren XIV (verhoogd XV B), koren XIV B-XV, schip en dwarsschip na de brand van 1540 (Cornelis Frederiksz. van der Gouwe)",
    monument: [37388, 37389],
    groundNapM: 3.5,
    naveRidgeM: RIDGE,
    aisleGableRidgeM: AISLE_RIDGE,
    sideChoirRidgeM: NSC_RIDGE,
    towerRoofM: T_TOP,
    towerParapetM: PARAPET,
    towerTopM: SPIRE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://de.wikipedia.org/wiki/Grote_Kerk_(Vianen)",
    "https://reliwiki.nl/index.php/Vianen,_Voorstraat_110_-_Grote_Kerk",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/37389 (kerk)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/37388 (toren)",
    "https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Vianen (RCE 20300603, 20300604, 20300607, 20300610, 20300611, 20300613, 20241799; DSCF8567-8573; panoramio 2015)",
    "BAG pand 0620100000008628 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

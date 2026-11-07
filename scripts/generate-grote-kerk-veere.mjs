import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-veere");
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

// Grote of Onze-Lieve-Vrouwekerk, Veere: laatgotische kruisbasiliek (1479-1521, Keldermans) met de
// onvoltooide westtoren onder een vierzijdige koepelkap, schip met lichtbeuk, zijbeuken met kapellen
// onder eigen zadeldaken, hoog transept met afgewolfde kopgevels en hoektorentjes, en in het oosten de
// lage hallenkerk met twee driezijdig gesloten beuken (tweede helft 16e eeuw, gerestaureerd 1950).
const SLUG = "grote-kerk-veere";
const BASE = -0.5;
// Stelsel: oorsprong op het kruispunt van de nokken van schip en transept op maaiveld (NAP +2,2 m),
// +u langs de nok van het schip van west naar oost (RD-richting 25,6 graden), +v naar het noorden.
// De nokken (3D BAG LoD2.2) en de gevels van de BAG-contour lopen evenwijdig aan die as.
const ORIGIN = [35729.39, 396766.97];
const AXIS_DEG = 25.6;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 46,88, toren noord 46,64 en zuid 46,99,
// zijbeuken 46,70 en 47,10, transept noord en zuid 46,54, hallenkerk 46,60 tot 46,65 (PDOK-terreintegels, november 2026);
// het PDOK-pand staat op 46,49 tot 46,52.
const GROUND_ELLIPSOID = 46.54;
const GROUND_SAMPLES = [[-58, 0], [-50, -14], [-50, 14], [-25, -20], [-25, 20], [0, -30], [0, 30], [18, -20], [32, -8], [32, -2]];

// ---------- maten (meter boven maaiveld) ----------
// Schip en transept: nok +32,55 (3D BAG 32,5 en 32,57), schip helling 1,25 tussen muren op v = +-6,9 (goot +23,9),
// transept helling 1,35 tussen muren op u = -6,4 en 6,25 (BAG) en afgewolfde kopgevels op v = 25,65 en -25,25.
const RIDGE = 32.55, NAVE_PITCH = 1.25, NAVE_V = 6.9;
const TR_W = -6.4, TR_E = 6.25, TR_N = 25.65, TR_S = -25.25, TR_PITCH = 1.35, TR_EAVE = 24.0;
// Zijbeuken met kapellen: buitenmuren v = 15,9 en -16,15, westmuur u = -46,5 (BAG); eigen zadeldaken met nok +17,2
// boven het midden van de beuk, helling 1,05, en een schild van helling 1,0 aan de westkant (3D BAG).
const AISLE_N = 15.9, AISLE_S = -16.15, AISLE_W = -46.5, AISLE_RIDGE = 17.2, AISLE_PITCH = 1.05;
const AISLE_EAVE = 12.4;
// Steunberen van de zijbeuken (BAG: 0,75 breed, 1,3 diep) en de traveeën ertussen.
const BUTTRESS_U = [-40.6, -35.6, -30.7, -25.8, -20.9, -16.0, -11.1];
const BAYS = [-43.35, -38.1, -33.15, -28.25, -23.35, -18.45, -13.55, -8.75];
// Westtoren (onvoltooid, 1 geleding): kern u -51,6 tot -36,9, v -8,0 tot 7,8; plat dak met omgang op +37,7 en
// een vierzijdige koepelkap tot +44,2 met lantaarntje (AHN-DSM).
const TW_W = -51.6, TW_E = -36.9, TW_S = -8.0, TW_N = 7.8, TW_TOP = 37.7;
const TW_C = [-44.25, -0.1];
// Hallenkerk: twee beuken met driezijdige sluiting; nokken +16,9 op v = -3,1 en -11,9, helling 1,5 (3D BAG).
const HALL_RIDGE = 16.9, HALL_PITCH = 1.5, HALL_N = 1.25, HALL_MID = -7.4, HALL_S = -16.4;

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const normalDeg = (a, b, inside) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  let n = [dy, -dx];
  const m = mid(a, b);
  if (n[0] * (inside[0] - m[0]) + n[1] * (inside[1] - m[1]) > 0) n = [-n[0], -n[1]];
  return (Math.atan2(n[1], n[0]) * 180) / Math.PI;
};
// Blinde vensternis met spitse top; angle is de normaal van de gevel (0 = +u, 90 = +v, 180 = -u, 270 = -v).
const win = (p, angle, w, z0, z1, d = 0.4) => cuts.push(niche(p, angle, 0, 0, w, z0, z1, d));
// Spiegeling van de toren om zijn hartlijn v = -0,1.
const mirrorV = (pts) => pts.map(([u, v]) => [u, -0.2 - v]).reverse();

// ---------- schip en transept ----------
solids.push(roofed(R(TW_E - 0.6, TR_W + 0.5, -NAVE_V, NAVE_V), ridgeV(0, RIDGE, NAVE_PITCH)));
solids.push(roofed(R(TR_W, TR_E, TR_S, TR_N), [
  ...ridgeU(0, RIDGE, TR_PITCH),
  [0, -TR_PITCH, TR_EAVE + TR_PITCH * TR_N],
  [0, TR_PITCH, TR_EAVE - TR_PITCH * TR_S],
]));
// Lichtbeuk: per travee een rondboogvenster (als spitse nis) en een lisene tussen de traveeën (foto noordzijde).
for (const u of BAYS.slice(2)) {
  win([u, NAVE_V], 90, 3.0, 15.0, 18.6);
  win([u, -NAVE_V], 270, 3.0, 15.0, 18.6);
}
for (const u of BUTTRESS_U.slice(1)) {
  solids.push(buttress([u, NAVE_V], 180, 0.8, 0.5, 23.6, 22.8));
  solids.push(buttress([u, -NAVE_V], 0, 0.8, 0.5, 23.6, 22.8));
}

// ---------- zijbeuken met kapellen ----------
for (const side of [1, -1]) {
  const outer = side > 0 ? AISLE_N : AISLE_S;
  const ridgeAt = side * (NAVE_V + Math.abs(outer - side * NAVE_V) / 2);
  solids.push(roofed(R(AISLE_W, TR_W + 0.3, side * (NAVE_V - 0.3), outer), [
    ...ridgeV(ridgeAt, AISLE_RIDGE, AISLE_PITCH),
    [1.0, 0, AISLE_EAVE - AISLE_W],
  ]));
  // Steunberen tussen de kapellen, op de westhoek en op de westgevel (BAG).
  for (const u of [AISLE_W + 0.4, ...BUTTRESS_U]) solids.push(buttress([u, outer], side > 0 ? 180 : 0, 0.75, 1.3, 11.6, 10.4));
  for (const v of side > 0 ? [11.7, 15.15] : [-11.65, -15.8]) solids.push(buttress([AISLE_W, v], 270, 0.8, 1.3, 11.6, 10.4));
  // Kapelgevels: een grote blinde boog met twee bovenvensters, daaronder twee vensters (foto noordzijde).
  for (const u of BAYS) {
    const ang = side > 0 ? 90 : 270;
    win([u, outer], ang, 3.3, 4.6, 8.3, 0.3);
    for (const s of [-0.8, 0.8]) {
      win([u + s, outer], ang, 1.0, 5.2, 7.6, 0.6);
      win([u + s, outer], ang, 1.0, 1.2, 3.6, 0.4);
    }
  }
  win([AISLE_W, side > 0 ? 13.4 : -13.7], 180, 1.6, 2.5, 8.0);
}

// ---------- westtoren ----------
solids.push(prism(R(TW_W, TW_E, TW_S, TW_N), BASE, TW_TOP));
// Westhoeken: zware traptorens met versnijdingen op +21 en +30 (BAG, AHN-DSM: +30 tot +31 op de traptorens).
const NW = [
  [[-53.75, 4.5], [-48.6, 4.5], [-48.6, 9.8], [-50.8, 9.8], [-53.75, 6.7]],
  [[-52.75, 5.0], [-49.1, 5.0], [-49.1, 8.8], [-51.1, 8.8], [-52.75, 7.1]],
  [[-52.0, 5.4], [-49.6, 5.4], [-49.6, 8.3], [-51.3, 8.3], [-52.0, 7.5]],
  [[-51.6, 5.6], [-49.6, 5.6], [-49.6, 7.8], [-51.6, 7.8]],
];
// Oosthoeken: hoeksteunberen naast het schip tot circa +28 (AHN-DSM).
const NE = [
  [[-39.6, 5.8], [-36.2, 5.8], [-36.2, 9.3], [-39.6, 9.3]],
  [[-39.6, 5.8], [-37.0, 5.8], [-37.0, 8.5], [-39.6, 8.5]],
  [[-39.6, 5.8], [-36.9, 5.8], [-36.9, 7.8], [-39.6, 7.8]],
];
for (const m of [(p) => p, mirrorV]) {
  const w = NW.map(m), e = NE.map(m);
  solids.push(loft([[BASE, w[0]], [21.0, w[0]], [22.0, w[1]], [30.0, w[1]], [30.8, w[2]], [34.6, w[2]], [35.2, w[3]]]));
  solids.push(loft([[BASE, e[0]], [27.5, e[0]], [28.3, e[1]], [31.5, e[1]], [32.2, e[2]]]));
}
// Vierzijdige koepelkap op de omgang (AHN-DSM: voet +38,7 op 5,6 en 6,0 m van het hart, plateau +44,2 tot +44,5),
// met een lantaarntje met tentdakje.
const capRect = ([cu, cv], hu, hv) => [[cu - hu, cv - hv], [cu + hu, cv - hv], [cu + hu, cv + hv], [cu - hu, cv + hv]];
solids.push(loft([
  [TW_TOP - 0.01, capRect(TW_C, 5.6, 6.0)],
  [39.4, capRect(TW_C, 5.45, 5.85)],
  [40.9, capRect(TW_C, 5.0, 5.4)],
  [42.1, capRect(TW_C, 4.35, 4.75)],
  [43.1, capRect(TW_C, 3.55, 3.95)],
  [43.8, capRect(TW_C, 2.7, 3.1)],
  [44.2, capRect(TW_C, 1.9, 2.3)],
]));
solids.push(loft([[44.1, sq(TW_C, 1.0)], [45.4, sq(TW_C, 1.0)], [46.6, tip(TW_C)]]));
// Westgevel: de grote spitsboognis tussen de traptorens met de vensters van de ingemetselde vulling en de
// ingang; in de bovengeleding van west-, noord- en zuidgevel een hoge blinde spitsboognis (foto's).
cuts.push(niche([TW_W, -0.15], 180, 0, 0, 9.2, 0.0, 13.0, 1.0));
for (const [z0, z1, ss] of [[4.6, 6.4, [-2.4, 0, 2.4]], [8.0, 9.8, [-2.4, 0, 2.4]], [11.4, 13.4, [-1.3, 1.3]]]) {
  for (const s of ss) win([TW_W + 1.0, -0.15 + s], 180, 1.1, z0, z1, 0.3);
}
win([TW_W + 1.0, -0.15], 180, 3.6, 0.0, 2.8, 0.5);
win([TW_W, -0.15], 180, 3.6, 23.0, 31.5, 0.6);
win([TW_C[0], TW_N], 90, 3.6, 23.0, 31.5, 0.6);
win([TW_C[0], TW_S], 270, 3.6, 23.0, 31.5, 0.6);

// ---------- transept ----------
// Hoektorentjes (achtkant met spitsje), hoeksteunberen en de traptoren aan de oostkant van de noordarm (BAG).
for (const c of [[7.2, 26.5], [-6.9, 26.5], [6.9, -26.15], [-7.0, -26.15]]) {
  solids.push(loft([[BASE, oct(c, 2.2)], [25.6, oct(c, 2.2)], [25.9, oct(c, 2.5)], [26.2, oct(c, 2.5)], [28.6, tip(c)]]));
}
// Hoekblokken onder de oostelijke hoektorentjes (dichten de kier tussen torentje, steunberen en gevel).
solids.push(prism(R(TR_E - 0.3, 7.4, TR_N - 0.3, 26.4), BASE, 21.5));
solids.push(prism(R(5.6, 7.2, -26.0, TR_S + 0.3), BASE, 21.5));
solids.push(buttress([5.8, TR_N], 180, 1.0, 1.65, 21.5, 20.0));
solids.push(buttress([TR_E, 25.0], 90, 1.15, 1.85, 21.5, 20.0));
solids.push(buttress([-5.65, TR_N], 180, 1.1, 1.65, 21.5, 20.0));
solids.push(buttress([TR_W, 25.3], 270, 0.85, 1.2, 21.5, 20.0));
solids.push(buttress([TR_W, 17.9], 270, 0.8, 1.3, 20.0, 18.5));
solids.push(buttress([-5.85, TR_S], 0, 1.05, 1.75, 21.5, 20.0));
solids.push(buttress([TR_W, -24.6], 270, 1.3, 1.9, 21.5, 20.0));
solids.push(buttress([5.4, TR_S], 0, 1.0, 1.75, 21.5, 20.0));
solids.push(loft([[BASE, R(TR_E - 0.1, 8.1, 15.7, 19.2)], [25.8, R(TR_E - 0.1, 8.1, 15.7, 19.2)], [28.3, tip([7.15, 17.45])]]));
// Kopgevels met een hoog venster, zijgevels met vensters per travee en bovenvensters boven de zijbeuken.
win([0, TR_N], 90, 6.0, 5.5, 16.5, 0.5);
win([0, TR_S], 270, 6.0, 5.5, 16.5, 0.5);
win([TR_W, 21.6], 180, 2.6, 5.0, 15.5);
win([TR_W, -21.4], 180, 2.6, 6.0, 15.5);
for (const v of [6.5, 11.5, 22.0]) win([TR_E, v], 0, 2.6, 5.0, 15.5);
win([TR_E, -20.7], 0, 2.4, 12.5, 17.0);
win([TR_W, 11.4], 180, 2.4, 18.0, 20.5);
win([TR_W, -11.5], 180, 2.4, 18.0, 20.5);

// ---------- hallenkerk in het oosten ----------
const hallN = [[TR_E - 0.25, HALL_N], [23.3, HALL_N], [26.8, -0.9], [26.8, -5.3], [25.0, HALL_MID], [TR_E - 0.25, HALL_MID]];
const hallS = [[TR_E - 0.25, HALL_MID], [25.0, HALL_MID], [28.0, -9.5], [28.0, -14.0], [24.0, HALL_S], [TR_E - 0.25, HALL_S]];
for (const [plan, v0, inside] of [[hallN, (HALL_N + HALL_MID) / 2, [15, -3.1]], [hallS, (HALL_MID + HALL_S) / 2, [15, -11.9]]]) {
  const eave = HALL_RIDGE - HALL_PITCH * Math.abs(plan[0][1] - v0);
  solids.push(roofed(plan, [
    ...ridgeV(v0, HALL_RIDGE, HALL_PITCH),
    facet(plan[1], plan[2], eave, HALL_PITCH, inside),
    facet(plan[2], plan[3], eave, HALL_PITCH, inside),
    facet(plan[3], plan[4], eave, HALL_PITCH, inside),
  ]));
  // Spitsboogvensters in de sluiting.
  for (let i = 1; i < 4; i++) {
    const a = plan[i], b = plan[i + 1];
    win(mid(a, b), normalDeg(a, b, inside), i === 2 ? 2.6 : 1.8, 2.8, i === 2 ? 7.3 : 7.6);
  }
}
// Steunberen: noord- en zuidmuur (BAG) en schuin op de hoeken van de sluitingen.
for (const u of [17.4, 22.8]) solids.push(buttress([u, HALL_N], 180, 1.05, 1.35, 9.6, 8.6));
for (const [u, d] of [[15.05, 1.3], [19.35, 1.4], [23.5, 0.8]]) solids.push(buttress([u, HALL_S], 0, 1.05, d, 9.4, 8.4));
for (const [p, a] of [[[28.0, -14.0], 45], [[28.0, -9.5], 121], [[26.8, -5.3], 59], [[26.8, -0.9], 121]]) {
  solids.push(buttress(p, a, 0.9, 1.3, 9.4, 8.4));
}
for (const u of [15.0, 20.1]) win([u, HALL_N], 90, 2.2, 2.8, 7.6);
for (const u of [13.2, 17.2, 21.4]) win([u, HALL_S], 270, 2.2, 2.8, 7.6);
// Schoorsteen in de kilgoot tussen de twee beuken (foto oostzijde).
solids.push(prism(sq([10.5, HALL_MID], 0.5), BASE, 17.6));

// ---------- aanbouwen ----------
// Tussen zuidtransept en hallenkerk: lessenaarsdak van +11,2 naar +7,5 (3D BAG), met vensters en een steunbeer.
solids.push(roofed(R(TR_E - 0.25, 11.4, -25.0, HALL_S + 0.1), [[-0.69, 0, 15.37]]));
solids.push(buttress([11.4, -20.1], 90, 1.0, 1.2, 6.0, 5.0));
for (const v of [-18.2, -22.6]) win([11.4, v], 0, 1.4, 1.5, 4.2, 0.3);
// Lage aanbouw west van het zuidtransept (+2,8 tot +3,7, 3D BAG) en tegen de noordmuur van de hallenkerk.
const lean = [[0.31, 0, 2.8 + 0.31 * 9.45]];
for (const r of [R(-9.45, TR_W + 0.2, -23.9, -18.85), R(-8.3, TR_W + 0.2, -25.25, -23.9), R(-8.3, TR_W + 0.2, -18.9, -17.5)]) solids.push(roofed(r, lean));
for (const r of [R(7.0, 13.1, HALL_N - 0.25, 2.7), R(8.2, 12.1, 2.6, 3.6)]) solids.push(roofed(r, [[0, -0.43, 4.5 + 0.43 * HALL_N]]));

// ---------- plint ----------
const plan = CrossSection.union([
  new CrossSection([ccw(R(AISLE_W, TR_W + 0.3, AISLE_S, AISLE_N))]),
  new CrossSection([ccw(R(TW_W, TW_E, TW_S, TW_N))]),
  new CrossSection([ccw(R(TR_W, TR_E, TR_S, TR_N))]),
  new CrossSection([ccw(hallN)]),
  new CrossSection([ccw(hallS)]),
]);
const plinth = Manifold.extrude(plan.offset(0.15, "Miter"), 0.8 - BASE).translate([0, 0, BASE]);

let complex = Manifold.union([...solids, plinth]).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Grote of Onze-Lieve-Vrouwekerk Veere",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0717100000020522"],
  plate: false,
  description:
    "Grote of Onze-Lieve-Vrouwekerk in Veere: laatgotische kruisbasiliek (1479-1521, Keldermans) met de onvoltooide westtoren met traptorens, grote westnis en vierzijdige koepelkap met lantaarntje (+46,6 m), schip met lichtbeuk, zijbeuken met kapellen onder eigen zadeldaken met westschild, hoog transept met afgewolfde kopgevels en vier hoektorentjes, en de lage hallenkerk met twee driezijdig gesloten beuken in het oosten. Oorsprong RD (35729,39; 396766,97) op het kruispunt van de nokken op maaiveld (NAP +2,2 m), X-as langs de nok van het schip onder 25,6 graden. Vensters en nissen als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "1479-1521 (Antoon I en Rombout II Keldermans), hallenkerk tweede helft 16e eeuw, noordelijke koorbeuk gesloopt 1837",
    monument: 36967,
    groundNapM: 2.2,
    ridgeM: RIDGE,
    naveEaveM: +(RIDGE - NAVE_PITCH * NAVE_V).toFixed(2),
    aisleRidgeM: AISLE_RIDGE,
    towerPlatformM: TW_TOP,
    towerCapM: 44.2,
    hallRidgeM: HALL_RIDGE,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_Kerk_(Veere)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/36967",
    "https://commons.wikimedia.org/wiki/Category:Exterior_of_Grote_Kerk_(Veere) (RCE-foto's 20396704, 20270402, 20270405, 20270407, 20270414, 20270406, 20379806; 2022 Grote Kerk, Veere (1-3); 2026 Grote Kerk, Veere (1-2); Veere Grote Kerk 1 en 3)",
    "BAG pand 0717100000020522 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

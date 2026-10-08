// Genereert een vereenvoudigd, gesloten 3D-model van de Hooglandse Kerk in
// Leiden: de gotische kruiskerk met het karakteristieke silhouet van een laag
// schip en een lage torenstomp tegen de hoge dwarsbeuk en het hoge koor, de
// veelhoekige koorsluiting met de kooromgang, de zijbeuken langs schip,
// dwarsbeuk en koor met per travee een dwars dak met een schild naar buiten,
// de dakruiter op de kruising, het noord- en zuidportaal met hun topgevels,
// pinakels en traptorens, het portaal voor de toren en de lage aanbouwen aan
// de zuidkant van het koor. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-hooglandse-kerk.mjs              # 1:1000 (standaard)
//   node scripts/generate-hooglandse-kerk.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken van
// dwarsbeuk en koor lopen onder 58 graden omhoog, die van schip en zijbeuken
// onder 45 tot 50 graden, de lessenaarsdaken flauwer maar naar boven, de
// toren, de traptorens, de pinakels en de dakruiter worden naar boven smaller,
// de spitsboognissen hebben bovenin flanken van 47 graden en er kraagt niets
// uit.
//
// Assenstelsel: oorsprong op RD (93892,93, 463687,05), het hart van de
// kruising, op het maaiveld (NAP +1,5 m), Z omhoog. +X loopt langs de as van
// de kerk van de toren naar het koor (RD-richting 13,5 graden, net ten
// noorden van oost), +Y naar het noorden.
//
// Bronnen: BAG-pand 0546100000038521 (contour met steunberen, toren en
// aanbouwen); AHN DSM/DTM 0,5 m (PDOK WCS) in een stelsel langs de as:
// dwarsprofielen van schip (goot NAP +17,8 m, nok +22,7 m), dwarsbeuk en koor
// (goot +27,6 tot +28,5 m, nok +38,5 m), de daken van de zijbeuken (goot
// +16,2 m, nokken +19,5 m), de toren (romp +28,3 m, tentdak tot +33 m), de
// dakruiter (DSM tot +50,9 m), de kooromgang, de aanbouwen en het maaiveld;
// Wikipedia (70,7 × 65,7 m); PDOK luchtfoto; foto's op Wikimedia Commons van
// het noord- en zuidportaal.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hooglandse-kerk");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- stelsel (s langs de as, t naar het noorden; hoogtes in NAP) ----------
// Het meetstelsel heeft zijn nulpunt op RD (93893,2, 463690,2), het
// zwaartepunt van de BAG-contour; de as van schip en koor ligt op t = -3, die
// van de dwarsbeuk op s = -1.
const ANGLE = (13.5 * Math.PI) / 180;
const U = [Math.cos(ANGLE), Math.sin(ANGLE)];
const FRAME = [93893.2, 463690.2];
const AXIS_T = -3;
const CROSS_S = -1;
const ORIGIN = [
  FRAME[0] + U[0] * CROSS_S - U[1] * AXIS_T,
  FRAME[1] + U[1] * CROSS_S + U[0] * AXIS_T,
].map((v) => +v.toFixed(2));
const GROUND_NAP = 1.5;
const z = (nap) => nap - GROUND_NAP;
const BASE = -0.5;

// BAG-pand 0546100000038521 in (s, t).
const OUTLINE = [
  [38.40, -7.97], [40.12, -8.43], [40.59, -7.13], [38.95, -6.75], [39.14, 0.89], [40.72, 1.39], [40.62, 2.52],
  [38.60, 2.11], [34.27, 8.09], [35.27, 9.81], [34.06, 10.53], [33.05, 8.80], [27.11, 10.60], [27.45, 11.56],
  [26.91, 11.79], [24.76, 11.76], [11.43, 11.55], [11.46, 29.20], [13.65, 28.73], [13.63, 29.41], [12.78, 30.45],
  [12.74, 31.19], [11.03, 31.23], [11.05, 32.84], [9.84, 32.81], [9.82, 31.20], [5.86, 31.19], [5.87, 32.14],
  [5.29, 32.72], [4.05, 32.82], [3.93, 32.71], [3.26, 32.13], [3.24, 31.13], [2.15, 31.19], [1.21, 30.32],
  [-3.43, 30.31], [-4.30, 31.25], [-5.38, 31.14], [-5.43, 32.20], [-6.02, 32.73], [-7.43, 32.82], [-8.19, 32.12],
  [-8.19, 31.18], [-12.22, 31.17], [-12.22, 32.73], [-13.25, 32.82], [-13.25, 31.31], [-13.19, 24.09], [-14.69, 24.07],
  [-14.68, 23.07], [-13.18, 23.09], [-13.21, 22.36], [-13.17, 17.73], [-14.87, 17.71], [-14.86, 16.56], [-13.14, 16.58],
  [-13.09, 11.67], [-17.29, 11.63], [-17.31, 13.58], [-18.51, 13.57], [-18.49, 11.62], [-23.04, 11.57], [-23.06, 13.52],
  [-24.26, 13.51], [-24.24, 11.56], [-28.60, 11.52], [-28.61, 12.36], [-28.62, 13.43], [-29.68, 13.45], [-29.72, 11.50],
  [-36.68, 11.43], [-36.69, 7.99], [-36.73, 0.15], [-41.20, 0.15], [-41.39, 0.15], [-41.51, -5.64], [-41.14, -5.63],
  [-36.77, -5.66], [-36.84, -11.45], [-32.03, -11.52], [-27.51, -11.58], [-22.39, -11.65], [-18.23, -11.71], [-12.76, -11.79],
  [-12.82, -16.29], [-12.91, -23.01], [-12.97, -27.50], [-14.77, -27.48], [-14.79, -29.14], [-12.95, -29.17], [-13.02, -35.17],
  [-14.61, -35.16], [-14.62, -36.49], [-12.90, -36.52], [-12.92, -38.40], [-11.06, -38.43], [-11.02, -36.20], [-6.72, -36.25],
  [-6.74, -37.41], [-6.08, -38.27], [-5.02, -38.20], [-4.26, -37.39], [-4.38, -36.17], [3.75, -36.00], [3.78, -37.62],
  [4.58, -38.23], [5.67, -38.23], [6.28, -37.43], [6.22, -36.11], [10.25, -35.95], [10.32, -37.76], [11.95, -37.69],
  [11.89, -36.12], [13.55, -36.06], [13.48, -34.39], [11.64, -34.46], [11.40, -28.49], [13.36, -28.41], [13.31, -26.99],
  [11.86, -27.05], [11.71, -22.84], [11.68, -22.17], [13.40, -22.17], [13.34, -21.32], [20.18, -21.33], [24.74, -25.84],
  [30.13, -20.29], [27.52, -17.75], [27.20, -15.76], [32.36, -13.92], [33.94, -16.00], [34.94, -15.30], [33.87, -13.89],
];
// Lage aanbouwen en de voet van alles binnen de contour.
const LOW = 9.0;
// Schip: muren op t = -8 en +2, goot +17,8 m, nok +22,7 m op de as, van de
// westgevel tot s = -13; daar loopt het dak op tot +28,5 m tegen de dwarsbeuk.
const NAVE = { west: -36.7, east: -13, t0: -8, t1: 2, eave: 17.8, ridge: 22.7, rise: 28.5 };
// Dwarsbeuk: muren op s = -7,75 en 5,75, goot +27,6 m, nok +38,6 m.
const TRANSEPT = { s0: -7.75, s1: 5.75, south: -36.3, north: 31.2, eave: 27.6, ridge: 38.6 };
// Koor: muren op t = -10,1 en 3,6, goot +28,5 m, nok +38,4 m, tot het begin
// van de koorsluiting op s = 24,8.
const CHOIR = { west: 5.75, east: 24.8, t0: -10.1, t1: 3.6, eave: 28.5, ridge: 38.4 };
// Zijbeuken: daken dwars op de muur met een schild naar buiten, goot +16,2 m,
// nok +19,5 m. Per strook: de richting van de nokken, de grenzen van de
// travees langs de muur en de binnen- en buitenkant dwars op de muur.
const BAY = { eave: 16.2, ridge: 19.5 };
const AISLES = [
  // Langs het schip (nokken dwars op de as).
  { along: "s", bounds: [-39, -33, -27, -21, -15, -9], inner: 2, outer: 11.6 },
  { along: "s", bounds: [-39, -33, -27, -21, -15, -9], inner: -8, outer: -11.8 },
  // Langs het koor.
  { along: "s", bounds: [7.5, 13, 18, 23.5, 29, 34.5], inner: 3.6, outer: 11.7 },
  { along: "s", bounds: [7.5, 13, 18, 23.5, 29, 34.5], inner: -10.1, outer: -17.5 },
  // Langs de dwarsbeuk (nokken evenwijdig aan de as).
  { along: "t", bounds: [-39, -32.5, -26, -19.5], inner: -7.75, outer: -13.2 },
  { along: "t", bounds: [-39, -32.5, -26, -19.5], inner: 5.75, outer: 11.6 },
  { along: "t", bounds: [13.5, 20.25, 27, 33.75], inner: -7.75, outer: -13.2 },
  { along: "t", bounds: [13.5, 20.25, 27, 33.75], inner: 5.75, outer: 11.6 },
];
// Platte zijbeuken in de hoeken tussen dwarsbeuk, schip en koor (+17,7 m).
const FLAT_AISLES = { top: 17.7, zones: [[[-13.2, -7.75], [-19.5, -8]], [[-13.2, -7.75], [2, 13.5]], [[5.75, 11.6], [-19.5, -10.1]], [[5.75, 11.6], [3.6, 13.5]]] };
// Kooromgang om de koorsluiting: lessenaarsdak van +19,5 m tegen het koor tot
// +15,5 m op 7,5 m daarbuiten.
const AMBULATORY = { width: 7.5, inner: 19.5, outer: 15.5 };
// Aanbouwen ten zuiden van het koor en op de zuidoosthoek (+10 m).
const ANNEX = { s: [11.6, 40], t: [-30, -17.5], top: 10.0 };
// Torenstomp: romp tot +28,3 m, tentdak tot +33 m.
const TOWER = { s: [-37.7, -32.7], t: [-6.7, 0.3], top: 28.3, tip: 33.0 };
// Portaal voor de toren: lessenaarsdak van +9 m tot +12,3 m tegen de toren.
const PORCH = { s: [-41.6, -37.7], t: [-5.7, 0.2], low: 9.0, high: 12.3 };
// Dakruiter op de kruising: achtkante lantaarn tot +44 m, spits tot +51 m.
const ROOF_TURRET = { c: [CROSS_S, AXIS_T], apothem: 1.5, top: 44.0, tip: 51.0 };
// Kopgevels van de dwarsbeuk (foto's van het noord- en zuidportaal; AHN aan
// de zuidkant tot NAP +40,9 m): de topgevel steekt 1,5 m boven de goot en
// 1,6 m boven de nok uit, 1 m dik, met pinakels van 0,9 m die 2 m boven de
// gevelrand uitsteken en een makelaar tot +41,0 m. De traptorens op de
// hoeken (BAG-contour) hebben een achtkante romp tot +32 m en een spits tot
// +36,7 m (noord) en +38,5 m (zuid). Het noordportaal ligt 0,9 m in de gevel
// (BAG), het zuidportaal 0,6 m; het venster is een nis van 0,5 m.
const PORTAL_CROWN = { eaveRise: 1.5, ridgeRise: 1.6, thickness: 1.0, pinnacle: 0.9, pinnacleRise: 2.0, finial: 41.0 };
const TURRET = { apothem: 1.3, top: 32.0 };
const PORTALS = [
  { face: 31.2, dir: 1, turrets: [[-6.8, 32.0], [4.7, 32.0]], spire: 36.7, doorDepth: 0.9 },
  { face: -36.1, dir: -1, turrets: [[-5.6, -37.4], [5.0, -37.4]], spire: 38.5, doorDepth: 0.6 },
];
const PORTAL_WINDOW = { width: 6.4, bottom: 11.0, spring: 24.0, rise: 3.5, depth: 0.5 };
const PORTAL_DOOR = { width: 4.4, bottom: 1.0, spring: 6.5, rise: 2.4 };
// Maaiveld rondom (AHN NAP +1,4 tot +1,6 m): de Nieuwstraat voor de toren,
// het plein ten zuiden van het schip, de straten aan de noord- en oostkant.
const GROUND_SAMPLES = [[-45, -3], [-25, -27], [-15, 33], [15, 21], [45, -3]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
const outline = prism(OUTLINE, BASE - 1, 200);
const clip = (solid) => Manifold.intersection(outline, solid);
const at = (pts, h) => pts.map(([x, y]) => [x, y, h]);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const octagon = ([cx, cy], a) =>
  [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => polar([cx, cy], a / Math.cos(Math.PI / 8), deg));
// Zadeldak langs s tussen t0 en t1 met de nok in het midden.
const gableAlongS = ([s0, s1], [t0, t1], eave, ridge) => {
  const r = rect([s0, s1], [t0, t1]);
  const mid = (t0 + t1) / 2;
  return Manifold.hull([...at(r, BASE), ...at(r, z(eave)), [s0, mid, z(ridge)], [s1, mid, z(ridge)]]);
};

// ---------- opbouw ----------
const parts = [clip(box([-60, 60], [-50, 50], BASE, z(LOW)))];
// Schip met het oplopende stuk tegen de dwarsbeuk.
parts.push(gableAlongS([NAVE.west, NAVE.east], [NAVE.t0, NAVE.t1], NAVE.eave, NAVE.ridge));
{
  const r = rect([NAVE.east, TRANSEPT.s0 + 0.5], [NAVE.t0, NAVE.t1]);
  parts.push(
    Manifold.hull([
      ...at(r, BASE),
      ...at(rect([NAVE.east, NAVE.east], [NAVE.t0, NAVE.t1]), z(NAVE.eave)),
      [NAVE.east, AXIS_T, z(NAVE.ridge)],
      ...at(rect([TRANSEPT.s0 + 0.5, TRANSEPT.s0 + 0.5], [NAVE.t0, NAVE.t1]), z(NAVE.rise)),
    ]),
  );
}
// Dwarsbeuk met topgevels aan beide einden.
{
  const T = TRANSEPT;
  const r = rect([T.s0, T.s1], [T.south, T.north]);
  parts.push(
    clip(Manifold.hull([...at(r, BASE), ...at(r, z(T.eave)), [CROSS_S, T.south, z(T.ridge)], [CROSS_S, T.north, z(T.ridge)]])),
  );
}
// Koor met de koorsluiting: halve achthoek met een schilddak.
const choirMid = (CHOIR.t0 + CHOIR.t1) / 2;
const choirHalf = (CHOIR.t1 - CHOIR.t0) / 2;
const APSE = octagon([CHOIR.east, choirMid], choirHalf).filter(([x]) => x > CHOIR.east);
parts.push(gableAlongS([CHOIR.west, CHOIR.east], [CHOIR.t0, CHOIR.t1], CHOIR.eave, CHOIR.ridge));
parts.push(
  Manifold.hull([
    ...at([[CHOIR.east, CHOIR.t0], [CHOIR.east, CHOIR.t1], ...APSE], BASE),
    ...at([[CHOIR.east, CHOIR.t0], [CHOIR.east, CHOIR.t1], ...APSE], z(CHOIR.eave)),
    [CHOIR.east, choirMid, z(CHOIR.ridge)],
  ]),
);
// Zijbeuken: per travee een dak dwars op de muur met een schild naar buiten.
const hip = (BAY.ridge - BAY.eave) / Math.tan((50 * Math.PI) / 180);
for (const A of AISLES) {
  const sign = Math.sign(A.outer - A.inner);
  const ridgeEnd = A.outer - sign * hip;
  for (let k = 0; k + 1 < A.bounds.length; k++) {
    const [a, b] = [A.bounds[k], A.bounds[k + 1]];
    const mid = (a + b) / 2;
    const across = [Math.min(A.inner, A.outer), Math.max(A.inner, A.outer)];
    const pts =
      A.along === "s"
        ? [...at(rect([a, b], across), BASE), ...at(rect([a, b], across), z(BAY.eave)), [mid, A.inner, z(BAY.ridge)], [mid, ridgeEnd, z(BAY.ridge)]]
        : [...at(rect(across, [a, b]), BASE), ...at(rect(across, [a, b]), z(BAY.eave)), [A.inner, mid, z(BAY.ridge)], [ridgeEnd, mid, z(BAY.ridge)]];
    parts.push(clip(Manifold.hull(pts)));
  }
}
for (const [s, t] of FLAT_AISLES.zones) parts.push(clip(box(s, t, BASE, z(FLAT_AISLES.top))));
// Kooromgang om de koorsluiting.
{
  const inner = new CrossSection([ccw([[CHOIR.east, CHOIR.t0], ...APSE, [CHOIR.east, CHOIR.t1]])]);
  const outer = inner.offset(AMBULATORY.width, "Miter", 2);
  const ring = Manifold.hull([
    Manifold.extrude(outer, z(AMBULATORY.outer) - BASE).translate([0, 0, BASE]),
    Manifold.extrude(inner, 0.01).translate([0, 0, z(AMBULATORY.inner)]),
  ]);
  parts.push(clip(ring.intersect(box([CHOIR.east, 60], [-50, 50], BASE - 1, 100))));
}
// Aanbouwen ten zuiden van het koor.
parts.push(clip(box(ANNEX.s, ANNEX.t, BASE, z(ANNEX.top))));
// Torenstomp met tentdak en het portaal ervoor.
{
  const T = TOWER;
  const r = rect(T.s, T.t);
  parts.push(
    Manifold.hull([...at(r, BASE), ...at(r, z(T.top)), [(T.s[0] + T.s[1]) / 2, (T.t[0] + T.t[1]) / 2, z(T.tip)]]),
  );
  const P = PORCH;
  const pts = [];
  for (const t of P.t) pts.push([P.s[0], t, BASE], [P.s[1], t, BASE], [P.s[0], t, z(P.low)], [P.s[1], t, z(P.high)]);
  parts.push(clip(Manifold.hull(pts)));
}
// Dakruiter.
{
  const R = ROOF_TURRET;
  const lantern = octagon(R.c, R.apothem);
  parts.push(
    prism(lantern, z(TRANSEPT.ridge) - 2, z(R.top)),
    Manifold.hull([...at(lantern, z(R.top) - 0.01), [R.c[0], R.c[1], z(R.tip)]]),
  );
}

// Noord- en zuidportaal aan de koppen van de dwarsbeuk: de topgevel steekt
// boven het dak uit met pinakels en een makelaar, met op de hoeken achtkante
// traptorens met spitsen, een groot spitsboogvenster en het portaal als nis.
const niches = [];
{
  const T = TRANSEPT;
  const C = PORTAL_CROWN;
  for (const P of PORTALS) {
    const inner = P.face - P.dir * C.thickness;
    const wall = [];
    for (const t of [P.face, inner]) {
      wall.push(
        [T.s0, t, BASE],
        [T.s1, t, BASE],
        [T.s0, t, z(T.eave + C.eaveRise)],
        [T.s1, t, z(T.eave + C.eaveRise)],
        [CROSS_S, t, z(T.ridge + C.ridgeRise)],
      );
    }
    parts.push(Manifold.hull(wall));
    // Pinakels op de hoeken en halverwege de schuine kanten, de makelaar in
    // het midden.
    const crownAt = (s) =>
      T.eave + C.eaveRise + ((T.ridge + C.ridgeRise - T.eave - C.eaveRise) * (1 - Math.abs(s - CROSS_S) / (CROSS_S - T.s0)));
    const mid = (P.face + inner) / 2;
    const half = C.pinnacle / 2;
    const spike = (s, h0, h1, tip) => [
      box([s - half, s + half], [mid - half, mid + half], z(h0), z(h1)),
      Manifold.hull([...at(rect([s - half, s + half], [mid - half, mid + half]), z(h1) - 0.01), [s, mid, z(tip)]]),
    ];
    for (const s of [T.s0 + half, (T.s0 + CROSS_S) / 2, (T.s1 + CROSS_S) / 2, T.s1 - half]) {
      const h = crownAt(Math.max(T.s0, Math.min(T.s1, s)));
      parts.push(...spike(s, h - 1, h + C.pinnacleRise, h + C.pinnacleRise + 1.5));
    }
    parts.push(...spike(CROSS_S, T.ridge - 1, T.ridge + C.ridgeRise + 0.2, C.finial));
    // Traptorens.
    for (const c of P.turrets) {
      const ring = octagon(c, TURRET.apothem);
      parts.push(prism(ring, BASE, z(TURRET.top)), Manifold.hull([...at(ring, z(TURRET.top) - 0.01), [c[0], c[1], z(P.spire)]]));
    }
    // Spitsboognissen: het venster en het portaal.
    for (const N of [PORTAL_WINDOW, { ...PORTAL_DOOR, depth: P.doorDepth }]) {
      const pts = [];
      for (const t of [P.face + P.dir, P.face - P.dir * N.depth]) {
        const [s0, s1] = [CROSS_S - N.width / 2, CROSS_S + N.width / 2];
        pts.push(
          [s0, t, z(N.bottom)],
          [s1, t, z(N.bottom)],
          [s0, t, z(N.spring)],
          [s1, t, z(N.spring)],
          [CROSS_S, t, z(N.spring + N.rise)],
        );
      }
      niches.push(Manifold.hull(pts));
    }
  }
}

const church = Manifold.union(parts).subtract(Manifold.union(niches)).translate([-CROSS_S, -AXIS_T, 0]);
const nodes = [["building:kerk", church]];
const printModel = church;

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
  const nodes = [];
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
    nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
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
for (const [name, solid] of nodes) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "hooglandse-kerk.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-hooglandse-kerk.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (0,5 m onder het maaiveld) op het printbed.
const stlFile = path.join(outDir, `hooglandse-kerk-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Hooglandse Kerk Leiden 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. Het maaiveld wordt op
// het plein en de straten rondom bemonsterd.
await writeFile(
  path.join(outDir, "hooglandse-kerk.json"),
  JSON.stringify(
    {
      name: "Hooglandse Kerk",
      file: "hooglandse-kerk.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: U.map((v) => +v.toFixed(5)),
      groundOffsetMetres: 0,
      groundSamplePoints: GROUND_SAMPLES.map(([s, t]) => [s - CROSS_S, t - AXIS_T]),
      replacesBuildings: ["NL.IMBAG.Pand.0546100000038521"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (93892,93, 463687,05) in het hart van de kruising op het maaiveld (NAP +1,5 m), +X langs de as van de toren naar het koor (RD-richting 13,5 graden) en +Y naar het noorden. De vlakke onderkant ligt 0,5 m onder het maaiveld; dat wordt op de straten en het plein rondom bemonsterd. Vervangt de PDOK-reconstructie van BAG-pand 0546100000038521. Laag schip en lage torenstomp tegen de hoge dwarsbeuk en het hoge koor, zijbeuken met dwarse daken, kooromgang en dakruiter, het noord- en zuidportaal met boven het dak uitstekende topgevels, pinakels, traptorens met spitsen en nissen voor venster en portaal; daken en hoogtes uit het AHN. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`hooglandse-kerk-1-${scale}.stl`],
      realWorld: {
        lengthM: 81,
        transeptLengthM: 68,
        naveRidgeNapM: NAVE.ridge,
        transeptRidgeNapM: TRANSEPT.ridge,
        choirRidgeNapM: CHOIR.ridge,
        aisleRidgeNapM: BAY.ridge,
        towerTopNapM: TOWER.top,
        towerTipNapM: TOWER.tip,
        roofTurretTipNapM: ROOF_TURRET.tip,
        portalFinialNapM: PORTAL_CROWN.finial,
        portalTurretSpiresNapM: PORTALS.map((P) => P.spire),
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Hooglandse_Kerk",
        "PDOK BAG pand 0546100000038521 (contour), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de dakprofielen, de toren, de dakruiter, de aanbouwen en het maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: Hooglandse Kerk; Noordportaal.jpg, Hooglandse Kerk; Zuidportaal.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

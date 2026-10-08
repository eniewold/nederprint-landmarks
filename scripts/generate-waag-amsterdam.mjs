// Genereert een vereenvoudigd, gesloten 3D-model van De Waag op de
// Nieuwmarkt in Amsterdam: de voormalige Sint Antoniespoort (eerste steen
// 1488), in 1617-1618 verbouwd tot waag en in 1690-1691 voorzien van de
// achtkante middentoren. Het gebouw heeft zeven torens: twee grote ronde
// torens aan de west- en oostkant met een achtkante spits, twee kleinere
// ronde torens aan de zuidkant, twee achtkante traptorentjes aan de
// noordkant en de achtkante middentoren met een hoge spits. Het noordelijke
// hoofdblok heeft een plat dak met de middentoren erop, het lagere zuidblok
// tussen de zuidtorens een schilddak. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-waag-amsterdam.mjs              # 1:1000 (standaard)
//   node scripts/generate-waag-amsterdam.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: de muren en torens staan recht op, de
// daken, kegels en spitsen lopen onder 50 graden of steiler omhoog en de
// middentoren staat op het platte dak van het hoofdblok. Alleen de gootlijsten
// van de vier ronde torens kragen 0,15 tot 0,25 m vlak uit; die vlakke
// onderkanten laten de export de Waag als gesloten solid opvullen (zie de
// controle onderaan).
//
// Assenstelsel: oorsprong op RD (121842,13, 487324,42), het hart van de
// achtkante middentoren (het hoogste DSM-punt), op het maaiveld van de
// Nieuwmarkt (NAP +2,2 m), Z omhoog. +X loopt langs de lange gevels naar het
// oost-noordoosten (RD-richting 25,5 graden vanaf het oosten), +Y naar het
// noord-noordwesten. De grote torens staan op x = -7,8 en x = +8,0, het
// zuidblok met de kleine torens ligt aan -Y (y = -7,5 tot -14,1), de
// traptorentjes aan +Y (y = 7 tot 10,4).
//
// Bronnen: BAG-pand 0363100012171850 (contour met de zes buitentorens); AHN
// DSM/DTM 0,5 m (PDOK WCS): het platte dak, de middentoren, de kegels van de
// torens, het schilddak van het zuidblok en het maaiveld; Wikipedia en het
// Rijksmonumentenregister (3848); foto's op Wikimedia Commons (de zuid- en
// westkant vanaf de Nieuwmarkt); PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "waag-amsterdam");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 2,2 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [121842.13, 487324.42];
const AXIS_DEG = 25.5;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 2.2;
const NAP = (h) => h - GROUND_NAP;
// Alle onderdelen beginnen 0,5 m onder het maaiveld (NAP +1,7 m), zodat de
// voet op de licht hellende Nieuwmarkt (AHN-DTM NAP +2,0 tot +2,4 m) overal
// in het terrein staat.
const BASE = NAP(1.7);
// BAG-contour met de zes buitentorens (lokaal, op 0,01 m).
const OUTLINE = [
  [6.99, 0.76], [6.99, 3.48], [6.99, 7.05], [7.37, 7.05], [8.33, 8.07], [8.33, 9.40], [7.43, 10.42], [7.28, 10.42],
  [6.02, 10.43], [5.08, 9.47], [5.09, 8.41], [3.83, 8.41], [-4.34, 8.41], [-5.59, 8.41], [-5.59, 9.40],
  [-6.59, 10.24], [-7.88, 10.25], [-8.81, 9.19], [-8.83, 7.89], [-7.80, 7.03], [-7.13, 7.03], [-7.14, 3.63],
  [-7.14, 0.42], [-7.14, -1.07], [-7.44, -1.03], [-7.75, -1.01], [-8.05, -1.03], [-8.36, -1.06], [-8.66, -1.13],
  [-8.94, -1.22], [-9.22, -1.33], [-9.48, -1.47], [-9.74, -1.63], [-9.98, -1.81], [-10.15, -1.96], [-10.28, -2.09],
  [-10.41, -2.24], [-10.54, -2.39], [-10.65, -2.55], [-10.75, -2.71], [-10.90, -2.98], [-11.02, -3.27],
  [-11.11, -3.56], [-11.18, -3.86], [-11.22, -4.17], [-11.24, -4.48], [-11.22, -4.79], [-11.18, -5.09],
  [-11.12, -5.39], [-11.02, -5.69], [-10.90, -5.97], [-10.75, -6.25], [-10.59, -6.50], [-10.40, -6.74],
  [-10.20, -6.95], [-9.98, -7.15], [-9.74, -7.33], [-9.49, -7.49], [-9.22, -7.63], [-8.95, -7.74], [-8.67, -7.83],
  [-8.37, -7.89], [-8.08, -7.93], [-7.78, -7.95], [-7.49, -7.94], [-7.19, -7.90], [-6.90, -7.84], [-6.62, -7.75],
  [-6.34, -7.64], [-6.07, -7.50], [-6.08, -12.43], [-6.24, -12.44], [-6.41, -12.46], [-6.57, -12.50],
  [-6.73, -12.56], [-6.87, -12.62], [-7.01, -12.70], [-7.14, -12.79], [-7.26, -12.89], [-7.39, -13.02],
  [-7.48, -13.13], [-7.56, -13.26], [-7.63, -13.38], [-7.69, -13.51], [-7.74, -13.65], [-7.78, -13.79],
  [-7.81, -13.94], [-7.82, -14.08], [-7.82, -14.23], [-7.81, -14.37], [-7.79, -14.52], [-7.75, -14.66],
  [-7.70, -14.81], [-7.64, -14.95], [-7.57, -15.08], [-7.48, -15.21], [-7.39, -15.32], [-7.28, -15.43],
  [-7.17, -15.53], [-7.04, -15.62], [-6.91, -15.70], [-6.78, -15.77], [-6.64, -15.82], [-6.50, -15.86],
  [-6.36, -15.89], [-6.21, -15.91], [-6.07, -15.91], [-5.92, -15.90], [-5.78, -15.89], [-5.63, -15.85],
  [-5.49, -15.81], [-5.36, -15.75], [-5.23, -15.69], [-5.10, -15.61], [-4.98, -15.52], [-4.86, -15.41],
  [-4.76, -15.30], [-4.66, -15.18], [-4.58, -15.05], [-4.50, -14.91], [-4.44, -14.76], [-4.40, -14.62],
  [-4.36, -14.46], [-4.34, -14.31], [-4.34, -14.15], [-3.14, -14.14], [3.34, -14.10], [4.65, -14.09], [4.63, -14.17],
  [4.64, -14.34], [4.67, -14.50], [4.71, -14.66], [4.76, -14.81], [4.82, -14.93], [4.89, -15.05], [4.96, -15.15],
  [5.04, -15.26], [5.15, -15.37], [5.27, -15.47], [5.39, -15.56], [5.53, -15.64], [5.67, -15.70], [5.82, -15.76],
  [5.97, -15.80], [6.08, -15.81], [6.22, -15.83], [6.37, -15.83], [6.51, -15.82], [6.66, -15.79], [6.80, -15.76],
  [6.94, -15.71], [7.07, -15.65], [7.20, -15.57], [7.32, -15.49], [7.43, -15.40], [7.54, -15.29], [7.63, -15.18],
  [7.72, -15.06], [7.79, -14.94], [7.86, -14.80], [7.91, -14.67], [7.94, -14.53], [7.97, -14.38], [7.98, -14.24],
  [7.99, -14.09], [7.97, -13.94], [7.95, -13.79], [7.91, -13.65], [7.86, -13.51], [7.80, -13.38], [7.72, -13.25],
  [7.64, -13.13], [7.54, -13.02], [7.44, -12.91], [7.33, -12.82], [7.20, -12.73], [7.08, -12.66], [6.94, -12.60],
  [6.80, -12.55], [6.66, -12.51], [6.51, -12.48], [6.37, -12.47], [6.37, -7.53], [6.56, -7.63], [6.77, -7.71],
  [6.97, -7.79], [7.18, -7.84], [7.40, -7.89], [7.62, -7.92], [7.77, -7.94], [7.92, -7.95], [8.07, -7.95],
  [8.37, -7.93], [8.66, -7.89], [8.94, -7.82], [9.23, -7.73], [9.50, -7.62], [9.76, -7.48], [10.05, -7.30],
  [10.29, -7.10], [10.52, -6.89], [10.73, -6.66], [10.92, -6.40], [11.08, -6.14], [11.22, -5.86], [11.33, -5.57],
  [11.42, -5.26], [11.48, -4.96], [11.51, -4.65], [11.51, -4.33], [11.48, -4.02], [11.43, -3.71], [11.35, -3.41],
  [11.25, -3.13], [11.12, -2.86], [10.98, -2.60], [10.81, -2.36], [10.62, -2.13], [10.41, -1.92], [10.19, -1.72],
  [9.95, -1.55], [9.70, -1.39], [9.43, -1.26], [9.15, -1.16], [8.87, -1.07], [8.58, -1.01], [8.28, -0.98],
  [7.99, -0.97], [7.69, -0.98], [7.69, -0.19], [6.99, -0.19],
];
// Onderbouw: de hele contour tot NAP +11,0 m, onder de laagste goot; de
// onderdelen hieronder zetten daar hun eigen hoogte op.
const PLINTH_TOP = 11.0;
// Hoofdblok tussen en ten noorden van de grote torens (BAG-gevels op x =
// -7,14 en 6,99, y = 8,41, het midden tussen de torens van x = -6,08 tot
// 6,37): plat dak op NAP +15,0 m (AHN-DSM 14,9 tot 15,2 m tussen de torens en
// de middentoren).
const CORE = { rects: [[[-7.14, 6.99], [-1.07, 8.41]], [[-6.08, 6.37], [-7.5, -1.07]]], top: 15.0 };
// Achtkante middentoren op het platte dak: 10,6 m over de vlakken (de
// vlakken op de assen), muren tot NAP +16,8 m en een achtkante spits tot NAP
// +28,0 m (AHN-DSM: het profiel per afstand tot het hart past op een
// achtkante piramide van 64 graden met de top op +28,0 m, het hoogste
// DSM-punt).
const DRUM = { apothem: 5.3, top: 16.8, tip: 28.0 };
// Zuidblok tussen de kleine torens (BAG-gevels x = -6,08 tot 6,37, zuidgevel
// y = -14,14 tot -14,09; het dak een paar centimeter binnen de contour): goot
// op NAP +12,5 m en een schilddak met de nok op NAP +18,5 m
// van x = -1,85 tot 2,15 op y = -9,8 (AHN-DSM 18,5 tot 19,0 m op de nok,
// 14 m vlak achter de zuidgevel).
const SOUTH = { x: [-6.07, 6.36], y: [-14.09, -7.5], eave: 12.5, ridge: 18.5, ridgeX: [-1.85, 2.15], ridgeY: -9.8 };
// Ronde torens (cirkels gefit op de BAG-bogen, hoogtes uit het AHN per
// straal en de foto's): romp tot de gootlijst, die `out` uitkraagt tot de
// goot, en een achtkante spits met graten.
const TOWERS = [
  { name: "west", c: [-7.77, -4.48], r: 3.47, corbel: 13.6, eave: 14.3, tip: 22.6, out: 0.25 },
  { name: "oost", c: [8.02, -4.46], r: 3.49, corbel: 13.6, eave: 14.3, tip: 22.6, out: 0.25 },
  { name: "zuidwest", c: [-6.08, -14.17], r: 1.74, corbel: 11.5, eave: 12.0, tip: 19.0, out: 0.15 },
  { name: "zuidoost", c: [6.31, -14.15], r: 1.68, corbel: 11.5, eave: 12.0, tip: 19.0, out: 0.15 },
];
// Achtkante traptorentjes aan de noordkant (BAG-contour): romp tot NAP
// +13,0 m en een achtkante spits tot NAP +17,2 m (AHN-DSM 16,4 tot 16,8 m
// in het hart).
const TURRETS = [
  { name: "noordwest", x: [-9.5, -5.5], y: [7.0, 11.0], eave: 13.0, tip: 17.2 },
  { name: "noordoost", x: [5.0, 8.5], y: [7.0, 11.0], eave: 13.0, tip: 17.2 },
];
// Maaiveld (AHN-DTM NAP +2,15 tot +2,4 m) op de Nieuwmarkt ten westen, oosten
// en zuiden van de Waag; niet aan de lagere noordkant (NAP +2,0 m).
const GROUND_SAMPLES = [[-15, -4.5], [15, -4.5], [0, -18]];

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
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const box = (xr, yr, z0, z1) => prism(rect(xr, yr), z0, z1);
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const circle = (c, r, n = 48) => Array.from({ length: n }, (_, k) => polar(c, r, (360 * k) / n));
const cylinder = (c, r, z0, z1, n = 48) => prism(circle(c, r, n), z0, z1);
const cone = (c, r, z0, tip, n = 48) => Manifold.hull([...at(circle(c, r, n), z0), [c[0], c[1], tip]]);
// Achthoek met de vlakken op de assen, apothema a.
const octagon = (a) => Array.from({ length: 8 }, (_, k) => polar([0, 0], a / Math.cos(Math.PI / 8), 45 * k + 22.5));

// ---------- Waag ----------
const outline = prism(OUTLINE, BASE, 200);
const plinth = prism(OUTLINE, BASE, NAP(PLINTH_TOP));
const southRect = prism(rect(SOUTH.x, SOUTH.y), BASE, 200);
const core = Manifold.intersection(outline, Manifold.union(CORE.rects.map(([xr, yr]) => box(xr, yr, BASE, NAP(CORE.top)))));
const drum = Manifold.union([
  prism(octagon(DRUM.apothem), NAP(CORE.top) - 0.01, NAP(DRUM.top)),
  Manifold.hull([...at(octagon(DRUM.apothem), NAP(DRUM.top) - 0.01), [0, 0, NAP(DRUM.tip)]]),
]);
const south = Manifold.union([
  Manifold.intersection(outline, box(SOUTH.x, SOUTH.y, BASE, NAP(SOUTH.eave))),
  Manifold.hull([
    ...at(rect(SOUTH.x, SOUTH.y), NAP(SOUTH.eave) - 0.01),
    [SOUTH.ridgeX[0], SOUTH.ridgeY, NAP(SOUTH.ridge)],
    [SOUTH.ridgeX[1], SOUTH.ridgeY, NAP(SOUTH.ridge)],
  ]),
]);
// Torenromp: de BAG-contour binnen 0,6 m van de cirkel (zodat de boog van de
// contour gevolgd wordt), zonder het zuidblok, plus de gefitte cirkel.
const tower = (t) =>
  Manifold.union([
    Manifold.intersection(outline, cylinder(t.c, t.r + 0.6, BASE, NAP(t.corbel) + 0.01)).subtract(southRect),
    cylinder(t.c, t.r, BASE, NAP(t.corbel) + 0.01),
    cylinder(t.c, t.r + t.out, NAP(t.corbel), NAP(t.eave)),
    // Achtkante spits met graten, zoals op foto en luchtfoto; de hoeken op de
    // cirkel van de gootlijst, zodat de spits niet buiten de romp uitsteekt.
    cone(t.c, t.r + t.out, NAP(t.eave) - 0.01, NAP(t.tip), 8),
  ]);
const turret = (t) => {
  const pts = OUTLINE.filter(([x, y]) => x > t.x[0] && x < t.x[1] && y > t.y[0] && y < t.y[1]);
  const c = [0, 1].map((a) => pts.reduce((s, p) => s + p[a], 0) / pts.length);
  t.c = c;
  return Manifold.union([
    Manifold.intersection(outline, box(t.x, t.y, BASE, NAP(t.eave))),
    Manifold.hull([...at(pts, NAP(t.eave) - 0.01), [c[0], c[1], NAP(t.tip)]]),
  ]);
};
const waag = Manifold.union([plinth, core, drum, south, ...TOWERS.map(tower), ...TURRETS.map(turret)]);

const nodes = [["building:waag", waag]];
const all = waag;

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de
  // onderkant: alleen de gootlijsten van de vier ronde torens.
  const allowed = new Set(TOWERS.map((t) => NAP(t.corbel).toFixed(2)));
  for (const [name, solid] of nodes) {
    const mesh = solid.getMesh();
    const v = mesh.vertProperties;
    const s = mesh.numProp;
    const levels = new Map();
    const where = new Map();
    for (let t = 0; t < mesh.triVerts.length; t += 3) {
      const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
      if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
      const e1 = p[1].map((c, i) => c - p[0][i]);
      const e2 = p[2].map((c, i) => c - p[0][i]);
      const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      const len = Math.hypot(...n);
      if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
      const z = Math.min(...p.map((q) => q[2])).toFixed(2);
      levels.set(z, (levels.get(z) ?? 0) + len / 2);
      if (!allowed.has(z)) where.set(z, [0, 1].map((a) => +((p[0][a] + p[1][a] + p[2][a]) / 3).toFixed(2)));
    }
    console.log(`${name}: ondervlakken (lokale z: m2)`, Object.fromEntries(levels));
    for (const [z, area] of levels) if (!allowed.has(z) && area > 0.01) throw new Error(`${name}: overhang op z ${z} bij x, y ${where.get(z)}`);
    if (levels.size === 0) throw new Error(`${name}: geen uitkraging`);
    const bb = solid.boundingBox();
    if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  }
  // De hele BAG-contour is bebouwd.
  const missing = prism(OUTLINE, BASE, BASE + 1).subtract(waag).volume();
  if (missing > 1e-3) throw new Error(`contour niet gevuld: ${missing} m3`);
  console.log("traptorentjes (hart)", TURRETS.map((t) => t.c.map((a) => +a.toFixed(2))));
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
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "waag-amsterdam.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-waag-amsterdam.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `waag-amsterdam-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Waag Amsterdam 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

const box3 = waag.boundingBox();
await writeFile(
  path.join(outDir, "waag-amsterdam.json"),
  JSON.stringify(
    {
      name: "De Waag",
      file: "waag-amsterdam.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      // 0 in plaats van -0,3: alles begint al 0,5 m onder het maaiveld.
      groundOffsetMetres: 0,
      // Op de Nieuwmarkt ten westen, oosten en zuiden van de Waag (NAP +2,15
      // tot +2,4 m); niet aan de lagere noordkant.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0363100012171850"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (121842,13, 487324,42), het hart van de achtkante middentoren, op het maaiveld van de Nieuwmarkt (NAP +2,2 m), +X langs de lange gevels naar het oost-noordoosten (25,5 graden vanaf het oosten) en +Y naar het noord-noordwesten. Eén node building:waag met het hoofdblok met plat dak (NAP +15,0 m) en daarop de achtkante middentoren (10,6 m over de vlakken, muren tot +16,8 m, spits tot +28,0 m), de twee grote ronde torens aan de west- en oostkant (straal 3,5 m, gootlijst 0,25 m uitkragend tot +14,3 m, achtkante spits tot +22,6 m), het zuidblok met schilddak (goot +12,5 m, nok +18,5 m) tussen de twee kleine ronde zuidtorens (straal 1,7 m, gootlijst tot +12,0 m, achtkante spits tot +19,0 m) en de twee achtkante traptorentjes aan de noordkant (spits tot +17,2 m). Alles begint 0,5 m onder het maaiveld; alles staat recht op of loopt schuin omhoog, behalve de gootlijsten van de vier ronde torens, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van het BAG-pand van de Waag. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`waag-amsterdam-1-${scale}.stl`],
      realWorld: {
        lengthM: +(box3.max[0] - box3.min[0]).toFixed(2),
        widthM: +(box3.max[1] - box3.min[1]).toFixed(2),
        highestPointNapM: +(box3.max[2] + GROUND_NAP).toFixed(2),
        flatRoofNapM: CORE.top,
        centralTowerAcrossFlatsM: 2 * DRUM.apothem,
        centralTowerWallNapM: DRUM.top,
        centralTowerTipNapM: DRUM.tip,
        largeTowerRadiusM: TOWERS[0].r,
        largeTowerEaveNapM: TOWERS[0].eave,
        largeTowerTipNapM: TOWERS[0].tip,
        smallTowerRadiusM: TOWERS[2].r,
        smallTowerEaveNapM: TOWERS[2].eave,
        smallTowerTipNapM: TOWERS[2].tip,
        stairTurretTipNapM: TURRETS[0].tip,
        southBlockEaveNapM: SOUTH.eave,
        southBlockRidgeNapM: SOUTH.ridge,
        groundNapM: GROUND_NAP,
        baseNapM: 1.7,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Waag_(Amsterdam)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/3848",
        "PDOK BAG pand 0363100012171850 (contour met de zes buitentorens), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: plat dak, middentoren, kegels van de torens, schilddak van het zuidblok en maaiveld",
        "Wikimedia Commons: Amsterdam - Waag.jpg (zuid- en westkant vanaf de Nieuwmarkt)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

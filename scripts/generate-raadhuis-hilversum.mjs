// Genereert een vereenvoudigd, gesloten 3D-model van het Raadhuis van
// Hilversum (W.M. Dudok, 1928-1931): de kubische bouwmassa's van gele
// baksteen rond de grote binnenplaats, de lage vleugels rond de tweede
// binnenplaats aan de oostkant, de dienstgebouwen daarachter en de slanke
// klokkentoren van 48 m aan de vijver. Alle daken zijn plat; Dudoks
// overstekende dakplaten zijn weggelaten. Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-raadhuis-hilversum.mjs              # 1:1000 (standaard)
//   node scripts/generate-raadhuis-hilversum.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: alle bouwdelen zijn rechte blokken op de
// onderkant met vlakke daken. Alleen de blinde vensternissen (vensterbanden,
// de hoge vensters van de raadzaal, de spleten en de klok van de toren)
// hebben een vlakke bovenkant van 0,35 tot 0,4 m diep.
//
// Assenstelsel: oorsprong op RD (140148,50, 471250,75), het midden van de
// toren, op het maaiveld (NAP +14,0 m), Z omhoog. +X loopt naar het oosten
// (RD-richting 2,4 graden, evenwijdig aan de gevels), +Y naar het noorden.
// De vijver ligt aan de zuidkant (-Y), de ingang aan de noordkant.
//
// Bronnen: BAG-panden 0402100001495707 (het raadhuis), 0402100001525323,
// 0402100001494252 en 0402100001519068 (de oostelijke vleugels); AHN DSM/DTM
// 0,5 m (PDOK WCS): de dakhoogte per bouwdeel, de toren, het maaiveld en de
// vijver; Wikipedia; foto's op Wikimedia Commons; PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "raadhuis-hilversum");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 14,0 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [140148.5, 471250.75];
const AXIS_DEG = 2.4;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 14.0;
const NAP = (h) => h - GROUND_NAP;
// Onderkant op NAP +13,5 m, het pad langs de vijver ligt op NAP +14 m en het
// water op circa +13 m.
const BASE = NAP(13.5);
// BAG-contour van het raadhuis (lokaal, op 0,01 m), zonder de binnenplaats.
const MAIN = [
  [-43.39, 59.7], [-43.99, 59.7], [-44.01, 34.05], [-45.67, 34.05], [-45.66, 30.34], [-44.51, 30.34], [-44.56, 1.81],
  [-45.67, 1.83], [-45.66, -1.9], [-44.56, -1.91], [-44.59, -4.68], [-62.12, -4.63], [-62.12, -4.41], [-65.22, -4.44],
  [-65.24, -6.99], [-65.71, -7], [-65.7, -13.92], [-37.58, -13.88], [-37.59, -12.69], [-36.02, -12.68], [-36.02, -9.82],
  [-32.49, -9.81], [-32.37, -8.94], [-14.69, -9.01], [-14.64, -11.48], [-11.9, -11.47], [-11.9, -10.02], [-12.14, -10.02],
  [-12.14, -7.75], [3.59, -7.73], [3.58, -3.85], [25.78, -3.8], [25.78, -4.54], [29.15, -4.54], [29.14, 6.91],
  [25.56, 6.94], [25.56, 4.52], [22.68, 4.4], [4.09, 4.41], [4.09, 30.45], [9.72, 30.6], [9.7, 31.27], [7.34, 31.24],
  [7.35, 33.34], [9.4, 33.79], [25.66, 33.78], [25.68, 36.19], [29.15, 36.2], [29.15, 43.27], [2.97, 43.25],
  [2.97, 40.75], [1.18, 40.75], [1.18, 41.58], [-33.42, 41.5], [-33.45, 58.97], [-33.04, 58.97], [-33.04, 62.46],
  [-36.66, 64.63], [-40.27, 62.46], [-40.26, 59.71],
];
// Bouwdelen van het raadhuis als blokken [x0, x1, y0, y1, dak NAP], afgelezen
// in het AHN-DSM (mediaan per 2 m) en afgesneden op de BAG-contour.
const BLOCKS = [
  { name: "westvleugel aan de vijver", x: [-66, -44.5], y: [-14, -4.4], top: 21 },
  { name: "zuidwesthoek", x: [-44.6, -37], y: [-14, -3], top: 29 },
  { name: "zuidwesthoek hoog", x: [-44.6, -37], y: [-3, 1.5], top: 32 },
  { name: "pyloon", x: [-37, -33], y: [-13, 2], top: 38 },
  { name: "raadzaal", x: [-33, -3.2], y: [-9.2, 1], top: 31 },
  { name: "raadzaal achterrand", x: [-37, -3.2], y: [1, 3], top: 36 },
  { name: "gang achter de raadzaal", x: [-37, 4.1], y: [3, 6.2], top: 28 },
  { name: "gang west", x: [-44.6, -37], y: [1.5, 6.2], top: 25 },
  { name: "voorbouw toren west", x: [-3.2, 0], y: [-7.8, -4], top: 31 },
  { name: "voorbouw toren oost", x: [0, 3.6], y: [-7.8, -4], top: 19 },
  { name: "oostvleugel binnenplaats", x: [-11, -7], y: [6, 29.5], top: 25 },
  { name: "oostvleugel", x: [-7, 4.1], y: [6, 29.5], top: 28 },
  { name: "noordoosthoek", x: [-5, 4.5], y: [29, 35.5], top: 31 },
  { name: "noordoosthoek achter", x: [-1, 3], y: [35.5, 41.6], top: 28 },
  { name: "noordvleugel", x: [-44.6, -5], y: [29.5, 41.6], top: 25 },
  { name: "galerij binnenplaats", x: [-33, -11], y: [25, 29.5], top: 19 },
  { name: "westvleugel", x: [-46, -33], y: [1.5, 45], top: 25 },
  { name: "noordelijke uitbouw", x: [-46, -33], y: [45, 65], top: 20 },
  { name: "lage oostvleugel", x: [3.6, 29.2], y: [-4.6, 7], top: 18 },
  { name: "noordoostvleugel", x: [4.1, 29.2], y: [30.4, 37], top: 23 },
  { name: "noordoostvleugel laag", x: [4.1, 29.2], y: [37, 43.3], top: 20 },
];
// Klokkentoren (AHN-DSM: dak NAP +61 m, 7 bij 8 m) met twee lagere
// steunbeeren: west tot +45 m, oost tot +53 m.
const TOWER = { x: [-3.2, 3.8], y: [-4, 4], top: 61.0 };
const TOWER_STEPS = [
  { x: [-4.0, -3.2], y: [-1, 4], top: 45 },
  { x: [3.8, 5.5], y: [-2.2, -0.4], top: 53 },
];
// Oostelijke vleugels en dienstgebouwen (BAG-contour, dak uit de AHN-mediaan).
const SIDE = [
  {
    name: "dienstvleugel oost",
    pand: "0402100001525323",
    top: 17.6,
    pts: [[34.12, 43.29], [34.13, 36.2], [38.56, 36.2], [38.56, 36.68], [41.58, 36.67], [41.57, 34.73], [49.72, 34.77], [49.75, 15.58], [49.73, 6.96], [53.85, 6.76], [54.22, 6.76], [54.18, 37.64], [53.82, 37.64], [53.82, 43.32]],
  },
  { name: "poortgebouw oost", pand: "0402100001519068", top: 20.8, pts: [[51.67, 0.48], [53.79, 0.49], [53.85, 6.76], [49.73, 6.96], [49.58, 0.47]] },
  {
    name: "dienstvleugel zuid",
    pand: "0402100001494252",
    top: 19.5,
    pts: [[45.67, 6.98], [34.13, 6.95], [34.13, -7.77], [37.01, -7.79], [37, -9.74], [38, -9.74], [38, -13.23], [37.53, -13.23], [37.53, -14.06], [42.62, -14.06], [44.1, -14.05], [44.1, -13.82], [44.46, -13.8], [44.44, 0.47], [45.76, 0.47]],
  },
  {
    name: "garagevleugel",
    pand: "0402100001494252",
    top: 17.5,
    pts: [[37.53, -14.06], [37.55, -35.07], [43.1, -35.08], [43.1, -34.83], [42.6, -34.82], [42.62, -14.06]],
  },
];
// Blinde nissen (0,35 m diep, in de gevel aan de vijver of rond de toren):
// [x0, x1, y van de gevel, richting (-1 zuid, +1 noord), z0, z1 in NAP].
const NICHE_DEPTH = 0.35;
// Vijf hoge vensters in de zuidgevel van de raadzaal (foto's vanaf de vijver).
const HALL_WINDOWS = Array.from({ length: 5 }, (_, k) => -27 + k * 4.5);
// Vensterbanden in de lage vleugels aan de vijver.
const BANDS = [
  { x: [-64, -46], y: -13.92, z: [16.0, 17.6] },
  { x: [5, 24], y: -3.82, z: [15.6, 16.8] },
];
// Toren: drie spleten per gevel onder de top (NAP +49 tot +57 m) en de klok
// als vierkante nis aan de zuid- en noordkant (NAP +43 tot +45 m).
const SLOTS = { z: [49, 57], width: 0.9, depth: 0.4 };
const CLOCK = { size: 2.2, z: 43 };
// Maaiveld (AHN-DTM NAP +14 tot +15 m): het voorplein aan de noordkant, de
// oostelijke binnenplaats en het pad langs de vijver; niet de vijver zelf.
const GROUND_SAMPLES = [[-20, 48], [15, 20], [-20, -12]];
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

// ---------- raadhuis ----------
const outline = prism(MAIN, BASE - 1, 100);
const blockSolid = ({ x, y, top }) => box(x, y, BASE, NAP(top));
const main = Manifold.intersection(Manifold.union(BLOCKS.map(blockSolid)), outline);
const tower = Manifold.union([blockSolid(TOWER), ...TOWER_STEPS.map(blockSolid)]);
const side = Manifold.union(SIDE.map(({ pts, top }) => prism(pts, BASE, NAP(top))));
const niches = [];
// Hoge vensters van de raadzaal (1,6 m breed, NAP +19 tot +28 m) in de
// zuidgevel op y = -8,94.
const HALL_FACE = -8.97;
for (const cx of HALL_WINDOWS) niches.push(box([cx - 0.8, cx + 0.8], [HALL_FACE - 1, HALL_FACE + NICHE_DEPTH], NAP(19), NAP(28)));
for (const b of BANDS) niches.push(box(b.x, [b.y - 1, b.y + NICHE_DEPTH], NAP(b.z[0]), NAP(b.z[1])));
// Spleten en klok in de toren.
const [tx0, tx1] = TOWER.x;
const [ty0, ty1] = TOWER.y;
const tcx = (tx0 + tx1) / 2;
const tcy = (ty0 + ty1) / 2;
for (const k of [-1, 0, 1]) {
  const sx = tcx + k * 2.3;
  const sy = tcy + k * 2.4;
  const hw = SLOTS.width / 2;
  const z = [NAP(SLOTS.z[0]), NAP(SLOTS.z[1])];
  niches.push(box([sx - hw, sx + hw], [ty0 - 1, ty0 + SLOTS.depth], ...z));
  niches.push(box([sx - hw, sx + hw], [ty1 - SLOTS.depth, ty1 + 1], ...z));
  niches.push(box([tx0 - 1, tx0 + SLOTS.depth], [sy - hw, sy + hw], ...z));
  niches.push(box([tx1 - SLOTS.depth, tx1 + 1], [sy - hw, sy + hw], ...z));
}
const ch = CLOCK.size / 2;
niches.push(box([tcx - ch, tcx + ch], [ty0 - 1, ty0 + SLOTS.depth], NAP(CLOCK.z), NAP(CLOCK.z) + CLOCK.size));
niches.push(box([tcx - ch, tcx + ch], [ty1 - SLOTS.depth, ty1 + 1], NAP(CLOCK.z), NAP(CLOCK.z) + CLOCK.size));
const hall = Manifold.union([main, tower, side]).subtract(Manifold.union(niches));

const nodes = [["building:raadhuis", hall]];
const all = hall;
const NICHE_TOPS = [NAP(28), ...BANDS.map((b) => NAP(b.z[1])), NAP(SLOTS.z[1]), NAP(CLOCK.z) + CLOCK.size];
// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de
  // onderkant: alleen de bovenkanten van de nissen.
  const allowed = new Set(NICHE_TOPS.map((z) => z.toFixed(2)));
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
    const bb = solid.boundingBox();
    if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
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
const glbFile = path.join(outDir, "raadhuis-hilversum.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-raadhuis-hilversum.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `raadhuis-hilversum-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Raadhuis Hilversum 1:${scale} mm Z-up`);
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

// Grondplaat van 1 m (1 mm op 1:1000) onder de losse vleugels, zodat ze in
// één stuk printen.
const allBox = all.boundingBox();
const plateSolid = Manifold.union([all, box([allBox.min[0] - 2, allBox.max[0] + 2], [allBox.min[1] - 2, allBox.max[1] + 2], BASE - 1, BASE + 0.01)]).translate([0, 0, -(BASE - 1)]);
const plateFile = path.join(outDir, `raadhuis-hilversum-grondplaat-1-${scale}.stl`);
const plate = toStl(plateSolid, `NederPrint Raadhuis Hilversum grondplaat 1:${scale} mm Z-up`);
await writeFile(plateFile, plate.buffer);
report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };

const hallBox = hall.boundingBox();
await writeFile(
  path.join(outDir, "raadhuis-hilversum.json"),
  JSON.stringify(
    {
      name: "Raadhuis Hilversum",
      file: "raadhuis-hilversum.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het voorplein, de oostelijke binnenplaats en het pad langs de
      // vijver (NAP +14 tot +15 m), niet in de vijver (NAP +13 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["0402100001495707", ...new Set(SIDE.map((s) => s.pand))].map((id) => `NL.IMBAG.Pand.${id}`),
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (140148,50, 471250,75), het midden van de klokkentoren, op het maaiveld (NAP +14,0 m), +X naar het oosten (2,4 graden vanaf het oosten, evenwijdig aan de gevels) en +Y naar het noorden; de vijver ligt aan de zuidkant. Eén node building:raadhuis met de kubische bouwdelen van Dudok als blokken met vlakke daken op de BAG-contour, met de dakhoogtes uit het AHN: de raadzaal aan de vijver (NAP +31 m, achterrand +36 m) met vijf hoge blinde vensters, de pyloon (+38 m), de vleugels rond de grote binnenplaats (+25 tot +28 m) met de lage galerij (+19 m), de noordoosthoek (+31 m), de lage vleugels aan de vijver en de oostelijke binnenplaats (+18 tot +23 m) met vensterbanden, de dienstvleugels in het oosten (+17,5 tot +21 m) en de klokkentoren tot NAP +61 m met twee lagere steunberen, drie spleten per gevel onder de top en de klok. De overstekende dakplaten zijn weggelaten, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van de vier BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`raadhuis-hilversum-1-${scale}.stl`, `raadhuis-hilversum-grondplaat-1-${scale}.stl`],
      realWorld: {
        lengthM: +(hallBox.max[0] - hallBox.min[0]).toFixed(2),
        widthM: +(hallBox.max[1] - hallBox.min[1]).toFixed(2),
        highestPointNapM: +(hallBox.max[2] + GROUND_NAP).toFixed(2),
        towerTopNapM: TOWER.top,
        towerHeightAboveGroundM: TOWER.top - GROUND_NAP,
        councilHallRoofNapM: 31,
        pylonTopNapM: 38,
        courtWingsRoofNapM: [25, 28],
        groundNapM: GROUND_NAP,
        pondNapM: 13,
        baseNapM: 13.5,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Raadhuis_van_Hilversum",
        "PDOK BAG panden 0402100001495707 (raadhuis), 0402100001525323, 0402100001494252 en 0402100001519068 (oostelijke vleugels), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dakhoogte per bouwdeel, toren, maaiveld en vijver",
        "Wikimedia Commons: Raadhuis Hilversum Dudok A.jpg, B.jpg en C.jpg (zuidzijde met vijver en toren), Dudok Raadhuis Hilversum 05.JPG",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

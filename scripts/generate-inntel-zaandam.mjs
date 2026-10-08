// Genereert een vereenvoudigd, gesloten 3D-model van het Inntel Hotel in
// Zaandam (WAM Architecten, 2010): de hoteltoren van gestapelde Zaanse huisjes
// en de lage vleugel langs de Provincialeweg met een rij huisjes met de
// puntgevel naar beide straten. De gevels van de toren zijn vier rijen
// huisgevels met een puntgevel, verspringend gestapeld en 0,3 tot 0,9 m uit
// de gevel op een schuine onderkant; daarboven een mansardedak rondom met de
// bovenste puntgevels ervoor en de liftopbouw. Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-inntel-zaandam.mjs              # 1:1000 (standaard)
//   node scripts/generate-inntel-zaandam.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken en
// puntgevels lopen onder 45 graden of steiler omhoog en de uitstekende
// huisgevels rusten op een onderkant van 50 graden.
//
// Assenstelsel: oorsprong op RD (116158,79, 494630,03), in de toren, op het
// maaiveld (NAP +1,0 m), Z omhoog. +X loopt langs de vleugel naar het
// oostnoordoosten (RD-richting 20,1 graden, evenwijdig aan de gevels), +Y naar
// het noordnoordwesten. De vleugel ligt aan de -X-kant.
//
// Bronnen: BAG-pand 0479100000080433 (toren en vleugel, met de verspringende
// gevels van de huisjes); AHN DSM/DTM 0,5 m (PDOK WCS): goot en nok van de
// toren, de liftopbouw, de nokken van de vleugel en het maaiveld; foto's op
// Wikimedia Commons; PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "inntel-zaandam");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 1,0 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [116158.79, 494630.03];
const AXIS_DEG = 20.1;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 1.0;
const NAP = (h) => h - GROUND_NAP;
const BASE = NAP(0.5);
// BAG-contour (lokaal, op 0,01 m, zonder de sprongetjes van 0,2 m).
const PAND = [
  [-4.87, 13.6], [-4.87, 11.24], [-15.69, 11.2], [-15.68, 9.01], [-17.91, 9.0], [-17.91, 11.99], [-25.12, 12.0],
  [-25.12, 13.8], [-32.29, 13.79], [-32.3, 14.45], [-33.39, 15.58], [-39.52, 15.59], [-39.53, 17.38], [-46.72, 17.35],
  [-46.72, 19.16], [-55.39, 19.14], [-54.54, 0.49], [-46.69, 0.49], [-46.69, -1.3], [-39.47, -1.3], [-39.47, -3.09],
  [-32.26, -3.08], [-32.27, -3.99], [-25.1, -3.98], [-25.09, -2.17], [-17.36, -2.16], [-17.36, -1.26], [-15.13, -1.26],
  [-15.11, -10.97], [15.29, -11.06], [15.29, -1.47], [13.63, -1.46], [13.61, 11.41], [9.87, 11.4], [9.86, 13.61],
];
// Toren (AHN-DSM): goot NAP +34 m, mansardedak 3,5 m diep tot NAP +38 m
// (DSM 37 tot 39 m), liftopbouw tot NAP +40 m.
const TOWER_X = -15.12;
const TOWER = { eave: 34, ridge: 38, inset: 3.5, rect: [[-15.05, 13.55], [-10.9, 11.2]] };
const LIFT = { x: [-4, 5], y: [-3, 2], top: 40 };
// Vleugel: goot NAP +11 m, nokken NAP +15 m dwars op de vleugel, één
// zadeldak per huisje over de hele diepte; de grenzen van de huisjes volgen
// de verspringingen in de BAG-contour (om de 7,2 m).
const WING = { eave: 11, ridge: 15, x: [-55.4, -15.12], bounds: [-55.4, -46.7, -39.5, -32.3, -25.1, -17.4, -15.12] };
// Huisgevels op de toren: vier rijen, rij k begint op NAP +6 m + 7 m k, romp
// 4,5 m en puntgevel 2,5 m hoog (de bovenste rij romp 6 m en puntgevel 4 m tot
// boven de goot), zo'n 5 m breed, om de rij een halve breedte verspringend en
// 0,3, 0,6 of 0,9 m uit de gevel.
const ROWS = [
  { z: 6, body: 4.5, gable: 2.5 },
  { z: 13, body: 4.5, gable: 2.5 },
  { z: 20, body: 4.5, gable: 2.5 },
  { z: 27, body: 6, gable: 4 },
];
const HOUSE_WIDTH = 5;
const DEPTHS = [0.3, 0.6, 0.9];
const UNDERSIDE_DEG = 50;
// Gevels van de toren: [begin, eind, normaal naar buiten, laagste rij]. De
// westgevel begint boven de vleugel.
const FACES = [
  { p0: [-15.12, -10.97], p1: [15.29, -11.06], n: [0, -1], from: 0 },
  { p0: [15.29, -11.06], p1: [15.29, -1.47], n: [1, 0], from: 0 },
  { p0: [13.62, -1.47], p1: [13.62, 11.4], n: [1, 0], from: 0 },
  { p0: [13.62, 11.4], p1: [9.87, 11.4], n: [0, 1], from: 0 },
  { p0: [9.87, 13.6], p1: [-4.87, 13.6], n: [0, 1], from: 0 },
  { p0: [-4.87, 11.24], p1: [-15.12, 11.24], n: [0, 1], from: 1 },
  { p0: [-15.12, 11.24], p1: [-15.12, -10.97], n: [-1, 0], from: 1 },
];
// Maaiveld (AHN NAP +1 m): het trottoir aan de zuidkant van de vleugel.
const GROUND_SAMPLES = [[-20, -6], [-35, -6], [-48, -4]];

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

// ---------- toren ----------
const outline = prism(PAND, BASE, 100);
const towerBody = Manifold.intersection(outline, box([TOWER_X, 20], [-20, 20], BASE, NAP(TOWER.eave)));
const [[rx0, rx1], [ry0, ry1]] = TOWER.rect;
const mansard = Manifold.hull([
  ...at(rect([rx0, rx1], [ry0, ry1]), NAP(TOWER.eave) - 0.01),
  ...at(rect([rx0 + TOWER.inset, rx1 - TOWER.inset], [ry0 + TOWER.inset, ry1 - TOWER.inset]), NAP(TOWER.ridge)),
]);
const lift = box(LIFT.x, LIFT.y, NAP(TOWER.ridge) - 0.01, NAP(LIFT.top));
// Huisgevel als vijfhoek in het gevelvlak, d m naar buiten; de onderkant loopt
// onder 50 graden terug tot 0,3 m in de muur.
const house = (face, a0, a1, row, d) => {
  const len = Math.hypot(face.p1[0] - face.p0[0], face.p1[1] - face.p0[1]);
  const dir = [(face.p1[0] - face.p0[0]) / len, (face.p1[1] - face.p0[1]) / len];
  const z0 = NAP(row.z);
  const zb = z0 + row.body;
  const zt = zb + row.gable * ((a1 - a0) / HOUSE_WIDTH);
  const am = (a0 + a1) / 2;
  const drop = (d + 0.3) * Math.tan((UNDERSIDE_DEG * Math.PI) / 180);
  const pentagon = (depth, dz) =>
    [[a0, z0], [a1, z0], [a1, zb], [am, Math.min(zt, zb + row.gable)], [a0, zb]].map(([a, z]) => [
      face.p0[0] + dir[0] * a + face.n[0] * depth,
      face.p0[1] + dir[1] * a + face.n[1] * depth,
      z + dz,
    ]);
  return Manifold.hull([...pentagon(-0.3, -drop), ...pentagon(d, 0)]);
};
const houses = [];
let seed = 7;
const nextDepth = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return DEPTHS[seed % DEPTHS.length];
};
for (const face of FACES) {
  const len = Math.hypot(face.p1[0] - face.p0[0], face.p1[1] - face.p0[1]);
  const n = Math.max(1, Math.round(len / HOUSE_WIDTH));
  const w = len / n;
  ROWS.forEach((row, k) => {
    if (k < face.from) return;
    const shift = k % 2 ? w / 2 : 0;
    const edges = [0];
    for (let i = 0; i < n; i++) {
      const e = shift + w * (i + 1);
      if (e < len - 0.9) edges.push(e);
    }
    edges.push(len);
    for (let i = 0; i + 1 < edges.length; i++) {
      if (edges[i + 1] - edges[i] < 2) continue;
      houses.push(house(face, edges[i] + 0.15, edges[i + 1] - 0.15, row, nextDepth()));
    }
  });
}
const tower = Manifold.union([towerBody, mansard, lift, ...houses]);

// ---------- vleugel ----------
const wingBody = Manifold.intersection(outline, box([-60, TOWER_X], [-20, 30], BASE, NAP(WING.eave)));
const wingRoofs = [];
for (let i = 0; i + 1 < WING.bounds.length; i++) {
  const [s0, s1] = [WING.bounds[i], WING.bounds[i + 1]];
  const sm = (s0 + s1) / 2;
  const rise = Math.min(WING.ridge - WING.eave, (s1 - s0) / 2 / Math.tan((40 * Math.PI) / 180));
  const pts = [];
  for (const y of [-10, 25]) pts.push([s0, y, NAP(WING.eave) - 0.01], [s1, y, NAP(WING.eave) - 0.01], [sm, y, NAP(WING.eave) + rise]);
  wingRoofs.push(Manifold.hull(pts));
}
const wing = Manifold.union([wingBody, Manifold.intersection(Manifold.union(wingRoofs), outline)]);

const hotel = Manifold.union([tower, wing]);
const nodes = [["building:hotel", hotel]];
const all = hotel;

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of nodes) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      throw new Error(`${name}: ondervlak op z ${Math.min(...p.map((q) => q[2])).toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))}`);
    }
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
console.log("huisgevels op de toren:", houses.length);
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
const glbFile = path.join(outDir, "inntel-zaandam.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-inntel-zaandam.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `inntel-zaandam-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Inntel Hotel Zaandam 1:${scale} mm Z-up`);
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

const hallBox = hotel.boundingBox();
await writeFile(
  path.join(outDir, "inntel-zaandam.json"),
  JSON.stringify(
    {
      name: "Inntel Hotel Zaandam",
      file: "inntel-zaandam.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het trottoir aan de zuidkant van de vleugel (NAP +1 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0479100000080433"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (116158,79, 494630,03), in de toren, op het maaiveld (NAP +1,0 m), +X langs de vleugel naar het oostnoordoosten (20,1 graden vanaf het oosten) en +Y naar het noordnoordwesten. Eén node building:hotel met de hoteltoren op de BAG-contour tot de goot op NAP +34 m, een mansardedak rondom tot +38 m met de liftopbouw tot +40 m, en op de gevels vier rijen gestapelde huisgevels met een puntgevel (zo'n 5 m breed, per rij een halve breedte verspringend, 0,3 tot 0,9 m uit de gevel op een onderkant van 50 graden; de bovenste puntgevels tot +37 m voor het mansardedak), en de lage vleugel tot de goot op +11 m met per huisje een zadeldak dwars op de vleugel tot +15 m, met de puntgevel naar beide straten. Alles staat recht op of loopt onder 45 graden of steiler omhoog, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van het BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`inntel-zaandam-1-${scale}.stl`],
      realWorld: {
        lengthM: +(hallBox.max[0] - hallBox.min[0]).toFixed(2),
        widthM: +(hallBox.max[1] - hallBox.min[1]).toFixed(2),
        highestPointNapM: +(hallBox.max[2] + GROUND_NAP).toFixed(2),
        towerEaveNapM: TOWER.eave,
        towerRidgeNapM: TOWER.ridge,
        liftTopNapM: LIFT.top,
        wingEaveNapM: WING.eave,
        wingRidgeNapM: WING.ridge,
        houseFronts: houses.length,
        groundNapM: GROUND_NAP,
        baseNapM: 0.5,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Inntel_Hotel_Zaandam",
        "PDOK BAG pand 0479100000080433, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: goot, nok en liftopbouw van de toren, nokken van de vleugel, maaiveld",
        "Wikimedia Commons: Inntel Hotels Amsterdam Zaandam.jpg, Zaanstad Inntel Hotel 01.jpg, 07.jpg en 10.jpg, Zaandam - Provincialeweg - View NNW on Inntel Hotel 2010 by Wilfried van Winden.jpg",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

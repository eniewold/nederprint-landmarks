// Genereert een vereenvoudigd, gesloten 3D-model van De Rotterdam (OMA, 2013)
// op de Wilhelminapier: de plint over de hele kavel, de drie torens met hun
// onderdelen tot circa NAP +88 m en de verspringende bovendelen tot NAP +149 m,
// met de dakopbouwen. Het AHN ziet alleen de bovenkant: waar een bovendeel
// uitkraagt boven een smaller onderdeel, loopt het model recht door tot de
// plint; waar een onderdeel buiten het bovendeel uitsteekt, staat de richel op
// +88 m (de zichtbare verspringing). Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-de-rotterdam.mjs              # 1:1000 (standaard)
//   node scripts/generate-de-rotterdam.mjs --scale 2000
//
// Uitkragingen (foto's van de rivier- en straatzijde): de bovenbouw (NAP +88 tot
// +149 m) begint pas op +88 m en rust op een onderbouw die er per toren anders
// onder staat. De bovenste plaat van de westtoren kraagt 6,2 m uit aan de
// buitenkant, die van de oosttoren 6,8 m over een sleuf van 3,3 m tussen de
// onderbouw van de midden- en de oosttoren (door de hele diepte), en de
// middentoren heeft een onderbouw die 8 m breder is dan zijn bovenbouw. Het
// model heeft dus vlakke onderkanten op +88 m; de export zet daar onder 45
// graden steun onder.
//
// Assenstelsel: oorsprong op RD (93136,02, 435733,86), het midden van het
// BAG-pand, op het maaiveld van de pier (NAP +3,5 m), Z omhoog. +X loopt langs
// de lange as naar het noordoosten (RD-richting 39,1 graden), +Y naar het
// noordwesten, de Nieuwe Maas. De westtoren ligt aan de -X-kant.
//
// Bronnen: BAG-pand 0599100100002429 (rechthoek van 107,1 bij 49,6 m); AHN DSM
// 0,5 m (PDOK WCS), in het stelsel van het gebouw per 1 m bemonsterd en naar
// de niveaus +31, +74, +88, +149 en +155 m gekwantiseerd; Wikipedia; foto's op
// Wikimedia Commons.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "de-rotterdam");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 3,5 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [93136.02, 435733.86];
const AXIS_DEG = 39.1;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.5;
const NAP = (h) => h - GROUND_NAP;
const BASE = NAP(3.0);
// Halve lengte en breedte van het BAG-pand.
const HX = 53.55;
const HY = 24.8;
// Blokken [x0, x1], [y0, y1] met het dak in NAP, afgelezen in het
// gekwantiseerde AHN-raster per 1 m.
const PLINTH = { x: [-HX, HX], y: [-HY, HY], top: 31 };
const LOWER = [
  // Onderdelen van de drie torens tot de verspringing (x uit de verhoudingen op
  // een foto van de rivierzijde): westtoren x -47,3 tot -21,5 m (de bovenste
  // plaat loopt tot -53,5 m), middentoren -21,5 tot 21,1 m, oosttoren 24,4 tot
  // 53 m (de bovenste plaat begint op 17,6 m); tussen midden- en oosttoren de
  // sleuf van 3,3 m.
  { name: "onderdelen west en midden", x: [-47.3, 21.1], y: [-8, 15], top: 88 },
  { name: "onderdelen oost", x: [24.4, 53], y: [-8, 15], top: 88 },
  { name: "onderdelen rivierzijde west", x: [-47.3, -21], y: [15, HY], top: 88 },
  { name: "onderdelen rivierzijde midden", x: [-5, 21.1], y: [15, HY], top: 88 },
  { name: "onderdelen rivierzijde oost", x: [24.4, 53], y: [15, HY], top: 88 },
  { name: "richel tussen west en midden", x: [-21, -5], y: [15, 17], top: 88 },
  { name: "onderdelen straatzijde west en midden", x: [-29, 21.1], y: [-14, -8], top: 88 },
  { name: "onderdelen straatzijde oost", x: [24.4, 53], y: [-14, -8], top: 88 },
  { name: "middentoren straatzijde", x: [-20, -4], y: [-22, -14], top: 88 },
  { name: "oosttoren straatzijde", x: [31, HX], y: [-18, -14], top: 88 },
  { name: "oosttoren onderste richel", x: [28, HX], y: [-21, -18], top: 74 },
  { name: "westtoren straatzijde", x: [-52.5, -29], y: [-14, -8], top: 74 },
];
const UPPER = [
  { name: "westtoren", x: [-53.5, -26.8], y: [-7, HY], top: 149 },
  { name: "middentoren", x: [-21, 15], y: [-13, 15], top: 149 },
  { name: "middentoren rivierzijde", x: [-5, 15], y: [15, HY], top: 149 },
  { name: "middentoren straatzijde", x: [-15, -4], y: [-19, -13], top: 149 },
  { name: "oosttoren", x: [17.6, HX], y: [-13, HY], top: 149 },
];
const ROOF = [
  { name: "dakopbouw midden", x: [-10, 0], y: [-6, 7], top: 155 },
  { name: "dakopbouw west", x: [-47, -44], y: [-1, 3], top: 155 },
  { name: "dakopbouw oost", x: [35, 45], y: [-7, 7], top: 155 },
];
// Niveau waarop de bovenbouw begint; de onderkanten van de uitkragingen.
const UPPER_FROM = 88;
// Maaiveld (AHN NAP +3,0 tot +3,5 m): de kade aan de straatzijde, 3 m voor de
// plint.
const GROUND_SAMPLES = [[-40, -28], [0, -28], [40, -28]];

// ---------- hulpfuncties ----------
const box = ([x0, x1], [y0, y1], z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
const block = ({ x, y, top }) => box(x, y, BASE, NAP(top));
// De bovenbouw begint op NAP +88 m (uitkragend waar de onderbouw smaller is) en
// de dakopbouwen beginnen op het dak van de bovenbouw (NAP +149 m).
const upperBlock = ({ x, y, top }) => box(x, y, NAP(UPPER_FROM), NAP(top));
const roofBlock = ({ x, y, top }) => box(x, y, NAP(149) - 0.01, NAP(top));

// ---------- gebouw ----------
const building = Manifold.union([block(PLINTH), ...LOWER.map(block), ...UPPER.map(upperBlock), ...ROOF.map(roofBlock)]);

const nodes = [["building:de-rotterdam", building]];
const all = building;

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of nodes) {
  // Naar beneden gerichte vlakken mogen alleen de onderkanten van de
  // uitkragingen zijn: op de onderkant van de bovenste platen (NAP +88 m).
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nz = e1[0] * e2[1] - e1[1] * e2[0];
    if (nz < -1e-9 && Math.abs(Math.min(...p.map((q) => q[2])) - NAP(UPPER_FROM)) > 1e-6) {
      throw new Error(`${name}: ondervlak op z ${Math.min(...p.map((q) => q[2]))}`);
    }
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
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
const glbFile = path.join(outDir, "de-rotterdam.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-de-rotterdam.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `de-rotterdam-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint De Rotterdam 1:${scale} mm Z-up`);
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

const hallBox = building.boundingBox();
await writeFile(
  path.join(outDir, "de-rotterdam.json"),
  JSON.stringify(
    {
      name: "De Rotterdam",
      file: "de-rotterdam.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op de kade aan de straatzijde, 3 m voor de plint (NAP +3,0 tot +3,5 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0599100100002429"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (93136,02, 435733,86), het midden van het BAG-pand, op het maaiveld van de pier (NAP +3,5 m), +X langs de lange as naar het noordoosten (39,1 graden vanaf het oosten) en +Y naar het noordwesten, de Nieuwe Maas. Eén node building:de-rotterdam met de plint (NAP +31 m) over de hele kavel van 107 bij 50 m, de onderdelen van de drie torens tot de verspringing (NAP +88 m, aan de straatzijde richels op +74 m) met de nis tot op de plint aan de rivierzijde tussen west- en middentoren, de drie verspringende bovendelen tot NAP +149 m en de dakopbouwen tot +155 m, afgelezen in het AHN-DSM. Waar een bovendeel boven een smaller onderdeel uitkraagt, loopt het model recht door; alle blokken staan op het blok eronder, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van het BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`de-rotterdam-1-${scale}.stl`],
      realWorld: {
        lengthM: +(hallBox.max[0] - hallBox.min[0]).toFixed(2),
        widthM: +(hallBox.max[1] - hallBox.min[1]).toFixed(2),
        highestPointNapM: +(hallBox.max[2] + GROUND_NAP).toFixed(2),
        plinthNapM: PLINTH.top,
        setbackNapM: 88,
        towerTopNapM: 149,
        roofStructuresNapM: 155,
        groundNapM: GROUND_NAP,
        baseNapM: 3.0,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/De_Rotterdam",
        "PDOK BAG pand 0599100100002429, EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS, per 1 m in het stelsel van het gebouw bemonsterd en gekwantiseerd naar +31, +74, +88, +149 en +155 m",
        "Wikimedia Commons: De Rotterdam across the Nieuwe Maas.jpg, De Rotterdam south side.jpg, De Rotterdam, September 2019 - 01.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

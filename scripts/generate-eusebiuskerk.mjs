// Genereert een vereenvoudigd, gesloten 3D-model van de Eusebiuskerk (Grote
// Kerk) in Arnhem: de laatgotische hallenkerk met de lessenaarsdaken van de
// zijbeuken, het hoge middenschip en koor onder één zadeldak dat over de
// veelhoekige koorsluiting afschildt, het transept met de dakruiter op de
// viering, de lage kapellen en portalen langs de zijgevels en de westtoren van
// 93 m in vier geledingen. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-eusebiuskerk.mjs              # 1:1000 (standaard)
//   node scripts/generate-eusebiuskerk.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alles staat recht op of loopt schuin
// omhoog, en elke geleding van de toren is smaller dan de vorige.
//
// Assenstelsel: oorsprong op RD (190932, 443533,5), midden in het schip, op
// het maaiveld aan de oostkant (NAP +12,7 m), Z omhoog. +X loopt langs de as
// van de kerk naar het koor in het oosten (RD-richting -1,0 graad), +Y naar het
// noorden; de toren staat aan de -X-kant.
//
// Bronnen: BAG-pand 0202100000253372 (contour); AHN DSM/DTM 0,5 m (PDOK WCS) in
// een stelsel langs de as: dwarsprofielen van schip, zijbeuken, transept en
// koor (mediaan per meter), de omhullende per hoogte van de toren (top NAP
// +108,4 m), de kapellen, portalen en het maaiveld; Wikipedia; PDOK luchtfoto.
// Geschat: de hoogtes van de geledingen van de toren tussen de gemeten
// omhullende-stappen, de lage kapellen tussen de steunberen en de dakruiter.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "eusebiuskerk");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- maten (lokaal stelsel, z = NAP - 12,7 m) ----------
const ORIGIN = [190932, 443533.5];
const ANGLE = (-1.0 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 12.7;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour (lokaal, vereenvoudigd tot 0,3 m).
const OUTLINE = [
  [-42.0, -4.8], [-42.0, -6.4], [-41.6, -6.4], [-41.6, -7.1], [-40.7, -8.2], [-39.0, -8.8], [-39.0, -13.6],
  [-39.9, -14.5], [-39.1, -15.4], [-38.0, -14.3], [-32.9, -14.4], [-32.9, -15.8], [-31.8, -15.8], [-31.8, -14.5],
  [-26.5, -14.4], [-26.6, -15.9], [-25.4, -15.9], [-25.4, -14.5], [-20.6, -14.6], [-20.5, -16.0], [-19.4, -16.1],
  [-19.4, -14.4], [-14.0, -14.5], [-14.4, -19.5], [-15.4, -20.5], [-14.8, -21.0], [-14.0, -20.4], [-8.2, -20.4],
  [-8.2, -21.4], [-7.2, -21.5], [-7.2, -20.4], [-2.1, -20.5], [-2.1, -22.9], [-3.4, -25.1], [-2.0, -26.3],
  [-0.5, -23.2], [10.4, -23.0], [12.5, -25.4], [13.9, -24.4], [13.2, -23.6], [13.4, -20.7], [17.4, -20.9],
  [18.2, -22.2], [19.4, -21.5], [18.5, -19.9], [22.7, -20.0], [23.4, -20.4], [24.2, -19.9], [23.6, -19.2],
  [23.5, -16.4], [23.9, -16.4], [23.9, -14.7], [29.9, -13.9], [30.1, -15.5], [31.3, -15.4], [31.2, -13.8],
  [36.9, -9.7], [38.7, -10.4], [39.2, -9.2], [37.4, -8.3], [40.2, -2.9], [42.1, -3.4], [42.4, -1.8], [41.1, -1.4],
  [40.8, 6.7], [42.1, 7.4], [41.2, 8.7], [40.1, 8.1], [36.0, 12.1], [37.2, 13.2], [36.4, 14.0], [35.0, 12.9],
  [30.1, 15.1], [30.1, 16.6], [28.7, 16.7], [28.7, 15.3], [23.9, 15.3], [23.9, 16.6], [22.7, 16.6], [22.6, 15.2],
  [18.2, 15.2], [18.1, 16.6], [17.4, 16.6], [17.6, 24.2], [13.8, 24.3], [12.0, 26.5], [9.8, 24.5], [-0.6, 24.6],
  [-2.0, 26.5], [-3.3, 25.8], [-1.9, 23.4], [-1.9, 18.9], [-7.3, 18.9], [-7.9, 15.4], [-12.8, 15.4],
  [-12.7, 16.8], [-13.8, 16.8], [-13.9, 15.5], [-18.8, 15.6], [-18.8, 16.9], [-20.0, 16.9], [-20.0, 15.6],
  [-25.2, 15.7], [-25.3, 17.0], [-26.4, 17.0], [-26.4, 15.7], [-31.6, 15.8], [-31.6, 17.1], [-32.6, 17.1],
  [-32.7, 15.8], [-37.7, 15.8], [-38.7, 16.9], [-39.6, 16.1], [-38.7, 15.1], [-38.8, 10.1], [-39.7, 10.1],
  [-39.7, 9.6], [-41.3, 9.0], [-41.4, 8.0], [-41.8, 7.9], [-41.7, 6.3], [-39.6, 6.3], [-39.7, -4.8],
];
// Zijbeuken: lessenaarsdak van de buitenmuur (goot) naar de muur van het
// middenschip. De buitenomtrek volgt de muren, de koorsluiting veelhoekig.
const AISLE = {
  eave: 28.5,
  top: 33.3,
  outer: [[-39.5, -15.2], [30.5, -15.2], [37.5, -9.5], [41.0, -3.0], [41.0, 7.0], [36.5, 12.0], [30.5, 15.2], [-39.5, 15.2]],
  inner: [[-39.5, -7.3], [30.5, -7.3], [33.5, -4.8], [34.5, 0], [33.5, 4.8], [30.5, 7.3], [-39.5, 7.3]],
};
const NAVE = { eave: 39.5, ridge: 49.6, ridgeFrom: -26, ridgeTo: 30.5, from: -26 };
const NAVE_OUTLINE = AISLE.inner.map(([x, y]) => [Math.max(x, -26), y]);
const TRANSEPT = { x: [-2.3, 11.8], y: [-23.3, 24.6], eave: 39.5, ridge: 50.0 };
const TURRET = { centre: [4.75, 0.0], radius: 1.4, base: 47.0, tip: 56.0 };
// Lage delen buiten de zijbeuken (NAP).
const LOW_DEFAULT = 17.5; // kapellen en steunberen
const LOW_PARTS = [
  { x: [-14.6, -2.0], y: [-21.6, -14.0], top: 24.5 }, // zuidportaal
  { x: [13.0, 24.4], y: [-22.4, -14.0], top: 24.0 }, // kapel ten zuiden van het koor
  { x: [-8.0, -1.8], y: [14.0, 19.0], top: 19.5 },
  { x: [13.5, 17.8], y: [14.0, 24.5], top: 19.5 },
];
// Toren in vier geledingen [x0, x1, y0, y1, top] en een spits.
const TOWER = {
  stages: [
    [-40.8, -25.2, -7.2, 8.8, 52.0],
    [-39.8, -25.5, -6.2, 7.8, 64.0],
    [-39.2, -26.2, -5.8, 7.2, 72.0],
    [-38.2, -27.5, -4.8, 5.8, 95.0],
    [-35.8, -29.2, -4.2, 3.8, 99.0],
  ],
  tip: [-32.75, 0.25, 108.4],
};
// Maaiveld (lokaal) rondom; het laagste punt aan de oostkant.
const GROUND_SAMPLES = [[0, 32], [0, -32], [48, -4], [-50, 0]];

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
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);

// ---------- opbouw ----------
const aisleZone = prism(AISLE.outer, BASE - 1, 200);
const parts = [
  // lage delen buiten de zijbeuken
  Manifold.intersection(outline.subtract(aisleZone), box([-100, 100], [-100, 100], BASE, NAP(LOW_DEFAULT))),
  ...LOW_PARTS.map(({ x, y, top }) => Manifold.intersection(outline, box(x, y, BASE, NAP(top)))),
  // zijbeuken tot de goot en hun lessenaarsdak
  Manifold.intersection(outline, prism(AISLE.outer, BASE, NAP(AISLE.eave))),
  Manifold.intersection(
    outline,
    Manifold.hull([...at(AISLE.outer, BASE), ...at(AISLE.outer, NAP(AISLE.eave)), ...at(AISLE.inner, NAP(AISLE.top))]),
  ),
  // middenschip en koor: muren tot de goot, zadeldak met afgeschilde koorsluiting
  Manifold.hull([
    ...at(NAVE_OUTLINE, BASE),
    ...at(NAVE_OUTLINE, NAP(NAVE.eave)),
    [NAVE.ridgeFrom, 0, NAP(NAVE.ridge)],
    [NAVE.ridgeTo, 0, NAP(NAVE.ridge)],
  ]),
  // transept met topgevels
  Manifold.hull(
    TRANSEPT.y.flatMap((y) => [
      [TRANSEPT.x[0], y, BASE], [TRANSEPT.x[1], y, BASE],
      [TRANSEPT.x[0], y, NAP(TRANSEPT.eave)], [TRANSEPT.x[1], y, NAP(TRANSEPT.eave)],
      [(TRANSEPT.x[0] + TRANSEPT.x[1]) / 2, y, NAP(TRANSEPT.ridge)],
    ]),
  ),
  // dakruiter op de viering
  Manifold.cylinder(NAP(TURRET.tip) - NAP(TURRET.base), TURRET.radius, 0, 0).translate([
    TURRET.centre[0],
    TURRET.centre[1],
    NAP(TURRET.base),
  ]),
  // toren
  ...TOWER.stages.map(([x0, x1, y0, y1, top]) => box([x0, x1], [y0, y1], BASE, NAP(top))),
  (() => {
    const [x0, x1, y0, y1, top] = TOWER.stages[TOWER.stages.length - 1];
    const [tx, ty, tz] = TOWER.tip;
    return Manifold.hull([[x0, y0, NAP(top) - 0.01], [x1, y0, NAP(top) - 0.01], [x0, y1, NAP(top) - 0.01], [x1, y1, NAP(top) - 0.01], [tx, ty, NAP(tz)]]);
  })(),
];
const church = Manifold.union(parts);
const nodes = [["building:eusebiuskerk", church]];

// ---------- controles ----------
if (church.status() !== "NoError") throw new Error(church.status());
{
  const mesh = church.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nz = e1[0] * e2[1] - e1[1] * e2[0];
    if (nz < -1e-6) area += -nz / 2;
  }
  console.log(`ondervlak boven de onderkant: ${area.toFixed(3)} m2`);
  if (area > 0.01) throw new Error("overhang");
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
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "eusebiuskerk.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-eusebiuskerk.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `eusebiuskerk-1-${scale}.stl`);
const printSolid = church.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Eusebiuskerk 1:${scale} mm Z-up`);
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

await writeFile(
  path.join(outDir, "eusebiuskerk.json"),
  JSON.stringify(
    {
      name: "Eusebiuskerk",
      file: "eusebiuskerk.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +12,7 tot +13,5 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0202100000253372"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (190932, 443533,5), midden in het schip, op het maaiveld aan de oostkant (NAP +12,7 m), +X langs de as naar het koor in het oosten (RD-richting -1,0 graad) en +Y naar het noorden; de toren staat aan de -X-kant. Eén node building: zijbeuken met lessenaarsdaken (NAP +28,5 tot +33,3 m), middenschip en koor onder één zadeldak (goot +40,5 m, nok +49,6 m) met afgeschilde koorsluiting, transept (nok +50,0 m) met dakruiter, lage kapellen en portalen, en de westtoren in vier geledingen tot +108,4 m. Alles staat recht op of loopt schuin omhoog, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0202100000253372. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`eusebiuskerk-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        naveRidgeNapM: NAVE.ridge,
        aisleEaveNapM: AISLE.eave,
        towerTopNapM: TOWER.tip[2],
        towerStagesNapM: TOWER.stages.map((s) => s[4]),
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Sint-Eusebiuskerk",
        "PDOK BAG pand 0202100000253372 (contour), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dwarsprofielen van schip, zijbeuken, transept en koor, omhullende per hoogte van de toren, kapellen, portalen en maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

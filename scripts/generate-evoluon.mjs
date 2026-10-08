// Genereert een vereenvoudigd, gesloten 3D-model van het Evoluon in Eindhoven
// (Louis Kalff en Leo de Bever, 1966): de betonnen schotel van 77 m met de
// koepel, het glazen kapje, de ring van 48 dakkapellen langs de rand en de
// flauw gebogen onderschaal, op de glazen trommel en tien V-kolommen. Alle
// maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, één node met de materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-evoluon.mjs              # 1:1000 (standaard)
//   node scripts/generate-evoluon.mjs --scale 500
//
// De onderschaal loopt maar circa 18 graden op en print niet zonder steun; het
// model houdt de echte vorm en de export zet er met de optie ‘Printbare
// overhang’ een kraag onder de ingestelde hoek onder (45 graden geeft een
// kegel, 70 graden een bijna zwevende schotel). Daarom zit alles in één node.
//
// Assenstelsel: oorsprong in het hart van de schotel op het maaiveld
// (NAP +18,8 m), Z omhoog, +X naar het oosten, +Y naar het noorden.
//
// Bronnen: BAG-pand 0772100000294873 (diameter 77,5 m); AHN DSM/DTM 0,5 m (PDOK
// WCS) voor het hart, het koepelprofiel, het kapje, de dakkapellen en de rand;
// Wikipedia (diameter 77 m, V-kolommen, twee schalen); Wikimedia
// Commons-foto's voor de onderschaal, de trommel en de kolommen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "evoluon");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Omwentelingslichaam uit een profiel [straal, hoogte] rond de Z-as.
const revolve = (profile, segments = 192) => Manifold.revolve([ccw(profile)], segments);

// ---------- maten (z = NAP - 18,8 m) ----------
const ORIGIN = [159147.75, 383826.25];
const NAP = (h) => h - 18.8;
// Bovenkant volgens het AHN (mediaan per straal): kapje tot NAP +49,7 m, koepel
// van +46,9 m op straal 5 m naar +37,4 m op straal 34,5 m, daarbuiten de rand
// op +35,0 m tot straal 38,75 m.
const DOME = [
  [0, 49.7], [1, 49.56], [2, 49.3], [3, 48.8], [4, 47.6], [4.6, 46.95], [6, 46.7],
  [8, 46.46], [10, 46.18], [12, 45.84], [15, 45.21], [18, 44.43], [20, 43.8],
  [22, 43.13], [25, 41.96], [28, 40.62], [30, 39.62], [32, 38.54], [34, 37.54],
  [34.5, 37.3],
];
const RIM = { inner: 34.5, outer: 38.75, top: 35.0, bottom: 34.0 };
// Onderschaal (foto, schaal uit de diameter): vlakke onderkant op NAP +27,7 m
// tot straal 17,5 m, dan flauw oplopend naar de onderkant van de rand.
const UNDERSIDE = [
  [38.75, 34.0], [37.5, 33.5], [35, 32.8], [30, 31.3], [25, 29.9], [21, 28.5], [17.5, 27.7],
];
// 48 dakkapellen langs de rand (luchtfoto en AHN: hoogste punten op de
// verlengde koepellijn tot straal 37,6 m, daartussen de rand op +35,0 m).
const DORMER = { count: 48, from: 33.5, to: 37.6, width: 2.4, base: 34.9, slope: 0.52 };
// Glazen trommel en tien V-kolommen (foto: kolommen op 36 graden onderling).
const DRUM = { radius: 15.0 };
const COLUMNS = { count: 10, footRadius: 16.5, spread: 3.2, size: 1.2 };

// ---------- schotel ----------
const domeLine = (r) => {
  for (let i = 1; i < DOME.length; i++) {
    const [r0, z0] = DOME[i - 1];
    const [r1, z1] = DOME[i];
    if (r <= r1) return z0 + ((z1 - z0) * (r - r0)) / (r1 - r0);
  }
  return DOME[DOME.length - 1][1] - DORMER.slope * (r - DOME[DOME.length - 1][0]);
};
const saucerProfile = [
  [0, NAP(27.7)],
  ...UNDERSIDE.slice().reverse().map(([r, z]) => [r, NAP(z)]),
  [RIM.outer, NAP(RIM.top)],
  [RIM.inner, NAP(RIM.top)],
  ...DOME.slice().reverse().map(([r, z]) => [r, NAP(z)]),
];
const saucer = revolve(saucerProfile);

const dormers = [];
for (let k = 0; k < DORMER.count; k++) {
  // Profiel in het RZ-vlak, uitgetrokken over de breedte en rondgedraaid.
  const profile = ccw([
    [DORMER.from, NAP(DORMER.base)],
    [DORMER.to, NAP(DORMER.base)],
    [DORMER.to, NAP(domeLine(DORMER.to))],
    [DORMER.from, NAP(domeLine(DORMER.from))],
  ]);
  const dormer = Manifold.extrude([profile], DORMER.width)
    .rotate([90, 0, 0])
    .translate([0, DORMER.width / 2, 0])
    .rotate([0, 0, (360 * k) / DORMER.count]);
  dormers.push(dormer);
}

// ---------- trommel en kolommen ----------
const drum = Manifold.cylinder(NAP(27.7) + 0.8, DRUM.radius, DRUM.radius, 96, false).translate([0, 0, -0.5]);
const columns = [];
const columnTop = NAP(27.7) + 0.6;
for (let k = 0; k < COLUMNS.count; k++) {
  const a = (2 * Math.PI * k) / COLUMNS.count;
  const radial = [Math.cos(a), Math.sin(a)];
  const tangent = [-Math.sin(a), Math.cos(a)];
  const foot = [COLUMNS.footRadius * radial[0], COLUMNS.footRadius * radial[1], -0.5];
  for (const side of [-1, 1]) {
    const head = [
      foot[0] + side * COLUMNS.spread * tangent[0],
      foot[1] + side * COLUMNS.spread * tangent[1],
      columnTop,
    ];
    const leg = Manifold.hull([
      Manifold.cube([COLUMNS.size, COLUMNS.size, 0.01], true).translate(foot),
      Manifold.cube([COLUMNS.size, COLUMNS.size, 0.01], true).translate(head),
    ]);
    columns.push(leg);
  }
}

const evoluon = union([saucer, ...dormers, drum, ...columns]);
const nodes = [["building:evoluon", evoluon]];
const printModel = evoluon;

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
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "evoluon.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-evoluon.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de voet van trommel en kolommen op het printbed.
const stlFile = path.join(outDir, `evoluon-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, 0.5]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Evoluon Eindhoven 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts.
await writeFile(
  path.join(outDir, "evoluon.json"),
  JSON.stringify(
    {
      name: "Evoluon",
      file: "evoluon.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: [1, 0],
      groundOffsetMetres: -0.3,
      // Gras en paden ten noorden van de schotel (NAP +18,8 m), niet de
      // gebouwen ernaast.
      groundSamplePoints: [
        [0, 45],
        [22.5, 39],
        [-22.5, 39],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0772100000294873"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de schotel op het maaiveld (NAP +18,8 m) in de oorsprong, +X naar het oosten en +Y naar het noorden. Eén node met schotel, dakkapellen, trommel en kolommen. De onderschaal heeft de echte, flauwe vorm; de export zet er met de optie Printbare overhang een kraag onder. Vervangt de PDOK-reconstructie van BAG-pand 0772100000294873.",
      printFiles: [`evoluon-1-${scale}.stl`],
      realWorld: {
        diameterM: RIM.outer * 2,
        topNapM: DOME[0][1],
        rimTopNapM: RIM.top,
        undersideNapM: 27.7,
        dormers: DORMER.count,
        columns: COLUMNS.count,
        drumDiameterM: DRUM.radius * 2,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Evoluon",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/532277",
        "PDOK BAG pand 0772100000294873, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: hart, koepelprofiel, kapje, dakkapellen, rand en maaiveld",
        "Wikimedia Commons: Cmglee Evoluon side.jpg, 532277 Eindhoven Evoluon.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

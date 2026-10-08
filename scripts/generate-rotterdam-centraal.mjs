// Genereert een vereenvoudigd, gesloten 3D-model van Rotterdam Centraal
// (Team CS, 2014) uit vlakken: de perronkap, een rechthoek van 244 bij 156 m
// met een zaagtand van schuine ramen (ribben om de 5,4 m), en de stationshal
// met de puntige kap die naar het Stationsplein omhoog steekt, opgebouwd uit
// een paar grote driehoekige en vierhoekige dakvlakken (planvergelijkingen uit
// het AHN-DSM) met zes piramidevormige ramen. De perronkap is dicht tot de
// onderkant, zoals bij Leiden Centraal. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-rotterdam-centraal.mjs              # 1:1000 (standaard)
//   node scripts/generate-rotterdam-centraal.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: elk dakvlak is een prisma met een
// vlakke bovenkant op een rechte onderkant; geen enkel vlak wijst naar beneden.
//
// Assenstelsel: oorsprong op RD (91911, 437670), midden in de stationshal, op
// het maaiveld van het Stationsplein (NAP 0,0 m), Z omhoog, +X naar het oosten
// en +Y naar het noorden (de RD-assen). De punt van de hal wijst naar het
// zuidzuidoosten; de perronkap ligt ten noorden en noordwesten van de hal.
//
// Bronnen: BAG-panden 0599100100007430 (de stationshal) en 0599100000700024
// (onder de perronkap); AHN DSM/DTM 0,5 m (PDOK WCS): de rechthoek van de
// kap, de ribben, de dakvlakken en de plaats van de ramen; Wikipedia; PDOK
// luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "rotterdam-centraal");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP) ----------
const ORIGIN = [91911, 437670];
const X_AXIS = [1, 0];
const GROUND_NAP = 0.0;
const NAP = (h) => h - GROUND_NAP;
// Onderkant op NAP -2,5 m, onder de straat aan de noordkant (NAP -1 tot -2 m).
const BASE = NAP(-2.5);
// Alle coördinaten hieronder zijn gegeven ten opzichte van RD (91871, 437790).
const GRID_REF = [91871, 437790];
const SHIFT = [GRID_REF[0] - ORIGIN[0], GRID_REF[1] - ORIGIN[1]];
// Contour van het geheel (BAG-panden, op 1,5 m vereenvoudigd): de perronkap en
// de hal, aan de westkant afgesneden waar de lagere perronkappen beginnen.
const OUTLINE = [
  [-146, -100], [-191, 49], [-190, 50], [39, 123], [45, 123], [91, -27], [92, -62], [76, -69], [75, -77], [82, -139],
  [80, -143], [93, -163], [94, -168], [90, -169], [-1, -147], [-22, -100], [-48, -73],
];
// Perronkap: een rechthoek, draaiend 17,6 graden ten opzichte van de RD-assen,
// met een zaagtand van schuine ramen dwars op de lange as: een rib om de 5,4 m,
// 0,7 m hoog, boven een basis op NAP +16,6 m (AHN-DSM 16,6 tot 17,3 m).
const CANOPY = { corners: [[-190.5, 49.5], [42, 123.5], [91, -27], [-146, -100]], base: 16.6, pitch: 5.4, rib: 0.7 };
// Dakvlakken van de hal als z = a x + b y + c (NAP, gefit op het AHN-DSM met
// k-vlakken; 98 % van de cellen binnen 1 m) op een veelhoek van het
// rasterstelsel:
// - west: het lage vlak naast de perronkap, tot de lijn x = 0 tot 4 m;
// - midden: het grote vlak met de piramideramen, een vlieger van de kap tot
//   de punt op (92, -167); aan de oostkant een steile rand van 5 tot 14 m;
// - oost: het lagere vlak op de oostkant, begrensd op de hoogte van de perronkap.
const FACETS = [
  { name: "west", plane: [-0.017, 0.058, 18.11], poly: [[-48, -73], [-22, -100], [-1, -147], [0, -148], [3, -76], [9, -50], [-48, -50]] },
  { name: "midden", plane: [0.238, 0.041, 15.99], poly: [[8, -46], [19, -45], [92, -167], [91, -170], [0, -148], [2, -76]] },
  { name: "oost", plane: [0.106, 0.175, 20.71], cap: 16.6, poly: [[19, -45], [91, -27], [92, -62], [76, -69], [75, -77], [82, -139], [80, -146.6], [26, -56.7]] },
];
// Piramidevormige ramen in het middenvlak (ten opzichte van het rasterstelsel):
// 3,6 bij 5,4 m, 1,3 m diep.
const WINDOWS = { size: [3.6, 5.4], depth: 1.3, centres: [[20, -66], [12, -80], [28, -86], [14, -102], [37, -106], [50, -113], [29, -121]] };
// Maaiveld (AHN-DTM NAP 0 m): het Stationsplein vlak voor de westkant van de
// hal; verder weg op het plein vielen ze buiten de geladen terreintegels.
const GROUND_SAMPLES = [[-80, 0], [-60, -15], [-30, -30]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const shifted = (pts) => pts.map(([x, y]) => [x + SHIFT[0], y + SHIFT[1]]);
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
// Prisma van de onderkant tot een vlak z = a x + b y + c boven een convexe
// veelhoek (de bovenkant is exact vlak).
const planar = (poly, [a, b, c]) =>
  Manifold.hull(
    shifted(poly).flatMap(([x, y]) => [
      [x, y, BASE],
      [x, y, NAP(a * (x - SHIFT[0]) + b * (y - SHIFT[1]) + c)],
    ]),
  );

// ---------- perronkap ----------
// Rechthoek met de ribben: in een stelsel (u langs de lange as, v dwars) een
// plaat met de basis en driehoekige ribben dwars op de lange as.
const [c1, c2, , c4] = CANOPY.corners;
const angle = Math.atan2(c2[1] - c1[1], c2[0] - c1[0]);
const long = Math.hypot(c2[0] - c1[0], c2[1] - c1[1]);
const wide = Math.hypot(c4[0] - c1[0], c4[1] - c1[1]);
// De zuidrand loopt in werkelijkheid onder 15,4 graden; de plaat is 4 m breder
// en wordt op de contour afgesneden.
const SOUTH_EXTRA = 4;
const slab = Manifold.cube([long, wide + SOUTH_EXTRA, NAP(CANOPY.base) - BASE]).translate([0, -wide - SOUTH_EXTRA, BASE]);
const ribCount = Math.floor(long / CANOPY.pitch);
const ribProfile = new CrossSection([[[0, 0], [CANOPY.pitch, 0], [CANOPY.pitch / 2, CANOPY.rib]]]);
const ribs = Manifold.union(
  Array.from({ length: ribCount }, (_, k) =>
    Manifold.extrude(ribProfile, wide + SOUTH_EXTRA)
      .rotate([90, 0, 0])
      .translate([k * CANOPY.pitch + (long - ribCount * CANOPY.pitch) / 2, 0, NAP(CANOPY.base) - 0.01]),
  ),
);
// De u-as van het stelsel is de lange as; v loopt naar het noorden terug naar
// c4 (de hoek in het zuiden), dus de plaat ligt op v = -wide tot 0.
const canopy = Manifold.union([slab, ribs])
  .rotate([0, 0, (angle * 180) / Math.PI])
  .translate([c1[0] + SHIFT[0], c1[1] + SHIFT[1], 0]);

// ---------- stationshal ----------
const facets = FACETS.map(({ poly, plane, cap }) => {
  const solid = planar(poly, plane);
  return cap === undefined ? solid : Manifold.intersection(solid, Manifold.cube([1000, 1000, NAP(cap) - BASE]).translate([-500, -500, BASE]));
});
// Piramidevormige ramen: omgekeerde piramides in het middenvlak.
const windows = WINDOWS.centres.map(([x, y]) => {
  const [a, b, c] = FACETS[1].plane;
  const z = NAP(a * x + b * y + c);
  const [w, l] = WINDOWS.size;
  const corners = [[-w / 2, -l / 2], [w / 2, -l / 2], [w / 2, l / 2], [-w / 2, l / 2]].map(([dx, dy]) => [x + dx + SHIFT[0], y + dy + SHIFT[1], z + 1.5]);
  return Manifold.hull([...corners, [x + SHIFT[0], y + SHIFT[1], z - WINDOWS.depth]]);
});
const outline = prism(shifted(OUTLINE), BASE, 200);
const station = Manifold.intersection(Manifold.union([canopy, ...facets]).subtract(Manifold.union(windows)), outline);

const nodes = [["building:station", station]];
const all = station;

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of nodes) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let down = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len > 1e-9 && n[2] < -Math.SQRT1_2 * len) down += len / 2;
  }
  if (down > 0.01) throw new Error(`${name}: ${down.toFixed(2)} m2 ondervlak boven de onderkant`);
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
const glbFile = path.join(outDir, "rotterdam-centraal.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-rotterdam-centraal.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `rotterdam-centraal-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Rotterdam Centraal 1:${scale} mm Z-up`);
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

const hallBox = station.boundingBox();
await writeFile(
  path.join(outDir, "rotterdam-centraal.json"),
  JSON.stringify(
    {
      name: "Rotterdam Centraal",
      file: "rotterdam-centraal.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      // 0: het model begint al 2,5 m onder het plein.
      groundOffsetMetres: 0,
      // Op het Stationsplein (NAP 0 m), niet op de sporen of de lagere straat
      // aan de noordkant.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0599100100007430", "NL.IMBAG.Pand.0599100000700024"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (91911, 437670), midden in de stationshal, op het maaiveld van het Stationsplein (NAP 0 m), +X naar het oosten en +Y naar het noorden. Eén node building:station: de stationshal met de puntige kap tot circa NAP +31 m, opgebouwd uit drie grote dakvlakken (west, midden en oost, planvergelijkingen uit het AHN-DSM) met zeven piramidevormige ramen in het middenvlak, en de perronkap over de sporen als rechthoek van 244 bij 156 m (draaiend 17,6 graden) met een zaagtand van schuine ramen dwars op de lange as (ribben van 0,7 m hoog om de 5,4 m boven een basis op NAP +16,6 m), binnen een contour met rechte randen. De perronkap is dicht tot de onderkant (in werkelijkheid open boven de sporen), de onderkant ligt op NAP -2,5 m en de wanden staan recht op de contour, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van de stationshal en van een klein pand onder de perronkap. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`rotterdam-centraal-1-${scale}.stl`],
      realWorld: {
        lengthM: +(hallBox.max[0] - hallBox.min[0]).toFixed(2),
        widthM: +(hallBox.max[1] - hallBox.min[1]).toFixed(2),
        highestPointNapM: +(hallBox.max[2] + GROUND_NAP).toFixed(2),
        platformRibPitchM: CANOPY.pitch,
        platformRibHeightM: CANOPY.rib,
        facets: FACETS.map(({ name, plane }) => ({ name, plane })),
        windowCount: WINDOWS.centres.length,
        groundNapM: GROUND_NAP,
        platformRoofNapM: 17,
        tracksNapM: 3,
        baseNapM: -2.5,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Station_Rotterdam_Centraal",
        "PDOK BAG panden 0599100100007430 (stationshal) en 0599100000700024, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: de rechthoek, de ribben en de dakvlakken van hal en perronkap, plein, sporen en straat",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

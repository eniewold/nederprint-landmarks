// Genereert een vereenvoudigd, gesloten 3D-model van het Concertgebouw in
// Amsterdam (A.L. van Gendt, 1888): de Grote Zaal met het zadeldak langs de as
// en de topgevels aan beide kopse kanten, de lage vleugels rondom met de vier
// hoekpaviljoens, de voorbouw aan de oostkant met de lier op de topgevel, de
// ronde zaal met het kegeldak aan de westkant, de glazen aanbouw aan de
// zuidkant (Merkx, 1988) en het bijgebouw in het westen. Alle maten in het
// script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één
// node met de materiaalklasse in de nodenaam) als catalogusbron voor de export
// en de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-concertgebouw.mjs              # 1:1000 (standaard)
//   node scripts/generate-concertgebouw.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken lopen
// onder 18 tot 45 graden omhoog en de topgevels en paviljoens staan op de
// muren. Alleen de blinde vensters in de voorgevel hebben een vlakke bovenkant
// van 0,4 m diep.
//
// Assenstelsel: oorsprong op RD (120386,78, 485497,13), in de Grote Zaal, op
// het maaiveld (NAP +0,5 m), Z omhoog. +X loopt langs de as naar het
// oostnoordoosten (RD-richting 22,9 graden), naar de voorgevel aan de
// Van Baerlestraat; +Y naar het noordnoordwesten.
//
// Bronnen: BAG-panden 0363100012233435 (het Concertgebouw) en 0363100012237012
// (het bijgebouw in het westen); AHN DSM/DTM 0,5 m (PDOK WCS): goten, nokken,
// topgevels, paviljoens, de ronde zaal, de aanbouw en het maaiveld; Wikipedia;
// PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "concertgebouw");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 0,5 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [120386.78, 485497.13];
const AXIS_DEG = 22.9;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.5;
const NAP = (h) => h - GROUND_NAP;
const BASE = NAP(0.0);
// BAG-contouren (lokaal, op 0,01 m; de bochten van de ronde zaal en de
// trappenhuisjes vereenvoudigd).
const PAND = [
  [-46.35, -24.67], [-47.7, -24.68], [-40.81, -37.93], [-22.99, -28.67], [27.51, -28.69], [23.64, -21.25],
  [22.42, -20.46], [29.26, -20.52], [29.25, -13.55], [28.53, -13.55], [28.55, -5.11], [33.41, -5.04],
  [33.42, 12.57], [28.56, 12.57], [28.58, 21.1], [29.29, 21.1], [29.31, 28.05], [22.25, 28.06], [22.26, 30.2],
  [14.23, 30.2], [14.24, 26.92], [-8.24, 26.93], [-8.2, 30.22], [-16.25, 30.23], [-16.28, 28.08],
  [-23.25, 28.09], [-23.26, 21.49], [-42.28, 21.07], [-42.28, 17.62], [-44.04, 15.45], [-43.31, 14.81],
  [-38.91, 14.83], [-41.51, 10.24], [-42.92, 7.1], [-43.46, 3.69], [-43.08, 0.23], [-41.8, -2.99],
  [-44.48, -5.0], [-44.47, -7.19], [-42.21, -10.06], [-42.21, -13.51], [-44.51, -13.5], [-44.5, -18.92],
  [-42.4, -19.7], [-41.8, -21.25], [-42.4, -22.8], [-44.65, -23.59], [-44.66, -24.55],
];
const ANNEX_PAND = [
  [-38.35, 21.07], [-38.29, 30.75], [-39.02, 31.12], [-42.76, 31.14], [-44.35, 31.17], [-67.67, 31.17],
  [-67.59, 18.53], [-61.01, 18.54], [-60.98, 15.07], [-56.34, 14.98], [-56.35, 13.06], [-51.67, 13.05],
  [-51.6, 15.32], [-46.54, 15.15], [-50.17, 9.69], [-47.85, 9.69], [-44.04, 15.45], [-42.28, 17.62], [-42.28, 21.07],
];
// Vleugels rondom de zaal (AHN-DSM 15 tot 17 m) en de glazen aanbouw aan de
// zuidkant (9 tot 11 m).
const WINGS_TOP = 16;
const GLASS = { y: -20.5, top: 10.5 };
// Grote Zaal: muren tot de goot op +19,5 m aan beide langszijden, nok op
// +26 m langs de as op y = 4 (AHN-DSM 24 tot 26 m, goten 19 tot 20 m).
const HALL = { x: [-21, 27], y: [-11, 18.5], eave: 19.5, ridge: 26, ridgeY: 4 };
// Topgevels aan beide kopse kanten: 2 m dik, 0,7 m boven het dak, met een
// pinakel (west) en de lier (oost, de voorkant) tot +28,3 m.
const GABLES = [
  { x: [-21, -19], top: 28.3 },
  { x: [25, 27], top: 28.3 },
];
const GABLE_RISE = 0.7;
// Voorbouw aan de oostkant (AHN-DSM 19 tot 23 m): goot +19,5 m, schilddak met
// de nok op +23 m van x = 27 tot 30.
const FRONT = { x: [27, 33.42], y: [-5.05, 12.57], eave: 19.5, ridge: 23, ridgeX: [27, 30], ridgeY: 4 };
// Hoekpaviljoens (AHN-DSM 20 tot 22 m): goot +20,5 m, tentdak tot +22,5 m.
const PAVILIONS = [
  { x: [-24, -17], y: [21.5, 28.08] },
  { x: [23, 29.3], y: [21.1, 28.05] },
  { x: [-24, -17], y: [-20.4, -13.6] },
  { x: [23, 29.26], y: [-20.5, -13.6] },
];
const PAVILION = { eave: 20.5, top: 22.5 };
// Ronde zaal: middelpunt en straal uit de BAG-boog, muur tot +22,5 m en een
// zestienkant kegeldak tot +26,5 m (AHN-DSM 22 tot 27 m).
const ROUND = { c: [-34.4, 4.8], r: 9.2, eave: 22.5, top: 26.5, sides: 16 };
// Bijgebouw in het westen (AHN-DSM): laag deel +4 m, vleugel +13 m en een
// paviljoen met tentdak (goot +16 m, top +20 m).
const ANNEX = { low: 4, wing: { x: [-68, -55], y: [19, 32], top: 13 }, pavilion: { x: [-55, -46.5], y: [19, 31.2], eave: 16, top: 20 } };
// Blinde vensters in de voorgevel (x = 33,42): drie hoge vensters van 3 m
// breed, NAP +5 tot +14 m, 0,4 m diep.
const FRONT_WINDOWS = [-1.5, 4, 9.5];
// Maaiveld (AHN NAP +0,2 tot +1,0 m): de straten langs de noord- en zuidkant
// en voor de voorgevel.
const GROUND_SAMPLES = [[0, 33], [10, -33], [37, 4]];

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
// Schild- of tentdak: goot rondom op de rechthoek, nok van (x0, y) tot (x1, y).
const hip = (xr, yr, eave, ridge, [r0, r1], ry) =>
  Manifold.hull([...at(rect(xr, yr), NAP(eave) - 0.01), [r0, ry, NAP(ridge)], [r1, ry, NAP(ridge)]]);

// ---------- concertgebouw ----------
const outline = prism(PAND, BASE - 1, 100);
const wings = Manifold.intersection(outline, box([-60, 40], [GLASS.y, 40], BASE, NAP(WINGS_TOP)));
const glass = Manifold.intersection(outline, box([-60, 40], [-45, GLASS.y + 0.01], BASE, NAP(GLASS.top)));
// Grote Zaal: muren en het zadeldak langs de as.
const hallWalls = box(HALL.x, HALL.y, BASE, NAP(HALL.eave));
const roofSection = (rise) => [
  [HALL.y[0], NAP(HALL.eave) - 0.01],
  [HALL.y[1], NAP(HALL.eave) - 0.01],
  [HALL.ridgeY, NAP(HALL.ridge + rise)],
];
const roofAlongX = (x0, x1, rise) => Manifold.hull([...roofSection(rise).map(([y, z]) => [x0, y, z]), ...roofSection(rise).map(([y, z]) => [x1, y, z])]);
const hallRoof = roofAlongX(HALL.x[0], HALL.x[1], 0);
const gables = GABLES.map((g) =>
  Manifold.union([
    roofAlongX(g.x[0], g.x[1], GABLE_RISE),
    // Pinakel of lier op de top: een blok van 1,4 m breed met een spits.
    Manifold.hull([
      ...at(rect(g.x, [HALL.ridgeY - 0.7, HALL.ridgeY + 0.7]), NAP(HALL.ridge + GABLE_RISE) - 1),
      ...at(rect(g.x, [HALL.ridgeY - 0.7, HALL.ridgeY + 0.7]), NAP(g.top) - 0.8),
      [(g.x[0] + g.x[1]) / 2, HALL.ridgeY, NAP(g.top)],
    ]),
  ]),
);
const front = Manifold.union([
  box(FRONT.x, FRONT.y, BASE, NAP(FRONT.eave)),
  hip(FRONT.x, FRONT.y, FRONT.eave, FRONT.ridge, FRONT.ridgeX, FRONT.ridgeY),
]);
const pavilions = PAVILIONS.map((p) => {
  const cx = (p.x[0] + p.x[1]) / 2;
  const cy = (p.y[0] + p.y[1]) / 2;
  return Manifold.union([box(p.x, p.y, BASE, NAP(PAVILION.eave)), hip(p.x, p.y, PAVILION.eave, PAVILION.top, [cx, cx], cy)]);
});
const polygonN = ([cx, cy], r, n) =>
  Array.from({ length: n }, (_, k) => {
    const a = (2 * Math.PI * (k + 0.5)) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
const round = Manifold.union([
  prism(polygonN(ROUND.c, ROUND.r, ROUND.sides), BASE, NAP(ROUND.eave)),
  Manifold.hull([...at(polygonN(ROUND.c, ROUND.r, ROUND.sides), NAP(ROUND.eave) - 0.01), [...ROUND.c, NAP(ROUND.top)]]),
]);
const windows = FRONT_WINDOWS.map((y) => box([FRONT.x[1] - 0.4, FRONT.x[1] + 1], [y - 1.5, y + 1.5], NAP(5), NAP(14)));
const main = Manifold.union([wings, glass, hallWalls, hallRoof, ...gables, front, ...pavilions, round]).subtract(Manifold.union(windows));

// ---------- bijgebouw ----------
const annexOutline = prism(ANNEX_PAND, BASE - 1, 100);
const annex = Manifold.intersection(
  annexOutline,
  Manifold.union([
    box([-70, -38], [0, 40], BASE, NAP(ANNEX.low)),
    box(ANNEX.wing.x, ANNEX.wing.y, BASE, NAP(ANNEX.wing.top)),
    box(ANNEX.pavilion.x, ANNEX.pavilion.y, BASE, NAP(ANNEX.pavilion.eave)),
    hip(
      ANNEX.pavilion.x,
      ANNEX.pavilion.y,
      ANNEX.pavilion.eave,
      ANNEX.pavilion.top,
      [(ANNEX.pavilion.x[0] + ANNEX.pavilion.x[1]) / 2, (ANNEX.pavilion.x[0] + ANNEX.pavilion.x[1]) / 2],
      (ANNEX.pavilion.y[0] + ANNEX.pavilion.y[1]) / 2,
    ),
  ]),
);

const building = Manifold.union([main, annex]);
const nodes = [["building:concertgebouw", building]];
const all = building;

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of nodes) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen,
  // behalve de bovenkant van de vensternissen.
  const allowed = NAP(14).toFixed(2);
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (z.toFixed(2) === allowed) continue;
      throw new Error(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))}`);
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
const glbFile = path.join(outDir, "concertgebouw.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-concertgebouw.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `concertgebouw-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Concertgebouw Amsterdam 1:${scale} mm Z-up`);
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
  path.join(outDir, "concertgebouw.json"),
  JSON.stringify(
    {
      name: "Concertgebouw",
      file: "concertgebouw.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op de straten langs de noord- en zuidkant en voor de voorgevel (NAP
      // +0,2 tot +1,0 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0363100012233435", "NL.IMBAG.Pand.0363100012237012"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (120386,78, 485497,13), in de Grote Zaal, op het maaiveld (NAP +0,5 m), +X langs de as naar het oostnoordoosten (22,9 graden vanaf het oosten), naar de voorgevel, en +Y naar het noordnoordwesten. Eén node building:concertgebouw: de Grote Zaal (goten NAP +19,5 m, zadeldak met de nok op +26 m langs de as) met topgevels aan beide kopse kanten tot +28,3 m (pinakel en lier), de vleugels rondom op de BAG-contour (+16 m) met vier hoekpaviljoens (goot +20,5 m, tentdak tot +22,5 m), de voorbouw aan de oostkant (schilddak tot +23 m) met drie blinde hoge vensters, de ronde zaal aan de westkant (zestienkant, muur +22,5 m, kegeldak tot +26,5 m), de glazen aanbouw aan de zuidkant (+10,5 m) en het bijgebouw in het westen. Alles staat recht op of loopt schuin omhoog, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van de twee BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`concertgebouw-1-${scale}.stl`],
      realWorld: {
        lengthM: +(hallBox.max[0] - hallBox.min[0]).toFixed(2),
        widthM: +(hallBox.max[1] - hallBox.min[1]).toFixed(2),
        highestPointNapM: +(hallBox.max[2] + GROUND_NAP).toFixed(2),
        hallEaveNapM: HALL.eave,
        hallRidgeNapM: HALL.ridge,
        gableTopNapM: GABLES[1].top,
        wingsNapM: WINGS_TOP,
        pavilionTopNapM: PAVILION.top,
        roundHallTopNapM: ROUND.top,
        glassAnnexNapM: GLASS.top,
        groundNapM: GROUND_NAP,
        baseNapM: 0,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Concertgebouw_(Amsterdam)",
        "PDOK BAG panden 0363100012233435 en 0363100012237012, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: goten, nokken, topgevels, paviljoens, ronde zaal, aanbouw en maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

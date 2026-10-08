// Genereert een vereenvoudigd, gesloten 3D-model van de Brandaris in
// West-Terschelling (1594, de oudste nog werkende vuurtoren van Nederland):
// de vierkante, licht taps toelopende bakstenen toren van vier geledingen met
// het rondboogportaal en de kleine vensters, de glazen verkeerspost van de
// Kustwacht op het dak met het open terras op de zuidoosthoek, en de
// lantaarn met de koepel.
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, één node per onderdeel met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-brandaris.mjs             # 1:1000 (standaard)
//   node scripts/generate-brandaris.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: elke geleding springt naar boven terug,
// de verkeerspost staat binnen de rand van de toren, de lantaarn en de koepel
// worden alleen smaller naar boven en het portaal en de vensters zijn blinde
// nissen met een spitse top; het script controleert dat er boven de onderkant
// geen vlak is dat vlakker dan 45 graden naar beneden wijst, behalve in de
// toppen van de nissen.
//
// Assenstelsel: oorsprong op RD (143484,02, 597117,75), in het hart van de
// vierkante BAG-voetafdruk, op het maaiveld ten noorden en zuiden van de toren
// (NAP +5,5 m), Z omhoog. +X loopt evenwijdig aan de gevels (RD-richting -8,43
// graden, oost-zuidoost); +Y wijst naar het noord-noordoosten, het portaal
// zit in de zuidgevel (-Y).
//
// Bronnen: BAG-pand 0093100000215019 (vierkant van 10,1 × 10,15 m, bouwjaar
// 1594); AHN DSM/DTM 0,5 m (PDOK WCS) voor de breedte per hoogte, het dak, de
// verkeerspost, de lantaarn en het maaiveld; Wikipedia (52,5 m, vierkant,
// licht op 55 m boven zee) en het Rijksmonumentenregister (35032, "zware
// bakstenen toren van vier geledingen"); Wikimedia Commons-foto's voor de
// geledingen, het portaal en de vensters.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "brandaris");
const mmPerMetre = 1000 / scale;
const SLUG = "brandaris";

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(32);

// ---------- maten (lokaal stelsel, z = NAP - 5,5 m) ----------
const ORIGIN = [143484.02, 597117.75];
const ANGLE_DEG = -8.43;
const ANGLE = (ANGLE_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 5.5;
const GROUND_OFFSET = -0.3;
// Het maaiveld ligt ten noorden, westen en zuiden op NAP +5,3 tot +5,6 m en
// aan de oostkant op +4,9 m; alle onderdelen beginnen daarom op dezelfde
// vlakke onderkant 1,0 m onder de oorsprong.
const BASE = -1.0;
// Gevelvlakken uit de AHN-omhullende (1e en 99e percentiel per hoogte tussen
// NAP +8 en +46 m, 0,15 m naar binnen gecorrigeerd voor de celgrootte): de
// oost- en zuidgevel staan vrijwel loodrecht, de west- en noordgevel lopen
// taps toe, van 10,5 × 10,2 m bij de voet (BAG 10,1 × 10,15 m) naar 8,9 ×
// 8,6 m onder het dak. [xMin, xMax, yMin, yMax] op hoogte z, zonder de
// terugsprong per geleding.
const faces = (z) => {
  const h = z + GROUND_NAP - 8;
  return [-5.01 + 0.0205 * h, 5.13 - 0.002 * h, -4.68, 5.17 - 0.0237 * h];
};
// Vier geledingen (Rijksmonumentenregister) met de banden uit de frontale
// foto's; elke geleding springt 0,08 m terug ten opzichte van de vorige.
const BANDS = [BASE, 13.2, 25.2, 37.0, 46.1];
const OUTSET = [0.12, 0.04, -0.04, -0.12];
// Dak van de toren (het open terras) op NAP +51,6 m; de glazen verkeerspost
// tot NAP +54,65 m, 0,2 m binnen de rand, zonder de zuidoosthoek (het terras
// in het AHN op +51,6 m).
const SHAFT_TOP = BANDS.at(-1);
const ROOM = { inset: 0.2, z1: 49.15, notch: { x: 2.1, y: -1.2 } };
// Lantaarn met koepel als omwentelingsprofiel [straal, z] op de verkeerspost,
// het hart 0,2 m ten oosten van het torenhart (AHN); het hoogste DSM-punt
// (NAP +59,2 m, met de radar) is de top.
const LANTERN_CENTRE = [0.2, 0];
const LANTERN_PROFILE = [
  [0, ROOM.z1 - 0.01],
  [1.9, ROOM.z1 - 0.01],
  [1.9, 50.6],
  [1.75, 51.4],
  [1.5, 52.0],
  [1.1, 52.5],
  [0.7, 53.0],
  [0.12, 53.7],
  [0, 53.7],
];
const TOP = 53.7;
// Blinde nissen per gevel: het rondboogportaal in de zuidgevel (als spitse
// boog) en één klein venster per gevel boven elkaar in de bovenste drie
// geledingen (hoogtes van het midden uit de frontale foto).
const ALL = ["+x", "-x", "+y", "-y"];
const WINDOW = { width: 0.8, height: 1.4, depth: 0.3 };
const WINDOW_CENTRES = [14.6, 20.8, 26.4, 32.4, 38.6, 43.8];
const NICHES = [
  { faces: ["-y"], width: 4.2, z0: 0.2, top: 6.2, depth: 0.35 },
  ...WINDOW_CENTRES.map((c) => ({
    faces: ALL,
    width: WINDOW.width,
    z0: c - WINDOW.height / 2,
    top: c + WINDOW.height / 2,
    depth: WINDOW.depth,
  })),
];
// Maaiveld ten noorden en zuiden van de toren (NAP +5,6 m volgens het
// AHN-DTM, voor het portaal met de stoep); oost ligt lager (+4,9 m).
const GROUND_SAMPLES = [
  [0, 8],
  [0, -8],
];

// ---------- hulpfuncties ----------
const union = (parts) => Manifold.union(parts);
const rect = ([x0, x1, y0, y1], z) => [
  [x0, y0, z],
  [x1, y0, z],
  [x1, y1, z],
  [x0, y1, z],
];
const grow = ([x0, x1, y0, y1], d) => [x0 - d, x1 + d, y0 - d, y1 + d];
// Spitsboog als polygoon [breedterichting, hoogte]: rechte zijden tot
// `spring`, daarboven twee cirkelbogen met straal gelijk aan de breedte.
function pointedArch(width, spring, steps = 10) {
  const half = width / 2;
  const pts = [[-half, 0], [half, 0], [half, spring]];
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 3);
    pts.push([half - width + width * Math.cos(t), spring + width * Math.sin(t)]);
  }
  for (let i = steps - 1; i >= 1; i--) {
    const t = (i / steps) * (Math.PI / 3);
    pts.push([-half + width - width * Math.cos(t), spring + width * Math.sin(t)]);
  }
  pts.push([-half, spring]);
  return pts;
}
const archRise = (width) => (width * Math.sqrt(3)) / 2;
const FACE_ANGLE = { "+x": 0, "+y": 90, "-x": 180, "-y": 270 };
// Blinde spitsboognis in een vlak op afstand `half` van het hart, gedraaid
// over `angle` graden: `lateral` is de plaats langs het vlak.
function niche(angle, half, lateral, width, z0, spring, depth) {
  return Manifold.extrude([pointedArch(width, spring - z0)], 4)
    .rotate([90, 0, 90])
    .translate([half - depth, lateral, z0])
    .rotate([0, 0, angle]);
}
// Afstand van het hart tot een gevel en het midden van die gevel, in het
// gedraaide stelsel van `niche`, met de terugsprong van de geleding.
function facePlane(side, z) {
  const k = Math.max(0, BANDS.findIndex((b, i) => i > 0 && z < b) - 1);
  const [x0, x1, y0, y1] = grow(faces(z), OUTSET[k]);
  const xm = (x0 + x1) / 2;
  const ym = (y0 + y1) / 2;
  switch (side) {
    case "+x":
      return { half: x1, lateral: ym };
    case "+y":
      return { half: y1, lateral: -xm };
    case "-x":
      return { half: -x0, lateral: -ym };
    default:
      return { half: -y0, lateral: xm };
  }
}

// ---------- vier geledingen ----------
const stages = [];
for (let k = 0; k < 4; k++) {
  const z0 = k === 0 ? BASE : BANDS[k] - 0.01;
  const z1 = BANDS[k + 1];
  stages.push(Manifold.hull([...rect(grow(faces(z0), OUTSET[k]), z0), ...rect(grow(faces(z1), OUTSET[k]), z1)]));
}
const shaft = union(stages);
const topRect = grow(faces(SHAFT_TOP), OUTSET[3]);

// ---------- verkeerspost met terras op de zuidoosthoek ----------
const roomRect = grow(topRect, -ROOM.inset);
const roomBox = Manifold.hull([...rect(roomRect, SHAFT_TOP - 0.01), ...rect(roomRect, ROOM.z1)]);
const terrace = Manifold.cube([10, 10, ROOM.z1 - SHAFT_TOP + 2]).translate([ROOM.notch.x, ROOM.notch.y - 10, SHAFT_TOP]);
const room = roomBox.subtract(terrace);

// ---------- lantaarn met koepel ----------
const lantern = Manifold.revolve([LANTERN_PROFILE], 32).translate([...LANTERN_CENTRE, 0]);

const mass = union([shaft, room, lantern]);

const cuts = [];
for (const n of NICHES) {
  for (const side of n.faces) {
    const { half, lateral } = facePlane(side, (n.z0 + n.top) / 2);
    cuts.push(niche(FACE_ANGLE[side], half, lateral, n.width, n.z0, n.top - archRise(n.width), n.depth));
  }
}
const tower = mass.subtract(union(cuts));

// ---------- controles ----------
for (const [name, solid] of [["massa", mass], ["toren", tower]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}
// Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant
// (m2 per laagste z). Alleen de spitse toppen van de nissen mogen er hebben.
function steepFaces(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const levels = new Map();
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const z = Math.min(...p.map((q) => q[2])).toFixed(1);
    levels.set(z, +((levels.get(z) ?? 0) + len / 2).toFixed(3));
  }
  return levels;
}
{
  const massLevels = steepFaces(mass);
  if ([...massLevels.values()].some((area) => area > 0.001)) {
    throw new Error(`overhang in de massa: ${JSON.stringify(Object.fromEntries(massLevels))}`);
  }
  const levels = steepFaces(tower);
  console.log("ondervlakken in de nissen (lokale z: m2):", Object.fromEntries(levels));
  for (const [z] of levels) {
    if (!NICHES.some((n) => +z >= n.top - archRise(n.width) - 0.05 && +z <= n.top + 0.05)) throw new Error(`overhang op z ${z}`);
  }
  const bb = tower.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
  if (Math.abs(bb.max[2] - TOP) > 1e-6) throw new Error(`top op ${bb.max[2]}`);
  console.log("voet [xMin, xMax, yMin, yMax]:", grow(faces(BASE), OUTSET[0]).map((c) => +c.toFixed(2)));
  console.log("dak [xMin, xMax, yMin, yMax]:", topRect.map((c) => +c.toFixed(2)));
}

const parts = [["building:toren", tower]];
const printModel = tower.translate([0, 0, -BASE]);

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
for (const [name, solid] of parts) {
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
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const { buffer, triangles } = toStl(printModel, `NederPrint Brandaris West-Terschelling 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printModel.boundingBox();
report.stl = {
  file: stlFile,
  status: printModel.status(),
  genus: printModel.genus(),
  triangles,
  volumeCm3: +((printModel.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

const foot = grow(faces(BASE), OUTSET[0]);
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: "Brandaris",
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: GROUND_OFFSET,
      // Ten noorden en zuiden van de toren; de oostkant ligt 0,6 m lager.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0093100000215019"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (143484,02, 597117,75), in het hart van de vierkante BAG-voetafdruk op het maaiveld ten noorden en zuiden van de toren (NAP +5,5 m), +X evenwijdig aan de gevels (RD-richting -8,43 graden, oost-zuidoost) en +Y naar het noord-noordoosten. building:toren is de vuurtoren: de vierkante bakstenen toren van vier geledingen, licht taps van 10,5 × 10,2 m bij de voet naar 8,9 × 8,6 m onder het dak, met het rondboogportaal in de zuidgevel en kleine vensters als blinde nissen tot het terras op 46,1 m, de glazen verkeerspost tot 49,15 m zonder de zuidoosthoek en de lantaarn met koepel tot 53,7 m boven het maaiveld; elke geleding springt alleen naar boven terug en de toren print op 1:1000 zonder steun. Vervangt de PDOK-reconstructie van BAG-pand 0093100000215019. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`${SLUG}-1-${scale}.stl`],
      realWorld: {
        heightM: TOP,
        terraceM: SHAFT_TOP,
        roomTopM: ROOM.z1,
        bandsM: BANDS.slice(1, -1),
        baseFootprintM: [+(foot[1] - foot[0]).toFixed(2), +(foot[3] - foot[2]).toFixed(2)],
        roofFootprintM: [+(topRect[1] - topRect[0]).toFixed(2), +(topRect[3] - topRect[2]).toFixed(2)],
        lanternRadiusM: LANTERN_PROFILE[1][0],
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Brandaris_(vuurtoren)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/35032",
        "PDOK BAG pand 0093100000215019 (vierkant van 10,1 x 10,15 m, bouwjaar 1594), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: breedte per hoogte, terras, verkeerspost, lantaarn, maaiveld",
        "Wikimedia Commons: Overzicht zuidgevel - West-Terschelling - 20254727 - RCE.jpg, Brandaris in West-Terschelling -01.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

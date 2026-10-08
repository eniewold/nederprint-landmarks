// Genereert een vereenvoudigd, gesloten 3D-model van de Euroborg in Groningen
// (thuisstadion van FC Groningen): de achthoekige kom met één doorlopend
// dak dat van de veldkant (+18,5 m) schuin naar buiten afloopt (+14 m), de
// acht lichtramen op de binnenrand van het dak en de twee kantoortorens van
// 71 m achter het zuideinde. Het dak bestaat uit negen vlakke facetten tussen
// de binnen- en de buitenrand (geen hoogteveld); het Mapbox-model is niet
// gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, twee nodes met de materiaalklasse in
// de nodenaam) als catalogusbron voor de export en de kaart, plus een binaire
// STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-euroborg.mjs              # 1:1000 (standaard)
//   node scripts/generate-euroborg.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening op het niveau van
// het plein rond het stadion (NAP +7,2 m; het veld ligt 6,3 m lager), Z
// omhoog, +X naar het oosten en +Y naar het noorden (de RD-assen: het veld
// ligt precies noord-zuid, 90 bij 125 m).
//
// Bronnen: PDOK BAG-panden 0014100010953806 (het stadion) en
// 0014100010940730 en 0014100010982616 (de torens; contouren en vervangen
// panden); AHN DSM/DTM 0,5 m (PDOK WCS): de veldopening (u -44,8 tot 44,9 m,
// v -63 tot 61,2 m), de buitenrand van het dak (achthoek, de oostkant met een
// vleugel), de hoogtes langs de binnen- en buitenrand, de lichtramen (+24,3
// m) en de hoogte van de torens (+71,2 m boven het plein); Wikipedia (22.500
// plaatsen); PDOK luchtfoto en Wikimedia Commons-foto's. Geschat: de
// raamstroken in de torens (verticale nissen, afstand en breedte uit
// foto's). Weggelaten: het plein zelf (zit in het PDOK-terrein), de
// dakspanten, de opbouw op de torens en de trappenhuizen op het dak.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "euroborg");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Convexe veelhoek in plan met een dakvlak z = a x + b y + c, vanaf z0 omhoog.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([
    ...pts.map(([x, y]) => [x, y, z0]),
    ...pts.map(([x, y]) => [x, y, a * x + b * y + c]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);

const SLUG = "euroborg";

// ---------- maten (lokaal stelsel, z = hoogte boven het plein op NAP +7,2 m) ----------
const GROUND_NAP = 7.2;
const ORIGIN = [235474.5, 580618.3];
const X_AXIS = [1, 0];
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het plein.
const BASE = -0.5;

// Het dak is een ring van negen facetten tussen de rand van de veldopening
// (binnenrand, +18,5 m) en de buitenrand van het dak (+14 tot +14,6 m, aan
// de noordoosthoek +12,7 m). De binnenrand is een rechthoek met afgeschuinde
// hoeken, de buitenrand een achthoek met een vleugel aan de oostkant.
const Z_IN = 18.5;
const IN = [
  [-38.8, 61.2], [38.9, 61.2], [44.9, 55.2], [44.9, -20], [44.9, -57], [38.9, -63], [-38.8, -63], [-44.8, -57], [-44.8, 55.2],
];
// [u, v, z] van de buitenrand.
const OUT = [
  [-53.3, 98.6, 14.6], [52.7, 98.6, 14.6], [94.3, 57.3, 12.7], [80.6, -20, 14.6], [80.6, -70.5, 14.6],
  [52.7, -98.7, 14.5], [-53.3, -98.7, 14.6], [-112.2, -40.2, 13.8], [-112.2, 39.8, 13.8],
];
// Facetten als paren binnenpunt a, binnenpunt b met de buitenpunten a en b
// erboven (zelfde index): noord, noordoost, oost (twee), zuidoost, zuid,
// zuidwest, west, noordwest. Binnenpunt i en buitenpunt i horen bij elkaar;
// de facet tussen i en i + 1 heeft dus de hoekpunten IN[i], IN[i + 1],
// OUT[i + 1], OUT[i].
const FACET_COUNT = IN.length;
// Lichtramen op de binnenrand van het dak: platen van 1,4 m breed en 9 m lang
// tot +24,3 m, vier aan elke lange zijde.
const LAMPS = { z0: 17.5, top: 24.3, width: 1.4, length: 9, west: -47.5, east: 47.5, vs: [34.7, 17.7, -17.3, -34.7] };
// Kantoortorens achter het zuideinde (BAG-contouren), 71,2 m boven het plein.
const TOWERS = [
  [[-47.1, -150.3], [-38.1, -137.2], [-47.6, -129.4], [-57.3, -121.5], [-63.6, -117.9], [-67.9, -115.5], [-77.6, -129.7], [-62.9, -140.8], [-58.3, -144.3]],
  [[1.4, -148.6], [14.1, -148.1], [38.0, -144.3], [36.6, -128.7], [11.9, -128.7], [-0.2, -130.8]],
];
const TOWER_TOP = 71.2;
// Verticale raamstroken in de lange gevels: nissen van 1,5 m breed en 0,35 m
// diep om de 6 m, van +3 tot +68 m, met een vlakke bovenkant.
const WINDOWS = { pitch: 6, width: 1.5, depth: 0.35, z0: 3, z1: 68, minEdge: 20 };
// Maaiveld: het plein rond het stadion (AHN NAP +7,0 tot +7,4 m).
const GROUND_SAMPLES = [[100, 0], [0, 105], [-120, 0], [0, -105]];

// ---------- gebouwen ----------
const centroid = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
// Elke facet is de convexe romp van haar hoekpunten op het dak en op de
// onderkant, 2 cm uitgeschoven zodat aangrenzende facetten overlappen
// (rakende vlakken laten in de vereniging een spleet zonder dikte achter).
const facet = (i) => {
  const j = (i + 1) % FACET_COUNT;
  const pts = [[...IN[i], Z_IN], [...IN[j], Z_IN], OUT[j], OUT[i]];
  const [cx, cy] = centroid(pts);
  const grown = pts.map(([x, y, z]) => {
    const l = Math.hypot(x - cx, y - cy) || 1;
    return [x + ((x - cx) / l) * 0.02, y + ((y - cy) / l) * 0.02, z];
  });
  return Manifold.hull(grown.flatMap(([x, y, z]) => [[x, y, z], [x, y, BASE]]));
};
const roof = Manifold.union(Array.from({ length: FACET_COUNT }, (_, i) => facet(i)));
const lamps = [];
for (const u of [LAMPS.west, LAMPS.east]) {
  for (const v of LAMPS.vs) {
    lamps.push(box(u - LAMPS.width / 2, u + LAMPS.width / 2, v - LAMPS.length / 2, v + LAMPS.length / 2, LAMPS.z0, LAMPS.top));
  }
}
const stadium = Manifold.union([roof, ...lamps]);

const towerSolid = (ring) => {
  const solid = prism(ring, BASE, TOWER_TOP);
  // Raamstroken in de lange gevels (binnenkant links van de rand bij een ring tegen de klok in).
  const ccwRing = ccw(ring);
  const cuts = [];
  ccwRing.forEach((p, i) => {
    const q = ccwRing[(i + 1) % ccwRing.length];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (len < WINDOWS.minEdge) return;
    const d = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
    const n = [-d[1], d[0]];
    for (let t = WINDOWS.pitch / 2; t < len - WINDOWS.width; t += WINDOWS.pitch) {
      const c = [p[0] + d[0] * t, p[1] + d[1] * t];
      const w = WINDOWS.width / 2;
      const at = (s, depth) => [c[0] + d[0] * s + n[0] * depth, c[1] + d[1] * s + n[1] * depth];
      cuts.push(prism([at(-w, -1), at(w, -1), at(w, WINDOWS.depth), at(-w, WINDOWS.depth)], WINDOWS.z0, WINDOWS.z1));
    }
  });
  return solid.subtract(Manifold.union(cuts));
};
const towers = Manifold.union(TOWERS.map(towerSolid));
const OVERHANG_OK = (z) => Math.abs(z - WINDOWS.z1) < 1e-6;

const nodes = [["building:stadion", stadium], ["building:torens", towers]];
const all = Manifold.union([stadium, towers]);

const META = {
  name: "Euroborg",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0014100010953806", "0014100010940730", "0014100010982616"],
  plate: true,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (235474,50, 580618,30) in het hart van de veldopening op het niveau van het plein rond het stadion (NAP +7,2 m), +X naar het oosten en +Y naar het noorden. Twee nodes: building:stadion, de achthoekige kom met één dak van negen vlakke facetten dat van +18,5 m aan de veldkant naar +14 m aan de buitenrand afloopt (de oostkant met een vleugel op +12,7 m), plus acht lichtramen tot +24,3 m, en building:torens, de twee kantoortorens van 71,2 m achter het zuideinde met verticale raamstroken van 0,35 m diep. Onderkant op 0,5 m onder het plein; alleen de bovenkant van de raamstroken is vlak. Vervangt de PDOK-reconstructie van de drie BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 22500,
    fieldOpeningM: [89.7, 124.2],
    roofInnerM: Z_IN,
    roofOuterM: 14.6,
    towerHeightM: TOWER_TOP,
    plazaNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Euroborg",
    "PDOK BAG panden 0014100010953806, 0014100010940730 en 0014100010982616, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: de binnen- en buitenrand van het dak, de hoogtes, de lichtramen, de torens en het plein",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's",
  ],
};

// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan ��n stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
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
  const gltfNodes = [];
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
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
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
    volumeM3: +solid.volume().toFixed(1),
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
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

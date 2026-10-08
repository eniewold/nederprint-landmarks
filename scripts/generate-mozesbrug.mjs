// Genereert een vereenvoudigd, gesloten 3D-model van de Mozesbrug bij Fort de
// Roovere (Halsteren): de verzonken voetgangersbrug van RO&AD Architecten uit
// 2011, een open trog van twee houten damwanden (Accoya) dwars door de
// vestinggracht, met het looppad onder de waterspiegel, een steile trap in de
// glooiing van de wal aan de westkant (fortzijde) en een kortere trap naar het
// pad op de buitenoever aan de oostkant. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, de constructie en het
// looppad met de BGT-attributen als eigen nodes, de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-mozesbrug.mjs              # 1:1000 (standaard)
//   node scripts/generate-mozesbrug.mjs --scale 500
//
// Assenstelsel: oorsprong op de as van de trog, midden boven de gracht (het
// midden van het BGT-wegdeel G0748.bc4b29ae), op de waterspiegel van de gracht
// (NAP +0,5 m), Z omhoog. +X loopt langs de brug naar de oostoever
// (oostzuidoost, RD-richting -17,3 graden vanaf het oosten), +Y naar het
// noordnoordoosten. De trap in de wal van het fort ligt aan de westkant
// (x < -11,2), de trap naar de buitenoever aan de oostkant (x > 11,2).
//
// Waterniveau en PDOK-terrein: de brug ligt grotendeels onder de waterspiegel
// en het model kan niet in het PDOK-terrein snijden. Dat terrein heeft de trog
// al: de BGT-wegdelen in de trog zijn er wegvlakken op de hoogte van het AHN
// (over de gracht NAP -0,30 tot +0,01, de trappen als hellingen), de damwanden
// dunne scheidingswanden tot net boven het water, het water ernaast een vlak op
// NAP +0,5 m. Het model legt zijn looppad daarom 6 cm boven het hoogste
// PDOK-wegvlak onder elke trede (over de gracht NAP +0,08 in plaats van -0,30
// volgens het AHN) en zijn wanden 5 tot 15 cm boven het PDOK-terrein en de
// PDOK-scheidingswanden onder hun voetafdruk, zodat er nergens PDOK-terrein door
// het model prikt. Het maaiveld wordt op het PDOK-looppad in de trog bemonsterd
// (drie punten over de gracht), het vlak waarboven het model moet blijven.
//
// Printbaarheid op 1:1000: de echte damwanden zijn 0,15 m dik en staan 0,2 m
// boven het water. Ze zijn hier 0,9 m dik (naar buiten verdikt, de binnenkant
// blijft op de rand van het BGT-looppad) en de treden zijn gegroepeerd tot
// treden van ongeveer 0,95 m diep, zodat trog en trap op 1:1000 printen.
//
// Bronnen: BGT scheiding (twee muren G0748.04144a2e en G0748.2586284e, 51,6 m
// lang, binnen 1,12 m uit elkaar) en wegdeel (looppad, de trappen en de
// bordessen met functie en fysiek voorkomen); AHN DSM 0,5 m (PDOK WCS) voor de
// waterspiegel (NAP +0,5), het looppad (NAP -0,30), de bovenkant van de wanden
// (NAP +0,72), het bovenbordes in de wal (NAP +8,8) en de trappen; de
// PDOK-terreintegels voor de hoogtes waarboven treden en wanden moeten blijven;
// Wikipedia (Fort de Roovere) en Wikimedia Commons-foto's voor de opbouw.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "mozesbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in gezien vanaf +X, steeds evenveel punten).
function loftX(stations) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { x, section } of stations) for (const [y, z] of section) verts.push(x, y, z);
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < stations.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = stations.length - 1;
  for (let j = 1; j + 1 < n; j++) {
    tris.push(id(0, 0), id(0, j + 1), id(0, j));
    tris.push(id(last, 0), id(last, j), id(last, j + 1));
  }
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  return solid;
}

// ---------- hoofdmaten ----------
const WATER_NAP = 0.5; // waterspiegel van de gracht (AHN DSM, PDOK-water)
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = Z(-1.0); // gemeenschappelijke onderkant, onder het looppad
const X_WEST = -32.49; // westeinde van de BGT-muren (bovenbordes in de wal)
const X_EAST = 19.13; // oosteinde (pad op de buitenoever)
// Trog: binnenkant van de wanden op |y| = 0,50 (BGT-looppad 1,12 m breed; de
// PDOK-scheidingswanden staan op |y| 0,53 tot 0,74 en vallen zo helemaal in de
// modelwanden), wanden 0,9 m dik.
const INNER = 0.5;
const WALL = 0.9;
const OUTER = INNER + WALL;

// Treden van west naar oost: [x van, x tot, bovenkant NAP, BGT-wegdeel].
// Bovenkant = hoogste PDOK-wegvlak onder de trede + 6 cm (zie de kop). De
// westtrap telt 14 treden van 0,95 m met elk 0,54 m stijging (in het echt
// ongeveer 44 treden); de oosttrap drie lage treden boven de oever en vijf
// steile tot het pad.
const VOETPAD = "voetpad";
const TRAP = "voetpad op trap";
const TREADS = [
  [-32.49, -27.70, 8.80, VOETPAD], // bovenbordes in de wal (BGT G0748.e3db4a25)
  ...Array.from({ length: 14 }, (_, i) => {
    const step = (-14.41 + 27.7) / 14;
    return [+(-27.7 + i * step).toFixed(3), +(-27.7 + (i + 1) * step).toFixed(3), +(8.54 - 0.54 * i).toFixed(2), TRAP];
  }), // westtrap (BGT G0748.fa354147)
  [-14.41, -13.15, 0.99, VOETPAD], // benedenbordes aan de gracht (BGT G0748.fe36048e)
  [-13.15, -11.9, 0.76, VOETPAD],
  [-11.9, -11.23, 0.33, TRAP], // trede naar het looppad (BGT G0748.09de3f50)
  [-11.23, 11.23, 0.08, TRAP], // looppad door de gracht (BGT G0748.bc4b29ae)
  [11.23, 12.22, 0.75, TRAP], // oosttrap (BGT G0748.95430c6c, G0748.98c14b78, G0748.5cd32659)
  [12.22, 13.21, 0.95, TRAP],
  [13.21, 14.19, 1.16, TRAP],
  [14.19, 15.18, 1.67, TRAP],
  [15.18, 16.17, 2.17, TRAP],
  [16.17, 17.16, 2.68, TRAP],
  [17.16, 18.14, 3.19, TRAP],
  [18.14, 19.13, 3.4, TRAP], // bovenste trede, gelijk met het pad op de buitenoever
];
// Bovenkant van de wanden (NAP), rechte stukken tussen deze knopen: over de
// gracht vlak op NAP +0,85 (AHN +0,72; de PDOK-scheidingswand komt tot +0,80),
// langs de trappen evenwijdig aan de trap en 0,1 tot 0,4 m boven de glooiing
// van het PDOK-terrein, zoals de wanden op de foto's net boven het gras
// uitsteken; bovenaan in de wal op NAP +9,8.
const WALL_TOP = [
  [X_WEST, 9.8],
  [-28.2, 9.8],
  [-27.45, 9.8],
  [-14.45, 1.75],
  [-12.7, 1.6],
  [-11.23, 0.85],
  [11.23, 0.85],
  [12.3, 1.45],
  [17.3, 3.4],
  [X_EAST, 3.6],
];

// ---------- bouwdelen ----------
// Twee wanden: een loft over de knopen, rechthoekige doorsnede van de
// onderkant tot de bovenkant; tussen de knopen zijn de bovenvlakken vlak.
const wall = (side) =>
  loftX(
    WALL_TOP.map(([x, top]) => {
      const zt = Z(top);
      const [a, b] = side > 0 ? [INNER, OUTER] : [-OUTER, -INNER];
      return { x, section: [[a, BASE], [b, BASE], [b, zt], [a, zt]] };
    }),
  );
// Treden tussen de wanden, elk een blok van de onderkant tot de bovenkant.
const treads = TREADS.map(([x0, x1, top]) => boxFromTo(x0, x1, -INNER, INNER, BASE, Z(top)));
const bridge = union([wall(1), wall(-1), ...treads]);
// Het printmodel is de brug zelf: vlakke onderkant, geen overhang.
const printModel = bridge;

// ---------- controles ----------
{
  if (bridge.status() !== "NoError") throw new Error(`brug: ${bridge.status()}`);
  if (bridge.genus() !== 0) throw new Error(`brug: genus ${bridge.genus()}`);
  const bb = bridge.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
  // Geen enkel ondervlak boven de onderkant.
  const mesh = bridge.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nz = e1[0] * e2[1] - e1[1] * e2[0];
    if (nz < -1e-9 && Math.max(...p.map((q) => q[2])) > BASE + 1e-4) throw new Error("ondervlak boven de onderkant");
  }
  // Wanden overal boven de treden ernaast.
  const topAt = (x) => {
    for (let i = 0; i + 1 < WALL_TOP.length; i++) {
      const [x0, z0] = WALL_TOP[i];
      const [x1, z1] = WALL_TOP[i + 1];
      if (x >= x0 && x <= x1) return z0 + ((z1 - z0) * (x - x0)) / (x1 - x0);
    }
    return NaN;
  };
  for (const [x0, x1, top] of TREADS) {
    const low = Math.min(topAt(x0), topAt(x1), topAt((x0 + x1) / 2));
    if (low < top + 0.05) throw new Error(`wand te laag bij trede ${x0}..${x1}`);
  }
}

// ---------- looppad als eigen onderdelen ----------
// De bovenste 0,5 m van elke trede tussen de wanden is een eigen node met de
// attributen van het BGT-wegdeel eronder (glTF `extras.attributes`), zodat de
// kleurregels van een thema er net zo op werken als op de PDOK-wegdelen
// ernaast. De BGT heeft in de trog alleen actuele wegdelen met relatieve
// hoogteligging 0 (de brug ligt in het maaiveld en het water, niet erboven):
// 'voetpad' (de twee bordessen) en 'voetpad op trap' (de trappen en het
// looppad door de gracht), allebei onverhard zonder plus-fysiek voorkomen.
// Pas na het printmodel gebouwd, zodat de STL ongewijzigd blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
// De snijstrook houdt 3 cm vrij van de binnenkant van de wanden; er steekt
// verder niets boven de treden uit.
const CUT = INNER - 0.03;
const ATTRIBUTES = {
  [VOETPAD]: { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "onverhard" },
  [TRAP]: { bgt_functie: "voetpad op trap", bgt_fysiekvoorkomen: "onverhard" },
};
const cutFor = (functie) =>
  union(
    TREADS.filter(([, , , f]) => f === functie).map(([x0, x1, top]) =>
      boxFromTo(x0, x1, -CUT, CUT, Z(top) - LAYER, Z(top) + ABOVE),
    ),
  );
const footCut = cutFor(VOETPAD);
const stairCut = cutFor(TRAP);
const footpath = footCut.intersect(bridge);
const stairs = stairCut.intersect(bridge);
const structure = bridge.subtract(union([footCut, stairCut]));
const parts = [
  ["building:mozesbrug", structure],
  ["road:voetpad", footpath, ATTRIBUTES[VOETPAD]],
  ["road:voetpad-op-trap", stairs, ATTRIBUTES[TRAP]],
];
{
  // De onderdelen vullen de brug precies op.
  const whole = bridge.volume();
  const sum = parts.reduce((total, [, solid]) => total + solid.volume(), 0);
  console.log("volume brug, onderdelen (m3):", +whole.toFixed(3), +sum.toFixed(3));
  if (Math.abs(sum - whole) > 1e-4 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) {
    if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
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
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
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
    volumeM3: +solid.volume().toFixed(2),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "mozesbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-mozesbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de vlakke onderkant op het printbed.
const stlName = `mozesbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Mozesbrug Halsteren 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Maaiveld: drie punten op het PDOK-looppad in de trog boven de gracht. Het
// laagste (x = -8, NAP -0,171 m, ellipsoïdisch 44,309 m) zet z = 0 met
// groundOffsetMetres = 0,5 + 0,171 weer op de waterspiegel (NAP +0,5 m).
const GROUND_SAMPLES = [[-8, 0], [0, 0], [8, 0]];
const SAMPLE_NAP = -0.171;
await writeFile(
  path.join(outDir, "mozesbrug.json"),
  JSON.stringify(
    {
      name: "Mozesbrug",
      file: "mozesbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [79635.82, 393875.645],
      xAxis: [0.95473, -0.29746],
      groundOffsetMetres: +(WATER_NAP - SAMPLE_NAP).toFixed(3),
      groundHeight: 44.309,
      groundSamplePoints: GROUND_SAMPLES,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van de trog midden boven de vestinggracht van Fort de Roovere op de waterspiegel (z = 0, NAP +0,5 m) in de oorsprong, +X langs de brug naar de buitenoever in het oostzuidoosten (RD-richting -17,3 graden vanaf het oosten) en +Y naar het noordnoordoosten. Drie nodes: building, de trog van twee damwanden van 51,6 m (x = -32,5 tot 19,1; binnen 1,0 m uit elkaar, voor het printen 0,9 m dik in plaats van 0,15 m) met de bovenkant over de gracht op NAP +0,85 m en langs de trappen evenwijdig aan de trap net boven de glooiing, plus de treden; road:voetpad, de bovenste 0,5 m van het bovenbordes in de wal (NAP +8,8 m) en het benedenbordes aan de gracht, en road:voetpad-op-trap, die van de westtrap (14 treden van 0,95 m), het looppad door de gracht en de oosttrap naar het pad op de buitenoever (NAP +3,4 m), elk met de attributen van het BGT-wegdeel in extras.attributes (voetpad of voetpad op trap, onverhard). Omdat het model niet in het PDOK-terrein kan snijden en dat de trog al als wegvlakken en dunne wanden bevat, ligt elke trede 6 cm boven het hoogste PDOK-wegvlak eronder (het looppad door de gracht op NAP +0,08 m in plaats van -0,30 volgens het AHN) en staan de wanden boven het PDOK-terrein en de PDOK-scheidingswanden. Het maaiveld wordt op het PDOK-looppad in de trog bemonsterd (laagste punt NAP -0,17 m), vandaar groundOffsetMetres 0,67. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(X_EAST - X_WEST).toFixed(2),
        walkwayWidthBgtM: 1.12,
        wallThicknessM: { real: 0.15, model: WALL },
        waterNapM: WATER_NAP,
        walkwayNapM: { ahn: -0.3, model: 0.08 },
        wallTopOverWaterNapM: { ahn: 0.72, model: 0.85 },
        upperLandingNapM: 8.8,
        eastPathNapM: 3.4,
        westStairM: { length: 13.29, rise: 7.06, treads: 14 },
        eastStairM: { length: 7.9, rise: 3.32, treads: 8 },
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Fort_De_Roovere",
        "PDOK BGT scheiding G0748.04144a2ebf0041298210402fd12035e0 en G0748.2586284ea06d42a4ba50de300fd1efec (muren van de trog), EPSG:28992",
        "PDOK BGT wegdeel G0748.e3db4a2532a44f0e831b044cb51516e3 en G0748.fe36048e48d54f07ac20b5d53df84ca9 (voetpad, onverhard); G0748.fa354147176e46e0a42f1b8aa02dd80f, G0748.09de3f503e60415386bedc62dc21e028, G0748.bc4b29aebe6f4a5aa9a649ca399a62f5, G0748.95430c6cf6e549d094a2fd88c8cc92d7, G0748.98c14b789ae34752b45f48659b646522 en G0748.5cd326599fcf44948d64a759441f0670 (voetpad op trap, onverhard); alle met relatieve hoogteligging 0",
        "PDOK AHN DSM 0,5 m via WCS voor de waterspiegel, het looppad, de wanden en de trappen",
        "PDOK 3D-terreintegels voor de hoogte van de wegvlakken, de scheidingswanden en het terrein in en naast de trog",
        "Wikimedia Commons: Digital Eye 2015 Moses's Bridge at Fort de Roovere-1.jpg en -7.jpg, Loopgraafbrug.JPG, SaillantZOBastionNOBastionGrachtLoopgraafbrugBuitenwerk.JPG",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

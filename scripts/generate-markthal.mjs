// Genereert een vereenvoudigd, gesloten 3D-model van de Markthal in Rotterdam
// (MVRDV, 2014): de boog van woningen over de markthal, 118 m lang en 72 m
// breed, met het dwarsprofiel uit het AHN langs de as geëxtrudeerd, en de
// glazen kopgevels die in een afgeronde rechthoekige opening 3 m terugliggen
// met een schuin aflopende rand. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-markthal.mjs              # 1:1000 (standaard)
//   node scripts/generate-markthal.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: het dak loopt vanaf de rechte zijwanden
// alleen omhoog en de rand van de kopgevels loopt onder circa 50 graden terug.
//
// Assenstelsel: oorsprong op RD (93068,75, 437230,84), het midden van de
// boog, op het maaiveld (NAP +3,5 m), Z omhoog. +X loopt langs de as naar het
// oostnoordoosten (RD-richting 15,78 graden), +Y naar het noordnoordwesten.
//
// Bronnen: BAG-pand 0599100100007493; AHN DSM/DTM 0,5 m (PDOK WCS): de
// rechthoek van de boog (118,2 bij 71,7 m), het dwarsprofiel (90e percentiel
// per meter over vijf blokken van 20 m, overal binnen 0,5 m gelijk) en het
// maaiveld; Wikipedia; foto's op Wikimedia Commons.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "markthal");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 3,5 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [93068.75, 437230.84];
const AXIS_DEG = 15.78;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.5;
const NAP = (h) => h - GROUND_NAP;
const BASE = NAP(3.0);
const HALF_LENGTH = 59.12;
const HALF_WIDTH = 35.8;
// Dwarsprofiel [y, NAP] van de rand naar het midden (AHN-DSM, symmetrisch
// gemiddeld): de zijwand recht op tot +15 m, de bocht van de boog, de richel
// op +40,4 m en de flauwe kap tot de nok op +43,9 m.
const PROFILE = [
  [35.8, 15.0], [35.0, 19.2], [34.0, 27.5], [33.0, 31.6], [32.0, 34.0], [31.0, 35.8], [30.0, 37.0], [29.0, 38.4],
  [28.0, 39.4], [27.0, 40.0], [26.0, 40.35], [24.0, 40.4], [23.0, 41.0], [22.0, 41.7], [21.0, 42.3], [20.0, 42.6],
  [18.0, 43.0], [15.0, 43.4], [12.0, 43.7], [8.0, 43.85], [0, 43.9],
];
// Kopgevels: het glas ligt 3 m achter de voorkant van de woningring. De opening
// is een brede afgeronde rechthoek (op de foto's: de woningen aan weerszijden
// circa 15 m dik, boven de opening circa 7,5 m): halve breedte 20,8 m, top op
// NAP +36,3 m en de hoeken als kwartellipsen van 13 bij 17,8 m. De rand loopt
// onder circa 50 graden naar het glas.
const OPENING = { half: 20.8, top: 36.3, rx: 13, ry: 17.8 };
const SIDE_RING = HALF_WIDTH - OPENING.half;
const RECESS = 3;
// Maaiveld (AHN NAP +3,5 m): de straat langs beide lange gevels, 4 m ervoor.
const GROUND_SAMPLES = [[-40, -40], [40, -40], [0, 40]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Dwarsdoorsnede in het (y, z)-vlak, uitgetrokken langs X van x0 tot x1.
const alongX = (poly, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(poly)]), x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, 0]);

// ---------- boog ----------
const half = PROFILE.map(([y, z]) => [y, NAP(z)]);
const section = [[HALF_WIDTH, BASE], ...half, ...half.slice(0, -1).reverse().map(([y, z]) => [-y, z]), [-HALF_WIDTH, BASE]];
const arch = alongX(section, -HALF_LENGTH, HALF_LENGTH);
// Opening van de markthal: een afgeronde rechthoek met de bodem onder de
// onderkant. Het glas ligt `RECESS` m achter de voorkant, de opening daar is
// 1 m smaller en 3,6 m lager, zodat de rand overal onder ruim 45 graden naar
// het glas loopt.
const opening = (() => {
  const zTop = NAP(OPENING.top);
  const zCorner = zTop - OPENING.ry;
  const yCorner = OPENING.half - OPENING.rx;
  const arc = [];
  for (let k = 0; k <= 16; k++) {
    const a = ((Math.PI / 2) * k) / 16;
    arc.push([yCorner + OPENING.rx * Math.cos(a), zCorner + OPENING.ry * Math.sin(a)]);
  }
  const right = [[OPENING.half, BASE - 1], ...arc];
  const left = right.slice(1).reverse().map(([y, z]) => [-y, z]);
  return [...right, ...left, [-OPENING.half, BASE - 1]];
})();
const outer = opening;
const inner = outer.map(([y, z]) => [y * (1 - 1 / OPENING.half), z <= BASE - 1 + 1e-9 ? z : z - 3.6]);
const at3 = (poly, x) => poly.map(([y, z]) => [x, y, z]);
const recess = (sign) =>
  Manifold.hull([...at3(outer, sign * (HALF_LENGTH + 1)), ...at3(outer, sign * HALF_LENGTH), ...at3(inner, sign * (HALF_LENGTH - RECESS))]);
const hall = arch.subtract(recess(1)).subtract(recess(-1));

const nodes = [["building:markthal", hall]];
const all = hall;

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
const glbFile = path.join(outDir, "markthal.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-markthal.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `markthal-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Markthal Rotterdam 1:${scale} mm Z-up`);
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

const hallBox = hall.boundingBox();
await writeFile(
  path.join(outDir, "markthal.json"),
  JSON.stringify(
    {
      name: "Markthal",
      file: "markthal.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op de straat langs beide lange gevels, 4 m ervoor (NAP +3,5 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0599100100007493"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (93068,75, 437230,84), het midden van de boog, op het maaiveld (NAP +3,5 m), +X langs de as naar het oostnoordoosten (15,78 graden vanaf het oosten) en +Y naar het noordnoordwesten. Eén node building:markthal: de boog van 118,2 bij 71,7 m met het dwarsprofiel uit het AHN langs de as geëxtrudeerd (zijwanden recht op tot NAP +15 m, de bocht van de boog, een richel op +40,4 m en de nok op +43,9 m), en in beide kopgevels het glas 3 m achter de voorkant, in een opening in de vorm van een afgeronde rechthoek (halve breedte 20,8 m, top op NAP +36,3 m, hoeken van 13 bij 17,8 m, de woningen aan de zijkanten circa 15 m dik en erboven circa 7,5 m) met een rand onder circa 50 graden. Het dak loopt vanaf de zijwanden alleen omhoog, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van het BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`markthal-1-${scale}.stl`],
      realWorld: {
        lengthM: +(hallBox.max[0] - hallBox.min[0]).toFixed(2),
        widthM: +(hallBox.max[1] - hallBox.min[1]).toFixed(2),
        highestPointNapM: +(hallBox.max[2] + GROUND_NAP).toFixed(2),
        ridgeNapM: PROFILE.at(-1)[1],
        ledgeNapM: 40.4,
        sideWallTopNapM: PROFILE[0][1],
        sideRingThicknessM: +SIDE_RING.toFixed(1),
        openingHalfWidthM: OPENING.half,
        openingTopNapM: OPENING.top,
        glassRecessM: RECESS,
        groundNapM: GROUND_NAP,
        baseNapM: 3.0,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Markthal_(Rotterdam)",
        "PDOK BAG pand 0599100100007493, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: rechthoek en dwarsprofiel van de boog (90e percentiel per meter over vijf blokken van 20 m), maaiveld",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

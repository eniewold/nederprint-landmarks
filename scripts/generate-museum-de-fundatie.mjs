// Genereert een vereenvoudigd, gesloten 3D-model van Museum de Fundatie in
// Zwolle: het neoclassicistische Paleis aan de Blijmarkt (Eduard Louis de
// Coninck, 1838-1841) met de twee zuilenportieken onder een driehoekig fronton
// aan de Blijmarkt en aan de Potgietersingel, en ‘de Wolk’ (Bierman Henket
// architecten, 2013), de ellipsvormige expositiezaal die op het dak ligt.
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, één node per onderdeel met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-museum-de-fundatie.mjs              # 1:1000 (standaard)
//   node scripts/generate-museum-de-fundatie.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: het paleis staat recht op vanaf 1 m onder
// het maaiveld en de onderkant van de Wolk hangt nergens flauwer dan 45 graden
// (het script controleert dat), op de vlakke onderkant van de kroonlijst na
// (0,3 m breed), die de export onder 45 graden opvult. De bovenhelft van de Wolk is op het AHN gefit;
// de onderhelft is een halve ellipsoïde met een verticale halve as van 12 m,
// zodat hij op het dak 86 % van zijn grootste breedte heeft en aan de lange
// uiteinden hooguit 42 graden overhangt (het flauwste ondervlak staat 48
// graden boven de horizon).
//
// Assenstelsel: oorsprong in het hart van de Wolk op RD (202809,43,
// 502730,95), op het maaiveld aan de Blijmarkt (NAP +3,2 m), Z omhoog. +X
// loopt langs de lengteas van het paleis naar het zuidoosten (RD-richting
// -31,7 graden), +Y dwars daarop naar het noordoosten, de Blijmarkt.
//
// Bronnen: BAG-pand 0193100000042204 (contour van paleis, portieken en
// aanbouw); AHN DSM/DTM 0,5 m (PDOK WCS): het dak van het paleis op NAP
// +15,0 m, de frontons van +14,2 m aan de rand tot +16,4 m in de nok, de
// aanbouw aan de noordwestkant op +11,3 m, de Wolk als halve ellipsoïde
// (kleinste kwadraten op 2408 punten, rms 0,11 m: evenaar NAP +21,05 m, halve
// assen 17,69 en 12,16 m, top +29,0 m) en het maaiveld (NAP +3,2 tot +3,8 m);
// Wikipedia; foto's van Wikimedia Commons. Geschat: de onderhelft van de Wolk
// (de verticale halve as van 12 m, op foto's) en de portieken, die als dichte
// blokken onder het fronton zijn gemodelleerd in plaats van zes vrijstaande
// zuilen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "museum-de-fundatie");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;

// ---------- maten (z = NAP - 3,2 m, het maaiveld aan de Blijmarkt) ----------
const ORIGIN = [202809.43, 502730.95];
const X_AXIS = [0.85077, -0.52547];
const GROUND_NAP = 3.2;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;
const ANGLE = Math.atan2(X_AXIS[1], X_AXIS[0]);
const U = [Math.cos(ANGLE), Math.sin(ANGLE)];
const V = [-U[1], U[0]];
const local = ([x, y]) => {
  const d = [x - ORIGIN[0], y - ORIGIN[1]];
  return [+(d[0] * U[0] + d[1] * U[1]).toFixed(3), +(d[0] * V[0] + d[1] * V[1]).toFixed(3)];
};

// Paleis (BAG, lokaal): hoofdblok, portieken en de aanbouw aan de noordwestkant.
const PALACE = { x: [-19.2, 18.94], y: [-12.39, 12.7], top: NAP(15.0) };
const PORTICOS = [
  { name: "Blijmarkt", x: [-7.01, 7.33], y: [12.6, 15.73] },
  { name: "Potgietersingel", x: [-7.19, 7.31], y: [-18.11, -12.3] },
];
const PEDIMENT = { eaves: NAP(14.2), ridge: NAP(16.4) };
const ANNEX = { x: [-22.14, -19.1], y: [6.86, 8.34], top: NAP(11.3) };
// Kroonlijst onder de dakrand: 0,3 m uitstekend, 0,6 m hoog (foto's). Zijn
// vlakke onderkant zorgt er ook voor dat de export de node laag voor laag onder
// 45 graden opvult en de ronde onderkant van de Wolk behoudt; zonder één vlak
// steiler dan 45 graden vult hij recht naar beneden op.
const CORNICE = { out: 0.3, height: 0.6 };

// De Wolk: halve ellipsoïde boven de evenaar (AHN-fit), onderhelft geschat.
const CLOUD = {
  centre: [-0.07, 0.18],
  equator: NAP(21.05),
  a: 17.69,
  b: 12.16,
  up: 7.97,
  down: 12,
};

// Maaiveld (RD) rondom: Blijmarkt, Potgietersingel-zijde, noordwest- en
// zuidoostkant.
const GROUND_SAMPLES = [
  [202819.2, 502746.7],
  [202798.4, 502713.1],
  [202785.5, 502734.0],
  [202830.9, 502724.8],
];

// ---------- hulpfuncties ----------
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);

// ---------- paleis ----------
const palace = Manifold.union(
  box(PALACE.x, PALACE.y, BASE, PALACE.top),
  box(
    [PALACE.x[0] - CORNICE.out, PALACE.x[1] + CORNICE.out],
    [PALACE.y[0] - CORNICE.out, PALACE.y[1] + CORNICE.out],
    PALACE.top - CORNICE.height,
    PALACE.top,
  ),
);
const porticos = PORTICOS.map(({ x, y }) => {
  const mid = (x[0] + x[1]) / 2;
  // Zadeldak met de nok dwars op de gevel: het fronton aan de voorkant.
  const pts = [];
  for (const yy of y) {
    pts.push(
      [x[0], yy, BASE], [x[1], yy, BASE],
      [x[0], yy, PEDIMENT.eaves], [x[1], yy, PEDIMENT.eaves],
      [mid, yy, PEDIMENT.ridge],
    );
  }
  return Manifold.hull(pts);
});
const annex = box(ANNEX.x, ANNEX.y, BASE, ANNEX.top);

// ---------- de Wolk ----------
// Eén bol, boven en onder de evenaar verschillend in de hoogte geschaald.
const cloud = Manifold.sphere(1, 128)
  .scale([CLOUD.a, CLOUD.b, 1])
  .warp((v) => {
    v[2] *= v[2] > 0 ? CLOUD.up : CLOUD.down;
  })
  .translate([CLOUD.centre[0], CLOUD.centre[1], CLOUD.equator]);

const museum = Manifold.union([palace, ...porticos, annex, cloud]);
const nodes = [["building:museum-de-fundatie", museum]];

// ---------- controles ----------
if (museum.status() !== "NoError") throw new Error(museum.status());
{
  const mesh = museum.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 90;
  let cornice = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-4 || n[2] >= 0) continue;
    if (p.every((q) => Math.abs(q[2] - (PALACE.top - CORNICE.height)) < 1e-4)) {
      cornice += len / 2;
      continue;
    }
    worst = Math.min(worst, (Math.acos(-n[2] / len) * 180) / Math.PI);
  }
  // Hoek boven de horizon: 45 graden of meer is zonder steun printbaar.
  console.log(
    `flauwste ondervlak: ${worst.toFixed(1)} graden boven de horizon; onderkant kroonlijst ${cornice.toFixed(1)} m2`,
  );
  if (worst < 45) throw new Error("ondervlak flauwer dan 45 graden");
  if (!(cornice > 10)) throw new Error("kroonlijst zonder vlakke onderkant");
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
const glbFile = path.join(outDir, "museum-de-fundatie.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-museum-de-fundatie.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `museum-de-fundatie-1-${scale}.stl`);
const printSolid = museum.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Museum de Fundatie 1:${scale} mm Z-up`);
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
  path.join(outDir, "museum-de-fundatie.json"),
  JSON.stringify(
    {
      name: "Museum de Fundatie",
      file: "museum-de-fundatie.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom het paleis (NAP +3,2 tot +3,8 m).
      groundSamplePoints: GROUND_SAMPLES.map(local),
      replacesBuildings: ["NL.IMBAG.Pand.0193100000042204"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong in het hart van de Wolk op RD (202809,43, 502730,95), op het maaiveld aan de Blijmarkt (NAP +3,2 m), +X langs de lengteas van het paleis naar het zuidoosten (RD-richting -31,7 graden) en +Y naar het noordoosten, de Blijmarkt. Eén node building: het Paleis aan de Blijmarkt (dak NAP +15,0 m) met de twee portieken onder het fronton (nok +16,4 m) en de aanbouw aan de noordwestkant, en de Wolk als ellipsoïde op het dak (evenaar +21,05 m, halve assen 17,69 en 12,16 m, top +29,0 m). De onderhelft van de Wolk hangt hooguit 42 graden over, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0193100000042204. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`museum-de-fundatie-1-${scale}.stl`],
      realWorld: {
        palaceM: [+(PALACE.x[1] - PALACE.x[0]).toFixed(2), +(PALACE.y[1] - PALACE.y[0]).toFixed(2)],
        palaceRoofNapM: 15.0,
        pedimentRidgeNapM: 16.4,
        cloud: {
          lengthM: +(2 * CLOUD.a).toFixed(2),
          widthM: +(2 * CLOUD.b).toFixed(2),
          equatorNapM: 21.05,
          topNapM: +(CLOUD.equator + CLOUD.up + GROUND_NAP).toFixed(2),
          lowerSemiAxisM: { estimated: CLOUD.down },
        },
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Museum_de_Fundatie",
        "PDOK BAG pand 0193100000042204 (contour van paleis, portieken en aanbouw), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dak, frontons, aanbouw, maaiveld en de bovenhelft van de Wolk (ellipsoïde-fit, rms 0,11 m)",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: Museum de Fundatie Zwolle in 2021.jpg, De Fundatie, Zwolle.jpg, Basiliek van Onze-Lieve-Vrouw-Tenhemelopneming - Zwolle - View from the tower towards the southeast - De Fundatie.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

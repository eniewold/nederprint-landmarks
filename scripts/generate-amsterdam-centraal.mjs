// Genereert een vereenvoudigd, gesloten 3D-model van station Amsterdam
// Centraal: het stationsgebouw van Cuypers (1881-1889) met de middenpartij, de
// twee torens, de vleugels en het koningspaviljoen, plus de vier gebogen
// perronkappen: de eerste kap (1889), de middenkap (1997), de tweede kap
// (1922-1924) en de kap boven het busstation aan de IJ-zijde (2014). Alle maten
// in het script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y
// omhoog, één node per onderdeel met de materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-amsterdam-centraal.mjs             # 1:2000 (standaard)
//   node scripts/generate-amsterdam-centraal.mjs --scale 1000
//
// Het complex is 430 m lang; op 1:1000 past de STL niet op een printbed,
// daarom is 1:2000 hier de standaard (215 mm).
//
// Meetstelsel: alle maten hieronder staan in een stelsel langs de sporen, zoals
// ze uit het AHN en de BGT zijn gemeten: u langs de sporen naar het
// oostzuidoosten (RD-richting -31,11 graden, de hoofdrichting van de
// BAG-contour), v loodrecht daarop naar het IJ, nulpunt RD (121880, 487930).
// Hoogtes staan als NAP-hoogte in het script en worden met `nap()` omgezet.
// Het model zelf heeft zijn oorsprong in het midden van de voorgevel van de
// middenpartij (u -48,4, v -21,6) op NAP +2,5 m (Stationsplein NAP +2,8 m
// min de 0,3 m van groundOffsetMetres), Z omhoog, +X langs de sporen naar
// het oosten en +Y naar het IJ; de voorgevel ligt richting -Y.
//
// Bronnen: BAG-panden en BGT-pand 0363100012185598 (contour van het
// stationsgebouw); AHN DSM/DTM 0,5 m (PDOK WCS) voor alle hoogtes, de
// boogprofielen van de kappen (90e percentiel per meter dwars op de sporen,
// langs de hele kap constant binnen 5 cm) en de plaats van torens, topgevels
// en paviljoens; Wikipedia en het Rijksmonumentenregister (5681) voor namen,
// jaartallen en de overspanning van de eerste kap (bijna 45 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "amsterdam-centraal");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;

// ---------- meetstelsel en hoogtes ----------
const SURVEY_ORIGIN_RD = [121880, 487930];
const AXIS_DEGREES = -31.11;
// Oorsprong van het model in het meetstelsel: midden van de voorgevel van de
// middenpartij, tussen de torens.
const MODEL_ORIGIN_UV = [-48.4, -21.6];
const Z_REF_NAP = 2.5;
const nap = (height) => height - Z_REF_NAP;
// Vlakke onderkant van alle onderdelen (NAP +0,5 m): onder het Stationsplein
// (NAP +2,8 m) en de IJ-zijde (NAP +0,8 m), zodat nergens een kier ontstaat.
const BOTTOM = nap(0.5);

// ---------- hulpfuncties (meetstelsel, meters) ----------
const union = (parts) => Manifold.union(parts);
const box = (u0, u1, v0, v1, z0, z1) =>
  Manifold.cube([u1 - u0, v1 - v0, z1 - z0], false).translate([u0, v0, z0]);

function ccw(points) {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[(i + 1) % points.length];
    area += x0 * y1 - x1 * y0;
  }
  return area > 0 ? points : [...points].reverse();
}

// Dwarsprofiel [v, z] uitgetrokken langs u van u0 tot u1. Extrude trekt langs
// Z; de twee rotaties zetten (X, Y, Z) om naar (Z, X, Y) = (u, v, z).
const prismU = (profile, u0, u1) =>
  Manifold.extrude([ccw(profile)], u1 - u0)
    .rotate([90, 0, 0])
    .rotate([0, 0, 90])
    .translate([u0, 0, 0]);

// Langsprofiel [u, z] uitgetrokken langs v van v0 tot v1: na de rotatie om X
// loopt de extrusie naar -v, dus eerst naar v1 schuiven.
const prismV = (profile, v0, v1) =>
  Manifold.extrude([ccw(profile)], v1 - v0)
    .rotate([90, 0, 0])
    .translate([0, v1, 0]);

// Een dak of topgevel als profiel met NAP-hoogtes, dicht gemaakt tot de onderkant.
const closedProfile = (top) => [
  [top[0][0], BOTTOM],
  ...top.map(([a, z]) => [a, nap(z)]),
  [top[top.length - 1][0], BOTTOM],
];

// Gevel met topgevel: rechthoek tot de schouders, driehoek tot de top.
const gable = (c, halfWidth, shoulder, peak) =>
  closedProfile([
    [c - halfWidth, shoulder],
    [c, peak],
    [c + halfWidth, shoulder],
  ]);

// Torenspits: vierkante piramide op de schacht, tot vrijwel een punt.
function spire(u0, u1, v0, v1, z0, z1) {
  const [hu, hv] = [(u1 - u0) / 2, (v1 - v0) / 2];
  const square = [
    [-hu, -hv],
    [hu, -hv],
    [hu, hv],
    [-hu, hv],
  ];
  return Manifold.extrude([square], z1 - z0, 0, 0, [0.06, 0.06]).translate([
    u0 + hu,
    v0 + hv,
    z0,
  ]);
}

// ---------- stationsgebouw ----------
// Hoofdvleugels: gevel tot de goot op NAP +20,7 m, mansardekap met de knik op
// NAP +25,3 m (3 m achter de voorgevel) en de nok op NAP +26,0 m in het midden.
const WING_FRONT = -9.0;
const BUILDING_BACK = 9.6; // achtergevel tegen perron 2, volgens de BGT
const wingProfile = closedProfile([
  [WING_FRONT, 20.7],
  [-6.0, 25.3],
  [0.0, 26.0],
  [6.0, 25.3],
  [BUILDING_BACK, 20.7],
]);
const mainWings = prismU(wingProfile, -139.3, 23.3);

// Topgevels van de dakkapellen aan de voorzijde (AHN: top op NAP +27 tot
// +28,7 m), plus de brede topgevel met risaliet in de westvleugel (NAP +31,4 m).
const DORMERS = [
  { u: -105.5, halfWidth: 1.5, peak: 27.0 },
  { u: -86.5, halfWidth: 1.5, peak: 28.7 },
  { u: -11.5, halfWidth: 1.5, peak: 27.7 },
  { u: 8.0, halfWidth: 1.5, peak: 28.6 },
];
const dormers = union([
  ...DORMERS.map(({ u, halfWidth, peak }) =>
    prismV(gable(u, halfWidth, 23.0, peak), WING_FRONT - 0.2, -5.0),
  ),
  prismV(gable(-122.75, 2.75, 27.0, 31.4), -10.4, -5.0),
]);

// Lage westvleugel: gevel tot NAP +11,5 m, zadeldak met de nok op NAP +15,4 m,
// achter aflopend naar NAP +14,1 m; aan het westeinde een hoger kopgebouw.
const westWingProfile = (front) =>
  closedProfile([
    [front, 11.5],
    [3.5, 15.4],
    [BUILDING_BACK, 14.1],
  ]);
const westWing = union([
  prismU(westWingProfile(-0.7), -205.6, -183.0),
  prismU(westWingProfile(-2.6), -183.0, -139.3),
  box(-205.6, -201.5, -0.7, BUILDING_BACK, BOTTOM, nap(18.7)),
]);

// Middenpartij: naar voren uitgebouwd tot v -21,6 tussen de torens, met een
// dwarskap (nok langs v op NAP +34,2 m, aan de achterzijde afgewolfd), een
// lager voorblok op NAP +29,3 m en de grote topgevel tot NAP +38 m.
const frontBlock = prismU(
  closedProfile([
    [-21.6, 22.5],
    [-18.5, 25.8],
    [WING_FRONT, 25.8],
  ]),
  -71.2,
  -25.6,
);
const centralRoof = prismV(
  closedProfile([
    [-61.0, 26.0],
    [-54.0, 34.2],
    [-44.0, 34.2],
    [-37.0, 26.0],
  ]),
  -16.5,
  2.5,
).intersect(
  prismU(
    closedProfile([
      [-16.5, 34.2],
      [-2.0, 34.2],
      [2.5, 26.0],
    ]),
    -61.0,
    -37.0,
  ),
);
const entranceBlock = box(-58.0, -40.0, -21.6, -16.5, BOTTOM, nap(29.3));
const centralGable = prismV(gable(-49.0, 5.0, 29.3, 38.0), -21.6, -19.6);

// Torens naast de middenpartij: vierkante schacht tot NAP +29,5 m, een
// kroonlijst en een spits tot de hoogste AHN-punten (de klok- en
// windwijzerwijzerplaten zitten in de schacht en zijn niet gemodelleerd).
const TOWERS = [
  { u0: -71.2, u1: -64.5, v0: -20.4, v1: -13.6, top: 43.7 },
  { u0: -32.2, u1: -25.6, v0: -20.4, v1: -13.5, top: 42.8 },
];
const TOWER_SHAFT_TOP = 29.5;
const towers = union(
  TOWERS.flatMap(({ u0, u1, v0, v1, top }) => [
    box(u0, u1, v0, v1, BOTTOM, nap(TOWER_SHAFT_TOP)),
    box(u0 - 0.3, u1 + 0.3, v0 - 0.3, v1 + 0.3, nap(TOWER_SHAFT_TOP - 0.8), nap(TOWER_SHAFT_TOP)),
    spire(u0, u1, v0, v1, nap(TOWER_SHAFT_TOP), nap(top)),
  ]),
);

// Koningspaviljoen (Koninklijke wachtkamer) aan de oostkant: schilddak met een
// plat bovenvlak op NAP +29,9 m, en het naar voren stekende portaal met een
// kap langs v (nok NAP +28,2 m) en een topgevel tot NAP +32 m.
const royalPavilion = prismU(
  closedProfile([
    [-10.3, 20.7],
    [-6.0, 29.9],
    [4.5, 29.9],
    [BUILDING_BACK, 20.7],
  ]),
  23.3,
  42.6,
).intersect(
  prismV(
    closedProfile([
      [23.3, 20.7],
      [27.0, 29.9],
      [39.0, 29.9],
      [42.6, 20.7],
    ]),
    -10.3,
    BUILDING_BACK,
  ),
);
const royalPorch = union([
  prismV(
    closedProfile([
      [28.3, 21.0],
      [33.0, 28.2],
      [37.7, 21.0],
    ]),
    -21.0,
    -10.0,
  ),
  prismV(gable(33.0, 4.2, 21.5, 32.0), -21.0, -20.0),
]);

// Laag tussenstuk boven de oostelijke doorgang (NAP +14,5 m); de doorgang zelf
// (v tot 2,6) blijft open.
const eastPassage = box(42.6, 48.4, 2.6, BUILDING_BACK, BOTTOM, nap(14.5));

// Oostvleugel: minder diep (voorgevel op v -6), goot op NAP +17,9 m, mansarde
// tot NAP +23,4 m en een lage nok op NAP +24,2 m; twee hogere risalieten met
// een plat dak op NAP +25,4 m en een topgevel aan de voorzijde.
const EAST_FRONT = -6.0;
const EAST_BACK = 9.1;
const eastProfile = (top, ridge = top) =>
  closedProfile([
    [EAST_FRONT, 17.9],
    [-2.0, top],
    [1.5, ridge],
    [5.0, top],
    [EAST_BACK, 17.8],
  ]);
const EAST_RISALITS = [
  [59.0, 70.5],
  [146.0, 157.5],
];
const eastWing = union([
  prismU(eastProfile(23.4, 24.2), 48.4, 167.5),
  ...EAST_RISALITS.flatMap(([u0, u1]) => [
    prismU(eastProfile(25.4), u0, u1),
    prismV(gable((u0 + u1) / 2, 3.0, 22.0, 26.5), EAST_FRONT - 0.2, -4.0),
  ]),
]);

const stationBuilding = union([
  mainWings,
  dormers,
  westWing,
  frontBlock,
  centralRoof,
  entranceBlock,
  centralGable,
  towers,
  royalPavilion,
  royalPorch,
  eastPassage,
  eastWing,
]);

// ---------- perronkappen ----------
// Boogprofielen uit het AHN-DSM: 90e percentiel per meter dwars op de sporen
// (NAP-hoogte vanaf de eerste v), over u -190 tot 80 gemeten. De eerste en de
// tweede kap hebben een lichtstraat in de nok (de sprong van ruim 1 m); de kappen
// sluiten in de goten op elkaar aan. Elke kap wordt als gesloten volume tot de
// onderkant gemodelleerd, met aan beide kopse kanten een 1 m teruggelegde
// glazen kopgevel onder een 1,2 m dikke boogrand.
const HALLS = [
  {
    label: "eerste kap",
    // L.J. Eijmer, 1889: overspanning van bijna 45 m.
    from: 10,
    profile: [
      14.55, 15.70, 18.15, 19.05, 20.30, 21.25, 22.05, 22.75, 23.35, 23.95,
      24.45, 24.95, 25.35, 25.75, 26.05, 26.35, 26.60, 27.80, 28.15, 28.40,
      28.65, 28.85, 29.05, 28.90, 28.65, 28.45, 28.25, 27.95, 26.60, 26.40,
      26.10, 25.75, 25.40, 25.00, 24.55, 24.00, 23.45, 22.80, 22.15, 21.35,
      20.45, 19.35, 18.15, 16.15, 14.30, 13.25,
    ],
    // Sluit aan op de achtergevel van het stationsgebouw.
    start: [BUILDING_BACK, 14.1],
    u: [-202.75, 105.75],
  },
  {
    label: "middenkap",
    // Jan Garvelink, 1997, tussen de twee historische kappen.
    from: 55,
    profile: [
      13.25, 14.40, 15.35, 16.35, 17.20, 18.60, 18.95, 19.25, 19.40, 19.45,
      19.45, 19.35, 19.20, 18.90, 18.50, 17.15, 16.10, 15.50, 14.15, 13.25,
    ],
    u: [-262.75, 95.25],
  },
  {
    label: "tweede kap",
    // Werkspoor, 1922-1924, met dezelfde lichtstraat als de eerste kap.
    from: 74,
    profile: [
      13.25, 16.00, 18.30, 20.25, 21.20, 22.05, 22.80, 23.45, 24.00, 24.50,
      24.90, 25.25, 25.55, 27.20, 27.60, 28.05, 28.45, 28.80, 29.10, 28.70,
      28.40, 27.95, 27.60, 26.95, 25.50, 25.20, 24.80, 24.40, 23.85, 23.30,
      22.65, 21.85, 20.90, 20.25, 18.30, 16.10, 11.70, 11.20, 10.90,
    ],
    u: [-261.25, 93.75],
  },
  {
    label: "busstationkap",
    // Benthem Crouwel, 2014: glazen boog boven het busstation aan het IJ.
    from: 112,
    profile: [
      10.90, 12.10, 13.05, 13.80, 14.60, 15.20, 15.85, 16.50, 17.10, 17.65,
      18.20, 18.75, 18.95, 19.55, 20.00, 20.25, 20.75, 21.10, 21.35, 21.65,
      21.90, 22.05, 22.25, 22.40, 22.60, 22.70, 22.75, 22.80, 22.85, 22.85,
      22.80, 22.80, 22.70, 22.60, 22.45, 22.30, 22.10, 21.90, 21.65, 21.35,
      21.10, 20.75, 20.30, 20.00, 19.55, 19.00, 18.55, 17.90, 17.45, 16.65,
      15.80, 15.15, 14.40, 13.70,
    ],
    // Noordrand boven de IJ-zijde.
    end: [165.5, 13.7],
    u: [-260.25, 100.5],
  },
];
const HALL_END_RECESS = 1.0;
const HALL_RIM = 1.2;

function hallSolid({ from, profile, start, end, u: [u0, u1] }) {
  const top = profile.map((z, i) => [from + i, z]);
  if (start) top.unshift(start);
  if (end) top.push(end);
  const body = prismU(closedProfile(top), u0 + HALL_END_RECESS, u1 - HALL_END_RECESS);
  const rim = prismU(
    [
      ...top.map(([v, z]) => [v, nap(z)]),
      ...[...top].reverse().map(([v, z]) => [v, nap(z) - HALL_RIM]),
    ],
    u0,
    u1,
  );
  return union([body, rim]);
}

// ---------- van meetstelsel naar model ----------
const toModel = (solid) => solid.translate([-MODEL_ORIGIN_UV[0], -MODEL_ORIGIN_UV[1], 0]);
const parts = [
  ["building:stationsgebouw", toModel(stationBuilding)],
  ...HALLS.map((hall) => [`building:${hall.label}`, toModel(hallSolid(hall))]),
];
const printModel = union(parts.map(([, solid]) => solid));

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
const glbFile = path.join(outDir, "amsterdam-centraal.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-amsterdam-centraal.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `amsterdam-centraal-1-${scale}.stl`);
const { buffer, triangles } = toStl(
  printModel,
  `NederPrint Amsterdam Centraal 1:${scale} mm Z-up -Y=Stationsplein`,
);
await writeFile(stlFile, buffer);
const bb = printModel.boundingBox();
report.stl = {
  file: stlFile,
  status: printModel.status(),
  genus: printModel.genus(),
  triangles,
  volumeCm3: +((printModel.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. RD-oorsprong en -as volgen
// uit het meetstelsel. Het maaiveld wordt op het Stationsplein bemonsterd: rond
// de hele voetafdruk zou de lader het IJ of de lagere IJ-zijde (NAP +0,8 m)
// kunnen raken. De acht vervangen panden dekken samen stationsgebouw, kappen,
// IJ-hal en de tunnels eronder; de PDOK-reconstructie van het stationspand is
// een LoD1.1-blok (rf_extrusion_mode lod11_fallback) zonder kappen.
const angle = (AXIS_DEGREES * Math.PI) / 180;
const xAxis = [Math.cos(angle), Math.sin(angle)];
const yAxis = [-xAxis[1], xAxis[0]];
const [ou, ov] = MODEL_ORIGIN_UV;
const origin = [0, 1].map(
  (i) => +(SURVEY_ORIGIN_RD[i] + ou * xAxis[i] + ov * yAxis[i]).toFixed(2),
);
const groundSamplePoints = [
  [-100, -28],
  [-48.4, -28],
  [0, -28],
  [60, -16],
  [100, -16],
].map(([u, v]) => [+(u - ou).toFixed(1), +(v - ov).toFixed(1)]);
await writeFile(
  path.join(outDir, "amsterdam-centraal.json"),
  JSON.stringify(
    {
      name: "Amsterdam Centraal",
      file: "amsterdam-centraal.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin,
      xAxis: xAxis.map((c) => +c.toFixed(5)),
      groundOffsetMetres: -0.3,
      groundSamplePoints,
      replacesBuildings: [
        "0363100012185598",
        "0363100012185599",
        "0363100012240304",
        "0363100012240311",
        "0363100012242112",
        "0363100012245758",
        "0363100012245759",
        "0363100012246251",
      ].map((id) => `NL.IMBAG.Pand.${id}`),
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het midden van de voorgevel van de middenpartij (tussen de torens) in de oorsprong, +X langs de sporen naar het oosten (RD-azimut 121 graden) en +Y naar het IJ; de voorgevel aan het Stationsplein ligt richting -Y. Het maaiveld wordt op het Stationsplein bemonsterd. Vervangt de PDOK-reconstructie van het stationspand (een LoD1.1-blok), de IJ-hal en de tunnels. Nodenamen klasse:label bepalen de materiaalklasse.",
      printFiles: [`amsterdam-centraal-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(1),
        depthM: +(bb.max[1] - bb.min[1]).toFixed(1),
        stationBuildingLengthM: 373.4,
        wingEavesNapM: 20.7,
        wingRidgeNapM: 26.0,
        centralRidgeNapM: 34.2,
        towerTopsNapM: TOWERS.map((tower) => tower.top),
        halls: HALLS.map(({ label, from, profile, start, end, u }) => {
          const top = profile.map((z, i) => [from + i, z]);
          if (start) top.unshift(start);
          if (end) top.push(end);
          return {
            label,
            spanM: +(top[top.length - 1][0] - top[0][0]).toFixed(1),
            lengthM: +(u[1] - u[0]).toFixed(1),
            topNapM: Math.max(...profile),
          };
        }),
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Station_Amsterdam_Centraal",
        "https://en.wikipedia.org/wiki/Amsterdam_Centraal_station",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/5681",
        "PDOK BAG panden en BGT pand 0363100012185598 (contour stationsgebouw), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor alle hoogtes en de boogprofielen van de vier kappen",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

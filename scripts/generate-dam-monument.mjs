// Genereert een vereenvoudigd, gesloten 3D-model van het Nationaal Monument op
// de Dam (Amsterdam). Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus binaire STL's in millimeters op 1:<schaal> om los te printen.
//
//   node scripts/generate-dam-monument.mjs            # 1:100 (standaard)
//   node scripts/generate-dam-monument.mjs --scale 1000
//
// Assenstelsel: oorsprong in het hart van de pyloon op pleinniveau, Z omhoog,
// voorzijde (Paleis, beeldengroep, leeuwen) richting -Y, urnenmuur richting +Y.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "100"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "nationaal-monument-dam");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(96);

// ---------- hulpfuncties (meters) ----------
const box = (sx, sy, sz, x = 0, y = 0, z = 0) =>
  Manifold.cube([sx, sy, sz], false).translate([x - sx / 2, y - sy / 2, z]);
const cyl = (h, r0, r1 = r0, x = 0, y = 0, z = 0, segs = 0) =>
  Manifold.cylinder(h, r0, r1, segs, false).translate([x, y, z]);
const sphere = (r, x = 0, y = 0, z = 0, segs = 24) =>
  Manifold.sphere(r, segs).translate([x, y, z]);
const ellipsoid = (rx, ry, rz, x, y, z, segs = 24) =>
  Manifold.sphere(1, segs).scale([rx, ry, rz]).translate([x, y, z]);
// Polygoon in het YZ-vlak, uitgetrokken over breedte w langs X (gecentreerd).
const profileX = (points, w, x = 0, y = 0, z = 0) =>
  Manifold.extrude(points, w)
    .rotate([90, 0, 0])
    .rotate([0, 0, 90])
    .translate([x - w / 2, y, z]);
const union = (parts) => Manifold.union(parts);

// ---------- maten ----------
const OUTER_R = 18.54; // BGT-cirkel van de buitenste trede
const TREAD = 2.2; // optrede-breedte, zes concentrische treden
const RISER = 0.18;
const STEPS = 6;
const PLATFORM = STEPS * RISER; // bovenplateau

const PLINTH = { w: 7.0, d: 4.4, h: 2.0 };
const SLAB = { w: 9.0, d: 4.8, h: 0.5 };
const SLAB_TOP = PLATFORM + PLINTH.h + SLAB.h;

const PYLON = { h: 22.0, ax0: 2.2, ay0: 1.1, ax1: 1.1, ay1: 0.6, cap: 0.8 };
const pylonHalfDepth = (hAboveSlab) =>
  PYLON.ay0 + (PYLON.ay1 - PYLON.ay0) * (hAboveSlab / (PYLON.h - PYLON.cap));

const WALL = { rIn: 6.5, rOut: 7.2, h: 3.2, startDeg: -8, sweepDeg: 196 };
const NICHES = 14;

const LION = { x: 17.3, y: -21.4 };

// ---------- treden en plateau ----------
const steps = union(
  Array.from({ length: STEPS }, (_, i) =>
    cyl(RISER * (i + 1), OUTER_R - i * TREAD, undefined, 0, 0, 0, 192),
  ),
);

// ---------- voetstuk, sculptuurplateau en pyloon ----------
const plinth = box(PLINTH.w, PLINTH.d, PLINTH.h, 0, 0, PLATFORM);
const slab = box(SLAB.w, SLAB.d, SLAB.h, 0, 0, PLATFORM + PLINTH.h);

const shaftHeight = PYLON.h - PYLON.cap;
const pylonShaft = Manifold.extrude(
  CrossSection.circle(1, 64).scale([PYLON.ax0, PYLON.ay0]),
  shaftHeight,
  1,
  0,
  [PYLON.ax1 / PYLON.ax0, PYLON.ay1 / PYLON.ay0],
).translate([0, 0, SLAB_TOP]);
const pylonCap = ellipsoid(
  PYLON.ax1,
  PYLON.ay1,
  PYLON.cap,
  0,
  0,
  SLAB_TOP + shaftHeight,
  32,
);

// Voorblok met het relief "De Vrede" (vier geketende mannen).
const reliefBlock = profileX(
  [
    [-2.0, 0],
    [0.3, 0],
    [0.3, 4.6],
    [-1.0, 4.6],
    [-2.0, 4.0],
  ],
  4.2,
  0,
  0,
  SLAB_TOP,
);
const chainedMen = [-1.5, -0.5, 0.5, 1.5].flatMap((x) => [
  cyl(3.2, 0.36, 0.36, x, -1.92, SLAB_TOP + 0.6, 20),
  sphere(0.27, x, -1.92, SLAB_TOP + 3.95, 16),
]);
// De gekruisigde figuur heeft gestrekte armen.
const crossArms = box(1.5, 0.4, 0.35, -0.5, -1.95, SLAB_TOP + 3.25);

// Vrouw met kind en duif op een uitkragende console.
const consoleZ = SLAB_TOP + 5.7;
const consoleFront = -pylonHalfDepth(5.7);
const womanConsole = box(1.7, 1.4, 0.6, 0, consoleFront - 0.35, consoleZ);
const woman = union([
  cyl(3.0, 0.5, 0.36, 0, consoleFront - 0.5, consoleZ + 0.6, 24),
  sphere(0.3, 0, consoleFront - 0.5, consoleZ + 3.75, 16),
  cyl(1.4, 0.12, 0.12, 0.38, consoleFront - 0.55, consoleZ + 3.1, 12),
  sphere(0.18, 0.38, consoleFront - 0.55, consoleZ + 4.55, 12),
]);

// Verzetsfiguren op het plateau naast de pyloon, met honden.
const figure = (x, y, raisedArms) => {
  const parts = [
    box(1.2, 1.2, 0.3, x, y, SLAB_TOP),
    cyl(2.5, 0.42, 0.3, x, y, SLAB_TOP + 0.3, 24),
    sphere(0.28, x, y, SLAB_TOP + 3.0, 16),
  ];
  if (raisedArms) {
    parts.push(
      cyl(1.1, 0.1, 0.1, x - 0.32, y, SLAB_TOP + 2.55, 12),
      cyl(1.1, 0.1, 0.1, x + 0.32, y, SLAB_TOP + 2.55, 12),
    );
  }
  return union(parts);
};
const dog = (x, y) =>
  union([
    box(0.5, 0.9, 0.55, x, y, SLAB_TOP),
    sphere(0.24, x, y - 0.45, SLAB_TOP + 0.62, 12),
  ]);
const sideFigures = union([
  figure(-3.0, -0.6, false),
  dog(-3.9, -1.7),
  dog(-4.2, -0.2),
  figure(3.0, -0.6, true),
  dog(3.9, -1.6),
]);

// Zeven opvliegende duiven in relief aan de achterzijde.
const doves = union(
  Array.from({ length: 7 }, (_, i) => {
    const h = 4.5 + i * 1.6;
    const x = -1.0 + i * 0.33;
    return ellipsoid(
      0.55,
      0.28,
      0.3,
      x,
      pylonHalfDepth(h) - 0.08,
      SLAB_TOP + h,
      12,
    );
  }),
);

// ---------- halfronde urnenmuur met veertien nissen ----------
let wall = Manifold.revolve(
  [
    [WALL.rIn, 0],
    [WALL.rOut, 0],
    [WALL.rOut, WALL.h],
    [WALL.rIn, WALL.h],
  ],
  192,
  WALL.sweepDeg,
)
  .rotate([0, 0, WALL.startDeg])
  .translate([0, 0, PLATFORM]);
const niches = union(
  Array.from({ length: NICHES }, (_, i) => {
    const angle = 12 + (i * (180 - 24)) / (NICHES - 1);
    return box(0.3, 0.55, 0.65, WALL.rIn + 0.05, 0, PLATFORM + 1.5).rotate([
      0,
      0,
      angle,
    ]);
  }),
);
wall = wall.subtract(niches);

// ---------- leeuwen op ronde sokkels van 7 m (drie lagen) ----------
// Zittende leeuw met de kop naar het Paleis (-Y); romp als convex omhulsel.
const lion = (x, y) => {
  const top = 1.5;
  const body = Manifold.hull([
    sphere(0.75, x, y + 0.6, top + 0.75, 16), // achterhand
    sphere(0.6, x, y - 0.35, top + 1.45, 16), // borst
    box(1.3, 1.9, 0.2, x, y + 0.25, top), // ligvlak op de sokkel
  ]);
  const mane = Manifold.hull([
    sphere(0.62, x, y - 0.3, top + 2.15, 16),
    sphere(0.42, x, y - 0.8, top + 2.3, 16), // snuit
  ]);
  return union([
    cyl(0.5, 3.5, 3.5, x, y, 0, 96),
    cyl(0.5, 3.1, 3.1, x, y, 0.5, 96),
    cyl(0.5, 2.75, 2.75, x, y, 1.0, 96),
    body,
    mane,
    cyl(1.5, 0.2, 0.17, x - 0.38, y - 0.95, top, 12), // voorpoten
    cyl(1.5, 0.2, 0.17, x + 0.38, y - 0.95, top, 12),
  ]);
};

// Onderdelen per materiaalklasse: de basalttreden kleuren als wegdek, de rest
// (travertijn) als gebouw. De nodenaam `klasse:label` stuurt de catalogus.
const parts = [
  ["road:treden", steps],
  [
    "building:pyloon en urnenmuur",
    union([
      plinth,
      slab,
      pylonShaft,
      pylonCap,
      reliefBlock,
      ...chainedMen,
      crossArms,
      womanConsole,
      woman,
      sideFigures,
      doves,
      wall,
    ]),
  ],
  ["building:leeuwen", union([lion(-LION.x, LION.y), lion(LION.x, LION.y)])],
];
const monument = union([parts[0][1], parts[1][1]]);
const lions = parts[2][1];

const bbAll = [monument, lions].map((m) => m.boundingBox());
const min = [0, 1].map((i) => Math.min(...bbAll.map((b) => b.min[i])));
const max = [0, 1].map((i) => Math.max(...bbAll.map((b) => b.max[i])));
const margin = 1.0;
const plate = box(
  max[0] - min[0] + 2 * margin,
  max[1] - min[1] + 2 * margin,
  0.2,
  (min[0] + max[0]) / 2,
  (min[1] + max[1]) / 2,
  -0.2,
);

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
const glbFile = path.join(outDir, "nationaal-monument-dam.glb");
await writeFile(
  glbFile,
  toGlb(parts, "NederPrint generate-dam-monument.mjs (manifold-3d)"),
);

const variants = [
  ["nationaal-monument-dam", union([monument, lions])],
  ["nationaal-monument-dam-grondplaat", union([monument, lions, plate])],
];
const report = {};
for (const [name, solid] of variants) {
  const file = path.join(outDir, `${name}-1-${scale}.stl`);
  const { buffer, triangles } = toStl(
    solid,
    `NederPrint Nationaal Monument Dam 1:${scale} mm Z-up front=-Y`,
  );
  await writeFile(file, buffer);
  const bb = solid.boundingBox();
  report[name] = {
    file,
    status: solid.status(),
    genus: solid.genus(),
    triangles,
    volumeCm3: (solid.volume() * mmPerMetre ** 3) / 1000,
    sizeMm: [0, 1, 2].map((i) =>
      +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1),
    ),
  };
}
// Catalogusitem voor lib/server/landmark-catalog.ts: de GLB zonder grondplaat,
// geplaatst op het PDOK-maaiveld en 0,3 m ingezonken zodat de treden aansluiten.
await writeFile(
  path.join(outDir, "nationaal-monument-dam.json"),
  JSON.stringify(
    {
      name: "Nationaal Monument op de Dam",
      file: "nationaal-monument-dam.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [121391.68, 487330.33],
      xAxis: [-0.453, -0.892],
      groundOffsetMetres: -0.3,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het pyloonhart op pleinniveau in de oorsprong en wijst de voorzijde (Paleis, leeuwen) naar -Y. RD = origin + x*xAxis + y*yAxis met yAxis = xAxis 90 graden linksom. Nodenamen klasse:label bepalen de materiaalklasse.",
      printFiles: [
        `nationaal-monument-dam-1-${scale}.stl`,
        `nationaal-monument-dam-grondplaat-1-${scale}.stl`,
      ],
      realWorld: {
        pylonHeightM: PYLON.h,
        outerStepRadiusM: OUTER_R,
        steps: STEPS,
        wallRadiusM: [WALL.rIn, WALL.rOut],
        wallHeightM: WALL.h,
        niches: NICHES,
        lionPedestalDiameterM: 7,
        lionSpacingM: LION.x * 2,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Nationaal_Monument_op_de_Dam",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/530906",
        "PDOK BGT (wegdeel/straatmeubilair) en luchtfoto, EPSG:28992",
      ],
    },
    null,
    2,
  ),
);
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };
console.log(JSON.stringify(report, null, 2));

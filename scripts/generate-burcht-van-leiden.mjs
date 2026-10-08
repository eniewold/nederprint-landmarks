// Genereert een vereenvoudigd, gesloten 3D-model van de Burcht van Leiden: de
// ronde ringmuur met kantelen en spaarbogen op de motte, de zandstenen poort
// (1651) in de zuidmuur, de kleine noordpoort, de binnenplaats met het
// verhoogde middenplateau, het rondpad, de trap over de heuvel en de voorpoort
// met twee pijlers aan de voet. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus binaire STL's in millimeters om los te printen. De motte zelf zit alleen
// in de STL met heuvel; in de app komt de heuvel uit het PDOK-terrein.
//
//   node scripts/generate-burcht-van-leiden.mjs               # burcht 1:100, met heuvel 1:250
//   node scripts/generate-burcht-van-leiden.mjs --scale 1000  # beide op 1:1000
//
// Assenstelsel: oorsprong in het hart van de ringmuur op het niveau van de
// muurvoet (het plateau van de motte, circa NAP +11,5 m), Z omhoog, de
// hoofdpoort richting -Y (in RD: azimut 329 graden, zuidoost); de trap loopt
// van de poort schuin (17 graden naar -X, in RD azimut 312 graden) naar de
// voorpoort aan de Burgsteeg. De noordpoort ligt op azimut 85 graden.
//
// Bronnen: PDOK BGT (wegdeel/onbegroeidterreindeel, cirkels rond
// 93773,2 / 463802,2; trap en voorpoort uit de betonvlakken van het wegdeel,
// poortrichting uit het verlengde van de trap), PDOK AHN (dtm/dsm 0,5 m: plateau NAP +11,45 m,
// muurtop NAP +17,8 m, binnenplaatsmidden +1,1 m), Wikipedia (doorsnede circa
// 35,5 m, muurhoogte gemiddeld 6,3 m, muurdikte 0,8-0,9 m, motte 12 m boven het
// maaiveld) en Wikimedia Commons-foto's voor kantelen, spaarbogen, poort,
// binnenplaats, trap en voorpoort.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "100"));
// Met de heuvel erbij is het model 85 m breed; op 1:250 past dat op een printbed.
const hillScale = Number(flag("--hill-scale", scale === 100 ? "250" : String(scale)));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "burcht-van-leiden");

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(96);

// ---------- hulpfuncties (meters) ----------
const box = (sx, sy, sz, x = 0, y = 0, z = 0) =>
  Manifold.cube([sx, sy, sz], false).translate([x - sx / 2, y - sy / 2, z]);
const cyl = (h, r0, r1 = r0, x = 0, y = 0, z = 0, segs = 0) =>
  Manifold.cylinder(h, r0, r1, segs, false).translate([x, y, z]);
const sphere = (r, x = 0, y = 0, z = 0, segs = 24) =>
  Manifold.sphere(r, segs).translate([x, y, z]);
// Ring (of ringsector) uit een profiel [r, z] rond de Z-as.
const ring = (profile, sweepDeg = 360, startDeg = 0, segs = 192) =>
  Manifold.revolve(profile, segs, sweepDeg).rotate([0, 0, startDeg]);
// Boogvormige doorgang langs de +X-as (radiaal): rechthoek plus halve cirkel
// erboven, van r0 tot r1, breedte w, aanzet op hoogte h (top op h + w/2).
const archCutter = (r0, r1, w, h, angleDeg) =>
  Manifold.union([
    box(r1 - r0, w, h, (r0 + r1) / 2, 0, 0),
    cyl(r1 - r0, w / 2, w / 2, 0, 0, 0, 48)
      .rotate([0, 90, 0])
      .translate([r0, 0, h]),
  ]).rotate([0, 0, angleDeg]);
const union = (parts) => Manifold.union(parts);

// ---------- maten ----------
const WALL = { rOut: 18.6, rIn: 17.75, top: 5.4 }; // doorsnede binnen 35,5 m
const MERLON = { top: 6.6, count: 44, widthDeg: 4.9 };
const ARCADE = { rIn: 16.3, walkTop: 4.2, arches: 20, archW: 3.6, archH: 1.8 };
const GATE = { angle: 270, halfDeg: 14, rIn: 17.3, rOut: 18.9, h: 8.6 };
const GATE_OPENING = { w: 2.6, h: 3.0 };
const NORTH_GATE = { angle: 26, w: 2.0, h: 2.2 }; // azimut 85 graden in RD
const COURT = { r: ARCADE.rIn, thickness: 0.12 };
const PLATFORM = { r: 7.0, h: 1.1, steps: 5, tread: 0.45 };
const WELL = { x: 9.5, y: -9.5, rOut: 1.2, rIn: 0.9, h: 1.0 }; // luchtfoto, azimut 14
// Het rondpad loopt 0,5 m door onder het plateau: het PDOK-terrein ligt daar
// plaatselijk tot 0,3 m lager dan het bemonsterde rondpad, en zonder motte in
// de GLB zou het pad daar anders zweven.
const PATH = { rIn: WALL.rOut, rOut: 21.5, thickness: 0.1, bottom: -0.5 };
// Motteprofiel: de AHN-mediaan per meter straal, relatief aan het plateau, 0,3 m
// verlaagd en aan de voet (vanaf 32 m) steiler afgesneden. Alleen voor de STL
// met heuvel: in de GLB voor de app zit de motte niet, want het PDOK-terrein
// bevat hem al en het meegemodelleerde talud stak op de plateaurand (tot 0,3 m)
// en aan de heuvelvoet (tot 0,9 m) boven dat terrein uit. Onder de muurvoet ligt
// het PDOK-terrein 0,1-0,5 m boven het bemonsterde rondpad, dus daar ontstaan
// zonder motte geen gaten.
const HILL = [
  [21.5, 0],
  [22, -0.7],
  [24, -1.6],
  [26, -2.6],
  [28, -3.6],
  [30, -4.45],
  [32, -5.3],
  [34, -6.4],
  [36, -7.8],
  [37.5, -9.75],
];
// Onderkant van het model: het maaiveld rond de heuvelvoet ligt gemiddeld
// zo'n 9,75 m onder het plateau (NAP +1 tot +3 m rond NAP +11,45 m).
const HILL_BASE = -9.75;
// Trap: treden vanaf het rondpad onder de poort, 17 graden gedraaid ten
// opzichte van de radiaal (BGT-betonvlak van 22 tot 39 m uit het hart), met
// lage zijmuren. Het hoogteverloop volgt het AHN-maaiveld langs de traplijn
// (meter voor meter vanaf het rondpad, relatief aan het plateau) en ligt 0,8 m
// boven dat maaiveld zodat de trap boven het PDOK-terrein uitkomt.
const STAIR = { width: 3.0, run: 0.7, steps: 27, landing: 3.0, rStart: 21.5, skewDeg: -17, lift: 0.8, wall: 0.35, wallH: 0.9 };
const STAIR_PROFILE = [
  0, -0.43, -0.9, -0.88, -1.27, -1.85, -2.43, -2.91, -3.23, -3.89, -4.27,
  -4.8, -5.25, -5.87, -6.13, -6.85, -7.19, -7.74, -8.1, -8.35, -8.37, -8.39, -8.39,
];
const stairZ = (s) => {
  const i = Math.min(Math.max(s, 0), STAIR_PROFILE.length - 1);
  const k = Math.floor(i);
  const t = i - k;
  const a = STAIR_PROFILE[k];
  const b = STAIR_PROFILE[Math.min(k + 1, STAIR_PROFILE.length - 1)];
  return a + (b - a) * t + STAIR.lift;
};
const stairDir = [
  Math.sin((STAIR.skewDeg * Math.PI) / 180),
  -Math.cos((STAIR.skewDeg * Math.PI) / 180),
];
// Het PDOK-terrein bevat de motte al; bemonster het maaiveld daarom op het
// rondpad om de muur (straal 20 m) in plaats van rond de hele voetafdruk.
const GROUND_SAMPLE_R = 20;
// Voorpoort (1653) aan de voet van de trap, BGT-betonvlakjes op 42-45 m.
const FORE_GATE = { alongStair: 21.5, spacing: 4.4, r: 0.45, h: 3.4, base: -8.4 };

// ---------- motte ----------
// Profiel tegen de klok in: onderkant, talud van buiten naar binnen, plateau.
const hill = ring([[0, HILL_BASE], ...[...HILL].reverse(), [0, 0]], 360, 0, 192);

// ---------- ringmuur met kantelen en spaarbogen ----------
const thinWall = ring([
  [WALL.rIn, 0],
  [WALL.rOut, 0],
  [WALL.rOut, WALL.top],
  [WALL.rIn, WALL.top],
]);
const merlons = union(
  Array.from({ length: MERLON.count }, (_, i) => (i * 360) / MERLON.count)
    .filter((a) => Math.abs(((a - GATE.angle + 540) % 360) - 180) > GATE.halfDeg + 2)
    .map((a) =>
      ring(
        [
          [WALL.rIn, WALL.top - 0.1],
          [WALL.rOut, WALL.top - 0.1],
          [WALL.rOut, MERLON.top],
          [WALL.rIn, MERLON.top],
        ],
        MERLON.widthDeg,
        a - MERLON.widthDeg / 2,
        4,
      ),
    ),
);
// Arcade: pijlers met spaarbogen die de weergang dragen.
let arcade = ring([
  [ARCADE.rIn, 0],
  [WALL.rIn + 0.05, 0],
  [WALL.rIn + 0.05, ARCADE.walkTop],
  [ARCADE.rIn, ARCADE.walkTop],
]);
const arches = union(
  Array.from({ length: ARCADE.arches }, (_, i) => {
    const a = (i * 360) / ARCADE.arches + 9;
    return archCutter(ARCADE.rIn - 0.5, WALL.rIn, ARCADE.archW, ARCADE.archH, a);
  }),
);
arcade = arcade.subtract(arches);

// Hoofdpoort (1651): hoger, iets uitspringend muurvak met een boogdoorgang en
// een natuurstenen omlijsting met pilasters en kroonlijst.
const gateBlock = ring(
  [
    [GATE.rIn, 0],
    [GATE.rOut, 0],
    [GATE.rOut, GATE.h],
    [GATE.rIn, GATE.h],
  ],
  GATE.halfDeg * 2,
  GATE.angle - GATE.halfDeg,
  24,
);
const gateFrame = union([
  box(0.35, 0.6, 5.6, GATE.rOut + 0.1, -2.1, 0),
  box(0.35, 0.6, 5.6, GATE.rOut + 0.1, 2.1, 0),
  box(0.45, 5.4, 0.5, GATE.rOut + 0.1, 0, 5.3),
]).rotate([0, 0, GATE.angle]);
const gateOpening = archCutter(
  ARCADE.rIn - 1,
  GATE.rOut + 1,
  GATE_OPENING.w,
  GATE_OPENING.h,
  GATE.angle,
);
const northOpening = archCutter(
  ARCADE.rIn - 1,
  WALL.rOut + 1,
  NORTH_GATE.w,
  NORTH_GATE.h,
  NORTH_GATE.angle,
);
const well = cyl(WELL.h, WELL.rOut, WELL.rOut, WELL.x, WELL.y, 0, 48).subtract(
  cyl(WELL.h, WELL.rIn, WELL.rIn, WELL.x, WELL.y, 0.3, 48),
);
const ringWall = union([thinWall, merlons, arcade, gateBlock, gateFrame])
  .subtract(gateOpening)
  .subtract(northOpening)
  .add(well);

// ---------- binnenplaats, rondpad en trap ----------
const courtyard = cyl(COURT.thickness, COURT.r, COURT.r, 0, 0, 0, 192);
const platform = union([
  cyl(PLATFORM.h, PLATFORM.r, PLATFORM.r, 0, 0, 0, 96),
  // Halfronde treden aan de poortzijde (-Y), aflopend naar buiten.
  ...Array.from({ length: PLATFORM.steps }, (_, i) => {
    const r = PLATFORM.r + PLATFORM.tread * (i + 1);
    const h = PLATFORM.h - (PLATFORM.h / (PLATFORM.steps + 1)) * (i + 1);
    return cyl(h, r, r, 0, 0, 0, 96).intersect(box(2 * r + 1, r + 1, h + 1, 0, -(r + 1) / 2, 0));
  }),
]);
const outerPath = ring([
  [PATH.rIn, PATH.bottom],
  [PATH.rOut, PATH.bottom],
  [PATH.rOut, PATH.thickness],
  [PATH.rIn, PATH.thickness],
]);
const stairSegment = (s0, s1, top) => {
  const y = -(s0 + s1) / 2;
  const depth = s1 - s0 + 0.02;
  const wallX = STAIR.width / 2 + STAIR.wall / 2;
  return union([
    box(STAIR.width, depth, 2.5, 0, y, top - 2.5),
    box(STAIR.wall, depth, 2.5 + STAIR.wallH, wallX, y, top - 2.5),
    box(STAIR.wall, depth, 2.5 + STAIR.wallH, -wallX, y, top - 2.5),
  ]);
};
const stairLength = STAIR.steps * STAIR.run;
const stair = union([
  ...Array.from({ length: STAIR.steps }, (_, i) =>
    stairSegment(STAIR.run * i, STAIR.run * (i + 1), stairZ(STAIR.run * (i + 1))),
  ),
  // Bordes aan de voet, tot aan de voorpoort.
  stairSegment(stairLength, stairLength + STAIR.landing, stairZ(stairLength)),
])
  .rotate([0, 0, STAIR.skewDeg])
  .translate([0, -STAIR.rStart, 0]);
// Niets onder de onderkant van de motte, zodat de STL met heuvel vlak blijft.
const paving = union([courtyard, platform, outerPath, stair]).intersect(
  box(200, 200, 60, 0, 0, HILL_BASE),
);

// ---------- voorpoort (1653): twee pijlers met beelden ----------
const pillar = (x) =>
  union([
    box(1.2, 1.2, 1.4, x, 0, FORE_GATE.base - 0.8),
    cyl(FORE_GATE.h, FORE_GATE.r, FORE_GATE.r, x, 0, FORE_GATE.base + 0.6, 24),
    box(1.0, 1.0, 0.3, x, 0, FORE_GATE.base + 0.6 + FORE_GATE.h),
    sphere(0.5, x, 0, FORE_GATE.base + 0.6 + FORE_GATE.h + 0.7, 16),
  ]);
const foreGate = union([pillar(-FORE_GATE.spacing / 2), pillar(FORE_GATE.spacing / 2)])
  .rotate([0, 0, STAIR.skewDeg])
  .translate([
    stairDir[0] * FORE_GATE.alongStair,
    -STAIR.rStart + stairDir[1] * FORE_GATE.alongStair,
    0,
  ]);

// Onderdelen per materiaalklasse; de nodenaam `klasse:label` stuurt de catalogus.
// Zonder de motte: die komt in de app uit het PDOK-terrein.
const parts = [
  ["road:binnenplaats, pad en trap", paving],
  ["building:ringmuur en poorten", ringWall],
  ["building:voorpoort", foreGate],
];
const burcht = union([ringWall, courtyard, platform]);
const everything = union([hill, paving, ringWall, foreGate]);

// ---------- STL-export ----------
function toStl(manifold, label, mmPerMetre) {
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
const glbFile = path.join(outDir, "burcht-van-leiden.glb");
await writeFile(
  glbFile,
  toGlb(parts, "NederPrint generate-burcht-van-leiden.mjs (manifold-3d)"),
);

const variants = [
  ["burcht-van-leiden", burcht, scale],
  ["burcht-van-leiden-heuvel", everything, hillScale],
];
const report = {};
for (const [name, solid, variantScale] of variants) {
  const mmPerMetre = 1000 / variantScale;
  const file = path.join(outDir, `${name}-1-${variantScale}.stl`);
  const { buffer, triangles } = toStl(
    solid,
    `NederPrint Burcht van Leiden 1:${variantScale} mm Z-up front=-Y`,
    mmPerMetre,
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
// Catalogusitem voor lib/server/landmark-catalog.ts: de GLB wordt met de
// muurvoet op het PDOK-plateau gezet (bemonsterd op het rondpad, zonder
// inzinking); de heuvel eronder is de motte uit het PDOK-terrein.
await writeFile(
  path.join(outDir, "burcht-van-leiden.json"),
  JSON.stringify(
    {
      name: "Burcht van Leiden",
      file: "burcht-van-leiden.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [93773.2, 463802.2],
      xAxis: [0.515, 0.857],
      // Het rondpad ligt in het PDOK-terrein al iets onder het AHN-plateau;
      // niet extra inzinken, anders verdwijnen trap en muurvoet in het terrein.
      groundOffsetMetres: 0,
      groundSamplePoints: [
        [GROUND_SAMPLE_R, 0],
        [-GROUND_SAMPLE_R, 0],
        [0, GROUND_SAMPLE_R],
        [0, -GROUND_SAMPLE_R],
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de ringmuur op de muurvoet (het plateau van de motte, NAP +11,45 m) in de oorsprong op z = 0 (de motte zelf zit niet in de GLB; die komt uit het PDOK-terrein), de trap loopt over de helling af tot z = -9,75 (straatniveau rond de heuvelvoet) en de hoofdpoort wijst naar -Y (azimut 329 graden, zuidoost) en de trap loopt daarvandaan 17 graden gedraaid (azimut 312 graden) naar de voorpoort aan de Burgsteeg. Het maaiveld wordt op het rondpad (straal 20 m) bemonsterd, zodat de muurvoet op het PDOK-plateau staat. RD = origin + x*xAxis + y*yAxis met yAxis = xAxis 90 graden linksom. Nodenamen klasse:label bepalen de materiaalklasse.",
      printFiles: [
        `burcht-van-leiden-1-${scale}.stl`,
        `burcht-van-leiden-heuvel-1-${hillScale}.stl`,
      ],
      realWorld: {
        wallInnerDiameterM: WALL.rIn * 2,
        wallOuterDiameterM: WALL.rOut * 2,
        wallThicknessM: +(WALL.rOut - WALL.rIn).toFixed(2),
        wallHeightM: MERLON.top,
        merlons: MERLON.count,
        arches: ARCADE.arches,
        gateHeightM: GATE.h,
        plateauAboveStreetM: -HILL_BASE,
        motteFootRadiusM: 37.5,
        courtyardPlatformM: PLATFORM.h,
        stairSteps: STAIR.steps,
        stairDropM: -STAIR_PROFILE[STAIR_PROFILE.length - 1],
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Burcht_van_Leiden",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/532258",
        "PDOK BGT (wegdeel/onbegroeidterreindeel), AHN dtm/dsm 0,5 m en luchtfoto, EPSG:28992",
        "Wikimedia Commons: Category:Burcht van Leiden",
      ],
    },
    null,
    2,
  ),
);
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
console.log(JSON.stringify(report, null, 2));

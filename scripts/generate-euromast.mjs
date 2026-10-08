// Genereert een vereenvoudigd, gesloten 3D-model van de Euromast in Rotterdam:
// de betonnen schacht van Maaskant (1960) met de scheepsbrug, het asymmetrische
// Kraaiennest en het uitkijkplatform, plus de stalen Space Tower (1970) met
// topbehuizing en antenne. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-euromast.mjs             # 1:1000 (standaard)
//   node scripts/generate-euromast.mjs --scale 2000
//
// Een STL op 1:100 zou 1,85 m hoog worden; daarom is 1:1000 hier de standaard.
//
// Assenstelsel: oorsprong in het hart van de schacht op de vloer van het
// entreepaviljoen (maaiveld, circa NAP +3,0 m), Z omhoog, +X naar het oosten en
// +Y naar het noorden (RD-richtingen, geen rotatie).
//
// Bronnen: BAG-pand 0599100000661084 (voetafdruk van het paviljoen met de
// overstek, straal 11,8 m) en BGT-pand (plint op maaiveld, straal 10,5 m); AHN
// DSM/DTM 0,5 m (PDOK WCS) voor maaiveld, dak van het Kraaiennest, bovenverdieping,
// uitkijkplatform en top van de Space Tower, en voor de plattegrond van het
// Kraaiennest; Wikipedia, architectuur.org en wederopbouwrotterdam.nl voor de
// schacht (9 m), de scheepsbrug (32 m), het Kraaiennest (29 m) en de Space Tower
// (2,5 m, 185 m); Wikimedia Commons-foto's voor de opstand.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "euromast");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(64);

// ---------- hulpfuncties (meters) ----------
const cyl = (h, r0, r1 = r0, x = 0, y = 0, z = 0, segs = 0) =>
  Manifold.cylinder(h, r0, r1, segs, false).translate([x, y, z]);
const box = (sx, sy, sz, x = 0, y = 0, z = 0) =>
  Manifold.cube([sx, sy, sz], false).translate([x - sx / 2, y - sy / 2, z]);
const union = (parts) => Manifold.union(parts);
// Uittrekken met een geschaalde bovenkant, geschaald rond de schachtas. Een
// enkel getal als scaleTop schaalt in manifold-3d alleen X, vandaar het paar.
const extrudeScaled = (polygons, height, scaleTop) =>
  Manifold.extrude(polygons, height, 0, 0, [scaleTop, scaleTop]);

// Periodieke Catmull-Rom-interpolatie van een straal per 10 graden (vanaf het
// oosten, tegen de klok in) naar een gladde polygoon rond de schachtas.
function polarOutline(radii, scaleFactor = 1, samples = 144) {
  const n = radii.length;
  const points = [];
  for (let s = 0; s < samples; s++) {
    const t = (s / samples) * n;
    const i = Math.floor(t);
    const u = t - i;
    const p0 = radii[(i - 1 + n) % n];
    const p1 = radii[i % n];
    const p2 = radii[(i + 1) % n];
    const p3 = radii[(i + 2) % n];
    const r =
      0.5 *
      (2 * p1 +
        (-p0 + p2) * u +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u +
        (-p0 + 3 * p1 - 3 * p2 + p3) * u * u * u);
    const angle = (s / samples) * 2 * Math.PI;
    points.push([r * scaleFactor * Math.cos(angle), r * scaleFactor * Math.sin(angle)]);
  }
  return [points];
}

// ---------- hoofdmaten ----------
// Plattegrond van het Kraaiennest (dakrand) en de glazen bovenverdieping uit
// het AHN-DSM: 95e percentiel van de straal per sector van 10 graden boven
// NAP +90 m respectievelijk +97,5 m, min 0,2 m voor de rasterrand, licht
// gladgestreken. Het Kraaiennest steekt 15-16 m uit naar het zuiden en
// zuidwesten (de Maas) en 11-12 m naar het noorden en oosten: 28,5 m in de
// langste richting, 29 m volgens de bronnen.
const CROWS_NEST_RADII = [
  10.9, 10.8, 10.9, 11.2, 11.6, 12.0, 12.3, 12.5, 12.4, 12.4, 12.4, 12.2,
  12.1, 11.9, 11.9, 12.0, 12.4, 12.8, 13.4, 14.1, 14.9, 15.5, 15.7, 15.6,
  15.3, 15.2, 15.4, 15.9, 16.1, 15.9, 15.0, 13.9, 13.0, 12.2, 11.4, 11.0,
];
const UPPER_DECK_RADII = [
  8.0, 8.3, 8.2, 8.3, 8.6, 8.9, 9.1, 9.2, 9.2, 9.3, 9.3, 9.0,
  8.8, 8.7, 8.7, 8.4, 7.9, 8.0, 8.6, 9.3, 9.9, 10.3, 10.4, 10.1,
  9.9, 9.8, 9.8, 9.9, 10.1, 10.0, 9.5, 8.8, 8.2, 7.7, 7.3, 7.4,
];

const PAVILION = { plinthRadius: 10.5, plinthTop: 1.2, radius: 11.8, top: 4.2 };
const SHAFT_RADIUS = 4.5; // betonnen schacht van 9 m doorsnede
const SHIP_BRIDGE = { floor: 32, top: 36, width: 7, reach: 8.2 }; // naar het zuiden
const CROWS_NEST = {
  underside: 81.75, // aansluiting van de onderkant op de schacht
  wallBottom: 84.25,
  roof: 92.95, // AHN: NAP +95,9 m
  wallBottomScale: 0.9, // de glaswand helt naar buiten, zoals een scheepsbrug
};
const UPPER_DECK_TOP = 96.5; // AHN: NAP +99,5 m
const PLATFORM = { bottom: 103.6, radius: 6.2, deck: 105.8, top: 107.3 }; // AHN: NAP +110,3 m
// Trappenhuis aan de zuidzuidwestkant tussen Kraaiennest en platform, tegen de
// schacht aan (AHN: tot 7,8 m uit het hart).
const STAIR = { radius: 1.6, distance: 6.0, azimuthDeg: 250, top: 106 };
const SPACE_TOWER = { radius: 1.25, top: 162 };
const TOP_HOUSING = { radius: 3.2, top: 167 };
const DISHES = { radius: 2.4, bottom: 168.5, top: 171 };
const ANTENNA_FRAME = { radius: 1.6, top: 172.3 }; // AHN: NAP +175,3 m
const SPIRE = { bottomRadius: 0.5, topRadius: 0.25, top: 185 };

// ---------- entreepaviljoen ----------
// Bakstenen plint op de BGT-voetafdruk, daarboven de glazen ring met overstek
// tot de BAG-voetafdruk en een witte dakrand.
const pavilion = union([
  cyl(PAVILION.plinthTop, PAVILION.plinthRadius, PAVILION.plinthRadius, 0, 0, 0, 96),
  cyl(PAVILION.top - PAVILION.plinthTop, PAVILION.radius, PAVILION.radius, 0, 0, PAVILION.plinthTop, 96),
]);

// ---------- schacht, scheepsbrug en Kraaiennest ----------
const shaft = cyl(PLATFORM.bottom, SHAFT_RADIUS);
const shipBridge = box(
  SHIP_BRIDGE.width,
  SHIP_BRIDGE.reach,
  SHIP_BRIDGE.top - SHIP_BRIDGE.floor,
  0,
  -SHIP_BRIDGE.reach / 2,
  SHIP_BRIDGE.floor,
);
// Onderkant: van binnen de schacht schuin naar de onderrand van de glaswand;
// de voet valt met 0,28 keer de dakrand geheel binnen de schachtdoorsnede.
const undersideScale = 0.28;
const crowsNestUnderside = extrudeScaled(
  polarOutline(CROWS_NEST_RADII, undersideScale),
  CROWS_NEST.wallBottom - CROWS_NEST.underside,
  CROWS_NEST.wallBottomScale / undersideScale,
).translate([0, 0, CROWS_NEST.underside]);
const crowsNestWall = extrudeScaled(
  polarOutline(CROWS_NEST_RADII, CROWS_NEST.wallBottomScale),
  CROWS_NEST.roof - CROWS_NEST.wallBottom,
  1 / CROWS_NEST.wallBottomScale,
).translate([0, 0, CROWS_NEST.wallBottom]);
const upperDeck = Manifold.extrude(
  polarOutline(UPPER_DECK_RADII),
  UPPER_DECK_TOP - CROWS_NEST.roof,
).translate([0, 0, CROWS_NEST.roof]);
const stairAngle = (STAIR.azimuthDeg * Math.PI) / 180;
const stair = cyl(
  STAIR.top - CROWS_NEST.roof,
  STAIR.radius,
  STAIR.radius,
  STAIR.distance * Math.cos(stairAngle),
  STAIR.distance * Math.sin(stairAngle),
  CROWS_NEST.roof,
  32,
);
const platform = union([
  cyl(PLATFORM.deck - PLATFORM.bottom, PLATFORM.radius, PLATFORM.radius, 0, 0, PLATFORM.bottom),
  cyl(PLATFORM.top - PLATFORM.bottom, SHAFT_RADIUS, SHAFT_RADIUS, 0, 0, PLATFORM.bottom),
]);

// ---------- Space Tower ----------
const spaceTower = union([
  cyl(SPACE_TOWER.top - PLATFORM.top + 0.1, SPACE_TOWER.radius, SPACE_TOWER.radius, 0, 0, PLATFORM.top - 0.1, 32),
  cyl(TOP_HOUSING.top - SPACE_TOWER.top, TOP_HOUSING.radius, TOP_HOUSING.radius, 0, 0, SPACE_TOWER.top, 48),
  cyl(ANTENNA_FRAME.top - TOP_HOUSING.top, ANTENNA_FRAME.radius, ANTENNA_FRAME.radius, 0, 0, TOP_HOUSING.top, 32),
  cyl(DISHES.top - DISHES.bottom, DISHES.radius, DISHES.radius, 0, 0, DISHES.bottom, 32),
  cyl(SPIRE.top - ANTENNA_FRAME.top, SPIRE.bottomRadius, SPIRE.topRadius, 0, 0, ANTENNA_FRAME.top, 16),
]);

const tower = union([
  shaft,
  shipBridge,
  crowsNestUnderside,
  crowsNestWall,
  upperDeck,
  stair,
  platform,
  spaceTower,
]);

const parts = [
  ["building:paviljoen", pavilion],
  ["building:toren", tower],
];
const printModel = union([pavilion, tower]);

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
const glbFile = path.join(outDir, "euromast.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-euromast.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `euromast-1-${scale}.stl`);
const { buffer, triangles } = toStl(printModel, `NederPrint Euromast Rotterdam 1:${scale} mm Z-up +Y=N`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Het maaiveld wordt vlak
// naast het paviljoen bemonsterd: rond de hele voetafdruk (tot 16 m door het
// Kraaiennest) zou de lader het talud naar de parkvijver ten oosten (NAP -2 m)
// kunnen raken. De PDOK-reconstructie van het BAG-pand wordt verborgen.
await writeFile(
  path.join(outDir, "euromast.json"),
  JSON.stringify(
    {
      name: "Euromast",
      file: "euromast.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [91651.25, 435615.7],
      xAxis: [1, 0],
      groundOffsetMetres: -0.3,
      groundSamplePoints: [
        [13, 0],
        [0, 13],
        [-13, 0],
        [0, -13],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0599100000661084"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de schacht op de vloer van het entreepaviljoen in de oorsprong, +X oost en +Y noord. Het Kraaiennest steekt het verst uit naar het zuiden en zuidwesten, de scheepsbrug op 32 m wijst naar het zuiden. Het maaiveld wordt op 13 m uit het hart bemonsterd. Vervangt de PDOK-reconstructie van BAG-pand 0599100000661084. Nodenamen klasse:label bepalen de materiaalklasse.",
      printFiles: [`euromast-1-${scale}.stl`],
      realWorld: {
        totalHeightM: SPIRE.top,
        shaftDiameterM: SHAFT_RADIUS * 2,
        shipBridgeFloorM: SHIP_BRIDGE.floor,
        crowsNestUndersideM: CROWS_NEST.underside,
        crowsNestRoofM: CROWS_NEST.roof,
        crowsNestExtentM: [
          +(CROWS_NEST_RADII[9] + CROWS_NEST_RADII[27]).toFixed(1),
          +(CROWS_NEST_RADII[0] + CROWS_NEST_RADII[18]).toFixed(1),
        ],
        upperDeckTopM: UPPER_DECK_TOP,
        platformTopM: PLATFORM.top,
        spaceTowerDiameterM: SPACE_TOWER.radius * 2,
        topHousingM: [SPACE_TOWER.top, TOP_HOUSING.top],
        antennaFrameTopM: ANTENNA_FRAME.top,
        pavilionRadiusM: PAVILION.radius,
        pavilionHeightM: PAVILION.top,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Euromast",
        "https://en.wikipedia.org/wiki/Euromast",
        "https://www.architectuur.org/bouwwerk/321/Euromast.html",
        "https://wederopbouwrotterdam.nl/en/articles/euromast",
        "PDOK BAG pand 0599100000661084 en BGT pand (voetafdruk paviljoen), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor maaiveld, Kraaiennest, bovenverdieping, platform en top",
        "Wikimedia Commons: Euromast @ Rotterdam (30546199846).jpg, Euromast @ Parkhaven @ Rotterdam (30604597745).jpg, Euromast @ Rotterdam (29972520534).jpg, Euromast @ Rotterdam (29970699683).jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

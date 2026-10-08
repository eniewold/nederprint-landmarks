// Genereert een vereenvoudigd, gesloten 3D-model van het GelreDome in Arnhem
// (Alynia Architecten, 1998): de rechthoekige kom met vier tribunedaken, het
// schuifdak van twee tongewelven in de gesloten stand die het AHN toont, de
// rails en spanten langs het veld, de lagere hoekbouwdelen en de halfronde
// uitbouw aan de westnoordwestkant. Alle vormen zijn glad en gefit op het AHN;
// het Mapbox-landmarkmodel is niet gebruikt. Alle maten in het script zijn
// meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-gelredome.mjs              # 1:1000 (standaard)
//   node scripts/generate-gelredome.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van het veld op straatniveau (NAP +10,6 m),
// Z omhoog. +X loopt langs de lengteas van het veld en de tongewelven naar het
// noordnoordoosten (RD-richting 70,3 graden), +Y dwars daarop naar het
// westnoordwesten. De zuidtribune ligt aan de -X-kant.
//
// Bronnen: BAG-pand 0202100000222215 (contour: hoekbouwdelen, uitbouw, as en
// hart); AHN DSM/DTM 0,5 m (PDOK WCS): tongewelven (cirkelboog, rms 2 cm),
// tribunedaken (hellend vlak, rms 1 cm) met hun dakranden, rails, spanten,
// hoekbouwdelen, uitbouw en straatniveau; Wikipedia (veld 105 × 68 m, schuifdak
// van twee koepels op rails, veld rijdt onder de zuidtribune naar buiten);
// PDOK luchtfoto (spanten en rails). Geschat: de breedte van de vakwerkrails en
// -spanten (massief gemaakt op de 90e percentiel van het AHN) en hoe ver ze aan
// de uiteinden doorlopen.
//
// Stand van het schuifdak: het AHN toont het dak dicht (beide gewelven boven
// het veld), de PDOK-luchtfoto toont het open met het veld buiten het stadion.
// Het model volgt het AHN. Het uitgereden veld ligt in het AHN op maaiveldhoogte
// (NAP +10,7 m, gelijk met de omgeving) en is daarom niet gemodelleerd.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "gelredome");
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
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Polygoon in het YZ-vlak (punten als [y, z]), uitgetrokken langs X van x0 tot x1.
const profileX = (points, x0, x1) => profileY(points, -x1, -x0).rotate([0, 0, 90]);
const prism = (polys, z0, z1) =>
  Manifold.extrude(new CrossSection(polys.map(ccw)), z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
const mirrorX = (m) => m.mirror([1, 0, 0]);
const mirrorY = (m) => m.mirror([0, 1, 0]);

// ---------- maten (z = NAP - 10,6 m) ----------
const ORIGIN = [189755.563, 441720.155];
const X_AXIS = [0.3371, 0.94147]; // RD-richting 70,3 graden, langs veld en gewelven
const NAP = (h) => h - 10.6;
// Alle onderdelen beginnen op dezelfde onderkant, 1 m onder straatniveau.
const BASE = NAP(9.6);

// BAG-contour van pand 0202100000222215 in RD.
const BAG_RD = [
  [189808.25, 441626.42], [189856.39, 441759.16], [189840.41, 441764.84], [189831.93, 441782.27],
  [189837.49, 441797.83], [189741.49, 441832.1], [189735.94, 441816.61], [189718.39, 441808.27],
  [189702.88, 441813.82], [189688.58, 441773.94], [189681.76, 441768.15], [189676.31, 441761.44],
  [189672.3, 441754.23], [189669.56, 441746.58], [189668.14, 441738.47], [189668.03, 441729.91],
  [189669.67, 441721.12], [189655.32, 441681.18], [189670.8, 441675.62], [189679.18, 441657.91],
  [189673.7, 441642.49], [189682.83, 441639.22], [189687.24, 441637.63], [189756.61, 441612.77],
  [189769.57, 441608.13], [189775.13, 441623.58], [189792.8, 441631.93],
];
const axisLength = Math.hypot(...X_AXIS);
const [ex, ey] = X_AXIS.map((c) => c / axisLength);
const BAG = BAG_RD.map(([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [dx * ex + dy * ey, -dx * ey + dy * ex];
});

// Hoekbouwdelen: de hele BAG-contour tot NAP +21,8 m (AHN, vlak).
const CORNER_TOP = 21.8;
// Uitbouw aan de +Y-kant (BAG-cirkelsegment), dak op NAP +29,4 m, met een
// trappenhuis tot +36,5 m tegen de lange tribune.
const ANNEX = { halfX: 28.1, fromY: 70, top: 29.4 };
const STAIR = { x0: -5, x1: 3.5, y0: 80, y1: 85.5, top: 36.5 };
// Lange tribunes (|y| 45,5 tot 81,6 m, |x| ≤ 61 m): dak hellend van +37,21 m
// aan de veldkant naar +36,27 m op |y| 78,1 m, daarna een schuine dakrand.
const LONG = { inner: 45.5, eave: 78.1, edge: 80.4, wall: 81.6, halfX: 61, zInner: 37.21, zEave: 36.27, zEdge: 33.6, zWall: 29.5 };
// Korte tribunes (|x| 64,8 tot 101 m, |y| ≤ 41 m): +37,35 m naar +36,27 m.
const SHORT = { inner: 64.8, eave: 97.6, edge: 100.3, wall: 101, halfY: 41, zInner: 37.35, zEave: 36.27, zEdge: 33.4, zWall: 29.5 };
// Schuifdak: twee tongewelven als cirkelboog (AHN, rms 2 cm): middelpunt op
// |y| 22,95 m en NAP +32,22 m, straal 21,13 m, top +53,36 m. De gewelven
// lopen tot |x| 62 m; tussen beide een goot op +41,8 m met een naad tot +42,8 m.
const ARC = { yc: 22.95, zc: 32.22, r: 21.13 };
const VAULT = { halfX: 62, foot: 41.75, ledge: 43.2, ledgeZ: 41.7, outer: 45.5, outerZ: 37.2, seamHalf: 1.25, seamZ: 42.8, gutterZ: 41.8 };
// Rails onder de gewelfuiteinden (vakwerk, massief): |x| 62 tot 64,8 m tot
// +41,8 m over het veld; boven de lange tribunes |x| 61 tot 64,5 m tot +36,5 m,
// buiten de gevel aflopend tot +27 m op |y| 84 m.
const RAIL = { x0: 62, x1: 64.8, top: 41.8 };
const RAIL_END = { x0: 61, x1: 64.5, top: 36.5, from: 80, end: 84, endTop: 27 };
// Vakwerkspanten langs de zijkanten van de korte tribunes: |y| 41 tot 44,8 m,
// |x| 64,8 tot 99 m, tot +38,3 m (90e percentiel AHN).
const TRUSS = { y0: 41, y1: 44.8, x0: 64.8, x1: 99, top: 38.3 };
// Lichtstraat op het dak van de zuidtribune (+37,7 m).
const SKYLIGHT = { x0: -92, x1: -85.75, y0: -8, y1: 8.3, top: 37.7 };

// ---------- stadion ----------
const corners = prism([BAG], BASE, NAP(CORNER_TOP));
const annex = prism([BAG], BASE, NAP(ANNEX.top)).intersect(
  box(-ANNEX.halfX, ANNEX.halfX, ANNEX.fromY, 100, BASE - 1, NAP(60)),
);
const stair = box(STAIR.x0, STAIR.x1, STAIR.y0, STAIR.y1, BASE, NAP(STAIR.top));

const longProfile = [
  [LONG.inner, BASE],
  [LONG.wall, BASE],
  [LONG.wall, NAP(LONG.zWall)],
  [LONG.edge, NAP(LONG.zEdge)],
  [LONG.eave, NAP(LONG.zEave)],
  [LONG.inner, NAP(LONG.zInner)],
];
const longStand = profileX(longProfile, -LONG.halfX, LONG.halfX);
const shortProfile = [
  [SHORT.inner, BASE],
  [SHORT.wall, BASE],
  [SHORT.wall, NAP(SHORT.zWall)],
  [SHORT.edge, NAP(SHORT.zEdge)],
  [SHORT.eave, NAP(SHORT.zEave)],
  [SHORT.inner, NAP(SHORT.zInner)],
];
const shortStand = profileY(shortProfile, -SHORT.halfY, SHORT.halfY);

// Dwarsprofiel van het schuifdak van |y| = -45,5 tot 45,5 m.
const arcZ = (y) => ARC.zc + Math.sqrt(Math.max(0, ARC.r ** 2 - (Math.abs(y) - ARC.yc) ** 2));
const arcHalf = Math.sqrt(ARC.r ** 2 - (VAULT.foot - ARC.zc) ** 2);
const arcIn = ARC.yc - arcHalf; // 4,09 m
const arcOut = ARC.yc + arcHalf; // 41,81 m
const vaultHalf = [];
vaultHalf.push([VAULT.outer, NAP(VAULT.outerZ)], [VAULT.ledge, NAP(VAULT.ledgeZ)]);
const ARC_STEPS = 64;
for (let k = 0; k <= ARC_STEPS; k++) {
  // Gelijke hoekstappen langs de boog, van buiten naar binnen.
  const a0 = Math.atan2(VAULT.foot - ARC.zc, arcOut - ARC.yc);
  const a1 = Math.PI - a0;
  const a = a0 + ((a1 - a0) * k) / ARC_STEPS;
  const y = ARC.yc + ARC.r * Math.cos(a);
  vaultHalf.push([y, NAP(ARC.zc + ARC.r * Math.sin(a))]);
}
vaultHalf.push([VAULT.seamHalf, NAP(VAULT.gutterZ)], [VAULT.seamHalf, NAP(VAULT.seamZ)]);
const vaultProfile = [
  [-VAULT.outer, BASE],
  [VAULT.outer, BASE],
  ...vaultHalf,
  ...[...vaultHalf].reverse().map(([y, z]) => [-y, z]),
];
const vaults = profileX(vaultProfile, -VAULT.halfX, VAULT.halfX);

const rail = box(RAIL.x0, RAIL.x1, -VAULT.outer, VAULT.outer, BASE, NAP(RAIL.top));
const railEnd = profileX(
  [
    [VAULT.outer - 0.5, BASE],
    [RAIL_END.end, BASE],
    [RAIL_END.end, NAP(RAIL_END.endTop)],
    [RAIL_END.from, NAP(RAIL_END.top)],
    [VAULT.outer - 0.5, NAP(RAIL_END.top)],
  ],
  RAIL_END.x0,
  RAIL_END.x1,
);
const truss = box(TRUSS.x0, TRUSS.x1, TRUSS.y0, TRUSS.y1, BASE, NAP(TRUSS.top));
const skylight = box(SKYLIGHT.x0, SKYLIGHT.x1, SKYLIGHT.y0, SKYLIGHT.y1, BASE, NAP(SKYLIGHT.top));

const quad = (m) => [m, mirrorX(m), mirrorY(m), mirrorX(mirrorY(m))];
const stadium = Manifold.union([
  corners,
  annex,
  stair,
  longStand,
  mirrorY(longStand),
  shortStand,
  mirrorX(shortStand),
  vaults,
  rail,
  mirrorX(rail),
  ...quad(railEnd),
  ...quad(truss),
  skylight,
]);
const nodes = [["building:stadion", stadium]];
const printModel = stadium;

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
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "gelredome.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-gelredome.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (NAP +9,6 m) op het printbed.
const stlFile = path.join(outDir, `gelredome-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint GelreDome 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
await writeFile(
  path.join(outDir, "gelredome.json"),
  JSON.stringify(
    {
      name: "GelreDome",
      file: "gelredome.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Straten en pleinen vlak langs de gevels (NAP +10,5 tot +10,6 m), niet
      // de sleuf rond het uitgereden veld voor de zuidtribune (NAP +9,4 m).
      groundSamplePoints: [
        [0, -90],
        [0, 96],
        [108, 0],
        [-90, 70],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0202100000222215"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van het veld op straatniveau (NAP +10,6 m) in de oorsprong, +X langs de lengteas van het veld en de tongewelven naar het noordnoordoosten (RD-richting 70,3 graden) en +Y dwars daarop. Het stadion is opgebouwd uit gladde vormen die op het AHN zijn gefit: de vier tribunedaken met schuine dakrand, het schuifdak als twee cirkelvormige tongewelven in de gesloten stand van het AHN, de rails en vakwerkspanten, de hoekbouwdelen en de uitbouw uit de BAG-contour. Vervangt de PDOK-reconstructie van BAG-pand 0202100000222215.",
      printFiles: [`gelredome-1-${scale}.stl`],
      realWorld: {
        pitchM: [105, 68],
        footprintM: [202, 174],
        roofState: "dicht (AHN)",
        vaultTopNapM: +(ARC.zc + ARC.r).toFixed(2),
        vaultArc: ARC,
        vaultSpanM: +(arcOut - arcIn).toFixed(2),
        vaultLengthM: VAULT.halfX * 2,
        standRoofNapM: [LONG.zEave, LONG.zInner],
        cornerTopNapM: CORNER_TOP,
        streetNapM: 10.6,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/GelreDome",
        "PDOK BAG pand 0202100000222215, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: tongewelven, tribunedaken, dakranden, rails, spanten, hoekbouwdelen, uitbouw en straatniveau",
        "PDOK luchtfoto (Actueel_orthoHR): rails, vakwerkspanten en de open stand van het schuifdak",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van station Leiden
// Centraal: de stationshal (1996) met de grote glazen kap als flauw zadeldak
// dwars over de sporen, het lagere deel aan de centrumzijde met de
// middenstrook en de gebogen gevel, de acht vakwerkspanten die als
// pijlpunten over de kap lopen, en de drie lange perronkappen langs de
// sporen (profiel: elk een constante doorsnede over de hele lengte, een dak
// op een middenkolom). Alle
// maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, één node per onderdeel met de materiaalklasse in de nodenaam)
// als catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-station-leiden-centraal.mjs              # 1:2000 (standaard)
//   node scripts/generate-station-leiden-centraal.mjs --scale 1000
//
// Printbaar op 1:1000 en 1:2000 zonder steun: de hal is dicht tot de
// onderkant (de kap over de sporen is in werkelijkheid open), de spanten
// staan op de kap of op de perronkappen, de perronkappen hebben een
// onderkant onder 45 graden naar een middenwand van 1,8 m en er kraagt
// niets uit.
//
// Assenstelsel: oorsprong op RD (93084,9, 464616,2), het zwaartepunt van de
// BAG-contour van de stationshal, op het maaiveld van het Stationsplein (NAP
// +0,9 m), Z omhoog. +X loopt langs de sporen naar het noordoosten
// (RD-richting 50 graden, richting Haarlem), +Y naar het noordwesten, naar de
// zeezijde.
//
// Bronnen: BAG-pand 0546100000051298 (contour van de stationshal); AHN
// DSM/DTM 0,5 m (PDOK WCS) in een stelsel langs de sporen: het dwarsprofiel
// van de kap over de sporen (goten NAP +13,0 en +13,5 m, nok +19,2 m), het
// deel aan de centrumzijde (+13,3 m, middenstrook tot +16 m), de perronkappen
// (breedte, lengte en bovenkant +10,3 tot +10,5 m, per blok van 20 m
// gecontroleerd), de spanten (van +11 m bij de punt van de perronkap tot
// +22,5 m naast de nok), het spoorniveau (+5,3 m) en het maaiveld;
// Wikipedia; PDOK luchtfoto (de spanten en de lengte van de perronkappen).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "station-leiden-centraal");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- stelsel (s langs de sporen, t naar de zeezijde; hoogtes in NAP) ----------
const ANGLE = (50 * Math.PI) / 180;
const U = [Math.cos(ANGLE), Math.sin(ANGLE)];
const ORIGIN = [93084.9, 464616.2];
const GROUND_NAP = 0.9;
const z = (nap) => nap - GROUND_NAP;
const BASE = -0.5;

// BAG-pand 0546100000051298 in (s, t).
const OUTLINE = [
  [39.82, -42.76], [40.69, -42.31], [41.55, -41.85], [42.41, -41.38], [43.27, -40.89], [44.12, -40.40], [45.09, -39.80],
  [48.42, -37.67], [47.56, -36.06], [48.90, -35.10], [50.01, -34.35], [51.66, -33.10], [53.21, -31.84], [54.48, -30.74],
  [55.39, -29.97], [56.24, -29.24], [56.15, -28.54], [52.38, -24.74], [52.27, -18.19], [49.00, -18.30], [48.99, -14.46],
  [31.41, -14.53], [31.39, -11.47], [31.38, -6.96], [31.37, -5.25], [35.62, -4.01], [45.14, -5.25], [45.18, 6.77],
  [35.31, 5.66], [31.35, 6.86], [31.34, 8.38], [31.32, 14.00], [31.32, 14.39], [31.30, 19.04], [31.30, 19.44],
  [31.28, 24.96], [31.27, 26.68], [35.08, 27.87], [45.13, 26.82], [45.06, 32.76], [44.99, 38.70], [35.06, 37.65],
  [31.25, 38.91], [31.24, 40.33], [31.20, 44.86], [31.17, 48.91], [31.16, 50.27], [10.81, 50.17], [10.76, 48.68],
  [10.69, 46.56], [-4.08, 46.53], [-4.20, 46.70], [-4.17, 48.51], [-4.15, 50.02], [-8.54, 54.45], [-19.18, 54.37],
  [-19.18, 55.31], [-19.38, 55.32], [-19.38, 54.82], [-19.38, 54.33], [-21.83, 54.34], [-22.45, 54.26], [-22.74, 54.12],
  [-23.02, 53.97], [-23.29, 53.80], [-23.55, 53.62], [-23.79, 53.42], [-24.03, 53.20], [-24.49, 52.68], [-24.70, 52.39],
  [-24.95, 52.08], [-25.20, 51.79], [-25.48, 51.50], [-25.77, 51.24], [-26.08, 50.99], [-26.40, 50.76], [-26.73, 50.55],
  [-27.08, 50.36], [-27.44, 50.19], [-27.80, 50.05], [-28.17, 49.92], [-28.54, 49.82], [-28.91, 49.74], [-29.28, 49.68],
  [-29.65, 49.64], [-30.03, 49.62], [-30.41, 49.63], [-30.78, 49.65], [-30.75, 48.33], [-24.98, 48.28], [-25.04, 44.68],
  [-25.11, 40.07], [-25.14, 38.52], [-29.01, 37.31], [-38.81, 38.53], [-38.72, 37.99], [-38.81, 26.71], [-38.76, 26.40],
  [-28.75, 27.60], [-25.00, 26.44], [-25.00, 25.07], [-24.98, 18.83], [-24.97, 14.23], [-24.96, 8.27], [-24.95, 6.57],
  [-28.72, 5.46], [-39.44, 6.60], [-39.42, -5.32], [-28.60, -4.28], [-24.90, -5.42], [-24.89, -7.19], [-24.87, -11.78],
  [-24.84, -16.87], [-20.92, -17.11], [-20.86, -18.88], [-40.27, -18.91], [-40.26, -26.60], [-20.67, -26.57], [-20.66, -31.78],
  [-53.22, -31.85], [-53.23, -34.19], [-53.23, -34.51], [-53.25, -36.87], [-52.18, -36.61], [-44.12, -42.76], [-41.56, -38.51],
  [-40.16, -39.46], [-39.93, -39.13], [-39.80, -38.94], [-35.08, -41.72], [-31.42, -43.61], [-27.51, -45.35], [-27.04, -45.56],
  [-23.42, -46.89], [-24.23, -49.26], [-22.84, -49.72], [-19.98, -50.62], [-17.92, -51.18], [-15.86, -51.71], [-13.32, -52.26],
  [-11.51, -52.61], [-11.08, -50.24], [-8.25, -50.70], [-8.26, -49.50], [-3.58, -49.48], [15.38, -49.41], [15.32, -50.73],
  [16.43, -50.54], [17.54, -50.34], [18.64, -50.12], [19.74, -49.90], [20.84, -49.66], [21.78, -49.46], [22.72, -49.24],
  [23.66, -49.00], [24.59, -48.74], [25.51, -48.46], [26.75, -48.08], [27.97, -47.69], [29.19, -47.29], [30.41, -46.86],
  [31.62, -46.42], [32.83, -45.97], [33.85, -45.56], [34.86, -45.14], [35.87, -44.70], [36.87, -44.24], [37.86, -43.77],
  [38.84, -43.27],
];
// Alles binnen de contour tot de lage delen naast de hal (AHN +5 tot +7 m).
const LOW = 6.0;
// Kap over de sporen: zadeldak met de nok dwars op de sporen (langs t) op
// s = 4, goot +13,0 m op s = -25 en +13,5 m op s = 31.
const ROOF = { s: [-25, 31], t: [-20, 47.5], ridgeS: 4, ridge: 19.2, eave: [13.0, 13.5] };
// Deel aan de centrumzijde (t < -20): plat op +13,3 m, met een middenstrook
// van 8 m breed tot +16 m.
const CITY = { s: [-21.5, 26.5], t: [-60, -20], top: 13.3, strip: { s: [0, 8], ridge: 16.0 } };
// Perronkappen: per kap de strook dwars op de sporen, het begin en einde
// langs de sporen en de bovenkant.
const CANOPIES = [
  { label: "spoor 1-2", t: [-26.5, -19.5], s: [-150, -25], top: 10.4 },
  { label: "spoor 4-5", t: [-5.5, 6.5], s: [-150, 200], top: 10.3 },
  { label: "spoor 8-9", t: [26.5, 37.5], s: [-150, 153], top: 10.5 },
];
// Perronkappen buiten de hal: dak van 0,6 m dik op een rij kolommen in het
// midden (als wand van 1,8 m, op 1:2000 net breder dan de minimale
// steunbreedte van 0,8 mm), met de onderkant onder 45 graden naar de
// kolommen, zodat het profiel zonder steun te printen is.
const CANOPY_PROFILE = { roof: 0.6, spine: 1.8 };
// Spanten: acht vakwerkliggers van 1,8 m breed boven de glazen kap (AHN en
// luchtfoto), in vier paren als pijlpunten vanaf de punten van de perronkappen
// van spoor 4-5 en 8-9 aan beide kanten van de hal schuin omhoog naar de nok:
// van NAP +11,0 m bij de punt tot +22,5 m naast de nok.
const TRUSS = { width: 1.8, low: 11.0, high: 22.5 };
const TRUSSES = [
  [[-35.6, 32.25], [-1.9, 43.75]],
  [[-35.6, 32.25], [-1.9, 20.75]],
  [[-35.6, 0.6], [-1.9, 12.1]],
  [[-35.6, 0.6], [-1.9, -10.9]],
  [[42.5, 32.25], [8.75, 43.75]],
  [[42.5, 32.25], [8.75, 20.75]],
  [[42.5, 0.6], [8.75, 12.1]],
  [[42.5, 0.6], [8.75, -10.9]],
];
// Maaiveld op het Stationsplein aan de centrumzijde (AHN NAP +0,8 tot +1,0 m).
const GROUND_SAMPLES = [[0, -60], [20, -58], [-20, -58]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
const outline = prism(OUTLINE, BASE - 1, 200);
const clip = (solid) => Manifold.intersection(outline, solid);
// Zadeldak met de nok langs t op s = ridgeS en eigen goten aan beide kanten.
const gableAlongT = ([s0, s1], [t0, t1], ridgeS, ridge, [eave0, eave1]) =>
  Manifold.hull([
    [s0, t0, BASE], [s1, t0, BASE], [s0, t1, BASE], [s1, t1, BASE],
    [s0, t0, z(eave0)], [s0, t1, z(eave0)], [s1, t0, z(eave1)], [s1, t1, z(eave1)],
    [ridgeS, t0, z(ridge)], [ridgeS, t1, z(ridge)],
  ]);

// ---------- opbouw ----------
const hallParts = [clip(box([-80, 80], [-80, 80], BASE, z(LOW)))];
hallParts.push(clip(gableAlongT(ROOF.s, ROOF.t, ROOF.ridgeS, ROOF.ridge, ROOF.eave)));
hallParts.push(clip(box(CITY.s, CITY.t, BASE, z(CITY.top))));
{
  const S = CITY.strip;
  const mid = (S.s[0] + S.s[1]) / 2;
  hallParts.push(clip(gableAlongT(S.s, CITY.t, mid, S.ridge, [CITY.top, CITY.top])));
}
// Binnen de contour lopen de perronkappen door tot de kap.
for (const C of CANOPIES) hallParts.push(clip(box(C.s, C.t, BASE, z(C.top))));
const hall = Manifold.union(hallParts);
// Perronkappen buiten de hal met het parapluprofiel; snippers langs de
// schuine randen van de BAG-contour (onder 200 m³) vallen weg.
const canopyShape = (C) => {
  const P = CANOPY_PROFILE;
  const mid = (C.t[0] + C.t[1]) / 2;
  const half = (C.t[1] - C.t[0]) / 2;
  const w = P.spine / 2;
  const under = z(C.top) - P.roof;
  const slab = [];
  for (const sv of C.s) {
    slab.push(
      [sv, C.t[0], z(C.top)], [sv, C.t[1], z(C.top)], [sv, C.t[0], under], [sv, C.t[1], under],
      [sv, mid - w, under - (half - w)], [sv, mid + w, under - (half - w)],
    );
  }
  return Manifold.union([Manifold.hull(slab), box(C.s, [mid - w, mid + w], BASE, z(C.top))]);
};
const hallFootprint = prism(OUTLINE, BASE - 2, 200);
const canopies = Manifold.union(
  Manifold.union(CANOPIES.map(canopyShape))
    .subtract(hallFootprint)
    .decompose()
    .filter((piece) => piece.volume() > 200),
);
// Spanten: wanden van 1,8 m breed met de bovenkant langs de ligger, vanaf
// NAP +10 m (in de kap of het dak van de perronkap).
const trusses = Manifold.union(
  TRUSSES.map(([p, q]) => {
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const n = [(-(q[1] - p[1]) / len) * (TRUSS.width / 2), ((q[0] - p[0]) / len) * (TRUSS.width / 2)];
    const pts = [];
    for (const [c, top] of [[p, TRUSS.low], [q, TRUSS.high]]) {
      for (const sign of [-1, 1]) {
        const [x, y] = [c[0] + n[0] * sign, c[1] + n[1] * sign];
        pts.push([x, y, z(10.0)], [x, y, z(top)]);
      }
    }
    return Manifold.hull(pts);
  }),
);
const nodes = [
  ["building:stationshal", hall],
  ["building:perronkappen", canopies],
  ["building:spanten", trusses],
];
// In de STL vallen de naden tussen hal en kappen langs de BAG-rand weg
// (holtes zonder volume).
const printModel = Manifold.union(
  Manifold.union([hall, canopies, trusses])
    .decompose()
    .filter((piece) => piece.volume() > 1),
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
const glbFile = path.join(outDir, "station-leiden-centraal.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-station-leiden-centraal.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (0,5 m onder het maaiveld) op het printbed.
const stlFile = path.join(outDir, `station-leiden-centraal-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Leiden Centraal 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Het maaiveld wordt op
// het plein en de straten rondom bemonsterd.
await writeFile(
  path.join(outDir, "station-leiden-centraal.json"),
  JSON.stringify(
    {
      name: "Leiden Centraal",
      file: "station-leiden-centraal.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: U.map((v) => +v.toFixed(5)),
      groundOffsetMetres: 0,
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0546100000051298"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (93084,9, 464616,2), het zwaartepunt van de stationshal, op het maaiveld van het Stationsplein (NAP +0,9 m), +X langs de sporen naar het noordoosten (RD-richting 50 graden) en +Y naar de zeezijde. De vlakke onderkant ligt 0,5 m onder het maaiveld; dat wordt op het Stationsplein bemonsterd. Vervangt de PDOK-reconstructie van BAG-pand 0546100000051298. De stationshal met de kap over de sporen als flauw zadeldak, de acht spanten die als pijlpunten vanaf de punten van de perronkappen over de kap naar de nok lopen (node building:spanten) en de drie perronkappen met een parapluprofiel op een middenkolom, hoogtes uit het AHN. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`station-leiden-centraal-1-${scale}.stl`],
      realWorld: {
        lengthM: 350,
        hallRoofRidgeNapM: ROOF.ridge,
        hallRoofEavesNapM: ROOF.eave,
        citySideNapM: CITY.top,
        canopyTopsNapM: CANOPIES.map((c) => c.top),
        railLevelNapM: 5.3,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Station_Leiden_Centraal",
        "PDOK BAG pand 0546100000051298 (contour van de stationshal), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de kap over de sporen, de perronkappen, het spoorniveau en het maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

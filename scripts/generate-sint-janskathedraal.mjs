// Genereert een vereenvoudigd, gesloten 3D-model van de Sint-Janskathedraal in
// 's-Hertogenbosch: de zijbeuken op de BAG-contour met de pinakels van de
// luchtbogen, het middenschip, het transept en het koor met zadeldaken en een
// veelhoekige koorsluiting, de vieringtoren met lantaarn en de westtoren met
// zijn smallere bovengeleding en lantaarn. Alle maten in het script zijn meters
// op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-sint-janskathedraal.mjs              # 1:1000 (standaard)
//   node scripts/generate-sint-janskathedraal.mjs --scale 500
//
// Alles staat op elkaar zonder vrije overhang; op 1:1000 printen de pinakels
// als staafjes van 1,2 mm.
//
// Assenstelsel: oorsprong in het hart van de BAG-contour op het maaiveld
// (NAP +6,2 m), Z omhoog. +X loopt langs de as van de kerk naar het oosten (het
// koor, RD-richting 6,8 graden), +Y naar het noorden.
//
// Bronnen: BAG-pand 0796100000237576 (contour); AHN DSM/DTM 0,5 m (PDOK WCS) in
// een stelsel langs de as: goot- en nokhoogtes van schip, transept en koor,
// zijbeuken, pinakels, de omhullende per hoogte van beide torens en het
// maaiveld; Wikipedia; PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-janskathedraal");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const box = (u0, u1, v0, v1, z0, z1) =>
  Manifold.cube([u1 - u0, v1 - v0, z1 - z0], false).translate([u0, v0, z0]);
// Zadeldakvolume langs X: muren tot `eave` op v0 ± half, nok `ridge` op v0.
const gableAlongX = (u0, u1, v0, half, eave, ridge, base = -0.5) =>
  Manifold.extrude(
    [ccw([[v0 - half, base], [v0 + half, base], [v0 + half, eave], [v0, ridge], [v0 - half, eave]])],
    u1 - u0,
  )
    .rotate([90, 0, 90])
    .translate([u0, 0, 0]);
// Idem langs Y (transept): profiel in het XZ-vlak, uitgetrokken over v0..v1.
const gableAlongY = (v0, v1, u0, half, eave, ridge, base = -0.5) =>
  Manifold.extrude(
    [ccw([[u0 - half, base], [u0 + half, base], [u0 + half, eave], [u0, ridge], [u0 - half, eave]])],
    v1 - v0,
  )
    .rotate([90, 0, 0])
    .translate([0, v1, 0]);
const octagon = (cx, cy, apothem, z0, z1, apothemTop = apothem) =>
  Manifold.cylinder(z1 - z0, apothem / Math.cos(Math.PI / 8), apothemTop / Math.cos(Math.PI / 8), 8, false)
    .rotate([0, 0, 22.5])
    .translate([cx, cy, z0]);

// ---------- maten (hoogte boven het maaiveld, NAP +6,2 m) ----------
const ORIGIN = [149555.494, 411035.624];
const X_AXIS = [0.99297, 0.1184];
const OUTLINE = [[-58.99, -6.41], [-57.18, -6.55], [-57.47, -10.89], [-58.15, -10.85], [-58.18, -11.45], [-57.5, -11.53], [-57.68, -14.43], [-58.38, -14.39], [-58.43, -15.11], [-57.69, -15.18], [-57.71, -15.88], [-57.17, -15.9], [-57.11, -15.2], [-54.31, -15.35], [-54.32, -16.03], [-53.76, -16.08], [-53.71, -15.38], [-52.21, -15.46], [-52.34, -18.3], [-49.42, -18.5], [-49.49, -20.21], [-48.18, -20.23], [-48.1, -18.89], [-44.96, -19.06], [-44.99, -20.3], [-44.34, -21.11], [-43.47, -20.41], [-43.38, -19.15], [-39.23, -19.36], [-39.29, -20.58], [-38.58, -21.43], [-37.79, -20.67], [-37.72, -19.47], [-33.52, -19.69], [-33.58, -20.83], [-32.89, -21.71], [-32.1, -20.91], [-32.03, -19.75], [-27.83, -19.97], [-27.9, -21.17], [-27.21, -21.99], [-26.4, -21.24], [-26.35, -20.03], [-22.14, -20.23], [-22.22, -21.47], [-21.46, -22.26], [-20.66, -21.57], [-20.56, -20.29], [-16.4, -20.48], [-16.46, -21.75], [-15.78, -22.52], [-14.94, -21.85], [-14.88, -20.57], [-10.59, -20.76], [-10.71, -22.05], [-10.01, -22.82], [-9.61, -22.42], [-7.82, -22.49], [-7.93, -25.12], [-8.48, -25.58], [-8.11, -26.0], [-7.58, -25.62], [-6.84, -25.62], [-6.99, -27.35], [-6.79, -27.39], [-6.73, -27.88], [-6.03, -27.82], [-5.38, -28.48], [-5.59, -29.08], [-5.05, -29.34], [-5.01, -29.46], [-4.41, -29.55], [-4.49, -31.17], [-5.49, -31.12], [-5.52, -31.9], [-4.48, -31.99], [-4.53, -32.83], [-4.54, -33.05], [-3.76, -33.12], [-3.68, -32.04], [1.6, -32.34], [1.56, -33.4], [2.4, -33.47], [2.48, -32.38], [7.72, -32.69], [7.68, -33.73], [8.58, -33.83], [8.61, -33.41], [8.66, -32.75], [9.66, -32.78], [9.7, -32.06], [8.6, -31.98], [8.71, -30.47], [9.33, -30.49], [9.49, -28.28], [11.64, -28.35], [11.73, -26.95], [13.15, -27.05], [13.14, -27.67], [13.58, -27.7], [13.63, -27.06], [19.11, -27.32], [19.1, -27.97], [19.58, -28.02], [19.63, -27.36], [23.1, -27.62], [23.0, -30.54], [26.27, -30.74], [26.4, -27.78], [29.64, -28.06], [29.65, -28.7], [30.27, -28.69], [30.3, -28.05], [34.96, -28.3], [35.01, -28.99], [35.66, -28.96], [35.61, -28.29], [38.86, -27.99], [39.13, -28.44], [39.69, -28.12], [39.41, -27.58], [41.43, -25.15], [42.07, -25.32], [42.24, -24.74], [41.67, -24.59], [41.31, -20.89], [41.77, -20.74], [41.64, -19.7], [43.58, -18.54], [44.41, -19.26], [44.85, -18.68], [44.04, -18.03], [44.8, -15.34], [45.6, -16.09], [46.08, -15.58], [45.33, -14.85], [48.13, -14.12], [48.76, -14.95], [49.27, -14.58], [48.62, -13.69], [49.78, -11.78], [50.77, -11.93], [50.95, -11.15], [50.11, -10.95], [49.27, -8.69], [50.37, -8.77], [50.53, -7.68], [52.52, -7.84], [52.83, -8.86], [53.43, -8.58], [53.18, -7.55], [55.01, -6.04], [56.16, -6.41], [56.37, -5.79], [55.52, -5.45], [55.54, -2.76], [56.5, -2.42], [56.33, -1.76], [55.33, -2.09], [53.66, -0.24], [54.09, 0.76], [53.44, 1.04], [53.02, 0.18], [50.95, 0.22], [50.97, 1.31], [49.81, 1.33], [50.65, 3.68], [51.62, 3.71], [51.61, 4.36], [50.46, 4.36], [49.6, 6.26], [50.19, 7.06], [49.76, 7.33], [49.15, 6.74], [46.5, 7.83], [47.29, 8.49], [46.91, 9.02], [46.04, 8.41], [45.55, 11.16], [46.48, 11.74], [46.1, 12.26], [45.17, 11.74], [43.39, 13.08], [43.68, 14.08], [43.21, 14.35], [44.04, 17.94], [44.82, 18.08], [44.75, 18.67], [43.91, 18.54], [41.92, 21.29], [42.48, 21.78], [42.1, 22.27], [41.64, 21.68], [38.06, 22.98], [38.07, 23.76], [37.43, 23.8], [37.4, 22.9], [37.13, 22.97], [37.37, 23.49], [36.41, 23.97], [35.02, 23.54], [33.21, 25.66], [33.82, 26.83], [33.39, 27.91], [32.39, 27.51], [31.79, 26.24], [28.31, 26.43], [28.35, 27.78], [27.59, 28.62], [26.75, 27.84], [26.71, 26.51], [23.24, 26.7], [23.28, 28.01], [22.54, 28.87], [21.66, 28.05], [21.62, 26.76], [17.92, 27.02], [17.98, 28.33], [17.22, 29.19], [16.29, 28.36], [16.25, 27.07], [12.97, 27.28], [12.98, 27.68], [13.26, 27.95], [12.81, 28.39], [12.51, 28.08], [10.69, 28.27], [10.39, 28.57], [9.87, 28.11], [10.13, 27.79], [10.05, 25.99], [9.77, 25.74], [9.51, 25.76], [8.14, 24.46], [8.12, 24.14], [5.76, 24.25], [5.37, 24.36], [5.39, 24.52], [5.25, 24.7], [4.99, 24.71], [4.82, 24.53], [4.82, 24.37], [4.53, 24.4], [4.43, 24.31], [2.02, 24.49], [2.01, 24.78], [0.92, 26.2], [0.54, 26.25], [0.25, 26.61], [0.29, 28.28], [0.55, 28.59], [0.09, 29.09], [-0.21, 28.78], [-2.09, 28.9], [-2.35, 29.19], [-2.86, 28.69], [-2.54, 28.35], [-2.63, 26.34], [-2.95, 26.04], [-2.69, 25.73], [-2.7, 25.34], [-4.99, 25.5], [-5.08, 23.02], [-6.75, 23.08], [-7.19, 23.61], [-7.72, 23.19], [-7.26, 22.63], [-7.32, 20.75], [-7.55, 20.92], [-8.32, 20.28], [-8.36, 19.17], [-12.59, 19.32], [-12.53, 20.46], [-13.25, 21.24], [-14.05, 20.54], [-14.11, 19.46], [-18.33, 19.69], [-18.25, 20.95], [-18.95, 21.69], [-19.75, 21.07], [-19.81, 19.73], [-24.04, 19.93], [-23.96, 21.21], [-24.68, 21.96], [-24.71, 22.0], [-25.01, 21.74], [-25.47, 21.34], [-25.54, 20.02], [-29.75, 20.26], [-29.68, 21.46], [-30.42, 22.28], [-31.2, 21.56], [-31.32, 20.33], [-35.48, 20.52], [-35.43, 21.73], [-36.13, 22.53], [-37.01, 21.82], [-37.08, 20.6], [-41.2, 20.83], [-41.15, 22.05], [-41.87, 22.8], [-42.72, 22.06], [-42.77, 20.84], [-45.52, 20.88], [-45.52, 21.25], [-46.18, 21.28], [-44.63, 22.6], [-45.41, 23.55], [-47.05, 22.2], [-54.6, 22.57], [-55.73, 23.86], [-55.98, 24.14], [-56.01, 24.18], [-56.81, 23.47], [-56.61, 23.23], [-55.45, 21.91], [-55.74, 16.34], [-57.64, 16.41], [-57.82, 16.42], [-57.87, 15.25], [-55.82, 15.15], [-56.2, 7.89], [-58.31, 8.0], [-58.37, 6.84], [-58.1, 6.82], [-56.89, 6.75], [-57.07, 3.83], [-57.81, 3.87], [-57.87, 3.26], [-57.15, 3.21], [-57.47, -1.36], [-58.19, -1.34], [-58.25, -2.04], [-57.53, -2.08], [-57.74, -5.34], [-59.01, -5.28], [-59.22, -5.26], [-59.31, -6.38]];
// Zijbeuken en kooromgang: de hele BAG-contour tot 16 m (AHN: 15 tot 17 m).
const AISLE = { top: 16 };
// Middenschip, koor en transept (AHN): muren 17 m breed, goot 26 m, nok 37 m
// (koor 37,5 m), de as van het schip op v = -0,5 m.
const NAVE = { from: -42.7, to: -3.5, axis: -0.5, half: 8.5, eave: 26, ridge: 37 };
const CHOIR = { from: 9.5, to: 33, axis: -0.5, half: 8.5, eave: 26, ridge: 37.5, apse: 8.5 };
const TRANSEPT = { from: -27, to: 26, axis: 3.4, half: 6.5, eave: 26, ridge: 37.5 };
// Vieringtoren (AHN): achthoekige trommel van 13 m tot 50 m, lantaarn tot 59,6 m.
const CROSSING = { u: 3.4, v: -1.7, apothem: 6.5, top: 50, lantern: 1.7, lanternTop: 56.5, tip: 59.6 };
// Westtoren (AHN, omhullende per hoogte): onderbouw 15,8 × 16,2 m tot 47 m,
// bovengeleding 10 × 9,7 m tot 62 m, lantaarn tot 66 m, spits tot 69,5 m.
const TOWER = {
  base: { u: [-58.5, -42.7], v: [-8.4, 7.8], top: 47 },
  upper: { u: [-55.6, -45.5], v: [-4.8, 4.9], top: 62 },
  lantern: { apothem: 3.3, top: 66 },
  tip: 69.5,
};
// Pinakels van de luchtbogen langs de zijbeuken (AHN: pieken tot 22 m om de
// 6 m op |v| ≈ 14,5 m).
const PINNACLE = { size: 1.2, top: 22, v: 14.5, u: [-44, -38, -32, -26, -20, -14, -8, 15, 21, 27] };

// ---------- opbouw ----------
const parts = [];
parts.push(Manifold.extrude(new CrossSection([ccw(OUTLINE)]), AISLE.top + 0.5).translate([0, 0, -0.5]));
parts.push(gableAlongX(NAVE.from, NAVE.to, NAVE.axis, NAVE.half, NAVE.eave, NAVE.ridge));
parts.push(gableAlongX(CHOIR.from, CHOIR.to, CHOIR.axis, CHOIR.half, CHOIR.eave, CHOIR.ridge));
parts.push(gableAlongY(TRANSEPT.from, TRANSEPT.to, TRANSEPT.axis, TRANSEPT.half, TRANSEPT.eave, TRANSEPT.ridge));
// Kruising tussen schip en koor onder de vieringtoren.
parts.push(gableAlongX(NAVE.to - 0.1, CHOIR.from + 0.1, NAVE.axis, NAVE.half, NAVE.eave, NAVE.ridge));
// Koorsluiting: halve achthoek met een piramidedak tot de nok.
const apseWall = octagon(CHOIR.to, CHOIR.axis, CHOIR.apse, -0.5, CHOIR.eave).intersect(
  box(CHOIR.to, CHOIR.to + 20, -20, 20, -1, 60),
);
const apseRoof = octagon(CHOIR.to, CHOIR.axis, CHOIR.apse, CHOIR.eave, CHOIR.ridge, 0.05).intersect(
  box(CHOIR.to, CHOIR.to + 20, -20, 20, -1, 60),
);
parts.push(apseWall, apseRoof);
// Vieringtoren.
parts.push(octagon(CROSSING.u, CROSSING.v, CROSSING.apothem, NAVE.eave, CROSSING.top));
parts.push(octagon(CROSSING.u, CROSSING.v, CROSSING.apothem, CROSSING.top, CROSSING.top + 1.5, 1.8));
parts.push(octagon(CROSSING.u, CROSSING.v, CROSSING.lantern, CROSSING.top + 1, CROSSING.lanternTop));
parts.push(octagon(CROSSING.u, CROSSING.v, CROSSING.lantern, CROSSING.lanternTop, CROSSING.tip, 0.15));
// Westtoren.
const { base, upper, lantern } = TOWER;
parts.push(box(base.u[0], base.u[1], base.v[0], base.v[1], -0.5, base.top));
parts.push(box(upper.u[0], upper.u[1], upper.v[0], upper.v[1], base.top - 0.5, upper.top));
const tu = (upper.u[0] + upper.u[1]) / 2;
const tv = (upper.v[0] + upper.v[1]) / 2;
parts.push(octagon(tu, tv, lantern.apothem, upper.top - 0.5, lantern.top));
const dome = Manifold.sphere(lantern.apothem, 24)
  .trimByPlane([0, 0, 1], 0)
  .translate([tu, tv, lantern.top - 0.1]);
parts.push(dome);
parts.push(octagon(tu, tv, 0.5, lantern.top + lantern.apothem - 0.5, TOWER.tip, 0.12));
// Pinakels.
for (const u of PINNACLE.u) {
  for (const s of [-1, 1]) {
    const v = s * PINNACLE.v;
    parts.push(box(u - PINNACLE.size / 2, u + PINNACLE.size / 2, v - PINNACLE.size / 2, v + PINNACLE.size / 2, AISLE.top - 0.5, PINNACLE.top - 1.5));
    parts.push(
      Manifold.cylinder(1.5, PINNACLE.size * 0.7, 0.05, 4, false)
        .rotate([0, 0, 45])
        .translate([u, v, PINNACLE.top - 1.5]),
    );
  }
}
const cathedral = union(parts);
const nodes = [["building:kathedraal", cathedral]];
const printModel = cathedral;

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
const glbFile = path.join(outDir, "sint-janskathedraal.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-sint-janskathedraal.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `sint-janskathedraal-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, 0.5]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Sint-Janskathedraal 1:${scale} mm Z-up`);
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

await writeFile(
  path.join(outDir, "sint-janskathedraal.json"),
  JSON.stringify(
    {
      name: "Sint-Janskathedraal",
      file: "sint-janskathedraal.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Parade ten zuiden en de straat ten westen (NAP +5,9 tot +6,2 m).
      groundSamplePoints: [
        [-20, -45],
        [20, -45],
        [-70, -30],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0796100000237576"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de BAG-contour op het maaiveld (NAP +6,2 m) in de oorsprong, +X langs de as van de kerk naar het koor (RD-richting 6,8 graden) en +Y naar het noorden. Eén node zonder vrije overhang. Vervangt de PDOK-reconstructie van BAG-pand 0796100000237576.",
      printFiles: [`sint-janskathedraal-1-${scale}.stl`],
      realWorld: {
        lengthM: 115.8,
        westTowerTopM: TOWER.tip,
        crossingTowerTopM: CROSSING.tip,
        naveRidgeM: NAVE.ridge,
        aisleTopM: AISLE.top,
        pinnacles: PINNACLE.u.length * 2,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Sint-Janskathedraal_(%27s-Hertogenbosch)",
        "PDOK BAG pand 0796100000237576, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: goot- en nokhoogtes, zijbeuken, pinakels, omhullende van beide torens, maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

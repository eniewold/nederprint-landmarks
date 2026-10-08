// Genereert een vereenvoudigd, gesloten 3D-model van de Kubuswoningen in
// Rotterdam (Piet Blom, 1982-1984): de gekantelde kubussen op zeshoekige
// pijlers in Bloms driehoeksraster, de twee grote kubussen aan de
// zuidoostkant en die aan de noordwestkant, de onderbouw met het voetgangersdek
// over de Blaak en de doorgang voor de weg eronder. Alle maten in het script
// zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node
// met de materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-kubuswoningen.mjs              # 1:1000 (standaard)
//   node scripts/generate-kubuswoningen.mjs --scale 500
//
// Printbaar op 1:1000 zonder losse steunconstructie: een kubus die op een punt
// staat heeft ondervlakken die 35 graden uit het lood hangen. Alles zit in één
// node, zodat de export het object laag voor laag opvult (de doorgang onder het
// dek heeft een vlakke onderkant) en de kubussen niet 2,5D naar beneden
// extrudeert.
//
// Assenstelsel: oorsprong op RD (93306,5, 437251,5), een punt van het raster,
// op straatniveau (NAP +3,8 m), Z omhoog, +X naar het oosten, +Y naar het
// noorden.
//
// Bronnen: BAG-panden 0599100000701291 (het complex) en 0599100000764949 (de
// onderbouw onder de zuidoostelijke grote kubussen); AHN DSM/DTM 0,5 m (PDOK
// WCS) voor het raster en de toppen (46 kubussen op NAP +24,8 m, de grote
// op +30,8 en +31,0 m), de ribbe (richels tot 4,5 m uit het hart op +21,6 m),
// de draaiing van de kubussen en de hoogte van dek en onderbouw; BGT
// overbruggingsdeel (dek over de Blaak); PDOK luchtfoto en Wikimedia
// Commons-foto's voor pijlers en opbouw.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kubuswoningen");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const slab = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
// Punt in polygoon (even-odd) over alle contouren.
function insideAny(polys, [x, y]) {
  let inside = false;
  for (const poly of polys) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i];
      const [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

// ---------- gegevens (RD min oorsprong, meters) ----------
const ORIGIN = [93306.5, 437251.5];
const NAP = (h) => h - 3.8;
// Bloms driehoeksraster uit de AHN-toppen: 8,66 m tussen buren, 2,2 graden
// gedraaid ten opzichte van RD.
const E1 = [7.32825, 4.61472];
const E2 = [-0.33244, 8.65362];
const THETA = 2.2;
const DATA = {
  bag: {
    "0599100000701291": [[26.35, -7.82], [20.65, -4.8], [20.38, -4.67], [16.89, -2.83], [10.32, 0.64], [8.46, 1.63], [6.29, 2.78], [5.35, 3.29], [5.01, 3.44], [2.26, 4.9], [1.5, 5.3], [-0.54, 6.39], [-0.93, 6.59], [-2.39, 7.36], [-2.47, 9.42], [-2.53, 11.14], [-2.56, 11.77], [-2.87, 20.06], [-3.14, 27.23], [4.19, 31.86], [4.16, 32.66], [4.13, 33.43], [4.09, 34.43], [3.97, 37.76], [4.6, 38.16], [1.55, 45.55], [0.81, 45.08], [-1.53, 43.61], [-3.82, 44.83], [-5.12, 45.52], [-9.63, 47.92], [-16.73, 51.69], [-16.11, 52.86], [-14.53, 55.93], [-17.6, 57.5], [-18.92, 54.95], [-19.93, 52.99], [-20.94, 51.08], [-24.35, 52.88], [-29.5, 49.64], [-29.27, 43.76], [-29.16, 40.99], [-30.49, 40.16], [-31.76, 42.18], [-43.95, 34.51], [-49.47, 31.08], [-50.62, 28.93], [-49.97, 28.59], [-49.61, 19.06], [-49.53, 16.81], [-50.68, 16.71], [-51.27, 15.35], [-50.74, 14.5], [-52.66, 13.3], [-51.02, 10.79], [-50.34, 9.98], [-50.51, 9.87], [-50.41, 7.21], [-50.29, 3.82], [-46.49, 1.81], [-45.84, 1.47], [-30.86, -6.44], [-30.49, -6.63], [-29.0, -7.42], [-27.23, -8.35], [-25.73, -9.14], [-25.19, -9.43], [-20.4, -11.96], [-19.94, -12.2], [-19.62, -12.37], [-18.41, -13.0], [-16.99, -13.76], [-14.18, -15.24], [-12.85, -15.94], [-7.37, -18.83], [-4.63, -20.28], [-3.03, -21.12], [1.71, -23.62], [3.33, -24.48], [3.54, -30.41], [3.59, -31.81], [3.65, -33.54], [3.75, -36.29], [4.0, -43.27], [4.02, -43.88], [4.13, -46.91], [4.19, -48.39], [4.26, -50.45], [13.09, -55.12], [14.07, -55.64], [23.19, -60.45], [24.94, -61.38], [32.57, -56.59], [34.42, -55.43], [35.2, -54.94], [36.72, -53.99], [45.29, -48.61], [45.86, -48.26], [46.92, -47.59], [48.37, -48.36], [54.3, -51.5], [54.54, -51.63], [55.44, -51.07], [55.9, -50.78], [59.71, -48.39], [58.54, -16.35], [54.15, -14.02], [53.19, -13.51], [45.85, -18.13], [45.35, -17.87], [43.64, -16.96], [37.96, -13.96], [33.08, -11.38]],
    "0599100000764949": [[17.21, -53.34], [15.37, -52.35], [13.85, -53.44], [9.45, -51.25], [9.5, -49.36], [7.67, -48.33], [7.59, -46.78], [6.66, -46.84], [4.19, -48.39], [-1.59, -52.02], [-1.51, -53.28], [-1.59, -53.34], [4.51, -56.61], [10.59, -59.82], [11.6, -60.36], [16.14, -62.76], [17.6, -63.53], [26.09, -68.02], [26.49, -67.2], [28.14, -67.06], [28.02, -66.26], [27.81, -65.48], [27.51, -64.72], [27.13, -64.0], [26.67, -63.33], [26.15, -62.72], [25.55, -62.16], [24.9, -61.68], [24.2, -61.27], [23.42, -62.74], [21.95, -61.95], [22.78, -60.5], [23.08, -60.65], [23.19, -60.45], [24.83, -57.47]],
  },
  deck: [[[24.5, -43], [21.5, -43], [21, -39], [23.5, -39], [23.5, -36.5], [29.5, -36], [33, -38.5], [33.5, -43.5], [26, -47.5]], [[26.5, -60.5], [29, -56.5], [25, -55], [26.5, -49], [32, -49.5], [33.5, -54.5], [40.5, -52], [42, -47], [46.5, -47], [55.5, -51.5], [55.5, -46.5], [60, -46.5], [59.5, -31.5], [55.5, -29.5], [55, -25.5], [51, -24.5], [53, -15], [47, -17.5], [32.5, -10.5], [28.5, -11], [27.5, -16], [25, -16], [24, -6.5], [6.5, 1.5], [3.5, 0.5], [3.5, 4.5], [-4.5, 7], [-6, 11], [-2.5, 11.5], [-3, 24.5], [-5.5, 25], [-5.5, 27.5], [-1, 28.5], [-2, 34], [1, 34.5], [1, 37.5], [-3, 38.5], [-4, 42], [-10.5, 43.5], [-11, 45.5], [-15.5, 45.5], [-16, 48.5], [-24.5, 48], [-23, 41], [-31, 40.5], [-32, 35], [-37.5, 35], [-39, 29.5], [-31.5, 31], [-32, 23.5], [-37.5, 24], [-37.5, 14.5], [-44.5, 13.5], [-44.5, 9.5], [-50.5, 10], [-50.5, 3.5], [-13.5, -14.5], [-13, -9.5], [-9, -9], [-6, -13.5], [-5.5, -20], [-0.5, -19.5], [-0.5, -23], [3, -24], [4, -45.5], [6.5, -45.5], [6.5, -48.5], [12.5, -47], [13, -54], [17.5, -54.5], [17.5, -56], [21, -56], [20, -61.5], [22, -61.5], [22, -66.5], [28, -67.5]]],
  dek: [[[22.9, -9.87], [19.34, -7.99], [20.13, -6.97], [20.41, -6.31], [20.6, -5.56], [20.65, -4.8], [20.38, -4.67], [19.74, -4.44], [18.63, -4.34], [17.73, -4.47], [16.5, -4.97], [15.17, -5.78], [13.54, -4.95], [7.03, -1.49], [6.37, -1.14], [4.14, 0.04], [4.1, 0.07], [4.83, 1.19], [5.25, 2.28], [5.35, 3.29], [5.01, 3.44], [3.62, 3.78], [2.46, 3.69], [1.21, 3.16], [0.02, 2.23], [-1.0, 1.5], [-2.22, 2.15], [-2.98, 2.55], [-5.01, 3.61], [-5.34, 3.8], [-6.59, 4.46], [-6.73, 4.68], [-6.81, 4.81], [-6.88, 6.63], [-6.94, 8.34], [-6.97, 9.0], [-7.05, 11.09], [-6.01, 11.72], [-6.02, 13.81], [-6.32, 14.0], [-7.85, 14.95], [-9.73, 13.87], [-10.9, 13.12], [-12.9, 16.34], [-19.96, 11.89], [-15.53, 4.84], [-24.51, -0.77], [-28.96, 6.22], [-37.44, 0.87], [-18.35, -9.19], [-19.25, -10.12], [-19.64, -10.84], [-19.87, -11.62], [-19.94, -12.59], [-18.41, -13.0], [-17.17, -12.97], [-15.84, -12.41], [-14.23, -11.38], [-3.03, -17.28], [-3.79, -18.0], [-4.23, -18.72], [-4.54, -19.59], [-4.63, -20.62], [-4.04, -20.91], [-3.03, -21.12], [-2.41, -21.12], [-1.48, -20.94], [-0.43, -20.5], [0.32, -20.0], [1.65, -19.17], [2.13, -18.89], [5.82, -20.77], [6.64, -21.17], [6.89, -28.04], [6.91, -28.66], [5.27, -29.72], [4.3, -30.59], [3.59, -31.81], [3.31, -33.37], [4.28, -33.72], [5.39, -33.84], [6.38, -33.69], [7.1, -33.43], [7.11, -34.18], [7.36, -41.15], [7.39, -41.76], [7.45, -44.57], [7.5, -44.79], [28.23, -31.72], [29.55, -32.43], [38.68, -26.75], [44.23, -23.23], [44.99, -22.75], [43.41, -21.91], [40.96, -20.6], [40.27, -20.23], [40.26, -19.82], [40.23, -19.04], [34.98, -16.26], [34.61, -16.07], [35.55, -14.78], [35.86, -13.84], [35.95, -12.91], [34.45, -12.47], [33.32, -12.5], [32.29, -12.81], [30.45, -13.89], [29.63, -13.42]], [[19.34, -7.99], [13.54, -4.95], [0.02, 2.23], [-1.0, 1.5], [-2.22, 2.15], [-2.98, 2.55], [-5.01, 3.61], [-5.34, 3.8], [-6.59, 4.46], [-6.73, 4.68], [-6.81, 4.81], [-6.88, 6.63], [-6.94, 8.34], [-6.97, 9.0], [-7.05, 11.09], [-6.01, 11.72], [-6.02, 13.81], [-6.32, 14.0], [-7.85, 14.95], [-9.73, 13.87], [-10.9, 13.12], [-12.9, 16.34], [-19.96, 11.89], [-15.53, 4.84], [-24.51, -0.77], [-28.96, 6.22], [-37.44, 0.87], [-14.23, -11.38], [-3.03, -17.28], [1.16, -19.49], [2.13, -18.89], [5.82, -20.77], [6.64, -21.17], [6.89, -28.04], [7.11, -34.18], [7.36, -41.15], [7.39, -41.76], [7.45, -44.57], [7.5, -44.79], [28.23, -31.72], [29.55, -32.43], [38.68, -26.75], [44.23, -23.23], [44.99, -22.75], [43.41, -21.91], [40.96, -20.6], [40.27, -20.23], [40.26, -19.82], [40.23, -19.04]]],
  cells: [[-6, 4], [-5, 3], [-5, 4], [-5, 5], [-5, 6], [-4, 2], [-4, 4], [-4, 6], [-3, 1], [-3, 4], [-3, 5], [-3, 7], [-2, 0], [-2, 6], [-1, -1], [-1, 0], [-1, 1], [-1, 2], [-1, 3], [-1, 4], [0, -2], [0, 0], [0, 4], [1, -6], [1, -3], [1, -2], [1, -1], [2, -4], [2, -2], [3, -8], [3, -7], [3, -4], [3, -3], [4, -8], [4, -6], [4, -4], [5, -8], [5, -7], [5, -6], [5, -5], [6, -8], [6, -6], [7, -9], [7, -8], [7, -7], [7, -6]],
};

// Woningkubus: ribbe 5,5 m, lichaamsdiagonaal verticaal (wanden 54,7 graden),
// top op NAP +24,8 m; de drie bovenste hoekpunten wijzen naar de buren in het
// raster (richtingen 30, 150 en 270 graden plus de draaiing).
const CUBE = { edge: 5.5, apex: 24.8 };
// Grote kubussen: dubbele ribbe, top uit het AHN.
const SUPER = [
  { cell: [2, -6], apex: 31.0 },
  { cell: [2, -5], apex: 30.8 },
  { cell: [-2, 5], apex: 30.8 },
];
const SUPER_EDGE = 11.0;
// Zeshoekige pijlers (foto: circa 0,4 keer de kubusbreedte), tot 2,6 m boven
// het onderste punt van de kubus, zodat ze daarin opgaan.
const PYLON = { acrossFlats: 3.1, superAcrossFlats: 4.6, intoCube: 2.6 };
// Onderbouw: laag deel op NAP +7,1 m, dek op +10,3 m (AHN), doorgang voor de
// Blaak onder het BGT-dek tot NAP +8,8 m (dek 1,5 m dik), onderkant op
// NAP +0,5 m (de kade aan de Oudehaven ligt op NAP +1,8 m).
const PODIUM = { low: 7.1, deck: 10.3, soffit: 8.8, base: 0.5 };

const cellCentre = ([i, j]) => [i * E1[0] + j * E2[0], i * E1[1] + j * E2[1]];

// ---------- kubus op een punt ----------
// Eenheidskubus rond de oorsprong met de diagonaal (1,1,1) langs Z, daarna zo
// gedraaid dat een bovenste hoekpunt in richting THETA + 30 graden wijst.
function tiltedCube(edge) {
  const base = Manifold.cube([edge, edge, edge], true)
    .rotate([0, 0, -45])
    .rotate([0, -Math.atan(Math.SQRT2) * (180 / Math.PI), 0]);
  const mesh = base.getMesh();
  const v = mesh.vertProperties;
  let angle = 0;
  for (let k = 0; k < v.length; k += mesh.numProp) {
    if (Math.abs(v[k + 2] - edge / (2 * Math.sqrt(3))) < 1e-4) {
      angle = (Math.atan2(v[k + 1], v[k]) * 180) / Math.PI;
      break;
    }
  }
  return base.rotate([0, 0, THETA + 30 - angle]);
}
const halfDiagonal = (edge) => (edge * Math.sqrt(3)) / 2;
// Zeshoekige pijler met vlakken naar de buren (richtingen THETA + 30 + k·60).
const hexPrism = (acrossFlats, z0, z1) =>
  Manifold.cylinder(z1 - z0, acrossFlats / Math.sqrt(3), acrossFlats / Math.sqrt(3), 6, false)
    .rotate([0, 0, THETA])
    .translate([0, 0, z0]);

// ---------- onderbouw ----------
const outline = CrossSection.union(Object.values(DATA.bag).map((ring) => new CrossSection([ring])));
const deckArea = new CrossSection(DATA.deck).add(CrossSection.union(DATA.dek.map((ring) => new CrossSection([ring])))).intersect(outline);
const bridge = CrossSection.union(DATA.dek.map((ring) => new CrossSection([ring]))).intersect(outline);
const podium = union([
  slab(outline, NAP(PODIUM.base), NAP(PODIUM.low)),
  slab(deckArea, NAP(PODIUM.low) - 0.05, NAP(PODIUM.deck)),
]).subtract(slab(bridge, NAP(PODIUM.base) - 1, NAP(PODIUM.soffit)));
const deckPolys = deckArea.toPolygons();
const levelAt = (p) => (insideAny(deckPolys, p) ? PODIUM.deck : PODIUM.low);

// ---------- kubussen en pijlers ----------
const parts = [podium];
const houseCube = tiltedCube(CUBE.edge);
for (const cell of DATA.cells) {
  const [x, y] = cellCentre(cell);
  const centreZ = NAP(CUBE.apex) - halfDiagonal(CUBE.edge);
  const bottom = centreZ - halfDiagonal(CUBE.edge);
  parts.push(houseCube.translate([x, y, centreZ]));
  parts.push(hexPrism(PYLON.acrossFlats, NAP(levelAt([x, y])) - 0.5, bottom + PYLON.intoCube).translate([x, y, 0]));
}
const superCube = tiltedCube(SUPER_EDGE);
for (const { cell, apex } of SUPER) {
  const [x, y] = cellCentre(cell);
  const centreZ = NAP(apex) - halfDiagonal(SUPER_EDGE);
  const bottom = centreZ - halfDiagonal(SUPER_EDGE);
  parts.push(superCube.translate([x, y, centreZ]));
  parts.push(
    hexPrism(PYLON.superAcrossFlats, NAP(levelAt([x, y])) - 0.5, bottom + PYLON.intoCube * 2).translate([x, y, 0]),
  );
}
const complex = union(parts);

const nodes = [["building:kubuswoningen", complex]];
const printModel = complex;

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
const glbFile = path.join(outDir, "kubuswoningen.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-kubuswoningen.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (NAP +0,5 m) op het printbed.
const stlFile = path.join(outDir, `kubuswoningen-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -NAP(PODIUM.base)]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Kubuswoningen Rotterdam 1:${scale} mm Z-up`);
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
  path.join(outDir, "kubuswoningen.json"),
  JSON.stringify(
    {
      name: "Kubuswoningen",
      file: "kubuswoningen.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: [1, 0],
      groundOffsetMetres: -0.3,
      // Straat langs de Blaak en de Hoogstraat (NAP +3,8 tot +4,2 m), niet de
      // lagere kade aan de Oudehaven.
      groundSamplePoints: [
        [-4.5, -43.5],
        [-54.5, -11.5],
        [-31.5, -21.5],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0599100000701291", "NL.IMBAG.Pand.0599100000764949"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (93306,5, 437251,5), een punt van Bloms raster, op straatniveau (NAP +3,8 m), +X naar het oosten en +Y naar het noorden. Eén node met onderbouw, pijlers en kubussen, zodat de export het geheel laag voor laag opvult. Het maaiveld wordt op de straat bemonsterd. Vervangt de PDOK-reconstructie van BAG-panden 0599100000701291 en 0599100000764949.",
      printFiles: [`kubuswoningen-1-${scale}.stl`],
      realWorld: {
        houseCubes: DATA.cells.length,
        largeCubes: SUPER.length,
        gridSpacingM: 8.66,
        gridRotationDegrees: THETA,
        cubeEdgeM: CUBE.edge,
        cubeApexNapM: CUBE.apex,
        largeCubeEdgeM: SUPER_EDGE,
        largeCubeApexNapM: SUPER.map((s) => s.apex),
        deckNapM: PODIUM.deck,
        lowPodiumNapM: PODIUM.low,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Kubuswoningen_(Rotterdam)",
        "https://en.wikipedia.org/wiki/Cube_house",
        "PDOK BAG panden 0599100000701291 en 0599100000764949, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: raster, toppen, ribbe, draaiing, dek en onderbouw",
        "PDOK BGT overbruggingsdeel (dek over de Blaak)",
        "Wikimedia Commons: Overzicht kubuswoningen - Rotterdam - 20359748 - RCE.jpg, Cube Houses @ Oudehaven @ Rotterdam (29948985423).jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

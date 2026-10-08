// Genereert een vereenvoudigd, gesloten 3D-model van Naturalis Biodiversity
// Center in Leiden: de nieuwbouw van Neutelings Riedijk (2019) met de
// gestapelde 'strata' van rode natuursteen: vijf platen die aan de noord- en
// oostkant per plaat terugspringen, aan de westkant van de noordwestvleugel
// elk onder een eigen hoek staan (de verspringende verdiepingen in de
// noordwesthoek) en aan de zuidkant in terrassen aflopen, de witte atriumdoos erbovenop met blinde ruitvormige nissen voor
// het opengewerkte gevelpatroon, en het gebouw van Fons Verheijen (1998)
// daaronder: de lage westvleugel, het middendeel, de kantoorschijf aan de
// oostkant en de collectietoren van 62 m met de afgeronde noordkant. Alle
// maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, één node per onderdeel met de materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-naturalis.mjs              # 1:1000 (standaard)
//   node scripts/generate-naturalis.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alles staat recht op of springt naar
// boven toe terug (elke plaat ligt binnen de plaat eronder), er kraagt niets uit, de
// smalste delen zijn de terrassen van 4 m en de schacht van 4 m naast de
// toren, en de nissen in de atriumdoos zijn ruiten met flanken van 56 graden.
//
// Assenstelsel: oorsprong op RD (92442,03, 464470,42), tussen de
// collectietoren en de atriumdoos, op het maaiveld (NAP +0,5 m), Z omhoog.
// +X loopt langs de gevels van het gebouw uit 1998 (RD-richting 2,9 graden,
// net ten noorden van oost), +Y naar het noorden, naar de nieuwbouw.
//
// Bronnen: BAG-pand 0546100000011596 (contour van het hele complex); AHN
// DSM/DTM 0,5 m (PDOK WCS) in een stelsel langs de gevels voor de hoogte van
// elk deel (westvleugel NAP +16,4 m, middendeel +25,2 m, kantoorschijf
// +21,4 m, toren +61,6 m met een schacht tot +65,2 m, strata +31,4 m met
// terrassen op +24,8, +18,2, +11,2 en +9,6 m, atriumdoos +41,9 m), de gevel
// van elke plaat (per hoogte gemeten op 0,25 m: de westgevel van de
// noordwestvleugel op +10,8, +16,5, +22,5 en +24,8 m met platen die 3 graden
// links- en rechtsom gedraaid staan, de noordgevel 0,13 m terug per meter
// hoogte, tot 3,3 m onder het dak) en het maaiveld; Wikipedia (collectietoren 62 m); foto's op Wikimedia
// Commons voor de strata, het gevelpatroon van de atriumdoos en de vorm van
// de toren.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "naturalis");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const slab = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);

// ---------- stelsel en maten (z = NAP - 0,5 m) ----------
// Stelsel langs de gevels van 1998: s langs +X, t langs +Y, vanaf de
// zuidwesthoek van de westvleugel (RD 92404,61, 464418,46); de oorsprong ligt
// op s = 40, t = 50.
const ANGLE = (2.9 * Math.PI) / 180;
const U = [Math.cos(ANGLE), Math.sin(ANGLE)];
const ORIGIN = [92442.03, 464470.42];
const NAP = (h) => h - 0.5;
const local = ([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [dx * U[0] + dy * U[1], -dx * U[1] + dy * U[0]];
};
const S = (s) => s - 40;
const T = (t) => t - 50;
const BASE = NAP(0); // 0,5 m onder het maaiveld
// Vak in (s, t) met de bovenkant `top` (NAP), afgesneden op de BAG-contour.
const zone = (s0, s1, t0, t1, top) => ({ s0, s1, t0, t1, top });

// BAG-pand 0546100000011596: het hele complex.
const BAG = [
  [92481.19, 464459.27], [92486.03, 464459.83], [92483.17, 464481.66], [92478.54, 464480.88],
  [92475.05, 464480.25], [92475.0, 464481.62], [92474.94, 464481.78], [92475.59, 464482.42],
  [92475.92, 464483.28], [92475.88, 464484.19], [92475.48, 464485.01], [92474.77, 464485.59],
  [92474.76, 464485.82], [92488.15, 464487.67], [92480.76, 464531.04], [92398.53, 464517.9],
  [92400.61, 464505.72], [92400.04, 464490.41], [92403.19, 464490.58], [92406.25, 464472.63],
  [92412.27, 464472.95], [92412.33, 464471.62], [92411.69, 464470.98], [92411.37, 464470.14],
  [92411.41, 464469.23], [92411.82, 464468.42], [92412.51, 464467.85], [92412.81, 464461.93],
  [92412.63, 464461.93], [92401.82, 464461.39], [92402.65, 464445.01], [92406.05, 464445.18],
  [92406.29, 464440.41], [92402.88, 464440.22], [92403.96, 464419.06], [92404.02, 464418.43],
  [92404.61, 464418.46], [92418.52, 464419.16], [92421.73, 464419.32], [92421.91, 464419.33],
  [92421.94, 464419.0], [92443.0, 464420.05], [92443.17, 464416.74], [92443.2, 464416.04],
  [92484.94, 464410.65], [92485.68, 464421.94], [92486.77, 464443.99], [92481.98, 464443.83],
  [92481.78, 464449.74],
].map(local);
const outline = new CrossSection([ccw(BAG)]);

// Gebouw uit 1998 (t tot 53): hoogtes uit het AHN-DSM.
const OLD_ZONES = [
  zone(-5, 17.5, -5, 42.5, 16.4), // westvleugel
  zone(11, 23, 42.5, 53, 9.6), // lage verbinding achter de binnenplaats
  zone(17.5, 90, -15, 49.5, 21.4), // kantoorschijf
  zone(23, 65.5, 49.5, 53, 20.0), // glazen kap tussen toren en atriumdoos
  zone(17.5, 67, 21, 27, 22.5), // strook tussen middendeel en toren
  zone(17.5, 67, -5, 21, 25.2), // middendeel
];
// Nieuwbouw (t vanaf 53): de strata met terrassen aan de zuidkant.
const NEW_ZONES = [
  zone(-10, 12.5, 53, 65.5, 11.2),
  zone(12.5, 17.5, 53, 65.5, 9.6),
  zone(-10, 17.5, 65.5, 71.5, 18.2),
  zone(-10, 17.5, 71.5, 75, 24.8),
  zone(-10, 17.5, 75, 130, 31.4),
  zone(17.5, 67, 53, 130, 31.4), // rond en onder de atriumdoos
  zone(65.5, 90, 49.5, 63.5, 9.6), // lage doorgang aan de oostkant
  zone(70.5, 90, 49.5, 58.5, 21.4), // kop van de kantoorschijf
  zone(67, 90, 63.5, 68.5, 18.0),
  zone(67, 80.5, 68.5, 77.5, 24.8),
  zone(80.5, 90, 68.5, 77.5, 18.0),
  zone(67, 90, 77.5, 130, 31.4),
];
// De strata zijn vijf platen van een of twee verdiepingen. Langs de noord- en
// oostgevel springt elke plaat terug met de gemeten 0,13 m per meter hoogte
// (AHN: de noordgevel ligt op elke hoogte evenwijdig aan de BAG-gevel),
// gemeten op halve plaathoogte, tot 3,3 m (noord) en 2 m (oost) onder het dak.
// De westgevel van de noordwestvleugel bestaat uit verdraaide platen (AHN,
// gevel per hoogte gemeten van t = 76 tot 96): tot NAP +10,8 m de geknikte
// BAG-gevel, tot +16,5 m een plaat die naar het noorden 5,5 cm per meter
// terugwijkt, tot +22,5 m een plaat die juist 5 cm per meter naar voren komt,
// tot +24,8 m een rechte plaat op s = 2,3 en daarboven het dak op s = 3,95.
// Elke plaat is s = a + b·(t - 86) en staat nooit buiten de plaat eronder.
const WEST_SLABS = [
  { top: 10.8, a: -Infinity, b: 0, north: 0, east: 0 },
  { top: 16.5, a: 0.2, b: 0.055, north: 1.4, east: 0.9 },
  { top: 22.5, a: 1.5, b: -0.05, north: 2.1, east: 1.3 },
  { top: 24.8, a: 2.3, b: 0, north: 2.7, east: 1.7 },
  { top: 31.4, a: 3.95, b: 0, north: 3.3, east: 2.0 },
];
const STRATA_LAYERS = WEST_SLABS.map((slab) => slab.top);
const NORTH_SIDE = 14; // BAG-zijde van de noordgevel
const EAST_SIDE = 13; // BAG-zijde van de oostgevel van de nieuwbouw
const WEST_WING_T0 = 70; // de platen gelden vanaf de zuidgevel van de vleugel
const ATRIUM = { s0: 17.5, s1: 66.8, t0: 53, t1: 95.5, top: 41.9 };
// Collectietoren: lichte zuidhelft, donkere noordhelft met afgeronde hoeken
// (foto's) en de hogere schacht aan de oostkant (AHN NAP +65,2 m).
const TOWER = { s0: 18, s1: 40.5, t0: 27, mid: 38.5, t1: 49.5, top: 61.6, radius: 4 };
const SHAFT = { s0: 40.5, s1: 44, t0: 33, t1: 47.5, top: 65.2 };
// Gevelpatroon van de atriumdoos boven de strata: ruitvormige blinde nissen
// (2,4 × 3,6 m, 0,35 m diep) op 4 m, in twee verspringende rijen.
const NICHE = { width: 2.4, height: 3.6, depth: 0.35, pitch: 4, rows: [34.1, 38.7], margin: 1.5 };

// ---------- volumes ----------
const prism = (z0, z1, section = outline) => slab(section, z0, z1);
const zoneBox = ({ s0, s1, t0, t1 }, z0, z1) => boxFromTo(S(s0), S(s1), T(t0), T(t1), z0, z1);
const oldPart = union(
  OLD_ZONES.map((z) => prism(BASE, NAP(z.top)).intersect(zoneBox(z, BASE - 1, NAP(z.top) + 1))),
);
// Contour met per zijde een eigen terugsprong: elke zijde schuift evenwijdig
// naar binnen en de hoekpunten zijn de snijpunten van de verschoven zijden.
function insetPolygon(pts, insets) {
  const n = pts.length;
  const lines = pts.map((p, i) => {
    const q = pts[(i + 1) % n];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const normal = [-(q[1] - p[1]) / len, (q[0] - p[0]) / len];
    const d = insets[i] ?? 0;
    return { p: [p[0] + normal[0] * d, p[1] + normal[1] * d], dir: [(q[0] - p[0]) / len, (q[1] - p[1]) / len] };
  });
  return lines.map((line, i) => {
    const prev = lines[(i + n - 1) % n];
    const cross = prev.dir[0] * line.dir[1] - prev.dir[1] * line.dir[0];
    if (Math.abs(cross) < 1e-6) return line.p;
    const w = [line.p[0] - prev.p[0], line.p[1] - prev.p[1]];
    const k = (w[0] * line.dir[1] - w[1] * line.dir[0]) / cross;
    return [prev.p[0] + prev.dir[0] * k, prev.p[1] + prev.dir[1] * k];
  });
}
const STRATA_TOP = STRATA_LAYERS[STRATA_LAYERS.length - 1];
// Alles ten westen van de gevellijn van een plaat, binnen de noordwestvleugel.
const westCut = ({ a, b }) => {
  if (a === -Infinity) return null;
  const s = (t) => S(a + b * (t - 86));
  return new CrossSection([
    ccw([
      [S(-30), T(WEST_WING_T0)],
      [s(WEST_WING_T0), T(WEST_WING_T0)],
      [s(140), T(140)],
      [S(-30), T(140)],
    ]),
  ]);
};
let below = null;
const strataLayers = WEST_SLABS.map((slab, i) => {
  const h0 = i === 0 ? null : WEST_SLABS[i - 1].top;
  const insets = BAG.map((_, k) => (k === NORTH_SIDE ? slab.north : k === EAST_SIDE ? slab.east : 0));
  let section = new CrossSection([insetPolygon(BAG, insets)]);
  const cut = westCut(slab);
  if (cut) section = section.subtract(cut);
  if (below) section = section.intersect(below);
  below = section;
  return [h0 === null ? BASE : NAP(h0) - 0.01, NAP(slab.top), section];
});
const newPart = union(
  NEW_ZONES.map((z) =>
    union(
      strataLayers
        .filter(([z0]) => z0 < NAP(z.top))
        .map(([z0, z1, section]) => prism(z0, Math.min(z1, NAP(z.top)), section)),
    ).intersect(zoneBox(z, BASE - 1, NAP(z.top) + 1)),
  ),
);
let atrium = boxFromTo(S(ATRIUM.s0), S(ATRIUM.s1), T(ATRIUM.t0), T(ATRIUM.t1), BASE, NAP(ATRIUM.top));
// Ruitnissen in de noord-, west- en oostgevel van de atriumdoos.
const diamond = new CrossSection([
  ccw([
    [-NICHE.width / 2, 0],
    [0, -NICHE.height / 2],
    [NICHE.width / 2, 0],
    [0, NICHE.height / 2],
  ]),
]);
// Ruit in het verticale vlak van een gevel op positie `along` langs die gevel
// en hoogte `zc` (NAP); de nis loopt 1 m door naar buiten zodat hij de gevel
// schoon snijdt.
function nicheAt(face, along, zc) {
  // Na rotate([90, 0, 0]) ligt de ruit in het XZ-vlak en wijst de extrusie
  // naar -Y: van -depth (in de gevel) tot +1 m (buiten) langs -Y.
  const n = Manifold.extrude(diamond, NICHE.depth + 1)
    .translate([0, 0, -NICHE.depth])
    .rotate([90, 0, 0]);
  if (face === "north") return n.rotate([0, 0, 180]).translate([along, T(ATRIUM.t1), NAP(zc)]);
  if (face === "west") return n.rotate([0, 0, -90]).translate([S(ATRIUM.s0), along, NAP(zc)]);
  return n.rotate([0, 0, 90]).translate([S(ATRIUM.s1), along, NAP(zc)]);
}
const niches = [];
const faces = [
  ["north", S(ATRIUM.s0), S(ATRIUM.s1)],
  ["west", T(75), T(ATRIUM.t1)],
  ["east", T(77.5), T(ATRIUM.t1)],
];
for (const [face, from, to] of faces) {
  const count = Math.floor((to - from - 2 * NICHE.margin - NICHE.width) / NICHE.pitch);
  const start = from + (to - from - count * NICHE.pitch) / 2;
  NICHE.rows.forEach((zc, row) => {
    for (let i = 0; i <= count - (row % 2); i++) {
      niches.push(nicheAt(face, start + i * NICHE.pitch + ((row % 2) * NICHE.pitch) / 2, zc));
    }
  });
}
atrium = atrium.subtract(union(niches));

const towerFootprint = (() => {
  const { s0, s1, t0, mid, t1, radius } = TOWER;
  const south = CrossSection.square([s1 - s0, mid - t0 + 0.01]).translate([S(s0), T(t0)]);
  const north = CrossSection.hull([
    CrossSection.square([s1 - s0, 0.01]).translate([S(s0), T(mid)]),
    CrossSection.circle(radius).translate([S(s0) + radius, T(t1) - radius]),
    CrossSection.circle(radius).translate([S(s1) - radius, T(t1) - radius]),
  ]);
  return CrossSection.union([south, north]);
})();
const tower = union([
  slab(towerFootprint, BASE, NAP(TOWER.top)),
  boxFromTo(S(SHAFT.s0) - 0.01, S(SHAFT.s1), T(SHAFT.t0), T(SHAFT.t1), BASE, NAP(SHAFT.top)),
]);
const museum = union([oldPart, newPart, atrium]).subtract(tower);

const parts = [
  ["building:museum", museum],
  ["building:collectietoren", tower],
];
const printModel = union([museum, tower]);

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
const glbFile = path.join(outDir, "naturalis.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-naturalis.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant (NAP 0 m) op het printbed.
const stlFile = path.join(outDir, `naturalis-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Naturalis Leiden 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Het maaiveld wordt op de
// straten ten westen, noorden en noordoosten bemonsterd (NAP +0,5 m), niet in
// de sloot aan de oostkant of het water aan de zuidkant.
await writeFile(
  path.join(outDir, "naturalis.json"),
  JSON.stringify(
    {
      name: "Naturalis",
      file: "naturalis.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: U.map((v) => +v.toFixed(5)),
      groundOffsetMetres: 0,
      groundSamplePoints: [
        [S(-6), T(20)],
        [S(-8), T(80)],
        [S(40), T(108)],
        [S(80), T(106)],
        [S(90), T(80)],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0546100000011596"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (92442,03, 464470,42) tussen de collectietoren en de atriumdoos op het maaiveld (NAP +0,5 m), +X langs de gevels van 1998 (RD-richting 2,9 graden) en +Y naar het noorden, naar de nieuwbouw. De vlakke onderkant ligt 0,5 m onder het maaiveld; dat wordt op de straten ten westen, noorden en noordoosten bemonsterd. Vervangt de PDOK-reconstructie van BAG-pand 0546100000011596. Hoogtes per deel uit het AHN; de strata zijn vijf platen (tot NAP +10,8, +16,5, +22,5, +24,8 en +31,4 m) die aan de noord- en oostkant per plaat terugspringen (onder het dak 3,3 en 2 m) en aan de westkant van de noordwestvleugel elk een eigen, tot 3 graden gedraaide gevel hebben (dak 4 m binnen de BAG-gevel), en het opengewerkte gevelpatroon van de atriumdoos is een raster van blinde ruitnissen. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`naturalis-1-${scale}.stl`],
      realWorld: {
        lengthM: 92,
        depthM: 121,
        collectionTowerTopNapM: TOWER.top,
        shaftTopNapM: SHAFT.top,
        atriumTopNapM: ATRIUM.top,
        strataTopNapM: STRATA_TOP,
        strataSlabTopsNapM: STRATA_LAYERS,
        strataSetbackM: { west: 4, north: 3.3, east: 2 },
        westWingNapM: 16.4,
        middleNapM: 25.2,
        officeSlabNapM: 21.4,
        groundNapM: 0.5,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Naturalis_Biodiversity_Center",
        "PDOK BAG pand 0546100000011596 (contour), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de hoogte per deel, de gevel van elke strataplaat en het maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: Nieuwbouw Naturalis Biodiversity Center.jpg, Naturalis-Leiden-2019-1.jpg, Naturalis Leiden gebouw.jpg, Naturalis Biodiversity Center - Museum - Exterior 06 - Museum with collection tower, corner Pesthuis.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

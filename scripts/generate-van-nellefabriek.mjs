// Genereert een vereenvoudigd, gesloten 3D-model van de Van Nellefabriek in
// Rotterdam (Brinkman en Van der Vlugt, 1925-1931, werelderfgoed): de lange
// fabriek met de tabaksfabriek (NAP +31 m) en de theekoepel op het dak, de
// koffie- en theefabriek, de lage hallen erachter, het expeditiegebouw aan de
// Schie, het gebogen kantoorgebouw en het ketelhuis, met de drie loopbruggen
// tussen fabriek en expeditiegebouw. De gebouwen zijn blokken met een vaste
// dakhoogte (uit het AHN-DSM afgelezen) die op hun BAG-contour worden
// afgesneden (PANDEN hieronder), met de verdiepingen als groeven in de lange gevels van de fabriek; de
// theekoepel en de loopbruggen zijn eigen vormen. Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-van-nellefabriek.mjs              # 1:1000 (standaard)
//   node scripts/generate-van-nellefabriek.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: de blokken staan met rechte wanden op
// de onderkant, de groeven hebben een vlakke bovenkant van 0,35 m diep, de
// rand van de theekoepel loopt onder 45 graden uit en de loopbruggen hebben een
// kiel van 50 graden. De bruggen zelf hangen tussen de gebouwen; de export zet
// er een wandje onder.
//
// Assenstelsel: oorsprong op RD (89323,24, 437704,44), tussen de fabriek en
// het expeditiegebouw, op het maaiveld (NAP 0,0 m), Z omhoog, +X naar het
// oosten en +Y naar het noorden (de RD-assen).
//
// Bronnen: BAG-panden 0599100000763318 (fabriek en hallen), 0599100000763320
// (expeditiegebouw), 0599100000763317 (kantoor) en 0599100000763319
// (ketelhuis); AHN DSM/DTM 0,5 m (PDOK WCS); Wikipedia; PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "van-nellefabriek");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP) ----------
const ORIGIN = [89323.24, 437704.44];
const X_AXIS = [1, 0];
const GROUND_NAP = 0.0;
const NAP = (h) => h - GROUND_NAP;
const BASE = NAP(-0.5);
// BAG-contouren van de vier panden (PDOK BAG WFS), in meters ten opzichte van
// de oorsprong.
const PANDEN = {
  "0599100000763317": [
    [130.97,-118.55], [125.59,-118.87], [120.22,-118.57], [114.91,-117.64], [109.75,-116.11], [104.8,-114],
    [100.13,-111.32], [95.8,-108.12], [91.87,-104.45], [88.39,-100.34], [88.23,-100.46], [86.98,-101.41],
    [81.12,-105.89], [80.65,-105.8], [80.16,-105.77], [79.68,-105.78], [79.19,-105.84], [78.72,-105.94],
    [78.26,-106.09], [77.82,-106.29], [77.39,-106.53], [77,-106.8], [73.56,-109.42], [74.68,-110.85],
    [72.2,-112.76], [71.87,-112.35], [50.14,-129.02], [48.59,-130.21], [47.64,-130.93], [46.78,-131.59],
    [41.69,-135.49], [50.42,-146.86], [51.56,-148.43], [53.53,-146.91], [55.65,-145.27], [107.5,-129.48],
    [107.64,-129.08], [108.37,-129.29], [109.17,-129.52], [109.97,-129.74], [110.77,-129.96], [111.58,-130.16],
    [112.39,-130.37], [113.2,-130.56], [114.01,-130.75], [114.82,-130.93], [114.85,-130.87], [115.78,-131.04],
    [116.71,-131.19], [117.65,-131.33], [118.59,-131.44], [119.53,-131.55], [120.48,-131.63], [121.42,-131.7],
    [122.37,-131.74], [123.32,-131.78], [124.11,-131.81], [124.9,-131.83], [125.7,-131.84], [126.49,-131.84],
    [127.28,-131.82], [128.08,-131.8], [128.87,-131.76], [129.66,-131.71], [130.45,-131.65], [132.31,-131.47],
  ],
  "0599100000763318": [
    [34.05,-30.44], [36.55,-28.53], [42.25,-35.92], [45.67,-33.26], [30.65,-13.72], [29.65,-14.49],
    [29.61,-14.43], [27.95,-12.28], [25.94,-13.83], [24.27,-11.69], [22.46,-13.11], [22.28,-12.89],
    [21.19,-13.74], [19.65,-11.69], [20.36,-11.17], [-5.94,23.04], [-6.64,22.52], [-9.72,26.52],
    [-4.25,30.68], [-7.64,35.04], [-5.49,36.69], [-16.37,50.8], [-18.44,49.2], [-21.85,53.53],
    [-28.22,48.67], [-60.55,90.77], [-61.93,89.69], [-63.43,91.57], [-75.91,82.03], [-74.43,80.09],
    [-75.81,79.03], [5.12,-26.32], [-9.88,-37.86], [-20.28,-45.87], [-41.91,-17.72], [-117.05,-75.45],
    [-111.69,-82.43], [-134.37,-99.86], [-102.52,-141.3], [-101.98,-142], [-49.37,-101.62], [-52.25,-97.88],
    [-60.91,-86.63], [-62.92,-84.01], [-28.85,-57.8], [-27.64,-56.86], [-27.43,-56.71], [-27.32,-56.85],
    [-27.5,-56.98], [21.14,-120.13], [54.25,-94.62], [56.82,-97.95], [57.8,-97.2], [60.54,-100.78],
    [61.32,-100.18], [63.73,-103.31], [74.27,-95.18], [71.82,-92], [76.29,-88.57], [76.2,-88.44],
    [76.76,-88], [78.01,-87.02], [78.34,-86.76], [75.01,-82.45], [75.89,-81.76], [75.08,-80.75],
    [74.98,-80.64], [74.87,-80.55], [74.75,-80.47], [74.62,-80.4], [74.48,-80.35], [74.34,-80.32],
    [74.2,-80.31], [74.05,-80.31], [73.91,-80.33], [73.77,-80.38], [73.64,-80.43], [73.51,-80.51],
    [73.4,-80.6], [73.29,-80.7], [73.2,-80.81], [73.13,-80.94], [73.07,-81.07], [73.03,-81.21],
    [72.12,-80.02],
  ],
  "0599100000763319": [
    [80.84,-13.87], [80.77,-13.78], [87.14,-8.89], [78.46,2.4], [78.33,2.3], [75.77,5.67],
    [74.97,6.7], [74.6,7.11], [74.16,7.46], [73.67,7.72], [73.15,7.9], [72.6,7.98],
    [72.04,7.97], [71.5,7.87], [70.98,7.68], [70.5,7.4], [70.07,7.04], [69.72,6.61],
    [69.44,6.14], [69.24,5.62], [69.14,5.07], [69.13,4.52], [69.21,3.97], [69.39,3.44],
    [69.65,2.95], [70.57,1.74], [70.46,1.65], [59.2,-6.88], [51.92,-12.39], [67.28,-32.39],
    [70.46,-29.96], [73.8,-34.32], [74.98,-35.88], [76.24,-37.49], [76.66,-38.02], [90.75,-27.21],
    [85.06,-19.86], [84.35,-18.95], [82.93,-20.07], [80.44,-16.83], [81.46,-16], [81.56,-15.89],
    [81.63,-15.76], [81.7,-15.63], [81.74,-15.49], [81.78,-15.35], [81.79,-15.2], [81.79,-15.05],
    [81.77,-14.91], [81.74,-14.77], [81.69,-14.63], [81.63,-14.49], [81.55,-14.37], [81.45,-14.26],
    [81.35,-14.15], [81.23,-14.06], [81.11,-13.98], [80.98,-13.92],
  ],
  "0599100000763320": [
    [15.38,50.54], [14.36,51.87], [8.1,47.1], [8.27,46.88], [8.33,46.8], [12.51,41.34],
    [13.65,39.85], [25.31,24.63], [26.46,23.13], [33.07,14.5], [35.27,11.63], [38.24,7.76],
    [39.76,5.83], [41.26,3.8], [42.35,2.43], [48.63,7.24], [47.6,8.67], [64,21.15],
    [31.78,63.14],
  ],
};
// De fabriek is opgebouwd uit twee balken die 37,5 graden ten opzichte van de
// RD-assen draaien: de lange balk (tabaks-, thee- en koffiefabriek) loopt in
// de v-richting, de machinehallen in de u-richting. De blokken staan in dit
// gedraaide (u, v)-stelsel (meters ten opzichte van de oorsprong) met een
// kopie van de dakhoogte (NAP, afgerond op 1 m uit het AHN-DSM) en worden
// afgesneden op de BAG-contour van hun pand. `all` is het hele pand op die
// hoogte, `poly` een veelhoek in plaats van een rechthoek.
const ANGLE = 37.5;
const BLOCKS = {
  // Fabriek en hallen.
  "0599100000763318": [
    { all: true, h: 5 },
    // Tabaksfabriek met de trapopbouw en de uitbouw aan de oostkant.
    { u: [-13, 7], v: [-118, -26], h: 31 },
    { u: [7, 14], v: [-46, -26], h: 31 },
    { u: [6, 13], v: [-34, -28], h: 34 },
    // Theefabriek: de westrand 4 m lager, de uitbouw aan de oostkant.
    { u: [-13, -8], v: [-26, 27], h: 20 },
    { u: [-8, 7], v: [-26, 56], h: 24 },
    { u: [7, 17], v: [33, 49], h: 24 },
    // Koffiefabriek.
    { u: [-13, 8], v: [27, 110], h: 13 },
    // Machinehallen: de hoge hal en de lage hal, de loopgang ertussen.
    { u: [-110, -46], v: [-24, 11], h: 14 },
    { u: [-168, -103], v: [-50, 2], h: 9 },
    { u: [-137, -103], v: [2, 11], h: 9 },
    { u: [-103, -13], v: [-28, -25], h: 5 },
    // Hallen ten zuiden van de tabaksfabriek.
    { u: [-56, -13], v: [-108, -28], h: 7 },
    { u: [-32, -13], v: [-97, -36], h: 8 },
  ],
  // Gebogen kantoorgebouw.
  "0599100000763317": [
    { all: true, h: 9 },
    { u: [-50, 3], v: [-150, -133], h: 18 },
    { u: [-12, -4], v: [-146, -133], h: 20 },
    { poly: [[4, -133], [40, -133], [40, -190], [15, -190], [1, -152], [4, -148]], h: 13 },
  ],
  // Ketelhuis en expeditiegebouw.
  "0599100000763319": [{ all: true, h: 5 }],
  "0599100000763320": [{ all: true, h: 13 }],
};
// Theekoepel op de tabaksfabriek (AHN-DSM): glazen cilinder van 5,6 m straal
// van het dak (+31 m) tot +36,5 m, dakrand 0,5 m uit onder 45 graden tot +37,2
// m, en de trapopbouw aan de noordkant tot +40 m.
const TEA = { c: [65.8, -89.5], r: 5.6, roof: 31, top: 36.5, rim: 0.5, rimTop: 37.2 };
const TEA_STAIR = { c: [67.5, -86], r: 1.2, top: 40 };
// Loopbruggen [begin, eind, bovenkant NAP aan begin en eind, breedte, hoogte]
// (AHN-DSM): twee van de koffiefabriek naar het expeditiegebouw en de lange
// van de tabaksfabriek omlaag naar het expeditiegebouw.
const BRIDGES = [
  { name: "koffiefabriek noord", a: [-9, 24], b: [14, 40.5], top: [10.5, 10.5], width: 2.6, height: 3 },
  { name: "koffiefabriek zuid", a: [2, 5.5], b: [27, 23.5], top: [10.5, 10.5], width: 2.6, height: 3 },
  { name: "tabaksfabriek", a: [38.6, -41], b: [35.4, 8], top: [22, 14], width: 2.2, height: 3 },
];
const KEEL_DEG = 50;
// Verdiepingen als groeven in de lange gevels van de fabriek: om de 4,2 m
// vanaf +4,5 m, 0,5 m hoog en 0,35 m diep, op elke gevel van minstens 25 m met
// een dak hoger dan NAP +20 m.
const FLOORS = { first: 4.5, step: 4.2, height: 0.5, depth: 0.35, minEdge: 25, minRoof: 20 };
// Maaiveld (AHN NAP 0 tot +0,3 m): de straat tussen de tabaksfabriek en het
// expeditiegebouw.
const GROUND_SAMPLES = [[75, -60], [60, -30], [20, 0]];

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
const cylinder = ([cx, cy], r, z0, z1) =>
  Manifold.cylinder(z1 - z0, r, r, 48).translate([cx, cy, z0]);

// ---------- gebouwen ----------
const rad = (ANGLE * Math.PI) / 180;
const toUv = ([x, y]) => [x * Math.cos(rad) + y * Math.sin(rad), -x * Math.sin(rad) + y * Math.cos(rad)];
const inPoly = ([x, y], poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const blockPoly = (b) => b.poly ?? [[b.u[0], b.v[0]], [b.u[1], b.v[0]], [b.u[1], b.v[1]], [b.u[0], b.v[1]]];
// Dakhoogte (NAP) op een punt: de hoogste blok van het pand waarin het ligt.
const roofAt = (x, y) => {
  const uv = toUv([x, y]);
  let best = NAP(0);
  for (const [id, ring] of Object.entries(PANDEN)) {
    if (!inPoly([x, y], ring)) continue;
    for (const b of BLOCKS[id]) if (b.all || inPoly(uv, blockPoly(b))) best = Math.max(best, NAP(b.h));
  }
  return best;
};
const blockSolid = (b, ring) => {
  if (b.all) return prism(ring, BASE, NAP(b.h));
  const solid = prism(blockPoly(b), BASE, NAP(b.h)).rotate([0, 0, ANGLE]);
  return Manifold.intersection(solid, prism(ring, BASE, 200));
};
const buildings = Manifold.union(
  Object.entries(PANDEN).flatMap(([id, ring]) => BLOCKS[id].map((b) => blockSolid(b, ring))),
);
// Groeven per verdieping in de lange gevels van de fabriek.
const grooves = [];
const grooveTops = new Set();
const factory = PANDEN["0599100000763318"];
const inward = ccw(factory) === factory ? 1 : -1;
factory.forEach((p, i) => {
  const q = factory[(i + 1) % factory.length];
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
  if (len < FLOORS.minEdge) return;
  const d = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
  // Binnenkant: links van de rand bij een ring tegen de klok in.
  const n = [-d[1] * inward, d[0] * inward];
  const mid = [(p[0] + q[0]) / 2 + n[0] * 3, (p[1] + q[1]) / 2 + n[1] * 3];
  const roof = roofAt(mid[0], mid[1]);
  if (roof < NAP(FLOORS.minRoof)) return;
  for (let z = NAP(FLOORS.first); z + FLOORS.height < roof - 2; z += FLOORS.step) {
    const a0 = 1;
    const a1 = len - 1;
    const corner = (a, depth) => [p[0] + d[0] * a + n[0] * depth, p[1] + d[1] * a + n[1] * depth];
    grooves.push(prism([corner(a0, -1), corner(a1, -1), corner(a1, FLOORS.depth), corner(a0, FLOORS.depth)], z, z + FLOORS.height));
    grooveTops.add((z + FLOORS.height).toFixed(2));
  }
});
const tea = Manifold.union([
  cylinder(TEA.c, TEA.r, NAP(TEA.roof) - 0.5, NAP(TEA.top)),
  Manifold.hull([
    Manifold.cylinder(TEA.rim, TEA.r, TEA.r + TEA.rim, 48).translate([TEA.c[0], TEA.c[1], NAP(TEA.top) - 0.01]),
    cylinder(TEA.c, TEA.r + TEA.rim, NAP(TEA.top) + TEA.rim, NAP(TEA.rimTop)),
  ]),
  cylinder(TEA_STAIR.c, TEA_STAIR.r, NAP(TEA.top), NAP(TEA_STAIR.top)),
]);
// Loopbrug: koker met een kiel van 50 graden eronder, aan beide kanten 1 m de
// gebouwen in.
const bridge = ({ a, b, top, width, height }) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const n = [-d[1], d[0]];
  const keel = (width / 2) * Math.tan((KEEL_DEG * Math.PI) / 180);
  const section = (s, z) => {
    const c = [a[0] + d[0] * s, a[1] + d[1] * s];
    const w = width / 2;
    const zt = NAP(z);
    const zb = zt - height;
    return [
      [c[0] + n[0] * w, c[1] + n[1] * w, zt],
      [c[0] - n[0] * w, c[1] - n[1] * w, zt],
      [c[0] - n[0] * w, c[1] - n[1] * w, zb],
      [c[0] + n[0] * w, c[1] + n[1] * w, zb],
      [c[0], c[1], zb - keel],
    ];
  };
  return Manifold.hull([...section(-1, top[0]), ...section(len + 1, top[1])]);
};
const bridges = BRIDGES.map(bridge);
const complex = Manifold.union([buildings.subtract(Manifold.union(grooves)), tea, ...bridges]);

const nodes = [["building:fabriek", complex]];
const all = complex;

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of nodes) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen,
  // behalve de bovenkant van de groeven.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (grooveTops.has(z.toFixed(2))) continue;
      throw new Error(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))}`);
    }
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
console.log("groeven:", grooves.length);
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
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "van-nellefabriek.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-van-nellefabriek.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `van-nellefabriek-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Van Nellefabriek Rotterdam 1:${scale} mm Z-up`);
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

// Grondplaat van 1 m (1 mm op 1:1000) onder het kantoor en het ketelhuis, die
// los van de fabriek staan.
const allBox = all.boundingBox();
const plateSolid = Manifold.union([all, Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1])]).translate([0, 0, -(BASE - 1)]);
const plateFile = path.join(outDir, `van-nellefabriek-grondplaat-1-${scale}.stl`);
const plate = toStl(plateSolid, `NederPrint Van Nellefabriek grondplaat 1:${scale} mm Z-up`);
await writeFile(plateFile, plate.buffer);
report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };

const hallBox = complex.boundingBox();
await writeFile(
  path.join(outDir, "van-nellefabriek.json"),
  JSON.stringify(
    {
      name: "Van Nellefabriek",
      file: "van-nellefabriek.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: 0,
      // Op de straat tussen de tabaksfabriek en het expeditiegebouw (NAP 0 tot
      // +0,3 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: Object.keys(PANDEN).map((id) => `NL.IMBAG.Pand.${id}`),
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (89323,24, 437704,44), tussen de fabriek en het expeditiegebouw, op het maaiveld (NAP 0 m), +X naar het oosten en +Y naar het noorden. Eén node building:fabriek: de fabriek met de tabaksfabriek (NAP +31 m), de koffie- en theefabriek en de lage hallen, het expeditiegebouw, het gebogen kantoorgebouw en het ketelhuis als 18 blokken met een vaste dakhoogte (uit het AHN-DSM) op hun BAG-contouren, met de verdiepingen als groeven van 0,35 m in de lange gevels van de fabriek; de theekoepel op de tabaksfabriek (cilinder van 5,6 m straal tot +36,5 m met een dakrand onder 45 graden tot +37,2 m en de trapopbouw tot +40 m) en de drie loopbruggen naar het expeditiegebouw als kokers met een kiel van 50 graden. Onderkant op NAP -0,5 m; alleen de bovenkant van de groeven is vlak, de bruggen hangen tussen de gebouwen. Vervangt de PDOK-reconstructie van de vier BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`van-nellefabriek-1-${scale}.stl`, `van-nellefabriek-grondplaat-1-${scale}.stl`],
      realWorld: {
        lengthM: +(hallBox.max[0] - hallBox.min[0]).toFixed(2),
        widthM: +(hallBox.max[1] - hallBox.min[1]).toFixed(2),
        highestPointNapM: +(hallBox.max[2] + GROUND_NAP).toFixed(2),
        blockCount: Object.values(BLOCKS).flat().length,
        rotationDeg: ANGLE,
        tobaccoFactoryRoofNapM: TEA.roof,
        teaRoomTopNapM: TEA.rimTop,
        teaRoomRadiusM: TEA.r,
        bridges: BRIDGES.map((b) => ({ name: b.name, topNapM: b.top })),
        groundNapM: GROUND_NAP,
        baseNapM: -0.5,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Van_Nellefabriek",
        "PDOK BAG panden 0599100000763318 (fabriek en hallen), 0599100000763320 (expeditiegebouw), 0599100000763317 (kantoor), 0599100000763319 (ketelhuis), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: de dakhoogtes en blokgrenzen, de theekoepel, de loopbruggen en het maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van de Pier van Scheveningen
// (1961, vernieuwd in 2015): de pier van bijna 300 m op pijlerjukken met het
// hogere middendeel, de kop, het zuidereiland met het gebouw, de tak naar het
// torenreiland met de uitkijktoren, en het reuzenrad op het lage platform aan
// de oostkant. Alle maten in het script zijn meters op ware grootte. Uitvoer:
// een GLB in meters (Y omhoog, nodes met de materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-pier-scheveningen.mjs              # 1:1000 (standaard)
//   node scripts/generate-pier-scheveningen.mjs --scale 2000
//
// Printbaar op 1:1000: de eilanden, het platform en de toren staan op de
// onderkant; de dekken van de pier en de tak hangen tussen pijlerjukken van
// 1,2 m dik om de 20 m, en de export zet onder de vlakke onderkant van die
// dekken en onder de bovenkant van het reuzenrad een wig met een wandje. Het
// script laat alleen die ondervlakken toe.
//
// Assenstelsel: oorsprong op RD (79166,88, 459355,50), bij de kop van de pier,
// op het zeeoppervlak van het PDOK-terrein (NAP -0,45 m), Z omhoog, +X naar het oosten en
// +Y naar het noorden (de RD-assen). De pier loopt van het strand in het
// zuidoosten naar de kop in het noordwesten.
//
// Bronnen: BAG-panden 0518100001644879 (pier), 0518100001647057 (zuidereiland)
// en 0518100000255328 (torenreiland); AHN DSM/DTM 0,5 m (PDOK WCS): dekken,
// gebouwen, toren, reuzenrad en strand; Wikipedia; PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "pier-scheveningen");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP + 0,45 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [79166.88, 459355.5];
const X_AXIS = [1, 0];
// Zeeoppervlak in het PDOK-terrein: 42,95 m ellipsoïdisch tegen 48,0 m op het
// strand, waar het AHN NAP +4,6 m geeft.
const GROUND_NAP = -0.45;
const NAP = (h) => h - GROUND_NAP;
// Onderkant op NAP -1 m, onder de zeespiegel.
const BASE = NAP(-1);
// BAG-contouren (lokaal, op 0,01 m).
const PIER = [
  [48.01, -28.55], [48.39, -27.02], [38.7, -17.94], [33.8, -15.12], [21.95, -3.91], [4.41, 12.6], [2.32, 14.63],
  [0.94, 15.69], [-0.79, 16.42], [-2.67, 16.68], [-4.49, 16.47], [-5.77, 16.05], [-7.09, 15.33], [-8.05, 14.35],
  [-9.31, 12.96], [-10.23, 9.89], [-9.77, 6.58], [-8.94, 5.45], [-7.94, 4.07], [-1.83, -1.42], [83.39, -82.0],
  [158.7, -153.75], [208.23, -204.89], [209.9, -204.05], [222.29, -191.23], [222.84, -189.18], [168.94, -142.9],
];
const TOWER_ISLAND = [
  [6.79, 57.75], [8.27, 60.84], [8.89, 63.68], [8.96, 65.83], [8.78, 67.68], [8.28, 69.45], [7.06, 72.28], [6.2, 73.73],
  [4.95, 72.36], [2.81, 73.99], [0.2, 75.01], [-2.54, 75.39], [-3.72, 75.33], [-5.41, 76.5], [-8.19, 75.55], [-10.62, 73.82],
  [-12.53, 71.27], [-13.85, 67.77], [-14.31, 64.29], [-13.94, 60.66], [-13.53, 59.01], [-12.06, 59.38], [-10.14, 56.44],
  [-7.18, 54.03], [-3.54, 52.85], [-1.46, 52.84], [1.67, 53.59], [4.95, 55.57],
];
// Zuidereiland: de BAG-contour (op 0,2 m vereenvoudigd) en dezelfde contour
// 5 en 12 m naar binnen (shapely buffer) voor het gebouw en het dak.
const SOUTH_RIM = [
  [-12.97, -16.3], [-15.7, -10.94], [-23.33, 0.38], [-19.89, 2.7], [-17.13, 3.35], [-15.95, -1.37], [-13.44, -0.76],
  [-14.6, 4.01], [-8.94, 5.45], [-9.77, 6.58], [-10.23, 9.89], [-36.3, 3.44], [-36.06, 2.46], [-37.48, -1.89],
  [-39.61, -1.39], [-41.82, -1.48], [-43.93, -2.03], [-45.85, -3.0], [-47.52, -4.38], [-48.87, -6.1], [-49.82, -8.09],
  [-50.22, -10.09], [-61.08, -8.89], [-62.42, -22.96], [-62.22, -29.23], [-55.99, -28.14], [-54.73, -35.91],
  [-53.98, -38.38], [-52.82, -40.74], [-49.73, -44.92], [-45.65, -48.14], [-43.35, -49.34], [-38.33, -50.74],
  [-35.74, -50.95], [-30.59, -50.36], [-28.11, -49.56], [-23.6, -47.02], [-19.9, -43.44], [-18.41, -41.28],
  [-16.37, -36.54], [-15.62, -31.4], [-16.2, -26.26], [-18.74, -18.9],
];
const SOUTH_WALL = [
  [-31.8, -0.6], [-29.14, 0.06], [-19.81, -13.9], [-24.96, -16.22], [-21.11, -27.38], [-20.66, -31.33], [-21.22, -35.16],
  [-22.8, -38.85], [-23.73, -40.19], [-26.62, -42.98], [-30.13, -44.95], [-31.65, -45.45], [-35.83, -45.93], [-37.45, -45.8],
  [-41.5, -44.66], [-42.92, -43.92], [-46.1, -41.41], [-48.53, -38.13], [-49.85, -34.77], [-51.86, -22.35], [-57.4, -23.31],
  [-56.58, -14.42], [-46.24, -15.56], [-45.04, -9.69], [-43.92, -7.89], [-42.15, -6.73], [-40.08, -6.42], [-34.15, -7.8],
];
const SOUTH_ROOF = [
  [-44.7, -22.77], [-40.66, -23.22], [-38.76, -13.91], [-32.67, -15.33], [-27.98, -28.93], [-27.72, -31.21], [-28.01, -33.25],
  [-29.09, -35.64], [-30.83, -37.32], [-32.95, -38.51], [-35.94, -38.9], [-38.92, -38.12], [-41.03, -36.49], [-42.53, -34.47],
  [-43.02, -33.18],
];
// Dekken (AHN-DSM): de pier met de onderkant op NAP +11 m en het dek op
// +13,5 m, het middendeel van 7 m breed op +17 m (de 60 m bij de kop), +15,5 m
// (tot 125 m) en +14,5 m (naar het strand); de as van de kop naar het strand.
const DECK = { bottom: 11, top: 13.5 };
const AXIS = { a: [2, 6], b: [215.5, -197] };
const SPINE = [
  { from: 0, to: 60, width: 7, top: 17 },
  { from: 60, to: 125, width: 7, top: 15.5 },
  { from: 125, to: 300, width: 7, top: 14.5 },
];
const BENT = { step: 20, thick: 1.2 };
// Kop van de pier: kiosk tot +21 m.
const HEAD_KIOSK = { c: [3.5, 5], r: 4, top: 21 };
// Tak naar het torenreiland: 8 m breed, dek +12,5 m, onderkant +10 m.
const BRANCH = { a: [-10.5, 12], b: [-6.5, 54], width: 8, bottom: 10, top: 12.5 };
// Loopbrug van de kop naar het zuidereiland (AHN-DSM 12 tot 16 m): 8 m breed,
// dek +12,5 m, onderkant +10 m.
const LINK = { a: [-1, 2], b: [-36, 2], width: 8 };
// Zuidereiland (AHN-DSM, mediaan langs de ingesprongen contouren: 12,3 m op de
// rand, 15,7 m op 6 m, 19,8 m op 12 m): rand +12,3 m, gebouw tot +15,5 m en
// het dak tot +20 m.
const SOUTH = { rim: 12.3, wall: 15.5, roof: 20 };
// Torenreiland: dek +15 m, kiosk tot +19 m, toren met straal 4 m tot +42 m,
// uitkijkcabine met straal 5,5 m (45 graden kraag) tot +48 m en de mast tot
// +53 m (AHN-DSM 41 tot 54 m).
const TOWER_DECK = 15;
const KIOSK = { x: [-14, -4], y: [58, 72], top: 19 };
const TOWER = { c: [3, 65], r: 4, top: 42, cabin: 5.5, cabinTop: 48, mast: 1, mastTop: 53 };
// Platform van het reuzenrad (+9 m, 44 bij 14 m langs het rad) met de aanloop
// van de pier (van +12 naar +8 m).
const WHEEL_DECK = { c: [66, 11], length: 44, width: 14, top: 9 };
const WHEEL_JETTY = { a: [36, -18], b: [64, -4], width: 5, start: 12, top: 8 };
// Reuzenrad: middelpunt (65,5, 12), vlak langs RD-richting -77 graden, straal
// 20 m, naaf op NAP +28,5 m (top +48,5 m in het AHN), ring 1,4 m breed en
// 1,5 m dik, acht spaken van 1 m en een A-bok van twee poten.
const WHEEL = { c: [65.5, 12], dir: -77, r: 20, hub: 28.5, ring: 1.4, thick: 1.5, spokes: 8, spoke: 1, legSpread: 14 };
// Maaiveld: het zeeoppervlak rond de kop van de pier en één punt op het natte
// strand halverwege (AHN NAP +2 m), dicht genoeg bij het model om in elke
// uitsnede met een flink stuk pier te vallen; punten bij het begin op het
// droge strand vielen buiten de geladen terreintegels.
const GROUND_SAMPLES = [[30, 40], [-80, 10], [0, -40], [30, -60], [100, -120]];

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
const strip = ([ax, ay], [bx, by], width, s0, s1) => {
  const len = Math.hypot(bx - ax, by - ay);
  const d = [(bx - ax) / len, (by - ay) / len];
  const n = [-d[1] * (width / 2), d[0] * (width / 2)];
  const p = (s) => [ax + d[0] * s, ay + d[1] * s];
  const [p0, p1] = [p(s0), p(Math.min(s1, len))];
  return [[p0[0] + n[0], p0[1] + n[1]], [p1[0] + n[0], p1[1] + n[1]], [p1[0] - n[0], p1[1] - n[1]], [p0[0] - n[0], p0[1] - n[1]]];
};
const circle = (c, r, n = 32) => Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos((2 * Math.PI * k) / n), c[1] + r * Math.sin((2 * Math.PI * k) / n)]);

// ---------- pier ----------
const axisLen = Math.hypot(AXIS.b[0] - AXIS.a[0], AXIS.b[1] - AXIS.a[1]);
const pierOutline = prism(PIER, BASE - 1, 100);
const deck = prism(PIER, NAP(DECK.bottom), NAP(DECK.top));
const spine = SPINE.map((s) => Manifold.intersection(pierOutline, prism(strip(AXIS.a, AXIS.b, s.width, s.from, s.to), NAP(DECK.top) - 0.01, NAP(s.top))));
// Pijlerjukken dwars op de as, op het BAG-dek afgesneden.
const bents = [];
for (let s = 10; s < axisLen - 5; s += BENT.step) {
  bents.push(Manifold.intersection(pierOutline, prism(strip(AXIS.a, AXIS.b, 40, s - BENT.thick / 2, s + BENT.thick / 2), BASE, NAP(DECK.bottom) + 0.01)));
}
const kiosk = prism(circle(HEAD_KIOSK.c, HEAD_KIOSK.r), NAP(DECK.top) - 0.01, NAP(HEAD_KIOSK.top));
const branchLen = Math.hypot(BRANCH.b[0] - BRANCH.a[0], BRANCH.b[1] - BRANCH.a[1]);
const branch = prism(strip(BRANCH.a, BRANCH.b, BRANCH.width, -2, branchLen + 4), NAP(BRANCH.bottom), NAP(BRANCH.top));
const linkLen = Math.hypot(LINK.b[0] - LINK.a[0], LINK.b[1] - LINK.a[1]);
const link = prism(strip(LINK.a, LINK.b, LINK.width, 0, linkLen), NAP(BRANCH.bottom), NAP(BRANCH.top));
const linkBents = [12, 22].map((s) => prism(strip(LINK.a, LINK.b, LINK.width, s - BENT.thick / 2, s + BENT.thick / 2), BASE, NAP(BRANCH.bottom) + 0.01));
const branchBents = [];
for (let s = 12; s < branchLen - 2; s += BENT.step) branchBents.push(prism(strip(BRANCH.a, BRANCH.b, BRANCH.width, s - BENT.thick / 2, s + BENT.thick / 2), BASE, NAP(BRANCH.bottom) + 0.01));
// Zuidereiland met het gebouw.
const southIsland = Manifold.union([
  prism(SOUTH_RIM, BASE, NAP(SOUTH.rim)),
  prism(SOUTH_WALL, NAP(SOUTH.rim) - 0.01, NAP(SOUTH.wall)),
  Manifold.intersection(
    Manifold.hull([
      ...SOUTH_WALL.map(([x, y]) => [x, y, NAP(SOUTH.wall) - 0.01]),
      ...SOUTH_ROOF.map(([x, y]) => [x, y, NAP(SOUTH.roof)]),
    ]),
    prism(SOUTH_WALL, NAP(SOUTH.wall) - 0.02, 100),
  ),
]);
// Torenreiland met kiosk en toren.
const towerIsland = Manifold.union([
  prism(TOWER_ISLAND, BASE, NAP(TOWER_DECK)),
  Manifold.intersection(prism(TOWER_ISLAND, BASE, 100), prism([[KIOSK.x[0], KIOSK.y[0]], [KIOSK.x[1], KIOSK.y[0]], [KIOSK.x[1], KIOSK.y[1]], [KIOSK.x[0], KIOSK.y[1]]], NAP(TOWER_DECK) - 0.01, NAP(KIOSK.top))),
  prism(circle(TOWER.c, TOWER.r), NAP(TOWER_DECK) - 0.01, NAP(TOWER.top)),
  Manifold.hull([
    ...circle(TOWER.c, TOWER.r).map(([x, y]) => [x, y, NAP(TOWER.top) - 0.01]),
    ...circle(TOWER.c, TOWER.cabin).map(([x, y]) => [x, y, NAP(TOWER.top) + TOWER.cabin - TOWER.r]),
    ...circle(TOWER.c, TOWER.cabin).map(([x, y]) => [x, y, NAP(TOWER.cabinTop)]),
  ]),
  prism(circle(TOWER.c, TOWER.mast, 12), NAP(TOWER.cabinTop) - 0.01, NAP(TOWER.mastTop)),
]);
// Platform en aanloop van het reuzenrad.
const jettyLen = Math.hypot(WHEEL_JETTY.b[0] - WHEEL_JETTY.a[0], WHEEL_JETTY.b[1] - WHEEL_JETTY.a[1]);
const wheelDeck = Manifold.union([
  prism(
    strip(
      [WHEEL_DECK.c[0] - Math.cos((WHEEL.dir * Math.PI) / 180) * 22, WHEEL_DECK.c[1] - Math.sin((WHEEL.dir * Math.PI) / 180) * 22],
      [WHEEL_DECK.c[0] + Math.cos((WHEEL.dir * Math.PI) / 180) * 22, WHEEL_DECK.c[1] + Math.sin((WHEEL.dir * Math.PI) / 180) * 22],
      WHEEL_DECK.width,
      0,
      WHEEL_DECK.length,
    ),
    BASE,
    NAP(WHEEL_DECK.top),
  ),
  // Aanloop als helling van het pierdek (+12 m) omlaag naar het platform.
  Manifold.hull([
    prism(strip(WHEEL_JETTY.a, WHEEL_JETTY.b, WHEEL_JETTY.width, 0, 0.5), BASE, NAP(WHEEL_JETTY.start)),
    prism(strip(WHEEL_JETTY.a, WHEEL_JETTY.b, WHEEL_JETTY.width, jettyLen - 0.5, jettyLen), BASE, NAP(WHEEL_JETTY.top)),
  ]),
]);
const pier = Manifold.union([deck, ...spine, ...bents, kiosk, branch, ...branchBents, link, ...linkBents, southIsland, towerIsland, wheelDeck]);

// ---------- reuzenrad ----------
// In het vlak (u, z) met u langs de richting van het rad, daarna gedraaid.
const ringSection = new CrossSection([circle([0, 0], WHEEL.r, 64)]).subtract(new CrossSection([circle([0, 0], WHEEL.r - WHEEL.ring, 64)]));
const spokes = Array.from({ length: WHEEL.spokes }, (_, k) =>
  CrossSection.square([2 * WHEEL.r - WHEEL.ring, WHEEL.spoke], true).rotate((180 / WHEEL.spokes) * k),
);
const wheelSection = CrossSection.union([ringSection, ...spokes, new CrossSection([circle([0, 0], 1.8, 16)])]);
// Poten: driehoek van de naaf naar het platform, aan beide kanten van het rad.
const legs = new CrossSection([
  [[-WHEEL.legSpread / 2, -(WHEEL.hub - WHEEL_DECK.top)], [WHEEL.legSpread / 2, -(WHEEL.hub - WHEEL_DECK.top)], [0.8, 0], [-0.8, 0]],
]).subtract(new CrossSection([[[-WHEEL.legSpread / 2 + 2.2, -(WHEEL.hub - WHEEL_DECK.top) - 1], [WHEEL.legSpread / 2 - 2.2, -(WHEEL.hub - WHEEL_DECK.top) - 1], [0, -4]]]));
const toWorld = (m) =>
  m
    .rotate([90, 0, 0])
    .rotate([0, 0, WHEEL.dir])
    .translate([WHEEL.c[0], WHEEL.c[1], NAP(WHEEL.hub)]);
const wheel = Manifold.union([
  toWorld(Manifold.extrude(wheelSection, WHEEL.thick).translate([0, 0, -WHEEL.thick / 2])),
  ...[-1, 1].map((side) => toWorld(Manifold.extrude(legs, 1).translate([0, 0, side * (WHEEL.thick / 2 + 0.5) - 0.5]))),
]);

const nodes = [
  ["building:pier", pier],
  ["building:reuzenrad", wheel],
];
const all = Manifold.union([pier, wheel]);

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
{
  // In de pier mogen alleen de onderkanten van de dekken naar beneden wijzen;
  // het reuzenrad wordt niet gecontroleerd (de export vult onder de ring).
  const allowed = new Set([NAP(DECK.bottom), NAP(BRANCH.bottom)].map((z) => z.toFixed(2)));
  const mesh = pier.getMesh();
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
      if (allowed.has(z.toFixed(2))) continue;
      throw new Error(`pier: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))}`);
    }
  }
  if (pier.decompose().length !== 1) throw new Error("pier: niet één samenhangend deel");
  for (const [name, solid] of nodes) {
    const bb = solid.boundingBox();
    if (bb.min[2] < BASE - 1e-6) throw new Error(`${name}: onder de onderkant op ${bb.min[2]}`);
  }
}
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
const glbFile = path.join(outDir, "pier-scheveningen.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-pier-scheveningen.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `pier-scheveningen-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Pier van Scheveningen Den Haag 1:${scale} mm Z-up`);
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

const hallBox = all.boundingBox();
await writeFile(
  path.join(outDir, "pier-scheveningen.json"),
  JSON.stringify(
    {
      name: "Pier van Scheveningen",
      file: "pier-scheveningen.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: 0,
      // Op het zeeoppervlak rond de kop en het natte strand halverwege.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0518100001644879", "NL.IMBAG.Pand.0518100001647057", "NL.IMBAG.Pand.0518100000255328"],
      replacesTerrain: [
        "G0518.08d6e6f0b63d653ae0502a0a313c2ff8",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (79166,88, 459355,50), bij de kop van de pier, op het zeeoppervlak van het PDOK-terrein (NAP -0,45 m), +X naar het oosten en +Y naar het noorden. Node building:pier: het dek op de BAG-contour (onderkant NAP +11 m, dek +13,5 m) met het middendeel van 7 m breed (+17 m bij de kop, +15,5 en +14,5 m naar het strand) op pijlerjukken van 1,2 m om de 20 m, de kiosk op de kop, de loopbrug naar het zuidereiland en de tak naar het torenreiland (dekken +12,5 m), het zuidereiland op de BAG-contour (rand +12,3 m, gebouw tot +15,5 m en het dak tot +20 m), het torenreiland (+15 m) met de kiosk en de uitkijktoren (tot +42 m, cabine tot +48 m, mast tot +53 m) en het platform met de aanloop voor het reuzenrad (+8 en +9 m). Node building:reuzenrad: het rad van 40 m met acht spaken (naaf +28,5 m, top +48,5 m) op een A-bok. Onderkant op NAP -1 m; de export zet onder de dekken en de bovenkant van het rad een wig met een wandje. Vervangt de PDOK-reconstructie van de drie BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`pier-scheveningen-1-${scale}.stl`],
      realWorld: {
        lengthM: +(hallBox.max[0] - hallBox.min[0]).toFixed(2),
        widthM: +(hallBox.max[1] - hallBox.min[1]).toFixed(2),
        highestPointNapM: +(hallBox.max[2] + GROUND_NAP).toFixed(2),
        pierLengthM: +axisLen.toFixed(1),
        deckNapM: DECK.top,
        towerTopNapM: TOWER.mastTop,
        wheelTopNapM: WHEEL.hub + WHEEL.r,
        wheelDiameterM: 2 * WHEEL.r,
        groundNapM: GROUND_NAP,
        baseNapM: -1,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Pier_van_Scheveningen",
        "PDOK BAG panden 0518100001644879 (pier), 0518100001647057 (zuidereiland) en 0518100000255328 (torenreiland), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dekken, gebouwen, toren, reuzenrad en strand",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van het Kurhaus in
// Scheveningen (J.F. Henkenhaf en F. Ebert, 1885): de lange hoofdvleugel met
// het flauwe schilddak, de twee kopvleugels naar zee, het middenblok met de grote
// achtkante koepel boven de Kurzaal, de lantaarn en de vier hoektorentjes, het
// portaal met frontonnetje aan het Gevers Deynootplein, een kroonlijst en
// lisenen langs de hoofdvleugel, blinde vensters op alle gevels, nissen in de
// koepeltrommel en de lage vleugels en terrassen naar zee. Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, één node met de materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-kurhaus.mjs              # 1:1000 (standaard)
//   node scripts/generate-kurhaus.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken en de
// koepel lopen alleen omhoog en de torentjes staan op het middenblok. Alleen
// de blinde vensters hebben een vlakke bovenkant van 0,35 m diep.
//
// Assenstelsel: oorsprong op RD (79287,66, 458896,00), in het middenblok, op
// het maaiveld van het Gevers Deynootplein (NAP +9,0 m), Z omhoog. +X loopt
// langs de hoofdvleugel naar het noordoosten (RD-richting 46,4 graden); +Y
// wijst naar het noordwesten, de zee. Het plein ligt aan de -Y-kant.
//
// Bronnen: BAG-pand 0518100000205738; AHN DSM/DTM 0,5 m (PDOK WCS): goten,
// nokken, de koepel, de torentjes, de lage vleugels en het maaiveld;
// Wikipedia; PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kurhaus");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 9,0 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [79287.66, 458896.0];
const AXIS_DEG = 46.4;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 9.0;
const NAP = (h) => h - GROUND_NAP;
const BASE = NAP(8.5);
// BAG-contour (lokaal, op 0,3 m vereenvoudigd).
const PAND = [
  [-73.21, 48.05], [-73.6, 46.55], [-73.16, 46.54], [-73.18, 43.83], [-72.38, 43.84], [-72.38, 41.57], [-74.0, 41.55],
  [-74.01, 35.01], [-61.4, 35.0], [-61.37, 14.58], [-74.01, 14.55], [-74.02, -5.92], [-65.97, -5.95], [-65.64, -8.89],
  [-63.96, -10.98], [-62.73, -11.57], [-47.58, -11.76], [-45.85, -11.47], [-42.83, -9.77], [-22.46, -9.8], [-22.16, -16.52],
  [-20.51, -19.17], [-19.24, -20.09], [-16.22, -20.87], [-16.21, -16.77], [-11.86, -16.77], [-11.87, -16.21], [-11.19, -16.21],
  [-11.18, -15.21], [-6.24, -15.2], [-6.24, -19.14], [-2.14, -23.23], [-1.21, -23.23], [0.43, -24.47], [1.35, -24.42],
  [2.73, -23.24], [3.66, -23.23], [7.77, -19.13], [7.76, -15.21], [12.69, -15.21], [12.69, -16.21], [13.37, -16.2],
  [13.37, -16.76], [17.93, -16.76], [17.93, -20.92], [20.93, -20.05], [22.17, -19.08], [23.74, -16.38], [23.97, -9.74],
  [32.83, -9.75], [32.82, -17.08], [62.89, -17.07], [62.89, -11.77], [65.46, -10.96], [67.16, -8.86], [67.51, -5.88],
  [67.45, 48.17], [26.12, 48.83], [25.96, 57.38], [17.63, 57.37], [17.62, 56.26], [15.2, 56.28], [15.1, 58.36],
  [13.85, 59.62], [4.67, 59.6], [3.42, 58.37], [3.43, 51.71], [-1.88, 51.58], [-1.95, 58.33], [-3.19, 59.6],
  [-12.36, 59.59], [-13.61, 58.35], [-13.6, 57.27], [-16.13, 57.28], [-16.16, 48.17],
];
// Lage delen op de BAG-contour (AHN-DSM, mediaan per deel): alles minstens
// +10,5 m (het paviljoen aan zee), de stroken aan het plein +12 m, het
// westelijke bijgebouw +13 en +15,5 m en de vleugels naar zee +16,5 m.
const LOW = [
  { x: [-80, 70], y: [-30, 70], top: 10.5 },
  { x: [-80, 70], y: [-30, -5], top: 12 },
  { x: [63.5, 70], y: [-30, 70], top: 12 },
  { x: [-80, -61.4], y: [-5, 14.6], top: 13 },
  { x: [-80, -61.4], y: [35, 50], top: 15.5 },
  { x: [-61.4, -16], y: [13.5, 48], top: 16.5 },
  { x: [26, 63.5], y: [13.5, 48], top: 16.5 },
  { x: [-16, 26], y: [13.5, 33], top: 17.5 },
  { x: [-16, 26], y: [33, 48], top: 12 },
];
// Hoofdvleugel: muren tot de goot op +29 m en een flauw schilddak met het
// platte bovendak op +33 m (AHN-DSM: goot 29 m, +31 m op 2 m, +32 m op 3 m en
// +33 m op 6 m uit de gevels).
const MAIN = { x: [-61.5, 63.5], y: [-5, 13.5], eave: 29, break: 32, top: 33, inset: 3, topInset: 6 };
// Kopvleugels naar zee met een zadeldak dwars op de hoofdvleugel (nok +34 m).
const END_WINGS = [
  { x: [-61.5, -48.5], y: [-5, 37], ridgeX: -55 },
  { x: [48.5, 63.5], y: [-5, 37], ridgeX: 55.5 },
];
const END_WING = { eave: 29, ridge: 34 };
// Middenblok: plat tot +31,5 m.
const CENTRE = { x: [-18, 20], y: [-15.5, 22.5], top: 31.5 };
// Grote koepel (AHN-DSM, mediaan per meter straal om het zwaartepunt van de
// koepel): achtkant om (0,7, 2,5), tambour met straal 13,3 m tot +39,5 m,
// koepel over r = 12 (+41), 11 (+42,3), 9 (+43,7), 7 (+44,6) en 5 m (+45,5 m),
// dan de lantaarn met straal 4 m tot +51 m en de spits tot +56 m.
const DOME = { c: [0.7, 2.5], drum: { r: 13.3, top: 39.5 }, profile: [[13.3, 39.5], [12, 41], [11, 42.3], [9, 43.7], [7, 44.6], [5, 45.5]], lantern: { r: 4, top: 51 }, spire: 56 };
// Hoektorentjes van het middenblok (zwaartepunt van het DSM tussen 35,5 en
// 38,5 m): achtkant met straal 2,5 m tot +34 m en een koepeltje tot +37,5 m.
const TURRETS = [[-14.4, 18.6], [15.9, 18.5], [-14.4, -13], [16, -12.9]];
const TURRET = { r: 2.5, eave: 34, top: 37.5 };
// Portaal aan het plein: overdekte entree tot +20 m, op de BAG-contour.
const PORCH = [{ x: [-6.3, 7.8], y: [-25, -15], top: 20 }];
// Blinde vensters in de pleingevel van de hoofdvleugel (y = -5): om de
// 3,5 m, 1,4 m breed, op drie verdiepingen (+14 tot +16,5, +18 tot +20,5 en
// +22 tot +24,5 m), 0,35 m diep.
const WINDOWS = { y: -5, ranges: [[-46, -20], [22, 47]], step: 3.5, width: 1.4, floors: [14, 18, 22], height: 2.5, depth: 0.35 };
// Extra gevelindeling (foto's, aantallen en maten geschat): blinde vensters
// van 0,35 m diep op de zeegevel van de hoofdvleugel, de koppen van de
// kopvleugels, de zeegevel van het middenblok, het middenblok boven het
// portaal en de lage zeevleugels. Elke gevel: as van de muur (x of y), de
// coördinaat van de muur, de kant waar buiten ligt (+1 of -1), de reeksen
// langs de muur, de steek, breedte, verdiepingen (onderkant NAP) en hoogte.
const FACADES = [
  { axis: "y", wall: 13.5, out: 1, ranges: [[-46, -20], [22, 47]], step: 3.5, width: 1.4, floors: [19, 23], height: 2.5 },
  { axis: "y", wall: 37, out: 1, centres: [[-58.2, -54.6, -51], [52, 55.6, 59.2]], width: 1.6, floors: [19.5, 23.5], height: 3 },
  { axis: "y", wall: 37, out: 1, centres: [[-55], [55.5]], width: 1.6, floors: [30], height: 2.5 },
  { axis: "y", wall: 22.5, out: 1, ranges: [[-14, 18]], step: 3.5, width: 1.6, floors: [20.5, 25], height: 3 },
  { axis: "y", wall: -15.5, out: -1, ranges: [[-16, -8], [9.5, 18]], step: 3.5, width: 1.6, floors: [22.5, 26.5], height: 3 },
  { axis: "y", wall: 48.17, out: 1, ranges: [[-58, -19]], step: 3.5, width: 1.6, floors: [11.5], height: 3 },
  { axis: "y", wall: "right", out: 1, ranges: [[28, 64]], step: 3.5, width: 1.6, floors: [11.5], height: 3 },
];
// Lisenen (0,5 m diep, 0,8 m breed) tussen de vensters van de pleingevel en
// de zeegevel van de hoofdvleugel, van de goot terug tot de strook op +12 m.
const PILASTERS = [
  { wall: -5, out: -1, from: 12, ranges: [[-46, -20], [22, 47]], step: 3.5, width: 1.4 },
  { wall: 13.5, out: 1, from: 16.5, ranges: [[-46, -20], [22, 47]], step: 3.5, width: 1.4 },
];
// Kroonlijst onder de goot: 1,0 m hoog, 0,9 m uitstekend onder 48 graden.
const CORNICE = { height: 1.0, out: 0.9 };
// Trommel van de koepel: acht nissen van 2,2 m breed op NAP +33,5 tot +38.
const DRUM_NICHES = { width: 2.2, z0: 33.5, z1: 38, depth: 0.35 };
// Portaal: een frontonnetje tot +23 m naar het plein (de BAG-contour van het
// portaal is een afgeschuinde apsis, daarom geen nissen op die vlakken).
const PORCH_GABLE = 23;

// Maaiveld (AHN NAP +8,6 tot +8,8 m): het Gevers Deynootplein.
const GROUND_SAMPLES = [[-40, -20], [30, -20], [-6, -32]];

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
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const box = (xr, yr, z0, z1) => prism(rect(xr, yr), z0, z1);
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const octagon = ([cx, cy], r) =>
  Array.from({ length: 8 }, (_, k) => {
    const a = ((45 * k + 22.5) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

// ---------- kurhaus ----------
const outline = prism(PAND, BASE - 1, 100);
const low = Manifold.intersection(outline, Manifold.union(LOW.map(({ x, y, top }) => box(x, y, BASE, NAP(top)))));
const [mx, my] = [MAIN.x, MAIN.y];
const main = Manifold.union([
  box(mx, my, BASE, NAP(MAIN.eave)),
  // Flauw schilddak: van de goot naar de knik, daarna naar het platte dak.
  Manifold.hull([
    ...at(rect(mx, my), NAP(MAIN.eave) - 0.01),
    ...at(rect([mx[0] + 1, mx[1] - 1], [my[0] + MAIN.inset, my[1] - MAIN.inset]), NAP(MAIN.break)),
    ...at(rect([mx[0] + 2, mx[1] - 2], [my[0] + MAIN.topInset, my[1] - MAIN.topInset]), NAP(MAIN.top)),
  ]),
]);
const endWings = END_WINGS.map(({ x, y, ridgeX }) => {
  const pts = [];
  for (const yy of y) pts.push([x[0], yy, NAP(END_WING.eave) - 0.01], [x[1], yy, NAP(END_WING.eave) - 0.01], [ridgeX, yy, NAP(END_WING.ridge)]);
  return Manifold.union([box(x, y, BASE, NAP(END_WING.eave)), Manifold.hull(pts)]);
});
const centre = box(CENTRE.x, CENTRE.y, BASE, NAP(CENTRE.top));
const dome = Manifold.union([
  prism(octagon(DOME.c, DOME.drum.r), NAP(CENTRE.top) - 0.01, NAP(DOME.drum.top)),
  Manifold.hull(DOME.profile.flatMap(([r, z]) => at(octagon(DOME.c, r), NAP(z) - (z === DOME.drum.top ? 0.01 : 0)))),
  prism(octagon(DOME.c, DOME.lantern.r), NAP(DOME.profile.at(-1)[1]) - 0.01, NAP(DOME.lantern.top)),
  Manifold.hull([...at(octagon(DOME.c, DOME.lantern.r), NAP(DOME.lantern.top) - 0.01), [...DOME.c, NAP(DOME.spire)]]),
]);
const turrets = TURRETS.map((c) =>
  Manifold.union([
    prism(octagon(c, TURRET.r), NAP(CENTRE.top) - 0.01, NAP(TURRET.eave)),
    Manifold.hull([...at(octagon(c, TURRET.r), NAP(TURRET.eave) - 0.01), ...at(octagon(c, TURRET.r * 0.5), NAP(TURRET.top) - 0.8), [...c, NAP(TURRET.top)]]),
  ]),
);
const porch = PORCH.map(({ x, y, top }) =>
  Manifold.intersection(
    outline,
    Manifold.union([
      box(x, y, BASE, NAP(top)),
      // Frontonnetje naar het plein, nok langs Y.
      Manifold.hull([
        ...[y[0], y[1]].flatMap((yy) => [[x[0], yy, NAP(top) - 0.01], [x[1], yy, NAP(top) - 0.01], [(x[0] + x[1]) / 2, yy, NAP(PORCH_GABLE)]]),
      ]),
    ]),
  ),
);
// Kroonlijst langs de goten van de hoofdvleugel en de kopvleugels.
const cornice = (xr, yr) =>
  Manifold.hull([
    ...at(rect(xr, yr), NAP(MAIN.eave) - CORNICE.height),
    ...at(rect([xr[0] - CORNICE.out, xr[1] + CORNICE.out], [yr[0] - CORNICE.out, yr[1] + CORNICE.out]), NAP(MAIN.eave)),
  ]);
const cornices = [cornice(MAIN.x, MAIN.y), ...END_WINGS.map(({ x, y }) => cornice(x, y))];
// Lisenen op de gevels van de hoofdvleugel.
const pilasters = PILASTERS.flatMap(({ wall, out, from, ranges, step, width }) =>
  ranges.flatMap(([s0, s1]) => {
    const list = [];
    for (let sx = s0; sx + width <= s1 + 1e-9; sx += step) {
      const cx = sx + width + (step - width) / 2;
      if (cx + 0.4 > s1 + step) continue;
      const ys = out > 0 ? [wall - 0.1, wall + 0.5] : [wall - 0.5, wall + 0.1];
      list.push(box([cx - 0.4, cx + 0.4], ys, NAP(from), NAP(MAIN.eave) - CORNICE.height + 0.01));
    }
    return list;
  }),
);
// Nissen in de acht vlakken van de koepeltrommel.
const drumNiches = Array.from({ length: 8 }, (_, k) => {
  const apothem = DOME.drum.r * Math.cos(Math.PI / 8);
  return box([apothem - DRUM_NICHES.depth, apothem + 1], [-DRUM_NICHES.width / 2, DRUM_NICHES.width / 2], NAP(DRUM_NICHES.z0), NAP(DRUM_NICHES.z1))
    .rotate([0, 0, 45 * k])
    .translate([DOME.c[0], DOME.c[1], 0]);
});
const windows = [];
for (const [s0, s1] of WINDOWS.ranges) {
  for (let s = s0; s + WINDOWS.width <= s1; s += WINDOWS.step) {
    for (const z of WINDOWS.floors) {
      windows.push(box([s, s + WINDOWS.width], [WINDOWS.y - 1, WINDOWS.y + WINDOWS.depth], NAP(z), NAP(z + WINDOWS.height)));
    }
  }
}
// Gevels met vensters: reeksen met een steek of vaste middens.
const rightWallY = (x) => 48.83 + ((x - 26.12) * (48.17 - 48.83)) / (67.45 - 26.12);
for (const { axis, wall, out, ranges, centres, step, width, floors, height } of FACADES) {
  const spans = [];
  if (ranges) for (const [s0, s1] of ranges) for (let sx = s0; sx + width <= s1 + 1e-9; sx += step) spans.push(sx);
  if (centres) for (const group of centres) for (const c of group) spans.push(c - width / 2);
  for (const sx of spans) {
    const yw = wall === "right" ? rightWallY(sx + width / 2) : wall;
    const ys = out > 0 ? [yw - WINDOWS.depth, yw + 1] : [yw - 1, yw + WINDOWS.depth];
    for (const z of floors) windows.push(box([sx, sx + width], ys, NAP(z), NAP(z + height)));
  }
}
const kurhaus = Manifold.union([low, main, ...endWings, centre, dome, ...turrets, ...porch, ...cornices, ...pilasters]).subtract(
  Manifold.union([...windows, ...drumNiches]),
);

const nodes = [["building:kurhaus", kurhaus]];
const all = kurhaus;

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of nodes) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen,
  // behalve de bovenkant van de vensternissen.
  const allowed = new Set([
    ...WINDOWS.floors.map((z) => NAP(z + WINDOWS.height).toFixed(2)),
    ...FACADES.flatMap(({ floors, height }) => floors.map((z) => NAP(z + height).toFixed(2))),
    NAP(DRUM_NICHES.z1).toFixed(2),
  ]);
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
      if (allowed.has(z.toFixed(2))) continue;
      throw new Error(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))}`);
    }
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
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
const glbFile = path.join(outDir, "kurhaus.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-kurhaus.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `kurhaus-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Kurhaus Den Haag 1:${scale} mm Z-up`);
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

const hallBox = kurhaus.boundingBox();
await writeFile(
  path.join(outDir, "kurhaus.json"),
  JSON.stringify(
    {
      name: "Kurhaus",
      file: "kurhaus.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het Gevers Deynootplein (NAP +8,6 tot +8,8 m), niet op de
      // boulevard aan zee (NAP +10 tot +12 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0518100000205738"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (79287,66, 458896,00), in het middenblok, op het maaiveld van het Gevers Deynootplein (NAP +9,0 m), +X langs de hoofdvleugel naar het noordoosten (46,4 graden vanaf het oosten) en +Y naar het noordwesten, de zee. Eén node building:kurhaus: de hoofdvleugel (goot NAP +29 m, flauw schilddak met plat bovendak op +33 m) met blinde vensters op drie verdiepingen in de pleingevel, de twee kopvleugels naar zee (zadeldak tot +34 m), het middenblok (+31,5 m) met de achtkante koepel (tambour tot +39,5 m, koepel tot +45,5 m, lantaarn tot +51 m en spits tot +56 m) en vier hoektorentjes (tot +37,5 m), het portaal aan het plein en de lage vleugels en het paviljoen naar zee op de BAG-contour (+10,5 tot +16,5 m). Alles staat recht op of loopt omhoog, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van het BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`kurhaus-1-${scale}.stl`],
      realWorld: {
        lengthM: +(hallBox.max[0] - hallBox.min[0]).toFixed(2),
        widthM: +(hallBox.max[1] - hallBox.min[1]).toFixed(2),
        highestPointNapM: +(hallBox.max[2] + GROUND_NAP).toFixed(2),
        mainEaveNapM: MAIN.eave,
        mainRoofNapM: MAIN.top,
        endWingRidgeNapM: END_WING.ridge,
        domeDrumNapM: DOME.drum.top,
        lanternTopNapM: DOME.lantern.top,
        spireNapM: DOME.spire,
        turretTopNapM: TURRET.top,
        groundNapM: GROUND_NAP,
        baseNapM: 8.5,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Kurhaus_(Scheveningen)",
        "PDOK BAG pand 0518100000205738, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: goten, nokken, koepel, torentjes, lage vleugels en maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

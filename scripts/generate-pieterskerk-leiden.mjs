// Genereert een vereenvoudigd, gesloten 3D-model van de Pieterskerk in
// Leiden: de laatgotische kruiskerk zonder toren (die stortte in 1512 in)
// met het hoge schip en koor onder één zadeldak (nok NAP +35,4 m), de
// veelhoekige koorsluiting, de dwarsbeuk met topgevels aan de noord- en
// zuidkant, de dubbele zijbeuken met per travee een dwars dak met een schild
// naar buiten (vijf aan elke kant), de lessenaarsdaken tussen zijbeuken en
// dwarsbeuk, de kooromgang rond het koor, de kapel ten zuiden van het koor,
// de lage aanbouwen, het portaal met de twee ronde traptorens aan de westgevel
// en de dakruiter net ten oosten van de kruising. Alle maten in het script
// zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node
// met de materiaalklasse in de nodenaam) als catalogusbron voor de export en
// de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-pieterskerk-leiden.mjs              # 1:1000 (standaard)
//   node scripts/generate-pieterskerk-leiden.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: de muren staan recht op, alle daken lopen
// onder 48 graden of steiler omhoog (de lessenaarsdaken en de kooromgang
// flauwer, maar die wijzen naar boven), de torentjes en de dakruiter zijn
// minstens 2 m breed met spitsen die smaller worden naar boven, en de
// vensters zijn nissen met een spitse bovenkant van 60 graden.
//
// Assenstelsel: oorsprong op RD (93462,30, 463655,35), het hart van de
// kruising, op het maaiveld (NAP +1,9 m), Z omhoog. +X loopt langs de as van
// de kerk van de westgevel naar het koor (RD-richting 10,2 graden, net ten
// noorden van oost), +Y naar het noorden.
//
// Bronnen: BAG-pand 0546100000040806 (contour met steunberen, traptorens en
// aanbouwen); AHN DSM/DTM 0,5 m (PDOK WCS) in een stelsel langs de as:
// dwarsprofielen van schip, koor en dwarsbeuk (goot NAP +26,6 m, nok +35,4 m),
// de daken van de zijbeuken (goot +16,0 m, nokken +19,4 m op 6 m), de
// kooromgang (+20,3 aan het koor tot +15,8 m buiten), de koorsluiting, de
// dakruiter (DSM tot +46,8 m), de traptorens (tot +35 m) en het maaiveld;
// Wikipedia; foto's op Wikimedia Commons (westgevel met de traptorens,
// zuidkant, koor); PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "pieterskerk-leiden");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- stelsel (s langs de as, t naar het noorden; hoogtes in NAP) ----------
// Het meetstelsel heeft zijn nulpunt op RD (93449,31, 463653,01), het
// zwaartepunt van de BAG-contour; het hart van de kruising ligt op s = 13,2.
const ANGLE = (10.2 * Math.PI) / 180;
const U = [Math.cos(ANGLE), Math.sin(ANGLE)];
const FRAME = [93449.31, 463653.01];
const CROSSING = 13.2;
const ORIGIN = [FRAME[0] + U[0] * CROSSING, FRAME[1] + U[1] * CROSSING].map((v) => +v.toFixed(2));
const GROUND_NAP = 1.9;
const z = (nap) => nap - GROUND_NAP;
const BASE = -0.5; // onderkant 0,5 m onder het maaiveld

// BAG-pand 0546100000040806 in (s, t).
const OUTLINE = [
  [53.9, -4.3], [53.9, -3.5], [54.0, -3.1], [52.6, -2.8], [52.5, 3.6], [53.8, 4.0], [53.8, 4.3], [53.7, 4.7],
  [52.9, 4.6], [52.7, 4.8], [49.2, 10.5], [48.5, 11.3], [42.6, 14.2], [42.7, 14.7], [38.8, 16.2], [39.3, 19.9],
  [38.4, 20.3], [38.5, 19.3], [36.2, 19.6], [33.7, 19.6], [33.7, 20.7], [28.4, 20.8], [27.2, 20.7], [23.5, 20.6],
  [21.9, 20.5], [21.9, 21.3], [21.9, 22.4], [21.4, 22.8], [20.4, 22.7], [20.4, 28.9], [21.5, 28.9], [21.4, 29.9],
  [20.3, 29.9], [20.3, 31.0], [19.9, 31.0], [19.9, 31.2], [18.7, 31.2], [18.8, 29.9], [15.3, 30.0], [15.0, 29.7],
  [14.9, 28.8], [10.9, 28.9], [10.8, 29.5], [10.4, 30.0], [7.4, 30.0], [7.4, 31.2], [6.4, 31.2], [6.4, 29.7],
  [0.9, 29.7], [0.7, 29.7], [0.7, 31.2], [-0.3, 31.2], [-0.3, 29.7], [-1.8, 29.7], [-1.8, 28.5], [-0.3, 28.5],
  [-0.3, 21.7], [-5.2, 21.7], [-5.2, 23.4], [-6.5, 23.4], [-6.5, 21.7], [-11.4, 21.7], [-11.4, 23.4], [-12.6, 23.4],
  [-12.6, 21.7], [-17.3, 21.8], [-17.3, 23.5], [-18.5, 23.5], [-18.5, 21.7], [-23.3, 21.8], [-23.2, 23.5], [-24.4, 23.5],
  [-24.5, 21.7], [-29.6, 21.8], [-29.6, 23.5], [-30.9, 23.5], [-31.0, 21.8], [-32.8, 21.9], [-32.9, 20.5], [-31.0, 20.5],
  [-31.0, 13.9], [-33.0, 13.9], [-33.0, 12.5], [-31.0, 12.5], [-31.0, 7.3], [-32.0, 7.3], [-32.9, 6.7], [-33.0, 5.4],
  [-32.0, 4.6], [-31.1, 4.6], [-31.1, 3.3], [-34.8, 3.4], [-35.6, 4.0], [-36.1, 3.4], [-35.5, 2.9], [-35.4, -2.5],
  [-35.9, -3.1], [-35.5, -3.6], [-34.9, -3.1], [-31.1, -3.1], [-31.1, -4.3], [-31.9, -4.3], [-32.9, -5.0], [-32.9, -6.2],
  [-32.0, -7.1], [-31.1, -7.1], [-31.1, -12.1], [-32.8, -12.1], [-32.8, -13.6], [-31.1, -13.6], [-31.0, -19.9], [-32.8, -19.9],
  [-32.8, -21.2], [-31.1, -21.2], [-30.7, -22.1], [-30.7, -24.2], [-31.5, -24.5], [-31.2, -25.3], [-30.3, -25.0], [-29.0, -26.3],
  [-29.4, -27.3], [-28.6, -27.5], [-28.3, -26.6], [-26.3, -26.6], [-25.7, -27.5], [-25.1, -27.2], [-25.6, -26.3], [-24.1, -24.9],
  [-23.2, -25.2], [-23.0, -24.5], [-23.8, -24.3], [-23.8, -21.2], [-18.6, -21.2], [-18.6, -22.9], [-17.2, -22.9], [-17.2, -21.1],
  [-12.4, -21.1], [-12.4, -22.9], [-11.1, -22.9], [-11.1, -21.2], [-6.4, -21.2], [-6.4, -22.9], [-5.1, -22.9], [-5.1, -21.2],
  [-0.4, -21.2], [-0.5, -28.0], [-2.0, -28.0], [-2.0, -29.2], [-0.5, -29.2], [-0.5, -30.6], [0.6, -30.6], [0.6, -29.2],
  [6.4, -29.2], [6.4, -30.6], [7.5, -30.6], [7.5, -29.3], [10.5, -29.3], [11.1, -28.7], [15.0, -28.7], [15.6, -29.3],
  [18.7, -29.3], [18.8, -30.6], [18.8, -30.8], [20.0, -30.8], [20.0, -30.4], [19.8, -29.4], [21.4, -29.4], [21.4, -28.9],
  [21.4, -28.4], [19.8, -28.4], [19.8, -20.5], [31.1, -20.5], [31.1, -17.6], [31.1, -15.6], [32.8, -14.7], [42.9, -14.6],
  [43.2, -14.5], [42.9, -13.5], [48.8, -10.4], [49.6, -9.7], [52.9, -4.0],
];
// Lage aanbouwen en de voet van alles binnen de contour.
const LOW = 6.0;
// Steunberen buiten de muren tot +13 m.
const BUTTRESS_TOP = 13.0;
// Schip en koor: muren op t = ±6,75, goot +26,6 m, nok +35,4 m op de as, van
// de westgevel (s = -31,1) tot het begin van de koorsluiting (s = 39).
const NAVE = { west: -31.1, east: 39.0, half: 6.75, eave: 26.6, ridge: 35.4 };
// Dwarsbeuk: muren op s = 6,35 en 20,15, goot +26,3 m, nok +35,2 m, van de
// zuidgevel (t = -29,2) tot de noordgevel (t = 29,7).
const TRANSEPT = { s0: 6.35, s1: 20.15, south: -29.2, north: 29.7, eave: 26.3, ridge: 35.2 };
// Zijbeuken: per travee van 6 m een dwars dak met de nok op het midden van de
// travee en een schild naar de buitenmuur.
const AISLE = { north: 21.7, south: -21.2, eave: 16.0, ridge: 19.4, bays: [-31.1, -24, -18, -12, -6, -0.4] };
// Lessenaarsdaken tussen de zijbeuken en de dwarsbeuk: van +16,2 m op
// s = -0,4 tot +19,6 m tegen de dwarsbeuk.
const LEAN_TO = { s0: -0.4, low: 16.2, high: 19.6 };
// Kooromgang: lessenaarsdak van +20,3 m tegen het koor tot +15,8 m op 7,6 m
// daarbuiten, om het koor en de koorsluiting heen.
const AMBULATORY = { width: 7.6, inner: 20.3, outer: 15.8 };
// Kapel ten zuiden van het koor, tegen de dwarsbeuk: plat dak op +18,6 m
// (AHN); ten oosten ervan blijft het bij de lage aanbouw.
const CHAPEL = { s0: 19.8, s1: 24.5, t0: -19.5, t1: -12.5, top: 18.6 };
// Portaal voor de westgevel: lessenaarsdak van +18,6 tot +20,6 m.
const PORCH = { s0: -35.6, s1: -31.1, t0: -3.1, t1: 3.4, low: 18.6, high: 20.6 };
// Ronde traptorens naast de westgevel: romp tot +29 m, spits tot +35 m.
const TURRETS = [[-32.0, 6.0], [-31.9, -5.7]].map((c) => ({ c, radius: 1.5, top: 29.0, tip: 35.0 }));
// Kapel op de zuidwesthoek: schilddak tot +19,2 m.
const SW_CHAPEL = { s: [-31.5, -23.0], t: [-28, -21.2], eave: 15.5, apex: [-27.3, -23.0, 19.2] };
// Dakruiter net ten oosten van de kruising (DSM: lantaarn tot +38 m, spits
// tot +46,8 m).
const ROOF_TURRET = { c: [20.9, 0], apothem: 1.25, top: 38.0, spireApothem: 0.45, spireTop: 46.3, tip: 47.0 };
// Maaiveld rondom (AHN NAP +1,8 tot +2,2 m): het Pieterskerkplein aan de
// westkant, de Pieterskerkhof aan de noord-, zuid- en oostkant.
const GROUND_SAMPLES = [[-40, 0], [-10, 28], [-10, -27], [58, 0]];

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
const at = (pts, h) => pts.map(([x, y]) => [x, y, h]);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const octagon = ([cx, cy], a) =>
  [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => polar([cx, cy], a / Math.cos(Math.PI / 8), deg));
// Spitsboognis: breedte w van h0 tot h1 (NAP), bovenkant onder 60 graden; `c`
// is het midden op het gevelvlak, `n` de richting naar buiten.
const niche = ([cx, cy], [nx, ny], w, h0, h1, depth, out = 1.5) => {
  const rise = (w / 2) * Math.tan(Math.PI / 3);
  const profile = [[-w / 2, z(h0)], [w / 2, z(h0)], [w / 2, z(h1) - rise], [0, z(h1)], [-w / 2, z(h1) - rise]];
  const pts = [];
  for (const d of [-depth, out]) for (const [u, h] of profile) pts.push([cx + nx * d - ny * u, cy + ny * d + nx * u, h]);
  return Manifold.hull(pts);
};

// ---------- opbouw ----------
const parts = [clip(box([-60, 70], [-40, 40], BASE, z(LOW)))];
// Steunberen buiten de muren van zijbeuken, westgevel en dwarsbeukgevels.
parts.push(
  clip(box([-34, 0], [AISLE.north, 25], BASE, z(BUTTRESS_TOP))),
  clip(box([-34, 0], [-25, AISLE.south], BASE, z(BUTTRESS_TOP))),
  clip(box([-34, NAVE.west], [-21.3, 21.8], BASE, z(BUTTRESS_TOP))),
  clip(box([-3, 22], [TRANSEPT.north, 33], BASE, z(BUTTRESS_TOP))),
  clip(box([-3, 22], [-33, TRANSEPT.south], BASE, z(BUTTRESS_TOP))),
);
// Schip en koor.
{
  const r = rect([NAVE.west, NAVE.east], [-NAVE.half, NAVE.half]);
  parts.push(
    Manifold.hull([...at(r, BASE), ...at(r, z(NAVE.eave)), [NAVE.west, 0, z(NAVE.ridge)], [NAVE.east, 0, z(NAVE.ridge)]]),
  );
}
// Koorsluiting: halve achthoek met dezelfde apothema als het schip, met een
// schilddak van de nok naar de goot.
const APSE = octagon([NAVE.east, 0], NAVE.half).filter(([x]) => x > NAVE.east);
parts.push(
  Manifold.hull([
    ...at([[NAVE.east, -NAVE.half], [NAVE.east, NAVE.half], ...APSE], BASE),
    ...at([[NAVE.east, -NAVE.half], [NAVE.east, NAVE.half], ...APSE], z(NAVE.eave)),
    [NAVE.east, 0, z(NAVE.ridge)],
  ]),
);
// Dwarsbeuk met topgevels.
{
  const T = TRANSEPT;
  const mid = (T.s0 + T.s1) / 2;
  const r = rect([T.s0, T.s1], [T.south, T.north]);
  parts.push(
    clip(Manifold.hull([...at(r, BASE), ...at(r, z(T.eave)), [mid, T.south, z(T.ridge)], [mid, T.north, z(T.ridge)]])),
  );
}
// Zijbeuken: per travee een dak met de nok dwars op de as en een schild
// naar buiten.
const slope = (AISLE.ridge - AISLE.eave) / 3;
for (let k = 0; k + 1 < AISLE.bays.length; k++) {
  const [s0, s1] = [AISLE.bays[k], AISLE.bays[k + 1]];
  const mid = k === 0 ? s1 - 3 : (s0 + s1) / 2;
  for (const [inner, outer] of [[0, AISLE.north], [0, AISLE.south]]) {
    const sign = Math.sign(outer);
    const ridgeEnd = outer - sign * ((AISLE.ridge - AISLE.eave) / slope);
    const r = rect([s0, s1], [Math.min(inner, outer), Math.max(inner, outer)]);
    parts.push(
      clip(
        Manifold.hull([
          ...at(r, BASE),
          ...at(r, z(AISLE.eave)),
          [mid, inner, z(AISLE.ridge)],
          [mid, ridgeEnd, z(AISLE.ridge)],
        ]),
      ),
    );
  }
}
// Lessenaarsdaken tussen zijbeuken en dwarsbeuk.
for (const [t0, t1] of [[0, TRANSEPT.north], [TRANSEPT.south, 0]]) {
  const pts = [];
  for (const t of [t0, t1]) {
    pts.push([LEAN_TO.s0, t, BASE], [TRANSEPT.s0, t, BASE], [LEAN_TO.s0, t, z(LEAN_TO.low)], [TRANSEPT.s0, t, z(LEAN_TO.high)]);
  }
  parts.push(clip(Manifold.hull(pts)));
}
// Kooromgang: om het koor en de koorsluiting, ten oosten van de dwarsbeuk.
{
  const choir = [[TRANSEPT.s1, -NAVE.half], [NAVE.east, -NAVE.half], ...APSE, [NAVE.east, NAVE.half], [TRANSEPT.s1, NAVE.half]];
  const outer = new CrossSection([ccw(choir)]).offset(AMBULATORY.width, "Miter", 2);
  const inner = new CrossSection([ccw(choir)]);
  const ring = Manifold.hull([
    Manifold.extrude(outer, z(AMBULATORY.outer) - BASE).translate([0, 0, BASE]),
    Manifold.extrude(inner, 0.01).translate([0, 0, z(AMBULATORY.inner)]),
  ]);
  parts.push(clip(ring.intersect(box([TRANSEPT.s1 - 0.01, 70], [-40, 40], BASE - 1, 100))));
}
// Kapel ten zuiden van het koor.
{
  const C = CHAPEL;
  parts.push(clip(box([C.s0, C.s1], [C.t0, C.t1], BASE, z(C.top))));
}
// Portaal aan de westgevel.
{
  const P = PORCH;
  const pts = [];
  for (const t of [P.t0, P.t1]) pts.push([P.s0, t, BASE], [P.s1, t, BASE], [P.s0, t, z(P.low)], [P.s1, t, z(P.high)]);
  parts.push(clip(Manifold.hull(pts)));
}
// Kapel op de zuidwesthoek.
{
  const C = SW_CHAPEL;
  const r = rect(C.s, C.t);
  parts.push(clip(Manifold.hull([...at(r, BASE), ...at(r, z(C.eave)), [C.apex[0], C.apex[1], z(C.apex[2])]])));
}
// Traptorens met een spits.
for (const T of TURRETS) {
  const body = octagon(T.c, T.radius);
  parts.push(prism(body, BASE, z(T.top)), Manifold.hull([...at(body, z(T.top) - 0.01), [T.c[0], T.c[1], z(T.tip)]]));
}
// Dakruiter.
{
  const R = ROOF_TURRET;
  const lantern = octagon(R.c, R.apothem);
  const spire = octagon(R.c, R.spireApothem);
  parts.push(
    prism(lantern, z(NAVE.ridge) - 2, z(R.top)),
    Manifold.hull([...at(lantern, z(R.top) - 0.01), ...at(spire, z(R.spireTop)), [R.c[0], R.c[1], z(R.tip)]]),
  );
}

// Vensters als spitsboognissen: het grote venster in beide dwarsbeukgevels en
// boven het portaal in de westgevel, en één venster per travee in de
// zijbeuken.
const windows = [];
// De middenpartij van beide dwarsbeukgevels ligt iets terug (BAG).
windows.push(niche([13.0, 28.85], [0, 1], 3.6, 7.0, 25.0, 0.5));
windows.push(niche([13.0, -28.7], [0, -1], 3.6, 7.0, 25.0, 0.5));
windows.push(niche([NAVE.west, 0], [-1, 0], 4.5, 21.5, 30.5, 0.5));
for (let k = 0; k + 1 < AISLE.bays.length; k++) {
  const mid = k === 0 ? AISLE.bays[1] - 3 : (AISLE.bays[k] + AISLE.bays[k + 1]) / 2;
  windows.push(niche([mid, AISLE.north], [0, 1], 3.0, 5.0, 14.5, 0.5, 2.5));
  // De eerste zuidtravee zit achter de kapel op de zuidwesthoek.
  if (k > 0) windows.push(niche([mid, AISLE.south], [0, -1], 3.0, 5.0, 14.5, 0.5, 2.5));
}

const church = Manifold.union(parts)
  .subtract(Manifold.union(windows))
  .translate([-CROSSING, 0, 0]);
const nodes = [["building:kerk", church]];
const printModel = church;

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
const glbFile = path.join(outDir, "pieterskerk-leiden.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-pieterskerk-leiden.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (0,5 m onder het maaiveld) op het printbed.
const stlFile = path.join(outDir, `pieterskerk-leiden-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Pieterskerk Leiden 1:${scale} mm Z-up`);
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
  path.join(outDir, "pieterskerk-leiden.json"),
  JSON.stringify(
    {
      name: "Pieterskerk",
      file: "pieterskerk-leiden.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: U.map((v) => +v.toFixed(5)),
      groundOffsetMetres: 0,
      groundSamplePoints: GROUND_SAMPLES.map(([s, t]) => [+(s - CROSSING).toFixed(1), t]),
      replacesBuildings: ["NL.IMBAG.Pand.0546100000040806"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (93462,30, 463655,35) in het hart van de kruising op het maaiveld (NAP +1,9 m), +X langs de as van de westgevel naar het koor (RD-richting 10,2 graden) en +Y naar het noorden. De vlakke onderkant ligt 0,5 m onder het maaiveld; dat wordt op het plein en de straten rondom bemonsterd. Vervangt de PDOK-reconstructie van BAG-pand 0546100000040806. Daken en hoogtes uit het AHN; vensters als spitsboognissen. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`pieterskerk-leiden-1-${scale}.stl`],
      realWorld: {
        lengthM: 90,
        transeptLengthM: 62,
        naveEaveNapM: NAVE.eave,
        naveRidgeNapM: NAVE.ridge,
        transeptRidgeNapM: TRANSEPT.ridge,
        aisleEaveNapM: AISLE.eave,
        aisleRidgeNapM: AISLE.ridge,
        roofTurretTipNapM: ROOF_TURRET.tip,
        westTurretTipNapM: TURRETS[0].tip,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Pieterskerk_(Leiden)",
        "PDOK BAG pand 0546100000040806 (contour), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de dakprofielen, de dakruiter, de traptorens en het maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: Leiden; Pieterskerk a.jpg, Leiden; Pieterskerk b.jpg, Leiden; Pieterskerk d.jpg, Leiden, prot gem Pieterskerk Zijkant noordzij 2173.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

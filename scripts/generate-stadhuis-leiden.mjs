// Genereert een vereenvoudigd, gesloten 3D-model van het Stadhuis van Leiden
// tussen de Breestraat en de Vismarkt: de lange vleugel aan de Breestraat
// achter de renaissancegevel (1597) onder een zadeldak met drie dwarse
// topgevels, dakkapellen en de trapgevel op de noordwestkop, met de lagere
// kop aan de oostkant, de toren met de vierkante romp, de achtkante klokkenverdieping,
// de koperen koepel, de lantaarn en de spits, de vleugels rond de open
// binnenhof en de hogere vleugel van C.J. Blaauw (1932) aan de Vismarkt met
// het hoektorentje en de dakkapellen, en het koperen koepeltje op het platte
// dak. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire
// STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-stadhuis-leiden.mjs              # 1:1000 (standaard)
//   node scripts/generate-stadhuis-leiden.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken lopen
// onder 45 graden of steiler omhoog, de toren en het hoektorentje worden naar
// boven smaller (de koepel onder 50 graden) en er kraagt niets uit.
//
// Assenstelsel: oorsprong op RD (93664,10, 463711,40), het zwaartepunt van de
// BAG-contour, op het maaiveld van de Breestraat (NAP +3,5 m), Z omhoog. +X
// loopt langs de Breestraat naar het zuidoosten (RD-richting -52,25 graden),
// +Y naar het noordoosten, naar de Vismarkt.
//
// Bronnen: BAG-pand 0546100000042247 (contour met de binnenhof); AHN DSM/DTM
// 0,5 m (PDOK WCS) in een stelsel langs de Breestraat: het dwarsprofiel van de
// vleugel aan de Breestraat (goot NAP +13,2 m, nok +20,4 m), de vleugel aan
// de Vismarkt (nok +30,3 m), de lagere delen, de toren (DSM tot +51 m) en het
// maaiveld (Breestraat +3,5 m, Vismarkt en Stadhuisplein +1,3 tot +1,5 m);
// Wikipedia; foto's op Wikimedia Commons (gevel en toren aan de Breestraat);
// PDOK luchtfoto (de open binnenhof met de tuin, de dakkapellen en het
// koepeltje).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "stadhuis-leiden");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- stelsel (s langs de Breestraat, t naar de Vismarkt; hoogtes in NAP) ----------
const ANGLE = (-52.25 * Math.PI) / 180;
const U = [Math.cos(ANGLE), Math.sin(ANGLE)];
const ORIGIN = [93664.1, 463711.4];
const GROUND_NAP = 3.5; // de Breestraat
const z = (nap) => nap - GROUND_NAP;
// De onderkant loopt door tot NAP +0,8 m, onder het lagere maaiveld aan de
// Vismarkt en het Stadhuisplein (NAP +1,3 tot +1,5 m).
const BASE = z(0.8);

// BAG-pand 0546100000042247 in (s, t): buitenrand en binnenhof.
const OUTER = [
  [16.07, 15.19], [16.62, 15.18], [16.64, 19.30], [17.12, 19.30], [17.16, 20.43], [16.65, 20.44], [16.66, 22.79],
  [17.13, 22.81], [17.16, 23.94], [16.67, 23.95], [15.99, 23.98], [16.00, 27.39], [2.91, 27.46], [2.89, 29.51],
  [-36.85, 29.62], [-36.85, 29.30], [-36.86, 26.41], [-39.39, 26.42], [-39.42, 17.35], [-36.88, 17.35], [-36.89, 14.00],
  [-34.23, 14.00], [-34.24, 11.83], [-34.82, 11.83], [-34.82, 11.35], [-34.24, 11.34], [-34.24, 9.64], [-34.83, 9.64],
  [-34.83, 9.15], [-34.25, 9.14], [-34.25, 7.44], [-34.83, 7.44], [-34.84, 6.96], [-34.26, 6.94], [-34.26, 5.25],
  [-34.84, 5.25], [-34.84, 4.75], [-34.26, 4.74], [-34.26, 3.02], [-34.85, 3.04], [-34.85, 2.55], [-34.29, 2.54],
  [-34.27, 0.48], [-38.03, 0.49], [-38.15, -4.49], [-44.27, -4.69], [-43.68, -18.19], [-20.74, -17.51], [-18.18, -17.56],
  [-17.93, -17.57], [-17.94, -17.90], [-17.24, -17.91], [-17.22, -17.66], [-15.43, -17.67], [-15.45, -17.94], [-14.76, -17.96],
  [-14.75, -17.65], [-9.15, -17.67], [-3.85, -17.70], [-3.87, -20.93], [0.62, -21.02], [3.22, -21.02], [3.24, -17.73],
  [8.36, -17.75], [15.74, -17.82], [15.73, -18.17], [16.47, -18.19], [16.52, -17.90], [18.22, -17.92], [18.20, -18.24],
  [18.94, -18.27], [19.01, -17.94], [29.41, -17.90], [29.42, -18.37], [30.20, -18.37], [30.20, -17.92], [31.82, -17.87],
  [31.83, -18.36], [32.60, -18.34], [32.63, -17.91], [36.59, -17.84], [37.67, -17.83], [42.66, -17.78], [42.68, -15.33],
  [49.36, -15.33], [51.66, -15.43], [51.68, -4.33], [49.34, -4.31], [47.17, -4.30], [42.99, -4.28], [43.00, -0.50],
  [42.16, -0.50], [42.16, -0.67], [16.49, -0.58], [16.49, -0.41], [16.49, 0.54], [16.02, 0.54], [16.02, 0.94],
  [16.03, 3.63], [16.03, 4.20], [16.04, 6.52], [16.04, 7.07], [16.05, 9.35], [16.05, 9.92], [16.06, 12.22],
  [16.06, 12.79],
];
const COURT = [[-8.15, -3.87], [-25.0, -3.72], [-24.79, 14.12], [-7.94, 13.92]];
// Alles binnen de contour tot de lage strook achter de vleugel aan de
// Breestraat aan de oostkant (AHN +5 tot +10 m).
const LOW = 8.0;
// Vleugel aan de Breestraat: goot +13,2 m aan de straat (t = -18), nok +20,4 m
// op t = -11, goot +13,5 m aan de achterkant (t = -5), van de noordwestkop
// tot s = 42,6; daarachter de lagere kop tot het einde (nok +17,0 m).
const FRONT = { s: [-46, 42.6], t: [-18.5, -5], eaveFront: 13.2, eaveBack: 13.5, ridgeT: -11, ridge: 20.4 };
const HEAD = { s: [42.6, 53], t: [-16, -4.5], eave: 12.5, ridgeT: -10, ridge: 17.0 };
// Lagere delen rond de binnenhof (plat): de strook achter de vleugel aan de
// Breestraat (+18 m), ten westen van de hof (+17 m), ten oosten (+20 m,
// naar de oostgevel toe +17 m).
const FLATS = [
  { s: [-40, 17], t: [-4.5, 2], top: 18.0 },
  { s: [-40, -25], t: [2, 14], top: 17.0 },
  { s: [-8, 10], t: [2, 14], top: 20.0 },
  { s: [10, 14], t: [2, 14], top: 17.0 },
];
// Vleugel aan de Vismarkt: goot +21 m aan de hof, +20 m aan de Vismarkt
// (t = 29,5), nok +30,3 m op t = 22, van s = -37 tot 2; oostelijker lager
// (goten +18 m, nok +25 m).
const VISMARKT = [
  { s: [-36.8, 2], t: [14, 29.5], eave: [21.0, 20.0], ridgeT: 22, ridge: 30.3 },
  { s: [2, 17], t: [14, 28], eave: [18.0, 18.0], ridgeT: 22, ridge: 25.0 },
];
// Hoektorentje op de noordwesthoek van de vleugel aan de Vismarkt: romp
// 3,5 m tot +31 m, tentdak tot +35 m (DSM).
const CORNER_TURRET = { c: [-35.2, 22], half: 1.75, top: 31.0, tip: 35.0 };
// Toren: vierkante romp van 6,5 m tot +28,5 m, achtkante klokkenverdieping
// (apothema 2,6 m) tot +37 m, koepel tot +44 m, lantaarn en spits tot +51,5 m.
const TOWER = {
  c: [13.2, -3.0],
  half: 3.25,
  top: 28.5,
  belfry: { apothem: 2.6, top: 37.0 },
  dome: [[2.6, 37.5], [2.2, 40.5], [1.2, 43.0], [0.7, 44.0]],
  lantern: { apothem: 0.7, top: 46.5 },
  tip: 51.5,
};
// Dwarse topgevels in het dak aan de Breestraat (AHN): een dwarsdak van de
// gevel tot de nok met een topgevel op de rooilijn; de middelste boven de
// ingang is breder en hoger, met een bekroning tot +22,9 m.
const CROSS_GABLES = [
  { s: [-18.7, -14.3], ridge: 18.9, top: 19.4 },
  { s: [-4.4, 2.6], ridge: 20.9, top: 21.9, finial: 22.9 },
  { s: [15.7, 20.1], ridge: 18.9, top: 19.0 },
];
// Trapgevel op de noordwestkop van de vleugel aan de Breestraat (foto vanaf
// de Breestraat; AHN tot +25 m met de schoorsteen): zes treden van de goten
// tot +22 m en een schoorsteen tot +25 m.
const STEP_GABLE = { s: [-44.3, -43.5], steps: 6, top: 22.0, chimney: { t: [-11.6, -10.4], top: 25.0 } };
// Dakkapellen (luchtfoto, middens langs de gevel): aan de Breestraat tussen
// de topgevels, aan de hofkant van de vleugel aan de Vismarkt twee rijen en
// aan de Vismarkt één rij. front/back: t van de voorkant en van de achterkant
// in het dak; wall/ridge: NAP.
const DORMER_ROWS = [
  { s: [-39.3, -32.9, -26.8, -20.5, -11.8, -6.0, 6.0, 13.0, 22.2, 28.4, 34.5, 40.5], width: 1.6, front: -17.6, back: -14.5, wall: 15.6, ridge: 16.6 },
  { s: [-32.0, -27.6, -23.2, -18.8, -14.2, -9.8, -5.6, -1.2], width: 2.0, front: 14.4, back: 17.5, wall: 24.0, ridge: 25.0 },
  { s: [-34.5, -25.8, -21.5, -17.0, -12.5, -8.0, -3.5], width: 1.4, front: 18.6, back: 20.5, wall: 27.0, ridge: 27.8 },
  { s: [-30.0, -23.3, -17.0, -10.2, -4.0], width: 1.6, front: 29.0, back: 26.5, wall: 22.5, ridge: 23.4 },
];
// Koperen koepeltje op het platte dak achter de vleugel aan de Breestraat
// (luchtfoto, AHN tot +19,2 m).
const CUPOLA = { c: [2.7, -6.4], apothem: 1.0, top: 18.6, tip: 19.4 };
// Maaiveld aan de Breestraat (AHN NAP +3,4 tot +3,5 m).
const GROUND_SAMPLES = [[-30, -23], [0, -23], [30, -23]];

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
const outline = prism(OUTER, BASE - 1, 200).subtract(prism(COURT, BASE - 2, 201));
const clip = (solid) => Manifold.intersection(outline, solid);
const at = (pts, h) => pts.map(([x, y]) => [x, y, h]);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const octagon = ([cx, cy], a) =>
  [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => polar([cx, cy], a / Math.cos(Math.PI / 8), deg));
// Zadeldak langs s met de nok op t = ridgeT en eigen goten aan beide kanten.
const gable = ([s0, s1], [t0, t1], eave0, eave1, ridgeT, ridge) =>
  Manifold.hull([
    ...at(rect([s0, s1], [t0, t1]), BASE),
    [s0, t0, z(eave0)], [s1, t0, z(eave0)], [s0, t1, z(eave1)], [s1, t1, z(eave1)],
    [s0, ridgeT, z(ridge)], [s1, ridgeT, z(ridge)],
  ]);

// ---------- opbouw ----------
const parts = [clip(box([-60, 60], [-30, 40], BASE, z(LOW)))];
parts.push(clip(gable(FRONT.s, FRONT.t, FRONT.eaveFront, FRONT.eaveBack, FRONT.ridgeT, FRONT.ridge)));
parts.push(clip(gable(HEAD.s, HEAD.t, HEAD.eave, HEAD.eave, HEAD.ridgeT, HEAD.ridge)));
for (const F of FLATS) parts.push(clip(box(F.s, F.t, BASE, z(F.top))));
for (const V of VISMARKT) parts.push(clip(gable(V.s, V.t, V.eave[0], V.eave[1], V.ridgeT, V.ridge)));
// Hoektorentje.
{
  const C = CORNER_TURRET;
  const sq = rect([C.c[0] - C.half, C.c[0] + C.half], [C.c[1] - C.half, C.c[1] + C.half]);
  parts.push(Manifold.hull([...at(sq, z(20)), ...at(sq, z(C.top)), [C.c[0], C.c[1], z(C.tip)]]));
}
// Toren.
{
  const T = TOWER;
  const sq = rect([T.c[0] - T.half, T.c[0] + T.half], [T.c[1] - T.half, T.c[1] + T.half]);
  parts.push(prism(sq, BASE, z(T.top)));
  const belfry = octagon(T.c, T.belfry.apothem);
  parts.push(prism(belfry, z(T.top) - 0.01, z(T.belfry.top)));
  parts.push(
    prism(belfry, z(T.belfry.top) - 0.01, z(T.dome[0][1])),
    Manifold.hull(T.dome.flatMap(([a, h]) => at(octagon(T.c, a), z(h)))),
  );
  const lantern = octagon(T.c, T.lantern.apothem);
  parts.push(
    prism(lantern, z(T.dome[T.dome.length - 1][1]) - 0.01, z(T.lantern.top)),
    Manifold.hull([...at(lantern, z(T.lantern.top) - 0.01), [T.c[0], T.c[1], z(T.tip)]]),
  );
}

// Dwarse topgevels aan de Breestraat.
for (const G of CROSS_GABLES) {
  const [s0, s1] = G.s;
  const mid = (s0 + s1) / 2;
  const [t0, t1] = [FRONT.t[0], FRONT.ridgeT];
  parts.push(
    clip(
      Manifold.hull([
        ...at(rect(G.s, [t0, t1]), BASE),
        [s0, t0, z(FRONT.eaveFront)], [s1, t0, z(FRONT.eaveFront)], [s0, t1, z(FRONT.eaveFront)], [s1, t1, z(FRONT.eaveFront)],
        [mid, t0, z(G.ridge)], [mid, t1, z(G.ridge)],
      ]),
    ),
  );
  // Topgevel op de rooilijn, 0,6 m dik, boven het dwarsdak uit.
  const wall = [];
  for (const t of [t0, t0 + 0.6]) wall.push([s0, t, BASE], [s1, t, BASE], [s0, t, z(FRONT.eaveFront + 0.6)], [s1, t, z(FRONT.eaveFront + 0.6)], [mid, t, z(G.top)]);
  parts.push(clip(Manifold.hull(wall)));
  if (G.finial) {
    const sq = rect([mid - 0.45, mid + 0.45], [t0, t0 + 0.6]);
    parts.push(clip(Manifold.hull([...at(sq, z(G.top) - 1), ...at(sq, z(G.top) + 0.2), [mid, t0 + 0.3, z(G.finial)]])));
  }
}
// Trapgevel op de noordwestkop.
{
  const S = STEP_GABLE;
  const [front, back] = [FRONT.t[0], FRONT.t[1]];
  const eave = Math.min(FRONT.eaveFront, FRONT.eaveBack);
  for (let i = 0; i < S.steps; i++) {
    const f = i / S.steps;
    const t0 = front + (FRONT.ridgeT - 0.6 - front) * f;
    const t1 = back - (back - FRONT.ridgeT - 0.6) * f;
    parts.push(clip(box(S.s, [t0, t1], BASE, z(eave + ((S.top - eave) * (i + 1)) / S.steps))));
  }
  parts.push(clip(box(S.s, S.chimney.t, BASE, z(S.chimney.top))));
}
// Dakkapellen: wanden en een zadeldakje haaks op de gevel.
for (const R of DORMER_ROWS) {
  for (const sc of R.s) {
    const [s0, s1] = [sc - R.width / 2, sc + R.width / 2];
    const pts = [];
    for (const t of [R.front, R.back]) pts.push([s0, t, z(R.wall) - 4], [s1, t, z(R.wall) - 4], [s0, t, z(R.wall)], [s1, t, z(R.wall)], [sc, t, z(R.ridge)]);
    parts.push(clip(Manifold.hull(pts)));
  }
}
// Koperen koepeltje.
{
  const C = CUPOLA;
  const ring = octagon(C.c, C.apothem);
  parts.push(prism(ring, z(17.0), z(C.top)), Manifold.hull([...at(ring, z(C.top) - 0.01), [C.c[0], C.c[1], z(C.tip)]]));
}

const cityHall = Manifold.union(parts);
const nodes = [["building:stadhuis", cityHall]];
const printModel = cityHall;

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
const glbFile = path.join(outDir, "stadhuis-leiden.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-stadhuis-leiden.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (NAP +0,8 m) op het printbed.
const stlFile = path.join(outDir, `stadhuis-leiden-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Stadhuis Leiden 1:${scale} mm Z-up`);
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
  path.join(outDir, "stadhuis-leiden.json"),
  JSON.stringify(
    {
      name: "Stadhuis van Leiden",
      file: "stadhuis-leiden.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: U.map((v) => +v.toFixed(5)),
      groundOffsetMetres: 0,
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0546100000042247"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (93664,10, 463711,40), het zwaartepunt van de BAG-contour, op het maaiveld van de Breestraat (NAP +3,5 m), +X langs de Breestraat naar het zuidoosten (RD-richting -52,25 graden) en +Y naar de Vismarkt. Het maaiveld wordt alleen aan de Breestraat bemonsterd; de vlakke onderkant ligt op NAP +0,8 m, onder het lagere maaiveld aan de Vismarkt. Vervangt de PDOK-reconstructie van BAG-pand 0546100000042247. Vleugels met zadeldaken, dwarse topgevels, een trapgevel en dakkapellen en platte delen rond de open binnenhof, de toren met koepel en spits, hoogtes uit het AHN. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`stadhuis-leiden-1-${scale}.stl`],
      realWorld: {
        lengthM: 96,
        widthM: 48,
        breestraatEaveNapM: FRONT.eaveFront,
        breestraatRidgeNapM: FRONT.ridge,
        vismarktRidgeNapM: VISMARKT[0].ridge,
        towerBodyTopNapM: TOWER.top,
        towerTipNapM: TOWER.tip,
        groundBreestraatNapM: GROUND_NAP,
        groundVismarktNapM: 1.3,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Stadhuis_van_Leiden",
        "PDOK BAG pand 0546100000042247 (contour met binnenhof), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de dakprofielen, de toren en het maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR) voor de open binnenhof, de dakkapellen en het koepeltje",
        "Wikimedia Commons: Leiden - Ayuntamiento (Breestraat) 20060716.jpg, Stadhuis van Leiden in Breestraat.jpg, Leiden - Breestraat met zicht op het stadhuis.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

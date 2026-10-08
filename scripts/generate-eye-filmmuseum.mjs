// Genereert een vereenvoudigd, gesloten 3D-model van Eye Filmmuseum in
// Amsterdam (Delugan Meissl Associated Architects, 2012) aan de IJpromenade in
// Overhoeks: het kristallijne witte volume met het gefacetteerde dak dat van
// de lage westpunt aan het IJ oploopt naar de hoge, uitkragende kop boven de
// entreetrappen aan de oostkant, de schuine gevels die naar boven toe
// uitwaaieren boven een kleinere voet, de verhoogde terrassokkel aan de
// IJ-zijde met de terugliggende glazen band onder het witte volume, en de
// entreetrappen onder de kop. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-eye-filmmuseum.mjs              # 1:1000 (standaard)
//   node scripts/generate-eye-filmmuseum.mjs --scale 2000
//
// Printbaar op 1:1000 zonder losse steunconstructie: alle onderdelen beginnen
// op dezelfde onderkant (1 m onder het maaiveld) en het script controleert dat
// geen ondervlak flauwer hangt dan 45,5 graden (ontworpen op 46 graden), op de
// vlakke bovenkant van de glazen band na (0,4 m diep). Die zorgt er bewust voor dat de export de node
// laag voor laag onder 45 graden opvult en de schuine onderkanten behoudt;
// zonder één zo'n vlak vult de export recht naar beneden op en worden de
// uitkragingen verticale wanden (valkuil Kubuswoningen). De werkelijke
// uitkragingen zijn flauwer: de onderkant van de kop boven de entree loopt in
// werkelijkheid onder circa 15 graden op over 31,5 m, in het model onder 46
// graden vanaf 15 m achter de kop; ook de onderkant van de noord- en westgevel
// is tot 46 graden steiler gemaakt, met de voet verder naar buiten dan de
// BGT-voetafdruk.
//
// Assenstelsel: oorsprong op RD (121895, 488615), midden in de dakomtrek, op
// het maaiveld van het terras en het plein rond het gebouw (NAP +1,6 m), Z
// omhoog, +X naar het oosten en +Y naar het noorden.
//
// Bronnen: BAG-pand 0363100012237838 (de dakomtrek; Amsterdam meet de
// bovenaanzichtcontour, inclusief de entreetrappen) en het BGT-pand bij dat
// BAG-pand (de voetafdruk op het maaiveld, met de terugliggende begane grond
// onder de uitkragingen); AHN DSM/DTM 0,5 m (PDOK WCS) voor de dakvlakken:
// twaalf vlakken met RANSAC gefit (rms 0,01 tot 0,13 m) en als min/max-
// combinatie van halfruimtes overgenomen (het hoogste, vlakke deel van de kop
// op NAP +25,7 m; 96 % van het AHN binnen de dakomtrek ligt binnen 0,5 m), de steile randvlakken van de gevels, het terras op NAP
// +5,44 m en de trappen; PDOK luchtfoto voor terras en trappen; Wikipedia en
// Wikimedia Commons-foto's voor de gevels, de glazen band en de kop. Geschat:
// de hoogte van de onderrand van de kop (NAP +17,2 m, foto's vanaf het IJ), de
// diepte (2,5 m) en hoogte van de glazen band boven het terras (foto's), de
// voet van de schuine gevels waar die verder naar buiten ligt dan de BGT, de
// treden van de trappen en de 0,3 m hoge rand onder de dakrand.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "eye-filmmuseum");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (z = NAP - 1,6 m, het maaiveld van terras en plein) ----------
const ORIGIN = [121895, 488615];
const X_AXIS = [1, 0];
const GROUND_NAP = 1.6;
const NAP = (h) => h - GROUND_NAP;
const local = ([x, y]) => [+(x - ORIGIN[0]).toFixed(3), +(y - ORIGIN[1]).toFixed(3)];
const BASE = -1;
const TOP = 40;

// Dakvlakken uit het AHN-DSM (RANSAC, z = a + b (X - 121890) + c (Y - 488610)
// in RD en NAP), met de rms van de fit:
//   P1 groot noordwestvlak, 5,7 graden (0,07 m)   P2 vlakke top van de kop (0,04 m)
//   P3 zuidwestvlak, 11,4 graden (0,10 m)          P4 noordoostvlak, 13,2 graden (0,04 m)
//   P5 zuidvlak, 11,7 graden (0,04 m)              P6 zuidoostvlak, 15,4 graden (0,12 m)
//   P12 knik tussen P4 en P6, 25,7 graden (0,01 m)
// en de steile randvlakken die vanaf de dakrand naar buiten aflopen:
//   P7 zuidgevel boven de glazen band, 39,6 graden (0,05 m)
//   P8 westgevel, 67,6 graden (0,10 m)
//   P11 zuidgevel van de kop, 75,6 graden (0,08 m), alleen oostelijk van X = 121905
//   P14 noordgevel, 75,6 graden (0,08 m)
// en het terras op de sokkel aan de zuidwest- en westkant: NAP +5,44 m (0,05 m).
const RD_PLANES = {
  P1: [20.24, 0.0395, -0.0926],
  P2: [25.87, -0.01, -0.0006],
  P3: [20.09, 0.1638, 0.1184],
  P4: [20.67, 0.1984, -0.1253],
  P5: [20.33, 0.2044, 0.0338],
  P6: [20.32, 0.2604, 0.09],
  P12: [19.93, 0.4056, 0.2606],
  P7: [33.95, 0.3362, 0.756],
  P8: [103.66, 2.3596, 0.5664],
  P11: [103.84, 0.5095, 3.8623],
  P14: [199.01, 0.2459, -3.8875],
};
const P11_FROM_X = 121905 - ORIGIN[0];
const TERRACE = NAP(5.44);
// Lokaal: z = A + B x + C y.
const PLANES = Object.fromEntries(
  Object.entries(RD_PLANES).map(([key, [a, b, c]]) => [
    key,
    [a - GROUND_NAP + b * (ORIGIN[0] - 121890) + c * (ORIGIN[1] - 488610), b, c],
  ]),
);
const planeZ = (key, [x, y]) => {
  const [A, B, C] = PLANES[key];
  return A + B * x + C * y;
};
// Dakhoogte als min/max-combinatie van de vlakken, dezelfde als de halfruimtes
// hieronder (gecontroleerd op het DSM: binnen de dakomtrek, buiten de trappen,
// 96 % van de pixels binnen 0,5 m).
const roofZ = (p) => {
  const z = (k) => planeZ(k, p);
  const core = Math.max(
    Math.min(z("P1"), z("P3")),
    Math.min(z("P4"), Math.max(z("P5"), z("P6"))),
    Math.min(z("P4"), z("P12")),
  );
  const edges = [z("P2"), z("P7"), z("P8"), z("P14")];
  if (p[0] >= P11_FROM_X) edges.push(z("P11"));
  return Math.max(TERRACE, Math.min(core, ...edges));
};

// Dakomtrek (BAG, zonder de trappen), tegen de klok in vanaf de noordoostpunt
// van de kop. De knikjes van 0,1 m in de zuidgevel zijn rechtgetrokken.
const OUTLINE_RD = {
  B0: [121949.54, 488600.72],
  B1: [121919.6, 488617.67],
  B2: [121891.49, 488630.39],
  B3: [121870.0, 488657.78],
  B4: [121839.09, 488655.47],
  B5: [121844.59, 488622.97],
  B6: [121852.55, 488590.01],
  B7: [121867.75, 488588.46],
  B10: [121928.51, 488582.25],
  B11: [121943.66, 488580.7],
  B12: [121949.34, 488581.84],
};
const B = Object.fromEntries(Object.entries(OUTLINE_RD).map(([k, v]) => [k, local(v)]));
// Splitspunt in de zuidgevel recht onder de inham B2, voor twee convexe delen.
const S = [B.B2[0], B.B7[1] + ((B.B10[1] - B.B7[1]) * (B.B2[0] - B.B7[0])) / (B.B10[0] - B.B7[0])];
// Voet van elke gevel op het maaiveld (RD): de BGT-voetafdruk waar de gevel
// daar onder 46 graden of steiler naar toe loopt, anders verder naar buiten.
const FEET_RD = {
  B0: [121934.5, 488601.0], // kop: onderkant onder 46 graden, BGT op X = 121918
  B1: [121911.13, 488612.23], // BGT
  B2: [121891.49, 488622.0], // BGT (121893,5, 488622,0) in de inham
  B3: [121868.38, 488651.9], // 6,1 m binnen de rand, BGT 14,8 m
  B4: [121843.19, 488649.67], // 7,1 m binnen de rand, BGT 15,8 m
  B5: [121847.96, 488623.5], // 3,4 m onder het terras, BGT 4,8 m
  B6: [121855.1, 488592.3], // 3,4 m onder het terras, BGT 10,6 m
  B10: [121926.0, 488588.3], // BGT (121925,66, 488588,24)
  B11: [121934.5, 488591.0], // kop: onderkant onder 46 graden of steiler
  B12: [121934.5, 488591.0],
};
const FEET = Object.fromEntries(Object.entries(FEET_RD).map(([k, v]) => [k, local(v)]));
FEET.B7 = B.B7;
FEET.S = S;
// Kop: de eindgevel staat 8,7 m hoog onder de vlakke top (foto's vanaf het
// IJ), de onderrand op NAP +17,2 m.
const PROW_CREASE = NAP(17.2);
// Onder de dakrand loopt een rand van 0,3 m recht naar beneden voordat de
// gevel naar binnen terugwijkt.
const FASCIA = 0.3;
const crease = (key) =>
  key === "B0" || key === "B12" ? PROW_CREASE : roofZ(key === "S" ? S : B[key]) - FASCIA;
// Glazen band aan de IJ-zijde: 2,5 m diep boven de terrasborstwering
// (NAP +6,6 m), de onderkant van het witte volume erboven onder 46 graden
// schuin terug tot 0,4 m voor de glaswand en daar vlak.
const BAND = { from: 3.5, to: 4.5, depth: 2.5, flat: 0.4, bottom: NAP(6.6) };
// Entreetrappen onder de kop (AHN, BGT overbruggingsdeel): een rug van de
// glazen entree (NAP +5,0 m) naar het zuidzuidoosten (NAP +3,3 m) met aan
// beide kanten vier treden naar het plein. De rug begint binnen de voet van het
// gebouw, zodat de trappen in de losse STL aan het museum vastzitten.
const STAIRS = {
  from: local([121920.4, 488590.5]),
  to: local([121932.0, 488563.5]),
  topFrom: NAP(5.0),
  topTo: NAP(3.3),
  crown: 1.5,
  treads: 4,
  run: 1.25,
};
const SLOPE = 1.04; // tan 46 graden

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const L = 150;
// Halfruimte onder het vlak z = A + B x + C y: een doos van 300 × 300 m
// waarvan alleen de bovenkant naar het vlak wordt verschoven; de onderkant
// blijft op 2 km diepte, ook onder de steilste randvlakken.
const below = ([A, Bx, Cy]) =>
  Manifold.cube([2 * L, 2 * L, 1], false)
    .translate([-L, -L, -2000])
    .warp((v) => {
      if (v[2] > -2000 + 0.5) v[2] = A + Bx * v[0] + Cy * v[1];
    });
const belowKey = (key) => below(PLANES[key]);
const constant = (z) => below([z, 0, 0]);
const halfX = (x, keep) =>
  Manifold.cube([L, 2 * L, 2 * L], false).translate([keep > 0 ? x : x - L, -L, -L]);

// ---------- dak ----------
const RING = ["B0", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "S", "B10", "B11", "B12"];
const ringPt = (k) => (k === "S" ? S : B[k]);
const outline = new CrossSection([ccw(RING.map(ringPt))]);
const prism = Manifold.extrude(outline, TOP - BASE).translate([0, 0, BASE]);
const clip = (m) => Manifold.intersection(prism, m);
const core = Manifold.union([
  clip(Manifold.intersection(belowKey("P1"), belowKey("P3"))),
  clip(Manifold.intersection(belowKey("P4"), Manifold.union(belowKey("P5"), belowKey("P6")))),
  clip(Manifold.intersection(belowKey("P4"), belowKey("P12"))),
]);
let roof = Manifold.intersection([
  core,
  belowKey("P2"),
  belowKey("P7"),
  belowKey("P8"),
  belowKey("P14"),
  Manifold.union(belowKey("P11"), halfX(P11_FROM_X, -1)),
]);
roof = Manifold.union(roof, clip(constant(TERRACE)));

// ---------- gevels: twee convexe delen, elk het omhulsel van voet, rand en top ----------
const shellOf = (keys) => {
  const pts = [];
  for (const k of keys) {
    const [x, y] = ringPt(k);
    const [fx, fy] = FEET[k];
    pts.push([fx, fy, BASE], [fx, fy, 0], [x, y, crease(k)], [x, y, TOP]);
  }
  return Manifold.hull(pts);
};
const shells = Manifold.union([
  shellOf(["B0", "B1", "B2", "S", "B10", "B11", "B12"]),
  shellOf(["B2", "B3", "B4", "B5", "B6", "B7", "S"]),
]);
let museum = Manifold.intersection(roof, shells);

// ---------- glazen band aan de IJ-zijde ----------
{
  const a = B.B7;
  const b = B.B10;
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const t = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const n = [-t[1], t[0]]; // naar binnen (noord)
  const at = (s, u, z) => [a[0] + t[0] * s + n[0] * u, a[1] + t[1] * s + n[1] * u, z];
  const s0 = BAND.from;
  const s1 = len - BAND.to;
  const top = (s) => roofZ([a[0] + t[0] * s, a[1] + t[1] * s]) - FASCIA;
  const back = (s) => top(s) - SLOPE * (BAND.depth - BAND.flat);
  const chamfer = Manifold.hull(
    [s0, s1].flatMap((s) => [
      at(s, -1, BAND.bottom),
      at(s, -1, top(s) + SLOPE),
      at(s, 0, top(s)),
      at(s, BAND.depth - BAND.flat, back(s)),
      at(s, BAND.depth - BAND.flat, BAND.bottom),
    ]),
  );
  const flat = Manifold.hull(
    [s0, s1].flatMap((s) => [
      at(s, BAND.depth - BAND.flat - 0.01, BAND.bottom),
      at(s, BAND.depth - BAND.flat - 0.01, back(s)),
      at(s, BAND.depth, back(s)),
      at(s, BAND.depth, BAND.bottom),
    ]),
  );
  museum = museum.subtract(Manifold.union(chamfer, flat));
}

// ---------- entreetrappen ----------
let stairs;
{
  const [ax, ay] = STAIRS.from;
  const [bx, by] = STAIRS.to;
  const len = Math.hypot(bx - ax, by - ay);
  const t = [(bx - ax) / len, (by - ay) / len];
  const n = [-t[1], t[0]];
  const steps = [];
  for (let k = 0; k <= STAIRS.treads; k++) {
    const w = STAIRS.crown + k * STAIRS.run;
    const f = 1 - k / (STAIRS.treads + 1);
    const pts = [];
    for (const [s, h] of [
      [0, STAIRS.topFrom],
      [len, STAIRS.topTo],
    ]) {
      for (const u of [-w, w]) {
        const p = [ax + t[0] * s + n[0] * u, ay + t[1] * s + n[1] * u];
        pts.push([...p, BASE], [...p, h * f]);
      }
    }
    steps.push(Manifold.hull(pts));
  }
  stairs = Manifold.union(steps);
}

const nodes = [
  ["building:eye-filmmuseum", museum],
  ["road:entreetrappen", stairs],
];
const printModel = Manifold.union(museum, stairs);

// ---------- controles ----------
for (const [name, solid] of nodes) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}
// Elk naar beneden gericht vlak boven de onderkant staat minstens 46 graden
// steil, behalve de vlakke bovenkant van de glazen band.
{
  const mesh = museum.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 90;
  let worstAt = null;
  let bandCeiling = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nn);
    if (len < 0.02 || nn[2] >= 0) continue; // splinters onder 0,01 m2 tellen niet
    const deg = (Math.acos(-nn[2] / len) * 180) / Math.PI;
    if (deg < 30 && p.every((q) => q[2] > BAND.bottom)) {
      bandCeiling += len / 2;
      continue;
    }
    if (deg < worst) {
      worst = deg;
      worstAt = p;
    }
  }
  console.log(
    `flauwste ondervlak: ${worst.toFixed(1)} graden boven de horizon; vlakke bovenkant glazen band ${bandCeiling.toFixed(2)} m2`,
  );
  if (worst < 45.5) {
    throw new Error(`ondervlak flauwer dan 45,5 graden: ${JSON.stringify(worstAt)}`);
  }
  if (!(bandCeiling > 10 && bandCeiling < 30)) throw new Error("glazen band zonder vlakke bovenkant");
}
console.log("onderrand van de gevels (m boven het maaiveld)", Object.fromEntries(RING.map((k) => [k, +crease(k).toFixed(2)])));

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
const glbFile = path.join(outDir, "eye-filmmuseum.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-eye-filmmuseum.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `eye-filmmuseum-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Eye Filmmuseum 1:${scale} mm Z-up`);
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

const top = museum.boundingBox().max[2];
await writeFile(
  path.join(outDir, "eye-filmmuseum.json"),
  JSON.stringify(
    {
      name: "Eye Filmmuseum",
      file: "eye-filmmuseum.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het plein en het gazon rond het gebouw (NAP +1,6 tot +1,9 m), niet
      // op de lagere kade aan de westkant (NAP +1,0 m) of op het IJ.
      groundSamplePoints: [
        local([121900, 488583]),
        local([121945, 488577]),
        local([121953, 488592]),
        local([121912, 488625.5]),
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0363100012237838"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (121895, 488615), midden in de dakomtrek, op het maaiveld van terras en plein (NAP +1,6 m), +X naar het oosten en +Y naar het noorden. Node building: het witte volume met het gefacetteerde dak uit het AHN (twaalf vlakken, van NAP +5,44 m op het terras aan de westpunt tot +25,7 m op de kop), de schuine gevels boven de kleinere voet, de glazen band aan de IJ-zijde en de uitkragende kop aan de oostkant; node road: de entreetrappen onder de kop. Vereenvoudigd om op 1:1000 zonder losse steunconstructie te printen: alle onderkanten hangen onder 46 graden of steiler (de kop in werkelijkheid onder circa 15 graden), op de vlakke bovenkant van de glazen band na. Vervangt de PDOK-reconstructie van BAG-pand 0363100012237838; er liggen geen andere panden onder het model. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`eye-filmmuseum-1-${scale}.stl`],
      realWorld: {
        lengthM: +(B.B0[0] - B.B4[0]).toFixed(2),
        widthM: +(B.B3[1] - B.B11[1]).toFixed(2),
        topNapM: +(top + GROUND_NAP).toFixed(2),
        terraceNapM: +(TERRACE + GROUND_NAP).toFixed(2),
        prowUndersideNapM: +(PROW_CREASE + GROUND_NAP).toFixed(2),
        prowOverhangM: { real: 31.5, model: +(B.B0[0] - FEET.B0[0]).toFixed(2) },
        undersideDegrees: { min: 46 },
        glassBandDepthM: BAND.depth,
        stairsTopNapM: [+(STAIRS.topFrom + GROUND_NAP).toFixed(2), +(STAIRS.topTo + GROUND_NAP).toFixed(2)],
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Eye_Filmmuseum",
        "PDOK BAG pand 0363100012237838 (dakomtrek met entreetrappen) en BGT pand (voetafdruk op het maaiveld), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: twaalf dakvlakken (RANSAC), steile randvlakken van de gevels, terras, entreetrappen en maaiveld",
        "PDOK BGT overbruggingsdeel en onbegroeidterreindeel bij de entreetrappen; PDOK luchtfoto (Actueel_orthoHR) voor terras en trappen",
        "Wikimedia Commons: EYE Film Institute Amsterdam from tour boat 2016-09-12-6548.jpg, EYE museum building 20180701.jpg, Eye Amsterdam 2014.JPG, Eye film instituut 1.JPG, Eye film instituut 2.JPG, Amsterdam-overhoeks Eye Film Institute IMG 8011.JPG, Eye met constructie op de achtergrond.JPG",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

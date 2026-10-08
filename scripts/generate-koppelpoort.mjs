// Genereert een vereenvoudigd, gesloten 3D-model van de Koppelpoort in
// Amersfoort: de gecombineerde land- en waterpoort (circa 1380-1425) over de
// Eem aan de noordwestkant van de binnenstad. Van noordoost naar zuidwest: de
// landpoort met de doorgang van de Kleine Spui naar de brug, aan de veldzijde
// geflankeerd door twee achtkante torentjes met een uitkragende bovenbouw en
// een spitse achtkante naald, de lage weermuur met kantelen en het aanbouwtje
// aan de veldzijde, het hoge poortgebouw van de waterpoort met het schilddak,
// de boog over de Eem en de mezekouw aan de veldzijde, de lagere zuidwestvleugel
// met schilddak en het derde torentje aan de overkant van het Spui. Het water
// zit in het PDOK-terrein en niet in het model. Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-koppelpoort.mjs              # 1:1000 (standaard)
//   node scripts/generate-koppelpoort.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: de muren staan recht op, de daken en
// naalden lopen onder 50 graden of steiler omhoog, de waterdoorgang en de
// landdoorgang zijn bogen met een spitse top (de zijden lopen boven 40 graden
// over in rechte stukken onder 50 graden), en de mezekouw rust op een schuine
// onderkant van 55 graden. Alleen de bovenbouw van de drie torentjes kraagt
// 0,3 m vlak uit; die vlakke onderkanten laten de export de poort als
// gesloten solid opvullen (zie de controle onderaan).
//
// Assenstelsel: oorsprong op RD (154869,26, 463423,65), het zwaartepunt van
// het BAG-pand, op het maaiveld van de kade en de straat (NAP +2,5 m), Z
// omhoog. +X loopt langs de poort naar het noordoosten (RD-richting 47,5
// graden vanaf het oosten, evenwijdig aan de lange gevels), +Y naar het
// noordwesten: de veldzijde met de grote kom van de Eem. De landpoort ligt
// aan de noordoostkant (x = 10 tot 22), de waterpoort in het midden (de boog
// van x = -6,85 tot -0,25), het zuidwesttorentje op x = -17,3.
//
// Bronnen: BAG-panden 0307100000334171 (de poort) en 0307100000522091 (de
// noordoostkant van de landpoort); BGT waterdeel en overbruggingsdeel (de
// waterloop onder de poort, 7,3 m breed); AHN DSM/DTM 0,5 m (PDOK WCS): de
// dak- en muurhoogtes, de torentjes, de kade, de straat en het water;
// Wikipedia en het Rijksmonumentenregister (7928); foto's op Wikimedia
// Commons (veldzijde vanaf de Eem en vanaf de Smalle Brug, stadszijde vanaf
// het Spui); PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "koppelpoort");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 2,5 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [154869.26, 463423.65];
const AXIS_DEG = 47.5;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 2.5;
const NAP = (h) => h - GROUND_NAP;
// Alle onderdelen beginnen op NAP -1,5 m, onder het water van de Eem (circa
// NAP 0 m), zodat de muren uit het water rijzen.
const BASE = NAP(-1.5);
// BAG-contouren (lokaal, op 0,01 m): het pand van de poort en de
// noordoostkant van de landpoort; daartussen de overbouwde landdoorgang.
const PAND = [
  [-7.3, 2.33], [-13.31, 2.29], [-16.38, 2.27], [-16.49, 2.98], [-18.09, 2.87], [-18.98, 1.63], [-18.83, 0.07],
  [-17.86, -0.54], [-17.7, -3.72], [-17.31, -5.4], [-12.93, -3.33], [-12.81, -3.27], [-8.75, -3.46], [-7.15, -3.43],
  [-1.89, -3.36], [0.13, -3.4], [2.35, -3.45], [2.44, -3.03], [10.76, -3.14], [13.08, -3.17], [13.11, -2.33],
  [12.58, -2.27], [12.64, 0.24], [13.16, 0.93], [14.01, 0.96], [14.08, 1.85], [13.48, 1.83], [13.47, 2.51],
  [12.45, 3.39], [11.87, 3.38], [11.34, 3.38], [11.03, 3.37], [10.81, 3.17], [6.46, 3.08], [6.47, 2.41], [-0.02, 2.37],
];
const PAND_NO = [
  [21.15, -2.98], [21.91, -1.52], [21.87, -0.67], [21.62, -0.7], [21.38, 2.28], [20.54, 3.34], [19.09, 3.43],
  [18.11, 2.58], [18.15, 1.94], [17.52, 1.97], [17.48, 0.98], [18.15, 0.92], [18.89, 0.04], [18.77, -2.25],
  [18.49, -2.24], [18.42, -2.99],
];
// Overbouwing van de landdoorgang tussen de twee BAG-panden (AHN-DSM: het
// poortlichaam loopt op NAP +8,5 m over de straat door).
const GATE_SPAN = [[12.4, -3.17], [18.9, -3.0], [18.9, 2.0], [12.4, 2.0]];
// Vleugels met schilddak (AHN-DSM): de voetafdruk in x en y, de goot en de
// nok (NAP) met de nok van x0 tot x1 op y = -0,55, het midden van de gevels.
const ROOF_Y = -0.55;
const ROOF_HALF = 2.9;
const WATER_GATE = { x: [-8.6, 2.0], eave: 10.8, ridge: 14.6, ridgeX: [-6.3, -1.3] };
const SOUTH_WING = { x: [-19.5, -8.6], eave: 9.6, ridge: 13.5, ridgeX: [-15.0, -8.6], roofX: [-17.8, -8.6] };
// Weermuur tussen de waterpoort en de landpoort: weergang op NAP +7,9 m
// (AHN-DSM 7,8 tot 7,9 m) met kantelen tot NAP +9,0 m aan beide gevels, en
// het aanbouwtje aan de veldzijde tot NAP +5,9 m.
const CURTAIN = { x: [2.0, 10.4], top: 7.9 };
const ANNEX = { x: [6.4, 10.9], y: [2.3, 4.0], top: 5.9 };
// Landpoort: poortlichaam tot NAP +8,5 m met kantelen tot NAP +9,7 m aan
// beide gevels (AHN-DSM 8,4 tot 10 m), de veldzijde tussen de torentjes op
// y = 2,0.
const LAND_GATE = { x: [10.0, 22.0], yVeld: 2.0, top: 8.5 };
const MERLON = { w: 1.0, d: 0.9, period: 2.0 };
// Doorgangen: boog met spitse top. De ronde boog met straal w/2 loopt tot 40
// graden boven de aanzet en gaat dan over in rechte stukken onder 50 graden
// naar de top. Waterpoort over de BGT-waterloop (7,3 m breed): 6,6 m breed,
// top op NAP +4,0 m (foto's: rondboog van 6,2 m met de kruin 3,5 m boven het
// water). Landpoort tussen de BAG-panden (3,5 m): 3,4 m breed, top op NAP
// +7,3 m (foto's: kruin 4,4 m boven de straat). Beide tot de onderkant open,
// zodat het water en de straat uit het PDOK-terrein erdoor lopen.
const WATER_ARCH = { x: -3.55, w: 6.6, apex: 4.0 };
const LAND_ARCH = { x: 15.8, w: 3.4, apex: 7.3 };
// Mezekouw boven de waterboog aan de veldzijde (AHN-DSM NAP +9,5 tot 9,8 m),
// 0,75 m uit de gevel, met een onderkant onder 55 graden.
const MACHICOLATION = { x: [-5.0, -2.2], y: 2.33, depth: 0.75, top: 9.8, bottom: 7.6 };
// Achtkante torentjes (BAG-bochten en AHN-DSM, hoogtes uit foto's): romp tot
// de uitkraging, bovenbouw 0,3 m breder tot de goot, en een spitse naald.
const TOWERS = [
  { name: "zuidwest", c: [-17.25, 1.0], r: 1.85, corbel: 9.8, eave: 12.0, tip: 18.0 },
  { name: "landpoort west", c: [11.75, 1.7], r: 1.75, corbel: 7.0, eave: 11.4, tip: 15.5 },
  { name: "landpoort oost", c: [19.75, 1.75], r: 1.75, corbel: 7.0, eave: 11.4, tip: 15.5 },
];
const CORBEL = 0.3;
// Maaiveld (AHN-DTM NAP +2,4 tot +2,6 m): de straat aan beide kanten van de
// landpoort en de kade aan de stadszijde van de zuidwestvleugel; niet het
// water en niet het hogere plein voor de waterpoort (NAP +3,5 m).
const GROUND_SAMPLES = [[15.8, 8], [15.8, -8], [-20, -8]];

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
// Achthoek met de omgeschreven straal r, een zijde evenwijdig aan de assen.
const octagon = ([cx, cy], r) =>
  Array.from({ length: 8 }, (_, k) => {
    const a = ((45 * k + 22.5) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
// Schilddak: goot rondom op de voetafdruk, nok van x0 tot x1.
const hipRoof = (xr, eave, ridge, [r0, r1]) =>
  Manifold.hull([...at(rect(xr, [ROOF_Y - ROOF_HALF, ROOF_Y + ROOF_HALF]), NAP(eave) - 0.01), [r0, ROOF_Y, NAP(ridge)], [r1, ROOF_Y, NAP(ridge)]]);
// Doorgang dwars door de poort (langs Y) als boog met spitse top.
const passage = ({ x, w, apex }) => {
  const r = w / 2;
  const kink = (40 * Math.PI) / 180;
  const rise = r * Math.cos(kink) * Math.tan((50 * Math.PI) / 180);
  const spring = NAP(apex) - rise - r * Math.sin(kink);
  const profile = [[x - r, BASE - 1], [x + r, BASE - 1]];
  for (let k = 0; k <= 8; k++) {
    const a = (kink * k) / 8;
    profile.push([x + r * Math.cos(a), spring + r * Math.sin(a)]);
  }
  profile.push([x, NAP(apex)]);
  for (let k = 8; k >= 0; k--) {
    const a = (kink * k) / 8;
    profile.push([x - r * Math.cos(a), spring + r * Math.sin(a)]);
  }
  const pts = [];
  for (const y of [-12, 12]) for (const [px, z] of profile) pts.push([px, y, z]);
  return { solid: Manifold.hull(pts), spring };
};
// Kantelen langs een gevel: blokken van 1,0 m om de 2,0 m.
const merlons = ([x0, x1], [y0, y1], z) => {
  const n = Math.floor((x1 - x0 - MERLON.w) / MERLON.period) + 1;
  const start = x0 + (x1 - x0 - (n - 1) * MERLON.period - MERLON.w) / 2;
  return Array.from({ length: n }, (_, k) => box([start + k * MERLON.period, start + k * MERLON.period + MERLON.w], [y0, y1], z - 0.01, z + 1.1));
};

// ---------- poort ----------
const outline = Manifold.union([prism(PAND, BASE, 200), prism(PAND_NO, BASE, 200), prism(GATE_SPAN, BASE, 200)]);
const within = (xr) => Manifold.intersection(outline, box(xr, [-20, 20], BASE, 200));
const waterGate = Manifold.union([
  Manifold.intersection(within(WATER_GATE.x), box(WATER_GATE.x, [-20, 20], BASE, NAP(WATER_GATE.eave))),
  Manifold.intersection(hipRoof(WATER_GATE.x, WATER_GATE.eave, WATER_GATE.ridge, WATER_GATE.ridgeX), outline),
]);
const southWing = Manifold.union([
  Manifold.intersection(within(SOUTH_WING.x), box(SOUTH_WING.x, [-20, 20], BASE, NAP(SOUTH_WING.eave))),
  Manifold.intersection(hipRoof(SOUTH_WING.roofX, SOUTH_WING.eave, SOUTH_WING.ridge, SOUTH_WING.ridgeX), outline),
]);
const curtain = Manifold.union([
  Manifold.intersection(within(CURTAIN.x), box(CURTAIN.x, [-20, 2.45], BASE, NAP(CURTAIN.top))),
  Manifold.intersection(within([ANNEX.x[0], ANNEX.x[1]]), box(ANNEX.x, ANNEX.y, BASE, NAP(ANNEX.top))),
  ...merlons([CURTAIN.x[0] + 0.3, CURTAIN.x[1] - 0.3], [-2.95, -2.05], NAP(CURTAIN.top)),
  ...merlons([CURTAIN.x[0] + 0.3, CURTAIN.x[1] - 0.3], [1.45, 2.35], NAP(CURTAIN.top)),
]);
const landGate = Manifold.union([
  Manifold.intersection(within(LAND_GATE.x), box(LAND_GATE.x, [-20, LAND_GATE.yVeld], BASE, NAP(LAND_GATE.top))),
  ...merlons([LAND_GATE.x[0] + 0.4, 21.4], [-2.95, -2.05], NAP(LAND_GATE.top)),
  ...merlons([13.5, 18.1], [LAND_GATE.yVeld - 0.95, LAND_GATE.yVeld - 0.05], NAP(LAND_GATE.top)),
]);
const machicolation = (() => {
  const m = MACHICOLATION;
  const y1 = m.y + m.depth;
  const drop = m.depth * Math.tan((55 * Math.PI) / 180);
  const pts = [];
  for (const x of m.x) {
    pts.push([x, m.y - 0.1, NAP(m.top)], [x, y1, NAP(m.top)], [x, y1, NAP(m.bottom) + drop], [x, m.y - 0.1, NAP(m.bottom)]);
  }
  return Manifold.hull(pts);
})();
const tower = (t) =>
  Manifold.union([
    prism(octagon(t.c, t.r), BASE, NAP(t.corbel) + 0.01),
    prism(octagon(t.c, t.r + CORBEL), NAP(t.corbel), NAP(t.eave)),
    Manifold.hull([...at(octagon(t.c, t.r + CORBEL), NAP(t.eave) - 0.01), [t.c[0], t.c[1], NAP(t.tip)]]),
  ]);
const waterArch = passage(WATER_ARCH);
const landArch = passage(LAND_ARCH);
const gate = Manifold.union([waterGate, southWing, curtain, landGate, machicolation, ...TOWERS.map(tower)])
  .subtract(waterArch.solid)
  .subtract(landArch.solid);

const nodes = [["building:poort", gate]];
const all = gate;

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de
  // onderkant: alleen de uitkragingen van de drie torentjes.
  const allowed = new Set(TOWERS.map((t) => NAP(t.corbel).toFixed(2)));
  for (const [name, solid] of nodes) {
    const mesh = solid.getMesh();
    const v = mesh.vertProperties;
    const s = mesh.numProp;
    const levels = new Map();
    const where = new Map();
    for (let t = 0; t < mesh.triVerts.length; t += 3) {
      const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
      if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
      const e1 = p[1].map((c, i) => c - p[0][i]);
      const e2 = p[2].map((c, i) => c - p[0][i]);
      const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      const len = Math.hypot(...n);
      if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
      const z = Math.min(...p.map((q) => q[2])).toFixed(2);
      levels.set(z, (levels.get(z) ?? 0) + len / 2);
      if (!allowed.has(z)) where.set(z, [0, 1].map((a) => +((p[0][a] + p[1][a] + p[2][a]) / 3).toFixed(2)));
    }
    console.log(`${name}: ondervlakken (lokale z: m2)`, Object.fromEntries(levels));
    for (const [z, area] of levels) if (!allowed.has(z) && area > 0.01) throw new Error(`${name}: overhang op z ${z} bij x, y ${where.get(z)}`);
    if (levels.size === 0) throw new Error(`${name}: geen uitkraging`);
    const bb = solid.boundingBox();
    if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  }
  console.log("aanzet waterboog NAP", +(waterArch.spring + GROUND_NAP).toFixed(2), "landboog NAP", +(landArch.spring + GROUND_NAP).toFixed(2));
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
const glbFile = path.join(outDir, "koppelpoort.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-koppelpoort.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `koppelpoort-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Koppelpoort Amersfoort 1:${scale} mm Z-up`);
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

const gateBox = gate.boundingBox();
await writeFile(
  path.join(outDir, "koppelpoort.json"),
  JSON.stringify(
    {
      name: "Koppelpoort",
      file: "koppelpoort.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      // 0 in plaats van -0,3: de muren beginnen al onder het water en de
      // doorgangen zijn tot de onderkant open.
      groundOffsetMetres: 0,
      // Op de straat aan beide kanten van de landpoort en de kade aan de
      // stadszijde van de zuidwestvleugel (NAP +2,4 tot +2,6 m); niet het
      // water en niet het hogere plein voor de waterpoort.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0307100000334171", "NL.IMBAG.Pand.0307100000522091"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (154869,26, 463423,65), het zwaartepunt van het BAG-pand, op het maaiveld van de kade en de straat (NAP +2,5 m), +X langs de poort naar het noordoosten (47,5 graden vanaf het oosten) en +Y naar het noordwesten, de veldzijde aan de kom van de Eem. Eén node building:poort met van noordoost naar zuidwest de landpoort (poortlichaam tot +8,5 m met kantelen, aan de veldzijde twee achtkante torentjes met een 0,3 m uitkragende bovenbouw en een naald tot +15,5 m) met de landdoorgang van 3,4 m breed (spitse top op +7,3 m), de weermuur met weergang (+7,9 m) en kantelen en het aanbouwtje aan de veldzijde, het poortgebouw van de waterpoort met schilddak (goot +10,8 m, nok +14,6 m), de mezekouw en de waterboog van 6,6 m breed (spitse top op +4,0 m) over de Eem, de zuidwestvleugel met schilddak (nok +13,5 m) en het zuidwesttorentje tot +18 m. Alles begint op NAP -1,5 m, onder het water, dat in het PDOK-terrein zit; beide doorgangen zijn tot de onderkant open. Alles staat recht op of loopt schuin omhoog, behalve de bovenbouw van de drie torentjes die 0,3 m uitkraagt, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van de twee BAG-panden van de poort. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`koppelpoort-1-${scale}.stl`],
      realWorld: {
        lengthM: +(gateBox.max[0] - gateBox.min[0]).toFixed(2),
        widthM: +(gateBox.max[1] - gateBox.min[1]).toFixed(2),
        highestPointNapM: +(gateBox.max[2] + GROUND_NAP).toFixed(2),
        landGateTopNapM: LAND_GATE.top,
        curtainWallTopNapM: CURTAIN.top,
        waterGateEaveNapM: WATER_GATE.eave,
        waterGateRidgeNapM: WATER_GATE.ridge,
        southWingRidgeNapM: SOUTH_WING.ridge,
        landGateTowerTipNapM: TOWERS[1].tip,
        southWestTowerTipNapM: TOWERS[0].tip,
        waterArchWidthM: WATER_ARCH.w,
        waterArchApexNapM: WATER_ARCH.apex,
        landArchWidthM: LAND_ARCH.w,
        landArchApexNapM: LAND_ARCH.apex,
        groundNapM: GROUND_NAP,
        waterNapM: 0,
        baseNapM: -1.5,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Koppelpoort",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/7928",
        "PDOK BAG panden 0307100000334171 (poort) en 0307100000522091 (noordoostkant van de landpoort), EPSG:28992",
        "PDOK BGT waterdeel en overbruggingsdeel: de waterloop onder de poort (7,3 m breed)",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dak-, muur- en torenhoogtes, kade, straat en water",
        "Wikimedia Commons: Amersfoort Koppelpoort seen from the southeast.jpg, 7928 Koppelpoort.jpg, Aanzicht veldzijde Koppelpoort - Amersfoort - 20009015 - RCE.jpg (veldzijde); Aanzicht stadszijde Koppelpoort - Amersfoort - 20009017 - RCE.jpg (stadszijde)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

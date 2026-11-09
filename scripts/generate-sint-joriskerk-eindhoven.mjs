import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Sint-Joriskerk, Eindhoven-Stratum (rijksmonument 14646). Neogotische kruisbasiliek van H.J. van Tulder
// (1884-1885) met westtoren van J. van Gils (1911). Gebouwstelsel: X langs de as naar het koor (oost),
// oorsprong in het hart van de viering op maaiveld. Maten uit BAG-contour en AHN-DSM (0,5 m) in dit stelsel,
// gecontroleerd met 3D BAG en Commons-foto's.
const argv = process.argv.slice(2), flag = (n, f) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : f; };
const slug = "sint-joriskerk-eindhoven";
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), slug);
const wasm = await Module(); wasm.setup(); const { Manifold, CrossSection } = wasm;

const BASE = -0.5, ORIGIN = [162014.9, 382325.06], X_AXIS = [0.9851, 0.1719];
const GROUND_NAP = 18.317;
const RIDGE = 32.05, SLOPE = 1.9; // nok van schip, dwarsschip en koor; dakhelling ~62 graden
const TOWER = { u0: -48.9, u1: -36.6, v: 5.6, top: 44.9, cu: -42.75, cv: 0.05 };

const prism = (p, z0, z1) => Manifold.extrude(new CrossSection([p]), z1 - z0).translate([0, 0, z0]);
const box = (a, b, c, d, z0, z1) => prism([[a, c], [b, c], [b, d], [a, d]], z0, z1);
const ccw = p => { let s = 0; for (let i = 0; i < p.length; i++) { const [x0, y0] = p[i], [x1, y1] = p[(i + 1) % p.length]; s += x0 * y1 - x1 * y0; } return s > 0 ? p : [...p].reverse(); };
const keepBelow = (s, a, b, c) => { const n = Math.hypot(a, b, 1); return s.trimByPlane([a / n, b / n, -1 / n], -c / n); }; // z <= a u + b v + c
const keepAbove = (s, a, b, c) => { const n = Math.hypot(a, b, 1); return s.trimByPlane([-a / n, -b / n, 1 / n], c / n); }; // z >= a u + b v + c
// Dakvlakken: per rand een vlak dat vanaf de goot (eave) met helling `slope` naar binnen stijgt; null = geen dakvlak
// (gevel, aansluiting). Voor een convexe plattegrond geeft dat schilddak, zadeldak of lessenaarsdak als planvergelijkingen.
function roofed(poly, top, edges) {
  const p = ccw(poly);
  if (p !== poly) edges = [...edges].reverse().map((_, i, arr) => arr[(i + 1) % arr.length]);
  let s = prism(p, BASE, top);
  for (let i = 0; i < p.length; i++) {
    const e = edges[i]; if (!e) continue;
    const [ax, ay] = p[i], [bx, by] = p[(i + 1) % p.length], L = Math.hypot(bx - ax, by - ay), nx = -(by - ay) / L, ny = (bx - ax) / L;
    const [eave, slope] = e; s = keepBelow(s, slope * nx, slope * ny, eave - slope * (nx * ax + ny * ay));
  }
  return s;
}
const oct = (cx, cy, r0, r1, z0, z1) => Manifold.cylinder(z1 - z0, r0, r1, 8).rotate([0, 0, 22.5]).translate([cx, cy, z0]);
// Blinde nis met spitse top (>= 50 graden) in een gevel met buitennormaal onder hoek `deg`.
function niche(cu, cv, deg, z0, w, h, depth = 0.35) {
  const k = w * 0.62, prof = [[-w / 2, 0], [w / 2, 0], [w / 2, h - k], [0, h], [-w / 2, h - k]];
  return Manifold.extrude(new CrossSection([prof]), depth + 1).rotate([90, 0, 0]).translate([0, 1, z0]).rotate([0, 0, deg - 90]).translate([cu, cv, 0]);
}
const mirrorV = s => s.mirror([0, 1, 0]);

// --- Schip (middenschip met lichtbeuk), zijbeuken onder lessenaarsdaken ---
const T_V_IN = TOWER.v - 0.1; // zijbeuken en kapellen sluiten aan op de torenschacht
const NAVE_V = 6.4, AISLE_V = 11.15, AISLE_EAVE = 10.5, AISLE_SLOPE = 0.63;
const nave = roofed([[TOWER.u1 - 0.5, -NAVE_V], [-4.5, -NAVE_V], [-4.5, NAVE_V], [TOWER.u1 - 0.5, NAVE_V]], RIDGE,
  [[RIDGE - SLOPE * NAVE_V, SLOPE], null, [RIDGE - SLOPE * NAVE_V, SLOPE], null]);
const aisleN = roofed([[-42.75, T_V_IN], [-5, T_V_IN], [-5, AISLE_V], [-42.75, AISLE_V]], AISLE_EAVE + AISLE_SLOPE * (AISLE_V - NAVE_V),
  [null, null, [AISLE_EAVE, AISLE_SLOPE], null]);
// Westelijke hoekkapellen naast de toren: veelhoekig, schilddak met nok dwars op de as.
const chapelN = roofed([[-42.7, T_V_IN], [-36.3, T_V_IN], [-36.3, 11.9], [-38.0, 13.6], [-40.7, 13.6], [-42.7, 11.8]], 13.75,
  [null, [10.0, 1.2], [10.0, 1.2], [10.0, 1.2], [10.0, 1.2], [10.0, 1.2]]);
// Aanbouwtjes in de oksels van zijbeuk en dwarsschip, lessenaarsdak oplopend naar het dwarsschip.
const angleNW = roofed([[-8.57, 11.0], [-5.2, 11.0], [-5.2, 14.7], [-8.57, 14.7]], 12.6, [null, null, null, [10.3, 0.75]]);
const angleSW = roofed([[-8.8, -14.53], [-5.2, -14.53], [-5.2, -11.0], [-8.8, -11.0]], 12.6, [null, null, null, [10.3, 0.75]]);

// --- Dwarsschip met topgevels, hoektorentjes en noordportaal ---
const TR_U = 5.45, TR_N = 18.45, TR_S = -18.76, TR_EAVE = RIDGE - SLOPE * TR_U;
const transept = roofed([[-TR_U, TR_S], [TR_U, TR_S], [TR_U, TR_N], [-TR_U, TR_N]], RIDGE,
  [null, [TR_EAVE, SLOPE], null, [TR_EAVE, SLOPE]]);
const gableN = roofed([[-TR_U, TR_N - 0.9], [TR_U, TR_N - 0.9], [TR_U, TR_N], [-TR_U, TR_N]], RIDGE + 0.6, [null, [TR_EAVE + 0.6, SLOPE], null, [TR_EAVE + 0.6, SLOPE]]);
const gableS = roofed([[-TR_U, TR_S], [TR_U, TR_S], [TR_U, TR_S + 0.9], [-TR_U, TR_S + 0.9]], RIDGE + 0.6, [null, [TR_EAVE + 0.6, SLOPE], null, [TR_EAVE + 0.6, SLOPE]]);
const turret = (x, y) => Manifold.union([oct(x, y, 0.85, 0.85, BASE, 22.0), oct(x, y, 0.85, 0.45, 21.99, 25.0)]);
const transeptTurrets = [turret(-5.85, 18.85), turret(5.85, 18.85), turret(-5.85, -19.15), turret(5.85, -19.15)];
const stairNW = Manifold.union([oct(-6.55, 15.0, 1.3, 1.3, BASE, 23.5), oct(-6.55, 15.0, 1.3, 0.45, 23.49, 27.3)]);
const porchN = roofed([[-1.61, TR_N - 0.5], [2.09, TR_N - 0.5], [2.09, 20.86], [-1.61, 20.86]], 5.4, [null, [3.35, 1.1], null, [3.35, 1.1]]);

// --- Koor met driezijdige sluiting (3/8), sacristie en ontmoetingsruimte met galerijen ---
const CH_V = 6.3, CH_C = 19.7, R8 = CH_V / Math.cos(Math.PI / 8), CH_EAVE = RIDGE - SLOPE * CH_V;
const apse = [-67.5, -22.5, 22.5, 67.5].map(a => [CH_C + R8 * Math.cos(a * Math.PI / 180), R8 * Math.sin(a * Math.PI / 180)]);
const choirPoly = [[4.5, -CH_V], ...apse, [4.5, CH_V]];
const choir = roofed(choirPoly, RIDGE, [[CH_EAVE, SLOPE], [CH_EAVE, SLOPE], [CH_EAVE, SLOPE], [CH_EAVE, SLOPE], [CH_EAVE, SLOPE], null]);
const annexN = roofed([[TR_U - 0.2, CH_V - 0.3], [22.25, CH_V - 0.3], [22.2, 9.3], [20.6, 11.05], [TR_U - 0.2, 11.05]], 11.55,
  [null, [7.7, 1.3], [7.7, 1.3], [8.3, 1.4], null]);
const annexS = roofed([[TR_U - 0.2, -11.05], [20.6, -11.05], [22.2, -9.3], [22.25, -CH_V + 0.3], [TR_U - 0.2, -CH_V + 0.3]], 11.55,
  [[8.3, 1.4], [7.7, 1.3], [7.7, 1.3], null, null]);
const annexGableN = roofed([[12.83, 9.0], [17.13, 9.0], [17.13, 12.9], [12.83, 12.9]], 11.4, [null, [8.2, 1.5], null, [8.2, 1.5]]);
const annexGableS = roofed([[12.83, -13.48], [17.13, -13.48], [17.13, -9.0], [12.83, -9.0]], 11.4, [null, [8.2, 1.5], null, [8.2, 1.5]]);
const angleNE = roofed([[TR_U - 0.2, 11.0], [10.17, 11.0], [8.6, 13.79], [5.93, 14.36], [TR_U - 0.2, 14.36]], 12.8, [null, [9.4, 0.7], [9.4, 0.7], null, null]);
const angleSE = roofed([[TR_U - 0.2, -15.14], [7.92, -15.15], [9.2, -12.78], [9.2, -11.0], [TR_U - 0.2, -11.0]], 12.8, [null, [9.6, 0.7], [9.6, 0.7], null, null]);
// Lage gang naar de pastorie (deel van hetzelfde BAG-pand).
const corridor = prism([[22.0, -7.35], [26.23, -7.35], [29.57, 0.03], [33.1, 0.23], [33.01, 1.92], [22.0, 1.41]], BASE, 4.3);

// --- Steunberen ---
const butt = [];
for (const [u, side] of [[-30.95, 1], [-25.3, 1], [-19.5, 1], [-13.8, 1], [-31.1, -1], [-25.4, -1], [-19.7, -1], [-13.8, -1]]) {
  let b = box(u - 0.45, u + 0.45, AISLE_V - 0.3, AISLE_V + 1.05, BASE, 10.8); b = keepBelow(b, 0, -1.0, 10.8 + AISLE_V); butt.push(side > 0 ? b : mirrorV(b));
}
for (const a of [-67.5, -22.5, 22.5, 67.5]) {
  let b = box(-0.6, 1.1, -0.5, 0.5, BASE, 16.5); b = keepBelow(b, -1.0, 0, 16.5);
  butt.push(b.rotate([0, 0, a]).translate([CH_C + R8 * Math.cos(a * Math.PI / 180), R8 * Math.sin(a * Math.PI / 180), 0]));
}

// --- Westtoren: schacht met hoeksteunberen, portaalblok, wimbergen, hoekpinakels, ingesnoerde achtkante spits ---
const T = TOWER;
const shaft = box(T.u0, T.u1, -T.v, T.v, BASE, T.top);
let portal = box(-49.6, T.u0 + 0.2, -5.4, 5.4, BASE, 7.6); portal = keepBelow(portal, 1.0, 0, 7.6 - T.u0);
const tButt = [];
for (const s of [1, -1]) {
  for (const u of [-48.1, -37.7]) { let b = box(u, u + 1.1, T.v - 0.3, 6.9, BASE, 30); b = keepBelow(b, 0, -1, 30 + T.v); tButt.push(s > 0 ? b : mirrorV(b)); }
  let w = box(-49.6, T.u0 + 0.3, 4.4, 5.5, BASE, 30); w = keepBelow(w, 1, 0, 30 + T.u0); tButt.push(s > 0 ? w : mirrorV(w));
}
const stairTower = Manifold.union([Manifold.cylinder(25.6, 1.7, 1.7, 24).translate([-42.8, 6.35, BASE]), Manifold.cylinder(1.6, 1.7, 0.5, 24).translate([-42.8, 6.35, 25.09])]);
const GP = 49.7, GW = 2.7, GS = (GP - (T.top - 0.4)) / GW;
const towerGables = [
  keepBelow(box(T.u0, T.u0 + 1.0, T.cv - GW, T.cv + GW, T.top - 1, GP), 0, GS, GP - GS * T.cv),
  keepBelow(box(T.u1 - 1.0, T.u1, T.cv - GW, T.cv + GW, T.top - 1, GP), 0, GS, GP - GS * T.cv),
  keepBelow(box(T.cu - GW, T.cu + GW, T.v - 1.0, T.v, T.top - 1, GP), GS, 0, GP - GS * T.cu),
  keepBelow(box(T.cu - GW, T.cu + GW, -T.v, -T.v + 1.0, T.top - 1, GP), GS, 0, GP - GS * T.cu),
].map((g, i) => keepBelow(g, i < 2 ? 0 : -GS, i < 2 ? -GS : 0, GP + (i < 2 ? GS * T.cv : GS * T.cu)));
const pinnacles = [];
for (const u of [T.u0 + 0.7, T.u1 - 0.7]) for (const v of [-T.v + 0.7, T.v - 0.7]) pinnacles.push(oct(u, v, 0.75, 0.75, T.top - 0.5, 46.6), oct(u, v, 0.75, 0.3, 46.59, 48.8));
const SP = { z0: T.top - 0.1, r0: 4.2, z1: 68.0, r1: 2.0, lantern: 76.0, rl: 1.25, tip: 85.0, rt: 0.45 };
const spire = Manifold.union([
  oct(T.cu, T.cv, SP.r0, SP.r1, SP.z0, SP.z1),
  oct(T.cu, T.cv, SP.rl, SP.rl, SP.z1 - 0.01, SP.lantern),
  oct(T.cu, T.cv, SP.rl, SP.rt, SP.lantern - 0.01, SP.tip),
]);
// Dakkapelletjes op de spits (vier zijden), onderkant 45 graden zodat ze zonder steun printen.
const spireDormers = [0, 90, 180, 270].map(a => {
  let d = box(1.4, 2.95, -0.55, 0.55, 62.4, 66.2); d = keepBelow(d, 0, 1.4, 66.2); d = keepBelow(d, 0, -1.4, 66.2); d = keepAbove(d, 1.0, 0, 62.4 - 1.6);
  return d.rotate([0, 0, a]).translate([T.cu, T.cv, 0]);
});

// --- Dakruiter op de viering en dakkapelletjes op het schip ---
const flecheZ = 38.2;
const fleche = Manifold.union([oct(0, 0, 1.4, 1.4, 29.0, flecheZ), oct(0, 0, 1.4, 0.4, flecheZ - 0.01, 50.3)]);
const dormers = [];
for (const u of [-30.5, -24.8, -19.1, -13.4]) for (const s of [1, -1]) {
  let d = box(u - 0.6, u + 0.6, 2.0, 4.4, 22.0, 25.7); d = keepBelow(d, 1.2, 0, 25.7 - 1.2 * u); d = keepBelow(d, -1.2, 0, 25.7 + 1.2 * u);
  dormers.push(s > 0 ? d : mirrorV(d));
}

let church = Manifold.union([
  nave, aisleN, mirrorV(aisleN), chapelN, mirrorV(chapelN), angleNW, angleSW,
  transept, gableN, gableS, porchN,
  choir, annexN, annexS, annexGableN, annexGableS, angleNE, angleSE, corridor, ...butt,
  shaft, portal, ...tButt, ...towerGables, ...pinnacles, spire, ...spireDormers, fleche, ...dormers,
]);

// --- Gevelreliëf: blinde vensternissen ---
const cuts = [];
for (const u of [-33.6, -28.1, -22.4, -16.6, -11.2]) for (const s of [1, -1]) {
  cuts.push(niche(u, s * AISLE_V, s * 90, 2.2, 1.7, 6.2));          // zijbeukvensters
  cuts.push(niche(u, s * NAVE_V, s * 90, 14.4, 1.5, 4.8));          // lichtbeuk
}
for (const s of [1, -1]) {
  for (const v of [9.0, 16.2]) cuts.push(niche(TR_U, s * v, 0, 13.8, 1.5, 6.0));
  for (const v of s > 0 ? [9.0] : [9.0, 16.2]) cuts.push(niche(-TR_U, s * v, 180, 13.8, 1.5, 6.0)); // noordwest: traptoren
  for (const u of [8.8, 12.0, 15.2]) cuts.push(niche(u, s * CH_V, s * 90, 13.0, 1.4, 5.6));
}
cuts.push(niche(0, TR_N, 90, 6.0, 4.0, 12.5), niche(0, TR_S, -90, 5.0, 4.0, 13.5), niche(0.24, 20.86, 90, 0, 1.6, 3.0, 0.4));
for (const a of [-45, 0, 45]) { const r = CH_V; cuts.push(niche(CH_C + r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180), a, a === 0 ? 6.5 : 5.5, 1.6, 12.6)); }
// Toren: portaal, groot westvenster, vensters en galmgaten aan vier zijden.
cuts.push(niche(-49.6, T.cv, 180, 0, 2.6, 5.8, 0.5), niche(T.u0, T.cv, 180, 8.6, 2.8, 11.0, 0.4));
for (const [cu, cv, deg] of [[T.u0, T.cv, 180], [T.u1, T.cv, 0], [T.cu, T.v, 90], [T.cu, -T.v, -90]]) {
  const along = deg === 180 || deg === 0 ? [0, 1] : [1, 0];
  cuts.push(deg === 90 ? niche(cu, cv, deg, 27.2, 2.0, 5.3, 0.4) : niche(cu, cv, deg, 21.5, 2.0, 11.0, 0.4)); // noord: boven de traptoren
  for (const o of [-2.4, 0, 2.4]) cuts.push(niche(cu + along[0] * o, cv + along[1] * o, deg, 35.0, 1.4, 7.4, 0.4));
}
// Traptorens en hoektorentjes pas na de nissen, zodat een nis er geen tunnel doorheen snijdt.
church = Manifold.union([church.subtract(Manifold.union(cuts)), ...transeptTurrets, stairNW, stairTower]);

const parts = [["building:kerk", church]];
const META = {
  name: "Sint-Joriskerk Eindhoven",
  origin: ORIGIN, xAxis: X_AXIS, groundHeight: GROUND_NAP, groundOffsetMetres: BASE,
  replacesBuildings: ["NL.IMBAG.Pand.0772100000277589"],
  description: "Neogotische kruisbasiliek (Van Tulder, 1885) met westtoren van Van Gils (1911); oorsprong in de viering, X-as langs het schip naar het koor.",
  realWorld: { groundNapM: GROUND_NAP, ridgeNapM: +(GROUND_NAP + RIDGE).toFixed(2), towerParapetNapM: +(GROUND_NAP + T.top).toFixed(2), ahnSpireNapM: 102.77, lengthM: 82.7, transeptM: 37.2, wikipediaTowerM: 88 },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Joriskerk_(Eindhoven)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/14646",
    "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000277589",
    "https://service.pdok.nl/rws/ahn/wcs/v1_0 (dsm_05m, dtm_05m)",
    "https://commons.wikimedia.org/wiki/Category:St._Joriskerk_(Eindhoven)",
  ],
};

function toStl(solid, label, mmPerMetre) {
  const m = solid.getMesh(), v = m.vertProperties, tri = m.triVerts, s = m.numProp, n = tri.length / 3, b = Buffer.alloc(84 + n * 50); b.write(label.slice(0, 79), 0, 80, "ascii"); b.writeUInt32LE(n, 80); let o = 84;
  for (let t = 0; t < n; t++) { const p = [0, 1, 2].map(k => { const i = tri[t * 3 + k] * s; return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre]; }); const a = p[1].map((c, i) => c - p[0][i]), d = p[2].map((c, i) => c - p[0][i]), q = [a[1] * d[2] - a[2] * d[1], a[2] * d[0] - a[0] * d[2], a[0] * d[1] - a[1] * d[0]], l = Math.hypot(...q) || 1; for (const c of [...q.map(x => x / l), ...p[0], ...p[1], ...p[2]]) { b.writeFloatLE(c, o); o += 4; } b.writeUInt16LE(0, o); o += 2; }
  return b;
}
function toGlb(named) {
  const chunks = [], views = [], acc = [], meshes = [], nodes = []; let length = 0;
  const push = (a, target) => { const b = Buffer.from(a.buffer, a.byteOffset, a.byteLength), p = Buffer.concat([b, Buffer.alloc((4 - b.length % 4) % 4)]); views.push({ buffer: 0, byteOffset: length, byteLength: b.length, target }); chunks.push(p); length += p.length; return views.length - 1; };
  for (const [name, solid] of named) { const m = solid.calculateNormals(0, 40).getMesh(), s = m.numProp, n = m.vertProperties.length / s, pos = new Float32Array(n * 3), norm = new Float32Array(n * 3), min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]; for (let i = 0; i < n; i++) { const v = m.vertProperties, p = [v[i * s], v[i * s + 2], -v[i * s + 1]], q = s >= 6 ? [v[i * s + 3], v[i * s + 5], -v[i * s + 4]] : [0, 1, 0]; for (let j = 0; j < 3; j++) { pos[i * 3 + j] = p[j]; norm[i * 3 + j] = q[j]; min[j] = Math.min(min[j], p[j]); max[j] = Math.max(max[j], p[j]); } } const pi = push(pos, 34962), ni = push(norm, 34962), ii = push(Uint32Array.from(m.triVerts), 34963), a = acc.length; acc.push({ bufferView: pi, componentType: 5126, count: n, type: "VEC3", min, max }, { bufferView: ni, componentType: 5126, count: n, type: "VEC3" }, { bufferView: ii, componentType: 5125, count: m.triVerts.length, type: "SCALAR" }); meshes.push({ name, primitives: [{ attributes: { POSITION: a, NORMAL: a + 1 }, indices: a + 2, mode: 4 }] }); nodes.push({ name, mesh: meshes.length - 1 }); }
  const json = Buffer.from(JSON.stringify({ asset: { version: "2.0", generator: `NederPrint generate-${slug}.mjs` }, scene: 0, scenes: [{ nodes: nodes.map((_, i) => i) }], nodes, meshes, buffers: [{ byteLength: length }], bufferViews: views, accessors: acc })), jp = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]), bin = Buffer.concat(chunks), h = Buffer.alloc(12); h.writeUInt32LE(0x46546c67, 0); h.writeUInt32LE(2, 4); h.writeUInt32LE(12 + 8 + jp.length + 8 + bin.length, 8); const ch = (len, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(len, 0); b.writeUInt32LE(type, 4); return b; }; return Buffer.concat([h, ch(jp.length, 0x4e4f534a), jp, ch(bin.length, 0x004e4942), bin]);
}

if (church.status() !== "NoError") throw new Error(church.status());
const bb = church.boundingBox(); if (Math.abs(bb.min[2] - BASE) > 1e-5) throw new Error("modelvoet is niet vlak");
const pieces = church.decompose();
console.log(JSON.stringify({ slug, status: church.status(), genus: church.genus(), components: pieces.length, triangles: church.numTri(), volume: +church.volume().toFixed(1), bounds: { min: bb.min, max: bb.max }, size: bb.max.map((v, i) => +(v - bb.min[i]).toFixed(2)) }, null, 2));
if (pieces.length !== 1) throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir, { recursive: true });
const glb = `${slug}.glb`, printFiles = [100, 1000].map(sc => `${slug}-1-${sc}.stl`);
await writeFile(path.join(outDir, glb), toGlb(parts));
for (const sc of [100, 1000]) await writeFile(path.join(outDir, `${slug}-1-${sc}.stl`), toStl(church.translate([0, 0, -BASE]), `NederPrint ${META.name} 1:${sc} mm Z-up`, 1000 / sc));
await writeFile(path.join(outDir, `${slug}.json`), JSON.stringify({ ...META, file: glb, unitsPerMetre: 1, className: "building", crs: "EPSG:28992", printFiles, realWorld: { ...META.realWorld, highestPointM: +bb.max[2].toFixed(2) } }, null, 2) + "\n");

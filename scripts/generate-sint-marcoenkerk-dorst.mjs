// Sint-Marculphuskerk (Sint-Marcoenkerk) in Dorst, Jos Cuypers 1911-1912, rijksmonument 520024.
// Pseudobasilicale bakstenen kruiskerk met het koor op het noorden: een brede
// voorbouw met middentoren en twee lage bijtorens aan de Baarschotsestraat,
// schip onder één kap, zijbeuken met een dwars zadeldakje per travee, een lager
// dwarsschip, een driezijdig gesloten koor en twee kapellen naast het koor.
//
// Gebouwstelsel (u, v): u langs de as van de voorgevel (zuid) naar het koor
// (noord), v 90 graden linksom (west). Hoogtes in meters boven NAP +6,40 m.
// Maten: BAG-contour van pand 0826100000018085 en AHN5-DSM (0,5 m, PDOK-WCS),
// dakhellingen uit dwarsprofielen; vensters, portaal en uurwerkkapellen van
// Wikimedia Commons-foto's.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (n, f) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : f; };
const slug = "sint-marcoenkerk-dorst";
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), slug);
const wasm = await Module(); wasm.setup();
const { Manifold, CrossSection } = wasm;

const BASE = -0.5;
const GROUND_NAP = 6.4;
// RD-oorsprong op het hart van de kruising; X_AXIS is de u-as (naar het koor).
const ORIGIN = [118215, 400303.4], X_AXIS = [0.448, 0.894];
const ORIGIN_UV = [3.4877, 0.6292]; // ORIGIN in het (u, v)-stelsel van de metingen

const prism = (p, z0, z1) => Manifold.extrude(new CrossSection([p]), z1 - z0).translate([0, 0, z0]);
const box = (u0, u1, v0, v1, z0, z1) => prism([[u0, v0], [u1, v0], [u1, v1], [u0, v1]], z0, z1);
// Houd alles onder het vlak z = a u + b v + c.
const plane = (s, a, b, c) => { const n = Math.hypot(a, b, 1); return s.trimByPlane([a / n, b / n, -1 / n], -c / n); };
// Dak op een linksom georiënteerde veelhoek: per rand een dakvlak dat vanaf de
// goot (eave) met helling slopes[i] naar binnen oploopt; null = topgevel.
function roofed(poly, eave, slopes, top = 40) {
  let s = prism(poly, BASE, top);
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length], k = slopes[i];
    if (k == null) return;
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]), nx = -(q[1] - p[1]) / len, ny = (q[0] - p[0]) / len;
    s = plane(s, k * nx, k * ny, eave - k * (nx * p[0] + ny * p[1]));
  });
  return s;
}
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Blinde nis met spitse top in een gevel: punt op het gevelvlak, naar buiten wijzende normaal.
function niche(pu, pv, nu, nv, z0, w, h, d = 0.35) {
  const poly = [[-w / 2, 0], [w / 2, 0], [w / 2, h - w * 0.6], [0, h], [-w / 2, h - w * 0.6]];
  const ang = Math.atan2(nv, nu) * 180 / Math.PI - 90;
  return prism(poly, 0, d + 1).rotate([90, 0, 0]).translate([0, 1, 0]).rotate([0, 0, ang]).translate([pu, pv, z0]);
}

// ---- Hoofdvolumes -------------------------------------------------------
const NAVE_V = [-4.45, 5.85], AXIS_V = 0.7;
// Schip tot het einde van het dwarsschip; nok NAP +19,8 (13,4 m), goot 8,6 m, 43 graden.
const nave = roofed(rect(-16.8, 8.4, ...NAVE_V), 8.6, [0.93, null, 0.93, null]);
// Zijbeuken: drie traveeën van 5 m met elk een dwars zadeldakje (nok 8,1 m, goot 6,0 m).
const BAYS = [[-16.8, -11.5], [-11.5, -6.5], [-6.5, -1.45]];
const aisles = [];
for (const [v0, v1] of [[5.8, 8.2], [-7.3, -4.4]]) for (const [a, b] of BAYS) {
  let bay = box(a, b, v0, v1, BASE, 12);
  bay = plane(bay, 0.84, 0, 6.0 - 0.84 * a); bay = plane(bay, -0.84, 0, 6.0 + 0.84 * b);
  aisles.push(bay);
}
// Dwarsschip met topgevels; nok 11,8 m, goot 6,85 m. Aan de westgevel een
// risaliet die de topgevel 1,1 m naar voren brengt.
const TRANSEPT_U = [-1.5, 8.4];
const transeptRoof = s => plane(plane(s, 1.0, 0, 6.85 + 1.5), -1.0, 0, 6.85 + 8.4);
const transept = transeptRoof(box(...TRANSEPT_U, -9.4, 10.55, BASE, 14));
const transeptBay = transeptRoof(box(1.53, 5.21, 10.5, 11.6, BASE, 14));
// Koor, driezijdig gesloten; nok 12,4 m, goot 8,2 m, steilere sluiting.
const choirPoly = [[8.35, -3.45], [16.68, -3.45], [18.86, -0.95], [18.86, 2.45], [16.68, 4.95], [8.35, 4.95]];
const choir = roofed(choirPoly, 8.2, [1.0, 1.6, 1.6, 1.6, 1.0, null]);
// Westelijke kapel naast het koor met driezijdige sluiting; nok 10,6 m.
const westChapelPoly = [[8.35, 4.9], [12.6, 4.9], [14.6, 6.55], [14.6, 8.85], [12.6, 10.43], [8.35, 10.43]];
const westChapel = roofed(westChapelPoly, 6.7, [1.42, 2.0, 2.0, 2.0, 1.42, null]);
// Oostelijke kapel (sacristie) tot de noordgevel; nok 8,4 m, goot 4,9 m.
const eastChapel = roofed(rect(8.35, 17.28, -9.5, -3.4), 4.9, [1.15, null, 1.15, null]);
// Platte aanbouw achter de sacristie, 2,3 m.
const annex = box(16.6, 21.38, -8.2, -1.2, BASE, 2.3);

// ---- Voorbouw: middentoren en twee bijtorens -----------------------------
const FRONT_U = -21.76, TOWER = { u0: FRONT_U, u1: -16.16, v0: -2.15, v1: 3.45, top: 16.0 };
const TC = [(TOWER.u0 + TOWER.u1) / 2, (TOWER.v0 + TOWER.v1) / 2], TH = (TOWER.u1 - TOWER.u0) / 2;
const towerBody = box(TOWER.u0, TOWER.u1, TOWER.v0, TOWER.v1, BASE, TOWER.top - 0.6);
// Kroonlijst met fries: kraag van 45 graden, 0,3 m uit de gevel.
const cornice = Manifold.hull([
  box(TOWER.u0, TOWER.u1, TOWER.v0, TOWER.v1, TOWER.top - 0.9, TOWER.top - 0.6),
  box(TOWER.u0 - 0.3, TOWER.u1 + 0.3, TOWER.v0 - 0.3, TOWER.v1 + 0.3, TOWER.top - 0.3, TOWER.top),
]);
// Bijtorens met een steil schilddak (67 graden): goot 10,8 m, nok 13,9 m.
const sideTurret = (v0, v1) => roofed(rect(FRONT_U, -16.75, v0, v1), 10.8, [2.5, 2.5, 2.5, 2.5]);
const turrets = [sideTurret(3.4, 5.9), sideTurret(-4.6, -2.1)];
// Achtzijdige leien naald met ingesnoerde voet; top 32,6 m (AHN-maximum NAP +37,9).
const SPIRE_BASE = TOWER.top, SPIRE_TOP = 32.6, APOTHEM = 2.5;
const octR = a => a / Math.cos(Math.PI / 8);
const needle = Manifold.cylinder(SPIRE_TOP - SPIRE_BASE, octR(APOTHEM), 0.04, 8).rotate([0, 0, 22.5]).translate([TC[0], TC[1], SPIRE_BASE]);
const broachZ = SPIRE_BASE + 3, broachA = APOTHEM * (SPIRE_TOP - broachZ) / (SPIRE_TOP - SPIRE_BASE);
const broach = Manifold.hull([
  box(TC[0] - TH + 0.15, TC[0] + TH - 0.15, TC[1] - TH + 0.15, TC[1] + TH - 0.15, SPIRE_BASE - 0.1, SPIRE_BASE),
  Manifold.cylinder(0.01, octR(broachA), octR(broachA), 8).rotate([0, 0, 22.5]).translate([TC[0], TC[1], broachZ]),
]);
// Uurwerkkapellen op de vier zijden van de naald.
const clocks = [];
for (const a of [0, 90, 180, 270]) {
  let c = box(-0.65, 0.65, 0.8, TH - 0.2, SPIRE_BASE - 0.1, 19.2);
  c = plane(c, 1.1, 0, 19.9); c = plane(c, -1.1, 0, 19.9);
  clocks.push(c.rotate([0, 0, a]).translate([TC[0], TC[1], 0]));
}
// Portaal met luifel boven de ingang (onderkant 45 graden).
const hoodPart = Manifold.extrude(new CrossSection([[[0.05, 3.3], [0.05, 5.6], [-0.85, 5.6], [-0.85, 4.25]]]), 3.0)
  .rotate([90, 0, 0]).translate([FRONT_U, TC[1] + 1.5, 0]);

// ---- Steunberen en dakkapellen ------------------------------------------
const buttresses = [];
// Steunbeer met een afdekking die onder 50 graden naar buiten afloopt; top = hoogte aan de buitenkant.
const buttress = (u0, u1, v0, v1, top, outU, outV) => {
  const k = 1.2, face = outU > 0 ? u1 : outU < 0 ? -u0 : outV > 0 ? v1 : -v0;
  return plane(box(u0, u1, v0, v1, BASE, top + 2), -k * outU, -k * outV, top + k * face);
};
for (const u of [-16.75, -11.5, -6.5]) {
  buttresses.push(buttress(u - 0.45, u + 0.45, 8.1, 8.7, 4.6, 0, 1));
  buttresses.push(buttress(u - 0.45, u + 0.45, -7.9, -7.2, 4.6, 0, -1));
}
for (const [u0, u1] of [[-1.63, -0.98], [7.74, 8.4]]) buttresses.push(buttress(u0, u1, 10.45, 10.95, 5.4, 0, 1));
for (const u of [-1.5, 8.4]) buttresses.push(buttress(u - 0.32, u + 0.32, -9.95, -9.3, 5.4, 0, -1));

const dormer = (uc, vBack, vFront, eave, peak) => {
  let d = box(uc - 0.7, uc + 0.7, Math.min(vBack, vFront), Math.max(vBack, vFront), eave - 3, peak + 0.5);
  const k = (peak - eave) / 0.7;
  d = plane(d, k, 0, peak - k * uc); d = plane(d, -k, 0, peak + k * uc);
  return d;
};
const dormers = [];
for (const u of [-10.2, -5.0, 0.1]) {
  dormers.push(dormer(u, AXIS_V, AXIS_V + 3.3, 11.5, 12.3));
  dormers.push(dormer(u, AXIS_V, AXIS_V - 3.3, 11.5, 12.3));
}
dormers.push(dormer(13.0, 0.75, 4.0, 10.3, 11.1), dormer(13.0, 0.75, -2.5, 10.3, 11.1));

let church = Manifold.union([nave, ...aisles, transept, transeptBay, choir, westChapel, eastChapel, annex,
  towerBody, cornice, ...turrets, needle, broach, ...clocks, hoodPart, ...buttresses, ...dormers]);

// ---- Vensters en galmgaten als blinde nissen ------------------------------
const niches = [];
for (const [a, b] of BAYS) {
  const c = (a + b) / 2;
  niches.push(niche(c, 8.2, 0, 1, 1.6, 1.5, 3.6), niche(c, -7.3, 0, -1, 1.6, 1.5, 3.6));
}
niches.push(niche(3.37, 11.6, 0, 1, 2.2, 2.2, 6.2), niche(3.45, -9.4, 0, -1, 2.2, 2.6, 6.2));
for (const u of [0.4, 6.5]) niches.push(niche(u, 10.55, 0, 1, 2.0, 1.1, 3.6), niche(u, -9.4, 0, -1, 2.0, 1.1, 3.6));
for (const u of [9.6, 11.6]) niches.push(niche(u, 10.43, 0, 1, 2.0, 1.1, 3.4));
for (const u of [10.5, 13.5, 16.2]) niches.push(niche(u, -9.5, 0, -1, 1.2, 0.9, 2.4));
// Koorsluiting: drie vensters.
niches.push(niche(18.86, 0.75, 1, 0, 2.6, 1.3, 4.4));
for (const [p, q] of [[[16.68, -3.45], [18.86, -0.95]], [[18.86, 2.45], [16.68, 4.95]]]) {
  const du = q[0] - p[0], dv = q[1] - p[1], l = Math.hypot(du, dv);
  niches.push(niche((p[0] + q[0]) / 2, (p[1] + q[1]) / 2, dv / l, -du / l, 2.6, 1.2, 4.4));
}
// Voorgevel: ingang, groot venster, smalle vensters in de bijtorens.
niches.push(niche(FRONT_U, TC[1], -1, 0, BASE, 2.0, 3.9));
niches.push(niche(FRONT_U, TC[1], -1, 0, 6.2, 2.4, 4.6));
for (const v of [4.65, -3.35]) niches.push(niche(FRONT_U, v, -1, 0, 3.2, 0.9, 5.2), niche(-19.25, v > 0 ? 5.9 : -4.6, 0, v > 0 ? 1 : -1, 3.2, 0.9, 5.2));
// Galmgaten: drie per zijde boven de daken van de bijtorens.
for (const k of [-1.35, 0, 1.35]) {
  niches.push(niche(FRONT_U, TC[1] + k, -1, 0, 11.9, 0.9, 3.0));
  niches.push(niche(TC[0] + k, TOWER.v1, 0, 1, 11.9, 0.9, 3.0));
  niches.push(niche(TC[0] + k, TOWER.v0, 0, -1, 11.9, 0.9, 3.0));
}
church = church.subtract(Manifold.union(niches));
church = church.translate([-ORIGIN_UV[0], -ORIGIN_UV[1], 0]);

const parts = [["building:kerk", church]];
const bb0 = church.boundingBox();
const META = {
  name: "Sint-Marcoenkerk Dorst",
  origin: ORIGIN, xAxis: X_AXIS, groundHeight: GROUND_NAP, groundOffsetMetres: BASE,
  replacesBuildings: ["NL.IMBAG.Pand.0826100000018085"],
  description: "Pseudobasilicale kruiskerk van Jos Cuypers (1911-1912), koor op het noorden; oorsprong in de kruising, X-as van de voorgevel naar het koor.",
  realWorld: { groundNapM: GROUND_NAP, ahn5NaveRidgeNapM: 19.8, ahn5TowerNapM: 37.88, naveRidgeM: 13.4, transeptRidgeM: 11.8, choirRidgeM: 12.4, towerCorniceM: 16.0 },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Marculphuskerk",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/520024",
    "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0826100000018085",
    "https://commons.wikimedia.org/wiki/Category:Sint-Marculphuskerk",
    "https://www.ahn.nl/dataroom",
  ],
};

function toStl(solid, label, mmPerMetre) {
  const m = solid.getMesh(), v = m.vertProperties, tri = m.triVerts, s = m.numProp, n = tri.length / 3, b = Buffer.alloc(84 + n * 50);
  b.write(label.slice(0, 79), 0, 80, "ascii"); b.writeUInt32LE(n, 80); let o = 84;
  for (let t = 0; t < n; t++) {
    const p = [0, 1, 2].map(k => { const i = tri[t * 3 + k] * s; return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre]; });
    const a = p[1].map((c, i) => c - p[0][i]), d = p[2].map((c, i) => c - p[0][i]);
    const q = [a[1] * d[2] - a[2] * d[1], a[2] * d[0] - a[0] * d[2], a[0] * d[1] - a[1] * d[0]], l = Math.hypot(...q) || 1;
    for (const c of [...q.map(x => x / l), ...p[0], ...p[1], ...p[2]]) { b.writeFloatLE(c, o); o += 4; }
    b.writeUInt16LE(0, o); o += 2;
  }
  return b;
}
function toGlb(named) {
  const chunks = [], views = [], acc = [], meshes = [], nodes = []; let length = 0;
  const push = (a, target) => { const b = Buffer.from(a.buffer, a.byteOffset, a.byteLength), p = Buffer.concat([b, Buffer.alloc((4 - b.length % 4) % 4)]); views.push({ buffer: 0, byteOffset: length, byteLength: b.length, target }); chunks.push(p); length += p.length; return views.length - 1; };
  for (const [name, solid] of named) {
    const m = solid.calculateNormals(0, 40).getMesh(), s = m.numProp, n = m.vertProperties.length / s;
    const pos = new Float32Array(n * 3), norm = new Float32Array(n * 3), min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < n; i++) {
      const v = m.vertProperties, p = [v[i * s], v[i * s + 2], -v[i * s + 1]], q = s >= 6 ? [v[i * s + 3], v[i * s + 5], -v[i * s + 4]] : [0, 1, 0];
      for (let j = 0; j < 3; j++) { pos[i * 3 + j] = p[j]; norm[i * 3 + j] = q[j]; min[j] = Math.min(min[j], p[j]); max[j] = Math.max(max[j], p[j]); }
    }
    const pi = push(pos, 34962), ni = push(norm, 34962), ii = push(Uint32Array.from(m.triVerts), 34963), a = acc.length;
    acc.push({ bufferView: pi, componentType: 5126, count: n, type: "VEC3", min, max }, { bufferView: ni, componentType: 5126, count: n, type: "VEC3" }, { bufferView: ii, componentType: 5125, count: m.triVerts.length, type: "SCALAR" });
    meshes.push({ name, primitives: [{ attributes: { POSITION: a, NORMAL: a + 1 }, indices: a + 2, mode: 4 }] });
    nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(JSON.stringify({ asset: { version: "2.0", generator: `NederPrint generate-${slug}.mjs` }, scene: 0, scenes: [{ nodes: nodes.map((_, i) => i) }], nodes, meshes, buffers: [{ byteLength: length }], bufferViews: views, accessors: acc }));
  const jp = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]), bin = Buffer.concat(chunks), h = Buffer.alloc(12);
  h.writeUInt32LE(0x46546c67, 0); h.writeUInt32LE(2, 4); h.writeUInt32LE(12 + 8 + jp.length + 8 + bin.length, 8);
  const ch = (len, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(len, 0); b.writeUInt32LE(type, 4); return b; };
  return Buffer.concat([h, ch(jp.length, 0x4e4f534a), jp, ch(bin.length, 0x004e4942), bin]);
}

if (church.status() !== "NoError") throw new Error(church.status());
if (Math.abs(bb0.min[2] - BASE) > 1e-5) throw new Error("modelvoet is niet vlak");
const pieces = church.decompose();
console.log(JSON.stringify({ slug, status: church.status(), genus: church.genus(), components: pieces.length, triangles: church.numTri(), volume: +church.volume().toFixed(1), bounds: { min: bb0.min, max: bb0.max }, size: bb0.max.map((v, i) => +(v - bb0.min[i]).toFixed(2)) }, null, 2));
if (pieces.length !== 1) throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir, { recursive: true });
const glb = `${slug}.glb`;
await writeFile(path.join(outDir, glb), toGlb(parts));
const printSolid = church.translate([0, 0, -BASE]);
for (const scale of [100, 1000]) await writeFile(path.join(outDir, `${slug}-1-${scale}.stl`), toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`, 1000 / scale));
await writeFile(path.join(outDir, `${slug}.json`), JSON.stringify({ ...META, file: glb, unitsPerMetre: 1, className: "building", crs: "EPSG:28992", printFiles: [`${slug}-1-100.stl`, `${slug}-1-1000.stl`], realWorld: { ...META.realWorld, highestPointM: +bb0.max[2].toFixed(2) } }, null, 2) + "\n");

// Grote of Sint-Laurenskerk, Weesp: laatgotische basilicale kerk (1429-1462) met een romaanse
// westtoren, achtkante leien spits, open klokkenlantaarn en kroon; driezijdig gesloten koor op de
// hoogte van de middenbeuk, dakruiter, traptorens en de aanbouwen aan de zuidzijde.
//
// Gebouwstelsel: x langs de hoofdas naar het oosten (koor), y naar het noorden, z omhoog, z = 0 op
// NAP +1,0 m. Maten uit de BAG-contour (pand 0457100000054845), dakhellingen uit de 3D BAG LoD2.2
// en nokken/goten gecontroleerd in het AHN4-DSM; de torenomhullende komt uit het AHN-DSM.
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2), flag = (n, f) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : f; };
const scale = Number(flag('--scale', '1000')), slug = 'laurenskerk-weesp';
const outDir = path.join(path.resolve(flag('--out', path.join(import.meta.dirname, '../models'))), slug), mmPerMetre = 1000 / scale;
const wasm = await Module(); wasm.setup(); const { Manifold, CrossSection } = wasm;

const BASE = -0.5;
const ORIGIN = [131499.37, 479985.42];   // hart van het schip op de as, RD
const X_AXIS = [0.96727, 0.25376];       // hoofdas 75,3 graden (nokken en BAG-gevels)
const NAP0 = 1.0;                        // z = 0 ligt op NAP +1,0 m
const GROUND_POINTS = [[-33, 0], [0, 13.5], [-5, -18.5], [36, 0], [22, -12.5], [22, 10.5]];

// ---------- hoofdmaten (m, z t.o.v. NAP +1,0) ----------
const HALF = 5.7;                        // halve breedte middenbeuk en koor (goot tot goot)
const NAVE_EAVE = 18.35, NAVE_SLOPE = 1.52;   // goot NAP +19,35, helling 56,7 graden -> nok 27,0
const AISLE_TOP = 14.85, AISLE_SLOPE = 1.0;   // lessenaarsdak zijbeuken, 45 graden
const WEST = -25.62, CHOIR_SIDE_END = 30.0, APSE_EAST = 33.75, APSE_HALF = 1.8;
const AISLE_N = 11.1, AISLE_S = -11.05, AISLE_EAST = 14.2;
const TOWER = { x0: -31.12, x1: -25.12, y0: -2.8, y1: 3.2, top: 24.2 };
const TC = [(TOWER.x0 + TOWER.x1) / 2, (TOWER.y0 + TOWER.y1) / 2];

// ---------- hulpfuncties ----------
const prism = (p, z0, z1) => { const a = p.reduce((s, q, i) => s + q[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * q[1], 0); return Manifold.extrude(new CrossSection([a < 0 ? [...p].reverse() : p]), z1 - z0).translate([0, 0, z0]); };
const rect = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const box = (x0, x1, y0, y1, z0, z1) => prism(rect(x0, x1, y0, y1), z0, z1);
// Dakvlak als planvergelijking: houd z <= a x + b y + c.
const plane = (s, a, b, c) => { const n = Math.hypot(a, b, 1); return s.trimByPlane([a / n, b / n, -1 / n], -c / n); };
// Schild- of zadeldak over een convexe veelhoek: elk dakvlak loopt vanaf de goot op de rand met
// dezelfde helling naar binnen; randen in `gables` krijgen een verticale topgevel.
const hipped = (poly, eave, slope, gables = []) => {
  const ccw = poly.reduce((s, q, i) => s + q[0] * poly[(i + 1) % poly.length][1] - poly[(i + 1) % poly.length][0] * q[1], 0) > 0;
  let s = prism(poly, BASE, eave + 40);
  poly.forEach((a, i) => {
    if (gables.includes(i)) return;
    const b = poly[(i + 1) % poly.length], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy);
    const n = ccw ? [-dy / l, dx / l] : [dy / l, -dx / l];
    s = plane(s, slope * n[0], slope * n[1], eave - slope * (n[0] * a[0] + n[1] * a[1]));
  });
  return s;
};
const octagon = (cx, cy, flats, z) => Array.from({ length: 8 }, (_, i) => { const r = flats / 2 / Math.cos(Math.PI / 8), a = Math.PI / 8 + i * Math.PI / 4; return [cx + r * Math.cos(a), cy + r * Math.sin(a), z]; });
const square = (x0, x1, y0, y1, z) => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]];
const hull = pts => Manifold.hull(pts);
// Plaats een vorm die in het canonieke stelsel naar -y wijst op een gevel met buitennormaal phi.
const place = (m, cx, cy, phi) => m.rotate([0, 0, phi + 90]).translate([cx, cy, 0]);
// Blinde nis: spitse (>= 50 graden) of rechte bovenkant; het plafond loopt onder 45 graden naar binnen.
const niche = (w, z0, z1, cx, cy, phi, { depth = 0.35, pointed = true } = {}) => {
  const prof = dz => pointed
    ? [[-w / 2, z0], [w / 2, z0], [w / 2, z1 - w * 0.6 - dz], [0, z1 - dz], [-w / 2, z1 - w * 0.6 - dz]]
    : [[-w / 2, z0], [w / 2, z0], [w / 2, z1 - dz], [-w / 2, z1 - dz]];
  const slab = (dz, y0, y1) => prof(dz).flatMap(([x, z]) => [[x, y0, z], [x, y1, z]]);
  return place(hull([...slab(0, -2, 0), ...slab(depth, depth - 0.01, depth)]), cx, cy, phi);
};
// Steunbeer: blok buiten de gevel met een afzaat van 45 graden tegen de muur.
const buttress = (cx, cy, phi, w, d, h, inside = 0.4) => place(hull([
  ...square(-w / 2, w / 2, -d, inside, BASE),
  [-w / 2, -d, h], [w / 2, -d, h], [-w / 2, inside, h + d + inside], [w / 2, inside, h + d + inside],
]), cx, cy, phi);

const solids = [];
const holes = [];

// ---------- schip en koor ----------
// Middenbeuk en koor onder één doorlopend dak; het koor sluit driezijdig (3/8) met dezelfde
// helling als de schilden in de 3D BAG (58 graden). De westgevel is een rechte topgevel.
const naveChoir = [[WEST, -HALF], [CHOIR_SIDE_END, -HALF], [APSE_EAST, -APSE_HALF], [APSE_EAST, APSE_HALF], [CHOIR_SIDE_END, HALF], [WEST, HALF]];
solids.push(hipped(naveChoir, NAVE_EAVE, NAVE_SLOPE, [5]));

// Zijbeuken met lessenaarsdak van 45 graden tegen de lichtbeuk (knik op NAP +15,85).
solids.push(plane(box(-25.69, AISLE_EAST, AISLE_S, -HALF + 0.1, BASE, 30), 0, AISLE_SLOPE, AISLE_TOP + AISLE_SLOPE * HALF));
solids.push(plane(box(-25.6, 14.15, HALF - 0.1, AISLE_N, BASE, 30), 0, -AISLE_SLOPE, AISLE_TOP + AISLE_SLOPE * HALF));

// ---------- westtoren ----------
solids.push(box(TOWER.x0, TOWER.x1, TOWER.y0, TOWER.y1, BASE, TOWER.top));
// Achtkante leien spits op een vierkante voet (rok), uit de AHN-omhullende en de noordfoto.
const [tx, ty] = TC;
solids.push(hull([...square(TOWER.x0, TOWER.x1, TOWER.y0, TOWER.y1, TOWER.top - 0.05), ...octagon(tx, ty, 4.6, 25.6)]));
solids.push(hull([...octagon(tx, ty, 4.6, 25.55), ...octagon(tx, ty, 2.9, 35.0)]));
// Open klokkenlantaarn (achtkant), kroonlijst onder 45 graden, ingesnoerde kap en kroon.
solids.push(hull([...octagon(tx, ty, 2.6, 34.95), ...octagon(tx, ty, 2.6, 38.0)]));
solids.push(hull([...octagon(tx, ty, 2.6, 37.95), ...octagon(tx, ty, 3.0, 38.15), ...octagon(tx, ty, 3.0, 38.35)]));
solids.push(hull([...octagon(tx, ty, 3.0, 38.3), ...octagon(tx, ty, 1.3, 39.8)]));
solids.push(hull([...octagon(tx, ty, 1.3, 39.75), ...octagon(tx, ty, 2.0, 40.55)]));
solids.push(hull([...octagon(tx, ty, 2.0, 40.5), ...octagon(tx, ty, 0.9, 41.0)]));
// Uurwerkkasten op de vier schuine spitsvlakken en dakvensters op de hoofdvlakken.
const clockBox = hull([...square(-0.65, 0.65, -2.75, -1.2, 25.2), ...square(-0.65, 0.65, -2.75, -1.2, 26.7), [0, -2.75, 27.3], [0, -1.2, 27.3]]);
for (const phi of [45, 135, 225, 315]) solids.push(place(clockBox, tx, ty, phi));
const dormer = hull([...square(-0.45, 0.45, -2.25, -1.0, 29.0), ...square(-0.45, 0.45, -2.25, -1.0, 29.9), [0, -2.25, 30.4], [0, -1.0, 30.4]]);
for (const phi of [0, 90, 180, 270]) solids.push(place(dormer, tx, ty, phi));
// Traptoren aan de noordzijde van de toren met een tentdak (BAG-uitsprong, foto noordwest).
solids.push(box(-27.53, -25.5, 3.17, 4.93, BASE, 8.6));
solids.push(hull([...square(-27.53, -25.5, 3.17, 4.93, 8.55), [-26.5, 4.05, 10.2]]));

// ---------- dakruiter op de nok, een kwart van het oosteinde ----------
const DR = [14.9, 0];
solids.push(hull([...octagon(DR[0], DR[1], 1.8, 25.0), ...octagon(DR[0], DR[1], 1.8, 28.2)]));
solids.push(hull([...octagon(DR[0], DR[1], 1.8, 28.15), ...octagon(DR[0], DR[1], 2.1, 28.3), ...octagon(DR[0], DR[1], 2.1, 28.45)]));
solids.push(hull([...octagon(DR[0], DR[1], 2.1, 28.4), ...octagon(DR[0], DR[1], 1.7, 29.3), ...octagon(DR[0], DR[1], 0.9, 29.9)]));

// ---------- traptoren zuidoost (aansluiting zijbeuk en koor) ----------
solids.push(hull([...octagon(15.6, -6.15, 2.2, BASE), ...octagon(15.6, -6.15, 2.2, 20.3)]));
solids.push(hull([...octagon(15.6, -6.15, 2.2, 20.25), ...octagon(15.6, -6.15, 0.9, 21.9)]));

// ---------- steunberen ----------
// Zijbeuken: BAG-contour, 0,9 m breed en diep, afzaat onder de goot.
for (const [x, w] of [[-25.05, 1.0], [-20.19, 0.95], [-15.29, 0.9], [-10.3, 0.94], [-5.64, 0.95], [-0.75, 0.9], [4.15, 0.9], [8.99, 0.9], [13.82, 0.9]]) solids.push(buttress(x, AISLE_N, 90, w, 0.92, 7.6));
for (const [x, w] of [[-25.23, 0.9], [-20.37, 0.9], [-15.32, 0.9], [3.93, 1.05]]) solids.push(buttress(x, AISLE_S, -90, w, 0.86, 7.6));
// Westgevel.
for (const [y, w, d] of [[10.71, 0.92, 0.87], [5.41, 0.92, 0.81], [-5.14, 0.98, 0.8], [-10.66, 0.9, 0.85]]) solids.push(buttress(WEST, y, 180, w, d, 9.0));
// Koor: hoge steunberen tussen de traveeën en op de hoeken van de sluiting.
for (const x of [19.6, 25.68]) { solids.push(buttress(x, HALF, 90, 1.25, 1.8, 15.6)); solids.push(buttress(x, -HALF, -90, 1.25, 1.8, 15.6)); }
for (const [x, y, phi] of [[CHOIR_SIDE_END, -HALF, -62], [CHOIR_SIDE_END, HALF, 62], [APSE_EAST, -APSE_HALF, -25], [APSE_EAST, APSE_HALF, 25]]) solids.push(buttress(x, y, phi, 1.2, 1.6, 15.6, 0.8));

// ---------- aanbouwen ----------
// Noordzijde: lage aanbouw met lessenaarsdak tegen het koor (3D BAG: NAP +5,1 tot +7,7).
solids.push(plane(prism([[14.15, HALF - 0.1], [20.45, HALF - 0.1], [20.45, 7.72], [18.32, 7.72], [18.32, 9.8], [14.15, 9.8]], BASE, 20), 0, -0.65, 6.7 + 0.65 * HALF));
// Zuidwest: huis van twee lagen met de nok haaks op de kerk en een topgevel aan de straat.
let gableHouse = box(-11.0, -5.0, -16.87, AISLE_S + 0.1, BASE, 20);
gableHouse = plane(plane(gableHouse, -1.27, 0, 9.25 - 1.27 * 8.0), 1.27, 0, 9.25 + 1.27 * -8.0 * -1);
solids.push(gableHouse, box(-8.45, -7.55, -16.87, -16.0, BASE, 10.4));
// Kosterswoning met schilddak en een dakkapel aan de straat (3D BAG: goot NAP +4,6/+5,2, nok +8,2).
solids.push(hipped(rect(-5.05, 1.5, -16.8, AISLE_S + 0.1), 3.9, 1.16, [3]));
let dormerK = box(-2.8, -1.2, -15.7, -13.2, 3.0, 8);
dormerK = plane(plane(dormerK, -0.9, 0, 6.7 - 0.9 * 2.0), 0.9, 0, 6.7 + 0.9 * 2.0);
solids.push(dormerK);
// Ronde lage aanbouw met plat dak tussen de steunberen (BAG-contour, 3D BAG plat NAP +4,5).
solids.push(prism([[8.38, AISLE_S + 0.1], [8.35, -11.94], [8.79, -11.95], [8.74, -14.72], [9.58, -14.92], [10.54, -15.05], [11.59, -15.08], [12.69, -14.89], [13.76, -14.59], [13.78, -11.9], [14.2, -11.91], [14.2, AISLE_S + 0.1]], BASE, 3.5));
// Zuidoost: lage vleugel met schilddak voor het koor (AHN: nok circa NAP +10,3).
solids.push(hipped(rect(14.1, 26.1, AISLE_S, -HALF + 0.1), 7.0, 0.85, [3]));
solids.push(box(26.0, 28.2, -7.7, -HALF + 0.1, BASE, 4.5));

let church = Manifold.union(solids);

// ---------- gevelreliëf (blinde nissen) ----------
const bays = [-22.6, -17.75, -12.8, -7.95, -3.15, 1.7, 6.55, 11.4];
for (const x of bays) {
  holes.push(niche(1.3, 15.3, 17.9, x, HALF, 90), niche(1.3, 15.3, 17.9, x, -HALF, -90)); // lichtbeuk
  holes.push(niche(1.8, 2.4, 8.0, x, AISLE_N, 90));                                       // noordbeuk
}
for (const [x, z0] of [[-22.6, 2.4], [-17.75, 2.4], [-12.8, 2.4], [-3.15, 4.6], [1.7, 4.6], [6.55, 2.4], [11.4, 4.4]]) holes.push(niche(1.8, z0, 8.0, x, AISLE_S, -90));
for (const y of [-8.4, 8.4]) holes.push(niche(2.2, 2.2, 10.0, WEST, y, 180));                   // westvensters zijbeuken
for (const [x, zN, zS] of [[16.9, 7.4, 9.6], [22.65, 6.5, 9.6], [27.9, 6.5, 8.0]]) holes.push(niche(2.2, zN, 16.4, x, HALF, 90), niche(2.2, zS, 16.4, x, -HALF, -90));
holes.push(niche(2.0, 4.0, 16.4, APSE_EAST, 0, 0));
holes.push(niche(2.0, 4.0, 16.4, (CHOIR_SIDE_END + APSE_EAST) / 2, -(HALF + APSE_HALF) / 2, -43.9), niche(2.0, 4.0, 16.4, (CHOIR_SIDE_END + APSE_EAST) / 2, (HALF + APSE_HALF) / 2, 43.9));
// Toren: verdiepingen met verdiepte velden tussen hoeklisenen (de boogfriezen), deur en galmgaten.
const towerFaces = [[TOWER.x0, ty, 180, 6.0], [tx, TOWER.y1, 90, 6.0], [tx, TOWER.y0, -90, 6.0]];
for (const [cx, cy, phi, w] of towerFaces) {
  for (const [z0, z1] of [[1.0, 5.6], [6.4, 11.6], [12.6, 18.4], [19.4, 23.6]]) holes.push(niche(w - 1.8, z0, z1, cx, cy, phi, { depth: 0.25, pointed: false }));
  holes.push(niche(1.5, 19.8, 22.9, cx, cy, phi, { depth: 0.6 }), niche(1.1, 13.6, 16.9, cx, cy, phi, { depth: 0.5 }));
}
holes.push(niche(1.9, 0.0, 3.7, TOWER.x0, ty, 180, { depth: 0.6 }));
for (let k = 0; k < 8; k++) { const phi = k * 45, r = 1.3; holes.push(niche(0.6, 35.4, 37.6, tx + r * Math.cos(phi * Math.PI / 180), ty + r * Math.sin(phi * Math.PI / 180), phi, { depth: 0.3 })); }
for (let k = 0; k < 4; k++) { const phi = k * 90, r = 0.9; holes.push(niche(0.6, 26.9, 28.0, DR[0] + r * Math.cos(phi * Math.PI / 180), DR[1] + r * Math.sin(phi * Math.PI / 180), phi, { depth: 0.25 })); }
// Aanbouwen: vensters, deuren en de drie kleine vensters van de zuidoostvleugel.
holes.push(niche(1.2, 0.9, 2.9, -3.6, -16.8, -90, { pointed: false }), niche(1.2, 0.9, 2.9, -1.6, -16.8, -90, { pointed: false }), niche(1.0, 0.0, 2.6, 0.4, -16.8, -90, { pointed: false }));
holes.push(niche(0.8, 4.4, 5.6, -2.0, -15.7, -90, { pointed: false, depth: 0.25 }));
holes.push(niche(1.0, 1.0, 3.0, -8.0, -16.87, -90, { pointed: false }), niche(1.0, 4.6, 6.8, -8.0, -16.87, -90, { pointed: false }));
for (const x of [17.6, 19.2, 20.8]) holes.push(niche(0.9, 5.2, 6.4, x, AISLE_S, -90, { depth: 0.3 }));
holes.push(niche(1.6, 1.0, 3.6, 19.2, AISLE_S, -90, { pointed: false }));
church = church.subtract(Manifold.union(holes));

const parts = [['building:kerk', church]];
const META = {
  name: 'Grote of Sint-Laurenskerk Weesp', origin: ORIGIN, xAxis: X_AXIS, groundOffsetMetres: -0.3,
  // Maaiveld rondom de kerk (2 tot 7 m buiten de gevels), zodat een lage hoek van de omhullende
  // het model niet laat zakken; groundHeight is de laagste PDOK-terreinhoogte op die punten
  // (ellipsoïdisch, zoals de export bemonstert; NAP +0,9 m aan de westzijde).
  groundSamplePoints: GROUND_POINTS, groundHeight: 44.0,
  replacesBuildings: ['NL.IMBAG.Pand.0457100000054845'],
  description: 'Oorsprong op de as van het schip, X naar het koor (oost, 75,3 graden), z = 0 op NAP +1,0 m; basilicaal schip met doorlopend dak over het driezijdig gesloten koor, westtoren met achtkante spits, lantaarn en kroon, dakruiter, traptorens en de aanbouwen aan de zuidzijde.',
  realWorld: { groundNapM: NAP0, naveEaveNapM: NAVE_EAVE + NAP0, naveRidgeNapM: +(NAVE_EAVE + NAVE_SLOPE * HALF + NAP0).toFixed(2), aisleEaveNapM: +(AISLE_TOP - AISLE_SLOPE * (AISLE_N - HALF) + NAP0).toFixed(2), towerTopNapM: TOWER.top + NAP0, crownTopNapM: 41.0 + NAP0, ahnTowerMaxNapM: 41.7, lengthM: 64.9, widthM: 22.2 },
  sources: [
    'https://service.pdok.nl/lv/bag/wfs/v2_0 (pand 0457100000054845)',
    'https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0457100000054845',
    'https://service.pdok.nl/rws/ahn/wcs/v1_0 (dsm_05m)',
    'https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (Actueel_orthoHR)',
    'https://monumentenregister.cultureelerfgoed.nl/monumenten/38550',
    'https://nl.wikipedia.org/wiki/Grote_of_Laurenskerk_(Weesp)',
    'https://commons.wikimedia.org/wiki/Category:Grote_of_Laurenskerk_(Weesp)',
  ],
};

function toStl(solid, label) {
  const m = solid.getMesh(), v = m.vertProperties, tri = m.triVerts, s = m.numProp, n = tri.length / 3, b = Buffer.alloc(84 + n * 50); b.write(label.slice(0, 79), 0, 80, 'ascii'); b.writeUInt32LE(n, 80); let o = 84;
  for (let t = 0; t < n; t++) { const p = [0, 1, 2].map(k => { const i = tri[t * 3 + k] * s; return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre]; }); const a = p[1].map((c, i) => c - p[0][i]), d = p[2].map((c, i) => c - p[0][i]), q = [a[1] * d[2] - a[2] * d[1], a[2] * d[0] - a[0] * d[2], a[0] * d[1] - a[1] * d[0]], l = Math.hypot(...q) || 1; for (const c of [...q.map(x => x / l), ...p[0], ...p[1], ...p[2]]) { b.writeFloatLE(c, o); o += 4; } b.writeUInt16LE(0, o); o += 2; }
  return { buffer: b, triangles: n };
}
function toGlb(named) {
  const chunks = [], views = [], acc = [], meshes = [], nodes = []; let length = 0;
  const push = (a, target) => { const b = Buffer.from(a.buffer, a.byteOffset, a.byteLength), p = Buffer.concat([b, Buffer.alloc((4 - b.length % 4) % 4)]); views.push({ buffer: 0, byteOffset: length, byteLength: b.length, target }); chunks.push(p); length += p.length; return views.length - 1; };
  for (const [name, solid] of named) { const m = solid.calculateNormals(0, 40).getMesh(), s = m.numProp, n = m.vertProperties.length / s, pos = new Float32Array(n * 3), norm = new Float32Array(n * 3), min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]; for (let i = 0; i < n; i++) { const v = m.vertProperties, p = [v[i * s], v[i * s + 2], -v[i * s + 1]], q = s >= 6 ? [v[i * s + 3], v[i * s + 5], -v[i * s + 4]] : [0, 1, 0]; for (let j = 0; j < 3; j++) { pos[i * 3 + j] = p[j]; norm[i * 3 + j] = q[j]; min[j] = Math.min(min[j], p[j]); max[j] = Math.max(max[j], p[j]); } } const pi = push(pos, 34962), ni = push(norm, 34962), ii = push(Uint32Array.from(m.triVerts), 34963), a = acc.length; acc.push({ bufferView: pi, componentType: 5126, count: n, type: 'VEC3', min, max }, { bufferView: ni, componentType: 5126, count: n, type: 'VEC3' }, { bufferView: ii, componentType: 5125, count: m.triVerts.length, type: 'SCALAR' }); meshes.push({ name, primitives: [{ attributes: { POSITION: a, NORMAL: a + 1 }, indices: a + 2, mode: 4 }] }); nodes.push({ name, mesh: meshes.length - 1 }); }
  const json = Buffer.from(JSON.stringify({ asset: { version: '2.0', generator: 'NederPrint generate-laurenskerk-weesp.mjs' }, scene: 0, scenes: [{ nodes: nodes.map((_, i) => i) }], nodes, meshes, buffers: [{ byteLength: length }], bufferViews: views, accessors: acc })), jp = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]), bin = Buffer.concat(chunks), h = Buffer.alloc(12); h.writeUInt32LE(0x46546c67, 0); h.writeUInt32LE(2, 4); h.writeUInt32LE(12 + 8 + jp.length + 8 + bin.length, 8); const ch = (len, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(len, 0); b.writeUInt32LE(type, 4); return b; }; return Buffer.concat([h, ch(jp.length, 0x4e4f534a), jp, ch(bin.length, 0x004e4942), bin]);
}

if (church.status() !== 'NoError') throw new Error(church.status());
const bb = church.boundingBox(); if (Math.abs(bb.min[2] - BASE) > 1e-5) throw new Error('modelvoet is niet vlak');
const pieces = church.decompose();
console.log(JSON.stringify({ slug, status: church.status(), genus: church.genus(), components: pieces.length, triangles: church.numTri(), volume: +church.volume().toFixed(1), bounds: { min: bb.min, max: bb.max }, size: bb.max.map((v, i) => +(v - bb.min[i]).toFixed(2)) }, null, 2));
if (pieces.length !== 1) throw new Error(`expected one connected component, got ${pieces.length}`);
await mkdir(outDir, { recursive: true });
const glb = `${slug}.glb`, stl = `${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir, glb), toGlb(parts));
const stlResult = toStl(church.translate([0, 0, -BASE]), `NederPrint ${META.name} 1:${scale} mm Z-up`); await writeFile(path.join(outDir, stl), stlResult.buffer);
await writeFile(path.join(outDir, `${slug}.json`), JSON.stringify({ ...META, file: glb, unitsPerMetre: 1, className: 'building', crs: 'EPSG:28992', printFiles: [stl], realWorld: { ...META.realWorld, highestPointM: +bb.max[2].toFixed(2) } }, null, 2));
console.log('geschreven', outDir, stl, stlResult.triangles);

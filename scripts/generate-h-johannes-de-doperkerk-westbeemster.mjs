// H. Johannes de Doperkerk (Westbeemster): neogotische kruisbasiliek van H. Bijvoets (1878-1879)
// met gedrukte lichtbeuk, driezijdig gesloten koor, dakruiter op de viering en een voortoren
// met vier frontalen en een achtkante naaldspits.
// Bouwstelsel: u langs de as (+u = oost, naar de toren aan de Jisperweg), v 90 graden linksom
// (+v = noordnoordoost), z omhoog vanaf het maaiveld (NAP -3,13 m). Het bouwstelsel is meteen
// het modelstelsel; xAxis legt de draaiing van -20,4 graden in RD vast.
// Maten: BAG-contour (pand 0370100000002738), 3D BAG LoD2.2-dakvlakken (helling 56,7 graden
// schip/koor/transept, 32 graden zijbeuken), AHN4-DSM als controle voor nok, goten en de
// torenomhullende (hoogste punt spits NAP +52,83 m), opstand van RCE-foto's (Wikimedia Commons).
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2), flag = (n, f) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : f; };
const scale = Number(flag('--scale', '1000')), slug = 'h-johannes-de-doperkerk-westbeemster';
const outDir = path.join(path.resolve(flag('--out', path.join(import.meta.dirname, '../models'))), slug), mmPerMetre = 1000 / scale;
const wasm = await Module(); wasm.setup(); const { Manifold, CrossSection } = wasm;

const BASE = -0.5, ORIGIN = [121909.24, 509860.66], X_AXIS = [0.93728, -0.34857], GROUND_NAP = -3.13;
// Maaiveld op eigen punten 1 tot 2 m buiten de gevels: de hoeken van de bbox vallen in de sloot
// langs de Jisperweg en lieten het model 1,8 m zakken. groundHeight is de laagste PDOK-terreinhoogte
// op die punten, ellipsoïdisch zoals de export bemonstert (NAP -3,13 m = circa 39,7 m).
const GROUND_SAMPLES = [[-23.2, 0], [-26.6, -4.5], [-18, -11.6], [-17, 9.2], [-6.9, 10.9], [5, 9.8], [5, -9.8], [-6.9, -10.9], [18, -12.9], [28.6, 0], [27.8, -4.6], [23.2, 6.2]], GROUND_ELLIPSOIDAL = 39.68;
// Hoofdmaten (m boven maaiveld)
const NAVE_HALF = 4.75, NAVE_EAVE = 13.0, RIDGE = 20.2;          // schip, koor en transept: 56,7 graden
const AISLE_WALL = 8.4, AISLE_EAVE = 8.4, AISLE_TOP = 10.6;       // zijbeuken: lessenaarsdak tegen de lichtbeuk
const APSE_C = -16.9;                                              // middelpunt van de achtkante koorsluiting
const TRANS_U0 = -11.6, TRANS_U1 = -2.2, TRANS_C = -6.9;           // transept
const AISLE_U0 = -15.0, AISLE_U1 = 20.5;
const TW_U0 = 20.9, TW_U1 = 27.1, TW_C = 24.0, TW_HALF = 3.1;      // toren
const SHAFT_TOP = 19.6, BELFRY_TOP = 29.3, GABLE_TOP = 34.8, SPIRE_TOP = 55.9;

const prism = (p, z0, z1) => { const a = p.reduce((s, q, i) => s + q[0] * p[(i + 1) % p.length][1] - p[(i + 1) % p.length][0] * q[1], 0); return Manifold.extrude(new CrossSection([a < 0 ? [...p].reverse() : p]), z1 - z0).translate([0, 0, z0]); };
const box = (a, b, c, d, z0, z1) => prism([[a, c], [b, c], [b, d], [a, d]], z0, z1);
const plane = (s, a, b, c) => { const n = Math.hypot(a, b, 1); return s.trimByPlane([a / n, b / n, -1 / n], -c / n); }; // houdt z <= a u + b v + c
// Zadeldak met nok langs u (helling in v) en met nok langs v (helling in u).
const gableU = (a, b, c, d, eave, ridge) => { const k = (ridge - eave) / ((d - c) / 2), m = (c + d) / 2; return plane(plane(box(a, b, c, d, eave - 0.1, ridge), 0, k, ridge - k * m), 0, -k, ridge + k * m); };
const gableV = (a, b, c, d, eave, ridge) => { const k = (ridge - eave) / ((b - a) / 2), m = (a + b) / 2; return plane(plane(box(a, b, c, d, eave - 0.1, ridge), k, 0, ridge - k * m), -k, 0, ridge + k * m); };
const hull = pts => Manifold.hull(pts);
const ring = (x, y, flats, z, n = 8, rot = Math.PI / n) => { const r = flats / 2 / Math.cos(Math.PI / n); return Array.from({ length: n }, (_, i) => { const a = rot + i * 2 * Math.PI / n; return [x + r * Math.cos(a), y + r * Math.sin(a), z]; }); };
// Blinde spitsboognis in een wand met buitennormaal (nx, ny); top steiler dan 50 graden.
const niche = (cx, cy, nx, ny, z0, w, h, d = 0.35) => {
  const p = [[-w / 2, 0], [w / 2, 0], [w / 2, h - w * 0.62], [0, h], [-w / 2, h - w * 0.62]];
  const theta = Math.atan2(-nx, ny) * 180 / Math.PI;
  return Manifold.extrude(new CrossSection([p]), 2 * d).translate([0, 0, -d]).rotate([90, 0, 0]).rotate([0, 0, theta]).translate([cx, cy, z0]);
};
// Steunbeer haaks op een wand: voet (cx, cy), richting (nx, ny), uitsprong len, met afgeschuinde top.
const buttress = (cx, cy, nx, ny, len, w, h) => {
  const tx = -ny, ty = nx, P = (s, t, z) => [cx + nx * s + tx * t, cy + ny * s + ty * t, z];
  const pts = [];
  for (const t of [-w / 2, w / 2]) pts.push(P(-0.3, t, BASE), P(len, t, BASE), P(len, t, h - len), P(-0.3, t, h + 0.3));
  return hull(pts);
};

const solids = [], cuts = [];

// --- Schip en koor: één zadeldak van de koorsluiting tot de toren.
solids.push(box(APSE_C, TW_U0 + 0.4, -NAVE_HALF, NAVE_HALF, BASE, NAVE_EAVE), gableU(APSE_C, TW_U0 + 0.4, -NAVE_HALF, NAVE_HALF, NAVE_EAVE, RIDGE));
// Koorsluiting: drie zijden van een achthoek, met schilddakvlakken tot de nok.
const apse = (() => { const s = 2 * NAVE_HALF * Math.tan(Math.PI / 8) / 2; return [[APSE_C + 0.1, NAVE_HALF], [APSE_C - s, NAVE_HALF], [APSE_C - NAVE_HALF, s], [APSE_C - NAVE_HALF, -s], [APSE_C - s, -NAVE_HALF], [APSE_C + 0.1, -NAVE_HALF]]; })();
solids.push(prism(apse, BASE, NAVE_EAVE), hull([...apse.map(([u, v]) => [u, v, NAVE_EAVE - 0.1]), [APSE_C, 0, RIDGE], [APSE_C + 0.1, 0, RIDGE]]));
// Koorsteunberen op de hoeken van de sluiting en een venster per zijde.
for (const a of [112.5, 157.5, 202.5, 247.5]) { const r = NAVE_HALF / Math.cos(Math.PI / 8), c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); solids.push(buttress(APSE_C + r * c, r * s, c, s, 1.0, 0.9, 10.5)); }
for (const a of [135, 180, 225]) { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); cuts.push(niche(APSE_C + NAVE_HALF * c, NAVE_HALF * s, c, s, 4.0, 1.6, 7.0)); }

// --- Zijbeuken met lessenaarsdak tegen de gedrukte lichtbeuk.
const aisleK = (AISLE_TOP - AISLE_EAVE) / (AISLE_WALL - NAVE_HALF);
for (const sgn of [1, -1]) {
  const blk = box(AISLE_U0, AISLE_U1, sgn > 0 ? NAVE_HALF - 0.2 : -AISLE_WALL, sgn > 0 ? AISLE_WALL : -NAVE_HALF + 0.2, BASE, AISLE_TOP + 0.2);
  solids.push(plane(blk, 0, -sgn * aisleK, AISLE_EAVE + aisleK * AISLE_WALL));
}
// Steunberen tussen de traveeën (BAG-contour), aan de zuidkant vervangen door de doopkapel bij de toren.
const BUTTRESS_U = [-15.0, -10.4, -2.8, 2.0, 6.6, 11.0, 15.6, 20.2];
for (const u of BUTTRESS_U) for (const sgn of [1, -1]) { if (sgn < 0 && u > 15) continue; solids.push(buttress(u, sgn * AISLE_WALL, 0, sgn, 1.0, 0.9, 7.8)); }
// Zijbeukvensters en kleine bovenvensters van de lichtbeuk.
const BAY_U = [-13.2, -0.4, 4.3, 8.8, 13.3, 17.9];
for (const u of BAY_U) for (const sgn of [1, -1]) {
  if (!(sgn < 0 && u > 15)) cuts.push(niche(u, sgn * AISLE_WALL, 0, sgn, 2.6, 1.6, 3.8));
  cuts.push(niche(u, sgn * NAVE_HALF, 0, sgn, AISLE_TOP + 0.35, 1.6, 1.75));
}
// Dakkapellen op schip en zijbeuken (zuidfoto RCE 20253759).
for (const u of [0.7, 10.8]) for (const sgn of [1, -1]) {
  const v0 = sgn * 1.6, v1 = sgn * 4.1;
  solids.push(box(u - 0.6, u + 0.6, Math.min(v0, v1), Math.max(v0, v1), 12.5, 15.9), gableV(u - 0.6, u + 0.6, Math.min(v0, v1), Math.max(v0, v1), 15.9, 16.7));
}
for (const u of [6.3, 17.1]) for (const sgn of [1, -1]) {
  if (sgn < 0 && u > 15) continue;
  const v0 = sgn * 5.2, v1 = sgn * 7.0;
  solids.push(box(u - 0.5, u + 0.5, Math.min(v0, v1), Math.max(v0, v1), 8.6, 10.4), gableV(u - 0.5, u + 0.5, Math.min(v0, v1), Math.max(v0, v1), 10.4, 11.0));
}

// --- Transept: zelfde goot en nok als het schip, topgevels gelijk met de zijbeukmuren.
solids.push(box(TRANS_U0, TRANS_U1, -AISLE_WALL, AISLE_WALL, BASE, NAVE_EAVE), gableV(TRANS_U0, TRANS_U1, -AISLE_WALL, AISLE_WALL, NAVE_EAVE, RIDGE));
for (const sgn of [1, -1]) {
  const v0 = sgn * (AISLE_WALL - 0.3), v1 = sgn * (AISLE_WALL + 0.3);
  // Topgevel steekt 0,4 m boven het dak uit, met een kruisblok op de top.
  solids.push(gableV(TRANS_U0 - 0.2, TRANS_U1 + 0.2, Math.min(v0, v1), Math.max(v0, v1), NAVE_EAVE - 0.5, RIDGE + 0.55));
  solids.push(box(TRANS_C - 0.45, TRANS_C + 0.45, Math.min(v0, v1), Math.max(v0, v1), RIDGE, RIDGE + 1.6));
  // Portaal met topgevel tegen de transeptgevel (BAG: 3,6 m breed, 1,8 m diep).
  const p0 = sgn * (AISLE_WALL - 0.2), p1 = sgn * (AISLE_WALL + 1.8);
  solids.push(box(TRANS_C - 1.8, TRANS_C + 1.8, Math.min(p0, p1), Math.max(p0, p1), BASE, 4.0));
  solids.push(gableV(TRANS_C - 1.8, TRANS_C + 1.8, Math.min(p0, p1), Math.max(p0, p1), 4.0, 5.9));
  for (const du of [-1.8, 1.8]) solids.push(buttress(TRANS_C + du, sgn * (AISLE_WALL + 1.8), 0, sgn, 0.6, 0.8, 3.6));
  cuts.push(niche(TRANS_C, sgn * (AISLE_WALL + 1.8), 0, sgn, 0, 1.6, 3.0));
  // Groot transeptvenster boven het portaal en drie lancetten in de top.
  cuts.push(niche(TRANS_C, sgn * AISLE_WALL, 0, sgn, 6.2, 3.0, 6.6));
  for (const [du, z, h] of [[0, 15.0, 2.4], [-1.4, 14.6, 1.8], [1.4, 14.6, 1.8]]) cuts.push(niche(TRANS_C + du, sgn * AISLE_WALL, 0, sgn, z, 0.9, h));
}

// --- Dakruiter op de viering: achtkante lantaarn met naaldspits.
solids.push(prism(ring(TRANS_C, 0, 1.9, 0).map(p => [p[0], p[1]]), RIDGE - 1.5, 24.0));
solids.push(hull([...ring(TRANS_C, 0, 2.3, 23.9), ...ring(TRANS_C, 0, 2.3, 24.3), [TRANS_C, 0, 30.0]]));

// --- Doopkapel: driezijdig gesloten uitbouw aan de zuidzijbeuk naast de toren.
const chapel = [[15.6, -8.0], [15.6, -10.2], [17.4, -12.2], [18.7, -12.2], [20.5, -10.2], [20.5, -8.0]];
solids.push(prism(chapel, BASE, 8.0));
solids.push(hull([...chapel.map(([u, v]) => [u, v, 7.9]), [15.6, -5.0, 7.9], [20.5, -5.0, 7.9], [18.05, -10.0, 11.2], [18.05, -5.0, 11.2]]));
for (const [u, v, a] of [[15.6, -10.2, -135], [17.4, -12.2, -100], [18.7, -12.2, -80], [20.5, -10.2, -45]]) solids.push(buttress(u, v, Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180), 0.8, 0.8, 7.0));
cuts.push(niche(18.05, -12.2, 0, -1, 2.4, 1.0, 3.6));
for (const [u, v, a] of [[16.5, -11.2, -135], [19.6, -11.2, -45]]) cuts.push(niche(u, v, Math.cos(a * Math.PI / 180), Math.sin(a * Math.PI / 180), 2.4, 0.9, 3.4));

// --- Lage aanbouwen bij het koor (sacristie en kapellen, BAG en 3D BAG).
const sw = [-21.4, -14.6, -10.9, -NAVE_HALF + 0.2];
solids.push(box(sw[0], sw[1], sw[2], sw[3], BASE, 4.0), hull([[sw[0], sw[2], 3.95], [sw[1], sw[2], 3.95], [sw[1], sw[3], 3.95], [sw[0], sw[3], 3.95], [-18.0, -8.3, 8.1], [-18.0, sw[3], 8.1]]));
solids.push(box(-25.7, -19.5, -6.9, -2.3, BASE, 4.0));
const nw = [-19.1, -15.0, NAVE_HALF - 0.2, AISLE_WALL];
solids.push(box(nw[0], nw[1], nw[2], nw[3], BASE, 4.3), hull([[nw[0], nw[2], 4.25], [nw[1], nw[2], 4.25], [nw[1], nw[3], 4.25], [nw[0], nw[3], 4.25], [-17.6, 6.6, 7.3], [-16.5, 6.6, 7.3]]));
for (const v of [-9.6, -8.0]) cuts.push(niche(-21.4, v, -1, 0, 1.0, 0.9, 2.2));
cuts.push(niche(-18.0, -10.9, 0, -1, 1.0, 1.0, 2.2));

// --- Toren: schacht met hoeksteunberen, klokverdieping, vier frontalen met hoekpinakels en naaldspits.
solids.push(box(TW_U0, TW_U1, -TW_HALF, TW_HALF, BASE, SHAFT_TOP));
for (const su of [-1, 1]) for (const sv of [-1, 1]) {
  const cu = TW_C + su * (TW_U1 - TW_C), cv = sv * TW_HALF;
  // Twee haakse steunberen per hoek, onderaan 0,9 m en boven de lijst op 14 m 0,5 m uitspringend.
  const bu = [cu - su * 0.5, cv], bv = [cu, cv - sv * 0.5];
  solids.push(buttress(bu[0], bu[1], 0, sv, 0.9, 1.0, 14.0), buttress(bu[0], bu[1], 0, sv, 0.5, 1.0, SHAFT_TOP - 0.2));
  solids.push(buttress(bv[0], bv[1], su, 0, 0.9, 1.0, 14.0), buttress(bv[0], bv[1], su, 0, 0.5, 1.0, SHAFT_TOP - 0.2));
}
// Lijst onder de klokverdieping met 45 graden onderzijde.
const cornice = (z, half0, half1) => hull([...[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [TW_C + a * half0, b * half0, z]), ...[[-1, -1], [1, -1], [1, 1], [-1, 1]].flatMap(([a, b]) => [[TW_C + a * half1, b * half1, z + (half1 - half0)], [TW_C + a * half1, b * half1, z + (half1 - half0) + 0.35]])]);
solids.push(cornice(SHAFT_TOP - 0.6, TW_HALF, TW_HALF + 0.4));
const BH = 2.85;
solids.push(box(TW_C - BH, TW_C + BH, -BH, BH, SHAFT_TOP, BELFRY_TOP));
solids.push(cornice(BELFRY_TOP - 0.45, BH, BH + 0.3));
const ROOF0 = BELFRY_TOP + 0.2;
// Kruisdak met vier frontalen (wimbergen), ze steken 0,1 m voor de klokverdieping uit.
solids.push(gableU(TW_C - BH - 0.1, TW_C + BH + 0.1, -2.35, 2.35, ROOF0, GABLE_TOP));
solids.push(gableV(TW_C - 2.35, TW_C + 2.35, -BH - 0.1, BH + 0.1, ROOF0, GABLE_TOP));
for (const su of [-1, 1]) for (const sv of [-1, 1]) {
  const x = TW_C + su * (BH - 0.5), y = sv * (BH - 0.5);
  solids.push(box(x - 0.5, x + 0.5, y - 0.5, y + 0.5, ROOF0 - 0.2, 32.6), hull([[x - 0.5, y - 0.5, 32.5], [x + 0.5, y - 0.5, 32.5], [x + 0.5, y + 0.5, 32.5], [x - 0.5, y + 0.5, 32.5], [x, y, 35.6]]));
}
// Achtkante naaldspits; hoogste AHN4-punt NAP +52,83 m = 55,96 m boven maaiveld.
solids.push(hull([...ring(TW_C, 0, 5.0, ROOF0 - 0.3), [TW_C, 0, SPIRE_TOP]]));
// Traptoren in de noordwestelijke hoek (BAG-contour, AHN tot circa 23 m).
solids.push(prism(ring(23.2, 4.25, 2.6, 0).map(p => [p[0], p[1]]), BASE, 20.8), hull([...ring(23.2, 4.25, 2.6, 20.7), [23.2, 4.25, 23.6]]));
// Hoofdportaal aan de Jisperweg met topgevel.
solids.push(box(TW_U1 - 0.2, TW_U1 + 0.7, -2.2, 2.2, BASE, 4.8), gableU(TW_U1 - 0.2, TW_U1 + 0.7, -2.2, 2.2, 4.8, 6.8));
cuts.push(niche(TW_U1 + 0.7, 0, 1, 0, 0, 1.9, 3.7));
// Torenvensters: groot venster boven het portaal, gekoppelde vensters middenverdieping, galmgaten en klok.
cuts.push(niche(TW_U1, 0, 1, 0, 7.8, 1.8, 5.2));
for (const [nx, ny] of [[1, 0], [0, 1], [0, -1], [-1, 0]]) {
  const fu = TW_C + nx * TW_HALF, fv = ny * TW_HALF, gu = TW_C + nx * BH, gv = ny * BH;
  for (const o of [-0.75, 0.75]) {
    if (nx !== -1 && ny !== 1) cuts.push(niche(fu - ny * o, fv + nx * o, nx, ny, 14.8, 0.9, 3.8));
    cuts.push(niche(gu - ny * o, gv + nx * o, nx, ny, 21.2, 0.9, 5.2));
  }
  cuts.push(Manifold.cylinder(0.5, 0.65, 0.65, 24).rotate([90, 0, 0]).translate([0, 0.25, 0]).rotate([0, 0, Math.atan2(-nx, ny) * 180 / Math.PI]).translate([gu, gv, 28.1]));
}

let church = Manifold.union(solids);
church = church.subtract(Manifold.union(cuts));
const parts = [['building:kerk', church]];

const META = {
  name: 'H. Johannes de Doperkerk Westbeemster',
  origin: ORIGIN, xAxis: X_AXIS, groundHeight: GROUND_ELLIPSOIDAL, groundSamplePoints: GROUND_SAMPLES, groundOffsetMetres: -0.3,
  replacesBuildings: ['NL.IMBAG.Pand.0370100000002738'],
  description: 'Neogotische kruisbasiliek (H. Bijvoets, 1878-1879); oorsprong op de as ter hoogte van de zijbeuken, +X oost naar de voortoren aan de Jisperweg; nokken uit 3D BAG, spits uit AHN4, opstand van RCE-foto\'s.',
  realWorld: { groundNapM: GROUND_NAP, ridgeM: RIDGE, naveEaveM: NAVE_EAVE, aisleEaveM: AISLE_EAVE, towerShaftM: SHAFT_TOP, belfryM: BELFRY_TOP, gablesM: GABLE_TOP, spireTipM: SPIRE_TOP, ahnSpireNapM: 52.83, flecheM: 30.0, lengthM: 49.5, widthM: 16.8 },
  sources: [
    'https://monumentenregister.cultureelerfgoed.nl/monumenten/511342',
    'https://service.pdok.nl/lv/bag/wfs/v2_0 (pand 0370100000002738)',
    'https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0370100000002738',
    'https://service.pdok.nl/rws/ahn/wcs/v1_0 (dsm_05m, dtm_05m)',
    'https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0',
    'https://commons.wikimedia.org/wiki/Category:Johannes_de_Doper_(Westbeemster)',
    'https://www.wikidata.org/wiki/Q17462935',
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
  for (const [name, solid] of named) {
    const m = solid.calculateNormals(0, 40).getMesh(), s = m.numProp, n = m.vertProperties.length / s, pos = new Float32Array(n * 3), norm = new Float32Array(n * 3), min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < n; i++) { const v = m.vertProperties, p = [v[i * s], v[i * s + 2], -v[i * s + 1]], q = s >= 6 ? [v[i * s + 3], v[i * s + 5], -v[i * s + 4]] : [0, 1, 0]; for (let j = 0; j < 3; j++) { pos[i * 3 + j] = p[j]; norm[i * 3 + j] = q[j]; min[j] = Math.min(min[j], p[j]); max[j] = Math.max(max[j], p[j]); } }
    const pi = push(pos, 34962), ni = push(norm, 34962), ii = push(Uint32Array.from(m.triVerts), 34963), a = acc.length;
    acc.push({ bufferView: pi, componentType: 5126, count: n, type: 'VEC3', min, max }, { bufferView: ni, componentType: 5126, count: n, type: 'VEC3' }, { bufferView: ii, componentType: 5125, count: m.triVerts.length, type: 'SCALAR' });
    meshes.push({ name, primitives: [{ attributes: { POSITION: a, NORMAL: a + 1 }, indices: a + 2, mode: 4 }] }); nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(JSON.stringify({ asset: { version: '2.0', generator: `NederPrint generate-${slug}.mjs` }, scene: 0, scenes: [{ nodes: nodes.map((_, i) => i) }], nodes, meshes, buffers: [{ byteLength: length }], bufferViews: views, accessors: acc })), jp = Buffer.concat([json, Buffer.alloc((4 - json.length % 4) % 4, 0x20)]), bin = Buffer.concat(chunks), h = Buffer.alloc(12);
  h.writeUInt32LE(0x46546c67, 0); h.writeUInt32LE(2, 4); h.writeUInt32LE(12 + 8 + jp.length + 8 + bin.length, 8);
  const ch = (len, type) => { const b = Buffer.alloc(8); b.writeUInt32LE(len, 0); b.writeUInt32LE(type, 4); return b; };
  return Buffer.concat([h, ch(jp.length, 0x4e4f534a), jp, ch(bin.length, 0x004e4942), bin]);
}

if (church.status() !== 'NoError') throw new Error(church.status());
const bb = church.boundingBox(); if (Math.abs(bb.min[2] - BASE) > 1e-5) throw new Error('modelvoet is niet vlak');
const pieces = church.decompose();
console.log(JSON.stringify({ slug, status: church.status(), genus: church.genus(), components: pieces.length, triangles: church.numTri(), volume: +church.volume().toFixed(1), bounds: { min: bb.min, max: bb.max }, size: bb.max.map((v, i) => +(v - bb.min[i]).toFixed(2)) }, null, 2));
if (pieces.length !== 1) { for (const p of pieces) console.log('piece', JSON.stringify(p.boundingBox()), p.volume()); throw new Error(`expected one connected component, got ${pieces.length}`); }
await mkdir(outDir, { recursive: true });
const glb = `${slug}.glb`, stl = `${slug}-1-${scale}.stl`;
await writeFile(path.join(outDir, glb), toGlb(parts));
const stlResult = toStl(church.translate([0, 0, -BASE]), `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stl), stlResult.buffer);
await writeFile(path.join(outDir, `${slug}.json`), JSON.stringify({ ...META, file: glb, unitsPerMetre: 1, className: 'building', crs: 'EPSG:28992', printFiles: [stl], realWorld: { ...META.realWorld, highestPointM: +bb.max[2].toFixed(2) } }, null, 2) + '\n');
console.log('geschreven', outDir, glb, stl, stlResult.triangles);

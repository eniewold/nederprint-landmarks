// Onze Lieve Vrouw van Altijddurende Bijstand (Mariaparochie, Almelo): neogotische pseudobasilicale
// kruiskerk van J. Stuyt. Het oostdeel (1917-1918) is een centraliserende kerk in de vorm van een Grieks
// kruis: driezijdig gesloten koor en transeptarmen, veelhoekige kapellen in de oksels en een dakruiter op
// de viering. In 1923 volgden het schip met zijbeuken (elke travee een eigen dwarszadeldak) en de toren
// naast de voorgevel: ongelede schacht, vier frontalen en een achtkante naaldspits.
// De pastorie (L-vormig, 1918) en de sacristie horen bij hetzelfde BAG-pand en zijn eenvoudig meegemodelleerd.
// Bouwstelsel kerk: u langs de as (+u = noordoost, naar het koor), v 90 graden linksom (+v = noordwest),
// z omhoog vanaf het maaiveld (NAP +11,7 m), oorsprong op de viering. Het bouwstelsel is het modelstelsel;
// xAxis legt de draaiing van 38,9 graden in RD vast (gemeten uit de nokken in de 3D BAG en het AHN).
// Pastorie en sacristie staan in een eigen stelsel (p, q) op 8,6 graden in RD, gedraaid naar het kerkstelsel.
// Maten: BAG-contour (pand 0141100000039905), 3D BAG LoD2.2-dakvlakken (52 graden schip, koor en transept,
// zijbeuktraveeën 40 graden), AHN4-DSM als controle voor nokken, goten en de torenomhullende (hoogste punt
// spits NAP +57,2 m), opstand van foto's (archimon.nl).
import Module from 'manifold-3d';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const argv = process.argv.slice(2), flag = (n, f) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] ? argv[i + 1] : f; };
const scale = Number(flag('--scale', '1000')), slug = 'onze-lieve-vrouw-van-altijddurende-bijstand-almelo';
const outDir = path.join(path.resolve(flag('--out', path.join(import.meta.dirname, '../models'))), slug), mmPerMetre = 1000 / scale;
const wasm = await Module(); wasm.setup(); const { Manifold, CrossSection } = wasm;

const BASE = -0.5, ORIGIN = [244769.74, 488559.85], X_AXIS = [0.77834, 0.62784], GROUND_NAP = 11.7;
// Hoofdmaten (m boven maaiveld)
const RIDGE = 17.0, K = 1.28;                                       // nok schip, koor, transept; 52 graden
const NAVE_HALF = 5.0, NAVE_EAVE = RIDGE - K * NAVE_HALF;            // schip 10 m breed
const ARM_HALF = 4.75, ARM_EAVE = RIDGE - K * ARM_HALF;              // koor en transeptarmen 9,5 m breed
const FRONT_U = -29.7, TRANS_C = -0.2;                               // voorgevel, as van het transept
const CHOIR_C = 8.1, NORTH_C = 6.9, SOUTH_C = -6.6;                  // middelpunten van de achtkante sluitingen
const AISLE_WALL = 8.45, AISLE_EAVE = 8.35, AISLE_RIDGE = 10.3;      // zijbeuken met dwarszadeldaken
const BAYS = [-22, -17, -12, -7], BAY_W = 5.0;
const TW_U0 = -29.0, TW_U1 = -23.5, TW_V0 = -9.85, TW_V1 = -4.35;   // toren (BAG-contour)
const TW_CU = (TW_U0 + TW_U1) / 2, TW_CV = (TW_V0 + TW_V1) / 2, TW_HALF = 2.75;
const SHAFT_TOP = 20.0, GABLE_TOP = 28.8, SPIRE_TOP = 45.6;          // AHN: lijst 19-20, frontalen 29, spits NAP +57,2
const FLECHE_TOP = 27.5;

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
// Arm met zadeldak langs +x van x0 tot het middelpunt c en een driezijdige (achtkante) sluiting, halve breedte h.
const arm = (x0, c, h, eave) => {
  const s = h * Math.tan(Math.PI / 8);
  const end = [[c - 0.1, h], [c + s, h], [c + h, s], [c + h, -s], [c + s, -h], [c - 0.1, -h]];
  return Manifold.union([
    box(x0, c, -h, h, BASE, eave), gableU(x0, c, -h, h, eave, RIDGE),
    prism(end, BASE, eave), hull([...end.map(([x, y]) => [x, y, eave - 0.1]), [c - 0.1, 0, RIDGE], [c, 0, RIDGE]]),
  ]);
};
// Vensters in de drie sluitingsvlakken van een arm (in het armstelsel, daarna mee gedraaid).
const armWindows = (c, h, z0, w, hh) => [0, 45, -45].map(a => { const r = a * Math.PI / 180; return niche(c + h * Math.cos(r), h * Math.sin(r), Math.cos(r), Math.sin(r), z0, w, hh); });

const solids = [], cuts = [];

// --- Oostdeel (1918): koor en transeptarmen, alle drie driezijdig gesloten, nok gelijk met het schip.
solids.push(arm(TRANS_C, CHOIR_C, ARM_HALF, ARM_EAVE));
solids.push(arm(-0.1, NORTH_C, ARM_HALF, ARM_EAVE).rotate([0, 0, 90]).translate([TRANS_C, 0, 0]));
solids.push(arm(-0.1, -SOUTH_C, ARM_HALF, ARM_EAVE).rotate([0, 0, -90]).translate([TRANS_C, 0, 0]));
cuts.push(...armWindows(CHOIR_C, ARM_HALF, 3.5, 1.5, 5.6));
cuts.push(...armWindows(NORTH_C, ARM_HALF, 3.5, 1.5, 5.6).map(m => m.rotate([0, 0, 90]).translate([TRANS_C, 0, 0])));
cuts.push(...armWindows(-SOUTH_C, ARM_HALF, 3.5, 1.5, 5.6).map(m => m.rotate([0, 0, -90]).translate([TRANS_C, 0, 0])));
// Veelhoekige kapellen in de oksels tussen koor en transeptarmen (BAG-contour), piramidedak tot 13 m.
const chapelNE = [[4.3, 4.5], [4.31, 9.29], [6.79, 10.12], [9.69, 9.12], [10.8, 5.8], [10.33, 4.44]];
for (const sgn of [1, -1]) {
  const poly = chapelNE.map(([u, v]) => [u, sgn * v]);
  solids.push(prism(poly, BASE, 8.1), hull([...poly.map(([u, v]) => [u, v, 8.0]), [7.1, sgn * 7.0, 13.0]]));
  for (const [a, b] of [[1, 2], [2, 3], [3, 4]]) {
    const [u0, v0] = poly[a], [u1, v1] = poly[b], L = Math.hypot(u1 - u0, v1 - v0);
    let nx = (v1 - v0) / L, ny = -(u1 - u0) / L; const mu = (u0 + u1) / 2, mv = (v0 + v1) / 2;
    if (nx * (mu - 7.1) + ny * (mv - sgn * 7.0) < 0) { nx = -nx; ny = -ny; }
    cuts.push(niche(mu, mv, nx, ny, 2.6, 1.1, 3.4));
  }
}
// Dakruiter op de viering: achtkante lantaarn met naaldspits.
solids.push(prism(ring(TRANS_C, 0, 2.0, 0).map(p => [p[0], p[1]]), RIDGE - 1.5, 21.0));
solids.push(hull([...ring(TRANS_C, 0, 2.4, 20.9), ...ring(TRANS_C, 0, 2.4, 21.3), [TRANS_C, 0, FLECHE_TOP]]));
for (let i = 0; i < 4; i++) { const a = (22.5 + i * 90) * Math.PI / 180, r = 1.0; cuts.push(niche(TRANS_C + r * Math.cos(a), r * Math.sin(a), Math.cos(a), Math.sin(a), 18.6, 0.6, 1.8, 0.2)); }

// --- Schip (1923): zadeldak van de voorgevel tot de viering.
solids.push(box(FRONT_U, TRANS_C, -NAVE_HALF, NAVE_HALF, BASE, NAVE_EAVE), gableU(FRONT_U, TRANS_C + 0.1, -NAVE_HALF, NAVE_HALF, NAVE_EAVE, RIDGE));
// Zijbeuken: lage muur met per travee een dwarszadeldak dat tegen het schipdak loopt (pseudobasiliek).
for (const sgn of [1, -1]) {
  const u0 = sgn > 0 ? -25.2 : TW_U1 - 0.2, u1 = TRANS_C - ARM_HALF + 0.2;
  const v0 = sgn * (NAVE_HALF - 0.2), v1 = sgn * AISLE_WALL;
  solids.push(box(u0, u1, Math.min(v0, v1), Math.max(v0, v1), BASE, AISLE_EAVE));
  const g0 = sgn * 4.6;
  for (const c of BAYS) {
    solids.push(gableV(Math.max(c - BAY_W / 2, sgn > 0 ? -24.6 : u0), c + BAY_W / 2, Math.min(g0, v1), Math.max(g0, v1), AISLE_EAVE, AISLE_RIDGE));
    cuts.push(niche(c, v1, 0, sgn, 2.4, 1.5, 4.3));
  }
  // Steunberen tussen de traveeën en op de hoeken.
  for (const u of [-19.5, -14.5, -9.5]) solids.push(buttress(u, v1, 0, sgn, 0.6, 0.9, 6.6));
  if (sgn > 0) solids.push(buttress(-24.6 + 0.45, v1, 0, 1, 0.6, 0.9, 6.6));
}
// Dakkapellen op het schip (foto's): drie per zijde.
for (const u of [-19.5, -14.5, -9.5]) for (const sgn of [1, -1]) {
  const v0 = sgn * 2.6, v1 = sgn * 4.4;
  solids.push(box(u - 0.6, u + 0.6, Math.min(v0, v1), Math.max(v0, v1), 11.2, 13.4), gableV(u - 0.6, u + 0.6, Math.min(v0, v1), Math.max(v0, v1), 13.4, 14.1));
}

// --- Voorgevel: topgevel 0,4 m boven het dak met kruisblok, groot gekoppeld venster en een nis voor het mozaïek.
solids.push(gableU(FRONT_U - 0.3, FRONT_U + 0.3, -NAVE_HALF - 0.1, NAVE_HALF + 0.1, NAVE_EAVE - 0.5, RIDGE + 0.5));
solids.push(box(FRONT_U - 0.3, FRONT_U + 0.3, -0.45, 0.45, RIDGE, RIDGE + 1.6));
for (const sgn of [1, -1]) solids.push(buttress(FRONT_U, sgn * (NAVE_HALF - 0.45), -1, 0, 0.6, 0.9, 8.5));
for (const dv of [-0.85, 0.85]) cuts.push(niche(FRONT_U - 0.3, dv, -1, 0, 5.4, 1.4, 6.6));
cuts.push(niche(FRONT_U - 0.3, 0, -1, 0, 12.6, 1.6, 2.6));
// Portaal met steil schilddak en lage zijvleugels (BAG: 2,8 m diep, 6,2 m breed).
const PV = -0.45;
solids.push(box(-32.5, FRONT_U + 0.2, PV - 1.95, PV + 1.95, BASE, 3.6));
solids.push(hull([[-32.5, PV - 1.95, 3.5], [-32.5, PV + 1.95, 3.5], [FRONT_U + 0.2, PV - 1.95, 3.5], [FRONT_U + 0.2, PV + 1.95, 3.5], [-31.0, PV, 6.4], [FRONT_U + 0.2, PV, 6.4]]));
solids.push(box(-31.6, FRONT_U + 0.2, -3.3, 2.9, BASE, 3.0));
for (const [a, b] of [[-3.3, PV - 1.95], [PV + 1.95, 2.9]]) solids.push(hull([[-31.6, a, 2.95], [-31.6, b, 2.95], [FRONT_U + 0.2, a, 2.95], [FRONT_U + 0.2, b, 2.95], [-31.6, a < 0 && b < 0 ? b : a, 4.0], [FRONT_U + 0.2, a < 0 && b < 0 ? b : a, 4.0]]));
cuts.push(niche(-32.5, PV, -1, 0, 0, 1.8, 2.9));
// Ronde traptoren op de noordhoek van de voorgevel met kegeldak.
const TT = [-26.0, 6.2];
solids.push(prism(ring(TT[0], TT[1], 3.2, 0, 16).map(p => [p[0], p[1]]), BASE, 12.8), hull([...ring(TT[0], TT[1], 3.2, 12.7, 16), [TT[0], TT[1], 18.5]]));
for (const z of [4.0, 8.5]) cuts.push(niche(TT[0] - 1.6, TT[1], -1, 0, z, 0.5, 1.4, 0.25));

// --- Toren naast de voorgevel: ongelede schacht, lijst, kruisdak met vier frontalen en achtkante naaldspits.
solids.push(box(TW_U0, TW_U1, TW_V0, TW_V1, BASE, SHAFT_TOP));
const cornice = (z, half0, half1) => hull([...[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [TW_CU + a * half0, TW_CV + b * half0, z]), ...[[-1, -1], [1, -1], [1, 1], [-1, 1]].flatMap(([a, b]) => [[TW_CU + a * half1, TW_CV + b * half1, z + (half1 - half0)], [TW_CU + a * half1, TW_CV + b * half1, z + (half1 - half0) + 0.35]])]);
solids.push(cornice(SHAFT_TOP - 0.6, TW_HALF, TW_HALF + 0.3));
const ROOF0 = SHAFT_TOP;
solids.push(gableU(TW_CU - TW_HALF, TW_CU + TW_HALF, TW_CV - TW_HALF, TW_CV + TW_HALF, ROOF0, GABLE_TOP));
solids.push(gableV(TW_CU - TW_HALF, TW_CU + TW_HALF, TW_CV - TW_HALF, TW_CV + TW_HALF, ROOF0, GABLE_TOP));
solids.push(hull([...ring(TW_CU, TW_CV, 4.9, ROOF0 - 0.3), [TW_CU, TW_CV, SPIRE_TOP]]));
// Galmgaten (twee per zijde), een venster per zijde lager in de schacht en de klok in elk frontaal.
for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
  const fu = TW_CU + nx * TW_HALF, fv = TW_CV + ny * TW_HALF;
  for (const o of [-0.8, 0.8]) cuts.push(niche(fu - ny * o, fv + nx * o, nx, ny, 14.6, 0.9, 3.6));
  if (!(nx === 0 && ny === 1)) cuts.push(niche(fu, fv, nx, ny, 8.6, 0.8, 2.4));
  cuts.push(Manifold.cylinder(0.5, 0.75, 0.75, 24).rotate([90, 0, 0]).translate([0, 0.25, 0]).rotate([0, 0, Math.atan2(-nx, ny) * 180 / Math.PI]).translate([fu, fv, 23.0]));
}
// Lage driezijdige uitbouw tegen de zuidzijde van de toren (BAG-contour, AHN 5 tot 5,5 m).
const towerBay = [[-28.75, TW_V0 + 0.15], [-27.69, -11.36], [-25.37, -11.38], [-24.28, TW_V0 + 0.15]];
solids.push(prism(towerBay, BASE, 4.0), hull([...towerBay.map(([u, v]) => [u, v, 3.95]), [-27.6, TW_V0 + 0.15, 5.6], [-25.4, TW_V0 + 0.15, 5.6]]));
cuts.push(niche(-26.53, -11.37, 0, -1, 0, 1.2, 2.6));

let church = Manifold.union(solids).subtract(Manifold.union(cuts));

// --- Sacristie en pastorie in het eigen stelsel (p, q), 30,3 graden rechtsom ten opzichte van de kerk.
const P_ROT = -30.3, P_ORIGIN = [12.72, -16.50];
const ps = [], pc = [];
// Sacristie: drie traveeën met zadeldak (nok langs q) en een driezijdige uitbouw op het zuiden.
for (let k = 0; k < 3; k++) {
  const p0 = -13.4 + 5.27 * k, p1 = p0 + 5.27, c = (p0 + p1) / 2, qN = k === 0 ? -3.5 : 2.6;
  ps.push(box(p0, p1, -10.0, qN, BASE, 3.6), gableV(p0, p1, -10.0, qN, 3.6, 6.5));
  const bay = [[p0 + 0.5, -9.9], [c - 1.15, -11.3], [c + 1.15, -11.3], [p1 - 0.5, -9.9]];
  ps.push(prism(bay, BASE, 3.6), hull([...bay.map(([p, q]) => [p, q, 3.55]), [c - 0.1, -9.6, 6.4], [c + 0.1, -9.6, 6.4]]));
  pc.push(niche(c, -11.3, 0, -1, 0.9, 0.9, 2.0, 0.25));
}
ps.push(box(-13.4, -5.6, -3.6, 2.6, BASE, 5.3));                        // platte verbinding naar het transept
ps.push(box(-9.5, -5.0, 2.6, 13.0, BASE, 2.8));                         // lage gang langs kapel en koor
ps.push(box(-5.41, 5.29, 7.0, 15.13, BASE, 3.8), gableV(-5.41, 5.29, 7.0, 15.13, 3.8, 6.75)); // vleugel achter de pastorie
// Pastorie: vleugel met nok langs p en schild op het westen, hoofdblok met nok langs q, schoorstenen.
ps.push(box(2.37, 11.0, 0.58, 8.21, BASE, 8.3), hull([[2.37, 0.58, 8.25], [11.0, 0.58, 8.25], [11.0, 8.21, 8.25], [2.37, 8.21, 8.25], [6.2, 4.4, 11.0], [11.0, 4.4, 11.0]]));
ps.push(box(6.59, 16.06, -3.45, 8.21, BASE, 8.6), gableV(6.59, 16.06, -3.45, 8.21, 8.6, 11.4));
ps.push(box(6.59, 11.07, -5.13, -3.3, BASE, 4.4), box(15.9, 18.86, 2.74, 7.92, BASE, 4.2));
for (const q of [-1.0, 5.0]) ps.push(box(10.9, 11.8, q - 0.45, q + 0.45, 10.0, 12.3));
const pastorie = Manifold.union(ps).subtract(Manifold.union(pc)).rotate([0, 0, P_ROT]).translate([P_ORIGIN[0], P_ORIGIN[1], 0]);

church = church.add(pastorie);
const parts = [['building:kerk', church]];

const META = {
  name: 'Onze Lieve Vrouw van Altijddurende Bijstand Almelo',
  origin: ORIGIN, xAxis: X_AXIS, groundOffsetMetres: -0.3,
  replacesBuildings: ['NL.IMBAG.Pand.0141100000039905'],
  description: 'Neogotische pseudobasilicale kruiskerk van J. Stuyt (1918 en 1923) in Mariaparochie met pastorie en sacristie (één BAG-pand); oorsprong op de viering, +X noordoost naar het koor; nokken uit 3D BAG en AHN4, toren uit de AHN-omhullende, opstand van foto\'s.',
  realWorld: { groundNapM: GROUND_NAP, ridgeM: RIDGE, naveEaveM: +NAVE_EAVE.toFixed(2), aisleEaveM: AISLE_EAVE, aisleRidgeM: AISLE_RIDGE, towerShaftM: SHAFT_TOP, gablesM: GABLE_TOP, spireTipM: SPIRE_TOP, ahnSpireNapM: 57.21, flecheM: FLECHE_TOP, lengthM: 45.4, widthM: 23.0 },
  sources: [
    'https://www.openstreetmap.org/way/288518499',
    'https://archimon.nl/overijssel/mariaparochieolv.html',
    'https://dbnl.org/tekst/sten009monu03_01/sten009monu03_01_0068.php',
    'https://service.pdok.nl/lv/bag/wfs/v2_0 (pand 0141100000039905)',
    'https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0141100000039905',
    'https://service.pdok.nl/rws/ahn/wcs/v1_0 (dsm_05m, dtm_05m)',
    'https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0',
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

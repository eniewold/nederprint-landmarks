// Genereert een vereenvoudigd, gesloten 3D-model van de John S. Thompsonbrug
// bij Grave: de stalen vakwerkbrug uit 1926-1929 (ontwerp ir. C.F. Egelie,
// Rijkswaterstaat) over de Maas tussen Grave en Nederasselt, in de N324, met
// het stuw- en sluizencomplex eronder. Negen vakwerkliggers met gebogen
// bovenranden, schuine eindstijlen, verticalen en diagonalen rusten op acht
// pijlers en twee landhoofden (515 m tussen de dagzijden); onder de twee
// stuwvakken hangt de stuw (jukken met schuiven) aan de stroomopwaartse zijde,
// met daarboven twee kraanwagens op het bordes. Bij de overwinning tijdens
// Operatie Market Garden (17 september 1944) werd de brug intact veroverd;
// sinds 2004 draagt hij de naam van luitenant John S. Thompson. Alle maten in
// het script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y
// omhoog, een node met de constructie en twee road-nodes met de bovenste
// 0,5 m van de rijbaan en het fietspad en de BGT-attributen, met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal> met de hele brug
// en een printvoet onder het dek.
//
//   node scripts/generate-john-s-thompsonbrug.mjs              # 1:1500 (standaard)
//   node scripts/generate-john-s-thompsonbrug.mjs --scale 1000
//
// Met 530 m is de brug op 1:1000 te lang voor een printbed; de STL staat
// daarom standaard op 1:1500 (354 mm), zoals de Hedelse spoorbrug.
//
// Assenstelsel: oorsprong op de as van de rijbaan (midden tussen de twee
// vakwerkwanden) boven het hart van de stroompijler met de vistrap tussen de
// twee stuwvakken (RD 179049,05, 420081,79), op de waterspiegel benedenstrooms
// van de stuw (NAP +5,2 m), Z omhoog. +X loopt langs de brug naar het
// oostnoordoosten (Nederasselt, RD-richting 28,71 graden vanaf het oosten,
// langs de randen van het BGT-dek), +Y stroomafwaarts naar het noordnoordwesten.
// Het landhoofd aan de Graafse kant ligt op x = -227,8 tot -215,0, dat aan de
// kant van Nederasselt op x = 300,0 tot 302,5.
//
// Bronnen: BGT overbruggingsdeel (dek 17,96 m breed van x = -227,8 tot 302,5
// met de randen evenwijdig aan de as, de landhoofden, zeven pijlers met ronde
// koppen die stroomopwaarts 4 tot 9 m buiten het dek steken); AHN DSM 0,5 m
// (PDOK WCS) voor het lengteprofiel van de rijbaan (helling 1:80 naar de
// vlakke stuwvakken op NAP +17,65 m), de twee vakwerkwanden (9,25 m hart op
// hart), de hoogte en vorm van de bovenranden per overspanning (elliptisch,
// 7,7 tot 10,6 m boven de rijbaan), de achtste pijler (die niet in de BGT
// staat), de kraanwagens (NAP +24,4 m), het bedieningshuis op de stroompijler
// (NAP +18,0 m) en de pijlerkoppen (NAP +12,3 m); PDOK-terrein voor de
// waterspiegel (benedenstrooms 48,9 m, bovenstrooms 51,5 m ellipsoïdisch; het
// PDOK-terrein ligt in de uiterwaard 43,7 m boven het AHN); het
// Rijksmonumentenregister (514153) voor de opbouw (negen segmenten, 515 m,
// vakwerken met gebogen bovenranden, schuine eindstijlen, verticalen en
// diagonalen, betonnen rijvloer van 7,5 m, aangehangen brug aan de
// stroomafwaartse zijde, bordes met kraanwagens aan de stroomopwaartse zijde,
// jukken met drie rijen schuiven); Wikipedia (1927-1929, 9 overspanningen,
// 515 m, 20 jukken met 60 schuiven); Wikimedia Commons-foto's (Bridge
// grave1.jpg, Bridge grave2.jpg, 2006-05-17 13.37 Grave, brug over de
// Maas.JPG, Grave brug schip michelangelo.jpg, Nederasselt (Heumen)
// Rijksmonument 523934 verkeersbrug met stuw en sluis.JPG, Grave (N-Br, NL)
// fietspad van de Maasbrug.JPG en de RCE-foto's 20346217, 20346254, 20346256
// en 20346260) voor het vakwerkpatroon, de eindstijlen, de pijlers, de
// jukken, de kraanwagens en het fietspad. Geschat (foto's) zijn de
// constructiehoogte van het dek (2,0 m), de dikte van de wanden en staven,
// het aantal velden (5 per overspanning van 50 m, 6 per overspanning van
// 60 m), de hoogte van de schuiven (NAP +9,6 m) en de bovenrand van de
// zevende overspanning, die in het AHN onder een steigerkap zat.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "john-s-thompsonbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts.filter(Boolean));
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Doorsnede in het XZ-vlak (CrossSection in x, z), uitgetrokken langs Y.
const extrudeY = (section, y0, y1) =>
  section
    .extrude(y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const profileY = (points, y0, y1) => extrudeY(new CrossSection([ccw(points)]), y0, y1);
// Band tussen twee functies van x (onder en boven), uitgetrokken langs Y.
function bandY(x0, x1, bottom, top, y0, y1, step = 2) {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  const xs = Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
  return profileY([...xs.map((x) => [x, bottom(x)]), ...[...xs].reverse().map((x) => [x, top(x)])], y0, y1);
}
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Stuksgewijs lineaire tabel [[x, waarde], ...].
const table = (rows) => (x) => {
  if (x <= rows[0][0]) return rows[0][1];
  for (let i = 1; i < rows.length; i++) {
    if (x <= rows[i][0]) {
      const [x0, a] = rows[i - 1];
      const [x1, b] = rows[i];
      return a + ((b - a) * (x - x0)) / (x1 - x0);
    }
  }
  return rows[rows.length - 1][1];
};
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in gezien vanaf +X, steeds evenveel punten).
function loftX(stations) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { x, section } of stations) for (const [y, z] of section) verts.push(x, y, z);
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < stations.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = stations.length - 1;
  for (let j = 1; j + 1 < n; j++) {
    tris.push(id(0, 0), id(0, j + 1), id(0, j));
    tris.push(id(last, 0), id(last, j), id(last, j + 1));
  }
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  return solid;
}
// Pijler met ronde koppen in y: rechthoek in x, halve cirkels aan beide kanten.
function roundPier(x0, x1, y0, y1, z0, z1) {
  const r = (x1 - x0) / 2;
  const xc = (x0 + x1) / 2;
  return Manifold.hull([
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([xc, y0 + r, z0]),
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([xc, y1 - r, z0]),
  ]);
}

// ---------- hoofdmaten (boven de waterspiegel benedenstrooms, NAP +5,2 m) ----------
// PDOK legt de Maas benedenstrooms van de stuw op 48,9 m ellipsoïdisch en het
// stuwpand bovenstrooms op 51,5 m; in de uiterwaard ligt het PDOK-terrein
// 43,7 m boven het AHN (NAP). De waterspiegel benedenstrooms ligt dus op
// circa NAP +5,2 m, het stuwpand op NAP +7,8 m.
const WATER_NAP = 5.2;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de Maas benedenstrooms op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 48.88;

// Rijbaan in NAP (AHN-DSM, 25e percentiel over het midden van de rijbaan per
// 4 m): vanaf het Graafse landhoofd 1:80 omhoog naar de vlakke stuwvakken op
// NAP +17,65 m en daarna 1:82 omlaag naar het landhoofd van Nederasselt.
const ROAD_NAP = table([
  [-227.8, 16.13],
  [-110.32, 17.64],
  [63.68, 17.65],
  [299.97, 14.77],
  [302.5, 14.75],
]);
const roadZ = (x) => Z(ROAD_NAP(x));
const DECK_DEPTH = 2.0; // rijvloer met dwarsdragers (foto's)
const deckBottom = (x) => roadZ(x) - DECK_DEPTH;
// Breedtes (BGT-dek van y = -7,74 tot 10,22; AHN voor de wanden).
const TRUSS_Y = 4.63; // hart van de vakwerkwanden, 9,25 m hart op hart (AHN)
const TRUSS_T = 1.0; // dikte van een wand
const ROAD_Y = [-(TRUSS_Y - TRUSS_T / 2), TRUSS_Y - TRUSS_T / 2];
const SOUTH_WALK = { y0: -7.74, weirY0: -9.8, depth: 1.0, drop: 0.25 }; // dienstpad, boven de stuw het bordes
const NORTH_WALK = { y1: 10.22, depth: 1.0, rise: 0.2 }; // fietspad (aangehangen brug)
const SW_END = -227.8; // achterkant van het Graafse landhoofd (BGT)
const NE_END = 302.5; // achterkant van het landhoofd van Nederasselt (BGT)

// Opleggingen: de dagzijden van de landhoofden (515 m uit elkaar) en de harten
// van de pijlers (BGT; de achtste pijler uit het AHN).
const BEARINGS = [-215.03, -162.99, -109.0, -55.22, 0, 66.63, 131.66, 194.96, 249.68, 299.97];
// Per overspanning de hoogte van de bovenkant van de bovenrand boven de
// rijbaan in het midden (AHN; de zevende zat onder een steigerkap en is gelijk
// aan de zesde genomen) en het aantal velden (foto's, de windverbanden in het AHN).
const SPANS = [
  { H: 8.0, n: 5 },
  { H: 7.7, n: 5 },
  { H: 8.8, n: 5 },
  { H: 8.7, n: 5 },
  { H: 10.6, n: 6 },
  { H: 9.2, n: 6 },
  { H: 9.2, n: 6 },
  { H: 7.8, n: 5 },
  { H: 8.0, n: 5 },
];
// Vakwerk: bovenrand als veelhoek door de bovenknopen op een halve ellips
// (h = H √(1 − u²), past op het AHN binnen een halve meter), de eerste en
// laatste bovenknoop 3 m van de oplegging op 0,55 H (schuine eindstijl), de
// overige boven het midden van elk onderveld. Op 1:1000 is elke wand een
// dichte plaat met doorgaande driehoekige openingen met de punt omhoog (aan
// weerszijden van elke verticaal) en blinde nissen van 0,35 m voor de
// driehoeken met de vlakke kant boven.
const END_NODE = 3.0;
const END_RISE = 0.55;
const TC = 1.1; // bovenrand
const WD = 1.0; // diagonalen
const WV = 0.9; // verticalen
const END_W = 0.65; // halve breedte van de eindstijl
const FLOOR = 0.6; // bovenkant onderrand boven de rijbaan
const BOTTOM_TOP = 0.9; // bovenkant onderrand bij de oplegging
const NICHE = 0.35;
const POINTED = (55 * Math.PI) / 180;

// Stuw (Rijksmonumentenregister, Wikipedia, foto's): twee doorstroomopeningen
// onder de vierde en vijfde overspanning, afgesloten met jukken waarin drie
// rijen schuiven boven elkaar; tien jukken per opening. De schuiven vormen een
// wand tot NAP +9,6 m (AHN), de jukken lopen als stijlen door tot onder het
// bordes. Op het bordes staan twee kraanwagens (AHN: NAP +24,4 m).
const WEIR = {
  openings: [
    [-53.0, -3.74],
    [3.74, 64.35],
  ],
  y0: -9.8,
  y1: -8.6,
  topNap: 9.6,
  posts: 10,
  post: 1.0,
  recess: 0.3,
};
const WEIR_DECK = [BEARINGS[3], BEARINGS[5]]; // bordes van 4,7 m boven de stuw
const CRANES = [
  [-36.3, -28.3],
  [25.7, 33.7],
].map(([x0, x1]) => ({ x0, x1, y0: -9.8, y1: -5.3, topNap: 24.4 }));
// Bedieningshuis op de stroomopwaartse kop van de stroompijler (BAG-pand
// 0786100000132726, AHN NAP +18,0 m).
const CONTROL_HOUSE = { x0: -2.3, x1: 1.3, y0: -13.8, y1: -10.2, topNap: 18.0 };

// Pijlers (BGT, lokale coördinaten): het deel onder het dek tot onder de
// rijvloer, de koppen erbuiten tot NAP +12,3 m (AHN, foto's).
const PIER_NOSE_NAP = 12.3;
const PIERS = [
  [
    [[-161.38, -8.23], [-161.21, -4.84], [-164.64, -4.84], [-164.77, -8.24], [-164.6, -8.86], [-164.43, -9.31], [-164.04, -9.85], [-163.5, -10.48], [-163.17, -10.6], [-162.67, -10.61], [-162.21, -10.32], [-161.86, -9.86], [-161.58, -9.19]],
    [[-161.21, -4.84], [-161.6, 9.23], [-164.39, 9.24], [-164.64, -4.84]],
    [[-161.84, 9.78], [-162.11, 10.19], [-162.48, 10.61], [-162.92, 10.96], [-163.41, 10.94], [-163.84, 10.6], [-164.12, 10.2], [-164.39, 9.24], [-161.6, 9.23]],
  ],
  [
    [[-108.06, 9.74], [-108.37, 10.17], [-108.73, 10.55], [-109.15, 10.87], [-109.5, 11.01], [-109.91, 10.88], [-110.38, 10.4], [-110.85, 9.83], [-111.25, 9.2], [-107.8, 9.2]],
    [[-111.18, -4.84], [-106.72, -4.84], [-107.59, 9.2], [-111.25, 9.2]],
    [[-106.77, -6.09], [-106.72, -4.84], [-111.18, -4.84], [-111.29, -10.26], [-111.14, -11.21], [-110.82, -12.29], [-110.44, -12.9], [-109.89, -13.55], [-109.45, -13.96], [-109.1, -14.11], [-108.72, -14.03], [-108.38, -13.81], [-107.96, -13.37], [-107.5, -12.69], [-107.19, -12.01], [-106.96, -11.08]],
  ],
  [[[-53.52, 9.19], [-54.11, 10.1], [-55.21, 11.01], [-56.42, 10.01], [-57.15, 9.06], [-57.44, 7.63], [-57.21, -8.64], [-57.3, -10.46], [-57.05, -12.33], [-56.16, -13.7], [-55.25, -14.41], [-54.28, -13.62], [-53.64, -12.8], [-53.3, -11.64], [-53.02, -10.65], [-53.0, -7.88], [-53.01, 7.92], [-53.42, 9.03]]],
  // stroompijler met de vistrap
  [[[3.53, -3.47], [3.74, 10.03], [3.25, 12.95], [1.91, 14.96], [0.16, 16.56], [-1.47, 15.18], [-2.68, 13.4], [-3.39, 11.68], [-3.68, -3.34], [-3.74, -7.86], [-3.68, -10.21], [-3.12, -13.01], [-2.51, -14.37], [-1.48, -15.69], [0.02, -16.85], [1.84, -15.25], [2.94, -13.82], [3.58, -11.86], [3.65, -9.93], [3.61, -7.87]]],
  [[[68.82, 7.47], [68.42, 8.9], [67.54, 10.19], [66.69, 10.97], [65.96, 10.45], [65.21, 9.42], [64.93, 8.99], [64.65, 7.09], [64.39, -3.37], [64.35, -7.99], [64.42, -10.94], [64.88, -12.57], [65.52, -13.55], [66.61, -14.44], [67.87, -13.45], [68.48, -12.46], [68.91, -11.33], [68.89, -6.74]]],
  [[[129.13, 8.57], [128.87, 7.33], [129.02, -8.52], [129.79, -10.11], [131.39, -11.73], [133.03, -10.66], [134.12, -8.95], [134.43, -6.84], [134.44, 6.06], [133.98, 8.72], [132.78, 10.37], [131.6, 11.15], [130.18, 10.4], [129.22, 9.04]]],
  [[[194.25, 10.39], [193.31, 9.41], [192.87, 7.24], [192.88, -8.93], [193.66, -10.44], [194.9, -11.16], [195.71, -10.51], [196.66, -8.82], [197.05, -3.88], [196.92, 7.61], [195.99, 9.74], [195.01, 10.65], [194.59, 10.69]]],
  null, // achtste pijler: niet in de BGT, uit het AHN (zie hieronder)
];
const PIER8 = { x0: 247.98, x1: 251.38, y0: -16.3, y1: 11.0 };

// ---------- vakwerkwand ----------
function spanNodes(k) {
  const a = BEARINGS[k];
  const b = BEARINGS[k + 1];
  const { H, n } = SPANS[k];
  const L = b - a;
  const P = L / n;
  const mid = (a + b) / 2;
  const bottom = Array.from({ length: n + 1 }, (_, i) => a + i * P);
  const top = Array.from({ length: n }, (_, i) => {
    const x = i === 0 ? a + END_NODE : i === n - 1 ? b - END_NODE : a + (i + 0.5) * P;
    const u = (x - mid) / (L / 2);
    const h = i === 0 || i === n - 1 ? END_RISE * H : H * Math.sqrt(1 - u * u);
    return [x, roadZ(x) + h];
  });
  return { a, b, P, bottom, top };
}
// Lijn door (xa, za) en (xb, zb), loodrecht verschoven met d (positief =
// naar beneden).
function offsetLine(xa, za, xb, zb, d) {
  const m = (zb - za) / (xb - xa);
  const shift = d * Math.sqrt(1 + m * m);
  return { m, at: (x) => za + m * (x - xa) - shift };
}
const openingFlanks = [];
function trussSection(k) {
  const { a, b, bottom, top } = spanNodes(k);
  const n = bottom.length - 1;
  // Bovenkant: veelhoek door de bovenknopen; onderkant van de bovenrand TC lager.
  const topAt = table([[a, roadZ(a) + BOTTOM_TOP], ...top, [b, roadZ(b) + BOTTOM_TOP]]);
  const under = (x) => topAt(x) - TC;
  const steps = Math.max(2, Math.round((b - a) / 2));
  const outline = [
    ...Array.from({ length: steps + 1 }, (_, i) => {
      const x = a + ((b - a) * i) / steps;
      return [x, deckBottom(x)];
    }),
    [b, roadZ(b) + BOTTOM_TOP],
    ...[...top].reverse(),
    [a, roadZ(a) + BOTTOM_TOP],
  ];
  const floorAt = (x) => roadZ(x) + FLOOR;
  const tanP = Math.tan(POINTED);
  const holes = [];
  for (let i = 0; i < n; i++) {
    const [t, zTop] = top[i];
    const zt = zTop - TC / 2; // hartlijn van de bovenrand
    const xl = bottom[i];
    const xr = bottom[i + 1];
    const fl = floorAt(xl);
    const fr = floorAt(xr);
    const left = offsetLine(xl, fl, t, zt, i === 0 ? END_W : WD / 2);
    const right = offsetLine(xr, fr, t, zt, i === n - 1 ? END_W : WD / 2);
    for (const { xv, line, dir } of [
      { xv: t - WV / 2, line: left, dir: -1 },
      { xv: t + WV / 2, line: right, dir: 1 },
    ]) {
      const floor = Math.max(floorAt(xv), floorAt(xv + dir * 3));
      const za = Math.min(line.at(xv), under(xv) - 0.15);
      if (za - floor < 0.8) continue;
      const m = Math.max(Math.abs(line.m), tanP);
      const xb = xv + (dir * (za - floor)) / m;
      if (Math.abs(xb - xv) < 0.6) continue;
      const fb = floorAt(xb) + 0.02;
      const fv = floorAt(xv) + 0.02;
      holes.push(dir < 0 ? [[xb, fb], [xv, fv], [xv, za]] : [[xv, fv], [xb, fb], [xv, za]]);
      openingFlanks.push((Math.atan(m) * 180) / Math.PI);
    }
  }
  // Blinde nissen tussen twee Λ's: boven beide diagonalen, onder de bovenrand.
  const niches = [];
  for (let i = 0; i + 1 < n; i++) {
    const xb = bottom[i + 1];
    const fb = floorAt(xb);
    const [ta, za] = top[i];
    const [tb, zb] = top[i + 1];
    const l = offsetLine(xb, fb, ta, za - TC / 2, -WD / 2);
    const r = offsetLine(xb, fb, tb, zb - TC / 2, -WD / 2);
    const x0 = ta + WV / 2;
    const x1 = tb - WV / 2;
    const above = (line) =>
      new CrossSection([ccw([[x0 - 1, line.at(x0 - 1)], [x1 + 1, line.at(x1 + 1)], [x1 + 1, line.at(x1 + 1) + 60], [x0 - 1, line.at(x0 - 1) + 60]])]);
    const m = 24;
    const capTop = Array.from({ length: m + 1 }, (_, j) => {
      const x = x0 + ((x1 - x0) * j) / m;
      return [x, under(x) - 0.1];
    });
    const cap = new CrossSection([ccw([[x0, fb - 5], [x1, fb - 5], ...[...capTop].reverse()])]);
    const niche = cap.intersect(above(l)).intersect(above(r));
    if (niche.area() > 0.8) niches.push(niche);
  }
  const plate = new CrossSection([ccw(outline)]).subtract(new CrossSection(holes.map(ccw)));
  return { plate, niches: niches.length ? CrossSection.union(niches) : null, holes: holes.length, nicheCount: niches.length };
}
const trussStats = [];
const trusses = SPANS.flatMap((span, k) => {
  const { plate, niches, holes, nicheCount } = trussSection(k);
  trussStats.push({ span: k + 1, lengthM: +(BEARINGS[k + 1] - BEARINGS[k]).toFixed(2), panels: span.n, heightM: span.H, holes, niches: nicheCount });
  return [-1, 1].map((side) => {
    const y0 = side * TRUSS_Y - TRUSS_T / 2;
    const y1 = side * TRUSS_Y + TRUSS_T / 2;
    let wall = extrudeY(plate, y0, y1);
    if (niches) {
      wall = wall.subtract(extrudeY(niches, y0 - 0.2, y0 + NICHE)).subtract(extrudeY(niches, y1 - NICHE, y1 + 0.2));
    }
    return wall;
  });
});

// ---------- dek, paden, landhoofden ----------
const deck = bandY(SW_END, NE_END, deckBottom, roadZ, ROAD_Y[0] - 0.01, ROAD_Y[1] + 0.01);
const southTop = (x) => roadZ(x) - SOUTH_WALK.drop;
const southWalk = union([
  bandY(SW_END, WEIR_DECK[0], (x) => southTop(x) - SOUTH_WALK.depth, southTop, SOUTH_WALK.y0, -TRUSS_Y + 0.01),
  bandY(WEIR_DECK[0], WEIR_DECK[1], (x) => southTop(x) - SOUTH_WALK.depth, southTop, SOUTH_WALK.weirY0, -TRUSS_Y + 0.01),
  bandY(WEIR_DECK[1], NE_END, (x) => southTop(x) - SOUTH_WALK.depth, southTop, SOUTH_WALK.y0, -TRUSS_Y + 0.01),
]);
const northTop = (x) => roadZ(x) + NORTH_WALK.rise;
const northWalk = bandY(SW_END, NE_END, (x) => northTop(x) - NORTH_WALK.depth, northTop, TRUSS_Y - 0.01, NORTH_WALK.y1);
const abutments = [
  bandY(SW_END, BEARINGS[0], () => BASE, (x) => roadZ(x) - 0.01, SOUTH_WALK.y0, NORTH_WALK.y1, 4),
  bandY(BEARINGS[BEARINGS.length - 1], NE_END, () => BASE, (x) => roadZ(x) - 0.01, SOUTH_WALK.y0, NORTH_WALK.y1, 1),
];

// ---------- pijlers ----------
const band = (x0, x1) => new CrossSection([ccw([[x0, SOUTH_WALK.y0], [x1, SOUTH_WALK.y0], [x1, NORTH_WALK.y1], [x0, NORTH_WALK.y1]])]);
const pierSolids = PIERS.flatMap((polys, i) => {
  const xc = BEARINGS[i + 1];
  const top = deckBottom(xc) + 0.1;
  const nose = Z(PIER_NOSE_NAP);
  if (!polys) {
    const { x0, x1, y0, y1 } = PIER8;
    return [roundPier(x0, x1, y0, y1, BASE, nose), boxFromTo(x0, x1, SOUTH_WALK.y0, NORTH_WALK.y1, BASE, top)];
  }
  const plan = CrossSection.union(polys.map((p) => new CrossSection([ccw(p)])));
  const bb = plan.bounds();
  const main = plan.intersect(band(bb.min[0] - 1, bb.max[0] + 1));
  return [plan.extrude(nose - BASE).translate([0, 0, BASE]), main.extrude(top - BASE).translate([0, 0, BASE])];
});
const controlHouse = boxFromTo(CONTROL_HOUSE.x0, CONTROL_HOUSE.x1, CONTROL_HOUSE.y0, CONTROL_HOUSE.y1, Z(PIER_NOSE_NAP) - 0.1, Z(CONTROL_HOUSE.topNap));

// ---------- stuw en kraanwagens ----------
let weirPosts = 0;
const weir = WEIR.openings.flatMap(([x0, x1]) => {
  const wallTop = Z(WEIR.topNap);
  const parts = [boxFromTo(x0 - 0.2, x1 + 0.2, WEIR.y0, WEIR.y1, BASE, wallTop)];
  const pitch = (x1 - x0) / (WEIR.posts + 1);
  const recesses = [];
  for (let i = 0; i <= WEIR.posts; i++) {
    // Schuiven tussen de jukken liggen 0,3 m terug ten opzichte van de jukken.
    const a = x0 + i * pitch + (i === 0 ? 0 : WEIR.post / 2);
    const b = x0 + (i + 1) * pitch - (i === WEIR.posts ? 0 : WEIR.post / 2);
    recesses.push(boxFromTo(a, b, WEIR.y0 - 0.1, WEIR.y0 + WEIR.recess, 0.5, wallTop + 0.1));
    if (i === 0) continue;
    const xp = x0 + i * pitch;
    parts.push(boxFromTo(xp - WEIR.post / 2, xp + WEIR.post / 2, WEIR.y0, WEIR.y1, BASE, southTop(xp) - SOUTH_WALK.depth + 0.1));
    weirPosts++;
  }
  return [union(parts).subtract(union(recesses))];
});
const cranes = CRANES.map(({ x0, x1, y0, y1, topNap }) => boxFromTo(x0, x1, y0, y1, southTop(x0) - 0.1, Z(topNap)));

const bridge = union([deck, southWalk, northWalk, ...abutments, ...pierSolids, controlHouse, ...weir, ...cranes, ...trusses]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden die uitloopt in een
// scherm van 0,9 m tot de onderplaat (boven de stuw achter de schuivenwand).
const KNEE = (50 * Math.PI) / 180;
const SCREEN = 0.45;
const x0Foot = BEARINGS[0];
const x1Foot = BEARINGS[BEARINGS.length - 1];
const footXs = [
  ...Array.from({ length: Math.round(x1Foot - x0Foot) + 1 }, (_, i) => x0Foot + ((x1Foot - x0Foot) * i) / Math.round(x1Foot - x0Foot)),
  WEIR_DECK[0] - 1e-3,
  WEIR_DECK[0],
  WEIR_DECK[1],
  WEIR_DECK[1] + 1e-3,
]
  .sort((p, q) => p - q)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-4);
const footStations = footXs.map((x) => {
  const inWeir = x >= WEIR_DECK[0] && x <= WEIR_DECK[1];
  const ya = (inWeir ? SOUTH_WALK.weirY0 : SOUTH_WALK.y0) - 0.02;
  const yb = NORTH_WALK.y1 + 0.02;
  // Onderkant van het dienstpad (links) en het fietspad (rechts).
  const zbL = southTop(x) - SOUTH_WALK.depth + 0.02;
  const zbR = northTop(x) - NORTH_WALK.depth + 0.02;
  const yc = (ya + yb) / 2;
  const w = (yb - ya) / 2;
  // Per kant: het scherm met de wig erboven, of alleen de wig als die al
  // boven de onderkant uitloopt.
  const side = (zb) => {
    const zs = zb - Math.tan(KNEE) * (w - SCREEN);
    if (zs > BASE + 0.05) return { foot: [SCREEN, BASE], knee: [SCREEN, zs] };
    const a = w - (zb - BASE) / Math.tan(KNEE);
    return { foot: [a, BASE], knee: [a + 1e-3, BASE + 1e-3] };
  };
  const L = side(zbL);
  const R = side(zbR);
  const section = [
    [-L.foot[0], L.foot[1]],
    [R.foot[0], R.foot[1]],
    [R.knee[0], R.knee[1]],
    [w, zbR],
    // Trede onder de noordelijke wand, waar het dek dieper reikt dan de paden.
    [TRUSS_Y - yc, zbR],
    [TRUSS_Y - 0.2 - yc, zbL],
    [-w, zbL],
    [-L.knee[0], L.knee[1]],
  ];
  return { x, section: section.map(([y, z]) => [y + yc, z]) };
});
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van het dek en de paden en de plafonds van de
// blinde nissen (0,35 m diep); in de printversie alleen die nissen.
const nicheBand = (y) => {
  const ay = Math.abs(y);
  return ay > TRUSS_Y - TRUSS_T / 2 - 1e-3 && ay < TRUSS_Y + TRUSS_T / 2 + 1e-3;
};
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let deckArea = 0;
  let nicheArea = 0;
  let area = 0;
  const other = [];
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const yMid = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const nearDeck =
      Math.abs(zMid - deckBottom(xMid)) < 0.1 ||
      Math.abs(zMid - (southTop(xMid) - SOUTH_WALK.depth)) < 0.1 ||
      Math.abs(zMid - (northTop(xMid) - NORTH_WALK.depth)) < 0.1;
    if (nearDeck) deckArea += len / 2;
    else if (nicheBand(yMid) && zMid > roadZ(xMid) + FLOOR) nicheArea += len / 2;
    else {
      area += len / 2;
      if (len / 2 > 0.01) other.push([xMid, yMid, zMid].map((c) => +c.toFixed(2)));
    }
  }
  return { deckArea, nicheArea, area, other };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  const model = overhangs(bridge);
  console.log("vrij hangend (m2): dek en paden", Math.round(model.deckArea), "nissen", Math.round(model.nicheArea), "overig", +model.area.toFixed(2));
  if (model.area > 0.5) {
    console.log(model.other.slice(0, 20));
    throw new Error("overhang buiten dek en nissen");
  }
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2): dek", +print.deckArea.toFixed(2), "overig", +print.area.toFixed(2));
  if (print.deckArea + print.area > 0.5) {
    console.log(print.other.slice(0, 20));
    throw new Error("printversie heeft overhang");
  }
  const minFlank = openingFlanks.reduce((m, a) => Math.min(m, a), 90);
  console.log("doorgaande openingen", openingFlanks.length, "steilste flank min (graden)", +minFlank.toFixed(1), "jukken", weirPosts);
  if (minFlank < 50) throw new Error("opening met een te vlakke flank");
}

// ---------- rijbaan en fietspad als eigen onderdelen ----------
// De bovenste 0,5 m van de rijbaan en van het fietspad is een eigen node met
// de attributen van het BGT-wegdeel erop (glTF `extras.attributes`), zodat de
// kleurregels van een thema (bijvoorbeeld fietspaden rood) op de brug werken
// zoals op de PDOK-wegdelen ernaast. Pas na het printmodel gebouwd: de STL
// bevat de brug als geheel en blijft daardoor ongewijzigd.
//
// Actuele BGT-wegdelen met relatieve hoogteligging 1 op het dek (lokale
// coördinaten, vereenvoudigd tot 5 cm). Rijbaan: zes vlakken rijbaan
// regionale weg (asfalt) tussen de wanden van x = -217,2 tot 302,5, plus twee
// smalle stroken rijbaan regionale weg in cementbeton (y = 4,1 tot 5,0, van
// x = -227,8 tot 5,2) die onder de noordelijke vakwerkwand liggen en dus
// constructie blijven. Fietspad: drie vlakken aan de stroomafwaartse kant
// (y = 5,0 tot 9,2). Het dienstpad aan de stroomopwaartse kant heeft geen
// wegdeel in de BGT en blijft constructie.
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = {
  bgt_functie: "rijbaan regionale weg",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_ATTRIBUTES = {
  bgt_functie: "fietspad",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const ROAD_PATHS = {
  "P0030.00f6f9687601f68ae050120a080440dd": [[-77.84, -4.83], [-77.84, 0.05], [-217.18, 0.18], [-217.17, -4.11], [-216.81, -4.84]],
  "P0030.00f6f9687602f68ae050120a080440dd": [[-77.84, 0.05], [-77.84, 4.12], [-196.55, 4.23], [-217.19, 4.17], [-217.18, 0.18]],
  "P0030.00f6f9687603f68ae050120a080440dd": [[5.24, -0.04], [5.23, 4.05], [-77.84, 4.12], [-77.84, 0.05]],
  "P0030.00f6f9687604f68ae050120a080440dd": [[5.25, -4.83], [5.24, -0.04], [-77.84, 0.05], [-77.84, -4.83]],
  "P0025.4e18b3228bcf424db1507fdef2a6fbfa": [[302.49, -0.09], [302.5, 4.09], [5.23, 4.05], [5.24, -0.04]],
  "P0025.dd81973b2c454989ad200a04e5d9cd96": [[302.48, -4.22], [302.49, -0.09], [5.24, -0.04], [5.25, -4.23]],
};
const BIKE_PATHS = {
  "P0030.00f6f9688cbdf68ae050120a080440dd": [[-77.84, 5.04], [-77.85, 9.19], [-217.0, 9.27], [-227.77, 10.22], [-227.8, 5.94], [-216.74, 5.08]],
  "P0030.00f6f9688cbef68ae050120a080440dd": [[5.22, 4.97], [5.21, 9.13], [-77.85, 9.19], [-77.84, 5.04]],
  "P0025.ecb727e816e240c49aab6e28d845c6d1": [[302.5, 4.99], [302.5, 9.14], [5.21, 9.13], [5.22, 4.97]],
};
// De as van de rijbaan ligt over de lengte van de BGT-rijbaan in een wegdeel
// rijbaan, de as van het fietspad (y = 7) in een wegdeel fietspad.
{
  const inRing = ([x, y], ring) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  for (const [rings, y, x0, x1, label] of [
    [ROAD_PATHS, 0.5, -217, 302.4, "rijbaan"],
    [BIKE_PATHS, 7, -227.7, 302.4, "fietspad"],
  ]) {
    for (let x = x0; x <= x1; x += 1) {
      if (!Object.values(rings).some((ring) => inRing([x, y], ring))) throw new Error(`${label}: as op x = ${x} niet in de BGT`);
    }
  }
}
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, met dezelfde
// loftstations als het dek en de paden (om de 2 m) en 0,1 m voorbij de
// uiteinden. Zo houdt de constructie geen vlak zonder dikte op het wegdek over.
function topLayer(y0, y1, top) {
  const n = Math.max(1, Math.round((NE_END - SW_END) / 2));
  const xs = [SW_END - 0.1, ...Array.from({ length: n + 1 }, (_, i) => SW_END + ((NE_END - SW_END) * i) / n), NE_END + 0.1];
  return loftX(
    xs.map((x) => {
      const zt = top(x);
      return { x, section: [[y0, zt - LAYER], [y1, zt - LAYER], [y1, zt + ABOVE], [y0, zt + ABOVE]] };
    }),
  );
}
// De vakwerkwanden blijven over hun hele strook constructie, ook onder de
// openingen, met 2 cm vrij.
const wallGuards = union(
  [-1, 1].map((side) =>
    boxFromTo(BEARINGS[0] - 0.02, BEARINGS[BEARINGS.length - 1] + 0.02, side * TRUSS_Y - TRUSS_T / 2 - 0.02, side * TRUSS_Y + TRUSS_T / 2 + 0.02, -10, 60),
  ),
);
// Rijbaan: het dek tussen de wanden; boven de landhoofden tot de paden.
const roadCut = topLayer(-(TRUSS_Y - 0.01), TRUSS_Y - 0.01, roadZ).subtract(wallGuards);
// Fietspad: de bovenste 0,5 m van de aangehangen brug binnen de BGT-vlakken.
const bikePaths = union(Object.values(BIKE_PATHS).map((poly) => prism(poly, BASE, 60)));
const bikeCut = topLayer(TRUSS_Y - 0.5, NORTH_WALK.y1 + 0.1, northTop).subtract(wallGuards).intersect(bikePaths);
const roadway = roadCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const structure = bridge.subtract(union([roadCut, bikeCut]));
const parts = [
  ["building:john-s-thompsonbrug", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];
// Controle: constructie, rijbaan en fietspad tellen op tot de brug als geheel.
const partition = {
  bridgeM3: +bridge.volume().toFixed(3),
  partsM3: +parts.reduce((s, [, solid]) => s + solid.volume(), 0).toFixed(3),
};
partition.diffM3 = +(partition.partsM3 - partition.bridgeM3).toFixed(4);
console.log("partitie (m3)", partition);
if (Math.abs(partition.diffM3) > 0.01) throw new Error("onderdelen tellen niet op tot de brug");
for (const [name, solid] of parts) {
  if (solid.status() !== "NoError" || solid.isEmpty()) throw new Error(`${name}: ${solid.status()}`);
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
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
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
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const topNap = (k) => {
  const { top } = spanNodes(k);
  return +(top.reduce((m, [, z]) => Math.max(m, z), -Infinity) + WATER_NAP).toFixed(2);
};
report.trusses = trussStats.map((s, k) => ({ ...s, topNap: topNap(k) }));
report.weir = { posts: weirPosts, cranes: CRANES.length };
report.partition = partition;
const glbFile = path.join(outDir, "john-s-thompsonbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-john-s-thompsonbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden, stuw en printvoet
// op het printbed.
const stlName = `john-s-thompsonbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint John S. Thompsonbrug Grave 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Op het water benedenstrooms van de stuw, 22 m naast de as.
const samplePoints = [-35, -15, 20, 45].map((x) => [x, 22]);
await writeFile(
  path.join(outDir, "john-s-thompsonbrug.json"),
  JSON.stringify(
    {
      name: "John S. Thompsonbrug",
      file: "john-s-thompsonbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [179049.05, 420081.79],
      xAxis: [0.87705, 0.4804],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0786100000132726"],
      replacesTerrain: [
        "P0025.c42816a7f22c44cba15a07f7e6fcc1cb",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van de rijbaan boven het hart van de stroompijler tussen de twee stuwvakken op de waterspiegel benedenstrooms van de stuw (z = 0, NAP +5,2 m) in de oorsprong, +X langs de brug naar het oostnoordoosten (Nederasselt, RD-richting 28,71 graden vanaf het oosten) en +Y stroomafwaarts naar het noordnoordwesten. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van de rijbaan tussen de vakwerkwanden en van het fietspad met de attributen van het BGT-wegdeel erop in extras.attributes (bgt_functie rijbaan regionale weg of fietspad, bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het dek van 18 m breed van het Graafse landhoofd (x = -227,8) tot dat van Nederasselt (x = 302,5) met de rijbaan op NAP +16,1 tot +17,65 m (1:80 naar de vlakke stuwvakken), het fietspad aan de stroomafwaartse en het dienstpad aan de stroomopwaartse zijde; negen vakwerkoverspanningen (50 tot 67 m) met twee wanden van 1,0 m, 9,25 m hart op hart, als dichte platen met elliptische, veelhoekige bovenranden 7,7 tot 10,6 m boven de rijbaan, schuine eindstijlen, doorgaande driehoekige openingen met de punt omhoog naast elke verticaal en blinde nissen voor de driehoeken met een vlakke bovenkant; acht pijlers met ronde koppen (BGT, de achtste uit het AHN), de koppen tot NAP +12,3 m; onder de twee stuwvakken de wand van schuiven tot NAP +9,6 m met 20 jukken tot onder het bordes, twee kraanwagens op het bordes en het bedieningshuis op de stroompijler. Windverbanden en portalen tussen de wanden, lantaarns, leuningen en de schildersbruggen onder het dek zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water benedenstrooms van de stuw bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Vervangt het bedieningshuis (BAG-pand) op de stroompijler. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthBetweenAbutmentsM: +(BEARINGS[BEARINGS.length - 1] - BEARINGS[0]).toFixed(1),
        modelLengthM: +(NE_END - SW_END).toFixed(1),
        deckWidthM: +(NORTH_WALK.y1 - SOUTH_WALK.y0).toFixed(2),
        trussCentresM: 2 * TRUSS_Y,
        spansM: BEARINGS.slice(1).map((x, i) => +(x - BEARINGS[i]).toFixed(2)),
        trussHeightAboveRoadM: SPANS.map(({ H }) => H),
        panels: SPANS.map(({ n }) => n),
        roadNapM: { grave: ROAD_NAP(SW_END), weir: 17.65, nederasselt: ROAD_NAP(NE_END) },
        weirPosts: weirPosts,
        craneTopNapM: 24.4,
        waterNapM: { downstream: WATER_NAP, upstream: 7.8 },
      },
      sources: [
        "https://nl.wikipedia.org/wiki/John_S._Thompsonbrug",
        "https://nl.wikipedia.org/wiki/Stuw-_en_sluizencomplex_Grave",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/514153",
        "PDOK BGT overbruggingsdeel (dek, landhoofden, pijlers), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de rijbaan, de vakwerkwanden en hun bovenranden, de achtste pijler, de kraanwagens en het bedieningshuis",
        "Wikimedia Commons: Bridge grave1.jpg, Bridge grave2.jpg, 2006-05-17 13.37 Grave, brug over de Maas.JPG, Grave brug schip michelangelo.jpg, Nederasselt (Heumen) Rijksmonument 523934 verkeersbrug met stuw en sluis.JPG, Grave (N-Br, NL) fietspad van de Maasbrug.JPG, Overzicht verkeersbrug met stuw- en sluizencomplex - Grave - 20346217 - RCE.jpg, Overzicht verkeersbrug met stuw- en sluiscomplex - Grave - 20346254 - RCE.jpg, Overzicht verkeersbrug, gezien vanaf de weg voor de brug - Grave - 20346256 - RCE.jpg, Overzicht verkeersbrug met stuw- en sluiscomplex - Grave - 20346260 - RCE.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

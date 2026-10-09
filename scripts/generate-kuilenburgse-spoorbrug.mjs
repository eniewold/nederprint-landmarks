// Genereert een vereenvoudigd, gesloten 3D-model van de Kuilenburgse
// spoorbrug: de spoorbrug over de Lek tussen Culemborg en Schalkwijk
// (spoorlijn Utrecht - 's-Hertogenbosch), sinds 1983 een stalen boogbrug met
// een hoofdoverspanning van 155 m (twee kokerbogen met hangers en een
// windverband van kruisende diagonalen tussen de bogen) en een betonnen
// aanbrug van tien velden over de noordelijke uiterwaard, op de gemetselde
// pijlers van de brug uit 1868. Naast het zuidelijke landhoofd staat het
// monument "Een monument van steen en staal" (1983) met een stuk van de oude
// vakwerkligger op een geribde kolom; dat staat als tweede node in het model.
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, één node per onderdeel met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal> met een printvoet onder het dek.
//
//   node scripts/generate-kuilenburgse-spoorbrug.mjs              # 1:2000 (standaard)
//   node scripts/generate-kuilenburgse-spoorbrug.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het dek midden tussen de twee
// rivierpijlers (RD 143059,41, 441367,07), op de waterspiegel van de Lek zoals
// het PDOK-terrein die legt (NAP +2,8 m), Z omhoog. +X loopt langs de brug
// naar het noorden (Schalkwijk, RD-richting 120,68 graden vanaf het oosten),
// +Y stroomafwaarts naar het westzuidwesten. De rivierpijlers staan op
// x = -83,1 tot -73,4 (Culemborg) en 73,8 tot 82,2; het zuidelijke landhoofd
// begint op x = -100,4, het noordelijke eindigt op x = 592,2. Het monument
// staat op (-77,4, -26,95), oostelijk naast de zuidelijke rivierpijler.
//
// Bronnen: BGT overbruggingsdeel (dek 14 m breed over de hoofdoverspanning en
// 10,8 m over de aanbrug, de tien pijlers met ronde en spitse koppen, het
// noordelijke landhoofd); AHN DSM 0,5 m (PDOK WCS) voor de spoorstaafhoogte
// (NAP +17,3 m op het zuidelijke landhoofd, +17,8 m in het midden van de
// boog, dalend tot +12,9 m bij het noordelijke landhoofd), de twee bogen
// (4,85 m naast de as, 2 m breed, top NAP +42,8 m), het windverband tussen de
// bogen (kruisende diagonalen in elf velden van 11,18 m tussen x = -61,5 en
// 61,5, met een eindregel aan beide kanten) en het monument (top NAP +24,5 m,
// stuk ligger 10,6 m lang evenwijdig aan de brug); BAG (pand
// 0216100000016391, de kolom van het monument, 5 m doorsnede); Wikipedia
// (hoofdoverspanning 155 m, lengte 667 m, hoogte 25 m, doorvaarthoogte
// 16,2 m, betonnen aanbruggen, bouw 1981-1983, monument naast de brug);
// PDOK-terrein voor de waterspiegel (46,43 m ellipsoïdisch op de Lek, 46,26 m
// in de geul onder de aanbrug); Wikimedia Commons-foto's (Kuilenburgse
// spoorbrug 1 t/m 9.jpg, Culemborg - Kuilenburgse spoorbrug 2018
// (42943756821).jpg en (28083500957).jpg, Spoorbrug Culemborg1.jpg,
// NS 1757; Lekbrug Culemborg.jpg, Oude Kuilenburge spoorbrug monument 1-3.jpg)
// voor de kokerbogen, de hangers, de doorsnede van de aanbrug, de pijlers en
// het monument. Geschat zijn de kokerhoogte van de boog (3,0 m in de top,
// 5,0 m bij de opleggingen), de constructiehoogte van het stalen dek (2,4 m)
// en van de betonnen aanbrug (4,0 m), de hoogte van het metselwerk en de
// betonnen pijlerkoppen, het windverband op 0,4 m onder de bovenkant van de
// boog en de maten van het monument (kolom 7,1 m, paal 3 m, stuk ligger
// 9,5 m hoog).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kuilenburgse-spoorbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const rad = (deg) => (deg * Math.PI) / 180;
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const rect = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const boxFromTo = (x0, x1, y0, y1, z0, z1) => prism(rect(x0, x1, y0, y1), z0, z1);
// Kraag of uitkragende kop: van de plattegrond `inner` op z0 schuin (hoek
// `deg` boven de horizontaal) naar de plattegrond `outer` en dan recht omhoog
// tot z1. Beide plattegronden convex.
function flare(inner, outer, d, z0, z1, deg = 50) {
  const zTop = z0 + d * Math.tan(rad(deg));
  return union([
    Manifold.hull([prism(inner, z0, z0 + 0.01), prism(outer, zTop, zTop + 0.01)]),
    prism(outer, zTop, z1),
  ]);
}
const offsetPoly = (poly, d) => {
  const polys = new CrossSection([ccw(poly)]).offset(d, "Round", 2, 16).toPolygons();
  return polys[0].map(([x, y]) => [x, y]);
};
// Loft langs X: per station een doorsnede in het YZ-vlak (tegen de klok in
// gezien vanaf +X, steeds evenveel punten, stervormig vanaf het eerste punt).
function loftX(stations, label = "loft") {
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
  if (solid.status() !== "NoError") throw new Error(`${label}: ${solid.status()}`);
  return solid;
}
const range = (a, b, step) => {
  const n = Math.max(1, Math.round((b - a) / step));
  return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
};
const sortedUnique = (xs) =>
  [...xs].sort((a, b) => a - b).filter((x, i, arr) => i === 0 || x - arr[i - 1] > 1e-4);

// ---------- hoofdmaten (boven de waterspiegel, NAP +2,8 m) ----------
// PDOK legt de Lek bij Culemborg op 46,43 m ellipsoïdisch en de geul onder
// de aanbrug op 46,26 m; het PDOK-terrein ligt hier 43,55 m boven het AHN
// (NAP). Het model staat met z = 0 op NAP +2,8 m, tussen beide in.
const WATER_NAP = 2.8;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 46.26;

// Hart van de rivierpijlers (BGT) en de uiteinden van het dek.
const PIER_S = -78.36;
const PIER_N = 78.36;
const SOUTH_END = -100.4; // begin van het BGT-dek op het zuidelijke landhoofd
const SOUTH_FACE = -83.1; // voorkant van de zuidelijke rivierpijler
const NORTH_FACE = 589.3; // voorkant van het noordelijke landhoofd (BGT)
const NORTH_END = 592.2; // einde van het BGT-dek

// Spoorstaafhoogte in NAP (75e percentiel van het AHN-DSM per 10 m tussen
// de sporen): op het zuidelijke landhoofd 0,8 % stijgend naar NAP +17,5 m op
// de zuidelijke rivierpijler, over de boog een zeeg tot +17,8 m in het
// midden, en over de aanbrug 0,893 % dalend tot +12,9 m bij het noordelijke
// landhoofd (afwijking van het AHN hoogstens 0,07 m).
const RAIL = { pier: 17.5, crown: 17.8, south: 0.008, north: 0.00893 };
function railNap(x) {
  if (x < PIER_S) return RAIL.pier + RAIL.south * (x - PIER_S);
  if (x <= PIER_N) return RAIL.pier + (RAIL.crown - RAIL.pier) * (1 - (x / PIER_N) ** 2);
  return RAIL.pier - RAIL.north * (x - PIER_N);
}
const railZ = (x) => Z(railNap(x));
// Stalen dek over de hoofdoverspanning: 14 m breed (BGT) met de looppaden
// buiten de bogen, 2,4 m constructiehoogte (foto's), de onderkant van de
// looppaden schuin (50 graden) naar de hoofdliggers onder de bogen.
const MAIN_DECK = { half: 7.0, depth: 2.4, edge: 1.0, bottomHalf: 5.85 };
// Betonnen kokerligger van de aanbrug: 10,8 m breed (BGT), 4,0 m hoog vanaf
// de spoorstaaf (foto's), met een kraaglijst van 0,6 m en een afgeschuinde
// onderrand.
const APPROACH_DECK = { half: 5.4, lip: 0.6, web: 5.0, chamfer: 3.3, depth: 4.0, bottomHalf: 4.4 };
const mainBottom = (x) => railZ(x) - MAIN_DECK.depth;
const approachBottom = (x) => railZ(x) - APPROACH_DECK.depth;
const deckBottom = (x) => (x <= PIER_N ? mainBottom(x) : approachBottom(x));
const deckHalf = (x) => (x <= PIER_N ? MAIN_DECK.bottomHalf : APPROACH_DECK.bottomHalf);

// ---------- boog ----------
// Twee kokerbogen 4,85 m naast de as, 2,0 m breed (AHN), van oplegging tot
// oplegging 152,8 m (Wikipedia: 155 m). Bovenkant (AHN, kleinste kwadraten op
// het 97e percentiel per meter): z = top - k x^2 + q x^4 met de top op
// NAP +42,8 m (Wikipedia: 25 m boven het spoor; het AHN geeft 42,4 m met
// uitschieters tot 43,8 m door de looprail op de boog). De koker is in de
// top 3,0 m hoog en loopt naar de opleggingen op tot 5,0 m (foto's); de
// onderkant van de buitenzijde is 50 graden afgeschuind.
const ARCH = { half: 76.4, crownNap: 42.8, k: 0.00418, q: 5.2e-8, y: 4.85, width: 2.0, depth: 3.0, endDepth: 5.0 };
const archTopNap = (x) => ARCH.crownNap - ARCH.k * x * x + ARCH.q * x ** 4;
const archTop = (x) => Z(archTopNap(x));
const archDepth = (x) => ARCH.depth + (ARCH.endDepth - ARCH.depth) * (Math.min(Math.abs(x), ARCH.half) / ARCH.half) ** 6;
const archBottom = (x) => Math.max(archTop(x) - archDepth(x), mainBottom(x) + 0.05);
// Binnenvlak van de bogen: het hangerscherm en het windverband sluiten daar
// op aan.
const ARCH_INNER = ARCH.y - ARCH.width / 2;
const ARCH_OUTER = ARCH.y + ARCH.width / 2;
const CHAMFER = 1.0; // breedte van de afschuining aan de onderkant buiten
// Hangers op de twaalf knopen van het windverband (AHN: knopen om de
// 11,18 m van x = -61,5 tot 61,5; foto NS 1757: hangers om de circa 11 m).
// Op 1:1000 is elke hanger een stijl van 1,0 m en de ruimte tussen dek en
// boog een scherm van 1,0 m dik tegen het binnenvlak van de boog, met spitse
// openingen (flanken van 50 graden) tot onder de boog. Tussen de laatste
// hanger en de oplegging blijft het scherm dicht (de koker wordt daar een
// diepe plaat, foto's).
const NODES = Array.from({ length: 12 }, (_, k) => -61.5 + (123 * k) / 11);
const HANGER = 1.0;
const SCREEN_T = 1.0;
const POINTED = rad(50);
// Windverband (AHN): kruisende diagonalen tussen de knopen, met een
// eindregel van 1,5 m op de eerste en laatste knoop; staven 1,0 m breed,
// bovenkant 0,4 m onder de bovenkant van de boog, 0,9 m dik in het midden.
// De onderkant loopt onder 47 graden schuin naar de bogen, zodat elk
// knooppunt zonder steun print vanaf de dichte hoek van het hangerscherm.
const BRACE = { drop: 0.4, thick: 0.9, bar: 1.0, endBar: 1.5, slope: rad(47) };

// ---------- pijlers (BGT, lokale coördinaten) ----------
// Rivierpijlers met ronde koppen (metselwerk uit 1868).
const MAIN_PIERS = [
  [
    [-74.54, -7.26], [-73.74, -7.26], [-73.55, 0.35], [-73.4, 6.97], [-74.65, 7.19], [-74.85, 9.25], [-75.25, 10.75],
    [-75.9, 12.14], [-76.57, 12.93], [-77.98, 13.91], [-79.18, 14.57], [-80.22, 13.76], [-81.02, 12.85], [-82.12, 10.78],
    [-82.94, 6.98], [-83.02, 0.31], [-83.11, -6.84], [-82.81, -8.39], [-82.41, -10.14], [-81.11, -12.21], [-80.45, -13.17],
    [-79.55, -13.76], [-78.79, -13.6], [-77.83, -12.87], [-76.55, -11.16],
  ],
  [
    [81.22, -11.89], [81.93, -9.43], [82.19, -7.58], [82.2, -1.91], [82.2, 8.05], [81.97, 9.5], [81.6, 10.91], [80.84, 12.23],
    [80.03, 13.51], [79.11, 14.27], [78.17, 14.59], [77.22, 14.28], [76.3, 13.52], [75.48, 12.6], [74.85, 11.57], [74.3, 10.22],
    [73.86, 8.79], [73.78, -8.75], [74.18, -10.36], [74.87, -11.86], [75.51, -12.59], [75.99, -13.1], [76.96, -13.92],
    [78.03, -14.46], [79.11, -13.92], [80.09, -13.12],
  ],
];
// Pijlers van de aanbrug met spitse koppen; de laatste twee zijn later met
// beton omkleed (rechte koppen met neuzen).
const APPROACH_PIERS = [
  [
    [119.82, 10.16], [119.14, 9.36], [118.67, 8.45], [118.33, 7.47], [118.28, 6.31], [118.27, -5.98], [118.41, -7.25],
    [118.66, -7.99], [119.26, -8.98], [120.47, -10.1], [121.7, -10.76], [123.51, -9.33], [124.1, -8.49], [124.51, -7.38],
    [124.74, -5.94], [124.71, 6.33], [124.67, 7.35], [124.48, 8.17], [123.97, 9.1], [123.18, 10.07], [122.31, 10.81],
    [121.44, 11.24], [120.65, 10.82],
  ],
  [
    [164.05, 11.4], [163.09, 10.79], [162.12, 9.79], [161.59, 8.84], [160.99, 6.73], [161.15, -6.1], [161.25, -6.97],
    [161.52, -7.97], [162.02, -8.92], [162.93, -9.98], [164.09, -10.84], [164.95, -10.3], [165.91, -9.44], [166.58, -8.58],
    [167.1, -7.59], [167.28, -6.78], [167.31, -6.03], [167.21, 6.56], [167.1, 7.49], [166.84, 8.44], [166.13, 9.73],
    [165.18, 10.72],
  ],
  [
    [228.47, 5.49], [228.48, 6.34], [228.4, 6.96], [228.1, 7.91], [227.39, 8.85], [226.46, 9.77], [225.52, 10.38],
    [224.64, 9.71], [223.72, 8.73], [223.07, 7.58], [222.83, 6.69], [222.98, -5.86], [223.0, -6.65], [223.29, -7.22],
    [224.0, -8.21], [224.76, -8.99], [225.91, -9.68], [226.55, -9.22], [227.25, -8.44], [227.98, -7.39], [228.4, -5.96],
  ],
  [
    [283.86, -5.62], [284.08, -6.65], [284.72, -7.76], [285.58, -8.7], [286.66, -9.61], [287.3, -9.18], [288.01, -8.49],
    [288.62, -7.64], [289.29, -6.16], [289.35, -5.7], [289.29, 6.35], [289.05, 7.57], [288.58, 8.59], [287.83, 9.45],
    [286.63, 10.33], [285.77, 9.68], [284.96, 8.87], [284.39, 7.94], [284.14, 7.22], [284.0, 6.39],
  ],
  [
    [349.27, -8.47], [349.82, -7.62], [350.25, -6.72], [350.4, -5.65], [350.31, 6.44], [350.07, 7.67], [349.63, 8.55],
    [349.02, 9.29], [348.21, 9.99], [347.62, 10.34], [346.73, 9.71], [345.91, 8.85], [345.37, 7.88], [345.15, 7.0],
    [345.13, 6.46], [345.16, -5.66], [345.31, -6.72], [345.58, -7.59], [346.05, -8.39], [346.79, -9.1], [347.64, -9.72],
    [348.45, -9.27],
  ],
  [
    [406.17, 6.39], [406.29, -5.86], [406.52, -6.96], [407.1, -8.05], [407.84, -8.99], [408.79, -9.69], [409.63, -9.2],
    [410.43, -8.38], [411.02, -7.48], [411.35, -6.61], [411.47, -5.78], [411.35, 6.38], [411.14, 7.62], [410.6, 8.71],
    [409.94, 9.6], [408.8, 10.42], [407.93, 9.85], [407.04, 8.94], [406.46, 7.91], [406.26, 7.1],
  ],
  [
    [473.34, -7.59], [473.29, 8.51], [470.58, 11.06], [470.58, 11.66], [468.95, 11.61], [468.96, 10.95], [466.16, 8.19],
    [466.3, -7.64], [468.99, -10.33], [469.0, -11.0], [470.66, -11.04], [470.66, -10.29],
  ],
  [
    [531.61, 11.12], [529.99, 11.13], [527.15, 8.39], [528.28, 7.3], [528.13, 6.42], [528.25, -5.8], [528.38, -6.7],
    [528.69, -7.58], [529.35, -8.56], [530.25, -9.38], [530.78, -9.71], [531.7, -9.18], [532.65, -8.21], [533.2, -7.35],
    [533.5, -6.49], [533.54, -5.78], [533.43, 6.39], [533.32, 7.21], [534.35, 8.34],
  ],
];
// Rivierpijlers: metselwerk tot NAP +9,0 m met een zware kraag (0,8 m
// uitkragend), daarboven een smaller blok (baksteen aan de zuidkant, beton
// aan de noordkant) en een betonnen oplegbank onder het dek (foto's).
const MAIN_MASONRY_NAP = 9.0;
const MAIN_KRAAG = 0.8;
// Pijlers van de aanbrug: metselwerk tot 4,0 m onder de onderkant van de
// ligger met een kraag van 0,3 m, een betonnen blok en een kop die 1 m
// breder is dan het dek en 1,2 m langs de ligger omhoog steekt (foto's).
const APPROACH_KRAAG = 0.3;
const HEAD = { below: 4.0, cap: 2.0, capTop: 1.2, half: 6.4, blockHalf: 5.0 };
// Zuidelijk landhoofd (BGT-dek van x = -100,4 tot de rivierpijler): een
// gemetseld blok tot het spoor.
const SOUTH_ABUTMENT = { x0: SOUTH_END, x1: SOUTH_FACE + 0.5, y0: -6.7, y1: 6.9 };
// Noordelijk landhoofd (BGT).
const NORTH_ABUTMENT = { x0: NORTH_FACE, x1: NORTH_END, y0: -7.25, y1: 8.06 };

// ---------- monument "Een monument van steen en staal" (1983) ----------
// Geribde betonnen kolom van 5 m doorsnede (BAG-pand) tot NAP +13,0 m, een
// stalen paal van 1,0 m tot +16,0 m en daarop een stuk van de oude
// vakwerkligger uit 1868: twee stijlen van 2,6 m met een spleet van 0,6 m,
// aan de buitenkant afgezaagde diagonalen als vleugels, samen 10,6 m lang
// evenwijdig aan de brug en tot NAP +24,5 m hoog (AHN, foto's). Op 1:1000
// is de ligger een plaat van 0,9 m met een V-vormige onderkant naar de paal
// (50 graden), spitse ruitvormige openingen en een spitse spleet.
const MONUMENT = {
  x: -77.42,
  y: -26.95,
  groundNap: 5.9,
  drumR: 2.5,
  drumTopNap: 13.0,
  postR: 0.6,
  postTopNap: 16.0,
  plate: 0.9,
};

// ---------- dek ----------
const mainSection = (x) => {
  const r = railZ(x);
  const { half, edge, depth, bottomHalf } = MAIN_DECK;
  return [[-bottomHalf, r - depth], [bottomHalf, r - depth], [half, r - edge], [half, r], [-half, r], [-half, r - edge]];
};
const approachSection = (x) => {
  const r = railZ(x);
  const { half, lip, web, chamfer, depth, bottomHalf } = APPROACH_DECK;
  return [
    [-bottomHalf, r - depth], [bottomHalf, r - depth], [web, r - chamfer], [web, r - lip - 0.5], [half, r - lip],
    [half, r], [-half, r], [-half, r - lip], [-web, r - lip - 0.5], [-web, r - chamfer],
  ];
};
const mainDeck = loftX(
  range(SOUTH_FACE, PIER_N, 2).map((x) => ({ x, section: mainSection(x) })),
  "hoofddek",
);
// De aanbrug is recht (de spoorstaaf daalt lineair): twee stations volstaan.
const approachDeck = loftX(
  [PIER_N, NORTH_END].map((x) => ({ x, section: approachSection(x) })),
  "aanbrug",
);

// ---------- landhoofden en pijlers ----------
const abutments = [
  boxFromTo(SOUTH_ABUTMENT.x0, SOUTH_ABUTMENT.x1, SOUTH_ABUTMENT.y0, SOUTH_ABUTMENT.y1, BASE, railZ(SOUTH_ABUTMENT.x0) - 0.01),
  boxFromTo(NORTH_ABUTMENT.x0, NORTH_ABUTMENT.x1, NORTH_ABUTMENT.y0, NORTH_ABUTMENT.y1, BASE, railZ(NORTH_ABUTMENT.x1) - 0.01),
];
const bbox = (poly) => {
  const xs = poly.map(([x]) => x);
  const ys = poly.map(([, y]) => y);
  return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
};
const hullPoly = (poly) => new CrossSection([ccw(poly)]).hull().toPolygons()[0].map(([x, y]) => [x, y]);
// Het metselwerk volgt de convexe omhullende van de BGT-vorm, zodat de kraag
// er overal vanaf de wand onder 50 graden uitkraagt.
function masonry(poly, top, kraag) {
  const hull = hullPoly(poly);
  return union([
    prism(hull, BASE, top),
    flare(hull, offsetPoly(hull, kraag), kraag, top - kraag * Math.tan(rad(50)), top + kraag),
  ]);
}
const mainPiers = MAIN_PIERS.map((poly) => {
  const b = bbox(poly);
  const top = Z(MAIN_MASONRY_NAP);
  // De noordelijke rivierpijler draagt ook de lagere kokerligger.
  const deckUnder = b.x1 > PIER_N ? Math.min(mainBottom(PIER_N), approachBottom(PIER_N)) : mainBottom((b.x0 + b.x1) / 2);
  const seat = mainBottom((b.x0 + b.x1) / 2);
  const block = rect(b.x0 + 0.8, b.x1 - 0.8, -8.0, 8.0);
  const cap = rect(b.x0 + 0.4, b.x1 - 0.4, -8.6, 8.6);
  return union([
    masonry(poly, top, MAIN_KRAAG),
    prism(block, top + MAIN_KRAAG - 0.01, Math.min(deckUnder, seat) - 1.2),
    flare(block, cap, 0.6, Math.min(deckUnder, seat) - 1.2, seat + 0.05),
  ]);
});
const approachPiers = APPROACH_PIERS.map((poly) => {
  // Blok en kop op het middendeel van de pijler (het metselwerk binnen de
  // breedte van het blok), niet op de neuzen.
  const mid = new CrossSection([ccw(hullPoly(poly))]).intersect(new CrossSection([rect(-1e4, 1e4, -HEAD.blockHalf, HEAD.blockHalf)])).bounds();
  const b = { x0: mid.min[0], x1: mid.max[0] };
  const xc = (b.x0 + b.x1) / 2;
  const gb = approachBottom(xc);
  const top = gb - HEAD.below;
  const block = rect(b.x0 + 0.6, b.x1 - 0.6, -HEAD.blockHalf, HEAD.blockHalf);
  const cap = rect(b.x0 + 0.3, b.x1 - 0.3, -HEAD.half, HEAD.half);
  return union([
    masonry(poly, top, APPROACH_KRAAG),
    prism(block, top + APPROACH_KRAAG - 0.01, gb - HEAD.cap),
    flare(block, cap, HEAD.half - HEAD.blockHalf, gb - HEAD.cap, gb + HEAD.capTop),
  ]);
});

// ---------- bogen ----------
// Doorsnede per station (y, z), stervormig vanaf de binnenste bovenhoek.
const ribSection = (side, x) => {
  const t = archTop(x);
  const b = archBottom(x);
  const yi = side * ARCH_INNER;
  const yo = side * ARCH_OUTER;
  const yc = side * (ARCH_OUTER - CHAMFER);
  const chamferZ = Math.min(t - 0.05, b + CHAMFER * Math.tan(rad(50)));
  const pts = [[yi, t], [yi, b], [yc, b], [yo, chamferZ], [yo, t]];
  return side > 0 ? pts : [...pts].reverse();
};
const ribXs = range(-ARCH.half, ARCH.half, 0.5);
const ribs = [-1, 1].map((side) =>
  loftX(
    ribXs.map((x) => ({ x, section: ribSection(side, x) })),
    `boog ${side}`,
  ),
);

// ---------- hangerschermen ----------
const openings = [];
for (let i = 0; i + 1 < NODES.length; i++) {
  const a = NODES[i] + HANGER / 2;
  const b = NODES[i + 1] - HANGER / 2;
  let shoulder = Infinity;
  for (let k = 0; k <= 200; k++) {
    const x = a + ((b - a) * k) / 200;
    shoulder = Math.min(shoulder, archBottom(x) - 0.05 - Math.tan(POINTED) * Math.min(x - a, b - x));
  }
  if (shoulder < Math.max(railZ(a), railZ(b)) + 1.0) continue;
  const apex = shoulder + (Math.tan(POINTED) * (b - a)) / 2;
  // De vloer van de opening volgt het spoor, 0,1 m erin (het dek vult dat).
  const floor = range(a, b, 1).map((x) => [x, railZ(x) - 0.1]);
  openings.push({ a, b, floor, shoulder, apex });
}
// Het scherm loopt tot waar de onderkant van de boog het spoor raakt.
function screenEnd(sign) {
  let lo = 0;
  let hi = sign * ARCH.half;
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    if (archBottom(m) > railZ(m) - 0.2) lo = m;
    else hi = m;
  }
  return lo;
}
const SCREEN_X0 = screenEnd(-1);
const SCREEN_X1 = screenEnd(1);
const screenXs = sortedUnique([...range(SCREEN_X0, SCREEN_X1, 0.5), ...NODES]);
const screenOutline = [
  ...screenXs.map((x) => [x, railZ(x) - 0.3]),
  ...[...screenXs].reverse().map((x) => [x, archBottom(x) + 0.3]),
];
const screens = [-1, 1].map((side) => {
  const y0 = side > 0 ? ARCH_INNER - 0.02 : -ARCH_INNER - SCREEN_T;
  const y1 = side > 0 ? ARCH_INNER + SCREEN_T : -ARCH_INNER + 0.02;
  const plate = profileY(screenOutline, y0, y1);
  const holes = openings.map(({ a, b, floor, shoulder, apex }) =>
    profileY([...floor, [b, shoulder], [(a + b) / 2, apex], [a, shoulder]], y0 - 0.5, y1 + 0.5),
  );
  return plate.subtract(union(holes));
});

// ---------- windverband ----------
// Plattegrond: de diagonalen van knoop naar knoop over de twee bogen en de
// eindregels, binnen de binnenvlakken van de bogen (0,1 m overlap).
const BY = ARCH_INNER + 0.1;
const bar = ([x0, y0], [x1, y1], w) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * (w / 2);
  const ny = (dx / len) * (w / 2);
  // Iets voorbij de bogen verlengd; de omhullende knipt af.
  const ex = (dx / len) * 1.5;
  const ey = (dy / len) * 1.5;
  return new CrossSection([
    ccw([
      [x0 - ex + nx, y0 - ey + ny],
      [x1 + ex + nx, y1 + ey + ny],
      [x1 + ex - nx, y1 + ey - ny],
      [x0 - ex - nx, y0 - ey - ny],
    ]),
  ]);
};
let lattice = bar([NODES[0], -BY], [NODES[0], BY], BRACE.endBar).add(bar([NODES[11], -BY], [NODES[11], BY], BRACE.endBar));
for (let i = 0; i + 1 < NODES.length; i++) {
  lattice = lattice
    .add(bar([NODES[i], -ARCH.y], [NODES[i + 1], ARCH.y], BRACE.bar))
    .add(bar([NODES[i], ARCH.y], [NODES[i + 1], -ARCH.y], BRACE.bar));
}
const braceTop = (x) => archTop(x) - BRACE.drop;
const braceUnder = (x, y) => braceTop(x) - BRACE.thick - Math.abs(y) * Math.tan(BRACE.slope);
const braceX0 = NODES[0] - 1.5;
const braceX1 = NODES[11] + 1.5;
const braceEnvelope = loftX(
  range(braceX0, braceX1, 1).map((x) => ({
    x,
    section: [[0, braceUnder(x, 0)], [BY, braceUnder(x, BY)], [BY, braceTop(x)], [-BY, braceTop(x)], [-BY, braceUnder(x, BY)]],
  })),
  "windverband",
);
const latticePrism = Manifold.extrude(lattice, 60).translate([0, 0, 0]);
const bracing = latticePrism.intersect(braceEnvelope);
// Laagste punt van het windverband tegen de bogen, ten opzichte van de
// onderkant van de boog op die plek (moet binnen het dichte deel van het
// hangerscherm vallen, zie de controles).
const braceKnee = NODES.map((x) => +(braceUnder(x, BY) - archBottom(x)).toFixed(2));

const bridge = union([mainDeck, approachDeck, ...abutments, ...mainPiers, ...approachPiers, ...ribs, ...screens, bracing]);

// ---------- monument ----------
const monument = (() => {
  const { x, y, plate } = MONUMENT;
  const drum = Manifold.cylinder(Z(MONUMENT.drumTopNap) - BASE, MONUMENT.drumR, MONUMENT.drumR, 48, false).translate([x, y, BASE]);
  const post = Manifold.cylinder(Z(MONUMENT.postTopNap) - Z(MONUMENT.drumTopNap) + 0.1, MONUMENT.postR, MONUMENT.postR, 24, false).translate([
    x,
    y,
    Z(MONUMENT.drumTopNap) - 0.05,
  ]);
  const t50 = Math.tan(rad(50));
  // Halve buitenlijn (u >= 0) in NAP; de stijl is 2,6 m breed, de vleugel
  // steekt 2,4 m uit.
  const vBottom = 15.0;
  const half = [
    [0.5, vBottom],
    [2.9, vBottom + 2.4 * t50],
    [2.9, 18.5],
    [5.3, 18.5 + 2.4 * t50],
    [5.3, 24.5],
    [2.9, 23.6],
    [0.3, 22.6],
  ];
  const outline = [...half, ...[...half].reverse().map(([u, z]) => [-u, z])].map(([u, z]) => [u, Z(z)]);
  const slot = [[-0.3, Z(17.2)], [0.3, Z(17.2)], [0.3, Z(20.6)], [0, Z(20.6) + 0.3 * t50 + 0.05], [-0.3, Z(20.6)]];
  const diamonds = [-1.6, 1.6].flatMap((u) =>
    [18.0, 20.5].map((zc) => [[u, Z(zc - 0.8)], [u + 0.45, Z(zc)], [u, Z(zc + 0.8)], [u - 0.45, Z(zc)]]),
  );
  const girder = profileY(outline, -plate / 2, plate / 2).subtract(
    union([slot, ...diamonds].map((h) => profileY(h, -plate, plate))),
  );
  return union([drum, post, girder.translate([x, y, 0])]);
})();

// De brug en het monument als geheel; het spoor wordt pas na het printmodel
// uit de brug gesneden (zie "spoor als eigen onderdeel").
const wholeParts = [
  ["building:kuilenburgse-spoorbrug", bridge],
  ["building:monument-oude-spoorbrug", monument],
];

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden die uitloopt in een
// scherm van 0,9 m tot de onderplaat.
const KNEE = rad(50);
const SCREEN = 0.45;
const footXs = sortedUnique([...range(SOUTH_FACE, NORTH_FACE, 1), PIER_N + 1e-3]);
const printFoot = loftX(
  footXs.map((x) => {
    const zb = deckBottom(x) + 0.02;
    const w = deckHalf(x) + 0.02;
    const zs = zb - Math.tan(KNEE) * (w - SCREEN);
    const section =
      zs > BASE + 0.05
        ? [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]]
        : (() => {
            const a = w - (zb - BASE) / Math.tan(KNEE);
            return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
          })();
    return { x, section };
  }),
  "printvoet",
);
const printModel = union([bridge, printFoot, monument]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van het dek, in de printversie niets.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  let deckArea = 0;
  const where = [];
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const yMid = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    if (Math.abs(zMid - deckBottom(xMid)) < 0.1 && Math.abs(yMid) < 7.1) deckArea += len / 2;
    else {
      area += len / 2;
      if (len / 2 > 0.01) where.push([xMid, yMid, zMid].map((c) => +c.toFixed(2)));
    }
  }
  return { area, deckArea, where };
}
for (const [name, solid] of [...wholeParts, ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
const checks = {};
{
  const model = overhangs(bridge);
  const mon = overhangs(monument);
  const print = overhangs(printModel);
  checks.overhangM2 = {
    deck: Math.round(model.deckArea),
    other: +model.area.toFixed(2),
    monument: +(mon.area + mon.deckArea).toFixed(2),
    print: +(print.area + print.deckArea).toFixed(2),
  };
  console.log("vrij hangend (m2):", checks.overhangM2);
  if (model.where.length) console.log("overhang op", model.where.slice(0, 20));
  if (print.where.length) console.log("print: overhang op", print.where.slice(0, 20));
  if (model.area > 0.5 || mon.area + mon.deckArea > 0.5) throw new Error("overhang buiten het dek");
  if (print.area + print.deckArea > 0.5) throw new Error("printversie heeft overhang");
  // Het windverband moet tegen de bogen eindigen binnen het dichte deel van
  // het hangerscherm rond elke hanger (de flanken van de openingen lopen
  // onder 50 graden; de staaf raakt de boog over 0,9 m naast de knoop).
  const spandrel = NODES.map((x) => {
    const left = openings.find(({ b }) => Math.abs(b - (x - HANGER / 2)) < 1e-6);
    const right = openings.find(({ a }) => Math.abs(a - (x + HANGER / 2)) < 1e-6);
    // Hoogte waarop de flank 0,9 m naast de knoop ligt.
    const flankZ = (o, d) => (o ? o.shoulder + Math.tan(POINTED) * (d - HANGER / 2) : -Infinity);
    return Math.max(flankZ(left, 0.9), flankZ(right, 0.9));
  });
  checks.braceKnee = NODES.map((x, i) => ({
    x: +x.toFixed(2),
    kneeBelowArch: -braceKnee[i],
    solidBelowArch: +(archBottom(x) - spandrel[i]).toFixed(2),
  }));
  for (const { x, kneeBelowArch, solidBelowArch } of checks.braceKnee) {
    if (kneeBelowArch > solidBelowArch) throw new Error(`windverband bij x = ${x} hangt onder het dichte scherm`);
  }
  checks.openings = openings.length;
  checks.minFlankDeg = 50;
}

// ---------- spoor als eigen onderdeel ----------
// De bovenste 0,5 m van het dek op het BGT-wegdeel van de brug is een eigen
// node met de attributen van dat wegdeel (glTF `extras.attributes`), zodat de
// kleurregels van een thema (bijvoorbeeld spoor zwart) op het brugdek werken
// zoals op de PDOK-wegdelen ernaast. BGT-wegdeel
// L0004.fdf547dd99eb49ae993f3f716cf44ea0: spoorbaan, gesloten verharding,
// zonder plus-fysiek voorkomen, relatieve hoogteligging 1, van het zuidelijke
// tot het noordelijke landhoofd. Over de boog twee stroken van 1,9 m (de twee
// sporen) met een gat ertussen (|y| < 1,05), daarbuiten tot 4,3 m (boog en
// aanbrug) en 5,8 m (landhoofden) naast de as. Contour in lokale
// coördinaten, vereenvoudigd tot 5 cm; de kopse kanten (in de BGT tot 12 cm
// binnen het dek) zijn 0,5 m voorbij de uiteinden van het dek verlengd, zodat
// daar geen smalle reep constructie op het dek blijft staan.
// Wordt pas hier gebouwd, nadat het printmodel is doorgerekend, zodat de STL
// gelijk blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
const SPOOR_BGT = [
  [214.68, 4.05], [84.7, 4.0], [80.15, 5.34], [78.29, 5.3], [78.31, 4.19], [71.88, 4.21], [72.13, 3.86], [72.09, 2.92],
  [-73.0, 2.94], [-73.02, 3.87], [-72.76, 4.15], [-79.13, 4.14], [-79.13, 5.78], [-80.95, 5.66], [-100.28, 5.71],
  [SOUTH_END - 0.5, 5.71], [SOUTH_END - 0.5, -5.43], [-100.4, -5.43], [-79.09, -5.41], [-79.15, -4.49], [-79.09, -4.49],
  [-79.09, -4.29], [-72.69, -4.29], [-72.98, -3.91], [-72.97, -2.97], [72.11, -2.96], [72.12, -3.89], [71.85, -4.25],
  [78.25, -4.25], [78.28, -5.8], [80.03, -5.8], [85.95, -4.01], [592.2, -3.88], [NORTH_END + 0.5, -3.88],
  [NORTH_END + 0.5, 4.12], [592.14, 4.12], [528.48, 4.05],
];
// Het gat tussen de twee sporen over de boog (geen wegdeel in de BGT).
const SPOOR_BGT_HOLE = [[72.12, -1.05], [-73.02, -1.05], [-73.03, 1.04], [72.11, 1.01]];
// De strook loopt over dezelfde loftstations als het dek, van 0,5 m onder tot
// 1 m boven de spoorstaaf en 0,5 m voorbij de uiteinden van het dek. Op de
// aanbrug (twee stations) en het zuidelijke landhoofd is de spoorstaaf recht;
// daar wordt hij lineair doorgetrokken.
const approachSlope = (railZ(NORTH_END) - railZ(PIER_N)) / (NORTH_END - PIER_N);
const stripZ = (x) => (x > PIER_N ? railZ(PIER_N) + approachSlope * (x - PIER_N) : railZ(x));
const stripXs = [SOUTH_END - 0.5, ...range(SOUTH_FACE, PIER_N, 2), NORTH_END + 0.5];
const strip = loftX(
  stripXs.map((x) => {
    const zt = stripZ(x);
    return { x, section: [[-8, zt - LAYER], [8, zt - LAYER], [8, zt + ABOVE], [-8, zt + ABOVE]] };
  }),
  "spoorstrook",
);
// De hele strook van elke boog met het hangerscherm (ook onder de openingen
// en waar de boog boven het dek hangt) blijft constructie, met 2 cm vrij.
const ribGuards = [-1, 1].map((side) => {
  const y0 = ARCH_INNER - 0.02 - GUARD;
  const y1 = ARCH_OUTER + GUARD;
  return side > 0
    ? boxFromTo(-ARCH.half - GUARD, ARCH.half + GUARD, y0, y1, BASE - 1, 100)
    : boxFromTo(-ARCH.half - GUARD, ARCH.half + GUARD, -y1, -y0, BASE - 1, 100);
});
const spoorArea = prism(SPOOR_BGT, BASE - 1, 100).subtract(prism(SPOOR_BGT_HOLE, BASE - 2, 101));
const spoorCut = strip.intersect(spoorArea).subtract(union(ribGuards));
const track = spoorCut.intersect(bridge);
const structure = bridge.subtract(spoorCut);
const parts = [
  ["building:kuilenburgse-spoorbrug", structure],
  ["building:monument-oude-spoorbrug", monument],
  ["road:spoor", track, SPOOR_ATTRIBUTES],
];
{
  const whole = bridge.volume();
  const sum = structure.volume() + track.volume();
  checks.partitionM3 = {
    bridge: +whole.toFixed(2),
    structure: +structure.volume().toFixed(2),
    track: +track.volume().toFixed(2),
    sumMinusBridge: +(sum - whole).toFixed(4),
  };
  console.log("volumes (m3):", checks.partitionM3);
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
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
    // PDOK-attributen (zoals bij de BGT-wegdelen) voor de kleurregels.
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
for (const [name, solid, attributes] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    ...(attributes ? { attributes } : {}),
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
report.arch = {
  crownNap: +archTopNap(0).toFixed(2),
  endNap: +archTopNap(ARCH.half).toFixed(2),
  hangers: NODES.length,
  nodesX: NODES.map((x) => +x.toFixed(2)),
  openings: openings.length,
  openingApexNap: openings.map(({ apex }) => +(apex + WATER_NAP).toFixed(1)),
  screenX: [+SCREEN_X0.toFixed(2), +SCREEN_X1.toFixed(2)],
};
report.checks = checks;
const glbFile = path.join(outDir, "kuilenburgse-spoorbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-kuilenburgse-spoorbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden, printvoet en
// monument op het printbed.
const stlName = `kuilenburgse-spoorbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Kuilenburgse spoorbrug 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Op de Lek naast de hoofdoverspanning (25 m naast de as) en op de geul die
// bij x = 501,6 onder de aanbrug door loopt.
const samplePoints = [
  ...[-40, 0, 40].flatMap((x) => [
    [x, 25],
    [x, -25],
  ]),
  [501.6, 16.6],
  [501.6, -18.4],
];
await writeFile(
  path.join(outDir, "kuilenburgse-spoorbrug.json"),
  JSON.stringify(
    {
      name: "Kuilenburgse spoorbrug",
      file: "kuilenburgse-spoorbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [143059.41, 441367.07],
      xAxis: [-0.51024, 0.86003],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0216100000016391"],
      replacesTerrain: [
        "L0004.3393bdd7958b42bc87d014025576d0b0",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden tussen de twee rivierpijlers op de waterspiegel van de Lek (z = 0, NAP +2,8 m) in de oorsprong, +X langs de brug naar het noorden (Schalkwijk, RD-richting 120,68 graden vanaf het oosten) en +Y stroomafwaarts naar het westzuidwesten. Drie nodes. Node road:spoor: de bovenste 0,5 m van het dek op het BGT-wegdeel van de brug (spoorbaan L0004.fdf547dd99eb49ae993f3f716cf44ea0: over de boog de twee sporen tussen de bogen met een gat ertussen, daarbuiten tot 4,3 m en op het zuidelijke landhoofd 5,8 m naast de as) met de attributen van dat wegdeel in extras.attributes (bgt_functie spoorbaan, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; de bogen met het hangerscherm blijven constructie. Node building:kuilenburgse-spoorbrug: de rest van de stalen boogbrug van 1983 met het dek van 14 m breed over de hoofdoverspanning tussen de gemetselde rivierpijlers (x = -83,1 tot -73,4 en 73,8 tot 82,2, ronde koppen, zware kraag op NAP +9,0 m, blok en oplegbank), twee kokerbogen van 2 m breed 4,85 m naast de as met de top op NAP +42,8 m, de twaalf hangers om de 11,18 m als scherm met spitse openingen tegen het binnenvlak van de bogen, het windverband van kruisende diagonalen tussen de bogen; de betonnen kokerligger van 10,8 m breed en 4,0 m hoog over tien velden (43 en 61 m) op de oude pijlers met spitse koppen, kraag, betonnen blok en kop tot het noordelijke landhoofd (x = 592,2), en het gemetselde zuidelijke landhoofd vanaf x = -100,4; spoorstaaf NAP +17,3 tot +17,8 m en dalend tot +12,9 m. Node building:monument-oude-spoorbrug: het monument van 1983 op (-77,4, -26,95) met een stuk van de vakwerkligger uit 1868 op een kolom (BAG-pand 0216100000016391, top NAP +24,5 m). Bovenleiding, seinen, leuningen, looprails en de geribde afwerking van de kolom zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de Lek naast de hoofdoverspanning en op de geul onder de aanbrug bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NORTH_END - SOUTH_END).toFixed(1),
        deckWidthM: { main: 2 * MAIN_DECK.half, approach: 2 * APPROACH_DECK.half },
        spansM: [PIER_S, PIER_N, ...APPROACH_PIERS.map((p) => (bbox(p).x0 + bbox(p).x1) / 2), (NORTH_FACE + NORTH_END) / 2]
          .slice(1)
          .map((x, i, xs) => +(x - (i === 0 ? PIER_S : xs[i - 1])).toFixed(1)),
        mainSpanBearingsM: +(2 * ARCH.half).toFixed(1),
        archCrownNapM: ARCH.crownNap,
        archRibsFromAxisM: ARCH.y,
        archBoxM: { width: ARCH.width, depthCrown: ARCH.depth, depthEnds: ARCH.endDepth },
        hangerPanelM: +(NODES[1] - NODES[0]).toFixed(2),
        railNapM: { south: +railNap(SOUTH_END).toFixed(2), crown: RAIL.crown, north: +railNap(NORTH_END).toFixed(2) },
        monumentTopNapM: 24.5,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Kuilenburgse_spoorbrug",
        "PDOK BGT overbruggingsdeel (dek, pijlers, noordelijk landhoofd), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de spoorstaaf, de bogen, het windverband en het monument",
        "PDOK BAG pand 0216100000016391 (monument)",
        "Wikimedia Commons: Kuilenburgse spoorbrug 1-9.jpg, Culemborg - Kuilenburgse spoorbrug 2018 (42943756821).jpg, Culemborg - Kuilenburgse spoorbrug 2018 (28083500957).jpg, Spoorbrug Culemborg1.jpg, NS 1757; Lekbrug Culemborg.jpg, Oude Kuilenburge spoorbrug monument 1-3.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

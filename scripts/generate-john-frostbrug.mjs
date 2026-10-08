// Genereert een vereenvoudigd, gesloten 3D-model van de John Frostbrug
// (Rijnbrug) in Arnhem: de geklonken stalen verkeersbrug over de Nederrijn uit
// 1935, na de vernieling van 1944 in 1950 in dezelfde vorm herbouwd. Een
// verstijfde staafboogbrug ("Langerse brug"): twee doorgaande volwandige
// liggers over drie velden van 50, 120 en 50 m, met boven de middelste
// overspanning een lichte staafboog van 17,5 m aan elke kant van de rijweg,
// verbonden door verticale hangers. Aan de zuidkant een aanbrug van zes velden
// van 42 m met dezelfde liggers op vijf pijlers in de uiterwaard, een zware
// overgangspijler met bordestrappen en het zuidelijke landhoofd; aan de
// noordkant het granieten landhoofd aan de Rijnkade met twee vierkante
// betonnen torens boven trap- en fietsopgangen, en daarachter het betonnen
// viaduct (vier liggers op rijen vierkante kolommen) over de Rijnkade en de
// Oranjewachtstraat. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node per onderdeel met de
// materiaalklasse in de nodenaam: de constructie en het wegdek per BGT-functie
// met PDOK-attributen) als catalogusbron voor de export en de kaart, plus een binaire
// STL in millimeters op 1:<schaal> met een printvoet onder het dek.
//
//   node scripts/generate-john-frostbrug.mjs              # 1:1600 (standaard, 381 mm)
//   node scripts/generate-john-frostbrug.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het dek midden tussen de twee
// rivierpijlers (RD 191034,70, 443068,40), op de waterspiegel van de Rijn
// zoals het PDOK-terrein die legt (NAP +8,25 m), Z omhoog. +X loopt langs de
// brug naar het noordnoordoosten (de binnenstad, RD-richting 59,43 graden
// vanaf het oosten), +Y stroomafwaarts naar het westnoordwesten. De
// rivierpijlers staan op x = -63,0 tot -56,5 en 56,4 tot 63,3, het zuidelijke
// landhoofd begint op x = -378, het viaduct eindigt op x = 231,1.
//
// Bronnen: Rijksmonumentenregister 529907 (indeling 50 + 120 + 50 m, liggers
// van 3,4 tot 4 m hoog met 4 m brede fiets- en voetpaden op consoles erbuiten,
// boog van 17,5 m, ellipsvormige rivierpijlers met spitse koppen, zware
// zuidelijke overgangspijler met bordestrappen, zes aanbrugvelden van 42 m op
// vijf pijlers die in hoogte afnemen, noordelijk landhoofd met twee vierkante
// torens, betonnen viaduct met vier liggers op rijen vierkante kolommen en
// dwarsbalken); Wikipedia (lengte 601 m, breedte 23,8 m); BGT
// overbruggingsdeel (dek, alle pijlers, landhoofden, kolommen en de wand van
// het viaduct); AHN DSM 0,5 m (PDOK WCS) voor het lengteprofiel van het
// wegdek (NAP +17,2 tot +25,4 m), de bovenrand van de bogen (top NAP +42,5 m),
// de ribben op 6,85 m naast de as, de bovenkant van de liggers (0,6 tot 0,8 m
// boven het wegdek), de rivierpijlers (bovenkant NAP +18,9 m), de torens
// (NAP +28,6 m), de bordestrappen en de funderingsplaten in de strang;
// PDOK-luchtfoto voor de torens, de trappen en de funderingsplaten; PDOK-terrein
// voor de waterspiegel (51,87 m ellipsoïdisch; NAP = ellipsoïdisch - 43,62 m op
// het maaiveld eromheen); Wikimedia Commons-foto's voor de hangers (16 velden),
// de boogdoorsnede, de liggers, de pijlers met stalen opleggingen en de torens.
// Geschat: de hoogte van de boogrib (1,2 m), de onderkant van de liggers
// (2,9 m onder het wegdek), de dikte van de consoles aan de rand (0,7 m), de
// hoogte van de opleggingen op de aanbrugpijlers (2,5 m), de onderkant van het
// viaduct (liggers 1,8 m, dwarsbalken 2,8 m onder het wegdek) en de vensters
// in de torens.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1600"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "john-frostbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
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
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Band tussen twee functies van x (onder en boven) op de gegeven stations,
// uitgetrokken langs Y.
const bandXs = (xs, bottom, top, y0, y1) =>
  profileY([...xs.map((x) => [x, bottom(x)]), ...[...xs].reverse().map((x) => [x, top(x)])], y0, y1);
// Polygoon in het XY-vlak, uitgetrokken van z0 tot z1.
const prismZ = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
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
// Pijler met spitse koppen (BGT): rechte zijden op x = xc ± a van y = -b tot
// b, daarbuiten twee cirkelbogen die elkaar in een punt op y = ±(b + L)
// raken (spitsboog, straal (a² + L²) / 2a).
function ogive(xc, a, b, L, yc = 0, steps = 10) {
  const R = (a * a + L * L) / (2 * a);
  const tip = Math.atan2(L, R - a);
  const pts = [];
  for (const sy of [1, -1]) {
    // rechterboog (x > xc) naar de punt, daarna de linkerboog terug
    const right = [];
    const left = [];
    for (let k = 0; k <= steps; k++) {
      const th = (tip * k) / steps;
      right.push([xc + a - R + R * Math.cos(th), b + R * Math.sin(th)]);
      left.push([xc - a + R - R * Math.cos(th), b + R * Math.sin(th)]);
    }
    const half = [...right, ...left.slice(0, -1).reverse()];
    if (sy === 1) pts.push(...half);
    else pts.push(...half.map(([x, y]) => [2 * xc - x, -y]));
  }
  return pts.map(([x, y]) => [x, y + yc]);
}

// ---------- hoofdmaten (boven de waterspiegel, NAP +8,25 m) ----------
// PDOK legt de Rijn bij de brug op 51,86 tot 51,90 m ellipsoïdisch; op het maaiveld
// eromheen ligt het PDOK-terrein 43,62 m boven het AHN (NAP).
const WATER_NAP = 8.25;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de Rijn op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen de aanbrug of het viaduct raakt.
const GROUND_HEIGHT = 51.86;

// Wegdek in NAP-meters om de 4 m vanaf x = -376: 40e percentiel van het
// AHN-DSM over 11 m rond de as en 4 m langs de as, mediaan over 20 m en licht
// gladgestreken (verkeer en de bovenleiding van de trolleybus vallen zo weg).
const DECK_X0 = -376;
const DECK_STEP = 4;
const DECK_NAP = [
  17.23, 17.29, 17.39, 17.48, 17.58, 17.69, 17.8, 17.9, 18.01, 18.11, 18.21, 18.32, 18.42, 18.53,
  18.63, 18.74, 18.85, 18.95, 19.05, 19.16, 19.26, 19.36, 19.46, 19.56, 19.67, 19.77, 19.87, 19.97,
  20.07, 20.17, 20.26, 20.37, 20.46, 20.56, 20.66, 20.76, 20.86, 20.95, 21.05, 21.15, 21.25, 21.35,
  21.44, 21.54, 21.64, 21.75, 21.85, 21.95, 22.06, 22.16, 22.26, 22.36, 22.45, 22.54, 22.64, 22.73,
  22.83, 22.92, 23.02, 23.11, 23.21, 23.3, 23.39, 23.49, 23.59, 23.69, 23.79, 23.89, 23.98, 24.07,
  24.17, 24.27, 24.37, 24.47, 24.57, 24.67, 24.77, 24.88, 24.97, 25.05, 25.11, 25.15, 25.2, 25.24,
  25.28, 25.31, 25.33, 25.35, 25.37, 25.38, 25.38, 25.39, 25.4, 25.41, 25.42, 25.42, 25.42, 25.42,
  25.41, 25.4, 25.39, 25.39, 25.38, 25.36, 25.32, 25.27, 25.21, 25.17, 25.12, 25.07, 24.99, 24.89,
  24.8, 24.71, 24.61, 24.51, 24.41, 24.3, 24.2, 24.09, 23.99, 23.9, 23.82, 23.73, 23.65, 23.55,
  23.45, 23.35, 23.25, 23.16, 23.05, 22.95, 22.85, 22.75, 22.66, 22.56, 22.46, 22.36, 22.26, 22.17,
  22.06, 21.96, 21.86, 21.76, 21.67, 21.57, 21.47, 21.37, 21.28, 21.18, 21.08, 20.97, 20.87, 20.79,
];
function deckZ(x) {
  const f = Math.min(Math.max((x - DECK_X0) / DECK_STEP, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return Z(DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t);
}
// Stations: begin, eind en elke 2 m daartussen op het raster van het
// lengteprofiel, zodat de knikken van het wegdek altijd een station hebben.
function stations(x0, x1, step = 2) {
  const xs = [x0];
  for (let x = DECK_X0 + Math.ceil((x0 - DECK_X0) / step + 1e-9) * step; x < x1 - 1e-6; x += step) {
    if (x - xs[xs.length - 1] > 1e-3) xs.push(x);
  }
  if (x1 - xs[xs.length - 1] > 1e-3) xs.push(x1);
  return xs;
}

// Indeling langs de as (BGT): landhoofden, pijlers en kolommen.
const SOUTH_END = -378.0; // achterkant van het zuidelijke landhoofd (in de toerit)
const SOUTH_FACE = -371.9; // voorzijde van het zuidelijke landhoofd, begin van het dek
const TRANSITION = { x0: -120.0, x1: -107.8, y: 12.4 }; // zuidelijke overgangspijler
const NORTH_ABUTMENT = { x0: 109.1, x1: 117.0 }; // granieten landhoofd aan de Rijnkade
const STEEL_END = 112.0; // de stalen liggers eindigen op het landhoofd
const VIADUCT_END = 222.3; // voorzijde van het landhoofd van het viaduct
const NORTH_END = 231.1; // einde van het model; de toerit loopt in het PDOK-terrein door

// Dek (BGT): 22,6 m breed over de zuidelijke aanbrug, 23,7 m over de
// hoofdbrug, 23,8 m over het viaduct (Wikipedia 23,8 m, register 23,2 m).
const DECK_SEGMENTS = [
  { x0: SOUTH_END, x1: TRANSITION.x0 + 6, y0: -11.45, y1: 11.15, steel: true },
  { x0: TRANSITION.x0 + 6, x1: NORTH_ABUTMENT.x1, y0: -12.0, y1: 11.7, steel: true },
  { x0: NORTH_ABUTMENT.x1, x1: NORTH_END, y0: -12.1, y1: 11.7, steel: false },
];
const deckY = (x) => DECK_SEGMENTS.find(({ x1 }) => x <= x1) ?? DECK_SEGMENTS[DECK_SEGMENTS.length - 1];

// Stalen dek: twee volwandige hoofdliggers (hoedprofiel) op 6,85 m naast de
// as, 1,0 m breed (op 1:1000 de kleinste printbare maat), met de bovenkant
// 0,9 m boven het wegdek (AHN: 0,6 tot 0,8 m) en de onderkant 2,9 m onder het
// wegdek (register: liggers van 3,4 tot 4 m hoog); daartussen de rijweg op
// dwarsdragers. Buiten de liggers de fiets- en voetpaden op consoles: aan de
// rand 0,7 m dik, met een schuine onderkant naar de onderkant van de ligger.
const GIRDER = { y: 6.85, half: 0.5, top: 0.9, depth: 2.9 };
const CONSOLE_EDGE = 0.7;
const deckBottom = (x) => deckZ(x) - GIRDER.depth;
const girderTop = (x) => deckZ(x) + GIRDER.top;

// Betonnen viaduct: dekplaat van 1,0 m, vier liggers van 1,2 m breed tot 1,8 m
// onder het wegdek op de BGT-lijnen van de kolommen, dwarsbalken van 1,2 m
// breed op elke kolomrij tot 2,8 m onder het wegdek (geschat op foto's).
const VIADUCT = { slab: 1.0, girderDepth: 1.8, girderHalf: 0.6, capDepth: 2.8, capHalf: 0.6 };
const VIADUCT_GIRDERS_Y = [-8.17, -2.87, 2.47, 7.79];
const VIADUCT_ROWS = [134.43, 151.5, 167.7, 183.12]; // kolommen van 0,96 m (BGT)
const VIADUCT_COLUMN = 0.96;
const VIADUCT_WALL = { x0: 197.2, x1: 201.2, y0: -8.5, y1: 8.2 }; // wand naast de onderdoorgang
const UNDERPASS_ROWS = [204.8, 218.6]; // kolommen van 1,6 m langs de Oranjewachtstraat (BGT)
const UNDERPASS_Y = [-8.29, -3.0, 2.38, 7.5];
const UNDERPASS_COLUMN = 1.6;

// Rivierpijlers (BGT): 6,5 en 6,9 m dik, met spitse koppen tot 15,9 en
// 16,2 m naast de as; bovenkant NAP +18,9 m (AHN), daarop de stalen
// opleggingen (2,0 × 1,6 m) onder de liggers.
const RIVER_PIERS = [
  { xc: -59.75, a: 3.25, b: 9.0, L: 6.9, top: Z(18.9) },
  { xc: 59.85, a: 3.45, b: 9.0, L: 7.2, top: Z(18.9) },
];
// Aanbrugpijlers (BGT): 4,2 tot 4,5 m dik, recht tot 7,5 m naast de as en
// spits tot 12,2 m. De gemetselde pijler eindigt 2,5 m onder de liggers; daar
// staan twee stalen opleggingen van 1,6 × 1,6 m (foto's), zodat de pijlers
// met het dek in hoogte afnemen.
const APPROACH_PIERS = [
  { xc: -327.93, a: 2.08 },
  { xc: -285.98, a: 2.08 },
  { xc: -243.78, a: 2.1 },
  { xc: -201.94, a: 2.1 },
  { xc: -159.45, a: 2.25 },
];
const PEDESTAL = 2.5;
// Twee aanbrugpijlers staan in de strang op een funderingsplaat met spitse
// koppen tot 21,3 m naast de as (BGT, luchtfoto), bovenkant NAP +10,0 m (AHN).
const FOOTINGS = [
  { xc: -243.8, a: 6.4, b: 11.4, L: 9.9, top: Z(10.0) },
  { xc: -201.95, a: 6.85, b: 11.4, L: 9.8, top: Z(10.0) },
];
// Bordestrappen tegen de overgangspijler (AHN, luchtfoto): aan beide kanten
// een traplichaam van 6,2 m breed van de rand van het dek tot 20,5 m naast de
// as met een halfronde kop; het bordes naast het dek op NAP +23,5 m, de kop
// op NAP +21,0 m.
const STAIRS_SOUTH = { x0: -119.6, x1: -113.4, inner: 11.5, step: 16.0, end: 20.5, upper: Z(23.5), lower: Z(21.0) };
// Torens op het noordelijke landhoofd (AHN, luchtfoto, foto's): 5,2 × 4,5 m
// naast het dek, met een granieten voet tot 1,3 m boven het fietspad, een
// schacht die aan de buitenkanten 0,3 m terugspringt, en een bekroning van
// 1,2 m met een schuine onderkant (50 graden) tot NAP +28,6 m. Vensters en de
// deur naar het fietspad als blinde nissen van 0,35 m.
const TOWER = { x0: 111.4, x1: 116.6, inner: 11.9, outer: 16.4, inset: 0.3, plinth: 1.3, crownBase: Z(27.4), crownTop: Z(28.6) };
const NICHE = 0.35;
// Trappen van de Rijnkade naar het dek ten noorden van de torens (AHN): een
// traplichaam van 3 m breed naast het dek dat van NAP +19,0 m bij de toren
// tot het wegdek op x = 131 stijgt; aan de westkant (+Y) het bordes met de
// herdenkingsplaats op dekhoogte, en aan de zuidkant van beide torens de lage
// trapwangen (NAP +16,0 m).
const STAIRS_NORTH = { x0: 116.6, x1: 131.0, inner: 12.0, outer: 15.0, low: Z(19.0) };
const BALCONY = { x0: 116.6, x1: 120.6 };
const STAIR_WALL = { x0: 109.1, x1: 111.4, inner: 11.9, outer: 16.9, top: Z(16.0) };

// Hoofdboog: twee staafbogen boven de liggers (6,85 m naast de as, AHN), van
// rivierpijler tot rivierpijler (120 m, register). De bovenrand is een
// parabool met de top op NAP +42,5 m (AHN; register: boog van 17,5 m boven het
// wegdek) die bij de pijlers op dekhoogte uitkomt. De boogrib is 1,2 m hoog en
// 1,0 m breed (foto's). Hangers op de 15 knopen van 16 velden van 7,5 m
// (foto's); op 1:1000 is elke hanger een stijl van 1,0 m en de ruimte tussen
// ligger en boog een scherm met spitse openingen (zijden van 55 graden), zoals
// bij de Waalbrug.
const ARCH = { span: 119.6, crown: 42.5, k: 0.00475, depth: 1.2 };
const PANELS = 16;
const HANGER = 1.0;
const POINTED = (55 * Math.PI) / 180;
const upper = (x) => Z(ARCH.crown - ARCH.k * x * x);
const lower = (x) => upper(x) - ARCH.depth;

// ---------- stalen dek ----------
const parts = [];
for (const seg of DECK_SEGMENTS.filter(({ steel }) => steel)) {
  const x0 = Math.max(seg.x0, SOUTH_FACE);
  const x1 = Math.min(seg.x1, STEEL_END);
  const xs = stations(x0, x1);
  // rijweg tussen de liggers
  parts.push(bandXs(xs, deckBottom, deckZ, -GIRDER.y + GIRDER.half - 0.05, GIRDER.y - GIRDER.half + 0.05));
  // de twee hoofdliggers
  for (const side of [-1, 1]) {
    parts.push(
      bandXs(xs, deckBottom, girderTop, side * GIRDER.y - GIRDER.half, side * GIRDER.y + GIRDER.half),
    );
  }
  // consoles met fiets- en voetpad
  const yIn = GIRDER.y; // tot in het midden van de ligger
  parts.push(
    loftX(
      xs.map((x) => ({
        x,
        section: [
          [seg.y0, deckZ(x) - CONSOLE_EDGE],
          [-yIn, deckBottom(x)],
          [-yIn, deckZ(x)],
          [seg.y0, deckZ(x)],
        ],
      })),
    ),
    loftX(
      xs.map((x) => ({
        x,
        section: [
          [yIn, deckBottom(x)],
          [seg.y1, deckZ(x) - CONSOLE_EDGE],
          [seg.y1, deckZ(x)],
          [yIn, deckZ(x)],
        ],
      })),
    ),
  );
}
// Zuidelijk landhoofd (in de toerit) en noordelijk landhoofd tot het wegdek.
for (const [x0, x1] of [
  [SOUTH_END, SOUTH_FACE],
  [NORTH_ABUTMENT.x0, NORTH_ABUTMENT.x1],
]) {
  const { y0, y1 } = deckY(x0 + 0.01);
  parts.push(bandXs(stations(x0, x1), () => BASE, (x) => deckZ(x) - 0.01, y0, y1));
}

// ---------- pijlers ----------
for (const p of RIVER_PIERS) {
  parts.push(prismZ(ogive(p.xc, p.a, p.b, p.L), BASE, p.top));
  for (const side of [-1, 1]) {
    parts.push(
      boxFromTo(p.xc - 1.0, p.xc + 1.0, side * GIRDER.y - 0.8, side * GIRDER.y + 0.8, p.top - 0.05, deckBottom(p.xc) + 0.05),
    );
  }
}
for (const p of APPROACH_PIERS) {
  const top = deckBottom(p.xc) - PEDESTAL;
  parts.push(prismZ(ogive(p.xc, p.a, 7.5, 4.7), BASE, top));
  for (const side of [-1, 1]) {
    parts.push(
      boxFromTo(p.xc - 0.8, p.xc + 0.8, side * GIRDER.y - 0.8, side * GIRDER.y + 0.8, top - 0.05, deckBottom(p.xc) + 0.05),
    );
  }
}
for (const f of FOOTINGS) parts.push(prismZ(ogive(f.xc, f.a, f.b, f.L), BASE, f.top));
// Overgangspijler tot de onderkant van de liggers, met de bordestrappen.
parts.push(
  bandXs(stations(TRANSITION.x0, TRANSITION.x1), () => BASE, (x) => deckBottom(x) + 0.05, -TRANSITION.y, TRANSITION.y),
);
for (const side of [-1, 1]) {
  const s = STAIRS_SOUTH;
  const xc = (s.x0 + s.x1) / 2;
  const r = (s.x1 - s.x0) / 2;
  const yc = s.end - r;
  const lo = (a, b) => [Math.min(side * a, side * b), Math.max(side * a, side * b)];
  const [ya, yb] = lo(s.inner, s.step);
  parts.push(boxFromTo(s.x0, s.x1, ya, yb, BASE, s.upper));
  const [yc0, yc1] = lo(s.step - 0.01, yc);
  parts.push(
    boxFromTo(s.x0, s.x1, yc0, yc1, BASE, s.lower),
    Manifold.cylinder(s.lower - BASE, r, r, 48, false).translate([xc, side * yc, BASE]),
  );
}

// ---------- torens, trappen en bordes op het noordelijke landhoofd ----------
for (const side of [-1, 1]) {
  const T = TOWER;
  const span = (a, b) => [Math.min(side * a, side * b), Math.max(side * a, side * b)];
  const roadAt = deckZ((T.x0 + T.x1) / 2);
  const [p0, p1] = span(T.inner, T.outer);
  const plinth = boxFromTo(T.x0, T.x1, p0, p1, BASE, roadAt + T.plinth);
  const [s0, s1] = span(T.inner, T.outer - T.inset);
  const shaft = boxFromTo(T.x0 + T.inset, T.x1 - T.inset, s0, s1, BASE, T.crownBase + 0.4);
  // bekroning: schacht op crownBase, volle maat 0,4 m hoger (50 graden)
  const crown = Manifold.hull([
    boxFromTo(T.x0 + T.inset, T.x1 - T.inset, s0, s1, T.crownBase, T.crownBase + 0.01),
    boxFromTo(T.x0, T.x1, p0, p1, T.crownBase + 0.36, T.crownTop),
  ]);
  // blinde nissen: venster in de drie buitengevels, deur naar het fietspad
  const sill = roadAt + 2.4;
  const head = roadAt + 4.2;
  const xm = (T.x0 + T.x1) / 2;
  const ym = side * ((T.inner + T.outer - T.inset) / 2);
  const outerFace = side * (T.outer - T.inset);
  const niches = [
    boxFromTo(xm - 0.8, xm + 0.8, outerFace - side * NICHE, outerFace + side * 1, sill, head),
    boxFromTo(T.x0 + T.inset - 1, T.x0 + T.inset + NICHE, ym - 0.7, ym + 0.7, sill, head),
    boxFromTo(T.x1 - T.inset - NICHE, T.x1 - T.inset + 1, ym - 0.7, ym + 0.7, sill, head),
    boxFromTo(xm - 0.6, xm + 0.6, side * T.inner - side * 1, side * (T.inner + NICHE), roadAt - 0.01, roadAt + 2.4),
  ];
  parts.push(union([plinth, shaft, crown]).subtract(union(niches)));
  // lage trapwang aan de rivierkant van de toren
  const [w0, w1] = span(STAIR_WALL.inner, STAIR_WALL.outer);
  parts.push(boxFromTo(STAIR_WALL.x0, STAIR_WALL.x1, w0, w1, BASE, STAIR_WALL.top));
  // trap van de toren naar het dek
  const S = STAIRS_NORTH;
  const [t0, t1] = span(S.inner, S.outer);
  const rampTop = (x) => S.low + ((deckZ(S.x1) - 0.02 - S.low) * (x - S.x0)) / (S.x1 - S.x0);
  parts.push(bandXs([S.x0, S.x1], () => BASE, rampTop, t0, t1));
  if (side === 1) {
    parts.push(bandXs(stations(BALCONY.x0, BALCONY.x1), () => BASE, (x) => deckZ(x) - 0.02, t0, t1));
  }
}

// ---------- betonnen viaduct ----------
{
  const xs = stations(NORTH_ABUTMENT.x1 - 0.5, VIADUCT_END + 0.5);
  const { y0, y1 } = deckY(NORTH_ABUTMENT.x1 + 1);
  parts.push(bandXs(xs, (x) => deckZ(x) - VIADUCT.slab, deckZ, y0, y1));
  for (const y of VIADUCT_GIRDERS_Y) {
    parts.push(
      bandXs(xs, (x) => deckZ(x) - VIADUCT.girderDepth, (x) => deckZ(x) - VIADUCT.slab + 0.05, y - VIADUCT.girderHalf, y + VIADUCT.girderHalf),
    );
  }
  for (const xr of VIADUCT_ROWS) {
    const xsr = [xr - VIADUCT.capHalf, xr + VIADUCT.capHalf];
    parts.push(bandXs(xsr, (x) => deckZ(x) - VIADUCT.capDepth, (x) => deckZ(x) - VIADUCT.girderDepth + 0.05, -9.0, 8.6));
    for (const y of VIADUCT_GIRDERS_Y) {
      const h = VIADUCT_COLUMN / 2;
      parts.push(boxFromTo(xr - h, xr + h, y - h, y + h, BASE, deckZ(xr) - VIADUCT.capDepth + 0.05));
    }
  }
  const W = VIADUCT_WALL;
  parts.push(bandXs([W.x0, W.x1], () => BASE, (x) => deckZ(x) - VIADUCT.girderDepth + 0.05, W.y0, W.y1));
  for (const xr of UNDERPASS_ROWS) {
    for (const y of UNDERPASS_Y) {
      const h = UNDERPASS_COLUMN / 2;
      parts.push(boxFromTo(xr - h, xr + h, y - h, y + h, BASE, deckZ(xr) - VIADUCT.girderDepth + 0.05));
    }
  }
  parts.push(bandXs(stations(VIADUCT_END, NORTH_END), () => BASE, (x) => deckZ(x) - 0.01, y0, y1));
}

// ---------- hoofdboog met hangerscherm ----------
// De boog loopt van de oplegging tot waar zijn bovenrand de bovenkant van de
// ligger raakt (vlak naast de pijler) en zit 0,2 m in de ligger.
function archEnd(side) {
  let lo = 0;
  let hi = side * (ARCH.span / 2 + 2);
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    if (upper(m) > girderTop(m) + 0.05) lo = m;
    else hi = m;
  }
  return lo;
}
const archX0 = archEnd(-1);
const archX1 = archEnd(1);
const panelX = Array.from({ length: PANELS + 1 }, (_, i) => -ARCH.span / 2 + (ARCH.span * i) / PANELS);
const openings = [];
for (let i = 0; i < PANELS; i++) {
  const a = panelX[i] + HANGER / 2;
  const b = panelX[i + 1] - HANGER / 2;
  // Hoogste aanzet van de spitse top die overal onder de onderrand blijft.
  let shoulder = Infinity;
  for (let k = 0; k <= 200; k++) {
    const x = a + ((b - a) * k) / 200;
    shoulder = Math.min(shoulder, lower(x) - 0.05 - Math.tan(POINTED) * Math.min(x - a, b - x));
  }
  const floor = Math.min(girderTop(a), girderTop(b), girderTop((a + b) / 2)) - 0.03;
  if (shoulder < Math.max(girderTop(a), girderTop(b)) + 1.0) continue;
  const apex = shoulder + (Math.tan(POINTED) * (b - a)) / 2;
  openings.push({ a, b, floor, shoulder, apex });
}
const archXs = [
  ...Array.from({ length: Math.round((archX1 - archX0) / 0.5) + 1 }, (_, i) => archX0 + i * 0.5),
  archX1,
]
  .filter((x) => x >= archX0 && x <= archX1)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-3);
for (const side of [-1, 1]) {
  const y0 = side * GIRDER.y - GIRDER.half;
  const y1 = side * GIRDER.y + GIRDER.half;
  const band = bandXs(archXs, (x) => girderTop(x) - 0.2, upper, y0, y1);
  const holes = openings.map(({ a, b, floor, shoulder, apex }) =>
    profileY(
      [[a, floor], [b, floor], [b, shoulder], [(a + b) / 2, apex], [a, shoulder]],
      y0 - 0.5,
      y1 + 0.5,
    ),
  );
  parts.push(band.subtract(union(holes)));
}

const bridge = union(parts);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden vanaf de randen van het
// dek (onderkant van de consoles, of van de dekplaat van het viaduct) die
// uitloopt in een scherm van 0,9 m tot de onderplaat.
const SCREEN = 0.45;
const KNEE = (50 * Math.PI) / 180;
const edgeBottom = (x) => deckZ(x) - (x <= NORTH_ABUTMENT.x1 ? CONSOLE_EDGE : VIADUCT.slab);
const footSteps = Math.round(VIADUCT_END - SOUTH_FACE);
const footXs = [
  ...Array.from({ length: footSteps + 1 }, (_, i) => SOUTH_FACE + ((VIADUCT_END - SOUTH_FACE) * i) / footSteps),
  ...DECK_SEGMENTS.flatMap(({ x1 }) => [x1, x1 + 1e-3]),
  SOUTH_FACE,
  VIADUCT_END,
]
  .map((x) => Math.min(Math.max(x, SOUTH_FACE), VIADUCT_END))
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-4);
const printFoot = loftX(
  footXs.map((x) => {
    const zb = edgeBottom(x) + 0.02;
    const { y0, y1 } = deckY(x);
    const yc = (y0 + y1) / 2;
    const w = (y1 - y0) / 2 + 0.02;
    const zs = zb - Math.tan(KNEE) * (w - SCREEN);
    const section =
      zs > BASE + 0.05
        ? [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]]
        : (() => {
            const a = w - (zb - BASE) / Math.tan(KNEE);
            return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
          })();
    return { x, section: section.map(([y, z]) => [y + yc, z]) };
  }),
);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    found.push(p);
  }
  return { area, found };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  const { area } = overhangs(bridge);
  console.log("vrij hangend in het model (m2):", Math.round(area));
  const print = overhangs(printModel);
  // Wat overblijft zijn de bovenkanten van de blinde nissen in de torens
  // (0,35 m diep, toegestaan) en kleine facetten.
  const rest = print.found.filter((p) => {
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    return !(xm > TOWER.x0 - 1.1 && xm < TOWER.x1 + 1.1);
  });
  let restArea = 0;
  for (const p of rest) {
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    restArea += Math.hypot(e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]) / 2;
  }
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2), "buiten de torens:", +restArea.toFixed(2));
  if (restArea > 1) throw new Error("printversie heeft overhang buiten de nissen van de torens");
}

// ---------- wegdek als eigen onderdelen met PDOK-attributen ----------
// De bovenste 0,5 m van het dek is per functie een eigen node met de
// attributen van het BGT-wegdeel (glTF `extras.attributes`), zodat de
// kleurregels van een thema op het brugdek werken zoals op de PDOK-wegdelen.
// Pas hier, nadat het printmodel hierboven is doorgerekend, zodat de STL
// gelijk blijft. Actuele BGT-wegdelen met relatieve hoogteligging 1 op het
// dek (lokaal stelsel, vereenvoudigd tot 5 cm):
// - G0202.2af034b6819e12c4e05343604191f184 (x = -371,7 tot 56,6) en
//   G0202.2af034b9c9ae12c4e05343604191f184 (56,5 tot 231,0): rijbaan regionale
//   weg, gesloten verharding, asfalt;
// - G0202.bdb74c88fe9f1488e0537260419161d0 en
//   G0202.bdb74c88fe971488e0537260419161d0: OV-baan (de busbaan aan de
//   oostkant van de rijweg), gesloten verharding, asfalt;
// - G0202.2af034b7b8aa12c4e05343604191f184, G0202.2af034b9cbb712c4e05343604191f184
//   (zuidelijke aanbrug), G0202.2af034b9c9ad12c4e05343604191f184,
//   G0202.2af034b9465712c4e05343604191f184 (hoofdbrug) en
//   G0202.2af034b6457c12c4e05343604191f184 (oostkant van landhoofd en
//   viaduct): fietspad, gesloten verharding, asfalt;
// - G0202.2af034b9c9af12c4e05343604191f184 (westkant van landhoofd en
//   viaduct): fietspad, gesloten verharding, zonder materiaal.
// Over de stalen brug scheiden de hoofdliggers de rijweg van de fiets- en
// voetpaden op de consoles; de BGT-randen liggen daar 0,1 tot 0,6 m naast de
// liggers van het model, dus is het fietspad daar alles buiten de liggers. Op
// het landhoofd en het viaduct (geen liggers) gelden de binnenranden van de
// BGT-fietspaden; hun buitenrand ligt naast de torens 0,1 tot 0,4 m binnen de
// dekrand en gaat hier tot de dekrand door. De OV-baan ligt tussen de oostelijke
// ligger (of het fietspad) en de BGT-grens met de rijbaan; de rijbaan is de rest
// van de strook.
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = {
  bgt_functie: "rijbaan regionale weg",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BUS_ATTRIBUTES = { bgt_functie: "OV-baan", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_VIADUCT_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
// Grens tussen OV-baan en rijbaan (gedeelde rand van de BGT-vlakken).
const BUS_EDGE = [[-371.49, -2.8], [-78.68, -2.84], [56.51, -2.94], [206.35, -2.96], [230.96, -3.14]];
// Binnenranden van de fietspaden op landhoofd en viaduct (BGT).
const BIKE_WEST_EDGE = [[111.15, 5.85], [230.93, 5.87]];
const BIKE_EAST_EDGE = [[111.2, -6.21], [230.97, -6.22]];
// Rand tot voorbij het begin en einde van de strook doorgetrokken.
const stretch = (edge) =>
  edge.map(([x, y], i) => [i === 0 ? SOUTH_FACE - 2 : i === edge.length - 1 ? NORTH_END + 2 : x, y]);
const FAR = 30;
const prism = (poly) => prismZ(poly, BASE - 1, 100);
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek over dezelfde stations
// als het dek, 0,2 m breder dan het dek (de randen vallen zo niet samen met
// de dekranden); per dekbreedte een stuk.
function topStrip(x0, x1, y0, y1) {
  return loftX(
    stations(x0, x1).map((x) => {
      const zt = deckZ(x);
      return { x, section: [[y0, zt - LAYER], [y1, zt - LAYER], [y1, zt + ABOVE], [y0, zt + ABOVE]] };
    }),
  );
}
const [seg1, seg2, seg3] = DECK_SEGMENTS;
const strip = union([
  // begint 0,5 m op het zuidelijke landhoofd, voorbij de trede van 1 cm
  topStrip(SOUTH_FACE - 0.5, seg1.x1 + 0.01, seg1.y0 - 0.2, seg1.y1 + 0.2),
  topStrip(seg2.x0, seg2.x1 + 0.01, seg2.y0 - 0.2, seg2.y1 + 0.2),
  topStrip(seg3.x0, NORTH_END + 0.5, seg3.y0 - 0.2, seg3.y1 + 0.2),
]);
// Wat boven het dek uitsteekt blijft constructie, met 2 cm vrij: de
// hoofdliggers met de bogen en het hangerscherm erop (de hele strook van de
// ligger), de bordestrappen, de torens en de trappen ten noorden ervan (die
// naast het dek tot vlak onder het wegdek komen).
const UP = 100;
const guards = [];
for (const side of [-1, 1]) {
  const span = (a, b) => [Math.min(side * a, side * b), Math.max(side * a, side * b)];
  const [g0, g1] = span(GIRDER.y - GIRDER.half - 0.02, GIRDER.y + GIRDER.half + 0.02);
  guards.push(boxFromTo(SOUTH_FACE - 0.02, STEEL_END + 0.02, g0, g1, BASE - 1, UP));
  const [s0, s1] = span(STAIRS_SOUTH.inner - 0.02, STAIRS_SOUTH.end + 0.5);
  guards.push(boxFromTo(STAIRS_SOUTH.x0 - 0.02, STAIRS_SOUTH.x1 + 0.02, s0, s1, BASE - 1, UP));
  const [t0, t1] = span(TOWER.inner - 0.02, TOWER.outer + 0.5);
  guards.push(boxFromTo(TOWER.x0 - 0.02, TOWER.x1 + 0.02, t0, t1, BASE - 1, UP));
  const [n0, n1] = span(STAIRS_NORTH.inner - 0.02, STAIRS_NORTH.outer + 0.5);
  guards.push(boxFromTo(STAIRS_NORTH.x0 - 0.02, STAIRS_NORTH.x1 + 0.02, n0, n1, BASE - 1, UP));
}
const roadStrip = strip.subtract(union(guards));
// Zones: over de stalen brug (tot het einde van de liggers) het fietspad
// buiten de liggers, daarna de BGT-binnenranden.
const steelX0 = SOUTH_FACE - 2;
const bikeSteel = union([-1, 1].map((side) => boxFromTo(steelX0, STEEL_END, side * GIRDER.y, side * FAR, BASE - 1, UP)));
const steelZone = boxFromTo(steelX0 - 1, STEEL_END, -FAR, FAR, BASE - 2, UP + 1);
const [west0, west1] = BIKE_WEST_EDGE;
const [east0, east1] = BIKE_EAST_EDGE;
const bikeWest = prism([west0, [NORTH_END + 2, west1[1]], [NORTH_END + 2, FAR], [west0[0], FAR]]).subtract(steelZone);
const bikeEast = prism([[east0[0], -FAR], [NORTH_END + 2, -FAR], [NORTH_END + 2, east1[1]], east0]).subtract(steelZone);
const bikeZone = union([bikeSteel, bikeEast]);
const busZone = prism([[steelX0, -FAR], [NORTH_END + 2, -FAR], ...stretch(BUS_EDGE).reverse()]).subtract(
  union([bikeZone, bikeWest]),
);
const bikeCut = roadStrip.intersect(bikeZone);
const bikeViaductCut = roadStrip.intersect(bikeWest);
const busCut = roadStrip.intersect(busZone);
const roadCut = roadStrip.subtract(union([bikeZone, bikeWest, busZone]));
const structure = bridge.subtract(roadStrip);
const roadParts = [
  ["road:rijbaan", roadCut.intersect(bridge), ROAD_ATTRIBUTES],
  ["road:ov-baan", busCut.intersect(bridge), BUS_ATTRIBUTES],
  ["road:fietspad", bikeCut.intersect(bridge), BIKE_ATTRIBUTES],
  ["road:fietspad-viaduct", bikeViaductCut.intersect(bridge), BIKE_VIADUCT_ATTRIBUTES],
];
const namedParts = [["building:john-frostbrug", structure], ...roadParts];
{
  // De onderdelen vullen de brug zonder overlap.
  const sum = namedParts.reduce((s, [, solid]) => s + solid.volume(), 0);
  const whole = bridge.volume();
  console.log("volume brug (m3):", whole.toFixed(2), "som onderdelen:", sum.toFixed(2), "verschil:", (sum - whole).toFixed(4));
  if (Math.abs(sum - whole) > 0.5) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of namedParts) {
    if (solid.status() !== "NoError" || solid.isEmpty()) throw new Error(`${name}: ${solid.status()}`);
  }
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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
function toGlb(namedSolids, generator) {
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
  for (const [name, solid, attributes] of namedSolids) {
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
for (const [name, solid] of namedParts) {
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
report.arch = {
  crownNap: ARCH.crown,
  ends: [+archX0.toFixed(2), +archX1.toFixed(2)],
  hangers: PANELS - 1,
  openings: openings.length,
  openingApexNap: openings.map(({ apex }) => +(apex + WATER_NAP).toFixed(1)),
};
report.deckNap = {
  south: DECK_NAP[0],
  crest: DECK_NAP.reduce((m, v) => Math.max(m, v), -Infinity),
  north: DECK_NAP[DECK_NAP.length - 1],
};
const glbFile = path.join(outDir, "john-frostbrug.glb");
await writeFile(glbFile, toGlb(namedParts, "NederPrint generate-john-frostbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: namedParts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `john-frostbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint John Frostbrug Arnhem 1:${scale} mm Z-up`);
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
const samplePoints = [-45, -15, 15].flatMap((x) => [
  [x, 22],
  [x, -22],
]);
await writeFile(
  path.join(outDir, "john-frostbrug.json"),
  JSON.stringify(
    {
      name: "John Frostbrug",
      file: "john-frostbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [191034.7, 443068.4],
      xAxis: [0.50843, 0.8611],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      // Op het water van de Rijn naast de hoofdoverspanning, aan beide zijden.
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden tussen de twee rivierpijlers op de waterspiegel van de Rijn (z = 0, NAP +8,25 m zoals het PDOK-terrein) in de oorsprong, +X langs de brug naar het noordnoordoosten (de binnenstad, RD-richting 59,43 graden vanaf het oosten) en +Y stroomafwaarts naar het westnoordwesten. Vijf nodes: road:rijbaan, road:ov-baan, road:fietspad en road:fietspad-viaduct, de bovenste 0,5 m van het wegdek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan regionale weg, OV-baan of fietspad; bgt_fysiekvoorkomen gesloten verharding; plus_fysiekvoorkomen asfalt, behalve op het fietspad aan de westkant van landhoofd en viaduct, waar de BGT geen materiaal geeft), zodat de kleurregels van een thema erop werken (het fietspad is over de stalen brug alles buiten de hoofdliggers, de OV-baan de busbaan aan de oostkant van de rijweg); en building: de rest van de brug, met het stalen dek van 22,6 tot 23,7 m breed van het zuidelijke landhoofd (x = -378) tot het noordelijke landhoofd aan de Rijnkade (x = 109 tot 117), met de twee hoofdliggers als ribbels van 0,9 m boven het wegdek en de fiets- en voetpaden op consoles erbuiten, het wegdek op NAP +17,2 tot +25,4 m (AHN); de verstijfde staafboog van 120 m tussen de rivierpijlers als twee bogen van 1,2 m op de liggers met de top op NAP +42,5 m en de 15 hangers als scherm met spitse openingen tussen ligger en boog; de twee rivierpijlers met spitse koppen (BGT) en stalen opleggingen; aan de zuidkant zes velden van 42 m op vijf aanbrugpijlers met opleggingen (twee op een funderingsplaat in de strang) en de overgangspijler met halfronde bordestrappen; op het noordelijke landhoofd de twee vierkante torens tot NAP +28,6 m met de trappen naar het dek en het bordes van de herdenkingsplaats; het betonnen viaduct over de Rijnkade en de Oranjewachtstraat met vier liggers, dwarsbalken en vierkante kolommen (BGT) tot x = 231. Het windverband tussen de bogen, de eindportalen, leuningen, lantaarns en de S-vormige trappen achter het viaduct zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water van de Rijn bemonsterd; groundHeight is de ellipsoïdische PDOK-hoogte van dat water. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NORTH_END - SOUTH_END).toFixed(1),
        deckWidthM: DECK_SEGMENTS.map(({ y0, y1 }) => +(y1 - y0).toFixed(1)),
        spansM: { approach: "6 × 42", side: 54, main: ARCH.span, northSide: 53 },
        archCrownNapM: ARCH.crown,
        archRiseAboveDeckM: 17.1,
        archRibsFromAxisM: GIRDER.y,
        hangerPanelM: +(ARCH.span / PANELS).toFixed(2),
        riverPierTopNapM: 18.9,
        towerTopNapM: 28.6,
        deckNapM: report.deckNap,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/John_Frostbrug",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/529907",
        "PDOK BGT overbruggingsdeel (dek, rivierpijlers, overgangspijler, aanbrugpijlers met funderingsplaten, landhoofden, kolommen en wand van het viaduct), EPSG:28992",
        "PDOK BGT wegdeel (OGC API, actuele versies met relatieve hoogteligging 1): rijbaan regionale weg, OV-baan en fietspaden op het dek, met hun attributen op de road-nodes",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de liggers, de bogen, de rivierpijlers, de torens, de trappen en het maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR) voor de torens, de trappen en de funderingsplaten; PDOK-terrein voor de waterspiegel",
        "Wikimedia Commons: Arnhem, de John Frostbrug RM529907 vanaf Arnhem Zuid IMG 8947 2019-03-31 20.13.jpg; Arnhem, de John Frostbrug RM529907 met uiterwaarden IMG 3811 2024-07-15 13.08.jpg; John Frostbrug Arnhem vanaf het noorden 22-04-2019.jpg; Overzicht van de brug met brugwachtershuizen - Arnhem - 20420259 - RCE.jpg; Overzicht van de John Frostbrug over de Nederrijn - Arnhem - 20420263 - RCE.jpg; Arnhem, John Frost Bridge 2025-07-09 01.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

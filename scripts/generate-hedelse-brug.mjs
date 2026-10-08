// Genereert een vereenvoudigd, gesloten 3D-model van de Hedelse brug: de
// stalen boogbrug uit 1937 over de Maas tussen Hedel en 's-Hertogenbosch
// (Oude Rijksweg, tot 1970 de A2), met de boog met trekband van 124,8 m (twee
// boogribben aan de randen van het dek met hangers), de twee rivierpijlers,
// twee aanbruggen aan de zuidkant en vijf aan de noordkant (liggerbruggen op
// pijlers in de uiterwaard) en de twee landhoofden. Er ligt één brug: de A2
// kruist de Maas sinds 1970 elders, de Hedelse spoorbrug ligt 400 m
// stroomopwaarts (eigen model). Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal> met een printvoet
// onder het dek.
//
//   node scripts/generate-hedelse-brug.mjs              # 1:1250 (standaard)
//   node scripts/generate-hedelse-brug.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het BGT-dek midden onder de boog
// (RD 146802,10, 416790,88), op de waterspiegel van de Maas (NAP +1,1 m), Z
// omhoog. +X loopt langs de brug naar het noorden (Hedel, RD-richting 99,31
// graden vanaf het oosten), +Y stroomafwaarts naar het westen. De zuidelijke
// rivierpijler staat op x = -64,1 tot -58,6, de noordelijke op x = 62,1 tot
// 67,6; het zuidelijke landhoofd begint op x = -163, het noordelijke eindigt op
// x = 297.
//
// Bronnen: BGT overbruggingsdeel (dek 18,2 m breed onder de boog en 16,5 m
// over de aanbruggen van x = -150,9 tot 284,8, rivierpijlers van 5,5 × 26 m,
// vier aanbrugpijlers van 4,7 × 17 m aan de noordkant); AHN DSM 0,5 m (PDOK
// WCS) voor het lengteprofiel van het wegdek (NAP +13,1 tot +14,4 m), de
// bovenrand van de boogribben (top NAP +34,1 m, kruising met het wegdek 60,5 m
// uit het midden) en hun ligging aan de randen van het dek; PDOK-luchtfoto
// voor de 11 hangers (velden van 10,4 m); Wikipedia (nl, en) en Structurae
// voor de indeling (5 × 43,5 m, 124,76 m, 2 × 43,5 m, totaal 436 m) en de
// onderkant van de boog (NAP +11,40 m); PDOK-terrein voor de waterspiegel
// (44,64 m ellipsoïdisch, NAP = ellipsoïdisch - 43,55 m in de uiterwaard);
// Wikimedia Commons-foto (Zichtopbrughedel.jpg) voor de boogribben, de
// hangers en de liggers van de aanbruggen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1250"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hedelse-brug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
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
// Band tussen twee functies van x (onder en boven), uitgetrokken langs Y.
function bandY(x0, x1, bottom, top, y0, y1, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    pts.push([x, bottom(x)]);
  }
  for (let i = steps; i >= 0; i--) {
    const x = x0 + ((x1 - x0) * i) / steps;
    pts.push([x, top(x)]);
  }
  return profileY(pts, y0, y1);
}
// Plattegrond (BGT, lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
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

// ---------- hoofdmaten (boven de waterspiegel, NAP +1,1 m) ----------
// PDOK legt de Maas bij Hedel op 44,64 m ellipsoïdisch; in de uiterwaard
// ligt het PDOK-terrein 43,55 m boven het AHN (NAP), dus de waterspiegel ligt
// op circa NAP +1,1 m.
const WATER_NAP = 1.1;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de Maas op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een aanbrug raakt.
const GROUND_HEIGHT = 44.64;

// Wegdek in NAP-meters om de 2 m vanaf x = -162: 25e percentiel van het
// AHN-DSM over 10 m rond de as, mediaan over 14 m en licht gladgestreken (de
// windverbanden van de boog en het verkeer vallen zo weg).
const DECK_X0 = -162;
const DECK_NAP = [
  13.14, 13.14, 13.15, 13.17, 13.18, 13.20, 13.22, 13.24, 13.27, 13.30, 13.32, 13.35, 13.38, 13.41,
  13.44, 13.47, 13.49, 13.52, 13.55, 13.58, 13.60, 13.62, 13.65, 13.67, 13.69, 13.71, 13.72, 13.74,
  13.76, 13.78, 13.80, 13.82, 13.84, 13.86, 13.87, 13.89, 13.91, 13.92, 13.94, 13.96, 13.98, 13.99,
  14.01, 14.02, 14.04, 14.05, 14.06, 14.08, 14.09, 14.10, 14.12, 14.13, 14.14, 14.15, 14.17, 14.18,
  14.20, 14.22, 14.23, 14.24, 14.26, 14.28, 14.29, 14.30, 14.32, 14.33, 14.34, 14.35, 14.36, 14.37,
  14.38, 14.39, 14.40, 14.41, 14.42, 14.42, 14.42, 14.43, 14.43, 14.43, 14.43, 14.43, 14.42, 14.42,
  14.42, 14.42, 14.42, 14.42, 14.41, 14.41, 14.40, 14.40, 14.39, 14.38, 14.38, 14.37, 14.36, 14.35,
  14.34, 14.33, 14.32, 14.31, 14.30, 14.28, 14.27, 14.25, 14.23, 14.22, 14.20, 14.19, 14.17, 14.15,
  14.14, 14.13, 14.12, 14.10, 14.09, 14.07, 14.06, 14.05, 14.04, 14.03, 14.02, 14.01, 14.00, 13.99,
  13.98, 13.97, 13.96, 13.95, 13.94, 13.93, 13.92, 13.91, 13.90, 13.89, 13.88, 13.87, 13.86, 13.85,
  13.84, 13.83, 13.82, 13.81, 13.80, 13.79, 13.78, 13.76, 13.75, 13.74, 13.73, 13.72, 13.71, 13.70,
  13.70, 13.69, 13.68, 13.67, 13.66, 13.65, 13.64, 13.63, 13.62, 13.61, 13.59, 13.58, 13.57, 13.56,
  13.54, 13.53, 13.52, 13.51, 13.50, 13.49, 13.48, 13.46, 13.45, 13.44, 13.43, 13.42, 13.41, 13.40,
  13.39, 13.38, 13.37, 13.36, 13.35, 13.34, 13.33, 13.32, 13.30, 13.29, 13.28, 13.27, 13.25, 13.24,
  13.23, 13.22, 13.21, 13.20, 13.19, 13.18, 13.17, 13.16, 13.14, 13.13, 13.11, 13.10, 13.09, 13.08,
  13.07, 13.06, 13.06, 13.05, 13.03, 13.02, 13.00, 12.99, 12.97, 12.96, 12.95, 12.94, 12.93, 12.92,
  12.92, 12.91, 12.90, 12.89, 12.88, 12.87
];
function deckZ(x) {
  const f = Math.min(Math.max((x - DECK_X0) / 2, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return Z(DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t);
}

// Dek (BGT): 16,5 m breed over de aanbruggen, 18,2 m onder de boog (de
// boogribben staan op de randen, de fietspaden liggen binnen de ribben).
// Constructiehoogte onder de boog 2,8 m (de onderkant ligt volgens Wikipedia
// op NAP +11,40 m), over de aanbruggen 2,5 m (geschat op de foto).
const SOUTH_FACE = -150.93; // einde van het BGT-dek aan de zuidkant
const NORTH_FACE = 284.8; // einde van het BGT-dek aan de noordkant
const SOUTH_END = -163.0; // achterkant van het zuidelijke landhoofd (waar het AHN-maaiveld het wegdek bereikt)
const NORTH_END = 297.0;
const DECK_SEGMENTS = [
  { x0: SOUTH_FACE, x1: -61.7, y0: -8.1, y1: 8.4, depth: 2.5 },
  { x0: -61.7, x1: 64.95, y0: -8.93, y1: 9.3, depth: 2.8 },
  { x0: 64.95, x1: NORTH_FACE, y0: -8.15, y1: 8.5, depth: 2.5 },
];
const deckY = (x) => DECK_SEGMENTS.find(({ x1 }) => x <= x1) ?? DECK_SEGMENTS[DECK_SEGMENTS.length - 1];
const deckBottom = (x) => deckZ(x) - deckY(x).depth;

// Pijlers (BGT, lokale coördinaten): twee rivierpijlers van 5,5 × 26 m met
// ronde koppen en vier aanbrugpijlers van 4,7 × 17 m aan de noordkant. De
// zuidelijke aanbrug heeft volgens Structurae twee velden van 43,5 m; de
// tussenpijler staat niet in de BGT en is een kopie van de eerste
// noordelijke aanbrugpijler midden tussen rivierpijler en landhoofd.
const RIVER_PIER_SOUTH = [
  [-58.78, -9.98], [-58.62, 10.1], [-58.65, 11.18], [-59.12, 12.07], [-59.8, 12.75], [-60.47, 13.09],
  [-61.63, 13.21], [-62.47, 13.03], [-63.27, 12.46], [-63.86, 11.66], [-64.11, 10.67], [-64.04, -9.63],
  [-64.07, -10.44], [-63.8, -11.47], [-63.09, -12.28], [-62.22, -12.7], [-60.85, -12.81], [-59.89, -12.32],
  [-59.28, -11.7], [-58.89, -10.95],
];
const RIVER_PIER_NORTH = [
  [67.6, 10.15], [67.57, 11.24], [67.1, 12.13], [66.42, 12.8], [65.75, 13.14], [64.59, 13.27],
  [63.75, 13.09], [62.95, 12.52], [62.36, 11.71], [62.11, 10.72], [62.18, -9.58], [62.15, -10.38],
  [62.43, -11.41], [63.13, -12.23], [64.0, -12.65], [65.37, -12.75], [66.33, -12.26], [66.94, -11.64],
  [67.33, -10.89], [67.44, -9.93],
];
const APPROACH_PIER = [
  [108.49, -5.1], [109.0, -7.25], [109.45, -7.97], [110.18, -8.39], [111.25, -8.46], [112.13, -8.17],
  [112.78, -7.71], [113.08, -6.89], [113.12, -1.92], [113.19, 6.7], [112.78, 7.53], [112.08, 8.09],
  [111.43, 8.43], [110.83, 8.43], [110.18, 8.14], [109.62, 7.79], [109.01, 7.15], [108.84, 6.71],
  [108.59, -1.88], [108.57, -2.38],
];
const APPROACH_PIER_X = [110.84, 153.88, 198.85, 236.85]; // harten (BGT)
const SOUTH_APPROACH_PIER_X = (-61.35 + SOUTH_FACE) / 2; // geschat
const PIERS = [
  RIVER_PIER_SOUTH,
  RIVER_PIER_NORTH,
  ...[SOUTH_APPROACH_PIER_X, ...APPROACH_PIER_X].map((xc) => APPROACH_PIER.map(([x, y]) => [x - 110.84 + xc, y])),
];

// Boog met trekband: twee boogribben (kokers van 1,2 m breed en 2,0 m hoog,
// foto) op de randen van het dek onder de boog. De bovenrand is een parabool
// met de top op NAP +34,1 m in het midden die het wegdek 60,5 m uit het
// midden kruist (AHN); de opleggingen liggen 124,76 m uit elkaar
// (Structurae). Tussen dek en rib hangen 11 hangers op velden van 10,4 m
// (luchtfoto: de dwarsbalken van het windverband); op 1:1000 is elke hanger
// een stijl van 1,2 m en de ruimte tussen dek en rib een scherm met spitse
// openingen (zijden van 55 graden) tot onder de rib.
const ARCH = { half: 62.38, crown: 34.1, crossX: 60.5, depth: 2.0 };
const RIBS = [
  [-8.93, -7.73],
  [8.1, 9.3],
];
const ARCH_RISE = Z(ARCH.crown) - (deckZ(-ARCH.crossX) + deckZ(ARCH.crossX)) / 2;
const upper = (x) => Z(ARCH.crown) - ARCH_RISE * (Math.min(Math.abs(x), ARCH.half) / ARCH.crossX) ** 2;
const lower = (x) => upper(x) - ARCH.depth;
const PANELS = 12;
const HANGER = 1.2;
const POINTED = (55 * Math.PI) / 180;

// ---------- dek, pijlers, landhoofden ----------
// Over de aanbruggen steekt het dek (1,0 m dik) 1,4 m buiten de liggers uit,
// zodat de liggers als teruggezette wand onder de dekrand zichtbaar zijn
// (foto); onder de boog loopt de trekband tot de onderkant door.
const SLAB = 1.0;
const GIRDER_INSET = 1.4;
const deck = union(
  DECK_SEGMENTS.flatMap(({ x0, x1, y0, y1, depth }, i) =>
    i === 1
      ? [bandY(x0, x1, (x) => deckZ(x) - depth, deckZ, y0, y1, Math.round((x1 - x0) / 2))]
      : [
          bandY(x0, x1, (x) => deckZ(x) - SLAB, deckZ, y0, y1, Math.round((x1 - x0) / 2)),
          bandY(x0, x1, (x) => deckZ(x) - depth, (x) => deckZ(x) - SLAB + 0.01, y0 + GIRDER_INSET, y1 - GIRDER_INSET, Math.round((x1 - x0) / 2)),
        ],
  ),
);
const piers = PIERS.map((poly) => {
  const xc = poly.reduce((s, [x]) => s + x, 0) / poly.length;
  return prism(poly, BASE, deckBottom(xc) + 0.1);
});
const abutments = [
  bandY(SOUTH_END, SOUTH_FACE, () => BASE, (x) => deckZ(x) - 0.01, DECK_SEGMENTS[0].y0, DECK_SEGMENTS[0].y1, 4),
  bandY(NORTH_FACE, NORTH_END, () => BASE, (x) => deckZ(x) - 0.01, DECK_SEGMENTS[2].y0, DECK_SEGMENTS[2].y1, 4),
];

// ---------- boog ----------
// De ribben lopen als band van de onderkant van het dek tot de bovenrand van
// de rib; tussen de hangers zijn spitse openingen uitgespaard.
const ribXs = Array.from({ length: Math.round((2 * ARCH.half) / 0.5) + 1 }, (_, i) => -ARCH.half + i * 0.5);
const panelX = Array.from({ length: PANELS + 1 }, (_, i) => -ARCH.half + (2 * ARCH.half * i) / PANELS);
const openings = [];
// Spitse opening tussen a en b: de hoogste aanzet van de spitse top die
// overal onder de rib blijft, of null als die niet 1 m boven het dek komt.
function opening(a, b) {
  let shoulder = Infinity;
  for (let k = 0; k <= 200; k++) {
    const x = a + ((b - a) * k) / 200;
    shoulder = Math.min(shoulder, lower(x) - 0.05 - Math.tan(POINTED) * Math.min(x - a, b - x));
  }
  const floor = Math.min(deckZ(a), deckZ(b), deckZ((a + b) / 2)) - 0.05;
  if (shoulder < Math.max(deckZ(a), deckZ(b)) + 1.0) return null;
  const apex = shoulder + (Math.tan(POINTED) * (b - a)) / 2;
  return { a, b, floor, shoulder, apex };
}
for (let i = 0; i < PANELS; i++) {
  let a = panelX[i] + HANGER / 2;
  let b = panelX[i + 1] - HANGER / 2;
  // Bij de opleggingen is de rib te laag voor een opening over het hele veld:
  // dan versmalt de opening vanaf de lage kant (een dichte hoek bij de
  // buitenste hanger), tot minstens 2 m breed.
  let found = opening(a, b);
  while (!found && b - a > 2.25) {
    if (Math.abs(a) > Math.abs(b)) a += 0.25;
    else b -= 0.25;
    found = opening(a, b);
  }
  if (found) openings.push(found);
}
const ribs = RIBS.map(([y0, y1]) => {
  const band = profileY(
    [...ribXs.map((x) => [x, deckZ(x) - DECK_SEGMENTS[1].depth]), ...[...ribXs].reverse().map((x) => [x, upper(x)])],
    y0,
    y1,
  );
  const holes = openings.map(({ a, b, floor, shoulder, apex }) =>
    profileY(
      [[a, floor], [b, floor], [b, shoulder], [(a + b) / 2, apex], [a, shoulder]],
      y0 - 0.5,
      y1 + 0.5,
    ),
  );
  return band.subtract(union(holes));
});

const bridge = union([deck, ...piers, ...abutments, ...ribs]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden die uitloopt in een
// scherm van 0,9 m tot de onderplaat.
const KNEE = (50 * Math.PI) / 180;
const SCREEN = 0.45;
const footSteps = Math.round(NORTH_FACE - SOUTH_FACE);
const footXs = [
  ...Array.from({ length: footSteps + 1 }, (_, i) => SOUTH_FACE + ((NORTH_FACE - SOUTH_FACE) * i) / footSteps),
  ...DECK_SEGMENTS.flatMap(({ x1 }) => [x1, x1 + 1e-3]),
]
  .filter((x) => x >= SOUTH_FACE && x <= NORTH_FACE)
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-4);
const footStations = footXs.map((x) => {
  const seg = deckY(x);
  const zb = (seg === DECK_SEGMENTS[1] ? deckBottom(x) : deckZ(x) - SLAB) + 0.02;
  const { y0, y1 } = seg;
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
});
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);

// ---------- rijbaan en fietspaden als eigen onderdelen ----------
// (Na de printversie opgebouwd: zo blijft de STL dezelfde als zonder deze
// onderdelen.)
// De bovenste 0,5 m van het dek en de landhoofden is een eigen node per
// BGT-functie met de attributen in glTF `extras.attributes`, zodat de
// kleurregels van een thema (bijvoorbeeld fietspaden rood) op het brugdek
// werken zoals op de PDOK-wegdelen ernaast.
//
// Op het dek zelf ligt in de BGT geen wegdeel, alleen het overbruggingsdeel
// (L0002.8e874d355c3a4490bc40c013d1b3c2d4, dek); de wegdelen van de gemeenten
// houden op bij de dekeinden (x = -151,2 en 285,2). Volgens de uitwijkregel
// komen de functies van de wegdelen op de landhoofden: aan de zuidkant
// ('s-Hertogenbosch) G0796.340be0875db3bf87e0538d1013ac73b0 (rijbaan lokale
// weg) met aan weerszijden een fietspad, G0796.340be086e04abf87e0538d1013ac73b0
// (oost) en G0796.31dfe31c4de52e23e0636a3013acf40e (west), alle drie gesloten
// verharding, asfalt. Aan de noordkant (Maasdriel) staan dezelfde drie stroken
// alle als rijbaan lokale weg in de BGT (G0263.c315b8673a284fbea79e2f98087a7223
// in het midden, G0263.e8c1245da627422980d225435066f793 oost en
// G0263.61fa395127934899b3a63cfe5f060293 west). De PDOK-luchtfoto toont over de
// hele brug, ook onder de boog, rode fietspaden van de dekrand tot de
// vangrails: oost tot 4,65 m van de as, west vanaf 4,9 m (de vangrails liggen
// op y = -4,6 en 4,85). Rijbaan: de strook ertussen, met de vangrails en de
// middenberm.
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = {
  bgt_functie: "rijbaan lokale weg",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_ATTRIBUTES = {
  bgt_functie: "fietspad",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_EAST = -4.65; // binnenrand van het oostelijke fietspad (luchtfoto)
const BIKE_WEST = 4.9; // binnenrand van het westelijke fietspad (luchtfoto)
// Het dek heeft geen schampkanten: de strook loopt over de volle breedte van
// het breedste dekdeel (met marge) van achter het zuidelijke tot achter het
// noordelijke landhoofd, van 0,5 m onder tot 1 m boven het wegdek, met de
// loftstations van het AHN-profiel (om de 2 m). Zo snijdt hij het hele
// bovenvlak uit de constructie en blijft er geen vlak zonder dikte op het
// wegdek over; ook de sprongen in de dekbreedte bij de rivierpijlers vallen
// binnen de strook.
const STRIP_Y = [DECK_SEGMENTS[1].y0 - 0.2, DECK_SEGMENTS[1].y1 + 0.2];
const stripXs = [
  SOUTH_END - 1,
  ...DECK_NAP.map((_, i) => DECK_X0 + 2 * i).filter((x) => x > SOUTH_END - 1 && x < NORTH_END + 1),
  NORTH_END + 1,
];
const strip = loftX(
  stripXs.map((x) => {
    const zt = deckZ(x);
    return {
      x,
      section: [[STRIP_Y[0], zt - LAYER], [STRIP_Y[1], zt - LAYER], [STRIP_Y[1], zt + ABOVE], [STRIP_Y[0], zt + ABOVE]],
    };
  }),
);
// De hele strook van elke boogrib blijft constructie, ook onder de openingen
// van het hangerscherm en waar de rib onder het wegdek duikt, met 2 cm vrij.
const guardXs = [-ARCH.half - 0.02, ...ribXs, ARCH.half + 0.02];
const ribGuards = RIBS.map(([y0, y1]) =>
  profileY(
    [
      ...guardXs.map((x) => [x, deckZ(x) - DECK_SEGMENTS[1].depth - 0.1]),
      ...[...guardXs].reverse().map((x) => [x, Math.max(upper(x), deckZ(x) + ABOVE + 0.5)]),
    ],
    y0 - 0.02,
    y1 + 0.02,
  ),
);
const notLayer = union(ribGuards);
const FAR = 20;
const bikeBands = union([
  prism([[SOUTH_END - 5, -FAR], [NORTH_END + 5, -FAR], [NORTH_END + 5, BIKE_EAST], [SOUTH_END - 5, BIKE_EAST]], BASE - 1, 100),
  prism([[SOUTH_END - 5, BIKE_WEST], [NORTH_END + 5, BIKE_WEST], [NORTH_END + 5, FAR], [SOUTH_END - 5, FAR]], BASE - 1, 100),
]);
const layerCut = strip.subtract(notLayer);
const roadCut = layerCut.subtract(bikeBands);
const bikeCut = layerCut.intersect(bikeBands);
const roadway = roadCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const structure = bridge.subtract(layerCut);
const parts = [
  ["building:hedelse-brug", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];
{
  // De onderdelen vormen samen de brug: volumes tellen op, geen overlap.
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  const whole = bridge.volume();
  const overlap = union([roadway, bikeway]).intersect(structure).volume() + roadway.intersect(bikeway).volume();
  console.log(
    "partitie (m3):",
    parts.map(([name, solid]) => `${name} ${solid.volume().toFixed(2)}`).join(", "),
    `som ${sum.toFixed(2)}, brug ${whole.toFixed(2)}, overlap ${overlap.toFixed(4)}`,
  );
  if (Math.abs(sum - whole) > 1e-5 * whole + 0.01 || overlap > 0.01) throw new Error("onderdelen vormen niet samen de brug");
  for (const [name, solid] of parts) if (solid.status() !== "NoError" || solid.isEmpty()) throw new Error(`${name}: ${solid.status()}`);
}

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van het dek en van de dekranden langs de
// aanbruggen, in de printversie geen.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-4) continue;
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
  const { area, found } = overhangs(bridge);
  for (const p of found) {
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    // Onderkant van het dek, ook de sprong van 0,3 m bij de rivierpijlers.
    const onDeck = Math.abs(zMid - deckBottom(xMid)) < 0.35 || Math.abs(zMid - (deckZ(xMid) - SLAB)) < 0.05;
    if (!onDeck) throw new Error(`overhang buiten het dek op x ${xMid.toFixed(2)}, z ${zMid.toFixed(2)}`);
  }
  console.log("vrij hangend (m2):", Math.round(area));
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2));
  if (print.area > 0.5) {
    for (const p of print.found.slice(0, 12)) console.log(p.map((q) => q.map((c) => +c.toFixed(2))));
    throw new Error("printversie heeft overhang");
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
report.arch = {
  crownNap: ARCH.crown,
  riseAboveDeckM: +ARCH_RISE.toFixed(2),
  hangers: PANELS - 1,
  openings: openings.length,
  openingApexNap: openings.map(({ apex }) => +(apex + WATER_NAP).toFixed(1)),
};
const glbFile = path.join(outDir, "hedelse-brug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-hedelse-brug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `hedelse-brug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Hedelse brug 1:${scale} mm Z-up`);
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
const samplePoints = [-40, 0, 40].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "hedelse-brug.json"),
  JSON.stringify(
    {
      name: "Hedelse brug",
      file: "hedelse-brug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [146802.1, 416790.88],
      xAxis: [-0.16176, 0.98683],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      // Op het water van de Maas naast de boog, aan beide zijden.
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden onder de boog op de waterspiegel van de Maas (z = 0, NAP +1,1 m) in de oorsprong, +X langs de brug naar het noorden (Hedel, RD-richting 99,31 graden vanaf het oosten) en +Y stroomafwaarts naar het westen. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van het dek en de landhoofden met de BGT-attributen in extras.attributes (bgt_functie rijbaan lokale weg of fietspad, bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt; de functies van de wegdelen op de landhoofden, want op het dek ligt in de BGT geen wegdeel), met de fietspaden aan weerszijden van de dekrand tot 4,65 m (oost) en 4,9 m (west) van de as, zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het dek van 16,5 m breed over de aanbruggen en 18,2 m onder de boog van het zuidelijke landhoofd (x = -163) tot het noordelijke (x = 297), met het wegdek op NAP +13,1 tot +14,4 m; de twee rivierpijlers van 5,5 × 26 m met ronde koppen; de boog met trekband van 124,8 m tussen de opleggingen als twee boogribben van 1,2 m op de randen van het dek met de top op NAP +34,1 m en de 11 hangers als een scherm met spitse openingen tussen dek en rib; twee aanbruggen aan de zuidkant en vijf aan de noordkant op pijlers van 4,7 × 17 m. Het windverband tussen de ribben, leuningen en lantaarns zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de boog bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NORTH_END - SOUTH_END).toFixed(1),
        deckLengthM: +(NORTH_FACE - SOUTH_FACE).toFixed(1),
        deckWidthM: DECK_SEGMENTS.map(({ y0, y1 }) => +(y1 - y0).toFixed(1)),
        mainSpanBearingsM: +(2 * ARCH.half).toFixed(2),
        archCrownNapM: ARCH.crown,
        archRiseAboveDeckM: +ARCH_RISE.toFixed(1),
        hangerPanelM: +((2 * ARCH.half) / PANELS).toFixed(2),
        approachPierCentresM: [SOUTH_APPROACH_PIER_X, ...APPROACH_PIER_X].map((x) => +x.toFixed(2)),
        deckNapM: { south: DECK_NAP[0], crest: Math.max(...DECK_NAP), north: DECK_NAP[DECK_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Hedelse_brug",
        "https://en.wikipedia.org/wiki/Hedel_Bridge",
        "https://structurae.net/structures/hedel-road-bridge",
        "PDOK BGT overbruggingsdeel (dek, rivierpijlers, aanbrugpijlers), EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor het wegdek en de boogribben; PDOK-luchtfoto voor de hangers",
        "Wikimedia Commons: Zichtopbrughedel.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

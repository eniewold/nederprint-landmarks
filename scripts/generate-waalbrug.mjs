// Genereert een vereenvoudigd, gesloten 3D-model van de Waalbrug in Nijmegen:
// de stalen boogbrug uit 1936 over de Waal tussen het Keizer Traianusplein en
// Veur-Lent, met de hoofdboog van 244 m (twee vakwerkbogen waar het wegdek
// doorheen loopt, met hangers), de twee rivierpijlers en aan beide zijden twee
// aanbruggen met bogen onder het dek op de tussenpijlers en de landhoofden.
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, de materiaalklasse in de nodenaam: building:waalbrug voor
// het kunstwerk en road:rijbaan voor de bovenste 0,5 m van het wegdek, met de
// attributen van het BGT-wegdeel in extras.attributes) als catalogusbron voor
// de export en de kaart, plus een binaire STL in millimeters op 1:<schaal>
// met de hele brug en een printvoet onder het dek.
//
//   node scripts/generate-waalbrug.mjs              # 1:1000 (standaard)
//   node scripts/generate-waalbrug.mjs --scale 2500
//
// Assenstelsel: oorsprong op de as van de brug midden tussen de twee
// rivierpijlers (RD 188352,47, 429309,98), op de waterspiegel van de Waal
// (NAP +8,0 m), Z omhoog. +X loopt langs de brug naar het noorden (Lent,
// RD-richting 108,15 graden vanaf het oosten), +Y stroomafwaarts naar het
// westzuidwesten. Het zuidelijke landhoofd aan het Keizer Traianusplein ligt
// op x = -332, het oude noordelijke landhoofd op Veur-Lent op x = 322,6.
//
// Bronnen: BGT overbruggingsdeel (dek 23 tot 25,5 m breed van x = -327,8 tot het
// noordelijke landhoofd, rivierpijlers van 10,8 × 32 m op 252 m hart op hart,
// aanbrugpijlers van 8,4 en 7,4 m breed, landhoofd van Veur-Lent); AHN DSM
// 0,5 m (PDOK WCS) voor het lengteprofiel van het wegdek (NAP +26,2 tot
// +27,3 m), de bovenrand van de bogen (top NAP +59,3 m), de ligging van de
// bogen (7 m naast de as) en de waterspiegel; Wikipedia en het
// Rijksmonumentenregister (523067) voor de overspanning (244,1 m tussen de
// opleggingen), de lengte en de breedte; Wikimedia Commons-foto's voor de
// vakwerkhoogte, de hangers en de bogen van de aanbruggen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "waalbrug");
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
// Pijler met ronde koppen (BGT): rechthoek in x, koppen aan beide kanten in y.
function pier(x0, x1, y0, y1, z0, z1) {
  const r = (x1 - x0) / 2;
  const xc = (x0 + x1) / 2;
  const h = z1 - z0;
  return Manifold.hull([
    Manifold.cylinder(h, r, r, 32, false).translate([xc, y0 + r, z0]),
    Manifold.cylinder(h, r, r, 32, false).translate([xc, y1 - r, z0]),
  ]);
}

// ---------- hoofdmaten (boven de waterspiegel, NAP +8,0 m) ----------
const WATER_NAP = 8.0;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de Waal op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// Afstand langs de as vanaf het hart van de zuidelijke rivierpijler (s) en
// de lokale x: x = s - 126,2.
const S0 = 126.2;
const SOUTH_END = -206 - S0; // achterkant van het zuidelijke landhoofd
const SOUTH_FACE = -198 - S0; // voorzijde van het zuidelijke landhoofd
const NORTH_FACE = 442.1 - S0; // voorzijde van het landhoofd op Veur-Lent (BGT)
const NORTH_END = 448.8 - S0; // einde van het model; de Verlengde Waalbrug loopt verder

// Wegdek in NAP-meters om de 2 m vanaf s = -206: 25e percentiel van het
// AHN-DSM over 2 × 12 m rond de as, mediaan over 14 m en licht gladgestreken
// (de windverbanden van de boog vallen zo weg).
const DECK_NAP = [
  26.42, 26.42, 26.41, 26.39, 26.37, 26.35, 26.33, 26.31, 26.29, 26.27, 26.25, 26.24, 26.23, 26.23,
  26.23, 26.23, 26.24, 26.25, 26.26, 26.27, 26.28, 26.29, 26.31, 26.33, 26.34, 26.35, 26.37, 26.38,
  26.39, 26.40, 26.41, 26.42, 26.42, 26.43, 26.44, 26.46, 26.47, 26.48, 26.49, 26.50, 26.51, 26.51,
  26.52, 26.52, 26.53, 26.53, 26.53, 26.53, 26.53, 26.53, 26.53, 26.53, 26.54, 26.55, 26.56, 26.58,
  26.59, 26.59, 26.60, 26.61, 26.62, 26.64, 26.65, 26.67, 26.68, 26.69, 26.70, 26.71, 26.72, 26.73,
  26.74, 26.75, 26.75, 26.76, 26.77, 26.78, 26.78, 26.79, 26.81, 26.82, 26.84, 26.85, 26.85, 26.86,
  26.86, 26.87, 26.88, 26.89, 26.90, 26.90, 26.90, 26.90, 26.90, 26.91, 26.91, 26.92, 26.92, 26.93,
  26.94, 26.95, 26.96, 26.97, 26.98, 26.99, 26.99, 26.99, 27.00, 27.00, 27.01, 27.02, 27.04, 27.05,
  27.05, 27.06, 27.07, 27.08, 27.10, 27.12, 27.13, 27.14, 27.15, 27.15, 27.15, 27.15, 27.16, 27.16,
  27.17, 27.17, 27.17, 27.18, 27.20, 27.21, 27.23, 27.24, 27.25, 27.26, 27.26, 27.26, 27.27, 27.27,
  27.27, 27.26, 27.27, 27.27, 27.28, 27.28, 27.28, 27.28, 27.28, 27.29, 27.29, 27.29, 27.29, 27.29,
  27.30, 27.30, 27.30, 27.30, 27.31, 27.31, 27.32, 27.32, 27.32, 27.32, 27.32, 27.31, 27.30, 27.30,
  27.29, 27.29, 27.29, 27.29, 27.29, 27.29, 27.29, 27.29, 27.29, 27.29, 27.30, 27.30, 27.30, 27.29,
  27.28, 27.28, 27.28, 27.28, 27.28, 27.28, 27.28, 27.27, 27.27, 27.27, 27.27, 27.27, 27.27, 27.26,
  27.26, 27.25, 27.24, 27.23, 27.22, 27.22, 27.21, 27.21, 27.21, 27.21, 27.21, 27.20, 27.20, 27.19,
  27.18, 27.18, 27.18, 27.18, 27.17, 27.15, 27.13, 27.12, 27.11, 27.10, 27.09, 27.07, 27.06, 27.04,
  27.04, 27.03, 27.03, 27.02, 27.01, 27.00, 26.99, 26.98, 26.98, 26.97, 26.97, 26.97, 26.96, 26.96,
  26.96, 26.96, 26.95, 26.94, 26.93, 26.92, 26.91, 26.90, 26.89, 26.88, 26.88, 26.87, 26.85, 26.84,
  26.83, 26.82, 26.81, 26.80, 26.79, 26.76, 26.73, 26.70, 26.67, 26.64, 26.60, 26.57, 26.53, 26.50,
  26.47, 26.43, 26.39, 26.36, 26.32, 26.28, 26.24, 26.20, 26.16, 26.12, 26.09, 26.06, 26.03, 26.00,
  25.97, 25.95, 25.92, 25.89, 25.85, 25.81, 25.77, 25.74, 25.72, 25.69, 25.67, 25.64, 25.60, 25.57,
  25.53, 25.50, 25.47, 25.43, 25.40, 25.37, 25.34, 25.31, 25.28, 25.24, 25.21, 25.18, 25.15, 25.11,
  25.08, 25.05, 25.01, 24.97, 24.92, 24.88, 24.84, 24.79, 24.75, 24.71, 24.68, 24.64, 24.61, 24.58,
  24.54, 24.50, 24.46, 24.44, 24.42, 24.40, 24.39
];
function deckZ(x) {
  const f = Math.min(Math.max((x + S0 + 206) / 2, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return Z(DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t);
}

// Dek (BGT): 24 m breed over de zuidelijke aanbruggen, 25,5 m over de
// hoofdoverspanning, 24 en 23 m over de noordelijke aanbruggen, met het brede
// trottoir en fietspad aan de westkant (+Y); de breedte verspringt boven de
// pijlers. Constructiehoogte 2,4 m (geschat op foto's).
const DECK = { depth: 2.4 };
const DECK_SEGMENTS = [
  { x0: -206 - S0, x1: -0.1 - S0, y0: -11.8, y1: 12.2 },
  { x0: -0.1 - S0, x1: 252.4 - S0, y0: -11.8, y1: 13.7 },
  { x0: 252.4 - S0, x1: 353.5 - S0, y0: -10.8, y1: 13.2 },
  { x0: 353.5 - S0, x1: 448.8 - S0, y0: -9.8, y1: 13.2 },
];
const deckY = (x) => DECK_SEGMENTS.find(({ x0, x1 }) => x <= x1) ?? DECK_SEGMENTS[DECK_SEGMENTS.length - 1];
const deckBottom = (x) => deckZ(x) - DECK.depth;
// Pijlers (BGT): x-bereik en y-bereik.
const MAIN_PIERS = [
  { x0: -131.5, x1: -120.7, y0: -15.8, y1: 16.2 },
  { x0: 120.7, x1: 131.7, y0: -15.7, y1: 16.5 },
];
const APPROACH_PIERS = [
  { x0: -231.7, x1: -223.3, y0: -14.3, y1: 13.6 },
  { x0: 223.6, x1: 231.0, y0: -13.7, y1: 14.7 },
];
// Hoofdboog: twee vakwerkbogen 7 m naast de as (AHN), 244,1 m tussen de
// opleggingen (Wikipedia). De bovenrand is een cirkelboog door de top op
// NAP +59,3 m en door NAP +27,5 m op 109 m uit het midden, waar hij het dek
// kruist (AHN; straal 202,7 m, beter passend dan een parabool), en komt bij de
// opleggingen op circa NAP +18,5 m uit. Het vakwerk is in de top 6,5 m hoog
// (foto's) en loopt naar de opleggingen dicht. Op 1:1000 is het vakwerk een
// dichte band van 1,2 m dik.
const ARCH = { half: 122.05, crown: 59.3, crossX: 109, crossNap: 27.5, depth: 6.5, ribY: 7.0, rib: 1.2 };
const ARCH_R = (ARCH.crossX ** 2 + (ARCH.crown - ARCH.crossNap) ** 2) / (2 * (ARCH.crown - ARCH.crossNap));
const archT = (x) => Math.min(Math.abs(x) / ARCH.half, 1);
const upper = (x) => {
  const ax = Math.min(Math.abs(x), ARCH.half);
  return Z(ARCH.crown - (ARCH_R - Math.sqrt(ARCH_R ** 2 - ax ** 2)));
};
const lower = (x) => upper(x) - ARCH.depth * (1 - archT(x) ** 8);
// Hangers op de 23 knopen van het vakwerk (22 velden van 11,1 m). Op 1:1000
// is elke hanger een stijl van 1,2 m en de ruimte tussen dek en boog een
// scherm met spitse openingen (zijden van 55 graden) tot onder de boog.
const PANELS = 22;
const HANGER = 1.2;
const POINTED = (55 * Math.PI) / 180;
// Onder het dek loopt de boog naar de pijler. De onderrand krijgt daar een
// knie van 50 graden vanaf het punt waar de boog het dek kruist, zodat hij
// zonder steun print.
const KNEE = (50 * Math.PI) / 180;
// Aanbruggen: stalen bogen onder het dek tussen de pijlers, met de kruin net
// onder het dek en de aanzet 9,4 m onder het wegdek (foto's). Op 1:1000 is
// de ruimte tussen boog en dek dicht.
const APPROACH_RISE = 7.0;
const APPROACH_SPANS = [
  [SOUTH_FACE, APPROACH_PIERS[0].x0],
  [APPROACH_PIERS[0].x1, MAIN_PIERS[0].x0],
  [MAIN_PIERS[1].x1, APPROACH_PIERS[1].x0],
  [APPROACH_PIERS[1].x1, NORTH_FACE],
].map(([a, b]) => ({ a, b, mid: (a + b) / 2, half: (b - a) / 2 }));
const soffit = (span, x) => deckBottom(x) - APPROACH_RISE * ((x - span.mid) / span.half) ** 2;

// ---------- dek, pijlers, landhoofden ----------
const deck = union(
  DECK_SEGMENTS.map(({ x0, x1, y0, y1 }) => bandY(x0, x1, deckBottom, deckZ, y0, y1, Math.round(x1 - x0))),
);
const approachArches = APPROACH_SPANS.map((span) =>
  bandY(
    span.a,
    span.b,
    (x) => soffit(span, x),
    (x) => deckBottom(x) + 0.1,
    deckY(span.mid).y0,
    deckY(span.mid).y1,
    Math.round((span.b - span.a) / 1),
  ),
);
const piers = [...MAIN_PIERS, ...APPROACH_PIERS].map(({ x0, x1, y0, y1 }) =>
  pier(x0, x1, y0, y1, BASE, deckBottom((x0 + x1) / 2) + 0.1),
);
const abutments = [
  bandY(SOUTH_END, SOUTH_FACE, () => BASE, (x) => deckZ(x) - 0.01, deckY(SOUTH_END).y0, deckY(SOUTH_END).y1, 4),
  bandY(NORTH_FACE, NORTH_END, () => BASE, (x) => deckZ(x) - 0.01, deckY(NORTH_END).y0, deckY(NORTH_END).y1, 4),
];

// ---------- hoofdboog ----------
// Waar de onderrand het dek kruist (onderkant van het dek), voor de knie.
function crossing(side) {
  let lo = side * ARCH.half;
  let hi = 0;
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    if (lower(m) < deckBottom(m)) lo = m;
    else hi = m;
  }
  return lo;
}
const kneeX = crossing(-1);
const kneeXr = crossing(1);
const kneeLeft = (x) => deckBottom(kneeX) - Math.tan(KNEE) * (kneeX - x);
const kneeRight = (x) => deckBottom(kneeXr) - Math.tan(KNEE) * (x - kneeXr);
const ribStart = MAIN_PIERS[0].x1 - 0.5;
const ribEnd = MAIN_PIERS[1].x0 + 0.5;
const ribBottom = (x) =>
  Math.max(BASE, Math.min(lower(x), kneeLeft(x), kneeRight(x), deckZ(x) - 0.3));
// Stations om de 0,5 m plus de knikken van de onderrand (kruising met het
// dek en waar de knie de onderkant raakt), zodat geen vlak de knik afsnijdt.
const ribXs = [
  ...Array.from({ length: Math.round((ribEnd - ribStart) / 0.5) + 1 }, (_, i) => ribStart + i * 0.5),
  kneeX,
  kneeX - (deckBottom(kneeX) - BASE) / Math.tan(KNEE),
  kneeXr,
  kneeXr + (deckBottom(kneeXr) - BASE) / Math.tan(KNEE),
]
  .filter((x) => x >= ribStart && x <= ribEnd)
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-3);
const panelX = Array.from({ length: PANELS + 1 }, (_, i) => -ARCH.half + (2 * ARCH.half * i) / PANELS);
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
  const floor = Math.min(deckZ(a), deckZ(b), deckZ((a + b) / 2)) - 0.05;
  if (shoulder < Math.max(deckZ(a), deckZ(b)) + 1.0) continue;
  const apex = shoulder + (Math.tan(POINTED) * (b - a)) / 2;
  openings.push({ a, b, floor, shoulder, apex });
}
const ribs = [-1, 1].map((side) => {
  const y0 = side * ARCH.ribY - ARCH.rib / 2;
  const y1 = side * ARCH.ribY + ARCH.rib / 2;
  const band = profileY(
    [...ribXs.map((x) => [x, ribBottom(x)]), ...[...ribXs].reverse().map((x) => [x, upper(x)])],
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

const bridge = union([deck, ...approachArches, ...piers, ...abutments, ...ribs]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek van de hoofdoverspanning en de bogen van de aanbruggen hangen vrij.
// Net als de overhangopvulling van de export krijgt de STL daaronder een wig
// van 50 graden die uitloopt in een scherm van 0,9 m tot de onderplaat.
const SCREEN = 0.45;
const under = (x) => {
  const span = APPROACH_SPANS.find(({ a, b }) => x >= a && x <= b);
  return span ? soffit(span, x) : deckBottom(x);
};
const footStations = [];
const footSteps = Math.round((NORTH_FACE - SOUTH_FACE) / 1);
// Stations om de meter plus een paar aan elke pijlerzijde, zodat de wig de
// sprong van de boogaanzet naar de onderkant van het dek volgt.
const footXs = [
  ...Array.from({ length: footSteps + 1 }, (_, i) => SOUTH_FACE + ((NORTH_FACE - SOUTH_FACE) * i) / footSteps),
  ...APPROACH_SPANS.flatMap(({ a, b }) => [a - 1e-3, a, b, b + 1e-3]),
  ...DECK_SEGMENTS.flatMap(({ x1 }) => [x1, x1 + 1e-3]),
]
  .filter((x) => x >= SOUTH_FACE && x <= NORTH_FACE)
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-4);
for (const x of footXs) {
  const zb = under(x) + 0.02;
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
  footStations.push({ x, section: section.map(([y, z]) => [y + yc, z]) });
}
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);

// ---------- rijbaan als eigen onderdeel ----------
// De bovenste 0,5 m van het dek is een eigen node met de attributen van het
// BGT-wegdeel erop (glTF `extras.attributes`), zodat de kleurregels van een
// thema op het brugdek werken zoals op de PDOK-wegdelen ernaast. Op het dek
// ligt in de BGT één actueel wegdeel met relatieve hoogteligging 1:
// G0268.42ff08b49bbd5775e0530100007f0cc2, rijbaan autoweg, gesloten
// verharding, asfalt, over de hele breedte van x = -327,8 tot 323,9 (ook de
// trottoirs en fietspaden op de brug zijn in de BGT geen eigen wegdeel).
// De rijbaan is daarom het hele wegdek; alleen de strook van de twee bogen
// met hun hangerscherm blijft constructie. De laag wordt pas na het
// printmodel gebouwd, zodat de STL ongewijzigd blijft.
const LAYER = 0.5;
const ROAD_ATTRIBUTES = {
  bgt_functie: "rijbaan autoweg",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
// De strook volgt dezelfde stations als het dek, van 0,5 m onder tot 1 m
// boven het wegdek, en loopt in de breedte buiten het dek door (ook waar de
// dekbreedte boven de pijlers verspringt); wegdeel = strook ∩ brug.
const ABOVE = 1.0;
const strip = union(
  DECK_SEGMENTS.map(({ x0, x1 }) =>
    bandY(x0, x1, (x) => deckZ(x) - LAYER, (x) => deckZ(x) + ABOVE, -20, 20, Math.round(x1 - x0)),
  ),
);
// De bogen met hun hangerscherm blijven constructie over de hele strook van
// de rib (ook onder de openingen), met 2 cm vrij, over het stuk waar de
// bovenrand van de boog in de wegdeklaag of erboven komt (plus 0,5 m).
// Daarbuiten ligt de boog geheel in het dek, onder de laag.
const ribGuardEnd = (() => {
  const inLayer = (x) => upper(x) > deckZ(x) - LAYER - 0.02;
  let lo = 0;
  let hi = ARCH.half;
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    if (inLayer(m)) lo = m;
    else hi = m;
  }
  return hi + 0.5;
})();
const ribGuards = [-1, 1].map((side) =>
  boxFromTo(
    -ribGuardEnd,
    ribGuardEnd,
    side * ARCH.ribY - ARCH.rib / 2 - 0.02,
    side * ARCH.ribY + ARCH.rib / 2 + 0.02,
    BASE,
    ARCH.crown,
  ),
);
const roadCut = strip.subtract(union(ribGuards));
const roadway = roadCut.intersect(bridge);
const structure = bridge.subtract(roadCut);
const parts = [
  ["building:waalbrug", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
];
{
  const sum = structure.volume() + roadway.volume();
  const whole = bridge.volume();
  console.log(
    "volumes (m3): constructie",
    +structure.volume().toFixed(1),
    "rijbaan",
    +roadway.volume().toFixed(1),
    "som",
    +sum.toFixed(1),
    "brug",
    +whole.toFixed(1),
    "verschil",
    +(sum - whole).toFixed(3),
  );
  if (Math.abs(sum - whole) > 1e-4 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van het dek (over de hoofdoverspanning en naast
// de ronde koppen van de pijlers) en de bogen van de aanbruggen, in de
// printversie geen.
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
  let deckArea = 0;
  for (const p of found) {
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const onDeck = Math.abs(zMid - deckBottom(xMid)) < 0.15;
    const span = APPROACH_SPANS.find(({ a, b }) => xMid >= a - 0.01 && xMid <= b + 0.01);
    const onArch = span && Math.abs(zMid - soffit(span, xMid)) < 0.1;
    if (!onDeck && !onArch) {
      throw new Error(`overhang buiten dek en aanbruggen op x ${xMid.toFixed(2)}, z ${zMid.toFixed(2)}`);
    }
    if (onDeck && Math.abs(xMid) < MAIN_PIERS[1].x0) {
      const e1 = p[1].map((c, i) => c - p[0][i]);
      const e2 = p[2].map((c, i) => c - p[0][i]);
      deckArea += Math.abs(e1[0] * e2[1] - e1[1] * e2[0]) / 2;
    }
  }
  console.log("vrij hangend (m2):", Math.round(area), "waarvan dek hoofdoverspanning:", Math.round(deckArea));
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2));
  if (print.area > 0.5) throw new Error("printversie heeft overhang");
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
  radius: +ARCH_R.toFixed(1),
  footNap: +(upper(ARCH.half) + WATER_NAP).toFixed(2),
  lowerCrownNap: +(lower(0) + WATER_NAP).toFixed(2),
  kneeX: [+kneeX.toFixed(2), +kneeXr.toFixed(2)],
  hangers: panelX.filter((x) => lower(x) > deckZ(x) + 1).length,
  openings: openings.length,
  openingApexNap: openings.map(({ apex }) => +(apex + WATER_NAP).toFixed(1)),
};
report.roadway = {
  attributes: ROAD_ATTRIBUTES,
  ribGuardX: +ribGuardEnd.toFixed(2),
  volumeM3: {
    structure: +structure.volume().toFixed(1),
    roadway: +roadway.volume().toFixed(1),
    bridge: +bridge.volume().toFixed(1),
  },
};
const glbFile = path.join(outDir, "waalbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-waalbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `waalbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Waalbrug Nijmegen 1:${scale} mm Z-up`);
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
const samplePoints = [-66, 0, 64].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "waalbrug.json"),
  JSON.stringify(
    {
      name: "Waalbrug",
      file: "waalbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [188352.47, 429309.98],
      xAxis: [-0.31158, 0.95022],
      groundOffsetMetres: GROUND_OFFSET,
      // Op het water van de Waal naast de hoofdoverspanning, aan beide zijden.
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van de brug midden tussen de twee rivierpijlers op de waterspiegel van de Waal (z = 0, NAP +8,0 m) in de oorsprong, +X langs de brug naar het noorden (Lent, RD-richting 108,15 graden vanaf het oosten) en +Y stroomafwaarts naar het westzuidwesten. Twee nodes: road:rijbaan, de bovenste 0,5 m van het wegdek over de hele lengte en breedte behalve de strook van de twee bogen met hun hangerscherm, met de attributen van het BGT-wegdeel erop in extras.attributes (bgt_functie rijbaan autoweg, bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt; de BGT heeft op de brug geen apart fietspad of voetpad), zodat de kleurregels van een thema erop werken; en building:waalbrug, de rest van het kunstwerk: het dek van 23 tot 25,5 m breed van het zuidelijke landhoofd aan het Keizer Traianusplein (x = -332) tot het oude landhoofd op Veur-Lent (x = 322,6), met het wegdek op NAP +26,2 tot +27,3 m; de twee rivierpijlers van 10,8 × 32 m op 252 m hart op hart; de hoofdboog van 244 m tussen de opleggingen als twee dichte vakwerkbanden van 1,2 m dik, 7 m naast de as, met de top op NAP +59,3 m en de hangers als een scherm met spitse openingen tussen dek en boog; onder het dek een knie van 50 graden naar de pijlers; aan beide zijden twee aanbruggen met dichte bogen onder het dek op een tussenpijler. De Verlengde Waalbrug over de Spiegelwaal (2013-2015), de windverbanden tussen de bogen, leuningen en lantaarns zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NORTH_END - SOUTH_END).toFixed(1),
        deckWidthM: DECK_SEGMENTS.map(({ y0, y1 }) => +(y1 - y0).toFixed(1)),
        mainSpanBearingsM: +(2 * ARCH.half).toFixed(1),
        mainPierCentresM: 252.3,
        archCrownNapM: ARCH.crown,
        archTrussDepthM: ARCH.depth,
        archRibsFromAxisM: ARCH.ribY,
        hangerPanelM: +((2 * ARCH.half) / PANELS).toFixed(2),
        approachSpansM: APPROACH_SPANS.map(({ a, b }) => +(b - a).toFixed(1)),
        deckNapM: { south: DECK_NAP[0], crest: Math.max(...DECK_NAP), north: DECK_NAP[DECK_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Waalbrug_Nijmegen",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/523067",
        "PDOK BGT overbruggingsdeel (dek, rivierpijlers, aanbrugpijlers, landhoofd Veur-Lent), EPSG:28992",
        "PDOK BGT wegdeel G0268.42ff08b49bbd5775e0530100007f0cc2 (rijbaan autoweg op het dek, attributen van road:rijbaan)",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de bogen, de waterspiegel en het maaiveld",
        "Wikimedia Commons: Waalbrug Nijmegen.jpg, Overzicht van de Waalbrug over de Waal - Nijmegen - 20425649 - RCE.jpg, Waalbrug, Nijmegen.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van de Merwedebrug over de
// Boven-Merwede bij Gorinchem (A27, 1961): één brug van 800 m tussen de
// landhoofden bij Sleeuwijk en Gorinchem met twee stalen boogbruggen met
// trekband van 173,2 m naast elkaar (twee boogribben per boog met hangers),
// de drie rivierpijlers, vier aanbruggen aan de zuidkant, de basculebrug met
// de basculekelder en het bedieningshuis aan de noordkant en daarachter vijf
// aanbruggen op wandpijlers tot het noordelijke landhoofd. De A27 is (nog)
// niet verbreed: er staat één brug; de twee vervangende betonnen bruggen
// worden vanaf 2026 gebouwd en zitten niet in het model. Alle maten in het
// script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog,
// de materiaalklasse in de nodenaam: de constructie als building, rijbaan en
// fietspad op het dek als road met de BGT-attributen) als catalogusbron voor
// de export en de kaart, plus een binaire STL in millimeters op 1:<schaal> met
// een printvoet onder het dek.
//
//   node scripts/generate-merwedebrug-gorinchem.mjs              # 1:2250 (standaard)
//   node scripts/generate-merwedebrug-gorinchem.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het BGT-dek boven de middelste
// rivierpijler (RD 124340,0, 426609,4), op de waterspiegel van de
// Boven-Merwede zoals het PDOK-terrein die legt (NAP +0,55 m), Z omhoog. +X
// loopt langs de brug naar het noordnoordoosten (Gorinchem, RD-richting 77,0
// graden vanaf het oosten), +Y stroomafwaarts naar het westnoordwesten. De
// bogen staan tussen de pijlerharten x = -173,2, 0 en 173,2; de basculebrug
// ligt op x = 178,6 tot 209,5, de basculekelder op x = 209,5 tot 230,5; het
// zuidelijke landhoofd begint op x = -380, het noordelijke eindigt op x = 442.
//
// Bronnen: BGT overbruggingsdeel (dek 24,5 tot 25,5 m breed van x = -368 tot
// 431,5, de drie rivierpijlers met ronde koppen, twee aanbrugpijlers aan de
// zuidkant en drie aan de noordkant, de twee liggers van de basculeklep);
// AHN DSM 0,5 m (PDOK WCS) voor het lengteprofiel van het wegdek (NAP +12,4
// bij Sleeuwijk, +17,6 m boven de middelste pijler, +10,7 m bij Gorinchem), de
// bovenrand van de boogribben (top circa NAP +40,8 m), hun ligging (8,4 m
// naast het midden van het dek), de koppen van de pijlers (NAP +5,5 tot +6,4
// m) en het dak van het bedieningshuis (NAP +21,5 m); PDOK-luchtfoto voor de
// voegen (aanbrugvelden van circa 45 m), het bedieningshuis en de kelder;
// Wikipedia voor de indeling (twee bogen van 170 m, grootste overspanning
// 173 m, lengte 790 m, breedte 25,3 m, doorvaarthoogte NAP +13,3 m onder de
// bogen en NAP +10,45 m onder de basculebrug van 30 m); PDOK-terrein voor de
// waterspiegel (44,08 m ellipsoïdisch, NAP = ellipsoïdisch - 43,55 m);
// BAG-pand 0512100000046976 voor het bedieningshuis; Wikimedia Commons-foto's
// voor de boogribben, de hangers (16 velden per boog), de pijlers met hun
// caissons en de basculekelder.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2250"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "merwedebrug-gorinchem");
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
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
// Stadion (rechthoek met halfronde koppen in y) van x0..x1 en y0..y1.
function stadium(x0, x1, y0, y1, z0, z1) {
  const r = (x1 - x0) / 2;
  const xc = (x0 + x1) / 2;
  return Manifold.hull([
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([xc, y0 + r, z0]),
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([xc, y1 - r, z0]),
  ]);
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
const shiftX = (poly, dx) => poly.map(([x, y]) => [x + dx, y]);
const xRange = (poly) => poly.reduce(([lo, hi], [x]) => [Math.min(lo, x), Math.max(hi, x)], [Infinity, -Infinity]);

// ---------- hoofdmaten (boven de waterspiegel, NAP +0,55 m) ----------
// PDOK legt de Boven-Merwede bij Gorinchem op 44,07 tot 44,12 m
// ellipsoïdisch; op de oevers ligt het PDOK-terrein 43,55 m boven het AHN
// (NAP), dus de waterspiegel ligt op circa NAP +0,55 m.
const WATER_NAP = 0.55;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de rivier op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een aanbrug raakt.
const GROUND_HEIGHT = 44.07;

// Wegdek in NAP-meters om de 2 m vanaf x = -380: mediaan van het AHN-DSM
// over 23 m rond de as zonder alles wat meer dan 0,6 m boven het 20e
// percentiel ligt (bogen, lantaarns, verkeer), mediaan over 10 m en licht
// gladgestreken.
const DECK_X0 = -380;
const DECK_NAP = [
  12.37, 12.39, 12.41, 12.44, 12.47, 12.50, 12.53, 12.56, 12.59, 12.62, 12.65, 12.68, 12.72, 12.75,
  12.78, 12.82, 12.86, 12.89, 12.93, 12.97, 13.01, 13.05, 13.09, 13.12, 13.16, 13.20, 13.23, 13.27,
  13.30, 13.34, 13.38, 13.42, 13.46, 13.50, 13.53, 13.57, 13.61, 13.64, 13.68, 13.71, 13.75, 13.79,
  13.82, 13.86, 13.90, 13.94, 13.98, 14.01, 14.05, 14.08, 14.12, 14.16, 14.20, 14.24, 14.28, 14.31,
  14.35, 14.38, 14.42, 14.46, 14.49, 14.53, 14.56, 14.60, 14.63, 14.67, 14.71, 14.75, 14.78, 14.82,
  14.86, 14.90, 14.93, 14.97, 15.01, 15.04, 15.08, 15.12, 15.15, 15.19, 15.22, 15.26, 15.29, 15.33,
  15.36, 15.40, 15.44, 15.47, 15.51, 15.54, 15.57, 15.61, 15.64, 15.67, 15.70, 15.73, 15.76, 15.79,
  15.81, 15.84, 15.86, 15.88, 15.91, 15.94, 15.98, 16.02, 16.07, 16.11, 16.14, 16.17, 16.20, 16.23,
  16.26, 16.30, 16.35, 16.39, 16.43, 16.46, 16.49, 16.52, 16.55, 16.58, 16.61, 16.64, 16.67, 16.70,
  16.72, 16.74, 16.77, 16.80, 16.83, 16.85, 16.87, 16.90, 16.92, 16.94, 16.96, 16.98, 17.00, 17.02,
  17.04, 17.06, 17.07, 17.09, 17.11, 17.13, 17.14, 17.16, 17.18, 17.20, 17.22, 17.23, 17.25, 17.26,
  17.28, 17.29, 17.30, 17.32, 17.33, 17.34, 17.36, 17.37, 17.38, 17.39, 17.41, 17.42, 17.43, 17.44,
  17.45, 17.46, 17.47, 17.47, 17.48, 17.49, 17.50, 17.50, 17.51, 17.52, 17.52, 17.53, 17.54, 17.54,
  17.55, 17.55, 17.56, 17.57, 17.58, 17.59, 17.59, 17.60, 17.60, 17.60, 17.60, 17.60, 17.60, 17.60,
  17.60, 17.60, 17.60, 17.60, 17.60, 17.59, 17.58, 17.57, 17.57, 17.56, 17.56, 17.55, 17.54, 17.54,
  17.53, 17.52, 17.52, 17.51, 17.50, 17.49, 17.48, 17.47, 17.46, 17.45, 17.44, 17.43, 17.42, 17.41,
  17.40, 17.39, 17.38, 17.37, 17.36, 17.35, 17.34, 17.32, 17.30, 17.27, 17.25, 17.23, 17.21, 17.18,
  17.16, 17.15, 17.13, 17.11, 17.09, 17.07, 17.05, 17.02, 17.00, 16.96, 16.94, 16.91, 16.89, 16.86,
  16.83, 16.80, 16.77, 16.75, 16.72, 16.69, 16.65, 16.62, 16.60, 16.56, 16.52, 16.49, 16.45, 16.42,
  16.38, 16.34, 16.30, 16.27, 16.24, 16.20, 16.17, 16.13, 16.09, 16.05, 16.00, 15.96, 15.92, 15.88,
  15.85, 15.82, 15.80, 15.77, 15.73, 15.70, 15.67, 15.64, 15.60, 15.57, 15.54, 15.51, 15.48, 15.45,
  15.42, 15.39, 15.36, 15.32, 15.29, 15.25, 15.22, 15.18, 15.15, 15.11, 15.08, 15.04, 15.00, 14.96,
  14.92, 14.88, 14.83, 14.79, 14.75, 14.71, 14.67, 14.63, 14.59, 14.55, 14.51, 14.48, 14.44, 14.40,
  14.36, 14.32, 14.28, 14.24, 14.20, 14.17, 14.13, 14.09, 14.04, 14.00, 13.96, 13.92, 13.88, 13.84,
  13.80, 13.76, 13.72, 13.68, 13.64, 13.60, 13.56, 13.51, 13.47, 13.43, 13.39, 13.36, 13.32, 13.28,
  13.24, 13.21, 13.17, 13.13, 13.09, 13.04, 13.00, 12.96, 12.92, 12.88, 12.84, 12.81, 12.77, 12.73,
  12.69, 12.65, 12.60, 12.56, 12.52, 12.49, 12.45, 12.41, 12.37, 12.34, 12.30, 12.26, 12.22, 12.18,
  12.13, 12.09, 12.05, 12.01, 11.98, 11.94, 11.90, 11.86, 11.81, 11.77, 11.73, 11.69, 11.65, 11.61,
  11.57, 11.53, 11.48, 11.44, 11.40, 11.35, 11.31, 11.26, 11.21, 11.16, 11.11, 11.06, 11.00, 10.95,
  10.90, 10.85, 10.80, 10.75, 10.72, 10.69,
];
function deckZ(x) {
  const f = Math.min(Math.max((x - DECK_X0) / 2, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return Z(DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t);
}

// Indeling langs de as (BGT, luchtfoto). Pijlerharten van de bogen.
const SPRINGS = [-173.2, 0, 173.2];
const SOUTH_END = -380.0; // achterkant van het zuidelijke landhoofd, in de dijk (AHN)
const SOUTH_FACE = -357.0; // voorkant van het zuidelijke landhoofd (voeg op de luchtfoto)
const NORTH_FACE = 430.5; // voorkant van het noordelijke landhoofd (BGT)
const NORTH_END = 442.0; // waar de dijk het wegdek bereikt (AHN)
const ARCH_PIER_EDGE = 178.7; // buitenkant van de boogpijlers (BGT)
const LEAF = { x0: 178.6, x1: 209.5 }; // basculeklep (BGT-liggers, 30,6 m)
const KELDER = { x0: 209.5, x1: 230.5, y0: -13.7, y1: 13.9 }; // basculekelder (BGT-dek, luchtfoto)
// Bedieningshuis (BAG-pand 0512100000046976) aan de westkant van de kelder,
// plat dak op NAP +21,5 m (AHN), 6,2 m boven het wegdek.
const CABIN = { x0: 210.6, x1: 217.6, y0: 13.6, y1: 17.7, roofNap: 21.5 };

// Dek (BGT): de plaat over de volle breedte (fietspaden en voetpaden kragen
// uit), daaronder een kokerligger tussen de hoofdliggers onder de boogribben.
// Constructiehoogte onder de bogen 3,8 m (doorvaarthoogte NAP +13,3 m onder
// een wegdek van NAP +17,1 tot +17,6 m), over de aanbruggen 3,2 m (geschat op
// foto's); de basculeklep wordt naar het draaipunt dieper, van 4,0 tot 5,3 m
// (doorvaarthoogte NAP +10,45 m).
const SLAB = 1.0;
const GIRDER = { y0: -9.5, y1: 9.0 };
const DEPTH = { approach: 3.2, arch: 3.8, leafTip: 4.0, leafHeel: 5.3 };
const DECK_SEGMENTS = [
  { x0: SOUTH_FACE, x1: -ARCH_PIER_EDGE, y0: -12.75, y1: 11.8 },
  { x0: -ARCH_PIER_EDGE, x1: LEAF.x0, y0: -13.0, y1: 12.55 },
  { x0: LEAF.x0, x1: KELDER.x0, y0: -12.6, y1: 12.85 },
  { x0: KELDER.x0, x1: KELDER.x1, y0: -12.6, y1: 12.9 },
  { x0: KELDER.x1, x1: NORTH_FACE, y0: -11.9, y1: 12.7 },
];
const deckY = (x) => DECK_SEGMENTS.find(({ x1 }) => x <= x1) ?? DECK_SEGMENTS[DECK_SEGMENTS.length - 1];
function depth(x) {
  if (x >= -ARCH_PIER_EDGE && x <= LEAF.x0) return DEPTH.arch;
  if (x > LEAF.x0 && x <= LEAF.x1) return DEPTH.leafTip + ((DEPTH.leafHeel - DEPTH.leafTip) * (x - LEAF.x0)) / (LEAF.x1 - LEAF.x0);
  return DEPTH.approach;
}
const deckBottom = (x) => deckZ(x) - depth(x);

// Pijlers (BGT, lokale coördinaten): de kop of caisson volgens de BGT tot de
// bovenkant die het AHN naast het dek ziet, daarboven een smallere schacht
// met ronde koppen onder de kokerligger (foto's).
const ARCH_PIER_SOUTH = [
  [-178.4, -13.87], [-177.26, -16.69], [-176.45, -17.78], [-174.82, -19.13], [-173.06, -19.44], [-172.03, -19.3],
  [-171.14, -18.78], [-170.26, -17.98], [-169.22, -16.53], [-168.53, -15.34], [-167.87, -12.9], [-167.73, -11.41],
  [-167.79, 11.14], [-168.56, 15.4], [-169.25, 16.59], [-170.36, 17.61], [-172.76, 18.43], [-174.71, 18.36],
  [-175.55, 17.96], [-176.77, 16.76], [-178.18, 13.82], [-178.51, 12.39], [-178.71, 10.98], [-178.67, -11.05],
];
const MIDDLE_PIER = [
  [-3.51, -13.49], [-2.1, -15.94], [-0.72, -16.7], [1.32, -16.77], [2.41, -16.01], [3.92, -13.4], [4.41, -10.14],
  [4.19, 9.49], [3.96, 11.0], [3.36, 13.55], [2.53, 15.03], [1.0, 16.45], [0.11, 16.79], [-1.21, 16.57],
  [-3.42, 13.68], [-4.0, 11.67], [-3.98, -10.57],
];
const ARCH_PIER_NORTH = [
  [168.75, -14.98], [169.78, -16.77], [171.08, -18.3], [172.3, -18.84], [174.25, -18.9], [175.98, -17.77],
  [177.24, -16.17], [178.04, -14.09], [178.55, -11.19], [178.49, 10.92], [178.23, 13.99], [177.7, 15.99],
  [176.99, 17.06], [175.66, 18.36], [174.59, 19.11], [173.21, 19.54], [172.44, 19.48], [171.1, 18.93],
  [169.94, 17.64], [168.03, 13.13], [167.86, 11.94], [167.74, 10.43], [167.93, -11.98],
];
const PIER_267 = [
  [-268.8, -13.43], [-268.19, -14.54], [-267.5, -14.96], [-266.38, -14.83], [-265.78, -14.17], [-265.44, -12.4],
  [-265.56, 11.59], [-265.75, 12.53], [-266.27, 13.45], [-266.75, 13.88], [-267.41, 14.02], [-267.86, 13.94],
  [-268.43, 13.47], [-268.86, 12.57], [-269.02, 11.63], [-269.17, -11.88],
];
const PIER_222 = [
  [-223.56, -14.05], [-223.08, -14.61], [-222.38, -14.96], [-221.53, -14.9], [-220.64, -13.45], [-220.41, -12.5],
  [-220.66, 12.02], [-221.05, 13.48], [-221.65, 14.01], [-222.73, 14.36], [-223.19, 14.24], [-223.83, 12.77],
  [-223.96, -12.71],
];
const PIER_276 = [
  [275.19, 14.17], [275.06, -12.17], [275.35, -13.21], [276.12, -13.81], [276.58, -13.81], [277.21, -13.55],
  [277.51, -12.57], [277.49, 12.61], [277.37, 14.15], [276.78, 14.81], [276.38, 14.97], [275.85, 14.93],
];
const PIER_322 = [
  [320.55, 14.19], [320.61, -13.32], [321.16, -13.96], [321.72, -13.97], [322.49, -13.59], [322.98, -12.75],
  [322.89, 13.7], [322.72, 14.26], [322.11, 14.96], [321.54, 15.19], [320.94, 14.9],
];
const PIER_367 = [
  [365.36, 13.64], [365.43, -12.52], [365.73, -13.46], [366.26, -13.91], [367.03, -13.99], [367.92, -13.37],
  [368.25, -12.27], [368.2, 13.71], [368.04, 14.25], [367.51, 14.88], [366.91, 15.18], [366.33, 15.09],
  [365.81, 14.66],
];
// Twee aanbrugpijlers staan niet in de BGT: op de zuidoever bij de voeg op
// x = -314 en op de noordelijke berm bij de voeg op x = 413 (luchtfoto); ze
// zijn kopieën van de buurpijler.
const PIERS = [
  { poly: shiftX(PIER_267, -314.0 + 267.29), headNap: 5.6 },
  { poly: PIER_267, headNap: 5.6 },
  { poly: PIER_222, headNap: 5.6 },
  { poly: ARCH_PIER_SOUTH, headNap: 6.4, shaft: 3.0 },
  { poly: MIDDLE_PIER, headNap: 6.3, shaft: 2.5 },
  { poly: ARCH_PIER_NORTH, headNap: 6.4, shaft: 3.0 },
  { poly: PIER_276, headNap: 6.1 },
  { poly: PIER_322, headNap: 6.1 },
  { poly: PIER_367, headNap: 6.1 },
  { poly: shiftX(PIER_367, 413.0 - 366.81), headNap: 6.1 },
];

// Twee bogen met trekband tussen de pijlerharten, elk met twee boogribben
// (kokers van 1,4 m breed en 2,0 m hoog, foto) boven de hoofdliggers, 8,4 m
// naast het midden van het dek (AHN; de BGT-liggers van de basculeklep liggen
// op dezelfde lijnen). De bovenrand is per boog een parabool boven de koorde
// tussen de opleggingen (2,6 m boven het wegdek) met de top op NAP +40,8 m
// (AHN, bovenste DSM-cellen). Tussen dek en rib hangen per boog 15 hangers op
// velden van 10,8 m (foto's); op 1:1000 is elke hanger een stijl van 1,2 m en
// de ruimte tussen dek en rib een scherm met spitse openingen (zijden van 55
// graden) tot onder de rib.
const ARCH = { crownNap: 40.8, ribEnd: 2.6, depth: 2.0 };
const RIBS = [
  [-9.35, -7.95],
  [7.45, 8.85],
];
const PANELS = 16;
const HANGER = 1.2;
const POINTED = (55 * Math.PI) / 180;
function archSpan(x) {
  return x < 0 ? [SPRINGS[0], SPRINGS[1]] : [SPRINGS[1], SPRINGS[2]];
}
function upper(x) {
  const [a, b] = archSpan(x);
  const xc = Math.min(Math.max(x, a), b);
  const ea = deckZ(a) + ARCH.ribEnd;
  const eb = deckZ(b) + ARCH.ribEnd;
  const rise = Z(ARCH.crownNap) - (ea + eb) / 2;
  const half = (b - a) / 2;
  return ea + ((eb - ea) * (xc - a)) / (b - a) + rise * (1 - ((xc - (a + b) / 2) / half) ** 2);
}
const lower = (x) => upper(x) - ARCH.depth;

// ---------- dek, pijlers, landhoofden, kelder ----------
const deck = union(
  DECK_SEGMENTS.flatMap(({ x0, x1, y0, y1 }) => {
    const steps = Math.max(2, Math.round((x1 - x0) / 2));
    return [
      bandY(x0, x1, (x) => deckZ(x) - SLAB, deckZ, y0, y1, steps),
      bandY(x0, x1, deckBottom, (x) => deckZ(x) - SLAB + 0.01, GIRDER.y0, GIRDER.y1, steps),
    ];
  }),
);
const piers = PIERS.map(({ poly, headNap, shaft }) => {
  const [x0, x1] = xRange(poly);
  const xc = (x0 + x1) / 2;
  const half = shaft ?? (x1 - x0) / 2 - 0.3;
  return union([
    prism(poly, BASE, Z(headNap)),
    stadium(xc - half, xc + half, GIRDER.y0, GIRDER.y1, Z(headNap) - 0.1, Math.max(deckBottom(xc - half), deckBottom(xc + half)) + 0.1),
  ]);
});
const abutments = [
  bandY(SOUTH_END, SOUTH_FACE, () => BASE, (x) => deckZ(x) - 0.01, DECK_SEGMENTS[0].y0, DECK_SEGMENTS[0].y1, 6),
  bandY(NORTH_FACE, NORTH_END, () => BASE, (x) => deckZ(x) - 0.01, DECK_SEGMENTS[4].y0, DECK_SEGMENTS[4].y1, 6),
];
const kelder = bandY(KELDER.x0, KELDER.x1, () => BASE, (x) => deckZ(x) - 0.02, KELDER.y0, KELDER.y1, 6);
const cabin = box(CABIN.x0, CABIN.x1, CABIN.y0, CABIN.y1, BASE, Z(CABIN.roofNap));

// ---------- bogen ----------
// De ribben lopen als band van de onderkant van de kokerligger tot de
// bovenrand van de rib; tussen de hangers zijn spitse openingen uitgespaard.
const ribXs = Array.from({ length: Math.round((SPRINGS[2] - SPRINGS[0]) / 0.5) + 1 }, (_, i) => SPRINGS[0] + i * 0.5);
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
for (let k = 0; k < 2; k++) {
  const a0 = SPRINGS[k];
  const b0 = SPRINGS[k + 1];
  for (let i = 0; i < PANELS; i++) {
    let a = a0 + ((b0 - a0) * i) / PANELS + HANGER / 2;
    let b = a0 + ((b0 - a0) * (i + 1)) / PANELS - HANGER / 2;
    const mid = (a0 + b0) / 2;
    // Bij de opleggingen is de rib te laag voor een opening over het hele
    // veld: dan versmalt de opening vanaf de lage kant (een dichte hoek bij
    // de buitenste hanger), tot minstens 2 m breed.
    let found = opening(a, b);
    while (!found && b - a > 2.25) {
      if (Math.abs(a - mid) > Math.abs(b - mid)) a += 0.25;
      else b -= 0.25;
      found = opening(a, b);
    }
    if (found) openings.push(found);
  }
}
const ribs = RIBS.map(([y0, y1]) => {
  const band = profileY(
    [...ribXs.map((x) => [x, deckBottom(x)]), ...[...ribXs].reverse().map((x) => [x, upper(x)])],
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

const bridge = union([deck, ...piers, ...abutments, kelder, cabin, ...ribs]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij en de fiets- en voetpaden kragen 2,3
// tot 3,7 m uit. Net als de overhangopvulling van de export krijgt de STL
// daaronder een wig van 50 graden vanaf de randen van de plaat die uitloopt
// in een scherm van 0,9 m tot de onderplaat.
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
// Het scherm staat onder het midden van de kokerligger; waar de ligger (bij
// de basculeklep) dieper hangt dan de wig van 50 graden, wordt die kant van
// de wig steiler, zodat hij onder de hoeken van de ligger door loopt.
const footStations = footXs.map((x) => {
  const { y0, y1 } = deckY(x);
  const zb = deckZ(x) - SLAB + 0.02;
  const zg = deckBottom(x) - 0.05;
  const ym = (GIRDER.y0 + GIRDER.y1) / 2;
  const yL = y0 - 0.02;
  const yR = y1 + 0.02;
  const kL = Math.max(Math.tan(KNEE), (zb - zg) / (GIRDER.y0 - 0.02 - yL));
  const kR = Math.max(Math.tan(KNEE), (zb - zg) / (yR - GIRDER.y1 - 0.02));
  const zsL = zb - kL * (ym - SCREEN - yL);
  const zsR = zb - kR * (yR - ym - SCREEN);
  const left =
    zsL > BASE + 0.05
      ? [[ym - SCREEN, BASE], [ym - SCREEN, zsL]]
      : (() => {
          const a = yL + (zb - BASE) / kL;
          return [[a, BASE], [a - 1e-3, BASE + 1e-3]];
        })();
  const right =
    zsR > BASE + 0.05
      ? [[ym + SCREEN, BASE], [ym + SCREEN, zsR]]
      : (() => {
          const a = yR - (zb - BASE) / kR;
          return [[a, BASE], [a + 1e-3, BASE + 1e-3]];
        })();
  const section = [left[0], right[0], right[1], [yR, zb], [yL, zb], left[1]];
  return { x, section };
});
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);

// ---------- rijbaan en fietspad als eigen onderdelen ----------
// De bovenste 0,5 m van het wegdek is per BGT-functie een eigen node met de
// attributen van het actuele BGT-wegdeel erop (relatieve hoogteligging 1,
// glTF `extras.attributes`), zodat de kleurregels van een thema (fietspaden
// rood) op het brugdek werken zoals op de PDOK-wegdelen ernaast. Pas na het
// printmodel opgebouwd, zodat de STL het hele brugmodel ongewijzigd bevat.
//
// De BGT legt op het dek (x = -358 tot 431,5) twee rijbanen autosnelweg
// (L0002.4a58589c94d0482fa1122d24ed1135bb oost en
// L0002.d16fa89b9372472a8dec20bef16557c4 west, gesloten verharding) en twee
// fietspaden (L0002.3432c715f819407b91b0450bb8cc29cb oost en
// L0002.86ba0191d2c84652aa5510895491b912 west, gesloten verharding), met
// smalle stroken open verharding: fietspad langs de buitenrand
// (L0002.e98ae840f64c491ea0ad9199041b2f5f, L0002.cf65a676e9644309b5de3de305215753)
// en tussen rijbaan en fietspad (L0002.00079d4b75094a3c9511f897cad01b51,
// L0002.b97c63ed218f4b8dae297fcf7711d7ea), rijbaan langs het westelijke
// fietspad ten noorden van de bogen (L0002.7913201533ba46dc85c10066ef4472af).
// Eén node per functie: die stroken krijgen het fysieke voorkomen van het
// hoofdvlak (gesloten verharding). De bermen (ondersteunend wegdeel, open
// verharding) tussen rijbaan en fietspad horen bij de rijbaan.
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan autosnelweg", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
// Binnenrand van de fietspaden (lokale coördinaten, vereenvoudigd tot 5 cm):
// de grens met rijbaan of berm, van zuid naar noord, met sprongen waar de
// BGT-vlakken wisselen. Onder de bogen legt de BGT de grens 0,2 tot 0,9 m
// naast het midden van de rib; daar ligt hij in het model op de rib, die
// constructie blijft, zodat er geen strookje rijbaan tussen rib en fietspad
// overblijft. Voorbij de einden van het BGT-dek (de landhoofden) loopt de
// laatste waarde door.
const LAYER = 0.5;
const ABOVE = 1.0;
const RIB_MID = RIBS.map(([y0, y1]) => (y0 + y1) / 2);
const BIKE_EAST_EDGE = [
  // L0002.3432c715f819407b91b0450bb8cc29cb, zuidelijke aanbruggen.
  [-358.19, -8.99], [-351.37, -9.06], [-328.87, -9.06], [-240.62, -8.92], [-176.9, -9.54],
  // Onder de bogen: op de oostelijke rib.
  [-176.9, RIB_MID[0]], [176.6, RIB_MID[0]],
  // L0002.00079d4b75094a3c9511f897cad01b51 (open verharding), basculebrug en noordelijke aanbruggen.
  [176.6, -7.39], [241.86, -7.26], [279.46, -7.05], [317.13, -7.05], [414.11, -6.81],
  // L0002.3432c715f819407b91b0450bb8cc29cb, voorbij de berm L0002.8abeacd5439b755ab052adc1f1dc1736.
  [414.11, -8.04], [431.41, -8.08],
];
const BIKE_WEST_EDGE = [
  // L0002.b97c63ed218f4b8dae297fcf7711d7ea (open verharding), voorbij de berm L0002.8abeacd5439b75789d51cb66c36efabc.
  [-358.14, 6.93], [-355.06, 6.94], [-323.82, 7.09], [-284.15, 7.07], [-238.77, 7.2], [-176.94, 7.22],
  // Onder de bogen: op de westelijke rib.
  [-176.94, RIB_MID[1]], [176.55, RIB_MID[1]],
  // L0002.86ba0191d2c84652aa5510895491b912, voorbij de rijbaanstrook L0002.7913201533ba46dc85c10066ef4472af.
  [176.55, 9.03], [209.87, 9.2], [240.35, 9.16], [273.65, 8.83], [304.41, 8.8], [397.35, 8.96], [421.16, 9.13],
  [431.47, 9.12],
];
const OUT_X = [SOUTH_END - 5, NORTH_END + 5];
const bikeRegion = (edge, side) => [
  [OUT_X[0], edge[0][1]],
  ...edge,
  [OUT_X[1], edge[edge.length - 1][1]],
  [OUT_X[1], side * 40],
  [OUT_X[0], side * 40],
];
const bikePaths = union([prism(bikeRegion(BIKE_EAST_EDGE, -1), BASE - 1, 100), prism(bikeRegion(BIKE_WEST_EDGE, 1), BASE - 1, 100)]);
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, over de stations van
// het dek (om de 2 m van het DSM-profiel, plus de voegen tussen de dekdelen),
// over de volle breedte en 0,5 m voorbij de einden van de landhoofden: zo
// snijdt hij het hele bovenvlak uit de constructie en houdt die op het wegdek
// geen vlak zonder dikte over (z-fighting op de kaart). Het wegdeel is de
// strook binnen de brug.
const layerXs = [
  OUT_X[0],
  ...DECK_NAP.map((_, i) => DECK_X0 + 2 * i),
  ...DECK_SEGMENTS.flatMap(({ x0, x1 }) => [x0, x1]),
  OUT_X[1],
]
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-3);
const layerStrip = loftX(
  layerXs.map((x) => {
    const zt = deckZ(x);
    return { x, section: [[-40, zt - LAYER], [40, zt - LAYER], [40, zt + ABOVE], [-40, zt + ABOVE]] };
  }),
);
// Wat boven het dek uitsteekt of ernaast in de strook valt, blijft met 2 cm
// vrij constructie: de hele strook van elke boogrib (ook onder de openingen
// van het hangerscherm) en de delen van de basculekelder en het
// bedieningshuis buiten het dek (de kelder reikt tot 2 cm onder het wegdek).
const ribGuards = RIBS.map(([y0, y1]) => {
  const xs = [SPRINGS[0] - 0.02, ...ribXs, SPRINGS[2] + 0.02];
  return profileY([...xs.map((x) => [x, deckBottom(x) - 0.02]), ...[...xs].reverse().map((x) => [x, upper(x) + 0.02])], y0 - 0.02, y1 + 0.02);
});
const kelderGuards = [
  box(KELDER.x0 - 0.02, KELDER.x1 + 0.02, -40, DECK_SEGMENTS[3].y0, BASE - 1, 60),
  box(KELDER.x0 - 0.02, KELDER.x1 + 0.02, DECK_SEGMENTS[3].y1, 40, BASE - 1, 60),
];
const notLayer = union([...ribGuards, ...kelderGuards]);
const layer = layerStrip.subtract(notLayer);
const roadCut = layer.subtract(bikePaths);
const bikeCut = layer.intersect(bikePaths);
const roadway = roadCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const structure = bridge.subtract(layer);
const parts = [
  ["building:merwedebrug-gorinchem", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];
// De onderdelen tellen op tot de brug als geheel (geen overlap, niets kwijt).
const partition = {
  bridgeM3: +bridge.volume().toFixed(1),
  partsM3: Object.fromEntries(parts.map(([name, solid]) => [name, +solid.volume().toFixed(1)])),
};
partition.sumM3 = +parts.reduce((sum, [, solid]) => sum + solid.volume(), 0).toFixed(1);
partition.overlapM3 = +union(parts.slice(1).map(([, solid]) => solid)).intersect(structure).volume().toFixed(3);
if (Math.abs(partition.sumM3 - partition.bridgeM3) > 0.5 || partition.overlapM3 > 0.01) {
  throw new Error(`onderdelen tellen niet op: ${JSON.stringify(partition)}`);
}
console.log("partitie (m3):", JSON.stringify(partition));

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van de kokerligger en van de uitkragende plaat,
// in de printversie geen.
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
  const { area, found } = overhangs(bridge);
  for (const p of found) {
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    // Onderkant van de kokerligger (ook de sprongen bij de boogpijlers en de
    // klep) en van de uitkragende plaat.
    const onDeck = Math.abs(zMid - deckBottom(xMid)) < 0.7 || Math.abs(zMid - (deckZ(xMid) - SLAB)) < 0.06;
    if (!onDeck) throw new Error(`overhang buiten het dek op x ${xMid.toFixed(2)}, z ${zMid.toFixed(2)}`);
  }
  console.log("vrij hangend (m2):", Math.round(area));
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2));
  if (print.area > 1) {
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
report.partition = partition;
report.arches = {
  crownNap: SPRINGS.slice(0, 2).map((a, k) => {
    let best = -Infinity;
    for (let x = a; x <= SPRINGS[k + 1]; x += 0.1) best = Math.max(best, upper(x));
    return +(best + WATER_NAP).toFixed(2);
  }),
  hangersPerArch: PANELS - 1,
  openings: openings.length,
  openingApexNap: openings.map(({ apex }) => +(apex + WATER_NAP).toFixed(1)),
  deckUndersideNapAtCrowns: [-86.6, 86.6].map((x) => +(deckBottom(x) + WATER_NAP).toFixed(2)),
  leafUndersideNap: [LEAF.x0 + 0.1, (LEAF.x0 + LEAF.x1) / 2, LEAF.x1 - 0.1].map((x) => +(deckBottom(x) + WATER_NAP).toFixed(2)),
};
const glbFile = path.join(outDir, "merwedebrug-gorinchem.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-merwedebrug-gorinchem.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden, kelder en
// printvoet op het printbed.
const stlName = `merwedebrug-gorinchem-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Merwedebrug Gorinchem 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten op het
// water: 25 m naast de as langs de rivier en twee op het water naast de
// noordelijke aanbrug.
const samplePoints = [
  ...[-280, -170, -85, 0, 85, 170].flatMap((x) => [
    [x, 25],
    [x, -25],
  ]),
  [320, -25],
  [380, -25],
];
await writeFile(
  path.join(outDir, "merwedebrug-gorinchem.json"),
  JSON.stringify(
    {
      name: "Merwedebrug (Boven-Merwede)",
      file: "merwedebrug-gorinchem.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [124340.0, 426609.4],
      xAxis: [0.22495, 0.97437],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0512100000046976"],
      replacesTerrain: [
        "G0512.1d925003c886210ee0534802010aa4ba",
        "G0512.1d925003c887210ee0534802010aa4ba",
        "L0002.e8cec8975dc940e68d58b6e076c684ce",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek boven de middelste rivierpijler op de waterspiegel van de Boven-Merwede (z = 0, NAP +0,55 m) in de oorsprong, +X langs de brug naar het noordnoordoosten (Gorinchem, RD-richting 77,0 graden vanaf het oosten) en +Y stroomafwaarts naar het westnoordwesten. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van het wegdek met de attributen van het BGT-wegdeel erop in extras.attributes (bgt_functie rijbaan autosnelweg of fietspad, bgt_fysiekvoorkomen gesloten verharding; het fietspad aan beide kanten buiten de rijbaan, onder de bogen buiten de ribben), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het dek van 24,5 tot 25,5 m breed van het zuidelijke landhoofd bij Sleeuwijk (x = -380) tot het noordelijke bij Gorinchem (x = 442), met het wegdek op NAP +12,4 tot +17,6 m en een kokerligger onder de uitkragende fiets- en voetpaden; twee bogen met trekband van 173,2 m tussen de pijlerharten x = -173,2, 0 en 173,2, elk met twee boogribben van 1,4 m boven de hoofdliggers en de top op NAP +40,8 m, en per boog 15 hangers als een scherm met spitse openingen tussen dek en rib; de drie rivierpijlers met caissons tot NAP +6,4 m en een smallere schacht; vier aanbruggen aan de zuidkant en vijf aan de noordkant op wandpijlers; de basculeklep van 30,9 m, de basculekelder en het bedieningshuis (BAG-pand, dak op NAP +21,5 m). Het windverband en de portalen tussen de ribben, de seinportalen, leuningen en lantaarns zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NORTH_END - SOUTH_END).toFixed(1),
        deckLengthM: +(NORTH_FACE - SOUTH_FACE).toFixed(1),
        deckWidthM: DECK_SEGMENTS.map(({ y0, y1 }) => +(y1 - y0).toFixed(2)),
        archSpanPierCentresM: +(SPRINGS[1] - SPRINGS[0]).toFixed(1),
        archCrownNapM: ARCH.crownNap,
        ribsFromDeckCentreM: 8.4,
        hangerPanelM: +((SPRINGS[1] - SPRINGS[0]) / PANELS).toFixed(2),
        bascule: { fromM: LEAF.x0, toM: LEAF.x1 },
        pierCentresM: PIERS.map(({ poly }) => {
          const [x0, x1] = xRange(poly);
          return +((x0 + x1) / 2).toFixed(1);
        }),
        deckNapM: { south: DECK_NAP[0], crest: Math.max(...DECK_NAP), north: DECK_NAP[DECK_NAP.length - 1] },
        cabinRoofNapM: CABIN.roofNap,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Merwedebrug_(Boven-Merwede)",
        "PDOK BGT overbruggingsdeel (dek, rivierpijlers, aanbrugpijlers, liggers van de basculeklep), EPSG:28992",
        "PDOK BAG pand 0512100000046976 (bedieningshuis)",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de boogribben, de pijlerkoppen en het bedieningshuis; PDOK-luchtfoto voor de voegen en de kelder",
        "Wikimedia Commons: Merwedebrug - RWS 364426.jpg, Merwedebrug bridge Gorinchem 1.JPG, Merwedebrug bridge Gorinchem 2.JPG, Merwedebrug (01).JPG, Merwede, Merwedebrug.jpg, Merwedebrug Sleeuwijk.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

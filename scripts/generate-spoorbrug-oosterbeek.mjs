// Genereert een vereenvoudigd, gesloten 3D-model van de Spoorbrug Oosterbeek:
// de dubbelsporige spoorbrug van de lijn Arnhem - Nijmegen over de Nederrijn
// tussen Oosterbeek/Rosandepolder (noord) en Arnhem-Zuid (Elderveld en
// Schuytgraaf), in deze vorm sinds 1952 (de vijfde brug op deze plek). Over de
// rivier ligt een stalen boogbrug van 132,6 m tussen de pijlermiddens met twee
// vakwerkbogen (boven- en onderrand met stijlen en diagonalen, 24 velden), de
// onderrand die 6,5 m binnen de eindstijlen op het dek uitkomt, hangers op de
// knopen en een windverband tussen de bovenranden; aan de zuidkant één en aan
// de noordkant vijf stalen aanbruggen van circa 58 m (vakwerkliggers onder het
// spoor, vijf V-velden met stijlen), aan de zuidkant een kort veld op het
// landhoofd en aan de noordkant de aanbrug uit 2004 (Movares, architect Jos
// van den Hende): zeven staalbetonbruggen van circa 50 m met een betonnen dek
// op twee schuine buisvakwerken, tot het noordelijke landhoofd. Alle maten in
// het script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog,
// nodes met de materiaalklasse in de nodenaam: de constructie, en het spoor met
// de attributen van de BGT-wegdelen) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal> met een printvoet
// onder het dek.
//
//   node scripts/generate-spoorbrug-oosterbeek.mjs              # STL op 1:2500 (standaard)
//   node scripts/generate-spoorbrug-oosterbeek.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het dek midden tussen de twee
// rivierpijlers van de boog (RD 187103,53, 442490,13), op de waterspiegel van
// de Nederrijn zoals het PDOK-terrein die legt (NAP +8,25 m), Z omhoog. +X
// loopt langs de brug naar het noordnoordoosten (Oosterbeek, RD-richting
// 69,41 graden vanaf het oosten), +Y naar links, stroomafwaarts naar het
// westnoordwesten. De boogpijlers staan op x = -69,5 tot -63,1 en 63,3 tot
// 69,4, de eindstijlen van de boog op x = ±66,3. Het zuidelijke landhoofd
// begint op x = -144,7, het noordelijke landhoofd ligt van x = 714,1 tot 717.
//
// Bronnen: BGT overbruggingsdeel (dek van de brug uit 1952 en van de aanbrug
// uit 2004, de pijlers met ronde en spitse koppen, het zuidelijke landhoofd
// en de brede pijlers met bordes op x = -127 en 356); BGT wegdeel (spoorbaan:
// gesloten verharding op de stalen brug, half verhard op het landhoofd en de
// aanbrug van 2004); BGT spoor (as van de twee sporen, 4,06 m uit elkaar);
// AHN DSM 0,5 m (PDOK WCS) voor de spoorhoogte (NAP +22,45 m op de stalen
// brug, +22,3 m op het zuidelijke landhoofd, +22,2 m op de aanbrug van 2004),
// de bovenrand van de bogen (top NAP +48,9 m, NAP +31,9 m op de eindstijlen,
// portaal over de volle breedte), de plaats van de bogen (hart 4,75 m naast de
// as), de looppaden buiten de bogen (tot 6,3 m naast de as) en de onderkant
// van de aanbruggen (circa NAP +16,3 m); PDOK-terrein voor de waterspiegel
// (51,79 m ellipsoïdisch; het PDOK-terrein ligt hier 43,54 m boven het AHN);
// Wikipedia (vijf aanbruggen aan de noordzijde, een boogbrug en een aanbrug
// aan de zuidzijde, aanbruggen van 56 m, hoofdoverspanning 132 m, nieuwe
// aanbruggen van 2004 als zeven staalbetonbruggen met stalen vakwerk) en
// Wikimedia Commons-foto's (Spoorbrug over de Nederrijn ter hoogte van
// Oosterbeek.jpg, Arnhem-Meinerswijk, Spoorbrug Oosterbeek tijdens hoogwater
// en ijs IMG 8164.jpg, Railway bridge Arnhem (2).JPG en (3).JPG, 2007-01-14
// 12.14 Arnhem, spoorbrug.JPG, Arnhem-Zuid Neder-Rijn NS 1764 met DD-AR 7374
// (29423434454).jpg, Modern railwaybridge architecture gives rather nice
// shaped structures - panoramio.jpg, VIRM Rijnbrug Oosterbeek.JPG) voor de
// vakwerkbogen, de velden, de hangers, de aanbruggen en de pijlers. Geschat
// zijn de onderrand van de boog (6,0 m onder de bovenrand in de top, op het
// dek 6,5 m binnen de eindstijlen; uit foto's), de 24 velden van 5,525 m, de
// staafmaten (randen 1,0 m hoog en 1,2 m breed, stijlen en hangers 0,9 m,
// plaat 1,0 m), de hoogte van het brugdek en de trekbalk (2,2 m), de
// vakwerkliggers van de aanbruggen (6,2 m hoog vanaf het spoor, vijf V-velden),
// de aanbrug van 2004 (dek 1,8 m, vakwerken 3,9 m hoog en 29 graden schuin,
// velden van 5,5 m, pijlers op gelijke afstanden van 49,7 m omdat ze niet in
// de BGT staan) en de hoogte van het metselwerk van de pijlers.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "spoorbrug-oosterbeek");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const rad = (deg) => (deg * Math.PI) / 180;
const T50 = Math.tan(rad(50));
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const polyArea = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return Math.abs(area) / 2;
};
// Polygoon of CrossSection in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (shape, y0, y1) =>
  Manifold.extrude(shape instanceof CrossSection ? shape : [ccw(shape)], y1 - y0)
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
const hullPoly = (poly) => new CrossSection([ccw(poly)]).hull().toPolygons()[0].map(([x, y]) => [x, y]);
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
// Halfvlak (in het XZ-vlak) aan de kant van `side` van de lijn door p en q,
// `off` meter van de lijn af.
function halfPlane(p, q, side, off = 0) {
  const d = [q[0] - p[0], q[1] - p[1]];
  const len = Math.hypot(d[0], d[1]);
  const u = [d[0] / len, d[1] / len];
  let n = [-u[1], u[0]];
  if ((side[0] - p[0]) * n[0] + (side[1] - p[1]) * n[1] < 0) n = [-n[0], -n[1]];
  const L = 400;
  const a = [p[0] + n[0] * off, p[1] + n[1] * off];
  return new CrossSection([
    ccw([
      [a[0] - u[0] * L, a[1] - u[1] * L],
      [a[0] + u[0] * L, a[1] + u[1] * L],
      [a[0] + u[0] * L + n[0] * L, a[1] + u[1] * L + n[1] * L],
      [a[0] - u[0] * L + n[0] * L, a[1] - u[1] * L + n[1] * L],
    ]),
  ]);
}
// Spitse hoeken (< 80 graden) van een opening of nis tussen twee schuine of
// vlakke randen krijgen een kort verticaal stuk van `h` meter: anders blijft
// in de hoek een spleet die dunner is dan 1 cm (een vlak zonder dikte voor de
// z-fightingcontrole).
function bluntAcute(poly, h = 0.15) {
  const pts = ccw(poly);
  const n = pts.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    const v = pts[i];
    const prev = pts[(i + n - 1) % n];
    const next = pts[(i + 1) % n];
    const a = [prev[0] - v[0], prev[1] - v[1]];
    const b = [next[0] - v[0], next[1] - v[1]];
    const cross = (v[0] - prev[0]) * (next[1] - v[1]) - (v[1] - prev[1]) * (next[0] - v[0]);
    const ang = Math.acos((a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b)));
    if (cross <= 0 || ang > rad(80) || Math.abs(a[0]) < 1e-6 || Math.abs(b[0]) < 1e-6) {
      out.push(v);
      continue;
    }
    const steepIsA = Math.abs(a[1] / a[0]) > Math.abs(b[1] / b[0]);
    const st = steepIsA ? a : b;
    const fl = steepIsA ? b : a;
    if (Math.abs(st[1]) < 2 * h) {
      out.push(v);
      continue;
    }
    const ts = h / Math.abs(st[1]);
    const qs = [v[0] + st[0] * ts, v[1] + st[1] * ts];
    const tf = (qs[0] - v[0]) / fl[0];
    if (tf <= 0 || tf >= 1) {
      out.push(v);
      continue;
    }
    const qf = [v[0] + fl[0] * tf, v[1] + fl[1] * tf];
    if (steepIsA) out.push(qs, qf);
    else out.push(qf, qs);
  }
  return out;
}
const pieces = (cs, minArea) =>
  cs
    .toPolygons()
    .map((p) => p.map(([x, z]) => [x, z]))
    .filter((p) => polyArea(p) > minArea);

// ---------- hoogtes ----------
// PDOK legt de Nederrijn bij de brug op 51,79 m ellipsoïdisch; het
// PDOK-terrein ligt hier 43,54 m boven het AHN (NAP), dus NAP +8,25 m.
const WATER_NAP = 8.25;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// PDOK-hoogte (ellipsoïdisch) van het water op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 51.79;

// Bovenkant dek (spoorstaaf, ballast) in NAP uit het AHN: NAP +22,3 m op het
// zuidelijke landhoofd, +22,45 m op de stalen brug van 1952, +22,2 m op de
// aanbrug van 2004; ertussen lineair over het korte veld en de overgangspijler.
const DECK_NAP = [
  [-144.73, 22.3],
  [-138.62, 22.3],
  [-129.27, 22.45],
  [352.72, 22.45],
  [359.67, 22.2],
  [717.0, 22.2],
];
const DECK_XS = DECK_NAP.map(([x]) => x);
function deckNap(x) {
  if (x <= DECK_NAP[0][0]) return DECK_NAP[0][1];
  for (let i = 0; i + 1 < DECK_NAP.length; i++) {
    const [x0, z0] = DECK_NAP[i];
    const [x1, z1] = DECK_NAP[i + 1];
    if (x <= x1) return z0 + ((z1 - z0) * (x - x0)) / (x1 - x0);
  }
  return DECK_NAP[DECK_NAP.length - 1][1];
}
const deckZ = (x) => Z(deckNap(x));
const D_OLD = Z(22.45);
// Stations voor lofts over [a, b]: de uiteinden en de knikken van het dek.
const deckStations = (a, b) => sortedUnique([a, b, ...DECK_XS.filter((x) => x > a && x < b)]);

// ---------- pijlers en landhoofden (BGT, lokale coördinaten) ----------
const SOUTH_ABUTMENT = [[-144.73, 5.27], [-144.65, -5.12], [-138.62, -5.12], [-138.71, 5.29]];
// Brede pijler met bordes tussen het korte veld en de zuidelijke aanbrug.
const SOUTH_PIER = [[-129.26, 3.9], [-129.18, -9.34], [-124.75, -9.29], [-124.88, 8.98], [-129.25, 9.03]];
// Rivierpijlers van de boog met ronde koppen.
const ARCH_PIERS = [
  [
    [-69.47, 1.97], [-69.36, -5.2], [-69.17, -8.31], [-68.78, -9.3], [-68.0, -10.13], [-66.68, -10.65], [-65.3, -10.48],
    [-64.27, -9.86], [-63.48, -8.4], [-63.38, -7.88], [-63.11, 6.16], [-63.38, 8.5], [-63.79, 9.13], [-64.42, 9.69],
    [-65.23, 10.08], [-66.89, 10.23], [-67.45, 10.18], [-68.29, 9.75], [-68.88, 8.96], [-69.28, 8.23], [-69.53, 5.87],
  ],
  [
    [63.27, -7.86], [63.77, -8.98], [64.31, -9.61], [65.27, -10.15], [66.29, -10.38], [67.03, -10.32], [68.21, -9.88],
    [68.8, -9.16], [69.16, -8.54], [69.38, -6.02], [69.31, 7.54], [68.98, 8.47], [68.19, 9.37], [67.22, 9.78],
    [65.66, 9.73], [64.84, 9.29], [64.03, 8.5], [63.6, 7.48], [63.48, 5.92],
  ],
];
// Pijlers van de noordelijke aanbruggen met spitse koppen.
const APPROACH_PIERS = [
  [[127.07, 5.25], [126.83, 6.32], [124.89, 7.92], [124.63, 7.92], [123.17, 6.69], [123.0, 5.26], [122.71, -4.96], [122.81, -5.95], [123.88, -7.22], [124.82, -8.14], [125.01, -8.14], [126.99, -6.26], [127.19, -5.04]],
  [[183.01, 7.88], [182.88, 8.01], [182.66, 8.08], [181.18, 6.62], [180.41, -0.05], [180.28, -5.02], [180.33, -5.75], [180.68, -6.24], [182.47, -8.12], [182.81, -8.25], [184.43, -6.6], [184.79, -6.08], [184.95, -5.46], [184.81, 5.98]],
  [[238.11, 6.13], [237.88, -4.79], [237.99, -5.79], [238.24, -6.33], [240.15, -8.31], [240.34, -8.22], [241.62, -6.97], [242.35, -5.89], [242.51, -4.79], [242.53, 5.21], [242.17, 6.13], [240.28, 7.87], [239.99, 7.91]],
  [[295.48, -0.77], [295.52, -5.73], [297.74, -8.35], [300.04, -5.72], [299.85, 5.74], [297.95, 8.22], [295.43, 5.86]],
];
// Overgangspijler met bordes tussen de stalen brug en de aanbrug van 2004, en
// de eerste pijler van de aanbrug van 2004.
const TRANSITION_PIER = [[359.61, 9.17], [355.31, 9.16], [355.32, 7.57], [352.72, 7.56], [352.72, 7.26], [355.2, 7.27], [355.24, -7.25], [352.76, -7.26], [352.76, -7.56], [355.36, -7.55], [355.37, -9.14], [359.67, -9.13]];
const NEW_FIRST_PIER = [[368.03, 4.14], [366.03, 4.14], [366.02, 7.04], [364.02, 7.03], [364.06, -6.97], [366.06, -6.96], [366.05, -4.06], [368.05, -4.05]];
const NORTH_DECK_END = 714.11; // einde van het BGT-dek
const NORTH_ABUTMENT = { x0: NORTH_DECK_END - 0.3, x1: 717.0, y0: -6.5, y1: 6.5 };

// Pijlermiddens (BGT) en velden.
const PIER_X = { south: -127.01, archS: -66.32, archN: 66.33, a1: 124.95, a2: 182.6, a3: 240.2, a4: 297.74, transition: 356.2, newFirst: 366.04 };

// ---------- boog ----------
// Twee vakwerkbogen met het hart 4,75 m naast de as (AHN), plaat 1,0 m dik
// (|y| 4,25 tot 5,25), randen 1,2 m breed. Bovenrand (AHN, kleinste
// kwadraten op het maximum per 2 m): z = 48,9 - k x^2 + q x^4 in NAP, op de
// eindstijlen (x = ±66,3) NAP +31,9 m. Onderrand (foto's): onderkant 6,0 m
// onder de bovenrand in de top, op het dek 6,5 m binnen de eindstijlen.
const ARCH = { end: 66.3, crownNap: 48.9, k: 0.004174, q: 7.0e-8, lowCrownNap: 42.9, la: 0.004316, lb: 3.92e-7, y: 4.75, plate: 1.0, chordW: 1.2, chordH: 1.0 };
const topNap = (x) => ARCH.crownNap - ARCH.k * x * x + ARCH.q * x ** 4;
const archTop = (x) => Z(topNap(x));
const lowNap = (x) => ARCH.lowCrownNap - ARCH.la * x * x - ARCH.lb * x ** 4;
const archLow = (x) => Z(lowNap(x)); // onderkant van de onderrand
const RIB_IN = ARCH.y - ARCH.plate / 2;
const RIB_OUT = ARCH.y + ARCH.plate / 2;
const CHORD_IN = ARCH.y - ARCH.chordW / 2;
const CHORD_OUT = ARCH.y + ARCH.chordW / 2;
const END_POST = 1.2; // breedte van de eindstijl
const POST = 0.9; // breedte van stijlen en hangers
const PANELS = 24;
const PANEL = (2 * ARCH.end) / PANELS; // 5,525 m
const NODES = Array.from({ length: PANELS + 1 }, (_, i) => -ARCH.end + i * PANEL);
const halfPost = (i) => (i === 0 || i === PANELS ? END_POST / 2 : POST / 2);
const ARCH_X0 = -ARCH.end - END_POST / 2;
const ARCH_X1 = ARCH.end + END_POST / 2;
// Brugdek onder de boog: plaat tussen de bogen 1,4 m dik, trekbalk in het
// vlak van de boog van 2,2 m onder tot 0,9 m boven het spoor, looppad buiten
// de bogen tot 6,3 m naast de as met een schuine onderkant (50 graden).
const ARCH_DECK = { slab: 1.4, tieDown: 2.2, tieUp: 0.9, walk: 6.3, walkT: 0.5 };
const TIE_TOP = D_OLD + ARCH_DECK.tieUp;
// Plaats waar de onderrand het dek raakt.
function lowMeetsDeck() {
  let lo = 0;
  let hi = ARCH.end;
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    if (archLow(m) > D_OLD) lo = m;
    else hi = m;
  }
  return lo;
}
const LOW_END = lowMeetsDeck();
// Onderkant van de vakwerkvelden: de bovenkant van de onderrand of, bij de
// eindstijlen, de bovenkant van de trekbalk.
const panelFloor = (x) => Math.max(archLow(x) + ARCH.chordH, TIE_TOP);
const panelCeil = (x) => archTop(x) - ARCH.chordH;

// Doorgaande openingen en nissen in de vakwerkvelden tussen de randen. Per
// veld loopt een diagonaal van de bovenhoek aan de buitenkant (eindstijl-kant)
// naar de onderhoek aan de binnenkant; de driehoek onder de diagonaal (top
// tegen de stijl) is een doorgaande opening met een flank van minstens 50
// graden, de driehoek erboven (vlakke bovenkant tegen de rand) een blinde nis.
const ribThrough = [];
const ribNiches = [];
for (let i = 0; i < PANELS; i++) {
  const xL = NODES[i];
  const xR = NODES[i + 1];
  const outerLeft = (xL + xR) / 2 < 0;
  const sgn = outerLeft ? 1 : -1; // richting naar binnen
  const xOutC = outerLeft ? xL : xR;
  const xInC = outerLeft ? xR : xL;
  const xo = xOutC + sgn * halfPost(outerLeft ? i : i + 1);
  const xi = xInC - sgn * halfPost(outerLeft ? i + 1 : i);
  const xs = range(Math.min(xo, xi), Math.max(xo, xi), 0.25);
  const quad = [...xs.map((x) => [x, panelCeil(x)]), ...[...xs].reverse().map((x) => [x, panelFloor(x)])];
  if (Math.min(...xs.map((x) => panelCeil(x) - panelFloor(x))) < 1.2) continue;
  const quadCs = new CrossSection([ccw(quad)]);
  const dTop = [xOutC, archTop(xOutC) - ARCH.chordH / 2];
  const dBot = [xInC, Math.max(archLow(xInC) + ARCH.chordH / 2, TIE_TOP - 0.4)];
  const below = [xo + sgn * 0.05, panelFloor(xo) + 0.05];
  const above = [xi - sgn * 0.05, panelCeil(xi) - 0.05];
  // Flank van 50 graden vanaf de bovenhoek tegen de stijl.
  const pTop = [xo, panelCeil(xo)];
  const p50 = [xo + sgn * 10, panelCeil(xo) - 10 * T50];
  const through = quadCs
    .intersect(halfPlane(dTop, dBot, below, 0.5))
    .intersect(halfPlane(pTop, p50, below, 0));
  for (const p of pieces(through, 0.8)) ribThrough.push(bluntAcute(p));
  const niche = quadCs.intersect(halfPlane(dTop, dBot, above, 0.5));
  for (const p of pieces(niche, 0.8)) ribNiches.push(bluntAcute(p));
}
// Hangers op de knopen waar de onderrand minstens 2 m boven de trekbalk ligt;
// ertussen spitse openingen (flanken van 50 graden) tot onder de onderrand.
const HANGER_NODES = NODES.filter((x) => archLow(x) - TIE_TOP > 2.0);
const screenHoles = [];
const screenApex = [];
for (let i = 0; i + 1 < HANGER_NODES.length; i++) {
  const a = HANGER_NODES[i] + POST / 2;
  const b = HANGER_NODES[i + 1] - POST / 2;
  let shoulder = Infinity;
  for (let k = 0; k <= 200; k++) {
    const x = a + ((b - a) * k) / 200;
    shoulder = Math.min(shoulder, archLow(x) - 0.05 - T50 * Math.min(x - a, b - x));
  }
  if (shoulder < TIE_TOP + 1.0) continue;
  const apex = shoulder + (T50 * (b - a)) / 2;
  screenHoles.push([[a, TIE_TOP], [b, TIE_TOP], [b, shoulder], [(a + b) / 2, apex], [a, shoulder]]);
  screenApex.push(+(apex + WATER_NAP).toFixed(2));
}
// Tussen de buitenste hanger en de plek waar de onderrand op het dek komt een
// driehoekige opening met de top tegen de hanger en een flank van 50 graden.
for (const sgn of [-1, 1]) {
  const xa = sgn > 0 ? HANGER_NODES[HANGER_NODES.length - 1] + POST / 2 : HANGER_NODES[0] - POST / 2;
  const zTop = archLow(xa) - 0.3;
  const run = (zTop - TIE_TOP) / T50;
  if (zTop - TIE_TOP > 1.0) screenHoles.push(bluntAcute([[xa, TIE_TOP], [xa + sgn * run, TIE_TOP], [xa, zTop]]));
}

// Zijwand van de boog (één vlak per kant): van binnen de trekbalk tot de
// bovenrand, van eindstijl tot eindstijl, met de openingen en nissen.
const wallXs = range(ARCH_X0, ARCH_X1, 0.5);
const wallOutline = [[ARCH_X0, D_OLD + 0.5], [ARCH_X1, D_OLD + 0.5], ...[...wallXs].reverse().map((x) => [x, archTop(x)])];
const lowXs = range(-LOW_END, LOW_END, 0.5);
function archWall(side) {
  const y0 = side > 0 ? RIB_IN : -RIB_OUT;
  const y1 = side > 0 ? RIB_OUT : -RIB_IN;
  const plate = profileY(wallOutline, y0, y1);
  const through = [...ribThrough, ...screenHoles].map((h) => profileY(h, y0 - 0.5, y1 + 0.5));
  const nicheY = side > 0 ? [RIB_OUT - 0.35, RIB_OUT + 0.5] : [-RIB_OUT - 0.5, -RIB_OUT + 0.35];
  const niches = ribNiches.map((h) => profileY(h, nicheY[0], nicheY[1]));
  const cy0 = side > 0 ? CHORD_IN : -CHORD_OUT;
  const cy1 = side > 0 ? CHORD_OUT : -CHORD_IN;
  const topChord = profileY(
    [...wallXs.map((x) => [x, archTop(x) - ARCH.chordH]), ...[...wallXs].reverse().map((x) => [x, archTop(x)])],
    cy0,
    cy1,
  );
  // De onderrand steekt alleen aan de buitenkant uit, zodat de knieën van het
  // windverband er niet op rusten (geen spitse spleet).
  const lowChord = profileY(
    [...lowXs.map((x) => [x, Math.max(archLow(x), D_OLD + 0.5)]), ...[...lowXs].reverse().map((x) => [x, Math.max(archLow(x) + ARCH.chordH, D_OLD + 0.6)])],
    side > 0 ? RIB_IN : -CHORD_OUT,
    side > 0 ? CHORD_OUT : -RIB_IN,
  );
  return union([plate.subtract(union([...through, ...niches])), topChord, lowChord]);
}
const archWalls = [archWall(1), archWall(-1)];

// Brugdek, trekbalken en looppaden onder de boog.
const archDeckSection = () => {
  const d = D_OLD;
  const { slab, tieDown, tieUp, walk, walkT } = ARCH_DECK;
  const chamferZ = d - walkT - (walk - RIB_OUT) * T50;
  return [
    [-RIB_OUT, d - tieDown], [-RIB_IN, d - tieDown], [-RIB_IN, d - slab], [RIB_IN, d - slab], [RIB_IN, d - tieDown],
    [RIB_OUT, d - tieDown], [RIB_OUT, chamferZ], [walk, d - walkT], [walk, d], [RIB_OUT, d], [RIB_OUT, d + tieUp],
    [RIB_IN, d + tieUp], [RIB_IN, d], [-RIB_IN, d], [-RIB_IN, d + tieUp], [-RIB_OUT, d + tieUp], [-RIB_OUT, d],
    [-walk, d], [-walk, d - walkT], [-RIB_OUT, chamferZ],
  ];
};
const archDeck = loftX([ARCH_X0, ARCH_X1].map((x) => ({ x, section: archDeckSection() })), "boogdek");

// Windverband tussen de bovenranden: kruisende diagonalen tussen de knopen om
// het andere veld en een portaalregel van 1,2 m op de eindstijlen (AHN: het
// portaal loopt op NAP +31,9 m over de volle breedte); staven 1,0 m breed,
// bovenkant 0,3 m onder de bovenrand, 0,9 m dik in het midden en met de
// onderkant onder 47 graden schuin naar de bogen, zodat het zonder steun
// print vanaf het vlak van de boog.
const BRACE = { drop: 0.3, thick: 0.9, bar: 1.0, endBar: END_POST, slope: rad(47) };
const BY = RIB_IN; // tegen het binnenvlak van de boog
const BRACE_NODES = NODES.filter((_, i) => i % 2 === 0);
const bar = ([x0, y0], [x1, y1], w) => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * (w / 2);
  const ny = (dx / len) * (w / 2);
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
let lattice = bar([BRACE_NODES[0], -BY], [BRACE_NODES[0], BY], BRACE.endBar).add(
  bar([BRACE_NODES[BRACE_NODES.length - 1], -BY], [BRACE_NODES[BRACE_NODES.length - 1], BY], BRACE.endBar),
);
for (let i = 0; i + 1 < BRACE_NODES.length; i++) {
  lattice = lattice
    .add(bar([BRACE_NODES[i], -ARCH.y], [BRACE_NODES[i + 1], ARCH.y], BRACE.bar))
    .add(bar([BRACE_NODES[i], ARCH.y], [BRACE_NODES[i + 1], -ARCH.y], BRACE.bar));
}
lattice = lattice.intersect(new CrossSection([ccw(rect(ARCH_X0, ARCH_X1, -BY, BY))]));
const braceTop = (x) => archTop(x) - BRACE.drop;
const braceUnder = (x, y) => braceTop(x) - BRACE.thick - Math.abs(y) * Math.tan(BRACE.slope);
const braceEnvelope = loftX(
  range(ARCH_X0, ARCH_X1, 1).map((x) => ({
    x,
    section: [[0, braceUnder(x, 0)], [BY, braceUnder(x, BY)], [BY, braceTop(x)], [-BY, braceTop(x)], [-BY, braceUnder(x, BY)]],
  })),
  "windverband",
);
const bracing = Manifold.extrude(lattice, 80).intersect(braceEnvelope);

// ---------- aanbruggen van 1952 (vakwerkliggers onder het spoor) ----------
// Dekplaat 0,8 m over 10,5 m breed; twee vakwerkliggers in het vlak van de
// bogen (|y| 4,25 tot 5,25, randen 1,2 m breed en 1,0 m hoog) tot NAP +16,25 m
// (AHN: onderkant circa NAP +16,3 m); per veld vijf V-velden met de top aan de
// bovenrand en stijlen op de onderknopen (foto's). De V-openingen zijn
// doorgaand met flanken van 50 graden, de driehoeken met een vlakke bovenkant
// blinde nissen van 0,35 m.
const APPROACH = { slab: 0.8, half: RIB_OUT, bottomNap: 16.25, bays: 5 };
const TRUSS_BOTTOM = Z(APPROACH.bottomNap);
const TRUSS_TOP = D_OLD - APPROACH.slab + 0.01;
const APPROACH_SPANS = [
  [PIER_X.south, ARCH_X0],
  [ARCH_X1, PIER_X.a1],
  [PIER_X.a1, PIER_X.a2],
  [PIER_X.a2, PIER_X.a3],
  [PIER_X.a3, PIER_X.a4],
  [PIER_X.a4, PIER_X.transition],
];
// Openingen in een vakwerk met evenwijdige randen: V-velden met de top boven
// in het midden van elk veld, stijlen op de onderknopen.
function vTrussHoles(a, b, bays, zFloor, zCeil, post = POST, diag = 1.0) {
  const bay = (b - a) / bays;
  const through = [];
  const niches = [];
  const h = zCeil - zFloor;
  for (let k = 0; k < bays; k++) {
    const xc = a + (k + 0.5) * bay;
    const half = Math.min(h / T50, bay / 2 - post / 2 - diag);
    through.push(bluntAcute([[xc - half, zFloor], [xc + half, zFloor], [xc, zFloor + half * T50]]));
  }
  for (let k = 0; k <= bays; k++) {
    const node = a + k * bay;
    for (const dir of [-1, 1]) {
      const apexX = node + dir * bay / 2;
      if (apexX < a || apexX > b) continue;
      const hp = (k === 0 || k === bays) ? post : post / 2;
      const tri = new CrossSection([ccw([[apexX, zCeil], [node + dir * hp, zCeil], [node + dir * hp, zFloor]])]);
      const cut = tri
        .intersect(halfPlane([node, zFloor], [apexX, zCeil], [node + dir * hp, zCeil], diag / 2))
        .intersect(new CrossSection([ccw(rect(a - 1, b + 1, zFloor + 0.3, zCeil + 1))]));
      for (const p of pieces(cut, 0.6)) niches.push(bluntAcute(p));
    }
  }
  return { through, niches };
}
function approachSpan(a, b) {
  // Naburige velden overlappen 5 cm, zodat er op de pijler geen naad blijft.
  const a0 = a - 0.05;
  const b0 = b + 0.05;
  const floor = TRUSS_BOTTOM + 1.0;
  const ceil = TRUSS_TOP - 1.0;
  const { through, niches } = vTrussHoles(a, b, APPROACH.bays, floor, ceil);
  const parts = [];
  for (const side of [-1, 1]) {
    const y0 = side > 0 ? RIB_IN : -RIB_OUT;
    const y1 = side > 0 ? RIB_OUT : -RIB_IN;
    const plate = boxFromTo(a0, b0, y0, y1, TRUSS_BOTTOM, TRUSS_TOP);
    const nicheY = side > 0 ? [RIB_OUT - 0.35, RIB_OUT + 0.5] : [-RIB_OUT - 0.5, -RIB_OUT + 0.35];
    const cuts = [
      ...through.map((h) => profileY(h, y0 - 0.5, y1 + 0.5)),
      ...niches.map((h) => profileY(h, nicheY[0], nicheY[1])),
    ];
    const cy0 = side > 0 ? CHORD_IN : -CHORD_OUT;
    const cy1 = side > 0 ? CHORD_OUT : -CHORD_IN;
    parts.push(
      plate.subtract(union(cuts)),
      boxFromTo(a0, b0, cy0, cy1, TRUSS_BOTTOM, TRUSS_BOTTOM + 1.0),
      boxFromTo(a0, b0, cy0, cy1, TRUSS_TOP - 1.0, TRUSS_TOP),
    );
  }
  const slab = loftX(
    deckStations(a0, b0).map((x) => {
      const d = deckZ(x);
      return { x, section: [[-APPROACH.half, d - APPROACH.slab], [APPROACH.half, d - APPROACH.slab], [APPROACH.half, d], [-APPROACH.half, d]] };
    }),
    `aanbrugdek ${a}`,
  );
  return union([...parts, slab]);
}
const approachSpans = APPROACH_SPANS.map(([a, b]) => approachSpan(a, b));

// ---------- zuidelijk landhoofd en kort veld ----------
const SOUTH_SPAN = { x0: -138.62, x1: -129.27, half: 5.0, depth: 1.5 };
const southSpan = loftX(
  deckStations(SOUTH_SPAN.x0 - 0.05, SOUTH_SPAN.x1 + 0.05).map((x) => {
    const d = deckZ(x);
    const { half, depth } = SOUTH_SPAN;
    return { x, section: [[-half, d - depth], [half, d - depth], [half, d], [-half, d]] };
  }),
  "kort veld",
);
const southAbutment = prism(SOUTH_ABUTMENT, BASE, Z(22.3));
const southPier = prism(SOUTH_PIER, BASE, D_OLD);

// ---------- pijlers ----------
// Rivierpijlers van de boog: metselwerk tot NAP +12,5 m met een kraag van
// 0,5 m, daarboven een betonnen blok (|y| 7,0 m) met een kop tot onder de
// trekbalk (foto's).
function masonry(poly, top, kraag) {
  const hull = hullPoly(poly);
  return union([
    prism(hull, BASE, top),
    flare(hull, offsetPoly(hull, kraag), kraag, top - kraag * T50, top + kraag),
  ]);
}
const bbox = (poly) => {
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  for (const [x, y] of poly) {
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  }
  return { x0, x1, y0, y1 };
};
const ARCH_SEAT = D_OLD - ARCH_DECK.tieDown;
const archPiers = ARCH_PIERS.map((poly) => {
  const b = bbox(poly);
  const top = Z(12.5);
  const block = rect(b.x0 + 0.8, b.x1 - 0.8, -7.0, 7.0);
  const cap = rect(b.x0 + 0.5, b.x1 - 0.5, -7.5, 7.5);
  return union([
    masonry(poly, top, 0.5),
    prism(block, top + 0.49, ARCH_SEAT - 1.0),
    flare(block, cap, 0.5, ARCH_SEAT - 1.0, ARCH_SEAT + 0.05),
  ]);
});
// Pijlers van de aanbruggen: de BGT-vorm tot 1,2 m onder de onderrand van de
// vakwerkliggers, daarboven een kop van 0,3 m uitkragend.
const approachPiers = APPROACH_PIERS.map((poly) => {
  const hull = hullPoly(poly);
  return union([prism(hull, BASE, TRUSS_BOTTOM - 1.2), flare(hull, offsetPoly(hull, 0.3), 0.3, TRUSS_BOTTOM - 1.2, TRUSS_BOTTOM + 0.05)]);
});
// De overgangspijler draagt het bordes op de hoogte van het nieuwe dek.
const transitionPier = prism(TRANSITION_PIER, BASE, Z(22.2) - 0.01);

// ---------- aanbrug van 2004 ----------
// Betonnen dek van 12,15 m breed (BGT: looppaden tot 6,15 en 5,8 m naast de
// as), 1,8 m dik in het midden met schuine onderranden (foto); twee
// buisvakwerken 4,0 m naast de as tot NAP +16,5 m (foto's; hier recht, als
// plaat van 0,9 m), onderrand 1,2 m breed en 1,1 m hoog; velden van 5,5 m met
// stijlen en V-diagonalen. Zeven velden van 49,7 m tussen de eerste
// pijler (BGT, x = 366,0) en het noordelijke landhoofd; de tussenpijlers staan
// niet in de BGT en zijn op gelijke afstanden gezet.
const NEW = { x0: PIER_X.newFirst, x1: NORTH_DECK_END, spans: 7, yL: -6.15, yR: 6.0, slab: 1.8, edge: 0.6, flat: 5.0, y: 4.0, bottomNap: 16.5, plate: 0.9, chordW: 1.2, chordH: 1.1, baysPerSpan: 9 };
const NEW_D = Z(22.2);
const NEW_TOP = NEW_D - NEW.slab + 0.01;
const NEW_BOTTOM = Z(NEW.bottomNap);
const NEW_SPAN = (NEW.x1 - NEW.x0) / NEW.spans;
const NEW_PIER_X = Array.from({ length: NEW.spans - 1 }, (_, k) => NEW.x0 + (k + 1) * NEW_SPAN);
const newDeckSection = (d) => [
  [-NEW.flat, d - NEW.slab], [NEW.flat, d - NEW.slab], [NEW.yR, d - NEW.edge], [NEW.yR, d], [NEW.yL, d], [NEW.yL, d - NEW.edge],
];
const newDeck = loftX(
  deckStations(PIER_X.transition, NORTH_DECK_END).map((x) => ({ x, section: newDeckSection(deckZ(x)) })),
  "dek 2004",
);
function newTruss(side) {
  const t = NEW.plate / 2;
  const plate = boxFromTo(NEW.x0, NEW.x1, -t, t, NEW_BOTTOM, NEW_TOP);
  const through = [];
  const niches = [];
  for (let s = 0; s < NEW.spans; s++) {
    const a = NEW.x0 + s * NEW_SPAN;
    const holes = vTrussHoles(a, a + NEW_SPAN, NEW.baysPerSpan, NEW_BOTTOM + NEW.chordH, NEW_TOP - 0.6, 0.9, 0.9);
    through.push(...holes.through);
    niches.push(...holes.niches);
  }
  const cuts = [
    ...through.map((h) => profileY(h, -t - 0.5, t + 0.5)),
    ...niches.map((h) => (side > 0 ? profileY(h, t - 0.3, t + 0.5) : profileY(h, -t - 0.5, -t + 0.3))),
  ];
  const w = NEW.chordW / 2;
  const chord = boxFromTo(NEW.x0, NEW.x1, -w, w, NEW_BOTTOM, NEW_BOTTOM + NEW.chordH);
  return union([plate.subtract(union(cuts)), chord]).translate([0, side * NEW.y, 0]);
}
const newTrusses = [newTruss(1), newTruss(-1)];
// Tussenpijlers: betonnen schijf van 2,4 m dik en 9,2 m breed met ronde
// koppen (geschat), kop 0,3 m uitkragend onder de onderranden.
const newPiers = NEW_PIER_X.map((x) => {
  const foot = offsetPoly(rect(x - 0.6, x + 0.6, -3.7, 3.7), 0.6);
  return union([prism(foot, BASE, NEW_BOTTOM - 0.8), flare(foot, offsetPoly(foot, 0.3), 0.3, NEW_BOTTOM - 0.8, NEW_BOTTOM + 0.05)]);
});
const newFirstPier = prism(NEW_FIRST_PIER, BASE, NEW_BOTTOM + 0.05);
const northAbutment = boxFromTo(NORTH_ABUTMENT.x0, NORTH_ABUTMENT.x1, NORTH_ABUTMENT.y0, NORTH_ABUTMENT.y1, BASE, NEW_D);

const bridge = union([
  southAbutment,
  southSpan,
  southPier,
  ...approachSpans,
  archDeck,
  ...archWalls,
  bracing,
  ...archPiers,
  ...approachPiers,
  transitionPier,
  newDeck,
  ...newTrusses,
  ...newPiers,
  newFirstPier,
  northAbutment,
]);

// ---------- printvoet (alleen in de STL) ----------
// Net als de overhangopvulling van de export krijgt de STL onder elk zwevend
// dek een wig van 50 graden die uitloopt in een scherm van 0,9 m tot de
// onderplaat.
const KNEE = rad(50);
const SCREEN = 0.45;
const footSection = (zb, w) => {
  const zs = zb - Math.tan(KNEE) * (w - SCREEN);
  if (zs > BASE + 0.05) return [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]];
  const a = w - (zb - BASE) / Math.tan(KNEE);
  return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
};
const footRegions = [
  [SOUTH_SPAN.x0, SOUTH_SPAN.x1, (x) => deckZ(x) - SOUTH_SPAN.depth, SOUTH_SPAN.half],
  ...APPROACH_SPANS.map(([a, b]) => [a, b, () => TRUSS_BOTTOM, CHORD_OUT]),
  [ARCH_X0, ARCH_X1, () => D_OLD - ARCH_DECK.tieDown, RIB_OUT],
  [PIER_X.transition, NEW.x0, (x) => deckZ(x) - NEW.slab, NEW.flat],
  [NEW.x0, NEW.x1, () => NEW_BOTTOM, NEW.y + NEW.chordW / 2],
  // Tussen de liggers tot onder de dekplaat.
  ...APPROACH_SPANS.map(([a, b]) => [a, b, (x) => deckZ(x) - APPROACH.slab, RIB_IN]),
  [ARCH_X0, ARCH_X1, () => D_OLD - ARCH_DECK.slab, RIB_IN],
  [NEW.x0, NEW.x1, (x) => deckZ(x) - NEW.slab, NEW.y - NEW.plate / 2],
];
const printFoot = union(
  footRegions.map(([a, b, zbOf, w], i) =>
    loftX(
      deckStations(a, b).map((x) => ({ x, section: footSection(zbOf(x) + 0.02, w + 0.02) })),
      `printvoet ${i}`,
    ),
  ),
);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
for (const [name, solid] of [["brug", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
// Vrij hangende ondervlakken (vlakker dan 45 graden) boven de onderkant.
function overhangArea(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
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
  }
  return area;
}
const checks = {
  overhangM2: { model: Math.round(overhangArea(bridge)), print: +overhangArea(printModel).toFixed(2) },
  ribOpenings: ribThrough.length,
  ribNiches: ribNiches.length,
  hangers: HANGER_NODES.length,
  screenOpenings: screenHoles.length,
  lowChordMeetsDeckX: +LOW_END.toFixed(2),
};
console.log("controles:", checks);

// ---------- spoor als eigen onderdelen ----------
// De bovenste 0,5 m van het dek op de BGT-wegdelen van de brug is een eigen
// node met de attributen van die wegdelen (glTF `extras.attributes`), zodat de
// kleurregels van een thema (bijvoorbeeld spoor zwart) op het brugdek werken
// zoals op de PDOK-wegdelen ernaast. Op de stalen brug van 1952 liggen twaalf
// BGT-wegdelen spoorbaan, gesloten verharding (per veld één per spoor, van 0,7
// tot 3,3 m naast de as; het midden tussen de sporen en de looppaden zijn geen
// wegdeel); op het zuidelijke landhoofd met het korte veld
// (L0004.abb9ac25dc6e495caf12d3732360ca91) en op de aanbrug van 2004
// (L0004.a86b2b334bfc49948b919d1c6178bb92) ligt spoorbaan, half verhard, over
// circa 8 m breedte. Alle met relatieve hoogteligging 1. Contouren in lokale
// coördinaten, vereenvoudigd tot 5 cm; de kopse kanten aan de uiteinden zijn
// 0,5 m voorbij het dek verlengd (zuid) of tot het einde van het landhoofd
// (noord), zodat daar geen smalle reep constructie op het dek blijft staan.
// Wordt pas hier gebouwd, nadat het printmodel is doorgerekend, zodat de STL
// gelijk blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
const BALLAST_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "half verhard" };
const SOUTH_END = -144.73;
const SPOOR_BGT = [
  // L0004.c954e297911b4030871af57d07c33606, L0004.168a3ab0224d45d3944f3b6dfe5b8e5f
  [[-69.39, -3.15], [-69.43, -0.73], [-125.34, -0.68], [-125.33, -3.13]],
  [[-69.49, 3.16], [-125.35, 3.14], [-125.34, 0.81], [-69.45, 0.8]],
  // L0004.7780e531631142588d3c707d13940313, L0004.3f49c83d8e79431bbf9d19d6657255b9
  [[63.34, -3.2], [63.4, -0.76], [-69.43, -0.73], [-69.39, -3.15]],
  [[-63.21, 0.81], [63.44, 0.84], [63.44, 3.21], [-69.49, 3.16], [-69.45, 0.8]],
  // L0004.2e441329918e4df9b6b8a63b209bd782, L0004.58873a497d0c4bf18cba19cfcdc58037
  [[69.37, -0.76], [63.4, -0.76], [63.34, -3.2], [122.76, -3.22], [122.83, -0.78]],
  [[112.36, 0.68], [122.87, 0.71], [122.94, 3.23], [63.44, 3.21], [63.44, 0.84], [63.93, 0.91]],
  // L0004.a56e1199d7914ddc979daaa132b8447f, L0004.a8744700129c4f579d4de55fc6561782
  [[173.05, -0.69], [145.51, -0.79], [122.83, -0.78], [122.76, -3.22], [180.32, -3.24], [180.39, -0.72]],
  [[141.69, 0.76], [180.49, 0.65], [180.79, 3.25], [122.94, 3.23], [122.87, 0.71]],
  // L0004.2a98419da77d4d9d95d6e6bb6a780457, L0004.f57cca0f97f649f785528d0cf337c671
  [[232.22, -0.72], [195.19, -0.77], [180.39, -0.72], [180.32, -3.24], [237.91, -3.26], [237.96, -0.73]],
  [[229.92, 0.75], [237.98, 0.72], [238.03, 3.27], [180.79, 3.25], [180.49, 0.65]],
  // L0004.151e9b1ff5c040138ae80e653ea31d68, L0004.f3fba5fb646444eabb20fade6c160962
  [[249.58, -0.77], [237.96, -0.73], [237.91, -3.26], [297.59, -3.29], [297.6, -0.8]],
  [[276.93, 0.62], [297.6, 0.61], [297.61, 3.3], [238.03, 3.27], [237.98, 0.72]],
  // L0004.a6d559fdd5a8499094e000a4efd5a798, L0004.cd0355d858e34d45a4e2b41864ab376e
  [[297.71, -0.8], [297.6, -0.8], [297.59, -3.29], [355.75, -3.29], [355.75, -0.69]],
  [[297.72, 3.3], [297.61, 3.3], [297.6, 0.61], [355.74, 0.71], [355.73, 3.31]],
];
const BALLAST_BGT = [
  // L0004.abb9ac25dc6e495caf12d3732360ca91 (zuidelijk landhoofd)
  [[-125.33, -3.85], [-125.34, -0.68], [-124.84, -0.68], [-124.86, 0.81], [-125.34, 0.81], [-125.35, 3.95], [SOUTH_END - 0.5, 3.97], [SOUTH_END - 0.5, -3.87]],
  // L0004.a86b2b334bfc49948b919d1c6178bb92 (aanbrug 2004, tot het einde van het landhoofd)
  [[355.75, -0.69], [355.76, -4.09], [714.08, -4.28], [NORTH_ABUTMENT.x1 + 0.5, -4.28], [NORTH_ABUTMENT.x1 + 0.5, 3.83], [713.99, 3.83], [355.73, 4.11]],
];
// De strook loopt over de knikken van het dek, van 0,5 m onder tot 1 m boven
// het dek en voorbij de uiteinden.
const strip = loftX(
  sortedUnique([SOUTH_END - 0.5, ...DECK_XS.filter((x) => x > SOUTH_END - 0.5 && x < NORTH_ABUTMENT.x1 + 0.5), NORTH_ABUTMENT.x1 + 0.5]).map((x) => {
    const zt = deckZ(x);
    return { x, section: [[-8, zt - LAYER], [8, zt - LAYER], [8, zt + ABOVE], [-8, zt + ABOVE]] };
  }),
  "spoorstrook",
);
// De bogen met hun randen blijven constructie, met 2 cm vrij.
const ribGuards = [-1, 1].map((side) =>
  side > 0
    ? boxFromTo(ARCH_X0 - GUARD, ARCH_X1 + GUARD, CHORD_IN - GUARD, CHORD_OUT + GUARD, BASE - 1, 100)
    : boxFromTo(ARCH_X0 - GUARD, ARCH_X1 + GUARD, -CHORD_OUT - GUARD, -CHORD_IN + GUARD, BASE - 1, 100),
);
const spoorArea = union(SPOOR_BGT.map((p) => prism(p, BASE - 1, 100)));
const ballastArea = union(BALLAST_BGT.map((p) => prism(p, BASE - 1, 100))).subtract(spoorArea);
const guards = union(ribGuards);
const spoorCut = strip.intersect(spoorArea).subtract(guards);
const ballastCut = strip.intersect(ballastArea).subtract(guards);
const track = spoorCut.intersect(bridge);
const ballastTrack = ballastCut.intersect(bridge);
const structure = bridge.subtract(union([spoorCut, ballastCut]));
const parts = [
  ["building:spoorbrug-oosterbeek", structure],
  ["road:spoor", track, SPOOR_ATTRIBUTES],
  ["road:spoor-ballastbed", ballastTrack, BALLAST_ATTRIBUTES],
];
{
  const whole = bridge.volume();
  const sum = structure.volume() + track.volume() + ballastTrack.volume();
  checks.partitionM3 = {
    bridge: +whole.toFixed(2),
    structure: +structure.volume().toFixed(2),
    track: +track.volume().toFixed(2),
    ballast: +ballastTrack.volume().toFixed(2),
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
    meshes.push({ name, primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }] });
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid, attributes] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    ...(attributes ? { attributes } : {}),
    status: solid.status(),
    genus: solid.genus(),
    components: solid.decompose().length,
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
report.arch = {
  crownNap: +topNap(0).toFixed(2),
  endPostNap: +topNap(ARCH.end).toFixed(2),
  lowCrownNap: ARCH.lowCrownNap,
  panels: PANELS,
  panelM: +PANEL.toFixed(3),
  hangers: HANGER_NODES.length,
  screenApexNap: screenApex,
};
report.newApproach = { spanM: +NEW_SPAN.toFixed(2), piersX: NEW_PIER_X.map((x) => +x.toFixed(2)) };
report.checks = checks;
const glbFile = path.join(outDir, "spoorbrug-oosterbeek.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-spoorbrug-oosterbeek.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `spoorbrug-oosterbeek-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Spoorbrug Oosterbeek 1:${scale} mm Z-up`);
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
// Op de Nederrijn naast de boog (20 m naast de as). De uiterwaarden liggen 1,4
// tot 2 m hoger dan het water; punten daar zouden het model optillen.
const samplePoints = [-35, 0, 35].flatMap((x) => [
  [x, 20],
  [x, -20],
]);
await writeFile(
  path.join(outDir, "spoorbrug-oosterbeek.json"),
  JSON.stringify(
    {
      name: "Spoorbrug Oosterbeek",
      file: "spoorbrug-oosterbeek.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [187103.53, 442490.13],
      xAxis: [0.351617, 0.936144],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden tussen de twee rivierpijlers van de boog op de waterspiegel van de Nederrijn (z = 0, NAP +8,25 m) in de oorsprong, +X langs de brug naar het noordnoordoosten (Oosterbeek, RD-richting 69,41 graden vanaf het oosten) en +Y stroomafwaarts naar het westnoordwesten. Drie nodes. Node road:spoor: de bovenste 0,5 m van het dek op de twaalf BGT-wegdelen spoorbaan van de stalen brug van 1952 (per veld één per spoor, 0,7 tot 3,3 m naast de as) met de attributen van die wegdelen in extras.attributes (bgt_functie spoorbaan, bgt_fysiekvoorkomen gesloten verharding). Node road:spoor-ballastbed: idem op de BGT-wegdelen spoorbaan, half verhard, van het zuidelijke landhoofd met het korte veld (L0004.abb9ac25...) en de aanbrug van 2004 (L0004.a86b2b33..., circa 8 m breed), met bgt_fysiekvoorkomen half verhard; zo werken de kleurregels van een thema op het dek. Node building:spoorbrug-oosterbeek: de rest van het kunstwerk: de stalen boogbrug van 132,6 m tussen de pijlermiddens (eindstijlen op x = ±66,3) met twee vakwerkbogen 4,75 m naast de as als plaat van 1,0 m met randen van 1,2 m, bovenrand tot NAP +48,9 m in de top en +31,9 m op de eindstijlen, onderrand 6,0 m lager in de top en 6,5 m binnen de eindstijlen op het dek, 24 velden van 5,525 m met doorgaande driehoekige openingen (flanken van minstens 50 graden) en blinde nissen, 21 hangers met spitse openingen ertussen, het windverband van kruisende diagonalen met portaalregels tussen de bovenranden, het brugdek met trekbalken en looppaden tot 6,3 m naast de as; de twee rivierpijlers met ronde koppen (BGT), metselwerk tot NAP +12,5 m met kraag en betonnen blok; zes aanbruggen van 1952 (één zuid, vijf noord, circa 58 m) als dekplaat van 10,5 m op twee vakwerkliggers tot NAP +16,25 m met vijf V-velden (doorgaande spitse openingen, blinde nissen) op pijlers met spitse koppen; het zuidelijke landhoofd met een kort veld en een brede pijler met bordes; de overgangspijler met bordes (x = 352,7 tot 359,7) en de aanbrug van 2004 tot het noordelijke landhoofd (x = 714,1 tot 717): betonnen dek van 12,15 m op twee naar buiten hellende vakwerken met V-openingen, zeven velden van 49,7 m. Spoor op NAP +22,45 m (stalen brug), +22,3 m (zuidelijk landhoofd) en +22,2 m (aanbrug 2004). Bovenleiding met portalen, leuningen, ladders, kabelgoten en het onderste windverband zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de Nederrijn naast de boog bemonsterd; groundHeight is de PDOK-hoogte van dat water. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NORTH_ABUTMENT.x1 - SOUTH_END).toFixed(1),
        archSpanPiersM: +(PIER_X.archN - PIER_X.archS).toFixed(2),
        archCrownNapM: ARCH.crownNap,
        archEndPostNapM: +topNap(ARCH.end).toFixed(2),
        archRibsFromAxisM: ARCH.y,
        archPanels: PANELS,
        approachSpansM: APPROACH_SPANS.map(([a, b]) => +(b - a).toFixed(1)),
        newApproachSpansM: +NEW_SPAN.toFixed(2),
        railNapM: { south: 22.3, steelBridge: 22.45, approach2004: 22.2 },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Spoorbrug_Oosterbeek",
        "PDOK BGT overbruggingsdeel (dek, pijlers, landhoofden), wegdeel (spoorbaan) en spoor, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de spoorhoogte, de bogen, het portaal en de aanbruggen",
        "PDOK luchtfoto (Actueel_orthoHR) voor de plattegrond",
        "Wikimedia Commons: Spoorbrug over de Nederrijn ter hoogte van Oosterbeek.jpg, Arnhem-Meinerswijk, Spoorbrug Oosterbeek tijdens hoogwater en ijs IMG 8164 2021-02-14 09.05.jpg, Railway bridge Arnhem (2).JPG, Railway bridge Arnhem (3).JPG, 2007-01-14 12.14 Arnhem, spoorbrug.JPG, Arnhem-Zuid Neder-Rijn NS 1764 met DD-AR 7374 Sprinter 7635 Zutphen (29423434454).jpg, Modern railwaybridge architecture gives rather nice shaped structures - panoramio.jpg, VIRM Rijnbrug Oosterbeek.JPG",
      ],
    },
    null,
    2,
  ),
);
for (const c of structure.decompose()) if (c.volume() < 0.5 * structure.volume()) console.log("los onderdeel", c.volume().toFixed(2), JSON.stringify(c.boundingBox()));
console.log(JSON.stringify(report, null, 2));

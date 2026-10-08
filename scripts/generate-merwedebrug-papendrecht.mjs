// Genereert een vereenvoudigd, gesloten 3D-model van de Merwedebrug over de
// Beneden-Merwede tussen Dordrecht en Papendrecht (N3, geopend in 1967): de
// stalen boogbrug met trekband van 203 m (twee verticale boogribben met een
// netwerk van schuine hangers, het staal gebouwd door Penn & Bauduin), de
// basculebrug aan de noordkant (Papendrecht) in gesloten stand met de
// basculekelder en het bedieningsgebouw, en de betonnen aanbruggen: aan de
// zuidkant (Dordrecht) tien velden van circa 45 m over het bedrijfsterrein en
// de Wantijhaven, met een lichte bocht naar het zuidoosten en een eigen,
// lager liggend fietsdek dat vanaf de boog afdaalt en in de bocht losraakt; aan
// de noordkant zes velden over de uiterwaard en de dijk. Alle maten in het
// script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één
// node met de materiaalklasse in de nodenaam) als catalogusbron voor de export
// en de kaart, plus een binaire STL in millimeters op 1:<schaal> met een
// printvoet onder het dek. De brug is 1051 m lang en past op 1:1000 niet in
// 400 mm, vandaar standaard 1:3000 (350 mm).
//
//   node scripts/generate-merwedebrug-papendrecht.mjs              # 1:3000 (standaard)
//   node scripts/generate-merwedebrug-papendrecht.mjs --scale 2500
//
// Assenstelsel: oorsprong op de as van het dek midden onder de boog (RD
// 108025,67, 426267,50), op NAP 0 (het PDOK-terrein legt de Beneden-Merwede op
// ellipsoïdisch 43,66 m, NAP + 43,65 m), Z omhoog, z = NAP-hoogte. +X loopt
// langs de brug naar het noorden (Papendrecht, RD-richting 94,40 graden vanaf
// het oosten), +Y naar het westen (stroomafwaarts). De rivierpijlers van de
// boog staan op x = -105,9 tot -99,4 en 99,4 tot 105,9; de basculeklep ligt van
// x = 102,9 tot 137,2, de basculekelder van 137,2 tot 160,5; het zuidelijke
// landhoofd begint op x = -568, het noordelijke eindigt op x = 482,9.
//
// Bronnen: BGT overbruggingsdeel (dekranden: 20,9 m breed, 21,6 m onder de
// boog; de bocht van het zuidelijke dek en het losse fietsdek; de pijlers op
// x = -240,1, -194,9 en -149,4 met elk zes kolommen van 2,2 × 0,8 m; de
// poeren in de Wantijhaven op x = -421,3, -466,6 en -511,5 en twee poeren van
// het fietsdek; de rivierpijler met ronde koppen van 6,5 × 29,6 m; de
// landhoofden); BAG-pand 0590100000018081 (bouwjaar 1967) voor de
// basculekelder met de toren van het bedieningsgebouw; AHN DSM 0,5 m (PDOK
// WCS) voor het lengteprofiel van het wegdek (NAP +10,6 bij Dordrecht, +14,9 m
// onder de boog, +6,1 m bij Papendrecht) en van het fietsdek, de bovenrand van
// de boogribben (parabool met de top op NAP +43,0 m), hun ligging (6,4 m ten
// oosten en 10,1 m ten westen van de as, het fietspad buiten de oostelijke
// rib), de koppen van de rivierpijlers (NAP +6,2 m) en de toren (NAP +20,0 m);
// PDOK-terrein voor de waterspiegel; Wikipedia (nl) en Structurae voor
// bouwjaar, lengte (1032 m) en overspanning (202 tot 203 m); Wikimedia
// Commons-foto's voor de boogribben, de hangers (acht knopen op het dek, van
// elke knoop twee schuine hangers naar de boog), de kolommen onder de
// aanbruggen en de pijlers, de basculekelder met ramen en toren en de klep.
// Geschat: de pijlers van de zuidelijke aanbrug op het land (x = -375,7,
// -330,5 en -285,3, op de BGT-steek van 45,2 m), de pijlers van de noordelijke
// aanbrug (vijf, op gelijke velden van 49,1 m: niet in de BGT en onder het dek
// niet in het AHN), de constructiehoogtes (aanbruggen 2,6 m, boogdek 2,4 m met
// trekbanden van 3,0 m, klep 2,0 m, fietsdek 1,2 m), de ribhoogte (2,2 m), de
// kolommen op de rivierpijlers en de poeren tot NAP +1,0 m.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "3000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "merwedebrug-papendrecht");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const area2 = (pts) => {
  let a = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  });
  return a / 2;
};
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Doorsnede in het XZ-vlak (polygoon of CrossSection), uitgetrokken langs Y van y0 tot y1.
const extrudeY = (shape, y0, y1) =>
  Manifold.extrude(shape, y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const profileY = (points, y0, y1) => extrudeY([ccw(points)], y0, y1);
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in, y naar rechts en z omhoog, steeds evenveel punten).
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
  if (solid.volume() <= 0) throw new Error("loft: omgekeerde doorsnede");
  return solid;
}
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};
const lerp = (a, b, t) => a + (b - a) * t;
// Lineaire interpolatie in een tabel [[x, ...waarden]], buiten de tabel
// lineair doorgetrokken.
function table(rows, x, k) {
  let i = rows.findIndex(([rx]) => rx > x) - 1;
  if (i < 0) i = x < rows[0][0] ? 0 : rows.length - 2;
  i = Math.min(Math.max(i, 0), rows.length - 2);
  const [x0] = rows[i];
  const [x1] = rows[i + 1];
  return lerp(rows[i][k], rows[i + 1][k], (x - x0) / (x1 - x0));
}

// ---------- hoofdmaten ----------
// z = NAP-hoogte. Het PDOK-terrein legt de Beneden-Merwede en de Wantijhaven
// op ellipsoïdisch 43,64 tot 43,69 m; het PDOK-terrein ligt hier 43,65 m
// boven het AHN, dus het water ligt op NAP 0 = z 0.
const BASE = -2.0; // gemeenschappelijke onderkant, onder de polderslootjes bij Papendrecht (NAP -1,8)
const GROUND_OFFSET = 0;
const GROUND_HEIGHT = 43.64; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten

const SOUTH_END = -568.0; // achterkant zuidelijk landhoofd (BGT)
const SOUTH_FACE = -552.6; // voorzijde zuidelijk landhoofd (BGT)
const BIKE_END = -556.0; // einde fietsdek (BGT), daarna een aarden helling
const BIKE_SPLIT = -122.0; // waar het fietspad onder het wegdek wegzakt (AHN)
const SPLIT = -335.0; // waar fietsdek en wegdek ook in de BGT uit elkaar gaan
const ARCH_PIER = { x0: 99.4, x1: 105.9, y0: -12.9, y1: 16.7, capNap: 6.2 }; // gespiegeld voor de zuidpijler (BGT)
const ARCH_END = 102.65; // harten van de rivierpijlers: einde boogdek
const LEAF = { x0: 102.9, x1: 137.16, depth: 2.0 }; // basculeklep, gesloten
const KELDER = { x0: 137.16, x1: 160.53 }; // basculekelder (BAG)
const NORTH_FACE = 455.4; // voorzijde noordelijk landhoofd (BGT)
const NORTH_END = 482.9; // achterkant noordelijk landhoofd (BGT)

// Wegdek in NAP-meters om de 4 m vanaf x = -568: 25e percentiel van het
// AHN-DSM over het middelste 60 % van de rijbaan (in de bocht langs de
// BGT-randen), voortschrijdende mediaan over 22 m en gemiddelde over 28 m (de
// hangers, lantaarns en het verkeer vallen zo weg).
const DECK_X0 = -568;
const DECK_STEP = 4;
const DECK_NAP = [
  10.61, 10.60, 10.59, 10.58, 10.58, 10.59, 10.61, 10.63, 10.67, 10.71, 10.74, 10.78, 10.81, 10.85, 10.90, 10.95,
  10.99, 11.03, 11.06, 11.09, 11.13, 11.16, 11.20, 11.25, 11.28, 11.32, 11.35, 11.38, 11.41, 11.44, 11.46, 11.49,
  11.53, 11.58, 11.62, 11.65, 11.68, 11.70, 11.73, 11.74, 11.75, 11.77, 11.80, 11.82, 11.85, 11.88, 11.92, 11.96,
  11.99, 12.02, 12.05, 12.08, 12.11, 12.14, 12.17, 12.20, 12.23, 12.27, 12.30, 12.34, 12.36, 12.39, 12.42, 12.46,
  12.49, 12.53, 12.57, 12.61, 12.65, 12.69, 12.73, 12.77, 12.81, 12.84, 12.87, 12.90, 12.94, 12.97, 13.01, 13.05,
  13.09, 13.12, 13.16, 13.20, 13.24, 13.28, 13.32, 13.35, 13.39, 13.42, 13.47, 13.51, 13.55, 13.58, 13.62, 13.66,
  13.70, 13.73, 13.76, 13.79, 13.82, 13.86, 13.90, 13.94, 13.98, 14.02, 14.06, 14.10, 14.14, 14.17, 14.20, 14.24,
  14.28, 14.32, 14.35, 14.38, 14.41, 14.43, 14.47, 14.50, 14.54, 14.58, 14.61, 14.63, 14.65, 14.67, 14.68, 14.70,
  14.72, 14.74, 14.77, 14.78, 14.81, 14.82, 14.84, 14.84, 14.85, 14.86, 14.86, 14.87, 14.87, 14.87, 14.87, 14.87,
  14.87, 14.87, 14.86, 14.86, 14.85, 14.85, 14.84, 14.82, 14.80, 14.78, 14.76, 14.74, 14.72, 14.70, 14.68, 14.66,
  14.63, 14.61, 14.59, 14.56, 14.52, 14.48, 14.45, 14.43, 14.39, 14.35, 14.30, 14.25, 14.20, 14.16, 14.11, 14.06,
  14.00, 13.94, 13.88, 13.82, 13.77, 13.71, 13.66, 13.59, 13.53, 13.46, 13.38, 13.31, 13.22, 13.15, 13.08, 13.00,
  12.93, 12.85, 12.77, 12.69, 12.61, 12.53, 12.44, 12.35, 12.26, 12.16, 12.06, 11.97, 11.88, 11.79, 11.70, 11.59,
  11.49, 11.38, 11.28, 11.18, 11.07, 10.97, 10.87, 10.78, 10.68, 10.58, 10.48, 10.37, 10.26, 10.16, 10.06, 9.96,
  9.86, 9.76, 9.67, 9.56, 9.45, 9.35, 9.25, 9.15, 9.05, 8.96, 8.86, 8.76, 8.66, 8.56, 8.46, 8.37,
  8.28, 8.18, 8.07, 7.97, 7.86, 7.76, 7.66, 7.56, 7.46, 7.37, 7.28, 7.18, 7.08, 6.97, 6.87, 6.77,
  6.66, 6.56, 6.46, 6.36, 6.27, 6.20, 6.14, 6.10,
];
function road(x) {
  const f = Math.min(Math.max((x - DECK_X0) / DECK_STEP, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  return lerp(DECK_NAP[i], DECK_NAP[i + 1], f - i);
}
// Fietsdek: tot x = -122 gelijk met het wegdek, daarna een eigen dek dat
// afdaalt tot NAP +9,56 m op x = -408 en +5,5 m aan het einde (AHN; tussen
// -122 en -335 is het AHN onrustig, daar lineair).
const BIKE_KNEE = { x: -408, nap: 9.56 };
const BIKE_LOW = { x: BIKE_END, nap: 5.5 };
function bikeTop(x) {
  if (x >= BIKE_SPLIT) return road(x);
  if (x >= BIKE_KNEE.x) return lerp(BIKE_KNEE.nap, road(BIKE_SPLIT), (x - BIKE_KNEE.x) / (BIKE_SPLIT - BIKE_KNEE.x));
  return lerp(BIKE_LOW.nap, BIKE_KNEE.nap, (x - BIKE_LOW.x) / (BIKE_KNEE.x - BIKE_LOW.x));
}

// Dekranden (BGT) ten zuiden van de splitsing, om de 5 m: [x, oost, west].
// +Y is west; de rijbaan buigt naar het zuidoosten af, het fietsdek sterker.
const MAIN_EDGES = [
  [-550, -26.09, -8.33], [-545, -24.51, -6.96], [-540, -22.98, -5.69], [-535, -21.6, -4.43],
  [-530, -20.32, -3.25], [-525, -19.12, -2.11], [-520, -18.01, -0.97], [-515, -16.96, 0.16],
  [-510, -15.92, 1.15], [-505, -15.07, 2.04], [-500, -14.22, 2.93], [-495, -13.45, 3.68],
  [-490, -12.68, 4.35], [-485, -12.01, 5.02], [-480, -11.36, 5.63], [-475, -10.82, 6.17],
  [-470, -10.35, 6.71], [-465, -9.91, 7.12], [-460, -9.61, 7.41], [-455, -9.32, 7.7],
  [-450, -9.02, 7.98], [-445, -8.73, 8.27], [-440, -8.5, 8.49], [-435, -8.27, 8.7],
  [-430, -8.04, 8.91], [-425, -7.81, 9.12], [-420, -7.6, 9.31], [-415, -7.46, 9.47],
  [-410, -7.33, 9.62], [-405, -7.2, 9.78], [-400, -7.06, 9.93], [-395, -6.99, 10.02],
  [-390, -6.91, 10.09], [-385, -6.83, 10.16], [-380, -6.76, 10.23], [-375, -6.7, 10.28],
  [-370, -6.72, 10.3], [-360, -6.75, 10.32], [-350, -6.75, 10.34], [-340, -6.73, 10.33],
  [-335, -6.72, 10.32],
];
const BIKE_EDGES = [
  [-555, -39.24, -34.72], [-550, -37.14, -32.86], [-545, -35.62, -31.34], [-540, -34.1, -29.82],
  [-535, -32.59, -28.31], [-530, -31.07, -26.79], [-525, -29.53, -25.24], [-520, -27.99, -23.68],
  [-515, -26.45, -22.13], [-510, -24.91, -20.58], [-505, -23.72, -19.56], [-500, -22.77, -18.66],
  [-495, -21.82, -17.77], [-490, -20.87, -16.87], [-485, -19.91, -15.94], [-480, -18.97, -14.98],
  [-475, -18.03, -14.02], [-470, -17.09, -13.06], [-465, -16.15, -12.18], [-460, -15.64, -11.68],
  [-455, -15.12, -11.18], [-450, -14.61, -10.69], [-445, -14.11, -10.19], [-440, -13.62, -9.69],
  [-435, -13.13, -9.19], [-430, -12.64, -8.68], [-425, -12.14, -8.18], [-420, -11.71, -7.76],
  [-415, -11.57, -7.62], [-410, -11.43, -7.49], [-405, -11.29, -7.35], [-400, -11.15, -7.22],
  [-395, -11.02, -7.14], [-390, -10.91, -7.07], [-385, -10.79, -6.99], [-380, -10.67, -6.92],
  [-375, -10.57, -6.86], [-370, -10.58, -6.87], [-360, -10.6, -6.9], [-350, -10.6, -6.9],
  [-340, -10.54, -6.86], [-335, -10.5, -6.85],
];
const APPROACH = { east: -10.45, west: 10.37 }; // aanbruggen, recht deel (BGT)
const ARCH_DECK = { east: -10.47, west: 11.15 }; // onder de boog (BGT)
const LEAF_DECK = { east: -10.4, west: 10.35 };
// Rijbaan ten zuiden van de boog: tot x = -122 over de hele breedte, daarna
// zonder het fietsdek, ten zuiden van -335 langs de BGT-randen.
function mainEdges(x) {
  if (x < SPLIT) return [table(MAIN_EDGES, x, 1), table(MAIN_EDGES, x, 2)];
  if (x < BIKE_SPLIT) return [-6.72, APPROACH.west];
  return [APPROACH.east, APPROACH.west];
}
function bikeEdges(x) {
  if (x < SPLIT) return [table(BIKE_EDGES, x, 1), table(BIKE_EDGES, x, 2)];
  return [-10.5, -6.67]; // tegen de rijbaan aan
}

// Doorsneden (geschat op foto's): de aanbruggen een betonnen kokerligger
// met een dekplaat van 1,0 m en een koker van 2,6 m diep, onder 2,8 m en boven
// 2,0 m van de rand ingesprongen; het fietsdek een plaat van 1,2 m met
// schuine randen; de klep een stalen plaat van 0,6 m op een koker van 2,0 m.
const BOX = { slab: 1.0, depth: 2.6, insetTop: 2.0, insetBottom: 2.8 };
const BIKE_DECK = { depth: 1.2, edge: 0.5, inset: 0.6 };
// Boogdek: dekplaat 0,8 m, de trekbanden onder de ribben 3,0 m diep, de
// dwarsdragers ertussen 2,4 m, het fietspad buiten de oostelijke rib als
// uitkraging van 0,6 m aan de rand tot 1,4 m bij de rib.
const TIE_DEPTH = 3.0;
const CROSS_DEPTH = 2.4;
// Schampkanten in plaats van de leuningen: 0,9 m breed en 0,6 m hoog.
const KERB = { width: 0.9, height: 0.6 };

// Boog: twee verticale ribben (AHN: 6,4 m ten oosten en 10,1 m ten westen van
// de as, 1,8 m breed; het fietspad ligt buiten de oostelijke rib). Bovenrand
// een parabool met de top op NAP +43,0 m die het wegdek 103,6 m uit het midden
// raakt (AHN); de rib is 2,2 m hoog (foto's). De opleggingen liggen 203 m uit
// elkaar.
const ARCH = { crown: 43.0, k: 0.00262, depth: 2.2, span: 203, ribEnd: 102.6 };
const RIBS = [
  [-7.3, -5.5],
  [9.2, 11.0],
];
const archTop = (x) => ARCH.crown - ARCH.k * x * x;
const archBottom = (x) => archTop(x) - ARCH.depth * Math.hypot(1, 2 * ARCH.k * x);
// Hangers: acht knopen op het dek op velden van 22,56 m (foto's, 9 velden),
// van elke knoop een hanger naar de boog een half veld naar links en een half
// veld naar rechts (netwerk zonder kruisingen). Op 1:1000 is een kabel niet te
// printen: het vlak tussen dek en rib is een scherm met de hangers als
// stroken van 1,0 m; tussen de stroken blijven openingen over waarvan elke
// bovenkant minstens 50 graden helt, of die onder een spitse top van 55 graden
// blijven. Openingen kleiner dan 2 m2 blijven dicht.
const PANEL = ARCH.span / 9;
const DECK_NODES = Array.from({ length: 8 }, (_, k) => -ARCH.span / 2 + PANEL * (k + 1));
const HANGER = { width: 1.0, steep: 50, pointed: 55, minArea: 2.0, minHeight: 1.2 };

// Pijlers. Aanbruggen: zes kolommen van 2,2 × 0,9 m (BGT 2,2 × 0,8 m; op
// 1:1000 verbreed) per pijler op x-posities uit de BGT en geschat op dezelfde
// steek; de kolommen staan op de BGT-plaatsen naast de as.
const COLUMN = { along: 2.2, across: 0.9 };
const COLUMN_Y = [-8.2, -5.2, -1.6, 2.0, 5.65, 9.3];
const SOUTH_PIERS = [-375.7, -330.5, -285.3, -240.1, -194.85, -149.4];
const NORTH_PIERS = Array.from({ length: 5 }, (_, k) => KELDER.x1 + ((NORTH_FACE - KELDER.x1) * (k + 1)) / 6);
// Poeren in de Wantijhaven (BGT): middellijn en dikte, met kolommen langs de
// middellijn (y op de middellijn) onder de rijbaan en onder het fietsdek.
const HARBOUR_PIERS = [
  { a: [-421.78, 10.39], b: [-420.84, -11.59], thick: 3.0, cols: [8.0, 4.4, 0.8, -2.8, -6.4], bike: [-9.7] },
  { a: [-467.37, 6.98], b: [-465.89, -11.3], thick: 3.0, cols: [5.6, 2.15, -1.3, -4.75, -8.2], bike: [] },
  { a: [-513.31, 1.8], b: [-509.64, -17.26], thick: 3.0, cols: [-0.5, -4.0, -7.5, -11.0, -14.5], bike: [] },
];
const BIKE_PIERS = [
  { c: [-465.52, -14.28], size: [3.0, 3.6] },
  { c: [-508.52, -22.42], size: [3.0, 3.6] },
];
const CAP_NAP = 1.0; // bovenkant van de poeren in het water (geschat)
// Rivierpijlers: op de poer met ronde koppen (BGT) staan drie kolommen van
// 4,5 × 3,0 m onder de trekbanden en de as (foto's).
const ARCH_COLUMNS = { along: 4.5, across: 3.0, y: [-6.4, 1.85, 10.1] };

// Basculekelder (BAG 0590100000018081): blok tot onder het wegdek, met een
// plint van 1,0 m breder tot NAP +1,2 m, aan de westgevel een rij ramen als
// nissen van 0,35 m (foto) en aan de zuidwesthoek de toren van het
// bedieningsgebouw van 5,9 × 3,5 m tot NAP +20,0 m (AHN) met een raamband als
// nis rond de cabine.
const KELDER_RING = [
  [158.92, 11.19], [143.67, 11.19], [143.68, 14.32], [137.77, 14.32], [137.77, 10.85], [137.42, 10.46],
  [137.22, 10.0], [137.17, 9.7], [137.16, -5.8], [137.22, -6.23], [137.48, -6.76], [137.87, -7.14],
  [138.35, -7.36], [138.79, -7.42], [158.94, -7.4], [159.34, -7.35], [159.83, -7.13], [160.27, -6.69],
  [160.51, -6.07], [160.53, 9.58], [160.39, 10.27], [160.03, 10.76], [159.48, 11.1],
];
const TOWER = { x0: 137.77, x1: 143.68, y0: 10.85, y1: 14.32, topNap: 20.0, cabin: [17.3, 19.2] };
const PLINTH = { grow: 1.0, topNap: 1.2 };
const WINDOWS = { x: [[145.0, 149.0], [149.9, 153.9], [154.8, 158.4]], z: [8.0, 11.6], depth: 0.35 };
const JOINT = { width: 0.4, depth: 0.3 };

// ---------- dekken ----------
// Kokerligger als twee convexe lofts: de dekplaat en de koker eronder.
function boxDeck(x0, x1, edges, top = road, step = 2) {
  const xs = stationsX(x0, x1, step);
  const slab = loftX(
    xs.map((x) => {
      const [e0, e1] = edges(x);
      const zt = top(x);
      return { x, section: [[e0, zt - BOX.slab], [e1, zt - BOX.slab], [e1, zt], [e0, zt]] };
    }),
  );
  const box = loftX(
    xs.map((x) => {
      const [e0, e1] = edges(x);
      const zt = top(x);
      return {
        x,
        section: [
          [e0 + BOX.insetBottom, zt - BOX.depth],
          [e1 - BOX.insetBottom, zt - BOX.depth],
          [e1 - BOX.insetTop, zt - BOX.slab + 0.1],
          [e0 + BOX.insetTop, zt - BOX.slab + 0.1],
        ],
      };
    }),
  );
  return union([slab, box]);
}
function bikeDeck(x0, x1) {
  return loftX(
    stationsX(x0, x1, 2).map((x) => {
      const [e0, e1] = bikeEdges(x);
      const zt = bikeTop(x);
      return {
        x,
        section: [
          [e0 + BIKE_DECK.inset, zt - BIKE_DECK.depth],
          [e1 - BIKE_DECK.inset, zt - BIKE_DECK.depth],
          [e1, zt - BIKE_DECK.edge],
          [e1, zt],
          [e0, zt],
          [e0, zt - BIKE_DECK.edge],
        ],
      };
    }),
  );
}
function archDeck(x0, x1) {
  const { east: e0, west: e1 } = ARCH_DECK;
  const xs = stationsX(x0, x1, 2);
  const part = (fn) => loftX(xs.map((x) => ({ x, section: fn(road(x)) })));
  return union([
    part((zt) => [[RIBS[0][0], zt - 0.8], [e1, zt - 0.8], [e1, zt], [RIBS[0][0], zt]]),
    part((zt) => [[e0, zt - 0.6], [RIBS[0][0], zt - 1.4], [RIBS[0][0], zt], [e0, zt]]),
    part((zt) => [[RIBS[0][0] - 0.1, zt - TIE_DEPTH], [RIBS[0][1] + 0.1, zt - TIE_DEPTH], [RIBS[0][1] + 0.1, zt - 0.5], [RIBS[0][0] - 0.1, zt - 0.5]]),
    part((zt) => [[RIBS[1][0] - 0.1, zt - TIE_DEPTH], [e1, zt - TIE_DEPTH], [e1, zt - 0.5], [RIBS[1][0] - 0.1, zt - 0.5]]),
    part((zt) => [[RIBS[0][1], zt - CROSS_DEPTH], [RIBS[1][0], zt - CROSS_DEPTH], [RIBS[1][0], zt - 0.5], [RIBS[0][1], zt - 0.5]]),
  ]);
}
function leafDeck() {
  const { east: e0, west: e1 } = LEAF_DECK;
  const xs = stationsX(LEAF.x0, LEAF.x1, 2);
  return union([
    loftX(xs.map((x) => ({ x, section: [[e0, road(x) - 0.6], [e1, road(x) - 0.6], [e1, road(x)], [e0, road(x)]] }))),
    loftX(xs.map((x) => ({ x, section: [[e0 + 1.5, road(x) - LEAF.depth], [e1 - 1.5, road(x) - LEAF.depth], [e1 - 1.5, road(x) - 0.5], [e0 + 1.5, road(x) - 0.5]] }))),
  ]);
}
// Schampkant langs een rand (side -1 oost, +1 west) tussen x0 en x1.
// Met `margin` rondom groter: de vrije ruimte die rijbaan en fietspad rond de
// schampkant houden.
function kerb(x0, x1, edge, side, top = road, margin = 0) {
  return loftX(
    stationsX(x0, x1, 2).map((x) => {
      const e = edge(x);
      const a = Math.min(e, e - side * KERB.width) - margin;
      const b = Math.max(e, e - side * KERB.width) + margin;
      const zt = top(x);
      const z0 = zt - 0.3 - margin;
      const z1 = zt + KERB.height + margin;
      return { x, section: [[a, z0], [b, z0], [b, z1], [a, z1]] };
    }),
  );
}
// Massief landhoofd onder het wegdek.
function abutment(x0, x1, edges, top = road) {
  return loftX(
    stationsX(x0, x1, 2).map((x) => {
      const [e0, e1] = edges(x);
      return { x, section: [[e0, BASE], [e1, BASE], [e1, top(x) - 0.05], [e0, top(x) - 0.05]] };
    }),
  );
}

const southMain = boxDeck(SOUTH_FACE, BIKE_SPLIT, mainEdges);
const southFull = boxDeck(BIKE_SPLIT, -ARCH_END, () => [APPROACH.east, APPROACH.west]);
const bike = bikeDeck(BIKE_END, BIKE_SPLIT + 0.01);
const arch = archDeck(-ARCH_END - 0.01, LEAF.x0 + 0.01);
const leaf = leafDeck();
const kelderSlab = loftX(
  stationsX(KELDER.x0 - 0.01, KELDER.x1 + 0.01, 2).map((x) => ({
    x,
    section: [[LEAF_DECK.east, road(x) - 1.0], [LEAF_DECK.west, road(x) - 1.0], [LEAF_DECK.west, road(x)], [LEAF_DECK.east, road(x)]],
  })),
);
const northDeck = boxDeck(KELDER.x1, NORTH_FACE + 0.01, () => [APPROACH.east, APPROACH.west]);
const southAbutment = abutment(SOUTH_END, SOUTH_FACE + 0.01, mainEdges);
const bikeAbutment = abutment(BIKE_END - 4, BIKE_END + 0.01, bikeEdges, bikeTop);
const northAbutment = abutment(NORTH_FACE, NORTH_END, () => [APPROACH.east, APPROACH.west]);
const KERBS = [
  [SOUTH_END, BIKE_SPLIT, (x) => mainEdges(x)[0], -1],
  [SOUTH_END, BIKE_SPLIT, (x) => mainEdges(x)[1], 1],
  [BIKE_END - 4, BIKE_SPLIT, (x) => bikeEdges(x)[0], -1, bikeTop],
  [BIKE_SPLIT, -ARCH_END, () => APPROACH.east, -1],
  [BIKE_SPLIT, -ARCH_END, () => APPROACH.west, 1],
  [-ARCH_END, LEAF.x0, () => ARCH_DECK.east, -1],
  [LEAF.x0, KELDER.x1, () => LEAF_DECK.east, -1],
  [LEAF.x0, KELDER.x1, () => LEAF_DECK.west, 1],
  [KELDER.x1, NORTH_END, () => APPROACH.east, -1],
  [KELDER.x1, NORTH_END, () => APPROACH.west, 1],
];
const kerbs = KERBS.map(([x0, x1, edge, side, top]) => kerb(x0, x1, edge, side, top));
// Voegen van de klep: sleuven over het wegdek bij de punt en het draaipunt.
const joints = [LEAF.x0, LEAF.x1].map((x) =>
  boxFromTo(x - JOINT.width / 2, x + JOINT.width / 2, LEAF_DECK.east + KERB.width + 0.05, LEAF_DECK.west - KERB.width - 0.05, road(x) - JOINT.depth, road(x) + 1),
);

// ---------- pijlers ----------
// Kolom van 2,2 m langs de brug en 0,9 m dwars, gedraaid naar richting (dx, dy)
// van de pijlerlijn, van de onderkant tot 0,3 m in het dek.
function column(cx, cy, dir, zTop, along = COLUMN.along, across = COLUMN.across) {
  const [dx, dy] = dir; // langs de pijlerlijn (dwars op de brug)
  const ax = [dy, -dx]; // langs de brug
  const pts = [
    [-along / 2, -across / 2],
    [along / 2, -across / 2],
    [along / 2, across / 2],
    [-along / 2, across / 2],
  ].map(([a, c]) => [cx + a * ax[0] + c * dx, cy + a * ax[1] + c * dy]);
  return prism(pts, BASE, zTop);
}
const deckTopAt = (x, y) => {
  if (x < SPLIT) {
    const [b0, b1] = bikeEdges(x);
    if (y >= b0 - 0.5 && y <= b1 + 0.5) return bikeTop(x);
  } else if (x < BIKE_SPLIT && y < -6.72) return bikeTop(x);
  return road(x);
};
const approachPiers = [...SOUTH_PIERS, ...NORTH_PIERS].flatMap((x) =>
  COLUMN_Y.map((y) => column(x, y, [0, 1], deckTopAt(x, y) - 0.3)),
);
const harbourPiers = HARBOUR_PIERS.flatMap(({ a, b, thick, cols, bike }) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const n = [d[1] * (thick / 2), -d[0] * (thick / 2)];
  const cap = prism(
    [
      [a[0] + n[0], a[1] + n[1]],
      [b[0] + n[0], b[1] + n[1]],
      [b[0] - n[0], b[1] - n[1]],
      [a[0] - n[0], a[1] - n[1]],
    ],
    BASE,
    CAP_NAP,
  );
  const at = (y) => {
    const t = (y - a[1]) / (b[1] - a[1]);
    return [lerp(a[0], b[0], t), y];
  };
  return [cap, ...[...cols, ...bike].map((y) => {
    const [x] = at(y);
    return column(x, y, d, deckTopAt(x, y) - 0.3);
  })];
});
const bikePiers = BIKE_PIERS.flatMap(({ c, size }) => {
  const [x, y] = c;
  // Poer in de richting van het fietsdek (BGT), met één kolom.
  const slope = (table(BIKE_EDGES, x + 2.5, 1) + table(BIKE_EDGES, x + 2.5, 2) - table(BIKE_EDGES, x - 2.5, 1) - table(BIKE_EDGES, x - 2.5, 2)) / 10;
  const d = [-slope / Math.hypot(1, slope), 1 / Math.hypot(1, slope)];
  return [
    column(x, y, d, CAP_NAP, size[0], size[1]),
    column(x, y, d, bikeTop(x) - 0.3, COLUMN.along, 1.2),
  ];
});
function roundPier(x0, x1) {
  const r = (x1 - x0) / 2;
  const xc = (x0 + x1) / 2;
  const h = ARCH_PIER.capNap - BASE;
  return Manifold.hull([
    Manifold.cylinder(h, r, r, 32, false).translate([xc, ARCH_PIER.y0 + r, BASE]),
    Manifold.cylinder(h, r, r, 32, false).translate([xc, ARCH_PIER.y1 - r, BASE]),
  ]);
}
const archPiers = [
  [-ARCH_PIER.x1, -ARCH_PIER.x0],
  [ARCH_PIER.x0, ARCH_PIER.x1],
].flatMap(([x0, x1]) => {
  const xc = (x0 + x1) / 2;
  return [
    roundPier(x0, x1),
    ...ARCH_COLUMNS.y.map((y) => column(xc, y, [0, 1], road(xc) - 0.3, ARCH_COLUMNS.along, ARCH_COLUMNS.across)),
  ];
});

// ---------- basculekelder en bedieningsgebouw ----------
const kelderTop = Math.min(road(KELDER.x0), road(KELDER.x1)) - 0.05;
const kelderRing = ccw(KELDER_RING);
const kelderBlock = prism(kelderRing, BASE, kelderTop);
const plinth = Manifold.extrude(new CrossSection([kelderRing]).offset(PLINTH.grow, "Miter", 2), PLINTH.topNap - BASE).translate([0, 0, BASE]);
const tower = boxFromTo(TOWER.x0, TOWER.x1, TOWER.y0, TOWER.y1, BASE, TOWER.topNap);
const towerNiches = union([
  // raamband rond de cabine aan de zuid-, west- en noordzijde, met hoeken van 0,9 m
  boxFromTo(TOWER.x0 - 0.5, TOWER.x0 + 0.35, TOWER.y0 + 0.9, TOWER.y1 - 0.9, TOWER.cabin[0], TOWER.cabin[1]),
  boxFromTo(TOWER.x0 + 0.9, TOWER.x1 - 0.9, TOWER.y1 - 0.35, TOWER.y1 + 0.5, TOWER.cabin[0], TOWER.cabin[1]),
  boxFromTo(TOWER.x1 - 0.35, TOWER.x1 + 0.5, TOWER.y0 + 1.2, TOWER.y1 - 0.9, TOWER.cabin[0], TOWER.cabin[1]),
]);
const kelderWindows = union(
  WINDOWS.x.map(([x0, x1]) => boxFromTo(x0, x1, 11.19 - WINDOWS.depth, 11.19 + 0.5, WINDOWS.z[0], WINDOWS.z[1])),
);
const kelder = union([kelderBlock, plinth, tower]).subtract(union([towerNiches, kelderWindows]));

// ---------- boog: ribben met het hangerscherm ----------
const ribXs = stationsX(-ARCH.ribEnd, ARCH.ribEnd, 0.5);
const ribBand = [...ribXs.map((x) => [x, road(x) - TIE_DEPTH + 0.2]), ...[...ribXs].reverse().map((x) => [x, archTop(x)])];
// Het vlak tussen het wegdek en de onderkant van de rib.
const screenXs = ribXs.filter((x) => archBottom(x) > road(x) + 0.05);
const screenRegion = new CrossSection([
  ccw([...screenXs.map((x) => [x, road(x) - 0.05]), ...[...screenXs].reverse().map((x) => [x, archBottom(x)])]),
]);
// Hangerstroken: van elke dekknoop naar de boog een half veld links en rechts.
const cables = DECK_NODES.flatMap((xd) => [-1, 1].map((s) => [[xd, road(xd)], [xd + (s * PANEL) / 2, archBottom(xd + (s * PANEL) / 2)]]));
const strips = cables.map(([[x0, z0], [x1, z1]]) => {
  const len = Math.hypot(x1 - x0, z1 - z0);
  const d = [(x1 - x0) / len, (z1 - z0) / len];
  const n = [-d[1] * (HANGER.width / 2), d[0] * (HANGER.width / 2)];
  const a = [x0 - d[0] * 1.5, z0 - d[1] * 1.5];
  const b = [x1 + d[0] * 1.5, z1 + d[1] * 1.5];
  return ccw([
    [a[0] + n[0], a[1] + n[1]],
    [b[0] + n[0], b[1] + n[1]],
    [b[0] - n[0], b[1] - n[1]],
    [a[0] - n[0], a[1] - n[1]],
  ]);
});
const cells = screenRegion.subtract(new CrossSection(strips)).decompose();
const TAN_POINTED = Math.tan((HANGER.pointed * Math.PI) / 180);
const openingReport = [];
const openings = [];
// Punten op de plafonds van een polygoon (randen waar de opening onder ligt:
// de rand loopt naar links) die flauwer hellen dan 50 graden; randjes korter
// dan 2 cm (afrondingen van de doorsnijding) tellen mee.
function flatCeilings(poly) {
  const flat = [];
  poly.forEach(([x0, z0], i) => {
    const [x1, z1] = poly[(i + 1) % poly.length];
    if (x1 >= x0 - 1e-9) return;
    const angle = (Math.atan2(Math.abs(z1 - z0), Math.abs(x1 - x0)) * 180) / Math.PI;
    if (angle >= HANGER.steep) return;
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 0.2));
    for (let k = 0; k <= n; k++) flat.push([lerp(x0, x1, k / n), lerp(z0, z1, k / n)]);
  });
  return flat;
}
for (const cell of cells) {
  const poly = ccw(cell.toPolygons()[0]);
  // Plafonds: randen waar de cel onder ligt (de rand loopt naar links), die
  // flauwer hellen dan 50 graden.
  const flat = flatCeilings(poly);
  let shape = cell;
  if (flat.length) {
    // Spitse top van 55 graden onder alle flauwe plafonds; kies de top zo dat
    // de opening zo groot mogelijk is.
    const xs = poly.map(([x]) => x);
    const lo = Math.min(...xs);
    const hi = Math.max(...xs);
    let best = null;
    for (let xc = lo; xc <= hi; xc += 0.25) {
      let h = Infinity;
      for (const [qx, qz] of flat) h = Math.min(h, qz + TAN_POINTED * Math.abs(qx - xc));
      h -= 0.05;
      // Zak de top verder tot de doorsnijding geen flauw plafond meer heeft.
      let cut = null;
      for (let k = 0; k < 40; k++, h -= 0.05) {
        const gable = new CrossSection([[[xc - 100, h - TAN_POINTED * 100], [xc + 100, h - TAN_POINTED * 100], [xc, h]]]);
        cut = cell.intersect(gable);
        if (cut.isEmpty() || cut.toPolygons().every((q) => flatCeilings(ccw(q)).length === 0)) break;
      }
      const a = cut.area();
      if (!best || a > best.area) best = { area: a, cut };
    }
    shape = best.cut;
  }
  const area = shape.area();
  if (area < HANGER.minArea) continue;
  const pts = shape.toPolygons().flat();
  const zs = pts.map(([, z]) => z);
  if (Math.max(...zs) - Math.min(...zs) < HANGER.minHeight) continue;
  openings.push(shape);
  const xsAll = pts.map(([x]) => x);
  openingReport.push([+((Math.min(...xsAll) + Math.max(...xsAll)) / 2).toFixed(1), +Math.max(...zs).toFixed(2), +area.toFixed(1)]);
}
const openingSection = CrossSection.union(openings);
const ribs = RIBS.map(([y0, y1]) => profileY(ribBand, y0, y1).subtract(extrudeY(openingSection, y0 - 0.5, y1 + 0.5)));

const bridge = union([
  southMain,
  southFull,
  bike,
  arch,
  leaf,
  kelderSlab,
  northDeck,
  southAbutment,
  bikeAbutment,
  northAbutment,
  ...kerbs,
  ...approachPiers,
  ...harbourPiers,
  ...bikePiers,
  ...archPiers,
  kelder,
  ...ribs,
]).subtract(union(joints));

// ---------- rijbaan en fietspad als eigen onderdelen ----------
// De bovenste 0,5 m van de dekken is een eigen node met de attributen van het
// BGT-wegdeel eronder (glTF `extras.attributes`), zodat de kleurregels van een
// thema (bijvoorbeeld fietspaden rood) op het brugdek werken zoals op de
// PDOK-wegdelen. Rijbaan: het dek tussen de schampkanten; fietspad: de
// actuele BGT-vlakken met functie fietspad (lokale coördinaten, vereenvoudigd
// tot 5 cm), op het dek en op het losse fietsdek. De ribben, de schampkanten
// en de voegen van de klep blijven constructie.
const LAYER = 0.5;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_ATTRIBUTES = {
  bgt_functie: "fietspad",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_PATHS = [
  // G0590.ebec4789: naast de rijbaan op de zuidelijke aanbrug.
  [[-242.06, -6.44], [-368.12, -6.56], [-372.7, -6.62], [-372.8, -10.43], [-359.58, -10.29], [-331.1, -10.19],
    [-323.47, -10.25], [-269.07, -10.14], [-103.87, -10.18], [-103.89, -7.43], [-111.39, -6.41]],
  // G0590.500a66e1: de uitkraging buiten de oostelijke rib, tot halverwege de boog.
  [[26.51, -10.19], [26.56, -7.29], [-103.89, -7.43], [-103.87, -10.18]],
  // G0590.a805bfd0: het losse fietsdek naar het zuidoosten.
  [[-372.71, -6.87], [-372.7, -6.62], [-385.43, -6.82], [-401.49, -7.27], [-408.32, -7.38], [-420.53, -7.84],
    [-441.11, -9.74], [-465.78, -12.16], [-479.6, -14.91], [-508.65, -20.44], [-552.59, -33.78], [-559.05, -36.49],
    [-557.85, -40.19], [-550.1, -36.96], [-507.86, -24.09], [-487.93, -20.34], [-465.45, -15.98], [-420.84, -11.4],
    [-386.55, -10.58], [-372.8, -10.43]],
];
// De strook loopt tot 1 m boven het wegdek door: zo snijdt hij het hele
// bovenvlak uit de constructie en houdt die daar geen vlak zonder dikte over
// dat met de bovenkant van het wegdek vecht (z-fighting op de kaart). Het
// wegdek zelf is de strook binnen de brug.
const ABOVE = 1.0;
function topLayer(x0, x1, edges, top = road) {
  return loftX(
    stationsX(x0, x1, 2).map((x) => {
      const [e0, e1] = edges(x);
      const zt = top(x);
      return { x, section: [[e0, zt - LAYER], [e1, zt - LAYER], [e1, zt + ABOVE], [e0, zt + ABOVE]] };
    }),
  );
}
// Binnenkant van de schampkanten (side -1 oost, +1 west), 0,9 m van de rand.
const inside = (edges, east = true, west = true) => (x) => {
  const [e0, e1] = edges(x);
  return [e0 + (east ? KERB.width : 0), e1 - (west ? KERB.width : 0)];
};
const mainLayer = union([
  topLayer(SOUTH_END, BIKE_SPLIT + 0.01, inside(mainEdges)),
  topLayer(BIKE_SPLIT, -ARCH_END + 0.01, inside(() => [APPROACH.east, APPROACH.west])),
  // Waar fietsdek en rijbaan samenkomen, springt de dekrand tussen twee
  // loftstations; hier loopt de strook over de hele breedte door.
  topLayer(BIKE_SPLIT - 4, BIKE_SPLIT + 0.01, () => [APPROACH.east, -5.8]),
  // Onder de boog alleen een schampkant aan de oostrand; aan de westrand de rib.
  topLayer(-ARCH_END, LEAF.x0 + 0.01, inside(() => [ARCH_DECK.east, ARCH_DECK.west], true, false)),
  topLayer(LEAF.x0, KELDER.x1 + 0.01, inside(() => [LEAF_DECK.east, LEAF_DECK.west])),
  topLayer(KELDER.x1, NORTH_END, inside(() => [APPROACH.east, APPROACH.west])),
]);
const bikeLayer = topLayer(BIKE_END - 4, BIKE_SPLIT + 0.01, inside(bikeEdges, true, false), bikeTop);
// Rond de schampkanten 2 cm vrij: tegen de schampkant aan afgetrokken hield
// de laag op de bovenkant ervan een vlak zonder dikte over.
const kerbGuards = KERBS.map(([x0, x1, edge, side, top]) => kerb(x0, x1, edge, side, top ?? road, 0.02));
// De hele strook van elke rib blijft constructie, ook onder de openingen van
// het hangerscherm, met 2 cm vrij.
const ribGuards = RIBS.map(([y0, y1]) => profileY(ribBand, y0 - 0.02, y1 + 0.02));
const notLayer = union([...ribGuards, ...joints, ...kerbGuards]);
const bikePaths = union(BIKE_PATHS.map((poly) => prism(poly, BASE, 100)));
const roadCut = mainLayer.subtract(notLayer).subtract(bikePaths);
const bikeCut = union([mainLayer, bikeLayer]).subtract(notLayer).intersect(bikePaths);
const roadway = roadCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const structure = bridge.subtract(union([roadCut, bikeCut]));
const parts = [
  ["building:merwedebrug-papendrecht", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden vanaf de onderkant van
// de dekrand die uitloopt in een scherm van minstens 0,8 mm op printschaal tot
// de onderplaat; onder het fietsdek apart.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
function footLoft(xs, edges, top, edgeDepth) {
  return loftX(
    xs.map((x) => {
      const [e0, e1] = edges(x);
      const c = (e0 + e1) / 2;
      const w = (e1 - e0) / 2;
      const zt = top(x);
      const zb = zt - edgeDepth(x) - 0.02;
      const zIn = zt - 0.3;
      const s = Math.min(SCREEN, w - 0.05);
      const zs = zb - KNEE * (w - s);
      if (zs > BASE + 0.05) {
        return {
          x,
          section: [[c - s, BASE], [c + s, BASE], [c + s, zs], [c + w, zb], [c + w, zIn], [c - w, zIn], [c - w, zb], [c - s, zs]],
        };
      }
      // Laag dek: de wig komt al op de onderplaat uit.
      const a = w - (zb - BASE) / KNEE;
      return {
        x,
        section: [[c - a, BASE], [c + a, BASE], [c + a + 1e-3, BASE + 1e-3], [c + w, zb], [c + w, zIn], [c - w, zIn], [c - w, zb], [c - a - 1e-3, BASE + 1e-3]],
      };
    }),
  );
}
const deckEdges = (x) => {
  if (x < -ARCH_END) return mainEdges(x);
  if (x <= LEAF.x0) return [ARCH_DECK.east, ARCH_DECK.west];
  if (x <= KELDER.x1) return [LEAF_DECK.east, LEAF_DECK.west];
  return [APPROACH.east, APPROACH.west];
};
const footXs = [
  ...stationsX(SOUTH_FACE, NORTH_FACE, 1),
  ...[BIKE_SPLIT, -ARCH_END, LEAF.x0, KELDER.x1].flatMap((x) => [x - 0.01, x + 0.01]),
]
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-3);
const printFoot = union([
  // Onder de boog begint de wig onder de trekbanden aan de randen.
  footLoft(footXs, deckEdges, road, (x) => (x > -ARCH_END - 0.005 && x < LEAF.x0 + 0.005 ? TIE_DEPTH : BOX.slab)),
  footLoft(stationsX(BIKE_END, BIKE_SPLIT, 1), bikeEdges, bikeTop, () => BIKE_DECK.edge),
]);
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
    found.push({ p, area: len / 2 });
  }
  return { area, found };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
const inNiche = (xm, ym, zm) =>
  (xm > TOWER.x0 - 0.6 && xm < TOWER.x1 + 0.6 && ym > TOWER.y0 && zm > TOWER.cabin[0] - 0.1 && zm < TOWER.cabin[1] + 0.1) ||
  (xm > WINDOWS.x[0][0] - 0.1 && xm < WINDOWS.x[2][1] + 0.1 && ym > 10.5 && Math.abs(zm - WINDOWS.z[1]) < 0.1);
{
  // In het model hangen alleen de onderkant van de dekken (met de
  // uitkragingen en de kolomgaten) en de bovenkant van de nissen vrij; boven
  // het wegdek niets (de hangeropeningen hebben een spitse top).
  const buckets = {};
  for (const { p, area: a } of overhangs(bridge).found) {
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const ym = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const key = inNiche(xm, ym, zm) ? "nissen" : zm > road(xm) + 0.05 ? "boven het dek" : "onder het dek";
    buckets[key] = (buckets[key] ?? 0) + a;
    if (key === "boven het dek" && a > 0.01) console.log("boven het dek:", [xm, ym, zm].map((c) => +c.toFixed(2)), +a.toFixed(3));
  }
  console.log("vrij hangend (m2):", Object.fromEntries(Object.entries(buckets).map(([k, a]) => [k, +a.toFixed(2)])));
  if ((buckets["boven het dek"] ?? 0) > 0.5) throw new Error("overhang boven het dek");
  const print = overhangs(printModel);
  const rest = print.found.filter(({ p }) => {
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const ym = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    return !inNiche(xm, ym, zm) && zm > BASE + 0.5;
  });
  const restArea = rest.reduce((sum, { area: a }) => sum + a, 0);
  console.log("overhang in de printversie buiten de nissen (m2):", +restArea.toFixed(2));
  {
    const byX = {};
    for (const { p, area: a } of rest) {
      const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
      const k = Math.floor(xm / 50) * 50;
      byX[k] = (byX[k] ?? 0) + a;
    }
    console.log("overhang per 50 m:", Object.fromEntries(Object.entries(byX).map(([k, a]) => [k, +a.toFixed(1)])));
  }
  if (restArea > 2) {
    for (const { p, area: a } of rest.slice(0, 12)) console.log(p[0].map((c) => +c.toFixed(1)), +a.toFixed(2));
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
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
  riseAboveDeckM: +(ARCH.crown - road(0)).toFixed(2),
  deckNodes: DECK_NODES.map((x) => +x.toFixed(2)),
  openings: openingReport.length,
  openingsXTopArea: openingReport,
};
report.piers = {
  south: SOUTH_PIERS,
  north: NORTH_PIERS.map((x) => +x.toFixed(2)),
  harbour: HARBOUR_PIERS.map(({ a, b }) => +((a[0] + b[0]) / 2).toFixed(2)),
};
const glbFile = path.join(outDir, "merwedebrug-papendrecht.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-merwedebrug-papendrecht.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `merwedebrug-papendrecht-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Merwedebrug Papendrecht 1:${scale} mm Z-up`);
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
// Maaiveldpunten op het water: de Wantijhaven ten westen van de zuidelijke
// aanbrug en de Beneden-Merwede aan beide zijden van de boog en bij de klep.
const samplePoints = [
  [-490, 22],
  [-440, 22],
  ...[-60, 0, 60, 180].flatMap((x) => [
    [x, 25],
    [x, -25],
  ]),
];
await writeFile(
  path.join(outDir, "merwedebrug-papendrecht.json"),
  JSON.stringify(
    {
      name: "Merwedebrug (Beneden-Merwede)",
      file: "merwedebrug-papendrecht.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [108025.67, 426267.5],
      xAxis: [-0.07665, 0.99706],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0590100000018081"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden onder de boog op NAP 0 (z = NAP-hoogte, het water van de Beneden-Merwede) in de oorsprong, +X langs de brug naar het noorden (Papendrecht, RD-richting 94,40 graden vanaf het oosten) en +Y naar het westen. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van de dekken met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan regionale weg of fietspad, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk van het zuidelijke landhoofd in Dordrecht (x = -568) tot het noordelijke in Papendrecht (x = 482,9). De boogbrug met trekband van 203 m als twee verticale ribben van 1,8 m breed (6,4 m ten oosten en 10,1 m ten westen van de as, het fietspad buiten de oostelijke rib) met de top op NAP +43,0 m en het netwerk van schuine hangers (acht knopen op het dek, van elke knoop twee hangers naar de boog) als een scherm met stroken van 1,0 m en spitse openingen; de twee rivierpijlers met ronde koppen tot NAP +6,2 m en drie kolommen; de basculeklep van 34,3 m in gesloten stand met voegen; de basculekelder (BAG-pand) met plint, ramen als nissen en de toren van het bedieningsgebouw tot NAP +20,0 m; de zuidelijke aanbrug als kokerligger op tien velden van circa 45 m met een bocht naar het zuidoosten, zes kolommen per pijler en poeren in de Wantijhaven, met het lager liggende fietsdek dat vanaf x = -122 afdaalt en ten zuiden van x = -335 losraakt; de noordelijke aanbrug op zes velden. Het wegdek ligt op NAP +10,6 m (Dordrecht) tot +14,9 m (boog) en +6,1 m (Papendrecht). Schampkanten in plaats van leuningen. Het windverband en de portalen tussen de ribben (vrije horizontale overspanningen van 16,5 m), lantaarns, de seinpalen en slagbomen, het remmingwerk en de open stand van de klep zijn weggelaten; de export vult onder de dekken een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water van de haven en de rivier bemonsterd; groundHeight is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NORTH_END - SOUTH_END).toFixed(1),
        archSpanM: ARCH.span,
        archCrownNapM: ARCH.crown,
        archRiseAboveDeckM: report.arch.riseAboveDeckM,
        archRibsFromAxisM: { east: -6.4, west: 10.1 },
        hangerDeckNodesX: report.arch.deckNodes,
        basculeLeafM: +(LEAF.x1 - LEAF.x0).toFixed(2),
        deckWidthM: { approach: +(APPROACH.west - APPROACH.east).toFixed(2), arch: +(ARCH_DECK.west - ARCH_DECK.east).toFixed(2) },
        southPierX: [...HARBOUR_PIERS.map(({ a, b }) => +((a[0] + b[0]) / 2).toFixed(1)).reverse(), ...SOUTH_PIERS],
        northPierX: report.piers.north,
        deckNapM: { south: DECK_NAP[0], crest: Math.max(...DECK_NAP), north: DECK_NAP[DECK_NAP.length - 1] },
        towerTopNapM: TOWER.topNap,
        waterNapM: 0,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Merwedebrug_(Beneden-Merwede)",
        "https://structurae.net/en/structures/merwede-bridge-papendrecht",
        "PDOK BGT overbruggingsdeel (dekranden, fietsdek, pijlers met kolommen, poeren, rivierpijler, landhoofden), EPSG:28992",
        "PDOK BAG pand 0590100000018081 (basculekelder met bedieningsgebouw)",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, het fietsdek, de boogribben, de pijlerkoppen en de toren",
        "PDOK luchtfoto (Actueel_orthoHR) voor de klep, de kelder en het fietspad",
        "Wikimedia Commons: Papendrecht, brug tussen Papendrecht en Dordrecht foto5 2010-06-27 17.06.JPG, Papendreschtsebrug over de Beneden Merwede, gezien van noord naar zuid.JPG, Papendrechtse brug 2018 1, 2 en 3.jpg, PapendrechtMerwedebrug01 tot en met 04.JPG",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

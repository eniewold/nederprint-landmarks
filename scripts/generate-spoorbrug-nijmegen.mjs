// Genereert een vereenvoudigd, gesloten 3D-model van de Spoorbrug Nijmegen:
// de dubbelsporige spoorbrug over de Waal tussen Nijmegen en Lent, met de
// fietsbrug De Snelbinder (2004) aan de oostkant. Over de vaargeul ligt sinds
// 1984 één stalen boogvakwerk van 235,5 m tussen de opleggingen (de langste
// overspanning van een spoorbrug in Nederland toen hij werd gebouwd): twee
// verticale vakwerkwanden met een veelhoekige bovenrand tot NAP +49,7 m en het
// spoor als trekband. Naar het noorden volgen acht aanbrugoverspanningen van
// 50 tot 60 m over de rest van de Waal, het eiland Veur-Lent en de Spiegelwaal
// (de nevengeul van Ruimte voor de Waal) tot het landhoofd op de dijk bij Lent.
// De Snelbinder loopt over de hele lengte naast het spoor; over de
// boogoverspanning buigt het dek tot 12 m naar buiten en hangt het aan een
// eigen witte buisboog naast het oostelijke vakwerk, met schuine hangers naar de
// buitenrand van het dek. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog; nodes building:spoorbrug,
// building:snelbinder en building:pijlers, en drie road-nodes met de bovenste
// 0,5 m van de dekken en de BGT-attributen: spoor, fietspad en voetpad; met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal> met een printvoet onder de
// dekken.
//
//   node scripts/generate-spoorbrug-nijmegen.mjs              # 1:2500 (standaard)
//   node scripts/generate-spoorbrug-nijmegen.mjs --scale 1000
//
// Met 712 m is de brug op 1:1000 te lang voor een printbed; de STL staat
// daarom standaard op 1:2500 (285 mm), zoals de Waalbrug.
//
// Assenstelsel: oorsprong midden tussen de twee opleggingen van de boog, op de
// as tussen de twee sporen (RD 187336,55, 429364,15), op de waterspiegel van
// de Spiegelwaal volgens het PDOK-terrein (50,80 m ellipsoïdisch, NAP +7,1 m),
// Z omhoog. +X loopt langs de brug naar Lent (noordnoordoost, RD-richting
// 72,98 graden vanaf het oosten, langs de sporen in de BGT), +Y naar het
// westen (stroomafwaarts). De sporen liggen op y = ±2,04, de Snelbinder op
// y = -6,3 tot -18,6. Het zuidelijke landhoofd (Waalkade) begint op
// x = -129,35, de opleggingen van de boog staan op x = ±117,75, het
// noordelijke landhoofd op de dijk eindigt op x = 582,25.
//
// Bronnen: BGT overbruggingsdeel (dekken van spoor en Snelbinder, de
// oplegpijler op de kade, de rivierpijler met voorkoppen, vier pijlers in de
// Waal en op het eiland, drie poeren in de Spiegelwaal, de landhoofden), BGT
// spoor (de sporen) en BGT wegdeel (spoorbaan, fietspad en voetpad op het dek);
// AHN DSM/DTM 0,5 m (PDOK WCS) voor het lengteprofiel van het spoor (NAP +24,3
// m op de kade, +24,86 m midden op de boog, +22,0 m op de dijk), van de
// Snelbinder, de bovenrand van het boogvakwerk (NAP +49,7 m, een parabool door
// de bovenknopen), de buisboog van de Snelbinder (NAP +49,2 m, 3,5 m buiten het
// oostelijke vakwerk) en de ligging van de vakwerkwanden; PDOK-terrein voor
// de waterspiegel; PDOK-luchtfoto (8 cm) voor de plattegrond; Wikipedia
// (lengte van de boog 235 m, doorvaarthoogte NAP +22,8 m, Snelbinder 2004 aan
// de oostkant); Wikimedia Commons-foto's voor het vakwerkpatroon, de buisboog
// en hangers van de Snelbinder, de aanbruggen en de poeren. Geschat (foto's)
// zijn de constructiehoogtes van de dekken (boog 2,1 m, aanbruggen 2,6 m,
// Snelbinder 1,2 m), het aantal velden (twintig van 11,8 m, uit de
// windverbanden in het AHN), de staafbreedtes, de doorsnede van de buisboog
// (1 m) en de pijlers van de Spiegelwaal boven hun poeren.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "spoorbrug-nijmegen");
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
// Doorsnede in het XZ-vlak (als CrossSection in x, z), uitgetrokken langs Y.
const extrudeY = (section, y0, y1) =>
  section
    .extrude(y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
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
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
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
// Blok langs X tussen twee functies van x in y en in z, over de stations xs.
const bandLoft = (xs, y0, y1, z0, z1) =>
  loftX(xs.map((x) => ({ x, section: [[y0(x), z0(x)], [y1(x), z0(x)], [y1(x), z1(x)], [y0(x), z1(x)]] })));
// Pijler met ronde koppen: rechthoek in x, halve cirkels aan beide kanten in y.
function roundPier(x0, x1, y0, y1, z0, z1) {
  const r = (x1 - x0) / 2;
  const xc = (x0 + x1) / 2;
  return Manifold.hull([
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([xc, y0 + r, z0]),
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([xc, y1 - r, z0]),
  ]);
}
// Laagste en hoogste y van een ring (lokale x, y) op een verticale lijn x.
function interval(ring, x) {
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i < ring.length; i++) {
    const [xa, ya] = ring[i];
    const [xb, yb] = ring[(i + 1) % ring.length];
    if (xa === xb) continue;
    if ((x >= xa && x < xb) || (x >= xb && x < xa)) {
      const y = ya + ((yb - ya) * (x - xa)) / (xb - xa);
      lo = Math.min(lo, y);
      hi = Math.max(hi, y);
    }
  }
  return lo <= hi ? [lo, hi] : null;
}
const inRing = ([x, y], ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const uniqueSorted = (values, eps = 0.01) => {
  const s = [...values].sort((a, b) => a - b);
  return s.filter((v, i) => i === 0 || v - s[i - 1] > eps);
};
const range = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};

// ---------- hoofdmaten (boven de waterspiegel, NAP +7,1 m) ----------
// PDOK legt de Spiegelwaal op 50,80 m en de Waal op 50,96 tot 51,06 m
// ellipsoïdisch; het PDOK-terrein ligt hier 43,69 m boven het AHN (mediaan).
const WATER_NAP = 7.1;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten: de
// Spiegelwaal. Terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 50.8;
const POINTED = (55 * Math.PI) / 180; // zijden van de spitse openingen
const NICHE = 0.35; // diepte van een blinde nis aan elke kant van een vakwerkwand

// Boog: opleggingen op x = ±117,75 (BGT: oplegpijler op de kade en
// rivierpijler, 235,5 m), twintig velden van 11,775 m (windverbanden in het
// AHN tussen de bovenknopen 1 en 19 op x = ±105,975).
const ARCH = { half: 117.75, panels: 20 };
const PANEL = (2 * ARCH.half) / ARCH.panels;
// Bovenkant van de bovenregel op de bovenknopen: een parabool met de top op
// NAP +49,7 m (AHN: +36,5 m op knoop 1, +44,9 m op 67 m en +48,0 m op 43 m uit
// het midden); de eindstijlen lopen recht van de oplegging (NAP +25,0 m) naar
// knoop 1.
const ARCH_CROWN_NAP = 49.7;
const ARCH_K = 0.001175;
const archKnotNap = (x) => ARCH_CROWN_NAP - ARCH_K * x * x;
const ARCH_TOP = (() => {
  const rows = [[-ARCH.half - 0.6, 25.0]];
  for (let k = 1; k < ARCH.panels; k++) {
    const x = -ARCH.half + k * PANEL;
    rows.push([x, archKnotNap(x)]);
  }
  rows.push([ARCH.half + 0.6, 25.0]);
  return table(rows);
})();
// Vakwerkwanden: verticaal, 1,6 m dik, buitenkant op y = ±6,6 (BGT-dek en AHN).
const PLANES = [[-6.6, -5.0], [5.0, 6.6]];
const ARCH_DEPTH = 2.1; // vloer met trekband: spoor NAP +24,86 m, doorvaarthoogte +22,8 m

// Lengteprofiel van het spoor (AHN, mediaan per 10 m): over de boog een
// toog van NAP +24,35 m op de opleggingen naar +24,86 m in het midden.
const RAIL_APPROACH = table([
  [117.75, 24.36], [130.65, 24.29], [170.65, 24.08], [220.65, 23.86], [270.65, 23.62], [320.65, 23.4],
  [350.65, 23.23], [390.65, 22.96], [430.65, 22.7], [470.65, 22.59], [510.65, 22.36], [550.65, 22.12],
  [582.25, 21.98],
]);
const RAIL_TOP_NAP = (x) => {
  if (x < -ARCH.half) return 24.32 + ((x + 129.35) * (24.35 - 24.32)) / (129.35 - ARCH.half);
  if (x <= ARCH.half) return 24.86 - 0.51 * (x / ARCH.half) ** 2;
  return RAIL_APPROACH(x);
};
const railTop = (x) => Z(RAIL_TOP_NAP(x));
const APPROACH_DEPTH = 2.6; // aanbruggen (foto's)
const RAIL = { start: -129.35, end: 582.25, deck: [-5.3, 5.36] };
// Bovenkant van de Snelbinder (AHN, mediaan op het fietspad per 10 m).
const SNEL_TOP_NAP = table([
  [-126.45, 23.6], [-114.35, 23.88], [-104.35, 24.05], [-94.35, 24.13], [-64.35, 24.25], [-34.35, 24.32],
  [0.65, 24.35], [35.65, 24.34], [65.65, 24.29], [95.65, 24.19], [117.65, 24.08], [145.65, 24.01],
  [170.65, 23.86], [215.65, 23.64], [235.65, 23.52], [285.65, 23.25], [320.65, 23.03], [355.65, 22.88],
  [395.65, 22.63], [425.65, 22.54], [470.65, 22.3], [515.65, 21.99], [530.65, 21.9], [545.65, 21.71],
  [560.65, 21.43], [575.65, 21.0],
]);
const snelTop = (x) => Z(SNEL_TOP_NAP(x));
const SNEL_DEPTH = 1.2;

// Buisboog van de Snelbinder (AHN): bovenkant en as in y als functie van de
// afstand tot het midden. Over het middelste deel loopt hij 0,5 m onder de
// bovenrand van het vakwerk en 3,5 m erbuiten; naar de opleggingen zakt hij
// naar buiten tot op het dek.
const TUBE_TOP_NAP = table([
  [0, 49.2], [20, 49.0], [31, 48.5], [43, 47.6], [51, 46.8], [59, 45.8], [67, 44.0], [75, 41.6], [83, 38.8],
  [91, 35.9], [99, 32.8], [107, 29.6], [113, 27.0], [117.75, 24.6],
]);
const TUBE_Y = table([[0, -9.0], [55, -9.0], [70, -9.8], [85, -10.8], [100, -11.3], [117.75, -12.0]]);
const TUBE = 1.0; // doorsnede van de buisboog
const tubeTop = (x) => Z(TUBE_TOP_NAP(Math.abs(x)));
const tubeY = (x) => TUBE_Y(Math.abs(x));
const SCREEN = { half: 113, T: 0.9 }; // hangerscherm tussen buisboog en buitenrand van het dek

// Pijlers (BGT, lokale x- en y-bereiken).
const PIERS = [
  { name: "oplegpijler kade", x0: -120.15, x1: -115.35, y0: -15.21, y1: 8.91 },
  { name: "rivierpijler", x0: 114.15, x1: 121.45, y0: -13.46, y1: 13.59 },
  { name: "pijler Waal", x0: 166.45, x1: 171.05, y0: -8.21, y1: 7.67 },
  { name: "pijler oever", x0: 216.95, x1: 221.95, y0: -14.82, y1: 7.68 },
  { name: "pijler eiland", x0: 268.45, x1: 273.95, y0: -14.99, y1: 7.49 },
  { name: "pijler eiland noord", x0: 326.35, x1: 331.35, y0: -15.08, y1: 7.41 },
];
// Poeren in de Spiegelwaal (BGT sloof, 5 × 22,5 m met ronde koppen) met een
// pijler van 3 m (foto's) tot onder beide dekken.
const SLOOF_TOP_NAP = 9.0;
const SLOVEN = [382.65, 440.15, 497.55].map((x0) => ({ x0, x1: x0 + 5, y0: -15.08, y1: 7.42 }));
const SLOOF_PIER = { w: 3.0, y0: -12.65, y1: 5.36 };
const ABUTMENTS = [
  { name: "landhoofd noord", x0: 555.55, x1: 569.85, y0: -7.26, y1: 8.1 },
  { name: "landhoofd dijk", x0: 574.65, x1: 582.25, y0: -5.71, y1: 5.59 },
];

// ---------- BGT-wegdelen op het dek (lokale coördinaten, 5 cm) ----------
const RAIL_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const FOOT_ATTRIBUTES = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "open verharding", plus_fysiekvoorkomen: "tegels" };
// Fietspad, gesloten verharding, asfalt: de Snelbinder van de kade tot de dijk.
const BIKE_RING = [[-126.48, -7.27], [-126.47, -9.0], [-80.9, -12.28], [-22.82, -14.53], [27.07, -15.01],
  [46.86, -14.65], [70.52, -13.84], [93.88, -12.79], [118.46, -11.25], [178.29, -10.69], [500.62, -10.71],
  [550.1, -11.86], [559.65, -13.09], [575.66, -13.53], [574.94, -8.99], [559.68, -8.69], [550.3, -7.48],
  [500.52, -6.33], [168.76, -6.25], [118.49, -6.8], [93.85, -8.4], [70.12, -9.49], [45.23, -10.27],
  [23.23, -10.69], [-0.51, -10.83], [-23.71, -10.71], [-47.29, -10.21], [-70.72, -9.45], [-118.81, -6.91]];
// Voetpad, open verharding, tegels: buiten het fietspad, over de boog de
// naar buiten gebogen strook langs de hangers, tot de trap bij de dijk.
const FOOT_RING = [[-126.47, -9.0], [-126.47, -10.02], [-121.34, -13.79], [-100.1, -15.79], [-84.21, -16.64],
  [-68.31, -17.33], [-47.47, -17.96], [-23.66, -18.46], [11.41, -18.61], [23.22, -18.5], [46.76, -18.06],
  [65.78, -17.45], [82.24, -16.76], [116.14, -15.02], [125.84, -13.04], [178.23, -12.56], [500.6, -12.66],
  [549.86, -13.83], [549.92, -14.4], [551.21, -17.16], [556.33, -14.56], [559.65, -13.09], [550.1, -11.86],
  [500.62, -10.71], [178.29, -10.69], [118.46, -11.25], [93.88, -12.79], [70.52, -13.84], [46.86, -14.65],
  [27.07, -15.01], [-22.82, -14.53], [-80.9, -12.28]];
// Spoorbaan, gesloten verharding (met een gat tussen de sporen over de boog)
// en half verhard op het landhoofd aan de dijk.
const RAIL_RINGS = [
  [[-129.38, -4.01], [-118.89, -4.02], [-118.89, -2.78], [-41.86, -2.69], [118.08, -2.77], [118.06, -3.99],
    [433.61, -4.0], [557.8, -4.09], [557.77, -3.58], [558.41, -3.51], [558.37, 3.95], [118.18, 4.01],
    [118.16, 2.77], [32.25, 2.85], [-118.89, 2.75], [-118.89, 4.03], [-129.34, 4.04]],
  [[558.37, 3.44], [558.41, -3.51], [563.53, -3.5], [563.54, -3.99], [582.22, -3.98], [582.2, 3.94],
    [563.53, 3.88], [563.54, 3.51]],
];
const RAIL_HOLE = [[-118.89, -1.26], [-118.89, 1.24], [32.25, 1.34], [118.14, 1.26], [118.1, -1.25], [32.25, -1.17]];
const BGT_WEGDELEN = [
  { id: "L0004.9b3b3e430bc0490294ad2df626bfa16e", functie: "spoorbaan", fysiek: "gesloten verharding" },
  { id: "L0004.c2843aa38c7a4161a14a26dac0116c59", functie: "spoorbaan", fysiek: "half verhard" },
  { id: "G0268.42ff08b483f75775e0530100007f0cc2", functie: "fietspad", fysiek: "gesloten verharding, asfalt" },
  { id: "G0268.42ff08b5a7eb5775e0530100007f0cc2", functie: "voetpad", fysiek: "open verharding, tegels" },
];
// Beide sporen liggen over de hele lengte in een spoorbaan.
for (const yTrack of [-2.04, 2.04]) {
  for (let x = -129; x <= 582; x += 1) {
    const p = [x, yTrack];
    if (!RAIL_RINGS.some((r) => inRing(p, r)) || inRing(p, RAIL_HOLE)) throw new Error(`spoor op x = ${x} niet in de spoorbaan`);
  }
}

// Randen van de Snelbinder: buitenrand (voetpad), grens fietspad/voetpad en
// binnenrand (fietspad), per x.
const SNEL = { start: -126.47, end: 575.0, footEnd: 559.65 };
const evalX = (x) => clamp(x, SNEL.start + 0.005, 574.9);
const snelEdges = (x) => {
  const xe = evalX(x);
  const bike = interval(BIKE_RING, xe);
  const foot = xe < SNEL.footEnd ? interval(FOOT_RING, xe) : null;
  const inner = bike[1];
  const boundary = foot ? foot[1] : bike[0];
  const outer = foot ? Math.min(foot[0], bike[0]) : bike[0];
  return { outer, boundary, inner };
};
const snelStations = uniqueSorted([
  ...BIKE_RING.map(([x]) => x),
  ...FOOT_RING.map(([x]) => x),
  ...range(SNEL.start, SNEL.end, 5),
  SNEL.start,
  SNEL.end,
].filter((x) => x >= SNEL.start && x <= SNEL.end));

// ---------- vakwerkwand (zoals de Brug bij Westervoort) ----------
// Een vakwerk is op 1:1000 niet open te printen. Elke wand is daarom een dichte
// plaat met doorgaande driehoekige openingen met de punt omhoog (binnen elke
// Λ van twee diagonalen, gedeeld door de verticaal als die er is) en blinde
// nissen voor de driehoeken met de vlakke kant boven. Zijden van openingen die
// vlakker lopen dan 55 graden worden rond de top steiler gezet.
function trussSection(opts) {
  const { x0, x1, panels, top, tc, bottom, floor, verticals, wd, wv, endW } = opts;
  const P = (x1 - x0) / panels;
  const under = (x) => top(x) - tc;
  const n = Math.max(8, Math.round((x1 - x0) / 0.5));
  const xs = Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
  const outline = opts.outline ?? [[x0, bottom], [x1, bottom], ...[...xs].reverse().map((x) => [x, top(x)])];
  const offsetLine = (xa, za, xb, zb, d) => {
    const m = (zb - za) / (xb - xa);
    const shift = d * Math.sqrt(1 + m * m);
    return { m, at: (x) => za + m * (x - xa) - shift };
  };
  const holes = [];
  const niches = [];
  const kites = [];
  const nodesX = Array.from({ length: panels + 1 }, (_, k) => x0 + k * P);
  const tops = nodesX.slice(0, -1).map((x) => x + P / 2);
  const tanP = Math.tan(POINTED);
  for (let k = 0; k < panels; k++) {
    const t = tops[k];
    const zt = under(t);
    const dl = k === 0 ? endW : wd / 2;
    const dr = k === panels - 1 ? endW : wd / 2;
    const left = offsetLine(nodesX[k], floor, t, zt, dl);
    const right = offsetLine(nodesX[k + 1], floor, t, zt, dr);
    const sides = verticals
      ? [
          { xv: t - wv / 2, line: left, dir: -1 },
          { xv: t + wv / 2, line: right, dir: 1 },
        ]
      : [{ xv: null }];
    for (const side of sides) {
      if (side.xv === null) {
        const bl = left.at(0);
        const br = right.at(0);
        const xa = (br - bl) / (left.m - right.m);
        const za = Math.min(left.at(xa), under(xa) - 0.15);
        if (za - floor < 0.8) continue;
        const a = xa - (za - floor) / Math.max(left.m, tanP);
        const b = xa + (za - floor) / Math.max(-right.m, tanP);
        if (b - a < 0.4) continue;
        holes.push([[a, floor], [b, floor], [xa, za]]);
        continue;
      }
      const { xv, line, dir } = side;
      const za = Math.min(line.at(xv), under(xv) - 0.15);
      const m = Math.max(Math.abs(line.m), tanP);
      if (za - floor < 0.8) continue;
      const xb = xv + (dir * (za - floor)) / m;
      if (Math.abs(xb - xv) < 0.4) continue;
      holes.push(dir < 0 ? [[xb, floor], [xv, floor], [xv, za]] : [[xv, floor], [xb, floor], [xv, za]]);
    }
  }
  for (let k = 0; k + 1 < panels; k++) {
    const xb = nodesX[k + 1];
    const ta = tops[k] + (verticals ? wv / 2 : 0);
    const tb = tops[k + 1] - (verticals ? wv / 2 : 0);
    const l = offsetLine(xb, floor, tops[k], under(tops[k]), -wd / 2);
    const r = offsetLine(xb, floor, tops[k + 1], under(tops[k + 1]), -wd / 2);
    const span = 80;
    const above = (line, xa, xc) =>
      new CrossSection([ccw([[xa, line.at(xa)], [xc, line.at(xc)], [xc, line.at(xc) + span], [xa, line.at(xa) + span]])]);
    const m = 24;
    const topPts = Array.from({ length: m + 1 }, (_, i) => {
      const x = ta + ((tb - ta) * i) / m;
      return [x, under(x) - 0.1];
    });
    const cap = new CrossSection([ccw([[ta, floor], [tb, floor], ...[...topPts].reverse()])]);
    const niche = cap.intersect(above(l, xb - 2 * P, xb + 2 * P)).intersect(above(r, xb - 2 * P, xb + 2 * P));
    if (niche.area() <= 0.5) continue;
    if (opts.kites) {
      // Ruit: de driehoek tussen twee Λ's met een spitse top van 55 graden
      // onder de bovenregel, als doorgaande opening; boven de ruit blijft een
      // knoopplaat onder de regel staan.
      const zTop = under(xb) - 0.15;
      const big = 2 * P;
      const roof = new CrossSection([ccw([[xb - big, zTop - tanP * big], [xb + big, zTop - tanP * big], [xb, zTop]])]);
      const kite = niche.intersect(roof);
      if (kite.area() > 1.0) {
        kites.push(kite);
        continue;
      }
    }
    niches.push(niche);
  }
  let plate = new CrossSection([ccw(outline)]);
  plate = plate.subtract(new CrossSection(holes.map(ccw)));
  if (kites.length) plate = plate.subtract(CrossSection.union(kites));
  return {
    plate,
    niches: niches.length ? CrossSection.union(niches) : null,
    holes: holes.length,
    kites: kites.length,
    nicheCount: niches.length,
  };
}

const stats = {};

// ---------- spoorbrug ----------
// Stations langs het spoor: de knopen en halve velden over de boog, de
// tabelpunten van de aanbruggen en om de 10 m.
const railStations = uniqueSorted([
  RAIL.start,
  -ARCH.half - 0.6,
  -ARCH.half,
  ...range(-ARCH.half, ARCH.half, PANEL / 2),
  ARCH.half + 0.6,
  ...range(ARCH.half, RAIL.end, 10),
  RAIL.end,
]);
const within = (xs, a, b) => xs.filter((x) => x >= a - 1e-6 && x <= b + 1e-6);
const archBottom = (x) => railTop(x) - ARCH_DEPTH;
const approachBottom = (x) => railTop(x) - APPROACH_DEPTH;
function railBridge() {
  const parts = [];
  // Twee vakwerkwanden over de boog, de onderkant op de onderkant van de vloer.
  const bottomPts = range(-ARCH.half, ARCH.half, PANEL / 2).map((x) => [x, archBottom(x)]);
  const topPts = range(-ARCH.half, ARCH.half, 0.5).reverse().map((x) => [x, Z(ARCH_TOP(x))]);
  const floor = Z(24.86) + 0.5;
  let holes = 0;
  let kites = 0;
  let niches = 0;
  for (const [y0, y1] of PLANES) {
    // Twintig velden: elke Λ beslaat twee velden met de top op een oneven
    // bovenknoop en de verticaal daaronder; de eerste en laatste Λ hebben de
    // eindstijl als buitenste diagonaal.
    const { plate, niches: nicheSection, holes: h, kites: kh, nicheCount } = trussSection({
      x0: -ARCH.half,
      x1: ARCH.half,
      panels: ARCH.panels / 2,
      top: (x) => Z(ARCH_TOP(x)),
      tc: 1.6,
      bottom: archBottom(0),
      floor,
      verticals: true,
      wd: 1.45,
      wv: 1.45,
      endW: 1.6,
      kites: true,
      outline: [...bottomPts, ...topPts],
    });
    let wall = extrudeY(plate, y0, y1);
    if (nicheSection) {
      wall = wall
        .subtract(extrudeY(nicheSection, y0 - 0.2, y0 + NICHE))
        .subtract(extrudeY(nicheSection, y1 - NICHE, y1 + 0.2));
    }
    parts.push(wall);
    holes += h;
    kites += kh;
    niches += nicheCount;
  }
  // Vloer tussen de wanden over de boog.
  parts.push(
    bandLoft(within(railStations, -ARCH.half - 0.6, ARCH.half + 0.6), () => PLANES[0][1] - 0.05, () => PLANES[1][0] + 0.05, archBottom, railTop),
  );
  // Korte vloer van het zuidelijke landhoofd tot de oplegging.
  parts.push(bandLoft(within(railStations, RAIL.start, -ARCH.half + 0.6), () => RAIL.deck[0], () => RAIL.deck[1], archBottom, railTop));
  // Aanbruggen van de rivierpijler tot het landhoofd op de dijk.
  parts.push(bandLoft(within(railStations, ARCH.half - 0.6, RAIL.end), () => RAIL.deck[0], () => RAIL.deck[1], approachBottom, railTop));
  stats.boog = { holes, kites, niches, panels: ARCH.panels, panelM: +PANEL.toFixed(3) };
  return union(parts);
}
const rail = railBridge();

// ---------- Snelbinder ----------
const snelBottom = (x) => snelTop(x) - SNEL_DEPTH;
function snelbinder() {
  const parts = [];
  // Dek over de hele lengte tussen de buitenrand en de binnenrand.
  parts.push(
    bandLoft(snelStations, (x) => snelEdges(x).outer, (x) => snelEdges(x).inner, snelBottom, snelTop),
  );
  // Over de aanbruggen een lijf tussen het spoordek en de Snelbinder, 0,6 m
  // onder het fietspad (de spleet ertussen blijft open).
  parts.push(
    bandLoft(within(snelStations, ARCH.half, SNEL.end), (x) => snelEdges(x).inner - 0.1, () => RAIL.deck[0] + 0.05, snelBottom, (x) => snelTop(x) - 0.6),
  );
  // Over de boog dwarsliggers op de knopen van de vakwerkwand naar de
  // binnenrand van het gebogen dek.
  for (let k = 1; k < ARCH.panels; k++) {
    const x = -ARCH.half + k * PANEL;
    const zs = snelTop(x);
    parts.push(boxFromTo(x - 0.5, x + 0.5, snelEdges(x).inner - 0.8, PLANES[0][0] + 0.05, zs - 1.6, zs - 0.6));
  }
  // Buisboog: een vierkante doorsnede van 1 m, van oplegging tot oplegging.
  const tubeStations = range(-ARCH.half + 0.3, ARCH.half - 0.3, 1);
  const tube = bandLoft(tubeStations, (x) => tubeY(x) - TUBE / 2, (x) => tubeY(x) + TUBE / 2, (x) => tubeTop(x) - TUBE, tubeTop);
  parts.push(tube);
  // Hangerscherm van de buisboog naar de buitenrand van het dek, met
  // doorgaande driehoekige openingen met de punt omhoog tussen de hangers
  // (Warren zonder verticalen, achttien velden tussen de knopen 1 en 19).
  const screenTopZ = (x) => tubeTop(x) - TUBE / 2;
  const screenFloor = Z(SNEL_TOP_NAP(0)) + 0.5;
  const xsS = range(-SCREEN.half, SCREEN.half, 1);
  const outline = [
    ...range(-SCREEN.half, SCREEN.half, 2).map((x) => [x, snelTop(x) - 0.3]),
    ...[...xsS].reverse().map((x) => [x, screenTopZ(x)]),
  ];
  const { plate, holes, kites } = trussSection({
    x0: -ARCH.half + PANEL,
    x1: ARCH.half - PANEL,
    panels: ARCH.panels - 2,
    top: tubeTop,
    tc: TUBE,
    bottom: 0,
    floor: screenFloor,
    verticals: false,
    wd: 1.45,
    wv: 0,
    endW: 1.45,
    kites: true,
    outline,
  });
  // In het eigen vlak (x, z) met de dikte langs y opgebouwd en daarna
  // gebogen: op het dek op de buitenrand, bovenaan onder de as van de buis.
  const screen = extrudeY(plate, 0, SCREEN.T)
    .refineToLength(1.0)
    .warp((v) => {
      const x = v[0];
      const zd = snelTop(x);
      const zt = screenTopZ(x);
      const yo = snelEdges(x).outer;
      const f = clamp((v[2] - zd) / (zt - zd), 0, 1);
      v[1] = yo + (tubeY(x) - SCREEN.T / 2 - yo) * f + v[1];
    });
  if (screen.status() !== "NoError") throw new Error(`hangerscherm: ${screen.status()}`);
  parts.push(screen);
  stats.snelbinder = { screenHoles: holes, screenKites: kites, crossBeams: ARCH.panels - 1 };
  return { solid: union(parts), tube, screenTopZ, tubeStations };
}
const snel = snelbinder();

// ---------- pijlers en landhoofden ----------
// Elke pijler reikt onder het spoordek tot de onderkant van het dek erboven
// en onder de Snelbinder (y < -5,3) tot de onderkant van de Snelbinder.
const railBottomAt = (x) => {
  const bottoms = [];
  if (x <= ARCH.half + 0.6) bottoms.push(archBottom(x));
  if (x >= ARCH.half - 0.6) bottoms.push(approachBottom(x));
  return Math.max(...bottoms);
};
function piers() {
  const parts = [];
  const split = RAIL.deck[0];
  const block = (shape, x0, x1, y0, y1, z0, z1) =>
    shape === "round" ? roundPier(x0, x1, y0, y1, z0, z1) : boxFromTo(x0, x1, y0, y1, z0, z1);
  const twoLevel = (shape, x0, x1, y0, y1, z0) => {
    const xc = (x0 + x1) / 2;
    const zr = Math.max(railBottomAt(x0), railBottomAt(x1), railBottomAt(xc)) + 0.05;
    const full = block(shape, x0, x1, y0, y1, z0, zr);
    if (y0 >= split) return full;
    // Onder de Snelbinder tot de onderkant van zijn dek.
    const zs = Math.max(snelBottom(x0), snelBottom(x1)) + 0.05;
    const under = block(shape, x0, x1, y0, y1, z0, Math.max(zs, zr)).intersect(boxFromTo(x0 - 5, x1 + 5, y0 - 5, split, z0 - 1, zs + 1));
    return union([full, under]);
  };
  for (const p of PIERS) parts.push(twoLevel("round", p.x0, p.x1, p.y0, p.y1, BASE));
  for (const s of SLOVEN) {
    parts.push(roundPier(s.x0, s.x1, s.y0, s.y1, BASE, Z(SLOOF_TOP_NAP)));
    const xc = (s.x0 + s.x1) / 2;
    parts.push(twoLevel("box", xc - SLOOF_PIER.w / 2, xc + SLOOF_PIER.w / 2, SLOOF_PIER.y0, SLOOF_PIER.y1, Z(SLOOF_TOP_NAP) - 0.1));
  }
  for (const a of ABUTMENTS) parts.push(twoLevel("box", a.x0, a.x1, a.y0, a.y1, BASE));
  return union(parts);
}
const pierSolid = piers();

// ---------- printvoet (alleen in de STL) ----------
// De dekken hangen tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder per dek een wig van 50 graden die uitloopt in
// een scherm van 0,8 mm (op printschaal) tot de onderplaat.
const KNEE = (50 * Math.PI) / 180;
const SCREEN_W = Math.max(0.45, 0.4 / mmPerMetre);
function foot(x0, x1, under, y0f, y1f) {
  const n = Math.max(2, Math.round((x1 - x0) / 1));
  const stations = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const zb = under(x) + 0.02;
    const y0 = y0f(x);
    const y1 = y1f(x);
    const yc = (y0 + y1) / 2;
    const w = (y1 - y0) / 2 + 0.02;
    const zs = zb - Math.tan(KNEE) * (w - SCREEN_W);
    const section =
      w > SCREEN_W && zs > BASE + 0.05
        ? [[-SCREEN_W, BASE], [SCREEN_W, BASE], [SCREEN_W, zs], [w, zb], [-w, zb], [-SCREEN_W, zs]]
        : [[-Math.min(w, SCREEN_W), BASE], [Math.min(w, SCREEN_W), BASE], [Math.min(w, SCREEN_W) + 1e-3, zb - 1e-3], [w, zb], [-w, zb], [-Math.min(w, SCREEN_W) - 1e-3, zb - 1e-3]];
    stations.push({ x, section: section.map(([y, z]) => [y + yc, z]) });
  }
  return loftX(stations);
}
const feet = [];
{
  const supports = [
    ...PIERS.map((p) => [p.x0, p.x1]),
    ...SLOVEN.map((s) => [(s.x0 + s.x1) / 2 - SLOOF_PIER.w / 2, (s.x0 + s.x1) / 2 + SLOOF_PIER.w / 2]),
    ...ABUTMENTS.map((a) => [a.x0, a.x1]),
  ].sort((a, b) => a[0] - b[0]);
  const c = (v) => () => v;
  // Spoordek: van het zuidelijke landhoofd tot de kadepijler, de boog, de
  // aanbrugoverspanningen.
  feet.push(foot(RAIL.start, supports[0][0], archBottom, c(RAIL.deck[0]), c(RAIL.deck[1])));
  feet.push(foot(supports[0][1], supports[1][0], archBottom, c(PLANES[0][0]), c(PLANES[1][1])));
  for (let i = 1; i + 1 < supports.length; i++) {
    feet.push(foot(supports[i][1], supports[i + 1][0], approachBottom, c(RAIL.deck[0]), c(RAIL.deck[1])));
  }
  // Snelbinder: over de hele lengte onder het dek.
  feet.push(foot(SNEL.start, SNEL.end, snelBottom, (x) => snelEdges(x).outer, (x) => snelEdges(x).inner));
}
const printFoot = union(feet);
// De STL bevat de brug als geheel (constructie en wegdelen samen). Het
// printmodel wordt samengesteld vóór de wegdeklaag eruit wordt gesneden.
const wholeParts = [rail, snel.solid, pierSolid];
const printModel = union([...wholeParts, printFoot]);
printModel.numTri(); // nu doorrekenen, los van de wegdeklaag

// ---------- spoor, fietspad en voetpad als eigen onderdelen ----------
// De bovenste 0,5 m van elk dek is een eigen node met de attributen van het
// BGT-wegdeel erop (glTF `extras.attributes`). Snijstrook van 0,5 m onder tot
// 1 m boven het dek, over dezelfde stations als het dek. Het spoor krijgt het
// hele spoordek tussen de vakwerkwanden (de BGT tekent over de boog alleen de
// twee sporen, met een gat ertussen); fietspad en voetpad volgen hun
// BGT-vlakken. De vakwerkwanden, de buisboog en het hangerscherm blijven met
// 2 cm vrij constructie.
const LAYER = 0.5;
const ABOVE = 1.0;
const E = 0.1;
const extend = (xs) => [xs[0] - E, ...xs, xs[xs.length - 1] + E];
const railStrip = bandLoft(extend(railStations), () => -5.8, () => 5.8, (x) => railTop(clamp(x, RAIL.start, RAIL.end)) - LAYER, (x) => railTop(clamp(x, RAIL.start, RAIL.end)) + ABOVE);
const wallGuards = union(
  PLANES.map(([y0, y1]) => boxFromTo(-ARCH.half - 0.02, ARCH.half + 0.02, y0 - 0.02, y1 + 0.02, Z(24.0) - 2, Z(25.0) + 2)),
);
const railCut = railStrip.subtract(wallGuards);
// Snelbinder: fietspad tussen de grens met het voetpad en de binnenrand,
// voetpad tussen de buitenrand en die grens. Voorbij het voetpad (bij de
// dijk) loopt het fietspad tot de buitenrand.
const snelX = extend(snelStations);
const sTop = (x) => snelTop(clamp(x, SNEL.start, SNEL.end));
const bikeLow = (x) => {
  const e = snelEdges(x);
  if (x < SNEL.footEnd) return e.boundary;
  return e.outer - E * clamp(x - SNEL.footEnd, 0, 1);
};
const bikeStrip = bandLoft(snelX, bikeLow, (x) => snelEdges(x).inner + E, (x) => sTop(x) - LAYER, (x) => sTop(x) + ABOVE);
const footX = [SNEL.start - E, ...within(snelStations, SNEL.start, SNEL.footEnd)];
const footStrip = bandLoft(footX, (x) => snelEdges(x).outer - E, (x) => snelEdges(x).boundary, (x) => sTop(x) - LAYER, (x) => sTop(x) + ABOVE);
// Hangerscherm: een verticaal blok van 1 m buiten het dek tot 2 cm voorbij de
// binnenkant van het scherm op de bovenkant van de strook.
const screenSlope = (x) => {
  const xc = clamp(x, -SCREEN.half, SCREEN.half);
  const yo = snelEdges(xc).outer;
  return (tubeY(xc) - SCREEN.T / 2 - yo) / (snel.screenTopZ(xc) - snelTop(xc));
};
const screenGuard = bandLoft(
  range(-SCREEN.half - 0.3, SCREEN.half + 0.3, 0.5),
  (x) => snelEdges(x).outer - 1,
  (x) =>
    snelEdges(x).outer + SCREEN.T + Math.max(screenSlope(x - 0.5), screenSlope(x), screenSlope(x + 0.5)) * ABOVE + 0.05,
  (x) => snelTop(x) - 2,
  (x) => snelTop(x) + 2,
);
// Buisboog: waar hij in de strook zakt (bij de opleggingen), zijn doorsnede
// 2 cm groter en naar beneden doorgetrokken.
const tubeGuardX = (sign) => {
  const xs = snel.tubeStations.filter((x) => tubeTop(x) - TUBE < snelTop(x) + ABOVE + 0.5 && Math.sign(x) === sign);
  const lo = Math.min(...xs) - 1;
  const hi = Math.max(...xs) + 1;
  return range(clamp(lo, -ARCH.half - 0.32, ARCH.half + 0.32), clamp(hi, -ARCH.half - 0.32, ARCH.half + 0.32), 0.5);
};
const tubeGuard = union(
  [-1, 1].map((sign) =>
    bandLoft(
      tubeGuardX(sign),
      (x) => tubeY(clamp(x, -ARCH.half + 0.3, ARCH.half - 0.3)) - TUBE / 2 - 0.02,
      (x) => tubeY(clamp(x, -ARCH.half + 0.3, ARCH.half - 0.3)) + TUBE / 2 + 0.02,
      (x) => snelTop(x) - 2,
      (x) => tubeTop(clamp(x, -ARCH.half + 0.3, ARCH.half - 0.3)) + 0.02,
    ),
  ),
);
const snelGuards = union([screenGuard, tubeGuard]);
const bikeCut = bikeStrip.subtract(snelGuards);
const footCut = footStrip.subtract(snelGuards);
const allCuts = union([railCut, bikeCut, footCut]);
const railway = railCut.intersect(rail);
const bikeway = bikeCut.intersect(snel.solid);
const footway = footCut.intersect(snel.solid);

const parts = [
  ["building:spoorbrug", rail.subtract(allCuts)],
  ["building:snelbinder", snel.solid.subtract(allCuts)],
  ["building:pijlers", pierSolid.subtract(allCuts)],
  ["road:spoor", railway, RAIL_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
  ["road:voetpad", footway, FOOT_ATTRIBUTES],
];
// Controle: per onderdeel tellen constructie en wegdeel op tot het geheel.
const partition = {};
{
  const vol = (name) => parts.find(([n]) => n === name)[1].volume();
  for (const [name, whole, layers] of [
    ["spoorbrug", rail, [railway]],
    ["snelbinder", snel.solid, [bikeway, footway]],
    ["pijlers", pierSolid, []],
  ]) {
    const sum = vol(`building:${name}`) + layers.reduce((s, l) => s + l.volume(), 0);
    const diff = sum - whole.volume();
    partition[name] = { wholeM3: +whole.volume().toFixed(2), partsM3: +sum.toFixed(2), diffM3: +diff.toFixed(4) };
    if (Math.abs(diff) > 0.02) throw new Error(`${name}: onderdelen ${sum} m³, geheel ${whole.volume()} m³`);
  }
  // De stroken raken geen ander onderdeel: spoor alleen de spoorbrug, fiets-
  // en voetpad alleen de Snelbinder, de pijlers niets.
  const touch = (a, b) => a.intersect(b).volume();
  partition.cross = {
    railCutSnel: +touch(railCut, snel.solid).toFixed(4),
    snelCutsRail: +touch(union([bikeCut, footCut]), rail).toFixed(4),
    cutsPiers: +touch(allCuts, pierSolid).toFixed(4),
  };
  for (const [k, v] of Object.entries(partition.cross)) if (v > 0.001) throw new Error(`strook raakt ander onderdeel: ${k} ${v}`);
  const whole = union([rail, snel.solid, pierSolid]).volume();
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  partition.model = { wholeM3: +whole.toFixed(2), partsM3: +sum.toFixed(2) };
}

// ---------- controles ----------
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
for (const [name, solid] of [...parts, ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}
{
  const bb = printModel.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`print: onderkant op ${bb.min[2]}`);
  const pb = pierSolid.boundingBox();
  if (Math.abs(pb.min[2] - BASE) > 1e-6) throw new Error(`pijlers: onderkant op ${pb.min[2]}`);
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
const report = { stats, partition };
for (const [name, solid, attributes] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    ...(attributes ? { attributes } : {}),
    status: solid.status(),
    genus: solid.genus(),
    components: solid.decompose().length,
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRangeNap: [+(bb.min[2] + WATER_NAP).toFixed(2), +(bb.max[2] + WATER_NAP).toFixed(2)],
    overhangM2: Math.round(overhangArea(solid)),
  };
}
const glbFile = path.join(outDir, "spoorbrug-nijmegen.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-spoorbrug-nijmegen.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `spoorbrug-nijmegen-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Spoorbrug Nijmegen 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
{
  const bb = printSolid.boundingBox();
  report.stl = {
    file: path.join(outDir, stlName),
    status: printSolid.status(),
    genus: printSolid.genus(),
    triangles,
    overhangM2: Math.round(overhangArea(printModel)),
    volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
    sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
  };
}

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Op het water naast de brug: de Waal naast de boog (20 m west van het
// spoordek en 16 m oost van de Snelbinder), de Waal tussen de pijlers in de
// noordelijke stroom en de Spiegelwaal tussen de poeren.
const samplePoints = [
  ...[-60, 0, 60].flatMap((x) => [[x, 26], [x, -35]]),
  [190, 20], [190, -30],
  [412, 20], [412, -30], [470, 20], [470, -30],
];
const all = union(wholeParts).boundingBox();
await writeFile(
  path.join(outDir, "spoorbrug-nijmegen.json"),
  JSON.stringify(
    {
      name: "Spoorbrug Nijmegen",
      file: "spoorbrug-nijmegen.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [187336.55, 429364.15],
      xAxis: [0.29279, 0.95618],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong midden tussen de twee opleggingen van de boog op de as tussen de sporen, op de waterspiegel van de Spiegelwaal (z = 0, NAP +7,1 m), +X langs de brug naar Lent (RD-richting 72,98 graden vanaf het oosten) en +Y naar het westen (stroomafwaarts). De node spoorbrug heeft het boogvakwerk van 235,5 m tussen de opleggingen (x = ±117,75): twee verticale wanden van 1,6 m op y = ±5 tot ±6,6 met een veelhoekige bovenrand tot NAP +49,7 m, twintig velden van 11,8 m met verticalen (dichte wanden met doorgaande driehoekige openingen met de punt omhoog en blinde nissen), de vloer met het spoor op NAP +24,86 m in het midden, de korte vloer op de kade en de aanbruggen (2,6 m) tot het landhoofd op de dijk bij Lent (x = 582,25). De node snelbinder heeft het dek van de fietsbrug aan de oostkant (y = -6,3 tot -18,6) over de hele lengte, over de boog naar buiten gebogen met dwarsliggers naar het vakwerk, de witte buisboog (1 m, tot NAP +49,2 m, 3,5 m buiten het oostelijke vakwerk) en een hangerscherm van de buisboog naar de buitenrand van het dek met driehoekige openingen. De node pijlers heeft de oplegpijler op de kade, de rivierpijler, vier pijlers in de Waal en op het eiland Veur-Lent, drie poeren met pijlers in de Spiegelwaal en twee landhoofden. Drie road-nodes zijn de bovenste 0,5 m van de dekken met de attributen van het BGT-wegdeel in extras.attributes: road:spoor (het hele spoordek, over de boog tussen de wanden; spoorbaan, gesloten verharding), road:fietspad (fietspad, gesloten verharding, asfalt) en road:voetpad (de buitenste strook van de Snelbinder; voetpad, open verharding, tegels); de vakwerkwanden, de buisboog en het hangerscherm blijven met 2 cm vrij constructie. Windverbanden en eindportalen tussen de vakwerkwanden, bovenleiding, leuningen, de trappen naar de kade, het eiland en de dijk en de bruggenhoofdtorens (eigen BAG-panden) zijn weggelaten; de export vult onder de dekken een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd. Geen BAG-pand onder de brug. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(all.max[0] - all.min[0]).toFixed(1),
        widthM: +(all.max[1] - all.min[1]).toFixed(1),
        archSpanBearingsM: 2 * ARCH.half,
        panels: ARCH.panels,
        archCrownNapM: ARCH_CROWN_NAP,
        snelbinderTubeCrownNapM: TUBE_TOP_NAP(0),
        railNapM: { kade: RAIL_TOP_NAP(RAIL.start), boog: RAIL_TOP_NAP(0), dijk: RAIL_TOP_NAP(RAIL.end) },
        snelbinderNapM: { boog: SNEL_TOP_NAP(0), dijk: SNEL_TOP_NAP(SNEL.end) },
        navigationClearanceNapM: 22.8,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Spoorbrug_Nijmegen",
        "PDOK BGT overbruggingsdeel (dekken, pijlers, poeren, landhoofden), spoor en wegdeel, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de dekken, het boogvakwerk, de buisboog en het maaiveld",
        "PDOK Luchtfoto RGB (Actueel_orthoHR) voor de plattegrond",
        "Wikimedia Commons: Nijmegen railway bridge. River Waal. in the back the Oversteek bridge Seen from the Stevenskerk.jpg, Railwaybridge with bikeway, Nijmegen, The Netherlands.jpg, Railway bridge nijmegen.JPG, Snelbinder bridge.jpg, Spoorbrug Nijmegen Snelbinder onderzijde.jpg, Spiegelwaal 18 met deel spoorbrug en brug Lent - Stadseiland erachter.JPG, Nijmegen aan de Waal in 2019 09.jpg, Spoorbrug Nijmegen 001.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van het Muiderslot in
// Muiden: de vierkante waterburcht aan de monding van de Vecht met vier ronde
// hoektorens, de westvleugel, de noordvleugel en de smalle oostvleugel rond de
// open binnenplaats, het poortgebouw aan de oostkant en de gekanteelde
// weermuren aan de zuid- en oostkant, plus de brug van het poortgebouw naar de
// oever. De slotgracht zit in het PDOK-terrein en niet in het model. Alle
// maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, één node per onderdeel met de materiaalklasse in de nodenaam)
// als catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-muiderslot.mjs              # 1:1000 (standaard)
//   node scripts/generate-muiderslot.mjs --scale 2000
//
// Dakvormen (AHN-DSM per 0,5 m in het stelsel van elke vleugel en foto's van
// alle kanten):
// - West- en noordvleugel hebben een geknikt zadeldak: een steil bovendak
//   (55 en 58 graden) en een flauwere dakvoet (39 en 27 graden). De
//   westvleugel eindigt aan de zuidkant in een trapgevel, heeft halverwege een
//   trapgevel als brandmuur met de schoorsteen erop en een schild aan de
//   noordkant tegen de noordwesttoren.
// - De oostvleugel heeft een zadeldak van 45 graden, het poortgebouw een
//   tentdak met een korte nok en twee dakkapellen aan de voorkant, en in de
//   hoek van de noord- en oostvleugel staat een vierkant traptorentje met een
//   tentdak.
// - De noordwest-, zuidwest- en zuidoosttoren hebben een borstwering op een
//   rondboogfries (hier een schuine kraag van 51 graden) met vensters als
//   nissen en een geknikte kegelspits: een flauwe dakvoet en daarboven een
//   steile spits. Naast de zuidwesttoren staat een traptorentje met een eigen
//   spits. De noordoosttoren heeft kantelen met een kegeldak erbinnen.
// - Dakkapellen en schoorstenen (0,9 m of breder) waar het DSM pieken toont
//   en de foto's ze laten zien.
// Gevels: een plint rondom, een kroonlijst op een schuine kraag aan de
// buitengevels van de vleugels, schoorsteenlisenen, vensters en schietgaten
// als nissen van 0,35 m, de poortpartij met de vooruitspringende voorgevel van
// het poortgebouw, de spitse doorgang in een rechthoekige sponning, de hoge
// sleuf van de ophaalbrug, drie spitse nissen onder de borstwering en een
// borstwering op een schuine kraag. De weermuren hebben een weergang met
// kantelen van 1,6 m breed en 1 m hoog (tussenruimte minstens 0,9 m) op een
// uitkragende borstwering met een schuine kraag. De vaste delen van de brug
// hebben aan beide zijden een borstwering van 0,9 m breed.
//
// Printbaar op 1:1000 zonder steun: alle bouwdelen zijn minstens 0,9 m breed,
// muren en vleugels staan recht op, dakvlakken lopen schuin omhoog, de
// uitkragende borstweringen en kroonlijsten rusten op een kraag van 52
// graden en de doorgang en de spitse nissen hebben een top van 55 tot 60
// graden. Alleen de vensternissen, schietgaten en sponningen hebben een
// vlakke bovenkant van 0,35 m diep; de controle onderaan staat geen andere
// ondervlakken toe. Alle onderdelen beginnen op dezelfde onderkant.
//
// Assenstelsel: oorsprong op RD (133468, 482984), midden in het slot, op
// het maaiveld van de oever (NAP +1,3 m), Z omhoog, +X naar het oosten en +Y
// naar het noorden (de RD-assen). Het slot staat circa 23 graden gedraaid:
// de zuidmuur loopt van de zuidwesttoren naar het oost-zuidoosten, het
// poortgebouw met de brug ligt aan de oostkant.
//
// Bronnen: BAG-pand 0424100000004154 (contour); BGT overbruggingsdeel (de
// brug, drie delen); AHN DSM/DTM 0,5 m (PDOK WCS, als raster per 0,5 m in het
// stelsel van elke vleugel bekeken): de dakprofielen met de knik, de nokken,
// de trapgevels, het schild, de schoorstenen en dakkapellen, de weermuren en
// kantelen, de torens per straal, het poortgebouw, de binnenplaats en het
// maaiveld; Wikipedia en het Rijksmonumentenregister (30107); foto's op
// Wikimedia Commons van alle kanten (20141028 vanuit het westen en het
// zuidoosten, 09-05-2022 (actm.) 01 tot 07, Muiderslot castle 2018 1 en 3,
// RCE 20287199 voorgevel, Muiderslot vanuit de polder, Muiderslot 2015):
// dakvormen, trapgevels, kantelen, poortpartij, torenspitsen, vensters;
// PDOK luchtfoto 8 cm.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "muiderslot");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 1,3 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [133468, 482984];
const X_AXIS = [1, 0];
const GROUND_NAP = 1.3;
const NAP = (h) => h - GROUND_NAP;
// Alle onderdelen beginnen op NAP -1,5 m, onder het water van de slotgracht
// (circa NAP -0,4 m), zodat de muren uit het water rijzen.
const BASE = NAP(-1.5);
// BAG-contour van het slot met de vier ronde torens en het poortgebouw
// (lokaal, op 0,01 m).
const OUTLINE = [
  [3.04, 16.0], [-7.0, 20.42], [-7.67, 22.14], [-8.53, 23.19], [-9.8, 23.92], [-11.01, 23.92], [-12.15, 23.57],
  [-13.2, 22.84], [-14.1, 21.22], [-14.13, 19.85], [-13.55, 18.13], [-12.51, 17.18], [-11.28, 16.66],
  [-11.56, 16.0], [-19.46, -2.23], [-21.04, -2.62], [-20.87, -3.38], [-21.94, -4.02], [-22.76, -4.95],
  [-23.23, -6.1], [-23.33, -7.34], [-23.03, -8.54], [-22.37, -9.59], [-21.41, -10.38], [-20.25, -10.82],
  [-19.01, -10.88], [-17.81, -10.55], [-15.67, -11.34], [6.98, -19.77], [6.92, -20.33], [7.1, -21.44],
  [7.61, -22.45], [8.41, -23.24], [9.42, -23.76], [10.53, -23.93], [11.64, -23.76], [12.65, -23.24],
  [13.45, -22.45], [13.96, -21.44], [14.14, -20.33], [13.77, -18.73], [12.73, -17.47], [15.52, -9.82],
  [19.26, -11.16], [20.12, -8.93], [20.98, -6.7], [21.75, -4.69], [17.9, -3.21], [20.48, 3.84],
  [21.67, 4.02], [22.74, 4.56], [23.59, 5.41], [24.13, 6.48], [24.32, 7.66], [24.14, 8.85], [23.59, 9.91],
  [22.74, 10.76], [21.68, 11.31], [20.49, 11.49], [19.31, 11.31], [18.24, 10.76], [17.39, 9.91],
];
// Plint rondom: 0,3 m uitspringend tot NAP +0,7 m en 0,15 m tot +0,95 m
// (een getrapte schuine bovenkant, ruim boven het water van de gracht).
const PLINTH = [[0.3, 0.7], [0.15, 0.95]];
// Open binnenplaats, contour uit het DSM: de binnengevels van de west-, noord-
// en oostvleugel, het poortgebouw en de weermuren, met de hoek tussen de
// trapgevel, de zuidmuur en de zuidwesttoren (DSM NAP +1,7 m tot 3,7 m van
// het hart van de toren; de toren is aan die kant afgeplat). Het AHN geeft NAP +1,65 m,
// maar het gladdere PDOK-terrein ligt binnen de muren tot 0,4 m hoger; de
// vloer van de binnenplaats en de poortdoorgang ligt daarom op NAP +2,1 m,
// zodat het terrein er niet doorheen steekt.
const COURT = [
  [-15.6, -8.15], [5.0, -16.4], [7.5, -16.0], [11.5, -12.5], [12.5, -6.0], [13.5, -2.0], [14.5, 0.5],
  [14.3, 3.0], [8.0, 6.3], [2.0, 8.3], [-4.6, 8.8], [-10.4, -6.4], [-13.6, -5.35], [-15.6, -5.6],
];
const COURT_FLOOR = 2.1;
// Weermuren (AHN-DSM NAP +8 m over de hele muurdikte, +9 m in de kantelen
// aan de buitenrand): de weergang op NAP +7,9 m, kantelen van 1,6 m breed,
// 0,9 m diep en 1 m hoog met tussenruimtes van minstens 0,9 m (foto's: brede
// kantelen met smalle tussenruimtes, hier iets grover), op een borstwering die
// 0,3 m uitkraagt van NAP +6,7 m tot de weergang, met een schuine kraag
// eronder. Schietgaten als nissen van 0,9 bij 1,4 m.
const WALK = 7.9;
const MERLON = { w: 1.6, gap: 0.9, depth: 0.9, h: 1.0 };
const LEDGE = 0.3;
const PARAPET_FOOT = 6.7;
const CURTAINS = [
  // Zuidmuur van de zuidwest- naar de zuidoosttoren.
  { name: "zuidmuur", a: [-15.67, -11.34], b: [6.98, -19.77], loops: [3.5, 7.5, 11.5, 15.5, 19.5] },
  // Oostmuur van de zuidoosttoren naar het poortgebouw.
  { name: "oostmuur", a: [12.73, -17.47], b: [15.52, -9.82], loops: [3.6] },
];
const LOOP = { w: 0.9, z0: 3.5, z1: 4.9 };
const NICHE_DEPTH = 0.35;

// Lokale stelsels langs de vleugels: oorsprong c, as a (s) en b = a 90 graden
// linksom (t).
const frame = (c, a) => {
  const l = Math.hypot(...a);
  const ax = [a[0] / l, a[1] / l];
  const bx = [-ax[1], ax[0]];
  return {
    ax,
    bx,
    p: (s, t) => [c[0] + ax[0] * s + bx[0] * t, c[1] + ax[1] * s + bx[1] * t],
  };
};
// Westvleugel: s langs de vleugel naar het noorden, t naar buiten (westen).
const WW = frame([-11.2, 5.0], [0.392, 0.92]);
// Noordvleugel: s langs de vleugel naar het oosten, t naar buiten (noorden).
const NW = frame([5.5, 10.8], [0.921, -0.391]);
// Poortgebouw: s naar buiten langs de brug (oosten), t naar het noorden.
const GT = frame([16.7, -6.4], [0.932, -0.363]);

// Geknikte zadeldaken (AHN-DSM, mediaan per 0,5 m dwars op de nok over
// stroken van 6 tot 8 m):
// - Westvleugel: nok NAP +22 m op t = -0,1, steil bovendak (helling 1,44,
//   55 graden) tot de knik op 2,7 m van de nok (+18,1 m), daaronder 0,8
//   (39 graden) tot de goten (+16,4 m aan de buitengevel). Muren op
//   t = 4,7 (BAG) en -5,2 (binnenplaats); het dak eindigt in het zuiden
//   op de trapgevel (s = -10,4) en loopt in het noorden met een schild van
//   s = 11 tot de noordgevel (s = 15,8).
// - Noordvleugel: nok NAP +15,4 m op t = 0,25, bovendak 1,6 (58 graden) tot
//   1,3 m van de nok (+13,3 m), dakvoet 0,5 (27 graden) tot de goot op
//   +12,2 m aan de noordgevel (t = 3,83). Loopt van de westvleugel tot de
//   noordoosttoren.
const KINKED = [
  {
    name: "westvleugel",
    F: WW,
    s: [-10.4, 16.0],
    t: [-5.25, 4.85],
    wallT: 4.7,
    ridgeT: -0.1,
    ridgeS: [-30, 11.0],
    hip: [false, true],
    top: 22.0,
    steep: 1.44,
    knee: 2.7,
    shallow: 0.8,
    exclude: [],
  },
  {
    name: "noordvleugel",
    F: NW,
    s: [-14.0, 16.0],
    t: [-4.2, 3.95],
    wallT: 3.83,
    ridgeT: 0.25,
    ridgeS: [-30, 30],
    hip: [false, false],
    top: 15.4,
    steep: 1.6,
    knee: 1.3,
    shallow: 0.5,
    exclude: ["noordwest", "noordoost"],
  },
];
// Trapgevels van de westvleugel (foto's vanuit het westen en het zuidoosten,
// AHN-DSM: de gevels steken tot 0,9 m boven het dakvlak uit): de zuidgevel
// en de brandmuur halverwege, 0,9 m dik, vijf treden van 1 m breed per kant
// die 0,45 m boven het dak aan hun binnenkant uitkomen, en bovenop een
// pinakel (zuidgevel, DSM +23,7 m) of de schoorsteen (brandmuur, DSM
// +23,8 m) van 1,2 m breed.
const STEP_GABLES = [
  { name: "zuidgevel", s: [-10.4, -9.5], top: 23.9 },
  { name: "brandmuur", s: [-3.25, -2.35], top: 24.0 },
];
const STEP = { count: 4, above: 0.45, crown: 0.6 };
// Oostvleugel: zadeldak van 45 graden met de nok op NAP +12,8 m (AHN 12,6
// tot 12,7 m), goot +10,8 m aan de buitengevel.
const EAST_WING = { ridge: [[16.2, -2.0], [19.6, 8.0]], top: 12.8, slope: 1.0, halfWidth: 4.0 };
// Traptorentje in de hoek van de noord- en oostvleugel (AHN-DSM: een
// vierkant van circa 3 m met een tentdak tot +18,3 m; luchtfoto).
const STAIR_TOWER = { c: [15.7, 4.1], size: 3.0, eave: 15.8, tip: 18.6 };
// Poortgebouw (BAG-voorgevel s = 4,1, 3,9 m voor de weermuur; AHN-DSM:
// achtergevel s = -3,9, zijgevels t = -3,55 en 3,45): borstwering op een
// schuine kraag van NAP +12,4 tot +12,8 m en 0,3 m uitkragend tot de goot op
// +14,8 m, tentdak met een korte nok op +19,2 m (DSM 18,3 tot 19,2 m) en
// twee dakkapellen aan de voorkant (foto RCE). Poortpartij in de voorgevel
// (foto RCE 20287199): de spitse doorgang van 2,6 m breed (aanzet +4,4 m,
// top 60 graden) in een rechthoekige sponning van 2,9 m breed tot +7,4 m,
// de hoge sleuf van de ophaalbrug (0,9 m) aan de zuidkant, een venster boven
// de poort en drie spitse nissen onder de borstwering.
const GATE = {
  s: [-3.9, 4.1],
  t: [-3.55, 3.45],
  corbel: 12.8,
  eave: 14.8,
  ridge: 19.2,
  ridgeT: [-0.45, 0.35],
  ridgeS: 0.1,
  passage: { w: 2.6, floor: COURT_FLOOR, spring: 4.4 },
  frame: { w: 2.9, z0: 1.6, z1: 7.4 },
  slot: { t: -2.5, w: 0.9, z0: 2.0, z1: 11.0 },
  window: { t: 0, w: 1.0, z0: 8.4, z1: 9.8 },
  arcade: { t: [-2.0, 0, 2.0], w: 1.6, z0: 10.2, spring: 11.25 },
};
// Ronde hoektorens (BAG-cirkels, AHN-DSM per straal, foto's): romp tot de
// kraag, borstwering 0,35 m uitkragend tot de goot met vensternissen, en een
// geknikte kegelspits (dakvoet tot 62 % van de straal, 32 graden; daarboven
// de spits). De noordoosttoren heeft kantelen (foto RCE; DSM +14,2 m aan de
// rand, +13,5 m binnen de kantelen) en een rechte kegel. Spitsen boven het
// hoogste AHN-punt naar de foto's.
const TOWERS = [
  { name: "noordwest", c: [-10.64, 20.29], r: 3.61, corbel: 14.0, eave: 16.0, tip: 23.0 },
  { name: "zuidwest", c: [-19.45, -7.01], r: 3.9, corbel: 19.0, eave: 21.0, tip: 27.8 },
  { name: "zuidoost", c: [10.53, -20.33], r: 3.61, corbel: 14.5, eave: 16.5, tip: 24.5 },
  { name: "noordoost", c: [20.49, 7.67], r: 3.83, corbel: 12.5, eave: 13.5, tip: 20.8, crenellated: true },
];
const CORBEL = 0.35;
// Traptorentje aan de zuidoostkant van de zuidwesttoren (foto's: tweede,
// iets lagere spits; DSM +24 m op 3,1 m van het hart).
const SW_TURRET = { tower: "zuidwest", azimuth: -45, dist: 3.2, r: 1.25, eave: 21.6, tip: 25.6 };
// Vensters in de torens: rijen [onderkant, bovenkant] en richtingen ten
// opzichte van de richting naar buiten; borstweringsvensters (de luiken
// met de zigzagband) als nissen van 0,9 bij 0,8 m.
const TOWER_ROWS = {
  noordwest: [[4.0, 5.8], [8.5, 10.3]],
  zuidwest: [[4.0, 5.8], [9.0, 10.8], [13.5, 15.3]],
  zuidoost: [[4.0, 5.8], [9.0, 10.8]],
  noordoost: [[4.0, 5.8], [8.0, 9.8]],
};
const TOWER_DIRS = [-50, 0, 50];
const PARAPET_DIRS = [-60, -30, 0, 30, 60];
// Gevels (BAG-randen) met vensternissen [onderkant, bovenkant, breedte] op
// posities s in het stelsel van de vleugel (foto's van alle kanten,
// geschaald op de goten en de BAG-gevellengtes), en de kroonlijst: een band
// van 0,9 m hoog die 0,3 m uitkraagt tot de goot.
const FACADES = [
  {
    name: "westgevel",
    a: [-19.46, -2.23],
    b: [-11.56, 16.0],
    F: WW,
    cornice: true,
    windows: [
      { s: [8.0, 5.3, 2.4, -0.4, -6.4], z: [5.0, 7.4], w: 1.0 },
      { s: [8.0, 2.4, -6.4], z: [10.8, 12.6], w: 1.0 },
      { s: [5.3, -0.4], z: [11.3, 12.4], w: 0.9 },
    ],
    // Schoorsteenlisene onder de brandmuur.
    lisenes: [{ s: -2.8, w: 1.6 }],
  },
  {
    name: "noordgevel",
    a: [17.39, 9.91],
    b: [-7.0, 20.42],
    F: NW,
    cornice: true,
    windows: [
      { s: [-6.5, -3.0, 4.6, 8.0], z: [4.5, 6.5], w: 1.0 },
      { s: [-6.5, -3.0, 4.6, 8.0], z: [8.3, 10.0], w: 1.0 },
    ],
    lisenes: [{ s: 1.6, w: 1.6 }],
  },
  {
    name: "oostgevel",
    a: [17.9, -3.21],
    b: [20.48, 3.84],
    F: GT,
    cornice: true,
    windows: [
      { s: [5.6, 8.6], z: [4.5, 6.3], w: 1.0, alongT: true },
      { s: [5.6, 8.6], z: [7.6, 9.2], w: 1.0, alongT: true },
    ],
    lisenes: [],
  },
];
// Dakkapellen (foto's, luchtfoto en DSM-pieken): stelsel, positie s, vlak van
// de voorkant t, richting naar buiten (+1/-1 langs t), breedte, onderkant,
// bovenkant van de wangen, nok en diepte.
const DORMERS = [
  ...[6.9, 1.5, -7.2].map((s) => ({ F: WW, s, t: 3.6, n: 1, w: 1.2, low: 16.9, wall: 18.4, ridge: 19.0, depth: 2.2 })),
  ...[-5.5, 6.0].map((s) => ({ F: WW, s, t: -4.3, n: -1, w: 1.2, low: 16.5, wall: 17.6, ridge: 18.2, depth: 2.0 })),
  ...[-3.1, 3.5, 9.5].map((s) => ({ F: NW, s, t: 3.15, n: 1, w: 1.2, low: 12.15, wall: 13.4, ridge: 14.0, depth: 2.2 })),
  ...[-1.0, 6.0].map((s) => ({ F: NW, s, t: -2.65, n: -1, w: 1.2, low: 12.15, wall: 13.4, ridge: 14.0, depth: 2.2 })),
  // Poortgebouw: twee op het voorste dakvlak.
  ...[-1.5, 1.5].map((t) => ({ F: GT, s: 3.0, t, alongS: true, n: 1, w: 1.0, low: 15.9, wall: 16.9, ridge: 17.5, depth: 1.6 })),
];
// Schoorstenen: midden (lokaal), maat langs de noordvleugel en dwars erop,
// bovenkant (NAP). Plaats en hoogte uit pieken in het AHN-DSM (1,4 tot
// 3,6 m boven het omliggende dak), bevestigd op de foto's.
const CHIMNEYS = [
  { c: [-6.75, 19.25], size: [1.2, 1.2], top: 20.6 },
  { c: [7.25, 10.75], size: [1.2, 1.0], top: 17.4 },
  { c: [20.75, 4.25], size: [1.2, 1.2], top: 18.2 },
  { c: [10.25, -16.75], size: [1.2, 1.2], top: 19.0 },
  { c: [14.75, -9.25], size: [1.2, 1.0], top: 17.9 },
];
// Brug van het poortgebouw naar de oever (BGT overbruggingsdeel, drie delen),
// dek op +1,6 m (AHN-DSM 1,5 tot 1,6 m); de twee vaste delen hebben aan
// beide zijden een gemetselde borstwering van 0,9 m breed en 0,9 m hoog
// (foto's), het deel bij de poort (de ophaalbrug) niet.
const BRIDGE = [
  [[29.09, -9.91], [28.27, -12.09], [34.25, -14.41], [35.05, -12.26]],
  [[23.28, -7.61], [22.43, -9.83], [28.27, -12.09], [29.09, -9.91]],
  [[23.28, -7.61], [20.98, -6.7], [20.12, -8.93], [22.43, -9.83]],
];
const BRIDGE_DECK = 1.6;
const BRIDGE_RAIL = { parts: [0, 1], out: 0.35, in: 0.55, h: 0.9 };
// Maaiveld rondom (NAP +1,2 tot +1,3 m): de oever bij de brug en de paden ten
// oosten en westen van de gracht; niet het water.
const GROUND_SAMPLES = [[40, -13], [48, 0], [-48, 0]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const circle = (c, r, n = 48) => Array.from({ length: n }, (_, k) => polar(c, r, (360 * k) / n));
const cylinder = (c, r, z0, z1, n = 48) => prism(circle(c, r, n), z0, z1);
const cone = (c, r, z0, tip, n = 48) => Manifold.hull([...at(circle(c, r, n), z0), [c[0], c[1], tip]]);
const unit = ([x, y]) => {
  const l = Math.hypot(x, y);
  return [x / l, y / l];
};
const sub2 = (p, q) => [p[0] - q[0], p[1] - q[1]];
const dot2 = (p, q) => p[0] * q[0] + p[1] * q[1];
// Rechthoek in een stelsel: s0..s1 bij t0..t1.
const frameRect = (F, [s0, s1], [t0, t1]) => [F.p(s0, t0), F.p(s1, t0), F.p(s1, t1), F.p(s0, t1)];
// Rechthoek rond een lijnstuk, halve breedte h.
const band = ([p0, p1], h) => {
  const [ux, uy] = unit([p1[0] - p0[0], p1[1] - p0[1]]);
  return [
    [p0[0] + uy * h, p0[1] - ux * h],
    [p1[0] + uy * h, p1[1] - ux * h],
    [p1[0] - uy * h, p1[1] + ux * h],
    [p0[0] - uy * h, p0[1] + ux * h],
  ];
};
// Lijnstuk aan beide kanten met d verlengd.
const extend = ([p0, p1], d) => {
  const [ux, uy] = unit(sub2(p1, p0));
  return [[p0[0] - ux * d, p0[1] - uy * d], [p1[0] + ux * d, p1[1] + uy * d]];
};
// Zijde van een gevel: richting langs de rand en de normaal naar buiten (weg
// van het hart van het slot).
const edge = (a, b) => {
  const dir = unit(sub2(b, a));
  let n = [dir[1], -dir[0]];
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (dot2(n, mid) < 0) n = [-n[0], -n[1]];
  return { a, b, dir, n, length: Math.hypot(...sub2(b, a)), at: (u, d = 0) => [a[0] + dir[0] * u + n[0] * d, a[1] + dir[1] * u + n[1] * d] };
};
// Strook langs een rand: van `inner` binnen tot `outer` buiten de gevel en
// van u0 tot u1 langs de rand, van z0 tot z1 (lokale z), met onder het
// uitkragende deel een schuine kraag van 51 graden (de kraag is 1,25 keer
// zo hoog als hij uitsteekt).
const KRAAG = 1.25;
const ledgeBand = (E, u0, u1, inner, outer, z0, z1) => {
  const pts = [];
  for (const u of [u0, u1]) {
    // De kraag begint 0,15 m binnen de rand, zodat hij ook bij een licht
    // geknikte BAG-gevel overal op de muur aansluit.
    const foot = z0 - (outer + 0.15) * KRAAG;
    pts.push([...E.at(u, -inner), foot], [...E.at(u, -0.15), foot], [...E.at(u, outer), z0]);
    pts.push([...E.at(u, -inner), z1], [...E.at(u, outer), z1]);
  }
  return Manifold.hull(pts);
};
// Blok langs een rand (u0..u1, van `inner` binnen tot `outer` buiten).
const edgeBox = (E, u0, u1, inner, outer, z0, z1) =>
  prism([E.at(u0, -inner), E.at(u1, -inner), E.at(u1, outer), E.at(u0, outer)], z0, z1);
// Nis in een gevelvlak: profiel in het vlak (u langs de gevel, z) van
// `depth` achter tot 1,5 m voor de gevel. Met `apex` krijgt de nis een
// spitse bovenkant: vanaf z1 tot de top onder 55 graden.
const nicheTops = new Map();
const nicheCounts = {};
const niche = (point, dir, n, w, z0, z1, { depth = NICHE_DEPTH, pointed = false, label = "nis" } = {}) => {
  const half = w / 2;
  const profile = [[-half, NAP(z0)], [half, NAP(z0)], [half, NAP(z1)]];
  if (pointed) profile.push([0, NAP(z1) + half * Math.tan((55 * Math.PI) / 180)]);
  profile.push([-half, NAP(z1)]);
  const pts = [];
  for (const d of [-depth, 1.5]) {
    for (const [u, z] of profile) pts.push([point[0] + dir[0] * u + n[0] * d, point[1] + dir[1] * u + n[1] * d, z]);
  }
  if (!pointed) {
    const key = NAP(z1).toFixed(2);
    nicheTops.set(key, (nicheTops.get(key) ?? 0) + w * (depth + 0.05));
  }
  nicheCounts[label] = (nicheCounts[label] ?? 0) + 1;
  return Manifold.hull(pts);
};
// Zadeldak (met schilden waar `hip` waar is) als prisma tot de onderkant in
// een stelsel: nok langs s op t = tR tussen s0 en s1, hoogte `apex`
// (lokale z), helling `slope`.
const roofSolid = (F, [s0, s1], [hip0, hip1], tR, apex, slope) => {
  const w = (apex - BASE) / slope;
  const e0 = hip0 ? s0 - w : s0 - 60;
  const e1 = hip1 ? s1 + w : s1 + 60;
  const r0 = hip0 ? s0 : e0;
  const r1 = hip1 ? s1 : e1;
  return Manifold.hull([
    [...F.p(r0, tR), apex], [...F.p(r1, tR), apex],
    [...F.p(e0, tR - w), BASE], [...F.p(e0, tR + w), BASE],
    [...F.p(e1, tR - w), BASE], [...F.p(e1, tR + w), BASE],
  ]);
};
// Dakhoogte (NAP) van een geknikt dak op afstand d van de nok.
const kinkZ = (K, d) => Math.max(K.top - K.steep * d, K.top - K.steep * K.knee + K.shallow * K.knee - K.shallow * d);
const towerByName = Object.fromEntries(TOWERS.map((t) => [t.name, t]));
const outlinePrism = prism(OUTLINE, BASE, 200);

// ---------- vleugels ----------
const wingParts = [];
for (const K of KINKED) {
  let foot = prism(frameRect(K.F, K.s, K.t), BASE, 200).intersect(outlinePrism);
  for (const name of K.exclude) {
    const T = towerByName[name];
    foot = foot.subtract(cylinder(T.c, T.r + CORBEL, BASE - 1, 201));
  }
  const kneeZ = K.top - K.steep * K.knee;
  const roof = Manifold.union([
    roofSolid(K.F, K.ridgeS, K.hip, K.ridgeT, NAP(K.top), K.steep),
    roofSolid(K.F, K.ridgeS, K.hip, K.ridgeT, NAP(kneeZ + K.shallow * K.knee), K.shallow),
  ]);
  wingParts.push(Manifold.intersection(roof, foot));
}
// Trapgevels: treden symmetrisch rond de nok van de westvleugel, elke trede
// 0,45 m boven het dak aan haar binnenkant.
const WEST = KINKED[0];
const stepGables = STEP_GABLES.map((G) => {
  const parts = [];
  const halfMax = Math.max(WEST.ridgeT - WEST.t[0], WEST.t[1] - WEST.ridgeT);
  STEP.width = (halfMax - STEP.crown) / STEP.count;
  for (let i = 0; i < STEP.count; i++) {
    const outer = halfMax - i * STEP.width;
    const inner = outer - STEP.width;
    const top = kinkZ(WEST, Math.max(inner, STEP.crown)) + STEP.above;
    parts.push(prism(frameRect(WEST.F, G.s, [WEST.ridgeT - outer, WEST.ridgeT + outer]), NAP(12), NAP(top)));
  }
  parts.push(prism(frameRect(WEST.F, G.s, [WEST.ridgeT - STEP.crown, WEST.ridgeT + STEP.crown]), NAP(12), NAP(G.top)));
  return Manifold.union(parts).intersect(prism(frameRect(WEST.F, [-50, 50], WEST.t), BASE, 200)).intersect(outlinePrism);
});
const eastWing = Manifold.intersection(
  (() => {
    const E = EAST_WING;
    const [p0, p1] = E.ridge;
    const [ux, uy] = unit(sub2(p1, p0));
    const a = [p0[0] - ux * 10, p0[1] - uy * 10];
    const b = [p1[0] + ux * 10, p1[1] + uy * 10];
    const w = (NAP(E.top) - BASE) / E.slope;
    const pts = [];
    for (const p of [a, b]) pts.push([p[0], p[1], NAP(E.top)], [p[0] + uy * w, p[1] - ux * w, BASE], [p[0] - uy * w, p[1] + ux * w, BASE]);
    return Manifold.hull(pts);
  })(),
  // De voetafdruk loopt 3 m door tot in het poortgebouw en de noordvleugel.
  prism(band(extend(EAST_WING.ridge, 3), EAST_WING.halfWidth), BASE, 200)
    .intersect(outlinePrism)
    .subtract(cylinder(towerByName.noordoost.c, towerByName.noordoost.r + CORBEL, BASE - 1, 201)),
);
const stairTower = (() => {
  const S = STAIR_TOWER;
  const h = S.size / 2;
  const sq = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([s, t]) => [S.c[0] + NW.ax[0] * s + NW.bx[0] * t, S.c[1] + NW.ax[1] * s + NW.bx[1] * t]);
  return Manifold.union([prism(sq, BASE, NAP(S.eave) + 0.01), Manifold.hull([...at(sq, NAP(S.eave)), [...S.c, NAP(S.tip)]])]).intersect(outlinePrism);
})();

// ---------- poortgebouw ----------
const gatehouse = (() => {
  const G = GATE;
  const body = prism(frameRect(GT, G.s, G.t), BASE, NAP(G.eave) + 0.01);
  // Borstwering op een schuine kraag rondom, 0,3 m uitkragend.
  const out = LEDGE;
  const [s0, s1] = G.s;
  const [t0, t1] = G.t;
  const ring = [];
  for (const [ds, dt] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const s = ds < 0 ? s0 : s1;
    const t = dt < 0 ? t0 : t1;
    ring.push([...GT.p(s, t), NAP(G.corbel) - out * KRAAG]);
    ring.push([...GT.p(s + ds * out, t + dt * out), NAP(G.corbel)]);
    ring.push([...GT.p(s + ds * out, t + dt * out), NAP(G.eave)]);
  }
  const parapet = Manifold.hull(ring);
  const eaveRect = frameRect(GT, [s0 - out, s1 + out], [t0 - out, t1 + out]);
  const roof = Manifold.hull([
    ...at(eaveRect, NAP(G.eave) - 0.01),
    [...GT.p(G.ridgeS, G.ridgeT[0]), NAP(G.ridge)],
    [...GT.p(G.ridgeS, G.ridgeT[1]), NAP(G.ridge)],
  ]);
  return Manifold.union([body, parapet, roof]);
})();

// ---------- torens ----------
const tower = (T) => {
  const R = T.r + CORBEL;
  const parts = [
    cylinder(T.c, T.r, BASE, NAP(T.corbel) + 0.01),
    Manifold.hull([...at(circle(T.c, T.r), NAP(T.corbel) - CORBEL * KRAAG), ...at(circle(T.c, R), NAP(T.corbel))]),
    cylinder(T.c, R, NAP(T.corbel), NAP(T.eave)),
  ];
  if (T.crenellated) {
    // Kantelen op de buitenste 0,9 m van de borstwering, kegeldak erbinnen.
    // Aantal zo dat de tussenruimte ook aan de binnenkant 0,9 m is.
    const inner = R - MERLON.depth;
    const n = Math.floor((2 * Math.PI * inner) / ((MERLON.w * inner) / R + MERLON.gap));
    const step = 360 / n;
    const half = ((MERLON.w / R) * 180) / Math.PI / 2;
    for (let k = 0; k < n; k++) {
      const mid = k * step + step / 2;
      const arc = [];
      for (const deg of [mid - half, mid, mid + half]) arc.push(polar(T.c, R, deg));
      for (const deg of [mid + half, mid - half]) arc.push(polar(T.c, inner, deg));
      parts.push(Manifold.hull([...at(arc, NAP(T.eave) - 0.01), ...at(arc, NAP(T.eave + MERLON.h))]));
    }
    T.merlons = n;
    parts.push(cone(T.c, inner, NAP(T.eave) - 0.01, NAP(T.tip)));
  } else {
    // Geknikte kegelspits: dakvoet tot 62 % van de straal onder 32 graden,
    // daarboven de spits.
    const rk = 0.62 * R;
    const zk = T.eave + 0.62 * (R - rk);
    parts.push(Manifold.hull([...at(circle(T.c, R), NAP(T.eave) - 0.01), ...at(circle(T.c, rk), NAP(zk))]));
    parts.push(cone(T.c, rk, NAP(zk) - 0.01, NAP(T.tip)));
  }
  return Manifold.union(parts);
};
const swTurret = (() => {
  const S = SW_TURRET;
  const T = towerByName[S.tower];
  const c = polar(T.c, S.dist, S.azimuth);
  return Manifold.union([
    cylinder(c, S.r, BASE, NAP(S.eave) + 0.01, 24),
    cone(c, S.r, NAP(S.eave), NAP(S.tip), 24),
  ]).intersect(outlinePrism.add(cylinder(T.c, T.r + CORBEL, BASE, 200)));
})();

// ---------- weermuren met kantelen ----------
const curtainParts = [];
const merlonCounts = {};
// Deel van een rand buiten de torencirkels (met 0,1 m marge) en, bij de
// oostmuur, tot het poortgebouw.
const freeSpan = (E) => {
  let u0 = 0;
  let u1 = E.length;
  for (const T of TOWERS) {
    const R = T.r + CORBEL + 0.1;
    const rel = sub2(T.c, E.a);
    const along = dot2(rel, E.dir);
    const off = Math.abs(rel[0] * E.dir[1] - rel[1] * E.dir[0]);
    if (off >= R) continue;
    const h = Math.sqrt(R * R - off * off);
    if (along < E.length / 2) u0 = Math.max(u0, along + h);
    else u1 = Math.min(u1, along - h);
  }
  return [u0, u1];
};
for (const C of CURTAINS) {
  const E = edge(C.a, C.b);
  const [u0, u1] = freeSpan(E);
  const end = C.name === "oostmuur" ? E.length - 0.01 : u1;
  curtainParts.push(ledgeBand(E, u0, end, 0.6, LEDGE, NAP(PARAPET_FOOT), NAP(WALK)));
  const span = end - u0;
  const n = Math.floor((span + MERLON.gap) / (MERLON.w + MERLON.gap));
  const gap = (span - n * MERLON.w) / (n - 1);
  for (let k = 0; k < n; k++) {
    const u = u0 + k * (MERLON.w + gap);
    curtainParts.push(edgeBox(E, u, u + MERLON.w, MERLON.depth - LEDGE, LEDGE, NAP(WALK) - 0.01, NAP(WALK + MERLON.h)));
  }
  merlonCounts[C.name] = { count: n, gap: +gap.toFixed(2) };
  C.edge = E;
}

// ---------- gevels: kroonlijsten en lisenen ----------
const facadeParts = [];
const roofAtWall = (F) => {
  if (F === WW) return kinkZ(KINKED[0], KINKED[0].wallT - KINKED[0].ridgeT);
  if (F === NW) return kinkZ(KINKED[1], KINKED[1].wallT - KINKED[1].ridgeT);
  return EAST_WING.top - 2.0 * EAST_WING.slope;
};
for (const Fc of FACADES) {
  const E = edge(Fc.a, Fc.b);
  const [u0, u1] = freeSpan(E);
  Fc.edge = E;
  Fc.eave = roofAtWall(Fc.F);
  if (Fc.cornice) facadeParts.push(ledgeBand(E, u0, u1, 0.6, LEDGE, NAP(Fc.eave - 0.9), NAP(Fc.eave)));
  for (const L of Fc.lisenes) {
    const u = dot2(sub2(Fc.F.p(L.s, 0), E.a), E.dir);
    facadeParts.push(edgeBox(E, u - L.w / 2, u + L.w / 2, 0.5, 0.4, BASE, NAP(Fc.eave)));
  }
}
const plinth = Manifold.union(
  PLINTH.map(([d, z]) => Manifold.extrude(new CrossSection([ccw(OUTLINE)]).offset(d, "Miter", 2), NAP(z) - BASE).translate([0, 0, BASE])),
);

// ---------- dakkapellen en schoorstenen ----------
const dormer = (D) => {
  const { F, w } = D;
  const profile = [[-w / 2, D.low], [w / 2, D.low], [w / 2, D.wall], [0, D.ridge], [-w / 2, D.wall]];
  const pts = [];
  for (const d of [0, -D.depth]) {
    for (const [u, z] of profile) {
      const p = D.alongS ? F.p(D.s + D.n * d, D.t + u) : F.p(D.s + u, D.t + D.n * d);
      pts.push([...p, NAP(z)]);
    }
  }
  return Manifold.hull(pts);
};
const chimney = (C) => {
  const [a, b] = C.size;
  const sq = [[-a / 2, -b / 2], [a / 2, -b / 2], [a / 2, b / 2], [-a / 2, b / 2]].map(([s, t]) => [C.c[0] + NW.ax[0] * s + NW.bx[0] * t, C.c[1] + NW.ax[1] * s + NW.bx[1] * t]);
  return prism(sq, BASE, NAP(C.top)).intersect(outlinePrism);
};

// ---------- uitsparingen: vensters, schietgaten en de poortpartij ----------
const cutters = [];
for (const Fc of FACADES) {
  const E = Fc.edge;
  for (const row of Fc.windows) {
    for (const s of row.s) {
      const p = row.alongT ? Fc.F.p(0, s) : Fc.F.p(s, 0);
      const u = dot2(sub2(p, E.a), E.dir);
      cutters.push(niche(E.at(u), E.dir, E.n, row.w, row.z[0], row.z[1], { label: Fc.name }));
    }
  }
}
for (const C of CURTAINS) {
  for (const u of C.loops) cutters.push(niche(C.edge.at(u), C.edge.dir, C.edge.n, LOOP.w, LOOP.z0, LOOP.z1, { label: `schietgaten ${C.name}` }));
}
for (const T of TOWERS) {
  // Richting naar buiten: van het hart van het slot naar de toren.
  const out = (Math.atan2(T.c[1], T.c[0]) * 180) / Math.PI;
  for (const [z0, z1] of TOWER_ROWS[T.name]) {
    for (const d of TOWER_DIRS) {
      const deg = out + d;
      const n = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
      cutters.push(niche(polar(T.c, T.r, deg), [-n[1], n[0]], n, 0.9, z0, z1, { label: `toren ${T.name}` }));
    }
  }
  if (!T.crenellated) {
    const mid = (T.corbel + T.eave) / 2;
    for (const d of PARAPET_DIRS) {
      const deg = out + d;
      const n = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
      cutters.push(niche(polar(T.c, T.r + CORBEL, deg), [-n[1], n[0]], n, 0.9, mid - 0.4, mid + 0.4, { label: `borstwering ${T.name}` }));
    }
  }
}
{
  // Poortpartij in de voorgevel van het poortgebouw (vlak s = 4,1).
  const G = GATE;
  const front = (t) => GT.p(G.s[1], t);
  const along = GT.bx;
  const out = GT.ax;
  cutters.push(niche(front(0), along, out, G.frame.w, G.frame.z0, G.frame.z1, { label: "poortpartij" }));
  cutters.push(niche(front(G.slot.t), along, out, G.slot.w, G.slot.z0, G.slot.z1, { label: "poortpartij" }));
  cutters.push(niche(front(G.window.t), along, out, G.window.w, G.window.z0, G.window.z1, { label: "poortpartij" }));
  for (const t of G.arcade.t) cutters.push(niche(front(t), along, out, G.arcade.w, G.arcade.z0, G.arcade.spring, { pointed: true, label: "poortpartij" }));
  // Vensters in de zijgevels boven de weermuur en in de borstwering.
  for (const [t, sign] of [[G.t[0], -1], [G.t[1], 1]]) {
    const n = [GT.bx[0] * sign, GT.bx[1] * sign];
    for (const s of [-2.0, 2.0]) {
      if (sign > 0 && s < 0) continue;
      cutters.push(niche(GT.p(s, t), GT.ax, n, 0.9, 9.0, 10.4, { label: "poortgebouw" }));
    }
  }
  const pMid = (G.corbel + G.eave) / 2 + 0.2;
  for (const t of [-2.0, 0, 2.0]) cutters.push(niche(GT.p(G.s[1] + LEDGE, t), along, out, 0.9, pMid - 0.45, pMid + 0.45, { label: "borstwering poortgebouw" }));
  for (const s of [-2.0, 0.5, 3.0]) {
    cutters.push(niche(GT.p(s, G.t[0] - LEDGE), GT.ax, [-GT.bx[0], -GT.bx[1]], 0.9, pMid - 0.45, pMid + 0.45, { label: "borstwering poortgebouw" }));
  }
}
// Spitse poortdoorgang (60 graden) van de brug naar de binnenplaats.
const passage = (() => {
  const P = GATE.passage;
  const rise = (P.w / 2) * Math.tan(Math.PI / 3);
  const profile = [[-P.w / 2, NAP(P.floor)], [P.w / 2, NAP(P.floor)], [P.w / 2, NAP(P.spring)], [0, NAP(P.spring) + rise], [-P.w / 2, NAP(P.spring)]];
  const pts = [];
  for (const s of [-8, 6]) for (const [t, z] of profile) pts.push([...GT.p(s, t), z]);
  return Manifold.hull(pts);
})();

// ---------- slot ----------
const castle = Manifold.union([
  prism(OUTLINE, BASE, NAP(WALK)),
  plinth,
  ...wingParts,
  ...stepGables,
  eastWing,
  stairTower,
  gatehouse,
  ...TOWERS.map(tower),
  swTurret,
  ...curtainParts,
  ...facadeParts,
  ...DORMERS.map(dormer),
  ...CHIMNEYS.map(chimney),
])
  .subtract(prism(COURT, NAP(COURT_FLOOR), 200))
  .subtract(Manifold.union(cutters))
  .subtract(passage);
console.log("kantelen:", merlonCounts, "noordoosttoren:", towerByName.noordoost.merlons);
console.log("nissen:", nicheCounts);

// ---------- brug ----------
const bridge = (() => {
  const parts = BRIDGE.map((q) => prism(q, BASE, NAP(BRIDGE_DECK)));
  for (const k of BRIDGE_RAIL.parts) {
    const q = BRIDGE[k];
    // Lange zijden: q[1]->q[2] en q[3]->q[0].
    for (const [i, j] of [[1, 2], [3, 0]]) {
      const E = edge(q[i], q[j]);
      // Naar buiten = weg van het midden van het brugdeel.
      const mid = q.reduce((m, p) => [m[0] + p[0] / 4, m[1] + p[1] / 4], [0, 0]);
      const sign = dot2(sub2(E.at(E.length / 2), mid), E.n) > 0 ? 1 : -1;
      const n = [E.n[0] * sign, E.n[1] * sign];
      const P = (u, d) => [q[i][0] + E.dir[0] * u + n[0] * d, q[i][1] + E.dir[1] * u + n[1] * d];
      parts.push(prism([P(0, -BRIDGE_RAIL.in), P(E.length, -BRIDGE_RAIL.in), P(E.length, BRIDGE_RAIL.out), P(0, BRIDGE_RAIL.out)], BASE, NAP(BRIDGE_DECK + BRIDGE_RAIL.h)));
    }
  }
  return Manifold.union(parts);
})();

const nodes = [
  ["building:slot", castle],
  ["road:brug", bridge],
];
const all = Manifold.union(nodes.map(([, solid]) => solid));

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de
  // onderkant: alleen de vlakke bovenkanten van de nissen (hooguit breedte
  // maal 0,4 m per nis).
  for (const [name, solid] of nodes) {
    const mesh = solid.getMesh();
    const v = mesh.vertProperties;
    const s = mesh.numProp;
    const levels = new Map();
    for (let t = 0; t < mesh.triVerts.length; t += 3) {
      const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
      if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
      const e1 = p[1].map((c, i) => c - p[0][i]);
      const e2 = p[2].map((c, i) => c - p[0][i]);
      const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      const len = Math.hypot(...n);
      if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
      const z = Math.min(...p.map((q) => q[2])).toFixed(2);
      levels.set(z, (levels.get(z) ?? 0) + len / 2);
    }
    const total = [...levels.values()].reduce((sum, area) => sum + area, 0);
    console.log(`${name}: ondervlakken (lokale z: m2)`, Object.fromEntries([...levels].map(([z, a]) => [z, +a.toFixed(2)])), `totaal ${total.toFixed(1)} m2`);
    for (const [z, area] of levels) {
      if (area <= 0.01) continue;
      if (!nicheTops.has(z)) throw new Error(`${name}: overhang op z ${z} (${area.toFixed(2)} m2)`);
      if (area > nicheTops.get(z) + 0.05) throw new Error(`${name}: nisbovenkanten op z ${z}: ${area.toFixed(2)} > ${nicheTops.get(z).toFixed(2)} m2`);
    }
    const bb = solid.boundingBox();
    if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
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
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
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
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
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
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    nodes.push({ name, mesh: meshes.length - 1 });
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
for (const [name, solid] of nodes) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "muiderslot.glb");
const glb = toGlb(nodes, "NederPrint generate-muiderslot.mjs (manifold-3d)");
await writeFile(glbFile, glb);
report.glb = { file: glbFile, bytes: glb.length, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `muiderslot-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Muiderslot Muiden 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

await writeFile(
  path.join(outDir, "muiderslot.json"),
  JSON.stringify(
    {
      name: "Muiderslot",
      file: "muiderslot.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      // 0 in plaats van -0,3: de oever ligt op het niveau van het brugdek en
      // de binnenplaats blijft boven het PDOK-terrein binnen de muren.
      groundOffsetMetres: 0,
      // Op het maaiveld rondom (NAP +1,2 tot +1,3 m): de oever bij de brug en
      // de paden ten oosten en westen van de slotgracht; niet het water.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0424100000004154"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (133468, 482984), midden in het slot, op het maaiveld van de oever (NAP +1,3 m), +X naar het oosten en +Y naar het noorden. Twee nodes: building:slot met een plint rondom, de westvleugel met een geknikt zadeldak (nok +22 m, knik +18,1 m, goot +16,4 m), trapgevels aan de zuidkant en halverwege (brandmuur met schoorsteen, +24 m) en een schild aan de noordkant, de noordvleugel met een geknikt zadeldak (nok +15,4 m, goot +12,2 m), de oostvleugel met zadeldak (nok +12,8 m), een traptorentje met tentdak (+18,6 m), dakkapellen en schoorstenen, kroonlijsten op een schuine kraag, schoorsteenlisenen en vensternissen in de buitengevels, de gekanteelde weermuren aan de zuid- en oostkant (weergang +7,9 m, kantelen van 1,6 m breed en 1 m hoog op een uitkragende borstwering met schuine kraag, schietgaten als nissen), het vooruitspringende poortgebouw met de poortpartij (spitse doorgang in een sponning, sleuf van de ophaalbrug, spitse nissen onder de borstwering), een borstwering op een schuine kraag en een tentdak (nok +19,2 m) met twee dakkapellen, de vier ronde hoektorens met een borstwering op een schuine kraag en geknikte kegelspitsen (zuidwest tot +27,8 m met een traptorentje tot +25,6 m, zuidoost +24,5 m, noordwest +23 m) en de noordoosttoren met kantelen en een kegeldak (+20,8 m), rond de open binnenplaats (+2,1 m); road:brug, de brug van het poortgebouw naar de oostoever (dek +1,6 m) met borstweringen op de vaste delen. Alle onderdelen beginnen op NAP -1,5 m, onder het water van de slotgracht, die in het PDOK-terrein zit. Alles staat recht op, loopt schuin omhoog of rust op een kraag van 51 graden; alleen de vensternissen hebben een vlakke bovenkant van 0,35 m diep, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van het BAG-pand van het slot. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`muiderslot-1-${scale}.stl`],
      realWorld: {
        lengthEastWestM: +(bb.max[0] - bb.min[0]).toFixed(2),
        lengthNorthSouthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        wallWalkNapM: WALK,
        merlonTopNapM: WALK + MERLON.h,
        merlonWidthM: MERLON.w,
        merlonCount: Object.values(merlonCounts).reduce((n, m) => n + m.count, 0) + towerByName.noordoost.merlons,
        courtyardNapM: COURT_FLOOR,
        westWingRidgeNapM: KINKED[0].top,
        westWingKneeNapM: +(KINKED[0].top - KINKED[0].steep * KINKED[0].knee).toFixed(2),
        stepGableTopNapM: STEP_GABLES[1].top,
        northWingRidgeNapM: KINKED[1].top,
        eastWingRidgeNapM: EAST_WING.top,
        gatehouseRidgeNapM: GATE.ridge,
        gatehouseEaveNapM: GATE.eave,
        southWestTowerTipNapM: towerByName.zuidwest.tip,
        southWestTurretTipNapM: SW_TURRET.tip,
        southEastTowerTipNapM: towerByName.zuidoost.tip,
        northWestTowerTipNapM: towerByName.noordwest.tip,
        northEastTowerTipNapM: towerByName.noordoost.tip,
        bridgeDeckNapM: BRIDGE_DECK,
        groundNapM: GROUND_NAP,
        baseNapM: -1.5,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Muiderslot",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/30107",
        "PDOK BAG pand 0424100000004154 (slot), EPSG:28992",
        "PDOK BGT overbruggingsdeel: de brug van het poortgebouw naar de oostoever",
        "PDOK AHN DSM/DTM 0,5 m via WCS: geknikte dakprofielen per vleugel, trapgevels, schild, schoorstenen en dakkapellen, weermuren en kantelen, torens per straal, poortgebouw, binnenplaats en maaiveld",
        "Wikimedia Commons: 20141028 Muiderslot vanuit het westen gezien.jpg; 20141028 Muiderslot vanuit het zuidoosten gezien.jpg; Muiden, Muiderslot. 09-05-2022. (actm.) 01, 03, 05 en 07; Muiderslot castle 2018 1 en 3; Exterieur OVERZICHT VOORGEVEL - Muiden - 20287199 - RCE.jpg (poortpartij); Muiderslot vanuit de polder.JPG; Muiderslot 2015.jpg",
        "PDOK luchtfoto 8 cm (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

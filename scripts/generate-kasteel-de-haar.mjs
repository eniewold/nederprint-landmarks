// Genereert een vereenvoudigd, gesloten 3D-model van Kasteel De Haar in
// Haarzuilens: het neogotische kasteel van Pierre en Joseph Cuypers
// (1892-1912) in de slotgracht, met de voorburcht ten westen ervan, de
// overdekte galerijbrug tussen beide, het châtelet (de toegangspoort) aan de
// noordkant van de voorhof met zijn brug, en de brug naar de oostingang. De
// slotgracht zelf zit in het PDOK-terrein en niet in het model. Alle maten in
// het script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y
// omhoog, één node per onderdeel met de materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-kasteel-de-haar.mjs              # 1:1000 (standaard)
//   node scripts/generate-kasteel-de-haar.mjs --scale 2000
//
// Dakvormen (AHN-DSM per 0,5 m in het stelsel van elke vleugel, de
// PDOK-luchtfoto van 8 cm en luchtfoto's van alle kanten op Wikimedia
// Commons):
// - Het kasteel bestaat uit vleugels met eigen zadeldaken die elkaar in
//   kilgoten raken: de zuidvleugel langs de zuidgevel (nok +24,6 m, 56
//   graden) met een trapgevel aan de oostkant, zeven dakkapellen en een
//   topgevel boven de zuidgevel; drie evenwijdige vleugels van
//   noordnoordwest naar zuidzuidoost (de oostvleugel, nok +24,3 m; het dak
//   over de overdekte binnenplaats, nok +23,2 m met een schild aan de
//   noordkant; de westvleugel, nok +24,6 m met een trapgevel aan de
//   noordkant), een lagere vleugel langs de westgevel (+22,5 m) en de
//   noordwestvleugel langs de voorhof (+24 m, met een lager deel tot +22 m).
//   Kilgoten tussen de vleugels op +18 tot +19,5 m, zoals in het DSM.
// - De drie ronde hoektorens hebben een borstwering met nissen op een
//   schuine kraag rond een open weergang (de diepe ring in het DSM) en
//   daarbinnen een kern met een steile kegelspits; de noordtoren heeft vier
//   dakkapelletjes op de spits.
// - De vier vierkante torens hebben een uitkragende lijst op een schuine
//   kraag onder het tentdak. Twee slanke traptorens met spits, een
//   achtkantig torentje tegen de zuidgevel en schoorstenen (1,2 tot 1,5 m)
//   staan waar het DSM pieken toont en de foto's ze laten zien.
// - De voorburcht houdt zijn daken als hoogteveld naar het AHN, met nu een
//   lijst op een kraag onder de tentdaken van de vierkante torens, een
//   geknikte spits met lantaarn op het traptorentje, schoorstenen, en een
//   schuine kraag onder de rand van de ronde zuidtoren.
// Toegangspoort (châtelet, luchtfoto 8 cm, BAG, DSM en foto's van de
// brugzijde): het poortgebouw met de spitse doorgang in een spitse sponning,
// drie vensternissen erboven, een borstwering op een schuine kraag met
// kantelen van 0,9 m (tussenruimtes 0,9 tot 1,2 m), de ronde zuidtoren met een lijst
// op een kraag en een achtkantige spits, het noordtorentje met een
// achtkantige spits, en de brug naar het oosten met borstweringen en drie
// spitse bogen tussen de BGT-pijlers. De galerijbrug van de voorburcht naar
// het kasteel heeft vier spitse doorgangen, vensternissen in de galerij en
// een zadeldak met schilden; de brug naar de oostingang borstweringen en een
// spitse boog.
// Gevels: een plint rondom, kroonlijsten op een schuine kraag aan de zuid-,
// oost- en noordwestgevel, vensters als nissen van 0,35 m in de gevels en de
// torens.
//
// Printbaar op 1:1000 zonder steun: alle bouwdelen zijn minstens 0,9 m breed,
// muren staan recht op, dakvlakken en spitsen lopen schuin omhoog, de
// weergangen, lijsten en borstweringen rusten op een kraag van 51 graden en
// de doorgangen, bogen en de sponning hebben een spitse top van 55 tot 60
// graden. Alleen de vensternissen hebben een vlakke bovenkant van 0,3 tot
// 0,35 m diep; de controle onderaan staat geen andere ondervlakken toe. Alle
// onderdelen beginnen op dezelfde onderkant (NAP -1,5 m).
//
// Assenstelsel: oorsprong op RD (127540, 459320), midden in het kasteel, op
// het maaiveld van de voorhof (NAP +0,8 m), Z omhoog, +X naar het oosten en
// +Y naar het noorden (de RD-assen). De voorburcht ligt aan de -X-kant, het
// châtelet 70 m naar het noorden, de grootste ronde toren (NAP +40,3 m) op
// de noordpunt van het kasteel.
//
// Bronnen: BAG-panden 0344100000022989 (kasteel), 0344100000037638
// (voorburcht) en 0344100000100346, 0344100000104054 en 0344100000104055
// (châtelet); BGT overbruggingsdeel (dekken en pijlers van de drie bruggen)
// en waterdeel; AHN DSM/DTM 0,5 m (PDOK WCS, als raster per 0,5 m in het
// stelsel van elke vleugel bekeken): nokken, kilgoten, goten, trapgevels,
// schoorstenen, dakkapellen, torens en het maaiveld; Wikipedia en het
// Rijksmonumentenregister (complex 527891); foto's op Wikimedia Commons
// (Kasteel de Haar. Luchtfoto 1 tot 8, De Haar Castle Drone, het kasteel
// en de voorburcht vanuit het zuidwesten, het châtelet met de brug, de
// voorburcht vanaf de voorhof, de noordtoren en de galerijbrug); PDOK
// luchtfoto 8 cm.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-de-haar");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection, Mesh } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 0,8 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [127540, 459320];
const X_AXIS = [1, 0];
const GROUND_NAP = 0.8;
const NAP = (h) => h - GROUND_NAP;
// Alle onderdelen beginnen op NAP -1,5 m, onder het water van de slotgracht
// (circa NAP -0,5 m), zodat de gevels uit het water rijzen.
const BASE = NAP(-1.5);
// BAG-contouren (lokaal, vereenvoudigd tot 0,12 m): het kasteel met de
// ronde torens en de voorburcht met de galerij langs de voorhof.
const CASTLE_OUTLINE = [
  [-17.3, 5.78], [-23.01, -0.18], [-19.99, -4.53], [-20.37, -4.65], [-22.0, -6.77], [-22.07, -9.47],
  [-20.59, -11.67], [-18.01, -12.61], [-17.52, -12.46], [-16.52, -13.32], [-15.65, -13.43], [-14.1, -12.65],
  [-9.1, -20.11], [0.4, -18.84], [0.51, -18.99], [0.91, -18.96], [1.64, -19.84], [2.92, -19.66],
  [3.39, -18.59], [3.82, -18.39], [18.91, -16.4], [19.72, -18.85], [22.62, -20.94], [26.09, -20.9],
  [28.84, -18.84], [29.9, -15.66], [28.8, -12.21], [26.01, -10.16], [22.42, -10.2], [20.7, -11.46],
  [19.68, -5.08], [18.96, -5.19], [18.36, -1.84], [18.8, -1.6], [19.1, -0.56], [18.57, 0.42], [17.52, 0.72],
  [17.26, 0.59], [12.41, 9.16], [17.13, 11.88], [14.48, 16.49], [10.92, 14.45], [9.98, 16.13], [8.45, 16.2],
  [9.05, 16.53], [7.36, 19.56], [6.76, 19.22], [5.87, 20.79], [7.75, 21.64], [9.43, 24.62], [9.03, 28.04],
  [6.73, 30.55], [3.36, 31.23], [0.21, 29.88], [-0.24, 28.87], [-0.96, 28.34], [-1.12, 27.49], [-1.51, 26.82],
  [-1.08, 23.43], [0.24, 22.28], [-1.1, 20.88], [-0.8, 20.56], [-6.17, 15.14], [-5.98, 14.81], [-12.32, 8.49],
  [-15.05, 11.35], [-18.96, 7.45]
];
const VOOR_OUTLINE = [
  [-40.0, 12.9], [-38.43, 12.51], [-36.98, 12.87], [-35.99, 13.99], [-35.63, 15.23], [-25.81, 23.78],
  [-25.68, 23.64], [-22.65, 26.29], [-24.94, 28.89], [-27.98, 26.23], [-27.47, 25.65], [-35.24, 18.88],
  [-36.27, 19.61], [-37.68, 20.12], [-37.1, 20.9], [-37.37, 21.6], [-36.49, 21.85], [-36.83, 23.52],
  [-37.94, 24.21], [-38.43, 24.08], [-40.58, 32.19], [-38.67, 32.7], [-38.78, 33.12], [-39.3, 32.99],
  [-40.36, 37.34], [-41.39, 37.07], [-41.98, 39.3], [-41.51, 40.09], [-41.72, 40.94], [-42.54, 41.43],
  [-46.76, 57.38], [-47.31, 57.23], [-48.71, 62.51], [-50.71, 61.93], [-52.68, 69.75], [-52.14, 69.88],
  [-52.29, 70.47], [-52.74, 70.35], [-52.85, 70.8], [-53.8, 70.56], [-53.69, 70.13], [-56.68, 69.38],
  [-57.2, 70.53], [-57.87, 71.07], [-58.68, 71.32], [-59.52, 71.26], [-60.23, 70.94], [-60.82, 70.33],
  [-61.15, 69.54], [-61.17, 68.68], [-60.88, 67.88], [-60.05, 67.06], [-59.13, 67.31], [-57.2, 60.15],
  [-59.0, 59.66], [-58.71, 58.59], [-57.68, 58.87], [-56.75, 55.42], [-57.82, 55.14], [-55.86, 48.7],
  [-54.79, 48.99], [-53.52, 44.33], [-52.92, 44.49], [-48.78, 28.82], [-49.16, 28.0], [-49.17, 27.14],
  [-48.77, 26.31], [-47.99, 25.73], [-46.53, 19.68], [-47.23, 19.22], [-47.4, 18.4], [-46.95, 17.7],
  [-46.05, 17.47], [-45.37, 17.91], [-41.54, 15.04], [-40.89, 13.63]
];
// Hart van het kasteel (voor de richting naar buiten van torens en gevels).
const CASTLE_HEART = [2, 0];

// Lokale stelsels: oorsprong o, as a (s) en b = a 90 graden linksom (t).
const frame = (o, a) => {
  const l = Math.hypot(...a);
  const ax = [a[0] / l, a[1] / l];
  const bx = [-ax[1], ax[0]];
  return { o, ax, bx, p: (s, t) => [o[0] + ax[0] * s + bx[0] * t, o[1] + ax[1] * s + bx[1] * t] };
};
// Zuidvleugel: s langs de zuidgevel naar het oosten, t naar binnen (noorden);
// de gevel ligt op t = 0 (BAG).
const ZW = frame([-9.1, -20.11], [28.01, 3.71]);
// Stelsel van de drie evenwijdige vleugels: s naar het noordnoordwesten
// (langs de nokken), t naar het westzuidwesten.
const HW = frame([0, 0], [-0.4, 0.917]);
// Noordwestvleugel: s langs de noordwestgevel naar het noordoosten, t naar
// buiten (noordwesten); de gevel ligt op t = 0 (BAG).
const NWW = frame([-12.32, 8.49], [0.69, 0.724]);

// Zadeldaken (AHN-DSM, mediaan dwars op de nok over stroken van 8 tot 20 m):
// stelsel, nok op t = ridgeT met hoogte top (NAP), helling aan de kant van
// kleinere t (slopeA) en grotere t (slopeB), nok van s = ridgeS[0] tot
// ridgeS[1] met een schild aan dat eind waar `hip` waar is, en de voetafdruk
// (s, t) die verder met de BAG-contour wordt afgesneden.
// - Zuidvleugel: goot +17,5 tot +18 m aan de zuidgevel, nok +24,5 tot
//   +25 m op 5,75 m uit de gevel, dakvlakken van 56 graden.
// - Oostvleugel: nok +24 tot +25 m, kilgoot naar de binnenplaats +18 m, goot
//   aan de oostgevel +17 tot +18 m (53 graden).
// - Binnenplaats (de hal): nok +23 m, oostelijk dakvlak naar de kilgoot op
//   +18 m (37 graden), westelijk naar +19 m (29 graden); schild aan de
//   noordkant.
// - Westvleugel: smalle vleugel met steile dakvlakken (61 graden), nok +24,5
//   tot +25 m, kilgoten +19 m; eindigt in het noorden in een trapgevel.
// - Vleugel langs de westgevel: nok +22 tot +23 m, goot +15 tot +16 m.
// - Noordwestvleugel: goot +17 tot +18 m aan de gevel, nok +23 tot +24 m op
//   5,5 m uit de gevel; het deel ten zuidwesten van de vierkante toren
//   lager: nok +22 m op 3,5 m uit de gevel.
const WINGS = [
  { name: "zuidvleugel", F: ZW, ridgeT: 5.75, top: 24.6, slopeA: 1.5, slopeB: 1.5, ridgeS: [2.0, 28.0], hip: [true, false], s: [-6, 28.45], t: [-1, 11.5] },
  { name: "oostvleugel", F: HW, ridgeT: -10.0, top: 24.3, slopeA: 1.3, slopeB: 1.3, ridgeS: [-60, 60], hip: [false, false], s: [-14, 14], t: [-18.5, -4.5] },
  { name: "binnenplaats", F: HW, ridgeT: 1.5, top: 23.2, slopeA: 0.75, slopeB: 0.55, ridgeS: [-60, 7.0], hip: [false, true], hipSlope: 0.75, s: [-13, 20], t: [-6.5, 9.5] },
  { name: "westvleugel", F: HW, ridgeT: 11.8, top: 24.6, slopeA: 1.8, slopeB: 1.8, ridgeS: [-60, 60], hip: [false, false], s: [-14, 2.9], t: [8.0, 19.0] },
  { name: "westgevel", F: HW, ridgeT: 14.5, top: 22.2, slopeA: 1.6, slopeB: 1.1, ridgeS: [-60, 60], hip: [false, false], s: [-3, 14], t: [12.5, 25] },
  { name: "noordwestvleugel", F: NWW, ridgeT: -5.5, top: 24.0, slopeA: 1.33, slopeB: 1.33, ridgeS: [-60, 60], hip: [false, false], s: [1.0, 24], t: [-10.5, 1.5] },
  { name: "noordwestvleugel laag", F: NWW, ridgeT: -3.5, top: 22.0, slopeA: 1.33, slopeB: 1.33, ridgeS: [-60, 60], hip: [false, false], s: [-14, 2.0], t: [-7.5, 1.5] },
];
// Muren van het kasteel tot het laagste goot-niveau (de westgevel, +15 m).
const CASTLE_WALL = 15.0;
// Trapgevels (luchtfoto: de getrapte rand aan het noordeinde van de
// westvleugel; DSM: de top aan het oosteinde van de zuidvleugel tot +24,7 m;
// foto's vanuit het noordoosten): 0,9 m dik, vier treden per kant die 0,45 m
// boven het dak aan hun binnenkant uitkomen, en een kroon van 1,2 m breed.
const STEP_GABLES = [
  { name: "zuidvleugel oost", wing: "zuidvleugel", s: [27.55, 28.45], crown: 25.4 },
  { name: "westvleugel noord", wing: "westvleugel", s: [2.0, 2.9], crown: 25.8 },
];
const STEP = { count: 4, above: 0.45, crown: 0.6 };
// Topgevel boven de zuidgevel (DSM: een blok van 3 m breed tot +23,4 m op de
// gevel, s = 5): een getrapte dakkapel in het gevelvlak, 3,2 m breed en 4 m
// diep.
const WALL_DORMER = { s: 5.0, w: 3.2, depth: 4.0, crown: 23.4 };
// Dakkapellen (DSM-pieken van 2 tot 3 m boven het dakvlak en de luchtfoto):
// stelsel, vleugel, posities s, het vlak van de voorkant t en de richting
// naar buiten (-1 of +1 langs t), breedte, hoogte van de wangen boven de
// onderkant, de nok erboven en de diepte.
const DORMERS = [
  { wing: "zuidvleugel", s: [1.0, 8.4, 11.9, 15.4, 18.9, 22.4, 25.9], t: 2.4, n: -1, w: 1.3, wall: 1.3, ridge: 0.7, depth: 2.6 },
  { wing: "oostvleugel", s: [-7, -3, 1, 5], t: -13.2, n: -1, w: 1.2, wall: 1.3, ridge: 0.7, depth: 2.4 },
  { wing: "binnenplaats", s: [-6, -2, 2], t: 6.0, n: 1, w: 1.2, wall: 1.0, ridge: 0.5, depth: 3.0 },
  { wing: "noordwestvleugel", s: [9, 12.5, 16], t: -2.6, n: 1, w: 1.2, wall: 1.3, ridge: 0.7, depth: 2.4 },
];
// Schoorstenen (pieken in het AHN-DSM van 1,5 tot 3 m boven het dak,
// bevestigd op de luchtfoto's): midden, zijde, bovenkant (NAP).
const CHIMNEYS = [
  { c: [-1.3, -13.3], size: 1.2, top: 25.6 },
  { c: [13.3, -11.3], size: 1.2, top: 26.3 },
  { c: [17.6, -0.8], size: 1.2, top: 25.3 },
  { c: [4.8, 13.3], size: 1.2, top: 25.4 },
];
// Ronde hoektorens (AHN-omhullende per straal): romp tot de kraag, een
// borstwering van 1 m dik die 0,35 m uitkraagt op een schuine kraag tot
// `parapet`, daarbinnen de open weergang op `floor` (het DSM ziet een diepe
// ring) en een kern met straal `core` tot `coreTop` met een steile
// kegelspits (DSM: 3,8 m per meter straal bij de noordtoren). Vensters als
// nissen in rijen; de noordtoren heeft vier dakkapelletjes op de spits.
const ROUND_TOWERS = [
  // Noordtoren, de hoogste: weergang op +25,7 m, spits tot +40,3 m.
  { name: "noord", c: [4.0, 25.4], r: 5.8, corbel: 23.6, parapet: 25.7, floor: 24.1, core: 3.7, coreTop: 26.3, tip: 40.3, rows: [[5.0, 6.8], [10.0, 11.8], [15.0, 16.8], [19.5, 21.3]], gallery: 12, lucarnes: 4 },
  // Zuidoosttoren.
  { name: "zuidoost", c: [24.4, -15.6], r: 5.2, corbel: 20.2, parapet: 22.0, floor: 20.4, core: 3.3, coreTop: 22.8, tip: 33.8, rows: [[5.0, 6.8], [10.0, 11.8], [15.0, 16.8]], gallery: 10, lucarnes: 0 },
  // Zuidwesttoren.
  { name: "zuidwest", c: [-18.2, -8.3], r: 4.5, corbel: 20.4, parapet: 22.3, floor: 20.7, core: 2.9, coreTop: 22.6, tip: 31.5, rows: [[5.0, 6.8], [10.0, 11.8], [15.0, 16.8]], gallery: 8, lucarnes: 0 },
];
const GALLERY_OUT = 0.35;
const WALL_PARAPET = 1.0;
const KRAAG = 1.25;
const NICHE_DEPTH = 0.35;
const TOWER_DIRS = [-50, 0, 50];
// Vierkante torens: midden, zijde, draaiing (graden), goot en top van het
// tentdak; een lijst van 0,3 m op een schuine kraag van 1 m onder de goot.
const SQUARE_TOWERS = [
  { name: "noordwest", c: [-6.3, 11.2], side: 6.5, deg: 45, eave: 25.5, tip: 32.3 },
  { name: "noord", c: [-16.2, 7.8], side: 5.0, deg: 45, eave: 22.0, tip: 27.3 },
  { name: "oost", c: [10.5, -5.0], side: 6.0, deg: -10, eave: 23.5, tip: 31.2 },
  { name: "noordoost", c: [12.5, 13.0], side: 5.5, deg: 30, eave: 23.0, tip: 30.0 },
];
const LEDGE = 0.3;
// Slanke traptorens met een spits (DSM-pieken tot +26,2 en +27,3 m; foto's
// vanuit het zuiden en westen) en het achtkantige torentje tegen de
// zuidgevel (BAG-uitbouw, DSM +21,4 m).
const TURRETS = [
  { name: "traptoren zuidwest", c: [-13.8, -3.8], r: 1.2, eave: 22.5, tip: 26.8, n: 24 },
  { name: "traptoren west", c: [-10.3, 5.3], r: 1.2, eave: 23.5, tip: 28.3, n: 24 },
  { name: "torentje zuidgevel", c: [2.15, -18.55], r: 1.3, eave: 18.2, tip: 22.0, n: 8 },
];
// Gevels met kroonlijst (een band van 0,9 m hoog die 0,3 m uitkraagt tot de
// goot, op een schuine kraag) en vensternissen [onderkant, bovenkant] op
// posities u langs de BAG-rand: de zuidgevel, de lange oostgevel en de
// noordwestgevel.
const FACADES = [
  { name: "zuidgevel", a: [-9.1, -20.11], b: [18.91, -16.4], eave: 16.0, skip: [[3.2, 6.8], [10.4, 12.3]], windows: { u: [1.5, 8.5, 14.0, 16.5, 19.0, 21.5, 24.0, 26.5], rows: [[3.5, 5.3], [7.5, 9.3], [11.5, 13.3]] } },
  { name: "oostgevel", a: [17.26, 0.59], b: [12.41, 9.16], eave: 16.4, skip: [], windows: { u: [2.5, 5.0, 7.5], rows: [[3.5, 5.3], [7.5, 9.3], [11.5, 13.3]] } },
  { name: "noordwestgevel", a: [-12.32, 8.49], b: [-0.8, 20.56], eave: 16.7, skip: [], windows: { u: [0.5, 11.5, 14.0], rows: [[3.5, 5.3], [7.5, 9.3], [11.5, 13.3]] } },
];
// Plint rondom: 0,3 m uitspringend tot NAP +0,4 m, net boven het water.
const PLINTH = { out: 0.3, top: 0.4 };

// Voorburcht in een stelsel langs de vleugel (u van de zuidtoren naar het
// noorden, v dwars naar de voorhof, positief naar het oosten),
// dwarsprofielen uit het AHN gekozen: het zuidelijke deel met de nok op
// v = 0 en +15,5 m, het westelijke dakvlak onder 42 graden en het oostelijke
// onder 50 graden; het noordelijke deel tussen de vierkante torens (u > 34
// m) met de nok op v = -1 m en +20 m; en de lage galerij langs de voorhof
// (v > 6,5 m, u < 12 m) met een goot op +5 m en een plat tot +6,5 m.
const VOOR_FRAME = { p0: [-40, 13], u: [-0.34044, 0.94027] };
const VOOR_ROOF = [
  { when: (u, v) => v > 6.5 && u < 12, eave: 5.0, slope: 1.0, flat: 6.5 },
  { when: (u) => u >= 34, ridgeV: -1.0, ridge: 20.0, west: 0.5, east: 1.0 },
  { when: () => true, ridgeV: 0.0, ridge: 15.5, west: 0.9, east: 1.2 },
];
// Voorburcht: de ronde zuidtoren met een rand op een schuine kraag onder de
// spits, twee vierkante torens met een lijst onder het tentdak, de ronde
// noordtoren en het traptorentje met een geknikte spits en een lantaarn
// (foto vanaf de voorhof).
const VOOR = {
  south: { c: [-38.6, 15.6], r: 3.7, corbel: 13.4, eave: 14.4, tip: 21.6 },
  squares: [
    { c: [-52.3, 49.3], side: 5.0, deg: 20, eave: 19.5, tip: 24.2 },
    { c: [-55.2, 59.2], side: 4.6, deg: 20, eave: 19.5, tip: 24.0 },
  ],
  north: { c: [-59.3, 69.1], r: 2.2, eave: 15.0, tip: 19.5 },
  turret: { c: [-45.6, 34.4], r: 1.6, eave: 18.0, knee: 19.4, lantern: 20.6, tip: 23.3 },
  chimneys: [
    { c: [-50.3, 45.3], size: 1.2, top: 22.2 },
    { c: [-51.3, 56.3], size: 1.2, top: 18.5 },
    { c: [-56.8, 53.8], size: 1.2, top: 18.3 },
    { c: [-47.8, 45.8], size: 1.2, top: 18.5 },
  ],
};
// Overdekte galerijbrug van de galerij van de voorburcht naar het kasteel
// (BGT-dek, pijlers op 3,8, 8,1 en 12,2 m): goot +5 m, zadeldak met schilden
// tot +6,5 m, vier spitse doorgangen boven het water en vensters in de
// galerij (foto: een doorlopende glazen galerij op gemetselde pijlers).
const GALLERY = {
  from: [-24.6, 25.2],
  to: [-12.6, 11.9],
  width: 2.6,
  eave: 5.0,
  ridge: 6.5,
  openings: [1.9, 6.0, 10.2, 14.4],
  openingWidth: 2.4,
  spring: 1.0,
  windows: { z: [3.4, 4.5], w: 1.4, step: 2.05 },
};
// Châtelet (BAG, luchtfoto 8 cm, DSM en foto's van de brugzijde): stelsel G
// met a naar buiten langs de doorgang (oosten, de brug op) en b langs de
// voorgevel naar het noorden. Poortgebouw a -2,3..2, b -3,2..2,3; een
// schuine kraag van NAP +6,6 tot +7 m onder een borstwering die 0,3 m
// uitkraagt tot de weergang op +7,9 m (DSM +8 m) met kantelen tot +8,8 m op
// de voor- en achterkant; de spitse doorgang van 2,2 m breed (aanzet +3,6 m,
// top 60 graden) in een spitse sponning van 3 m; drie vensternissen onder de
// kraag. De ronde zuidtoren (BAG r 1,3 m) met een lijst op een kraag op
// +6,4 m en een achtkantige spits tot +12,3 m, het noordtorentje met een
// achtkantige spits tot +12,3 m (DSM +11 tot +12 m; de luchtfoto toont beide
// spitsen achtkantig).
const GT = frame([-1.8, 69.9], [0.989, 0.147]);
const CHATELET = {
  a: [-2.3, 1.6],
  b: [-3.2, 2.3],
  corbel: 7.0,
  walk: 7.9,
  merlon: { w: 0.9, depth: 0.9, h: 0.9, gap: 0.9 },
  passage: { w: 2.2, floor: 1.3, spring: 3.6 },
  frame: { w: 3.0, spring: 3.6, depth: 0.3 },
  windows: { b: [-1.1, 0, 1.1], w: 0.8, z: [5.6, 6.4] },
  south: { at: [-1.68, -4.35], r: 1.3, corbel: 6.4, eave: 9.2, tip: 12.3 },
  north: { at: [-1.9, 3.75], r: 1.35, corbel: 6.6, eave: 9.4, tip: 12.3 },
};
// Bruggen (BGT-dekken en -pijlers, luchtfoto): de brug naar het châtelet
// met het dek op +1,3 m (5,3 m breed), borstweringen van 0,9 m breed en
// 0,9 m hoog aan beide zijden en drie spitse bogen (60 graden, top +0,7 m)
// tussen de pijlers; de brug naar de oostingang, die van +2,6 m bij de deur
// afloopt naar +1,7 m op de oever, met borstweringen en een spitse boog.
const NORTH_BRIDGE = { x: [-0.6, 15.6], y: [67.6, 72.9], deck: 1.3, rail: { w: 0.9, h: 0.9 }, arches: [[3.8, 2.2], [8.0, 2.2], [12.05, 2.4]], archTop: 0.7 };
const EAST_BRIDGE = { from: [15.0, 13.8], to: [26.5, 19.9], width: 3.4, high: 2.6, low: 1.7, rail: { w: 0.9, h: 0.8 }, arch: { at: 6.5, w: 2.0, top: 1.5 } };
// Maaiveld rondom (NAP +0,7 tot +0,8 m): de voorhof, het gazon ten oosten
// en het pad ten westen van de voorburcht; niet het water van de gracht.
const GROUND_SAMPLES = [[-15, 45], [35, 28], [-70, 30]];

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
const circle = (c, r, n = 48, phase = 0) => Array.from({ length: n }, (_, k) => polar(c, r, (360 * k) / n + phase));
const square = ([cx, cy], side, deg) =>
  [45, 135, 225, 315].map((a) => polar([cx, cy], (side / 2) * Math.SQRT2, a + deg));
const cylinder = (c, r, z0, z1, n = 48) => prism(circle(c, r, n), z0, z1);
const cone = (c, r, z0, tip, n = 48) => Manifold.hull([...at(circle(c, r, n), z0), [c[0], c[1], tip]]);
const unit = ([x, y]) => {
  const l = Math.hypot(x, y);
  return [x / l, y / l];
};
const sub2 = (p, q) => [p[0] - q[0], p[1] - q[1]];
const dot2 = (p, q) => p[0] * q[0] + p[1] * q[1];
const frameRect = (F, [s0, s1], [t0, t1]) => [F.p(s0, t0), F.p(s1, t0), F.p(s1, t1), F.p(s0, t1)];
// Zijde van een gevel: richting langs de rand en de normaal naar buiten (weg
// van het punt `inside`).
const edge = (a, b, inside = CASTLE_HEART) => {
  const dir = unit(sub2(b, a));
  let n = [dir[1], -dir[0]];
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (dot2(n, sub2(mid, inside)) < 0) n = [-n[0], -n[1]];
  return { a, b, dir, n, length: Math.hypot(...sub2(b, a)), at: (u, d = 0) => [a[0] + dir[0] * u + n[0] * d, a[1] + dir[1] * u + n[1] * d] };
};
// Strook langs een rand van `inner` binnen tot `outer` buiten de gevel en van
// u0 tot u1, van z0 tot z1, met onder het uitkragende deel een schuine kraag
// van 51 graden (1,25 keer zo hoog als hij uitsteekt).
const ledgeBand = (E, u0, u1, inner, outer, z0, z1) => {
  const pts = [];
  for (const u of [u0, u1]) {
    const foot = z0 - (outer + 0.15) * KRAAG;
    pts.push([...E.at(u, -inner), foot], [...E.at(u, -0.15), foot], [...E.at(u, outer), z0]);
    pts.push([...E.at(u, -inner), z1], [...E.at(u, outer), z1]);
  }
  return Manifold.hull(pts);
};
// Ring rond een veelhoek (bijvoorbeeld een toren) die `out` uitkraagt op een
// schuine kraag, van z0 tot z1 (lokale z).
const ledgeRing = (poly, outPoly, z0, z1, out) =>
  Manifold.hull([...at(poly, z0 - out * KRAAG), ...at(outPoly, z0), ...at(outPoly, z1)]);
// Nis in een gevelvlak: profiel in het vlak (u langs de gevel, z) van
// `depth` achter tot `front` (standaard 1,5 m) voor de gevel. Met `pointed` krijgt de nis een
// spitse bovenkant: vanaf z1 tot de top onder 55 graden.
const nicheTops = new Map();
const nicheCounts = {};
const niche = (point, dir, n, w, z0, z1, { depth = NICHE_DEPTH, pointed = false, label = "nis", front = 1.5 } = {}) => {
  const half = w / 2;
  const profile = [[-half, NAP(z0)], [half, NAP(z0)], [half, NAP(z1)]];
  if (pointed) profile.push([0, NAP(z1) + half * Math.tan((55 * Math.PI) / 180)]);
  profile.push([-half, NAP(z1)]);
  const pts = [];
  for (const d of [-depth, front]) {
    for (const [u, z] of profile) pts.push([point[0] + dir[0] * u + n[0] * d, point[1] + dir[1] * u + n[1] * d, z]);
  }
  if (!pointed) {
    const key = NAP(z1).toFixed(2);
    nicheTops.set(key, (nicheTops.get(key) ?? 0) + w * (depth + 0.05));
  }
  nicheCounts[label] = (nicheCounts[label] ?? 0) + 1;
  return Manifold.hull(pts);
};
// Doorgang met een spitse bovenkant van 60 graden: breedte w, vloer z0,
// aanzet z1 (lokale z), langs de richting `dir` door een muur van dikte
// `depth` rond het punt c.
const passage = ([cx, cy], [dx, dy], w, z0, z1, depth) => {
  const rise = (w / 2) * Math.tan(Math.PI / 3);
  const profile = [[-w / 2, z0], [w / 2, z0], [w / 2, z1], [0, z1 + rise], [-w / 2, z1]];
  const pts = [];
  for (const d of [-depth / 2, depth / 2]) {
    for (const [u, z] of profile) pts.push([cx + dx * d - dy * u, cy + dy * d + dx * u, z]);
  }
  return Manifold.hull(pts);
};
// Dakkapel: voorkant in het punt p (midden onder), richting langs de voorkant
// `along`, naar buiten `out`; onderkant low, wangen tot wall, nok ridge
// (lokale z), diepte naar binnen.
const dormer = (p, along, out, w, low, wall, ridge, depth) => {
  const profile = [[-w / 2, low], [w / 2, low], [w / 2, wall], [0, ridge], [-w / 2, wall]];
  const pts = [];
  for (const d of [0, -depth]) {
    for (const [u, z] of profile) pts.push([p[0] + along[0] * u + out[0] * d, p[1] + along[1] * u + out[1] * d, z]);
  }
  return Manifold.hull(pts);
};
const castlePrism = prism(CASTLE_OUTLINE, BASE - 1, 200);
const wingByName = Object.fromEntries(WINGS.map((W) => [W.name, W]));
const towerByName = Object.fromEntries(ROUND_TOWERS.map((T) => [T.name, T]));
// Dakhoogte (NAP) van een vleugel op afstand t in zijn stelsel.
const wingZ = (W, t) => W.top - (t < W.ridgeT ? W.slopeA : W.slopeB) * Math.abs(t - W.ridgeT);
// Zadeldak als gesloten blok tot de onderkant.
const saddle = (W) => {
  const { F } = W;
  const apex = NAP(W.top);
  const wa = (apex - BASE) / W.slopeA;
  const wb = (apex - BASE) / W.slopeB;
  const wh = (apex - BASE) / (W.hipSlope ?? Math.max(W.slopeA, W.slopeB));
  const [s0, s1] = W.ridgeS;
  const e0 = W.hip[0] ? s0 - wh : s0 - 80;
  const e1 = W.hip[1] ? s1 + wh : s1 + 80;
  const r0 = W.hip[0] ? s0 : e0;
  const r1 = W.hip[1] ? s1 : e1;
  return Manifold.hull([
    [...F.p(r0, W.ridgeT), apex], [...F.p(r1, W.ridgeT), apex],
    [...F.p(e0, W.ridgeT - wa), BASE], [...F.p(e0, W.ridgeT + wb), BASE],
    [...F.p(e1, W.ridgeT - wa), BASE], [...F.p(e1, W.ridgeT + wb), BASE],
  ]);
};
const towerCut = Manifold.union(ROUND_TOWERS.map((T) => cylinder(T.c, T.r + GALLERY_OUT, BASE - 2, 201)));

// ---------- kasteel: vleugels en daken ----------
const wingParts = WINGS.map((W) =>
  Manifold.intersection(saddle(W), prism(frameRect(W.F, W.s, W.t), BASE, 200)).intersect(castlePrism).subtract(towerCut),
);
// Trapgevels: treden symmetrisch rond de nok, elke trede 0,45 m boven het
// dak aan haar binnenkant, een kroon op de nok.
const stepGables = STEP_GABLES.map((G) => {
  const W = wingByName[G.wing];
  const parts = [];
  const halfMax = Math.max(W.ridgeT - W.t[0], W.t[1] - W.ridgeT);
  const width = (halfMax - STEP.crown) / STEP.count;
  for (let i = 0; i < STEP.count; i++) {
    const outer = halfMax - i * width;
    const inner = outer - width;
    const d = Math.max(inner, STEP.crown);
    const top = Math.max(wingZ(W, W.ridgeT - d), wingZ(W, W.ridgeT + d)) + STEP.above;
    parts.push(prism(frameRect(W.F, G.s, [W.ridgeT - outer, W.ridgeT + outer]), BASE, NAP(top)));
  }
  parts.push(prism(frameRect(W.F, G.s, [W.ridgeT - STEP.crown, W.ridgeT + STEP.crown]), BASE, NAP(G.crown)));
  G.steps = parts.length;
  return Manifold.union(parts).intersect(prism(frameRect(W.F, [-80, 80], W.t), BASE, 200)).intersect(castlePrism).subtract(towerCut);
});
// Topgevel boven de zuidgevel: een getrapte dakkapel in het gevelvlak.
const wallDormer = (() => {
  const D = WALL_DORMER;
  const W = wingByName.zuidvleugel;
  const parts = [];
  const steps = [[D.w / 2, wingZ(W, 0.3) + 1.6], [D.w / 2 - 0.55, wingZ(W, 0.3) + 3.2], [D.w / 2 - 1.1, D.crown]];
  for (const [half, top] of steps) parts.push(prism(frameRect(ZW, [D.s - half, D.s + half], [0, D.depth]), BASE, NAP(top)));
  return Manifold.union(parts).intersect(castlePrism);
})();
// Dakkapellen.
const dormerParts = [];
const dormerCounts = {};
for (const D of DORMERS) {
  const W = wingByName[D.wing];
  const outT = [W.F.bx[0] * D.n, W.F.bx[1] * D.n];
  for (const s of D.s) {
    const p = W.F.p(s, D.t);
    const low = NAP(wingZ(W, D.t)) - 0.05;
    dormerParts.push(dormer(p, W.F.ax, outT, D.w, low, low + D.wall, low + D.wall + D.ridge, D.depth));
  }
  dormerCounts[D.wing] = D.s.length;
}
const chimneys = CHIMNEYS.map((C) => prism(square(C.c, C.size, -25), BASE, NAP(C.top)).intersect(castlePrism));

// ---------- kasteel: torens ----------
const cutters = [];
const outward = (c) => (Math.atan2(c[1] - CASTLE_HEART[1], c[0] - CASTLE_HEART[0]) * 180) / Math.PI;
const roundTower = (T) => {
  const R = T.r + GALLERY_OUT;
  // Weergang: een borstwering van 1 m breed op een schuine kraag rond een
  // open loop (de diepe ring in het DSM), met daarbinnen de kern en de
  // steile spits.
  const body = Manifold.union([
    cylinder(T.c, T.r, BASE, NAP(T.corbel) + 0.01),
    ledgeRing(circle(T.c, T.r), circle(T.c, R), NAP(T.corbel), NAP(T.parapet), GALLERY_OUT),
  ]).subtract(cylinder(T.c, R - WALL_PARAPET, NAP(T.floor), NAP(T.parapet) + 1));
  const parts = [
    body,
    cylinder(T.c, T.core, NAP(T.floor) - 0.01, NAP(T.coreTop) + 0.01),
    cone(T.c, T.core, NAP(T.coreTop), NAP(T.tip)),
  ];
  // Dakkapelletjes op de spits, net boven de kern.
  const slope = (T.tip - T.coreTop) / T.core;
  for (let k = 0; k < T.lucarnes; k++) {
    const deg = outward(T.c) + 45 + (360 * k) / T.lucarnes;
    const n = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
    const rf = T.core - 0.35;
    const low = NAP(T.coreTop + (T.core - Math.hypot(rf, 0.5)) * slope) - 0.05;
    parts.push(dormer(polar(T.c, rf, deg), [-n[1], n[0]], n, 1.0, low, low + 1.2, low + 1.8, 1.4));
  }
  // Vensters in de romp en nissen in de borstwering.
  const out = outward(T.c);
  for (const [z0, z1] of T.rows) {
    for (const d of TOWER_DIRS) {
      const deg = out + d;
      const n = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
      cutters.push(niche(polar(T.c, T.r, deg), [-n[1], n[0]], n, 0.9, z0, z1, { label: `toren ${T.name}` }));
    }
  }
  const mid = (T.corbel + T.parapet) / 2;
  for (let k = 0; k < T.gallery; k++) {
    const deg = out + (360 * k) / T.gallery;
    const n = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
    cutters.push(niche(polar(T.c, R, deg), [-n[1], n[0]], n, 0.9, mid - 0.4, mid + 0.4, { depth: 0.3, front: 0.1, label: `weergang ${T.name}` }));
  }
  return Manifold.union(parts);
};
// Vierkante toren met een lijst op een schuine kraag en een tentdak.
const squareTower = (t) => {
  const inner = square(t.c, t.side, t.deg);
  const outer = square(t.c, t.side + 2 * LEDGE, t.deg);
  return Manifold.union([
    prism(inner, BASE, NAP(t.eave - 1.0) + 0.01),
    ledgeRing(inner, outer, NAP(t.eave - 1.0), NAP(t.eave), LEDGE),
    Manifold.hull([...at(outer, NAP(t.eave) - 0.01), [t.c[0], t.c[1], NAP(t.tip)]]),
  ]);
};
const turret = (T) =>
  Manifold.union([
    cylinder(T.c, T.r, BASE, NAP(T.eave) + 0.01, T.n),
    cone(T.c, T.r, NAP(T.eave), NAP(T.tip), T.n),
  ]);

// ---------- kasteel: gevels ----------
const facadeParts = [];
for (const Fc of FACADES) {
  const E = edge(Fc.a, Fc.b);
  Fc.edge = E;
  // De kroonlijst loopt tot 0,1 m van de torens en de vierkante torens.
  let band = ledgeBand(E, 0, E.length, 0.6, LEDGE, NAP(Fc.eave - 0.9), NAP(Fc.eave)).subtract(towerCut);
  for (const [u0, u1] of Fc.skip) band = band.subtract(prism([E.at(u0, -2), E.at(u1, -2), E.at(u1, 2), E.at(u0, 2)], BASE, 200));
  facadeParts.push(band);
  for (const row of Fc.windows.rows) {
    for (const u of Fc.windows.u) {
      if (Fc.skip.some(([u0, u1]) => u > u0 - 0.6 && u < u1 + 0.6)) continue;
      cutters.push(niche(E.at(u), E.dir, E.n, 1.0, row[0], row[1], { label: Fc.name }));
    }
  }
}
const plinth = Manifold.extrude(new CrossSection([ccw(CASTLE_OUTLINE)]).offset(PLINTH.out, "Miter", 2), NAP(PLINTH.top) - BASE).translate([0, 0, BASE]);

const castle = Manifold.union([
  prism(CASTLE_OUTLINE, BASE, NAP(CASTLE_WALL)),
  plinth,
  ...wingParts,
  ...stepGables,
  wallDormer,
  ...dormerParts,
  ...chimneys,
  ...ROUND_TOWERS.map(roundTower),
  ...SQUARE_TOWERS.map(squareTower),
  ...TURRETS.map(turret),
  ...facadeParts,
]).subtract(Manifold.union(cutters));

// ---------- voorburcht met galerijbrug ----------
// Afstand van een punt tot de rand van een veelhoek.
const edgeDistance = (pts, [x, y]) => {
  let best = Infinity;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    const dx = x1 - x0;
    const dy = y1 - y0;
    const t = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / (dx * dx + dy * dy)));
    best = Math.min(best, Math.hypot(x - x0 - t * dx, y - y0 - t * dy));
  });
  return best;
};
// Gesloten blok boven de bbox van een contour met een dak z = top(x, y, d)
// (d = afstand tot de gevel), op een raster van 0,5 m, afgesneden op de
// contour.
function roofBlock(outline, top, bottom, step = 0.5) {
  const xs = outline.map(([x]) => x);
  const ys = outline.map(([, y]) => y);
  const x0 = Math.floor(Math.min(...xs)) - 1;
  const y0 = Math.floor(Math.min(...ys)) - 1;
  const nx = Math.ceil((Math.max(...xs) + 1 - x0) / step) + 1;
  const ny = Math.ceil((Math.max(...ys) + 1 - y0) / step) + 1;
  const pos = [];
  const tri = [];
  const id = (i, j) => j * nx + i;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const p = [x0 + i * step, y0 + j * step];
      pos.push(p[0], p[1], top(p[0], p[1], edgeDistance(outline, p)));
    }
  }
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      tri.push(id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j), id(i + 1, j + 1), id(i, j + 1));
    }
  }
  const ring = [];
  for (let i = 0; i < nx - 1; i++) ring.push(id(i, 0));
  for (let j = 0; j < ny - 1; j++) ring.push(id(nx - 1, j));
  for (let i = nx - 1; i > 0; i--) ring.push(id(i, ny - 1));
  for (let j = ny - 1; j > 0; j--) ring.push(id(0, j));
  const base = pos.length / 3;
  for (const k of ring) pos.push(pos[k * 3], pos[k * 3 + 1], bottom);
  const centre = pos.length / 3;
  pos.push(x0 + ((nx - 1) * step) / 2, y0 + ((ny - 1) * step) / 2, bottom);
  for (let k = 0; k < ring.length; k++) {
    const a = ring[k];
    const b = ring[(k + 1) % ring.length];
    const ab = base + k;
    const bb = base + ((k + 1) % ring.length);
    tri.push(a, ab, bb, a, bb, b, centre, bb, ab);
  }
  const block = new Manifold(
    new Mesh({ numProp: 3, vertProperties: new Float32Array(pos), triVerts: new Uint32Array(tri) }),
  );
  return Manifold.intersection(block, prism(outline, bottom - 1, 200));
}
const voorRoof = (x, y, d) => {
  const [px, py] = [x - VOOR_FRAME.p0[0], y - VOOR_FRAME.p0[1]];
  const [ux, uy] = VOOR_FRAME.u;
  const u = px * ux + py * uy;
  const v = px * uy - py * ux;
  const r = VOOR_ROOF.find((rule) => rule.when(u, v));
  if (r.flat) return NAP(Math.min(r.eave + r.slope * d, r.flat));
  return NAP(r.ridge - (v < r.ridgeV ? r.west : r.east) * Math.abs(v - r.ridgeV));
};
const gallery = (() => {
  const G = GALLERY;
  const E = edge(G.from, G.to, [-30, 10]);
  const [ux, uy] = E.dir;
  const h = G.width / 2;
  const [x0, y0] = G.from;
  const [x1, y1] = G.to;
  const rect = [
    [x0 - uy * h, y0 + ux * h],
    [x1 - uy * h, y1 + ux * h],
    [x1 + uy * h, y1 - ux * h],
    [x0 + uy * h, y0 - ux * h],
  ];
  const body = prism(rect, BASE, NAP(G.eave) + 0.01);
  // Zadeldak met schilden: nok over het middelste deel.
  const rise = NAP(G.ridge) - NAP(G.eave);
  const roof = Manifold.hull([
    ...at(rect, NAP(G.eave)),
    [x0 + ux * rise, y0 + uy * rise, NAP(G.ridge)],
    [x1 - ux * rise, y1 - uy * rise, NAP(G.ridge)],
  ]);
  // Doorgangen dwars door de brug, tussen de pijlers.
  const holes = G.openings.map((s) =>
    passage([x0 + ux * s, y0 + uy * s], [-uy, ux], G.openingWidth, NAP(-1.5 - 1), NAP(G.spring), G.width + 2),
  );
  // Vensters van de galerij aan beide zijden.
  const windows = [];
  for (const side of [-1, 1]) {
    const n = [-uy * side, ux * side];
    for (let s = 1.2; s < E.length - 1.0; s += G.windows.step) {
      const p = [x0 + ux * s + n[0] * h, y0 + uy * s + n[1] * h];
      windows.push(niche(p, E.dir, n, G.windows.w, G.windows.z[0], G.windows.z[1], { depth: 0.3, label: "galerijbrug" }));
    }
  }
  return Manifold.union([body, roof]).subtract(Manifold.union([...holes, ...windows]));
})();
const V = VOOR;
const voorPrism = prism(VOOR_OUTLINE, BASE - 1, 200);
const voorTurret = (() => {
  const T = V.turret;
  return Manifold.union([
    cylinder(T.c, T.r, BASE, NAP(T.eave) + 0.01, 8),
    // Geknikte spits met een lantaarn: een flauwe voet tot 0,95 m straal,
    // de lantaarn tot +20,6 m en daarboven de naald.
    Manifold.hull([...at(circle(T.c, T.r, 8), NAP(T.eave)), ...at(circle(T.c, 0.95, 8), NAP(T.knee))]),
    cylinder(T.c, 0.95, NAP(T.knee) - 0.01, NAP(T.lantern) + 0.01, 8),
    cone(T.c, 0.95, NAP(T.lantern), NAP(T.tip), 8),
  ]);
})();
const voorburcht = Manifold.union([
  roofBlock(VOOR_OUTLINE, voorRoof, BASE),
  // Ronde zuidtoren: rand op een schuine kraag onder de spits.
  cylinder(V.south.c, V.south.r, BASE, NAP(V.south.corbel) + 0.01, 48),
  ledgeRing(circle(V.south.c, V.south.r), circle(V.south.c, V.south.r + LEDGE + 0.05), NAP(V.south.corbel), NAP(V.south.eave), LEDGE + 0.05),
  cone(V.south.c, V.south.r + LEDGE + 0.05, NAP(V.south.eave) - 0.01, NAP(V.south.tip), 48),
  ...V.squares.map(squareTower),
  cylinder(V.north.c, V.north.r, BASE, NAP(V.north.eave), 24),
  cone(V.north.c, V.north.r, NAP(V.north.eave) - 0.01, NAP(V.north.tip), 24),
  voorTurret,
  ...V.chimneys.map((C) => prism(square(C.c, C.size, 20), BASE, NAP(C.top)).intersect(voorPrism)),
  gallery,
]);

// ---------- châtelet ----------
const C = CHATELET;
const chatelet = (() => {
  const parts = [prism(frameRect(GT, C.a, C.b), BASE, NAP(C.corbel) + 0.01)];
  // Borstwering op een schuine kraag, 0,3 m uitkragend tot de weergang.
  const inner = frameRect(GT, C.a, C.b);
  const outerA = [C.a[0] - LEDGE, C.a[1] + LEDGE];
  const outerB = [C.b[0] - LEDGE, C.b[1] + LEDGE];
  parts.push(ledgeRing(inner, frameRect(GT, outerA, outerB), NAP(C.corbel), NAP(C.walk), LEDGE));
  // Kantelen op de voor- en achterkant: drie per kant van 0,9 m breed, met
  // de tussenruimte (minstens 0,9 m) zo dat ze de hele kant vullen.
  // Aan de achterkant eindigt de rij voor het noordtorentje.
  const M = C.merlon;
  C.merlonCount = 0;
  C.merlonGap = Infinity;
  for (const [a, span] of [[outerA[1] - M.depth, [C.b[0] - LEDGE + 1.0, C.b[1] + LEDGE]], [outerA[0], [C.b[0] - LEDGE + 1.0, 2.05]]]) {
    const count = Math.floor((span[1] - span[0] + M.gap) / (M.w + M.gap));
    const gap = (span[1] - span[0] - count * M.w) / (count - 1);
    for (let k = 0; k < count; k++) {
      const b0 = span[0] + k * (M.w + gap);
      parts.push(prism(frameRect(GT, [a, a + M.depth], [b0, b0 + M.w]), NAP(C.walk) - 0.01, NAP(C.walk + M.h)));
    }
    C.merlonCount += count;
    C.merlonGap = Math.min(C.merlonGap, gap);
  }
  // Ronde zuidtoren met een lijst op een kraag en een achtkantige spits.
  for (const T of [C.south, C.north]) {
    const c = GT.p(...T.at);
    const R = T.r + LEDGE;
    parts.push(cylinder(c, T.r, BASE, NAP(T.corbel) + 0.01, 24));
    parts.push(ledgeRing(circle(c, T.r, 24), circle(c, R, 24), NAP(T.corbel), NAP(T.eave), LEDGE));
    parts.push(cone(c, R, NAP(T.eave) - 0.01, NAP(T.tip), 8));
    T.centre = c;
  }
  const solid = Manifold.union(parts);
  const cuts = [];
  // Spitse doorgang langs a, in een spitse sponning in de voorgevel.
  const P = C.passage;
  cuts.push(passage(GT.p(0, 0), GT.ax, P.w, NAP(P.floor), NAP(P.spring), 12));
  const front = (b) => GT.p(C.a[1], b);
  cuts.push(niche(front(0), GT.bx, GT.ax, C.frame.w, P.floor, C.frame.spring, { depth: C.frame.depth, pointed: true, label: "châtelet" }));
  for (const b of C.windows.b) cuts.push(niche(front(b), GT.bx, GT.ax, C.windows.w, C.windows.z[0], C.windows.z[1], { depth: 0.3, label: "châtelet" }));
  // Vensters in de zuidtoren, naar de brug en naar het zuiden.
  for (const deg of [-60, 0]) {
    const base = (Math.atan2(GT.ax[1], GT.ax[0]) * 180) / Math.PI + deg;
    const n = [Math.cos((base * Math.PI) / 180), Math.sin((base * Math.PI) / 180)];
    for (const [z0, z1] of [[2.6, 3.8], [4.8, 5.8]]) cuts.push(niche(polar(C.south.centre, C.south.r, base), [-n[1], n[0]], n, 0.9, z0, z1, { depth: 0.3, label: "châtelet" }));
  }
  return solid.subtract(Manifold.union(cuts));
})();

// ---------- bruggen ----------
const northBridge = (() => {
  const B = NORTH_BRIDGE;
  const [x0, x1] = B.x;
  const [y0, y1] = B.y;
  const R = B.rail;
  const parts = [
    prism([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], BASE, NAP(B.deck)),
    // Borstweringen; aan de poortkant beginnen ze bij de voorgevel.
    prism([[0.4, y0], [x1, y0], [x1, y0 + R.w], [0.4, y0 + R.w]], BASE, NAP(B.deck + R.h)),
    prism([[0.0, y1 - R.w], [x1, y1 - R.w], [x1, y1], [0.0, y1]], BASE, NAP(B.deck + R.h)),
  ];
  const arches = B.arches.map(([x, w]) => {
    const rise = (w / 2) * Math.tan(Math.PI / 3);
    return passage([x, (y0 + y1) / 2], [0, 1], w, BASE - 1, NAP(B.archTop) - rise, y1 - y0 + 2);
  });
  return Manifold.union(parts).subtract(Manifold.union(arches));
})();
const eastBridge = (() => {
  const E = EAST_BRIDGE;
  const d = [E.to[0] - E.from[0], E.to[1] - E.from[1]];
  const len = Math.hypot(...d);
  const [ux, uy] = [d[0] / len, d[1] / len];
  const deckAt = (s) => E.high + ((E.low - E.high) * s) / len;
  // Dek (en borstweringen) als functie van de dwarspositie: van -h tot h.
  const slab = (w0, w1, extra) =>
    Manifold.hull(
      [0, len].flatMap((s) => {
        const p = [E.from[0] + ux * s, E.from[1] + uy * s];
        return [w0, w1].flatMap((w) => [
          [p[0] - uy * w, p[1] + ux * w, BASE],
          [p[0] - uy * w, p[1] + ux * w, NAP(deckAt(s) + extra)],
        ]);
      }),
    );
  const h = E.width / 2;
  const R = E.rail;
  const body = Manifold.union([slab(-h, h, 0), slab(-h, -h + R.w, R.h), slab(h - R.w, h, R.h)]);
  const A = E.arch;
  const rise = (A.w / 2) * Math.tan(Math.PI / 3);
  const p = [E.from[0] + ux * A.at, E.from[1] + uy * A.at];
  return body.subtract(passage(p, [-uy, ux], A.w, BASE - 1, NAP(A.top) - rise, E.width + 2));
})();
const bridges = Manifold.union([northBridge, eastBridge]);

const nodes = [
  ["building:kasteel", castle],
  ["building:voorburcht", voorburcht],
  ["building:chatelet", chatelet],
  ["road:bruggen", bridges],
];
const all = Manifold.union(nodes.map(([, solid]) => solid));
console.log("nissen:", nicheCounts, "dakkapellen:", dormerCounts, "kantelen châtelet:", C.merlonCount, "tussenruimte", +C.merlonGap.toFixed(2));

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
const underside = {};
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
    underside[name] = +total.toFixed(2);
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
    undersideM2: underside[name],
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "kasteel-de-haar.glb");
const glb = toGlb(nodes, "NederPrint generate-kasteel-de-haar.mjs (manifold-3d)");
await writeFile(glbFile, glb);
report.glb = { file: glbFile, bytes: glb.length, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `kasteel-de-haar-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Kasteel De Haar Haarzuilens 1:${scale} mm Z-up`);
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
  path.join(outDir, "kasteel-de-haar.json"),
  JSON.stringify(
    {
      name: "Kasteel De Haar",
      file: "kasteel-de-haar.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +0,7 tot +0,8 m): de voorhof, het gazon
      // ten oosten van het kasteel en het pad ten westen van de voorburcht;
      // niet het water van de slotgracht.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: [
        "NL.IMBAG.Pand.0344100000022989",
        "NL.IMBAG.Pand.0344100000037638",
        "NL.IMBAG.Pand.0344100000100346",
        "NL.IMBAG.Pand.0344100000104054",
        "NL.IMBAG.Pand.0344100000104055",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (127540, 459320), midden in het kasteel, op het maaiveld van de voorhof (NAP +0,8 m), +X naar het oosten en +Y naar het noorden. Vier nodes: building:kasteel met een plint rondom en de vleugels onder eigen zadeldaken die elkaar in kilgoten raken (de zuidvleugel, nok +24,6 m, met een trapgevel aan de oostkant, een getrapte topgevel boven de zuidgevel en zeven dakkapellen; de oostvleugel, +24,3 m; het dak over de overdekte binnenplaats, +23,2 m met een schild; de westvleugel, +24,6 m met een trapgevel aan de noordkant; de vleugel langs de westgevel, +22,5 m; de noordwestvleugel langs de voorhof, +24 en +22 m), dakkapellen en schoorstenen, kroonlijsten op een schuine kraag en vensternissen in de zuid-, oost- en noordwestgevel, de drie ronde hoektorens met een borstwering met nissen op een schuine kraag rond een open weergang en een steile kegelspits op een kern (noord tot +40,3 m met vier dakkapelletjes, zuidoost +33,8 m, zuidwest +31,5 m), vier vierkante torens met een lijst op een kraag onder het tentdak (+27,3 tot +32,3 m), twee slanke traptorens met spits (+26,8 en +28,3 m) en een achtkantig torentje tegen de zuidgevel; building:voorburcht, de lange vleugel ten westen van het kasteel (daken naar het AHN, nok +15,5 m, tussen de vierkante torens +20 m) met de galerij langs de voorhof, de ronde zuidtoren met een rand op een kraag en een spits tot +21,6 m, twee vierkante torens met een lijst onder het tentdak tot +24,2 m, een rond noordtorentje, een traptorentje met een geknikte spits en lantaarn tot +23,3 m, schoorstenen, en de overdekte galerijbrug naar het kasteel met een zadeldak, vensternissen en vier spitse doorgangen boven het water; building:chatelet, de toegangspoort 70 m ten noorden van het kasteel: het poortgebouw met een spitse doorgang in een spitse sponning, drie vensternissen, een borstwering op een schuine kraag met zes kantelen tot +8,7 m, een ronde zuidtoren en een noordtorentje met een lijst op een kraag en achtkantige spitsen tot +12,3 m; road:bruggen, de brug naar het châtelet (dek +1,3 m) met borstweringen en drie spitse bogen, en de brug naar de oostingang met borstweringen en een spitse boog. Alle onderdelen beginnen op NAP -1,5 m, onder het water van de slotgracht, die in het PDOK-terrein zit. Alles staat recht op, loopt schuin omhoog of rust op een kraag van 51 graden; alleen de vensternissen hebben een vlakke bovenkant van 0,3 tot 0,35 m diep, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructies van de BAG-panden van het kasteel, de voorburcht en het châtelet; de kapel blijft PDOK. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`kasteel-de-haar-1-${scale}.stl`],
      realWorld: {
        lengthEastWestM: +(bb.max[0] - bb.min[0]).toFixed(2),
        lengthNorthSouthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        southWingRidgeNapM: wingByName.zuidvleugel.top,
        eastWingRidgeNapM: wingByName.oostvleugel.top,
        hallRidgeNapM: wingByName.binnenplaats.top,
        westWingRidgeNapM: wingByName.westvleugel.top,
        northWestWingRidgeNapM: wingByName.noordwestvleugel.top,
        stepGableCrownNapM: STEP_GABLES.map((G) => G.crown),
        northTowerWalkNapM: ROUND_TOWERS[0].parapet,
        northTowerTipNapM: ROUND_TOWERS[0].tip,
        southEastTowerTipNapM: ROUND_TOWERS[1].tip,
        southWestTowerTipNapM: ROUND_TOWERS[2].tip,
        voorburchtSouthTowerTipNapM: VOOR.south.tip,
        chateletWalkNapM: CHATELET.walk,
        chateletMerlonTopNapM: CHATELET.walk + CHATELET.merlon.h,
        chateletTipNapM: CHATELET.north.tip,
        northBridgeDeckNapM: NORTH_BRIDGE.deck,
        groundNapM: GROUND_NAP,
        baseNapM: -1.5,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Kasteel_de_Haar",
        "https://monumentenregister.cultureelerfgoed.nl/complexen/527891",
        "PDOK BAG panden 0344100000022989 (kasteel), 0344100000037638 (voorburcht), 0344100000100346, 0344100000104054 en 0344100000104055 (châtelet), EPSG:28992",
        "PDOK BGT overbruggingsdeel en waterdeel: dekken en pijlers van de galerijbrug, de oostbrug en de brug naar het châtelet",
        "PDOK AHN DSM/DTM 0,5 m via WCS, als raster per 0,5 m in het stelsel van elke vleugel: nokken, kilgoten en goten per vleugel, trapgevels, schoorstenen, dakkapellen, de omhullende van de torens per straal, het châtelet en het maaiveld",
        "Wikimedia Commons: Kasteel de Haar. Luchtfoto 1 tot 8.jpg; De Haar Castle Drone.jpg; De Haar Castle South in the Netherlands.jpg; De Haar Castle in the Netherlands.jpg (met het châtelet en de brug); Overzicht van het kasteel en chatelet - Haarzuilens - 20314106 - RCE.jpg; Kasteel de Haar Châtelet rear view.jpg (de voorburcht vanaf de voorhof); Kasteel de Haar - Châtelet tower.jpg (galerijbrug); Kasteel de Haar - Châtelet corner view.jpg (noordtoren)",
        "PDOK luchtfoto 8 cm (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

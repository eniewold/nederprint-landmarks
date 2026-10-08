// Genereert een vereenvoudigd, gesloten 3D-model van Slot Loevestein bij
// Poederoijen: het compacte zaaltorenkasteel (1357-1397) in zijn eigen
// binnengracht midden in de vesting, met de zaalbouw van 11 bij 34 m onder
// een zadeldak met een rechte topgevel, dakkapellen en schoorstenen, de
// vierkante Riddertoren aan de noordoostkant met een tentdak met knik en vier
// dakkapellen op de hoekkepers, de Keukentoren aan de zuidwestkant met een
// knik en daarboven een achtkantige spits met hoekschilden, de poorttoren aan
// de zuidoostkant met zadeldak, twee topgevels, een dakruiter en een spitse
// poortdoorgang naar de kleine binnenplaats, de aanbouw aan de
// noordwestgevel met een eigen topgevel, vensters als blinde nissen in de
// buitengevels, en de twee bruggen over de binnengracht (naar de voorburcht
// in het zuidoosten en naar het pad in het noordwesten). Kantelen,
// weergangen en hoektorentjes heeft het slot niet. De wallen, de bastions, de
// grachten en de andere gebouwen van de vesting zitten in het PDOK-terrein en
// de PDOK-gebouwen en niet in het model. Alle maten in het script zijn meters
// op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node per
// onderdeel met de materiaalklasse in de nodenaam) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-slot-loevestein.mjs              # 1:1000 (standaard)
//   node scripts/generate-slot-loevestein.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: de muren staan recht op, alle dakvlakken
// lopen schuin omhoog (hoekschilden 21 tot 46 graden, dakvoeten 38 tot 49,
// dakkapellen en dwarskap 45, daken 54 tot 64 graden), alle bouwdelen zijn
// minstens 0,9 m breed (schoorstenen en dakkapellen 0,9 tot 1,5 m) en de
// poortdoorgang en de poortnis hebben een spitse bovenkant van 60 graden.
// Schoorstenen, dakkapellen en de dakruiter lopen door tot in de massa
// eronder, zodat ze geen ondervlak hebben. Alleen de tentdaken van de twee
// torens kragen 0,3 m vlak uit (de dakgoot) en de vensternissen hebben een
// vlakke bovenkant van 0,35 m diep; de controle onderaan staat geen andere
// ondervlakken toe. De dakgoten laten de export het slot als gesloten solid
// opvullen.
//
// Assenstelsel: oorsprong op RD (129774, 425374), midden in het slot, op het
// maaiveld van de vesting (NAP +3,8 m), Z omhoog. +X loopt langs de
// zaalbouw naar het noordoosten (49,95 graden linksom vanaf het oosten, de
// richting van de BAG-gevels), +Y naar het noordwesten. De Riddertoren staat
// aan de +X-kant, de Keukentoren aan de -X-kant, de poorttoren met de brug
// naar de voorburcht aan de -Y-kant.
//
// Bronnen: BAG-pand 0297100000000371 (contour); BGT overbruggingsdeel (de
// twee bruggen); AHN DSM/DTM 0,5 m (PDOK WCS, als raster per 0,5 m in het
// lokale stelsel bekeken): de nok en de goten van de zaalbouw, de toppen,
// goten en knik van de torendaken, de dwarskap bij de Keukentoren, de daken
// van de poorttoren en de aanbouw, de schoorstenen, de binnenplaats, de
// brugdekken en het maaiveld; Wikipedia (zaalbouw 11 bij 34 m, U-vorm met
// Riddertoren, Keukentoren en poorttoren) en het Rijksmonumentenregister
// (10081); foto's op Wikimedia Commons van alle kanten (10081 slot
// loevestein (2) en (3), 2024-08-14 Slot Loevestein ZvD 31 tot 58, panoramio
// 22): dakvormen, topgevels, dakkapellen, schoorstenen, dakruiter en
// vensters; PDOK luchtfoto 8 cm (graten van de torendaken, dakkapellen,
// schoorstenen, nok van de poorttoren).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "slot-loevestein");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 3,8 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [129774, 425374];
// 49,95 graden linksom vanaf het oosten: de richting van de BAG-gevels.
const X_AXIS = [0.6435, 0.7655];
const GROUND_NAP = 3.8;
const NAP = (h) => h - GROUND_NAP;
// Alle onderdelen beginnen op NAP 0 m, onder het water van de binnengracht
// (de oevers lopen in het AHN af tot circa NAP +1 m), zodat de gevels uit
// het water rijzen.
const BASE = NAP(0);
// Rechthoek [x0, x1] x [y0, y1] in het lokale stelsel.
const rect = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
// Zaalbouw (BAG: 32,6 m van de zuidwestgevel tot de Riddertoren, 11,3 m
// diep) met een zadeldak langs X: nok op NAP +29,8 m op y = 5,75 (AHN-DSM
// 29,6 tot 29,8 m) en een helling van 1,4 (54 graden), zodat de goten op
// NAP +21,3 m (binnenplaats) en +22,5 m (noordwestgevel) liggen (AHN 22,4 m).
// Aan de zuidwestkant een rechte topgevel (foto's), aan de noordoostkant een
// schild tegen de Riddertoren (AHN en luchtfoto).
const HALL = { foot: rect(-16.6, 16.0, -0.3, 11.0), ridgeY: 5.75, ridgeX: [-16.6, 12.5], top: 29.8, slope: 1.4 };
// Topgevels (zaalbouw zuidwest, poorttoren voor en achter, aanbouw): de
// gevelmuur van 0,6 m dik steekt met zijn afdekking 0,4 m boven het dakvlak
// uit (foto's: rechte topgevels met een stenen afdekking, geen trappen).
const COPING = 0.4;
const GABLE_WALL = 0.6;
// Vierkante torens met een tentdak met een knik (AHN-DSM per 0,5 m: de
// onderste 1,2 tot 1,5 m van het dak loopt onder circa 43 graden op, daarboven
// onder 61 tot 64 graden; foto's: de opgewipte dakvoet). De goot ligt op
// NAP +26 m met een overstek van 0,3 m aan de vrije zijden (niet boven het dak
// van de zaalbouw): overhang per zijde [-X, +X, -Y, +Y].
// - Keukentoren 10 bij 10,5 m: boven de knik een achtkantige spits met
//   driehoekige hoekschilden (luchtfoto: acht graten; foto vanuit het
//   zuidwesten: het smalle middenvlak boven de knik), top NAP +35 m.
// - Riddertoren 12,4 bij 13,4 m: vierkant tentdak tot NAP +36,75 m.
const EAVE = 0.3;
const TOWERS = [
  {
    name: "keukentoren",
    foot: [-16.6, -6.6, -9.0, 1.5],
    eave: 26.0,
    knee: { inset: 1.2, z: 27.4 },
    octagon: true,
    tip: 35.0,
    overhang: [EAVE, EAVE, EAVE, 0],
  },
  {
    name: "riddertoren",
    foot: [8.4, 20.8, -10.5, 2.9],
    eave: 26.0,
    knee: { inset: 1.5, z: 27.4 },
    octagon: false,
    tip: 36.75,
    overhang: [0, EAVE, EAVE, 0],
  },
];
// Dwarskap tussen de Keukentoren en de zaalbouw (AHN-DSM: horizontale nok op
// NAP +28,2 tot +28,4 m boven x = -11,6 van de noordgevel van de toren tot in
// het dakvlak van de zaalbouw, flanken onder 45 graden; luchtfoto: de
// driehoek tussen toren en zaaldak).
const CROSS_ROOF = { x: -11.6, top: 28.3, slope: 1.0, clip: rect(-16.6, -6.6, 1.5, 5.75) };
// Poorttoren aan de zuidoostkant (AHN-DSM 8,8 m breed): zadeldak langs Y
// met de nok boven x = 2 (luchtfoto: de lichte nok tussen het beschenen
// westvlak en het donkere oostvlak) op NAP +28,4 m (hoogste DSM-waarden 28,2
// tot 28,5 m), helling 1,45 (55 graden), goten op NAP +21,9 en +22,2 m (AHN
// 22 m), topgevels voor en achter (foto's 2024). Het AHN toont het oostvlak
// als vlak op NAP +27,2 m; de foto's van 2024 tonen daar een gewoon dakvlak
// met twee schoorstenen aan de achterkant. Spitse doorgang van 2,4 m breed
// van het brugdek naar de binnenplaats, aanzet NAP +7,5 m, in een spitse
// nis van 3,6 m (de sponning van de ophaalbrug, foto's).
const GATE = { foot: rect(-2.5, 6.3, -16.6, -6.0), ridgeX: 2.0, top: 28.4, slope: 1.45 };
const PASSAGE = { x: 1.9, w: 2.4, floor: 4.4, spring: 7.5 };
const PORTAL = { x: 1.9, w: 3.6, floor: 4.4, top: 10.5, depth: 0.35 };
// Lage delen rond de binnenplaats: de muur met galerij tussen de
// Keukentoren en de poorttoren (AHN-DSM 15 tot 22 m) en de aansluiting van
// de poorttoren op de Riddertoren (AHN 26 m, plat; ten oosten van de
// poorttoren).
const LINKS = [
  { foot: rect(-6.6, 8.4, -9.0, -0.3), top: 20.5 },
  { foot: rect(6.3, 8.4, -10.5, -6.0), top: 26.0 },
];
// Aanbouw aan de noordwestgevel (BAG 5,3 bij 4,5 m) met de brug naar het
// pad: zadeldak langs Y met de nok op NAP +26,5 m boven x = -10,55 (AHN 26,1
// tot 26,4 m tot aan de voorgevel), helling 1,58 (58 graden, AHN 22,7 tot
// 23,5 m op 0,7 m van de gevels), en een topgevel naar buiten (foto's). Het
// dak loopt door tot het in het zaaldak verdwijnt.
const ANNEX = { foot: rect(-13.2, -7.9, 8.0, 15.46), ridgeX: -10.55, top: 26.5, slope: 1.58 };
// Schoorstenen: [x, y] (midden), [breedte x, y], top (NAP) en de hoogte van
// het puntige kapje (0 = vlak). Plaats en hoogte uit pieken in het AHN-DSM en
// de luchtfoto (beige vierkanten); kapjes en hoogtes zonder DSM-piek uit de
// foto's geschat.
const CHIMNEYS = [
  // Zaalbouw: op de top van de zuidwestgevel (DSM 31 m, foto's: 2 tot 3 m
  // boven de top) en op de nok (DSM 31,6 tot 32,3 m, kruisvormig).
  { c: [-16.0, 5.75], size: [1.2, 1.2], top: 32.0, cap: 0.7 },
  { c: [5.0, 5.75], size: [1.4, 1.4], top: 32.0, cap: 0 },
  // Keukentoren: oostzijde (DSM 31,9 m) en zuidzijde (DSM 29,4 m; foto vanuit
  // het zuidoosten: tot circa 60 % van de dakhoogte, dus 31 m).
  { c: [-7.25, -3.0], size: [1.0, 1.5], top: 31.8, cap: 0.6 },
  { c: [-12.0, -8.0], size: [1.2, 1.2], top: 31.0, cap: 0.6 },
  // Riddertoren: noordzijde (DSM 33,3 m) en oostzijde (DSM 33,5 m).
  { c: [13.6, 1.0], size: [1.2, 1.2], top: 33.3, cap: 0.7 },
  { c: [19.25, -2.75], size: [1.0, 1.2], top: 33.5, cap: 0.7 },
  // Poorttoren: op de top van de voorgevel en twee aan de oostkant achteraan
  // (foto vanuit het oosten; DSM 28,2 m).
  { c: [2.0, -16.15], size: [0.9, 0.9], top: 29.4, cap: 0.5 },
  { c: [4.7, -8.9], size: [0.9, 0.9], top: 29.6, cap: 0.5 },
  { c: [4.7, -10.7], size: [0.9, 0.9], top: 29.6, cap: 0.5 },
  // Aanbouw: pinakel op de top van de topgevel (foto vanuit het westen).
  { c: [-10.55, 15.01], size: [0.9, 0.9], top: 28.0, cap: 0.5 },
];
const CHIMNEY_FROM = 20.0;
// Dakruiter (klokkenstoel) midden op de nok van de poorttoren: 1,2 m in het
// vierkant tot NAP +29,9 m met een tentdakje tot +30,7 m (foto's 2024;
// in werkelijkheid open met vier stijlen).
const BELL = { c: [2.0, -11.3], size: [1.2, 1.2], top: 29.9, cap: 0.8 };
// Dakkapellen (foto's en luchtfoto): voorkant (midden, in het grondvlak),
// richting naar buiten, breedte, bovenkant van de wangen, nok, diepte naar
// binnen. Ze lopen naar beneden door tot in de massa eronder, dus zonder
// ondervlak. Zaalbouw: één aan elke kant op x = -1; Keukentoren: één midden op
// de zuidwestzijde; Riddertoren: vier op de hoekkepers.
const DIAG = Math.SQRT1_2;
const DORMERS = [
  { c: [-1.0, 10.0], n: [0, 1], w: 1.4, low: 21.0, wall: 25.0, ridge: 25.7, depth: 2.0 },
  { c: [-1.0, 0.7], n: [0, -1], w: 1.4, low: 21.0, wall: 23.9, ridge: 24.6, depth: 2.0 },
  { c: [-15.9, -3.75], n: [-1, 0], w: 1.4, low: 26.0, wall: 28.0, ridge: 28.7, depth: 2.0 },
  ...[[20.8, -10.5], [20.8, 2.9], [8.4, -10.5], [8.4, 2.9]].map(([x, y]) => {
    const n = [Math.sign(x - 14.6) * DIAG, Math.sign(y + 3.8) * DIAG];
    return { c: [x - Math.sign(n[0]) * 1.8, y - Math.sign(n[1]) * 1.8], n, w: 1.2, low: 26.0, wall: 29.1, ridge: 29.7, depth: 2.0 };
  }),
];
// Gevelreliëf: vensters als blinde nissen van 0,35 m diep met een vlakke
// bovenkant, in rijen [onderkant, bovenkant, breedte] (NAP). Rijen en
// kolommen uit de foto's van alle kanten, geschaald op de goot en de
// BAG-gevellengtes: in de zaalbouw de grote kruisvensters op de eerste
// verdieping en kleinere vensters daarboven, in de torens vijf lagen.
const NICHE_DEPTH = 0.35;
const HALL_ROWS = [[8.8, 12.0, 1.3], [15.6, 17.0, 0.9], [19.4, 20.6, 0.9]];
const TOWER_ROWS = [[6.0, 7.2, 0.9], [10.0, 11.4, 1.0], [14.5, 15.7, 0.9], [18.8, 20.0, 0.9], [22.6, 23.8, 0.9]];
const GATE_ROWS = [[10.0, 11.4, 1.0], [14.5, 15.7, 0.9], [18.8, 20.0, 0.9]];
// Gevelvlakken: as ("x" = vlak x = c, "y" = vlak y = c), richting naar
// buiten, posities langs de gevel en rijen.
const FACADES = [
  { name: "zaalbouw noordwest", axis: "y", c: 11.0, n: 1, cols: [-15.0, -5.4, -1.0, 3.4, 7.8, 12.2], rows: HALL_ROWS },
  { name: "zaalbouw noordoost", axis: "x", c: 16.0, n: 1, cols: [5.0, 9.0], rows: HALL_ROWS },
  { name: "zaalbouw zuidwest", axis: "x", c: -16.6, n: -1, cols: [4.0, 8.0], rows: HALL_ROWS },
  { name: "zaalbouw topgevel", axis: "x", c: -16.6, n: -1, cols: [3.9, 7.6], rows: [[23.2, 24.4, 0.9]] },
  { name: "Keukentoren zuidwest", axis: "x", c: -16.6, n: -1, cols: [-6.2, -1.3], rows: TOWER_ROWS },
  { name: "Keukentoren zuidoost", axis: "y", c: -9.0, n: -1, cols: [-14.1, -9.1], rows: TOWER_ROWS },
  { name: "Riddertoren noordoost", axis: "x", c: 20.8, n: 1, cols: [-7.2, -0.4], rows: TOWER_ROWS },
  { name: "Riddertoren zuidoost", axis: "y", c: -10.5, n: -1, cols: [11.5, 17.7], rows: TOWER_ROWS },
  { name: "Riddertoren noordwest", axis: "y", c: 2.9, n: 1, cols: [18.4], rows: TOWER_ROWS },
  { name: "poorttoren voorgevel", axis: "y", c: -16.6, n: -1, cols: [2.0], rows: [[13.0, 14.4, 1.0], [17.5, 18.9, 1.0], [22.0, 23.2, 0.9]] },
  { name: "poorttoren zuidwest", axis: "x", c: -2.5, n: -1, cols: [-12.8], rows: GATE_ROWS },
  { name: "poorttoren noordoost", axis: "x", c: 6.3, n: 1, cols: [-13.6], rows: GATE_ROWS },
  { name: "aanbouw", axis: "y", c: 15.46, n: 1, cols: [-10.55], rows: [[5.0, 7.4, 1.2], [10.0, 11.4, 1.0], [15.6, 17.0, 0.9], [19.4, 20.6, 0.9]] },
];
// Open binnenplaats (AHN-DSM NAP +4 tot +4,5 m) op NAP +4,6 m, zodat het
// PDOK-terrein er niet doorheen steekt.
const COURT = rect(-6.0, 6.8, -6.0, -0.3);
const COURT_FLOOR = 4.6;
// Bruggen over de binnengracht (BGT overbruggingsdeel): naar de voorburcht
// in het zuidoosten (dek NAP +4,4 m, AHN-DSM) en naar het pad in het
// noordwesten (dek NAP +2,0 m in het AHN, hier +2,6 m: het PDOK-terrein
// loopt daar als weg op NAP +2,4 m over de gracht en zou anders door het dek
// steken).
const BRIDGES = [
  { foot: [[0.58, -15.11], [0.52, -30.31], [3.09, -30.3], [3.18, -15.11]], deck: 4.4 },
  {
    foot: [
      [-10.56, 28.43], [-10.88, 15.46], [-8.88, 15.46], [-8.53, 28.43], [-7.83, 28.42], [-7.83, 30.46],
      [-8.35, 30.46], [-8.35, 30.97], [-10.49, 31.0], [-10.51, 30.46], [-11.89, 30.46], [-11.89, 28.43],
    ],
    deck: 2.6,
  },
];
// Maaiveld van de vesting (NAP +3,8 tot +4,1 m): bij de brug naar de
// voorburcht, op het terrein ten zuidwesten en ten noorden van de
// binnengracht; niet het water en niet de lage oevers.
const GROUND_SAMPLES = [[2, -34], [-38, -10], [0, 36]];

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
const box = ([cx, cy], [sx, sy]) => rect(cx - sx / 2, cx + sx / 2, cy - sy / 2, cy + sy / 2);

// Zadeldak als prisma tot de onderkant: een nok langs Y op x = xr op hoogte
// `top` (NAP), tussen y0 en y1, helling `slope`.
const wedgeAlongY = (xr, [y0, y1], top, slope) => {
  const w = (NAP(top) - BASE) / slope;
  return Manifold.hull([y0, y1].flatMap((y) => [[xr, y, NAP(top)], [xr - w, y, BASE], [xr + w, y, BASE]]));
};
// Idem met de nok langs X op y = yr.
const wedgeAlongX = (yr, [x0, x1], top, slope) => {
  const w = (NAP(top) - BASE) / slope;
  return Manifold.hull([x0, x1].flatMap((x) => [[x, yr, NAP(top)], [x, yr - w, BASE], [x, yr + w, BASE]]));
};
// Doorgang met een spitse bovenkant van 60 graden langs Y: breedte w, vloer
// z0, aanzet z1 (NAP), van y0 tot y1.
const passage = (x, w, z0, z1, y0, y1) => {
  const rise = (w / 2) * Math.tan(Math.PI / 3);
  const profile = [[-w / 2, NAP(z0)], [w / 2, NAP(z0)], [w / 2, NAP(z1)], [0, NAP(z1) + rise], [-w / 2, NAP(z1)]];
  return Manifold.hull([y0, y1].flatMap((y) => profile.map(([u, z]) => [x + u, y, z])));
};
// Schoorsteen of dakruiter: blok van CHIMNEY_FROM (binnen de massa) tot `top`
// met een puntig kapje van `cap` hoog.
const chimney = ({ c, size, top, cap }) => {
  const foot = box(c, size);
  const parts = [prism(foot, NAP(CHIMNEY_FROM), NAP(top))];
  if (cap > 0) parts.push(Manifold.hull([...at(foot, NAP(top) - 0.01), [c[0], c[1], NAP(top + cap)]]));
  return Manifold.union(parts);
};
// Dakkapel: vijfhoekig profiel (wangen tot `wall`, nok op `ridge`) in het
// vlak loodrecht op `n`, van de voorkant `depth` naar binnen.
const dormer = ({ c, n, w, low, wall, ridge, depth }) => {
  const profile = [[-w / 2, low], [w / 2, low], [w / 2, wall], [0, ridge], [-w / 2, wall]];
  const pts = [];
  for (const d of [0, -depth]) {
    for (const [u, z] of profile) pts.push([c[0] + n[0] * d - n[1] * u, c[1] + n[1] * d + n[0] * u, NAP(z)]);
  }
  return Manifold.hull(pts);
};
// Tentdak met knik: een schort van de goot (met overstek) tot de knik en
// daarboven een vierkante of achtkantige spits tot de top.
const towerRoof = (t) => {
  const [x0, x1, y0, y1] = t.foot;
  const [ox0, ox1, oy0, oy1] = t.overhang;
  const eave = rect(x0 - ox0, x1 + ox1, y0 - oy0, y1 + oy1);
  const i = t.knee.inset;
  const [a0, a1, b0, b1] = [x0 + i, x1 - i, y0 + i, y1 - i];
  let knee = rect(a0, a1, b0, b1);
  if (t.octagon) {
    const k = (1 - Math.tan(Math.PI / 8)) * Math.min(a1 - a0, b1 - b0) / 2;
    knee = [[a0 + k, b0], [a1 - k, b0], [a1, b0 + k], [a1, b1 - k], [a1 - k, b1], [a0 + k, b1], [a0, b1 - k], [a0, b0 + k]];
  }
  const tip = [(x0 + x1) / 2, (y0 + y1) / 2, NAP(t.tip)];
  return Manifold.union([
    Manifold.hull([...at(eave, NAP(t.eave)), ...at(knee, NAP(t.knee.z))]),
    Manifold.hull([...at(knee, NAP(t.knee.z) - 0.01), tip]),
  ]);
};

// ---------- slot ----------
// Zaalbouw: zadeldak binnen de voetafdruk, met een schild aan de
// noordoostkant onder dezelfde helling als de dakvlakken, en de topgevel aan
// de zuidwestkant met de afdekking 0,4 m boven het dakvlak.
const hallRoof = (top) => {
  const H = HALL;
  const [x0, x1] = H.ridgeX;
  const w = (NAP(top) - BASE) / H.slope;
  return Manifold.hull([
    [x0 - 10, H.ridgeY, NAP(top)], [x1, H.ridgeY, NAP(top)],
    [x0 - 10, H.ridgeY - w, BASE], [x0 - 10, H.ridgeY + w, BASE],
    [x1 + w, H.ridgeY - w, BASE], [x1 + w, H.ridgeY + w, BASE],
  ]);
};
const hall = Manifold.union([
  Manifold.intersection(hallRoof(HALL.top), prism(HALL.foot, BASE, 200)),
  Manifold.intersection(hallRoof(HALL.top + COPING), prism(rect(-16.6, -16.6 + GABLE_WALL, -0.3, 11.0), BASE, 200)),
]);
const tower = (t) => {
  const [x0, x1, y0, y1] = t.foot;
  return Manifold.union([prism(rect(x0, x1, y0, y1), BASE, NAP(t.eave) + 0.01), towerRoof(t)]);
};
const crossRoof = Manifold.intersection(
  wedgeAlongY(CROSS_ROOF.x, [-10, 10], CROSS_ROOF.top, CROSS_ROOF.slope),
  prism(CROSS_ROOF.clip, BASE, 200),
);
// Poorttoren met zadeldak en twee topgevels.
const [gy0, gy1] = [GATE.foot[0][1], GATE.foot[2][1]];
const gate = Manifold.union([
  Manifold.intersection(wedgeAlongY(GATE.ridgeX, [-30, 0], GATE.top, GATE.slope), prism(GATE.foot, BASE, 200)),
  ...[[gy0, gy0 + GABLE_WALL], [gy1 - GABLE_WALL, gy1]].map(([a, b]) =>
    Manifold.intersection(wedgeAlongY(GATE.ridgeX, [-30, 0], GATE.top + COPING, GATE.slope), prism(rect(-2.5, 6.3, a, b), BASE, 200)),
  ),
]);
// Aanbouw met zadeldak tot in het zaaldak en een topgevel naar buiten.
const [ax0, ax1, ay1] = [ANNEX.foot[0][0], ANNEX.foot[1][0], ANNEX.foot[2][1]];
const annex = Manifold.union([
  Manifold.intersection(wedgeAlongY(ANNEX.ridgeX, [0, 20], ANNEX.top, ANNEX.slope), prism(ANNEX.foot, BASE, 200)),
  Manifold.intersection(
    wedgeAlongY(ANNEX.ridgeX, [0, 20], ANNEX.top + COPING, ANNEX.slope),
    prism(rect(ax0, ax1, ay1 - GABLE_WALL, ay1), BASE, 200),
  ),
]);

// Uitsparingen: vensternissen (rechthoekig, vlakke bovenkant) en de
// spitse nis van de poort. Elke uitsparing is de omhullende van een profiel in
// het gevelvlak tussen `depth` achter de gevel en 1,5 m ervoor.
const cutters = [];
const nicheTops = new Map();
const counts = {};
const facadePoint = (F, u, d, z) => (F.axis === "x" ? [F.c + F.n * d, u, z] : [u, F.c + F.n * d, z]);
for (const F of FACADES) {
  for (const uc of F.cols) {
    for (const [z0, z1, w] of F.rows) {
      const profile = [[uc - w / 2, NAP(z0)], [uc + w / 2, NAP(z0)], [uc + w / 2, NAP(z1)], [uc - w / 2, NAP(z1)]];
      const pts = [];
      for (const d of [-NICHE_DEPTH, 1.5]) for (const [u, z] of profile) pts.push(facadePoint(F, u, d, z));
      cutters.push(Manifold.hull(pts));
      const key = NAP(z1).toFixed(2);
      nicheTops.set(key, (nicheTops.get(key) ?? 0) + w * 0.4);
      counts[F.name] = (counts[F.name] ?? 0) + 1;
    }
  }
}
{
  // Spitse nis rond de poortdoorgang (sponning van de ophaalbrug).
  const P = PORTAL;
  const rise = (P.w / 2) * Math.tan(Math.PI / 3);
  const profile = [[-P.w / 2, NAP(P.floor)], [P.w / 2, NAP(P.floor)], [P.w / 2, NAP(P.top) - rise], [0, NAP(P.top)], [-P.w / 2, NAP(P.top) - rise]];
  const y = GATE.foot[0][1];
  cutters.push(Manifold.hull([-P.depth, 1.5].flatMap((d) => profile.map(([u, z]) => [P.x + u, y - d, z]))));
}
console.log("vensternissen per gevel:", counts);

const castle = Manifold.union([
  hall,
  ...TOWERS.map(tower),
  crossRoof,
  gate,
  annex,
  ...LINKS.map((l) => prism(l.foot, BASE, NAP(l.top))),
  ...CHIMNEYS.map(chimney),
  chimney(BELL),
  ...DORMERS.map(dormer),
])
  .subtract(Manifold.union(cutters))
  .subtract(prism(COURT, NAP(COURT_FLOOR), 200))
  .subtract(passage(PASSAGE.x, PASSAGE.w, PASSAGE.floor, PASSAGE.spring, GATE.foot[0][1] - 4, COURT[0][1] + 1));

// ---------- bruggen ----------
const bridges = Manifold.union(BRIDGES.map((b) => prism(b.foot, BASE, NAP(b.deck))));

const nodes = [
  ["building:slot", castle],
  ["road:bruggen", bridges],
];
const all = Manifold.union(nodes.map(([, solid]) => solid));

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de
  // onderkant: alleen de dakoverstekken van de twee torens en de vlakke
  // bovenkanten van de vensternissen (hooguit breedte maal 0,4 m per nis).
  const allowed = new Set(TOWERS.map((t) => NAP(t.eave).toFixed(2)));
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
      if (allowed.has(z) || area <= 0.01) continue;
      if (!nicheTops.has(z)) throw new Error(`${name}: overhang op z ${z}`);
      if (area > nicheTops.get(z) + 0.05) throw new Error(`${name}: nisbovenkanten op z ${z}: ${area.toFixed(2)} > ${nicheTops.get(z).toFixed(2)} m2`);
    }
    if (!name.startsWith("road") && ![...allowed].some((z) => levels.has(z))) throw new Error(`${name}: geen dakoverstek`);
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
const glbFile = path.join(outDir, "slot-loevestein.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-slot-loevestein.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `slot-loevestein-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Slot Loevestein Poederoijen 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = castle.boundingBox();
const pb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pb.max[i] - pb.min[i]) * mmPerMetre).toFixed(1)),
};

await writeFile(
  path.join(outDir, "slot-loevestein.json"),
  JSON.stringify(
    {
      name: "Slot Loevestein",
      file: "slot-loevestein.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      // 0 in plaats van -0,3: het slot staat in de binnengracht en de
      // binnenplaats blijft zo boven het PDOK-terrein binnen de muren.
      groundOffsetMetres: 0,
      // Op het maaiveld van de vesting (NAP +3,8 tot +4,1 m): bij de brug naar
      // de voorburcht en op het terrein ten zuidwesten en ten noorden van de
      // binnengracht; niet het water en niet de lage oevers.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0297100000000371"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (129774, 425374), midden in het slot, op het maaiveld van de vesting (NAP +3,8 m), +X langs de zaalbouw naar het noordoosten (xAxis, 49,95 graden linksom vanaf het oosten) en +Y naar het noordwesten. Twee nodes: building:slot met de zaalbouw van 32,6 bij 11,3 m onder een zadeldak (nok NAP +29,8 m, schild tegen de Riddertoren, rechte topgevel aan de zuidwestkant met de schoorsteen op de top, een dakkapel aan elke kant en een schoorsteen op de nok), de Riddertoren aan de noordoostkant (12,4 bij 13,4 m, tentdak met een knik op NAP +27,4 m tot +36,75 m, vier dakkapellen op de hoekkepers, twee schoorstenen) en de Keukentoren aan de zuidwestkant (10 bij 10,5 m, knik op +27,4 m met daarboven een achtkantige spits met hoekschilden tot +35 m, een dakkapel, twee schoorstenen, een dwarskap naar het zaaldak) met een dakoverstek van 0,3 m op NAP +26 m, de poorttoren aan de zuidoostkant met zadeldak (nok NAP +28,4 m), topgevels voor en achter, een dakruiter en schoorstenen, en een spitse doorgang in een spitse nis naar de binnenplaats (NAP +4,6 m), de lage muur langs de binnenplaats (NAP +20,5 m) en de aanbouw aan de noordwestgevel met zadeldak (nok NAP +26,5 m) en topgevel met pinakel; topgevels steken 0,4 m boven het dakvlak uit; vensters als blinde nissen van 0,35 m in alle buitengevels; road:bruggen, de brug van de poorttoren naar de voorburcht (dek NAP +4,4 m) en de brug van de aanbouw naar het pad in het noordwesten (dek NAP +2,6 m). Alle onderdelen beginnen op NAP 0 m, onder het water van de binnengracht, die met de wallen en de andere gebouwen van de vesting in PDOK zit. Alles staat recht op of loopt schuin omhoog, behalve de dakoverstekken van de torens die 0,3 m uitkragen en de vlakke bovenkanten van de vensternissen (0,35 m), zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van het BAG-pand van het slot. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`slot-loevestein-1-${scale}.stl`],
      realWorld: {
        lengthAlongXM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthAlongYM: +(bb.max[1] - bb.min[1]).toFixed(2),
        hallRidgeNapM: HALL.top,
        knightsTowerTipNapM: TOWERS[1].tip,
        kitchenTowerTipNapM: TOWERS[0].tip,
        towerEaveNapM: TOWERS[0].eave,
        gateTowerRidgeNapM: GATE.top,
        courtyardNapM: COURT_FLOOR,
        southEastBridgeDeckNapM: BRIDGES[0].deck,
        northWestBridgeDeckNapM: BRIDGES[1].deck,
        groundNapM: GROUND_NAP,
        baseNapM: 0,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Slot_Loevestein",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/10081",
        "PDOK BAG pand 0297100000000371 (slot), EPSG:28992",
        "PDOK BGT overbruggingsdeel: de bruggen over de binnengracht naar de voorburcht en naar het pad in het noordwesten",
        "PDOK AHN DSM/DTM 0,5 m via WCS (raster per 0,5 m): nok en goten van de zaalbouw, toppen, goten en knik van de torendaken, dwarskap bij de Keukentoren, dak van de poorttoren en de aanbouw, schoorstenen, binnenplaats, brugdekken en maaiveld",
        "Wikimedia Commons: 10081 slot loevestein (2).jpg en (3).jpg; 2024-08-14 Slot Loevestein ZvD 31, 40, 49, 52, 55 en 58 (alle kanten, dakvormen, topgevels, dakkapellen, schoorstenen, dakruiter, vensters); 5307 Poederoijen, Netherlands - panoramio (22).jpg (poorttoren vanuit het oosten)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

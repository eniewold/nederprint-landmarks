// Genereert een gesloten 3D-model van de Sint-Servaasbasiliek in Maastricht:
// de romaanse kruisbasiliek met het middenschip en het koor onder één hoog
// zadeldak (nok NAP +82 m) met vensternissen in de lichtbeuk, de zijbeuken met
// een lessenaarsdak tegen het middenschip, de luchtbogen als steunberen over
// dat dak, de gotische zijkapellen met een rij dwarse zadeldaken met
// topgevels (zes aan de zuidkant, zeven aan de noordkant), aan de zuidkant
// met een borstwering, pinakels en spitse vensters tussen steunberen, het
// Bergportaal met een eigen dwars zadeldak en een diepe spitse poortopening,
// het transept onder een even hoog dwars zadeldak met topgevels, het koor met
// een topgevel boven de halfronde apsis met twee rijen blinde bogen tussen
// lisenen, de dwerggalerij als band van nissen en een kegeldak, de twee
// slanke oosttorens met geledingen, een galerij onder een dakvoet op een
// kraag en een vierzijdige piramidespits, de aanbouwen ten oosten van het
// transept, de kloostergang rond de pandhof met de dubbele westvleugel, de
// noordvleugel, de oostgalerij en de spitse vensters naar de pandhof, en het
// westwerk aan de Sint Servaasklooster: het brede blok met een laag
// schilddak, de westgevel met de spitse toegang onder een groot
// roosvenster, blinde bogen en rondvensters, een kort zadeldak met een roosvenster naar het westen en een
// dwars zadeldak tussen de twee westtorens, elk met drie geledingen tussen
// hoeklisenen met gekoppelde nissen, een kroonlijst op een kraag, een laag
// tentdak en een leien lantaarn met galmgaten, vier topgevels en een
// ruitspits (Rhenish helm) tot NAP +108 m (56 m boven het Vrijthof). Alle
// maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, één node met de materiaalklasse in de nodenaam) als catalogusbron
// voor de export en de kaart, plus een binaire STL in millimeters op
// 1:<schaal>.
//
//   node scripts/generate-sint-servaasbasiliek.mjs              # 1:1000 (standaard)
//   node scripts/generate-sint-servaasbasiliek.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alle bouwdelen zijn minstens 0,9 m dik
// en staan recht op of lopen schuin omhoog, de spitsen lopen uit in een punt
// boven een brede voet, alle nissen, blinde bogen, vensters en poorten hebben
// een spitse bovenkant van 60 graden (rondbogen als spitsboog), de verdiepte
// velden tussen lisenen en hoeklisenen hebben een schuine bovenkant van 55
// graden, en de kroonlijsten en dakvoeten kragen 0,3 m uit op een kraag van
// 53 graden. De controle onderaan staat geen vlak toe dat vlakker dan 45
// graden naar beneden wijst.
//
// Assenstelsel: oorsprong op RD (176166,22, 317708,25), in het hart van de
// apsis, op het maaiveld aan het Vrijthof (NAP +52,3 m), Z omhoog. +X loopt
// langs de as van de kerk van het westwerk naar de apsis (RD-richting 13,8
// graden, ten noorden van oost), +Y naar het noordnoordwesten; het westwerk
// staat aan de -X-kant, de pandhof aan de +Y-kant. Het maaiveld loopt van het
// Vrijthof (NAP +52,3 m) naar het westwerk op tot NAP +55,6 m; de vlakke
// onderkant ligt 1 m onder het laagste punt en loopt in het westen door het
// hogere maaiveld heen.
//
// Bronnen: BAG-pand 0935100000017126 (contour met de pandhof als gat); AHN
// DSM/DTM 0,5 m (PDOK WCS), als raster per 0,5 m in het stelsel langs de as
// bekeken: de nok en goten van schip, koor en transept, het lessenaarsdak van
// de zijbeuken, de nokken en kilgoten van de dwarse kapeldaken, de
// luchtbogen, het Bergportaal, de apsis, de oosttorens, de daken van het
// westwerk en het raster van de westtorens, de daken van de kloostervleugels
// en het maaiveld; Wikipedia (85 × 42,5 m, torens 56 m); foto's op Wikimedia
// Commons van alle kanten (het westwerk vanuit de pandhof, vanaf het Henric
// van Veldekeplein en vanaf de Sint Servaasklooster, de westtorens en de
// oosttorens vanaf de toren van de Sint-Janskerk, de oostpartij met de apsis
// aan het Vrijthof, het Bergportaal, de zuidelijke en noordelijke
// zijkapellen, de kruisgang); PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-servaasbasiliek");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 52,3 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [176166.22, 317708.25];
const ANGLE = (13.8 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 52.3;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour (lokaal): de kerk, de kloostergang en de panden ten noorden van
// de pandhof; de pandhof zelf is een gat in het pand.
const OUTLINE = [
  [-0.1, -6.54], [1.02, -6.46], [2.12, -6.19], [3.15, -5.73], [4.09, -5.1], [4.91, -4.32], [5.58, -3.42],
  [6.09, -2.41], [6.41, -1.32], [6.54, -0.2], [6.48, 0.93], [6.22, 2.03], [5.78, 3.07], [5.17, 4.01],
  [4.4, 4.84], [3.5, 5.53], [2.5, 6.05], [1.42, 6.39], [0.3, 6.54], [0.2, 10.22], [-4.71, 10.24],
  [-5.9, 10.25], [-5.83, 22.56], [-5.65, 31.07], [-13.0, 31.22], [-12.06, 36.66], [-20.94, 36.9],
  [-20.65, 40.45], [-24.56, 40.89], [-23.75, 45.49], [-22.43, 53.54], [-22.02, 55.86], [-21.1, 60.38],
  [-19.91, 67.28], [-18.82, 75.68], [-17.75, 82.61], [-17.41, 84.82], [-22.35, 85.47], [-25.87, 85.91],
  [-28.11, 68.48], [-58.07, 69.82], [-58.29, 71.29], [-66.47, 72.02], [-66.45, 69.49], [-64.83, 69.29],
  [-65.66, 62.63], [-74.75, 63.76], [-75.6, 56.9], [-80.22, 17.92], [-84.16, 17.9], [-84.66, -16.42],
  [-70.66, -16.71], [-70.77, -25.02], [-60.98, -24.88], [-57.95, -24.62], [-52.96, -24.67], [-53.01, -18.23],
  [-27.08, -18.01], [-26.75, -22.88], [-6.15, -22.94], [-6.16, -14.69], [-6.53, -10.1], [-4.94, -10.11],
  [-0.08, -10.16],
];
const PANDHOF = [[-63.4, 20.95], [-59.89, 54.31], [-29.1, 52.72], [-34.06, 18.35], [-63.55, 19.47]];
// Alles binnen de contour tot de laagste goot van de kruisgang.
const LOW = 60.0;

// Kloostergang en de panden ten noorden van de pandhof (AHN-raster): de
// westvleugel is dubbel, met een hoge vleugel aan de straat (nok +67 m) en de
// lagere galerij aan de pandhof (nok +64,2 m), beide evenwijdig aan de
// westgevel (6,7 graden gedraaid ten opzichte van de kerk); de noordvleugel
// onder een zadeldak (nok +66,1 m); de oostgalerij onder een smal zadeldak
// (nok +64,1 m, goot +60 m aan de pandhof); de zuidgalerij langs de
// noordelijke kapellen onder een lessenaarsdak.
// Nok van p0 naar p1, [halve breedte, goot] links en rechts van de nok.
const WINGS = [
  { name: "westvleugel", p0: [-75.4, 15], p1: [-69.6, 65], left: [4.9, 62.2], right: [4.9, 62.4], ridge: 67.0 },
  { name: "westgalerij", p0: [-68.4, 15], p1: [-63.1, 60], left: [3.4, 62.4], right: [3.6, 60.8], ridge: 64.2 },
  { name: "oostgalerij", p0: [-29.8, 17], p1: [-25.2, 56], left: [3.6, 60.0], right: [3.8, 62.5], ridge: 64.1 },
];
const NORTH_WING = { x: [-67.0, -20.0], y: [53.0, 69.5], ridgeY: 59.2, eave: [60.8, 60.3], ridge: 66.1 };
const SOUTH_GALLERY = { x: [-64.0, -30.0], y: [17.6, 20.6], high: 64.4, low: 60.6 };
// Het smalle pand ten noorden van de noordvleugel met een dak dat naar het
// oosten oploopt.
const NORTH_ANNEX = { x: [-28.5, -17.0], y: [56.0, 87.0], low: 61.5, high: 66.3 };
// Het pand ten noorden van het transept: nok langs de as op +65,8 m, naar het
// noorden flauw aflopend tot +59,3 m.
const NORTH_HALL = { x: [-25.5, -12.0], y: [22.4, 37.2], ridgeY: 26.5, eave: [63.3, 59.3], ridge: 65.8 };
// Aanbouwen ten oosten van het transept (sacristieën, schatkamer): twee
// lessenaarsdaken die naar het oosten aflopen en een plat blok.
const ANNEXES = [
  { name: "aanbouw noordoost", x: [-12.5, -5.5], y: [6.0, 22.4], high: 66.6, low: 64.6 },
  { name: "aanbouw zuidoost", x: [-12.5, -5.5], y: [-23.5, -6.0], high: 66.6, low: 64.6 },
  { name: "aanbouw ten noorden van het transept", x: [-15.5, -5.8], y: [22.4, 31.2], high: 69.2, low: 69.2 },
];
// Middenschip en koor onder één zadeldak van het westwerk tot de topgevel
// boven de apsis (AHN: nok +82 m, dakvlakken onder 48 graden, goot +74,6 m op
// 6,6 m uit de as; het koor 6,3 m met de goot op +75,8 m).
const NAVE = { x: [-71.0, -12.5], half: 6.6, eave: 74.6, ridge: 82.0 };
const CHOIR = { x: [-12.5, -0.3], half: 6.3, eave: 75.8 };
// Vensters in de lichtbeuk boven het lessenaarsdak, tussen de luchtbogen.
const CLERESTORY = { u: [-66.5, -61, -56, -51, -46, -41, -36, -30.5], w: 1.6, z: [69.4, 73.6] };
// Apsis: halve cirkel rond de oorsprong met een kegeldak tot onder de nok;
// twee rijen van zeven blinde bogen tussen lisenen (de bovenste met drie
// vensters) en de dwerggalerij als band van tien nissen onder de goot.
const APSE = {
  radius: 6.54,
  eave: 70.8,
  tip: 77.3,
  span: [-75, 75],
  bays: 7,
  lisene: 0.9,
  lower: [54.0, 62.4],
  upper: [63.2, 68.4],
  windows: { w: 1.1, z: [64.0, 67.6] },
  gallery: { count: 10, w: 0.9, z: [68.9, 70.4], depth: 0.45 },
};
// Transept: dwars zadeldak (nok even hoog als het schip) met topgevels.
const TRANSEPT = { x: [-27.4, -12.5], ridgeX: -19.95, y: [-22.9, 22.5], eave: 73.6, ridge: 82.0 };
// Zijbeuken: een lessenaarsdak van de lichtbeuk tot de kapellen (AHN: +68,6
// naar +65,2 m aan de zuidkant, +68 naar +64,9 m aan de noordkant).
const AISLES = [
  { side: -1, y: [6.6, 12.5], z: [68.6, 65.2] },
  { side: 1, y: [6.6, 12.5], z: [68.0, 64.9] },
];
// Gotische kapellen langs de zijbeuken, elk onder een eigen dwars zadeldak
// met de topgevel naar buiten (AHN: nokken om de 5 m, kilgoten ertussen).
const CHAPELS = [
  { side: -1, y: [12.5, 18.4], x: [-58.5, -27.4], gutter: 65.4, ridge: 68.7, ridges: [-56, -51, -46, -41, -36, -30.5] },
  { side: 1, y: [12.5, 17.8], x: [-63.0, -28.5], gutter: 64.3, ridge: 67.5, ridges: [-60, -55, -50, -45.5, -41, -36, -31] },
];
const CHAPEL_HALF = 2.5;
// Borstwering en pinakels op de steunberen tussen de zuidelijke kapellen.
const PARAPET = { x: [-53.0, -27.4], y: [-18.6, -17.2], top: 66.6 };
const PINNACLES = { x: [-53.4, -48.5, -43.5, -38.5, -33.5], y: -17.7, half: 0.5, top: 67.6, tip: 69.6 };
// Luchtbogen: steunberen van 1 m dik van de lichtbeuk (+72,6 m) over het
// lessenaarsdak naar een pinakel boven de kapellen (+70,6 tot +72,6 m).
const BUTTRESSES = { x: [-64.0, -53.5, -43.0, -33.0], y: [6.6, 12.6], top: [72.6, 70.6], foot: 64.0, pinnacle: [12.1, 13.3, 70.6, 72.6] };
// Bergportaal en de kapel ernaast onder dwarse zadeldaken tot de BAG-contour.
const SOUTH_GABLES = [
  { name: "Bergportaal", x: [-71.0, -59.0], ridgeX: -65.0, y: [-25.5, -12.5], eave: 65.6, ridge: 70.0 },
  { name: "kapel naast het Bergportaal", x: [-59.0, -53.0], ridgeX: -56.0, y: [-25.5, -12.5], eave: 65.6, ridge: 68.6 },
];
// De poortopening van het Bergportaal (6 m breed, top +62 m, 1,5 m diep) met
// drie vensters erboven.
const PORTAL = { w: 6.0, z: [53.8, 62.0], depth: 1.5, windows: { w: 1.0, z: [62.6, 64.6], at: [-2.0, 0, 2.0] } };
// Westwerk: het brede blok met een laag schilddak (goot +74,6 m, vlak +76,6 m
// op 3 m uit de gevel), het middendeel tussen de torens met een dwars
// zadeldak (nok +83,8 m).
const WESTWORK = { x: [-85.0, -70.5], y: [-17.0, 18.0], eave: 74.6, top: 76.6, inset: 3.0 };
const WEST_ROOF = { x: [-81.0, -70.5], half: 5.2, eave: 80.5, ridgeX: -75.3, ridge: 83.8 };
// Voor het dwarse dak een kort zadeldak langs de as met de topgevel en een
// roosvenster naar het westen (nok +80 m).
const WEST_GABLE = { x: [-85.0, -81.0], half: 4.5, eave: 75.7, ridge: 80.0, rose: { r: 1.0, z: 77.4 } };
// Westgevel van het westwerk: plint, zeven traveeën met de toegang en het
// grote roosvenster in het midden en vensters ernaast, een rij blinde bogen
// en een rij rondvensters.
const WEST_FRONT = {
  plinth: 56.8,
  bays: 7,
  pier: 1.0,
  lower: [56.8, 64.4],
  door: { w: 2.4, z: [55.6, 59.4], depth: 1.2 },
  rose: { r: 1.6, z: 61.6 },
  windows: { w: 1.4, z: [58.6, 62.8] },
  arcade: [65.2, 70.6],
  oculus: { r: 0.7, z: 72.6 },
};
// Westtorens rond (-74,85, 9,45) en (-74,85, -8,7): schacht van 10 × 7,4 m
// tot +93 m met drie geledingen tussen hoeklisenen, een kroonlijst op een
// kraag die 0,3 m uitkraagt, een laag tentdak, de leien lantaarn met twee
// galmgaten per zijde, vier topgevels en een ruitspits tot NAP +108 m.
const WEST_TOWER = {
  x: -74.85,
  y: [9.45, -8.7],
  half: [5.0, 3.7],
  corner: 1.1,
  stages: [[77.0, 81.4], [82.2, 86.6], [87.4, 91.6]],
  cornice: { overhang: 0.3, from: 92.1, at: 92.5, top: 93.0 },
  skirt: { half: [3.6, 2.9], top: 95.5 },
  lantern: { half: 2.4, top: 99.5, openings: { w: 1.0, at: [-1.0, 1.0], z: [96.0, 99.0] } },
  gables: { top: 101.8, niche: { w: 0.9, z: [99.7, 101.2] } },
  spire: { half: 1.9, tip: 108.0 },
};
// Oosttorens naast het koor: schacht tot +87,9 m met drie geledingen, een
// dakvoet op een kraag tot +88,3 m (0,25 m uit) en een vierzijdige
// piramidespits tot +92,6 m.
const EAST_TOWERS = [
  { x: [-4.4, -0.6], y: [6.0, 9.6] },
  { x: [-4.5, -0.7], y: [-9.6, -6.0] },
];
const EAST_TOWER = { shaft: 87.9, eave: 88.3, overhang: 0.25, tip: 92.6, corner: 0.8, stages: [[72.0, 76.4], [77.4, 81.8], [82.8, 86.6]] };
// Maaiveld aan het Vrijthof rond de apsis en de oosttorens (NAP +52,2 tot
// +52,6 m); het maaiveld bij het westwerk ligt 3 m hoger.
const GROUND_SAMPLES = [[10, 0], [0, 17], [0, -17]];

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
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
const outline = Manifold.extrude(new CrossSection([ccw(OUTLINE), [...ccw(PANDHOF)].reverse()]), 202).translate([0, 0, BASE - 1]);
const clip = (solid) => Manifold.intersection(outline, solid);
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const unit = ([x, y]) => {
  const l = Math.hypot(x, y);
  return [x / l, y / l];
};
// Zadeldak langs een nok van p0 naar p1 met [halve breedte, goot] links en
// rechts, van de onderkant tot de nok.
const ridgeWing = ({ p0, p1, left: [hl, el], right: [hr, er], ridge }) => {
  const t = unit([p1[0] - p0[0], p1[1] - p0[1]]);
  const n = [-t[1], t[0]];
  const pts = [];
  for (const [px, py] of [p0, p1]) {
    const off = (s) => [px + n[0] * s, py + n[1] * s];
    pts.push([...off(hl), BASE], [...off(hl), NAP(el)], [px, py, NAP(ridge)], [...off(-hr), NAP(er)], [...off(-hr), BASE]);
  }
  return Manifold.hull(pts);
};
// Blok met een dak dat lineair loopt van `high` aan de ene kant naar `low` aan
// de andere (as "x" of "y"; `high` ligt aan het begin van het bereik).
const leanTo = ([x0, x1], [y0, y1], axis, high, low) => {
  const z = (s) => NAP(s === 0 ? high : low);
  const pts = at(rect([x0, x1], [y0, y1]), BASE);
  if (axis === "x") pts.push([x0, y0, z(0)], [x0, y1, z(0)], [x1, y0, z(1)], [x1, y1, z(1)]);
  else pts.push([x0, y0, z(0)], [x1, y0, z(0)], [x0, y1, z(1)], [x1, y1, z(1)]);
  return Manifold.hull(pts);
};
// Gevelvlak langs de lijn a→b met de normaal `n` naar buiten; u loopt langs
// de gevel vanaf a, d naar buiten.
const facade = (a, b, outward) => {
  const t = unit([b[0] - a[0], b[1] - a[1]]);
  let n = [t[1], -t[0]];
  if (n[0] * outward[0] + n[1] * outward[1] < 0) n = [-n[0], -n[1]];
  return { a, t, n, length: Math.hypot(b[0] - a[0], b[1] - a[1]) };
};
const fp = (F, u, d, z) => [F.a[0] + F.t[0] * u + F.n[0] * d, F.a[1] + F.t[1] * u + F.n[1] * d, NAP(z)];
// Uitsparing: profiel [[u, z(NAP)], ...] in het gevelvlak van `depth` achter
// de gevel tot 1,5 m ervoor.
const cutF = (F, profile, depth, out = 1.5) => Manifold.hull([-depth, out].flatMap((d) => profile.map(([u, z]) => fp(F, u, d, z))));
// Spitse boog: breedte w rond uc, van z0 tot de top z1, de schuine kanten
// onder `deg` graden (60, of 50 bij de brede bogen).
const pointed = (uc, w, z0, z1, deg = 60) => {
  const rise = (w / 2) * Math.tan((deg * Math.PI) / 180);
  return [[uc - w / 2, z0], [uc + w / 2, z0], [uc + w / 2, z1 - rise], [uc, z1], [uc - w / 2, z1 - rise]];
};
// Rond venster met een spitse bovenkant (raaklijnen onder 50 graden).
const oculus = (uc, zc, r) => {
  const profile = [];
  for (let deg = -180; deg <= 0; deg += 15) profile.push([uc + r * Math.cos((deg * Math.PI) / 180), zc + r * Math.sin((deg * Math.PI) / 180)]);
  for (const deg of [40, 140]) profile.push([uc + r * Math.cos((deg * Math.PI) / 180), zc + r * Math.sin((deg * Math.PI) / 180)]);
  profile.push([uc, zc + r / Math.sin((40 * Math.PI) / 180)]);
  return profile;
};
// Verdiept veld tussen lisenen (u0..u1, z0..z1) met een schuine bovenkant van
// 55 graden.
const PANEL_DEPTH = 0.3;
const NICHE_DEPTH = 0.35;
const panel = (F, u0, u1, z0, z1, depth = PANEL_DEPTH) => {
  const ch = (depth + 0.05) * 1.43 - 0.05;
  const section = [[-depth, z0], [1.5, z0], [1.5, z1 + 0.05], [0.05, z1 + 0.05], [-depth, z1 - ch]];
  return Manifold.hull(section.flatMap(([d, z]) => [fp(F, u0, d, z), fp(F, u1, d, z)]));
};

// ---------- opbouw: kloostergang, aanbouwen en schip ----------
const parts = [clip(box([-100, 20], [-40, 100], BASE, NAP(LOW)))];
for (const W of WINGS) parts.push(clip(ridgeWing(W)));
{
  const N = NORTH_WING;
  parts.push(
    clip(
      Manifold.hull([
        ...at(rect(N.x, N.y), BASE),
        [N.x[0], N.y[0], NAP(N.eave[0])], [N.x[1], N.y[0], NAP(N.eave[0])],
        [N.x[0], N.y[1], NAP(N.eave[1])], [N.x[1], N.y[1], NAP(N.eave[1])],
        [N.x[0], N.ridgeY, NAP(N.ridge)], [N.x[1], N.ridgeY, NAP(N.ridge)],
      ]),
    ),
  );
  const H = NORTH_HALL;
  parts.push(
    clip(
      Manifold.hull([
        ...at(rect(H.x, H.y), BASE),
        [H.x[0], H.y[0], NAP(H.eave[0])], [H.x[1], H.y[0], NAP(H.eave[0])],
        [H.x[0], H.y[1], NAP(H.eave[1])], [H.x[1], H.y[1], NAP(H.eave[1])],
        [H.x[0], H.ridgeY, NAP(H.ridge)], [H.x[1], H.ridgeY, NAP(H.ridge)],
      ]),
    ),
  );
  const S = SOUTH_GALLERY;
  parts.push(clip(leanTo(S.x, S.y, "y", S.high, S.low)));
  const A = NORTH_ANNEX;
  parts.push(clip(leanTo(A.x, A.y, "x", A.low, A.high)));
}
for (const a of ANNEXES) parts.push(clip(leanTo(a.x, a.y, "x", a.high, a.low)));
// Middenschip en koor.
{
  const N = NAVE;
  const nave = rect(N.x, [-N.half, N.half]);
  parts.push(Manifold.hull([...at(nave, BASE), ...at(nave, NAP(N.eave)), [N.x[0], 0, NAP(N.ridge)], [N.x[1], 0, NAP(N.ridge)]]));
  const C = CHOIR;
  const choir = rect(C.x, [-C.half, C.half]);
  parts.push(Manifold.hull([...at(choir, BASE), ...at(choir, NAP(C.eave)), [C.x[0], 0, NAP(N.ridge)], [C.x[1], 0, NAP(N.ridge)]]));
}
// Apsis met kegeldak.
{
  const A = APSE;
  const ring = Array.from({ length: 13 }, (_, k) => {
    const a = ((-90 + 15 * k) * Math.PI) / 180;
    return [A.radius * Math.cos(a), A.radius * Math.sin(a)];
  });
  parts.push(clip(Manifold.hull([...at(ring, BASE), ...at(ring, NAP(A.eave)), [0, 0, NAP(A.tip)]])));
}
// Transept.
{
  const T = TRANSEPT;
  const r = rect(T.x, T.y);
  parts.push(clip(Manifold.hull([...at(r, BASE), ...at(r, NAP(T.eave)), [T.ridgeX, T.y[0], NAP(T.ridge)], [T.ridgeX, T.y[1], NAP(T.ridge)]])));
}
// Zijbeuken met het lessenaarsdak, de kapellen met hun dwarse zadeldaken.
for (const a of AISLES) {
  const ys = a.y.map((y) => a.side * y);
  const pts = [];
  for (const x of [NAVE.x[0], TRANSEPT.x[0]]) {
    pts.push([x, ys[0], BASE], [x, ys[1], BASE], [x, ys[0], NAP(a.z[0])], [x, ys[1], NAP(a.z[1])]);
  }
  parts.push(clip(Manifold.hull(pts)));
}
for (const c of CHAPELS) {
  const ys = c.y.map((y) => c.side * y).sort((p, q) => p - q);
  parts.push(clip(box(c.x, ys, BASE, NAP(c.gutter))));
  for (const rx of c.ridges) {
    const r = rect([rx - CHAPEL_HALF, rx + CHAPEL_HALF], ys);
    parts.push(clip(Manifold.hull([...at(r, NAP(c.gutter) - 1), ...at(r, NAP(c.gutter)), [rx, ys[0], NAP(c.ridge)], [rx, ys[1], NAP(c.ridge)]])));
  }
}
// Borstwering en pinakels aan de zuidkant.
parts.push(clip(box(PARAPET.x, PARAPET.y, NAP(CHAPELS[0].gutter) - 1, NAP(PARAPET.top))));
for (const x of PINNACLES.x) {
  const P = PINNACLES;
  const r = rect([x - P.half, x + P.half], [P.y - P.half, P.y + P.half]);
  parts.push(clip(prism(r, NAP(CHAPELS[0].gutter) - 1, NAP(P.top))), clip(Manifold.hull([...at(r, NAP(P.top) - 0.1), [x, P.y, NAP(P.tip)]])));
}
// Luchtbogen als steunberen over het lessenaarsdak met een pinakel op de voet.
for (const side of [-1, 1]) {
  const B = BUTTRESSES;
  for (const x of B.x) {
    const [y0, y1] = B.y.map((y) => side * y);
    parts.push(
      Manifold.hull([
        [x - 0.5, y0, NAP(B.foot)], [x + 0.5, y0, NAP(B.foot)], [x - 0.5, y1, NAP(B.foot)], [x + 0.5, y1, NAP(B.foot)],
        [x - 0.5, y0, NAP(B.top[0])], [x + 0.5, y0, NAP(B.top[0])], [x - 0.5, y1, NAP(B.top[1])], [x + 0.5, y1, NAP(B.top[1])],
      ]),
    );
    const [p0, p1, z0, z1] = B.pinnacle;
    const r = rect([x - 0.6, x + 0.6], [side * p0, side * p1].sort((p, q) => p - q));
    parts.push(prism(r, BASE, NAP(z0)), Manifold.hull([...at(r, NAP(z0) - 0.1), [x, (side * (p0 + p1)) / 2, NAP(z1)]]));
  }
}
for (const g of SOUTH_GABLES) {
  const r = rect(g.x, g.y);
  parts.push(clip(Manifold.hull([...at(r, BASE), ...at(r, NAP(g.eave)), [g.ridgeX, g.y[0], NAP(g.ridge)], [g.ridgeX, g.y[1], NAP(g.ridge)]])));
}

// ---------- opbouw: westwerk en torens ----------
const westParts = [];
{
  const W = WESTWORK;
  const r = rect(W.x, W.y);
  const inner = rect([W.x[0] + W.inset, W.x[1]], [W.y[0] + W.inset, W.y[1] - W.inset]);
  westParts.push(clip(Manifold.hull([...at(r, BASE), ...at(r, NAP(W.eave)), ...at(inner, NAP(W.top))])));
  const R = WEST_ROOF;
  const roof = rect(R.x, [-R.half, R.half]);
  westParts.push(clip(Manifold.hull([...at(roof, BASE), ...at(roof, NAP(R.eave)), [R.ridgeX, -R.half, NAP(R.ridge)], [R.ridgeX, R.half, NAP(R.ridge)]])));
  const G = WEST_GABLE;
  const g = rect(G.x, [-G.half, G.half]);
  westParts.push(clip(Manifold.hull([...at(g, BASE), ...at(g, NAP(G.eave)), [G.x[0], 0, NAP(G.ridge)], [G.x[1], 0, NAP(G.ridge)]])));
}
// Ondervlakken die de controle toestaat: geen.
const cutters = [];
const counts = { nissen: 0, velden: 0, poorten: 0, rondvensters: 0, galerij: 0 };
for (const [k, side] of [[0, 1], [1, -1]]) {
  const T = WEST_TOWER;
  const c = [T.x, T.y[k]];
  const around = ([hx, hy]) => rect([c[0] - hx, c[0] + hx], [c[1] - hy, c[1] + hy]);
  const [hx, hy] = T.half;
  const o = T.cornice.overhang;
  const lantern = around([T.lantern.half, T.lantern.half]);
  const L = T.lantern.half;
  const S = T.spire.half;
  westParts.push(
    prism(around(T.half), BASE, NAP(T.cornice.top)),
    // Kroonlijst op een kraag van 53 graden, 0,3 m uit de gevel.
    Manifold.hull([...at(around(T.half), NAP(T.cornice.from)), ...at(around([hx + o, hy + o]), NAP(T.cornice.at)), ...at(around([hx + o, hy + o]), NAP(T.cornice.top))]),
    // Tentdak: van de kroonlijst steil omhoog naar de lantaarn.
    Manifold.hull([...at(around(T.skirt.half), NAP(T.cornice.top) - 0.3), ...at(lantern, NAP(T.skirt.top))]),
    prism(lantern, NAP(T.skirt.top) - 0.5, NAP(T.lantern.top)),
    // Vier topgevels: twee gekruiste zadeldaken op de lantaarn.
    Manifold.hull([...at(lantern, NAP(T.lantern.top) - 0.5), [c[0] - L, c[1], NAP(T.gables.top)], [c[0] + L, c[1], NAP(T.gables.top)]]),
    Manifold.hull([...at(lantern, NAP(T.lantern.top) - 0.5), [c[0], c[1] - L, NAP(T.gables.top)], [c[0], c[1] + L, NAP(T.gables.top)]]),
    // Ruitspits: vier vlakken met de graten boven de toppen van de topgevels,
    // de voet op de nokken en in de kilgoten tussen de topgevels.
    Manifold.hull([
      ...at(around([S, S].map((v) => v * 0.9)), NAP(T.lantern.top) - 0.5),
      [c[0] - S, c[1], NAP(T.gables.top)], [c[0] + S, c[1], NAP(T.gables.top)],
      [c[0], c[1] - S, NAP(T.gables.top)], [c[0], c[1] + S, NAP(T.gables.top)],
      [c[0], c[1], NAP(T.spire.tip)],
    ]),
  );
  // Gevels van de schacht: west, buiten, oost en binnen (naar de andere
  // toren). Velden tussen hoeklisenen per geleding met gekoppelde nissen;
  // aan de binnenkant alleen de bovenste geleding boven het dwarse dak.
  const faces = [
    { F: facade([c[0] - hx, c[1] - hy], [c[0] - hx, c[1] + hy], [-1, 0]), stages: [0, 1, 2], niches: [-1.3, 1.3] },
    { F: facade([c[0] - hx, c[1] + side * hy], [c[0] + hx, c[1] + side * hy], [0, side]), stages: [0, 1, 2], niches: [-2.6, 0, 2.6] },
    { F: facade([c[0] + hx, c[1] - hy], [c[0] + hx, c[1] + hy], [1, 0]), stages: [0, 1, 2], niches: [-1.3, 1.3] },
    { F: facade([c[0] - hx, c[1] - side * hy], [c[0] + hx, c[1] - side * hy], [0, -side]), stages: [2], niches: [-2.6, 0, 2.6] },
  ];
  for (const { F, stages, niches } of faces) {
    const mid = F.length / 2;
    for (const s of stages) {
      const [z0, z1] = T.stages[s];
      cutters.push(panel(F, T.corner, F.length - T.corner, z0, z1));
      counts.velden++;
      for (const du of niches) {
        cutters.push(cutF(F, pointed(mid + du, 1.6, z0 + 0.6, z1 - 0.5), PANEL_DEPTH + NICHE_DEPTH));
        counts.nissen++;
      }
    }
  }
  // Galmgaten in de lantaarn en een nis in elke topgevel.
  for (const [nx, ny] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const F = facade([c[0] + nx * L + ny * L, c[1] + ny * L - nx * L], [c[0] + nx * L - ny * L, c[1] + ny * L + nx * L], [nx, ny]);
    for (const du of T.lantern.openings.at) {
      cutters.push(cutF(F, pointed(L + du, T.lantern.openings.w, ...T.lantern.openings.z), NICHE_DEPTH));
      counts.nissen++;
    }
    cutters.push(cutF(F, pointed(L, T.gables.niche.w, ...T.gables.niche.z), NICHE_DEPTH));
    counts.nissen++;
  }
}
for (const t of EAST_TOWERS) {
  const E = EAST_TOWER;
  const r = rect(t.x, t.y);
  const c = [(t.x[0] + t.x[1]) / 2, (t.y[0] + t.y[1]) / 2];
  const o = E.overhang;
  const eave = rect([t.x[0] - o, t.x[1] + o], [t.y[0] - o, t.y[1] + o]);
  westParts.push(
    prism(r, BASE, NAP(E.shaft)),
    // Dakvoet op een kraag en de vierzijdige piramidespits.
    Manifold.hull([...at(r, NAP(E.shaft) - 0.4), ...at(eave, NAP(E.eave)), [c[0], c[1], NAP(E.tip)]]),
  );
  const side = Math.sign(c[1]);
  const yOut = side > 0 ? t.y[1] : t.y[0];
  const yIn = side > 0 ? t.y[0] : t.y[1];
  // Oost-, buiten- en westgevel: drie geledingen tussen hoeklisenen met één
  // venster, twee gekoppelde nissen en de galerij onder de dakvoet.
  const faces = [
    facade([t.x[1], yIn], [t.x[1], yOut], [1, 0]),
    facade([t.x[0], yOut], [t.x[1], yOut], [0, side]),
    facade([t.x[0], yIn], [t.x[0], yOut], [-1, 0]),
  ];
  for (const F of faces) {
    const mid = F.length / 2;
    E.stages.forEach(([z0, z1], s) => {
      cutters.push(panel(F, E.corner, F.length - E.corner, z0, z1, 0.25));
      counts.velden++;
      const niches = s === 0 ? [[0, 1.0]] : [[-0.6, 0.8], [0.6, 0.8]];
      for (const [du, w] of niches) {
        cutters.push(cutF(F, pointed(mid + du, w, z0 + 0.6, z1 - 0.5), 0.25 + NICHE_DEPTH));
        counts.nissen++;
      }
    });
  }
}
parts.push(Manifold.union(westParts));

// ---------- gevelreliëf ----------
// Apsis: velden tussen lisenen in twee rijen, drie vensters in de bovenste
// rij en de dwerggalerij. Elke uitsparing is de omhullende van punten op de
// hoeken en in het midden van zijn boog.
const apseCut = (deg0, deg1, z0, z1, depth) => {
  const r = APSE.radius;
  const rise = ((((deg1 - deg0) / 2) * Math.PI) / 180) * r * Math.tan(Math.PI / 3);
  const pts = [];
  for (const [deg, top] of [[deg0, z1 - rise], [(deg0 + deg1) / 2, z1], [deg1, z1 - rise]]) {
    const a = (deg * Math.PI) / 180;
    for (const rr of [r - depth, r + 1.5]) for (const z of [z0, top]) pts.push([rr * Math.cos(a), rr * Math.sin(a), NAP(z)]);
  }
  return Manifold.hull(pts);
};
{
  const A = APSE;
  const bay = (A.span[1] - A.span[0]) / A.bays;
  const lis = ((A.lisene / A.radius) * 180) / Math.PI;
  for (let k = 0; k < A.bays; k++) {
    const d0 = A.span[0] + k * bay + lis / 2;
    const d1 = A.span[0] + (k + 1) * bay - lis / 2;
    cutters.push(apseCut(d0, d1, ...A.lower, PANEL_DEPTH), apseCut(d0, d1, ...A.upper, PANEL_DEPTH));
    counts.velden += 2;
    if (k % 2 === 1) {
      const dm = (d0 + d1) / 2;
      const half = ((A.windows.w / 2 / A.radius) * 180) / Math.PI;
      cutters.push(apseCut(dm - half, dm + half, ...A.windows.z, PANEL_DEPTH + NICHE_DEPTH));
      counts.nissen++;
    }
  }
  const G = A.gallery;
  const step = (A.span[1] - A.span[0]) / G.count;
  const half = ((G.w / 2 / A.radius) * 180) / Math.PI;
  for (let k = 0; k < G.count; k++) {
    const dm = A.span[0] + (k + 0.5) * step;
    cutters.push(apseCut(dm - half, dm + half, ...G.z, G.depth));
    counts.galerij++;
  }
}
// Lichtbeuk: vensters tussen de luchtbogen, aan beide kanten.
for (const side of [-1, 1]) {
  const F = facade([NAVE.x[0], side * NAVE.half], [NAVE.x[1], side * NAVE.half], [0, side]);
  for (const x of CLERESTORY.u) {
    cutters.push(cutF(F, pointed(x - NAVE.x[0], CLERESTORY.w, ...CLERESTORY.z), NICHE_DEPTH));
    counts.nissen++;
  }
}
// Vensters in de topgevels van het transept: twee naast elkaar en één
// erboven; aan de noordkant pas boven het pand ten noorden ervan.
for (const [y, ny, lo, hi] of [[TRANSEPT.y[1], 1, 66.5, 71.5], [TRANSEPT.y[0], -1, 58.0, 68.0]]) {
  const F = facade([TRANSEPT.x[0], y], [TRANSEPT.x[1], y], [0, ny]);
  const mid = TRANSEPT.ridgeX - TRANSEPT.x[0];
  for (const dx of [-3.2, 3.2]) cutters.push(cutF(F, pointed(mid + dx, 1.8, lo, hi), 0.5, 0.6));
  cutters.push(cutF(F, pointed(mid, 2.4, 73.0, 79.0), 0.5, 0.6));
  counts.nissen += 3;
}
// Zuidelijke kapellen: velden tussen de steunberen (onder de kilgoten) met
// een plint en een spits venster per kapel.
{
  const F = facade([-53.01, -18.23], [-27.08, -18.01], [0, -1]);
  const piers = [-53.4, -48.5, -43.5, -38.5, -33.5, -27.4];
  for (let k = 0; k < piers.length - 1; k++) {
    const u0 = piers[k] + 0.5 - F.a[0];
    const u1 = piers[k + 1] - 0.5 - F.a[0];
    cutters.push(panel(F, u0, u1, 55.2, 64.6));
    cutters.push(cutF(F, pointed((u0 + u1) / 2, Math.min(2.8, u1 - u0 - 1.0), 56.4, 63.8), PANEL_DEPTH + NICHE_DEPTH));
    counts.velden++;
    counts.nissen++;
  }
}
// Bergportaal: de poortopening met drie vensters erboven, en een venster in
// de kapel ernaast.
{
  const F = facade([-70.77, -25.02], [-60.98, -24.88], [0, -1]);
  const mid = SOUTH_GABLES[0].ridgeX - F.a[0];
  cutters.push(cutF(F, pointed(mid, PORTAL.w, ...PORTAL.z, 50), PORTAL.depth));
  counts.poorten++;
  for (const du of PORTAL.windows.at) {
    cutters.push(cutF(F, pointed(mid + du, PORTAL.windows.w, ...PORTAL.windows.z), NICHE_DEPTH));
    counts.nissen++;
  }
  const C = facade([-57.95, -24.62], [-52.96, -24.67], [0, -1]);
  cutters.push(cutF(C, pointed(C.length / 2, 2.2, 56.0, 63.6), NICHE_DEPTH));
  counts.nissen++;
}
// Westgevel van het westwerk: plint, zeven traveeën met de toegang en het
// grote roosvenster in het midden en vensters ernaast, een rij blinde bogen
// en een rij rondvensters;
// het roosvenster in de topgevel van het korte zadeldak.
{
  const W = WEST_FRONT;
  const F = facade([-84.16, 17.9], [-84.66, -16.42], [-1, 0]);
  const pitch = (F.length - W.pier) / W.bays;
  for (let k = 0; k < W.bays; k++) {
    const u0 = W.pier + k * pitch;
    const u1 = (k + 1) * pitch;
    const uc = (u0 + u1) / 2;
    cutters.push(cutF(F, pointed(uc, u1 - u0, ...W.lower, 50), PANEL_DEPTH), cutF(F, pointed(uc, u1 - u0, ...W.arcade, 50), PANEL_DEPTH));
    counts.velden += 2;
    if (k === 3) {
      cutters.push(cutF(F, pointed(uc, W.door.w, ...W.door.z), W.door.depth));
      cutters.push(cutF(F, oculus(uc, W.rose.z, W.rose.r), PANEL_DEPTH + NICHE_DEPTH));
      counts.poorten++;
      counts.rondvensters++;
    } else {
      cutters.push(cutF(F, pointed(uc, W.windows.w, ...W.windows.z), PANEL_DEPTH + NICHE_DEPTH));
      counts.nissen++;
    }
    cutters.push(cutF(F, oculus(uc, W.oculus.z, W.oculus.r), NICHE_DEPTH));
    counts.rondvensters++;
  }
  // Het roosvenster op de as (u = 17,9 m vanaf de noordhoek).
  const G = WEST_GABLE;
  cutters.push(cutF(F, oculus(17.9, G.rose.z, G.rose.r), NICHE_DEPTH));
  counts.rondvensters++;
  // Zuidgevel van het westwerk: vier blinde bogen en drie vensters erboven.
  const S = facade([-84.66, -16.42], [-70.66, -16.71], [0, -1]);
  const sp = (S.length - 1.0) / 4;
  for (let k = 0; k < 4; k++) {
    const u0 = 1.0 + k * sp;
    const u1 = (k + 1) * sp;
    cutters.push(cutF(S, pointed((u0 + u1) / 2, u1 - u0, 56.8, 65.6, 50), PANEL_DEPTH));
    counts.velden++;
  }
  for (const k of [1, 2, 3]) {
    cutters.push(cutF(S, pointed((k * S.length) / 4, 1.3, 67.6, 71.8), NICHE_DEPTH));
    counts.nissen++;
  }
}
// Kruisgang: spitse vensters naar de pandhof, en vensters in de straatgevels
// van de westvleugel en de noordvleugel.
{
  const P = PANDHOF;
  const sides = [
    [P[0], P[1], [1, 0]],
    [P[1], P[2], [0, -1]],
    [P[2], P[3], [-1, 0]],
    [P[3], P[4], [0, 1]],
  ];
  for (const [a, b, n] of sides) {
    const F = facade(a, b, n);
    const count = Math.floor((F.length - 2.0) / 4.0);
    const start = (F.length - (count - 1) * 4.0) / 2;
    for (let k = 0; k < count; k++) {
      cutters.push(cutF(F, pointed(start + k * 4.0, 2.0, 54.0, 59.2), NICHE_DEPTH));
      counts.nissen++;
    }
  }
  for (const [a, b, n, rows] of [
    [[-80.22, 17.92], [-75.6, 56.9], [-1, 0], [[55.4, 58.4], [59.0, 61.6]]],
    [[-28.11, 68.48], [-58.07, 69.82], [0, 1], [[54.2, 57.2], [57.8, 59.8]]],
  ]) {
    const F = facade(a, b, n);
    const count = Math.floor((F.length - 2.0) / 3.5);
    const start = (F.length - (count - 1) * 3.5) / 2;
    for (let k = 0; k < count; k++) {
      for (const z of rows) cutters.push(cutF(F, pointed(start + k * 3.5, 1.4, ...z), 0.7));
      counts.nissen += rows.length;
    }
  }
}
console.log("gevelreliëf:", counts);

const church = Manifold.union(parts).subtract(Manifold.union(cutters));
const nodes = [["building:sint-servaasbasiliek", church]];

// ---------- controles ----------
if (church.status() !== "NoError") throw new Error(church.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // geen enkele (kraag, nissen en bogen lopen onder 53 tot 60 graden).
  const mesh = church.getMesh();
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
  console.log("ondervlakken (lokale z: m2):", Object.fromEntries(levels), `totaal ${total.toFixed(3)} m2`);
  for (const [z, area] of levels) if (area > 0.01) throw new Error(`overhang op z ${z}: ${area.toFixed(3)} m2`);
  const bb = church.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
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
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "sint-servaasbasiliek.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-sint-servaasbasiliek.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `sint-servaasbasiliek-1-${scale}.stl`);
const printSolid = church.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Sint-Servaasbasiliek Maastricht 1:${scale} mm Z-up`);
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
  path.join(outDir, "sint-servaasbasiliek.json"),
  JSON.stringify(
    {
      name: "Sint-Servaasbasiliek",
      file: "sint-servaasbasiliek.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld aan het Vrijthof rond de apsis en de oosttorens (NAP
      // +52,2 tot +52,6 m), niet bij het 3 m hogere westwerk.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0935100000017126"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (176166,22, 317708,25), in het hart van de apsis, op het maaiveld aan het Vrijthof (NAP +52,3 m), +X langs de as van het westwerk naar de apsis (RD-richting 13,8 graden, ten noorden van oost) en +Y naar het noordnoordwesten; het westwerk staat aan de -X-kant aan de Sint Servaasklooster, de pandhof aan de +Y-kant. Eén node building: alles binnen de BAG-contour tot NAP +60 m met de kloostergang rond de pandhof (de dubbele westvleugel met nokken op +67 en +64,2 m, de noordvleugel +66,1 m, de oostgalerij +64,1 m, de zuidgalerij onder een lessenaarsdak, spitse vensters naar de pandhof en in de straatgevels), het pand ten noorden van het transept (nok +65,8 m), het smalle pand ten noorden van de noordvleugel en de aanbouwen ten oosten van het transept (lessenaarsdaken +66,6 naar +64,6 m, plat +69,2 m); het middenschip en het koor onder één zadeldak (goot +74,6 m, nok +82 m) met vensternissen in de lichtbeuk, de zijbeuken met een lessenaarsdak (+68,6 naar +65,2 m), vier luchtbogen per kant als steunberen met pinakels, de gotische kapellen met zes (zuid, nok +68,7 m) en zeven (noord, +67,5 m) dwarse zadeldaken met topgevels, aan de zuidkant met een borstwering, pinakels en spitse vensters tussen steunberen; het Bergportaal onder een dwars zadeldak (nok +70 m) met een spitse poortopening van 6 m breed en 1,5 m diep en drie vensters erboven, en de kapel ernaast (+68,6 m); het transept (goot +73,6 m, nok +82 m) met vensternissen in de topgevels; de apsis met twee rijen van zeven blinde bogen tussen lisenen, drie vensters, de dwerggalerij als band van tien nissen en een kegeldak (goot +70,8 m); de twee oosttorens met drie geledingen tussen hoeklisenen, een dakvoet op een kraag (+88,3 m) en een vierzijdige piramidespits tot +92,6 m; en het westwerk: het blok met een laag schilddak (goot +74,6 m, +76,6 m), de westgevel met de toegang onder een groot roosvenster, zeven blinde bogen in twee rijen en zeven rondvensters, de zuidgevel met vier blinde bogen, een kort zadeldak met een roosvenster naar het westen (+80 m) en een dwars zadeldak tussen de torens (+83,8 m), en de twee westtorens van 10 × 7,4 m met drie geledingen tussen hoeklisenen met gekoppelde nissen, een kroonlijst op een kraag op +93 m die 0,3 m uitkraagt, een steil tentdak, de leien lantaarn met twee galmgaten per zijde, vier topgevels (+101,8 m) en een vierzijdige ruitspits tot NAP +108 m (56 m boven het Vrijthof). Alles staat recht op of loopt schuin omhoog; nissen, bogen en poorten hebben een spitse bovenkant van 50 tot 60 graden en kraag en velden een schuine onderkant van 53 tot 55 graden, zodat geen vlak vlakker dan 45 graden naar beneden wijst en het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0935100000017126. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`sint-servaasbasiliek-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        naveRidgeNapM: NAVE.ridge,
        naveEaveNapM: NAVE.eave,
        transeptRidgeNapM: TRANSEPT.ridge,
        chapelRidgesNapM: CHAPELS.map((c) => c.ridge),
        bergportaalRidgeNapM: SOUTH_GABLES[0].ridge,
        apseEaveNapM: APSE.eave,
        westworkNapM: WESTWORK.top,
        westTowerShaftNapM: WEST_TOWER.cornice.top,
        westTowerGablesNapM: WEST_TOWER.gables.top,
        westTowerTipNapM: WEST_TOWER.spire.tip,
        eastTowerEaveNapM: EAST_TOWER.eave,
        eastTowerTipNapM: EAST_TOWER.tip,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Sint-Servaasbasiliek_(Maastricht)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/27168",
        "PDOK BAG pand 0935100000017126 (contour met de pandhof), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS, als raster per 0,5 m in het stelsel langs de as: nok en goten van schip, koor en transept, lessenaarsdak van de zijbeuken, nokken en kilgoten van de kapeldaken, luchtbogen, Bergportaal, apsis, oosttorens, daken van het westwerk, raster van de westtorens, daken van de kloostervleugels, maaiveld",
        "Wikimedia Commons: Kerk, overzicht vanaf de toren Sint Janskerk (RCE 20146024); Maastricht Sint Janskerk Blick vom Turm auf die Servaasbasiliek 2 tot 4; Exterieur lichtbeuk van het schip zuid-zijde (RCE 20146027); 2016 Maastricht, St-Servaasbasiliek, oostpartij 01 tot 05 en westwerk 01 tot 05; 2018 Maastricht, St-Servaasbasiliek, zuidfaçade; St-Servaasbasiliek, zuidelijke zijkapellen 01 en 03; St-Servaasbasiliek, pandhof, noordelijke zijkapellen 02; Maastricht Basiliek Sint Servaas 05 en Türme; 2010.07.20.125743 St. Servaasbasiliek Maastricht; Maastricht RK Servaasbasiliek Buitenzijde West 1474, Noord 7689, Zuid 7651, Zuidwest 1476",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een gesloten 3D-model van de Kathedrale Basiliek Sint Bavo in
// Haarlem (Joseph Cuypers, 1895-1930) uit dakvlakken en bouwdelen: het
// kruisvormige schip met zijbeuken en buitenbeuken onder lessenaarsdaken, het
// dwarsschip met topgevels en hoektorentjes, de koepel (een omwentelingsprofiel)
// op een trommel boven de viering met vier torentjes, het koor met de apsis
// onder een kegeldak, de zeven straalkapellen met kegelvormige daken en
// steunberen, de twee platte westtorens (tot +53 m) met het voorportaal en het
// bisschoppelijk huis (het zuidoostelijke bijgebouw in hetzelfde BAG-pand).
// Alle daken van de kerk zijn rechte vlakken: schip, dwarsschip en koor hebben
// dezelfde nok (+32,15 m) en helling (50,5 graden), de beuken lessenaarsdaken
// op een vaste goot. Het Mapbox-model is niet gebruikt. Alle maten in het
// script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-kathedraal-sint-bavo.mjs              # 1:1000 (standaard)
//   node scripts/generate-kathedraal-sint-bavo.mjs --scale 2000
//   node scripts/generate-kathedraal-sint-bavo.mjs --components  # stukken tellen
//
// Assenstelsel: oorsprong op RD (102902,83, 487903,14), het zwaartepunt van het
// BAG-pand, op maaiveldniveau (NAP +0,5 m), Z omhoog. +X loopt langs de as van
// het schip naar het oostzuidoosten (-11 graden vanaf de RD-X-as, met de klok
// mee) en +Y loodrecht daarop naar het noordnoordoosten. De as van het schip
// ligt op Y = 3,05 m (in het script is y = Y - 3,05, de kerk is spiegelsymmetrisch
// om y = 0); de torens staan aan de westkant (X -45 tot -35 m), het dwarsschip op
// X = 1,97 m en de apsis in het oosten rond X = 30 m. De eerdere versie gebruikte
// -24 graden; het AHN-DSM (de nokken en goten) laat zien dat de kerk op -11 graden
// ligt, en dan staan alle bouwdelen netjes op de assen.
//
// Bronnen: PDOK BAG-pand 0392100000020499 (de basiliek met het bisschoppelijk
// huis); AHN DSM/DTM 0,5 m (PDOK WCS): vlakfits van de dakvlakken (helling,
// nokken, goten), het radiale profiel van de koepel en de hoogtes van torens
// en kapellen; Wikipedia en de foto's van Wikimedia Commons (o.a. RCE) voor de
// opbouw; PDOK luchtfoto. Geschat zijn de kapel- en torendaken waar het AHN ze
// niet ziet (leien daken met gaten in het DSM). Weggelaten: de dakkapellen, de
// vensters, de kantelen op de torens en alle gevelreliëf onder 0,9 m.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kathedraal-sint-bavo");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const alongX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const alongY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Spiegelt een halfprofiel [y, z] (y > 0) in het vlak y = 0 tot een gesloten veelhoek.
const mirrorY = (half) => [...half, ...[...half].reverse().map(([y, z]) => [-y, z])];
// Omwentelingslichaam om de verticale as door (cx, cy); profiel [straal, z].
const revolve = (profile, [cx, cy], segments = 48) =>
  Manifold.revolve(new CrossSection([ccw(profile)]), segments).translate([cx, cy, 0]);
const rad = (deg) => (deg * Math.PI) / 180;

const SLUG = "kathedraal-sint-bavo";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP 0,5 m) ----------
const GROUND_NAP = 0.5;
const ORIGIN = [102902.83, 487903.14];
const ANGLE = -11; // graden vanaf de RD-X-as: de as van het schip
const X_AXIS = [+Math.cos(rad(ANGLE)).toFixed(6), +Math.sin(rad(ANGLE)).toFixed(6)];
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// De as van het schip ligt op Y = 3,05 m; hieronder is y = Y - 3,05 (symmetrisch).
const AXIS_Y = 3.05;

// Dakvlakken van schip, dwarsschip en koor: een nok op +32,15 m en een helling van
// 50,5 graden (vlakfit op het DSM: 1,206 tot 1,225 m per m), goten op +22,5 m.
const RIDGE = 32.15;
const HALF = 7.95; // halve breedte van het schip (van de nok tot de goot)
const EAVE = 22.5;
const HALF_S = 8.3; // de zuidgoot ligt 0,35 m verder van de nok (DSM: goot op Y -5,3)
const EAVE_S = 22.08;
const XC = 1.97; // as van het dwarsschip en middelpunt van de koepel

// ---------- bouwdelen ----------
const solids = [];
const add = (...items) => solids.push(...items);
const flipY = (pts) => pts.map(([y, z]) => [-y, z]);
// Torentje of spits: cilinder tot zWall en een kegel (afgeknot op tipR) tot zTip.
const turret = (x, y, r, zWall, zTip, tipR = 0.45) =>
  revolve([[0, BASE], [r, BASE], [r, zWall], [tipR, zTip], [0, zTip]], [x, y], 32);
// Torentje met een gebogen kap: tussenpunten [straal, z] boven de muur met een bolle kap.
const domedTurret = (x, y, r, zWall, caps) =>
  revolve([[0, BASE], [r, BASE], [r, zWall], ...caps, [0, caps[caps.length - 1][1]]], [x, y], 32);

// Schip: zadeldak met de nok langs de as, van de westgevel tot de apsis.
const NAVE_X = [-43.5, 30.05];
add(alongX([[-HALF_S, BASE], [HALF, BASE], [HALF, EAVE], [0, RIDGE], [-HALF_S, EAVE_S]], ...NAVE_X));

// Dwarsschip: hetzelfde zadeldak met de nok langs Y, noord- en zuidgevel met topgevel.
const TRANSEPT_E = 10.1; // oostgoot (DSM: u 10,1), westgoot op u -6,0
const TRANSEPT_Y = [-23.35, 21.5];
add(alongY([[XC - HALF, BASE], [TRANSEPT_E, BASE], [TRANSEPT_E, 22.2], [XC, RIDGE], [XC - HALF, EAVE]], ...TRANSEPT_Y));

// Zijbeuken: halfprofielen [y, z] vanaf de beukwand: een plat stuk op +18 m,
// het lessenaarsdak tot de goot op +16,4 m, de buitenbeuk lager tot +7 m.
const AISLE_WEST = [[7, BASE], [21.4, BASE], [21.4, 7.1], [15.45, 10.7], [15.45, 16.4], [11.4, 18.0], [7, 18.0]];
add(alongX(AISLE_WEST, -37, -5.9), alongX(flipY(AISLE_WEST), -37, -5.9));

// Koor oost van het dwarsschip: noordzijde (vleugel tot Y 21,15 met een lang lessenaarsdak
// en daarachter de gewone buitenbeuk) en zuidzijde.
const CHOIR_X = [9.85, 30.05];
add(alongX([[7, BASE], [21.15, BASE], [21.15, 15.6], [17.45, 18.0], [7, 18.0]], CHOIR_X[0], 19.9));
add(alongX([[7, BASE], [21.15, BASE], [21.15, 8.3], [16.2, 10.1], [15.2, 11.6], [15.2, 16.4], [11.4, 18.0], [7, 18.0]], 19.8, CHOIR_X[1]));
add(
  alongX(
    flipY([[7, BASE], [22.3, BASE], [22.3, 8.0], [21.3, 10.0], [15.4, 11.4], [15.4, 16.4], [11.4, 18.0], [7, 18.0]]),
    CHOIR_X[0],
    CHOIR_X[1],
  ),
);

// ---------- westgevel ----------
// Twee torens: stenen schachten van 10 m tot +30 m en daarboven versmald tot 8,7 m
// (DSM: 10 m bij +30 m, 8,75 m bij +52 m), platte top op +53,5 m (het DSM is er vlak op 53,4 m).
const tower = (y) => {
  const ring = (h, z) => [[-39.85 - h, y - h, z], [-39.85 + h, y - h, z], [-39.85 + h, y + h, z], [-39.85 - h, y + h, z]];
  return Manifold.hull([...ring(5.05, BASE), ...ring(5.05, 30), ...ring(4.4, 53.5)]);
};
add(tower(10.9), tower(-11.1));
// Middenpartij tussen de torens: portaalwand met een omloop op +20,7 m en de wand tot de topgevel.
add(alongY([[-46.1, BASE], [-46.1, 21.5], [-44.9, 21.5], [-44.9, 26.8], [-43.4, 26.8], [-43.4, BASE]], -6.3, 6.3));
// Voorbouw (westwerk): zadeldak met de nok langs Y op X -50,9, drie dwarsdaken
// (het middelste hoger, de twee zijdaken op de as van de torens) en twee hoektorentjes.
add(alongY([[-54.15, BASE], [-44.4, BASE], [-44.4, 6.2], [-47.55, 6.2], [-50.9, 8.9], [-54.15, 6.1]], -15.6, 15.5));
add(alongX([[-4.0, BASE], [4.0, BASE], [4.0, 6.0], [0, 10.1], [-4.0, 6.0]], -54.15, -44.4));
for (const y of [11.0, -11.0]) {
  add(alongX([[y - 2.4, BASE], [y + 2.4, BASE], [y + 2.4, 6.1], [y, 8.9], [y - 2.4, 6.1]], -50.9, -44.4));
}
add(turret(-53.9, 14.95, 1.25, 6.5, 9.4), turret(-53.9, -14.95, 1.25, 6.5, 9.4));
// Zuidwest: portaal met een zadeldak (nok langs Y op +11,2 m); noordwest: de ronde doopkapel.
add(alongY([[-44.85, BASE], [-44.85, 6.9], [-43.4, 6.9], [-39.9, 11.2], [-36.4, 6.9], [-34.95, 6.9], [-34.95, BASE]], -25.85, -15.7));
add(revolve([[0, BASE], [4.7, BASE], [4.7, 10.7], [0.5, 15.2], [0, 15.2]], [-39.7, 19.65]));
// Noord: lage verbindingsbouw met een plat dak op +3,7 m.
add(box(-32.2, -11.6, 20.0, 27.7, BASE, 3.7));

// ---------- viering ----------
// Koepel met trommel: omwentelingsprofiel [straal, z] naar het radiale DSM-profiel
// (mediaan over de hoeken, de torentjes uitgezonderd): trommel tot +41,6 m, de
// koepel in spitsboogvorm, de lantaarn en de bol op +58,3 m (afgeknot op 0,9 m breed);
// onderaan loopt de trommel uit tot een voetstuk van 8,5 m straal op +30,5 m.
const DOME = [
  [0, BASE], [8.5, BASE], [8.5, 30.5], [8.25, 31.2], [8.0, 32.6], [7.8, 35.4], [7.65, 38.5], [7.65, 41.6], [7.1, 42.5], [6.75, 43.8], [6.5, 44.75], [6.0, 46.2], [5.5, 47.4],
  [5.0, 48.5], [4.5, 49.55], [4.0, 50.5], [3.5, 51.4], [3.0, 52.2], [2.5, 53.05], [2.0, 53.9], [1.5, 55.3],
  [1.0, 56.7], [0.45, 58.3], [0, 58.3],
];
add(revolve(DOME, [XC, 0], 72));
// Vier torentjes op de hoeken van de viering.
for (const sx of [-1, 1]) for (const sy of [-1, 1]) add(turret(XC + sx * 6.5, sy * 6.5, 1.9, 33.8, 36.4, 0.6));
// Torentjes op de hoeken van de dwarsschipgevels (kap volgens het radiale DSM-profiel).
const CORNER_CAP = [[1.5, 28.4], [1.0, 29.5], [0.6, 30.6], [0.45, 31.4]];
for (const sx of [-1, 1]) {
  add(domedTurret(XC + sx * 7.2, 22.15, 2.0, 26.3, CORNER_CAP), domedTurret(XC + sx * 7.2, -22.45, 2.0, 26.3, CORNER_CAP));
}
// Voorportalen aan de noord- en zuidgevel van het dwarsschip: een steil dak tegen de
// gevel dat tot de vensterbanken (+22 m) oploopt (het DSM ziet het van +9 m tot +30 m
// over 3 m) en daarvoor aan de noordkant een plat dak; aan de zuidkant twee zadeldaken
// met de nok langs Y.
add(alongX([[21.0, BASE], [27.45, BASE], [27.45, 7.0], [26.4, 8.9], [24.15, 8.9], [21.7, 22.0], [21.0, 22.0]], -2.0, 6.7));
add(alongX([[21.0, BASE], [24.15, BASE], [24.15, 8.9], [21.7, 22.0], [21.0, 22.0]], -3.4, 7.4));
add(alongY([[-1.0, BASE], [-1.0, 6.0], [1.8, 10.3], [4.2, 8.1], [6.7, 10.4], [10.3, 5.0], [10.3, BASE]], -30.95, -23.0));
add(alongX([[-23.0, BASE], [-26.3, BASE], [-26.3, 10.3], [-23.0, 22.0]], -0.8, 10.3));
// Zuidvleugel met een zadeldak langs X (nok op Y -25,55).
add(alongX([[-22.2, BASE], [-22.2, 7.5], [-25.55, 10.2], [-29.45, 5.2], [-29.45, BASE]], 10.0, 22.2));

// ---------- koor, apsis en straalkapellen ----------
// Torentjes aan de oostgevel van het schip.
const CHOIR_CAP = [[1.5, 20.0], [1.0, 23.0], [0.6, 24.7], [0.45, 25.4]];
const CHOIR_SPIRE = [[1.2, 21.4], [0.9, 25.6], [0.6, 28.8], [0.45, 30.7]];
add(domedTurret(29.25, 14.4, 1.8, 17.0, CHOIR_CAP), domedTurret(29.25, -14.45, 1.8, 17.0, CHOIR_CAP));
add(domedTurret(29.25, 8.05, 1.55, 19.0, CHOIR_SPIRE), domedTurret(29.45, -7.9, 1.55, 19.0, CHOIR_SPIRE));
// Apsis: halve cilinder met een kegeldak (helling 47,7 graden, z = 28,8 - 1,1 r) en een spits.
const APSE_C = [30.0, 0];
const R_APSE = 8.0;
const apse = revolve([[0, BASE], [R_APSE, BASE], [R_APSE, 20.0], [0.9, 27.8], [0.45, 31.4], [0, 31.4]], APSE_C, 64);
add(Manifold.intersection(apse, box(29.95, 40, -10, 10, BASE - 1, 40)));
// Zeven kapellen (hartlijnen elke 360/14 graden) met een horizontale nok op +13,3 m, de
// dakvlakken zakken naar de dalen op de scheidingen (z uit het DSM per straal) en
// een kegelvormig uiteinde; de middelste (Mariakapel) is langer. Tussen de kapellen
// staan zes steunberen met een aflopende kop.
const polar = (r, deg, lateral = 0) => {
  const a = rad(deg);
  return [APSE_C[0] + r * Math.cos(a) - lateral * Math.sin(a), APSE_C[1] + r * Math.sin(a) + lateral * Math.cos(a)];
};
const STEP_DEG = 360 / 14;
// Dakgoten naast de nok: [straal, zijwaartse afstand, z]; het dakvlak loopt van de
// nok (+13,3 m) onder 45 graden naar de goot en de steunberen staan op de scheidingen.
const GUTTER = [[7.4, 0.9, 12.3], [10, 1.4, 12.2], [12, 1.8, 11.6], [14, 2.25, 11.4], [14.7, 3.5, 10.8], [16.4, 3.85, 9.7]];
const chapel = (phi, ridgeEnd, capR = 3.8) => {
  const pts = [];
  const put = ([x, y], z) => pts.push([x, y, z], [x, y, BASE]);
  put(polar(7.4, phi), 13.3);
  put(polar(ridgeEnd, phi), 13.3);
  for (const side of [-1, 1]) {
    // De buitenste kapellen sluiten aan op het koor: aan die kant tot de scheiding.
    const flank = Math.abs(phi) > 70 && Math.sign(phi) === side;
    for (const [r, lat, z] of GUTTER) put(polar(r, phi, side * (flank ? r * Math.tan(rad(STEP_DEG / 2 + 0.2)) : lat)), z);
    if (ridgeEnd > 17) put(polar(ridgeEnd, phi, side * capR), 9.7);
  }
  for (let a = -90; a <= 90; a += 15) {
    const [px, py] = polar(ridgeEnd, phi);
    put([px + capR * Math.cos(rad(phi + a)), py + capR * Math.sin(rad(phi + a))], 8.7);
  }
  return Manifold.hull(pts);
};
for (let k = -3; k <= 3; k++) add(chapel(k * STEP_DEG, k === 0 ? 20.6 : 16.4));
// Steunberen op de scheidingen: de kop loopt van de apsis (+20,7 m) af naar +13,2 m en
// draagt daarna een pinakel (+16,3 m) boven de goten; profiel [straal, z], 2,2 m breed.
const BUTTRESS = [[7.4, BASE], [14.7, BASE], [14.7, 14.5], [14.1, 16.3], [13.3, 16.2], [12.8, 13.2], [11.0, 13.5], [9.0, 17.0], [7.4, 20.2]];
const buttress = (psi) => {
  const a = rad(psi);
  return Manifold.extrude(new CrossSection([ccw(BUTTRESS)]), 2.2)
    .translate([0, 0, -1.1])
    .transform([Math.cos(a), Math.sin(a), 0, 0, 0, 0, 1, 0, -Math.sin(a), Math.cos(a), 0, 0, APSE_C[0], APSE_C[1], 0, 1]);
};
for (let j = 0; j < 6; j++) add(buttress((j - 2.5) * STEP_DEG));
// Trapjes-torentjes met een kegeldak bij de uiteinden van de middelste kapel.
const END_CAP = [[1.5, 12.1], [1.0, 14.5], [0.5, 16.8], [0.45, 17.9]];
for (const side of [-1, 1]) {
  const [x, y] = polar(18.9, side * 14.2);
  add(domedTurret(x, y, 1.9, 10.8, END_CAP));
}
// Kleine torentjes in de buitenbeuken van het koor.
add(turret(19.3, 14.6, 0.9, 17.5, 21.0), turret(19.4, 20.7, 1.0, 18.0, 22.3));
add(turret(19.3, -21.55, 0.9, 10.5, 13.7), turret(24.0, -21.6, 0.9, 10.5, 13.7));

// ---------- bisschoppelijk huis (zuidoostelijk bijgebouw in hetzelfde pand) ----------
// Hoofdvolume met een plat dak op +14,3 m en aan de zuidzijde een schuine rand,
// westvleugel met een zadeldak langs X, het oostelijke schilddak met een nok op +17,1 m
// en de ronde hoektoren met een kegeldak.
add(alongX([[-23.2, BASE], [-37.65, BASE], [-37.65, 10.5], [-34.25, 14.3], [-23.2, 14.3]], 27.2, 44.3));
add(alongX([[-29.85, BASE], [-29.85, 10.7], [-33.65, 15.2], [-37.5, 10.9], [-37.5, BASE]], 21.8, 27.4));
add(box(21.8, 24.2, -29.9, -23.25, BASE, 8.8), box(24.0, 27.4, -29.9, -23.25, BASE, 10.8));
add(box(19.2, 22.0, -38.65, -31.65, BASE, 5.6));
add(box(21.4, 28.0, -23.4, -21.4, BASE, 7.0));
add(
  Manifold.hull([
    [37.15, -37.05, BASE], [46.45, -37.05, BASE], [46.45, -23.1, BASE], [37.15, -23.1, BASE],
    [37.15, -37.05, 11.4], [46.45, -37.05, 11.4], [46.45, -23.1, 11.4], [37.15, -23.1, 11.4],
    [41.8, -32.3, 17.1], [41.8, -27.9, 17.1],
  ]),
);
add(box(44.0, 48.5, -28.7, -23.1, BASE, 12.4));
add(revolve([[0, BASE], [2.5, BASE], [2.5, 13.5], [0.5, 18.1], [0, 18.1]], [44.3, -35.15], 32));
add(box(21.9, 27.9, -41.25, -37.0, BASE, 5.8), box(38.0, 43.3, -40.25, -37.0, BASE, 4.4));

// Maaiveld (AHN NAP +0,4 tot +0,6 m) op open grond rond het gebouw.
const GROUND_SAMPLES = [[-62, 0], [10, -38], [0, 42], [60, 0]];

// ---------- gebouw ----------
const complex = Manifold.union(solids).translate([0, AXIS_Y, 0]);
const nodes = [["building:kathedraal", complex]];
const all = complex;

const META = {
  name: "Kathedrale Basiliek Sint Bavo",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0392100000020499"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (102902,83, 487903,14), het zwaartepunt van het BAG-pand, op het maaiveld (NAP +0,5 m), +X langs de as van het schip naar het oostzuidoosten (-11 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noordnoordoosten. Eén node building:kathedraal uit dakvlakken en bouwdelen: schip, dwarsschip en koor onder zadeldaken van 50 graden (nok +32 m), zijbeuken en buitenbeuken onder lessenaarsdaken, de koepel boven de viering met trommel (tot +58 m), vier torentjes op de viering en de dwarsschipgevels, het koor met de apsis onder een kegeldak, zeven straalkapellen met kegelvormige uiteinden en steunberen, de twee platte westtorens (+53,5 m) met het westwerk en het bisschoppelijk huis aan de zuidoostzijde. Onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van het pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {"naveRidgeM": 32.15, "naveEaveM": 22.5, "aisleRoofM": [7, 18], "towersTopM": 53.5, "domeTopM": 58.3, "groundNapM": 0.5, "baseM": -0.5},
  sources: [
      "https://nl.wikipedia.org/wiki/Kathedrale_basiliek_Sint_Bavo",
      "PDOK BAG pand 0392100000020499, EPSG:28992",
      "PDOK AHN DSM/DTM 0,5 m via WCS: vlakfits van de dakvlakken, het radiale profiel van de koepel en de maaiveldhoogte",
      "PDOK luchtfoto (Actueel_orthoHR) en foto's van Wikimedia Commons (o.a. RCE) voor de opbouw van het koor en de kapellen"
  ],
};

// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (meer dan een regel betekent meer dan een stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
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
  const gltfNodes = [];
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
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
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
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

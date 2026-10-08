// Genereert een vereenvoudigd, gesloten 3D-model van Max & Moritz in de
// Efteling (Kaatsheuvel, Anderrijk): de dubbele aangedreven familie-achtbaan
// (powered coaster) van MACK Rides uit 2020, op de plek van de Bob (1985-2019).
// Twee banen van elk ca. 300 m, Max (blauw) en Moritz (groen), met de treinen
// in tegengestelde richting; hoogste punt van de rails ca. 5,2 m boven het plein, geen
// lift-heuvel (de treinen rijden op een eigen motor), wel drie opgaande
// helixen ("Bayern-Kurve") en vijf kruisingen waar de banen over en onder
// elkaar door lopen. Het model bevat beide banen met hun steunen, het
// stationsgebouw (de werkplaats van Frau Schmetterling, gebouwd om het oude
// Bob-station uit 1985) met de school van meester Lämpel en zijn
// klokkentorentje, en de overkapte delen van de wachtrij. Alle maten in
// meters op ware grootte.
//
//   node scripts/generate-efteling-max-en-moritz.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-max-en-moritz.mjs --scale 500
//   node scripts/generate-efteling-max-en-moritz.mjs --faces      # ondervlakken per node
//
// Assenstelsel: oorsprong op RD (131483, 406637), het midden van het
// stationsgebouw, op het maaiveld van het Max & Moritz Plein (NAP +9,25 m),
// Z omhoog, +X langs de lengteas van het station en de sporen erin naar het
// oost-zuidoosten (16,5° rechtsom van RD-oost), +Y 90° linksom daarop
// (noord-noordoost, de baankant). Het script rekent de baanpunten in RD
// (oost, noord, NAP) om naar dat stelsel.
//
// Baan: per spoor een dichte band van 1,3 m breed met een driehoekige kiel
// tot 0,9 m onder de bovenkant van de rails (zijvlakken onder 54°, zoals de
// vakwerkligger van de MACK-baan; dus geen overhang tussen de steunen), langs
// een Catmull-Rom-spline door de controlepunten, in bochten tot 9° gekanteld.
// Daaronder een steunwand van 0,9 m dik met spitse openingen om de ~3 m
// (poten van 0,9 m, zijden onder 55°): de abstractie van de 212 groene
// kolommen, die op 1:1000 toch één printlijn breed zijn. Waar een andere baan
// eronder door loopt, stopt de wand. Waar een helix over zichzelf heen loopt,
// staat de bovenste gang op kolommen van 0,9 m buiten de onderste gang, met
// een console onder 49°. Lage delen staan op een dichte voet tot de onderkant.
//
// Station (lokale maten, zie de constante STATION): het oude Bob-station
// (west) met twee bouwlagen, een rondom lopend balkon op consoles, posten en
// een flauw, ver overstekend zadeldak (nok 9,4 m); de lange stationshal aan
// de baankant (plat dak 6,1 m) met vakwerkreliëf, kroonlijst en een
// siergeveltje; het middendeel met het schilddak (8,5 m); de steile
// Schmetterling-puntgevel aan het plein (nok 9,4 m) met de blauwe erker, de
// deur en de vogel op de top; het blauwgroene vakwerkblok (oost, 6,0 m) met
// de achthoekige uitrit van Moritz; en de groene school van meester Lämpel
// (oost-noordoost) met de uitrit van Max, het balkon met het bord "Schule"
// en het klokkentorentje (lantaarn met spits tot ca. 13 m). Vensters, deuren
// en de in- en uitritten van de treinen zijn blinde (spits)nissen; de banen
// lopen tot in de nissen. Wachtrij (node building:wachtrij): het paviljoen
// met schilddak ten noordwesten van het station, de overkapte meandering
// achter het station (2,5 m) en de overkapping met zadeldak onder de banen
// ten oosten ervan.
//
// Printbaar op 1:1000: alle delen staan op de onderkant (0,6 m onder het
// plein); de export vult alleen onder de dakoverstekken, de balkons, de
// erker, de kruisingen van de banen (een overspanning van 3-5 m boven de
// onderste baan) en de consoles op.
//
// Bronnen: AHN DSM/DTM 0,5 m via WCS (opname van na 2020: de banen van Max &
// Moritz staan erin, de bomen van de Bob-heuvel zijn gekapt): ligging van
// alle baandelen, hoogtes als maxima langs het pad, het maaiveld en de
// heuvels, het station (daken 15,3-18,7 m NAP); PDOK luchtfoto 8 cm
// (Actueel_orthoHR): tracé en kleur (blauw = Max, groen = Moritz) en de
// volgorde aan de kruisingen. De luchtfoto is geen ware orthofoto: hoge delen
// staan hier ca. 0,35 m per meter hoogte naar het zuiden en 0,1 m naar het
// oosten verschoven; het tracé is daarom per punt met die factor
// teruggezet en tegen het AHN gecontroleerd. Eftepedia (Max & Moritz,
// Frau Boltes Küche, Max & Moritz Plein): 2 × 300 m baan, hoogste punt 6 m,
// 212 kolommen, verloop van de rit, het hergebruikte Bob-station, de school,
// het torentje en de gevels; nl.wikipedia; Wikimedia Commons, Category:Max &
// Moritz (Efteling): station van alle kanten, bouwfoto's met de kolommen.
// Geschat: de railhoogte in en bij het station (2,25 m), de hoogte van de
// onderste gang in de helixen (het AHN ziet alleen de bovenste) en waar het
// DSM de rails mist, de kanteling, de steunafstand, de gevelindeling,
// vensters en balkons, het torentje (het DSM meet 11 m aan de voet van de
// spits) en de hoogte van de wachtrijoverkappingen.
//
// BAG: 0809100000017602 (1985, 279 m²) is het oude Bob-station en ligt
// binnen het model (replacesBuildings). 0809100000017601 (1987, ca. 60 m
// west) is Frau Boltes Küche, het voormalige restaurant De Steenbok aan de
// westkant van het plein: horeca met een plat dak, geen deel van de
// attractie, blijft als PDOK-pand staan. Bäckerei Krümel (2021) staat ca.
// 35 m zuidwestelijker en hoort ook niet bij dit model.
import { Manifold, box, prism, hull, union, gableRoof, hipRoof, spire, downFaces, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [131483, 406637];
const THETA_DEG = -16.5;
const THETA = (THETA_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(THETA).toFixed(5), +Math.sin(THETA).toFixed(5)];
const GROUND_NAP = 9.25;
const BASE = -0.6;
const W = 1.3; // baanbreedte (bovenkant)
const H = 0.9; // diepte van de kiel onder de bovenkant van de rails
const RAIL_STATION_NAP = 11.5; // railhoogte in het station (geschat, 2,25 m)

// ---------- vectorhulp ----------
const add = (a, b) => a.map((c, i) => c + b[i]);
const sub = (a, b) => a.map((c, i) => c - b[i]);
const mul = (a, k) => a.map((c) => c * k);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(...a);
const unit = (a) => mul(a, 1 / len(a));
const [C, S] = [Math.cos(THETA), Math.sin(THETA)];
// RD (oost, noord, NAP) → modelstelsel
const L = ([e, n, z]) => {
  const [dx, dy] = [e - ORIGIN[0], n - ORIGIN[1]];
  return [dx * C + dy * S, -dx * S + dy * C, z - GROUND_NAP];
};

// ---------- tracé (RD oost − 131400, RD noord − 406600, NAP bovenkant rails) ----------
// Om de ~2 m, al gecorrigeerd voor de scheefstand van de luchtfoto. Max
// begint aan de westkant van het station en rijdt naar het westen: het
// rechte stuk langs de wachtrij, de keerbocht (onder Moritz door), oostwaarts
// en de lus op de heuvel in het noordwesten, omlaag over Moritz heen, de lus
// in het midden, twee keer onder Moritz door, de helix in het oosten (eerste
// gang laag, tweede gang op 13,5-13,9 m NAP) en via de school het station
// in. Moritz begint aan de oostkant: de bocht naar het noorden langs de
// overkapping, de helix in het noordoosten, twee keer over Max heen, onder
// Max door naar het maaiveld, de helix in het westen, langs de heuvel naar
// de grote keerbocht in het westen (over Max heen) en het rechte stuk terug.
const MAX = [
  [66.28, 45.58, 11.5], [64.84, 45.96, 11.5], [62.79, 46.47, 11.5], [60.68, 47.01, 11.5], [58.79, 47.59, 11.5], [56.99, 48.25, 11.27],
  [55.28, 48.9, 11.02], [53.49, 49.55, 10.76], [51.69, 50.23, 10.63], [49.88, 50.92, 10.55], [47.98, 51.58, 10.46], [46.09, 52.24, 10.38],
  [44.42, 53.05, 10.3], [42.93, 54.19, 10.22], [41.83, 55.58, 10.14], [41.08, 57.43, 10.06], [40.87, 59.22, 10.0], [41.17, 60.93, 10.07],
  [41.86, 62.59, 10.14], [42.9, 64.04, 10.22], [44.38, 65.12, 10.41], [46.16, 65.59, 10.59], [47.97, 65.66, 10.54], [49.91, 65.61, 10.46],
  [51.72, 65.47, 10.4], [53.57, 65.29, 10.33], [55.39, 65.21, 10.34], [57.31, 65.22, 10.4], [59.04, 65.37, 10.46], [60.84, 66.03, 10.55],
  [62.18, 67.25, 10.67], [63.01, 68.94, 10.79], [63.49, 70.63, 10.92], [63.79, 72.49, 11.13], [63.94, 74.34, 11.34], [64.01, 76.29, 11.57],
  [64.13, 78.08, 11.78], [64.34, 80.02, 12.01], [64.67, 81.8, 12.22], [65.5, 83.54, 12.37], [66.8, 84.89, 12.52], [68.48, 85.89, 12.71],
  [70.27, 86.47, 12.93], [71.96, 86.57, 13.13], [73.74, 86.31, 13.32], [75.58, 85.77, 13.44], [77.24, 84.93, 13.56], [78.52, 83.62, 13.68],
  [79.11, 82.2, 13.79], [79.37, 80.57, 14.02], [79.41, 79.01, 14.26], [79.43, 77.3, 14.5], [79.57, 75.42, 14.43], [79.79, 73.35, 14.13],
  [80.05, 71.25, 13.89], [80.32, 69.32, 13.66], [80.94, 67.71, 13.38], [82.02, 66.46, 13.08], [83.5, 65.56, 12.8], [85.28, 64.88, 12.51],
  [87.06, 64.64, 12.33], [88.84, 64.78, 12.15], [90.6, 65.45, 11.94], [92.09, 66.75, 11.61], [92.84, 68.31, 11.32], [93.28, 70.12, 11.1],
  [93.37, 71.88, 10.94], [93.12, 73.63, 10.79], [92.51, 75.24, 10.63], [91.5, 76.67, 10.36], [90.3, 77.96, 10.04], [88.94, 79.13, 9.88],
  [87.55, 80.31, 9.85], [86.07, 81.51, 9.82], [84.84, 82.9, 9.88], [83.93, 84.55, 10.13], [83.41, 86.33, 10.28], [83.35, 88.4, 10.41],
  [83.82, 90.19, 10.52], [85.11, 91.63, 10.65], [86.64, 92.54, 10.77], [88.52, 93.27, 10.9], [90.35, 93.4, 10.71], [92.21, 92.94, 10.52],
  [93.81, 92.16, 10.46], [95.15, 90.94, 10.4], [96.1, 89.5, 10.35], [96.6, 87.87, 10.3], [96.63, 86.13, 10.27], [96.31, 84.32, 10.24],
  [96.02, 82.48, 10.21], [95.79, 80.58, 10.14], [95.73, 78.74, 10.05], [95.99, 76.85, 9.98], [96.52, 75.09, 9.93], [97.33, 73.43, 9.93],
  [98.31, 71.91, 10.02], [99.45, 70.44, 10.13], [100.81, 69.12, 10.27], [102.37, 67.91, 10.42], [103.82, 66.81, 10.54], [105.31, 65.71, 10.67],
  [106.4, 64.31, 10.79], [107.07, 62.63, 10.91], [107.25, 60.86, 11.03], [106.9, 59.15, 11.15], [106.07, 57.57, 11.27], [104.86, 56.18, 11.39],
  [103.32, 55.21, 11.57], [101.56, 54.75, 11.75], [99.74, 54.77, 11.95], [97.97, 55.37, 12.17], [96.39, 56.57, 12.4], [95.15, 58.12, 12.63],
  [94.36, 59.85, 12.86], [94.05, 61.72, 13.02], [94.27, 63.59, 13.16], [94.97, 65.31, 13.3], [96.1, 66.76, 13.34], [97.59, 67.81, 13.38],
  [99.31, 68.44, 13.41], [101.11, 68.57, 13.46], [102.86, 68.17, 13.51], [104.44, 67.26, 13.6], [105.71, 65.95, 13.69], [106.57, 64.34, 13.79],
  [106.93, 62.78, 13.82], [107.0, 60.94, 13.85], [106.98, 58.98, 13.89], [106.96, 56.95, 13.9], [106.9, 55.06, 13.9], [106.75, 53.37, 13.9],
  [106.77, 51.65, 13.85], [106.98, 49.82, 13.67], [107.39, 47.94, 13.41], [108.12, 46.06, 13.09], [108.91, 44.2, 12.9], [109.38, 42.23, 12.71],
  [109.54, 40.3, 12.4], [109.16, 38.29, 12.1], [108.15, 36.46, 11.83], [106.64, 35.26, 11.67], [104.79, 34.45, 11.52], [102.83, 34.19, 11.5],
  [100.78, 34.17, 11.5],
];
const MORITZ = [
  [99.79, 28.24, 11.5], [101.3, 28.09, 11.4], [103.34, 27.97, 11.26], [105.16, 28.04, 11.14], [106.95, 28.33, 11.1], [108.62, 28.98, 11.1],
  [110.23, 29.93, 11.1], [111.61, 31.17, 11.2], [112.64, 32.67, 11.47], [113.38, 34.42, 11.74], [113.8, 36.28, 12.02], [113.95, 38.23, 12.38],
  [113.92, 40.26, 12.77], [113.72, 42.24, 13.03], [113.34, 44.19, 13.21], [112.85, 46.03, 13.25], [112.25, 47.87, 13.29], [111.44, 49.68, 13.4],
  [110.77, 51.5, 13.54], [110.45, 53.23, 13.52], [110.29, 54.98, 13.39], [110.19, 56.77, 13.18], [110.18, 58.54, 12.86], [110.23, 60.21, 12.54],
  [110.21, 61.65, 12.26], [109.91, 63.6, 11.98], [109.42, 65.33, 11.73], [108.74, 67.02, 11.48], [107.8, 68.57, 11.23], [106.48, 69.91, 11.09],
  [104.94, 71.02, 11.06], [103.32, 72.06, 11.03], [101.8, 73.22, 11.01], [100.62, 74.92, 11.05], [99.99, 76.76, 11.1], [99.92, 78.68, 11.16],
  [100.39, 80.57, 11.22], [101.39, 82.26, 11.28], [102.83, 83.63, 11.35], [104.59, 84.56, 11.42], [106.53, 84.97, 11.48], [108.48, 84.87, 11.69],
  [110.3, 84.24, 11.94], [111.85, 83.11, 12.12], [113.0, 81.56, 12.28], [113.64, 79.75, 12.45], [113.73, 77.83, 12.65], [113.27, 75.94, 12.77],
  [112.29, 74.22, 12.87], [110.86, 72.86, 12.95], [109.09, 71.98, 13.05], [107.12, 71.67, 13.25], [105.11, 71.93, 13.43], [103.23, 72.74, 13.58],
  [101.6, 74.09, 13.74], [100.51, 75.71, 13.93], [99.62, 77.48, 14.11], [98.8, 79.23, 14.17], [97.96, 80.93, 14.17], [96.91, 82.84, 14.11],
  [95.78, 84.44, 14.06], [94.44, 85.76, 14.0], [92.88, 86.52, 13.88], [91.11, 86.85, 13.66], [89.4, 86.49, 13.3], [87.68, 85.74, 12.97],
  [86.18, 84.81, 12.68], [84.69, 83.58, 12.3], [83.4, 82.03, 12.02], [82.1, 80.15, 11.42], [80.76, 78.58, 11.12], [79.34, 77.26, 10.92],
  [77.98, 76.07, 10.66], [76.58, 74.8, 10.23], [75.29, 73.63, 9.92], [73.84, 72.56, 9.77], [72.47, 71.59, 9.71], [71.1, 70.35, 9.79],
  [69.57, 69.35, 9.9], [67.98, 68.4, 10.03], [66.81, 66.93, 10.22], [66.12, 65.16, 10.41], [65.97, 63.29, 10.61], [66.34, 61.52, 10.99],
  [67.21, 59.97, 11.23], [68.51, 58.78, 11.47], [70.15, 57.98, 11.67], [72.0, 57.63, 11.86], [73.89, 57.79, 12.05], [75.67, 58.5, 12.25],
  [77.18, 59.74, 12.4], [78.31, 61.34, 12.55], [78.98, 63.09, 12.72], [79.16, 64.82, 12.91], [78.82, 66.45, 13.08], [77.93, 68.02, 13.22],
  [76.55, 69.44, 13.3], [74.82, 70.53, 13.3], [72.9, 71.13, 13.3], [70.94, 71.17, 13.3], [69.12, 70.58, 13.29], [67.59, 69.45, 13.24],
  [66.72, 68.02, 13.19], [65.58, 66.32, 13.09], [64.24, 64.66, 12.99], [62.83, 63.01, 12.94], [61.44, 61.61, 12.89], [59.85, 60.93, 12.81],
  [58.24, 60.56, 12.72], [56.32, 60.37, 12.59], [54.43, 60.44, 12.45], [52.61, 60.87, 12.4], [50.79, 61.43, 12.4], [48.93, 61.9, 12.5],
  [47.04, 62.35, 12.69], [45.16, 62.77, 12.91], [43.21, 63.02, 13.22], [41.32, 62.94, 13.39], [39.61, 62.35, 13.51], [37.89, 61.11, 13.61],
  [36.64, 59.57, 13.72], [35.91, 57.83, 14.1], [35.65, 56.16, 14.26], [35.79, 54.46, 14.17], [36.27, 52.74, 14.06], [37.08, 51.11, 13.86],
  [38.21, 49.78, 13.68], [39.71, 48.58, 13.53], [41.37, 47.6, 13.38], [43.15, 46.89, 13.14], [45.05, 46.15, 12.9], [46.87, 45.41, 12.52],
  [48.78, 44.66, 12.12], [50.64, 43.93, 11.87], [52.48, 43.22, 11.63], [54.31, 42.56, 11.57], [56.14, 41.99, 11.53], [57.97, 41.47, 11.5],
  [59.74, 41.1, 11.5], [61.89, 40.61, 11.5], [63.9, 40.04, 11.5], [64.57, 39.8, 11.5],
];

// ---------- station (lokaal stelsel = modelstelsel) ----------
// Gevellijnen uit het AHN-DSM in het stelsel van het station (meter, x langs
// de as, y naar de baankant): het oude Bob-station x −15,5…−5, de hal aan de
// baankant y 2,6…7,3, de lange pleingevel (begane grond van het oude station
// en het middendeel) op y −7,6 (BAG-contour −7,7…−8,3), de
// Schmetterling-gevel tot y −9,3, het vakwerkblok (tot y −8,6) en de school
// x 9,6…16,6. Balkon en dak van het oude station steken tot y −9,1 en −10,35
// uit (DSM: dakrand op y ≈ −9,5…−10).
const STATION = { west: -15.5, east: 16.6, north: 7.3, south: -7.6 };
// In het station liggen de banen recht, evenwijdig aan de as.
function stationLine(ctrl) {
  const a = L([ctrl[0][0] + 131400, ctrl[0][1] + 406600, RAIL_STATION_NAP]);
  const b = L([ctrl.at(-1)[0] + 131400, ctrl.at(-1)[1] + 406600, RAIL_STATION_NAP]);
  return [a, b];
}

// ---------- baan ----------
// Open Catmull-Rom-spline door de controlepunten (model), om de ≤ 0,7 m; de
// hoogte lineair en daarna uitgemiddeld over ±2 m. Aan beide uiteinden loopt
// de baan 3 m recht het station in (de rest wordt weggesneden).
function trackPath(ctrlRd) {
  const P0 = ctrlRd.map(([e, n, z]) => L([e + 131400, n + 406600, z]));
  const [a, b] = stationLine(ctrlRd);
  const dir = unit(sub(b, a));
  const pre = add(a, mul(dir, 3.2));
  const post = add(b, mul(dir, -3.2));
  pre[2] = post[2] = RAIL_STATION_NAP - GROUND_NAP;
  const P = [pre, ...P0, post];
  const n = P.length;
  const pts = [];
  for (let i = 0; i + 1 < n; i++) {
    const [p0, p1, p2, p3] = [P[Math.max(0, i - 1)], P[i], P[i + 1], P[Math.min(n - 1, i + 2)]];
    const m = Math.max(1, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / 0.7));
    for (let j = 0; j < m; j++) {
      const t = j / m;
      const xy = [0, 1].map(
        (c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t * t + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t ** 3),
      );
      pts.push([...xy, p1[2] + (p2[2] - p1[2]) * t]);
    }
  }
  pts.push(P[n - 1]);
  const N = pts.length;
  const K = 3;
  const z = pts.map((_, i) => {
    let s = 0;
    let c = 0;
    for (let k = -K; k <= K; k++) {
      const j = i + k;
      if (j >= 0 && j < N) {
        s += pts[j][2];
        c++;
      }
    }
    return s / c;
  });
  return pts.map(([x, y], i) => [x, y, z[i]]);
}

function trackFrames(P) {
  const N = P.length;
  const S = [0];
  for (let i = 1; i < N; i++) S.push(S[i - 1] + len(sub(P[i], P[i - 1])));
  const tangent = (i) => unit(sub(P[Math.min(N - 1, i + 1)], P[Math.max(0, i - 1)]));
  // Kromming in het platte vlak (1/m, positief = bocht naar links), licht uitgemiddeld.
  const kRaw = P.map((_, i) => {
    const a = P[Math.max(0, i - 2)];
    const b = P[i];
    const c = P[Math.min(N - 1, i + 2)];
    const t1 = [b[0] - a[0], b[1] - a[1]];
    const t2 = [c[0] - b[0], c[1] - b[1]];
    const l1 = Math.hypot(...t1);
    const l2 = Math.hypot(...t2);
    if (l1 < 1e-6 || l2 < 1e-6) return 0;
    return (2 * ((t1[0] * t2[1] - t1[1] * t2[0]) / (l1 * l2))) / (l1 + l2);
  });
  const kappa = kRaw.map((_, i) => {
    let s = 0;
    let c = 0;
    for (let k = -3; k <= 3; k++) {
      const j = i + k;
      if (j >= 0 && j < N) {
        s += kRaw[j];
        c++;
      }
    }
    return s / c;
  });
  // Kanteling tot 9° naar binnen (meer maakt een kielvlak flauwer dan 45°).
  const U = P.map((_, i) => {
    const t = tangent(i);
    const zUp = unit(sub([0, 0, 1], mul(t, t[2])));
    const left = unit(cross(zUp, t)); // links van de rijrichting
    const b = (Math.max(-9, Math.min(9, kappa[i] * 70)) * Math.PI) / 180;
    return unit(add(mul(zUp, Math.cos(b)), mul(left, Math.sin(b))));
  });
  return { P, S, U, kappa, tangent };
}

// Band met een driehoekige doorsnede: bovenkant W breed, kiel tot H diep.
// Doorsnede loodrecht op de gemiddelde richting; segmenten 2 cm verlengd,
// zodat ze overlappen (als ribbon() uit de kit).
function keelRibbon({ P, U }) {
  const n = P.length;
  const seg = (i) => unit(sub(P[i + 1], P[i]));
  const fr = P.map((p, i) => {
    const t = unit(add(i > 0 ? seg(i - 1) : [0, 0, 0], i < n - 1 ? seg(i) : [0, 0, 0]));
    const s = unit(cross(t, U[i]));
    return { p, t, s, u: cross(s, t) };
  });
  const corners = ({ p, s, u }, shift) =>
    [
      [W / 2, 0],
      [-W / 2, 0],
      [0, -H],
    ].map(([a, b]) => [0, 1, 2].map((k) => p[k] + shift[k] + s[k] * a + u[k] * b));
  const parts = [];
  for (let i = 0; i + 1 < n; i++) {
    parts.push(hull([...corners(fr[i], mul(fr[i].t, -0.02)), ...corners(fr[i + 1], mul(fr[i + 1].t, 0.02))]));
  }
  return Manifold.union(parts);
}

const tracks = [MAX, MORITZ].map((ctrl, id) => ({ id, ...trackFrames(trackPath(ctrl)) }));
// Onderkant van de band op punt i (ongeveer z − H).
const under = (tr, i) => tr.P[i][2] - H * Math.max(0.5, tr.U[i][2]);

// Een plek is vrij als geen ander baandeel (van de andere baan, of van
// dezelfde baan verder dan 'skip' m langs het pad) binnen 'clear' m in het
// platte vlak onder 'zTop' + 1,5 m doorloopt.
function free(c, zTop, tr, i, clear = 0.45, skip = 8) {
  for (const o of tracks) {
    for (let j = 0; j < o.P.length; j++) {
      if (o === tr && Math.abs(o.S[j] - tr.S[i]) < skip) continue;
      const d = Math.hypot(o.P[j][0] - c[0], o.P[j][1] - c[1]);
      if (d < clear + W / 2 + 0.3 && o.P[j][2] - 1.2 < zTop + 0.3) return false;
    }
  }
  return true;
}

// Steunwand onder de baan van sA tot sB (booglengte): 0,9 m dik, poten van
// 0,9 m om de ~3 m, daartussen een spitse opening met zijden onder 55° en de
// top 0,6 m onder de kiel (alleen als er genoeg hoogte is).
const SLOPE = Math.tan((55 * Math.PI) / 180);
function webs(tr, sA, sB, out) {
  const N = tr.P.length;
  const segAt = (s) => {
    let lo = 0;
    let hi = N - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (tr.S[mid] <= s) lo = mid;
      else hi = mid;
    }
    return [lo, Math.min(1, Math.max(0, (s - tr.S[lo]) / (tr.S[hi] - tr.S[lo] || 1)))];
  };
  const at = (s) => {
    const [i, f] = segAt(s);
    const j = Math.min(N - 1, i + 1);
    const p = tr.P[i].map((c, k) => c + (tr.P[j][k] - c) * f);
    const t = sub(tr.P[j], tr.P[i]);
    const tl = Math.hypot(t[0], t[1]) || 1;
    return { p, n: [-t[1] / tl, t[0] / tl], top: under(tr, i) + (under(tr, j) - under(tr, i)) * f + 0.4 };
  };
  const count = Math.max(1, Math.round((sB - sA) / 3));
  const lp = (sB - sA) / count;
  for (let k = 0; k < count; k++) {
    const s0 = sA + k * lp;
    const mid = s0 + lp / 2;
    const g = lp - 0.9;
    let minTop = Infinity;
    for (let s = s0; s <= s0 + lp + 1e-9; s += 0.25) minTop = Math.min(minTop, at(s).top);
    const apex = minTop - 1.0;
    const samples = [
      [s0, BASE],
      [s0 + 0.45, BASE],
    ];
    const arch = (s) => Math.max(BASE, apex - SLOPE * Math.abs(s - mid));
    if (apex - BASE > 1.5 && g > 1) {
      samples.push([s0 + 0.46, arch(s0 + 0.46)]);
      const steps = Math.max(2, Math.ceil(g / 0.75));
      for (let q = 1; q < steps; q++) samples.push([s0 + 0.45 + (g * q) / steps, arch(s0 + 0.45 + (g * q) / steps)]);
      samples.push([mid, arch(mid)]);
      samples.push([s0 + lp - 0.46, arch(s0 + lp - 0.46)]);
    } else {
      for (let q = 1; q < 4; q++) samples.push([s0 + (lp * q) / 4, BASE]);
    }
    samples.push([s0 + lp - 0.45, BASE], [s0 + lp, BASE]);
    samples.sort((a, b) => a[0] - b[0]);
    for (let q = 0; q + 1 < samples.length; q++) {
      if (samples[q + 1][0] - samples[q][0] < 1e-4) continue;
      const pts = [];
      for (const [s, lo] of [samples[q], samples[q + 1]]) {
        const { p, n, top } = at(s);
        for (const sg of [-0.45, 0.45]) for (const z of [lo, top]) pts.push([p[0] + n[0] * sg, p[1] + n[1] * sg, z]);
      }
      out.push(hull(pts));
    }
  }
}

// Kolom met console onder de bovenste gang van een helix: 0,9 × 0,9 m,
// 1,65 m opzij (buiten de onderste gang), console onder 49°.
const sideColumn = (tr, i, side) => {
  const p = tr.P[i];
  const t3 = tr.tangent(i);
  const tl = Math.hypot(t3[0], t3[1]) || 1;
  const t = [t3[0] / tl, t3[1] / tl];
  const nv = [-t[1] * side, t[0] * side];
  const zb = under(tr, i);
  const c = [p[0] + nv[0] * 1.65, p[1] + nv[1] * 1.65];
  const sq = (cc, ha, hn, z) =>
    [
      [1, 1],
      [1, -1],
      [-1, -1],
      [-1, 1],
    ].map(([a, b]) => [cc[0] + t[0] * ha * a + nv[0] * hn * b, cc[1] + t[1] * ha * a + nv[1] * hn * b, z]);
  const col = hull([...sq(c, 0.45, 0.45, BASE), ...sq(c, 0.45, 0.45, zb)]);
  const keel = [p[0] - nv[0] * 0.0, p[1] - nv[1] * 0.0];
  const bracket = hull([...sq(c, 0.45, 0.45, zb - 1.6), ...sq(c, 0.45, 0.45, zb + 0.05), ...sq(keel, 0.45, 0.2, zb - 0.05), ...sq(keel, 0.45, 0.2, zb + 0.35)]);
  return { solid: union([col, bracket]), c, zb };
};

const supports = [];
const helixColumns = [];
for (const tr of tracks) {
  const N = tr.P.length;
  // Doorlopende stukken waar de baan vrij ligt: steunwand.
  const ok = (i) => under(tr, i) > BASE + 0.4 && free([tr.P[i][0], tr.P[i][1]], under(tr, i), tr, i);
  let start = -1;
  for (let i = 0; i <= N; i++) {
    if (i < N && ok(i)) {
      if (start < 0) start = i;
    } else if (start >= 0) {
      if (tr.S[i - 1] - tr.S[start] > 1.5) webs(tr, tr.S[start], tr.S[i - 1], supports);
      start = -1;
    }
  }
  // Bovenste gang van een helix: dezelfde baan loopt ≥ 1,5 m lager onder dit punt door.
  let next = -Infinity;
  for (let i = 0; i < N; i++) {
    if (tr.S[i] < next) continue;
    let below = false;
    for (let j = 0; j < N && !below; j++) {
      if (Math.abs(tr.S[j] - tr.S[i]) > 15 && Math.hypot(tr.P[j][0] - tr.P[i][0], tr.P[j][1] - tr.P[i][1]) < 1.2 && tr.P[j][2] < tr.P[i][2] - 1.5) below = true;
    }
    if (!below) continue;
    // buitenkant van de bocht eerst
    const outward = tr.kappa[i] > 0 ? -1 : 1;
    for (const side of [outward, -outward]) {
      const cand = sideColumn(tr, i, side);
      if (free(cand.c, cand.zb, tr, i, 0.55, 4)) {
        helixColumns.push(cand.solid);
        next = tr.S[i] + 3.5;
        break;
      }
    }
  }
}

// Binnen het station ligt de baan in de gebouwen; weg ermee (tot in de nissen
// van de in- en uitritten, die 1,5 m diep zijn).
const stationCore = box(STATION.west + 1.4, -8.0, BASE - 1, STATION.east - 1.4, 7.0, 12);
const baan = union(
  union([...tracks.map(keelRibbon), ...supports, ...helixColumns])
    .subtract(stationCore)
    .decompose()
    .filter((p) => p.volume() > 0.5),
);

// ---------- gevelhulpen ----------
// Spitsboognis: breedte w, rechte zijden tot hv (absoluut), top onder 60°,
// diep d; lokaal: gevel in het vlak y = 0, de nis gaat in +y het gebouw in.
const archNiche = (w, hv, d, z0 = 0) => {
  const r = w / 2;
  const top = hv + r * Math.tan((60 * Math.PI) / 180);
  return hull([
    [-r, -0.05, z0], [r, -0.05, z0], [-r, d, z0], [r, d, z0],
    [-r, -0.05, hv], [r, -0.05, hv], [-r, d, hv], [r, d, hv],
    [0, -0.05, top], [0, d, top],
  ]);
};
// Zet een lokaal gevelonderdeel (gevel in y = 0, binnen = +y) op een gevel:
// face 'S' (y = c, buiten −y), 'N' (y = c, buiten +y), 'W' (x = c, buiten −x),
// 'E' (x = c, buiten +x); a = positie langs de gevel.
const onFace = (m, face, c, a) => {
  if (face === "S") return m.translate([a, c, 0]);
  if (face === "N") return m.rotate([0, 0, 180]).translate([a, c, 0]);
  if (face === "W") return m.rotate([0, 0, -90]).translate([c, a, 0]);
  return m.rotate([0, 0, 90]).translate([c, a, 0]);
};
// Rechthoekige blinde nis (venster) van w × (z1 − z0), diep d.
const winNiche = (w, z0, z1, d = 0.3) => box(-w / 2, -0.05, z0, w / 2, d, z1);
// Verticale vakwerkstijl of liseen: w breed, p voor de gevel.
const post = (w, z0, z1, p = 0.25) => box(-w / 2, -p, z0, w / 2, 0.05, z1);
// Horizontale regel of kroonlijst van lengte l: h hoog, p voor de gevel, met
// een onderkant onder 45° (geen overhang).
const band = (l, z0, z1, p) =>
  hull([
    [-l / 2, 0.05, z0 - p], [l / 2, 0.05, z0 - p], [-l / 2, 0.05, z1], [l / 2, 0.05, z1],
    [-l / 2, -p, z0], [l / 2, -p, z0], [-l / 2, -p, z1], [l / 2, -p, z1],
  ]);
// Schoor (vakwerk): strook van (a0, z0) naar (a1, z1), w breed, p voor de gevel.
const brace = (a0, z0, a1, z1, w = 0.35, p = 0.2) => {
  const pts = [];
  for (const [a, z] of [
    [a0, z0],
    [a1, z1],
  ]) {
    for (const da of [-w / 2, w / 2]) for (const y of [-p, 0.05]) pts.push([a + da, y, z]);
  }
  return hull(pts);
};
// Vakwerkgevel: stijlen om de 'step' m tussen a0 en a1, een regel op zr en
// schoren in de vakken (afwisselend / en \), alles in het lokale geveldeel.
function timberFrame(a0, a1, step, z0, zr, z1, braces = true) {
  const braceAt = typeof braces === "function" ? braces : () => braces;
  const parts = [];
  const n = Math.max(1, Math.round((a1 - a0) / step));
  const st = (a1 - a0) / n;
  for (let k = 0; k <= n; k++) parts.push(post(0.4, z0, z1).translate([a0 + k * st, 0, 0]));
  parts.push(band(a1 - a0, zr, zr + 0.3, 0.25).translate([(a0 + a1) / 2, 0, 0]));
  {
    for (let k = 0; k < n; k++) {
      const [l, r] = [a0 + k * st + 0.2, a0 + (k + 1) * st - 0.2];
      if (r - l < 0.9 || !braceAt(k, (l + r) / 2)) continue;
      // schoor onder 50-65°: in de bovenste regelzone
      if (k % 2 === 0) parts.push(brace(l, zr + 0.3, r, z1 - 0.05));
      else parts.push(brace(r, zr + 0.3, l, z1 - 0.05));
    }
  }
  return union(parts);
}

// ---------- station ----------
const st = [];
const cuts = [];
// Oud Bob-station (west): begane grond, verdieping, balkon, posten en het
// flauwe, ver overstekende zadeldak met de nok langs de as (AHN 18,7 m NAP).
st.push(box(STATION.west, STATION.south, BASE, -5.0, 2.6, 4.5));
st.push(box(-15.1, -7.4, 4.4, -5.4, 2.3, 7.95));
// Balkon op consoles (onderkant 45°) langs de zuid- en westgevel, borstwering 1,1 m.
const balcony = (l, p) =>
  hull([
    [-l / 2, 0.05, 4.5 - p], [l / 2, 0.05, 4.5 - p], [-l / 2, 0.05, 5.6], [l / 2, 0.05, 5.6],
    [-l / 2, -p, 4.5], [l / 2, -p, 4.5], [-l / 2, -p, 5.6], [l / 2, -p, 5.6],
  ]);
st.push(onFace(balcony(11.65, 1.5), "S", STATION.south, -10.675));
// (aan de westkant alleen tot y = −4: daarnaast rijdt Moritz het station in)
st.push(onFace(balcony(5.1, 1.0), "W", STATION.west, -6.55));
// Posten van het balkon tot onder het dak (0,5 m).
for (const [x, y] of [[-16.2, -8.8], [-12.2, -8.8], [-8.6, -8.8], [-5.3, -8.8], [-16.2, -4.4]]) {
  st.push(box(x - 0.25, y - 0.25, 5.5, x + 0.25, y + 0.25, 8.0));
}
// Dak: goot op 7,9 m, nok 9,4 m op y = −3,45.
st.push(gableRoof(12.3, 13.8, 7.9, 9.4).translate([-10.4, -3.45, 0]));
// Pinakels (sierpunten) op de nok aan beide kopgevels.
for (const x of [-16.25, -4.55]) st.push(spire([x, -3.45], 0.4, 9.2, 10.3, 4, Math.PI / 4));
// Vensters op de verdieping (zuid en west), deuren en vensters beneden.
for (const x of [-13.6, -11.6, -8.6, -6.6]) cuts.push(onFace(winNiche(0.9, 5.9, 7.2), "S", -7.4, x));
for (const y of [-6.0, -0.6]) cuts.push(onFace(winNiche(0.9, 5.9, 7.2), "W", -15.1, y));
cuts.push(onFace(archNiche(1.2, 1.9, 0.4), "S", STATION.south, -14.0));
// de twee kleine vensters met de muurschildering uit de Bob-tijd
for (const x of [-11.6, -9.6]) cuts.push(onFace(winNiche(0.8, 2.6, 3.6, 0.35), "S", STATION.south, x));
// Vakwerkstijlen op de begane grond van de zuidgevel.
st.push(onFace(timberFrame(-15.2, -5.2, 2.5, 0.3, 2.0, 4.2, false), "S", STATION.south, 0));

// Hoekblok in het noordwesten (lage overkapping waar Max het station in rijdt).
st.push(box(STATION.west, 2.4, BASE, -12.2, STATION.north, 4.6));
st.push(onFace(band(3.4, 4.1, 4.6, 0.3), "W", STATION.west, 4.95));

// Stationshal aan de baankant: plat dak 6,1 m, vakwerk, kroonlijst, siergeveltje.
st.push(box(-12.4, 2.4, BASE, STATION.east, STATION.north, 6.1));
// (op de noordgevel spiegelt onFace de lokale as: lokaal −16,2…12,0 = x −12,0…16,2)
const NORTH_WINDOWS = [-10.8, -6.1, -3.75, 3.3, 8.0, 12.7];
st.push(onFace(timberFrame(-16.2, 12.0, 2.35, 0.2, 2.6, 5.5, (k, c) => !NORTH_WINDOWS.some((w) => Math.abs(w + c) < 1)), "N", STATION.north, 0));
st.push(onFace(band(28.8, 5.5, 6.1, 0.35), "N", STATION.north, 2.1));
for (const x of NORTH_WINDOWS) cuts.push(onFace(winNiche(0.75, 3.5, 4.6), "N", STATION.north, x));
// Siergeveltje (dakkapel) op de noordgevel, 3,4 m breed, top 8,0 m.
{
  const g = gableRoof(2.2, 3.6, 5.4, 7.9).rotate([0, 0, 90]).translate([-1.2, 6.6, 0]);
  const front = box(-2.8, 5.5, 5.4, 0.4, 7.3, 6.2);
  st.push(union([g, front]));
  cuts.push(archNiche(1.0, 6.3, 0.3, 5.5).rotate([0, 0, 180]).translate([-1.2, 7.75, 0]));
}

// Middendeel met het schilddak (AHN: top 17,8 m NAP).
st.push(box(-5.0, STATION.south, BASE, 9.6, 2.6, 6.2));
st.push(hipRoof(9.6, 6.6, 6.15, 8.5, 2.6).translate([1.0, -0.4, 0]));
// Schoorsteen op het schilddak (0,9 m).
st.push(box(3.1, 0.3, 6.5, 4.0, 1.2, 9.2));
// De lange pleingevel met "Frau Schmetterling": vakwerkstijlen, vensters,
// kroonlijst en het muurtje van de rotstuin ervoor.
st.push(onFace(timberFrame(-4.8, 2.4, 2.4, 0.3, 2.0, 5.6, false), "S", STATION.south, 0));
st.push(onFace(band(14.6, 5.6, 6.2, 0.35), "S", STATION.south, 2.3));
for (const x of [-3.6, -1.2, 1.4]) cuts.push(onFace(winNiche(0.9, 3.4, 4.7), "S", STATION.south, x));
// verhoogde rotstuin met muurtje voor de hele pleingevel (1,2 m)
st.push(box(STATION.west - 0.3, -8.9, BASE, 2.6, STATION.south + 0.05, 1.2));
st.push(onFace(timberFrame(7.1, 9.4, 2.3, 0.3, 2.0, 5.6, false), "S", STATION.south, 0));

// Schmetterling-puntgevel aan het plein: steil zadeldak (51°, nok 9,4 m) met
// de nok dwars op de gevel, blauwe erker op een kraag van 45°, deur in een
// stenen omlijsting, uitgesneden geveldriehoek en de vogel op de top.
st.push(box(2.6, -9.3, BASE, 7.0, -4.0, 6.2));
{
  const roof = gableRoof(6.1, 5.4, 6.15, 9.4).rotate([0, 0, 90]).translate([4.8, -6.75, 0]);
  // verdiepte geveldriehoek binnen de windveren (0,35 m diep, rand 0,45 m)
  const tri = hull([
    [4.8 - 2.0, -9.85, 6.45], [4.8 + 2.0, -9.85, 6.45], [4.8, -9.85, 8.85],
    [4.8 - 2.0, -9.45, 6.45], [4.8 + 2.0, -9.45, 6.45], [4.8, -9.45, 8.85],
  ]);
  st.push(roof.subtract(tri));
  // erker
  st.push(hull([
    [3.6, -9.25, 2.9], [6.0, -9.25, 2.9], [3.6, -9.25, 5.6], [6.0, -9.25, 5.6],
    [3.6, -9.95, 3.6], [6.0, -9.95, 3.6], [3.6, -9.95, 5.6], [6.0, -9.95, 5.6],
  ]));
  for (const x of [4.2, 5.4]) cuts.push(box(x - 0.4, -10.05, 3.9, x + 0.4, -9.75, 5.2));
  // stenen omlijsting en deur
  st.push(box(3.4, -9.6, BASE, 6.2, -9.25, 2.3));
  cuts.push(onFace(archNiche(1.4, 1.4, 0.6), "S", -9.6, 4.8));
  // vogel (adelaar) op de top: romp en vleugels als blokken van ≥ 0,5 m
  st.push(hull([[4.5, -9.95, 9.1], [5.1, -9.95, 9.1], [4.5, -9.35, 9.1], [5.1, -9.35, 9.1], [4.8, -9.65, 10.4]]));
  st.push(hull([[3.9, -9.8, 9.6], [5.7, -9.8, 9.6], [3.9, -9.5, 9.6], [5.7, -9.5, 9.6], [4.8, -9.65, 10.1]]));
}

// Vakwerkblok in het oosten (plat dak 6,0 m) met de achthoekige uitrit van Moritz.
st.push(box(9.6, -8.6, BASE, STATION.east, -0.4, 6.0));
st.push(onFace(timberFrame(9.8, 16.4, 2.2, 0.2, 3.0, 5.4), "S", -8.6, 0));
st.push(onFace(band(7.0, 5.4, 6.0, 0.35), "S", -8.6, 13.1));
st.push(onFace(band(8.2, 5.4, 6.0, 0.35), "E", STATION.east, -4.5));
for (const y of [-7.9, -6.4, -0.9]) st.push(onFace(post(0.4, 0.2, 5.4), "E", STATION.east, y));
st.push(onFace(band(8.2, 3.0, 3.3, 0.25), "E", STATION.east, -4.5).intersect(box(STATION.east - 1, -8.6, 0, STATION.east + 1, -5.0, 6)));
// School van meester Lämpel: groene gevels tot 7,3 m, zadeldak met de nok
// langs de as (AHN 18,7-19,0 m NAP), balkon met het bord, vensters en het
// klokkentorentje op de nok.
st.push(box(9.6, -0.4, BASE, STATION.east, 5.4, 7.3));
{
  st.push(gableRoof(7.5, 6.6, 7.25, 9.8).translate([13.15, 2.5, 0]));
  // balkon met het bord "Schule"
  st.push(hull([
    [STATION.east - 0.05, 1.4, 4.75], [STATION.east - 0.05, 3.6, 4.75],
    [STATION.east + 0.7, 1.4, 5.5], [STATION.east + 0.7, 3.6, 5.5],
    [STATION.east - 0.05, 1.4, 6.05], [STATION.east - 0.05, 3.6, 6.05],
    [STATION.east + 0.7, 1.4, 6.05], [STATION.east + 0.7, 3.6, 6.05],
  ]));
  cuts.push(onFace(archNiche(0.9, 6.4, 0.3, 6.1), "E", STATION.east, 2.5));
  for (const y of [0.7, 4.3]) cuts.push(onFace(winNiche(0.8, 5.9, 7.0), "E", STATION.east, y));
  // klokkentorentje: lantaarn 1,5 × 1,5 m tot 10,9 m met galmgaten, spits tot 13,2 m
  st.push(box(12.25, 1.75, 9.0, 13.75, 3.25, 10.9));
  for (const [face, c, a] of [["E", 13.75, 2.5], ["W", 12.25, 2.5], ["N", 3.25, 13.0], ["S", 1.75, 13.0]]) {
    cuts.push(onFace(archNiche(0.7, 9.9, 0.25, 9.5), face, c, a));
  }
  st.push(spire([13.0, 2.5], 1.35, 10.85, 13.2, 4, Math.PI / 4));
}

// In- en uitritten van de treinen: spitse nissen van 1,5 m diep waar de banen
// de gevels kruisen (Max: noordwesthoek en school, Moritz: oud station en
// vakwerkblok).
for (const tr of tracks) {
  for (const [x, face] of [
    [STATION.west, "W"],
    [STATION.east, "E"],
  ]) {
    // punt van de baan op deze gevel
    let best = null;
    for (const p of tr.P) if (!best || Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
    const hv = face === "W" && best[1] > 2 ? 2.2 : 2.4;
    cuts.push(onFace(archNiche(2.4, hv, 1.5, 1.0), face, x, best[1]));
  }
}
const station = union(st).subtract(union(cuts));

// ---------- wachtrij ----------
const wq = [];
const wcuts = [];
// Paviljoen ten noordwesten van het station (AHN 12,0-13,4 m NAP), schilddak.
wq.push(box(-24.2, 8.1, BASE, -19.3, 14.5, 2.7));
wq.push(hipRoof(7.2, 5.7, 2.65, 4.3, 2.4).rotate([0, 0, 90]).translate([-21.75, 11.3, 0]));
for (const [face, c, a] of [["S", 8.1, -21.75], ["N", 14.5, -21.75], ["W", -24.2, 11.3], ["E", -19.3, 11.3]]) {
  wcuts.push(onFace(archNiche(1.6, 1.0, 0.6, 0.0), face, c, a));
}
// Overkapte meandering achter het station (AHN 11,5-12,0 m NAP): platte kap op
// 2,5 m; de open zijden als spitse nissen tussen posten om de 3 m.
{
  const poly = [[-10.2, 13.0], [5.5, 13.0], [6.5, 10.8], [17.3, 10.8], [17.3, 16.3], [3.0, 16.8], [-10.2, 16.8]];
  wq.push(prism(poly, BASE, 2.5));
  for (let x = -8.7; x < 4.5; x += 3) {
    wcuts.push(onFace(archNiche(1.8, 0.5, 0.5, 0.0), "S", 13.0, x));
    wcuts.push(onFace(archNiche(1.8, 0.5, 0.5, 0.0), "N", 16.8, x));
  }
  for (let x = 8.5; x < 16.5; x += 3) wcuts.push(onFace(archNiche(1.8, 0.5, 0.5, 0.0), "S", 10.8, x));
  for (const y of [12.3, 15.0]) wcuts.push(onFace(archNiche(1.8, 0.5, 0.5, 0.0), "E", 17.3, y));
}
// Overkapping met zadeldak onder de banen ten oosten van het station
// (RD 131506,6-131515,0 × 406648,4-406654,6, nok oost-west op 3,2 m).
{
  const cRd = [131510.8, 406651.5];
  const c = L([...cRd, GROUND_NAP]);
  const local = union([box(-4.2, -3.1, BASE, 4.2, 3.1, 2.4), gableRoof(8.8, 6.8, 2.35, 3.2)]);
  const openings = union([
    archNiche(1.8, 0.4, 0.5, 0).translate([-2.0, -3.1, 0]),
    archNiche(1.8, 0.4, 0.5, 0).translate([2.0, -3.1, 0]),
    archNiche(1.8, 0.4, 0.5, 0).rotate([0, 0, 180]).translate([-2.0, 3.1, 0]),
    archNiche(1.8, 0.4, 0.5, 0).rotate([0, 0, 180]).translate([2.0, 3.1, 0]),
  ]);
  wq.push(local.subtract(openings).rotate([0, 0, -THETA_DEG]).translate([c[0], c[1], 0]));
}
const wachtrij = union(wq).subtract(union(wcuts));

const nodes = [
  ["building:baan", baan],
  ["building:station", station],
  ["building:wachtrij", wachtrij],
];

// ---------- catalogus ----------
const all = union(nodes.map(([, s]) => s));
const allBox = all.boundingBox();
const trackLen = tracks.map((t) => t.S.at(-1));
const topOf = (t) => Math.max(...t.P.map((p) => p[2]));
// Op het Max & Moritz Plein voor het station en naast de uitgang (AHN-maaiveld
// NAP +9,2 tot +9,3 m), niet op de heuvels in de baan.
const GROUND_SAMPLES = [
  [-8, -12],
  [0, -12],
  [10, -13],
  [24, -2],
  [-22, 0],
];

await writeLandmark({
  slug: "efteling-max-en-moritz",
  base: BASE,
  nodes,
  catalog: {
    name: "Max & Moritz (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: GROUND_SAMPLES,
    replacesBuildings: ["NL.IMBAG.Pand.0809100000017602"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (131483, 406637), het midden van het stationsgebouw, op het maaiveld van het Max & Moritz Plein (NAP +9,25 m), +X langs de lengteas van het station en de sporen erin naar het oost-zuidoosten (16,5° rechtsom van RD-oost), +Y 90° linksom daarop (naar de baan). Node building:baan: de twee banen Max en Moritz (elk ca. 300 m) als dichte band van 1,3 m breed met een driehoekige kiel tot 0,9 m, in bochten tot 9° gekanteld, op een steunwand van 0,9 m dik met spitse openingen om de ~3 m (de kolommen); drie opgaande helixen met de bovenste gang op kolommen met een console, vijf kruisingen, hoogste punt van de rails ca. 5,2 m boven het plein. Node building:station: het stationsgebouw rond het oude Bob-station (BAG-pand 0809100000017602): oud station met balkon en flauw zadeldak (nok 9,4 m), de hal aan de baankant (6,1 m) met vakwerk, het middendeel met schilddak (8,5 m), de Schmetterling-puntgevel (9,4 m) met erker en vogel, het vakwerkblok (6,0 m) met de uitrit van Moritz en de school van meester Lämpel (nok 9,8 m) met de uitrit van Max en het klokkentorentje (13,2 m). Node building:wachtrij: het paviljoen met schilddak, de overkapte meandering achter het station (2,5 m) en de overkapping onder de banen. Onderkant op 0,6 m onder het plein. Nodenaam klasse:label bepaalt de materiaalklasse.",
    realWorld: {
      opened: "2020-06-20",
      manufacturer: "MACK Rides (powered coaster, twee banen)",
      lengthM: +(allBox.max[0] - allBox.min[0]).toFixed(1),
      widthM: +(allBox.max[1] - allBox.min[1]).toFixed(1),
      highestPointM: +allBox.max[2].toFixed(2),
      highestPointNapM: +(allBox.max[2] + GROUND_NAP).toFixed(2),
      trackLengthMaxM: +trackLen[0].toFixed(0),
      trackLengthMoritzM: +trackLen[1].toFixed(0),
      highestRailM: [+topOf(tracks[0]).toFixed(2), +topOf(tracks[1]).toFixed(2)],
      trackWidthM: W,
      trackDepthM: H,
      stationRailM: +(RAIL_STATION_NAP - GROUND_NAP).toFixed(2),
      stationM: [STATION.east - STATION.west, STATION.north - STATION.south],
      roofHeightsM: { bobStation: 9.4, hal: 6.1, schilddak: 8.5, schmetterlingGevel: 9.4, vakwerkblok: 6.0, school: 9.8, torentje: 13.2 },
      groundNapM: GROUND_NAP,
      baseM: BASE,
    },
    sources: [
      "https://www.eftepedia.nl/lemma/Max_%26_Moritz",
      "https://www.eftepedia.nl/lemma/Max_%26_Moritz_Plein",
      "https://nl.wikipedia.org/wiki/Max_%26_Moritz_(Efteling)",
      "PDOK AHN DSM/DTM 0,5 m via WCS (opname na 2020, met de banen van Max & Moritz): ligging van alle baandelen, railhoogtes als maxima langs het pad, maaiveld en heuvels, daken van het station en de wachtrijoverkappingen",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR): tracé en kleur van de banen en de volgorde aan de kruisingen (hoge delen ca. 0,35 m per meter hoogte naar het zuiden verschoven; per punt gecorrigeerd)",
      "BAG-pand 0809100000017602 (oud Bob-station, 1985)",
      "Wikimedia Commons, Category:Max & Moritz (Efteling): station van alle kanten, bouwfoto's met de kolommen",
    ],
  },
});

// --dump <bestand>: de baanlijnen in RD (oost, noord, NAP) als JSON, voor de controle op luchtfoto en AHN.
if (process.argv.includes("--dump")) {
  const { writeFile } = await import("node:fs/promises");
  const toRd = ([x, y, z]) => [ORIGIN[0] + x * C - y * S, ORIGIN[1] + x * S + y * C, z + GROUND_NAP];
  await writeFile(process.argv[process.argv.indexOf("--dump") + 1], JSON.stringify({ max: tracks[0].P.map(toRd), moritz: tracks[1].P.map(toRd) }));
}
if (process.argv.includes("--faces")) {
  for (const [name, s] of nodes) console.log(name, JSON.stringify(downFaces(s, BASE).filter((g) => g.area > 2)));
}
console.log(JSON.stringify({ trackLen: trackLen.map((v) => +v.toFixed(1)), tops: tracks.map(topOf), bbox: allBox, supports: supports.length, helixColumns: helixColumns.length }, null, 1));

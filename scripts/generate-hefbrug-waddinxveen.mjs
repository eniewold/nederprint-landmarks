// Genereert een vereenvoudigd, gesloten 3D-model van de Hefbrug Waddinxveen:
// de geklonken stalen hefbrug (1935-1936, De Vries Robbé & Co., Gorinchem;
// rijksmonument 512003) over de Gouwe tussen de Kerkweg-Oost in Waddinxveen
// (west) en de Henegouwerweg (oost), met de twee konisch toelopende heftorens
// van open vakwerk, het val (hefdeel) in de laagste, gesloten stand met de twee
// vakwerkhoofdliggers en het bovenwindverband, de kop met de kabelwielen en het
// betonnen ballastblok in elke toren, de betonnen landhoofden en het
// veelhoekige brugwachtershuisje met koperen dak aan de zuidkant van de
// oostoever. De spoorbrug over de Gouwe ten zuiden van de hefbrug hoort er niet
// bij. Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB
// in meters (Y omhoog, de materiaalklasse in de nodenaam: de constructie als
// building, de bovenste 0,5 m van het dek als road:rijbaan, road:fietspad,
// road:voetpad en road:voetpad-tegels met de BGT-attributen) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal> met een printvorm (zie onder). De brug is 51 m lang
// en 45 m hoog en past op 1:1000 in 52 × 22 × 45 mm.
//
//   node scripts/generate-hefbrug-waddinxveen.mjs              # STL op 1:1000 (standaard)
//   node scripts/generate-hefbrug-waddinxveen.mjs --scale 1500
//
// Assenstelsel: oorsprong op de as van de rijbaan midden tussen de twee
// heftorens (RD 105089,30, 450869,40), op de waterspiegel van de Gouwe zoals
// het PDOK-terrein die legt (ellipsoïdisch 43,13 m; met NAP = ellipsoïdisch -
// 43,50 m op de wegen naast de brug is dat NAP -0,37 m), Z omhoog: z = NAP +
// 0,37. +X loopt langs de brug naar het oosten (de Henegouwerweg, RD-richting
// -10,12 graden vanaf het oosten), +Y naar het noorden, stroomafwaarts (de
// Gouwe stroomt naar Alphen). Het dek loopt van x = -25,6 (het westelijke
// landhoofd aan de Kerkweg-Oost) tot 25,5 (het oostelijke landhoofd); het val
// ligt tussen x = -12,5 en 12,5, de binnenzijde van de torens op x = ±12,6.
//
// Bronnen: Rijksmonumentenregister 512003 (geklonken stalen hefbrug met
// brugwachtershuisje; twee konisch toelopende heftorens van open geklonken
// vakwerk; het val met rijvloer, twee vakwerkhoofdliggers en een
// bovenwindverband; betonnen ballastblokken in de torens via kabelwielen
// bovenin; doorvaartwijdte 25 m, 9 m tussen de leuningen, doorvaarthoogte
// gesloten 2,5 m; betonnen landhoofden met gele baksteen; betonnen veelhoekig
// brugwachtershuisje onder koperen dak aan de zuidzijde; identiek aan Boskoop,
// Alphen is breder en hoger); Wikipedia (lengte 51 m, breedte 9 m, hoogte
// 45 m, gewicht 150 ton, hefdeel van 100 ton, ballastblok van 60 ton; in 2012
// voetpaden aan weerszijden van het val en fietsstroken); BGT
// overbruggingsdeel P0028.b2d16c6b8d754da7ba2dd43cb4a2d63e (dek) en
// P0028.ce75b06875de44c090e30e83ec1dbcf7 (oostelijk landhoofd), BGT wegdeel
// op het dek (rijbaan regionale weg, fietsstroken, voetpaden van asfalt en van
// tegels), BAG panden 0627100000017571 (westelijk landhoofd) en
// 0627100000002866 (brugwachtershuisje); AHN DSM en DTM 0,5 m (PDOK WCS) voor
// het wegdek (NAP +2,70 m aan de uiteinden tot +2,81 m midden op het val), de
// vakwerkliggers (hartlijnen 4,9 m naast de as, bovenrand NAP +7,2 m), de
// torens (binnenzijde x = ±12,4, voet van de schuine buitenzijde x = ±23,3,
// kop tussen ±12,3 en ±16,8, hoogste punt NAP +43,3 m, 12,4 m breed) en het
// brugwachtershuisje (koperen dak tot NAP +7,4 m, middelpunt x = 15,8,
// y = -10,1); PDOK-terrein voor de waterspiegel en de aansluitende wegen;
// PDOK-luchtfoto (8 cm) voor het windverband, de kop en het dak van het huisje;
// Wikimedia Commons-foto's (200518 Hefbrug Waddinxveen (2), (3), (7), (8),
// (9), (10) en (11); 200307 Hefbrug Waddinxveen - Geopend; 120901 Hefbrug
// Waddinxveen - Heftorens en Feestelijke heropening na renovatie; 2004010
// Hefbrug Waddinxveen - Brugwachtershuisje met matrixbord; Detail hefbrug met
// veelhoekig bedieningshuis met koperen dak - Waddinxveen - 20375886 - RCE;
// Val van de Waddinxveen hefbrug te Waddinxveen - Rijksmonument
// (22714876091); Hefbrug Waddinxveen - panoramio; HefbrugWveen;
// Waddixveen, hefbrug Waddixveen RM512003 IMG 0472 2019-07-01 15.54) voor het
// vakwerk van de torens (een verticale binnenstijl, een schuine buitenstijl,
// regels en diagonalen, kruisverbanden en een portaal met knieschoren tussen
// de poten), het val (8 vakken met stijlen en diagonalen, voetpaden buiten de
// liggers), de kop met de wielen, het ballastblok (wit, in gesloten stand
// bovenin) en het huisje. Geschat zijn de doorsnede van de poten (1,6 m dwars,
// staven van 0,9 tot 1,0 m), de hoogtes van de regels (om de 4,5 m vanaf NAP
// +9,0 m), het ballastblok (NAP +32,7 tot +37,7 m, 1,6 m dik, uit foto's), de
// kop (1,3 m dik) en de wielen (2,0 m), de constructiehoogte van het val
// (0,9 m) en van de dekken op de landhoofden (0,6 m), de vakverdeling van de
// liggers en het windverband en de vorm van het brugwachtershuisje
// (achthoekige kabine, vensterband als nis, dak met rand onder 45 graden).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hefbrug-waddinxveen");
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
const lerp = (a, b, t) => a + (b - a) * t;
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const prismCs = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
// Doorsnede in het XZ-vlak (CrossSection of polygonen), uitgetrokken langs Y van y0 tot y1.
const extrudeY = (shape, y0, y1) =>
  Manifold.extrude(shape, y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Doorsnede in het YZ-vlak (u = y, v = z), uitgetrokken langs X van x0 tot x1.
const extrudeX = (shape, x0, x1) =>
  Manifold.extrude(shape, x1 - x0)
    .rotate([90, 0, 0])
    .rotate([0, 0, 90])
    .translate([x0, 0, 0]);
// Schijf met de as langs Y (middelpunt cx, cz), van y0 tot y1.
const discY = (cx, cz, r, y0, y1, n = 40) =>
  Manifold.cylinder(y1 - y0, r, r, n, false)
    .rotate([-90, 0, 0])
    .translate([cx, y0, cz]);
// Regelmatige veelhoek in plattegrond (hoekpunt-straal r), van z0 tot z1.
const ngon = (cx, cy, r, n, z0, z1, phase = Math.PI / n) =>
  prism(
    Array.from({ length: n }, (_, k) => [cx + r * Math.cos(phase + (2 * Math.PI * k) / n), cy + r * Math.sin(phase + (2 * Math.PI * k) / n)]),
    z0,
    z1,
  );
// Staaf in een vlak: rechthoek rond het lijnstuk p-q met breedte w, aan beide
// uiteinden `ext` verlengd.
function bar([px, py], [qx, qy], w, ext = 0) {
  const len = Math.hypot(qx - px, qy - py);
  const d = [(qx - px) / len, (qy - py) / len];
  const n = [-d[1] * (w / 2), d[0] * (w / 2)];
  const a = [px - d[0] * ext, py - d[1] * ext];
  const b = [qx + d[0] * ext, qy + d[1] * ext];
  return ccw([
    [a[0] + n[0], a[1] + n[1]],
    [b[0] + n[0], b[1] + n[1]],
    [b[0] - n[0], b[1] - n[1]],
    [a[0] - n[0], a[1] - n[1]],
  ]);
}
const cs = (polys) => new CrossSection(polys.map(ccw), "Positive");
// Vakwerk in een vlak: de vereniging van de staven, bijgesneden op de omtrek.
// Geeft het vakwerk en de openingen (omtrek min staven) terug.
function lattice(outline, bars) {
  const clip = cs([outline]);
  const members = CrossSection.union(bars.map((b) => cs([b]))).intersect(clip);
  return { members, openings: clip.subtract(members), clip };
}
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

// ---------- hoofdmaten ----------
// z = NAP-hoogte + 0,37: het PDOK-terrein legt de Gouwe op ellipsoïdisch
// 43,13 m en ligt op de wegen naast de brug 43,50 m boven het AHN.
const WATER_NAP = -0.37;
const Z = (nap) => nap - WATER_NAP;
const BASE = -1.0; // gemeenschappelijke onderkant, onder de waterspiegel en het maaiveld
const GROUND_OFFSET = 0;
const GROUND_HEIGHT = 43.13; // PDOK-terreinhoogte (ellipsoïdisch) van de Gouwe op de maaiveldpunten

const WEST_END = -25.6; // westelijk landhoofd aan de Kerkweg-Oost (BGT)
const EAST_END = 25.5; // oostelijk landhoofd aan de Henegouwerweg (BGT)
const SPAN_END = 12.5; // het val tussen x = -12,5 en 12,5 (doorvaartwijdte 25 m)

// Wegdek in NAP-meters (AHN-DSM, 20e percentiel over de rijbaan): bijna vlak,
// iets bol op het val. Aan de Henegouwerweg ligt het AHN op +2,67 m, maar het
// PDOK-terrein van het oostelijke landhoofd (BGT-landhoofd met hoogteligging
// 0, dat zichtbaar blijft) tot NAP +2,78 m; het dek eindigt daar op +2,84 m (minstens 5 cm erboven),
// anders steekt het PDOK-landhoofd door het wegdek. De PDOK-weg erachter ligt
// op +2,70 m.
const ROAD_STATIONS = [
  [WEST_END, 2.7],
  [-13.0, 2.76],
  [0, 2.81],
  [13.0, 2.76],
  [EAST_END, 2.84],
];
function road(x) {
  const s = ROAD_STATIONS;
  if (x <= s[0][0]) return Z(s[0][1]);
  for (let i = 0; i + 1 < s.length; i++) {
    if (x <= s[i + 1][0]) return Z(lerp(s[i][1], s[i + 1][1], (x - s[i][0]) / (s[i + 1][0] - s[i][0])));
  }
  return Z(s[s.length - 1][1]);
}
// Stations langs X met de knikken van het wegdek en de voegen erin.
const stationsX = (x0, x1, step = 2) => {
  const xs = new Set([x0, x1]);
  const n = Math.max(1, Math.round((x1 - x0) / step));
  for (let i = 1; i < n; i++) xs.add(+(x0 + ((x1 - x0) * i) / n).toFixed(4));
  for (const [x] of ROAD_STATIONS) if (x > x0 && x < x1) xs.add(x);
  for (const x of [-SPAN_END, SPAN_END]) if (x > x0 && x < x1) xs.add(x);
  return [...xs].sort((a, b) => a - b);
};

// Dek (BGT overbruggingsdeel P0028.b2d16c6b8d754da7ba2dd43cb4a2d63e, lokaal,
// vereenvoudigd tot 5 cm). Het vlak omvat ook het voetpad naar het
// brugwachtershuisje en het verbrede voetpad aan de noordoostkant.
const DECK = [
  [25.47, 6.42], [21.22, 6.43], [21.48, 6.69], [21.44, 8.97], [21.30, 9.03], [19.98, 7.75], [13.37, 7.78], [13.37, 7.71],
  [6.79, 6.80], [-6.95, 6.82], [-13.36, 7.75], [-13.52, 7.72], [-13.52, 7.84], [-25.62, 7.84], [-25.56, -7.91], [-13.58, -7.89],
  [-6.95, -6.94], [6.77, -6.95], [13.34, -7.86], [13.44, -12.59], [18.12, -12.52], [18.05, -10.79], [19.12, -10.77], [19.12, -6.57],
  [25.48, -6.63],
];
// Landhoofden: westelijk = BAG-pand 0627100000017571 (betonnen landhoofd met
// ruimtes eronder, met afgeronde hoeken aan de waterkant), oostelijk = BGT
// landhoofd P0028.ce75b06875de44c090e30e83ec1dbcf7.
const WEST_ABUTMENT = [[-12.95, 6.43], [-25.61, 6.47], [-25.57, -6.51], [-12.88, -6.55], [-12.67, -6.45], [-12.51, -6.15], [-12.51, 5.9], [-12.68, 6.25]];
const EAST_ABUTMENT = [[25.47, 6.42], [12.45, 6.45], [12.5, -6.58], [25.48, -6.63]];
// Brugwachtershuisje (BAG-pand 0627100000002866): onderbouw op de
// BAG-contour tegen de zuidkant van het oostelijke landhoofd.
const CABIN_BASE = [[18.12, -12.52], [18.05, -10.79], [19.12, -10.77], [19.12, -6.57], [13.32, -6.58], [13.44, -12.59]];

// Dekken (geschat): het val een stalen rijvloer van 0,9 m (doorvaarthoogte
// gesloten circa 2,5 m), de dekken op de landhoofden een plaat van 0,6 m; de
// voetpaden langs de landhoofden kragen daarmee uit.
const SPAN_DEPTH = 0.9;
const LAND_DEPTH = 0.6;
const JOINT = { width: 0.3, depth: 0.3 };

// ---------- val (hefdeel) ----------
// Twee vakwerkhoofdliggers van 0,9 m dik, hartlijnen 4,9 m naast de as (AHN;
// fietsstrook tot 4,43 m, voetpad buiten de ligger vanaf 4,96 m). Evenwijdige
// randen, bovenkant NAP +7,2 m (AHN), 8 vakken van 3,125 m met stijlen en
// wisselende diagonalen (foto's), eindstijlen op x = ±12,5. Daartussen het
// bovenwindverband: dwarsregels bij elke stijl en een diagonaal per vak.
const TRUSS = { y0: 4.45, y1: 5.35, top: Z(7.2), chord: 0.9, bottomTop: Z(2.81) + 0.6, bar: 0.9, panels: 8 };
const SPAN_BOTTOM = Z(2.76) - SPAN_DEPTH; // onderkant van de rijvloer

// ---------- heftorens ----------
// Elke toren heeft twee poten, één aan elke kant van de rijbaan (y = ±4,6 tot
// ±6,2, foto's en AHN), elk een vlak vakwerk in zijaanzicht met een
// verticale binnenstijl langs het val (x = ±12,6 tot ±13,6) en een schuine
// buitenstijl (buitenkant van x = ±23,6 op het wegdek naar ±16,9 op NAP
// +40,6 m, 10 graden, AHN), met regels om de 4,5 m en wisselende diagonalen.
// Tussen de poten twee vlakken met regels en kruisverbanden: bij de
// binnenstijlen (verticaal) en bij de buitenstijlen (schuin); onderin een
// portaal met knieschoren boven de rijbaan. Bovenop de kop met de wielen en
// daaronder het ballastblok in gesloten stand.
const LEG = { y0: 4.6, y1: 6.2, post: 1.0, bar: 0.9 };
const INNER = 12.6; // binnenkant van de binnenstijl
const OUTER_ROAD = 23.6; // buitenkant van de buitenstijl op het wegdek
const OUTER_TOP = 16.9; // buitenkant van de buitenstijl onder de kop
const HEAD = { bottom: Z(40.6), top: Z(41.9), x0: 12.25, x1: 17.2, half: 6.4 };
const LEVELS = [9.0, 13.5, 18.0, 22.5, 27.1, 31.6, 36.1].map(Z);
const PORTAL = { knee: Z(6.6), y: 2.2 }; // knieschoren onder de onderste regel tussen de poten
const WHEEL = { r: 1.0, axle: Z(42.3), thick: 0.9, x: 14.6, y: 5.4 };
const WEIGHT = { x0: 14.1, x1: 15.7, half: 4.65, bottom: Z(32.7), top: Z(37.7) };
const NICHE = 0.35;
const ROAD_TOWER = Z(2.76);
// Buitenkant van de buitenstijl op hoogte z (x > 0, oostelijke toren).
const outerX = (z) => OUTER_ROAD + ((OUTER_TOP - OUTER_ROAD) * (z - ROAD_TOWER)) / (HEAD.bottom - ROAD_TOWER);

// ---------- brugwachtershuisje ----------
// Achthoekige kabine (straal 1,9 m) op de onderbouw, vensterband als nis van
// 0,3 m, dakrand onder 45 graden en een lage koepel van koper tot NAP +7,4 m
// (AHN; PDOK +7,46 m).
const CABIN = { cx: 15.8, cy: -10.1, r: 1.9, base: Z(3.1), glass: [Z(4.6), Z(6.0)], eave: Z(6.4), rim: 2.35, rimTop: Z(6.95), roof: Z(7.4) };

// ---------- dek ----------
const deckBand = (x0, x1, below) =>
  loftX(
    stationsX(x0, x1).map((x) => {
      const zt = road(x);
      return { x, section: [[-14, zt - below], [14, zt - below], [14, zt], [-14, zt]] };
    }),
  );
const clipX = (x0, x1) => boxFromTo(x0, x1, -20, 20, BASE - 1, 60);
const deckPrism = prism(DECK, BASE - 0.5, 60);
const spanDeck = deckBand(-SPAN_END, SPAN_END, SPAN_DEPTH).intersect(deckPrism);
const westDeck = deckBand(WEST_END - 0.1, -SPAN_END, LAND_DEPTH).intersect(deckPrism).intersect(clipX(WEST_END - 1, -SPAN_END));
const eastDeck = deckBand(SPAN_END, EAST_END + 0.1, LAND_DEPTH).intersect(deckPrism).intersect(clipX(SPAN_END, EAST_END + 1));
const belowRoad = (x0, x1, gap) =>
  loftX(stationsX(x0, x1).map((x) => ({ x, section: [[-14, BASE], [14, BASE], [14, road(x) - gap], [-14, road(x) - gap]] })));
const westAbutment = prism(WEST_ABUTMENT, BASE, 20).intersect(belowRoad(WEST_END - 1, -SPAN_END + 1, 0.05));
const eastAbutment = prism(EAST_ABUTMENT, BASE, 20).intersect(belowRoad(SPAN_END - 1, EAST_END + 1, 0.05));
// Voegen van het val: sleuven over het dek, buiten de liggers en de poten.
const jointSpans = [[-8, -6.3], [-4.4, 4.4], [6.3, 8]];
const joints = [-SPAN_END, SPAN_END].flatMap((x) =>
  jointSpans.map(([y0, y1]) => boxFromTo(x - JOINT.width / 2, x + JOINT.width / 2, y0, y1, road(x) - JOINT.depth, road(x) + 1)),
);

// ---------- vakwerkliggers en windverband ----------
const panel = (2 * SPAN_END) / TRUSS.panels;
const panelX = Array.from({ length: TRUSS.panels + 1 }, (_, k) => -SPAN_END + k * panel);
const trussOutline = [[-SPAN_END, SPAN_BOTTOM], [SPAN_END, SPAN_BOTTOM], [SPAN_END, TRUSS.top], [-SPAN_END, TRUSS.top]];
const trussBars = (() => {
  const b = TRUSS.bar;
  const zb = TRUSS.bottomTop - b / 2; // hartlijn onderrand (boven het dek)
  const zt = TRUSS.top - b / 2; // hartlijn bovenrand
  const bars = [
    bar([-SPAN_END - 1, (SPAN_BOTTOM + TRUSS.bottomTop) / 2], [SPAN_END + 1, (SPAN_BOTTOM + TRUSS.bottomTop) / 2], TRUSS.bottomTop - SPAN_BOTTOM),
    bar([-SPAN_END - 1, zt], [SPAN_END + 1, zt], b),
  ];
  panelX.forEach((x, k) => {
    const xc = k === 0 ? x + b / 2 : k === TRUSS.panels ? x - b / 2 : x;
    bars.push(bar([xc, SPAN_BOTTOM - 1], [xc, TRUSS.top + 1], b));
  });
  for (let k = 0; k < TRUSS.panels; k++) {
    const [xa, xb] = [k === 0 ? panelX[k] + b / 2 : panelX[k], k + 1 === TRUSS.panels ? panelX[k + 1] - b / 2 : panelX[k + 1]];
    // Diagonalen wisselend, symmetrisch om het midden (W-vorm).
    const up = k % 2 === 0;
    bars.push(up ? bar([xa, zb], [xb, zt], b, 0.6) : bar([xa, zt], [xb, zb], b, 0.6));
  }
  return bars;
})();
const trussLattice = lattice(trussOutline, trussBars);
const trusses = [1, -1].map((s) => extrudeY(trussLattice.members, s > 0 ? TRUSS.y0 : -TRUSS.y1, s > 0 ? TRUSS.y1 : -TRUSS.y0));
// Windverband in plattegrond op de hoogte van de bovenrand.
const windBars = [];
panelX.forEach((x, k) => {
  const xc = k === 0 ? x + TRUSS.bar / 2 : k === TRUSS.panels ? x - TRUSS.bar / 2 : x;
  windBars.push(bar([xc, -TRUSS.y0 - 0.2], [xc, TRUSS.y0 + 0.2], TRUSS.bar));
});
for (let k = 0; k < TRUSS.panels; k++) {
  const s = k % 2 === 0 ? 1 : -1;
  windBars.push(bar([panelX[k], -s * TRUSS.y0], [panelX[k + 1], s * TRUSS.y0], TRUSS.bar, 0.3));
}
const windOutline = [[-SPAN_END, -TRUSS.y0 - 0.1], [SPAN_END, -TRUSS.y0 - 0.1], [SPAN_END, TRUSS.y0 + 0.1], [-SPAN_END, TRUSS.y0 + 0.1]];
const windBracing = prismCs(lattice(windOutline, windBars).members, TRUSS.top - TRUSS.bar, TRUSS.top);

// ---------- heftorens ----------
// Zijaanzicht van een poot (XZ, oostelijke toren, x > 0).
const legBottom = ROAD_TOWER - 0.3;
const legOutline = [
  [INNER, legBottom],
  [outerX(legBottom), legBottom],
  [OUTER_TOP, HEAD.bottom + 0.05],
  [INNER, HEAD.bottom + 0.05],
];
const legLattice = (() => {
  const b = LEG.bar;
  const p = LEG.post;
  const innerC = INNER + p / 2;
  const outerC = (z) => outerX(z) - p / 2;
  const sillTop = ROAD_TOWER + 0.9;
  const bars = [
    bar([innerC, legBottom - 1], [innerC, HEAD.bottom + 1], p),
    bar([outerC(legBottom - 1), legBottom - 1], [outerC(HEAD.bottom + 1), HEAD.bottom + 1], p),
    bar([INNER - 1, (legBottom + sillTop) / 2], [OUTER_ROAD + 1, (legBottom + sillTop) / 2], sillTop - legBottom),
  ];
  for (const z of LEVELS) bars.push(bar([INNER - 1, z], [OUTER_ROAD + 1, z], b));
  // Diagonalen: onderin van de voet van de buitenstijl naar de binnenstijl op
  // de onderste regel, daarboven wisselend.
  const nodes = [sillTop - b / 2, ...LEVELS, HEAD.bottom - b / 2];
  for (let i = 0; i + 1 < nodes.length; i++) {
    const [za, zb] = [nodes[i], nodes[i + 1]];
    const fromOuter = i % 2 === 0;
    bars.push(fromOuter ? bar([outerC(za), za], [innerC, zb], b, 0.6) : bar([innerC, za], [outerC(zb), zb], b, 0.6));
  }
  return lattice(legOutline, bars);
})();
// Vlak tussen de poten (YZ): regels, kruisverbanden en het portaal.
const faceOutline = [[-LEG.y0 - 0.05, ROAD_TOWER], [LEG.y0 + 0.05, ROAD_TOWER], [LEG.y0 + 0.05, HEAD.bottom + 0.05], [-LEG.y0 - 0.05, HEAD.bottom + 0.05]];
const faceLattice = (() => {
  const b = LEG.bar;
  const w = LEG.y0 + 1;
  const bars = [];
  for (const z of LEVELS) bars.push(bar([-w, z], [w, z], b));
  const nodes = [...LEVELS, HEAD.bottom - b / 2];
  for (let i = 0; i + 1 < nodes.length; i++) {
    bars.push(bar([-LEG.y0, nodes[i]], [LEG.y0, nodes[i + 1]], b, 0.6));
    bars.push(bar([LEG.y0, nodes[i]], [-LEG.y0, nodes[i + 1]], b, 0.6));
  }
  // Portaal: knieschoren van de poten naar de onderste regel.
  for (const s of [-1, 1]) bars.push(bar([s * (LEG.y0 + 0.3), PORTAL.knee], [s * PORTAL.y, LEVELS[0]], b, 0.3));
  return lattice(faceOutline, bars);
})();
// Printvorm van een eindvlak (STL): een dichte wand met een spitse doorgang
// voor de rijbaan (wanden tot de knieschoren, dan 55 graden naar de top) en de
// openingen boven de tweede regel als nissen.
const PASSAGE_APEX = PORTAL.knee + LEG.y0 * Math.tan((55 * Math.PI) / 180);
const passage = [
  [-LEG.y0, ROAD_TOWER - 1],
  [LEG.y0, ROAD_TOWER - 1],
  [LEG.y0, PORTAL.knee],
  [0, PASSAGE_APEX],
  [-LEG.y0, PORTAL.knee],
];
const faceAbovePortal = {
  niches: faceLattice.openings.intersect(cs([[[-10, LEVELS[1] + LEG.bar / 2], [10, LEVELS[1] + LEG.bar / 2], [10, 60], [-10, 60]]])),
};

function tower(side) {
  // Bouw de oostelijke toren (x > 0) en spiegel voor de westelijke.
  const t = LEG.post;
  const legs = [1, -1].map((s) => extrudeY(legLattice.members, s > 0 ? LEG.y0 : -LEG.y1, s > 0 ? LEG.y1 : -LEG.y0));
  const innerFace = extrudeX(faceLattice.members, INNER, INNER + t);
  const shear = (m) =>
    m.warp((v) => {
      v[0] += outerX(v[2]) - OUTER_ROAD;
    });
  const outerFace = shear(extrudeX(faceLattice.members, OUTER_ROAD - t, OUTER_ROAD));
  // STL: de toren als dicht lichaam tussen de vier vlakken met een spitse
  // doorgang voor de rijbaan; de openingen van het vakwerk als nissen van
  // 0,35 m op de zijvlakken van de poten en op beide eindvlakken.
  const printBody = extrudeY(legLattice.clip, -LEG.y1, LEG.y1)
    .subtract(extrudeX(cs([passage]), INNER - 1, OUTER_ROAD + 1))
    .subtract(
      union([
        extrudeY(legLattice.openings, LEG.y1 - NICHE, LEG.y1 + 0.5),
        extrudeY(legLattice.openings, -LEG.y1 - 0.5, -LEG.y1 + NICHE),
        extrudeX(faceAbovePortal.niches, INNER - 0.5, INNER + NICHE),
        shear(extrudeX(faceAbovePortal.niches, OUTER_ROAD - NICHE, OUTER_ROAD + 0.5)),
      ]),
    );
  // Kop: van de bovenkant van de poten (x = 12,6 tot 16,9) onder 49 graden
  // naar de bovenplaat (12,25 tot 17,2).
  const head = Manifold.hull([
    boxFromTo(INNER, OUTER_TOP, -HEAD.half + 0.3, HEAD.half - 0.3, HEAD.bottom, HEAD.bottom + 0.01),
    boxFromTo(HEAD.x0, HEAD.x1, -HEAD.half, HEAD.half, HEAD.bottom + 0.4, HEAD.top),
  ]);
  const wheels = [1, -1].map((s) =>
    discY(WHEEL.x, WHEEL.axle, WHEEL.r, s * WHEEL.y - WHEEL.thick / 2, s * WHEEL.y + WHEEL.thick / 2),
  );
  // Ballastblok tussen de poten, tegen de poten aan (in werkelijkheid in
  // geleiders), in de hoogste stand omdat de brug dicht is.
  const weight = boxFromTo(WEIGHT.x0, WEIGHT.x1, -WEIGHT.half, WEIGHT.half, WEIGHT.bottom, WEIGHT.top);
  const mirror = (m) => (side > 0 ? m : m.mirror([1, 0, 0]));
  return {
    model: mirror(union([...legs, innerFace, outerFace, head, ...wheels, weight])),
    print: mirror(union([printBody, head, ...wheels])),
  };
}
const towerParts = [-1, 1].map(tower);

// ---------- brugwachtershuisje ----------
const cabin = (() => {
  const { cx, cy, r, base, glass, eave, rim, rimTop, roof } = CABIN;
  const plinth = prism(CABIN_BASE, BASE, base);
  const body = ngon(cx, cy, r, 8, base - 0.05, eave);
  const windows = ngon(cx, cy, r + 1, 8, glass[0], glass[1]).subtract(ngon(cx, cy, r - 0.3, 8, glass[0] - 1, glass[1] + 1));
  const eaves = Manifold.hull([ngon(cx, cy, r, 8, eave - 0.01, eave), ngon(cx, cy, rim, 8, eave + (rim - r) - 0.01, eave + (rim - r))]);
  const rimBand = ngon(cx, cy, rim, 8, eave + (rim - r) - 0.01, rimTop);
  const dome = Manifold.hull([ngon(cx, cy, rim, 8, rimTop - 0.01, rimTop), ngon(cx, cy, 1.5, 8, roof - 0.2, roof - 0.19), ngon(cx, cy, 0.8, 8, roof - 0.01, roof)]);
  return union([plinth, body.subtract(windows), eaves, rimBand, dome]);
})();

// ---------- printvoet (alleen in de STL) ----------
// Het val hangt tussen de landhoofden vrij. Net als de overhangopvulling van
// de export krijgt de STL daaronder een wig van 50 graden vanaf de onderkant
// van de dekrand die uitloopt in een scherm van minstens 0,8 mm op printschaal
// tot de onderplaat. De voetpaden die langs de landhoofden uitkragen, lopen in
// de STL tot de onderplaat door.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const printFoot = loftX(
  stationsX(-SPAN_END - 0.3, SPAN_END + 0.3, 1).map((x) => {
    const w = 7.85;
    const zb = SPAN_BOTTOM + 0.02;
    const zIn = road(x) - 0.4;
    const zs = zb - KNEE * (w - SCREEN);
    if (zs > BASE + 0.05) {
      return { x, section: [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [w, zIn], [-w, zIn], [-w, zb], [-SCREEN, zs]] };
    }
    // Laag dek: de wig komt al op de onderplaat uit.
    const a = w - (zb - BASE) / KNEE;
    return { x, section: [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [w, zIn], [-w, zIn], [-w, zb], [-a - 1e-3, BASE + 1e-3]] };
  }),
).intersect(prism(DECK, BASE - 0.5, 60)); // de voetpaden van het val worden naar de uiteinden breder
const landPrint = [
  prism(DECK, BASE, 20).intersect(clipX(WEST_END - 1, -SPAN_END)).intersect(belowRoad(WEST_END - 1, -SPAN_END + 1, 0.05)),
  prism(DECK, BASE, 20).intersect(clipX(SPAN_END, EAST_END + 1)).intersect(belowRoad(SPAN_END - 1, EAST_END + 1, 0.05)),
];

const common = [spanDeck, westDeck, eastDeck, westAbutment, eastAbutment, cabin];
const bridge = union([...common, ...trusses, windBracing, ...towerParts.map((t) => t.model)]).subtract(union(joints));
const printBridge = union([...common, ...landPrint, ...towerParts.map((t) => t.print), printFoot, ...printTrusses()]).subtract(union(joints));
// STL: de liggers als dichte platen met de openingen als nissen van 0,35 m aan
// de buitenkant, zonder windverband.
function printTrusses() {
  return [1, -1].map((s) => {
    const [ya, yb] = s > 0 ? [TRUSS.y0, TRUSS.y1] : [-TRUSS.y1, -TRUSS.y0];
    const plate = extrudeY(trussLattice.clip, ya, yb);
    const niche = s > 0 ? extrudeY(trussLattice.openings, yb - NICHE, yb + 0.5) : extrudeY(trussLattice.openings, ya - 0.5, ya + NICHE);
    return plate.subtract(niche);
  });
}

// ---------- controles ----------
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    found.push({ p, area: len / 2 });
  }
  return found;
}
for (const [name, solid] of [["model", bridge], ["print", printBridge]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  const parts = solid.decompose();
  const big = parts.filter((p) => p.volume() > 1e-3).length;
  parts.forEach((p) => p.delete());
  if (big !== 1) throw new Error(`${name}: ${big} losse delen`);
}
const classify = (solid) => {
  const buckets = {};
  for (const { p, area } of overhangs(solid)) {
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const ym = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const key =
      Math.abs(xm) > INNER - 0.4 && zm > road(xm) + 1
        ? zm > HEAD.bottom - 0.5
          ? "kop en wielen"
          : "torens (regels, verbanden, ballast, nissen)"
        : Math.abs(xm) < SPAN_END + 0.2 && zm > road(xm) + 0.5
          ? "liggers en windverband"
          : Math.hypot(xm - CABIN.cx, ym - CABIN.cy) < 3.5 && zm > CABIN.base
            ? "brugwachtershuisje"
            : zm <= road(xm) + 0.05
              ? "onder het dek"
              : "overig";
    buckets[key] = +((buckets[key] ?? 0) + area).toFixed(2);
  }
  return buckets;
};
console.log("vrij hangend in het model (m2):", classify(bridge));
console.log("vrij hangend in de printvorm (m2):", classify(printBridge));

// ---------- wegdelen als eigen onderdelen ----------
// Pas na het samenstellen van het printmodel: de bovenste 0,5 m van het dek
// is per BGT-functie een eigen node met de attributen van het wegdeel
// (glTF `extras.attributes`), zodat de kleurregels van een thema erop werken
// zoals op de PDOK-wegdelen. De strook loopt van 0,5 m onder tot 1 m boven het
// wegdek over de BGT-wegdelen op het dek (lokaal, vereenvoudigd tot 5 cm; de
// uiteinden lopen door tot voorbij het dekeinde); de liggers, de poten van de
// torens en de voegen blijven met 2 cm vrij
// constructie. Elk wegdeel = strook ∩ zijn BGT-vlakken ∩ brug.
const LAYER = 0.5;
const ABOVE = 1.0;
const asphalt = { bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const ROADWAYS = [
  {
    name: "road:rijbaan",
    attributes: { bgt_functie: "rijbaan regionale weg", ...asphalt },
    // P0028.125eddb8ed5e403c92699baf8cc4f17c, P0028.d53da91fb013498687761edfd53fd962, P0028.e699ef47c2fd40f882063158e3a186c2
    polygons: [
      [[-13.53, 2.95], [-25.59, 2.95], [-25.58, -3.1], [-13.52, -3.07]],
      [[13.43, 2.9], [-13.53, 2.95], [-13.52, -3.07], [13.4, -3.04]],
      [[25.44, 2.79], [13.43, 2.9], [13.4, -3.04], [17.65, -3.04], [19.1, -3.28], [20.49, -3.92], [21.02, -4.49], [25.44, -4.48]],
    ],
  },
  {
    name: "road:fietspad",
    attributes: { bgt_functie: "fietspad", ...asphalt },
    // P0028.990108f2c46448259921e78a78e9b7be, P0028.4b528ca668564da596a20bdcbabb38fc, P0028.776aa07d073c4d5f9693a5721f82a8b1 (noord),
    // P0028.95a81527157a4313b9118a37fdcda3f8, P0028.9cd8bc959629427b91a68c531966fd32, P0028.a2721c0301a645fc85f1a6826e687b5b (zuid)
    polygons: [
      [[-13.52, 4.32], [-25.59, 4.36], [-25.59, 2.95], [-13.53, 2.95]],
      [[-13.53, 4.43], [-13.53, 2.95], [13.43, 2.9], [13.43, 4.41]],
      [[25.44, 4.33], [13.43, 4.29], [13.43, 2.9], [25.44, 2.79]],
      [[-25.58, -3.1], [-25.58, -4.45], [-13.52, -4.54], [-13.52, -3.07]],
      [[-13.52, -3.07], [-13.52, -4.54], [13.4, -4.51], [13.4, -3.04]],
      [[17.65, -3.04], [13.4, -3.04], [13.4, -4.51], [21.02, -4.49], [20.49, -3.92], [19.1, -3.28]],
    ],
  },
  {
    name: "road:voetpad",
    attributes: { bgt_functie: "voetpad", ...asphalt },
    // P0028.7a868b7dd4d64c458e7f1ca22746c7ae, P0028.2e4bb630e8e1453aab522b29d5b5ef72 (noord),
    // P0028.7576d4f696734f018019c0d9ae564f1a, P0028.6700020fc1cc40d5b0f4120ad5b65f4d (zuid)
    polygons: [
      [[-13.53, 6.44], [-25.61, 6.47], [-25.59, 4.36], [-24.46, 4.34], [-24.48, 5.92], [-15.04, 5.94], [-13.53, 6.18]],
      [[-6.95, 6.82], [-13.52, 7.72], [-13.52, 7.84], [-20.89, 7.84], [-20.89, 6.45], [-13.53, 6.44], [-13.53, 5.83], [-7.03, 4.96], [6.93, 4.95], [13.37, 5.8], [13.37, 7.71], [6.79, 6.8]],
      [[-25.57, -6.51], [-13.56, -6.55], [-13.55, -6.01], [-24.43, -6.02], [-24.46, -4.45], [-25.58, -4.45]],
      [[-7.08, -5.06], [-13.55, -5.94], [-13.56, -6.55], [-25.57, -6.51], [-25.56, -7.91], [-13.58, -7.89], [-6.95, -6.94], [6.77, -6.95], [13.34, -7.86], [13.36, -5.97], [6.91, -5.06]],
    ],
  },
  {
    name: "road:voetpad-tegels",
    attributes: { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "open verharding", plus_fysiekvoorkomen: "tegels" },
    // P0028.0a0ae7d7ae4f45048d0d5e9b27cee1c5 (west), P0028.7ad498ace4e947c282d5e083320ca174 (oost, noordkant)
    polygons: [
      [[-25.61, 6.47], [-20.89, 6.45], [-20.89, 7.84], [-25.62, 7.84]],
      [[19.98, 7.75], [13.37, 7.78], [13.37, 5.86], [20.63, 5.85], [21.48, 6.69], [21.44, 8.97], [21.3, 9.03]],
    ],
  },
];
// Uiteinden doortrekken tot voorbij het dekeinde.
const extendEnds = (poly) => poly.map(([x, y]) => [x < WEST_END + 0.3 ? WEST_END - 1 : x > EAST_END - 0.3 ? EAST_END + 1 : x, y]);
const strip = loftX(
  stationsX(WEST_END - 0.5, EAST_END + 0.5).map((x) => {
    const zt = road(x);
    return { x, section: [[-14, zt - LAYER], [14, zt - LAYER], [14, zt + ABOVE], [-14, zt + ABOVE]] };
  }),
);
// Wat constructie blijft, 2 cm groter.
const guards = union([
  ...[1, -1].map((s) => boxFromTo(-SPAN_END - 0.02, SPAN_END + 0.02, s * (TRUSS.y0 - 0.02), s * (TRUSS.y1 + 0.02), BASE, 30)),
  ...[1, -1].flatMap((sx) =>
    [1, -1].map((sy) => boxFromTo(sx * (INNER - 0.02), sx * (OUTER_ROAD + 0.4), sy * (LEG.y0 - 0.02), sy * (LEG.y1 + 0.02), BASE, 30)),
  ),
  ...joints.map((j) => {
    const bb = j.boundingBox();
    return boxFromTo(bb.min[0] - 0.02, bb.max[0] + 0.02, bb.min[1] - 0.02, bb.max[1] + 0.02, bb.min[2] - 0.02, bb.max[2] + 0.02);
  }),
]);
const free = strip.subtract(guards);
const cuts = ROADWAYS.map(({ polygons }) => free.intersect(union(polygons.map((poly) => prism(extendEnds(poly), BASE, 60)))));
// Overlap tussen BGT-vlakken (enkele cm) gaat naar het eerste vlak in de lijst.
for (let i = 1; i < cuts.length; i++) cuts[i] = cuts[i].subtract(union(cuts.slice(0, i)));
const roadParts = ROADWAYS.map(({ name, attributes }, i) => [name, cuts[i].intersect(bridge), attributes]);
const structure = bridge.subtract(union(cuts));
const parts = [["building:hefbrug-waddinxveen", structure], ...roadParts];
{
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  console.log(
    "volumes (m3):",
    Object.fromEntries(parts.map(([name, solid]) => [name, +solid.volume().toFixed(1)])),
    "som",
    +sum.toFixed(1),
    "brug",
    +bridge.volume().toFixed(1),
  );
  if (Math.abs(sum - bridge.volume()) > 0.5) throw new Error("onderdelen tellen niet op tot de brug");
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
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}
report.towers = {
  topNap: +(WHEEL.axle + WHEEL.r + WATER_NAP).toFixed(2),
  headNap: [+(HEAD.bottom + WATER_NAP).toFixed(2), +(HEAD.top + WATER_NAP).toFixed(2)],
  inner: INNER,
  outerAtRoad: OUTER_ROAD,
  outerAtHead: OUTER_TOP,
};
const glbFile = path.join(outDir, "hefbrug-waddinxveen.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-hefbrug-waddinxveen.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van de landhoofden, het huisje en de
// printvoet op het printbed.
const stlName = `hefbrug-waddinxveen-1-${scale}.stl`;
const printSolid = printBridge.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Hefbrug Waddinxveen 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveldpunten op het water van de Gouwe, 14 m naast de as.
const samplePoints = [-8, 0, 8].flatMap((x) => [
  [x, 14],
  [x, -14],
]);
await writeFile(
  path.join(outDir, "hefbrug-waddinxveen.json"),
  JSON.stringify(
    {
      name: "Hefbrug Waddinxveen",
      file: "hefbrug-waddinxveen.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [105089.3, 450869.4],
      xAxis: [0.98444, -0.17571],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0627100000017571", "NL.IMBAG.Pand.0627100000002866"],
      replacesTerrain: [
        "P0028.b2d16c6b8d754da7ba2dd43cb4a2d63e",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van de rijbaan midden tussen de twee heftorens op de waterspiegel van de Gouwe (NAP -0,37 m zoals het PDOK-terrein die legt, z = NAP + 0,37) in de oorsprong, +X langs de brug naar het oosten (de Henegouwerweg, RD-richting -10,12 graden vanaf het oosten) en +Y naar het noorden, stroomafwaarts. Vijf nodes: road:rijbaan, road:fietspad, road:voetpad en road:voetpad-tegels, de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan regionale weg, fietspad of voetpad, bgt_fysiekvoorkomen gesloten verharding met plus_fysiekvoorkomen asfalt, of open verharding met tegels), zodat de kleurregels van een thema erop werken; en building: de rest van de hefbrug van het westelijke landhoofd aan de Kerkweg-Oost (x = -25,6) tot het oostelijke aan de Henegouwerweg (x = 25,5). Twee heftorens van open vakwerk (binnenstijl verticaal op x = ±12,6, schuine buitenstijl van ±23,6 op het wegdek naar ±16,9 onder de kop, poten van 1,6 m dwars op y = ±4,6 tot ±6,2, regels om de 4,5 m met diagonalen, tussen de poten regels en kruisverbanden in het vlak van de binnen- en van de buitenstijlen met een portaal met knieschoren boven de rijbaan), een kop tot NAP +41,9 m met twee kabelwielen van 2,0 m tot +43,3 m en het betonnen ballastblok tussen de poten in de hoogste stand (de brug is dicht); het val van 25 m in de laagste stand met twee vakwerkliggers van 8 vakken (bovenkant NAP +7,2 m) en het bovenwindverband, de rijvloer van 0,9 m en de voetpaden buiten de liggers; de betonnen landhoofden (BGT en BAG) en het brugwachtershuisje (BAG-pand) met achthoekige kabine, vensterband en koperen dak tot NAP +7,4 m aan de zuidkant van de oostoever. Het wegdek ligt op NAP +2,70 m aan de Kerkweg-Oost, +2,81 m midden op het val en +2,84 m aan de Henegouwerweg (boven het PDOK-landhoofd, het AHN geeft +2,67 m). Leuningen, lantaarns, verkeerslichten, slagbomen, matrixborden, kabels, ladders en bordessen, de remmingwerken langs het water, het viaduct onder de Kerkweg-Oost en de open stand van het val zijn weggelaten; wat zonder steun niet print (de regels en kruisverbanden van de torens, de kop, het ballastblok, het windverband, het dek) vult de export op. De STL heeft een printvorm: dichte vlakken met nissen in plaats van het open vakwerk, een spitse doorgang voor de rijbaan, geen windverband en ballastblok, en onder het val een printvoet. Het maaiveld wordt op het water bemonsterd; groundHeight is de PDOK-terreinhoogte van de Gouwe (ellipsoïdisch). Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_END - WEST_END).toFixed(1),
        liftSpanM: 2 * SPAN_END,
        clearWidthM: 2 * INNER,
        towerTopNapM: report.towers.topNap,
        towerBaseM: +(OUTER_ROAD - INNER).toFixed(2),
        towerWidthM: 2 * LEG.y1,
        trussTopNapM: 7.2,
        counterweightNapM: [32.7, 37.7],
        cabinTopNapM: 7.4,
        roadNapM: Object.fromEntries(ROAD_STATIONS.map(([x, nap]) => [x, nap])),
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/512003",
        "https://nl.wikipedia.org/wiki/Hefbrug_Waddinxveen",
        "PDOK BGT overbruggingsdeel (dek, oostelijk landhoofd) en wegdeel (rijbaan, fietsstroken, voetpaden op het dek), EPSG:28992",
        "PDOK BAG panden 0627100000017571 (westelijk landhoofd) en 0627100000002866 (brugwachtershuisje)",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de vakwerkliggers, de torens en het brugwachtershuisje",
        "PDOK luchtfoto (Actueel_orthoHR) voor het windverband, de kop en het dak van het huisje",
        "Wikimedia Commons: 200518 Hefbrug Waddinxveen (2), (3), (7), (8), (9), (10) en (11).jpg; 200307 Hefbrug Waddinxveen - Geopend.jpg; 120901 Hefbrug Waddinxveen - Heftorens.jpg en Feestelijke heropening na renovatie.jpg; 2004010 Hefbrug Waddinxveen - Brugwachtershuisje met matrixbord.jpg; Detail hefbrug met veelhoekig bedieningshuis met koperen dak - Waddinxveen - 20375886 - RCE.jpg; Val van de Waddinxveen hefbrug te Waddinxveen - Rijksmonument (22714876091).jpg; Hefbrug Waddinxveen - panoramio.jpg; HefbrugWveen.jpg; Waddixveen, hefbrug Waddixveen RM512003 IMG 0472 2019-07-01 15.54.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

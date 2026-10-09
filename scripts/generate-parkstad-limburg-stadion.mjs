// Genereert een gedetailleerd, gesloten 3D-model van het Parkstad Limburg
// Stadion in Kerkrade (thuisstadion van Roda JC, geopend in 2000, ontwerp Jan
// Dautzenberg, 19.979 plaatsen). Het stadion is één BAG-pand met vier
// aanbouwen (een per tribune). Het model bestaat uit:
// - vier tribunes rond een rechthoekige veldopening (128,8 bij 86,1 m), elk
//   met een doorsnede die langs de zijde is uitgetrokken: een opgetrokken
//   zitrang in treden die onder het dak open blijft, een achterwand met een
//   donkere band (bovenste omloop, bij de hoofdtribune de skyboxen) en een
//   dakplaat van 1,8 m dik die 25 m (hoofdtribune 19,5 m) over de rang
//   uitkraagt;
// - op de dakplaat de witte membraantonnen: per vak van 10,75 m een
//   tongewelf dat dwars op de tribune loopt (11 vakken op de lange zijden, 7
//   op de korte), tussen radiale vakwerkspanten die aan de veldkant uitsteken,
//   en een vakwerkligger langs de voorrand;
// - vier gesloten hoeken met een kegelvormige tentdoek (top +23 m boven het
//   veld) boven een zitrang die met de hoek meedraait;
// - vier witte lichtmasten: een vakwerkgiek die vanaf een pijler op de
//   buitenhoek schuin over de tent naar binnen loopt, met de lampenkop boven
//   de hoek van het veld (+43 m boven het veld, 45 m boven straat);
// - de aanbouwen: aan de westzijde (Koempeltribune) de bakstenen gevel met
//   het hoge middendeel, het glazen tongewelf met het clublogo en de lagere
//   vleugels, aan de oostzijde de lage strook met de twee hellingbanen en het
//   hoge winkelgebouw (Albert Heijn XL) met entree, aan de zuidzijde het hotel
//   met de lagere vleugels, aan de noordzijde (hoofdtribune) de strook achter
//   de skyboxen met de gebogen glazen middengevel; raamnissen in de gevels en
//   de installaties op de daken.
// Alles is opgebouwd uit blokken, prisma's, uitgetrokken en gedraaide
// doorsneden en convexe rompen van vlakken (geen hoogteveld). Alle maten zijn
// meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-parkstad-limburg-stadion.mjs              # 1:1000 (standaard)
//   node scripts/generate-parkstad-limburg-stadion.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening (het midden tussen de
// voorranden van de vier daken), Z omhoog, z = 0 op het laagste maaiveld rond
// het stadion (groundHeight 216,29 m ellipsoïdisch, circa NAP +170,4 m). Het
// veld ligt hoger, op z = 1,91 m (PDOK 218,20 m, AHN NAP +172,3 m); het terrein
// rond de gevels ligt op NAP +170,6 tot +171,2 m. Alle hoogtes uit het AHN zijn
// gemeten boven het veld en met P(h) omgezet. +X loopt langs de lange as van het
// veld naar het oostnoordoosten (RD-richting (0,8862, 0,4633), 27,6 graden, uit
// de voorranden van de vier daken in het AHN), +Y dwars daarop naar het
// noordnoordwesten, naar de hoofdtribune.
//
// Overhang: de dakplaten, de tentdoeken, de spanten aan de veldkant, de giek en
// de lampenkoppen hangen uit (ondervlakken onder 45 graden boven
// OVERHANG_MIN_Z); daaronder wijst geen vlak flauwer dan 45 graden omlaag.
//
// Bronnen: BAG-panden 0928100000125190 (stadion), 125458 (aanbouw west),
// 125612 (aanbouw oost) en 126245 (aanbouw zuid, hotel); AHN DSM/DTM 0,5 m
// (PDOK WCS) voor de voorranden van de daken (noord v 43,05, zuid -43,05, oost
// u 64,4, west -64,4 m), het dakprofiel (dal tussen de tonnen +17,1 m aan de
// voorrand tot +16,1 m achter, kruin +18,2 tot +17,3 m, spanten om de 10,75 m
// op u = ±5,375 ... ±59,125 en v = ±5,375 ... ±37,625), de dakdiepte (25 m,
// noord 19,5 m), de hoeken (kwartcirkel met straal 25 m om de hoek van de
// veldopening, tent tot +23 m), de lichtmasten (lampenkop op circa (±67,6,
// ±46,2) tot +43,0 m, giek tot de pijler op 25,5 m langs de diagonaal op
// +10 m), de aanbouwen (west +14,0, +17,55 en +21,0 m met het gewelf tot +24,0
// m; oost +14,0 en +17,55 m, hellingbanen van +4,2 m naar het maaiveld,
// winkelgebouw +21,0 m met middendeel +24,2 m; zuid +17,45 m met het hotel op
// +21,9 m; noord +14,85 m met het middendeel op +18,1 m) en de gracht van
// 2 m langs het veld (1,2 m onder het veld); de PDOK luchtfoto (8 cm) voor de
// membraantonnen, de spanten, de tenten en de giek; Wikimedia Commons-foto's
// ("Parkstad Limburg Stadion, augustus 2016", "Parkstad Limburg Stadion
// Kerkrade 19-02-2020", "Kerkrade, Parkstad Limburg stadion van Roda JC IMG
// 2091", "Voetbalstadion Kerkrade", "Parkstad Limbug Stadion - panoramio",
// "Parkstad Limburg Stadion.JPG", "Roda JC - panoramio" en de vijf foto's
// "Nieuwbouw Parkstad Limburg Stadion - panoramio" uit 1999-2000) voor de
// zitrang onder het dak, de tonnen, de giek met de lampenkop, de westgevel met
// het gewelf en het hotel; Wikipedia (19.979 plaatsen, lichtmasten 45 m).
// Geschat: de treden van de zitrang (12 treden van +1,2 tot +11,4 m boven het
// veld, bij de hoofdtribune 9 treden tot +9,2 m), de dikte van de dakplaat
// (1,8 m) en van de tentdoeken (2,0 m), de doorsnede van de giek (3,0 m) en van
// de lampenkop (6,4 × 5,0 × 1,6 m), de pijler onder de giek, de raamnissen en
// de hoogte van de entreeluifel. Weggelaten: de stoelen, trappen en hekken op
// de rang, de dugouts, de reclameborden, de lichtletters PARKSTAD LIMBURG op
// het dak van de westgevel (dun), de staalkabels van de tenten, de vakwerkstaven
// zelf (spanten en giek zijn gesloten balken), de kolommen en de trappen in de
// hoeken achter de rang (achter de aanbouwen en te fijn).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "parkstad-limburg-stadion");
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
const box = (x0, x1, y0, y1, z0, z1) =>
  Manifold.cube([Math.abs(x1 - x0), Math.abs(y1 - y0), z1 - z0]).translate([Math.min(x0, x1), Math.min(y0, y1), z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const hull = (pts) => Manifold.hull(pts);
// Kegel: alles onder een kegelvlak met top `apex` ([x, y, z]) en helling `slope` (m daling per m).
const underCone = ([x, y, z], slope) => {
  const h = z - (BASE - 1);
  return Manifold.cylinder(h, h / slope, 0, 96).translate([x, y, BASE - 1]);
};

const SLUG = "parkstad-limburg-stadion";

// ---------- maten ----------
const ORIGIN = [198561.67, 318762.52];
const X_AXIS = [0.886204, 0.463296]; // RD-richting 27,6 graden, langs het veld
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de bemonsteringspunten; z = 0 in het model.
const GROUND_HEIGHT = 216.29;
// Het veld ligt op PDOK 218,20 m, dus 1,91 m boven z = 0; P(h) zet een AHN-hoogte boven het veld om.
const PITCH = 1.91;
const P = (h) => PITCH + h;
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het laagste maaiveld.
const BASE = -0.5;
// Overlap tussen aangrenzende stukken (rakende vlakken laten spleten achter).
const OVERLAP = 0.02;

// Voorrand van de daken (= voorkant van de zitrang): halve lengte en breedte van de veldopening.
const HU = 64.4;
const HV = 43.05;
// Spanten om de 10,75 m, met een vak midden op elke zijde: lange zijden ±5,375 ... ±59,125, korte ±5,375 ... ±37,625.
const BAY = 10.75;
const trussLines = (count) => Array.from({ length: 2 * count }, (_, k) => (k - count + 0.5) * BAY);
const TRUSS = { long: trussLines(6), short: trussLines(4) };
// Dak boven het veld (AHN): het dal tussen twee tonnen en de kruin, aflopend naar achteren.
const VALLEY = (n) => 17.1 - 0.04 * n;
const CROWN = (n) => 18.2 - 0.036 * n;
const PLATE = 1.8; // dikte van de dakplaat onder het dal
const ARCH_SEGMENTS = 8;
// Dakdiepte vanaf de voorrand: 25 m, bij de hoofdtribune (noord) 19,5 m; de hoeken zijn kwartcirkels met straal 25 m.
const DEPTH = 25;
const DEPTH_MAIN = 19.5;
const CORNER_R = 25;
// Zitrang: treden van de voorrand tot de achterwand (hoogtes boven het veld).
const RAKE = { front: 1.2, steps: 12, end: 22, top: 11.4 };
const RAKE_MAIN = { front: 1.2, steps: 9, end: 16.5, top: 9.2 };
// Vakwerkligger langs de voorrand en de spanten op de vaklijnen.
const FRONT_TRUSS = { n: [-0.8, 0.6], bottom: 14.6 };
const RIB = { width: 1.2, above: 0.6, front: -1.6, back: 0.6 };
// De tent in elke hoek: kegel met de top 8,5 m (langs beide assen) buiten de hoek van de veldopening.
// Het doek is hol: een steile top (+27,0 m, helling 1:1) op een flauwe kegel (+23,3 m, helling 0,33), zoals het
// AHN op 4,5 tot 15 m van de as toont (+22 tot +18,4 m); de top hangt aan de giek.
const TENT = { offset: 8.5, top: 23.3, slope: 0.33, peak: 27.0, peakSlope: 1.0, thickness: 2.0, flat: 16.75 };
// Lichtmast per hoek, langs de diagonaal vanaf de hoek van de veldopening (s in meters langs de diagonaal).
const MAST = {
  head: { s: 3.3, top: 43.0, height: 5.0, width: 6.4, depth: 1.6, tilt: 25 },
  boom: { s0: 25.5, h0: 10.0, s1: 6.6, h1: 38.2, width0: 3.6, width1: 2.8, panels: 10, member: 0.9 },
  pylon: { s: 25.5, half: 1.3, top: 10.6 },
};

// Aanbouwen (u, v in meters, hoogtes boven het veld).
const WEST = {
  u: [-99.6, -88.9],
  blocks: [
    { v: [-46.5, -28], h: 14.0 },
    { v: [28, 46.5], h: 14.0 },
    { v: [-28, -17.5], h: 17.55 },
    { v: [17.5, 28], h: 17.55 },
    { v: [-17.5, 17.5], h: 21.0 },
  ],
  vault: { u: [-99.6, -91.5], half: 9.5, spring: 21.0, crown: 24.0 },
};
const EAST = {
  low: { u: [88.9, 105.6], v: [-44, 41.5], h: 14.0 },
  lowMid: { v: [-17, 15.5], h: 17.55 },
  // Hellingbanen langs de kopse kanten: [v, hoogte boven het veld] uit het AHN (de noordelijke zit ook in het
  // PDOK-terrein; het profiel ligt 0,2 m hoger zodat het terrein er niet doorheen steekt).
  ramps: [
    { u: [92, 104.5], profile: [[41.4, 4.2], [45.0, 4.2], [47.0, 2.7], [49.0, 1.75], [51.0, 0.65], [53.6, -1.2]] },
    { u: [92, 104.5], profile: [[-43.9, 4.1], [-45.0, 4.1], [-47.0, 3.0], [-49.0, 1.75], [-51.0, 1.0], [-53.0, -0.4], [-54.6, -1.25]] },
  ],
  shop: { u: [105.5, 117.6], v: [-50.5, 48], h: 21.0 },
  shopMid: { u: [105.5, 116.0], v: [-4, 3.5], h: 24.2 },
  entrance: { u: [115.8, 118.2], v: [-7, 4.5], h: 11.0 },
  porch: { u: [117.5, 121], v: [-3.5, 1.5], h: 1.6 },
  plant: [
    { u: [110.8, 113.6], v: [42.8, 47], h: 22.7 },
    { u: [111.8, 114.2], v: [-41, -37], h: 22.5 },
  ],
};
const SOUTH = {
  wing: { u: [-67, 71.5], v: [-84.8, -68], h: 17.45 },
  hotel: { u: [-29, 35.5], v: [-84.5, -70.5], h: 21.9 },
  core: { u: [35.5, 41], v: [-81, -71], h: 20.6 },
  plant: [{ u: [43, 47.5], v: [-81, -73], h: 19.7 }],
};
const NORTH = {
  block: { u: [-61.5, 61.5], v: [62.3, 70.0], h: 14.85 },
  lantern: { u: [-49, -39], v: [63.2, 69.2], h: 15.8 },
  centre: { u: [-26.5, 26.5], v: [62.3, 73.5], bow: 75.8, h: 18.1, rim: 19.2 },
};
// Maaiveld op de straten en parkeerterreinen rond het stadion (12 tot 18 m buiten de gevels).
const GROUND_SAMPLES = [
  [-114, 30],
  [-114, -30],
  [130, 35],
  [130, -35],
  [45, 88],
  [-45, 88],
  [50, -98],
  [-50, -98],
];
// Naar beneden gerichte vlakken boven deze hoogte zijn bedoelde uitkragingen
// (dakplaten, tenten, spanten, giek, lampenkoppen); daaronder blijft elk ondervlak steiler dan 45 graden.
const OVERHANG_MIN_Z = P(8.0);

// ---------- tribunes (zijde in een eigen stelsel: langs x, de diepte n naar +y vanaf de voorrand op y = front) ----------
// Elke zijde wordt gebouwd als noordzijde (voorrand y = front, x van x0 tot x1) en daarna om de oorsprong gedraaid.
const under = (n) => VALLEY(n) - PLATE;
const standSection = (rake, depth) => {
  const parts = [];
  const dn = rake.end / rake.steps;
  for (let j = 0; j < rake.steps; j++) {
    const z = rake.front + ((rake.top - rake.front) * j) / (rake.steps - 1);
    parts.push([[j * dn - (j ? OVERLAP : 0), BASE], [(j + 1) * dn + OVERLAP, BASE], [(j + 1) * dn + OVERLAP, P(z)], [j * dn - (j ? OVERLAP : 0), P(z)]]);
  }
  // Achterwand tot in de dakplaat.
  parts.push([[rake.end, BASE], [depth, BASE], [depth, P(under(depth)) + 0.3], [rake.end, P(under(rake.end)) + 0.3]]);
  return parts;
};
// Een rechte tribune: zitrang en achterwand van x0 tot x1, met de donkere band in de achterwand.
const straightStand = (front, x0, x1, rake, depth, band) => {
  const solid = Manifold.union(standSection(rake, depth).map((pts) => profileX(pts.map(([n, z]) => [front + n, z]), x0, x1)));
  const cut = box(x0 + 0.5, x1 - 0.5, front + rake.end - 0.05, front + rake.end + band.depth, P(band.z[0]), P(band.z[1]));
  return solid.subtract(cut);
};
// De dakplaat van een zijde: per vak een ton (dwarsdoorsnede: vlakke onderkant, boog op de kruin), plus
// de ligger langs de voorrand en de spanten.
const archSection = (a0, a1, n) => {
  const pts = [[a0, P(under(n))], [a1, P(under(n))]];
  for (let k = 0; k <= ARCH_SEGMENTS; k++) {
    const t = k / ARCH_SEGMENTS;
    const a = a1 + (a0 - a1) * t;
    const x = (2 * t - 1) ** 2;
    pts.push([a, P(VALLEY(n) + (CROWN(n) - VALLEY(n)) * (1 - x))]);
  }
  return pts;
};
const sideRoof = (front, lines, depth) => {
  const parts = [];
  const n0 = -0.3;
  for (let i = 0; i + 1 < lines.length; i++) {
    const a0 = lines[i] - OVERLAP;
    const a1 = lines[i + 1] + OVERLAP;
    const pts = [];
    for (const n of [n0, depth]) for (const [a, z] of archSection(a0, a1, n)) pts.push([a, front + n, z]);
    parts.push(hull(pts));
  }
  const xa = lines[0];
  const xb = lines[lines.length - 1];
  // Vakwerkligger langs de voorrand (2,5 m hoog).
  parts.push(
    hull([
      ...[xa, xb].flatMap((x) => [
        [x, front + FRONT_TRUSS.n[0], P(FRONT_TRUSS.bottom)],
        [x, front + FRONT_TRUSS.n[1], P(FRONT_TRUSS.bottom)],
        [x, front + FRONT_TRUSS.n[0], P(VALLEY(0) + 0.2)],
        [x, front + FRONT_TRUSS.n[1], P(VALLEY(0) + 0.2)],
      ]),
    ]),
  );
  // Spanten op de vaklijnen: ribben van 1,2 m breed, 0,6 m boven het dal, aan de veldkant 1,6 m uitstekend.
  for (const a of lines) {
    const w = RIB.width / 2;
    const ns = [RIB.front, depth + RIB.back];
    parts.push(
      hull(
        ns.flatMap((n) => [
          [a - w, front + n, P(under(Math.max(n, 0)) + 0.6)],
          [a + w, front + n, P(under(Math.max(n, 0)) + 0.6)],
          [a - w, front + n, P(VALLEY(Math.max(n, 0)) + RIB.above)],
          [a + w, front + n, P(VALLEY(Math.max(n, 0)) + RIB.above)],
        ]),
      ),
    );
  }
  return Manifold.union(parts);
};

const BAND = { depth: 0.5, z: [RAKE.top + 0.6, 13.7] };
const BAND_MAIN = { depth: 0.5, z: [RAKE_MAIN.top + 0.6, 13.9] };
// Noord (rotatie 0): het midden met de dakdiepte van de hoofdtribune, de uiteinden tot de hoeken met 25 m.
const north = Manifold.union([
  straightStand(HV, TRUSS.long[0], TRUSS.long.at(-1), RAKE_MAIN, DEPTH_MAIN, BAND_MAIN),
  straightStand(HV, -HU - OVERLAP, TRUSS.long[0] + OVERLAP, RAKE, DEPTH, BAND),
  straightStand(HV, TRUSS.long.at(-1) - OVERLAP, HU + OVERLAP, RAKE, DEPTH, BAND),
  sideRoof(HV, TRUSS.long, DEPTH_MAIN),
]);
// Zuid: als noord, 180 graden gedraaid.
const south = Manifold.union([straightStand(HV, -HU - OVERLAP, HU + OVERLAP, RAKE, DEPTH, BAND), sideRoof(HV, TRUSS.long, DEPTH)]).rotate([0, 0, 180]);
// West en oost: de korte zijden (voorrand op 64,4 m), 90 en 270 graden gedraaid.
const shortSide = Manifold.union([straightStand(HU, -HV - OVERLAP, HV + OVERLAP, RAKE, DEPTH, BAND), sideRoof(HU, TRUSS.short, DEPTH)]);
const west = shortSide.rotate([0, 0, 90]);
const east = shortSide.rotate([0, 0, 270]);

// ---------- de hoeken: zitrang die meedraait, achterwand en tent ----------
const corners = [];
const tents = [];
for (const [su, sv] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  const c = [su * HU, sv * HV];
  const angle = su > 0 ? (sv > 0 ? 0 : 270) : sv > 0 ? 90 : 180;
  // Zitrang en achterwand: dezelfde doorsnede als de korte zijden, 90 graden om de hoek gedraaid.
  const section = standSection(RAKE, CORNER_R).map((pts) => Manifold.revolve(new CrossSection([ccw(pts.map(([n, z]) => [Math.max(n, 0), z]))]), 48, 90));
  let stand = Manifold.union(section).rotate([0, 0, angle]).translate([c[0], c[1], 0]);
  const apex = [c[0] + su * TENT.offset, c[1] + sv * TENT.offset, P(TENT.top)];
  // De achterwand reikt tot onder de tent (of tot de vlakke rand van de tent).
  const wallLimit = Manifold.union([underCone([apex[0], apex[1], apex[2] - TENT.thickness + 0.3], TENT.slope), box(c[0] - 40, c[0] + 40, c[1] - 40, c[1] + 40, BASE - 1, P(TENT.flat - PLATE) + 0.3)]);
  stand = stand.intersect(wallLimit);
  // Donkere band boven de bovenste trede.
  const bandRing = Manifold.revolve(new CrossSection([ccw([[RAKE.end - 0.05, P(BAND.z[0])], [RAKE.end + BAND.depth, P(BAND.z[0])], [RAKE.end + BAND.depth, P(BAND.z[1])], [RAKE.end - 0.05, P(BAND.z[1])]])]), 48, 80)
    .rotate([0, 0, angle + 5])
    .translate([c[0], c[1], 0]);
  corners.push(stand.subtract(bandRing));
  // Tent: het gebied van de hoek (kwartcirkel) plus de stroken tussen het laatste spant en de hoek.
  const lastLong = TRUSS.long.at(-1);
  const lastShort = TRUSS.short.at(-1);
  const quarter = [[0, 0]];
  for (let k = 0; k <= 24; k++) {
    const a = (Math.PI / 2) * (k / 24);
    quarter.push([CORNER_R * Math.cos(a), CORNER_R * Math.sin(a)]);
  }
  const regionPts = [
    quarter.map(([x, y]) => [c[0] + su * x, c[1] + sv * y]),
    // Strook langs de lange zijde (noord/zuid) tussen het laatste spant en de hoek.
    [[su * lastLong, c[1] - sv * 0.3], [c[0], c[1] - sv * 0.3], [c[0], c[1] + sv * CORNER_R], [su * lastLong, c[1] + sv * CORNER_R]],
    // Strook langs de korte zijde (oost/west).
    [[c[0] - su * 0.3, sv * lastShort], [c[0] + su * CORNER_R, sv * lastShort], [c[0] + su * CORNER_R, c[1]], [c[0] - su * 0.3, c[1]]],
  ];
  const region = Manifold.union(regionPts.map((pts) => prism(pts, BASE, P(40))));
  const peak = [apex[0], apex[1], P(TENT.peak)];
  const tentTop = (dz) =>
    Manifold.union([underCone([apex[0], apex[1], apex[2] - dz], TENT.slope), underCone([peak[0], peak[1], peak[2] - dz], TENT.peakSlope)]);
  const cone = region.intersect(tentTop(0)).subtract(tentTop(TENT.thickness));
  // Hanger van de top van het doek naar de giek erboven (de giek loopt hier op circa +29,5 m boven het veld).
  const { boom } = MAST;
  const sApex = Math.SQRT2 * TENT.offset;
  const boomBottom = P(boom.h0) - 0.6 + ((P(boom.h1) - P(boom.h0)) * (boom.s0 - sApex)) / (boom.s0 - boom.s1);
  tents.push(Manifold.cylinder(boomBottom + 0.4 - (peak[2] - 0.6), 0.7, 0.7, 16).translate([peak[0], peak[1], peak[2] - 0.6]));
  // De vlakke rand van de tent op de hoogte van het dal van de tonnen.
  const flat = region.intersect(box(c[0] - 40, c[0] + 40, c[1] - 40, c[1] + 40, P(TENT.flat - PLATE), P(TENT.flat)));
  tents.push(Manifold.union([cone, flat]));
}

// ---------- lichtmasten ----------
const masts = [];
for (const [su, sv] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  // Stelsel langs de diagonaal: s naar buiten, w dwars, z omhoog; daarna gedraaid naar de hoek.
  const facing = (Math.atan2(sv, su) * 180) / Math.PI;
  const parts = [];
  const { head, boom, pylon } = MAST;
  // Pijler op de buitenhoek onder de voet van de giek.
  parts.push(box(pylon.s - pylon.half, pylon.s + pylon.half, -pylon.half, pylon.half, BASE, P(pylon.top)));
  // Giek: driehoekige vakwerkbalk van de pijler schuin omhoog naar binnen: drie randstaven van 0,9 m en per vlak
  // een zigzag van diagonalen over tien vakken, plus een dwarsligger waar de top van het doek aan hangt.
  const tri = (s, h, w) => [[s, -w / 2, P(h) - 0.6], [s, w / 2, P(h) - 0.6], [s - 0.4, 0, P(h) + (w * Math.sqrt(3)) / 2 - 0.6]];
  const chordAt = (k, t) => {
    const s = boom.s0 + (boom.s1 - boom.s0) * t;
    const h = boom.h0 + (boom.h1 - boom.h0) * t;
    const w = boom.width0 + (boom.width1 - boom.width0) * t;
    return tri(s, h, w)[k].map((c, i) => (i === 2 ? c + (k < 2 ? boom.member / 2 : -boom.member / 2) : i === 1 && k < 2 ? c - Math.sign(c) * (boom.member / 2) : c));
  };
  const node = ([x, y, z]) => {
    const m = boom.member / 2;
    return [[-m, -m, -m], [m, -m, -m], [m, m, -m], [-m, m, -m], [-m, -m, m], [m, -m, m], [m, m, m], [-m, m, m]].map(([a, b, c]) => [x + a, y + b, z + c]);
  };
  const member = (p, q) => hull([...node(p), ...node(q)]);
  for (let k = 0; k < 3; k++) parts.push(member(chordAt(k, 0), chordAt(k, 1)));
  for (const [a, b] of [[0, 1], [1, 2], [2, 0]]) {
    for (let i = 0; i < boom.panels; i++) {
      const [p, q] = i % 2 ? [b, a] : [a, b];
      parts.push(member(chordAt(p, i / boom.panels), chordAt(q, (i + 1) / boom.panels)));
    }
  }
  {
    const tA = (boom.s0 - Math.SQRT2 * TENT.offset) / (boom.s0 - boom.s1);
    parts.push(member(chordAt(0, tA), chordAt(1, tA)));
  }
  // Lampenkop: een plaat van 6,4 bij 5,0 m die schuin naar het veld kijkt, met de achterkant op de giek.
  const t = (head.tilt * Math.PI) / 180;
  const zTop = P(head.top);
  const zBot = zTop - head.height * Math.cos(t);
  const sTop = head.s + 0.5 * head.height * Math.sin(t);
  const sBot = head.s - 0.5 * head.height * Math.sin(t);
  const w = head.width / 2;
  parts.push(
    hull([
      ...[-w, w].flatMap((y) => [
        [sBot, y, zBot],
        [sBot + head.depth, y, zBot],
        [sTop, y, zTop],
        [sTop + head.depth, y, zTop],
      ]),
    ]),
  );
  // Ligger van de kop naar de giek.
  parts.push(hull([...tri(boom.s1, boom.h1, boom.width1), [sBot + head.depth, -1.0, zBot + 0.5], [sBot + head.depth, 1.0, zBot + 0.5], [sTop + head.depth, 0, zTop - 0.8]]));
  const c = [su * HU, sv * HV];
  masts.push(Manifold.union(parts).rotate([0, 0, facing]).translate([c[0], c[1], 0]));
}

// ---------- aanbouwen ----------
const annex = [];
const niches = [];
// Raamnis van 0,4 m diep in een gevel door (cx, cy) met de buitennormaal (ox, oy): de bovenkant loopt
// onder 46 graden schuin naar binnen omlaag, zodat de nis zonder steun print.
const niche = (cx, cy, ox, oy, width, z0, z1) => {
  const pts = [];
  for (const off of [0.6, -0.4]) {
    const top = off > 0 ? z1 + 0.6 : z1 - 0.45;
    for (const l of [-width / 2, width / 2]) {
      for (const z of [z0, top]) pts.push([cx + ox * off - oy * l, cy + oy * off + ox * l, z]);
    }
  }
  return hull(pts);
};
// Rijen raamnissen in een gevel evenwijdig aan Y (x = gevel) of aan X (y = gevel); `into` is de richting naar binnen.
const nicheRowsY = (x, into, v0, v1, pitch, width, rows) => {
  for (let v = v0 + pitch / 2; v <= v1 - pitch / 2 + 1e-6; v += pitch) {
    for (const [z0, z1] of rows) niches.push(niche(x, v, -into, 0, width, z0, z1));
  }
};
const nicheRowsX = (y, into, u0, u1, pitch, width, rows) => {
  for (let u = u0 + pitch / 2; u <= u1 - pitch / 2 + 1e-6; u += pitch) {
    for (const [z0, z1] of rows) niches.push(niche(u, y, 0, -into, width, z0, z1));
  }
};
// Verdiepingen op de westgevel (straat op circa z = 0,3 m): raamhoogtes per verdieping.
const storeys = (top) => [[1.4, 4.0], [5.2, 7.8], [9.0, 11.6], [12.8, 15.4], [16.6, 19.2], [20.4, 23.0]].filter(([, z1]) => z1 < top - 0.9);
// West: bakstenen gevel met hoog middendeel en glazen gewelf.
for (const { v, h } of WEST.blocks) {
  annex.push(box(WEST.u[0], WEST.u[1], v[0] - OVERLAP, v[1] + OVERLAP, BASE, P(h)));
  const vv = [v[0] + 0.8, v[1] - 0.8];
  const vault = Math.abs(v[0]) < 18 && Math.abs(v[1]) < 18;
  if (vault) {
    // Middendeel: de glazen gevel onder het gewelf (v ±9,5 m) is een diepe nis van boven de entree tot de dakrand.
    nicheRowsY(WEST.u[0], 1, -17.5, -9.5, 4.0, 2.4, storeys(P(h)));
    nicheRowsY(WEST.u[0], 1, 9.5, 17.5, 4.0, 2.4, storeys(P(h)));
  } else {
    nicheRowsY(WEST.u[0], 1, vv[0], vv[1], 4.0, 2.4, storeys(P(h)));
  }
}
{
  const { u, half, spring, crown } = WEST.vault;
  const rise = crown - spring;
  const pts = [[-half, P(spring) - 0.1]];
  for (let k = 0; k <= 12; k++) {
    const a = -half + (2 * half * k) / 12;
    pts.push([a, P(spring) + rise * (1 - (a / half) ** 2)]);
  }
  annex.push(profileX(pts.map(([v, z]) => [v, z]), u[0], u[1]));
  // Glazen pui onder het gewelf: een nis van 0,4 m van +1,5 m tot onder de dakrand.
  niches.push(box(WEST.u[0] - 0.6, WEST.u[0] + 0.4, -half + 1.2, half - 1.2, P(-1.5) + 3.6, P(spring) - 0.6));
}
// Oost: lage strook met hellingbanen en het winkelgebouw.
annex.push(box(EAST.low.u[0], EAST.low.u[1], EAST.low.v[0], EAST.low.v[1], BASE, P(EAST.low.h)));
annex.push(box(EAST.low.u[0], EAST.low.u[1], EAST.lowMid.v[0], EAST.lowMid.v[1], BASE, P(EAST.lowMid.h)));
for (const r of EAST.ramps) {
  const pts = [[r.profile[0][0], BASE], ...r.profile.map(([v, h]) => [v, P(h)]), [r.profile.at(-1)[0], BASE]];
  annex.push(profileX(pts, r.u[0], r.u[1]));
}
{
  const s = EAST.shop;
  annex.push(box(s.u[0], s.u[1], s.v[0], s.v[1], BASE, P(s.h)));
  annex.push(box(EAST.shopMid.u[0], EAST.shopMid.u[1], EAST.shopMid.v[0], EAST.shopMid.v[1], BASE, P(EAST.shopMid.h)));
  annex.push(box(EAST.porch.u[0], EAST.porch.u[1], EAST.porch.v[0], EAST.porch.v[1], BASE, P(EAST.porch.h)));
  for (const p of EAST.plant) annex.push(box(p.u[0], p.u[1], p.v[0], p.v[1], P(s.h) - OVERLAP, P(p.h)));
  // Raamstroken in de oostgevel van het winkelgebouw (bovenverdiepingen).
  nicheRowsY(s.u[1], -1, s.v[0] + 1, EAST.entrance.v[0] - 1, 4.5, 3.0, [[P(11.5), P(13.7)], [P(15.2), P(17.4)]]);
  nicheRowsY(s.u[1], -1, EAST.entrance.v[1] + 1, s.v[1] - 1, 4.5, 3.0, [[P(11.5), P(13.7)], [P(15.2), P(17.4)]]);
  // De glazen puien van de lage strook in de noord- en zuidgevel boven de hellingbanen.
  nicheRowsX(EAST.low.v[1], -1, EAST.low.u[0] + 3, EAST.low.u[1] - 1, 3.5, 2.4, [[P(6.0), P(8.2)], [P(9.6), P(11.8)]]);
  nicheRowsX(EAST.low.v[0], 1, EAST.low.u[0] + 3, EAST.low.u[1] - 1, 3.5, 2.4, [[P(6.0), P(8.2)], [P(9.6), P(11.8)]]);
}
const entranceCut = box(EAST.entrance.u[0], EAST.entrance.u[1] + 1, EAST.entrance.v[0], EAST.entrance.v[1], P(EAST.entrance.h), P(30));
// Zuid: de vleugels en het hotel.
{
  const { wing, hotel, core, plant } = SOUTH;
  annex.push(box(wing.u[0], wing.u[1], wing.v[0], wing.v[1], BASE, P(wing.h)));
  annex.push(box(hotel.u[0], hotel.u[1], wing.v[0], hotel.v[1], BASE, P(hotel.h)));
  annex.push(box(core.u[0], core.u[1], core.v[0], core.v[1], P(wing.h) - OVERLAP, P(core.h)));
  for (const p of plant) annex.push(box(p.u[0], p.u[1], p.v[0], p.v[1], P(wing.h) - OVERLAP, P(p.h)));
  // Raamstroken: het hotel in vijf lagen, de vleugels in vier.
  const hotelRows = [[2.0, 4.4], [5.4, 7.8], [8.8, 11.2], [12.2, 14.6], [15.6, 18.0], [19.0, 21.4]].filter(([, z1]) => z1 < P(hotel.h) - 0.9);
  nicheRowsX(wing.v[0], 1, hotel.u[0] + 0.5, hotel.u[1] - 0.5, 3.6, 2.8, hotelRows);
  const wingRows = hotelRows.filter(([, z1]) => z1 < P(wing.h) - 0.9);
  nicheRowsX(wing.v[0], 1, wing.u[0] + 1, hotel.u[0] - 1, 3.6, 2.8, wingRows);
  nicheRowsX(wing.v[0], 1, core.u[0], wing.u[1] - 1, 3.6, 2.8, wingRows);
}
// Noord: strook achter de skyboxen en het middendeel met de gebogen glazen gevel.
{
  const { block, lantern, centre } = NORTH;
  annex.push(box(block.u[0], block.u[1], block.v[0] - 0.5, block.v[1], BASE, P(block.h)));
  annex.push(box(lantern.u[0], lantern.u[1], lantern.v[0], lantern.v[1], P(block.h) - OVERLAP, P(lantern.h)));
  const pts = [[centre.u[0], centre.v[0] - 0.5], [centre.u[1], centre.v[0] - 0.5], [centre.u[1], centre.v[1]]];
  // Boog van (26,5, 73,5) via (0, 75,8) naar (-26,5, 73,5).
  const sag = centre.bow - centre.v[1];
  const R = (centre.u[1] ** 2 + sag ** 2) / (2 * sag);
  const cy = centre.bow - R;
  for (let k = 1; k < 16; k++) {
    const u = centre.u[1] - (2 * centre.u[1] * k) / 16;
    pts.push([u, cy + Math.sqrt(R * R - u * u)]);
  }
  pts.push([centre.u[0], centre.v[1]]);
  annex.push(prism(pts, BASE, P(centre.h)));
  // Dakrand van 0,8 m rond het middendeel.
  const inner = pts.map(([u, v]) => [Math.sign(u) * Math.max(Math.abs(u) - 0.8, 0), v < centre.v[0] ? v + 0.8 : v - 0.8]);
  annex.push(prism(pts, P(centre.h) - OVERLAP, P(centre.rim)).subtract(prism(inner, P(centre.h) - 1, P(centre.rim) + 1)));
  // Glazen banden in de gebogen gevel (drie lagen) en ramen in de noordgevel van de strook.
  const bandRows = [[3.8, 6.4], [7.6, 10.2], [11.4, 14.0], [15.2, 17.8]].filter(([, z1]) => z1 < P(centre.h) - 0.9);
  // Per koorde van de boog een glazen band (nis met schuine bovenkant).
  const arc = pts.slice(2);
  for (let k = 0; k + 1 < arc.length; k++) {
    const [u0, v0] = arc[k];
    const [u1, v1] = arc[k + 1];
    const l = Math.hypot(u1 - u0, v1 - v0);
    const [ox, oy] = [(v1 - v0) / l, -(u1 - u0) / l];
    for (const [z0, z1] of bandRows) niches.push(niche((u0 + u1) / 2, (v0 + v1) / 2, ox, oy, l - 0.9, z0, z1));
  }
  const rows = [[2.2, 4.6], [6.0, 8.4], [9.8, 12.2]].filter(([, z1]) => z1 < P(block.h) - 0.9);
  nicheRowsX(block.v[1], -1, block.u[0] + 1, centre.u[0] - 1, 3.6, 2.4, rows);
  nicheRowsX(block.v[1], -1, centre.u[1] + 1, block.u[1] - 1, 3.6, 2.4, rows);
}

// ---------- samenvoegen ----------
const OVERHANG_OK = (z) => z >= OVERHANG_MIN_Z;
const body = Manifold.union([north, south, west, east, ...corners, ...tents, ...masts, ...annex]);
// Waar de giek rakelings over het doek loopt blijven splinters zonder volume over; die vallen weg.
const stadium = Manifold.compose(
  body
    .subtract(Manifold.union([...niches, entranceCut]))
    .decompose()
    .filter((piece) => piece.volume() > 1),
);
// BAG-panden: het stadion, de aanbouwen west en oost en de aanbouw zuid met het hotel.
const REPLACED_BUILDINGS = ["0928100000125190", "0928100000125458", "0928100000125612", "0928100000126245"];
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "Parkstad Limburg Stadion",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: REPLACED_BUILDINGS,
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (198561,67, 318762,52) in het hart van de veldopening, op het laagste maaiveld rond het stadion (groundHeight 216,29 m ellipsoïdisch, circa NAP +170,4 m; het veld ligt 1,91 m hoger), +X langs het veld naar het oostnoordoosten (27,6 graden) en +Y naar het noordnoordwesten (hoofdtribune). Eén node building:stadion: vier tribunes rond de veldopening (128,8 bij 86,1 m), elk met een zitrang in treden die onder het dak open blijft, een achterwand met donkere band en een dakplaat van 1,8 m met witte membraantonnen per vak van 10,75 m tussen radiale spanten en een vakwerkligger langs de voorrand (+19 tot +20 m); vier gesloten hoeken met een kegelvormige tent (+24,9 m) boven een meedraaiende zitrang; vier lichtmasten met een schuine vakwerkgiek vanaf een pijler op de buitenhoek en een lampenkop boven de hoek van het veld (+44,9 m); de aanbouwen: west de bakstenen gevel tot +22,9 m met glazen gewelf (+25,9 m), oost de lage strook met twee hellingbanen en het winkelgebouw (+22,9 m, middendeel +26,1 m) met entree, zuid de vleugels (+19,4 m) en het hotel (+23,8 m), noord de strook achter de skyboxen (+16,8 m) met het gebogen middendeel (+20,0 m); raamnissen in de gevels. Onderkant op 0,5 m onder het maaiveld; de dakplaten, tenten, giek en lampenkoppen hangen uit (de export vult ze op). Het maaiveld wordt op acht punten rond het stadion bemonsterd; groundHeight is de laagste PDOK-terreinhoogte daar (ellipsoïdisch). Vervangt de PDOK-reconstructie van de vier BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 19979,
    fieldOpeningM: [2 * HU, 2 * HV],
    pitchM: PITCH,
    roofFrontM: [+P(VALLEY(0)).toFixed(2), +P(CROWN(0)).toFixed(2)],
    roofDepthM: [DEPTH, DEPTH_MAIN],
    tentTopM: P(TENT.top),
    mastTopM: P(MAST.head.top),
    westFacadeM: [P(21.0), P(WEST.vault.crown)],
    eastShopM: [P(EAST.shop.h), P(EAST.shopMid.h)],
    hotelM: P(SOUTH.hotel.h),
    northCentreM: P(NORTH.centre.h),
    groundHeightEllipsoidM: GROUND_HEIGHT,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Parkstad_Limburg_Stadion",
    "PDOK BAG panden van het stadion en de drie aanbouwen (zie replacesBuildings), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: voorranden en dakprofiel, membraantonnen en spanten, hoeken en tenten, lichtmasten, aanbouwen, gracht en maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR): membraantonnen, spanten, tenten en giek",
    "Wikimedia Commons: Parkstad Limburg Stadion, augustus 2016; Parkstad Limburg Stadion Kerkrade 19-02-2020; Kerkrade, Parkstad Limburg stadion van Roda JC IMG 2091; Voetbalstadion Kerkrade; Parkstad Limbug Stadion - panoramio; Parkstad Limburg Stadion.JPG; Roda JC - panoramio; Nieuwbouw Parkstad Limburg Stadion - panoramio (vijf foto's, 1999-2000)",
  ],
};

// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak onder OVERHANG_MIN_Z mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    // Splinters onder 0,01 m2 (naden tussen de gedraaide hoeken en de rechte zijden) tellen niet mee.
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-2) {
      const z = Math.min(p[0][2], p[1][2], p[2][2]);
      if (OVERHANG_OK(z, p)) continue;
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

// Losse delen van het model (genus onder 0 betekent meer dan één stuk).
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
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
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
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
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

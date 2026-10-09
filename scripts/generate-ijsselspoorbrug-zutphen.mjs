// Genereert een vereenvoudigd, gesloten 3D-model van de IJsselspoorbrug bij
// Zutphen: de dubbelsporige spoorbrug van de lijn Arnhem - Zutphen over de
// IJssel tussen De Hoven (west) en Zutphen (oost), direct ten noorden van de
// Oude IJsselbrug (eigen catalogusmodel, oude-ijsselbrug-zutphen). Van west naar
// oost: de betonnen aanbrug over de uiterwaard (1980, zes velden van 32,9 m op
// wandpijlers), een stalen veld met plaatliggers tot de hefbrugpijler, de
// hefbrug met twee heftorens (zijramen, een contragewicht als dwarsbalk tussen
// de toppen en langsliggers tussen de torens), de stalen vakwerkbrug met
// gebogen bovenrand van 87 m over het zomerbed (Warren-vakwerk met stijlen op de
// bovenknopen en een kruis in het middelste vak, windverband tussen de
// bovenranden) en het korte betonnen veld naar het landhoofd in Zutphen. Alle
// maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, de materiaalklasse in de nodenaam: de constructie als building, de
// bovenste 0,5 m van het dek binnen de BGT-spoorbaanvlakken als road:spoor met
// de BGT-attributen) als catalogusbron voor de export en de kaart, plus een
// binaire STL in millimeters op 1:<schaal> met de brug als geheel en een
// printvoet onder het dek.
//
//   node scripts/generate-ijsselspoorbrug-zutphen.mjs              # STL op 1:1000 (standaard)
//   node scripts/generate-ijsselspoorbrug-zutphen.mjs --scale 1250
//
// Bouwstelsel: hetzelfde als dat van de Oude IJsselbrug (generate-oude-
// ijsselbrug-zutphen.mjs), zodat beide modellen dezelfde s en t delen: s langs
// de brug vanaf RD (209598,74, 461884,40) naar het oosten (RD-richting 21,32
// graden vanaf het oosten), t dwars erop naar het noordnoordwesten; z = NAP-
// hoogte min de waterspiegel van de IJssel zoals het PDOK-terrein die legt
// (48,09 m ellipsoïdisch, circa NAP +5,2 m). De verkeersbrug houdt op bij
// t = 12,3; dit model begint bij t = 12,32 (pijlers) en t = 12,5 (dek), zodat de
// twee modellen elkaar nergens raken. Aan het eind schuift alles naar de
// oorsprong midden tussen de twee vakwerkliggers onder de top van de bovenrand
// (s = 282,35, t = 17,68; RD 209855,34, 462003,53): +X langs de brug naar
// Zutphen, +Y naar het noordnoordwesten.
//
// Bronnen: BGT overbruggingsdeel (de dekken L0004.a9fc9ded (aanbrug en stalen
// veld, s = 0,1 tot 220,7), L0004.9e5667d5 (beweegbaar dek, s = 220,5 tot
// 236,7) en L0004.749113f2 (vakwerkbrug en oostelijk veld tot s = 339,9); de
// pijlers L0002.48e22921 op s = 197,5, de hefbrugpijlers L0002.522c1395 en
// L0002.467348cf en de boogpijler L0002.708639e0, alle drie met een ronde kop
// aan de noordkant, gedeeld met de verkeersbrug), BGT wegdeel (de drie
// spoorbaanvlakken op het dek, zie onder), AHN DSM 0,5 m (PDOK WCS) voor het
// lengteprofiel van het spoor (NAP +11,96 m aan de westkant, +12,32 m midden op
// de vakwerkbrug, +11,92 m aan de oostkant), de noordrand van het dek (t = 23,1
// over de aanbrug, 24,6 bij het stalen veld, 25,0 over de vakwerkbrug), de
// vakwerklijnen (t = 13,05 en 22,3) met hun bovenrand (parabool met de top op
// NAP +25,0 m bij s = 282,3, aan de einden van de bovenrand +20,1 en +19,8 m),
// de eindstijlen (opleggingen op s = 238,8 en 325,8), de plaatliggers van het
// stalen veld en de hefbrug (NAP +13,4 m), de heftorens (s = 215,6 tot 219,8 en
// 236,4 tot 239,8, tot NAP +22,4 en +22,7 m, ertussen +21,2 en +21,0 m) en de
// langsliggers tussen de torens (NAP +19,55 zuid en +19,2 m noord); PDOK-
// luchtfoto voor de dwarsregels van het windverband (om de 5,97 m, dus 13 vakken
// tussen s = 243,5 en 321,1), de voegen van de aanbrug om de 65,7 m (s = 65,8,
// 131,4 en 197: twee velden per voeg, dus pijlers op s = 32,92 k) en de overgang
// naar het stalen veld; PDOK-terrein voor de waterspiegel; Wikipedia (westelijke
// aanbrug met zeven velden over circa 218 m, hefbrug, vakwerkbrug met gebogen
// bovenrand van circa 89 m, oostelijke aanbrug van circa 12 m, 348 m lang);
// Wikimedia Commons-foto's (Zutphen brug VIRMm 8676 (51090754448).jpg, Zutphen
// de Hoven brug VIRM 8642 naar Roosendaal (14208095504).jpg, Zutphen IRM duo op
// de brug lente (14384272235).jpg, Zutphen Arriva 367 Guus Hiddink op de brug
// (14384272795).jpg, Zutphen omgeleide ICE 123 naar Frankfurt Main gereden door
// stel 4654 (24161262772).jpg, Zutphen Arriva Spurt 369 Apeldoorn
// (10375891664).jpg, Zutphen ICMm 4087-4219 r.Arnhem 4040-4213 r.Zwolle
// (10375887414).jpg, Zutphen ijsselbruecke.jpg, Enormous quantities of water
// passing through the IJselriver at the colourfull bridges of Zutphen -
// panoramio.jpg) voor het vakwerkpatroon, de heftorens, de aanbrugpijlers en het
// dek.
// Geschat: de constructiehoogtes (aanbrug 1,9 m, stalen veld 2,5 m, hefbrug
// 2,0 m, vakwerkbrug 2,3 m onder het spoor), de staafbreedte (0,9 m) en de dikte
// van de vakwerkplaten (1,0 m) en de bovenrand (1,0 m), de pijlerkoppen, de
// zijramen van de torenpoten, de maten van het contragewicht, de langsliggers
// (1,0 m) en de schampkanten op de aanbrug; de vijf aanbrugpijlers liggen onder
// het dek en staan niet in de BGT (alleen de pijler op s = 197,5).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "ijsselspoorbrug-zutphen");
const mmPerMetre = 1000 / scale;
const SLUG = "ijsselspoorbrug-zutphen";

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts.filter(Boolean));
const rad = (deg) => (deg * Math.PI) / 180;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
const polyArea = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area / 2;
};
const ccw = (pts) => (polyArea(pts) > 0 ? pts : [...pts].reverse());
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
// Plattegrond (s, t) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Polygoon in het sz-vlak, uitgetrokken langs t van t0 tot t1.
const profileT = (points, t0, t1) =>
  Manifold.extrude(new CrossSection([ccw(points)]), t1 - t0)
    .rotate([90, 0, 0])
    .translate([0, t1, 0]);
// Band tussen twee functies van s (onder en boven), uitgetrokken langs t.
function bandT(s0, s1, bottom, top, t0, t1, step = 1) {
  const n = Math.max(1, Math.round((s1 - s0) / step));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const s = s0 + ((s1 - s0) * i) / n;
    pts.push([s, bottom(s)]);
  }
  for (let i = n; i >= 0; i--) {
    const s = s0 + ((s1 - s0) * i) / n;
    pts.push([s, top(s)]);
  }
  return profileT(pts, t0, t1);
}
// Loft langs s: per station een convexe doorsnede in het tz-vlak (tegen de
// klok in gezien vanaf +s, steeds evenveel punten).
function loftS(stations, label) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { s, section } of stations) for (const [t, z] of section) verts.push(s, t, z);
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
  if (solid.status() !== "NoError") throw new Error(`${label}: ${solid.status()}`);
  if (solid.volume() <= 0) throw new Error(`${label}: binnenstebuiten`);
  return solid;
}
// Stations van s0 tot s1 om de `step` meter, met de uiteinden exact.
const stationsS = (s0, s1, step) => {
  const n = Math.max(1, Math.round((s1 - s0) / step));
  return Array.from({ length: n + 1 }, (_, i) => s0 + ((s1 - s0) * i) / n);
};
const loftAlong = (s0, s1, sectionAt, label, step = 2) =>
  loftS(stationsS(s0, s1, step).map((s) => ({ s, section: sectionAt(s) })), label);
function inset(poly, d) {
  const polys = new CrossSection([ccw(poly)]).offset(-d, "Miter").toPolygons();
  if (polys.length !== 1 || polys[0].length < 3) return null;
  return polys[0].map(([x, z]) => [x, z]);
}
// Balk tussen twee punten (s, t, z = bovenkant): bovenkant vlak, `rect` m recht
// en daaronder een V van 50 graden, zodat hij zonder steun print.
function vBeam(p0, p1, width, rect = 0.4) {
  const ds = p1[0] - p0[0];
  const dt = p1[1] - p0[1];
  const len = Math.hypot(ds, dt);
  const ns = -dt / len;
  const nt = ds / len;
  const h = width / 2;
  const vee = h * Math.tan(rad(50));
  const section = (p) => [
    [p[0] + ns * h, p[1] + nt * h, p[2]],
    [p[0] - ns * h, p[1] - nt * h, p[2]],
    [p[0] + ns * h, p[1] + nt * h, p[2] - rect],
    [p[0] - ns * h, p[1] - nt * h, p[2] - rect],
    [p[0], p[1], p[2] - rect - vee],
  ];
  return Manifold.hull([...section(p0), ...section(p1)]);
}

// ---------- hoofdmaten ----------
const WATER_NAP = 5.2; // waterspiegel van de IJssel in het PDOK-terrein (48,09 m ellipsoïdisch)
const Z = (nap) => +(nap - WATER_NAP).toFixed(4);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel (zoals de verkeersbrug)
const GROUND_OFFSET = 0;
// PDOK-terreinhoogte (ellipsoïdisch) van het water op de maaiveldpunten.
const GROUND_HEIGHT = 48.09;
const ORIGIN_ST = [282.35, 17.68]; // oorsprong in het bouwstelsel
const ORIGIN_RD = [209855.34, 462003.53];

// Bovenkant van het dek (de spoorlaag) in NAP-meters om de 10 m vanaf s = -10:
// mediaan van het AHN-DSM over t = 14,5 tot 21 (de twee sporen) over 4 m; bij
// het stalen veld en de westelijke heftoren (s = 200 tot 220) geïnterpoleerd,
// want daar kijkt het DSM door het open stalen dek.
const RAIL_S0 = -10;
const RAIL_NAP = [
  11.97, 11.96, 11.97, 11.96, 11.95, 11.96, 11.98, 11.98, 11.97, 11.97, 11.98, 12.01, 12.01, 12.0, 12.0, 12.02, 12.03, 12.03,
  12.06, 12.04, 12.02, 12.06, 12.1, 12.14, 12.18, 12.2, 12.24, 12.29, 12.3, 12.31, 12.32, 12.28, 12.28, 12.24, 11.97, 11.92,
];
const railNap = (s) => {
  const f = clamp((s - RAIL_S0) / 10, 0, RAIL_NAP.length - 1);
  const i = Math.min(Math.floor(f), RAIL_NAP.length - 2);
  return lerp(RAIL_NAP[i], RAIL_NAP[i + 1], f - i);
};
const rail = (s) => Z(railNap(s));
const minRail = (s0, s1) => Math.min(rail(s0), rail(s1), rail((s0 + s1) / 2));

// Lengte-indeling (s).
const WEST_END = -3; // achterkant westelijk landhoofd
const WEST_FACE = 1; // voorzijde westelijk landhoofd
const CONCRETE_TO = 196.7; // einde betonnen aanbrug (BGT-spoorbaanvlak wisselt hier)
const LIFT = { s0: 220.5, s1: 236.7 }; // voegen van het beweegbare dek (BGT)
const MAIN = { s0: 238.3, s1: 326.3 }; // stalen dek van de vakwerkbrug
const EAST_FACE = 337;
const EAST_END = 341;
// Dekranden (t): zuidrand overal 12,5 (0,2 m van de verkeersbrug); noordrand
// over de aanbrug 23,1, vanaf s = 194,2 (BGT) 24,6, over het beweegbare dek
// 24,45, over de vakwerkbrug 25,0 en over het oostelijke veld weer 23,1.
const SOUTH = 12.5;
const PIER_SOUTH = 12.32; // pijlers tot tegen de verkeersbrug (die houdt op bij 12,3)
const NORTH = { approach: 23.1, steel: 24.6, lift: 24.45, main: 25.0, east: 23.1 };
// Dekstukken met dezelfde loftstations voor dek, schampkanten en snijstrook.
const DECK = [
  { key: "approach", s0: WEST_END, s1: 194.2, north: NORTH.approach, depth: 1.9, slab: 0.9, under: [13.4, 22.2] },
  { key: "approachWide", s0: 194.2, s1: CONCRETE_TO, north: NORTH.steel, depth: 1.9, slab: 0.9, under: [13.4, 22.2] },
  { key: "steel", s0: CONCRETE_TO, s1: LIFT.s0, north: NORTH.steel, depth: 2.5, slab: 0.6, under: [12.6, 22.75] },
  { key: "lift", s0: LIFT.s0, s1: MAIN.s0, north: NORTH.lift, depth: 2.0, slab: 0.6, under: [12.6, 22.75] },
  { key: "main", s0: MAIN.s0, s1: MAIN.s1, north: NORTH.main, depth: 2.3, slab: 0.6, under: [SOUTH + 0.05, 22.8] },
  { key: "east", s0: MAIN.s1, s1: EAST_END, north: NORTH.east, depth: 1.6, slab: 0.9, under: [13.4, 22.2] },
];
const pieceAt = (s) => DECK.find((p) => s >= p.s0 && s <= p.s1) ?? (s < 0 ? DECK[0] : DECK[DECK.length - 1]);
const northEdge = (s) => pieceAt(s).north;

// Steunpunten: zes wandpijlers van de betonnen aanbrug op s = 32,92 k (de
// voegen in het dek op 65,8 en 131,4 liggen om de twee velden; de laatste is de
// BGT-pijler op 197,5, 2 m dik), de hefbrugpijlers en de boogpijler als BGT-
// omtrek met ronde kop aan de noordkant (vereenvoudigd tot 5 cm, alleen het
// deel ten noorden van t = 12,32).
const WALL_PIERS = [...Array.from({ length: 5 }, (_, k) => +((197.5 * (k + 1)) / 6).toFixed(2)), 197.5];
const WALL_PIER = { half: 1.0, cap: 1.3, capDepth: 0.8 };
// L0002.522c139505894729a5ac48e25c934943 (westelijke hefbrugpijler)
const PIER_LIFT_W = [
  [217.48, -0.01], [218.53, 0.73], [219.29, 1.55], [219.52, 1.88], [220.2, 3.4], [220.38, 21.07], [220.04, 22.86], [219.37, 24.09], [218.28, 25.18], [217.48, 25.76],
  [216.53, 25.09], [215.61, 24.18], [214.99, 23.18], [214.65, 22.26], [214.47, 20.91], [214.4, 5.53], [214.48, 3.79], [214.99, 2.24], [215.8, 1.07], [216.66, 0.33], [217.3, -0.08],
];
// L0002.467348cf49d147719ff316ac5c69a248 (oostelijke hefbrugpijler)
const PIER_LIFT_E = [
  [238.44, 0.48], [239.3, 1.35], [240.45, 4.59], [240.47, 19.63], [240.31, 21.89], [239.9, 23.1], [239.19, 24.2], [237.99, 25.3], [237.45, 25.7], [236.12, 24.59],
  [234.99, 22.99], [234.66, 21.83], [234.53, 20.56], [234.6, 3.63], [235.02, 2.36], [235.8, 1.07], [236.77, 0.16], [237.51, -0.2],
];
// L0002.708639e0cc334243b8555eb7365e60e9 (boogpijler, oostkant van de vakwerkbrug)
const PIER_ARCH = [
  [326.35, 1.98], [326.88, 2.12], [327.26, 2.6], [327.34, 3.05], [329.14, 22.02], [329.01, 22.8], [328.81, 23.11], [327.95, 23.63], [327.33, 23.77], [326.64, 23.81],
  [325.96, 23.7], [325.44, 23.36], [325.34, 23.0], [325.3, 2.98], [325.51, 2.37], [325.91, 2.05],
];

// Vakwerkbrug: twee platen van 1,0 m op de vakwerklijnen (AHN t = 13,05 en
// 22,3). Bovenrand een parabool met de top op NAP +25,0 m bij s = 282,3 (AHN,
// kleinste kwadraten, mediaan afwijking 0,04 m), als veelhoek door 14
// bovenknopen om de 5,969 m (s = 243,5 tot 321,1; de dwarsregels van het
// windverband op de luchtfoto), eindstijlen naar de opleggingen op s = 238,8 en
// 325,8. Warren-vakwerk (foto's): vanaf elk eind een diagonaal per vak, stijlen
// op de knopen 0, 2, 4, 6 en 7, 9, 11, 13 en een kruis in het middelste vak
// (knoop 6 tot 7). De openingen zijn de driehoeken tussen de staven (0,9 m):
// met een plafond van minstens 52 graden doorgaand; tussen de diagonalen
// (punt omlaag) een ruit met een spitse top van 54 graden; de rest (vlakke bovenkant)
// een blinde nis van 0,35 m aan de buitenkant.
const TRUSS = {
  centres: [13.05, 22.3],
  width: 1.0,
  bearings: [238.8, 325.8],
  node0: 243.5,
  node13: 321.1,
  crownNap: 25.0,
  crownS: 282.3,
  k: 0.00325,
  chordTop: 1.0, // diepte van de bovenrand
  chordLow: 0.9, // onderrand tot 0,9 m boven het spoor
  bar: 0.9,
  niche: 0.35,
  minCeiling: 52,
  braceWidth: 0.9,
};
const PANEL = (TRUSS.node13 - TRUSS.node0) / 13;
const NODES = Array.from({ length: 14 }, (_, i) => TRUSS.node0 + i * PANEL);
const chordTopNap = (s) => TRUSS.crownNap - TRUSS.k * (s - TRUSS.crownS) ** 2;
const TOPS = NODES.map((s) => Z(chordTopNap(s)));
// Bovenrand als veelhoek door de knopen.
const topAt = (s) => {
  if (s <= NODES[0]) return TOPS[0];
  if (s >= NODES[13]) return TOPS[13];
  const i = Math.min(12, Math.floor((s - NODES[0]) / PANEL));
  return lerp(TOPS[i], TOPS[i + 1], (s - NODES[i]) / PANEL);
};

// Hefbrug: twee heftorens (AHN) met elk twee poten langs de dekranden (t = 12,5
// tot 13,7 en 23,3 tot 24,5) met een spits zijraam, het contragewicht als
// dwarsbalk met een V-onderkant tussen de poten en langsliggers tussen de
// torens (AHN NAP +19,55 m zuid, +19,2 m noord).
const TOWERS = [
  { s0: 215.6, s1: 219.8, topNap: 22.4, beamNap: 21.2, beamWidth: 3.0 },
  { s0: 236.4, s1: 239.8, topNap: 22.7, beamNap: 21.0, beamWidth: 2.6 },
];
const TOWER = { legs: [[12.5, 13.7], [23.3, 24.5]], post: 1.0, windowFloor: 1.4, shoulderNap: 18.0, pointed: 55, beamRect: 1.6 };
const TIE_BEAMS = [
  { t: 13.1, topNap: 19.55 },
  { t: 23.9, topNap: 19.2 },
];
const TIE_WIDTH = 1.0;
// Plaatliggers langs het spoor op het stalen veld en het beweegbare dek (AHN
// NAP +13,4 m, 1,2 m boven het spoor), op de vakwerklijnen.
const GIRDER = { height: 1.2, width: 0.9, pieces: [[CONCRETE_TO, LIFT.s0 - 0.2], [LIFT.s0 + 0.2, LIFT.s1 - 0.2]] };
const JOINT = { width: 0.4, depth: 0.3 };
// Schampkanten langs de randen van de betonnen velden: 0,9 m breed, 0,6 m hoog.
const KERB = { width: 0.9, height: 0.6 };
const KERB_PIECES = DECK.filter((p) => ["approach", "approachWide", "east"].includes(p.key));

// ---------- dek ----------
const parts = [];
for (const p of DECK) {
  parts.push(loftAlong(p.s0, p.s1, (s) => [[SOUTH, rail(s) - p.slab], [p.north, rail(s) - p.slab], [p.north, rail(s)], [SOUTH, rail(s)]], `dek ${p.key}`));
  parts.push(
    loftAlong(p.s0, p.s1, (s) => [[p.under[0], rail(s) - p.depth], [p.under[1], rail(s) - p.depth], [p.under[1], rail(s) - p.slab + 0.1], [p.under[0], rail(s) - p.slab + 0.1]], `onderbouw ${p.key}`),
  );
}
// Landhoofden: blokken tot onder het spoor.
const abutment = (s0, s1, north) => loftAlong(s0, s1, (s) => [[SOUTH, BASE], [north, BASE], [north, rail(s) - 0.05], [SOUTH, rail(s) - 0.05]], "landhoofd", 1);
parts.push(abutment(WEST_END, WEST_FACE, NORTH.approach));
parts.push(abutment(EAST_FACE, EAST_END, NORTH.east));

// ---------- pijlers ----------
for (const sc of WALL_PIERS) {
  const top = minRail(sc - WALL_PIER.cap, sc + WALL_PIER.cap) - 1.9;
  parts.push(boxFromTo(sc - WALL_PIER.half, sc + WALL_PIER.half, PIER_SOUTH, NORTH.approach, BASE, top - WALL_PIER.capDepth + 0.05));
  parts.push(boxFromTo(sc - WALL_PIER.cap, sc + WALL_PIER.cap, PIER_SOUTH, NORTH.approach, top - WALL_PIER.capDepth, top + 0.3));
}
const clipNorth = (poly) => {
  const out = new CrossSection([ccw(poly)]).intersect(new CrossSection([[[-1000, PIER_SOUTH], [1000, PIER_SOUTH], [1000, 100], [-1000, 100]]])).toPolygons();
  if (out.length !== 1) throw new Error("pijler: niet één polygoon");
  return out[0].map(([x, y]) => [x, y]);
};
const pierPrism = (poly, top) => prism(clipNorth(poly), BASE, top);
parts.push(pierPrism(PIER_LIFT_W, minRail(214.4, 220.4) - 2.5 + 0.3));
parts.push(pierPrism(PIER_LIFT_E, minRail(234.5, 240.5) - 2.0 + 0.4));
parts.push(pierPrism(PIER_ARCH, minRail(325.3, 329.1) - 1.6 + 0.2));

// ---------- schampkanten ----------
function kerbsFor(p, margin = 0) {
  const bottom = margin > 0 ? 1.1 : 0.3;
  return [
    [SOUTH, SOUTH + KERB.width],
    [p.north - KERB.width, p.north],
  ].map(([a, b]) =>
    loftAlong(p.s0, p.s1, (s) => [[a - margin, rail(s) - bottom], [b + margin, rail(s) - bottom], [b + margin, rail(s) + KERB.height + margin], [a - margin, rail(s) + KERB.height + margin]], "schampkant"),
  );
}
const kerbs = KERB_PIECES.flatMap((p) => kerbsFor(p));
parts.push(...kerbs);

// Voegen van het beweegbare dek: sleuven over het dek aan beide einden.
const joints = [LIFT.s0, LIFT.s1].map((s) => boxFromTo(s - JOINT.width / 2, s + JOINT.width / 2, SOUTH - 1, NORTH.main + 1, rail(s) - JOINT.depth, rail(s) + 0.6));

// ---------- plaatliggers ----------
const girders = GIRDER.pieces.flatMap(([s0, s1]) =>
  TRUSS.centres.map((tc) => bandT(s0, s1, (s) => rail(s) - 2.0, (s) => rail(s) + GIRDER.height, tc - GIRDER.width / 2, tc + GIRDER.width / 2)),
);

// ---------- vakwerkliggers ----------
const zb = (s) => rail(s) + TRUSS.chordLow / 2; // hartlijn onderrand
const zt = (i) => TOPS[i] - TRUSS.chordTop / 2; // hartlijn bovenrand op knoop i
const T = (i) => [NODES[i], zt(i)];
const B = (i) => [NODES[i], zb(NODES[i])];
const tri = [];
// Eindvakken: tussen eindstijl, stijl en onderrand.
tri.push([[TRUSS.bearings[0], zb(TRUSS.bearings[0])], T(0), B(0)]);
tri.push([B(13), T(13), [TRUSS.bearings[1], zb(TRUSS.bearings[1])]]);
// Velden van twee vakken met een stijl aan beide einden.
for (const i of [0, 2, 4, 7, 9, 11]) {
  tri.push([B(i), T(i), B(i + 1)]);
  tri.push([T(i), T(i + 1), T(i + 2), B(i + 1)]);
  tri.push([B(i + 1), T(i + 2), B(i + 2)]);
}
// Middelste vak met een kruis.
{
  const [a, b] = [T(6), B(7)];
  const [c, d] = [B(6), T(7)];
  const den = (b[0] - a[0]) * (d[1] - c[1]) - (b[1] - a[1]) * (d[0] - c[0]);
  const u = ((c[0] - a[0]) * (d[1] - c[1]) - (c[1] - a[1]) * (d[0] - c[0])) / den;
  const m = [a[0] + u * (b[0] - a[0]), a[1] + u * (b[1] - a[1])];
  tri.push([B(6), B(7), m], [T(6), m, T(7)], [B(6), m, T(6)], [T(7), m, B(7)]);
}
// De scherpe hoeken (uiterste s) 0,12 m afgekapt met een verticale kant.
function clipCorners(poly) {
  let lo = Infinity;
  let hi = -Infinity;
  let zlo = Infinity;
  let zhi = -Infinity;
  for (const [x, z] of poly) {
    lo = Math.min(lo, x);
    hi = Math.max(hi, x);
    zlo = Math.min(zlo, z);
    zhi = Math.max(zhi, z);
  }
  const box = [[lo + 0.12, zlo - 1], [hi - 0.12, zlo - 1], [hi - 0.12, zhi + 1], [lo + 0.12, zhi + 1]];
  const out = new CrossSection([ccw(poly)]).intersect(new CrossSection([box])).toPolygons();
  return out.length === 1 ? out[0].map(([x, z]) => [x, z]) : poly;
}
// Kleinste hellingshoek van de plafonds (randen met het materiaal erboven).
function ceilingAngle(poly) {
  const p = ccw(poly);
  let min = 90;
  p.forEach(([x0, z0], i) => {
    const [x1, z1] = p[(i + 1) % p.length];
    const dx = x1 - x0;
    const dz = z1 - z0;
    if (dx < -1e-6) min = Math.min(min, (Math.atan2(Math.abs(dz), Math.abs(dx)) * 180) / Math.PI);
  });
  return min;
}
// Driehoeken met de punt omlaag (vlakke bovenkant onder de bovenrand): de
// opening krijgt een spitse top van 54 graden vanaf het midden van de bovenkant
// (een ruit tussen de diagonalen); wat erboven overblijft is een blinde nis.
const ROOF = 54;
const roofCut = (poly) => {
  let top = -Infinity;
  let lo = Infinity;
  let hi = -Infinity;
  for (const [x, z] of poly) {
    top = Math.max(top, z);
    lo = Math.min(lo, x);
    hi = Math.max(hi, x);
  }
  const cx = (lo + hi) / 2;
  const big = hi - lo + 10;
  const drop = big * Math.tan(rad(ROOF));
  // De top ligt 0,4 m onder de bovenkant van de opening recht boven het midden.
  top = -Infinity;
  poly.forEach(([x0, z0], i) => {
    const [x1, z1] = poly[(i + 1) % poly.length];
    if ((x0 - cx) * (x1 - cx) <= 0 && x0 !== x1) top = Math.max(top, z0 + ((z1 - z0) * (cx - x0)) / (x1 - x0));
  });
  top -= 0.4;
  return new CrossSection([ccw([[cx - big, top - drop], [cx, top], [cx + big, top - drop], [cx + big, top - drop - 100], [cx - big, top - drop - 100]])]);
};
const trussHoles = [];
const trussNiches = [];
const asPolys = (cs) => cs.toPolygons().map((p) => p.map(([x, z]) => [x, z])).filter((p) => Math.abs(polyArea(p)) >= 0.3);
for (const t of tri) {
  const open = inset(t, TRUSS.bar / 2);
  if (!open || Math.abs(polyArea(open)) < 0.3) continue;
  const angle = ceilingAngle(open);
  if (angle >= TRUSS.minCeiling) {
    trussHoles.push({ poly: clipCorners(open), angle });
    continue;
  }
  // Punt omlaag: de onderste hoek ligt midden onder de bovenkant.
  const bottom = open.reduce((p, q) => (q[1] < p[1] ? q : p));
  const xs = open.map(([x]) => x);
  const pointDown = bottom[0] > Math.min(...xs) + 0.5 && bottom[0] < Math.max(...xs) - 0.5;
  if (!pointDown) {
    trussNiches.push({ poly: clipCorners(open), angle });
    continue;
  }
  const cs = new CrossSection([ccw(open)]);
  const roof = roofCut(open);
  for (const p of asPolys(cs.intersect(roof))) trussHoles.push({ poly: p, angle: ceilingAngle(p) });
  for (const p of asPolys(cs.subtract(roof))) trussNiches.push({ poly: clipCorners(p), angle: ceilingAngle(p) });
}
const trussOutline = (() => {
  const [bw, be] = TRUSS.bearings;
  const low = (s) => rail(s) - 2.3;
  const pts = [];
  for (const s of stationsS(bw - 0.6, be + 0.6, 1)) pts.push([s, low(s)]);
  pts.push([be + 0.6, rail(be) + TRUSS.chordLow + 0.45]);
  pts.push([NODES[13] + 0.35, TOPS[13]]);
  for (let i = 13; i >= 0; i--) pts.push([NODES[i], TOPS[i]]);
  pts.push([NODES[0] - 0.35, TOPS[0]]);
  pts.push([bw - 0.6, rail(bw) + TRUSS.chordLow + 0.45]);
  return pts;
})();
const trusses = TRUSS.centres.map((tc) => {
  const h = TRUSS.width / 2;
  const plate = profileT(trussOutline, tc - h, tc + h);
  const outer = tc < 17 ? [tc - h - 0.5, tc - h + TRUSS.niche] : [tc + h - TRUSS.niche, tc + h + 0.5];
  const cuts = [
    ...trussHoles.map(({ poly }) => profileT(poly, tc - h - 0.5, tc + h + 0.5)),
    ...trussNiches.map(({ poly }) => profileT(poly, outer[0], outer[1])),
  ];
  return plate.subtract(union(cuts));
});
// Windverband tussen de bovenranden: een dwarsregel op elke knoop en een
// diagonaal per vak, afwisselend van richting (luchtfoto).
const [tS, tN] = TRUSS.centres;
const braces = [];
for (let i = 0; i < 14; i++) braces.push(vBeam([NODES[i], tS, TOPS[i] - 0.15], [NODES[i], tN, TOPS[i] - 0.15], TRUSS.braceWidth));
for (let i = 0; i < 13; i++) {
  const [a, b] = i % 2 === 0 ? [tS, tN] : [tN, tS];
  braces.push(vBeam([NODES[i], a, TOPS[i] - 0.15], [NODES[i + 1], b, TOPS[i + 1] - 0.15], TRUSS.braceWidth));
}

// ---------- heftorens ----------
const towers = TOWERS.flatMap(({ s0, s1, topNap, beamNap, beamWidth }) => {
  const bottom = minRail(s0, s1) - 2.0;
  const w0 = s0 + TOWER.post;
  const w1 = s1 - TOWER.post;
  const sh = Z(TOWER.shoulderNap);
  const apex = sh + Math.tan(rad(TOWER.pointed)) * ((w1 - w0) / 2);
  const window = [[w0, minRail(s0, s1) + TOWER.windowFloor], [w1, minRail(s0, s1) + TOWER.windowFloor], [w1, sh], [(w0 + w1) / 2, apex], [w0, sh]];
  const legs = TOWER.legs.map(([a, b]) => boxFromTo(s0, s1, a, b, bottom, Z(topNap)).subtract(profileT(window, a - 0.5, b + 0.5)));
  const sc = (s0 + s1) / 2;
  const beam = vBeam([sc, TOWER.legs[0][1] - 0.05, Z(beamNap)], [sc, TOWER.legs[1][0] + 0.05, Z(beamNap)], beamWidth, TOWER.beamRect);
  return [...legs, beam];
});
const ties = TIE_BEAMS.map(({ t, topNap }) => vBeam([TOWERS[0].s1 - 0.1, t, Z(topNap)], [TOWERS[1].s0 + 0.1, t, Z(topNap)], TIE_WIDTH));

const bridge = union([union(parts).subtract(union(joints)), ...girders, ...trusses, ...braces, ...towers, ...ties]);

// ---------- printvoet (alleen in de STL) ----------
// Onder het dek: een wig van 50 graden vanaf de randen die uitloopt in een
// scherm van 0,9 m tot de onderplaat, tussen de landhoofden.
const KNEE = rad(50);
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const steps = DECK.slice(1).map((p) => p.s0);
const footXs = [...stationsS(WEST_FACE, EAST_FACE, 0.5), ...steps.flatMap((s) => [s - 0.01, s + 0.01])]
  .filter((s) => !steps.includes(s))
  .sort((a, b) => a - b)
  .filter((s, i, xs) => i === 0 || s - xs[i - 1] > 1e-4);
const printFoot = loftS(
  footXs.map((s) => {
    const t1 = northEdge(s);
    const c = (SOUTH + t1) / 2;
    const w = (t1 - SOUTH) / 2;
    const zbot = rail(s) - 0.6 - 0.02;
    const zIn = rail(s) - 0.3;
    const hit = w - (zbot - BASE) / Math.tan(KNEE);
    const section =
      hit > SCREEN
        ? [[c - hit, BASE], [c + hit, BASE], [c + hit + 1e-3, BASE + 1e-3], [c + w, zbot], [c + w, zIn], [c - w, zIn], [c - w, zbot], [c - hit - 1e-3, BASE + 1e-3]]
        : [[c - SCREEN, BASE], [c + SCREEN, BASE], [c + SCREEN, zbot - Math.tan(KNEE) * (w - SCREEN)], [c + w, zbot], [c + w, zIn], [c - w, zIn], [c - w, zbot], [c - SCREEN, zbot - Math.tan(KNEE) * (w - SCREEN)]];
    return { s, section };
  }),
  "printvoet",
);
const printModel = union([bridge, printFoot]);

// ---------- spoor als eigen onderdeel ----------
// De bovenste 0,5 m van het dek binnen de BGT-spoorbaanvlakken is een eigen
// node met de attributen van het wegdeel (glTF `extras.attributes`), zodat de
// kleurregels van een thema (bijvoorbeeld spoor zwart) op het brugdek werken
// zoals op de PDOK-wegdelen. Pas na het printmodel gebouwd, zodat de STL de brug
// als geheel ongewijzigd houdt. De rest van het dek (looppaden langs de randen,
// de landhoofden) blijft constructie.
//
// Actuele BGT-wegdelen spoorbaan met relatieve hoogteligging 1 op het dek,
// gesloten verharding zonder plus-fysiek voorkomen, in het bouwstelsel (s, t),
// vereenvoudigd tot 5 cm:
const SPOOR_PATHS = {
  // aanbrug (s = 0,1 tot 196,7)
  "L0004.dfd15597101f1ec3e0530b29a8c0df95": [[196.66, 14.21], [196.65, 14.71], [196.72, 14.71], [196.68, 21.6], [63.09, 21.73], [0.28, 21.75], [0.1, 14.36]],
  // stalen veld, hefbrug en vakwerkbrug (s = 196,7 tot 327,5)
  "L0004.dfd1559710201ec3e0530b29a8c0df95": [[327.43, 14.75], [327.51, 20.92], [196.68, 21.69], [196.68, 21.6], [196.72, 14.71]],
  // oostelijk veld (s = 327,4 tot 339,7)
  "L0004.dfd15597101c1ec3e0530b29a8c0df95": [[338.92, 14.32], [339.7, 21.17], [339.35, 21.16], [339.36, 21.33], [339.27, 21.33], [339.27, 21.23], [327.5, 21.25], [327.43, 14.75], [327.49, 14.75], [327.49, 14.34]],
};
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
const LAYER = 0.5;
const ABOVE = 1.0;
// Snijstrook van 0,5 m onder tot 1 m boven het dek over dezelfde stations als
// het dek, per dekstuk, tot voorbij de randen en de landhoofden.
const strip = union(
  DECK.map((p, i) =>
    loftAlong(
      i === 0 ? p.s0 - 2 : p.s0,
      i === DECK.length - 1 ? p.s1 + 2 : p.s1,
      (s) => [[SOUTH - 0.4, rail(s) - LAYER], [NORTH.main + 0.5, rail(s) - LAYER], [NORTH.main + 0.5, rail(s) + ABOVE], [SOUTH - 0.4, rail(s) + ABOVE]],
      "snijstrook",
    ),
  ),
);
// Wat door de laag steekt blijft constructie, met 2 cm vrij: schampkanten,
// plaatliggers, vakwerkplaten (over hun hele lengte), torenpoten en voegen.
const G = 0.02;
const guards = [
  ...KERB_PIECES.flatMap((p) => kerbsFor(p, G)),
  ...GIRDER.pieces.flatMap(([s0, s1]) =>
    TRUSS.centres.map((tc) => boxFromTo(s0 - G, s1 + G, tc - GIRDER.width / 2 - G, tc + GIRDER.width / 2 + G, -5, 30)),
  ),
  ...TRUSS.centres.map((tc) => boxFromTo(TRUSS.bearings[0] - 0.6 - G, TRUSS.bearings[1] + 0.6 + G, tc - TRUSS.width / 2 - G, tc + TRUSS.width / 2 + G, -5, 30)),
  ...TOWERS.flatMap(({ s0, s1 }) => TOWER.legs.map(([a, b]) => boxFromTo(s0 - G, s1 + G, a - G, b + G, -5, 30))),
  ...joints.map((j) => {
    const bb = j.boundingBox();
    return boxFromTo(bb.min[0] - G, bb.max[0] + G, bb.min[1] - G, bb.max[1] + G, bb.min[2] - G, bb.max[2] + G);
  }),
];
const spoorZone = union(Object.values(SPOOR_PATHS).map((poly) => prism(poly, -50, 100)));
const spoorCut = strip.intersect(spoorZone).subtract(union(guards));
const spoor = spoorCut.intersect(bridge);
const structure = bridge.subtract(spoorCut);
const shift = [-ORIGIN_ST[0], -ORIGIN_ST[1], 0];
const named = [
  [`building:${SLUG}`, structure.translate(shift)],
  ["road:spoor", spoor.translate(shift), SPOOR_ATTRIBUTES],
];
// Partitiecontrole: de onderdelen tellen op tot de brug als geheel.
const partition = {
  bridgeM3: +bridge.volume().toFixed(3),
  partsM3: +(structure.volume() + spoor.volume()).toFixed(3),
};
partition.diffM3 = +(partition.partsM3 - partition.bridgeM3).toFixed(4);
if (Math.abs(partition.diffM3) > 0.01) throw new Error(`onderdelen tellen niet op: ${JSON.stringify(partition)}`);

// ---------- controles ----------
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const st = mesh.numProp;
  let area = 0;
  const bins = {};
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * st + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(n[0], n[1], n[2]);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    const k = Math.round((p[0][0] + p[1][0] + p[2][0]) / 3 / 25) * 25;
    bins[k] = (bins[k] ?? 0) + len / 2;
  }
  return { area, bins };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-4) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  if (bb.min[1] < PIER_SOUTH - 1e-6) throw new Error(`${name}: steekt in de verkeersbrug (t = ${bb.min[1]})`);
}
if (trussHoles.some(({ angle }) => angle < TRUSS.minCeiling)) throw new Error("vakwerkopening met een te vlak plafond");
const overhangReport = (() => {
  const model = overhangs(bridge);
  const print = overhangs(printModel);
  return {
    modelM2: Math.round(model.area),
    printM2: +print.area.toFixed(1),
    printByS: Object.fromEntries(Object.entries(print.bins).filter(([, a]) => a > 1).map(([k, a]) => [k, +a.toFixed(1)])),
  };
})();

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
const report = {};
for (const [name, solid] of named) {
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
const local = (s) => +(s - ORIGIN_ST[0]).toFixed(2);
report.truss = {
  panelM: +PANEL.toFixed(3),
  nodesX: NODES.map(local),
  topsNap: TOPS.map((z) => +(z + WATER_NAP).toFixed(2)),
  bearingsX: TRUSS.bearings.map(local),
  throughHoles: trussHoles.length,
  niches: trussNiches.length,
  minHoleCeilingDeg: +Math.min(...trussHoles.map(({ angle }) => angle)).toFixed(1),
  braces: braces.length,
};
report.lift = { joints: [LIFT.s0, LIFT.s1].map(local), towersX: TOWERS.map(({ s0, s1 }) => [local(s0), local(s1)]) };
report.piers = { wallX: WALL_PIERS.map(local) };
report.overhang = overhangReport;
report.partition = partition;
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(named, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: named.map(([name]) => name) };

const stlName = `${SLUG}-1-${scale}.stl`;
const printSolid = printModel.translate([-ORIGIN_ST[0], -ORIGIN_ST[1], -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint IJsselspoorbrug Zutphen 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveld op de uiterwaard en het water ten noorden van de brug (15 m naast de
// as, 9 m voorbij de noordrand) over de hele lengte, en op de rivier ten zuiden
// van de verkeersbrug (31 m naast de as).
const samplePoints = [
  ...[-222, -152, -82, -30, 0, 30].map((x) => [x, 15]),
  ...[-30, 30].map((x) => [x, -31]),
];
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: "IJsselspoorbrug Zutphen",
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN_RD,
      xAxis: [0.93155, 0.3636],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "L0004.1c2b1f7c19674ef6bf65cf976243a4eb",
        "L0004.6b66f7dd0a494d3ea0551d14e7973ada",
        "L0004.749113f20549410bbade74afe89fa603",
        "L0004.9e5667d5858a40e084cfa89f86e2daef",
        "L0004.a9fc9dede36f4172a3a864f8cf1bc479",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het midden tussen de twee vakwerkliggers onder de top van de bovenrand op de waterspiegel van de IJssel (z = 0, NAP +5,2 m zoals het PDOK-terrein) in de oorsprong, +X langs de brug naar het oosten (Zutphen, RD-richting 21,32 graden vanaf het oosten, dezelfde as als het model van de Oude IJsselbrug) en +Y naar het noordnoordwesten; de verkeersbrug ligt ten zuiden (y < -5,4) en zit niet in dit model. Twee nodes: road:spoor, de bovenste 0,5 m van het dek binnen de drie actuele BGT-spoorbaanvlakken op de brug met hun attributen in extras.attributes (bgt_functie spoorbaan, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk van het westelijke landhoofd bij De Hoven (x = -285) tot het landhoofd in Zutphen (x = 58,7), met het spoor op NAP +11,96 tot +12,32 m (AHN). De betonnen aanbrug over de uiterwaard op zes velden van 32,9 m met wandpijlers en pijlerkoppen en schampkanten langs de randen; een stalen veld met plaatliggers langs het spoor tot de westelijke hefbrugpijler; de hefbrug met voegen, plaatliggers en twee heftorens tot NAP +22,4 en +22,7 m, met spitse zijramen in de poten, het contragewicht als dwarsbalk met een V-onderkant tussen de poten en langsliggers met een V-onderkant tussen de torens; de vakwerkbrug met gebogen bovenrand (opleggingen 87 m uit elkaar, top NAP +25,0 m) als twee platen van 1,0 m, 9,25 m uit elkaar, met 13 vakken van 5,97 m: Warren-vakwerk met stijlen op de bovenknopen en een kruis in het middelste vak, doorgaande openingen met een spits plafond en blinde nissen, het windverband tussen de bovenranden als staven met een V-onderkant en een looppad aan de noordkant; het korte betonnen veld naar Zutphen; de pijlers van hefbrug en vakwerkbrug met ronde koppen (BGT), aan de zuidkant afgesneden bij de verkeersbrug. Bovenleiding, leuningen, seinen en de trappen op de torens zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de uiterwaard en het water naast de brug bemonsterd; groundHeight is de ellipsoïdische PDOK-hoogte van het water. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_END - WEST_END).toFixed(1),
        deckWidthM: { approach: +(NORTH.approach - SOUTH).toFixed(2), main: +(NORTH.main - SOUTH).toFixed(2) },
        trussBearingsM: +(TRUSS.bearings[1] - TRUSS.bearings[0]).toFixed(1),
        trussPanels: 13,
        trussPanelM: +PANEL.toFixed(3),
        trussCrownNapM: TRUSS.crownNap,
        trussPlanesApartM: +(TRUSS.centres[1] - TRUSS.centres[0]).toFixed(2),
        liftSpanJointsM: +(LIFT.s1 - LIFT.s0).toFixed(1),
        liftTowerTopNapM: TOWERS.map(({ topNap }) => topNap),
        approachSpans: WALL_PIERS.length,
        approachSpanM: +(197.5 / 6).toFixed(2),
        railNapM: { west: RAIL_NAP[1], crest: Math.max(...RAIL_NAP), east: RAIL_NAP[RAIL_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/IJsselspoorbrug_(Zutphen)",
        "PDOK BGT overbruggingsdeel (dekken, beweegbaar dek, pijlers) en wegdeel (spoorbaan), EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor het spoor, de dekranden, de vakwerklijnen en hun bovenrand, de eindstijlen, de plaatliggers, de heftorens en de langsliggers",
        "PDOK luchtfoto (Actueel_orthoHR) voor de knopen van het windverband en de voegen van de aanbrug",
        "Wikimedia Commons: Zutphen brug VIRMm 8676 (51090754448).jpg; Zutphen de Hoven brug VIRM 8642 naar Roosendaal (14208095504).jpg; Zutphen IRM duo op de brug lente (14384272235).jpg; Zutphen Arriva 367 Guus Hiddink op de brug (14384272795).jpg; Zutphen omgeleide ICE 123 naar Frankfurt Main gereden door stel 4654 (24161262772).jpg; Zutphen Arriva Spurt 369 Apeldoorn (10375891664).jpg; Zutphen ICMm 4087-4219 r.Arnhem 4040-4213 r.Zwolle (10375887414).jpg; Zutphen ijsselbruecke.jpg; Enormous quantities of water passing through the IJselriver at the colourfull bridges of Zutphen - panoramio.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

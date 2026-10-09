// Genereert een vereenvoudigd, gesloten 3D-model van de Wilhelminabrug in
// Deventer: de verkeersbrug (N344) over de IJssel tussen De Worp (west) en de
// binnenstad (oost), gebouwd van 1939 tot 1943, in april 1945 opgeblazen en in
// 1948 volgens het oorspronkelijke ontwerp herbouwd. Van west naar oost: het
// westelijke landhoofd, de aanbrug over de uiterwaard en de nevengeul (twee
// doorgaande stalen volwandige hoofdliggers over zes velden op gemetselde
// pijlers met betonnen opleggingen), de stalen boogbrug van 121 m over het
// zomerbed (twee rechtopstaande boogribben boven de liggers met verticale
// hangers, eindportalen en een ruitvormig windverband tussen de ribben), de
// scheve gemetselde rivierpijler aan de Welle met trappen aan beide kanten, en
// de gebogen betonnen aanbrug naar de stad op ronde kolommen (boven de
// parkeergarage in de gedempte rivierhaven). Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, de
// materiaalklasse in de nodenaam: de constructie als building, de bovenste
// 0,5 m van het wegdek en van de trappen als road-nodes met de BGT-attributen)
// als catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal> met de brug als geheel en een printvoet onder het
// dek.
//
//   node scripts/generate-wilhelminabrug-deventer.mjs              # STL op 1:1600 (standaard, 368 mm)
//   node scripts/generate-wilhelminabrug-deventer.mjs --scale 1000
//
// Bouwstelsel: s langs de brug vanaf het westelijke begin van het BGT-dek
// (RD 207352,11, 473527,40) naar het oostnoordoosten (RD-richting 34,66 graden
// vanaf het oosten, langs de randen van het BGT-dek), t dwars erop naar het
// noordnoordwesten (stroomafwaarts), gemeten vanaf de zuidrand van het dek;
// z = NAP-hoogte min de waterspiegel van de IJssel zoals het PDOK-terrein die
// legt (46,36 m ellipsoïdisch, NAP +3,08 m). Vanaf s = 417,5 buigt de brug
// met een straal van 1300 m (op de as t = 9,5) naar rechts af, zoals de randen
// van het BGT-dek: het hele model wordt in het rechte stelsel gebouwd en aan
// het eind langs die boog gebogen. Daarna schuift alles naar de oorsprong op
// de as tussen de hoofdliggers midden tussen de opleggingen van de boog
// (s = 351,25, t = 9,425; RD 207635,67, 473734,91): +X langs de brug naar de
// stad, +Y stroomafwaarts naar het noordnoordwesten.
//
// Bronnen: BGT overbruggingsdeel (de twee dekdelen, 18,8 m breed en 585 m
// lang; het westelijke landhoofd; de wandpijlers op s = 49,5 en 209,45; de
// drie brede pijlers met ronde koppen in de nevengeul op s = 89,6, 129,6 en
// 169,55; de rivierpijler L0002.886d36fa op s = 290,75; de scheve oostelijke
// rivierpijler L0002.ce8feb7a met de trapkoppen; de drie ronde kolommen van
// 3 m van de betonnen aanbrug), BGT wegdeel (voetpad, fietspad en rijbaan op
// het dek en voetpad op trap), AHN DSM 0,5 m (PDOK WCS) voor het lengteprofiel
// van het wegdek (NAP +10,2 m aan de westkant, +16,1 m onder de boog, +11,5 m
// aan de oostkant), de hoofdliggers (t = 4,4 en 14,45, bovenkant 1,0 m boven
// het wegdek), de boogribben (op de liggers, bovenrand een parabool met de top
// op NAP +33,3 m), de trappen en de bovenkant van de westelijke rivierpijler;
// PDOK-terrein voor de waterspiegel (NAP = ellipsoïdisch - 43,28 m op het
// maaiveld eromheen); PDOK-luchtfoto voor het windverband (dwarsstijlen op de
// knopen, diagonalen over twee velden), de portalen en de trapkoppen;
// Wikipedia (boogbrug, landhoofden en rivierpijlers met natuursteen, betonnen
// pijlers onder de toerit aan de stadskant, doorvaarthoogte NAP +13,73 m in
// het midden); Wikimedia Commons-foto's (Wilhelminabrug Deventer.jpg,
// Wilhelminabrug Deventer 2019.jpg, Wilhelminabrug Deventer, 2024.jpg,
// Wilhelminabrug - Deventer.jpg, Deventer-Bridge.jpg, Deventer-Bridge-
// Structure.jpg, Deventer, de Wilhelminabrug foto14 2013-08-01 12.58.jpg,
// Wilhelminabrugdeven.jpg, Molen Bolwerksmolen Wilhelminabrug.jpg, Onderzijde
// van N344 over de uiterwaard - Deventer - 20430074 - RCE.jpg, Detail van
// onderzijde van N344 over de uiterwaard - Deventer - 20430073 - RCE.jpg) voor
// de ribben, hangers, portalen, het windverband, de liggers, de pijlers met
// opleggingen en de kolommen van de betonnen aanbrug.
// Geschat: de constructiehoogte van het stalen dek (2,4 m onder het wegdek,
// uit de doorvaarthoogte), de dikte van de consoles aan de rand (0,7 m), de
// hoogte van de boogrib (1,6 m), het aantal velden (15 van 8,07 m, foto's), de
// vorm van de portalen (een dwarsregel met knieschoren), de hoogte van de
// opleggingen (1,6 m) op de aanbrugpijlers, de betonnen kap van de westelijke
// rivierpijler (NAP +11,0 tot +12,6 m), de bovenkant van de oostelijke
// rivierpijler (NAP +14,6 m), de doorsnede van de betonnen aanbrug (plaat
// 0,9 m, middenkoker 1,6 m), de vijf kolommen tussen s = 449 en 570 (niet in de
// BGT, op gelijke velden van 20,17 m zoals de drie gemeten kolommen), de
// kapitelen van de kolommen, het oostelijke landhoofd en de breedte van de
// toerit erachter (als het dek, 18,8 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1600"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "wilhelminabrug-deventer");
const mmPerMetre = 1000 / scale;
const SLUG = "wilhelminabrug-deventer";

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
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
// Polygoon in het tz-vlak, uitgetrokken langs s van s0 tot s1.
const profileS = (points, s0, s1) =>
  Manifold.extrude(new CrossSection([ccw(points)]), s1 - s0)
    .rotate([90, 0, 90])
    .translate([s0, 0, 0]);
// Band tussen twee functies van s (onder en boven) op de gegeven stations,
// uitgetrokken langs t.
const bandT = (ss, bottom, top, t0, t1) =>
  profileT([...ss.map((s) => [s, bottom(s)]), ...[...ss].reverse().map((s) => [s, top(s)])], t0, t1);
// Loft langs s: per station een convexe doorsnede in het tz-vlak (steeds
// evenveel punten).
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
// Staaf tussen twee punten (s, t, z): bovenkant vlak, onderkant als V van 50
// graden, zodat hij zonder steun print.
function vBar(p0, p1, width) {
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
    [p[0] + ns * h, p[1] + nt * h, p[2] - 0.4],
    [p[0] - ns * h, p[1] - nt * h, p[2] - 0.4],
    [p[0], p[1], p[2] - 0.4 - vee],
  ];
  return Manifold.hull([...section(p0), ...section(p1)]);
}
// Pijler met ronde koppen: rechte zijden op s = sc ± half van t0 + half tot
// t1 - half, daarbuiten halve cirkels.
function stadium(sc, half, t0, t1, z0, z1) {
  const r = half;
  return Manifold.hull([
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([sc, t0 + r, z0]),
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([sc, t1 - r, z0]),
  ]);
}

// ---------- hoofdmaten ----------
// PDOK legt de IJssel en de nevengeul bij de brug op 46,36 tot 46,47 m
// ellipsoïdisch; op het maaiveld eromheen ligt het PDOK-terrein 43,28 m boven
// het AHN (NAP).
const WATER_NAP = 3.08;
const Z = (nap) => +(nap - WATER_NAP).toFixed(4);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten (de
// nevengeul), als vaste terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 46.36;
const ORIGIN_ST = [351.25, 9.425]; // oorsprong in het bouwstelsel
const ORIGIN_RD = [207635.67, 473734.91];
const X_AXIS = [0.82254, 0.56871];

// Bocht van de betonnen aanbrug (BGT-dekranden): vanaf s = 417,5 een boog met
// een straal van 1300 m op de lijn t = 9,5, naar rechts (naar -t).
const BEND = { s0: 417.5, radius: 1300, t: 9.5 };
function bend(v) {
  const s = v[0];
  if (s <= BEND.s0) return;
  const th = (s - BEND.s0) / BEND.radius;
  const tr = v[1] - BEND.t;
  v[0] = BEND.s0 + BEND.radius * Math.sin(th) + tr * Math.sin(th);
  v[1] = BEND.t - BEND.radius * (1 - Math.cos(th)) + tr * Math.cos(th);
}
const place = (solid) => solid.warp(bend).translate([-ORIGIN_ST[0], -ORIGIN_ST[1], 0]);

// Wegdek in NAP-meters om de 5 m vanaf s = -5 tot 625: 25e percentiel van het
// AHN-DSM over t = 6 tot 13 en 5 m langs de (gebogen) as, mediaan over 15 m
// (verkeer, hangers en lantaarns vallen zo weg).
const ROAD_S0 = -5;
const ROAD_STEP = 5;
const ROAD_NAP = [
  10.23, 10.29, 10.36, 10.46, 10.54, 10.64, 10.73, 10.83, 10.92, 11.04, 11.12, 11.22, 11.32, 11.41, 11.5, 11.6,
  11.69, 11.79, 11.88, 11.98, 12.07, 12.16, 12.24, 12.33, 12.42, 12.52, 12.61, 12.71, 12.8, 12.88, 12.97, 13.07,
  13.15, 13.25, 13.33, 13.44, 13.53, 13.62, 13.7, 13.8, 13.89, 13.97, 14.06, 14.15, 14.24, 14.33, 14.41, 14.51,
  14.59, 14.67, 14.76, 14.85, 14.92, 14.99, 15.06, 15.16, 15.24, 15.33, 15.43, 15.51, 15.62, 15.69, 15.77, 15.88,
  15.91, 15.98, 16.05, 16.09, 16.09, 16.11, 16.12, 16.14, 16.14, 16.11, 16.08, 16.08, 16.04, 16.02, 15.98, 15.91,
  15.84, 15.75, 15.69, 15.61, 15.52, 15.43, 15.35, 15.24, 15.14, 15.03, 14.93, 14.81, 14.69, 14.57, 14.45, 14.35,
  14.24, 14.12, 14.01, 13.89, 13.77, 13.66, 13.55, 13.43, 13.31, 13.19, 13.09, 12.98, 12.88, 12.76, 12.63, 12.52,
  12.4, 12.29, 12.17, 12.05, 11.91, 11.79, 11.66, 11.52, 11.4, 11.27, 11.15, 11.03, 10.92, 10.81, 10.7,
];
const roadNap = (s) => {
  const f = clamp((s - ROAD_S0) / ROAD_STEP, 0, ROAD_NAP.length - 1);
  const i = Math.min(Math.floor(f), ROAD_NAP.length - 2);
  return lerp(ROAD_NAP[i], ROAD_NAP[i + 1], f - i);
};
const road = (s) => Z(roadNap(s));
// Stations: begin, eind en elke `step` meter op het raster van het
// lengteprofiel daartussen, zodat de knikken van het wegdek een station hebben.
function stations(s0, s1, step = 2.5) {
  const ss = [s0];
  for (let s = ROAD_S0 + Math.ceil((s0 - ROAD_S0) / step + 1e-9) * step; s < s1 - 1e-6; s += step) {
    if (s - ss[ss.length - 1] > 1e-3) ss.push(s);
  }
  if (s1 - ss[ss.length - 1] > 1e-3) ss.push(s1);
  return ss;
}
const loftAlong = (s0, s1, sectionAt, label, step = 2.5) =>
  loftS(stations(s0, s1, step).map((s) => ({ s, section: sectionAt(s) })), label);
const minRoad = (s0, s1) => Math.min(road(s0), road(s1), road((s0 + s1) / 2));

// Lengte-indeling (s, BGT).
const WEST_END = -0.3; // achterkant van het westelijke landhoofd, begin van dek en liggers
const WEST_FACE = 10.9; // voorzijde van het westelijke landhoofd
const STEEL_END = 414.9; // einde van de stalen liggers, begin van de betonnen aanbrug (BGT-grens van de wegdelen)
const EAST_FACE = 584.7; // einde van het BGT-dek
// Achter het landhoofd ligt de weg nog 40 m op een gesloten toerit tussen
// keermuren (AHN: wegdek NAP +11,5 m bij s = 590 tot +10,7 m bij s = 625, het
// maaiveld ernaast op NAP +6,5 m); daarna loopt hij in het PDOK-terrein door.
const EAST_END = 625.0;
// Dekranden (BGT): 18,8 m breed over de hele lengte.
const DECK = { t0: 0.0, t1: 18.8 };

// Stalen dek: twee volwandige hoofdliggers (AHN t = 4,4 en 14,45; de BGT-
// wegdelen laten er een strook van 1,0 m voor vrij), 1,0 m breed met de
// bovenkant 1,0 m boven het wegdek (AHN) en de onderkant 2,4 m eronder (uit de
// doorvaarthoogte NAP +13,73 m onder het wegdek op NAP +16,1 m). Ertussen de
// rijbaan op dwarsdragers; erbuiten fietspad en voetpad op consoles, aan de
// rand 0,7 m dik.
const GIRDER = { centres: [4.4, 14.45], half: 0.5, top: 1.0, depth: 2.4 };
const CONSOLE_EDGE = 0.7;
const girderBottom = (s) => road(s) - GIRDER.depth;
const girderTop = (s) => road(s) + GIRDER.top;

// Betonnen aanbrug: dekplaat van 0,9 m over de hele breedte met een
// middenkoker tot 1,6 m onder het wegdek; op de plaats van de liggers lage
// scheidingen van 0,3 m tussen rijbaan en fietspaden (AHN, BGT-stroken).
const CONCRETE = { slab: 0.9, box: [3.0, 15.8], boxDepth: 1.6, kerb: 0.3 };
// Ronde kolommen van 3 m (BGT, op s = 428,78, 448,92 en 569,95 en t = 9,5 tot
// 10,2), de vijf daartussen op gelijke velden geschat; kapiteel als kegel van
// 49 graden tot 2,7 m straal onder de koker.
const COLUMN = { r: 1.5, capR: 2.7, capH: 1.4, t: 9.75 };
const COLUMNS = [428.78, ...Array.from({ length: 7 }, (_, k) => 448.92 + ((569.95 - 448.92) * k) / 6)];

// Aanbrugpijlers (BGT): wandpijlers van 2,7 tot 2,8 m dik met ronde koppen
// binnen de dekbreedte, en drie brede pijlers van 8,9 m met ronde koppen tot
// 4,9 m buiten de dekranden in de nevengeul. Het metselwerk eindigt 1,6 m onder
// de liggers; daarop onder elke ligger een betonnen oplegging van 1,6 × 1,8 m
// (foto's).
const WALL_PIERS = [
  { s: 49.5, half: 1.4, t0: 1.4, t1: 17.3 },
  { s: 209.45, half: 1.35, t0: 1.6, t1: 17.2 },
];
const BROAD_PIERS = [89.6, 129.6, 169.55].map((s) => ({ s, half: 4.45, t0: -4.9, t1: 23.9 }));
const PEDESTAL = { height: 1.6, halfS: 0.8, halfT: 0.9 };
// Westelijke rivierpijler (BGT) met ronde koppen; metselwerk tot NAP +11,0 m,
// daarop een betonnen kap 0,3 m terug tot NAP +12,6 m (AHN, foto's) en de
// opleggingen.
const ARCH_PIER = { s: 290.75, half: 2.55, t0: -0.6, t1: 19.5, brick: Z(11.0), cap: Z(12.6), inset: 0.3 };
// Oostelijke rivierpijler aan de Welle (BGT, vereenvoudigd tot 15 cm): scheef
// op de brug, evenwijdig aan de stroming, met de trapkoppen aan beide
// dekranden. Binnen de dekbreedte tot NAP +15,0 m, in het dek: de onderkant
// van plaat en consoles ligt daar 0,1 tot 0,6 m lager, zodat er geen vlakken
// samenvallen.
const EAST_PIER = [
  [421.59, 2.08], [414.12, 20.5], [413.5, 21.21], [412.9, 21.65], [411.68, 21.99], [405.06, 21.88], [404.35, 21.64],
  [403.69, 20.96], [403.17, 19.8], [403.22, 18.7], [411.38, 2.15], [412.17, 0.07], [413.75, -2.6], [419.49, -3.14],
  [420.27, -2.95], [421.7, -1.68], [422.05, -0.78],
];
const EAST_PIER_TOP = Z(15.0);
// Trappen op de koppen (AHN, BGT voetpad op trap): aan de noordkant dalend
// naar het westen van het wegdek bij s = 411 naar een bordes op NAP +12,2 m,
// aan de zuidkant dalend naar het oosten van het wegdek bij s = 414 naar een
// bordes op NAP +12,9 m.
const STAIR_N = { s0: 403.0, s1: 415.0, t0: DECK.t1, t1: 22.5, low: Z(12.2), lowS: 404.5, highS: 411.0 };
const STAIR_S = { s0: 412.0, s1: 422.3, t0: -3.5, t1: DECK.t0, low: Z(12.9), lowS: 420.0, highS: 414.0 };
const stairTopN = (s) =>
  s <= STAIR_N.lowS ? STAIR_N.low : s >= STAIR_N.highS ? road(s) - 0.02 : lerp(STAIR_N.low, road(STAIR_N.highS) - 0.02, (s - STAIR_N.lowS) / (STAIR_N.highS - STAIR_N.lowS));
const stairTopS = (s) =>
  s >= STAIR_S.lowS ? STAIR_S.low : s <= STAIR_S.highS ? road(s) - 0.02 : lerp(road(STAIR_S.highS) - 0.02, STAIR_S.low, (s - STAIR_S.highS) / (STAIR_S.lowS - STAIR_S.highS));

// Boog: twee verticale ribben boven de hoofdliggers (AHN), 1,0 m breed en
// 1,6 m hoog (foto's), tussen de opleggingen op de rivierpijlers (s = 290,75 en
// 411,75). Bovenrand een parabool met de top op NAP +33,3 m bij s = 351,25
// (AHN). Vijftien velden van 8,07 m met op elke knoop een hanger: tussen ligger
// en rib een scherm met doorgaande openingen met een spitse top van 55 graden
// (de hangers als stijlen van 1,0 m). Portalen op de tweede knoop van elk eind
// (dwarsregel met knieschoren), en daartussen het windverband: dwarsstijlen op
// elke knoop en diagonalen over twee velden, zodat ruiten ontstaan (luchtfoto).
const ARCH = { s0: 290.75, s1: 411.75, crownNap: 33.3, crownS: 351.25, k: 0.0048, depth: 1.6, panels: 15, hanger: 1.0, pointed: 55, braceFrom: 2, braceTo: 13, brace: 0.9, portal: 1.2 };
const archTop = (s) => Z(ARCH.crownNap - ARCH.k * (s - ARCH.crownS) ** 2);
const archSlope = (s) => -2 * ARCH.k * (s - ARCH.crownS);
const archBottom = (s) => archTop(s) - ARCH.depth * Math.hypot(1, archSlope(s));
const ARCH_NODES = Array.from({ length: ARCH.panels + 1 }, (_, k) => ARCH.s0 + ((ARCH.s1 - ARCH.s0) * k) / ARCH.panels);

// ---------- dek ----------
const parts = [];
// Stalen dek: rijbaan tussen de liggers, de liggers en de consoles.
const [gS, gN] = GIRDER.centres;
parts.push(loftAlong(WEST_END, STEEL_END, (s) => [[gS, girderBottom(s)], [gN, girderBottom(s)], [gN, road(s)], [gS, road(s)]], "rijvloer"));
for (const tc of GIRDER.centres) {
  parts.push(
    loftAlong(WEST_END, STEEL_END, (s) => [[tc - GIRDER.half, girderBottom(s)], [tc + GIRDER.half, girderBottom(s)], [tc + GIRDER.half, girderTop(s)], [tc - GIRDER.half, girderTop(s)]], "hoofdligger"),
  );
}
parts.push(
  loftAlong(WEST_END, STEEL_END, (s) => [[DECK.t0, road(s) - CONSOLE_EDGE], [gS, girderBottom(s)], [gS, road(s)], [DECK.t0, road(s)]], "console zuid"),
  loftAlong(WEST_END, STEEL_END, (s) => [[gN, girderBottom(s)], [DECK.t1, road(s) - CONSOLE_EDGE], [DECK.t1, road(s)], [gN, road(s)]], "console noord"),
);
// Betonnen aanbrug: plaat, middenkoker en de lage scheidingen.
parts.push(
  loftAlong(STEEL_END - 0.05, EAST_FACE, (s) => [[DECK.t0, road(s) - CONCRETE.slab], [DECK.t1, road(s) - CONCRETE.slab], [DECK.t1, road(s)], [DECK.t0, road(s)]], "betonplaat"),
  loftAlong(STEEL_END - 0.05, EAST_FACE, (s) => [[CONCRETE.box[0], road(s) - CONCRETE.boxDepth], [CONCRETE.box[1], road(s) - CONCRETE.boxDepth], [CONCRETE.box[1], road(s) - 0.1], [CONCRETE.box[0], road(s) - 0.1]], "koker"),
);
const kerbAt = (tc, margin = 0) =>
  loftAlong(STEEL_END - margin, EAST_FACE + margin, (s) => [[tc - GIRDER.half - margin, road(s) - 1.1], [tc + GIRDER.half + margin, road(s) - 1.1], [tc + GIRDER.half + margin, road(s) + CONCRETE.kerb + margin], [tc - GIRDER.half - margin, road(s) + CONCRETE.kerb + margin]], "scheiding");
parts.push(...GIRDER.centres.map((tc) => kerbAt(tc)));
// Landhoofden: blokken tot het wegdek.
parts.push(
  loftAlong(WEST_END, WEST_FACE, (s) => [[DECK.t0, BASE], [DECK.t1, BASE], [DECK.t1, road(s)], [DECK.t0, road(s)]], "westelijk landhoofd"),
  loftAlong(EAST_FACE - 0.05, EAST_END, (s) => [[DECK.t0, BASE], [DECK.t1, BASE], [DECK.t1, road(s)], [DECK.t0, road(s)]], "oostelijk landhoofd en toerit"),
);

// ---------- pijlers ----------
const pedestals = (s, top) =>
  GIRDER.centres.map((tc) => boxFromTo(s - PEDESTAL.halfS, s + PEDESTAL.halfS, tc - PEDESTAL.halfT, tc + PEDESTAL.halfT, top - 0.05, girderBottom(s) + 0.05));
for (const p of [...WALL_PIERS, ...BROAD_PIERS]) {
  const top = minRoad(p.s - p.half, p.s + p.half) - GIRDER.depth - PEDESTAL.height;
  parts.push(stadium(p.s, p.half, p.t0, p.t1, BASE, top), ...pedestals(p.s, top));
}
{
  const p = ARCH_PIER;
  parts.push(
    stadium(p.s, p.half, p.t0, p.t1, BASE, p.brick),
    stadium(p.s, p.half - p.inset, p.t0 + p.inset, p.t1 - p.inset, p.brick - 0.05, p.cap),
    ...pedestals(p.s, p.cap),
  );
}
// Oostelijke rivierpijler binnen de dekbreedte, met de trapkoppen.
const eastPierPlan = new CrossSection([ccw(EAST_PIER)]);
const clipPlan = (t0, t1) =>
  eastPierPlan.intersect(new CrossSection([[[395, t0], [430, t0], [430, t1], [395, t1]]])).toPolygons().map((p) => p.map(([s, t]) => [s, t]));
const eastPierCore = union(clipPlan(DECK.t0, DECK.t1).map((p) => prism(p, BASE, EAST_PIER_TOP)));
parts.push(eastPierCore);
// De trapblokken lopen 0,5 m onder het dek door, zodat ze er een geheel mee
// vormen (alleen tegen de dekrand aan bleven ze een los deel).
const stairBlock = (stair, top) =>
  bandT(stations(stair.s0, stair.s1, 0.5), () => BASE, top, stair.t0 < 0 ? stair.t0 : stair.t0 - 0.5, stair.t0 < 0 ? stair.t1 + 0.5 : stair.t1).intersect(
    prism(EAST_PIER, BASE - 1, 40),
  );
const stairs = [stairBlock(STAIR_N, stairTopN), stairBlock(STAIR_S, stairTopS)];
parts.push(...stairs);
// Kolommen van de betonnen aanbrug met kapiteel.
for (const s of COLUMNS) {
  // Het kapiteel loopt tot onder het laagste punt van de koker en steekt er
  // daarboven 0,3 m in, zodat er geen spleet onder de koker overblijft.
  const under = minRoad(s - COLUMN.capR, s + COLUMN.capR) - CONCRETE.boxDepth;
  const into = Math.max(road(s - COLUMN.capR), road(s + COLUMN.capR)) - CONCRETE.boxDepth + 0.3;
  const capBottom = under - COLUMN.capH;
  parts.push(
    Manifold.cylinder(capBottom - BASE + 0.05, COLUMN.r, COLUMN.r, 32, false).translate([s, COLUMN.t, BASE]),
    Manifold.cylinder(COLUMN.capH, COLUMN.r, COLUMN.capR, 32, false).translate([s, COLUMN.t, capBottom]),
    Manifold.cylinder(into - under + 0.01, COLUMN.capR, COLUMN.capR, 32, false).translate([s, COLUMN.t, under - 0.01]),
  );
}

// ---------- boog: ribben met hangerscherm ----------
// De rib loopt van waar zijn bovenrand de bovenkant van de ligger raakt (vlak
// voor de opleggingen) en zit 0,2 m in de ligger.
function archEnd(side) {
  let lo = ARCH.crownS;
  let hi = ARCH.crownS + side * (ARCH.s1 - ARCH.s0);
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    if (archTop(m) > girderTop(m) + 0.05) lo = m;
    else hi = m;
  }
  return lo;
}
const archS0 = archEnd(-1);
const archS1 = archEnd(1);
const archXs = [archS0, ...stations(archS0, archS1, 0.5).slice(1, -1), archS1];
const openings = [];
for (let k = 0; k < ARCH.panels; k++) {
  const a = ARCH_NODES[k] + ARCH.hanger / 2;
  const b = ARCH_NODES[k + 1] - ARCH.hanger / 2;
  let shoulder = Infinity;
  for (let i = 0; i <= 200; i++) {
    const s = a + ((b - a) * i) / 200;
    shoulder = Math.min(shoulder, archBottom(s) - 0.05 - Math.tan(rad(ARCH.pointed)) * Math.min(s - a, b - s));
  }
  const floor = Math.min(girderTop(a), girderTop(b)) - 0.03;
  if (shoulder < Math.max(girderTop(a), girderTop(b)) + 1.0) continue;
  const apex = shoulder + (Math.tan(rad(ARCH.pointed)) * (b - a)) / 2;
  openings.push([[a, floor], [b, floor], [b, shoulder], [(a + b) / 2, apex], [a, shoulder]]);
}
const ribs = GIRDER.centres.map((tc) => {
  const t0 = tc - GIRDER.half;
  const t1 = tc + GIRDER.half;
  return bandT(archXs, (s) => girderTop(s) - 0.2, archTop, t0, t1).subtract(union(openings.map((p) => profileT(p, t0 - 0.5, t1 + 0.5))));
});
parts.push(...ribs);
// Windverband tussen de toppen van de ribben: dwarsstijlen op de knopen 2 tot
// en met 13 en diagonalen over twee velden (ruiten), als staven met een
// V-onderkant op 0,15 m onder de bovenrand van de rib.
const braceNodes = ARCH_NODES.slice(ARCH.braceFrom, ARCH.braceTo + 1);
const at = (s, t) => [s, t, archTop(s) - 0.15];
const braces = [];
for (const s of braceNodes) braces.push(vBar(at(s, gS), at(s, gN), ARCH.brace));
for (let i = 0; i + 2 < braceNodes.length; i++) {
  braces.push(vBar(at(braceNodes[i], gS), at(braceNodes[i + 2], gN), ARCH.brace));
  braces.push(vBar(at(braceNodes[i], gN), at(braceNodes[i + 2], gS), ARCH.brace));
}
parts.push(...braces);
// Portalen op de tweede knoop van elk eind: een dwarsregel onder de rib met
// een V-onderkant en aan beide kanten een knieschoor (onderkant 50 graden)
// tegen de hanger.
const portals = [ARCH_NODES[ARCH.braceFrom], ARCH_NODES[ARCH.braceTo]].map((s) => {
  const zb = archBottom(s);
  const beam = vBar([s, gS, zb + 0.6], [s, gN, zb + 0.6], ARCH.portal);
  const zt = zb + 0.2;
  const drop = 2.6;
  const reach = drop / Math.tan(rad(50));
  const knees = [
    profileS([[gS, zt], [gS, zt - drop], [gS + GIRDER.half, zt - drop], [gS + GIRDER.half + reach, zt]], s - 0.4, s + 0.4),
    profileS([[gN, zt], [gN - GIRDER.half - reach, zt], [gN - GIRDER.half, zt - drop], [gN, zt - drop]], s - 0.4, s + 0.4),
  ];
  return union([beam, ...knees]);
});
parts.push(...portals);

const bridge = union(parts);

// ---------- printvoet (alleen in de STL) ----------
// Onder het dek: een wig van 50 graden vanaf de randen die uitloopt in een
// scherm tot de onderplaat, tussen de landhoofden.
const KNEE = rad(50);
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const edgeBottom = (s) => road(s) - (s < STEEL_END ? CONSOLE_EDGE : CONCRETE.slab);
const footXs = [...stations(WEST_FACE, EAST_FACE, 0.5), STEEL_END - 0.01, STEEL_END + 0.01]
  .filter((s) => s !== STEEL_END)
  .sort((a, b) => a - b)
  .filter((s, i, xs) => i === 0 || s - xs[i - 1] > 1e-4);
const printFoot = loftS(
  footXs.map((s) => {
    const c = (DECK.t0 + DECK.t1) / 2;
    const w = (DECK.t1 - DECK.t0) / 2;
    const zb = edgeBottom(s) - 0.02;
    const zIn = road(s) - 0.3;
    const hit = w - (zb - BASE) / Math.tan(KNEE);
    const section =
      hit > SCREEN
        ? [[c - hit, BASE], [c + hit, BASE], [c + hit + 1e-3, BASE + 1e-3], [c + w, zb], [c + w, zIn], [c - w, zIn], [c - w, zb], [c - hit - 1e-3, BASE + 1e-3]]
        : [[c - SCREEN, BASE], [c + SCREEN, BASE], [c + SCREEN, zb - Math.tan(KNEE) * (w - SCREEN)], [c + w, zb], [c + w, zIn], [c - w, zIn], [c - w, zb], [c - SCREEN, zb - Math.tan(KNEE) * (w - SCREEN)]];
    return { s, section };
  }),
  "printvoet",
);
const printModel = union([bridge, printFoot]);

// ---------- wegdek en trappen als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is een eigen node per BGT-functie met de
// attributen van het wegdeel eronder (glTF `extras.attributes`), zodat de
// kleurregels van een thema op het brugdek werken zoals op de PDOK-wegdelen.
// Pas na het printmodel gebouwd, zodat de STL de brug als geheel houdt.
//
// Actuele BGT-wegdelen met relatieve hoogteligging 1 op het dek, alle
// gesloten verharding, over de stalen brug (s = -0,3 tot 414,9):
// G0150.5256211195af4e75b107c0645ef68828, G0150.71274d185de04a46af6e6eeec57083ca,
// G0150.00212fc6d9ed4122bc69fe5e5d628d8b, G0150.be13d1f35f30435095ff006379e521ed
// en G0150.c63171d7dbb440dea176d9797715d980 (rijbaan lokale weg, asfalt, tussen
// de liggers, t = 4,9 tot 13,95); G0150.ad8d20b40a064ccebf7e4ff4767f2d3c,
// G0150.723fca6c2af64d51afdec4668eb13d13 en G0150.c61b0851c3554b28b0d5fce7ba6d53c7
// (fietspad zuid, t = 1,45 tot 3,9), G0150.6be8b84579074724bf2978ce0df92433,
// G0150.f3230c8a4de149a39e36c37911042b25 en G0150.3d99295c9a634bf8ab6659e106bdf603
// (fietspad noord, t = 14,95 tot 17,45), G0150.30863e44e8a94338b0f7044da19977df,
// G0150.fae9f4c7c55c4f368b7a82474fb2cffc en G0150.603bc96e3dee41b9b8709c006693545b
// (voetpad zuid, t = 0 tot 1,45), G0150.b35b0c79d1124143a4dcd764414bf9c0,
// G0150.4d8f5f7abca74feaaee9474b04ca7d82 en G0150.2d3deb4a612a475ebf3ac239ae3f809e
// (voetpad noord, t = 17,45 tot 18,8), fietspad en voetpad zonder materiaal.
// Over de betonnen aanbrug (s = 414,9 tot 584,7, in het gebogen stelsel
// dezelfde indeling, met de scheidingen op de plaats van de liggers):
// G0150.7f65b23145c04ded98df9530f5ff09f3 en G0150.1edbbe060dc64d49a5910dd79a86eaa6
// (rijbaan lokale weg), G0150.1ce0f76c43214f15b098e3cba774551a en
// G0150.9d792d4b6749435fb08325d521387baf (fietspad), G0150.66255cb6ea054c449937e1aa40934eb5
// en G0150.4652ad000ced4302bb377cf294f7c363 (voetpad), alle met asfalt. Op de
// trappen L0002.d25a52d628d94496a070a9111ed08214 (noord) en
// L0002.614bb539db8f4a518705e7f631106c11 (zuid): voetpad op trap, gesloten
// verharding. De grenzen volgen de constructie: rijbaan tussen de liggers of
// scheidingen, fietspaden tot t = 1,45 en 17,45, voetpaden tot de dekranden.
const LAYER = 0.5;
const ABOVE = 1.0;
const PAVED = { bgt_fysiekvoorkomen: "gesloten verharding" };
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", ...PAVED, plus_fysiekvoorkomen: "asfalt" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", ...PAVED };
const FOOT_ATTRIBUTES = { bgt_functie: "voetpad", ...PAVED };
const BIKE_EAST_ATTRIBUTES = { bgt_functie: "fietspad", ...PAVED, plus_fysiekvoorkomen: "asfalt" };
const FOOT_EAST_ATTRIBUTES = { bgt_functie: "voetpad", ...PAVED, plus_fysiekvoorkomen: "asfalt" };
const STAIR_ATTRIBUTES = { bgt_functie: "voetpad op trap", ...PAVED };
const LANES = { footSouth: 1.45, footNorth: 17.45 };
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek over dezelfde stations
// als het dek, 0,4 m voorbij de dekranden en voorbij beide landhoofden. Langs
// de trappen eindigt hij 0,3 m voorbij de dekrand (op de dekrand zelf hield de
// rand van het dek een vlak zonder dikte over); daar begint de strook van de
// trap.
const stripPiece = (s0, s1, t0, t1) =>
  loftAlong(s0, s1, (s) => [[t0, road(s) - LAYER], [t1, road(s) - LAYER], [t1, road(s) + ABOVE], [t0, road(s) + ABOVE]], "snijstrook");
const STAIR_JOIN = 0.3;
const stairZone = (stair) =>
  boxFromTo(stair.s0, stair.s1, stair.t0 < 0 ? -30 : stair.t0 + STAIR_JOIN, stair.t0 < 0 ? stair.t1 - STAIR_JOIN : 50, BASE - 2, 60);
const stairZones = union([stairZone(STAIR_N), stairZone(STAIR_S)]);
const deckStrip = stripPiece(WEST_END - 2, EAST_END + 2, DECK.t0 - 0.4, DECK.t1 + 0.4).subtract(stairZones);
const stairStrip = union(
  [
    [STAIR_N, stairTopN],
    [STAIR_S, stairTopS],
  ].map(([stair, top]) =>
    bandT(stations(stair.s0, stair.s1, 0.5), (s) => top(s) - LAYER, (s) => top(s) + ABOVE, stair.t0 < 0 ? stair.t0 - 0.5 : stair.t0, stair.t0 < 0 ? stair.t1 : stair.t1 + 0.5).intersect(stairZone(stair)),
  ),
);
// Wat door de laag steekt blijft constructie, met 2 cm vrij: de hoofdliggers
// met de ribben en het hangerscherm erop (de hele strook van de ligger) en de
// scheidingen op de betonnen aanbrug.
const G = 0.02;
const guards = GIRDER.centres.map((tc) =>
  bandT(stations(WEST_END - G, EAST_FACE + G), (s) => road(s) - LAYER - 0.5, (s) => road(s) + ABOVE + 0.5, tc - GIRDER.half - G, tc + GIRDER.half + G),
);
const notLayer = union(guards);
const deckLayer = deckStrip.subtract(notLayer);
const zone = (s0, s1, t0, t1) => boxFromTo(s0, s1, t0, t1, BASE - 2, 60);
const FAR_S0 = WEST_END - 10;
const FAR_S1 = EAST_END + 10;
const roadZone = zone(FAR_S0, FAR_S1, gS, gN);
const bikeZone = (s0, s1) => union([zone(s0, s1, LANES.footSouth, gS), zone(s0, s1, gN, LANES.footNorth)]);
const footZone = (s0, s1) => union([zone(s0, s1, -30, LANES.footSouth), zone(s0, s1, LANES.footNorth, 50)]);
const cuts = {
  road: deckLayer.intersect(roadZone),
  bike: deckLayer.intersect(bikeZone(FAR_S0, STEEL_END)),
  foot: deckLayer.intersect(footZone(FAR_S0, STEEL_END)),
  bikeEast: deckLayer.intersect(bikeZone(STEEL_END, FAR_S1)),
  footEast: deckLayer.intersect(footZone(STEEL_END, FAR_S1)),
  stair: stairStrip,
};
const layer = union([deckLayer, stairStrip]);
const structure = bridge.subtract(layer);
const pieces = [
  [`building:${SLUG}`, structure],
  ["road:rijbaan", cuts.road.intersect(bridge), ROAD_ATTRIBUTES],
  ["road:fietspad", cuts.bike.intersect(bridge), BIKE_ATTRIBUTES],
  ["road:voetpad", cuts.foot.intersect(bridge), FOOT_ATTRIBUTES],
  ["road:fietspad-aanbrug", cuts.bikeEast.intersect(bridge), BIKE_EAST_ATTRIBUTES],
  ["road:voetpad-aanbrug", cuts.footEast.intersect(bridge), FOOT_EAST_ATTRIBUTES],
  ["road:trap", cuts.stair.intersect(bridge), STAIR_ATTRIBUTES],
];
// Partitiecontrole: de onderdelen tellen op tot de brug als geheel.
const partition = {
  bridgeM3: +bridge.volume().toFixed(3),
  partsM3: +pieces.reduce((sum, [, solid]) => sum + solid.volume(), 0).toFixed(3),
};
partition.diffM3 = +(partition.partsM3 - partition.bridgeM3).toFixed(4);
if (Math.abs(partition.diffM3) > 0.01) throw new Error(`onderdelen tellen niet op: ${JSON.stringify(partition)}`);
const named = pieces.map(([name, solid, attributes]) => [name, place(solid), attributes]);

// ---------- controles ----------
for (const [name, solid] of [["model", bridge], ["print", printModel], ...named]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  if (solid.isEmpty()) throw new Error(`${name}: leeg`);
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-4) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
function overhangArea(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const st = mesh.numProp;
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * st + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(n[0], n[1], n[2]);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
  }
  return area;
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
report.arch = {
  crownNap: ARCH.crownNap,
  crownZ: +archTop(ARCH.crownS).toFixed(2),
  ribEndsX: [archS0, archS1].map(local),
  hangerNodesX: ARCH_NODES.slice(1, -1).map(local),
  hangerOpenings: openings.length,
  braceNodesX: braceNodes.map(local),
  braces: braces.length,
  portalClearanceM: +(archBottom(ARCH_NODES[ARCH.braceFrom]) - 0.515 - road(ARCH_NODES[ARCH.braceFrom])).toFixed(2),
};
report.piers = {
  wallX: WALL_PIERS.map(({ s }) => local(s)),
  broadX: BROAD_PIERS.map(({ s }) => local(s)),
  archPierX: local(ARCH_PIER.s),
  columnsX: COLUMNS.map(local),
};
report.overhang = { modelM2: Math.round(overhangArea(bridge)), printM2: +overhangArea(printModel).toFixed(1) };
report.partition = partition;
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(named, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: named.map(([name]) => name) };

const stlName = `${SLUG}-1-${scale}.stl`;
const printSolid = place(printModel).translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Wilhelminabrug Deventer 1:${scale} mm Z-up`);
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
// Maaiveld alleen op het water: de nevengeul (s = 110 en 150) en de IJssel
// (s = 305 tot 390), 15 m ten zuiden van de zuidrand en 11,2 m ten noorden van
// de noordrand van het dek.
const samplePoints = [110, 150, 305, 330, 370, 390].flatMap((s) => [
  [local(s), +(-15 - ORIGIN_ST[1]).toFixed(3)],
  [local(s), +(30 - ORIGIN_ST[1]).toFixed(3)],
]);
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: "Wilhelminabrug Deventer",
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN_RD,
      xAxis: X_AXIS,
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "L0002.53f1fbcd168c4728bf5301e16512cee4",
        "L0002.541e5d66525442e6a26378fdbe1c0a17",
        "L0002.7974c85cf0da40009ed2fbe6affcd706",
        "L0002.96cc4bbed0754552a0bbf36362e34c09",
        "L0002.d5b72221309c4b5794e4297a7efeaf13",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as tussen de twee hoofdliggers midden tussen de opleggingen van de boog op de waterspiegel van de IJssel (z = 0, NAP +3,08 m zoals het PDOK-terrein) in de oorsprong, +X langs de brug naar het oostnoordoosten (de binnenstad, RD-richting 34,66 graden vanaf het oosten) en +Y stroomafwaarts naar het noordnoordwesten; vanaf x = 66,25 buigt de betonnen aanbrug met een straal van 1300 m naar rechts af. Zeven nodes: road:rijbaan, road:fietspad, road:voetpad, road:fietspad-aanbrug, road:voetpad-aanbrug en road:trap, de bovenste 0,5 m van het wegdek en van de twee trappen met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan lokale weg, fietspad, voetpad of voetpad op trap, bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt op de rijbaan en op fietspad en voetpad van de betonnen aanbrug; de rijbaan tussen de hoofdliggers of de scheidingen, de fietspaden erbuiten tot 1,45 m van de dekranden, de voetpaden langs de randen), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk van het westelijke landhoofd bij De Worp (x = -351,55) tot het eind van de gesloten toerit achter het landhoofd aan de stadskant (x = 274,35 langs de boog), met het wegdek op NAP +10,2 tot +16,1 m (AHN). De stalen aanbrug over uiterwaard en nevengeul met twee doorgaande hoofdliggers (1,0 m boven het wegdek) en consoles voor fietspad en voetpad, op twee wandpijlers en drie brede pijlers met ronde koppen (BGT) met betonnen opleggingen; de boogbrug van 121 m als twee boogribben van 1,6 m op de liggers met de top op NAP +33,3 m, de 14 hangers als stijlen van 1,0 m tussen spitse openingen, portalen met knieschoren op de tweede knoop van elk eind en het ruitvormige windverband tussen de ribben als staven met een V-onderkant; de westelijke rivierpijler met ronde koppen, metselwerk en betonnen kap; de scheve oostelijke rivierpijler aan de Welle met de twee trappen op de koppen; de gebogen betonnen aanbrug met plaat, middenkoker, lage scheidingen en acht ronde kolommen met kapiteel; het oostelijke landhoofd met de toerit tussen keermuren (40 m, wegdek NAP +11,5 tot +10,7 m), die boven het lagere PDOK-wegdek uitkomt. Leuningen, lantaarns, de onderhoudsbordessen onder het dek bij de westelijke rivierpijler en de doorgang door de oostelijke pijler zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water van de nevengeul en de IJssel bemonsterd; groundHeight is de ellipsoïdische PDOK-hoogte van de nevengeul. Geen BAG-pand: het pand onder de betonnen aanbrug (0150100000059728) blijft onder het dek staan. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_END - WEST_END).toFixed(1),
        deckWidthM: +(DECK.t1 - DECK.t0).toFixed(2),
        archSpanBearingsM: +(ARCH.s1 - ARCH.s0).toFixed(2),
        archCrownNapM: ARCH.crownNap,
        archRibsApartM: +(gN - gS).toFixed(2),
        hangerPanelM: +((ARCH.s1 - ARCH.s0) / ARCH.panels).toFixed(3),
        approachSpansM: [WEST_FACE, ...WALL_PIERS.map(({ s }) => s), ...BROAD_PIERS.map(({ s }) => s), ARCH_PIER.s]
          .sort((a, b) => a - b)
          .slice(1)
          .map((s, i, xs) => +(s - (i === 0 ? WEST_FACE : xs[i - 1])).toFixed(1)),
        concreteSpanM: +((569.95 - 448.92) / 6).toFixed(2),
        bendRadiusM: BEND.radius,
        roadNapM: { west: ROAD_NAP[1], crest: 16.14, east: ROAD_NAP[ROAD_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Wilhelminabrug_(Deventer)",
        "PDOK BGT overbruggingsdeel (dek, landhoofd, pijlers, kolommen) en wegdeel (rijbaan, fietspad, voetpad, voetpad op trap), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de hoofdliggers, de boogribben, de trappen en de westelijke rivierpijler",
        "PDOK Luchtfoto RGB (Actueel_orthoHR) voor het windverband, de portalen en de trapkoppen",
        "Wikimedia Commons: Wilhelminabrug Deventer.jpg; Wilhelminabrug Deventer 2019.jpg; Wilhelminabrug Deventer, 2024.jpg; Wilhelminabrug - Deventer.jpg; Deventer-Bridge.jpg; Deventer-Bridge-Structure.jpg; Deventer, de Wilhelminabrug foto14 2013-08-01 12.58.jpg; Wilhelminabrugdeven.jpg; Molen Bolwerksmolen Wilhelminabrug.jpg; Onderzijde van N344 over de uiterwaard - Deventer - 20430074 - RCE.jpg; Detail van onderzijde van N344 over de uiterwaard - Deventer - 20430073 - RCE.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van de Oude IJsselbrug bij
// Zutphen: de verkeersbrug over de IJssel tussen De Hoven (west) en Zutphen
// (oost), na de vernielingen van 1940 en 1945 hersteld en daarna verbouwd. Van
// west naar oost: de aanbrug over de uiterwaard (zeven velden op betonnen
// wandpijlers, met een stalen vakwerkligger aan beide kanten van de rijbaan),
// de trap aan de zuidkant naar de oever, de hefbrug met twee heftorens, het
// bedieningshuis aan de zuidkant van de westelijke toren, de stalen boogbrug
// met trekband van 89,7 m over het zomerbed (twee verticale boogribben met
// verticale hangers en een windverband tussen de toppen) en het korte veld naar
// de kade van Zutphen. Aan de zuidkant ligt over de rivier een voetpad buiten
// de boog. De IJsselspoorbrug ligt er direct ten noorden naast (op 0,6 m) en
// hoort niet in dit model: de gedeelde pijlers houden op aan de noordrand van
// het verkeersdek. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, de materiaalklasse in de nodenaam: de
// constructie als building, de bovenste 0,5 m van het dek als road:rijbaan,
// road:fietspad en road:voetpad met de BGT-attributen) als catalogusbron voor
// de export en de kaart, plus een binaire STL in millimeters op 1:<schaal> met
// de brug als geheel en een printvoet onder het dek.
//
//   node scripts/generate-oude-ijsselbrug-zutphen.mjs              # STL op 1:1000 (standaard)
//   node scripts/generate-oude-ijsselbrug-zutphen.mjs --scale 1250
//
// Bouwstelsel: s langs de brug vanaf het westelijke begin van het BGT-dek
// (RD 209598,74, 461884,40) naar het oosten (RD-richting 21,32 graden vanaf het
// oosten, langs de zuidrand van het BGT-dek), t dwars erop naar het
// noordnoordwesten (naar de spoorbrug), gemeten vanaf die zuidrand zoals het
// AHN hem ligt; z = NAP-hoogte min de waterspiegel van de IJssel zoals het
// PDOK-terrein die legt (48,09 m ellipsoïdisch, circa NAP +5,2 m). Aan het eind
// schuift alles naar de oorsprong op de as tussen de twee boogribben midden
// tussen de boogpijlers (s = 282,35, t = 6,97; RD 209859,23, 461993,56): +X
// langs de brug naar Zutphen, +Y naar het noordnoordwesten.
//
// Bronnen: BGT overbruggingsdeel (dek 340 m lang; de pijlers L0002.48e22921 op
// s = 197,5, de hefbrugpijlers L0002.522c1395 en L0002.467348cf met ronde
// koppen op s = 217,4 en 237,5, de boogpijler L0002.708639e0 op s = 327,2, het
// beweegbare dek van de spoorbrug op s = 220,5 tot 236,7 voor de hefbrug), BGT
// wegdeel (rijbaan, fietspad en voetpad op het dek), BAG-pand 0301100000025223
// (het bedieningshuis), AHN DSM 0,5 m (PDOK WCS) voor het lengteprofiel van het
// wegdek (NAP +11,6 m aan de westkant, +12,7 m onder de boog, +11,9 m aan de
// oostkant), de dekranden (aanbrug t = -0,6 tot 12,3; over de rivier het
// voetpad tot t = -3,8; bij de trap tot -5,5), de vakwerkliggers (t = 3,5 en
// 10,75, bovenkant 2,55 m boven het wegdek), de boogribben (t = 3,15 en 10,8,
// bovenrand een parabool met de top op NAP +25,25 m bij s = 281,9), de
// heftorens (NAP +22,8 m), het bedieningshuis (NAP +18,6 m) en de trap;
// PDOK-terrein voor de waterspiegel; Wikipedia (lengte 345 m, doorvaarthoogte
// 10,92 m, de indeling van het dek; van de spoorbrug ernaast: zeven velden op
// de westelijke aanbrug over 218 m, hoofdoverspanning 89 m); Wikimedia
// Commons-foto's (Zutphen ijsselbruecke.jpg, IJsselbrug Zutphen.jpg,
// Zutphen IJsselbrug.jpg, Enormous quantities of water passing through the
// IJselriver at the colourfull bridges of Zutphen - panoramio.jpg, Oude
// Ijsselbrug in 2019.jpg, Zutphen de Oude IJsselbrug IMG 8024 2021-02-12
// 12.40.jpg, Zutphen Oude IJsselbrug seen from Badhuisweg.jpg) voor de ribben
// en hangers, het windverband, de heftorens met het bedieningshuis, het
// vakwerk van de aanbrug en de pijlers.
// Geschat: de vijf aanbrugpijlers tussen het landhoofd en de BGT-pijler op
// s = 197,5 (zes gelijke velden van 32,9 m, zodat de aanbrug met het veld tot
// de hefbrugpijler zeven velden heeft zoals bij de spoorbrug; niet in de BGT en
// onder het dek niet in het AHN), het aantal hangers (twaalf velden van
// 7,475 m), de ribhoogte (1,5 m), het vakwerk van de aanbrug (velden van
// 2,4 m), de constructiehoogtes (aanbrug 1,4 m, hefbrug en boog 2,0 m met
// trekbanden van 2,2 m), de vorm van de heftorens (poort met een spitse
// doorgang; de bovenregel van 13 m tussen de torens is weggelaten), de onderkant
// van het bedieningshuis (NAP +15,0 m), de vorm van de trap en de koppen van
// de pijlers (tot onder het dek); de ellipsoïdische hoogte van NAP 0 (42,9 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "oude-ijsselbrug-zutphen");
const mmPerMetre = 1000 / scale;
const SLUG = "oude-ijsselbrug-zutphen";

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
// Staaf tussen twee punten: bovenkant vlak, onderkant als V van 50 graden,
// zodat hij zonder steun print.
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

// ---------- hoofdmaten ----------
const WATER_NAP = 5.2; // waterspiegel van de IJssel in het PDOK-terrein (48,09 m ellipsoïdisch)
const Z = (nap) => +(nap - WATER_NAP).toFixed(4);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten: het water
// van de IJssel naast de boog.
const GROUND_HEIGHT = 48.09;
const ORIGIN_ST = [282.35, 6.97]; // oorsprong in het bouwstelsel

// Wegdek in NAP-meters om de 10 m vanaf s = -5: 25e percentiel van het
// AHN-DSM over t = 5 tot 9 (de rijbaan), mediaan over 11 m en gemiddelde over
// 11 m (verkeer, hangers en lantaarns vallen zo weg); bij de heftorens
// geïnterpoleerd.
const ROAD_S0 = -5;
const ROAD_NAP = [
  11.6, 11.65, 11.73, 11.84, 11.94, 11.97, 12.02, 12.09, 12.11, 12.13, 12.18, 12.19, 12.2, 12.26, 12.29, 12.28,
  12.28, 12.31, 12.33, 12.36, 12.37, 12.37, 12.38, 12.4, 12.42, 12.52, 12.62, 12.7, 12.72, 12.7, 12.65, 12.55,
  12.4, 12.24, 12.06, 11.86,
];
const roadNap = (s) => {
  const f = clamp((s - ROAD_S0) / 10, 0, ROAD_NAP.length - 1);
  const i = Math.min(Math.floor(f), ROAD_NAP.length - 2);
  return lerp(ROAD_NAP[i], ROAD_NAP[i + 1], f - i);
};
const road = (s) => Z(roadNap(s));

// Lengte-indeling (s). De lofts van het dek hebben stations op oneven hele
// meters, zodat ze precies op de knikken van het wegdekprofiel liggen.
const WEST_END = -3; // achterkant westelijk landhoofd
const WEST_FACE = 1; // voorzijde westelijk landhoofd
const STAIR = { s0: 193, s1: 199, walk: 197, t0: -16.5, t1: -5.2, landing: -13.5, lowNap: 9.5 };
const WIDEN = { s0: 193, s1: 213 }; // verbreed dek bij de trap en het bedieningshuis
const MAIN_FROM = 215; // vanaf hier de diepere stalen dekken (hefbrug, boog)
const EAST_APPROACH = 327; // tot hier de boog, daarna het korte veld naar de kade
const EAST_FACE = 337;
const EAST_END = 341;
// Dekranden (AHN, t): de aanbrug van -0,6 tot 12,3; bij de trap en het
// bedieningshuis tot -5,5; over de rivier het voetpad buiten de boog tot -3,8.
const NORTH = 12.3;
const SOUTH = { approach: -0.6, widen: -5.5, river: -3.8 };
const southEdge = (s) => (s < WIDEN.s0 ? SOUTH.approach : s < WIDEN.s1 ? SOUTH.widen : SOUTH.river);
const SLAB = 0.6; // dekplaat
const APPROACH_DEPTH = 1.4; // dwarsdragers tussen de vakwerkliggers
const MAIN_DEPTH = 2.0; // stalen dek van hefbrug en boog
const TIE_DEPTH = 2.2; // trekbanden onder de ribben
const CANTILEVER = { edge: 1.2, root: 2.0 }; // voetpad buiten de zuidelijke rib

// Steunpunten (BGT): pijler op s = 197,5 (2 m dik), hefbrugpijlers met ronde
// koppen op 217,4 en 237,5 (6 m dik), boogpijler op 327,2 (3,8 m); vijf
// aanbrugpijlers geschat op gelijke velden tussen het landhoofd (s = 0) en de
// pijler op 197,5.
const APPROACH_PIERS = [...Array.from({ length: 5 }, (_, k) => (197.5 * (k + 1)) / 6), 197.5];
const WALL_PIER = { half: 1.0, t0: 1.6, cap: 1.3, capT0: 1.0, capDepth: 0.8 };
const LIFT_PIERS = [
  { s: 217.4, half: 3.0, t0: -0.1 },
  { s: 237.5, half: 3.0, t0: -0.2 },
];
const ARCH_PIER = { s: 327.2, half: 1.9, t0: 2.0 };

// Hefbrug: het beweegbare dek tussen de voegen (BGT, gelijk met de spoorbrug),
// twee heftorens als poorten over de rijbaan met een spitse doorgang en het
// bedieningshuis aan de zuidkant van de westelijke toren (BAG-pand).
const LIFT = { s0: 220.5, s1: 236.7 };
const TOWERS = [
  { s0: 215.0, s1: 220.0 },
  { s0: 235.0, s1: 237.6 },
];
const TOWER = { legs: [[2.6, 3.8], [9.9, 11.1]], topNap: 22.8, shoulderNap: 17.3, pointed: 55 };
const CABIN = { s0: 214.8, s1: 218.8, t0: -1.9, t1: 2.8, floorNap: 15.0, roofNap: 18.6, windows: [16.0, 17.6] };
const JOINT = { width: 0.4, depth: 0.3 };

// Aanbrug: twee stalen vakwerkliggers langs de rijbaan (AHN t = 3,5 en 10,75,
// 0,9 m breed op 1:1000), van het landhoofd tot de westelijke heftoren, met de
// bovenrand 2,55 m boven het wegdek (AHN) en de onderrand in de dwarsdragers.
// Warren-vakwerk met velden van 2,4 m: driehoeken met de punt omhoog zijn
// doorgaande openingen (flanken van 52 graden), die met een vlakke bovenkant
// blinde nissen van 0,3 m aan de buitenkant.
const TRUSS = { centres: [3.5, 10.75], width: 0.9, s0: 0, s1: 215.2, top: 2.55, chordTop: 0.6, chordLow: 0.4, panel: 2.4, bar: 0.5, niche: 0.3 };

// Boog: twee verticale ribben (AHN t = 3,15 en 10,8, 1,0 m breed) tussen de
// harten van de boogpijlers (s = 237,5 en 327,2). Bovenrand een parabool met
// de top op NAP +25,25 m bij s = 281,9 (AHN); de rib is 1,5 m hoog (foto's).
// Twaalf velden van 7,475 m met op elke knoop een verticale hanger: tussen dek
// en rib doorgaande openingen met een spitse top van 55 graden (de hangers als
// stijlen van 1,0 m). Windverband tussen de ribben waar de rib meer dan 6 m
// boven het wegdek ligt.
const ARCH = { s0: 237.5, s1: 327.2, crownNap: 25.25, crownS: 281.9, k: 0.00595, depth: 1.5, ribs: [3.15, 10.8], width: 1.0, panels: 12, hanger: 1.0, pointed: 55, floor: 0.6, braceClear: 6.0, braceWidth: 0.9 };
const archTop = (s) => Z(ARCH.crownNap - ARCH.k * (s - ARCH.crownS) ** 2);
const archSlope = (s) => -2 * ARCH.k * (s - ARCH.crownS);
const ribTop = (s) => Math.max(archTop(s), road(s) + 1.2);
const archBottom = (s) => archTop(s) - ARCH.depth * Math.hypot(1, archSlope(s));
const ARCH_NODES = Array.from({ length: ARCH.panels + 1 }, (_, k) => ARCH.s0 + ((ARCH.s1 - ARCH.s0) * k) / ARCH.panels);

// Schampkanten in plaats van de leuningen aan de zuidrand: 0,9 m breed en
// 0,6 m hoog (aan de noordrand is het voetpad te smal).
const KERB = { width: 0.9, height: 0.6 };

// ---------- dek ----------
const parts = [];
const slabSection = (t0) => (s) => [[t0, road(s) - SLAB], [NORTH, road(s) - SLAB], [NORTH, road(s)], [t0, road(s)]];
parts.push(loftAlong(WEST_END, WIDEN.s0, slabSection(SOUTH.approach), "dek aanbrug"));
parts.push(loftAlong(WIDEN.s0, WIDEN.s1, slabSection(SOUTH.widen), "dek bij de trap"));
parts.push(loftAlong(WIDEN.s1, EAST_END, slabSection(SOUTH.river), "dek over de rivier"));
// Onder de dekplaat: dwarsdragers en langsliggers tussen de randen van de
// rijbaan, op de aanbruggen 1,4 m en bij hefbrug en boog 2,0 m onder het wegdek.
const underSection = (t0, t1, depth) => (s) => [[t0, road(s) - depth], [t1, road(s) - depth], [t1, road(s) - SLAB + 0.1], [t0, road(s) - SLAB + 0.1]];
parts.push(loftAlong(WEST_END, MAIN_FROM, underSection(2.6, 11.4, APPROACH_DEPTH), "dwarsdragers aanbrug"));
parts.push(loftAlong(MAIN_FROM, EAST_APPROACH, underSection(2.4, 11.6, MAIN_DEPTH), "stalen dek"));
parts.push(loftAlong(EAST_APPROACH, EAST_END, underSection(2.6, 11.4, APPROACH_DEPTH), "dwarsdragers oostelijk veld"));
// Trekbanden onder de ribben.
for (const tc of ARCH.ribs) {
  parts.push(loftAlong(ARCH.s0 - 0.5, ARCH.s1 + 1.8, underSection(tc - 0.6, tc + 0.6, TIE_DEPTH), "trekband", 2));
}
// Het voetpad over de rivier als uitkraging buiten de zuidelijke rib: aan de
// rand 1,2 m diep (de randligger), bij de rib 2,0 m.
parts.push(
  loftAlong(
    WIDEN.s1,
    EAST_FACE,
    (s) => [[SOUTH.river, road(s) - CANTILEVER.edge], [2.6, road(s) - CANTILEVER.root], [2.6, road(s) - SLAB + 0.1], [SOUTH.river, road(s) - SLAB + 0.1]],
    "uitkraging voetpad",
  ),
);
// Landhoofden: blokken tot onder het wegdek.
const abutment = (s0, s1, t0) => loftAlong(s0, s1, (s) => [[t0, BASE], [NORTH, BASE], [NORTH, road(s) - 0.05], [t0, road(s) - 0.05]], "landhoofd");
parts.push(abutment(WEST_END, WEST_FACE, SOUTH.approach));
parts.push(abutment(EAST_FACE, EAST_END, SOUTH.river));

// ---------- pijlers ----------
const minRoad = (s0, s1) => Math.min(road(s0), road(s1), road((s0 + s1) / 2));
// Wandpijlers van de aanbrug met een kop van 2,6 m tot onder de dwarsdragers.
for (const sc of APPROACH_PIERS) {
  const top = minRoad(sc - WALL_PIER.cap, sc + WALL_PIER.cap) - APPROACH_DEPTH;
  parts.push(boxFromTo(sc - WALL_PIER.half, sc + WALL_PIER.half, WALL_PIER.t0, NORTH, BASE, top - WALL_PIER.capDepth + 0.05));
  parts.push(boxFromTo(sc - WALL_PIER.cap, sc + WALL_PIER.cap, WALL_PIER.capT0, NORTH, top - WALL_PIER.capDepth, top + 0.3));
}
// Pijlers met een ronde kop aan de zuidkant (BGT), tot onder het stalen dek.
function roundPier({ s, half, t0 }, depth) {
  const top = minRoad(s - half, s + half) - depth + 0.5;
  return Manifold.hull([
    Manifold.cylinder(top - BASE, half, half, 32, false).translate([s, t0 + half, BASE]),
    boxFromTo(s - half, s + half, t0 + half, NORTH, BASE, top),
  ]);
}
for (const p of LIFT_PIERS) parts.push(roundPier(p, MAIN_DEPTH));
parts.push(roundPier(ARCH_PIER, MAIN_DEPTH));

// ---------- vakwerkliggers van de aanbrug ----------
// De scherpe hoeken van de driehoeken (onderhoeken van de openingen,
// bovenhoeken van de nissen) worden 0,12 m afgekapt met een verticale kant,
// zodat er geen vlak zonder dikte in een spitse hoek overblijft.
function clipCorners(poly) {
  const xs = poly.map(([x]) => x);
  const zs = poly.map(([, z]) => z);
  let lo = xs[0];
  let hi = xs[0];
  for (const x of xs) {
    lo = Math.min(lo, x);
    hi = Math.max(hi, x);
  }
  let zlo = zs[0];
  let zhi = zs[0];
  for (const z of zs) {
    zlo = Math.min(zlo, z);
    zhi = Math.max(zhi, z);
  }
  const box = [[lo + 0.12, zlo - 1], [hi - 0.12, zlo - 1], [hi - 0.12, zhi + 1], [lo + 0.12, zhi + 1]];
  const out = new CrossSection([ccw(poly)]).intersect(new CrossSection([box])).toPolygons();
  return out.length === 1 ? out[0].map(([x, z]) => [x, z]) : poly;
}
const trussHoles = [];
const trussNiches = [];
const trussFlanks = [];
{
  const { panel, top, chordTop, chordLow, bar } = TRUSS;
  const lo = (s) => road(s) + chordLow;
  const hi = (s) => road(s) + top - chordTop;
  const n = Math.floor((TRUSS.s1 - 1.2 - (TRUSS.s0 + 1.2)) / panel);
  const start = TRUSS.s0 + 1.2;
  for (let k = 0; k < n; k++) {
    const a = start + k * panel;
    const b = a + panel;
    const m = (a + b) / 2;
    // Punt omhoog: doorgaand.
    const up = inset([[a, lo(a)], [b, lo(b)], [m, hi(m)]], bar / 2);
    if (up && Math.abs(polyArea(up)) > 0.3) {
      trussHoles.push(clipCorners(up));
      const apex = up.reduce((p, q) => (q[1] > p[1] ? q : p));
      const foot = up.reduce((p, q) => (q[1] < p[1] ? q : p));
      trussFlanks.push((Math.atan2(apex[1] - foot[1], Math.abs(apex[0] - foot[0])) * 180) / Math.PI);
    }
    // Vlakke bovenkant: blinde nis (niet na het laatste veld).
    if (k + 1 < n) {
      const down = inset([[m, hi(m)], [m + panel, hi(m + panel)], [b, lo(b)]], bar / 2);
      if (down && Math.abs(polyArea(down)) > 0.3) trussNiches.push(clipCorners(down));
    }
  }
}
const trussOutline = (() => {
  const xs = stationsS(TRUSS.s0, TRUSS.s1, 1);
  return [...xs.map((s) => [s, road(s) - APPROACH_DEPTH]), ...[...xs].reverse().map((s) => [s, road(s) + TRUSS.top])];
})();
const trusses = TRUSS.centres.map((tc) => {
  const h = TRUSS.width / 2;
  const plate = profileT(trussOutline, tc - h, tc + h);
  // De nissen aan de buitenkant: zuidelijke ligger naar het zuiden, noordelijke naar het noorden.
  const outer = tc < 6 ? [tc - h - 0.5, tc - h + TRUSS.niche] : [tc + h - TRUSS.niche, tc + h + 0.5];
  const cuts = [
    ...trussHoles.map((p) => profileT(p, tc - h - 0.5, tc + h + 0.5)),
    ...trussNiches.map((p) => profileT(p, outer[0], outer[1])),
  ];
  return plate.subtract(union(cuts));
});
parts.push(...trusses);

// ---------- boog: ribben met hangers ----------
const ribXs = stationsS(ARCH.s0, ARCH.s1, 0.5);
const ribOutline = [...ribXs.map((s) => [s, road(s) - 1.0]), ...[...ribXs].reverse().map((s) => [s, ribTop(s)])];
const hangerHoles = [];
for (let k = 0; k < ARCH.panels; k++) {
  const a = ARCH_NODES[k] + ARCH.hanger / 2;
  const b = ARCH_NODES[k + 1] - ARCH.hanger / 2;
  let shoulder = Infinity;
  for (let i = 0; i <= 100; i++) {
    const s = a + ((b - a) * i) / 100;
    shoulder = Math.min(shoulder, archBottom(s) - 0.1 - Math.tan(rad(ARCH.pointed)) * Math.min(s - a, b - s));
  }
  const floor = Math.max(road(a), road(b)) + ARCH.floor;
  if (shoulder < floor + 1.0) continue;
  const apex = shoulder + (Math.tan(rad(ARCH.pointed)) * (b - a)) / 2;
  hangerHoles.push([[a, floor], [b, floor], [b, shoulder], [(a + b) / 2, apex], [a, shoulder]]);
}
const ribs = ARCH.ribs.map((tc) => {
  const h = ARCH.width / 2;
  return profileT(ribOutline, tc - h, tc + h).subtract(union(hangerHoles.map((p) => profileT(p, tc - h - 0.5, tc + h + 0.5))));
});
parts.push(...ribs);
// Windverband tussen de toppen van de ribben: dwarsstaven op de knopen waar de
// rib meer dan 6 m boven het wegdek ligt, met kruisen daartussen.
const braceNodes = ARCH_NODES.filter((s) => archBottom(s) - road(s) >= ARCH.braceClear);
const braces = [];
const [tS, tN] = ARCH.ribs;
for (const s of braceNodes) braces.push(vBar([s, tS, archTop(s) - 0.15], [s, tN, archTop(s) - 0.15], ARCH.braceWidth));
for (let i = 0; i + 1 < braceNodes.length; i++) {
  const s0 = braceNodes[i];
  const s1 = braceNodes[i + 1];
  braces.push(vBar([s0, tS, archTop(s0) - 0.15], [s1, tN, archTop(s1) - 0.15], ARCH.braceWidth));
  braces.push(vBar([s0, tN, archTop(s0) - 0.15], [s1, tS, archTop(s1) - 0.15], ARCH.braceWidth));
}
parts.push(...braces);

// ---------- hefbrug: heftorens en bedieningshuis ----------
const towerOpening = (() => {
  const [l0, l1] = [TOWER.legs[0][1], TOWER.legs[1][0]];
  const half = (l1 - l0) / 2;
  const sh = Z(TOWER.shoulderNap);
  const apex = sh + Math.tan(rad(TOWER.pointed)) * half;
  return { poly: [[l0, BASE], [l1, BASE], [l1, sh], [(l0 + l1) / 2, apex], [l0, sh]], apex };
})();
const towers = TOWERS.map(({ s0, s1 }) =>
  boxFromTo(s0, s1, TOWER.legs[0][0], TOWER.legs[1][1], minRoad(s0, s1) - 0.3, Z(TOWER.topNap)).subtract(
    profileS(towerOpening.poly, s0 - 0.5, s1 + 0.5),
  ),
);
const cabin = boxFromTo(CABIN.s0, CABIN.s1, CABIN.t0, CABIN.t1, Z(CABIN.floorNap), Z(CABIN.roofNap)).subtract(
  boxFromTo(CABIN.s0 + 0.6, CABIN.s1 - 0.6, CABIN.t0 - 0.5, CABIN.t0 + 0.35, Z(CABIN.windows[0]), Z(CABIN.windows[1])),
);
// De torens en het huis komen na de voegen, zodat de voeg bij de oostelijke
// toren de poten niet insnijdt.
const upper = [...towers, cabin];

// ---------- trap naar de oever ----------
// Een gesloten trappenhuis aan de zuidkant: de loop (s = 193 tot 197) daalt
// van het bordes op dekhoogte (t = -13,5) naar NAP +9,5 m bij het dek (t = -5,2); ernaast
// de loopbrug op dekhoogte (s = 197 tot 199) naar het bordes.
const deckAt = (s) => road(s);
const stairBlock = loftAlong(
  STAIR.s0,
  STAIR.walk,
  (s) => [[STAIR.t0, BASE], [STAIR.t1, BASE], [STAIR.t1, Z(STAIR.lowNap)], [STAIR.landing, deckAt(s) - 0.02], [STAIR.t0, deckAt(s) - 0.02]],
  "traploop",
  1,
);
const stairWalk = loftAlong(
  STAIR.walk,
  STAIR.s1,
  (s) => [[STAIR.t0, BASE], [STAIR.t1, BASE], [STAIR.t1, deckAt(s) - 0.02], [STAIR.t0, deckAt(s) - 0.02]],
  "loopbrug",
  1,
);
parts.push(stairBlock, stairWalk);

// ---------- schampkanten ----------
function kerbAlong(s0, s1, tEdge, side, margin = 0) {
  // side +1: de rand ligt aan de zuidkant (schampkant van tEdge naar het noorden).
  const a = Math.min(tEdge, tEdge + side * KERB.width) - margin;
  const b = Math.max(tEdge, tEdge + side * KERB.width) + margin;
  // Als vrije ruimte (margin > 0) tot onder de wegdeklaag, zodat die niet
  // onder de schampkant doorloopt.
  const bottom = margin > 0 ? 1.1 : 0.3;
  return loftAlong(s0, s1, (s) => [[a, road(s) - bottom], [b, road(s) - bottom], [b, road(s) + KERB.height + margin], [a, road(s) + KERB.height + margin]], "schampkant");
}
const KERBS = [
  [WEST_END, WIDEN.s0, SOUTH.approach],
  [WIDEN.s0, STAIR.walk, SOUTH.widen],
  [STAIR.s1, WIDEN.s1, SOUTH.widen],
  [WIDEN.s1, EAST_END, SOUTH.river],
];
const crossKerbs = (margin = 0) => [
  // dwars langs de randen van de verbreding
  boxFromTo(WIDEN.s0 - margin, WIDEN.s0 + KERB.width + margin, SOUTH.widen - margin, SOUTH.approach + margin, minRoad(WIDEN.s0, WIDEN.s0 + 1) - (margin > 0 ? 1.1 : 0.3), minRoad(WIDEN.s0, WIDEN.s0 + 1) + KERB.height + margin),
  boxFromTo(WIDEN.s1 - KERB.width - margin, WIDEN.s1 + margin, SOUTH.widen - margin, SOUTH.river + margin, minRoad(WIDEN.s1 - 1, WIDEN.s1) - (margin > 0 ? 1.1 : 0.3), minRoad(WIDEN.s1 - 1, WIDEN.s1) + KERB.height + margin),
];
const kerbs = [...KERBS.map(([s0, s1, t]) => kerbAlong(s0, s1, t, 1)), ...crossKerbs()];
parts.push(...kerbs);

// Voegen van de hefbrug: sleuven over het wegdek aan beide einden.
const joints = [LIFT.s0, LIFT.s1].map((s) =>
  boxFromTo(s - JOINT.width / 2, s + JOINT.width / 2, SOUTH.river + KERB.width + 0.05, NORTH + 1, road(s) - JOINT.depth, road(s) + 1),
);

const bridge = union([union(parts).subtract(union(joints)), ...upper]);

// ---------- printvoet (alleen in de STL) ----------
// Onder het dek: een wig van 50 graden vanaf de randen die uitloopt in een
// scherm van 0,9 m tot de onderplaat, tussen de landhoofden.
const KNEE = rad(50);
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const footXs = [
  ...stationsS(WEST_FACE, EAST_FACE, 0.5),
  ...[WIDEN.s0, WIDEN.s1].flatMap((s) => [s - 0.01, s + 0.01]),
]
  .filter((s) => ![WIDEN.s0, WIDEN.s1].includes(s))
  .sort((a, b) => a - b)
  .filter((s, i, xs) => i === 0 || s - xs[i - 1] > 1e-4);
const printFoot = loftS(
  footXs.map((s) => {
    const t0 = southEdge(s);
    const c = (t0 + NORTH) / 2;
    const w = (NORTH - t0) / 2;
    const zb = road(s) - SLAB - 0.02;
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

// ---------- rijbaan, fietspad en voetpad als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is een eigen node per BGT-functie met de
// attributen van het wegdeel eronder (glTF `extras.attributes`), zodat de
// kleurregels van een thema (bijvoorbeeld fietspaden rood) op het brugdek
// werken zoals op de PDOK-wegdelen. Pas na het printmodel gebouwd, zodat de
// STL de brug als geheel ongewijzigd houdt.
//
// Actuele BGT-wegdelen met relatieve hoogteligging 1 op het dek, alle drie
// gesloten verharding met plus-fysiek voorkomen asfalt, over de hele lengte
// (s = 0 tot 340): G0301.7604c86a0ccd4cd5bd1ac854efea368a (rijbaan lokale weg,
// in het midden), G0301.21e9827c52814cc69be8c3e2dcfc9233 (fietspad, zuidkant)
// en G0301.d8cb67c78a3f4138b4fb84289bc026a0 (voetpad, noordkant). De grenzen
// volgen de constructie: tussen de vakwerkliggers, de heftorens en de
// boogribben ligt de rijbaan (t = 3,35 tot 10,75, ook op het beweegbare dek),
// ten zuiden daarvan tot de rand van de aanbrug (t = -0,6, de zuidrand van het
// BGT-fietspad) het fietspad en ten noorden ervan het voetpad. Het voetpad
// buiten de boog en de verbreding bij de trap (t < -0,6, vanaf s = 193) staan
// niet als eigen wegdeel in de BGT; volgens Wikipedia is het het zuidelijke
// voetpad dat aan de westkant op de trap uitkomt, dus ook voetpad.
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const FOOT_ATTRIBUTES = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const LANES = { bike: SOUTH.approach, roadSouth: 3.35, roadNorth: 10.75 };
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek over dezelfde stations
// als het dek, per stuk van de dekrand, tot 0,5 m voorbij de noordrand en
// voorbij de landhoofden.
const stripPiece = (s0, s1, t0) =>
  loftAlong(s0, s1, (s) => [[t0, road(s) - LAYER], [NORTH + 0.5, road(s) - LAYER], [NORTH + 0.5, road(s) + ABOVE], [t0, road(s) + ABOVE]], "snijstrook");
const strip = union([
  stripPiece(WEST_END - 2, WIDEN.s0, SOUTH.approach - 0.4),
  stripPiece(WIDEN.s0, WIDEN.s1, SOUTH.widen),
  stripPiece(WIDEN.s1, EAST_END + 2, SOUTH.river - 0.4),
]);
// Constructie die door de laag steekt blijft constructie, met 2 cm vrij: de
// schampkanten, de vakwerkliggers en de boogribben over hun hele lengte (ook
// onder de openingen), de poten van de heftorens en de voegen.
const G = 0.02;
const guards = [
  ...KERBS.map(([s0, s1, t]) => kerbAlong(s0, s1, t, 1, G)),
  ...crossKerbs(G),
  ...TRUSS.centres.map((tc) =>
    bandT(TRUSS.s0 - G, TRUSS.s1 + G, (s) => road(s) - LAYER - 0.5, (s) => road(s) + ABOVE + 0.5, tc - TRUSS.width / 2 - G, tc + TRUSS.width / 2 + G),
  ),
  ...ARCH.ribs.map((tc) =>
    bandT(ARCH.s0 - G, ARCH.s1 + G, (s) => road(s) - LAYER - 0.5, (s) => road(s) + ABOVE + 0.5, tc - ARCH.width / 2 - G, tc + ARCH.width / 2 + G),
  ),
  ...TOWERS.flatMap(({ s0, s1 }) =>
    TOWER.legs.map(([t0, t1]) => boxFromTo(s0 - G, s1 + G, t0 - G, t1 + G, minRoad(s0, s1) - 2, Z(TOWER.topNap) + 1)),
  ),
  ...joints.map((j) => {
    const bb = j.boundingBox();
    return boxFromTo(bb.min[0] - G, bb.max[0] + G, bb.min[1] - G, bb.max[1] + G, bb.min[2] - G, bb.max[2] + G);
  }),
];
const notLayer = union(guards);
const zone = (t0, t1) => boxFromTo(WEST_END - 10, EAST_END + 10, t0, t1, -50, 100);
const roadZone = zone(LANES.roadSouth, LANES.roadNorth);
const bikeZone = zone(LANES.bike, LANES.roadSouth);
const footZone = union([zone(-30, LANES.bike), zone(LANES.roadNorth, 30)]);
const layer = strip.subtract(notLayer);
const roadCut = layer.intersect(roadZone);
const bikeCut = layer.intersect(bikeZone);
const footCut = layer.intersect(footZone);
const roadway = roadCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const footway = footCut.intersect(bridge);
const structure = bridge.subtract(layer);
const shift = [-ORIGIN_ST[0], -ORIGIN_ST[1], 0];
const named = [
  [`building:${SLUG}`, structure.translate(shift)],
  ["road:rijbaan", roadway.translate(shift), ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway.translate(shift), BIKE_ATTRIBUTES],
  ["road:voetpad", footway.translate(shift), FOOT_ATTRIBUTES],
];
// Partitiecontrole: de onderdelen tellen op tot de brug als geheel.
const partition = {
  bridgeM3: +bridge.volume().toFixed(3),
  partsM3: +(structure.volume() + roadway.volume() + bikeway.volume() + footway.volume()).toFixed(3),
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
}
if (trussFlanks.length && Math.min(...trussFlanks) < 50) throw new Error("vakwerkopening met een te vlakke flank");
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
report.arch = {
  crownNap: ARCH.crownNap,
  crownX: local(ARCH.crownS),
  endsTopNap: [ARCH.s0, ARCH.s1].map((s) => +(archTop(s) + WATER_NAP).toFixed(2)),
  hangerNodesX: ARCH_NODES.slice(1, -1).map(local),
  hangerOpenings: hangerHoles.length,
  braces: braces.length,
  braceNodesX: braceNodes.map(local),
};
report.truss = { throughHoles: trussHoles.length, niches: trussNiches.length, minFlankDeg: +Math.min(...trussFlanks).toFixed(1) };
report.lift = { joints: [LIFT.s0, LIFT.s1].map(local), towersX: TOWERS.map(({ s0, s1 }) => [local(s0), local(s1)]), openingApexNap: +(towerOpening.apex + WATER_NAP).toFixed(2) };
report.piers = { approachX: APPROACH_PIERS.map(local), liftX: LIFT_PIERS.map(({ s }) => local(s)), archX: local(ARCH_PIER.s) };
report.overhang = overhangReport;
report.partition = partition;
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(named, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: named.map(([name]) => name) };

const stlName = `${SLUG}-1-${scale}.stl`;
const printSolid = printModel.translate([-ORIGIN_ST[0], -ORIGIN_ST[1], -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Oude IJsselbrug Zutphen 1:${scale} mm Z-up`);
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
// Maaiveld op het water en de uiterwaard ten zuiden van de brug (20 m naast de
// as) over de hele lengte, en op de rivier ten noorden van de spoorbrug (30 m
// naast de as).
const samplePoints = [
  ...[-222, -152, -82, -30, 0, 30].map((x) => [x, -20]),
  ...[-30, 30].map((x) => [x, 30]),
];
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: "Oude IJsselbrug Zutphen",
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [209859.23, 461993.56],
      xAxis: [0.93155, 0.3636],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0301100000025223"],
      replacesTerrain: [
        "G0301.82050841235b44bc85723ca9a525aac3",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as tussen de twee boogribben midden tussen de boogpijlers op de waterspiegel van de IJssel (z = 0, NAP +5,2 m zoals het PDOK-terrein) in de oorsprong, +X langs de brug naar het oosten (Zutphen, RD-richting 21,32 graden vanaf het oosten) en +Y naar het noordnoordwesten (de IJsselspoorbrug, die niet in het model zit). Vier nodes: road:rijbaan, road:fietspad en road:voetpad, de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan lokale weg, fietspad of voetpad, bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt; de rijbaan tussen de vakwerkliggers, heftorens en boogribben, het fietspad ten zuiden daarvan, het voetpad aan de noordkant en buiten de boog aan de zuidkant), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk van het westelijke landhoofd bij De Hoven (x = -285) tot de kade van Zutphen (x = 58,7), met het wegdek op NAP +11,6 tot +12,7 m (AHN). De aanbrug over de uiterwaard op zeven velden met wandpijlers en twee stalen vakwerkliggers langs de rijbaan (2,55 m boven het wegdek, doorgaande driehoeken met de punt omhoog en blinde nissen); de trap aan de zuidkant naar de oever als gesloten trappenhuis; de hefbrug met voegen, twee heftorens tot NAP +22,8 m als poorten met een spitse doorgang en het bedieningshuis (BAG-pand) aan de zuidkant tot NAP +18,6 m; de boogbrug met trekband van 89,7 m als twee verticale ribben 7,65 m uit elkaar met de top op NAP +25,25 m, de hangers als stijlen van 1,0 m tussen spitse openingen en het windverband tussen de toppen als staven met een V-onderkant; het voetpad buiten de boog als uitkraging; de pijlers van hefbrug en boog met ronde koppen (BGT), afgesneden aan de noordrand van het verkeersdek. Schampkanten aan de zuidrand in plaats van de leuningen. De bovenregel tussen de heftorens (13 m vrij boven de rijbaan), leuningen en lantaarns zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de uiterwaard en het water naast de brug bemonsterd; groundHeight is de ellipsoïdische PDOK-hoogte van het water. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_END - WEST_END).toFixed(1),
        deckWidthM: { approach: +(NORTH - SOUTH.approach).toFixed(2), river: +(NORTH - SOUTH.river).toFixed(2) },
        archSpanPierCentresM: +(ARCH.s1 - ARCH.s0).toFixed(1),
        archCrownNapM: ARCH.crownNap,
        archRibsApartM: +(ARCH.ribs[1] - ARCH.ribs[0]).toFixed(2),
        hangerPanelM: +((ARCH.s1 - ARCH.s0) / ARCH.panels).toFixed(3),
        liftSpanJointsM: +(LIFT.s1 - LIFT.s0).toFixed(1),
        liftTowerTopNapM: TOWER.topNap,
        cabinRoofNapM: CABIN.roofNap,
        approachSpans: APPROACH_PIERS.length + 1,
        roadNapM: { west: ROAD_NAP[0], crest: Math.max(...ROAD_NAP), east: ROAD_NAP[ROAD_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Oude_IJsselbrug_(Zutphen)",
        "https://nl.wikipedia.org/wiki/IJsselspoorbrug_(Zutphen)",
        "PDOK BGT overbruggingsdeel (dek, pijlers, beweegbaar dek) en wegdeel (rijbaan, fietspad, voetpad), EPSG:28992",
        "PDOK BAG pand 0301100000025223 (bedieningshuis)",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de dekranden, de vakwerkliggers, de boogribben, de heftorens, het bedieningshuis en de trap",
        "Wikimedia Commons: Zutphen ijsselbruecke.jpg; IJsselbrug, Zutphen.jpg; Zutphen, IJsselbrug.jpg; Enormous quantities of water passing through the IJselriver at the colourfull bridges of Zutphen - panoramio.jpg; Oude Ijsselbrug in 2019.jpg; Zutphen, de Oude IJsselbrug IMG 8024 2021-02-12 12.40.jpg; Zutphen Oude IJsselbrug seen from Badhuisweg.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

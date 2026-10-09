// Genereert een vereenvoudigd, gesloten 3D-model van de Stadsbrug in Kampen:
// de hefbrug (1999, Zwarts & Jansma Architecten) over de IJssel tussen de IJsselkade in de binnenstad en
// de oostoever bij het station, met de vier witte heftorens met elk twee
// vergulde kabelwielen ("de brug met de gouden wielen") en een contragewicht
// aan de landzijde, het hefdeel van 31 m in gesloten stand, de twee
// rivierpijlers met het bedieningsgebouw op de noordwestpunt van de oostelijke
// pijler en de dienstplatforms op de andere pijlerpunten, de betonnen
// aanbruggen op kolompijlers (vier velden aan de kant van de binnenstad, twee
// aan de kant van het station) en de vijf schanscaissons (2016) in de rivier. Alle
// maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, de materiaalklasse in de nodenaam: de constructie als building,
// de bovenste 0,5 m van het dek als road:rijbaan, road:fietspad en
// road:voetpad met de BGT-attributen) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal> met de brug als
// geheel en een printvoet onder het dek. De brug is 219 m lang en past op
// 1:1000 in 400 mm.
//
//   node scripts/generate-stadsbrug-kampen.mjs              # STL op 1:1000 (standaard)
//   node scripts/generate-stadsbrug-kampen.mjs --scale 1500
//
// Assenstelsel: oorsprong op de as van het BGT-dek midden tussen de twee
// rivierpijlers (RD 191081,64, 508147,19), op de waterspiegel van de IJssel
// zoals het PDOK-terrein die legt (ellipsoïdisch 42,32 m, NAP -0,31 m), Z
// omhoog: z = NAP + 0,31. +X loopt langs de brug naar het noordoosten (de
// oostoever en het station, RD-richting 35,53 graden vanaf het oosten), +Y
// naar het noordwesten, stroomafwaarts. Het dek loopt van x = -140,2 (de
// IJsselkade) tot 79,2 (de dijk aan de oostkant); de rivierpijlers staan op
// x = -20,55 tot -15,35 en 15,4 tot 20,6, het hefdeel ligt tussen x = -15,5
// en 15,5.
//
// Bronnen: BGT overbruggingsdeel (dek 20,3 m breed van x = -140,2 tot 79,2,
// rivierpijlers van 5,2 × 34,1 m met afgeschuinde punten), BGT wegdeel op het
// dek (rijbaan lokale weg 6,7 m, fietspaden van 3,0 m en voetpaden van 2,1 m
// aan beide zijden, alle met gesloten verharding en asfalt; gesplitst op
// x = ±15,5 bij het hefdeel), BGT kunstwerkdeel (de vijf schanscaissons), BAG
// pand 0166100000030487 (bedieningsgebouw); AHN DSM 0,5 m (PDOK WCS) voor het
// lengteprofiel van het wegdek (NAP +4,05 m bij de IJsselkade, +7,33 m bij de
// westelijke pijler, +6,67 m bij de oostelijke en +4,66 m bij de dijk; bij de
// opname stond het hefdeel open, daar lineair tussen de pijlers), de torens
// (top van de wielen NAP +22,9 m, 4,0 m langs en 4,25 m dwars op de brug,
// schrijlings op de dekrand), de contragewichten (bovenkant circa NAP
// +18,6 m), de pijlerkoppen (NAP +3,9 m), de dienstplatforms (NAP +6,0 tot
// +7,0 m) en het bedieningsgebouw (NAP +13,4 m, ook in de PDOK-reconstructie);
// PDOK-terrein voor de waterspiegel; Wikipedia (geopend 1999, 210 m lang,
// 20 m breed, hefdeel 30 m, vijf schuin oplopende schanscaissons uit 2016,
// grotendeels onder water); PDOK luchtfoto (8 cm) voor de plaats van
// wielen, contragewichten, platforms en het ronde dak van het bedieningsgebouw;
// Wikimedia Commons-foto's (Kampen, stadsbrug. 10-01-2022. (actm.) 01 en 02,
// Kampen, de Stadsbrug foto10 2016-02-17 10.35, Kampen - stadsbrug - 2017,
// Stadsbrug bridge Kampen 2019, 2019 3 en 2019 5, Kampen stadsbrug
// hefgedeelte, Kampen Hefbrug, Kampen - stadsbrug.JPG, Stadsbrug Kampen -
// schanscaissons oostzijde, Stadbrug Kampen - Schanscaisson - westzijde) voor
// het raamwerk van de torens, de wielen met acht spaken, de vorm van de
// contragewichten, het bedieningsgebouw, de kolompijlers en de schanscaissons.
// Geschat zijn de plaats van de kolompijlers (niet in de BGT, onder het dek
// niet in het AHN: vier gelijke velden aan de westkant, één pijler halverwege
// aan de oostkant), de kolommen (vier van 1,3 m), de constructiehoogtes
// (aanbruggen 1,5 m met een kesp van 1,2 m, hefdeel 1,8 m), de maten van het
// raamwerk (poten 0,9 tot 1,1 m, openingen als nissen van 0,35 m), de wielen
// (3,6 m, 0,9 m dik), de contragewichten (5,2 × 1,6 × 3,3 m) en de hoogte van
// de schanscaissons (NAP +1,2 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "stadsbrug-kampen");
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
// Doorsnede in het XZ-vlak (polygoon of CrossSection), uitgetrokken langs Y van y0 tot y1.
const extrudeY = (shape, y0, y1) =>
  Manifold.extrude(shape, y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const profileY = (points, y0, y1) => extrudeY([ccw(points)], y0, y1);
// Ellips in plattegrond (middelpunt, halve assen) van z0 tot z1.
const ellipse = (cx, cy, a, b, z0, z1, n = 48) =>
  Manifold.cylinder(z1 - z0, 1, 1, n, false)
    .scale([a, b, 1])
    .translate([cx, cy, z0]);
// Schijf met de as langs Y (middelpunt cx, cz), van y0 tot y1.
const discY = (cx, cz, r, y0, y1, n = 48) =>
  Manifold.cylinder(y1 - y0, r, r, n, false)
    .rotate([-90, 0, 0])
    .translate([cx, y0, cz]);
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
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};

// ---------- hoofdmaten ----------
// z = NAP-hoogte + 0,31: het PDOK-terrein legt de IJssel op ellipsoïdisch
// 42,32 m en ligt hier 42,63 m boven het AHN, dus het water op NAP -0,31 m.
const WATER_NAP = -0.31;
const Z = (nap) => nap - WATER_NAP;
const BASE = -1.0; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
const GROUND_HEIGHT = 42.31; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten

const WEST_END = -140.2; // dek begint boven de lage kade aan de IJsselkade (BGT)
const EAST_END = 79.2; // dek eindigt op de dijk aan de oostkant (BGT)
const DECK_HALF = 10.1; // halve dekbreedte (BGT 20,2 tot 20,4 m)
const SPAN_END = 15.5; // hefdeel tussen x = -15,5 en 15,5 (BGT-splitsing)
const PIER_TOP = Z(3.9); // bovenkant van de rivierpijlers (AHN)
// Rivierpijlers (BGT overbruggingsdeel, lokaal): 5,2 m langs de brug en 34,1 m
// dwars, met afgeschuinde punten.
const PIERS = [
  [[-17.94, 18.62], [-20.52, 16.09], [-20.56, -12.93], [-17.75, -15.47], [-15.4, -12.74], [-15.33, 15.97]],
  [[18.02, 18.58], [15.41, 16.06], [15.43, -13.03], [18.12, -15.54], [20.53, -12.79], [20.66, 15.91]],
];
const PIER_X = [
  [-20.55, -15.35],
  [15.4, 20.6],
];

// Wegdek in NAP-meters om de 4 m vanaf x = -144: 25e percentiel van het
// AHN-DSM over de rijbaan en de fietspaden (|y| < 5,5 m). Het hefdeel stond bij
// de opname open; tussen x = -20 en 20 lineair van +7,33 naar +6,67 m.
const DECK_X0 = -144;
const DECK_STEP = 4;
const DECK_NAP = [
  3.87, 4.05, 4.21, 4.35, 4.46, 4.59, 4.71, 4.83, 4.94, 5.06, 5.18, 5.3, 5.43, 5.54, 5.67, 5.78,
  5.9, 6.02, 6.14, 6.26, 6.38, 6.51, 6.62, 6.74, 6.84, 6.94, 7.04, 7.12, 7.2, 7.26, 7.32, 7.33,
  7.264, 7.198, 7.132, 7.066, 7.0, 6.934, 6.868, 6.802, 6.736, 6.67, 6.57, 6.44, 6.31, 6.17, 6.03, 5.89,
  5.76, 5.62, 5.48, 5.37, 5.22, 5.09, 4.95, 4.81, 4.66,
];
function road(x) {
  const f = Math.min(Math.max((x - DECK_X0) / DECK_STEP, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  return Z(lerp(DECK_NAP[i], DECK_NAP[i + 1], f - i));
}

// Doorsneden (geschat op foto's): de aanbruggen een betonnen plaat van 0,9 m
// over de hele breedte met daaronder de liggers tot 1,5 m onder het wegdek
// (binnen 7,0 m van de as); het stalen hefdeel een plaat van 0,8 m met
// hoofdliggers tot 1,8 m onder het wegdek (binnen 8,8 m van de as).
const APPROACH = { slab: 0.9, depth: 1.5, half: 7.0 };
const SPAN = { slab: 0.8, depth: 1.8, half: 8.8 };
// Schampkanten in plaats van de glazen leuningen langs de buitenrand: 0,9 m
// breed en 0,6 m hoog. Tussen fietspad en voetpad een band van de BGT-breedte
// (y = ±6,9 tot ±7,85) van 0,3 m hoog, met daarop de binnenste torenpoot.
const KERB = { width: 0.9, height: 0.6 };
const BAND = { inner: 6.9, outer: 7.85, height: 0.3 };
const JOINT = { width: 0.4, depth: 0.3 };

// Kolompijlers van de aanbruggen (geschat: vier gelijke velden tussen de
// IJsselkade en de westelijke rivierpijler, één pijler halverwege de oostelijke
// aanbrug): een kesp van 1,8 × 16 × 1,2 m op vier ronde kolommen van 1,3 m.
const COLUMN_PIERS = [-110.3, -80.4, -50.5, 46.0];
const CAP = { half: 0.9, halfY: 8.0, depth: 1.2 };
const COLUMN = { r: 0.65, y: [-6.15, -2.05, 2.05, 6.15] };
// Landhoofden onder de uiteinden van het dek.
const ABUTMENTS = [
  [WEST_END, -137.2],
  [75.7, EAST_END],
];

// Heftorens (AHN, luchtfoto, foto's): op elke rivierpijler twee torens
// schrijlings op de dekrand, 4,0 m langs de brug en 4,25 m dwars
// (y = ±6,95 tot ±11,2). Een raamwerk van vier poten met dwarsregels; de
// openingen zijn op 1:1000 nissen van 0,35 m. Het voetpad loopt tussen de
// poten door, onder een spitse doorgang van 55 graden. Boven de schouder
// (NAP +19,3 m) een kop die smaller wordt naar de as met twee wielen van 3,6 m
// (8 spaken, als nissen) aan weerszijden, top NAP +22,9 m. Aan de landzijde
// hangt het contragewicht (gesloten brug: hoog), 5,2 m breed, 1,6 m diep, van
// NAP +15,3 tot +18,6 m, met een schuine onderkant van 45 graden.
const TOWER = { xc: 18.25, half: 2.0, y0: 6.95, y1: 11.2, leg: 1.0 };
const TOWER_YC = (TOWER.y0 + TOWER.y1) / 2;
const SHOULDER = Z(19.3);
const HEAD = { top: Z(20.4), halfX: 1.0, halfY: 1.2 };
const WHEEL = { r: 1.8, axle: Z(21.1), thick: 0.9, hub: 0.8, inner: 1.2 };
const PASSAGE = { y0: BAND.outer, y1: DECK_HALF, height: 2.5, apex: 55 };
const WEIGHT = { depth: 1.6, half: 2.6, bottom: Z(15.3), knee: Z(16.9), top: Z(18.6) };
const NICHE = 0.35;
// Rijen openingen (NAP) op de zijvlakken langs de brug en op de kopvlakken.
const SIDE_ROWS = [[9.8, 11.6], [12.2, 14.0], [14.6, 16.4], [17.0, 18.7]].map(([a, b]) => [Z(a), Z(b)]);
const END_ROWS = [[12.0, 13.8], [14.4, 16.2], [16.8, 18.7]].map(([a, b]) => [Z(a), Z(b)]);

// Bedieningsgebouw (BAG 0166100000030487) op de noordwestpunt van de
// oostelijke pijler: een kolom die naar boven toe breder wordt (BAG-contour
// 3,5 × 5,1 m), de glazen kabine als terugliggende band, een rond dak met een
// rand van 6,4 m onder 45 graden en een lage koepel tot NAP +13,36 m (PDOK).
const CABIN = { cx: 18.15, cy: 14.85, base: [1.75, 2.55], top: [2.25, 2.95], glass: [Z(10.4), Z(11.6)], brim: Z(12.6), brimR: 3.2, roof: Z(13.36) };
// Dienstplatforms op de andere drie pijlerpunten (AHN NAP +6,0 tot +7,0 m).
const PLATFORMS = [
  { cx: -17.95, cy: 14.5, a: 1.6, b: 2.2 },
  { cx: -17.95, cy: -13.9, a: 1.6, b: 2.2 },
  { cx: 18.0, cy: -13.9, a: 1.6, b: 2.2 },
];
const PLATFORM_TOP = Z(6.4);
// Schanscaissons (BGT kunstwerkdeel, lokaal): betonblokken met een schuine
// bovenkant tot NAP +1,2 m, de wanden tot NAP 0.
const CAISSONS = [
  [[-49.66, 23.37], [-49.64, 30.0], [-52.78, 29.99], [-52.83, 23.39]],
  [[19.71, 35.54], [19.66, 42.24], [16.52, 42.2], [16.58, 35.52]],
  [[19.4, -33.18], [16.49, -33.19], [16.46, -44.56], [19.49, -44.59]],
  [[-16.3, -33.22], [-19.4, -33.23], [-19.47, -44.7], [-16.41, -44.69]],
  [[-16.38, 35.6], [-16.37, 42.25], [-19.51, 42.26], [-19.53, 35.61]],
];
const CAISSON = { wall: Z(0.0), ridge: Z(1.2) };

// ---------- dek ----------
function deck(x0, x1, sec) {
  const xs = stationsX(x0, x1, 2);
  const slab = loftX(
    xs.map((x) => {
      const zt = road(x);
      return { x, section: [[-DECK_HALF, zt - sec.slab], [DECK_HALF, zt - sec.slab], [DECK_HALF, zt], [-DECK_HALF, zt]] };
    }),
  );
  const beams = loftX(
    xs.map((x) => {
      const zt = road(x);
      return { x, section: [[-sec.half, zt - sec.depth], [sec.half, zt - sec.depth], [sec.half, zt - sec.slab + 0.1], [-sec.half, zt - sec.slab + 0.1]] };
    }),
  );
  return union([slab, beams]);
}
// Strook langs het dek tussen y0 en y1, van `below` onder tot `above` boven het wegdek.
function band(x0, x1, y0, y1, below, above, margin = 0) {
  return loftX(
    stationsX(x0, x1, 2).map((x) => {
      const zt = road(x);
      return {
        x,
        section: [[y0 - margin, zt - below - margin], [y1 + margin, zt - below - margin], [y1 + margin, zt + above + margin], [y0 - margin, zt + above + margin]],
      };
    }),
  );
}
const westDeck = deck(WEST_END, -SPAN_END, APPROACH);
const liftSpan = deck(-SPAN_END, SPAN_END, SPAN);
const eastDeck = deck(SPAN_END, EAST_END, APPROACH);
const KERBS = [
  [-DECK_HALF, -DECK_HALF + KERB.width, KERB.height],
  [DECK_HALF - KERB.width, DECK_HALF, KERB.height],
  [-BAND.outer, -BAND.inner, BAND.height],
  [BAND.inner, BAND.outer, BAND.height],
];
const kerbs = KERBS.map(([y0, y1, h]) => band(WEST_END, EAST_END, y0, y1, 0.3, h));
// Voegen van het hefdeel: sleuven over het dek binnen de buitenste schampkanten.
const joints = [-SPAN_END, SPAN_END].map((x) =>
  boxFromTo(x - JOINT.width / 2, x + JOINT.width / 2, -DECK_HALF + KERB.width + 0.05, DECK_HALF - KERB.width - 0.05, road(x) - JOINT.depth, road(x) + 1),
);
const abutments = ABUTMENTS.map(([x0, x1]) =>
  loftX(stationsX(x0, x1, 1).map((x) => ({ x, section: [[-DECK_HALF, BASE], [DECK_HALF, BASE], [DECK_HALF, road(x) - 0.05], [-DECK_HALF, road(x) - 0.05]] }))),
);

// ---------- pijlers ----------
const columnPiers = COLUMN_PIERS.flatMap((xc) => {
  const zt = road(xc) - APPROACH.depth + 0.05;
  return [
    boxFromTo(xc - CAP.half, xc + CAP.half, -CAP.halfY, CAP.halfY, zt - CAP.depth - 0.05, zt),
    ...COLUMN.y.map((y) => Manifold.cylinder(zt - CAP.depth - BASE, COLUMN.r, COLUMN.r, 32, false).translate([xc, y, BASE])),
  ];
});
const riverPiers = PIERS.map((poly) => prism(poly, BASE, PIER_TOP));
// Bovenbouw van de pijler onder het einde van de aanbrug, tot onder de plaat.
const pierWalls = PIER_X.map(([x0, x1]) => {
  const [a, b] = x0 < 0 ? [x0, -SPAN_END - 0.2] : [SPAN_END + 0.2, x1];
  return loftX(stationsX(a, b, 1).map((x) => ({ x, section: [[-DECK_HALF, PIER_TOP - 0.1], [DECK_HALF, PIER_TOP - 0.1], [DECK_HALF, road(x) - 0.85], [-DECK_HALF, road(x) - 0.85]] })));
});
// Binnen de contour van de pijler (de punten zijn afgeschuind).
const platforms = PLATFORMS.map(({ cx, cy, a, b }) =>
  ellipse(cx, cy, a, b, PIER_TOP - 0.1, PLATFORM_TOP).intersect(prism(PIERS[cx < 0 ? 0 : 1], PIER_TOP - 0.2, PLATFORM_TOP + 0.1)),
);
const caissons = CAISSONS.map((poly) => {
  const c = ccw(poly);
  // lange as van het blok en de nok, 1,4 m binnen de korte zijden
  const cx = c.reduce((s, p) => s + p[0], 0) / 4;
  const cy = c.reduce((s, p) => s + p[1], 0) / 4;
  const ys = c.map(([, y]) => y);
  const yLo = Math.min(...ys);
  const yHi = Math.max(...ys);
  const inset = 1.4;
  const ridge = boxFromTo(cx - 0.05, cx + 0.05, yLo + inset, yHi - inset, CAISSON.ridge - 0.05, CAISSON.ridge);
  return union([prism(c, BASE, CAISSON.wall), Manifold.hull([prism(c, CAISSON.wall - 0.01, CAISSON.wall), ridge])]);
});

// ---------- heftorens ----------
const TAN_APEX = Math.tan((PASSAGE.apex * Math.PI) / 180);
// Spaakwiel als nis op het buitenvlak: de ring tussen naaf en velg min vier
// balken door het midden (acht spaken van 0,35 m).
const SPOKES = CrossSection.circle(WHEEL.r - 0.35, 48)
  .subtract(CrossSection.circle(0.5, 24))
  .subtract(CrossSection.union([0, 45, 90, 135].map((deg) => CrossSection.square([2 * WHEEL.r + 1, 0.35], true).rotate(deg))));
// Doorsnede (x, z) in het vlak van het wiel naar een schijf langs Y.
const spokeSlab = (xc, y0, y1) =>
  Manifold.extrude(SPOKES, y1 - y0)
    .rotate([-90, 0, 0])
    .translate([xc, y0, WHEEL.axle]);
function tower(side, sy) {
  // side -1: westelijke pijler (landzijde naar -X), +1: oostelijke (landzijde +X)
  // sy +1: noordwestrand, -1: zuidoostrand
  const xc = side * TOWER.xc;
  const x0 = xc - TOWER.half;
  const x1 = xc + TOWER.half;
  const Y = (v) => sy * v;
  const ya = Math.min(Y(TOWER.y0), Y(TOWER.y1));
  const yb = Math.max(Y(TOWER.y0), Y(TOWER.y1));
  const yc = sy * TOWER_YC;
  const body = boxFromTo(x0, x1, ya, yb, PIER_TOP - 0.1, SHOULDER);
  // Doorgang voor het voetpad, met een spitse top van 55 graden.
  const zt = Math.max(road(x0), road(x1));
  const pa = Math.min(Y(PASSAGE.y0), Y(PASSAGE.y1));
  const pb = Math.max(Y(PASSAGE.y0), Y(PASSAGE.y1));
  const half = (pb - pa) / 2;
  const zr = zt + PASSAGE.height;
  const section = [[pa, zt - APPROACH.slab], [pb, zt - APPROACH.slab], [pb, zr], [(pa + pb) / 2, zr + half * TAN_APEX], [pa, zr]];
  const passage = loftX([{ x: x0 - 0.5, section }, { x: x1 + 0.5, section }]);
  // Nissen tussen de poten: zijvlakken (normaal ±Y) en kopvlakken (normaal ±X).
  const niches = [];
  for (const yf of [ya, yb]) {
    const out = yf === ya ? -1 : 1;
    for (const [z0, z1] of SIDE_ROWS) {
      niches.push(boxFromTo(x0 + TOWER.leg, x1 - TOWER.leg, yf - out * NICHE, yf + out * 0.5, z0, z1));
    }
  }
  const landFace = side < 0 ? x0 : x1;
  const spanFace = side < 0 ? x1 : x0;
  for (const [xf, rows] of [
    [spanFace, END_ROWS],
    [landFace, END_ROWS.slice(0, 1)],
  ]) {
    const out = xf === x0 ? -1 : 1;
    for (const [z0, z1] of rows) {
      niches.push(boxFromTo(xf - out * NICHE, xf + out * 0.5, yc - 1.1, yc + 1.1, z0, z1));
    }
  }
  // Kop: van de schouder naar een blok rond de as, met de naaf tussen de wielen.
  const head = Manifold.hull([
    boxFromTo(x0, x1, ya, yb, SHOULDER - 0.01, SHOULDER),
    boxFromTo(xc - HEAD.halfX, xc + HEAD.halfX, yc - HEAD.halfY, yc + HEAD.halfY, HEAD.top - 0.01, HEAD.top),
  ]);
  const hub = discY(xc, WHEEL.axle, WHEEL.hub, yc - WHEEL.inner, yc + WHEEL.inner);
  const neck = boxFromTo(xc - WHEEL.hub, xc + WHEEL.hub, yc - WHEEL.inner, yc + WHEEL.inner, HEAD.top - 0.1, WHEEL.axle);
  const wheels = [-1, 1].map((s) => {
    const w0 = yc + s * WHEEL.inner;
    const w1 = yc + s * (WHEEL.inner + WHEEL.thick);
    const disc = discY(xc, WHEEL.axle, WHEEL.r, Math.min(w0, w1), Math.max(w0, w1));
    // spaken als nis van 0,3 m op het buitenvlak
    const face = w1;
    const cut = s > 0 ? spokeSlab(xc, face - 0.3, face + 0.2) : spokeSlab(xc, face - 0.2, face + 0.3);
    return disc.subtract(cut);
  });
  // Contragewicht aan de landzijde.
  const d = side * WEIGHT.depth;
  const weight = profileY(
    [
      [landFace - side * 0.05, WEIGHT.bottom],
      [landFace - side * 0.05, WEIGHT.top],
      [landFace + d - side * 0.3, WEIGHT.top],
      [landFace + d, WEIGHT.top - 0.3],
      [landFace + d, WEIGHT.knee],
    ],
    yc - WEIGHT.half,
    yc + WEIGHT.half,
  );
  return union([body.subtract(union([passage, ...niches])), head, hub, neck, ...wheels, weight]);
}
const towers = [-1, 1].flatMap((side) => [1, -1].map((sy) => tower(side, sy)));

// ---------- bedieningsgebouw ----------
const cabin = (() => {
  const { cx, cy, base, top, glass, brim, brimR, roof } = CABIN;
  const column = Manifold.hull([
    ellipse(cx, cy, base[0], base[1], PIER_TOP - 0.1, PIER_TOP),
    ellipse(cx, cy, top[0], top[1], glass[0] - 0.01, glass[0]),
  ]);
  const glassBand = ellipse(cx, cy, top[0] - 0.3, top[1] - 0.3, glass[0] - 0.01, glass[1] + 0.01);
  const brimPart = Manifold.hull([
    ellipse(cx, cy, top[0], top[1], glass[1], glass[1] + 0.01),
    ellipse(cx, cy, brimR, brimR, brim - 0.01, brim),
  ]);
  const dome = Manifold.hull([
    ellipse(cx, cy, brimR, brimR, brim - 0.01, brim),
    ellipse(cx, cy, 2.2, 2.2, roof - 0.25, roof - 0.24),
    ellipse(cx, cy, 0.8, 0.8, roof - 0.01, roof),
  ]);
  return union([column, glassBand, brimPart, dome]);
})();

const bridge = union([
  westDeck,
  liftSpan,
  eastDeck,
  ...kerbs,
  ...abutments,
  ...columnPiers,
  ...riverPiers,
  ...pierWalls,
  ...platforms,
  ...caissons,
  ...towers,
  cabin,
]).subtract(union(joints));

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden vanaf de onderkant van
// de dekrand die uitloopt in een scherm van minstens 0,8 mm op printschaal tot
// de onderplaat.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const edgeDepth = (x) => (Math.abs(x) < SPAN_END ? SPAN.slab : APPROACH.slab);
const footXs = [...stationsX(ABUTMENTS[0][1] - 0.5, ABUTMENTS[1][0] + 0.5, 1), -SPAN_END - 0.01, -SPAN_END + 0.01, SPAN_END - 0.01, SPAN_END + 0.01]
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-3);
const printFoot = loftX(
  footXs.map((x) => {
    const w = DECK_HALF;
    const zt = road(x);
    const zb = zt - edgeDepth(x) - 0.02;
    const zIn = zt - 0.3;
    const s = SCREEN;
    const zs = zb - KNEE * (w - s);
    if (zs > BASE + 0.05) {
      return { x, section: [[-s, BASE], [s, BASE], [s, zs], [w, zb], [w, zIn], [-w, zIn], [-w, zb], [-s, zs]] };
    }
    // Laag dek: de wig komt al op de onderplaat uit.
    const a = w - (zb - BASE) / KNEE;
    return {
      x,
      section: [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [w, zIn], [-w, zIn], [-w, zb], [-a - 1e-3, BASE + 1e-3]],
    };
  }),
);
const printModel = union([bridge, printFoot]);

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
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  // Vrij hangende ondervlakken per soort: onder de dekken, de nissen en
  // wielen van de torens, de rest.
  const buckets = {};
  for (const { p, area } of overhangs(bridge)) {
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const ym = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const inTower = Math.abs(Math.abs(xm) - TOWER.xc) < TOWER.half + WEIGHT.depth + 0.1 && Math.abs(Math.abs(ym) - TOWER_YC) < WEIGHT.half + 0.1;
    const key = inTower && zm > SHOULDER - 0.2 ? "wielen en kop" : inTower && zm > road(xm) + 0.5 ? "torens (nissen, doorgang)" : zm <= road(xm) + 0.05 ? "onder het dek" : "overig";
    buckets[key] = (buckets[key] ?? 0) + area;
  }
  console.log("vrij hangend (m2):", Object.fromEntries(Object.entries(buckets).map(([k, a]) => [k, +a.toFixed(2)])));
}

// ---------- rijbaan, fietspad en voetpad als eigen onderdelen ----------
// Pas na het samenstellen van het printmodel: de bovenste 0,5 m van het dek
// is per BGT-functie een eigen node met de attributen van het wegdeel
// (glTF `extras.attributes`), zodat de kleurregels van een thema erop werken
// zoals op de PDOK-wegdelen. De strook loopt van 0,5 m onder tot 1 m boven het
// wegdek tussen de buitenste schampkanten; schampkanten, de band tussen
// fietspad en voetpad, de torens en de voegen blijven constructie (met 2 cm
// vrij). Fietspad en voetpad: strook ∩ de BGT-vlakken (lokaal, vereenvoudigd
// tot 5 cm; de uiteinden die tot 0,8 m voor het dekeinde ophouden, lopen door
// tot het dekeinde); rijbaan: de rest.
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const FOOT_ATTRIBUTES = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_PATHS = [
  // G0166.048af3508d2b4762a1b0485d1e8acb4e, G0166.1fab09c04a5f4be093dceefdc63d67ee, G0166.438d75b2c1324ab6920bfc9200312968 (noordwest)
  [[-15.47, 3.84], [-15.47, 6.82], [-140.05, 6.92], [-140.05, 3.9]],
  [[-15.47, 3.84], [15.51, 3.82], [15.51, 6.79], [-15.47, 6.82]],
  [[15.51, 6.79], [15.51, 3.82], [79.09, 3.78], [79.1, 6.77]],
  // G0166.aea049646b8b4e7684e239455fbeaf0d, G0166.870c7fc4075d4aa2bafba14f6ba69f59, G0166.5a8f1e3045d1439b8adc3de79d4c4a2a (zuidoost)
  [[-15.47, -6.86], [-15.47, -3.85], [-140.05, -3.81], [-140.05, -6.77]],
  [[-15.47, -6.86], [15.51, -6.86], [15.51, -3.84], [-15.47, -3.85]],
  [[15.51, -3.84], [15.51, -6.86], [79.08, -6.86], [79.09, -3.84]],
];
const FOOT_PATHS = [
  // G0166.0ac7af8f051c4c0b8844179dc560bacf, G0166.c56d685e1bdc4cc19b8041715311e040, G0166.0d3947f48a2b4e6f83c5f074de5e4729 (noordwest)
  [[-15.47, 7.89], [-15.47, 9.98], [-19.47, 9.99], [-139.35, 10.08], [-139.44, 9.9], [-139.47, 7.99]],
  [[-15.47, 7.89], [15.51, 7.86], [15.51, 9.96], [-15.47, 9.98]],
  [[15.51, 9.96], [15.51, 7.86], [78.51, 7.82], [78.5, 9.93]],
  // G0166.7ba0741ffa3646688fc5f9ef53c3b783, G0166.f5ad403484054f028d5efbf45d88daa8, G0166.cdd1c7eba5d94dd59266cb5e9e49e651 (zuidoost)
  [[-15.47, -9.95], [-15.47, -7.86], [-139.44, -7.83], [-139.44, -9.88], [-139.39, -9.92]],
  [[-15.47, -7.86], [-15.47, -9.95], [15.5, -9.99], [15.5, -7.89]],
  [[15.5, -7.89], [15.5, -9.99], [78.48, -10.01], [78.49, -7.92]],
];
// Uiteinden doortrekken tot voorbij het dekeinde.
const extendEnds = (poly) => poly.map(([x, y]) => [x < WEST_END + 0.8 ? WEST_END - 1 : x > EAST_END - 0.8 ? EAST_END + 1 : x, y]);
const bikePaths = union(BIKE_PATHS.map((poly) => prism(extendEnds(poly), BASE, 60)));
const footPaths = union(FOOT_PATHS.map((poly) => prism(extendEnds(poly), BASE, 60)));
const strip = band(WEST_END - 0.5, EAST_END + 0.5, -DECK_HALF + KERB.width, DECK_HALF - KERB.width, LAYER, ABOVE);
// Wat constructie blijft, 2 cm groter.
const kerbGuards = KERBS.map(([y0, y1, h]) => band(WEST_END - 0.5, EAST_END + 0.5, y0, y1, 0.3, h, 0.02));
const towerGuards = [-1, 1].flatMap((side) =>
  [1, -1].map((sy) => {
    const xc = side * TOWER.xc;
    const ya = Math.min(sy * TOWER.y0, sy * TOWER.y1);
    const yb = Math.max(sy * TOWER.y0, sy * TOWER.y1);
    const pa = Math.min(sy * PASSAGE.y0, sy * PASSAGE.y1);
    const pb = Math.max(sy * PASSAGE.y0, sy * PASSAGE.y1);
    return boxFromTo(xc - TOWER.half - 0.02, xc + TOWER.half + 0.02, ya - 0.02, yb + 0.02, BASE, 40).subtract(
      boxFromTo(xc - 5, xc + 5, pa + 0.02, pb - 0.02, BASE - 1, 41),
    );
  }),
);
const jointGuards = joints.map((j) => {
  const bb = j.boundingBox();
  return boxFromTo(bb.min[0] - 0.02, bb.max[0] + 0.02, bb.min[1] - 0.02, bb.max[1] + 0.02, bb.min[2] - 0.02, bb.max[2] + 0.02);
});
const notLayer = union([...kerbGuards, ...towerGuards, ...jointGuards]);
const free = strip.subtract(notLayer);
const roadCut = free.subtract(union([bikePaths, footPaths]));
const bikeCut = free.intersect(bikePaths);
const footCut = free.intersect(footPaths);
const roadway = roadCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const footway = footCut.intersect(bridge);
const structure = bridge.subtract(union([roadCut, bikeCut, footCut]));
const parts = [
  ["building:stadsbrug-kampen", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
  ["road:voetpad", footway, FOOT_ATTRIBUTES],
];
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
report.deck = {
  westNap: DECK_NAP[1],
  westPierNap: +(road(-20) + WATER_NAP).toFixed(2),
  eastPierNap: +(road(20) + WATER_NAP).toFixed(2),
  eastNap: DECK_NAP[DECK_NAP.length - 1],
};
report.towers = { wheelTopNap: +(WHEEL.axle + WHEEL.r + WATER_NAP).toFixed(2), centres: [-TOWER.xc, TOWER.xc], y: [TOWER.y0, TOWER.y1] };
const glbFile = path.join(outDir, "stadsbrug-kampen.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-stadsbrug-kampen.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `stadsbrug-kampen-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Stadsbrug Kampen 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveldpunten op het water van de IJssel, 25 m naast de as, tussen de
// schanscaissons door.
const samplePoints = [-100, -60, 0, 40].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "stadsbrug-kampen.json"),
  JSON.stringify(
    {
      name: "Stadsbrug Kampen",
      file: "stadsbrug-kampen.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [191081.64, 508147.19],
      xAxis: [0.81379, 0.58111],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0166100000030487"],
      replacesTerrain: [
        "G0166.07fb9aff438644b99882747a967d0a24",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden tussen de rivierpijlers op de waterspiegel van de IJssel (NAP -0,31 m zoals het PDOK-terrein die legt, z = NAP + 0,31) in de oorsprong, +X langs de brug naar het noordoosten (de oostoever bij het station, RD-richting 35,53 graden vanaf het oosten) en +Y naar het noordwesten, stroomafwaarts. Vier nodes: road:rijbaan, road:fietspad en road:voetpad, de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan lokale weg, fietspad of voetpad, bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt), zodat de kleurregels van een thema erop werken; en building: de rest van de hefbrug van de IJsselkade (x = -140,2) tot de dijk aan de oostkant (x = 79,2). De vier heftorens van 4,0 × 4,25 m schrijlings op de dekranden als raamwerk met nissen, een spitse doorgang voor het voetpad, een kop met twee wielen van 3,6 m met acht spaken (top NAP +22,9 m) en het contragewicht aan de landzijde in gesloten stand; het hefdeel van 31 m tussen de voegen op x = ±15,5; de rivierpijlers (BGT) tot NAP +3,9 m met de bovenbouw onder de aanbruggen, het bedieningsgebouw (BAG-pand) op de noordwestpunt van de oostelijke pijler met glazen band, dakrand en koepel tot NAP +13,36 m en drie dienstplatforms op de andere pijlerpunten; de aanbruggen als plaat met liggers op kolompijlers met een kesp en vier ronde kolommen (vier velden aan de westkant, twee aan de oostkant); de vijf schanscaissons in de rivier (BGT). Het wegdek ligt op NAP +4,05 m aan de IJsselkade, +7,33 m bij de westelijke pijler, +6,67 m bij de oostelijke en +4,66 m op de dijk. Schampkanten in plaats van de glazen leuningen. Lantaarns, verkeerslichten, slagbomen, portalen, de kabels, de stalen frames op de pijlerpunten, het houten remmingwerk en de meerpalen zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water bemonsterd; groundHeight is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_END - WEST_END).toFixed(1),
        deckWidthM: 2 * DECK_HALF,
        liftSpanM: 2 * SPAN_END,
        towerTopNapM: report.towers.wheelTopNap,
        towerFootprintM: [2 * TOWER.half, +(TOWER.y1 - TOWER.y0).toFixed(2)],
        wheelDiameterM: 2 * WHEEL.r,
        counterweightNapM: [15.3, 18.6],
        cabinTopNapM: 13.36,
        pierTopNapM: 3.9,
        columnPierX: COLUMN_PIERS,
        deckNapM: report.deck,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Stadsbrug_(Kampen)",
        "PDOK BGT overbruggingsdeel (dek, rivierpijlers), wegdeel (rijbaan, fietspaden, voetpaden op het dek), kunstwerkdeel (schanscaissons), EPSG:28992",
        "PDOK BAG pand 0166100000030487 (bedieningsgebouw)",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de torens, de contragewichten, de pijlers, de platforms en het bedieningsgebouw",
        "PDOK luchtfoto (Actueel_orthoHR) voor de wielen, contragewichten, platforms en het dak van het bedieningsgebouw",
        "Wikimedia Commons: Kampen, stadsbrug. 10-01-2022. (actm.) 01 en 02.jpg, Kampen, de Stadsbrug foto10 2016-02-17 10.35.jpg, Kampen - stadsbrug - 2017.jpg, Stadsbrug bridge Kampen 2019.jpg, 2019 3.jpg en 2019 5.jpg, Kampen stadsbrug hefgedeelte.jpg, Kampen Hefbrug.jpg, Kampen - stadsbrug.JPG, Stadsbrug Kampen - schanscaissons oostzijde.jpg, Stadbrug Kampen - Schanscaisson - westzijde.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een gesloten 3D-model van het Fries Museum in Leeuwarden: de nieuwbouw
// aan het Wilhelminaplein (Zaailand), geopend in 2013, ontwerp Hubert-Jan Henket
// (Henket & partners, met Gianni Cananiello). Uit bouwdelen, niet uit een
// AHN-hoogteveld:
//  - het grote vlakke dak (bovenkant NAP +24,5 m, 22,55 m boven het plein) dat 14 m
//    over het plein, 10 m naar het noorden (over de tussenhal en het zuidelijke deel
//    van het woonblok), 3,3 m naar het zuiden en over de doorgang aan de oostkant
//    uitkraagt; met twee rijen lichtsleuven en dwarsbalken aan de noordkant (hier 1 m
//    diepe sleuven, zie NORTH_SLOT_DEPTH), een open sleuf langs de noordgevel boven de
//    tussenhal en een lange open sleuf boven de doorgang (open in het AHN), een verlaagd installatievlak, de lichtkap met een
//    flauw zadeldak, een installatieblok en een schacht;
//  - de dichte doos (donkere platen, +5,3 tot +16,5 m) met de getrapte glaspui van
//    de trappenhal in de westgevel als nis, en een verhoogde rand langs de oostgevel;
//  - de glazen bovenverdieping, 1,5 m teruggezet onder het dak, met een ronde
//    noordwesthoek;
//  - de glazen plint, 2 m teruggezet aan de plein- en zuidzijde, met witte kolommen
//    onder de rand van de doos, en vier houten kolommen onder het dak aan de pleinzijde;
//  - de glazen tussenhal naar het woonblok, en het woonblok aan de noordkant (een
//    eenvoudig blok), dat tot hetzelfde BAG-pand hoort;
//  - het woonblok aan de noordkant van het plein (BAG 0080100010076275) als
//    eenvoudig blok, omdat de PDOK-reconstructie de oosthoek tot het museumdak optrekt.
// De ondergrondse parkeergarage onder plein en museum (BAG 0080100000376229) wordt
// ook vervangen: PDOK reconstrueert haar met alles wat erboven staat, tot het dak.
// De Kanselarij en het oude museum aan de Turfmarkt (circa 300 m noordelijker)
// horen er niet bij. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-fries-museum.mjs              # 1:1000 (standaard)
//   node scripts/generate-fries-museum.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (182223,8, 579283,8), het hart van de museumdoos
// (BAG-contour), op maaiveldniveau (NAP +1,95 m), Z omhoog. +X loopt langs de
// noord- en zuidgevel naar het oosten (-6,85 graden vanaf de RD-X-as) en +Y
// loodrecht daarop naar het noorden. De westgevel aan het plein ligt op u -28,2 m.
//
// Bronnen: PDOK BAG-panden 0080100010076276 (museum, tussenhal en woonblok) en
// 0080100010076275 (woonblok aan het plein); AHN
// DSM/DTM 0,5 m (PDOK WCS): de dakplaat en haar randen, de lichtsleuven, de
// dakopbouwen (lichtkap goot NAP +26,7 m en nok +27,7 m, installatieblok +25,7 m,
// schacht +27,5 m, verlaagd vlak +23,4 m), de rand langs de oostgevel (+20,1 m), de
// tussenhal (+11,0 m), het woonblok (+16,8 m en +13,8 m) en het maaiveld (NAP +1,75 tot
// +2,1 m); PDOK luchtfoto; Wikipedia; Wikimedia Commons-foto's van de westgevel.
// Geschat uit foto's: de onder- en bovenkant van de doos (+5,3 en +16,5 m), de dikte
// van de dakplaat (1,5 m, de minimale plaatdikte), de terugsprongen van de plint
// (2 m) en de bovenverdieping (1,5 m), de glaspui, de plaats van de kolommen (houten
// kolommen 0,9 m in plaats van circa 0,6 m dik) en de hoogte van de tussenhal.
// Weggelaten: de letters FRIES MUSEUM, de gevelplaten, de lamellen in de sleuven,
// de lage daklichten en glasstroken op het dak (0,5 tot 0,8 m hoog), de gebogen
// glaswand van de plint en het gevelreliëf van het woonblok.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "fries-museum");
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
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Convexe veelhoek in plan met een dakvlak z = a x + b y + c, vanaf z0 omhoog.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([
    ...pts.map(([x, y]) => [x, y, z0]),
    ...pts.map(([x, y]) => [x, y, a * x + b * y + c]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);


const SLUG = "fries-museum";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +1,95 m) ----------
const GROUND_NAP = 1.95;
const ORIGIN = [182223.8, 579283.8];
const X_AXIS = [0.992862, -0.11927]; // RD-richting -6,85 graden, langs de noord- en zuidgevel van de BAG-contour
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// Maaiveld (AHN-DTM NAP +1,75 tot +2,1 m) op het Wilhelminaplein, de straten noord en zuid en in de passage.
const GROUND_SAMPLES = [[-50, 0], [-48, 22], [-30, -27], [20, -27], [-10, 45], [31, 5]];

// Het dak: één plaat over het museum, het plein (west), de doorgang (oost) en het
// zuidelijke deel van het woonblok (noord). Bovenkant uit het AHN (NAP +24,5 m),
// randen uit het AHN-DSM, dikte 1,5 m (de minimale plaatdikte; foto's tonen een dunne
// rand met een houten onderzijde).
const ROOF = { u0: -42.3, u1: 34.2, v0: -23.1, v1: 30.2 };
const ROOF_TOP = 22.55;
const ROOF_THICKNESS = 1.5;
const SOFFIT = ROOF_TOP - ROOF_THICKNESS;
// De dichte doos (donkere platen) op de glazen plint: BAG-contour van pand
// 0080100010076276 (het museumdeel), onderkant en bovenkant uit foto's geschat.
const BOX = { u0: -28.21, u1: 28.25, v0: -19.8, v1: 19.8 };
const BOX_BOTTOM = 5.3;
const BOX_TOP = 16.5;
// De glazen plint springt aan de plein- en de zuidzijde 2 m terug onder de doos.
const PLINTH = { u0: -26.2, u1: 28.25, v0: -17.8, v1: 19.8 };
// De glazen bovenste verdieping tussen de doos en het dak, 1,5 m teruggezet, met een
// ronde noordwesthoek (straal 5 m).
const BAND = { u0: -26.7, u1: 26.5, v0: -18.3, v1: 18.3, rNW: 5 };
// De verhoogde rand van de doos langs de oostgevel (NAP +20,1 m), onder de lichtsleuf.
const EAST_LEDGE = { u0: 26.6, u1: 28.25, v0: -12.7, v1: 19.8, z: 18.15 };
// Grote glaspui in de westgevel (trappenhal) als nis van 0,35 m: onderrand op +6,9 m
// in het noorden, schuin omhoog naar +11,8 m, tot de zuidhoek; bovenaan open naar de
// glazen bovenverdieping.
const NICHE_DEPTH = 0.35;
const NICHE_PROFILE = [[6.0, 6.9], [-2.4, 6.9], [-13.1, 11.8], [-19.3, 11.8], [-19.3, 17.5], [6.0, 17.5]];
// Lichtsleuven in het dak (open in het AHN: maaiveld of geen meting).
const SLOT_BEAM = 1.0;
// De twee rijen aan de noordkant zijn 1 m diepe sleuven met een bodem van 0,5 m: als
// gaten zouden de smalle balken ertussen boven de open ruimte naast de tussenhal in de
// export een steunwand tot de grondplaat krijgen.
const NORTH_SLOT_DEPTH = 1.0;
const NORTH_SLOT_ROWS = [[22.0, 23.5], [24.5, 26.0]];
const NORTH_SLOT_U = [-33.4, 25.5];
const NORTH_BEAMS = [-25.1, -16.7, -8.3, 0.1, 8.5, 16.9]; // hart van de dwarsbalken, 8,4 m
const FACE_SLOT = { u0: -8.5, u1: 16.0, v0: 19.6, v1: 21.2 }; // langs de noordgevel boven de tussenhal
const EAST_SLOT = { u0: 26.6, u1: 32.6, v0: -12.7, v1: 20.3, beams: [-3.2, 10.8] }; // boven de doorgang
// Verlaagd dakvlak met installaties (NAP +23,4 m).
const ROOF_RECESS = { u0: -8.3, u1: 15.2, v0: 12.0, v1: 16.3, z: 21.5 };
// Dakopbouwen uit het AHN: de grote lichtkap met een flauw zadeldak (goot NAP +26,7 m,
// nok +27,7 m langs de lengteas), het installatieblok in het oosten (+25,7 m) en een
// schacht (+27,5 m).
const LANTERN = { u0: -14.2, u1: 9.3, v0: -10.4, v1: 3.9, eave: 24.75, ridge: 25.75, ridgeV: -3.25 };
const PLANT = { u0: 17.2, u1: 26.4, v0: -10.6, v1: 6.2, z: 23.75 };
const SHAFT = { u0: 14.3, u1: 18.8, v0: 11.4, v1: 15.2, z: 25.55 };
// Houten kolommen onder het dak aan de pleinzijde (0,9 m dik in plaats van circa 0,6 m),
// posities uit foto's geschat.
const WOOD_COLUMN_D = 0.9;
const WOOD_COLUMNS = [[-31.5, 24.0], [-31.5, 12.0], [-31.5, -2.5], [-31.5, -17.0]];
// Witte ronde kolommen onder de westrand van de doos (0,9 m).
const WHITE_COLUMNS = [[-27.4, 17.5], [-27.4, 10.5], [-27.4, 3.5], [-27.4, -3.5], [-27.4, -10.5], [-27.4, -18.9]];
// De glazen tussenhal tussen het museum en het woonblok (BAG), dak op NAP +11,0 m.
const HALL = { u0: -23.39, u1: 11.39, v0: 19.79, v1: 25.44, z: 9.0 };
// Het woonblok aan de noordkant (deel van hetzelfde BAG-pand): dak NAP +16,8 m, met
// lagere delen (+13,8 m) in de noordwesthoek en langs de noordgevel.
const BLOCK_POLY = [[-33.47, 27.61], [-31.33, 25.44], [12.24, 25.44], [12.24, 40.54], [10.72, 42.24], [-33.47, 42.22]];
const BLOCK_Z = 14.85;
const BLOCK_LOW = [
  [-33.6, -27.0, 36.5, 42.4],
  [-27.1, -4.0, 40.2, 42.4],
];
const BLOCK_LOW_Z = 11.85;
// Het woonblok aan de noordkant van het plein (BAG 0080100010076275, 2011): de
// PDOK-reconstructie trekt de oosthoek op tot het museumdak (+22 m), terwijl het AHN er
// +13,55 m (NAP +15,5 m) meet. Eenvoudig blok met een lagere rand (+10,65 m) langs de
// noord-, west- en oostgevel en twee trappenhuizen (+14,75 m).
const WEST_BLOCK_POLY = [[-81.12, 42.25], [-82.63, 40.53], [-82.62, 25.46], [-37.51, 25.46], [-37.5, 40.39], [-37.63, 41.0], [-37.91, 41.47], [-38.33, 41.84], [-38.83, 42.07], [-39.23, 42.13], [-60.09, 42.18]];
const WEST_BLOCK_Z = 13.55;
const WEST_BLOCK_LOW = [
  [-83, -36, 40.4, 43],
  [-83, -78.5, 36.5, 43],
  [-41.2, -36, 36.5, 43],
];
const WEST_BLOCK_LOW_Z = 10.65;
const WEST_STAIRS = [
  [-73.5, -70.5, 29.5, 34.0],
  [-49.5, -46.5, 30.5, 34.5],
];
const WEST_STAIRS_Z = 14.75;

const roundedRect = ({ u0, u1, v0, v1, rNW = 0 }, n = 12) => {
  const pts = [[u0, v0], [u1, v0], [u1, v1]];
  if (rNW > 0) {
    const c = [u0 + rNW, v1 - rNW];
    for (let i = 0; i <= n; i++) {
      const t = Math.PI / 2 + (i / n) * (Math.PI / 2);
      pts.push([c[0] + rNW * Math.cos(t), c[1] + rNW * Math.sin(t)]);
    }
  } else pts.push([u0, v1]);
  return pts;
};

// ---------- museum ----------
const plinth = box(PLINTH.u0, PLINTH.u1, PLINTH.v0, PLINTH.v1, BASE, BOX_BOTTOM + 0.01);
const whiteColumns = WHITE_COLUMNS.map(([u, v]) => cylinder([u, v], 0.45, BASE, BOX_BOTTOM + 0.01, 16));
const niche = profileX(NICHE_PROFILE, BOX.u0 - 1, BOX.u0 + NICHE_DEPTH);
const boxSolid = box(BOX.u0, BOX.u1, BOX.v0, BOX.v1, BOX_BOTTOM, BOX_TOP).subtract(niche);
const ledge = box(EAST_LEDGE.u0, EAST_LEDGE.u1, EAST_LEDGE.v0, EAST_LEDGE.v1, BOX_TOP - 0.01, EAST_LEDGE.z);
const band = prism(roundedRect(BAND), BOX_TOP - 0.01, SOFFIT + 0.01);
const hall = box(HALL.u0, HALL.u1, HALL.v0, HALL.v1 - 0.01, BASE, HALL.z);

const slotBoxes = [];
for (const [v0, v1] of NORTH_SLOT_ROWS) {
  const edges = [NORTH_SLOT_U[0], ...NORTH_BEAMS.flatMap((c) => [c - SLOT_BEAM / 2, c + SLOT_BEAM / 2]), NORTH_SLOT_U[1]];
  for (let i = 0; i < edges.length; i += 2) slotBoxes.push(box(edges[i], edges[i + 1], v0, v1, ROOF_TOP - NORTH_SLOT_DEPTH, ROOF_TOP + 1));
}
slotBoxes.push(box(FACE_SLOT.u0, FACE_SLOT.u1, FACE_SLOT.v0, FACE_SLOT.v1, SOFFIT - 1, ROOF_TOP + 1));
{
  const edges = [EAST_SLOT.v0, ...EAST_SLOT.beams.flatMap((c) => [c - SLOT_BEAM / 2, c + SLOT_BEAM / 2]), EAST_SLOT.v1];
  for (let i = 0; i < edges.length; i += 2) slotBoxes.push(box(EAST_SLOT.u0, EAST_SLOT.u1, edges[i], edges[i + 1], SOFFIT - 1, ROOF_TOP + 1));
}
const roofPlate = box(ROOF.u0, ROOF.u1, ROOF.v0, ROOF.v1, SOFFIT, ROOF_TOP).subtract(
  Manifold.union([...slotBoxes, box(ROOF_RECESS.u0, ROOF_RECESS.u1, ROOF_RECESS.v0, ROOF_RECESS.v1, ROOF_RECESS.z, ROOF_TOP + 1)]),
);
const lantern = profileX(
  [[LANTERN.v1, ROOF_TOP - 0.01], [LANTERN.v1, LANTERN.eave], [LANTERN.ridgeV, LANTERN.ridge], [LANTERN.v0, LANTERN.eave], [LANTERN.v0, ROOF_TOP - 0.01]],
  LANTERN.u0,
  LANTERN.u1,
);
const plant = box(PLANT.u0, PLANT.u1, PLANT.v0, PLANT.v1, ROOF_TOP - 0.01, PLANT.z);
const shaft = box(SHAFT.u0, SHAFT.u1, SHAFT.v0, SHAFT.v1, ROOF_RECESS.z - 0.01, SHAFT.z);
const woodColumns = WOOD_COLUMNS.map(([u, v]) => cylinder([u, v], WOOD_COLUMN_D / 2, BASE, SOFFIT + 0.01, 16));

const museum = Manifold.union([plinth, ...whiteColumns, boxSolid, ledge, band, hall, roofPlate, lantern, plant, shaft, ...woodColumns]);

// ---------- woonblok (noordkant, zelfde BAG-pand) ----------
const blockMain = prism(BLOCK_POLY, BASE, BLOCK_Z);
const blockLow = Manifold.intersection([
  prism(BLOCK_POLY, BASE - 1, 60),
  Manifold.union(BLOCK_LOW.map(([u0, u1, v0, v1]) => box(u0, u1, v0, v1, BLOCK_LOW_Z, 60))),
]);
const block = blockMain.subtract(blockLow);

const westBlock = Manifold.union([
  prism(WEST_BLOCK_POLY, BASE, WEST_BLOCK_Z).subtract(
    Manifold.union(WEST_BLOCK_LOW.map(([u0, u1, v0, v1]) => box(u0, u1, v0, v1, WEST_BLOCK_LOW_Z, 60))),
  ),
  ...WEST_STAIRS.map(([u0, u1, v0, v1]) => box(u0, u1, v0, v1, BASE, WEST_STAIRS_Z)),
]);

const nodes = [
  ["building:museum", museum],
  ["building:woonblok-noord", block],
  ["building:woonblok-plein", westBlock],
];
const all = Manifold.union([museum, block, westBlock]);
// Alleen het dak en de onderkant van de doos mogen overhangen (de export vult daaronder op).
const OVERHANG_OK = (z) => Math.abs(z - SOFFIT) < 1e-3 || Math.abs(z - BOX_BOTTOM) < 1e-3;

const META = {
  name: "Fries Museum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  // Laagste PDOK-terreinhoogte (ellipsoïdisch) op de bemonsteringspunten.
  groundHeight: 43.04,
  // Het museumpand (met tussenhal en woonblok), de ondergrondse parkeergarage onder het
  // plein (PDOK reconstrueert die tot het museumdak) en het woonblok aan het plein.
  replacesBuildings: ["0080100010076276", "0080100000376229", "0080100010076275"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (182223,8, 579283,8), het hart van de museumdoos, op het maaiveld van het Wilhelminaplein (NAP +1,95 m), +X naar het oosten langs de gevels (-6,85 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden. Node building:museum: de nieuwbouw van 2013 (Henket & partners) met het grote vlakke dak (bovenkant +22,55 m, 1,5 m dik) dat 14 m over het plein, 10 m naar het noorden en over de doorgang aan de oostkant uitkraagt, met lichtsleuven en dwarsbalken, de dichte doos (+5,3 tot +16,5 m) met de getrapte glaspui als nis, de teruggezette glazen bovenverdieping met ronde noordwesthoek, de teruggezette glazen plint met witte kolommen, vier houten kolommen aan de pleinzijde, de tussenhal (+9 m) en de dakopbouwen (lichtkap met flauw zadeldak tot +25,75 m, installatieblok, schacht). Node building:woonblok-noord: het woonblok aan de noordkant dat tot hetzelfde BAG-pand hoort (+14,85 m, lagere delen +11,85 m). Node building:woonblok-plein: het woonblok aan de noordkant van het plein als eenvoudig blok (+13,55 m, rand +10,65 m, trappenhuizen +14,75 m), omdat PDOK de oosthoek tot het museumdak optrekt. Onderkant op 0,5 m onder het maaiveld; alleen de dakplaat en de onderkant van de doos hangen over. Vervangt de PDOK-reconstructie van beide panden en van de parkeergarage onder het plein, die PDOK tot het museumdak optrekt. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    roofTopM: ROOF_TOP,
    soffitM: SOFFIT,
    boxM: [BOX_BOTTOM, BOX_TOP],
    lanternRidgeM: LANTERN.ridge,
    blockM: BLOCK_Z,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Fries_Museum",
    "PDOK BAG panden 0080100010076276, 0080100010076275 en 0080100000376229 (parkeergarage), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: de dakplaat, de lichtsleuven, de dakopbouwen, het woonblok en het maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons-foto's van de westgevel (verdiepingshoogtes, glaspui, kolommen)",
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
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
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

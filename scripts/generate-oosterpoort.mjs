// Genereert een vereenvoudigd, gesloten 3D-model van muziekcentrum De
// Oosterpoort in Groningen (Trompsingel 27, 1973): de basismassa met platte
// daken, de hoge grote zaal, het 45 graden gedraaide foyervolume aan de
// Trompsingel met de hogere schuine strook, de kleine zaal aan de achterkant,
// de binnenhof met de glazen gang, de lagere achterbouw, de gebogen glazen
// entreehoek met het kunstwerk (mast met naamschijf en blauwe bol) en de
// ramen in de voorgevel. Alle maten in meters op ware grootte. Uitvoer via
// efteling-kit.mjs: een GLB in meters (Y omhoog, één node
// `building:oosterpoort`), een catalogus-JSON en een STL op 1:<schaal>
// (standaard 1:1000).
//
//   node scripts/generate-oosterpoort.mjs
//
// Assenstelsel: oorsprong op RD (234420, 581465) op het maaiveld (NAP +3,85
// m), Z omhoog. +X loopt langs de Trompsingel (RD-richting 43,7 graden, naar
// het noordoosten), +Y 90 graden linksom (naar het noordwesten, de straat en
// het Winschoterdiep).
//
// Bronnen: BAG-pand 0014100010925285 (contour); AHN DSM/DTM 0,5 m (PDOK WCS) in
// het stelsel van het gebouw: de platte daken op NAP +11,9 en +7,9 m, de grote
// zaal (+22,6 m), het foyervolume (+13,7 m) met de schuine strook (+15,5 m), de
// kleine zaal (+15,1 m), de binnenhof, de glazen gang en het maaiveld; PDOK
// luchtfoto; Wikipedia; Wikimedia Commons-foto's (De Oosterpoort Groningen.jpg,
// Oosterpoort stad Groningen 2012 (1) en (2).jpg, 20100617 Trompsingel 27
// (Cultuurcentrum De Oosterpoort) Groningen NL.jpg) voor de voorgevel, de
// entreehoek en het kunstwerk. Geschat uit foto's: de ramen, de glazen pui,
// de maten en hoogtes van de mast, de schijf en de bol.
import { Manifold, ccw, prism, box, hull, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "oosterpoort";
const GROUND = 3.85; // NAP-hoogte van het maaiveld rondom (AHN DTM)
const z = (nap) => +(nap - GROUND).toFixed(3);
const BASE = -1;
const ORIGIN = [234420, 581465];
const ANGLE = 43.7;
const a = (ANGLE * Math.PI) / 180;
const X_AXIS = [+Math.cos(a).toFixed(6), +Math.sin(a).toFixed(6)];

// ---------- maten ----------
// BAG-pand 0014100010925285 in het lokale stelsel; de voorgevel aan de
// Trompsingel ligt op y = 48,6, met de gebogen entreehoek tussen x = 1,2 en
// 11,3.
const OUTLINE = [
  [27.1, -66.2], [27.1, -53.5], [21.0, -53.6], [21.0, -24.0], [51.0, -24.0], [51.0, 30.0], [38.3, 30.0], [38.2, 44.6],
  [37.2, 44.1], [36.1, 43.6], [33.2, 42.5], [31.8, 42.1], [28.8, 41.5], [27.3, 41.3], [24.3, 41.2], [21.2, 41.5],
  [18.3, 42.0], [16.8, 42.4], [13.9, 43.4], [12.2, 44.2], [11.2, 44.7], [11.3, 45.2], [10.9, 47.1], [10.0, 48.8],
  [8.5, 50.1], [6.6, 50.7], [4.7, 50.7], [2.9, 50.1], [1.4, 48.8], [1.2, 48.6], [-45.7, 48.6], [-45.7, 17.8],
  [-31.3, 17.8], [-31.3, -33.8], [-19.3, -33.8], [-19.3, -47.7], [-39.4, -47.7], [-39.5, -84.1], [15.4, -83.8],
  [14.9, -66.2],
];
// Basismassa met plat dak (AHN NAP +11,9 tot +12,1 m).
const MASS = z(12.0);
// Grote zaal (AHN NAP +22,6 m).
const HALL = { x: [9.8, 48.6], y: [-19.0, 18.5], top: z(22.6) };
// Foyervolume aan de Trompsingel, 45 graden gedraaid (AHN): dak NAP +13,7 m
// tussen y = 23,5 en 35,5 en de lijnen x - y = -50,5 en -2,5; aan de westkant
// een schuine strook van 6,4 m breed op NAP +15,5 m tot y = 41,5.
const FOYER = { y: [23.5, 35.5], d: [-50.5, -2.5], top: z(13.7) };
const STRIP = { y: [23.5, 41.5], d: [-59.5, -50.5], top: z(15.5) };
// Kleine zaal aan de achterkant (AHN NAP +15,1 m).
const SMALL = { x: [-33.0, -3.0], y: [-79.0, -53.3], top: z(15.1) };
// Binnenhof op maaiveld, de lage strook ervoor (NAP +7,65 m) en de glazen gang
// langs de westgevel (NAP +6,85 m).
const COURT = { x: [-28.8, -10.5], y: [-3.5, 17.5] };
const COURT_FRONT = { y: [17.5, 23.5], top: z(7.65) };
const CORRIDOR = { x: [-31.4, -28.8], y: [-33.9, 17.5], top: z(6.85) };
// Lagere achterbouw (AHN NAP +7,9 m): het zuidelijke deel en de strook aan de
// oostkant.
const LOW = z(7.9);
const LOW_ZONES = [
  [-40, -16, -90, -47.7],
  [-16, 28, -90, -53.3],
  [21, 27.5, -54, -24],
];
// Gebogen glazen entreehoek (AHN NAP +11,3 m) en het kunstwerk erboven
// (foto's): mast van 1 m tot 14 m, naamschijf van 4,4 m doorsnede op 11 m en
// een blauwe bol van 2,6 m op een voet aan de oostkant.
const ENTRY = { c: [5.65, 45.5], r: 5.2, top: z(11.3) };
const MAST = { c: [6.0, 46.4], size: 1.0, top: 14.0 };
const DISC = { z: 11.0, r: 2.2, t: 0.9 };
const SPHERE = { c: [10.2, 44.0], r: 1.3, z: 11.4 };
// Voorgevel aan de Trompsingel (foto's): glazen pui op de begane grond en een
// rij ramen op de verdieping.
const FRONT = { y: 48.6, x: [-44.5, 0.5], glass: [0, 3.6], windows: [4.6, 7.0], pitch: 3.6, half: 1.2 };

// ---------- hulpfuncties ----------
// Prisma met een profiel in het (y, z)-vlak, uitgetrokken langs X.
const alongX = (profile, x0, x1) => Manifold.extrude([ccw(profile)], x1 - x0).rotate([90, 0, 90]).translate([x0, 0, 0]);
// Parallellogram in het grondvlak tussen y0 en y1 en de lijnen x - y = d0 en d1.
const skew = (y0, y1, d0, d1) => [[y0 + d0, y0], [y0 + d1, y0], [y1 + d1, y1], [y1 + d0, y1]];

// ---------- massa ----------
const footprint = prism(OUTLINE, BASE, 40);
let mass = footprint.intersect(box(-60, -100, BASE, 60, 60, MASS));
const holes = [];
holes.push(box(COURT.x[0], COURT.y[0], 0, COURT.x[1], COURT.y[1], 40));
holes.push(box(COURT.x[0], COURT_FRONT.y[0] - 0.1, COURT_FRONT.top, COURT.x[1], COURT_FRONT.y[1], 40));
holes.push(box(CORRIDOR.x[0], CORRIDOR.y[0], CORRIDOR.top, CORRIDOR.x[1], CORRIDOR.y[1], 40));
for (const [x0, x1, y0, y1] of LOW_ZONES) holes.push(box(x0, y0, LOW, x1, y1, 40));
mass = mass.subtract(union(holes));

const parts = [mass];
parts.push(box(HALL.x[0], HALL.y[0], BASE, HALL.x[1], HALL.y[1], HALL.top));
parts.push(prism(skew(FOYER.y[0], FOYER.y[1], FOYER.d[0], FOYER.d[1]), MASS - 0.1, FOYER.top).intersect(footprint));
parts.push(prism(skew(STRIP.y[0], STRIP.y[1], STRIP.d[0], STRIP.d[1]), MASS - 0.1, STRIP.top).intersect(footprint));
parts.push(box(SMALL.x[0], SMALL.y[0], BASE, SMALL.x[1], SMALL.y[1], SMALL.top));
// Kunstwerk boven de entreehoek: mast, naamschijf met een kraag van 45 graden
// naar de mast, en de bol op een voet.
parts.push(box(MAST.c[0] - MAST.size / 2, MAST.c[1] - MAST.size / 2, MASS - 0.1, MAST.c[0] + MAST.size / 2, MAST.c[1] + MAST.size / 2, MAST.top));
const disc = Manifold.cylinder(DISC.t, DISC.r, DISC.r, 32, false).translate([MAST.c[0], MAST.c[1], DISC.z]);
const collar = Manifold.cylinder(DISC.r - MAST.size / 2, MAST.size / 2, DISC.r, 32, false).translate([MAST.c[0], MAST.c[1], DISC.z - (DISC.r - MAST.size / 2)]);
parts.push(disc, collar);
parts.push(Manifold.sphere(SPHERE.r, 32).translate([SPHERE.c[0], SPHERE.c[1], SPHERE.z]));
parts.push(Manifold.cylinder(SPHERE.z - MASS + 0.2, 0.5, 0.9, 24, false).translate([SPHERE.c[0], SPHERE.c[1], MASS - 0.1]));
let model = union(parts);

// ---------- gevelreliëf ----------
const cuts = [];
const niche = (yf, z0, z1, d) => [[yf + 1, z0], [yf - d, z0], [yf - d, Math.max(z0, z1 - d)], [yf, z1], [yf + 1, z1]];
// Glazen pui op de begane grond en een rij ramen op de verdieping.
cuts.push(alongX(niche(FRONT.y, FRONT.glass[0], FRONT.glass[1], 0.6), FRONT.x[0], FRONT.x[1]));
for (let x = FRONT.x[0] + 1.8; x < FRONT.x[1] - 1; x += FRONT.pitch) {
  cuts.push(alongX(niche(FRONT.y, FRONT.windows[0], FRONT.windows[1], 0.35), x - FRONT.half, x + FRONT.half));
}
// Gebogen glazen entreehoek: ring 0,6 m terug onder de dakrand.
const entryRing = Manifold.cylinder(ENTRY.top - 0.8, ENTRY.r + 1.0, ENTRY.r + 1.0, 48, false)
  .subtract(Manifold.cylinder(ENTRY.top, ENTRY.r - 0.6, ENTRY.r - 0.6, 48, false).translate([0, 0, -0.1]))
  .translate([ENTRY.c[0], ENTRY.c[1], 0]);
cuts.push(entryRing.intersect(box(0, 44.5, 0, 12, 52, 10)));
model = model.subtract(union(cuts));

if (model.status() !== "NoError") throw new Error(model.status());
if (model.decompose().length !== 1) throw new Error(`losse delen: ${model.decompose().length}`);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:oosterpoort", model]],
  catalog: {
    name: "De Oosterpoort",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: -0.3,
    // Trompsingel voor de voorgevel en het terrein aan de zuid- en oostkant
    // (AHN NAP +3,7 tot +3,9 m).
    groundSamplePoints: [
      [-30, 52],
      [-36, -40],
      [32, -40],
    ],
    // Laagste PDOK-terreinhoogte op die punten, ellipsoïdisch zoals de export
    // bemonstert (gemeten 2026-10-09), als terugval voor een uitsnede die geen
    // van de punten bevat.
    groundHeight: 44.53,
    replacesBuildings: ["NL.IMBAG.Pand.0014100010925285"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt RD (234420, 581465) op het maaiveld (NAP +3,85 m) in de oorsprong, +X langs de Trompsingel (RD-richting 43,7 graden) en +Y naar de straat aan de noordwestkant. Eén node: de basismassa, de grote zaal, het gedraaide foyervolume met de schuine strook, de kleine zaal, de binnenhof met de glazen gang, de lagere achterbouw, de entreehoek met het kunstwerk en de ramen in de voorgevel. Vervangt de PDOK-reconstructie van BAG-pand 0014100010925285.",
    realWorld: {
      groundNapM: GROUND,
      massNapM: 12.0,
      hallNapM: 22.6,
      foyerNapM: 13.7,
      stripNapM: 15.5,
      smallHallNapM: 15.1,
      rearNapM: 7.9,
      axisDegrees: ANGLE,
      estimates: [
        "glazen pui en ramen in de voorgevel, de glazen entreehoek",
        "mast, naamschijf en blauwe bol van het kunstwerk (maten en hoogtes uit foto's)",
      ],
    },
    sources: [
      "https://nl.wikipedia.org/wiki/De_Oosterpoort",
      "PDOK BAG pand 0014100010925285, EPSG:28992",
      "PDOK AHN DSM/DTM 0,5 m via WCS: daken, zalen, foyervolume, binnenhof, gang, achterbouw en maaiveld",
      "PDOK luchtfoto (Actueel_orthoHR)",
      "Wikimedia Commons: De Oosterpoort Groningen.jpg, Oosterpoort stad Groningen 2012 (1).jpg, Oosterpoort stad Groningen 2012 (2).jpg, 20100617 Trompsingel 27 (Cultuurcentrum De Oosterpoort) Groningen NL.jpg",
    ],
  },
});

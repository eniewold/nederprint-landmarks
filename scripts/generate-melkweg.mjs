// Genereert een vereenvoudigd, gesloten 3D-model van poppodium Melkweg in
// Amsterdam (Lijnbaansgracht 234A): de voormalige zuivelfabriek aan de gracht
// met de lange hal onder een schilddak en het pand met de topgevel en de
// neonletters, de glazen entree op het dek, het middendeel met installaties,
// de rij grachtpanden aan de Marnixstraat die bij hetzelfde BAG-pand horen, en
// de donkere zaaldoos van The Max met daarboven de Rabozaal: de rode doos, de
// hoge doos met het licht hellende dak, het lagere westblok en de uitkragende
// glazen doos langs de gracht. Alle maten in meters op ware grootte. Uitvoer
// via efteling-kit.mjs: een GLB in meters (Y omhoog, één node
// `building:melkweg`), een catalogus-JSON en een STL op 1:<schaal>
// (standaard 1:1000).
//
//   node scripts/generate-melkweg.mjs
//
// Assenstelsel: oorsprong op RD (120540, 486440) op het maaiveld van de
// Marnixstraat (NAP +1,85 m), Z omhoog. +X loopt langs de Lijnbaansgracht
// (RD-richting -50,5 graden, naar het zuidoosten, de Stadsschouwburg), +Y 90
// graden linksom (naar het noordoosten, de gracht).
//
// Bronnen: BAG-panden 0363100012168735 en 0363100012173457 (contouren); AHN
// DSM/DTM 0,5 m (PDOK WCS) in het stelsel langs de gracht: de daken van de
// grachtpanden, de hal, de topgevel, het middendeel, de installaties, de zalen
// en de glazen strook, en het maaiveld; PDOK luchtfoto; Wikipedia; Wikimedia
// Commons-foto's (Melkweg en Rabozaal.jpg, Amsterdam, Stadsschouwburg en
// Melkweg, Rabo Zaal.jpg, Amsterdam, Rabozaal Stadsschouwburg vanaf hoek
// Lijnbaansgracht-Leidsegracht01.JPG, de RCE-foto's van de gevel aan de
// Lijnbaansgracht). Geschat uit foto's: de onderkant van de uitkragende
// glazen doos, de glazen stroken, de ramen, de hoogte van de entree en de
// vensters in de topgevel.
import { Manifold, CrossSection, ccw, prism, box, hull, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "melkweg";
const GROUND = 1.85; // NAP-hoogte van de Marnixstraat (AHN DTM)
const z = (nap) => +(nap - GROUND).toFixed(3);
const BASE = -2.5; // onder het dek en de kade aan de gracht (NAP -0,65 m)
const ORIGIN = [120540, 486440];
const ANGLE = -50.5;
const a = (ANGLE * Math.PI) / 180;
const X_AXIS = [+Math.cos(a).toFixed(6), +Math.sin(a).toFixed(6)];

// ---------- maten ----------
// BAG-pand 0363100012168735 (Melkweg) en 0363100012173457 (noordhelft van de
// zaaldoos) in het lokale stelsel, zonder trapjes onder 0,5 m.
const MELKWEG = [
  [-29.2, -26.5], [-22.0, -27.3], [-14.8, -27.6], [-7.8, -27.1], [6.8, -26.3], [6.0, -14.3], [5.7, -9.8], [6.6, -9.8],
  [6.6, -8.4], [28.8, -8.6], [29.2, -2.3], [29.8, 6.8], [30.7, 19.4], [19.4, 19.9], [19.6, 10.2], [5.2, 10.4],
  [5.2, 12.8], [-5.2, 12.9], [-5.3, 7.9], [-30.0, 8.1], [-29.8, -11.7],
];
const NOORD = [
  [10.0, 10.3], [19.6, 10.2], [19.4, 19.9], [30.7, 19.4], [29.8, 6.8], [53.5, 5.9], [54.1, 14.9], [54.1, 22.7], [10.5, 24.1],
];
// Grachtpanden aan de Marnixstraat (AHN, tot y = -14,5): plat dak, zadeldaken
// met de nok dwars op de straat, het brede platte pand en een lessenaar.
// [x0, x1, soort, nok/dak, goot, x van de nok]
const HOUSES = [
  [-29.8, -23.4, "flat", z(21.9)],
  [-23.4, -16.2, "gable", z(22.9), z(17.5), -19.5],
  [-16.2, -9.3, "gable", z(23.0), z(17.9), -12.2],
  [-9.3, -6.8, "gable", z(22.4), z(18.9), -7.8],
  [-6.8, 3.9, "flat", z(24.1)],
  [3.9, 7.0, "shed", z(22.5), z(18.5)],
];
const HOUSE_BACK = -14.5;
const BACKYARD = { y: [HOUSE_BACK, -9.6], top: z(6.2) };
// Lange hal (AHN): schilddak met een vlakke kam op NAP +10,6 m tussen y = -5
// en 4, goot aan de Marnixstraatkant NAP +6,0 m (y = -9,8) en aan de gracht
// NAP +6,5 m (y = 8,0).
const HALL = { x: [-30.0, -8.0], profile: [[-9.8, z(6.0)], [-5.0, z(10.6)], [4.0, z(10.6)], [8.05, z(6.5)]] };
// Pand met de topgevel aan de gracht (AHN): nok NAP +15,6 m op x = -0,75,
// goten NAP +11,0 m; aan de zuidkant een plat deel op NAP +12,2 m.
const GABLE = { x: [-8.0, 5.2], ridge: z(15.6), eave: z(11.0), ridgeX: -0.75, y: [-5.0, 8.05], south: z(12.2) };
// Vensters in de topgevel (foto): drie grote ramen op de verdieping.
const GABLE_WINDOWS = { x: [-4.6, -0.75, 3.1], half: 1.3, z: [4.6, 8.0] };
// Glazen entree op het dek voor de topgevel (AHN NAP +4,95 m).
const ENTRY = { x: [-5.2, 5.2], y: [8.0, 12.85], top: z(4.95) };
// Middendeel (AHN): plat dak NAP +11,25 m, lager deel aan de zuidkant NAP
// +8,0 m, installaties tot NAP +13,85 m.
const MIDDLE = { x: [5.2, 19.8], top: z(11.25), lowY: -4.0, low: z(8.0) };
const UNITS = [8.0, 17.0, -0.5, 4.6, z(13.85)];
// Zaaldoos: rode doos NAP +32,3 m tot x = 33, daarna de hoge doos met een dak
// dat van NAP +35,4 m (x = 33) naar +37,5 m (x = 55) oploopt.
const RED = { x0: 19.8, top: z(32.3) };
const HIGH = { x0: 33.0, top0: z(35.4), slope: (37.5 - 35.4) / 22 };
// Westblok (AHN NAP +20,0 m) en de strook langs de gracht met de uitkragende
// glazen doos (bovenkant NAP +20,0 m, onderkant geschat op 7 m).
const WEST_BLOCK = { x: [10.0, 19.8], top: z(20.0) };
const STRIP = { y0: 19.4, top: z(20.0), bottom: 7.0, glass: [12.5, 17.6] };
// Rij smalle ramen hoog in de zaaldoos aan de gracht (foto).
const BOX_WINDOWS = { x0: 22.0, x1: 52.0, pitch: 2.4, half: 0.45, z: [22.5, 26.0] };

// ---------- hulpfuncties ----------
const footM = prism(MELKWEG, BASE, 60);
// Beide panden samen: de zaaldoos loopt over de grens heen en wordt per
// bouwdeel met rechte grenzen opgebouwd, niet per pand.
const footAll = union([footM, prism(NOORD, BASE, 60)]);
// Prisma met een profiel in het (x, z)-vlak, uitgetrokken langs Y.
const alongY = (profile, y0, y1) => Manifold.extrude([ccw(profile)], y1 - y0).rotate([90, 0, 0]).translate([0, y1, 0]);
// Prisma met een profiel in het (y, z)-vlak, uitgetrokken langs X.
const alongX = (profile, x0, x1) => Manifold.extrude([ccw(profile)], x1 - x0).rotate([90, 0, 90]).translate([x0, 0, 0]);
// Nis met een plafond van 45 graden in een gevel loodrecht op Y.
const nicheY = (yf, dir, x0, x1, z0, z1, d) =>
  alongX([[0, z0], [d, z0], [d, Math.max(z0, z1 - d)], [0, z1], [-1, z1], [-1, z0]].map(([s, zz]) => [yf + dir * s, zz]), x0, x1);

// ---------- Melkweg (168735) ----------
const parts = [];
// Grachtpanden.
for (const [x0, x1, kind, top, eave, rx] of HOUSES) {
  let profile;
  if (kind === "flat") profile = [[x0, BASE], [x1, BASE], [x1, top], [x0, top]];
  else if (kind === "gable") profile = [[x0, BASE], [x1, BASE], [x1, eave], [rx, top], [x0, eave]];
  else profile = [[x0, BASE], [x1, BASE], [x1, eave], [x0, top]];
  parts.push(alongY(profile, -30, HOUSE_BACK).intersect(footM));
}
parts.push(box(-31, BACKYARD.y[0] - 0.1, BASE, 7, BACKYARD.y[1], BACKYARD.top).intersect(footM));
// Lange hal.
parts.push(alongX([[-9.8, BASE], [8.05, BASE], ...HALL.profile.slice().reverse()], HALL.x[0] - 1, HALL.x[1] + 0.05).intersect(footM));
// Topgevel.
parts.push(alongY([[GABLE.x[0], BASE], [GABLE.x[1], BASE], [GABLE.x[1], GABLE.eave], [GABLE.ridgeX, GABLE.ridge], [GABLE.x[0], GABLE.eave]], GABLE.y[0], GABLE.y[1]));
parts.push(box(GABLE.x[0], -9.9, BASE, GABLE.x[1], GABLE.y[0] + 0.1, GABLE.south));
// Glazen entree op het dek.
parts.push(box(ENTRY.x[0], ENTRY.y[0] - 0.1, BASE, ENTRY.x[1], ENTRY.y[1], ENTRY.top));
// Middendeel en installaties.
parts.push(box(MIDDLE.x[0] - 0.1, MIDDLE.lowY, BASE, MIDDLE.x[1] + 0.1, 10.35, MIDDLE.top).intersect(footM));
parts.push(box(MIDDLE.x[0] - 0.1, -9, BASE, MIDDLE.x[1] + 0.1, MIDDLE.lowY + 0.1, MIDDLE.low).intersect(footM));
parts.push(box(UNITS[0], UNITS[2], MIDDLE.top - 0.1, UNITS[1], UNITS[3], UNITS[4]));
// Zaaldoos van The Max en de Rabozaal: rode doos, westblok, hoge doos en de
// strook langs de gracht met de uitkragende glazen doos.
const redPlan = [[RED.x0 - 0.3, -9], [HIGH.x0, -9], [HIGH.x0, STRIP.y0], [30.7, STRIP.y0], [19.4, 19.9], [RED.x0 - 0.3, 19.9]];
parts.push(prism(redPlan, BASE, RED.top).intersect(footAll));
parts.push(box(WEST_BLOCK.x[0], 10.0, BASE, WEST_BLOCK.x[1], STRIP.y0 + 0.6, WEST_BLOCK.top).intersect(footAll));
const highTop = (x) => HIGH.top0 + HIGH.slope * (x - HIGH.x0);
parts.push(alongY([[HIGH.x0 - 0.1, BASE], [56, BASE], [56, highTop(56)], [HIGH.x0 - 0.1, highTop(HIGH.x0 - 0.1)]], -9, STRIP.y0 + 0.1).intersect(footAll));
parts.push(box(9, STRIP.y0 - 0.1, STRIP.bottom, 56, 25, STRIP.top).intersect(footAll));
let model = union(parts);

// ---------- gevelreliëf ----------
const cuts = [];
// Grote ramen in de topgevel en de glazen entree (0,4 m terug).
for (const x of GABLE_WINDOWS.x) cuts.push(nicheY(GABLE.y[1], -1, x - GABLE_WINDOWS.half, x + GABLE_WINDOWS.half, GABLE_WINDOWS.z[0], GABLE_WINDOWS.z[1], 0.4));
cuts.push(nicheY(ENTRY.y[1], -1, ENTRY.x[0] + 0.6, ENTRY.x[1] - 0.6, 0, ENTRY.top - 0.6, 0.4));
// Glazen band in de uitkragende doos, over de hele lengte langs de gracht.
const stripFace = (x) => 24.1 + ((22.7 - 24.1) * (x - 10.5)) / (54.1 - 10.5);
for (let x = 11; x < 53; x += 6) {
  const y = Math.min(stripFace(x), stripFace(x + 6));
  cuts.push(nicheY(y, -1, x, Math.min(x + 6, 53.5), STRIP.glass[0], STRIP.glass[1], 0.5));
}
// Rij smalle ramen hoog in de zaaldoos.
// De gevel van de rode doos loopt schuin van y = 19,9 (x = 19,4) naar 19,4
// (x = 30,7), langs de BAG-grens.
const boxFace = (x) => (x < 30.7 ? 19.9 + ((19.4 - 19.9) * (x - 19.4)) / (30.7 - 19.4) : STRIP.y0);
for (let x = BOX_WINDOWS.x0; x <= BOX_WINDOWS.x1; x += BOX_WINDOWS.pitch) {
  const y = Math.min(boxFace(x - BOX_WINDOWS.half), boxFace(x + BOX_WINDOWS.half));
  cuts.push(nicheY(y, -1, x - BOX_WINDOWS.half, x + BOX_WINDOWS.half, BOX_WINDOWS.z[0], BOX_WINDOWS.z[1], 0.35));
}
// Glazen benedenverdieping van het westblok aan de gracht (0,6 m terug).
cuts.push(nicheY(STRIP.y0 + 0.5, -1, WEST_BLOCK.x[0] + 0.5, WEST_BLOCK.x[1], 0, STRIP.bottom - 0.6, 0.6));
// Ramen in de grachtpanden aan de Marnixstraat: per verdieping van 3 m een
// raam van 1 × 1,8 m om de 2,2 m, 0,35 m diep (foto's van de straat
// ontbreken; gebruikelijke indeling van de grachtpanden).
const streetFace = (x) => {
  const pts = MELKWEG.slice(0, 5);
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) return pts[i - 1][1] + ((pts[i][1] - pts[i - 1][1]) * (x - pts[i - 1][0])) / (pts[i][0] - pts[i - 1][0]);
  return pts.at(-1)[1];
};
for (const [x0, x1, kind, top, eave] of HOUSES) {
  const wall = kind === "flat" ? top : eave;
  const n = Math.max(1, Math.floor((x1 - x0 - 0.8) / 2.2));
  const step = (x1 - x0) / n;
  for (let k = 0; k < n; k++) {
    const xc = x0 + step * (k + 0.5);
    for (let zf = 3.4; zf + 1.8 < wall - 0.8; zf += 3.0) {
      const y = Math.max(streetFace(xc - 0.5), streetFace(xc + 0.5));
      cuts.push(nicheY(y, 1, xc - 0.5, xc + 0.5, zf, zf + 1.8, 0.35));
    }
  }
}
// Vensters met een spitse bovenkant in de hal aan de gracht (RCE-foto's).
for (let x = -28.0; x <= -10.0; x += 3.6) {
  cuts.push(
    alongY(
      [[x - 0.7, 0.8], [x + 0.7, 0.8], [x + 0.7, 3.2], [x, 4.0], [x - 0.7, 3.2]],
      HALL.profile.at(-1)[0] - 0.35,
      HALL.profile.at(-1)[0] + 1,
    ),
  );
}
model = model.subtract(union(cuts));

if (model.status() !== "NoError") throw new Error(model.status());
if (model.decompose().length !== 1) throw new Error(`losse delen: ${model.decompose().length}`);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:melkweg", model]],
  catalog: {
    name: "Melkweg",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: -0.3,
    // Marnixstraat voor de grachtpanden (AHN NAP +1,8 m), niet de kade en het
    // dek aan de Lijnbaansgracht.
    groundSamplePoints: [
      [-20, -29.5],
      [0, -29.5],
      [15, -29.5],
    ],
    // Laagste PDOK-terreinhoogte op die punten, ellipsoïdisch zoals de export
    // bemonstert (gemeten 2026-10-09), als terugval voor een uitsnede die geen
    // van de punten bevat.
    groundHeight: 44.75,
    replacesBuildings: ["NL.IMBAG.Pand.0363100012168735", "NL.IMBAG.Pand.0363100012173457"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt RD (120540, 486440) op het maaiveld van de Marnixstraat (NAP +1,85 m) in de oorsprong, +X langs de Lijnbaansgracht naar de Stadsschouwburg (RD-richting -50,5 graden) en +Y naar de gracht. Eén node: de grachtpanden aan de Marnixstraat, de lange hal, het pand met de topgevel, de glazen entree, het middendeel en de zaaldoos van The Max en de Rabozaal met de uitkragende glazen doos. Vervangt BAG-panden 0363100012168735 en 0363100012173457; het deel van de zaaldoos op het pand van de Stadsschouwburg blijft PDOK.",
    realWorld: {
      groundNapM: GROUND,
      hallRidgeNapM: 10.6,
      gableRidgeNapM: 15.6,
      redBoxNapM: 32.3,
      highBoxNapM: [35.4, 37.5],
      stripNapM: 20.0,
      axisDegrees: ANGLE,
      estimates: [
        "onderkant van de uitkragende glazen doos (7 m) en de glazen band erin",
        "vensters in de topgevel, de glazen entree en de rij ramen in de zaaldoos",
        "goten van de grachtpanden waar het AHN tussen twee panden valt",
      ],
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Melkweg_(Amsterdam)",
      "PDOK BAG panden 0363100012168735 en 0363100012173457, EPSG:28992",
      "PDOK AHN DSM/DTM 0,5 m via WCS: daken, nokken, goten, installaties, zalen, glazen strook en maaiveld",
      "PDOK luchtfoto (Actueel_orthoHR)",
      "Wikimedia Commons: Melkweg en Rabozaal.jpg, Amsterdam, Stadsschouwburg en Melkweg, Rabo Zaal.jpg, Amsterdam, Rabozaal Stadsschouwburg vanaf hoek Lijnbaansgracht-Leidsegracht01.JPG, Overzicht voorzijde aan de Lijnbaansgracht - Amsterdam - 20002717 - RCE.jpg",
    ],
  },
});

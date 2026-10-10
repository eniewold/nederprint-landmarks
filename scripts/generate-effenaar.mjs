// Genereert een vereenvoudigd, gesloten 3D-model van poppodium Effenaar in
// Eindhoven (Dommelstraat 2, MVRDV, 2005): de doos van 26,5 × 39,8 m met het
// platte dak op 22 m en de buitentrappen die als hellende bouwdelen tegen de
// gevels liggen. Aan de Dommelstraat (noordgevel) stijgt de trap van de
// oosthoek naar het bordesblok boven de glazen entree en loopt als vrije vlucht
// door naar de noordwesthoek (16 m), en vandaar langs de westgevel naar een
// bordes op 19,7 m; aan het plein (zuidgevel) stijgt een trap van de westhoek
// naar een bordes op de zuidoosthoek (17,6 m), dat langs de oostgevel
// doorloopt naar 20,7 m. Verder de glazen stroken, panelen en het donkere vlak
// in de noordgevel, de rij kleine ramen in de oostgevel, het entreeblok aan de
// oostkant en de installaties op het dak. Alle maten in meters op ware
// grootte. Uitvoer via efteling-kit.mjs: een GLB in meters (Y omhoog, één node
// `building:effenaar`), een catalogus-JSON en een STL op 1:<schaal>
// (standaard 1:1000).
//
//   node scripts/generate-effenaar.mjs
//
// Assenstelsel: oorsprong op RD (161677.5, 383632.5) op het maaiveld (NAP
// +16,0 m), Z omhoog. +X loopt langs de gevels aan het plein en de
// Dommelstraat (RD-richting 12,2 graden, naar het oostnoordoosten), +Y 90
// graden linksom (naar het noordnoordwesten, de Dommelstraat).
//
// Bronnen: BAG-pand 0772100000354810 (contour, met de stroken van de trappen);
// AHN DSM/DTM 0,5 m (PDOK WCS) in het stelsel van het gebouw: dak NAP +37,95 m,
// de hellingen en bordessen van de trappen, het entreeblok, de installaties en
// het maaiveld; PDOK luchtfoto; Wikipedia; Wikimedia Commons-foto's (Effenaar
// - panoramio.jpg, Poppodium De Effenaar.jpg, Effenaar.jpg, Stairs Effenaar
// Eindhoven.jpg) voor de noordgevel, de trap naar het bordesblok en de ramen
// in de oostgevel. Geschat uit foto's: de dikte van de trappen, het bordesblok,
// de stroken, panelen en het donkere vlak, de entree en de kleine ramen.
import { Manifold, ccw, box, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "effenaar";
const GROUND = 16.0; // NAP-hoogte van het maaiveld rondom (AHN DTM)
const z = (nap) => nap - GROUND;
const BASE = -1;
const ORIGIN = [161677.5, 383632.5];
const ANGLE = 12.2;
const a = (ANGLE * Math.PI) / 180;
const X_AXIS = [+Math.cos(a).toFixed(6), +Math.sin(a).toFixed(6)];

// ---------- maten ----------
// De doos (AHN-dakrand): gevels op x = -13,1 en 13,45, y = -20,2 en 19,6; plat
// dak op NAP +37,95 m. De BAG-contour loopt om de trappen heen tot y = -21,35
// (plein) en 21,4 (Dommelstraat), met uitbouwen aan de west- en oostkant.
const BOX = { x: [-13.1, 13.45], y: [-20.2, 19.6], top: z(37.95) };
const THICK = 3.0; // dikte van een vrije trapvlucht of bordes
const BAND = 1.5; // dikte van de trapband boven een dichte invulling
const RECESS = 0.4; // zo ver ligt de invulling onder een trap terug (foto)
// Trap aan de Dommelstraat (AHN, strook y = 19,6 tot 21,4; foto panoramio):
// vanaf de oosthoek een dichte trap met een tussenbordes op 7,1 m naar het
// bordesblok boven de entree (10,4 m, onderkant 4,8 m), daarna vrije vluchten
// via een bordes op 13,2 m naar het bovenste bordes op 15,8 m op de
// noordwesthoek. Punten [x, bovenkant].
const NORTH = { y: [BOX.y[1], 21.4], blockBottom: 4.8 };
const N_LOW = [[13.45, 2.8], [6.5, 7.1], [5.0, 7.1], [0.8, 10.4]];
const N_BLOCK = [-2.5, 0.8, 10.4];
const N_HIGH = [[-2.5, 10.4], [-4.5, 13.2], [-6.5, 13.2], [-8.5, 15.8], [-15.1, 15.8]];
// Doorloop langs de westgevel (uitbouw x = -15,1 tot -13,1) naar het bordes op
// 19,7 m tussen y = 9,5 en 16,5 (AHN). Punten [y, bovenkant].
const WEST = { x: [-15.1, BOX.x[0]], line: [[21.4, 15.8], [16.5, 19.7], [9.5, 19.7]] };
// Trap aan het plein (AHN, strook y = -21,35 tot -20,2): vluchten en
// bordessen van de westhoek naar het bordes op de zuidoosthoek (17,6 m), als
// vrije band tegen de gevel (geen foto van deze kant). Punten [x, bovenkant].
const SOUTH = { y: [-21.35, BOX.y[0]], high: 17.6, band: 1.8 };
const S_LINE = [[-13.1, 2.3], [-11.0, 3.5], [-9.0, 6.3], [-7.0, 6.3], [-4.0, 9.7], [-1.0, 9.7], [1.0, 12.1], [3.0, 12.1], [4.5, 14.3], [6.0, 14.3], [9.5, 17.6], [15.3, 17.6]];
// Oostkant (uitbouw x = 13,45 tot 15,3, AHN): bordes op 17,6 m tot y = -18,5,
// vlucht naar 20,7 m op y = -12 en een entreeblok van 6 m tussen y = -10 en
// -4,5.
const EAST = { x: [BOX.x[1], 15.3], landing: -18.5, flightEnd: -12.0, flightTop: 20.7, entrance: [-10.0, -4.5], entranceTop: 6.0 };
// Installaties op het dak (AHN).
const UNITS = [
  [4.6, 6.2, 9.6, 11.4, z(39.6)],
  [2.0, 3.4, -1.4, 1.4, z(38.9)],
  [0.0, 6.4, -17.2, -15.6, z(38.8)],
];
// Noordgevel (foto panoramio, frontaal, 75 px/m vanaf de westhoek): glazen
// stroken en geperforeerde panelen bovenin, een lager raam en paneel aan de
// westkant, het grote donkere vlak met de letters, de glazen entree onder
// het bordesblok en de geribde panelen aan de oostkant. [x0, x1, z0, z1, diepte]
const N_RELIEF = [
  [0.1, 3.9, 15.5, 21.3, 0.35],
  [-4.4, -0.1, 15.2, 21.0, 0.2],
  [-6.9, -4.6, 14.8, 20.5, 0.35],
  [-12.2, -7.2, 14.0, 20.0, 0.35],
  [-12.4, -9.8, 10.5, 13.5, 0.35],
  [-12.6, -9.3, 7.5, 10.3, 0.2],
  [-11.8, 6.1, 4.8, 14.0, 0.3],
  [6.4, 12.9, 9.5, 14.5, 0.2],
];
const ENTRANCE = [-13.1, 0.1, 4.6];
// Oostgevel: rij van acht kleine vierkante ramen hoog in het lichte beton.
const E_WINDOWS = { y: [-1.5, 1.0, 3.5, 6.0, 8.5, 11.0, 13.5, 16.0], z: [17.0, 18.6], half: 0.7 };

// ---------- hulpfuncties ----------
// Prisma met een profiel in het (x, z)-vlak, uitgetrokken langs Y van y0 tot y1.
const alongY = (profile, y0, y1) => Manifold.extrude([ccw(profile)], y1 - y0).rotate([90, 0, 0]).translate([0, y1, 0]);
// Prisma met een profiel in het (y, z)-vlak, uitgetrokken langs X van x0 tot x1.
const alongX = (profile, x0, x1) => Manifold.extrude([ccw(profile)], x1 - x0).rotate([90, 0, 90]).translate([x0, 0, 0]);
// Nis met een plafond van 45 graden in een gevel loodrecht op Y (gevel op
// y = yf, naar binnen in richting dir) of loodrecht op X.
const niche = (yf, dir, z0, z1, d) => [[0, z0], [d, z0], [d, Math.max(z0, z1 - d)], [0, z1], [-1, z1], [-1, z0]].map(([s, zz]) => [yf + dir * s, zz]);
const nicheY = (yf, dir, x0, x1, z0, z1, d) => alongX(niche(yf, dir, z0, z1, d), x0, x1);
const nicheX = (xf, dir, y0, y1, z0, z1, d) => alongY(niche(xf, dir, z0, z1, d), y0, y1);

// ---------- trappen ----------
// De trappen worden twee keer opgebouwd: tegen de gevel (0,1 m erin) en als
// "schaduw" die 2 m de doos in loopt, zodat het gevelreliëf niet achter een
// trap wordt uitgesneden.
// Band onder een lijn van punten: bovenkant de lijn, onderkant de lijn min de
// dikte. Dicht: van de lijn tot de onderkant van het model.
const band = (line, thick) => [...line, ...line.map(([p, q]) => [p, q - thick]).reverse()];
const solid = (line, below) => [...line.map(([p, q]) => [p, q - below]), [line.at(-1)[0], BASE], [line[0][0], BASE]];
function stairs(reach) {
  const parts = [];
  const ny = [NORTH.y[0] - reach, NORTH.y[1]];
  // Dommelstraat: trapband van 1,5 m over de volle diepte, met eronder een
  // dichte invulling die 0,4 m terugligt (panelen); dan het bordesblok en de
  // vrije vluchten van 3 m dik.
  parts.push(alongY(band(N_LOW, BAND), ...ny));
  parts.push(alongY(solid(N_LOW, BAND - 0.1), ny[0], ny[1] - RECESS));
  parts.push(box(N_BLOCK[0], ny[0], NORTH.blockBottom, N_BLOCK[1] + 0.1, ny[1], N_BLOCK[2]));
  parts.push(alongY(band(N_HIGH, THICK), ...ny));
  // Langs de westgevel naar het bordes.
  parts.push(alongX(band(WEST.line, THICK), WEST.x[0], WEST.x[1] + reach));
  // Plein: vrije trapband van 1,8 m dik tegen de gevel tot het bordes op de
  // zuidoosthoek; het onderste stuk staat op het maaiveld.
  const sy = [SOUTH.y[0], SOUTH.y[1] + reach];
  parts.push(alongY(band(S_LINE, SOUTH.band), ...sy));
  parts.push(alongY(solid(S_LINE.slice(0, 2), SOUTH.band - 0.1), ...sy));
  // Oostkant: bordes, vlucht naar 20,7 m en het entreeblok.
  parts.push(box(EAST.x[0] - reach, SOUTH.y[0], SOUTH.high - THICK, EAST.x[1], EAST.landing, SOUTH.high));
  parts.push(
    alongX(
      [[EAST.landing - 0.1, SOUTH.high - THICK], [EAST.flightEnd, EAST.flightTop - THICK], [EAST.flightEnd, EAST.flightTop], [EAST.landing - 0.1, SOUTH.high]],
      EAST.x[0] - reach,
      EAST.x[1],
    ),
  );
  parts.push(box(EAST.x[0] - reach, EAST.entrance[0], BASE, EAST.x[1], EAST.entrance[1], EAST.entranceTop));
  return union(parts);
}

// ---------- gevelreliëf (alleen in de doos, niet achter de trappen) ----------
const cuts = [];
cuts.push(nicheY(BOX.y[1], -1, ENTRANCE[0], ENTRANCE[1], BASE, ENTRANCE[2], 1.0));
for (const [x0, x1, z0, z1, d] of N_RELIEF) cuts.push(nicheY(BOX.y[1], -1, x0, x1, z0, z1, d));
for (const y of E_WINDOWS.y) cuts.push(nicheX(BOX.x[1], -1, y - E_WINDOWS.half, y + E_WINDOWS.half, E_WINDOWS.z[0], E_WINDOWS.z[1], 0.35));
const shell = box(BOX.x[0], BOX.y[0], BASE, BOX.x[1], BOX.y[1], BOX.top).subtract(union(cuts).subtract(stairs(2.0)));
const roof = UNITS.map(([x0, x1, y0, y1, top]) => box(x0, y0, BOX.top - 0.1, x1, y1, top));
const model = union([shell, stairs(0.1), ...roof]);

if (model.status() !== "NoError") throw new Error(model.status());
if (model.decompose().length !== 1) throw new Error(`losse delen: ${model.decompose().length}`);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:effenaar", model]],
  catalog: {
    name: "Effenaar",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: -0.3,
    // Plein aan de zuidkant, het pad aan de westkant, de Dommelstraat en de
    // doorgang aan de oostkant (AHN NAP +15,7 tot +16,1 m).
    groundSamplePoints: [
      [0, -25],
      [-19, 0],
      [0, 25],
      [18, -15],
    ],
    // Laagste PDOK-terreinhoogte op die punten, ellipsoïdisch zoals de export
    // bemonstert (gemeten 2026-10-09), als terugval voor een uitsnede die geen
    // van de punten bevat.
    groundHeight: 59.73,
    replacesBuildings: ["NL.IMBAG.Pand.0772100000354810"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt RD (161677.5, 383632.5) op het maaiveld (NAP +16,0 m) in de oorsprong, +X langs de gevels aan het plein en de Dommelstraat (RD-richting 12,2 graden) en +Y naar de Dommelstraat. Eén node: de doos met plat dak, de buitentrappen aan de Dommelstraat, de westgevel, het plein en de oostkant, het bordesblok boven de entree, het gevelreliëf en de installaties. Vervangt de PDOK-reconstructie van BAG-pand 0772100000354810.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: 37.95,
      boxM: [26.55, 39.8, 21.95],
      northStairTopM: 15.8,
      westLandingM: 19.7,
      southLandingM: SOUTH.high,
      eastFlightTopM: EAST.flightTop,
      axisDegrees: ANGLE,
      estimates: [
        "dikte van de vrije trapvluchten en bordessen (3 m) en het bordesblok boven de entree",
        "glazen stroken, panelen, het donkere vlak en de entree in de noordgevel (één frontale foto)",
        "de kleine ramen in de oostgevel",
      ],
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Effenaar",
      "PDOK BAG pand 0772100000354810, EPSG:28992",
      "PDOK AHN DSM/DTM 0,5 m via WCS: dak, trappen, bordessen, entreeblok, installaties en maaiveld",
      "PDOK luchtfoto (Actueel_orthoHR)",
      "Wikimedia Commons: Effenaar - panoramio.jpg, Poppodium De Effenaar.jpg, Effenaar.jpg, Stairs Effenaar Eindhoven.jpg, 13-06-28-eindhoven-by-RalfR-51.jpg",
    ],
  },
});

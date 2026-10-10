// Genereert een vereenvoudigd, gesloten 3D-model van poppodium Patronaat in
// Haarlem (Zijlsingel 2, DiederenDirrix, 2005): de voorbouw aan de Zijlsingel
// met de glazen begane grond, de uitstekende glazen doos met kader op de
// verdieping, de glazen kolom bij de entree en de gaasband erboven met
// verticale naden, de grote zaal met de lichtstraat, de hoge strook met
// installaties langs de zaal, de lage aanbouw aan de noordkant en het
// achterdeel aan de Ruychaverstraat. Alle maten in meters op ware grootte.
// Uitvoer via efteling-kit.mjs: een GLB in meters (Y omhoog, één node
// `building:patronaat`), een catalogus-JSON en een STL op 1:<schaal>
// (standaard 1:1000).
//
//   node scripts/generate-patronaat.mjs
//
// Assenstelsel: oorsprong op RD (103345, 488623) op het maaiveld (NAP +1,0 m),
// Z omhoog. +X loopt langs de Zijlsingel (RD-richting 67,0 graden, naar het
// noordnoordoosten, het hotel), +Y 90 graden linksom (naar het westnoordwesten,
// de Ruychaverstraat). De voorgevel aan de Zijlsingel ligt op y = -22.
//
// Bronnen: BAG-pand 0392100000029892 (contour); AHN DSM/DTM 0,5 m (PDOK WCS) in
// het stelsel van het gebouw: de voorbouw (NAP +18,3 m), de grote zaal (+13,3
// m), de lichtstraat (+13,9 m), de hoge strook (+18,7 m) met installaties tot
// +20,6 m, de lage aanbouwen en het maaiveld; PDOK luchtfoto; Wikipedia;
// Wikimedia Commons-foto Haarlem Patronaat.jpg voor de voorgevel. Geschat uit
// die foto: de glazen begane grond, de glazen doos met kader, de glazen kolom,
// de entree en de naden in de gaasband.
import { Manifold, ccw, prism, box, hull, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "patronaat";
const GROUND = 1.0; // NAP-hoogte van het maaiveld aan de Zijlsingel (AHN DTM)
const z = (nap) => +(nap - GROUND).toFixed(3);
const BASE = -1;
const ORIGIN = [103345, 488623];
const ANGLE = 67.0;
const a = (ANGLE * Math.PI) / 180;
const X_AXIS = [+Math.cos(a).toFixed(6), +Math.sin(a).toFixed(6)];

// ---------- maten ----------
// BAG-pand 0392100000029892 in het lokale stelsel.
const OUTLINE = [
  [-4.4, 31.9], [-4.3, 22.8], [-4.1, 13.9], [-15.7, 13.6], [-14.5, -7.4], [-14.7, -14.0], [-15.3, -14.0], [-15.3, -22.0],
  [15.7, -21.5], [15.8, -4.2], [17.6, -3.8], [17.6, 13.9], [17.3, 14.6], [7.4, 15.0], [7.4, 18.7], [12.7, 18.7],
  [12.4, 32.3],
];
const FRONT_Y = -22.0;
// Voorbouw aan de Zijlsingel (AHN): plat dak NAP +18,3 m tot y = -7,5, een
// hoger middendeel (NAP +19,2 m) en een opbouw (NAP +20,5 m).
const FRONT = { y: -7.5, top: z(18.3), mid: [2.0, 8.0, z(19.2)], shaft: [8.0, 9.5, z(20.5)] };
// Grote zaal (AHN NAP +13,3 m) met de lichtstraat (NAP +13,9 m).
const HALL = { x: [-16, 7.4], y: [-7.6, 27.5], top: z(13.3) };
const SKYLIGHT = { x: [2.0, 6.5], y: [-7.0, 13.4], top: z(13.9) };
// Hoge strook langs de zaal (AHN NAP +18,7 m) met installaties tot NAP +20,6 m.
const STRIP = { x: [7.4, 12.6], y: [-7.6, 14.6], top: z(18.7) };
const PLANT = { x: [9.4, 11.6], y: [-5.0, 10.5], top: z(20.6) };
// Lage aanbouw aan de oostkant (AHN NAP +9,0 m), het achterdeel aan de
// Ruychaverstraat (NAP +8,5 m) en de lage strook in de noordhoek (NAP +3,2 m).
const EAST = { x: [12.6, 18], y: [-4.5, 14.6], top: z(9.0) };
const REAR = { y: 27.5, top: z(8.5) };
const LOW = { x: [7.4, 13], y: [18.7, 33], top: z(3.2) };
// Voorgevel (foto, lineair uitgezet over de gevel van 31 m): glazen begane
// grond, glazen doos met kader op de verdieping (0,8 m uitstekend), glazen
// kolom rechts ervan en de entree; daarboven de gaasband tot de dakrand.
const GLASS_GROUND = { x: [-14.6, 3.2], z: [0, 5.8], d: 0.6 };
const ENTRANCE = { x: [6.0, 12.4], z: [0, 5.8], d: 1.0 };
const BOX_FRAME = { x: [-14.8, 5.6], z: [6.4, 11.2], out: 0.8, frame: 0.6, glass: 0.4 };
const COLUMN = { x: [5.9, 9.3], z: [6.4, 11.0], d: 0.35 };
const MESH = { z: [11.6, FRONT.top - 0.5], pitch: 1.75, seam: 0.3, depth: 0.15 };

// ---------- hulpfuncties ----------
const footprint = prism(OUTLINE, BASE, 40);
// Prisma met een profiel in het (y, z)-vlak, uitgetrokken langs X.
const alongX = (profile, x0, x1) => Manifold.extrude([ccw(profile)], x1 - x0).rotate([90, 0, 90]).translate([x0, 0, 0]);
// De voorgevel loopt van (-15,3, -22,0) naar (15,7, -21,5). Gevelelementen
// worden gebouwd met de gevel op y = FRONT_Y en meegedraaid om de zuidwesthoek.
const FACE = { at: [-15.3, -22.0], deg: (Math.atan2(0.5, 31.0) * 180) / Math.PI };
const onFace = (m) => m.translate([-FACE.at[0], -FACE.at[1], 0]).rotate([0, 0, FACE.deg]).translate([FACE.at[0], FACE.at[1], 0]);
// Nis met een plafond van 45 graden in de voorgevel (naar binnen is +y).
const frontNiche = (x0, x1, z0, z1, d) => onFace(alongX([[FRONT_Y - 1, z0], [FRONT_Y + d, z0], [FRONT_Y + d, Math.max(z0, z1 - d)], [FRONT_Y, z1], [FRONT_Y - 1, z1]], x0, x1));

// ---------- massa ----------
const parts = [];
parts.push(box(-16, FRONT_Y - 1, BASE, 16, FRONT.y, FRONT.top).intersect(footprint));
parts.push(box(FRONT.mid[0], FRONT_Y + 0.6, FRONT.top - 0.1, FRONT.mid[1], FRONT.y, FRONT.mid[2]));
parts.push(box(FRONT.shaft[0], FRONT_Y + 0.6, FRONT.top - 0.1, FRONT.shaft[1], FRONT.y, FRONT.shaft[2]));
parts.push(box(HALL.x[0], HALL.y[0] - 0.1, BASE, HALL.x[1], HALL.y[1], HALL.top).intersect(footprint));
parts.push(box(SKYLIGHT.x[0], SKYLIGHT.y[0], HALL.top - 0.1, SKYLIGHT.x[1], SKYLIGHT.y[1], SKYLIGHT.top));
parts.push(box(STRIP.x[0] - 0.1, STRIP.y[0] - 0.1, BASE, STRIP.x[1], STRIP.y[1], STRIP.top).intersect(footprint));
parts.push(box(PLANT.x[0], PLANT.y[0], STRIP.top - 0.1, PLANT.x[1], PLANT.y[1], PLANT.top));
parts.push(box(EAST.x[0] - 0.1, EAST.y[0], BASE, EAST.x[1], EAST.y[1], EAST.top).intersect(footprint));
parts.push(box(-16, REAR.y - 0.1, BASE, LOW.x[0] + 0.1, 33, REAR.top).intersect(footprint));
parts.push(box(LOW.x[0], LOW.y[0], BASE, LOW.x[1], LOW.y[1], LOW.top).intersect(footprint));
let model = union(parts);

// ---------- voorgevel ----------
const cuts = [];
cuts.push(frontNiche(GLASS_GROUND.x[0], GLASS_GROUND.x[1], GLASS_GROUND.z[0] - 1, GLASS_GROUND.z[1], GLASS_GROUND.d));
cuts.push(frontNiche(ENTRANCE.x[0], ENTRANCE.x[1], ENTRANCE.z[0] - 1, ENTRANCE.z[1], ENTRANCE.d));
cuts.push(frontNiche(COLUMN.x[0], COLUMN.x[1], COLUMN.z[0], COLUMN.z[1], COLUMN.d));
// Naden in de gaasband boven de glazen doos.
for (let x = -15.3 + MESH.pitch; x < 15.5; x += MESH.pitch) {
  cuts.push(frontNiche(x - MESH.seam / 2, x + MESH.seam / 2, MESH.z[0], MESH.z[1], MESH.depth));
}
model = model.subtract(union(cuts));
// Glazen doos met kader: steekt 0,8 m uit met een onderkant van 45 graden,
// het glas ligt 0,4 m terug binnen het kader.
const [bx0, bx1] = BOX_FRAME.x;
const { out, frame } = BOX_FRAME;
const [bz0, bz1] = BOX_FRAME.z;
const boxProfile = [[FRONT_Y + 0.1, bz0], [FRONT_Y - out, bz0 + out], [FRONT_Y - out, bz1], [FRONT_Y + 0.1, bz1]];
let glassBox = alongX(boxProfile, bx0, bx1);
glassBox = glassBox.subtract(box(bx0 + frame, FRONT_Y - out - 1, bz0 + out + frame, bx1 - frame, FRONT_Y - out + BOX_FRAME.glass, bz1 - frame));
model = union([model, onFace(glassBox)]);

if (model.status() !== "NoError") throw new Error(model.status());
if (model.decompose().length !== 1) throw new Error(`losse delen: ${model.decompose().length}`);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:patronaat", model]],
  catalog: {
    name: "Patronaat",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: -0.3,
    // Zijlsingel voor de voorgevel (AHN NAP +1,0 tot +1,1 m); niet de lagere
    // Ruychaverstraat achter het gebouw (NAP +0,4 m).
    groundSamplePoints: [
      [-10, -25],
      [0, -25],
      [10, -25],
    ],
    // Laagste PDOK-terreinhoogte op die punten, ellipsoïdisch zoals de export
    // bemonstert (gemeten 2026-10-09), als terugval voor een uitsnede die geen
    // van de punten bevat.
    groundHeight: 43.95,
    replacesBuildings: ["NL.IMBAG.Pand.0392100000029892"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt RD (103345, 488623) op het maaiveld (NAP +1,0 m) in de oorsprong, +X langs de Zijlsingel (RD-richting 67,0 graden) en +Y naar de Ruychaverstraat. Eén node: de voorbouw met de glazen doos en de gaasband, de grote zaal met de lichtstraat, de hoge strook met installaties en de lagere aanbouwen. Vervangt de PDOK-reconstructie van BAG-pand 0392100000029892.",
    realWorld: {
      groundNapM: GROUND,
      frontNapM: 18.3,
      hallNapM: 13.3,
      stripNapM: 18.7,
      plantNapM: 20.6,
      axisDegrees: ANGLE,
      estimates: [
        "glazen begane grond, entree en glazen kolom in de voorgevel",
        "glazen doos met kader op de verdieping (0,8 m uitstekend) en de naden in de gaasband",
      ],
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Patronaat_(Haarlem)",
      "PDOK BAG pand 0392100000029892, EPSG:28992",
      "PDOK AHN DSM/DTM 0,5 m via WCS: voorbouw, zaal, lichtstraat, hoge strook, installaties, aanbouwen en maaiveld",
      "PDOK luchtfoto (Actueel_orthoHR)",
      "Wikimedia Commons: Haarlem Patronaat.jpg",
    ],
  },
});

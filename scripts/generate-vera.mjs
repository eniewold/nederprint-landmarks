// Genereert een vereenvoudigd, gesloten 3D-model van poppodium Vera in
// Groningen (Oosterstraat 44, rijksmonument): het voorhuis met de
// negentiende-eeuwse lijstgevel (drie raamassen, souterrain, kroonlijst met
// consoles, de smalle ingangstravee met stoep en kuif) en het schilddak, en
// daarachter de zalen met platte daken en een installatieblok. Alle maten in
// meters op ware grootte. Uitvoer via efteling-kit.mjs: een GLB in meters (Y
// omhoog, één node `building:vera`), een catalogus-JSON en een STL op
// 1:<schaal> (standaard 1:1000).
//
//   node scripts/generate-vera.mjs
//
// Assenstelsel: oorsprong op RD (234010.5, 581807.4) midden voor de gevel op
// het maaiveld van de Oosterstraat (NAP +8,2 m), Z omhoog. +X loopt van de
// straat het perceel in (RD-richting 24,6 graden, naar het oostnoordoosten),
// +Y 90 graden linksom (naar het noordnoordwesten). Achter het pand ligt het
// maaiveld tot 2,3 m lager (NAP +5,9 m); de onderkant ligt daarom op -2,8 m.
//
// Bronnen: BAG-pand 0014100010953685 (contour); AHN DSM/DTM 0,5 m (PDOK WCS) in
// het stelsel van het perceel: de nok van het schilddak (NAP +23,0 m), de goten
// (+17,5 m), de gevel (+20,7 m), de platte daken (+16,2 en +15,0 m), het
// installatieblok (+17,6 m) en het maaiveld; PDOK luchtfoto; Wikipedia;
// Wikimedia Commons-foto's (Groningen - Vera.jpg,
// Vera-Groningen.JPG, Voorgevel - Groningen - 20094105 - RCE.jpg) voor de
// gevel. Geschat uit foto's: de raamassen, de verdiepingshoogtes, de
// kroonlijst, de kuif boven de ingang en de stoep.
import { Manifold, ccw, prism, box, hull, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "vera";
const GROUND = 8.2; // NAP-hoogte van de Oosterstraat (AHN DTM)
const z = (nap) => +(nap - GROUND).toFixed(3);
const BASE = -2.8;
const ORIGIN = [234010.5, 581807.4];
const ANGLE = 24.6;
const a = (ANGLE * Math.PI) / 180;
const X_AXIS = [+Math.cos(a).toFixed(6), +Math.sin(a).toFixed(6)];

// ---------- maten ----------
// BAG-pand 0014100010953685 in het lokale stelsel; de voorgevel ligt op x = 0
// van y = -5,5 tot 4,9.
const OUTLINE = [
  [35.6, 5.1], [17.2, 5.6], [1.9, 5.0], [0, 4.9], [0, -5.5], [14.0, -5.1], [15.6, -5.1], [15.6, -4.6], [47.0, -4.8],
  [54.0, -4.5], [60.8, -4.2], [62.0, -3.9], [62.6, 5.1],
];
const FRONT = { y: [-5.5, 4.9] };
// Voorhuis (AHN): schilddak met de nok dwars op de straat op NAP +23,0 m (y =
// 0,5, x = 3 tot 10), goten op NAP +17,5 m, en de lijstgevel tot NAP +20,7 m.
const HOUSE = { x: 13.0, eave: z(17.5), ridge: z(23.0), ridgeY: 0.5, ridgeX: [3.0, 10.0] };
const FACADE = { top: z(20.7), thick: 0.6 };
// Kroonlijst (foto): 0,5 m uitstekend, met een onderkant van 45 graden.
const CORNICE = { z: z(20.7) - 0.9, out: 0.5 };
// Ingangstravee (foto): 2,6 m breed aan de zuidkant, 0,25 m vóór de gevel, met
// een kuif tot NAP +21,6 m.
const BAY = { y: [-5.5, -2.9], out: 0.25, crest: z(21.6) };
// Ramen (foto): drie raamassen, souterrain, bel-etage, verdieping en zolder.
const WINDOW_Y = [-1.6, 0.9, 3.4];
const WINDOW = { half: 0.65, floors: [[-0.9, 1.0], [2.0, 5.4], [6.4, 9.3], [10.0, 11.4]], d: 0.3 };
const DOOR = { z: [1.6, 4.8], half: 0.7 };
// Stoep voor de ingang: twee treden van 0,8 m.
const STOOP = { y: [-5.3, -3.1], steps: [[-1.8, 0.8], [-0.9, 1.6]] };
// Zalen achter het voorhuis (AHN): plat dak NAP +16,2 m tot x = 35, met een
// installatieblok tot NAP +17,6 m; daarachter NAP +15,0 m.
const MID = { x: [12.5, 35.4], top: z(16.2) };
const PLANT = { x: [28.5, 31.2], y: [-2.6, 1.6], top: z(17.6) };
const REAR = { x: [35.0, 63], top: z(15.0) };

// ---------- hulpfuncties ----------
const footprint = prism(OUTLINE, BASE, 30);
// Prisma met een profiel in het (y, z)-vlak, uitgetrokken langs X.
const alongX = (profile, x0, x1) => Manifold.extrude([ccw(profile)], x1 - x0).rotate([90, 0, 90]).translate([x0, 0, 0]);
// Prisma met een profiel in het (x, z)-vlak, uitgetrokken langs Y.
const alongY = (profile, y0, y1) => Manifold.extrude([ccw(profile)], y1 - y0).rotate([90, 0, 0]).translate([0, y1, 0]);
// Nis in de voorgevel (x = x0 naar binnen) met een plafond van 45 graden.
const niche = (x0, y0, y1, z0, z1, d) => alongY([[x0 - 1, z0], [x0 + d, z0], [x0 + d, Math.max(z0, z1 - d)], [x0, z1], [x0 - 1, z1]], y0, y1);

// ---------- massa ----------
const parts = [];
// Voorhuis tot de goot met het schilddak.
const [y0, y1] = FRONT.y;
parts.push(box(0, y0, BASE, HOUSE.x, y1, HOUSE.eave).intersect(footprint));
parts.push(
  hull([
    [0, y0, HOUSE.eave - 0.01], [HOUSE.x, y0, HOUSE.eave - 0.01], [HOUSE.x, y1, HOUSE.eave - 0.01], [0, y1, HOUSE.eave - 0.01],
    [HOUSE.ridgeX[0], HOUSE.ridgeY, HOUSE.ridge], [HOUSE.ridgeX[1], HOUSE.ridgeY, HOUSE.ridge],
  ]),
);
// Lijstgevel tot NAP +20,7 m over de volle breedte.
parts.push(box(0, y0, BASE, FACADE.thick, y1, FACADE.top));
// Kroonlijst.
parts.push(alongY([[0.05, CORNICE.z], [-CORNICE.out, CORNICE.z + CORNICE.out], [-CORNICE.out, FACADE.top], [0.05, FACADE.top]], y0, y1));
// Ingangstravee met kuif.
parts.push(box(-BAY.out, BAY.y[0], BASE, 0.1, BAY.y[1], FACADE.top));
parts.push(
  hull([
    [-BAY.out, BAY.y[0], FACADE.top - 0.01], [0.9, BAY.y[0], FACADE.top - 0.01], [-BAY.out, BAY.y[1], FACADE.top - 0.01], [0.9, BAY.y[1], FACADE.top - 0.01],
    [-BAY.out, (BAY.y[0] + BAY.y[1]) / 2 - 0.4, BAY.crest], [0.9, (BAY.y[0] + BAY.y[1]) / 2 - 0.4, BAY.crest],
    [-BAY.out, (BAY.y[0] + BAY.y[1]) / 2 + 0.4, BAY.crest], [0.9, (BAY.y[0] + BAY.y[1]) / 2 + 0.4, BAY.crest],
  ]),
);
// Stoep.
for (const [x, top] of STOOP.steps) parts.push(box(x, STOOP.y[0], BASE, 0.1, STOOP.y[1], top));
// Zalen achter het voorhuis.
parts.push(box(MID.x[0], -6, BASE, MID.x[1], 6, MID.top).intersect(footprint));
parts.push(box(PLANT.x[0], PLANT.y[0], MID.top - 0.1, PLANT.x[1], PLANT.y[1], PLANT.top));
parts.push(box(REAR.x[0], -6, BASE, REAR.x[1], 6, REAR.top).intersect(footprint));
let model = union(parts);

// ---------- ramen en deur ----------
const cuts = [];
for (const y of WINDOW_Y) {
  for (const [f0, f1] of WINDOW.floors) cuts.push(niche(-CORNICE.out, y - WINDOW.half, y + WINDOW.half, f0, f1, WINDOW.d + CORNICE.out));
}
const bayMid = (BAY.y[0] + BAY.y[1]) / 2;
cuts.push(niche(-BAY.out, bayMid - DOOR.half, bayMid + DOOR.half, DOOR.z[0], DOOR.z[1], 0.5));
for (const [f0, f1] of WINDOW.floors.slice(2)) cuts.push(niche(-BAY.out, bayMid - 0.5, bayMid + 0.5, f0, f1, WINDOW.d));
model = model.subtract(union(cuts));

if (model.status() !== "NoError") throw new Error(model.status());
if (model.decompose().length !== 1) throw new Error(`losse delen: ${model.decompose().length}`);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:vera", model]],
  catalog: {
    name: "Vera",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: -0.3,
    // Oosterstraat voor de gevel (AHN NAP +8,1 tot +8,3 m); niet de lagere
    // binnenterreinen achter het pand (NAP +5,9 m).
    groundSamplePoints: [
      [-4, -4],
      [-4, 4],
    ],
    // Laagste PDOK-terreinhoogte op die punten, ellipsoïdisch zoals de export
    // bemonstert (gemeten 2026-10-09), als terugval voor een uitsnede die geen
    // van de punten bevat.
    groundHeight: 48.81,
    replacesBuildings: ["NL.IMBAG.Pand.0014100010953685"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt RD (234010.5, 581807.4) midden voor de gevel op de Oosterstraat (NAP +8,2 m) in de oorsprong, +X het perceel in (RD-richting 24,6 graden) en +Y naar het noordnoordwesten. Eén node: het voorhuis met de lijstgevel, de ingangstravee met kuif en stoep, het schilddak en de zalen erachter. De onderkant ligt 2,8 m onder de straat voor de lagere binnenterreinen. Vervangt de PDOK-reconstructie van BAG-pand 0014100010953685.",
    realWorld: {
      groundNapM: GROUND,
      facadeNapM: 20.7,
      ridgeNapM: 23.0,
      eaveNapM: 17.5,
      midRoofNapM: 16.2,
      rearRoofNapM: 15.0,
      axisDegrees: ANGLE,
      estimates: [
        "raamassen, verdiepingshoogtes en de deur in de lijstgevel",
        "kroonlijst, de kuif boven de ingangstravee en de stoep",
      ],
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Vera_(Groningen)",
      "PDOK BAG pand 0014100010953685, EPSG:28992",
      "PDOK AHN DSM/DTM 0,5 m via WCS: nok, goten, gevel, platte daken, installatieblok en maaiveld",
      "PDOK luchtfoto (Actueel_orthoHR)",
      "Wikimedia Commons: Groningen - Vera.jpg, Vera-Groningen.JPG, Voorgevel - Groningen - 20094105 - RCE.jpg",
    ],
  },
});

// Avérotoren (Lange Marktstraat, Leeuwarden, 1991, Bonnema architecten): kantoortoren van 17 lagen als
// donkere glazen kubus in een zwart raster van grote vakken, met bovenop een open zwart kader rond de
// omloop. Aan de noordkant staat een smallere, hogere schacht, daartussen een verbindingsdeel. Onderaan
// lage vleugels aan de west- en oostkant, een lager deel aan de noordkant en een glazen entreehal.
// Contour uit de BAG, hoogtes uit het AHN-DSM, het raster uit foto's.
import { Manifold, prism, rect, union, writeLandmark, CrossSection } from "./efteling-kit.mjs";

const slug = "averotoren";
// Gebouwstelsel: u langs de zuidgevel naar het oosten (-4,6° op RD-oost, BAG-randen evenwijdig binnen
// 0,2°), v naar het noorden. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [181925.93, 579114.73];
const ANGLE = -4.6;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 1.1; // NAP, AHN-DTM rondom (1,0–1,3; PDOK-voet 42,28 ellipsoïdisch)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM ----------
const TOWER = 71.0; // dak van de kubus (70,5–71,5)
const FRAME = 73.0; // open kader rond de omloop (72–73 op de randen en de kruisbalken)
const SHAFT = 77.5; // schacht aan de noordkant (76–78; PDOK 76,2)
const LINK = 70.0; // verbindingsdeel tussen kubus en schacht (70)
const NORTH = 17.0; // lager deel aan de noordkant (17–19)
const WINGS = 15.0; // vleugels west en oost (15)
const HALL = 5.5; // glazen entreehal aan de noordkant (5–6)

// ---------- Plattegrond in (u, v), BAG-contour vereenvoudigd tot 8 cm ----------
const FOOTPRINT = [[2.99, -17.88], [10.22, -17.89], [10.22, -13.69], [13.29, -13.47], [15.82, -12.93], [15.89, 7.19], [5.43, 7.18], [7.37, 15.58], [8.05, 15.58], [8.02, 24.74], [-4.81, 24.69], [-4.81, 16.9], [-4.46, 16.91], [-4.44, 11.87], [-7.08, 11.86], [-7.01, 7.38], [-12.79, 7.38], [-12.74, 4.65], [-17.87, 4.63], [-17.92, -8.44], [-14.81, -7.88], [-12.61, -7.78], [-12.62, -17.87]];
const CUBE = rect(-12.62, -17.88, 10.22, 4.65);
const LINK_POLY = rect(-1.0, 4.4, 5.5, 8.6);
const SHAFT_POLY = rect(-3.2, 8.4, 6.2, 16.6);
const plan = new CrossSection([FOOTPRINT]);
const part = (r) => Manifold.extrude(plan.intersect(new CrossSection([r])), 1);
const zPrism = (m, z0, z1) => m.scale([1, 1, z1 - z0]).translate([0, 0, z0]);

// Open kader op het dak: rand en kruisbalken van 1 m op de lijnen van het gevelraster (DSM).
const GRID_U = [-4.9, 2.4], GRID_V = [-10.0, -2.6];
const frame = union([
  prism(CUBE, z(TOWER) - 0.1, z(FRAME)).subtract(prism(rect(-11.62, -16.88, 9.22, 3.65), z(TOWER) - 1, z(FRAME) + 1)),
  ...GRID_U.map((u) => prism(rect(u - 0.5, -17.88, u + 0.5, 4.65), z(TOWER) - 0.1, z(FRAME))),
  ...GRID_V.map((v) => prism(rect(-12.62, v - 0.5, 10.22, v + 0.5), z(TOWER) - 0.1, z(FRAME))),
]);

const body = union([
  zPrism(part(rect(-30, -30, 30, 30)), BASE, z(HALL)),
  zPrism(part(rect(-13, 4.4, 8.1, 16.95)), BASE, z(NORTH)),
  zPrism(part(rect(-18, -9, -12.55, 4.7)), BASE, z(WINGS)),
  zPrism(part(rect(10.15, -14, 16, 7.2)), BASE, z(WINGS)),
  prism(CUBE, BASE, z(TOWER)),
  frame,
  prism(LINK_POLY, BASE, z(LINK)),
  prism(SHAFT_POLY, BASE, z(SHAFT)),
]);

// ---------- Gevelraster ----------
// De glasgevels van de kubus liggen in een zwart raster: per gevel drie vakken breed (stijlen van
// 0,9 m op de lijnen van het dakkader) en zes vakken hoog van elk drie lagen (regels van 0,9 m). Elk
// vak is een blinde nis van 0,35 m met een plafond onder 45°; boven het hoogste vak loopt de omloop.
const DEPTH = 0.35;
const ROWS = 6, ROW_BOTTOM = 3.6, ROW_TOP = z(TOWER) - 2.4;
const rowH = (ROW_TOP - ROW_BOTTOM) / ROWS;
const cuts = [];
function cells(a, b, splits) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const edges = [0, ...splits, L];
  for (let r = 0; r < ROWS; r++) {
    const lo = ROW_BOTTOM + r * rowH + 0.45, hi = ROW_BOTTOM + (r + 1) * rowH - 0.45 - DEPTH;
    for (let k = 0; k + 1 < edges.length; k++) {
      const s0 = edges[k] + 0.45 + (k === 0 ? 0.45 : 0), s1 = edges[k + 1] - 0.45 - (k === edges.length - 2 ? 0.45 : 0);
      const exposed = [s0 + 0.2, (s0 + s1) / 2, s1 - 0.2].every((s) => [lo + 0.1, hi].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
// Zuid, oost, noord en west; de stijlen staan op de lijnen van het dakkader.
cells([-12.62, -17.88], [10.22, -17.88], GRID_U.map((u) => u + 12.62));
cells([10.22, -17.88], [10.22, 4.65], GRID_V.map((v) => v + 17.88));
cells([10.22, 4.65], [-12.62, 4.65], GRID_U.map((u) => 10.22 - u).reverse());
cells([-12.62, 4.65], [-12.62, -17.88], GRID_V.map((v) => 4.65 - v).reverse());
// Schacht: smalle verticale vensterstroken in de oost- en westgevel boven het lagere noorddeel.
for (const [x, side] of [[6.2, 1], [-3.2, -1]]) {
  cuts.push(Manifold.hull([
    [x + side * 0.2, 11.8, z(NORTH) + 1], [x - side * DEPTH, 11.8, z(NORTH) + 1], [x + side * 0.2, 13.2, z(NORTH) + 1], [x - side * DEPTH, 13.2, z(NORTH) + 1],
    [x + side * 0.2, 11.8, z(SHAFT) - 3.0 + 0.55], [x - side * DEPTH, 11.8, z(SHAFT) - 3.0], [x + side * 0.2, 13.2, z(SHAFT) - 3.0 + 0.55], [x - side * DEPTH, 13.2, z(SHAFT) - 3.0],
  ]));
}

const building = body.subtract(union(cuts));
const pieces = building.decompose();
if (pieces.length !== 1) throw new Error(`Avérotoren: ${pieces.length} losse delen`);
console.log("Avérotoren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "vakken", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:averotoren", building]],
  catalog: {
    name: "Avérotoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.3, // PDOK-terrein rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0080100000336057"],
    description:
      "Avérotoren aan de Lange Marktstraat in Leeuwarden: glazen kubus van 22,8 × 22,5 m tot NAP +71,0 m in een zwart raster van drie bij zes vakken, met een open kader van 3 × 3 vakken rond de omloop tot +73,0 m; aan de noordkant een hogere schacht tot +77,5 m en een verbindingsdeel tot +70,0 m, lage vleugels tot +15,0 m, een lager noorddeel tot +17,0 m en een glazen entreehal tot +5,5 m. Contour uit de BAG, hoogtes uit het AHN-DSM, raster uit foto's. Oorsprong in het hart van de BAG-contour, X-as langs de zuidgevel (-4,6° op RD-oost). Rasterverdeling, schachtvensters en de dikte van het kader zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      towerNapM: TOWER,
      frameNapM: FRAME,
      shaftNapM: SHAFT,
      linkNapM: LINK,
      northPartNapM: NORTH,
      wingsNapM: WINGS,
      hallNapM: HALL,
      gridBays: { wide: 3, high: ROWS },
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0080100000336057 (bouwjaar 1990), actuele orthoHR, AHN-DSM en -DTM 0,5 m, PDOK 3D-gebouwtegel (LoD2.2)",
      "https://nl.wikipedia.org/wiki/Averotoren",
      "https://commons.wikimedia.org/wiki/File:Averotoren_Leeuwarden.jpg",
      "https://commons.wikimedia.org/wiki/File:Averotoren_achmeatoren.jpg",
      "https://commons.wikimedia.org/wiki/File:20130608_Uitzicht_Achmeatoren_Leeuwarden_NL_(2).jpg",
      "https://commons.wikimedia.org/wiki/File:20180721_540_leeuwarden.jpg",
    ],
  },
});

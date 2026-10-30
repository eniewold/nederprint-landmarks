// Watertoren van Schoonhoven (F.A. de Jongh, 1901, rijksmonument 452390).
// Bouwstelsel = modelstelsel: oorsprong op het zwaartepunt van het BAG-pand,
// +X langs de oostvleugel (6,10 graden linksom van RD-oost), +Y langs de
// noordvleugel, voorzijde met de ingang naar -Y (zuid, Bij de Watertoren).
// Breedtes uit de BAG en de zijgevel 1:100 (Commons), hoogtes uit dezelfde
// tekening, met één factor (1,056) passend gemaakt op het AHN: nok van de
// vleugels NAP +12, kroonlijst van het reservoir NAP +26,8, maaiveld NAP +0,5.
import { Manifold, box, circle, hull, prism, ring3, union, place, gableRoof, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [117922.24, 439652.837];
const AXIS = [0.99434, 0.1062];
const BASE = -0.25;
const H = {
  eave: 8.25, // goot van de vier vleugels
  ridge: 11.4, // nok van de vleugels
  shaftTop: 16.6, // achtkante schacht tot de ronde kraag
  ringTop: 17.2,
  drumTop: 19.4, // ronde arcaderand
  tankFoot: 20.5, // boven de kraagsteenrij
  tankTop: 25.3, // reservoirommanteling met spitsboogvensters
  corniceTop: 26.3,
  knee: 28.9, // knik tussen de uitlopende onderkap en de spits
  spireTop: 41.2,
};
// Afstanden tot de vlakken (achtkant met vlakken naar ±X en ±Y).
const R = { arm: 2.2, armEnd: 7.235, core: 3.73, shaft: 3.12, ring: 3.78, drum: 3.6, tank: 3.85, cornice: 4.45, roofEave: 4.35, spire: 3.12 };
const OVER = 0.35; // dakoverstek van de vleugels

const oct = (rf, z) => ring3(circle([0, 0], rf / Math.cos(Math.PI / 8), 8, Math.PI / 8), z);
const round = (r, z, n = 48) => ring3(circle([0, 0], r, n), z);
const DIRS = [0, 90, 180, 270];
// Blinde nis met een spitse top (≥ 50 graden) in een vlak met de normaal +X op x = f.
const niche = (f, y, w, z0, z1, depth = 0.35) => {
  const a = f - depth,
    b = f + 0.6,
    top = z1 + w * 0.65;
  return hull([
    [a, y - w / 2, z0], [b, y - w / 2, z0], [a, y + w / 2, z0], [b, y + w / 2, z0],
    [a, y - w / 2, z1], [b, y - w / 2, z1], [a, y + w / 2, z1], [b, y + w / 2, z1],
    [a, y, top], [b, y, top],
  ]);
};
// Oculus als ruit (zijden onder 45 graden), middelpunt op hoogte z.
const oculus = (f, y, d, z, depth = 0.3) =>
  hull([[f - depth, y, z - d / 2], [f + 0.6, y, z - d / 2], [f - depth, y - d / 2, z], [f + 0.6, y - d / 2, z], [f - depth, y + d / 2, z], [f + 0.6, y + d / 2, z], [f - depth, y, z + d / 2], [f + 0.6, y, z + d / 2]]);
// Piramidedak op een vierkant van halve breedte s rond (x, y).
const cap = (x, y, s, z0, z1) => hull([[x - s, y - s, z0], [x + s, y - s, z0], [x + s, y + s, z0], [x - s, y + s, z0], [x, y, z1]]);

// ---------- onderbouw: kruis van vier vleugels rond een achtkante kern ----------
const footprint = [];
for (const deg of DIRS) {
  const c = Math.cos((deg * Math.PI) / 180),
    s = Math.sin((deg * Math.PI) / 180);
  // Per vleugel: afgeschuinde binnenhoek, zijwand, kopgevel (BAG, symmetrisch gemaakt; afwijking ≤ 3 cm).
  for (const [u, v] of [[3.07, -2.2], [R.armEnd, -R.arm], [R.armEnd, R.arm], [3.07, 2.2]]) footprint.push([u * c - v * s, u * s + v * c]);
}
let base = prism(footprint, BASE, H.eave);
const roofs = DIRS.map((deg) => {
  const x0 = 2.0,
    x1 = R.armEnd + OVER;
  return place(gableRoof(x1 - x0, 2 * (R.arm + OVER), H.eave, H.ridge).translate([(x0 + x1) / 2, 0, 0]), { deg });
});
const coreRoof = hull([...oct(R.core + OVER, H.eave), ...oct(R.shaft, H.eave + 1.1)]);
// Schoorsteen met puntkapje op elke vleugelnok.
const chimneys = DIRS.map((deg) => place(union([box(5.35, -0.45, 10.0, 6.25, 0.45, 12.9), cap(5.8, 0, 0.6, 12.9, 14.1)]), { deg }));
base = union([base, ...roofs, coreRoof, ...chimneys]);
const baseCuts = [];
for (const deg of [90, 270]) {
  // Voor- en achtergevel: deur onder een boog, venster erboven, oculus in de topgevel.
  baseCuts.push(place(niche(R.armEnd, 0, 1.4, BASE, 3.3), { deg }));
  baseCuts.push(place(niche(R.armEnd, 0, 1.0, 4.7, 6.6), { deg }));
  baseCuts.push(place(oculus(R.armEnd + OVER, 0, 1.0, 9.6), { deg }));
}
for (const deg of [0, 180]) {
  // Kopgevels oost en west: twee vensters boven elkaar en een oculus.
  for (const [z0, z1] of [[1.3, 3.2], [4.7, 6.6]]) baseCuts.push(place(niche(R.armEnd, 0, 1.1, z0, z1), { deg }));
  baseCuts.push(place(oculus(R.armEnd + OVER, 0, 1.0, 9.6), { deg }));
}
for (const deg of DIRS)
  for (const side of [-1, 1])
    for (const [z0, z1] of [[1.3, 3.2], [4.7, 6.4]])
      // Zijwanden van elke vleugel (normaal ±Y in het vleugelstelsel).
      baseCuts.push(place(niche(R.arm, 0, 1.0, z0, z1).rotate([0, 0, side * 90]).translate([5.15, 0, 0]), { deg }));
base = base.subtract(union(baseCuts));

// ---------- achtkante schacht met ronde kraag ----------
let shaft = union([
  hull([...oct(R.shaft, 7.0), ...oct(R.shaft, H.shaftTop)]),
  hull([...oct(R.shaft, H.shaftTop - 0.6), ...round(R.ring, H.shaftTop + 0.06)]),
  hull([...round(R.ring, H.shaftTop + 0.06), ...round(R.ring, H.ringTop)]),
]);
const shaftCuts = [];
for (let k = 0; k < 8; k++) shaftCuts.push(place(niche(R.shaft, 0, 0.95, 13.4, 15.2), { deg: k * 45 }));
for (const deg of [45, 135, 225, 315]) shaftCuts.push(place(oculus(R.shaft, 0, 1.0, 11.8), { deg }));
shaft = shaft.subtract(union(shaftCuts));

// ---------- arcaderand, kraagsteenrij en reservoir met kroonlijst ----------
let tank = union([
  hull([...round(R.drum, 17.0), ...round(R.drum, H.drumTop)]),
  hull([...round(R.drum, H.drumTop - 0.1), ...oct(R.tank, H.tankFoot)]),
  hull([...oct(R.tank, H.tankFoot), ...oct(R.tank, H.tankTop)]),
  hull([...oct(R.tank, H.tankTop), ...oct(R.cornice, H.tankTop + 0.6)]),
  hull([...oct(R.cornice, H.tankTop + 0.6), ...oct(R.cornice, H.corniceTop)]),
]);
const tankCuts = [];
// Zestien rondboognissen (spits gemaakt) in de arcaderand.
for (let k = 0; k < 16; k++) tankCuts.push(place(niche(R.drum, 0, 0.8, 17.6, 18.6, 0.3), { deg: k * 22.5 + 11.25 }));
// Twee spitsboogvensters per vlak van de reservoirommanteling.
for (let k = 0; k < 8; k++) for (const y of [-0.7, 0.7]) tankCuts.push(place(niche(R.tank, y, 0.9, 21.2, 23.8, 0.25), { deg: k * 45 }));
tank = tank.subtract(union(tankCuts));

// ---------- leien kap: uitlopende onderkap, spits, dakkapellen en hoektorentjes ----------
const roofSlope = (r) => 26.2 + ((R.roofEave - r) / (R.roofEave - R.spire)) * (H.knee - 26.2);
const dormer = union([
  box(1.6, -0.78, 28.6, R.spire + 0.1, 0.78, 31.9),
  box(1.6, -1.0, 31.9, R.spire + 0.3, 1.0, 32.2),
  // Klein zadelkapje met de nok naar buiten; op de foto's geen eigen spits (wel op de tekening).
  hull([[1.6, -1.0, 32.2], [R.spire + 0.3, -1.0, 32.2], [R.spire + 0.3, 1.0, 32.2], [1.6, 1.0, 32.2], [1.6, 0, 33.4], [R.spire + 0.3, 0, 33.4]]),
]).subtract(niche(R.spire + 0.1, 0, 0.8, 29.3, 30.9, 0.25));
const turret = union([
  box(3.3, -0.5, roofSlope(4.3) - 0.3, 4.3, 0.5, 31.9),
  box(3.05, -0.75, 31.9, 4.55, 0.75, 32.3),
  cap(3.8, 0, 0.6, 32.3, 35.8),
]);
const roof = union([
  hull([...oct(R.roofEave, 26.2), ...oct(R.spire, H.knee)]),
  hull([...oct(R.spire, H.knee - 0.05), [0, 0, H.spireTop]]),
  // IJzeren standpijp met knop als dikke pen (windvaan en stang weggelaten).
  hull([...round(0.7, 40.2, 8), ...round(0.45, 45.0, 8)]),
  Manifold.sphere(0.6, 16).translate([0, 0, 45.4]),
  ...DIRS.map((deg) => place(dormer, { deg })),
  ...[45, 135, 225, 315].map((deg) => place(turret, { deg })),
]);

await writeLandmark({
  slug: "watertoren-schoonhoven",
  base: BASE,
  nodes: [
    ["building:kruisvormige-onderbouw-met-vier-topgevels", base],
    ["building:achtkante-schacht-en-kraag", shaft],
    ["building:arcaderand-reservoir-en-kroonlijst", tank],
    ["building:leien-spits-dakkapellen-en-hoektorens", roof],
  ],
  catalog: {
    name: "Watertoren Schoonhoven",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-9, 0], [0, 9], [0, -9]],
    replacesBuildings: ["NL.IMBAG.Pand.0608100001224969"],
    description:
      "Oorsprong op het zwaartepunt van het BAG-pand op maaiveld (NAP +0,5 m), +X langs de oostvleugel (6,1 graden linksom van RD-oost), ingang naar -Y (zuid). Kruisvormige onderbouw van vier vleugels met zadeldaken, topgevels, schoorstenen en blinde vensters rond een achtkante kern; achtkante schacht met vensters en oculi tot een ronde kraag op 16,6 m; ronde arcaderand, kraagsteenrij en achtkante reservoirommanteling met spitsboogvensters tot de kroonlijst op 26,3 m; uitlopende leien onderkap, achtkante spits tot 41,2 m met vier dakkapellen en vier hoektorentjes, ijzeren standpijp met knop tot 46 m. Breedtes uit BAG en de bestektekening, hoogtes uit de tekening op het AHN gepast; windvaan, makelaars en pinakels op de topgevels weggelaten.",
    realWorld: {
      publishedHeightM: 50,
      ahnGroundNapM: 0.5,
      ahnRidgeNapM: 12,
      ahnCorniceNapM: 26.8,
      ahnTopNapM: 48.59,
      bagFootprintM2: 109.6,
      armWidthM: 4.4,
      footprintSpanM: 14.47,
      shaftAcrossFlatsM: 6.24,
      tankAcrossFlatsM: 7.7,
      corniceAcrossFlatsM: 8.9,
      drawingVerticalFactor: 1.056,
      modelTopM: 46.0,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Schoonhoven)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/452390",
      "https://commons.wikimedia.org/wiki/File:Zijgevel_watertoren_Schoonhoven.jpg (bestektekening zijgevel 1:100, 1900)",
      "https://commons.wikimedia.org/wiki/File:Doorsnede_watertoren_Schoonhoven.jpg (doorsnede CD 1:100)",
      "https://commons.wikimedia.org/wiki/File:RM452390_Schoonhoven_-_Watertoren_(foto_1).jpg",
      "https://commons.wikimedia.org/wiki/File:Achtergevel_-_Schoonhoven_-_20198446_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Overzicht_-_Schoonhoven_-_20198444_-_RCE.jpg",
      "PDOK BAG-pand 0608100001224969, AHN DSM/DTM 0,5 m, 2026-10-30",
    ],
  },
});

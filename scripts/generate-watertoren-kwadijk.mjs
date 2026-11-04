// Watertoren van Kwadijk, teruggelegen aan de zuidzijde van de Kwadijk en via een rechte oprijlaan bereikbaar, gebouwd in
// 1925 voor het Provinciaal Waterleidingbedrijf van Noord-Holland naar ontwerp van ir. B.F. van Nievelt (rijksmonument
// 508231; Wikipedia schrijft "Niefelt"). Volgens het register 45,50 m hoog, achthoekig grondplan, rode baksteen rond een
// betonskelet van vier kolommen binnen en acht langs de omtrek, twee reservoirs van 500 m³ (diameter 10,2 m) boven
// elkaar, verwant aan de art deco; tegenwoordig een woning. Het achthoek is een vierkant met afgeschuinde hoeken: vier
// lange gevels van circa 7,5 m en vier schuine hoeken van circa 4 m. De acht buitenste kolommen staan op de hoeken en
// lopen van de uitgemetselde sokkel tot de bekroning; het muurwerk ertussen is teruggemetseld. Op de hoogte van de
// bodems van de reservoirs lopen twee betonnen banden rond. De schacht heeft aan de voor- (noord) en achterzijde (zuid) in
// het midden wigvormig teruggemetseld muurwerk met drie vensterreeksen van zes ramen, aan de oost- en westzijde drie
// kleinere vensters; de schuine hoeken hebben op de parterre een liggend venster. In de reservoirgeledingen hebben de
// lange gevels drie gekoppelde smalle vensters, de schuine hoeken elk één. Bovenaan een betonnen bekroning met art-deco
// punten en een lage achtzijdige kap in gewapend beton met een metalen spits. Ingang met art-deco-omlijsting op het
// noorden (oprijlaan), een glazen dubbele deur naar het terras op het zuiden.
//
// Oorsprong op het hart van BAG-pand 0478100000003103 (RD [127053.34, 504637.55]; vierkant 13,28 m over de lange gevels,
// schuine hoeken op 7,35 m van het hart), op maaiveld (AHN-DTM NAP -0,26 in een ring van 7 tot 9 m; gebruikt -0,3). De
// lange gevels staan op RD -17,65 graden (kleinste omhullende rechthoek, de hoekpunten passen binnen 4 cm). Lokale +X is
// de normaal van de westgevel (RD 162,35 graden), +Y die van de zuidgevel; de ingang op het noorden kijkt naar -Y.
// Maten: BAG (sokkel), AHN-DSM 0,5 m (kap: rand NAP +42,7 op 5 m, +43,8 op 3 m, +45,0 op 1 m, top +45,8 met de voet van
// de spits; schachtbreedte 12,9 tot 13,0 m op 20 tot 30 m), geledingen uit de frontale foto "Kwadijk Watertoren 5409"
// (Commons, telelens van het zuiden; schaal 43,6 px/m uit de top van de bekroning op het AHN) en "Watertoren Kwadijk
// 20250704 152811" (van het zuidoosten: oost- en zuidgevel).
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [127053.34, 504637.55];
const DEG = 162.35;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.6; // dieper dan gebruikelijk: het PDOK-terrein ligt aan de oost- en zuidoostkant tot 0,5 m onder het hart
const GROUND_NAP = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (west 42,37, noord 42,42, zuid 42,56), gemeten
// 2026-11-04 in een export op 1:1000. De oostkant ligt lager (PDOK 42,15; AHN-DTM NAP -0,45 tegen -0,05 tot -0,26
// aan de noord-, west- en zuidkant) en telt niet mee, zodat de trede van de ingang niet in het terrein zakt; de voet
// loopt daarom tot 0,6 m onder het hart door.
const GROUND_ELLIPSOID = 42.37;
const S2 = Math.SQRT2;

// Achthoek: vierkant met apothema aL (lange gevels) en schuine hoeken met apothema aC.
const oct2 = (aL, aC) => {
  const t = aC * S2 - aL;
  return [[aL, -t], [aL, t], [t, aL], [-t, aL], [-aL, t], [-aL, -t], [-t, -aL], [t, -aL]];
};
const octZ = (aL, aC, z) => oct2(aL, aC).map(([x, y]) => [x, y, z]);
const octPrism = (aL, aC, z0, z1) => prism(oct2(aL, aC), z0, z1);
// Lijst of band: achthoek (aL, aC) van z0 tot z1, onderkant onder 45 graden vanaf het vlak d binnen en nog 1 m verder
// naar binnen, zodat er boven de verdiepte vlakken geen vlakke onderkant overblijft.
const band = (aL, aC, d, z0, z1) => hull([...octZ(aL - d - 1, aC - d - 1, z0 - d - 1), ...octZ(aL, aC, z0), ...octZ(aL, aC, z1)]);
// Gevels: lange gevels met de normaal op 0, 90, 180, 270 graden (W, Z, O, N), schuine hoeken daartussen.
const LONG = [0, 90, 180, 270];
const CHAMFER = [45, 135, 225, 315];
const N = 270, Z = 90;
const halfLong = (aL, aC) => aC * S2 - aL;
const halfChamfer = (aL, aC) => (aL - halfLong(aL, aC)) / S2;
const on = (m, degs) => degs.map((deg) => place(m, { deg }));

// ---------- maten (hoogtes boven maaiveld) ----------
const A = {
  plinth: [6.64, 7.35], // uitgemetselde sokkel (BAG)
  col: [6.5, 7.21], // kolommen (AHN: 12,9 tot 13,0 m over de lange gevels)
  band: [6.7, 7.41], // betonnen banden op de reservoirbodems
  crown: [6.6, 7.31], // bekroning
  roof: [6.2, 6.91], // voet van de kap binnen de bekroning
};
const H = {
  plinth: 1.9,
  band1: [25.8, 27.4], // bodem onderste reservoir (foto 25,8 tot 27,4)
  band2: [33.5, 34.9], // bodem bovenste reservoir (foto 33,5 tot 34,9)
  crown: [40.7, 42.3], // bekroning (foto 40,7; bovenkant van de punten 42,8 tot 42,9)
  crownPoint: 42.9,
  apex: 45.8, // kap: rechte lijn door het DSM-profiel (helling 0,56, circa 29 graden) geeft 45,8 m boven maaiveld in het hart
  rows: [[8.9, 10.1], [16.4, 17.7], [23.5, 24.6]], // vensterreeksen in de schacht (foto 8,9-10,1, 16,4-17,7, 23,7-25,0)
  res1: [27.9, 32.0], // vensters onderste reservoir
  res2: [35.4, 39.3], // vensters bovenste reservoir
};
const COL = 1.1; // kolombreedte langs het vlak vanaf de hoek
const D_SHAFT = 0.3; // muurwerk tussen de kolommen teruggemetseld
const D_WEDGE = 0.3; // wigvormig teruggemetseld midden van de noord- en zuidgevel
const D_RES = 0.25; // reservoirgeledingen

// Verdiept vlak (normaal +X) tussen twee kolommen: vlak a, halve breedte h, van z0 tot z1, plafond onder 45 graden.
const recess = (a, h, z0, z1, d) => hull([
  [a - d, -h, z0], [a - d, h, z0], [a + 0.8, -h, z0], [a + 0.8, h, z0],
  [a - d, -h, z1 - d], [a - d, h, z1 - d], [a + 0.8, -h, z1 + 0.8], [a + 0.8, h, z1 + 0.8],
]);
// Nis in het vlak f (normaal +X): breedte wd rond y, van z0 tot z1, plafond onder 63 graden.
const niche = (f, wd, z0, z1, depth, y = 0) => {
  const y0 = y - wd / 2, y1 = y + wd / 2, za = z1 + 2 * depth;
  return hull([
    [f - depth, y0, z0], [f + 1.0, y0, z0], [f - depth, y1, z0], [f + 1.0, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + 1.0, y0, z1 - 1.5], [f + 1.0, y1, z1 - 1.5],
  ]);
};

// ---------- sokkel en schacht ----------
const [aL, aC] = A.col;
const hL = halfLong(aL, aC) - COL; // halve breedte van het verdiepte vlak op een lange gevel (2,6 m)
const hC = halfChamfer(aL, aC) - COL; // en op een schuine hoek (0,88 m)
const plinth = hull([...octZ(...A.plinth, BASE), ...octZ(...A.plinth, H.plinth), ...octZ(aL, aC, H.plinth + 0.14)]);
const core = octPrism(aL, aC, BASE, H.crown[0]);
// Verdiepte vlakken in de schacht (tot de schuine onderkant van de onderste band) en de twee reservoirgeledingen.
const zShaftTop = H.band1[0] - 0.2;
const recessesFor = (z0, z1, d) => [
  ...on(recess(aL, hL, z0, z1, d), LONG),
  ...on(recess(aC, hC, z0, z1, d), CHAMFER),
];
// Wig in het midden van de noord- en zuidgevel: van het teruggemetselde vlak naar 0,3 m dieper in de middellijn.
const aWall = aL - D_SHAFT;
const wedge = hull([
  ...[[aWall - D_WEDGE, 0], [aWall, -hL], [aWall + 0.8, -hL], [aWall + 0.8, hL], [aWall, hL]].map(([x, y]) => [x, y, H.plinth]),
  [aWall - D_WEDGE, 0, zShaftTop - D_SHAFT - 2 * D_WEDGE], [aWall, -hL, zShaftTop - D_SHAFT], [aWall, hL, zShaftTop - D_SHAFT],
  [aWall + 0.8, -hL, zShaftTop + 0.8], [aWall + 0.8, hL, zShaftTop + 0.8],
]);
const shaftCuts = union([
  ...recessesFor(H.plinth, zShaftTop, D_SHAFT),
  ...recessesFor(H.band1[1], H.band2[0] - 0.2, D_RES),
  ...recessesFor(H.band2[1], H.crown[0] - 0.1, D_RES),
  ...on(wedge, [N, Z]),
]);
const bands = union([
  band(...A.band, 0.2, ...H.band1),
  band(...A.band, 0.2, ...H.band2),
  band(...A.crown, 0.1, ...H.crown),
]);

// ---------- bekroning en kap ----------
// Art-deco-punt midden op elke lange gevel: een driehoekige opstand van 2,2 m breed tot 42,9 m op de bekroning.
const crownPoint = hull([
  [A.crown[0] - 0.6, -1.1, H.crown[1] - 0.01], [A.crown[0], -1.1, H.crown[1] - 0.01],
  [A.crown[0] - 0.6, 1.1, H.crown[1] - 0.01], [A.crown[0], 1.1, H.crown[1] - 0.01],
  [A.crown[0] - 0.6, 0, H.crownPoint], [A.crown[0], 0, H.crownPoint],
]);
// Opstand op elke hoekkolom (1,2 m langs beide vlakken) tot 42,6 m met een schuine binnenkant.
const cornerCap = (() => {
  // Hoekpunt (aL, t) tussen de westgevel en de schuine hoek; 1,2 m langs beide vlakken, 0,6 m diep.
  const [x, y] = [A.crown[0], halfLong(...A.crown)];
  const ring = [[x, y - 1.2], [x, y], [x - 0.85, y + 0.85], [x - 1.27, y + 0.43], [x - 0.6, y - 1.2]];
  return hull([...ring.map(([u, v]) => [u, v, H.crown[1] - 0.01]), ...ring.slice(0, 3).map(([u, v]) => [u, v, 42.6]), [x - 0.6, y - 0.6, 42.6]]);
})();
const cornerCaps = [0, 90, 180, 270].flatMap((deg) => [place(cornerCap, { deg }), place(cornerCap.mirror([0, 1, 0]), { deg })]);
const kap = hull([...octZ(...A.roof, H.crown[1] - 0.01), [0, 0, H.apex]]);

// ---------- vensters en deuren ----------
const openings = union([
  // Schacht noord en zuid: drie reeksen van zes ramen (2,75 x 1,3 m) in de wig.
  ...H.rows.flatMap(([z0, z1]) => on(niche(aWall - D_WEDGE, 2.75, z0, z1, 0.3), [N, Z])),
  // Schacht oost en west: drie kleinere vensters (1,1 x 1,2 m).
  ...H.rows.flatMap(([z0, z1]) => on(niche(aWall, 1.1, z0 + 0.05, z1 - 0.05, 0.3), [0, 180])),
  // Schuine hoeken: een liggend venster op de parterre.
  ...on(niche(aC - D_SHAFT, 1.0, 2.25, 2.95, 0.3), CHAMFER),
  // Reservoirgeledingen: drie gekoppelde vensters per lange gevel als één nis, één venster per schuine hoek.
  ...[H.res1, H.res2].flatMap(([z0, z1]) => [
    ...on(niche(aL - D_RES, 2.2, z0, z1, 0.3), LONG),
    ...on(niche(aC - D_RES, 0.7, z0, z1, 0.3), CHAMFER),
  ]),
]);

// Ingang noord: art-deco-omlijsting 4,2 m breed tot 4,8 m, 0,2 m voor de kolommen, bovenkant afgeschuind; dubbele deur
// 1,8 x 2,7 m als nis van 0,4 m (dieper liet de export de dunne latei ervoor opvullen); een trede. Zuid: glazen dubbele
// deur 2,7 x 2,3 m met een trede (foto).
const portalN = union([
  hull([
    [aWall - D_WEDGE - 0.05, -2.1, BASE], [aL + 0.2, -2.1, BASE], [aWall - D_WEDGE - 0.05, 2.1, BASE], [aL + 0.2, 2.1, BASE],
    [aWall - D_WEDGE - 0.05, -2.1, 4.8], [aL, -2.1, 4.8], [aWall - D_WEDGE - 0.05, 2.1, 4.8], [aL, 2.1, 4.8],
    [aL + 0.2, -2.1, 4.6], [aL + 0.2, 2.1, 4.6],
  ]),
  box(aL, -1.4, BASE, A.plinth[0] + 0.8, 1.4, 0.25),
]);
const doorN = niche(aL + 0.2, 1.8, 0.25, 2.95, 0.4);
const doorS = niche(A.plinth[0], 2.7, 0.3, 2.6, A.plinth[0] - (aWall - D_WEDGE) + 0.3);
const stepS = box(A.plinth[0] - 0.2, -1.6, BASE, A.plinth[0] + 0.6, 1.6, 0.3);

const tower = union([plinth, core.subtract(shaftCuts), bands, ...on(crownPoint, LONG), ...cornerCaps, kap, place(portalN, { deg: N }), place(stepS, { deg: Z })])
  .subtract(union([openings, place(doorN, { deg: N }), place(doorS, { deg: Z })]));

await writeLandmark({
  slug: "watertoren-kwadijk",
  base: BASE,
  nodes: [["building:achtkante-schacht-reservoirs-bekroning-en-kap", tower]],
  catalog: {
    name: "Watertoren Kwadijk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [0, 9], [0, -9]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0478100000003103"],
    description:
      "Oorsprong op het hart van het achtkante BAG-pand op maaiveld (NAP -0,3 m), +X de normaal van de westgevel (RD 162,35 graden), ingang op het noorden naar -Y. Sokkel, acht hoekkolommen met teruggemetseld muurwerk, wigvormig verdiepte noord- en zuidgevel met drie vensterreeksen, kleinere vensters oost en west, twee betonnen banden op de reservoirbodems (25,8 en 33,5 m), reservoirgeledingen met vensternissen, bekroning met art-deco-punten tot 42,9 m en een lage achtzijdige kap tot 45,8 m; ingang met omlijsting op het noorden, glazen deur op het zuiden. Maten uit BAG, AHN en foto's.",
    realWorld: {
      publishedHeightM: 45.5,
      reservoirsM3: [500, 500],
      reservoirDiameterM: 10.2,
      built: 1925,
      architect: "B.F. van Nievelt (PWN)",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 45.8,
      plinthAcrossLongFacesM: A.plinth[0] * 2,
      plinthAcrossChamfersM: A.plinth[1] * 2,
      columnsAcrossLongFacesM: A.col[0] * 2,
      bandsM: [H.band1, H.band2],
      crownM: [H.crown[0], H.crownPoint],
      roofApexM: H.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/508231 (1925, B.F. van Nievelt, 45,50 m, achthoekig, skelet, reservoirs, geleding, vensters, ingang)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Kwadijk)",
      "https://commons.wikimedia.org/wiki/File:Kwadijk_Watertoren_5409.JPG (frontaal van het zuiden: geledingen, vensters, bekroning)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Kwadijk_20250704_152811.jpg (van het zuidoosten: oost- en zuidgevel)",
      "PDOK BAG-pand 0478100000003103, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});

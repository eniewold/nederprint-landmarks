// Watertoren van station Haaksbergen (Museum Buurtspoorweg), Stationsstraat 1, gebouwd in 1998 (Wikipedia: lijst van
// watertorens in Overijssel; ontwerp, hoogte en inhoud onbekend). Een kleine spoorwegwatertoren in oude stijl: een
// bakstenen onderbouw op een rechthoek met in elke zijde een doorgang onder een boog, een geknikte plint tot de
// aanzet van de bogen, kleine vensters boven de bogen, daarop een uitkragende, groen beschoten houten kuip met een rij kleine
// vensters onder een gootlijst op consoles, en een schilddak met korte nok (luchtfoto) en makelaars.
//
// Oorsprong op het hart van BAG-pand 0158100000004297 (rechthoek 4,49 × 3,17 m; het enige pand op deze plek, BAG-bouwjaar
// 1884 is dat van het stationsgebouw ernaast) op maaiveld, AHN-DTM NAP +26,1 (ring 25,9 tot 26,3). Lokale +X is de lange
// zijde van het BAG-pand (RD 33,75 graden, naar het noordoosten); de bogen in de korte zijden (normaal ±X) zijn de voorzijde
// op de foto.
// Maten: BAG (onderbouw), AHN-DSM 0,5 m (gootlijst NAP +34,0 = 7,9 m, top NAP +35,9 = 9,8 m; de dakrand ligt op ±3,45 m in X
// en ±2,6 m in Y), luchtfoto (schilddak met korte nok langs X) en "Haaksbergen Stationsstraat Watertoren.JPG" (Commons,
// 1 augustus 2015, recht op een korte zijde; schaal circa 100 px/m uit de hoogte tot de gootlijst en de BAG-breedte 3,17 m).
import { hull, union, prism, rect, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [247353.76, 464154.64];
const DEG = 33.75;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 26.1;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 69,90, west 69,80, noord 69,73, zuid 69,85),
// gemeten 2026-11-06; het PDOK-pand begint op 69,58.
const GROUND_ELLIPSOID = 69.73;
const TAN55 = Math.tan((55 * Math.PI) / 180);

// Halve maten (X langs de lange zijde, Y langs de korte zijde).
const PLINTH = [2.245, 1.585]; // onderbouw tot de aanzet van de bogen (BAG 4,49 × 3,17)
const WALL = [2.145, 1.485]; // muur erboven, 0,1 m terug
const TANK = [3.1, 2.25]; // houten kuip
const EAVE = [3.45, 2.6]; // gootlijst (AHN)
const H = {
  plinth: 2.35, // bovenkant van de geknikte plint (aanzet van de bogen)
  impost: 2.45, // muur 0,1 m terug onder 45 graden
  spring: 2.45, // aanzet van de bogen
  soffit: 5.25, // onderkant van de kuip aan de buitenkant (foto: 5,0 tot 5,15 met de goudkleurige band)
  corniceFoot: 7.2, // onderkant van de gootlijst tegen de kuip (0,35 m uitkraging over 0,4 m)
  corniceEdge: 7.6, // onderkant van de gootlijst aan de rand (45 graden)
  eave: 7.9, // bovenkant van de gootlijst (AHN-DSM NAP +34,0)
  apex: 9.8, // nok (AHN-DSM NAP +35,9)
};
const ARCH_W = 1.3; // doorgang, spitsboog met flanken van 55 graden (op de foto rond, 1,3 m breed, top circa 3,2 m)
const RIDGE = EAVE[0] - EAVE[1]; // gelijke hellingen: halve noklengte 0,85 m

// Nis in het vlak met normaal +X (vlak op afstand f), breedte wd rond y, plafond onder 56 graden naar binnen oplopend.
const niche = (f, wd, z0, z1, depth, y = 0) => {
  const y0 = y - wd / 2, y1 = y + wd / 2, za = z1 + 1.5 * depth, out = Math.min(1, (z1 - z0) / 1.5);
  return hull([
    [f - depth, y0, z0], [f + out, y0, z0], [f - depth, y1, z0], [f + out, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + out, y0, z1 - 1.5 * out], [f + out, y1, z1 - 1.5 * out],
  ]);
};
// Nissen in beide vlakken van een as: deg 0 (vlakken ±X, offset langs Y) of 90 (vlakken ±Y, offset langs X).
const pairNiches = (f, wd, z0, z1, depth, offsets, deg) =>
  [0, 180].flatMap((turn) => offsets.map((o) => place(niche(f, wd, z0, z1, depth, o), { deg: deg + turn })));
// Doorgang langs X (bogen in de korte zijden): spitsboog, vlakke onderkant onder het model.
const passage = (len) => {
  const w = ARCH_W / 2, top = H.spring + w * TAN55, pts = [];
  for (const x of [-len, len]) pts.push([x, -w, BASE - 1], [x, w, BASE - 1], [x, -w, H.spring], [x, w, H.spring], [x, 0, top]);
  return hull(pts);
};

// ---------- onderbouw ----------
const plinth = union([
  prism(rect(-PLINTH[0], -PLINTH[1], PLINTH[0], PLINTH[1]), BASE, H.plinth),
  hull([
    ...rect(-PLINTH[0], -PLINTH[1], PLINTH[0], PLINTH[1]).map(([x, y]) => [x, y, H.plinth]),
    ...rect(-WALL[0], -WALL[1], WALL[0], WALL[1]).map(([x, y]) => [x, y, H.impost]),
  ]),
]);
const wall = prism(rect(-WALL[0], -WALL[1], WALL[0], WALL[1]), H.plinth, H.soffit + 0.2);
// Kuip: de onderkant kraagt onder 40 graden (korte zijden, 0,955 m) en 34 graden (lange zijden, 0,765 m) uit het lood uit
// tot de buitenmaat op 5,25 m (in het echt vlak). Bij 44 graden vulde de export nog een rand onder de aanzet en de vensters.
const soffitDrop = 1.15;
const soffit = hull([
  ...rect(-WALL[0], -WALL[1], WALL[0], WALL[1]).map(([x, y]) => [x, y, H.soffit - soffitDrop]),
  ...rect(-TANK[0], -TANK[1], TANK[0], TANK[1]).map(([x, y]) => [x, y, H.soffit]),
]);
const tank = prism(rect(-TANK[0], -TANK[1], TANK[0], TANK[1]), H.soffit, H.corniceFoot + 0.1);
const cornice = hull([
  ...rect(-TANK[0], -TANK[1], TANK[0], TANK[1]).map(([x, y]) => [x, y, H.corniceFoot]),
  ...rect(-EAVE[0], -EAVE[1], EAVE[0], EAVE[1]).flatMap(([x, y]) => [[x, y, H.corniceEdge], [x, y, H.eave]]),
]);
// Schilddak met gelijke hellingen (36 graden) en een nok van 1,7 m langs X.
const roof = hull([
  ...rect(-EAVE[0], -EAVE[1], EAVE[0], EAVE[1]).map(([x, y]) => [x, y, H.eave - 0.01]),
  [-RIDGE, 0, H.apex], [RIDGE, 0, H.apex],
]);

// ---------- openingen ----------
const openings = union([
  passage(PLINTH[0] + 1), // bogen in de korte zijden
  place(passage(PLINTH[1] + 1), { deg: 90 }), // bogen in de lange zijden
  // Twee vensters naast de boog in de korte zijden, drie in de lange zijden (0,45 × 0,35 m), onder de uitkraging van de kuip.
  ...pairNiches(WALL[0], 0.45, 3.65, 4.0, 0.3, [-0.55, 0.55], 0),
  ...pairNiches(WALL[1], 0.45, 3.65, 4.0, 0.3, [-1.3, 0, 1.3], 90),
  // Vensterrij in de kuip: drie in de korte, vijf in de lange zijden (0,45 × 0,65 m).
  ...pairNiches(TANK[0], 0.45, 6.45, 7.1, 0.3, [-1.3, 0, 1.3], 0),
  ...pairNiches(TANK[1], 0.45, 6.45, 7.1, 0.3, [-2, -1, 0, 1, 2], 90),
]);

const building = union([plinth, wall, soffit, tank, cornice, roof]).subtract(openings);

await writeLandmark({
  slug: "watertoren-haaksbergen",
  base: BASE,
  nodes: [["building:bakstenen-onderbouw-met-bogen-houten-kuip-en-schilddak", building]],
  catalog: {
    name: "Watertoren Haaksbergen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5, 0], [-5, 0], [0, 4.5], [0, -4.5]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0158100000004297"],
    description:
      "Oorsprong op het hart van het BAG-pand op maaiveld (NAP +26,1 m), +X de lange zijde (RD 33,75 graden). Bakstenen onderbouw van 4,49 × 3,17 m met een geknikte plint en in elke zijde een doorgang onder een spitsboog, kleine vensters, een uitkragende houten kuip van 6,2 × 4,5 m met een vensterrij, een gootlijst tot 7,9 m en een schilddak met korte nok tot 9,8 m. Maten uit BAG, AHN, luchtfoto en één foto.",
    realWorld: {
      built: 1998,
      designer: "onbekend",
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 34.0,
      ahnTopNapM: 35.9,
      baseM: [PLINTH[0] * 2, PLINTH[1] * 2],
      tankM: [TANK[0] * 2, TANK[1] * 2],
      eaveOutlineM: [EAVE[0] * 2, EAVE[1] * 2],
      eaveM: H.eave,
      apexM: H.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Overijssel (Haaksbergen, 1998; ontwerp en hoogte onbekend)",
      "https://commons.wikimedia.org/wiki/File:Haaksbergen_Stationsstraat_Watertoren.JPG (2015, recht op een korte zijde: bogen, plint, vensters, kuip, gootlijst en schilddak)",
      "PDOK BAG-pand 0158100000004297, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

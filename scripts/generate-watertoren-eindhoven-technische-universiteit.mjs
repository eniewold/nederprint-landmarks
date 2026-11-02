// Watertoren van de Technische Universiteit Eindhoven (OD 205, 1967), 24,4 m
// hoog met een reservoir van 110 m³, op de campus naast het voormalige
// ketelhuis Ceres; samen met de schoorsteen en de loopbrug een gemeentelijk
// monument (Ceres, Groene Loper 7, ketelhuis 1957-1959, uitbreiding 1967-1968,
// Van Embden/OD 205). Paddenstoelvorm: een slanke, gladde betonnen schacht van
// 1,5 m die onderaan trompetvormig uitloopt naar een voet van 2,6 m op een
// achtkantige plint (de BAG-contour), een cilindrisch reservoir van 6,24 m met
// een vlak kegelvormige bodem en een licht oplopend dak met een luik in het
// midden. Op 4,4 tot 7,5 m sluit een glazen loopbrug van 2,6 m breed vanaf de
// oostgevel van Ceres aan op een glazen paviljoen rond de schacht; aan de
// oostkant daarvan loopt het trappenhuis door tot 2,1 m boven het maaiveld,
// waar een buitentrap het opvangt.
//
// Oorsprong op het midden van de achtkantige BAG-contour (pand
// 0772100000300497, 3,6 m) op maaiveld (AHN-DTM NAP +16,16 m); +X wijst naar
// RD-oost, langs de loopbrug (de gevel van Ceres loopt precies noord-zuid).
// Hoogtes uit het AHN-DSM 0,5 m en de 3D BAG (AHN5): dakrand NAP +39,45
// (23,3 m), dak tot +40,1 in het midden, luik tot +40,8; dak van de loopbrug
// NAP +23,7 (7,54 m). Diameters van het reservoir (6,24 m) en de schacht
// (1,45 m) uit de luchtfoto (4 cm), de rest uit de foto "Eindhoven Watertoren
// TU 2010" (55 px/m bij het reservoir, ca. 70 px/m bij de voet; de ellips van
// de onderrand geeft een kijkhoek van 33 graden). Loopbrug en paviljoen uit
// het DSM, de luchtfoto (scheefstand ca. 0,3 m per m hoogte naar het noorden
// gecorrigeerd) en de foto.
import { CrossSection, Manifold, hull, ring3, circle, union, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [162098.79, 384233.07];
const AXIS = [1, 0]; // +X = RD-oost
const BASE = -0.3;
const GROUND_NAP = 16.16; // AHN-DTM rond de voet (16,08 tot 16,22)
const GEOID_N = 43.92; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 96;

// BAG-contour van pand 0772100000300497 (de plint), lokaal.
const PLINTH = [
  [1.06, -1.79], [1.81, -1.09], [1.77, 1.06], [1.06, 1.76],
  [-1.1, 1.78], [-1.8, 1.08], [-1.82, -1.06], [-1.03, -1.79],
];
const R = {
  shaft: 0.725, // luchtfoto 1,45 m; foto 0,24 keer het reservoir
  foot: 1.3, // trompetvoet, 1,75 keer de schacht op de foto
  tank: 3.12, // luchtfoto 6,24 m
  hatch: 0.7,
};
const H = {
  plinth: 0.4,
  flare: 4.2, // bovenkant van de trompetvoet, net onder de vloer van het paviljoen
  bottom: 19.3, // bodem tegen de schacht
  rim: 19.9, // onderrand van het reservoir (bodem 14 graden)
  eave: 23.3, // dakrand (DSM NAP +39,4 tot +39,5)
  roof: 23.85, // dak bij het luik (DSM NAP +40,0 tot +40,1)
  hatch: 24.3,
  top: 24.6, // luik (DSM tot NAP +40,8; Wikipedia 24,4 m)
};
const LINK = {
  soffit: 4.4, // onderkant loopbrug en paviljoen
  floorBand: 4.9, // bovenkant van de rode vloerrand
  glassTop: 6.95, // bovenkant van het glas
  chamfer: 7.25, // de dakrand loopt onder 45 graden terug naar het glas
  roof: 7.54, // dak (DSM NAP +23,7)
  recess: 0.3, // glas 0,3 m achter de vloer- en dakrand
  west: -16.6, // 0,2 m in de oostgevel van Ceres (BAG x = -16,39)
  south: -1.4,
  north: 1.2,
  stairBottom: 2.1, // onderkant van het trappenhuis
};
// Paviljoen rond de schacht: convexe achthoek, noordgevel in het verlengde van de loopbrug.
const PAVILION = [[-3.1, LINK.south], [-1.6, -2.9], [2.1, -2.9], [3.4, -1.6], [3.4, LINK.north], [-3.1, LINK.north]];
const STAIR_WEST = 0.9; // het trappenhuis beslaat het paviljoen ten oosten van x = 0,9

// ---------- schacht en reservoir als één omwentelingsprofiel ----------
const flare = Array.from({ length: 9 }, (_, k) => {
  const t = k / 8; // 0 = voet, 1 = schacht
  const z = H.plinth + t * (H.flare - H.plinth);
  return [R.shaft + (R.foot - R.shaft) * (1 - t) ** 2, z];
});
const tower = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.foot, BASE], ...flare, [R.shaft, H.bottom], [R.tank, H.rim], [R.tank, H.eave],
    [R.hatch, H.roof], [R.hatch, H.hatch], [0, H.top],
  ]]),
  SEG,
);
const plinth = prism(PLINTH, BASE, H.plinth);

// ---------- loopbrug en paviljoen ----------
// Een convex blok met een vloerrand, glas dat 0,3 m terugligt en een dakrand die onder 45 graden naar het glas terugloopt.
// `inset` is de doorsnede op de glaslijn; `outer` de buitenmaat.
const glazedBlock = (outer, inset, z0) => union([
  prism(outer, z0, LINK.floorBand),
  prism(inset, z0, LINK.roof),
  hull([...ring3(inset, LINK.glassTop), ...ring3(outer, LINK.chamfer), ...ring3(outer, LINK.roof)]),
]);
const offset = (pts, d) => new CrossSection([pts]).offset(d, "Miter").toPolygons()[0].map(([x, y]) => [x, y]);
// Loopbrug: alleen de lange gevels liggen terug; het westeinde zit in de gevel van Ceres, het oosteinde in het paviljoen.
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const bridge = glazedBlock(
  rect(LINK.west, LINK.south, -1.0, LINK.north),
  rect(LINK.west, LINK.south + LINK.recess, -1.0, LINK.north - LINK.recess),
  LINK.soffit,
);
const pavilionInset = offset(PAVILION, -LINK.recess);
const pavilion = glazedBlock(PAVILION, pavilionInset, LINK.soffit);
// Trappenhuis onder het paviljoen: glas op de glaslijn van het paviljoen, van 2,1 m tot de vloer.
const clipEast = (pts) => new CrossSection([pts]).intersect(new CrossSection([rect(STAIR_WEST, -10, 10, 10)])).toPolygons()[0].map(([x, y]) => [x, y]);
const stairHouse = prism(clipEast(pavilionInset), LINK.stairBottom, LINK.soffit + 0.1);
// Buitentrap van 1,0 m breed die van west naar oost onder 42 graden naar het trappenhuis oploopt.
const STAIR = { x0: 0.1, x1: 2.5, y0: -2.0, y1: -1.0, z1: LINK.stairBottom + 0.1 };
const stair = hull([
  [STAIR.x0, STAIR.y0, BASE], [STAIR.x1, STAIR.y0, BASE], [STAIR.x1, STAIR.y0, STAIR.z1], [STAIR.x0, STAIR.y0, 0],
  [STAIR.x0, STAIR.y1, BASE], [STAIR.x1, STAIR.y1, BASE], [STAIR.x1, STAIR.y1, STAIR.z1], [STAIR.x0, STAIR.y1, 0],
]);

const all = union([tower, plinth, bridge, pavilion, stairHouse, stair]);

await writeLandmark({
  slug: "watertoren-eindhoven-technische-universiteit",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op; een los reservoir of een losse loopbrug zou een eigen voet tot de grondplaat krijgen.
  nodes: [["building:watertoren-loopbrug-en-trappenhuis", all]],
  catalog: {
    name: "Watertoren Technische Universiteit Eindhoven",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Op de bestrating rond de voet, buiten de loopbrug; het maaiveld is hier vlak (NAP +16,1 tot +16,2).
    groundSamplePoints: [[5, 0], [0, 4], [-4, -4], [1, -5]],
    // Ellipsoïdisch: NAP +16,16 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0772100000300497"],
    description:
      "Oorsprong op het midden van de achtkantige BAG-contour (de plint, 3,6 m) op maaiveld (NAP +16,16 m), +X naar RD-oost langs de loopbrug. Gladde betonnen schacht van 1,45 m met een trompetvoet van 2,6 m tot 4,2 m, cilindrisch reservoir van 6,24 m met een kegelvormige bodem van 19,3 tot 19,9 m, dakrand op 23,3 m, licht oplopend dak en een luik tot 24,6 m. Glazen loopbrug van 2,6 m breed van de oostgevel van Ceres naar een achtkantig paviljoen rond de schacht (4,4 tot 7,54 m), met aan de oostkant het trappenhuis tot 2,1 m en een buitentrap. Maten uit AHN, BAG, 3D BAG, luchtfoto en foto.",
    realWorld: {
      publishedHeightM: 24.4,
      reservoirM3: 110,
      built: 1967,
      bagBuildYear: 1957,
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 39.45,
      ahnRoofNapM: 40.1,
      ahnTopNapM: 40.8,
      ahnLinkRoofNapM: 23.7,
      geoidNlgeo2018M: GEOID_N,
      tankDiameterM: R.tank * 2,
      shaftDiameterM: R.shaft * 2,
      footDiameterM: R.foot * 2,
      tankRimM: H.rim,
      eaveM: H.eave,
      modelTopM: H.top,
      linkM: [LINK.soffit, LINK.roof],
      linkWidthM: +(LINK.north - LINK.south).toFixed(2),
      photoScalePxPerM: 55,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(TU_Eindhoven)",
      "https://commons.wikimedia.org/wiki/File:Eindhoven_Watertoren_TU_2010.jpg (reservoir, schacht, trompetvoet, loopbrug, paviljoen en buitentrap)",
      "Gemeente Eindhoven, gemeentelijk monument Ceres (Ketelhuis), Groene Loper 7: ketelhuis, schoorsteen, loopbrug en watertoren, 1957-1959 en 1967-1968",
      "PDOK BAG-panden 0772100000300497 (watertoren) en 0772100000299963 (Ceres, oostgevel), AHN DSM/DTM 0,5 m en luchtfoto 4 cm, 2026-11-02",
      "3D BAG (LoD2.2, AHN5) van pand 0772100000300497: dakhoogte ter controle",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,92 m) voor groundHeight",
    ],
  },
});

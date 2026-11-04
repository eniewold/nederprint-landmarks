// Watertoren van Hoogkarspel aan de Streekweg 235, gebouwd in 1930 voor het Provinciaal Waterleidingbedrijf van
// Noord-Holland naar ontwerp van ir. B.F. van Nievelt en ir. W. Mensert (rijksmonument 495633). Volgens het register
// 49,10 m hoog, twaalfhoekig, rode baksteen rond een betonskelet van 24 kolommen, reservoirs van 600 en 400 m³. De
// schacht is verticaal geleed door de twaalf buitenste kolommen en horizontaal in drie delen met zware granieten lijsten:
// onder muurwerk en kolommen in één vlak (granieten plint, per vlak twee smalle vensters), in het midden het muurwerk
// tussen de kolommen sterk teruggemetseld (lichtspleten in zes vlakken, bovenaan per vlak een borstwering op een console
// voor een stalen deur; de deuren zelf zijn weggelaten), boven (reservoir) licht teruggemetseld met een lichtspleet per vlak. Daarop een sterk
// verjongende twaalfzijdige kap met leien en een gelijkvormige lantaarn met twaalf vierkante ramen en een spits. De
// toren staat op een aangeaarde sokkel; de ingang met dubbele deur, granieten latei en twee leeuwen op postamenten kijkt
// naar het zuid-zuidoosten, naar de oprijlaan vanaf de Streekweg.
//
// Oorsprong op het hart van het BAG-pand (cirkelfit op de twaalf hoekpunten, RD [140625.89, 523079.94]) op de bovenkant
// van de sokkel, AHN-DTM NAP +0,8 (ring van 7,5 tot 9 m: +0,69 tot +0,87; het bordes voor de ingang +0,72). De
// hoekpunten van het BAG-pand staan op RD 1,75 + 30k graden; lokale +X is de normaal van een gevelvlak (RD 16,75 graden),
// de ingang zit in het vlak met normaal -Y (RD -73,25 graden, naar het bordes en de oprijlaan). Alle twaalfhoeken staan
// met hun hoekpunten op 15 + 30k graden in het lokale stelsel.
// Maten: BAG-pand (apothema 7,09 m aan de voet); AHN-DSM 0,5 m (kap als omwentelingsprofiel, top NAP +47,7);
// geledingen uit de foto's "WatertorenHoogkarspel.jpg" (Commons, van circa 90 m, perspectief gefit op de voet, de
// kroonlijst en de breedtes) en "Watertoren Hoogkarspel 20180712.jpg" (telelens, vrijwel orthografisch: kap, lantaarn
// en de breedte van het reservoirdeel; schaal en hoogte van de kroonlijst passend op het AHN-profiel van de kap).
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [140625.89, 523079.94];
const DEG = 16.75;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 0.8;
const GROUND_ELLIPSOID = 43.12; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04 (43,12 tot 43,16)
const T15 = Math.tan(Math.PI / 12);
const C15 = Math.cos(Math.PI / 12);

// Twaalfhoek met apothema a (afstand hart-gevelvlak), hoekpunten op 15 + 30k graden.
const dod = (a, z) => Array.from({ length: 12 }, (_, k) => {
  const t = (Math.PI / 12) * (2 * k + 1);
  return [(a / C15) * Math.cos(t), (a / C15) * Math.sin(t), z];
});
const dodPrism = (a, z0, z1) => prism(dod(a, 0).map(([x, y]) => [x, y]), z0, z1);
const frustum = (a0, z0, a1, z1) => hull([...dod(a0, z0), ...dod(a1, z1)]);
const twelve = (m, skip = []) => Array.from({ length: 12 }, (_, k) => k).filter((k) => !skip.includes(k)).map((k) => place(m, { deg: 30 * k }));

// Apothema's (gevelvlak of kolomvlak) en hoogtes boven de sokkel.
const A = {
  plinth: 7.05, // granieten plint (BAG-pand: apothema 7,09)
  lower: 6.85, // onderste deel, muurwerk en kolommen in één vlak
  band: 7.0, // granieten lijsten van het onderste deel
  colBase: 6.65, // granieten basementen van de kolommen
  mid0: 6.5, // kolommen van het middendeel onderaan (AHN-gevelpunten, foto)
  mid1: 6.2, // en bovenaan, onder de lijst
  midBand: 6.5, // overkragende lijst tussen midden- en reservoirdeel
  upper: 6.15, // kolommen van het reservoirdeel (telefoto: 12,5 m breed, recht)
  cornice: 6.35, // kroonlijst
};
const H = {
  plinth: 1.1,
  windows: [2.1, 4.1], // paarsgewijze vensters, hier als één nis per vlak
  band: [4.7, 5.5],
  ledge: [7.0, 7.9], // lijst tussen onder- en middendeel
  colBase: 8.7,
  slit: [9.2, 20.3], // lichtspleten in zes vlakken
  console: 20.9,
  parapet: [21.8, 23.2], // borstweringen (foto 21,8 tot 23,1)
  midBand: [24.9, 26.0], // overkragende granieten lijst (foto 24,9 tot 26,0)
  upperSlit: [27.4, 32.4],
  cornice: [33.6, 34.9], // kroonlijst (foto 33,4 tot 34,9)
  cornerBlock: 35.8, // hoekblokken op de kroonlijst (foto; AHN-profiel van de kap)
};
const DEPTH_MID = 0.45; // "sterk teruggemetseld"
const DEPTH_UP = 0.2; // "licht teruggemetseld"
const COL = 0.55; // kolombreedte langs het vlak aan weerszijden van de hoek
const aMid = (z) => A.mid0 + ((A.mid1 - A.mid0) * (z - H.ledge[1])) / (H.midBand[0] - 0.3 - H.ledge[1]);

// Nis in het vlak met normaal +X: binnenvlak f0 (op z0) tot f1 (op z1), plafond onder 56 graden naar binnen oplopend.
const niche = (f0, f1, wd, z0, z1, depth, y = 0) => {
  const y0 = y - wd / 2, y1 = y + wd / 2, za = z1 + 1.5 * depth;
  return hull([
    [f0 - depth, y0, z0], [f0 + 1.0, y0, z0], [f0 - depth, y1, z0], [f0 + 1.0, y1, z0],
    [f1 - depth, y0, za], [f1, y0, z1], [f1 - depth, y1, za], [f1, y1, z1], [f1 + 1.0, y0, z1 - 1.5], [f1 + 1.0, y1, z1 - 1.5],
  ]);
};
// Verdiept vlak tussen twee kolommen (normaal +X): voorvlak a0 op z0 tot a1 op z1, diepte d, plafond onder 45 graden.
const recess = (a0, a1, z0, z1, d) => {
  const h0 = a0 * T15 - COL, h1 = a1 * T15 - COL;
  return hull([
    [a0 - d, -h0, z0], [a0 - d, h0, z0], [a0 + 0.8, -h0, z0], [a0 + 0.8, h0, z0],
    [a1 - d, -h1, z1 - d], [a1 - d, h1, z1 - d], [a1 + 0.8, -h1, z1 + 0.8], [a1 + 0.8, h1, z1 + 0.8],
  ]);
};
// Lijst: twaalfhoek a van z0 tot z1 met een onderkant onder 45 graden vanaf het vlak aIn.
const ledge = (aIn, a, z0, z1) => hull([...dod(aIn, z0 - (a - aIn)), ...dod(a, z0), ...dod(a, z1)]);

// ---------- onderste deel ----------
const plinth = hull([...dod(A.plinth, BASE), ...dod(A.plinth, H.plinth), ...dod(A.lower, H.plinth + 0.2)]);
const lower = union([
  dodPrism(A.lower, BASE, H.ledge[1]),
  plinth,
  ledge(A.lower, A.band, H.band[0], H.band[1]),
  ledge(A.lower, A.band, H.ledge[0], H.ledge[1]),
]);

// ---------- middendeel ----------
const zMidTop = H.midBand[0] - 0.3; // begin van de schuine onderkant van de lijst op het kolomvlak
const midShaft = frustum(A.mid0, H.ledge[1] - 0.01, A.mid1, zMidTop + 0.3)
  .subtract(union(twelve(recess(A.mid0, A.mid1, H.ledge[1], zMidTop, DEPTH_MID))));
// Basementen: graniet om elke kolom, 0,75 m langs het vlak aan weerszijden van de hoek, bovenkant onder 45 graden.
const vertexDir = (pts) => pts.map(([d, p, z]) => [d * Math.cos(Math.PI / 12) - p * Math.sin(Math.PI / 12), d * Math.sin(Math.PI / 12) + p * Math.cos(Math.PI / 12), z]);
// Strook met halve breedte w om de straal naar een hoek: een punt op het vlak op afstand s van de hoek ligt s cos 15 van
// die straal, dus w = s cos 15 geeft s langs het vlak aan weerszijden van de hoek.
const sector = (s, z0, z1) => hull(vertexDir([
  [0, -s * C15, z0], [9, -s * C15, z0], [0, s * C15, z0], [9, s * C15, z0],
  [0, -s * C15, z1], [9, -s * C15, z1], [0, s * C15, z1], [9, s * C15, z1],
]));
const colBases = hull([...dod(A.colBase, H.ledge[1]), ...dod(A.colBase, H.colBase), ...dod(A.mid0 - 0.05, H.colBase + 0.15)])
  .intersect(union(twelve(sector(0.75, H.ledge[1] - 0.1, H.colBase + 0.5))));
// Borstwering per vlak tussen de kolommen, voorvlak 0,1 m achter de kolommen, onderkant onder 51 graden; console in het
// midden (0,9 m breed) van 20,9 m schuin naar de voorkant van de borstwering.
const pa0 = aMid(H.parapet[0] - 0.5), pa1 = aMid(H.parapet[1]);
const pHalf = pa1 * T15 - COL + 0.05;
const parapet = hull([
  [pa0 - DEPTH_MID - 0.05, -pHalf, H.parapet[0] - 0.5], [pa0 - DEPTH_MID - 0.05, pHalf, H.parapet[0] - 0.5],
  [pa0 - 0.1, -pHalf, H.parapet[0]], [pa0 - 0.1, pHalf, H.parapet[0]],
  [pa1 - 0.1, -pHalf, H.parapet[1]], [pa1 - 0.1, pHalf, H.parapet[1]],
  [pa1 - DEPTH_MID - 0.05, -pHalf, H.parapet[1]], [pa1 - DEPTH_MID - 0.05, pHalf, H.parapet[1]],
]);
const ca = aMid(H.console);
const consoleBlock = hull([
  [ca - DEPTH_MID - 0.05, -0.45, H.console], [ca - DEPTH_MID - 0.05, 0.45, H.console],
  [ca - DEPTH_MID - 0.05, -0.45, H.parapet[0]], [ca - DEPTH_MID - 0.05, 0.45, H.parapet[0]],
  [pa0 - 0.1, -0.45, H.parapet[0]], [pa0 - 0.1, 0.45, H.parapet[0]],
]);
const midBand = ledge(A.mid1, A.midBand, H.midBand[0], H.midBand[1]);
const middle = union([midShaft, colBases, ...twelve(union([parapet, consoleBlock])), midBand]);

// ---------- reservoirdeel en kroonlijst ----------
const zUpTop = H.cornice[0] - 0.2;
const upperShaft = dodPrism(A.upper, H.midBand[1] - 0.01, H.cornice[0] + 0.1)
  .subtract(union(twelve(recess(A.upper, A.upper, H.midBand[1], zUpTop, DEPTH_UP))));
const cornice = ledge(A.upper, A.cornice, H.cornice[0], H.cornice[1]);
// Hoekblokken: 0,6 m langs het vlak aan weerszijden van elke hoek, tot in de kap.
const cornerBlocks = dodPrism(A.cornice, H.cornice[1] - 0.01, H.cornerBlock)
  .intersect(union(twelve(sector(0.6, H.cornice[1] - 0.1, H.cornerBlock + 0.1))));

// ---------- kap en lantaarn ----------
// Twaalfzijdige kap: ringen (hoogte, apothema) uit de telefoto, passend op het AHN-profiel (r 5,0 -> NAP 38,8; 4,0 ->
// 40,3; 3,0 -> 41,6; 2,5 -> 42,1). Bol: steil aan de voet, vlakker naar boven, graten op de hoeken.
const KAP = [[H.cornice[1], 5.45], [36.0, 5.36], [37.0, 5.17], [37.95, 4.91], [38.9, 4.42], [39.9, 3.74], [40.85, 2.96], [41.4, 2.53], [41.9, 2.23]];
const kap = hull(KAP.flatMap(([z, a]) => dod(a, z)));
const LANT = { ring: [41.6, 42.3], drum: 1.8, ringA: 2.05, top: 43.7, corn: 44.0, cornA: 2.0, win: [42.7, 43.4] };
const lanternRing = hull([...dod(LANT.ringA, LANT.ring[0]), ...dod(LANT.ringA, LANT.ring[1]), ...dod(LANT.drum, LANT.ring[1] + 0.25)]);
const drum = dodPrism(LANT.drum, LANT.ring[1], LANT.top + 0.01);
const lanternCornice = ledge(LANT.drum, LANT.cornA, LANT.top, LANT.corn);
// Spits van de lantaarn: twaalfzijdig, bol, met een makelaar tot 47,1 m (telefoto; AHN-top NAP +47,7).
const SPITS = [[LANT.corn, 1.75], [44.3, 1.56], [44.8, 1.22], [45.3, 0.88], [45.8, 0.55], [46.2, 0.3]];
const spits = hull([...SPITS.flatMap(([z, a]) => dod(a, z)), [0, 0, 47.1]]);
const lanternWindows = union(twelve(niche(LANT.drum, LANT.drum, 0.55, LANT.win[0], LANT.win[1] - 0.15, 0.15)));
const lantern = union([lanternRing, drum, lanternCornice, spits]).subtract(lanternWindows);

// ---------- openingen ----------
const ENTRANCE = 9; // vlak met normaal -Y (270 graden)
const towerOpenings = union([
  // Onderste deel: in elk vlak behalve de ingang een nis voor het paar vensters (2 x 0,45 m met een penant, hier 1,3 m).
  ...twelve(niche(A.lower, A.lower, 1.3, H.windows[0], H.windows[1], 0.3), [ENTRANCE]),
  // Middendeel: lichtspleten (in het echt circa 0,3 m, hier 0,6 m) in de zes vlakken 0, 60, ..., 300 graden.
  ...twelve(niche(aMid(H.slit[0]) - DEPTH_MID, aMid(H.slit[1]) - DEPTH_MID, 0.6, H.slit[0], H.slit[1], 0.3), [1, 3, 5, 7, 9, 11]),
  // Reservoirdeel: een lichtspleet per vlak.
  ...twelve(niche(A.upper - DEPTH_UP, A.upper - DEPTH_UP, 0.6, H.upperSlit[0], H.upperSlit[1], 0.25)),
]);
const tower = union([lower, middle, upperShaft, cornice, cornerBlocks, kap, lantern]).subtract(towerOpenings);

// ---------- ingang (gebouwd in het vlak met normaal +X, daarna naar -Y gedraaid) ----------
// Gemetselde omlijsting 0,4 m voor het vlak, 3,2 m breed tot 3,4 m, granieten latei met lantaarns tot 3,9 m; dubbele
// deur 1,6 x 2,7 m als nis; twee treden; leeuwen op postamenten aan weerszijden (foto "Ingang watertoren Hoogkarspel").
const portal = union([
  box(A.lower - 0.1, -1.6, BASE, A.lower + 0.4, 1.6, 3.4),
  hull([
    [A.lower - 0.1, -1.8, 3.4], [A.lower - 0.1, 1.8, 3.4], [A.lower + 0.4, -1.8, 3.4], [A.lower + 0.4, 1.8, 3.4],
    [A.lower - 0.1, -1.8, 3.9], [A.lower - 0.1, 1.8, 3.9], [A.lower + 0.5, -1.8, 3.9], [A.lower + 0.5, 1.8, 3.9],
  ]).subtract(box(A.lower + 0.4, -1.9, 3.3, A.lower + 0.6, 1.9, 3.4)),
  box(A.lower + 0.3, -1.4, BASE, A.lower + 1.3, 1.4, 0.3), // treden
]);
const lion = (s) => union([
  box(A.lower + 0.1, s * 1.5, BASE, A.lower + 1.1, s * 2.5, 1.0), // postament
  hull([
    [A.lower + 0.15, s * 1.55, 1.0], [A.lower + 1.05, s * 1.55, 1.0], [A.lower + 0.15, s * 2.45, 1.0], [A.lower + 1.05, s * 2.45, 1.0],
    [A.lower + 0.2, s * 1.6, 1.9], [A.lower + 0.75, s * 1.6, 1.9], [A.lower + 0.2, s * 2.4, 1.9], [A.lower + 0.75, s * 2.4, 1.9],
  ]),
]);
const doorNiche = niche(A.lower + 0.4, A.lower + 0.4, 1.6, 0.3, 2.7, 0.5);
const entrance = place(union([portal, lion(1), lion(-1)]).subtract(doorNiche), { deg: 30 * ENTRANCE });

const building = union([tower, entrance]);

await writeLandmark({
  slug: "watertoren-hoogkarspel",
  base: BASE,
  nodes: [["building:twaalfkante-schacht-kap-lantaarn-en-ingang", building]],
  catalog: {
    name: "Watertoren Hoogkarspel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8], [0, -8]],
    // Ellipsoïdisch: de PDOK-terreinhoogte op de sokkel rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0498100000000708"],
    description:
      "Oorsprong op het hart van het twaalfhoekige BAG-pand op de sokkel (NAP +0,8 m), +X de normaal van een gevelvlak (RD 16,75 graden), ingang naar -Y (RD -73,25 graden). Granieten plint en onderste deel met vensternissen en twee lijsten, middendeel met kolommen op basementen, sterk verdiepte vlakken, zes lichtspleten en borstweringen op consoles, overkragende lijst, reservoirdeel met lichtspleten, kroonlijst met hoekblokken tot 35,8 m, bolle twaalfzijdige kap tot 41,9 m en lantaarn met ramen en spits tot 47,1 m; ingang met omlijsting, latei, treden en twee leeuwen. Maten uit BAG, AHN en foto's.",
    realWorld: {
      publishedHeightM: 49.1,
      reservoirsM3: [600, 400],
      built: 1930,
      architects: "B.F. van Nievelt en W. Mensert (PWN)",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 47.7,
      plinthAcrossFacesM: A.plinth * 2,
      lowerAcrossFacesM: A.lower * 2,
      middleAcrossFacesM: [A.mid0 * 2, A.mid1 * 2],
      reservoirAcrossFacesM: A.upper * 2,
      ledgesM: [H.band, H.ledge, H.midBand, H.cornice],
      parapetsM: H.parapet,
      cornerBlocksM: H.cornerBlock,
      roofTopM: 41.9,
      lanternM: [LANT.ring[0], LANT.corn],
      finialM: 47.1,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/495633 (1930, B.F. van Nievelt en W. Mensert, 49,10 m, twaalfhoekig, geleding, kap en lantaarn)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Hoogkarspel)",
      "https://commons.wikimedia.org/wiki/File:WatertorenHoogkarspel.jpg (van circa 90 m: geledingen en breedtes, perspectief gefit)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Hoogkarspel_20180712.jpg (telelens: kap, lantaarn en reservoirdeel)",
      "https://commons.wikimedia.org/wiki/File:Ingang_watertoren_Hoogkarspel.JPG, File:Watertoren_Hoogkarspel.JPG en File:Hoogkarspel_with_water_tower.jpg (ingang, consoles, kolommen)",
      "PDOK BAG-pand 0498100000000708 (BGT-pand G0388.f787b31f05eb47979d6bd14e792a84ae), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});

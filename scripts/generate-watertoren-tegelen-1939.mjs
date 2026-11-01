// Watertoren van Tegelen-Egypte (E. Noorman, Amersfoort, 1938-1939),
// rijksmonument 524690, reservoir 500 m³, sinds 2005 buiten gebruik. Betonnen
// achtkant in het bos bij de bron van de Wijlderbeek: een iets bredere
// onderbouw met een dunne lijst en de ingang tussen twee penanten met een
// stoep, een schacht met afgeschuinde hoeken waarin de smalle trapvensters
// boven elkaar staan, een brede uitkragende kroonlijst en daarboven de even
// brede reservoirkop met een plat dak en een lage dakrand.
// Oorsprong op het middelpunt van de achtkantige BAG-contour (de onderbouw,
// 11,6 m over de vlakken) op maaiveld (NAP +32,88 m). +X wijst naar het vlak
// op -19 graden van RD-oost (zijden uit de BAG en de luchtfoto); de vlakken
// staan op 0, 45, ... graden, de ingang op -45 graden (zuidzuidoost, de stoep
// staat op de luchtfoto). Dakhoogte en breedte van de kop uit het AHN,
// hoogteverhoudingen van kop en kroonlijst uit de foto's "Watertoren Tegelen"
// en "1951 Het voetbalveld van Sportclub Irene bij de Watertoren" (geschaald
// op de breedte van de schacht), de onderbouw en de ingang uit de foto
// "Watertoren" (van voren, van onderen).
import { Manifold, hull, ring3, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [208560.1, 372591.5];
const DEG = -19; // vlak +X ten opzichte van RD-oost
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(4), +Math.sin((DEG * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 32.88; // AHN-DTM rond de voet (32,8 tot 32,95)
const GROUND_N = 44.73; // NLGEO2018-geoïdehoogte op de oorsprong
const H = {
  ledgeFoot: 2.85, // onderkant van de schuine kraag onder de lijst van de onderbouw
  ledge: 3.15, // onderkant van de lijstplaat
  ledgeTop: 3.4,
  corbel: 25.15, // onderkant van de schuine kraag onder de kroonlijst
  fascia: 26.75, // onderkant van de rechte rand van de kroonlijst
  cornice: 27.35, // bovenkant van de kroonlijst
  roof: 31.1, // plat dak (AHN 31,14)
  rim: 31.3, // dakrand (AHN tot 31,29)
};
// Apothema's (halve breedte over de vlakken).
const A = {
  base: 5.8, // onderbouw = BAG-contour
  ledge: 6.0,
  shaft: 5.45, // schacht en kop (AHN-dakrand op 5,4; op de foto's even breed)
  chamfer: 5.73, // afgeschuinde hoeken van de schacht, 0,82 m breed
  cornice: 6.45, // kroonlijst, 1,18 keer de schacht op de foto's
  rimInner: 4.95,
};

const oct = (a, z) => ring3(circle([0, 0], a / Math.cos(Math.PI / 8), 8, Math.PI / 8), z); // vlakken op 0, 45, ...
const octPrism = (a, z0, z1) => hull([...oct(a, z0), ...oct(a, z1)]);
// Doorsnede van de schacht: achtkant met afgeschuinde hoeken (zestienhoek).
const y0 = (A.chamfer - A.shaft * Math.cos(Math.PI / 8)) / Math.sin(Math.PI / 8);
const shaft16 = Array.from({ length: 8 }, (_, k) => {
  const t = (k * Math.PI) / 4, c = Math.cos(t), s = Math.sin(t);
  return [[A.shaft * c + y0 * s, A.shaft * s - y0 * c], [A.shaft * c - y0 * s, A.shaft * s + y0 * c]];
}).flat();
const shaftPrism = (z0, z1) => hull([...ring3(shaft16, z0), ...ring3(shaft16, z1)]);

// ---------- onderbouw met lijst ----------
const base = octPrism(A.base, BASE, H.ledge + 0.05);
// Lijst op een schuine kraag (56 graden) van de onderbouw naar de rand.
const ledge = hull([...oct(A.base, H.ledgeFoot), ...oct(A.ledge, H.ledge), ...oct(A.ledge, H.ledgeTop)]);

// ---------- schacht, kroonlijst en kop ----------
const shaft = shaftPrism(BASE, H.cornice - 0.3);
// Kroonlijst: schuine kraag van de schacht naar de rand (58 graden midden op een
// vlak, 52 graden op de hoeken boven de afschuiningen), dan een rechte rand.
const cornice = hull([...ring3(shaft16, H.corbel), ...oct(A.cornice, H.fascia), ...oct(A.cornice, H.cornice)]);
const head = octPrism(A.shaft, H.cornice - 0.3, H.roof);
const rim = octPrism(A.shaft, H.roof - 0.1, H.rim).subtract(octPrism(A.rimInner, H.roof, H.rim + 0.1));

// ---------- ingang: twee penanten en een stoep ----------
const DOOR = -45; // zuidzuidoost
const pier = (y) => prism([[A.base - 0.1, y - 0.225], [A.base + 0.2, y - 0.225], [A.base + 0.2, y + 0.225], [A.base - 0.1, y + 0.225]], BASE, H.ledge + 0.05);
const piers = union([pier(-1.575), pier(1.575)]);
const steps = union([
  prism([[A.base - 0.1, -2.0], [A.base + 1.3, -2.0], [A.base + 1.3, 2.0], [A.base - 0.1, 2.0]], BASE, 0.15),
  prism([[A.base - 0.1, -1.8], [A.base + 0.7, -1.8], [A.base + 0.7, 1.8], [A.base - 0.1, 1.8]], BASE, 0.3),
]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Smalle trapvensters in de afschuiningen, vijf boven elkaar (foto 1951: om de ~5 m).
const WINDOWS = [[3.8, 5.8], [7.2, 9.6], [12.3, 14.7], [17.0, 19.6], [22.2, 24.6]];
const cuts = [
  place(niche(A.base + 0.2, 2.7, 0.3, 2.75, 0.4), { deg: DOOR }), // deur tussen de penanten
  ...Array.from({ length: 8 }, (_, k) => WINDOWS.map(([z0, z1]) => place(niche(A.chamfer, 0.5, z0, z1, 0.3), { deg: 22.5 + k * 45 }))).flat(),
];

const tower = union([base, ledge, shaft, cornice, head, rim, place(union([piers, steps]), { deg: DOOR })]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-tegelen-1939",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:onderbouw-schacht-kroonlijst-en-kop", tower]],
  catalog: {
    name: "Watertoren Tegelen-Egypte",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch maaiveld: NAP +32,88 m plus de NLGEO2018-geoïdehoogte 44,73 m op de oorsprong.
    groundHeight: +(GROUND_NAP + GROUND_N).toFixed(2),
    groundSamplePoints: [[7.5, 0], [0, 7.5], [-7.5, 0], [0, -7.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0983100000019604"],
    description:
      "Oorsprong op het middelpunt van de achtkantige BAG-contour op maaiveld (NAP +32,88 m), +X naar het vlak op -19 graden van RD-oost. Onderbouw van 11,6 m over de vlakken tot 3,4 m met een lijst op een schuine kraag, ingang naar het zuidzuidoosten tussen twee penanten met een stoep; schacht van 10,9 m met afgeschuinde hoeken en vijf smalle trapvensters per afschuining; kroonlijst van 12,9 m op een schuine kraag van 25,15 tot 27,35 m; reservoirkop van 10,9 m met plat dak op 31,1 m en een dakrand tot 31,3 m. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 32.1,
      reservoirM3: 500,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 64.02,
      ahnTopNapM: 64.17,
      geoidNlgeo2018M: GROUND_N,
      baseAcrossFlatsM: 11.6,
      shaftAcrossFlatsM: 10.9,
      chamferWidthM: 0.82,
      corniceAcrossFlatsM: 12.9,
      ledgeTopM: H.ledgeTop,
      corbelM: H.corbel,
      corniceM: H.cornice,
      roofM: H.roof,
      modelTopM: H.rim,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Tegelen_Egypte)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/524690",
      "https://commons.wikimedia.org/wiki/File:Watertoren.jpg (onderbouw, ingang, trapvensters in de afschuiningen)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Tegelen.jpg (kop en kroonlijst, verhoudingen)",
      "https://commons.wikimedia.org/wiki/File:1951_Het_voetbalveld_van_Sportclub_Irene_bij_de_Watertoren.jpg (hele toren, vensterrijen)",
      "https://commons.wikimedia.org/wiki/File:1952_Het_Pompstation_met_de_Watertoren,_Tegelen.jpg (hoogte van de kop)",
      "PDOK BAG-pand 0983100000019604, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

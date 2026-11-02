// Oude watertoren van Etten-Leur aan de Hoevenseweg 31 (H. Sangster, 1924,
// expressionistisch), rijksmonument 516667, 48,70 m hoog, twee reservoirs
// (300 m³ laag, 400 m³ hoog). Een betonskelet met gepleisterde vulling op een
// vierkante, afgesnoten plattegrond (afgeschuinde hoeken) in drie geledingen:
// een onderbouw met een donkere plint, vier portalen met schuine wangen en
// steunberen op de hoeken; een schacht met per gevel een lisene boven het
// portaal die bij het lage reservoir breder wordt en bij het hoge reservoir
// uitkraagt tot een erker; daarboven een achthoekige kop (kroonlijst) onder
// een koperen tentdak.
//
// Oorsprong op het hart van het vierkant uit de BAG-contour (pand
// 0777100000151802, 10,6 m over de gevels) op maaiveld (AHN-DTM NAP +6,56 m);
// de top van het tentdak ligt in het AHN precies op dit punt (NAP +55,25,
// 48,68 m boven maaiveld). +X wijst langs de oostgevel naar buiten, RD-richting
// 12,4 graden (de zuid- en noordgevel van de BAG-contour); +Y naar de
// noordgevel met het diepste portaal. Tentdak uit het AHN-DSM (z = 48,68 -
// 0,52 r langs de assen, op de diagonalen tot r 6,7: de afgeschuinde kop),
// geledingen, portalen, lisenen en erkers van de RCE-foto's (verticaal
// gecorrigeerd, geschaald op de dakrand uit het AHN), de steunberen uit de
// BAG-contour (1,0 m breed, 1,85 m uit de hoek).
import { hull, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [101932.69, 398722.56];
const AXIS_DEG = 12.4; // RD-richting van +X (zuid- en noordgevel van de BAG-contour)
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(4), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 6.56; // AHN-DTM in een ring van 8 tot 12 m (6,40 tot 6,72)
const GEOID_N = 44.08; // NLGEO2018-geoïdehoogte op de oorsprong

const S = 5.3; // halve breedte van de schacht over de gevels (BAG 10,55 tot 10,7 m)
const CH = 1.0; // afschuining van de schachthoeken (zijde 1,0 m, schuin vlak 1,4 m)
const H = {
  plinth: 2.3, // donkere plint, kraag tot 2,5
  buttress: 4.0, // steunbeer tegen het afgeschuinde hoekvlak
  buttressTip: 1.0, // punt van de steunbeer, 1,85 m uit de hoek
  portal: 6.6, // bovenkant van de portalen
  midBand: 21.0, // lisene wordt breder: zone van het lage reservoir (waterspiegel 28,5)
  erker: 34.3, // erker kraagt uit: zone van het hoge reservoir (waterspiegel 41,5)
  corbel: 42.6, // kraag onder de kroonlijst
  cornice: 43.0,
  eave: 45.7, // bovenkant kroonlijst en erkers = dakvoet (3D BAG 45,6 tot 45,9)
  apex: 48.68, // top van het tentdak (AHN)
};
const HEAD = { half: 5.7, chamfer: 1.9 }; // achthoekige kop: 11,4 m over de gevels, op de diagonalen 6,7 m uit het hart

// Vierkant met halve breedte a en afgeschuinde hoeken (zijde c), als achthoek.
const oct = (a, c) => [[a, -a + c], [a, a - c], [a - c, a], [-a + c, a], [-a, a - c], [-a, -a + c], [-a + c, -a], [a - c, -a]];
const octRing = (a, c, z) => oct(a, c).map(([x, y]) => [x, y, z]);
const octPrism = (a, c, z0, z1) => prism(oct(a, c), z0, z1);
const FACES = [
  { deg: 0, portal: 0.3 }, // oost
  { deg: 90, portal: 0.5 }, // noord: BAG-uitsprong 0,5 m
  { deg: 180, portal: 0.3 }, // west
  { deg: 270, portal: 0.3 }, // zuid
];

// ---------- onderbouw ----------
const shaft = octPrism(S, CH, BASE, H.cornice + 0.05);
// Plint 0,2 m uit de gevel met een kraag van 45 graden.
const PL = 0.2, plCh = CH + PL * (Math.SQRT2 - 1);
const plinth = hull([...octRing(S + PL, plCh, BASE), ...octRing(S + PL, plCh, H.plinth), ...octRing(S - 0.05, CH, H.plinth + PL + 0.05)]);
// Steunbeer op elke hoek, langs de diagonaal (t), 1,0 m breed; schuine rug van 4,0 m tegen het hoekvlak naar 1,0 m op de punt (50 graden).
const tFace = (2 * S - CH) / Math.SQRT2; // hoekvlak op 6,79 m uit het hart
const tTip = S * Math.SQRT2 + 1.85; // punt 1,85 m uit de (denkbeeldige) hoek
const buttressRaw = hull(
  [tFace - 1.2, tFace, tTip].flatMap((t, i) => [-0.5, 0.5].flatMap((w) => [[t, w, BASE], [t, w, i < 2 ? H.buttress : H.buttressTip]])),
);
const buttresses = [45, 135, 225, 315].map((deg) => place(buttressRaw, { deg }));

// Portaal met schuine wangen (4,6 m breed op de grond, 3,8 m op 6,6 m) en vlakke bovenkant, op de gevel met normaal +X.
const portalRaw = (p) =>
  hull([
    [S - 0.3, -2.3, BASE], [S + p, -2.3, BASE], [S - 0.3, 2.3, BASE], [S + p, 2.3, BASE],
    [S - 0.3, -1.9, H.portal], [S + p, -1.9, H.portal], [S - 0.3, 1.9, H.portal], [S + p, 1.9, H.portal],
  ]);
// Lisene of erker: trapezium met wangen van 45 graden, voorvlak op S + p met halve breedte w.
const bandRing = (w, p, z) => [[S - 0.3, -(w + p + 0.3), z], [S + p, -w, z], [S + p, w, z], [S - 0.3, w + p + 0.3, z]];
const lowBand = hull([...bandRing(1.4, 0.2, H.portal - 0.1), ...bandRing(1.4, 0.2, H.midBand)]);
// Bij het lage reservoir 0,1 m verder uit en 0,4 m breder, op een kraag van 27 graden.
const midBand = hull([...bandRing(1.4, 0.2, H.midBand), ...bandRing(1.6, 0.3, H.midBand + 0.2), ...bandRing(1.6, 0.3, H.erker)]);
// Erker bij het hoge reservoir: kraagt 0,25 m verder uit op een onderkant van 45 graden (3D BAG: 3,8 m breed,
// 0,35 tot 0,4 m voor de gevel), wordt naar boven iets breder (3,5 naar 3,8 m) en loopt door tot de dakvoet,
// 0,15 m voor de kroonlijst.
const erker = hull([...bandRing(1.6, 0.3, H.erker), ...bandRing(1.75, 0.55, H.erker + 0.25), ...bandRing(1.9, 0.55, H.eave)]);
const facades = FACES.flatMap(({ deg, portal }) => [portalRaw(portal), lowBand, midBand, erker].map((m) => place(m, { deg })));

// ---------- kop en tentdak ----------
// Kroonlijst (2,7 m) op een kraag van 45 graden, 0,4 m voor de gevel; op de diagonalen ligt de kop binnen het
// afgeschuinde hoekvlak van de schacht.
const cornice = hull([...octRing(S - 0.05, CH, H.corbel), ...octRing(HEAD.half, HEAD.chamfer, H.cornice), ...octRing(HEAD.half, HEAD.chamfer, H.eave)]);
// Tentdak: achthoek op de dakvoet naar de top (52 graden per meter langs de assen, zoals het AHN).
const roof = hull([...octRing(HEAD.half, HEAD.chamfer, H.eave - 0.05), [0, 0, H.apex]]);

// ---------- nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const cuts = FACES.flatMap(({ deg, portal }) => [
  // Deur (1,6 × 2,6 m) en het verdiepte paneel erboven (2,2 m breed, 3,4 tot 6,0 m).
  place(niche(S + portal, 1.6, BASE, 2.6, 0.4), { deg }),
  place(niche(S + portal, 2.2, 3.4, 6.0, 0.2), { deg }),
]);

const tower = union([shaft, plinth, ...buttresses, ...facades, cornice, roof])
  .subtract(union(cuts))
  .trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-etten-leur-oude-watertoren",
  base: BASE,
  // Eén node: de export vult elke node apart op; een losse kop of erker zou een voet tot de grondplaat krijgen.
  nodes: [["building:schacht-lisenen-erkers-kop-en-tentdak", tower]],
  catalog: {
    name: "Oude watertoren Etten-Leur",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Vlak maaiveld rond de voet (AHN 6,46 tot 6,62 op 7,5 m), naast de portalen tussen de steunberen.
    groundSamplePoints: [[7.5, 0], [0, 7.5], [-7.5, 0], [0, -7.5]],
    // Ellipsoïdisch: NAP +6,56 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0777100000151802"],
    description:
      "Oorsprong op het hart van de vierkante BAG-contour op maaiveld (NAP +6,56 m), +X naar de oostgevel (RD-richting 12,4 graden). Vierkante, afgesnoten betonnen schacht van 10,6 m met een plint, vier steunberen op de hoeken en vier portalen met schuine wangen tot 6,6 m; per gevel een lisene die op 21 m breder wordt en op 34,3 m uitkraagt tot een erker tot de dakvoet; achthoekige kroonlijst van 11,4 m van 43 tot 45,7 m; koperen tentdak tot 48,68 m. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      built: 1924,
      architect: "H. Sangster",
      style: "expressionisme (register)",
      publishedHeightM: 48.7,
      reservoirsM3: [300, 400],
      registerWaterLevelsM: [28.5, 41.5],
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 55.25,
      geoidNlgeo2018M: GEOID_N,
      shaftAcrossFacesM: 2 * S,
      shaftChamferM: CH,
      headAcrossFacesM: 2 * HEAD.half,
      headChamferM: HEAD.chamfer,
      corniceM: [H.cornice, H.eave],
      erkerM: [H.erker, H.eave],
      roofSlopePerM: +((H.apex - H.eave) / HEAD.half).toFixed(3),
      modelTopM: H.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Oude_watertoren_(Etten-Leur)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/516667",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Etten-Leur_-_20388943_-_RCE.jpg (schacht, lisenen, erkers en kroonlijst, verhoudingen)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_-_Etten-Leur_-_20340467_-_RCE.jpg (gevel met portaal, lisene en erker, verticaal gecorrigeerd)",
      "https://commons.wikimedia.org/wiki/File:Voet_van_de_watertoren_met_ingangspartij_-_Etten-Leur_-_20340470_-_RCE.jpg (portaal, plint, steunbeer)",
      "https://commons.wikimedia.org/wiki/File:Voet_van_de_watertoren_met_ingangspartij_-_Etten-Leur_-_20340471_-_RCE.jpg (twee portalen, afgeschuinde hoek)",
      "https://commons.wikimedia.org/wiki/File:Bovenste_gedeelte_met_koperen_tentdak_-_Etten-Leur_-_20340468_-_RCE.jpg (erkers, kroonlijst, tentdak)",
      "PDOK BAG-pand 0777100000151802, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "NLGEO2018-geoïdehoogte op de oorsprong (44,08 m) voor groundHeight",
    ],
  },
});

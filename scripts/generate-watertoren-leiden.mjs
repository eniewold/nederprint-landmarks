// Watertoren van de Leidsche Duinwater Maatschappij aan de Hoge Rijndijk
// (156A) in Leiden, bij de Wilhelminabrug over het Rijn-Schiekanaal: 1908,
// ontwerp W.C. van Manen, rijksmonument 515106, 29,5 m hoog met een reservoir
// van 1200 m³, buiten gebruik sinds 1993 en nu een woning. Volgens het
// register een vroeg voorbeeld van een toren met een zichtbaar skelet van
// gewapend beton, in een overgangsstijl. Een twaalfzijdige schacht met
// betonnen hoekpilasters en bakstenen vlakken: een begane grond met oculi en
// de deur (de pilasters zijn daar breder en eindigen op 6 m in een schuine
// kop), een middenstuk met één hoog venster per vlak, een band op 13 m en
// daarboven een stuk met een oculus per vlak, waar de pilasters als gebogen
// consoles uitbuigen naar de ringbalk onder het bredere twaalfzijdige
// reservoir. Het reservoir heeft per vlak twee smalle hoge vensters tussen
// doorlopende hoekpilasters, een borstwering met meanderband en een
// overstekende afdekking. Op het dak staat sinds de verbouwing (vergunning
// 2013) een twaalfzijdige glazen opbouw met een flauw piramidedak en een
// kapje in het midden, met een dakterras aan de west-noordwestkant.
//
// Oorsprong op het zwaartepunt van de BAG-contour (pand 0546100000042902,
// 214,5 m²: de twaalfhoek van ringbalk en afdekking, hoekpunten op 8,42 m)
// op maaiveld (AHN-DTM NAP +0,65 m; 3D BAG 0,48). De hoeken van de twaalfhoek
// (de pilasters) staan in de BAG-contour op 7,5 + 30k graden van RD-oost:
// lokale +X is de hoekpilaster aan de oostkant, de vlakken staan op 15 + 30k
// graden. Hoogtes uit het AHN-DSM 0,5 m en de 3D BAG (AHN5, 2023):
// afdekking NAP +29,6 tot +30,0 (28,9 tot 29,3 m), dakrand van de opbouw
// NAP +32,3, kap NAP +34,48 (33,83 m). Breedtes uit de BAG en de frontale
// telefoto "Leiden, Water Tower near Wilhelmina Bridge" (van over het kanaal,
// 55,5 px/m, geschaald op het vlak van het reservoir tussen twee pilasters):
// schacht 0,70 maal het reservoir, hoogtes van banden, consoles en vensters.
import { hull, ring3, circle, union, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [95275.87, 463349.4];
const ROT = 7.5; // hoeken van de twaalfhoek (pilasters) in graden linksom van RD-oost
const AXIS = [+Math.cos((ROT * Math.PI) / 180).toFixed(4), +Math.sin((ROT * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 0.65; // AHN-DTM in een ring van 10 tot 12 m (0,4 tot 1,2; west, de parkeerplaats, het hoogst)
const GEOID_N = 43.36; // NLGEO2018-geoïdehoogte op de oorsprong

const A = {
  shaft: 5.35, // apothema van de bakstenen vlakken van de schacht (hoeken op 5,54)
  pierOut: 5.9, // buitenkant van de schachtpilasters, gemeten op de hoek
  footOut: 6.2, // bredere pilastervoet op de begane grond
  ledge: 5.6, // banden op 6 en 13 m
  ring: 8.15, // ringbalk en afdekking (BAG: hoeken op 8,42)
  tank: 7.85, // bakstenen vlakken van het reservoir
  tankPier: 8.3, // reservoirpilasters, gemeten op de hoek
  parapet: 7.95, // borstwering met meanderband
  deck: 7.05, // binnenkant van de borstwering (dakterras)
  house: 6.3, // glazen wanden van de opbouw
  eave: 6.75, // dakrand van de opbouw
  capFoot: 1.35, // kapje in het midden
};
const H = {
  footTop: 5.7, // bredere pilastervoet tot hier, dan een kop van 45 graden
  ledge: 6.0, // band boven de begane grond
  band: 12.85, // band onder het consolestuk
  bandTop: 13.2,
  bracketTop: 18.7, // onderkant van de ringbalk
  ringTop: 19.5,
  tankFoot: 19.8, // schuine kraag van de ringbalk naar de reservoirvlakken
  parapetFoot: 26.9, // borstwering met meanderband
  capFoot: 28.5,
  cap: 29.3, // bovenkant afdekking (AHN NAP +29,6 tot +30,0; Wikipedia 29,5 m)
  deck: 28.55, // dakterras binnen de borstwering
  wallTop: 31.3, // bovenkant glazen wand van de opbouw
  eave: 31.6, // dakrand (AHN NAP +32,3)
  capFootZ: 32.95, // piramidedak tot het kapje (AHN NAP +33,6 op r 1,5)
  apex: 33.8, // kapje (AHN NAP +34,48)
};

const rad = (deg) => (deg * Math.PI) / 180;
// Regelmatige twaalfhoek met apothema a, hoeken op 30k graden en vlakken op 15 + 30k.
const dod = (a) => circle([0, 0], a / Math.cos(Math.PI / 12), 12, 0);
const CORNERS = Array.from({ length: 12 }, (_, k) => k * 30);
const FACES = Array.from({ length: 12 }, (_, k) => 15 + k * 30);
const DOOR_FACE = 255; // RD 262,5 graden: zuid, naar de Hoge Rijndijk
const ring = (a, z0, z1) => hull([...ring3(dod(a), z0), ...ring3(dod(a), z1)]);
// Rechthoek in het hoekstelsel (x radiaal langs de hoek, y tangentiaal) als hull-punten.
const slab = (x0, x1, w, z0, z1) => hull([[x0, -w / 2, z0], [x1, -w / 2, z0], [x0, w / 2, z0], [x1, w / 2, z0], [x0, -w / 2, z1], [x1, -w / 2, z1], [x0, w / 2, z1], [x1, w / 2, z1]]);

// ---------- schacht met banden ----------
const shaft = union([
  ring(A.shaft, BASE, H.bracketTop + 0.05),
  // Band boven de begane grond en onder het consolestuk: 0,25 m uit met een kraag van 45 graden.
  hull([...ring3(dod(A.shaft), H.ledge - 0.3), ...ring3(dod(A.ledge), H.ledge - 0.05), ...ring3(dod(A.ledge), H.ledge + 0.25)]),
  hull([...ring3(dod(A.shaft), H.band - 0.25), ...ring3(dod(A.ledge), H.band), ...ring3(dod(A.ledge), H.bandTop)]),
]);

// Schachtpilaster per hoek: 0,8 m breed tot 5,9 m uit het hart; op de begane grond 1,0 m breed tot 6,2 m
// met een kop van 45 graden; boven de band buigt hij als console uit naar de ringbalk (steilste stuk 45 graden).
const PIER_W = 0.8, BRACKET_W = 0.9;
const CONSOLE = [[A.pierOut, H.bandTop], [6.2, 15.5], [6.9, 17.0], [7.9, 18.2], [8.35, H.bracketTop + 0.05]];
const pier = union([
  slab(5.0, A.pierOut, PIER_W, BASE, H.bandTop),
  hull([[5.0, -0.5, BASE], [A.footOut, -0.5, BASE], [5.0, 0.5, BASE], [A.footOut, 0.5, BASE],
    [5.0, -0.5, H.footTop], [A.footOut, -0.5, H.footTop], [5.0, 0.5, H.footTop], [A.footOut, 0.5, H.footTop],
    [5.0, -PIER_W / 2, H.footTop + 0.3], [A.pierOut, -PIER_W / 2, H.footTop + 0.3], [5.0, PIER_W / 2, H.footTop + 0.3], [A.pierOut, PIER_W / 2, H.footTop + 0.3]]),
  ...CONSOLE.slice(1).map(([r1, z1], i) => {
    const [r0, z0] = CONSOLE[i];
    return hull([r0, r1].flatMap((r, j) => [[5.0, -BRACKET_W / 2, j ? z1 : z0], [r, -BRACKET_W / 2, j ? z1 : z0], [5.0, BRACKET_W / 2, j ? z1 : z0], [r, BRACKET_W / 2, j ? z1 : z0]]));
  }),
  slab(5.0, A.pierOut, PIER_W, H.bandTop - 0.05, H.bandTop + 0.4),
]);
const piers = CORNERS.map((d) => place(pier, { deg: d }));

// ---------- ringbalk, reservoir, borstwering en afdekking ----------
const tank = union([
  ring(A.ring, H.bracketTop, H.ringTop),
  hull([...ring3(dod(A.ring), H.ringTop - 0.05), ...ring3(dod(A.tank), H.tankFoot)]),
  ring(A.tank, H.tankFoot - 0.05, H.parapetFoot + 0.05),
  // Borstwering 0,1 m uit met een kraag van 45 graden, afdekking 0,2 m uit met een kraag van 45 graden.
  hull([...ring3(dod(A.tank), H.parapetFoot - 0.1), ...ring3(dod(A.parapet), H.parapetFoot), ...ring3(dod(A.parapet), H.capFoot + 0.05)]),
  hull([...ring3(dod(A.parapet), H.capFoot), ...ring3(dod(A.ring), H.capFoot + 0.2), ...ring3(dod(A.ring), H.cap)]),
]);
// Reservoirpilasters: 0,7 m breed tot 8,3 m uit het hart, van de ringbalk tot de afdekking.
const tankPiers = CORNERS.map((d) => place(slab(7.6, A.tankPier, 0.7, H.ringTop - 0.1, H.cap), { deg: d }));
// Dakterras binnen de borstwering.
const deckCut = ring(A.deck, H.deck, H.cap + 1);

// ---------- glazen opbouw met piramidedak, kapje en dakterras ----------
const house = union([
  ring(A.house, H.deck - 0.1, H.wallTop + 0.05),
  ring(A.eave, H.wallTop, H.eave),
  hull([...ring3(dod(A.eave), H.eave - 0.05), ...ring3(dod(A.capFoot), H.capFootZ)]),
  hull([...ring3(dod(A.capFoot), H.capFootZ - 0.05), ...ring3(dod(1.2), 33.4), ...ring3(dod(0.7), 33.7), [0, 0, H.apex]]),
]);
// Dakterras aan de west-noordwestkant (luchtfoto: midden op RD 152 graden, 4,4 m breed, vanaf 2,6 m uit het hart).
const TERRACE_RD = 152;
const terrace = place(box(2.6, -2.2, H.deck, 9, 2.2, H.apex + 1), { deg: TERRACE_RD - ROT });

// ---------- vensters, oculi en deur als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f, midden op y = c.
const niche = (f, w, z0, z1, depth = 0.3, c = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = c - w / 2, y1 = c + w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
// Oculus: achthoek met straal r in het vlak, naar binnen 0,45 m omhoog verschoven (plafond 56 graden).
const oculus = (f, r, zc, depth = 0.3) => {
  const ring8 = (x, dz) => circle([0, 0], r, 8, Math.PI / 8).map(([y, z]) => [x, y, zc + z + dz]);
  return hull([...ring8(f + 1.0, -1.5), ...ring8(f, 0), ...ring8(f - depth, 1.5 * depth)]);
};
const cutsPerFace = (face) => [
  // Begane grond: oculus (deur zie onder), middenstuk: één hoog venster, consolestuk: oculus.
  ...(face === DOOR_FACE ? [] : [oculus(A.shaft, 0.5, 4.9)]),
  niche(A.shaft, 0.7, 6.6, 12.3),
  oculus(A.shaft, 0.6, 16.4),
  // Reservoir: twee smalle hoge vensters.
  niche(A.tank, 0.6, 22.2, 26.4, 0.3, -0.8),
  niche(A.tank, 0.6, 22.2, 26.4, 0.3, 0.8),
];
// Deur met een spitse top (50 graden): 1,4 m breed tot 3,0 m, daarboven een oculus.
const door = hull([[0, 0], [0.7, 0], [0.7, 2.4], [0, 3.2], [-0.7, 2.4], [-0.7, 0]].flatMap(([y, z]) => [[A.shaft - 0.4, y, z === 0 ? BASE + 0.3 : z], [A.shaft + 1, y, z === 0 ? BASE + 0.3 : z]]));
const doorOculus = oculus(A.shaft, 0.5, 4.6);
const cuts = [
  ...FACES.flatMap((d) => cutsPerFace(d).map((n) => place(n, { deg: d }))),
  place(door, { deg: DOOR_FACE }),
  place(doorOculus, { deg: DOOR_FACE }),
];

const tower = union([shaft, ...piers, tank, ...tankPiers]).subtract(union([deckCut, ...cuts]));
const top = house.subtract(terrace);
const all = union([tower, top]);

await writeLandmark({
  slug: "watertoren-leiden",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-consoles-reservoir-en-opbouw", all]],
  catalog: {
    name: "Watertoren Leiden",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, 7.5], [0, -7.5]],
    // Ellipsoïdisch: NAP +0,65 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0546100000042902"],
    description:
      "Oorsprong op het zwaartepunt van de BAG-contour op maaiveld (NAP +0,65 m), +X langs de oostelijke hoekpilaster (7,5 graden linksom van RD-oost). Twaalfzijdige schacht van 10,7 m over de vlakken met twaalf betonnen hoekpilasters (op de begane grond breder, tot 6 m), banden op 6 en 13 m, daarboven gebogen consoles naar de ringbalk op 18,7 m onder het twaalfzijdige reservoir van 15,7 m over de vlakken met hoekpilasters, borstwering en afdekking tot 29,3 m; op het dak een glazen twaalfzijdige opbouw met piramidedak en kapje tot 33,8 m en een dakterras aan de west-noordwestkant. Oculi, hoge vensters, reservoirvensters en de deur (zuid) als nissen. Maten uit BAG, AHN, 3D BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 29.5,
      reservoirM3: 1200,
      built: 1908,
      architect: "W.C. van Manen",
      rijksmonument: 515106,
      ahnGroundNapM: GROUND_NAP,
      ahnParapetNapM: [29.6, 30.0],
      ahnEaveNapM: 32.3,
      ahnApexNapM: 34.48,
      geoidNlgeo2018M: GEOID_N,
      cornersDeg: ROT,
      shaftAcrossFlatsM: A.shaft * 2,
      shaftAcrossPiersM: A.pierOut * 2,
      tankAcrossFlatsM: A.tank * 2,
      ringAcrossCornersM: +((2 * A.ring) / Math.cos(Math.PI / 12)).toFixed(2),
      consolesM: [H.bandTop, H.bracketTop],
      parapetTopM: H.cap,
      rooftopEaveM: H.eave,
      modelTopM: H.apex,
      photoScalePxPerM: 55.5,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Leiden)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/515106 (W.C. van Manen, 1908, twaalfzijdig, betonskelet, 29,5 m, 1200 m³)",
      "https://commons.wikimedia.org/wiki/File:Leiden,_Water_Tower_near_Wilhelmina_Bridge.jpg (frontale telefoto, maten)",
      "https://commons.wikimedia.org/wiki/File:Watertoren-leiden.jpg, Leiden215.JPG, Watertoren_Leiden_2017_1.jpg, Watertoren_Leiden_2017_2.jpg, Water_tower_Leiden_(51283292069).jpg (zuidkant, deur, opbouw)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_van_de_Leidsche_Duinwater_Maatschappij_aan_de_Hoge_Rijndijk_te_Leiden,_Objectnr_PV_PV103953.jpg (ingang en voet rond 1908)",
      "PDOK BAG-pand 0546100000042902, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "3D BAG (LoD2.2, AHN5 2023) van pand 0546100000042902: maaiveld, borstwering en opbouw ter controle",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,36 m) voor groundHeight",
    ],
  },
});

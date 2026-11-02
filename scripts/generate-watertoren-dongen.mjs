// Watertoren van Dongen aan de Watertorenstraat, gebouwd in 1923 als eerste van
// dertien torens van H. Sangster (Hendrik Sangster) voor de N.V.
// Waterleidingmaatschappij Noord-West-Brabant; 44,76 m hoog met een reservoir
// van 500 m³, in gebruik tot 1974. Een achtkante bakstenen schacht met brede
// betonnen hoeklisenen die licht taps toeloopt, op 27 m een kraag met een
// louvreband waarboven het reservoirdeel iets breder doorgaat, een kroonlijst
// en een achtkant koperen dak: een steile onderste band met acht dakkapellen
// en een bolle kap met een lichtkap op de top. Sinds de verbouwing tot woning
// en kantoor (afgerond 2024) heeft de schacht vensterparen en hoge
// vensterkolommen om en om per vlak, en hangt om het reservoir een stalen
// omloop (ring van 17,8 m) op schoren. Die omloop zit niet in het model: hij
// hangt 1 tot 2,7 m vrij van de gevel en de export vulde hem op tot een
// mantel tot de onderplaat (volume +37 %), net als de zwevende hotelring van
// Sint Jacobiparochie die de gebruiker liet weghalen.
//
// Oorsprong op het zwaartepunt van de BAG-contour (pand 0766100000004972,
// 114,6 m², achtkant met lisenen) op maaiveld (AHN-DTM NAP +2,70 m). De hoeken
// van de achtkant (de lisenen) staan op 3 graden linksom van RD-oost: lokale +X
// is de lisene aan de oostkant, de vlakken staan op 22,5 + 45k graden.
// Hoogtes uit het AHN5-DSM 0,5 m (2024, na de verbouwing) en de 3D BAG:
// dakrand NAP +42,1 tot +42,7 (39,6 m), kap NAP +45,5 op r 4,5 en +47,06 op
// r 2, lichtkap tot NAP +48,56 (45,9 m), omloop NAP +34 tot +35,1. Breedtes
// uit de BAG-contour (vlakken op 5,80 m uit het hart, lisenen tot 6,57 m) en de
// frontale foto "Dongen Watertoren 2208" (2005, 31,7 px/m, geschaald op de
// breedte over de lisenen aan de voet): schacht 2,4 % taps tot 27,0 m,
// reservoirdeel 6,4 % breder dan de voet, kroonlijst 39,6 m, top van de kap
// 44,75 m.
import { hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [123512.42, 406371.52];
const ROT = 3; // hoeken van de achtkant (lisenen) in graden linksom van RD-oost
const AXIS = [+Math.cos((ROT * Math.PI) / 180).toFixed(4), +Math.sin((ROT * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 2.7; // AHN-DTM rond de voet (2,58 tot 2,82), 3D BAG 2,60
const GEOID_N = 43.79; // NLGEO2018-geoïdehoogte op de oorsprong

const A = {
  foot: 5.8, // apothema van de muurvlakken aan de voet (BAG)
  shaftTop: 5.66, // 2,4 % taps tot de kraag (foto)
  tank: 6.17, // reservoirdeel (foto: 436 tegen 410 px over de lisenen)
  cornice: 6.4,
  eave: 6.3, // voet van het dak op de kroonlijst
};
const TAPER = A.shaftTop / A.foot;
const WIDEN = A.tank / A.foot;
const H = {
  shaftTop: 27.0, // onderkant van de kraag onder de louvreband
  bandFoot: 27.7, // muurvlakken 0,51 m uit onder 36 graden
  pierTop: 29.6, // de lisenen knikken uit tot hier
  louvreFoot: 28.2,
  louvreTop: 28.8,
  corniceFoot: 39.3,
  cornice: 39.6,
  eave: 39.85,
  band: 42.7, // bovenkant van de steile onderste dakband (AHN NAP +45,4)
  apex: 44.75, // top van de kap (foto; Wikipedia 44,76 m)
  lanternFoot: 44.3,
  lanternTop: 45.9, // lichtkap (AHN NAP +48,56)
};

const rad = (deg) => (deg * Math.PI) / 180;
// Regelmatige achthoek met apothema a, de vlakken op 22,5 + 45k graden en de hoeken op 45k.
const oct = (a) => circle([0, 0], a / Math.cos(Math.PI / 8), 8, 0);
const CORNERS = Array.from({ length: 8 }, (_, k) => k * 45);
const FACES = Array.from({ length: 8 }, (_, k) => 22.5 + k * 45);

// ---------- schacht, kraag, reservoirdeel en kroonlijst ----------
const walls = union([
  hull([...ring3(oct(A.foot), BASE), ...ring3(oct(A.shaftTop), H.shaftTop + 0.05)]),
  hull([...ring3(oct(A.shaftTop), H.shaftTop), ...ring3(oct(A.tank), H.bandFoot), ...ring3(oct(A.tank), H.corniceFoot + 0.05)]),
  // Kroonlijst: 0,23 m uit onder 37 graden, dan recht tot de dakvoet.
  hull([...ring3(oct(A.tank), H.corniceFoot), ...ring3(oct(A.cornice), H.cornice), ...ring3(oct(A.cornice), H.eave + 0.05)]),
]);

// Hoeklisenen (BAG-contour): voorvlak 0,76 m breed op 6,55 m uit het hart, schuine wangen naar de muurvlakken.
const PIER = [[5.5, -0.62], [6.06, -0.62], [6.55, -0.38], [6.55, 0.38], [6.06, 0.62], [5.5, 0.62]];
const pierRing = (s, z) => PIER.map(([x, y]) => [x * s, y * s, z]);
const pier = union([
  hull([...pierRing(1, BASE), ...pierRing(TAPER, H.shaftTop + 0.05)]),
  // Knik naar buiten onder 13 graden, dan recht tot de kroonlijst.
  hull([...pierRing(TAPER, H.shaftTop), ...pierRing(WIDEN, H.pierTop), ...pierRing(WIDEN, H.cornice)]),
]);
const piers = CORNERS.map((d) => place(pier, { deg: d }));

// ---------- dak: steile onderste band, bolle kap, dakkapellen en lichtkap ----------
// Eén convex omhulsel van achthoeken: band 57 graden, kap 43, 30 en 16 graden naar de top.
const CAP = [[A.eave, H.eave - 0.05], [4.45, H.band], [3.5, 43.6], [2.4, 44.25], [1.2, 44.6], [0.3, H.apex]];
const roof = hull(CAP.flatMap(([a, z]) => ring3(oct(a), z)));
// Dakkapel per vlak: 1,3 m breed, voorvlak op 5,15 m uit het hart (dak daar op 41,6), plat dak op 42,9.
const dormer = hull([[3.9, -0.65, 41.0], [5.15, -0.65, 41.0], [3.9, 0.65, 41.0], [5.15, 0.65, 41.0], [3.9, -0.65, 42.9], [5.15, -0.65, 42.9], [3.9, 0.65, 42.9], [5.15, 0.65, 42.9]]);
const dormers = FACES.map((d) => place(dormer, { deg: d }));
// Lichtkap: vierkant van 1,6 m, evenwijdig aan vier van de vlakken.
const lantern = place(hull([...ring3([[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]], H.lanternFoot), ...ring3([[-0.8, -0.8], [0.8, -0.8], [0.8, 0.8], [-0.8, 0.8]], H.lanternTop)]), { deg: 22.5 });

// ---------- vensters, louvreband en deur als nissen ----------
// Apothema van het muurvlak op hoogte z (de schacht loopt taps toe).
const wallAt = (z) => (z < H.shaftTop ? A.foot + ((A.shaftTop - A.foot) * (z - BASE)) / (H.shaftTop - BASE) : A.tank);
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f, midden op y = c.
const niche = (f, w, z0, z1, depth = 0.3, c = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = c - w / 2, y1 = c + w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
const win = (w, z0, z1, c = 0, depth = 0.3) => niche(wallAt((z0 + z1) / 2), w, z0, z1, depth, c);
// Vlakken met vensterparen (zeven verdiepingen van 3,4 m) en vlakken met hoge vensterkolommen, om en om.
const PAIR_FACES = [22.5, 112.5, 202.5, 292.5];
const TALL_FACES = [67.5, 157.5, 247.5, 337.5];
const DOOR_FACE = 157.5; // west-noordwest (RD 160,5 graden), naar de oprit
const ROWS = Array.from({ length: 7 }, (_, k) => 3.6 + 3.4 * k);
const pairs = ROWS.flatMap((z) => [-0.85, 0.85].map((c) => win(0.85, z, z + 1.7, c)));
const tall = (face) => [win(1.6, 17.0, 26.0), ...(face === DOOR_FACE ? [win(1.6, 4.0, 8.4)] : [win(1.6, 2.4, 8.4)])];
// Deur met een spitse rollaag: 1,8 m breed, top op 3,7 m (50 graden).
const door = hull(
  [[0, 0], [0.9, 0], [0.9, 2.6], [0, 3.7], [-0.9, 2.6], [-0.9, 0]].flatMap(([y, z]) => [[A.foot - 0.4, y, z === 0 ? BASE + 0.3 : z], [A.foot + 1, y, z === 0 ? BASE + 0.3 : z]]),
);
// Louvreband tussen de lisenen en een venster per vlak in het reservoirdeel (op de hoogte van de omloop).
const louvre = niche(A.tank, 2.6, H.louvreFoot, H.louvreTop, 0.25);
const tankWin = niche(A.tank, 0.9, 32.6, 33.8);
const cuts = [
  ...PAIR_FACES.flatMap((d) => pairs.map((n) => place(n, { deg: d }))),
  ...TALL_FACES.flatMap((d) => tall(d).map((n) => place(n, { deg: d }))),
  place(door, { deg: DOOR_FACE }),
  ...FACES.flatMap((d) => [place(louvre, { deg: d }), place(tankWin, { deg: d })]),
];

const tower = union([walls, ...piers, roof, ...dormers, lantern]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-dongen",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-reservoir-en-koperen-dak", tower]],
  catalog: {
    name: "Watertoren Dongen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, 7.5], [0, -7.5]],
    // Ellipsoïdisch: NAP +2,70 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0766100000004972"],
    description:
      "Oorsprong op het zwaartepunt van de BAG-contour op maaiveld (NAP +2,70 m), +X langs de oostelijke hoeklisene (3 graden linksom van RD-oost). Achtkante bakstenen schacht van 11,6 m over de vlakken met acht hoeklisenen, 2,4 % taps tot een kraag met louvreband op 27-29,6 m, reservoirdeel van 12,3 m tot de kroonlijst op 39,6 m, achtkant koperen dak met een steile band en acht dakkapellen, bolle kap tot 44,75 m en lichtkap tot 45,9 m; vensterparen en hoge vensterkolommen om en om, deur aan de west-noordwestkant. De vrij hangende stalen omloop om het reservoir is weggelaten. Maten uit AHN5, BAG, 3D BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 44.76,
      reservoirM3: 500,
      built: 1923,
      architect: "H. Sangster",
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 42.4,
      ahnLanternNapM: 48.56,
      ahnDeckNapM: [34, 35.1],
      geoidNlgeo2018M: GEOID_N,
      cornersDeg: ROT,
      footAcrossFlatsM: A.foot * 2,
      footAcrossPiersM: 13.1,
      tankAcrossFlatsM: A.tank * 2,
      collarM: [H.shaftTop, H.pierTop],
      corniceM: H.cornice,
      roofBandTopM: H.band,
      apexM: H.apex,
      modelTopM: H.lanternTop,
      omittedGalleryRing: { diameterM: 17.8, widthM: 1.0, deckAboveGroundM: [31.3, 32.4] },
      photoScalePxPerM: 31.7,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Dongen)",
      "https://commons.wikimedia.org/wiki/File:Dongen_Watertoren_2208.JPG (frontale foto 2005, maten)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Dongen_-_20335210_-_RCE.jpg (kraag, kroonlijst en dak)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Dongen_6_jpg.jpg, Watertoren_Dongen_8.jpg, Watertoren_Dongen_9.jpg (2024: vensters, omloop, dakkapellen, lichtkap)",
      "PDOK BAG-pand 0766100000004972, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "3D BAG (LoD2.2, AHN5 2024) van pand 0766100000004972: dakrand en kap ter controle",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,79 m) voor groundHeight",
    ],
  },
});

// Watertoren van de Zuidergasfabriek aan de Spaklerweg in Amsterdam (nu in het
// Bellevuepark/Bella Vistapark), gebouwd in 1910-1911; aannemer J.L. Seeuwen
// (of hij hem ook ontwierp, wordt betwijfeld). Rijksmonument 526948, 41,5 m
// volgens het register (45 m met de bliksemafleider volgens Wikipedia), oorspronkelijk
// 210 m³ in drie compartimenten. Eclectische neorenaissance in helderrode
// baksteen met natuursteen en gele siersteen: een natuurstenen plint, een ronde
// taps toelopende schacht met drie lagen vensters (rondboogvensters onderaan),
// een siertegelfries, een smalle band en een boogfries, daarboven een
// uitkragende tienzijdige reservoirbehuizing op een kraag met consoles en een
// blokkenkroonlijst, vier wijzerplaten in frontons boven de kroonlijst, een
// tienzijdige loodgedekte koepel met dakkapelletjes, een koepeltorentje op
// pilasters en een bol met een sierlijke kroon.
//
// Oorsprong op het hart van de toren: het midden van BAG-pand 0363100012189540
// (cirkel van 9,8 m) 0,1 m naar het westen en 0,3 m naar het zuiden geschoven
// naar het midden van de behuizing in het AHN-DSM, op maaiveld (AHN-DTM NAP
// +0,86 in een ring van 6 tot 12 m). De tienhoek staat met een vlak op noord en
// zuid (luchtfoto: de zuidrand van de kroonlijst ligt recht oost-west), dus met
// de hoeken op oost en west: xAxis [1, 0], lokale +X naar het oosten.
// Hoogtes boven maaiveld uit het AHN-DSM 0,5 m: buitenring van de kroonlijst
// 32,3 tot 33,1, koepel r 3 op 35,1 en r 2 op 36,3, torentje r 1 op 40,2, top
// van de bol 42,28 (NAP +43,14). De lagen van de schacht en de maten van
// behuizing, frontons en torentje uit foto's van Wikimedia Commons, geschaald op
// de BAG-diameter en de AHN-hoogtes.
import { hull, ring3, circle, union, place, prism, dome, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [122905.04, 483489.12];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 0.86; // AHN-DTM 0,76 tot 0,90 rond de voet (5e tot 95e percentiel)
const GEOID_N = 43.03; // NLGEO2018-geoïdehoogte op de oorsprong

const D2R = Math.PI / 180;
// Tienhoek met de hoeken op 0, 36, 72 ... graden (oost en west), vlakken op 18 + 36 k (noord en zuid).
const deca = (R) => circle([0, 0], R, 10, 0);
const FACES = Array.from({ length: 10 }, (_, k) => 18 + 36 * k);
const COS18 = Math.cos(18 * D2R);

// ---------- maten ----------
const R = {
  plinth: 4.95, // natuurstenen plint (BAG-cirkel 9,8 m)
  shaftFoot: 4.7, // schacht boven de plint
  shaftTop: 4.2, // schacht onder de kraag (foto's: 8,4 m)
  tank: 4.7, // hoekstraal van de tienzijdige behuizing (DSM 9,0 tot 9,5 m)
  cornice: 4.9, // kroonlijst
  lantern: 1.5, // koepeltorentje
};
const H = {
  plinth: 2.3,
  shaftFoot: 2.55,
  frieze1: [6.4, 7.6], // siertegelfries
  band2: [17.4, 17.8], // smalle band
  frieze3: [24.6, 25.4], // boogfries
  corbelFoot: 26.0,
  tankFoot: 27.3,
  corniceFoot: 32.0,
  corniceTop: 32.6, // DSM 32,3 tot 33,1
  lanternFoot: 36.45,
  lanternCornice: 38.8,
  lanternTop: 39.2,
  apex: 42.28, // top van de bol met kroon (AHN NAP +43,14)
};
const rs = (z) => R.shaftFoot - ((z - H.shaftFoot) * (R.shaftFoot - R.shaftTop)) / (H.corbelFoot - H.shaftFoot);

// ---------- plint en schacht als omwenteling ----------
// Banden steken 0,08 tot 0,12 m uit met een onderkant onder 45 graden.
const band = ([z0, z1], out) => [[rs(z0), z0], [rs(z0) + out, z0 + out], [rs(z1) + out, z1], [rs(z1), z1]];
const SHAFT = [
  [R.plinth, BASE],
  [R.plinth, H.plinth],
  [R.shaftFoot, H.shaftFoot],
  ...band(H.frieze1, 0.12),
  ...band(H.band2, 0.08),
  ...band(H.frieze3, 0.12),
  [R.shaftTop, H.corbelFoot],
  [R.shaftTop - 0.3, H.corbelFoot + 0.3],
];
const shaft = dome([0, 0], SHAFT, 96);

// ---------- kraag, behuizing en kroonlijst ----------
const corbel = hull([...ring3(circle([0, 0], R.shaftTop, 96), H.corbelFoot), ...ring3(deca(R.tank), H.tankFoot)]);
const housing = prism(deca(R.tank), H.tankFoot - 0.05, H.corniceFoot + 0.05);
const cornice = hull([...ring3(deca(R.tank), H.corniceFoot), ...ring3(deca(R.cornice), H.corniceFoot + 0.2), ...ring3(deca(R.cornice), H.corniceTop)]);

// ---------- koepel, dakkapellen en frontons met wijzerplaat ----------
// Tienzijdige koepel (hoekstralen; DSM r 3 op 35,1 en r 2 op 36,3).
const DOME = [[4.6, H.corniceTop - 0.05], [4.3, 33.5], [3.75, 34.4], [3.05, 35.2], [2.25, 35.95], [1.55, 36.45], [1.3, 36.55]];
const roof = hull(DOME.flatMap(([r, z]) => ring3(deca(r), z)));

// Fronton met wijzerplaat op vier vlakken (oost-noordoost, noord, west-zuidwest, zuid): 2,4 m breed,
// voorvlak 0,1 m voor de behuizing, tot 33,9 m met een spitse top tot 34,8 m.
const TANK_AP = R.tank * COS18;
const gable = hull(
  [[-1.2, 31.0], [1.2, 31.0], [1.2, 33.9], [0, 34.8], [-1.2, 33.9]].flatMap(([y, z]) => [[2.6, y, z], [TANK_AP + 0.1, y, z]]),
);
const CLOCKS = [18, 90, 198, 270];
// Dakkapelletje op de koepel: 1,0 m breed, voorvlak op r 3,95, puntdakje onder 50 graden.
const dormer = hull(
  [[-0.5, 34.0], [0.5, 34.0], [0.5, 35.2], [0, 35.8], [-0.5, 35.2]].flatMap(([y, z]) => [[2.6, y, z], [3.95, y, z]]),
);
const DORMERS = FACES.filter((d) => !CLOCKS.includes(d));

// ---------- koepeltorentje en bol ----------
const lantern = union([
  prism(deca(R.lantern), H.lanternFoot - 0.2, H.lanternCornice + 0.05),
  hull([...ring3(deca(R.lantern), H.lanternCornice), ...ring3(deca(R.lantern + 0.2), H.lanternCornice + 0.2), ...ring3(deca(R.lantern + 0.2), H.lanternTop)]),
  hull([[1.6, H.lanternTop - 0.05], [1.45, 39.6], [1.15, 40.0], [0.75, 40.35], [0.3, 40.55]].flatMap(([r, z]) => ring3(deca(r), z))),
]);
// Hals van 0,84 m (dun genoeg dragend deel), bol (onderkant onder 45 graden) en kroon tot de top.
const finial = dome([0, 0], [[0.42, 40.4], [0.42, 40.85], [0.55, 40.98], [0.55, 41.3], [0.25, 41.6], [0.25, 41.8], [0.04, H.apex]], 16);

// ---------- nissen ----------
// Nis in een wand met normaal +X op afstand f: de omtrek [y, z] staat in het wandvlak, schuift naar
// binnen over de diepte 1,5 keer de diepte omhoog en naar buiten (0,6 m) 0,9 m omlaag, niet onder
// de onderrand: plafond onder 56 graden, vlakke vensterbank.
const niche = (outline, f, depth = 0.3) => {
  const z0 = Math.min(...outline.map(([, z]) => z));
  return hull([
    ...outline.map(([y, z]) => [f, y, z]),
    ...outline.map(([y, z]) => [f + 0.6, y, Math.max(z0, z - 0.9)]),
    ...outline.map(([y, z]) => [f - depth, y, z + 1.5 * depth]),
  ]);
};
// Venster met een spitse top onder 50 graden (rondboog als spits, zie de printregels).
const arched = (w, z0, z1) => [[-w / 2, z0], [w / 2, z0], [w / 2, z1 - 0.6 * w], [0, z1], [-w / 2, z1 - 0.6 * w]];
const rectW = (w, z0, z1) => [[-w / 2, z0], [w / 2, z0], [w / 2, z1], [-w / 2, z1]];

const DOOR_DEG = 225; // hoofdingang naar het pad uit het zuidwesten (geschat)
const WIN_DEG = Array.from({ length: 8 }, (_, k) => DOOR_DEG + 45 * k);
const shaftWindows = [
  // Rondboogvensters onderaan (foto: 1,0 bij 2,6 m), niet boven de ingang.
  ...WIN_DEG.slice(1).map((d) => place(niche(arched(1.0, 3.0, 5.6), rs(4.3)), { deg: d })),
  // Middelste laag (11,6 tot 14,4) en bovenste laag (21,8 tot 24,0).
  ...WIN_DEG.map((d) => place(niche(arched(1.0, 11.6, 14.4), rs(13)), { deg: d })),
  ...WIN_DEG.map((d) => place(niche(arched(0.9, 21.8, 24.0), rs(22.9)), { deg: d })),
];
// Behuizing: een rechthoekig venster per vlak.
const housingWindows = FACES.map((d) => place(niche(rectW(1.3, 28.4, 30.6), TANK_AP), { deg: d }));
// Wijzerplaten: ronde nis (twaalfhoek) van 1,6 m in de frontons, 0,2 m diep.
const clockFace = niche(circle([0, 0], 0.8, 12, Math.PI / 12).map(([y, z]) => [y, z + 33.0]), TANK_AP + 0.1, 0.2);
// Torentje: tien open vakken tussen de pilasters als nis van 0,5 m breed.
const LANTERN_AP = R.lantern * COS18;
const lanternBays = FACES.map((d) => place(niche(arched(0.5, 36.9, 38.5), LANTERN_AP, 0.25), { deg: d }));

// Natuurstenen portaal van de hoofdingang: 3,0 m breed, 0,35 m voor de plint, tot 4,6 m met een
// spitse top tot 5,4 m; deur 1,8 m breed met een spitse top tot 3,8 m.
const portal = hull([[-1.5, BASE], [1.5, BASE], [1.5, 4.6], [0, 5.4], [-1.5, 4.6]].flatMap(([y, z]) => [[3.8, y, z], [R.plinth + 0.35, y, z]]));
const door = niche(arched(1.8, 0, 3.8), R.plinth + 0.35, 0.6);

const tower = union([
  shaft,
  corbel,
  housing,
  cornice,
  roof,
  ...CLOCKS.map((d) => place(gable, { deg: d })),
  ...DORMERS.map((d) => place(dormer, { deg: d })),
  lantern,
  finial,
  place(portal, { deg: DOOR_DEG }),
]).subtract(
  union([
    ...shaftWindows,
    ...housingWindows,
    ...CLOCKS.map((d) => place(clockFace, { deg: d })),
    ...lanternBays,
    place(door, { deg: DOOR_DEG }),
  ]),
);

await writeLandmark({
  slug: "watertoren-amsterdam-spaklerweg",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:ronde-schacht-tienzijdige-behuizing-en-koepel", tower]],
  catalog: {
    name: "Watertoren Spaklerweg",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    // Ellipsoïdisch: NAP +0,86 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0363100012189540"],
    description:
      "Oorsprong op het hart van de toren (BAG-cirkel, bijgesteld op het AHN-DSM) op maaiveld (NAP +0,86 m), +X naar het oosten, hoeken van de tienhoek op oost en west. Natuurstenen plint van 9,9 m tot 2,3 m, ronde schacht die van 9,4 naar 8,4 m versmalt met drie vensterlagen, siertegelfries, band en boogfries, kraag naar een tienzijdige behuizing van 9,4 m (hoeken) van 27,3 tot 32 m met kroonlijst tot 32,6 m, vier frontons met wijzerplaat, tienzijdige koepel met zes dakkapellen tot 36,5 m, koepeltorentje tot 40,6 m en bol met kroon tot 42,3 m. Maten uit AHN, BAG, luchtfoto, register en foto's.",
    realWorld: {
      publishedHeightM: 41.5,
      wikipediaHeightM: 45,
      reservoirM3: 210,
      built: "1910-1911",
      builder: "J.L. Seeuwen",
      monument: 526948,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 43.14,
      geoidNlgeo2018M: GEOID_N,
      plinthDiameterM: R.plinth * 2,
      shaftDiameterM: [R.shaftFoot * 2, R.shaftTop * 2],
      housingAcrossCornersM: R.tank * 2,
      plinthM: H.plinth,
      housingM: [H.tankFoot, H.corniceFoot],
      corniceTopM: H.corniceTop,
      lanternFootM: H.lanternFoot,
      apexM: H.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Amsterdam_Spaklerweg)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/526948 (ronde voet, taps, tienzijdige uitkragende behuizing, tienzijdige loden koepel, torentje op pilasters, bol met kroon, vier wijzerplaten)",
      "https://commons.wikimedia.org/wiki/File:BellavistaPark_-_Watertoren_Zuidergasfabriek.jpg (schacht frontaal: vensterlagen, friezen, kraag)",
      "https://commons.wikimedia.org/wiki/File:WATERTOREN_van_de_Zuidergasfabriek.jpg, File:Watertoren_van_de_Zuidergasfabriek.jpg, File:51_watertoren,_spaklerweg_-_WLM_2011_-_drobm.jpg en File:2021_Bella_Vistapark,_Asd-Watertoren.jpg (behuizing, frontons, dakkapellen, torentje, ingang)",
      "PDOK BAG-pand 0363100012189540, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-03",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,03 m) voor groundHeight",
    ],
  },
});

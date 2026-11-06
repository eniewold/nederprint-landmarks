// Watertoren van Vriezenveen aan de Bouwmeesterstraat, gebouwd in 1934 naar ontwerp van Hendrik Sangster (gemeentelijk
// monument; Wikipedia: 40,80 m hoog, reservoir 295 m³). Achtkante bakstenen schacht; op vier hoeken (oost, noord, west,
// zuid) een risaliet van 3,2 m breed met een plat front, met een kolom smalle staande vensters en bovenin twee venstertjes
// naast elkaar; in de westelijke risaliet (naar de straat) de deur. De risalieten staan op een voet tot 4,1 m, de vlakken
// op een plint tot 1,9 m. Bovenop de achtkant een witte ronde bovenbouw (het reservoir) met een band kleine vensters onder
// de rand; boven elke risaliet een beklede kop die tot de rand doorloopt. Daarop een vlak kegeldak van 32 vlakken
// (luchtfoto: 32 naden, de top in het midden).
//
// Oorsprong op het hart van BAG-pand 1700100000034518 (gemiddelde van de twintig hoekpunten, RD [239450.18, 492628.14])
// op maaiveld, AHN-DTM NAP +9,95 (ring van 7 tot 10 m: 9,8 tot 10,2). Lokale +X is de normaal van het front van de oostelijke
// risaliet (RD 3,8 graden, de risalietranden in de BAG); in dat stelsel is de plattegrond een regelmatige achthoek met de
// hoeken op 6,3 m (apothema 5,82), de risalieten op de hoeken 0, 90, 180 en 270 graden met het front op 6,15 m (BAG 6,03
// tot 6,23) en ±1,6 m breed.
// Maten: BAG (plattegrond), AHN-DSM 0,5 m (top NAP +50,89 = 40,94 m; het dak loopt van de rand met circa 35 graden naar de
// top: NAP +48,05 op 4 m, +49,50 op 2 m), luchtfoto 2 cm (bovenbouw 11,1 m breed, koppen 1,3 m breed tot 6,05 m uit het
// hart, 32 naden in het dak) en drie Commons-foto's; hoogtes van de gevel uit "Twenterand-Vriezenveen, de Watertoren
// GM1700-WN005 IMG 6782" (2025, vanuit het westen, met een camera op 94 m en 26 graden omhoog gefit op de rand op 37,3 m en
// de breedte van de risaliet: deur 2,0 m hoog, venstertjes 31,65 tot 32,85 m, vlakken tot 33,1 m, risaliet tot 34,9 m).
import { box, circle, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [239450.18, 492628.14];
const DEG = 3.8;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 9.95;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints op 8 m van het hart (oost 52,47, noord 52,52, west
// 52,98, zuid 52,85), gemeten 2026-11-06; het PDOK-pand begint op 52,37. Het terrein loopt naar het westen (de straatkant)
// circa 0,45 m op (AHN-DTM oost 9,8 tot 9,9, west 10,2 tot 10,4), daarom ligt de deur op een stoep van 0,5 m.
const GROUND_ELLIPSOID = 52.47;
const C22 = Math.cos(Math.PI / 8);

// Achthoek met hoeken op 0, 45, ... graden (de risalieten zitten op de hoeken 0, 90, 180, 270), apothema a.
const oct = (a, z) => Array.from({ length: 8 }, (_, k) => {
  const t = (Math.PI / 4) * k, r = a / C22;
  return [r * Math.cos(t), r * Math.sin(t), z];
});
const oct2 = (a) => oct(a, 0).map(([x, y]) => [x, y]);

// Plattegrond.
const A_PLINTH = 5.82; // apothema van de achthoek (BAG: hoeken op 6,3 m)
const A = 5.72; // de schacht boven de plint, 0,1 m terug
const F_FOOT = 6.15; // front van de risalietvoet (BAG 6,03 tot 6,23)
const W_FOOT = 1.6; // halve breedte van de risalietvoet (BAG ±1,6)
const F = 6.05; // front van de risaliet boven de voet
const W = 1.5;
const R_TOP = 5.6; // ronde bovenbouw (luchtfoto: 11,1 m breed; foto: iets smaller dan de achtkant)
const F_HEAD = 6.15; // beklede kop boven de risaliet (luchtfoto: tot circa 6,05 m)
const W_HEAD = 0.7; // halve breedte van de kop (luchtfoto 1,3 m, foto 1,4 m)

// Hoogtes boven maaiveld.
const H = {
  plinth: 1.9, // plint van de vlakken
  foot: 4.1, // voet van de risalieten (lijst op de foto)
  door: [0.5, 2.65], // deur in de westelijke risaliet, 1,6 m breed en 2,15 m hoog, boven de stoep (het maaiveld ligt daar 0,45 m hoger)
  slits: [5.0, 10.45, 15.9, 21.35, 26.8], // onderkant van de vijf staande vensters (foto: 5,0, 10,2, 16,5, 22,0, 26,7)
  slit: 3.5, // hoogte van een staand venster (foto 3,3 tot 3,8)
  pair: [31.65, 32.85], // twee venstertjes naast elkaar bovenin de risaliet
  sill: 33.1, // bovenkant van de achtkante vlakken (witte afdekking)
  wash: 33.45, // de afdekking loopt schuin op tot de ronde bovenbouw
  risalit: 34.9, // bovenkant van de risaliet
  headFoot: 33.95, // onderkant van de beklede kop
  band: [36.05, 36.7], // vensterband onder de rand
  rim: 37.3, // rand van de bovenbouw (AHN: dakrand circa NAP +47,2)
  apex: 40.94, // top van het kegeldak (AHN-DSM NAP +50,89)
};
const ROOF_SLOPE = 0.7; // AHN-DSM: 0,70 m per m van 1 tot 4 m uit het hart (35 graden)

// Nis in het vlak met normaal +X (vlak op afstand f), breedte wd rond y, plafond onder 56 graden naar binnen oplopend (als
// in generate-watertoren-daarle.mjs).
const niche = (f, wd, z0, z1, depth, y = 0) => {
  const y0 = y - wd / 2, y1 = y + wd / 2, za = z1 + 1.5 * depth, out = Math.min(1, (z1 - z0) / 1.5);
  return hull([
    [f - depth, y0, z0], [f + out, y0, z0], [f - depth, y1, z0], [f + out, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + out, y0, z1 - 1.5 * out], [f + out, y1, z1 - 1.5 * out],
  ]);
};

// ---------- schacht ----------
// Plint met een afgeschuinde bovenkant (0,1 m onder 45 graden), daarboven de schacht tot de afdekking.
// De hoeken van de achthoek onder de risalieten (6,3 m) zijn afgesneden op het front van de risaliet (BAG).
const plinth = hull([...oct(A_PLINTH, BASE), ...oct(A_PLINTH, H.plinth - 0.1), ...oct(A, H.plinth)])
  .intersect(box(-F_FOOT, -F_FOOT, BASE, F_FOOT, F_FOOT, H.plinth));
const shaft = prism(oct2(A), BASE, H.sill).intersect(box(-F, -F, BASE, F, F, H.sill));
// Witte afdekking: van de achtkant op 33,1 schuin op naar de ronde bovenbouw.
const wash = hull([...oct(A, H.sill), ...circle([0, 0], R_TOP, 64).map(([x, y]) => [x, y, H.wash])])
  .intersect(box(-F, -F, H.sill, F, F, H.wash));

// Risaliet op de hoek met normaal +X: voet tot 4,1 m (0,1 m breder, bovenkant onder 45 graden), daarboven tot 34,9 m.
const risalit = union([
  hull([
    [4.5, -W_FOOT, BASE], [F_FOOT, -W_FOOT, BASE], [4.5, W_FOOT, BASE], [F_FOOT, W_FOOT, BASE],
    [4.5, -W_FOOT, H.foot - 0.1], [F_FOOT, -W_FOOT, H.foot - 0.1], [4.5, W_FOOT, H.foot - 0.1], [F_FOOT, W_FOOT, H.foot - 0.1],
    [4.5, -W, H.foot], [F, -W, H.foot], [4.5, W, H.foot], [F, W, H.foot],
  ]),
  box(4.5, -W, BASE, F, W, H.risalit),
  // Beklede kop: van 33,95 m (0,1 m voor het front, onderkant onder 50 graden) tot de rand.
  hull([
    [4.8, -W_HEAD, H.headFoot], [F, -W_HEAD, H.headFoot], [4.8, W_HEAD, H.headFoot], [F, W_HEAD, H.headFoot],
    [F_HEAD, -W_HEAD, H.headFoot + 1.2 * (F_HEAD - F)], [F_HEAD, W_HEAD, H.headFoot + 1.2 * (F_HEAD - F)],
    [4.8, -W_HEAD, H.rim], [F_HEAD, -W_HEAD, H.rim], [4.8, W_HEAD, H.rim], [F_HEAD, W_HEAD, H.rim],
  ]),
]);
const risalits = union([0, 90, 180, 270].map((deg) => place(risalit, { deg })));

// ---------- ronde bovenbouw en dak ----------
const top = prism(circle([0, 0], R_TOP, 64), H.sill, H.rim);
// Kegeldak van 32 vlakken met de naden op de luchtfoto; de rand van de bovenbouw blijft als opstaande ring van circa 0,4 m
// rond de voet van het dak staan.
const R_ROOF = R_TOP - 0.02;
const roof = hull([
  ...circle([0, 0], R_ROOF, 32, Math.PI / 32).map(([x, y]) => [x, y, H.apex - ROOF_SLOPE * R_TOP]),
  [0, 0, H.apex],
]);

// ---------- openingen ----------
const openings = union([
  // In elke risaliet vijf staande vensters van 0,4 m breed en bovenin twee venstertjes naast elkaar.
  ...[0, 90, 180, 270].flatMap((deg) => [
    ...H.slits.map((z) => place(niche(F, 0.4, z, z + H.slit, 0.3), { deg })),
    place(niche(F, 0.4, H.pair[0], H.pair[1], 0.3, -0.4), { deg }),
    place(niche(F, 0.4, H.pair[0], H.pair[1], 0.3, 0.4), { deg }),
  ]),
  // Deur in de westelijke risaliet (naar de straat), 1,6 m breed.
  place(niche(F_FOOT, 1.6, H.door[0], H.door[1], 0.4), { deg: 180 }),
  // Vensterband onder de rand: acht vensters van 0,6 m per kwart tussen de koppen.
  ...[0, 90, 180, 270].flatMap((q) =>
    Array.from({ length: 8 }, (_, k) => place(niche(R_TOP, 0.6, H.band[0], H.band[1], 0.25), { deg: q + 12 + (66 / 7) * k }))),
]);

// Stoep voor de deur.
const step = box(-F_FOOT - 0.8, -1.2, BASE, -F_FOOT + 0.05, 1.2, H.door[0]);

const building = union([plinth, shaft, wash, risalits, top, roof, step]).subtract(openings);

await writeLandmark({
  slug: "watertoren-vriezenveen",
  base: BASE,
  nodes: [["building:achtkante-schacht-met-risalieten-ronde-bovenbouw-en-kegeldak", building]],
  catalog: {
    name: "Watertoren Vriezenveen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [0, 8], [-8, 0], [0, -8]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1700100000034518"],
    description:
      "Oorsprong op het hart van het BAG-pand op maaiveld (NAP +9,95 m), +X de normaal van de oostelijke risaliet (RD 3,8 graden). Achtkante bakstenen schacht met op vier hoeken een risaliet van 3,2 m met staande vensters (deur in het westen), een witte ronde bovenbouw met vensterband en beklede koppen tot 37,3 m, daarop een kegeldak van 32 vlakken tot 40,94 m. Maten uit BAG, AHN, luchtfoto en drie foto's.",
    realWorld: {
      wikipediaHeightM: 40.8,
      reservoirM3: 295,
      built: 1934,
      designer: "Hendrik Sangster",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 50.89,
      octagonCornerRadiusM: +(A_PLINTH / C22).toFixed(2),
      risalitAcrossM: F_FOOT * 2,
      risalitWidthM: W_FOOT * 2,
      upperDiameterM: R_TOP * 2,
      rimM: H.rim,
      apexM: H.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Vriezenveen) (1934, Hendrik Sangster, 40,80 m, 295 m³)",
      "https://commons.wikimedia.org/wiki/File:Twenterand-Vriezenveen,_de_Watertoren_GM1700-WN005_IMG_6782_2025-04-20_16.13.jpg (vanuit het westen, 2025: deur, staande vensters, bovenbouw, koppen)",
      "https://commons.wikimedia.org/wiki/File:Vriezenveen_Watertoren_8937.JPG (2006: vensterkolom in de risaliet)",
      "https://commons.wikimedia.org/wiki/File:Vriezenveen,_watertoren_foto9_2014-10-04_14.35.jpg (vanuit het zuiden, 2014: risalieten en koppen schuin)",
      "PDOK BAG-pand 1700100000034518, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

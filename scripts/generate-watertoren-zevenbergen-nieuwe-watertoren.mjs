// Nieuwe watertoren van Zevenbergen aan De Meeren / Galgenweg, gebouwd in 1947
// naar ontwerp van C.H. de Bever ter vervanging van de toren die het Duitse
// leger op 31 oktober 1944 opblies; volgens Wikipedia en het bestemmingsplan
// 39,6 m hoog met een reservoir van 600 m³. Een ronde bakstenen schacht zonder
// uitkraging, bovenin een ring van ronde lichtopeningen onder een licht
// uitkragende rand, daaronder een rij van acht hoge rondboogvensters en drie
// losse vensters boven elkaar op de vier hoofdassen; het dak is een vlakke
// koperen kegel met een kapje op de top (bestekstekening B-1 "bestaand" bij
// bestemmingsplan NL.IMRO.1709.WatertorenZvb-0401 en de foto van 2007). Rond
// 2013 tot 2020 is de toren met een nieuwe aanbouw tot een complex van vijf
// appartementen verbouwd: de aanbouw ligt in de BAG in hetzelfde pand
// (1709100000045336) en zit dus ook in dit model: twee lagen om de zuid- en
// westzijde, een derde laag naar de kruising met de Galgenweg, een lagere
// strook aan de oostkant en een glazen portaal voor de bestaande ingang.
//
// Oorsprong op het hart van de toren (cirkel door de BAG-contour, r 6,49 m;
// het AHN5-DSM-dak ligt er concentrisch op) op maaiveld NAP +1,3 (AHN5-DTM
// noord en west 1,3 tot 1,4). Lokale +X loopt langs de gevels van de aanbouw
// (22,64 graden linksom vanaf RD-oost, de lange zuidgevel en de BAG-zijden),
// xAxis [0,9230, 0,3849]. Alle hoogtes uit het AHN5-DSM 0,5 m (NAP min 1,3);
// ligging van de vensters uit de bestekstekening, geschaald op de dakrand.
import { hull, ring3, circle, union, prism, box, writeLandmark, Manifold } from "./efteling-kit.mjs";

const ORIGIN = [100340.65, 406641.07];
const DEG = 22.64;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(4), +Math.sin((DEG * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 1.3; // AHN5-DTM 1,3 tot 1,4 ten noorden en westen van de toren
const GEOID_N = 43.95; // NLGEO2018-geoïdehoogte, vlak door de watertorens van Etten-Leur, Stampersgat, Hooge Zwaluwe en Roosendaal

const R = 6.5; // schacht (BAG-cirkel 6,49 m)
const H = {
  corbel: 35.8, // rand kraagt onder 45 graden uit
  eave: 36.15,
  rim: 36.6, // dakrand NAP +37,9
  apex: 39.8, // kegeltop NAP +41,1 (DSM r 2 op 40,2, r 4 op 39,2, r 6 op 38,3)
  cap: 40.7, // kapje op de top, NAP +42,0
};
const EAVE_R = 6.85; // dakrand (DSM en luchtfoto 13,6 tot 13,8 m)
const SEG = 96;

// ---------- toren ----------
const shaft = prism(circle([0, 0], R, SEG), BASE, H.corbel + 0.05);
const rim = hull([...ring3(circle([0, 0], R, SEG), H.corbel), ...ring3(circle([0, 0], EAVE_R, SEG), H.eave), ...ring3(circle([0, 0], EAVE_R, SEG), H.rim)]);
// Vlakke koperen kegel (25 graden) met een kapje van 1 m breed.
const roof = hull([...ring3(circle([0, 0], EAVE_R, SEG), H.rim - 0.05), [0, 0, H.apex]]);
const cap = hull([...ring3(circle([0, 0], 0.5, 16), H.apex - 0.4), ...ring3(circle([0, 0], 0.5, 16), H.cap - 0.3), ...ring3(circle([0, 0], 0.2, 16), H.cap)]);

// Nis in het muurvlak met normaal +X op afstand f: breedte w, van z0 tot de schouder z1, met een spitse top onder 50 graden
// (de rondbogen en ronde lichtopeningen zijn kleiner dan 0,9 m en worden als spitse nis van 0,9 m gemaakt).
const TAN50 = Math.tan((50 * Math.PI) / 180);
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, top = z1 + (w / 2) * TAN50;
  return hull([a, b].flatMap((x) => [[x, -w / 2, z0], [x, w / 2, z0], [x, -w / 2, z1], [x, w / 2, z1], [x, 0, top]]));
};
const at = (m, deg) => m.rotate([0, 0, deg]);
// Ingang op de as van het glazen portaal (8 graden); de losse vensters staan op die as en de drie andere hoofdassen.
const DOOR = 8;
const openings = [
  // 16 ronde lichtopeningen onder de dakrand (midden op 34,5 m).
  ...Array.from({ length: 16 }, (_, k) => at(niche(R, 0.9, 34.05, 34.5), DOOR + 22.5 * k)),
  // 8 hoge rondboogvensters van 28,9 tot 32,6 m.
  ...Array.from({ length: 8 }, (_, k) => at(niche(R, 0.9, 28.9, 32.05), DOOR + 22.5 + 45 * k)),
  // Drie losse vensters boven elkaar op de vier hoofdassen.
  ...[0, 90, 180, 270].flatMap((d) => [[8.3, 10.25], [15.8, 17.75], [23.0, 24.95]].map(([z0, z1]) => at(niche(R, 0.9, z0, z1), DOOR + d))),
];
const tower = union([shaft, rim, roof, cap]).subtract(union(openings));

// ---------- aanbouw (2 lagen, 3 lagen naar de Galgenweg) ----------
// BAG-contour van pand 1709100000045336 in het lokale stelsel, zonder de boog langs de toren (die zit in de schacht).
const BAG = [[-4.55, 4.64], [-8.38, 5.93], [-14.61, -12.45], [-6.04, -15.24], [-4.02, -9.0], [14.19, -9.0], [14.25, -11.73], [23.23, -11.66], [23.21, -8.62], [26.19, -8.61], [26.05, 0.35], [6.49, 0.25], [0, 0]];
const footprint = prism(BAG, BASE, 20);
const clip = (x0, y0, x1, y1, z1) => footprint.intersect(box(x0, y0, BASE, x1, y1, z1));
const Z = {
  low: 7.35, // twee lagen, NAP +8,65
  west: 4.05, // lage strook zuidwest, NAP +5,35
  east: 4.2, // lage strook oost, NAP +5,5
  third: 10.4, // derde laag tegen de toren, NAP +11,7
  top: 10.75, // derde laag naar de Galgenweg, NAP +12,05
  porch: 5.7, // glazen portaal, NAP +7,0
};
const wingLow = union([
  clip(-20, -9.2, 23.2, 10, Z.low),
  clip(-4.02, -20, 23.2, 10, Z.low),
]);
const wingWest = clip(-20, -20, -4.02, -9.2, Z.west);
const wingEast = clip(23.2, -20, 30, 10, Z.east);
const third = union([box(5.0, -5.6, BASE, 12.5, -1.6, Z.third), box(12.5, -9.0, BASE, 23.2, -2.3, Z.top), box(14.22, -11.7, BASE, 23.2, -9.0, Z.top)]);
const porch = box(5.8, 0.2, BASE, 9.0, 2.3, Z.porch);

// Vensters in de aanbouw als nissen van 0,3 m (raster geschat naar de gevel "Zuidgevel nieuw"): 1,6 m breed, per laag
// van 0,6 tot 2,4 m boven de vloer, plafond schuin naar binnen; normaal -Y (zuid) of +Y (noord).
const winY = (x, y, z0, side) => {
  const d = 0.3, z1 = z0 + 1.8, inner = y - side * d, outer = y + side * 1.0;
  return hull([x - 0.8, x + 0.8].flatMap((xx) => [[xx, inner, z0], [xx, outer, z0], [xx, inner, z1 + 1.5 * d], [xx, y, z1], [xx, outer, z1 - 1.5]]));
};
const floors2 = [0.6, 3.9];
const winCuts = [
  // Zuidgevel van de tweelaagse vleugel (y -9,0) tussen x -3 en 12.
  ...[-2.2, 1.0, 4.2, 7.4, 10.6].flatMap((x) => floors2.map((z) => winY(x, -9.0, z, -1))),
  // Zuidgevel van de drielaagse kop (y -11,7).
  ...[15.8, 18.7, 21.6].flatMap((x) => [...floors2, 7.2].map((z) => winY(x, -11.7, z, -1))),
  // Noordgevel van de oostvleugel (y 0,25-0,35) en de derde laag erboven (y -2,3).
  ...[11.0, 14.0, 17.0, 20.0].flatMap((x) => floors2.map((z) => winY(x, 0.3, z, 1))),
  ...[14.5, 17.5, 20.5].map((x) => winY(x, -2.3, 7.2, 1)),
];

const building = union([tower, wingLow, wingWest, wingEast, third, porch]).subtract(union(winCuts));

await writeLandmark({
  slug: "watertoren-zevenbergen-nieuwe-watertoren",
  base: BASE,
  // Eén node: toren en aanbouw zijn één BAG-pand en één gesloten volume.
  nodes: [["building:ronde-toren-kegeldak-en-aanbouw", building]],
  catalog: {
    name: "Nieuwe watertoren (Zevenbergen)",
    origin: ORIGIN,
    xAxis: AXIS,
    // Alleen noord en west van de toren (NAP +1,3 tot +1,4); ten oosten zakt het maaiveld naar NAP +0,8 en de
    // onderkant moet daar nog net in het terrein steken, vandaar -0,2.
    groundOffsetMetres: -0.2,
    groundSamplePoints: [[0, 9], [-9, 8], [10, 4]],
    // Ellipsoïdisch: NAP +1,3 plus de NLGEO2018-geoïdehoogte.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.1709100000045336"],
    description:
      "Oorsprong op het hart van de toren (BAG-cirkel) op maaiveld (NAP +1,3 m), +X langs de gevels van de aanbouw (22,64 graden linksom vanaf RD-oost). Ronde bakstenen schacht van 13 m doorsnede tot 35,8 m, rand onder 45 graden uit tot 13,7 m en 36,6 m, vlak kegeldak van 25 graden tot 39,8 m met een kapje tot 40,7 m; zestien ronde lichtopeningen, acht hoge vensters en drie losse vensters op vier assen als nissen. Aanbouw uit de verbouwing tot appartementen: twee lagen (7,35 m) om de zuid- en westzijde, een derde laag (10,4 en 10,75 m) naar de Galgenweg, lagere stroken in het zuidwesten en oosten en een glazen portaal voor de ingang. Maten uit AHN5, BAG, bestemmingsplan en foto.",
    realWorld: {
      publishedHeightM: 39.6,
      reservoirM3: 600,
      built: 1947,
      architect: "C.H. de Bever",
      ahnGroundNapM: GROUND_NAP,
      ahnRimNapM: 37.9,
      ahnTopNapM: 42.0,
      geoidNlgeo2018M: GEOID_N,
      shaftDiameterM: R * 2,
      eaveDiameterM: EAVE_R * 2,
      rimM: H.rim,
      roofApexM: H.apex,
      capM: H.cap,
      annexM: { twoStoreys: Z.low, threeStoreys: [Z.third, Z.top], lowWest: Z.west, lowEast: Z.east, porch: Z.porch },
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Zevenbergen)",
      "Bestemmingsplan Watertoren Zevenbergen (NL.IMRO.1709.WatertorenZvb-0401, ruimtelijkeplannen.nl): bestekstekening B-1 bestaand (gevels, doorsnede, dak), situatie en de aanbouw (twee naar drie lagen, 8 en 11,5 m)",
      "https://commons.wikimedia.org/wiki/File:Zevenbergen_Watertoren_5958.JPG (2007, oostzijde: schacht, vensters, lichtopeningen, dakrand)",
      "PDOK BAG-pand 1709100000045336, AHN5 DSM/DTM 0,5 m en luchtfoto, 2026-11-03",
      "NLGEO2018-geoïdehoogte geïnterpoleerd uit de watertorens van Etten-Leur, Stampersgat, Hooge Zwaluwe en Roosendaal voor groundHeight",
    ],
  },
});

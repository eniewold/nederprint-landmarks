// Watertoren van de S.T.A.R. (Stichting Stadskanaal Rail) op het emplacement
// van het museumstation Stadskanaal, gebouwd in 2008 om de stoomlocomotieven
// van water te voorzien: een houten toren van 10 m met een reservoir van
// 50 m³. Een vierkante schacht (onder liggende, boven staande delen) met
// schoren op de hoeken draagt een overstekend houten tankhuis met een
// pannendak: schilden onderaan en een zadeldakje met twee puntgeveltjes in de
// nok.
// Geen BAG-pand: de toren staat niet in de BAG en dus ook niet in de PDOK-
// gebouwtegels; het enige pand in de buurt is de werkplaats (0037100000019517)
// op bijna 40 m.
// Plek: de Commons-foto van de lijst van watertorens in Groningen
// (Estaciones y Trenes Europa 2017, categorie Station Stadskanaal) toont de
// toren naast de werkplaats van de STAR; op de luchtfoto staat hij aan het
// zuidoosteinde van die werkplaats tussen de sporen, naast de kolenwagen, en in
// het AHN als een blok van 9,9 m.
// Oorsprong op het hart van het dak in het AHN (nok en dakranden) op maaiveld
// (NAP +6,35 m). De x-as loopt langs de sporen naar het zuidoosten (-45,5 graden
// in RD, de richting van de sporen in OSM en van de kleinste omhullende in het
// AHN), de y-as naar het noordoosten. De nok loopt langs y; het frontale vlak
// van de foto "Stoom 2016 Stadskanaal 05" is het zuidoostvlak (+x).
// Dakhoogtes en hellingen uit het AHN (nok 9,9 m, lange vlakken 48 graden,
// schilden 47 graden, goot rond 7,3 m). De foto is met een tele genomen (circa
// 40 m afstand): met de ooghoogte op 1,6 m en de nok op 9,9 m geeft hij
// 58,6 px/m in het voorvlak van het tankhuis (breedte 4,86 m tussen de
// gevels, zoals het AHN met de overstek) en 57,7 px/m in het voorvlak van de
// schacht; daaruit de goot (7,36), de voet van de puntgeveltjes (8,7), de
// onderkant van het tankhuis, de vensters en de schoren.
import { hull, ring3, rect, box, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [258869.64, 557767.08];
const AXIS = [0.7009, -0.7133];
const BASE = -0.3;
const GROUND_NAP = 6.35;
const H = {
  strutTop: 2.02, // bovenkant van de schoren tegen de schacht
  shaftWindow: [2.58, 3.46], // venster in de schacht (zuidoost)
  houseBottom: 4.63, // onderkant van het tankhuis (zonder de getande rand)
  houseWindowA: [6.45, 7.05], // venster in het tankhuis vlak onder de goot (zuidoost)
  houseWindowB: [6.45, 7.05], // venster in het tankhuis (noordoost)
  wallTop: 7.1, // waar de schuine onderkant van de overstek begint
  eave: 7.3, // goot
  gableFoot: 8.71, // voet van de puntgeveltjes, bovenkant van de schilden
  ridge: 9.9, // nok
};
// Halve maten in x (zijvlak) en y (frontvlak).
const HALF = {
  shaft: [1.515, 1.515], // schacht 3,03 m in het vierkant
  house: [2.2, 2.425], // tankhuis 4,40 x 4,85 m
  eave: [2.35, 2.575], // overstek 0,15 m rondom
  ridge: 1.26, // noklengte 2,52 m
};
const STRUT = { out: 0.73, width: 0.9 }; // schoor 0,73 m buiten de schacht, verdikt tot 0,9 m

// ---------- schacht en tankhuis ----------
const shaft = box(-HALF.shaft[0], -HALF.shaft[1], BASE, HALF.shaft[0], HALF.shaft[1], H.houseBottom + 0.1);
const house = box(-HALF.house[0], -HALF.house[1], H.houseBottom, HALF.house[0], HALF.house[1], H.wallTop + 0.05);

// ---------- dak ----------
// Schilden: de vier dakvlakken van de goot tot de voet van de puntgeveltjes,
// met een overstek die van de gevel onder 53 graden naar de goot uitloopt.
// De lange vlakken (normaal ±x) lopen onder 48 graden door tot de nok, de
// schilden (normaal ±y) onder 47 graden.
const slope = (H.ridge - H.eave) / HALF.eave[0];
const footX = HALF.eave[0] - (H.gableFoot - H.eave) / slope;
const hips = hull([
  ...ring3(rect(-HALF.house[0], -HALF.house[1], HALF.house[0], HALF.house[1]), H.wallTop),
  ...ring3(rect(-HALF.eave[0], -HALF.eave[1], HALF.eave[0], HALF.eave[1]), H.eave),
  ...ring3(rect(-footX, -HALF.ridge, footX, HALF.ridge), H.gableFoot),
]);
// Zadeldakje met de twee puntgeveltjes (normaal ±y), van onder de voet in de
// schilden tot de nok.
const below = 0.4;
const footBelow = HALF.eave[0] - (H.gableFoot - below - H.eave) / slope;
const gablet = hull([
  ...ring3(rect(-Math.min(footBelow, HALF.house[0]) + 0.05, -HALF.ridge, Math.min(footBelow, HALF.house[0]) - 0.05, HALF.ridge), H.gableFoot - below),
  ...ring3(rect(-footX, -HALF.ridge, footX, HALF.ridge), H.gableFoot),
  [0, -HALF.ridge, H.ridge],
  [0, HALF.ridge, H.ridge],
]);

// ---------- schoren ----------
// Op de vier hoeken van de schacht, in het vlak van het zuidoost- en
// noordwestvlak, schuin naar buiten langs y (72 graden); in het echt een plank,
// hier een driehoek van 0,9 m dik.
const strut = hull([
  [HALF.shaft[0] - STRUT.width, HALF.shaft[1] - 0.1, BASE],
  [HALF.shaft[0], HALF.shaft[1] - 0.1, BASE],
  [HALF.shaft[0] - STRUT.width, HALF.shaft[1] + STRUT.out, BASE],
  [HALF.shaft[0], HALF.shaft[1] + STRUT.out, BASE],
  [HALF.shaft[0] - STRUT.width, HALF.shaft[1] - 0.1, H.strutTop],
  [HALF.shaft[0], HALF.shaft[1] - 0.1, H.strutTop],
]);
const mirrorY = (m) => m.scale([1, -1, 1]);
const mirrorX = (m) => m.scale([-1, 1, 1]);
const struts = union([strut, mirrorY(strut), mirrorX(strut), mirrorX(mirrorY(strut))]);

// ---------- vensters als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const cuts = union([
  niche(HALF.shaft[0], 1.08, ...H.shaftWindow), // schacht, zuidoost
  niche(HALF.house[0], 1.0, ...H.houseWindowA), // tankhuis, zuidoost, midden onder de goot
  place(niche(HALF.house[1], 0.9, ...H.houseWindowB), { deg: 90 }), // tankhuis, noordoost
]);

const tower = union([shaft, house, hips, gablet, struts]).subtract(cuts);

await writeLandmark({
  slug: "watertoren-stadskanaal-s-t-a-r",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op; een los tankhuis zou een voet tot de grondplaat krijgen.
  nodes: [["building:schacht-tankhuis-en-dak", tower]],
  catalog: {
    name: "Watertoren S.T.A.R. Stadskanaal",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[3.6, 0], [-3.6, 0], [0, 3.6], [0, -3.6]],
    // Ellipsoïdisch maaiveld: NAP +6,35 m plus de NLGEO2018-geoïdehoogte 41,28 m op de oorsprong.
    groundHeight: 47.63,
    description:
      "Oorsprong op het hart van het dak in het AHN op maaiveld (NAP +6,35 m), x langs de sporen naar het zuidoosten, y naar het noordoosten. Houten watertoren van de museumspoorlijn (2008): vierkante schacht van 3,03 m met vier schoren, overstekend tankhuis van 4,40 x 4,85 m van 4,63 tot 7,1 m, pannendak met goot op 7,3 m, schilden onder 47 graden tot 8,71 m en een zadeldakje met puntgeveltjes (nok langs y, 2,52 m, 48 graden) tot 9,9 m; vensters als nissen. Geen BAG-pand. Maten uit AHN, luchtfoto en twee Commons-foto's.",
    realWorld: {
      built: 2008,
      publishedHeightM: 10,
      reservoirM3: 50,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 16.24,
      shaftM: [HALF.shaft[0] * 2, HALF.shaft[1] * 2],
      houseM: [HALF.house[0] * 2, HALF.house[1] * 2],
      eavesM: [HALF.eave[0] * 2, HALF.eave[1] * 2],
      houseBottomM: H.houseBottom,
      eaveM: H.eave,
      gableFootM: H.gableFoot,
      ridgeLengthM: HALF.ridge * 2,
      modelTopM: H.ridge,
      photoScalePxPerM: 58.6, // voorvlak van het tankhuis; 57,7 in het voorvlak van de schacht
      roofSlopesDeg: [48, 47],
      minimumPartM: STRUT.width,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Groningen (bouwjaar, hoogte, reservoir)",
      "https://commons.wikimedia.org/wiki/File:Stoom_2016_Stadskanaal_05.jpg (bijna frontaal op het zuidoostvlak, maten)",
      "https://commons.wikimedia.org/wiki/File:Estaciones_y_Trenes_Europa_2017_-_I_-_49671078071.jpg (zuidoost- en noordoostvlak, dak)",
      "PDOK BAG-panden (geen pand onder de toren), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
      "OpenStreetMap: richting van de sporen (-45,5 graden) en het station Stadskanaal van de STAR",
      "NLGEO2018-geoïdehoogte op de oorsprong (41,28 m) voor groundHeight",
    ],
  },
});

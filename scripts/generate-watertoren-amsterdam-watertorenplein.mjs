// Watertoren aan het Watertorenplein (Waterkeringweg) in Amsterdam-West, op het voormalige terrein van de
// waterleiding aan de Haarlemmerweg (nu de Waterwijk/GWL-terrein): 1966, volgens Wikipedia 37 m hoog en de eerste
// stalen watertoren van Nederland. Een slanke ronde stalen schacht draagt via een kraag met twee ringen een bolvormig
// reservoir: een kegelvormige bodem, een ronde buik en een schouder die naar binnen loopt tot een omgang met een
// hekwerk. Op het flauw kegelvormige dak staat een hals met een donkere band en daarop een kapje in de vorm van een
// lampenkap (kegelstomp met een vlakke bovenkant).
//
// Oorsprong op het middelpunt van de ronde BAG-contour (pand 0363100012111986, cirkelfit straal 6,93 m, afwijking
// 1 mm) op maaiveld (AHN-DTM in een ring van 8 tot 14 m NAP +0,61 tot +0,83, mediaan +0,74). De toren is rond: +X
// loopt langs RD-oost.
//
// Hoogtes uit het AHN-DSM (0,5 m): bovenkant van het kapje NAP +36,45 binnen 1,7 m van het hart; de omgang vlak op
// NAP +29,99 tussen 5,9 en 6,5 m; het dak loopt daarbinnen op met 0,67 per m (NAP +30,39 op 5,25 m, +31,73 op 3,25 m).
// Straal van de buik uit het oppervlak van het DSM boven 15 tot 20 m (7,0 tot 7,05 m). De rest uit de telefoto
// "'Watertoren' Watertorenplein Amsterdam (5436543052)" (Commons, 2011, van circa 150 m: vrijwel orthografisch), met
// 9,55 px/m, geijkt op de buik (134 px) en gecontroleerd op het hoogteverschil tussen omgang en kapje (62 px, AHN 6,46 m):
// kapje r 1,68 boven en 2,51 onder op 33,2 m, donkere band r 2,25 tot 32,46 m, buik op 24,7 tot 27,4 m, bodemkegel
// tot de kraag op 20,3 m, kraag r 3,0 op 20,3 m tot r 2,75 op 18,4 m, schacht r 2,35. Verhouding schacht/kraag ook uit de foto
// "Centrale Markt, Amsterdam, Netherlands - panoramio" (Commons, 2015).
import { dome, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [119671.04, 488641.48];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 0.74; // AHN-DTM in een ring van 8 tot 14 m: mediaan 0,74
const GEOID_N = 42.97; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 96;

// Stralen.
const R = {
  shaft: 2.35, // stalen schacht (telefoto 45 px)
  collar: [2.75, 3.0], // kraag onder het reservoir, smal onder en breed boven (telefoto 52 en 57 px)
  coneFoot: 3.3, // voet van de bodemkegel boven de bovenste ring
  coneTop: 6.3, // waar de bodemkegel in de buik overgaat
  belly: 7.07, // buik (telefoto 134 px; DSM 7,0 tot 7,05)
  rim: 6.65, // bovenrand van het reservoir onder de omgang
  gallery: 5.85, // binnenrand van de omgang, voet van het dak (DSM)
  neck: 2.6, // waar het dak in de hals overgaat
  band: 2.25, // donkere band onder het kapje
  capFoot: 2.51, // onderrand van het kapje
  capTop: 1.68, // bovenkant van het kapje (DSM vlak tot 1,7 m)
};
const H = {
  collar: [18.0, 18.4], // schuine overgang van 45 graden van schacht naar kraag (onderste ring)
  ring: 20.3, // bovenste ring, voet van het reservoir
  coneFoot: 20.6,
  coneTop: 23.6, // bodemkegel onder 45 graden
  bellyFoot: 24.7,
  bellyTop: 27.4,
  rim: 29.25, // omgang (AHN NAP +29,99)
  neck: 31.43, // dak met helling 0,67 (AHN)
  band: [32.3, 32.9],
  capFoot: 33.2,
  top: 35.71, // AHN NAP +36,45
};

// Eén omwentelingsprofiel [r, z] van onder naar boven. Alle ondervlakken lopen onder 45 graden of steiler.
const profile = [
  [R.shaft, BASE],
  [R.shaft, H.collar[0]],
  [R.collar[0], H.collar[1]],
  [R.collar[1], H.ring],
  [R.coneFoot, H.coneFoot],
  [R.coneTop, H.coneTop],
  [6.85, 24.15], // ronding van bodem naar buik
  [R.belly, H.bellyFoot],
  [R.belly, H.bellyTop],
  [7.0, 28.2], // schouder naar binnen
  [6.85, 28.8],
  [R.rim, H.rim],
  [R.gallery, H.rim], // vloer van de omgang
  [R.neck, H.neck], // flauw kegeldak
  [R.band, H.band[0]], // voet van de hals
  [R.band, H.band[1]],
  [R.capFoot, H.capFoot], // onderkant van het kapje onder 41 graden
  [R.capTop, H.top],
];
const tower = dome([0, 0], profile, SEG);

await writeLandmark({
  slug: "watertoren-amsterdam-watertorenplein",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-kraag-reservoir-en-kapje", tower]],
  catalog: {
    name: "Watertoren Watertorenplein",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8], [0, -8]],
    // Ellipsoïdisch: NAP +0,74 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0363100012111986"],
    description:
      "Oorsprong op het midden van de ronde BAG-contour op maaiveld (NAP +0,74 m), +X langs RD-oost. Stalen schacht van 4,7 m doorsnede met een kraag van 5,5 tot 6,0 m tot 20,3 m, een bodemkegel onder 45 graden naar een buik van 14,14 m (24,7 tot 27,4 m), een schouder naar de omgang op 29,25 m, een kegeldak met helling 0,67, een hals met donkere band en een kapje als kegelstomp tot 35,71 m. Maten uit BAG, AHN en een telefoto; het hekwerk van de omgang is weggelaten.",
    realWorld: {
      publishedHeightM: 37,
      built: 1966,
      material: "staal",
      ahnGroundNapM: GROUND_NAP,
      ahnGalleryNapM: 29.99,
      ahnMaxNapM: 36.45,
      geoidNlgeo2018M: GEOID_N,
      shaftDiameterM: 2 * R.shaft,
      collarDiameterM: R.collar.map((r) => 2 * r),
      bellyDiameterM: 2 * R.belly,
      bagCircleDiameterM: 13.86,
      galleryM: H.rim,
      capDiameterM: [2 * R.capFoot, 2 * R.capTop],
      modelTopM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Amsterdam_Waterkeringweg) (1966, 37 m, eerste stalen watertoren van Nederland)",
      "https://commons.wikimedia.org/wiki/File:%27Watertoren%27_Watertorenplein_Amsterdam_(5436543052).jpg (telefoto: profiel van reservoir, omgang, hals en kapje)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Adam_Waterkeringweg.jpg (schacht, kraag met ringen, buik en omgang)",
      "https://commons.wikimedia.org/wiki/File:Centrale_Markt,_Amsterdam,_Netherlands_-_panoramio.jpg (verhouding schacht en kraag)",
      "PDOK BAG-pand 0363100012111986, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
      "NLGEO2018-geoïdehoogte op de oorsprong (42,97 m) voor groundHeight",
    ],
  },
});

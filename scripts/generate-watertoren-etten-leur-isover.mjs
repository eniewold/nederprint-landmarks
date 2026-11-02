// Watertoren van de glaswolfabriek Isover (Saint-Gobain) in Etten-Leur, op het
// fabrieksterrein aan de Parallelweg ten westen van het dorp. Gebouwd in 1962
// (Wikipedia, Lijst van watertorens in Noord-Brabant; geen eigen artikel, geen
// coördinaten). Een witte betonnen toren: een ronde, rechte schacht met een
// smalle band onder het reservoir, een kuip in de vorm van een omgekeerde
// afgeknotte kegel met een rechte rand, een flauw kegeldak en een donkere,
// verhoogde ronde kap in het midden. In de schacht twee kolommen smalle
// trapvensters die om de 3 m verspringen (een wenteltrap); onder de kuip een
// rij kleine ventilatiegaten.
//
// Oorsprong op het middelpunt van de cirkel door de BGT-contour (overig
// bouwwerk, type opslagtank, G0777.209723b0a9cb43d28cd78c2dd7df4fe5; straal
// 3,00 m) op het maaiveld (AHN-DTM NAP +4,42 m). De toren is geen BAG-pand en
// staat daardoor niet in de PDOK-gebouwen: het model vult een leeg vlak.
// +X wijst naar RD-oost: een ronde toren heeft geen hoofdas.
// Hoogtes uit het AHN-DSM 0,5 m: dakrand NAP +41,9 (37,45 m), dak 23 graden tot
// de rand van de kap (NAP +43,3), kap tot NAP +44,37 (39,95 m). Doorsneden uit
// de luchtfoto (8 cm; kuiprand 13,7 m, schacht circa 7,5 m) en de foto "Etten
// Leur Watertoren 1228" (Willemjans, 2006, CC BY-SA 3.0): kuip, band en
// vensters, geschaald op de kuiprand (34,3 px/m) en de schacht (32,7 px/m).
// De BGT-cirkel (6,0 m) is smaller dan de schacht op luchtfoto en foto; de
// schacht volgt de foto.
import { hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [100699.38, 397811.86];
const AXIS = [1, 0]; // +X = RD-oost
const BASE = -0.3;
const GROUND_NAP = 4.42; // AHN-DTM in een ring van 9 tot 14 m (4,37 tot 4,66)
const GEOID_N = 44.1; // NLGEO2018-geoïdehoogte op de oorsprong (44,096)
const SEG = 72;

const R = {
  shaft: 3.65, // foto: kuiprand/schacht 2,0 (diepte meegerekend 1,9); luchtfoto 7,6 m
  band: 3.8, // band onder de kuip, 0,15 m uitkragend
  bowlFoot: 3.95, // onderrand van de kuip
  bowlTop: 6.56, // bovenkant van de schuine kuipwand
  rim: 6.85, // rechte kuiprand (luchtfoto 13,76 m, AHN tot 6,9 m)
  eave: 6.6, // dakrand na de afschuining van de rand
  cap: 3.35, // donkere kap (luchtfoto 6,7 m, AHN-plateau r 3,3)
};
const H = {
  band: 28.0, // onderkant van de band (foto)
  bowl: 29.6, // onderkant van de kuip
  bowlTop: 34.7, // einde van de schuine kuipwand (27 graden uit het lood)
  rimTop: 37.0, // bovenkant van het rechte deel van de rand
  eave: 37.45, // dakrand (AHN NAP +41,9)
  capFoot: 38.85, // dak bij de kap (AHN NAP +43,3, 23 graden)
  capEdge: 39.35, // rand van de kap (AHN NAP +43,8)
  top: 39.95, // midden van de kap (AHN NAP +44,37)
};

const ring = (r, z) => ring3(circle([0, 0], r, SEG), z);

// ---------- schacht, band, kuip, dak en kap ----------
const shaft = hull([...ring(R.shaft, BASE), ...ring(R.shaft, H.band + 0.05)]);
// Band: kraag van 53 graden onder de uitkraging van 0,15 m, dan recht tot de kuip.
const band = hull([...ring(R.shaft, H.band - 0.2), ...ring(R.band, H.band), ...ring(R.band, H.bowl)]);
// Kuip: korte kraag (53 graden) naar de onderrand, dan de kegelwand van 27 graden uit het lood.
const bowl = hull([...ring(R.band, H.bowl - 0.05), ...ring(R.bowlFoot, H.bowl + 0.15), ...ring(R.bowlTop, H.bowlTop)]);
// Rand: kraag van 50 graden naar de rechte rand, afgeschuind naar de dakrand, kegeldak tot de kap.
const rimRoof = hull([
  ...ring(R.bowlTop, H.bowlTop - 0.05),
  ...ring(R.rim, H.bowlTop + 0.3),
  ...ring(R.rim, H.rimTop),
  ...ring(R.eave, H.eave),
  ...ring(R.cap, H.capFoot),
]);
// Kap: lage trommel met een flauwe kegel (10 graden).
const cap = hull([...ring(R.cap, H.capFoot - 0.1), ...ring(R.cap, H.capEdge), [0, 0, H.top]]);

// ---------- trapvensters als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = -w / 2, y1 = w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
// Twee kolommen, 6 m steek, 3 m verspringend; standen geschat (de foto heeft geen kijkrichting).
const COLUMN_A = 105; // graden linksom vanaf RD-oost (noordnoordwest)
const COLUMN_B = 4; // oost
const WINDOWS_A = [[6.6, 8.0], [12.7, 14.1], [18.7, 20.1], [24.6, 26.0]];
const WINDOWS_B = [[3.4, 4.8], [9.4, 10.8], [15.5, 16.9], [21.4, 22.8]];
const cuts = [
  ...WINDOWS_A.map(([z0, z1]) => place(niche(R.shaft, 0.6, z0, z1), { deg: COLUMN_A })),
  ...WINDOWS_B.map(([z0, z1]) => place(niche(R.shaft, 0.6, z0, z1), { deg: COLUMN_B })),
];

const tower = union([shaft, band, bowl, rimRoof, cap]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-etten-leur-isover",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-kuip-en-kap", tower]],
  catalog: {
    name: "Watertoren Isover Etten-Leur",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch: NAP +4,42 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    description:
      "Oorsprong op het middelpunt van de ronde BGT-contour op het maaiveld van het fabrieksterrein (NAP +4,42 m), +X naar RD-oost; geen BAG-pand. Witte betonnen schacht van 7,3 m doorsnede met een band op 28 m, een kuip als omgekeerde afgeknotte kegel van 29,6 tot 34,7 m met een rechte rand van 13,7 m tot 37,45 m, een kegeldak van 23 graden en een ronde kap tot 39,95 m; twee kolommen trapvensters. Maten uit AHN, BGT, luchtfoto en één foto.",
    realWorld: {
      built: 1962,
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 41.9,
      ahnCapEdgeNapM: 43.8,
      ahnTopNapM: 44.37,
      geoidNlgeo2018M: GEOID_N,
      bgtCircleDiameterM: 6.0,
      shaftDiameterM: R.shaft * 2,
      rimDiameterM: R.rim * 2,
      capDiameterM: R.cap * 2,
      bowlM: [H.bowl, H.bowlTop],
      eaveM: H.eave,
      roofPitchDeg: 23,
      modelTopM: H.top,
      photoScalePxPerM: 34.3,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Noord-Brabant (bouwjaar 1962)",
      "https://commons.wikimedia.org/wiki/File:Etten_Leur_Watertoren_1228.JPG (Willemjans, 2006, CC BY-SA 3.0: schacht, band, kuip, rand, kap en vensters)",
      "PDOK AHN DSM/DTM 0,5 m, luchtfoto 8 cm en BGT overig bouwwerk G0777.209723b0a9cb43d28cd78c2dd7df4fe5, 2026-11-02",
      "NLGEO2018-geoïdehoogte op de oorsprong (44,10 m) voor groundHeight",
    ],
  },
});

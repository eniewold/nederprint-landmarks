// Watertoren van Raamsdonksveer aan de Oosterhoutseweg 18, gebouwd in 1925 naar
// ontwerp van H. Sangster (Hendrik Sangster) voor de N.V. Waterleiding
// Maatschappij Noord-West-Brabant; 43,85 m hoog met een cilindrisch betonnen
// reservoir van 300 m³ (hoogwater op 36 m), rijksmonument 520055. Een
// betonskelet met bepleisterde baksteen op een zeshoekige plattegrond, in vier
// delen: een plint, een smallere schacht, een reservoirbehuizing die via
// trapsgewijs uitkragende lagen uitsteekt (het verst aan de oost- en westzijde)
// met in elk gevelvlak een ondiepe erkerachtige uitbouw, en een twaalfzijdige
// bekroning met een iets spits koepeldak. Steunberen staan op de noord- en
// zuidhoek (door tot de bekroning) en twee tegen de oost- en de westgevel van de
// schacht. Aan de oostzijde lag de ingang met daarboven over de hele schacht
// een smalle vensterspleet en in de behuizing een uitsparing; vensters en
// lichtopeningen zijn dichtgezet. De eenlaagse aanbouwen uit 1992 (in het AHN5
// van 2024 nog te zien) zijn voor de hotelbouw van 2024-2026 gesloopt en zitten
// niet in het model.
//
// Oorsprong op het hart van de toren uit het AHN5-DSM (de BAG-contour van pand
// 0779100000000227 is "niet ingemeten" en ligt 1,5 m te noordelijk) op
// maaiveld (AHN5-DTM en 3D BAG NAP +2,2 m). De zeshoek staat met de hoeken op
// noord en zuid (luchtfoto: een rib van de koepel en de zuidhoek wijzen recht
// naar het zuiden): lokale +X is de normaal van de oostgevel, xAxis [1, 0].
// Hoogtes uit het AHN5-DSM 0,5 m: top NAP +46,25 (44,05 m), rand van de koepel
// circa 41 m, bovenkant behuizing 37 tot 38 m. Breedtes uit het DSM (oost-west
// 10,4 tot 10,8 m boven 36 m, noord-zuid 12 m over de hoekberen) en de foto's;
// de hoogtes van plint, overgang en beren uit de RCE-foto's 20346871 en
// 20335216 en de foto van 2007, geschaald op de breedte van de bekroning en de
// AHN-top.
import { hull, ring3, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [119685.67, 410817.23];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 2.2; // AHN5-DTM 2,09 tot 2,33 rond de voet, 3D BAG 2,19
const GEOID_N = 43.76; // NLGEO2018-geoïdehoogte op de oorsprong

const COS30 = Math.cos(Math.PI / 6);
// Normalen van de zes gevelvlakken: oost (0), noordoost (60), noordwest (120), west (180), zuidwest (240), zuidoost (300).
const FACES = [0, 60, 120, 180, 240, 300];
// Zeshoek met per gevelvlak een eigen apothema (oost en west steken in de behuizing verder uit).
const hexA = (ap) =>
  FACES.map((d, k) => {
    const n = FACES[(k + 1) % 6];
    const a0 = ap[k], a1 = ap[(k + 1) % 6];
    const t0 = (d * Math.PI) / 180, t1 = (n * Math.PI) / 180;
    // Snijpunt van x cos t0 + y sin t0 = a0 en x cos t1 + y sin t1 = a1.
    const det = Math.cos(t0) * Math.sin(t1) - Math.sin(t0) * Math.cos(t1);
    return [(a0 * Math.sin(t1) - a1 * Math.sin(t0)) / det, (Math.cos(t0) * a1 - Math.cos(t1) * a0) / det];
  });
const hex = (a) => hexA(FACES.map(() => a));

const A = {
  plinth: 5.1, // plint, 0,3 m buiten de schacht
  shaft: 4.8, // schacht (DSM: noord-zuid over de hoeken 11,1 m plus de hoekberen)
  tank: 4.95, // behuizing op de schuine vlakken
  tankEW: 5.15, // behuizing aan de oost- en westzijde (DSM 10,4 tot 10,8 m over de erkers)
  bay: 0.25, // erkerachtige uitbouw per vlak
};
const TANK = [A.tankEW, A.tank, A.tank, A.tankEW, A.tank, A.tank];
const H = {
  plinth: 7.0, // bovenkant plint (foto's 6,8 tot 7,9 m)
  corbelFoot: 28.4, // trapsgewijs uitkragende lagen onder 45 graden
  corbelTop: 28.75,
  pierTop: 29.6, // steunberen tegen de oost- en westgevel
  bayFoot: 30.0,
  bayTop: 36.8,
  cornerPierTop: 37.2, // hoekberen noord en zuid
  tankTop: 37.6, // bovenkant behuizing (DSM 37 tot 38)
  drumCornice: 40.4,
  drumTop: 41.0, // rand van de koepel (DSM, foto's 41,3 tot 41,8)
  apex: 44.05, // top van de koepel (AHN NAP +46,25; Wikipedia 43,85 m)
};

// ---------- plint, schacht, overgang en behuizing ----------
const walls = union([
  // Plint met een afgeschuinde bovenrand (0,3 m onder 45 graden).
  hull([...ring3(hex(A.plinth), BASE), ...ring3(hex(A.plinth), H.plinth), ...ring3(hex(A.shaft), H.plinth + 0.3)]),
  prism(hex(A.shaft), BASE, H.corbelFoot + 0.05),
  hull([...ring3(hex(A.shaft), H.corbelFoot), ...ring3(hexA(TANK), H.corbelTop), ...ring3(hexA(TANK), H.tankTop)]),
]);

// Erkerachtige uitbouw in elk vlak van de behuizing: 2,6 m breed, 0,25 m uit, onderkant onder 45 graden.
const bay = (f) => hull([[f - 0.1, -1.3, H.bayFoot], [f - 0.1, 1.3, H.bayFoot], [f + A.bay, -1.3, H.bayFoot + A.bay + 0.1], [f + A.bay, 1.3, H.bayFoot + A.bay + 0.1], [f - 0.1, -1.3, H.bayTop], [f - 0.1, 1.3, H.bayTop], [f + A.bay, -1.3, H.bayTop], [f + A.bay, 1.3, H.bayTop]]);
const bays = FACES.map((d, k) => place(bay(TANK[k]), { deg: d }));

// Hoekberen op de noord- en zuidhoek: 1,0 m breed, 0,5 m voorbij de hoek, tot 37,2 m met een schuine kop.
const R = A.shaft / COS30;
const cornerPier = hull([
  ...[[-0.5, R - 1.0], [0.5, R - 1.0]].flatMap(([x, y]) => [[x, y, BASE], [x, y, H.cornerPierTop]]),
  ...[[-0.5, R + 0.5], [0.5, R + 0.5]].flatMap(([x, y]) => [[x, y, BASE], [x, y, H.cornerPierTop - 0.5]]),
]);
const cornerPiers = [place(cornerPier, { deg: 0 }), place(cornerPier, { deg: 180 })];

// Twee steunberen tegen de oost- en de westgevel: 0,9 m breed, 0,6 m uit, op 1,75 m uit het midden, tot 29,6 m.
const facePier = (c) => hull([
  ...[[A.shaft - 0.2, c - 0.45], [A.shaft - 0.2, c + 0.45]].flatMap(([x, y]) => [[x, y, BASE], [x, y, H.pierTop]]),
  ...[[A.shaft + 0.6, c - 0.45], [A.shaft + 0.6, c + 0.45]].flatMap(([x, y]) => [[x, y, BASE], [x, y, H.pierTop - 0.6]]),
]);
const facePiers = [0, 180].flatMap((d) => [-1.75, 1.75].map((c) => place(facePier(c), { deg: d })));

// ---------- twaalfzijdige bekroning en koepel ----------
const dodec = (r) => circle([0, 0], r, 12, 0); // hoeken op de hoeken van de zeshoek
const DRUM_R = 4.7;
const drum = union([
  prism(dodec(DRUM_R), H.tankTop - 0.1, H.drumCornice + 0.05),
  // Kroonlijst 0,2 m uit onder 45 graden.
  hull([...ring3(dodec(DRUM_R), H.drumCornice), ...ring3(dodec(DRUM_R + 0.2), H.drumCornice + 0.2), ...ring3(dodec(DRUM_R + 0.2), H.drumTop)]),
]);
// Iets spits koepeldak met twaalf vlakken (DSM: r 4 op 41,7, r 3 op 42,6, r 2 op 43,35, r 1 op 43,85).
const DOME = [[4.6, H.drumTop - 0.05], [4.4, 41.6], [3.8, 42.15], [3.0, 42.7], [2.0, 43.35], [1.0, 43.85], [0.25, H.apex]];
const dome = hull(DOME.flatMap(([r, z]) => ring3(dodec(r), z)));

// ---------- nissen: panelen in de bekroning, uitsparing, vensterspleet en ingang ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f, midden op y = c.
const niche = (f, w, z0, z1, depth = 0.3, c = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = c - w / 2, y1 = c + w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
// Paneel per vlak van de bekroning tussen pilasters van 1,0 m (vlak 2,43 m breed).
const DRUM_AP = DRUM_R * Math.cos(Math.PI / 12);
const panels = Array.from({ length: 12 }, (_, k) => place(niche(DRUM_AP, 1.4, H.tankTop + 0.4, H.drumCornice - 0.4, 0.25), { deg: 15 + 30 * k }));
// Oostzijde: uitsparing in de behuizing tussen de koppen van de steunberen, de dichtgezette vensterspleet en de ingang in de plint.
const recess = niche(A.tankEW, 2.0, H.corbelFoot - 0.2, H.pierTop + 0.2, 0.4);
const slit = niche(A.shaft, 1.0, H.plinth + 1.0, H.corbelFoot - 1.2, 0.25);
const door = hull(
  [[0, 0], [0.9, 0], [0.9, 2.8], [0, 3.8], [-0.9, 2.8], [-0.9, 0]].flatMap(([y, z]) => [[A.plinth - 0.4, y, z === 0 ? BASE + 0.3 : z], [A.plinth + 1, y, z === 0 ? BASE + 0.3 : z]]),
);
const cuts = [...panels, recess, slit, door];

const tower = union([walls, ...bays, ...cornerPiers, ...facePiers, drum, dome]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-raamsdonksveer",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:zeshoekige-schacht-reservoir-en-koepel", tower]],
  catalog: {
    name: "Watertoren Raamsdonksveer",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, 7.5], [0, -7.5]],
    // Ellipsoïdisch: NAP +2,2 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0779100000000227"],
    description:
      "Oorsprong op het hart van de toren uit het AHN5-DSM op maaiveld (NAP +2,2 m), +X de normaal van de oostgevel (RD-oost), hoeken van de zeshoek op noord en zuid. Zeshoekige schacht van 9,6 m over de vlakken op een plint tot 7 m, steunberen op de noord- en zuidhoek tot 37,2 m en twee tegen de oost- en westgevel tot 29,6 m, reservoirbehuizing die op 28,4 m onder 45 graden uitkraagt (oost en west tot 10,3 m) met een erker per vlak, twaalfzijdige bekroning met panelen en kroonlijst tot 41 m en een iets spits twaalfvlaks koepeldak tot 44,05 m; aan de oostzijde de ingang, de dichtgezette vensterspleet en de uitsparing in de behuizing. Maten uit AHN5, BAG, luchtfoto, register en foto's.",
    realWorld: {
      publishedHeightM: 43.85,
      reservoirM3: 300,
      highWaterM: 36,
      built: 1925,
      architect: "H. Sangster",
      monument: 520055,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 46.25,
      geoidNlgeo2018M: GEOID_N,
      shaftAcrossFlatsM: A.shaft * 2,
      plinthAcrossFlatsM: A.plinth * 2,
      tankEastWestM: (A.tankEW + A.bay) * 2,
      plinthM: H.plinth,
      corbelM: [H.corbelFoot, H.corbelTop],
      facePierTopM: H.pierTop,
      cornerPierTopM: H.cornerPierTop,
      tankTopM: H.tankTop,
      drumTopM: H.drumTop,
      apexM: H.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Raamsdonksveer)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/520055 (zeshoek, vier delen, steunberen, erkers, twaalfzijdige bekroning)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_voormalig_watertoren_-_Raamsdonksveer_-_20346871_-_RCE.jpg (frontaal: beren, overgang, plint)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Raamsdonksveer_-_20335216_-_RCE.jpg (bekroning en koepel)",
      "https://commons.wikimedia.org/wiki/File:Raamsdonksveer_-_watertoren.jpg (2007) en File:Raamsdonkveer,_de_watertoren_RM520055_IMG_7390_2020-09-13_11.56.jpg (2020)",
      "PDOK BAG-pand 0779100000000227, AHN5 DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "3D BAG (LoD2.2, AHN5 2024) van pand 0779100000000227 ter controle",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,76 m) voor groundHeight",
    ],
  },
});

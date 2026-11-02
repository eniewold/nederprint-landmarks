// Watertoren aan de Torenstraat in Helmond: ontwerp J.H.J. Kording (1941),
// door de oorlog pas in november 1948 in gebruik genomen, 47,3 m hoog met een
// reservoir van 1200 m³; gemeentelijk monument (WN269), staat leeg en draagt
// zendantennes. Een bakstenen schacht in de vorm van een kruis: vier vleugels
// van 4,2 m breed (de BAG-contour) met getrapte binnenhoeken. Elke vleugel heeft
// in het midden een hoge vensterstrook in een getrapte sleuf en bovenaan een
// erker met een witte betonnen plaat en latei, onder de witte lijst van het
// twaalfzijdige reservoir. Dat reservoir is breder dan de binnenhoeken van de
// schacht en rust daar op een schuine betonnen kraag. Over elke reservoirhoek boven
// een vleugel een wit sierstuk (twee lisenen met een dwarsbalk boven en onder,
// een middenlijn tot de afdekking); op het dak een teruggezette lichtkap van
// twaalf zijden met een flauw kegeldak.
//
// Oorsprong op het hart van de BAG-contour (pand 0794100000353661, 145,9 m²),
// het midden tussen de voorvlakken van de tegenover elkaar liggende vleugels,
// op maaiveld (AHN-DTM NAP +17,08 m; 3D BAG 17,05). De vleugels staan in de
// BAG op 24,75 + 90k graden van RD-oost: lokale +X is de vleugel aan de
// oost-noordoostkant. De vierde binnenhoek (lokaal -45 graden, RD 340) is in de
// BAG niet getrapt maar recht afgeschuind; zo staat hij ook in het model.
// Hoogtes uit het AHN-DSM 0,5 m: afdekking NAP +60,9 (43,8 m), dakrand van de
// lichtkap NAP +62,6, top NAP +64,12 (47,0 m). Tussenhoogtes en breedtes van
// erker, lijst en sierstukken uit de frontale foto "0794 WN269 Helmond
// Watertoren 2" (perspectief gecorrigeerd, 25,3 px/m op het vleugelvlak,
// geschaald op de afdekking).
import { hull, ring3, circle, union, place, box, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [173593.55, 388423.2];
const ROT = 24.75; // vleugels in graden linksom van RD-oost
const AXIS = [+Math.cos((ROT * Math.PI) / 180).toFixed(4), +Math.sin((ROT * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 17.08; // AHN-DTM in een ring van 11 tot 14 m (17,05 tot 17,19)
const GEOID_N = 43.94; // NLGEO2018-geoïdehoogte op de oorsprong

// Plattegrond (lokaal, vleugel langs +X): voorvlak en halve breedte uit de BAG.
const WING = { front: 8.55, half: 2.1 };
// Getrapte binnenhoek tussen de vleugel op 0 en die op 90 graden (BAG, symmetrisch gemaakt):
// trappen van 0,67 m en een schuin vlak van 0,87 m op 5,28 m uit het hart.
const STEPS = [[4.71, 2.1], [4.71, 2.78], [4.04, 2.78], [4.04, 3.43], [3.43, 4.04], [2.78, 4.04], [2.78, 4.71], [2.1, 4.71]];
// De afgeschuinde hoek tussen de vleugel op -90 en die op 0 graden (BAG): één vlak op 5,31 m,
// in het stelsel van STEPS (dat met 270 graden in die hoek wordt gedraaid).
const CHAMFER = [[5.42, 2.1], [2.1, 5.42]];

const A = {
  tank: 8.11, // apothema van het twaalfzijdige reservoir, hoeken op 8,4 m (DSM: rand op 8,0 tot 8,4; foto: even breed als de schacht)
  cornice: 8.5, // witte lijst onder het reservoir
  coping: 8.3, // afdekking
  gutter: 7.4, // binnenkant van de borstwering (goot rond de lichtkap)
  lantern: 6.4, // glazen wand van de lichtkap
  eave: 6.9, // dakrand van de lichtkap
  corbelFoot: 4.85, // voet van de schuine kraag onder het reservoir, binnen de schacht
  oriel: 9.35, // voorvlak van de erker
  orielSlab: 9.55, // witte plaat onder de erker
};
const H = {
  channelTop: 25.7, // getrapte sleuf tot onder de console van de erker
  window: 3.6, // onderkant vensterstrook
  orielFoot: 25.7, // console onder de erker (schuin, 45 graden)
  slab: 26.9, // witte plaat
  slabTop: 27.5,
  glass: 28.7, // glasstrook van de erker
  glassTop: 30.5,
  lintel: 31.5, // onderkant van de witte lijst
  corbelFoot: 28.75, // schuine kraag naar het reservoir (41,8 graden uit het lood)
  tank: 32.4, // bovenkant van de lijst, voet van het reservoir
  ornament: 33.3,
  copingFoot: 43.2,
  coping: 43.75, // afdekking (AHN NAP +60,9)
  gutter: 43.3,
  eaveFoot: 44.7,
  eave: 45.5, // dakrand van de lichtkap (AHN NAP +62,6)
  roofKnee: 46.7, // kegeldak tot r 2 m (AHN NAP +63,8)
  top: 47.05, // AHN NAP +64,12; Wikipedia 47,3 m
};

const rad = (deg) => (deg * Math.PI) / 180;
// Regelmatige twaalfhoek met apothema a, hoeken op 30k graden: een hoek recht boven elke vleugel
// (frontale foto: het sierstuk en de erker staan onder een hoek van het reservoir), een vlak boven elke binnenhoek.
const hexa = (a) => circle([0, 0], a / Math.cos(Math.PI / 12), 12, 0);
const ring = (a, z0, z1) => hull([...ring3(hexa(a), z0), ...ring3(hexa(a), z1)]);
// Doos in het vleugelstelsel (s radiaal, t tangentiaal).
const slabST = (s0, s1, t, z0, z1) => box(s0, -t, z0, s1, t, z1);
const rect3 = (s0, s1, t, z) => [[s0, -t, z], [s1, -t, z], [s0, t, z], [s1, t, z]];
const WINGS = [0, 90, 180, 270];
const DOOR_WING = 180; // RD 205 graden (zuid-zuidwest), uit de lichtval op de foto "Helmond Watertoren 2483"

// ---------- schacht ----------
const rot = ([x, y], d) => [x * Math.cos(rad(d)) - y * Math.sin(rad(d)), x * Math.sin(rad(d)) + y * Math.cos(rad(d))];
const plan = WINGS.flatMap((d) => [
  rot([WING.front, -WING.half], d),
  rot([WING.front, WING.half], d),
  ...(d === 270 ? CHAMFER : STEPS).map((p) => rot(p, d)),
]);
const shaft = prism(plan, BASE, H.tank);

// Schuine kraag (45 graden) van de binnenhoeken naar het reservoir; boven de vleugels valt hij in de schacht.
const corbel = hull([...ring3(hexa(A.corbelFoot), H.corbelFoot), ...ring3(hexa(A.tank), H.tank)]);

// ---------- erker per vleugel ----------
const orielParts = [
  // Console: van de vleugel (4,2 m breed) onder 45 graden naar de plaat (6,5 m breed, 1,0 m voor de vleugel).
  hull([...rect3(5.0, WING.front, WING.half, H.orielFoot), ...rect3(5.0, A.orielSlab, 3.25, H.slab)]),
  slabST(5.0, A.orielSlab, 3.25, H.slab - 0.05, H.slabTop), // witte plaat
  slabST(5.0, A.oriel, 3.0, H.slabTop - 0.05, H.lintel + 0.05), // borstwering, glas en latei
  // Witte lijst springt boven de erker mee uit, met een kraag van 45 graden.
  hull([...rect3(5.0, A.oriel, 3.0, H.lintel - 0.2), ...rect3(5.0, A.oriel + 0.2, 3.2, H.lintel), ...rect3(5.0, A.oriel + 0.2, 3.2, H.tank)]),
];
const oriel = union(orielParts);

// ---------- reservoir, lijst, afdekking ----------
const tank = union([
  // Witte lijst 0,45 m uit het reservoir, ondervlak onder 45 graden.
  hull([...ring3(hexa(A.tank), H.lintel - 0.45), ...ring3(hexa(A.cornice), H.lintel), ...ring3(hexa(A.cornice), H.tank)]),
  ring(A.tank, H.tank - 0.05, H.copingFoot + 0.05),
  hull([...ring3(hexa(A.tank), H.copingFoot), ...ring3(hexa(A.coping), H.copingFoot + 0.2), ...ring3(hexa(A.coping), H.coping)]),
]);
const gutterCut = ring(A.gutter, H.gutter, H.coping + 1);

// Sierstuk over de reservoirhoek boven elke vleugel: reliëf van 0,25 m op de twee vlakken naast de hoek,
// met een ondervlak van 45 graden (elk deel = omhulsel van een achter- en voorvlak, gesneden op de verschoven twaalfhoek).
const D = 0.25;
const RV = A.tank / Math.cos(Math.PI / 12); // hoekstraal
const rib = (t0, t1, z0, z1) => hull([[RV - 0.7, t0, z0], [RV - 0.7, t1, z0], [RV - 0.7, t0, z1], [RV - 0.7, t1, z1],
  [RV + D, t0, z0 + 0.7 + D], [RV + D, t1, z0 + 0.7 + D], [RV + D, t0, z1], [RV + D, t1, z1]]);
const ornament = union([
  rib(-0.25, 0.25, H.ornament, 34.4), // stompje onder
  rib(-1.15, 1.15, 34.15, 34.55), // dwarsbalk onder
  rib(0.4, 0.8, 34.4, 41.75), // lisenen
  rib(-0.8, -0.4, 34.4, 41.75),
  rib(-1.15, 1.15, 41.6, 42.0), // dwarsbalk boven
  rib(-0.2, 0.2, 41.9, H.copingFoot + 0.1), // middenlijn tot de afdekking
]).intersect(ring(A.tank + D, H.ornament - 1, H.coping));

// ---------- lichtkap met kegeldak ----------
const lantern = union([
  ring(A.lantern, H.gutter - 0.05, H.eaveFoot + 0.05),
  hull([...ring3(hexa(A.lantern), H.eaveFoot), ...ring3(hexa(A.eave), H.eave - 0.25), ...ring3(hexa(A.eave), H.eave)]),
  hull([...ring3(hexa(A.eave), H.eave - 0.05), ...ring3(hexa(2.0), H.roofKnee), ...ring3(hexa(0.9), H.top)]),
]);

// ---------- uitsparingen ----------
// Getrapte sleuf in elk vleugelvlak: 2,8 m breed 0,3 m diep, daarin de vensterstrook 1,4 m breed 0,6 m diep.
// Plafond onder 45 graden tegen de console van de erker.
const sleeve = (t, depth, z0, z1) => hull([
  [WING.front - depth, -t, z0], [WING.front - depth, t, z0], [WING.front + 1, -t, z0], [WING.front + 1, t, z0],
  [WING.front - depth, -t, z1 - depth], [WING.front - depth, t, z1 - depth], [WING.front + 1, -t, z1 + 1], [WING.front + 1, t, z1 + 1],
]);
const channel = (door) => union([
  sleeve(1.43, 0.3, BASE + 0.3, H.channelTop),
  sleeve(0.7, 0.6, door ? BASE + 0.3 : H.window, H.channelTop - 0.3),
]);
// Glasstrook van de erker 0,25 m terug.
const orielGlass = slabST(A.oriel - 0.25, A.oriel + 1, 2.85, H.glass, H.glassTop);

// Luifel boven de deur: 5,7 m breed, 1,0 m uit de vleugel, ondervlak onder 45 graden.
const canopy = hull([...rect3(7.85, WING.front, 1.85, 1.2), ...rect3(7.85, WING.front + 1.0, 2.85, 2.2), ...rect3(7.85, WING.front + 1.0, 2.85, 2.55)]);

const wings = WINGS.map((d) => place(union([oriel, ornament]), { deg: d }));
const body = union([shaft, corbel, tank, lantern, ...wings, place(canopy, { deg: DOOR_WING })]);
const cuts = union([
  gutterCut.subtract(ring(A.lantern, H.gutter - 1, H.top + 1)),
  ...WINGS.map((d) => place(union([channel(d === DOOR_WING), orielGlass]), { deg: d })),
]);
// De luifel blijft heel: alleen de sleuf eronder.
const all = body.subtract(cuts.subtract(place(canopy, { deg: DOOR_WING }))).trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-helmond-torenstraat",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-erkers-reservoir-en-lichtkap", all]],
  catalog: {
    name: "Watertoren Torenstraat Helmond",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[10.5, 0], [-10.5, 0], [0, 10.5], [0, -10.5]],
    // Ellipsoïdisch: NAP +17,08 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0794100000353661"],
    description:
      "Oorsprong op het hart van de BAG-contour op maaiveld (NAP +17,08 m), +X langs de oost-noordoostelijke vleugel (24,75 graden linksom van RD-oost). Kruisvormige bakstenen schacht met vier vleugels van 4,2 m breed tot 8,55 m uit het hart en getrapte binnenhoeken (één afgeschuind, zoals in de BAG), per vleugel een getrapte sleuf met vensterstrook en bovenaan een erker van 6,5 m breed op een console; daarop het twaalfzijdige reservoir van 16,8 m over de hoeken (een hoek boven elke vleugel) op een schuine kraag, met een witte lijst op 31,5 tot 32,4 m, een wit sierstuk boven elke vleugel en de afdekking op 43,75 m. Op het dak een teruggezette twaalfzijdige lichtkap met flauw kegeldak tot 47,05 m. Deur met luifel aan de zuid-zuidwestkant. Maten uit BAG, AHN, luchtfoto en foto's.",
    realWorld: {
      designed: 1941,
      built: 1948,
      architect: "J.H.J. Kording",
      gemeentelijkMonument: "WN269",
      publishedHeightM: 47.3,
      reservoirM3: 1200,
      ahnGroundNapM: GROUND_NAP,
      ahnCopingNapM: 60.9,
      ahnLanternEaveNapM: 62.6,
      ahnTopNapM: 64.12,
      geoidNlgeo2018M: GEOID_N,
      wingsDeg: ROT,
      wingWidthM: WING.half * 2,
      shaftAcrossWingsM: WING.front * 2,
      tankAcrossFlatsM: A.tank * 2,
      tankFootM: H.tank,
      copingM: H.coping,
      lanternEaveM: H.eave,
      modelTopM: H.top,
      orielM: [H.orielFoot, H.lintel],
      photoScalePxPerM: 25.3,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Helmond_Torenstraat) (J.H.J. Kording, ontwerp 1941, in gebruik 1948, 47,3 m, 1200 m³)",
      "https://commons.wikimedia.org/wiki/File:0794_WN269_Helmond_Watertoren_2.jpg (frontaal op een vleugel, maten)",
      "https://commons.wikimedia.org/wiki/File:0794_WN269_Helmond_Watertoren.jpg, Watertoren_Helmond_in_2022.jpg (vleugel, erker, sierstuk, lichtkap)",
      "https://commons.wikimedia.org/wiki/File:Helmond_Watertoren_2483.JPG, Watertoren_Torenstraat,_Helmond.JPG (deur met luifel, sleuf, zij-erker)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Torenstraat,_Helmond_(2).JPG (erker, lijst en console van dichtbij)",
      "PDOK BAG-pand 0794100000353661, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "3D BAG (LoD2.2, AHN5) van pand 0794100000353661: maaiveld 17,05, dak 59,9 tot 63,9 (NAP) ter controle",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,94 m) voor groundHeight",
    ],
  },
});

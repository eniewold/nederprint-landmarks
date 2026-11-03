// Watertoren van Vught aan de Watertorenlaan 7A, op het terrein van de
// psychiatrische inrichting Voorburg (nu Reinier van Arkel), gebouwd in 1903
// naar ontwerp van H.J. van Tulder als bluswatervoorziening van de inrichting;
// rijksmonument 521293, sinds 2005 gerestaureerd en buiten gebruik als
// watertoren. Volgens het register een achtkante bakstenen schacht van circa
// 27 m in drie delen: een naar boven versmallend voetstuk met de ingang, dat
// bovenaan wordt afgesloten door een fries met forse natuurstenen
// diamantkoppen; een hoog middendeel met kleine spleetvensters dat eindigt
// onder een rondboogfries; en een bovenste zone met ronde vensters. Daarop een
// overkragende achtkante kop met verticale houten beschieting om het ijzeren
// reservoir (op 22 m), afgedekt met een laag achtzijdig tentdak.
//
// Oorsprong op het hart van de reservoirkop in het AHN-DSM (het zwaartepunt
// van de BAG-contour van pand 0865100000008150 ligt 0,8 m oostelijker) op
// maaiveld (AHN-DTM NAP +6,05 m). De zijden van de BAG-achthoek staan op
// 11,5 + k·45 graden van RD-oost: lokale +X is de normaal van de oost-
// noordoostgevel (xAxis [cos 11,5°, sin 11,5°]) en de ingang ligt in de gevel
// op -Y (RD -78,5 graden, zuid), waar de BAG-contour de deurnis heeft.
// Hoogtes: AHN-DSM 0,5 m (top NAP +33,96 tot +34,1, dakrand +33,45 op r 2,5)
// voor de kop en het tentdak; de geledingen uit de frontale foto
// "Vught Watertoren 4648" (2006), geschaald op de BAG-breedte van het voetstuk
// (7,1 m over de vlakken = 228 px) en de AHN-dakrand.
import { hull, ring3, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [149332.3, 406058.65];
const DEG = 11.5;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 6.05; // AHN-DTM 5,9 tot 6,25 rond de voet
const GROUND_ELLIPSOID = 49.57; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-03 (49,57 tot 49,87; NAP +6,05 + 43,69)

// Achthoek met de vlakken op 0, 45, ..., 315 graden en apothema a.
const oct = (a) => circle([0, 0], a / Math.cos(Math.PI / 8), 8, Math.PI / 8);
// Rondgaande band: van apothema i naar o onder 45 graden uitkragend, recht tot z1 en weer onder 45 graden terug.
const band = (z0, z1, i, o) =>
  hull([...ring3(oct(i), z0), ...ring3(oct(o), z0 + (o - i)), ...ring3(oct(o), z1), ...ring3(oct(i), z1 + (o - i))]);

const A = {
  foot: 3.55, // plint aan de voet (BAG: 7,1 m over de vlakken)
  plinthFoot: 3.45, // voetstuk boven de plint
  plinthTop: 2.97, // voetstuk bovenaan en de friezone (foto 190 px = 5,9 m)
  shaft: 2.7, // middendeel en bovenste zone (foto 172 px = 5,4 m)
  head: 3.7, // reservoirkop (AHN-DSM: vlakken op 3,6 tot 3,8; foto 220 px)
};
const H = {
  foot: 1.0, // plint van natuursteen (foto 0 tot 1,15 m)
  plinthTop: 7.3, // bovenkant voetstuk
  friezeTop: 8.9, // bovenkant diamantkopfries met lijst
  arcadeFoot: 17.65, // rondboogfries (foto 17,65 tot 18,75) met lijst tot 19,05
  arcadeTop: 19.05,
  skirtFoot: 20.6, // onderkant van de overkragende kop
  headFoot: 21.6,
  eave: 27.2, // dakrand (AHN +33,45 op r 2,5 m, dakhelling 11 graden)
  apex: 28.0, // top van het tentdak (AHN +33,96 tot +34,1 boven maaiveld +6,05)
};

// ---------- voetstuk, friezone en schacht ----------
const body = union([
  // Plint met een afgeschuinde bovenrand (0,1 m onder 45 graden).
  hull([...ring3(oct(A.foot), BASE), ...ring3(oct(A.foot), H.foot), ...ring3(oct(A.plinthFoot), H.foot + 0.1)]),
  // Naar boven versmallend voetstuk.
  hull([...ring3(oct(A.plinthFoot), H.foot), ...ring3(oct(A.plinthTop), H.plinthTop)]),
  // Friezone van de diamantkoppen, afgesloten door twee natuurstenen lijsten.
  prism(oct(A.plinthTop), H.plinthTop - 0.05, H.friezeTop),
  band(7.05, 7.35, A.plinthTop, 3.12),
  band(8.6, H.friezeTop - 0.15, A.plinthTop, 3.12),
  // Middendeel en bovenste zone.
  prism(oct(A.shaft), H.friezeTop - 0.1, H.skirtFoot + 0.05),
  // Rondboogfries met lijst, 0,25 m uit.
  band(H.arcadeFoot, H.arcadeTop - 0.25, A.shaft, 2.95),
]);

// Diamantkoppen: twee per vlak, 0,8 m in het vierkant en 0,25 m uit (onderste piramidevlak 58 graden steil).
const diamond = (c) => {
  const f = A.plinthTop, z = 8.02;
  return hull([[f - 0.05, c - 0.4, z - 0.4], [f - 0.05, c + 0.4, z - 0.4], [f - 0.05, c - 0.4, z + 0.4], [f - 0.05, c + 0.4, z + 0.4], [f + 0.25, c, z]]);
};
const diamonds = Array.from({ length: 8 }, (_, k) => [-0.6, 0.6].map((c) => place(diamond(c), { deg: 45 * k }))).flat();

// ---------- overkragende reservoirkop en tentdak ----------
const head = union([
  // Kop met een onderzijde onder 45 graden van de schacht naar de beschieting.
  hull([...ring3(oct(A.shaft), H.skirtFoot), ...ring3(oct(A.head), H.headFoot), ...ring3(oct(A.head), H.eave - 0.2)]),
  // Onderrand van de beschieting en de dakrand, 0,12 en 0,15 m uit.
  band(H.headFoot, 22.1, A.head, 3.82),
  hull([...ring3(oct(A.head), H.eave - 0.3), ...ring3(oct(3.85), H.eave - 0.15), ...ring3(oct(3.85), H.eave)]),
  // Laag achtzijdig tentdak.
  hull([...ring3(oct(3.85), H.eave - 0.05), [0, 0, H.apex]]),
]);

// ---------- nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f, midden op y = c.
const niche = (f, w, z0, z1, depth = 0.3, c = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = c - w / 2, y1 = c + w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
// Ronde vensters in de bovenste zone: één per vlak, als nis van 0,9 m.
const oculi = Array.from({ length: 8 }, (_, k) => place(niche(A.shaft, 0.9, 19.5, 20.25, 0.25), { deg: 45 * k }));
// Ingang aan de voorzijde (-Y): deur met bovenlicht in een nis van 1,35 m breed en 0,5 m diep (BAG-contour), top op 3,05 m.
const door = place(niche(A.plinthFoot, 1.35, 0, 3.05, 0.5), { deg: 270 });

const tower = union([body, ...diamonds, head]).subtract(union([...oculi, door]));

await writeLandmark({
  slug: "watertoren-vught",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:achtkante-schacht-en-reservoirkop", tower]],
  catalog: {
    name: "Watertoren Vught",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6, 0], [-6, 0], [0, 6], [0, -6]],
    // Ellipsoïdisch: de PDOK-terreinhoogte rond de voet (NAP +6,05 plus de geoïdehoogte).
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0865100000008150"],
    description:
      "Oorsprong op het hart van de reservoirkop uit het AHN-DSM op maaiveld (NAP +6,05 m), +X de normaal van de oost-noordoostgevel (RD 11,5 graden), ingang op -Y. Achtkant voetstuk met plint dat van 7,1 naar 5,9 m over de vlakken versmalt tot 7,3 m, fries met zestien diamantkoppen tussen twee lijsten tot 8,9 m, schacht van 5,4 m met rondboogfries op 17,65 tot 19,05 m en acht ronde vensters, een overkragende achtkante reservoirkop van 7,4 m vanaf 20,6 m met onderrand en dakrand, en een laag tentdak tot 28,0 m; de deur in een nis aan de voorzijde. Maten uit AHN, BAG, register en foto's.",
    realWorld: {
      registerHeightM: 27,
      reservoirHeightM: 22,
      built: 1903,
      architect: "H.J. van Tulder",
      monument: 521293,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 34.0,
      plinthAcrossFlatsM: A.foot * 2,
      plinthTopAcrossFlatsM: A.plinthTop * 2,
      shaftAcrossFlatsM: A.shaft * 2,
      headAcrossFlatsM: A.head * 2,
      plinthTopM: H.plinthTop,
      friezeTopM: H.friezeTop,
      arcadeM: [H.arcadeFoot, H.arcadeTop],
      headFootM: H.skirtFoot,
      eaveM: H.eave,
      apexM: H.apex,
      minimumPartM: 0.8,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Vught)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/521293 (achtkante schacht in drie delen, diamantkopfries, rondboogfries, ronde vensters, overkragende beschoten kop, circa 27 m)",
      "https://commons.wikimedia.org/wiki/File:Vught_Watertoren_4648.JPG (2006, frontaal op de ingang: geledingen en breedtes)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_bij_krankzinnigeninstituut_-_Vught_-_20347871_-_RCE.jpg en File:Voorburg_watertoren.JPG (opstand en tentdak)",
      "PDOK BAG-pand 0865100000008150, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-03",
    ],
  },
});

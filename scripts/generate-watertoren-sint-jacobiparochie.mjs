// Watertoren van Sint Jacobiparochie (A.P. Wesselman van Helmond, 1957), 41 m
// met een reservoir van 515 m³, gelijk aan de toren van Nes bij Akkrum. Sinds
// 2024 hotel Wad Hoog: twee suites in het reservoir met tien hoge ramen, en drie
// kamers in een zwevende ring om de voet, op circa 3 m hoogte en aan de
// voorzijde open, zodat de deur en de trap vrij blijven.
// Oorsprong op het hart van de toren op maaiveld (NAP +0,6 m), assen in
// RD-richting: het midden van de reservoirschijf in het AHN (13,8 m met
// randbloei) en van de ronde BAG-contour van de ring vallen binnen 0,2 m samen.
// De BAG-contour (266 m²) is de ring, niet de toren: een driekwart twaalfhoek
// met de open hoek naar het noordwesten.
// Hoogtes en stralen uit de frontale telefoto RCE 20423047, geschaald op de
// reservoirbreedte (13,5 m, 17,2 px/m); daarmee komt de lantaarn op 40,6 m, het
// hoogste punt in het AHN. De ring uit de bouwtekeningen (achtergevel en
// voorgevel 1:200 in het bestemmingsplan, geschaald op het reservoir), de
// luchtfoto (twaalfhoek) en de BAG (open hoek). Het reservoirdak geeft in het AHN
// spiegelreflecties (natte bitumen); de bovenkant komt daarom uit de foto.
import { Manifold, CrossSection, hull, ring3, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [169632.42, 587096.22];
const AXIS = [1, 0];
const BASE = -0.3;
const DOOR = 132; // deur en trap naar het noordwesten, midden in de open hoek van de ring
const H = {
  plinthEdge: 0.25, // roodpaarse sokkel: korte rechte rand, dan schuin
  plinth: 0.9,
  footRing: 1.66, // voetring van blokken onder de lisenen
  landing: 1.85, // bordes voor de deur
  collarFoot: 28.3, // kraag onder het reservoir, schuin aangezet
  collar: 29.45,
  tankFoot: 29.35, // nagenoeg vlakke onderkant
  rollFoot: 29.85,
  rollTop: 30.85, // ronde onderrand
  lipFoot: 37.15,
  lip: 37.65, // dakrand en plat dak
  lanternTop: 40.2,
  capTop: 40.6,
  ringFoot: 3.15, // zwevende ring met kamers
  ringTop: 7.0,
};
const R = { plinthFoot: 4.65, plinthTop: 3.4, footRing: 3.3, shaft: 3.07, collar: 3.35, underside: 5.9, tank: 6.75, lip: 6.85, lantern: 1.35, cap: 1.5, ringIn: 5.1, ringOut: 10.5 };
const rad = (deg) => (deg * Math.PI) / 180;
// Regelmatige n-hoek met apothema a en het midden van een vlak op richting deg.
const ngon = (a, n, deg) => circle([0, 0], a / Math.cos(Math.PI / n), n, rad(deg) + Math.PI / n);

// ---------- sokkel, voetring, schacht met zestien lisenen en kraag ----------
const plinth = Manifold.revolve(new CrossSection([[[0, BASE], [R.plinthFoot, BASE], [R.plinthFoot, H.plinthEdge], [R.plinthTop, H.plinth], [0, H.plinth]]]), 64);
const shaftPts = ngon(R.shaft, 16, DOOR);
const footRing = hull([...ring3(ngon(R.footRing, 16, DOOR), H.plinth - 0.05), ...ring3(ngon(R.footRing, 16, DOOR), H.footRing)]);
const shaft = hull([...ring3(shaftPts, H.footRing - 0.05), ...ring3(shaftPts, H.collarFoot + 0.05)]);
// Kraag: 0,28 m breder dan de schacht, met een onderkant van 56 graden.
const collar = hull([...ring3(shaftPts, H.collarFoot), ...ring3(ngon(R.collar, 16, DOOR), H.collarFoot + 0.42), ...ring3(ngon(R.collar, 16, DOOR), H.collar)]);

// ---------- reservoir als omwentelingsprofiel ----------
const roll = Array.from({ length: 6 }, (_, k) => {
  const t = ((k + 1) / 7) * (Math.PI / 2);
  return [R.underside + (R.tank - R.underside) * Math.sin(t), H.rollTop - (H.rollTop - H.rollFoot) * Math.cos(t)];
});
const tank = Manifold.revolve(
  new CrossSection([[
    [0, H.tankFoot], [R.collar - 0.05, H.tankFoot], [R.underside, H.rollFoot], ...roll, [R.tank, H.rollTop],
    [R.tank, H.lipFoot], [R.lip, H.lipFoot + 0.15], [R.lip, H.lip], [0, H.lip],
  ]]),
  96,
);

// ---------- glazen achtkante lantaarn met kap ----------
const lantern = union([
  hull([...ring3(ngon(R.lantern, 8, 0), H.lip - 0.05), ...ring3(ngon(R.lantern, 8, 0), H.lanternTop)]),
  hull([...ring3(ngon(R.lantern, 8, 0), H.lanternTop - 0.05), ...ring3(ngon(R.cap, 8, 0), H.lanternTop + 0.17), ...ring3(ngon(R.cap, 8, 0), H.capTop)]),
]);

// ---------- bordes en trap naar de deur ----------
// Open stalen trap als volle wig van 1,2 m breed (37 graden), het bordes op 1,85 m.
const stair = place(
  hull([
    [3.0, -0.6, BASE], [6.3, -0.6, BASE], [3.0, 0.6, BASE], [6.3, 0.6, BASE],
    [3.0, -0.6, H.landing], [3.9, -0.6, H.landing], [3.0, 0.6, H.landing], [3.9, 0.6, H.landing],
    [6.3, -0.6, 0.0], [6.3, 0.6, 0.0],
  ]),
  { deg: DOOR },
);

// ---------- zwevende ring met kamers ----------
// Twaalfhoek (vlakken op 8 + k·30 graden, luchtfoto), binnen rond op 5,1 m (de
// boog in de BAG-contour), open in het noordwesten tussen het eindvlak x = 0,36
// en de lijn langs het westelijke eindvlak (BAG). Draagt op de liftkern aan de
// achterkant; de dunne stalen schoren naar de sokkel zijn weggelaten.
const ringOuter = ngon(R.ringOut, 12, 8);
const ringSolid = prism(ringOuter, H.ringFoot, H.ringTop).subtract(prism(circle([0, 0], R.ringIn, 64), H.ringFoot - 1, H.ringTop + 1));
const westEnd = (x) => 0.674 + 0.2089 * (x + 5.078);
const notch = prism([[0.36, westEnd(0.36)], [0.36, 20], [-20, 20], [-20, westEnd(-20)]], H.ringFoot - 1, H.ringTop + 1);
const ring = ringSolid.subtract(notch);
const liftCore = place(prism([[4.4, -0.8], [6.6, -0.8], [6.6, 0.8], [4.4, 0.8]], BASE, H.ringFoot + 0.05), { deg: DOOR + 180 });

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const RING_WINDOWS = [218, 248, 278, 308, 338, 8, 38, 68]; // de volle vlakken van de ring
const cuts = [
  place(niche(R.shaft, 1.0, H.landing, 4.2, 0.3), { deg: DOOR }), // deur boven het bordes
  // Tien hoge ramen rondom het reservoir (hotelsuites), symmetrisch om de deur.
  ...Array.from({ length: 10 }, (_, k) => place(niche(R.tank, 1.0, 33.2, 36.4, 0.3), { deg: DOOR + 18 + k * 36 })),
  // Eén raam per vol vlak van de ring.
  ...RING_WINDOWS.map((deg) => place(niche(R.ringOut, 2.0, 3.9, 6.2, 0.3), { deg })),
];

await writeLandmark({
  slug: "watertoren-sint-jacobiparochie",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:sokkel-schacht-reservoir-lantaarn-en-ring", union([plinth, footRing, shaft, collar, tank, lantern, stair, ring, liftCore]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Sint Jacobiparochie",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    replacesBuildings: ["NL.IMBAG.Pand.0063100000001159"],
    description:
      "Oorsprong op het hart van de toren op maaiveld (NAP +0,6 m), assen in RD-richting. Roodpaarse sokkel van 9,3 m, schacht met zestien lisenen (6,14 m over de vlakken) tot de kraag op 29,45 m, reservoir van 13,5 m met nagenoeg vlakke onderkant, ronde onderrand, tien hoge hotelramen en dakrand op 37,65 m, achtkante glazen lantaarn tot 40,6 m. Deur en trap naar het noordwesten. Rond de voet een zwevende twaalfhoekige ring met kamers (21 m, van 3,15 tot 7,0 m) op een liftkern, open aan de voorzijde. Maten uit AHN, BAG, luchtfoto, een RCE-foto en de bouwtekeningen.",
    realWorld: {
      publishedHeightM: 41,
      reservoirM3: 515,
      ahnGroundNapM: 0.6,
      ahnTopNapM: 41.03,
      ahnTankDiameterM: 13.8,
      tankDiameterM: 13.5,
      plinthDiameterM: 9.3,
      shaftAcrossFlatsM: 6.14,
      collarM: 29.45,
      tankRollTopM: 30.85,
      roofM: 37.65,
      modelTopM: 40.6,
      ringAcrossFlatsM: 21.0,
      ringFloorM: 3.15,
      ringRoofM: 7.0,
      photoScalePxPerM: 17.16,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Sint_Jacobiparochie)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Sint_Jacobiparochie_-_20423047_-_RCE.jpg (frontale telefoto, maten)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Sint_Jacobiparochie_-_20423059_-_RCE.jpg (deur en trap)",
      "https://ruimtelijkeplannen.nl/ bestemmingsplan NL.IMRO.1949.BPStjGvSwiestr23-VAS1, toelichting en figuur 2.3 (ring op circa 3 m, gevels 1:200)",
      "https://wadhoog.nl/ (foto na de verbouwing: ramen in het reservoir)",
      "PDOK BAG-pand 0063100000001159, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

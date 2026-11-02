// Watertoren aan de Speelhuislaan in Breda (Belcrum), 1934-1935, ontwerp van
// P.A.H. Hornix (directeur Gemeentewerken) en J.H.J. Op den Oord, rijksmonument
// 519041. Ronde toren met een betonskelet bekleed met roodpaarse handvormsteen:
// een schacht met smalle vensters, een rondgaande galerij (belvedère) met ronde
// vensters onder de lekvloer, een iets bredere reservoirtrommel met vijftien
// verdiepte verticale stroken en een licht kegelvormig dak met een koperen
// lantaarn van drie overstekende schijven. Voor de zuidgevel een plat afgedekt
// trappenhuis met een ronde oosthoek, één hoog strookvenster en drie ronde
// vensters, en ten westen daarvan de lage ingangsaanbouw met de rondboogdeur.
// Oorsprong op het hart van de toren op maaiveld (NAP +2,35 m): het midden van
// de lantaarn in het AHN en van het ronde deel van de BAG-contour vallen binnen
// 0,1 m samen. +X loopt langs de voorgevel van trappenhuis en aanbouw (de rechte
// zuidrand van de BAG-contour, -6,9 graden van RD-oost), -Y is de voorkant.
// Hoogtes van dak, lantaarn en trappenhuis uit het AHN, stralen uit het AHN en
// de BAG, verhoudingen en hoogtes van galerij, belvedère en vensters uit de
// frontale foto "Breda Belcrumwatertoren 2024-08-17" (trommel 976 px = 16,9 m).
import { Manifold, CrossSection, hull, ring3, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [112199.1, 401506.4];
const DEG = -6.9; // voorgevel van het trappenhuis ten opzichte van RD-oost
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(4), +Math.sin((DEG * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 2.35; // AHN-DTM rond de voet (2,25 tot 2,41)
const GROUND_N = 43.96; // NLGEO2018-geoïdehoogte op de oorsprong
const H = {
  annex: 3.9, // plat dak van de ingangsaanbouw
  gallerySoffit: 17.13, // aanzet van de schuine onderkant van de galerij op de schacht
  galleryEdge: 18.8, // onderkant van de rechte rand
  gallery: 19.3, // vloer van de galerij
  drumSoffit: 21.0, // aanzet van de schuine onderrand van de trommel op de belvedère
  drum: 22.1, // volle breedte van de trommel (reservoirvloer 22,81 m volgens het register)
  stair: 26.65, // plat dak van het trappenhuis (AHN 26,6 tot 26,7)
  grooveFoot: 27.0, // onderkant van de verdiepte stroken in de trommel
  rim: 33.65, // dakrand (AHN 33,73 op 7,5 m uit het hart)
  roofTop: 34.15, // dak aan de voet van de lantaarn (AHN 34,11 op 3,5 m)
  discs: [35.7, 37.0, 38.3], // bovenkant van de drie schijven (AHN 38,27 op 2 m)
  capTop: 38.8, // bolle top van de bovenste schijf (AHN 38,77 op 1 m)
  mastStub: 39.8, // voet van de mast (AHN 39,77 in het hart)
};
const R = {
  shaft: 7.55, // schacht, 0,90 keer de trommel op de frontale foto
  gallery: 8.95, // galerij, 1,068 keer de trommel
  belvedere: 7.45, // terugliggende wand van de belvedère
  drum: 8.4, // trommel (Wikipedia 17 m; AHN-dakrand 8,3 tot 8,5; ronde BAG-contour 8,21)
  roofTop: 2.9,
  glass: 2.3, // glazen ring van de lantaarn
  disc: 2.85, // overstekende schijven (AHN 2,96 bij 27,5 m²)
  mast: 0.45,
};
const SEG = 96;
const rad = (deg) => (deg * Math.PI) / 180;
const revolve = (profile, n = SEG) => Manifold.revolve(new CrossSection([profile]), n);
const cylinder = (r, z0, z1, n = SEG) => prism(circle([0, 0], r, n), z0, z1);

// ---------- schacht, galerij, belvedère en trommel ----------
// Eén omwentelingsprofiel (straal, hoogte) van de voet tot de dakrand en het dak.
const tower = revolve([
  [0, BASE],
  [R.shaft, BASE],
  [R.shaft, H.gallerySoffit],
  [R.gallery, H.galleryEdge], // galerij op een kraag van 50 graden
  [R.gallery, H.gallery],
  [R.belvedere, H.gallery],
  [R.belvedere, H.drumSoffit],
  [R.drum, H.drum], // schuine onderrand van de trommel, 49 graden
  [R.drum, H.rim],
  [R.roofTop, H.roofTop], // licht kegelvormig dak, 5 graden
  [0, H.roofTop],
]);

// ---------- lantaarn: glazen ring met drie overstekende schijven en de mastvoet ----------
const lantern = union([
  cylinder(R.glass, H.roofTop - 0.2, H.discs[2]),
  ...H.discs.map((z) =>
    revolve([[0, z - 0.85], [R.glass, z - 0.85], [R.disc, z - 0.25], [R.disc, z], [0, z]], 64),
  ),
  revolve([[0, H.discs[2] - 0.05], [R.disc, H.discs[2] - 0.05], [R.disc, H.discs[2]], [R.mast, H.capTop], [0, H.capTop]], 64),
  cylinder(R.mast, H.capTop - 0.05, H.mastStub, 24),
]);

// ---------- trappenhuis en ingangsaanbouw voor de zuidgevel ----------
// Voorgevel op y = -9,27 (BAG), van x = -2,4 (aanbouw, ronde westhoek r 0,8) tot de
// halfronde oostkop (middelpunt [7,7, -7,6], r 1,67); grens aanbouw/trappenhuis op x = 0,9.
const FRONT = -9.27;
const STAIR_X0 = 0.9;
const END = [7.7, -7.6];
const END_R = 1.67;
const stairPlan = [[STAIR_X0, FRONT], [STAIR_X0, -3.5], [6.3, -3.5], ...circle(END, END_R, 48)];
const stairTower = hull([...ring3(stairPlan, BASE), ...ring3(stairPlan, H.stair)]);
const annexPlan = [[-1.6, FRONT], [STAIR_X0 + 0.1, FRONT], [STAIR_X0 + 0.1, -5.5], [-2.4, -5.5], ...circle([-1.6, FRONT + 0.8], 0.8, 24)];
const annex = hull([...ring3(annexPlan, BASE), ...ring3(annexPlan, H.annex)]);

// ---------- nissen ----------
// Nis in het vlak met normaal +X op afstand f, met een veelhoek (y, z) als opening;
// het plafond loopt naar binnen onder 56 graden op (achterkant 1,5 × diepte lager).
const niche = (f, poly, depth = 0.3) => {
  const top = Math.max(...poly.map(([, z]) => z));
  return hull([
    ...poly.map(([y, z]) => [f + 1.0, y, z]),
    ...poly.map(([y, z]) => [f, y, z]),
    ...poly.map(([y, z]) => [f - depth, y, Math.min(z, top - 1.5 * depth)]),
  ]);
};
const rectWin = (w, z0, z1) => [[-w / 2, z0], [w / 2, z0], [w / 2, z1], [-w / 2, z1]];
const roundWin = (d, zc) => circle([0, zc], d / 2, 16).map(([y, z]) => [y, z]);
// Rondboog als spitsboog van 55 graden (printbaar).
const archWin = (w, z0, zs) => [[-w / 2, z0], [w / 2, z0], [w / 2, zs], [0, zs + (w / 2) * Math.tan(rad(55))], [-w / 2, zs]];
// Richting θ gemeten van -Y (de voorkant) naar +X; place() draait +X naar die richting.
const around = (m, theta) => place(m, { deg: theta - 90 });
// Op de voorgevel (normaal -Y) op x = s.
const onFront = (m, s) => place(m, { deg: -90, at: [s, 0, 0] });

// Smalle vensters in de schacht, drie rijen, en ronde vensters in de belvedère, om de
// 45 graden vanaf θ = -32,5 (foto's); niet waar trappenhuis of aanbouw ervoor staan.
const AZ = Array.from({ length: 8 }, (_, k) => -32.5 + 45 * k).filter((t) => !(t > -5 && t < 75));
const ROWS = [[4.8, 6.9], [9.7, 11.8], [14.6, 16.6]];
// Vijftien verdiepte stroken in de trommel, om de 24 graden vanaf θ = -8 (foto), tot de dakrand.
const GROOVES = Array.from({ length: 15 }, (_, k) => -8 + 24 * k);
const cuts = [
  ...AZ.flatMap((t) => ROWS.map(([z0, z1]) => around(niche(R.shaft, rectWin(0.5, z0, z1)), t))),
  ...AZ.map((t) => around(niche(R.belvedere, roundWin(1.1, 20.15), 0.3), t)),
  ...GROOVES.map((t) => around(prism([[R.drum - 0.3, -0.25], [R.drum + 1, -0.25], [R.drum + 1, 0.25], [R.drum - 0.3, 0.25]], H.grooveFoot, H.rim + 1), t)),
  // Trappenhuis: hoog strookvenster, drie ronde vensters op belvedèrehoogte, twee liggende vensters onderin.
  onFront(niche(-FRONT, rectWin(0.9, 4.5, 18.0)), 3.97),
  ...[2.2, 3.95, 5.7].map((s) => onFront(niche(-FRONT, roundWin(1.2, 20.3)), s)),
  onFront(niche(-FRONT, rectWin(2.5, 0.9, 2.0)), 4.35),
  onFront(niche(-FRONT, rectWin(1.4, 0.9, 2.0)), 6.9),
  // Ingangsaanbouw: stalen rondboogdeuren.
  onFront(niche(-FRONT, archWin(1.9, BASE + 0.3, 1.9), 0.35), -0.4),
];

const body = union([tower, lantern, stairTower, annex]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-breda-speelhuislaan",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-galerij-trommel-lantaarn-en-trappenhuis", body]],
  catalog: {
    name: "Watertoren Speelhuislaan",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch maaiveld: NAP +2,35 m plus de NLGEO2018-geoïdehoogte 43,96 m op de oorsprong.
    groundHeight: +(GROUND_NAP + GROUND_N).toFixed(2),
    groundSamplePoints: [[10.5, 0], [0, 10.5], [-10.5, 0], [-4, -11], [5, -11.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0758100000050726"],
    description:
      "Oorsprong op het hart van de ronde toren op maaiveld (NAP +2,35 m), +X langs de voorgevel van het trappenhuis (-6,9 graden van RD-oost), voorkant naar -Y (zuid). Schacht van 15,1 m met drie rijen smalle vensters, galerij van 17,9 m op 19,3 m op een schuine kraag, belvedère met ronde vensters, reservoirtrommel van 16,8 m vanaf 22,1 m met vijftien verdiepte stroken tot de dakrand op 33,65 m, licht kegelvormig dak en een lantaarn met drie overstekende schijven tot 38,8 m en de mastvoet tot 39,8 m. Trappenhuis met ronde oostkop tot 26,65 m en lage ingangsaanbouw met rondboogdeur voor de zuidgevel. Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 41.8,
      registerHeightM: 39.3,
      reservoirM3: 1200,
      reservoirFloorM: 22.81,
      ahnGroundNapM: GROUND_NAP,
      ahnRimNapM: 36.08,
      ahnLanternTopNapM: 41.12,
      ahnMastBaseNapM: 42.12,
      geoidNlgeo2018M: GROUND_N,
      shaftDiameterM: 2 * R.shaft,
      galleryDiameterM: 2 * R.gallery,
      drumDiameterM: 2 * R.drum,
      bagCircleRadiusM: 8.21,
      lanternDiscDiameterM: 2 * R.disc,
      galleryM: H.gallery,
      drumM: H.drum,
      stairTowerM: H.stair,
      rimM: H.rim,
      modelTopM: H.mastStub,
      photoScalePxPerM: 57.8,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Breda_Speelhuislaan)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/519041",
      "https://commons.wikimedia.org/wiki/File:Breda_Belcrumwatertoren_2024-08-17.jpg (frontaal op het trappenhuis: verhoudingen, galerij, stroken, lantaarn)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_zuidzijde_-_Breda_-_20534450_-_RCE.jpg (zuidzijde, trappenhuis en ingang)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_noordoostzijde_-_Breda_-_20534416_-_RCE.jpg (noordoostzijde, vensterrijen)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_zuidoostzijde_-_Breda_-_20534413_-_RCE.jpg (ronde oostkop van het trappenhuis)",
      "PDOK BAG-pand 0758100000050726, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
    ],
  },
});

// Watertoren van Oude Pekela (H.F. Mertens, 1938), rijksmonument 520988,
// Winschoterweg 12, reservoir van 1000 m³, sinds 2016 een woning. Een
// achtkante bakstenen schacht waarvan de vlakken op 32,7 m eindigen onder een
// gebogen betonnen luifel; daarboven springt elk vlak terug tot de ronde
// reservoirwand en lopen de acht hoeken als penanten door tot witte stenen
// kappen op 36,5 m. De ronde wand gaat door tot een witte daklijst op 45,75 m,
// met een teruggelegen ronde opbouw met deklijst tot 47,45 m. In elk vlak een
// kolom smalle vensters en een rond venster, boven elke penant nog een venster
// in de ronde wand; deur en twee grote vensters aan de kant van de weg.
// Oorsprong op het hart van de ronde wand in het AHN (de BAG-contour is grof:
// acht punten op de hoeken, ertussen bochten) op maaiveld (NAP +1,17 m), assen
// in RD-richting. Hoeken van de achthoek op 30,5 + k·45 graden (BAG-pieken en
// AHN-sectoren). Maaiveld en hoogtes van dak (47,45) en daklijst (45,75) uit het
// AHN; overige hoogtes en breedtes uit de RCE-foto 20365171 (vanuit het
// zuidwesten, recht op het vlak met de grote benedenvensters, 12,07 px/m,
// geschaald op het dak in het AHN).
import { Manifold, CrossSection, hull, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [264469.0, 570703.35];
const AXIS = [1, 0];
const BASE = -0.3;
const SEG = 120;
const CORNER = 30.5; // graden linksom van RD-oost, dan elke 45
const FACE = CORNER - 22.5; // normaal van het eerste vlak (8 graden), dan elke 45
const FRONT = 233; // vlak naar de weg in het zuidwesten (grote benedenvensters)
const DOOR = FRONT - 45; // deur in het vlak links daarvan (west)
const SIDE = FRONT + 45; // venster in het vlak rechts daarvan (zuid)
const H = {
  ledge: 32.7, // bovenkant van de vlakken en van de gebogen luifel
  canopyUnder: 32.4, // onderkant van de luifel aan de voorrand
  capFoot: 35.4, // onderkant van de witte kap op de penanten
  cap: 36.5, // bovenkant van de penanten
  coping: 45.35, // onderkant van de witte daklijst
  roof: 45.75, // plat dak rond de opbouw (AHN)
  drumCoping: 47.15,
  top: 47.45, // dak van de opbouw (AHN)
};
const R = { apothem: 7.25, wall: 6.85, canopy: 7.6, cap: 7.35, coping: 6.97, drum: 5.9, drumCoping: 6.0 };
const PIER = 1.0; // breedte van een penant langs elk vlak, vanaf de hoek
const half = R.apothem * Math.tan(Math.PI / 8); // halve zijde, 3,0 m
const RECESS = half - PIER; // halve breedte van de terugsprong boven de luifel, 2,0 m
const t56 = Math.tan((56 * Math.PI) / 180);

// Regelmatige achthoek met apothema a, zijden loodrecht op de normalen FACE + k·45.
const oct = (a) => circle([0, 0], a / Math.cos(Math.PI / 8), 8, (CORNER * Math.PI) / 180);
// Per vlak een blok in het vlak met normaal +X (lokaal), op de vlaknormalen gezet.
const perFace = (m) => union(Array.from({ length: 8 }, (_, k) => place(m, { deg: FACE + k * 45 })));

// ---------- achtkante schacht, penanten met kappen ----------
const shaft = prism(oct(R.apothem), BASE, H.capFoot);
// Kap: 0,1 m buiten de penant, de onderkant onder 56 graden.
const capDrop = (R.cap - R.apothem) * t56;
const caps = hull([...oct(R.apothem).map(([x, y]) => [x, y, H.capFoot - capDrop]), ...oct(R.cap).map(([x, y]) => [x, y, H.capFoot]), ...oct(R.cap).map(([x, y]) => [x, y, H.cap])]);
// Boven de luifel springt het midden van elk vlak terug tot de ronde wand.
const recess = perFace(Manifold.cube([3.5, 2 * RECESS, H.cap + 1 - H.ledge]).translate([5.5, -RECESS, H.ledge]));
const wall = Manifold.revolve(new CrossSection([[[0, BASE], [R.wall, BASE], [R.wall, H.coping], [0, H.coping]]]), SEG);

// ---------- gebogen luifels in de terugsprongen ----------
// Een ring met voorrand r 7,6 (in het midden 0,35 m voor het vlak) en een onderkant onder 56 graden naar het vlak.
const canopyRing = Manifold.revolve(
  new CrossSection([[[R.wall - 0.2, H.canopyUnder - (R.canopy - R.apothem + 0.05) * t56], [R.apothem - 0.05, H.canopyUnder - (R.canopy - R.apothem + 0.05) * t56], [R.canopy, H.canopyUnder], [R.canopy, H.ledge], [R.wall - 0.2, H.ledge]]]),
  SEG,
);
const canopies = canopyRing.intersect(perFace(Manifold.cube([3.5, 2 * RECESS, 3]).translate([5.5, -RECESS, H.canopyUnder - 2])));

// ---------- daklijst en opbouw ----------
const top = Manifold.revolve(
  new CrossSection([[
    [0, H.coping - 1], [R.wall - 0.1, H.coping - 1], [R.wall, H.coping - (R.coping - R.wall) * t56], [R.coping, H.coping], [R.coping, H.roof], [R.drum, H.roof],
    [R.drum, H.drumCoping - 0.1 * t56], [R.drumCoping, H.drumCoping], [R.drumCoping, H.top], [0, H.top],
  ]]),
  SEG,
);

// ---------- vensters en deur als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f (Drachten).
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Rond venster: een cirkel die naar binnen onder 56 graden oploopt, zodat ook de bovenkant geen vlak plafond heeft.
const roundWindow = (f, d, zc, depth = 0.3) => {
  const ring = (x, dz) => circle([0, zc + dz], d / 2, 24).map(([t, z]) => [x, t, z]);
  return hull([...ring(f - depth, 1.5 * depth), ...ring(f, 0), ...ring(f + 1.0, -1.5)]);
};
const SLIT = 0.4;
const faceSlits = [[7.1, 9.2], [13.0, 15.1], [18.6, 20.8], [29.9, 31.8]]; // kolom in elk vlak, de bovenste net onder de luifel
const cuts = [
  ...faceSlits.map(([z0, z1]) => perFace(niche(R.apothem, SLIT, z0, z1))),
  perFace(roundWindow(R.apothem, 1.5, 25.6)),
  perFace(niche(R.wall, SLIT, 34.9, 37.1, 0.25)), // in de terugsprong boven de luifel
  union(Array.from({ length: 8 }, (_, k) => place(niche(R.wall, SLIT, 40.6, 42.3, 0.25), { deg: CORNER + k * 45 }))), // boven elke penant
  place(niche(R.apothem, 1.6, 1.1, 3.8, 0.35), { deg: FRONT }), // groot venster naar de weg
  place(niche(R.apothem, 1.2, 1.1, 3.8, 0.35), { deg: SIDE }),
  place(niche(R.apothem, 1.2, 0, 3.6, 0.4), { deg: DOOR }), // deur
];

const tower = union([shaft.add(caps).subtract(recess), wall, canopies, top]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-oude-pekela",
  base: BASE,
  // Eén node: de export vult elke node apart op; een losse kop zou een eigen voet krijgen.
  nodes: [["building:achtkante-schacht-met-penanten-reservoir-en-opbouw", tower]],
  catalog: {
    name: "Watertoren Oude Pekela",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9.4, 0], [-9.4, 0], [0, 9.4], [0, -9.4]],
    // Ellipsoïdisch maaiveld: NAP +1,17 m plus de NLGEO2018-geoïdehoogte 40,97 m op de oorsprong.
    groundHeight: 42.14,
    replacesBuildings: ["NL.IMBAG.Pand.0765100000002849"],
    description:
      "Oorsprong op het hart van de ronde wand in het AHN op maaiveld (NAP +1,17 m), assen in RD-richting. Achtkante schacht (14,5 m over de vlakken, hoeken op 30,5 + k·45 graden) tot 32,7 m met in elk vlak een kolom smalle vensters en een rond venster; daarboven springt elk vlak onder een gebogen luifel terug tot de ronde wand van 13,7 m en lopen de hoeken als penanten door tot witte kappen op 36,5 m; ronde wand met vensters boven de penanten tot de daklijst op 45,75 m, teruggelegen opbouw van 11,8 m tot 47,45 m. Deur en twee grote vensters naar de weg in het zuidwesten. Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 48,
      reservoirM3: 1000,
      built: 1938,
      ahnGroundNapM: 1.17,
      ahnRoofNapM: 48.62,
      ahnCopingNapM: 46.94,
      shaftAcrossFlatsM: 14.5,
      wallDiameterM: 13.7,
      drumDiameterM: 11.8,
      pierWidthAlongFaceM: 1.0,
      ledgeM: 32.7,
      pierCapM: [35.4, 36.5],
      copingM: 45.75,
      modelTopM: 47.45,
      photoScalePxPerM: 12.07,
      geoidHeightM: 40.97,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Oude_Pekela)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Oude_Pekela_-_20365171_-_RCE.jpg (vanuit het zuidwesten, maten)",
      "https://commons.wikimedia.org/wiki/File:Oude_Pekela_Watertoren_2006.JPG (penanten, kappen, luifels, vensters)",
      "https://commons.wikimedia.org/wiki/File:Oude_Pekela_-_watertoren.JPG (luifels en terugsprongen in de zon)",
      "https://commons.wikimedia.org/wiki/File:2013_Watertoren.jpg (deur en benedenvensters)",
      "PDOK BAG-pand 0765100000002849, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
      "NLGEO2018-geoïdehoogte op de oorsprong (40,97 m) voor groundHeight",
    ],
  },
});

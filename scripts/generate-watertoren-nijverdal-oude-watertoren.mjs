// Oude watertoren van Nijverdal aan de P.C. Stamstraat (nr. 2d), gebouwd in 1912 voor het proceswater van de
// Nederlandsche Stoomblekerij (later Koninklijke Ten Cate); rijksmonument 512248. Volgens het register een betonskelet
// met een cilindrisch reservoir van het type Intze: een vierkant betonnen gebouwtje van één bouwlaag met een plat dak en
// een overstekende goot (een dubbele deur en drie vensters met een boogje) omsluit de voet; daarboven staan acht
// betonnen poten, halverwege met koppelbalken verbonden, rond een standpijp. De poten lopen licht naar binnen en dragen de
// kegelvormige bodem van het reservoir; de uitkragende cilindrische mantel heeft acht lisenen op een waterlijst, smalle
// gietijzeren rondboogvensters en een lijst langs de dakrand. Aan één kant loopt een ijzeren wenteltrap omhoog.
//
// Oorsprong op het hart van het vierkante BAG-pand 0163100000533903 (5,25 × 5,25 m, het gebouwtje aan de voet; het
// reservoir ligt er in het AHN-DSM binnen 0,3 m boven) op maaiveld NAP +9,3 (AHN-DTM in een ring van 4 tot 8 m: 9,15 tot
// 9,8, mediaan 9,29). +X loopt langs de gevels van het gebouwtje, 6,5 graden linksom van RD-oost (BAG); +Y wijst naar
// het noorden, naar de P.C. Stamstraat. De poten en lisenen staan op 0 + 45k graden, de vensters ertussen.
// Hoogtes: AHN-DSM 0,5 m (dak van het reservoir NAP +25,55 aan de rand tot +25,65 in het midden, dus 16,35 m boven
// maaiveld; buitenrand straal 2,6 tot 2,75 m). Geledingen uit de foto "Exterieur OVERZICHT WATERTOREN - Nijverdal - 20297259 - RCE"
// (waterpas, 39 px/m geschaald op de AHN-hoogte), breedtes uit die foto en "Nijverdal Watertoren 8314".
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [229174.472, 485970.391];
const DEG = 6.5;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 9.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06 met de terreintegels van de
// export: noord 52,32 (stoep langs de straat), oost 52,35, zuid 52,55, west 52,65.
const GROUND_ELLIPSOID = 52.32;
const SEG = 64;
const C22 = Math.cos(Math.PI / 8);

// ---------- maten (meters boven maaiveld NAP +9,3) ----------
const HALF = 2.625; // gebouwtje aan de voet (BAG 5,25 m)
const H = {
  eave: 2.75, // onderkant van de overstekende goot (foto: dak 3,22, goot circa 0,25 m)
  roof: 3.22, // plat dak van het gebouwtje
  beam: [6.22, 6.73], // koppelbalken (foto 6,2 tot 6,7)
  legTop: 10.1, // bovenkant van de poten, onder de kraag
  collar: [10.0, 10.45], // kraag onder de kegelvormige bodem
  cone: 11.35, // van de kraag naar de waterlijst (57 graden)
  sill: [11.47, 11.7], // waterlijst, bovenkant loopt schuin af naar de mantel
  shell: 11.92,
  frieze: [15.62, 15.98], // band onder de dakrand, onderkant 45 graden
  cornice: [16.08, 16.22], // dakrand
  top: 16.35, // AHN NAP +25,65
  window: [13.1, 14.75], // rondboogvensters in de mantel (foto 13,1 tot 14,75)
};
const R = {
  gutter: 2.85, // goot 0,22 m buiten de gevels
  legFoot: 2.44, // buitenvlak van de poten op het dak (foto: 4,9 m over de poten)
  legTop: 1.98, // buitenvlak van de poten bovenaan (foto: 3,8 tot 4,0 m)
  collar: 2.04,
  coneTop: 2.62,
  sill: 2.74,
  shell: 2.52, // mantel (foto 5,35 m over de lisenen, AHN-rand 2,6 tot 2,75)
  lisene: 2.67,
  cornice: 2.77,
};
const LEG_HALF = 0.35; // poten 0,7 m breed (foto circa 0,58 m)
const RECESS = 0.8; // diepte van de open vakken tussen de poten (in het echt open)
const LISENE_HALF = 0.3;

const legR = (z) => R.legFoot + ((R.legTop - R.legFoot) * (z - H.roof)) / (H.legTop - H.roof);
// Achthoek met de hoekpunten op de poten (0 + 45k graden) en omgeschreven straal rc, als punten op hoogte z.
const oct = (rc, z) => Array.from({ length: 8 }, (_, k) => [rc * Math.cos((k * Math.PI) / 4), rc * Math.sin((k * Math.PI) / 4), z]);
// Kern achter de open vakken: vlakken RECESS achter de koppelbalken (achthoek door de buitenvlakken van de poten).
const coreRc = (z) => (C22 * legR(z) - RECESS) / C22;
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const EIGHT = Array.from({ length: 8 }, (_, k) => 45 * k);
const BETWEEN = EIGHT.map((d) => d + 22.5);
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder
// 56 graden op (rondboog als spitse nis), buiten de gevel loopt de snede schuin af.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};

// ---------- gebouwtje aan de voet ----------
// Vierkant tot de goot, de goot steekt 0,22 m uit met een onderkant van 45 graden, plat dak op 3,22 m.
const sq = (a, z) => [[-a, -a, z], [a, -a, z], [a, a, z], [-a, a, z]];
const house = union([
  box(-HALF, -HALF, BASE, HALF, HALF, H.eave + 0.01),
  hull([...sq(HALF, H.eave), ...sq(R.gutter, H.eave + (R.gutter - HALF)), ...sq(R.gutter, H.roof)]),
]);
// Dubbele deur in de noordgevel (+Y, naar de straat), een venster met een boogje in elk van de drie andere gevels
// (in het echt circa 0,35 m breed, hier 0,6 m).
const houseNiches = union([
  place(niche(HALF, 1.5, 0, 2.3, 0.3), { deg: 90 }),
  ...around(niche(HALF, 0.6, 1.0, 1.9, 0.3), [0, 180, 270]),
]);

// ---------- poten, koppelbalken en kern ----------
// Poot: radiaal prisma van 0,7 m breed dat naar binnen loopt, van het dak (3,22 m, 2,44 m uit het hart) tot onder de
// kraag (10,1 m, 1,98 m); de binnenkant zit in de kern.
const leg = hull([
  [0.5, -LEG_HALF, H.roof - 0.2], [R.legFoot, -LEG_HALF, H.roof - 0.2], [0.5, LEG_HALF, H.roof - 0.2], [R.legFoot, LEG_HALF, H.roof - 0.2],
  [0.5, -LEG_HALF, H.roof], [R.legFoot, -LEG_HALF, H.roof], [0.5, LEG_HALF, H.roof], [R.legFoot, LEG_HALF, H.roof],
  [0.5, -LEG_HALF, H.legTop], [R.legTop, -LEG_HALF, H.legTop], [0.5, LEG_HALF, H.legTop], [R.legTop, LEG_HALF, H.legTop],
]);
const core = hull([...oct(coreRc(H.roof), H.roof - 0.2), ...oct(coreRc(H.legTop), H.legTop)]);
// Koppelbalken: achthoek door de buitenvlakken van de poten; het ondervlak loopt onder 48 graden de kern in (de schuine
// schoren op de foto). Bovenaan dezelfde schuine overgang van de kern naar de kraag.
const SOFFIT = 0.9;
const beams = hull([...oct(coreRc(H.beam[0] - SOFFIT), H.beam[0] - SOFFIT), ...oct(legR(H.beam[0]), H.beam[0]), ...oct(legR(H.beam[1]), H.beam[1])]);
const topSoffit = hull([...oct(coreRc(H.legTop - SOFFIT), H.legTop - SOFFIT), ...oct(legR(H.legTop), H.legTop), ...oct(legR(H.legTop), H.collar[0] + 0.15)]);
const frame = union([core, ...around(leg, EIGHT), beams, topSoffit]);

// ---------- reservoir ----------
// Kraag (onderkant 51 graden), kegelvormige bodem (57 graden), waterlijst (onderkant 45 graden, bovenkant schuin naar
// de mantel), mantel, band met onderkant 45 graden, dakrand en een licht bol dak (AHN: 16,27 aan de rand, 16,35 midden).
const reservoir = rev([
  [0, H.collar[0]],
  [C22 * R.legTop - 0.1, H.collar[0]],
  [R.collar, H.collar[0] + 1.25 * (R.collar - (C22 * R.legTop - 0.1))],
  [R.collar, H.collar[1]],
  [R.coneTop, H.cone],
  [R.sill, H.sill[0]],
  [R.sill, H.sill[1]],
  [R.shell, H.shell],
  [R.shell, H.frieze[0]],
  [R.lisene, H.frieze[0] + (R.lisene - R.shell)],
  [R.lisene, H.frieze[1]],
  [R.cornice, H.cornice[0]],
  [R.cornice, H.cornice[1]],
  [0, H.top],
]);
// Acht lisenen boven de poten, 0,6 m breed en 0,15 m uit de mantel, van de waterlijst tot de band.
const lisene = box(R.shell - 0.12, -LISENE_HALF, H.sill[1] + 0.02, R.lisene, LISENE_HALF, H.frieze[0] + (R.lisene - R.shell) + 0.01);
// Smalle rondboogvensters, één per vak tussen de lisenen (in het echt circa 0,45 m breed, hier 0,5 m), 0,25 m diep.
const windows = around(niche(R.shell - 0.02, 0.5, H.window[0], H.window[1], 0.25), BETWEEN);

const tower = union([house, frame, reservoir, ...around(lisene, EIGHT)]).subtract(union([houseNiches, ...windows]));

await writeLandmark({
  slug: "watertoren-nijverdal-oude-watertoren",
  base: BASE,
  nodes: [["building:watertoren-voetgebouw-poten-koppelbalken-en-reservoir", tower]],
  catalog: {
    name: "Oude watertoren Nijverdal",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[4.5, 0], [-4.5, 0], [0, 4.5], [0, -4.5]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0163100000533903"],
    description:
      "Oorsprong op het hart van het vierkante BAG-pand op maaiveld (NAP +9,3 m), +X langs de gevels 6,5 graden linksom van RD-oost, +Y naar de P.C. Stamstraat (noord). Vierkant gebouwtje van 5,25 m tot 3,22 m met overstekende goot, dubbele deur en drie vensters; acht naar binnen lopende betonnen poten met koppelbalken op 6,2 tot 6,7 m rond een kern (de vakken zijn in het echt open); kraag, kegelvormige bodem, waterlijst, cilindrisch reservoir van 5,0 m met acht lisenen en acht rondboogvensters, band en dakrand tot 16,22 m en een licht bol dak tot 16,35 m (NAP +25,65). Maten uit BAG, AHN, register en foto's.",
    realWorld: {
      built: 1912,
      rijksmonument: 512248,
      type: "betonskelet met Intze-reservoir",
      ahnGroundNapM: GROUND_NAP,
      ahnRoofRimNapM: 25.55,
      ahnTopNapM: 25.65,
      baseBuildingM: HALF * 2,
      baseBuildingTopM: H.roof,
      legOuterRadiusM: [R.legFoot, R.legTop],
      beamsM: H.beam,
      reservoirDiameterM: R.shell * 2,
      reservoirOverLisenesM: R.lisene * 2,
      reservoirM: [H.cone, H.cornice[1]],
      topM: H.top,
      minimumPartM: 0.6,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/512248 (betonskelet, Intze-reservoir, vierkant gebouwtje met plat dak en overstekende goot, dubbele deur en drie vensters, acht poten met koppelbalken, mantel met acht lisenen op een waterlijst, gietijzeren rondboogvensters, ijzeren wenteltrap)",
      "https://nl.wikipedia.org/wiki/Oude_watertoren_(Nijverdal) (1912, proceswater van de Stoomblekerij, gerestaureerd 2010-2011)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_WATERTOREN_-_Nijverdal_-_20297259_-_RCE.jpg (waterpas: hoogtes van gebouwtje, koppelbalken, poten, bodem, waterlijst, vensters en dakrand; 39 px/m uit de AHN-hoogte)",
      "https://commons.wikimedia.org/wiki/File:Nijverdal_Watertoren_8314.JPG (poten, koppelbalken met schoren, lisenen, vensters, gebouwtje)",
      "https://commons.wikimedia.org/wiki/File:Watertoren,_Nijverdal.jpg (mantel, lisenen, vensters, wenteltrap)",
      "PDOK BAG-pand 0163100000533903, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

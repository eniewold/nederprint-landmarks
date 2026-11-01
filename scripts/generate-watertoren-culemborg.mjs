// Watertoren van Culemborg (Visser & Smit, 1911), 35 m, reservoir van 200 m³,
// sinds 2018 in particuliere handen. Ronde bakstenen schacht op een basement
// met acht lisenen en vensters, licht verjongend tot een rondboogfries en een
// kraaglijst; daarboven een uitlopende gemetselde stoel met consoles onder het
// reservoir. Bij de renovatie van 1972 kreeg het reservoir een wand van
// golfaluminium tussen twee witte banden en een plat dak met een opstaande rand.
// Oorsprong op het hart van de ronde BAG-contour (pand 0216100000016390, straal
// 4,24 m, het basement) op maaiveld aan de voet (NAP +2,70 m), assen in
// RD-richting; het midden van het reservoir in het AHN ligt binnen 0,35 m.
// Hoogtes uit de foto "Culemborg Watertoren" (Olympus C-8080, 12,1 mm): camera
// teruggerekend op de top (35,0 m, AHN en Wikipedia) en de voet, circa 58 m van
// de toren; breedtes uit dezelfde foto, geschaald op de dakrand van 9,2 m
// (luchtfoto). Het dak in het AHN op +34,65 m, de rand erboven (luchtfoto:
// slagschaduw binnen de rand).
// De lisenen staan op 25 + k·45 graden (luchtfoto: voeten op 250 en 295
// graden); de foto toont vensters midden tussen de lisenen. De deur staat naar
// het verharde erf in het zuidwesten.
import { Manifold, CrossSection, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [144398.55, 439979.09];
const AXIS = [1, 0];
const BASE = -0.3;
const LISENE = 25; // graden, dan elke 45
const BAYS = Array.from({ length: 8 }, (_, k) => LISENE + 22.5 + k * 45); // vakken tussen de lisenen
const DOOR = LISENE + 22.5 + 4 * 45; // 227,5 graden: naar het erf in het zuidwesten
const H = {
  plinth: 7.0, // bovenkant van het basement, dan een schuine waterlijst
  shaftFoot: 7.45,
  shaftTop: 22.9, // onder de rondboogfries
  frieze: 23.15,
  corbel: 24.0, // voet van de kraaglijst
  cornice: 24.3,
  corniceTop: 24.6,
  bell: 26.35, // uitlopende stoel tot de onderste band
  band: 27.0, // bovenkant van de onderste witte band
  cladding: 33.88, // golfaluminium tot de bovenste band
  topBand: 34.0,
  roof: 34.65, // plat dak (AHN)
  rim: 35.0, // opstaande dakrand (Wikipedia 35,00 m)
};
const R = { plinth: 4.24, lisene: 4.6, shaftFoot: 3.9, shaftTop: 3.5, frieze: 3.65, cornice: 3.9, bellFoot: 3.75, band: 4.75, cladding: 4.52, tank: 4.6, rimInner: 3.7 };

// ---------- basement, verjongende schacht, fries, kraaglijst, stoel en reservoir in één omwentelingsprofiel ----------
// Alle schuine ondervlakken hangen hoogstens 42,5 graden over: de stoel loopt
// hol uit van r 3,75 naar r 4,75 over 1,75 m.
const tower = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.shaftFoot, H.shaftFoot], [R.shaftTop, H.shaftTop],
    [R.frieze, H.frieze], [R.frieze, H.corbel], [R.cornice, H.cornice], [R.cornice, H.corniceTop], [R.bellFoot, H.corniceTop],
    [3.85, 25.2], [4.2, 25.75], [R.band, H.bell], [R.band, H.band], [R.cladding, H.band], [R.cladding, H.cladding],
    [R.tank, H.topBand], [R.tank, H.rim], [R.rimInner, H.rim], [R.rimInner, H.roof], [0, H.roof],
  ]]),
  128,
);
const shaftR = (z) => R.shaftFoot + ((z - H.shaftFoot) / (H.shaftTop - H.shaftFoot)) * (R.shaftTop - R.shaftFoot);

// ---------- acht lisenen van 1,0 m om het basement, met een schuine afdekking ----------
const lisene = hull([
  [3.9, -0.5, BASE], [R.lisene, -0.5, BASE], [3.9, 0.5, BASE], [R.lisene, 0.5, BASE],
  [R.lisene, -0.5, 6.6], [R.lisene, 0.5, 6.6], [4.1, -0.5, 7.15], [4.1, 0.5, 7.15],
]);
const lisenes = union(Array.from({ length: 8 }, (_, k) => place(lisene, { deg: LISENE + k * 45 })));

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const cuts = [
  // Deur naar het erf, met een bovenlicht.
  place(niche(R.plinth, 1.2, 0, 2.5, 0.4), { deg: DOOR }),
  place(niche(R.plinth, 0.9, 3.4, 4.2, 0.3), { deg: DOOR }),
  // Basement: in elk ander vak een hoog venster met een segmentboog onder de waterlijst.
  ...BAYS.filter((deg) => deg !== DOOR).map((deg) => place(niche(R.plinth, 0.9, 4.4, 6.3, 0.3), { deg })),
  // Schacht: trapvensters boven de deur.
  ...[10.6, 15.6, 20.1].map((z) => place(niche(shaftR(z + 0.6), 0.6, z, z + 1.3, 0.25), { deg: DOOR })),
  // Rondboogfries als krans van veertien blinde nissen (penanten van 1,0 m).
  ...Array.from({ length: 14 }, (_, k) => place(niche(R.frieze, 0.6, 23.25, 23.75, 0.2), { deg: LISENE + k * (360 / 14) })),
];

const body = union([tower, lisenes]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-culemborg",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:basement-schacht-stoel-en-reservoir", body]],
  catalog: {
    name: "Watertoren Culemborg",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6.2, 0], [-6.2, 0], [0, 6.2], [0, -6.2]],
    replacesBuildings: ["NL.IMBAG.Pand.0216100000016390"],
    description:
      "Oorsprong op het hart van de ronde BAG-contour op maaiveld aan de voet (NAP +2,70 m), assen in RD-richting. Rond basement van 8,5 m tot 7 m met acht lisenen, vensters en een deur naar het zuidwesten, bakstenen schacht verjongend van 7,8 tot 7,0 m met trapvensters, rondboogfries en kraaglijst tot 24,6 m, uitlopende stoel tot de onderste band op 26,35 m, reservoir van 9,2 m met golfaluminium tussen twee banden en een plat dak op 34,65 m binnen een rand tot 35 m. Maten uit BAG, AHN, luchtfoto en één foto.",
    realWorld: {
      publishedHeightM: 35,
      reservoirM3: 200,
      ahnGroundNapM: 2.7,
      ahnRoofNapM: 37.36,
      bagPlinthDiameterM: 8.48,
      shaftDiameterM: [7.8, 7.0],
      tankDiameterM: 9.2,
      bandDiameterM: 9.5,
      plinthM: 7.0,
      corniceM: 24.6,
      tankFootM: 26.35,
      roofM: 34.65,
      modelTopM: 35.0,
      photoCameraDistanceM: 58,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Culemborg)",
      "https://commons.wikimedia.org/wiki/File:Culemborg_Watertoren.JPG (enige foto: opbouw, hoogtes en breedtes)",
      "PDOK BAG-pand 0216100000016390, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

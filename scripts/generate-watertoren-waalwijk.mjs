// Watertoren aan de Kloosterweg in Waalwijk: 1901-1902, ontwerp Visser en Smit, gemeentelijk monument, sinds 2018
// buiten gebruik (Brabant Water levert de druk vanuit Vlijmen). Volgens Wikipedia 34 m hoog met een reservoir van
// 200 m³. Een ronde betonnen schacht op een donkere, iets tapse plint; bovenaan een arcade van rondbogen tussen
// lisenen die als druppels naar beneden eindigen, een geprofileerde band, een uitkragende boogfries en daarop een
// stalen cilinderreservoir met verticale ribbels. Het reservoir draagt een zestienkantig koperen tentdak met een ver
// overstek op schoren en een achtkantig lantaarntje met een spits.
//
// Oorsprong op het midden van de ronde BAG-contour (pand 0867100000027518, 37 m², straal 3,42 m) op maaiveld (AHN-DTM
// in een ring van 5 tot 10 m NAP +2,62 tot +3,06, mediaan +2,93; aan de zuidkant +2,7, aan de noordkant +3,1). De
// toren is rond: +X loopt langs RD-oost. De deur staat aan de westkant (-X), waar het pad op de luchtfoto uitkomt.
//
// Hoogtes: het AHN-DSM ziet het dak tot 5,0 à 5,5 m uit het hart; de bovenkant daalt van NAP +35,95 op 1,75 m naar
// +34,04 op 5,25 m (helling 0,6: 31 graden), het maximum NAP +37,66 is het lantaarntje. De 3D BAG was bij het meten
// niet bereikbaar. Het overstek (10,5 m over de hoeken) komt uit de luchtfoto (schuin opgenomen; 260 px van 4 cm,
// zestien ribben). Doorsneden en hoogtes van de plint, de arcade, de band, de boogfries en het reservoir uit de foto
// Waalwijk Watertoren 5998 (Commons), geschaald op de BAG-straal van de plint en de dakrand uit het AHN.
import { hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [133022.91, 409638.42];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 2.9; // AHN-DTM in een ring van 5 tot 10 m: mediaan 2,93 (zuid 2,7, noord 3,1)
const GEOID_N = 43.66; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 72;

// Stralen.
const R = {
  plinthFoot: 3.42, // donkere plint op maaiveld (BAG)
  plinthTop: 3.3, // licht taps (foto: 207 tegen 217 px)
  shaftFoot: 3.12, // betonnen schacht (foto: 6,2 m)
  shaftTop: 3.04, // onder de arcade (foto: 6,0 tot 6,1 m)
  arcade: 3.37, // lisenen en boogvelden 0,3 m voor de schacht
  band: 3.55, // geprofileerde band (foto: 345 tegen 302 px)
  frieze: 3.9, // boogfries onder het reservoir
  tank: 3.95, // stalen reservoir (foto: 380 tegen 302 px; 8,0 m in de perspectieffit)
  eave: 5.25, // dakrand over de hoeken (luchtfoto 10,4 m)
  lantern: 0.7, // lantaarntje, over de hoeken
  lanternCap: 0.88,
};
const H = {
  plinth: 7.0, // bovenkant van de donkere plint (foto 6,9)
  dropFoot: 21.6, // voet van de druppels aan de schacht
  dropTip: 21.9, // onderkant van de lisenen
  archSpring: 23.25,
  archCrown: 23.8,
  band: [24.55, 25.6],
  frieze: [25.95, 26.9], // boogfries met kleine rondbogen
  tank: 26.9, // onderkant reservoir
  kraagFoot: 29.6, // waar de kraag onder het overstek de reservoirwand raakt (45 graden)
  fascia: [30.65, 31.0], // dakrand (AHN: NAP +34,04 = 31,1 boven maaiveld)
  lanternFoot: 33.4,
  lanternTop: 34.4,
  capTop: 34.75, // AHN-maximum NAP +37,66
};
const SLOPE = 0.6; // tentdak: AHN NAP +35,95 op 1,75 m tot +34,04 op 5,25 m
const APEX = H.fascia[1] + R.eave * SLOPE; // 34,15, onder het lantaarntje
const shaftR = (z) => R.shaftFoot + ((R.shaftTop - R.shaftFoot) * (z - H.plinth)) / (H.band[0] - H.plinth);
const plinthR = (z) => R.plinthFoot + ((R.plinthTop - R.plinthFoot) * z) / H.plinth;

const ring = (r, z, n = SEG, phase = 0) => ring3(circle([0, 0], r, n, phase), z);
const poly16 = (r, z) => ring(r, z, 16, Math.PI / 16);
const oct = (r, z) => ring(r, z, 8, Math.PI / 8);

// ---------- plint en schacht ----------
const plinth = hull([...ring(R.plinthFoot, BASE), ...ring(plinthR(H.plinth), H.plinth), ...ring(R.shaftFoot, H.plinth + (R.plinthTop - R.shaftFoot))]);
const shaft = hull([...ring(R.shaftFoot, H.plinth), ...ring(R.shaftTop, H.band[0] + 0.05)]);

// ---------- arcade: twaalf rondbogen tussen lisenen met druppels ----------
// Ring 0,3 m voor de schacht met een kraag van 45 graden onder de lisenen; per travee een boogveld dat van onder open
// is (tot op de schacht), met een plafond van 56 graden in plaats van de vlakke kruin.
const BAYS = 12;
const arcadeRing = hull([...ring(shaftR(H.dropFoot) - 0.02, H.dropFoot), ...ring(R.arcade, H.dropTip), ...ring(R.arcade, H.band[0] + 0.05)]);
const ARCH_W = 1.1; // lisenen dan 2π·3,37/12 - 1,1 = 0,66 m
// Uitsparing in het vlak met normaal +X: binnenkant op de schacht, het plafond loopt naar binnen onder 56 graden op.
const recess = (rFace, depth, w, z0, zs, n = 10) => {
  const outline = [[-w / 2, z0], [w / 2, z0], ...Array.from({ length: n + 1 }, (_, i) => {
    const a = (Math.PI * i) / n;
    return [(w / 2) * Math.cos(a), zs + (w / 2) * Math.sin(a)];
  })];
  return hull(outline.flatMap(([y, z]) => [
    [rFace - depth, y, z === z0 ? z : z + 1.5 * depth],
    [rFace + 1.0, y, z === z0 ? z : Math.max(z0, z - 1.5)],
  ]));
};
const archCuts = Array.from({ length: BAYS }, (_, k) =>
  place(recess(R.arcade, R.arcade - shaftR(H.archCrown), ARCH_W, H.dropFoot - 0.5, H.archSpring), { deg: (360 / BAYS) * (k + 0.5) }));
const arcade = arcadeRing.subtract(union(archCuts));

// ---------- band, boogfries en reservoir ----------
const band = hull([...ring(R.arcade, H.band[0]), ...ring(R.band, H.band[0] + (R.band - R.arcade)), ...ring(R.band, H.band[1])]);
// Boogfries: kraag van 45 graden van de band naar 3,85 m, zestien kleine rondbogen als nis van 0,25 m.
const friezeRing = hull([...ring(R.band, H.band[1]), ...ring(R.frieze, H.frieze[0]), ...ring(R.frieze, H.frieze[1] + 0.05)]);
const FRIEZE_BAYS = 16;
const friezeCuts = Array.from({ length: FRIEZE_BAYS }, (_, k) =>
  place(recess(R.frieze, 0.25, 1.0, H.frieze[0], H.frieze[1] - 0.35 - 0.5), { deg: (360 / FRIEZE_BAYS) * (k + 0.5) }));
const frieze = friezeRing.subtract(union(friezeCuts));
// Reservoir met een smalle lijst aan de voet (0,9 m hoog, 0,1 m uit de wand) waarop de wand staat.
const tank = union([
  hull([...ring(R.frieze, H.tank - 0.05), ...ring(R.tank, H.tank - 0.05 + (R.tank - R.frieze)), ...ring(R.tank, H.fascia[0])]),
]);

// ---------- zestienkantig tentdak met overstek, schoren en lantaarntje ----------
// Onder het overstek een kraag van 45 graden naar de reservoirwand (in het echt een open overstek met een schuin
// beschot op schoren); de zestien schoren staan als ribben van 0,4 m breed voor de kraag, op de hoeken van het dak.
// Kraag tot 5,0 m (45 graden vanaf de wand); de dakrand steekt daar nog 0,25 m vlak buiten.
const KRAAG_R = R.tank - 0.02 + (H.fascia[0] - H.kraagFoot);
const kraag = hull([...ring(R.tank - 0.02, H.kraagFoot), ...poly16(KRAAG_R, H.fascia[0] + 0.01)]);
const roof = hull([...poly16(R.eave, H.fascia[0]), ...poly16(R.eave, H.fascia[1]), [0, 0, APEX]]);
const brace = hull([
  [R.tank - 0.02, -0.2, H.kraagFoot - 0.55], [R.tank - 0.02, 0.2, H.kraagFoot - 0.55],
  [R.tank - 0.02, -0.2, H.kraagFoot + 0.3], [R.tank - 0.02, 0.2, H.kraagFoot + 0.3],
  [R.eave - 0.12, -0.2, H.fascia[0] - 0.35], [R.eave - 0.12, 0.2, H.fascia[0] - 0.35],
  [R.eave - 0.12, -0.2, H.fascia[0] + 0.3], [R.eave - 0.12, 0.2, H.fascia[0] + 0.3],
]);
const braces = Array.from({ length: 16 }, (_, k) => place(brace, { deg: 22.5 * k }));
const lantern = union([
  hull([...oct(R.lantern, H.lanternFoot), ...oct(R.lantern, H.lanternTop)]),
  hull([...oct(R.lantern, H.lanternTop - 0.18), ...oct(R.lanternCap, H.lanternTop), [0, 0, H.capTop]]),
]);
// Galmgaten in het lantaarntje: vier nissen van 0,3 m.
const lanternFaceR = R.lantern * Math.cos(Math.PI / 8);
const lanternCuts = [0, 90, 180, 270].map((deg) => place(recess(lanternFaceR, 0.25, 0.5, H.lanternFoot + 0.25, H.lanternTop - 0.6, 6), { deg }));

// ---------- deur aan de westkant ----------
const door = place(recess(plinthR(1.2), 0.3, 1.2, 0, 1.8, 8), { deg: 180 });

const tower = union([plinth, shaft, arcade, band, frieze, tank, kraag, roof, ...braces, lantern])
  .subtract(union([door, ...lanternCuts]));

await writeLandmark({
  slug: "watertoren-waalwijk",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-reservoir-en-tentdak", tower]],
  catalog: {
    name: "Watertoren Waalwijk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Vlak naast de voet: verder naar het westen zakt het PDOK-maaiveld naar een lager pad.
    groundSamplePoints: [[4, 0], [-4, 0], [0, 4], [0, -4]],
    // Ellipsoïdisch: NAP +2,90 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0867100000027518"],
    description:
      "Oorsprong op het midden van de ronde BAG-contour op maaiveld (NAP +2,90 m), +X langs RD-oost, deur op -X (west). Donkere tapse plint van 6,84 m tot 7,0 m met deurnis, ronde betonnen schacht van 6,24 tot 6,08 m met bovenaan twaalf rondbogen tussen lisenen met druppels, geprofileerde band, boogfries met zestien rondboogjes, stalen reservoir van 7,9 m van 26,9 m tot het dak, zestienkantig tentdak van 31 graden met een overstek van 10,5 m op een kraag met schoren, dakrand op 31,0 m, lantaarntje met galmgaten tot 34,75 m. Maten uit BAG, AHN, luchtfoto en foto.",
    realWorld: {
      publishedHeightM: 34,
      reservoirM3: 200,
      built: "1901-1902",
      architect: "Visser en Smit",
      ahnGroundNapM: GROUND_NAP,
      ahnRoofEdgeNapM: 34.04,
      ahnMaxNapM: 37.66,
      geoidNlgeo2018M: GEOID_N,
      plinthDiameterM: 2 * R.plinthFoot,
      shaftDiameterM: [2 * R.shaftFoot, 2 * R.shaftTop],
      tankDiameterM: 2 * R.tank,
      eaveDiameterM: 2 * R.eave,
      plinthTopM: H.plinth,
      bandM: H.band,
      tankFootM: H.tank,
      fasciaM: H.fascia,
      roofPitchDeg: +((Math.atan(SLOPE) * 180) / Math.PI).toFixed(1),
      modelTopM: H.capTop,
      arcadeBays: BAYS,
      friezeBays: FRIEZE_BAYS,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Waalwijk) (1901-1902, Visser en Smit, 34 m, 200 m³, buiten gebruik sinds 2018)",
      "https://commons.wikimedia.org/wiki/File:Waalwijk_Watertoren_5998.JPG (opbouw, verhoudingen en hoogtes: plint, arcade, band, boogfries, reservoir, overstek met schoren, lantaarntje)",
      "PDOK BAG-pand 0867100000027518, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-03",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,66 m) voor groundHeight",
    ],
  },
});

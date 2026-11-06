// Watertoren van Doorn aan de Woestduinlaan 55 (kadastraal Mariniersweg 1), op het terrein van het pompstation van de
// Doornse Waterleiding. Gebouwd in 1902-1903 op een kunstmatige aarden verhoging naar ontwerp van de firma Visser & Smit;
// rijksmonument 508750 (complex 508749 met het pomphuis), volgens Wikipedia 30 m hoog met één reservoir van 150 m³, in
// 1959 gerenoveerd. Een ronde, taps toelopende bakstenen toren in drie geledingen (register): de voet tot een brede
// natuurstenen, uitkragende band, met de ingang in een aanbouw onder zadeldak met een uitkragende tuitgevel en een deur
// met rondboogbovenlicht; de hoge schacht met kleine rondboogvensters, afgesloten door een rondboogfries (lisenen met
// consoles); daarboven kraagt de toren uit met bloktandlijsten, platte natuurstenen banden en een tweede, kleinere
// rondboogfries naar het reservoir met een vlakke gevel en staande zesruitsvensters. De kantelen zijn in 1959
// verwijderd; op het platte dak staat een ijzeren reling.
//
// Oorsprong op het hart van de BAG-cirkel (pand 1581100000018088, 21 punten, straal 3,55 m, afwijking ≤ 0,06 m) op het
// maaiveld van de verhoging: AHN-DTM NAP +8,55 (ring van 3 tot 6 m: 8,50 tot 8,57; de verhoging zakt naar NAP +7,0 op
// 15 m). Het AHN valt hier op de BAG: het gat in het DTM (straal 3,3 à 3,7 m) en de DSM-cellen boven 15 m (straal tot
// 3,9 à 4,1 m, het reservoir) liggen rond hetzelfde hart. +X wijst naar RD-richting -24 graden (oost-zuidoost): de as
// van de aanbouw met de ingang (BAG: 3,06 m breed, voorgevel 6,03 m uit het hart). +Y wijst naar 66 graden.
// Maten: maaiveld en dak uit het AHN (plat dak NAP +36,91, dus 28,36 m boven het maaiveld; de reling tot +37,3 is
// weggelaten), de aanbouw uit BAG en AHN (nok NAP +12,4, top van de tuitgevel +13,15). Geledingen, banden, friezen en
// vensters uit de foto "Doorn - Watertoren Woestduinlaan 55 RM508750.JPG" (Commons, recht op de ingang): hoogtes als
// fractie van de hoogte tussen de dorpel en de dakrand, stralen als verhouding tot de voet (BAG) en het reservoir (AHN).
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [151128.99, 450416.04];
const AXIS_DEG = -24;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 8.55;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (onder de aanbouw 51,83, achter 51,97, links 51,88,
// rechts 51,93), gemeten 2026-11-06. Het PDOK-terrein volgt de verhoging: rond de voet 51,8 à 52,0, voor de aanbouw zakt
// het naar 51,3 op 7 m (AHN: NAP +7,9, de trap naar de deur); de voorgevel van de aanbouw (51,4 à 51,5) staat zo nog op het
// terrein zonder dat de toren in de verhoging zakt.
const GROUND_ELLIPSOID = 51.83;

// Omwenteling van een gesloten profiel [[r, z], ...].
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Massief onder een profiel van onder naar boven, gesloten langs de as.
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Schijf tot r1 tussen z0 en z1, met een onderkant van 50 graden vanaf de straal rIn (massief tot de as).
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
// Straal van een rechte kegel van (ra, za) tot (rb, zb) op hoogte z.
const coneR = (ra, za, rb, zb) => (z) => ra + ((rb - ra) * (z - za)) / (zb - za);
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 56 graden op.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Rondboognis: als niche, met een halfrond bovenop; het boogplafond loopt naar binnen onder 63 graden op.
const archNiche = (f, w, z0, zSpring, depth = 0.3) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([y, z]) => [a, y, z + 2 * depth]),
    ...arc.map(([y, z]) => [f, y, z]),
    ...arc.map(([y, z]) => [f + 1, y, Math.max(z0, z - 1.5)]),
    [a, -r, z0], [a, r, z0], [f + 1, -r, z0], [f + 1, r, z0],
  ]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
const FRONT = 0; // aanbouw met de ingang (lokaal +X)

// ---------- hoogtes boven het maaiveld (NAP +8,55) ----------
const H = {
  footBand: [4.95, 5.4], // brede natuurstenen, uitkragende band (einde eerste geleding)
  arcade: [15.5, 18.25], // rondboogfries van de schacht: lisenen met consoles vanaf 15,5 m, bogen tot 17,85 m
  corbel: [18.25, 18.95], // bloktandlijst, uitkraging naar 3,57 m
  smallFrieze: [19.86, 20.7], // kleinere rondboogfries
  dentil: [21.0, 21.45],
  stoneBand: [21.63, 22.1], // platte natuurstenen band onder het reservoir
  resWindows: [24.1, 25.6], // staande zesruitsvensters
  coping: [27.88, 28.2],
  roof: 28.36, // plat dak (AHN NAP +36,91)
};
// Stralen.
const R = {
  foot: 3.55, // BAG 3,55 aan de onderkant, licht verjongend
  footTop: 3.42,
  footBand: 3.72,
  shaftFoot: 3.22,
  shaftTop: 3.07,
  arcade: 3.32, // lisenen
  corbel: 3.57,
  smallFrieze: 3.87,
  dentil: 3.97,
  stoneBand: 4.1,
  reservoir: 4.0, // AHN: gat in het DTM tot 3,65 m, DSM-cellen boven 15 m tot 3,8 à 4,1 m van het hart; foto: 1,15 à 1,2 maal de voet
  coping: 4.07,
};
const footR = coneR(R.foot, 0, R.footTop, H.footBand[0]);
const shaftR = coneR(R.shaftFoot, H.footBand[1], R.shaftTop, H.arcade[0]);

// ---------- voet ----------
const foot = solidRev([[R.foot, BASE], [R.foot, 0], [R.footTop, H.footBand[0] + 0.01]]);
const footBand = ledge(R.footTop, R.footBand, ...H.footBand);
// Rondboogvensters in de voet, als nis van 0,9 m: links, rechts en achter (2,2 tot 3,95 m; het plafond blijft onder de
// onderkant van de band).
const footWindows = union(around(archNiche(footR(3.95), 0.9, 2.2, 3.5, 0.3), [FRONT + 90, FRONT - 90, FRONT + 180]));

// ---------- schacht ----------
const shaft = solidRev([[R.shaftFoot, H.footBand[1] - 0.01], [R.shaftTop, H.arcade[0]], [R.shaftTop, H.arcade[1] + 0.01]]);
// Kleine rondboogvensters langs de trap, als nis van 0,9 m: boven de ingang 6,5 tot 8,2 m, 45 graden links 10,1 tot
// 11,7 m, 45 graden rechts 13,2 tot 14,5 m (foto: 13,8 tot 15,4 m; lager zodat het plafond onder de consoles blijft), en achter dezelfde reeks gespiegeld.
const shaftWin = (z0, z1, degs) => around(archNiche(shaftR(z1), 0.9, z0, z1 - 0.45, 0.3), degs);
const shaftOpenings = union([
  ...shaftWin(6.5, 8.2, [FRONT, FRONT + 180]),
  ...shaftWin(10.1, 11.7, [FRONT + 45, FRONT - 135]),
  ...shaftWin(13.2, 14.5, [FRONT - 45, FRONT + 135]),
]);
// Rondboogfries: ring van lisenen (3,32 m) met een onderkant van 50 graden vanaf 15,2 m, met twaalf rondboognissen van
// 0,9 m (aanzet 17,4 m, kruin 17,85 m) die van onderen open zijn: tussen de nissen blijven twaalf lisenen van 0,85 m
// met hun console staan, de bogen zijn het plafond van de nissen.
const ARCADE = every(12, FRONT + 15);
const arcadeRing = ledge(R.shaftTop, R.arcade, ...H.arcade);
const arcadeNiches = union(around(archNiche(R.arcade, 0.9, H.arcade[0] - 0.6, 17.4, R.arcade - R.shaftTop - 0.01), ARCADE));
const shaftAll = union([shaft.subtract(shaftOpenings), arcadeRing.subtract(arcadeNiches)]);

// ---------- uitkraging en reservoir ----------
// Eén profiel: bloktandlijst naar 3,57 m (70 graden), vlakke band, kraag naar de kleinere rondboogfries (3,87 m, 40 graden),
// bloktandlijst (3,97 m), platte natuurstenen band (4,1 m, 46 graden), trommel van het reservoir (4,0 m), dekplaat.
const upper = solidRev([
  [R.arcade, H.corbel[0] - 0.01],
  [R.corbel, H.corbel[1]],
  [R.corbel, H.smallFrieze[0] - 0.36],
  [R.smallFrieze, H.smallFrieze[0]],
  [R.smallFrieze, H.dentil[0]],
  [R.dentil, H.dentil[0] + 0.1],
  [R.dentil, H.dentil[1]],
  [R.stoneBand, H.stoneBand[0]],
  [R.stoneBand, H.stoneBand[1]],
  [R.reservoir, H.stoneBand[1]],
  [R.reservoir, H.coping[0] - 0.07],
  [R.coping, H.coping[0]],
  [R.coping, H.coping[1]],
  [R.reservoir - 0.05, H.roof],
]);
// Kleinere rondboogfries: zestien rondboognissen van 0,7 m in de kraag, van onderen open (aanzet 20,2 m, kruin 20,55 m).
const smallArches = union(around(archNiche(R.smallFrieze, 0.7, H.smallFrieze[0] - 0.6, 20.2, 0.2), every(16, FRONT + 360 / 32)));
// Twaalf staande zesruitsvensters in het reservoir, als nis van 0,9 m (foto: om de 30 graden, 10 graden naast de as).
const resWindows = union(around(niche(R.reservoir, 0.9, ...H.resWindows, 0.3), every(12, FRONT + 10)));
const upperAll = upper.subtract(union([smallArches, resWindows]));

// ---------- aanbouw met de ingang ----------
// BAG: 3,06 m breed, voorgevel 6,03 m uit het hart, zijgevels tot in de voet. Goot 3,0 m, nok 3,85 m (AHN 3,8 à 3,9).
// Tuitgevel: muur tot 4,75 m (AHN-piek 4,6), daarop een dekplaat van 0,3 m die aan de hoeken 0,17 m opzij
// uitkraagt (onderkant 48 graden; naar voren gelijk met de gevel, een uitsteek liet de export opvullen), op de top een tuit van 0,8 m tot 5,35 m met een piramidedak tot 5,6 m.
const AN = { back: 2.9, front: 6.03, half: 1.53, eaves: 3.0, ridge: 3.85, apex: 4.75, gableIn: 5.45 };
const annexBody = box(AN.back, -AN.half, BASE, AN.front, AN.half, AN.eaves);
const annexRoof = hull([
  [AN.back, -AN.half, AN.eaves], [AN.gableIn, -AN.half, AN.eaves], [AN.back, AN.half, AN.eaves], [AN.gableIn, AN.half, AN.eaves],
  [AN.back, 0, AN.ridge], [AN.gableIn, 0, AN.ridge],
]);
const gableWall = hull([AN.gableIn - 0.1, AN.front].flatMap((x) => [[x, -AN.half, AN.eaves - 0.01], [x, AN.half, AN.eaves - 0.01], [x, 0, AN.apex]]));
const copingArm = (s) => {
  const lo = [[s * 1.7, 2.85], [0, AN.apex]], up = [[s * 1.7, 3.15], [0, AN.apex + 0.3]];
  return hull([
    ...[AN.gableIn - 0.1, AN.front].flatMap((x) => [...lo, ...up].map(([y, z]) => [x, y, z])),
    [AN.gableIn - 0.1, s * AN.half, 2.66], [AN.front, s * AN.half, 2.66],
  ]);
};
const tuit = hull([
  ...[AN.gableIn - 0.1, AN.front].flatMap((x) => [[x, -0.4, 4.2], [x, 0.4, 4.2], [x, -0.4, 5.35], [x, 0.4, 5.35]]),
  [(AN.gableIn - 0.1 + AN.front) / 2, 0, 5.6],
]);
// Deur met rondboogbovenlicht: 1,1 m breed, aanzet 2,05 m, kruin 2,6 m, nis van 0,35 m.
const door = archNiche(AN.front, 1.1, 0, 2.05, 0.35);
const annex = union([annexBody, annexRoof, gableWall, copingArm(-1), copingArm(1), tuit]).subtract(door);

const tower = union([foot.subtract(footWindows), footBand, shaftAll, upperAll, place(annex, { deg: FRONT })]);

// groundSamplePoints op de verhoging: 4 m voor het hart onder de aanbouw, 5 m opzij en achter (AHN-DTM NAP +8,45 tot +8,55).
const GROUND_SAMPLES = [[4, 0], [-5, 0], [0, 5], [0, -5]];

await writeLandmark({
  slug: "watertoren-doorn",
  base: BASE,
  nodes: [["building:watertoren-voet-aanbouw-schacht-friezen-en-reservoir", tower]],
  catalog: {
    name: "Watertoren Doorn",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: GROUND_SAMPLES,
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1581100000018088"],
    description:
      "Oorsprong op het hart van de BAG-cirkel op het maaiveld van de aarden verhoging (NAP +8,55 m), +X naar RD-richting -24 graden (oost-zuidoost): de aanbouw met de ingang. Verjongende voet met drie rondboogvensters tot een uitkragende natuurstenen band; aanbouw onder zadeldak met tuitgevel, tuit en deur; taps toelopende schacht met zes rondboogvensters en een rondboogfries van twaalf bogen op lisenen; uitkraging met bloktandlijsten, een kleinere rondboogfries van zestien bogen en een natuurstenen band naar het reservoir van 8,0 m met twaalf vensters; plat dak op 28,36 m. Maten uit BAG, AHN en een foto.",
    realWorld: {
      built: 1903,
      architect: "Visser & Smit",
      publishedHeightM: 30,
      reservoirM3: 150,
      monument: 508750,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 36.91,
      ahnRailingNapM: 37.3,
      ahnAnnexRidgeNapM: 12.4,
      bagFootRadiusM: 3.55,
      footDiameterM: [R.foot * 2, R.footTop * 2],
      shaftDiameterM: [R.shaftFoot * 2, R.shaftTop * 2],
      reservoirDiameterM: R.reservoir * 2,
      annexM: { widthM: AN.half * 2, frontFromCentreM: AN.front, eavesM: AN.eaves, ridgeM: AN.ridge, gableM: AN.apex },
      roofM: H.roof,
      topM: 28.36,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/508750 (1902-1903 op een kunstmatige aarden verhoging, Visser & Smit, cilindervorm taps toelopend, drie geledingen, aanbouw onder zadeldak met uitkragende tuitgevel en deur met rondboogvormig bovenlicht, brede natuurstenen uitkragende band, kleine rondboogvensters, rondboogfries, bloktandlijsten, platte natuurstenen banden en een kleinere rondboogfries, reservoir met staande zesruitsvensters, kantelen in 1959 verwijderd, ijzeren reling)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Doorn) (Woestduinlaan, 1902, Visser & Smit Hanab, 30 m, 150 m³, gerenoveerd 1959, rijksmonument sinds 1998)",
      "https://commons.wikimedia.org/wiki/File:Doorn_-_Watertoren_Woestduinlaan_55_RM508750.JPG (recht op de ingang: geledingen, aanbouw met tuitgevel, vensters, friezen, banden, reservoir)",
      "https://commons.wikimedia.org/wiki/File:Doorn_Watertoren_9587.JPG en https://commons.wikimedia.org/wiki/File:Doorn_Woestduinlaan_55.jpg (andere zijden: vensters in voet en schacht, de verhoging)",
      "PDOK BAG-pand 1581100000018088, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

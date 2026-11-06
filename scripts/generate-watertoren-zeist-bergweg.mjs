// Watertoren aan de Bergweg in Zeist (Bergweg 24). Gebouwd in 1896 voor de Utrechtse Waterleiding Maatschappij, met
// neorenaissance-invloeden; 37,5 m hoog (Wikipedia, register), Intze-reservoir type I van 300 m³, rijksmonument 510273.
// Zuster van de torens aan de Lauwerhof in Utrecht (1896) en in Baarn (1903). Een ronde toren in baksteen: een licht
// verjongende onderbouw op een hardstenen plint met een dubbele deur naar de Bergweg en een kroonlijst, een verjongende
// schacht met smalle vensters en oculi, een dubbele lijst, een zestienzijdige gemetselde overkraging met velden tussen
// ijzeren ribben, en de reservoirbekroning: een band, zestien velden tussen lisenen met elk een rechthoekig en een vierkant
// venster, een lijst, een band met kleine venstertjes en ankers, een zestienzijdige overstekende kroonlijst en een vlak
// zestienzijdig tentdak met een vierkante ventilatiekap (register; overstek en kap na 1900 gewijzigd en ingekort).
//
// Oorsprong op het hart van de cirkel van BAG-pand 0355100000723944 (straal 4,84 m, de voet van de onderbouw); het hoogste
// DSM-punt ligt er binnen 0,15 m naast. Lokale X-as = RD-oost, Y = RD-noord; hoeken hieronder in graden linksom vanaf oost.
// Maaiveld AHN-DTM NAP +5,35. Maten: kroonlijst en dak uit het AHN-DSM (dakrand NAP +35,25, helling 0,52 tot 0,54,
// top van de kap NAP +39,47), de straal van de kroonlijst uit DSM en luchtfoto (12,2 m); de stralen van onderbouw, schacht
// en reservoir en alle hoogtes onder de kroonlijst uit de RCE-foto "Overzicht Watertoren - Zeist - 20372027 - RCE.jpg"
// (verticale lijnen evenwijdig: geschaald per diepte, met de BAG-straal en de dakrand uit het AHN als ijkpunten), en
// "Zeist Watertoren 9161.JPG" voor de plaats van vensters en oculi.
import { Manifold, CrossSection, ccw, circle, hull, ring3, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [145031.75, 455843.89];
const AXIS = [1, 0];
const GROUND_NAP = 5.35;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 48,86, noord 48,85, west 48,71, zuid 48,47),
// gemeten 2026-11-06. Het PDOK-pand staat op 48,34.
const GROUND_ELLIPSOID = 48.47;

const rad = (deg) => (deg * Math.PI) / 180;
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (start, step, n) => Array.from({ length: n }, (_, k) => start + step * k);
// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder
// 56 graden op.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 0.3, za = z1 + 1.5 * depth, zb = z1 - 0.45;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Boognis met een spitse top (zijden onder `ang` graden) van z1 tot z1 + w/2 tan(ang): een tunnel met een spits plafond.
const archNiche = (f, w, z0, z1, depth = 0.3, ang = 55) => {
  const apex = z1 + (w / 2) * Math.tan(rad(ang));
  return hull([f - depth, f + 1.2].flatMap((x) => [[x, -w / 2, z0], [x, w / 2, z0], [x, -w / 2, z1], [x, w / 2, z1], [x, 0, apex]]));
};
// Oculus als ruitvormige nis (halve breedte s, halve hoogte 1,3 s: plafond onder 53 graden) rond hoogte zc.
const diamond = (f, s, zc, depth = 0.3) =>
  hull([f - depth, f + 1.2].flatMap((x) => [[x, -s, zc], [x, s, zc], [x, 0, zc - 1.3 * s], [x, 0, zc + 1.3 * s]]));

// ---------- hoogtes boven het maaiveld (NAP +5,35) ----------
const H = {
  plinth: 0.45, // hardstenen plint, schuin afgedekt tot 0,6 m
  plinthTop: 0.6,
  baseCornice: 5.0, // kroonlijst van de onderbouw (kraag)
  baseCorniceTop: 5.6,
  shaftCornice: 19.8, // dubbele lijst boven de schacht
  shaftCorniceTop: 20.9,
  corbelTop: 23.4, // zestienzijdige overkraging
  band: 23.55, // band onder het reservoir
  bandTop: 23.9,
  bay: [24.05, 27.45], // velden tussen de lisenen
  string: 27.6, // lijst boven de velden
  stringTop: 28.0,
  eave: 28.75, // onderkant van de kraag onder de kroonlijst
  fascia: 29.75,
  roofEdge: 29.95, // AHN NAP +35,25 op 5,5 tot 6 m
  roofTop: 32.65, // dak tot de kap (helling 0,52 op de hoeklijnen)
  vent: 33.5, // kap 1,2 m in het vierkant
  top: 34.1, // AHN NAP +39,47
};
const R = {
  plinth: 5.0,
  foot: 4.84, // BAG
  baseTop: 4.7,
  baseCornice: 4.95,
  shaftFoot: 4.53,
  shaftTop: 3.75,
  shaftCornice: 4.05,
  drum: 5.15,
  band: 5.27,
  string: 5.3,
  eave: 6.1, // zestienhoek, omgeschreven straal (luchtfoto 12,2 m, DSM)
  roofTop: 0.9,
};
const DOOR_DEG = 186; // deur naar de Bergweg, haaks op de rooilijn (luchtfoto)
const ROOF_SLOPE = (H.roofTop - H.roofEdge) / (R.eave - R.roofTop);
const poly16 = (r) => circle([0, 0], r, 16);

// ---------- toren: één omwentelingsprofiel tot onder de kroonlijst ----------
const tower = rev([
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.foot, H.plinthTop], [R.baseTop, H.baseCornice],
  [R.baseCornice, H.baseCornice + 0.25], [R.baseCornice, H.baseCorniceTop], [R.shaftFoot, H.baseCorniceTop],
  [R.shaftTop, H.shaftCornice], [R.shaftCornice, H.shaftCornice + 0.3], [R.shaftCornice, H.shaftCorniceTop],
  [R.drum, H.corbelTop], [R.band, H.band], [R.band, H.bandTop], [R.drum, H.bandTop], [R.drum, H.string],
  [R.string, H.string + 0.2], [R.string, H.stringTop], [R.drum, H.stringTop], [R.drum, H.eave + 0.01], [0, H.eave + 0.01],
]);
// Kroonlijst: kraag van de ronde mantel naar de zestienhoek (hoeken 0,95 m over 1,0 m), dan de goot van 0,2 m.
const eave = hull([...ring3(circle([0, 0], R.drum, 64), H.eave), ...ring3(poly16(R.eave), H.fascia), ...ring3(poly16(R.eave), H.roofEdge)]);
// Overkraging: zestien vlakke velden tussen de ijzeren ribben (de ribben staan op de lisenen van het reservoir), van de
// dubbele lijst (omgeschreven straal 4,13) naar de band onder het reservoir (5,27); hoeklijnen 25 graden uit het lood.
const corbel = hull([...ring3(poly16(R.shaftCornice / Math.cos(Math.PI / 16)), H.shaftCorniceTop), ...ring3(poly16(R.band), H.corbelTop)]);
// Zestienzijdig tentdak met dezelfde hoeken als de kroonlijst, afgeknot onder de kap.
const roof = hull([...ring3(poly16(R.eave), H.roofEdge - 0.05), ...ring3(poly16(R.roofTop), H.roofTop)]);
// Ventilatiekap: vierkant van 1,2 m met een dakje van 45 graden.
const ventSq = [[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]];
const vent = union([prism(ventSq, H.roofTop - 0.4, H.vent), hull([...ring3(ventSq, H.vent - 0.01), [0, 0, H.top]])]);

// ---------- deur, vensters en velden als blinde nissen ----------
// - onderbouw: dubbele deur met boog (1,4 m breed, top 3,35 m) naar de Bergweg;
// - schacht: acht smalle vensters onderin (7,2 tot 8,6 m) en acht bovenin (17,4 tot 18,8 m), vier oculi op 13,2 m;
// - reservoir: zestien velden van 1,15 m tussen lisenen van 0,9 m, 0,2 m terug, met elk een rechthoekig venster
//   (25,35 tot 26,55 m) en een vierkant venster (24,2 tot 24,85 m);
// echte vensters zijn 0,3 tot 0,4 m breed; hier 0,9 m zodat ze op 1:1000 te zien zijn.
const WIN = every(DOOR_DEG - 30, 45, 8);
const bays = every(11.25, 22.5, 16);
const panels = union(around(niche(R.drum, 1.15, H.bay[0], H.bay[1], 0.2), bays));
const openings = union([
  ...around(archNiche(R.foot - 0.05, 1.4, 0.3, 2.35), [DOOR_DEG]),
  ...around(niche(4.4, 0.9, 7.2, 8.6), WIN),
  ...around(niche(3.85, 0.9, 17.4, 18.8), WIN),
  ...around(diamond(4.08, 0.45, 13.2), every(DOOR_DEG - 30, 90, 4)),
  ...around(niche(R.drum - 0.2, 0.9, 25.35, 26.55), bays),
  ...around(niche(R.drum - 0.2, 0.9, 24.2, 24.85), bays),
]);

const all = union([tower, corbel, eave, roof, vent]).subtract(panels).subtract(openings);

await writeLandmark({
  slug: "watertoren-zeist-bergweg",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-overkraging-reservoir-kroonlijst-en-dak", all]],
  catalog: {
    name: "Watertoren Zeist",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6, 0], [-6, 0], [0, 6], [0, -6]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0355100000723944"],
    description:
      "Oorsprong op het hart van de ronde BAG-voetafdruk (straal 4,84 m) op het maaiveld (NAP +5,35 m), X-as naar RD-oost. Onderbouw op een plint met de deur naar de Bergweg (west) en een kroonlijst tot 5,6 m; verjongende schacht (straal 4,53 tot 3,75 m) met smalle vensters en oculi tot de dubbele lijst op 20,9 m; zestienzijdige overkraging tot 23,4 m; reservoir (straal 5,15 m) met band, zestien velden met elk twee vensters, lijst en een zestienzijdige kroonlijst tot 29,95 m; vlak zestienzijdig tentdak met vierkante ventilatiekap tot 34,1 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1896,
      client: "Utrechtse Waterleiding Maatschappij",
      rijksmonument: 510273,
      publishedHeightM: 37.5,
      reservoirM3: 300,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofEdgeNapM: 35.25,
      ahnTopNapM: 39.47,
      footRadiusM: R.foot,
      baseM: H.baseCorniceTop,
      shaftRadiusFootM: R.shaftFoot,
      shaftRadiusTopM: R.shaftTop,
      corbelM: [H.shaftCorniceTop, H.corbelTop],
      drumRadiusM: R.drum,
      eaveRadiusM: R.eave,
      roofEdgeM: H.roofEdge,
      roofSlope: +ROOF_SLOPE.toFixed(3),
      topM: H.top,
      entranceDegrees: DOOR_DEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Zeist) (1896, Utrechtse Waterleiding Maatschappij, neorenaissance-invloeden, 37,5 m, 300 m³, puntdak)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/510273 (ronde toren met verjongende schacht en uitgekraagde reservoirbekroning; hardstenen plint, deur naar de Bergweg met gedenksteen; schacht met smalle en rondboogvensters; reservoir met lisenen, per vak een vierkant en een langwerpig venster, bovenin vensters afgewisseld met ankers; puntdak met na 1900 gewijzigde overstek en ingekorte lantaarnvormige ontluchting)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Zeist) (Overzicht Watertoren - Zeist - 20372027 - RCE.jpg, Zeist Watertoren 9161.JPG)",
      "PDOK BAG-pand 0355100000723944, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

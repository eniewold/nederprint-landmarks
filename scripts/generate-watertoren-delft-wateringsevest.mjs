// Watertoren aan de Wateringsevest in Delft (Kalverbos 22). Gebouwd in 1895 naar ontwerp van gemeentearchitect M.A.C. Hartman,
// in neorenaissancestijl; 29 m hoog, Intze-reservoir van 600 m³ van geklonken stalen platen, rijksmonument 525246. Sinds 2022
// zit kunstcentrum RADIUS in het pompgebouw (1918-1919) en het ondergrondse bassin ernaast. Een ronde toren in baksteen op een
// hardstenen plint: een onderste geleding met de deur en drie rondboogvensters, een hardstenen lijst, een licht verjongende
// schacht met vier rondboogvensters en acht lancetvensters, een metselwerklijst tussen twee hardstenen banden, dan de schuine
// overkraging van gemetselde gewelfjes tussen ijzeren liggers naar de bredere reservoirmantel. De mantel heeft een ijzeren band
// en een sierband, zestien rondboogvensters in een blinde arcade, een hoge kroonlijst met zestien ronde openingen en een
// borstwering van 32 kantelen rond een plat dak met een gemetseld traptorentje met kantelen in het midden (register, foto's).
//
// Oorsprong op het hart van de cirkel van BAG-pand 0503100000024873 (straal 5,63 m: het bovenaanzicht van de kroonlijst).
// Het AHN ligt hier ongeveer 1 m zuidwestelijker dan de BAG (het pompgebouw ernaast verschuift even ver); vorm en hoogtes komen
// uit het AHN, de plaats uit de BAG. Lokale X-as = RD-oost, Y = RD-noord; hoeken hieronder in graden linksom vanaf oost.
// Maaiveld AHN-DTM NAP +2,15. Maten: dak (NAP +28,25), kantelen (+29,1) en traptoren (+31,5 à +32,2) uit het AHN-DSM, de straal
// van de kroonlijst uit BAG en DSM; alle hoogtes daaronder en de stralen van schacht en mantel uit de vrijwel frontale RCE-foto
// "Watertoren, exterieur - Delft - 20050547 - RCE.jpg" (vanaf het zuiden), geschaald op de kantelen (26,95 m) en de kroonlijst.
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [83877.12, 448109.35];
const AXIS = [1, 0];
const GROUND_NAP = 2.15;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 45,63, noord 45,79, west 45,68, zuid 45,59),
// gemeten 2026-11-06. Het PDOK-pand staat op 45,45.
const GROUND_ELLIPSOID = 45.59;

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
const archNiche = (f, w, z0, z1, depth = 0.3, ang = 55, out = 1.2) => {
  const apex = z1 + (w / 2) * Math.tan(rad(ang));
  return hull([f - depth, f + out].flatMap((x) => [[x, -w / 2, z0], [x, w / 2, z0], [x, -w / 2, z1], [x, w / 2, z1], [x, 0, apex]]));
};

// ---------- hoogtes boven het maaiveld (NAP +2,15) ----------
const H = {
  plinth: 0.9, // hardstenen plint
  plinthTop: 1.05, // afgeschuinde bovenkant van de plint
  ledge: 5.0, // onderkant van de hardstenen lijst tussen de geledingen
  ledgeTop: 5.45,
  shaft: 5.75, // schacht vanaf de schuine afdekking van de lijst
  shaftTop: 14.2, // onderste hardstenen band
  band: 14.35,
  corbel: 14.85, // overkraging vanaf de bovenste band
  corbelTop: 17.4, // ijzeren band onder de mantel
  drip: 17.8,
  drum: 17.9,
  string: 19.2, // lijst boven de sierband
  stringTop: 19.4,
  cornice: 23.6, // kroonlijst boven de arcade
  corniceTop: 24.55,
  frieze: 24.7, // hoge kroonlijst met de ronde openingen
  friezeTop: 25.78,
  coping: 25.85,
  roof: 26.1, // plat dak (AHN NAP +28,25)
  merlon: 26.95, // kantelen (AHN NAP +29,1)
  turret: 29.25, // traptorentje (AHN NAP +31,5)
  turretMerlon: 29.95, // kantelen van het torentje (AHN tot NAP +32,2)
};
const R = {
  plinth: 4.65,
  lower: 4.5, // onderste geleding aan de voet
  lowerTop: 4.35,
  ledge: 4.5,
  shaft: 4.08,
  shaftTop: 3.72,
  band: 3.85,
  drum: 5.36, // reservoirmantel
  drip: 5.5,
  string: 5.45,
  cornice: 5.65, // BAG 5,63
  frieze: 5.48,
  coping: 5.56,
  parapetInner: 4.75,
  turret: 1.45,
};
const MERLONS = 16; // in werkelijkheid 32; 16 zodat kantelen en openingen minstens 0,9 m breed zijn
const DOOR_DEG = 225; // deur aan de zuidwestkant (RCE-foto, geschat)
const BAY0 = -83; // venster van de arcade recht tegenover de RCE-foto (vanaf het zuiden), geschat uit de foto
const TURRET = [0.7, 0.9]; // traptoren in het AHN 1,1 m noordoostelijk van het hart

// ---------- toren: één omwentelingsprofiel ----------
const tower = rev([
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.lower, H.plinthTop], [R.lowerTop, H.ledge],
  [R.ledge, H.ledge + 0.15], [R.ledge, H.ledgeTop], [R.shaft, H.shaft], [R.shaftTop, H.shaftTop],
  [R.band, H.band], [R.band, H.corbel], [R.drum + 0.04, H.corbelTop], [R.drip, H.corbelTop + 0.14], [R.drip, H.drip],
  [R.drum, H.drum], [R.drum, H.string - 0.09], [R.string, H.string], [R.string, H.stringTop], [R.drum, H.stringTop + 0.09],
  [R.drum, H.cornice], [R.cornice, H.cornice + 0.29], [R.cornice, H.corniceTop], [R.frieze, H.frieze],
  [R.frieze, H.friezeTop], [R.coping, H.coping], [R.coping, H.roof], [0, H.roof],
]);
// Kantelen: 16 sectoren van een halve steek (buiten 1,09 m, binnen 0,93 m breed; openingen even breed).
const merlon = (() => {
  const half = 180 / MERLONS / 2, pts = [];
  for (let i = 0; i <= 4; i++) { const a = rad(-half + (i / 4) * 2 * half); pts.push([R.coping * Math.cos(a), R.coping * Math.sin(a)]); }
  for (let i = 4; i >= 0; i--) { const a = rad(-half + (i / 4) * 2 * half); pts.push([R.parapetInner * Math.cos(a), R.parapetInner * Math.sin(a)]); }
  return prism(pts, H.roof - 0.05, H.merlon);
})();
const merlons = union(around(merlon, every(BAY0, 360 / MERLONS, MERLONS)));
// Traptorentje: ronde schacht met vijf kantelen rond een laag dakje, deur aan de zuidkant.
const turret = (() => {
  const body = Manifold.cylinder(H.turret - H.roof + 0.05, R.turret, R.turret, 48).translate([0, 0, H.roof - 0.05]);
  const cap = Manifold.cylinder(0.7, R.turret - 0.55, 0.15, 24).translate([0, 0, H.turret - 0.05]);
  const m = (() => {
    const half = 18, pts = [];
    for (let i = 0; i <= 3; i++) { const a = rad(-half + (i / 3) * 2 * half); pts.push([R.turret * Math.cos(a), R.turret * Math.sin(a)]); }
    for (let i = 3; i >= 0; i--) { const a = rad(-half + (i / 3) * 2 * half); pts.push([(R.turret - 0.6) * Math.cos(a), (R.turret - 0.6) * Math.sin(a)]); }
    return prism(pts, H.turret - 0.05, H.turretMerlon);
  })();
  const door = place(archNiche(R.turret, 0.9, H.roof, H.roof + 1.6, 0.3, 55, 0.6), { deg: -90 });
  return union([body, cap, ...around(m, every(-90, 72, 5))]).subtract(door).translate([...TURRET, 0]);
})();
// Stoep voor de deur: twee treden van 0,45 m (geschat; de voet staat op de foto's achter struiken).
const stoep = place(union([
  prism([[4.2, -1.1], [R.plinth + 0.9, -1.1], [R.plinth + 0.9, 1.1], [4.2, 1.1]], BASE, 0.45),
  prism([[4.2, -1.1], [R.plinth + 0.45, -1.1], [R.plinth + 0.45, 1.1], [4.2, 1.1]], BASE, 0.9),
]), { deg: DOOR_DEG });

// ---------- overkraging: 24 velden tussen de liggers, 0,2 m terug ----------
// Elk veld is een kegelstrook tussen twee liggers; de bovenkant loopt onder 63 graden naar binnen dicht.
const vault = (() => {
  const z0 = H.corbel + 0.15, z1 = H.corbelTop - 0.2, depth = 0.2, half = (360 / 24 / 2) - 4.5;
  const rAt = (z) => R.band + ((R.drum + 0.04 - R.band) * (z - H.corbel)) / (H.corbelTop - H.corbel);
  const pts = [];
  for (const d of [-half, 0, half]) {
    const c = Math.cos(rad(d)), s = Math.sin(rad(d));
    for (const [r, z] of [[rAt(z0) + 0.4, z0], [rAt(z1) + 0.4, z1], [rAt(z0) - depth, z0], [rAt(z1 - 0.7) - depth, z1 - 0.7], [rAt(z1), z1]]) pts.push([r * c, r * s, z]);
  }
  return hull(pts);
})();

// ---------- vensters, deur en arcade als blinde nissen ----------
// - onderste geleding: deur (1,4 m) aan de zuidwestkant, drie rondboogvensters op de andere diagonalen;
// - schacht: vier rondboogvensters op de diagonalen, acht lancetvensters hoog in de schacht;
// - mantel: zestien arcadevelden (0,25 m terug) met elk een rondboogvenster, zestien ronde openingen in de hoge kroonlijst;
// alle vensters minstens 0,9 m breed zodat ze op 1:1000 te zien zijn; bogen als spitse bogen van 50 tot 60 graden.
const diag = every(45, 90, 4);
const bays = every(BAY0, 22.5, 16);
const arcade = union(around(archNiche(R.drum, 1.55, 19.75, 22.45, 0.25, 50, 0.9), bays));
const openings = union([
  ...around(archNiche(4.42, 1.4, H.plinth, 2.6, 0.3, 50), [DOOR_DEG]),
  ...around(archNiche(4.4, 1.0, 1.7, 2.75, 0.3, 50), diag.filter((d) => d !== DOOR_DEG)),
  ...around(archNiche(4.0, 0.9, 7.0, 8.6, 0.3, 55), diag),
  ...around(archNiche(3.8, 0.9, 11.4, 12.5, 0.3, 60), every(0, 45, 8)),
  ...around(vault, every(0, 15, 24)),
  ...around(archNiche(R.drum - 0.25, 0.9, 20.1, 21.6, 0.3, 55, 0.9), bays),
  ...around(niche(R.frieze, 0.9, 24.95, 25.6), bays),
]);

const all = union([tower, merlons, turret, stoep]).subtract(arcade).subtract(openings);

await writeLandmark({
  slug: "watertoren-delft-wateringsevest",
  base: BASE,
  nodes: [["building:watertoren-plint-schacht-overkraging-reservoir-kantelen-en-traptoren", all]],
  catalog: {
    name: "Watertoren Wateringsevest",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0503100000024873"],
    description:
      "Oorsprong op het hart van de ronde BAG-voetafdruk (straal 5,63 m) op het maaiveld (NAP +2,15 m), X-as naar RD-oost. Hardstenen plint; onderste geleding (straal 4,5 m) met deur aan de zuidwestkant, stoep en drie boogvensters tot de lijst op 5,45 m; licht verjongende schacht (straal 4,08 tot 3,72 m) met vier boogvensters en acht lancetvensters tot de band op 14,85 m; schuine overkraging met 24 velden tot 17,4 m; reservoirmantel (straal 5,36 m) met ijzeren band, lijst, zestien arcadevelden met vensters, kroonlijst op 24,55 m, hoge kroonlijst met zestien ronde openingen; plat dak op 26,1 m met 16 kantelen tot 26,95 m en een traptorentje met kantelen tot 29,95 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1895,
      architect: "M.A.C. Hartman (gemeentearchitect Delft)",
      rijksmonument: 525246,
      publishedHeightM: 29,
      reservoirM3: 600,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 28.25,
      ahnMerlonNapM: 29.1,
      ahnTurretNapM: 32.2,
      plinthRadiusM: R.plinth,
      lowerStageM: [H.plinth, H.ledgeTop],
      shaftRadiusFootM: R.shaft,
      shaftRadiusTopM: R.shaftTop,
      corbelM: [H.corbel, H.corbelTop],
      drumRadiusM: R.drum,
      corniceRadiusM: R.cornice,
      roofM: H.roof,
      merlons: MERLONS,
      merlonsReal: 32,
      merlonTopM: H.merlon,
      topM: H.turretMerlon,
      entranceDegrees: DOOR_DEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Delft_Wateringsevest) (1895, M.A.C. Hartman, neorenaissance, 29 m, reservoir 600 m³; kunstcentrum RADIUS in pompgebouw en bassin sinds 2022)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/525246 (ronde toren van 29 m op hardstenen plint, twee geledingen gescheiden door een hardstenen lijst, deur en drie rondboogvensters, vier rondboogvensters en acht lancetvensters, overkraging van schuine gewelfjes met ijzeren liggers, zestien rondboogvensters, hoge kroonlijst met zestien ronde openingen, 32 kantelen, plat dak met gemetseld traptorentje met kantelborstwering)",
      "https://commons.wikimedia.org/wiki/Category:Water_tower_in_Delft (Watertoren, exterieur - Delft - 20050547 - RCE.jpg, Delft, de watertoren aan het Kalverbos RM525246 foto6 2016-03-13 11.48.jpg, Water tower Delft 2020.jpg, Delft - Watertoren (2010).jpg, 525246 Delft Watertoren.jpg, Watertoren, Delft.jpg)",
      "PDOK BAG-pand 0503100000024873, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

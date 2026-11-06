// Watertoren aan de Lauwerhof in Utrecht (Lauwerhof 29). Gebouwd in 1895-1896 voor de Utrechtse Waterleiding Maatschappij
// naar ontwerp van L.C. Dumont, in neorenaissancestijl; 39 m hoog, Intze-reservoir van 1500 m³ (F.A. Neumann, Aken),
// rijksmonument 514252. Sinds 2010 woningen en een vergaderruimte, daarvoor het Waterleidingmuseum. Een ronde toren geheel in
// baksteen: een lage onderbouw met een waterlijst, een licht verjongende schacht met boogvensters en een oculus, onder de
// overkraging een rondboogfries, dan de getrapte, holle overkraging (ijzeren balken tussen gemetselde vlakken) naar de
// bredere reservoirmantel. De mantel heeft onderaan een band met kleine vensters, erboven een blinde arcade met per travee
// een venster, oculi onder de kroonlijst en bovenop een borstwering met kantelen rond een vlak kegeldak (register, foto's).
//
// Oorsprong op het hart van de cirkel van BAG-pand 0344100000031105 (straal 8,42 m, de bovenaanzichtcontour van de
// reservoirmantel); het hart van de hoge DSM-punten ligt 0,2 m ernaast. Lokale X-as = RD-oost, Y = RD-noord; hoeken
// hieronder in graden linksom vanaf oost. Maaiveld AHN-DTM NAP +3,55. Maten: borstwering, kantelen en dak uit het AHN-DSM
// (kantelen NAP +42,65, dakrand +41,25 op 7 m, top van de dakkap +43,39), de straal van de mantel uit BAG, DSM en luchtfoto
// (16,6 m); alle hoogtes daaronder en de stralen van schacht, fries en onderbouw uit de foto's "Water tower (Lauwerhof
// Utrecht).jpg" (telelens, bijna recht van opzij), "Exterieur OVERZICHT - Utrecht - 20339929 - RCE.jpg" en
// "Onderbouw - Utrecht - 20235333 - RCE.jpg", geschaald op de mantel en de top uit het AHN.
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [136594.5, 456414.98];
const AXIS = [1, 0];
const GROUND_NAP = 3.55;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 46,90, noord 46,84, west 46,93, zuid 46,94),
// gemeten 2026-11-06. Het PDOK-pand staat op 46,80.
const GROUND_ELLIPSOID = 46.84;

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

// ---------- hoogtes boven het maaiveld (NAP +3,55) ----------
const H = {
  plinthBatter: 3.98, // onderbouw loopt tot hier licht naar binnen (6,6 naar 6,5 m)
  waterTable: 4.4, // onderkant van de waterlijst (kraag onder 50 graden)
  waterTableTop: 4.8,
  shaftFoot: 5.3, // schuine afdekking van de waterlijst naar de schacht
  frieze: 18.3, // onderkant van het rondboogfries (kraag)
  friezeTop: 20.35,
  band: 20.8, // lijst tussen fries en overkraging
  bellTop: 24.0, // overkraging eindigt onder de onderste kroonlijst van de mantel
  drumCornice: 24.36,
  drum: 25.1, // mantel vanaf de onderste kroonlijst
  cornice: 35.9, // bovenste kroonlijst
  corniceTop: 36.7,
  crenel: 38.1, // onderkant van de kantelopeningen (DSM-ring NAP +41,9)
  merlon: 39.1, // kantelen (AHN NAP +42,65)
  roofEdge: 37.7, // dakrand binnen de borstwering (AHN NAP +41,25 op 7 m)
  roofApex: 38.95, // dak 10 graden (AHN-helling 0,17)
  vent: 39.84, // dakkap in het midden (AHN NAP +43,39)
};
const R = {
  plinth: 6.6,
  plinthTop: 6.5,
  waterTable: 6.85,
  shaftFoot: 6.1,
  shaftTop: 5.6,
  frieze: 5.9,
  band: 6.05,
  bellTop: 8.2,
  drumCornice: 8.5,
  drum: 8.25, // BAG 8,42 inclusief kroonlijsten; luchtfoto 16,6 m
  cornice: 8.55,
  parapet: 8.35,
  parapetInner: 7.5,
};
const MERLONS = 26; // foto's: 13 à 14 op de halve omtrek
const DOOR_DEG = 45; // ingang aan de noordoostkant, naar het binnenterrein (geschat)

// Overkraging: hol profiel van straal 6,05 op 20,8 m naar 8,2 op 24,0 m; de helling dr/dz loopt van 0,5 tot 0,84
// (50 graden), zodat de kraag zonder steun te printen is.
const bell = (() => {
  const dz = H.bellTop - H.band, dr = R.bellTop - R.band, s1 = 0.84, s0 = (2 * dr) / dz - s1;
  return Array.from({ length: 9 }, (_, i) => {
    const t = (i / 8) * dz;
    return [R.band + s0 * t + ((s1 - s0) / (2 * dz)) * t * t, H.band + t];
  });
})();

// ---------- toren: één omwentelingsprofiel ----------
const tower = rev([
  [0, BASE], [R.plinth, BASE], [R.plinthTop, H.plinthBatter], [R.waterTable, H.waterTable], [R.waterTable, H.waterTableTop],
  [R.shaftFoot, H.shaftFoot], [R.shaftTop, H.frieze], [R.frieze, H.frieze + 0.36], [R.frieze, H.friezeTop], [R.band, H.friezeTop + 0.18],
  ...bell, [R.drumCornice, H.drumCornice], [R.drumCornice, H.drum], [R.drum, H.drum], [R.drum, H.cornice],
  [R.cornice, H.cornice + 0.35], [R.cornice, H.corniceTop], [R.parapet, H.corniceTop], [R.parapet, H.crenel],
  [R.parapetInner, H.crenel], [R.parapetInner, H.roofEdge], [0, H.roofApex],
]);
// Kantelen: 26 sectoren van een halve steek (buiten 1,0 m, binnen 0,9 m breed; openingen even breed).
const merlon = (() => {
  const half = 180 / MERLONS / 2, pts = [];
  for (let i = 0; i <= 4; i++) { const a = rad(-half + (i / 4) * 2 * half); pts.push([R.parapet * Math.cos(a), R.parapet * Math.sin(a)]); }
  for (let i = 4; i >= 0; i--) { const a = rad(-half + (i / 4) * 2 * half); pts.push([R.parapetInner * Math.cos(a), R.parapetInner * Math.sin(a)]); }
  return prism(pts, H.crenel - 0.05, H.merlon);
})();
const merlons = union(around(merlon, every(0, 360 / MERLONS, MERLONS)));
// Dakkap in het midden (luchtfoto: vierkant, circa 1,2 m).
const vent = prism([[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]], H.roofApex - 0.4, H.vent);
// Stoep voor de deur: één trede van 0,35 m.
const step = place(prism([[5.8, -1.2], [R.plinth + 1.1, -1.2], [R.plinth + 1.1, 1.2], [5.8, 1.2]], BASE, 0.35), { deg: DOOR_DEG });

// ---------- vensters, deur en arcade als blinde nissen ----------
// - onderbouw: zes boogopeningen op 45 + k x 60 graden, waarvan de deur (1,4 m breed) aan de noordoostkant;
// - schacht: zes grote boogvensters boven de openingen van de onderbouw, zes kleinere ertussen hoger op, drie oculi;
// - fries: 24 rondboogjes onder de overkraging;
// - mantel: 16 kleine vensters in de onderste band, 16 arcadevelden (0,3 m terug) met elk een venster, 16 oculi;
// alle vensters minstens 0,9 m breed zodat ze op 1:1000 te zien zijn; bogen als spitse bogen van 50 tot 55 graden.
const plinthDegs = every(DOOR_DEG, 60, 6);
const bayDegs = every(11.25, 22.5, 16);
const arcade = union(around(archNiche(R.drum, 2.3, 29.4, 33.0, 0.3, 50), bayDegs));
const openings = union([
  ...around(archNiche(R.plinth, 1.4, 0.35, 2.9), [DOOR_DEG]),
  ...around(archNiche(R.plinth, 1.3, 0.8, 2.8), plinthDegs.slice(1)),
  ...around(archNiche(6.0, 1.4, 5.9, 8.6), plinthDegs),
  ...around(archNiche(5.85, 0.9, 10.6, 12.6), every(DOOR_DEG + 30, 60, 6)),
  ...around(niche(5.7, 1.0, 15.4, 16.3), every(DOOR_DEG, 120, 3)),
  ...around(archNiche(R.frieze, 0.9, 18.9, 19.7), every(7.5, 15, 24)),
  ...around(niche(R.drum, 0.9, 25.85, 26.75), bayDegs),
  ...around(niche(R.drum - 0.3, 0.9, 30.1, 32.7), bayDegs),
  ...around(niche(R.drum, 0.9, 34.6, 35.35), every(0, 22.5, 16)),
]);

const all = union([tower, merlons, vent, step]).subtract(arcade).subtract(openings);

await writeLandmark({
  slug: "watertoren-utrecht-lauwerhof",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-fries-overkraging-reservoir-en-kantelen", all]],
  catalog: {
    name: "Watertoren Lauwerhof",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[10, 0], [-10, 0], [0, 10], [0, -10]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000031105"],
    description:
      "Oorsprong op het hart van de ronde BAG-voetafdruk (straal 8,42 m) op het maaiveld (NAP +3,55 m), X-as naar RD-oost. Bakstenen onderbouw tot 4,8 m met waterlijst, deur aan de noordoostkant en boogopeningen; licht verjongende schacht (straal 6,1 tot 5,6 m) met boogvensters en oculi tot 18,3 m; rondboogfries tot 20,8 m; holle overkraging tot 24,0 m; reservoirmantel (straal 8,25 m) met vensterband, blinde arcade met zestien vensters en oculi tot de kroonlijst op 36,7 m; borstwering met 26 kantelen tot 39,1 m rond een vlak kegeldak met dakkap. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1896,
      architect: "L.C. Dumont (Utrechtse Waterleiding Maatschappij)",
      rijksmonument: 514252,
      publishedHeightM: 39,
      reservoirM3: 1500,
      ahnGroundNapM: GROUND_NAP,
      ahnMerlonNapM: 42.65,
      ahnTopNapM: 43.39,
      plinthRadiusM: R.plinth,
      plinthM: H.waterTableTop,
      shaftRadiusFootM: R.shaftFoot,
      shaftRadiusTopM: R.shaftTop,
      friezeM: [H.frieze, H.band],
      bellM: [H.band, H.bellTop],
      drumRadiusM: R.drum,
      drumM: [H.drum, H.corniceTop],
      merlons: MERLONS,
      merlonTopM: H.merlon,
      roofApexM: H.roofApex,
      topM: H.vent,
      entranceDegrees: DOOR_DEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Utrecht_Lauwerhof) (1895-1896, L.C. Dumont, neorenaissance, 39 m, Intze-reservoir van 1500 m³ op circa 30 m van F.A. Neumann; nu woningen en vergaderruimte)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/514252 (ronde toren van 39 m in baksteen met geglazuurde baksteen, kunststeen en natuursteen; schacht eindigt met een rondboogfries, gemetselde overkraging met ijzeren balken naar het bredere reservoir met lichtspleten, korfboogfries en kantelen)",
      "https://commons.wikimedia.org/wiki/Category:Water_tower_(Lauwerhof_Utrecht) (Water tower (Lauwerhof Utrecht).jpg, Utrecht - Watertoren Lauwerhof - 20220223 PvE (Q2621420).jpg, Utrecht, de watertoren aan het Lauwerhof RM514252 foto3 2015-11-01 13.59.jpg, Watertoren Lauwerhof.jpg, RCE-foto's 20235332, 20235333, 20339928 en 20339929)",
      "PDOK BAG-pand 0344100000031105, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

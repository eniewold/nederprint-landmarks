// Watertoren Mallegat in Rotterdam (Mallegatpark, Feijenoord). Gebouwd in 1915-1916 op het terrein van de gasfabriek
// Feijenoord: een gemetselde fabrieksschoorsteen waaraan een betonnen reservoir is gehangen. Het bluswater circuleerde door
// de schoorsteen, die het verwarmde. De Nederlandse Watertoren Stichting vroeg vergeefs om de status van rijksmonument (de
// laatste combinatie van watertoren en schoorsteen in Nederland); het is een gemeentelijk monument en is gerestaureerd.
// Opbouw van onder naar boven: een achtkante bakstenen voet met een plint en verdiepte velden onder een afgeschuinde kap,
// een ronde, verjongende schoorsteenschacht, een betonnen omgang op een kraag, een kort stuk schacht, een kegelvormige
// onderkant met consoles naar een achtkante ringbalk, het cilindrische reservoir, een dikke rand als dakoverstek, een licht
// hellend dak en de schoorsteenmond die erdoorheen steekt.
//
// Oorsprong op het hart van BAG-pand 0599100010037769 (regelmatige achthoek, straal tot de hoeken 2,05 m, 11,9 m²). Het
// hart van de schoorsteenmond in het AHN-DSM ligt 0,4 m ernaast (pixels van 0,5 m). Lokale X-as 3,2 graden linksom vanaf
// RD-oost, zodat een hoek van de BAG-achthoek op de X-as ligt. Maaiveld AHN-DTM NAP +3,56 (mediaan rond de voet).
// Maten: de top van de schoorsteenmond (NAP +30,68), het dak (NAP +28,57 op 3,5 m tot +29,02 op 2 m) en de straal van de
// dakrand (luchtfoto 3,65 m) uit AHN en luchtfoto; de achthoek uit de BAG; alle andere hoogtes en stralen uit de foto's
// "Rotterdam - Watertoren Mallegat.jpg" (2009) en "Rotterdam persoonshaven schoorsteen.jpg", beide van de noordkant,
// geschaald op de achthoek en de top uit het AHN.
import { Manifold, CrossSection, ccw, circle, hull, union, prism, place, ring3, writeLandmark } from "./efteling-kit.mjs";

const rad = (deg) => (deg * Math.PI) / 180;
const ORIGIN = [94849.91, 435293.96];
const AXIS_DEG = 3.2;
const AXIS = [+Math.cos(rad(AXIS_DEG)).toFixed(5), +Math.sin(rad(AXIS_DEG)).toFixed(5)];
const GROUND_NAP = 3.56;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 47,16, west 47,21, noord 47,15, zuid 47,21),
// gemeten 2026-11-07. Het PDOK-pand staat op 47,11.
const GROUND_ELLIPSOID = 47.15;

const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (start, step, n) => Array.from({ length: n }, (_, k) => start + step * k);
const octagon = (rc) => circle([0, 0], rc, 8, 0); // hoeken op 0, 45, ... graden
const COS8 = Math.cos(rad(22.5));
// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder
// 56 graden op.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 0.3, za = z1 + 1.5 * depth, zb = z1 - 0.45;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};

// ---------- hoogtes boven het maaiveld (NAP +3,56) ----------
const H = {
  plinth: 0.9, // gemetselde plint rond de voet
  plinthTop: 1.06, // afschuining van de plint (45 graden)
  panel: 3.3, // verdiepte velden in de bovenste helft van de achthoek
  panelTop: 5.25,
  octagon: 5.6, // bovenkant van de achtkante voet
  shaftFoot: 5.85, // afgeschuinde kap naar de ronde schacht
  corbel: 17.9, // kraag onder de omgang (43 graden)
  gallery: 18.8, // onderkant van de omgangsplaat
  galleryTop: 19.1,
  soffit: 19.05, // kegelvormige onderkant van het reservoir begint op de omgang (in het echt 1,5 m hoger, zie README)
  ring: 21.3, // achtkante ringbalk onder het reservoir
  ringTop: 22.35,
  rimFoot: 23.45, // onderkant van de dakrand (45 graden)
  rim: 24.07, // dakrand verticaal vanaf hier
  roofEdge: 25.0, // dakrand (AHN NAP +28,57 op 3,5 m)
  roofTop: 25.6, // dak bij de schoorsteenmond (AHN NAP +29,02 op 2 m, +28,8 op 2,5 m: helling 0,3)
  top: 27.12, // schoorsteenmond (AHN NAP +30,68)
};
const R = {
  plinth: 2.21, // straal tot de hoeken
  octagon: 2.05, // BAG
  shaftFoot: 1.55,
  shaftTop: 1.32,
  gallery: 2.17,
  shaftUpper: 1.4,
  ring: 3.1 / COS8, // straal tot de hoeken; vlakken op 3,1 m
  tank: 3.08,
  rim: 3.65, // luchtfoto
  flue: 1.1,
};

// ---------- achtkante voet ----------
const foot = union([
  prism(octagon(R.plinth), BASE, H.plinth),
  hull([...ring3(octagon(R.plinth), H.plinth), ...ring3(octagon(R.octagon), H.plinthTop)]),
  prism(octagon(R.octagon), H.plinth - 0.05, H.octagon),
  hull([...ring3(octagon(R.octagon), H.octagon - 0.01), ...ring3(circle([0, 0], R.shaftFoot, SEG), H.shaftFoot)]),
]);
// Verdiepte velden (0,15 m) tussen hoekpenanten op de acht vlakken.
const panels = union(around(niche(R.octagon * COS8, 0.95, H.panel, H.panelTop, 0.15), every(22.5, 45, 8)));

// ---------- schacht, omgang en reservoir: één omwentelingsprofiel ----------
const shaft = rev([
  [0, H.shaftFoot - 0.5], [R.shaftFoot, H.shaftFoot - 0.5], [R.shaftFoot, H.shaftFoot], [R.shaftTop, H.corbel],
  [R.gallery, H.gallery], [R.gallery, H.galleryTop], [R.shaftUpper, H.galleryTop], [R.shaftUpper, H.soffit + 0.05], [0, H.soffit + 0.05],
]);
// Kegelvormige onderkant: van de schacht (straal 1,4) op de omgang naar de hoeken van de ringbalk onder 41 graden.
const soffit = hull([...ring3(circle([0, 0], R.shaftUpper, SEG), H.soffit), ...ring3(octagon(R.ring), H.ring)]);
const ring = prism(octagon(R.ring), H.ring, H.ringTop);
const tank = rev([
  [0, H.ringTop - 0.05], [R.tank, H.ringTop - 0.05], [R.tank, H.rimFoot], [R.rim, H.rimFoot + (R.rim - R.tank) + 0.05], [R.rim, H.roofEdge],
  [R.flue, H.roofTop], [R.flue, H.top], [0, H.top],
]);
// Acht consoles onder de ringbalk, midden op de vlakken: 0,9 m breed, onderkant onder 42 graden, tot 0,35 m buiten de kegel.
const console_ = hull([
  [1.3, -0.45, H.soffit], [1.3, 0.45, H.soffit], [3.1, -0.45, H.ring - 0.35], [3.1, 0.45, H.ring - 0.35],
  [3.1, -0.45, H.ring + 0.05], [3.1, 0.45, H.ring + 0.05], [1.4, -0.45, H.soffit + 0.9], [1.4, 0.45, H.soffit + 0.9],
]);
const consoles = union(around(console_, every(22.5, 45, 8)));

const all = union([foot, shaft, soffit, ring, tank, consoles]).subtract(panels);

await writeLandmark({
  slug: "watertoren-rotterdam-mallegat",
  base: BASE,
  nodes: [["building:watertoren-schoorsteen-voet-schacht-omgang-reservoir-en-mond", all]],
  catalog: {
    name: "Watertoren Mallegat",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[4, 0], [-4, 0], [0, 4], [0, -4]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0599100010037769"],
    description:
      "Oorsprong op het hart van de achtkante BAG-voetafdruk (straal 2,05 m tot de hoeken) op het maaiveld (NAP +3,56 m), X-as 3,2 graden linksom vanaf RD-oost op een hoek van de achthoek. Achtkante bakstenen voet met plint en verdiepte velden tot 5,6 m; ronde, verjongende schoorsteenschacht (straal 1,55 tot 1,32 m) tot de omgang op 18,8-19,1 m (straal 2,17 m); kegelvormige onderkant met acht consoles naar een achtkante ringbalk op 21,3 m; reservoir (straal 3,08 m) met een dakrand van 3,65 m tot 25,0 m; licht hellend dak en schoorsteenmond (straal 1,1 m) tot 27,12 m. Maten uit BAG, AHN, luchtfoto en foto's.",
    realWorld: {
      built: "1915-1916",
      function: "watertoren aan de schoorsteen van de gasfabriek Feijenoord (bluswater, door de schoorsteen verwarmd)",
      gemeentelijkMonument: true,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofEdgeNapM: 28.57,
      ahnTopNapM: 30.68,
      plinthM: H.plinth,
      octagonRadiusM: R.octagon,
      octagonM: H.octagon,
      shaftRadiusFootM: R.shaftFoot,
      shaftRadiusTopM: R.shaftTop,
      galleryM: [H.gallery, H.galleryTop],
      galleryRadiusM: R.gallery,
      ringM: [H.ring, H.ringTop],
      tankRadiusM: R.tank,
      rimRadiusM: R.rim,
      roofEdgeM: H.roofEdge,
      flueRadiusM: R.flue,
      topM: H.top,
      axisDegrees: AXIS_DEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Rotterdam_Mallegat) (1915-1916, onderdeel van de gasfabriek Feijenoord en tegelijk schoorsteen; water circuleerde voor koeling en werd door de schoorsteen verwarmd; rijksmonumentaanvraag van de Nederlandse Watertoren Stichting afgewezen, gemeentelijk monument, gerestaureerd)",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_Watertoren_Mallegat.jpg (Quistnix, 2009, CC BY-SA 2.5) en https://commons.wikimedia.org/wiki/File:Rotterdam_persoonshaven_schoorsteen.jpg, beide van de noordkant",
      "PDOK BAG-pand 0599100010037769, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-07",
    ],
  },
});

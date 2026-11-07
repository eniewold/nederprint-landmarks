// Watertoren van Sliedrecht op het voormalige waterleidingterrein (Watertorenterrein) aan de Rivierdijk, aan de Beneden
// Merwede. Gebouwd in 1886, toen de waterleiding werd aangelegd, naar ontwerp van Jan Schotel; volgens Wikipedia 28,5 m hoog
// met één reservoir van 250 m³. Sinds de buitendienststelling staat hij leeg op een braakliggend terrein; de pompgebouwen eromheen
// zijn grotendeels ruïnes. Een ronde, taps toelopende bakstenen schacht (inmiddels grotendeels met cement bepleisterd) op een
// iets bredere voet met een plint, een boogfries met een uitkragende band en een rondboogdeur met een oculus erboven; bovenaan
// een uitkragend rondboogfries op consoles en een ronde reservoirmantel met smalle spleetvensters, afgedekt door een overstekende
// achtkante dakplaat met een flauwe achtzijdige piramide, vier ventilatiekokers en een makelaar (foto's op Commons).
//
// Oorsprong op het hart van de cirkelfit van de toren in BAG-pand 0610100000007644 (straal 5,93 m, afwijking < 0,21 m); het
// achtkante dak en de top in het AHN-DSM 0,5 m liggen er hooguit 0,1 m naast. Lokale X-as naar RD-oost: de vlakken van het
// achtkante dak staan op de luchtfoto naar het noorden, oosten, zuiden en westen. Hoeken in graden linksom vanaf de lokale X-as.
// Maaiveld AHN-DTM NAP +3,9 rond de toren (3,6 tot 3,9; in de ommuurde ruïnehof aan de zuidwestkant ligt het tot NAP +2,1).
// Maten: dakvlakken en top uit het AHN-DSM (top NAP +32,46, dus 28,55 m, helling 0,52 tot 0,56), dakplaat 11,3 m over de vlakken
// op de luchtfoto (8 cm) en in het DSM; de aanbouwen uit de BAG en het DSM (noord: zadeldak met de nok noord-zuid, NAP +8 tot
// +12; zuidwest: plat dak NAP +7,5). Schacht, friezen, reservoir en vensters uit de foto's "Februari 2014 2014-03-12 12-00.jpg"
// (vanuit het zuiden), "De watertoren van Sliedrecht, gezien vanaf de Beneden Merwede (01).jpg" en "Sliedrecht Watertoren
// 6855.JPG" (vanaf de Rivierdijk), geschaald op de dakrand in het AHN en de voet in de BAG.
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [114511.95, 425808.5];
const AXIS = [1, 0];
const GROUND_NAP = 3.9;
// De ruïnehof aan de zuidwestkant ligt in het PDOK-terrein tot 1,2 m lager (46,14 bij de zuidgevel van de aanbouw): de
// onderkant zakt daarom 1,4 m in, zodat de aanbouw daar niet zweeft.
const BASE = -1.4;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 47,57, west 47,54, noord 47,55, noordoost 47,47),
// gemeten 2026-11-07. Het PDOK-pand staat op 45,96 (de ruïnehof); zijn top op 76,04.
const GROUND_ELLIPSOID = 47.47;

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const octagon = (apothem) => Array.from({ length: 8 }, (_, k) => polar(apothem / Math.cos(rad(22.5)), 22.5 + 45 * k));
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 56 graden op.
// Bij een lage nis (z1 - z0 < 1,5) houdt het snijlichaam maar `out` m buiten het vlak op, anders wordt het plafond flauwer.
const niche = (f, w, z0, z1, depth = 0.3, out = 1.0) => {
  const a = f - depth, b = f + out, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Rond venster (oculus) als ruitvormige nis: halve breedte hw, halve hoogte hh (hh/hw >= 1,2, dus flanken van 50 graden of steiler).
const oculus = (f, zc, hw, hh, depth = 0.3) => {
  const a = f - depth, b = f + 1.0;
  return hull([a, b].flatMap((x) => [[x, 0, zc - hh], [x, -hw, zc], [x, hw, zc], [x, 0, zc + hh]]));
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, phase = 0) => Array.from({ length: n }, (_, k) => phase + (360 / n) * k);

// ---------- hoogtes boven het maaiveld (NAP +3,9) ----------
const H = {
  plinth: 0.6, // plint van de voet, schuin afgezet tot 0,95 m
  plinthTop: 0.95,
  baseWall: 4.2, // bovenkant van het muurwerk van de voet, begin van de boogfries
  baseFrieze: 4.45, // boogfries kraagt onder 51 graden uit
  baseBand: 5.3, // bovenkant van de band; daarboven een schuine afzaat naar de schacht
  shaftFoot: 5.75,
  shaftTop: 17.9, // begin van het rondboogfries onder het reservoir
  friezeTop: 19.6, // het fries kraagt onder 72 graden uit tot de band onder de mantel
  ledge: 19.9,
  reservoir: 20.0,
  corniceFoot: 23.2, // de overstekende dakplaat rust in het model op een kraag van 50 graden (hoeken) tot 61 graden (vlakken)
  corniceUnder: 24.9,
  corniceTop: 25.4, // dakrand (AHN NAP +29,3 à +29,6 aan de rand)
  apex: 28.55, // top van de piramide (AHN NAP +32,46; Wikipedia 28,5 m)
  finialTop: 29.6, // makelaar
  ventTop: 27.4, // ventilatiekokers (AHN NAP +31,2 op 3,5 tot 4 m)
};
const R = {
  plinth: 5.85, // BAG-cirkelfit 5,93 m
  base: 5.55,
  band: 5.75,
  shaftFoot: 5.1, // luchtfoto: 10,2 m doorsnede net boven de voet
  shaftTop: 4.25,
  frieze: 4.8,
  reservoir: 4.7, // foto: 9,4 m doorsnede
  cornice: 5.65, // apothema van de achtkante dakplaat (luchtfoto en DSM: 11,3 m over de vlakken)
};

// ---------- toren ----------
const body = rev([
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.base, H.plinthTop], [R.base, H.baseWall], [R.band, H.baseFrieze],
  [R.band, H.baseBand], [R.shaftFoot, H.shaftFoot], [R.shaftTop, H.shaftTop], [R.frieze, H.friezeTop], [R.frieze, H.ledge],
  [R.reservoir, H.reservoir], [R.reservoir, H.corniceFoot + 0.01], [0, H.corniceFoot + 0.01],
]);
// Kraag, dakplaat en achtzijdige piramide in één hull: cirkel van het reservoir, achthoek onder en boven de dakrand en de top.
const ring = (r, z, n = SEG) => Array.from({ length: n }, (_, k) => [...polar(r, (360 * k) / n), z]);
const roof = hull([
  ...ring(R.reservoir, H.corniceFoot),
  ...octagon(R.cornice).map(([x, y]) => [x, y, H.corniceUnder]),
  ...octagon(R.cornice).map(([x, y]) => [x, y, H.corniceTop]),
  [0, 0, H.apex],
]);
// Makelaar: een kegeltje van 0,9 m doorsnede op de top.
const finial = Manifold.cylinder(H.finialTop - (H.apex - 0.4), 0.45, 0.05, 24).translate([0, 0, H.apex - 0.4]);
// Vier ventilatiekokers op de piramide, op de assen (luchtfoto: 2,2 m radiaal, 1,4 m breed, hart op 3,7 m van de top). De
// opening naar buiten is weggelaten: de zijstijlen ernaast zouden dunner dan 0,8 m worden en in de export verdikt.
const vent = prism([[2.6, -0.7], [4.8, -0.7], [4.8, 0.7], [2.6, 0.7]], 25.0, H.ventTop);
const vents = union(around(vent, [0, 90, 180, 270]));

// ---------- aanbouwen (BAG-pand 0610100000007644) ----------
// Noord: zadeldak met de nok noord-zuid, 7,45 m breed (BAG), goot 4,2 m (DSM NAP +8), nok 8,1 m (DSM NAP +11,5 à +12), dus 46
// graden (net steiler dan de printhoek); topgevel naar het noorden met een rondboogdeur en een oculus (oude foto van 1886).
const NORTH = { x0: -3.15, x1: 4.3, y0: 2.0, y1: 8.5, eave: 4.2 };
const NORTH_RIDGE_X = (NORTH.x0 + NORTH.x1) / 2;
const NORTH_RIDGE = 8.1;
const north = hull([NORTH.y0, NORTH.y1].flatMap((y) => [
  [NORTH.x0, y, BASE], [NORTH.x1, y, BASE], [NORTH.x1, y, NORTH.eave], [NORTH.x0, y, NORTH.eave], [NORTH_RIDGE_X, y, NORTH_RIDGE],
]));
// Zuidwest: plat gedekte aanbouw tussen de toren en de westmuur van de ruïnehof (luchtfoto: donker plat dak; DSM NAP +7,5).
const SW = { x0: -9.2, x1: 1.0, y0: -5.2, y1: -1.8, top: 3.8 };
const southWest = prism([[SW.x0, SW.y0], [SW.x1, SW.y0], [SW.x1, SW.y1], [SW.x0, SW.y1]], BASE, SW.top);

// ---------- vensters, deuren en friezen als blinde nissen ----------
// Spleetvensters zijn in het echt 0,3 à 0,4 m breed; in het model nissen van 0,9 m zodat ze op 1:1000 te zien zijn.
const shaftR = (z) => R.shaftFoot + ((R.shaftTop - R.shaftFoot) * (z - H.shaftFoot)) / (H.shaftTop - H.shaftFoot);
const shaftLevels = [[11.2, 13.0], [15.6, 17.2]];
const reservoirLevel = [21.0, 22.8];
const DOOR_DEG = -15; // rondboogdeur met oculus aan de oostzuidoostkant (foto vanaf de rivier)
const towerCuts = union([
  // Rondboogfries onder de band van de voet: 24 boogjes, niet onder het dak van de noordaanbouw (35 tot 130 graden).
  ...around(niche(R.band, 0.9, H.baseFrieze, 4.95, 0.25, 0.3), every(24, 7.5).filter((d) => d < 35 || d > 130)),
  // Rondboogfries op consoles onder het reservoir: 16 bogen van 0,8 m (op de foto circa 20 smallere), zodat de consoles ertussen
  // minstens 0,9 m breed blijven en de export ze niet verdikt.
  ...around(niche(R.frieze, 0.8, 18.6, 19.3, 0.3, 0.3), every(16, 11.25)),
  // Spleetvensters: acht per rij in de schacht, acht in de reservoirmantel (tussen die van de schacht).
  ...shaftLevels.flatMap(([z0, z1]) => around(niche(shaftR(z1), 0.9, z0, z1), every(8, 22.5))),
  ...around(niche(R.reservoir, 0.9, ...reservoirLevel), every(8)),
  // Deur met oculus in de voet.
  place(niche(R.base, 1.4, 0, 2.6), { deg: DOOR_DEG }),
  place(oculus(R.base, 3.65, 0.45, 0.55), { deg: DOOR_DEG }), // los van het plafond van de deurnis (tot 3,05 m)
]);
// Eerst de toren uitsnijden en daarna de aanbouwen ertegen zetten: zo vullen de aanbouwen de boogjes van de voet die achter hun
// gevels vallen, in plaats van er holle ruimtes van te maken.
const annexCuts = union([
  // Topgevel van de noordaanbouw: rondboogdeur en oculus.
  place(niche(NORTH.y1, 1.4, 0, 2.8), { deg: 90, at: [NORTH_RIDGE_X, 0, 0] }),
  place(oculus(NORTH.y1, 5.4, 0.55, 0.7), { deg: 90, at: [NORTH_RIDGE_X, 0, 0] }),
  // Zuidwestaanbouw: twee rondboogvensters in de zuidgevel, één in de westgevel.
  ...[-7.6, -5.0].map((x) => place(niche(-SW.y0, 1.2, 0.9, 2.7), { deg: -90, at: [x, 0, 0] })),
  place(niche(-SW.x0, 1.2, 0.9, 2.7), { deg: 180, at: [0, -3.5, 0] }),
]);

const tower = union([body, roof, finial, vents]).subtract(towerCuts);
const all = union([tower, north, southWest]).subtract(annexCuts);

await writeLandmark({
  slug: "watertoren-sliedrecht",
  base: BASE,
  nodes: [["building:watertoren-voet-schacht-reservoir-dak-en-aanbouwen", all]],
  catalog: {
    name: "Watertoren Sliedrecht",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-12, 0], [0, 11], [7, 7]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0610100000007644"],
    description:
      "Oorsprong op het hart van de ronde toren in BAG-pand 0610100000007644 op het maaiveld (NAP +3,9 m), X-as naar RD-oost (de vlakken van het achtkante dak staan noord, oost, zuid en west). Voet met plint, boogfries en deur met oculus tot 5,3 m; taps toelopende schacht met spleetvensters tot 17,9 m; rondboogfries op consoles en ronde reservoirmantel met spleetvensters tot 23,2 m; achtkante overstekende dakplaat tot 25,4 m met een flauwe achtzijdige piramide tot 28,55 m, vier ventilatiekokers en een makelaar; noordaanbouw met zadeldak en zuidwestaanbouw met plat dak. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1886,
      architect: "Jan Schotel",
      publishedHeightM: 28.5,
      reservoirM3: 250,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 32.46,
      ahnRoofSlope: 0.54,
      bagCircleRadiusM: 5.93,
      plinthRadiusM: R.plinth,
      baseBandM: H.baseBand,
      shaftFootDiameterM: R.shaftFoot * 2,
      shaftTopDiameterM: R.shaftTop * 2,
      friezeM: [H.shaftTop, H.ledge],
      reservoirDiameterM: R.reservoir * 2,
      corniceAcrossFlatsM: R.cornice * 2,
      corniceTopM: H.corniceTop,
      apexM: H.apex,
      finialTopM: H.finialTop,
      northAnnexRidgeM: NORTH_RIDGE,
      southWestAnnexM: SW.top,
      entranceDegrees: DOOR_DEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Sliedrecht) (1886, Jan Schotel, 28,5 m, één reservoir van 250 m³)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Sliedrecht) (Februari 2014 2014-03-12 12-00.jpg vanuit het zuiden, De watertoren van Sliedrecht, gezien vanaf de Beneden Merwede (01).jpg, Watertoren in Sliedrecht 2014-03-16 09-24.jpg, Sliedrecht Watertoren 6855.JPG vanaf de Rivierdijk, Watertoren Sliedrecht.jpg uit 1886)",
      "PDOK BAG-pand 0610100000007644, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-07",
    ],
  },
});

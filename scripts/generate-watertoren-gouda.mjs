// Watertoren van Gouda, Schielands Hoge Zeedijk 20. Gebouwd in 1883 naar ontwerp van J. Schotel, 33,15 m hoog
// (Wikipedia; register: circa 33 m), reservoir 11 m middellijn; rijksmonument 517626. Een ronde neoromaanse toren van
// grijsbruine baksteen in drie geledingen: een vrij hoge onderbouw met tien rondboogvelden met gekoppelde vensters en de
// oorspronkelijke ingang aan de noordwestzijde, een schacht met tien hoge spaarvelden tussen lisenen (elk veld onder een
// rondboog met twee kleinere boogjes en een oculus), en daarboven een iets uitkragende bovenbouw bij het reservoir op een
// rondboogfries, met gekoppelde venstertjes en een tandlijst. Een vlak tienzijdig tentdak met overstek op houten
// klossen en een korte tienzijdige lantaarn, beide met koper bekleed. Aan de oostzijde de kantooraanbouw van 1974/1979
// (geen monument) in hetzelfde BAG-pand.
//
// Oorsprong op het hart van de BAG-cirkel van pand 0513100011112774 (straal 6,89 m); lokale X-as langs de aanbouw,
// 44,1 graden linksom van RD-oost. Daarmee staat een hoek van het tienzijdige dak (luchtfoto: hoek op 8 graden van
// RD-oost) op de lokale X-as: lisenen en dakhoeken op 0, 36, 72 ... graden, velden ertussen. Maaiveld AHN-DTM NAP +3,33
// (de toren staat op de kruin van de Schielands Hoge Zeedijk).
// Hoogtes uit het AHN-DSM (0,5 m): dakrand NAP +31,7 op 7,1 m uit het hart (28,4 m), dak 22 graden tot de lantaarn op
// 1,6 m uit het hart (NAP +34,1), lantaarnkap tot NAP +36,26 (32,93 m; Wikipedia 33,15 met windvaan); aanbouw plat op
// NAP +11,1 (7,8 m). Middellijnen van onderbouw, schacht en bovenbouw, de hoogtes van waterlijst, fries en tandlijst en
// de indeling van velden en vensters zijn geschat uit "Watertoren Gouda.jpg" (2007) en "Watertoren (Gouda, 1998).jpg"
// (G. Dukker, recht van voren, verticalen evenwijdig), geschaald op de dakrand uit het AHN.
import { Manifold, CrossSection, ccw, hull, union, box, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [108112.9, 446105.54];
const AXIS_DEG = 44.1;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.33;
const BASE = -0.3;
const SEG = 120;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (noord 46,824; zuidwest 46,833; oostzijde van de
// aanbouw 46,871; zuid 46,934; noordwest 46,992; einde aanbouw 47,081; noordzijde van de aanbouw 47,142), gemeten
// 2026-11-06. Het PDOK-pand staat op 46,79 met de top op 79,7.
const GROUND_ELLIPSOID = 46.824;

const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Uitkragende lijst: onderkant onder 50 graden van rIn naar r1, recht van z0 tot z1.
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
const deca = (R, z, phase = 0) => Array.from({ length: 10 }, (_, k) => {
  const t = ((36 * k + phase) * Math.PI) / 180;
  return [R * Math.cos(t), R * Math.sin(t), z];
});
// Rechthoekige nis in een vlak met normaal +X op afstand f: plafond 56 graden naar binnen omhoog.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Rondboognis: binnenkant 1,5 x de diepte hoger, zodat het boogplafond nergens vlakker dan 56 graden hangt; buiten het
// vlak f zakt het plafond onder 63 graden, zodat de nis ook bij de hoeken van een ronde gevel geen vlak plafond krijgt.
const archNiche = (f, w, z0, zSpring, depth = 0.3, y = 0) => {
  const r = w / 2;
  const arc = Array.from({ length: 9 }, (_, k) => {
    const t = (Math.PI * k) / 8;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([v, z]) => [a, v, z + 1.5 * depth]),
    ...arc.map(([v, z]) => [f, v, z]),
    ...arc.map(([v, z]) => [f + 1.5, v, Math.max(z0, z - 3)]),
    [a, -r, z0], [a, r, z0], [f + 1.5, -r, z0], [f + 1.5, r, z0],
  ]).translate([0, y, 0]);
};
// Ronde nis (oculus) met middellijn d rond hoogte zc.
const roundNiche = (f, d, zc, depth = 0.2) => {
  const ring = Array.from({ length: 12 }, (_, k) => [(d / 2) * Math.cos((Math.PI * k) / 6), zc + (d / 2) * Math.sin((Math.PI * k) / 6)]);
  return hull([...ring.map(([v, z]) => [f - depth, v, z + 1.5 * depth]), ...ring.map(([v, z]) => [f, v, z]), ...ring.map(([v, z]) => [f + 1.5, v, z - 1.5])]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const BAYS = Array.from({ length: 10 }, (_, k) => 18 + 36 * k); // velden tussen de lisenen; lisenen en dakhoeken op 36k

// ---------- maten (meters boven het maaiveld, stralen vanaf het hart) ----------
const H = {
  waterTable: [6.0, 6.6], // waterlijst boven de onderbouw (foto 6,7 m)
  shaftTop: 22.4, // onderkant van het rondboogfries
  frieze: [22.6, 23.5], // fries onder de bovenbouw
  dentil: [26.75, 27.15], // tandlijst
  eaveKraag: 27.15, // klossen onder het overstek
  eave: 28.0, // onderkant boeiboord
  eaveTop: 28.4, // dakrand (AHN NAP +31,7)
  roofTop: 30.75, // dak tegen de lantaarn (AHN NAP +34,1)
  lantern: 31.85, // bovenkant lantaarnwand
  lanternCap: 31.97,
  top: 32.93, // kap van de lantaarn (AHN NAP +36,26)
};
const R = {
  base: 6.89, // onderbouw = BAG-cirkel
  waterTable: 7.04,
  shaft: 6.8, // lisenen van de schacht
  bayShallow: 0.12, // boogveld
  bayDeep: 0.35, // veld onder de gekoppelde boogjes
  frieze: 7.1,
  upper: 6.95, // bovenbouw bij het reservoir
  dentil: 7.07,
  eave: 7.5, // hoekpunt van het tienzijdige overstek (luchtfoto 15,4 m over de hoeken, AHN 7,1 tot 7,4)
  roofTop: 1.6,
  lantern: 1.35,
  lanternCap: 1.47,
};
const BAY_W = 3.3; // veldbreedte: omtrek 42,7 m / 10 min een liseen van 0,95 m

// ---------- onderbouw: tien rondboogvelden met gekoppelde vensters, ingang noordwest (lokaal 90 graden) ----------
const DOOR_NW = 90, DOOR_NE = 18;
const baseWall = solidRev([[R.base, BASE], [R.base, H.waterTable[0] + 0.01]]);
const baseInner = solidRev([[R.base - 0.15, BASE - 1], [R.base - 0.15, H.waterTable[0] + 1]]);
const baseBays = union(around(archNiche(R.base, 3.4, 0.3, 4.0, 0.6), BAYS)).subtract(baseInner);
const baseOpenings = union([
  ...BAYS.filter((d) => d !== DOOR_NW && d !== DOOR_NE).flatMap((deg) => [
    place(archNiche(R.base - 0.15, 1.0, 1.0, 3.2, 0.3, -0.7), { deg }),
    place(archNiche(R.base - 0.15, 1.0, 1.0, 3.2, 0.3, 0.7), { deg }),
  ]),
  // Oorspronkelijke dubbele deur onder een rondboog met bovenlicht.
  place(archNiche(R.base - 0.15, 1.8, 0.3, 2.9, 0.4), { deg: DOOR_NW }),
  // Moderne deur aan de noordoostzijde.
  place(niche(R.base - 0.15, 1.3, 0.0, 2.4, 0.35), { deg: DOOR_NE }),
]);
// Stoep van twee hardstenen treden voor de oude ingang.
const stoep = union([place(box(6.4, -1.3, BASE, 7.6, 1.3, 0.15), { deg: DOOR_NW }), place(box(6.4, -1.1, BASE, 7.15, 1.1, 0.3), { deg: DOOR_NW })]);
const waterTable = union([
  ledge(R.base, R.waterTable, H.waterTable[0] + 0.18, H.waterTable[1]),
  // Afzaat van de waterlijst naar de lisenen van de schacht.
  rev([[R.shaft - 0.3, H.waterTable[1] - 0.01], [R.waterTable, H.waterTable[1] - 0.01], [R.shaft, H.waterTable[1] + 0.3], [R.shaft - 0.3, H.waterTable[1] + 0.3]]),
]);
const base = union([baseWall, waterTable]).subtract(union([baseBays, baseOpenings]));

// ---------- schacht: tien spaarvelden onder een rondboog met twee boogjes en een oculus ----------
const shaft = solidRev([[R.shaft, H.waterTable[1]], [R.shaft, H.shaftTop + 0.01]]);
const fShallow = R.shaft - R.bayShallow, fDeep = R.shaft - R.bayDeep;
const shallowInner = solidRev([[fShallow, 0], [fShallow, 30]]);
const deepInner = solidRev([[fDeep, 0], [fDeep, 30]]);
const SHAFT_WIN = BAYS.filter((_, k) => k % 2 === 0); // enkel rondboogvenster in elk tweede veld (foto's: niet alle zijden te zien)
const bayShallow = union(around(archNiche(R.shaft, BAY_W, 7.0, 19.95, 0.8), BAYS)).subtract(shallowInner);
const bayDeep = union(around(union([
  niche(R.shaft, BAY_W, 7.0, 18.9, 0.8),
  archNiche(R.shaft, 1.55, 7.0, 18.9, 0.8, -0.86),
  archNiche(R.shaft, 1.55, 7.0, 18.9, 0.8, 0.86),
]), BAYS)).subtract(deepInner);
const shaftOpenings = union([
  ...around(roundNiche(fShallow, 0.9, 20.75, 0.2), BAYS),
  ...around(archNiche(fDeep, 1.0, 11.0, 13.0, 0.3), SHAFT_WIN),
]);
const shaftAll = shaft.subtract(union([bayShallow, bayDeep, shaftOpenings]));

// ---------- fries en bovenbouw met gekoppelde venstertjes en tandlijst ----------
const frieze = ledge(R.shaft, R.frieze, ...H.frieze);
const upper = solidRev([[R.upper, H.frieze[1] - 0.01], [R.upper, H.eaveKraag + 0.01]]);
const upperInner = solidRev([[R.upper - 0.12, 0], [R.upper - 0.12, 40]]);
const upperBays = union(around(niche(R.upper, BAY_W, 23.8, 26.5, 0.5), BAYS)).subtract(upperInner);
const upperWindows = union(BAYS.flatMap((deg) => [
  place(archNiche(R.upper - 0.12, 0.9, 24.3, 25.3, 0.3, -0.75), { deg }),
  place(archNiche(R.upper - 0.12, 0.9, 24.3, 25.3, 0.3, 0.75), { deg }),
]));
const dentil = ledge(R.upper, R.dentil, H.dentil[0] + 0.15, H.dentil[1]);
const upperAll = union([frieze, upper, dentil]).subtract(union([upperBays, upperWindows]));

// ---------- tienzijdig tentdak met overstek op klossen, lantaarn ----------
const eaveKraag = hull([...Array.from({ length: 40 }, (_, k) => [R.upper * Math.cos((Math.PI * k) / 20), R.upper * Math.sin((Math.PI * k) / 20), H.eaveKraag]), ...deca(R.eave, H.eave)]);
const fascia = hull([...deca(R.eave, H.eave), ...deca(R.eave, H.eaveTop)]);
const roof = hull([...deca(R.eave, H.eaveTop), ...deca(R.roofTop, H.roofTop)]);
const lantern = hull([...deca(R.lantern, H.roofTop - 0.3), ...deca(R.lantern, H.lantern)]);
const lanternCap = hull([...deca(R.lantern, H.lantern - 0.01), ...deca(R.lanternCap, H.lanternCap), [0, 0, H.top]]);
const top = union([eaveKraag, fascia, roof, lantern, lanternCap]);

// ---------- kantooraanbouw (1974, verbouwd 1979): plat dak op 7,8 m (AHN NAP +11,1), BAG-contour ----------
const ANNEX = { x0: 1.6, x1: 21.56, y0: -12.15, y1: -6.06, top: 7.8 };
const annexBlock = box(ANNEX.x0, ANNEX.y0, BASE, ANNEX.x1, ANNEX.y1, ANNEX.top);
// Lage strook langs de noordwestgevel (BAG, AHN ~1 m boven het maaiveld), verbreed tot 0,9 m.
const annexStrip = prism([[3.0, -6.1], [13.4, -6.1], [13.4, -5.16], [5.6, -5.16], [5.6, -3.6], [3.0, -3.6]], BASE, 0.6);
const ROWS = [[1.0, 2.5], [4.4, 5.9]];
const annexWindows = union([
  // Zuidoostgevel (y = y0, normaal -Y) en noordwestgevel (y = y1, normaal +Y), vensters om de 2,6 m.
  ...ROWS.flatMap(([z0, z1]) => [4.2, 6.8, 9.4, 12.0, 14.6, 17.2, 19.8].map((x) => place(niche(-ANNEX.y0, 1.4, z0, z1, 0.3, x), { deg: -90 }))),
  ...ROWS.flatMap(([z0, z1]) => [9.4, 12.0, 14.6, 17.2, 19.8].map((x) => place(niche(ANNEX.y1, 1.4, Math.max(z0, 1.2), z1, 0.3, -x), { deg: 90 }))),
  // Kopgevel (x = x1).
  ...ROWS.flatMap(([z0, z1]) => [-10.6, -7.6].map((y) => niche(ANNEX.x1, 1.4, z0, z1, 0.3, y))),
]);
const annex = union([annexBlock, annexStrip]).subtract(annexWindows);

const all = union([base, stoep, shaftAll, upperAll, top, annex]);

await writeLandmark({
  slug: "watertoren-gouda",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-bovenbouw-tentdak-lantaarn-en-aanbouw", all]],
  catalog: {
    name: "Watertoren Gouda",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-8.5, 0], [0, 8.5], [6, 6], [-6, -6], [23, -9], [12, -13.5], [12, -4.6]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0513100011112774"],
    description:
      "Oorsprong op het hart van de BAG-cirkel (straal 6,89 m) op het maaiveld van de dijk (NAP +3,33 m), X-as langs de kantooraanbouw, 44,1 graden linksom van RD-oost (een hoek van het tienzijdige dak op de X-as). Ronde onderbouw met tien rondboogvelden, gekoppelde vensters en de ingang met stoep aan de noordwestzijde; waterlijst op 6 m; schacht met tien spaarvelden tussen lisenen, elk onder een rondboog met twee boogjes en een oculus; fries op 22,6 m onder de iets uitkragende bovenbouw met gekoppelde venstertjes en tandlijst; tienzijdig tentdak met overstek (dakrand 28,4 m, AHN) en een tienzijdige lantaarn tot 32,93 m. Platte aanbouw van 20 x 6,1 m op 7,8 m. Windvaan, gootklossen en het bovenlicht weggelaten. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1883,
      architect: "J. Schotel",
      rijksmonument: 517626,
      publishedHeightM: 33.15,
      reservoirDiameterM: 11,
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 31.7,
      ahnRoofAtLanternNapM: 34.1,
      ahnTopNapM: 36.26,
      ahnAnnexRoofNapM: 11.1,
      baseDiameterM: 2 * R.base,
      shaftDiameterM: 2 * R.shaft,
      upperDiameterM: 2 * R.upper,
      eaveCornerDiameterM: 2 * R.eave,
      eaveM: H.eaveTop,
      topM: H.top,
      annexM: [ANNEX.x1 - ANNEX.x0, ANNEX.y1 - ANNEX.y0, ANNEX.top],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Gouda) (1883, J. Schotel, 33,15 m, 300 m³, rijksmonument 517626)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/517626 (ronde neoromaanse toren, drie geledingen, tienzijdig tentdak met lantaarn, ingang noordwest, aanbouw 1974/1979 niet beschermd)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Gouda) (Watertoren Gouda.jpg, 2007; Watertoren (Gouda, 1998).jpg, G. Dukker)",
      "PDOK BAG-pand 0513100011112774, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

// Nieuwe watertoren van Oostburg (Bredestraat 67/69), gebouwd in 1948 tot 1950 naar ontwerp van A.J. van Eck; volgens
// Wikipedia 55 m hoog, met vijf reservoirs van 320, 715, 425, 325 en 375 m³ (samen 2160 m³), nu twee woningen. Sinds 1995 met
// de schildering "De Bron" van Johnny Beerens (een scheur met waterdruppels; alleen verf). Een ronde, licht verjongende
// gepleisterde schacht met een holle voet, op een lage ronde onderbouw met een bakstenen plint, een krans van hoge vensters
// tussen stenen penanten en een holle kroonlijst met een ronde rand. Bovenaan een rij kleine vierkante vensters, een
// afdeklijst, een iets smallere uitkragende dekplaat met een omgang, een twaalfzijdige glazen lantaarn onder een overstekend
// koperen dak en een kleine ventilatietrommel met kap. Aan de zuidkant de ingang met een portiek, een bordes, een trap en
// twee schuin uitlopende stenen muren; aan de noordwestkant een bakstenen aanbouw met een plat dak.
//
// Oorsprong op het hart van de ronde BAG-contour van pand 1714100000725735 (kleinste kwadraten op 22 punten, straal 8,99 m,
// restfout ≤ 0,015 m; het hart van de lantaarn in het AHN-DSM ligt er binnen 0,1 m naast) op het maaiveld (AHN-DTM NAP
// +2,05, rond de toren 1,9 tot 2,4). Ronde toren: +X = RD-oost, de ingang en de aanbouw staan op hun RD-richting.
// Maten: buitenrand van de kroonlijst (8,99 m) en de aanbouw (sector van 104 tot 138,7 graden tot 13,3 m) uit de BAG.
// Uit het AHN-DSM 0,5 m (straal per hoogte uit de buitenste cellen per ring, 0,25 m teruggenomen voor de celgrootte):
// schacht 8,1 m op 12 m, 7,8 op 20, 7,45 op 30 en 7,0 m op 44 m; dek NAP +48,05 (46,0 m) tot 6,35 m; lantaarndak tot 3,35 m
// op 51,6 à 52,25 m; kap van de ventilatietrommel tot 54,3 m (NAP +56,5); aanbouw 4,3 m. Uit foto's (Commons, RCE 2000 en
// 2013): de onderbouw (plint 1,4 m, vensters tot 3,7 m, kroonlijst tot 5,3 m), twintig vensterassen, de holle voet van de
// schacht, de rij van zestien vensters onder de top, de verhoudingen van dekplaat, lantaarn en trommel en de ingang.
// Geschat: de richting van de ingang (zuid, uit een verhoging in het AHN-DSM), de maten van portiek, trap en muren, de
// straal van de vensterkrans (8,15 m) en de hoogtes onder de kroonlijst.
// Printbaar op 1:1000: kroonlijst, afdeklijst, dekplaat, lantaarndak, kap en luifel met een onderkant van 50 graden;
// vensters als blinde nissen met een plafond van 63 graden; penanten en muren minstens 0,9 m.
import { Manifold, CrossSection, ccw, hull, union, prism, place, rect, circle, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [23331.03, 372995.83];
const GROUND_NAP = 2.05;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (9,5 m van het hart), gemeten 2026-11-06: oost 46,64,
// noordoost 46,51, noord 46,41, noordwest 46,34, west 46,25, zuidwest 46,30, zuid 46,38, zuidoost 46,53. Het PDOK-pand
// staat op 46,15.
const GROUND_ELLIPSOID = 46.245;

const rad = (deg) => (deg * Math.PI) / 180;
const T50 = Math.tan(rad(50));
const rev = (pts, seg = SEG) => Manifold.revolve(new CrossSection([ccw(pts)]), seg);
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];

// ---------- maten ----------
const ENTRANCE = -90; // richting van de ingang (RD, graden linksom vanaf oost)
const ANNEX = [104, 138.7]; // sector van de aanbouw (BAG)
const R = {
  wall: 8.15, // gevel van de onderbouw met de vensterkrans
  rim: 8.99, // buitenrand van de kroonlijst (BAG)
  foot: 8.6, // voet van de schacht op de kroonlijst
  top: 7.0, // schacht onder de afdeklijst (AHN)
  coping: 7.2,
  deck: 6.35, // dekplaat (AHN, foto 0,9 × de schacht)
  lantern: 2.3, // omgeschreven straal van de twaalfzijdige lantaarn (foto)
  roof: 3.35, // lantaarndak (AHN, foto)
  annex: 13.3, // buitenkant van de aanbouw (BAG)
};
const H = {
  sill: 1.4, // bakstenen plint tot de vensters
  windowTop: 3.7,
  cove: 3.95, // begin van de holle kroonlijst
  rim: 5.3, // bovenkant van de kroonlijst (AHN 5,3 à 5,6)
  copingFoot: 44.06,
  shaftTop: 44.6, // afdeklijst (AHN-wand tot 44,6)
  deck: 46.0, // dek van de omgang (AHN NAP +48,05)
  lanternBase: 46.9, // borstwering onder het glas
  soffit: 49.7, // onderkant van het lantaarndak bij het glas
  roofEdge: 51.6,
  roofTop: 52.25,
  vent: [52.2, 53.0, 53.8, 54.3], // trommel: voet, onderkant kap, rand, top (AHN NAP +56,5)
  annex: 4.3, // plat dak van de aanbouw (AHN)
  floor: 0.9, // vloer achter de ingang: vijf treden
};

// ---------- schacht met onderbouw, kroonlijst, afdeklijst en dekplaat ----------
// Eén omwentelingsprofiel (straal, hoogte). De schacht heeft een holle voet en verjongt daarboven vrijwel recht (AHN).
const RIM_FOOT = H.cove + (R.rim - R.wall) * T50;
const SOFFIT_IN = 6.0;
const body = rev([
  [0, BASE], [R.wall, BASE], [R.wall, H.cove], [R.rim, RIM_FOOT], [R.rim, H.rim], [R.foot, H.rim],
  [8.35, 7.0], [8.2, 9.0], [8.05, 12.0], [7.75, 20.0], [7.42, 30.0], [R.top, H.copingFoot],
  [R.coping, H.copingFoot + (R.coping - R.top) * T50], [R.coping, H.shaftTop],
  [SOFFIT_IN, H.shaftTop], [R.deck, H.shaftTop + (R.deck - SOFFIT_IN) * T50], [R.deck, H.deck], [0, H.deck],
]);

// ---------- lantaarn, dak en ventilatietrommel ----------
const LANTERN_N = 12;
const dodecagon = (r) => circle([0, 0], r, LANTERN_N, rad(15));
const lanternDrum = prism(dodecagon(R.lantern), H.deck - 0.1, H.soffit + 0.2);
const lanternRoof = rev([
  [0, H.soffit], [2.2, H.soffit], [R.roof, H.soffit + (R.roof - 2.2) * T50], [R.roof, H.roofEdge], [1.0, H.roofTop], [0, H.roofTop],
]);
const ventDrum = prism(circle([0, 0], 0.75, 8, rad(22.5)), H.vent[0], H.vent[1] + 0.05);
const ventCap = rev([
  [0, H.vent[1]], [0.7, H.vent[1]], [1.15, H.vent[1] + 0.45 * T50], [1.15, H.vent[2]], [0, H.vent[3]],
], 32);

// ---------- ingang (lokaal: +X naar buiten) ----------
// Portiek 4,4 m breed met afgeronde voorhoeken tot 9,6 m van het hart en tot 4,3 m hoog (onder de kroonlijst), deurnis
// 2,0 × 2,0 m op de vloer (0,9 m), 0,35 m diep, luifel met een onderkant van 50 graden op 3,6 m; bordes en vier treden van 0,4 m tussen
// twee stenen muren van 0,9 m dik en 2,0 m hoog waarvan de binnenkant van 2,2 naar 2,6 m uit het midden uitloopt (tot 11,8 m van het hart).
const roundedRect = (x0, half, out, rc) => {
  const pts = [[x0, -half]];
  for (let k = 0; k <= 8; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 16; pts.push([out - rc + rc * Math.cos(a), -half + rc + rc * Math.sin(a)]); }
  for (let k = 0; k <= 8; k++) { const a = (k * Math.PI) / 16; pts.push([out - rc + rc * Math.cos(a), half - rc + rc * Math.sin(a)]); }
  pts.push([x0, half]);
  return pts;
};
const porch = prism(roundedRect(7.4, 2.2, 9.6, 0.55), BASE, 4.3);
const canopy = hull([
  ...roundedRect(9.0, 2.2, 9.6, 0.55).map(([x, y]) => [x, y, 3.6]),
  ...roundedRect(9.0, 2.45, 9.85, 0.8).map(([x, y]) => [x, y, 3.6 + 0.25 * T50 + 0.01]),
  ...roundedRect(9.0, 2.45, 9.85, 0.8).map(([x, y]) => [x, y, 4.05]),
]);
const STEPS = [[10.2, H.floor], [10.6, 0.72], [11.0, 0.54], [11.4, 0.36], [11.8, 0.18]];
const stairs = union(STEPS.map(([out, z]) => prism(rect(7.6, -2.7, out, 2.7), BASE, z)));
const wall = (side) => hull([
  ...[[7.6, 2.2], [7.6, 3.1], [11.8, 2.6], [11.8, 3.5]].map(([x, y]) => [x, side * y, BASE]),
  ...[[7.6, 2.2], [7.6, 3.1], [11.8, 2.6], [11.8, 3.5]].map(([x, y]) => [x, side * y, 2.0]),
]);
const door = hull([
  [9.25, -1.0, H.floor], [10.3, -1.0, H.floor], [9.25, 1.0, H.floor], [10.3, 1.0, H.floor],
  [9.25, -1.0, 3.6], [9.25, 1.0, 3.6], [9.6, -1.0, 2.9], [9.6, 1.0, 2.9], [10.3, -1.0, 2.3], [10.3, 1.0, 2.3],
]);
const entrance = place(union([porch, canopy, stairs, wall(-1), wall(1)]), { deg: ENTRANCE });
const entranceCut = place(door, { deg: ENTRANCE });

// ---------- aanbouw ----------
// Bakstenen aanbouw met plat dak in de sector van de BAG, van de onderbouw tot 13,3 m, 4,3 m hoog (AHN).
const arc = (r, a0, a1, n) => Array.from({ length: n + 1 }, (_, k) => polar(r, a0 + ((a1 - a0) * k) / n));
const annex = prism([...arc(7.9, ANNEX[0], ANNEX[1], 12), ...arc(R.annex, ANNEX[1], ANNEX[0], 12)], BASE, H.annex);

// ---------- vensters ----------
// Nis in het vlak met normaal +X op afstand f (s langs het vlak), plafond 63 graden naar binnen.
const niche = (f, s, w, z0, z1, depth = 0.3) => hull([
  [f - depth, s - w / 2, z0], [f + 0.6, s - w / 2, z0], [f - depth, s + w / 2, z0], [f + 0.6, s + w / 2, z0],
  [f - depth, s - w / 2, z1 + 2 * depth], [f - depth, s + w / 2, z1 + 2 * depth], [f, s - w / 2, z1], [f, s + w / 2, z1],
  [f + 0.6, s - w / 2, z1 - 1.2], [f + 0.6, s + w / 2, z1 - 1.2],
]);
// Vensterkrans: twintig assen om de 18 graden vanaf de ingang, vensters van 1,8 m breed tussen penanten van 0,75 m; niet
// achter de portiek en de muren (de ingang en de assen ernaast) en niet achter de aanbouw.
const covered = (deg) => {
  const d = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
  return d(deg, ENTRANCE) < 20 || (deg > ANNEX[0] - 7 && deg < ANNEX[1] + 7);
};
const BAYS = Array.from({ length: 20 }, (_, k) => ENTRANCE + 18 * k).map((a) => ((a + 540) % 360) - 180).filter((a) => !covered(a));
const ringWindows = union(BAYS.map((deg) => place(niche(R.wall, 0, 1.8, H.sill, H.windowTop), { deg })));
// Zestien kleine vensters onder de afdeklijst (foto 0,6 × 0,9 m, als nis van 0,9 × 0,9 m), op de assen tussen de vensterkrans.
const topWindows = union(Array.from({ length: 16 }, (_, k) => place(niche(7.03, 0, 0.9, 42.95, 43.85, 0.3), { deg: ENTRANCE + 11.25 + 22.5 * k })));
// Lantaarn: in elk van de twaalf vlakken een glasveld van 1,0 m breed, 0,2 m diep.
const apothem = R.lantern * Math.cos(rad(15));
const lanternPanes = union(Array.from({ length: LANTERN_N }, (_, k) => place(niche(apothem, 0, 1.0, H.lanternBase, H.soffit - 0.4, 0.2), { deg: 30 * k })));
// Aanbouw: drie vensters in de gebogen buitenwand, twee in de zuidwestelijke zijwand (foto, 1,0 × 1,3 m).
const annexWindows = union([
  ...[112, 121.4, 130.8].map((deg) => place(niche(R.annex * Math.cos(rad(1.5)), 0, 1.0, 1.1, 2.4), { deg })),
  ...[10.4, 12.1].map((rho) => place(niche(0, -rho, 1.0, 1.1, 2.4), { deg: ANNEX[1] + 90 })),
]);

const all = union([body, lanternDrum, lanternRoof, ventDrum, ventCap, entrance, annex])
  .subtract(union([ringWindows, topWindows, lanternPanes, annexWindows, entranceCut]));

await writeLandmark({
  slug: "watertoren-oostburg-nieuwe-watertoren",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-dek-en-lantaarn", all]],
  catalog: {
    name: "Nieuwe watertoren Oostburg",
    origin: ORIGIN,
    xAxis: [1, 0],
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9.5, 0], [6.72, 6.72], [0, 9.5], [-6.72, 6.72], [-9.5, 0], [-6.72, -6.72], [0, -9.5], [6.72, -6.72]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1714100000725735"],
    description:
      "Oorsprong op het hart van de ronde BAG-contour op het maaiveld (NAP +2,05 m), +X naar RD-oost. Ronde onderbouw (straal 8,15 m) met bakstenen plint, vensterkrans en holle kroonlijst tot 5,3 m (straal 8,99 m); gepleisterde schacht met holle voet die verjongt van 8,6 naar 7,0 m, zestien kleine vensters en een afdeklijst tot 44,6 m; dekplaat tot 46,0 m; twaalfzijdige glazen lantaarn onder een overstekend dak tot 52,25 m en een ventilatietrommel tot 54,3 m. Ingang met portiek, trap en muren in het zuiden, platte aanbouw in het noordwesten. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: "1948-1950",
      architect: "A.J. van Eck",
      publishedHeightM: 55,
      reservoirsM3: [320, 715, 425, 325, 375],
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 56.53,
      rimRadiusM: R.rim,
      shaftRadiusM: { 5.3: R.foot, 12: 8.05, 20: 7.75, 30: 7.42, 44: R.top },
      deckM: H.deck,
      deckRadiusM: R.deck,
      lanternRoofM: H.roofTop,
      topM: H.vent[3],
      annexM: H.annex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Oostburg) (1948-1950, A.J. van Eck, 55 m, 320 + 715 + 425 + 325 + 375 m³)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Oostburg) (RCE-foto's 2000: ingangspartij, onderbouw, overzicht; foto's 2008, 2013 en 2015)",
      "PDOK BAG-pand 1714100000725735, AHN DSM/DTM 0,5 m, luchtfoto, 2026-11-06",
    ],
  },
});

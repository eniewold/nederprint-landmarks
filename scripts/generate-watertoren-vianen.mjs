// Watertoren van Vianen aan de Lekdijk, achter het pompstation van het voormalige gemeentelijke waterleidingbedrijf.
// Gebouwd in 1909 naar ontwerp van Roelof Kuipers; volgens Wikipedia de oudste Nederlandse watertoren met een open
// draagconstructie van gewapend beton, 26,3 m hoog, reservoir van 100 m³, rijksmonument 520862; eigenaar Oasen, buiten
// bedrijf. Een witgeschilderd betonskelet: acht kolommen op een achthoek, drie ringbalken met schuine schoren in de hoeken
// van elk vak, op de middelste ring acht radiale balken naar een ronde middenkolom (standpijp) met een kraag. Daarboven
// een ronde plaat met een schuine onderkant en een omgang, het cilindrische reservoir met acht lensvormige velden, een
// smalle dakrand en een flauw kegeldak met een klein luik. De kolommen staan op een vierkante, witgepleisterde
// onderbouw van één laag met een rondboogdeur en kleine vensters.
//
// Oorsprong op het hart van BAG-pand 0620100000011958 (vierkant van 6,63 tot 6,79 m, gemiddelde van de vier hoekpunten)
// op het maaiveld: AHN-DTM NAP +5,03 (ring van 7 tot 12 m: mediaan 5,01, binnen de onderbouw 5,05). +X langs de
// BAG-zijden (RD 19,5 graden, gemiddelde van de vier zijrichtingen); de achthoek van het skelet heeft zijn vlakken
// evenwijdig aan de zijden van de onderbouw, de kolommen staan op de hoeken van die achthoek.
// Maten: onderbouw uit de BAG (halve zijde 3,345 m). Hoogtes uit het AHN-DSM 0,5 m: top van het luik NAP +30,16 (25,13 m),
// dak op 1 m van het hart 24,4 m, op 1,5 m 24,15 m, op 2 m 23,85 m, dakrand op 3,5 à 4 m NAP +28,35 à +28,45 (23,35 m),
// reservoir tot circa 4 à 4,25 m van het hart. Stralen van reservoir, plaat en middenkolom en de hoogtes van de onderbouw,
// de ringen, de plaat en de lensvelden uit de foto "Vianen RM Watertoren (2).jpg" (Commons, 2015, diagonaal op de
// onderbouw: 54,4 px/m uit de diagonaal van 9,46 m), gecontroleerd op "Vianen RM Watertoren (1).jpg" (ingang),
// "Vianen Watertoren 6659.JPG" en de RCE-foto 20300594.
// Printbaar op 1:1000: kolommen en balken minstens 0,9 m (in werkelijkheid circa 0,45 m), de vakken met een spitse
// bovenkant van 52 graden in plaats van een rechte balk met kleine schoren, de radiale balken met een onderkant van
// 50 graden naar het midden, de plaat en de reservoirbodem met een onderkant van 50 graden.
import { Manifold, CrossSection, ccw, hull, union, prism, place, rect, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [134599.847, 445280.395];
const DEG = 19.5;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 5.03;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: oost (5,5, 0) 48,42, west
// (-5,5, 0) 48,46, zuid (0, -5,5) 48,58, noordoost (5, 5) 48,43, noordwest (-5, 5) 48,34. Recht ten noorden van de
// onderbouw (lokaal 0, 3 tot 7) zakt het PDOK-terrein in een kuil tot 45,6, waar het AHN-DTM een gat heeft (schaduw van
// de toren); daar ligt bewust geen punt. Het PDOK-pand staat op 45,81.
const GROUND_ELLIPSOID = 48.34;

const rad = (deg) => (deg * Math.PI) / 180;
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
const T50 = Math.tan(rad(50));
const T52 = Math.tan(rad(52));

// ---------- maten ----------
const HALF = 3.345; // halve zijde van de onderbouw (BAG) = apothema van de achthoek van het skelet
const WALL = 0.9; // dikte van kolommen en ringbalken
const H = {
  baseCornice: [3.45, 3.62, 3.74], // onderbouw: onderkant van de lijst, lijst, dak (foto 3,7 à 3,8 m)
  rings: [6.93, 7.83, 10.75, 11.65, 14.6, 15.5], // drie ringbalken (onderkant en bovenkant in het midden van een vak)
  frameTop: 17.1, // bovenkant van het skelet, begin van de schuine onderkant van de plaat
  storeyTop3: 16.85, // spitse bovenkant van de bovenste vakken
  plate: [18.53, 19.0], // ronde plaat met omgang: onderkant van de rand (50 graden vanaf het skelet), vloer
  lens: [20.8, 21.05, 21.5], // lensvelden: onderkant, aanzet, bovenkant
  tank: 23.35, // dakrand van het reservoir (AHN NAP +28,38)
  rim: 23.55, // bovenkant van de dakrand
  roofHatch: 24.4, // dak tegen het luik (AHN op 1 m)
  hatch: 24.9,
  top: 25.13, // luik (AHN NAP +30,16)
};
const R = {
  column: 0.73, // middenkolom (foto 1,46 m)
  collar: 0.95,
  coreCone: (HALF - WALL) / Math.cos(rad(22.5)), // reservoirbodem: kegel van 50 graden van de middenkolom tot de binnenhoeken van het skelet
  frameOut: HALF / Math.cos(rad(22.5)), // hoekpunt van de achthoek (3,62 m)
  plate: 4.55, // plaat met omgang (foto 9,1 m)
  tank: 3.9, // reservoir (foto 7,78 m, AHN tot circa 4 m)
  rim: 4.05,
  hatch: 0.95,
};

// ---------- onderbouw ----------
// Vierkant uit de BAG met een lijst van 0,15 m met een onderkant van 53 graden; rondboogdeur in het vlak +X (op de
// foto's links naast de kolom, met het baksteengebouw in het zuiden aan de linkerhand), kleine vensters rondom.
const sq = (h) => rect(-h, -h, h, h);
const base = union([
  prism(sq(HALF), BASE, H.baseCornice[0]),
  hull([...sq(HALF).map(([x, y]) => [x, y, H.baseCornice[0]]), ...sq(HALF + 0.15).map(([x, y]) => [x, y, H.baseCornice[1]]), ...sq(HALF + 0.15).map(([x, y]) => [x, y, H.baseCornice[2]])]),
]);
// Nis in het vlak met normaal +X op afstand f (s langs het vlak), plafond 63 graden naar binnen.
const niche = (f, s, w, z0, z1, depth = 0.3) => hull([
  [f - depth, s - w / 2, z0], [f + 0.5, s - w / 2, z0], [f - depth, s + w / 2, z0], [f + 0.5, s + w / 2, z0],
  [f - depth, s - w / 2, z1 + 2 * depth], [f - depth, s + w / 2, z1 + 2 * depth], [f, s - w / 2, z1], [f, s + w / 2, z1],
  [f + 0.5, s - w / 2, z1 - 0.6], [f + 0.5, s + w / 2, z1 - 0.6],
]);
// Rondboognis (halfrond in 7 punten vanaf de aanzet).
const archNiche = (f, s, w, z0, zSpring, depth = 0.3) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => [s - r * Math.cos((Math.PI * k) / 6), zSpring + r * Math.sin((Math.PI * k) / 6)]);
  return hull([
    ...arc.map(([v, z]) => [f - depth, v, z + 2 * depth]), ...arc.map(([v, z]) => [f, v, z]), ...arc.map(([v, z]) => [f + 0.4, v, z - 0.4]),
    [f - depth, s - r, z0], [f - depth, s + r, z0], [f + 0.4, s - r, z0], [f + 0.4, s + r, z0],
  ]);
};
const baseOpenings = union([
  archNiche(HALF, -2.35, 1.0, 0.25, 1.95), // deur (foto 1,0 × 2,45 m)
  niche(HALF, 0.3, 0.7, 1.45, 2.35), niche(HALF, 2.4, 0.6, 1.45, 2.35),
  ...[90, 180, 270].map((deg) => place(union([niche(HALF, -1.0, 0.6, 1.5, 2.35), niche(HALF, 1.0, 0.6, 1.5, 2.35)]), { deg })),
]);

// ---------- skelet ----------
// Achthoekige buis (vlakken op 0, 45, ... graden, apothema 3,345, wand 0,9 m) van de onderbouw tot de plaat; in elk vlak
// per verdieping een vak met afgeschuinde onderhoeken (45 graden, 0,25 m) en een spitse bovenkant van 52 graden. Wat
// overblijft zijn de acht kolommen op de hoeken en de ringbalken tussen de vakken. De zijkanten van een vak lopen
// evenwijdig aan de straal door de kolom, zodat elke kolom over de hele wanddikte even breed is (het vak versmalt naar
// binnen); met zijkanten haaks op het vlak liep de kolom naar binnen spits toe en verdikte de export hem.
const oct = (a) => Array.from({ length: 8 }, (_, k) => [(a / Math.cos(rad(22.5))) * Math.cos(rad(22.5 + 45 * k)), (a / Math.cos(rad(22.5))) * Math.sin(rad(22.5 + 45 * k))]);
const tube = prism(oct(HALF), H.baseCornice[2] - 0.5, H.frameTop).subtract(prism(oct(HALF - WALL), H.baseCornice[2] - 1, H.frameTop + 1));
const COLUMN = 0.93; // breedte van een kolom; het vak is aan de buitenkant 2 × 0,88 m breed
// Halve breedte van een vak op afstand x van het hart (in het vlak met normaal +X) bij kolombreedte cw.
const halfWidth = (x, cw) => x * Math.tan(rad(22.5)) - cw / 2 / Math.cos(rad(22.5));
const panel = (zb, zApex, cw = COLUMN, c = 0.25) =>
  hull([HALF - WALL - 0.3, HALF + 0.3].flatMap((x) => {
    const w = halfWidth(x, cw), zs = zApex - w * T52;
    return [[-w + c, zb], [w - c, zb], [w, zb + c], [w, zs], [0, zApex], [-w, zs], [-w, zb + c]].map(([v, z]) => [x, v, z]);
  }));
const STOREYS = [
  [H.baseCornice[2], H.rings[0]],
  [H.rings[1], H.rings[2]],
  [H.rings[3], H.rings[4]],
  [H.rings[5], H.storeyTop3, 1.18], // bovenste vak smaller (aan de buitenkant 2 × 0,75 m), zodat de spitse bovenkant onder de plaat past
];
const panels = union(around(union(STOREYS.map(([zb, za, w]) => panel(zb, za, w))), every(8)));
const frame = tube.subtract(panels);
// Middenkolom met kraag op de middelste ring en acht radiale balken naar de kolommen (richting de hoeken van de
// achthoek), bovenkant gelijk met de ring, onderkant met 50 graden oplopend naar het midden van de overspanning.
const column = rev([[0, H.baseCornice[2] - 0.5], [R.column, H.baseCornice[2] - 0.5], [R.column, H.rings[2] - 1.31 - (R.collar - R.column) * T50],
  [R.collar, H.rings[2] - 1.31], [R.collar, H.rings[3]], [R.column, H.rings[3]], [R.column, H.frameTop], [0, H.frameTop]]);
// De schuine onderkant loopt door tot in de kolom (3,0 m), zodat het eind van de balk naast de vakken niet vlak hangt.
const beamIn = R.column - 0.1, beamOut = 3.0;
const beamMid = (R.column + beamOut) / 2, beamEnd = H.rings[2] - (beamMid - R.column) * T50;
const radialBeam = hull([...[-0.45, 0.45].flatMap((s) => [[beamIn, s, beamEnd], [beamOut, s, beamEnd], [beamIn, s, H.rings[3]], [beamOut, s, H.rings[3]]])])
  .subtract(hull([...[-1, 1].flatMap((s) => [[R.column, s, beamEnd], [beamMid, s, H.rings[2]], [beamOut + 0.1, s, beamEnd], [R.column, s, beamEnd - 1], [beamOut + 0.1, s, beamEnd - 1]])]));
const radials = union(around(radialBeam, every(8, 22.5)));

// ---------- plaat, reservoir en dak ----------
// Omwentelingsprofiel: reservoirbodem als kegel van 50 graden van de middenkolom tot het skelet, plaat met een
// onderkant van 50 graden buiten het skelet, rand en vloer van de omgang, reservoir, dakrand met een onderkant van
// 50 graden, flauw kegeldak (AHN), luik met een afgeschuinde bovenkant.
const coreBottom = H.frameTop - 0.05 - (R.coreCone - R.column) * T50;
const plateUnder = H.frameTop + (R.plate - HALF) * T50;
const tank = rev([
  [0, coreBottom], [R.column, coreBottom], [R.coreCone, H.frameTop - 0.05], [HALF - 0.05, H.frameTop - 0.05], [HALF, H.frameTop],
  [R.plate, plateUnder], [R.plate, H.plate[1]], [R.tank, H.plate[1]], [R.tank, H.tank],
  [R.rim, H.tank + (R.rim - R.tank) * T50], [R.rim, H.rim], [R.tank - 0.05, H.rim],
  [R.hatch, H.roofHatch], [R.hatch, H.hatch], [0.45, H.top], [0, H.top],
]);
// Acht lensvormige velden in het reservoir, tussen de kolommen (foto: boven de vakken, met de punten boven de kolommen).
const lens = (() => {
  const w = 1.25, n = 9, [z0, zc, z1] = H.lens;
  const top = Array.from({ length: n }, (_, k) => { const s = -w + (2 * w * k) / (n - 1); return [s, zc + (z1 - zc) * (1 - (s / w) ** 2)]; });
  const bot = top.map(([s]) => [s, zc - (zc - z0) * (1 - (s / w) ** 2)]);
  const f = R.tank, d = 0.3;
  return hull([
        ...top.map(([s, z]) => [f - d, s, z + 2 * d + 0.4]), ...bot.map(([s, z]) => [f - d, s, z]),
    ...top.map(([s, z]) => [f + 0.4, s, z - 1.2]), ...bot.map(([s, z]) => [f + 0.4, s, z]),
  ]);
})();
const lenses = union(around(lens, every(8)));

const all = union([base, frame, column, radials, tank]).subtract(union([baseOpenings, lenses]));

await writeLandmark({
  slug: "watertoren-vianen",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-skelet-plaat-en-reservoir", all]],
  catalog: {
    name: "Watertoren Vianen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5.5, 0], [-5.5, 0], [0, -5.5], [5, 5], [-5, 5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0620100000011958"],
    description:
      "Oorsprong op het hart van de vierkante onderbouw uit het BAG-pand op het maaiveld (NAP +5,03 m), +X langs de BAG-zijden (RD 19,5 graden). Vierkante onderbouw (6,69 m) tot 3,74 m met lijst, rondboogdeur en vensters; open betonskelet als achthoek van acht kolommen met drie ringbalken en vakken met een spitse bovenkant, ronde middenkolom met kraag en acht radiale balken op de middelste ring; plaat met omgang (straal 4,55 m) op 19,0 m, reservoir (straal 3,9 m) met acht lensvelden tot 23,35 m, dakrand, flauw kegeldak en luik tot 25,13 m. Maten uit BAG, AHN en foto's; kolommen en balken verdikt tot 0,9 m.",
    realWorld: {
      built: 1909,
      architect: "Roelof Kuipers",
      rijksmonument: 520862,
      publishedHeightM: 26.3,
      reservoirM3: 100,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 30.16,
      ahnTankEaveNapM: 28.38,
      baseHalfSideM: HALF,
      baseM: H.baseCornice[2],
      ringsM: [H.rings[1], H.rings[3], H.rings[5]],
      plateM: H.plate,
      plateRadiusM: R.plate,
      tankRadiusM: R.tank,
      tankM: H.tank,
      topM: H.top,
      columns: 8,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Vianen) (1909, Roelof Kuipers, oudste open betonskelet, 26,3 m, 100 m³)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/520862",
      "https://commons.wikimedia.org/wiki/File:Vianen_RM_Watertoren_(2).jpg (diagonaal op de onderbouw: skelet, ringen, plaat, reservoir met lensvelden)",
      "https://commons.wikimedia.org/wiki/File:Vianen_RM_Watertoren_(1).jpg (ingangszijde: rondboogdeur, vensters, middenkolom met kraag en radiale balken)",
      "https://commons.wikimedia.org/wiki/File:Vianen_Watertoren_6659.JPG en File:Exterieur_OVERZICHT_-_Vianen_-_20300594_-_RCE.jpg",
      "PDOK BAG-pand 0620100000011958, AHN DSM/DTM 0,5 m, 2026-11-06",
    ],
  },
});

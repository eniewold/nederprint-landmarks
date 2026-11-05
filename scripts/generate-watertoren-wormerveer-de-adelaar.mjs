// Watertoren van zeepziederij De Adelaar aan de Zaandijkerweg 5 in Wormerveer (1908), na de brand van 1906 herbouwd
// met de fabriek naar ontwerp van J.P.F. van Rossem en W.J. Vuijk (rijksmonument 526437). De toren staat op de hoek
// aan de Zaankant van het fabrieksgebouw (vier bouwlagen, plat dak op circa 13,65 m) en steekt er ruim 7 m boven uit
// (Wikipedia: "een zeven meter hoog bakstenen opbouw"). Boven het dak: een bakstenen schacht met lisenen (zeven op de
// lange noord- en zuidgevel, zes op de korte oost- en westgevel, register) en een deur in de westgevel naar het dak;
// op elke lisene een console van baksteen en hardsteen, met boogjes ertussen, waarop de uitkragende rechthoekige
// reservoirommanteling met "ZEEPZIEDERIJ" (noord, zuid) en "DE ADELAAR" (oost, west) in witte steen. Daarop een lijst
// en een ezelsrug als rand, binnen de rand een laag zinken schilddak, en op de top een betonnen adelaar met gespreide
// vleugels (spanwijdte 6,75 m, register) die naar de Zaan kijkt, een replica van het bronzen beeld dat bij de brand
// van 1906 in de Zaan viel.
//
// De toren is geen eigen BAG-pand: hij hoort bij pand 0479100000000687 (de fabriek met de aanbouw uit 1915). Net als
// bij generate-watertoren-wormer-hollandia.mjs vervangt het model het hele pand en neemt de GLB de rest ervan over als
// tweede node: de dakvlakken van de 3D BAG (LoD2.2, CC BY 4.0, adelaarBag3d() onderaan) als prisma's onder hun eigen
// dakvlak, met de dakvlakken van de toren op de hoogte van het fabrieksdak en zonder de schacht.
//
// Oorsprong op het hart van de reservoirommanteling op het maaiveld (NAP +0,45, AHN-DTM op de kade en de straat).
// +X naar de Zaan (RD-richting 30,8 graden, uit de BAG-gevels en de omhullende van de toren in het AHN-DSM), +Y naar
// het noordwesten, het fabrieksdak op. Ommanteling 6,9 × 6,6 m: oost- en zuidgevel uit de BAG (de hoek van de toren
// steekt 0,1 tot 0,2 m buiten de fabrieksgevels), breedtes uit het AHN-DSM boven NAP +21,5 (dat 0,3 m naar het
// westen en zuiden verschoven ligt ten opzichte van de BAG). Hoogtes: dak, rand en schilddak uit het AHN en de 3D BAG;
// geledingen uit de foto "Gevel van liftopbouw en toren met adelaar - 20356385" (RCE, vrijwel frontaal op de
// noordgevel vanaf het dak: 100,7 px/m verticaal, uit dak-tot-rand 7,25 m); schacht 0,8 × de ommanteling in dezelfde
// foto. Adelaar uit de foto vanaf de Zaan (20356361, RCE) en het DSM (vleugeltoppen NAP +25,9).
// Het DSM toont tussen NAP +15 en +20 rond de zuid-, oost- en westgevel van de schacht een band van 1 tot 1,5 m; dat
// is steigerwerk tijdens de AHN-opname (zoals op alle foto's van rond 2007), niet de toren.
import { Manifold, CrossSection, ccw, hull, union, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [115769.27, 499933.83];
const AXIS_DEG = 30.8;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.45;
const BASE = -0.3;
// Halve maten in x (lange noord- en zuidgevel) en y (korte oost- en westgevel).
const CASING = [3.45, 3.3]; // reservoirommanteling 6,9 × 6,6 m
const SHAFT = [2.8, 2.65]; // schacht 5,6 × 5,3 m, 0,65 m binnen de ommanteling
const LISENE = 0.45; // breedte van de lisenen
// Hoogtes boven het maaiveld (NAP +0,45).
const H = {
  roof: 13.65, // plat dak van de fabriek (NAP +14,1)
  panels: [13.75, 16.3], // verdiepte vakken tussen de lisenen
  door: [13.75, 15.95], // deur in de westgevel naar het dak
  console: [16.6, 18.05], // consoles, 0,65 m uit
  arches: [17.2, 18.3], // boogjes tussen de consoles (een kraag van 59 graden)
  casing: [18.29, 20.45],
  cornice: [20.45, 20.65], // lijst, 0,12 m uit
  rim: 20.95, // ezelsrug als rand rond het dak
  eaves: 20.6, // voet van het schilddak binnen de rand
  apex: 22.1, // top van het schilddak (3D BAG NAP +22,7)
  plinth: [21.7, 22.9], // voetstuk van de adelaar
};
const rect = ([hx, hy], z) => [[-hx, -hy, z], [hx, -hy, z], [hx, hy, z], [-hx, hy, z]];
const grow = ([hx, hy], d) => [hx + d, hy + d];
const spread = (n, h) => Array.from({ length: n }, (_, i) => -h + LISENE / 2 + (i * (2 * h - LISENE)) / (n - 1));
// place draait om Z: 0 = oostgevel (+X, de Zaan), 90 = noordgevel (+Y), 180 = westgevel, 270 = zuidgevel.
const EAST = 0, NORTH = 90, WEST = 180, SOUTH = 270;
const faces = [EAST, NORTH, WEST, SOUTH];
const half = (deg, s) => (deg === EAST || deg === WEST ? s[0] : s[1]); // afstand hart-gevelvlak
const along = (deg, s) => (deg === EAST || deg === WEST ? s[1] : s[0]); // halve gevelbreedte
// Lisenen per gevel: zeven op de lange (noord, zuid), zes op de korte (oost, west).
const lisenen = (deg) => spread(deg === NORTH || deg === SOUTH ? 7 : 6, along(deg, SHAFT));

// Verdiept vak in het vlak met normaal +X op afstand f, van y0 tot y1 en z0 tot z1, d diep, plafond onder 45 graden.
const recess = (f, y0, y1, z0, z1, d) =>
  hull([[f - d, y0, z0], [f + 1, y0, z0], [f - d, y1, z0], [f + 1, y1, z0], [f - d, y0, z1], [f - d, y1, z1], [f + 1, y0, z1 + 1 + d], [f + 1, y1, z1 + 1 + d]]);
// Console op een lisene (normaal +X, positie y, gevelvlak op f): van de gevel op H.console[0] tot out ervoor op
// H.console[1], met een kopje tot onder de ommanteling.
const consoleAt = (f, y, out) =>
  hull([
    [f - 0.3, y - LISENE / 2, H.console[0]], [f, y - LISENE / 2, H.console[0]],
    [f - 0.3, y + LISENE / 2, H.console[0]], [f, y + LISENE / 2, H.console[0]],
    [f - 0.3, y - LISENE / 2, H.casing[0] + 0.02], [f + out, y - LISENE / 2, H.console[1]], [f + out, y - LISENE / 2, H.casing[0] + 0.02],
    [f - 0.3, y + LISENE / 2, H.casing[0] + 0.02], [f + out, y + LISENE / 2, H.console[1]], [f + out, y + LISENE / 2, H.casing[0] + 0.02],
  ]);

// ---------- schacht ----------
const shaft = box(-SHAFT[0], -SHAFT[1], BASE, SHAFT[0], SHAFT[1], H.arches[0] + 0.01);
// Verdiepte vakken van 0,2 m tussen de lisenen boven het fabrieksdak, met een plafond van 45 graden onder de consoles.
const panelCuts = union(faces.flatMap((deg) => {
  const ys = lisenen(deg);
  const f = half(deg, SHAFT);
  return ys.slice(1).map((y, i) => place(recess(f, ys[i] + LISENE / 2, y - LISENE / 2, ...H.panels, 0.2), { deg }));
}));
// Deur van 1,0 × 2,2 m midden in de westgevel, als nis van 0,35 m (plafond 45 graden), door de lisenen heen.
const doorCut = place(recess(SHAFT[0], -0.5, 0.5, ...H.door, 0.35), { deg: WEST });

// ---------- consoles en ommanteling ----------
const out = CASING[0] - SHAFT[0]; // 0,65 m, in beide richtingen gelijk
// Elke console 0,65 m uit over 1,45 m (66 graden).
const consoles = union(faces.flatMap((deg) => lisenen(deg).map((y) => place(consoleAt(half(deg, SHAFT), y, out), { deg }))));
// Tussen de consoles een kraag van 59 graden (de boogjes), tot 0,22 m achter de voorkant van de consoles.
const arches = hull([...rect(SHAFT, H.arches[0]), ...rect(CASING, H.arches[1])]);
const casing = box(-CASING[0], -CASING[1], H.casing[0] - 0.02, CASING[0], CASING[1], H.cornice[1]);
// Lijst 0,12 m uit met een onderkant van 45 graden.
const cornice = hull([...rect(CASING, H.cornice[0] - 0.12), ...rect(grow(CASING, 0.12), H.cornice[0]), ...rect(grow(CASING, 0.12), H.cornice[1])]);
// Ezelsrug: rand van 0,55 m breed met een schuine buitenkant tot 20,95 m; binnen de rand het schilddak.
const inner = grow(CASING, -0.55);
const rim = hull([...rect(grow(CASING, 0.12), H.cornice[1] - 0.01), ...rect(grow(CASING, -0.15), H.rim)])
  .subtract(box(-inner[0], -inner[1], H.cornice[1] - 0.5, inner[0], inner[1], H.rim + 1));
// Schilddak: vier vlakken vanaf de voet binnen de rand (20,6 m) tot een korte nok langs X op 22,1 m (circa 28 graden).
const ridge = inner[0] - inner[1];
const roof = hull([...rect(inner, H.cornice[1] - 0.3), ...rect(inner, H.eaves), [-ridge, 0, H.apex], [ridge, 0, H.apex]]);
// Voetstuk van de adelaar: 1,1 × 1,1 m met een afgeschuinde bovenrand.
const plinth = hull([...rect([0.55, 0.55], H.plinth[0]), ...rect([0.55, 0.55], H.plinth[1] - 0.15), ...rect([0.45, 0.45], H.plinth[1])]).translate([0.1, 0, 0]);
const tower = union([shaft, consoles, arches, casing, cornice, rim, roof, plinth]).subtract(union([panelCuts, doorCut]));

// ---------- adelaar ----------
// Betonnen adelaar, kop naar de Zaan (+X), vleugels gespreid langs Y tot 3,375 m van het hart (spanwijdte 6,75 m,
// register), met de toppen op 25,45 m (DSM NAP +25,9) en de schouders op 24,55 m (circa 17 graden). Vleugels als
// platen met een koord van 1,2 tot 1,3 m (X) en een dikte van 1,05 tot 0,9 m; romp, staart en kop als convexe vormen
// op het voetstuk. De vleugels hangen vrij: de export vult er een wig van 45 graden onder, op de romp en het voetstuk.
const E0 = H.plinth[1];
const body = hull([
  [-0.45, -0.38, E0 - 0.05], [0.5, -0.38, E0 - 0.05], [-0.45, 0.38, E0 - 0.05], [0.5, 0.38, E0 - 0.05],
  [0.85, -0.42, 23.9], [0.85, 0.42, 23.9], [-0.55, -0.45, 24.0], [-0.55, 0.45, 24.0],
  [0.6, -0.4, 24.5], [0.6, 0.4, 24.5], [-0.35, -0.4, 24.5], [-0.35, 0.4, 24.5],
]);
// Staart naar achteren, onderkant 47 graden.
const tail = hull([[-0.4, -0.45, E0 - 0.05], [-0.4, 0.45, E0 - 0.05], [-1.05, -0.45, E0 + 0.65], [-1.05, 0.45, E0 + 0.65], [-0.5, -0.45, 23.8], [-0.5, 0.45, 23.8]]);
// Kop en snavel naar voren, kin onder 45 graden of steiler.
const head = hull([
  [0.55, -0.45, 24.1], [0.55, 0.45, 24.1], [1.0, -0.4, 24.45], [1.0, 0.4, 24.45], [1.2, -0.25, 24.6], [1.2, 0.25, 24.6],
  [0.55, -0.45, 24.95], [0.55, 0.45, 24.95], [1.0, -0.35, 24.9], [1.0, 0.35, 24.9],
]);
// Vleugel in twee delen: arm van de schouder tot de pols (1,7 m van het hart) en hand met gespreide slagpennen tot de
// top, iets steiler omhoog.
const WRIST = [[-0.35, 1.7, 23.85], [0.95, 1.7, 23.85], [-0.35, 1.7, 24.9], [0.95, 1.7, 24.9]];
const flip = (pts, s) => pts.map(([x, y, z]) => [x, s * y, z]);
const wing = (s) =>
  union([
    hull(flip([[-0.3, 0.3, 23.5], [0.9, 0.3, 23.5], [-0.3, 0.3, 24.55], [0.9, 0.3, 24.55], ...WRIST], s)),
    hull(flip([...WRIST, [-0.3, 3.375, 24.55], [1.0, 3.375, 24.55], [-0.3, 3.375, 25.45], [1.0, 3.375, 25.45]], s)),
  ]);
const eagle = union([body, tail, head, wing(1), wing(-1)]).translate([0.1, 0, 0]);

// ---------- rest van het fabriekspand (3D BAG) ----------
// Elk dakvlak als prisma vanaf de onderkant, afgesneden door het vlak z = a x + b y + c (kleinste kwadraten door de
// hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen. De dakvlakken van de toren (toren = 1) liggen
// als vlak op het fabrieksdak (13,65 m); de schacht zelf is eruit gesneden.
const xyz = (flat) => Array.from({ length: flat.length / 3 }, (_, i) => flat.slice(i * 3, i * 3 + 3));
const fitPlane = (pts) => {
  const n = pts.length;
  const [mx, my, mz] = [0, 1, 2].map((k) => pts.reduce((s, p) => s + p[k], 0) / n);
  let sxx = 0, sxy = 0, syy = 0, sxz = 0, syz = 0;
  for (const [x, y, z] of pts) {
    const [u, v, w] = [x - mx, y - my, z - mz];
    sxx += u * u; sxy += u * v; syy += v * v; sxz += u * w; syz += v * w;
  }
  const det = sxx * syy - sxy * sxy;
  const a = Math.abs(det) < 1e-9 ? 0 : (sxz * syy - syz * sxy) / det;
  const b = Math.abs(det) < 1e-9 ? 0 : (syz * sxx - sxz * sxy) / det;
  return [a, b, mz - a * mx - b * my];
};
const roofPrism = (pts, [a, b, c]) => {
  const outline = ccw(pts.map(([x, y]) => [x, y]));
  const top = Math.max(...pts.map(([x, y]) => a * x + b * y + c)) + 1;
  const len = Math.hypot(a, b, 1);
  return Manifold.extrude(new CrossSection([outline]).offset(0.02, "Miter"), top - BASE)
    .translate([0, 0, BASE])
    .trimByPlane([a / len, b / len, -1 / len], -c / len);
};
const factory = union(adelaarBag3d().map(([isTower, flat]) => roofPrism(xyz(flat), isTower ? [0, 0, H.roof] : fitPlane(xyz(flat)))))
  .subtract(box(-SHAFT[0], -SHAFT[1], BASE - 1, SHAFT[0], SHAFT[1], 40));

await writeLandmark({
  slug: "watertoren-wormerveer-de-adelaar",
  base: BASE,
  nodes: [
    ["building:watertoren-schacht-consoles-ommanteling-en-dak", tower],
    ["building:adelaar", eagle],
    ["building:zeepziederij-de-adelaar", factory],
  ],
  catalog: {
    name: "Watertoren De Adelaar Wormerveer",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Terugval: NAP +0,45 plus de geoïdehoogte (circa 42,75 m, als bij Wormer Hollandia op 1,3 km).
    groundHeight: 43.2,
    replacesBuildings: ["NL.IMBAG.Pand.0479100000000687"],
    description:
      "Oorsprong op het hart van de reservoirommanteling op het maaiveld (NAP +0,45 m), +X naar de Zaan (RD-richting 30,8 graden), +Y naar het noordwesten over het fabrieksdak. Bakstenen schacht van 5,6 × 5,3 m met lisenen en verdiepte vakken boven het fabrieksdak (13,65 m) en een deur in de westgevel, consoles met boogjes tot een uitkragende ommanteling van 6,9 × 6,6 m, lijst en ezelsrug tot 20,95 m, schilddak tot 22,1 m en een adelaar met een spanwijdte van 6,75 m tot 25,45 m. De toren hoort bij BAG-pand 0479100000000687 (de zeepziederij); dat pand wordt vervangen en building:zeepziederij-de-adelaar is de 3D BAG-reconstructie (CC BY 4.0) van de rest ervan, zonder de toren.",
    realWorld: {
      built: 1908,
      architects: "J.P.F. van Rossem en W.J. Vuijk",
      monument: 526437,
      wikipediaHeightAboveRoofM: 7,
      eagleWingspanM: 6.75,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 14.1,
      ahnRimNapM: 21.4,
      ahnEagleTopNapM: 25.88,
      bag3dTowerRoofTopNapM: 22.7,
      shaftM: [SHAFT[0] * 2, SHAFT[1] * 2],
      casingM: [CASING[0] * 2, CASING[1] * 2],
      consolesM: H.console,
      casingFaceM: [H.casing[0], H.cornice[1]],
      rimM: H.rim,
      roofApexM: H.apex,
      eagleTopM: 25.45,
      photoScalePxPerM: 100.7,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/526437 (1908, Van Rossem en Vuijk; toren van één bij twee traveeën met zes en zeven lisenen, consoles, uitkragende ommanteling met ezelsrug en letters, betonnen adelaar met 6,75 m spanwijdte naar de Zaan)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Wormerveer) (1908, stalen tank op een opbouw van 7 m)",
      "https://commons.wikimedia.org/wiki/File:Gevel_van_liftopbouw_en_toren_met_adelaar_-_Wormerveer_-_20356385_-_RCE.jpg (noordgevel vrijwel frontaal: geledingen, schacht, lisenen, consoles)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_van_zeepziederij_met_adelaar_op_dak_-_Wormerveer_-_20356378_-_RCE.jpg en File:Gevel_van_toren,_met_adelaar_-_Wormerveer_-_20356381_-_RCE.jpg (westgevel met deur, consoles en boogjes, rand, adelaar)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_met_ligging,_oostzijde_-_Wormerveer_-_20356361_-_RCE.jpg en File:Wormerveer_Watertoren_5358.JPG (Zaankant: toren boven de fabrieksgevel, adelaar frontaal)",
      "PDOK BAG-pand 0479100000000687, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-05",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0479100000000687, LoD2.2-dakvlakken, opgehaald 2026-11-05",
    ],
  },
});

// ---------- data: dakvlakken van het fabriekspand ----------
// Dakvlakken (RoofSurface, LoD2.2) van 3D BAG-pand NL.IMBAG.Pand.0479100000000687 in het modelstelsel: x langs
// RD-richting 30,8 graden, y haaks daarop (linksom), beide in meters vanaf ORIGIN, z in meters boven NAP +0,45,
// afgerond op 1 cm. Per vlak [toren, buitenrand] (gaten weggelaten); toren = 1 voor de dakvlakken van de watertoren.
// Bron: https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0479100000000687, opgehaald 2026-11-05.
// Licentie: CC BY 4.0, 3D BAG door de 3D geoinformation-groep van de TU Delft en 3DGI.
function adelaarBag3d() {
  return [
    [1, [1.16, 2.7, 20.58, 1.14, 3.5, 20.84, 0.88, 2.71, 20.58]],
    [0, [-14, 1.69, 15.65, -15.05, 2.99, 15.57, -16.57, 1.4, 15.64]],
    [0, [-3.86, -1.43, 13.24, -13.15, -1.29, 13.17, -13.47, -2.24, 12.67, -13.47, -2.88, 12.34, -13.18, -2.89, 12.34, -13.18, -2.78, 12.4, -10.48, -2.86, 12.4, -10.48, -2.97, 12.34, -9.83, -2.98, 12.34, -9.83, -2.87, 12.4, -7.15, -2.95, 12.4, -7.16, -3.06, 12.35, -6.5, -3.08, 12.35, -6.5, -2.97, 12.4, -3.75, -3.05, 12.4]],
    [1, [-3.21, 2.85, 20.57, -2.22, 1.41, 21.42, -1.63, 2.14, 20.95, -1.18, 2.7, 20.59, 0.23, 2.67, 20.57, 0.23, 2.73, 20.53]],
    [0, [0.92, 15.78, 13.66, 0.94, 15.07, 13.66, 0.96, 13.91, 13.66, 1.14, 3.5, 13.64, 1.16, 2.7, 13.64, 0.88, 2.71, 13.8, 0.86, 2.65, 13.82, 3.28, 2.58, 12.4, 3.2, 6.09, 12.42, 3.31, 6.09, 12.35, 3.34, 6.75, 12.33, 3.23, 6.75, 12.39, 3.18, 10.67, 12.39, 3.29, 10.67, 12.32, 3.29, 11.32, 12.32, 3.18, 11.32, 12.39, 3.14, 15.25, 12.38, 3.25, 15.26, 12.31, 3.24, 15.91, 12.31, 2.74, 15.91, 12.6, 2.74, 15.8, 12.6]],
    [0, [-0.36, 15.09, 12.74, -0.57, 15.27, 12.84, 0.1, 16.21, 12.48, -0.01, 16.2, 12.53, -0.06, 19.59, 12.49, 0.05, 19.59, 12.44, 0.06, 20.23, 12.42, -0.05, 20.23, 12.47, -0.06, 23.62, 12.41, 0.05, 23.62, 12.36, 0.05, 24.27, 12.34, -0.6, 24.27, 12.68, -0.6, 24.16, 12.68, -2.53, 24.24, 13.67, -2.5, 23.59, 13.67, -2.44, 22.11, 13.67, -2.15, 15.01, 13.66, -0.56, 14.45, 12.85, -0.56, 14.93, 12.84]],
    [0, [-15.93, 25.05, 13.25, -15.98, 24.45, 12.73, -15.99, 24.32, 12.6, -2.5, 23.59, 12.77, -2.53, 24.24, 13.34, -3.21, 24.27, 13.32, -3.21, 24.38, 13.42, -3.86, 24.4, 13.39, -3.86, 24.28, 13.3, -6.47, 24.36, 13.21, -6.47, 24.47, 13.31, -7.12, 24.5, 13.29, -7.12, 24.38, 13.19, -9.84, 24.47, 13.11, -9.84, 24.59, 13.21, -9.95, 24.59, 13.2, -9.94, 24.98, 13.55, -10.58, 25, 13.53, -10.59, 24.89, 13.43, -13.15, 24.96, 13.34, -13.14, 25.07, 13.44, -13.79, 25.09, 13.42, -13.8, 24.98, 13.32]],
    [0, [-16.97, 22.02, 13.29, -16.19, 22.01, 12.75, -16.09, 23.13, 12.74, -16.01, 24.11, 12.73, -15.99, 24.32, 12.73, -15.98, 24.45, 12.73, -15.93, 25.05, 12.72, -16.37, 25.06, 13.03, -16.36, 25.17, 13.03, -17.01, 25.18, 13.48, -17.02, 24.53, 13.45, -16.91, 24.53, 13.38]],
    [0, [-15.02, 23, 13.39, -14.6, 22.53, 13.67, -2.44, 22.11, 13.67, -2.5, 23.59, 12.77, -15.99, 24.32, 12.6, -16.01, 24.11, 12.73, -16.09, 23.13, 13.33]],
    [0, [-0.36, 15.09, 12.74, -0.56, 14.93, 12.84, -0.56, 14.45, 13.2, 0.96, 13.91, 13.63, 0.94, 15.07, 12.78]],
    [0, [-0.57, 15.27, 12.84, -0.36, 15.09, 12.74, 0.94, 15.07, 12.78, 0.92, 15.78, 13.22, 0.43, 15.78, 13.2, 0.42, 15.89, 13.27, 0.1, 15.88, 13.25, 0.1, 16.21, 13.45]],
    [1, [3.4, 2.17, 20.81, 0.36, 0.16, 22.12, 0.41, -2.37, 22.11, 0.78, -2.92, 21.95, 0.46, -2.91, 22.09, 0.54, -3.18, 22.06, 2.79, -3.25, 21.09, 2.79, -3.36, 21.09, 3.47, -3.37, 20.81, 3.48, -2.71, 20.8, 3.37, -2.7, 20.85, 3.31, 1.52, 20.85, 3.42, 1.53, 20.8]],
    [1, [-3.01, -3.08, 21.11, -0.56, -3.15, 22.18, -1.12, -1.48, 21.94, -0.5, -1.07, 22.21, -0.89, -0.51, 22.04, -0.38, -0.03, 22.26, -0.7, 1.05, 22.12, -1.63, 2.14, 21.72, -2.22, 1.41, 21.46, -3.21, 2.85, 21.02, -3.57, 3.37, 20.86, -4.23, 2.88, 20.58, -4.15, 2.82, 20.61, -4.08, 1.78, 20.64, -4.53, 2.66, 20.45, -4.57, 2.63, 20.43, -3.94, -0.31, 20.7, -3.86, -1.43, 20.74, -3.75, -3.05, 20.79, -3.66, -3.06, 20.83, -3.66, -3.17, 20.82, -3.01, -3.19, 21.11]],
    [1, [0.86, 2.65, 20.56, 0.35, 1.15, 21.5, 0.36, 0.16, 22.12, 3.4, 2.17, 20.78, 3.29, 2.17, 20.78, 3.28, 2.58, 20.53]],
    [0, [-23.72, 17.4, 14.73, -26.41, 17.56, 14.73, -26.59, 13.47, 14.73, -23.9, 13.39, 14.73]],
    [0, [-17.65, -0.49, 13.52, -38.1, 0.08, 13.49, -39.72, 0.12, 13.49, -39.69, -1.42, 12.69, -39.8, -1.42, 12.69, -39.79, -2.07, 12.36, -39.14, -2.06, 12.37, -39.14, -1.95, 12.43, -37.21, -2.04, 12.41, -37.22, -2.15, 12.35, -36.56, -2.17, 12.35, -36.56, -2.06, 12.41, -33.85, -2.14, 12.41, -33.85, -2.25, 12.35, -33.2, -2.27, 12.36, -33.19, -2.16, 12.41, -30.51, -2.24, 12.41, -30.52, -2.35, 12.35, -29.86, -2.37, 12.35, -29.86, -2.26, 12.41, -27.18, -2.34, 12.41, -27.18, -2.45, 12.35, -26.53, -2.47, 12.35, -26.52, -2.36, 12.41, -23.84, -2.44, 12.41, -23.84, -2.55, 12.35, -23.19, -2.57, 12.35, -23.19, -2.46, 12.41, -20.51, -2.55, 12.41, -20.51, -2.66, 12.35, -18.08, -2.73, 12.35]],
    [0, [-38.5, 19.2, 13.65, -16.48, 18.53, 13.66, -16.37, 19.86, 12.72, -38.53, 20.55, 12.7, -38.51, 19.67, 13.33]],
    [1, [0.35, 1.15, 25.09, 0.86, 2.65, 25.45, 0.88, 2.71, 25.47, 0.23, 2.73, 25.01, 0.23, 2.67, 25.01, -1.18, 2.7, 24.01, -1.63, 2.14, 23.68, -0.7, 1.05, 24.34, -0.38, -0.03, 24.56, -0.89, -0.51, 24.2, -0.5, -1.07, 24.48, -1.12, -1.48, 24.03, -0.56, -3.15, 24.43, -0.43, -3.15, 24.52, -0.44, -3.26, 24.51, 0.22, -3.28, 24.98, 0.22, -3.17, 24.98, 0.54, -3.18, 25.21, 0.46, -2.91, 25.15, 0.78, -2.92, 25.39, 0.41, -2.37, 25.12, 0.36, 0.16, 25.1]],
    [0, [-14.6, 22.53, 13.67, -15.02, 23, 13.39, -16.09, 23.13, 12.74, -16.19, 22.01, 12.75, -16.37, 19.91, 12.77, -16.37, 19.86, 12.77, -14.88, 19.81, 13.66]],
    [0, [-17.31, 1.32, 17.75, -17.65, -0.49, 17.76, -18.08, -2.73, 17.77, -13.47, -2.88, 17.77, -13.47, -2.24, 17.77, -13.15, -1.29, 17.77, -13.48, -1.28, 17.77, -13.52, 1.74, 17.76, -14, 1.69, 17.76, -16.57, 1.4, 17.76]],
    [0, [-38.5, 19.2, 13.65, -38.1, 0.08, 13.62, -17.65, -0.49, 13.63, -17.31, 1.32, 13.63, -16.57, 1.4, 13.63, -15.05, 2.99, 13.63, -14, 1.69, 13.63, -13.52, 1.74, 13.63, -13.48, -1.28, 13.63, -13.15, -1.29, 13.63, -3.86, -1.43, 13.63, -3.94, -0.31, 13.63, -4.57, 2.63, 13.64, -4.53, 2.66, 13.64, -4.08, 1.78, 13.64, -4.15, 2.82, 13.64, -4.23, 2.88, 13.64, -3.57, 3.37, 13.64, -3.21, 2.85, 13.64, 0.23, 2.73, 13.64, 0.88, 2.71, 13.64, 1.14, 3.5, 13.64, 0.96, 13.91, 13.66, -0.56, 14.45, 13.66, -2.15, 15.01, 13.66, -2.44, 22.11, 13.67, -14.6, 22.53, 13.67, -14.88, 19.81, 13.66, -16.37, 19.86, 13.66, -16.48, 18.53, 13.66]],
    [0, [-26.7, 13.48, 13.65, -27.08, 9.98, 14.89, -9.96, 9.39, 14.91, -10.07, 11.69, 14.1, -23.94, 12.48, 13.97, -23.9, 13.39, 13.65, -26.59, 13.47, 13.65]],
    [0, [-40, 13.13, 12.3, -39.93, 10, 12.3, -40.04, 10, 12.24, -40.03, 9.35, 12.24, -39.92, 9.35, 12.3, -39.85, 6.2, 12.31, -39.96, 6.2, 12.24, -39.95, 5.55, 12.24, -39.84, 5.56, 12.31, -39.77, 2.4, 12.31, -39.88, 2.4, 12.24, -39.86, 1.75, 12.24, -39.75, 1.75, 12.31, -39.72, 0.12, 12.31, -38.1, 0.08, 13.33, -38.5, 19.2, 13.33, -38.51, 19.67, 13.33, -38.53, 20.55, 13.32, -38.54, 21.2, 13.32, -39.65, 21.24, 12.63, -39.65, 21.35, 12.63, -40.3, 21.34, 12.22, -40.29, 20.7, 12.22, -40.18, 20.7, 12.29, -40.11, 17.59, 12.29, -40.22, 17.58, 12.22, -40.2, 16.93, 12.22, -40.09, 16.93, 12.29, -40.02, 13.78, 12.3, -40.13, 13.78, 12.23, -40.11, 13.13, 12.23]],
    [0, [-17.44, 20.5, 13.29, -19.85, 20.58, 13.29, -19.84, 20.69, 13.4, -20.5, 20.71, 13.39, -20.5, 20.6, 13.29, -23.18, 20.68, 13.29, -23.18, 20.79, 13.39, -23.83, 20.81, 13.39, -23.84, 20.7, 13.28, -26.52, 20.79, 13.28, -26.51, 20.9, 13.39, -27.16, 20.92, 13.39, -27.17, 20.81, 13.28, -29.85, 20.89, 13.28, -29.85, 21, 13.39, -30.49, 21.02, 13.39, -30.5, 20.91, 13.28, -33.18, 21.01, 13.29, -33.17, 21.12, 13.39, -33.82, 21.14, 13.4, -33.82, 21.03, 13.29, -36.54, 21.12, 13.29, -36.54, 21.23, 13.4, -37.19, 21.25, 13.39, -37.19, 21.14, 13.29, -38.54, 21.2, 13.3, -38.53, 20.55, 12.7, -16.37, 19.86, 12.72, -16.37, 19.91, 12.77, -16.19, 22.01, 14.75, -16.97, 22.02, 14.74, -17, 20.94, 13.72, -17.11, 20.94, 13.72, -17.11, 20.61, 13.4, -17.44, 20.61, 13.39]],
  ];
}

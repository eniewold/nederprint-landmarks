// Watertoren van de Hollandia-fabriek aan de Veerdijk in Wormer (1888). De toren voedde de sprinklerinstallatie van
// de fabriek en staat midden in het complex, dat sinds 1980 door Stichting Hollandia wordt beheerd en verbouwd tot
// kantoor- en bedrijfsruimte. Een rechthoekige bakstenen toren van circa 6,0 × 3,7 m die boven het dak van de
// fabriek (NAP +19,3) uitsteekt. Aan de noordkant (Pakhuisplein) staat hij vrij boven de lagere hal: daar twee
// rechthoekige verdiepte panelen en twee hoge rondboognissen. Op circa 20,5 m kraagt het reservoirdeel rondom
// 0,35 m uit (gemetselde kraag), met een rondboogfries (vijf boogjes op de lange, drie op de korte zijden), een lijst,
// een band van lisenen met smalle spleten, een tweede lijst en een borstwering met rondboogvormige openingen (vijf en
// drie) onder een afdeklijst tot NAP +26,75. Op het dak van de fabriek (zuid-, oost- en westzijde) zitten
// rondboogvensters en een deur.
//
// De toren is geen eigen BAG-pand: hij hoort bij pand 0880100000004206 (bouwjaar 1877, 1760 m²), het grootste deel
// van het fabriekscomplex aan de Zaan, met de kloktoren aan de kade. De kaart en de export kunnen alleen hele panden
// verbergen; daarom vervangt het model het hele pand en neemt de GLB de rest ervan over als tweede node: de
// dakvlakken van de 3D BAG (LoD2.2, CC BY 4.0, hollandiaBag3d() onderaan) als prisma's onder hun eigen dakvlak,
// zonder de schacht van de watertoren (net als bij generate-watertoren-kweekschool-maastricht.mjs).
//
// Oorsprong op het hart van de bovenkant in het AHN-DSM (6,7 × 4,4 m boven NAP +24) op het maaiveld (NAP +0,3, het
// AHN-DTM rond de fabriek; 3D BAG-maaiveld 0,23). +X langs de noordgevel van het blok waartegen de toren staat
// (RD-richting 3,5 graden, uit de BAG- en 3D BAG-randen), +Y naar het noorden (Pakhuisplein).
// Hoogtes: top uit AHN en 3D BAG; geledingen uit de foto "Wormer Hollandia Watertoren 2" (Commons, vrijwel frontaal
// op de noordgevel met evenwijdige verticalen, 73,6 px/m uit de breedte van de bovenkant; de onderkant van de panelen
// valt dan op het dak van de hal), gecontroleerd op de RCE-foto 20386711 (vanaf het dak, zuid- en oostgevel).
// Breedte van de schacht uit dezelfde foto (0,88 × de top).
import { Manifold, CrossSection, ccw, hull, union, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [114906.45, 500648.3];
const AXIS_DEG = 3.5;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.3;
const BASE = -0.3;
// Halve maten in x (lange gevels noord en zuid) en y (korte gevels oost en west).
const SHAFT = [3.0, 1.85]; // schacht 6,0 × 3,7 m
const TOP = [3.35, 2.2]; // reservoirdeel 6,7 × 4,4 m (AHN-DSM)
// Hoogtes boven het maaiveld (NAP +0,3).
const H = {
  northPanels: [8.0, 14.3], // rechthoekige verdiepte panelen boven de hal
  northArches: [15.0, 19.6], // hoge rondboognissen
  roof: 19.0, // dak van de fabriek rond de toren (NAP +19,3)
  openings: [19.0, 20.0], // vensters op het dak (zuid, west), tot net onder de kraag
  door: [19.0, 20.05], // deur op het dak (oost)
  corbel: [20.15, 20.7], // kraag van het reservoirdeel
  arches: [21.0, 22.1], // rondboogfries
  band1: [22.25, 22.55],
  slots: [22.6, 23.15], // lisenen met spleten (plafond tot 23,55, onder de lijst)
  band2: [23.75, 24.05],
  holes: [24.8, 25.35], // rondboogvormige openingen in de borstwering (plafond tot 25,75)
  coping: [26.05, 26.45], // afdeklijst, top NAP +26,75
};
const rect = ([hx, hy], z) => [[-hx, -hy, z], [hx, -hy, z], [hx, hy, z], [-hx, hy, z]];
const grow = ([hx, hy], d) => [hx + d, hy + d];

// Nis met een plafond dat naar binnen onder 63 graden oploopt, in het vlak met normaal +X op afstand f; w breed, van
// z0 tot z1, op positie y langs de gevel.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  // Buiten de gevel loopt de snede schuin af naar z1 - 1,5, maar nooit onder de dorpel (anders kerft hij de lijst eronder).
  const a = f - depth, b = f + 1.0, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// place draait om Z: 0 = oostgevel (+X), 90 = noordgevel (+Y), 180 = westgevel, 270 = zuidgevel.
const EAST = 0, NORTH = 90, WEST = 180, SOUTH = 270;
const half = (deg, s) => (deg === EAST || deg === WEST ? s[0] : s[1]); // afstand hart-gevelvlak
const spread = (n, step) => Array.from({ length: n }, (_, i) => (i - (n - 1) / 2) * step);
// Per gevel een rij gelijke nissen: n op de lange (noord, zuid) en m op de korte gevels (oost, west).
const row = (s, n, m, step, w, z0, z1, depth) =>
  [EAST, NORTH, WEST, SOUTH].flatMap((deg) =>
    spread(deg === NORTH || deg === SOUTH ? n : m, step).map((y) => place(niche(half(deg, s), w, z0, z1, depth, y), { deg })));
// Lijst rondom met een onderkant onder 45 graden.
const band = (s, d, z0, z1) => hull([...rect(s, z0 - d), ...rect(grow(s, d), z0), ...rect(grow(s, d), z1)]);

// ---------- watertoren ----------
const shaft = box(-SHAFT[0], -SHAFT[1], BASE, SHAFT[0], SHAFT[1], H.corbel[0] + 0.01);
// Kraag: 0,35 m uit over 0,55 m hoogte (58 graden).
const corbel = hull([...rect(SHAFT, H.corbel[0]), ...rect(TOP, H.corbel[1])]);
const upper = box(-TOP[0], -TOP[1], H.corbel[1] - 0.01, TOP[0], TOP[1], H.coping[0] + 0.01);
const bands = union([band(TOP, 0.1, ...H.band1), band(TOP, 0.12, ...H.band2), band(TOP, 0.08, ...H.coping)]);
const cuts = union([
  // Noordgevel boven de hal: twee verdiepte panelen, daarboven twee hoge rondboognissen.
  ...[-1.25, 1.25].map((y) => place(niche(SHAFT[1], 1.4, ...H.northPanels, 0.25, y), { deg: NORTH })),
  ...[-1.25, 1.25].map((y) => place(niche(SHAFT[1], 1.4, ...H.northArches, 0.3, y), { deg: NORTH })),
  // Op het dak: twee rondboogvensters in de zuidgevel, een deur in de oostgevel, een venster in de westgevel.
  ...[-1.25, 1.25].map((y) => place(niche(SHAFT[1], 0.9, ...H.openings, 0.3, y), { deg: SOUTH })),
  place(niche(SHAFT[0], 1.0, ...H.door, 0.35, -0.6), { deg: EAST }),
  place(niche(SHAFT[0], 0.9, ...H.openings, 0.3), { deg: WEST }),
  // Rondboogfries: vijf en drie boogjes van 0,6 m, 1,2 m uit elkaar.
  ...row(TOP, 5, 3, 1.2, 0.6, ...H.arches, 0.25),
  // Lisenen: spleten van 0,45 m, 0,7 m uit elkaar (negen en zes).
  ...row(TOP, 9, 6, 0.7, 0.45, ...H.slots, 0.2),
  // Borstwering: rondboogvormige openingen van 0,6 m (vijf en drie), als blinde nis.
  ...row(TOP, 5, 3, 1.2, 0.6, ...H.holes, 0.2),
]);
const tower = union([shaft, corbel, upper, bands]).subtract(cuts);

// ---------- rest van het fabriekspand (3D BAG) ----------
// Elk dakvlak als prisma vanaf de onderkant, afgesneden door het vlak z = a x + b y + c (kleinste kwadraten door de
// hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen. Het vlak van de watertoren (toren = 1) ligt
// als vlak op het dak van de fabriek (19,0 m); de schacht zelf is eruit gesneden.
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
const factory = union(hollandiaBag3d().map(([isTower, flat]) => roofPrism(xyz(flat), isTower ? [0, 0, H.roof] : fitPlane(xyz(flat)))))
  .subtract(box(-SHAFT[0], -SHAFT[1], BASE - 1, SHAFT[0], SHAFT[1], 40));

await writeLandmark({
  slug: "watertoren-wormer-hollandia",
  base: BASE,
  nodes: [
    ["building:watertoren-schacht-kraag-en-borstwering", tower],
    ["building:fabriek-hollandia", factory],
  ],
  catalog: {
    name: "Watertoren Hollandia Wormer",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Terugval: NAP +0,3 plus de geoïdehoogte (circa 42,75 m, tussen Assendelft en Kwadijk).
    groundHeight: 43.05,
    replacesBuildings: ["NL.IMBAG.Pand.0880100000004206"],
    description:
      "Oorsprong op het hart van de watertoren op het maaiveld (NAP +0,3 m), +X langs de noordgevel van het fabrieksblok (RD-richting 3,5 graden), +Y naar het noorden (Pakhuisplein). Rechthoekige schacht van 6,0 × 3,7 m met panelen en hoge rondboognissen aan de noordkant, vensters en een deur op het fabrieksdak (19,0 m), een kraag van 0,35 m tot een reservoirdeel van 6,7 × 4,4 m met rondboogfries, twee lijsten, lisenen met spleten en een borstwering met rondboogopeningen tot 26,45 m. De toren hoort bij BAG-pand 0880100000004206 (het fabriekscomplex met de kloktoren); dat pand wordt vervangen en building:fabriek-hollandia is de 3D BAG-reconstructie (CC BY 4.0) van de rest ervan, zonder de toren.",
    realWorld: {
      built: 1888,
      purpose: "sprinklerinstallatie van de Hollandia-fabriek",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 26.8,
      bag3dTopNapM: 26.75,
      factoryRoofNapM: 19.3,
      shaftM: [SHAFT[0] * 2, SHAFT[1] * 2],
      reservoirM: [TOP[0] * 2, TOP[1] * 2],
      corbelM: H.corbel,
      archFriezeM: H.arches,
      slotBandM: H.slots,
      parapetOpeningsM: H.holes,
      topM: H.coping[1],
      photoScalePxPerM: 73.6,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Wormer_Hollandia) (1888, sprinklerinstallatie, Stichting Hollandia)",
      "https://commons.wikimedia.org/wiki/File:Wormer_Hollandia_Watertoren_2.JPG (noordgevel vrijwel frontaal: geledingen, breedtes)",
      "https://commons.wikimedia.org/wiki/File:Zicht_op_toren,_vanaf_het_dak_-_Wormer_-_20386711_-_RCE.jpg (zuid- en oostgevel boven het dak: kraag, vensters, deur, aantallen boogjes en openingen)",
      "https://commons.wikimedia.org/wiki/File:Achterzijdel,_overzicht_-_Wormer_-_20387156_-_RCE.jpg en File:Overzicht_van_de_achterzijde_-_Wormer_-_20386716_-_RCE.jpg (toren in het complex)",
      "PDOK BAG-pand 0880100000004206, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0880100000004206, LoD2.2-dakvlakken, opgehaald 2026-11-04",
    ],
  },
});

// ---------- data: dakvlakken van het fabriekspand ----------
// Dakvlakken (RoofSurface, LoD2.2) van 3D BAG-pand NL.IMBAG.Pand.0880100000004206 in het modelstelsel: x langs
// RD-richting 3,5 graden, y haaks daarop (linksom), beide in meters vanaf ORIGIN, z in meters boven NAP +0,3,
// afgerond op 1 cm. Per vlak [toren, buitenrand] (geen gaten); toren = 1 voor het dakvlak van de watertoren zelf.
// Bron: https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0880100000004206, opgehaald 2026-11-04.
// Licentie: CC BY 4.0, 3D BAG door de 3D geoinformation-groep van de TU Delft en 3DGI.
function hollandiaBag3d() {
  return [
    [0, [18.41, 9.35, 5.59, 22.65, 9.4, 5.56, 22.63, 12.48, 5.34, 18.42, 11.1, 5.46]],
    [0, [13.93, 1.34, 4.03, 18.39, 1.34, 8.01, 18.41, 6.74, 8.16, 15.73, 6.67, 5.77, 14.06, 1.71, 4.15]],
    [0, [19.07, -22.86, 27.09, 18.99, -19.86, 26.81, 16.84, -22.85, 26.81]],
    [0, [-7.58, 11.23, 7.61, -8.84, 11.22, 7.62, -8.83, 9.72, 8.54, -9.77, 9.71, 8.54, -9.79, 8.66, 9.19, 9.22, 8.52, 9.3, 9.37, 9.84, 8.49, 8.98, 9.83, 8.5, 8.99, 9.92, 8.45, 9.11, 11.62, 7.4, -5.48, 13.61, 6.16, -7.58, 11.52, 7.44]],
    [1, [3.12, 1.34, 26.46, -2.76, 1.34, 26.46, -2.82, -1.83, 26.43, 3.06, -1.62, 26.44]],
    [0, [15.45, -21.89, 23.06, 15.47, -22.85, 23.07, 16.84, -22.85, 23.1, 18.99, -19.86, 23.14, 18.95, -18.37, 23.13, 16.29, -18.51, 23.06]],
    [0, [9.78, 6.5, 10.43, 9.22, 8.52, 10.4, -9.79, 8.66, 10.41, -9.82, 5.63, 10.45, 9.34, 5.42, 10.44, 9.36, 5.87, 10.44, 9.83, 6.32, 10.43]],
    [0, [-2.76, 1.34, 6.86, 3.12, 1.34, 6.88, 9.79, 1.34, 6.9, 9.28, 3.75, 8.36, 9.34, 5.42, 9.37, -9.82, 5.63, 9.44, -9.87, 1.35, 6.84]],
    [0, [9.83, 6.32, 4.14, 9.36, 5.87, 4.16, 9.34, 5.42, 4.17, 9.28, 3.75, 4.2, 9.79, 1.34, 4.23, 13.93, 1.34, 4.16, 14.06, 1.71, 4.15, 15.73, 6.67, 4.04, 9.78, 6.5, 4.14]],
    [0, [9.22, 8.52, 8.47, 9.78, 6.5, 8.5, 15.73, 6.67, 8.47, 18.41, 6.74, 8.46, 18.41, 7, 8.46, 18.41, 9.35, 8.42, 18.42, 11.1, 8.39, 22.63, 12.48, 8.35, 22.58, 19.24, 8.23, 22.32, 19.24, 8.23, 22.32, 19.3, 8.23, 17.73, 19.26, 8.25, 17.63, 33.35, 8.01, -2.91, 33.21, 8.1, -2.86, 19.73, 8.33, -7.61, 19.72, 8.35, -7.58, 11.52, 8.49, -5.48, 13.61, 8.44, 9.11, 11.62, 8.42, 8.99, 9.92, 8.45, 8.98, 9.83, 8.45, 9.37, 9.84, 8.45]],
    [0, [20.14, -8.22, 18.48, 30.64, -8.18, 18.47, 31.03, -6.62, 18.56, 18.47, -6.46, 18.59, 18.48, -8.6, 18.46, 20.16, -8.5, 18.46]],
    [0, [37.03, -6.88, 18.64, 36.8, -6.69, 18.55, 31.03, -6.62, 18.56, 30.64, -8.18, 19.32, 36.72, -8.15, 19.26]],
    [0, [39.59, 8.95, 14.93, 38.04, -1.56, 14.84, 37.39, -0.91, 15.17, 36.21, -3.54, 15.5, 36.19, -5.65, 15.36, 36.33, -6.29, 15.25, 36.8, -6.69, 15.01, 37.03, -6.88, 14.89, 40.89, 8.96, 14.34]],
    [0, [18.39, 1.34, 24, 18.36, -6.19, 24, 18.09, -6.46, 24, 18.47, -6.46, 24, 31.03, -6.62, 23.98, 36.8, -6.69, 23.96, 36.33, -6.29, 23.96, 36.19, -5.65, 23.96, 36.21, -3.54, 23.96, 37.39, -0.91, 23.96, 36.33, 0.16, 23.96, 36.05, 9.28, 23.95, 22.65, 9.2, 23.98, 22.65, 9.4, 23.98, 18.41, 9.35, 23.99, 18.41, 7, 23.99, 18.41, 6.74, 23.99]],
    [0, [-8.89, 0.53, 18.96, -8.86, -19.74, 18.92, 3.09, -19.46, 18.97, 3.08, -19.24, 18.97, 15.4, -19.05, 19.02, 15.45, -21.89, 19.01, 16.29, -18.51, 19.02, 18.95, -18.37, 19.04, 18.69, -9.01, 19.05, 20.18, -8.89, 19.06, 20.16, -8.5, 19.06, 18.48, -8.6, 19.05, 18.47, -6.46, 19.06, 18.09, -6.46, 19.06, 18.36, -6.19, 19.06, 18.39, 1.34, 19.07, 13.93, 1.34, 19.06, 9.79, 1.34, 19.04, 3.12, 1.34, 19.01, 3.06, -1.62, 19, -2.82, -1.83, 18.98, -2.76, 1.34, 18.99, -9.87, 1.35, 18.96, -9.88, 0.53, 18.95]],
    [0, [38.04, -1.56, 23.43, 39.59, 8.95, 23.41, 40.89, 8.96, 23.49, 40.98, 9.31, 23.5, 36.05, 9.28, 23.18, 36.33, 0.16, 23.3, 37.39, -0.91, 23.38]],
  ];
}

// Watertoren van de voormalige stoomspinnerij Twenthe aan het Twenthe-plein in Almelo (rijksmonument 507707, het
// hele fabrieksgebouw; Wikipedia: 1914, voor de sprinklerinstallatie; het register noemt een ontwerp van Arend Beltman
// uit 1916). Sinds 1993 is het gebouw een bedrijvencentrum. De slanke toren staat midden in de voorgevel (noordwest, aan
// het plein) tussen het hogere zuidwestblok (19 m) en het lagere noordoostblok (15,4 m) en steekt voor de gevel uit.
// Register: "Slanke onderbouw met uitkragend reservoir, dubbele hoeklisenen, kleine vensters onder lateien en
// tandlijsten." Schacht van 3,3 m met brede betonnen hoekpenanten en een teruggelegd bakstenen vlak, in de voorgevel
// een rij vensters; bovenaan kapitelen en zware consoles onder een betonnen plaat; het reservoirdeel van circa 5,7 m
// met dubbele hoeklisenen, een venster met latei in elk vlak, een fries met tandlijst, een kroonlijst en een gladde
// attiek tot NAP +41,75. Op het dak staan de reclameletters "TWENTHE CENTRUM" op een stalen frame langs de noordoost-
// en zuidoostrand. De tweede, veel bredere watertoren (aan de oostkant, met "TWENTHE" in de fries) hoort bij hetzelfde
// BAG-pand en staat als 3D BAG-blok in het model.
//
// De toren is geen eigen BAG-pand: hij hoort bij pand 0141100000013065 (bouwjaar 1916, circa 110 × 105 m), het hele
// spinnerijgebouw. De kaart en de export kunnen alleen hele panden verbergen; daarom vervangt het model het hele pand
// en neemt de GLB de rest ervan over als tweede node: de dakvlakken van de 3D BAG (LoD2.2, CC BY 4.0, twentheBag3d()
// onderaan) als prisma's onder hun eigen dakvlak, zonder de schacht en het dakvlak van de toren (net als bij
// generate-watertoren-wormer-hollandia.mjs).
//
// Oorsprong op het hart van de schacht (de uitstulping van de BAG-contour in de voorgevel, 3,32 m breed, voorvlak 2,96 m
// voor de gevel van het zuidwestblok; vierkant aangenomen) op het maaiveld (AHN-DTM voor de toren NAP +11,3, 5e tot 50e
// percentiel 11,13-11,27; 3D BAG-maaiveld 11,38). +X langs de voorgevel naar het noordoosten (RD-richting 42,8 graden,
// uit de BAG-randen), +Y naar het plein (noordwest).
// Maten: schacht uit de BAG; reservoirdeel uit het AHN-DSM 0,5 m (bovenkant NAP +41,7 tot 41,8, rand x -3,0 tot 3,1)
// en de luchtfoto; geledingen uit de RCE-foto 20311719 ("Overzicht voorgevel", vrijwel diagonaal op de westhoek, 30 px/m
// op de kop uit de breedte van het reservoirdeel), gecontroleerd op "Watertoren Spinnerij Almelo 1914" (Commons, 2003).
import { Manifold, CrossSection, ccw, hull, union, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [241584.89, 486153.26];
const AXIS_DEG = 42.8;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 11.3;
const BASE = -0.3;
const S = 1.66; // halve breedte van de schacht (hoekpenanten, BAG 3,32 m)
const PANEL = S - 0.2; // bakstenen vlak tussen de penanten, 0,2 m terug
const PIER = 0.95; // breedte van een hoekpenant langs het vlak
const CAP = S + 0.12; // kapiteel van de penanten
const SLAB = 2.95; // betonnen plaat onder het reservoirdeel
const HEAD = 2.85; // hoeklisenen en attiek van het reservoirdeel
const HEAD_PANEL = HEAD - 0.2; // bakstenen vlak tussen de lisenen
const LISENE = 1.1; // dubbele hoeklisenen samen, langs elk vlak
const FRIEZE = HEAD - 0.05; // fries met tandlijst
const CORNICE = HEAD + 0.15; // kroonlijst
// Hoogtes boven het maaiveld (NAP +11,3).
const H = {
  windows: [[0.7, 3.9], [5.6, 8.5], [10.1, 13.0], [14.5, 17.4], [18.6, 19.6]], // vensters in de voorgevel van de schacht
  cap: [20.6, 21.15], // kapitelen van de hoekpenanten
  corbel: [21.0, 22.3], // schuine onderkant onder de plaat (45 graden)
  console: [21.0, 22.3], // consoles op de hoeken
  slab: [22.3, 23.3],
  headWindow: [23.9, 26.0], // venster in elk vlak van het reservoirdeel
  lintel: [26.2, 26.6], // latei boven het venster
  liseneCap: [26.9, 27.2], // kapitelen van de lisenen
  frieze: [27.2, 28.2], // fries met tandlijst
  cornice: [28.2, 28.6],
  top: 30.45, // bovenkant van de attiek (AHN NAP +41,75)
  sign: 32.6, // reclameletters op het frame (AHN-DSM tot NAP +44)
};
const sq = (h, z) => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]];
// place draait om Z: 0 = noordoostvlak (+X), 90 = voorvlak (+Y, plein), 180 = zuidwestvlak, 270 = zuidoostvlak.
const FACES = [0, 90, 180, 270];
const FRONT = 90;
const QUADRANTS = [[1, 1], [-1, 1], [-1, -1], [1, -1]];

// Nis met een plafond dat naar binnen onder 63 graden oploopt, in het vlak met normaal +X op afstand f; w breed, van
// z0 tot z1, op positie y langs het vlak.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Teruggelegd vlak tussen twee hoekpenanten (normaal +X): vlak op f, penant pier breed langs het vlak vanaf elke hoek,
// diepte d, plafond onder 45 graden.
const recess = (f, pier, z0, z1, d) => {
  const h = f - pier;
  return hull([
    [f - d, -h, z0], [f - d, h, z0], [f + 1, -h, z0], [f + 1, h, z0],
    [f - d, -h, z1 - d], [f - d, h, z1 - d], [f + 1, -h, z1 + 1], [f + 1, h, z1 + 1],
  ]);
};
// Lijst rondom met een onderkant onder 45 graden vanaf het vlak aIn.
const ledge = (aIn, a, z0, z1) => hull([...sq(aIn, z0 - (a - aIn)), ...sq(a, z0), ...sq(a, z1)]);
// Alleen de vier hoeken (w langs elk vlak vanaf de hoek op halve breedte h) van een solid.
const corners = (m, h, w, z0, z1) =>
  m.intersect(union(QUADRANTS.map(([sx, sy]) => box(
    Math.min(sx * (h - w), sx * (h + 1)), Math.min(sy * (h - w), sy * (h + 1)), z0,
    Math.max(sx * (h - w), sx * (h + 1)), Math.max(sy * (h - w), sy * (h + 1)), z1))));

// ---------- schacht ----------
const shaft = box(-S, -S, BASE, S, S, H.corbel[0] + 0.01)
  .subtract(union(FACES.map((deg) => place(recess(S, PIER, 0, H.cap[0], 0.2), { deg }))));
// Kapitelen alleen op de hoekpenanten, met een onderkant van 45 graden.
const caps = corners(ledge(S, CAP, ...H.cap), S, PIER, H.cap[0] - 0.2, H.cap[1] + 0.01);
// Schuine onderkant van de plaat (45 graden) en consoles op de hoeken die er circa 0,25 m onder uitsteken.
const corbel = hull([...sq(S, H.corbel[0]), ...sq(SLAB, H.corbel[1])]);
const consoles = union(QUADRANTS.map(([sx, sy]) => hull([
  ...[[0.85, 0.85], [CAP, 0.85], [CAP, CAP], [0.85, CAP]].map(([x, y]) => [sx * x, sy * y, H.console[0] - 0.15]),
  ...[[SLAB - 1.05, SLAB - 1.05], [SLAB, SLAB - 1.05], [SLAB, SLAB], [SLAB - 1.05, SLAB]].map(([x, y]) => [sx * x, sy * y, H.console[1]]),
])));
const slab = box(-SLAB, -SLAB, H.slab[0] - 0.01, SLAB, SLAB, H.slab[1]);

// ---------- reservoirdeel ----------
const head = box(-HEAD, -HEAD, H.slab[1] - 0.01, HEAD, HEAD, H.top)
  .subtract(union(FACES.map((deg) => place(recess(HEAD, LISENE, H.slab[1], H.liseneCap[0], 0.2), { deg }))));
const liseneCaps = corners(ledge(HEAD, HEAD + 0.1, ...H.liseneCap), HEAD, LISENE, H.liseneCap[0] - 0.2, H.liseneCap[1] + 0.01);
// Latei boven elk venster: 2,0 m breed, 0,1 m voor het bakstenen vlak, onderkant 45 graden.
const lintels = union(FACES.map((deg) => place(hull([
  [HEAD_PANEL - 0.01, -1.0, H.lintel[0] - 0.11], [HEAD_PANEL - 0.01, 1.0, H.lintel[0] - 0.11],
  [HEAD_PANEL + 0.1, -1.0, H.lintel[0]], [HEAD_PANEL + 0.1, 1.0, H.lintel[0]],
  [HEAD_PANEL + 0.1, -1.0, H.lintel[1]], [HEAD_PANEL + 0.1, 1.0, H.lintel[1]],
  [HEAD_PANEL - 0.01, -1.0, H.lintel[1]], [HEAD_PANEL - 0.01, 1.0, H.lintel[1]],
]), { deg })));
// Fries met tandlijst (de tanden zelf zijn kleiner dan 0,9 m) over de hele breedte, daarboven de kroonlijst.
const frieze = box(-FRIEZE, -FRIEZE, H.frieze[0] - 0.01, FRIEZE, FRIEZE, H.frieze[1] + 0.01);
const cornice = ledge(FRIEZE, CORNICE, ...H.cornice);
// Reclameletters "TWENTHE CENTRUM" op hun frame langs de noordoost- en zuidoostrand, als dichte plaat van 0,9 m.
const sign = union([
  box(HEAD - 1.1, -HEAD + 0.2, H.top - 0.01, HEAD - 0.2, HEAD - 0.2, H.sign),
  box(-HEAD + 0.2, -HEAD + 0.2, H.top - 0.01, HEAD - 0.2, -HEAD + 1.1, H.sign),
]);

const cuts = union([
  // Vensters in de voorgevel van de schacht, onder elkaar.
  ...H.windows.map(([z0, z1]) => place(niche(PANEL, 0.9, z0, z1, 0.3), { deg: FRONT })),
  // Een venster in elk vlak van het reservoirdeel.
  ...FACES.map((deg) => place(niche(HEAD_PANEL, 1.3, ...H.headWindow, 0.3), { deg })),
]);
const tower = union([shaft, caps, corbel, consoles, slab, head, liseneCaps, lintels, frieze, cornice, sign]).subtract(cuts);

// ---------- rest van het spinnerijgebouw (3D BAG) ----------
// Elk dakvlak als prisma vanaf de onderkant, afgesneden door het vlak z = a x + b y + c (kleinste kwadraten door de
// hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen. Het dakvlak van de watertoren (toren = 1)
// beslaat ook een strook van het gebouw achter de schacht; die strook krijgt de dakhoogte van het blok ernaast
// (zuidwestblok 19,0 m tot de schacht, noordoostblok 15,4 m), zonder het deel voor de gevels. De schacht zelf is eruit
// gesneden.
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
const outlinePrism = (pts, top) =>
  Manifold.extrude(new CrossSection([ccw(pts.map(([x, y]) => [x, y]))]).offset(0.02, "Miter"), top - BASE).translate([0, 0, BASE]);
const roofPrism = (pts, [a, b, c]) => {
  const top = Math.max(...pts.map(([x, y]) => a * x + b * y + c)) + 1;
  const len = Math.hypot(a, b, 1);
  return outlinePrism(pts, top).trimByPlane([a / len, b / len, -1 / len], -c / len);
};
const ROOF_SW = 19.0, ROOF_NE = 15.4;
const FACADE_SW = -1.3, FACADE_NE = -1.22; // voorgevels naast de schacht (BAG)
const factory = union(twentheBag3d().map(([isTower, flat]) => {
  const pts = xyz(flat);
  if (!isTower) return roofPrism(pts, fitPlane(pts));
  const strip = outlinePrism(pts, ROOF_SW);
  return union([
    strip.intersect(box(-20, -20, BASE - 1, S, FACADE_SW, ROOF_SW)),
    strip.intersect(box(S, -20, BASE - 1, 20, FACADE_NE, ROOF_NE)),
  ]);
})).subtract(box(-S, -S, BASE - 1, S, S, 40));

await writeLandmark({
  slug: "watertoren-almelo-1914",
  base: BASE,
  nodes: [
    ["building:watertoren-schacht-consoles-en-reservoirdeel", tower],
    ["building:spinnerij-twenthe", factory],
  ],
  catalog: {
    name: "Watertoren Spinnerij Twenthe Almelo",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Terugval: NAP +11,3 plus de geoïdehoogte (circa 43,4 m; Alphatoren Enschede 43,5, Kasteel Twickel 43,3).
    groundHeight: 54.7,
    replacesBuildings: ["NL.IMBAG.Pand.0141100000013065"],
    description:
      "Oorsprong op het hart van de schacht van de watertoren op het maaiveld (NAP +11,3 m), +X langs de voorgevel van de spinnerij (RD-richting 42,8 graden), +Y naar het Twenthe-plein (noordwest). Schacht van 3,32 m met hoekpenanten, een teruggelegd vlak en vijf vensters in de voorgevel tot 20,6 m; kapitelen, consoles en een schuine onderkant onder een plaat van 5,9 m (22,3 tot 23,3 m); reservoirdeel van 5,7 m met hoeklisenen, een venster met latei in elk vlak, een fries, een kroonlijst en een attiek tot 30,45 m, en de reclameletters op het dak als dichte plaat tot 32,6 m. De toren hoort bij BAG-pand 0141100000013065 (het hele spinnerijgebouw); dat pand wordt vervangen en building:spinnerij-twenthe is de 3D BAG-reconstructie (CC BY 4.0) van de rest ervan, zonder de toren.",
    realWorld: {
      built: 1914,
      registerDesign: "Arend Beltman, 1916 (fabrieksgebouw)",
      purpose: "bluswater voor de sprinklerinstallatie van de stoomspinnerij Twenthe",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 41.75,
      bag3dTopNapM: 41.7,
      shaftM: S * 2,
      slabM: SLAB * 2,
      headM: HEAD * 2,
      corbelM: H.corbel,
      slabZM: H.slab,
      friezeM: H.frieze,
      corniceM: H.cornice,
      topM: H.top,
      signTopM: H.sign,
      photoScalePxPerM: 30,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Almelo_Spinnerij) (1914, sprinklerinstallatie, rijksmonument 507707)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/507707 (spinnerij Twenthe, A. Beltman 1916; slanke watertoren in de voorgevel met uitkragend reservoir, dubbele hoeklisenen, vensters onder lateien en tandlijsten)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_VOORGEVEL_-_Almelo_-_20311719_-_RCE.jpg (geledingen, consoles, lisenen, vensters, letters)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Spinnerij_Almelo_1914.jpg (kop, consoles, vensters, letters op het frame; 2003)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_FABRIEKSCOMPLEX_-_Almelo_-_20297222_-_RCE.jpg en File:Exterieur_OVERZICHT_FABRIEKSCOMPLEX_-_Almelo_-_20297223_-_RCE.jpg (toren in het complex)",
      "PDOK BAG-pand 0141100000013065, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-05",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0141100000013065, LoD2.2-dakvlakken, opgehaald 2026-11-05",
    ],
  },
});

// ---------- data: dakvlakken van het spinnerijgebouw ----------
// Dakvlakken (RoofSurface, LoD2.2) van 3D BAG-pand NL.IMBAG.Pand.0141100000013065 in het modelstelsel: x langs
// RD-richting 42,8 graden, y haaks daarop (linksom), beide in meters vanaf ORIGIN, z in meters boven NAP +11,3,
// afgerond op 1 cm. Per vlak [toren, buitenrand]; twee vlakken met een gat (onder hogere vlakken) staan zonder gat,
// twee splinters op maaiveld (< 0,1 m²) zijn weggelaten; toren = 1 voor het dakvlak van de watertoren.
// Bron: https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0141100000013065, opgehaald 2026-11-05.
// Licentie: CC BY 4.0, 3D BAG door de 3D geoinformation-groep van de TU Delft en 3DGI.
function twentheBag3d() {
  return [
    [1, [-2.97, -2.65, 30.46, 2.31, -5.32, 30.52, 2.36, -5.3, 30.52, 2.35, -4.27, 30.51, 3.69, -4.12, 30.52, 2.18, -1.22, 30.47, 1.98, -1.22, 30.47, 1.98, -0.82, 30.46, 1.63, -0.82, 30.46, 1.64, 1.63, 30.43, -1.67, 1.65, 30.41, -1.64, -1.3, 30.45, -2.12, -1.31, 30.45]],
    [0, [57.77, -44.7, 12.7, 58.34, -43.82, 12.68, 57.59, -42.62, 12.67, 56.6, -43.53, 12.68]],
    [0, [-30.44, -25.5, 10.16, -27.02, -25.49, 11.59, -26.98, -17.78, 11.62, -30.43, -18.79, 10.17]],
    [0, [-23.45, -17.99, 11.6, -26.83, -17.74, 10.25, -26.98, -17.78, 10.19, -27.02, -25.49, 10.17, -23.47, -25.49, 11.59]],
    [0, [19.2, -25.63, 15.23, 21.22, -25.74, 16.07, 22.66, -25.4, 16.68, 22.65, -17.98, 16.66, 22.65, -17.75, 16.66, 19.22, -17.72, 15.22]],
    [0, [33.04, -25.56, 15.34, 36.48, -25.61, 16.77, 36.49, -17.93, 16.76, 33.06, -17.97, 15.33]],
    [0, [39.92, -25.66, 16.78, 39.93, -17.89, 16.77, 36.49, -17.93, 15.35, 36.48, -25.61, 15.36]],
    [0, [43.44, -25.71, 16.84, 43.46, -17.85, 16.84, 39.93, -17.89, 15.38, 39.92, -25.66, 15.39]],
    [0, [61.85, -27.15, 25.37, 64.53, -27.18, 25.37, 64.53, -20.56, 25.3, 56.86, -20.53, 25.29, 56.86, -16.33, 25.25, 56.29, -21.66, 25.3, 55.86, -25.7, 25.34, 55.62, -27.94, 25.37, 61.85, -28.61, 25.39]],
    [0, [-4.68, -16.93, 20.97, -9.38, -18.41, 21, -2.15, -18.33, 20.98, -2.45, -16.22, 20.96]],
    [0, [-4.64, -9.03, 20.41, -4.68, -16.93, 20.4, -2.45, -16.22, 20.47, -3.49, -8.84, 20.45]],
    [0, [19.2, -25.98, 16.65, 19.2, -25.63, 16.65, 19.22, -17.72, 16.65, 15.73, -17.69, 15.2, 15.74, -25.55, 15.21, 15.74, -25.77, 15.21]],
    [0, [-21.7, -18.12, 10.9, -23.45, -17.99, 10.2, -23.47, -25.49, 10.18, -19.3, -25.48, 11.85, -20.29, -17.56, 11.46]],
    [0, [-43.02, -47.75, 9.97, -44.33, -47.74, 9.96, -44.33, -48.5, 11.16, -22.34, -48.5, 11.15, -22.35, -47.86, 10.15, -22.35, -47.85, 10.13]],
    [0, [5.3, -17.87, 14.78, 5.3, -17.59, 14.78, 3.91, -17.54, 14.74, 2.5, -17.71, 14.7, 2.38, -17.73, 14.7, 2.66, -31.36, 14.69, 5.36, -31.25, 14.76, 5.33, -25.83, 14.77]],
    [0, [6.06, -17.62, 15.43, 5.3, -17.87, 15.12, 5.33, -25.83, 15.13, 8.83, -25.95, 16.57, 8.81, -17.73, 16.56]],
    [0, [26.12, -17.82, 16.7, 22.65, -17.98, 15.25, 22.66, -25.4, 15.26, 22.66, -25.51, 15.26, 26.1, -25.5, 16.69]],
    [0, [-43.31, -33.43, 11.95, -43.3, -36.14, 11.94, -43.02, -47.75, 11.9, -22.35, -47.85, 11.91, -22.61, -33.47, 11.96]],
    [0, [51.83, -25.78, 15.97, 51.83, -27.54, 15.97, 55.62, -27.94, 15.99, 55.86, -25.7, 16]],
    [0, [11.68, -42.13, 6.1, 4.85, -42.28, 6.12, 4.49, -43.32, 6.12, 1.57, -43.33, 6.13, -0.88, -43.35, 6.14, -0.89, -48.49, 6.15, 43.99, -48.49, 6.03, 44.01, -43.12, 6.02, 11.97, -43.28, 6.1]],
    [0, [4.85, -42.28, 15.54, 11.68, -42.13, 15.55, 11.43, -41.16, 15.51, 5.31, -40.97, 15.49]],
    [0, [61.83, -46.57, 6.45, 61.83, -43.64, 6.44, 58.39, -43.74, 6.45, 58.34, -43.82, 6.45, 57.77, -44.7, 6.45, 56.6, -43.53, 6.45, 56.29, -43.8, 6.45, 47.71, -44.05, 6.47, 47.7, -46.89, 6.47]],
    [0, [50.42, -39.65, 11.88, 48.81, -39.68, 11.88, 48.79, -42.28, 11.84, 47.72, -42.25, 11.84, 47.71, -44.05, 11.81, 56.29, -43.8, 11.82, 56.6, -43.53, 11.83, 57.59, -42.62, 11.85, 58.34, -43.82, 11.83, 58.39, -43.74, 11.83, 61.83, -43.64, 11.84, 61.84, -33.55, 12, 48.85, -33.51, 11.98, 48.83, -36.82, 11.92, 48.63, -36.98, 11.92, 48.82, -37.29, 11.92, 48.82, -38.14, 11.9, 49.52, -35.55, 11.95, 50.97, -35.97, 11.94, 50.24, -38.19, 11.91]],
    [0, [61.84, -33.55, 12, 61.85, -30.21, 15.55, 48.87, -30.24, 15.46, 48.85, -33.51, 11.98]],
    [0, [27.42, -17.96, 15.82, 26.9, -17.78, 15.6, 26.12, -17.82, 15.27, 26.1, -25.5, 15.28, 27.84, -25.5, 16.01, 28.15, -25.8, 16.14, 29.42, -25.77, 16.67, 29.57, -25.66, 16.73, 29.57, -25.49, 16.73, 29.54, -17.78, 16.7]],
    [0, [48.81, -39.68, 12.9, 50.42, -39.65, 12.94, 50.24, -38.19, 12.95, 50.97, -35.97, 12.99, 49.52, -35.55, 12.95, 48.82, -38.14, 12.91]],
    [0, [19.02, 0.33, 15.61, 19.01, -1.32, 15.54, 2.18, -1.22, 15.51, 3.69, -4.12, 15.4, 4.04, -4.79, 15.38, 7.66, -3.7, 15.43, 13.17, -3.1, 15.46, 12.99, -3.58, 15.44, 21.55, -1.87, 15.53, 21.53, -1.33, 15.55, 21.45, -1.33, 15.55, 21.45, 0.41, 15.61, 19.37, 0.41, 15.61, 19.35, 0.25, 15.6]],
    [0, [30.48, -25.74, 15.68, 33.04, -25.67, 16.73, 33.04, -25.56, 16.73, 33.06, -17.97, 16.74, 33.06, -17.48, 16.74, 29.54, -17.78, 15.3, 29.57, -25.49, 15.31, 30.27, -25.49, 15.6]],
    [0, [12.31, -24.01, 16.6, 12.25, -17.73, 16.58, 10.55, -17.81, 15.87, 8.81, -17.73, 15.15, 8.83, -25.95, 15.16, 10.96, -26.03, 16.04, 11.16, -25.72, 16.13]],
    [0, [51.83, -20.77, 16.49, 50.26, -20.84, 16.47, 48.75, -18.74, 16.42, 48.2, -19.18, 16.42, 48.24, -25.85, 16.49, 51.83, -25.78, 16.54, 55.86, -25.7, 16.6, 56.29, -21.66, 16.57, 54.5, -21.04, 16.53, 52.62, -18.69, 16.48, 51.83, -19.45, 16.48]],
    [0, [13.47, -17.67, 15.18, 15.73, -17.69, 15.2, 19.22, -17.72, 15.22, 22.65, -17.75, 15.25, 22.65, -17.98, 15.25, 26.12, -17.82, 15.27, 26.9, -17.78, 15.28, 27.42, -17.96, 15.28, 29.54, -17.78, 15.3, 33.06, -17.48, 15.32, 33.06, -17.97, 15.33, 36.49, -17.93, 15.35, 39.93, -17.89, 15.38, 43.46, -17.85, 15.4, 43.44, -25.71, 15.41, 39.92, -25.66, 15.39, 36.48, -25.61, 15.36, 33.04, -25.56, 15.34, 33.04, -25.67, 15.34, 30.48, -25.74, 15.32, 30.27, -25.49, 15.31, 29.57, -25.49, 15.31, 29.57, -25.66, 15.31, 29.42, -25.77, 15.31, 28.15, -25.8, 15.3, 27.84, -25.5, 15.3, 26.1, -25.5, 15.28, 22.66, -25.51, 15.26, 22.66, -25.4, 15.26, 21.22, -25.74, 15.25, 19.2, -25.63, 15.23, 19.2, -25.98, 15.23, 15.74, -25.77, 15.21, 15.74, -25.55, 15.21, 12.32, -25.68, 15.18, 11.16, -25.72, 15.18, 10.96, -26.03, 15.17, 8.83, -25.95, 15.16, 5.33, -25.83, 15.13, 5.36, -31.25, 15.14, 2.66, -31.36, 15.12, 2.71, -33.76, 15.12, 1.4, -32.96, 15.11, 1.57, -43.33, 15.13, 4.49, -43.32, 15.15, 4.85, -42.28, 15.15, 5.31, -40.97, 15.15, 11.43, -41.16, 15.2, 11.68, -42.13, 15.2, 11.97, -43.28, 15.21, 44.01, -43.12, 15.44, 44.02, -42.16, 15.44, 47.72, -42.18, 15.47, 47.72, -42.25, 15.47, 48.79, -42.28, 15.47, 48.81, -39.68, 15.47, 48.82, -38.14, 15.47, 48.82, -37.29, 15.47, 48.63, -36.98, 15.47, 48.83, -36.82, 15.47, 48.85, -33.51, 15.46, 48.87, -30.24, 15.46, 61.85, -30.21, 15.55, 61.85, -28.61, 15.55, 55.62, -27.94, 15.5, 51.83, -27.54, 15.48, 51.83, -25.78, 15.47, 48.24, -25.85, 15.45, 48.2, -19.18, 15.44, 48.75, -18.74, 15.44, 50.26, -20.84, 15.45, 51.83, -20.77, 15.47, 51.83, -19.45, 15.46, 52.62, -18.69, 15.47, 54.5, -21.04, 15.49, 56.29, -21.66, 15.5, 56.86, -16.33, 15.5, 56.86, -9.01, 15.49, 59.1, -9.01, 15.5, 59.11, -1.19, 15.49, 54.28, -1.19, 15.46, 54.28, -1.44, 15.46, 52.39, -1.44, 15.44, 52.39, -1.19, 15.44, 47.9, -1.19, 15.41, 47.9, -1.33, 15.41, 21.53, -1.33, 15.22, 21.55, -1.87, 15.22, 12.99, -3.58, 15.16, 13.17, -3.1, 15.16, 7.66, -3.7, 15.12, 4.04, -4.79, 15.09, 3.69, -4.12, 15.09, 2.35, -4.27, 15.08, 2.36, -5.3, 15.08, 2.5, -17.71, 15.1, 3.91, -17.54, 15.11, 5.3, -17.59, 15.12, 5.3, -17.87, 15.12, 6.06, -17.62, 15.13, 8.81, -17.73, 15.15, 10.55, -17.81, 15.16, 12.25, -17.73, 15.17]],
    [0, [15.73, -17.69, 16.63, 13.47, -17.67, 15.68, 12.25, -17.73, 15.17, 12.31, -24.01, 15.18, 11.16, -25.72, 14.7, 12.32, -25.68, 15.18, 15.74, -25.55, 16.61]],
    [0, [-1.95, -43.24, 10.83, -1.94, -48.49, 10.85, -0.89, -48.49, 10.85, -0.88, -43.35, 10.83, -0.88, -43.26, 10.83]],
    [0, [-1.94, -48.49, 10.22, -1.95, -43.24, 10.22, -16.33, -42.92, 10.18, -16.48, -1.31, 10.24, -22.59, -1.31, 10.23, -22.59, 3.97, 10.23, -29.95, 3.97, 10.21, -29.95, -1.31, 10.2, -40.27, -1.3, 10.17, -40.27, -1.14, 10.17, -44.12, -1.14, 10.16, -44.11, -1.45, 10.16, -44.38, -1.45, 10.16, -44.38, -5.98, 10.15, -44.23, -5.98, 10.15, -44.19, -37.6, 10.1, -44.34, -37.6, 10.1, -44.33, -47.74, 10.08, -43.02, -47.75, 10.09, -43.3, -36.14, 10.11, -43.31, -33.43, 10.11, -22.61, -33.47, 10.17, -22.35, -47.85, 10.15, -22.35, -47.86, 10.15, -22.34, -48.5, 10.15]],
    [0, [-2.12, -1.31, 19.08, -16.48, -1.31, 19.02, -16.33, -42.92, 19.02, -1.95, -43.24, 19.08, -0.88, -43.26, 19.09, -0.88, -43.35, 19.09, 1.57, -43.33, 19.1, 1.4, -32.96, 19.1, 2.71, -33.76, 19.1, 2.66, -31.36, 19.1, 2.38, -17.73, 19.1, 2.5, -17.71, 19.1, 2.36, -5.3, 19.1, 2.31, -5.32, 19.1, -2.97, -2.65, 19.07]],
  ];
}

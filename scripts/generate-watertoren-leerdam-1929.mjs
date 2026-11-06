// Watertoren Leerdam (1929), de derde watertoren van Leerdam. Gebouwd in 1929 door Visser & Smit, 50,25 m hoog, reservoir van
// 500 m³; sinds 2009 buiten gebruik, na een sloopdreiging in 2012 behouden en nu particulier bewoond (Wikipedia). Een tienkante
// toren van baksteen met betonnen lisenen op alle hoeken: een plint met uitgezette voeten onder de lisenen, een benedenverdieping
// met een vensterstrook onder een betonnen latei, een iets smallere schacht met verdiepte bakstenen velden en kleine vensters, een
// betonnen band op consoles onder de lisenen, een bredere reservoirverdieping met verdiepte velden en een betonnen dakrand, een
// plat dak met een tienkante lantaarn met vensters, een tienkante spitse kap en een getrapte piek. Aan de noordnoordwestzijde een
// trappentoren met een overstekende dekplaat, aan de zuidzuidoostzijde een laag portaal, hoog aan de noordwestzijde een uitbouwtje.
//
// Oorsprong op het hart van de BAG-voetafdruk van pand 0545100000338731 (kleinste-kwadratencirkel door 21 punten, straal 5,49 m,
// afwijking 0,04 m); de piek in het AHN-DSM 0,5 m ligt er binnen 0,3 m op. Lokale X-as = RD-oost: de lantaarn en de toren zijn
// tienhoeken met hoeken op k maal 36 graden en een zijde naar het zuiden (luchtfoto: de onderste zijde van de lantaarn ligt oost-
// west; foto's: de lantaarn heeft dezelfde stand als de toren). Hoeken hieronder in graden linksom vanaf RD-oost. Maaiveld
// AHN-DTM NAP +1,1 (1,0 tot 1,2 rond de voet).
// Maten: dak, lantaarn, kap en piek uit het AHN-DSM 0,5 m en de 3D BAG (dak NAP +41,83, rand van de lantaarn NAP +47,55, kap
// helling 1,6, piek NAP +52,71); trappentoren NAP +13,24 en portaal NAP +4,28 uit de 3D BAG; breedtes uit de telefoto
// "Leerdam - Watertoren bouwjaar 1929 met huizen.jpg" (lantaarn 138 px, reservoirverdieping 264 px, schacht 240 px), geschaald op
// de lantaarn op de luchtfoto (5,8 m over de hoeken); hoogtes van de band en het uitbouwtje uit die foto en RCE-foto 20300699.
import { Manifold, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [135152.59, 434026.52];
const AXIS = [1, 0];
const GROUND_NAP = 1.1;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 44,656, west 44,632, noord 44,647, zuid 44,616),
// gemeten 2026-11-06. Het PDOK-pand staat op 44,40.
const GROUND_ELLIPSOID = 44.616;

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const C18 = Math.cos(rad(18));
// Tienhoek met hoeken op k maal 36 graden (vlakken loodrecht op 18 + k maal 36 graden); r is de hoekstraal.
const deca = (r) => Array.from({ length: 10 }, (_, k) => polar(r, 36 * k));
const FACES = Array.from({ length: 10 }, (_, k) => 18 + 36 * k);
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
// Blinde nis in het vlak met normaal +X op afstand f, midden op y = t, breedte w, van z0 tot z1. Het plafond loopt naar binnen onder
// 56 graden op (1,5 maal de diepte) en naar buiten 0,3 m af.
const niche = (f, w, z0, z1, { t = 0, depth = 0.3 } = {}) => {
  const prof = [[t - w / 2, z0], [t + w / 2, z0], [t + w / 2, z1], [t - w / 2, z1]];
  const lift = 1.5 * depth;
  return hull([
    ...prof.map(([y, z]) => [f - depth, y, z === z0 ? z0 : z + lift]),
    ...prof.map(([y, z]) => [f, y, z]),
    ...prof.map(([y, z]) => [f + 0.2, y, Math.max(z0, z - 0.3)]),
  ]);
};

// ---------- hoogtes boven het maaiveld (NAP +1,1) ----------
const H = {
  plinth: 0.5, // plint met schuine afzaat tot 0,9 m
  plinthTop: 0.9,
  feet: 3.0, // uitgezette voeten van de lisenen (0,5 tot 3,0 m)
  lintel: 2.9, // betonnen latei boven de vensterstrook (2,9 tot 3,6 m)
  panelFoot: 3.6, // verdiepte velden van de schacht
  panelTop: 26.4,
  corbel: 26.3, // voet van de consoles onder de lisenen
  shaftTop: 27.3, // kraag van 50 graden naar de band
  band: 27.9, // band 27,9 tot 29,0 m
  upperPanelFoot: 29.0,
  upperPanelTop: 39.6,
  roof: 40.73, // dak (AHN/3D BAG NAP +41,83)
  lantern: 46.4, // bovenkant van de lantaarn (3D BAG NAP +47,55 aan de rand)
  cap: 49.2, // top van de kap (helling 1,6; AHN NAP +50,3 op 0,6 m)
  spike1: 50.0,
  spike2: 50.7,
  top: 51.6, // piek (AHN NAP +52,71)
};
const R = {
  plinth: 5.4, // hoekstraal; BAG-cirkel 5,49
  shaft: 5.05, // schacht (telefoto: 0,91 maal de reservoirverdieping)
  feet: 5.75,
  upper: 5.55, // reservoirverdieping (telefoto: 1,91 maal de lantaarn)
  lantern: 2.9, // luchtfoto: 5,8 m over de hoeken
  cap: 2.47, // voet van de kap, binnen de rand van de lantaarn
  capTop: 0.63,
  spike2: 0.5,
};
const RECESS = 0.2; // diepte van de bakstenen velden

// ---------- toren ----------
const plinth = union([
  prism(deca(R.plinth), BASE, H.plinth),
  hull([...ring(deca(R.plinth), H.plinth - 0.01), ...ring(deca(R.shaft), H.plinthTop)]),
]);
const shaft = prism(deca(R.shaft), BASE, H.shaftTop + 0.01);
// Kraag van 50 graden van de schacht naar de band en de reservoirverdieping.
const collar = hull([...ring(deca(R.shaft), H.shaftTop), ...ring(deca(R.upper), H.band)]);
const upper = prism(deca(R.upper), H.band - 0.01, H.roof);
// Lisenen: uitgezette voet (75 graden) en console (70 graden) op elke hoek, 0,8 m breed.
const cornerBlock = (deg, pts) => {
  const tx = -Math.sin(rad(deg)), ty = Math.cos(rad(deg));
  return hull(pts.flatMap(([r, half, z]) => {
    const [x, y] = polar(r, deg);
    return [[x - tx * half, y - ty * half, z], [x + tx * half, y + ty * half, z]];
  }));
};
const feet = Array.from({ length: 10 }, (_, k) => cornerBlock(36 * k, [
  [4.4, 0.4, BASE], [R.feet, 0.45, BASE], [R.feet, 0.45, H.plinth], [R.shaft, 0.4, H.feet], [4.4, 0.4, H.feet],
]));
const corbels = Array.from({ length: 10 }, (_, k) => cornerBlock(36 * k, [
  [4.6, 0.4, H.corbel], [R.shaft, 0.4, H.corbel], [R.upper + 0.07, 0.4, H.band], [4.6, 0.4, H.band],
]));

// Verdiepte velden tussen de lisenen (0,2 m diep): schacht 2,35 m breed, reservoirverdieping 2,6 m.
const shaftFace = R.shaft * C18, upperFace = R.upper * C18;
const panels = union([
  ...around(niche(shaftFace, 2.35, H.panelFoot, H.panelTop, { depth: RECESS }), FACES),
  ...around(niche(upperFace, 2.6, H.upperPanelFoot, H.upperPanelTop, { depth: RECESS }), FACES),
]);
// Vensterstrook in de benedenverdieping (2,0 m breed, 1,4 tot 2,9 m), niet waar het portaal (-54) en de trappentoren (90, 126)
// aansluiten; kleine vensters (1,0 x 1,4 m) in de velden van de schacht, verspringend met de trap.
const groundWindows = around(niche(shaftFace, 2.0, 1.4, H.lintel, { depth: 0.3 }), FACES.filter((d) => ![90, 126, -54 + 360].includes(d)));
const shaftWindows = [
  [162, 6.0], [198, 10.5], [234, 15.0], [162, 19.5], [198, 24.0],
  [18, 6.0], [-18 + 360, 12.5], [18, 19.0],
].map(([deg, z]) => place(niche(shaftFace - RECESS, 1.0, z, z + 1.4, { depth: 0.2 }), { deg }));

// Uitbouwtje hoog op het vlak van 126 graden: 1,2 m breed, 0,85 m uit het vlak, 32,9 tot 34,4 m, onderkant onder 51 graden.
const bay = place(hull([
  [upperFace - 0.3, -0.6, 31.45], [upperFace - 0.3, 0.6, 31.45],
  [upperFace + 0.85, -0.6, 32.9], [upperFace + 0.85, 0.6, 32.9],
  [upperFace + 0.85, -0.6, 34.4], [upperFace + 0.85, 0.6, 34.4],
  [upperFace - 0.3, -0.6, 34.4], [upperFace - 0.3, 0.6, 34.4],
]), { deg: 126 });

// ---------- lantaarn, kap en piek ----------
const lanternFace = R.lantern * C18;
const lantern = prism(deca(R.lantern), H.roof - 0.01, H.lantern)
  .subtract(union(around(niche(lanternFace, 1.0, 44.5, 45.4, { depth: 0.25 }), FACES)));
const cap = hull([...ring(deca(R.cap), H.lantern - 0.01), ...ring(deca(R.capTop), H.cap)]);
const spike = union([
  prism(deca(R.capTop), H.cap - 0.01, H.spike1),
  prism(deca(R.spike2), H.spike1 - 0.01, H.spike2),
  hull([...ring(deca(R.spike2), H.spike2 - 0.01), [0, 0, H.top]]),
]);

// ---------- trappentoren (noordnoordwest) ----------
// BAG: halfrond uitsteeksel om (-2,5; 5,4), tot 7,6 m uit het hart; 3D BAG dak NAP +13,24 (12,14 m). Achtkant met apothema 1,6 m
// tot 11,2 m, kraag van 50 graden en een dekplaat met apothema 1,85 m van 11,5 tot 12,14 m; deur en twee vensters naar buiten.
const ST = { at: [-2.5, 5.4], deg: 114.8, a: 1.6, cap: 1.85, z0: 11.2, z1: 11.5, top: 12.14 };
const oct = (a) => Array.from({ length: 8 }, (_, k) => polar(a / Math.cos(rad(22.5)), 22.5 + 45 * k));
const stairLocal = union([
  prism(oct(ST.a), BASE, ST.z0 + 0.01),
  hull([...ring(oct(ST.a), ST.z0), ...ring(oct(ST.cap), ST.z1)]),
  prism(oct(ST.cap), ST.z1 - 0.01, ST.top),
]).subtract(union([
  niche(ST.a, 1.0, 0.0, 2.2),
  niche(ST.a, 0.9, 4.5, 5.7),
  niche(ST.a, 0.9, 8.0, 9.2),
]));
const stair = place(stairLocal, { deg: ST.deg, at: [...ST.at, 0] });

// ---------- portaal (zuidzuidoost) ----------
// BAG: (1,55; -5,25) (2,27; -6,66) (4,27; -5,76) (3,57; -4,23); 3D BAG dak NAP +4,28 (3,18 m). Tot in de toren doorgetrokken; deur
// in de voorgevel (normaal -65,8 graden).
const porchBody = prism([[1.1, -4.3], [1.55, -5.25], [2.27, -6.66], [4.27, -5.76], [3.57, -4.23], [3.1, -3.3]], BASE, 3.18);
const porchDoor = place(niche(0, 1.2, 0.0, 2.3), { deg: -65.8, at: [3.27, -6.21, 0] });
const porch = porchBody.subtract(porchDoor);

const tower = union([plinth, shaft, collar, upper, ...feet, ...corbels])
  .subtract(union([panels, ...groundWindows, ...shaftWindows]));
const all = union([tower, bay, lantern, cap, spike, stair, porch]);

await writeLandmark({
  slug: "watertoren-leerdam-1929",
  base: BASE,
  nodes: [["building:watertoren-tienkant-lisenen-band-lantaarn-kap-en-trappentoren", all]],
  catalog: {
    name: "Watertoren Leerdam (1929)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, 8.5], [0, -7.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0545100000338731"],
    description:
      "Oorsprong op het hart van de BAG-voetafdruk (straal 5,49 m) op het maaiveld (NAP +1,1 m), X-as = RD-oost, tienhoeken met hoeken op k maal 36 graden. Tienkante bakstenen toren met lisenen op de hoeken: plint met uitgezette voeten, vensterstrook onder een latei, schacht (hoekstraal 5,05 m) met verdiepte velden en vensters, band op consoles van 27,3 tot 29,0 m, reservoirverdieping (hoekstraal 5,55 m) met verdiepte velden tot het platte dak op 40,73 m, tienkante lantaarn met vensters tot 46,4 m, kap van helling 1,6 tot 49,2 m en een getrapte piek tot 51,6 m; trappentoren met dekplaat tot 12,14 m aan de noordnoordwestzijde, portaal tot 3,18 m aan de zuidzuidoostzijde en een uitbouwtje op 33 m. Maten uit BAG, AHN, 3D BAG en foto's.",
    realWorld: {
      built: 1929,
      builder: "Visser & Smit",
      publishedHeightM: 50.25,
      reservoirM3: 500,
      outOfUse: 2009,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 41.83,
      lanternRimNapM: 47.55,
      ahnTopNapM: 52.71,
      bagRadiusM: 5.49,
      shaftCornerRadiusM: R.shaft,
      upperCornerRadiusM: R.upper,
      lanternCornerRadiusM: R.lantern,
      bandM: [H.shaftTop, H.upperPanelFoot],
      roofM: H.roof,
      lanternM: H.lantern,
      capM: H.cap,
      topM: H.top,
      stairTowerM: ST.top,
      porchM: 3.18,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Leerdam_1929) (1929, Visser & Smit, 50,25 m, 500 m³, buiten gebruik sinds 2009)",
      "https://commons.wikimedia.org/wiki/File:Leerdam_-_Watertoren_bouwjaar_1929_met_huizen.jpg, File:Leerdam_-_Watertoren_bouwjaar_1929.jpg, File:Leerdam,_watertoren_foto3_2010-06-27_10.42.JPG, File:Exterieur_OVERZICHT_-_Leerdam_-_20300699_-_RCE.jpg, File:Watertoren_Leerdam_De_Landerije_Makelaars.jpg",
      "PDOK BAG-pand 0545100000338731, 3D BAG (LoD2.2), AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

// Watertoren op landgoed Oud Groevenbeek in Ermelo (1912), rijksmonument
// 523878: een folly in kasteelstijl op een aangelegde heuvel, buiten gebruik
// sinds 1950. Rechthoekig bakstenen blok van twee verdiepingen met een plint
// van veldkeien, een witte waterlijst, een rondboogfries en een gekanteelde
// borstwering op een uitkragende tandlijst; op de zuidoosthoek een ronde
// toren met dezelfde lijsten, een eigen fries en een hogere kanteelkrans.
// Oorsprong op het hart van de rechthoekige BAG-contour (pand
// 0233100000009678, bovenaanzicht 4,03 x 4,60 m, met de uitkraging van de
// borstwering) op het maaiveld van de heuveltop (NAP +23,1 m). +X langs de
// noordgevel, 3,2 graden rechtsom van RD-oost; +Y wijst naar het noorden.
// Hoogtes uit de frontale RCE-foto 20339656 (vanuit het zuidoosten, de toren
// in het midden), geschaald op de kantelen van het blok in het AHN (+7,3 m,
// 30,1 px/m); het dak van het blok (+5,95) en het looppad van de toren (+9,2)
// uit het AHN. De gevels: de deur in het westen (RCE 20313754, 20375910), in
// de andere drie gevels twee rondboogvensters onder twee rechte vensters; de
// foto "Ermelo Watertoren 2007" kijkt vanuit het noordwesten op de hoek.
import { Manifold, CrossSection, hull, ring3, circle, rect, prism, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [170581.99, 476780.2];
const AXIS = [0.99844, -0.05583];
const BASE = -0.3;
const A = 1.835; // halve breedte van het blok (oost-west), muurvlak
const B = 2.12; // halve diepte (noord-zuid)
const OUT = 0.18; // uitkraging van de borstwering: samen 4,03 x 4,60 m zoals de BAG-contour
const RING = 0.9; // dikte van de borstwering en de kantelen rond het verdiepte dak
const H = {
  plinth: 0.72, // bovenkant van de veldkeienplint
  bandFoot: 2.85, // witte waterlijst op de verdiepingsvloer
  bandTop: 3.1,
  corbel: 5.9, // voet van de tandlijst onder de borstwering
  roof: 5.95, // plat dak van het blok (AHN, 3D BAG 29,05)
  crenel: 6.65, // onderkant van de kantelopeningen
  merlon: 7.3, // bovenkant van de kantelen (AHN 30,3)
  towerBand: 6.25, // tandlijst van de toren ter hoogte van de borstwering
  towerCorbel: 9.05, // uitkragende kraag onder de torenkrans
  towerCrenel: 10.2, // looppad (AHN +9,2) met de borstwering tot hier, dicht gemaakt
  towerMerlon: 10.8,
};
const T = { c: [1.9, -1.9], r: 1.17, plinth: 1.27, band: 1.27, crown: 1.36 }; // toren: hart en stralen
const STEEP = 1.5; // ondervlakken van lijsten en kragen: 1,5 hoog per 1 uit (56 graden)

// ---------- blok: plint, muren, waterlijst en borstwering ----------
const box = (a, b, z0, z1) => prism(rect(-a, -b, a, b), z0, z1);
const slab = (a0, b0, z0, a1, b1, z1) => hull([...ring3(rect(-a0, -b0, a0, b0), z0), ...ring3(rect(-a1, -b1, a1, b1), z1)]);
const block = union([
  box(A + 0.1, B + 0.1, BASE, H.plinth),
  slab(A + 0.1, B + 0.1, H.plinth - 0.01, A, B, H.plinth + 0.08), // schuine afdekking van de plint
  box(A, B, BASE, H.corbel + 0.01),
  slab(A, B, H.bandFoot, A + 0.1, B + 0.1, H.bandFoot + 0.1 * STEEP), // waterlijst op een schuine onderkant
  box(A + 0.1, B + 0.1, H.bandFoot + 0.1 * STEEP - 0.01, H.bandTop),
  slab(A, B, H.corbel, A + OUT, B + OUT, H.corbel + OUT * STEEP), // tandlijst
  box(A + OUT, B + OUT, H.corbel + OUT * STEEP - 0.01, H.crenel),
]).subtract(box(A + OUT - RING, B + OUT - RING, H.roof, H.merlon + 1)); // verdiept dak binnen de borstwering

// Kantelen van 0,8 m (hoeken 0,8 x 0,8) op de borstwering, als blokken over de volle dikte.
const P = { a: A + OUT, b: B + OUT };
const merlonU = (u0, u1, side) => prism(rect(u0, side > 0 ? P.b - RING : -P.b, u1, side > 0 ? P.b : -P.b + RING), H.crenel - 0.01, H.merlon);
const merlonV = (v0, v1, side) => prism(rect(side > 0 ? P.a - RING : -P.a, v0, side > 0 ? P.a : -P.a + RING, v1), H.crenel - 0.01, H.merlon);
const merlons = union([
  merlonU(-P.a, -P.a + 0.8, 1), merlonU(-0.4, 0.4, 1), merlonU(P.a - 0.8, P.a, 1), // noord
  merlonV(-0.4, 0.4, -1), merlonV(-P.b, -P.b + 0.8, -1), // west (hoeken met noord en zuid gedeeld)
  merlonV(P.b - 0.8, P.b, -1),
  merlonU(-P.a, -P.a + 0.8, -1), merlonU(-0.37, 0.8, -1), // zuid: hoek en een kanteel tegen de toren
  merlonV(P.b - 0.8, P.b, 1), merlonV(-0.8, 0.7, 1), // oost: hoek en een kanteel tegen de toren
]);

// ---------- ronde hoektoren als omwentelingsprofiel ----------
const towerProfile = [
  [0, BASE], [T.plinth, BASE], [T.plinth, H.plinth], [T.r, H.plinth + 0.08],
  [T.r, H.bandFoot], [T.band, H.bandFoot + 0.1 * STEEP], [T.band, H.bandTop], [T.r, H.bandTop],
  [T.r, H.towerBand], [T.band, H.towerBand + 0.1 * STEEP], [T.band, H.towerBand + 0.35], [T.r, H.towerBand + 0.35],
  [T.r, H.towerCorbel], [T.crown, H.towerCorbel + (T.crown - T.r) * STEEP], [T.crown, H.towerCrenel], [0, H.towerCrenel],
];
const tower = Manifold.revolve(new CrossSection([towerProfile]), 64).translate([...T.c, 0]);
// Zes kantelen op de krans (0,85 m op de buitenrand, openingen van 0,57 m), over 0,9 m dikte.
const towerMerlon = (deg) => {
  const half = 0.85 / T.crown / 2;
  const pts = [-half, 0, half].flatMap((t) => [[T.crown * Math.cos(t), T.crown * Math.sin(t)], [(T.crown - RING) * Math.cos(t), (T.crown - RING) * Math.sin(t)]]);
  return place(hull([...ring3(pts, H.towerCrenel - 0.01), ...ring3(pts, H.towerMerlon)]), { deg, at: [...T.c, 0] });
};
const towerMerlons = union(Array.from({ length: 6 }, (_, k) => towerMerlon(-45 + k * 60)));

// ---------- vensters, deur en friezen als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Gevels van het blok: richting van de normaal, afstand en de as langs de gevel (s naar links gezien van buiten).
const FACE = { N: { deg: 90, f: B }, S: { deg: -90, f: B }, E: { deg: 0, f: A }, W: { deg: 180, f: A } };
// s is de wereldcoördinaat langs de gevel: u voor noord/zuid, v voor oost/west.
const faceNiche = (face, s, w, z0, z1, depth) => {
  const { deg, f } = FACE[face];
  const along = face === "N" ? -s : face === "S" ? s : face === "E" ? s : -s; // lokale y van de nis vóór het draaien
  return place(niche(f, w, z0, z1, depth).translate([0, along, 0]), { deg });
};
const pair = (face, s, z0, z1) => [-0.42, 0.42].map((d) => faceNiche(face, s + d, 0.5, z0, z1, 0.3));
const GROUND = [1.05, 2.38]; // rondboogvensters van de begane grond
const UPPER = [3.37, 4.42]; // rechte vensters van de verdieping
const FRIEZE = [5.05, 5.6]; // blinde rondbogen boven de witte consoles
const towerNiche = (deg, w, z0, z1, depth) => place(niche(T.r, w, z0, z1, depth), { deg, at: [...T.c, 0] });
const cuts = [
  // West: rondboogdeur met twee vensters erboven.
  faceNiche("W", 0, 1.0, 0, 2.25, 0.4),
  ...pair("W", 0, ...UPPER),
  // Noord, zuid en oost: twee rondboogvensters onder twee rechte vensters (zuid en oost naast de toren).
  ...pair("N", 0, ...GROUND), ...pair("N", 0, ...UPPER),
  ...pair("S", -0.45, ...GROUND), ...pair("S", -0.45, ...UPPER),
  ...pair("E", 0.45, ...GROUND), ...pair("E", 0.45, ...UPPER),
  // Rondboogfries onder de tandlijst: vier bogen op de vrije gevels, drie naast de toren.
  ...[-1.2, -0.4, 0.4, 1.2].map((s) => faceNiche("N", s, 0.4, ...FRIEZE, 0.15)),
  ...[-1.35, -0.45, 0.45, 1.35].map((s) => faceNiche("W", s, 0.4, ...FRIEZE, 0.15)),
  ...[-1.3, -0.5, 0.3].map((s) => faceNiche("S", s, 0.4, ...FRIEZE, 0.15)),
  ...[1.55, 0.75, -0.05].map((s) => faceNiche("E", s, 0.4, ...FRIEZE, 0.15)),
  // Toren: smalle trapvensters en een eigen fries van zes blinde bogen onder de krans.
  towerNiche(-110, 0.3, 1.2, 1.9, 0.2),
  towerNiche(-60, 0.3, 3.65, 4.25, 0.2),
  towerNiche(-20, 0.3, 5.6, 6.15, 0.2),
  towerNiche(-100, 0.3, 7.2, 7.7, 0.2),
  ...Array.from({ length: 6 }, (_, k) => towerNiche(-75 + k * 60, 0.45, 8.1, 8.7, 0.15)),
];

const body = union([block, merlons, tower, towerMerlons]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-ermelo",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:blok-en-hoektoren-met-kantelen", body]],
  catalog: {
    name: "Watertoren Oud Groevenbeek Ermelo",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[4.5, 0], [-4, 0], [0, 4], [0, -4.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0233100000009678"],
    description:
      "Oorsprong op het hart van de rechthoekige BAG-contour op het maaiveld van de heuveltop (NAP +23,1 m), +X langs de noordgevel (3,2 graden rechtsom van RD-oost). Bakstenen blok van 3,67 x 4,24 m met veldkeienplint, deur in het westen, rondboogvensters en rechte vensters, witte waterlijst op 3 m, rondboogfries en een gekanteelde borstwering van 4,03 x 4,60 m op een tandlijst tot 7,3 m rond een verdiept dak op 5,95 m; ronde hoektoren van 2,34 m op de zuidoosthoek met trapvensters, tandlijst, fries en een uitkragende kanteelkrans van 2,72 m tot 10,8 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1912,
      monument: 523878,
      ahnGroundNapM: 23.1,
      ahnBlockRoofNapM: 29.1,
      ahnBlockMerlonsNapM: 30.3,
      ahnTowerWalkwayNapM: 32.3,
      bagOutlineM: [4.03, 4.6],
      blockWallsM: [3.67, 4.24],
      towerDiameterM: 2.34,
      towerCrownDiameterM: 2.72,
      blockRoofM: 5.95,
      blockMerlonsM: 7.3,
      towerMerlonsM: 10.8,
      modelTopM: 10.8,
      photoScalePxPerM: 30.1,
      minimumPartM: 0.8,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Ermelo)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/523878",
      "https://commons.wikimedia.org/wiki/File:Exterieur_WATERTOREN,_OVERZICHT_VOORZIJDE_-_Ermelo_-_20339656_-_RCE.jpg (frontale foto vanuit het zuidoosten, hoogtes)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Ermelo_-_20313754_-_RCE.jpg (west- en zuidgevel)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_-_Ermelo_-_20375910_-_RCE.jpg (west- en zuidgevel)",
      "https://commons.wikimedia.org/wiki/File:Ermelo_Watertoren_2007.JPG (noord- en westgevel)",
      "PDOK BAG-pand 0233100000009678, 3D BAG, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

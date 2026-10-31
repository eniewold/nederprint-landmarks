// Watertoren van Zuidlaren (1895), op het terrein van Dennenoord (Lentis),
// rijksmonument 510918. Slanke ronde bakstenen toren met een reservoir op een
// uitkragend boogfries; sinds 1934 ongeveer een meter uit het lood.
// Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +7,8 m),
// assen in RD-richting. De BAG-contour (7,0 m) is ruimer dan de toren: het AHN
// laat een dak van 6,2 m zien en op de frontale RCE-foto 20321989 is de plint
// even breed als de kroonlijst. Maten daarom uit die foto, geschaald op het
// AHN (kroonlijst op 26,1 m, 45 px/m). De top staat in het AHN 0,3 m oostelijk
// en 0,8 m zuidelijk van de voet; het model helt zo over.
import { Manifold, CrossSection, box, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [241219.18, 567344.79];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  plinth: 0.8, // donkere plint
  footTop: 4.55, // voet met rondboogvensters
  ledge: 4.8,
  shaftTop: 19.2, // ronde schacht met gele spiraalband
  friezeTop: 20.9, // boogfries
  tankTop: 24.55, // reservoir met ruitpatronen
  cornice: 26.1, // kroonlijst met holle onderkant
  roofTop: 28.3, // lage kegel
  houseTop: 28.7, // vierkant dakhuisje
  houseRoof: 29.4,
};
const R = { plinth: 3.05, foot: 2.83, ledge: 3.0, shaft: 2.5, frieze: 2.81, tank: 2.87, cornice: 3.13 };
const LEAN = [0.3 / H.roofTop, -0.8 / H.roofTop]; // overhelling per meter hoogte (oost, noord)

// ---------- omwentelingsprofiel (r, z) van plint tot dak ----------
const cove = Array.from({ length: 6 }, (_, k) => {
  const t = ((k + 1) / 6) * (Math.PI / 2);
  return [R.tank + (R.cornice - R.tank) * (1 - Math.cos(t)), H.tankTop + 0.9 * Math.sin(t)];
});
const profile = [
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.foot, H.plinth], [R.foot, H.footTop], [R.ledge, H.footTop + 0.15], [R.ledge, H.ledge],
  [R.shaft, H.ledge], [R.shaft, H.shaftTop], [R.frieze, H.shaftTop + (R.frieze - R.shaft)], [R.frieze, H.friezeTop], [R.tank, H.friezeTop],
  [R.tank, H.tankTop], ...cove, [R.cornice, H.cornice], [R.cornice - 0.1, H.cornice], [0, H.roofTop],
];
let body = Manifold.revolve(new CrossSection([profile]), 96);

// Venster als ondiepe nis met spitse top (≥ 50 graden) in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, top = z1 + w * 0.65;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, z1], [b, -w / 2, z1], [a, w / 2, z1], [b, w / 2, z1], [a, 0, top], [b, 0, top]]);
};
const FRONT = -90;
const cuts = [
  // Rondboogvensters in de voet, verspringende vensters langs de trap in de schacht, één venster in het reservoir.
  ...[0, 120, 240].map((d) => place(niche(R.foot, 0.8, 1.6, 3.0, 0.3), { deg: FRONT + d })),
  ...[[0, 10.6, 11.8], [0, 16.1, 17.3], [-30, 5.8, 7.0], [150, 8.2, 9.4], [150, 13.4, 14.6], [180, 18.0, 18.7]].map(([d, z0, z1]) => place(niche(R.shaft, 0.8, z0, z1), { deg: FRONT + d })),
  ...[0, 180].map((d) => place(niche(R.tank, 0.7, 22.6, 23.6), { deg: FRONT + d })),
  // Zestien rondboogjes onder het fries.
  ...Array.from({ length: 16 }, (_, k) => place(niche(R.frieze, 0.6, 19.6, 20.2, 0.15), { deg: k * 22.5 })),
];
body = body.subtract(union(cuts));

// Vierkant dakhuisje met een lage piramide en de voet van de windwijzer.
const roofHouse = union([
  box(-0.6, -0.6, 27.3, 0.6, 0.6, H.houseTop),
  hull([[-0.7, -0.7, H.houseTop - 0.05], [0.7, -0.7, H.houseTop - 0.05], [-0.7, 0.7, H.houseTop - 0.05], [0.7, 0.7, H.houseTop - 0.05], [0, 0, H.houseRoof]]),
]);

// Scheefstand als afschuiving langs z (volume en hellingen veranderen nauwelijks).
const tower = union([body, roofHouse]).transform([1, 0, 0, 0, 0, 1, 0, 0, LEAN[0], LEAN[1], 1, 0, 0, 0, 0, 1]);

await writeLandmark({
  slug: "watertoren-zuidlaren",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:voet-schacht-boogfries-reservoir-en-dak", tower]],
  catalog: {
    name: "Watertoren Zuidlaren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6, 0], [-6, 0], [0, 6], [0, -6]],
    replacesBuildings: ["NL.IMBAG.Pand.1730100000012721"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +7,8 m), assen in RD-richting. Plint van 6,1 m, voet met rondboogvensters tot 4,8 m, slanke schacht van 5,0 m met vensters langs de trap tot 19,2 m, boogfries en reservoir van 5,7 m tot 24,55 m, kroonlijst van 6,3 m met holle onderkant tot 26,1 m, lage kegel tot 28,3 m en een vierkant dakhuisje tot 29,4 m. De toren helt 0,85 m over naar het zuidzuidoosten, zoals in het AHN. Maten uit de RCE-foto en het AHN.",
    realWorld: {
      publishedHeightM: 32,
      ahnGroundNapM: 7.77,
      ahnTopNapM: 37.22,
      bagFootDiameterM: 7.0,
      plinthDiameterM: 6.1,
      shaftDiameterM: 5.0,
      tankDiameterM: 5.74,
      corniceDiameterM: 6.26,
      corniceM: 26.1,
      roofHouseTopM: 29.4,
      leanAtRoofM: [0.3, -0.8],
      photoScalePxPerM: 45,
      minimumPartM: 0.6,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Zuidlaren)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/510918",
      "https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_slanke_ronde_watertoren_met_een_reservoir_op_uitkragend_boogfries_-_Zuidlaren_-_20321989_-_RCE.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:Zuidlaren_Watertoren_Dennenoord.JPG",
      "https://commons.wikimedia.org/wiki/File:20191030_Watertoren1_Dennenoord.jpg (dakhuisje)",
      "PDOK BAG-pand 1730100000012721, AHN DSM/DTM 0,5 m en luchtfoto, 2026-10-31",
    ],
  },
});

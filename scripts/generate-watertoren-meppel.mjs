// Watertoren van Meppel (H.P.N. Halbertsma, 1893, in 1955 gerenoveerd en wit
// gepleisterd), begin van de Steenwijkerstraatweg.
// Oorsprong op het middelpunt van de ronde BAG-contour (doorsnede 9,07 m), 0,3 m
// naar het zuiden geschoven naar het hart van de lantaarn in het AHN, op
// maaiveld (NAP +2,5 m); assen in RD-richting. Hoogtes uit de Commons-foto van
// Meppel foto7 (2011), geschaald op het AHN-terras van 28,8 m (47 px/m); stralen
// op de BAG-doorsnede van de voet (45,5 px/m). Lantaarn en terras uit het AHN.
import { Manifold, CrossSection, circle, hull, ring3, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [208752.1, 524541.3];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  footTop: 5.6, // verjongende voet met twee banden
  footBand: 5.85,
  shaftTop: 15.9, // verjongende schacht
  friezeTop: 17.2, // fries van rondboogjes
  ledgeTop: 18.0, // lijst
  drumTop: 19.5, // trommel met consoles onder het reservoir
  tankRoll: 20.3, // bolle onderrand van het reservoir
  tankTop: 28.0,
  cornice: 28.4, // kroonlijst
  terrace: 28.8, // dakterras met hekwerk
  lanternTop: 31.0,
  capTop: 31.7,
};
const R = { foot: 4.53, footTop: 4.13, band: 4.2, shaftFoot: 3.5, shaftTop: 3.38, frieze: 3.6, ledge: 3.7, drum: 3.45, tankFoot: 4.55, tank: 4.85, cornice: 5.0, terrace: 3.7, lantern: 2.35 };

// ---------- omwentelingsprofiel (r, z) van voet tot dakterras ----------
const roll = Array.from({ length: 6 }, (_, k) => {
  const t = ((k + 1) / 6) * (Math.PI / 2);
  return [R.tankFoot + (R.tank - R.tankFoot) * Math.sin(t), H.drumTop + (H.tankRoll - H.drumTop) * (1 - Math.cos(t))];
});
const profile = [
  [0, BASE], [R.foot, BASE], [R.foot, 0], [R.footTop, H.footTop], [R.band, H.footTop], [R.band, H.footBand],
  [R.shaftFoot, H.footBand], [R.shaftTop, H.shaftTop], [R.frieze, H.shaftTop + (R.frieze - R.shaftTop)], [R.frieze, H.friezeTop],
  [R.ledge, H.friezeTop + 0.1], [R.ledge, H.ledgeTop], [R.drum, H.ledgeTop], [R.drum, H.drumTop], [R.tankFoot, H.drumTop], ...roll,
  [R.tank, H.tankTop], [R.cornice, H.tankTop + 0.15], [R.cornice, H.cornice], [R.terrace, H.terrace], [0, H.terrace],
];
let body = Manifold.revolve(new CrossSection([profile]), 96);

// Venster als ondiepe nis met spitse top (≥ 50 graden) in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, top = z1 + w * 0.65;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, z1], [b, -w / 2, z1], [a, w / 2, z1], [b, w / 2, z1], [a, 0, top], [b, 0, top]]);
};
const footR = (z) => R.foot + (z / H.footTop) * (R.footTop - R.foot);
const shaftR = (z) => R.shaftFoot + ((z - H.footBand) / (H.shaftTop - H.footBand)) * (R.shaftTop - R.shaftFoot);
const cuts = [
  // Zes rondboogvensters in de voet, om de 60 graden.
  ...Array.from({ length: 6 }, (_, k) => place(niche(footR(2.7), 0.8, 2.0, 3.2, 0.3), { deg: k * 60 })),
  // Smalle vensters in de schacht, verspringend langs de trap.
  ...[[0, 12.0, 13.0], [0, 15.0, 15.6], [-40, 7.7, 8.8], [-40, 12.0, 13.0], [40, 12.0, 13.0], [40, 15.0, 15.6], [180, 9.8, 10.9], [140, 13.5, 14.5], [220, 13.5, 14.5]].map(([deg, z0, z1]) =>
    place(niche(shaftR((z0 + z1) / 2), 0.6, z0, z1), { deg }),
  ),
];
body = body.subtract(union(cuts));

// Twaalf consoles onder het reservoir, schuin onder ~47 graden van de trommel naar de onderrand.
const consoles = union(
  Array.from({ length: 12 }, (_, k) =>
    place(hull([[R.drum - 0.1, -0.3, 18.3], [R.drum - 0.1, 0.3, 18.3], [R.drum - 0.1, -0.3, H.drumTop], [R.drum - 0.1, 0.3, H.drumTop], [R.tankFoot, -0.3, H.drumTop], [R.tankFoot, 0.3, H.drumTop], [R.tankFoot, -0.3, H.drumTop + 0.05], [R.tankFoot, 0.3, H.drumTop + 0.05]]), { deg: k * 30 + 15 }),
  ),
);

// ---------- lantaarn op het dakterras ----------
const poly = (r, n, z) => ring3(circle([0, 0], r, n, Math.PI / n), z);
const lantern = union([
  Manifold.cylinder(H.lanternTop - H.terrace + 0.05, R.lantern, R.lantern, 16).translate([0, 0, H.terrace - 0.05]),
  hull([...poly(R.lantern + 0.1, 16, H.lanternTop - 0.05), ...poly(R.lantern + 0.1, 16, H.lanternTop + 0.1), ...poly(0.4, 16, H.capTop)]),
]);

await writeLandmark({
  slug: "watertoren-meppel",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:voet-schacht-reservoir-en-lantaarn", union([body, consoles, lantern])]],
  catalog: {
    name: "Watertoren Meppel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    replacesBuildings: ["NL.IMBAG.Pand.0119100000007291"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +2,5 m), assen in RD-richting. Witgepleisterde verjongende voet van 9,07 m met zes rondboogvensters tot 5,85 m, verjongende schacht met smalle vensters tot 15,9 m, fries en lijst tot 18,0 m, trommel met twaalf consoles onder het reservoir van 9,7 m met bolle onderrand tot de kroonlijst op 28,4 m, dakterras op 28,8 m en een lantaarn van 4,7 m tot 31,7 m. Maten uit BAG, AHN en een Commons-foto.",
    realWorld: {
      publishedHeightM: 31.5,
      reservoirM3: 230,
      ahnGroundNapM: 2.5,
      ahnTopNapM: 34.27,
      bagFootDiameterM: 9.07,
      shaftDiameterM: [7.0, 6.76],
      tankDiameterM: 9.7,
      corniceM: 28.4,
      terraceM: 28.8,
      lanternDiameterM: 4.7,
      modelTopM: 31.7,
      photoScalePxPerM: 47,
      minimumPartM: 0.6,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Meppel)",
      "https://commons.wikimedia.org/wiki/File:Meppel,_watertoren_foto7_2011-05-21_12.27.JPG (maten)",
      "https://commons.wikimedia.org/wiki/File:Meppel,_de_watertoren_PM1-0171_IMG_2121_2018-04-07_16.35.jpg",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Meppel.jpg",
      "PDOK BAG-pand 0119100000007291, AHN DSM/DTM 0,5 m en luchtfoto, 2026-10-31",
    ],
  },
});

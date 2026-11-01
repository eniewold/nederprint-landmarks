// Watertoren Bontebrug (Ulft), 1938, ontwerp G.J. Postel Hzn, reservoir van
// 400 m³. Bakstenen toren: een ronde kern met zes diepe lisenen (steunberen)
// tot het reservoir, daartussen bovenin een loggia met balkons onder de
// uitkragende onderrand van het reservoir, een glad cilindrisch reservoir met
// een rij kleine vensters, een uitkragende dakrand met omloop en een koperen
// kegeldak.
// Oorsprong op het hart van het reservoir in het AHN (cirkelfit op de dakrand,
// 0,6 m zuidelijk van het BAG-zwaartepunt) op maaiveld (NAP +18,0 m), assen in
// RD-richting. Breedtes uit de frontale foto "Bontebrug Watertoren" (10,85 px/m,
// geschaald op de dakrand van 12,9 m in het AHN), hoogtes uit die foto en de
// AHN-top (NAP +55,67); loggia, balkons en vensters uit de foto van 2024
// (20,5 px/m verticaal). Zes lisenen op 30 + k*60 graden (één naar het zuiden,
// luchtfoto); de diepte (1,6 m) uit de foto van 2013, waar een lisene vrijwel
// van opzij te zien is.
import { Manifold, CrossSection, hull, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [224406.85, 433990.75];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  balconyFoot: 20.1, // onderkant balkonplaat
  balcony: 20.6, // balkonvloer
  ringFoot: 23.05, // onderkant van de uitkragende reservoirrand
  ring: 23.7,
  eaveFoot: 32.65, // onderkant dakrand
  eave: 33.4, // dakrand met omloop, voet van het kegeldak
  apex: 37.65,
};
const R = {
  core: 3.7, // kern tussen de lisenen
  pier: 5.3, // voorvlak van de lisenen
  pierWidth: 1.24,
  loggia: 4.5, // glaswand van de loggia
  balcony: 5.2,
  ring: 6.22,
  tank: 5.67,
  eave: 6.45,
  cone: 5.8,
};
const PIER_DEG = 30; // eerste lisene, dan elke 60 graden (270 = zuid)
const SEG = 96;

const cyl = (r, z0, z1, n = SEG) => prism(circle([0, 0], r, n), z0, z1);

// ---------- schacht: kern met zes lisenen ----------
const core = cyl(R.core, BASE, H.balconyFoot);
const pier = prism(
  [[R.core - 0.3, -R.pierWidth / 2], [R.pier, -R.pierWidth / 2], [R.pier, R.pierWidth / 2], [R.core - 0.3, R.pierWidth / 2]],
  BASE,
  H.ringFoot + 0.05,
);
const piers = union(Array.from({ length: 6 }, (_, k) => place(pier, { deg: PIER_DEG + k * 60 })));

// ---------- loggia met balkons ----------
// Balkonplaat tussen de lisenen, daarboven de teruggelegen glaswand tot de reservoirrand.
const balcony = cyl(R.balcony, H.balconyFoot, H.balcony);
const loggiaWall = cyl(R.loggia, H.balconyFoot, H.ringFoot + 0.05);

// ---------- reservoir, dakrand en kegeldak ----------
const tank = Manifold.revolve(
  new CrossSection([[
    [0, H.ringFoot], [R.ring, H.ringFoot], [R.ring, H.ring], [R.tank, H.ring], [R.tank, H.eaveFoot],
    [R.eave, H.eaveFoot], [R.eave, H.eave], [R.cone, H.eave], [0, H.apex],
  ]]),
  SEG,
);

// ---------- vensters en deur als nissen ----------
// Nis in een rond vlak met straal f: de achterwand ligt overal minstens `depth`
// achter de gevel, het plafond loopt naar binnen op onder 56 graden.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = Math.sqrt(f * f - (w * w) / 4) - depth;
  const b = f + 1.0;
  const za = z1 + 1.5 * (f - a);
  return hull([
    [a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0],
    [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5],
  ]);
};
const bays = Array.from({ length: 6 }, (_, k) => PIER_DEG + 30 + k * 60); // midden tussen twee lisenen
const cuts = [
  place(niche(R.core, 1.3, BASE, 2.5), { deg: 180 }), // deur in de westelijke travee, aan het pad
  ...bays.map((deg) => place(niche(R.core, 0.7, 15.6, 16.85, 0.25), { deg })), // trapvenster per travee
  ...bays.map((deg) => place(niche(R.loggia, 2.2, H.balcony + 0.1, H.ringFoot - 0.25, 0.3), { deg })), // glaspui van de loggia
  // Twaalf kleine vensters onder de dakrand, 15 graden naast elke lisene.
  ...Array.from({ length: 12 }, (_, k) => place(niche(R.tank, 0.7, 31.2, 31.9, 0.25), { deg: PIER_DEG + 15 + k * 30 })),
];

await writeLandmark({
  slug: "watertoren-bontebrug",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-met-lisenen-loggia-reservoir-en-kegeldak", union([core, piers, balcony, loggiaWall, tank]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Bontebrug",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8], [0, -8]],
    replacesBuildings: ["NL.IMBAG.Pand.1509100000188838"],
    description:
      "Oorsprong op het hart van het reservoir in het AHN op maaiveld (NAP +18,0 m), assen in RD-richting. Ronde kern (7,4 m) met zes lisenen tot 10,6 m over de voorvlakken (één naar het zuiden), deur naar het westen; loggia met balkons van 20,1 tot 23,05 m onder de uitkragende reservoirrand (12,4 m); reservoir van 11,3 m met twaalf kleine vensters tot 32,65 m, dakrand van 12,9 m met omloop tot 33,4 m en koperen kegeldak tot 37,65 m. Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 37.6,
      reservoirM3: 400,
      ahnGroundNapM: 18.0,
      ahnTopNapM: 55.67,
      coreDiameterM: 7.4,
      acrossPiersM: 10.6,
      pierWidthM: 1.24,
      balconyFloorM: 20.6,
      ringM: [23.05, 23.7],
      ringDiameterM: 12.44,
      tankDiameterM: 11.34,
      eaveM: [32.65, 33.4],
      eaveDiameterM: 12.9,
      coneDiameterM: 11.6,
      modelTopM: 37.65,
      photoScalePxPerM: 10.85,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Bontebrug)",
      "https://commons.wikimedia.org/wiki/File:Bontebrug_Watertoren.JPG (frontale foto, breedtes en hoogtes van de top)",
      "https://commons.wikimedia.org/wiki/File:2024-08-29_Watertoren_Bontebrug.jpg (lisenen, loggia, balkons, vensters)",
      "https://commons.wikimedia.org/wiki/File:2013-06_Watertoren_Bontebrug.jpeg (diepte van de lisenen)",
      "https://commons.wikimedia.org/wiki/File:Bontebrug_Watertoren_2006.JPG",
      "PDOK BAG-pand 1509100000188838, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

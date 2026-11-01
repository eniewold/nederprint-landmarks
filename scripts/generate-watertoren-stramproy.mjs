// Watertoren van Stramproy (gemeente Weert): een vierkante bakstenen toren die
// water leverde aan de naastgelegen bierbrouwerij. In 2004 gerenoveerd en
// opgenomen in een nieuwbouwblok van drie lagen met zadeldaken; de toren staat
// nu tussen twee woonvleugels, aan de voor- en achterkant iets terug. Donkere
// baksteen met een witte kroonlijst, een steil afgeknot schilddak met een plat
// bovenvlak, drie vensters boven elkaar en een deur aan de pleinzijde.
//
// BAG-pand 0988100000025603 (bouwjaar 2003) is de toren (4,40 × 5,78 m) samen
// met de aangrenzende woning in de zuidoostelijke vleugel (4,52 × 9,70 m). Het
// model vervangt het hele pand: de toren als één node, de woning als eenvoudig
// blok met zijn zadeldak (nok en goten uit AHN en 3D BAG) in een eigen node.
// Oorsprong op het hart van de BAG-rechthoek van de toren op maaiveld (AHN-DTM
// NAP +32,17 m). Assen langs de gevels (BAG, 54,2 graden): +Y wijst naar de
// achterkant (noordoost), de pleinzijde met de deur ligt op -Y, +X naar de
// woning (zuidoost).
// Hoogtes: het platte bovenvlak (14,0 m), de dakvoet en de nok en goten van de
// woning uit het AHN-DSM 0,5 m en de 3D BAG (LoD2.2); kroonlijst, vensters en
// deur van de frontale foto "Stramproy Watertoren 7544" (43 px/m, geschaald op
// de hoogte van de schacht tot de kroonlijst).
import { hull, ring3, rect, union, box, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [178466.12, 356383.36];
const AXIS_DEG = 54.2; // richting van +Y (naar achteren) in RD, linksom vanaf oost
const AXIS = [+Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(4), +(-Math.cos((AXIS_DEG * Math.PI) / 180)).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 32.17;
const GEOID_N = 44.56; // NLGEO2018-geoïdehoogte op de oorsprong

const T = { hx: 2.2, hy: 2.89 }; // halve breedte (langs de vleugels) en halve diepte van de schacht (BAG)
const H = {
  wall: 10.4, // bovenkant van het metselwerk, onderkant van de kroonlijst
  corniceLow: 10.75, // de kroonlijst kraagt 0,25 m uit onder 54 graden
  eave: 10.85, // dakvoet op de buitenrand van de kroonlijst
  top: 14.0, // plat bovenvlak (AHN 13,97 tot 14,1)
};
const CORNICE = 0.25;
const TOP = { hx: 0.85, hy: 1.55 }; // halve maten van het platte bovenvlak (AHN, 3D BAG)

// ---------- schacht, kroonlijst en afgeknot schilddak ----------
const shaft = box(-T.hx, -T.hy, BASE, T.hx, T.hy, H.wall + 0.05);
const cornice = hull([
  ...ring3(rect(-T.hx, -T.hy, T.hx, T.hy), H.wall),
  ...ring3(rect(-T.hx - CORNICE, -T.hy - CORNICE, T.hx + CORNICE, T.hy + CORNICE), H.corniceLow),
  ...ring3(rect(-T.hx - CORNICE, -T.hy - CORNICE, T.hx + CORNICE, T.hy + CORNICE), H.eave),
]);
// Vier dakvlakken van circa 63 graden van de dakvoet naar het platte bovenvlak.
const roof = hull([
  ...ring3(rect(-T.hx - CORNICE, -T.hy - CORNICE, T.hx + CORNICE, T.hy + CORNICE), H.eave - 0.05),
  ...ring3(rect(-TOP.hx, -TOP.hy, TOP.hx, TOP.hy), H.top),
]);

// ---------- vensters en deur als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Van de foto (pleinzijde): deur 0,95 × 2,2 m, drie vensters van 1,3 m breed.
const OPENINGS = [
  [0.95, 0, 2.2], // deur
  [1.3, 3.45, 4.9], // venster met rolluik
  [1.3, 6.0, 7.25],
  [1.3, 8.65, 9.65],
];
const front = OPENINGS.map(([w, z0, z1]) => place(niche(T.hy, w, z0, z1), { deg: -90 }));
// Achterkant (tuinzijde, geen foto): dezelfde drie vensters, zonder deur.
const back = OPENINGS.slice(1).map(([w, z0, z1]) => place(niche(T.hy, w, z0, z1), { deg: 90 }));

const tower = union([shaft, cornice, roof]).subtract(union([...front, ...back]));

// ---------- woning in hetzelfde BAG-pand ----------
// Rechthoek van de BAG (x 2,2 tot 6,72, y -5,55 tot 4,15) met een zadeldak: nok
// evenwijdig aan de vleugel op y -3,9 en 10,1 m, voorgoot op 8,1 m (50 graden),
// lange achterhelling naar de goot op 4,15 m (36 graden), zonder overstek.
const HOUSE = { x0: T.hx, x1: 6.72, y0: -5.55, y1: 4.15, ridgeY: -3.9, ridge: 10.1, frontEave: 8.1, backEave: 4.15 };
const roofPlane = (poly, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, 20).trimByPlane([a / n, b / n, -1 / n], -c / n);
};
const sFront = (HOUSE.ridge - HOUSE.frontEave) / (HOUSE.ridgeY - HOUSE.y0);
const sBack = (HOUSE.ridge - HOUSE.backEave) / (HOUSE.y1 - HOUSE.ridgeY);
const housePoly = rect(HOUSE.x0, HOUSE.y0, HOUSE.x1, HOUSE.y1);
const house = roofPlane(housePoly, 0, sFront, HOUSE.ridge - sFront * HOUSE.ridgeY).intersect(
  roofPlane(housePoly, 0, -sBack, HOUSE.ridge + sBack * HOUSE.ridgeY),
);

await writeLandmark({
  slug: "watertoren-stramproy",
  base: BASE,
  // De toren is één node; de woning die in hetzelfde BAG-pand zit, staat als los blok op het maaiveld ernaast.
  nodes: [
    ["building:schacht-kroonlijst-en-schilddak", tower],
    ["building:woning-naast-de-toren", house],
  ],
  catalog: {
    name: "Watertoren Stramproy",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Voor en achter de toren, in de open stroken tussen de vleugels.
    groundSamplePoints: [[-1.2, -4.4], [1.2, -4.4], [-1.2, 4.4], [1.2, 4.4]],
    // Ellipsoïdisch: NAP +32,17 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0988100000025603"],
    description:
      "Oorsprong op het hart van de BAG-rechthoek van de toren op maaiveld (NAP +32,17 m), +Y naar achteren (54,2 graden in RD), de pleinzijde op -Y. Vierkante bakstenen toren van 4,40 × 5,78 m tussen twee woonvleugels, met een deur en drie vensters boven elkaar, een kroonlijst op 10,4 tot 10,85 m en een afgeknot schilddak van circa 63 graden tot een plat bovenvlak op 14,0 m; daarnaast de woning uit hetzelfde BAG-pand met een zadeldak (nok 10,1 m). Maten uit AHN, BAG, 3D BAG en een Commons-foto.",
    realWorld: {
      renovatedAndIncorporated: 2004,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 46.32,
      towerWidthM: T.hx * 2,
      towerDepthM: T.hy * 2,
      wallTopM: H.wall,
      eaveM: H.eave,
      flatTopM: [TOP.hx * 2, TOP.hy * 2],
      modelTopM: H.top,
      houseRidgeM: HOUSE.ridge,
      houseEavesM: [HOUSE.frontEave, HOUSE.backEave],
      photoScalePxPerM: 43,
      geoidNlgeo2018M: GEOID_N,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Stramproy)",
      "https://commons.wikimedia.org/wiki/File:Stramproy_Watertoren_7544.JPG (pleinzijde, maten)",
      "PDOK BAG-pand 0988100000025603, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
      "3D BAG (LoD2.2) van panden 0988100000025603 en 0988100000025604: dakvlak, nok en goten",
      "NLGEO2018-geoïdehoogte op de oorsprong (44,56 m) voor groundHeight",
    ],
  },
});

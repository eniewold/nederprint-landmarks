// Watertoren van Doorwerth (1937-1938, ir. Th.K.J. Koch), rijksmonument 523656,
// reservoir van 50 tot 60 m³, aan de Spechtlaan. Zakelijk-expressionistische
// toren van gele baksteen: een vierkante hoofdbouw (5,6 × 5,5 m) met plat dak
// achter een borstwering met kunststenen afdeklijst, aan de zuidzijde een
// halfrond trappenhuis dat 2,5 m boven de hoofdbouw uitsteekt, en op de
// reservoirverdieping in de noord-, oost- en westgevel een kleine gebogen
// uitkraging met twee louvrevensters tussen betonnen banden. Sinds de
// verbouwing tot woning (2009-2010) staat er aan de zuidoostzijde een
// aanbouw met plat dak en een lagere tussenbouw tegen de oostgevel; beide
// horen bij hetzelfde BAG-pand.
// Oorsprong op het hart van de hoofdbouw in de BAG-contour op maaiveld
// (NAP +55,6 m). +X staat loodrecht op de oostgevel (straatzijde), 2,1 graden
// linksom van RD-oost; +Y wijst naar het noorden. Hoogtes uit het AHN
// (borstwering hoofdbouw 14,9 m, trappenhuis 17,45 m, aanbouw 4,9 m,
// tussenbouw 3,7 m); banden, vensters en uitkraging van de Commons-foto
// (2007, oostgevel) geschaald op de borstwering in het AHN (44 px/m) en het
// register van de RCE.
import { Manifold, hull, ring3, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [182824.03, 443183.24];
const AXIS = [0.99933, 0.03664];
const BASE = -0.3;
const H = {
  plinth: 0.6, // kunststenen plint, met een schuine bovenkant tot 0,75
  plinthBevel: 0.75,
  link: 3.7, // tussenbouw tegen de oostgevel (2010)
  annex: 4.9, // aanbouw (2010)
  skylight: 5.45, // twee dakopbouwen met lichtkap op de aanbouw
  window: [5.0, 5.95], // zesruitsvenster midden in de gevel
  bandFoot: 9.35, // schuine onderkant van de onderste band
  band0: 10.05,
  bay0: 10.3, // gebogen uitkraging rond de omgang van het reservoir
  bayWindows: [11.35, 12.75], // twee louvrevensters met vier betonnen lamellen
  bay1: 13.5,
  band1: 13.72, // bovenste band, uitkragend op een schuine onderkant
  band1Top: 13.95,
  wall: 14.55, // onderkant van de afdeklijst van de hoofdbouw
  coping: 14.9, // bovenkant van de borstwering van de hoofdbouw
  topWindows: [15.0, 15.7], // twee vensters in de flanken van het trappenhuis boven het dak
  stairWall: 17.1,
  stairCoping: 17.45, // bovenkant van de borstwering op het trappenhuis
};
const SLITS = [[2.8, 3.7], [7.9, 8.8], [12.9, 13.8]]; // smalle valraampjes in het trappenhuis
const A = { u: 2.78, v: 2.75 }; // halve maten van de hoofdbouw (BAG)
// Trappenhuis: rechte flanken op u = ±r, halfrond aan de zuidkant (hart op v = cv), boven het dak tot v = north.
const STAIR = { r: 1.21, cv: -3.29, north: 1.2 };

const rect2 = (a, b) => [[a, -b], [a, b], [-a, b], [-a, -b]];
const stadium = (d = 0, n = 24) => {
  const r = STAIR.r + d;
  return [
    [r, STAIR.north + d],
    [-r, STAIR.north + d],
    ...Array.from({ length: n + 1 }, (_, k) => {
      const t = Math.PI + (Math.PI * k) / n;
      return [r * Math.cos(t), STAIR.cv + r * Math.sin(t)];
    }),
  ];
};

// ---------- hoofdbouw en trappenhuis met plint en afdeklijsten ----------
const main = hull([...ring3(rect2(A.u, A.v), BASE), ...ring3(rect2(A.u, A.v), H.wall)]);
const mainPlinth = hull([...ring3(rect2(A.u + 0.1, A.v + 0.1), BASE), ...ring3(rect2(A.u + 0.1, A.v + 0.1), H.plinth), ...ring3(rect2(A.u, A.v), H.plinthBevel)]);
// Afdeklijst: kraagt 0,1 m uit op een schuine onderkant (56 graden).
const mainCoping = hull([...ring3(rect2(A.u, A.v), H.wall), ...ring3(rect2(A.u + 0.1, A.v + 0.1), H.wall + 0.15), ...ring3(rect2(A.u + 0.1, A.v + 0.1), H.coping)]);
const stair = hull([...ring3(stadium(), BASE), ...ring3(stadium(), H.stairWall)]);
const stairPlinth = hull([...ring3(stadium(0.1), BASE), ...ring3(stadium(0.1), H.plinth), ...ring3(stadium(), H.plinthBevel)]);
const stairCoping = hull([...ring3(stadium(), H.stairWall), ...ring3(stadium(0.1), H.stairWall + 0.15), ...ring3(stadium(0.1), H.stairCoping)]);

// ---------- gevelreliëf (vlak met normaal +X op afstand f) ----------
// Cirkelsegment op de gevel: koorde c, pijl s; voor hull() met de achterkant 0,1 m in de muur.
const arc = (f, c, s, n = 12) => {
  const R = (c * c) / 4 / (2 * s) + s / 2, cx = f + s - R, t = Math.asin(c / 2 / R);
  return [[f - 0.1, -c / 2], [f - 0.1, c / 2], ...Array.from({ length: n + 1 }, (_, k) => {
    const p = -t + (2 * t * k) / n;
    return [cx + R * Math.cos(p), R * Math.sin(p)];
  })];
};
// Nis met een vlakke bodem en een plafond dat naar binnen onder 56 graden oploopt (de export vult hem niet op).
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + Math.min(0.6, (z1 - z0) / 1.5 - 0.01), zb = z1 - 1.5 * (b - f), za = z1 + 1.5 * depth;
  return hull([
    [a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0],
    [a, -w / 2, za], [a, w / 2, za], [f, -w / 2, z1], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb],
  ]);
};
// Gebogen uitkraging rond de omgang van het reservoir (3,0 m breed, 0,4 m uit), op een onderste band
// (3,3 m, 0,5 m uit) met een schuine onderkant en onder een bovenste band (0,55 m uit) op een schuine kraag.
const bay = (f) =>
  union([
    hull([...ring3(arc(f, 3.3, 0.02), H.bandFoot), ...ring3(arc(f, 3.3, 0.5), H.band0), ...ring3(arc(f, 3.3, 0.5), H.bay0)]),
    hull([...ring3(arc(f, 3.0, 0.4), H.bay0 - 0.01), ...ring3(arc(f, 3.0, 0.4), H.bay1)]),
    hull([...ring3(arc(f, 3.0, 0.4), H.bay1 - 0.01), ...ring3(arc(f, 3.3, 0.55), H.band1), ...ring3(arc(f, 3.3, 0.55), H.band1Top)]),
  ]);
const FACES = [{ deg: 0, f: A.u }, { deg: 90, f: A.v }, { deg: 180, f: A.u }]; // oost, noord, west
const bays = union(FACES.map(({ deg, f }) => place(bay(f), { deg })));

const cuts = union([
  // Twee louvrevensters (samen 1,8 m breed) in elke uitkraging, en een zesruitsvenster eronder midden in de gevel.
  ...FACES.flatMap(({ deg, f }) => [
    place(niche(f + 0.4, 1.8, ...H.bayWindows, 0.3), { deg }),
    place(niche(f, 0.55, ...H.window, 0.25), { deg }),
  ]),
  // Twee vensters naast elkaar in elke flank van het trappenhuis boven het dak.
  ...[0, 180].map((deg) => place(niche(STAIR.r, 2.0, ...H.topWindows, 0.25), { deg, at: [0, -1.5, 0] })),
  // Valraampjes in de ronde kop van het trappenhuis, naar het zuidzuidwesten.
  ...SLITS.map(([z0, z1]) => place(niche(STAIR.r, 0.35, z0, z1, 0.25), { deg: 250, at: [0, STAIR.cv, 0] })),
]);

const tower = union([main, mainPlinth, mainCoping, stair, stairPlinth, stairCoping, bays]).subtract(cuts);

// ---------- aanbouw en tussenbouw (2010) uit de BAG-contour, hoogtes uit het AHN ----------
const ANNEX = [[2.49, -6.32], [2.47, -11.72], [17.0, -12.06], [17.14, -3.07], [7.01, -5.3], [3.24, -5.65], [3.24, -6.17]];
const LINK = [[3.24, -5.75], [7.03, -5.4], [5.27, 2.45], [2.72, 2.47], [2.72, -2.49], [3.26, -2.49]];
const annex = union([
  prism(ANNEX, BASE, H.annex),
  prism(LINK, BASE, H.link),
  prism([[3.6, -9.4], [6.3, -9.4], [6.3, -7.8], [3.6, -7.8]], H.annex - 0.05, H.skylight),
  prism([[11.9, -9.6], [15.5, -9.6], [15.5, -8.0], [11.9, -8.0]], H.annex - 0.05, H.skylight),
]);

await writeLandmark({
  slug: "watertoren-doorwerth",
  base: BASE,
  // Eén node: de export vult elke node apart op; aanbouw en tussenbouw staan tegen de toren.
  nodes: [["building:toren-trappenhuis-en-aanbouw", union([tower, annex])]],
  catalog: {
    name: "Watertoren Doorwerth",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-4.3, 0], [0, 4.3], [-2.2, -5.6], [8.5, 1.0]],
    replacesBuildings: ["NL.IMBAG.Pand.0274100000012264"],
    description:
      "Oorsprong op het hart van de vierkante hoofdbouw in de BAG-contour op maaiveld (NAP +55,6 m), +X loodrecht op de oostgevel (2,1 graden), +Y naar het noorden. Bakstenen hoofdbouw van 5,6 × 5,5 m op een kunststenen plint met afdeklijst tot 14,9 m; aan de zuidzijde een halfrond trappenhuis (2,4 m breed) tot 17,45 m dat boven het dak tot 1,2 m voorbij het hart doorloopt, met valraampjes en twee vensters per flank; in de noord-, oost- en westgevel een gebogen uitkraging (10,3 tot 13,5 m) met louvrevensters tussen betonnen banden en een venster op 5 m; aan de zuidoostkant de aanbouw (4,9 m, met twee dakopbouwen) en de tussenbouw (3,7 m) van 2010. Maten uit BAG, AHN, RCE-register en een foto.",
    realWorld: {
      publishedHeightM: 19,
      registerHeightM: "ruim 18",
      reservoirM3: [50, 60],
      reservoirDiameterM: 5,
      ahnGroundNapM: 55.6,
      ahnMainParapetM: 14.9,
      ahnStairTopM: 17.45,
      ahnAnnexRoofM: 4.9,
      ahnLinkRoofM: 3.7,
      bagMainBlockM: [5.56, 5.5],
      bagStairWidthM: 2.42,
      bayM: [10.3, 13.5],
      photoScalePxPerM: 44,
      modelTopM: 17.45,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Doorwerth)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/523656 (opbouw, trappenhuis, uitkragingen, banden)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Doorwerth.jpg (oostgevel 2007, maten)",
      "http://www.watertoren-doorwerth.nl/ (foto's na de verbouwing van 2010, ter controle)",
      "PDOK BAG-pand 0274100000012264, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

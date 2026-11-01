// Watertoren van Radio Kootwijk (J.M. Luthmann, 1922), rijksmonument, 37,85 m
// hoog met een reservoir van 110 m³ en bovenop het lichtbaken voor de zendmasten.
// Slanke betonnen achthoek (BAG 7,2 m over de vlakken, op het dak 6,9 m) met op
// de vier hoofdvlakken dezelfde gevel: een portaal met een schuin afgedekte kap,
// trap en wangen, een lisene met zes kleine vensters, en bovenin een erker over
// de hele vlakbreedte met een V-vormige onderkant en een hoge vensterstrook. De
// vier schuine vlakken hebben bovenin een hoge smalle vensterstrook. Een laag
// achtkant tentdak draagt het ronde glazen lichtbaken.
// Oorsprong tussen het hart van de BAG-contour en het hart van het dak in het
// AHN (0,4 m uit elkaar) op maaiveld (NAP +47,15 m buiten het muurtje). -Y wijst
// naar het voorportaal aan het pad, op -78,4 graden in RD (de BAG-vlakken staan
// op -78,4 + k*45). Hoogtes uit de frontale foto 20160926 Watertoren1 (20,8 px/m,
// geschaald op de dakrand in het AHN), het portaal uit de RCE-foto 20127027
// (deur 0,95 m, 152 px/m), het dak en het baken uit het AHN.
import { Manifold, CrossSection, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [184991.2, 465295.42];
const AXIS = [0.9796, 0.2011]; // +X op 11,6 graden; het voorportaal staat op -Y
const BASE = -0.3;
const H = {
  eave: 34.15, // dakrand
  oriel: 34.15, // de erkers lopen door tot de dakrand
  orielFoot: 27.3, // onderkant van de erkerbak
  vTip: 26.8, // punt van de V-vormige onderkant, op de lisene
  roofTop: 35.9, // tentdak tegen de voet van het baken
  plinth: 36.2, // voet van het lichtbaken
  glass: 37.25,
  top: 37.7,
};
const A = { foot: 3.6, eave: 3.45, roofTop: 1.1 }; // apothema van de achthoek
const apo = (z) => A.foot + ((z - BASE) / (H.eave - BASE)) * (A.eave - A.foot);
const oct = (a, z) => ring3(circle([0, 0], a / Math.cos(Math.PI / 8), 8, Math.PI / 8), z);
const MAIN = [0, 90, 180, 270]; // vlak 270 (-Y) is het voorportaal aan het pad
const DIAG = [45, 135, 225, 315];

// ---------- verjongende achthoekige schacht met tentdak en lichtbaken ----------
const shaft = hull([...oct(A.foot, BASE), ...oct(A.eave, H.eave)]);
const roof = hull([...oct(A.eave, H.eave - 0.05), ...oct(A.roofTop, H.roofTop)]); // helling 37 graden
const beacon = union([
  hull([...oct(A.roofTop, H.roofTop - 0.3), ...oct(A.roofTop, H.plinth)]),
  Manifold.revolve(new CrossSection([[[0, H.plinth - 0.05], [0.5, H.plinth - 0.05], [0.5, H.glass], [0.15, H.top], [0, H.top]]]), 32),
]);

// ---------- gevel van een hoofdvlak (normaal +X) ----------
const half = (a) => a * Math.tan(Math.PI / 8); // halve vlakbreedte
// Erker over de hele vlakbreedte, 0,6 m uit het vlak, met een V-vormige onderkant naar de lisene.
const ORIEL_OUT = 0.6;
const aO = apo(H.orielFoot), hw = half(apo(H.oriel)) - 0.01;
const oriel = union([
  hull([[aO - 0.2, -hw, H.orielFoot], [aO + ORIEL_OUT, -hw, H.orielFoot], [aO - 0.2, hw, H.orielFoot], [aO + ORIEL_OUT, hw, H.orielFoot],
    [aO - 0.2, -hw, H.oriel], [aO + ORIEL_OUT, -hw, H.oriel], [aO - 0.2, hw, H.oriel], [aO + ORIEL_OUT, hw, H.oriel]]),
  hull([[aO - 0.2, -hw, H.orielFoot + 0.01], [aO + ORIEL_OUT, -hw, H.orielFoot + 0.01], [aO - 0.2, hw, H.orielFoot + 0.01], [aO + ORIEL_OUT, hw, H.orielFoot + 0.01],
    [aO - 0.2, -0.5, H.vTip], [aO + 0.2, -0.5, H.vTip], [aO - 0.2, 0.5, H.vTip], [aO + 0.2, 0.5, H.vTip]]),
]);
// Lisene van 1,0 m breed, 0,2 m uit het vlak, van de portaalkap tot in de erker.
const lisene = hull([[apo(4.6) - 0.2, -0.5, 4.6], [apo(4.6) + 0.2, -0.5, 4.6], [apo(4.6) - 0.2, 0.5, 4.6], [apo(4.6) + 0.2, 0.5, 4.6],
  [aO - 0.2, -0.5, H.vTip + 0.05], [aO + 0.2, -0.5, H.vTip + 0.05], [aO - 0.2, 0.5, H.vTip + 0.05], [aO + 0.2, 0.5, H.vTip + 0.05]]);
// Portaal: iets taps toelopend blok met afgeschuinde hoeken en een schuin afgedekte kap.
const P = { front: 1.1, frontTop: 0.9, shoulder: 4.4, cap: 4.85, cheek: 1.9 };
const a0 = A.foot;
const porch = union([
  hull([
    ...[[a0 - 0.3, 1.45], [a0 + P.front - 0.15, 1.45], [a0 + P.front, 1.3]].flatMap(([x, y]) => [[x, y, BASE], [x, -y, BASE]]),
    ...[[a0 - 0.3, 1.4], [a0 + P.frontTop - 0.15, 1.4], [a0 + P.frontTop, 1.25]].flatMap(([x, y]) => [[x, y, P.shoulder], [x, -y, P.shoulder]]),
    ...[[a0 - 0.3, 0.95], [a0 + 0.3, 0.95]].flatMap(([x, y]) => [[x, y, P.cap], [x, -y, P.cap]]),
  ]),
  // Wangen naast de trap (1,2 m ertussen) en drie treden.
  ...[-1, 1].map((s) => hull([[a0 + 0.8, s * 0.6, BASE], [a0 + P.cheek, s * 0.6, BASE], [a0 + 0.8, s * 1.45, BASE], [a0 + P.cheek, s * 1.45, BASE],
    [a0 + 0.8, s * 0.6, 1.3], [a0 + P.cheek, s * 0.6, 1.3], [a0 + 0.8, s * 1.45, 1.3], [a0 + P.cheek, s * 1.45, 1.3]])),
  ...[[0.2, 2.2, 1.2], [0.4, 1.85, 0.62], [0.6, 1.5, 0.62]].map(([z, x, y]) => hull([[a0 + 0.8, -y, BASE], [a0 + x, -y, BASE], [a0 + 0.8, y, BASE], [a0 + x, y, BASE],
    [a0 + 0.8, -y, z], [a0 + x, -y, z], [a0 + 0.8, y, z], [a0 + x, y, z]])),
]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const WINDOWS = [5.5, 9.6, 13.7, 17.8, 21.9, 26.0]; // midden van de zes vensters op de lisene
const facadeCuts = [
  niche(a0 + P.front - (0.2 * 3.4) / 4.7, 1.1, 0.6, 3.1, 0.35), // deur in een diepe omlijsting
  ...WINDOWS.map((z) => niche(apo(z) + 0.2, 0.5, z - 0.5, z + 0.5, 0.3)),
  niche(aO + ORIEL_OUT, 0.6, 28.9, 33.3, 0.3), // hoge vensterstrook in de erker
];
const facade = union([oriel, lisene, porch]);

await writeLandmark({
  slug: "watertoren-radio-kootwijk",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [[
    "building:achtkante-schacht-met-portalen-erkers-en-lichtbaken",
    union([shaft, roof, beacon, ...MAIN.map((deg) => place(facade, { deg }))]).subtract(union([
      ...MAIN.flatMap((deg) => facadeCuts.map((c) => place(c, { deg }))),
      // Hoge smalle vensterstrook midden op elk schuin vlak.
      ...DIAG.map((deg) => place(niche(apo(30.8), 0.6, 28.6, 33.0, 0.3), { deg })),
    ])),
  ]],
  catalog: {
    name: "Watertoren Radio Kootwijk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5, 5], [-5, 5], [5, -5], [-5, -5]],
    replacesBuildings: ["NL.IMBAG.Pand.0200100000700606"],
    description:
      "Oorsprong tussen het hart van de BAG-contour en het hart van het dak in het AHN op maaiveld (NAP +47,15 m), -Y naar het voorportaal aan het pad (-78,4 graden in RD). Betonnen achthoek van 7,2 m over de vlakken, verjongend tot 6,9 m op de dakrand op 34,15 m; op elk van de vier hoofdvlakken een portaal met kap, trap en wangen, een lisene met zes vensters en een erker met V-vormige onderkant en vensterstrook (27,3 m tot de dakrand), op de schuine vlakken een hoge vensterstrook; achtkant tentdak en rond glazen lichtbaken tot 37,7 m. Maten uit BAG, AHN, Wikipedia en foto's.",
    realWorld: {
      publishedHeightM: 37.85,
      reservoirM3: 110,
      ahnGroundNapM: 47.15,
      ahnTopNapM: 84.83,
      footAcrossFlatsM: 7.2,
      eaveAcrossFlatsM: 6.9,
      eaveM: 34.15,
      orielM: [27.3, 34.15],
      beaconDiameterM: 1.0,
      modelTopM: 37.7,
      photoScalePxPerM: 20.8,
      minimumPartM: 0.5,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Radio_Kootwijk)",
      "https://commons.wikimedia.org/wiki/File:20160926_Watertoren1_Radio_Kootwijk.jpg (frontale foto, hoogtes)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_-_Kootwijk_-_20127027_-_RCE.jpg (portaal, deur en trap)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Radio_Kootwijk_P1380186.jpg (zuidgevel, zijportalen op de rand)",
      "https://commons.wikimedia.org/wiki/File:Kootwijk_watertoren_westzijde.jpg (westgevel gelijk aan de zuidgevel)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_-_Kootwijk_-_20127026_-_RCE.jpg (erker en vensters van onderen)",
      "PDOK BAG-pand 0200100000700606, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

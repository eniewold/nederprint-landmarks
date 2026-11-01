// Watertoren Vrieheide in Heerlen (H.W.F.C. Heman en F.H. Steeneken, 1965),
// 41,43 m met een reservoir van 1000 m³. Paddenstoelvorm: een gladde betonnen
// schacht met een deur in een betonnen omlijsting, een cilindrisch reservoir van
// 15,1 m met vier banden geribde bekleding, een afgeronde onderrand en een
// vlakke, iets naar de schacht oplopende bodem, een plat dak en een ronde opbouw
// (trappenhuis) met een rij vensters.
// Oorsprong op het hart van de BAG-cirkel (r 7,55 m, afwijking ≤ 0,06 m) op het
// plateau rond de voet (AHN-DTM NAP +110,9 m), assen in RD-richting. Het
// terrein loopt naar het noordoosten af tot NAP +109,0 m. Dak en opbouw uit de
// 3D BAG (AHN5, 2024: dak NAP +146,7, opbouw +150,5; het AHN4-DSM is op het dak
// onbruikbaar), breedtes en de bandindeling uit de frontale telefoto
// "Watertoren Heerlen Vrieheide" (23,8 px/m, geschaald op de BAG-diameter).
// De deur staat op het noordoosten, waar het klinkerpad (BGT) op de toren uitkomt.
import { Manifold, CrossSection, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [195429.58, 325584.1];
const AXIS = [1, 0];
const BASE = -0.6; // dieper dan gewoonlijk: de toren staat op een heuvel die naar het noordoosten afloopt
const R = { shaft: 2.95, tank: 7.55, lipInner: 7.0, drum: 2.6 };
const H = {
  underShaft: 26.4, // bodem tegen de schacht
  under: 25.6, // laagste punt van de afgeronde onderrand
  clad: 26.2, // onderkant van de geribde bekleding
  roof: 35.8, // plat dak (3D BAG NAP +146,67..146,70)
  drum: 39.6, // dak van de opbouw (3D BAG NAP +150,5, AHN4 +150,45)
};
const BAND = (H.roof - H.clad) / 4; // vier banden van 2,4 m
const DOOR_DEG = 50; // noordoosten

// ---------- schacht, reservoir en opbouw als één omwentelingsprofiel ----------
// Afgeronde onderrand als kwart ellips van (7,0, 25,6) naar (7,55, 26,2).
const lip = Array.from({ length: 7 }, (_, k) => {
  const t = ((k + 1) / 8) * (Math.PI / 2);
  return [R.lipInner + (R.tank - R.lipInner) * Math.sin(t), H.clad - (H.clad - H.under) * Math.cos(t)];
});
const body = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.shaft, BASE], [R.shaft, H.underShaft], [R.lipInner, H.under], ...lip, [R.tank, H.clad],
    [R.tank, H.roof], [R.drum, H.roof], [R.drum, H.drum], [0, H.drum],
  ]]),
  128,
);

// ---------- voegen tussen de vier banden ----------
// V-voeg van 0,2 m diep en 0,6 m hoog: beide flanken onder 56 graden, zodat er niets overhangt.
const groove = (zg) => Manifold.revolve(
  new CrossSection([[[R.tank - 0.2, zg], [R.tank + 0.45, zg - 0.975], [R.tank + 0.45, zg + 0.975]]]),
  128,
);
const grooves = union([1, 2, 3].map((k) => groove(H.clad + k * BAND)));

// ---------- deur met betonnen omlijsting ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Omlijsting 2,6 m breed en 3,0 m hoog, 0,25 m voor de schacht, bovenkant onder 56 graden terug naar de gevel.
const SURROUND = { face: R.shaft + 0.25, half: 1.3, top: 2.9 };
const surround = hull([
  ...[-SURROUND.half, SURROUND.half].flatMap((y) => [
    [2.4, y, BASE], [SURROUND.face, y, BASE], [SURROUND.face, y, SURROUND.top], [2.4, y, SURROUND.top + (SURROUND.face - 2.4) * 1.5],
  ]),
]);

// ---------- vensters in de opbouw ----------
const DRUM_WINDOWS = 8; // 1,0 m breed met penanten van 1,0 m
const cuts = [
  place(niche(SURROUND.face, 1.8, BASE, 2.5, 0.35), { deg: DOOR_DEG }),
  ...Array.from({ length: DRUM_WINDOWS }, (_, k) => place(niche(R.drum, 1.0, H.roof + 1.7, H.roof + 3.1, 0.25), { deg: DOOR_DEG + 22.5 + (k * 360) / DRUM_WINDOWS })),
];

await writeLandmark({
  slug: "watertoren-heerlen-vrieheide",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los reservoir zou een eigen voet tot de grondplaat krijgen.
  nodes: [["building:schacht-reservoir-en-opbouw", union([body, place(surround, { deg: DOOR_DEG })]).subtract(union([grooves, ...cuts]))]],
  catalog: {
    name: "Watertoren Vrieheide",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch: NAP 110,9 + 45,64 (NLGEO2018-geoïde op de oorsprong).
    groundHeight: 156.54,
    // Op de diagonalen net buiten het reservoir; de laagste (noordoost, NAP ≈110,6) laat de voet aan de lage kant 0,2–0,3 m
    // in het terrein zakken, BASE -0,6 houdt de onderkant ook bij een grover PDOK-terrein onder het maaiveld.
    groundSamplePoints: [[6, 6], [-6, 6], [-6, -6], [6, -6]],
    replacesBuildings: ["NL.IMBAG.Pand.0917100000018180"],
    description:
      "Oorsprong op het hart van de BAG-cirkel op het plateau rond de voet (NAP +110,9 m), assen in RD-richting. Ronde betonnen schacht van 5,9 m met een deur in een betonnen omlijsting op het noordoosten, cilindrisch reservoir van 15,1 m met een afgeronde onderrand op 25,6 m, een iets naar de schacht oplopende bodem en vier banden bekleding met V-voegen van 26,2 tot 35,8 m, plat dak op 35,8 m en een ronde opbouw van 5,2 m met acht vensters tot 39,6 m. Maten uit BAG, 3D BAG (AHN5), AHN en foto's.",
    realWorld: {
      publishedHeightM: 41.43,
      reservoirM3: 1000,
      ahnGroundNapM: 110.9,
      groundLowSideNapM: 109.0,
      roofNapM: 146.7,
      drumTopNapM: 150.5,
      geoidNlgeo2018M: 45.64,
      tankDiameterM: 15.1,
      shaftDiameterM: 5.9,
      drumDiameterM: 5.2,
      underRimM: 25.6,
      claddingM: [26.2, 35.8],
      roofM: 35.8,
      modelTopM: 39.6,
      photoScalePxPerM: 23.8,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Heerlen_Vrieheide)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Heerlen_Vrieheide.jpg (frontale telefoto: breedtes, banden, opbouw)",
      "https://commons.wikimedia.org/wiki/File:Heerlen-Watertoren_Vrieheide.jpg (bodem en onderrand)",
      "https://commons.wikimedia.org/wiki/File:Heerlen_Watertoren_3812.JPG (deur met omlijsting)",
      "PDOK BAG-pand 0917100000018180, 3D BAG (AHN5), AHN DSM/DTM 0,5 m, luchtfoto 8 cm, BGT en NLGEO2018, 2026-11-01",
    ],
  },
});

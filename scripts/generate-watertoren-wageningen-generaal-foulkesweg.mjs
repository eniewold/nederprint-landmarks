// Watertoren aan de Generaal Foulkesweg in Wageningen ("de peperbus"; Th.K.J.
// Koch, 1948), op de Wageningse Berg naast het voormalige stadion; 30 m hoog
// met een reservoir van 130 m³. Vervangt de toren uit 1898 die in de oorlog is
// verwoest. Bakstenen schacht die zich licht verjongt, met zes steunberen die
// boven de witte betonband onder het reservoir eindigen op een schuine
// leikap; een ronde traptoren aan de voorkant die door het dak steekt en een
// eigen kegeldakje heeft; een open omloop onder een breed koperen kegeldak, en
// een portaal met de deur aan de voet van de traptoren.
// Oorsprong op het hart van de schacht in het AHN (de BAG-contour is grof en
// ligt 1,5 m noordelijker) op maaiveld (NAP +43,0 m). Lokaal stelsel met de
// traptoren langs +Y, op kompasrichting -5 graden (AHN, luchtfoto); de
// steunberen staan op ±30, ±90 en ±150 graden daarvan (luchtfoto en foto's).
// Dakhelling en top uit het AHN (het koper buiten r 3 m geeft geen echo's);
// breedtes en hoogtes van banden, rand, omloop en traptoren uit de frontale
// RCE-foto 20423290 (36,3 px/m, geschaald op de top in het AHN) en de foto
// van het bovenste deel (RCE 20423291, 84 px/m op het reservoir van 9 m).
import { Manifold, CrossSection, hull, union, place, prism, circle, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [176246.5, 442220.45];
const STAIR_BEARING = -5; // kompasrichting van de traptoren
const AXIS = [Math.cos((-STAIR_BEARING * Math.PI) / 180), Math.sin((-STAIR_BEARING * Math.PI) / 180)]; // lokale +X op 85 graden
const BASE = -0.3;
const H = {
  bandFoot: 19.15, // schuine onderkant van de witte band
  band: 19.3, // band onder het reservoir
  bandTop: 19.7,
  copingFoot: 25.23,
  coping: 25.45, // witte rand boven op het reservoir
  copingTop: 25.8,
  gallery: 26.2, // bovenkant van de open omloop (verdiept)
  soffit: 26.45, // onderkant van de dakrand
  eave: 26.6,
  apex: 30.3, // top van het kegeldak (AHN 30,37 boven maaiveld, zonder de spits)
  buttressCap: 21.1, // waar de leikap van de steunbeer het reservoir raakt
  stairTop: 27.9, // goot van de traptoren
  stairApex: 28.9,
  porchEave: 2.4,
  porchRidge: 3.7,
};
const R = { shaftFoot: 4.78, shaftTop: 4.62, band: 4.72, tank: 4.45, coping: 4.6, gallery: 4.2, eave: 5.05, buttressFoot: 5.25, buttressTop: 5.12, stair: 1.25 };
const STAIR_Y = 4.4; // hart van de traptoren
const shaftR = (z) => R.shaftFoot + ((z - BASE) / (H.bandFoot - BASE)) * (R.shaftTop - R.shaftFoot);

// ---------- schacht, band, reservoir, rand, omloop en kegeldak in één omwentelingsprofiel ----------
const body = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.shaftFoot, BASE], [R.shaftTop, H.bandFoot], [R.band, H.band], [R.band, H.bandTop], [R.tank, H.bandTop],
    [R.tank, H.copingFoot], [R.coping, H.coping], [R.coping, H.copingTop], [R.gallery, H.copingTop], [R.gallery, H.gallery],
    [R.eave, H.soffit], [R.eave, H.eave], [0, H.apex],
  ]]),
  96,
);

// ---------- zes steunberen met een schuine leikap tegen het reservoir ----------
// Profiel [r, z] in het radiale vlak langs +Y, 0,9 m breed.
const radialPlate = (pts, w) => hull(pts.flatMap(([r, z]) => [[-w / 2, r, z], [w / 2, r, z]]));
const buttress = radialPlate([[4.0, BASE], [R.buttressFoot, BASE], [R.buttressTop, H.band], [4.3, H.buttressCap], [4.0, H.buttressCap]], 0.9);
const BUTTRESS_ANGLES = [30, 90, 150, 210, 270, 330]; // rechtsom vanaf de traptoren
const buttresses = union(BUTTRESS_ANGLES.map((a) => place(buttress, { deg: -a })));

// ---------- traptoren met kegeldakje, door de dakrand heen ----------
const stairRing = circle([0, STAIR_Y], R.stair, 48);
const stair = union([
  prism(stairRing, BASE, H.stairTop),
  hull([...stairRing.map(([x, y]) => [x, y, H.stairTop - 0.01]), [0, STAIR_Y, H.stairApex]]),
]);

// ---------- portaal met schilddak aan de voet van de traptoren ----------
const PORCH = { u: 2.75, front: 6.5, back: 3.0 };
const porch = union([
  prism([[-PORCH.u, PORCH.back], [PORCH.u, PORCH.back], [PORCH.u, PORCH.front], [-PORCH.u, PORCH.front]], BASE, H.porchEave),
  hull([
    [-PORCH.u, PORCH.back, H.porchEave - 0.01], [PORCH.u, PORCH.back, H.porchEave - 0.01], [PORCH.u, PORCH.front, H.porchEave - 0.01], [-PORCH.u, PORCH.front, H.porchEave - 0.01],
    [-PORCH.u + 1.4, PORCH.back, H.porchRidge], [PORCH.u - 1.4, PORCH.back, H.porchRidge], [PORCH.u - 1.4, PORCH.front - 1.4, H.porchRidge], [-PORCH.u + 1.4, PORCH.front - 1.4, H.porchRidge],
  ]),
]);

// ---------- deur, vensters en spleetvensters als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Hoek a rechtsom vanaf +Y (de traptoren) naar de draaiing van place() (linksom vanaf +X).
const radial = (m, a, at = [0, 0, 0]) => place(m, { deg: 90 - a, at });
const cuts = [
  // Deur in de voorgevel van het portaal, iets rechts van het midden.
  radial(niche(PORCH.front, 1.1, 0, 2.1, 0.3), 0, [0.85, 0, 0]),
  // Spleetvensters in de traptoren boven elkaar.
  ...[3.4, 9.1, 14.4, 19.8, 25.3].map((z) => radial(niche(R.stair, 0.45, z, z + 1.2), 0, [0, STAIR_Y, 0])),
  // Getoogd venster hoog in het paneel links van de traptoren en spleetvensters in de panelen.
  radial(niche(shaftR(18.6), 1.0, 17.5, 18.6, 0.3), 60),
  ...[60, 120, 180, 240, 300].flatMap((a) => [1.2, 9.5].map((z) => radial(niche(shaftR(z + 1.2), 0.45, z, z + 1.2), a))),
  ...[300, 180].map((a) => radial(niche(shaftR(15.2), 0.45, 14.0, 15.2), a)),
  // Spleetvensters in het reservoir.
  ...[60, 180, 300].map((a) => radial(niche(R.tank, 0.45, 22.2, 23.6), a)),
];

await writeLandmark({
  slug: "watertoren-wageningen-generaal-foulkesweg",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los dak of portaal zou een eigen voet krijgen.
  nodes: [["building:schacht-steunberen-traptoren-reservoir-en-kegeldak", union([body, buttresses, stair, porch]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Generaal Foulkesweg",
    origin: ORIGIN,
    xAxis: AXIS.map((v) => +v.toFixed(4)),
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6.3, 0], [-6.3, 0], [0, 7.0], [0, -6.3]], // de zuidkant ligt 0,6 m hoger (helling), vóór het portaal valt het terrein na 7 m af
    replacesBuildings: ["NL.IMBAG.Pand.0289100000005476"],
    description:
      "Oorsprong op het hart van de schacht in het AHN op maaiveld (NAP +43,0 m), lokale +Y naar de traptoren op kompasrichting -5 graden. Licht verjongende schacht (r 4,78 naar 4,62) met zes steunberen en schuine leikappen, witte band op 19,3 m, reservoir van 8,9 m tot 25,45 m met witte rand, verdiepte omloop en koperen kegeldak van 10,1 m met de goot op 26,6 m en de top op 30,3 m; traptoren van 2,5 m met kegeldakje tot 28,9 m en een portaal met schilddak en deur. Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 30,
      reservoirM3: 130,
      ahnGroundNapM: 43.0,
      ahnTopNapM: 73.37,
      shaftDiameterFootM: 9.56,
      acrossButtressesFootM: 10.5,
      bandM: 19.3,
      tankDiameterM: 8.9,
      copingM: 25.8,
      roofDiameterM: 10.1,
      eaveM: 26.6,
      roofApexM: 30.3,
      stairTowerDiameterM: 2.5,
      stairTowerEaveM: 27.9,
      stairTowerApexM: 28.9,
      photoScalePxPerM: 36.3,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Wageningen_Generaal_Foulkesweg)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Wageningen_-_20423290_-_RCE.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_het_bovenste_gedeelte_van_de_watertoren_-_Wageningen_-_20423291_-_RCE.jpg (dak, omloop, traptoren)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_het_onderste_gedeelte_van_de_watertoren_-_Wageningen_-_20423292_-_RCE.jpg (portaal, deur)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Wageningen.jpg",
      "PDOK BAG-pand 0289100000005476, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

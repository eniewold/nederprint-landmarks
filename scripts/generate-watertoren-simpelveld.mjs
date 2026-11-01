// Spoorwegwatertoren van Simpelveld (1929–1930, aannemer Meijer uit Voerendaal),
// rijksmonument 518643, op het spoorwegemplacement (nu ZLSM) op een verhoging
// boven het lagere werkterrein. Een achtzijdige bakstenen onderbouw met een
// rechthoekige stalen deur en een klein venster, en een ver overstekend
// cilindrisch betonnen reservoir (2 × 25 m³, scheidingswand) met een plat dak.
// De stalen trap langs het reservoir en de ladder zijn weggelaten (dun staal).
//
// Oorsprong op het hart van het dak in het AHN-DSM (cirkelfit, NAP +166,8 op
// de rand, tot +166,96 in het midden) op maaiveld (NAP +158,05 in het DTM op
// het plateau rond de voet), assen in RD-richting. De BAG-contour van pand
// 0965100000822833 (24 punten, 5,2 m) ligt 1,3 m naar het zuidoosten verschoven:
// daar staat in het DSM alleen begroeiing (NAP +159 tot +164).
// Diameter van het reservoir 4,6 m uit AHN (4,4 tot 4,7 m tussen de randpixels)
// en luchtfoto (dak 4,4 m breed); Wikipedia noemt 5,1 m, maar dat past niet bij
// het DSM en 4,6 m geeft met 3,8 m hoogte de 50 m³ uit de bron.
// Verhoudingen uit de foto "Simpelveld Watertoren 8547" (vanuit het lagere
// terrein in het noordwesten, frontaal op een vlak van de achthoek; 78 px/m,
// geschaald op het reservoir van 4,6 m): reservoir 3,8 m hoog, onderbouw 3,0 m
// over de vlakken, venster in het vlak naar het noordwesten.
import { CrossSection, Manifold, circle, hull, place, ring3, union, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [197218.65, 315851.5];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  tankBottom: 5.0, // onderkant van het reservoir (foto: 3,8 m onder de dakrand)
  lip: 5.2, // afgeronde onderrand, hier een schuine rand onder 53 graden
  roofEdge: 8.8, // dakrand (AHN NAP +166,8)
  roof: 8.9, // licht oplopend plat dak (AHN tot NAP +166,96)
};
const R = { tank: 2.3, lipFoot: 2.15, shaft: 1.5 }; // shaft = apothema van de achthoek
const DOOR_DEG = 90; // deur naar het noorden, waar het betonpad van de luchtfoto uitkomt (geschat)
const WINDOW_DEG = 135; // venster naar het noordwesten (foto)

// ---------- achtzijdige bakstenen onderbouw, vlakken op 0, 45, 90 ... graden ----------
const oct = circle([0, 0], R.shaft / Math.cos(Math.PI / 8), 8, Math.PI / 8);
const shaft = hull([...ring3(oct, BASE), ...ring3(oct, H.tankBottom + 0.3)]);

// ---------- betonnen reservoir als omwentelingsprofiel ----------
const tank = Manifold.revolve(
  new CrossSection([[
    [0, H.tankBottom], [R.lipFoot, H.tankBottom], [R.tank, H.lip], [R.tank, H.roofEdge], [0, H.roof],
  ]]),
  96,
);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const cuts = [
  place(niche(R.shaft, 0.9, 0, 2.0, 0.3), { deg: DOOR_DEG }), // rechthoekige stalen deur
  place(niche(R.shaft, 0.6, 2.75, 3.45, 0.25), { deg: WINDOW_DEG }), // venster (werkelijk circa 0,45 × 0,55 m)
];

await writeLandmark({
  slug: "watertoren-simpelveld",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los reservoir zou een eigen voet tot de grondplaat krijgen.
  nodes: [["building:achtzijdige-onderbouw-en-reservoir", union([shaft, tank]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Simpelveld",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch: NAP 158,05 + 46,02 (NLGEO2018-geoïde op de oorsprong).
    groundHeight: 204.07,
    // Op het plateau net buiten het reservoir (DTM NAP +157,95 tot +158,15); het werkterrein ligt pas 6 m verder 4,5 m lager.
    groundSamplePoints: [[3.8, 0], [-3.8, 0], [0, 3.8], [0, -3.8]],
    replacesBuildings: ["NL.IMBAG.Pand.0965100000822833"],
    description:
      "Oorsprong op het hart van het dak in het AHN op maaiveld (NAP +158,05 m), assen in RD-richting. Achtzijdige bakstenen onderbouw van 3,0 m over de vlakken met een deur naar het noorden en een venster naar het noordwesten, cilindrisch betonnen reservoir van 4,6 m van 5,0 tot 8,8 m met een schuine onderrand, plat dak licht oplopend tot 8,9 m. Maten uit AHN, luchtfoto en een foto.",
    realWorld: {
      publishedHeightM: 8.85,
      reservoirsM3: [25, 25],
      publishedTankDiameterM: 5.1,
      ahnGroundNapM: 158.05,
      ahnRoofEdgeNapM: 166.8,
      ahnTopNapM: 166.96,
      tankDiameterM: 4.6,
      tankBottomM: 5.0,
      roofEdgeM: 8.8,
      shaftAcrossFlatsM: 3.0,
      modelTopM: 8.9,
      photoScalePxPerM: 78,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Simpelveld)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/518643 (achtzijdige bakstenen onderbouw, stalen deur, venster, betonnen reservoir, plat dak)",
      "https://commons.wikimedia.org/wiki/File:Simpelveld_Watertoren_8547.JPG (foto vanuit het noordwesten, verhoudingen)",
      "https://commons.wikimedia.org/wiki/File:Watertower,_Simpelveld,_Netherlands.JPG (tweede foto, controle)",
      "PDOK BAG-pand 0965100000822833, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

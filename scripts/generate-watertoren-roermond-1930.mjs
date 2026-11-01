// Nieuwe watertoren van Roermond (S. van Ravesteyn, 1928-1930), spoorwegwatertoren
// naast het station voor de stoomlocomotieven, rijksmonument 506153. Een ronde
// toren van drie bouwlagen in baksteen met een plat gedekt, wit geschilderd
// betonnen reservoir van dezelfde doorsnede, stalen vensters (enkel en in paren),
// drie deuren op de begane grond en een kooiladder vanaf een balkon op de eerste
// verdieping tot boven de dakrand aan de noordkant.
// Oorsprong op het hart van het dak in het AHN (0,13 m oost en 0,08 m noord van
// het hart van de BAG-cirkel, r 3,88 m) op maaiveld (AHN-DTM NAP +27,9 m), assen
// in RD-richting. Dak uit de 3D BAG (AHN5, 2024: NAP +42,24, plat) en het AHN4-DSM
// (+42,2 tot +42,3). Hoogtes van de vensters, de overgang naar het reservoir en de
// ladder uit de rechte RCE-foto's 20291317 (noordkant) en 20291318 (zuidoostkant),
// geschaald op de BAG-diameter en de dakhoogte. De standen van de vensterkolommen
// volgen uit vier RCE-foto's die elk twee kolommen tegelijk tonen, de ladder uit
// de luchtfoto (bovenkant bij de dakrand op het noordnoordoosten).
import { Manifold, CrossSection, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [197377.2, 355989.79];
const AXIS = [1, 0];
const BASE = -0.3;
const R = { wall: 3.88, gutterOuter: 3.55, gutterInner: 2.7 };
const H = {
  tank: 9.7, // onderkant van het betonnen reservoir (voeg met schaduwlijn)
  roof: 14.35, // plat dak, NAP +42,25
  gutter: 0.2, // diepte van de donkere ring binnen de dakrand
};
// Kompasrichtingen (graden vanaf het noorden, rechtsom) van de vensterkolommen en deuren.
const BEARING = { south: 193, east: 77.5, single1: 114.5, single2: 150, single3: 131.5, north: 15.5, west: 275, ladder: 32, balcony: 20 };
const deg = (bearing) => 90 - bearing; // place() draait linksom vanaf +X (oost)

// ---------- schacht en reservoir als één omwentelingsprofiel ----------
// Plat dak met een ondiepe ring binnen de dakrand (luchtfoto: witte rand, donkere ring, lichte middenschijf).
const body = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.wall, BASE], [R.wall, H.roof], [R.gutterOuter, H.roof], [R.gutterOuter, H.roof - H.gutter],
    [R.gutterInner, H.roof - H.gutter], [R.gutterInner, H.roof], [0, H.roof],
  ]]),
  128,
);
// Voeg tussen baksteen en beton: V-voeg van 0,15 m diep, beide flanken onder 56 graden.
const joint = Manifold.revolve(
  new CrossSection([[[R.wall - 0.15, H.tank], [R.wall + 0.45, H.tank - 0.9], [R.wall + 0.45, H.tank + 0.9]]]),
  128,
);

// ---------- glazen lichtkap op het dak ----------
// Zadelvormige kap van 1,8 × 2,8 m, nok 0,3 m boven het dak (3D BAG dakmaximum NAP +42,49), lange as op 25 graden.
const skylight = place(
  hull([
    [-1.4, -0.9, H.roof - 0.25], [1.4, -0.9, H.roof - 0.25], [1.4, 0.9, H.roof - 0.25], [-1.4, 0.9, H.roof - 0.25],
    [-1.4, -0.9, H.roof + 0.1], [1.4, -0.9, H.roof + 0.1], [1.4, 0.9, H.roof + 0.1], [-1.4, 0.9, H.roof + 0.1],
    [-1.4, 0, H.roof + 0.3], [1.4, 0, H.roof + 0.3],
  ]),
  { deg: deg(25), at: [0.3, -0.4, 0] },
);

// ---------- balkon en kooiladder aan de noordkant ----------
// Balkon van 1,6 m breed en 0,9 m diep op +3,7 met een dichte borstwering tot +4,7 (in het echt een stalen hek),
// onderkant onder 56 graden terug naar de gevel.
const balcony = hull([
  ...[-0.8, 0.8].flatMap((y) => [
    [R.wall - 0.3, y, 3.7 - 1.8], [R.wall + 0.9, y, 3.7], [R.wall + 0.9, y, 4.7], [R.wall - 0.3, y, 4.7],
  ]),
]);
// Kooiladder als dichte strook van 0,9 m breed en 0,75 m diep vanaf het balkon tot 0,9 m boven het dak
// (de kooi steekt boven de dakrand uit), onderkant onder 56 graden.
const ladder = hull([
  ...[-0.45, 0.45].flatMap((y) => [
    [R.wall - 0.3, y, 3.7 - 1.6], [R.wall + 0.75, y, 3.7], [R.wall + 0.75, y, H.roof + 0.9], [R.wall - 0.3, y, H.roof + 0.9],
  ]),
]);

// ---------- vensters en deuren ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const at = (bearing, w, z0, z1, depth = 0.3) => place(niche(R.wall, w, z0, z1, depth), { deg: deg(bearing) });
const PAIR = 2.1; // twee stalen vensters van 0,9 m met een smal middenstijltje: één nis
const SINGLE = 0.9;
const FLOOR = { top: [7.5, 8.85], middle: [4.6, 6.0] };
const cuts = [
  // Zuid: vensterparen op de drie bouwlagen, beneden hoog.
  at(BEARING.south, PAIR, ...FLOOR.top, 0.35),
  at(BEARING.south, PAIR, ...FLOOR.middle, 0.35),
  at(BEARING.south, PAIR, 1.0, 3.6, 0.35),
  // Oostnoordoost: vensterparen op de bovenste twee lagen, beneden een deur met bovenlicht.
  at(BEARING.east, PAIR, ...FLOOR.top, 0.35),
  at(BEARING.east, PAIR, ...FLOOR.middle, 0.35),
  at(BEARING.east, 1.0, 0, 3.4, 0.35),
  // Oost en zuidoost: losse vensters op de eerste verdieping en de begane grond.
  at(BEARING.single1, SINGLE, ...FLOOR.middle),
  at(BEARING.single2, SINGLE, ...FLOOR.middle),
  at(BEARING.single3, SINGLE, 1.95, 3.4),
  // Noord: deur naar het balkon en deur op de begane grond.
  at(BEARING.north, SINGLE, 4.0, 6.15, 0.35),
  at(BEARING.north, 1.0, 0, 2.15, 0.35),
  // West: deur aan de straat.
  at(BEARING.west, 1.0, 0, 2.3, 0.35),
];

// Eerst de nissen en de voeg uit de toren, dan balkon en ladder erop: de borstwering blijft dicht voor de
// balkondeur en de ladder loopt over de voeg door.
const tower = union([
  body.subtract(union([joint, ...cuts])),
  skylight,
  place(balcony, { deg: deg(BEARING.balcony) }),
  place(ladder, { deg: deg(BEARING.ladder) }),
]);

await writeLandmark({
  slug: "watertoren-roermond-1930",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los reservoir zou een eigen voet tot de grondplaat krijgen.
  nodes: [["building:schacht-reservoir-en-ladder", tower]],
  catalog: {
    name: "Nieuwe watertoren Roermond",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch: NAP 27,9 + 44,73 (NLGEO2018-geoïde op de oorsprong).
    groundHeight: 72.63,
    // Op 5,4 m (r + 1,5) naar oost, west en zuid en op het noordwesten; het noordoosten ligt tegen de fietsenstalling.
    groundSamplePoints: [[5.4, 0], [-5.4, 0], [0, -5.4], [-3.8, 3.8]],
    replacesBuildings: ["NL.IMBAG.Pand.0957100000217594"],
    description:
      "Oorsprong op het hart van het dak in het AHN op maaiveld (NAP +27,9 m), assen in RD-richting. Ronde bakstenen schacht van 7,75 m met drie bouwlagen: vensterparen op het zuiden en oostnoordoosten, losse vensters op het oosten en zuidoosten, deuren op het westen, noorden en oostnoordoosten; betonnen reservoir van dezelfde doorsnede van 9,7 tot 14,35 m met een voeg aan de onderkant, plat dak met een ring binnen de dakrand en een glazen lichtkap, balkon en kooiladder op het noordnoordoosten tot 15,25 m. Maten uit BAG, 3D BAG, AHN en foto's.",
    realWorld: {
      built: "1928-1930",
      architect: "S. van Ravesteyn",
      rijksmonument: 506153,
      ahnGroundNapM: 27.9,
      roofNapM: 42.24,
      roofMaxNapM: 42.49,
      geoidNlgeo2018M: 44.73,
      diameterM: 7.75,
      tankBottomM: 9.7,
      roofM: 14.35,
      windowFloorsM: [[1.0, 3.6], [4.6, 6.0], [7.5, 8.85]],
      balconyM: 3.7,
      modelTopM: 15.25,
      photoScalePxPerM: 31.4,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Roermond)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/506153 (drie bouwlagen, drie deuren, plat gedekt reservoir, stalen trap aan de noordzijde)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Roermond_-_20291317_-_RCE.jpg (noordkant: ladder, balkon, deuren, hoogtes)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Roermond_-_20291318_-_RCE.jpg (zuidoostkant: vensters, reservoirhoogte)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Roermond_-_20291316_-_RCE.jpg (zuidkant: vensterparen)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Roermond.jpeg (westdeur en zuidkant)",
      "PDOK BAG-pand 0957100000217594, 3D BAG (AHN5), AHN DSM/DTM 0,5 m, luchtfoto 8 cm en NLGEO2018, 2026-11-01",
    ],
  },
});

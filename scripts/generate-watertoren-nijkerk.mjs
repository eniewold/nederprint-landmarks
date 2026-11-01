// Watertoren van Nijkerk (F.A. de Jongh, 1898), rijksmonument 523782, aan de
// Westkadijk bij de havenkom; reservoir van 140 m³ (Intze). Chaletstijl met
// neorenaissance-invloed: een zich verjongende bakstenen cilinder op een plint,
// door drie natuurstenen cordonbanden in vier zones verdeeld, met een deur en
// oeils-de-boeuf beneden, vensters in de middenzone en oeils-de-boeuf onder de
// bovenbouw; daarboven een omloop op houten klossen, een houten trommel met
// spleetvensters en schoren, en een breed overstekend kegeldak.
// Oorsprong op het hart van het kegeldak in het AHN (de top ligt erboven) op
// maaiveld (NAP +1,41 m), assen in RD-richting. De BAG-contour (straal 4,5 m)
// is de omloop, niet de schacht. Dakrand, dakhelling en top uit het AHN;
// breedtes uit de foto "Nijkerk Watertoren" (51 px/m, geschaald op het dak van
// 11,4 m), hoogtes van banden en vensters uit die foto en de prentbriefkaart
// van rond 1900 (RCE 20166508), die elkaar binnen 0,3 m bevestigen.
// Stand uit de foto's: deur, vensters en oculi in vier kolommen op kompasrichting
// 58 + k·90 graden (deur naar de Westkadijk), de houten uitbouw onder de omloop
// op 195 graden.
import { Manifold, CrossSection, hull, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [161374.0, 471049.9];
const AXIS = [1, 0];
const BASE = -0.3;
const deg = (bearing) => 90 - bearing; // kompasrichting -> hoek linksom vanaf RD-oost
const COLUMN = deg(58); // deur, vensters en oculi; elke 90 graden
const ANNEX = deg(195); // houten uitbouw onder de omloop
const H = {
  plinth: 0.75,
  shaftFoot: 0.95,
  band1: 4.45, // drie cordonbanden van 0,3 tot 0,45 m met een schuine onderkant
  band2: 8.75,
  band3: 13.1,
  ring: 14.95, // ring van klossen onder de omloop
  deck: 15.3, // onderkant van de omloopvloer
  deckTop: 15.8, // voet van de houten trommel
  drumTop: 20.55, // waar de trommel het dakbeschot raakt
  soffit: 20.05, // onderkant van de dakrand
  eave: 20.35,
  kick: 20.6, // het dak wordt naar de rand iets vlakker (AHN)
  apex: 24.25, // top van het kegeldak (AHN 24,18 boven maaiveld)
};
const R = { plinth: 2.75, shaftFoot: 2.6, shaftTop: 2.27, ring: 3.75, deck: 4.82, drum: 3.73, eave: 5.7, kick: 4.9 };
const shaftR = (z) => R.shaftFoot + ((z - H.shaftFoot) / (H.band3 - H.shaftFoot)) * (R.shaftTop - R.shaftFoot);

// ---------- schacht, cordonbanden, omloop, trommel en kegeldak in één omwentelingsprofiel ----------
const band = (z0, out, h) => [[shaftR(z0), z0], [shaftR(z0) + out, z0 + out * 1.5], [shaftR(z0) + out, z0 + h], [shaftR(z0 + h + 0.05), z0 + h + 0.05]];
const body = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.shaftFoot, H.shaftFoot],
    ...band(H.band1, 0.1, 0.4), ...band(H.band2, 0.1, 0.4), ...band(H.band3, 0.14, 0.45),
    [R.shaftTop, H.ring], [R.ring, H.ring], [R.ring, H.deck], [R.deck, H.deck], [R.deck, H.deckTop],
    [R.drum, H.deckTop], [R.drum, H.drumTop], [R.eave, H.soffit], [R.eave, H.eave], [R.kick, H.kick], [0, H.apex],
  ]]),
  96,
);

// Driehoekige plaat in het radiale vlak langs +X, t dik: punten [r, z].
const plate = (pts, t) => hull(pts.flatMap(([r, z]) => [[r, -t / 2, z], [r, t / 2, z]]));
// Twaalf houten klossen onder de omloop (schoor en vloerbalk als dichte driehoek), naast de oculi.
const ringBrackets = Array.from({ length: 12 }, (_, k) => place(plate([[2.15, 13.65], [2.15, H.deck + 0.05], [4.45, H.deck + 0.05]], 0.3), { deg: COLUMN + 15 + k * 30 }));
// Zestien stijlen met schoren onder het dak (stijl en schoor als dichte driehoek), tussen de spleetvensters.
const roofBrackets = Array.from({ length: 16 }, (_, k) => place(plate([[3.6, 18.1], [3.6, H.drumTop + 0.1], [5.45, 20.2]], 0.25), { deg: COLUMN + 11.25 + k * 22.5 }));
// Houten uitbouw onder de omloop, aan de schacht en de vloer. De vlakke onderkant
// op 13,05 m loopt als schuine kraag (56 graden) naar de schacht, anders zet de
// export er een steunkolom tot de tweede cordonband onder.
const annex = place(
  hull([-0.6, 0.6].flatMap((t) => [[3.35, t, 13.05], [3.35, t, H.deck + 0.05], [2.1, t, 13.05 - 1.25 * 1.48], [2.1, t, H.deck + 0.05]])),
  { deg: ANNEX },
);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Oeil-de-boeuf als spitse zeshoek (bovenkant 56 graden), w breed vanaf z0.
const oculus = (f, w, z0, depth = 0.25) => {
  const prof = [[0, z0], [-w / 2, z0 + 0.35 * w], [w / 2, z0 + 0.35 * w], [-w / 2, z0 + 0.55 * w], [w / 2, z0 + 0.55 * w], [0, z0 + 0.55 * w + 0.75 * w]];
  return hull([f - depth, f + 1.0].flatMap((x) => prof.map(([t, z]) => [x, t, z])));
};
const columns = [0, 1, 2, 3].map((k) => COLUMN + k * 90);
const cuts = [
  place(niche(shaftR(1), 1.0, 0, 2.1, 0.3), { deg: COLUMN }), // deur naar de Westkadijk
  ...columns.map((d) => place(oculus(shaftR(3.0), 0.6, 2.7), { deg: d })), // oculi in de benedenzone, ook boven de deur
  ...columns.map((d) => place(niche(shaftR(7.2), 0.9, 6.2, 8.25, 0.3), { deg: d })), // vensters in de middenzone
  ...columns.map((d) => place(oculus(shaftR(14.2), 0.6, 13.85), { deg: d })), // oculi onder de omloop
  // Spleetvensters in de trommel: zestien van 0,3 m (in het echt tweeëndertig van circa 0,15 m).
  ...Array.from({ length: 16 }, (_, k) => place(niche(R.drum, 0.3, 17.8, 19.15, 0.2), { deg: COLUMN + k * 22.5 })),
];

const tower = union([body, ...ringBrackets, ...roofBrackets, annex]).subtract(union(cuts));

// ---------- buurpand 0267100000004832 (aanbouw en paviljoen, 1998) ----------
// De 3D BAG geeft dit pand een strook tot NAP +22,3 m onder de dakrand van de
// toren (dakpunten van het kegeldak boven de BAG-contour); in het AHN is het
// 3 tot 7 m hoog. Daarom vervangen en als eenvoudig blok op AHN-hoogte: het
// oostdeel plat op 4,2 m, de vleugel naar het zuidwesten met een zadeldak
// (goot 5,0 m, nok 7,2 m) langs zijn lange as. Contour uit de BAG.
const NEIGHBOUR = [
  [13.67, 2.32], [13.12, 2.05], [13.02, 2.23], [8.58, -0.02], [8.66, -0.2], [8.11, -0.42], [5.89, -2.23], [5.8, -2.03],
  [-1.67, -5.73], [-1.51, -6.09], [-1.31, -5.96], [3.56, -15.7], [3.36, -15.79], [3.58, -16.18], [11.08, -12.36],
  [10.98, -12.15], [13.61, -10.5], [18.54, -7.97], [20.05, -4.84], [17.38, 0.52],
];
const WING = [[-1.67, -5.73], [3.58, -16.18], [11.08, -12.36], [5.85, -2.1]];
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const ridge = [mid(WING[0], WING[3]), mid(WING[1], WING[2])];
const neighbour = union([
  prism(NEIGHBOUR, BASE, 4.2),
  hull([...WING.flatMap(([x, y]) => [[x, y, BASE], [x, y, 5.0]]), ...ridge.map(([x, y]) => [x, y, 7.2])]),
]);

await writeLandmark({
  slug: "watertoren-nijkerk",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [
    ["building:schacht-omloop-trommel-en-kegeldak", tower],
    ["building:aanbouw-en-paviljoen", neighbour],
  ],
  catalog: {
    name: "Watertoren Nijkerk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[4.3, 0], [-4.3, 0], [0, 4.3], [0, -4.3]],
    replacesBuildings: ["NL.IMBAG.Pand.0267100000030958", "NL.IMBAG.Pand.0267100000004832"],
    description:
      "Oorsprong op het hart van het kegeldak in het AHN op maaiveld (NAP +1,41 m), assen in RD-richting. Verjongende bakstenen schacht van 5,2 naar 4,55 m op een plint van 5,5 m met drie cordonbanden (4,45, 8,75 en 13,1 m), deur naar het oostnoordoosten, oculi en vensters in vier kolommen; omloop van 9,6 m op 15,3 tot 15,8 m op twaalf klossen met een houten uitbouw naar het zuidzuidwesten; houten trommel van 7,5 m met zestien spleetvensters en zestien schoren onder een kegeldak van 11,4 m met de rand op 20,05 tot 20,35 m en de top op 24,25 m. Het aangrenzende pand 0267100000004832 (aanbouw en paviljoen, 1998), dat in de 3D BAG tot onder de dakrand van de toren reikt, is vervangen door een blok op de BAG-contour: plat op 4,2 m met een vleugel onder een zadeldak (goot 5,0 m, nok 7,2 m). Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 30,
      registerHeightM: 32,
      reservoirM3: 140,
      ahnGroundNapM: 1.41,
      ahnTopNapM: 25.59,
      bagContourDiameterM: 9.0,
      shaftDiameterM: [5.2, 4.55],
      plinthDiameterM: 5.5,
      galleryDiameterM: 9.64,
      drumDiameterM: 7.46,
      roofDiameterM: 11.4,
      bandsM: [4.45, 8.75, 13.1],
      galleryM: [15.3, 15.8],
      eaveM: [20.05, 20.35],
      roofPitchDeg: 36.7,
      modelTopM: 24.25,
      photoScalePxPerM: 51,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Nijkerk)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/523782",
      "https://commons.wikimedia.org/wiki/File:Nijkerk_Watertoren.jpg (bijna frontale foto, breedtes en hoogtes van de bovenbouw)",
      "https://commons.wikimedia.org/wiki/File:Aanzicht,_reproductie_van_prentbriefkaart_-_Nijkerk_-_20166508_-_RCE.jpg (hele schacht met plint, deur, oculi en vensters)",
      "https://commons.wikimedia.org/wiki/File:Alde_wettertoer_Nijkerk_7.JPG (omloop, uitbouw en stand)",
      "PDOK BAG-panden 0267100000030958 en 0267100000004832, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

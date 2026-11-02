// Watertoren aan de Wilhelminasingel in Breda (J. Schotel, 1893-1894,
// neorenaissance), rijksmonument 10345, reservoir 500 m³, sinds 1976
// kantoren. Een ronde, licht taps toelopende bakstenen schacht op een
// natuurstenen plint, met witte natuurstenen banden, een portaal met
// fronton en oculus naar het noordwesten en een groot boogvenster ernaast;
// bovenaan een boogfries op consoles waarop de twaalfzijdige bovenbouw
// overkraagt, met pilasters op de hoeken en in elk vlak een rondboognis met
// een venster; een overstekende goot, een achtzijdige leien spits met vier
// dakkapellen en vier torentjes op de hoeken.
//
// Oorsprong op het middelpunt van de BAG-contour (cirkel van 7,04 m, gelijk
// aan de top van de spits in het AHN binnen 0,3 m) op maaiveld (NAP +2,70 m).
// +X wijst naar het portaal (RD-richting 150 graden, noordwest: luchtfoto,
// het pad en de foto's); de vlakken van de twaalfhoek staan op k·30 graden
// (in RD en dus ook in het model, de zuidrand van de goot ligt op de luchtfoto
// precies oost-west). Goot- en spitshoogtes uit het AHN, breedtes uit de BAG,
// de luchtfoto en de foto "Watertoren, Wilhelminasingel, Breda P1460774"
// (van ver, 16 px/m), hoogtes van banden, fries en vensters uit die foto
// geschaald op de goot uit het AHN, vensterritme (vijf per rij, om 72
// graden) uit de foto's van 2023.
import { Manifold, CrossSection, hull, ring3, circle, union, place, box, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [113274.1, 399677.0];
const PORTAL_RD = 150; // graden: RD-richting van het portaal = model +X
const AXIS = [+Math.cos((PORTAL_RD * Math.PI) / 180).toFixed(4), +Math.sin((PORTAL_RD * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 2.7; // AHN-DTM in een ring van 8 tot 12 m (2,6 tot 2,8)
const GROUND_N = 43.9; // geoïdehoogte in Breda (zoals kasteel-van-breda: NAP +2,3 ↔ 46,2)
const rad = (d) => (d * Math.PI) / 180;
const H = {
  plinth: 1.2, // natuurstenen plint
  shaftFoot: 1.35,
  band1: 7.4, // brede geprofileerde band boven het portaal
  band1Top: 8.0,
  band2: 12.8,
  band3: 17.5,
  friezeFoot: 21.6, // onderkant van de kraag onder het boogfries
  frieze: 22.1,
  friezeTop: 24.7,
  head: 24.4, // twaalfzijdige bovenbouw
  soffit: 31.6, // schuine onderkant van de goot begint op de gevel
  fascia: 32.45,
  eave: 32.85, // bovenkant goot (AHN 32,6 tot 33,0)
  spireFoot: 33.25, // dak tussen goot en spits (AHN 33,0 tot 33,5)
  apex: 42.6, // top van de spits (AHN-helling 2,0 m per m tot r = 0)
};
const R = { plinth: 6.95, shaftFoot: 6.75, shaftTop: 6.25, frieze: 6.75, band: 0.18, thinBand: 0.12 };
const A = { head: 6.5, eave: 7.1, roofTop: 4.85, spire: 4.6, pilaster: 0.22 };
const COS15 = Math.cos(Math.PI / 12);
const shaftR = (z) => R.shaftFoot + ((R.shaftTop - R.shaftFoot) * (z - H.shaftFoot)) / (H.friezeFoot - H.shaftFoot);

// Twaalfhoek met apothema a, vlakken op k·30 graden.
const poly12 = (a) => circle([0, 0], a / COS15, 12, rad(15));
const ring12 = (a, z) => ring3(poly12(a), z);
const prism12 = (a, z0, z1) => hull([...ring12(a, z0), ...ring12(a, z1)]);
// Achthoek met apothema a, vlakken op k·45 graden.
const ring8 = (a, z, c = [0, 0]) => ring3(circle(c, a / Math.cos(Math.PI / 8), 8, rad(22.5)), z);
const revolve = (profile) => Manifold.revolve(new CrossSection([profile]), 96);

// ---------- plint en schacht ----------
const plinth = revolve([[0, BASE], [R.plinth, BASE], [R.plinth - 0.05, H.plinth], [R.shaftFoot - 0.02, H.shaftFoot + 0.05], [0, H.shaftFoot + 0.05]]);
const shaft = revolve([[0, H.plinth - 0.1], [R.shaftFoot, H.plinth - 0.1], [R.shaftTop, H.friezeFoot], [R.shaftTop, H.frieze], [0, H.frieze]]);
// Witte banden: rand op een kraag van 45 graden.
const band = (z0, z1, out) => {
  const r0 = shaftR(z0), r1 = shaftR(z1);
  return revolve([[r0 - 0.1, z0 - out - 0.02], [r0 - 0.02, z0 - out], [r0 + out, z0], [r1 + out, z1], [r1 - 0.1, z1 + 0.02]]);
};
const bands = [band(H.band1, H.band1Top, R.band), band(H.band2, H.band2 + 0.35, R.thinBand), band(H.band3, H.band3 + 0.35, R.thinBand)];

// ---------- boogfries en bovenbouw ----------
// Fries op een kraag van 45 graden van de schacht (6,25) naar 6,75.
const frieze = revolve([[0, H.friezeFoot - 0.05], [R.shaftTop, H.friezeFoot - 0.05], [R.shaftTop + 0.02, H.friezeFoot], [R.frieze, H.frieze], [R.frieze, H.friezeTop], [0, H.friezeTop]]);
const head = prism12(A.head, H.head, H.soffit + 0.05);
// Pilasters op de twaalf hoeken (0,9 m breed, 0,22 m uit de gevel), voet op een kraag van 56 graden.
const corner = A.head / COS15;
const pilaster = hull([
  [corner - 0.6, -0.45, H.friezeTop - 0.3], [R.frieze - 0.02, -0.45, H.friezeTop - 0.3], [corner - 0.6, 0.45, H.friezeTop - 0.3], [R.frieze - 0.02, 0.45, H.friezeTop - 0.3],
  [corner + A.pilaster, -0.45, H.friezeTop], [corner + A.pilaster, 0.45, H.friezeTop],
  [corner - 0.6, -0.45, H.soffit + 0.05], [corner + A.pilaster, -0.45, H.soffit + 0.05], [corner - 0.6, 0.45, H.soffit + 0.05], [corner + A.pilaster, 0.45, H.soffit + 0.05],
]);
const pilasters = Array.from({ length: 12 }, (_, k) => place(pilaster, { deg: 15 + 30 * k }));
// Goot: schuine onderkant (53 graden) van de gevel naar 7,1 m, rechte rand, dak tot de voet van de spits.
const eave = hull([...ring12(A.head, H.soffit), ...ring12(A.eave, H.fascia), ...ring12(A.eave, H.eave), ...ring12(A.roofTop, H.spireFoot)]);
// Achtzijdige spits (64 graden) met de vlakken op k·45 graden.
const spire = hull([...ring8(A.spire, H.spireFoot - 0.3), [0, 0, H.apex]]);

// ---------- dakkapellen en torentjes op het dak ----------
// Dakkapel met zadeldak (45 graden) op de vlakken 0, 90, 180 en 270 graden.
const dormer = union([
  box(3.0, -0.85, H.eave - 0.2, 5.6, 0.85, 35.0),
  hull([[3.0, -0.85, 35.0], [5.6, -0.85, 35.0], [3.0, 0.85, 35.0], [5.6, 0.85, 35.0], [3.0, 0, 35.85], [5.6, 0, 35.85]]),
]);
// Torentje op de hoeken 45, 135, 225 en 315 graden: achtkant van 1,0 m met een spitsje.
const turret = union([hull([...ring8(0.5, H.eave - 0.2, [6.0, 0]), ...ring8(0.5, 34.6, [6.0, 0])]), hull([...ring8(0.5, 34.6, [6.0, 0]), [6.0, 0, 36.2]])]);
const roofParts = [...[0, 90, 180, 270].map((deg) => place(dormer, { deg })), ...[45, 135, 225, 315].map((deg) => place(turret, { deg }))];

// ---------- portaal naar +X ----------
const portal = union([
  box(6.3, -1.75, BASE, 7.6, 1.75, 4.45),
  // Kroonlijst op een kraag van 60 graden.
  hull([[6.3, -1.75, 4.4], [7.6, -1.75, 4.4], [6.3, 1.75, 4.4], [7.6, 1.75, 4.4], [6.3, -1.95, 4.75], [7.8, -1.95, 4.75], [6.3, 1.95, 4.75], [7.8, 1.95, 4.75], [6.3, -1.95, 4.95], [7.8, -1.95, 4.95], [6.3, 1.95, 4.95], [7.8, 1.95, 4.95]]),
  // Opzetstuk met voluten (schuine wangen) en fronton.
  box(6.3, -1.3, 4.9, 7.45, 1.3, 5.75),
  hull([[6.3, -1.9, 4.9], [7.45, -1.9, 4.9], [6.3, 1.9, 4.9], [7.45, 1.9, 4.9], [6.3, -1.3, 5.75], [7.45, -1.3, 5.75], [6.3, 1.3, 5.75], [7.45, 1.3, 5.75]]),
  hull([[6.3, -1.45, 5.7], [7.55, -1.45, 5.7], [6.3, 1.45, 5.7], [7.55, 1.45, 5.7], [6.3, 0, 6.5], [7.55, 0, 6.5]]),
  // Pinakel op de top.
  hull([[6.55, -0.45, 6.0], [7.45, -0.45, 6.0], [6.55, 0.45, 6.0], [7.45, 0.45, 6.0], [7.0, 0, 7.4]]),
  // Stoep van twee treden.
  box(7.5, -1.9, BASE, 8.6, 1.9, 0.15),
  box(7.5, -1.7, BASE, 8.1, 1.7, 0.3),
]);

// ---------- nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Rondboognis: rechthoek tot zs met een halve cirkel erop; het plafond loopt naar binnen onder 56 graden op.
const archNiche = (f, w, z0, zs, depth, out = 0.6) => {
  const arc = Array.from({ length: 9 }, (_, i) => [Math.cos((Math.PI * i) / 8) * (w / 2), zs + Math.sin((Math.PI * i) / 8) * (w / 2)]);
  return hull([
    ...[[-w / 2, z0], [w / 2, z0], ...arc].map(([y, z]) => [f - depth, y, z === z0 ? z : z + 1.5 * depth]),
    ...[[-w / 2, z0], [w / 2, z0], ...arc].map(([y, z]) => [f, y, z]),
    [f + out, -w / 2, z0], [f + out, w / 2, z0], [f + out, -w / 2, zs - out], [f + out, w / 2, zs - out],
  ]);
};
// Spitsboog tussen de consoles van het fries.
const friezeArch = (f, w, z0, z1, depth) => hull([[f - depth, -w / 2, z0], [f + 0.6, -w / 2, z0], [f - depth, w / 2, z0], [f + 0.6, w / 2, z0], [f - depth, -w / 2, z1 - 0.35], [f - depth, w / 2, z1 - 0.35], [f, -w / 2, z1 - 0.8], [f, w / 2, z1 - 0.8], [f - depth, 0, z1], [f, 0, z1 - 0.45]]);

const shaftWin = (deg, w, z0, z1) => place(niche(shaftR(z1), w, z0, z1, 0.3), { deg });
const cuts = [
  // Deur en oculus in het portaal.
  niche(7.6, 1.6, 0.3, 3.0, 0.4),
  niche(7.45, 0.9, 5.0, 5.5, 0.2),
  // Groot boogvenster naast het portaal, onder het dubbele venster op -72 graden (RD 78, noordnoordoost).
  place(archNiche(R.shaftFoot - 0.03, 2.4, H.plinth + 0.05, 4.1, 0.35), { deg: -72 }),
  // Vijf vensters per rij, om 72 graden: dubbel boven het portaal, enkel, enkel.
  ...[0, 1, 2, 3, 4].map((k) => shaftWin(72 * k, 1.6, 9.3, 11.0)),
  ...[0, 1, 2, 3, 4].map((k) => shaftWin(36 + 72 * k, 0.9, 14.2, 15.9)),
  ...[0, 1, 2, 3, 4].map((k) => shaftWin(72 * k, 0.9, 19.0, 20.7)),
  // Twintig spitsbogen tussen de consoles van het fries (consoles 0,9 m).
  ...Array.from({ length: 20 }, (_, k) => place(friezeArch(R.frieze, 1.15, H.friezeFoot - 0.3, 23.9, 0.3), { deg: 9 + 18 * k })),
  // Per vlak van de bovenbouw een rondboognis tussen de pilasters met een venster.
  ...Array.from({ length: 12 }, (_, k) => place(archNiche(A.head, 2.6, 26.2, 29.5, 0.15), { deg: 30 * k })),
  ...Array.from({ length: 12 }, (_, k) => place(niche(A.head - 0.15, 0.9, 26.8, 29.4, 0.25), { deg: 30 * k })),
  // Venster in elke dakkapel.
  ...[0, 90, 180, 270].map((deg) => place(niche(5.6, 0.9, 33.4, 34.6, 0.2), { deg })),
];

const tower = union([plinth, shaft, ...bands, frieze, head, ...pilasters, eave, spire, ...roofParts, portal])
  .subtract(union(cuts))
  .trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-breda-wilhelminasingel",
  base: BASE,
  // Eén node: de export vult elke node apart op; een losse bovenbouw zou een voet tot de grondplaat krijgen.
  nodes: [["building:schacht-boogfries-bovenbouw-en-spits", tower]],
  catalog: {
    name: "Watertoren Wilhelminasingel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch maaiveld: NAP +2,70 m plus circa 43,9 m geoïdehoogte in Breda.
    groundHeight: +(GROUND_NAP + GROUND_N).toFixed(2),
    groundSamplePoints: [[6.4, 6.4], [-6.4, 6.4], [-6.4, -6.4], [6.4, -6.4]], // 9 m uit het hart, naast het portaal
    replacesBuildings: ["NL.IMBAG.Pand.0758100000065355"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +2,70 m), +X naar het portaal (RD-richting 150 graden, noordwest). Ronde schacht van 13,5 m op een natuurstenen plint, taps tot 12,5 m onder het fries, met drie witte banden, een portaal met fronton en pinakel, een groot boogvenster en drie rijen van vijf vensters; boogfries op twintig consoles van 21,6 tot 24,7 m; twaalfzijdige bovenbouw van 13 m over de vlakken met pilasters en per vlak een rondboognis met venster; goot van 14,2 m op 32,85 m op een schuine onderkant; achtzijdige spits tot 42,6 m met vier dakkapellen en vier hoektorentjes. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      built: "1893-1894",
      architect: "J. Schotel",
      publishedHeightM: 42,
      reservoirM3: 500,
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 35.6,
      ahnSpireAt1mNapM: 43.75,
      geoidM: GROUND_N,
      plinthDiameterM: 2 * R.plinth,
      shaftFootDiameterM: 2 * R.shaftFoot,
      shaftTopDiameterM: 2 * R.shaftTop,
      friezeDiameterM: 2 * R.frieze,
      headAcrossFlatsM: 2 * A.head,
      eaveAcrossFlatsM: 2 * A.eave,
      friezeM: [H.friezeFoot, H.friezeTop],
      eaveM: H.eave,
      modelTopM: H.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Breda_Wilhelminasingel)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/10345",
      "https://commons.wikimedia.org/wiki/File:Watertoren,_Wilhelminasingel,_Breda_P1460774.jpg (van ver: breedtes en hoogtes van banden, fries, bovenbouw en spits)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Wilhelminasingel_Breda_20230823_-_1.png (portaal, vensterrijen boven het portaal, bovenbouw)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Wilhelminasingel_Breda_20230823_-_3.png (boogvenster naast het portaal, dakkapel en torentje)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Wilhelminasingel_Breda_20230823_-_2.png (consoles, pilasters, spits met dakkapellen)",
      "PDOK BAG-pand 0758100000065355, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
    ],
  },
});

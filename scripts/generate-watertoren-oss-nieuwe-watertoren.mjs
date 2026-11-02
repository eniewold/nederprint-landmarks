// Nieuwe watertoren (Organon) in Oss, op het fabrieksterrein van Organon/MSD
// aan de Molenstraat (110): 1951, ontwerp J.A.G. van der Steur jr. en
// jhr. A.P. Wesselman van Helmond, 34,52 m hoog met een betonnen
// vlakbodemreservoir van 85 m³, voor koeling, brandbestrijding en het eigen
// waterleidingnet van de fabriek. Geen monument. Een strakke naoorlogs-
// modernistische witte toren: een ronde betonnen schacht met rijen smalle
// verticale vensters, daarboven een bredere glazen trommel van vier bouwlagen
// rond het reservoir (het "glazen trappenhuis aan de buitenkant bovenaan"),
// met groene banden op elke verdieping, een plat dak en sinds de renovatie
// (2009) een lagere groene ronde opbouw met een voetrand in het midden.
//
// Oorsprong op het zwaartepunt van de BAG-contour (pand 0828100001591002,
// 35,1 m², een 47-hoek met straal 3,26 tot 3,42: de trommel) op maaiveld
// (AHN-DTM NAP +8,3 m; 3D BAG 8,26). De toren is rond; lokale +X is RD-oost.
// Hoogtes uit het AHN-DSM 0,5 m en de 3D BAG (AHN5, 2024): dak van de
// trommel NAP +42,9 tot +43,1 (34,7 m, Wikipedia 34,52 m), rand van de
// opbouw NAP +44,3 tot +44,8 (36,3 m) op 1,5 tot 2 m uit het hart, met
// daarbinnen een verdiept dak op NAP +43,3 tot +43,4. Breedtes en de
// verdeling in de hoogte uit twee frontale foto's: de foto van O. Brinkkemper
// (RCE, 2017) op watertorens.eu (17,9 px/m, geschaald op de trommel = BAG)
// en de ansichtkaart "Oss, N.V. Organon" (1951, 20,9 px/m, de hele toren
// van maaiveld tot dak = 34,7 m): schacht 4,5 m, trommel 10,0 m hoog vanaf
// 24,65 m, opbouw 4,0 m breed en 1,56 m hoog; de vensterrijen.
import { hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [165214.19, 419373.86];
const BASE = -0.3;
const GROUND_NAP = 8.3; // AHN-DTM in een ring van 4 tot 8 m (8,21 tot 8,46)
const GEOID_N = 43.66; // NLGEO2018-geoïdehoogte op de oorsprong

const R = {
  shaft: 2.25, // betonnen schacht (foto's: 4,47 en 4,6 m)
  band: 3.38, // groene verdiepingsbanden (BAG-contour 3,26 tot 3,42)
  glass: 3.15, // apothema van de zestienzijdige glazen gevel tussen de banden
  flange: 2.3, // voetrand van de opbouw
  cap: 2.0, // groene opbouw (foto: 4,0 m)
  well: 1.1, // verdiept dak binnen de rand van de opbouw (DSM: laag tot 1,25-1,5 m uit het hart)
};
const H = {
  drumFoot: 24.65, // onderkant trommel (foto's: 24,6 en 24,65)
  bottomBandTop: 25.2,
  storey: 2.4, // verdiepingshoogte van de trommel (foto: 43 px)
  band: 0.35, // dikte van de tussenbanden
  roof: 34.7, // dak van de trommel (AHN NAP +43,0; Wikipedia 34,52)
  topBand: 0.4,
  flangeTop: 34.95,
  capTop: 36.3, // rand van de opbouw (AHN NAP +44,3 tot +44,8)
  well: 35.05, // verdiept dak (AHN NAP +43,3 tot +43,4)
};
// Vensterrijen in de schacht (foto's): smalle verticale vensters, twaalf rondom.
const SLIT_ROWS = [[7.9, 9.8], [15.5, 17.4], [22.5, 24.1]];
const SLIT_W = 0.4, SLIT_N = 12, SLIT_PHASE = 15;

const cyl = (r, z0, z1, n = 64, phase = 0) => hull([...ring3(circle([0, 0], r, n, phase), z0), ...ring3(circle([0, 0], r, n, phase), z1)]);
const poly16 = (a, z0, z1) => cyl(a / Math.cos(Math.PI / 16), z0, z1, 16, Math.PI / 16);

// ---------- schacht met vensternissen ----------
const shaft = cyl(R.shaft, BASE, H.drumFoot + 0.05);
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = -w / 2, y1 = w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
// De schacht is rond: de nis begint op het koordvlak van de vensterbreedte.
const fSlit = Math.sqrt(R.shaft ** 2 - (SLIT_W / 2) ** 2);
const slits = SLIT_ROWS.flatMap(([z0, z1]) =>
  Array.from({ length: SLIT_N }, (_, k) => place(niche(fSlit, SLIT_W, z0, z1), { deg: SLIT_PHASE + (360 / SLIT_N) * k })),
);

// ---------- glazen trommel met groene banden ----------
const bandLevels = [1, 2, 3].map((k) => H.drumFoot + k * H.storey + 0.05); // middens 27,1 / 29,5 / 31,9 (foto)
const drum = union([
  poly16(R.glass, H.drumFoot, H.roof),
  cyl(R.band, H.drumFoot, H.bottomBandTop),
  ...bandLevels.map((z) => cyl(R.band, z - H.band / 2, z + H.band / 2)),
  cyl(R.band, H.roof - H.topBand, H.roof),
]);

// ---------- groene opbouw op het dak ----------
const cap = union([
  cyl(R.flange, H.roof - 0.05, H.flangeTop),
  cyl(R.cap, H.flangeTop - 0.05, H.capTop),
]).subtract(cyl(R.well, H.well, H.capTop + 1));

const all = union([shaft, drum, cap]).subtract(union(slits));

await writeLandmark({
  slug: "watertoren-oss-nieuwe-watertoren",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-glazen-trommel-en-opbouw", all]],
  catalog: {
    name: "Nieuwe watertoren Oss",
    origin: ORIGIN,
    xAxis: [1, 0],
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5, 0], [-5, 0], [0, 5], [0, -5]],
    // Ellipsoïdisch: NAP +8,3 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0828100001591002"],
    description:
      "Oorsprong op het zwaartepunt van de BAG-contour op maaiveld (NAP +8,3 m), +X naar RD-oost (de toren is rond). Ronde betonnen schacht van 4,5 m met drie rijen van twaalf smalle vensters als nissen, daarboven vanaf 24,65 m een glazen trommel van 6,8 m breed en vier bouwlagen (zestienzijdige glasgevel met groene banden per verdieping) tot het platte dak op 34,7 m, met in het midden een groene ronde opbouw van 4,0 m met voetrand en verdiept dak tot 36,3 m. Maten uit BAG, AHN, 3D BAG en foto's.",
    realWorld: {
      publishedHeightM: 34.52,
      reservoirM3: 85,
      built: 1951,
      architect: "J.A.G. van der Steur jr. en jhr. A.P. Wesselman van Helmond",
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: [42.9, 43.1],
      ahnCapRimNapM: [44.3, 44.8],
      ahnCapWellNapM: [43.3, 43.4],
      geoidNlgeo2018M: GEOID_N,
      shaftDiameterM: R.shaft * 2,
      drumDiameterM: R.band * 2,
      drumM: [H.drumFoot, H.roof],
      storeyM: H.storey,
      capDiameterM: R.cap * 2,
      capTopM: H.capTop,
      slitRowsM: SLIT_ROWS,
      photoScalePxPerM: [17.9, 20.9],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Oss) (1951, J.A.G. van der Steur en jhr. A.P. Wesselman van Helmond, 34,52 m, 85 m³)",
      "https://watertorens.eu/torens/Oss/Organon/fotoos.html (Molenstraat 110, betonnen vlakbodem, glazen trappenhuis bovenaan, renovatie 2009; foto O. Brinkkemper, RCE 2017: trommel, banden, opbouw, vensters onder de trommel)",
      "https://www.trefhetinoss.nl/locaties/3632373061/watertoren-organon (ansichtkaart 'Oss, N.V. Organon', circa 1951: de hele toren, vensterrijen in de schacht)",
      "PDOK BAG-pand 0828100001591002, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "3D BAG (LoD2.2, AHN5 2024) van pand 0828100001591002: maaiveld 8,26, dak 42,87 tot 43,55 (NAP)",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,66 m) voor groundHeight",
    ],
  },
});

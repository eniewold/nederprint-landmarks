// Watertoren van het Missiehuis St. Michaël in Steyl (Tegelen), ontworpen door
// pater P.M. Scholl SVD en gebouwd in 1909-1910 (BAG-bouwjaar 1909, register
// 1910), rijksmonument 528364. Hij staat op een zandheuvel in het oostelijke
// deel van de kloostertuin en voorziet de drie kloosters nog steeds van
// drinkwater. Gemetseld als een Tegelse fabrieksschoorsteen: een ronde,
// naar boven smaller wordende bakstenen schacht met een omlopende waterlijst
// halverwege, smalle segmentboogvensters per verdieping en een deur met een
// segmentboog. Daarop een grijs gepleisterde kop (ijzervakwerk met steengaas en
// stucwerk) om de stalen ketel, die met een holle kraag uitkraagt, vier
// raampjes op de windrichtingen heeft en een plat dak met een lage rand, een hek en
// een getuid opengewerkt kruis (sinds 1999).
//
// Oorsprong op het hart van de kop: het midden tussen de cirkel door de
// BAG-contour van pand 0983100000000104 (r 3,2 m) en de cirkel door de rand
// van de kop in het AHN-DSM (afwijking ≤ 0,2 m), op het maaiveld (AHN-DTM
// NAP +29,45 m rond de voet). Assen in RD-richting: de toren is rond, alleen
// deur en vensters hebben een stand.
//
// Hoogtes en doorsneden uit de maattekening op het informatiebord bij de
// toren (Commons "Watertoren met uitleg werking 2024": voet Ø 5,11, schacht
// boven Ø 4,36, kop Ø 6,20, dakrand Ø 6,42), verticaal geschaald op het
// AHN-dak (NAP +60,3 = 30,85 m, 21,65 px/m; 3D BAG AHN5: mediaan +60,31, max +60,56);
// de waterlijst, de band onder de kraag en de vensters ook op de foto's
// "Tegelen Steyl Watertoren 5893" en RCE 20321110.
import { Manifold, CrossSection, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [206300.4, 372105.25];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  plinth: 0.6, // bovenkant van de gemetselde voet
  band: 22.6, // band onder de kraag (onderkant)
  flare: 22.95, // voet van de holle kraag
  head: 24.5, // onderkant van de cilindrische kop
  cornice: 30.3, // begin van de dakrand
  roof: 30.85, // plat dak, NAP +60,3
  parapet: 31.1, // lage dakrand om het platte dak, NAP +60,55 (3D BAG-maximum)
};
const R = { plinth: 2.65, foot: 2.555, top: 2.18, head: 3.1, cornice: 3.21, parapetIn: 2.85 };
const shaftR = (z) => R.foot + ((R.top - R.foot) * z) / H.flare;
const SLOPE = Math.tan((55 * Math.PI) / 180); // onderkanten van banden en lijsten onder 55 graden

// ---------- schacht, kraag en kop als één omwentelingsprofiel ----------
// Van onder naar boven: voet, taps toelopende schacht met de waterlijst (twee banden) halverwege,
// band onder de kraag, holle kraag (kwart-ellips, onderaan verticaal, bovenaan vlak), kop, dakrand
// en een lage dakrand met een schuin binnenvlak (55 graden) naar het platte dak.
const band = (z0, z1, out) => {
  const r0 = shaftR(z0 - out * SLOPE), r1 = shaftR(z1);
  return [[r0, z0 - out * SLOPE], [shaftR(z0) + out, z0], [r1 + out, z1], [r1, z1]];
};
const flare = Array.from({ length: 12 }, (_, k) => {
  const t = ((k + 1) / 12) * (Math.PI / 2);
  return [R.head - (R.head - shaftR(H.flare)) * Math.cos(t), H.flare + (H.head - H.flare) * Math.sin(t)];
});
const parapetFoot = R.parapetIn - (H.parapet - H.roof) / SLOPE;
const plinthTop = H.plinth + (R.plinth - shaftR(H.plinth)) * SLOPE; // afzaat onder 55 graden terug naar de schacht
const profile = [
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [shaftR(plinthTop), plinthTop],
  ...band(15.9, 16.25, 0.12), // waterlijst: brede onderste band
  ...band(16.45, 16.65, 0.08), // en een smalle band erboven
  ...band(H.band, H.flare, 0.1),
  ...flare,
  [R.head, H.cornice], [R.cornice, H.cornice + (R.cornice - R.head) * SLOPE], [R.cornice, H.parapet],
  [R.parapetIn, H.parapet], [parapetFoot, H.roof], [0, H.roof],
];
const body = Manifold.revolve(new CrossSection([profile]), 128);

// ---------- deur en vensters ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Kompasrichting (graden vanaf het noorden, rechtsom) naar de draaihoek van place() (linksom vanaf oost).
const at = (bearing, f, w, z0, z1, depth) => place(niche(f, w, z0, z1, depth), { deg: 90 - bearing });
const shaftWindow = (bearing, z0, z1) => at(bearing, shaftR((z0 + z1) / 2) + 0.05, 0.7, z0, z1, 0.3);
const cuts = [
  // Deur met segmentboog naar het westen, naar het klooster (geschat).
  at(270, R.plinth, 1.1, 0, 2.3, 0.35),
  // Twee smalle vensters per verdieping, tegenover elkaar; de middelste verdieping een kwartslag gedraaid (trap).
  ...[90, 270].map((b) => shaftWindow(b, 4.6, 6.2)),
  ...[0, 180].map((b) => shaftWindow(b, 11.4, 13.0)),
  ...[90, 270].map((b) => shaftWindow(b, 19.4, 21.0)),
  // Vier raampjes in de kop, op elke windrichting één.
  ...[0, 90, 180, 270].map((b) => at(b, R.head, 0.7, 26.7, 27.7, 0.25)),
];

await writeLandmark({
  slug: "watertoren-tegelen-1908",
  base: BASE,
  // Eén node: de export vult elke node apart op; een losse kop zou een eigen voet tot de grondplaat krijgen.
  nodes: [["building:schacht-kraag-en-kop", body.subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Steyl",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch: NAP 29,45 + 44,71 (NLGEO2018-geoïde op de oorsprong).
    groundHeight: 74.16,
    // Op 4,2 m (voet r 2,65 + 1,5) in de vier windrichtingen, op de zandheuvel (DTM NAP +29,4 tot +29,5).
    groundSamplePoints: [[4.2, 0], [-4.2, 0], [0, 4.2], [0, -4.2]],
    replacesBuildings: ["NL.IMBAG.Pand.0983100000000104"],
    description:
      "Oorsprong op het hart van de kop (BAG en AHN) op maaiveld (NAP +29,45 m), assen in RD-richting. Ronde, taps toelopende bakstenen schacht van 5,11 m aan de voet tot 4,36 m op 23 m, met een gemetselde voet van 5,3 m, een waterlijst van twee banden op 16 m, een band onder de holle kraag, een deur op het westen en twee smalle vensters per verdieping; gepleisterde kop van 6,2 m van 24,5 tot 30,85 m met vier raampjes, dakrand van 6,42 m met een lage rand tot 31,1 m om het platte dak. Maten uit de maattekening bij de toren, BAG, AHN en foto's.",
    realWorld: {
      built: "1909-1910",
      architect: "P.M. Scholl SVD",
      rijksmonument: 528364,
      ahnGroundNapM: 29.45,
      roofNapM: 60.3,
      roofRimNapM: 60.55,
      geoidNlgeo2018M: 44.71,
      footDiameterM: 5.11,
      shaftTopDiameterM: 4.36,
      headDiameterM: 6.2,
      corniceDiameterM: 6.42,
      waterCourseM: [15.9, 16.65],
      flareM: [22.95, 24.5],
      roofM: 30.85,
      modelTopM: 31.1,
      drawingScalePxPerM: 21.65,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Steyl)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/528364 (taps toelopend op ronde voet, waterlijst halverwege, segmentboogdeur en -vensters, uitkragend reservoir met plat dak, getuid kruis)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_met_uitleg_werking_2024.jpg (maattekening op het informatiebord: doorsneden en hoogteverhoudingen)",
      "https://commons.wikimedia.org/wiki/File:Tegelen_Steyl_Watertoren_5893.JPG (kop, kraag, banden, vensters)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_watertoren_Missiehuis_-_Steijl_-_20321110_-_RCE.jpg (deur, waterlijst, verhoudingen)",
      "PDOK BAG-pand 0983100000000104, AHN DSM/DTM 0,5 m, luchtfoto 8 cm en NLGEO2018, 2026-11-01",
    ],
  },
});

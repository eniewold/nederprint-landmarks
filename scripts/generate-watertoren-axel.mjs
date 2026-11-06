// Watertoren van Axel (Kinderdijk 2), gebouwd in 1936 naar ontwerp van C. van Eck; volgens Wikipedia 60,6 m hoog, met drie
// reservoirs (Wikipedia: 500, 500 en 300 m³; het register: een onderste van circa 300 m³ met een vlakke betonnen afdekking
// en een bovenste van circa 1000 m³ onder de koepel), rijksmonument 508104. Een twaalfzijdige schacht van donkerrode
// baksteen met vier brede risalieten op de hoofdassen (elk met een kolom van twaalf vensters), pilasters langs de
// risalieten en op de hoeken daartussen, een witte betonnen band met trapsgewijs uitstekende pilasterkoppen, daarboven de
// iets bredere twaalfzijdige reservoirommanteling met kleine vensters, een ingesprongen fries, een ronde witte goot en een
// koperen koepel met een vierzijdige lantaarn. Op de goot staat aan de westkant een klein hok.
//
// Oorsprong op het hart van de twaalfhoek uit BAG-pand 0715100000000842 (kleinste kwadraten op de acht schuine zijden,
// apothema 7,41 m, restfout ≤ 0,19 m) op het maaiveld: AHN-DTM NAP +1,57 (verhard plateau van 7 tot 9 m rond de toren;
// daarbuiten zakt het terrein naar NAP 0). +X langs de BAG-zijden op RD 10,7 graden (alle as-evenwijdige zijden van de BAG).
// Maten: schacht, risalieten en hoofdas uit de BAG. Uit het AHN-DSM 0,5 m (rond het koepelhart, dat 0,3 m naast het hart van
// de twaalfhoek ligt): lantaarn NAP +61,97 (60,4 m), koepelprofiel per halve meter van 2 m (58,07 m) tot 6,5 m (52,67 m) van
// het hart, goot op 51,15 m tot 7,75 à 8 m van het hart (luchtfoto: rond, middellijn 15,6 m). De hoogte van de band (40,7 m),
// de top van de ommanteling (49,7 m), het fries en de vensters uit de foto "Axel Watertoren 4843.JPG" (Commons, 2006, frontaal
// op een risaliet), geschaald met de twaalf vensters van de vensterkolom (2,93 m per verdieping, aangenomen gelijk) op de
// AHN-hoogte van de goot. De keuze van de vlakken met vensters op de niet-zichtbare kanten, de deur in het zuiden en het hok
// op de goot zijn geschat.
// Printbaar op 1:1000: band, goot en lantaarnkap met een onderkant van 50 graden; vensters als blinde nissen met een plafond
// van 63 graden; pilasters en hok minstens 0,9 m.
import { Manifold, CrossSection, ccw, hull, union, prism, place, rect, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [51850.48, 364317.38];
const DEG = 10.7;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 1.57;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: oost (9,5, 0) 46,18, west 46,03,
// noord 45,99, zuid (0, -9,5) 45,95, noordoost 46,07, noordwest 45,98, zuidoost 46,04, zuidwest 45,97. Het PDOK-pand staat
// op 44,97 (onder het plateau).
const GROUND_ELLIPSOID = 45.945;

const rad = (deg) => (deg * Math.PI) / 180;
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const T50 = Math.tan(rad(50));

// ---------- maten ----------
const A = 7.41; // apothema van de twaalfzijdige schacht (BAG)
const RISALIT = { 0: 8.15, 90: 7.6, 180: 8.35, 270: 8.6 }; // voorkant van de risalieten per richting (BAG; zuid het diepst)
const RIS_HALF = 2.8; // halve breedte van een risaliet (BAG 5,3 tot 6,1 m)
const H = {
  foot: 4.4, // pilastervoeten met een schuine kop tot 4,7 m (foto)
  band: [40.7, 41.3], // band: onderkant van de voorkant (schuine onderkant daaronder), bovenkant
  pilasterTop: 42.0, // koppen van de pilasters langs de risalieten boven de band
  casing: 49.7, // top van de ommanteling
  frieze: 50.45, // ingesprongen fries tot de onderkant van de goot
  gutter: [51.0, 51.15], // goot: voorkant, bovenkant (AHN)
  lantern: [58.55, 59.9, 60.05, 60.4], // lantaarn: voet, kap, overstek, top (AHN NAP +61,97)
};
const R = {
  casing: 7.5, // apothema van de ommanteling ("iets breder dan de schacht")
  frieze: 7.35,
  gutter: 7.85, // luchtfoto 7,8 m, AHN tot 7,75 à 8 m
  dome: 7.25,
};
// Koepelprofiel (straal, hoogte boven maaiveld): AHN-DSM, mediaan per ring van 0,5 m; onder de lantaarn doorgetrokken.
const DOME = [[7.25, H.gutter[1]], [7.0, 51.9], [6.5, 52.67], [6.0, 53.48], [5.5, 54.22], [5.0, 54.99], [4.5, 55.6], [4.0, 56.21],
  [3.5, 56.75], [3.0, 57.22], [2.5, 57.68], [2.0, 58.07], [1.5, 58.4], [1.0, 58.65], [0, 58.85]];

// Twaalfhoek met apothema a, vlakken op 0, 30, ... graden.
const dodec = (a) => Array.from({ length: 12 }, (_, k) => [(a / Math.cos(rad(15))) * Math.cos(rad(15 + 30 * k)), (a / Math.cos(rad(15))) * Math.sin(rad(15 + 30 * k))]);
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const AXES = [0, 90, 180, 270];

// ---------- schacht ----------
// Twaalfhoek, vier risalieten op de hoofdassen, pilasters langs de risalieten (0,9 m breed, 0,3 m voor de risaliet) met een
// bredere voet, en een pilaster op de hoek tussen de twee schuine zijden van elk kwadrant.
const shaftCore = prism(dodec(A), BASE, H.band[0]);
const risalit = (deg) => place(prism(rect(A - 0.6, -RIS_HALF, RISALIT[deg], RIS_HALF), BASE, H.band[0]), { deg });
const pilaster = (deg, side) => {
  const f = RISALIT[deg], s = side * RIS_HALF;
  const shaft = prism(rect(6.5, s - 0.45, f + 0.3, s + 0.45), BASE, H.pilasterTop);
  const foot = hull([
    ...ring(rect(6.5, s - 0.7, f + 0.5, s + 0.7), BASE), ...ring(rect(6.5, s - 0.7, f + 0.5, s + 0.7), H.foot),
    ...ring(rect(6.5, s - 0.45, f + 0.3, s + 0.45), H.foot + 0.3),
  ]);
  return place(union([shaft, foot]), { deg });
};
const cornerPilaster = (deg) => place(prism(rect(7.0, -0.45, A / Math.cos(rad(15)) + 0.2, 0.45), BASE, H.band[0]), { deg });
const shaft = union([
  shaftCore,
  ...AXES.map(risalit),
  ...AXES.flatMap((deg) => [pilaster(deg, -1), pilaster(deg, 1)]),
  ...[45, 135, 225, 315].map(cornerPilaster),
]);

// ---------- band ----------
// Witte betonband van 0,6 m die 0,3 m voor de schacht en de risalieten uitsteekt, met een onderkant van 50 graden.
const OUT = 0.3, DROP = OUT * T50;
const band = union([
  hull([...ring(dodec(A), H.band[0] - DROP), ...ring(dodec(A + OUT), H.band[0]), ...ring(dodec(A + OUT), H.band[1])]),
  ...AXES.map((deg) => place(hull([
    ...ring(rect(A - 0.6, -RIS_HALF, RISALIT[deg], RIS_HALF), H.band[0] - DROP),
    ...ring(rect(A - 0.6, -RIS_HALF - OUT, RISALIT[deg] + OUT, RIS_HALF + OUT), H.band[0]),
    ...ring(rect(A - 0.6, -RIS_HALF - OUT, RISALIT[deg] + OUT, RIS_HALF + OUT), H.band[1]),
  ]), { deg })),
]);

// ---------- ommanteling, fries, goot, koepel en lantaarn ----------
const casing = prism(dodec(R.casing), H.band[1] - 0.1, H.casing);
const top = rev([
  [0, H.casing - 0.1], [R.frieze, H.casing - 0.1], [R.frieze, H.frieze], [R.gutter, H.frieze + (R.gutter - R.frieze) * T50],
  [R.gutter, H.gutter[1]], ...DOME,
]);
const lantern = union([
  prism(rect(-1, -1, 1, 1), 58.2, H.lantern[1]),
  hull([...ring(rect(-1, -1, 1, 1), H.lantern[1]), ...ring(rect(-1.12, -1.12, 1.12, 1.12), H.lantern[1] + 0.12 * T50),
    ...ring(rect(-1.12, -1.12, 1.12, 1.12), H.lantern[2] + 0.05), ...ring(rect(-0.45, -0.45, 0.45, 0.45), H.lantern[3])]),
]);
// Hok op de goot aan de westkant (RD 270 graden = lokaal 169,3 graden): 1,6 × 2,2 m, 1,45 m hoog (foto; AHN +0,6 m).
const hut = place(prism(rect(6.2, -1.1, 7.75, 1.1), H.gutter[1] - 0.05, H.gutter[1] + 1.45), { deg: 180 - DEG });

// ---------- vensters en deur ----------
// Nis in het vlak met normaal +X op afstand f (s langs het vlak), plafond 63 graden naar binnen.
const niche = (f, s, w, z0, z1, depth = 0.3) => hull([
  [f - depth, s - w / 2, z0], [f + 0.6, s - w / 2, z0], [f - depth, s + w / 2, z0], [f + 0.6, s + w / 2, z0],
  [f - depth, s - w / 2, z1 + 2 * depth], [f - depth, s + w / 2, z1 + 2 * depth], [f, s - w / 2, z1], [f, s + w / 2, z1],
  [f + 0.6, s - w / 2, z1 - 1.2], [f + 0.6, s + w / 2, z1 - 1.2],
]);
// Vensterkolom op elke risaliet: twaalf vensters van 0,9 × 1,6 m, om de 2,93 m (foto), het bovenste 4 m onder de band.
const WINDOWS = Array.from({ length: 12 }, (_, k) => 36.7 - 2.93 * k);
const windowColumn = (deg) => place(union(WINDOWS.filter((z) => deg !== 270 || z > 4).map((z) => niche(RISALIT[deg], 0, 0.9, z - 0.8, z + 0.8))), { deg });
// Groep van drie vensters onder de band op elke schuine zijde van de schacht (als één nis van 1,6 × 0,9 m tussen de pilasters).
const underBand = union([30, 60, 120, 150, 210, 240, 300, 330].map((deg) => place(niche(A, (deg % 90 === 30 ? 1 : -1) * 0.5, 1.6, 38.9, 39.8), { deg })));
// Drie kleine vensters boven elkaar in de ommanteling op vier zijden (foto: om en om).
const casingWindows = union([60, 150, 240, 330].map((deg) => place(union([42.9, 45.2, 47.2].map((z) => niche(R.casing, 0, 0.9, z - 0.5, z + 0.5))), { deg })));
// Deur in de zuidelijke risaliet, 1,6 × 2,7 m.
const door = place(niche(RISALIT[270], 0, 1.6, 0, 2.7, 0.4), { deg: 270 });

const all = union([shaft, band, casing, top, lantern, hut]).subtract(union([...AXES.map(windowColumn), underBand, casingWindows, door]));

await writeLandmark({
  slug: "watertoren-axel",
  base: BASE,
  nodes: [["building:watertoren-schacht-band-ommanteling-koepel-en-lantaarn", all]],
  catalog: {
    name: "Watertoren Axel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9.5, 0], [-9.5, 0], [0, 9.5], [0, -9.5], [6.7, 6.7], [-6.7, 6.7], [6.7, -6.7], [-6.7, -6.7]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0715100000000842"],
    description:
      "Oorsprong op het hart van de twaalfzijdige schacht uit het BAG-pand op het maaiveld (NAP +1,57 m), +X langs de BAG-zijden (RD 10,7 graden). Twaalfzijdige bakstenen schacht (apothema 7,41 m) met vier risalieten met vensterkolommen, pilasters met voeten en een deur in het zuiden tot de witte band op 40,7 à 41,3 m; iets bredere twaalfzijdige ommanteling met kleine vensters tot 49,7 m, ingesprongen fries, ronde goot (straal 7,85 m) op 51,15 m, koperen koepel volgens het AHN en een vierzijdige lantaarn tot 60,4 m; klein hok op de goot aan de westkant. Maten uit BAG, AHN en een foto.",
    realWorld: {
      built: 1936,
      architect: "C. van Eck",
      rijksmonument: 508104,
      publishedHeightM: 60.6,
      reservoirsM3: [500, 500, 300],
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 61.97,
      shaftApothemM: A,
      risalitFrontM: RISALIT,
      bandM: [H.band[0], H.band[1]],
      casingTopM: H.casing,
      gutterM: H.gutter[1],
      gutterRadiusM: R.gutter,
      topM: H.lantern[3],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Axel) (1936, C. van Eck, 60,6 m, 500 + 500 + 300 m³)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/508104 (twaalfzijdig, pilasters, betonband, ommanteling iets breder dan de schacht, koperen koepel met vierzijdige lantaarn)",
      "https://commons.wikimedia.org/wiki/File:Axel_Watertoren_4843.JPG (frontaal op een risaliet: vensterkolom, band, ommanteling, fries, goot, koepel, lantaarn en hok)",
      "PDOK BAG-pand 0715100000000842, AHN DSM/DTM 0,5 m, luchtfoto, 2026-11-06",
    ],
  },
});

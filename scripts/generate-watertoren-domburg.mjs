// Watertoren van Domburg (Walcheren), op een duintop in De Manteling. Gebouwd in 1933 voor het gemeentelijk
// waterleidingbedrijf naar ontwerp van ir. H. Sangster, uitgevoerd door C. van Prooyen (Barendrecht); 28,5 m hoog, reservoir
// van 200 m³, rijksmonument 508066. Nu een woning. Een ronde, licht verjongende schacht van gele baksteen op een donkerrode
// plint om een betonskelet; boven het (vlakke) reservoir een rondgaande gaanderij met een ring van vensters tussen smalle
// stijlen, daarboven een brede, uitkragende betonnen rand met een dakkraag en een lage, met koper beklede bolkap. In de
// schacht verspreide hoge vensters (sinds de verbouwing met luiken), rond het reservoir zes reeksen gekoppelde kleine
// openingen met daartussen telkens een groepje van drie, en de rondboogingang aan de zuidwestkant (register, foto's).
//
// Oorsprong op het hart van de cirkel van BAG-pand 0717100000022552 (straal 5,04 m); het hart van de bolkap in het AHN-DSM
// ligt 0,1 m ernaast. Lokale X-as = RD-oost, Y = RD-noord; hoeken hieronder in graden linksom vanaf oost. Maaiveld AHN-DTM
// NAP +15,9 (de duintop rond de voet). Maten: de bolkap, de dakkraag en de rand uit het AHN-DSM (top NAP +44,71, rand
// +41,9 op 5,8 tot 6,2 m); de voetstraal uit BAG; de bovenstraal van de schacht, de straal van de rand en alle hoogtes
// onder de rand uit de foto's "Overzicht - Domburg - 20059248 - RCE.jpg" (van opzij, met maaiveld), "Watertoren Domburg
// 2016.JPG" (telelens) en "Watertoren Domburg P1390216.jpg", geschaald op de voetstraal en de rand uit het AHN.
import { Manifold, CrossSection, ccw, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [24219.39, 399233.72];
const AXIS = [1, 0];
const GROUND_NAP = 15.9;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 60,159, west 60,159, noord 60,188, zuid
// 60,149), gemeten 2026-11-06 op het terras rond de voet. Het PDOK-pand staat op 59,94.
const GROUND_ELLIPSOID = 60.15;

const rad = (deg) => (deg * Math.PI) / 180;
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (start, step, n) => Array.from({ length: n }, (_, k) => start + step * k);
const T56 = Math.tan(rad(56));
// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1, `depth` diep; het plafond loopt naar
// binnen onder 56 graden op en snijdt naar buiten tot `out` voor de gevel door (voor de kraag boven de gaanderij).
const niche = (f, w, z0, z1, depth = 0.3, out = 0.3) => {
  const za = z1 + depth * T56, zb = Math.max(z0 + 0.05, z1 - out * T56), a = f - depth, b = f + out;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Boognis met een spitse top (zijden onder `ang` graden) van z1 tot z1 + w/2 tan(ang).
const archNiche = (f, w, z0, z1, depth = 0.3, ang = 55) => {
  const apex = z1 + (w / 2) * Math.tan(rad(ang));
  return hull([f - depth, f + 1.2].flatMap((x) => [[x, -w / 2, z0], [x, w / 2, z0], [x, -w / 2, z1], [x, w / 2, z1], [x, 0, apex]]));
};
// Gebogen nis over een boog van `deg` graden rond de schacht (de reeksen gekoppelde openingen), zelfde plafond als `niche`.
const bandNiche = (f, deg, z0, z1, depth = 0.25) => {
  const za = z1 + depth * T56, zb = z1 - 0.3 * T56;
  return Manifold.revolve(new CrossSection([ccw([[f - depth, z0], [f + 0.3, z0], [f + 0.3, zb], [f, z1], [f - depth, za]])]), SEG, deg).rotate([0, 0, -deg / 2]);
};

// ---------- hoogtes boven het maaiveld (NAP +15,9) ----------
const H = {
  brickTop: 24.2, // bovenkant van de bakstenen schacht, voet van de gaanderij
  galleryWin: [24.25, 25.1], // vensters van de gaanderij (foto's); in het model spits tot 25,32
  fasciaBottom: 25.9, // onderkant van de rand
  fasciaTop: 26.1, // bovenkant van de rand (AHN NAP +41,9 op 5,8 tot 6,2 m, dus 26,0; 0,1 m hoger voor een rand van 0,2 m)
  domeFoot: 26.65, // voet van de bolkap op de dakkraag (AHN-knik op 4,3 m)
  top: 28.81, // top van de bolkap (AHN NAP +44,71)
};
const R = {
  foot: 5.04, // BAG-cirkel
  brickTop: 4.62, // foto's: bovenkant 0,915 x de voet
  gallery: 4.5, // vensterring 0,12 m terug
  brim: 5.7, // foto's 5,75 à 5,9; AHN-rand 5,8 tot 6,2 (met de halve pixel); 5,7 voor een onderkant van 50 graden
  domeFoot: 4.3,
};
const rShaft = (z) => R.foot + ((R.brickTop - R.foot) * z) / H.brickTop;
const DOOR_DEG = 225; // register: ingang aan de zuidwestzijde
// De zes reeksen gekoppelde openingen (17,4 tot 17,9 m) beslaan elk 42 graden rond 13,5 + k x 60; de groepjes van drie
// (18,35 tot 18,85 m) staan in de tussenruimtes (foto's: de RCE-foto, P1390216 en de telelensfoto, elk met dezelfde steek).
const BAND_DEGS = every(13.5, 60, 6);
const TRIPLE_DEGS = every(43.5, 60, 6);

// ---------- toren: één omwentelingsprofiel ----------
// Rand: onderkant onder 50 graden van de gaanderij (straal 4,5 op 24,47 m) tot de rand (5,7 op 25,9 m), zodat hij zonder
// steun te printen is; in werkelijkheid is de onderkant vrijwel vlak en is de vensterring 0,9 m hoog. Bovenop een kegelvormige dakkraag van de rand tot de voet van de bolkap. Bolkap: het
// AHN-profiel (doorsnede per 0,5 m van het hart), vrijwel een paraboloïde.
const DOME = [[4.0, 26.86], [3.5, 27.28], [3.0, 27.7], [2.5, 28.05], [2.0, 28.3], [1.5, 28.5], [1.0, 28.65], [0.5, 28.76]];
const UNDERSIDE_DEG = 50;
const galleryRoot = H.fasciaBottom - (R.brim - R.gallery) * Math.tan(rad(UNDERSIDE_DEG)); // 24,47 m
const tower = rev([
  [0, BASE], [rShaft(BASE), BASE], [R.brickTop, H.brickTop], [R.gallery, H.brickTop], [R.gallery, galleryRoot],
  [R.brim, H.fasciaBottom], [R.brim, H.fasciaTop], [R.domeFoot, H.domeFoot], ...DOME, [0, H.top],
]);

// ---------- vensters, deur en gaanderij als blinde nissen ----------
// [hoek, onderkant, bovenkant, breedte]; hoeken en hoogtes van de foto's, vensters minstens 0,9 m breed zodat ze op
// 1:1000 te zien zijn (de kleine vensters zijn 0,4 m, de luiken 0,55 tot 1,2 m).
const WINDOWS = [
  // zuidwestkant (RCE-foto en P1390216): de oorspronkelijke smalle vensters naast de ingang, de nieuwe luiken erboven
  [191, 3.6, 5.5], [256, 3.6, 5.5],
  [158, 5.6, 7.2], [225, 5.6, 7.0], [273, 5.6, 7.2],
  [153, 8.8, 10.7], [177, 8.8, 10.7], [225, 8.8, 10.7], [268, 8.1, 10.5],
  [164, 12.4, 14.4], [233, 12.4, 14.4], [276, 12.4, 14.4],
  [194, 19.5, 21.0], [250, 21.9, 23.4],
  // oostkant (telelensfoto)
  [70, 4.45, 6.1], [134.5, 4.45, 6.1], [95.5, 5.6, 7.4],
  [87, 9.2, 11.1, 1.2], [130.5, 9.2, 11.1],
  [93, 13.0, 14.8, 0.95], [125, 13.05, 14.0], [141, 13.05, 14.0],
  [35, 5.2, 7.2], [35, 8.3, 10.4], [35, 13.0, 14.8],
  [75.5, 21.1, 22.5], [134.5, 20.5, 21.9],
  // kleine vensters onder het midden van vijf reeksen (de noordwestkant heeft er één, gezien vanaf het strand)
  ...[13.5, 73.5, 133.5, 193.5, 253.5].map((deg) => [deg, 14.55, 15.35]),
];
const openings = union([
  ...around(archNiche(rShaft(1), 1.3, BASE + 0.3, 1.5), [DOOR_DEG]),
  ...WINDOWS.map(([deg, z0, z1, w = 0.9]) => place(niche(rShaft((z0 + z1) / 2), w, z0, z1), { deg })),
  ...around(bandNiche(rShaft(17.65), 42, 17.4, 17.9), BAND_DEGS),
  ...around(niche(rShaft(18.6), 1.0, 18.35, 18.85), TRIPLE_DEGS),
  // gaanderij: 24 vensters van 0,9 m tussen stijlen van 0,28 m, 0,45 m diep. Een recht venster dat in de onderkant van de
  // rand snijdt, laat een horizontale latei hangen (de export vult dan onder de hele rand); daarom een spitse bovenkant
  // van 62 graden tot 25,32 m, die als gootje in de onderkant van de rand uitloopt. Zo blijft de vensterring zichtbaar.
  ...around(archNiche(R.gallery, 0.9, H.galleryWin[0], galleryRoot, 0.45, 62), every(7.5, 15, 24)),
]);

const all = tower.subtract(openings);

await writeLandmark({
  slug: "watertoren-domburg",
  base: BASE,
  nodes: [["building:watertoren-schacht-gaanderij-rand-en-bolkap", all]],
  catalog: {
    name: "Watertoren Domburg",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6.5, 0], [-6.5, 0], [0, 6.5], [0, -6.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0717100000022552"],
    description:
      "Oorsprong op het hart van de ronde BAG-voetafdruk (straal 5,04 m) op het maaiveld van de duintop (NAP +15,9 m), X-as naar RD-oost. Licht verjongende bakstenen schacht (straal 5,04 tot 4,62 m) tot 24,2 m met de rondboogingang aan de zuidwestkant, verspreide hoge vensters, zes reeksen gekoppelde openingen en groepjes van drie rond 17,4 tot 18,9 m; gaanderij met 24 vensters onder de uitkragende rand (straal 5,7 m, bovenkant 26,1 m) met een onderkant van 50 graden; dakkraag en lage bolkap tot 28,8 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1933,
      architect: "ir. H. Sangster (uitvoering C. van Prooyen)",
      rijksmonument: 508066,
      publishedHeightM: 28.5,
      reservoirM3: 200,
      ahnGroundNapM: GROUND_NAP,
      ahnBrimNapM: 41.9,
      ahnTopNapM: 44.71,
      shaftRadiusFootM: R.foot,
      shaftRadiusTopM: R.brickTop,
      brickTopM: H.brickTop,
      galleryWindows: 24,
      brimRadiusM: R.brim,
      brimM: [H.fasciaBottom, H.fasciaTop],
      galleryM: [H.brickTop, +galleryRoot.toFixed(2)],
      brimUndersideDegrees: UNDERSIDE_DEG,
      domeFootRadiusM: R.domeFoot,
      domeFootM: H.domeFoot,
      topM: H.top,
      entranceDegrees: DOOR_DEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Domburg) (1933, Hendrik Sangster, 28,5 m, 200 m³; oorlogsschade, gerenoveerd, koperen dakplaten vernieuwd, enkele ramen toegevoegd; nu appartement)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/508066 (ronde doorsnede met een geringe afname van de buitendiameter, betonnen reservoir met vlakke bodem op vijf kolommen, gele baksteen op een donkerrode plint, gaanderij boven het reservoir, bolkap met koper; rondboogingang aan de zuidwestzijde, smalle hoge vensters, gekoppelde gevelopeningen)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_Domburg (Overzicht - Domburg - 20059248 - RCE.jpg, Exterieur Nehalenniaweg ongenummerd - Domburg - 20059214 - RCE.jpg, Watertoren Domburg 2016.JPG, Watertoren Domburg P1390216.jpg, Watertoren Domburg P1390217.jpg, Wasserturm Domburg Oktober 2016 01.jpg en 02.jpg, Watertoren Domburg - view from the beach.jpg, Watertoren Domburg - duinside.jpg)",
      "PDOK BAG-pand 0717100000022552, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

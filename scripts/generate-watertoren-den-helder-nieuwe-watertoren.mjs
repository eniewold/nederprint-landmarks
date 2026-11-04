// Nieuwe watertoren van Den Helder bij rotonde De Vijfsprong (Middenweg/Kanaalweg), in 1907 ontworpen door Jan Schotel
// en op 27 december 1907 in gebruik genomen als vervanger van de toren van 1856 in Huisduinen; reservoir van 400 m³
// (na de verbouwing van 1959-1961 500 m³), volgens Wikipedia 40,15 m hoog, gemeentelijk monument. Een ronde,
// sterk tapse bakstenen schacht in twee geledingen: een onderbouw die van 11,7 m aan de voet naar 9,7 m versmalt, met
// een rondboogfries onder een stenen band, en een slankere bovenschacht met verspringende trapvensters onder stenen
// lateien. Bovenaan opnieuw een rondboogfries en een stenen ring, daarop een kraag met ribben die uitkraagt naar de
// kuip: een cilinder van lichtere steen met vensters (een dubbel venster onder elke topgevel, een enkel venster
// daartussen) en een stenen lijst aan de voet. Boven de kuip een borstwering met een rij open vensters rond een
// dakterras, onderbroken door vier topgevels met schouders en twee pinakels; op het terras een ronde metalen opbouw
// met een antennemast. Aan de westkant een ingangshuisje met zadeldak (een eigen deel van het BAG-pand).
//
// Oorsprong op het middelpunt van de cirkel door de BAG-contour van pand 0400100000022072 (zonder het ingangshuisje;
// straal 5,85 m met 2 cm spreiding) op maaiveld (AHN-DTM NAP +0,86 tot +1,17 binnen 8 tot 14 m, mediaan +0,94;
// gebruikt +0,95). Lokale +X staat 6 graden linksom op RD-oost: de richting van de oostelijke topgevel. De westelijke
// topgevel staat op foto's recht boven het ingangshuisje, en dat ligt in de BAG gecentreerd op RD 186 graden.
//
// Hoogtes: het AHN-DSM en de PDOK-reconstructie zien het dakterras op 35,9 m boven maaiveld (NAP +36,8, ook de 3D BAG),
// de metalen opbouw tot 38,7 m en het bovenste deel tot 40,5 m, maar op de rand van de kuip (borstwering en
// topgevels) hebben ze geen bruikbare punten: het DSM interpoleert daar tussen het terras en de straat. De
// geledingen komen daarom uit de foto "Den Helder, watertoren 2006-08-06 10.28" (evenwijdige verticalen), met één
// schaal (28 px/m) uit de BAG-voet van 11,7 m; die schaal geeft de kuip 12,1 m (AHN: 12,2 tot 12,8 met
// randvervaging) en de pinakels 40,6 m, en alle fotohoogtes zijn met 0,989 geschaald op 40,15 m (Wikipedia) op de
// pinakels. Met die schaal ligt de vensterrij in de borstwering op 1,0 tot 1,7 m boven het terras van het AHN.
import { hull, union, prism, box, circle, ring3, place, writeLandmark, Manifold, CrossSection, ccw } from "./efteling-kit.mjs";

const ORIGIN = [112785.62, 552447.98];
const DEG = 6;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 0.95; // AHN-DTM 8 tot 14 m uit het hart: 0,86 tot 1,17, mediaan 0,94
const GROUND_ELLIPSOID = 43.05; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04 (43,05 tot 43,17)
const SEG = 96;
const D = Math.PI / 180;

// ---------- maten ----------
const R = {
  foot: 5.85, // voet van de schacht (BAG-cirkel)
  belowBand: 4.86, // onderbouw onder de stenen band (foto 9,7 m)
  upper: 4.62, // bovenschacht boven de band (foto 9,25 m)
  underFrieze: 4.05, // bovenschacht onder de bovenste fries (foto 8,1 m)
  ring: 4.35, // stenen ring onder de kraag (foto 8,5 m)
  lip: 6.25, // stenen lijst aan de voet van de kuip (foto 12,5 m)
  tank: 6.05, // kuip (foto 12,1 m; AHN 12,2 tot 12,8 met randvervaging)
  wall: 1.5, // dikte van borstwering en topgevels; aan de binnenkant dikker dan in het echt, zodat achter de nissen van de
  // vensterrij ruim meer dan de 0,8 m blijft die de export als dragende wand wil zien
  friezeOut: 0.12, // uitsprong van fries en pendanten
  bandOut: 0.2, // uitsprong van de stenen band
};
const H = {
  lowerFrieze: [9.4, 10.1], // pendanten en onderkant van de onderste rondboogfries
  band: [10.8, 11.5], // stenen band
  upperFrieze: [24.6, 25.1], // pendanten en onderkant van de bovenste rondboogfries
  ring: [25.6, 26.2],
  lip: [28.1, 28.8], // stenen lijst; de kraag loopt onder 45 graden van de ring tot de lijst
  terrace: 35.9, // dakterras (AHN, PDOK en 3D BAG: NAP +36,8)
  sill: 36.5, // lijst onder de vensterrij van de borstwering
  openings: [36.6, 36.85], // met een spitse top tot 37,63 m
  parapet: 37.8, // bovenkant van de borstwering
  gableShoulder: 39.0,
  gableTop: 39.45,
  pinnacle: 40.15, // pinakels (Wikipedia 40,15 m)
  drum: 38.7, // metalen opbouw (AHN/PDOK 38,7)
  drumTop: 40.4, // bovenste deel (PDOK 40,5)
  annexEave: 4.6, // ingangshuisje (3D BAG NAP +5,4 tot +6,0)
  annexRidge: 5.8, // nok (3D BAG NAP +6,7)
};
const lowerR = (z) => R.foot - ((R.foot - R.belowBand) * z) / (H.band[0] - 0.15);
const upperR = (z) => R.upper - ((R.upper - R.underFrieze) * (z - H.band[1])) / (H.upperFrieze[1] - H.band[1]);

// ---------- schacht, friezen, kraag en kuip als één omwentelingsprofiel [r, z] ----------
const fl = H.lowerFrieze[1] - R.friezeOut; // onderkant van de schuine kraag onder de onderste fries
const fu = H.upperFrieze[1] - R.friezeOut;
const profile = [
  [lowerR(BASE), BASE],
  [lowerR(fl), fl],
  [lowerR(fl) + R.friezeOut, H.lowerFrieze[1]],
  [lowerR(H.band[0] - 0.08) + R.friezeOut, H.band[0] - 0.08],
  [lowerR(H.band[0] - 0.08) + R.bandOut, H.band[0]],
  [lowerR(H.band[0] - 0.08) + R.bandOut, H.band[1]],
  [R.upper, H.band[1]],
  [upperR(fu), fu],
  [upperR(fu) + R.friezeOut, H.upperFrieze[1]],
  [upperR(fu) + R.friezeOut, H.ring[0] - (R.ring - upperR(fu) - R.friezeOut)],
  [R.ring, H.ring[0]],
  [R.ring, H.ring[1]],
  [R.lip, H.ring[1] + (R.lip - R.ring)], // kraag onder 45 graden (op foto's ~40 graden en hol)
  [R.lip, H.lip[1]],
  [R.tank, H.lip[1]],
  [R.tank, H.parapet],
  [R.tank - R.wall, H.parapet],
  [R.tank - R.wall, H.terrace],
  [0, H.terrace],
  [0, BASE],
];
if (Math.abs(R.lip - R.ring - (H.lip[0] - H.ring[1]) - 0.0) > 0.11) throw new Error("kraag niet op 45 graden");
const body = Manifold.revolve(new CrossSection([ccw(profile)]), SEG);

// Pendanten van de rondboogfriezen: 24 consoles van 0,5 m onder de fries met een onderkant onder 45 graden.
const pendant = (deg, z0, rWall) => {
  const w = 0.25, rIn = rWall - 0.15, rOut = rWall + R.friezeOut;
  return place(hull([
    [rIn, -w, z0], [rIn, w, z0], [rWall, -w, z0], [rWall, w, z0],
    [rOut, -w, z0 + R.friezeOut], [rOut, w, z0 + R.friezeOut],
    [rIn, -w, z0 + 0.8], [rIn, w, z0 + 0.8], [rOut, -w, z0 + 0.8], [rOut, w, z0 + 0.8],
  ]), { deg });
};
const pendants = [
  ...Array.from({ length: 24 }, (_, k) => pendant(7.5 + 15 * k, H.lowerFrieze[0], lowerR(H.lowerFrieze[0]))),
  ...Array.from({ length: 20 }, (_, k) => pendant(9 + 18 * k, H.upperFrieze[0], upperR(H.upperFrieze[0]))),
];

// Ribben op de kraag: 24 ribben van 0,4 m, 0,15 m uit het kraagvlak en evenwijdig eraan (onderkant onder 45 graden).
const rib = (deg) => {
  // Buitenlijn r = ring + (z - z0) + o: begint op de ring (z0 - o) en eindigt onder de lijst (z0 + dz - o).
  const w = 0.2, z0 = H.ring[1], dz = R.lip - R.ring, o = 0.15 * Math.SQRT2;
  return place(hull([
    [R.ring - 0.1, -w, z0 - o], [R.ring - 0.1, w, z0 - o], [R.ring, -w, z0 - o], [R.ring, w, z0 - o],
    [R.ring - 0.1, -w, z0 + 0.3], [R.ring - 0.1, w, z0 + 0.3],
    [R.lip, -w, z0 + dz - o], [R.lip, w, z0 + dz - o], [R.lip - 0.1, -w, H.lip[0] + 0.3], [R.lip - 0.1, w, H.lip[0] + 0.3],
  ]), { deg });
};
const ribs = Array.from({ length: 24 }, (_, k) => rib(15 * k));

// ---------- vensters ----------
// Nis in een wand met normaal +X op straal f, plafond onder 56 graden (k = 1,5) of 49 graden (k = 1,15) naar binnen
// oplopend (zoals Aalsmeer).
const niche = (f, wd, z0, z1, depth, k = 1.5) => {
  const a = f - depth, b = f + 1.5, za = z1 + k * depth, y0 = -wd / 2, y1 = wd / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 2.25], [b, y1, z1 - 2.25]]);
};
// Stenen latei boven een venster: 0,15 m uit de gevel, onderkant onder 45 graden.
const lintel = (f, wd, z0, z1) => {
  const a = f - 0.3, o = f + 0.15, y0 = -wd / 2, y1 = wd / 2;
  return hull([[a, y0, z0], [a, y1, z0], [f, y0, z0], [f, y1, z0], [o, y0, z0 + 0.15], [o, y1, z0 + 0.15], [a, y0, z1], [a, y1, z1], [o, y0, z1], [o, y1, z1]]);
};
const windowAt = (deg, rAt, wd, z0, z1) => ({
  cut: place(niche(rAt((z0 + z1) / 2), wd, z0, z1, 0.35), { deg }),
  add: place(lintel(rAt(z1 + 0.1), wd + 0.3, z1 + 0.1, z1 + 0.7), { deg }),
});
const windows = [
  // Onderbouw: vier vensters van 4,0 tot 7,6 m, niet boven het ingangshuisje (lokaal 180 graden).
  ...[45, 135, 225, 315].map((deg) => windowAt(deg, lowerR, 0.9, 4.0, 7.6)),
  // Bovenschacht: trapvensters die met de wenteltrap rondlopen en verspringen (foto: 13,7 tot 23,0 m).
  ...Array.from({ length: 8 }, (_, k) => windowAt(20 + 45 * k, upperR, 0.9, 12.6 + 1.2 * k, 16.4 + 1.2 * k)),
  // Kuip: een dubbel venster onder elke topgevel, een enkel venster daartussen (foto: 32,1 tot 35,5 m).
  ...[0, 90, 180, 270].map((deg) => windowAt(deg, () => R.tank, 1.4, 32.1, 35.5)),
  ...[45, 135, 225, 315].map((deg) => windowAt(deg, () => R.tank, 0.9, 32.1, 35.5)),
];

// ---------- borstwering, topgevels en pinakels ----------
// Vensterrij: per kwart twee van de vijf open vensters, 0,9 m breed met penanten van ruim 1 m ertussen (vijf vensters van
// 0,9 m laten penanten van 0,3 m over), als nissen van 0,35 m in de borstwering.
// Spitse top onder 60 graden (geen schuin plafond: een lage nis met een plafond dat naar binnen oploopt, vult de export
// op 1:1000 in de bovenste printlagen toch op).
const pointedNiche = (f, wd, z0, z1, depth) => {
  const a = f - depth, b = f + 1.5, y = wd / 2, apex = z1 + y * Math.tan(60 * D);
  return hull([[a, -y, z0], [b, -y, z0], [a, y, z0], [b, y, z0], [a, -y, z1], [b, -y, z1], [a, y, z1], [b, y, z1], [a, 0, apex], [b, 0, apex]]);
};
const parapetNiches = [0, 90, 180, 270].flatMap((q) => [36, 54].map((a) => place(pointedNiche(R.tank, 0.9, H.openings[0], H.openings[1], 0.35), { deg: q + a })));
// Topgevel: koorde van 4,6 m, rechte zijden tot 39,0 m, schouders naar 2,4 m breed op 39,45 m; twee pinakels
// van 0,9 m (hart 0,75 m uit het midden) tot 40,15 m.
const annulus = prism(circle([0, 0], R.tank, SEG), H.parapet - 0.5, 41).subtract(prism(circle([0, 0], R.tank - R.wall, SEG), H.parapet - 1, 42));
const gableProfile = (u) => [[u, -2.3, H.parapet - 0.5], [u, 2.3, H.parapet - 0.5], [u, 2.3, H.gableShoulder], [u, 1.2, H.gableTop], [u, -1.2, H.gableTop], [u, -2.3, H.gableShoulder]];
const gableWall = hull([...gableProfile(R.tank - R.wall - 0.6), ...gableProfile(R.tank + 0.1)]).intersect(annulus);
const pinnacle = (v) => box(R.tank - R.wall, v - 0.45, H.gableTop - 0.05, R.tank, v + 0.45, H.pinnacle).intersect(prism(circle([0, 0], R.tank, SEG), H.parapet, 41));
const gable = union([gableWall, pinnacle(-0.75), pinnacle(0.75)]);
const gables = [0, 90, 180, 270].map((deg) => place(gable, { deg }));

// ---------- metalen opbouw op het terras ----------
// Hart 1,1 m naar het noordoosten (AHN en PDOK); onderdeel van 4,8 m tot 38,7 m, kraag onder 45 graden naar het
// bovenste deel van 2,8 m tot 40,4 m (PDOK 40,5). De antennemast is te dun.
const drumAt = [0.7, 0.9];
const drum = union([
  prism(circle(drumAt, 2.4, 48), H.terrace - 0.1, H.drum),
  hull([...ring3(circle(drumAt, 2.4, 48), H.drum - 0.01), ...ring3(circle(drumAt, 1.4, 48), H.drum + 1.0)]),
  prism(circle(drumAt, 1.4, 48), H.drum + 0.9, H.drumTop),
]);

// ---------- ingangshuisje aan de westkant ----------
// BAG: voorgevel 7,3 m uit het hart, 3,6 m breed; zadeldak met de nok naar buiten (3D BAG), dubbele deur als nis.
const annex = union([
  box(-7.3, -1.8, BASE, -5.0, 1.8, H.annexEave),
  hull([[-7.3, -1.8, H.annexEave - 0.01], [-5.0, -1.8, H.annexEave - 0.01], [-7.3, 1.8, H.annexEave - 0.01], [-5.0, 1.8, H.annexEave - 0.01], [-7.3, 0, H.annexRidge], [-5.0, 0, H.annexRidge]]),
]).subtract(place(niche(7.3, 1.6, 0, 2.4, 0.3), { deg: 180 }));

const tower = union([body, ...pendants, ...ribs, ...windows.map((w) => w.add), ...gables, drum, annex])
  .subtract(union([...windows.map((w) => w.cut), ...parapetNiches]));

await writeLandmark({
  slug: "watertoren-den-helder-nieuwe-watertoren",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:tapse-schacht-kraag-kuip-en-topgevels", tower]],
  catalog: {
    name: "Nieuwe watertoren Den Helder",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-9, 0], [0, 9], [0, -9]],
    // Ellipsoïdisch: de PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0400100000022072"],
    description:
      "Oorsprong op het middelpunt van de BAG-cirkel (11,7 m) op maaiveld (NAP +0,95 m), +X naar de oostelijke topgevel (RD 6 graden). Ronde tapse bakstenen schacht in twee geledingen met rondboogfriezen, stenen band en trapvensters, een geribde kraag onder 45 graden naar de kuip van 12,1 m met vensters, een borstwering met vensterrij rond het dakterras op 35,9 m, vier topgevels met twee pinakels tot 40,15 m, de metalen opbouw op het terras en het ingangshuisje aan de westkant. Maten uit BAG, AHN, PDOK en foto's.",
    realWorld: {
      publishedHeightM: 40.15,
      reservoirM3: [400, 500],
      built: "1907",
      architect: "Jan Schotel",
      ahnGroundNapM: GROUND_NAP,
      ahnTerraceNapM: 36.8,
      footDiameterM: R.foot * 2,
      tankDiameterM: R.tank * 2,
      bandM: H.band,
      ringM: H.ring,
      lipM: H.lip,
      terraceM: H.terrace,
      parapetM: H.parapet,
      gableTopM: H.gableTop,
      pinnacleM: H.pinnacle,
      drumTopM: H.drumTop,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Den_Helder) (1907, Jan Schotel, 40,15 m, reservoir 400 m³, na 1961 500 m³)",
      "https://commons.wikimedia.org/wiki/File:Den_Helder,_watertoren_2006-08-06_10.28.JPG (evenwijdige verticalen: geledingen, doorsnedes en de topgevels)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Den_Helder.jpg (westkant met het ingangshuisje onder de topgevel)",
      "https://commons.wikimedia.org/wiki/File:Den_Helder_Watertoren_01.JPG en File:Den_Helder_-_Watertoren.JPG (borstwering met vensterrij, topgevel met pinakels, metalen opbouw, kraag met ribben)",
      "PDOK BAG-pand 0400100000022072, 3D BAG, PDOK 3D-gebouwtegel, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});

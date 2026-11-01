// Watertoren van Sneek (G. Halbertsma, 1908), neorenaissance, gemeentelijk
// monument, reservoir van 350 m³, sinds 1998 kantoor. Ronde bakstenen schacht
// met een basement met blinde rondboognissen en een deurportaal, licht
// verjongend tot een gemetselde kraag; daarboven een kegelvormige stoel van
// schoren onder een zestienzijdig reservoir met vensters in elk vlak, een
// zware overstekende dakrand, een holle zestienzijdige leien kap met vier
// dakhuisjes, een omgang en een achtzijdige lantaarn met koepeltje.
// Oorsprong op het hart van de ronde BAG-contour (straal 5,0 m), dat samenvalt
// met de top van de lantaarn in het AHN, op maaiveld (NAP +0,38 m); assen in
// RD-richting. Hoogtes van de dakrand (33,2 m), de kap, de omgang en de
// koepel uit het AHN; de opbouw van schacht en reservoir uit de frontale foto
// "20190529 Watertoren Sneek" (29,1 px/m op de dakrand van 13,0 m in het AHN)
// en de minder schuine foto "Sneek, Watertoren" (45,4 px/m op het reservoir).
// De stand volgt uit de foto's en het AHN: de vensters van het reservoir en de
// nissen van de schacht staan op 10 + k·22,5 graden, de dakhuisjes op
// 55 + k·90 graden (bulten in het AHN, luchtfoto) en de deur op -35 graden,
// aan het pad naar het zuidoosten.
import { Manifold, CrossSection, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [173039.55, 560114.3];
const AXIS = [1, 0];
const BASE = -0.3;
const PH = 10; // graden: normaal van een reservoirvlak en van de nissen van de schacht
const DOOR = PH - 45; // deur naar het zuidoosten
const DORMERS = [0, 1, 2, 3].map((k) => 55 + k * 90);
const H = {
  plinthTop: 8.0, // bovenkant van het basement, dan een schuine band
  shaftFoot: 8.6,
  shaftTop: 20.2, // onder de gemetselde kraag
  corbel: 20.6,
  frieze: 22.0, // bovenkant van de fries, voet van de schoren
  rim: 24.3, // onderrand van het reservoir (stenen band)
  wall: 24.8,
  corniceFoot: 31.95, // schuine onderkant van de dakrand
  corniceFace: 32.9,
  cornice: 33.25, // bovenkant van de dakrand (AHN 33,0 tot 33,3)
  gallery: 37.4, // voet van de omgang
  railing: 39.1, // bovenkant van het hekwerk, als dichte rand
  lanternTop: 42.0,
  lanternCornice: 42.65,
  apex: 44.0, // top van het koepeltje (AHN 43,95)
};
const R = { plinth: 5.0, shaftFoot: 4.55, shaftTop: 4.0, frieze: 4.3, rim: 5.95, tank: 5.8, cornice: 6.6, gallery: 1.9, lantern: 1.05, lanternCornice: 1.35 };

// ---------- ronde schacht: basement, schuine band, verjongende schacht, kraag en fries ----------
const shaft = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.plinth, BASE], [R.plinth, H.plinthTop], [R.shaftFoot, H.shaftFoot], [R.shaftTop, H.shaftTop],
    [R.frieze, H.corbel], [R.frieze, H.frieze + 0.05], [0, H.frieze + 0.05],
  ]]),
  96,
);
const shaftR = (z) => R.shaftFoot + ((z - H.shaftFoot) / (H.shaftTop - H.shaftFoot)) * (R.shaftTop - R.shaftFoot);

// ---------- zestienzijdig reservoir op een kegel van schoren ----------
// Hoekpunten op PH ± 11,25 graden, zodat de vlakken met normaal PH + k·22,5 staan.
const g16 = (r, z) => ring3(circle([0, 0], r, 16, ((PH - 11.25) * Math.PI) / 180), z);
const apo16 = (r) => r * Math.cos(Math.PI / 16);
const tank = union([
  // Kegel van schoren (56 graden) en de stenen band als één omhulsel.
  hull([...g16(R.frieze + 0.05, H.frieze - 0.05), ...g16(R.rim, H.rim), ...g16(R.rim, H.wall)]),
  hull([...g16(R.tank, H.wall - 0.05), ...g16(R.tank, H.corniceFoot + 0.05)]),
  // Schuine onderkant (50 graden) en voorkant van de dakrand.
  hull([...g16(R.tank, H.corniceFoot), ...g16(R.cornice, H.corniceFace), ...g16(R.cornice, H.cornice)]),
]);

// ---------- holle zestienzijdige kap tot de omgang ----------
// Straal per hoogte uit het AHN (34 m: 4,2; 35 m: 3,4; 36 m: 2,7; 37 m: 2,15).
const ROOF = [[5.2, H.cornice - 0.05], [4.2, 34.0], [3.35, 34.9], [2.7, 35.9], [2.15, 37.0], [1.85, 38.0]];
const roof = union(ROOF.slice(1).map(([r, z], k) => hull([...g16(ROOF[k][0], ROOF[k][1]), ...g16(r, z)])));

// ---------- vier dakhuisjes met een spits dak ----------
// Lokaal langs +X: voorvlak op 3,65 m uit het hart, achterkant in de kap.
const dormer = union([
  hull([[2.2, -0.6, 34.2], [3.65, -0.6, 34.2], [2.2, 0.6, 34.2], [3.65, 0.6, 34.2], [2.2, -0.6, 35.6], [3.65, -0.6, 35.6], [2.2, 0.6, 35.6], [3.65, 0.6, 35.6]]),
  hull([[2.2, -0.6, 35.55], [3.65, -0.6, 35.55], [2.2, 0.6, 35.55], [3.65, 0.6, 35.55], [2.95, 0, 37.1]]),
]);

// ---------- omgang (hekwerk als dichte rand), achtzijdige lantaarn, kroonlijst en koepel ----------
const o8 = (r, z) => ring3(circle([0, 0], r, 8, ((PH - 22.5) * Math.PI) / 180), z);
const top = union([
  Manifold.cylinder(H.railing - H.gallery, R.gallery, R.gallery, 48).translate([0, 0, H.gallery]),
  hull([...o8(R.lantern, H.railing - 0.1), ...o8(R.lantern, H.lanternTop)]),
  hull([...o8(R.lantern, H.lanternTop - 0.05), ...o8(R.lanternCornice, H.lanternTop + 0.35), ...o8(R.lanternCornice, H.lanternCornice)]), // kroonlijst, 51 graden
  hull([...o8(1.15, H.lanternCornice - 0.05), ...o8(1.1, 42.95), ...o8(0.9, 43.4), ...o8(0.55, 43.8), [0, 0, H.apex]]),
]);

// ---------- deurportaal met fronton ----------
const portal = place(
  hull([
    [4.6, -1.0, BASE], [5.35, -1.0, BASE], [4.6, 1.0, BASE], [5.35, 1.0, BASE],
    [4.6, -1.0, 5.4], [5.35, -1.0, 5.4], [4.6, 1.0, 5.4], [5.35, 1.0, 5.4],
    [4.6, 0, 6.3], [5.35, 0, 6.3],
  ]),
  { deg: DOOR },
);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const bays = Array.from({ length: 8 }, (_, k) => PH + k * 45);
const cuts = [
  // Deur met bovenlicht in het portaal.
  place(niche(5.35, 1.1, 0, 3.0, 0.6), { deg: DOOR }),
  place(niche(5.35, 0.6, 3.9, 4.6, 0.3), { deg: DOOR }),
  // Basement: blinde rondboognissen tussen de lisenen, met een smal venster erin.
  ...bays.filter((d) => d !== DOOR + 360 && d !== DOOR).flatMap((deg) => [
    place(niche(R.plinth, 2.2, 0.8, 5.6, 0.3), { deg }),
    place(niche(R.plinth - 0.3, 0.7, 2.4, 5.0, 0.25), { deg }),
  ]),
  // Schacht: vensters op twee hoogtes en een krans van acht oculi onder de kraag.
  ...[0, 1, 2, 3].map((k) => place(niche(shaftR(10.8), 0.75, 9.9, 11.7, 0.3), { deg: PH + k * 90 })),
  ...[0, 1, 2, 3].map((k) => place(niche(shaftR(14.7), 0.75, 13.7, 15.8, 0.3), { deg: DOOR + k * 90 })),
  ...bays.map((deg) => place(niche(shaftR(19.0), 0.8, 18.6, 19.4, 0.25), { deg })),
  // Reservoir: per vlak twee hoge smalle vensters boven elkaar en een breed venster onder de dakrand.
  ...Array.from({ length: 16 }, (_, k) => PH + k * 22.5).flatMap((deg) => [
    place(niche(apo16(R.tank), 0.5, 25.6, 27.0), { deg }),
    place(niche(apo16(R.tank), 0.5, 27.9, 29.5), { deg }),
    place(niche(apo16(R.tank), 1.0, 30.3, 31.05), { deg }),
  ]),
  // Dakhuisjes: een venster in het voorvlak.
  ...DORMERS.map((deg) => place(niche(3.65, 0.6, 34.75, 35.3, 0.2), { deg })),
  // Lantaarn: blinde rondboogopening in elk vlak.
  ...Array.from({ length: 8 }, (_, k) => PH + k * 45).map((deg) => place(niche(R.lantern * Math.cos(Math.PI / 8), 0.45, H.railing + 0.2, H.lanternTop - 0.5, 0.2), { deg })),
];

const body = union([shaft, tank, roof, ...DORMERS.map((deg) => place(dormer, { deg })), top, portal]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-sneek",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-reservoir-kap-en-lantaarn", body]],
  catalog: {
    name: "Watertoren Sneek",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8], [0, -8]],
    replacesBuildings: ["NL.IMBAG.Pand.0091100000011099"],
    description:
      "Oorsprong op het hart van de ronde BAG-contour op maaiveld (NAP +0,38 m), assen in RD-richting. Ronde bakstenen schacht met een basement van 10 m met blinde rondboognissen en een deurportaal naar het zuidoosten, verjongend van 9,1 tot 8,0 m met vensters en oculi, gemetselde kraag tot 22 m; zestienzijdig reservoir van 11,6 m op een kegel van schoren van 24,3 tot 32 m met drie vensters per vlak, overstekende dakrand van 13,0 m tot 33,25 m, holle zestienzijdige leien kap met vier dakhuisjes, omgang op 37,4 m, achtzijdige lantaarn en koepeltje tot 44 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      publishedHeightM: 44,
      reservoirM3: 350,
      ahnGroundNapM: 0.38,
      ahnTopNapM: 44.33,
      bagShaftDiameterM: 10.0,
      shaftDiameterM: [9.1, 8.0],
      tankAcrossCornersM: 11.6,
      corniceAcrossFlatsM: 12.95,
      rimM: 24.3,
      corniceM: 33.25,
      galleryM: 37.4,
      modelTopM: 44.0,
      photoScalePxPerM: [29.1, 45.4],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Sneek)",
      "https://commons.wikimedia.org/wiki/File:20190529_Watertoren_Sneek.jpg (frontale foto, maten van schacht en deur)",
      "https://commons.wikimedia.org/wiki/File:Sneek,_Watertoren.JPG (reservoir, dakrand, kap en lantaarn)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_(Sneek)_(d.j.b.)_04.jpg (kap, dakhuisjes, omgang en lantaarn)",
      "PDOK BAG-pand 0091100000011099, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

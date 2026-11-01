// Watertoren van Winterswijk (MABEG, 1926), rijksmonument 523469, sinds 1993
// een woning. Achthoekige bakstenen toren: een licht verjongende schacht met
// getande hoeken, een witte betonnen kraag waarop de iets bredere vensterzone
// staat, een witte band met consoles, de reservoirzone met zestien lisenen (op
// de hoeken en midden op de vlakken), een iets terugliggende koperen opstand
// met een venster per vlak en een koperen tentdak.
// Oorsprong op het hart van de achthoekige BAG-contour (pand 0294100000392878,
// 11,4 m over de vlakken) op maaiveld (NAP +37,35 m). +X wijst naar het vlak met
// de deur en de hoge vensterstrook, naar de Misterweg (297,4 graden linksom van
// RD-oost); de vlakken staan op k*45 graden.
// Hoogtes uit de frontale foto "Winterswijk, de Watertoren RM523469 IMG 2610"
// (lijnen recht, 32 px/m), geschaald op de dakvoet in het AHN (33,4 m);
// breedteverhoudingen uit die foto en uit "Water Tower Winterswijk"; de top van
// het tentdak uit het AHN (37,0 m boven maaiveld).
import { Manifold, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [245410.75, 442930.55];
const AXIS = [0.4602, -0.8878];
const BASE = -0.3;
const H = {
  shaft: 18.55, // bovenkant van de schacht, voet van de witte kraag
  ledge: 18.95, // bovenkant van de kraag, voet van de vensterzone
  bandFoot: 21.85, // voet van de witte band
  bandOut: 22.05,
  band: 22.5, // bovenkant van de band, voet van de lisenen
  console: 20.9, // onderkant van de consoles
  wall: 31.15, // bovenkant van de bakstenen reservoirzone
  eave: 33.4, // bovenkant van de koperen opstand, voet van het tentdak
  apex: 37.0,
};
// Apothema's (afstand hart-vlak) van de achthoek.
const A = { foot: 5.72, shaft: 5.42, middle: 5.7, band: 5.85, console: 5.97, upper: 5.62, pilaster: 5.87, attic: 5.22 };
const C = 1 / Math.cos(Math.PI / 8); // apothema -> straal naar de hoek
const apo = (z) => A.foot + ((z - BASE) / (H.shaft - BASE)) * (A.shaft - A.foot);

const oct = (a, z) => ring3(circle([0, 0], a * C, 8, Math.PI / 8), z);
const prismOct = (a, z0, z1) => hull([...oct(a, z0), ...oct(a, z1)]);

// ---------- hoofdvolume ----------
const shaft = hull([...oct(A.foot, BASE), ...oct(A.shaft, H.shaft)]);
const ledge = hull([...oct(A.shaft, H.shaft - 0.01), ...oct(A.middle, H.ledge)]); // 55 graden
const middle = prismOct(A.middle, H.ledge, H.bandFoot);
const band = union([hull([...oct(A.middle, H.bandFoot), ...oct(A.band, H.bandOut)]), prismOct(A.band, H.bandOut, H.band)]); // 53 graden
const upper = prismOct(A.upper, H.band - 0.01, H.wall);
const attic = prismOct(A.attic, H.wall - 0.01, H.eave);
const roof = hull([...oct(A.attic, H.eave - 0.01), [0, 0, H.apex]]);

// ---------- reliëf ----------
// Rib in de richting +X: buitenvlak op r0 (onder) en r1 (z1), breedte w, 1,2 m
// diep. Met `wall` (straal van het vlak eronder) begint hij op z0 tegen dat vlak
// met een onderkant van 51 graden (1,25 stijging per m uitsprong), zodat hij niet hangt.
const rib = (r0, r1, w, z0, z1, wall = null) => {
  const i0 = r0 - 1.2, i1 = r1 - 1.2;
  const zi = wall === null ? z0 : z0 + 1.25 * (i0 - wall), zo = wall === null ? z0 : z0 + 1.25 * (r0 - wall);
  return hull([
    [i0, -w / 2, zi], [i0, w / 2, zi], [r0, -w / 2, zo], [r0, w / 2, zo],
    [i1, -w / 2, z1], [i1, w / 2, z1], [r1, -w / 2, z1], [r1, w / 2, z1],
  ]);
};
const ANGLES16 = Array.from({ length: 16 }, (_, k) => k * 22.5); // even = midden op een vlak, oneven = hoek
const rad = (a, deg) => (deg % 45 === 0 ? a : a * C);
// Getande hoeken van de schacht als lisenen van 0,8 m die de verjonging volgen.
const cornerRibs = [0, 1, 2, 3, 4, 5, 6, 7].map((k) =>
  place(rib(rad(A.foot, 22.5) + 0.15, rad(A.shaft, 22.5) + 0.15, 0.8, BASE, H.shaft), { deg: 22.5 + k * 45 }),
);
// Consoles onder de band en lisenen in de reservoirzone, op de hoeken en midden op de vlakken.
const consoles = ANGLES16.map((deg) => place(rib(rad(A.console, deg), rad(A.console, deg), 0.7, H.console, H.band, rad(A.middle, deg)), { deg }));
const pilasters = ANGLES16.map((deg) => place(rib(rad(A.pilaster, deg), rad(A.pilaster, deg), 0.7, H.band - 0.01, H.wall), { deg }));

// Ingang: portaal van 2,6 m breed en 3,6 m hoog voor het vlak +X.
const portal = rib(A.foot + 0.3, apo(3.6) + 0.3, 2.6, BASE, 3.6);
// Hoge vensterstrook (trappenhuis) van 1,2 m breed, 0,2 m voor het vlak, op +X en +90.
const STRIP = { z0: 4.6, z1: 17.8 };
const frame = rib(apo(STRIP.z0) + 0.2, apo(STRIP.z1) + 0.2, 1.2, STRIP.z0, STRIP.z1, apo(STRIP.z0));
const frames = [0, 90].map((deg) => place(frame, { deg }));

// Nis met een plafond dat naar binnen onder 56 graden oploopt (de export vult hem niet op), in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const STRIP_WINDOWS = [[6.3, 9.3], [10.3, 12.1], [13.3, 16.4]];
const cuts = [
  niche(A.foot + 0.3, 1.6, 0, 2.6, 0.4), // deur in het portaal
  ...[0, 90].flatMap((deg) => STRIP_WINDOWS.map(([z0, z1]) => place(niche(apo((z0 + z1) / 2) + 0.2, 0.6, z0, z1, 0.3), { deg }))),
  // Twee vensters boven elkaar in de vlakken naast de ingang.
  ...[45, -45].flatMap((deg) => [[2.4, 3.7], [5.3, 6.6]].map(([z0, z1]) => place(niche(apo(z1), 1.1, z0, z1, 0.3), { deg }))),
  // Een venster in elk vlak van de koperen opstand.
  ...[0, 1, 2, 3, 4, 5, 6, 7].map((k) => place(niche(A.attic, 0.9, 31.75, 32.75, 0.25), { deg: k * 45 })),
];

await writeLandmark({
  slug: "watertoren-winterswijk",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [
    [
      "building:schacht-reservoirzone-en-tentdak",
      union([shaft, ledge, middle, band, upper, attic, roof, ...cornerRibs, ...consoles, ...pilasters, portal, ...frames]).subtract(union(cuts)),
    ],
  ],
  catalog: {
    name: "Watertoren Winterswijk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Op de diagonalen: ten noorden van de toren staat een aanbouw (BAG 0294100000385345).
    groundSamplePoints: [[5.4, 5.4], [-5.4, 5.4], [-5.4, -5.4], [5.4, -5.4]],
    replacesBuildings: ["NL.IMBAG.Pand.0294100000392878"],
    description:
      "Oorsprong op het hart van de achthoekige BAG-contour op maaiveld (NAP +37,35 m), +X naar het vlak met de deur (297,4 graden van RD-oost). Achthoekige schacht van 11,4 m over de vlakken, verjongend tot 10,8 m op 18,6 m, met getande hoeklisenen, portaal en vensterstroken; witte kraag naar de vensterzone van 11,4 m, witte band met zestien consoles op 22,5 m, reservoirzone met zestien lisenen tot 31,15 m, koperen opstand van 10,4 m met acht vensters tot 33,4 m en koperen tentdak tot 37,0 m. Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 36,
      reservoirM3: 400,
      ahnGroundNapM: 37.35,
      ahnTopNapM: 74.35,
      footAcrossFlatsM: 11.44,
      shaftTopAcrossFlatsM: 10.84,
      ledgeM: 18.95,
      bandTopM: 22.5,
      wallTopM: 31.15,
      atticAcrossFlatsM: 10.44,
      eaveM: 33.4,
      modelTopM: 37.0,
      photoScalePxPerM: 32,
      minimumPartM: 0.6,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Winterswijk)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/523469",
      "https://commons.wikimedia.org/wiki/File:Winterswijk,_de_Watertoren_RM523469_IMG_2610_2022-07-18_18.06.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:Water_Tower_Winterswijk.JPG (opstand en tentdak)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Winterswijk.jpg (ingang en vensterstrook)",
      "PDOK BAG-pand 0294100000392878, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

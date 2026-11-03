// Watertoren van Aalsmeer aan de oever van de Westeinderplassen (Kudelstaartseweg), gebouwd in 1926-1928 voor het
// Provinciaal Waterleidingbedrijf van Noord-Holland naar ontwerp van ir. H. Sangster (hoofdingenieur B.F. van
// Nievelt), in art-decostijl; rijksmonument 524249, sinds 1994 buiten gebruik. Volgens het register een vierkante
// toren van 50 m uit een zichtbaar gelaten betonskelet: vier zware hoekkolommen en vier lichtere kolommen halverwege
// de gevels, verbonden door koppelbalken, met paarsrode baksteen ertussen en smalle lichtopeningen naast de
// hoekkolommen. Ter hoogte van de twee hoogreservoirs (480 en 520 m³, 10,2 en 10,5 m doorsnede) krijgen de gevels
// reliëf van drie op elkaar staande, naar boven toe twee keer verbredende betonvlakken. De voet is met beton
// ommanteld; de deur aan de oostzijde en de vensters aan de andere drie zijden zitten in een geknikte parabool van
// beton. Bovenop een mutsvormige koperen kap van acht geknikte vlakken met een naald.
//
// Oorsprong op het hart van de BGT-contour van pand 0358100019103003 (symmetrisch op 1 cm) op maaiveld
// (AHN-DTM NAP +1,0 tot +1,2 rond de voet; gebruikt +1,05). De BGT-contour is in een stelsel dat 8 graden linksom
// op RD staat spiegelsymmetrisch in beide assen: lokale +X is de normaal van de oostgevel met de deur (xAxis
// [cos 8°, sin 8°]). De BAG-contour is een grove achthoek door de gevelmiddens en de voeten van de hoekkolommen.
// Plattegrond uit de BGT (op de grond): gevels op 6,2 m van het hart tot 3,93 m opzij, daar een sprong van 0,47 m
// naar binnen (de lichtspleten), afgeschuinde hoeken op u + v = 9,66 en in de diagonaal een hoekkolom van 1,1 m
// breed met een voet tot 9,1 m uit het hart; in het gevelmidden de benen van de parabool tot 0,45 m uit de gevel.
// Hoogtes uit het AHN-DSM 0,5 m (boven maaiveld): gevelrand en omgang op 42,0 m, kapvoet op 5,8 m van het hart op
// 44,66 m, kap met helling 0,8 tot 47,86 m op 1,8 m van het hart en dan steiler tot de top op 49,9 m (DSM NAP
// +51,0 in het hart, met de naald). De geledingen (koppelbalken, reliëfvlakken, parabool, voet van de hoekkolommen)
// uit de frontale foto van de oostgevel ("Watertoren Aalsmeer - panoramio - Rokus C"), met een projectieve schaal
// tussen maaiveld en gevelrand; breedtes geschaald op de BGT-gevel (7,86 m tussen de lichtspleten).
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [111996.55, 474283.69];
const DEG = 8;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 1.05; // AHN-DTM 1,0 tot 1,2 binnen 8 tot 10 m van het hart
const GROUND_ELLIPSOID = 43.96; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-03 (43,96 tot 44,25; NAP +1,05 + 42,9)

const P = {
  face: 6.2, // gevel (BGT)
  faceHalf: 3.93, // gevel tot de lichtspleet (BGT)
  slot: 5.73, // binnenkant van de lichtspleet (BGT)
  chamfer: 9.66, // afgeschuinde hoek u + v (BGT: 9,62 tot 9,68)
  finHalf: 0.55, // hoekkolom 1,1 m breed (BGT)
  finFoot: 9.1, // voet van de hoekkolom in de diagonaal (BGT 9,16)
  fin: 7.85, // hoekkolom boven de voet (AHN-DSM: 7,6 tot 7,85 m in de diagonalen boven 20 m)
  relief: 6.7, // reliëfvlakken en middenkolom (BGT parabool 6,69)
  spine: 6.95, // rib over de reliëfvlakken
  drum: 5.8, // kapvoet (AHN-DSM)
  drumChamfer: 8.91, // afgeschuinde hoek van de kap u + v (AHN: 6,3 m in de diagonaal)
};
const H = {
  footTop: 1.6, // trede aan de voet van de hoekkolom
  flareTop: 8.6, // bovenkant van de verlopende voet van de hoekkolom
  bars: [7.9, 16.2, 24.1, 32.4], // koppelbalken (foto, projectief geschaald)
  yokeTop: 6.4, // aansluiting van de parabool op de middenkolom
  door: 2.8,
  lowerRelief: 24.1, // smal reliëfvlak tot 32,4, breed vlak tot de gevelrand
  upperRelief: 32.4,
  parapet: 42.0, // gevelrand en omgang (AHN-DSM)
  reliefTop: 43.0,
  spineTop: 43.8, // punt van de middenkolom boven de gevelrand (AHN 43 tot 44)
  finTop: 44.6, // hoekkolom loopt naar binnen op tot de kapvoet
  eave: 44.66, // kapvoet (AHN-DSM 45,06 op 5,5 m, helling 0,8)
  knick: 47.86, // knik in de kapvlakken op 1,8 m van het hart
  apex: 49.9, // top van de kap (AHN NAP +51,0 met de naald)
};

// Kern: gevels op 6,2 tot 3,93 opzij, sprong naar 5,73 (lichtspleet) en de afgeschuinde hoek ertussen.
const corePoly = [];
for (let k = 0; k < 4; k++) {
  const r = (x, y) => [[x, y], [-y, x], [-x, -y], [y, -x]][k];
  corePoly.push(r(P.face, -P.faceHalf), r(P.face, P.faceHalf), r(P.slot, P.faceHalf), r(P.faceHalf, P.slot));
}
const core = prism(corePoly, BASE, H.parapet);

// ---------- hoekkolommen (diagonaal stelsel: d uit het hart, p dwars) ----------
const diag = (pts) => pts.map(([d, p, z]) => [(d - p) / Math.SQRT2, (d + p) / Math.SQRT2, z]);
const slab = (d0, d1, p, z) => [[d0, -p, z], [d1, -p, z], [d1, p, z], [d0, p, z]];
const finLow = hull(diag([...slab(6.0, P.finFoot, P.finHalf, BASE), ...slab(6.0, P.finFoot, P.finHalf, H.footTop), ...slab(6.0, P.fin, P.finHalf, H.flareTop)]));
// Boven de voet recht omhoog; de kop loopt onder 49 graden naar binnen op tot de kapvoet.
const finUp = hull(diag([...slab(6.0, P.fin, P.finHalf, H.flareTop - 0.1), ...slab(6.0, P.fin, P.finHalf, H.parapet + 0.4), ...slab(6.0, 6.5, P.finHalf, H.finTop)]));
// Koppelbalken: 3,2 m breed over de hoek, 0,9 m hoog, tot 0,3 m voor de kolom; onderzijde onder 45 graden.
const bar = (z) => hull(diag([...slab(5.5, 6.75, 1.6, z - (P.fin + 0.3 - 6.75)), ...slab(5.5, P.fin + 0.3, 1.6, z), ...slab(5.5, P.fin + 0.3, 1.6, z + 0.9)]));
const corner = union([finLow, finUp, ...H.bars.map(bar)]);
const corners = [0, 90, 180, 270].map((deg) => place(corner, { deg }));

// ---------- gevel met normaal +X (middenkolom, parabool, reliëf) ----------
const w = 5.9; // binnenkant van alle gevelonderdelen (in de kern)
const pts = (u0, u1, v0, v1, z) => [[u0, v0, z], [u1, v0, z], [u1, v1, z], [u0, v1, z]];
// Middenkolom van 1,35 m van de parabool tot boven de gevelrand, met een punt.
const pilaster = hull([...pts(w, P.relief, -0.675, 0.675, H.yokeTop - 1.0), ...pts(w, P.relief, -0.675, 0.675, H.parapet), [w, 0, H.spineTop], [P.relief, 0, H.spineTop]]);
// Geknikte parabool: van de middenkolom op 6,4 m naar een voet van 5,8 m breed (BGT 6,69 uit het hart), met de deur
// of het venster erin als nis; het driehoekige vlak boven de deur ligt in het vlak van de benen.
const PARABOLA = P.relief;
const parabola = hull([...pts(w, P.relief, -0.675, 0.675, H.yokeTop - 1.0), ...pts(w, P.relief, -0.675, 0.675, H.yokeTop), ...pts(w, PARABOLA, -2.9, 2.9, BASE), ...pts(w, PARABOLA, -2.9, 2.9, 0.2)]);
// Reliëf: smal vlak van 2,9 m en breed vlak van 4,6 m; onderkant als V onder 50 graden naar de middenkolom.
const lowerRelief = hull([...pts(w, P.relief, -0.675, 0.675, H.lowerRelief - 0.95), ...pts(w, P.relief, -1.45, 1.45, H.lowerRelief), ...pts(w, P.relief, -1.45, 1.45, H.upperRelief + 0.1)]);
const upperRelief = hull([
  ...pts(w, P.relief, -1.45, 1.45, H.upperRelief - 0.75),
  ...pts(w, P.relief, -2.3, 2.3, H.upperRelief + 0.25),
  ...pts(w, P.relief, -2.3, 2.3, H.parapet + 0.4),
  ...pts(w, P.relief, -0.45, 0.45, H.reliefTop),
]);
// Rib over de reliëfvlakken, 0,9 m breed en 0,25 m uit, onderkant onder 45 graden; tot de punt van de middenkolom.
const spine = hull([...pts(w, P.relief, -0.45, 0.45, H.lowerRelief - 0.3), ...pts(w, P.spine, -0.45, 0.45, H.lowerRelief), ...pts(w, P.spine, -0.45, 0.45, H.parapet + 0.5), [w, 0, H.spineTop], [P.spine - 0.1, 0, H.spineTop - 0.1]]);
const facade = union([pilaster, parabola, lowerRelief, upperRelief, spine]);
const facades = [0, 90, 180, 270].map((deg) => place(facade, { deg }));

// ---------- kap ----------
const drumPoly = [];
for (let k = 0; k < 4; k++) {
  const r = (x, y) => [[x, y], [-y, x], [-x, -y], [y, -x]][k];
  drumPoly.push(r(P.drum, P.drumChamfer - P.drum), r(P.drumChamfer - P.drum, P.drum));
}
const scaled = (s, z) => drumPoly.map(([x, y]) => [x * s, y * s, z]);
const knickScale = 1.8 / P.drum;
const cap = union([
  prism(drumPoly, H.parapet - 1, H.eave + 0.01),
  hull([...scaled(1, H.eave), ...scaled(knickScale, H.knick)]),
  hull([...scaled(knickScale, H.knick - 0.01), [0, 0, H.apex]]),
]);

// ---------- deur en vensters ----------
// Nis in de gevel met normaal +X op afstand f, plafond onder 56 graden naar binnen oplopend.
const niche = (f, wd, z0, z1, depth) => {
  const a = f - depth, b = f + 1.5, za = z1 + 1.5 * depth, y0 = -wd / 2, y1 = wd / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 2.25], [b, y1, z1 - 2.25]]);
};
// Dubbele deur aan de oostzijde (+X), 2,1 m breed (BGT-nis), tot 0,4 m achter de gevel; vensters van 1,6 m aan de
// andere zijden.
const openings = [
  niche(PARABOLA, 2.1, 0, H.door, PARABOLA - P.face),
  ...[90, 180, 270].map((deg) => place(niche(PARABOLA, 1.6, 0.6, 2.2, PARABOLA - P.face), { deg })),
];

const tower = union([core, ...corners, ...facades, cap]).subtract(union(openings));

await writeLandmark({
  slug: "watertoren-aalsmeer",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:betonskelet-met-reliefgevels-en-koperen-kap", tower]],
  catalog: {
    name: "Watertoren Aalsmeer",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[10, 0], [-10, 0], [0, 10], [0, -10]],
    // Ellipsoïdisch: de PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0358100019103003"],
    description:
      "Oorsprong op het hart van de BGT-contour op maaiveld (NAP +1,05 m), +X de normaal van de oostgevel met de deur (RD 8 graden). Vierkante toren met afgeschuinde hoeken (12,4 m over de gevels, BGT), vier diagonale hoekkolommen met een verlopende voet en vier koppelbalken, per gevel een middenkolom met geknikte parabool om deur of venster, smal en breed reliëfvlak met rib ter hoogte van de reservoirs, een punt boven de gevelrand op 42 m, en een koperen kap in acht vlakken met knik van 44,66 tot 49,9 m. Maten uit AHN, BGT, register en foto's.",
    realWorld: {
      publishedHeightM: 50,
      reservoirsM3: [520, 480, 160],
      reservoirDiametersM: [10.5, 10.2],
      built: "1926-1928",
      architect: "H. Sangster",
      monument: 524249,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 51.0,
      faceAcrossM: P.face * 2,
      cornerFootFromCentreM: P.finFoot,
      cornerColumnFromCentreM: P.fin,
      barsM: H.bars,
      reliefM: [H.lowerRelief, H.upperRelief, H.parapet],
      parapetM: H.parapet,
      eaveM: H.eave,
      knickM: H.knick,
      apexM: H.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Aalsmeer) (1926-1928, H. Sangster, 50 m, reservoirs 520, 480 en 160 m³)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/524249 (betonskelet met hoek- en middenkolommen en koppelbalken, reliëf in drie verbredende vlakken, parabool om deur en vensters, kap van acht geknikte koperen vlakken)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Aalsmeer_-_panoramio_-_Rokus_C.jpg (frontaal op de oostgevel met de deur: geledingen en breedtes)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_in_Aalsmeer.jpg, File:Watertoren_Aalsmeer_(4).JPG en File:Watertoren_Aalsmeer_2019.jpg (schuin op de hoeken: hoekkolommen, koppelbalken en kap)",
      "PDOK BGT-pand G0362.ae876bd6028f4e65bd3afe91a4b883f8 (BAG-pand 0358100019103003), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-03",
    ],
  },
});

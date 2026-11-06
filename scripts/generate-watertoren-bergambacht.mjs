// Watertoren "De Vijf Gemeenten" in Bergambacht (Krimpenerwaard, Zuid-Holland), gebouwd in 1937 naar een ontwerp van
// P.D. Stuurman; volgens Wikipedia 40 m hoog met een reservoir van 360 m³, rijksmonument 509521 (Dijklaan 71). Volgens het
// register een zakelijk-expressionistische toren van 45 m op een met gras begroeid talud: een vierkante schacht van vier
// verdiepingen (betonskelet, rode baksteen) met midden op elke gevel een steunbeer die op de verdieping overgaat in een
// liseen, met smalle stroken stalen vensters langs beide zijden van de liseen; de hoeken zijn onderaan verzwaard met muurtjes
// van circa 2 m. De hoofdingang in de oostgevel is een uitgemetselde rondboog met een trap; in de noord- en zuidgevel liggen
// lagere ingangen in een doorgang in het talud. Het ronde reservoir rust op uitkragende witte betonnen liggers, heeft
// onder- en bovenaan een witte betonnen schijf en een helmdak met koperen platen.
//
// BAG-pand 0491100001310888 (bouwjaar 1960 in de BAG, 120 m² grondvlak in de 3D BAG) is de toren; het id uit de taak klopt.
// De contour staat op RD -2,66 graden (alle 36 zijden binnen 0,1 graad) en is in het stelsel van de toren een vierkant van
// 9,85 m (gevels op -4,67, 5,18, -4,90 en 4,96 van het bbox-midden) met: hoekblokken die 0,7 à 0,9 m uitsteken en 2,75 m
// langs elke gevel lopen (de muurtjes), een smalle steunbeer van 0,6 m breed en 1,3 m diep midden op de west- en zuidgevel,
// een blok van 3,5 m breed en 1,26 m diep midden op de noordgevel (de lagere ingang) en een blok van 3,8 m breed en 0,5 m
// diep midden op de oostgevel (de rondboog). Oorsprong op het hart van het vierkant [113510.65, 437634.03]; het hart van de
// koepel in het AHN-DSM ligt op [113510.6 à 113510.7, 437634.0 à 437634.1]. +X is de normaal van de oostgevel (hoofdingang).
//
// Hoogtes uit het AHN (2026-11-06): koepeltop NAP +44,22 (3D BAG-nok 44,03), kroonlijst NAP +36,4 (3D BAG dak-min 36,35),
// koepelrand in het DSM r 5,25 op 38, r 4,45 op 40, r 2,85 op 42; kroonlijst r 6,0. Het talud ligt rond de voet op NAP 0 à
// +0,3 (DTM, 5 tot 7 m van het hart), het polderpeil rond het talud op -1,0; aan de noordkant zakt de ingegraven doorgang
// tot -1,1. PDOK-terrein (ellipsoïdisch) op de groundSamplePoints: (7, 0) 43,915, (0, 7) 42,482, (-7, 0) 43,602,
// (0, -7) 43,47; het verschil met het AHN-DTM is 43,53 tot 43,65, dus z = 0 ligt op NAP -1,12, het peil van de doorgang
// en van de 3D BAG (maaiveld -0,97). Het talud bedekt de voet aan de andere zijden 1,3 à 1,6 m.
//
// De opstand uit de Commons-foto's "Watertoren Bergambacht.jpg" (2010, vanuit het oosten), "Bergambacht - Watertoren m
// park.jpg" (2007) en "Exterieur OVERZICHT - Bergambacht - 20302396 - RCE.jpg": trommel circa 0,9 maal de kroonlijst,
// schachtkop, consoles, witte schijf, vensterstroken en ingang met de fotoschaal tussen kroonlijst en top (AHN) en de voet
// geschat. Printbaar op 1:1000 zonder steun: uitkraging van de trommel, schijf, consoles en kroonlijst hebben een onderkant
// van 47 graden, vensters en deuren zijn blinde nissen met een plafond van 63 graden, de steunberen lopen onder 60 graden
// terug naar de liseen, en de koepel loopt naar binnen.
import { Manifold, CrossSection, ccw, hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [113510.65, 437634.03];
const DEG = -2.7;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const T47 = Math.tan((47 * Math.PI) / 180); // ondervlakken onder 47 graden: net steiler dan de printhoek
const SEG = 64;
const GEOID = 43.6; // ellipsoïdisch min NAP hier (PDOK-terrein min AHN-DTM: 43,53 tot 43,65)
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: (7, 0) 43,915, (0, 7) 42,482
// (de ingegraven doorgang naar de noordingang), (-7, 0) 43,602, (0, -7) 43,47. Het PDOK-pand staat op 42,6.
const GROUND_ELLIPSOID = 42.482;
const GROUND_SAMPLES = [[7, 0], [0, 7], [-7, 0], [0, -7]];
const NAP0 = +(GROUND_ELLIPSOID - GEOID).toFixed(2); // NAP-hoogte van z = 0: -1,12
const z = (nap) => +(nap - NAP0).toFixed(2); // NAP → modelhoogte

// ---------- maten ----------
const S = 4.93; // halve schachtbreedte (BAG 9,85 m)
const R = { drum: 5.4, disc: 5.55, cornice: 6.0, dome: 5.3 }; // stralen trommel, schijf, kroonlijst, koepelvoet
const H = {
  cornerWall: z(2.1), // hoekmuurtjes circa 2 m boven het talud (register)
  butt: z(4.0), // steunbeer vol tot hier, daarna onder 60 graden terug naar de liseen
  shaftTop: z(26.9), // schachtkop (foto)
  console: [z(25.8), z(29.2)], // witte liggers (foto)
  corbel: z(26.3), // onderkant van de uitkraging van de trommel
  disc: [z(28.3), z(28.8)], // witte schijf onder de trommel (foto)
  slitShaft: [z(5.8), z(23.2)], // vensterstroken langs de lisenen (foto)
  slitDrum: [z(30.0), z(34.2)], // vensterstroken in de trommel (foto)
  corniceFoot: z(35.2), // onderkant van de kroonlijst (foto)
  cornice: z(36.4), // bovenkant kroonlijst (AHN)
  top: z(44.22), // top van het helmdak (AHN)
};

// ---------- trommel, schijf, kroonlijst en helmdak ----------
// Eén omwenteling van een radiaal profiel [r, z]: uitkraging onder 47 graden van de schacht naar de trommel, witte schijf,
// trommel, kroonlijst met een onderkant van 47 graden en het helmdak (profiel uit de DSM-hoogtelijnen, 0,25 m binnenwaarts
// gecorrigeerd voor de pixelgrootte).
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const dome = [[5.3, 37.0], [5.1, 38.2], [4.6, 39.6], [3.9, 40.8], [3.0, 41.9], [2.0, 42.9], [1.0, 43.7], [0.5, 44.05]].map(([r, nap]) => [r, z(nap)]);
const round = rev([
  [0, H.corbel], [S - 0.03, H.corbel], [R.drum, H.corbel + (R.drum - S + 0.03) * T47],
  [R.drum, H.disc[0]], [R.disc, H.disc[0] + (R.disc - R.drum) * T47], [R.disc, H.disc[1]], [R.drum, H.disc[1]],
  [R.drum, H.corniceFoot], [R.cornice, H.corniceFoot + (R.cornice - R.drum) * T47], [R.cornice, H.cornice],
  [R.dome, H.cornice], ...dome, [0, H.top],
]);

// ---------- schacht ----------
const shaft = box(-S, -S, BASE, S, S, H.shaftTop);
// Hoekmuurtjes: 0,8 m buiten de gevels en 2,75 m langs elke gevel (BAG), tot circa 2 m boven het talud.
const cornerWall = box(S - 2.75, S - 2.75, BASE, S + 0.8, S + 0.8, H.cornerWall);
const cornerWalls = union([0, 90, 180, 270].map((deg) => place(cornerWall, { deg })));

// Per gevel in het stelsel met de normaal op +X; y langs de gevel.
// Liseen van 1,0 m breed en 0,3 m dik van de voet tot onder de ligger.
const lisene = box(S - 0.1, -0.5, BASE, S + 0.3, 0.5, H.console[0] + 0.05);
// Steunbeer (west, zuid, noord): BAG 0,6 m breed en 1,3 m diep, hier 0,9 m breed; vol tot 4,0 m boven NAP en dan onder
// 60 graden terug naar de liseen.
const buttress = hull([
  [S - 0.1, -0.45, BASE], [S + 1.3, -0.45, BASE], [S - 0.1, 0.45, BASE], [S + 1.3, 0.45, BASE],
  [S + 1.3, -0.45, H.butt], [S + 1.3, 0.45, H.butt],
  [S + 0.3, -0.45, H.butt + Math.tan(Math.PI / 3)], [S + 0.3, 0.45, H.butt + Math.tan(Math.PI / 3)],
  [S - 0.1, -0.45, H.butt + Math.tan(Math.PI / 3)], [S - 0.1, 0.45, H.butt + Math.tan(Math.PI / 3)],
]);
// Witte ligger midden op de gevel, boven de liseen: 1,2 m breed, 0,67 m voor de liseen, onderkant 47 graden.
const consoleMid = hull([
  [S - 0.9, -0.6, H.console[0]], [S - 0.9, 0.6, H.console[0]], [S + 0.3, -0.6, H.console[0]], [S + 0.3, 0.6, H.console[0]],
  [S + 0.97, -0.6, H.console[0] + 0.67 * T47], [S + 0.97, 0.6, H.console[0] + 0.67 * T47],
  [S + 0.97, -0.6, H.console[1]], [S + 0.97, 0.6, H.console[1]], [S - 0.9, -0.6, H.console[1]], [S - 0.9, 0.6, H.console[1]],
]);
// Blinde nis in het vlak met normaal +X op afstand f, breedte 2·w, van z0 tot z1, plafond van 63 graden naar binnen.
const niche = (f, w, z0, z1, depth = 0.3) => hull([
  [f - depth, -w, z0], [f + 0.6, -w, z0], [f - depth, w, z0], [f + 0.6, w, z0],
  [f - depth, -w, z1 + 2 * depth], [f - depth, w, z1 + 2 * depth], [f, -w, z1], [f, w, z1],
  [f + 0.6, -w, z1 - 1.2], [f + 0.6, w, z1 - 1.2],
]);
// Vensterstroken langs beide zijden van de liseen (0,45 m breed; in werkelijkheid circa 0,35).
const slits = union([-1, 1].map((s) => niche(S, 0.225, H.slitShaft[0], H.slitShaft[1]).translate([0, s * 0.725, 0])));
// Vierruitsvensters naast de steunbeer op de begane grond.
const groundWindows = union([-1, 1].map((s) => niche(S, 0.45, z(2.5), z(4.0)).translate([0, s * 1.55, 0])));

// Oostgevel: uitgemetselde rondboog van 3,7 m breed en 0,5 m diep met de deur en een trap.
const ARCH = { r: 1.85, c: z(3.0) };
const arcPts = Array.from({ length: 17 }, (_, k) => {
  const a = (Math.PI * k) / 16;
  return [ARCH.r * Math.cos(a), ARCH.c + ARCH.r * Math.sin(a)];
});
const portal = hull([S - 0.1, S + 0.5].flatMap((x) => [[x, -ARCH.r, BASE], [x, ARCH.r, BASE], ...arcPts.map(([y, zz]) => [x, y, zz])]));
const sill = z(1.6);
const stairs = union([
  box(S + 0.4, -1.1, BASE, S + 1.47, 1.1, sill), // bordes voor de deur
  box(S + 1.4, -1.1, BASE, S + 2.37, 1.1, sill - 0.35),
  box(S + 2.3, -1.1, BASE, S + 3.27, 1.1, sill - 0.7),
  box(S + 3.2, -1.1, BASE, S + 4.17, 1.1, sill - 1.05),
]);
const east = union([portal, stairs]);
const eastCuts = union([niche(S + 0.5, 0.6, sill, z(3.5), 0.35), slits]);

// Noordgevel: blok van de lagere ingang (BAG 3,5 × 1,26 m) met een rechtgesloten deur, en de steunbeer erboven.
const northBlock = box(S - 0.1, -1.75, BASE, S + 1.26, 1.75, z(2.3));
const north = union([northBlock, buttress]);
const northCuts = union([niche(S + 1.26, 0.5, 0, 2.3), slits, groundWindows]);
// Zuidgevel: steunbeer en een lagere deur naast de steunbeer; westgevel: steunbeer.
const southCuts = union([niche(S, 0.5, 0, 2.3).translate([0, -1.55, 0]), slits, groundWindows]);
const westCuts = union([slits, groundWindows]);

// Gevels: oost 0, noord 90, west 180, zuid 270 graden.
const faces = union([
  ...[0, 90, 180, 270].map((deg) => place(union([lisene, consoleMid]), { deg })),
  east,
  place(north, { deg: 90 }),
  place(buttress, { deg: 180 }),
  place(buttress, { deg: 270 }),
]);
const faceCuts = union([
  eastCuts,
  place(northCuts, { deg: 90 }),
  place(westCuts, { deg: 180 }),
  place(southCuts, { deg: 270 }),
]);

// ---------- hoeken en trommel ----------
// Witte ligger op elke schachthoek (1,2 × 1,2 m) onder een liseen van de trommel op de diagonaal.
const cornerConsole = box(S - 1.2, S - 1.2, H.shaftTop - 0.1, S, S, H.console[1]);
const drumPilaster = place(box(R.drum - 0.2, -0.45, H.disc[1] - 0.05, R.drum + 0.25, 0.45, H.corniceFoot + 0.3), { deg: 45 });
const corners = union([0, 90, 180, 270].map((deg) => place(union([cornerConsole, drumPilaster]), { deg })));
// Vensterstroken in de trommel: twee per kwadrant, 14 graden naast het midden van elke gevel.
const drumSlits = union([0, 90, 180, 270].flatMap((deg) => [-14, 14].map((d) => place(niche(R.drum, 0.25, H.slitDrum[0], H.slitDrum[1]), { deg: deg + d }))));

const all = union([shaft, cornerWalls, faces, corners, round])
  .subtract(union([faceCuts, drumSlits]))
  .trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-bergambacht",
  base: BASE,
  nodes: [["building:watertoren-schacht-steunberen-lisenen-liggers-reservoir-kroonlijst-en-helmdak", all]],
  catalog: {
    name: "Watertoren Bergambacht",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: GROUND_SAMPLES,
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0491100001310888"],
    description:
      "Oorsprong op het hart van de vierkante schacht op het peil van de noordelijke doorgang (NAP circa -1,12 m; het talud bedekt de voet elders 1,3 à 1,6 m), +X op RD -2,7 graden, de normaal van de oostgevel met de hoofdingang. Bakstenen schacht van 9,85 m met hoekmuurtjes, een steunbeer met liseen en vensterstroken midden op elke gevel, rondboog met trap in het oosten en de lagere ingang in het noorden; witte liggers onder een ronde trommel van 10,8 m met witte schijf, lisenen en vensterstroken, kroonlijst van 12 m op 37,5 m en een koperen helmdak tot 45,3 m. Maten uit AHN, BAG en foto's.",
    realWorld: {
      built: 1937,
      architect: "P.D. Stuurman",
      publishedHeightM: 40,
      registerHeightM: 45,
      reservoirM3: 360,
      rijksmonument: 509521,
      groundNapM: NAP0,
      ahnTopNapM: 44.22,
      shaftWidthM: 2 * S,
      drumDiameterM: 2 * R.drum,
      corniceDiameterM: 2 * R.cornice,
      shaftTopM: H.shaftTop,
      corniceM: H.cornice,
      topM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Bergambacht) (1937, P.D. Stuurman, 40 m, 360 m³)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/509521 (45 m, steunberen en lisenen, hoekmuurtjes, ingangen oost, noord en zuid, liggers, helmdak)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Bergambacht.jpg (2010, oostgevel met rondboog en trap, liggers, trommel en helmdak)",
      "https://commons.wikimedia.org/wiki/File:Bergambacht_-_Watertoren_m_park.jpg (2007)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Bergambacht_-_20302396_-_RCE.jpg (RCE)",
      "PDOK BAG-pand 0491100001310888, 3D BAG, AHN DSM/DTM 0,5 m, luchtfoto Actueel_orthoHR en PDOK-terrein, 2026-11-06",
    ],
  },
});

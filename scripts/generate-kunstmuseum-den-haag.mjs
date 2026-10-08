// Genereert een gesloten 3D-model van het Kunstmuseum Den Haag (het voormalige
// Gemeentemuseum van Berlage, 1935), opgebouwd uit dakvlakken en blokken:
//  - het hoofdgebouw met de glazen lichtkap (+12,45 m) binnen een gootring (+10,8 m),
//    omringd door vier beuken van glazen zadeldaken (8,6 m breed, nok +13,4 m, kilgoot
//    +11,2 m) die elkaar in kilgoten kruisen, een afgewalmde noordwesthoek, een noordelijk en
//    een zuidelijk dwarsdak met afgewalmd eind, lage glaskappen en een dwarsvleugel met drie
//    lantaarns met piramidedak;
//  - de oostelijke aanbouw met platte daken, een glaskap, twee vijfhoekige vleugels en
//    twee bakstenen schoorstenen (+26,7 m);
//  - het zuidelijk deel als reeks aaneengeschakelde blokken met plat dak (+3,8 tot +17,2 m);
//  - de galerij over de vijver naar het westen met een licht hellend dak.
// Nok-, goot- en blokhoogtes zijn uit het AHN-DSM (0,25 m, alleen vlakke of geldige cellen:
// de glasdaken geven een ruw DSM), de indeling uit de PDOK-luchtfoto en de BAG-contour.
// Het Mapbox-model is niet gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-kunstmuseum-den-haag.mjs              # 1:1000 (standaard)
//   node scripts/generate-kunstmuseum-den-haag.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (79170,43, 456286,21), het zwaartepunt van het
// BAG-pand, op maaiveldniveau (NAP +2,8 m), Z omhoog. +X loopt langs de
// gevels van het hoofdgebouw naar het oosten (15,7 graden tegen de klok in
// vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden. Het complex zelf
// staat nog 2,1 graden verder gedraaid; het script bouwt het in een eigen
// gebouwstelsel en draait het aan het eind (THETA).
//
// Bronnen: PDOK BAG-pand 0518100001640602 (het hele museumcomplex); AHN DSM/DTM
// 0,5 m (PDOK WCS): de dakhoogtes en het maaiveld (NAP +2,8 m); Wikipedia; PDOK
// luchtfoto. Weggelaten: de glasroeden en dakgoten, installaties, parapetten en
// alle gevelreliëf.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kunstmuseum-den-haag");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Convexe veelhoek in plan met een dakvlak z = a x + b y + c, vanaf z0 omhoog.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([
    ...pts.map(([x, y]) => [x, y, z0]),
    ...pts.map(([x, y]) => [x, y, a * x + b * y + c]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);

const SLUG = "kunstmuseum-den-haag";

// ---------- maten (meters, z = hoogte boven het maaiveld op NAP +2,8 m) ----------
const GROUND_NAP = 2.8;
const ORIGIN = [79170.43, 456286.21];
const X_AXIS = [0.962692, 0.2706]; // RD-richting 15,7 graden, langs de gevels van het hoofdgebouw
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// Het hele complex staat 2,1 graden gedraaid ten opzichte van de modelas: gevels, goten en
// nokken lopen exact evenwijdig in het gebouwstelsel (x langs de gevel, y dwars, z omhoog).
// Alles hieronder is in dat stelsel; aan het eind wordt het geheel om de oorsprong gedraaid.
const THETA = 2.1;
// Overlap tussen aangrenzende stukken (rakende vlakken laten spleten zonder dikte achter).
const LIFT = 0.02;

// BAG-contour van het hele complex in het gebouwstelsel (uit de BAG-ring gedraaid en op 0,1 m
// rechtgetrokken; oppervlak 7425 m2 tegenover 7428 m2 in de BAG).
const FOOTPRINT = [[66.6,22.6],[66.6,19.3],[63.3,19.3],[63.3,20.0],[61.6,20.0],[61.6,15.0],[62.5,15.0],[62.5,11.3],[55.5,11.3],[55.5,15.0],[44.3,15.0],[44.3,15.9],[39.0,15.9],[39.0,-6.4],[17.0,-6.4],[17.0,-8.6],[5.4,-8.6],[5.4,-6.4],[-7.3,-6.4],[-7.3,-19.1],[-4.0,-19.1],[-4.0,-19.8],[-1.8,-19.8],[-1.8,-20.6],[0.4,-20.6],[0.4,-21.4],[2.6,-21.4],[2.6,-22.2],[11.5,-22.2],[11.5,-23.8],[12.1,-23.8],[12.8,-24.3],[12.8,-28.8],[12.1,-29.2],[11.5,-29.2],[11.5,-30.8],[2.6,-30.8],[2.6,-31.6],[0.4,-31.6],[0.4,-32.4],[-1.8,-32.4],[-1.8,-33.3],[-4.0,-33.3],[-4.0,-34.0],[-7.3,-34.0],[-7.3,-37.8],[-4.0,-37.8],[-4.0,-46.1],[-12.0,-46.1],[-12.0,-40.6],[-29.0,-40.6],[-29.0,-38.5],[-31.2,-38.5],[-31.2,-36.2],[-36.4,-36.2],[-36.4,-31.6],[-37.5,-31.6],[-38.4,-30.6],[-38.4,-29.2],[-74.4,-29.2],[-74.4,-23.8],[-38.4,-23.8],[-38.4,-22.4],[-37.5,-21.4],[-36.4,-21.4],[-36.4,-16.9],[-33.1,-16.9],[-33.1,-6.4],[-35.3,-6.4],[-35.3,2.9],[-33.1,2.9],[-33.1,24.4],[-34.2,24.4],[-34.2,33.8],[-33.1,33.8],[-33.1,55.2],[-35.3,55.2],[-35.3,65.1],[-33.6,66.7],[-23.7,66.7],[-23.7,64.5],[5.4,64.5],[5.4,65.8],[7.5,67.9],[15.0,67.9],[17.0,65.8],[17.0,64.5],[39.0,64.5],[39.0,42.3],[44.3,42.3],[44.3,43.2],[55.5,43.2],[55.5,46.9],[62.5,46.9],[62.5,43.2],[61.6,43.2],[61.6,38.2],[63.3,38.2],[63.3,38.9],[66.6,38.9],[66.6,35.6],[65.9,35.6],[65.9,22.6]];

// ---------- hulpfuncties voor de daken ----------
// Massief blok van de onderkant tot z, 0,02 m verbreed zodat buren overlappen.
const blk = (x0, x1, y0, y1, z) => box(x0 - LIFT, x1 + LIFT, y0 - LIFT, y1 + LIFT, BASE, z);
// Zadeldak als profiel [dwars, z]: nok op c, halve breedte half, goothoogtes aan beide zijden.
const gable = (c, half, zr, zLo, zHi = zLo) => [
  [c - half - LIFT, BASE],
  [c + half + LIFT, BASE],
  [c + half + LIFT, zHi],
  [c, zr],
  [c - half - LIFT, zLo],
];
// Vierkante of rechthoekige piramide op een hoogte z0 met de top op z1.
const pyramid = (cx, cy, w, d, z0, z1) =>
  Manifold.hull([
    [cx - w / 2, cy - d / 2, z0],
    [cx + w / 2, cy - d / 2, z0],
    [cx + w / 2, cy + d / 2, z0],
    [cx - w / 2, cy + d / 2, z0],
    [cx, cy, z1],
  ]);
const tower = ([cx, cy], rLow, rHigh, z0, z1, segments = 24) =>
  Manifold.cylinder(z1 - z0, rLow, rHigh, segments).translate([cx, cy, z0]);

// ---------- het hoofdgebouw van Berlage ----------
// Vier beuken van glazen zadeldaken (8,6 m breed, nok +13,4 m, kilgoot +11,2 m, helling 27 graden)
// rond de gootring (+10,8 m) en de lichtkap (+12,45 m). Waar een nok een andere kruist ontstaan
// vanzelf kilgoten langs de diagonalen (de vereniging van de zadeldaken).
const GUT = 10.8; // gootvlak rond de lichtkap
const RIDGE = 13.4; // nok van de glazen zadeldaken
const VALLEY = 11.2; // kilgoot tussen twee zadeldaken
const HALF = 4.3; // halve breedte van een dakbeuk
const PLATE = 11.7; // plat gootdeel langs de noord- en zuidgevel
const PLATE_W = 11.4; // idem langs de westgevel
const PITCH = (RIDGE - VALLEY) / HALF;
const X_W = -33.1; // westgevel
const X_E = 39.0; // oostgevel
const Y_S = -6.4; // zuidgevel
const Y_N = 64.5; // noordgevel
const N1 = 51.1; // noordbeuk, binnenste nok (y)
const N2 = 59.7; // noordbeuk, buitenste nok
const S1 = 6.9; // zuidbeuk, binnenste nok
const S2 = -1.7; // zuidbeuk, buitenste nok
const W_RIDGE = -28.5; // nok van de westbeuk (x)
const E_RIDGE = 34.65; // nok van de oostbeuk (lager en vlakker dan de andere beuken)
const LANT_N = 11.25; // as van het noordelijke dwarsdak (lantaarn)
const LANT_S = 11.2; // as van het zuidelijke dwarsdak

const main = [];
// Onderbouw tot het gootvlak rond de lichtkap.
main.push(
  blk(X_W, X_E, 2.9, 24.4, GUT),
  blk(X_W, X_E, 33.8, Y_N, GUT),
  blk(-26.2, X_E, 24.4, 33.8, GUT),
  blk(-12.0, X_E, Y_S, 2.9, GUT),
  blk(5.4, 17.0, -8.6, Y_S, GUT),
);
// Lichtkap: vlak glasdak met roeden, 42,3 bij 28,1 m, op +12,45 m.
main.push(blk(-12.15, 30.45, 14.85, 43.25, 12.45));

// Noordbeuk: twee zadeldaken met de nok langs x. De buitenste (y = 59,7) loopt om het dwarsdak heen.
const northOuter = [
  [N2 - HALF - LIFT, BASE],
  [Y_N, BASE],
  [Y_N, PLATE],
  [N2 + (RIDGE - PLATE) / PITCH, PLATE],
  [N2, RIDGE],
  [N2 - HALF - LIFT, VALLEY],
];
main.push(
  profileX(gable(N1, HALF, RIDGE, VALLEY), W_RIDGE, X_E),
  profileX(northOuter, W_RIDGE, 5.6),
  profileX(northOuter, 16.9, X_E),
);
// Zuidbeuk: twee zadeldaken; de buitenste (y = -1,7) en het dwarsdak onderbreken elkaar.
const southOuter = [
  [Y_S, BASE],
  [S2 + HALF + LIFT, BASE],
  [S2 + HALF + LIFT, VALLEY],
  [S2, RIDGE],
  [S2 - (RIDGE - PLATE) / PITCH, PLATE],
  [Y_S, PLATE],
];
main.push(
  profileX(gable(S1, HALF, RIDGE, VALLEY), -16.5, X_E),
  profileX(southOuter, -12.0, 5.6),
  profileX(southOuter, 16.9, X_E),
);
// Westbeuk (nok langs y, x = -28,5): zuideinde afgewalmd; de binnenplaats en de dwarsvleugel onderbreken hem.
// Hij loopt door tot de kruising met de buitenste noordnok (y = 59,7); daar ligt de afgewalmde noordwesthoek.
const westOuter = [
  [X_W, BASE],
  [W_RIDGE + HALF + LIFT, BASE],
  [W_RIDGE + HALF + LIFT, VALLEY],
  [W_RIDGE, RIDGE],
  [W_RIDGE - (RIDGE - PLATE_W) / PITCH, PLATE_W],
  [X_W, PLATE_W],
];
const southHip = [
  [2.9, BASE],
  [N2 + 1, BASE],
  [N2 + 1, 30],
  [2.9 + (30 - VALLEY) / PITCH, 30],
  [2.9, VALLEY],
];
main.push(
  profileY(westOuter, 2.9, 24.4).intersect(profileX(southHip, X_W - 1, -24)),
  profileY(westOuter, 33.8, N2),
  // Noordwesthoek: de vereniging van de twee dakvlakken met afgewalmde hoek (kruising van westnok en noordnok).
  profileY(westOuter, N2 - 1, Y_N).intersect(profileX(northOuter, X_W, W_RIDGE + HALF + 0.5)),
);
// Oostbeuk (nok langs y, x = 34,65).
main.push(profileY(gable(E_RIDGE, 4.35, 12.9, 11.9), 19.2, 38.7), blk(30.3, X_E, 15.0, 19.3, 11.4), blk(30.3, X_E, 38.6, 43.2, 11.4));

// Dwarsdak aan de noordzijde: zadeldak met de nok langs y (x = 11,25, +15,2 m), aan het noordeinde afgewalmd.
main.push(
  profileY(gable(LANT_N, 5.65, 15.2, VALLEY), 55.3, 67.9).intersect(
    profileX(
      [
        [55.3, BASE],
        [67.9, BASE],
        [67.9, 12.0],
        [63.7, 12.0],
        [58.4, 15.2],
        [55.3, 15.2],
      ],
      5.4,
      17.1,
    ),
  ),
);
// Dwarsdak aan de zuidzijde (nok x = 11,2, +14,6 m), aan het zuideinde afgewalmd.
main.push(
  profileY(gable(LANT_S, 5.8, 14.6, VALLEY), -8.6, 2.8).intersect(
    profileX(
      [
        [-8.6, BASE],
        [2.8, BASE],
        [2.8, 14.6],
        [-3.0, 14.6],
        [-8.6, 11.4],
      ],
      5.3,
      17.1,
    ),
  ),
);

// Lage glaskappen aan de westzijde van de lichtkap (zadeldak +11,9 m, 12 graden).
main.push(
  profileY(gable(-20.4, 4.0, 11.9, 11.0, 10.9), 3.2, 21.7),
  profileY(gable(-20.4, 4.0, 11.9, 11.45, 10.9), 37.3, 46.6),
);
// Dwarsvleugel aan de westkant (x -25,6 tot -17,8, +12,5 m): een smalle glasnok langs y (x -23 tot -19,8, +13,9 m) met
// drie lantaarns met piramidedak, en aan beide zijden een afhellend dakvlak naar de goot.
main.push(
  blk(-25.6, -17.8, 22.3, 35.8, 12.5),
  profileY([[-27.0, BASE], [-25.5, BASE], [-25.5, 12.5], [-27.0, 11.0]], 22.3, 35.8),
  profileY([[-17.9, BASE], [-14.6, BASE], [-14.6, 10.8], [-17.9, 12.5]], 22.3, 35.8),
  profileY(gable(-21.4, 1.6, 13.9, 12.5), 22.3, 35.8),
);
for (const y of [23.4, 28.6, 34.4]) {
  main.push(blk(-23.2, -19.6, y - 1.8, y + 1.8, 14.4), pyramid(-21.4, y, 3.6, 3.6, 14.3, 15.5));
}
// Binnenplaats met het lage dak (+9,5 m) en de kilgoot ernaast aan de westzijde.
main.push(blk(-34.2, -32.2, 24.4, 33.8, 8.3), blk(-32.2, -29.2, 24.4, 33.8, 9.5), blk(-29.2, -26.2, 24.4, 33.8, 11.3));
// Lage aanbouwen in de noordwesthoek.
main.push(blk(-35.3, -33.1, 55.2, 65.1, 10.7), blk(-34.0, -24.5, Y_N, 65.6, 10.3), blk(-34.0, -24.5, 65.5, 66.7, 7.0));
// Lage blokken op de zuidwesthoek van het hoofdgebouw en de hoge toren (+17,2 m).
main.push(
  blk(-35.3, -29.2, -7.0, 2.9, 9.47),
  blk(-29.2, -23.5, -7.4, 2.9, 10.8),
  blk(-23.7, -17.3, -6.8, 2.8, 17.17),
  blk(-24.4, -16.6, 2.5, 3.8, 12.9),
  profileY([[-26.7, BASE], [-23.5, BASE], [-23.5, 12.9], [-24.3, 12.9], [-26.7, 10.8]], -7.0, 2.9),
  profileY([[-17.5, BASE], [-13.9, BASE], [-13.9, 10.8], [-16.3, 12.4], [-17.5, 12.9]], -7.0, 2.9),
  blk(-17.5, -12.0, -7.4, 2.7, 10.8),
);

// ---------- zuidelijk deel: aaneengeschakelde blokken met plat dak (x0, x1, y0, y1, hoogte) ----------
const SOUTH_BLOCKS = [
  [-37.0, -26.8, -24.2, -17.0, 9.47], // westelijk blok
  [-37.0, -26.8, -28.8, -24.4, 8.77],
  [-37.0, -26.9, -41.0, -29.4, 9.47],
  [-26.9, -24.5, -41.0, -32.4, 9.47],
  [-26.8, -14.2, -32.3, -22.0, 13.87], // hoog middenblok
  [-24.4, -16.6, -35.3, -32.3, 11.67],
  [-24.4, -16.6, -41.0, -35.2, 10.57],
  [-16.5, -7.3, -39.3, -33.4, 9.47],
  [-16.5, -12.3, -41.0, -39.2, 9.47],
  [-12.3, -4.0, -46.1, -38.0, 6.37],
  [-24.3, -16.7, -20.4, -6.6, 11.92], // ruggengraat met lichtstroken
  [-29.2, -24.4, -20.4, -7.6, 8.9],
  [-33.1, -29.5, -17.0, -7.8, 6.3], // terras met pergola
  [-16.7, -12.0, -20.6, -7.6, 9.1],
  [-12.0, -7.2, -19.9, -14.4, 9.47],
  [-12.0, -7.4, -14.5, -6.6, 8.9],
  [-14.2, -9.4, -33.4, -20.6, 8.85],
  [-9.4, 2.5, -34.2, -19.8, 8.57], // groot blok met de getrapte oostrand
  [2.5, 8.0, -31.4, -23.2, 7.47], // terrassen aan het oosteinde
  [8.0, 9.7, -30.0, -24.2, 5.8],
  [9.7, 11.8, -30.8, -23.8, 4.3],
  [11.8, 13.0, -29.2, -24.0, 3.8],
  [2.5, 11.5, -23.9, -22.2, 5.0],
  [-26.8, -14.2, -22.1, -20.3, 9.5],
  // Kleine dakopbouwen (liftkoppen en trappenhuizen) op de platte daken.
  [-10.6, -8.4, -27.3, -25.0, 9.7],
  [-12.6, -10.7, -21.6, -19.0, 10.3],
  [-12.6, -11.0, -34.3, -31.5, 10.35],
];
// De blokken grijpen 0,15 m in elkaar zodat het geheel een stuk blijft.
const south = SOUTH_BLOCKS.map(([x0, x1, y0, y1, z]) => blk(x0 - 0.15, x1 + 0.15, y0 - 0.15, y1 + 0.15, z));

// ---------- oostelijke aanbouw ----------
const east = [];
east.push(blk(44.3, 62.5, 15.0, 43.2, 4.8), blk(55.5, 62.5, 11.3, 19.6, 5.4), blk(55.5, 62.5, 38.0, 46.9, 5.4));
east.push(blk(54.0, 66.6, 19.3, 38.9, 6.1));
// Glaskap met zadeldak, nok langs y (x = 50,5), 5,8 m, aan beide einden afgewalmd.
east.push(
  profileY(gable(50.5, 3.0, 5.8, 4.9), 18.4, 41.6).intersect(
    profileX(
      [
        [18.4, BASE],
        [41.6, BASE],
        [41.6, 4.8],
        [39.4, 5.8],
        [20.6, 5.8],
        [18.4, 4.8],
      ],
      46,
      55,
    ),
  ),
);
// Twee rijen installaties op het dak van de aanbouw.
east.push(blk(57.0, 59.3, 25.3, 32.9, 6.5), blk(60.4, 62.6, 24.2, 33.6, 6.7));
// Het lage blok naast het hoofdgebouw (+11,7 m) met twee vijfhoekige vleugels (+15,8 m).
east.push(blk(39.0, 44.4, 15.9, 42.3, 11.7), blk(39.0, 45.3, 25.0, 32.6, 12.9));
for (const [y0, y1] of [
  [19.5, 25.7],
  [31.8, 38.0],
]) {
  const ym = (y0 + y1) / 2;
  east.push(
    prism(
      [
        [38.3, y0],
        [45.1, y0],
        [47.8, ym],
        [45.1, y1],
        [38.3, y1],
      ],
      BASE,
      15.8,
    ),
  );
}
// Twee bakstenen schoorstenen op het dak van de aanbouw (+26,7 m).
const chimneys = [[64.9, 21.0], [64.9, 37.2]].map((c) =>
  Manifold.union([tower(c, 1.5, 0.95, 5.9, 26.7), tower(c, 0.9, 1.15, 25.3, 25.7), tower(c, 1.15, 1.15, 25.7, 26.7)]),
);
east.push(...chimneys);

// ---------- galerij over de vijver naar het westen ----------
// Lang smal paviljoen met een licht hellend (koperen) zadeldak: nok +5,15 m, goot +4,75 m.
const gallery = profileX(gable(-26.5, 2.7, 5.15, 4.75), -74.4, -34.0);

// ---------- gebouw ----------
const bld = Manifold.union([...main, ...south, ...east, gallery]);
const complex = Manifold.intersection([bld, prism(FOOTPRINT, BASE - 1, 40)]).rotate([0, 0, THETA]);
const nodes = [["building:museum", complex]];
const all = complex;

// Maaiveld (AHN NAP +2,8 m) rond het complex (modelstelsel).
const GROUND_SAMPLES = [[0, 76], [-30, 76], [40, -20], [-35, -45]];

const META = {
  name: "Kunstmuseum Den Haag",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0518100001640602"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (79170,43, 456286,21), het zwaartepunt van het BAG-pand, op het maaiveld (NAP +2,8 m), +X langs de gevels van het hoofdgebouw naar het oosten (15,7 graden vanaf de RD-X-as) en +Y loodrecht daarop. Eén node building:museum: het hoofdgebouw van Berlage met de platte glazen lichtkap (+12,45 m) in een gootring (+10,8 m), omringd door vier beuken van glazen zadeldaken van 8,6 m breed (nok +13,4 m, kilgoot +11,2 m, 27 graden) met kilgoten in de kruisingen, een afgewalmde noordwesthoek, twee dwarsdaken met afgewalmd eind (noord +15,2 m, zuid +14,6 m), lage glaskappen en een dwarsvleugel met drie lantaarns met piramidedak; het hoge blok (+17,2 m) aan de zuidwestzijde; de aanbouw met platte daken, een afgewalmde glaskap, twee vijfhoekige vleugels (+15,8 m) en twee schoorstenen (+26,7 m); de aaneengeschakelde platdaksblokken van het zuidelijk deel (+3,8 tot +13,9 m); en de galerij over de vijver met een licht hellend zadeldak (+5,15 m). Afgesneden op de BAG-contour; onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van het pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    ridgeM: RIDGE,
    lichtkapM: 12.45,
    chimneyM: 26.7,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Kunstmuseum_Den_Haag",
    "PDOK BAG pand 0518100001640602, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nok-, goot- en dakhoogtes en het maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR): de indeling van de daken",
  ],
};

// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
  }
}

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

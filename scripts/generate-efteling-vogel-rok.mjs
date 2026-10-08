// Genereert een vereenvoudigd, gesloten 3D-model van Vogel Rok in de Efteling
// (Kaatsheuvel, Reizenrijk, 1998): de overdekte achtbaan van Vekoma in de
// grote, deels verdiepte hal in de noordhoek van het park. Herkenbaar van
// boven is de ronde, kegelvormige koepel op een lage trommel met de
// vierpuntige kroon en de mast op de top (25 m boven het maaiveld), op een
// D-vormige hal met een lagere ring langs de ronde noordkant en een lager
// zuidelijk deel met dakopbouwen. De achtbaan zelf zit volledig binnen en is
// niet gemodelleerd. Aan de zuidwestkant, aan het plein bij Carnaval Festival,
// staat de entree: een decorwand met een wolkenrand (geschilderde lucht en
// zee), daarachter een schuin aflopend dak over de wachtrij, twee grijze
// rotspieken op de hoeken en de reusachtige vogel Rok die met gespreide
// vleugels voor de wand staat: twee hoog geheven waaiers van puntige
// slagpennen met armpennen en dekveren erover (de linker schuin omhoog naar
// het noordwesten, met een slagpen tot op de grond), het schuin opgerichte lijf
// met de witte veerkraag, de "broek"-poten met klauwen en de staartwaaier
// boven en naast de tunnel naar de wachtrij, de kop met blauwe kruin, roze kuif
// en haaksnavel naar het zuidoosten gedraaid. Achter de entree de lage
// wachtrijgebouwen (de "grot" en de gang naar de hal). Alle maten in het
// script zijn meters op ware grootte. Uitvoer via scripts/efteling-kit.mjs:
// een GLB in meters (Y omhoog, nodes `klasse:label`), de catalogus-JSON en een
// binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-efteling-vogel-rok.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-vogel-rok.mjs --scale 500
//
// Panden: alleen BAG-pand 0809100000017622 (1998, de hal met koepel) hoort bij
// Vogel Rok (OSM ref:bag). 0809100000017620 (1980) ten zuiden is het
// restaurantgebouw met het terras en de witte luifel aan de zuidkant, en
// 0809100000017623 (1996) ligt aan de overkant van de weg buiten het park;
// beide horen er niet bij. De entreewand met de vogel en de wachtrijgebouwen
// staan niet in de BAG (en dus ook niet als PDOK-pand op de kaart). Carnaval
// Festival (0809100000017621) ligt ten westen en noordwesten van de entree en
// raakt de hal langs de westgevel van het zuidelijke deel: het model blijft daar
// 0,2 tot 0,3 m van het model van Carnaval Festival (efteling-carnaval-festival).
//
// Printbaar op 1:1000 zonder steun: muren staan recht op, de kegel loopt onder
// 35 graden op, de dakrand van de kegel rust op een kraag van 45 graden; de
// veren van de vogel liggen tegen de wand of op de laag erachter met randen
// van 45 graden (export vult 5,5 % van de entree op 1:1000 op), de
// wolken op de wand zijn reliëf met een kraag van 45 graden, de rotspieken
// lopen taps toe. Het lijf, de kraag, de kop en de snavel hangen deels
// vrij; die vult de export onder 45 graden op tegen de poten en de vleugel.
// De tunnel is een blinde nis met een spitse boog.
//
// Assenstelsel: oorsprong op RD (131879,0, 407156,0), het hart van de koepel,
// op het maaiveld rond de hal (NAP +8,4 m), Z omhoog. +X loopt langs de
// zuidgevel naar het oost-noordoosten (11,5 graden linksom gedraaid ten
// opzichte van de RD-x-as), +Y naar het noord-noordwesten; de zuidgevel met
// de entree (zuidwesthoek) kijkt naar -Y. De entree heeft een eigen stelsel
// langs de decorwand (zie ENTRY): s langs de wand van de noordwestelijke naar
// de zuidoostelijke rotspiek, de voorkant van de wand kijkt naar het
// zuidwesten. Het plein voor de entree ligt op NAP +9,5 m (1,1 m boven de
// oorsprong).
//
// Bronnen: BAG-pand 0809100000017622 (contour, bouwjaar 1998); AHN DSM/DTM
// 0,5 m (PDOK WCS, als raster per 0,5 m in het stelsel van de hal en in het
// stelsel van de decorwand): de kegel (hart, helling 0,69, rand r = 17,3 m op
// NAP +21,5 m, top NAP +33,4 m, kroon +33,8 m, mast +36,2 m), de trommel,
// de aanbouw tegen de kegel (+21,4 m), het noordelijke dak (+17,7 m) met de
// ring eromheen (+13,8 m), het zuidelijke dak (+16,3 m) met borstwering
// (+17,1 m) en opbouwen (+18,0 tot +19,0 m), de decorwand (+19,2 tot +20,9 m)
// met het schuine dak erachter, de wachtrijgebouwen (+13,5, +13,0, +12,6 tot
// +11,7 en +11,5 m) en het maaiveld (+8,3 tot +8,9 m rond de hal, +9,5 m op het
// plein); PDOK-luchtfoto 8 cm (kroon op de kegel, dakopbouwen, schuin dak);
// Wikipedia (gebouw 25 m hoog, baan 20 m, opening 1998); Wikimedia Commons
// (Category:Vogel Rok: frontale foto's van de entree uit 2006-2023; de vogel
// staat sinds 2018 gespiegeld, met de opgeheven vleugel aan de noordwestkant
// en de kop naar het zuidoosten, zoals ook het AHN laat zien).
// Geschat uit foto's: de vorm en de maten van de vogel (spanwijdte ca. 23 m,
// vleugelwaaiers, lijf, kraag, kop, kuif, snavel, poten, staart), de wolkenrand van de wand
// tussen de AHN-punten, de rotspieken en de tunnel. Het AHN ziet de vogel niet
// los van de wand: hij steekt in het model hooguit 3,4 m voor de wand uit.
// De gevels van de hal zijn vlak gelaten (er zijn geen foto's van; het gebouw
// staat achter bomen), het ei en de beelden in de wachtrij zitten binnen.
import {
  Manifold,
  CrossSection,
  box,
  prism,
  circle,
  ccw,
  dome,
  spire,
  union,
  downFaces,
  writeLandmark,
} from "./efteling-kit.mjs";

// ---------- maten (lokaal stelsel, z = 0 op NAP +8,4 m) ----------
const ORIGIN = [131879.0, 407156.0];
const ANGLE = (11.5 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const BASE = -0.5;
const NAP = (h) => h - 8.4;

// Hal: noordelijk deel (D-vorm om de koepel) en zuidelijk deel.
const HALL = {
  east: 23.75, // oostgevel
  west: -24.25, // westgevel van het hoge deel
  r: 24.0, // straal van de ronde noordkant (hart = koepel)
  split: -29.0, // overgang hoog/laag dak
  south: -59.7, // zuidgevel
  north: NAP(17.7), // dak noordelijk deel
  low: NAP(16.3), // dak zuidelijk deel
  sw: NAP(16.15), // dak van de zuidwestvleugel
  ring: NAP(13.8), // lage ring langs de noordkant
  parapet: NAP(17.05), // borstwering zuidelijk dak
};
// Koepel.
const DRUM_R = 17.3;
const DRUM_TOP = NAP(21.5);
const CONE_R = 17.0;
const CONE_SLOPE = 0.69;
const CONE_TOP = DRUM_TOP + CONE_R * CONE_SLOPE; // NAP +33,3 m
const CROWN_TOP = NAP(33.85);
const MAST_TOP = NAP(36.2);

// ---------- hal ----------
const hallParts = [];
// Noordelijk deel: halve cirkel om het hart plus rechthoek tot de overgang.
const dPoly = [
  [HALL.east, HALL.split],
  ...Array.from({ length: 49 }, (_, k) => {
    const a = (Math.PI * k) / 48;
    return [Math.max(HALL.west, Math.min(HALL.east, HALL.r * Math.cos(a) - 0.25)), HALL.r * Math.sin(a)];
  }),
  [HALL.west, HALL.split],
];
hallParts.push(prism(dPoly, BASE, HALL.north));
// Lage ring langs de ronde noordkant en het noordelijke deel van de westgevel
// (BAG-contour; het binnenste deel valt in de hal).
const ringPoly = [
  [23.6, 4.6], [22.3, 9.2], [24.3, 10.8], [23.4, 15.7], [19.9, 19.9], [15.8, 23.3], [10.5, 26.1],
  [11.4, 29.2], [6.8, 30.7], [5.9, 27.6], [0.1, 28.2], [-5.5, 27.7], [-10.8, 26.1], [-18.3, 21.4],
  [-23.3, 16.1], [-25.1, 12.9], [-28.2, 5.0], [-28.5, -4.6], [-24.0, -4.3], [0, -4],
];
hallParts.push(prism(ringPoly, BASE, HALL.ring));
// Uitbouw (trappenhuis of nooduitgang) aan de noordkant van de ring.
hallParts.push(prism([[11.4, 29.2], [6.8, 30.7], [5.9, 27.6], [10.5, 26.1]], BASE, NAP(15.3)));
// Zuidelijk deel tot de zuidgevel met de afgeronde zuidoosthoek, de strook
// tegen Carnaval Festival (0,2 m naast het model van Carnaval Festival, dat tot
// x = -28,1 m komt) en de zuidwestvleugel (0,3 m ten zuiden ervan).
const southPoly = [
  [HALL.west, HALL.split + 0.05], [HALL.east, HALL.split + 0.05], [23.8, -52.4], [23.2, -55.3], [21.6, -57.7],
  [16.4, HALL.south], [-24.3, HALL.south], [-24.3, -34.0], [HALL.west, -34.0],
];
hallParts.push(prism(southPoly, BASE, HALL.low));
hallParts.push(prism([[-27.9, -34.0], [-24.2, -34.0], [-24.2, -47.5], [-27.9, -47.5]], BASE, HALL.low));
const swPoly = [[-37.3, -47.4], [-24.2, -47.4], [-24.2, HALL.south], [-29.6, -64.8], [-37.4, -64.8]];
hallParts.push(prism(swPoly, BASE, HALL.sw));
// Borstwering van 0,4 m langs de zuidgevel en de zijkanten van het lage dak.
{
  const t = 0.4;
  const top = HALL.parapet;
  hallParts.push(box(-24.3, HALL.south, HALL.low - 0.05, 16.4, HALL.south + t, top));
  hallParts.push(box(HALL.east - t, -52.4, HALL.low - 0.05, HALL.east, HALL.split, top));
  hallParts.push(
    Manifold.hull(
      [[16.4, HALL.south], [21.6, -57.7], [23.2, -55.3], [23.8, -52.4], [HALL.east - t, -52.4], [22.8, -55.0], [21.3, -57.3], [16.4, HALL.south + t]].flatMap(([x, y]) => [
        [x, y, HALL.low - 0.05],
        [x, y, top],
      ]),
    ),
  );
}
// Dakopbouwen (luchtbehandeling) op het zuidelijke dak en de afgeschermde
// installatieplaats op de zuidwestvleugel.
for (const [x0, y0, x1, y1, top] of [
  [-17.5, -51.0, -7.5, -44.0, NAP(18.1)],
  [-7.5, -48.0, 1.5, -41.0, NAP(18.0)],
  [5.5, -48.5, 7.0, -46.5, NAP(17.9)],
  [-20.0, -43.0, -18.0, -41.0, NAP(17.7)],
  [-35.5, -52.0, -30.5, -48.0, NAP(19.0)],
]) {
  hallParts.push(box(x0, y0, HALL.low - 0.3, x1, y1, top));
}
{
  const top = NAP(17.8);
  const z0 = HALL.sw - 0.05;
  hallParts.push(box(-37.0, -61.0, z0, -28.6, -60.4, top));
  hallParts.push(box(-37.0, -55.4, z0, -28.6, -54.8, top));
  hallParts.push(box(-29.2, -61.0, z0, -28.6, -54.8, top));
  hallParts.push(box(-37.0, -61.0, z0, -36.4, -54.8, top));
}
// Ventilatiekap op het noordelijke dak.
hallParts.push(box(-21.0, -5.5, HALL.north - 0.1, -19.5, -4.0, NAP(19.3)));
const hall = union(hallParts);

// ---------- koepel ----------
const domeParts = [];
// Trommel van de vloer tot de goot van de kegel.
domeParts.push(Manifold.cylinder(DRUM_TOP - BASE, DRUM_R, DRUM_R, 96).translate([0, 0, BASE]));
// Dakrand van de kegel: 0,3 m buiten de trommel, op een kraag van 45 graden.
domeParts.push(dome([0, 0], [[DRUM_R - 0.05, DRUM_TOP - 0.45], [DRUM_R + 0.3, DRUM_TOP - 0.1], [DRUM_R + 0.3, DRUM_TOP + 0.15], [DRUM_R - 0.2, DRUM_TOP + 0.3]], 96));
// Kegel (helling 0,69, 34,6 graden).
domeParts.push(dome([0, 0], [[CONE_R + 0.2, DRUM_TOP - 0.05], [CONE_R, DRUM_TOP + 0.05], [0.3, CONE_TOP - 0.2]], 96));
// Aanbouw aan de zuidkant van de kegel (plat dak op NAP +21,4 m), tot in de trommel.
domeParts.push(prism([[-14.5, -9.0], [-1.5, -9.0], [-1.5, -22.7], [-14.5, -18.2]], BASE, NAP(21.4)));
// Kroon op de top: ronde plaat met vier punten over de kegel, en de mast.
const coneZ = (r) => CONE_TOP - CONE_SLOPE * r;
domeParts.push(dome([0, 0], [[1.7, coneZ(1.7) - 0.3], [1.7, CROWN_TOP - 0.2], [1.2, CROWN_TOP]], 24));
for (let k = 0; k < 4; k++) {
  const a = Math.PI / 4 + (k * Math.PI) / 2;
  const dir = [Math.cos(a), Math.sin(a)];
  const side = [-dir[1], dir[0]];
  const pts = [];
  for (const [r, w] of [[0.6, 1.0], [3.4, 0.25]]) {
    for (const sgn of [-1, 1]) {
      const x = dir[0] * r + side[0] * w * sgn;
      const y = dir[1] * r + side[1] * w * sgn;
      pts.push([x, y, coneZ(r) - 0.4], [x, y, coneZ(r) + (r < 1 ? 0.9 : 0.35)]);
    }
  }
  domeParts.push(Manifold.hull(pts));
}
domeParts.push(spire([0, 0], 0.45, CROWN_TOP - 0.1, MAST_TOP, 4, Math.PI / 4));
const koepel = union(domeParts);

// ---------- entree: decorwand, schuin dak, rotspieken en de vogel ----------
// Stelsel van de wand: X = s langs de wand van de noordwestelijke hoek (P1)
// naar het zuidoosten, Y = van de voorkant van de wand naar achteren (de
// voorkant kijkt naar -Y, het zuidwesten), Z = z van het model.
const ENTRY = {
  p1: [-62.8, -57.5],
  p2: [-54.6, -77.8],
};
ENTRY.len = Math.hypot(ENTRY.p2[0] - ENTRY.p1[0], ENTRY.p2[1] - ENTRY.p1[1]); // 21,9 m
ENTRY.deg = (Math.atan2(ENTRY.p2[1] - ENTRY.p1[1], ENTRY.p2[0] - ENTRY.p1[0]) * 180) / Math.PI; // -68 graden
const PLAZA = NAP(9.5); // pleinhoogte
const H = (h) => PLAZA + h; // hoogte boven het plein
const L = ENTRY.len;
// Bovenrand van de wolken (hoogte boven het plein) langs de wand, uit het AHN.
const CLOUD = [
  [0, 8.5], [2, 9.2], [4, 9.6], [6, 9.7], [8, 10.0], [10, 10.7], [11.5, 11.2], [13, 11.4],
  [14.5, 10.7], [16, 10.1], [18, 9.8], [20, 9.5], [L, 8.9],
];
const cloudTop = (s) => {
  for (let i = 0; i + 1 < CLOUD.length; i++) {
    const [s0, h0] = CLOUD[i];
    const [s1, h1] = CLOUD[i + 1];
    if (s <= s1) return h0 + ((h1 - h0) * (Math.max(s, s0) - s0)) / (s1 - s0);
  }
  return CLOUD[CLOUD.length - 1][1];
};
const WALL_T = 0.8; // dikte van de decorwand
const entryParts = [];
// Schuin dak over de wachtrij achter de wand: van H(8,7) achter de wand naar
// achteren aflopend onder 20 graden tot het vlakke deel op NAP +15,8 m.
{
  const foot = [[0, 0.05], [L, 0.05], [L, 4.0], [17.0, 6.5], [13.5, 9.5], [9.0, 9.5], [7.0, 6.5], [3.0, 3.0], [0, 1.5]];
  const roof = Manifold.hull([
    [-5, 0.8, BASE], [L + 5, 0.8, BASE], [L + 5, 14, BASE], [-5, 14, BASE],
    [-5, 0.8, H(8.7)], [L + 5, 0.8, H(8.7)],
    [-5, 7.5, NAP(15.8)], [L + 5, 7.5, NAP(15.8)], [-5, 14, NAP(15.8)], [L + 5, 14, NAP(15.8)],
  ]);
  entryParts.push(prism(foot, BASE, H(10)).intersect(roof));
}
// Decorwand met de wolkenrand: de wand tot onder de wolken en een rij
// wolkbollen (cilinders dwars door de wand) die samen de bovenrand vormen.
{
  const wallPts = [];
  for (let s = 0; s <= L + 1e-6; s += L / 24) wallPts.push([s, cloudTop(s) - 0.9]);
  const prof = [[0, BASE - PLAZA], ...wallPts.map(([s, h]) => [s, h]), [L, BASE - PLAZA]];
  // Profiel in het XZ-vlak, geëxtrudeerd langs Y.
  const wall = Manifold.extrude(new CrossSection([ccw(prof.map(([s, h]) => [s, h + PLAZA]))]), WALL_T)
    .rotate([90, 0, 0])
    .translate([0, WALL_T, 0]);
  entryParts.push(wall);
  const puff = (s, zc, r, y0 = 0, y1 = WALL_T) =>
    Manifold.hull(circle([s, zc], r, 20).flatMap(([x, z]) => [[x, y0, z], [x, y1, z]]));
  let k = 0;
  for (let s = 0.6; s < L - 0.3; s += 1.55) {
    const r = 1.0 + 0.35 * ((k * 7) % 3);
    entryParts.push(puff(s, H(cloudTop(s)) - r, r));
    k++;
  }
  // Wolken in reliëf op de voorkant van de wand (0,35 m), met een
  // onderkant van 45 graden.
  const relief = (s, h, r) =>
    Manifold.hull([
      ...circle([s, H(h)], r, 18).map(([x, z]) => [x, 0.02, z]),
      ...circle([s, H(h) + 0.4], Math.max(r - 0.35, 0.3), 18).map(([x, z]) => [x, -0.35, z]),
    ]);
  for (const [s, dh, r] of [
    [1.5, -1.6, 0.9], [3.2, -1.3, 1.1], [5.0, -1.5, 0.9], [6.8, -1.2, 1.2], [8.6, -1.6, 1.0],
    [10.4, -1.4, 1.2], [12.6, -1.5, 1.3], [14.8, -1.4, 1.1], [16.8, -1.6, 1.0], [18.6, -1.3, 1.1],
    [20.4, -1.5, 0.9],
  ]) {
    entryParts.push(relief(s, cloudTop(s) + dh, r));
  }
}
// Rotspieken op beide hoeken: getande, taps toelopende naalden.
const rock = (s, y, r0, top, seed) => {
  const ring = (z, r, n, rot) =>
    Array.from({ length: n }, (_, i) => {
      const a = rot + (2 * Math.PI * i) / n;
      const f = 0.8 + 0.35 * Math.abs(Math.sin(seed * 3.1 + i * 2.3));
      return [s + Math.cos(a) * r * f, y + Math.sin(a) * r * f * 0.85, z];
    });
  const z0 = BASE;
  const zs = [z0, H(top * 0.35), H(top * 0.7)];
  return union([
    Manifold.hull([...ring(z0, r0, 9, seed), ...ring(zs[1], r0 * 0.78, 9, seed + 0.4), ...ring(zs[2], r0 * 0.45, 7, seed + 0.9), [s + 0.15, y, H(top)]]),
    // Bijpiek aan de buitenkant.
    Manifold.hull([...ring(z0, r0 * 0.6, 7, seed + 1.3).map(([x, yy, z]) => [x + (s < L / 2 ? -0.9 : 0.9), yy - 0.3, z]), [s + (s < L / 2 ? -0.9 : 0.9), y - 0.3, H(top * 0.55)]]),
  ]);
};
entryParts.push(rock(-0.6, 0.3, 1.9, 8.8, 1.0));
entryParts.push(rock(L + 0.5, 0.3, 1.9, 9.4, 2.0));

// De vogel (hoogtes boven het plein, s langs de wand, Y = -diepte voor de wand).
// Gezien vanaf het plein: de linkervleugel (noordwest, kleine s) gaat schuin
// omhoog naar links, de rechtervleugel naar rechtsboven, het lijf staat schuin
// opgericht met de kop naar rechts (zuidoost). Alles rust op de decorwand of
// staat op de grond.
const ell = (c, r, n = 24) => Manifold.sphere(1, n).scale(r).translate([c[0], c[1], H(c[2])]);
const pt = (s, y, h) => [s, y, H(h)];
// Puntige veer als plaat in het wandvlak: van de wortel (breedte wr) via de
// breedste plek op `at` (wm) naar een punt, `depth` dik vanaf y0 naar voren.
// De voorkant ligt `depth` hoger dan de achterkant, zodat elke rand die naar
// beneden kijkt onder 45 graden oploopt (printbaar tegen de wand of de laag
// erachter).
// y0 mag een paar [wortel, punt] zijn: dan loopt de veer schuin van voor
// (wortel) naar de wand (punt).
const plume = (root, tip, { y0 = 0.05, depth = 0.6, wr = 0.6, wm = 1.4, at = 0.7 } = {}) => {
  const [yr, yt] = Array.isArray(y0) ? y0 : [y0, y0];
  const yAt = (f) => yr + (yt - yr) * f;
  const [sr, hr] = root;
  const [st, ht] = tip;
  const len = Math.hypot(st - sr, ht - hr);
  const u = [(st - sr) / len, (ht - hr) / len];
  const n = [-u[1], u[0]];
  const outline = [
    [sr + (n[0] * wr) / 2, hr + (n[1] * wr) / 2, 0],
    [sr - (n[0] * wr) / 2, hr - (n[1] * wr) / 2, 0],
    [sr + u[0] * len * at - (n[0] * wm) / 2, hr + u[1] * len * at - (n[1] * wm) / 2, at],
    [st, ht, 1],
    [sr + u[0] * len * at + (n[0] * wm) / 2, hr + u[1] * len * at + (n[1] * wm) / 2, at],
  ];
  return Manifold.hull([
    ...outline.map(([s, h, f]) => pt(s, yAt(f), h)),
    ...outline.map(([s, h, f]) => pt(s, yAt(f) - depth, h + depth)),
  ]);
};
// Vleugel als waaier: slagpennen van de schouder naar de punten in `tips`,
// daarvoor een laag kortere armpennen en een rij dekveren langs de bovenrand.
const fanWing = (shoulder, tips, coverts) => {
  const parts = [];
  // Dichte vleugelplaat achter de pennen, zodat de waaier één geheel is.
  parts.push(
    Manifold.hull(
      [
        pt(shoulder[0], 0.05, shoulder[1]),
        pt(shoulder[0], -1.5, shoulder[1] + 1.55),
        ...tips.flatMap(([s, h]) => {
          const q = [shoulder[0] + (s - shoulder[0]) * 0.8, shoulder[1] + (h - shoulder[1]) * 0.8];
          return [pt(q[0], 0.05, q[1]), pt(q[0], -0.45, q[1] + 0.5)];
        }),
      ],
    ),
  );
  // Slagpennen (0,6 m dik), uitwaaierend naar puntige uiteinden.
  for (const tip of tips) parts.push(plume(shoulder, tip, { y0: [-0.9, 0.05], wr: 0.8, wm: 1.8, at: 0.75 }));
  // Armpennen: tweede laag, 62 % van de lengte, 0,5 m ervoor.
  for (const [s, h] of tips) {
    const tip = [shoulder[0] + (s - shoulder[0]) * 0.62, shoulder[1] + (h - shoulder[1]) * 0.62];
    parts.push(plume(shoulder, tip, { y0: [-1.4, -0.5], depth: 0.6, wr: 0.7, wm: 1.4, at: 0.65 }));
  }
  // Dekveren: een rij korte, puntige veren langs de bovenrand (de witte rand
  // op de foto's), 1,0 m voor de wand.
  for (const [root, tip] of coverts) parts.push(plume(root, tip, { y0: [-1.5, -0.8], depth: 0.55, wr: 0.7, wm: 1.1, at: 0.55 }));
  return union(parts);
};
const bird = [];
// Linkervleugel: schouder bij s = 11,8; punten van de hoge vleugelpunt
// linksboven tot vlak naast de tunnel.
bird.push(
  fanWing(
    [11.8, 7.2],
    [[-0.2, 8.9], [0.2, 7.6], [1.0, 6.3], [2.2, 5.2], [3.6, 4.2], [5.0, 3.5], [6.5, 3.0], [7.9, 2.7], [9.1, 2.6]],
    [
      [[11.6, 8.0], [9.4, 9.8]], [[10.2, 8.4], [7.4, 9.7]], [[8.6, 8.5], [5.6, 9.5]], [[7.0, 8.4], [3.8, 9.2]],
      [[5.4, 8.1], [2.2, 8.8]], [[11.2, 7.0], [8.6, 7.9]], [[9.4, 7.2], [6.4, 7.6]], [[7.6, 7.0], [4.6, 7.0]],
    ],
  ),
);
// Lange slagpen tot op de grond, links naast de tunnel.
bird.push(
  Manifold.hull([
    pt(8.6, 0.05, 3.4), pt(9.5, 0.05, 3.4), pt(8.6, -0.6, 4.0), pt(9.5, -0.6, 4.0),
    [8.9, 0.05, BASE], [9.6, 0.05, BASE], [8.9, -0.6, BASE], [9.6, -0.6, BASE],
  ]),
);
// Rechtervleugel: schouder bij s = 16,3; punten van rechtsboven tot onder.
bird.push(
  fanWing(
    [16.3, 7.4],
    [[21.9, 9.3], [22.5, 8.3], [22.4, 7.2], [21.7, 6.2], [20.7, 5.4], [19.5, 4.8], [18.3, 4.6]],
    [
      [[16.6, 8.1], [18.8, 9.6]], [[18.0, 8.4], [20.4, 9.4]], [[19.3, 8.4], [21.6, 9.0]],
      [[16.8, 7.3], [19.0, 7.9]], [[18.4, 7.5], [20.8, 7.7]],
    ],
  ),
);
// Lijf: één schuin opgericht omhulsel van buik tot borst en schouders.
bird.push(
  union([
    ell([13.5, -1.1, 3.4], [1.7, 1.2, 1.6]),
    ell([14.3, -1.5, 5.2], [1.9, 1.6, 1.8]),
    ell([14.9, -1.1, 6.6], [1.6, 1.0, 1.2]),
    ell([12.8, -0.6, 6.4], [1.2, 0.6, 1.0]),
  ]).hull(),
);
// Staart als waaier tussen de poten, tot op de grond.
for (const tip of [[12.9, -0.5], [13.9, -0.6], [14.9, -0.5]]) {
  bird.push(plume([13.9, 2.8], tip, { y0: -0.5, depth: 0.6, wr: 0.8, wm: 1.1, at: 0.6 }));
}
// Poten: dikke "broek"-veren (omhulsel van dij tot enkel) met puntige plukken
// onderaan, een korte loop en vier klauwen op de grond.
for (const [s, lean] of [[12.4, -0.3], [15.5, 0.3]]) {
  bird.push(union([ell([s, -1.6, 2.7], [1.0, 0.95, 1.1]), ell([s + lean, -1.9, 1.2], [0.7, 0.7, 0.5])]).hull());
  for (const da of [-0.45, 0, 0.45]) {
    bird.push(plume([s + lean + da, 1.5], [s + lean + da * 1.6, 0.55], { y0: -1.3, depth: 0.5, wr: 0.6, wm: 0.6, at: 0.5 }));
  }
  bird.push(Manifold.cylinder(H(1.1) - BASE, 0.5, 0.45, 16).translate([s + lean, -2.0, BASE]));
  for (const a of [-130, -95, -60, 85]) {
    const r = (a * Math.PI) / 180;
    const len = a === 85 ? 1.0 : 1.5;
    const c = [s + lean, -2.0];
    const e = [c[0] + Math.cos(r) * len, c[1] + Math.sin(r) * len];
    const side = [-Math.sin(r) * 0.3, Math.cos(r) * 0.3];
    bird.push(
      Manifold.hull([
        [c[0] - side[0], c[1] - side[1], BASE], [c[0] + side[0], c[1] + side[1], BASE], [c[0], c[1], H(0.75)],
        [e[0], e[1], BASE], [e[0] - Math.cos(r) * 0.3, e[1] - Math.sin(r) * 0.3, H(0.35)],
      ]),
    );
  }
}
// Witte veerkraag: een kern rond de halsbasis met een ring van puntige
// plukken die naar buiten en naar voren wijzen.
{
  const c = [15.6, -1.9, 7.1];
  bird.push(ell(c, [1.2, 1.0, 1.05]));
  for (let k = 0; k < 16; k++) {
    const a = (2 * Math.PI * k) / 16 + 0.2;
    const tip = [c[0] + Math.cos(a) * 1.6, c[2] + Math.sin(a) * 1.45];
    const base = [c[0] + Math.cos(a) * 0.5, c[2] + Math.sin(a) * 0.45];
    const down = Math.sin(a) < -0.3;
    bird.push(
      Manifold.hull([
        pt(base[0] - Math.sin(a) * 0.45, c[1] + 0.5, base[1] + Math.cos(a) * 0.45),
        pt(base[0] + Math.sin(a) * 0.45, c[1] + 0.5, base[1] - Math.cos(a) * 0.45),
        pt(base[0], c[1] - 0.75, base[1] + 0.2),
        pt(tip[0], c[1] - (down ? 0.2 : 0.35), tip[1] + (down ? 0 : 0.25)),
        pt(tip[0], c[1] + 0.35, tip[1]),
      ]),
    );
  }
}
// Hals en kop: de hals buigt van de kraag omhoog naar rechts, de kop kijkt
// naar rechts (zuidoost) met een grote haaksnavel en een kuif van drie
// puntige veren naar achteren en boven.
bird.push(union([ell([16.3, -1.9, 7.6], [0.65, 0.6, 0.65]), ell([17.4, -1.9, 8.1], [0.6, 0.55, 0.6])]).hull());
bird.push(union([ell([18.3, -1.85, 8.2], [1.2, 0.95, 0.95]), ell([18.1, -1.7, 8.85], [0.9, 0.7, 0.5])]).hull());
bird.push(
  Manifold.hull([
    pt(19.1, -1.35, 7.4), pt(19.1, -2.35, 7.4), pt(19.1, -1.35, 9.0), pt(19.1, -2.35, 9.0),
    pt(20.3, -1.5, 8.75), pt(20.3, -2.2, 8.75), pt(21.1, -1.6, 8.2), pt(21.1, -2.1, 8.2),
    pt(21.35, -1.85, 7.4), pt(21.1, -1.85, 6.75),
    pt(20.1, -1.55, 7.35), pt(20.1, -2.15, 7.35),
  ]),
);
for (const [tip, w] of [[[16.4, 9.9], 0.7], [[17.2, 10.4], 0.7], [[18.1, 10.1], 0.6]]) {
  bird.push(plume([18.0, 8.7], tip, { y0: -1.55, depth: 0.55, wr: 0.7, wm: w + 0.3, at: 0.5 }));
}
// Tunnel naar de wachtrij: blinde nis van 0,5 m met een spitse boog onder de
// linkervleugel.
const tunnel = Manifold.extrude(
  new CrossSection([[[9.7, BASE], [12.1, BASE], [12.1, H(3.0)], [10.9, H(4.4)], [9.7, H(3.0)]]]),
  0.5,
).rotate([90, 0, 0]).translate([0, 0.5, 0]).translate([0, -0.02, 0]);
let entry = union([...entryParts, ...bird].filter(Boolean)).subtract(tunnel.subtract(union(bird.filter(Boolean))));
// Naar het lokale stelsel: draaien langs de wand en verschuiven naar P1.
entry = entry.rotate([0, 0, ENTRY.deg]).translate([ENTRY.p1[0], ENTRY.p1[1], 0]);

// ---------- wachtrijgebouwen ----------
const queueParts = [];
// "Grot" achter het noordwestelijke deel van de wand (plat, NAP +13,5 m).
queueParts.push(prism([[-62.5, -51.0], [-51.6, -51.0], [-51.6, -61.5], [-60.0, -61.5], [-62.5, -57.5]], BASE, NAP(13.5)));
// Gang naar de hal: hoog blok (NAP +13,0 m) en een lessenaarsdak van NAP +12,6
// naar +11,7 m, met een lager deel (NAP +11,5 m) aan de zuidkant.
queueParts.push(box(-51.2, -76.5, BASE, -46.0, -65.5, NAP(13.0)));
const lean = (x0, y0, x1, y1) =>
  Manifold.hull([
    [x0, y0, BASE], [x1, y0, BASE], [x1, y1, BASE], [x0, y1, BASE],
    [x0, y0, NAP(12.65)], [x0, y1, NAP(12.65)], [x1, y0, NAP(11.7)], [x1, y1, NAP(11.7)],
  ]);
queueParts.push(lean(-46.2, -72.0, -28.6, -64.75).intersect(box(-46.2, -72.0, BASE, -28.6, -64.75, 20)));
queueParts.push(lean(-46.2, -75.5, -28.6, -71.9).intersect(box(-39.0, -75.5, BASE, -28.6, -71.9, 20)));
queueParts.push(box(-46.2, -77.6, BASE, -38.8, -71.9, NAP(11.5)));
const queue = union(queueParts);

const nodes = [
  ["building:hal", hall],
  ["building:koepel", koepel],
  ["building:entree", entry],
  ["building:wachtrij", queue],
];
for (const [name, solid] of nodes) {
  const down = downFaces(solid, BASE + 0.01).filter((g) => g.area > 0.2);
  console.log(name, "ondervlakken:", JSON.stringify(down));
  const pieces = solid.decompose();
  if (pieces.length > 1) {
    const boxes = pieces.map((p) => {
      const bb = p.boundingBox();
      return [...bb.min, ...bb.max].map((v) => +v.toFixed(1));
    });
    console.log(name, "losse delen:", JSON.stringify(boxes));
  }
}

await writeLandmark({
  slug: "efteling-vogel-rok",
  nodes,
  base: BASE,
  catalog: {
    name: "Vogel Rok (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: [
      [27, -50],
      [27, -15],
      [22, 24],
      [0, 31],
      [-31, 8],
      [-12, -66],
    ],
    replacesBuildings: ["NL.IMBAG.Pand.0809100000017622"],
    description:
      "Vogel Rok in de Efteling (1998): oorsprong in het hart van de koepel op het maaiveld rond de hal (NAP +8,4 m); +X langs de zuidgevel naar het oost-noordoosten, +Y naar het noord-noordwesten. D-vormige hal (noordelijk dak NAP +17,7 m, zuidelijk +16,3 m, ring +13,8 m) met de kegelvormige koepel (trommel r = 17,3 m tot +21,5 m, top +33,3 m, kroon en mast tot +36,2 m); aan de zuidwestkant de entree met de decorwand met wolkenrand (tot circa +20,9 m), het schuine dak, twee rotspieken en de vogel Rok met twee gespreide vleugelwaaiers (spanwijdte circa 23 m), en de lage wachtrijgebouwen. De achtbaan zit binnen; gevels vlak.",
    realWorld: {
      hallFootprintMetres: [48.0, 88.0],
      hallNorthRoofHeightMetres: 9.3,
      hallSouthRoofHeightMetres: 7.9,
      ringRoofHeightMetres: 5.4,
      domeDrumRadiusMetres: DRUM_R,
      domeEaveHeightMetres: +DRUM_TOP.toFixed(2),
      domeConeSlope: CONE_SLOPE,
      domeTopHeightMetres: +CONE_TOP.toFixed(2),
      crownHeightMetres: +CROWN_TOP.toFixed(2),
      mastTopHeightMetres: +MAST_TOP.toFixed(2),
      entranceWallLengthMetres: +L.toFixed(1),
      entranceWallTopAbovePlazaMetres: 11.4,
      birdWingspanMetres: 23,
      birdProjectionMetres: 3.4,
      plazaNapMetres: 9.5,
      groundNapMetres: 8.4,
    },
    sources: [
      "BAG-pand 0809100000017622 (contour, bouwjaar 1998; OSM ref:bag Vogel Rok)",
      "AHN DSM/DTM 0,5 m (PDOK WCS): kegel NAP +21,5 tot +33,4 m (helling 0,69), kroon +33,8 m, mast +36,2 m, aanbouw +21,4 m, daken +17,7, +16,3 en +13,8 m, decorwand +19,2 tot +20,9 m, wachtrij +13,5 tot +11,5 m, maaiveld +8,3 tot +8,9 m, plein +9,5 m",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR)",
      "nl.wikipedia.org/wiki/Vogel_Rok (gebouw 25 m hoog, baan 20 m, geopend 1998)",
      "Wikimedia Commons, Category:Vogel Rok (foto's van de entree 1998-2023)",
    ],
  },
});

// Genereert een vereenvoudigd, gesloten 3D-model van Symbolica, het Paleis der
// Fantasie in de Efteling (Kaatsheuvel, 2017): de trackless dark ride in een
// grote hal met een plat groen dak, achter een sprookjespaleis aan de westkant
// met torens en koepels. Alle maten in het script zijn meters op ware grootte.
// Uitvoer via scripts/efteling-kit.mjs: een GLB in meters (Y omhoog, nodes
// `building:paleis` en `vegetation:daktuin`), de catalogus-JSON en een binaire
// STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-efteling-symbolica.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-symbolica.mjs --scale 500
//
// Wat erin zit:
// - De hoofdhal (47 bij 46 m, dak op NAP +19,1 m, 9,2 m boven het maaiveld)
//   met de afgeschuinde noordoosthoek en de verspringing aan de oostkant, een
//   lichte dakrand van 0,8 m breed met witte paaltjes op de hoeken en midden op
//   de lange zijden, en lisenen langs de gevels. Op het dak de daktuin (sedum,
//   node `vegetation:daktuin`) met het witte ornament van paden: het grote
//   medaillon in het midden, het kruis van paden noord-zuid en oost-west en
//   de vier kleine rozetten. De zonnepanelen op het dak zijn weggelaten.
// - De lagere zuidhal (dak NAP +15,4 m) met de afgeschuinde zuidhoeken.
// - Het paleis aan de westkant (de voorgevel, op het plein): het middendeel met
//   de spitsboogpoort en het balkon, een kroonlijst en balustrade met paaltjes
//   en het steile leien schilddak met de dakkapel; links en rechts een
//   vierkante toren met een uikoepel (de groene banden); noordelijk daarvan de
//   hoge vierkante toren met twee geledingen en een koepel; zuidelijk de ronde
//   klokkentoren met kantelenkrans, de vier torentjes met kegeldakjes, de
//   wijzerplaat en de koperen uikoepel; achter het middendeel de hoofdtoren met
//   drie spitsboogvensters per zijde, de omloop met arcade, het brede
//   overstekende dak en de grote koepel; verder de ronde toren met kantelen,
//   torentjes en koepel op het dak van de hal, en twee ronde torens met een
//   spitse kegel. Lagere vleugels noord- en zuidelijk van het paleis met een
//   borstwering.
// - Gevelreliëf: vensters en de poort als spitsboognissen van 0,35 m diep
//   (top 55-60 graden), lijsten op een kraag van 50 graden.
// De kunstrotsen voor de voorgevel zitten in het PDOK-terrein (tot circa 5 m
// boven het plein) en zijn daarom niet gemodelleerd: de gevels lopen door tot
// de onderkant en het terrein bedekt hun voet zoals in het echt.
//
// Printbaar op 1:1000 zonder steun: alles staat op de onderkant of op een dak,
// lijsten, kroonlijsten, omlopen en torentjes rusten op een kraag van 45-50
// graden, de uikoepels zwellen niet steiler dan 45 graden uit, nissen hebben
// een spitse top. De smalste delen zijn de spitsen en pinakels (0,5 m) en de
// stijlen tussen de spitsboogvensters van de hoofdtoren (0,35 m, in de gevel).
//
// Assenstelsel: oorsprong op RD (131675, 406851), midden in de hoofdhal, op
// het maaiveld (NAP +9,9 m), Z omhoog. De gebouwas staat 5,3 graden linksom
// gedraaid ten opzichte van RD (X_AXIS); +X wijst naar het oost-noordoosten,
// de voorgevel ligt aan de westkant (-X), de Pagode staat noordelijk (+Y).
//
// Bronnen: BAG-pand 0809100000019177 (contour, bouwjaar 2017; de PDOK-
// gebouwtegel bevat binnen de contour geen andere panden); AHN DSM/DTM 0,5 m
// (PDOK WCS) als raster per 0,5 m in het gedraaide stelsel: de dakhoogtes van
// de hallen en vleugels, de positie, breedte en hoogte van elke toren en
// koepel, de nok van het schilddak, het maaiveld; PDOK luchtfoto 8 cm
// (ornament op het dak, dakranden, plattegrond van het paleis); foto's op
// Wikimedia Commons (Symbolica (Efteling) 20170521, Symbolica voorzijde,
// Symbolica2018, Symbolica Palace Efteling, Symbolica vanaf Pagode): de
// opbouw van de torens, de vorm van de koepels, de poort, het balkon, de
// balustrade, de dakkapel en het dak met het ornament.
// Geschat (uit foto's, op de AHN-maten geschaald): de hoogtes van lijsten,
// vensters en geledingen, de diameters van trommels en koepels (behalve de
// totale breedte uit het AHN), de spitsen (het AHN ziet alleen de voet van de
// makelaar), de lisenen en paaltjes, en de lijnbreedte van het dakornament.
import {
  CrossSection,
  Manifold,
  ccw,
  circle,
  downFaces,
  hull,
  prism,
  rect,
  ring3,
  spire,
  dome,
  union,
  writeLandmark,
} from "./efteling-kit.mjs";

// ---------- assenstelsel en hoogtes ----------
const ORIGIN = [131675, 406851];
const ANGLE = (5.3 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
// Maaiveld op het plein en de paden rond de hal (AHN DTM NAP +9,8 tot +10,0 m).
const GROUND_NAP = 9.9;
const NAP = (h) => +(h - GROUND_NAP).toFixed(3);
const BASE = -0.5;

// ---------- hulpfuncties ----------
const box = (x0, y0, z0, x1, y1, z1) => prism(rect(x0, y0, x1, y1), z0, z1);
const extrudeCs = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
const poly = (pts) => new CrossSection([ccw(pts)]);
// Band langs de rand van een veelhoek, van de buitenrand tot `w` naar binnen.
const rim = (pts, w, z0, z1) => extrudeCs(poly(pts), z0, z1).subtract(extrudeCs(poly(pts).offset(-w, "Miter"), z0 - 0.1, z1 + 0.1));
const cyl = (c, r, z0, z1, n = 32) => prism(circle(c, r, n), z0, z1);
// Kraag van 50 graden: rechthoek op z die `out` uitkraagt tot z + 1,2·out, dan een band van `band` hoog.
const corbelRect = (x0, y0, x1, y1, z, out, band) =>
  hull([
    ...ring3(rect(x0, y0, x1, y1), z),
    ...ring3(rect(x0 - out, y0 - out, x1 + out, y1 + out), z + 1.2 * out),
    ...ring3(rect(x0 - out, y0 - out, x1 + out, y1 + out), z + 1.2 * out + band),
  ]);
const corbelRound = (c, r, z, out, band, n = 32) =>
  hull([...ring3(circle(c, r, n), z), ...ring3(circle(c, r + out, n), z + 1.2 * out), ...ring3(circle(c, r + out, n), z + 1.2 * out + band)]);
// Vierkante toren of trommel rond een middelpunt.
const sq = (c, half, z0, z1) => box(c[0] - half, c[1] - half, z0, c[0] + half, c[1] + half, z1);
const corbelSq = (c, half, z, out, band) => corbelRect(c[0] - half, c[1] - half, c[0] + half, c[1] + half, z, out, band);

// Spitsboognis in een gevel: `at` is het punt op het gevelvlak, `n` de normaal
// naar buiten (eenheidsvector in XY), breedte w, onderkant z0, aanzet zs, top
// onder `deg` graden (≥ 55, dus printbaar), diepte d het gevelvlak in.
function niche(at, n, w, z0, zs, d = 0.35, deg = 60) {
  const top = zs + (w / 2) * Math.tan((deg * Math.PI) / 180);
  const cs = poly([[-w / 2, z0], [w / 2, z0], [w / 2, zs], [0, top], [-w / 2, zs]]);
  const theta = (Math.atan2(-n[0], n[1]) * 180) / Math.PI;
  return Manifold.extrude(cs, d + 0.1)
    .translate([0, 0, -0.1])
    .rotate([90, 0, 0])
    .rotate([0, 0, theta])
    .translate([at[0], at[1], 0]);
}
// Verhoogde spitsboogomlijsting: dezelfde vorm, d + 0,1 m uit het gevelvlak (0,1 m erin).
function frame(at, n, w, z0, zs, d = 0.2, deg = 60) {
  return niche([at[0] + n[0] * d, at[1] + n[1] * d], n, w, z0, zs, d + 0.1, deg);
}
const W = [-1, 0];
const E = [1, 0];
const N = [0, 1];
const S = [0, -1];
// Gevelvlak van een vierkant rond c: punt op het midden van de zijde n, met verschuiving u langs de gevel.
const face = (c, half, n, u = 0) => [c[0] + n[0] * half - n[1] * u, c[1] + n[1] * half + n[0] * u];
// Nis in de gevel van een ronde toren onder hoek a (graden, 180 = west).
const radial = (c, r, a) => {
  const t = (a * Math.PI) / 180;
  return { at: [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)], n: [Math.cos(t), Math.sin(t)] };
};
// Kantelen op een ronde krans: count blokken van breedte w tussen r0 en r1.
function merlonsRound(c, r0, r1, z0, z1, count, w) {
  const parts = [];
  for (let k = 0; k < count; k++) {
    const a = (360 / count) * k;
    parts.push(box(r0, -w / 2, z0, r1, w / 2, z1).rotate([0, 0, a]).translate([c[0], c[1], 0]));
  }
  return union(parts);
}
// Torentje op een kraag (kegel van 45 graden eronder), met een kegeldak van 8 vlakken.
function turret(c, r, z0, z1, capTop) {
  return union([
    hull([[c[0], c[1], z0 - r], ...ring3(circle(c, r, 16), z0)]),
    cyl(c, r, z0 - 0.01, z1, 16),
    spire(c, r, z1 - 0.01, capTop, 8),
  ]);
}
// Uikoepel: omwenteling van [r, z]-punten, met een makelaar (spits van 0,5 m breed) tot `top`.
function onion(c, profile, top, segments = 32) {
  const last = profile[profile.length - 1];
  return union([dome(c, profile, segments), spire(c, 0.25, last[1] - 0.05, top, 8)]);
}
// Lisenen langs de randen van een veelhoek (tegen de klok in), om de ~step m.
function pilasters(pts, step, z0, z1, skip = () => false, w = 0.9, d = 0.3) {
  const P = ccw(pts);
  const parts = [];
  P.forEach((a, i) => {
    const b = P[(i + 1) % P.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 4) return;
    const t = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    const n = [t[1], -t[0]];
    const count = Math.max(1, Math.round(len / step));
    for (let k = 1; k < count; k++) {
      const s = (len * k) / count;
      const p = [a[0] + t[0] * s, a[1] + t[1] * s];
      if (skip(p, n)) continue;
      const q = (u, v) => [p[0] + t[0] * u + n[0] * v, p[1] + t[1] * u + n[1] * v];
      parts.push(prism([q(-w / 2, -0.1), q(w / 2, -0.1), q(w / 2, d), q(-w / 2, d)], z0, z1));
    }
  });
  return union(parts);
}
// Paaltje op een dakrand: achtkant met een spits kapje.
const post = (c, z0, z1, top, r = 0.5) => union([prism(circle(c, r, 8, Math.PI / 8), z0, z1), spire(c, r, z1 - 0.01, top, 8, Math.PI / 8)]);

// ---------- plattegrond (lokaal, uit de BAG-contour) ----------
// Hoofdhal: westgevel tegen het paleis op x = -18,6 (AHN), de rest uit de BAG.
const MAIN = [[-18.6, -16.75], [28.83, -16.75], [28.86, 5.9], [24.87, 6.0], [24.9, 20.37], [18.0, 27.35], [15.7, 29.59], [-18.6, 29.59]];
const MAIN_DECK = NAP(19.1);
const MAIN_RIM = NAP(19.6);
// Zuidhal (AHN NAP +15,4 m); de noordrand ligt onder de hoofdhal.
const SOUTH = [
  [-23.05, -20.93], [-5.8, -21.03], [3.18, -30.01], [5.36, -32.23], [16.31, -32.4], [23.82, -24.87], [28.84, -19.84],
  [28.84, -16.4], [-18.4, -16.4], [-18.4, -14.95], [-23.01, -14.96],
];
const SOUTH_DECK = NAP(15.4);
const SOUTH_RIM = NAP(15.8);
// Paleis (vleugels W1 tot W4), voorgevel van het middendeel op x = -28,0.
const FRONT = -28.0;
const W1_TOP = NAP(21.2); // dak van het middendeel achter de balustrade
const W2_TOP = NAP(18.2); // noordvleugel
const W3_TOP = NAP(14.5); // lage noordwestvleugel
const W4_TOP = NAP(17.6); // zuidvleugel naast de klokkentoren
// Vierkante voortorens (BAG): P1 noordelijk en P3 zuidelijk van de poort.
const P1 = { c: [-27.45, 11.35], half: 1.35 };
const P3 = { c: [-27.4, 0.7], half: 1.35 };
// Torens (AHN-DSM: middelpunt en hoogste punt).
const MAIN_TOWER = [-13.3, 0.75]; // NAP +38,7 m
const T2 = [-18.75, 13.4]; // hoge vierkante toren, NAP +34,4 m
const CLOCK = [-24.4, -5.9]; // klokkentoren, BAG-straal 2,1 m, NAP +29,2 m
const T3 = [-14.1, 16.9]; // ronde toren met kegeldak, NAP +28,9 m
const C2 = [-18.3, -0.7]; // ronde toren met kegeldak, NAP +27,8 m
const T4 = [-10.0, 9.0]; // ronde toren met kantelen en koepel, NAP +31,1 m

const parts = [];
const cuts = [];

// ---------- hoofdhal ----------
parts.push(prism(MAIN, BASE, MAIN_DECK));
// Dakrand 0,8 m breed, aan de buitenkant 0,2 m overstekend op een kraag van 45 graden.
parts.push(rim(MAIN, 0.8, MAIN_DECK - 0.05, MAIN_RIM));
{
  const outer = poly(MAIN).offset(0.2, "Miter");
  const band = extrudeCs(outer, MAIN_DECK - 0.4, MAIN_RIM).subtract(extrudeCs(poly(MAIN).offset(-0.8, "Miter"), MAIN_DECK - 1, MAIN_RIM + 1));
  // De kraag: per zijde een omhulsel van de gevellijn (onder) en de overstekende rand.
  const P = ccw(MAIN);
  const kraag = [];
  P.forEach((a, i) => {
    const b = P[(i + 1) % P.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const t = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    const n = [t[1], -t[0]];
    const q = (u, v, z) => [a[0] + t[0] * u + n[0] * v, a[1] + t[1] * u + n[1] * v, z];
    const z = MAIN_DECK - 0.65;
    kraag.push(hull([q(-0.2, 0, z), q(len + 0.2, 0, z), q(-0.2, -0.5, z), q(len + 0.2, -0.5, z), q(-0.2, 0.2, z + 0.25), q(len + 0.2, 0.2, z + 0.25), q(-0.2, -0.5, z + 0.3), q(len + 0.2, -0.5, z + 0.3)]));
  });
  parts.push(band.subtract(prism([[-40, -40], [-18.65, -40], [-18.65, 40], [-40, 40]], -5, 30)));
  parts.push(union(kraag).subtract(prism([[-40, -40], [-18.65, -40], [-18.65, 40], [-40, 40]], -5, 30)));
}
// Lisenen op de noord-, oost- en zuidgevel (niet tegen het paleis of in de zuidhal).
parts.push(
  pilasters(MAIN, 7, BASE, MAIN_DECK - 0.6, (p, n) => n[0] < -0.9 || n[1] < -0.9).add(
    pilasters([[-18.6, -16.75], [28.83, -16.75], [28.83, -16.0], [-18.6, -16.0]], 7, SOUTH_DECK - 0.1, MAIN_DECK - 0.6, (p, n) => n[1] > -0.9),
  ),
);
// Paaltjes op de hoeken en midden op de lange zijden.
for (const c of [
  [28.43, -16.35], [28.46, 5.5], [24.47, 6.4], [24.5, 20.2], [17.8, 26.95], [15.5, 29.19], [-18.2, 29.19], [-18.2, -16.35],
  [5.1, 29.19], [5.1, -16.35], [28.45, -5.4],
]) {
  parts.push(post(c, MAIN_DECK, MAIN_RIM + 0.9, MAIN_RIM + 1.6));
}

// Dakornament (witte paden, 0,2 m boven de daktuin): medaillon, kruis, rozetten.
const ORN = [5.5, 6.0];
const ORN_Z0 = MAIN_DECK - 0.05;
const ORN_Z1 = MAIN_DECK + 0.45;
const ring = (c, r0, r1, n = 48) => cyl(c, r1, ORN_Z0, ORN_Z1, n).subtract(cyl(c, r0, ORN_Z0 - 0.1, ORN_Z1 + 0.1, n));
const ornament = union([
  ring(ORN, 4.6, 5.2),
  ...[[3, 0], [-3, 0], [0, 3], [0, -3]].map(([dx, dy]) => ring([ORN[0] + dx, ORN[1] + dy], 1.25, 1.8, 32)),
  ring(ORN, 1.2, 1.75),
  cyl(ORN, 0.55, ORN_Z0, ORN_Z1, 24),
  // Kruis van paden, 0,5 m breed, met een ruit aan de uiteinden.
  box(-4.6, ORN[1] - 0.25, ORN_Z0, 15.6, ORN[1] + 0.25, ORN_Z1),
  box(ORN[0] - 0.25, -13.6, ORN_Z0, ORN[0] + 0.25, 25.6, ORN_Z1),
  ...[[-4.6, ORN[1]], [15.6, ORN[1]], [ORN[0], -13.6], [ORN[0], 25.6]].map((c) => prism(circle(c, 0.8, 4), ORN_Z0, ORN_Z1)),
  // Rozetten in de vier hoekvelden: ring met een vierpuntige ster.
  ...[[-0.6, 22.2], [11.6, 22.2], [-0.6, -10.2], [11.6, -10.2]].flatMap((c) => [
    ring(c, 1.3, 1.8, 32),
    prism([[c[0] - 1.35, c[1]], [c[0], c[1] - 0.3], [c[0] + 1.35, c[1]], [c[0], c[1] + 0.3]], ORN_Z0, ORN_Z1),
    prism([[c[0], c[1] - 1.35], [c[0] + 0.3, c[1]], [c[0], c[1] + 1.35], [c[0] - 0.3, c[1]]], ORN_Z0, ORN_Z1),
  ]),
]);
parts.push(ornament);

// ---------- zuidhal ----------
parts.push(prism(SOUTH, BASE, SOUTH_DECK));
parts.push(rim(SOUTH, 0.6, SOUTH_DECK - 0.05, SOUTH_RIM).subtract(box(-18.4, -16.5, 0, 29, -14, 20)));
parts.push(pilasters(SOUTH, 7, BASE, SOUTH_DECK - 0.4, (p, n) => n[1] > 0.9 || p[0] < -18 && n[0] > 0.9));

// ---------- paleis: vleugels ----------
// W1, het middendeel achter de voorgevel (dak achter de balustrade).
parts.push(box(FRONT, -0.6, BASE, -18.3, 12.7, W1_TOP));
parts.push(box(-26.6, 12.6, BASE, -18.3, 15.4, W1_TOP));
// Noordelijk van P1 een lagere stenen voorbouw met een deklijst (AHN NAP +18,6 m).
parts.push(box(FRONT, 12.6, BASE, -26.5, 15.4, NAP(18.3)));
parts.push(corbelRect(FRONT, 12.7, -26.5, 15.3, NAP(18.3) - 0.3, 0.2, 0.3));
// W2 noordvleugel met borstwering, W3 lage noordwestvleugel (met de uitbouw aan de noordkant).
parts.push(box(FRONT, 15.3, BASE, -18.3, 21.03, W2_TOP));
parts.push(rim(rect(FRONT, 15.3, -18.3, 21.03), 0.5, W2_TOP - 0.05, W2_TOP + 0.45).subtract(box(-30, 14, 0, -18.4, 15.4, 30)));
const W3 = [[-28.86, 21.03], [-18.3, 21.03], [-18.3, 29.59], [-25.28, 29.59], [-25.25, 33.8], [-28.87, 33.8]];
parts.push(prism(W3, BASE, W3_TOP));
parts.push(rim(W3, 0.5, W3_TOP - 0.05, W3_TOP + 0.45).subtract(box(-28.5, 20.5, 0, -18.4, 21.5, 30)));
// W4 zuidvleugel met borstwering.
const W4 = [[-25.5, -12.6], [-18.3, -12.6], [-18.3, -0.6], [-24.4, -0.6], [-24.4, -7.8], [-25.5, -7.8]];
parts.push(prism(W4, BASE, W4_TOP));
parts.push(rim(W4, 0.5, W4_TOP - 0.05, W4_TOP + 0.4).subtract(cyl(CLOCK, 2.0, 0, 30)));
// Vensters in de vleugels (westgevels), spitsboognissen.
for (const y of [17.0, 19.4]) cuts.push(niche([FRONT, y], W, 0.9, NAP(15.6), NAP(16.8)));
for (const y of [-11.0, -9.2]) cuts.push(niche([-25.5, y], W, 0.9, NAP(15.4), NAP(16.5)));
cuts.push(niche([-24.4, -2.4], W, 0.9, NAP(15.4), NAP(16.5)));

// ---------- voorgevel: middendeel met poort, balkon, kroonlijst, balustrade ----------
const BAY = [2.05, 9.98];
const BAY_MID = (BAY[0] + BAY[1]) / 2;
const BALCONY = NAP(15.5); // vloer van het balkon, net boven de rotsen in het PDOK-terrein
// Spitsboogpoort met een verhoogde omlijsting.
parts.push(frame([FRONT, BAY_MID], W, 4.3, BALCONY - 0.1, BALCONY + 1.9, 0.2, 55));
cuts.push(niche([FRONT - 0.25, BAY_MID], W, 3.3, BALCONY, BALCONY + 1.8, 0.6, 55));
// Balkon voor de poort: een blok tot de onderkant met een dichte balustrade en paaltjes.
parts.push(box(FRONT - 1.4, BAY_MID - 2.95, BASE, FRONT + 0.05, BAY_MID + 2.95, BALCONY));
parts.push(box(FRONT - 1.4, BAY_MID - 2.6, BALCONY - 0.05, FRONT - 0.9, BAY_MID + 2.6, BALCONY + 1.0));
for (const y of [BAY_MID - 2.6, BAY_MID + 2.6]) {
  parts.push(box(FRONT - 1.4, y - 0.35, BALCONY - 0.05, FRONT + 0.05, y + 0.35, BALCONY + 1.0));
  parts.push(post([FRONT - 1.05, y], BALCONY, BALCONY + 1.5, BALCONY + 2.3, 0.4));
}
for (let k = 0; k < 4; k++) cuts.push(niche([FRONT - 1.4, BAY_MID - 1.5 + k], W, 0.5, BALCONY + 0.2, BALCONY + 0.55, 0.25, 60));
// Kroonlijst op een kraag en de balustrade erboven met paaltjes en nissen.
const CORNICE = NAP(20.0);
parts.push(corbelRect(FRONT, BAY[0] + 0.3, FRONT + 2, BAY[1] - 0.3, CORNICE - 0.6, 0.3, 0.3));
parts.push(box(FRONT - 0.3, BAY[0], CORNICE - 0.05, FRONT + 0.5, BAY[1], NAP(21.3)));
for (let k = 0; k < 6; k++) cuts.push(niche([FRONT - 0.3, BAY[0] + 0.95 + k * 1.2], W, 0.55, CORNICE + 0.2, CORNICE + 0.45, 0.3, 60));
for (const y of [BAY[0] + 0.45, BAY_MID, BAY[1] - 0.45]) parts.push(post([FRONT - 0.05, y], CORNICE, NAP(22.2), NAP(23.0), 0.35));
// Steil leien schilddak (nok NAP +26,6 m) met de dakkapel aan de voorkant.
parts.push(hull([...ring3(rect(-27.4, 2.6, -20.0, 9.4), W1_TOP - 0.05), ...ring3(rect(-24.6, 4.8, -23.0, 7.2), NAP(26.6))]));
{
  const y0 = BAY_MID - 0.85;
  const y1 = BAY_MID + 0.85;
  parts.push(box(-27.1, y0, W1_TOP - 0.05, -24.5, y1, NAP(24.3)));
  parts.push(hull([[-27.1, y0, NAP(24.3) - 0.01], [-24.5, y0, NAP(24.3) - 0.01], [-27.1, y1, NAP(24.3) - 0.01], [-24.5, y1, NAP(24.3) - 0.01], [-27.1, BAY_MID, NAP(25.4)], [-24.5, BAY_MID, NAP(25.4)]]));
  parts.push(spire([-26.75, BAY_MID], 0.3, NAP(25.0), NAP(27.5), 8));
  cuts.push(niche([-27.1, BAY_MID], W, 0.6, NAP(22.4), NAP(23.3), 0.3, 60));
}

// ---------- vierkante voortorens met uikoepel (P1, P3) ----------
for (const { c, half } of [P1, P3]) {
  parts.push(sq(c, half, BASE, NAP(22.0)));
  parts.push(corbelSq(c, half, NAP(19.2), 0.2, 0.3));
  parts.push(corbelSq(c, half, NAP(21.7), 0.25, 0.35));
  parts.push(cyl(c, 1.05, NAP(22.25), NAP(22.9), 24));
  parts.push(
    onion(c, [[1.05, NAP(22.85)], [1.3, NAP(23.15)], [1.35, NAP(23.45)], [1.2, NAP(24.0)], [0.85, NAP(24.5)], [0.45, NAP(24.9)], [0.28, NAP(25.2)], [0.42, NAP(25.45)], [0.25, NAP(25.7)]], NAP(26.7)),
  );
  // Hoog spitsboogvenster onder de lijst, een kleiner erboven (westgevel).
  cuts.push(niche(face(c, half, W), W, 0.9, NAP(16.1), NAP(18.0)));
  cuts.push(niche(face(c, half, W), W, 0.75, NAP(19.9), NAP(20.6)));
}
cuts.push(niche(face(P3.c, P3.half, S), S, 0.75, NAP(19.9), NAP(20.6)));
cuts.push(niche(face(P3.c, P3.half, S), S, 0.9, NAP(16.1), NAP(18.0)));

// ---------- hoge vierkante toren T2 ----------
{
  const c = T2;
  parts.push(sq(c, 2.0, BASE, NAP(27.6)));
  parts.push(corbelSq(c, 2.0, NAP(27.3), 0.2, 0.3));
  parts.push(corbelSq(c, 2.0, NAP(23.6), 0.15, 0.25));
  parts.push(sq(c, 1.8, NAP(27.7), NAP(30.6)));
  parts.push(corbelSq(c, 1.8, NAP(30.5), 0.25, 0.35));
  parts.push(
    onion(c, [[1.6, NAP(31.05)], [1.78, NAP(31.3)], [1.82, NAP(31.8)], [1.6, NAP(32.4)], [1.1, NAP(33.0)], [0.55, NAP(33.4)], [0.35, NAP(33.7)], [0.45, NAP(33.9)], [0.25, NAP(34.1)]], NAP(34.9)),
  );
  for (const n of [W, N, S]) {
    cuts.push(niche(face(c, 2.0, n), n, 0.9, NAP(21.4), NAP(22.8)));
    cuts.push(niche(face(c, 2.0, n), n, 0.9, NAP(24.5), NAP(26.3)));
    cuts.push(niche(face(c, 1.8, n), n, 0.8, NAP(28.3), NAP(29.5)));
  }
  cuts.push(niche(face(c, 1.8, E), E, 0.8, NAP(28.3), NAP(29.5)));
}

// ---------- klokkentoren ----------
{
  const c = CLOCK;
  parts.push(cyl(c, 2.1, BASE, NAP(18.3), 40));
  // Kantelenkrans op een kraag.
  parts.push(corbelRound(c, 2.1, NAP(18.0), 0.4, 0.25, 40));
  parts.push(merlonsRound(c, 2.0, 2.5, NAP(18.6), NAP(19.4), 10, 0.9));
  parts.push(cyl(c, 1.95, NAP(18.2), NAP(23.6), 40));
  // Omloop met de vier torentjes en de wijzerplaat.
  parts.push(corbelRound(c, 1.95, NAP(23.1), 0.35, 0.3, 40));
  for (const a of [45, 135, 225, 315]) {
    const t = (a * Math.PI) / 180;
    parts.push(turret([c[0] + 1.9 * Math.cos(t), c[1] + 1.9 * Math.sin(t)], 0.5, NAP(23.75), NAP(25.2), NAP(26.3)));
  }
  parts.push(cyl(c, 1.75, NAP(23.7), NAP(25.6), 40));
  // Wijzerplaat aan de westkant: een schijf met een afgeschuinde rand.
  const disc = (x, r) => Array.from({ length: 24 }, (_, k) => [x, c[1] + r * Math.cos((2 * Math.PI * k) / 24), NAP(24.7) + r * Math.sin((2 * Math.PI * k) / 24)]);
  parts.push(hull([...disc(c[0] - 1.5, 0.7), ...disc(c[0] - 1.75, 0.7), ...disc(c[0] - 1.95, 0.5)]));
  parts.push(
    onion(c, [[1.75, NAP(25.55)], [1.95, NAP(25.8)], [2.05, NAP(26.2)], [1.9, NAP(26.8)], [1.5, NAP(27.4)], [0.9, NAP(27.9)], [0.4, NAP(28.2)], [0.3, NAP(28.5)], [0.42, NAP(28.7)], [0.25, NAP(28.9)]], NAP(29.6)),
  );
  for (const a of [180, 150, 210]) {
    const { at, n } = radial(c, 2.1, a);
    cuts.push(niche(at, n, 0.8, NAP(15.3), NAP(16.6), 0.45));
  }
  for (const a of [160, 200]) {
    const { at, n } = radial(c, 1.95, a);
    cuts.push(niche(at, n, 0.75, NAP(20.6), NAP(21.9), 0.45));
  }
}

// ---------- hoofdtoren ----------
{
  const c = MAIN_TOWER;
  parts.push(sq(c, 2.5, MAIN_DECK - 0.1, NAP(27.6)));
  parts.push(corbelSq(c, 2.5, NAP(21.0), 0.15, 0.25));
  // Omloop met arcade op een kraag, dan het brede overstekende dak.
  parts.push(corbelSq(c, 2.5, NAP(27.2), 0.4, 0.05));
  parts.push(sq(c, 2.9, NAP(27.7), NAP(29.6)));
  parts.push(corbelSq(c, 2.9, NAP(29.55), 0.6, 0.3));
  parts.push(hull([...ring3(rect(c[0] - 3.5, c[1] - 3.5, c[0] + 3.5, c[1] + 3.5), NAP(30.4)), ...ring3(rect(c[0] - 2.2, c[1] - 2.2, c[0] + 2.2, c[1] + 2.2), NAP(31.8))]));
  parts.push(cyl(c, 2.0, NAP(31.7), NAP(33.1), 32));
  parts.push(
    onion(c, [[2.0, NAP(33.05)], [2.25, NAP(33.35)], [2.3, NAP(33.8)], [2.1, NAP(34.5)], [1.6, NAP(35.3)], [0.9, NAP(36.0)], [0.45, NAP(36.4)], [0.3, NAP(36.7)], [0.5, NAP(37.0)], [0.25, NAP(37.4)]], NAP(38.9)),
  );
  for (const n of [W, E, N, S]) {
    // Drie hoge spitsboogvensters per zijde.
    for (const u of [-0.9, 0, 0.9]) cuts.push(niche(face(c, 2.5, n, u), n, 0.55, NAP(21.6), NAP(25.8)));
    // Arcade van de omloop.
    for (const u of [-1.95, -0.65, 0.65, 1.95]) cuts.push(niche(face(c, 2.9, n, u), n, 0.8, NAP(27.9), NAP(28.7)));
  }
  for (let k = 0; k < 8; k++) {
    const { at, n } = radial(c, 2.0, 22.5 + 45 * k);
    cuts.push(niche(at, n, 0.5, NAP(32.0), NAP(32.5), 0.4));
  }
}

// ---------- ronde torens met kegeldak (T3, C2) ----------
{
  parts.push(cyl(T3, 1.5, MAIN_DECK - 0.1, NAP(24.0), 24));
  parts.push(corbelRound(T3, 1.5, NAP(23.55), 0.45, 0.2, 24));
  parts.push(spire(T3, 1.95, NAP(24.15), NAP(28.9), 12, 0));
  for (const a of [90, 180, 0]) {
    const { at, n } = radial(T3, 1.5, a);
    cuts.push(niche(at, n, 0.7, NAP(20.8), NAP(22.2), 0.4));
  }
  parts.push(cyl(C2, 1.25, BASE, NAP(23.3), 24));
  parts.push(corbelRound(C2, 1.25, NAP(22.95), 0.35, 0.2, 24));
  parts.push(spire(C2, 1.6, NAP(23.45), NAP(27.8), 12, 0));
  {
    const { at, n } = radial(C2, 1.25, 180);
    cuts.push(niche(at, n, 0.6, NAP(21.8), NAP(22.6), 0.4));
  }
}

// ---------- ronde toren T4 met kantelen, torentjes en koepel ----------
{
  const c = T4;
  parts.push(cyl(c, 2.0, MAIN_DECK - 0.1, NAP(24.6), 40));
  parts.push(corbelRound(c, 2.0, NAP(24.2), 0.4, 0.4, 40));
  parts.push(merlonsRound(c, 1.95, 2.4, NAP(24.95), NAP(25.8), 10, 0.9));
  for (const a of [0, 90, 180, 270]) {
    const t = (a * Math.PI) / 180;
    parts.push(turret([c[0] + 2.0 * Math.cos(t), c[1] + 2.0 * Math.sin(t)], 0.45, NAP(25.0), NAP(26.3), NAP(27.3)));
  }
  parts.push(cyl(c, 1.8, NAP(24.5), NAP(26.3), 40));
  parts.push(
    onion(c, [[1.8, NAP(26.25)], [2.0, NAP(26.5)], [2.05, NAP(27.0)], [1.85, NAP(27.8)], [1.4, NAP(28.6)], [0.8, NAP(29.3)], [0.4, NAP(29.7)], [0.3, NAP(29.95)], [0.42, NAP(30.2)], [0.22, NAP(30.4)]], NAP(31.1)),
  );
  for (const a of [180, 90, 135]) {
    const { at, n } = radial(c, 2.0, a);
    cuts.push(niche(at, n, 0.8, NAP(20.9), NAP(22.5), 0.45));
  }
}

const paleis = union(parts).subtract(union(cuts));

// ---------- daktuin ----------
// Sedum binnen de dakrand (0,3 m), met uitsparingen voor het ornament en de
// torens. Een losse plaat op het dak zou de export tot de onderplaat opvullen
// (als groen volume in de hal); daarom draagt de node zichzelf met een
// verborgen kern binnen de hoofdhal, 1 m binnen de gevels, van de onderkant
// tot net onder het dak (zoals de daktuin van Depot Boijmans). De kern zit
// overal in de gebouwnode, die in de GLB vóór de groene node staat.
const TUIN_Z1 = MAIN_DECK + 0.25;
const tuinCore = extrudeCs(poly(MAIN).offset(-1.0, "Miter"), BASE, MAIN_DECK - 0.02);
const daktuin = extrudeCs(poly(MAIN).offset(-0.8, "Miter"), MAIN_DECK - 0.05, TUIN_Z1)
  .subtract(ornament)
  .subtract(union([sq(MAIN_TOWER, 2.5, 0, 30), cyl(T3, 1.5, 0, 30), cyl(T4, 2.0, 0, 30), sq(T2, 2.0, 0, 30), cyl(C2, 1.25, 0, 30)]))
  .add(tuinCore);
if (!tuinCore.subtract(paleis).isEmpty() && tuinCore.subtract(paleis).volume() > 1e-3) throw new Error("kern van de daktuin steekt buiten het gebouw");

// ---------- controles ----------
const nodes = [
  ["building:paleis", paleis],
  ["vegetation:daktuin", daktuin],
];
// Ondervlakken boven de onderkant: alleen de vlakke bovenkanten van nissen
// mogen niet voorkomen; geef een overzicht van wat er hangt.
const hanging = downFaces(paleis, BASE).filter((g) => g.z > BASE + 0.05);
console.log("ondervlakken paleis (z, m², punt):", hanging.map((g) => `${g.z}:${g.area}@${g.at.join(",")}`).join(" "));
console.log("losse delen:", paleis.decompose().map((m) => { const b = m.boundingBox(); return `${b.min.map((v) => v.toFixed(1))}..${b.max.map((v) => v.toFixed(1))}`; }).join(" | "));

await writeLandmark({
  slug: "efteling-symbolica",
  nodes,
  base: BASE,
  catalog: {
    name: "Symbolica (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: -0.3,
    // Op het plein voor het paleis, de paden ten noorden en ten oosten van de
    // hal (PDOK-terrein NAP +9,8 tot +9,9 m); niet op de kunstrotsen aan de
    // voorgevel, de vijver ten oosten of het hogere pad ten zuiden.
    groundSamplePoints: [
      [-38, 0],
      [-38, 15],
      [-15, 35],
      [31, -8],
      [31, -15],
    ],
    replacesBuildings: ["NL.IMBAG.Pand.0809100000019177"],
    description:
      "Symbolica, het Paleis der Fantasie (2017): oorsprong midden in de hoofdhal op RD (131675, 406851) op het maaiveld (NAP +9,9 m), +X langs de gebouwas 5,3 graden linksom van RD-oost, de voorgevel met de torens aan de westkant (-X); hallen, torens en koepels op de AHN-hoogtes, gevelreliëf en dakornament naar foto's en de luchtfoto.",
    realWorld: {
      hoofdhalM: [47.4, 46.3],
      dakHoofdhalNapM: 19.1,
      dakZuidhalNapM: 15.4,
      dakPaleisNapM: 21.2,
      maaiveldNapM: GROUND_NAP,
      hoofdtorenTopNapM: 38.7,
      hogeVierkanteTorenTopNapM: 34.4,
      klokkentorenTopNapM: 29.2,
      nokSchilddakNapM: 26.6,
      totaalM: [57.7, 66.2],
      geopend: 2017,
    },
    sources: [
      "BAG pand 0809100000019177 (PDOK BAG WFS)",
      "AHN DSM/DTM 0,5 m (PDOK WCS)",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR)",
      "PDOK 3D-tegels (gebouwen en terrein) voor vervangen panden en maaiveld",
      "Wikimedia Commons, Category:Symbolica (Efteling): Symbolica (Efteling) 20170521, Symbolica voorzijde, Symbolica2018, Symbolica Palace Efteling, Symbolica vanaf Pagode",
      "Wikipedia: Symbolica (attractie)",
    ],
  },
});

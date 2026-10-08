// Genereert een vereenvoudigd, gesloten 3D-model van Danse Macabre in de
// Efteling (Kaatsheuvel, Anderrijk, geopend 31 oktober 2024 op de plek van het
// Spookslot): de "abdij" met de tienhoekige showhal rond de draaischijf van
// 18 m. Een hoge, gesloten onderbouw met een rondboogfries op consoles en een
// borstwering, daarop een terugliggende, tienhoekige lichtbeuk met per zijde
// twee blinde spitsboogvensters tussen steunberen, aan de voor- en achterzijde
// een groot maaswerkvenster met twee rozetten (ronde nissen) en een
// puntgeveltje, op de hoeken van die zijden slanke pinakels en op de overige
// hoeken schoorsteenachtige steunbeerkoppen; een laag tienhoekig piramidedak
// met een ring en een naaf in het midden. Aan de voet de hergebruikte gevels
// van de oude Spookslot-entree: de grote puntgevel met het ronde venster en de
// ingang (zuidzijde) en de zigzag van spitse geveltjes met de poort van
// "Dr. Charlatans" (zuidwest- en west-zuidwestzijde). Daarnaast de platte
// bijgebouwen binnen hetzelfde BAG-pand (oost, noord en noordwest) en de
// geruïneerde ronde toren ten noorden van de hal. Alle maten in het script
// zijn meters op ware grootte. Uitvoer via scripts/efteling-kit.mjs: een GLB
// in meters (Y omhoog, nodes `klasse:label`), de catalogus-JSON en een
// binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-efteling-danse-macabre.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-danse-macabre.mjs --scale 500
//
// Plattegrond: de onderbouw is een vrijwel regelmatige tienhoek. Een fit van
// een regelmatige tienhoek op de BAG-hoekpunten van de zuid-, zuidwest- en
// westgevel geeft het hart RD (131558,20, 406711,50), een apothema van 16,67
// m (33,3 m tussen de vlakke zijden, zijden van 10,8 m) en een restfout van 7
// cm; de kleine uitstulpingen in de BAG-contour op de hoeken zijn de
// steunberen. De lichtbeuk (27,4 m tussen de vlakke zijden, op de luchtfoto
// gemeten aan de witte dakrand) en de dakring (22,4 m) liggen concentrisch.
// De bijgebouwen volgen de BAG-contour buiten de tienhoek.
//
// Hoogtes: het AHN (DSM/DTM 0,5 m) dateert van vóór de bouw en toont nog het
// rechthoekige Spookslot; het is hier alleen gebruikt voor het maaiveld rond
// de hal (NAP +9,1 tot +9,3 m aan de zuid- en westkant). De PDOK-reconstructie
// van het nieuwe pand is een LoD1.1-blok van 16 m. De hoogtes zijn daarom
// geschat uit foto's (verhoudingen tot de zijdebreedte van de lichtbeuk, 8,9
// m, en de ronde vensteropening van circa 1,8 m): onderbouw met fries tot 9,4
// m en borstwering tot 10 m, lichtbeuk met kroonlijst tot 15 m en
// borstwering tot 15,6 m, dak tot 18,3 m, steunbeerkoppen tot 17,8 m,
// pinakels tot 21,2 m, de grote puntgevel tot 8,2 m.
//
// Printbaar op 1:1000 zonder steun: muren staan recht op, dakvlakken en
// gevelpunten lopen schuin omhoog; het fries en de kroonlijst rusten op een
// kraag van 45 graden, de consoles onder het fries hebben een onderkant van
// 45 graden. Vensters, rozetten en deuren zijn blinde nissen van 0,35–0,5 m;
// de spitsbogen hebben een top van 58 graden. Pinakels zijn 1,3 m dik met een
// achtkante spits van 1,4 m breed. De onderkant ligt voor alle onderdelen op
// 0,5 m onder het maaiveld.
//
// Assenstelsel: oorsprong in het hart van de tienhoek op RD (131558,20,
// 406711,50), op het maaiveld (circa NAP +9,2 m), Z omhoog. +X loopt 6,5
// graden linksom gedraaid ten opzichte van de RD-x-as (oost-noordoost), +Y
// naar het noord-noordwesten; de voorzijde met de grote puntgevel en het
// maaswerkvenster kijkt naar -Y (zuid-zuidoost, naar het Abdijplein).
//
// Bronnen: BAG-pand 0809100000020767 (contour, bouwjaar 2025, 1201 m²);
// PDOK-luchtfoto 8 cm (Actueel_orthoHR): de tienhoek, de lichtbeuk, de
// dakring, de bijgebouwen en de ruïnetoren; PDOK 3D-gebouwtegel (LoD1.1-blok
// van 16 m voor dit pand); AHN DTM 0,5 m voor het maaiveld; Wikipedia
// (nl: Danse Macabre (Efteling): opening 2024, draaischijf 18 m, de oude
// Spookslot-entree als entree van de abdij); Wikimedia Commons, Category:Danse
// Macabre (Efteling) (Danse Macabre (2024).jpg, Danse Macabre.jpg, Efteling
// Danse Macabre (5) en (7), bouwfoto's Danse Macabre (Efteling) (1) tot (4)).
// Geschat: alle hoogtes (zie boven), de diepte van de gevels aan de voet, de
// indeling van de lichtbeuk (twee vensters per zijde, grote vensters voor en
// achter), welke hoeken een pinakel hebben, de hoogtes van de bijgebouwen
// (oost 8,6 m, noord 6 m, noordwest 7 en 5 m) en de vorm en hoogte van de
// ruïnetoren (tot 12,5 m). Het steile vakwerk boven het dak, lantaarns,
// beelden, de doek van "Dr. Charlatans" en de kantelen in de geruïneerde
// borstwering zijn weggelaten.
//
// Niet in het model: In den Swarte Kat (BAG 0809100000020769, 2023, een
// los horecagebouw 60 m zuidelijker), het hokje 0809100000020768 en de
// rode pannendaken van de Kruysgang ten zuidoosten (geen BAG-pand).
import { CrossSection, Manifold, ccw, circle, hull, prism, ring3, spire, union, writeLandmark } from "./efteling-kit.mjs";

// ---------- maten ----------
const ORIGIN = [131558.2, 406711.5];
const ROT = (6.5 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ROT).toFixed(6), +Math.sin(ROT).toFixed(6)];
const BASE = -0.5;
const C18 = Math.cos(Math.PI / 10);
const TAN58 = Math.tan((58 * Math.PI) / 180);
const deg = (d) => (d * Math.PI) / 180;

// Tienhoek met de hoekpunten op 0, 36, 72 ... graden; de vlakke zijden kijken
// dus naar -90, -54, -18, 18, 54, 90, 126, 162, 198 en 234 graden.
const decagon = (ap) => circle([0, 0], ap / C18, 10, 0);
const dec = (ap, z0, z1) => prism(decagon(ap), z0, z1);
const decFrustum = (ap0, z0, ap1, z1) => hull([...ring3(decagon(ap0), z0), ...ring3(decagon(ap1), z1)]);
const FACES = Array.from({ length: 10 }, (_, k) => -90 + 36 * k);
const CORNERS = Array.from({ length: 10 }, (_, k) => 36 * k);

// Punt in het stelsel van een gevel: zijde met normaal phi (graden) op
// apothema ap; s langs de gevel (linksom), d naar buiten, z omhoog.
const fp = (phi, ap, s, d, z) => {
  const n = [Math.cos(deg(phi)), Math.sin(deg(phi))];
  return [n[0] * (ap + d) - n[1] * s, n[1] * (ap + d) + n[0] * s, z];
};
// Convexe veelhoek in het gevelvlak (punten [s, z]) tussen diepte d0 en d1.
const faceSolid = (phi, ap, poly, d0, d1, s0 = 0) =>
  hull(poly.flatMap(([s, z]) => [fp(phi, ap, s0 + s, d0, z), fp(phi, ap, s0 + s, d1, z)]));
// Spitsboog: breedte w, onderkant z0, aanzet zs, top onder 58 graden.
const lancet = (w, z0, zs) => [[-w / 2, z0], [w / 2, z0], [w / 2, zs], [0, zs + (w / 2) * TAN58], [-w / 2, zs]];
// Puntgevel: breedte w, voet z0, goot ze, top za.
const gable = (w, z0, ze, za) => [[-w / 2, z0], [w / 2, z0], [w / 2, ze], [0, za], [-w / 2, ze]];
const roundel = (r, zc) => circle([0, zc], r, 16, Math.PI / 16);
// Vierkante pijler op een hoek (hoek theta in graden) van straal r0 tot r1,
// breedte w, van z0 tot z1.
const cornerBlock = (theta, r0, r1, w, z0, z1) => {
  const r = [Math.cos(deg(theta)), Math.sin(deg(theta))];
  const t = [-r[1], r[0]];
  const p = (a, b) => [r[0] * a + t[0] * b, r[1] * a + t[1] * b];
  return prism([p(r0, -w / 2), p(r1, -w / 2), p(r1, w / 2), p(r0, w / 2)], z0, z1);
};

// Onderbouw (apothema 16,67 m): muur tot de loopgang op 9,4 m, fries 0,35 m
// uitkragend op een kraag van 45 graden (7,65–8,0 m) tot de borstwering op
// 10,0 m; de borstwering is 0,9 m dik.
const LOW = { ap: 16.67, walk: 9.4, kraag: 7.65, band: 8.0, top: 10.0, out: 0.35, parapet: 0.9 };
// Lichtbeuk (apothema 13,7 m): van de loopgang tot de goot op 15,0 m, kroonlijst
// 0,3 m uitkragend (kraag 14,3–14,6 m), borstwering 0,9 m dik tot 15,6 m.
const UP = { ap: 13.7, z0: 9.2, gutter: 15.0, kraag: 14.3, band: 14.6, top: 15.6, out: 0.3, parapet: 0.9 };
// Dak: dakring (apothema 11,2 m) tot 15,9 m, piramide tot 18,3 m, naaf.
const ROOF = { ap: 11.2, curb: 15.9, apex: 18.3 };
// Zijden met het grote maaswerkvenster, het puntgeveltje en de pinakels.
const WINDOW_FACES = [-90, 90];
const PINNACLE_CORNERS = [72, 108, 252, 288];

// ---------- onderbouw ----------
const lowerParts = [
  dec(LOW.ap, BASE, LOW.walk),
  decFrustum(LOW.ap, LOW.kraag, LOW.ap + LOW.out, LOW.band),
  dec(LOW.ap + LOW.out, LOW.band - 0.01, LOW.top),
];
// Consoles onder het fries (rondboogfries): 0,4 m breed om de 1,4 m, met een
// onderkant van 45 graden.
for (const phi of FACES) {
  for (let s = -4.2; s <= 4.21; s += 1.4) {
    lowerParts.push(
      hull([
        ...[-0.2, 0.2].flatMap((ds) => [
          fp(phi, LOW.ap, s + ds, -0.05, LOW.kraag - 0.35),
          fp(phi, LOW.ap, s + ds, -0.05, LOW.kraag + 0.01),
          fp(phi, LOW.ap, s + ds, 0.35, LOW.kraag + 0.01),
        ]),
      ]),
    );
  }
}
// Steunberen op de hoeken: 1,2 m breed, 0,9 m voor de hoek, met een schuine
// afdekking (36 graden) tot onder de consoles.
for (const theta of CORNERS) {
  const R = LOW.ap / C18;
  const r = [Math.cos(deg(theta)), Math.sin(deg(theta))];
  const t = [-r[1], r[0]];
  const p = (a, b, z) => [r[0] * a + t[0] * b, r[1] * a + t[1] * b, z];
  lowerParts.push(
    hull([
      ...[-0.6, 0.6].flatMap((b) => [p(R - 0.6, b, BASE), p(R + 0.9, b, BASE), p(R + 0.9, b, 6.5), p(R - 0.6, b, 7.6)]),
    ]),
  );
}
let lower = union(lowerParts).subtract(dec(LOW.ap + LOW.out - LOW.parapet - LOW.out, LOW.walk, LOW.top + 1));

// Gevels van de oude Spookslot-entree aan de voet.
// Zuid (-90): grote puntgevel 9 m breed, 0,9 m voor de muur, goot 4,2 m, top
// 8,2 m (41,6 graden), met een rond venster (nis, r 1,0 m) en rechts de ingang.
const S_FACE = -90;
const frontGable = faceSolid(S_FACE, LOW.ap, gable(9.0, BASE, 4.2, 8.2), -0.1, 0.9);
// Zuidwest (-126): reliëf 0,6 m met drie spitse geveltjes; de middelste
// (Dr. Charlatans) met de poort, de zijgeveltjes met een spitse nis.
const SW_FACE = -126;
const swGables = union([
  faceSolid(SW_FACE, LOW.ap, gable(3.8, BASE, 4.4, 7.6), -0.1, 0.6),
  faceSolid(SW_FACE, LOW.ap, gable(2.8, BASE, 4.4, 6.2), -0.1, 0.6, -3.3),
  faceSolid(SW_FACE, LOW.ap, gable(2.8, BASE, 4.4, 6.2), -0.1, 0.6, 3.3),
]);
// West-zuidwest (198 = -162): drie lage spitse geveltjes als reliëf van 0,45 m.
const WSW_FACE = -162;
const wswGables = union(
  [-3.2, 0, 3.2].map((s0) => faceSolid(WSW_FACE, LOW.ap, gable(2.8, BASE, 3.0, 4.8), -0.1, 0.45, s0)),
);
lower = union([lower, frontGable, swGables, wswGables]);
const lowerNiches = [
  faceSolid(S_FACE, LOW.ap, roundel(1.0, 5.9), 0.55, 1.5),
  faceSolid(S_FACE, LOW.ap, lancet(2.0, BASE - 0.1, 2.3), 0.4, 1.5, 2.4),
  faceSolid(SW_FACE, LOW.ap, lancet(2.6, BASE - 0.1, 2.0), 0.1, 1.5),
  faceSolid(SW_FACE, LOW.ap, lancet(1.4, 0.3, 1.9), 0.3, 1.5, -3.3),
  faceSolid(SW_FACE, LOW.ap, lancet(1.4, 0.3, 1.9), 0.3, 1.5, 3.3),
];
lower = lower.subtract(union(lowerNiches));

// ---------- lichtbeuk ----------
let upper = union([
  dec(UP.ap, UP.z0, UP.gutter),
  decFrustum(UP.ap, UP.kraag, UP.ap + UP.out, UP.band),
  dec(UP.ap + UP.out, UP.band - 0.01, UP.top),
]).subtract(dec(UP.ap + UP.out - UP.parapet, UP.gutter, UP.top + 1));
// Puntgeveltjes boven de grote vensters: 4,4 m breed tot 17,8 m (45 graden).
for (const phi of WINDOW_FACES) upper = upper.add(faceSolid(phi, UP.ap, gable(4.4, UP.gutter, UP.top, 17.8), -0.6, UP.out));
const upperNiches = [];
for (const phi of FACES) {
  if (WINDOW_FACES.includes(phi)) {
    // Groot maaswerkvenster (3,0 m breed, tot 15,4 m) met twee montants,
    // daarnaast rozetten en lage spitse nissen.
    const window = faceSolid(phi, UP.ap, lancet(3.0, 10.2, 13.0), -0.4, UP.out + 0.2);
    const mullions = union([-0.5, 0.5].map((s0) => faceSolid(phi, UP.ap, [[-0.15, 10.0], [0.15, 10.0], [0.15, 13.0], [-0.15, 13.0]], -0.5, 0.0, s0)));
    upperNiches.push(window.subtract(mullions));
    for (const s0 of [-3.0, 3.0]) {
      upperNiches.push(faceSolid(phi, UP.ap, roundel(0.75, 13.2), -0.35, 0.1, s0));
      upperNiches.push(faceSolid(phi, UP.ap, lancet(1.3, 10.4, 11.3), -0.35, 0.1, s0));
    }
  } else {
    for (const s0 of [-1.9, 1.9]) upperNiches.push(faceSolid(phi, UP.ap, lancet(1.5, 10.4, 13.0), -0.35, 0.1, s0));
  }
}
upper = upper.subtract(union(upperNiches));
// Steunberen op de hoeken van de lichtbeuk: 1,3 m breed, 0,7 m voor de hoek;
// pinakels (achtkante stage en spits tot 21,2 m) op de hoeken naast de grote
// vensters, elders steunbeerkoppen met een vierzijdig dakje tot 17,8 m.
const upperCorners = [];
for (const theta of CORNERS) {
  const R = UP.ap / C18;
  const mid = R + 0.05;
  const c = [Math.cos(deg(theta)) * mid, Math.sin(deg(theta)) * mid];
  if (PINNACLE_CORNERS.includes(theta)) {
    upperCorners.push(cornerBlock(theta, R - 0.6, R + 0.7, 1.3, UP.z0, 17.4));
    upperCorners.push(prism(circle(c, 0.68, 8, Math.PI / 8), 17.39, 18.2));
    upperCorners.push(spire(c, 0.68, 18.19, 21.2, 8, Math.PI / 8));
  } else {
    upperCorners.push(cornerBlock(theta, R - 0.6, R + 0.7, 1.3, UP.z0, 17.0));
    const r = [Math.cos(deg(theta)), Math.sin(deg(theta))];
    const t = [-r[1], r[0]];
    const p = (a, b) => [r[0] * a + t[0] * b, r[1] * a + t[1] * b];
    upperCorners.push(
      hull([...[[R - 0.6, -0.65], [R + 0.7, -0.65], [R + 0.7, 0.65], [R - 0.6, 0.65]].map(([a, b]) => [...p(a, b), 16.99]), [...p(mid, 0), 17.8]]),
    );
  }
}
upper = union([upper, ...upperCorners]);

// ---------- dak ----------
const roof = union([
  dec(UP.ap + UP.out - UP.parapet + 0.05, UP.gutter - 0.2, UP.gutter),
  dec(ROOF.ap, UP.gutter - 0.1, ROOF.curb),
  decFrustum(ROOF.ap - 0.5, ROOF.curb - 0.01, 0.3, ROOF.apex),
  prism(circle([0, 0], 1.6, 10, 0), ROOF.curb, ROOF.apex + 0.3),
  // Stalen spanten van het glasdak langs de tien graten: 0,5 m breed, 0,5 m
  // boven het dakvlak, met de onderkant 0,3 m in het dak.
  ...CORNERS.map((theta) => {
    const r = [Math.cos(deg(theta)), Math.sin(deg(theta))];
    const t = [-r[1], r[0]];
    const rOut = (ROOF.ap - 0.5) / C18;
    const zAt = (rad) => ROOF.curb + ((rOut - rad) / (rOut - 0.3 / C18)) * (ROOF.apex - ROOF.curb);
    return hull(
      [rOut - 0.1, 1.4].flatMap((rad) =>
        [-0.25, 0.25].flatMap((b) => [
          [r[0] * rad + t[0] * b, r[1] * rad + t[1] * b, zAt(rad) - 0.3],
          [r[0] * rad + t[0] * b, r[1] * rad + t[1] * b, zAt(rad) + 0.5],
        ]),
      ),
    );
  }),
]);

// ---------- bijgebouwen binnen het BAG-pand ----------
// BAG-contour 0809100000020767 in het lokale stelsel.
const BAG = [
  [18.23, 16.4], [21.28, 18.94], [22.33, 18.36], [22.78, 19.16], [21.68, 19.66], [22.08, 23.2], [23.26, 23.56], [23.01, 24.43],
  [21.86, 24.1], [19.52, 26.76], [20.08, 27.61], [19.32, 28.06], [18.71, 27.03], [15.21, 27.19], [14.92, 28.3], [14.04, 28.07],
  [14.38, 26.86], [13.1, 25.92], [9.91, 24.14], [9.57, 24.03], [10.44, 21.35], [15.57, 23.04], [17.67, 16.52], [17.45, 16.47],
  [17.59, 15.97], [9.73, 13.47], [5.54, 16.55], [-4.9, 16.57], [-10.57, 24.49], [-18.61, 18.73], [-13.04, 11.05], [-14.05, 10.34],
  [-16.7, 2.39], [-17.31, 0.55], [-18.19, 0.52], [-18.21, -0.47], [-17.31, -0.46], [-16.59, -2.8], [-15.31, -7.53], [-14.35, -9.77],
  [-15.02, -10.28], [-14.47, -11.1], [-13.75, -10.59], [-5.89, -16.33], [-6.11, -17.14], [-5.18, -17.45], [-4.91, -16.66],
  [4.89, -16.62], [5.18, -17.47], [6.11, -17.19], [5.82, -16.41], [13.76, -10.65], [14.13, -10.9], [14.68, -10.09], [14.36, -9.86],
  [15.85, -5.35], [24.34, -2.6],
];
// Wat buiten de tienhoek (0,25 m overlap in de muur) overblijft, per gebied:
// oost (plat dak, 8,6 m), noord (plat dak met installaties, 6 m), noordwest
// (twee niveaus: noordhelft 7 m, zuidhelft 5 m).
const rest = new CrossSection([ccw(BAG)]).subtract(new CrossSection([decagon(LOW.ap - 0.25)]));
const area = (pts) => rest.intersect(new CrossSection([ccw(pts)]));
const ANNEXES = [
  { name: "oost", pts: [[8, -6.5], [30, -6.5], [30, 16.45], [8, 16.45]], h: 8.6 },
  { name: "noord", pts: [[8, 16.45], [30, 16.45], [30, 32], [8, 32]], h: 6.0 },
  { name: "noordwest-hoog", pts: [[-30, 30], [-30, 18.95], [-18.61, 18.73], [-4.9, 16.57], [-4, 30]], h: 7.0 },
  { name: "noordwest-laag", pts: [[-30, 18.95], [-30, 8], [-4, 8], [-4.9, 16.57], [-18.61, 18.73]], h: 5.0 },
];
const annexes = union(ANNEXES.map(({ pts, h }) => Manifold.extrude(area(pts), h - BASE).translate([0, 0, BASE])));

// ---------- ruïnetoren ten noorden van de hal ----------
// Ronde toren (luchtfoto: Ø 5,4 m rond lokaal (6,7, 24,0)), muur 1,0 m, aan de
// noordoostkant open; de gebroken bovenrand loopt in stappen van 20 graden
// van 8 m op tot 12,5 m aan de westkant.
const RUIN = { c: [6.7, 24.0], r0: 1.7, r1: 2.7 };
const ruinParts = [];
const ruinTops = [8.0, 9.2, 10.6, 11.6, 12.3, 12.5, 12.1, 11.4, 10.6, 10.0, 9.4, 8.8];
ruinTops.forEach((top, i) => {
  const a0 = deg(90 + 20 * i - 0.5);
  const a1 = deg(90 + 20 * (i + 1) + 0.5);
  const pts = [];
  for (const a of [a0, a1]) {
    for (const r of [RUIN.r0, RUIN.r1]) {
      const xy = [RUIN.c[0] + r * Math.cos(a), RUIN.c[1] + r * Math.sin(a)];
      pts.push([...xy, BASE], [...xy, top]);
    }
  }
  ruinParts.push(hull(pts));
});
const ruin = union(ruinParts);

// ---------- samenvoegen en wegschrijven ----------
const abbey = union([lower, upper, roof, annexes]);
const nodes = [
  ["building:abdij", abbey],
  ["building:ruine", ruin],
];

await writeLandmark({
  slug: "efteling-danse-macabre",
  nodes,
  base: BASE,
  catalog: {
    name: "Danse Macabre (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: [
      [0, -20],
      [-10, -17.3],
      [10, -17.3],
      [-17.3, -10],
    ],
    replacesBuildings: ["NL.IMBAG.Pand.0809100000020767"],
    description:
      "Danse Macabre in de Efteling (2024, op de plek van het Spookslot): oorsprong in het hart van de tienhoekige showhal op RD (131558,20, 406711,50), op het maaiveld (circa NAP +9,2 m); +X 6,5 graden linksom van de RD-x-as, de voorzijde met de grote puntgevel en het maaswerkvenster kijkt naar -Y (zuid-zuidoost, Abdijplein). Tienhoekige onderbouw (33,3 m) met rondboogfries tot 10 m, terugliggende lichtbeuk (27,4 m) met spitsboognissen, steunberen en kroonlijst tot 15,6 m, laag piramidedak tot 18,3 m, pinakels tot 21,2 m; gevels van de oude Spookslot-entree aan de voet, platte bijgebouwen binnen het BAG-pand en een geruïneerde ronde toren ten noorden. Hoogtes geschat uit foto's (het AHN is van voor de bouw).",
    realWorld: {
      lowerAcrossFlatsMetres: 33.3,
      lowerSideMetres: 10.8,
      lowerHeightMetres: 10.0,
      clerestoryAcrossFlatsMetres: 27.4,
      clerestoryHeightMetres: 15.6,
      roofApexMetres: 18.3,
      cornerCapMetres: 17.8,
      pinnacleTopMetres: 21.2,
      frontGableMetres: [9.0, 8.2],
      annexHeightsMetres: { oost: 8.6, noord: 6.0, noordwest: [7.0, 5.0] },
      ruinTowerDiameterMetres: 5.4,
      ruinTowerHeightMetres: 12.5,
      turntableDiameterMetres: 18,
      groundNapMetres: 9.2,
      baseMetres: BASE,
    },
    sources: [
      "BAG-pand 0809100000020767 (contour, bouwjaar 2025, 1201 m²): tienhoekfit, hart RD (131558,20, 406711,50), apothema 16,67 m, restfout 7 cm",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR): lichtbeuk, dakring, naaf, bijgebouwen, ruïnetoren",
      "PDOK 3D-gebouwtegel: LoD1.1-blok van 16 m voor pand 0809100000020767",
      "AHN DTM 0,5 m (PDOK WCS, van voor de bouw): maaiveld NAP +9,1 tot +9,3 m aan de zuid- en westkant",
      "https://nl.wikipedia.org/wiki/Danse_Macabre_(Efteling)",
      "Wikimedia Commons, Category:Danse Macabre (Efteling): Danse Macabre (2024).jpg, Danse Macabre.jpg, Efteling Danse Macabre (5) en (7), bouwfoto's Danse Macabre (Efteling) (1)–(4)",
    ],
  },
});

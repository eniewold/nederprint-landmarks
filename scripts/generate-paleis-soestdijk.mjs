// Genereert een gesloten 3D-model van Paleis Soestdijk in Baarn (het corps de logis
// van Maurits Post, circa 1650, uitgebreid voor Willem III in 1674-1678; de
// halfronde vleugels met colonnades van Jan de Greef en Zeger Reyers, 1816-1822)
// uit dakvlakken en bouwdelen: het corps de logis met het afgeknotte schilddak
// (goot +14,4 m, plat bovenvlak +17,1 m), de belvedère tot +22,4 m, de achterbouw
// met een mansardedak tot +18,9 m, schoorstenen, pilasters, een plint,
// vensternissen in vier rijen, het portiek met balkon en het bordes met treden;
// de twee tussenvleugels (aan de Soester kant een dubbel zadeldak, aan de Baarnse
// kant een mansardedak met drie dakkapellen en een portaal); de twee
// hoekpaviljoens met een laag zadeldak en frontons aan voor- en achterzijde (aan de
// Baarnse kant met een dwarsvleugel); de twee halfronde vleugels (kwartcirkels van
// 96 graden) met een afgeknot dak tot +10,8 m, de colonnade aan het voorplein als
// zuilen voor een terugliggende gevel, kleine vensters erboven, vensters aan de
// tuinzijde, kroonlijsten en schoorstenen; de twee eindpaviljoens met een laag
// zadeldak en frontons; en de lage aanbouwen aan de tuinzijde (het terras achter
// het corps de logis en de aanbouw achter de Baarnse vleugel). Alle maten in het
// script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-paleis-soestdijk.mjs              # 1:1000 (standaard)
//   node scripts/generate-paleis-soestdijk.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (147658,09, 467275,25), op de symmetrieas midden op
// het voorplein, halverwege de middelpunten van de twee halfronde vleugels, op NAP
// +3,3 m (het voorplein ligt op NAP +3,1 tot +3,5 m), Z omhoog. +X loopt langs de
// voorgevel naar het noordnoordwesten, naar de Baarnse vleugel (116,16 graden
// linksom vanaf de RD-X-as: de lijn door de middelpunten van de twee kwartcirkels
// uit de BAG-gevels, gelijk met de symmetrieas van het AHN) en +Y loodrecht daarop
// naar de tuin; de voorgevel van het corps de logis staat op y 34,6 m. Het corps de
// logis, de tussenvleugels en de hoekpaviljoens zijn symmetrisch in x = 0; de
// halfronde vleugels hebben elk een eigen middelpunt en straal (gemeten).
//
// Bronnen: PDOK BAG-pand 0308100000022041 (het hele paleis); AHN DSM/DTM 0,5 m
// (PDOK WCS) voor goten, nokken, platte daken, de belvedère, schoorstenen, de
// dakkapellen, het portiek, het bordes en het maaiveld; de cirkels van de
// halfronde vleugels uit de BAG-gevels en de randen van het platte dak in het AHN;
// PDOK luchtfoto; Wikipedia; foto's op Wikimedia Commons van het voorplein (recht
// van voren, schuin van beide kanten), de colonnade, het portiek en de tuinzijde
// vanaf de vijver. Het Mapbox-model is niet gebruikt. Geschat zijn de
// kroonlijsten, de pilasters, de vensternissen (ritme van de foto's), het aantal
// zuilen van de colonnades (om de circa 3 m), de diepte van de colonnade (als
// nis van 0,6 m), de frontons van de paviljoens, de dakkapellen (breedte) en de
// treden van het bordes.
// Weggelaten: de vlaggenmast op de belvedère, de vazen, lantaarns en balusters (als
// dichte borstwering), de luiken, de hagen en struiken langs de colonnades, het
// zonnescherm aan de tuinzijde, het terras achter de Soester vleugel (geen deel van
// het BAG-pand) en de bijgebouwen op het landgoed (eigen panden, blijven PDOK). Het
// paleis wordt sinds 2017 door MeyerBergman Erfgoed Groep gerestaureerd; de
// nieuwbouwplannen zijn in 2024 vervallen, dus het model is het bestaande gebouw.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "paleis-soestdijk");
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
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const box = (u0, u1, v0, v1, z0, z1) => prism(rect(u0, u1, v0, v1), z0, z1);
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
// Schilddak met helling t vanaf de goot langs elke gevel, afgevlakt op 'top'.
const hip = ({ u0, u1, v0, v1, eave, t }, top = 100) =>
  roofed(rect(u0, u1, v0, v1), [[0, t, eave - t * v0], [0, -t, eave + t * v1], [t, 0, eave - t * u0], [-t, 0, eave + t * u1], [0, 0, top]]);
// Kroonlijst: een plaat die 'out' voor de gevel uitsteekt met een schuine onderkant van 51 graden.
const cornice = ({ u0, u1, v0, v1 }, z, out = 0.4) =>
  Manifold.hull([
    ...rect(u0 + 0.05, u1 - 0.05, v0 + 0.05, v1 - 0.05).map(([x, y]) => [x, y, z - 0.25 - (out + 0.05) * 1.25]),
    ...rect(u0 - out, u1 + out, v0 - out, v1 + out).map(([x, y]) => [x, y, z - 0.25]),
    ...rect(u0 - out, u1 + out, v0 - out, v1 + out).map(([x, y]) => [x, y, z]),
  ]);
const chimney = (u, v, hu, hv, z0, z1) => box(u - hu, u + hu, v - hv, v + hv, z0, z1);
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 58 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +u) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.35) =>
  profileX([[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]], a - d, a + 0.4)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Vensternissen langs een rechte gevel. side: "E" (gevel u = c, naar +u), "W" (u = c, naar -u),
// "N" (v = c, naar +v), "S" (v = c, naar -v).
const windows = (side, c, positions, rows, w = 1.3) => {
  const out = [];
  const ang = { E: 0, N: 90, W: 180, S: 270 }[side];
  const a = side === "E" || side === "N" ? c : -c;
  for (const p of positions) {
    const centre = side === "E" || side === "W" ? [0, p] : [p, 0];
    for (const [z0, z1] of rows) out.push(niche(centre, ang, a, 0, w, z0, z1));
  }
  return out;
};
// Pilaster (lisene) van breedte w, 'proud' voor een rechte gevel, van de onderkant tot z1.
const pilaster = (side, c, p, w, proud, z1) => {
  if (side === "S") return box(p - w / 2, p + w / 2, c - proud, c + 0.1, BASE, z1);
  if (side === "N") return box(p - w / 2, p + w / 2, c - 0.1, c + proud, BASE, z1);
  if (side === "W") return box(c - proud, c + 0.1, p - w / 2, p + w / 2, BASE, z1);
  return box(c - 0.1, c + proud, p - w / 2, p + w / 2, BASE, z1);
};
// Fronton op een topgevel: driehoek (basis s0-s1 op de goot zb, top op 'peak') met een lijst van 0,3 m
// boven het dak, 0,3 m voor de gevel en een schuine onderkant van 51 graden. axis "v": gevel v = wall
// (out -1 = naar -v, +1 = naar +v), s langs u; axis "u": gevel u = wall, s langs v.
const pedimentFrame = (axis, wall, out, s0, s1, zb, peak) => {
  const sc = (s0 + s1) / 2;
  const outline = (z0) => [[s0, z0], [s1, z0], [s1, zb + 0.3], [sc, peak + 0.3], [s0, zb + 0.3]];
  const pts = [];
  for (const [s, z] of outline(zb - 0.55)) pts.push([s, wall - out * 0.15, z]);
  for (const [s, z] of outline(zb)) pts.push([s, wall + out * 0.3, z]);
  return Manifold.hull(pts.map(([s, w, z]) => (axis === "v" ? [s, w, z] : [w, s, z])));
};
// Regelmatige achthoek met 'across' tussen de vlakken rond [cx, cy].
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => [cx + r * Math.cos(Math.PI / 8 + (k * Math.PI) / 4), cy + r * Math.sin(Math.PI / 8 + (k * Math.PI) / 4)]);
};
const range = (a, b, n) => Array.from({ length: n }, (_, k) => (n === 1 ? (a + b) / 2 : a + ((b - a) * k) / (n - 1)));
const deg = (r) => (r * 180) / Math.PI;
const rad = (d) => (d * Math.PI) / 180;

const SLUG = "paleis-soestdijk";

// ---------- maten (lokaal stelsel, z = hoogte boven NAP +3,3 m) ----------
const ORIGIN = [147658.087, 467275.253];
const X_AXIS = [-0.440879, 0.897566]; // RD-richting 116,16 graden: middelpunt Soester naar Baarnse kwartcirkel
// Onderkant 1 m onder het nulpunt; het maaiveld ligt rond het paleis op -0,6 tot +0,4 m.
const BASE = -1.0;

// Corps de logis: voorgevel v 34,6 m, x -21,65 tot 21,65 m; goot +14,4 m (attiek met een plat dak tot 2,4 m
// achter de gevel), afgeknot schilddak van 53 graden tot het platte bovenvlak op +17,1 m.
const CORPS = { u: 21.65, v0: 34.6, v1: 46.0, eave: 14.4 };
const CORPS_ROOF = { u0: -19.5, u1: 19.5, v0: 37.0, v1: 45.4, eave: 14.4, t: 1.35, top: 17.1 };
// Achterhoeken (+14,4 m) en lage binnenplaatsdaken: Soester kant +10,8 m, Baarnse kant +7,0 m.
const CORPS_BACK = { u0: 15.3, v1: 49.6 };
const COURT_S = { u0: -15.7, u1: -9.2, v0: 45.5, v1: 52.6, top: 10.8 };
const COURT_B = { u0: 7.4, u1: 21.65, v0: 45.5, v1: 52.6, top: 7.0 };
// Achterbouw (middenrisaliet aan de tuin): mansardedak van 61 graden van de goot +14,4 m tot +18,9 m.
const REAR = { u: 7.4, v0: 43.0, v1: 55.4, eave: 14.4, kneeU: 6.6, kneeV: 54.6, t: 1.8, top: 18.9 };
// Belvedère op het platte dak: 13 bij 4,5 m, tot +22,4 m, schoorstenen op de hoeken tot +23,4 m.
const BELV = { u: 6.5, v0: 38.5, v1: 43.0, top: 22.4 };
// Portiek met balkon (bovenkant borstwering +7,6 m) en het bordes (+2,2 m) met vijf treden.
const PORTICO = { u: 3.6, v0: 32.9, top: 7.6, deck: 6.8 };
const PERRON = { top: 2.2, v1: 33.0, steps: 5 };
// Vensterritme van de voorgevel: dertien assen van 3,2 m; rijen souterrain, bel-etage, verdieping, attiek.
const CORPS_BAYS = range(-19.2, 19.2, 13);
const CORPS_ROWS = [[0.3, 1.2, 1.0], [2.6, 5.3, 1.3], [6.6, 9.5, 1.3], [11.0, 12.3, 1.1]];
// Schoorstenen [u, v, halve breedte u, halve breedte v, top].
const CORPS_CHIMNEYS = [
  [-18.2, 40.3, 1.0, 1.5, 19.7], [18.2, 40.3, 1.0, 1.5, 19.7],
  [-18.3, 43.6, 0.7, 0.6, 17.0], [18.3, 43.6, 0.7, 0.6, 17.0],
  [-18.8, 46.2, 0.6, 0.6, 15.9], [18.0, 46.6, 0.7, 0.6, 16.6], [15.2, 49.4, 0.6, 0.6, 16.0],
  [-7.9, 50.6, 0.6, 1.3, 16.7], [8.0, 51.8, 0.6, 1.0, 15.1],
];

// Tussenvleugels (twee bouwlagen). Soester kant (x < 0): voorgevel v 38,6 m, borstwering +8,1 m, goot +7,3 m,
// voorste dakvlak van 38 graden tot de nok +10,6 m (v 44,7 m), daarachter een tweede zadeldak (nok +10,6 m
// op v 46,75 m) tot de achtergevel v 49,1 m.
const TUSSEN_S = { u0: -38.15, u1: -21.65, v0: 38.6, v1: 49.1, parapet: 8.1, gutter: 7.3, t: 0.78, ridge1: 10.6, valley: 45.5, ridge2: 46.75, t2: 0.8 };
// Baarnse kant (x > 0): voorgevel v 39,2 m, borstwering +8,0 m, mansarde van 52 graden tot het platte dak
// +11,5 m, drie dakkapellen met fronton (top +9,9 m) en een portaal van +4,9 m.
const TUSSEN_B = { u0: 21.65, u1: 38.15, v0: 39.2, v1: 49.8, parapet: 8.0, t: 1.3, top: 11.5 };
const TUSSEN_B_DORMERS = [24.9, 29.6, 34.7];
const PORCH_B = { u0: 28.5, u1: 31.5, v0: 36.8, top: 4.9 };

// Hoekpaviljoens (drie bouwlagen) tussen tussenvleugel en halfronde vleugel: zadeldak langs v, goot +12,7 m,
// nok +14,1 m (23 graden), frontons aan voor- en achterzijde.
const PAV = { u0: 38.15, u1: 44.9, v0: 30.0, v1: 49.7, eave: 12.7, ridge: 14.1 };
// Dwarsvleugel aan het Baarnse paviljoen: nok langs x op v 40,6 m, goot +12,8 m, nok +14,1 m.
const PAV_B_WING = { u0: 44.9, u1: 52.2, v0: 37.6, v1: 43.6, eave: 12.8, ridge: 14.1 };
const PAV_CHIMNEYS = [[-41.7, 35.0, 15.5], [-41.8, 45.3, 15.5], [41.5, 43.9, 15.2]];

// Halfronde vleugels: kwartcirkels rond een eigen middelpunt (uit de BAG-gevels en het AHN), van het
// eindpaviljoen (hoek -3 graden) tot in het hoekpaviljoen (93 graden). Goot +8 m aan beide gevels, dakvlakken
// van 45 graden tot het platte dak op +10,8 m. Aan het voorplein een colonnade (zuilen 1 m breed om de
// circa 3 m, achtkantig, voor een 0,6 m terugliggende gevel, van +1 m tot +4,6 m), daarboven kleine vensters.
const WINGS = [
  { side: -1, c: [-45.4, 0.1], rin: 30.1, rout: 39.8, chimneys: [[-81.0, 8.6, 13.0], [-76.6, 19.0, 12.7], [-64.4, 28.5, 12.4], [-54.1, 35.8, 12.1]] },
  { side: 1, c: [45.5, 0.1], rin: 30.9, rout: 40.6, chimneys: [[79.4, 5.3, 13.0], [69.6, 27.0, 11.9]] },
];
const WING_ROOF = { eave: 8.0, top: 10.8, t: 1.0, phi0: -3, phi1: 93 };
const COLONNADE = { z0: 1.0, z1: 4.6, depth: 0.6, col: 1.0, spacing: 3.0 };
// Eindpaviljoens: zadeldak langs x, goot +12,75 m, nok +14,1 m, frontons aan beide kopse kanten.
const END_PAV = [
  { u0: -85.2, u1: -75.3, v0: -7.8, v1: -0.8, chimney: [-80.0, -4.0, 15.5] },
  { u0: 76.4, u1: 86.1, v0: -7.8, v1: -0.8, chimney: [81.5, -1.6, 14.9] },
];
const END_ROOF = { eave: 12.75, ridge: 14.1 };

// Lage aanbouwen aan de tuinzijde: het terras achter het corps de logis (+2,2 m) en achter de Baarnse vleugel
// een terras met afgeronde kop (+2,2 m) en een blok van +7 m tegen de gevel.
const TERRACE = [[6.8, 49.6], [31.3, 49.6], [31.3, 52.5], [27.7, 52.5], [27.7, 55.5], [6.8, 55.5]];
const ANNEX_B = { terrace: [[60.0, 37.0], [67.5, 34.0], [68.7, 37.05], [74.7, 37.2], [77.9, 44.9], [72.5, 51.5], [68.7, 54.9], [63.1, 54.7], [60.3, 48.3]], block: { u0: 59.5, u1: 66.0, v0: 35.0, v1: 43.6, top: 7.0 } };

// Maaiveld: voor het corps de logis, voor beide colonnades, achter de tussenvleugels en voor de eindpaviljoens.
const GROUND_SAMPLES = [[0, 22], [-60, 8], [60, 8], [-30, 57], [50, 58], [-80, -16], [81, -16]];
// Terugval als geen van die punten in de uitsnede valt: de laagste ellipsoidische PDOK-terreinhoogte op die punten.
const GROUND_HEIGHT = 46.35;

// ---------- corps de logis ----------
const corps = [];
const corpsCuts = [];
{
  const C = CORPS;
  corps.push(box(-C.u, C.u, C.v0, C.v1, BASE, C.eave), cornice({ u0: -C.u, u1: C.u, v0: C.v0, v1: C.v1 }, C.eave, 0.45));
  corps.push(hip(CORPS_ROOF, CORPS_ROOF.top));
  // Plint (souterrain) 0,2 m voor de gevel.
  corps.push(box(-C.u - 0.2, C.u + 0.2, C.v0 - 0.2, C.v1, BASE, 1.9));
  // Achterhoeken tot +14,4 m en de lage binnenplaatsdaken.
  const B = CORPS_BACK;
  for (const s of [-1, 1]) corps.push(box(Math.min(s * B.u0, s * C.u), Math.max(s * B.u0, s * C.u), C.v1 - 0.5, B.v1, BASE, C.eave));
  corps.push(box(COURT_S.u0, COURT_S.u1, COURT_S.v0, COURT_S.v1, BASE, COURT_S.top));
  corps.push(box(COURT_B.u0, COURT_B.u1, COURT_B.v0, COURT_B.v1, BASE, COURT_B.top));
  // Achterbouw met mansardedak.
  const R = REAR;
  corps.push(box(-R.u, R.u, R.v0, R.v1, BASE, R.eave));
  corps.push(roofed(rect(-R.u, R.u, R.v0, R.v1), [[R.t, 0, R.eave + R.t * R.kneeU], [-R.t, 0, R.eave + R.t * R.kneeU], [0, -R.t, R.eave + R.t * R.kneeV], [0, 0, R.top]]));
  corps.push(cornice({ u0: -R.u, u1: R.u, v0: C.v1, v1: R.v1 }, R.eave, 0.35));
  // Belvedère met kroonlijst en schoorstenen op de hoeken.
  const V = BELV;
  corps.push(box(-V.u, V.u, V.v0, V.v1, 16.0, V.top), cornice({ u0: -V.u, u1: V.u, v0: V.v0, v1: V.v1 }, V.top, 0.25));
  for (const s of [-1, 1]) corps.push(chimney(s * 5.8, 40.6, 0.5, 1.0, 21.0, 23.4));
  corpsCuts.push(...windows("S", V.v0, [-3.9, 0, 3.9], [[18.2, 20.0]], 2.0));
  corpsCuts.push(...windows("E", V.u, [40.75], [[18.2, 20.0]], 1.8), ...windows("W", -V.u, [40.75], [[18.2, 20.0]], 1.8));
  // Schoorstenen.
  for (const [u, v, hu, hv, top] of CORPS_CHIMNEYS) corps.push(chimney(u, v, hu, hv, BASE, top));
  // Pilasters op de hoeken en naast de middelste drie assen.
  for (const u of [-21.15, -4.8, 4.8, 21.15]) corps.push(pilaster("S", C.v0, u, 1.0, 0.3, C.eave - 0.9));
  // Portiek met balkon: dicht blok met vier zuilen (blinde nissen ertussen) en een borstwering.
  const P = PORTICO;
  corps.push(box(-P.u, P.u, P.v0, C.v0 + 0.1, BASE, P.top));
  for (const [u0, u1] of [[-2.7, -2.05], [-1.15, 1.15], [2.05, 2.7]]) {
    corpsCuts.push(profileY([[u0, PERRON.top], [u1, PERRON.top], [u1, P.deck - 1.0], [(u0 + u1) / 2, P.deck - 1.0 + 0.8 * (u1 - u0)], [u0, P.deck - 1.0]], P.v0 - 0.4, P.v0 + 0.4));
  }
  // Bordes: vijf treden rond het platform, aan voor- en zijkanten.
  const S = PERRON;
  for (let i = 0; i < S.steps; i++) {
    const z = (S.top * (i + 1)) / S.steps;
    corps.push(box(-(7.4 - 1.0 * i), 7.4 - 1.0 * i, 26.2 + 0.9 * i, S.v1, BASE, z));
  }
  // Vensters: voorgevel (dertien assen, deur achter het portiek), zijgevels voor de tussenvleugels en achter.
  for (const u of CORPS_BAYS) {
    for (const [z0, z1, w] of CORPS_ROWS) {
      // Achter het portiek: geen vensters beneden, op de verdieping deuren naar het balkon vanaf +7,7 m.
      if (Math.abs(u) < 4 && z0 < 6.0) continue;
      corpsCuts.push(niche([u, 0], 270, -C.v0, 0, w, Math.abs(u) < 4 && z0 < P.top ? P.top + 0.1 : z0, z1));
    }
  }
  for (const side of ["E", "W"]) {
    const c = side === "E" ? C.u : -C.u;
    for (const [z0, z1, w] of CORPS_ROWS) corpsCuts.push(...windows(side, c, [36.6], [[z0, z1]], w));
  }
  const rearRows = CORPS_ROWS.slice(0, 4).filter(([z0]) => z0 > 0.5);
  corpsCuts.push(...windows("N", R.v1, [-4.0, 0, 4.0], rearRows.map(([a, b]) => [a, b])));
  corpsCuts.push(...windows("N", CORPS_BACK.v1, [-18.5], rearRows.map(([a, b]) => [a, b])), ...windows("N", CORPS_BACK.v1, [18.5], [[11.0, 12.3]], 1.1));
  corpsCuts.push(...windows("N", COURT_S.v1, [-13.9, -11.0], [[2.6, 5.3], [6.6, 8.6]]));
  corpsCuts.push(...windows("N", COURT_B.v1, [10.2, 13.6, 17.0, 20.2], [[2.6, 5.0]]));
}
const corpsBlock = Manifold.union(corps).subtract(Manifold.union(corpsCuts));

// ---------- tussenvleugels ----------
const tussen = [];
const tussenCuts = [];
{
  const S = TUSSEN_S;
  // Voorste zadeldak: goot +7,3 m achter de borstwering, dakvlak van 38 graden tot de nok, achterkant tot het dal.
  tussen.push(box(S.u0, S.u1, S.v0, S.v1, BASE, S.gutter));
  tussen.push(roofed(rect(S.u0, S.u1, S.v0 + 0.7, S.valley), [[0, S.t, S.gutter - S.t * 40.5], [0, -S.t2, S.ridge1 + S.t2 * 44.73]]));
  tussen.push(roofed(rect(S.u0, S.u1, S.valley - 0.1, S.v1), ridgeV(S.ridge2, S.ridge1, S.t2)));
  tussen.push(box(S.u0, S.u1, S.v0, S.v0 + 0.7, BASE, S.parapet), cornice({ u0: S.u0, u1: S.u1, v0: S.v0, v1: S.v0 + 0.7 }, S.parapet - 0.5, 0.3));
  const B = TUSSEN_B;
  tussen.push(box(B.u0, B.u1, B.v0, B.v1, BASE, B.parapet), cornice({ u0: B.u0, u1: B.u1, v0: B.v0, v1: B.v0 + 0.7 }, B.parapet - 0.4, 0.3));
  tussen.push(roofed(rect(B.u0, B.u1, B.v0, B.v1), [[0, B.t, B.parapet - B.t * (B.v0 + 0.3)], [0, 0, B.top]]));
  // Drie dakkapellen met een fronton (top +9,9 m) op het mansardevlak.
  for (const u of TUSSEN_B_DORMERS) tussen.push(roofed(rect(u - 0.75, u + 0.75, B.v0 + 0.4, B.v0 + 2.9), ridgeU(u, 9.9, 1.0)));
  // Portaal met balkon voor de ingang aan de Baarnse kant.
  const P = PORCH_B;
  tussen.push(box(P.u0, P.u1, P.v0, B.v0 + 0.1, BASE, P.top));
  tussenCuts.push(niche([(P.u0 + P.u1) / 2, 0], 270, -P.v0, 0, 1.6, 0.3, 2.9, 0.4));
  // Vensters: twee rijen aan het voorplein en aan de tuin.
  const rows = [[1.0, 3.4], [4.2, 5.8]];
  tussenCuts.push(...windows("S", S.v0, range(-35.6, -24.2, 5), rows), ...windows("N", S.v1, range(-35.6, -24.2, 5), rows));
  tussenCuts.push(...windows("S", B.v0, [24.2, 26.9, 33.0, 35.6], rows), ...windows("N", B.v1, range(24.2, 35.6, 5), rows));
}
const tussenBlock = Manifold.union(tussen).subtract(Manifold.union(tussenCuts));

// ---------- hoekpaviljoens ----------
const pav = [];
const pavCuts = [];
{
  const P = PAV;
  for (const s of [-1, 1]) {
    const u0 = s > 0 ? P.u0 : -P.u1;
    const u1 = s > 0 ? P.u1 : -P.u0;
    const uc = (u0 + u1) / 2;
    const t = (P.ridge - P.eave) / ((u1 - u0) / 2);
    pav.push(roofed(rect(u0, u1, P.v0, P.v1), ridgeU(uc, P.ridge, t)));
    pav.push(cornice({ u0, u1, v0: P.v0, v1: P.v1 }, P.eave, 0.4));
    pav.push(box(u0 - 0.2, u1 + 0.2, P.v0 - 0.2, P.v1 + 0.2, BASE, 1.9));
    pav.push(pedimentFrame("v", P.v0, -1, u0 - 0.4, u1 + 0.4, P.eave, P.ridge), pedimentFrame("v", P.v1, 1, u0 - 0.4, u1 + 0.4, P.eave, P.ridge));
    // Hoeklisenen aan het voorplein.
    for (const u of [u0 + 0.4, u1 - 0.4]) pav.push(pilaster("S", P.v0, u, 0.8, 0.25, P.eave - 0.8));
    const rows = [[2.0, 4.6], [5.6, 8.2], [9.2, 11.0]];
    pavCuts.push(...windows("S", P.v0, [uc - 1.9, uc, uc + 1.9], rows), ...windows("N", P.v1, [uc - 1.9, uc, uc + 1.9], rows));
    pavCuts.push(...windows(s > 0 ? "W" : "E", s > 0 ? u0 : u1, [32.3, 36.0], rows));
    pavCuts.push(...windows(s > 0 ? "E" : "W", s > 0 ? u1 : u0, [46.0], rows));
  }
  // Dwarsvleugel aan het Baarnse paviljoen.
  const W = PAV_B_WING;
  const wc = (W.v0 + W.v1) / 2;
  pav.push(roofed(rect(W.u0 - 0.5, W.u1, W.v0, W.v1), ridgeV(wc, W.ridge, (W.ridge - W.eave) / ((W.v1 - W.v0) / 2))));
  pav.push(cornice({ u0: W.u0, u1: W.u1, v0: W.v0, v1: W.v1 }, W.eave, 0.35));
  pav.push(pedimentFrame("u", W.u1, 1, W.v0 - 0.35, W.v1 + 0.35, W.eave, W.ridge));
  pavCuts.push(...windows("E", W.u1, [wc - 1.6, wc + 1.6], [[5.6, 8.2], [9.2, 11.0]]), ...windows("N", W.v1, [48.6], [[2.0, 4.6], [5.6, 8.2], [9.2, 11.0]]));
  for (const [u, v, top] of PAV_CHIMNEYS) pav.push(chimney(u, v, 0.6, 0.9, 12.5, top));
}
const pavBlock = Manifold.union(pav).subtract(Manifold.union(pavCuts));

// ---------- halfronde vleugels en eindpaviljoens ----------
const SEG = 160;
// Ringsector rond c van de hoek a0 over 'sweep' graden (gewone hoek vanaf +u, linksom) met profiel [r, z].
const ring = (c, profile, a0, sweep) =>
  Manifold.revolve(new CrossSection([ccw(profile)]), SEG, sweep).rotate([0, 0, a0]).translate([c[0], c[1], 0]);
const wings = [];
const wingCuts = [];
const columns = [];
for (const W of WINGS) {
  const R = WING_ROOF;
  const { c, rin, rout, side } = W;
  // Gewone hoek a voor de vleugelhoek phi (0 = naar buiten langs u, 90 = naar de tuin).
  const ang = (phi) => (side > 0 ? phi : 180 - phi);
  const a0 = side > 0 ? R.phi0 : 180 - R.phi1;
  const sweep = R.phi1 - R.phi0;
  const kIn = (R.top - R.eave) / R.t;
  wings.push(ring(c, [[rin, BASE], [rout, BASE], [rout, R.eave + 0.2], [rout - kIn, R.top], [rin + kIn, R.top], [rin, R.eave]], a0, sweep));
  // Kroonlijsten aan beide gevels (0,35 m uit, schuine onderkant van 51 graden) en een plint aan de tuinzijde.
  wings.push(ring(c, [[rin + 0.1, R.eave - 0.25 - 0.45 * 1.25], [rin + 0.1, R.eave], [rin - 0.35, R.eave], [rin - 0.35, R.eave - 0.25]], a0, sweep));
  wings.push(ring(c, [[rout - 0.1, R.eave - 0.05 - 0.45 * 1.25], [rout - 0.1, R.eave + 0.2], [rout + 0.35, R.eave + 0.2], [rout + 0.35, R.eave - 0.05]], a0, sweep));
  wings.push(ring(c, [[rout - 0.5, BASE], [rout + 0.2, BASE], [rout + 0.2, 1.2], [rout - 0.5, 1.2]], a0, sweep));
  // Colonnade: de gevel 0,6 m terug tussen +1 m en +4,6 m (bovenkant schuin onder 51 graden), met zuilen.
  const C = COLONNADE;
  const p0 = 1.5;
  const p1 = 89.0;
  const colA0 = side > 0 ? p0 : 180 - p1;
  wingCuts.push(ring(c, [[rin - 1.0, C.z0], [rin + C.depth, C.z0], [rin + C.depth, C.z1], [rin - 1.0, C.z1 + (1.0 + C.depth) * 1.25]], colA0, p1 - p0));
  const arc = rad(p1 - p0) * rin;
  const n = Math.round(arc / C.spacing);
  const cols = range(p0 + deg(0.6 / rin), p1 - deg(0.6 / rin), n + 1);
  for (const phi of cols) columns.push(prism(oct([rin + C.col / 2 + 0.01, 0], C.col), C.z0 - 0.1, C.z1 + 1.0).rotate([0, 0, ang(phi)]).translate([c[0], c[1], 0]));
  // Kleine vensters boven de colonnade, tussen de zuilen.
  for (let k = 0; k + 1 < cols.length; k++) {
    const phi = (cols[k] + cols[k + 1]) / 2;
    wingCuts.push(niche(c, ang(phi) + 180, -rin, 0, 0.9, 5.5, 6.3));
  }
  // Vensters aan de tuinzijde: twee rijen om de circa 3,4 m.
  const nOut = Math.round((rad(p1 - p0) * rout) / 3.4);
  for (const phi of range(p0 + 2, p1 - 3, nOut)) {
    wingCuts.push(niche(c, ang(phi), rout, 0, 1.3, 1.6, 3.8), niche(c, ang(phi), rout, 0, 1.2, 4.7, 6.3));
  }
  for (const [u, v, top] of W.chimneys) {
    const a = deg(Math.atan2(v - c[1], u - c[0]));
    wings.push(box(-0.9, 0.9, -0.7, 0.7, 9.5, top).rotate([0, 0, a]).translate([u, v, 0]));
  }
}
for (const E of END_PAV) {
  const R = END_ROOF;
  const vc = (E.v0 + E.v1) / 2;
  const t = (R.ridge - R.eave) / ((E.v1 - E.v0) / 2);
  wings.push(roofed(rect(E.u0, E.u1, E.v0, E.v1), ridgeV(vc, R.ridge, t)));
  wings.push(cornice(E, R.eave, 0.4), box(E.u0 - 0.2, E.u1 + 0.2, E.v0 - 0.2, E.v1, BASE, 1.9));
  wings.push(pedimentFrame("u", E.u0, -1, E.v0 - 0.4, E.v1 + 0.4, R.eave, R.ridge), pedimentFrame("u", E.u1, 1, E.v0 - 0.4, E.v1 + 0.4, R.eave, R.ridge));
  const uc = (E.u0 + E.u1) / 2;
  for (const u of [E.u0 + 0.4, E.u1 - 0.4]) wings.push(pilaster("S", E.v0, u, 0.8, 0.25, R.eave - 0.8));
  const [cu, cv, ct] = E.chimney;
  wings.push(chimney(cu, cv, 0.8, 0.6, 12.5, ct));
  const rows = [[2.0, 4.6], [5.6, 8.2], [9.2, 11.0]];
  wingCuts.push(...windows("S", E.v0, [uc - 3.0, uc, uc + 3.0], rows));
  wingCuts.push(...windows("W", E.u0, [vc - 1.6, vc + 1.6], rows), ...windows("E", E.u1, [vc - 1.6, vc + 1.6], rows));
}
// De zuilen pas na het uitsparen van de colonnade toevoegen.
const wingBlock = Manifold.union([Manifold.union(wings).subtract(Manifold.union(wingCuts)), ...columns]);

// ---------- lage aanbouwen aan de tuinzijde ----------
const annex = [prism(TERRACE, BASE, 2.2), prism(ANNEX_B.terrace, BASE, 2.2)];
{
  const K = ANNEX_B.block;
  annex.push(box(K.u0, K.u1, K.v0, K.v1, BASE, K.top));
}
const annexBlock = Manifold.union(annex);

if (argv.includes("--genus")) for (const [k, m] of Object.entries({ corpsBlock, tussenBlock, pavBlock, wingBlock, annexBlock })) console.log(k, m.genus(), m.decompose().length);
if (argv.includes("--genus")) { let acc = corpsBlock; for (const [k, m] of Object.entries({ tussenBlock, pavBlock, wingBlock, annexBlock })) { acc = Manifold.union(acc, m); console.log("+", k, acc.genus()); } for (const piece of annexBlock.decompose()) { console.log("annex piece", piece.boundingBox().min, Manifold.union(Manifold.union([corpsBlock, tussenBlock, pavBlock, wingBlock]), piece).genus()); } }
const palace = Manifold.union([corpsBlock, tussenBlock, pavBlock, wingBlock, annexBlock]);
const nodes = [["building:paleis", palace]];
const all = palace;

const META = {
  name: "Paleis Soestdijk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_HEIGHT,
  replacesBuildings: ["0308100000022041"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (147658,09, 467275,25), op de symmetrieas midden op het voorplein tussen de middelpunten van de halfronde vleugels, op NAP +3,3 m, +X langs de voorgevel naar de Baarnse vleugel (116,16 graden vanaf de RD-X-as) en +Y naar de tuin. Een node building:paleis uit dakvlakken en bouwdelen: het corps de logis (voorgevel op y 34,6 m, goot +14,4 m, afgeknot schilddak tot +17,1 m, belvedère tot +22,4 m, achterbouw met mansardedak tot +18,9 m, schoorstenen tot +19,7 m, pilasters, portiek met balkon en bordes), de tussenvleugels (Soester kant dubbel zadeldak tot +10,6 m, Baarnse kant mansarde tot +11,5 m met drie dakkapellen en een portaal), de hoekpaviljoens (zadeldak tot +14,1 m met frontons), de halfronde vleugels (goot +8 m, plat dak +10,8 m, colonnade als zuilen voor een terugliggende gevel) en de eindpaviljoens (zadeldak tot +14,1 m met frontons); kroonlijsten en vensternissen in de gevels, lage terrassen aan de tuinzijde. Onderkant 1 m onder het nulpunt; alle vlakken wijzen omhoog, staan verticaal of hangen niet vlakker dan 51 graden. Vervangt de PDOK-reconstructie van het paleis. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    corpsEaveM: CORPS.eave,
    corpsFlatRoofM: CORPS_ROOF.top,
    belvedereTopM: BELV.top,
    rearRoofTopM: REAR.top,
    wingEaveM: WING_ROOF.eave,
    wingFlatRoofM: WING_ROOF.top,
    pavilionRidgeM: PAV.ridge,
    zeroNapM: 3.3,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Paleis_Soestdijk",
    "PDOK BAG pand 0308100000022041 (het hele paleis: corps de logis, tussenvleugels, paviljoens, halfronde vleugels en de aanbouwen aan de tuinzijde), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: goten, nokken, platte daken, belvedère, schoorstenen, dakkapellen, portiek, bordes en het maaiveld; de cirkels van de halfronde vleugels uit de BAG-gevels en de randen van het platte dak",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's van het voorplein, de colonnade, het portiek en de tuinzijde vanaf de vijver",
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
      if (!steep || argv.includes("--list-overhang")) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
    meshes.push({ name, primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }] });
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
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
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
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

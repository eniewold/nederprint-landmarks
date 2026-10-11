// Montevideo (Otto Reuchlinweg / Landverhuizersplein, Wilhelminapier,
// Rotterdam; Mecanoo, Francine Houben, 2005): woontoren van 139,5 m, met de
// letter M op het dak 152,32 m. De toren is een stapeling van volumes in
// verschillende gevelmaterialen: een rode bakstenen kolom aan de Rijnhaven, een
// witte toren met loggia's en patrijspoorten aan de noordzijde, een donker
// bakstenen en een glazen volume met donker kader (tot +92), een lager rood
// bakstenen volume aan de noordgevel (tot +75), en bovenop de rode kubus met een
// glazen gevel in een rood kader die naar het westen (de kop van de pier en de
// Maas) uitkraagt. Op het dak staat de M als windvaan op een arm en een voet.
// Aan de toren hangt in hetzelfde BAG-pand een lagere strook langs de Rijnhaven
// (rood baksteen tot +18, donker baksteen tot +32) en het oostblok tot +40,8
// dat 16 m over de kade uitkraagt op schuine stempels, met een terugliggende
// dakopbouw, schoorstenen en een watertoren. Vlakken en benoemde bouwdelen in
// een eigen gebouwstelsel, geen gestapelde DSM-lagen. Voorbeeld per rij:
// generate-evoluon.mjs (aanpak primitieven), generate-haagse-toren.mjs,
// generate-hoftoren.mjs en generate-maastoren.mjs (skylinetorens op
// efteling-kit.mjs).
//
//   node scripts/generate-montevideo.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong midden in de toren op RD (92950, 435440), z = 0 op
// NAP +3,4 m (kade en straten rondom: AHN-DTM +3,3 tot +3,6), Z omhoog. +X loopt
// op 36,45 graden in RD, langs de lange gevels van het pand (BAG 36,4-36,5
// graden), naar het oostblok; +Y wijst naar 126,45 graden (noordwest), naar de
// Otto Reuchlinweg en de Maas. De Rijnhaven ligt aan -Y, Hotel New York aan -X
// en +Y.
//
// Bronnen: BAG-pand 0599100000750601 (toren, strook en oostblok in één pand),
// AHN DSM/DTM 0,5 m (PDOK WCS, in dit stelsel uitgelezen: contouren en
// dakhoogtes van alle volumes, de uitkraging van de kubus, de terrassen in de
// kubus, de arm en de M van de windvaan, luifels), 3D BAG LoD2.2 (TU Delft/3D
// geoinformatie, CC BY 4.0: dakvlakken van de kubus, de witte toren, het
// oostblok en de watertoren), Actueel_orthoHR, Wikipedia (139,5 m, met de M
// 152,32 m, M van 12 m), de gevel- en doorsnedetekening van Mecanoo op Commons
// en Commons-foto's van alle kanten.
import { CrossSection, Manifold, prism, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "montevideo";
const ORIGIN = [92950.0, 435440.0];
const AXIS_DEG = 36.45;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.4;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  cube: 143.1, // dak van de rode kubus (3D BAG 143,07-143,18; AHN 142,6-143,5)
  terraceA: 141.6, // terras in de kubus aan de westkant (3D BAG 141,6)
  terraceB: 140.3, // terras aan de noordkant van de kubus (3D BAG 140,3)
  terraceC: 140.7, // terras in de zuidwesthoek (3D BAG 140,6-140,9)
  cube0: 89.5, // onderkant van de kubus (gevel- en doorsnedetekening, foto's 88,7-89,7)
  white: 137.3, // dak van de witte toren (3D BAG 137,2-137,5)
  whiteRim: 138.6, // dakrand van de witte toren (AHN 138,5-140 langs de randen)
  whitePlant: 139.7, // installatieopbouw op de witte toren (3D BAG 139,6-139,7)
  liftTop: 145.7, // liftopbouw onder het oosteinde van de arm (3D BAG 146,1; AHN 145-146,2)
  mid: 92.3, // glazen en donker volume (3D BAG 92,3; AHN 90-94)
  midRim: 92.9,
  redN: 75.4, // rood volume aan de noordgevel (3D BAG 75,4)
  glass0: 13.6, // onderkant van het glazen kader (geveltekening: 10,2 m boven maaiveld)
  pedestal: 145.6, // bovenkant van de voet en onderkant van de arm (AHN-arm 144-146,2; tekening 146,4)
  arm: 146.6,
  mTop: 155.6, // bovenkant van de M (Wikipedia 152,32 m boven maaiveld +3,4; tekening 152,1 m)
  barLow: 18.1, // strook aan de Rijnhaven (3D BAG en AHN 18,1)
  barLowRim: 19.4, // borstwering aan de kade (AHN 19,3-19,4)
  barHigh: 32.1, // donkere strook erachter (AHN 32,0-32,2)
  barHighRim: 32.7, // rand aan de zuidkant (AHN 32,6-32,8)
  barLedge: 21.5, // rode plint aan de noordgevel (AHN 21,5-21,8)
  ne: 40.8, // oostblok (3D BAG 40,8)
  neRim: 41.5,
  neSoffit: 12.8, // onderkant van de uitkraging over de kade (foto's: 9-10 m boven de kade)
  neTop: 43.7, // terugliggende dakopbouw (3D BAG 43,6-43,9)
  neTop2: 45.3,
  neTop3: 45.9,
  neTop4: 46.3,
  canopy: 8.1, // luifel langs de begane grond van strook en oostblok (AHN 8,0-8,1)
  canopyTower: 10.6, // luifel langs de noordgevel van de toren (AHN 10-11)
  storey0: 8.6, // eerste verdieping van de toren
  storey: 3.12, // 43 lagen tot het dak van de kubus
};
const level = (k) => H.storey0 + H.storey * k;

// ---------- plattegrond (m, gebouwstelsel; BAG-contour van het pand) ----------
const rect = (u0, v0, u1, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Toren onder de kubus: rode kolom aan de Rijnhaven (zuidwest), witte toren met
// loggia's (west, tot de noordgevel bij v 13,1), rood noordvolume tot +75,4, en
// oostelijk het donkere (noord) en het glazen volume (zuid, 2,2 m voor de rode
// gevel) tot +92,3. De grens donker/glas op de oostgevel is geschat.
const RED_SW = rect(-10.97, -10.29, 3.0, -3.5);
const WHITE_LOW = rect(-13.1, -3.5, 3.0, 13.1);
const RED_N = rect(-11.0, 13.1, 3.0, 17.18);
const DARK = rect(3.0, -0.5, 17.55, 17.2);
const GLASS = rect(3.0, -12.47, 17.55, -0.5);
// Rode kubus (AHN: westgevel u -14,8, zuidgevel v -10,75, 3,8 m voorbij de rode
// kolom en 1,7 m voorbij de witte toren) en de witte toren erboven (L-vorm).
const CUBE = rect(-14.8, -10.75, 4.0, 5.0);
const WHITE_UP = [[-13.1, 5.0], [4.0, 5.0], [4.0, -9.0], [14.2, -9.0], [14.2, 13.1], [-13.1, 13.1]];
const TERRACES = [
  { poly: rect(-13.5, -3.5, -3.5, 0.2), nap: H.terraceA },
  { poly: rect(-12.5, 0.2, -0.5, 4.1), nap: H.terraceB },
  { poly: rect(-12.5, -9.85, -8.5, -3.5), nap: H.terraceC },
];
const WHITE_PLANT = rect(6.3, -2.4, 11.9, 9.2);
const WHITE_RAISED = rect(-3.8, 5.5, 2.2, 12.5); // 3D BAG 139,6
const LIFT = rect(5.0, 1.6, 8.5, 5.0);
// Windvaan: voet, arm langs X (AHN-punten 144-146,2 van u -3,6 tot 8,3) en de M.
const VANE = { u: 3.2, v0: 1.7, v1: 3.3, arm0: -5.0, arm1: 10.0 };
const PEDESTAL = rect(2.5, 1.8, 3.9, 3.2);

// Strook langs de Rijnhaven: lage voorstrook (+18,1) en hoge achterstrook (+32,1)
// met aan de noordkant een rode plint (+21,5); kleine dakopbouw met een schuin
// dak (3D BAG 32,9 / 34,7).
const BAR_LOW = rect(17.55, -10.27, 55.67, -2.5);
const BAR_HIGH = rect(17.55, -2.5, 55.67, 15.3);
const BAR_LEDGE = rect(17.22, 15.3, 55.67, 16.7);
// Oostblok: begane grond onder het noordelijke deel, uitkraging over de kade
// (v < -10,27) op vier schuine stempels; dakopbouw en installaties (3D BAG).
const NE_LOW = rect(55.67, -10.27, 78.87, 17.21);
const NE_CANT = rect(55.67, -26.63, 78.87, -10.27);
const NE_ALL = rect(55.67, -26.63, 78.87, 17.21);
const NE_TOP = rect(61.5, -17.5, 73.6, 13.9);
const NE_TOP2 = rect(65.0, -13.2, 69.0, 5.2);
const NE_TOP3 = rect(61.4, 3.2, 72.0, 13.9);
const NE_TOP4 = rect(69.6, -5.6, 72.6, 3.2);
const STRUTS = [57.2, 63.2, 69.2, 75.2]; // voet aan de kade (u); de kop staat 2,5 m verder in +X
const WATER_TOWER = { c: [74.2, 9.4], r: 2.0, leg: 0.9, tank0: 47.2, tank1: 49.8, top: 51.5 };
const CHIMNEYS = [6.0, 7.4, 8.8, 10.2].map((v) => [70.6, v]);

// ---------- gevelritme (foto's en geveltekening) ----------
const NICHE = 0.35;
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
const floorsIn = (nap0, nap1, sill = 0.9, head = 2.6) => range(44, (k) => [level(k) + sill, level(k) + head]).filter(([a, b]) => a >= nap0 && b <= nap1);
const GROUND = [[3.9, 7.4]]; // glazen begane grond
const BAR_FLOORS_HIGH = range(4, (k) => [18.1 + 3.5 * k + 0.9, 18.1 + 3.5 * k + 2.7]).filter(([, b]) => b < 31.5);
const NE_FLOORS = range(9, (k) => [H.neSoffit + 3.1 * k + 0.8, H.neSoffit + 3.1 * k + 2.6]);
const NE_FLOORS_ALL = [...range(2, (k) => [8.6 + 2.1 * k + 0.4, 8.6 + 2.1 * k + 1.7]), ...NE_FLOORS];

// ---------- hulpfuncties ----------
const cs = (poly) => new CrossSection([ccw(poly)]);
const prismN = (poly, nap0, nap1) => prism(poly, nap0 === null ? BASE : z(nap0), z(nap1));
const edge = (poly, i) => [poly[i], poly[(i + 1) % poly.length]];
const lenOf = ([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]);
// Blinde nis in de gevel a→b (buitenkant rechts, tegen de klok in rond de
// veelhoek): s0..s1 vanaf a, NAP-hoogtes, diepte in de gevel en `out` naar buiten.
const niche = (a, b, s0, s1, nap0, nap1, depth = NICHE, out = 1.0) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return Manifold.cube([depth + out, s1 - s0, nap1 - nap0])
    .translate([-depth, s0, z(nap0)])
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
// Ronde patrijspoort (diameter d) in de gevel a→b op s, hart op NAP c.
const porthole = (a, b, s, c, d = 1.2, depth = NICHE) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return Manifold.cylinder(depth + 1.0, d / 2, d / 2, 20)
    .translate([0, 0, -depth])
    .rotate([0, 90, 0])
    .translate([0, s, z(c)])
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
// Middens van n gelijke kolommen op ongeveer `pitch` tussen s0 en s1.
const centers = (s0, s1, pitch) => {
  const n = Math.max(1, Math.round((s1 - s0) / pitch));
  return range(n, (k) => s0 + ((s1 - s0) * (k + 0.5)) / n);
};
// Vensters per rij: in rij i schuift elke kolom `jog[i % jog.length]` m op
// (het verspringende vensterpatroon van de bakstenen gevels).
function punched(a, b, { s0 = 0.8, s1, pitch, width, rows, jog = [0], widths = null, depth = NICHE }) {
  const end = s1 ?? lenOf([a, b]) - 0.8;
  const cs_ = centers(s0, end, pitch);
  const out = [];
  rows.forEach(([r0, r1], i) => {
    cs_.forEach((s, k) => {
      const w = widths ? widths[(k + i) % widths.length] : width;
      const c = Math.min(Math.max(s + jog[i % jog.length], s0 + w / 2), end - w / 2);
      out.push(niche(a, b, c - w / 2, c + w / 2, r0, r1, depth));
    });
  });
  return out;
}
// Glazen veld binnen een kader: per laag een nis tussen vloerranden, verdeeld in
// vakken door stijlen van 0,5 m.
function framedGlass(a, b, { s0, s1, nap0, nap1, floors, bays, depth = 0.4 }) {
  const out = [];
  const w = (s1 - s0 - 0.5 * (bays - 1)) / bays;
  for (const [f0, f1] of floors) {
    const lo = Math.max(f0, nap0);
    const hi = Math.min(f1, nap1);
    if (hi - lo < 0.8) continue;
    for (let k = 0; k < bays; k++) out.push(niche(a, b, s0 + k * (w + 0.5), s0 + k * (w + 0.5) + w, lo, hi, depth));
  }
  return out;
}
const glassFloors = (nap0, nap1, pitch = H.storey, start = H.storey0) =>
  range(60, (k) => [start + pitch * k + 0.45, start + pitch * (k + 1) - 0.05]).filter(([a, b]) => a >= nap0 - 0.01 && b <= nap1 + 0.01);
// Schuine kraag van 45 graden onder een uitkraging: omhulsel van de onderkant
// van het bovenste volume en de (kleinere) bovenkant van wat eronder staat.
const kraag = (topPoly, napTop, lowPoly, drop) =>
  Manifold.hull([...topPoly.map(([u, v]) => [u, v, z(napTop) + 0.2]), ...lowPoly.map(([u, v]) => [u, v, z(napTop - drop)])]);
// Luifel: plaat van 0,8 m met een kraag van 45 graden tegen de gevel.
const canopy = (poly, napTop, wallPoly, reach) =>
  union([prismN(poly, napTop - 0.8, napTop), Manifold.hull([...poly.map(([u, v]) => [u, v, z(napTop - 0.8)]), ...wallPoly.map(([u, v]) => [u, v, z(napTop - 0.8 - reach)])])]);

// ---------- rode kubus ----------
let cube = prismN(CUBE, H.cube0, H.cube);
cube = cube.subtract(union(TERRACES.map(({ poly, nap }) => prismN(poly, nap, H.cube + 1))));
{
  const cuts = [];
  const [south, east, north, west] = CUBE.map((_, i) => edge(CUBE, i));
  void east;
  // Westgevel: glazen gevel in een rood kader van 1,4 m, vier vakken per laag.
  cuts.push(...framedGlass(...west, { s0: 1.4, s1: lenOf(west) - 1.4, nap0: H.cube0 + 1.6, nap1: H.cube - 1.4, floors: glassFloors(H.cube0, H.cube), bays: 4 }));
  void north;
  // Zuidgevel: rood baksteen met verspringende vensters (brede en smalle).
  cuts.push(...punched(...south, { pitch: 3.1, widths: [2.4, 1.2, 1.2, 2.4, 1.2, 1.2], rows: floorsIn(H.cube0 + 0.5, H.cube - 1.2), jog: [0, 0.4, -0.3] }));
  cube = cube.subtract(union(cuts));
}
// Kraag van 45 graden onder de uitkraging: eerst tot de witte toren (1,7 m),
// dan boven de rode kolom (nog 2,1 m).
const cubeKraag = union([
  kraag(CUBE, H.cube0, rect(-13.1, -10.29, 4.0, 5.0), 1.7 + 0.46),
  kraag(rect(-13.1, -10.29, 4.0, -3.5), H.cube0 - 2.16, rect(-10.97, -10.29, 4.0, -3.5), 2.13),
]);

// ---------- witte toren ----------
let whiteUp = prismN(WHITE_UP, H.cube0 - 0.5, H.whiteRim);
whiteUp = whiteUp.subtract(prism(cs(WHITE_UP).offset(-0.9, "Miter").toPolygons()[0], z(H.white), z(H.whiteRim) + 1));
let whiteLow = prismN(WHITE_LOW, null, H.cube0 + 0.2);
{
  const cuts = [];
  const E = WHITE_UP.map((_, i) => edge(WHITE_UP, i));
  // E0 noordkant kubus (v 5, binnen), E1 oostkant kubus (binnen), E2 zuidgevel
  // (v -9), E3 oostgevel (u 14,2), E4 noordgevel (v 13,1), E5 westgevel (u -13,1).
  const whiteRows = floorsIn(H.mid + 0.3, H.white - 0.6, 0.8, 2.5);
  cuts.push(...punched(...E[2], { pitch: 2.5, width: 1.3, rows: whiteRows }));
  cuts.push(...punched(...E[3], { pitch: 2.5, width: 1.3, rows: whiteRows }));
  // Noordgevel: vierkante vensters en een kolom patrijspoorten (Wikipedia: ronde
  // ramen aan de noordzijde); boven het rode noordvolume (+75,4) vanaf u -11.
  const northRows = floorsIn(H.mid + 0.3, H.white - 0.6, 0.8, 2.5);
  cuts.push(...punched(...E[4], { s0: 0.8, s1: 26.4, pitch: 2.6, width: 1.3, rows: northRows }));
  // Westgevel boven de kubus: vensters per laag.
  cuts.push(...punched(...E[5], { s0: 0.8, s1: 7.3, pitch: 2.6, width: 1.3, rows: floorsIn(H.cube0 + 0.3, H.white - 0.6, 0.8, 2.5) }));
  whiteUp = whiteUp.subtract(union(cuts));
  // Lage witte toren: westgevel met loggia's (twee per laag, wit balkonfront van
  // 0,5 m ertussen), noordgevel in de inham en boven het rode noordvolume met
  // vensters en patrijspoorten.
  const L = WHITE_LOW.map((_, i) => edge(WHITE_LOW, i));
  const lowCuts = [];
  const west = L[3];
  const loggias = floorsIn(H.storey0, H.cube0 - 0.4, 0.5, 2.9);
  for (const [r0, r1] of loggias) {
    lowCuts.push(niche(...west, 1.0, 7.7, r0, r1, 0.45));
    lowCuts.push(niche(...west, 8.9, 15.6, r0, r1, 0.45));
  }
  lowCuts.push(...punched(...west, { s0: 0.8, s1: 15.8, pitch: 2.4, width: 1.6, rows: GROUND }));
  const north = L[2]; // van (3,0; 13,1) naar (-13,1; 13,1)
  const upperNorth = floorsIn(H.redN + 0.3, H.cube0 - 0.4, 0.8, 2.5);
  lowCuts.push(...punched(...north, { s0: 0.8, s1: 13.4, pitch: 2.6, width: 1.3, rows: upperNorth }));
  for (const [r0] of upperNorth) lowCuts.push(porthole(...north, 4.7, r0 + 0.85));
  // Inham (u -13,1..-11) tot op de grond: een kolom patrijspoorten.
  for (const [r0] of floorsIn(H.storey0, H.cube0 - 0.4, 0.8, 2.5)) lowCuts.push(porthole(...north, 15.05, r0 + 0.85));
  whiteLow = whiteLow.subtract(union(lowCuts));
  // Patrijspoorten in de witte noordgevel boven +92,3 (twee kolommen).
  whiteUp = whiteUp.subtract(union([...northRows.map(([r0]) => porthole(...E[4], 13.1 + 1.3, r0 + 0.85)), ...northRows.map(([r0]) => porthole(...E[4], 22.0, r0 + 0.85))]));
}
// Dakopbouwen op de witte toren.
const whiteRoof = union([
  prismN(WHITE_PLANT, H.white - 0.1, H.whitePlant),
  prismN(WHITE_RAISED, H.white - 0.1, H.whitePlant - 0.1),
  prismN(LIFT, H.white - 0.1, H.liftTop),
]);

// ---------- rode kolom (zuidwest) en rood noordvolume ----------
let redSW = prismN(RED_SW, null, H.cube0 + 0.2);
{
  const [south, , , west] = RED_SW.map((_, i) => edge(RED_SW, i));
  const rows = floorsIn(H.storey0, H.cube0 - 0.4);
  redSW = redSW.subtract(
    union([
      ...punched(...south, { pitch: 2.8, widths: [1.2, 2.4, 1.2, 1.2, 2.4], rows, jog: [0, 0.5, -0.4, 0.2] }),
      ...punched(...west, { pitch: 2.6, widths: [1.2, 2.2], rows, jog: [0, 0.4] }),
      ...punched(...south, { pitch: 2.4, width: 1.8, rows: GROUND }),
      ...punched(...west, { pitch: 2.4, width: 1.8, rows: GROUND }),
    ]),
  );
}
let redN = prismN(RED_N, null, H.redN);
{
  const [, , north, west] = RED_N.map((_, i) => edge(RED_N, i));
  const rows = floorsIn(11.0, H.redN - 0.6);
  redN = redN.subtract(
    union([
      ...punched(...north, { pitch: 2.8, widths: [1.4, 2.6, 1.4], rows, jog: [0, 0.5, -0.5] }),
      ...punched(...west, { pitch: 2.6, width: 1.3, rows }),
    ]),
  );
}

// ---------- donker en glazen volume (tot +92,3) ----------
let dark = prismN(DARK, null, H.midRim);
let glass = prismN(GLASS, null, H.midRim);
{
  // Dakrand van 0,9 m rond beide, dak op +92,3.
  const top = rect(3.0, -12.47, 17.55, 17.2);
  const inner = prism(cs(top).offset(-0.9, "Miter").toPolygons()[0], z(H.mid), z(H.midRim) + 1);
  dark = dark.subtract(inner);
  glass = glass.subtract(inner);
  const [, dEast, dNorth] = DARK.map((_, i) => edge(DARK, i));
  const [gSouth, gEast] = GLASS.map((_, i) => edge(GLASS, i));
  const darkRows = floorsIn(H.storey0, H.mid - 0.5);
  dark = dark.subtract(
    union([
      // Noordgevel: brede liggende vensters, oostgevel: verspringende vensters boven de strook.
      ...punched(...dNorth, { pitch: 3.6, widths: [2.6, 1.2, 2.6, 1.2], rows: darkRows, jog: [0, 0.6] }),
      ...punched(...dEast, { s0: 2.8, pitch: 2.3, widths: [1.0, 2.0, 1.0], rows: floorsIn(H.barHigh + 0.4, H.mid - 0.5), jog: [0, 0.5, -0.4] }),
      ...punched(...dNorth, { pitch: 2.4, width: 1.8, rows: GROUND }),
    ]),
  );
  // Glazen volume: donker kader van 1,2 m, per laag drie vakken; eronder een
  // bakstenen plint met een vensterband en de glazen begane grond.
  glass = glass.subtract(
    union([
      ...framedGlass(...gSouth, { s0: 1.2, s1: lenOf(gSouth) - 1.2, nap0: H.glass0 + 0.4, nap1: H.mid - 0.9, floors: glassFloors(H.glass0, H.mid), bays: 3 }),
      ...framedGlass(...gEast, { s0: 1.2, s1: lenOf(gEast) - 0.6, nap0: H.barHigh + 0.6, nap1: H.mid - 0.9, floors: glassFloors(H.barHigh, H.mid), bays: 3 }),
      ...framedGlass(...gEast, { s0: 1.2, s1: 9.6, nap0: H.barLowRim + 0.6, nap1: H.barHigh, floors: glassFloors(H.barLowRim, H.barHigh), bays: 2 }),
      ...punched(...gSouth, { pitch: 2.6, width: 2.0, rows: [[9.8, 11.8]] }),
      ...punched(...gSouth, { pitch: 2.4, width: 1.8, rows: GROUND }),
    ]),
  );
}

// ---------- windvaan met de M ----------
const pedestal = prismN(PEDESTAL, H.cube - 0.1, H.pedestal + 0.05);
const arm = prism(rect(VANE.arm0, VANE.v0, VANE.arm1, VANE.v1), z(H.pedestal), z(H.arm));
// Letter M (7,8 m breed, 8,3 m hoog, 1,6 m diep) met poten van 1,6 m en schuine
// halen van 1,5 m; de onderkant van de V helt 52 graden (printbaar zonder steun).
const mH = H.mTop - H.arm + 0.05; // 0,05 m in de arm
const M_OUTLINE = [
  [-3.9, 0], [-2.3, 0], [-2.3, 5.6], [0, 2.6], [2.3, 5.6], [2.3, 0], [3.9, 0], [3.9, mH], [2.6, mH], [0, mH - 3.6], [-2.6, mH], [-3.9, mH],
];
const letterM = Manifold.extrude(new CrossSection([ccw(M_OUTLINE)]), VANE.v1 - VANE.v0)
  .rotate([90, 0, 0])
  .translate([VANE.u, VANE.v1, z(H.arm) - 0.05]);

// ---------- strook langs de Rijnhaven ----------
let barLow = union([prismN(BAR_LOW, null, H.barLow), prismN(rect(17.55, -10.27, 55.67, -9.6), null, H.barLowRim)]);
let barHigh = union([prismN(BAR_HIGH, null, H.barHigh), prismN(rect(17.55, -2.5, 55.67, -1.9), null, H.barHighRim)]);
let barLedge = prismN(BAR_LEDGE, null, H.barLedge);
{
  const [lSouth] = BAR_LOW.map((_, i) => edge(BAR_LOW, i));
  const [hSouth, , hNorth] = BAR_HIGH.map((_, i) => edge(BAR_HIGH, i));
  const [, , gNorth] = BAR_LEDGE.map((_, i) => edge(BAR_LEDGE, i));
  // Rode voorstrook: glazen begane grond, een vensterband met oranje kozijnen.
  barLow = barLow.subtract(union([...punched(...lSouth, { pitch: 2.6, width: 2.1, rows: [[14.3, 16.4], [9.9, 11.6]] }), ...punched(...lSouth, { pitch: 1.9, width: 1.5, rows: GROUND })]));
  // Donkere achterstrook: drie rijen liggende vensters (zuid en noord).
  barHigh = barHigh.subtract(
    union([
      ...punched(...hSouth, { pitch: 4.6, width: 3.2, rows: BAR_FLOORS_HIGH, jog: [0, 0.7] }),
      ...punched(...hNorth, { pitch: 4.6, width: 3.2, rows: BAR_FLOORS_HIGH.filter(([a]) => a > H.barLedge), jog: [0, 0.7] }),
    ]),
  );
  // Rode plint aan de noordgevel: twee vensterbanden boven de glazen begane grond.
  barLedge = barLedge.subtract(union([...punched(...gNorth, { pitch: 2.6, width: 2.1, rows: [[11.0, 13.2], [15.4, 17.6]] }), ...punched(...gNorth, { pitch: 1.9, width: 1.5, rows: GROUND })]));
}
const barRoof = union([
  prismN(rect(32.6, 5.0, 42.7, 8.5), H.barHigh - 0.1, 32.9),
  Manifold.hull([
    ...rect(39.9, 5.0, 42.7, 8.2).map(([u, v]) => [u, v, z(34.7)]),
    ...rect(39.9, 5.0, 46.0, 8.2).map(([u, v]) => [u, v, z(H.barHigh) - 0.1]),
    [46.0, 5.0, z(32.8)], [46.0, 8.2, z(32.8)],
  ]),
]);

// ---------- oostblok met uitkraging over de kade ----------
let ne = union([prismN(NE_LOW, null, H.neRim), prismN(NE_CANT, H.neSoffit, H.neRim)]);
ne = ne.subtract(prism(cs(NE_ALL).offset(-0.7, "Miter").toPolygons()[0], z(H.ne), z(H.neRim) + 1));
{
  const [south, east, north, west] = NE_ALL.map((_, i) => edge(NE_ALL, i));
  const cuts = [];
  // Zuidgevel aan de Rijnhaven: glas en balkons in een rood kader van 1,4 m.
  cuts.push(...framedGlass(...south, { s0: 1.4, s1: lenOf(south) - 1.4, nap0: H.neSoffit + 0.4, nap1: H.ne - 0.9, floors: range(9, (k) => [H.neSoffit + 3.1 * k + 0.45, H.neSoffit + 3.1 * (k + 1) - 0.05]), bays: 4, depth: 0.5 }));
  // Westgevel (s = 0 bij v 17,21): boven de achterstrook (v 15,3..-2,5, +32,1),
  // boven de voorstrook (v -2,5..-10,27, +19,4) en de oranje kopgevel van de
  // uitkraging (v -10,27..-26,63) vanaf +12,8.
  cuts.push(...punched(...west, { s0: 2.4, s1: 19.2, pitch: 2.4, widths: [1.2, 1.2, 2.0], rows: NE_FLOORS.filter(([a]) => a > H.barHigh + 0.4), jog: [0, 0.4] }));
  cuts.push(...punched(...west, { s0: 20.4, s1: 27.0, pitch: 2.2, width: 1.2, rows: NE_FLOORS.filter(([a]) => a > H.barLowRim + 0.4) }));
  cuts.push(...punched(...west, { s0: 28.3, s1: 43.0, pitch: 2.0, widths: [1.0, 1.0, 1.6], rows: NE_FLOORS, jog: [0, 0.3] }));
  // Noord- en oostgevel: verspringende vensters per laag, glazen begane grond.
  cuts.push(...punched(...north, { pitch: 2.4, widths: [1.2, 2.0], rows: NE_FLOORS_ALL, jog: [0, 0.4] }));
  cuts.push(...punched(...east, { pitch: 2.4, widths: [1.2, 2.0], rows: NE_FLOORS, jog: [0, 0.4] }));
  cuts.push(...punched(...east, { s0: 16.6, s1: 43.0, pitch: 2.4, widths: [1.2, 2.0], rows: NE_FLOORS_ALL.slice(0, 2) }));
  cuts.push(...punched(...north, { pitch: 1.9, width: 1.5, rows: GROUND }));
  cuts.push(...punched(...east, { s0: 16.6, s1: 43.0, pitch: 1.9, width: 1.5, rows: GROUND }));
  ne = ne.subtract(union(cuts));
}
// Glazen begane grond onder de uitkraging (strook en oostblok samen langs v -10,27).
{
  const front = [[17.55, -10.27], [78.87, -10.27]];
  // nis in de zuidgevel van de strook en het oostblok: van rechts naar links is
  // de buitenkant (-v) rechts van a→b = (17,55 → 78,87).
  const gl = punched(...front, { s0: 38.3, s1: 61.1, pitch: 1.9, width: 1.5, rows: GROUND });
  ne = ne.subtract(union(gl));
}
// Schuine stempels onder de uitkraging (1 x 1 m): voet aan de kade, kop 2,5 m
// verder langs de gevel en 8,2 m verder over de kade, tegen de onderkant.
const strut = (u) => {
  const a = [u, -11.0, BASE];
  const b = [u + 2.5, -19.2, z(H.neSoffit) + 0.5];
  const pts = [];
  for (const [du, dv] of [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]]) {
    pts.push([a[0] + du, a[1] + dv, a[2]], [b[0] + du, b[1] + dv, b[2]]);
  }
  return Manifold.hull(pts);
};
const struts = union(STRUTS.map(strut));
// Dakopbouw met installaties, schoorstenen en de watertoren.
let neTop = union([prismN(NE_TOP, H.ne - 0.1, H.neTop), prismN(NE_TOP2, H.ne - 0.1, H.neTop2), prismN(NE_TOP3, H.ne - 0.1, H.neTop3), prismN(NE_TOP4, H.ne - 0.1, H.neTop4)]);
{
  const [s, e, n, w] = NE_TOP.map((_, i) => edge(NE_TOP, i));
  neTop = neTop.subtract(union([s, e, n, w].flatMap((g) => punched(...g, { s0: 0.6, pitch: 2.2, width: 1.7, rows: [[H.ne + 0.4, H.neTop - 0.6]], depth: 0.3 }))));
}
const chimneys = union(CHIMNEYS.map(([u, v]) => Manifold.cylinder(z(50.5) - z(H.neTop3) + 0.1, 0.5, 0.5, 16).translate([u, v, z(H.neTop3) - 0.1])));
const wt = WATER_TOWER;
const waterTower = union([
  ...[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => {
    const c = [wt.c[0] + a * 1.0, wt.c[1] + b * 1.0];
    return prism(rect(c[0] - wt.leg / 2, c[1] - wt.leg / 2, c[0] + wt.leg / 2, c[1] + wt.leg / 2), z(H.ne) - 0.1, z(wt.tank0) + 0.1);
  }),
  // Middenkolom, tank met een bodem onder 45 graden, cilinder en kegeldak.
  Manifold.cylinder(z(wt.tank0) - z(H.ne) + 0.1, 1.2, 1.2, 24).translate([wt.c[0], wt.c[1], z(H.ne) - 0.1]),
  Manifold.cylinder(wt.r - 1.2, 1.2, wt.r, 24).translate([wt.c[0], wt.c[1], z(wt.tank0) - (wt.r - 1.2)]),
  Manifold.cylinder(z(wt.tank1) - z(wt.tank0), wt.r, wt.r, 24).translate([wt.c[0], wt.c[1], z(wt.tank0)]),
  Manifold.cylinder(z(wt.top) - z(wt.tank1), wt.r + 0.2, 0.05, 24).translate([wt.c[0], wt.c[1], z(wt.tank1)]),
]);

// ---------- luifels (kraag van 45 graden tegen de gevel) ----------
const canopies = union([
  canopy(rect(17.55, -12.5, 78.87, -10.27), H.canopy, [[17.55, -10.27], [78.87, -10.27]], 2.23),
  canopy(rect(17.22, 16.7, 78.82, 18.7), H.canopy, [[17.22, 16.7], [78.82, 16.7]], 2.0),
  canopy(rect(-11.0, 17.15, 17.22, 18.5), H.canopyTower, [[-11.0, 17.15], [17.22, 17.15]], 1.35),
]);

// Nissen die een ander bouwdeel afdekt, worden ingesloten holtes: die vallen weg.
const parts = {
  cube, cubeKraag, whiteUp, whiteLow, whiteRoof, redSW, redN, dark, glass, pedestal, arm, letterM,
  barLow, barHigh, barLedge, barRoof, ne, struts, neTop, chimneys, waterTower, canopies,
};
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts));
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Montevideo met rode kubus witte toren donker en glazen volume M-windvaan strook en uitkragend oostblok", model]],
  catalog: {
    name: "Montevideo",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Kade aan de Rijnhaven (AHN-DTM +3,3), Landverhuizersplein (+3,5) en de
    // Otto Reuchlinweg (+3,4); de lader neemt de laagste.
    groundSamplePoints: [[-22, 0], [0, -20], [40, -20], [40, 22], [85, 0]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000750601"],
    description:
      "Oorsprong midden in de toren op kadeniveau NAP +3,4 m, +X op 36,45 graden in RD (langs de lange gevels, naar het oostblok), +Y naar de Otto Reuchlinweg en de Maas; toren als stapeling van volumes: rode kolom en witte toren met loggia's tot de rode kubus (+89,5 tot +143,1, 1,7-3,8 m uitkragend naar het westen met een kraag van 45 graden, glazen westgevel in een rood kader, terrassen in het dak), witte toren tot +137,3, donker en glazen volume tot +92,3, rood noordvolume tot +75,4, M-windvaan op voet en arm tot +155,6; strook langs de Rijnhaven (+18,1 en +32,1) en oostblok tot +40,8 dat 16 m over de kade uitkraagt op vier schuine stempels, met dakopbouw, schoorstenen en watertoren; gevelritme, kraag en stempels uit foto's en tekening geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      cubeRoofNapM: H.cube,
      cubeBottomNapM: H.cube0,
      cubeTerracesNapM: [H.terraceA, H.terraceB, H.terraceC],
      whiteRoofNapM: H.white,
      liftTopNapM: H.liftTop,
      midVolumesNapM: H.mid,
      redNorthNapM: H.redN,
      vaneArmNapM: [H.pedestal, H.arm],
      letterMTopNapM: H.mTop,
      letterMSizeM: [7.8, +mH.toFixed(2), +(VANE.v1 - VANE.v0).toFixed(2)],
      barNapM: [H.barLow, H.barHigh, H.barLedge],
      eastBlockNapM: H.ne,
      eastBlockSoffitNapM: H.neSoffit,
      eastBlockRoofNapM: [H.neTop, H.neTop2, H.neTop3, H.neTop4],
      waterTowerTopNapM: WATER_TOWER.top,
      canopyNapM: [H.canopy, H.canopyTower],
      storeyPitchM: H.storey,
      axisDegrees: AXIS_DEG,
      estimates: [
        "onderkant van de kubus (+89,5) uit de geveltekening en foto's; de kraag van 45 graden eronder volgt de schuine onderkant op de foto's",
        "grenzen tussen de volumes onder de kubus uit de BAG-contour, het AHN en foto's van alle kanten; de grens tussen het donkere en het glazen volume op de oostgevel (v = -0,5) is geschat",
        "gevelritme uit foto's: 43 lagen van 3,12 m; verspringende vensters in de bakstenen gevels, loggia's in de witte westgevel, patrijspoorten in de noordgevel, glas in een kader van 1,2-1,4 m (kubus, glazen volume, zuidgevel oostblok)",
        "windvaan: de M draait met de wind; hier vast in het vlak van de gevel- en doorsnedetekening (naar de Rijnhaven), arm langs X zoals in het AHN; letter 7,8 x 8,3 m, 1,6 m diep, arm 15 m lang",
        "uitkraging van het oostblok: onderkant +12,8 en vier stempels van 1 m uit foto's",
        "dakopbouw, schoorstenen (4 x 1 m tot +50,5) en watertoren (diameter 4 m, tot +51,5) uit de 3D BAG, het AHN en foto's",
      ],
    },
    sources: [
      "PDOK BAG pand 0599100000750601, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000750601 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakvlakken van de kubus en de witte toren, het oostblok en de watertoren",
      "https://nl.wikipedia.org/wiki/Montevideo_(gebouw)",
      "https://commons.wikimedia.org/wiki/File:Montevideo_Residential_Tower_9.jpg",
      "https://commons.wikimedia.org/wiki/File:Montevideo_Residential_Tower_10.jpg",
      "https://commons.wikimedia.org/wiki/File:Montevideo(Rotterdam).jpg",
      "https://commons.wikimedia.org/wiki/File:Euromast_-_Scheepvaartkwartier_-_Rotterdam_-_View_of_Montevideo.jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Montevideo_in_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Montevideo_2010.JPG",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_montevideotoren.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_Montevideo_(1).jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_Montevideo_(2).jpg",
      "https://commons.wikimedia.org/wiki/File:Montevideo_Residential_Tower_3.jpg",
      "https://commons.wikimedia.org/wiki/File:Montevideo_Residential_Tower_4.jpg",
      "https://commons.wikimedia.org/wiki/File:Montevideo_Residential_Tower_7.jpg",
      "https://commons.wikimedia.org/wiki/File:Skyscraper_in_Rotterdam_(28384617249).jpg",
    ],
  },
});

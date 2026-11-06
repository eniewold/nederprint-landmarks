// XO Hotels Rivium (voormalig kantoorgebouw Braingate, Rivium Boulevard 301-321, Capelle aan den IJssel, 2003):
// een gebogen kantoorschijf aan de voet van de Van Brienenoordbrug, sinds 2021 in verbouwing tot hotel met kantoren.
// De schijf staat als een brug over de straat die van de Rivium Boulevard naar het noorden loopt: een doorgang van
// 30,5 m breed (rijbaan, fietspaden en voetpaden) onder een brugdeel van zes lagen. Westelijk van de doorgang is
// de schijf 42 m hoog (NAP), met aan de zuidzijde een lagere vleugel op kolommen en aan de noordwesthoek een lage
// driehoek; oostelijk is de schijf 37 m hoog, met aan de noordzijde een glazen lift- en trappentoren, het
// entreepaviljoen met luifel en een parkeerdek op een halfverdiepte garage. Langs beide lange gevels loopt bovenop
// een band van zonwerende lamellen (als dichte luifelplaat gemodelleerd); de gevels zijn horizontale vensterbanden.
//
// De PDOK-reconstructie extrudeert de BAG-contour vanaf het laagste maaiveld (NAP -1,4) en zet zo een dicht blok
// over de straat; dit model laat de doorgang open.
//
// Contour: BAG-pand 0502100000021132. De zuidgevel is één cirkelboog (middelpunt RD 97177,78 / 436679,39, straal
// 137,8 m; 27 BAG-hoekpunten binnen 0,35 m), de noordgevel de concentrische boog op 123,5 m (3D BAG-dakranden
// 123,0-124,2). Doorgang, kolommen en begane grond uit de BGT (pand-vlakken en wegdelen op hoogteligging 0),
// hoogtes uit het AHN-DSM (AHN5) en de 3D BAG LoD2.2, verdiepingen en gevelindeling uit de luchtfoto en de foto's
// en renders van de gemeente Capelle (capellebouwtaandestad.nl).
import { Manifold, CrossSection, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "xo-hotels-rivium";
// Modelstelsel: RD-assen (de doorgang en de straat lopen noord-zuid), oorsprong op de rijbaan in de doorgang.
const ORIGIN = [97156, 436558];
const AXIS = [1, 0];
const GROUND = 5.2; // NAP, rijbaan in de doorgang (AHN-DTM 5,2-5,4; plein aan de noordkant 4,5-4,9)
const BASE = -7.2; // NAP -2,0: onder het lage maaiveld aan de oost- en zuidkant (-0,8 tot -1,5)
const z = (nap) => nap - GROUND;
const m = ([x, y]) => [x - ORIGIN[0], y - ORIGIN[1]];
const DEPTH = 0.35;

// ---------- Bogen ----------
const C = m([97177.78, 436679.39]);
const R_OUT = 137.8; // zuidgevel
const R_IN = 123.5; // noordgevel
const ang = ([x, y]) => Math.atan2(y - C[1], x - C[0]);
const onArc = (r, a) => [C[0] + r * Math.cos(a), C[1] + r * Math.sin(a)];
const A0 = (-127 * Math.PI) / 180, A1 = (-58 * Math.PI) / 180; // ruim om het gebouw heen
// Ringsegment tussen r0 < r1 van hoek a0 tot a1.
function ringPoly(r0, r1, a0, a1, step = 0.02) {
  const n = Math.max(2, Math.ceil((a1 - a0) / step));
  const outer = Array.from({ length: n + 1 }, (_, k) => onArc(r1, a0 + ((a1 - a0) * k) / n));
  const inner = Array.from({ length: n + 1 }, (_, k) => onArc(r0, a1 - ((a1 - a0) * k) / n));
  return [...outer, ...inner];
}
const ring = (r0, r1, z0, z1) => prism(ringPoly(r0, r1, A0, A1), z0, z1);
// Houdt van `solid` de kant van de lijn a→b waar `keep` ligt.
function keepSide(solid, a, b, keep) {
  const d = [b[0] - a[0], b[1] - a[1]], Ln = Math.hypot(...d);
  let n = [-d[1] / Ln, d[0] / Ln];
  if ((keep[0] - a[0]) * n[0] + (keep[1] - a[1]) * n[1] < 0) n = [-n[0], -n[1]];
  return solid.trimByPlane([n[0], n[1], 0], a[0] * n[0] + a[1] * n[1]);
}
// Lijn a→b evenwijdig verschoven met `dist` naar de kant van `toward`.
function offsetLine(a, b, dist, toward) {
  const d = [b[0] - a[0], b[1] - a[1]], Ln = Math.hypot(...d);
  let n = [-d[1] / Ln, d[0] / Ln];
  if ((toward[0] - a[0]) * n[0] + (toward[1] - a[1]) * n[1] < 0) n = [-n[0], -n[1]];
  return [[a[0] + n[0] * dist, a[1] + n[1] * dist], [b[0] + n[0] * dist, b[1] + n[1] * dist]];
}

// ---------- Hoogtes (NAP) ----------
// Lagen van 3,6 m vanaf het plein-/entreeniveau 4,7 (parkeerdek 4,5-4,7; 3D BAG-dakvlak 4,42-4,69): 29,9 (dak
// westvleugel) en 37,1 (dak oostdeel) vallen precies op laag 7 en 9. Westelijk dak 42,0 met de lamellenband op
// 43,25; oostelijk 37,1 met band 38,3 (3D BAG en DSM). Onderste laag van het oostdeel op het lage maaiveld (-0,8).
const L = Array.from({ length: 11 }, (_, k) => 4.7 + 3.6 * k); // 4,7 … 40,7
const WEST_ROOF = 42.0, WEST_BAND = 43.25;
const EAST_ROOF = 37.1, EAST_BAND = 38.3;
const WING_ROOF = 29.9; // lage zuidwestvleugel en noordwestdriehoek (L[7])
const SOFFIT = L[4]; // 19,1: onderkant van het brugdeel boven de doorgang (render: vijf lagen plus dakband erboven)
const TOWER = 41.5; // glazen lift- en trappentoren aan de noordgevel bij de doorgang (3D BAG 40,6-41,5)
const PAV_ROOF = 10.5; // entreepaviljoen (3D BAG 8,8-10,9)
const CANOPY = [7.2, 8.3]; // luifel (3D BAG 7,2-8,3)
const DECK = 4.6; // parkeerdek
const CORE = 42.9; // trappenhuizen op het brugdeel (3D BAG 42,7-42,9)
const PLANT = 39.5; // opbouw op het oostelijke dak bij de sprong (3D BAG 39,5)

// ---------- Plattegrond (RD) ----------
const WEST_END = [m([97105.9, 436561.3]), m([97120.8, 436570.5])]; // westkopgevel van de 42-m schijf (3D BAG)
const FACE42_E = [m([97171.4, 436541.8]), m([97174.6, 436555.2])]; // oostkant van de 42-m schijf (sprong naar 37,1)
const PASSAGE_W = 97140.2 - ORIGIN[0]; // westwand van de doorgang (BGT-pand)
const PASSAGE_E = [m([97170.7, 436542.0]), m([97171.4, 436556.7])]; // oostwand van de doorgang (BGT-pand)
const EAST_END = [m([97233.4, 436554.1]), m([97224.5, 436561.3]), m([97221.4, 436564.4])]; // oostkopgevel (3D BAG)
// Lage zuidwestvleugel voor de boog (BAG/BGT), overlapt de schijf.
const WING = [[97105.7, 436558.3], [97107.7, 436550.6], [97110.8, 436544.4], [97123.5, 436544.8], [97134.0, 436546.1], [97137.5, 436547.8], [97137.5, 436552.0], [97120.0, 436560.5], [97106.5, 436562.0]].map(m);
// Noordwestdriehoek (3D BAG 29,9), 1 m in de schijf doorgetrokken.
const NW_TRI = [[97105.4, 436565.0], [97107.0, 436562.5], [97120.0, 436569.8], [97118.5, 436571.0], [97107.9, 436578.0]].map(m);
// Kolommen onder de vleugel en de driehoek (BGT-pandvlakjes van 0,2 m²), als 0,9 m vierkant.
const COLUMNS = [[97108.2, 436550.6], [97111.0, 436545.0], [97119.4, 436545.1], [97127.4, 436545.7], [97135.3, 436546.8], [97106.3, 436557.4], [97105.7, 436564.5], [97106.5, 436571.5], [97108.2, 436577.3], [97113.5, 436574.0], [97133.0, 436564.5]].map(m);
// Toren, paviljoen, luifel en parkeerdek aan de noordzijde (BGT-pand, 3D BAG); de delen overlappen elkaar.
const TOWER_RECT = rect(...m([97173.0, 436554.5]), ...m([97178.6, 436571.5]));
const PAVILION = rect(...m([97172.3, 436571.2]), ...m([97180.9, 436578.5]));
const CANOPY_A = rect(...m([97178.3, 436562.3]), ...m([97192.0, 436571.0]));
const CANOPY_B = rect(...m([97191.7, 436557.0]), ...m([97209.4, 436564.3]));
const CANOPY_POSTS = [[97191.2, 436570.2], [97208.6, 436563.5]].map(m);
const DECK_RING = [[97233.4, 436554.1], [97240.0, 436556.8], [97240.2, 436560.6], [97260.3, 436559.6], [97261.1, 436576.5], [97180.5, 436580.4], [97180.4, 436578.1], [97174.9, 436578.6], [97172.4, 436569.8], [97172.4, 436560.0]].map(m);
// Trappenhuizen op het brugdeel en de opbouw op het oostelijke dak.
const CORES = [rect(...m([97140.5, 436553.0]), ...m([97146.8, 436559.0])), rect(...m([97155.1, 436552.7]), ...m([97160.8, 436556.2]))];
const PLANT_RECT = rect(...m([97179.7, 436545.2]), ...m([97181.8, 436552.2]));

// ---------- Romp ----------
const slab42 = (z0, z1) => keepSide(keepSide(ring(R_IN, R_OUT, z0, z1), ...WEST_END, [0, -10]), ...FACE42_E, [-20, -10]);
const slabEast = (z0, z1) => {
  let s = keepSide(ring(R_IN, R_OUT, z0, z1), ...PASSAGE_E, [40, -10]);
  s = keepSide(s, EAST_END[0], EAST_END[1], [40, -10]);
  return keepSide(s, EAST_END[1], EAST_END[2], [40, -10]);
};
const westBlock = slab42(BASE, z(SOFFIT) + 0.1).trimByPlane([-1, 0, 0], -PASSAGE_W); // tot de doorgang
const bridge = slab42(z(SOFFIT), z(WEST_ROOF));
const eastBlock = slabEast(BASE, z(EAST_ROOF));
const wing = prism(WING, z(L[1]), z(WING_ROOF));
const tri = prism(NW_TRI, z(L[1]), z(WING_ROOF));
const columns = COLUMNS.map(([x, y]) => prism(rect(x - 0.45, y - 0.45, x + 0.45, y + 0.45), BASE, z(L[1]) + 0.1));
// Lamellenband langs een boog: plaat van 1,25 m dik, 2,5 m naar binnen en 1,0 m buiten de gevel, onderkant
// buiten de gevel onder 45°. `out` = +1 als buiten de boog lucht is (zuidgevel), -1 als binnen (noordgevel).
function visor(r, out, a0, a1, zTop) {
  const parts = [];
  const step = 3 / r;
  for (let a = a0; a < a1; a += step) {
    const b = Math.min(a1, a + step + 0.2 / r);
    const pts = [];
    for (const t of [a, b]) {
      const P = (rr, h) => [...onArc(rr, t), h];
      pts.push(P(r - out * 2.5, zTop - 1.25), P(r - out * 2.5, zTop), P(r, zTop - 1.25), P(r + out, zTop), P(r + out, zTop - 0.25));
    }
    parts.push(Manifold.hull(pts));
  }
  return union(parts);
}
const aW_out = ang(WEST_END[0]), aW_in = ang(WEST_END[1]);
const a42_out = ang(FACE42_E[0]), a42_in = ang(FACE42_E[1]);
const aE_out = ang(EAST_END[0]), aE_in = ang(EAST_END[2]);
const visors = union([
  visor(R_OUT, 1, aW_out + 0.5 / R_OUT, a42_out - 0.3 / R_OUT, z(WEST_BAND)),
  visor(R_IN, -1, aW_in + 0.5 / R_IN, a42_in - 0.3 / R_IN, z(WEST_BAND)),
  visor(R_OUT, 1, a42_out + 0.3 / R_OUT, aE_out - 0.5 / R_OUT, z(EAST_BAND)),
  visor(R_IN, -1, a42_in + 0.3 / R_IN, aE_in - 0.5 / R_IN, z(EAST_BAND)),
]);
// Borstwering van 1 m langs de westkopgevel (3D BAG 42-43,3) en van 0,9 m op de lage vleugel (DSM 30,0-30,6).
const westParapet = keepSide(keepSide(ring(R_IN, R_OUT, z(WEST_ROOF) - 0.1, z(WEST_BAND)), ...WEST_END, [0, -10]), ...offsetLine(...WEST_END, 1.0, [0, -10]), WEST_END[0]);
const wingParapet = prism(WING, z(WING_ROOF) - 0.1, z(WING_ROOF) + 0.9).subtract(Manifold.extrude(new CrossSection([ccw(WING)]).offset(-1.0, "Miter"), 5).translate([0, 0, z(WING_ROOF) - 1]));
const cores = CORES.map((r) => prism(r, z(WEST_ROOF) - 0.1, z(CORE)));
const tower = prism(TOWER_RECT, BASE, z(TOWER));
const plant = prism(PLANT_RECT, z(EAST_ROOF) - 0.1, z(PLANT));

let body = union([westBlock, bridge, eastBlock, wing, tri, ...columns, visors, westParapet, wingParapet, ...cores, tower, plant]);

// ---------- Gevels: vensterbanden per laag ----------
// Straal van 3 m buiten naar 1 m binnen de gevel; buitengevel als de straal de gevel op circa 3 m raakt.
function exposed(solid, from, to) {
  const hit = solid.rayCast(from, to)[0];
  if (!hit) return false;
  const at = Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.9 && at < 3.1;
}
// Band langs een boog op straal r; `out` = +1 als buiten de boog lucht is (zuidgevel), -1 als binnen (noordgevel).
// Per 2,5 m getest; alleen stukken van minstens 0,9 m buitengevel worden gesneden, als overlappende omhulsels.
function arcBand(solid, r, out, a0, a1, lo, hi, cuts, depth = DEPTH) {
  const step = 2.5 / r;
  // Een koorde over een lange boog ligt binnen de gevel; daarom per 2,5 m een eigen omhulsel, licht overlappend.
  const seg = (s0, s1) => {
    const n = Math.max(1, Math.ceil(((s1 - s0) * r) / 2.5));
    for (let k = 0; k < n; k++) {
      const u0 = s0 + ((s1 - s0) * k) / n, u1 = Math.min(s1, s0 + ((s1 - s0) * (k + 1)) / n + 0.1 / r);
      const pts = [];
      for (const t of [u0, u1]) {
        const P = (dr, h) => [...onArc(r + out * dr, t), h];
        pts.push(P(0.25, lo), P(-depth, lo), P(0.25, hi + 0.25), P(-depth, hi - depth));
      }
      cuts.push(Manifold.hull(pts));
    }
  };
  let start = null, prev = a0;
  for (let a = a0; ; a += step) {
    const t = Math.min(a, a1);
    const ok = [lo + 0.05, hi - 0.05].every((h) => exposed(solid, [...onArc(r + out * 3, t), h], [...onArc(r - out * 1, t), h]));
    if (ok && start === null) start = t;
    if (!ok && start !== null) {
      if ((prev - start) * r >= 0.9) seg(start, prev);
      start = null;
    }
    prev = t;
    if (t >= a1) break;
  }
  if (start !== null && (a1 - start) * r >= 0.9) seg(start, a1);
}
// Band langs een rechte gevel a→b (lucht rechts van a→b).
function lineBand(solid, a, b, lo, hi, cuts, depth = DEPTH) {
  const Ln = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / Ln, (b[1] - a[1]) / Ln], n = [d[1], -d[0]];
  const P = (s, dd, h) => [a[0] + d[0] * s - n[0] * dd, a[1] + d[1] * s - n[1] * dd, h];
  let start = null;
  const seg = (s0, s1) => cuts.push(Manifold.hull([P(s0, -0.25, lo), P(s1, -0.25, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.25, hi + 0.25), P(s1, -0.25, hi + 0.25), P(s0, depth, hi - depth), P(s1, depth, hi - depth)]));
  for (let s = 0.6; s <= Ln - 0.6 + 1e-9; s += 0.5) {
    const ok = [lo + 0.05, hi - 0.05].every((h) => exposed(solid, P(s, -3, h), P(s, 1, h)));
    if (ok && start === null) start = s;
    if (!ok && start !== null) {
      if (s - 0.5 - start >= 0.9) seg(start, s - 0.5);
      start = null;
    }
  }
  if (start !== null && Ln - 0.6 - start >= 0.9) seg(start, Ln - 0.6);
}
const cuts = [];
// Vensterband per laag: glas van +1,3 tot +3,1 m boven de vloer (render: band van circa 45 % van de laaghoogte).
const bandZ = (k) => [z(L[k] + 1.3), z(L[k] + 3.1)];
const westFloors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // 4,7 … 40,7 (bovenste laag 37,1-40,7 alleen in het westdeel)
const eastFloors = [1, 2, 3, 4, 5, 6, 7, 8]; // 8,3 … 37,1; onderste laag aan het plein is de glazen entreelaag
const wingFloors = [1, 2, 3, 4, 5, 6];
// Zuidboog (lucht buiten) en noordboog (lucht binnen); exposed() laat de delen achter de vleugel, de driehoek, de
// toren, het paviljoen en het dek vanzelf dicht en stopt de banden bij de doorgang.
for (const k of westFloors) {
  arcBand(body, R_OUT, 1, aW_out, a42_out, ...bandZ(k), cuts);
  arcBand(body, R_IN, -1, aW_in, a42_in, ...bandZ(k), cuts);
}
for (const k of eastFloors) {
  arcBand(body, R_OUT, 1, a42_out, aE_out, ...bandZ(k), cuts);
  arcBand(body, R_IN, -1, a42_in, aE_in, ...bandZ(k), cuts);
}
// Glazen entreelaag van het oostdeel (4,7-8,3), 0,5 m diep, aan de boulevardkant en aan het plein.
arcBand(body, R_OUT, 1, a42_out, aE_out, z(L[0] + 0.5), z(L[1] - 0.6), cuts, 0.5);
arcBand(body, R_IN, -1, a42_in, aE_in, z(L[0] + 0.5), z(L[1] - 0.6), cuts, 0.5);
// Kopgevels, doorgangwanden, vleugel en driehoek (lucht rechts van a→b).
const straight = [
  [WEST_END[1], WEST_END[0], westFloors],
  [[PASSAGE_W, -20], [PASSAGE_W, 10], [1, 2, 3]], // westwand doorgang, tot het brugdeel
  [PASSAGE_E[1], PASSAGE_E[0], [1, 2, 3]], // oostwand doorgang
  [FACE42_E[0], FACE42_E[1], [9]], // sprong 37,1 → 42 boven het oostdeel
  [EAST_END[0], EAST_END[1], eastFloors],
  [EAST_END[1], EAST_END[2], eastFloors],
  [WING[0], WING[1], wingFloors], [WING[1], WING[2], wingFloors], [WING[2], WING[3], wingFloors], [WING[3], WING[4], wingFloors], [WING[4], WING[5], wingFloors],
  [NW_TRI[4], NW_TRI[0], wingFloors], [NW_TRI[3], NW_TRI[4], wingFloors],
];
for (const [a, b, floors] of straight) for (const k of floors) lineBand(body, a, b, ...bandZ(k), cuts);
// Glazen toren: verticale glasstroken op de noord-, west- en oostkant, 0,4 m diep.
{
  const r = ccw(TOWER_RECT);
  for (let i = 0; i < 4; i++) lineBand(body, r[i], r[(i + 1) % 4], z(L[0] + 0.6), z(TOWER) - 0.8, cuts, 0.4);
}
console.log("gevelnissen", cuts.length);
body = body.subtract(union(cuts));

// ---------- Entree en parkeerdek (één node, overlapt in de schijf en de toren) ----------
const deckPoly = (() => {
  // Van de oostkop langs de buitenrand van het dek naar de toren, dan 0,5 m in de schijf terug naar de kop.
  const b0 = ang(DECK_RING[DECK_RING.length - 1]), b1 = ang(EAST_END[2]);
  const inner = Array.from({ length: 31 }, (_, k) => onArc(R_IN + 0.5, b0 + ((b1 - b0) * k) / 30));
  return [...DECK_RING, ...inner, EAST_END[1], EAST_END[0]];
})();
const deck = prism(deckPoly, BASE, z(DECK));
const pavilion = prism(PAVILION, BASE, z(PAV_ROOF));
const canopy = union([prism(CANOPY_A, z(CANOPY[0]), z(CANOPY[1])), prism(CANOPY_B, z(CANOPY[0]), z(CANOPY[1]))]);
const posts = CANOPY_POSTS.map(([x, y]) => prism(rect(x - 0.45, y - 0.45, x + 0.45, y + 0.45), z(DECK) - 0.1, z(CANOPY[0]) + 0.1));
let entrance = union([deck, pavilion, canopy, ...posts]);
const entranceCuts = [];
// Paviljoen: glazen band per laag rondom (plein 4,7-8,3 en 8,3-10,5).
for (const [lo, hi] of [[L[0] + 0.6, L[1] - 0.4], [L[1] + 0.5, PAV_ROOF - 0.5]]) {
  const r = ccw(PAVILION);
  for (let i = 0; i < 4; i++) lineBand(entrance, r[i], r[(i + 1) % 4], z(lo), z(hi), entranceCuts, 0.4);
}
entrance = entrance.subtract(union(entranceCuts));

const nodes = [
  ["schijf", body],
  ["entree-en-parkeerdek", entrance],
].map(([label, solid]) => {
  const parts = solid.decompose();
  if (parts.length !== 1) throw new Error(`${label}: ${parts.length} losse delen`);
  console.log(label, solid.status(), "genus", solid.genus(), "driehoeken", solid.numTri());
  return [`building:${slug}-${label}`, solid];
});

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "XO Hotels Rivium (Braingate)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 48.7, // NAP 5,2 + geoïde NLGEO2018 circa 43,5 (ijking Rivium Quadrant)
    groundOffsetMetres: -0.15,
    // Rijbaan en voetpad in en direct ten noorden van de doorgang (AHN-DTM 5,2-5,4); het maaiveld ligt aan de
    // oost- en zuidkant 6 m lager en aan de westkant 1 tot 4 m lager.
    groundSamplePoints: [[-6, -2], [6, -2], [-6, 10], [6, 10]],
    replacesBuildings: ["NL.IMBAG.Pand.0502100000021132"],
    description:
      "Voormalig kantoorgebouw Braingate aan de Rivium Boulevard 301-321 (2003), in verbouwing tot XO Hotels Rivium: een gebogen schijf (zuidgevel een cirkelboog van 137,8 m straal, noordgevel 123,5 m) die als brug over de straat naar de Rivium Boulevard staat. Doorgang van 30,5 m breed onder een brugdeel vanaf NAP +19,1 m; westelijk deel tot +42,0 m met een lamellenband tot +43,25 m, een lage zuidwestvleugel en noordwestdriehoek tot +29,9 m op kolommen; oostelijk deel tot +37,1 m met band tot +38,3 m, een glazen lift- en trappentoren tot +41,5 m aan de noordgevel bij de doorgang, entreepaviljoen met luifel en een parkeerdek op +4,6 m aan de noordzijde. Vensterbanden per laag van 3,6 m als blinde nissen. Oorsprong op de rijbaan in de doorgang (NAP +5,2 m), assen langs RD. Maten uit BAG, BGT, AHN en 3D BAG; verdiepingen, de hoogte van de doorgang en de gevelbanden geschat uit de luchtfoto en de foto's en renders van de gemeente.",
    realWorld: {
      built: 2003,
      groundNapM: GROUND,
      westRoofNapM: WEST_ROOF,
      westBandNapM: WEST_BAND,
      eastRoofNapM: EAST_ROOF,
      eastBandNapM: EAST_BAND,
      wingRoofNapM: WING_ROOF,
      towerNapM: TOWER,
      passageSoffitNapM: SOFFIT,
      passageWidthM: 30.5,
      deckNapM: DECK,
      arcCentreRd: [97177.78, 436679.39],
      arcRadiiM: [R_IN, R_OUT],
      storeyHeightM: 3.6,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0502100000021132 (bouwjaar 2003; Rivium Boulevard 301, logies-, bijeenkomst- en kantoorfunctie), BGT (pand-vlakken, kolommen en wegdelen in de doorgang), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG LoD2.2 (AHN5 2023)",
      "https://capellebouwtaandestad.nl/project/rivium-boulevard-301-321 (gemeente Capelle aan den IJssel: transformatie van het Braingate-gebouw naar hotel, schuine luchtfoto en renders van JaW architecten)",
      "https://xohotels.com/hotel/xo-hotels-rivium/ (adres, parkeergarage aan de achterzijde)",
      "https://deskfinder.nl/kantoorruimte-huren/capelle-aan-den-ijssel/rivium-boulevard-301-320/ (business centre Braingate)",
    ],
  },
});

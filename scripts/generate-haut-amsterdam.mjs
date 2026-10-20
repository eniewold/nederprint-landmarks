// HAUT (Amstelkwartier, Amsterdam, 2021; Team V Architectuur, Arup): houten woontoren van 21 lagen
// aan de Amstel, met een lage vleugel en een plint op hetzelfde BAG-pand. De toren is in plan een
// vijfhoek: zuid-, west- en noordgevel haaks op elkaar en een schuine noordoostgevel langs de BAG-lijn,
// die bij de zuidoostpunt een scherpe hoek van 40° maakt. Kenmerkend zijn de witte vloerranden per
// verdieping met daartussen glas, de balkons die per verdieping verspringen (vooral op de zuidgevel),
// enkele dubbelhoge loggia's, een verspringing van 1,5 m in de noordgevel onder een doorlopende dakrand. De
// scherpe punt van de toren stopt lager (terrassen op NAP +57,0 en +60,0 m). Aan de zuidkant ligt een
// plint van drie lagen tot +12,85 m en aan de zuidoostkant een lage vleugel van negen lagen tot +30,65 m
// met een trappenhuis. Contouren uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023) en het AHN-DSM
// 0,5 m (dakranden, balkons op de bovenste laag), gevelopbouw uit
// foto's (Commons, Tim Bindels 2021).
import { CrossSection, Manifold, ccw, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "haut-amsterdam";
// Gebouwstelsel: u langs de zuidgevel van de plint en de lange zuidgevel van de toren (BAG-zijde A–B,
// −28,7° op RD-oost; de west- en noordgevel staan daar haaks op: BAG-zijden −28,7°, 61,3° en 151,3°),
// v naar het noordnoordoosten. Oorsprong midden in het BAG-pand.
const ORIGIN = [123120.0, 483716.0];
const ANGLE = -28.7;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.61; // NAP, 3D BAG b3_h_maaiveld 0,61; AHN-DTM op straat en plein rondom 0,4–0,8
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const local = ([x, y]) => [(x - ORIGIN[0]) * AXIS[0] + (y - ORIGIN[1]) * AXIS[1], -(x - ORIGIN[0]) * AXIS[1] + (y - ORIGIN[1]) * AXIS[0]];

// BAG-contour van pand 0363100012246300 (RD): A (zuidwest), B, C (oostpunt), D, E (noordwest).
const BAG_RD = [[123095.27, 483708.63], [123122.21, 483693.85], [123145.02, 483702.71], [123135.31, 483727.69], [123112.54, 483740.15]];
const [, BAG_B, BAG_C, BAG_D] = BAG_RD.map(local); // B (12,57; −18,36), C (28,33; 0,36), D (7,82; 17,60)

// Stelsel langs de noordoostgevel (BAG-zijde C–D, 50° gedraaid): s vanaf C naar D, n naar buiten.
const DIAG_LEN = Math.hypot(BAG_D[0] - BAG_C[0], BAG_D[1] - BAG_C[1]);
const DD = [(BAG_D[0] - BAG_C[0]) / DIAG_LEN, (BAG_D[1] - BAG_C[1]) / DIAG_LEN];
const DN = [DD[1], -DD[0]];
const diag = (s, n) => [BAG_C[0] + DD[0] * s + DN[0] * n, BAG_C[1] + DD[1] * s + DN[1] * n];
// Snijpunt van de lijnen p1–p2 en q1–q2.
const meet = ([p1, p2], [q1, q2]) => {
  const d = [p2[0] - p1[0], p2[1] - p1[1]], e = [q2[0] - q1[0], q2[1] - q1[1]];
  const t = ((q1[0] - p1[0]) * e[1] - (q1[1] - p1[1]) * e[0]) / (d[0] * e[1] - d[1] * e[0]);
  return [p1[0] + d[0] * t, p1[1] + d[1] * t];
};
const vLine = (u) => [[u, -50], [u, 50]];

// ---------- Toren ----------
// Dak NAP +72,23 m (3D BAG 72,23–72,31, 70e percentiel 72,23; DSM 72,2–72,4), dakrand rondom tot
// +73,6 m (DSM 73,4–73,7 langs de zuid- en noordoostrand), installatie/dakframe tot +73,65 m (3D BAG-vlak
// 85, DSM 73,7). Bovenste vloer op +68,9 m (3D BAG-vlak 93, DSM 68,9 op de balkons).
const ROOF = 72.23, PARAPET = 73.6, PARAPET_W = 0.9, FRAME_TOP = 73.65, BAND_TOP = 0.9;
// Gevels uit het DSM (dakrand) en de 3D BAG: zuidgevel van v = 0,80 in het westen naar 0,40 bij de
// oostpunt C (3D BAG-ring 0,76 … 0,37), westgevel u = −18,15 (BAG en 3D BAG), noordgevel v = 17,45 (DSM-rand
// 17,25–17,5, BAG 17,60), noordoostgevel 0,6 m binnen de BAG-lijn C–D (DSM-rand n = −0,5 … −1,0).
const S_LINE = [[-18.15, 0.8], [BAG_C[0], 0.4]];
const W_U = -18.15, N_V = 17.45;
const DIAG_N = -0.6;
const DIAG_LINE = [diag(0, DIAG_N), diag(10, DIAG_N)];
const hLine = (v) => [[0, v], [1, v]];
// Verspringing in de noordgevel (foto vanaf metrostation Spaklerweg: in alle vloerranden een binnenhoek met
// een schuin verbindingsstuk, de dakrand loopt recht door): vanaf de noordoosthoek tot u = −3,0 staan de
// lagen 1,5 m terug, met een verbindingsstuk onder 45° tot u = −4,5; de dakrand (0,9 m) kraagt erboven
// uit met een onderkant onder 45°. Diepte en plaats zijn op de foto geschat; het DSM ziet alleen het dak.
const N_SET = 1.5, N_STEP_U0 = -3.0, N_STEP_U1 = -4.5;
// Oostpunt: het hoofddak stopt bij u = 23,6 (DSM: 72 m tot u 23,5, 3D BAG-hoek 23,3–23,9); daarvoor een
// strook tot +60,0 m (3D BAG-vlak 90, DSM 60,0) tot u = 25,0 en de scherpe punt tot +57,0 m (3D BAG-vlak 88).
const EAST_U = 23.6, SLICE_U = 25.0, SLICE_TOP = 60.0, TIP_TOP = 57.0;
const TIP = meet(S_LINE, DIAG_LINE);
const TOWER_FULL = [
  [W_U, meet(S_LINE, vLine(W_U))[1]],
  meet(S_LINE, vLine(EAST_U)),
  meet(DIAG_LINE, vLine(EAST_U)),
  meet(DIAG_LINE, hLine(N_V)),
  [W_U, N_V],
];
const TOWER = [
  ...TOWER_FULL.slice(0, 3),
  meet(DIAG_LINE, hLine(N_V - N_SET)),
  [N_STEP_U0, N_V - N_SET],
  [N_STEP_U1, N_V],
  [W_U, N_V],
];
const SLICE = [meet(S_LINE, vLine(EAST_U - 0.1)), meet(S_LINE, vLine(SLICE_U)), meet(DIAG_LINE, vLine(SLICE_U)), meet(DIAG_LINE, vLine(EAST_U - 0.1))];
const TIP_POLY = [meet(S_LINE, vLine(SLICE_U - 0.1)), TIP, meet(DIAG_LINE, vLine(SLICE_U - 0.1))];
// Dakframe op het dak (3D BAG-vlak 85; op de foto een open portaal, hier dicht).
const FRAME = [[15.7, 9.83], [16.56, 10.26], [13.8, 12.57], [11.22, 9.27], [13.58, 7.02]];
// Dakterras in de bovenste laag aan de zuidkant: 3D BAG-vlak 93 (+68,9 m) loopt tot v = 2,06, 1,3 m de
// toren in, van u 4,7 tot 10,2.
const TERRACE = { u0: 4.9, u1: 10.0, v1: 2.05, floor: 68.9 };

// Verdiepingen: begane grond tot +6,2 m, daarboven lagen van 3,3 m tot de bovenste vloer op +68,9 m
// (20 lagen boven de begane grond, Wikipedia: 21 verdiepingen) en het dak op +72,23 m. Plint en vleugel
// volgen hetzelfde raster: plintdak +12,85 = vloer +12,8, vleugel 8 lagen tot +29,3 met dakrand +30,65.
const FLOOR1 = 6.2, STOREY = 3.3, FLOORS = 20;
const floorNap = (k) => (k === 0 ? GROUND : FLOOR1 + STOREY * (k - 1));
const LEVELS = [...Array.from({ length: FLOORS + 1 }, (_, k) => floorNap(k)), ROOF];

// ---------- Plint en lage vleugel ----------
// Plint +12,85 m (3D BAG-vlak 92: 12,74–12,93) op de BAG-contour ten zuiden van de toren; vleugel
// +30,65 m (3D BAG-vlak 94: 30,58–30,72) tussen de toren, de BAG-zijde B–C en de lijn (4,03; −0,29)–
// (17,39; −12,63) uit de 3D BAG. Trappenhuis op de hoek van plint en vleugel: +27,4 en +18,5 m (3D BAG-
// vlakken 83 en 82).
const PLINTH_TOP = 12.85, WING_TOP = 30.65;
const PLINTH = [[W_U, 1.2], [W_U, -17.69], [-17.61, -17.81], [-17.61, -18.33], BAG_B, [17.39, -12.63], [12.13, -7.02], [4.03, -0.29], [2.96, 0.6], [2.4, 1.2]];
const WING = [[2.4, 1.2], [2.96, 0.6], [4.03, -0.29], [12.13, -7.02], [17.39, -12.63], BAG_C, meet([diag(0, 0), diag(10, 0)], hLine(1.2))];
const STAIRS = [
  { poly: [[13.16, -7.88], [12.13, -7.02], [10.74, -8.93], [11.74, -9.76]], top: 27.4 },
  { poly: [[12.79, -10.63], [15.52, -9.84], [13.16, -7.88], [11.74, -9.76]], top: 18.5 },
];

// ---------- Opbouw ----------
const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (sec, z0, z1) => Manifold.extrude(sec, z1 - z0).translate([0, 0, z0]);
const prism = (poly, z0, z1) => prismCs(cs(poly), z0, z1);
const fullCs = cs(TOWER_FULL);
// Dakrand boven de verspringing: 0,9 m dik op de gevellijn, onderkant onder 45° terug naar de lagen.
const capPts = [];
for (const [u, v] of [[N_STEP_U1 - 0.2, N_V], [N_STEP_U0, N_V], meet(DIAG_LINE, hLine(N_V))]) capPts.push([u, v, z(ROOF)], [u, v, z(ROOF) - BAND_TOP]);
for (const [u, v] of [[N_STEP_U0 - 0.2, N_V - N_SET - 0.2], meet(DIAG_LINE, hLine(N_V - N_SET - 0.2))]) capPts.push([u, v, z(ROOF)], [u, v, z(ROOF) - BAND_TOP - N_SET - 0.2]);
const tower = union([
  prism(TOWER, BASE, z(ROOF)),
  Manifold.hull(capPts).intersect(prismCs(fullCs, BASE, z(ROOF))),
  prismCs(fullCs.subtract(fullCs.offset(-PARAPET_W, "Miter")), z(ROOF) - 0.1, z(PARAPET)),
  prism(FRAME, z(ROOF) - 0.1, z(FRAME_TOP)),
  prism(SLICE, BASE, z(SLICE_TOP)),
  prism(TIP_POLY, BASE, z(TIP_TOP)),
]).subtract(prism([[TERRACE.u0, -1], [TERRACE.u1, -1], [TERRACE.u1, TERRACE.v1], [TERRACE.u0, TERRACE.v1]], z(TERRACE.floor), z(PARAPET) + 1));
const low = union([
  prism(PLINTH, BASE, z(PLINTH_TOP)),
  prism(WING, BASE, z(WING_TOP)),
  ...STAIRS.map((s) => prism(s.poly, BASE, z(s.top))),
]);
const body = union([tower, low]);

// ---------- Gevelreliëf ----------
// Elke laag: witte vloerrand van 0,9 m en daartussen een glasband als blinde nis van 0,35 m met een
// plafond onder 45°, rondom doorlopend en om de buitenhoeken heen (de glasgevels lopen om de hoeken).
// Een nis wordt alleen gesneden waar de gevel vrij ligt met ≥ 1 m materiaal erachter (stralen op het
// volume); waar plint of vleugel tegen de toren staat, stopt hij.
const DEPTH = 0.35, BAND = 0.9;
const edgesOf = (poly) => {
  const p = ccw(poly);
  return p.map((a, i) => {
    const prev = p[(i + p.length - 1) % p.length], b = p[(i + 1) % p.length], next = p[(i + 2) % p.length];
    const cross = (o, q, r) => (q[0] - o[0]) * (r[1] - q[1]) - (q[1] - o[1]) * (r[0] - q[0]);
    return { a, b, convexA: cross(prev, a, b) > 0, convexB: cross(a, b, next) > 0 };
  });
};
const frame = ({ a, b }) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const face = (s, h) => {
    const start = 3, from = P(s, -start, h), hits = body.rayCast(from, P(s, 12, h));
    if (!hits.length) return null;
    const dist = (q) => Math.hypot(q.position[0] - from[0], q.position[1] - from[1]);
    return { f: dist(hits[0]) - start, back: hits[1] ? dist(hits[1]) - dist(hits[0]) : Infinity };
  };
  const exposed = (s, hs, backMin = DEPTH + 1) => hs.every((h) => { const r = face(s, h); return r && Math.abs(r.f) < 0.25 && r.back >= backMin; });
  // Ligt een punt in het volume? Straal omhoog, oneven aantal snijpunten.
  const inside = (p) => body.rayCast(p, [p[0], p[1], 300]).length % 2 === 1;
  return { L, d, n, P, exposed, inside };
};
// Vrije stukken van een gevel tussen twee hoogtes, per 0,5 m afgetast.
function runs(edge, hs, backMin) {
  const { L, exposed } = frame(edge), out = [];
  let run = null;
  for (let s = 0.25; s <= L - 0.25 + 1e-9; s += 0.5) {
    if (exposed(s, hs, backMin)) run ? (run.s1 = s) : (run = { s0: s, s1: s });
    else if (run) { out.push(run); run = null; }
  }
  if (run) out.push(run);
  return out;
}
const cuts = [];
function bands(poly, levels) {
  for (const edge of edgesOf(poly)) {
    const { L, P, inside } = frame(edge);
    if (L < 3.5) continue;
    for (let k = 0; k + 1 < levels.length; k++) {
      const lo = z(levels[k]), hi = z(levels[k + 1]) - BAND;
      if (hi - lo < 0.9) continue;
      for (const r of runs(edge, [lo + 0.1, hi - 0.1])) {
        // Om een buitenhoek heen doorlopen; bij een binnenhoek of een aangebouwd volume stoppen.
        // (alleen als het hoekje achter de gevellijn voorbij de hoek lucht is).
        const mid = (lo + hi) / 2;
        const s0 = r.s0 <= 0.25 ? (edge.convexA && !inside(P(-0.4, 0.2, mid)) ? -0.8 : 0) : r.s0 + 0.3;
        const s1 = r.s1 >= L - 0.25 ? (edge.convexB && !inside(P(L + 0.4, 0.2, mid)) ? L + 0.8 : L) : r.s1 - 0.3;
        if (s1 - s0 < 0.9) continue;
        cuts.push(Manifold.hull([
          P(s0, -0.3, lo), P(s1, -0.3, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo),
          P(s0, -0.3, hi + 0.3), P(s1, -0.3, hi + 0.3), P(s0, DEPTH, hi - DEPTH), P(s1, DEPTH, hi - DEPTH),
        ]));
      }
    }
  }
}
bands(TOWER, LEVELS);
bands(SLICE, LEVELS);
bands(TIP_POLY, LEVELS);
bands(WING, LEVELS);
bands(PLINTH, LEVELS);

// Dubbelhoge loggia's ("gaten" in de gevel): 1,4 m diep over twee lagen, plafond onder 45°. Op de foto
// vanaf metrostation Spaklerweg glas over twee lagen zonder vloerrand bij de noordwesthoek; ligging en
// aantal op de andere gevels zijn geschat.
const LOGGIA_DEPTH = 1.4;
const towerEdges = edgesOf(TOWER);
const edgeAt = (pred) => towerEdges.find(pred);
const near = (x, y) => Math.abs(x - y) < 1e-6;
const S_EDGE = edgeAt((e) => Math.abs(e.a[1] - 0.8) < 0.1 && e.b[0] > 20);
const W_EDGE = edgeAt((e) => near(e.a[0], W_U) && near(e.b[0], W_U));
const N_EDGE = edgeAt((e) => near(e.a[1], N_V) && near(e.b[1], N_V)); // westelijk deel, s = 0 bij u = −4,5
const DIAG_EDGE = edgeAt((e) => near(e.a[0], EAST_U) && e.b[1] > N_V - N_SET - 0.01);
const LW = frame(W_EDGE).L, LN = frame(N_EDGE).L, LD = frame(DIAG_EDGE).L;
const LOGGIAS = [
  // [gevel, s0, s1 langs de gevel (m), onderste laag]
  [N_EDGE, LN - 5.4, LN - 0.9, 4], [N_EDGE, LN - 5.4, LN - 0.9, 10], [N_EDGE, LN - 5.4, LN - 0.9, 16],
  [W_EDGE, 6.0, 10.5, 7], [W_EDGE, 6.0, 10.5, 13],
  [DIAG_EDGE, LD - 6.0, LD - 1.5, 6], [DIAG_EDGE, LD - 6.0, LD - 1.5, 13],
];
for (const [edge, s0, s1, k] of LOGGIAS) {
  const { P } = frame(edge);
  const lo = z(floorNap(k)), hi = z(floorNap(k + 2)) - BAND;
  cuts.push(Manifold.hull([
    P(s0, -0.3, lo), P(s1, -0.3, lo), P(s0, LOGGIA_DEPTH, lo), P(s1, LOGGIA_DEPTH, lo),
    P(s0, -0.3, hi + 0.3), P(s1, -0.3, hi + 0.3), P(s0, LOGGIA_DEPTH, hi - LOGGIA_DEPTH), P(s1, LOGGIA_DEPTH, hi - LOGGIA_DEPTH),
  ]));
}

// ---------- Verspringende balkons ----------
// Dichte platen op de vloerrand (bovenkant = vloer, voorkant 0,9 m) met een onderkant onder 47° terug
// naar het glas, zodat ze zonder steun printen. Noordoostgevel 1,6 m diep (foto: diepe, per laag
// verspringende balkons; DSM: platen tot 0,5–1 m buiten de BAG-lijn), zuidgevel 1,8 m (DSM: balkons op de
// bovenste laag tot v = −1,0 … −1,2 bij u −4,5…−1, 5,5…9 en 17…20,5), westgevel en westelijk deel van de
// noordgevel 1,0 m (DSM: platen op 40–66 m tot 0,5–1 m buiten de gevel). Per laag een tot drie balkons van
// 3,5–9 m op wisselende plaatsen; het patroon onder de bovenste laag is geschat.
const mulberry = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const balconies = [];
function balcony(edge, s0, s1, k, depth) {
  const { P, exposed } = frame(edge);
  const top = z(floorNap(k)), drop = (depth + DEPTH) * 1.07;
  // Geen balkon voor een dubbelhoge loggia: de loggia is het buitengedeelte van die woning.
  if (LOGGIAS.some(([e, l0, l1, lk]) => e === edge && s0 < l1 + 0.9 && s1 > l0 - 0.9 && k >= lk && k <= lk + 2)) return false;
  // Alleen aan een vrije gevel: van de voorkant van de plaat tot de voet van de schuine onderkant.
  if (![s0 + 0.3, (s0 + s1) / 2, s1 - 0.3].every((s) => exposed(s, [top - 0.45, top - BAND - drop + 0.3], 1))) return false;
  balconies.push(Manifold.hull([
    P(s0, DEPTH, top), P(s1, DEPTH, top), P(s0, -depth, top), P(s1, -depth, top),
    P(s0, -depth, top - BAND), P(s1, -depth, top - BAND), P(s0, DEPTH, top - BAND - drop), P(s1, DEPTH, top - BAND - drop),
  ]));
  return true;
}
function staggered(edge, depth, { seed, from = 1, slots = 3, top = [] }) {
  const { L } = frame(edge), rnd = mulberry(seed), slot = L / slots;
  let prev = [];
  for (let k = from; k <= FLOORS; k++) {
    if (k === FLOORS && top.length) { top.forEach(([s0, s1]) => balcony(edge, s0, s1, k, depth)); continue; }
    // Verspringen: een vak dat de laag eronder een balkon had, krijgt er nu meestal geen.
    const on = Array.from({ length: slots }, (_, i) => rnd() < (prev.includes(i) ? 0.25 : 0.7));
    if (!on.some(Boolean)) on[Math.floor(rnd() * slots)] = true;
    prev = [];
    on.forEach((o, i) => {
      if (!o) return;
      prev.push(i);
          const w = Math.min(slot - 1.0, 3.5 + rnd() * 5.5);
      const s0 = i * slot + 0.5 + rnd() * (slot - 1.0 - w);
      balcony(edge, Math.max(0, s0), Math.min(L, s0 + w), k, depth);
    });
  }
}
// Zuidgevel: s = u + 18,15; bovenste laag op de DSM-plaatsen.
staggered(S_EDGE, 1.8, { seed: 3, slots: 4, top: [[-4.5, -1.0], [5.5, 9.0], [17.0, 20.5]].map(([u0, u1]) => [u0 - W_U, u1 - W_U]) });
staggered(DIAG_EDGE, 1.6, { seed: 5, slots: 2 });
staggered(N_EDGE, 1.0, { seed: 7, slots: 2 });
staggered(W_EDGE, 1.0, { seed: 11, slots: 2 });

const building = body.subtract(union(cuts)).add(union(balconies));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`HAUT: ${parts.length} losse delen`);
console.log("HAUT", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length, "balkons", balconies.length);
console.log("punt", TIP.map((x) => x.toFixed(2)), "toren", TOWER.map((p) => p.map((x) => x.toFixed(2)).join(";")).join(" "));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:haut-toren-met-verspringende-balkons-plint-en-vleugel", building]],
  catalog: {
    name: "HAUT",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.494, // laagste PDOK-terrein op de groundSamplePoints (ellipsoïdisch), op straat ten noordoosten
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-21, 8], [-12, 21], [0, 21], [20, 20], [30, 10], [24, -8], [-8, -20.5], [-21, -8]],
    replacesBuildings: ["NL.IMBAG.Pand.0363100012246300"],
    description:
      "HAUT aan de Amstel in het Amstelkwartier: houten woontoren van 21 lagen tot NAP +72,23 m met een dakrand tot +73,6 m en een dakframe tot +73,65 m. Vijfhoekige plattegrond met een schuine noordoostgevel en een scherpe zuidoostpunt die lager stopt (+60,0 en +57,0 m); de oostelijke helft van de noordgevel staat 1,5 m terug onder een doorlopende dakrand; witte vloerranden met glasbanden als blinde nissen, per laag verspringende balkons (zuidgevel 1,8 m, noordoostgevel 1,6 m, westgevel en noordgevel 1,0 m), dubbelhoge loggia's en een dakterras in de bovenste laag. Plint van drie lagen tot +12,85 m en een lage vleugel tot +30,65 m met trappenhuis. BAG-contour, hoogtes uit de 3D BAG (AHN5 2023) en het AHN-DSM. Oorsprong midden in het BAG-pand, X-as langs de zuidgevel (−28,7° op RD-oost). Het balkonpatroon onder de bovenste laag, de dubbelhoge loggia's, de plaats van de verspringing en de verdiepingshoogtes zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      parapetNapM: PARAPET,
      roofFrameNapM: FRAME_TOP,
      topFloorNapM: 68.9,
      eastSliceNapM: SLICE_TOP,
      eastTipNapM: TIP_TOP,
      plinthNapM: PLINTH_TOP,
      lowWingNapM: WING_TOP,
      stairNapM: STAIRS.map((s) => s.top),
      storeys: { groundFloorTopNapM: FLOOR1, storeyM: STOREY, floorsAboveGround: FLOORS },
      northFaceSetbackM: N_SET,
      balconyDepthM: { south: 1.8, northEast: 1.6, north: 1.0, west: 1.0 },
      facadeAngleDegrees: ANGLE,
      estimatedBalconyPattern: true,
      estimatedLoggias: true,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012246300 (bouwjaar 2017 in de BAG; oplevering 2021), actuele orthoHR, AHN DSM/DTM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012246300",
      "https://nl.wikipedia.org/wiki/HAUT",
      "https://commons.wikimedia.org/wiki/File:HAUT_Amsterdam2.jpg",
      "https://commons.wikimedia.org/wiki/File:HAUT_Amsterdam.jpg",
    ],
  },
});

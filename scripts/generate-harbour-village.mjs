// Harbour Village (Jufferstraat / Bierstraat, Wijnhaveneiland, Rotterdam, 2001–2002; HM Architecten):
// twee woontorens op een eigen plint, elk een eigen BAG-pand. Toren Jufferstraat tot NAP +85,1 m
// (29 lagen), toren Bierstraat tot +71,6 m (24 lagen). De noord- en zuidgevels zijn gemetseld met
// loggia's per verdieping; de oost- en westgevels zijn van glas en staan schuin: de torens zijn in plan
// geen rechthoek (zuidgevels 16° gedraaid ten opzichte van het straatraster, oostgevels geknikt) en de
// glazen westgevel van de toren Jufferstraat helt naar binnen (aan de voet tot 4 m buiten de dakrand).
// Aan de noordkant van de toren Jufferstraat een lagere strook tot +77,0 m, aan de westkant van de
// toren Bierstraat een lagere vleugel tot +63,5 m met een geknikte glazen westgevel. De plinten
// (vijf lagen winkels en kantoren, parkeergarage) zijn platte blokken op de 3D BAG-hoogtes, met één
// lessenaarsdak tussen de torens. Contouren uit de BAG, hoogtes uit de 3D BAG (AHN5, 2023) en het
// AHN-DSM 0,5 m (dakranden), gevelvlakken uit DSM, luchtfoto en foto's.
import { CrossSection, Manifold, ccw, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "harbour-village";
// Gebouwstelsel: u langs het straatraster van het Wijnhaveneiland (18,1° linksom op RD-oost, gemeten
// op de BAG-gevels van beide panden en van Up:Town), v naar het noordnoordwesten.
const ORIGIN = [93078.0, 436840.0];
const ANGLE = 18.1;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 2.48; // NAP, 3D BAG b3_h_maaiveld 2,45 (Jufferstraat) en 2,51 (Bierstraat); AHN-DTM op straat 2,42–2,55
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const local = ([x, y]) => [(x - ORIGIN[0]) * AXIS[0] + (y - ORIGIN[1]) * AXIS[1], -(x - ORIGIN[0]) * AXIS[1] + (y - ORIGIN[1]) * AXIS[0]];

// BAG-contouren (RD, bovenaanzicht).
const BAG_JUFFER_RD = [[93070.201, 436857.411], [93047.354, 436849.905], [93053.186, 436834.4], [93052.263, 436834.297], [93054.163, 436828.667], [93055.694, 436815.555], [93058.266, 436816.372], [93065.522, 436818.731], [93066.423, 436819.024], [93066.238, 436819.595], [93067.736, 436820.109], [93068.275, 436818.452], [93069.774, 436813.843], [93070.818, 436810.634], [93071.861, 436807.431], [93086.702, 436812.292], [93086.005, 436814.398]];
const BAG_BIER_RD = [[93069.148, 436867.392], [93069.569, 436866.103], [93072.245, 436857.895], [93070.41, 436857.48], [93070.201, 436857.411], [93086.005, 436814.398], [93110.195, 436822.256], [93101.097, 436844.673], [93102.539, 436844.716], [93102.731, 436844.722], [93097.827, 436862.362], [93097.3, 436868.93], [93094.819, 436867.363], [93088.547, 436863.28], [93087.647, 436862.694], [93088.71, 436859.371], [93087.253, 436858.903], [93085.726, 436863.651], [93083.686, 436869.989], [93083.059, 436871.939]];
const BAG_JUFFER = BAG_JUFFER_RD.map(local);
const BAG_BIER = BAG_BIER_RD.map(local);

const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (sec, z0, z1) => Manifold.extrude(sec, z1 - z0).translate([0, 0, z0]);
const prism = (poly, z0, z1) => prismCs(cs(poly), z0, z1);
const ring3 = (poly, h) => poly.map(([u, v]) => [u, v, h]);
// Snijpunt van de lijnen p1–p2 en q1–q2.
const meet = ([p1, p2], [q1, q2]) => {
  const d = [p2[0] - p1[0], p2[1] - p1[1]], e = [q2[0] - q1[0], q2[1] - q1[1]];
  const t = ((q1[0] - p1[0]) * e[1] - (q1[1] - p1[1]) * e[0]) / (d[0] * e[1] - d[1] * e[0]);
  return [p1[0] + d[0] * t, p1[1] + d[1] * t];
};
const vAt = ([p1, p2], u) => p1[1] + ((p2[1] - p1[1]) * (u - p1[0])) / (p2[0] - p1[0]);
const uAt = ([p1, p2], v) => p1[0] + ((p2[0] - p1[0]) * (v - p1[1])) / (p2[1] - p1[1]);

// ---------- Toren Jufferstraat (pand 0599100000750224) ----------
// Dakvlak NAP +85,1 m (3D BAG 85,06–85,15, DSM 85), liftopbouw +87,7 m (3D BAG-vlak 105), noordstrook
// +77,0 m (3D BAG 76,99–77,04, DSM 77–78). Dakrand uit het DSM: noordrand v = −2,5 langs het raster,
// westrand u = −24,6, zuidrand 15,8° gedraaid (van (−24,6; −16,2) naar (−7,3; −21,1)), oostgevel geknikt
// (hoeken (−2,6; −2,5), (−4,6; −8,8), (−7,3; −21,1)). Aan de voet staat de westgevel op de BAG-lijn
// (−26,2 tot −28,8): de glazen westgevel helt 1,6–4,2 m naar binnen (DSM: schuin vlak met hoogtes die
// naar de toren toe oplopen, luchtfoto: glazen strook naast de dakrand).
const J_TOP = 85.1, J_LIFT = 87.7, J_NORTH = 77.0;
const J_WEST_FOOT = [[-26.18, -3.37], [-28.8, -16.31]]; // BAG-hoekpunten
const J_SOUTH = [[-24.6, -16.2], [-7.3, -21.1]];
const J_NORTH_EDGE = [[-26.2, 2.5], [-12.2, -1.47]]; // noordgevel van de lage strook (3D BAG-vlak 114), 16° gedraaid
const J_NE = [-2.6, -2.5], J_FOLD = [-4.6, -8.8], J_SE = J_SOUTH[1];
const J_TOP_RING = [[-24.6, -2.5], J_SOUTH[0], J_SE, J_FOLD, J_NE]; // linksom
const J_FOOT_SW = meet(J_WEST_FOOT, J_SOUTH);
const J_FOOT_RING = [[-26.2, -2.5], J_FOOT_SW, J_SE, J_FOLD, J_NE];
const J_LIFT_BOX = [[-16.7, -13.0], [-14.3, -13.0], [-14.3, -3.6], [-16.7, -3.6]];
// Noordstrook: driehoek tussen de noordrand van het hoofddak, de westgevel en de schuine noordgevel;
// 0,5 m in het hoofdvolume doorgetrokken.
const J_N_TIP = [uAt(J_NORTH_EDGE, -2.5), -2.5];
const J_N_TOP = [[-24.6, -3.0], [J_N_TIP[0] + 1.8, -3.0], J_N_TIP, [-24.6, vAt(J_NORTH_EDGE, -24.6)]];
const J_N_FOOT = [[-25.9, -3.0], [J_N_TIP[0] + 1.8, -3.0], J_N_TIP, [-26.24, vAt(J_NORTH_EDGE, -26.24)]];

// ---------- Toren Bierstraat (pand 0599100000750223) ----------
// Dakvlak NAP +71,6 m (3D BAG 71,57–71,61), installatie +74,13 en +74,77 m (3D BAG-vlakken 128 en 130),
// westvleugel +63,5 m (3D BAG-vlakken 132 en 139). Oostgevel en noordgevel op de BAG-contour (oostgevel
// geknikt in (25,79; 15,1), noordgevel 14,5° gedraaid); zuidgevel uit het DSM 15,4° gedraaid (van
// (7,5; 2,0) naar de oostgevel), westgevel van het hoofddak op u = 7,3 (DSM).
const B_TOP = 71.6, B_WING = 63.5;
const B_EAST = [[24.97, -3.2], [25.79, 15.1]];
const B_NE = [27.33, 21.5];
const B_NORTH = [B_NE, [16.22, 18.57]];
const B_SOUTH = [[7.5, 2.0], [22.0, -2.0]];
const B_WEST_U = 7.3;
const B_SE = meet(B_SOUTH, B_EAST);
const B_RING = [[B_WEST_U, vAt(B_SOUTH, B_WEST_U)], B_SE, B_EAST[1], B_NE, [B_WEST_U, vAt(B_NORTH, B_WEST_U)]];
// Westvleugel met geknikte glazen westgevel (3D BAG-hoekpunten (4,05; 2,53), (1,58; 9,02), (0,77; 15,79)).
const B_WING_RING = [[4.0, vAt(B_SOUTH, 4.0)], [B_WEST_U + 0.5, vAt(B_SOUTH, B_WEST_U + 0.5)], [B_WEST_U + 0.5, 16.6], [0.77, 15.79], [1.58, 9.02]];
const B_PLANT = [
  { poly: [[15.38, 2.9], [18.75, 2.97], [17.81, 15.0], [15.58, 14.9]], top: 74.13 },
  { poly: [[21.4, 2.1], [23.6, 2.1], [23.6, 5.2], [21.4, 5.2]], top: 74.77 },
];

// ---------- Plinten ----------
// Platte daken per deel uit de 3D BAG (LoD2.2) en het DSM, begrensd door de BAG-contour.
const PLINTH = [
  // Jufferstraat
  { pand: "J", poly: [[-30, -3.4], [-15.5, -3.4], [-15.5, 20], [-30, 20]], top: 17.2 }, // noordwestblok (3D BAG 17,10–17,26)
  { pand: "J", poly: [[-15.5, 20], [-13.3, 20], [-13.3, 9.1], [-8.2, 8.6], [-12.5, -1.4], [-15.5, -0.7]], top: 14.2 }, // 3D BAG 14,20–14,29
  { pand: "J", poly: [[-13.3, 20], [-1.0, 20], [-1.5, 10.9], [-8.2, 8.6], [-13.3, 9.1]], top: 11.4 }, // 3D BAG 11,27–11,72
  { pand: "J", poly: [[-12.5, -3.0], [-0.5, -3.0], [-1.5, 10.9], [-8.2, 8.6], [-12.5, -1.4]], top: 17.9 }, // DSM 17–19
  { pand: "J", poly: [[-30, -40], [5, -40], [5, -16], [-30, -16]], top: 11.5 }, // zuidblok (3D BAG 11,37–11,65)
  { pand: "J", poly: [[-9.5, -20.5], [0, -22.65], [0, -11.8], [-6.0, -11.5]], top: 14.2 }, // 3D BAG-vlak 99
  { pand: "J", poly: [[-6.0, -11.5], [0, -11.8], [0, -2.9], [-3.5, -3.0]], top: 18.0 }, // DSM 18
  // Bierstraat
  { pand: "B", poly: [[-3, 15.4], [7.09, 15.9], [7.05, 19.05], [14.73, 20.0], [14.73, 30], [-3, 30]], top: 10.2 }, // 3D BAG 10,07–10,27
  { pand: "B", poly: [[7.05, 16.32], [12.35, 16.76], [14.68, 17.58], [14.69, 19.85], [14.26, 21.34], [7.06, 19.82]], top: 17.3 }, // 3D BAG 17,21–17,31
  { pand: "B", poly: [[-3, 10.75], [-0.23, 10.71], [1.35, 12.63], [0.77, 15.79], [-3, 15.6]], top: 10.8 }, // 3D BAG 10,50–11,62
  { pand: "B", poly: [[-3, -6.1], [6.37, -0.06], [9.3, 0.0], [11.5, 1.0], [9.3, 4.0], [5.0, 12.0], [0.9, 12.6], [-3, 10.8]], top: 17.6 }, // 3D BAG 17,50–17,79
  { pand: "B", poly: [[-3, -40], [14.3, -40], [14.31, -5.6], [12.85, -5.6], [9.9, -4.28], [5.9, -12.44], [-3, -12.2]], top: 12.9 }, // 3D BAG 12,77–13,02
  { pand: "B", poly: [[12.35, -18.23], [14.31, -17.35], [14.32, -5.81], [12.85, -5.6]], top: 14.25 }, // 3D BAG-vlak 134
  { pand: "B", poly: [[14.29, -40], [30, -40], [30, -3.2], [14.74, -4.24], [15.1, -5.93], [14.32, -5.81]], top: 17.1 }, // 3D BAG 17,06–17,22
];
// Lessenaarsdak tussen de torens: z = 0,089 u − 0,2645 v + 16,81 (NAP), kleinste kwadraten op de
// 3D BAG-vlakken 135 en 144 (afwijking ≤ 0,7 m); van +17,3 m aan de noordkant tot +21,0 m in het zuiden.
const SLOPE = { poly: [[-3, -6.1], [-3, -12.3], [5.9, -12.44], [9.9, -4.28], [12.85, -5.6], [15.1, -5.93], [14.74, -4.24], [13.63, 0.44], [10.92, 1.32], [9.3, 0.0], [6.37, -0.06]], a: 0.089, b: -0.2645, c: 16.81 };

// ---------- Opbouw ----------
// 0,1 m over de gedeelde muur, zodat de plinten van beide panden elkaar overlappen.
const bagJ = cs(BAG_JUFFER).offset(0.1, "Miter"), bagB = cs(BAG_BIER).offset(0.1, "Miter");
const plinth = union(PLINTH.map((p) => prismCs(cs(p.poly).offset(0.05, "Miter").intersect(p.pand === "J" ? bagJ : bagB), BASE, z(p.top))));
// trimByPlane houdt de kant waar de normaal heen wijst: hier wat onder het dakvlak ligt.
const slopeBlock = (() => {
  const { a, b, c } = SLOPE, n = Math.hypot(a, b, 1);
  return prismCs(cs(SLOPE.poly).offset(0.05, "Miter").intersect(bagB), BASE, z(22)).trimByPlane([a / n, b / n, -1 / n], -(c - GROUND) / n);
})();

const juffer = union([
  Manifold.hull([...ring3(J_FOOT_RING, BASE), ...ring3(J_TOP_RING, z(J_TOP))]),
  Manifold.hull([...ring3(J_N_FOOT, BASE), ...ring3(J_N_TOP, z(J_NORTH))]),
  prism(J_LIFT_BOX, z(J_TOP) - 0.1, z(J_LIFT)),
]);
const bier = union([
  prism(B_RING, BASE, z(B_TOP)),
  prism(B_WING_RING, BASE, z(B_WING)),
  ...B_PLANT.map((p) => prism(p.poly, z(B_TOP) - 0.1, z(p.top))),
]);
const body = union([plinth, slopeBlock, juffer, bier]);

// ---------- Gevelreliëf ----------
// Blinde nissen van 0,35 m met een plafond onder 45° tussen verdiepingsranden van 0,9 m, elk op de
// werkelijke gevel gezet (straal vanuit het gebouwstelsel) en alleen waar de gevel over de hele nis
// vrij ligt met ≥ 1 m materiaal erachter. Glasgevels: verdiepingshoge glasvakken met verspringende
// stijlen (HM Architecten: verdiepingshoge panelen die per laag verspringen); baksteengevels: loggia's.
const DEPTH = 0.35, BAND = 0.9;
const PLINTH_LEVELS = [GROUND, 6.68, 9.31, 11.94, 14.57, 17.2]; // begane grond 4,2 m, vier lagen van 2,63 m
const storeys = (from, top, n) => [...Array.from({ length: n }, (_, k) => from + ((top - from) * k) / n), top];
const J_LEVELS = [...PLINTH_LEVELS.slice(0, -1), ...storeys(17.2, J_TOP, 24)]; // 29 lagen (Wikipedia), 2,83 m
const J_N_LEVELS = [...PLINTH_LEVELS.slice(0, -1), ...storeys(17.2, J_NORTH, 21)];
const B_LEVELS = [...PLINTH_LEVELS.slice(0, -1), ...storeys(17.2, B_TOP, 19)]; // 24 lagen (Wikipedia), 2,86 m
const B_W_LEVELS = [...PLINTH_LEVELS.slice(0, -1), ...storeys(17.2, B_WING, 16)];
const mulberry = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
// edges: lijst [a, b] met het gebouw links van a→b (linksom).
function niches(edges, levels, { niche, pier, margin = 1.0, minLen = 3.0, tol = 0.6, maxStorey = 3.6, seed }) {
  const rnd = mulberry(seed), cuts = [], start = tol + 3;
  for (const [a, b] of edges) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < minLen) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    const face = (s, h) => {
      const from = P(s, -start, h), hits = body.rayCast(from, P(s, 12, h));
      if (!hits.length) return null;
      const t = Math.hypot(hits[0].position[0] - from[0], hits[0].position[1] - from[1]);
      const t1 = hits[1] ? Math.hypot(hits[1].position[0] - from[0], hits[1].position[1] - from[1]) : Infinity;
      return { f: t - start, back: t1 - t };
    };
    for (let k = 0; k + 1 < levels.length; k++) {
      const z0 = z(levels[k]), z1 = z(levels[k + 1]);
      const lo = z0 + BAND / 2, hi = Math.min(z1 - BAND / 2, z0 + maxStorey - BAND / 2);
      if (hi - lo < 0.9) continue;
      let s = margin + rnd() * (pier[1] - pier[0]);
      while (true) {
        const w = niche[0] + rnd() * (niche[1] - niche[0]);
        if (s + w > L - margin) break;
        const s0 = s, s1 = s + w;
        s += w + pier[0] + rnd() * (pier[1] - pier[0]);
        const r = [s0, (s0 + s1) / 2, s1].map((t) => [lo + 0.05, hi - 0.05].map((h) => face(t, h)));
        if (r.flat().some((x) => !x || Math.abs(x.f) > tol || x.back < DEPTH + 1)) continue;
        if ([0, 1].some((j) => Math.abs(r[1][j].f - (r[0][j].f + r[2][j].f) / 2) > 0.15)) continue;
        if (Math.abs(r[0][0].f - r[0][1].f) > 0.6 || Math.abs(r[2][0].f - r[2][1].f) > 0.6) continue;
        const [[a0, a1], , [b0, b1]] = r.map((x) => x.map((y) => y.f));
        cuts.push(Manifold.hull([
          P(s0, a0 - 0.3, lo), P(s1, b0 - 0.3, lo), P(s0, a0 + DEPTH, lo), P(s1, b0 + DEPTH, lo),
          P(s0, a1 - 0.3, hi + 0.3), P(s1, b1 - 0.3, hi + 0.3), P(s0, a1 + DEPTH, hi - DEPTH), P(s1, b1 + DEPTH, hi - DEPTH),
        ]));
      }
    }
  }
  return cuts;
}
const ring = (pts) => pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);
const [jW, jS, jE1, jE2, jN] = ring(J_TOP_RING);
const [, , jNN] = ring(J_N_TOP); // schuine noordgevel van de lage strook
const [bS, bE1, bE2, bN, bW] = ring(B_RING);
const [, , , bW1, bW2] = ring(B_WING_RING);
const glass = { niche: [2.2, 3.4], pier: [0.9, 1.3] };
const brick = { niche: [3.6, 6.0], pier: [1.2, 1.8], margin: 1.5 };
const cuts = [
  // Westgevel Jufferstraat helt: de gevel ligt tot 4,2 m buiten de dakrand.
  ...niches([jW], J_LEVELS, { ...glass, tol: 4.6, seed: 3 }),
  ...niches([[[-24.6, vAt(J_NORTH_EDGE, -24.6)], [-24.6, -3.0]]], J_N_LEVELS, { ...glass, tol: 2.0, seed: 5 }),
  ...niches([jE1, jE2], J_LEVELS, { ...glass, tol: 0.6, seed: 7 }),
  ...niches([jS, jN], J_LEVELS, { ...brick, seed: 11 }),
  ...niches([jNN], J_N_LEVELS, { ...brick, tol: 0.8, seed: 13 }),
  ...niches([bE1, bE2, bW], B_LEVELS, { ...glass, seed: 17 }),
  ...niches([bW1, bW2], B_W_LEVELS, { ...glass, seed: 19 }),
  ...niches([bS, bN], B_LEVELS, { ...brick, seed: 23 }),
  // Plinten: glaspuien en kantoorramen.
  ...niches(ring(ccw(BAG_JUFFER)), PLINTH_LEVELS, { niche: [2.4, 3.6], pier: [0.9, 1.3], minLen: 3, tol: 0.4, maxStorey: 4.2, seed: 29 }),
  ...niches(ring(ccw(BAG_BIER)), PLINTH_LEVELS, { niche: [2.4, 3.6], pier: [0.9, 1.3], minLen: 3, tol: 0.4, maxStorey: 4.2, seed: 31 }),
];

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Harbour Village: ${parts.length} losse delen`);
console.log("Harbour Village", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);
console.log("J voet ZW", J_FOOT_SW.map((x) => x.toFixed(2)), "B ZO", B_SE.map((x) => x.toFixed(2)), "J noordpunt", J_N_TIP.map((x) => x.toFixed(2)));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:harbour-village-twee-torens-met-schuine-glasgevels-en-plinten", building]],
  catalog: {
    name: "Harbour Village",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 46.026, // laagste PDOK-terrein op de Jufferstraat (ellipsoïdisch), NAP circa +2,5
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-32, 0], [-32, -10], [-31, -25], [30, 0], [30, -15], [-15, -33]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000750224", "NL.IMBAG.Pand.0599100000750223"],
    description:
      "Harbour Village op het Wijnhaveneiland: toren Jufferstraat tot NAP +85,1 m met liftopbouw tot +87,7 m en een lagere noordstrook tot +77,0 m, toren Bierstraat tot +71,6 m met installaties tot +74,77 m en een westvleugel tot +63,5 m. Gemetselde noord- en zuidgevels met loggia's, schuine glazen oost- en westgevels: zuidgevels 16° gedraaid op het straatraster, oostgevels geknikt, de westgevel van de toren Jufferstraat helt 1,6–4,2 m naar binnen, de westvleugel van de toren Bierstraat heeft een geknikte glasgevel. Plinten van vijf lagen als platte blokken (+10,2 tot +18,0 m) met een lessenaarsdak tussen de torens (+17,3 tot +21,0 m). BAG-contouren, hoogtes uit de 3D BAG (AHN5 2023) en het AHN-DSM. Oorsprong tussen de twee BAG-panden, X-as langs het straatraster (18,1° op RD-oost). Verdiepingshoogtes, de helling van de westgevel, de knik in de oostgevel van de toren Jufferstraat en het nissenpatroon zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      jufferstraat: { roofNapM: J_TOP, liftNapM: J_LIFT, northStripNapM: J_NORTH, storeys: 29, westFaceLeanM: [1.6, 4.2] },
      bierstraat: { roofNapM: B_TOP, plantNapM: B_PLANT.map((p) => p.top), westWingNapM: B_WING, storeys: 24 },
      plinthRoofsNapM: [...new Set(PLINTH.map((p) => p.top))].sort((a, b) => a - b),
      slopedPlinthRoofNapM: [17.3, 21.0],
      southFacadeRotationDegrees: 15.8,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
      estimatedWestLean: true,
    },
    sources: [
      "PDOK BAG panden 0599100000750224 (bouwjaar 2002) en 0599100000750223 (bouwjaar 2002), actuele orthoHR, AHN DSM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000750224",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000750223",
      "https://nl.wikipedia.org/wiki/Harbour_Village",
      "https://commons.wikimedia.org/wiki/File:Harbor_Village.jpg",
    ],
  },
});

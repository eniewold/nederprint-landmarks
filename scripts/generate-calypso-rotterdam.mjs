// De Calypso (Mauritsweg / Kruisplein, Rotterdam, 2008–2013; Will Alsop met Van der Laan Bouma
// Architekten): woon- en kantoorcomplex op één BAG-pand van ruim 4.600 m² met vier torens op een
// plint van vijf lagen. Aan het Kruisplein een rode toren (rood/oranje panelen, sterke
// verdiepingsranden, zuidgevel schuin in plan) met een zuilengalerij op de begane grond; aan de
// Mauritsweg drie witte, gefacetteerde torens die naar het zuiden afnemen (+56,8, +68,75 en +45 m),
// de noordelijke met een uitstekende kop met schuine onderkant boven de glazen tussenbouw, de
// zuidelijke met een naar binnen hellende westgevel en een bovenkant die 1,7 m over de Pauluskerk
// hangt. De Pauluskerk (Alsop, 2013) staat er tegenaan en is als koperen veelvlak meegenomen: haar
// PDOK-reconstructie bevat een strook van de zuidtoren tot NAP +48 m.
// Contouren uit de BAG, hoogtes en dakvlakken uit de 3D BAG (AHN5, 2023) en het AHN-DSM 0,5 m.
import { CrossSection, Manifold, ccw, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "calypso-rotterdam";
// Gebouwstelsel: v langs de westgevel aan de Mauritsweg (96,15° op RD-oost, BAG-hoekpunten van de
// west- en plintgevel), u loodrecht erop naar het oosten (6,15°).
const ORIGIN = [92070.0, 437290.0];
const ANGLE = 6.15;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = -1.06; // NAP, 3D BAG b3_h_maaiveld (-1,059); AHN-DTM op de stoep -1,0 tot -1,1
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const local = ([x, y]) => [(x - ORIGIN[0]) * AXIS[0] + (y - ORIGIN[1]) * AXIS[1], -(x - ORIGIN[0]) * AXIS[1] + (y - ORIGIN[1]) * AXIS[0]];

// BAG-contouren (RD, bovenaanzicht).
const BAG_CALYPSO_RD = [[92081.76, 437299.2], [92083.36, 437299.71], [92085.34, 437300.78], [92087.25, 437302.6], [92088.62, 437304.85], [92089.38, 437307.39], [92089.43, 437308.02], [92107.86, 437310.01], [92109.28, 437310.16], [92091.69, 437361.72], [92051.26, 437347.8], [92046.46, 437346.15], [92048.45, 437327.88], [92049.89, 437328.04], [92051.83, 437328.7], [92052.89, 437317.85], [92051.49, 437317.69], [92051.25, 437319.79], [92049.83, 437319.63], [92058.93, 437235], [92060.35, 437235.15], [92060.26, 437235.91], [92094.95, 437239.52], [92093.43, 437245.16], [92098.89, 437246.65], [92097.47, 437251.87], [92094.88, 437251.16], [92094.04, 437254.18], [92084.06, 437253.12], [92083.78, 437255.76], [92086.37, 437256.03], [92082.07, 437296.33]];
const BAG_PAULUS_RD = [[92098.52, 437228.13], [92097.94, 437228.45], [92094.95, 437239.52], [92060.26, 437235.91], [92060.37, 437234.96], [92059.8, 437231.68], [92059.3, 437229.46], [92060.19, 437223.88], [92062.51, 437220.58], [92066.96, 437219.13], [92071.67, 437219.75], [92084.5, 437224.27]];
const BAG_CALYPSO = BAG_CALYPSO_RD.map(local);
const BAG_PAULUS = BAG_PAULUS_RD.map(local);

const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (sec, z0, z1) => Manifold.extrude(sec, z1 - z0).translate([0, 0, z0]);
const prism = (poly, z0, z1) => prismCs(cs(poly), z0, z1);
const ring3 = (poly, h) => poly.map(([u, v]) => [u, v, h]);
// Gefacetteerd volume: omhulsel per paar opeenvolgende doorsneden [veelhoek, NAP].
const faceted = (sections) => union(sections.slice(1).map(([poly, nap], i) => Manifold.hull([...ring3(sections[i][0], z(sections[i][1])), ...ring3(poly, z(nap))])));
const withMoves = (poly, moves) => poly.map((p, i) => moves[i] ?? p);

// ---------- Plint ----------
// Vijf lagen tot NAP +18,45 m (3D BAG 18,44–18,47) over de hele BAG-contour; de glazen tussenbouw
// tussen de rode toren en de witte torens heeft een glasdak op +18,9 tot +19,5 m (DSM: nodata).
const PLINTH_TOP = 18.45;
const LINK_TOP = 19.2;
const LINK = [[-14.02, 29.5], [8.99, 28.75], [22.1, 31.39], [17.91, 49.12], [-10.06, 38.18], [-13.93, 39.42]];
// Begane grond 5,0 m, daarboven vier lagen van 3,625 m (geschat uit foto's; de bovenkant uit de 3D BAG).
const PLINTH_LEVELS = [GROUND, 3.94, 7.57, 11.2, 14.83, PLINTH_TOP];

// ---------- Rode toren aan het Kruisplein ----------
// Dakvlak NAP +68,57 m (3D BAG 68,56–68,57). Noordgevel op de BAG-contour (12,8° in het
// gebouwstelsel), oostgevel op de BAG-lijn van de plint, zuidgevel schuin (21,4°) van (−10,06; 38,18)
// naar (32,47; 54,67), uit het dakvlak van de 3D BAG en het DSM.
const RED_TOP = 68.57;
const RED = [[-17.37, 39.97], [-13.93, 39.97], [-10.06, 38.18], [17.91, 49.12], [32.47, 54.67], [29.25, 68.98], [-12.45, 59.47], [-17.38, 58.35]];
// Installatieblokken op het dak (3D BAG-vlakken 195 en 201).
const RED_PLANT = [
  { poly: [[-11.6, 50.0], [-7.6, 50.4], [-8.4, 53.9], [-11.5, 53.1]], top: 71.3 },
  { poly: [[-4.6, 48.3], [1.4, 49.1], [1.5, 51.0], [0.9, 52.3], [-3.8, 52.0], [-4.6, 50.4]], top: 71.0 },
];
// Zuilengalerij langs de noord- en westgevel: begane grond 2,0 m teruggezet achter ronde zuilen van
// 1,0 m op circa 6 m (geschat uit foto's).
const ARCADE_TOP = 3.94, ARCADE_DEPTH = 2.0, COLUMN_D = 1.0;
const ARCADE_EDGES = [[[29.25, 68.98], [-12.45, 59.47]], [[-12.45, 59.47], [-17.38, 58.35]], [[-17.38, 58.35], [-17.37, 39.97]]];

// ---------- Witte torens aan de Mauritsweg ----------
// Dakhoogtes uit de 3D BAG; bovenste doorsnede = dakvlak (vereenvoudigd tot een bolle veelhoek),
// lagere doorsneden springen op enkele hoeken 0,9–1,3 m in, zodat de gevels in schuine vlakken
// knikken zoals op de foto's (geschat). Niets springt buiten het dakvlak, behalve de zuidtoren
// boven de Pauluskerk (zie daar). Westgevels op u ≈ −15 (DSM: op u = −16 nog de plint op +18,4 m).
const MAIN_TOP = 68.75; // 3D BAG 68,75–68,77
const MAIN = [[-15.3, -26.75], [-12.67, -32.26], [-2.28, -34.79], [4.6, -33.0], [8.28, -30.36], [10.16, -20.37], [9.01, 0.36], [6.44, 7.98], [-13.88, 7.61], [-15.0, 0.56]];
const MAIN_SECTIONS = [
  [withMoves(MAIN, { 1: [-11.4, -31.3], 4: [7.2, -29.4], 6: [7.9, 1.0], 9: [-14.2, 1.6] }), PLINTH_TOP - 0.05],
  [withMoves(MAIN, { 0: [-14.8, -27.6], 5: [9.0, -20.0] }), 41.0],
  [MAIN, MAIN_TOP],
];
// Diepe knik in de westgevel tussen hoofdtoren en noordtoren, 2 m diep over 5 m (3D BAG-vlak 193, DSM).
const MAIN_NOTCH = [[-17, 0.6], [-13.2, 0.6], [-12.6, 5.5], [-12.9, 5.8], [-17, 5.8]];
// Terras van 3,1 m diep aan de zuidrand (3D BAG-vlak 189, +65,6 m).
const MAIN_TERRACE = { poly: [[-0.3, -36], [4.6, -36], [4.6, -30.6], [-0.3, -30.6]], top: 65.6 };
// Installatieblokken (3D BAG-vlakken 184, 186/188 en 192; DSM).
const MAIN_PLANT = [
  { poly: [[-2.0, -1.3], [1.5, -1.3], [1.5, 5.5], [-2.0, 5.5]], top: 71.1 },
  { poly: [[1.0, -8.4], [3.1, -8.4], [3.1, -1.4], [1.0, -1.4]], top: 71.7 },
  { poly: [[-1.5, -14.5], [0.5, -14.2], [0.3, -10.4], [-1.6, -10.2]], top: 71.5 },
  { poly: [[-6.0, 5.2], [-1.3, 5.1], [-1.2, 7.4], [-5.7, 7.6]], top: 70.0 },
];

// Noordelijke witte toren tot +56,77 m (3D BAG 56,77–56,79), 1 m in de hoofdtoren doorgetrokken.
const NORTH_TOP = 56.77;
const NORTH = [[-14.58, 6.5], [8.9, 6.5], [9.57, 28.74], [-12.44, 29.1]];
// Kop op de noordwesthoek (3D BAG: de dakrand springt hier 2,6 m naar het noorden uit) en een
// schuine onderkant boven de glazen tussenbouw: de noordgevel staat op +19,2 m 2,4 m terug en
// staat vanaf +25,5 m op het dakvlak (24° uit het lood; geschat uit foto's).
const NOSE = [[-12.44, 29.0], [-7.81, 29.0], [-8.98, 31.61], [-12.44, 30.36]];
const CHIN_FULL = 25.5, CHIN_INSET = 2.4;
const NORTH_SECTIONS = [
  [withMoves(NORTH, { 2: [9.57, 28.74 - CHIN_INSET], 3: [-12.44, 29.1 - CHIN_INSET] }), LINK_TOP - 0.05],
  [NORTH, CHIN_FULL],
  [withMoves(NORTH, { 2: [8.5, 27.9], 0: [-13.6, 6.5] }), 41.0],
  [NORTH, NORTH_TOP],
];

// Zuidelijke witte toren tot +45,0 m (3D BAG 45,00). De dakrand hangt aan de westkant 1,7 m over de
// Pauluskerk (3D BAG en PDOK van de kerk: dakvlak +45,0 tot RD y 437234,1); de zuidgevel helt
// daarom van de BAG-lijn op de plint naar v = −54,5 op het dak (3,8°). De westgevel helt naar binnen:
// van u = −15,8 op de plint naar −13,9 op het dak (DSM: op u = −15 een strook op +34 tot +40 m, op
// −14 +41 tot +45 m; de 3D BAG maakt er een schouder van +31,2 tot +34,9 m van).
const SOUTH_TOP = 45.0;
const SOUTH_A = [[-13.9, -54.5], [1.5, -54.57], [10.17, -52.83], [8.45, -41.11], [8.3, -39.0], [-13.9, -39.0]];
const SOUTH_A_FOOT = [[-15.8, -52.8], [1.5, -52.8], [10.17, -52.83], [8.45, -41.11], [8.3, -39.0], [-15.8, -39.0]];
const SOUTH_B = [[-14.3, -39.46], [8.3, -39.46], [7.75, -32.5], [-12.67, -31.5], [-14.3, -33.5]];
const SOUTH_B_FOOT = [[-15.8, -39.46], [8.3, -39.46], [7.75, -32.5], [-12.67, -31.5], [-15.8, -33.5]];
const SOUTH_PLANT = { poly: [[-4.55, -52.78], [-1.6, -52.79], [-1.58, -49.13], [-4.5, -48.69]], top: 47.93 };
// Dakopbouw op de oostelijke plint (3D BAG-vlakken 194 en 185).
const PLINTH_PLANT = [
  { poly: [[28.2, 21.7], [32.98, 22.76], [31.43, 31.35], [26.05, 30.02]], top: 21.3 },
  { poly: [[27.4, 30.6], [30.3, 31.3], [29.8, 33.8], [27.0, 33.2]], top: 22.4 },
];

// ---------- Pauluskerk (pand 0599100100001761, Alsop 2013) ----------
// Koperen veelvlak: dak NAP +14,3 m (3D BAG 14,23–14,42, DSM 14,1–14,5) met een punt tot +16,4 m aan
// de westkant (3D BAG-vlak 60, DSM). Begane grond 1,5 m teruggezet tot +2,2 m, op vier hoeken loopt
// het koper als pijler tot op de grond; daarboven staan de gevels op de contour van +4,5/+5,5 m tot
// +11,0/+12,0 m (om en om per hoekpunt, zodat de schuine vlakken boven en onder in driehoeken knikken)
// en springt het dak 1,2 m in (DSM: dakvlak tot 1–1,5 m van de rand). Aan de noordkant staat de kerk
// vlak tegen De Calypso. Hoogtes van de knikken geschat uit foto's.
const PAULUS_TOP = 14.3, PAULUS_PEAK = 16.4, PAULUS_BASE_TOP = 2.2, PAULUS_BASE_INSET = 1.5, PAULUS_TOP_INSET = 1.2;
const PAULUS_WALL = [[4.5, 11.0], [5.5, 12.0]];
const PAULUS_PIERS = [[-16.39, -56.89], [-14.88, -68.22], [7.37, -66.9], [21.73, -64.57]], PAULUS_PIER_LEG = 2.2;

// ---------- Opbouw ----------
const blocks = (list, from) => list.map((b) => prism(b.poly, z(from) - 0.1, z(b.top)));

const plinth = union([prism(BAG_CALYPSO, BASE, z(PLINTH_TOP)), prism(LINK, BASE, z(LINK_TOP)), ...blocks(PLINTH_PLANT, PLINTH_TOP)]);
const redTower = union([prism(RED, BASE, z(RED_TOP)), ...blocks(RED_PLANT, RED_TOP)]);
const mainTower = union([faceted(MAIN_SECTIONS), ...blocks(MAIN_PLANT, MAIN_TOP)]).subtract(union([prism(MAIN_TERRACE.poly, z(MAIN_TERRACE.top), z(MAIN_TOP) + 1), prism(MAIN_NOTCH, z(PLINTH_TOP), z(MAIN_TOP) + 1)]));
const northTower = union([
  faceted(NORTH_SECTIONS),
  Manifold.hull([...ring3(NOSE, z(CHIN_FULL)), ...ring3(NOSE, z(NORTH_TOP)), ...ring3([[-12.44, 29.1 - CHIN_INSET], [-7.81, 29.1 - CHIN_INSET]], z(LINK_TOP) - 0.05)]),
]);
const southTower = union([
  faceted([[SOUTH_A_FOOT, PLINTH_TOP - 0.05], [SOUTH_A, SOUTH_TOP]]),
  faceted([[SOUTH_B_FOOT, PLINTH_TOP - 0.05], [SOUTH_B, SOUTH_TOP]]),
  prism(SOUTH_PLANT.poly, z(SOUTH_TOP) - 0.1, z(SOUTH_PLANT.top)),
]);

// Pauluskerk als omhulsel van ringen op de contour; de noordzijde 0,3 m in De Calypso.
const paulusPoly = ccw(BAG_PAULUS);
const northSide = (p) => p[1] > -53.2; // hoekpunten op de gedeelde muur
const inset = (poly, d) => {
  const sec = cs(poly).offset(-d, "Miter");
  return sec.toPolygons()[0];
};
const paulusBase = inset(paulusPoly, PAULUS_BASE_INSET).map(([u, v]) => [u, v > -54.4 ? -52.45 : v]);
const paulusTopRing = inset(paulusPoly, PAULUS_TOP_INSET).map(([u, v]) => [u, v > -53.8 ? -52.45 : v]);
const paulusWall = paulusPoly.flatMap(([u, v], i) => PAULUS_WALL[i % 2].map((h) => [u, northSide([u, v]) ? -52.45 : v, z(h)]));
const westPeak = [-16.3, -59.6, z(PAULUS_PEAK)];
const paulusGem = Manifold.hull([
  ...ring3(paulusBase, z(PAULUS_BASE_TOP)),
  ...paulusWall,
  ...ring3(paulusTopRing, z(PAULUS_TOP)),
  ...ring3([[-15.0, -52.45], [19.4, -52.45]], z(PAULUS_TOP)),
]);
// Punt aan de westkant: piramide van de top naar de dakrand en de westgevel, zodat het dak verder vlak blijft.
const paulusPeak = Manifold.hull([westPeak, ...ring3(paulusTopRing.filter(([u]) => u < -11), z(PAULUS_TOP) - 0.05), ...paulusWall.filter(([u, , h]) => u < -14 && h > z(8))]);
// Pijlers: op vier hoeken loopt het koper tot de grond (driehoek van 2,2 m langs beide gevels).
const piers = PAULUS_PIERS.map((corner) => {
  let c = corner;
  const dist = paulusPoly.map((p) => Math.hypot(p[0] - c[0], p[1] - c[1])), i = dist.indexOf(Math.min(...dist));
  c = paulusPoly[i];
  const along = (q) => { const L = Math.hypot(q[0] - c[0], q[1] - c[1]); return [c[0] + ((q[0] - c[0]) * PAULUS_PIER_LEG) / L, c[1] + ((q[1] - c[1]) * PAULUS_PIER_LEG) / L]; };
  const prev = paulusPoly[(i + paulusPoly.length - 1) % paulusPoly.length], next = paulusPoly[(i + 1) % paulusPoly.length];
  return prism([c, along(next), along(prev)], BASE, z(PAULUS_WALL[0][0]) + 0.3);
});
const paulus = union([prism(paulusBase, BASE, z(PAULUS_BASE_TOP) + 0.05), paulusGem, paulusPeak, ...piers]);

// Zuilengalerij.
const arcadeCut = union(ARCADE_EDGES.map(([a, b]) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth];
  // Aan beide einden 1 m doorgetrokken: op de open einden (noordoosthoek, zuideinde van de westgevel)
  // staat de gevel haaks op de galerij en in de schuine noordwesthoek bleef anders een wig staan.
  return prism([P(-1, -1), P(L + 1, -1), P(L + 1, ARCADE_DEPTH), P(-1, ARCADE_DEPTH)], 0, z(ARCADE_TOP));
}));
const columns = [];
for (const [a, b] of ARCADE_EDGES) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const count = Math.max(1, Math.round(L / 6.0));
  for (let k = 0; k <= count; k++) {
    if (k === count && b === ARCADE_EDGES.at(-1)[1]) continue;
    if (k === 0 && a !== ARCADE_EDGES[0][0]) continue; // hoekzuil alleen één keer
    const s = Math.min(Math.max((L * k) / count, 0.6), L - 0.6);
    const c = [a[0] + d[0] * s - n[0] * (COLUMN_D / 2 + 0.02), a[1] + d[1] * s - n[1] * (COLUMN_D / 2 + 0.02)];
    columns.push(Manifold.cylinder(z(ARCADE_TOP) + 0.1, COLUMN_D / 2, COLUMN_D / 2, 16).translate([c[0], c[1], -0.1]));
  }
}

let body = union([plinth, redTower, mainTower, northTower, southTower, paulus]).subtract(arcadeCut).add(union(columns));

// ---------- Gevelreliëf: blinde nissen per verdieping ----------
// Nissen van 0,35 m met een plafond onder 45° (blijven na de printcorrectie open), tussen
// verdiepingsranden van 0,9 m. Elke nis wordt op de werkelijke gevel gezet (straal vanuit het
// gebouwstelsel), alleen waar de gevel over de hele nis vrij ligt en er ≥ 1 m materiaal achter zit.
const DEPTH = 0.35, BAND = 0.9, STOREY = 3.14;
const mulberry = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const towerLevels = (top) => { const l = []; for (let h = PLINTH_TOP; h < top - 2.0; h += STOREY) l.push(h); return [...l, top]; };
function niches(poly, levels, { niche, pier, margin = 1.0, minLen = 3.0, tol = 1.6, sill = BAND / 2, maxStorey = 3.6, seed }) {
  const p = ccw(poly), rnd = mulberry(seed), cuts = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < minLen) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    const face = (s, h) => {
      const from = P(s, -4, h), hits = body.rayCast(from, P(s, 10, h));
      if (!hits.length) return null;
      const t = Math.hypot(hits[0].position[0] - from[0], hits[0].position[1] - from[1]);
      const t1 = hits[1] ? Math.hypot(hits[1].position[0] - from[0], hits[1].position[1] - from[1]) : Infinity;
      return { f: t - 4, back: t1 - t };
    };
    for (let k = 0; k + 1 < levels.length; k++) {
      const z0 = z(levels[k]), z1 = z(levels[k + 1]);
      const lo = z0 + sill, hi = Math.min(z1 - BAND / 2, z0 + maxStorey - BAND / 2);
      if (hi - lo < 0.9) continue;
      let s = margin + rnd() * pier[1];
      while (true) {
        const w = niche[0] + rnd() * (niche[1] - niche[0]);
        if (s + w > L - margin) break;
        const s0 = s, s1 = s + w;
        s += w + pier[0] + rnd() * (pier[1] - pier[0]);
        // Gevel op de vier hoeken en in het midden; de nis volgt een schuin of gedraaid vlak, maar
        // niet over een knik (midden wijkt < 0,15 m af van het gemiddelde van de hoeken).
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
const cuts = [
  // Plint en de glazen onderste lagen van de rode toren: brede glasvlakken tussen rode stijlen.
  ...niches(BAG_CALYPSO, [GROUND, ...PLINTH_LEVELS.slice(1)], { niche: [2.6, 4.6], pier: [0.9, 1.3], minLen: 2.5, tol: 0.4, maxStorey: 5.0, seed: 11 }),
  // Rode toren: ramen en loggia's tussen smalle rode en oranje panelen, per laag verspringend.
  ...niches(RED, towerLevels(RED_TOP), { niche: [1.1, 2.6], pier: [0.9, 1.5], tol: 0.4, seed: 23 }),
  // Witte torens: balkons tussen schuine panelen, per laag verspringend.
  ...niches(MAIN, towerLevels(MAIN_TOP), { niche: [2.4, 3.8], pier: [1.0, 2.4], seed: 37 }),
  ...niches([...NORTH.slice(0, 3), [-7.81, 29.02], [-8.98, 31.61], [-12.44, 30.36]], towerLevels(NORTH_TOP), { niche: [2.4, 3.8], pier: [1.0, 2.4], seed: 41 }),
  ...niches([[-14.6, -54.5], [1.5, -54.57], [10.17, -52.83], [8.45, -41.11], [8.0, -33.0], [-14.6, -33.0]], towerLevels(SOUTH_TOP), { niche: [2.4, 3.8], pier: [1.0, 2.4], tol: 2.3, seed: 53 }),
];
// Pauluskerk: driehoekige ramen (basis 2,6 m, hoogte 2,2 m, punt om en om boven en onder) als nissen
// van 0,4 m loodrecht op de plaatselijke gevel.
function triangleWindows() {
  const p = paulusPoly, out = [];
  let k = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 4 || (northSide(a) && northSide(b))) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const count = Math.max(1, Math.floor((L - 1.5) / 4.0));
    for (let j = 0; j < count; j++) for (const zc of [z(6.8), z(10.0)]) {
      const s = ((j + 0.5) * L) / count + (zc > z(8) ? 0.9 : -0.6), up = (k++ % 2) === 0;
      if (s < 1.5 || s > L - 1.5) continue;
      const tri = up ? [[s - 1.3, zc - 1.0], [s + 1.3, zc - 1.0], [s, zc + 1.2]] : [[s - 1.3, zc + 1.0], [s + 1.3, zc + 1.0], [s, zc - 1.2]];
      const pts = [];
      let ok = true;
      for (const [t, h] of tri) {
        const from = [a[0] + d[0] * t + n[0] * 5, a[1] + d[1] * t + n[1] * 5, h];
        const hits = body.rayCast(from, [a[0] + d[0] * t - n[0] * 8, a[1] + d[1] * t - n[1] * 8, h]);
        if (!hits.length) { ok = false; break; }
        const f = Math.hypot(hits[0].position[0] - from[0], hits[0].position[1] - from[1]) - 5;
        if (Math.abs(f) > 2.5) { ok = false; break; }
        for (const depth of [f - 0.3, f + 0.4]) pts.push([a[0] + d[0] * t - n[0] * depth, a[1] + d[1] * t - n[1] * depth, h]);
      }
      if (ok) out.push(Manifold.hull(pts));
    }
  }
  return out;
}
const windows = triangleWindows();
const building = body.subtract(union([...cuts, ...windows]));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Calypso: ${parts.length} losse delen`);
console.log("Calypso", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length, "kerkramen", windows.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:calypso-rode-toren-witte-torens-plint-en-pauluskerk", building]],
  catalog: {
    name: "De Calypso",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.403, // laagste PDOK-terrein op de stoep langs de Mauritsweg (ellipsoïdisch), NAP circa −1,1
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-22, -40], [-22, 0], [-22, 30], [-22, 55], [10, 76]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100010072083", "NL.IMBAG.Pand.0599100100001761"],
    description:
      "De Calypso met de Pauluskerk: plint van vijf lagen tot NAP +18,45 m over de hele BAG-contour met een glazen tussenbouw tot +19,2 m; rode toren aan het Kruisplein tot +68,57 m (schuine zuidgevel, zuilengalerij op de begane grond, installatieblokken tot +71,3 m); drie witte gefacetteerde torens aan de Mauritsweg tot +56,77 m (noord, met uitstekende kop en schuine onderkant), +68,75 m (midden, terras op +65,6 m, installaties tot +71,7 m) en +45,0 m (zuid, naar binnen hellende westgevel, bovenkant 1,7 m over de kerk); de Pauluskerk als koperen veelvlak tot +14,3 m met een punt tot +16,4 m. Ramen, loggia's en balkons als blinde nissen per verdieping. Contouren uit de BAG, hoogtes en dakvlakken uit de 3D BAG (AHN5 2023) en het AHN-DSM. Oorsprong in de middelste witte toren, X-as loodrecht op de westgevel aan de Mauritsweg (6,15° op RD-oost). Verdiepingshoogtes, facetten, de kop, de zuilengalerij, de vorm van de kerk en het nissenpatroon zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      plinthTopNapM: PLINTH_TOP,
      linkRoofNapM: LINK_TOP,
      redTowerRoofNapM: RED_TOP,
      mainTowerRoofNapM: MAIN_TOP,
      northTowerRoofNapM: NORTH_TOP,
      southTowerRoofNapM: SOUTH_TOP,
      southOverhangOverChurchM: 1.7,
      mainTerraceNapM: MAIN_TERRACE.top,
      plantRoofsNapM: [...RED_PLANT, ...MAIN_PLANT].map((b) => b.top),
      storeyHeightM: STOREY,
      plinthLevelsNapM: PLINTH_LEVELS,
      pauluskerk: { roofNapM: PAULUS_TOP, peakNapM: PAULUS_PEAK },
      facadeAngleDegrees: ANGLE,
      estimatedFacets: true,
      estimatedFacadeRelief: true,
      estimatedArcade: true,
    },
    sources: [
      "PDOK BAG panden 0599100010072083 (2013) en 0599100100001761 (2013), actuele orthoHR, AHN DSM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100010072083",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100001761",
      "https://nl.wikipedia.org/wiki/Calypso_(Rotterdam)",
      "https://commons.wikimedia.org/wiki/File:De_Calypso_in_Rotterdam_2021_1.jpg",
      "https://commons.wikimedia.org/wiki/File:De_Calypso_in_Rotterdam_2021_2.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_De_Calypso_(3).jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_De_Calypso_(7).jpg",
      "https://commons.wikimedia.org/wiki/File:De_Calypso_-_Rotterdam_-_View_of_the_building_as_seen_from_the_Groothandelsgebouw_in_the_northwest.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_mauritsweg_calypsoflat.jpg",
      "https://commons.wikimedia.org/wiki/File:Pauluskerk_-_Cool_-_Rotterdam_-_View_of_the_church_from_the_southwest.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_nieuwe_Pauluskerk.jpg",
    ],
  },
});

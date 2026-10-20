// De Karel Doorman (Karel Doormanstraat / Binnenwegplein / Lijnbaan, Rotterdam; Ector Hoogstad, 2007–2012):
// woontoren bovenop het wederopbouwwarenhuis Ter Meulen (Van den Broek en Bakema, 1948–1951). Het warenhuis
// is teruggebracht tot zijn hoogte van 1951 (dak NAP +10,6 m) en kreeg aan de zuid- en oostkant een
// parkeerlaag met dakparkeren op +16,0 m. Daarop staat een schijf van 76 × 17,7 m met zeven woonlagen tot
// een daktuin op +42,8 m, en op de schijf twee torens: de westtoren tot +69,14 m en de oosttoren tot +60,0 m.
// De westkop kraagt over het dakterras van het warenhuis uit op twee kolommen. De lange gevels hebben een
// scherm van golvend glas met verspringende loggia-openingen; de koppen hebben verspringende ramen. Tussen
// de torens staat om de daktuin aan beide lange zijden een glazen windscherm van drie lagen. Het warenhuis
// heeft luifels langs het Binnenwegplein en de Lijnbaan, een kroonlijst op de dakrand, een gesloten eerste
// verdieping met een vensterband erboven aan het plein en pilasters met hoge ramen aan de Lijnbaan; de oostvleugel
// aan de Lijnbaan is hoger (+14,6 m) met installatieopbouwen. Contouren uit de BAG, hoogtes uit de 3D BAG
// (LoD2.2, AHN5 2023) en het AHN-DSM 0,5 m, gevelopbouw uit foto's (Commons).
import { CrossSection, Manifold, ccw, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "karel-doorman-rotterdam";
// Gebouwstelsel = modelstelsel: u langs de lange gevels van de toren (BAG-zijden 28,30° en 28,16° op RD-oost,
// naar het oostnoordoosten, de Lijnbaan), v naar het noordnoordwesten (Crispijnstraat). Oorsprong in het
// midden van de BAG-contour van de toren (pand 0599100110021001).
const ORIGIN = [92399.5, 437048.8];
const ANGLE = 28.3;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = -0.99; // NAP, 3D BAG b3_h_maaiveld −0,99 (beide panden); PDOK-terrein rondom 42,64–42,87 m ellipsoïdisch
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const local = ([x, y]) => [(x - ORIGIN[0]) * AXIS[0] + (y - ORIGIN[1]) * AXIS[1], -(x - ORIGIN[0]) * AXIS[1] + (y - ORIGIN[1]) * AXIS[0]];

// ---------- Contouren (BAG) ----------
// Toren, pand 0599100110021001 (bouwjaar 2012): rechthoek van 75,9 × 17,7 m.
const BAG_TOWER = [[92361.8, 437038.66], [92370.23, 437023.06], [92437.06, 437059.05], [92428.81, 437074.53]].map(local);
// Warenhuis Ter Meulen, pand 0599100000609958 (bouwjaar 1949): buitenring in het gebouwstelsel. De
// zuidgevel aan het Binnenwegplein springt in de BAG om de 4 m 0,3–0,6 m terug (pui tussen de kolommen);
// hier één rechte lijn op de buitenste punten. De twee gaten in de BAG-contour zijn de liftkernen van de
// toren en vallen binnen de toren.
const BAG_STORE = [
  [-46.57, 10.46], [-46.61, 1.7], [-44.87, 1.78], [-44.72, -2.22], [-45.01, -2.22], [-44.46, -18.6],
  [52.1, -18.84], [54.02, -8.57], [54.37, -8.59], [62.27, 33.28], [41.1, 37.2], [40.28, 32.76],
  [39.3, 32.9], [38.99, 31.16], [36.67, 31.61], [35.68, 30.88], [31.81, 10.32],
];

const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (sec, z0, z1) => Manifold.extrude(sec, z1 - z0).translate([0, 0, z0]);
const prism = (poly, z0, z1) => prismCs(cs(poly), z0, z1);
const rect = (u0, v0, u1, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const store = cs(BAG_STORE);
const inStore = (poly, z0, z1) => prismCs(cs(poly).intersect(store), z0, z1);
// v op de noordrand van de toren (de BAG-rechthoek staat 0,14° scheef op het stelsel).
const [TNW, TSW, TSE, TNE] = BAG_TOWER;
const vNorth = (u) => TNW[1] + ((TNE[1] - TNW[1]) * (u - TNW[0])) / (TNE[0] - TNW[0]);
const V_SOUTH = -8.79;

// ---------- Warenhuis ----------
// Dak +10,6 m (3D BAG-vlak 334: 10,60–10,71; DSM-mediaan 10,61): dakterras aan de westkant en de
// strook langs de Lijnbaan. Langs de Crispijnstraat ligt tussen de toren en de rooilijn een strook van
// 1,5 m die maar tot +7,4 m reikt (DSM-mediaan 7,37; op de foto's een uitspringende bakstenen plint onder
// de glasbanden van de toren).
const STORE_TOP = 10.6, NORTH_LEDGE = 7.4;
// Parkeerlaag met dakparkeren +16,0 m (3D BAG-vlak 331: 15,99–16,05; DSM 16,00) ten zuiden en oosten van
// de toren, met een schuine westrand (oprit) en twee autoliftopbouwen tot +16,95 m (3D BAG-vlakken 299 en
// 300) en een trappenhuis tot +17,73 m (3D BAG-vlak 322).
const DECK_TOP = 16.0;
const DECK = [[-29.96, -8.0], [-27.36, -17.26], [-27.4, -19.5], [46.0, -19.5], [46.0, -5.6], [46.15, 7.24], [37.96, 7.83], [37.9, -8.0]];
const DECK_BOXES = [
  { poly: [[43.45, -8.14], [46.01, -8.42], [46.04, -5.62], [43.56, -5.6]], top: 16.95 },
  { poly: [[43.43, -15.08], [45.95, -15.02], [45.93, -17.4], [43.69, -17.38]], top: 16.94 },
  { poly: [[10.0, -11.68], [12.1, -11.68], [12.16, -8.63], [10.04, -8.62]], top: 17.73 },
];
// Oostvleugel aan de Lijnbaan: dak +14,6 m (3D BAG-vlak 319: 14,61–14,67; DSM 14,67) achter een 3–7 m
// diepe strook op +10,6 m langs de Lijnbaan; aan de noordwestkant een deel op +13,45 m (vlak 304) en een
// opbouw tot +16,05 m (vlak 317); een installatiedak tot +16,7 m (vlak 332: 16,52–16,84) met twee
// opbouwen tot +18,35 m (vlakken 303 en 320) en losse opbouwen tot +17,2 en +17,8 m (vlakken 302, 306).
const EAST_WING = [[37.25, 7.88], [46.15, 7.24], [46.04, -5.7], [52.54, -5.37], [59.34, 32.2], [42.6, 35.1], [41.38, 32.45], [37.73, 24.22], [36.2, 14.74], [38.38, 14.02]];
const EAST_WING_TOP = 14.6;
const EAST_PARTS = [
  { poly: [[32.76, 15.38], [34.84, 14.88], [36.2, 14.74], [37.73, 24.22], [38.0, 25.86], [34.83, 26.37]], top: 13.45 },
  { poly: [[31.65, 8.28], [37.25, 7.88], [38.38, 14.02], [36.17, 14.56], [32.76, 15.38], [31.81, 10.32]], top: 16.05 },
  { poly: [[37.73, 24.22], [47.3, 22.1], [49.21, 30.76], [41.38, 32.45]], top: 16.7 },
  { poly: [[44.38, 28.0], [46.35, 27.74], [46.66, 30.86], [44.87, 30.28]], top: 18.35 },
  { poly: [[40.09, 27.28], [42.07, 26.96], [42.98, 31.34], [41.08, 31.55]], top: 18.33 },
  { poly: [[48.57, 19.24], [51.45, 18.7], [52.29, 19.96], [51.64, 20.81], [48.73, 20.79]], top: 17.2 },
  { poly: [[50.17, 25.65], [51.67, 25.34], [52.49, 26.51], [52.97, 31.39], [50.46, 30.83]], top: 17.82 },
];
// Luifels langs het Binnenwegplein en de Lijnbaan (foto's: witte luifel boven de etalages, aan het plein
// circa 2 m diep; DSM: iets tot 1–1,5 m voor de rooilijn op +4 tot +8 m). Plaat van 0,9 m, bovenkant +4,2 m.
const CANOPY_DEPTH = 2.0, CANOPY_TOP = 4.2, CANOPY_T = 0.9;
// Kroonlijst op de dakrand van 1951 (witte band op de foto's van het plein): 0,9 m hoog, 0,5 m uit de gevel,
// onderzijde onder 45°.
const CORNICE_OUT = 0.5, CORNICE_H = 0.9;

// ---------- Toren ----------
// Schijf over de hele BAG-rechthoek tot de daktuin. Daktuin tussen de torens (u −9,7 … 10,0): +42,8 m
// (3D BAG-vlakken 153 en 325: 42,77–42,86; DSM-mediaan 42,83), langs de zuidrand en de westtoren een lagere
// strook op +41,65 m (vlakken 149, 155, 315, 324: 41,56–41,94), langs de noordrand een verhoging tot +44,6 m
// (vlakken 139 en 314: 44,53–44,66).
const W_EAST = -9.7, E_WEST = 10.0; // 3D BAG −9,69…−9,77 en 9,88…10,15
const GARDEN_LOW = 41.65, GARDEN = 42.8, GARDEN_NORTH = 44.6;
// Glazen windscherm om de daktuin aan beide lange zijden, drie lagen hoog (foto's) tot +50,7 m (3D BAG-vlak
// 146 op de zuidrand: 50,72–50,74). Hier een dichte wand van 1,0 m.
const SCREEN_TOP = 50.7, SCREEN_T = 1.0;
// Westtoren dak +69,14 m (3D BAG-vlak 150/313: 69,12–69,16; DSM-mediaan 69,13) met liftopbouw +70,41 m
// (vlak 143); oosttoren dak +60,0 m (vlakken 154/333: 59,99–60,02; DSM 59,99) met liftopbouw +61,25 m
// (vlak 142) en een dakluik tot +61,3 m (vlak 326).
const W_TOP = 69.14, E_TOP = 60.0;
const ROOF_BOXES = [
  { poly: rect(-31.5, 5.05, -26.0, 8.92), top: 70.41 },
  { poly: [[25.8, 5.15], [31.7, 5.15], [31.7, 8.77], [25.8, 8.79]], top: 61.25 },
  { poly: rect(10.0, 1.5, 11.6, 5.2), top: 61.3 },
];
// Uitkraging van de westkop over het dakterras: onderkant op +16,0 m (gelijk met het parkeerdak; foto's:
// anderhalve laag boven de dakrand van het warenhuis), 6,0 m diep tot een teruggezette wand, op twee ronde
// kolommen van 1,0 m op een kwart en driekwart van de kopgevel, 2,5 m achter de gevel (foto's, geschat).
const SOFFIT = 16.0, OVERHANG_U = -32.0;
const COLUMNS = [[-35.5, -4.6], [-35.5, 4.6]], COLUMN_R = 0.5;

// ---------- Opbouw ----------
const storeShape = cs(BAG_STORE);
const parts = [];
// Warenhuis tot het dak van 1951, behalve de strook langs de Crispijnstraat.
parts.push(prismCs(storeShape, BASE, z(NORTH_LEDGE)));
parts.push(prismCs(storeShape.subtract(cs([[-37.2, 8.6], [31.7, 8.6], [31.95, 11.5], [-37.2, 11.5]])), z(NORTH_LEDGE) - 0.1, z(STORE_TOP)));
parts.push(inStore(DECK, z(STORE_TOP) - 0.1, z(DECK_TOP)));
parts.push(...DECK_BOXES.map((b) => prism(b.poly, z(DECK_TOP) - 0.1, z(b.top))));
parts.push(inStore(EAST_WING, z(STORE_TOP) - 0.1, z(EAST_WING_TOP)));
parts.push(...EAST_PARTS.map((b) => inStore(b.poly, z(STORE_TOP) - 0.1, z(b.top))));

// Schijf: westkop pas vanaf de onderkant van de uitkraging.
const towerUV = (u0, u1) => [[u0, V_SOUTH], [u1, V_SOUTH], [u1, vNorth(u1)], [u0, vNorth(u0)]];
parts.push(prism(towerUV(TSW[0], OVERHANG_U), z(SOFFIT), z(GARDEN_LOW)));
parts.push(prism(towerUV(OVERHANG_U, TSE[0]), BASE, z(GARDEN_LOW)));
parts.push(...COLUMNS.map(([u, v]) => Manifold.cylinder(z(SOFFIT) - z(STORE_TOP) + 0.2, COLUMN_R, COLUMN_R, 24).translate([u, v, z(STORE_TOP) - 0.1])));
// Torens en daktuin.
parts.push(prism(towerUV(TSW[0], W_EAST), z(GARDEN_LOW) - 0.1, z(W_TOP)));
parts.push(prism(towerUV(E_WEST, TSE[0]), z(GARDEN_LOW) - 0.1, z(E_TOP)));
parts.push(...ROOF_BOXES.map((b) => prism(b.poly, z(b.top) - 1.5, z(b.top))));
parts.push(prism([[-6.6, -5.7], [E_WEST + 0.1, -5.7], [E_WEST + 0.1, 6.3], [-6.6, 6.3]], z(GARDEN_LOW) - 0.1, z(GARDEN)));
parts.push(prism([[-4.0, 6.3], [E_WEST + 0.1, 6.3], [E_WEST + 0.1, vNorth(E_WEST)], [-4.0, vNorth(-4.0)]], z(GARDEN_LOW) - 0.1, z(GARDEN_NORTH)));
parts.push(prism([[W_EAST - 0.1, V_SOUTH], [E_WEST + 0.1, V_SOUTH], [E_WEST + 0.1, V_SOUTH + SCREEN_T], [W_EAST - 0.1, V_SOUTH + SCREEN_T]], z(GARDEN_LOW) - 0.1, z(SCREEN_TOP)));
parts.push(prism([[W_EAST - 0.1, vNorth(W_EAST) - SCREEN_T], [E_WEST + 0.1, vNorth(E_WEST) - SCREEN_T], [E_WEST + 0.1, vNorth(E_WEST)], [W_EAST - 0.1, vNorth(W_EAST)]], z(GARDEN_LOW) - 0.1, z(SCREEN_TOP)));

// Luifels: ring van 2,0 m buiten de rooilijn, alleen langs het plein en de Lijnbaan.
const canopyZone = cs([[-44.2, -30], [72, -30], [72, 33.0], [55.4, 33.0], [50.3, -14.0], [-44.2, -14.0]]);
const canopy = storeShape.offset(CANOPY_DEPTH, "Miter").subtract(storeShape.offset(-0.3, "Miter")).intersect(canopyZone);
parts.push(prismCs(canopy, z(CANOPY_TOP) - CANOPY_T, z(CANOPY_TOP)));

// Kroonlijst langs de dakrand van 1951: plein, Karel Doormanstraat, Lijnbaan en de noordkop van het terras.
function cornice(a, b, top) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, out, h) => [a[0] + d[0] * s + n[0] * out, a[1] + d[1] * s + n[1] * out, h];
  const lo = z(top) - CORNICE_H, hi = z(top), e = CORNICE_OUT;
  return Manifold.hull([-e, L + e].flatMap((s) => [P(s, -0.3, lo), P(s, 0, lo), P(s, e, lo + e), P(s, e, hi), P(s, -0.3, hi)]));
}
const ringEdges = (pts) => pts.map((p, i) => [p, pts[(i + 1) % pts.length]]);
const storeEdges = ringEdges(ccw(BAG_STORE));
const edgeIs = (e, test) => test([(e[0][0] + e[1][0]) / 2, (e[0][1] + e[1][1]) / 2], e);
const southEdge = storeEdges.find((e) => edgeIs(e, ([, v]) => v < -18));
const westEdges = storeEdges.filter((e) => edgeIs(e, ([u], [a, b]) => u < -44 && Math.hypot(b[0] - a[0], b[1] - a[1]) > 3));
const lijnbaanEdges = storeEdges.filter((e) => edgeIs(e, ([u, v], [a, b]) => u > 52 && Math.hypot(b[0] - a[0], b[1] - a[1]) > 3));
parts.push(cornice(...southEdge, STORE_TOP), ...westEdges.map((e) => cornice(...e, STORE_TOP)), ...lijnbaanEdges.map((e) => cornice(...e, STORE_TOP)));
parts.push(cornice([-37.2, 10.42], [-46.57, 10.46], STORE_TOP));

const body = union(parts);

// ---------- Gevelreliëf ----------
// Blinde nissen van 0,35 m met een plafond onder 45° tussen verdiepingsranden van 0,9 m, op de werkelijke
// gevel gezet (straal vanuit het gebouwstelsel) en alleen waar de gevel over de hele nis vrij ligt met
// ≥ 1 m materiaal erachter (zie generate-harbour-village.mjs).
const DEPTH = 0.35, BAND = 0.9;
const storeys = (from, top, n) => [...Array.from({ length: n }, (_, k) => from + ((top - from) * k) / n), top];
// Schijf: drie parkeerlagen boven het warenhuis en zeven woonlagen tot de daktuin; vanaf het parkeerdak
// hier negen gelijke lagen van 2,98 m (op de foto's lopen de loggia-openingen door tot het parkeerdak).
// Westtoren negen woonlagen (Wikipedia; 2,93 m), oosttoren zes lagen van 2,87 m (Wikipedia noemt er
// zeven, maar 17,2 m is te laag voor zeven woonlagen).
const SLAB_LEVELS = storeys(DECK_TOP, GARDEN, 9);
const W_LEVELS = [...SLAB_LEVELS.slice(0, -1), ...storeys(GARDEN, W_TOP, 9)];
const E_LEVELS = [...SLAB_LEVELS.slice(0, -1), ...storeys(GARDEN, E_TOP, 6)];
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
const NW = [TNW[0], vNorth(TNW[0])], NE = [TNE[0], vNorth(TNE[0])];
const south = (u0, u1) => [[u0, V_SOUTH], [u1, V_SOUTH]];
const north = (u0, u1) => [[u1, vNorth(u1)], [u0, vNorth(u0)]];
// Lange gevels: golvend glasscherm met verspringende loggia-openingen (foto's: 2,5–5 m breed, ruim een halve
// laag hoog, per laag verschoven). Koppen: verspringende ramen in goud- of oranje-omrande kozijnen.
const loggia = { niche: [2.6, 5.2], pier: [1.0, 3.2], maxStorey: 3.0 };
const windows = { niche: [1.4, 2.6], pier: [1.4, 3.6], maxStorey: 3.0, margin: 1.2 };
// Warenhuis: pui met kolommen om de 4 m (BAG-sprongen in de zuidgevel), vensterband onder de kroonlijst.
const shop = { niche: [3.1, 3.1], pier: [0.9, 0.9], maxStorey: 4.3, tol: 0.4 };
const ribbon = { niche: [3.1, 3.1], pier: [0.9, 0.9], maxStorey: 3.0, tol: 0.4 };
const STORE_GROUND = [GROUND, CANOPY_TOP - CANOPY_T]; // etalages onder de luifel
const STORE_BAND = [7.4, STORE_TOP - CORNICE_H]; // tweede verdieping: vensterband onder de kroonlijst
const cuts = [
  ...niches([south(TSW[0], W_EAST)], W_LEVELS, { ...loggia, seed: 3 }),
  ...niches([south(W_EAST, E_WEST)], SLAB_LEVELS, { ...loggia, seed: 5 }),
  ...niches([south(E_WEST, TSE[0])], E_LEVELS, { ...loggia, seed: 7 }),
  ...niches([north(E_WEST, TNE[0])], E_LEVELS, { ...loggia, seed: 11 }),
  ...niches([north(W_EAST, E_WEST)], SLAB_LEVELS, { ...loggia, seed: 13 }),
  ...niches([north(TNW[0], W_EAST)], W_LEVELS, { ...loggia, seed: 17 }),
  // Noordgevel onder het parkeerdak: drie glasbanden boven de plint (foto Crispijnstraat).
  ...niches([north(-37.2, 31.7)], [NORTH_LEDGE, 10.6, 13.3, DECK_TOP], { ...ribbon, seed: 19 }),
  ...niches([[NW, TSW.slice()]], W_LEVELS, { ...windows, seed: 23 }),
  ...niches([[TSE.slice(), NE]], E_LEVELS, { ...windows, seed: 29 }),
  ...niches([[[W_EAST, V_SOUTH], [W_EAST, vNorth(W_EAST)]]], storeys(GARDEN, W_TOP, 9), { ...windows, seed: 31 }),
  ...niches([[[E_WEST, vNorth(E_WEST)], [E_WEST, V_SOUTH]]], storeys(GARDEN, E_TOP, 6), { ...windows, seed: 37 }),
  // Warenhuis: etalages, vensterband, parkeerlaag aan het plein; pilasters met hoge ramen aan de Lijnbaan.
  ...niches([southEdge, ...westEdges], STORE_GROUND, { ...shop, seed: 41 }),
  ...niches([southEdge, ...westEdges], STORE_BAND, { ...ribbon, seed: 42 }),
  ...niches([southEdge], [11.0, DECK_TOP], { ...ribbon, maxStorey: 3.0, seed: 43 }),
  ...niches(lijnbaanEdges, STORE_GROUND, { ...shop, seed: 47 }),
  ...niches(lijnbaanEdges, [CANOPY_TOP, STORE_TOP - CORNICE_H], { niche: [1.8, 1.8], pier: [1.2, 1.2], maxStorey: 6.0, tol: 0.4, seed: 53 }),
  ...niches([[[31.81, 10.32], [-37.2, 10.443]]], [3.3, NORTH_LEDGE], { ...ribbon, maxStorey: 3.6, seed: 59 }),
];

const building = body.subtract(union(cuts));
const pieces = building.decompose();
if (pieces.length !== 1) throw new Error(`Karel Doorman: ${pieces.length} losse delen`);
console.log("Karel Doorman", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:karel-doorman-woontoren-op-warenhuis-ter-meulen", building]],
  catalog: {
    name: "De Karel Doorman",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.644, // laagste PDOK-terrein op de Karel Doormanstraat (ellipsoïdisch), NAP circa −1,0
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-50, -10], [-50, 6], [-30, -23], [0, -23], [30, -23], [-20, 13], [10, 13], [60, -5], [64, 20]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100110021001", "NL.IMBAG.Pand.0599100000609958"],
    description:
      "De Karel Doorman op het warenhuis Ter Meulen: schijf van 75,9 × 17,7 m met een westtoren tot NAP +69,14 m (liftopbouw +70,41 m) en een oosttoren tot +60,0 m (liftopbouw +61,25 m), daartussen een daktuin op +42,8 m met aan beide lange zijden een glazen windscherm tot +50,7 m; de westkop kraagt 6 m over het dakterras uit op twee kolommen (onderkant +16,0 m). Lange gevels met verspringende loggia-openingen, koppen met verspringende ramen. Warenhuis tot +10,6 m met kroonlijst, luifels langs het Binnenwegplein en de Lijnbaan, etalages, vensterband en pilasters; parkeerlaag met dakparkeren tot +16,0 m ten zuiden en oosten van de toren, oostvleugel aan de Lijnbaan tot +14,6 m met installatieopbouwen tot +18,35 m, plint aan de Crispijnstraat tot +7,4 m. BAG-contouren, hoogtes uit de 3D BAG (AHN5 2023) en het AHN-DSM. Oorsprong in het midden van de toren, X-as langs de lange gevels (28,3° op RD-oost). Uitkraging, kolommen, luifels, kroonlijst, verdiepingshoogtes, windschermhoogte en het nissenpatroon zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      towerFootprintM: [75.9, 17.7],
      westTower: { roofNapM: W_TOP, liftNapM: 70.41, storeys: 9 },
      eastTower: { roofNapM: E_TOP, liftNapM: 61.25, storeys: 6 },
      roofGardenNapM: [GARDEN_LOW, GARDEN, GARDEN_NORTH],
      windScreenNapM: SCREEN_TOP,
      westOverhang: { depthM: -OVERHANG_U + TSW[0], soffitNapM: SOFFIT, columns: COLUMNS.length, columnDiameterM: 2 * COLUMN_R },
      store: { roofNapM: STORE_TOP, northPlinthNapM: NORTH_LEDGE, parkingDeckNapM: DECK_TOP, eastWingNapM: EAST_WING_TOP, canopyDepthM: CANOPY_DEPTH, canopyTopNapM: CANOPY_TOP },
      facadeAngleDegrees: ANGLE,
      estimatedOverhang: true,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0599100110021001 (bouwjaar 2012) en 0599100000609958 (bouwjaar 1949), actuele orthoHR, AHN DSM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100110021001",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000609958",
      "https://nl.wikipedia.org/wiki/De_Karel_Doorman",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_De_Karel_Doorman.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_De_Karel_Doorman_(2).jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_De_Karel_Doorman_(3).jpg",
      "https://commons.wikimedia.org/wiki/File:Karel_Doormanstraat_towards_De_Rotterdam_-_2019-12-05.jpg",
      "https://commons.wikimedia.org/wiki/File:Binnenwegplein_(3782243003).jpg",
      "https://commons.wikimedia.org/wiki/File:%27Polare%27_Binnenwegplein_Rotterdam.jpg",
    ],
  },
});

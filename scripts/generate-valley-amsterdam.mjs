// Valley (Beethovenstraat, Amsterdam Zuidas; MVRDV, 2021/2022): drie torens
// van 67, 81 en 100 m op een gezamenlijke onderbouw met parkeergarage. Aan de
// buitenkant gladde glazen gevels, aan de binnenkant (de "vallei") een
// rotsachtige berg van uitkragende natuurstenen terrasbakken die per verdieping
// verspringen. Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen
// gestapelde DSM-lagen: elk terras is een veelhoekig prisma met schuine facetten
// op zijn eigen verdiepingshoogte (verdiepingsraster hieronder), de steile
// natuurstenen wanden krijgen per verdieping uitkragende bakken (een
// terugliggende verdieping onder een schuine kraag van 45 graden) en vensters,
// de glazen gevels verdiepingsbanden en stijlen. Voorbeelden per rij:
// generate-evoluon.mjs (aanpak primitieven), generate-zalmhaven.mjs (nieuwbouw
// uit AHN5) en generate-haagse-toren.mjs (skylinetoren op efteling-kit.mjs).
//
//   node scripts/generate-valley-amsterdam.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong midden in de bovengrondse voetafdruk op RD
// (120262,5, 483407,0), z = 0 op NAP -0,7 m (Beethovenstraat en de kades
// rondom: AHN5-DTM -0,5 tot -0,95), Z omhoog. +X loopt op -0,3 graden in RD,
// langs de rechte noord- en zuidgevel van het BAG-pand; +Y wijst naar het
// noorden. De Noordtoren (100 m) staat aan +Y tegen de oostgevel, de
// Zuidtoren (81 m) aan -Y, de Westtoren (67 m) aan de Beethovenstraat (-X);
// de oostgevel (+X) staat aan de sloot langs de sportvelden.
//
// Bronnen: BAG-pand 0363100012250045 (de BAG-contour omvat ook de
// ondergrondse garage: de bovengrondse gevels liggen aan de oost- en westkant
// 3,5 tot 4,5 m binnen de contour, zoals het AHN en de luchtfoto laten zien).
// Het AHN op PDOK (AHN4) toont het complex nog in aanbouw (torens tot circa
// NAP +70 m met bouwkranen), dus alle hoogtes en terrasvlakken komen uit AHN5
// (opname 2023, DSM 0,5 m via de ImageServer Hoogtebestand/AHN5_DSM_50cm van
// ahn.arcgisonline.nl), in dit stelsel per 0,25 m uitgelezen. De 3D BAG
// (LoD2.2 op dezelfde AHN5-opname, TU Delft/3D geoinformatie, CC BY 4.0)
// diende als controle en levert de hellende vlakken van de trappen. Het
// verdiepingsraster komt uit de pieken in het AHN5-histogram: terrasvloeren op
// +6,2 tot +32,8 per 3,8 m (kantoren) en daarboven per 3,3 m (woningen),
// telkens met een plantenbak of borstwering van circa 0,8 m. Gevelindeling,
// bakken en vensters uit Commons-foto's van alle kanten.
import { CrossSection, Manifold, box, prism, union, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "valley-amsterdam";
const ORIGIN = [120262.5, 483407.0];
const AXIS_DEG = -0.3;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = -0.7;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- verdiepingsraster en daken (NAP, AHN5) ----------
// Terrasvloeren: kantoorlagen per 3,8 m vanaf +6,2, woonlagen per 3,3 m vanaf
// +32,8 (AHN5-pieken 36,2 39,4 42,8 46,0 49,4 52,6 56,0 59,2 62,6 66,0 69,2
// 72,4 75,8 79,4 82,3 85,6 88,8). Daken: Westtoren +66,0 met een verhoogd deel
// +67,2, Zuidtoren +79,4 met een dakopbouw tot +82,3, Noordtoren +93,0
// (oostelijke trede), hoofddak +99,4 en dakopbouw +100,8.
const OFFICE = { first: 6.2, pitch: 3.8, count: 8 }; // +6,2 .. +32,8
const HOMES = { first: 32.8, pitch: 3.3 };
const storey = (k) => (k < OFFICE.count ? OFFICE.first + OFFICE.pitch * k : HOMES.first + HOMES.pitch * (k - OFFICE.count + 1));
// Niveaus van de terrasvlakken in valleyData(): index 0 is de voetafdruk op
// straatniveau, dan het verdiepingsraster (afgerond op de AHN5-pieken) en de
// daken.
const LEVELS = [
  GROUND_NAP + 0.3,
  ...Array.from({ length: 8 }, (_, k) => +storey(k).toFixed(1)), // 6,2 .. 32,8
  36.2,
  39.4,
  42.8,
  46.0,
  49.4,
  52.6,
  56.0,
  59.2,
  62.6,
  66.0, // dak Westtoren
  67.2, // verhoogd deel Westtoren
  69.2,
  72.4,
  75.8,
  79.4, // dak Zuidtoren
  82.3, // dakopbouw Zuidtoren en terrassen Noordtoren
  85.6,
  88.8,
  93.0, // oostelijke trede Noordtoren
  99.4, // dak Noordtoren
  100.8, // dakopbouw Noordtoren
];

// ---------- voetafdruk (m, gebouwstelsel) ----------
// Bovengrondse gevels: noord-, zuid- en schuine zuidwestgevel volgens BAG, de
// oostgevel (u = 21,85, BAG-noord- en zuiddeel) en de westgevel (u = -22,75,
// BAG-noordwesthoek; AHN5 -22,75 tot -23,25) recht doorgetrokken.
const FOOT = [
  [-22.76, 67.49],
  [-22.73, -0.9],
  [-19.16, -12.07],
  [-17.65, -16.84],
  [-13.74, -28.26],
  [-12.94, -30.35],
  [-11.91, -32.99],
  [2.11, -69.28],
  [21.85, -69.27],
  [21.85, 70.15],
];

// ---------- gevels ----------
// Glazen gevels: per verdieping een glasband tussen borstweringen van 0,7 m,
// stijlen per 3,0 m. Natuurstenen wanden: per verdieping een naad op de vloer,
// op 60 % van de verdiepingen een terugliggend stuk van 40 tot 90 % van de
// wand onder de bak erboven (1,8 m diep met een kraag van 45 graden, 0,8 m
// waar de vloer smal is), en daarnaast bakken met grote vensters.
const GLASS = { pitch: 3.0, mullion: 0.6, sill: 0.35, depth: 0.3 };
const STONE = { seam: 0.3, depth: 0.35, recess: 1.8, shallow: 0.8, recessShare: 0.6, sill: 0.8, head: 0.5, pier: 0.6 };
const zoneOf = ([u, v]) => (v > 33 ? "noord" : v < -30 ? "zuid" : u < 2 && v > -12 && v < 26 ? "west" : "vallei");
// Glas is de gladde buitenhuid: een gevel die van de vallei af kijkt en
// minstens twee verdiepingen recht doorloopt, en de buitengevel van de
// onderbouw. Wat per verdieping terugspringt (de cascade van bakken langs de
// randen en de kroon) en alles wat naar de vallei kijkt, is natuursteen
// (foto's van alle kanten).
const VALLEY_CENTRE = [-2, 5];
const CROWN = { noord: 88.7, zuid: 72.3, west: 17.5 };
const RIM = { width: 0.9, height: 0.9 }; // plantenbakken en borstweringen langs de terrasranden

// ---------- trappen (3D BAG, CC BY 4.0) ----------
// De openbare route door de vallei: hellende vlakken uit de 3D BAG, hier als
// treden van circa 0,9 m; de buitentrap aan de Beethovenstraat (2951) loopt van
// de straat naar het eerste terras op +6,2.
const STAIRS = [
  [
    [-19.73, 32.46, 4.9],
    [-19.57, 33.58, 4.27],
    [-18.97, 37.98, 1.83],
    [-18.87, 38.71, 1.43],
    [-21.16, 38.74, 1.49],
    [-22.24, 30.81, 5.9],
    [-20.69, 30.85, 5.82],
  ],
  [
    [-12.11, -19.43, 3.12],
    [-14.4, -16.21, 5.66],
    [-16.28, -16.1, 6.25],
    [-17.67, -16.79, 6.23],
    [-17.65, -16.86, 6.19],
    [-16.08, -21.44, 3.05],
    [-14.56, -20.67, 3.07],
  ],
  [
    [-11.36, -20.47, 2.79],
    [-12.11, -19.43, 3.64],
    [-14.56, -20.67, 3.63],
    [-14.21, -21.31, 3.14],
    [-12.93, -24.98, 0.55],
    [-9.98, -23.18, 0.74],
  ],
  [
    [-12.11, -19.43, 7.81],
    [-11.36, -20.47, 8.33],
    [-9.98, -23.18, 9.64],
    [-9.23, -22.73, 9.53],
    [-8.18, -20.76, 8.8],
    [-8.71, -16.6, 6.96],
    [-8.77, -16.53, 6.93],
    [-13.78, -16.24, 6.26],
    [-14.4, -16.21, 6.18],
  ],
  [
    [22.13, 5.15, 6.85],
    [18.64, 5.06, 6.7],
    [18.71, 4.55, 6.94],
    [19.53, -0.96, 9.48],
    [20.9, -0.88, 9.52],
    [20.97, 3.03, 7.75],
    [21.57, 2.73, 7.92],
    [21.57, 4.39, 7.17],
  ],
  [
    [-4.57, -28.23, 10.55],
    [-4.46, -26.85, 11.18],
    [-4.92, -22.39, 13.16],
    [-5.71, -21.76, 13.4],
    [-6.33, -21.83, 13.33],
    [-6.43, -22.79, 12.89],
    [-6.85, -27.65, 10.66],
  ],
  [
    [8.28, -2.55, 18.54],
    [12.59, -0.07, 20.69],
    [12.79, 0.35, 20.86],
    [11.75, 1.76, 20.84],
    [7.17, -0.97, 18.54],
  ],
  [
    [18.71, 4.55, 13.35],
    [18.36, 4.49, 13.35],
    [18.06, 2.3, 12.39],
    [17.03, 1.67, 12.18],
    [17.89, 1.1, 11.87],
    [17.46, -1.97, 10.54],
    [19.6, -1.48, 10.62],
  ],
  [
    [17.89, 1.1, 15.07],
    [15.71, 2.54, 14.28],
    [14.63, 2.62, 14.17],
    [14.81, 1.21, 14.82],
    [15.46, -4.12, 17.3],
    [16.51, -4.14, 17.37],
    [17.67, -3.65, 17.23],
    [17.46, -1.97, 16.44],
  ],
  [
    [-15.51, 34.42, 9.36],
    [-17.83, 29.71, 7.02],
    [-15.84, 28.33, 6.85],
    [-13.76, 33.19, 9.2],
    [-13.98, 33.74, 9.38],
  ],
  [
    [2.62, -0.8, 24.22],
    [6.08, 0.42, 22.55],
    [7.75, 6.53, 20.93],
    [4.64, 6.71, 22.24],
    [0.76, 3.19, 24.44],
    [0.27, 1.64, 24.88],
  ],
  [
    [-1.98, -22.05, 16.98],
    [-0.71, -22.04, 17.27],
    [-1.28, -18.8, 15.88],
    [-2.84, -15.64, 14.29],
    [-3.86, -17.5, 14.78],
  ],
  [
    [-11.07, 37.12, 10.71],
    [-11.52, 30.44, 13.67],
    [-11.4, 28.1, 14.71],
    [-11.34, 27.72, 14.88],
    [-9.14, 29.25, 14.22],
    [-8.75, 33.67, 12.26],
    [-9.26, 37.06, 10.75],
  ],
];
const STEP = 0.9;

// ---------- dakinstallaties (AHN5) ----------
// Gevelonderhoudsinstallaties: mast en geparkeerde arm op elk dak (AHN5
// Noordtoren +103 op u 18, v 67, arm tot +101; Westtoren arm +69 tot +70 op
// u -8; Zuidtoren mast +83).
const BMU = [
  {
    mast: [18.0, 67.0],
    top: 103.3,
    arm: [
      [18.0, 67.0],
      [12.5, 50.5],
    ],
    armTop: 101.6,
    roof: 99.4,
  },
  {
    mast: [-8.0, -1.0],
    top: 70.2,
    arm: [
      [-8.0, -1.0],
      [-8.0, 13.0],
    ],
    armTop: 69.4,
    roof: 66.0,
  },
  {
    mast: [18.5, -47.0],
    top: 83.6,
    arm: [
      [18.5, -47.0],
      [8.0, -58.0],
    ],
    armTop: 83.0,
    roof: 79.4,
  },
];

// ---------- hulpfuncties ----------
const area = (p) =>
  p.reduce((a, [x0, y0], i) => {
    const [x1, y1] = p[(i + 1) % p.length];
    return a + x0 * y1 - x1 * y0;
  }, 0) / 2;
const ccwPoly = (p) => (area(p) > 0 ? p : [...p].reverse());
// Deterministisch 'toeval' per verdieping en vak: het grillige karakter is
// vast, niet bij elke run anders.
const rnd = (...k) => {
  let h = 2166136261;
  for (const x of k) h = Math.imul(h ^ Math.round(x * 100), 16777619);
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296;
};
const distToSeg = ([px, py], [ax, ay], [bx, by]) => {
  const dx = bx - ax,
    dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
};
const footEdges = FOOT.map((p, i) => [p, FOOT[(i + 1) % FOOT.length]]);
const insidePolys = ([x, y], polys) =>
  polys.some((r) => {
    let k = false;
    for (let a = 0, b = r.length - 1; a < r.length; b = a++) {
      const [xa, ya] = r[a];
      const [xb, yb] = r[b];
      if (ya > y !== yb > y && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) k = !k;
    }
    return k;
  });
const onPerimeter = (p) => footEdges.some(([a, b]) => distToSeg(p, a, b) < 0.35);
// Blinde nis in een gevel a→b (buitenkant rechts van de looprichting bij een
// veelhoek tegen de klok in): s0..s1 vanaf a, z0..z1, diepte d; met `chamfer`
// loopt de bovenkant onder 45 graden naar de gevel (bak erboven kraagt uit).
function niche(a, b, s0, s1, z0, z1, d, chamfer = false) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const t = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const n = [t[1], -t[0]]; // naar buiten
  const P = (s, w, zz) => [a[0] + t[0] * s + n[0] * w, a[1] + t[1] * s + n[1] * w, zz];
  const pts = [];
  for (const s of [s0, s1]) {
    pts.push(P(s, 0.3, z0), P(s, -d, z0), P(s, 0.3, z1));
    if (chamfer) pts.push(P(s, -d, z1 - d), P(s, 0, z1));
    else pts.push(P(s, -d, z1));
  }
  return Manifold.hull(pts);
}

// ---------- terrasvlakken ----------
const terraces = valleyData(); // [niveau-index, zone, veelhoek]
const byLevel = LEVELS.map(() => []);
for (const [k, zone, poly] of terraces) byLevel[k].push({ zone, poly: ccwPoly(poly) });
const regionCS = byLevel.map((ps) =>
  ps.length
    ? new CrossSection(
        ps.map((p) => p.poly),
        "Positive",
      )
    : null,
);

const levelEdges = byLevel.map((ps) => ps.flatMap(({ poly }) => poly.map((q, i) => [q, poly[(i + 1) % poly.length]])));
const onEdges = (p, edges) => edges.some(([a, b]) => distToSeg(p, a, b) < 0.4);
// Natuursteen of glas op punt p van een gevel van niveau k met buitennormaal n.
const isStoneAt = (zone, k, p, normal) => {
  const bandBottom = LEVELS[k - 1];
  const perimeter = onPerimeter(p);
  if (k === 1) return !perimeter;
  // Westtoren: glazen onderbouw, daarboven natuursteen met het grote glasvlak
  // midden in de westgevel (foto vanaf de Beethovenstraat) tot +52,6.
  if (zone === "west") return bandBottom >= CROWN.west && !(perimeter && normal[0] < -0.7 && bandBottom < 52.5 && p[1] > -2 && p[1] < 18);
  if (zone !== "vallei" && bandBottom >= CROWN[zone]) return true;
  if (zone === "vallei") return !perimeter;
  const d = [VALLEY_CENTRE[0] - p[0], VALLEY_CENTRE[1] - p[1]];
  if ((normal[0] * d[0] + normal[1] * d[1]) / Math.hypot(...d) > 0.3) return true;
  return !onEdges(p, levelEdges[k + 2] ?? []);
};
// Deel een gevel op in stukken glas en natuursteen (per 0,5 m bemonsterd,
// stukjes korter dan 1,5 m gaan op in hun buur).
function facadeRuns(zone, k, a, b, len, normal) {
  const n = Math.max(2, Math.round(len / 0.5));
  const runs = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const stone = isStoneAt(zone, k, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], normal);
    const s0 = (len * i) / n;
    const s1 = (len * (i + 1)) / n;
    if (runs.length && runs[runs.length - 1].stone === stone) runs[runs.length - 1].s1 = s1;
    else runs.push({ stone, s0, s1 });
  }
  for (let i = 0; i < runs.length; i++) {
    if (runs.length > 1 && runs[i].s1 - runs[i].s0 < 1.5) {
      const j = i > 0 ? i - 1 : i + 1;
      runs[j].s0 = Math.min(runs[j].s0, runs[i].s0);
      runs[j].s1 = Math.max(runs[j].s1, runs[i].s1);
      runs.splice(i, 1);
      i = -1;
    }
  }
  return runs;
}

const parts = [];
const cuts = [];
// Voetafdruk tot straatniveau, daarboven elk terras als prisma van het niveau
// eronder tot zijn eigen vloer (de vlakken zijn genest: wat hoger ligt, ligt
// binnen wat lager ligt).
parts.push(prism(FOOT, BASE, z(LEVELS[0])));
for (let k = 1; k < LEVELS.length; k++) {
  for (const { poly } of byLevel[k]) parts.push(prism(poly, z(LEVELS[k - 1]) - 0.01, z(LEVELS[k])));
}

// Gevels per terrasrand: de wand van niveau k staat bloot tussen niveau k-1 en k.
let glassPanels = 0;
let stoneBays = 0;
let recesses = 0;
for (let k = 1; k < LEVELS.length; k++) {
  const z0 = z(LEVELS[k - 1]);
  const bandTop = z(LEVELS[k]);
  const polys = byLevel[k].map((p) => p.poly);
  // De begane grond (straat tot +6,2) hoort bij niveau 1: één hoge glaslaag.
  const groundBand = k === 1;
  polys.forEach((poly, pi) => {
    for (let i = 0; i < poly.length; i++) {
      const A = poly[i];
      const B = poly[(i + 1) % poly.length];
      const L = Math.hypot(B[0] - A[0], B[1] - A[1]);
      if (L < 1.5) continue;
      const zone = zoneOf([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]);
      const lo = groundBand ? 0 : z0;
      const hi = bandTop;
      const h = hi - lo;
      if (h < 2.2) continue;
      const nSt = groundBand ? 1 : Math.max(1, Math.round(h / 3.3));
      const st = h / nSt;
      const normal = [(B[1] - A[1]) / L, -(B[0] - A[0]) / L];
      const P = (s) => [A[0] + ((B[0] - A[0]) * s) / L, A[1] + ((B[1] - A[1]) * s) / L];
      for (const run of facadeRuns(zone, k, A, B, L, normal)) {
        const a = P(run.s0);
        const b = P(run.s1);
        const len = run.s1 - run.s0;
        if (len < 1.2) continue;
        if (!run.stone) {
          // Glazen gevel: glasband per verdieping, stijlen per 3,0 m.
          const n = Math.max(1, Math.round((len - 0.6) / GLASS.pitch));
          const p = (len - 0.6) / n;
          for (let j = 0; j < n; j++) {
            const s0 = 0.3 + p * j + GLASS.mullion / 2;
            const s1 = 0.3 + p * (j + 1) - GLASS.mullion / 2;
            if (s1 - s0 < 0.8) continue;
            for (let f = 0; f < nSt; f++) {
              const f0 = lo + st * f;
              const top = groundBand ? hi - 0.9 : f0 + st - GLASS.sill;
              cuts.push(niche(a, b, s0, s1, f0 + (groundBand ? 0.25 : GLASS.sill), top, GLASS.depth));
              glassPanels++;
            }
          }
          continue;
        }
        // Natuursteen: per verdieping verspringt de bak. Op een deel van de wand
        // (30 tot 80 %) ligt de verdieping terug onder een kraag van 45 graden,
        // de rest is de bak met een groot venster.
        const inner = (s, d) => {
          const t = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
          return [a[0] + t[0] * s - t[1] * d, a[1] + t[1] * s + t[0] * d];
        };
        const deepOk =
          len >= 3 && insidePolys(inner(len / 2, 3.6), polys) && insidePolys(inner(len * 0.2, 3.6), polys) && insidePolys(inner(len * 0.8, 3.6), polys);
        for (let f = 0; f < nSt; f++) {
          const f0 = lo + st * f;
          const f1 = f0 + st;
          const r = rnd(k, pi, i, run.s0, f);
          // Naad tussen de bakken op elke verdiepingsvloer.
          if (!groundBand) cuts.push(niche(a, b, 0, len, f0 + 0.02, f0 + 0.45, STONE.seam));
          let free = [[STONE.pier / 2, len - STONE.pier / 2]];
          if (!groundBand && len >= 3 && r < STONE.recessShare) {
            const w = Math.max(1.5, len * (0.4 + 0.5 * rnd(r, 3)));
            const s0 = Math.max(0, (len - w) * rnd(r, 5));
            const s1 = Math.min(len, s0 + w);
            cuts.push(niche(a, b, s0, s1, f0 + 0.05, f1, deepOk ? STONE.recess : STONE.shallow, true));
            recesses++;
            free = [
              [STONE.pier / 2, s0 - STONE.pier],
              [s1 + STONE.pier, len - STONE.pier / 2],
            ];
          }
          for (const [q0, q1] of free) {
            if (q1 - q0 < 1.2 || rnd(r, q0, 13) < 0.15) continue;
            const w = Math.max(1.0, Math.min(q1 - q0, 6.5) * (0.55 + 0.45 * rnd(r, q0, 7)));
            const c = q0 + (q1 - q0 - w) * rnd(r, q0, 11) + w / 2;
            cuts.push(niche(a, b, c - w / 2, c + w / 2, f0 + STONE.sill, f1 - STONE.head, STONE.depth));
            stoneBays++;
          }
        }
      }
    }
  });
}

let model = union(parts).subtract(union(cuts));

// Plantenbakken en borstweringen langs de open terrasranden (niet waar de
// wand van het niveau erboven staat).
const rims = [];
for (let k = 1; k < LEVELS.length; k++) {
  const R = regionCS[k];
  if (!R) continue;
  const above = regionCS[k + 1];
  let rim = R.subtract(R.offset(-RIM.width, "Miter"));
  if (above) rim = rim.subtract(above.offset(0.05, "Miter"));
  rim = rim.simplify(0.02);
  const ps = rim.toPolygons().filter((p) => Math.abs(area(p)) > 0.6);
  if (ps.length) rims.push(Manifold.extrude(new CrossSection(ps, "Positive"), RIM.height + 0.01).translate([0, 0, z(LEVELS[k]) - 0.01]));
}
model = union([model, ...rims]);

// Trappen: treden van 0,9 m over het hellende vlak.
const stairParts = [];
for (const face of STAIRS) {
  // vlak z = a u + b v + c (kleinste kwadraten)
  let [su, sv, sz, suu, svv, suv, suz, svz] = [0, 0, 0, 0, 0, 0, 0, 0];
  for (const [u, v, w] of face) {
    su += u;
    sv += v;
    sz += w;
    suu += u * u;
    svv += v * v;
    suv += u * v;
    suz += u * w;
    svz += v * w;
  }
  const N = face.length;
  const M = [
    [suu, suv, su],
    [suv, svv, sv],
    [su, sv, N],
  ];
  const r = [suz, svz, sz];
  const det = (m) =>
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  const D = det(M);
  const sol = [0, 1, 2].map((c) => det(M.map((row, i) => row.map((x, j) => (j === c ? r[i] : x)))) / D);
  const [pa, pb, pc] = sol;
  const g = Math.hypot(pa, pb);
  const dir = [pa / g, pb / g];
  const poly = ccwPoly(face.map(([u, v]) => [u, v]));
  const zs = face.map((p) => p[2]);
  const zmin = Math.min(...zs);
  const zmax = Math.max(...zs);
  const n = Math.max(2, Math.round((zmax - zmin) / STEP));
  const cs = new CrossSection([poly]).intersect(new CrossSection([ccwPoly(FOOT)]));
  for (let i = 0; i < n; i++) {
    // strook waar het vlak tussen zmin + i*h en zmin + (i+1)*h ligt
    const h = (zmax - zmin) / n;
    const d0 = (zmin + i * h - pc) / g - 0.02;
    const d1 = (zmin + (i + 1) * h - pc) / g;
    const t = [-dir[1], dir[0]];
    const strip = [
      [dir[0] * d0 - t[0] * 100, dir[1] * d0 - t[1] * 100],
      [dir[0] * d1 - t[0] * 100, dir[1] * d1 - t[1] * 100],
      [dir[0] * d1 + t[0] * 100, dir[1] * d1 + t[1] * 100],
      [dir[0] * d0 + t[0] * 100, dir[1] * d0 + t[1] * 100],
    ];
    const piece = cs.intersect(new CrossSection([ccwPoly(strip)]));
    if (piece.area() < 0.05) continue;
    stairParts.push(Manifold.extrude(piece, zmin + (i + 1) * h - (zmin - 1.0)).translate([0, 0, z(zmin - 1.0)]));
  }
}
model = union([model, ...stairParts]);

// Dakinstallaties.
const bmuParts = [];
for (const m of BMU) {
  bmuParts.push(box(m.mast[0] - 0.8, m.mast[1] - 0.8, z(m.roof) - 0.01, m.mast[0] + 0.8, m.mast[1] + 0.8, z(m.top)));
  const [[ax, ay], [bx, by]] = m.arm;
  const L = Math.hypot(bx - ax, by - ay);
  const nx = (-(by - ay) / L) * 0.5;
  const ny = ((bx - ax) / L) * 0.5;
  bmuParts.push(
    prism(
      [
        [ax + nx, ay + ny],
        [ax - nx, ay - ny],
        [bx - nx, by - ny],
        [bx + nx, by + ny],
      ],
      z(m.roof) - 0.01,
      z(m.armTop),
    ),
  );
}
model = union([model, ...bmuParts]);

if (model.status() !== "NoError") throw Error(`Model kapot: ${model.status()}`);
// Nissen die achter een plantenbak of trap dichtvallen, worden ingesloten
// holtes (schillen met negatief volume); die vallen weg door alleen de
// buitenschil te houden. Losse stukken met eigen volume mogen niet voorkomen.
const pieces = model.decompose();
const loose = pieces.filter((p) => p.volume() > 0.01);
for (const p of loose.filter((q) => q.volume() < 1)) console.log("splinter", p.volume().toFixed(3), JSON.stringify(p.boundingBox()));
if (loose.filter((q) => q.volume() >= 1).length !== 1) throw Error(`Model niet verbonden: ${loose.map((p) => p.volume().toFixed(2))}`);
console.log("ingesloten holtes:", pieces.length - 1);
model = loose.reduce((x, y) => (x.volume() > y.volume() ? x : y));
const down = downFaces(model, BASE).filter((g) => g.area > 20);
console.log("ondervlakken > 20 m2:", JSON.stringify(down));
console.log({ glassPanels, stoneBays, recesses, terraces: terraces.length });

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Valley drie torens met natuurstenen terrasbakken en glazen gevels", model]],
  catalog: {
    name: "Valley",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Beethovenstraat (west) en het pad langs de zuidgevel, AHN5-DTM NAP
    // -0,5 tot -0,7 m (niet de lagere hoek bij de schuine gevel, -0,9).
    groundSamplePoints: [
      [-31, 55],
      [-31, 30],
      [-31, 0],
      [0, -75],
      [15, -75],
    ],
    replacesBuildings: ["NL.IMBAG.Pand.0363100012250045"],
    description:
      "Oorsprong midden in de bovengrondse voetafdruk op straatniveau NAP -0,7 m, +X op -0,3 graden in RD langs de noord- en zuidgevel, +Y naar het noorden; drie torens op een gezamenlijke onderbouw: Noordtoren tot NAP +99,4 m (dakopbouw +100,8, gevelonderhoudsmast +103,3), Zuidtoren tot +79,4 m (dakopbouw +82,3), Westtoren aan de Beethovenstraat tot +66,0 m (+67,2); aan de binnenkant een getrapte berg van natuurstenen terrassen op het verdiepingsraster (+6,2 tot +32,8 per 3,8 m, daarboven per 3,3 m) met plantenbakken, uitkragende bakken en vensters, aan de buitenkant glazen gevels met verdiepingsbanden; hoogtes en terrasvlakken uit AHN5 (2023), trappen uit de 3D BAG, gevelritme uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      northTowerNapM: 99.4,
      northTowerTopNapM: 100.8,
      southTowerNapM: 79.4,
      southTowerTopNapM: 82.3,
      westTowerNapM: 66.0,
      westTowerTopNapM: 67.2,
      officeStoreyM: OFFICE.pitch,
      homeStoreyM: HOMES.pitch,
      footprintM: [44.6, 139.4],
      axisDegrees: AXIS_DEG,
      terraces: terraces.length,
      estimates: [
        "terrasvlakken per verdieping uit AHN5 (drempel 0,6 m onder de vloer, gaten en uitsteeksels kleiner dan 2 m weggefilterd, facetten vereenvoudigd op 0,5 m)",
        "bakken op de natuurstenen wanden naar foto's, niet per bak gemeten: naad op elke vloer, op 60 % van de verdiepingen 40 tot 90 % van de wand terugliggend onder een kraag van 45 graden (1,8 m diep), daarnaast grote vensters",
        "glasbanden en stijlen per 3,0 m op de glazen gevels naar foto's",
        "grens tussen glas en natuursteen per toren naar foto's",
        "gevelonderhoudsinstallaties als mast en geparkeerde arm op het dak",
      ],
    },
    sources: [
      "PDOK BAG pand 0363100012250045 en Actueel_orthoHR; 2026-10-11",
      "AHN5 DSM/DTM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; het PDOK-AHN (AHN4) toont het complex nog in aanbouw",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012250045 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes ter controle en de hellende vlakken van de trappen",
      "https://nl.wikipedia.org/wiki/Valley_(Amsterdam) (100, 66 en 76 m; het AHN5 geeft de Zuidtoren 80 m boven straat, met dakopbouw 83 m)",
    ],
  },
});

// ---------- terrasvlakken (AHN5, gebouwstelsel) ----------
// Per niveau-index (LEVELS) en toren de veelhoeken van de vloer die op die
// hoogte ligt, met alles wat hoger ligt erbinnen. Afgeleid uit AHN5 (DSM
// 0,5 m, opname 2023) per 0,25 m in dit stelsel; zie de kop van dit script.
// ---- DATA BEGIN
function valleyData() {
  return [
    [1, "vallei", [[17.79, -69.27], [18.72, -68.77], [18.81, -69.27], [21.29, -69.27], [21.72, -68.86], [21.52, -68.31], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -6.04], [21.38, -5.62], [20.85, -5.87], [20.85, -6.45], [20.4, -6.07], [21.85, -5.41], [21.85, 10.44], [21.43, 10.53], [21.44, 11.96], [20.65, 12.07], [20.85, 12.84], [21.61, 12.76], [21.61, 13.63], [20.85, 13.92], [20.67, 13.71], [20.85, 13.92], [21.39, 13.71], [21.44, 19.08], [21.85, 19.25], [21.85, 32.64], [21.13, 33.05], [21.17, 35.5], [21.45, 35.5], [21.46, 36.69], [21.4, 36.73], [21.85, 36.99], [21.85, 41.48], [21.62, 41.42], [21.63, 42.63], [21.85, 42.67], [21.85, 45.42], [21.37, 45.65], [21.85, 46.05], [21.85, 53.87], [21.53, 53.97], [21.85, 70.15], [-22.76, 67.49], [-22.75, 47.04], [-21.75, 46.5], [-21.62, 47.53], [-19.17, 46.47], [-21.62, 47.53], [-21.75, 46.5], [-22.75, 47.04], [-22.75, 43], [-22.22, 42.65], [-21.75, 42.91], [-21.75, 43.58], [-16.25, 41.54], [-14.42, 41.05], [-16.25, 41.54], [-19.9, 42.89], [-20.31, 42.44], [-19.3, 40.44], [-20.47, 33.27], [-22.64, 32.37], [-22.65, 28.88], [-22.74, 28.82], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.71, 6.57], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-17.13, -18.37], [-16.06, -18.39], [-16.39, -17.45], [-14.71, -16.83], [-16.39, -17.45], [-14.71, -16.83], [-12.52, -19.71], [-11.56, -22.24], [-10.78, -22.04], [-10.29, -25.59], [-12.94, -27.52], [-13.26, -26.56], [-14.16, -27.04], [-11.67, -33.5], [-11.7, -33.53], [-7.97, -43.18], [-6.69, -43.17], [-6.68, -43.76], [-6.9, -43.17], [-7.53, -43.18], [-7.75, -43.77], [-6.97, -45.77], [-6.95, -45.77], [-6.73, -46.33], [-6.74, -46.37], [2.11, -69.28]]], // NAP +6.2
    [2, "vallei", [[17.79, -69.27], [18.72, -68.77], [18.81, -69.27], [21.29, -69.27], [21.72, -68.86], [21.52, -68.31], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -6.04], [21.38, -5.62], [20.85, -5.87], [20.85, -6.45], [20.4, -6.07], [21.85, -5.41], [21.85, 2.11], [20.96, 2.6], [20.85, 1.56], [19.79, 2.78], [19.42, 2.49], [19.5, 7.61], [20.32, 10.77], [21.43, 10.53], [21.44, 11.96], [20.65, 12.07], [20.85, 12.84], [21.61, 12.76], [21.61, 13.63], [20.85, 13.92], [20.67, 13.71], [20.85, 13.92], [21.39, 13.71], [21.44, 19.08], [20.85, 18.84], [20.91, 22], [21.85, 22.21], [21.85, 32.64], [21.13, 33.05], [21.17, 35.5], [21.45, 35.5], [21.46, 36.69], [21.4, 36.73], [21.85, 36.99], [21.85, 41.48], [21.62, 41.42], [21.63, 42.63], [21.85, 42.67], [21.85, 45.42], [21.37, 45.65], [21.85, 46.05], [21.85, 53.87], [21.53, 53.97], [21.85, 70.15], [-22.76, 67.49], [-22.75, 47.04], [-21.75, 46.5], [-21.62, 47.53], [-19.17, 46.47], [-21.62, 47.53], [-21.75, 46.5], [-22.75, 47.04], [-22.75, 43], [-22.22, 42.65], [-21.75, 42.91], [-21.75, 43.58], [-16.25, 41.54], [-14.42, 41.05], [-14.77, 40.48], [-14.3, 39.94], [-15.75, 35.04], [-15.25, 29.84], [-15.39, 29.76], [-18.04, 25.46], [-19.48, 25.72], [-20.79, 28.53], [-21.74, 28.34], [-20.79, 28.53], [-21.74, 28.34], [-21.74, 28.91], [-22.21, 29.17], [-22.74, 28.82], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-21.36, -5.19], [-18.71, -13.49], [-17.67, -13.46], [-17.97, -12.5], [-16.86, -12], [-10.93, -13.74], [-10.05, -15.06], [-9.72, -20.02], [-10.92, -20.99], [-10.29, -25.59], [-12.94, -27.52], [-13.26, -26.56], [-14.16, -27.04], [-11.67, -33.5], [-10.6, -32.62], [-10.47, -32.62], [-10.03, -31.79], [-7.89, -31.09], [-10.03, -31.79], [-10.74, -33.14], [-10.89, -32.86], [-11.7, -33.53], [-7.97, -43.18], [-6.69, -43.17], [-6.68, -43.76], [-6.9, -43.17], [-7.53, -43.18], [-7.75, -43.77], [-6.97, -45.77], [-6.95, -45.77], [-6.73, -46.33], [-6.74, -46.37], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +10
    [3, "west", [[17.79, -69.27], [18.72, -68.77], [18.81, -69.27], [21.29, -69.27], [21.72, -68.86], [21.52, -68.31], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -6.04], [21.38, -5.62], [20.85, -5.87], [20.85, -6.45], [18.18, -4.19], [17.71, -2.9], [18.07, -3.09], [18.22, 1.52], [19.42, 2.49], [19.5, 7.61], [20.85, 12.84], [21.61, 12.76], [21.61, 13.63], [20.85, 13.92], [20.67, 13.71], [20.85, 13.92], [21.39, 13.71], [21.44, 19.08], [20.85, 18.84], [20.91, 22], [21.85, 22.21], [21.85, 32.64], [21.13, 33.05], [21.17, 35.5], [21.45, 35.5], [21.46, 36.69], [21.4, 36.73], [21.85, 36.99], [21.85, 41.48], [21.62, 41.42], [21.63, 42.63], [21.85, 42.67], [21.85, 45.42], [21.37, 45.65], [21.85, 46.05], [21.85, 53.87], [21.53, 53.97], [21.85, 70.15], [-22.76, 67.49], [-22.75, 47.04], [-21.75, 46.5], [-21.62, 47.53], [-15.96, 45.08], [-15.01, 43.36], [-8.8, 38.09], [-5.28, 39.54], [-8.8, 38.09], [-11.68, 40.53], [-12.24, 40.14], [-11.96, 39.31], [-9.88, 37.77], [-10.38, 37.5], [-10.19, 33.52], [-12.96, 32.21], [-13.49, 30.93], [-15.39, 29.76], [-18.55, 24.64], [-19.09, 24.66], [-19.21, 23.42], [-18.32, 23.68], [-17.43, 24.09], [-17.6, 23.89], [-17.93, 23.79], [-17.6, 23.89], [-17.81, 23.65], [-19.07, 23.18], [-17.81, 23.65], [-18.76, 22.55], [-19.01, 22.44], [-19.19, 23.16], [-19.24, 23.15], [-19.16, 23.91], [-21.74, 24.62], [-21.74, 25.62], [-22.74, 25.32], [-22.74, 24.05], [-22.29, 23.79], [-22.74, 23.52], [-22.74, 22.76], [-22.28, 22.56], [-22.74, 22.13], [-22.71, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-21.36, -5.19], [-19.47, -11.1], [-18.42, -11.1], [-18.73, -10.14], [-17.69, -9.13], [-17.9, -8.58], [-13.19, -8.85], [-12.99, -9], [-11.9, -8.71], [-11.86, -8.06], [-12.01, -8], [-11.76, -7.85], [-11.46, -8.59], [-10.3, -8.28], [-10.34, -7.64], [-8.31, -8.44], [-9.93, -8.18], [-10.57, -8.35], [-7.69, -14.21], [-10.64, -9], [-7.69, -14.21], [-7.37, -14.28], [-7.72, -14.73], [-7.05, -16.06], [-7.47, -20.1], [-6.68, -23.39], [-5.23, -23.82], [-4.93, -28.43], [-7.06, -30.82], [-10.03, -31.79], [-10.74, -33.14], [-10.89, -32.86], [-11.7, -33.53], [-9.86, -38.28], [-9.13, -37.42], [-8.76, -38.37], [-7.8, -37.42], [-8.76, -38.37], [-9.13, -37.42], [-9.86, -38.28], [-7.97, -43.18], [-6.69, -43.17], [-6.68, -43.76], [-6.9, -43.17], [-7.53, -43.18], [-7.75, -43.77], [-6.97, -45.77], [-5.64, -45.65], [-5.74, -46.13], [-5.94, -45.68], [-6.58, -45.74], [-6.74, -46.37], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +13.8
    [3, "noord", [[-12.55, 41.28], [-15.21, 43.53], [-15.14, 43.59], [-15.96, 45.08], [-18.44, 46.15], [-18.84, 45.46], [-16.59, 43.79], [-17.14, 43.34], [-16.25, 41.54], [-12.89, 40.64]]], // NAP +13.8
    [4, "west", [[17.79, -69.27], [18.72, -68.77], [18.81, -69.27], [21.29, -69.27], [21.72, -68.86], [21.52, -68.31], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -6.04], [21.38, -5.62], [20.85, -5.87], [20.85, -6.45], [18.18, -4.19], [17.71, -2.9], [15.51, -1.76], [15.03, 0.71], [14.48, 0.85], [15, 1.46], [16.32, 7.38], [17.74, 10.28], [16.32, 7.38], [16.74, 9.28], [20.85, 13.92], [21.39, 13.71], [21.44, 19.08], [20.85, 18.84], [20.91, 22], [21.85, 22.21], [21.85, 32.64], [21.13, 33.05], [21.17, 35.5], [21.45, 35.5], [21.46, 36.69], [21.4, 36.73], [21.85, 36.99], [21.85, 41.48], [21.62, 41.42], [21.63, 42.63], [21.85, 42.67], [21.85, 45.42], [21.37, 45.65], [21.85, 46.05], [21.85, 53.87], [21.53, 53.97], [21.85, 70.15], [-22.76, 67.49], [-22.75, 47.04], [-21.75, 46.5], [-21.62, 47.53], [-15.96, 45.08], [-15.01, 43.36], [-8.8, 38.09], [-5.28, 39.54], [-8.8, 38.09], [-11.68, 40.53], [-12.24, 40.14], [-11.96, 39.31], [-8.43, 36.69], [-8.57, 36.62], [-7.93, 35.99], [-7.46, 34.23], [-5.39, 32.7], [-5.49, 31.22], [-6.63, 30.97], [-6.52, 30.15], [-7.36, 30.1], [-7.52, 30.77], [-8.74, 30.5], [-9.71, 29.84], [-9.37, 29.14], [-9.99, 28.96], [-10.32, 29], [-11.38, 28.53], [-11.86, 28.39], [-8.74, 30.5], [-11.86, 28.39], [-12.44, 28.21], [-11.86, 28.39], [-11.94, 28.33], [-12.44, 28.21], [-11.94, 28.33], [-12.27, 28.14], [-12.34, 28.06], [-15.13, 26.17], [-12.34, 28.06], [-14.08, 26.12], [-14.45, 26.63], [-15.13, 26.17], [-15.51, 25.34], [-15.07, 24.9], [-14.88, 24.98], [-14.8, 24.54], [-15.35, 24.7], [-15.82, 24.18], [-16.28, 24.22], [-15.62, 24.47], [-16.28, 24.22], [-16.43, 24.23], [-15.62, 24.47], [-16.43, 24.23], [-17.01, 24.28], [-15.72, 24.87], [-17.01, 24.28], [-17.24, 24.3], [-17.43, 24.09], [-18.32, 23.68], [-17.43, 24.09], [-17.6, 23.89], [-18.32, 23.68], [-17.6, 23.89], [-17.81, 23.65], [-19.07, 23.18], [-17.81, 23.65], [-18.76, 22.55], [-19.01, 22.44], [-19.19, 23.16], [-19.24, 23.15], [-19.16, 23.91], [-21.74, 24.62], [-21.74, 25.62], [-22.74, 25.32], [-22.74, 24.05], [-22.29, 23.79], [-22.74, 23.52], [-22.74, 22.76], [-22.28, 22.56], [-22.74, 22.13], [-22.71, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-21.36, -5.19], [-19.99, -9.47], [-18.93, -9.5], [-19.25, -8.5], [-13.19, -8.85], [-12.99, -9], [-11.9, -8.71], [-11.86, -8.06], [-12.01, -8], [-11.76, -7.85], [-11.46, -8.59], [-10.3, -8.28], [-10.34, -7.64], [-8.31, -8.44], [-9.93, -8.18], [-10.57, -8.35], [-7.69, -14.21], [-10.64, -9], [-7.69, -14.21], [-3.55, -15.15], [-1.5, -19.4], [-3.75, -24.4], [-3.79, -29.59], [-4.49, -30.19], [-4.13, -30.84], [-4.94, -31.11], [-4.88, -31.69], [-5.58, -31.6], [-6.23, -33.28], [-10.42, -33.75], [-10.89, -32.86], [-11.7, -33.53], [-9.86, -38.28], [-9.13, -37.42], [-8.76, -38.37], [-7.8, -37.42], [-8.76, -38.37], [-9.13, -37.42], [-9.86, -38.28], [-7.97, -43.18], [-6.69, -43.17], [-6.68, -43.76], [-6.9, -43.17], [-7.53, -43.18], [-7.75, -43.77], [-6.97, -45.77], [-5.64, -45.65], [-5.74, -46.13], [-5.94, -45.68], [-6.58, -45.74], [-6.74, -46.37], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +17.6
    [4, "noord", [[-12.55, 41.28], [-15.21, 43.53], [-15.14, 43.59], [-15.96, 45.08], [-18.44, 46.15], [-18.84, 45.46], [-16.59, 43.79], [-17.14, 43.34], [-16.25, 41.54], [-12.89, 40.64]]], // NAP +17.6
    [5, "west", [[0.83, -15.76], [-0.32, -13.43], [0.66, -11.27], [1.22, -10.74], [1.21, -11.19], [1.22, -10.74], [1.27, -10.7], [1.21, -11.19], [1.27, -10.7], [1.35, -10.62], [1.21, -11.19], [1.35, -10.62], [1.48, -10.5], [1.27, -9.92], [1.58, -9.25], [1.71, -9.25], [1.98, -8.22], [3.27, -7.71], [3.37, -7.24], [3.97, -7.57], [6, -5.49], [4.19, -7.71], [6, -5.49], [6, -2.29], [6.49, -2.54], [10.18, 0.13], [11.41, -0.79], [13.38, -0.42], [15, 1.46], [16.74, 9.28], [20.85, 13.92], [21.39, 13.71], [21.44, 19.08], [20.85, 18.84], [20.91, 22], [21.85, 22.21], [21.85, 32.64], [21.13, 33.05], [21.17, 35.5], [21.45, 35.5], [21.46, 36.69], [21.4, 36.73], [21.85, 36.99], [21.85, 41.48], [21.62, 41.42], [21.63, 42.63], [21.85, 42.67], [21.85, 45.42], [21.37, 45.65], [21.85, 46.05], [21.85, 53.87], [21.53, 53.97], [21.85, 70.15], [-22.76, 67.49], [-22.75, 47.04], [-21.75, 46.5], [-21.62, 47.53], [-15.96, 45.08], [-15.01, 43.36], [-8.8, 38.09], [-5.28, 39.54], [-8.8, 38.09], [-11.68, 40.53], [-12.24, 40.14], [-11.96, 39.31], [-8.43, 36.69], [-4.82, 38.58], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [3.93, 38.99], [3.96, 39.29], [2.7, 39.7], [1.83, 39.37], [1.91, 38.67], [3.89, 38.41], [3.89, 38.44], [3.95, 38.41], [1.91, 38.67], [1.83, 39.37], [-2.63, 37.71], [-2.65, 37.11], [-2.47, 37.02], [-2.29, 32.2], [-2.47, 37.02], [-2.29, 32.2], [-5.23, 30.22], [-7.36, 30.1], [-7.18, 29.4], [-7.26, 28.92], [-7.4, 29.01], [-7.91, 28.48], [-8.06, 28.71], [-9.61, 28.91], [-7.21, 29.5], [-9.61, 28.91], [-9.99, 28.96], [-8.21, 29.5], [-9.99, 28.96], [-10.32, 29], [-11.38, 28.53], [-12.44, 28.21], [-11.38, 28.53], [-11.7, 28.39], [-12.44, 28.21], [-11.7, 28.39], [-12.27, 28.14], [-14.08, 26.12], [-13.65, 25.53], [-14.88, 24.98], [-14.8, 24.54], [-15.35, 24.7], [-15.82, 24.18], [-16.28, 24.22], [-15.62, 24.47], [-16.28, 24.22], [-16.43, 24.23], [-15.62, 24.47], [-16.43, 24.23], [-17.24, 24.3], [-17.6, 23.89], [-18.32, 23.68], [-17.6, 23.89], [-17.81, 23.65], [-19.07, 23.18], [-17.81, 23.65], [-18.76, 22.55], [-19.01, 22.44], [-19.19, 23.16], [-19.24, 23.15], [-19.16, 23.91], [-21.74, 24.62], [-21.74, 25.62], [-22.74, 25.32], [-22.74, 24.05], [-22.29, 23.79], [-22.74, 23.52], [-22.74, 22.76], [-22.28, 22.56], [-22.74, 22.13], [-22.71, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-21.36, -5.19], [-20.56, -7.7], [-20.02, -7.84], [-20.39, -8.23], [-19.99, -9.47], [-18.93, -9.5], [-19.25, -8.5], [-13.35, -8.74], [-12.99, -9], [-11.9, -8.71], [-11.86, -8.06], [-12.01, -8], [-11.76, -7.85], [-11.46, -8.59], [-10.3, -8.28], [-10.34, -7.64], [-8.31, -8.44], [-9.93, -8.18], [-10.57, -8.35], [-7.69, -14.21], [-5.75, -14.5], [-3.85, -13], [-3.74, -13.54], [-3.11, -13.73], [-1.5, -16.48]]], // NAP +21.4
    [5, "noord", [[-15.14, 43.59], [-15.96, 45.08], [-18.44, 46.15], [-18.84, 45.46], [-15.68, 43.11]]], // NAP +21.4
    [5, "vallei", [[18.19, -9.71], [19.28, -7.82], [18.49, -7.03], [15.29, -7.29], [15, -8.25], [17.01, -10]]], // NAP +21.4
    [5, "zuid", [[17.79, -69.27], [18.72, -68.77], [18.81, -69.27], [21.29, -69.27], [21.72, -68.86], [21.52, -68.31], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -19.5], [20.85, -19.09], [20.85, -20.17], [17.18, -17.52], [14.94, -16.95], [12.26, -18.57], [20.72, -23.26], [20.85, -22.15], [20.72, -23.26], [12.73, -18.83], [12.55, -19.17], [12.05, -18.69], [11.54, -19], [11.53, -19.61], [12.22, -19.79], [9.76, -24.37], [8.79, -24], [7.56, -24.29], [6.53, -26.02], [6.06, -26.2], [6.05, -26.81], [9.68, -28.32], [9.6, -28.36], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.86, -30.9], [4.92, -29.91], [7.78, -28.41], [5.18, -26.5], [2.04, -28.31], [1.63, -27.93], [-0.58, -28.79], [-1.25, -29.79], [-0.75, -30.31], [-1.51, -30.79], [-1.85, -30.07], [-4.94, -31.11], [-4.75, -32.84], [-4.21, -32.5], [-4.21, -33.06], [-4.68, -32.8], [-5.39, -33.25], [-5.75, -35.36], [-8.76, -38.37], [-9.13, -37.42], [-9.86, -38.28], [-7.97, -43.18], [-6.69, -43.17], [-6.68, -43.76], [-6.9, -43.17], [-7.53, -43.18], [-7.75, -43.77], [-6.97, -45.77], [-5.64, -45.65], [-5.74, -46.13], [-5.94, -45.68], [-6.58, -45.74], [-6.74, -46.37], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +21.4
    [6, "west", [[-2.94, -12.29], [-1.6, -13.38], [1.22, -10.74], [1.21, -11.19], [1.22, -10.74], [1.27, -10.7], [1.21, -11.19], [1.27, -10.7], [1.35, -10.62], [1.21, -11.19], [1.35, -10.62], [1.48, -10.5], [1.05, -9.28], [1.71, -9.25], [1.98, -8.22], [3.27, -7.71], [3.37, -7.24], [3.97, -7.57], [6, -5.49], [6, 2.57], [5.18, 5.07], [5.92, 6.35], [5.29, 6.83], [7.41, 8.95], [6.19, 12.21], [6.14, 12.21], [6.09, 12.33], [6.31, 12.31], [5.95, 13.43], [5.61, 13.85], [5, 15.51], [5.61, 13.85], [4.43, 15.3], [4.99, 15.46], [5.74, 20.28], [7.07, 21.32], [12, 18.1], [12.79, 11.73], [15.69, 12.11], [15.22, 16.52], [20.85, 18.84], [20.91, 22], [21.85, 22.21], [21.85, 32.64], [21.13, 33.05], [21.17, 35.5], [21.45, 35.5], [21.46, 36.69], [21.4, 36.73], [21.85, 36.99], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.37, 45.65], [21.85, 46.05], [21.85, 53.87], [21.53, 53.97], [21.85, 70.15], [-18.05, 67.77], [-18.27, 66.76], [-17.96, 66.77], [-18.9, 64.55], [-21.76, 63.5], [-18.9, 64.55], [-21.76, 63.5], [-21.76, 64.5], [-22.76, 64.16], [-22.76, 62.7], [-22.31, 62.44], [-22.76, 62.18], [-22.75, 51], [-22.25, 50.64], [-22.75, 50.39], [-22.75, 47.04], [-21.75, 46.5], [-21.62, 47.53], [-15.96, 45.08], [-15.01, 43.36], [-8.8, 38.09], [-5.28, 39.54], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [3.93, 38.99], [3.96, 39.29], [2.7, 39.7], [1.83, 39.37], [1.91, 38.67], [3.89, 38.41], [3.89, 38.44], [4.61, 38], [5.11, 38.57], [6.56, 36.79], [9.49, 36.9], [9.45, 36.07], [9.19, 36.11], [10.74, 30.26], [10.47, 28.44], [10.97, 28.12], [10.79, 28], [10.22, 26.11], [9.78, 26.5], [7.97, 25.62], [6.7, 23.64], [-5.7, 28.86], [-6.12, 28.41], [-5.99, 28.14], [-7.4, 29.01], [-7.91, 28.48], [-8.06, 28.71], [-9.61, 28.91], [-7.21, 29.5], [-9.61, 28.91], [-9.99, 28.96], [-8.21, 29.5], [-9.99, 28.96], [-10.32, 29], [-11.38, 28.53], [-12.44, 28.21], [-11.38, 28.53], [-11.7, 28.39], [-12.44, 28.21], [-11.7, 28.39], [-12.27, 28.14], [-14.08, 26.12], [-13.65, 25.53], [-14.88, 24.98], [-14.8, 24.54], [-15.35, 24.7], [-15.82, 24.18], [-16.28, 24.22], [-15.62, 24.47], [-16.28, 24.22], [-17.24, 24.3], [-17.81, 23.65], [-19.07, 23.18], [-17.81, 23.65], [-18.76, 22.55], [-19.01, 22.44], [-19.19, 23.16], [-20.64, 23.07], [-20.31, 22.5], [-20.51, 22.38], [-20.73, 23.06], [-21.74, 22.99], [-21.85, 24.05], [-22.74, 23.52], [-22.74, 22.76], [-22.28, 22.56], [-22.74, 22.13], [-22.71, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-21.36, -5.19], [-20.56, -7.7], [-19.95, -7.86], [-19.58, -7.47], [-19.75, -6.92], [-18.09, -7.46], [-18.45, -8.11], [-17.99, -8.5], [-13.38, -8.72], [-12.99, -9], [-11.9, -8.71], [-11.86, -8.06], [-12.01, -8], [-11.76, -7.85], [-11.46, -8.59], [-10.3, -8.28], [-10.34, -7.64], [-8.31, -8.44], [-9.93, -8.18], [-10.57, -8.35], [-7.69, -14.21], [-5.75, -14.5]]], // NAP +25.2
    [6, "vallei", [[3.96, 27.81], [4.25, 28.57], [3.16, 29.66], [1.92, 29.09], [2.06, 27.79]]], // NAP +25.2
    [6, "vallei", [[9.77, 3.07], [9.71, 6.19], [9, 6.49], [7.5, 4.93], [8.37, 2.93]]], // NAP +25.2
    [6, "zuid", [[17.79, -69.27], [18.72, -68.77], [18.81, -69.27], [21.29, -69.27], [21.72, -68.86], [21.52, -68.31], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -22.64], [20.85, -22.15], [20.72, -23.26], [12.73, -18.83], [9.76, -24.37], [8.79, -24], [7.56, -24.29], [6.53, -26.02], [6.06, -26.2], [6.05, -26.81], [9.68, -28.32], [9.6, -28.36], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.86, -30.9], [4.92, -29.91], [7.78, -28.41], [5.18, -26.5], [2.04, -28.31], [1.63, -27.93], [-0.58, -28.79], [-1.25, -29.79], [-0.75, -30.31], [-1.51, -30.79], [-1.85, -30.07], [-4.94, -31.11], [-4.75, -32.84], [-4.21, -32.5], [-4.23, -34.98], [-4.56, -34.88], [-4.74, -35.59], [-6.75, -38.46], [-6.68, -43.76], [-6.9, -43.17], [-7.53, -43.18], [-7.75, -43.77], [-6.97, -45.77], [-5.64, -45.65], [-5.74, -46.13], [-5.94, -45.68], [-6.58, -45.74], [-6.74, -46.37], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +25.2
    [7, "noord", [[19.9, 35.23], [19.83, 35.5], [21.45, 35.5], [21.46, 36.69], [21.4, 36.73], [21.85, 36.99], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-18.05, 67.77], [-18.27, 66.76], [-16.2, 66.88], [-17.75, 63.43], [-17.77, 63.54], [-21.76, 61.57], [-21.76, 62.24], [-22.21, 62.5], [-22.76, 62.18], [-22.75, 51], [-22.25, 50.63], [-21.75, 50.88], [-21.75, 51.58], [-16.16, 48.01], [-13.43, 45.19], [-12.62, 43.78], [-11.89, 44.1], [-13.43, 49.19], [-17.25, 52.51], [-13.43, 49.19], [-10.84, 40.67], [-6.59, 40.5], [-5.71, 41.83], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [3.93, 38.99], [3.89, 38.44], [4.61, 38], [5.11, 38.57], [6.56, 36.79], [9.49, 36.9], [9.45, 36.07], [11.07, 35.87], [10.78, 35.33], [11.8, 34.14], [12.47, 34.63], [11.77, 35.78], [11.24, 35.85], [11.77, 35.78], [12.67, 34.3], [12, 33.91], [12.75, 33.04], [13.31, 33.22], [13.4, 32.47], [15.39, 32.35]]], // NAP +29
    [7, "vallei", [[19.62, 22.14], [19.39, 22.83], [20.85, 23], [20.9, 22], [21.85, 22.21], [21.85, 32.64], [20.85, 33.2], [20.85, 32.18], [18.19, 31.05], [15.36, 31.17], [12.68, 29.31], [12.88, 28.91], [12.44, 29.14], [10.79, 28], [9.94, 25.18], [13.08, 18.39]]], // NAP +29
    [7, "west", [[1.22, -10.74], [1.21, -11.19], [1.22, -10.74], [1.27, -10.7], [1.21, -11.19], [1.27, -10.7], [1.35, -10.62], [1.33, -10.7], [1.35, -10.62], [1.48, -10.5], [1.05, -9.28], [1.71, -9.25], [1.98, -8.22], [3.27, -7.71], [3.37, -7.24], [3.97, -7.57], [6, -5.49], [6, 2.57], [5.18, 5.07], [5.92, 6.35], [5.29, 6.83], [7.41, 8.95], [6.19, 12.21], [6.14, 12.21], [6.09, 12.33], [6.31, 12.31], [5.95, 13.43], [3.69, 16.21], [2.88, 16.45], [3.24, 17.02], [1.51, 19], [-0.03, 18.42], [-1.45, 19.63], [-2.07, 19.67], [-2.29, 20.68], [-2.07, 20.66], [-2.09, 20.77], [-1.39, 20.74], [-1, 22.01], [-1.58, 23.46], [-4.27, 24.72], [-5.99, 28.14], [-7.4, 29.01], [-7.91, 28.48], [-8.06, 28.71], [-9.99, 28.96], [-8.21, 29.5], [-9.99, 28.96], [-10.32, 29], [-11.38, 28.53], [-12.44, 28.21], [-11.38, 28.53], [-12.27, 28.14], [-14.08, 26.12], [-13.65, 25.53], [-14.88, 24.98], [-14.8, 24.54], [-15.35, 24.7], [-15.82, 24.18], [-17.24, 24.3], [-18.76, 22.55], [-19.01, 22.44], [-19.19, 23.16], [-20.64, 23.07], [-20.31, 22.5], [-20.51, 22.38], [-20.73, 23.06], [-21.74, 22.99], [-21.85, 24.05], [-22.74, 23.52], [-22.74, 22.76], [-22.28, 22.56], [-22.74, 22.13], [-22.71, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-21.36, -5.19], [-20.56, -7.7], [-19.95, -7.86], [-19.58, -7.47], [-19.75, -6.92], [-18.09, -7.46], [-18.45, -8.11], [-17.99, -8.5], [-13.39, -8.71], [-12.99, -9], [-11.9, -8.71], [-11.86, -8.06], [-12.01, -8], [-11.76, -7.85], [-11.46, -8.59], [-10.3, -8.28], [-10.34, -7.64], [-8.31, -8.44], [-9.93, -8.18], [-8.31, -8.44], [-7.28, -8.84], [-6.87, -8.49], [-6.72, -9.15], [-6.91, -8.99], [-6.72, -9.15], [-6.71, -9.19], [-1.6, -13.38]]], // NAP +29
    [7, "zuid", [[17.79, -69.27], [18.72, -68.77], [18.81, -69.27], [21.29, -69.27], [21.72, -68.86], [21.52, -68.31], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -25], [20.85, -25], [20.85, -26], [17.3, -26.79], [13.58, -32.48], [13.76, -32.5], [13.46, -33.04], [13.32, -32.87], [14.97, -30.36], [14.68, -29.88], [14.97, -30.36], [16.54, -27.96], [16.3, -27.49], [14.51, -27.42], [16.3, -27.49], [16.54, -27.96], [17.3, -26.79], [19.99, -26.19], [19.98, -25.46], [14.79, -24.5], [11.39, -25], [8.79, -24], [7.56, -24.29], [6.53, -26.02], [6.06, -26.2], [6.05, -26.81], [9.68, -28.32], [13.14, -26.75], [9.68, -28.32], [5.29, -26.5], [9.68, -28.32], [9.6, -28.36], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.86, -30.9], [4.92, -29.91], [7.78, -28.41], [5.18, -26.5], [2.04, -28.31], [0.89, -32.52], [-0.99, -32.93], [0.89, -32.52], [1.74, -29.43], [1.24, -29.06], [-2.41, -31.36], [-2.73, -30.65], [-3.53, -30.88], [-3.69, -31.5], [-3.2, -31.86], [-4.21, -32.5], [-4.23, -34.98], [-4.56, -34.88], [-4.74, -35.59], [-6.75, -38.51], [-6.04, -41.22], [-5.53, -45.14], [-5.74, -46.13], [-5.94, -45.68], [-6.58, -45.74], [-6.74, -46.37], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +29
    [8, "noord", [[18.43, 34.79], [18.41, 35.48], [17.06, 35.79], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5], [18.79, 35.75], [18.92, 35.75], [19.65, 36.17], [19.83, 35.5], [21.45, 35.5], [21.46, 36.69], [21.4, 36.73], [21.85, 36.99], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-16.79, 67.85], [-17.22, 66.82], [-16.2, 66.88], [-17.75, 63.43], [-16.29, 54.7], [-17.25, 52.51], [-13.43, 49.19], [-10.84, 40.67], [-6.59, 40.5], [-5.71, 41.83], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [3.93, 38.99], [3.89, 38.44], [4.61, 38], [5.11, 38.57], [6.56, 36.79], [9.49, 36.9], [9.45, 36.07], [11.07, 35.87], [10.78, 35.33], [11.8, 34.14], [12.47, 34.63], [11.77, 35.78], [11.24, 35.85], [11.77, 35.78], [12.67, 34.3], [12, 33.91], [12.75, 33.04]]], // NAP +32.8
    [8, "vallei", [[21.85, 22.21], [21.85, 29.83], [20.85, 30], [20.85, 29], [17.79, 30], [12.92, 28.59], [12.75, 24.4], [13.43, 23.12], [16.46, 22.5], [20.85, 23], [20.9, 22]]], // NAP +32.8
    [8, "west", [[1.22, -10.74], [1.21, -11.19], [1.22, -10.74], [1.27, -10.7], [1.21, -11.19], [1.27, -10.7], [1.35, -10.62], [1.21, -11.19], [1.35, -10.62], [1.48, -10.5], [1.05, -9.28], [1.71, -9.25], [1.98, -8.22], [3.27, -7.71], [4.12, -3.92], [3.49, -3.6], [3.97, -3.01], [3.78, -2.4], [4.47, -2.37], [5, -0.04], [4.56, 2.19], [3.77, 2.15], [3.94, 4.34], [4, 4.69], [3.95, 4.4], [3.16, 4.56], [3.24, 4.78], [7.41, 8.95], [6.19, 12.21], [6.14, 12.21], [6.09, 12.33], [6.31, 12.31], [5.95, 13.43], [3.69, 16.21], [1.7, 16.8], [1.33, 16.28], [0.71, 17.18], [0.17, 17.31], [0.25, 17.41], [-0.31, 17.65], [0.1, 18.31], [-1.45, 19.63], [-2.07, 19.67], [-2.29, 20.68], [-2.07, 20.66], [-2.38, 22.28], [-4.13, 22.85], [-4.47, 22.13], [-4.67, 22.26], [-4.39, 22.93], [-5.81, 23.39], [-6, 23.27], [-6.83, 26.88], [-8.06, 28.71], [-10.32, 29], [-12.27, 28.14], [-14.08, 26.12], [-13.65, 25.53], [-14.88, 24.98], [-14.8, 24.54], [-15.35, 24.7], [-15.82, 24.18], [-17.24, 24.3], [-18.76, 22.55], [-21.67, 21.25], [-18.76, 22.55], [-18.8, 22.51], [-18.65, 22.28], [-21.74, 21.23], [-21.74, 21.66], [-17.24, 24.3], [-21.74, 21.66], [-21.74, 22.32], [-22.28, 22.56], [-22.74, 22.13], [-22.71, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-21.36, -5.19], [-20.56, -7.7], [-19.95, -7.86], [-19.58, -7.47], [-19.75, -6.92], [-18.09, -7.46], [-18.45, -8.11], [-17.99, -8.5], [-13.39, -8.71], [-12.99, -9], [-11.9, -8.71], [-11.86, -8.06], [-12.01, -8], [-11.76, -7.85], [-11.46, -8.59], [-10.3, -8.28], [-10.34, -7.64], [-8.31, -8.44], [-9.93, -8.18], [-8.31, -8.44], [-7.28, -8.84], [-6.87, -8.49], [-6.72, -9.15], [-6.91, -8.99], [-6.72, -9.15], [-6.71, -9.19], [-1.6, -13.38]]], // NAP +32.8
    [8, "zuid", [[17.79, -69.27], [18.72, -68.77], [18.81, -69.27], [21.29, -69.27], [21.72, -68.86], [21.52, -68.31], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -25], [20.85, -25], [20.85, -26], [17.3, -26.79], [13.58, -32.48], [13.76, -32.5], [13.46, -33.04], [13.32, -32.87], [14.97, -30.36], [14.68, -29.88], [14.97, -30.36], [16.54, -27.96], [16.3, -27.49], [13.49, -27.38], [13.58, -27.18], [13.14, -26.75], [9.68, -28.32], [5.29, -26.5], [9.68, -28.32], [9.6, -28.36], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.86, -30.9], [4.92, -29.91], [7.78, -28.41], [5.18, -26.5], [2.04, -28.31], [0.89, -32.52], [-0.99, -32.93], [0.89, -32.52], [1.74, -29.43], [1.24, -29.06], [-4.21, -32.5], [-4.23, -34.98], [-3.57, -35.17], [-3.75, -35.46], [-3.47, -36.5], [-4.25, -36.6], [-4.25, -37.11], [-6.2, -39.98], [-5.47, -45.63], [-4.64, -45.59], [-4.75, -48.31], [-5.88, -45.82], [-5.26, -47.23], [-5.23, -47.42], [-5.5, -46.76], [-6.23, -46.9], [-6.22, -47.71], [-6.13, -47.95], [-5.75, -47.86], [-5.75, -48.69], [-5.4, -49.17], [-5.26, -50.12], [-4.38, -50.76], [-3.84, -50.32], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -51.04], [-3.53, -50.94], [-3.69, -51.5], [-3.93, -50.86], [-4.47, -50.79], [-4.83, -51.31], [-4.01, -53.43], [-2.75, -53.19], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +32.8
    [9, "noord", [[14.96, 35.67], [15.71, 35.65], [15.88, 36.36], [16.13, 36.25], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5], [18.79, 35.75], [18.92, 35.75], [19.65, 36.17], [19.83, 35.5], [21.45, 35.5], [21.46, 36.69], [21.4, 36.73], [21.85, 36.99], [21.85, 40.61], [21.17, 40.24], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-11.78, 68.14], [-11.9, 67.14], [-10.88, 67.2], [-10.64, 65.57], [-10.88, 67.2], [-10.64, 65.57], [-13.28, 60.75], [-11.8, 56.44], [-11.97, 52.98], [-13.46, 52.19], [-13.75, 51.01], [-11.89, 48.7], [-6.51, 47.84], [-6.25, 48.53], [-4.42, 47.36], [-3.95, 47.64], [-3.8, 45.37], [-4.75, 43.61], [-4.32, 46.85], [-4.4, 46.99], [-4.76, 43.58], [-4.94, 43.25], [-6.15, 42.02], [-4.94, 43.25], [-5.71, 41.83], [-6.25, 41.01], [-5.71, 41.83], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [3.93, 38.99], [3.89, 38.44], [4.61, 38], [5.11, 38.57], [6.56, 36.79], [9.49, 36.9], [9.45, 36.07], [11.77, 35.78], [12.67, 34.3]]], // NAP +36.2
    [9, "west", [[1.22, -10.74], [1.21, -11.19], [1.22, -10.74], [1.27, -10.7], [1.21, -11.19], [1.27, -10.7], [1.48, -10.5], [0.6, -8.03], [1.34, -7.92], [1.45, -5.11], [2.05, -5.34], [3.97, -3.01], [3.18, -0.43], [3.27, 0.13], [2.72, 0.43], [3.71, 1.31], [3.94, 4.34], [4, 4.69], [3.95, 4.4], [3.16, 4.56], [3.24, 4.78], [7.41, 8.95], [6.19, 12.21], [6.14, 12.21], [6.09, 12.33], [3.91, 12.54], [0.71, 17.18], [0.17, 17.31], [0.25, 17.41], [-1.23, 18.05], [-1.66, 17.67], [-2.29, 19.68], [-2.07, 19.67], [-2.29, 20.68], [-3.68, 20.81], [-3.45, 21.49], [-4.67, 22.26], [-5.23, 20.96], [-4.46, 20.89], [-5.23, 20.96], [-4.97, 21.57], [-6.56, 22.94], [-6, 23.27], [-6.83, 26.88], [-8.06, 28.71], [-10.32, 29], [-12.27, 28.14], [-14.08, 26.12], [-13.65, 25.53], [-14.88, 24.98], [-14.8, 24.54], [-15.35, 24.7], [-15.82, 24.18], [-17.24, 24.3], [-18.76, 22.55], [-21.67, 21.25], [-18.76, 22.55], [-18.8, 22.51], [-18.65, 22.28], [-21.74, 21.23], [-21.74, 21.5], [-22.7, 21.11], [-22.7, 21.3], [-22.7, 21.11], [-22.74, 21.09], [-22.71, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-21.36, -5.19], [-20.56, -7.7], [-19.95, -7.86], [-19.58, -7.47], [-19.75, -6.92], [-16.43, -8], [-19.75, -6.92], [-19.76, -6.62], [-19.01, -6.77], [-18.89, -6.48], [-17.19, -7.71], [-14.6, -7.85], [-12.99, -9], [-14.6, -7.85], [-14.41, -7.86], [-14.23, -7.15], [-14.02, -7.25], [-14.44, -7.97], [-12.99, -9], [-11.9, -8.71], [-11.86, -8.06], [-12.01, -8], [-11.76, -7.85], [-11.46, -8.59], [-10.3, -8.28], [-10.34, -7.64], [-8.31, -8.44], [-9.93, -8.18], [-8.31, -8.44], [-7.28, -8.84], [-6.87, -8.49], [-6.72, -9.15], [-6.91, -8.99], [-6.72, -9.15], [-6.71, -9.19], [-1.6, -13.38]]], // NAP +36.2
    [9, "zuid", [[17.79, -69.27], [18.72, -68.77], [18.81, -69.27], [21.29, -69.27], [21.72, -68.86], [21.52, -68.31], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -25], [20.85, -25], [20.85, -26], [17.3, -26.79], [13.58, -32.48], [13.76, -32.5], [13.46, -33.04], [13.32, -32.87], [14.97, -30.36], [14.68, -29.88], [14.97, -30.36], [16.54, -27.96], [16.3, -27.49], [13.49, -27.38], [12.31, -30.06], [11.67, -30.11], [11.46, -30.61], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.86, -30.9], [4.92, -29.91], [7.78, -28.41], [5.18, -26.5], [2.04, -28.31], [0.89, -32.52], [-1.81, -33.11], [-2.24, -33.97], [-2.8, -33.91], [-3.75, -35.46], [-2.45, -40.25], [-1.97, -39.77], [-1.68, -40.35], [-2.93, -40.52], [-3.75, -42.57], [-3.71, -42.68], [-3.64, -43.93], [-3.71, -42.68], [-3.49, -43.27], [-3.47, -44.16], [-4.46, -45.31], [-4.74, -48.34], [-4.64, -45.54], [-4.75, -48.31], [-5.88, -45.82], [-5.04, -47.71], [-5.75, -47.86], [-5.75, -48.69], [-5.4, -49.17], [-5.26, -50.12], [-4.38, -50.76], [-3.84, -50.32], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -51.04], [-3.53, -50.94], [-3.69, -51.5], [-3.93, -50.86], [-4.47, -50.79], [-4.83, -51.31], [-4.01, -53.43], [-2.75, -53.19], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +36.2
    [10, "noord", [[21.46, 36.69], [21.01, 36.96], [20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-7.97, 68.37], [-8.25, 67.35], [-7.25, 67.41], [-6.93, 65.43], [-8.15, 61.26], [-8.43, 61.21], [-9.25, 57.51], [-7.29, 55.49], [-7.79, 55.36], [-8.56, 52.68], [-7.44, 49.29], [-4.42, 47.36], [-3.95, 47.64], [-3.8, 45.37], [-4.75, 43.61], [-4.26, 47.26], [-4.71, 44.01], [-4.36, 47.32], [-4.76, 43.58], [-4.94, 43.25], [-6.15, 42.02], [-4.94, 43.25], [-5.71, 41.83], [-6.25, 41.01], [-5.71, 41.83], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [3.93, 38.99], [3.89, 38.44], [4.61, 38], [5.11, 38.57], [6.56, 36.79], [10.05, 36.92], [10.46, 37.45], [10.76, 36.93], [12.55, 37.15], [12.56, 37.22], [12.56, 37.15], [13.63, 37.29], [13.68, 38.03], [14.04, 37.94], [13.72, 37.25], [14.58, 36.66], [14.68, 36.93], [16.13, 36.25], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5], [18.79, 35.75], [18.92, 35.75], [19.65, 36.17], [19.83, 35.5], [21.45, 35.5]]], // NAP +39.4
    [10, "west", [[1.22, -10.74], [1.21, -11.19], [1.22, -10.74], [1.48, -10.5], [0.6, -8.03], [1.34, -7.92], [1.47, -4.49], [1.25, -4.04], [0.59, -4.16], [0.71, -3.31], [0.2, -3], [0.5, -2.79], [1.5, -0.04], [1.64, -0.52], [3.71, 1.31], [3.95, 4.4], [3.16, 4.56], [3.24, 4.78], [7.41, 8.95], [6.19, 12.21], [6.14, 12.21], [6.09, 12.33], [3.91, 12.54], [0.71, 17.18], [0.17, 17.31], [-0.19, 16.85], [1.75, 13.15], [1.37, 13.07], [1.42, 13.46], [0.51, 15.38], [-0.22, 15.19], [-0.33, 16.56], [-1.91, 16.93], [-1.55, 17.31], [-2.29, 19.68], [-2.07, 19.67], [-2.29, 20.68], [-5.23, 20.96], [-4.97, 21.57], [-8.11, 24.27], [-10.86, 24], [-13.11, 25.77], [-14.88, 24.98], [-14.47, 22.57], [-15.68, 21.83], [-14.47, 22.57], [-14.39, 22.06], [-14.77, 21.76], [-14.68, 21.23], [-16.96, 22], [-18.26, 21.71], [-18.65, 22.28], [-21.74, 21.23], [-21.74, 21.5], [-22.7, 21.11], [-22.7, 21.3], [-22.7, 21.11], [-22.74, 21.09], [-22.71, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-21.36, -5.19], [-21.03, -6.21], [-19.77, -6.89], [-19.72, -5.74], [-18.65, -5.84], [-18.89, -6.48], [-17.19, -7.71], [-14.41, -7.86], [-14.23, -7.15], [-13.51, -7.5], [-12.83, -7.12], [-12.8, -7.68], [-12.01, -8], [-10.38, -7.08], [-10.34, -7.64], [-7.28, -8.84], [-6.87, -8.49], [-6.72, -9.15], [-6.91, -8.99], [-6.72, -9.15], [-6.71, -9.19], [-1.6, -13.38]]], // NAP +39.4
    [10, "zuid", [[17.79, -69.27], [18.72, -68.77], [18.81, -69.27], [21.29, -69.27], [21.72, -68.86], [21.52, -68.31], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -25], [20.85, -25], [20.85, -26], [17.3, -26.79], [13.58, -32.48], [13.76, -32.5], [13.46, -33.04], [13.32, -32.87], [14.97, -30.36], [14.68, -29.88], [11.67, -30.11], [11.46, -30.61], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.8, -31.83], [4.23, -31.58], [1.28, -34.55], [1.77, -35.18], [2.03, -35.02], [2.52, -35.46], [3.04, -34.31], [2.52, -35.46], [2.03, -35.02], [-0.96, -36.81], [-1.29, -39.09], [-1.97, -39.77], [-1.68, -40.35], [-2.93, -40.52], [-3.75, -42.57], [-3.49, -43.27], [-3.47, -44.16], [-4.46, -45.31], [-4.74, -48.34], [-4.64, -45.54], [-4.75, -48.31], [-5.88, -45.82], [-5.04, -47.71], [-5.75, -47.86], [-5.75, -48.69], [-5.4, -49.17], [-5.26, -50.12], [-4.38, -50.76], [-3.84, -50.32], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -51.04], [-3.53, -50.94], [-3.69, -51.5], [-3.93, -50.86], [-4.47, -50.79], [-4.83, -51.31], [-4.01, -53.43], [-2.75, -53.19], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +39.4
    [10, "zuid", [[1.77, -35.18], [1.28, -34.55], [3.12, -32.69], [2.8, -32.11], [-1.81, -33.11], [-2.25, -33.94], [-1.15, -36.92]]], // NAP +39.4
    [11, "noord", [[21.46, 36.69], [21.01, 36.96], [20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-6.23, 68.48], [-6.67, 67.45], [-5.58, 67.51], [-5.75, 65.01], [-1.79, 61.05], [-1.24, 61.27], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-1.95, 59.8], [-1.61, 60.87], [-3.14, 62.4], [-3.68, 62.21], [-3.69, 62.13], [-8.43, 61.21], [-9.25, 57.51], [-5.72, 53.86], [-6.32, 53.59], [-5.77, 52.05], [-5, 52.21], [-4.81, 49.75], [-4.09, 49.78], [-3.8, 45.37], [-4.75, 43.61], [-4.3, 47.94], [-4.75, 43.61], [-5.71, 41.83], [-6.25, 41.01], [-5.71, 41.83], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [3.93, 38.99], [3.89, 38.44], [4.61, 38], [5.11, 38.57], [6.56, 36.79], [10.05, 36.92], [10.46, 37.45], [10.76, 36.93], [12.55, 37.15], [12.56, 37.22], [12.56, 37.15], [13.63, 37.29], [13.68, 38.03], [14.04, 37.94], [13.72, 37.25], [14.58, 36.66], [14.68, 36.93], [16.13, 36.25], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5], [18.79, 35.75], [18.92, 35.75], [19.65, 36.17], [19.83, 35.5], [21.45, 35.5]]], // NAP +42.8
    [11, "west", [[1.48, -10.5], [0.03, -6.41], [-0.51, -6.33], [0.48, -5], [0.71, -3.31], [0.2, -3], [0.5, -2.79], [1.5, -0.04], [1.25, 0.81], [1.92, 0.8], [3.24, 4.78], [7.41, 8.95], [6.19, 12.21], [6.14, 12.21], [6.09, 12.33], [2.32, 12.68], [2, 13.21], [1.75, 13.15], [-0.11, 16.71], [1.75, 13.15], [1.37, 13.07], [1.42, 13.46], [0.51, 15.38], [-0.22, 15.19], [-0.33, 16.56], [-1.91, 16.93], [-1.55, 17.31], [-2.29, 19.68], [-2.07, 19.67], [-2.29, 20.68], [-5.45, 20.98], [-5.47, 19.87], [-5.87, 19.89], [-6.01, 20], [-7.67, 20], [-8.3, 20.04], [-7.74, 20], [-7.89, 19.29], [-9.46, 20], [-9.86, 19.91], [-9.82, 20.59], [-6.51, 20.52], [-6.37, 21.28], [-12.49, 23.5], [-14.77, 21.76], [-14.68, 21.23], [-16.96, 22], [-18.27, 21.71], [-19.23, 20.57], [-19.04, 20.07], [-15.78, 19.64], [-15.62, 18.85], [-16.26, 18.65], [-15.65, 19.01], [-15.78, 19.64], [-19.04, 20.07], [-19.42, 21.05], [-20.37, 21.13], [-20.47, 20.26], [-21.74, 20.42], [-21.74, 21.5], [-22.7, 21.11], [-22.7, 21.3], [-22.7, 21.11], [-22.74, 21.09], [-22.71, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-21.36, -5.19], [-21.03, -6.21], [-19.77, -6.89], [-19.72, -5.74], [-16.89, -6], [-14.99, -6.78], [-13.51, -7.5], [-12.83, -7.12], [-12.8, -7.68], [-12.01, -8], [-9.87, -6.79], [-10.02, -6.14], [-7.16, -6.33], [-6.77, -6.55], [-7.23, -6.9], [-6.71, -9.19], [-1.6, -13.38]]], // NAP +42.8
    [11, "zuid", [[17.79, -69.27], [18.72, -68.77], [18.6, -68.13], [17.65, -68], [18.94, -67.34], [19.93, -66.98], [20.02, -66.84], [20.37, -67.54], [20.7, -67.39], [20.85, -68.27], [21.85, -68.32], [21.85, -66.57], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -25], [20.85, -25], [20.85, -26], [17.3, -26.79], [13.58, -32.48], [13.76, -32.5], [13.46, -33.04], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.8, -31.83], [4.23, -31.58], [1.28, -34.55], [1.77, -35.18], [2.03, -35.02], [2.52, -35.46], [3.04, -34.31], [2.52, -35.46], [2.03, -35.02], [-0.96, -36.81], [-1.29, -39.09], [-1.97, -39.77], [-1.68, -40.35], [-2.93, -40.52], [-3.75, -42.57], [-3.49, -43.27], [-3.47, -44.16], [-4.46, -45.31], [-4.74, -48.34], [-4.64, -45.54], [-4.75, -48.31], [-5.88, -45.82], [-5.04, -47.71], [-5.75, -47.86], [-5.75, -48.69], [-5.4, -49.17], [-5.26, -50.12], [-4.38, -50.76], [-3.84, -50.32], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -51.04], [-3.53, -50.94], [-3.69, -51.5], [-3.93, -50.86], [-4.47, -50.79], [-4.83, -51.31], [-4.01, -53.43], [-2.75, -53.19], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +42.8
    [12, "noord", [[21.46, 36.69], [21.01, 36.96], [20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-6.23, 68.48], [-6.67, 67.45], [-5.58, 67.51], [-5.75, 65.01], [-1.79, 61.05], [-1.24, 61.27], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-1.95, 59.8], [-1.61, 60.87], [-3.14, 62.4], [-3.68, 62.21], [-3.69, 62.13], [-8.43, 61.21], [-9.25, 57.51], [-5.72, 53.86], [-5.14, 54.12], [-4.81, 49.75], [-4.09, 49.78], [-3.8, 45.37], [-4.75, 43.61], [-4.3, 47.94], [-4.75, 43.61], [-5.71, 41.83], [-6.25, 41.01], [-5.71, 41.83], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [3.93, 38.99], [3.89, 38.44], [4.61, 38], [5.11, 38.57], [6.56, 36.79], [10.05, 36.92], [10.46, 37.45], [10.76, 36.93], [12.55, 37.15], [12.56, 37.22], [12.56, 37.15], [13.63, 37.29], [13.68, 38.03], [14.04, 37.94], [13.72, 37.25], [14.58, 36.66], [14.68, 36.93], [16.13, 36.25], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5], [18.79, 35.75], [18.92, 35.75], [19.65, 36.17], [19.83, 35.5], [21.45, 35.5]]], // NAP +46
    [12, "west", [[-7.16, -6.33], [-6.26, -6.4], [-6.04, -6.5], [-5.68, -6.45], [-5.8, -7.08], [-5.04, -7.5], [-0.71, -6.61], [0.48, -5], [0.71, -3.31], [0.2, -3], [0.5, -2.79], [1.5, -0.04], [1.11, 1.3], [0.48, 1.34], [1, 2.57], [0.85, 2.88], [1.52, 2.79], [1.74, 3.28], [7.41, 8.95], [6.19, 12.21], [6.14, 12.21], [6.09, 12.33], [2.32, 12.68], [2, 13.21], [1.75, 13.15], [-0.11, 16.71], [1.75, 13.15], [1.37, 13.07], [1.42, 13.46], [0.51, 15.38], [-0.22, 15.19], [-0.33, 16.56], [-1.91, 16.93], [-1.55, 17.31], [-2.29, 19.68], [-5.87, 19.89], [-6.01, 20], [-7.67, 20], [-8.3, 20.04], [-7.74, 20], [-7.89, 19.29], [-9.46, 20], [-9.86, 19.91], [-9.82, 20.59], [-5.46, 20.5], [-9.86, 20.6], [-10.96, 21], [-13.06, 20.25], [-13.14, 20.7], [-16.96, 22], [-18.27, 21.71], [-19.23, 20.57], [-19.04, 20.07], [-15.78, 19.64], [-15.62, 18.85], [-16.26, 18.65], [-15.65, 19.01], [-15.78, 19.64], [-21.74, 20.42], [-21.74, 21.5], [-22.7, 21.11], [-22.7, 21.3], [-22.7, 21.11], [-22.74, 21.09], [-22.71, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.71, 15.56], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.9, -1.87], [-22.3, -2.26], [-21.55, -4.58], [-21, -4.89], [-20.53, -4.51], [-20.69, -4], [-17.96, -5.33], [-17.56, -4.55], [-17.18, -4.75], [-17.57, -4.78], [-17.7, -5.46], [-13.51, -7.5], [-10.98, -6.07], [-7.16, -6.33], [-5.04, -7.5]]], // NAP +46
    [12, "zuid", [[17.79, -69.27], [18.72, -68.77], [18.6, -68.13], [17.65, -68], [18.94, -67.34], [19.93, -66.98], [20.14, -66.68], [20.81, -66.32], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -31], [20.85, -31.24], [20.85, -32.37], [19.19, -32.95], [16.68, -32.74], [16.41, -33.29], [15.94, -32.79], [13.76, -32.5], [13.46, -33.04], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.66, -33.97], [4.22, -33.69], [3.04, -34.31], [2.52, -35.46], [2.03, -35.02], [-0.96, -36.81], [-1.29, -39.09], [-1.97, -39.77], [-1.68, -40.35], [-2.93, -40.52], [-3.75, -42.57], [-3.49, -43.27], [-3.47, -44.16], [-4.46, -45.31], [-4.74, -48.34], [-4.64, -45.54], [-4.75, -48.31], [-5.88, -45.82], [-5.04, -47.71], [-5.75, -47.86], [-5.75, -48.69], [-5.4, -49.17], [-5.26, -50.12], [-4.38, -50.76], [-3.84, -50.32], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -51.04], [-3.53, -50.94], [-3.69, -51.5], [-3.93, -50.86], [-4.47, -50.79], [-4.83, -51.31], [-4.01, -53.43], [-2.75, -53.19], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +46
    [13, "noord", [[21.46, 36.69], [21.01, 36.96], [20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-6.23, 68.48], [-6.67, 67.45], [-5.58, 67.51], [-5.75, 65.01], [-1.79, 61.05], [-1.24, 61.27], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-1.95, 59.8], [-1.61, 60.87], [-3.14, 62.4], [-3.68, 62.21], [-3.85, 60.48], [-4.43, 60.75], [-5.46, 59.69], [-5.69, 56.57], [-5.04, 56.35], [-4.99, 56.42], [-4.56, 55.7], [-5.25, 55.48], [-5.21, 55.01], [-5.72, 56.17], [-5.21, 55.01], [-4.81, 49.75], [-4.09, 49.78], [-3.8, 45.37], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [4.75, 39.33], [4.75, 39.01], [6.56, 36.79], [10.05, 36.92], [10.46, 37.45], [10.76, 36.93], [12.55, 37.15], [12.56, 37.22], [12.56, 37.15], [13.63, 37.29], [13.68, 38.03], [14.04, 37.94], [13.72, 37.25], [14.58, 36.66], [14.68, 36.93], [16.13, 36.25], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5], [18.79, 35.75], [18.92, 35.75], [19.65, 36.17], [19.83, 35.5], [21.45, 35.5]]], // NAP +49.4
    [13, "west", [[-4.05, -6.21], [-1.72, -3.62], [-1.65, -3.48], [-1.12, -3.94], [0.5, -2.79], [1.5, -0.04], [1.11, 1.3], [0.48, 1.34], [1, 2.57], [0.85, 2.88], [1.52, 2.79], [1.74, 3.28], [7.41, 8.95], [6.19, 12.21], [6.14, 12.21], [6.09, 12.33], [2.32, 12.68], [2, 13.21], [1.75, 13.15], [-0.11, 16.71], [1.75, 13.15], [1.37, 13.07], [1.42, 13.46], [0.51, 15.38], [-0.22, 15.19], [-0.33, 16.56], [-1.91, 16.93], [-1.55, 17.31], [-2.29, 19.68], [-5.87, 19.89], [-6.01, 20], [-7.67, 20], [-8.3, 20.04], [-7.74, 20], [-7.89, 19.29], [-9.46, 20], [-9.86, 19.91], [-9.82, 20.59], [-10.96, 21], [-13.06, 20.25], [-12.93, 19.5], [-13.57, 19.5], [-16.26, 18.65], [-15.65, 19.01], [-15.78, 19.64], [-21.74, 20.42], [-21.74, 21.5], [-22.74, 21.09], [-22.7, 17.68], [-22.74, 17.67], [-22.74, 15.55], [-22.26, 15.6], [-22.41, 15.42], [-22.53, 7.67], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-22.5, -0.32], [-22.48, -1.67], [-21.3, -2.08], [-21.49, -1], [-20.05, -1.65], [-21.49, -1], [-20.05, -1.65], [-18.58, -3.99], [-18.13, -4.24], [-17.78, -3.95], [-17.88, -4.37], [-17.18, -4.75], [-14.49, -4.53], [-14.33, -4.12], [-13.41, -5.01], [-14.14, -4.5], [-13.41, -5.01], [-12.69, -5.71], [-12.38, -5.73], [-11.99, -6], [-6.26, -6.4], [-6.04, -6.5]]], // NAP +49.4
    [13, "zuid", [[17.79, -69.27], [18.72, -68.77], [18.6, -68.13], [17.65, -68], [18.79, -67.39], [19.93, -66.98], [20.14, -66.68], [20.81, -66.32], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -33], [20.85, -33.09], [20.85, -34.96], [19.75, -35.29], [19.65, -35.84], [19.3, -35.59], [19.65, -35.43], [19.35, -34.64], [17.25, -35.3], [17.19, -35.89], [13.79, -34], [9.54, -35.81], [9.1, -37.04], [8.93, -36.53], [9.29, -36.51], [9.54, -35.81], [14.14, -33.85], [14.36, -34.13], [14.35, -34.31], [17.19, -35.89], [17.25, -35.3], [18.04, -35.05], [15.94, -32.79], [13.76, -32.5], [13.46, -33.04], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.66, -33.97], [4.22, -33.69], [3.04, -34.31], [1.73, -37.21], [2.11, -37.37], [0.78, -39.49], [1.09, -39.97], [-2.93, -40.52], [-3.75, -42.57], [-3.49, -43.27], [-3.47, -44.16], [-4.46, -45.31], [-4.74, -48.34], [-4.64, -45.54], [-4.75, -48.31], [-5.88, -45.82], [-5.04, -47.71], [-5.75, -47.86], [-5.75, -48.69], [-5.4, -49.17], [-5.26, -50.12], [-4.38, -50.76], [-3.84, -50.32], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -51.04], [-3.53, -50.94], [-3.69, -51.5], [-3.93, -50.86], [-4.47, -50.79], [-4.83, -51.31], [-4.01, -53.43], [-2.75, -53.19], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +49.4
    [14, "noord", [[18.79, 35.75], [18.92, 35.75], [20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-6.23, 68.48], [-6.67, 67.45], [-5.58, 67.51], [-5.75, 65.01], [-1.79, 61.05], [-1.24, 61.27], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-1.95, 59.8], [-1.61, 60.87], [-3.14, 62.4], [-3.68, 62.21], [-3.85, 60.48], [-4.43, 60.75], [-5.46, 59.69], [-5.69, 56.57], [-5.04, 56.35], [-4.99, 56.42], [-4.56, 55.7], [-5.25, 55.48], [-5.21, 55.01], [-5.72, 56.17], [-5.21, 55.01], [-4.81, 49.75], [-4.09, 49.78], [-3.8, 45.37], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [4.75, 39.33], [4.75, 39.01], [6.56, 36.79], [10.05, 36.92], [10.46, 37.45], [10.76, 36.93], [12.55, 37.15], [12.56, 37.22], [12.56, 37.15], [13.63, 37.29], [13.68, 38.03], [14.96, 37.7], [14.68, 36.93], [16.13, 36.25], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5]]], // NAP +52.6
    [14, "west", [[-4.05, -6.21], [-1.72, -3.62], [0.15, 0.22], [-0.26, 0.67], [0.28, 0.88], [1, 2.57], [0.85, 2.88], [1.52, 2.79], [1.74, 3.28], [7.41, 8.95], [6.19, 12.21], [2.41, 12.54], [2, 13.21], [1.37, 13.07], [1.42, 13.46], [0.51, 15.38], [-0.22, 15.19], [-0.33, 16.56], [-6.52, 18.01], [-6.82, 17.32], [-8.48, 18.47], [-3.55, 17.32], [-4.04, 17.54], [-3.63, 18.24], [-6.01, 20], [-7.74, 20], [-7.89, 19.29], [-9.46, 20], [-11.69, 19.51], [-13.57, 19.5], [-16.26, 18.65], [-13.99, 20], [-16.26, 18.65], [-17.71, 18.19], [-17.81, 17.73], [-18.31, 17.44], [-18.48, 17.54], [-18.95, 17.14], [-21.74, 17], [-21.74, 18], [-22.74, 17.67], [-22.74, 15.55], [-22.26, 15.6], [-22.41, 15.42], [-22.53, 7.67], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-21.25, 3.06], [-22.73, 3.05], [-22.73, 0.19], [-22.24, -0.19], [-21.73, 0.06], [-21.73, 0.77], [-20.76, 0.17], [-20.26, 0.59], [-20.09, 0.17], [-18.7, -0.53], [-18.5, -0.06], [-18.41, -0.12], [-17.72, -1.24], [-18.41, -0.12], [-17.23, -0.93], [-18.31, -1.6], [-17.71, -3.71], [-14.12, -3.56], [-14.33, -4.12], [-12.69, -5.71], [-8.94, -5.92], [-8.75, -5.21], [-7.02, -6.04], [-12.69, -5.71], [-7.02, -6.04], [-6.04, -6.5]]], // NAP +52.6
    [14, "zuid", [[17.79, -69.27], [18.72, -68.77], [18.6, -68.13], [17.65, -68], [18.79, -67.39], [19.93, -66.98], [20.2, -66.59], [20.81, -66.32], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -33], [20.85, -33.09], [20.85, -34.96], [19.75, -35.29], [19.65, -35.84], [19.3, -35.59], [19.65, -35.43], [19.35, -34.64], [17.25, -35.3], [17.19, -35.89], [13.79, -34], [9.54, -35.81], [9.1, -37.04], [8.93, -36.53], [9.29, -36.51], [9.54, -35.81], [14.14, -33.85], [14.36, -34.13], [14.35, -34.31], [17.19, -35.89], [17.25, -35.3], [18.04, -35.05], [15.94, -32.79], [13.76, -32.5], [13.46, -33.04], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.66, -33.97], [4.22, -33.69], [3.04, -34.31], [1.73, -37.21], [2.11, -37.37], [0.78, -39.49], [1.09, -39.97], [-2.93, -40.52], [-3.75, -42.57], [-3.25, -43.9], [-3.69, -44.42], [-3.33, -44.98], [-4.43, -45.3], [-3.25, -43.9], [-4.46, -45.31], [-4.74, -48.34], [-4.64, -45.54], [-4.75, -48.31], [-5.88, -45.82], [-5.04, -47.71], [-5.75, -47.86], [-5.75, -48.69], [-5.4, -49.17], [-5.26, -50.12], [-4.38, -50.76], [-3.84, -50.32], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -51.04], [-3.53, -50.94], [-3.69, -51.5], [-3.93, -50.86], [-4.47, -50.79], [-4.83, -51.31], [-4.01, -53.43], [-2.75, -53.19], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +52.6
    [15, "noord", [[18.79, 35.75], [18.92, 35.75], [20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-6.23, 68.48], [-6.67, 67.45], [-5.58, 67.51], [-5.75, 65.01], [-1.79, 61.05], [-1.24, 61.27], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-1.95, 59.8], [-1.61, 60.87], [-3.14, 62.4], [-3.68, 62.21], [-3.9, 59.97], [-4.74, 58.26], [-4.02, 57.84], [-4.99, 56.42], [-4.56, 55.7], [-5.25, 55.48], [-4.81, 49.75], [-4.09, 49.78], [-3.8, 45.37], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [4.75, 39.33], [4.75, 39.01], [6.56, 36.79], [10.05, 36.92], [10.46, 37.45], [10.76, 36.93], [12.55, 37.15], [12.56, 37.22], [12.56, 37.15], [13.63, 37.29], [13.68, 38.03], [14.96, 37.7], [14.68, 36.93], [16.13, 36.25], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5]]], // NAP +56
    [15, "west", [[-4.05, -6.21], [-1.72, -3.62], [0.15, 0.22], [-0.26, 0.67], [0.28, 0.88], [1, 2.57], [0.86, 2.84], [0.49, 5.18], [0.86, 2.84], [-0.23, 4.93], [0.42, 5.03], [0.77, 7.36], [0.43, 10.93], [1.13, 10.91], [1.42, 13.46], [0.51, 15.38], [-0.22, 15.19], [-0.33, 16.56], [-6.52, 18.01], [-6.82, 17.32], [-8.48, 18.47], [-3.55, 17.32], [-9.46, 20], [-11.69, 19.51], [-13.57, 19.5], [-17.71, 18.19], [-17.92, 17.21], [-18.48, 17.54], [-21.46, 15], [-21.61, 15.67], [-22.26, 15.6], [-22.41, 15.42], [-22.53, 7.67], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-20.09, 0.17], [-18.7, -0.53], [-18.5, -0.06], [-18.41, -0.12], [-17.72, -1.24], [-18.41, -0.12], [-17.23, -0.93], [-18.31, -1.6], [-17.71, -3.71], [-12.57, -3.5], [-10.7, -3.5], [-10.86, -4.2], [-6.04, -6.5]]], // NAP +56
    [15, "zuid", [[3.43, -69.28], [3.01, -68.28], [4.04, -68.28], [3.01, -68.28], [3.43, -69.28], [13.34, -69.27], [13.69, -68.75], [13.95, -69.24], [16.52, -68.8], [16.42, -68.25], [19.93, -66.98], [20.2, -66.59], [19.93, -66.98], [20.2, -66.59], [20.8, -66.32], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -33], [20.85, -33.09], [20.85, -34.96], [19.75, -35.29], [19.65, -35.84], [19.3, -35.59], [19.65, -35.43], [19.35, -34.64], [17.25, -35.3], [17.19, -35.89], [13.79, -34], [9.54, -35.81], [9.1, -37.04], [8.93, -36.53], [9.29, -36.51], [9.54, -35.81], [14.14, -33.85], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.49, -36.71], [3.04, -36.79], [2.22, -39.98], [2.79, -40.33], [3.7, -39.52], [4.65, -36.79], [7.9, -36.59], [4.65, -36.79], [3.95, -38.8], [8.46, -38.44], [8.24, -37.78], [9.01, -37.28], [8.24, -37.78], [8.46, -38.44], [14.11, -38], [16.9, -36.7], [14.11, -38], [4.58, -38.75], [0.54, -42.31], [0.48, -42.66], [0.26, -42.55], [2.79, -40.33], [2.01, -39.85], [2.26, -39.81], [2.81, -37.68], [2.11, -37.37], [0.78, -39.49], [1.09, -39.97], [-2.93, -40.52], [-3.75, -42.57], [-3.25, -43.9], [-3.69, -44.42], [-3.33, -44.98], [-4.43, -45.3], [-3.25, -43.9], [-4.46, -45.31], [-4.74, -48.34], [-4.64, -45.54], [-4.75, -48.31], [-5.88, -45.82], [-5.04, -47.71], [-5.75, -47.86], [-5.75, -48.69], [-5.4, -49.17], [-5.26, -50.12], [-4.38, -50.76], [-3.84, -50.32], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -51.04], [-3.53, -50.94], [-3.69, -51.5], [-3.93, -50.86], [-4.47, -50.79], [-4.83, -51.31], [-4.01, -53.43], [-2.75, -53.19], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [2.11, -69.28]]], // NAP +56
    [16, "noord", [[18.79, 35.75], [18.92, 35.75], [20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-6.23, 68.48], [-6.67, 67.45], [-5.58, 67.51], [-5.75, 65.01], [-1.79, 61.05], [-1.24, 61.27], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-1.95, 59.8], [-1.61, 60.87], [-3.14, 62.4], [-3.68, 62.21], [-4, 58.97], [-3.5, 58.68], [-3.39, 58.76], [-4.99, 56.42], [-4.56, 55.7], [-5.25, 55.48], [-4.81, 49.75], [-4.09, 49.78], [-3.8, 45.37], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [3.12, 40.63], [2.74, 40.24], [2.94, 39.62], [4.03, 39.26], [4.2, 39.1], [4.75, 39.33], [4.75, 39.01], [6.56, 36.79], [10.05, 36.92], [10.46, 37.45], [10.76, 36.93], [12.55, 37.15], [12.56, 37.22], [12.56, 37.15], [13.63, 37.29], [13.68, 38.03], [14.96, 37.7], [14.68, 36.93], [16.13, 36.25], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5]]], // NAP +59.2
    [16, "west", [[-12.57, -3.5], [-6.01, -3.5], [-2.49, -0.18], [-6.01, -3.5], [-2, 1.01], [-0.89, 7.71], [-2, 1.01], [-2.37, 0.6], [-1.96, 0.02], [0.28, 0.88], [1, 2.57], [-0.23, 4.93], [0.42, 5.03], [0.77, 7.36], [0.43, 10.93], [-0.36, 10.96], [-0.26, 11.55], [-1.23, 13.36], [-0.68, 13.36], [-0.15, 14.4], [-0.33, 16.56], [-6.52, 18.01], [-6.82, 17.32], [-8.48, 18.47], [-0.33, 16.56], [-6.18, 17.94], [-0.11, 16.69], [0.18, 13.62], [-0.49, 13.75], [-0.68, 13.36], [-1.23, 13.36], [-0.37, 11.76], [0.33, 11.97], [-0.11, 16.69], [-6.18, 17.94], [-8.44, 18.47], [-8.6, 18.44], [-9.09, 18.54], [-8.6, 18.44], [-9.53, 18.23], [-9.4, 18.78], [-10.33, 19.52], [-13.57, 19.5], [-17.71, 18.19], [-18.59, 14.17], [-19.39, 10.96], [-21.73, 7.13], [-21.79, 7.71], [-22.43, 7.85], [-22.73, 7.33], [-22.6, 3.24], [-22.53, 3.05], [-21.72, 3.06], [-21.71, 4.22], [-20.09, 0.17], [-18.7, -0.53], [-18.5, -0.06], [-18.41, -0.12], [-17.72, -1.24], [-18.41, -0.12], [-17.23, -0.93], [-18.31, -1.6], [-17.71, -3.71]]], // NAP +59.2
    [16, "zuid", [[3.43, -69.28], [3.01, -68.28], [4.04, -68.28], [3.01, -68.28], [3.43, -69.28], [13.34, -69.27], [13.69, -68.75], [13.95, -69.24], [16.52, -68.8], [16.42, -68.25], [19.93, -66.98], [20.75, -65.81], [19.93, -66.98], [20.75, -65.81], [20.78, -66.32], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -33], [20.85, -33.09], [20.85, -34.96], [19.75, -35.29], [19.65, -35.84], [19.3, -35.59], [19.65, -35.43], [19.35, -34.64], [17.25, -35.3], [17.19, -35.89], [13.79, -34], [9.54, -35.81], [9.1, -37.04], [8.93, -36.53], [9.29, -36.51], [9.54, -35.81], [14.14, -33.85], [10.01, -28.86], [8.03, -28.27], [4.92, -29.91], [4.49, -36.71], [3.04, -36.79], [2.22, -39.98], [2.79, -40.33], [3.7, -39.52], [4.65, -36.79], [7.9, -36.59], [4.65, -36.79], [3.95, -38.8], [8.46, -38.44], [8.24, -37.78], [9.01, -37.28], [8.24, -37.78], [8.46, -38.44], [14.11, -38], [16.9, -36.7], [14.11, -38], [4.58, -38.75], [0.54, -42.31], [0.48, -42.66], [0.26, -42.55], [2.79, -40.33], [2.01, -39.85], [-2.93, -40.52], [-3.75, -42.57], [-3.25, -43.9], [-3.69, -44.42], [-3.33, -44.98], [-4.43, -45.3], [-3.25, -43.9], [-4.46, -45.31], [-4.74, -48.34], [-4.64, -45.54], [-4.75, -48.31], [-5.88, -45.82], [-5.04, -47.71], [-5.75, -47.86], [-5.75, -48.69], [-5.4, -49.17], [-5.26, -50.12], [-4.38, -50.76], [-3.84, -50.32], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [1.66, -67.37], [1.43, -67.51], [2.11, -69.28]]], // NAP +59.2
    [17, "noord", [[18.79, 35.75], [18.92, 35.75], [20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-6.23, 68.48], [-6.67, 67.45], [-5.58, 67.51], [-5.75, 65.01], [-1.79, 61.05], [-1.24, 61.27], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-1.95, 59.8], [-1.61, 60.87], [-3.14, 62.4], [-3.68, 62.21], [-4, 58.97], [-3.5, 58.68], [-3.39, 58.76], [-4.71, 56.83], [-4.08, 58.21], [-4.71, 56.83], [-4.99, 56.42], [-4.56, 55.7], [-5.25, 55.48], [-4.81, 49.75], [-3.95, 49.78], [-3.96, 49.05], [-1.5, 48.35], [-1.14, 48.94], [-1.96, 49.81], [-2.39, 53.54], [-3.89, 54.11], [-3.88, 54.54], [-3.55, 53.98], [-1.73, 53.28], [-1.58, 53.02], [-2.32, 52.9], [-1.96, 49.81], [0.7, 46.98], [1.29, 47.24], [1.54, 44.29], [3.61, 43.8], [3.27, 43.24], [4.74, 41.55], [4.74, 40.45], [4.74, 41.55], [3.27, 43.24], [3.61, 43.8], [1.92, 44.2], [1.58, 43.83], [1.29, 47.24], [0.7, 46.98], [-1.14, 48.94], [-1.5, 48.35], [-3.39, 48.89], [-3.76, 48.4], [-2.51, 46.36], [-2.27, 46.16], [-2.83, 45.75], [-2.9, 45.94], [-3.48, 45.97], [-6.06, 41.18], [-4.44, 37.79], [-3.18, 37.5], [2.51, 39.62], [2.43, 40.32], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [4.75, 40.14], [4.75, 39.01], [6.56, 36.79], [10.05, 36.92], [10.46, 37.45], [10.76, 36.93], [12.55, 37.15], [12.56, 37.22], [12.56, 37.15], [13.63, 37.29], [13.68, 38.03], [16.83, 37.21], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5]]], // NAP +62.6
    [17, "west", [[-2.49, -0.18], [-6.01, -3.5], [-2, 1.01], [-0.26, 11.55], [-1.23, 13.36], [-0.68, 13.36], [-0.15, 14.4], [-0.33, 16.56], [-6.52, 18.01], [-6.82, 17.32], [-8.48, 18.47], [-0.33, 16.56], [-8.44, 18.47], [-11.67, 17.75], [-12.29, 17.38], [-18.21, 15.69], [-19.5, 10.54], [-19.5, 4.01], [-18.08, 2.05], [-17.56, 2.11], [-18.5, -0.06], [-18.41, -0.12], [-17.72, -1.24], [-18.41, -0.12], [-13.49, -3.5], [-6.01, -3.5]]], // NAP +62.6
    [17, "west", [[0.28, 0.88], [1, 2.57], [-0.61, 5.66], [-1.25, 5.56], [-2, 1.01], [-2.37, 0.6], [-1.96, 0.02]]], // NAP +62.6
    [17, "zuid", [[13.34, -69.27], [13.69, -68.75], [13.43, -68.27], [12.88, -68.27], [13.18, -67.5], [13.63, -67.92], [13.32, -68.06], [13.95, -69.24], [16.52, -68.8], [16.42, -68.25], [19.93, -66.98], [20.75, -65.81], [19.93, -66.98], [20.75, -65.81], [20.78, -66.32], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -33], [20.85, -33.09], [20.85, -34.96], [19.75, -35.29], [19.65, -35.84], [19.3, -35.59], [19.65, -35.43], [19.35, -34.64], [17.25, -35.3], [17.19, -35.89], [13.79, -34], [9.54, -35.81], [9.1, -37.04], [8.93, -36.53], [4.65, -36.79], [3.95, -38.8], [8.46, -38.44], [8.24, -37.78], [9.01, -37.28], [8.24, -37.78], [8.46, -38.44], [14.11, -38], [16.9, -36.7], [14.11, -38], [4.58, -38.75], [0.54, -42.31], [0.48, -42.66], [-0.13, -42.36], [-1.33, -43.74], [-0.97, -44.31], [-4.46, -45.31], [-4.74, -48.34], [-4.63, -45.42], [-4.74, -48.34], [-5.88, -45.82], [-5.04, -47.71], [-5.75, -47.86], [-5.75, -48.69], [-5.4, -49.17], [-5.26, -50.12], [-4.38, -50.76], [-3.84, -50.32], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.35, -62.28], [1.17, -66.83], [1.66, -67.37], [2.29, -66.98], [1.92, -66.01], [2.58, -66.71], [3.21, -66.3], [3.04, -65.9], [3.25, -65.66], [3.04, -65.9], [4.04, -68.28], [3.01, -68.28], [3.43, -69.28]]], // NAP +62.6
    [17, "zuid", [[3.7, -39.52], [4.68, -36.7], [3.04, -36.79], [2.22, -39.98], [2.79, -40.33]]], // NAP +62.6
    [18, "noord", [[18.79, 35.75], [18.92, 35.75], [20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-6.23, 68.48], [-6.67, 67.45], [-5.58, 67.51], [-5.75, 65.01], [-1.79, 61.05], [-1.24, 61.27], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-1.95, 59.8], [-1.61, 60.87], [-1.95, 59.8], [-3.39, 58.76], [-4.99, 56.42], [-4.56, 55.7], [-5.25, 55.48], [-4.81, 49.75], [-3.95, 49.78], [-3.96, 49.05], [-1.5, 48.35], [-1.14, 48.94], [-1.96, 49.81], [-2.39, 53.54], [-3.89, 54.11], [-3.88, 54.54], [-3.55, 53.98], [-1.73, 53.28], [-1.58, 53.02], [-2.32, 52.9], [-1.96, 49.81], [0.7, 46.98], [1.29, 47.24], [1.54, 44.29], [3.61, 43.8], [3.27, 43.24], [4.74, 41.55], [4.74, 40.45], [4.74, 41.55], [3.27, 43.24], [3.61, 43.8], [1.92, 44.2], [1.58, 43.83], [1.29, 47.24], [0.7, 46.98], [-1.14, 48.94], [-1.5, 48.35], [-3.39, 48.89], [-3.76, 48.4], [-2.51, 46.36], [-2.27, 46.16], [-2.83, 45.75], [-0.94, 40.79], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [4.75, 40.14], [4.75, 39.01], [6.56, 36.79], [10.05, 36.92], [10.46, 37.45], [10.76, 36.93], [12.55, 37.15], [12.56, 37.22], [12.56, 37.15], [13.63, 37.29], [13.68, 38.03], [16.83, 37.21], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5]]], // NAP +66
    [18, "west", [[-2, 1.01], [-0.26, 11.55], [-2.47, 15.67], [-4.43, 15.68], [-8.49, 18.47], [-11.67, 17.75], [-16.68, 14.72], [-17, 3.39], [-18.5, -0.06], [-13.49, -3.5], [-6.01, -3.5]]], // NAP +66
    [18, "zuid", [[13.34, -69.27], [13.69, -68.75], [13.43, -68.27], [12.88, -68.27], [13.18, -67.5], [13.63, -67.92], [13.32, -68.06], [13.95, -69.24], [16.52, -68.8], [16.42, -68.25], [19.93, -66.98], [20.75, -65.81], [19.93, -66.98], [20.75, -65.81], [20.78, -66.32], [21.43, -66.47], [21.85, -65.75], [21.85, -64.58], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.82, -35.96], [20.85, -36.7], [20.93, -36.13], [21.85, -35.77], [21.85, -33], [20.85, -33.09], [20.85, -34.96], [19.75, -35.29], [19.65, -35.84], [19.3, -35.59], [19.65, -35.43], [19.35, -34.64], [17.25, -35.3], [17.19, -35.89], [13.79, -34], [9.54, -35.81], [9.1, -37.04], [8.93, -36.53], [4.65, -36.79], [3.95, -38.8], [8.46, -38.44], [8.24, -37.78], [9.01, -37.28], [8.24, -37.78], [8.46, -38.44], [14.11, -38], [16.9, -36.7], [14.11, -38], [4.58, -38.75], [0.54, -42.31], [0.26, -43.96], [-4.46, -45.31], [-4.74, -48.37], [-5.04, -47.71], [-5.75, -47.86], [-5.75, -48.69], [-5.04, -49.67], [-4.33, -49.26], [-4.6, -48.69], [-3.36, -50.28], [-2.75, -50.07], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.01, -62.36], [0.35, -61.95], [0.16, -61.46], [1.31, -61.48], [2.49, -64.14], [2.79, -64.27], [2.36, -64.68], [2.54, -65.19], [3.33, -65.44], [3.25, -65.66], [3.04, -65.9], [4.04, -68.28], [3.01, -68.28], [3.43, -69.28]]], // NAP +66
    [18, "zuid", [[3.7, -39.52], [4.68, -36.7], [3.04, -36.79], [2.22, -39.98], [2.79, -40.33]]], // NAP +66
    [19, "noord", [[18.79, 35.75], [18.92, 35.75], [20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-6.23, 68.48], [-6.67, 67.45], [-5.58, 67.51], [-5.75, 65.01], [-1.79, 61.05], [-1.24, 61.27], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-1.95, 59.8], [-1.61, 60.87], [-1.95, 59.8], [-3.39, 58.76], [-4.99, 56.42], [-3.55, 53.98], [-1.73, 53.28], [-1.58, 53.02], [-2.32, 52.9], [-1.96, 49.81], [0.7, 46.98], [1.29, 47.24], [1.54, 44.29], [3.61, 43.8], [3.27, 43.24], [4.74, 41.55], [4.74, 40.45], [4.74, 41.55], [3.27, 43.24], [3.61, 43.8], [1.92, 44.2], [1.58, 43.83], [1.29, 47.24], [0.7, 46.98], [-1.14, 48.94], [-1.5, 48.35], [-3.39, 48.89], [-3.76, 48.4], [-2.51, 46.36], [-2.27, 46.16], [-2.83, 45.75], [-0.94, 40.79], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [4.75, 40.14], [4.75, 39.01], [6.56, 36.79], [10.05, 36.92], [11.13, 38.31], [12.55, 37.9], [12.55, 38.78], [12.42, 38.98], [12.55, 39.02], [12.55, 38.32], [16.83, 37.21], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5]]], // NAP +67.2
    [19, "noord", [[-1.14, 48.94], [-1.96, 49.81], [-2.39, 53.54], [-3.89, 54.11], [-3.96, 49.05], [-1.5, 48.35]]], // NAP +67.2
    [19, "west", [[-6.58, -1.21], [-6.5, 0.86], [-4.5, 3.46], [-4.5, 6.31], [-6.6, 9.55], [-5.62, 11.9], [-6.81, 13.71], [-8.12, 14], [-9.88, 11.9], [-9.18, 10.43], [-10.15, 8.55], [-11.57, 7.68], [-15.71, 7.71], [-16, 2.5], [-15, 1.5], [-11.2, 0.96], [-9.37, -1.5]]], // NAP +67.2
    [19, "zuid", [[20.93, -36.13], [21.85, -35.77], [21.85, -34.07], [20.85, -33.88], [20.85, -34.96], [19.75, -35.29], [19.65, -35.84], [20.85, -36.7]]], // NAP +67.2
    [19, "zuid", [[6.9, -69.28], [7.16, -68.82], [7.43, -69.28], [13.34, -69.27], [13.69, -68.75], [13.43, -68.27], [12.88, -68.27], [13.18, -67.5], [13.63, -67.92], [16.25, -66.68], [17.06, -65.72], [16.6, -65.15], [17.7, -64.59], [17.57, -63.92], [18.74, -64], [19.15, -63.61], [19.31, -64.15], [21.64, -64.55], [21.65, -62.9], [21.85, -62.83], [21.85, -59.58], [21.68, -59.5], [21.68, -59.09], [21.85, -58.95], [21.85, -44.78], [21.78, -44.71], [21.78, -44.18], [21.85, -44.15], [21.85, -43.04], [21.79, -43], [21.79, -42.48], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.3, -35.59], [17.31, -36.51], [17.33, -35.96], [13.79, -34], [9.54, -35.81], [9.1, -37.04], [8.93, -36.53], [4.65, -36.79], [3.95, -38.8], [8.46, -38.44], [8.24, -37.78], [9.01, -37.28], [8.24, -37.78], [8.46, -38.44], [14.11, -38], [16.9, -36.7], [14.11, -38], [4.58, -38.75], [0.54, -42.31], [-0.38, -47.62], [-1.01, -47.33], [-2.75, -49.51], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.01, -62.36], [0.35, -61.95], [0.16, -61.46], [1.31, -61.48], [2.49, -64.14], [2.79, -64.27], [2.36, -64.68], [2.54, -65.19], [3.33, -65.44], [3.63, -64.65], [6.71, -66], [6.81, -65.99], [6.61, -66.47], [7.29, -67.32], [6.63, -67.65], [6.8, -68.28], [6.18, -68.28], [5.95, -68.83], [6.39, -69.28]]], // NAP +67.2
    [20, "noord", [[20.85, 36.87], [20.95, 40.11], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-6.23, 68.48], [-6.67, 67.45], [-5.58, 67.51], [-5.75, 65.01], [-1.79, 61.05], [-1.24, 61.27], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-1.95, 59.8], [-1.61, 60.87], [-1.95, 59.8], [-3.39, 58.76], [-4.99, 56.42], [-3.55, 53.98], [-1.73, 53.28], [-1.58, 53.02], [-2.32, 52.9], [-1.96, 49.81], [0.7, 46.98], [1.29, 47.24], [1.54, 44.29], [3.61, 43.8], [3.27, 43.24], [4.74, 41.55], [4.74, 40.45], [4.74, 41.55], [3.27, 43.24], [3.61, 43.8], [1.92, 44.2], [1.58, 43.83], [1.29, 47.24], [0.7, 46.98], [-1.14, 48.94], [-1.5, 48.35], [-3.39, 48.89], [-3.76, 48.4], [-2.51, 46.36], [-2.27, 46.16], [-2.83, 45.75], [-0.94, 40.79], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [4.75, 40.14], [4.75, 39.01], [6.56, 36.79], [10.05, 36.92], [12.06, 39.52], [12.42, 38.98], [12.55, 39.02], [12.55, 38.32], [16.83, 37.21], [16.47, 36.72], [17.06, 35.79], [18.32, 35.5]]], // NAP +69.2
    [20, "noord", [[-1.14, 48.94], [-1.96, 49.81], [-2.39, 53.54], [-3.89, 54.11], [-3.96, 49.05], [-1.5, 48.35]]], // NAP +69.2
    [20, "zuid", [[14.11, -38], [17.31, -36.51], [17.33, -35.96], [13.79, -34], [9.54, -35.81], [9.01, -37.28], [8.24, -37.78], [8.46, -38.44]]], // NAP +69.2
    [20, "zuid", [[13.34, -69.27], [13.69, -68.75], [13.43, -68.27], [12.88, -68.27], [13.49, -66.72], [17.7, -64.59], [17.57, -63.92], [18.74, -64], [19.39, -63.39], [19.01, -62.76], [20.56, -62.18], [20.85, -63.2], [21.85, -62.83], [21.85, -59.58], [21.36, -59.34], [21.85, -58.95], [21.85, -44.78], [21.4, -44.34], [20.85, -44.57], [20.85, -45.2], [19.08, -43.63], [19.54, -42.98], [20.85, -43.66], [19.54, -42.98], [19.08, -43.63], [20.36, -44.77], [21.85, -44.15], [21.85, -43.04], [21.36, -42.7], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.3, -35.59], [14.11, -38], [4.58, -38.75], [0.54, -42.31], [-0.38, -47.62], [-1.01, -47.33], [-2.75, -49.51], [-2.75, -53.93], [-3.01, -53.24], [-3.75, -53.38], [-3.75, -54.11], [-2.21, -58.1], [-2.06, -58.05], [-0.62, -62.22], [-0.01, -62.36], [0.35, -61.95], [0.16, -61.46], [1.31, -61.48], [2.49, -64.14], [6.71, -66], [6.81, -65.99], [6.61, -66.47], [8.04, -68.28], [6.92, -68.41], [7.43, -69.28]]], // NAP +69.2
    [21, "noord", [[20.85, 36.87], [20.93, 39.58], [20.85, 39.63], [20.85, 40.06], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-2.03, 68.73], [-2.25, 67.71], [-1.25, 67.77], [-1.13, 66.87], [-1.87, 66.93], [-2.25, 65.54], [-1.96, 63.28], [-1.31, 63.17], [-0.79, 64.2], [-0.75, 63.94], [-0.27, 63.74], [-1.21, 63], [-1.24, 60.93], [-0.75, 60.67], [-1.85, 59.88], [-1.58, 60.21], [-1.85, 59.88], [-3.39, 58.76], [-4.99, 56.42], [-3.55, 53.98], [-1.73, 53.28], [-1.58, 53.02], [-2.32, 52.9], [-1.96, 49.81], [0.7, 46.98], [1.29, 47.24], [1.54, 44.29], [3.61, 43.8], [3.27, 43.24], [4.74, 41.55], [4.74, 40.45], [4.74, 41.55], [3.27, 43.24], [3.61, 43.8], [1.92, 44.2], [1.58, 43.83], [1.29, 47.24], [0.7, 46.98], [-1.14, 48.94], [-1.5, 48.35], [-3.39, 48.89], [-3.76, 48.4], [-2.51, 46.36], [-2.27, 46.16], [-2.83, 45.75], [-0.94, 40.79], [2.73, 40.28], [1.57, 43.81], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [4.75, 40.14], [4.75, 39.01], [6.56, 36.79], [10.05, 36.92], [12.06, 39.52], [12.42, 38.98], [12.55, 39.02], [12.55, 38.32], [16.83, 37.21], [16.47, 36.72], [17.06, 35.79], [18.28, 35.5]]], // NAP +72.4
    [21, "noord", [[-1.14, 48.94], [-1.96, 49.81], [-2.39, 53.54], [-3.89, 54.11], [-3.96, 49.05], [-1.5, 48.35]]], // NAP +72.4
    [21, "zuid", [[8.94, -65.71], [11.19, -64.27], [10.93, -63.58], [14.3, -63.07], [14.34, -63.87], [15.76, -63.97], [16.17, -63.82], [18.74, -64], [19.39, -63.39], [19.01, -62.76], [20.56, -62.18], [20.85, -63.2], [21.85, -62.83], [21.85, -59.58], [21.36, -59.34], [21.85, -58.95], [21.85, -44.78], [21.4, -44.34], [20.85, -44.57], [20.85, -45.2], [19.08, -43.63], [19.54, -42.98], [20.85, -43.66], [19.54, -42.98], [19.08, -43.63], [20.36, -44.77], [21.85, -44.15], [21.85, -43.04], [21.36, -42.7], [21.85, -42.45], [21.85, -36.29], [21.42, -35.94], [20.93, -36.13], [20.85, -36.7], [19.3, -35.59], [14.11, -38], [4.58, -38.75], [0.54, -42.31], [-1.51, -54.16], [-0.87, -54.45], [-1.75, -55.57], [-1.25, -57.81], [-2.5, -54.58], [-1.25, -57.81], [-2.06, -58.05], [-0.62, -62.22], [-0.01, -62.36], [0.35, -61.95], [0.16, -61.46], [1.31, -61.48], [2.49, -64.14], [6.71, -66]]], // NAP +72.4
    [22, "noord", [[10.05, 36.92], [12.06, 39.52], [12.42, 38.98], [20.85, 41.22], [20.85, 40.06], [21.85, 40.61], [21.85, 41.48], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [20.4, 46.13], [20.85, 46.48], [20.85, 45.91], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [-2.03, 68.73], [-2.25, 67.71], [-1.25, 67.77], [-0.79, 64.2], [-1.56, 62.68], [-0.79, 64.2], [-0.75, 63.94], [-0.27, 63.74], [-1.21, 63], [-1.24, 60.93], [-0.75, 60.67], [-3.39, 58.76], [-4.99, 56.42], [-3.55, 53.98], [-1.73, 53.28], [-1.58, 53.02], [-2.32, 52.9], [-1.96, 49.81], [0.7, 46.98], [1.29, 47.24], [1.54, 44.29], [3.61, 43.8], [3.27, 43.24], [4.74, 41.55], [4.74, 40.45], [4.74, 41.55], [3.27, 43.24], [3.61, 43.8], [1.92, 44.2], [1.58, 43.83], [1.29, 47.24], [0.7, 46.98], [-1.14, 48.94], [-1.5, 48.35], [-3.39, 48.89], [-3.76, 48.4], [-2.51, 46.36], [1.13, 43.35], [1.57, 43.81], [2.56, 40.79], [4.75, 40.14], [4.75, 39.01], [6.56, 36.79]]], // NAP +75.8
    [22, "noord", [[-1.14, 48.94], [-1.96, 49.81], [-2.39, 53.54], [-3.89, 54.11], [-3.96, 49.05], [-1.5, 48.35]]], // NAP +75.8
    [22, "noord", [[19.03, 40.15], [18.67, 40.64], [12.55, 39.02], [12.55, 38.32], [17.15, 37.13]]], // NAP +75.8
    [22, "zuid", [[14.3, -63.07], [14.34, -63.87], [15.76, -63.97], [20.56, -62.18], [15.76, -63.97], [20.56, -62.18], [20.85, -63.2], [21.85, -62.83], [21.85, -59.58], [21.36, -59.34], [21.85, -58.95], [21.85, -44.78], [21.4, -44.34], [20.85, -44.57], [20.85, -45.2], [16.44, -41.29], [14.68, -41], [12.54, -41.6], [12.56, -40.94], [11.29, -40.5], [7.73, -41.21], [7.66, -41.87], [6.79, -41.5], [2.04, -44.81], [2.71, -53.8], [1.75, -57.96], [5.25, -64.46]]], // NAP +75.8
    [22, "zuid", [[21.85, -44.15], [21.85, -43.04], [21.34, -42.68], [20.85, -42.93], [20.85, -43.66], [19.54, -42.98], [19.08, -43.63], [20.36, -44.77]]], // NAP +75.8
    [22, "zuid", [[0.35, -61.95], [0.16, -61.46], [2.65, -61.5], [2.91, -61.79], [3.57, -61.33], [1.75, -57.96], [2.71, -53.8], [2.51, -51.08], [1.92, -50.9], [-1.75, -55.57], [-1.25, -57.81], [-2.06, -58.05], [-0.62, -62.22], [-0.01, -62.36]]], // NAP +75.8
    [23, "noord", [[10.05, 36.92], [12.06, 39.52], [12.42, 38.98], [21.6, 41.42], [21.61, 42.63], [21.85, 42.67], [21.85, 45.42], [20.4, 46.13], [19.49, 45.42], [20.85, 46.48], [20.85, 45.91], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [1.36, 68.93], [0.98, 68.44], [1.25, 67.92], [1.8, 67.95], [1.24, 66.66], [1.62, 66.23], [1.54, 66.21], [1.13, 64.09], [0.59, 64.42], [-1.21, 63], [-1.24, 60.93], [-0.75, 60.67], [-3.39, 58.76], [-4.99, 56.42], [-3.55, 53.98], [-1.73, 53.28], [-1.58, 53.02], [-2.32, 52.9], [-1.96, 49.81], [0.7, 46.98], [1.29, 47.24], [1.54, 44.29], [3.61, 43.8], [3.27, 43.24], [4.74, 41.55], [4.74, 40.45], [4.74, 41.55], [3.27, 43.24], [3.61, 43.8], [1.92, 44.2], [1.57, 43.81], [2.56, 40.79], [4.75, 40.14], [4.75, 39.01], [6.56, 36.79]]], // NAP +79.4
    [23, "noord", [[-1.14, 48.94], [-1.96, 49.81], [-2.39, 53.54], [-3.89, 54.11], [-3.96, 49.05], [-1.5, 48.35]]], // NAP +79.4
    [23, "zuid", [[14.74, -63], [20.85, -58.52], [20.85, -59.09], [21.36, -59.34], [21.85, -58.95], [21.85, -44.78], [21.4, -44.34], [20.85, -44.57], [20.85, -45.2], [16.44, -41.29], [14.68, -41], [9.22, -42.53], [6.79, -41.5], [2.04, -44.81], [2.71, -53.8], [1.75, -57.96], [5.25, -64.46]]], // NAP +79.4
    [24, "noord", [[10.05, 36.92], [12.19, 39.69], [11.75, 40.24], [15.14, 41.83], [15, 42.53], [11.96, 42.63], [12.03, 42.79], [12.16, 42.62], [15.74, 42.5], [20.85, 46.48], [20.85, 45.91], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [1.36, 68.93], [0.98, 68.44], [1.25, 67.92], [1.8, 67.95], [1.24, 66.66], [1.62, 66.23], [1.54, 66.21], [0.5, 60.87], [-0.02, 61.2], [-3.39, 58.76], [-4.99, 56.42], [-3.55, 53.98], [-1.73, 53.28], [-1.58, 53.02], [-2.32, 52.9], [-1.96, 49.81], [0.7, 46.98], [1.29, 47.24], [1.54, 44.29], [3.61, 43.8], [3.27, 43.24], [4.74, 41.55], [4.75, 39.01], [6.56, 36.79]]], // NAP +82.3
    [24, "noord", [[21.85, 42.67], [21.85, 45.42], [20.4, 46.13], [17.76, 44.07], [17.97, 43.46], [20.85, 43.5], [20.85, 42.5]]], // NAP +82.3
    [24, "zuid", [[9.87, -57.79], [11.24, -53.57], [9.93, -53.03], [8.67, -54.12], [6.76, -54.2], [5.75, -55.6], [6.01, -57.85], [7.18, -58.43]]], // NAP +82.3
    [25, "noord", [[15.14, 41.83], [15, 42.53], [11.96, 42.63], [12.03, 42.79], [12.16, 42.62], [15.74, 42.5], [20.85, 46.48], [20.85, 45.91], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [5.03, 69.15], [4.41, 68.82], [4.6, 68.12], [4.65, 68.12], [3.96, 67.75], [4.26, 67], [1.54, 66.21], [0.5, 60.87], [-0.02, 61.2], [-3.39, 58.76], [-4.99, 56.42], [-3.55, 53.98], [-1.73, 53.28], [-1.58, 53.02], [-0.95, 53.12], [-1.22, 51.49], [6.26, 42], [7.52, 42.07], [7.33, 41.46], [9.26, 40], [11.24, 40]]], // NAP +85.6
    [25, "noord", [[4.52, 44.21], [1.91, 47.52], [1.28, 47.28], [1.54, 44.29], [4.18, 43.67]]], // NAP +85.6
    [26, "noord", [[11.8, 42.29], [12.03, 42.79], [12.16, 42.62], [15.74, 42.5], [20.85, 46.48], [20.85, 45.91], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [5.03, 69.15], [4.41, 68.82], [4.6, 68.12], [5.62, 68.18], [5.65, 68.25], [7.12, 68.25], [7.14, 68.16], [8.2, 68.15], [1.54, 66.21], [-0.25, 57.04], [0, 54.33], [-0.1, 54.51], [-0.73, 54.4], [-1.22, 51.49], [6.26, 42]]], // NAP +88.8
    [27, "noord", [[20.85, 46.48], [20.85, 45.91], [21.36, 45.66], [21.85, 46.05], [21.85, 53.87], [21.51, 53.98], [21.85, 70.15], [6.05, 69.21], [5.65, 68.25], [7.12, 68.25], [7.14, 68.16], [8.2, 68.15], [1.54, 66.21], [-0.25, 57.04], [0, 54.33], [3.06, 48.79], [11.55, 46.96], [12.76, 46.04], [11.55, 46.96], [4.11, 48.57], [3.77, 48.08], [4.54, 46.81], [11.2, 43.85], [12.16, 42.62], [15.74, 42.5]]], // NAP +93
    [28, "noord", [[13.85, 46.26], [20.85, 54.2], [21.51, 53.98], [21.85, 70.15], [7.9, 69.32], [6.98, 68.85], [7.14, 68.16], [8.2, 68.15], [1.54, 66.21], [-0.25, 57.04], [0, 54.33], [3.06, 48.79], [11.55, 46.96], [12.76, 46.04]]], // NAP +99.4
    [29, "noord", [[7.55, 53.86], [11.2, 55.06], [12.04, 53.29], [14.82, 53], [16.77, 53.86], [19.25, 57.51], [19.25, 63.4], [20.23, 65.02], [18.37, 68.18], [11.07, 67.21], [9.8, 65.01], [4.69, 65], [3.75, 64.29], [3.49, 53.12], [6.33, 52.46]]], // NAP +100.8
  ];
}
// ---- DATA END

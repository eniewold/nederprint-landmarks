// B'Mine (Bercylaan, Overhoeks, Amsterdam-Noord, 2017, Paul de Ruiter Architects): woontoren van 23 lagen
// met een sokkel van acht lagen aan de noordoostkant, in één BAG-pand. Zwarte gevels achter een raster van
// witte verticale vinnen op circa 2,9 m; tussen de vinnen per travee een stapel balkons (glazen borstwering,
// uitstekend tot de voorkant van de vinnen) of een kolom vensters. Begane grond van twee lagen hoog glas,
// daarboven twee parkeerlagen. De bovenste woonlaag ligt 2 m terug; de vinnen lopen daarboven door als een
// open witte kroon van palen met een ringbalk rondom, korte balken naar de penthouselaag en in elke hoek
// een raster van 2 × 2 vakken boven een hoekterras. Op het dak hogere penthousedaken, een leidingstraat en
// een installatiekast.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023) en het AHN-DSM, kroon uit de luchtfoto,
// gevelindeling en lagen uit foto's.
import { CrossSection, Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "bercylaan-overhoeks";
// Gebouwstelsel: u langs de lange zuidoostgevel naar het noordoosten (36,08° op RD-oost, de vier BAG-randen
// evenwijdig of haaks binnen 0,1°), v haaks erop naar het noordwesten. In de code ligt (0, 0) op de
// zuidhoek van de BAG-contour; het model wordt aan het eind naar het hart van de contour geschoven.
const ORIGIN = [122070.8, 488651.81];
const ANGLE = 36.08;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 1.55; // NAP, 3D BAG-maaiveld 1,54, AHN-DTM rondom 1,58 (p50)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Plattegrond (BAG, 43,13 × 29,33 m) ----------
const L = 43.13; // zuidoostgevel en noordwestgevel
const W = 29.33; // zuidwestgevel en noordoostgevel
const TU = 28.6; // grens toren / sokkel (3D BAG: sokkeldak begint op u 28,5–28,7)
const CENTER = [L / 2, W / 2];

// ---------- Hoogtes (NAP) ----------
const PODIUM = 29.55; // sokkeldak (3D BAG 29,54–29,57; DSM 29,5–30)
const TERRACE = 70.88; // dak van de bovenste gewone woonlaag = hoekterrassen en terrasrand (3D BAG 70,87–70,89)
const PENTHOUSE = 74.0; // dak van de teruggelegen penthouselaag (3D BAG 74,01–74,07)
const FRAME_TOP = 76.4; // bovenkant van de witte kroon (3D BAG 76,39–76,40 op de zuidwestrand)
const HIGH_ROOF = 75.8; // hogere penthousedaken langs drie zijden (3D BAG 75,65–75,91)
const DUCTS = 75.35; // leidingstraat dwars over het dak (3D BAG 75,27–75,39)
const PLANT = 76.05; // installatiekast midden op het dak (3D BAG 75,99–76,10)

// ---------- Lagen (geschat uit foto's, afgestemd op de gemeten daken) ----------
// Begane grond 6,0 m (dubbelhoog glas), twee parkeerlagen van 3,1 m, daarboven woonlagen: in de toren 18 tot
// het terras, in de sokkel 5 tot het sokkeldak; de penthouselaag tot +74,0.
const LOW = [[0, 6.0, "glass"], [6.0, 3.1, "park"], [9.1, 3.1, "park"]];
const RES0 = 12.2;
const towerStorey = (z(TERRACE) - RES0) / 18;
const podiumStorey = (z(PODIUM) - RES0) / 5;
const TOWER_FLOORS = Array.from({ length: 18 }, (_, k) => [RES0 + towerStorey * k, towerStorey]);
const PODIUM_FLOORS = Array.from({ length: 5 }, (_, k) => [RES0 + podiumStorey * k, podiumStorey]);

// ---------- Gevelraster ----------
const FIN_D = 1.0; // diepte van de vinnenzone: zwarte gevel 1,0 m achter de voorkant van de vinnen (DSM-rand 1–1,5 m)
const STACK_IN = 0.3; // voorkant van de balkons 0,3 m achter de voorkant van de vinnen (foto's)
const FIN_W = 0.9; // vinbreedte (werkelijk circa 0,6 m; 0,9 m om op 1:1000 te printen)
const RING_D = 2.0; // penthousegevel en binnenste kroonbalk 2,0 m achter de voorkant (3D BAG-terrasrand 1,9–2,0 m)
const BEAM = 0.9; // hoogte en breedte van de kroonbalken
const ARCH = (50 * Math.PI) / 180; // spitse onderkant van de kroonbalken tussen de palen
const NICHE = 0.35; // diepte van vensternissen

// Gevels als rand a→b met de buitenkant rechts; n bays tussen de vinnen; per travee B (balkonstapel) of W
// (vensters). Patronen op foto: noordwestgevel (toren en sokkel) en zuidwestgevel; de zuidoost- en
// noordoostgevel staan niet op een bruikbare foto en volgen de noordwestgevel (geschat).
const TOWER_FACES = [
  { name: "zuidoost", a: [0, 0], b: [TU, 0], n: 10, pattern: "BBWWBBWWBB", from: BASE },
  { name: "noordoost", a: [TU, 0], b: [TU, W], n: 10, pattern: "BBWWBBWWBB", from: z(PODIUM) },
  { name: "noordwest", a: [TU, W], b: [0, W], n: 10, pattern: "BBWWBBWWBB", from: BASE },
  { name: "zuidwest", a: [0, W], b: [0, 0], n: 10, pattern: "BWWBBWWWWB", from: BASE },
];
const PODIUM_FACES = [
  { name: "sokkel-zuidoost", a: [TU, 0], b: [L, 0], n: 5, pattern: "WWWBB", junction: "start" },
  { name: "sokkel-noordoost", a: [L, 0], b: [L, W], n: 10, pattern: "BBWWBBWWBB" },
  { name: "sokkel-noordwest", a: [L, W], b: [TU, W], n: 5, pattern: "BBWWW", junction: "end" },
];

function frame({ a, b }) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len], n = [d[1], -d[0]];
  // P(s, depth, h): s langs de gevel vanaf a, depth naar binnen vanaf de voorkant van de vinnen.
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  return { len, P };
}
// Vrije breedte van travee k: tussen de vinnen (hoekpalen 1,0 m breed, binnenvinnen 0,9 m op k·p).
function bays(face) {
  const { len } = frame(face);
  const p = len / face.n;
  return Array.from({ length: face.n }, (_, k) => {
    const left = k === 0 ? (face.junction === "start" ? 0 : FIN_D) : k * p + FIN_W / 2;
    const right = k === face.n - 1 ? (face.junction === "end" ? len : len - FIN_D) : (k + 1) * p - FIN_W / 2;
    return { k, s0: left, s1: right, kind: face.pattern[k] };
  });
}
const quad = (P, s0, s1, d0, d1, h0, h1) => Manifold.hull([P(s0, d0, h0), P(s1, d0, h0), P(s0, d1, h0), P(s1, d1, h0), P(s0, d0, h1), P(s1, d0, h1), P(s0, d1, h1), P(s1, d1, h1)]);

// Balk in het grondvlak van A naar B (beide op de steunvlakken), breed w, bovenkant top, met een spitse
// onderkant onder ARCH: in het midden BEAM dik, naar de steunen toe dikker. Twee convexe helften.
function archBeam(Aq, Bq, w, top) {
  const len = Math.hypot(Bq[0] - Aq[0], Bq[1] - Aq[1]);
  const d = [(Bq[0] - Aq[0]) / len, (Bq[1] - Aq[1]) / len], n = [-d[1] * w / 2, d[0] * w / 2];
  const at = (s) => [Aq[0] + d[0] * s, Aq[1] + d[1] * s];
  const rise = (len / 2) * Math.tan(ARCH);
  const half = (sEnd, sMid) => {
    const e = at(sEnd), m = at(sMid);
    return Manifold.hull([
      ...[e, m].flatMap((q) => [[q[0] + n[0], q[1] + n[1], top], [q[0] - n[0], q[1] - n[1], top]]),
      [e[0] + n[0], e[1] + n[1], top - BEAM - rise], [e[0] - n[0], e[1] - n[1], top - BEAM - rise],
      [m[0] + n[0], m[1] + n[1], top - BEAM], [m[0] - n[0], m[1] - n[1], top - BEAM],
    ]);
  };
  return union([half(-0.1, len / 2), half(len + 0.1, len / 2)]);
}

const solids = [];
const cuts = [];

// ---------- Kern: zwarte gevel 1,0 m achter de vinnen ----------
solids.push(prism(rect(FIN_D, FIN_D, TU - FIN_D, W - FIN_D), BASE, z(TERRACE)));
solids.push(prism(rect(TU - FIN_D - 0.1, FIN_D, L - FIN_D, W - FIN_D), BASE, z(PODIUM)));

// ---------- Vinnen, hoekpalen en balkonstapels ----------
function finZone(face, top, stackTop, floors) {
  const { len, P } = frame(face);
  const p = len / face.n;
  const from = face.from ?? BASE;
  for (let k = 1; k < face.n; k++) solids.push(quad(P, k * p - FIN_W / 2, k * p + FIN_W / 2, 0, FIN_D + 0.05, from, top));
  if (face.junction !== "start") solids.push(quad(P, 0, FIN_D, 0, FIN_D + 0.05, from, top));
  if (face.junction !== "end") solids.push(quad(P, len - FIN_D, len, 0, FIN_D + 0.05, from, top));
  for (const bay of bays(face)) {
    if (bay.kind !== "B") continue;
    const { s0, s1 } = bay;
    // Stapel tot STACK_IN achter de voorkant van de vinnen vanaf de eerste woonlaag (of het sokkeldak), met
    // een kraag onder 45°.
    const bottom = Math.max(RES0, from);
    const back = FIN_D + 0.05;
    const stack = from > RES0 ? quad(P, s0 - 0.05, s1 + 0.05, STACK_IN, back, from, stackTop)
      : Manifold.hull([s0 - 0.05, s1 + 0.05].flatMap((s) => [P(s, STACK_IN, stackTop), P(s, back, stackTop), P(s, STACK_IN, bottom), P(s, back, bottom - (back - STACK_IN))]));
    solids.push(stack);
    // Per laag een open balkon: borstwering 0,9 m, plafond onder 47° van de gevel naar de voorkant van de laag
    // erboven (bij de bovenste laag 0,9 m onder de bovenkant van de stapel).
    for (const [zf, fh] of floors) {
      if (zf < bottom - 0.01 || zf + fh > stackTop + 0.01) continue;
      const depth = FIN_D + 0.15, slope = 1.07;
      const ceil = Math.min(zf + fh, stackTop - BEAM); // plafond aan de voorkant van de stapel
      const lo = zf + 0.9, hiBack = ceil - (depth - STACK_IN) * slope;
      if (hiBack - lo < 0.3) continue;
      cuts.push(Manifold.hull([s0, s1].flatMap((s) => [P(s, -0.2, lo), P(s, depth, lo), P(s, depth, hiBack), P(s, -0.2, ceil + (STACK_IN + 0.2) * slope)])));
    }
  }
}
// Torenvinnen lopen door tot de bovenkant van de kroon, de balkonstapels eindigen op het terras.
for (const f of TOWER_FACES) finZone(f, z(FRAME_TOP), z(TERRACE), TOWER_FLOORS);
for (const f of PODIUM_FACES) finZone(f, z(PODIUM), z(PODIUM), PODIUM_FLOORS);

// ---------- Penthouselaag met hoekterrassen ----------
// 2,0 m terug van de voorkant; in elke hoek een terras van twee travees in beide richtingen.
const pSE = TU / 10, pSW = W / 10;
const CORNER_U = 2 * pSE, CORNER_V = 2 * pSW;
const penthouse = [
  [CORNER_U, RING_D], [TU - CORNER_U, RING_D], [TU - CORNER_U, CORNER_V], [TU - RING_D, CORNER_V],
  [TU - RING_D, W - CORNER_V], [TU - CORNER_U, W - CORNER_V], [TU - CORNER_U, W - RING_D], [CORNER_U, W - RING_D],
  [CORNER_U, W - CORNER_V], [RING_D, W - CORNER_V], [RING_D, CORNER_V], [CORNER_U, CORNER_V],
];

// ---------- Witte kroon ----------
const top = z(FRAME_TOP);
const crown = [];
const corners = [[0, 0, 1, 1], [TU, 0, -1, 1], [TU, W, -1, -1], [0, W, 1, -1]];
for (const face of TOWER_FACES) {
  const { len, P } = frame(face);
  const p = len / face.n;
  // Ringbalk langs de voorkant, met een spitse boog tussen elk paar vinnen.
  for (const { s0, s1 } of bays(face)) crown.push(archBeam(P(s0, FIN_D / 2, 0), P(s1, FIN_D / 2, 0), FIN_D, top));
  crown.push(quad(P, 0, len, 0, FIN_D, top - BEAM, top));
  // Korte balk van elke binnenvin naar de penthouselaag of de hoekbalk.
  for (let k = 1; k < face.n; k++) crown.push(archBeam(P(k * p, FIN_D - 0.05, 0), P(k * p, RING_D + 0.05, 0), FIN_W, top));
}
// Binnenste kroonbalk op de rand van de penthouselaag (als borstwering tot de bovenkant van de kroon).
const ph = new CrossSection([penthouse]);
crown.push(Manifold.extrude(ph.subtract(ph.offset(-BEAM, "Miter")), top - z(PENTHOUSE) + 0.1).translate([0, 0, z(PENTHOUSE) - 0.1]));
// Hoeken: een paal op het kruispunt van de binnenste balklijnen, met balken naar de ringbalken en de penthouse.
for (const [cu, cv, su, sv] of corners) {
  const Q = (du, dv) => [cu + su * du, cv + sv * dv];
  const mid = RING_D + BEAM / 2;
  const post = [Q(RING_D, RING_D), Q(RING_D + BEAM, RING_D), Q(RING_D + BEAM, RING_D + BEAM), Q(RING_D, RING_D + BEAM)];
  crown.push(prism(post, z(TERRACE) - 0.1, top));
  crown.push(archBeam(Q(FIN_D - 0.05, mid), Q(RING_D + 0.05, mid), BEAM, top));
  crown.push(archBeam(Q(RING_D + BEAM - 0.05, mid), Q(CORNER_U + 0.05, mid), BEAM, top));
  crown.push(archBeam(Q(mid, FIN_D - 0.05), Q(mid, RING_D + 0.05), BEAM, top));
  crown.push(archBeam(Q(mid, RING_D + BEAM - 0.05), Q(mid, CORNER_V + 0.05), BEAM, top));
}

// ---------- Dakopbouwen op de penthouselaag (3D BAG-dakvlakken) ----------
const roofTop = [
  prism(rect(RING_D, CORNER_V, 7.0, W - CORNER_V), z(PENTHOUSE) - 0.1, z(HIGH_ROOF)), // zuidwestzijde
  prism(rect(13.9, RING_D, 23.7, 6.3), z(PENTHOUSE) - 0.1, z(HIGH_ROOF)), // zuidoostzijde
  prism(rect(14.1, 23.6, 24.8, W - RING_D), z(PENTHOUSE) - 0.1, z(HIGH_ROOF)), // noordwestzijde
  prism(rect(10.1, RING_D, 13.9, W - RING_D), z(PENTHOUSE) - 0.1, z(DUCTS)), // leidingstraat
  prism(rect(12.5, 13.0, 18.5, 16.9), z(PENTHOUSE) - 0.1, z(PLANT)), // installatiekast
];

const body = union([
  ...solids,
  prism(penthouse, z(TERRACE) - 0.1, z(PENTHOUSE)),
  ...roofTop,
  ...crown,
]);

// ---------- Vensters als blinde nissen (alleen waar de gevel buitengevel is) ----------
function exposedAt(P, s, depth, h) {
  const from = P(s, depth - 3, h), hit = body.rayCast(from, P(s, depth + 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
}
function niche(P, s0, s1, wall, lo, hi) {
  if (hi - lo < 0.5 || s1 - s0 < 0.9) return;
  const ok = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + NICHE - 0.05].every((h) => exposedAt(P, s, wall, h)));
  if (ok) cuts.push(Manifold.hull([P(s0, wall - 0.2, lo), P(s1, wall - 0.2, lo), P(s0, wall + NICHE, lo), P(s1, wall + NICHE, lo), P(s0, wall - 0.2, hi + NICHE + 0.2), P(s1, wall - 0.2, hi + NICHE + 0.2), P(s0, wall + NICHE, hi), P(s1, wall + NICHE, hi)]));
}
function windows(face, floors) {
  const { P } = frame(face);
  for (const { s0, s1, kind } of bays(face)) {
    const c = (s0 + s1) / 2;
    for (const [zf, fh, type] of LOW) {
      if (zf + fh > z(PODIUM) || (face.from ?? BASE) > zf) continue;
      // Begane grond: glaspui over de hele travee; parkeerlagen: een liggende opening.
      if (type === "glass") niche(P, s0 + 0.3, s1 - 0.3, FIN_D, 0.3, fh - 0.35 - NICHE);
      else niche(P, s0 + 0.3, s1 - 0.3, FIN_D, zf + 1.0, zf + fh - 0.35 - NICHE);
    }
    if (kind !== "W") continue;
    for (const [zf, fh] of floors) {
      if ((face.from ?? BASE) > zf + 0.01) continue;
      niche(P, c - 0.65, c + 0.65, FIN_D, zf + 0.6, zf + fh - 0.35 - NICHE);
    }
  }
}
TOWER_FACES.forEach((f) => windows(f, TOWER_FLOORS));
PODIUM_FACES.forEach((f) => windows(f, PODIUM_FLOORS));
// Penthouselaag: per travee een glasvlak in de teruggelegen gevel (alleen waar die buitengevel is).
for (const face of TOWER_FACES) {
  const { len, P } = frame(face);
  const p = len / face.n;
  for (let k = 0; k < face.n; k++) niche(P, k * p + 0.6, (k + 1) * p - 0.6, RING_D, z(TERRACE) + 0.3, z(PENTHOUSE) - 0.35 - NICHE);
}

const building = body.subtract(union(cuts)).translate([-CENTER[0], -CENTER[1], 0]);
// Toren (met kroon) en sokkel als twee nodes, gesplitst op de torengrens.
const split = TU + 0.01 - CENTER[0];
const tower = building.trimByPlane([-1, 0, 0], -split);
const podium = building.trimByPlane([1, 0, 0], split);
const nodes = [["toren", tower], ["sokkel", podium]].map(([label, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${label}: ${parts.length} losse delen (${parts.map((q) => q.volume().toFixed(3) + " " + JSON.stringify(q.boundingBox())).join(", ")})`);
  console.log(label, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "volume", m.volume().toFixed(0));
  return [`building:bercylaan-overhoeks-${label}`, m];
});
console.log("nissen en balkons", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "B'Mine",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.5, // PDOK-terrein rondom (ellipsoïdisch; Overhoeks NAP + circa 42,95)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0363100012245546"],
    description:
      "B'Mine, woontoren aan de Bercylaan op Overhoeks (Paul de Ruiter, 2017): toren van 28,6 × 29,3 m tot NAP +70,9 m met een 2,0 m teruggelegen penthouselaag tot +74,0 m (hoekterrassen van twee travees, hogere daken tot +75,8 m, leidingstraat en installatiekast), en een sokkel van 14,5 m aan de noordoostkant tot +29,6 m. Rondom witte vinnen van 0,9 m op een travee van circa 2,9 m vóór een zwarte gevel die 1,0 m terugligt, per travee een balkonstapel met borstwering of een kolom vensternissen; begane grond als glaspui, twee parkeerlagen. De vinnen lopen door als witte kroon tot +76,4 m met een ringbalk, korte balken naar de penthouselaag en per hoek een paal met balken, alle overspanningen met een spitse onderkant. Contour uit de BAG, hoogtes uit de 3D BAG en het AHN-DSM. Oorsprong in het hart van de BAG-contour, X-as langs de zuidoostgevel (36,08° op RD-oost). Lagenindeling, vindiepte, balkonpatroon op de zuidoost- en noordoostgevel en de kroonbalken binnen de ring zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      planM: [L, W],
      towerPlanM: [TU, W],
      podiumNapM: PODIUM,
      terraceNapM: TERRACE,
      penthouseNapM: PENTHOUSE,
      highRoofNapM: HIGH_ROOF,
      plantNapM: PLANT,
      crownTopNapM: FRAME_TOP,
      floors: { tower: 23, podium: 8 },
      storeyHeightM: { ground: 6.0, parking: 3.1, tower: +towerStorey.toFixed(3), podium: +podiumStorey.toFixed(3) },
      finBayM: { tower: [+(TU / 10).toFixed(3), +(W / 10).toFixed(3)], podium: +((L - TU) / 5).toFixed(3) },
      finDepthM: FIN_D,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012245546 (bouwjaar 2017), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012245546 (3D BAG LoD2.2, AHN5 2023, CC BY 4.0)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam",
      "https://paulderuiter.nl/en/projects/bmine-tower",
      "https://commons.wikimedia.org/wiki/File:B_MIne_toren_Amsterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Overhoeks.jpg",
      "https://commons.wikimedia.org/wiki/File:BMine_woontoren_in_Overhoeks,_Amsterdam-noord.jpg",
    ],
  },
});

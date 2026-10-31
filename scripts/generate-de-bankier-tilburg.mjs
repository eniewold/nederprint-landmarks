// De Bankier (Spoorlaan / Magazijnstraat, Spoorzone Tilburg, 2023, Diederendirrix): woontoren van 23
// lagen op de hoek van de Spoorlaan en de Magazijnstraat, naast het bankgebouw van Van Mierlo en Zoon
// (Kraaijvanger, 1954) waar hij zijn naam aan ontleent. Een rechthoekige toren met zandkleurige gevels:
// de onderste dertien woonlagen met doorlopende horizontale vloerbanden en aan de Spoorlaan een
// doorlopende balkonzone, aan de zuidkant op beide hoeken een balkonstapel; de bovenste negen lagen
// met verticale penanten. In het dak twee verdiepte dakterrassen op de zuidhoeken met een kader eromheen,
// een dakrand en aan de noordkant een hogere attiek. Ten westen een lage onderbouw (2023) tussen de
// toren, het oude bankgebouw en het parkeerterrein, en aan de zuidoostkant een lage aanbouw.
// De toren staat op drie BAG-panden: 0855100000715598 (noordelijk deel), 0855100000715596 (zuidelijk
// deel van de toren en de onderbouw) en 0855100000715597 (zuidoosthoek met de aanbouw).
// Contouren uit de BAG, hoogtes uit de 3D BAG (LoD2.2 op AHN5, 2024; het PDOK-AHN4 is van vóór de
// oplevering), gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "de-bankier-tilburg";
// Gebouwstelsel: u langs de zuidgevel naar het oosten (-8,2° op RD-oost, BAG-randen evenwijdig binnen
// 0,4°), v langs de oost- en westgevel naar het noorden (Spoorlaan). Oorsprong midden in de toren.
const ORIGIN = [134300.0, 396763.0];
const ANGLE = -8.2;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 14.45; // NAP, AHN-DTM rondom (p50 14,49), 3D BAG-maaiveld 14,33–14,65
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 (AHN5 2024) ----------
const ROOF = 87.85; // hoofddak (dakvlak 87,71–87,93; 50e percentiel 87,85)
const PARAPET = 88.8; // dakrand en kader rond de dakterrassen (88,64–88,94)
const CROWN = 90.04; // attiek langs de noordgevel (strook 90,03–90,05)
const TERRACE = 84.2; // vloer van de twee dakterrassen (84,17–84,24)
const BALCONY_TOP = 60.15; // bovenkant balkonstapel zuidoost (60,11–60,22) = bovenkant onderste gevelzone
const STRIP = 30.3; // strook tussen toren en bankgebouw (30,02–30,60)
const PODIUM = 30.87; // onderbouw (30,83–30,91)
const PODIUM_LOW = 28.2; // zuidwestdeel van de onderbouw (28,16–28,23)
const PODIUM_HIGH = 31.71; // installatiezone op de onderbouw (31,67–31,76)
const ANNEX_HIGH = 27.15; // aanbouw zuidoost, hoog deel (27,04–27,31)
const ANNEX_LOW = 17.82; // aanbouw zuidoost, laag deel (17,74–17,94)

// ---------- Plattegrond in (u, v) ----------
// Toren: oost- en noordgevel op de BAG-contour; westgevel 1,2 m binnen de BAG (3D BAG-dakrand -11,0
// tot -11,4, daarbuiten de lage strook); zuidgevel op de BAG-grens van 0855100000715596.
const W = -11.3, E = 11.2, S = -15.25, N = 16.75;
const TOWER = rect(W, S, E, N);
const TERRACES = [rect(-10.4, -14.35, -3.4, -11.9), rect(3.4, -14.35, 10.3, -11.9)]; // binnenmaat (3D BAG, ortho)
const SW_STACK = [W - 0.4, -4.0]; // u-bereik balkonstapel zuidwest (gespiegeld van zuidoost, geschat)
const SE_STACK = [3.2, E + 0.4]; // u-bereik balkonstapel zuidoost (3D BAG 3,2–10,5)
const OUT_N = 1.5, OUT_S = 2.15; // uitsteek balkonzone noord (foto) en stapels zuid (3D BAG 60,1-vlak)
const J = 0.4; // uitsteek van de vloerbanden in de onderste zone
// Lage strook van pand 0855100000715598 tussen toren en bankgebouw, en de onderbouw (westdeel van
// pand 0855100000715596), beide uit de BAG.
const STRIP_POLY = rect(-12.55, -8.0, W + 0.3, 16.7);
const PODIUM_POLY = [[W + 0.3, -7.645], [-12.58, -7.64], [-12.57, -1.47], [-33.31, -1.5], [-33.34, -19.0], [-11.17, -18.83], [-11.18, -15.25], [W + 0.3, -15.25]];
const PODIUM_LOW_POLYS = [rect(-33.6, -11.4, -28.4, -9.2), rect(-33.6, -19.3, -31.5, -11.3)];
const PODIUM_HIGH_POLY = rect(-31.05, -9.25, -27.9, -1.5);
// Aanbouw zuidoost (pand 0855100000715597).
const ANNEX_LOW_POLY = rect(3.2, -20.03, 6.4, -17.0);
const ANNEX_HIGH_POLY = [[6.2, -20.0], [10.47, -20.0], [10.47, -20.65], [11.24, -20.62], [11.24, -17.0], [6.2, -17.0]];

// ---------- Lagen ----------
// Begane grond 5,2 m, daarboven 22 woonlagen van 3,1 m tot het dak (73,4 m); onderste zone lagen 1–13
// (tot +45,5 m, de balkonstapel tot +45,7 m), bovenste zone lagen 14–22.
const GF = 5.2, STOREY = 3.1;
const FLOORS = [[0, GF], ...Array.from({ length: 22 }, (_, k) => [GF + STOREY * k, STOREY])];
const LOWER = FLOORS.slice(1, 14);
const UPPER = FLOORS.slice(14);
const ZONE_TOP = z(BALCONY_TOP);

// Randen van de toren (linksom, buitennormaal rechts van de looprichting).
const EDGES = {
  south: [[W, S], [E, S]],
  east: [[E, S], [E, N]],
  north: [[E, N], [W, N]],
  west: [[W, N], [W, S]],
};
// Punt op afstand s langs rand a→b, t naar buiten, hoogte h.
const frame = ([a, b]) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, Q: (s, t, h) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t, h] };
};
// Blok buiten de gevel van s0 tot s1, t tot `out`, van zBot tot zTop, met een kraag onder 45°
// (of tot de onderkant als ground).
function outset(edge, s0, s1, out, zBot, zTop, ground = false) {
  const { Q } = frame(edge);
  return Manifold.hull([s0, s1].flatMap((s) => [
    Q(s, -0.1, zTop), Q(s, out, zTop),
    ground ? Q(s, -0.1, BASE) : Q(s, -0.1, zBot - out - 0.1), ground ? Q(s, out, BASE) : Q(s, out, zBot),
  ]));
}
// Open balkons per laag in een stapel: 0,9 m diep, borstwering 1,0 m, plafond onder 45°.
function balconyCuts(edge, segments, out, zTop) {
  const { Q } = frame(edge);
  const cuts = [];
  for (const [zf, fh] of LOWER) {
    if (zf + fh > zTop + 0.01) continue;
    const lo = zf + 1.0, hi = zf + fh - 0.3 - 0.9;
    for (const [s0, s1] of segments) cuts.push(Manifold.hull([s0, s1].flatMap((s) => [Q(s, out + 0.2, lo), Q(s, out - 0.9, lo), Q(s, out + 0.2, hi + 1.1), Q(s, out - 0.9, hi)])));
  }
  return cuts;
}
// Balkonzone verdeeld in stukken met tussenwanden van 0,9 m.
const split = (s0, s1, n) => {
  const len = (s1 - s0 - 0.9 * (n + 1)) / n;
  return Array.from({ length: n }, (_, k) => [s0 + 0.9 + k * (len + 0.9), s0 + 0.9 + k * (len + 0.9) + len]);
};

// ---------- Massa ----------
const L = Object.fromEntries(Object.entries(EDGES).map(([k, e]) => [k, frame(e).L]));
const northStack = outset(EDGES.north, -0.4, L.north + 0.4, OUT_N, GF, ZONE_TOP);
// Op de zuidrand loopt s van W naar E: s = u - W.
const swStack = outset(EDGES.south, SW_STACK[0] - W, SW_STACK[1] - W, OUT_S, GF, ZONE_TOP);
const seStack = outset(EDGES.south, SE_STACK[0] - W, SE_STACK[1] - W, OUT_S, 0, ZONE_TOP, true);
const annex = union([prism(ANNEX_LOW_POLY, BASE, z(ANNEX_LOW)), prism(ANNEX_HIGH_POLY, BASE, z(ANNEX_HIGH))]);
const towerBox = prism(TOWER, BASE, z(ROOF));
const strip = prism(STRIP_POLY, BASE, z(STRIP));
const podium = union([
  prism(PODIUM_POLY, BASE, z(PODIUM)).subtract(union(PODIUM_LOW_POLYS.map((p) => prism(p, z(PODIUM_LOW), 40)))),
  prism(PODIUM_HIGH_POLY, z(PODIUM) - 0.1, z(PODIUM_HIGH)),
]);
// Alles wat een gevel kan afdekken, voor de zichtbaarheidstest van de nissen.
const core = union([towerBox, northStack, swStack, seStack, annex, strip, podium]);

// Vloerbanden in de onderste zone: een mantel van J m buiten de gevel met per laag een groef tot op de
// gevel, zodat per laag een band van 0,6 m met een schuine onderkant (45°) blijft staan.
const JACKETS = [
  { edge: EDGES.east, s0: 0, s1: L.east, zBot: GF },
  { edge: EDGES.west, s0: 0, s1: L.west, zBot: z(STRIP) - 0.05 },
  { edge: EDGES.south, s0: SW_STACK[1] - W - 0.2, s1: SE_STACK[0] - W + 0.2, zBot: GF },
];
const jackets = JACKETS.map(({ edge, s0, s1, zBot }) => outset(edge, s0, s1, J, zBot, ZONE_TOP));
const grooveRange = new Map(JACKETS.map(({ edge, s0, s1 }) => [edge, [s0 + 0.9, s1 - 0.9]]));
const grooves = JACKETS.flatMap(({ edge, zBot }) => {
  const { Q } = frame(edge);
  const [g0, g1] = grooveRange.get(edge);
  return LOWER.filter(([zf]) => zf + 0.6 >= zBot).map(([zf, fh]) => {
    const lo = zf + 0.6, hiIn = zf + fh - 0.45;
    return Manifold.hull([g0, g1].flatMap((s) => [Q(s, 0.05 - 0.1, lo), Q(s, J + 0.2, lo), Q(s, -0.05, hiIn), Q(s, J + 0.2, hiIn + J + 0.25)]));
  });
});

// Dakrand, attiek en de kaders rond de dakterrassen.
const inset = (x0, y0, x1, y1, d) => rect(x0 + d, y0 + d, x1 - d, y1 - d);
const roofTop = union([
  prism(TOWER, z(ROOF) - 0.1, z(PARAPET)).subtract(prism(inset(W, S, E, N, 0.9), z(ROOF) - 1, z(PARAPET) + 1)),
  prism(rect(W, N - 0.9, E, N), z(ROOF) - 0.1, z(CROWN)),
  ...TERRACES.map(([[x0, y0], , [x1, y1]]) => prism(rect(x0 - 0.9, y0 - 0.9, x1 + 0.9, y1 + 0.9), z(ROOF) - 0.1, z(PARAPET))),
]);
const terraceCuts = TERRACES.map((t) => prism(t, z(TERRACE), z(CROWN) + 1));

const tower = union([towerBox, northStack, swStack, seStack, annex, ...jackets, roofTop]).subtract(union([...grooves, ...terraceCuts]));

// ---------- Gevelreliëf: vensters als blinde nissen ----------
const DEPTH = 0.35;
const PITCH = 2.7;
const cuts = [];
const inTerrace = (edge, s0, s1, zf) => {
  if (zf < z(TERRACE) - 1) return false;
  const { Q } = frame(edge);
  const p0 = Q(s0, -0.5, 0), p1 = Q(s1, -0.5, 0);
  // Een nis die binnen 1,0 m van een terras uitkomt, zou de kaderwand te dun maken.
  return TERRACES.some(([[x0, y0], , [x1, y1]]) => [p0, p1, [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2]].some(([u, v]) => u > x0 - 1.0 && u < x1 + 1.0 && v > y0 - 1.0 && v < y1 + 1.0));
};
const exposed = (Q, s, h) => {
  const from = Q(s, 3, h), hit = core.rayCast(from, Q(s, -1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
};
// Vensters per travee langs een rand: sill en kop vanaf de vloer, breedte, toegestaan s-bereik.
function windows(edge, floors, { width = 1.4, sill = 0.9, top, range, skip = () => false } = {}) {
  const { L: len, Q } = frame(edge);
  const P = (s, depth, h) => Q(s, -depth, h);
  const bays = Math.floor((len - 0.9) / PITCH), w = (len - bays * PITCH) / 2;
  for (const [zf, fh] of floors) {
    const lo = zf + sill, hi = (top ? top(zf, fh) : zf + fh - 0.35) - DEPTH;
    if (hi - lo < 0.9) continue;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * PITCH + (PITCH - width) / 2, s1 = s0 + width;
      if (range && (s0 < range[0] || s1 > range[1])) continue;
      if (skip(s0, s1, zf)) continue;
      if (![s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => exposed(Q, s, h)))) continue;
      cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
// Entree aan de Magazijnstraat: portiek van 3,0 m breed en 1,2 m diep, plafond onder 45°.
const ENTRANCE = [7.5 - S, 10.5 - S]; // s-bereik op de oostrand (v 7,5–10,5)
{
  const { Q } = frame(EDGES.east);
  cuts.push(Manifold.hull(ENTRANCE.flatMap((s) => [Q(s, 0.2, 0), Q(s, -1.2, 0), Q(s, -1.2, 3.4), Q(s, 0.2, 4.8)])));
}
for (const [name, edge] of Object.entries(EDGES)) {
  // Bovenste zone: hoge vensters tussen penanten.
  windows(edge, UPPER, { sill: 0.8, top: (zf, fh) => zf + fh - 0.35, skip: (s0, s1, zf) => inTerrace(edge, s0, s1, zf) });
  // Onderste zone: vensters in de groeven tussen de vloerbanden.
  if (grooveRange.has(edge)) windows(edge, LOWER, { top: (zf, fh) => zf + fh - 0.45, range: grooveRange.get(edge) });
  // Begane grond: brede vensters onder de kraag van de banden of de balkons.
  const plinthTop = { east: 4.6, north: GF - OUT_N - 0.2, south: GF - OUT_S - 0.2, west: 0 }[name];
  windows(edge, [FLOORS[0]], { width: 2.0, sill: 0.4, top: () => plinthTop, skip: (s0, s1) => name === "east" && s1 > ENTRANCE[0] - 0.9 && s0 < ENTRANCE[1] + 0.9 });
}
// Open balkons: noordzijde in drie stukken over de hele breedte, zuidhoeken elk één stuk.
cuts.push(...balconyCuts(EDGES.north, split(-0.4, L.north + 0.4, 3), OUT_N, ZONE_TOP));
cuts.push(...balconyCuts(EDGES.south, [[SW_STACK[0] - W + 0.9, SW_STACK[1] - W - 0.9]], OUT_S, ZONE_TOP));
cuts.push(...balconyCuts(EDGES.south, [[SE_STACK[0] - W + 0.9, SE_STACK[1] - W - 0.9]], OUT_S, ZONE_TOP));

const building = tower.subtract(union(cuts));

// ---------- Onderbouw ----------
// Zuidgevel aan het parkeerterrein: begane grond en drie lagen met vensters.
const PODIUM_FLOORS = [[0, 5.0], [5.0, 3.8], [8.8, 3.8], [12.6, 3.8]];
const podiumCuts = [];
{
  const a = PODIUM_POLY[4], b = PODIUM_POLY[5]; // zuidrand, van west naar oost
  const { L: len, Q } = frame([a, b]);
  const P = (s, depth, h) => Q(s, -depth, h);
  const bays = Math.floor((len - 0.9) / PITCH), w = (len - bays * PITCH) / 2;
  for (const [zf, fh] of PODIUM_FLOORS) {
    const lo = zf + (zf === 0 ? 0.4 : 0.9), hi = zf + fh - 0.35 - DEPTH, width = zf === 0 ? 2.0 : 1.4;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * PITCH + (PITCH - width) / 2, s1 = s0 + width;
      // Bovenste laag niet boven het lagere zuidwestdeel (u < -31,5).
      if (zf + fh > z(PODIUM_LOW) - 0.1 && a[0] + s0 < -30.6) continue;
      podiumCuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const base = union([podium, strip]).subtract(union(podiumCuts));

const nodes = [
  ["building:de-bankier-tilburg-toren", building],
  ["building:de-bankier-tilburg-onderbouw", base],
];
for (const [name, m] of nodes) {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(2)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
}
console.log("nissen en balkons", cuts.length, "groeven", grooves.length, "onderbouwnissen", podiumCuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "De Bankier",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 58.25, // NAP-maaiveld + ca. 43,8 m (Tilburg, ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0855100000715598", "NL.IMBAG.Pand.0855100000715596", "NL.IMBAG.Pand.0855100000715597"],
    description:
      "Woontoren De Bankier op de hoek van de Spoorlaan en de Magazijnstraat (Spoorzone Tilburg): toren van 22,5 × 32,0 m tot NAP +87,85 m met een dakrand tot +88,8 m, een attiek langs de noordgevel tot +90,0 m en twee verdiepte dakterrassen op +84,2 m op de zuidhoeken; de onderste dertien woonlagen met horizontale vloerbanden, aan de Spoorlaan een doorlopende balkonzone en op de zuidhoeken balkonstapels tot +60,15 m, de bovenste negen lagen met vensters tussen penanten; ten westen een lage onderbouw tot +30,9 m en een strook tot +30,3 m tegen het oude bankgebouw, aan de zuidoostkant een aanbouw tot +27,15 m. De toren staat op drie BAG-panden; alle hoogtes uit de 3D BAG (AHN5, 2024), want het PDOK-AHN is van vóór de oplevering. Oorsprong midden in de toren, X-as langs de zuidgevel (-8,2° op RD-oost). Verdiepingshoogte, vensterraster, uitsteek van de banden en de noordelijke balkonzone, de balkonstapel zuidwest en de entree zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      parapetNapM: PARAPET,
      northCrownNapM: CROWN,
      terraceNapM: TERRACE,
      balconyZoneTopNapM: BALCONY_TOP,
      podiumNapM: [PODIUM_LOW, PODIUM, PODIUM_HIGH],
      stripNapM: STRIP,
      annexNapM: [ANNEX_LOW, ANNEX_HIGH],
      towerPlanM: [+(E - W).toFixed(2), +(N - S).toFixed(2)],
      floors: 23,
      groundFloorM: GF,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0855100000715598, 0855100000715596 en 0855100000715597 (bouwjaar 2023), actuele orthoHR, AHN-DTM 0,5 m",
      "3D BAG LoD2.2 (AHN5, 2024): https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000715598",
      "https://nl.wikipedia.org/wiki/De_Bankier_(gebouw)",
      "https://commons.wikimedia.org/wiki/File:Woontoren_De_Bankier.jpg",
      "https://commons.wikimedia.org/wiki/File:De_Bankier_Tilburg2.jpg",
      "https://commons.wikimedia.org/wiki/File:De_Bankier.jpg",
      "https://commons.wikimedia.org/wiki/File:Magazijnstraat.jpg",
    ],
  },
});

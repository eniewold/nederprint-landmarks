// Résidence L'Étoile (Van Leijenberghlaan 20–84, Buitenveldert, Amsterdam, 1997, Ellerman Lucas Van Vugt):
// woontoren van 23 lagen aan de noordoosthoek van winkelcentrum Gelderlandplein. Een beige schijf van
// 11,4 × 23,6 m in noord-zuidrichting met een verticale naad in de kopgevels, aan weerszijden vleugels die
// in drie stappen naar buiten springen (de "ster") en naar buiten toe lager eindigen (65,0 / 62,3 / 59,2),
// glazen erkers op de buitenste stap, in de zuidelijke binnenhoeken een stapel balkons met glazen
// borstwering, en op het dak een opbouw met de penthouse aan de noordkop.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023) en het AHN-DSM, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "residence-letoile";
// Gebouwstelsel: u langs de kopgevels naar het oosten (-0,35° op RD-oost, BAG-randen evenwijdig binnen
// 0,1°), v langs de schijf naar het noorden. Oorsprong in het hart van de schijf.
const ORIGIN = [120353.1, 482775.0];
const ANGLE = -0.35;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = -0.65; // NAP, maaiveld rondom (AHN-DTM -0,86…-0,58, 3D BAG -0,62)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG-dakvlakken en AHN-DSM ----------
const SLAB = 67.95; // schijf (3D BAG 67,93–67,96)
const SPINE = 69.65; // dakopbouw midden op de schijf (69,62–69,68)
const PENTHOUSE = 71.2; // penthouse aan de noordkop (71,19–71,24)
const PLANT = 70.3; // installatiekast aan de zuidkant (DSM 69–71)
const WING_HIGH = 65.0; // binnenste stap van de vleugels (64,84–65,05)
const WING_MID = 62.3; // middelste stap en de noordkant (61,6–62,7)
const WING_LOW = 59.2; // erkers op de buitenste stap en de balkonstapels (59,10–59,19; DSM 59–60)

// ---------- Plattegrond in (u, v), BAG-contour vereenvoudigd en gespiegeld (verschil < 0,05 m) ----------
const SLAB_POLY = rect(-5.72, -11.82, 5.72, 11.79);
const SPINE_POLY = rect(-2.45, -3.0, 2.45, 7.0);
const PENTHOUSE_POLY = rect(-1.4, 5.7, 2.1, 11.79);
const PLANT_POLY = rect(0.4, -9.0, 1.9, -6.5);
const mirror = (poly, side) => poly.map(([u, v]) => [u * side, v]);
// Oostelijke vleugel; de westelijke is het spiegelbeeld.
const EAST = {
  inner: rect(5.62, -9.1, 8.42, 8.3), // binnenste stap tot WING_HIGH
  innerNorth: rect(5.62, 8.2, 8.42, 10.39), // noordkant van de binnenste stap tot WING_MID
  mid: rect(8.32, -6.42, 11.11, 10.39), // middelste stap tot WING_MID
  midHigh: rect(8.32, -1.0, 10.2, 7.5), // midden van de middelste stap tot WING_HIGH (DSM)
  outer: rect(11.01, -2.39, 12.42, 6.31), // buitenste stap met de glazen erker tot WING_LOW
  // Balkonstapel in de zuidelijke binnenhoek, buiten de BAG-contour (DSM 59 tot u = 12,15 en v = -9,5).
  stack: [[8.32, -9.5], [12.15, -9.5], [12.15, -2.29], [11.01, -2.29], [11.01, -6.32], [8.32, -6.32]],
};

// ---------- Lagen ----------
// Begane grond 4,5 m, daarboven lagen van 3,0 m (21 lagen tot de schijf, de penthouse erbovenop).
const STOREY = 3.0;
const FLOORS = [[0, 4.5], ...Array.from({ length: 22 }, (_, k) => [4.5 + STOREY * k, STOREY])];
const upTo = (nap) => FLOORS.filter(([zf, fh]) => zf + fh <= z(nap) + 0.01);
const STACK_FROM = FLOORS[1][0]; // balkons vanaf de eerste verdieping

// Balkonstapel: blok tot WING_LOW met onder de eerste verdieping een kraag van 45° naar de gevels.
function balconyStack(side) {
  const poly = mirror(EAST.stack, side);
  const block = mirror(rect(8.32, -9.5, 12.15, -6.32), side);
  const strip = mirror(rect(11.01, -6.32, 12.15, -2.29), side);
  const z0 = STACK_FROM, D = 4.0, r2 = Math.SQRT2;
  // Onderkant z >= z0 - W + d, met d de afstand tot de gevel en W de diepte van de stapel vanaf die gevel.
  // Vanaf de zijgevel van de binnenste stap (|u| = 8,42, W = 3,73): z - side·u >= z0 - 12,15.
  const fromSide = union([block, strip].map((r) => prism(r, z0 - D, z0 + 0.01).trimByPlane([-side / r2, 0, 1 / r2], (z0 - 12.15) / r2)));
  // Vanaf de zuidgevel van de middelste stap (v = -6,42, W = 3,08): z + v >= z0 - 9,5.
  const fromNorth = prism(block, z0 - D, z0 + 0.01).trimByPlane([0, 1 / r2, 1 / r2], (z0 - 9.5) / r2);
  const solid = union([prism(poly, z0, z(WING_LOW)), fromSide, fromNorth]);
  // Per laag een open balkon van 0,9 m diep achter een borstwering van 1,0 m, plafond onder 45°, rondom
  // langs de zuid- en de buitengevel zonder hoekkolom.
  const cuts = [];
  const faces = side > 0
    ? [[[8.52, -9.5], [12.15, -9.5]], [[12.15, -9.5], [12.15, -2.49]]]
    : [[[-12.15, -2.49], [-12.15, -9.5]], [[-12.15, -9.5], [-8.52, -9.5]]];
  faces.forEach(([a, b], i) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    for (const [zf, fh] of upTo(WING_LOW)) {
      if (zf < STACK_FROM - 0.01) continue;
      const lo = zf + 1.0, hi = zf + fh - 0.3 - 0.9;
      // De eerste gevel loopt 0,2 m door voorbij de hoek, de tweede begint 0,2 m ervoor: geen hoekkolom.
      const [s0, s1] = i === 0 ? [0, L + 0.2] : [-0.2, L];
      cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, 0.9, lo), P(s1, 0.9, lo), P(s0, -0.2, hi + 1.1), P(s1, -0.2, hi + 1.1), P(s0, 0.9, hi), P(s1, 0.9, hi)]));
    }
  });
  return solid.subtract(union(cuts));
}

const wingParts = [-1, 1].flatMap((side) => [
  prism(mirror(EAST.inner, side), BASE, z(WING_HIGH)),
  prism(mirror(EAST.innerNorth, side), BASE, z(WING_MID)),
  prism(mirror(EAST.mid, side), BASE, z(WING_MID)),
  prism(mirror(EAST.midHigh, side), z(WING_MID) - 0.1, z(WING_HIGH)),
  prism(mirror(EAST.outer, side), BASE, z(WING_LOW)),
]);
const stacks = [-1, 1].map(balconyStack);
const body = union([
  prism(SLAB_POLY, BASE, z(SLAB)),
  prism(SPINE_POLY, z(SLAB) - 0.1, z(SPINE)),
  prism(PENTHOUSE_POLY, z(SLAB) - 0.1, z(PENTHOUSE)),
  prism(PLANT_POLY, z(SLAB) - 0.1, z(PLANT)),
  ...wingParts,
  ...stacks,
]);

// ---------- Gevelreliëf ----------
const DEPTH = 0.35;
const cuts = [];
// Ligt het punt op afstand s langs a→b op hoogte h aan de buitengevel? Straal van 3 m buiten de gevel.
function exposedAt(P, s, h) {
  const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
}
// Vensters per travee langs de rand a→b (buitennormaal rechts van de looprichting): blinde nissen met
// een plafond onder 45°. Ligt de onderkant van een venster achter een lager dak (terugsprong), dan
// begint de nis boven dat dak; anders vervalt het venster waar de gevel niet aan de buitenkant ligt.
function face(a, b, floors, { pitch = 2.4, width = 1.5, sill = 0.9, header = 0.35, band = false } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const spans = [];
  if (band) spans.push([0.45, L - 0.45]);
  else {
    const bays = Math.max(1, Math.floor((L - 0.9) / pitch)), w = (L - bays * pitch) / 2;
    if (L < width + 0.9) return;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * pitch + (pitch - width) / 2;
      spans.push([s0, s0 + width]);
    }
  }
  for (const [zf, fh] of floors) {
    const hi = zf + fh - header - DEPTH;
    for (const [s0, s1] of spans) {
      const samples = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1];
      if (!samples.every((s) => exposedAt(P, s, hi + DEPTH - 0.05))) continue;
      let lo = zf + sill;
      while (lo < hi - 0.9 && !samples.every((s) => exposedAt(P, s, lo + 0.05))) lo += 0.25;
      if (hi - lo < 0.9) continue;
      if (lo > zf + sill) lo += 0.3; // borstwering boven het lagere dak
      if (hi - lo < 0.9) continue;
      cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
const ground = { sill: 0.6 };
const floorsOf = (nap) => upTo(nap).map(([zf, fh], i) => [zf, fh, i === 0]);
function windows(poly, nap, opts = {}) {
  const pts = opts.mirrored ? [...poly].reverse() : poly;
  for (const [a, b] of edges(pts)) {
    const fl = floorsOf(nap);
    face(a, b, fl.filter(([, , g]) => g).map(([zf, fh]) => [zf, fh]), { ...opts, ...ground });
    face(a, b, fl.filter(([, , g]) => !g).map(([zf, fh]) => [zf, fh]), opts);
  }
}
// Schijf: lange gevels per travee; de kopgevels links en rechts van de verticale naad.
const GROOVE = [-1.55, -0.65]; // naad in beide kopgevels (foto's), 0,9 m breed en 0,4 m diep
function faces(points, nap) {
  const fl = floorsOf(nap);
  for (const [a, b] of points) {
    face(a, b, fl.filter(([, , g]) => g).map(([zf, fh]) => [zf, fh]), ground);
    face(a, b, fl.filter(([, , g]) => !g).map(([zf, fh]) => [zf, fh]));
  }
}
faces([[[5.72, -11.82], [5.72, 11.79]], [[-5.72, 11.79], [-5.72, -11.82]]], SLAB);
faces([[[-5.72, -11.82], [GROOVE[0], -11.82]], [[GROOVE[1], -11.82], [5.72, -11.82]], [[5.72, 11.79], [GROOVE[1], 11.79]], [[GROOVE[0], 11.79], [-5.72, 11.79]]], SLAB);
for (const side of [-1, 1]) {
  const m = side < 0;
  windows(mirror(EAST.inner, side), WING_HIGH, { mirrored: m });
  windows(mirror(EAST.innerNorth, side), WING_MID, { mirrored: m });
  windows(mirror(EAST.mid, side), WING_MID, { mirrored: m });
  windows(mirror(EAST.midHigh, side), WING_HIGH, { mirrored: m });
  // Glazen erker op de buitenste stap: per laag een doorlopende raamband.
  const outer = mirror(EAST.outer, side);
  const [a, b] = side > 0 ? [outer[1], outer[2]] : [outer[2], outer[1]];
  face(a, b, upTo(WING_LOW).slice(1), { band: true, sill: 0.6 });
}
// Penthouse aan de noordkop: één glazen laag boven het dak van de schijf.
const PENT_FLOOR = [[z(SLAB), z(PENTHOUSE) - z(SLAB)]];
for (const [a, b] of [[[2.1, 7.0], [2.1, 11.79]], [[2.1, 11.79], [-1.4, 11.79]], [[-1.4, 11.79], [-1.4, 7.0]]]) face(a, b, PENT_FLOOR, { sill: 0.5, header: 0.3, band: true });
// Verticale naad in de kopgevels, van de eerste verdieping tot boven de dakrand.
for (const [v, out] of [[-11.82, -1], [11.79, 1]]) {
  cuts.push(Manifold.hull([
    ...[GROOVE[0], GROOVE[1]].flatMap((u) => [[u, v + out * 0.2, STACK_FROM], [u, v - out * 0.4, STACK_FROM], [u, v + out * 0.2, z(PENTHOUSE) + 1], [u, v - out * 0.4, z(PENTHOUSE) + 1]]),
  ]));
}
// Hoofdingang aan de Van Leijenberghlaan onder de oostelijke erker (foto): nis van 3,0 m breed en 3,0 m hoog (plafond onder 45°).
{
  const P = (v, depth, h) => [12.42 - depth, v, h];
  const lo = 0.0, hi = 3.0;
  cuts.push(Manifold.hull([P(0.5, -0.2, lo), P(3.5, -0.2, lo), P(0.5, 0.6, lo), P(3.5, 0.6, lo), P(0.5, -0.2, hi + 0.8), P(3.5, -0.2, hi + 0.8), P(0.5, 0.6, hi), P(3.5, 0.6, hi)]));
}

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Residence l'Etoile: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Residence l'Etoile", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:residence-letoile", building]],
  catalog: {
    name: "Résidence L'Étoile",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.4, // NAP -0,65 + geoïde NLGEO2018 43,05 (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0363100012092125"],
    description:
      "Résidence L'Étoile aan de Van Leijenberghlaan bij het Gelderlandplein (Buitenveldert): beige schijf van 11,4 × 23,6 m tot NAP +67,95 m met een dakopbouw tot +69,65 m, de penthouse aan de noordkop tot +71,2 m en een installatiekast tot +70,3 m; aan weerszijden vleugels die in drie stappen naar buiten springen en lager eindigen (+65,0, +62,3 en de glazen erkers op de buitenste stap +59,2), in beide zuidelijke binnenhoeken een balkonstapel tot +59,2 m met per laag een open balkon en een kraag onder 45°, een vensterraster per laag, een verticale naad in de kopgevels en de ingang onder de oostelijke erker. Contour uit de BAG, hoogtes uit de 3D BAG (AHN5) en het AHN-DSM. Oorsprong in het hart van de schijf, X-as langs de kopgevels (-0,35° op RD-oost). Verdiepingshoogte, vensterraster, de erkers aan de westkant, de naad en de ingang zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      slabNapM: SLAB,
      spineNapM: SPINE,
      penthouseNapM: PENTHOUSE,
      plantNapM: PLANT,
      wingNapM: [WING_HIGH, WING_MID, WING_LOW],
      balconyStackNapM: WING_LOW,
      slabPlanM: [11.44, 23.61],
      footprintM: [24.84, 23.61],
      floors: 23,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012092125 (bouwjaar 1997, Van Leijenberghlaan 20–84), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG LoD2.2 (AHN5 2023)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam",
      "https://commons.wikimedia.org/wiki/File:Van_Leijenberghlaan_20-84.jpg",
      "https://commons.wikimedia.org/wiki/File:Winkelcentrum_Gelderlandplein,_noordgevel_(1).jpg",
      "https://commons.wikimedia.org/wiki/File:Gelderlandplein_-_panoramio.jpg",
    ],
  },
});

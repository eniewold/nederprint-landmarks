// Toren Noord (Boogschutterstraat, Apeldoorn-Noord, 2002, UNStudio; eerst La Tour, daarna HNK): kantoortoren
// van 21 lagen, het hoogste gebouw van Apeldoorn, met een aangebouwde laagbouwvleugel van twee lagen op een
// open parkeerlaag. De toren staat met de zuid- en westgevel aan een vijver. Zijn gevels zijn een lappendeken
// van witte vlakken met een vensterraster en schermen van horizontale aluminium lamellen die ongeveer een
// meter voor de gevel staan; de lamellenschermen lopen als open kader door tot boven het dak. Het noordelijke
// deel van de oostgevel buigt in de bovenste lagen naar binnen. Op het dak een installatieopbouw.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2) en het AHN-DSM, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "toren-noord-apeldoorn";
// Gebouwstelsel: u langs de zuidgevel van de toren naar het oostnoordoosten (19,0° op RD-oost, BAG-randen
// 18,8–19,2°), v haaks erop naar het noordnoordwesten; (0, 0) is de zuidwesthoek van de BAG-contour
// (RD 195490,28 472502,53). Oorsprong van het model in het hart van de toren.
const SW = [195490.28, 472502.53];
const ANGLE = 19.0;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const UC = 11.15, VC = 18.29; // hart van de toren in (u, v)
const ORIGIN = [SW[0] + AXIS[0] * UC - AXIS[1] * VC, SW[1] + AXIS[1] * UC + AXIS[0] * VC].map((c) => +c.toFixed(2));
const GROUND = 9.1; // NAP, entreeplein aan de oostkant (AHN-DTM 9,1–9,2); vijver 8,7, parkeerterrein noord 10,8
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 en AHN-DSM ----------
const ROOF = 80.7; // torendak (3D BAG 80,71–80,76, b3_h_dak_70p 80,76; DSM 80,7)
const FRAME = 84.0; // lamellenkader boven het dak (3D BAG 83,95–84,03; DSM 83,6–84,1)
const PLANT = 84.28; // installatieopbouw (3D BAG 84,28)
const PLANT_SMALL = 82.1; // kastje naast de opbouw (3D BAG 82,09)
const WING = 19.6; // laagbouwvleugel (3D BAG 19,60–19,65)
const WING_BOX = 21.0; // opbouw op de vleugel (3D BAG 20,87–21,00)
const LEAN_FROM = 55.0; // noordoostgevel: vanaf hier buigt hij naar binnen (DSM-helling 80→60 over 2 m)

// ---------- Plattegrond in (u, v) ----------
const U1 = 22.3, V1 = 36.58; // torencontour (BAG-rechthoek)
const WING_POLY = rect(U1 - 0.3, 14.44, 56.42, V1); // vleugel (BAG)
const LOUVRE = 1.0; // lamellenschermen voor de BAG-gevel (DSM-rand west −1,0…−1,5, noord +1,2)
const LOUVRE_E = 0.7; // oostgevel (DSM-rand +0,5…+0,7)
const WHITE = 0.6; // witte gevelvlakken (DSM-rand zuid −0,6…−1,0, west-midden −0,5…−1,0)
const SPLIT_W = [9.2, 25.3]; // westgevel: lamellenbanden v < 9,2 en v > 25,3, wit vlak ertussen (foto)
const SPLIT_S = 11.0; // zuidgevel: lamellenblok onderin voor u < 11,0 (foto)
const SPLIT_E = [14.4, 25.3]; // oostgevel: wit onderin tot de vleugel, recht deel, naar binnen buigend deel
const LEAN_TOP_U = 20.5; // dakrand van het naar binnen buigende deel (DSM)

// Lagen: begane grond 5,0 m, daarboven 20 kantoorlagen van 3,33 m tot het dak.
const STOREY = (z(ROOF) - 5.0) / 20;
const FLOORS = Array.from({ length: 20 }, (_, k) => [5.0 + STOREY * k, STOREY]);
const Z_MID = 5.0 + 11 * STOREY; // grens tussen onderste en bovenste gevelvlakken (11 lagen, foto)

// Gevels: punt op de BAG-lijn, richting langs de gevel en buitennormaal.
const FACES = {
  S: { a: [0, 0], d: [1, 0], n: [0, -1] },
  E: { a: [U1, 0], d: [0, 1], n: [1, 0] },
  N: { a: [0, V1], d: [1, 0], n: [0, 1] },
  W: { a: [0, 0], d: [0, 1], n: [-1, 0] },
};
const P = (f, s, t, h) => [f.a[0] + f.d[0] * s + f.n[0] * t, f.a[1] + f.d[1] * s + f.n[1] * t, h];

// Gevelvlak voor de BAG-gevel van t = -0,5 (in de kern) tot tOut, van zA tot zB; de onderkant loopt
// onder 45° op vanaf tBelow (wat eronder zit: kern 0 of een wit vlak), dus zonder vrije overhang.
function panel(f, s0, s1, tOut, zA, zB, tBelow = 0) {
  const lift = tOut - tBelow;
  return Manifold.hull([
    P(f, s0, -0.5, zA), P(f, s1, -0.5, zA), P(f, s0, tBelow, zA), P(f, s1, tBelow, zA),
    P(f, s0, tOut, zA + lift), P(f, s1, tOut, zA + lift),
    P(f, s0, -0.5, zB), P(f, s1, -0.5, zB), P(f, s0, tOut, zB), P(f, s1, tOut, zB),
  ]);
}

// ---------- Toren ----------
const TOP = z(FRAME), RZ = z(ROOF);
const louvres = [
  panel(FACES.S, -LOUVRE, SPLIT_S, LOUVRE, 5.0, Z_MID), // zuid, lamellenblok onderin
  panel(FACES.W, -LOUVRE, SPLIT_W[0], LOUVRE, 5.0, TOP), // west, zuidelijke band
  panel(FACES.W, SPLIT_W[0], SPLIT_W[1], LOUVRE, 5.0, Z_MID), // west, midden onderin
  panel(FACES.W, SPLIT_W[1], V1 + LOUVRE, LOUVRE, 5.0, TOP), // west, noordelijke band
  panel(FACES.N, -LOUVRE, U1 + LOUVRE_E, LOUVRE, 5.0, TOP), // noord
  panel(FACES.E, -WHITE, SPLIT_E[0], LOUVRE_E, Z_MID, TOP, WHITE), // oost, boven het witte vlak
  panel(FACES.E, SPLIT_E[0], V1 + LOUVRE, LOUVRE_E, z(WING) - 0.3, TOP), // oost, boven de vleugel
];
const whites = [
  panel(FACES.S, 0, U1 + WHITE, WHITE, 5.0, RZ), // zuid
  panel(FACES.W, SPLIT_W[0], SPLIT_W[1], WHITE, Z_MID, RZ, WHITE), // west, midden boven (rust op de lamellen)
  panel(FACES.E, -WHITE, SPLIT_E[0], WHITE, 5.0, Z_MID), // oost, onderin
];
// Lamellenkader boven het dak waar de gevel wit eindigt: zuidrand, en achter het witte vlak van de westgevel.
const frames = [
  panel(FACES.S, 0, U1 + WHITE, WHITE, RZ - 0.1, TOP),
  Manifold.hull([[0, SPLIT_W[0], RZ - 0.1], [0.6, SPLIT_W[0], RZ - 0.1], [0, SPLIT_W[1], RZ - 0.1], [0.6, SPLIT_W[1], RZ - 0.1], [0, SPLIT_W[0], TOP], [0.6, SPLIT_W[0], TOP], [0, SPLIT_W[1], TOP], [0.6, SPLIT_W[1], TOP]]),
  prism(rect(17.4, SPLIT_E[1], LEAN_TOP_U + 0.05, V1 + 0.5), RZ - 0.1, TOP), // kader in de noordoosthoek (3D BAG)
];
const core = prism(rect(0, 0, U1, V1), BASE, RZ);
const plant = union([
  prism(rect(7.1, 7.1, 14.75, 29.3), RZ - 0.1, z(PLANT)), // installatieopbouw (3D BAG, 186 m²)
  prism(rect(5.35, 14.25, 7.2, 22.0), RZ - 0.1, z(PLANT)),
  prism(rect(15.5, 12.2, 17.7, 13.8), RZ - 0.1, z(PLANT_SMALL)),
]);
// Het noordelijke deel van de oostgevel buigt boven LEAN_FROM naar binnen tot de dakrand op u = 20,5.
const lean = Manifold.hull([SPLIT_E[1], V1 + LOUVRE + 1].flatMap((v) => [
  [U1 + LOUVRE_E, v, z(LEAN_FROM)], [LEAN_TOP_U, v, RZ], [LEAN_TOP_U, v, TOP + 5], [U1 + 8, v, TOP + 5], [U1 + 8, v, z(LEAN_FROM)],
]));
let tower = union([core, ...louvres, ...whites, ...frames, plant]).subtract(lean);
// Het kader in de noordoosthoek komt pas na de schuine snede terug.
tower = union([tower, frames[2]]);

// ---------- Gevelreliëf toren ----------
const DEPTH = 0.35;
const cuts = [];
// Exposed: de gevel staat op deze hoogte en positie precies op tFace (straal van buiten).
const exposedAt = (body, f, s, h, tFace) => {
  const from = P(f, s, tFace + 3, h), hit = body.rayCast(from, P(f, s, tFace - 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
};
// Nis van s0 tot s1 met plafond onder 45°; tFace(h) is de gevel op hoogte h (schuin deel).
const niche = (f, s0, s1, lo, hi, tFace, depth = DEPTH) => Manifold.hull([
  P(f, s0, tFace(lo) + 0.2, lo), P(f, s1, tFace(lo) + 0.2, lo), P(f, s0, tFace(lo) - depth, lo), P(f, s1, tFace(lo) - depth, lo),
  P(f, s0, tFace(hi) + 0.2, hi + depth + 0.2), P(f, s1, tFace(hi) + 0.2, hi + depth + 0.2), P(f, s0, tFace(hi) - depth, hi), P(f, s1, tFace(hi) - depth, hi),
]);
// Witte vlakken: per laag vensters van 0,9 m op 1,8 m (foto: negen vensters over het witte vlak van de westgevel).
function windows(f, s0, s1, floors, tFace) {
  const pitch = 1.8, width = 0.9, L = s1 - s0, bays = Math.floor((L - 0.9) / pitch), w = (L - bays * pitch) / 2;
  for (const [zf, fh] of floors) {
    const lo = zf + 0.9, hi = zf + fh - 0.5 - DEPTH;
    for (let k = 0; k < bays; k++) {
      const a = s0 + w + k * pitch + (pitch - width) / 2, b = a + width;
      if ([a + 0.1, b - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => exposedAt(tower, f, s, h, tFace))))
        cuts.push(niche(f, a, b, lo, hi, () => tFace));
    }
  }
}
// Lamellenschermen: per laag een doorlopende band (glas achter de lamellen) achter een dichte strook van
// 1,0 m (vloerrand en dichte lamellen), 0,35 m diep met een plafond onder 45°.
function bands(f, s0, s1, floors, tFace) {
  const t = typeof tFace === "function" ? tFace : () => tFace;
  for (const [zf, fh] of floors) {
    const lo = zf + 1.0, hi = zf + fh - DEPTH;
    let start = null;
    const flush = (end) => {
      if (start !== null && end - start >= 0.9) cuts.push(niche(f, start, end, lo, hi, t));
      start = null;
    };
    for (let s = s0 + 0.6; s <= s1 - 0.6 + 1e-6; s += 0.5) {
      const ok = [lo + 0.05, hi + DEPTH - 0.05].every((h) => exposedAt(tower, f, s, h, t(h)));
      if (ok && start === null) start = s;
      if (!ok) flush(s - 0.5);
    }
    flush(s1 - 0.6);
  }
}
const lower = FLOORS.filter(([zf]) => zf < Z_MID - 0.1);
const upper = FLOORS.filter(([zf]) => zf >= Z_MID - 0.1);
windows(FACES.S, 0, U1 + WHITE, FLOORS, WHITE);
windows(FACES.W, SPLIT_W[0], SPLIT_W[1], upper, WHITE);
windows(FACES.E, -WHITE, SPLIT_E[0], lower, WHITE);
bands(FACES.S, -LOUVRE, SPLIT_S, lower, LOUVRE);
bands(FACES.W, -LOUVRE, SPLIT_W[0], FLOORS, LOUVRE);
bands(FACES.W, SPLIT_W[0], SPLIT_W[1], lower, LOUVRE);
bands(FACES.W, SPLIT_W[1], V1 + LOUVRE, FLOORS, LOUVRE);
bands(FACES.N, -LOUVRE, U1 + LOUVRE_E, FLOORS, LOUVRE);
bands(FACES.E, -WHITE, SPLIT_E[0], upper, LOUVRE_E);
bands(FACES.E, SPLIT_E[0], SPLIT_E[1], FLOORS.filter(([zf]) => zf > z(WING)), LOUVRE_E);
// Schuin deel: de gevel loopt van t = 0,7 op LEAN_FROM naar t = −1,8 op het dak.
const leanT = (h) => (h <= z(LEAN_FROM) ? LOUVRE_E : LOUVRE_E - ((h - z(LEAN_FROM)) / (RZ - z(LEAN_FROM))) * (U1 + LOUVRE_E - LEAN_TOP_U));
bands(FACES.E, SPLIT_E[1], V1 + LOUVRE, FLOORS.filter(([zf]) => zf > z(WING)), leanT);

// Begane grond: aan de zuid- en de entreekant (oost, tot de vleugel) een glazen pui 1,5 m achter de gevel tussen
// kolommen van 1,0 m, met een plafond onder 45° tot de gevelvlakken erboven; west en noord een glazen pui
// van 0,35 m diep tussen penanten van 0,9 m.
const GF = 5.0;
const colonnade = (f, cols) => {
  for (let k = 0; k + 1 < cols.length; k++) {
    const s0 = cols[k] + 0.5, s1 = cols[k + 1] - 0.5;
    cuts.push(Manifold.hull([
      P(f, s0, 1.5, 0), P(f, s1, 1.5, 0), P(f, s0, -1.5, 0), P(f, s1, -1.5, 0),
      P(f, s0, 1.5, GF + 1.5), P(f, s1, 1.5, GF + 1.5), P(f, s0, 0, GF), P(f, s1, 0, GF), P(f, s0, -1.5, GF - 1.5), P(f, s1, -1.5, GF - 1.5),
    ]));
  }
};
colonnade(FACES.S, [0.5, 6.0, 11.5, 17.0, 21.8]);
colonnade(FACES.E, [0.5, 7.2, 13.9]);
for (const [f, L] of [[FACES.W, V1], [FACES.N, U1]]) {
  const bays = 6, pitch = (L - 0.9) / bays;
  for (let k = 0; k < bays; k++) {
    const s0 = 0.9 + k * pitch, s1 = s0 + pitch - 0.9;
    cuts.push(niche(f, s0, s1, 0.4, GF - 0.9 - DEPTH, () => 0));
  }
}
tower = tower.subtract(union(cuts));

// ---------- Laagbouwvleugel ----------
// Open parkeerlaag van 5,0 m onder een kantoorlaag; zuidgevel een colonnade 1,5 m diep met kolommen van 1,0 m,
// oost- en noordgevel een dichte pui (hekwerk) als nis van 0,35 m; vensters van 1,6 m op 2,8 m.
let wing = union([
  prism(WING_POLY, BASE, z(WING)),
  prism(rect(24.3, 23.9, 26.3, 27.0), z(WING) - 0.1, z(WING_BOX)),
]);
const wcuts = [];
const WS = { a: [0, 14.44], d: [1, 0], n: [0, -1] };
const WE = { a: [56.42, 0], d: [0, 1], n: [1, 0] };
const WN = { a: [0, V1], d: [1, 0], n: [0, 1] };
{
  const cols = Array.from({ length: 7 }, (_, k) => U1 + 0.6 + (k * (56.42 - 0.5 - U1 - 0.6)) / 6);
  for (let k = 0; k + 1 < cols.length; k++) {
    const s0 = cols[k] + 0.5, s1 = cols[k + 1] - 0.5;
    wcuts.push(Manifold.hull([
      P(WS, s0, 1.5, 0), P(WS, s1, 1.5, 0), P(WS, s0, -1.5, 0), P(WS, s1, -1.5, 0),
      P(WS, s0, 1.5, GF + 1.5), P(WS, s1, 1.5, GF + 1.5), P(WS, s0, 0, GF), P(WS, s1, 0, GF), P(WS, s0, -1.5, GF - 1.5), P(WS, s1, -1.5, GF - 1.5),
    ]));
  }
}
const wingWindows = (f, s0, s1) => {
  const pitch = 2.8, width = 1.6, L = s1 - s0, bays = Math.floor((L - 0.9) / pitch), w = (L - bays * pitch) / 2;
  for (let k = 0; k < bays; k++) {
    const a = s0 + w + k * pitch + (pitch - width) / 2;
    wcuts.push(niche(f, a, a + width, 6.4, z(WING) - 1.3 - DEPTH, () => 0));
  }
};
wingWindows(WS, U1 + 0.6, 56.42);
wingWindows(WE, 14.44, V1);
wingWindows(WN, U1 + LOUVRE_E + 0.3, 56.42);
for (const [f, s0, s1] of [[WE, 14.44, V1], [WN, U1 + LOUVRE_E + 0.3, 56.42]]) {
  const L = s1 - s0, bays = Math.max(1, Math.round(L / 5.6)), pitch = (L - 0.9) / bays;
  for (let k = 0; k < bays; k++) wcuts.push(niche(f, s0 + 0.9 + k * pitch, s0 + (k + 1) * pitch, 0.4, GF - 0.9 - DEPTH, () => 0));
}
wing = wing.subtract(union(wcuts));

// ---------- Naar het modelstelsel ----------
const nodes = [["toren", tower], ["laagbouw", wing]].map(([label, m]) => {
  const solid = m.translate([-UC, -VC, 0]);
  const parts = solid.decompose();
  if (parts.length !== 1) throw new Error(`${label}: ${parts.length} losse delen`);
  console.log(label, solid.status(), "genus", solid.genus(), "driehoeken", solid.numTri());
  return [`building:${slug}-${label}`, solid];
});
console.log("nissen toren", cuts.length, "vleugel", wcuts.length, "origin", ORIGIN);

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Toren Noord",
    origin: ORIGIN,
    xAxis: AXIS.map((c) => +c.toFixed(6)),
    groundNap: GROUND,
    groundHeight: 52.23, // NAP 9,1 + 43,13 (NLGEO2018 43,24 ter plekke, −0,1 zoals Peperbus, MAC³PARK en Walburgiskerk)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[25 - UC, 3 - VC], [29 - UC, 8 - VC], [26 - UC, 11.5 - VC]].map((p) => p.map((c) => +c.toFixed(2))),
    replacesBuildings: ["NL.IMBAG.Pand.0200100000700217"],
    description:
      "Toren Noord (2002, UNStudio; eerder La Tour en HNK) aan de Boogschutterstraat in Apeldoorn-Noord: toren op de BAG-contour van 22,3 × 36,6 m tot NAP +80,7 m (72 m boven het entreeplein) met 21 lagen, gevels als lappendeken van witte vlakken met een vensterraster (0,6 m voor de BAG-gevel) en lamellenschermen met een band per laag (1,0 m voor de gevel, oost 0,7 m) die als kader doorlopen tot +84,0 m; het noordelijke deel van de oostgevel buigt boven +55 m naar binnen tot een dakrand 1,8 m achter de gevel. Op het dak een installatieopbouw tot +84,3 m. Begane grond 5,0 m, aan de zuid- en entreekant een colonnade 1,5 m diep. Aan de oostkant de laagbouwvleugel (hetzelfde BAG-pand) tot +19,6 m op een open parkeerlaag met colonnade. Hoogtes uit de 3D BAG en het AHN-DSM. Oorsprong in het hart van de toren, X-as langs de zuidgevel (19,0° op RD-oost). Verdiepingshoogtes, de indeling van de gevelvlakken, het vensterraster en de kolommen zijn geschat van foto's; het lamellenkader is als dichte rand gemodelleerd.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      frameNapM: FRAME,
      plantNapM: PLANT,
      wingNapM: WING,
      leanFromNapM: LEAN_FROM,
      floors: 21,
      storeyHeightM: +STOREY.toFixed(3),
      footprintM: [U1, V1],
      louvreOffsetM: LOUVRE,
      whiteOffsetM: WHITE,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0200100000700217 (bouwjaar 2002), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG (LoD2.2) pand NL.IMBAG.Pand.0200100000700217, puntenwolk AHN4 2022",
      "https://nl.wikipedia.org/wiki/Toren_Noord",
      "https://commons.wikimedia.org/wiki/Category:Toren_Noord",
      "NLGEO2018 (geoïde) voor groundHeight",
    ],
  },
});

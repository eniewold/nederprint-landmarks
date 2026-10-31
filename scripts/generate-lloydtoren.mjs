// Lloydtoren (Lloydpier, Rotterdam, 2010, De Zwarte Hond): woontoren van 23 lagen op de kop van de
// Lloydpier, met in hetzelfde BAG-pand de lagere woonblokken erachter langs de Kratonkade: een
// westvleugel en een sokkel van vijf lagen om de toren, twee oranje blokken van twaalf lagen, een
// sokkel van vijf lagen en twee blokken van acht lagen, waarvan het zuidelijke een poort van vier
// lagen naar de binnentuin heeft. De toren is donker metselwerk met horizontale vensterbanden, op
// het zuiden, oosten en noorden een stapel balkons, bovenin een terugliggende loggiaband en op de
// westkop een dakterras binnen een gemetselde kroon met een groot venster naar het westen.
// Contour en dakhoogtes uit de BAG en de 3D BAG (LoD2.2, AHN5), de balkonstapels en het dakterras uit
// het AHN-DSM, gevelindeling uit foto's.
import { CrossSection, Manifold, ccw, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "lloydtoren";
// Gebouwstelsel: u langs de zuidgevel aan de Kratonkade (-3,33° op RD-oost), v haaks daarop naar het
// noorden. Oorsprong in het hart van de toren.
const ORIGIN = [90829.0, 435177.0];
const ANGLE = -3.33;
const AXIS = [+Math.cos((ANGLE * Math.PI) / 180).toFixed(6), +Math.sin((ANGLE * Math.PI) / 180).toFixed(6)];
const GROUND = 3.6; // NAP, AHN-DTM langs de gevels (3,5–3,7; 3D BAG-maaiveld 3,56)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 en AHN-DSM ----------
const TOWER_ROOF = 77.0; // hoofddak toren (3D BAG 76,99–77,03; DSM 77)
const CROWN = 78.5; // gemetselde kroon langs zuid-, west- en noordrand (3D BAG 78,49–78,51)
const TERRACE_LOW = 70.7; // dakterras westkop (3D BAG 70,4–71,1; DSM 70–71)
const TERRACE_HIGH = 73.8; // verhoogd deel van het terras (3D BAG 73,75–73,89; DSM 74)
const PLANT = 78.5, PLANT_TOP = 79.9, PLANT_EAST = 77.85; // installaties op het hoofddak
const WEST_WING = 26.1; // westvleugel (3D BAG 26,03–26,12)
const PODIUM = 20.13; // sokkels (3D BAG 20,11–20,16)
const PODIUM_EDGE = 20.77; // dakrand langs de kade (3D BAG 20,77)
const BLOCK_A = 40.87, BLOCK_B = 40.81; // oranje blokken (3D BAG)
const LOGGIA_TOP = 37.6; // ingesneden hoekloggia's in de bovenste laag (3D BAG 37,5–38,2)
const LIFT_A = 42.7, LIFT_B = 42.65; // liftopbouwen
const NORTH_BLOCK = 28.95, NORTH_EDGE = 30.02, NORTH_PLANT = 30.86;
const SOUTH_BLOCK = 26.1, SOUTH_TOP = 29.0, SOUTH_PLANT = 30.83; // zuidoostblok: terugliggende bovenlaag
const PODIUM_BOX = 22.0; // opbouw op de oostelijke sokkel
const PORTAL_TOP = 13.7; // poort in het zuidoostblok (foto: vier van de acht lagen, ~10 m)

// ---------- Plattegronden (u, v), vereenvoudigd uit BAG en 3D BAG ----------
// Toren: zuidgevel v = -10, westgevel u = -16,6, noordgevel evenwijdig aan de BAG-noordrand (20,4°),
// oostgevel uit het DSM (dak 77 tot u 15,8 zuid / 13,0 noord).
const TS = -10.0, TW = -16.6;
const north = (u) => 2.2 + 0.3567 * (u - TW); // noordgevel toren
const TOWER = [[TW, TS], [15.8, TS], [13.0, north(13.0)], [TW, north(TW)]];
const TERRACE_E = -8.4; // oostrand van het dakterras (3D BAG)
const TERRACE_MID = -12.0; // trede tussen laag en hoog terrasdeel
const WEST_WING_POLY = [[-22.46, TS], [TW + 1.0, TS], [TW + 1.0, north(TW + 1.0)], [-24.22, -0.64]];
const PODIUM_W = [[14.0, -10.3], [41.68, -10.3], [37.0, 4.15], [31.3, 2.1], [26.0, 1.9], [20.48, 16.17], [12.6, 13.25]];
const BLOCK_A_POLY = [[20.48, 16.17], [26.0, 1.9], [31.3, 2.1], [37.0, 4.15], [48.47, 8.7], [43.11, 22.95]];
const BLOCK_B_POLY = [[50.37, 27.44], [56.18, 11.69], [66.37, 15.44], [72.12, 15.26], [76.2, 19.1], [81.24, 21.14], [85.83, 22.61], [79.81, 38.54]];
const PODIUM_E = [[56.18, 11.69], [64.49, -9.53], [97.15, -8.56], [96.91, 6.81], [93.4, 5.9], [75.5, 5.2], [73.5, 9.0], [72.12, 15.26], [66.37, 15.44]];
const NORTH_POLY = [[79.6, 38.0], [85.3, 23.0], [114.2, 33.92], [107.13, 47.95]];
const NORTH_EDGE_POLY = [[79.81, 38.54], [80.2, 37.5], [107.3, 47.5], [106.76, 48.68]]; // dakrand 0,9 m
const SOUTH_POLY = [[96.7, -8.56], [135.92, -7.41], [130.3, 2.8], [126.7, 10.3], [124.5, 7.8], [96.7, 6.8]];
const SOUTH_TOP_POLY = [[99.72, -6.13], [128.98, -5.57], [128.77, 1.53], [126.0, 6.9], [124.46, 7.78], [99.28, 6.86]];
const PORTAL = [97.6, 107.6]; // u-bereik van de poort, door de hele diepte van het blok
// Ingesneden hoekloggia's in de bovenste laag van de oranje blokken (3D BAG-dakvlakken op 37,5–38,2).
const LOGGIAS = [
  [[29.15, 19.44], [28.25, 17.68], [32.67, 17.79], [33.79, 19.24], [33.77, 21.18]],
  [[40.75, 20.61], [43.11, 22.95], [42.53, 24.49], [35.53, 21.51]],
  [[52.04, 24.79], [55.72, 26.56], [54.93, 29.16], [50.37, 27.44]],
  [[65.23, 31.6], [64.55, 32.79], [60.73, 31.35], [61.36, 29.09], [64.9, 29.35]],
  [[70.14, 34.9], [70.88, 32.97], [75.71, 34.83], [75.05, 36.75]],
  [[85.83, 22.61], [84.68, 25.64], [80.7, 22.56], [81.24, 21.14]],
];
const LIFT_A_POLY = [[31.85, 8.09], [33.04, 5.63], [36.18, 7.08], [35.21, 9.37]];
const LIFT_B_POLY = [[67, 18.98], [70.71, 19.12], [69.4, 22.32], [66.09, 20.83]];
const PODIUM_BOX_POLY = [[70.78, 2.63], [67.16, 1.45], [68.49, -1.34], [71.91, -0.61]];
const NORTH_PLANT_POLY = [[95.47, 29.66], [98.66, 30], [98.46, 32.66], [95.21, 32.83]];
const SOUTH_PLANT_POLY = [[112.63, 3.36], [116.03, 3.4], [116.27, 5.11], [113.03, 5.93]];

// ---------- Lagen ----------
// Begane grond 4,4 m (tot NAP +8,0), daarboven lagen van circa 3 m tot het dak van elk bouwdeel.
const floors = (topNap, n) => [[BASE, z(8.0) - BASE], ...Array.from({ length: n }, (_, k) => [z(8.0) + k * ((topNap - 8.0) / n), (topNap - 8.0) / n])];
const TOWER_FLOORS = floors(TOWER_ROOF, 23); // 23 woonlagen van 3,0 m
const towerFloor = (k) => z(8.0) + 3.0 * (k - 1); // vloer van laag k (k = 1 … 23)

// ---------- Balkonstapels (DSM-randen buiten de gevel, foto's) ----------
// Rand a→b tegen de klok in langs de torencontour, s0–s1 langs die rand, uitsteek, eerste en laatste
// laag met een balkon, en een kraag onder 45° waar de stapel niet op de sokkel staat.
const OUT_S = 2.0, OUT_E = 2.2, OUT_N = 1.6;
const STACKS = [
  { a: [TW, TS], b: [15.8, TS], s0: 19.6, s1: 30.6, out: OUT_S, first: 5, last: 17, collar: true }, // zuid, u 3–14
  { a: [15.8, TS], b: [13.0, north(13.0)], s0: 0.4, s1: 12.4, out: OUT_E, first: 5, last: 16, collar: false }, // oost, op de sokkel
  { a: [13.0, north(13.0)], b: [TW, north(TW)], s0: 0.6, s1: 12.6, out: OUT_N, first: 5, last: 14, collar: true }, // noord, u 1–12,5
];

const frame = (a, b) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]]; // n wijst naar buiten (ring tegen de klok in)
  return { L, P: (s, t, h) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t, h] };
};

function balconyStack({ a, b, s0, s1, out, first, last, collar }) {
  const { P } = frame(a, b);
  const zb = towerFloor(first), zt = towerFloor(last) + 1.1; // bovenste balkon met borstwering
  const lo = collar ? zb - out : zb;
  const solid = Manifold.hull([s0, s1].flatMap((s) => [[...P(s, -0.2, zt)], [...P(s, out, zt)], [...P(s, -0.2, lo)], [...P(s, out, zb)]]));
  // Per laag een open balkon: 1,1 m borstwering, plafond onder 45° naar de buitenrand.
  const cuts = [];
  for (let k = first; k <= last; k++) {
    const f = towerFloor(k), lo2 = f + 1.1, hi = f + 3.0 - 0.3 - 0.9;
    cuts.push(Manifold.hull([s0 + 0.9, s1 - 0.9].flatMap((s) => [[...P(s, out + 0.2, lo2)], [...P(s, out - 0.9, lo2)], [...P(s, out + 0.2, hi + 1.1)], [...P(s, out - 0.9, hi)]])));
  }
  return { solid, cuts };
}

// ---------- Massa's ----------
const towerPart = TOWER.map(([u, v]) => [u, v]);
const clipU = (poly, u0, u1) => {
  const cs = new CrossSection([ccw(poly)]).intersect(new CrossSection([ccw([[u0, -100], [u1, -100], [u1, 100], [u0, 100]])]));
  return cs;
};
const extrudeCs = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
const stacks = STACKS.map(balconyStack);

const towerMass = union([
  prism(towerPart, BASE, z(TERRACE_LOW)),
  extrudeCs(clipU(towerPart, TERRACE_MID, 50), z(TERRACE_LOW) - 0.1, z(TERRACE_HIGH)),
  extrudeCs(clipU(towerPart, TERRACE_E, 50), z(TERRACE_HIGH) - 0.1, z(TOWER_ROOF)),
  // Kroon: west-, zuid- en noordwand van 1,4 m tot +78,5 om het dakterras, de zuidwand loopt als
  // dakrand door tot u 11,3 (3D BAG-strook op 78,5).
  prism([[TW, TS], [TW + 1.4, TS], [TW + 1.4, north(TW + 1.4) - 0.5], [TW, north(TW)]], z(TERRACE_LOW) - 0.1, z(CROWN)),
  prism([[TW, TS], [11.3, TS], [11.3, TS + 1.4], [TW, TS + 1.4]], z(TERRACE_LOW) - 0.1, z(CROWN)),
  prism([[TW, north(TW) - 1.4], [TERRACE_E + 0.2, north(TERRACE_E + 0.2) - 1.4], [TERRACE_E + 0.2, north(TERRACE_E + 0.2)], [TW, north(TW)]], z(TERRACE_LOW) - 0.1, z(CROWN)),
  // Installaties op het hoofddak.
  prism([[3.7, -7.0], [9.3, -7.0], [9.3, 2.4], [3.7, 2.4]], z(TOWER_ROOF) - 0.1, z(PLANT)),
  prism([[6.5, -4.2], [9.3, -4.2], [9.3, -0.2], [6.5, -0.2]], z(PLANT) - 0.1, z(PLANT_TOP)),
  prism([[10.1, -1.9], [11.9, -1.9], [11.9, 2.2], [10.1, 2.2]], z(TOWER_ROOF) - 0.1, z(PLANT_EAST)),
  // Westvleugel en sokkel aan de oostkant.
  prism(WEST_WING_POLY, BASE, z(WEST_WING)),
  prism(PODIUM_W, BASE, z(PODIUM)),
  prism([[18.5, -10.3], [41.3, -10.3], [41.0, -9.3], [18.5, -9.3]], z(PODIUM) - 0.1, z(PODIUM_EDGE)),
  ...stacks.map((s) => s.solid),
]);
const blockA = union([
  prism(BLOCK_A_POLY, BASE, z(BLOCK_A)),
  prism(LIFT_A_POLY, z(BLOCK_A) - 0.1, z(LIFT_A)),
]);
const blockB = union([
  prism(BLOCK_B_POLY, BASE, z(BLOCK_B)),
  prism(LIFT_B_POLY, z(BLOCK_B) - 0.1, z(LIFT_B)),
  prism(PODIUM_E, BASE, z(PODIUM)),
  prism(PODIUM_BOX_POLY, z(PODIUM) - 0.1, z(PODIUM_BOX)),
  prism(NORTH_POLY, BASE, z(NORTH_BLOCK)),
  prism(NORTH_EDGE_POLY, z(NORTH_BLOCK) - 0.1, z(NORTH_EDGE)),
  prism(NORTH_PLANT_POLY, z(NORTH_BLOCK) - 0.1, z(NORTH_PLANT)),
  prism(SOUTH_POLY, BASE, z(SOUTH_BLOCK)),
  prism(SOUTH_TOP_POLY, z(SOUTH_BLOCK) - 0.1, z(SOUTH_TOP)),
  prism(SOUTH_PLANT_POLY, z(SOUTH_TOP) - 0.1, z(SOUTH_PLANT)),
]);

// ---------- Grote insnijdingen ----------
// Kroon: venster in de westwand (posten 1,5 m, latei van 3,2 m) en een loggiaband onder de zuidelijke
// latei, van het terras tot u 9,6, 1,6 m diep; beide van +70,7 tot +75,3 (foto's van west en zuid).
const crownCuts = [
  prism([[TW - 1, TS + 1.5], [TW + 2.0, TS + 1.5], [TW + 2.0, north(TW) - 1.5], [TW - 1, north(TW) - 1.5]], z(TERRACE_LOW), z(75.3)),
  prism([[-11.0, TS - 1], [9.6, TS - 1], [9.6, TS + 1.6], [-11.0, TS + 1.6]], z(TERRACE_LOW), z(75.3)),
];
const loggiaCuts = LOGGIAS.map((p) => extrudeCs(new CrossSection([ccw(p)]).offset(0.6, "Miter"), z(LOGGIA_TOP), z(45)));
const portal = prism([[PORTAL[0], -12], [PORTAL[1], -12], [PORTAL[1], 12], [PORTAL[0], 12]], BASE - 1, z(PORTAL_TOP));

// Glazen loggia's in de bovenste lagen boven de oost- en noordstapel (foto's van zuidoost en
// noordwest): per laag 1,2 m diep, borstwering 1,0 m, van de zuidhoek van de oostgevel en de oosthoek
// van de noordgevel.
const LOGGIA_COLUMNS = [
  { a: [15.8, TS], b: [13.0, north(13.0)], s0: 0.6, s1: 12.0, first: 17, last: 22 },
  { a: [13.0, north(13.0)], b: [TW, north(TW)], s0: 0.6, s1: 12.6, first: 16, last: 22 },
];
const towerLoggias = LOGGIA_COLUMNS.flatMap(({ a, b, s0, s1, first, last }) => {
  const { P } = frame(a, b);
  return Array.from({ length: last - first + 1 }, (_, i) => {
    const f = towerFloor(first + i);
    return Manifold.hull([s0, s1].flatMap((s) => [P(s, 0.5, f + 1.0), P(s, -1.2, f + 1.0), P(s, 0.5, f + 2.7), P(s, -1.2, f + 2.7)]));
  });
});
let tower = towerMass.subtract(union([...crownCuts, ...towerLoggias, ...stacks.flatMap((s) => s.cuts)]));
let A = blockA.subtract(union(loggiaCuts));
let B = blockB.subtract(union([...loggiaCuts, portal]));

// ---------- Gevelreliëf: vensters als blinde nissen ----------
// Per laag vensters als nis van 0,35 m met een plafond onder 45°, alleen waar de gevel op die hoogte
// buitengevel is (straal van buitenaf raakt de gevel op 3 m). Toren: brede vensterbanden van 3,4 m op
// 4,8 m; woonblokken en sokkels: vensters van 1,8 m op 3,6 m.
const DEPTH = 0.35;
const all = union([tower, A, B]);
function windows(ring, floorList, pitch, width) {
  const cuts = [];
  const r = ccw(ring);
  r.forEach((a, i) => {
    const b = r[(i + 1) % r.length];
    const { L, P } = frame(a, b);
    if (L < 4) return;
    const bays = Math.floor((L - 0.9) / pitch), w = (L - bays * pitch) / 2;
    for (const [zf, fh] of floorList) {
      const lo = Math.max(zf, 0) + 0.9, hi = zf + fh - 0.35 - DEPTH;
      if (hi - lo < 0.9) continue;
      for (let k = 0; k < bays; k++) {
        const s0 = w + k * pitch + (pitch - width) / 2, s1 = s0 + width;
        const exposed = [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
          const from = P(s, 3, h), hit = all.rayCast(from, P(s, -1, h))[0];
          const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
          return at > 2.95 && at < 3.05;
        }));
        if (exposed) cuts.push(Manifold.hull([P(s0, 0.2, lo), P(s1, 0.2, lo), P(s0, -DEPTH, lo), P(s1, -DEPTH, lo), P(s0, 0.2, hi + DEPTH + 0.2), P(s1, 0.2, hi + DEPTH + 0.2), P(s0, -DEPTH, hi), P(s1, -DEPTH, hi)]));
      }
    }
  });
  return cuts;
}
const towerCuts = [
  ...windows(TOWER, TOWER_FLOORS, 4.8, 3.4),
  ...windows(WEST_WING_POLY, floors(WEST_WING, 6), 3.6, 1.8),
  ...windows(PODIUM_W, floors(PODIUM, 4), 3.6, 1.8),
];
const aCuts = windows(BLOCK_A_POLY, floors(BLOCK_A, 11), 3.6, 1.8);
const bCuts = [
  ...windows(BLOCK_B_POLY, floors(BLOCK_B, 11), 3.6, 1.8),
  ...windows(PODIUM_E, floors(PODIUM, 4), 3.6, 1.8),
  ...windows(NORTH_POLY, floors(NORTH_BLOCK, 7), 3.6, 1.8),
  ...windows(SOUTH_POLY, floors(SOUTH_BLOCK, 6), 3.6, 1.8),
];
tower = tower.subtract(union(towerCuts));
A = A.subtract(union(aCuts));
B = B.subtract(union(bCuts));

const nodes = [["toren", tower], ["blok-a", A], ["blok-b", B]].map(([name, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "volume", m.volume().toFixed(0));
  return [`building:lloydtoren-${name}`, m];
});

const P = (u, v) => [+u.toFixed(1), +v.toFixed(1)];
await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Lloydtoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 47.1, // NAP 3,6 + 43,52 (geoïde 43,62 m, ijking Koninginnetoren/Hoofdpoort Rotterdam)
    groundOffsetMetres: -0.15,
    // Op de straat en de stoep rond het complex, niet op de kade of in het water.
    groundSamplePoints: [P(-21, -12.5), P(0, -12.5), P(30, -12.5), P(60, -12.0), P(90, -11.0), P(120, -10.0), P(-22, 2.5), P(0, 11.2), P(30, 22.0), P(65, 36.5), P(95, 46.5)],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000754407"],
    description:
      "Lloydtoren op de kop van de Lloydpier met de woonblokken langs de Kratonkade die in hetzelfde BAG-pand liggen: toren op een vereenvoudigde DSM/BAG-contour tot NAP +77,0 m met installaties tot +79,9 m, op de westkop een dakterras (+70,7/+73,8) binnen een gemetselde kroon tot +78,5 met een groot venster naar het westen en een loggiaband onder de zuidelijke latei, vensterbanden per laag van 3,0 m en balkonstapels op het zuiden, oosten en noorden; westvleugel tot +26,1, sokkels tot +20,1, oranje blokken tot +40,8/+40,9 met hoekloggia's en liftopbouwen, en de blokken van acht lagen tot +28,95 en +26,1/+29,0 met een poort van circa 10 bij 10 m naar de binnentuin. Dakhoogtes uit de 3D BAG (LoD2.2), balkons en terras uit het AHN-DSM, gevelindeling uit foto's. Oorsprong in het hart van de toren, X-as langs de zuidgevel (-3,33° op RD-oost). Vensterraster, verdiepingshoogtes, de hoogte van de balkonstapels en de maten van de poort zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      towerRoofNapM: TOWER_ROOF,
      crownNapM: CROWN,
      roofPlantTopNapM: PLANT_TOP,
      terraceNapM: [TERRACE_LOW, TERRACE_HIGH],
      westWingNapM: WEST_WING,
      podiumNapM: PODIUM,
      orangeBlocksNapM: [BLOCK_A, BLOCK_B],
      northBlockNapM: NORTH_BLOCK,
      southBlockNapM: [SOUTH_BLOCK, SOUTH_TOP],
      portalTopNapM: PORTAL_TOP,
      towerFloors: 23,
      storeyHeightM: 3.0,
      architect: "De Zwarte Hond",
      completed: 2010,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000754407 (bouwjaar 2010), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG NL.IMBAG.Pand.0599100000754407 (LoD2.2, puntenwolk AHN5 2022)",
      "https://nl.wikipedia.org/wiki/Lloydtoren",
      "https://commons.wikimedia.org/wiki/File:Lloydtoren_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Lloydkwartier_Rotterdam_2018_3.jpg",
      "https://commons.wikimedia.org/wiki/File:Schiehaven,_Rotterdam-8156.jpg",
    ],
  },
});

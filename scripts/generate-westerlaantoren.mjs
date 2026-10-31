// Westerlaantoren (Westerlaan 10-80, Scheepvaartkwartier, Rotterdam): het voormalige hoofdkantoor van
// Phs. van Ommeren (Verhave-Luyt-De Iongh-Slikker, 1958-1962) met de laagbouw uit 1965, in 2000-2012 door
// Ector Hoogstad tot het betonskelet gestript, met drie lagen opgehoogd en van een nieuwe gevel voorzien.
// De toren staat op een vierkant van 32,9 m. Elke gevel heeft aan één eind een donker betegeld deel van
// 8,8 m en daarnaast een witte gevel: kantoorlagen met raamstroken en daarboven woonlagen met een wit
// balkonraster dat 1,8 m buiten de gevel staat; de donkere delen draaien als een molen rond de toren.
// Op het dak een ondiepe koperen koepel met een verdiept midden (het vroegere helikopterplatform).
// Tegen de zuidgevel staat de laagbouw: een witte onderbouw met raamstroken en een glazen, deels
// terugliggende begane grond, met daarop een donker betegelde kantoordoos van drie lagen die aan de
// zuidkant uitkraagt; op het dak een glazen dakpaviljoen, tegen de oostgevel een gele trappenhuistoren.
// Het BAG-pand omvat ook de parkeergarage onder het plantsoen aan de westkant; daarvan staan alleen de
// drie schuine glazen nooduitgangen boven het maaiveld.
// Contouren uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG (LoD2.2), gevelindeling uit foto's.
import { Manifold, CrossSection, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "westerlaantoren";
// Gebouwstelsel: u langs de zuidgevel van de toren naar het oostnoordoosten (20,4° op RD-oost; BAG-randen
// van toren en laagbouw evenwijdig binnen 0,4°), v langs de laagbouw naar het noordnoordwesten.
// Oorsprong in het hart van de toren.
const ORIGIN = [92180.98, 435660.76];
const ANGLE = 20.4;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = 3.15; // NAP, Westerlaan en stoepen rondom (AHN-DTM 3,13–3,36; 3D BAG-maaiveld 3,13)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 en AHN-DSM ----------
const TOWER_ROOF = 74.43; // torendak (3D BAG-dakvlak 74,42–74,43, DSM 74–75)
const DOME_RIM = 75.4; // voet van de koepel (DSM 75,0–75,9 op 12–13 m van het hart)
const DOME_TOP = 78.4; // rand rond het verdiepte midden (DSM 78,2–78,4 op 4 m, 3D BAG tot 78,9)
const DOME_WELL = 76.9; // verdiept midden (3D BAG-dakvlak 76,86–76,93)
const DOME_HATCH = 78.2; // opbouw in het midden (DSM 78,2)
const SLAB_ROOF = 24.3; // laagbouw (3D BAG 24,29–24,36)
const LINK_ROOF = 14.35; // lage strook tussen toren en laagbouw (DSM 14–15)
const PAVILION = 28.2; // dakpaviljoen (3D BAG 28,08–28,19; DSM 27,8–28,6)
const PAVILION_NORTH = 27.5; // noordelijk deel van het paviljoen (DSM 25,9–28,0)
const YELLOW = 25.5; // gele trappenhuistoren (3D BAG 25,34–25,60)
const TERRACE = 4.25; // verhoogd terras voor de zuidgevel (DSM 4,2–4,3)
const CANOPY = 7.0; // bovenkant entreeluifel (DSM 6,5–7,0 buiten de westgevel)

// ---------- Plattegronden in (u, v) ----------
// Toren: BAG-contour (u -16,51…16,22/16,47, v -16,67…16,31) als rechthoek.
const TU0 = -16.51, TU1 = 16.35, TV0 = -16.64, TV1 = 16.2;
const TOWER = [[TU0, TV0], [TU1, TV0], [TU1, TV1], [TU0, TV1]]; // linksom
const DOME_C = [0.3, -0.3]; // hart van de koepel (3D BAG-dakvlak 163, DSM-profiel)
// Laagbouw: BAG-contour u -18,59/-18,23…4,47; de kantoordoos reikt tot v -95,5 (DSM), de onderbouw tot
// v -91,5 (geschat uit foto's van de uitkraging); het terras tot de BAG-rand op v -99,25.
const SU0 = -18.45, SU1 = 4.47, SV_LINK = -19.8, SV_BOX = -95.5, SV_LOW = -91.5;
const TERRACE_POLY = rect(SU0, -99.25, -1.9, SV_LOW + 0.5);
const YELLOW_POLY = rect(SU1 - 0.1, -91.78, 8.09, -84.49); // BAG-uitstulping aan de oostkant
const PAVILION_POLY = rect(-11.2, -89.0, -1.3, -69.0);
const PAVILION_NORTH_POLY = rect(-7.8, -69.05, -3.3, -63.0);
// Nooduitgangen van de parkeergarage: schuine glazen kappen van 5,2 × 2,2 m (DSM: 5 m lang, hoog eind
// 7,8 NAP aan de kant van de laagbouw, laag eind op het plantsoen).
const EXITS = [-13.7, -59.9, -96.1];

// ---------- Lagen (lokale z, m boven maaiveld) ----------
const GF = 5.0; // begane grond toren
const PLINTH = [[GF, 3.5], [GF + 3.5, 3.5]];
const OFFICE_FROM = z(TOWER_ROOF) - 33.7 - 25.6; // 12,0: zeven kantoorlagen tot 37,6
const OFFICE = Array.from({ length: 7 }, (_, k) => [OFFICE_FROM + (25.6 / 7) * k, 25.6 / 7]);
const RES_FROM = OFFICE_FROM + 25.6; // 37,6
const RES_TO = 67.0; // bovenkant balkonraster (DSM-randen 64–70)
const RES = Array.from({ length: 9 }, (_, k) => [RES_FROM + ((RES_TO - RES_FROM) / 9) * k, (RES_TO - RES_FROM) / 9]);
const DARK = 8.8; // donker deel aan het begin van elke gevel (DSM: geen balkonraster over 8,7–9,6 m)
const EDGE = 2.0; // smalle donkere rand aan het andere eind
const FRAME_OUT = 1.8; // balkonraster buiten de gevel (DSM 1,5–2 m)
const DEPTH = 0.35;

// Laagbouw: begane grond 4,5 m, twee witte lagen van 3,0 m, kantoordoos van drie lagen tot het dak.
const SLAB_GF = 4.5;
const SLAB_WHITE = [[SLAB_GF, 3.0], [SLAB_GF + 3.0, 3.0]];
const BOX_FROM = SLAB_GF + 6.0;
const BOX = Array.from({ length: 3 }, (_, k) => [BOX_FROM + ((z(SLAB_ROOF) - BOX_FROM) / 3) * k, (z(SLAB_ROOF) - BOX_FROM) / 3]);

// ---------- Massa's ----------
const towerBody = prism(TOWER, BASE, z(TOWER_ROOF));
// Balkonraster per gevel: blok van FRAME_OUT buiten de gevel over het witte deel, met een kraag onder 45°.
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
function frame(a, b) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, out, h) => [a[0] + d[0] * s + n[0] * out, a[1] + d[1] * s + n[1] * out, h];
  return Manifold.hull([DARK, L - EDGE].flatMap((s) => [P(s, -0.2, RES_FROM - FRAME_OUT - 0.2), P(s, FRAME_OUT, RES_FROM), P(s, -0.2, RES_TO), P(s, FRAME_OUT, RES_TO)]));
}
const frames = edges(TOWER).map(([a, b]) => frame(a, b));
// Koepel: ondiepe kegel met een opstaande rand en een verdiept midden.
const dome = Manifold.revolve(
  [[[0, z(TOWER_ROOF) - 0.1], [13.0, z(TOWER_ROOF) - 0.1], [13.0, z(DOME_RIM)], [4.0, z(DOME_TOP)], [3.4, z(DOME_TOP)], [3.4, z(DOME_WELL)], [0, z(DOME_WELL)]]],
  48,
).translate([DOME_C[0], DOME_C[1], 0]);
const hatch = prism(rect(DOME_C[0] - 1.0, DOME_C[1] - 1.0, DOME_C[0] + 1.0, DOME_C[1] + 1.0), z(DOME_WELL) - 0.1, z(DOME_HATCH));
const tower = union([towerBody, ...frames, dome, hatch]);

const slabBody = union([
  prism(rect(SU0, SV_LOW, SU1, SV_LINK), BASE, z(SLAB_ROOF)),
  prism(rect(SU0, SV_LINK - 0.05, SU1, TV0 + 0.6), BASE, z(LINK_ROOF)),
  prism(rect(SU0, SV_BOX, SU1, SV_LOW + 0.05), BOX_FROM, z(SLAB_ROOF)),
  // Kraag onder 45° onder de uitkraging aan de zuidkant.
  Manifold.hull([SU0, SU1].flatMap((u) => [[u, SV_LOW + 0.05, BOX_FROM - (SV_LOW - SV_BOX) - 0.05], [u, SV_LOW + 0.05, BOX_FROM + 0.05], [u, SV_BOX, BOX_FROM + 0.05], [u, SV_BOX, BOX_FROM]])),
  prism(TERRACE_POLY, BASE, z(TERRACE)),
  prism(PAVILION_POLY, z(SLAB_ROOF) - 0.1, z(PAVILION)),
  prism(PAVILION_NORTH_POLY, z(SLAB_ROOF) - 0.1, z(PAVILION_NORTH)),
]);
const yellowBody = prism(YELLOW_POLY, BASE, z(YELLOW));
const everything = union([tower, slabBody, yellowBody]);

// ---------- Gevelreliëf ----------
// Blinde nissen langs de rand a→b (buitennormaal rechts van de looprichting), `front` m buiten de rand,
// met een plafond onder 45°; alleen waar de gevel op die hoogte buitengevel is.
function niches(a, b, floors, { s0 = 0, s1, pitch, width, sill = 0.9, header = 0.35, depth = DEPTH, front = 0, stagger = 0 }) {
  const out = [];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, dp, h) => [a[0] + d[0] * s + n[0] * (front - dp), a[1] + d[1] * s + n[1] * (front - dp), h];
  const end = s1 ?? L;
  floors.forEach(([zf, fh], k) => {
    const lo = zf + sill, hi = zf + fh - header - depth;
    if (hi - lo < 0.9) return;
    const span = end - s0;
    const p = pitch ?? span;
    const bays = Math.max(1, Math.floor((span + 1e-6) / p));
    const w = width ?? p - 0.9;
    const shift = stagger && k % 2 ? p * stagger : 0;
    for (let j = 0; j < bays; j++) {
      const c = s0 + (span - bays * p) / 2 + p * (j + 0.5) + shift;
      const sa = c - w / 2, sb = c + w / 2;
      if (sa < s0 + 0.45 - 1e-6 || sb > end - 0.45 + 1e-6) continue;
      const exposed = [sa + 0.1, c, sb - 0.1].every((s) => [lo + 0.05, hi + depth - 0.05].every((h) => {
        const from = P(s, -3, h), hit = everything.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) out.push(Manifold.hull([P(sa, -0.2, lo), P(sb, -0.2, lo), P(sa, depth, lo), P(sb, depth, lo), P(sa, -0.2, hi + depth + 0.2), P(sb, -0.2, hi + depth + 0.2), P(sa, depth, hi), P(sb, depth, hi)]));
    }
  });
  return out;
}

const towerCuts = [];
for (const [a, b] of edges(TOWER)) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const white = { s0: DARK, s1: L - EDGE };
  // Woonlagen: per laag vier balkons in het witte raster, 1,1 m diep, vloerranden en stijlen van 0,9 m.
  towerCuts.push(...niches(a, b, RES, { ...white, pitch: (L - EDGE - DARK) / 4, sill: 0.9, header: 0.05, depth: 1.1, front: FRAME_OUT }));
  // Kantoor- en plintlagen: een raamstrook per laag over het witte deel.
  towerCuts.push(...niches(a, b, [...PLINTH, ...OFFICE], { ...white, sill: 1.0 }));
  // Bovenste laag boven het raster: raamstrook, met een dakrand van 1,2 m.
  towerCuts.push(...niches(a, b, [[RES_TO, z(TOWER_ROOF) - RES_TO]], { ...white, sill: 0.9, header: 1.2 }));
  // Glazen begane grond, 0,4 m terug.
  towerCuts.push(...niches(a, b, [[0, GF]], { ...white, sill: 0.25, header: 0.5, depth: 0.4 }));
}

const slabCuts = [];
const W0 = [SU0, TV0], W1 = [SU0, SV_BOX]; // westgevel aan de Westerlaan, van noord naar zuid
const E0 = [SU1, SV_BOX], E1 = [SU1, TV0]; // oostgevel, van zuid naar noord
const S0 = [SU0, SV_BOX], S1 = [SU1, SV_BOX]; // zuidgevel van de kantoordoos
const SL0 = [SU0, SV_LOW], SL1 = [SU1, SV_LOW]; // zuidgevel van de onderbouw
for (const [a, b] of [[W0, W1], [E0, E1], [S0, S1]]) {
  // Kantoordoos: verspreide vensters van 2,4 m, per laag een halve travee verspringend.
  slabCuts.push(...niches(a, b, BOX, { pitch: 4.8, width: 2.4, sill: 1.0, header: 0.6, stagger: 0.5 }));
}
for (const [a, b] of [[W0, W1], [E0, E1], [SL0, SL1]]) {
  // Witte onderbouw: een raamstrook per laag, per travee van 7,2 m onderbroken door een stijl van 0,9 m.
  slabCuts.push(...niches(a, b, SLAB_WHITE, { pitch: 7.2, sill: 0.9 }));
}
// Begane grond aan de Westerlaan: glazen pui 1,2 m achter een rij kolommen van 0,9 m (travee 7,2 m).
slabCuts.push(...niches(W0, W1, [[0, SLAB_GF]], { pitch: 7.2, sill: 0.2, header: 0.4, depth: 1.2 }));
slabCuts.push(...niches(E0, E1, [[0, SLAB_GF]], { pitch: 7.2, sill: 0.25, header: 0.5, depth: 0.4 }));

// ---------- Entreeluifel aan de westgevel van de toren ----------
// 1,5 m dik, 3,5 m diep, om de noordwesthoek heen; op kolommen van 0,9 m aan de buitenrand.
const CU = -20.0, CZ1 = z(CANOPY), CZ0 = CZ1 - 1.5;
const canopy = union([
  prism(rect(CU, -14.5, TU0 + 0.6, TV1 + 3.3), CZ0, CZ1),
  prism(rect(CU, TV1 - 0.6, -14.5, TV1 + 3.3), CZ0, CZ1),
  ...[-14.5, -5.5, 3.5, 12.0, TV1 + 2.4].map((v) => prism(rect(CU, v, CU + 0.9, v + 0.9), BASE, CZ0 + 0.05)),
  prism(rect(-15.4, TV1 + 2.4, -14.5, TV1 + 3.3), BASE, CZ0 + 0.05),
  // Entreeportaal onder de luifel (BAG-uitstulping u -18,3, v -2,9…6,7).
  prism(rect(-18.3, -2.94, TU0 + 0.6, 6.66), BASE, CZ0 + 0.05),
]);

const towerSolid = union([tower.subtract(union(towerCuts)), canopy]);
const slabSolid = slabBody.subtract(union(slabCuts));
const yellowSolid = yellowBody;
const exitSolids = EXITS.map((c) => Manifold.hull([-1.1, 1.1].flatMap((dv) => [[-38.6, c + dv, BASE], [-33.4, c + dv, BASE], [-38.6, c + dv, 1.2], [-33.4, c + dv, z(7.8)]])));

const nodes = [
  ["building:westerlaantoren-toren", towerSolid],
  ["building:westerlaantoren-laagbouw", slabSolid],
  ["building:westerlaantoren-gele-trappenhuistoren", yellowSolid],
  ...exitSolids.map((m, i) => [`building:westerlaantoren-nooduitgang-${i + 1}`, m]),
];
for (const [name, m] of nodes) {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
}
console.log("nissen toren", towerCuts.length, "laagbouw", slabCuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Westerlaantoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 46.65, // NAP +3,15 + 43,51 (NLGEO2018 43,61 ter plekke, geijkt op Lloydtoren en De Hoge Maas)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-22, -40], [-22, 0], [-10, -102], [8, -60], [10, 21]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000701967"],
    description:
      "Westerlaantoren aan de Westerlaan (Scheepvaartkwartier): het voormalige Van Ommeren-hoofdkantoor uit 1962, in 2012 door Ector Hoogstad opgehoogd en nieuw bekleed. Toren van 32,9 × 32,8 m tot NAP +74,43 m met een ondiepe koepel tot +78,4 m en een verdiept midden; elke gevel heeft aan één eind een donker deel van 8,8 m en daarnaast raamstroken (plint en zeven kantoorlagen) en negen woonlagen met een balkonraster dat 1,8 m buiten de gevel staat op een kraag van 45°; entreeluifel op kolommen aan de westgevel. Laagbouw uit 1965 tegen de zuidgevel tot +24,3 m met een witte onderbouw, een donkere kantoordoos die aan de zuidkant 4 m uitkraagt, een dakpaviljoen tot +28,2 m, een lage strook tot +14,35 m tegen de toren, een terras en een gele trappenhuistoren tot +25,5 m; de drie glazen nooduitgangen van de parkeergarage onder het plantsoen (ook BAG-pand) staan erbij. Contouren uit de BAG, hoogtes uit de 3D BAG en het AHN-DSM. Oorsprong in het hart van de toren, X-as langs de zuidgevel van de toren (20,4° op RD-oost). Verdiepingshoogtes, gevelindeling, de uitkraging van de laagbouw en de vorm van de nooduitgangen zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      towerRoofNapM: TOWER_ROOF,
      domeNapM: { rim: DOME_RIM, top: DOME_TOP, well: DOME_WELL },
      towerPlanM: [+(TU1 - TU0).toFixed(2), +(TV1 - TV0).toFixed(2)],
      lowRiseRoofNapM: SLAB_ROOF,
      linkRoofNapM: LINK_ROOF,
      pavilionNapM: [PAVILION_NORTH, PAVILION],
      yellowStairNapM: YELLOW,
      floors: { tower: 19, lowRise: 6 },
      balconyFrameOutM: FRAME_OUT,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000701967 (bouwjaar 1956 volgens de BAG), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG LoD2.2 (AHN5, 2022)",
      "https://nl.wikipedia.org/wiki/Westerlaantoren",
      "https://commons.wikimedia.org/wiki/File:Euromast_-_Scheepvaartkwartier_-_Rotterdam_-_View_of_Westerlaantoren.jpg",
      "https://commons.wikimedia.org/wiki/File:Westerlaantoren.jpg",
      "https://commons.wikimedia.org/wiki/File:1604_Westerlaantoren,_Rotterdam_159.jpg",
      "https://commons.wikimedia.org/wiki/File:1604_Westerlaantoren,_Rotterdam_164.jpg",
      "https://commons.wikimedia.org/wiki/File:1604_Westerlaantoren,_Rotterdam_157.jpg",
    ],
  },
});

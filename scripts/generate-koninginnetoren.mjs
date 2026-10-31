// Koninginnetoren (Boezemsingel, Kralingen-Crooswijk, Rotterdam, 2001, Jorissen Simonetti architecten):
// woontoren van 26 lagen op de plek van de in 1972 gesloopte Koninginnekerk. Een bakstenen schacht op
// een rechthoek met afgeschuinde hoeken, met in elke gevel teruggelegen stroken glazen serres (twee in
// de noord- en zuidgevel, één in de oost- en westgevel) en een kopergroene kroon van vier lagen: de
// gevelvelden tussen de stroken lopen als groene kaders door tot boven het dak, de stroken eindigen
// lager zodat de kroon gekarteld is; de middenkaders van de noord- en zuidgevel hebben een holle
// bovenrand. Op het dak een opbouw; tegen de noordoosthoek staat het kantoor van 1974 (BAG-pand
// 0599100000611372) tot NAP +40,4 m, waartegen de toren tot die hoogte de BAG-hoek volgt.
// Contour uit de BAG, hoogtes uit de 3D BAG (AHN5, 2023) en het AHN-DSM, gevelindeling uit foto's.
import { Manifold, CrossSection, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "koninginnetoren";
// Gebouwstelsel: u langs de zuidgevel naar het oosten (-6,95° op RD-oost, BAG-randen evenwijdig binnen
// 0,1°), v haaks erop naar het noorden. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [93792.49, 438233.65];
const ANGLE = -6.95;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = -0.2; // NAP, maaiveld rondom (AHN-DTM p50 -0,24; 3D BAG maaiveld -0,17)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 74.3; // dak binnen de kroon (3D BAG 74,27–74,31; AHN-DSM p90 74,57)
const FRAME = 74.8; // groene kaders van de kroon (AHN-DSM langs de gevels 74,6–75,2)
const FRAME_CENTRE = 75.1; // uiteinden van de holle middenkaders noord en zuid (AHN-DSM 74,8–75,2)
const FRAME_SAG = 74.5; // midden van de holle bovenrand (AHN-DSM 74,2–74,3; foto's)
const STRIP_TOP = 71.5; // bovenkant van de serrestroken in de kroon (3D BAG 71,44–71,54)
const TOP = 78.0; // dakopbouw (3D BAG 77,97–78,02; AHN-DSM p99 78,3)
const NEIGHBOUR = 40.4; // dak van het aangebouwde kantoor in de noordoosthoek (3D BAG 40,34–40,44)

// ---------- Plattegrond in (u, v), BAG-contour met afgeschuinde hoeken van 1,95 m ----------
// Vereenvoudigd: sprongetjes van 0,2–0,3 m in de west- en noordgevel weggelaten. De oostgevel knikt bij
// v = 1,79 een halve meter naar binnen (BAG).
const SW = [-9.21, -9.83], SE = [9.21, -9.83];
const TOWER = [SW, SE, [11.16, -7.88], [11.16, 1.79], [10.78, 7.9], [8.85, 9.84], [-9.21, 9.84], [-11.16, 7.89], [-11.16, -7.88]];
// Onder NAP +40,4 vult de toren de noordoosthoek tot de BAG-hoek, tegen het kantoor van 1974.
const NE_CORNER = [[2.2, 1.79], [11.16, 1.79], [10.65, 10.17], [2.2, 9.84]];
const TOP_BOX = rect(-4.5, -4.3, 4.3, 5.4); // dakopbouw (3D BAG, ortho)

// ---------- Lagen ----------
// Plint van 5,5 m (twee lagen met hoge ramen tussen bakstenen penanten), daarboven 24 woonlagen van
// 2,8 m tot +72,5; de kroon (bovenste vier lagen) en de borstwering tot het dak.
const PLINTH = 5.5;
const STOREY = 2.8;
const FLOORS = Array.from({ length: 24 }, (_, k) => [PLINTH + STOREY * k, STOREY]);
const DEPTH = 0.35;

// Serrestroken (u- of v-bereik) per gevel: noord en zuid twee stroken van 2,6 m, oost en west één
// van 2,0 m in het midden. Diepte 1,2 m; boven de strook (vanaf +71,5) 1,5 m tot boven de kroon.
const NS_STRIPS = [[-5.8, -3.2], [3.2, 5.8]];
const EW_STRIP = [-1.0, 1.0];
const STRIP_DEPTH = 1.2, NOTCH_DEPTH = 1.5;
const V_S = -9.83, V_N = 9.84, U_W = -11.16, U_E = 11.16;

const ring = new CrossSection([TOWER]);
// Kroonring van 1,0 m breed; in het midden van de noord- en zuidgevel nemen de holle middenkaders het over.
const crownRing = ring.subtract(ring.offset(-1.0, "Miter")).subtract(new CrossSection([rect(-3.2, -20, 3.2, 20)]));
// Holle middenkaders: blok van 6,4 m breed, bovenkant een cirkelboog van +75,1 aan de uiteinden naar
// +74,5 in het midden.
const R = (3.2 ** 2 + (FRAME_CENTRE - FRAME_SAG) ** 2) / (2 * (FRAME_CENTRE - FRAME_SAG));
const sagCut = Manifold.cylinder(40, R, R, 192, true).rotate([90, 0, 0]).translate([0, 0, z(FRAME_SAG) + R]);
const centreFrames = [[V_S, V_S + 1.0], [V_N - 1.0, V_N]].map(([v0, v1]) =>
  prism(rect(-3.2, v0, 3.2, v1), z(ROOF) - 0.1, z(FRAME_CENTRE) + 0.01).subtract(sagCut));

const body = union([
  prism(TOWER, BASE, z(ROOF)),
  prism(NE_CORNER, BASE, z(NEIGHBOUR)),
  Manifold.extrude(crownRing, z(FRAME) - z(ROOF) + 0.1).translate([0, 0, z(ROOF) - 0.1]),
  ...centreFrames,
  prism(TOP_BOX, z(ROOF) - 0.1, z(TOP)),
]);

// ---------- Serrestroken als sleuven ----------
const HIGH = z(TOP) + 2;
const cuts = [];
const glassBands = [];
for (const [u0, u1] of NS_STRIPS) {
  // Zuidgevel
  cuts.push(prism(rect(u0, V_S - 1, u1, V_S + STRIP_DEPTH), PLINTH, HIGH));
  cuts.push(prism(rect(u0, V_S - 1, u1, V_S + NOTCH_DEPTH), z(STRIP_TOP), HIGH));
  // Noordgevel; de oostelijke strook begint pas boven het aangebouwde kantoor.
  const from = u0 > 0 ? z(NEIGHBOUR) : PLINTH;
  cuts.push(prism(rect(u0, V_N - STRIP_DEPTH, u1, V_N + 1), from, HIGH));
  cuts.push(prism(rect(u0, V_N - NOTCH_DEPTH, u1, V_N + 1), z(STRIP_TOP), HIGH));
}
for (const [u, sgn] of [[U_W, 1], [U_E, -1]]) {
  const a = u - sgn, b = u + sgn * STRIP_DEPTH, c = u + sgn * NOTCH_DEPTH;
  cuts.push(prism(rect(Math.min(a, b), EW_STRIP[0], Math.max(a, b), EW_STRIP[1]), PLINTH, HIGH));
  cuts.push(prism(rect(Math.min(a, c), EW_STRIP[0], Math.max(a, c), EW_STRIP[1]), z(STRIP_TOP), HIGH));
}

const SLOT_CUTS = cuts.length;

// ---------- Gevelreliëf ----------
// Rand a→b van de contour (linksom, buitenkant rechts). Nis van `width` m rond elk middelpunt s op de
// rand, per laag van lo tot hi met een plafond onder 45°; alleen waar de gevel buitengevel is.
function niches(a, b, centres, width, rows, { depth = DEPTH, against = body } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  for (const [lo, hi] of rows) {
    if (hi - lo < 0.9) continue;
    for (const c of centres) {
      const s0 = c - width / 2, s1 = c + width / 2;
      if (s0 < 0.3 || s1 > L - 0.3) continue;
      const exposed = [s0 + 0.1, c, s1 - 0.1].every((s) => [lo + 0.05, hi + depth - 0.05].every((h) => {
        const from = P(s, -3, h), hit = against.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + depth + 0.2), P(s1, -0.2, hi + depth + 0.2), P(s0, depth, hi), P(s1, depth, hi)]));
    }
  }
}
const windowRows = (fromNap = -10) => FLOORS.filter(([zf]) => zf >= z(fromNap) - 0.01).map(([zf, fh]) => [zf + 0.9, zf + fh - 0.35 - DEPTH]);
const plinthRow = [[0.3, PLINTH - 0.5 - 0.4]];
// Middelpunten langs een rand uit wereldcoördinaten (u of v) door projectie.
const along = (a, b, pts, axis) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return pts.map((p) => ((p - a[axis]) / (b[axis] - a[axis])) * L);
};
const edges = TOWER.map((p, i) => [p, TOWER[(i + 1) % TOWER.length]]);
const [south, seCh, eastLow, eastHigh, neCh, north, nwCh, west, swCh] = edges;
const chamfers = [seCh, neCh, nwCh, swCh];

// Bakstenen velden: zuid en noord één raamkolom in elk buitenveld, twee in het middenveld; oost en
// west twee kolommen aan weerszijden van de strook; één kolom per afgeschuinde hoek. Ramen 1,3 m.
const NS_WINDOWS = [-7.5, -1.5, 1.5, 7.5];
const EW_WINDOWS = [-5.9, -2.9, 2.9, 5.9];
niches(...south, along(...south, NS_WINDOWS, 0), 1.3, windowRows());
niches(...north, along(...north, NS_WINDOWS.filter((u) => u < 2.2), 0), 1.3, windowRows());
niches(...north, along(...north, NS_WINDOWS.filter((u) => u > 2.2), 0), 1.3, windowRows(NEIGHBOUR + 0.5));
niches(...west, along(...west, EW_WINDOWS, 1), 1.3, windowRows());
niches(...eastLow, along(...eastLow, EW_WINDOWS.filter((v) => v < 1.79), 1), 1.3, windowRows());
niches(...eastHigh, along(...eastHigh, EW_WINDOWS.filter((v) => v > 1.79), 1), 1.3, windowRows(NEIGHBOUR + 0.5));
for (const [a, b] of chamfers) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  niches(a, b, [L / 2], 1.3, a === neCh[0] ? windowRows(NEIGHBOUR + 0.5) : windowRows());
}
// Plint: hoge ramen tussen penanten van ≥ 0,9 m, 0,4 m diep.
niches(...south, along(...south, [-7.5, 7.5], 0), 2.2, plinthRow, { depth: 0.4 });
niches(...south, along(...south, [-4.5, 4.5], 0), 2.0, plinthRow, { depth: 0.4 });
niches(...south, along(...south, [0], 0), 5.2, plinthRow, { depth: 0.4 });
niches(...north, along(...north, [-7.5], 0), 2.2, plinthRow, { depth: 0.4 });
niches(...north, along(...north, [-4.5], 0), 2.0, plinthRow, { depth: 0.4 });
niches(...north, along(...north, [0], 0), 4.0, plinthRow, { depth: 0.4 });
niches(...west, along(...west, [-5.2, -2.0, 2.0, 5.2], 1), 2.2, plinthRow, { depth: 0.4 });
niches(...eastLow, along(...eastLow, [-5.2, -2.0], 1), 2.2, plinthRow, { depth: 0.4 });
for (const [a, b] of [seCh, swCh, nwCh]) niches(a, b, [Math.hypot(b[0] - a[0], b[1] - a[1]) / 2], 1.2, plinthRow, { depth: 0.4 });

// Glasbanden in de achterwand van elke sleuf: per laag 0,35 m diep over de hele sleufbreedte.
const slotBody = body.subtract(union(cuts.slice(0, SLOT_CUTS)));
const bandRows = windowRows();
for (const [u0, u1] of NS_STRIPS) {
  const w = u1 - u0, c = (u0 + u1) / 2;
  const sBack = [[-20, V_S + STRIP_DEPTH], [20, V_S + STRIP_DEPTH]];
  const nBack = [[20, V_N - STRIP_DEPTH], [-20, V_N - STRIP_DEPTH]];
  bandsIn(sBack, c + 20, w, bandRows.filter(([, hi]) => hi < z(STRIP_TOP) - DEPTH));
  bandsIn(nBack, 20 - c, w, bandRows.filter(([lo, hi]) => hi < z(STRIP_TOP) - DEPTH && (c < 0 || lo > z(NEIGHBOUR) + 0.5)));
}
bandsIn([[U_W + STRIP_DEPTH, 20], [U_W + STRIP_DEPTH, -20]], 20, 2.0, bandRows.filter(([, hi]) => hi < z(STRIP_TOP) - DEPTH));
bandsIn([[U_E - STRIP_DEPTH, -20], [U_E - STRIP_DEPTH, 20]], 20, 2.0, bandRows.filter(([, hi]) => hi < z(STRIP_TOP) - DEPTH));
function bandsIn(line, centre, width, rows) {
  // Over de volle sleufbreedte (+0,2 m in de zijwanden, die daar 1,2 m dik zijn): geen losse stijlen.
  const [a, b] = line;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  const s0 = centre - width / 2 - 0.2, s1 = centre + width / 2 + 0.2;
  for (const [lo, hi] of rows) {
    const from = P(centre, -0.6, (lo + hi) / 2), hit = slotBody.rayCast(from, P(centre, 1, (lo + hi) / 2))[0];
    const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
    if (!(at > 0.55 && at < 0.65)) continue; // achterwand niet op deze hoogte (sleuf nog niet begonnen)
    cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
  }
}

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Koninginnetoren: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Koninginnetoren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "uitsparingen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:koninginnetoren", building]],
  catalog: {
    name: "Koninginnetoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.3, // NAP -0,2 + geoïde-offset 43,5 (Blaak 10 43,53, Hoofdpoort 43,54, Ien Dalesshof 43,45)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0599100000611391"],
    description:
      "Koninginnetoren aan de Boezemsingel (2001, Jorissen Simonetti): bakstenen woontoren van 22,3 × 19,7 m met afgeschuinde hoeken op de BAG-contour tot een dak op NAP +74,3 m, met een plint van 5,5 m met hoge ramen, 24 woonlagen met een vensterraster als blinde nissen, teruggelegen serrestroken (twee in de noord- en zuidgevel, één in de oost- en westgevel, 1,2 m diep, met een glasband per laag) die op +71,5 eindigen zodat de kroon gekarteld is, groene kroonkaders tot +74,8 m (de middenkaders noord en zuid met een holle bovenrand van +75,1 naar +74,5) en een dakopbouw tot +78,0 m. Tot +40,4 m volgt de noordoosthoek de BAG tegen het kantoor van 1974. Hoogtes uit de 3D BAG (AHN5) en het AHN-DSM, gevelindeling uit foto's. Oorsprong in het hart van de BAG-contour, X-as langs de zuidgevel (-6,95° op RD-oost). Verdiepingshoogte, vensterraster, de diepte van de stroken en de strook in de oost- en westgevel (alleen uit de luchtfoto) zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      crownFrameNapM: FRAME,
      crownCentreFrameNapM: [FRAME_SAG, FRAME_CENTRE],
      stripTopNapM: STRIP_TOP,
      topBoxNapM: TOP,
      neighbourRoofNapM: NEIGHBOUR,
      planM: [22.32, 19.67],
      chamferM: 1.95,
      floors: 26,
      plinthM: PLINTH,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000611391 (bouwjaar 2001) en 0599100000611372 (1974), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG NL.IMBAG.Pand.0599100000611391 (LoD2.2, puntwolk AHN5 2023)",
      "https://nl.wikipedia.org/wiki/Koninginnetoren",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_toren_koninginnetoren.jpg",
      "https://commons.wikimedia.org/wiki/File:Vredenoordbrug_-_Crooswijk_-_Rotterdam_-_View_from_the_bridge_towards_the_Koninginnetoren_in_the_north.jpg",
    ],
  },
});

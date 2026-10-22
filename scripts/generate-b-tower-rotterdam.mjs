// B'Tower (Lijnbaan / Hennekijnstraat, Rotterdam, 2012, Wiel Arets): woontoren van 15 lagen op een
// sokkel van vier lagen met een winkel en een parkeergarage, naast De Bijenkorf. De toren heeft een
// gevel van horizontale witte vloerranden met glas ertussen; aan de noordkant steekt een kern uit.
// De sokkel is aan de voorkant (bij de toren) lager dan aan de achterkant.
// Contour uit de BAG, hoogtes uit het AHN-DSM, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "b-tower-rotterdam";
// Gebouwstelsel: u langs de korte zuidgevel naar het oostnoordoosten (17,4° op RD-oost, BAG-randen
// evenwijdig binnen 0,1°), v langs de lange gevels naar het noordnoordwesten. Oorsprong in het hart
// van de BAG-contour.
const ORIGIN = [92450.09, 437250.8];
const ANGLE = 17.4;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = -0.8; // NAP, AHN-DTM rondom (-1,1…-0,4; PDOK-voet 42,51 ellipsoïdisch)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM ----------
const TOWER = 68.5; // torendak (68–69; PDOK 112,8 ellipsoïdisch)
const CORE = 54.0; // uitstekende kern aan de noordkant (50–54)
const PODIUM_FRONT = 22.0; // sokkel bij de toren en langs de oostrand (22)
const PODIUM_REAR = 25.0; // achterste deel van de sokkel (25)

// ---------- Plattegrond in (u, v), BAG-contour vereenvoudigd tot 8 cm ----------
const FOOTPRINT = [[-11.36, 28.6], [-11.32, 0.15], [-12.21, 0.15], [-12.09, -29.26], [4.22, -29.25], [5.27, -29.25], [5.26, -25.25], [12.11, -25.29], [12.1, 28.34], [11.17, 28.38], [11.16, 28.73]];
const TOWER_POLY = rect(-12.15, -29.26, 6.6, 1.5); // toren op de westelijke 18,7 m van de sokkel (DSM)
const REAR = rect(-11.4, 17.5, 7.0, 28.7); // hogere achterkant van de sokkel (DSM)
const CORE_POLY = rect(0.5, 1.4, 5.5, 3.6);

const body = union([
  prism(FOOTPRINT, BASE, z(PODIUM_FRONT)),
  prism(REAR, z(PODIUM_FRONT) - 0.1, z(PODIUM_REAR)),
  prism(TOWER_POLY, BASE, z(TOWER)),
  prism(CORE_POLY, BASE, z(CORE)),
]);

// ---------- Gevelreliëf ----------
// Sokkel: begane grond en eerste verdieping winkel (5,0 en 4,6 m), twee parkeerlagen tot +22,0 m;
// toren: 15 woonlagen van 3,1 m. Per laag een glasband achter een doorlopende witte vloerrand van
// 0,9 m, 0,4 m diep met een plafond onder 45°.
const PODIUM_FLOORS = [[0, 5.0], [5.0, 4.6], [9.6, 6.6], [16.2, 6.6]];
const TOWER_FLOORS = Array.from({ length: 15 }, (_, k) => [z(PODIUM_FRONT) + 3.1 * k, 3.1]);
const DEPTH = 0.4;
const cuts = [];
function bands(a, b, floors, slab = 0.9) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  for (const [zf, fh] of floors) {
    const lo = zf + slab, hi = zf + fh - DEPTH;
    if (hi - lo < 0.9) continue;
    // Delen van de rand die op deze hoogte buitengevel zijn, per halve meter getest.
    let start = null;
    const flush = (s1) => {
      if (start !== null && s1 - start >= 0.9) cuts.push(Manifold.hull([P(start, -0.2, lo), P(s1, -0.2, lo), P(start, DEPTH, lo), P(s1, DEPTH, lo), P(start, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(start, DEPTH, hi), P(s1, DEPTH, hi)]));
      start = null;
    };
    for (let s = 0.95; s <= L - 0.95 + 1e-6; s += 0.5) {
      const ok = [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      });
      if (ok && start === null) start = s;
      if (!ok) flush(s - 0.5);
    }
    flush(L - 0.95);
  }
}
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
for (const [a, b] of edges(TOWER_POLY)) bands(a, b, TOWER_FLOORS);
for (const [a, b] of edges(CORE_POLY)) bands(a, b, TOWER_FLOORS.filter(([zf, fh]) => zf + fh <= z(CORE)));
for (const [a, b] of edges(FOOTPRINT)) if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 3) bands(a, b, PODIUM_FLOORS, 1.2);

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`B'Tower: ${parts.length} losse delen`);
console.log("B'Tower", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "banden", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:b-tower-rotterdam", building]],
  catalog: {
    name: "B'Tower",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.5, // PDOK-terrein rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0599100000766719"],
    description:
      "B'Tower aan de Hennekijnstraat achter de Lijnbaan: sokkel over de BAG-contour tot NAP +22,0 m (achterkant +25,0 m), daarop een toren van 18,7 × 30,8 m tot +68,5 m met een kern aan de noordkant tot +54,0 m; per laag een glasband achter een doorlopende witte vloerrand (15 woonlagen, vier sokkellagen). Hoogtes uit het AHN-DSM. Oorsprong in het hart van de BAG-contour, X-as langs de korte zuidgevel (17,4° op RD-oost). Verdiepingshoogtes, banddiepte en de kern zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      towerNapM: TOWER,
      coreNapM: CORE,
      podiumNapM: [PODIUM_FRONT, PODIUM_REAR],
      floors: { podium: 4, tower: 15 },
      facadeAngleDegrees: ANGLE,
      estimatedFloorBands: true,
    },
    sources: [
      "PDOK BAG pand 0599100000766719 (bouwjaar 2012), actuele orthoHR, AHN-DSM en -DTM 0,5 m, PDOK 3D-gebouwtegel (LoD2.2)",
      "https://nl.wikipedia.org/wiki/B%27Tower",
      "https://commons.wikimedia.org/wiki/File:B%E2%80%99Tower_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:2024_Aert_van_Nesstraat,_Rotterdam_met_zondagmiddag_drukte.jpg",
    ],
  },
});

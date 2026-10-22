// Kantoor Anna van Buerenplein (Den Haag Centraal, 2013): kantoorgebouw aan het Anna van Buerenplein,
// naast de Koninklijke Bibliotheek en onder de aanlanding van de RandstadRail. Een toren van 19 lagen
// aan de oostzijde, daarnaast een middenblok van 13 lagen met een glazen atriumkap, aan de zuidzijde
// een lager blok van vier lagen met een smalle strook naast de toren, en onder het viaduct een
// begane-grondvolume over de rest van de kavel. Glasbanden per laag.
// Contour uit de BAG, hoogtes uit het AHN-DSM en de PDOK-reconstructie, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "anna-van-buerenplein-706";
// Gebouwstelsel: u langs de zuidgevel naar het noordoosten (37,4° op RD-oost, BAG-randen evenwijdig
// binnen 0,1°), v haaks erop naar het noordwesten. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [82256.63, 455350.73];
const ANGLE = 37.4;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.8; // NAP, AHN-DTM rondom (0,7–0,9; PDOK-terrein 44,2 ellipsoïdisch)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM en PDOK ----------
const TOWER = 72.0; // toren (DSM 71–73, PDOK 71,6)
const TOWER_PLANT = 74.0; // installatieopbouw (73–74)
const MID = 50.8; // middenblok (DSM 50–52, PDOK 50,6)
const ATRIUM_EAVES = 50.8, ATRIUM_RIDGE = 53.3; // glazen atriumkap (DSM 40–55 door het glas, PDOK 52,8–53,8)
const LOW = 17.0; // laag blok aan de zuidzijde (17)
const STRIP = 13.0; // strook naast de toren (13)
const HALL = 4.0; // begane-grondvolume onder het RandstadRail-viaduct (PDOK 4,0–4,3; het AHN ziet het viaduct op 7–8)

// ---------- Plattegrond in (u, v), BAG-contour ----------
const U0 = -27.32, U1 = 27.31, V0 = -21.32, V1 = 21.31;
const TOWER_U = 8.7; // westgevel van de toren (DSM)
const MID_POLY = rect(-12.0, 3.0, TOWER_U + 0.05, V1);
const ATRIUM = rect(-12.0, 13.0, TOWER_U, V1);
const LOW_POLY = rect(-6.0, V0, 6.05, 3.05);
const STRIP_POLY = rect(6.0, V0, TOWER_U + 0.05, 3.05);
const PLANT_POLY = rect(12.0, 4.0, 18.0, 9.0);

// Glazen kap: zaagtanden langs u over de diepte van het atrium.
function sawtooth([u0, u1], v0, v1, eaves, ridge, n) {
  const w = (v1 - v0) / n, parts = [];
  for (let k = 0; k < n; k++) {
    const a = v0 + k * w, b = a + w, m = (a + b) / 2;
    parts.push(Manifold.hull([[u0, a, z(eaves) - 0.1], [u1, a, z(eaves) - 0.1], [u0, b, z(eaves) - 0.1], [u1, b, z(eaves) - 0.1], [u0, m, z(ridge)], [u1, m, z(ridge)]]));
  }
  return union(parts);
}

const body = union([
  prism(rect(U0, V0, U1, V1), BASE, z(HALL)),
  prism(rect(TOWER_U, V0, U1, V1), BASE, z(TOWER)),
  prism(PLANT_POLY, z(TOWER) - 0.1, z(TOWER_PLANT)),
  prism(MID_POLY, BASE, z(MID)),
  sawtooth([ATRIUM[0][0], ATRIUM[1][0]], ATRIUM[0][1], ATRIUM[2][1], ATRIUM_EAVES, ATRIUM_RIDGE, 3),
  prism(LOW_POLY, BASE, z(LOW)),
  prism(STRIP_POLY, BASE, z(STRIP)),
]);

// ---------- Gevelreliëf ----------
// Lagen: begane grond 4,6 m, daarboven 3,5 m (19 lagen tot het torendak).
const STOREY = 3.5;
const FLOORS = [[0, 4.6], ...Array.from({ length: 19 }, (_, k) => [4.6 + STOREY * k, STOREY])];
const DEPTH = 0.35;
const cuts = [];
// Eén doorlopende glasband per laag langs de rand a→b (buitennormaal rechts), tussen penanten van
// 0,9 m; blinde nis met een plafond onder 45°, alleen waar de gevel buitengevel is.
function face(a, b) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  for (const [zf, fh] of FLOORS) {
    const lo = zf + 0.9, hi = zf + fh - 0.35 - DEPTH;
    // Per stuk van 1 m testen welke delen buitengevel zijn, en die delen als één band uitsnijden.
    let start = null;
    const flush = (s1) => {
      if (start !== null && s1 - start >= 0.9) cuts.push(Manifold.hull([P(start, -0.2, lo), P(s1, -0.2, lo), P(start, DEPTH, lo), P(s1, DEPTH, lo), P(start, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(start, DEPTH, hi), P(s1, DEPTH, hi)]));
      start = null;
    };
    for (let s = 0.9; s <= L - 0.9 + 1e-6; s += 0.5) {
      const ok = [lo + 0.05, (lo + hi) / 2, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      });
      if (ok && start === null) start = s;
      if (!ok) flush(s - 0.5);
    }
    flush(L - 0.9);
  }
}
for (const poly of [rect(TOWER_U, V0, U1, V1), MID_POLY, LOW_POLY, STRIP_POLY]) {
  for (let i = 0; i < 4; i++) face(poly[i], poly[(i + 1) % 4]);
}

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Anna van Buerenplein: ${parts.length} losse delen`);
console.log("Anna van Buerenplein", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:anna-van-buerenplein-706", building]],
  catalog: {
    name: "Kantoor Anna van Buerenplein",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.2, // PDOK-terrein rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0518100001643163"],
    description:
      "Kantoorgebouw aan het Anna van Buerenplein bij Den Haag Centraal: toren van 18,6 × 42,6 m tot NAP +72,0 m met een installatieopbouw tot +74,0 m, middenblok tot +50,8 m met een glazen atriumkap van drie zaagtanden tot +53,3 m, laag blok tot +17,0 m, strook tot +13,0 m en onder het RandstadRail-viaduct een begane-grondvolume tot +4,0 m over de hele BAG-contour. Glasbanden per laag. Hoogtes uit het AHN-DSM en de PDOK-reconstructie. Oorsprong in het hart van de BAG-contour, X-as langs de zuidgevel (37,4° op RD-oost). Naam, verdiepingshoogte, atriumkap en banden zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      towerNapM: TOWER,
      towerPlantNapM: TOWER_PLANT,
      middleBlockNapM: MID,
      atriumRoofNapM: [ATRIUM_EAVES, ATRIUM_RIDGE],
      lowBlockNapM: LOW,
      stripNapM: STRIP,
      hallNapM: HALL,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0518100001643163 (bouwjaar 2013), actuele orthoHR, AHN-DSM en -DTM 0,5 m, PDOK 3D-gebouwtegel (LoD2.2)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_-_Universiteit_Leiden_(39835418041).jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag,_hoogbouw_vanaf_het_Anna_van_Buerenplein_IMG_5984_2024-11-03_15.41.jpg",
    ],
  },
});

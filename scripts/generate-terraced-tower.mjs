// Terraced Tower (Boompjes 40, Rotterdam, 2021): getrapte woontoren op een sokkel.
// Drie op elkaar staande schijven (sokkel, brede middentoren, smalle bovenste schijf)
// op de BAG-contour, hoogtes uit de 3D BAG (AHN5, 2023), plus dakinstallatie,
// terrasopbouwen en per verdieping een blinde glasband onder de doorlopende vloerrand.
// Het AHN in de PDOK-WCS (2020) toont de toren nog in aanbouw en is daarom niet gebruikt.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "terraced-tower";
// Gebouwstelsel: u langs de lange gevel (47° linksom op RD-oost, richting noordoost), v naar het noordwesten.
const ORIGIN = [93213.95, 436782.39];
const ANGLE = 47.0;
const AXIS = [Math.cos((ANGLE * Math.PI) / 180), Math.sin((ANGLE * Math.PI) / 180)];
const GROUND = 2.5; // NAP, maaiveld langs de Boompjes (3D BAG 2,53)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Hoogtes (NAP) uit de 3D BAG LoD2.2 van pand 0599100100016464.
const PODIUM_ROOF = 34.15;
const MID_ROOF = 76.05;
const TOP_ROOF = 106.05;
const PLANT_ROOF = 109.25;

// Plattegronden in (u, v), uit de BAG-contour; uitkragende balkons volgens de 3D BAG-daken.
const PODIUM_WEST = rect(-41.39, -8.4, -27.39, 8.6);
const PODIUM_EAST = rect(22.62, -8.34, 40.84, 8.68);
const MID = rect(-27.39, -12.59, 22.62, 12.83);
const MID_BALCONY_WEST = rect(-28.6, -8.4, -27.39, 8.6); // terrasrand boven de sokkel
const MID_BALCONY_EAST = rect(22.62, -8.34, 24.2, 8.68);
const TOP_CORE = rect(-18.39, -14.06, 13.61, 14.3);
const TOP_WINGS = rect(-19.9, -12.59, 14.4, 12.83);
const PLANT = rect(-12.0, -2.7, 7.1, 9.4);

const body = union([
  prism(PODIUM_WEST, BASE, z(PODIUM_ROOF)),
  prism(PODIUM_EAST, BASE, z(PODIUM_ROOF)),
  prism(MID, BASE, z(MID_ROOF)),
  prism(MID_BALCONY_WEST, z(PODIUM_ROOF) - 0.1, z(MID_ROOF)),
  prism(MID_BALCONY_EAST, z(PODIUM_ROOF) - 0.1, z(MID_ROOF)),
  prism(TOP_CORE, BASE, z(TOP_ROOF)),
  prism(TOP_WINGS, BASE, z(TOP_ROOF)),
  prism(PLANT, z(TOP_ROOF) - 0.1, z(PLANT_ROOF)),
  // Terrasopbouwen (pergola's, plantenbakken) op de trappen, uit de 3D BAG.
  prism(rect(-36.8, -2.8, -29.9, 2.9), z(PODIUM_ROOF) - 0.1, z(35.25)),
  prism(rect(23.9, -1.5, 37.3, 2.2), z(PODIUM_ROOF) - 0.1, z(35.27)),
  prism(rect(14.4, 0.8, 21.9, 4.3), z(MID_ROOF) - 0.1, z(77.2)),
  prism(rect(-26.7, 0.2, -20.9, 4.6), z(MID_ROOF) - 0.1, z(77.2)),
  prism(rect(-26.2, 6.7, -20.8, 12.8), z(MID_ROOF) - 0.1, z(76.52)),
  prism(rect(17.0, 5.4, 22.6, 12.8), z(MID_ROOF) - 0.1, z(76.52)),
  prism(rect(-26.5, -11.2, -20.8, -2.1), z(MID_ROOF) - 0.1, z(76.52)),
]);

// Verdiepingen: elk trapdeel in gelijke lagen (sokkel 10, middentoren 13, bovenste schijf 9).
const floors = [];
const addFloors = (from, to, n) => { for (let k = 0; k < n; k++) floors.push([z(from) + ((z(to) - z(from)) * k) / n, (z(to) - z(from)) / n]); };
floors.push([0, z(PODIUM_ROOF) / 10]);
addFloors(GROUND + z(PODIUM_ROOF) / 10, PODIUM_ROOF, 9);
addFloors(PODIUM_ROOF, MID_ROOF, 13);
addFloors(MID_ROOF, TOP_ROOF, 9);

// Glasband per verdieping: blinde nis van 0,4 m tussen de vloerranden (0,9 m), met een
// plafond onder 45° zodat hij zonder steun print; alleen waar de gevel werkelijk buitengevel is.
const SLAB = 0.9, DEPTH = 0.4, PIER = 0.95;
const cuts = [];
const faces = [PODIUM_WEST, PODIUM_EAST, MID, MID_BALCONY_WEST, MID_BALCONY_EAST, TOP_CORE, TOP_WINGS];
for (const poly of faces) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 2 * PIER + 0.9) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
    const n = [d[1], -d[0]]; // naar buiten (rect is linksom)
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    for (const [zf, fh] of floors) {
      const lo = zf + SLAB, hi = zf + fh - DEPTH;
      if (hi - lo < 0.9) continue;
      // Delen van de gevel die buitengevel zijn: per 1 m langs de rand met een straal getest.
      let start = null;
      const flush = (s1) => {
        if (start === null) return;
        if (s1 - start >= 0.9) cuts.push(Manifold.hull([P(start, -0.2, lo), P(s1, -0.2, lo), P(start, DEPTH, lo), P(s1, DEPTH, lo), P(start, -0.2, hi + DEPTH), P(s1, -0.2, hi + DEPTH), P(start, DEPTH, hi), P(s1, DEPTH, hi)]));
        start = null;
      };
      const step = (L - 2 * PIER) / Math.ceil((L - 2 * PIER) / 1.0);
      for (let s = PIER; s <= L - PIER + 1e-6; s += step) {
        const ok = [lo + 0.05, (lo + hi) / 2, hi - 0.05].every((h) => {
          const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
          return hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]) > 2.9 && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]) < 3.05;
        });
        if (ok && start === null) start = s;
        if (!ok) flush(s - step);
      }
      flush(L - PIER);
    }
  }
}
const tower = body.subtract(union(cuts));
const pieces = tower.decompose();
if (pieces.length !== 1) throw new Error(`Terraced Tower: ${pieces.length} delen`);
console.log("Terraced Tower", tower.status(), "genus", tower.genus(), "driehoeken", tower.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:terraced-tower", tower]],
  catalog: {
    name: "Terraced Tower",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    // Maaiveld aan de lage achterstraat (Scheepmakershaven); de Boompjes ligt circa 3 m hoger op de dijk.
    groundHeight: 45.677,
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-30, 14.5], [0, 17], [20, 16]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100100016464"],
    description:
      "Terraced Tower aan de Boompjes: sokkel tot NAP +34,15 m, brede middentoren tot +76,05 m en smalle bovenste schijf tot +106,05 m met dakinstallatie tot +109,25 m, op de BAG-contour met hoogtes uit de 3D BAG (AHN5 2023); per verdieping een blinde glasband onder de doorlopende vloerrand en terrasopbouwen op de trappen. Oorsprong in het hart van de toren, X-as langs de lange gevel (47° op RD-oost). Verdiepingsritme en banddiepte zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      podiumRoofNapM: PODIUM_ROOF,
      midTowerRoofNapM: MID_ROOF,
      topRoofNapM: TOP_ROOF,
      plantRoofNapM: PLANT_ROOF,
      floors: { podium: 10, midTower: 13, topTower: 9 },
      facadeAngleDegrees: ANGLE,
      estimatedFloorBands: true,
    },
    sources: [
      "PDOK BAG pand 0599100100016464 (bouwjaar 2021), actuele orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100016464",
      "https://nl.wikipedia.org/wiki/Terraced_Tower",
      "https://commons.wikimedia.org/wiki/File:Terraced_Tower_Rotterdam_2026.jpg",
      "https://commons.wikimedia.org/wiki/File:Terraced_Tower.jpg",
      "https://commons.wikimedia.org/wiki/File:Terraced_Tower_Zij-aanzicht.jpg",
      "https://commons.wikimedia.org/wiki/File:2025_Scheepmakershaven,_Rotterdam_gezien_vanaf_de_Punt_met_achterzijden_van_hoogbouw_aan_De_Boompjes.jpg",
    ],
  },
});

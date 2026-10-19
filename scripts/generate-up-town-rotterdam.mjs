// Up:Town (Wijnhaveneiland, Rotterdam, 2019): woontoren van 34 verdiepingen op een plint van vijf
// lagen. Volumes op de BAG-contouren, hoogtes uit de 3D BAG (AHN5, 2023); per verdieping een
// doorlopende balkonband rond de toren en traveeën met glaspuien in de plint, als blinde nissen.
import { Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "up-town-rotterdam";
// Gebouwstelsel: u langs de Wijnhaven (18,1° linksom op RD-oost), v naar het noordnoordwesten.
const ORIGIN = [93035.85, 436814.01];
const ANGLE = 18.1;
const AXIS = [Math.cos((ANGLE * Math.PI) / 180), Math.sin((ANGLE * Math.PI) / 180)];
const GROUND = 2.6; // NAP (3D BAG 2,62–2,67)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Dakhoogtes (NAP), 3D BAG LoD2.2 van de panden 0599100100015923 (toren) en 0599100100015922 (plint).
const PLINTH_ROOF = 17.8;
const TERRACE = 14.63; // verdiept daktuin in de plint
const WEST_WING_ROOF = 13.9;
const PLINTH_PLANT = 19.05;
const TOWER_ROOF = 106.27;
const BALCONY_TOP = 102.7;
const LIFT_ROOF = 108.5;

const TOWER = rect(-15.68, 15.62, 10.15, 36.62);
const SOUTH_BALCONIES = rect(-12.9, 13.8, 9.5, 15.7); // balkonzone boven de plint
const PLINTH = rect(-12.9, -43.81, 10.12, 15.63);
const WEST_WING = rect(-14.9, -32.73, -12.85, -23.53);
const TERRACE_PIT = rect(-4.9, -33.7, 2.4, 14.5);
const PLINTH_PLANT_BOX = rect(0.2, -41.7, 4.1, -38.7);
const LIFT = rect(-4.6, 27.5, -0.8, 32.7);

const body = union([
  prism(PLINTH, BASE, z(PLINTH_ROOF)).subtract(prism(TERRACE_PIT, z(TERRACE), z(PLINTH_ROOF) + 1)),
  prism(WEST_WING, BASE, z(WEST_WING_ROOF)),
  prism(PLINTH_PLANT_BOX, z(PLINTH_ROOF) - 0.1, z(PLINTH_PLANT)),
  prism(TOWER, BASE, z(TOWER_ROOF)),
  prism(SOUTH_BALCONIES, z(PLINTH_ROOF) - 0.1, z(BALCONY_TOP)),
  prism(LIFT, z(TOWER_ROOF) - 0.1, z(LIFT_ROOF)),
]);

// 34 verdiepingen van circa 3,05 m: vijf in de plint, 29 in de toren erboven.
const layers = (from, to, n) => Array.from({ length: n }, (_, k) => [from + ((to - from) * k) / n, (to - from) / n]);
const FLOORS = [...layers(0, z(PLINTH_ROOF), 5), ...layers(z(PLINTH_ROOF), z(TOWER_ROOF), 29)];

// Blinde nis per verdieping: balkonband (toren, één travee tussen hoekpenanten van 0,95 m) of
// glaspui per travee van circa 4,2 m (plint). Plafond onder 45°, alleen op echte buitengevel.
const DEPTH = 0.4, SLAB = 0.9;
const cuts = [];
function facade(poly, floors, bay, pier) {
  const p = ccw(poly);
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 4) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    const bays = Math.max(1, Math.round((L - pier) / bay)), w = (L - pier) / bays;
    for (const [zf, fh] of floors) {
      const lo = zf + SLAB, hi = zf + fh - DEPTH;
      if (zf < 0.5 || hi - lo < 0.9) continue;
      for (let k = 0; k < bays; k++) {
        const s0 = pier + k * w, s1 = s0 + w - pier;
        const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
          const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
          const dist = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
          return dist > 2.95 && dist < 3.05;
        }));
        if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH), P(s1, -0.2, hi + DEPTH), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
      }
    }
  }
}
facade(TOWER, FLOORS, 1000, 0.95);
facade(SOUTH_BALCONIES, FLOORS, 1000, 0.95);
facade(PLINTH, FLOORS, 4.2, 1.0);

const building = body.subtract(union(cuts));
if (building.decompose().length !== 1) throw new Error("Up:Town: losse delen");
console.log("Up:Town", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:up-town-toren-en-plint", building]],
  catalog: {
    name: "Up:Town",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 46.105, // laagste PDOK-terrein op de straten rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-20, 25], [15, 25], [0, 40], [-18, -10], [14, -10], [0, -48]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100100015923", "NL.IMBAG.Pand.0599100100015922"],
    description:
      "Up:Town op het Wijnhaveneiland: toren van 34 verdiepingen tot NAP +106,27 m met liftopbouw tot +108,5 m en balkonzone aan de zuidkant, op een plint van vijf lagen tot +17,8 m met verdiepte daktuin; BAG-contouren en 3D BAG-hoogtes (AHN5 2023). Oorsprong in het hart van de twee BAG-panden, X-as langs de Wijnhaven (18,1° op RD-oost). Balkonbanden, travees en nisdiepte zijn uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND,
      plinthRoofNapM: PLINTH_ROOF,
      roofTerraceNapM: TERRACE,
      towerRoofNapM: TOWER_ROOF,
      liftRoofNapM: LIFT_ROOF,
      storeys: 34,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0599100100015923 en 0599100100015922 (bouwjaar 2019), actuele orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100015923",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100015922",
      "https://nl.wikipedia.org/wiki/Up:Town",
      "https://commons.wikimedia.org/wiki/File:Up;Town_in_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_UpTown.jpg",
    ],
  },
});

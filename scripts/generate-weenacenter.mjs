// Weenacenter (Weena, Rotterdam, 1990; Ector Hoogstad): woontoren van 34 verdiepingen met een
// halfronde kop aan de Weenakant, twee hogere flanken en een middenkern die het hoogst reikt,
// en een lagere vleugel aan de noordkant. Volumes op de BAG-contour, hoogtes uit de 3D BAG;
// vensters per verdieping als blinde nissen (ook per facet van de ronde gevel).
import { Manifold, ccw, circle, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "weenacenter";
// Gebouwstelsel: u langs het Weena (16,9° linksom op RD-oost), v naar het noordnoordwesten;
// de ronde kop wijst naar −v (het Weena).
const ORIGIN = [92225.43, 437715.71];
const ANGLE = 16.9;
const AXIS = [Math.cos((ANGLE * Math.PI) / 180), Math.sin((ANGLE * Math.PI) / 180)];
const GROUND = -0.5; // NAP (3D BAG -0,50)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Hoogtes (NAP) uit de 3D BAG LoD2.2 van pand 0599100000689019.
const ROUND_ROOF = 97.2;
const FLANK_ROOF = 101.8;
const SPINE_ROOF = 105.4;
const WING_ROOF = 41.45;
const WING_CORE = 46.65;
const WING_CORE_TOP = 50.8;
const WING_PLANT = 43.15;

const CENTRE = [20.65, -24.4], RADIUS = 15.05; // halfronde kop, gefit op de BAG-contour
const HALF_DISC = circle(CENTRE, RADIUS, 32).filter(([, v]) => v <= CENTRE[1] + 1e-6);
const TOWER = [[CENTRE[0] + RADIUS, CENTRE[1]], [35.7, -12.0], [5.6, -12.0], [CENTRE[0] - RADIUS, CENTRE[1]], ...HALF_DISC.sort((a, b) => Math.atan2(a[1] - CENTRE[1], a[0] - CENTRE[0]) - Math.atan2(b[1] - CENTRE[1], b[0] - CENTRE[0]))];
const FLANKS = rect(5.6, -19.3, 35.7, -12.0);
const SPINE = rect(15.1, -28.8, 26.1, -13.4);
const WING = [[5.5, -12.2], [35.6, -12.2], [35.5, -0.27], [5.5, -0.56]];
const WING_CORE_BOX = rect(12.7, -12.9, 28.2, -7.7);
const WING_CORE_TOP_BOX = rect(16.9, -13.5, 24.0, -9.1);
const WING_PLANT_BOX = rect(28.7, -8.1, 32.7, -2.7);

// Verdiepte sleuf in de noordgevel tussen de flanken, boven de vleugel (geen dakvlak in de 3D BAG).
const NORTH_SLOT = rect(17.0, -13.4, 24.5, -11.0);
const body = union([
  prism(TOWER, BASE, z(ROUND_ROOF)).subtract(prism(NORTH_SLOT, z(WING_ROOF), z(SPINE_ROOF) + 1)),
  prism(FLANKS, BASE, z(FLANK_ROOF)).subtract(prism(NORTH_SLOT, z(WING_ROOF), z(SPINE_ROOF) + 1)),
  prism(SPINE, z(ROUND_ROOF) - 0.1, z(SPINE_ROOF)),
  prism(WING, BASE, z(WING_ROOF)),
  prism(WING_CORE_BOX, z(WING_ROOF) - 0.1, z(WING_CORE)),
  prism(WING_CORE_TOP_BOX, z(WING_CORE) - 0.1, z(WING_CORE_TOP)),
  prism(WING_PLANT_BOX, z(WING_ROOF) - 0.1, z(WING_PLANT)),
]);

// 34 verdiepingen van circa 2,9 m tot de ronde kop; de lagere vleugel in dezelfde lagen.
const layers = (from, to, n) => Array.from({ length: n }, (_, k) => [from + ((to - from) * k) / n, (to - from) / n]);
const FLOORS = [...layers(0, z(ROUND_ROOF), 33), ...layers(z(ROUND_ROOF), z(FLANK_ROOF), 1)];

const DEPTH = 0.35, SILL = 0.8, HEADER = 0.3;
const cuts = [];
function facade(poly, floors, bay, pier, minLen = 3.5) {
  const p = ccw(poly);
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < minLen) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    const bays = Math.max(1, Math.round((L - pier) / bay)), w = (L - pier) / bays;
    for (const [zf, fh] of floors) {
      const lo = zf + SILL, hi = zf + fh - HEADER - DEPTH;
      if (zf < 0.5 || hi - lo < 0.9) continue;
      for (let k = 0; k < bays; k++) {
        const s0 = pier + k * w, s1 = s0 + w - pier;
        if (s1 - s0 < 0.9) continue;
        const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
          const from = P(s, -3, h), hits = body.rayCast(from, P(s, 3, h));
          const at = (j) => hits[j] && Math.hypot(hits[j].position[0] - from[0], hits[j].position[1] - from[1]);
          return at(0) > 2.95 && at(0) < 3.05 && !(at(1) < 3 + DEPTH + 1);
        }));
        if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH), P(s1, -0.2, hi + DEPTH), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
      }
    }
  }
}
facade(TOWER, FLOORS, 3.0, 0.95, 2.5);
facade(FLANKS, FLOORS, 3.0, 0.95);
facade(WING, FLOORS, 3.0, 0.95);

const building = body.subtract(union(cuts));
if (building.decompose().length !== 1) throw new Error("Weenacenter: losse delen");
console.log("Weenacenter", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:weenacenter-toren-ronde-kop-en-vleugel", building]],
  catalog: {
    name: "Weenacenter",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.18, // laagste PDOK-terrein op de stoep langs het Weena (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[20, -44], [0, -25], [40, -25], [20, 4], [2, -8]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000689019"],
    description:
      "Weenacenter aan het Weena: woontoren van 34 verdiepingen met een halfronde kop aan de Weenakant tot NAP +97,2 m, twee hogere flanken tot +101,8 m met een verdiepte sleuf ertussen aan de noordgevel en een middenkern tot +105,4 m, en een lagere vleugel aan de noordkant tot +41,45 m met trappenhuiskop; BAG-contour en 3D BAG-hoogtes, vensters per verdieping als blinde nissen. Oorsprong in het hart van de twee BAG-panden van het complex, X-as langs het Weena (16,9° op RD-oost). Vensterstramien en verdiepingshoogte zijn uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND,
      roundHeadRoofNapM: ROUND_ROOF,
      flankRoofNapM: FLANK_ROOF,
      spineRoofNapM: SPINE_ROOF,
      northWingRoofNapM: WING_ROOF,
      roundHeadRadiusM: RADIUS,
      storeys: 34,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000689019 (bouwjaar 1990), actuele orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000689019",
      "https://nl.wikipedia.org/wiki/Weenacenter",
      "https://commons.wikimedia.org/wiki/File:Weenacenter.jpg",
    ],
  },
});

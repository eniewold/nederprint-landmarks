// WTC Utrecht (Stadsplateau, Utrecht, 2018; MVSA): langgerekte kantoorschijf met afgeschuinde en
// afgeronde hoeken, horizontale glasbanden per verdieping, een verhoogd middendak en verspringende
// verticale vides in de westgevel. Contour uit de BAG, hoogtes uit de 3D BAG (AHN5, 2023).
import { Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "wtc-utrecht";
// Gebouwstelsel: v langs de lange as (noordnoordwest), u naar de oostgevel (30,5° op RD-oost).
const ORIGIN = [135803.59, 455733.43];
const ANGLE = 30.5;
const AXIS = [Math.cos((ANGLE * Math.PI) / 180), Math.sin((ANGLE * Math.PI) / 180)];
const GROUND = 2.4; // NAP (3D BAG 2,41)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Hoogtes (NAP) uit de 3D BAG LoD2.2 van pand 0344100000144323.
const ROOF = 73.82;
const CENTRE_ROOF = 77.7; // verhoogd middendak met installaties en zonnepanelen

// BAG-contour, afrondingen vereenvoudigd tot facetten.
const FOOT = [[13.04, -33.28], [14.76, -31.47], [15.58, 21.95], [15.06, 23.49], [7.65, 32.6], [5.82, 33.47], [-12.51, 33.78], [-14.94, 31.41], [-15.5, -4.56], [-13.98, -8.6], [-9.32, -16.95], [-5.68, -32.62], [-3.22, -34.43], [9.28, -34.3]];
const CENTRE = rect(-6.8, -17.9, 7.3, 25.7);

const body = union([prism(FOOT, BASE, z(ROOF)), prism(CENTRE, z(ROOF) - 0.1, z(CENTRE_ROOF))]);

// Hoge begane grond (5 m) en 19 kantoorlagen tot het dak.
const FLOORS = [[0, 5], ...Array.from({ length: 19 }, (_, k) => [5 + (k * (z(ROOF) - 5)) / 19, (z(ROOF) - 5) / 19])];

const cuts = [];
const edge = (a, b) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, P: (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h] };
};
// Blinde nis tussen s0 en s1 en hoogtes lo–hi, met een plafond onder 45°.
const recess = (P, s0, s1, lo, hi, depth) => Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + depth), P(s1, -0.2, hi + depth), P(s0, depth, hi), P(s1, depth, hi)]);

// Glasband per verdieping: 0,4 m diep achter een borstwering/vloerrand van 0,9 m, hoekpenanten 0,95 m.
const p = ccw(FOOT);
for (let i = 0; i < p.length; i++) {
  const { L, P } = edge(p[i], p[(i + 1) % p.length]);
  if (L < 3.5) continue;
  for (const [zf, fh] of FLOORS) if (zf > 0.5) cuts.push(recess(P, 0.95, L - 0.95, zf + 0.9, zf + fh - 0.4, 0.4));
}

// Verspringende vides in de westgevel (van noordnoordwest naar zuidzuidoost), 1,5 m diep,
// positie en hoogte uit foto's geschat.
const floorTop = (k) => FLOORS[k][0] + FLOORS[k][1];
const WEST_MAIN = edge([-14.94, 31.41], [-15.5, -4.56]);
const WEST_SOUTH = edge([-9.32, -16.95], [-5.68, -32.62]);
cuts.push(recess(WEST_MAIN.P, 21.5, 25.0, FLOORS[1][0], floorTop(8) - 1.5, 1.5));
cuts.push(recess(WEST_SOUTH.P, 1.2, 4.6, FLOORS[7][0], floorTop(18) - 1.5, 1.5));
cuts.push(recess(WEST_SOUTH.P, 11.0, 14.4, FLOORS[1][0], floorTop(8) - 1.5, 1.5));

const building = body.subtract(union(cuts));
if (building.decompose().length !== 1) throw new Error("WTC Utrecht: losse delen");
console.log("WTC Utrecht", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:wtc-utrecht-schijf-met-glasbanden-en-vides", building]],
  catalog: {
    name: "WTC Utrecht",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 45.75, // laagste PDOK-terrein op het plein rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-20, 0], [-20, 25], [-20, -20], [0, 38], [12, 30]],
    replacesBuildings: ["NL.IMBAG.Pand.0344100000144323"],
    description:
      "WTC Utrecht op het Stadsplateau: langgerekte schijf met afgeschuinde hoeken tot NAP +73,82 m en verhoogd middendak tot +77,7 m, een hoge begane grond en 19 kantoorlagen met horizontale glasbanden, en drie verspringende verticale vides in de westgevel; BAG-contour en 3D BAG-hoogtes (AHN5 2023). Oorsprong in het hart van het BAG-pand, X-as dwars op de lange as (30,5° op RD-oost). Verdiepingen, banddiepte en de positie van de vides zijn uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      centreRoofNapM: CENTRE_ROOF,
      officeStoreys: 19,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
      estimatedVidePositions: true,
    },
    sources: [
      "PDOK BAG pand 0344100000144323 (bouwjaar 2018), actuele orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000144323",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Utrecht_(stad)",
      "https://commons.wikimedia.org/wiki/File:WTC_Utrecht_in_2026.jpg",
      "https://commons.wikimedia.org/wiki/File:WTC_Utrecht_in_2026_2.jpg",
    ],
  },
});

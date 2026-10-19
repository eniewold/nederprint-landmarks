// Waterstadtoren (Wijnhaven, Rotterdam, 2004): woontoren met een trapsgewijs oplopende kop
// (oostelijke trede, hoofddak en glazen kopvolume) op een plint van panden met eigen hoogtes.
// Volumes op de BAG-contour en de 3D BAG-dakvlakken; vensters per verdieping als blinde nissen.
import { Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "waterstadtoren";
// Gebouwstelsel: u langs de Wijnhaven (19,2° linksom op RD-oost), v naar het noordnoordwesten.
const ORIGIN = [93131.83, 436890.01];
const ANGLE = 19.2;
const AXIS = [Math.cos((ANGLE * Math.PI) / 180), Math.sin((ANGLE * Math.PI) / 180)];
const GROUND = 2.65; // NAP (3D BAG 2,65)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Toren (3D BAG LoD2.2, pand 0599100000702531): trede +97,4, hoofddak +106,2, kop +111,4 m.
const TOWER = [[-9.4, -9.6], [1.9, -10.4], [1.9, -12.36], [8.3, -11.8], [9.6, -11.0], [12.43, -11.4], [12.44, 4.93], [7.57, 4.93], [7.57, 11.9], [-11.48, 10.41], [-10.0, 4.95], [-9.4, 1.4]];
const EAST_STEP = [[9.59, -11.0], [12.43, -11.4], [12.44, 2.74], [12.2, 2.9], [10.2, -7.74], [10.13, -9.55]];
const SW_STEP = [[-9.66, -9.46], [-7.24, -9.66], [-7.25, -5.68], [-7.73, -3.87], [-9.37, -3.55]];
const HEAD = [[-5.0, -1.6], [7.25, -1.53], [8.64, 4.93], [7.57, 5.82], [-7.11, 5.96]];
const STEP_ROOF = 97.4, TOWER_ROOF = 106.2, HEAD_ROOF = 111.4;

// Plint: delen met hun eigen dakhoogte (NAP).
const PLINTH = [
  { name: "noordblok", poly: [[-30.1, 10.5], [12.25, 10.5], [12.28, 25.74], [-30.03, 25.94]], roof: 24.5 },
  { name: "westvleugel", poly: rect(-30.3, -33.3, -21.7, 10.8), roof: 17.35 },
  { name: "strook", poly: rect(-21.9, -33.3, -18.4, 10.9), roof: 14.5 },
  { name: "midden", poly: rect(-18.4, -33.3, -8.1, 10.6), roof: 11.8 },
  { name: "zuidmidden", poly: rect(-8.8, -33.3, 2.0, -9.5), roof: 8.8 },
  { name: "zuidoost", poly: rect(1.7, -33.3, 12.42, -10.8), roof: 13.5 },
];
const PLINTH_EXTRAS = [
  { poly: rect(-18.0, -5.1, -11.3, 4.9), roof: 12.7 }, // dakopbouwen op het middendeel
  { poly: rect(-19.4, -22.6, -12.9, -11.8), roof: 12.75 },
];
const NORTH_NOTCH = rect(-22.8, 13.0, -10.7, 16.2); // lager dakdeel in het noordblok, +20,8 m

const towerUpper = prism(TOWER, z(STEP_ROOF) - 0.1, z(TOWER_ROOF)).subtract(prism(EAST_STEP, z(STEP_ROOF), z(TOWER_ROOF) + 1)).subtract(prism(SW_STEP, z(STEP_ROOF), z(TOWER_ROOF) + 1));
const body = union([
  prism(TOWER, BASE, z(STEP_ROOF)),
  towerUpper,
  prism(HEAD, z(TOWER_ROOF) - 0.1, z(HEAD_ROOF)),
  ...PLINTH.map((p) => p.name === "noordblok"
    ? prism(p.poly, BASE, z(p.roof)).subtract(prism(NORTH_NOTCH, z(20.8), z(p.roof) + 1))
    : prism(p.poly, BASE, z(p.roof))),
  ...PLINTH_EXTRAS.map((p) => prism(p.poly, z(11.8) - 0.1, z(p.roof))),
]);

// Verdiepingen van circa 3,05 m in de toren (32 tot de trede, 3 tot het dak, 2 in de kop),
// circa 3,4 m in de plint.
const layers = (from, to, n) => Array.from({ length: n }, (_, k) => [from + ((to - from) * k) / n, (to - from) / n]);
const TOWER_FLOORS = [...layers(0, z(STEP_ROOF), 32), ...layers(z(STEP_ROOF), z(TOWER_ROOF), 3), ...layers(z(TOWER_ROOF), z(HEAD_ROOF), 2)];

const DEPTH = 0.35, SILL = 0.9, HEADER = 0.35;
const cuts = [];
function facade(poly, floors, bay, pier) {
  const p = ccw(poly);
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 3.5) continue;
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
          // Buitengevel op 0 m en minstens 1 m materiaal achter de nis (geen doorgang door dunne delen).
          const from = P(s, -3, h), hits = body.rayCast(from, P(s, 3, h));
          const at = (k) => hits[k] && Math.hypot(hits[k].position[0] - from[0], hits[k].position[1] - from[1]);
          return at(0) > 2.95 && at(0) < 3.05 && !(at(1) < 3 + DEPTH + 1);
        }));
        if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH), P(s1, -0.2, hi + DEPTH), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
      }
    }
  }
}
facade(TOWER, TOWER_FLOORS, 2.9, 1.0);
facade(HEAD, TOWER_FLOORS, 1000, 0.95); // glazen kop: doorlopende band per laag
for (const p of PLINTH) facade(p.poly, layers(0, z(p.roof), Math.max(2, Math.round(z(p.roof) / 3.4))), 3.6, 1.0);

const building = body.subtract(union(cuts));
if (building.decompose().length !== 1) throw new Error("Waterstadtoren: losse delen");
console.log("Waterstadtoren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:waterstadtoren-toren-kop-en-plint", building]],
  catalog: {
    name: "Waterstadtoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 46.128, // laagste PDOK-terrein op de stoepen rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-34, 0], [15, -20], [16, 0], [0, 29], [-20, 29]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000702531"],
    description:
      "Waterstadtoren aan de Wijnhaven: toren tot NAP +106,2 m met een trapsgewijs oplopende kop (oostelijke trede +97,4 m, glazen kopvolume tot +111,4 m) op een plint van zes delen tussen +8,8 en +24,5 m; BAG-contour en 3D BAG-dakvlakken, vensters per verdieping als blinde nissen. Oorsprong in het hart van het BAG-pand, X-as langs de Wijnhaven (19,2° op RD-oost). Vensterstramien, verdiepingen en de vereenvoudigde hoekbalkons zijn uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND,
      stepRoofNapM: STEP_ROOF,
      towerRoofNapM: TOWER_ROOF,
      headRoofNapM: HEAD_ROOF,
      plinthRoofsNapM: Object.fromEntries(PLINTH.map((p) => [p.name, p.roof])),
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000702531 (bouwjaar 2004), actuele orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000702531",
      "https://nl.wikipedia.org/wiki/Waterstadtoren",
      "https://commons.wikimedia.org/wiki/File:Waterstadtoren_in_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Waterstadtoren_-_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_Waterstadtoren.jpg",
      "https://commons.wikimedia.org/wiki/File:Waterstadtoren.jpg",
    ],
  },
});

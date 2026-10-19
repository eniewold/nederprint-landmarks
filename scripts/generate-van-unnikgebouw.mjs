// Willem C. van Unnikgebouw (Utrecht Science Park, 1967–1969, Lucas & Niemeijer; voorheen
// Transitorium II): kantoorschijf met doorlopende horizontale vensterbanden onder uitstekende
// vloerranden, een teruggelegen installatieverdieping met twee liftkoppen, en de laagbouw eromheen.
// Volumes op de BAG-contour, hoogtes uit de 3D BAG (AHN5, 2023); verdiepingen en banden uit foto's.
import { Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "van-unnikgebouw";
// Gebouwstelsel: de gevels staan op RD (u = oost, v = noord).
const ORIGIN = [140277.04, 455239.79];
const AXIS = [1, 0];
const GROUND = 2.0; // NAP (3D BAG 2,03)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Hoogtes (NAP) uit de 3D BAG LoD2.2 van pand 0344100000027739.
const SLAB_ROOF = 79.1;
const PARAPET = 80.1;
const PLANT_ROOF = 83.36;
const LIFT_ROOF = 84.85;
const LINK_ROOF = 10.77;
const DECK_ROOF = 3.85;
const WEST_LOW_ROOF = 6.0;

const SLAB = rect(-51.4, -6.9, 2.4, 16.0);
const PLANT = rect(-41.7, -1.0, -6.7, 10.8);
const LIFT_EAST = rect(-6.9, 1.9, -2.7, 7.0);
const LIFT_WEST = rect(-45.5, 2.2, -40.3, 7.0);
const LINK = rect(-6.1, -28.3, 8.4, 37.1); // verbindingsvleugel van drie lagen
const DECK = [[8.4, -28.1], [52.0, -28.05], [52.16, -23.11], [58.14, -23.11], [58.14, -6.51], [58.7, -6.51], [58.7, 15.49], [58.17, 15.49], [58.17, 32.19], [52.21, 32.12], [52.21, 37.1], [8.4, 37.1]];
const WEST_LOW = rect(-55.09, -12.45, -49.0, 9.5);
const WEST_LOW_2 = rect(-49.0, -12.45, -40.39, -5.0);
const NORTH_LOW = rect(-38.13, 15.5, -16.63, 18.5);
const PATIO = rect(15.5, -6.0, 52.3, 14.9); // open patio in het dek
// Laag pand tegen de westkop (0344100000074170, 2002): PDOK trekt er een wand tot +75 m van op,
// in de 3D BAG en het AHN is het +6,0 m.
const WEST_ANNEX = [[-55.09, 9.52], [-49.6, 9.45], [-49.58, 15.3], [-48.69, 15.92], [-41.66, 15.89], [-41.66, 18.23], [-40.38, 18.23], [-40.36, 27.69], [-55.12, 27.71]];

const parapetRing = prism(SLAB, z(SLAB_ROOF) - 0.1, z(PARAPET)).subtract(prism(rect(-50.4, -5.9, 1.4, 15.0), z(SLAB_ROOF), z(PARAPET) + 1));
const body = union([
  prism(SLAB, BASE, z(SLAB_ROOF)),
  parapetRing,
  prism(PLANT, z(SLAB_ROOF) - 0.1, z(PLANT_ROOF)),
  prism(LIFT_EAST, z(SLAB_ROOF) - 0.1, z(LIFT_ROOF)),
  prism(LIFT_WEST, z(SLAB_ROOF) - 0.1, z(LIFT_ROOF)),
  prism(LINK, BASE, z(LINK_ROOF)),
  prism(DECK, BASE, z(DECK_ROOF)).subtract(prism(PATIO, BASE - 1, z(DECK_ROOF) + 1)),
  prism(WEST_ANNEX, BASE, z(WEST_LOW_ROOF)),
  prism(WEST_LOW, BASE, z(WEST_LOW_ROOF)),
  prism(WEST_LOW_2, BASE, z(WEST_LOW_ROOF)),
  prism(NORTH_LOW, BASE, z(WEST_LOW_ROOF)),
]);

// Begane grond van 4,5 m, daarboven 21 kantoorlagen tot het dak.
const FLOORS = [[0, 4.5], ...Array.from({ length: 21 }, (_, k) => [4.5 + (k * (z(SLAB_ROOF) - 4.5)) / 21, (z(SLAB_ROOF) - 4.5) / 21])];
const LINK_FLOORS = Array.from({ length: 3 }, (_, k) => [(k * z(LINK_ROOF)) / 3, z(LINK_ROOF) / 3]);

// Vensterband per verdieping als blinde nis van 0,45 m achter de vloerrand (0,9 m), plafond
// onder 45°; hoekpenanten van 0,95 m; alleen waar de gevel werkelijk buitengevel is.
const DEPTH = 0.45, SLAB_EDGE = 0.9;
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
      const lo = zf + SLAB_EDGE, hi = zf + fh - DEPTH;
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
facade(SLAB, FLOORS, 1000, 0.95);
facade(LINK, LINK_FLOORS, 1000, 0.95);

const building = body.subtract(union(cuts));
if (building.decompose().length !== 1) throw new Error("Van Unnik: losse delen");
console.log("Van Unnik", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:van-unnikgebouw-schijf-en-laagbouw", building]],
  catalog: {
    name: "Willem C. van Unnikgebouw",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 45.856, // laagste PDOK-terrein op de paden rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-25, -12], [-58, 0], [12, -32], [60, 0], [-10, 40]],
    replacesBuildings: ["NL.IMBAG.Pand.0344100000027739", "NL.IMBAG.Pand.0344100000074170"],
    description:
      "Van Unnikgebouw (Transitorium II) in het Utrecht Science Park: schijf van 53,8 × 22,9 m tot NAP +79,1 m met dakrand tot +80,1 m, teruggelegen installatieverdieping tot +83,36 m en twee liftkoppen tot +84,85 m, 21 kantoorlagen met doorlopende vensterbanden boven een hogere begane grond, en de laagbouw van het pand (verbindingsvleugel, dek met open patio, lage vleugels en het lage aanbouwpand aan de westkop); BAG-contour en 3D BAG-hoogtes (AHN5 2023). Oorsprong in het hart van het BAG-pand, X-as naar RD-oost. Verdiepingen en banddiepte zijn uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND,
      slabRoofNapM: SLAB_ROOF,
      parapetNapM: PARAPET,
      plantRoofNapM: PLANT_ROOF,
      liftRoofNapM: LIFT_ROOF,
      linkRoofNapM: LINK_ROOF,
      deckRoofNapM: DECK_ROOF,
      officeStoreys: 21,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0344100000027739 (bouwjaar 1970) en 0344100000074170 (aanbouw 2002), actuele orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000074170",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000027739",
      "https://nl.wikipedia.org/wiki/Willem_C._van_Unnikgebouw",
      "https://commons.wikimedia.org/wiki/File:Willem_C._van_Unnikgebouw_in_2011.jpg",
      "https://commons.wikimedia.org/wiki/File:Willem_C_van_Unnikgebouw_Utrecht.jpg",
      "https://commons.wikimedia.org/wiki/File:WC_van_Unnikgebouw_2009.jpg",
      "https://commons.wikimedia.org/wiki/File:UithofVanUnnik.jpg",
    ],
  },
});

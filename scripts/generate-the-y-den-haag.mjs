// The Y (Hofwijckstraat, Den Haag, 2017; AA architecten, getransformeerde Sigma-locatie):
// een lage plint langs het spoor, een schuin weglopende woonstrook en een toren met open kroon
// vormen samen de Y in plattegrond. Volumes op de BAG-contour, hoogtes uit de 3D BAG (AHN5, 2023),
// de bouwlagen (plint 6, strook 16, toren 24) uit de projectbeschrijving; per bouwlaag
// vensternissen in een regelmatig stramien.
import { Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "the-y-den-haag";
// Gebouwstelsel: u langs het spoor (34,1° linksom op RD-oost), v naar het noordwesten.
const ORIGIN = [82125.69, 454186.33];
const ANGLE = 34.1;
const AXIS = [Math.cos((ANGLE * Math.PI) / 180), Math.sin((ANGLE * Math.PI) / 180)];
const GROUND = -0.2; // NAP, maaiveld Hofwijckstraat (3D BAG -0,21)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Dakhoogtes (NAP) uit de 3D BAG LoD2.2 van pand 0518100001649070.
const RAIL_ROOF = 9.3;
const GALLERY_ROOF = 18.25;
const PLINTH_ROOF = 21.55;
const STRIP_ROOF = 51.6;
const STRIP_STAIR = 52.7;
const BAY_ROOF = 69.2;
const TOWER_ROOF = 72.45;
const CROWN_TOP = 75.75;
const PLANT_ROOF = 74.8;
const SIDE_CORE_ROOF = 73.7;
const CANOPY_ROOF = 4.7;

// Plattegronden (u, v) uit de BAG-contour en de 3D BAG-daken.
const RAIL = rect(-86.9, -20.72, 16.61, -16.7); // smalle strook langs het spoorviaduct
const GALLERY = rect(-46.5, -18.7, -3.6, -16.7);
const PLINTH = rect(-86.9, -16.7, -3.0, -3.86);
// Woonstrook onder 45°: linker- en rechterzijde evenwijdig, kop haaks, voet op de plint.
const STRIP = [[-51.69, -15.11], [-31.4, -14.53], [3.69, 21.93], [-5.27, 30.9]];
const STAIR = [[-25.43, 1.37], [-22.66, -1.68], [-20.56, -0.04], [-23.11, 2.94]];
const TOWER = rect(-3.6, -18.6, 22.93, 4.85);
const SIDE_CORE = rect(-5.95, -2.89, -3.4, 1.34);
const BAY_ARC = [[-0.69, 5.95], [0, 6.74], [0.83, 7.39], [1.77, 7.87], [2.76, 8.19], [3.8, 8.38], [4.84, 8.44], [5.89, 8.37], [6.92, 8.18], [7.91, 7.85], [8.85, 7.38], [9.68, 6.74]];
const BAY_WEST = [[-1.31, 4.6], [-1.31, 4.85], ...BAY_ARC.filter(([u]) => u <= 4.84), [4.84, 4.6]];
const BAY_EAST = [[4.84, 4.6], ...BAY_ARC.filter(([u]) => u >= 4.84), [11.68, 4.8], [11.68, 4.6]];
const BAY_POINT = [[11.68, 4.6], [11.68, 4.8], [13.9, 7.07], [16.11, 4.85], [16.11, 4.6]];
const CANOPY = [[22.5, -11.49], [22.95, -11.49], [23.68, -10.36], [24.15, -9.24], [24.44, -8.04], [24.54, -6.82], [24.45, -5.61], [24.17, -4.44], [23.71, -3.33], [23.07, -2.29], [22.5, -2.11]];
const PLANT = rect(-1.0, -8.8, 15.5, -2.5);
const CROWN_WIDTH = 1.8;

// Dakvlak als planvergelijking z = a·u + b·v + c (NAP) boven een veelhoek.
const roofPlane = (poly, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, z(90)).trimByPlane([a / n, b / n, -1 / n], -z(c) / n);
};

const crownSection = rect(-3.6, -18.6, 22.93, 4.85);
const crown = prism(crownSection, z(TOWER_ROOF) - 0.1, z(CROWN_TOP)).subtract(
  prism(rect(-3.6 + CROWN_WIDTH, -18.6 + CROWN_WIDTH, 22.93 - CROWN_WIDTH, 4.85 - CROWN_WIDTH), z(TOWER_ROOF), z(CROWN_TOP) + 1),
);

const body = union([
  prism(RAIL, BASE, z(RAIL_ROOF)),
  prism(GALLERY, BASE, z(GALLERY_ROOF)),
  prism(PLINTH, BASE, z(PLINTH_ROOF)),
  prism(STRIP, BASE, z(STRIP_ROOF)),
  prism(STAIR, z(STRIP_ROOF) - 0.1, z(STRIP_STAIR)),
  prism(TOWER, BASE, z(TOWER_ROOF)),
  crown,
  prism(PLANT, z(TOWER_ROOF) - 0.1, z(PLANT_ROOF)),
  prism(SIDE_CORE, BASE, z(SIDE_CORE_ROOF)),
  prism(BAY_WEST, BASE, z(BAY_ROOF)),
  // Oostelijke helft van de ronde erker: hellend dak van +61,0 m naar +68,3 m (3D BAG).
  roofPlane(BAY_EAST, 7.3 / 7.25, 0, 61.0 - (7.3 / 7.25) * 4.7),
  prism(BAY_POINT, BASE, z(BAY_ROOF)),
  prism(CANOPY, BASE, z(CANOPY_ROOF)),
]);

// Bouwlagen per volume (onderkant, hoogte) in lokale meters.
const layers = (top, n, from = 0) => Array.from({ length: n }, (_, k) => [from + ((top - from) * k) / n, (top - from) / n]);
const FLOORS = {
  plinth: layers(z(PLINTH_ROOF), 6),
  strip: layers(z(STRIP_ROOF), 16),
  tower: layers(z(TOWER_ROOF), 24),
};

// Vensternissen: per bouwlaag en per travee van circa 3 m een blinde nis van 0,35 m, met een
// plafond onder 45°; borstwering en lateien samen 1,2 m, penanten minstens 1,0 m. Alleen waar de
// gevel werkelijk buitengevel is (straal van buiten raakt de gevel op 0 m diepte).
const DEPTH = 0.35, BAY = 3.0, PIER = 1.0, SILL = 0.9, HEAD = 0.35;
const cuts = [];
function facade(poly, floors, minLen = 4) {
  const p = ccw(poly);
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < minLen) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    const bays = Math.max(1, Math.round((L - PIER) / BAY));
    const w = (L - PIER) / bays;
    for (const [zf, fh] of floors) {
      const lo = zf + SILL, hi = zf + fh - HEAD - DEPTH;
      if (zf < 0.5 || hi - lo < 0.9) continue; // begane grond blijft dicht (entrees zijn kleiner dan het stramien)
      for (let k = 0; k < bays; k++) {
        const s0 = PIER + k * w, s1 = s0 + w - PIER;
        if (s1 - s0 < 0.9) continue;
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
facade(PLINTH, FLOORS.plinth);
facade(STRIP, FLOORS.strip);
facade(TOWER, FLOORS.tower);

const building = body.subtract(union(cuts));
const pieces = building.decompose();
if (pieces.length !== 1) throw new Error(`The Y: ${pieces.length} delen`);
console.log("The Y", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:the-y-plint-strook-en-toren", building]],
  catalog: {
    name: "The Y",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    // Straatniveau rondom (PDOK-terrein); het verdiepte erf ten noorden van de toren telt niet mee.
    groundHeight: 43.57,
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-60, 0], [-30, 10], [-10, 25], [26, -8]],
    replacesBuildings: ["NL.IMBAG.Pand.0518100001649070"],
    description:
      "The Y bij Den Haag HS: plint langs het spoor tot NAP +21,55 m, schuin weglopende woonstrook tot +51,6 m en toren tot +72,45 m met open kroon tot +75,75 m en installaties, ronde erker met hellend dak en spitse erker aan de noordgevel; BAG-contour en 3D BAG-hoogtes (AHN5 2023), bouwlagen (6, 16, 24) uit de projectbeschrijving. Oorsprong in het hart van de BAG-contour, X-as langs het spoor (34,1° op RD-oost). Vensterstramien en nisdiepte zijn geschat; schuine foto's van het gebouw waren niet beschikbaar.",
    realWorld: {
      groundNapM: GROUND,
      plinthRoofNapM: PLINTH_ROOF,
      stripRoofNapM: STRIP_ROOF,
      towerRoofNapM: TOWER_ROOF,
      crownTopNapM: CROWN_TOP,
      railStripRoofNapM: RAIL_ROOF,
      storeys: { plinth: 6, strip: 16, tower: 24 },
      facadeAngleDegrees: ANGLE,
      stripAngleDegrees: 45,
      estimatedWindowGrid: true,
    },
    sources: [
      "PDOK BAG pand 0518100001649070 (bouwjaar 2017), actuele orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001649070",
      "https://knauf.com/nl-NL/projectreferenties/sigma-the-y",
      "https://www.holland2stay.com/building/they",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag",
    ],
  },
});

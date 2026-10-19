// Vivaldigebouw (Domenico Scarlattilaan 6, Amsterdam Zuidas, 2019; Europees Geneesmiddelenbureau):
// glazen kantoorblok met bronskleurige verticale vinnen op een onderbouw die het blok aan drie
// kanten omsluit en aan de noordkant schuin afloopt. Volumes op de BAG-contour, hoogtes uit de
// 3D BAG (AHN5, 2023); vensterstramien en bouwlagen uit foto's.
import { CrossSection, Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "vivaldigebouw";
// Gebouwstelsel: gevels bijna op RD (u langs -0,5°, v naar het noorden).
const ORIGIN = [120827.59, 483407.62];
const ANGLE = -0.5;
const AXIS = [Math.cos((ANGLE * Math.PI) / 180), Math.sin((ANGLE * Math.PI) / 180)];
const GROUND = -0.7; // NAP (3D BAG -0,67)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Hoogtes (NAP) uit de 3D BAG LoD2.2 van pand 0363100012251798.
const PODIUM_ROOF = 17.0;
const PODIUM_PARAPET = 18.3;
const STAIR_ROOF = 21.8;
const TOWER_ROOF = 76.13;
const TOWER_PARAPET = 77.9;
const PLANT_ROOF = 80.6;
const PLANT_HIGH = 81.5;

const FOOT = [[37.53, 14.74], [1.75, 28.9], [-12.95, 28.84], [-13.24, -51.04], [21.78, -50.91], [21.72, -37.76], [38.11, -36.97], [38.51, -34.39], [38.34, 13.83]];
const TOWER = rect(1.0, -37.7, 38.4, 14.0);
const PLANT = rect(8.6, -29.6, 31.1, 6.7);
const PLANT_TOP = rect(15.6, 1.1, 20.4, 4.3);
const STAIRS = [rect(-5.1, -1.4, -0.3, 7.6), rect(-1.7, -17.5, 1.3, -11.6)];

const ring = (poly, width, z0, z1) => {
  const cs = new CrossSection([ccw(poly)]);
  return Manifold.extrude(cs.subtract(cs.offset(-width)), z1 - z0).translate([0, 0, z0]);
};
const body = union([
  prism(FOOT, BASE, z(PODIUM_ROOF)),
  ring(FOOT, 1.0, z(PODIUM_ROOF) - 0.1, z(PODIUM_PARAPET)),
  ...STAIRS.map((s) => prism(s, z(PODIUM_ROOF) - 0.1, z(STAIR_ROOF))),
  prism(TOWER, BASE, z(TOWER_ROOF)),
  ring(TOWER, 1.6, z(TOWER_ROOF) - 0.1, z(TOWER_PARAPET)),
  prism(PLANT, z(TOWER_ROOF) - 0.1, z(PLANT_ROOF)),
  prism(PLANT_TOP, z(PLANT_ROOF) - 0.1, z(PLANT_HIGH)),
]);

// Vier hoge lagen in de onderbouw, zestien kantoorlagen in het blok erboven.
const layers = (from, to, n) => Array.from({ length: n }, (_, k) => [from + ((to - from) * k) / n, (to - from) / n]);
const FLOORS = [...layers(0, z(PODIUM_ROOF), 4), ...layers(z(PODIUM_ROOF), z(TOWER_ROOF), 16)];

// Glasvakken tussen de verticale vinnen: travee 2,7 m, vin/penant 0,9 m, borstwering 0,9 m,
// latei met plafond onder 45°; blinde nis van 0,4 m, alleen op echte buitengevel.
const DEPTH = 0.4, BAY = 2.7, PIER = 0.9, SILL = 0.9, HEAD = 0.35;
const cuts = [];
function facade(poly, floors) {
  const p = ccw(poly);
  for (let i = 0; i < p.length; i++) {
    const a = p[i], b = p[(i + 1) % p.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 4) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    const bays = Math.max(1, Math.round((L - PIER) / BAY)), w = (L - PIER) / bays;
    for (const [zf, fh] of floors) {
      const lo = zf + SILL, hi = zf + fh - HEAD - DEPTH;
      if (zf < 0.5 || hi - lo < 0.9) continue;
      for (let k = 0; k < bays; k++) {
        const s0 = PIER + k * w, s1 = s0 + w - PIER;
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
facade(FOOT, FLOORS);
facade(TOWER, FLOORS);

const building = body.subtract(union(cuts));
if (building.decompose().length !== 1) throw new Error("Vivaldigebouw: losse delen");
console.log("Vivaldigebouw", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:vivaldigebouw-blok-en-onderbouw", building]],
  catalog: {
    name: "Vivaldigebouw (EMA)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.358, // laagste PDOK-terrein op de verharding rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-18, -10], [-18, 20], [40, -42], [45, 0]],
    replacesBuildings: ["NL.IMBAG.Pand.0363100012251798"],
    description:
      "Vivaldigebouw van het Europees Geneesmiddelenbureau aan de Domenico Scarlattilaan: kantoorblok van 37,4 × 51,7 m tot NAP +76,13 m met dakrand tot +77,9 m en installatieopbouw tot +81,5 m, op een onderbouw tot +17,0 m (borstwering +18,3 m) die het blok aan drie kanten omsluit en aan de noordkant schuin afloopt; BAG-contour en 3D BAG-hoogtes (AHN5 2023), glasvakken tussen verticale vinnen per bouwlaag. Oorsprong in het hart van het BAG-pand, X-as bijna RD-oost (-0,5°). Vensterstramien en bouwlagen zijn uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND,
      podiumRoofNapM: PODIUM_ROOF,
      podiumParapetNapM: PODIUM_PARAPET,
      towerRoofNapM: TOWER_ROOF,
      towerParapetNapM: TOWER_PARAPET,
      plantRoofNapM: [PLANT_ROOF, PLANT_HIGH],
      storeys: { podium: 4, tower: 16 },
      facadeBayM: BAY,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012251798 (bouwjaar 2020), actuele orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012251798",
      "https://nl.wikipedia.org/wiki/Vivaldigebouw",
      "https://commons.wikimedia.org/wiki/File:Vivaldigebouw_2019.10.24_(1).jpg",
      "https://commons.wikimedia.org/wiki/File:Vivaldigebouw_2020.04.23_(1).jpg",
      "https://commons.wikimedia.org/wiki/File:Vivaldigebouw_2020.04.23_(2).jpg",
    ],
  },
});

// Zilveren Toren (Prinses Beatrixlaan, Den Haag, 1969–1971; gerenoveerd als MN-hoofdkantoor):
// kantoorschijf met golvende horizontale zonweringsbanden, een dichte aluminium kroon rond het
// dak, en een lage vleugel met een gebogen dak naast de verdiepte Utrechtsebaan. Contour uit de
// BAG, hoogtes uit de 3D BAG (AHN5, 2023); kroonhoogte en verdiepingen uit foto's.
import { CrossSection, Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "zilveren-toren";
// Gebouwstelsel: u langs de lange gevel (35,6° linksom op RD-oost), v naar het noordwesten.
const ORIGIN = [82865.02, 455071.54];
const ANGLE = 35.6;
const AXIS = [Math.cos((ANGLE * Math.PI) / 180), Math.sin((ANGLE * Math.PI) / 180)];
// NAP van het maaiveld rondom (AHN-DTM +0,66 tot +1,0 m; de 3D BAG geeft -1,98 voor een verdiept deel).
const GROUND = 0.66;
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Hoogtes (NAP) uit de 3D BAG LoD2.2 van pand 0518100000246102.
const TOWER_ROOF = 69.86;
const CROWN_TOP = 74.9;
const CROWN_BOTTOM = 61.0; // onderkant van de dichte kroon, uit foto's geschat
const PLANT_ROOF = 73.68;
const EAST_STRIP_ROOF = 9.1;
const LINK_ROOF = 9.3;
const WEST_LOW_ROOF = 5.8;

const TOWER = rect(-34.2, 16.74, 21.83, 44.8);
const PLANTS = [rect(1.6, 24.7, 15.8, 37.5), rect(-28.4, 26.3, -14.1, 35.3)];
// Lage vleugel met gebogen dak: parabool door de 3D BAG-dakvlakken, top +20,6 m bij v = -30,45.
const WING = { u0: -30.06, u1: 19.3, v0: -55.69, v1: -5.2, top: 20.6, edge: 17.35 };
const EAST_STRIP = rect(18.95, -52.62, 22.69, 1.84);
const LINK = [[-0.05, 1.83], [22.69, 1.84], [22.69, 11.96], [15.68, 11.95], [15.68, 16.9], [-0.05, 16.9]];
const WEST_LOW = rect(-22.57, 1.79, 0.0, 16.8); // BAG-spleet van 0,9 m naar toren en verbinding gedicht

// Gebogen dak als reeks stroken langs v, elk het omhulsel van zijn twee profielpunten over de hele breedte.
function wingHull() {
  const { u0, u1, v0, v1, top, edge } = WING, vm = (v0 + v1) / 2, a = (top - edge) / ((v1 - vm) ** 2);
  const parts = [];
  const n = 24;
  for (let k = 0; k < n; k++) {
    const va = v0 + ((v1 - v0) * k) / n, vb = v0 + ((v1 - v0) * (k + 1)) / n;
    const za = z(top - a * (va - vm) ** 2), zb = z(top - a * (vb - vm) ** 2);
    parts.push(Manifold.hull([[u0, va, BASE], [u1, va, BASE], [u0, vb, BASE], [u1, vb, BASE], [u0, va, za], [u1, va, za], [u0, vb, zb], [u1, vb, zb]]));
  }
  return union(parts);
}

const crown = (() => {
  const cs = new CrossSection([ccw(TOWER)]);
  return Manifold.extrude(cs.subtract(cs.offset(-1.5)), z(CROWN_TOP) - z(TOWER_ROOF) + 0.1).translate([0, 0, z(TOWER_ROOF) - 0.1]);
})();
const body = union([
  prism(TOWER, BASE, z(TOWER_ROOF)),
  crown,
  ...PLANTS.map((p) => prism(p, z(TOWER_ROOF) - 0.1, z(PLANT_ROOF))),
  wingHull(),
  prism(EAST_STRIP, BASE, z(EAST_STRIP_ROOF)),
  prism(LINK, BASE, z(LINK_ROOF)),
  prism(WEST_LOW, BASE, z(WEST_LOW_ROOF)),
]);

// Hoge begane grond (5 m) en 16 kantoorlagen tot de kroon.
const FLOORS = [[0, 5], ...Array.from({ length: 16 }, (_, k) => [5 + (k * (z(CROWN_BOTTOM) - 5)) / 16, (z(CROWN_BOTTOM) - 5) / 16])];
const cuts = [];
const recess = (P, s0, s1, lo, hi, depth) => Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + depth), P(s1, -0.2, hi + depth), P(s0, depth, hi), P(s1, depth, hi)]);
const tp = ccw(TOWER);
for (let i = 0; i < tp.length; i++) {
  const a = tp[i], b = tp[(i + 1) % tp.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  // Zonweringsband per verdieping: glas 0,45 m achter de band van 0,9 m; alleen boven wat ervoor staat.
  for (const [zf, fh] of FLOORS) {
    if (zf < 0.5) continue;
    const lo = zf + 0.9, hi = zf + fh - 0.45;
    const mid = (lo + hi) / 2;
    const exposed = [0.25, 0.5, 0.75].every((f) => { const from = P(L * f, -3, mid), hit = body.rayCast(from, P(L * f, 1, mid))[0]; return hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]) > 2.95; });
    if (exposed) cuts.push(recess(P, 0.95, L - 0.95, lo, hi, 0.45));
  }
}

const building = body.subtract(union(cuts));
if (building.decompose().length !== 1) throw new Error("Zilveren Toren: losse delen");
console.log("Zilveren Toren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:zilveren-toren-schijf-kroon-en-gebogen-vleugel", building]],
  catalog: {
    name: "Zilveren Toren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.141, // laagste PDOK-terrein op de paden rondom (ellipsoïdisch), NAP circa +0,66
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-40, 30], [0, 50], [28, 30], [28, -20]],
    replacesBuildings: ["NL.IMBAG.Pand.0518100000246102"],
    description:
      "Zilveren Toren aan de Prinses Beatrixlaan: schijf van 56 × 28 m met golvende zonweringsbanden per verdieping tot de dichte aluminium kroon, dak op NAP +69,86 m binnen de kroon tot +74,9 m en installaties tot +73,7 m; lage vleugel met gebogen dak (+17,35 tot +20,6 m) en lage verbindingsdelen (+5,8 tot +9,3 m); BAG-contour en 3D BAG-hoogtes (AHN5 2023). Oorsprong in het hart van het BAG-pand, X-as langs de lange gevel (35,6° op RD-oost). Kroonhoogte, verdiepingen en banddiepte zijn uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND,
      towerRoofNapM: TOWER_ROOF,
      crownTopNapM: CROWN_TOP,
      crownBottomNapM: CROWN_BOTTOM,
      plantRoofNapM: PLANT_ROOF,
      wingRoofNapM: [WING.edge, WING.top],
      officeStoreys: 16,
      facadeAngleDegrees: ANGLE,
      estimatedCrownBottom: true,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0518100000246102 (bouwjaar 1971), actuele orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000246102",
      "https://nl.wikipedia.org/wiki/Zilveren_Toren",
      "https://commons.wikimedia.org/wiki/File:Zilveren_Toren_Den_Haag.jpg",
      "https://commons.wikimedia.org/wiki/File:Zilveren_toren_-_Den_Haag.JPG",
    ],
  },
});

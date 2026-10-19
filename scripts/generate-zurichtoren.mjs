// Zurichtoren (De Citruspers; Muzenplein, Den Haag, 1999): zeshoekige kantoortoren met een naar
// binnen lopende groene kap van stalen ribben en glas, een lage vleugel met golvende zuidgevel naar
// het westen en lage aanbouwen aan de zuid- en oostkant. Plattegrond van de toren uit het AHN-DSM,
// vleugels uit de BAG-contour, hoogtes uit de 3D BAG (AHN5, 2023).
import { Manifold, ccw, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "zurichtoren";
// Gebouwstelsel: u langs de westvleugel (62,6° linksom op RD-oost), v haaks erop.
const ORIGIN = [81876.84, 455205.32];
const ANGLE = 62.6;
const AXIS = [Math.cos((ANGLE * Math.PI) / 180), Math.sin((ANGLE * Math.PI) / 180)];
const GROUND = 0.47; // NAP (3D BAG 0,47)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// Toren: regelmatige zeshoek, omgeschreven straal 16,6 m (DSM boven +60 m: ingeschreven 14,4 m),
// hoekpunten op 0°, 60°, … in het gebouwstelsel.
const C = [29.0, -1.0];
const hexagon = (R) => Array.from({ length: 6 }, (_, k) => [C[0] + R * Math.cos((k * Math.PI) / 3), C[1] + R * Math.sin((k * Math.PI) / 3)]);
const TOWER_R = 16.6;
const TOWER_TOP = 70.0;
// Kap: zeshoekige ringen (NAP, omgeschreven straal) uit de 3D BAG-ringen en het DSM.
const CAP = [[70.0, 16.6], [74.0, 15.6], [78.0, 14.0], [81.0, 12.3], [84.6, 8.0]];
const RIB_TOP = 85.1;

// Vleugels uit de BAG-contour. De zuidgevel van de westvleugel golft.
const WEST_WING = [[-37.53, 0.06], [-33.44, 0.05], [-32.5, 1.93], [-30.09, 1.41], [-28.43, 0.87], [-26.8, 0.54], [-25.15, 0.52], [-23.72, 0.72], [-21.37, 1.36], [-19.76, 1.68], [-18.13, 1.72], [-16.37, 1.36], [-14.45, 0.73], [-12.85, 0.33], [-11.04, 0.22], [-9.14, 0.49], [-7.17, 1.07], [-5.58, 1.38], [-3.8, 1.41], [-1.91, 1.11], [0.17, 0.42], [2.06, 0.0], [3.72, -0.03], [5.31, 0.23], [7.12, 0.68], [8.75, 0.67], [10.39, 0.22], [12.07, -0.96], [13.2, -2.15], [16.0, -2.0], [20.0, 12.9], [-26.31, 13.79], [-25.83, 14.76], [-30.12, 14.87], [-30.93, 13.19]];
const WEST_WING_ROOF = 23.4;
const WEST_HEADS = [
  { poly: [[-35.8, 1.4], [-29.1, 1.4], [-29.1, 11.2], [-35.8, 11.2]], roof: 27.0 },
  { poly: [[-31.6, 9.0], [-25.9, 9.0], [-25.9, 14.7], [-31.6, 14.7]], roof: 26.6 },
];
// Bovenrand 1 m onder de toren doorgetrokken: de BAG-contour volgt de zeshoek niet precies.
const SOUTH_WING = [[21.0, -14.4], [26.82, -22.97], [22.51, -31.61], [28.89, -34.8], [38.0, -14.4]];
const SOUTH_WING_ROOF = 23.2;
const EAST_ANNEX = [[37.1, 0.3], [46.52, 0.72], [49.87, 7.61], [45.4, 14.51], [37.59, 13.94]];
const EAST_ANNEX_ROOF = 16.4;

const ring = (R, nap) => hexagon(R).map(([u, v]) => [u, v, z(nap)]);
const cap = union(CAP.slice(1).map(([nap, R], i) => Manifold.hull([...ring(CAP[i][1], CAP[i][0] - 0.05), ...ring(R, nap)])));
// Twaalf ribben (hoeken en middens van de zijden), 1,0 m breed, 0,6 m buiten het kapvlak.
const ribs = [];
for (let k = 0; k < 12; k++) {
  const a = (k * Math.PI) / 6, cosHalf = k % 2 ? Math.cos(Math.PI / 6) : 1;
  const dir = [Math.cos(a), Math.sin(a)], side = [-dir[1] * 0.5, dir[0] * 0.5];
  const pts = [];
  CAP.forEach(([nap, R], i) => {
    const rr = R * cosHalf + 0.6, rin = R * cosHalf - 1.0, h = i === CAP.length - 1 ? RIB_TOP : nap;
    for (const s of [-1, 1]) {
      pts.push([C[0] + dir[0] * rr + s * side[0], C[1] + dir[1] * rr + s * side[1], z(h)]);
      pts.push([C[0] + dir[0] * rin + s * side[0], C[1] + dir[1] * rin + s * side[1], z(h)]);
    }
  });
  // Per kapsegment een omhulsel, zodat de rib de holle-bolle lijn van de kap volgt.
  for (let i = 0; i < CAP.length - 1; i++) ribs.push(Manifold.hull(pts.slice(i * 4, i * 4 + 8)));
}

const body = union([
  prism(hexagon(TOWER_R), BASE, z(TOWER_TOP)),
  cap,
  ...ribs,
  prism(WEST_WING, BASE, z(WEST_WING_ROOF)),
  ...WEST_HEADS.map((h) => prism(h.poly, z(WEST_WING_ROOF) - 0.1, z(h.roof))),
  prism(SOUTH_WING, BASE, z(SOUTH_WING_ROOF)),
  prism(EAST_ANNEX, BASE, z(EAST_ANNEX_ROOF)),
]);

// Toren: begane grond 4,5 m en 20 kantoorlagen tot de kap; vleugels in lagen van circa 3,6 m.
const layers = (from, to, n) => Array.from({ length: n }, (_, k) => [from + ((to - from) * k) / n, (to - from) / n]);
const TOWER_FLOORS = [[0, 4.5], ...layers(4.5, z(TOWER_TOP), 20)];
const DEPTH = 0.35, SILL = 0.9, HEADER = 0.35;
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
facade(hexagon(TOWER_R), TOWER_FLOORS, 2.8, 1.2);
facade(WEST_WING, layers(0, z(WEST_WING_ROOF), 6), 3.2, 1.0, 6);
facade(SOUTH_WING, layers(0, z(SOUTH_WING_ROOF), 6), 3.2, 1.0);

const building = body.subtract(union(cuts));
if (building.decompose().length !== 1) throw new Error("Zurichtoren: losse delen");
console.log("Zurichtoren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:zurichtoren-zeshoekige-toren-ribbenkap-en-vleugels", building]],
  catalog: {
    name: "Zurichtoren (De Citruspers)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.902, // laagste PDOK-terrein op straat en stoep rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[50, 20], [0, 20], [30, -38], [50, -5]],
    replacesBuildings: ["NL.IMBAG.Pand.0518100000269583"],
    description:
      "Zurichtoren aan het Muzenplein: zeshoekige toren (omgeschreven straal 16,6 m) tot NAP +70,0 m met een naar binnen lopende kap tot +84,6 m en twaalf ribben tot +85,1 m, vensters per verdieping; lage westvleugel met golvende zuidgevel tot +23,4 m met twee koppen tot +27,0 m, zuidvleugel tot +23,2 m en oostelijke aanbouw tot +16,4 m. Torenplattegrond uit het AHN-DSM, vleugels uit de BAG-contour, hoogtes uit de 3D BAG. Oorsprong op het BAG-pand, X-as langs de westvleugel (62,6° op RD-oost). Kapprofiel, ribben en vensterstramien zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      towerTopNapM: TOWER_TOP,
      capRingsNapM: CAP,
      ribTopNapM: RIB_TOP,
      towerCircumradiusM: TOWER_R,
      westWingRoofNapM: WEST_WING_ROOF,
      southWingRoofNapM: SOUTH_WING_ROOF,
      eastAnnexRoofNapM: EAST_ANNEX_ROOF,
      estimatedCapProfile: true,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0518100000269583 (bouwjaar 1999), actuele orthoHR, AHN DSM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000269583",
      "https://nl.wikipedia.org/wiki/Zurichtoren",
      "https://commons.wikimedia.org/wiki/File:Zurichtoren_Den_Haag.JPG",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Zurichtoren_1.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Zurichtoren_3.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_-_Zurichtoren_(39789937282).jpg",
    ],
  },
});

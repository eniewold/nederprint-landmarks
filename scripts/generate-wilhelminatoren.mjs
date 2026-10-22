// Wilhelminatoren (Wilhelminaplein, Kop van Zuid, Rotterdam, 1997): kantoortoren aan het zuidelijke
// landhoofd van de Erasmusbrug, naast de Maastoren. Een rechthoekige witte toren met verticale
// lisenen en een lagere afgeronde schijf met horizontale rood-witte banden aan de noordwestkant;
// tussen beide een liftschacht die boven de ronde schijf uitsteekt en op het dak een langgerekte
// installatieopbouw. De zuidwestelijke helft van het torendak ligt 3 m lager.
// Contour uit de BAG, hoogtes uit het AHN-DSM, de gevelindeling uit foto's.
import { CrossSection, Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "wilhelminatoren";
// Gebouwstelsel: u langs de zuidwestgevel van de toren naar het zuidoosten (-35° op RD-oost, BAG-randen
// evenwijdig binnen 0,1°), v haaks erop naar het noordoosten. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [93452.22, 435875.65];
const ANGLE = -35.0;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 3.9; // NAP, maaiveld aan de noordoostkant (AHN-DTM 3,8–4,1, PDOK-voet 47,62 ellipsoïdisch);
// het plein aan de zuidwestkant ligt op +4,7
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM ----------
const ROUND_ROOF = 75.3; // afgeronde schijf (DSM 75–76)
const TOWER_ROOF = 83.5; // noordoostelijke helft van het torendak (83–84)
const TOWER_ROOF_SW = 80.5; // zuidwestelijke helft (79,5–82)
const CORE_TOP = 84.0; // liftschacht boven de ronde schijf (84)
const PLANT_TOP = 93.0; // installatieopbouw (DSM 92–94)

// ---------- Plattegrond in (u, v), BAG-contour vereenvoudigd tot 8 cm ----------
const FOOTPRINT = [[4.28, 10.08], [2.90, 10.08], [2.90, 9.16], [0.09, 9.15], [0.48, 10.09], [-0.11, 10.45], [-3.36, 11.48], [-5.05, 11.77], [-6.72, 11.90], [-8.39, 11.88], [-10.38, 11.67], [-12.56, 11.17], [-14.43, 10.55], [-16.55, 9.58], [-18.38, 8.50], [-20.14, 7.20], [-21.75, 5.68], [-23.53, 3.42], [-25.22, 0.51], [-25.33, -0.06], [-24.97, -1.00], [-24.09, -2.53], [-22.35, -4.76], [-20.90, -6.29], [-18.87, -7.99], [-17.10, -9.17], [-15.18, -10.17], [-13.14, -10.94], [-11.03, -11.48], [-7.75, -11.82], [-4.96, -11.67], [-2.16, -11.10], [-0.39, -10.50], [0.33, -10.12], [22.44, -10.08], [22.50, 10.08]];
const U0 = 0.33, U1 = 22.47, V0 = -10.1, V1 = 10.08; // toren
const SPLIT_V = -3.0; // grens tussen de hoge en de lage helft van het torendak (DSM)
const CORE = rect(-9.0, -3.0, U0 + 0.05, 5.0);
const PLANT = rect(-8.5, 0.0, 10.5, 1.6); // open installatiekader, als plaat van 1,6 m (DSM 86–94 in een strook van 2 m)

const body = union([
  prism(FOOTPRINT, BASE, z(ROUND_ROOF)),
  prism(rect(U0, SPLIT_V, U1, V1), BASE, z(TOWER_ROOF)),
  prism(rect(U0, V0, U1, SPLIT_V + 0.05), BASE, z(TOWER_ROOF_SW)),
  prism(CORE, z(ROUND_ROOF) - 0.1, z(CORE_TOP)),
  prism(PLANT, z(CORE_TOP) - 0.1, z(PLANT_TOP)),
]);

// ---------- Gevelreliëf ----------
// Lagen: begane grond 5,0 m, daarboven lagen van 3,55 m (21 lagen tot het hoge dak).
const STOREY = 3.55;
const FLOORS = [[0, 5.0], ...Array.from({ length: 21 }, (_, k) => [5.0 + STOREY * k, STOREY])];
const upTo = (nap, from = -10) => FLOORS.filter(([zf, fh]) => zf + fh <= z(nap) + 0.01 && zf >= z(from) - 0.01);
const DEPTH = 0.35;
const cuts = [];
// Vensters per travee langs de rand a→b (buitennormaal rechts van de looprichting): blinde nissen met
// een plafond onder 45°, alleen waar de gevel buitengevel is.
function face(a, b, floors, { pitch = 2.4, width = 1.4, sill = 0.9, header = 0.35 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const bays = Math.max(1, Math.floor((L - 0.9) / pitch)), w = (L - bays * pitch) / 2;
  for (const [zf, fh] of floors) {
    const lo = zf + sill, hi = zf + fh - header - DEPTH;
    if (hi - lo < 0.9) continue;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * pitch + (pitch - width) / 2, s1 = s0 + width;
      const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
// Witte toren: vensterkolommen tussen lisenen, travee 2,4 m.
face([U1, V1], [U0, V1], upTo(TOWER_ROOF));
face([U0, V0], [U1, V0], upTo(TOWER_ROOF_SW));
face([U1, V0], [U1, SPLIT_V], upTo(TOWER_ROOF_SW));
face([U1, SPLIT_V], [U1, V1], upTo(TOWER_ROOF));
face([U0, V1], [U0, SPLIT_V], upTo(TOWER_ROOF, ROUND_ROOF));
face([U0, SPLIT_V], [U0, V0], upTo(TOWER_ROOF_SW, ROUND_ROOF));
// Afgeronde schijf: per laag een doorlopende raamband rondom (de rood-witte banden), 0,35 m diep met
// een plafond dat in drie stappen van 0,12 m terugloopt; niet tegen de toren aan.
const round = new CrossSection([FOOTPRINT]);
const outer = round.offset(1.0, "Miter");
const notTower = prism(rect(-40, -20, U0 - 0.9, 20), BASE - 1, 200);
const bands = [];
for (const [zf, fh] of upTo(ROUND_ROOF)) {
  const lo = zf + 0.9, hi = zf + fh - 0.35 - DEPTH;
  if (hi - lo < 0.9) continue;
  const slice = (depth, h0, h1) => Manifold.extrude(outer.subtract(round.offset(-depth, "Miter")), h1 - h0).translate([0, 0, h0]);
  bands.push(slice(DEPTH, lo, hi), slice(DEPTH * 2 / 3, hi - 0.01, hi + 0.12), slice(DEPTH / 3, hi + 0.11, hi + 0.24));
}
cuts.push(union(bands).intersect(notTower));

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Wilhelminatoren: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Wilhelminatoren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:wilhelminatoren", building]],
  catalog: {
    name: "Wilhelminatoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 47.6, // PDOK-terrein aan de noordoostkant (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-10, 18], [8, 18], [20, 18]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000691047"],
    description:
      "Wilhelminatoren aan het Wilhelminaplein (Kop van Zuid): witte kantoortoren van 22 × 20 m tot NAP +83,5 m (zuidwestelijke helft +80,5 m) met vensterkolommen tussen lisenen, aan de noordwestkant een lagere afgeronde schijf tot +75,3 m met een raamband per laag, de liftschacht ertussen tot +84,0 m en een installatiekader van 19 × 1,6 m tot +93,0 m. Contour uit de BAG, hoogtes uit het AHN-DSM. Oorsprong in het hart van de BAG-contour, X-as langs de zuidwestgevel van de toren (-35° op RD-oost). Verdiepingshoogte, vensterstramien en raambanden zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      towerRoofNapM: [TOWER_ROOF_SW, TOWER_ROOF],
      roundWingRoofNapM: ROUND_ROOF,
      coreNapM: CORE_TOP,
      plantNapM: PLANT_TOP,
      towerPlanM: [+(U1 - U0).toFixed(2), +(V1 - V0).toFixed(2)],
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000691047 (bouwjaar 1997), actuele orthoHR, AHN-DSM en -DTM 0,5 m, PDOK 3D-gebouwtegel (LoD2.2)",
      "https://nl.wikipedia.org/wiki/Wilhelminaplein_(Rotterdam)",
      "https://commons.wikimedia.org/wiki/File:Rotterdam,_The_Netherlands_(30580639771).jpg",
      "https://commons.wikimedia.org/wiki/File:Wilhelminaplein_-_panoramio.jpg",
      "https://commons.wikimedia.org/wiki/File:-_panoramio_(2705).jpg",
    ],
  },
});

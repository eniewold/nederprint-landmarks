// 400 Beethoven (Beethovenstraat, Zuidas, Amsterdam, 2016): kantoorgebouw van 14 lagen op een smalle,
// schuine kavel naast de Beethovenstraat. Een sokkel van acht lagen met afgeronde hoeken over de hele
// BAG-contour, aan de zuidzijde in twee treden aflopend, en daarop een smallere toren die aan de
// westkop twee lagen lager is; bovenop een technische opbouw. Gevels met witte vensterkaders en
// blauwe borstweringen per laag.
// Contour uit de BAG, hoogtes en terugsprongen uit het AHN-DSM, gevelindeling uit foto's.
import { CrossSection, Manifold, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "400-beethoven";
// Gebouwstelsel: u langs de lange gevels naar het oostzuidoosten (-63,2° op RD-oost, BAG-randen
// evenwijdig binnen 0,1°), v haaks erop naar het noordnoordoosten. Oorsprong in het hart van de
// BAG-contour van de toren.
const ORIGIN = [120227.43, 483277.0];
const ANGLE = -63.2;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = -0.7; // NAP, AHN-DTM rondom (-0,9…-0,5; PDOK-terrein 42,4 ellipsoïdisch)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM ----------
const PODIUM = 30.0; // sokkel aan de west- en zuidzijde (29,8–30,3)
const STEP_1 = 26.0, STEP_2 = 22.0; // lagere treden aan de zuidoostkant (25–26 en 22–23)
const TOWER_WEST = 50.0; // westelijk deel van de toren (49,9–50,5)
const TOWER = 55.2; // toren (54,6–55,8)
const PLANT = 59.5; // technische opbouw (57–60)

// ---------- Plattegrond in (u, v), BAG-contour vereenvoudigd tot 10 cm ----------
const FOOTPRINT = [[31.58, 9.62], [12.96, 9.69], [12.98, 10.07], [12.08, 10.26], [-21.12, 12.6], [-22.46, 12.46], [-23.69, 11.93], [-24.69, 11.05], [-25.38, 9.89], [-25.64, 8.09], [-27.02, 6.11], [-31.91, -3.53], [-32.01, -4.74], [-31.59, -5.87], [-30.76, -6.73], [-18.48, -12.96], [-17.6, -11.38], [20.59, -11.37], [22.17, -11.15], [24.04, -10.38], [25.31, -9.41], [26.3, -8.18], [33.42, 5.77], [33.63, 6.96], [33.38, 8.13], [32.65, 9.08]];
const TOWER_SOUTH = -6.5; // zuidgevel van de toren (DSM: 55 tot v = -5,5, 30 vanaf v = -7)
const TOWER_WEST_U = -25.0; // westgevel van de toren (DSM)
const TOWER_STEP_U = -15.0; // overgang van het lagere westdeel naar de hoge toren (DSM)
const STEP_U = [8.0, 16.0]; // treden in de sokkel aan de zuidoostkant (DSM)

const plan = new CrossSection([FOOTPRINT]);
const part = (r) => plan.intersect(new CrossSection([rect(...r)]));
const up = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
const towerHigh = part([TOWER_STEP_U, TOWER_SOUTH, 60, 30]);
const towerWest = part([TOWER_WEST_U, TOWER_SOUTH, TOWER_STEP_U + 0.05, 30]);

const body = union([
  up(plan, BASE, z(STEP_2)),
  up(part([-60, -30, STEP_U[1], 30]), BASE, z(STEP_1)),
  up(part([-60, -30, STEP_U[0], 30]), BASE, z(PODIUM)),
  up(towerWest, BASE, z(TOWER_WEST)),
  up(towerHigh, BASE, z(TOWER)),
  up(new CrossSection([rect(4.0, -1.5, 28.0, 2.5)]), z(TOWER) - 0.1, z(PLANT)),
]);

// ---------- Gevelreliëf ----------
// Lagen: begane grond 4,4 m, daarboven lagen van 3,95 m (14 lagen tot het dak).
const STOREY = 3.95;
const FLOORS = [[0, 4.4], ...Array.from({ length: 13 }, (_, k) => [4.4 + STOREY * k, STOREY])];
const DEPTH = 0.35;
const cuts = [];
// Vensters per travee langs de rand a→b (buitennormaal rechts), blinde nissen met een plafond onder
// 45°, alleen waar de gevel op die hoogte buitengevel is.
function face(a, b, { pitch = 2.7, width = 1.6, sill = 0.9, header = 0.35 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 3) return;
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const bays = Math.max(1, Math.floor((L - 0.9) / pitch)), w = (L - bays * pitch) / 2;
  for (const [zf, fh] of FLOORS) {
    const lo = zf + sill, hi = zf + fh - header - DEPTH;
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
// Alle randen van sokkel, treden en toren (linksom, buitenkant rechts); de straaltest laat alleen de
// delen over die op die hoogte buitengevel zijn.
for (const cs of [plan, part([-60, -30, STEP_U[1], 30]), part([-60, -30, STEP_U[0], 30]), towerWest, towerHigh]) {
  for (const poly of cs.toPolygons()) for (let i = 0; i < poly.length; i++) face(poly[i], poly[(i + 1) % poly.length]);
}

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`400 Beethoven: ${parts.length} losse delen`);
console.log("400 Beethoven", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:400-beethoven", building]],
  catalog: {
    name: "400 Beethoven",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.4, // PDOK-terrein rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    // Het parkeerkelderpand 0363100012242865 omsluit de toren en wordt in PDOK tot het torendak opgetrokken.
    replacesBuildings: ["NL.IMBAG.Pand.0363100012242448", "NL.IMBAG.Pand.0363100012242865"],
    description:
      "400 Beethoven aan de Beethovenstraat (Zuidas): sokkel met afgeronde hoeken over de BAG-contour tot NAP +30,0 m, aan de zuidoostkant in treden van +26,0 en +22,0 m, daarop de toren tot +55,2 m (westdeel +50,0 m) met een technische opbouw tot +59,5 m. Vensters per laag als blinde nissen. Hoogtes en terugsprongen uit het AHN-DSM. Oorsprong in het hart van de BAG-contour, X-as langs de lange gevels (-63,2° op RD-oost). Verdiepingshoogte en vensterstramien zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      podiumNapM: PODIUM,
      podiumStepsNapM: [STEP_1, STEP_2],
      towerNapM: [TOWER_WEST, TOWER],
      plantNapM: PLANT,
      floors: 14,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0363100012242448 en 0363100012242865 (bouwjaar 2017), actuele orthoHR, AHN-DSM en -DTM 0,5 m, PDOK 3D-gebouwtegel (LoD2.2)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam",
      "https://commons.wikimedia.org/wiki/File:Amsterdam_-_400_Beethovenstraat_(30299782305).jpg",
      "https://commons.wikimedia.org/wiki/File:Amsterdam_-_400_Beethovenstraat_(30003120410).jpg",
      "https://commons.wikimedia.org/wiki/File:Beethovenstraat_hoek_George_Gershwinlaan_foto_1.jpg",
    ],
  },
});

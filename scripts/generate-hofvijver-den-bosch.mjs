// Jheronimus (Hofvijver 1, Paleiskwartier, 's-Hertogenbosch, 2014, Baumschlager Eberle): woontoren van
// 74 m in de Hofvijver naast het station, op drie kanten in het water en aan de oostkant aan de promenade.
// Een vierkante schacht van 24,3 m met een hoge begane grond (winkels, café) en 17 woonlagen, daarop een
// kroon van zes lagen die rondom ruim een meter terugspringt. Elke gevel heeft per laag vier vensters en
// bij beide hoeken een diepe loggia op een stramien van 3,9 m; op het dak installaties.
// Contour uit de BAG, hoogtes uit de 3D BAG en het AHN-DSM, gevelindeling uit foto's van de architect.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "hofvijver-den-bosch";
// Gebouwstelsel: u langs de zuidgevel naar het oostzuidoosten (-14,43° op RD-oost, BAG-randen evenwijdig
// binnen 0,15°), v haaks erop naar het noordnoordoosten. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [148182.44, 410774.87];
const ANGLE = -14.43;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 6.89; // NAP, promenade aan de oostkant (3D BAG-maaiveld 6,89; AHN-DTM 6,86–6,98)
// De toren staat aan drie kanten in de Hofvijver: de voet loopt dieper door dan gewoonlijk, zodat hij ook
// onder een lager PDOK-wateroppervlak (AHN-DTM aan de lage kade 5,3) niet zweeft.
const BASE = -1.6;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 80.63; // dak van de kroon (3D BAG dakvlak 80,62–80,64; AHN-DSM mediaan 80,64)
const SHAFT = 62.72; // terugsprong schacht/kroon (3D BAG-dakvlakjes op de hoeken 62,72–62,76; foto 63,3)
const PLANT = 82.0; // installatieblok (3D BAG-dakvlak 81,91–82,10; DSM 81,5–82,3)
const VENTS = 82.6; // kleinere installaties en kanalen (DSM 82,3–83,8 in plekken van circa 1 × 2 m)

// ---------- Plattegrond in (u, v) ----------
// BAG-contour: een vierkant van 24,3 × 24,35 m (twee knikjes van 0,1 m in de zuid- en noordgevel weggelaten).
const U0 = -12.15, U1 = 12.16, V0 = -12.18, V1 = 12.17;
const INSET = 1.15; // terugsprong van de kroon rondom (foto frontaal 1,1–1,2 m; DSM-rand 1,2–1,4 m)
const CROWN = [U0 + INSET, V0 + INSET, U1 - INSET, V1 - INSET];
const PLANT_POLY = rect(2.4, -1.6, 6.2, 2.1); // DSM-plek > 81,4 m (3D BAG-dakvlak 14,8 m²)
const VENT_POLYS = [rect(3.0, 3.4, 6.0, 5.0), rect(-3.8, -3.6, -2.4, -1.8), rect(4.0, -3.7, 5.4, -1.8)];

const body = union([
  prism(rect(U0, V0, U1, V1), BASE, z(SHAFT)),
  prism(rect(...CROWN), z(SHAFT) - 0.1, z(ROOF)),
  prism(PLANT_POLY, z(ROOF) - 0.1, z(PLANT)),
  ...VENT_POLYS.map((p) => prism(p, z(ROOF) - 0.1, z(VENTS))),
]);

// ---------- Gevelreliëf ----------
// Lagen: begane grond 6,18 m, daarboven 23 lagen van 2,92 m (17 in de schacht, 6 in de kroon; foto
// frontaal over het water); de bovenste laag eindigt 0,4 m onder de dakrand.
const G = 6.18, STOREY = 2.92;
const FLOORS = Array.from({ length: 23 }, (_, k) => [G + STOREY * k, STOREY]);
const SHAFT_FLOORS = FLOORS.filter(([zf]) => zf < z(SHAFT) - 0.5);
const CROWN_FLOORS = FLOORS.filter(([zf]) => zf >= z(SHAFT) - 0.5);
// Stramien 3,9 m: per gevel vier vensters van 2,4 m in het midden en bij beide hoeken een loggia van 2,4 m
// (schacht) of 2,2 m (kroon, dichter bij het midden); ertussen een hoekpijler van 1,2 m resp. 0,9 m.
const WINDOWS = [-5.85, -1.95, 1.95, 5.85];
const cuts = [];
// Blinde nis langs de rand a→b (buitennormaal rechts van de looprichting), gecentreerd op c (afstand vanaf
// het midden van de rand), met een plafond onder 45°: aan de gevel van lo tot top, achterin tot top - depth.
function niche(a, b, c, width, lo, top, depth) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, dd, h) => [a[0] + d[0] * s - n[0] * dd, a[1] + d[1] * s - n[1] * dd, h];
  const s0 = L / 2 + c - width / 2, s1 = s0 + width, hi = top - depth;
  cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, top + 0.2), P(s1, -0.2, top + 0.2), P(s0, depth, hi), P(s1, depth, hi)]));
}
const ring = (u0, v0, u1, v1) => [[[u0, v0], [u1, v0]], [[u1, v0], [u1, v1]], [[u1, v1], [u0, v1]], [[u0, v1], [u0, v0]]];
for (const [a, b] of ring(U0, V0, U1, V1)) {
  // Begane grond: zes hoge glaspuien per gevel tussen penanten.
  for (const c of [-9.75, ...WINDOWS, 9.75]) niche(a, b, c, 2.4, 0.6, G - 0.8, 0.4);
  for (const [zf, fh] of SHAFT_FLOORS) {
    for (const c of WINDOWS) niche(a, b, c, 2.4, zf + 0.9, zf + fh - 0.35, 0.35);
    for (const c of [-9.75, 9.75]) niche(a, b, c, 2.4, zf + 0.3, zf + fh - 0.3, 0.9);
  }
}
for (const [a, b] of ring(...CROWN)) {
  for (const [zf, fh] of CROWN_FLOORS) {
    for (const c of WINDOWS) niche(a, b, c, 2.2, zf + 0.9, zf + fh - 0.35, 0.35);
    for (const c of [-9.0, 9.0]) niche(a, b, c, 2.2, zf + 0.3, zf + fh - 0.3, 0.9);
  }
}

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Jheronimus: ${parts.length} losse delen`);
console.log("Jheronimus", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:hofvijver-den-bosch-jheronimus", building]],
  catalog: {
    name: "Jheronimus",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 50.43, // NAP 6,89 + 43,54 (offset van het Provinciehuis Noord-Brabant), ellipsoïdisch
    groundOffsetMetres: -0.15,
    // Alleen op de promenade aan de oostkant bemonsteren: aan de andere drie kanten ligt de Hofvijver.
    groundSamplePoints: [[15.0, -9.0], [15.0, 0.0], [15.0, 9.0]],
    replacesBuildings: ["NL.IMBAG.Pand.0796100000434078"],
    description:
      "Woontoren Jheronimus (Hofvijver 1, Paleiskwartier, Baumschlager Eberle, 2014) in de Hofvijver: een vierkante schacht op de BAG-contour van 24,3 m tot NAP +62,72 m, daarop een kroon die rondom 1,15 m terugspringt tot +80,63 m, met een installatieblok tot +82,0 m en kleinere installaties tot +82,6 m. Elke gevel heeft per laag vier vensters en bij beide hoeken een loggia op een stramien van 3,9 m (begane grond 6,18 m met zes hoge puien, daarboven 23 lagen van 2,92 m). Hoogtes uit de 3D BAG en het AHN-DSM. Oorsprong in het hart van de BAG-contour, X-as langs de zuidgevel (-14,43° op RD-oost); lokaal z = 0 is de promenade aan de oostkant (NAP +6,89), de voet loopt 1,6 m door onder het water. Verdiepingshoogtes, de terugsprong en het gevelraster komen uit foto's van de architect en zijn geschat; de naam komt van de architect en makelaarsteksten (de taak noemde de toren naar zijn adres).",
    realWorld: {
      groundNapM: GROUND,
      shaftNapM: SHAFT,
      roofNapM: ROOF,
      plantNapM: [PLANT, VENTS],
      planM: [+(U1 - U0).toFixed(2), +(V1 - V0).toFixed(2)],
      crownInsetM: INSET,
      floors: { ground: 1, shaft: SHAFT_FLOORS.length, crown: CROWN_FLOORS.length },
      groundFloorHeightM: G,
      storeyHeightM: STOREY,
      bayM: 3.9,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0796100000434078 (bouwjaar 2014, Hofvijver 1), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG (LoD2.2, puntwolk AHN4 2021)",
      "https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0796100000434078",
      "https://baumschlager-eberle.com/en/work/projects/projekte-details/jheronimus/",
    ],
  },
});

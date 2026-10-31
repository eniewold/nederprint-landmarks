// Studententoren Kolffpad (Leiden Bio Science Park, bij Leiden Centraal, 2023, Klunder Architecten): DUWO-
// studentenwoontoren van 21 lagen met 289 studio's. Een vierkante toren van 22,2 m in donkergrijs
// metselwerk met vensters in witte kaders, en aan de zuidoost- en noordoostkant een L-vormige sokkel van
// vijf lagen met een groen dak, een glazen trappenhuisopbouw en installaties. Aan de top lopen de
// vensterkolommen van de bovenste twee lagen als verdiepte sleuven door de dakrand, zodat de witte
// penanten als kroon boven het dak uitsteken.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2 op AHN5 2023: het AHN4 van de PDOK-WCS is van vóór
// de bouw en ziet alleen het bouwterrein), gevelindeling uit foto's en de luchtfoto.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "kolffpad-leiden";
// Gebouwstelsel: u langs de zuidoostgevel naar het oostnoordoosten (33,0° op RD-oost, BAG-randen
// evenwijdig binnen 0,2°), v haaks erop naar het noordnoordwesten. Oorsprong in het hart van de toren.
const ORIGIN = [92695.34, 464932.15];
const ANGLE = 33.0;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.2; // NAP, maaiveld (3D BAG 0,18; AHN-DTM rondom 0,1–0,5)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 ----------
const DECK = 67.5; // torendak (dakvlak 67,44–67,59; 70e percentiel 67,52)
const RIM = 68.1; // dakrand en penanten van de kroon (geschat, 0,6 m boven het dak)
const LIFT = 68.8; // liftopbouw midden op het dak (dakvlak 68,68–68,89)
const PODIUM = 16.6; // sokkel (dakvlak 16,61–16,63)
const STAIR = 19.3; // glazen trappenhuisopbouw op de sokkel (dakvlak 19,25–19,30)
const UNIT = 18.7; // installatiekast op de sokkel (dakvlak 18,67–18,70)
const PLANT = 17.6; // installatiekader op de sokkel (luchtfoto; hoogte geschat)

// ---------- Plattegrond in (u, v), BAG-contour ----------
const TU = 11.08, TV = 11.06; // toren 22,16 × 22,12 m
const TOWER = rect(-TU, -TV, TU, TV);
// L-vormige sokkel langs de noordoost- en zuidoostkant, tegen de toren aan.
const PODIUM_POLY = [[1.33, -25.27], [17.74, -25.27], [17.74, TV], [TU, TV], [TU, -TV], [1.33, -TV]];
const LIFT_POLY = rect(-1.6, -1.9, 4.6, 1.8);
const STAIR_POLY = rect(7.95, -25.27, 10.95, -22.0);
const UNIT_POLY = rect(11.9, -16.6, 13.6, -14.7);
const PLANT_POLY = rect(6.6, -19.3, 9.6, -16.0);

// ---------- Lagen ----------
// 21 lagen: begane grond 3,8 m en 20 woonlagen van 3,15 m tot +67,0 m boven maaiveld; de sokkel heeft
// dezelfde lagen tot de vijfde (+16,4 m).
const GF = 3.8, STOREY = 3.15;
const FLOORS = Array.from({ length: 20 }, (_, k) => [GF + STOREY * k, STOREY]);
const CROWN_FROM = FLOORS[18][0]; // bovenste twee lagen in de kroonsleuven

// Torendak binnen een dakrand van 0,9 m, met de liftopbouw erop.
const towerBody = prism(TOWER, BASE, z(RIM))
  .subtract(prism(rect(-TU + 0.9, -TV + 0.9, TU - 0.9, TV - 0.9), z(DECK), z(RIM) + 1))
  .add(prism(LIFT_POLY, z(DECK) - 0.1, z(LIFT)));
const podiumBody = union([
  prism(PODIUM_POLY, BASE, z(PODIUM)),
  prism(STAIR_POLY, z(PODIUM) - 0.1, z(STAIR)),
  prism(UNIT_POLY, z(PODIUM) - 0.1, z(UNIT)),
  prism(PLANT_POLY, z(PODIUM) - 0.1, z(PLANT)),
]);
const all = union([towerBody, podiumBody]);

// ---------- Gevelreliëf ----------
// Langs de rand a→b (buitennormaal rechts van de looprichting) per travee [s0, s1] en per laag een blinde
// nis met een plafond onder 45°, alleen waar de gevel op die hoogte buitengevel is (straal van buiten).
const exposedAt = (P, s, h) => {
  const from = P(s, -3, h), hit = all.rayCast(from, P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
};
function niches(cuts, a, b, bays, floors, { sill = 0.6, header = 0.4, depth = 0.35 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  for (const [zf, fh] of floors) {
    const lo = zf + sill, hi = zf + fh - header - depth;
    if (hi - lo < 0.9) continue;
    for (const [s0, s1] of bays) {
      const ok = [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + depth - 0.05].every((h) => exposedAt(P, s, h)));
      if (ok) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + depth + 0.2), P(s1, -0.2, hi + depth + 0.2), P(s0, depth, hi), P(s1, depth, hi)]));
    }
  }
}
// Kroonsleuf: open naar boven, dus zonder plafond.
function slots(cuts, a, b, bays, from, top, depth = 1.0) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  for (const [s0, s1] of bays) cuts.push(Manifold.hull([P(s0, -0.2, from), P(s1, -0.2, from), P(s0, depth, from), P(s1, depth, from), P(s0, -0.2, top), P(s1, -0.2, top), P(s0, depth, top), P(s1, depth, top)]));
}
// Traveeën op gelijke steek; nissen blijven 0,9 m van de hoeken, zodat de hoekpenanten ≥ 0,9 m zijn.
const grid = (L, count, width, pick = () => true) => {
  const pitch = L / count;
  return Array.from({ length: count }, (_, k) => k).filter(pick)
    .map((k) => [Math.max(0.9, pitch * (k + 0.5) - width / 2), Math.min(L - 0.9, pitch * (k + 0.5) + width / 2)])
    .filter(([s0, s1]) => s1 - s0 >= 0.9);
};
const ground = [[0, GF]];

// Toren: zes traveeën van 3,69 m per gevel, vensters van 1,9 m. Aan de zuidoostgevel alleen de vier
// oostelijke kolommen (westelijk deel blind metselwerk, foto). Begane grond met een glazen plint in
// nissen van 2,7 m en 0,6 m diep tussen penanten.
const towerCuts = [];
const SW = [-TU, -TV], SE = [TU, -TV], NE = [TU, TV], NW = [-TU, TV];
const towerFaces = [
  [SW, SE, (k) => k >= 2], // zuidoostgevel
  [SE, NE, () => true], // noordoostgevel (boven de sokkel)
  [NE, NW, () => true], // noordwestgevel
  [NW, SW, () => true], // zuidwestgevel
];
for (const [a, b, pick] of towerFaces) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  niches(towerCuts, a, b, grid(L, 6, 1.9, pick), FLOORS.slice(0, 18));
  niches(towerCuts, a, b, grid(L, 6, 2.7), ground, { sill: 0.15, header: 0.5, depth: 0.6 });
  slots(towerCuts, a, b, grid(L, 6, 1.9, pick), CROWN_FROM + 0.6, z(RIM) + 1);
}

// Sokkel: zuidoostgevel met twee vensterkolommen van 2,0 m aan de oostkant (foto), zuidwestgevel met vier
// smalle vensters van 1,0 m (foto), noordoostgevel langs de singel met elf en de noordkop met twee
// traveeën (geschat); begane grond met grote vensters van 2,0 m in nissen van 0,6 m.
const podiumCuts = [];
const P0 = [1.33, -25.27], P1 = [17.74, -25.27], P2 = [17.74, TV], P3 = [TU, TV], P5 = [1.33, -TV];
const upper = FLOORS.slice(0, 4);
niches(podiumCuts, P0, P1, [[7.5, 9.5], [12.5, 14.5]], upper);
niches(podiumCuts, P0, P1, grid(16.41, 5, 2.0), ground, { sill: 0.15, header: 0.5, depth: 0.6 });
niches(podiumCuts, P5, P0, grid(14.2, 4, 1.0), upper);
niches(podiumCuts, P5, P0, grid(14.2, 4, 2.0), ground, { sill: 0.15, header: 0.5, depth: 0.6 });
niches(podiumCuts, P1, P2, grid(36.33, 11, 1.5), upper);
niches(podiumCuts, P1, P2, grid(36.33, 11, 2.0), ground, { sill: 0.15, header: 0.5, depth: 0.6 });
niches(podiumCuts, P2, P3, grid(6.66, 2, 1.5), [...ground, ...upper]);

const tower = towerBody.subtract(union(towerCuts));
const podium = podiumBody.subtract(union(podiumCuts));
const nodes = [
  ["building:kolffpad-leiden-toren", tower],
  ["building:kolffpad-leiden-sokkel", podium],
].map(([name, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [name, m];
});
console.log("nissen toren", towerCuts.length, "sokkel", podiumCuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Studententoren Kolffpad",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.65, // NAP +0,2 plus de Leidse offset van ~43,45 (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0546100000061036"],
    description:
      "Studententoren Kolffpad (DUWO, Klunder Architecten, 2023) op het Bio Science Park bij Leiden Centraal: een vierkante toren van 22,2 m op de BAG-contour met het dak op NAP +67,5 m, een dakrand tot +68,1 m en een liftopbouw tot +68,8 m, en een L-vormige sokkel van vijf lagen tot +16,6 m langs de zuidoost- en noordoostkant met een glazen trappenhuisopbouw (+19,3 m) en installaties. Per laag vensters als blinde nissen op zes traveeën per gevel (aan de zuidoostgevel alleen de vier oostelijke), een glazen plint in nissen, en in de bovenste twee lagen sleuven door de dakrand waartussen de penanten als kroon staan. Hoogtes uit de 3D BAG (LoD2.2 op AHN5; het AHN4 ziet het bouwterrein). Oorsprong in het hart van de toren, X-as langs de zuidoostgevel (33,0° op RD-oost). Verdiepingshoogtes, de hoogte van de dakrand, het vensterraster van de noordwest- en noordoostgevel en van de sokkel, en het installatiekader zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: DECK,
      rimNapM: RIM,
      liftNapM: LIFT,
      podiumNapM: PODIUM,
      stairNapM: STAIR,
      towerSizeM: [22.16, 22.12],
      floors: 21,
      groundFloorM: GF,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0546100000061036 (bouwjaar 2023), actuele orthoHR, AHN-DTM 0,5 m",
      "3D BAG NL.IMBAG.Pand.0546100000061036 (LoD2.2, puntwolk AHN5 2023): https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0546100000061036",
      "https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0546100000061036",
      "https://www.universiteitleiden.nl/nieuws/2024/04/een-waanzinnig-uitzicht-relaxruimte-en-cafe-studententoren-kolffpad-officieel-geopend",
      "https://www.duwo.nl/en/about-duwo/our-buildings/we-build/project-details/item/44",
    ],
  },
});

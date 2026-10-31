// High Lane (Talent Square, Spoorzone Tilburg, 2023, HUB architecten Antwerpen, voor TBV Wonen): woontoren
// van 23 lagen met 150 sociale huurwoningen op de hoek van de Hart van Brabantlaan en de Sint
// Ceciliastraat, naast het studentencomplex Talent Square (2013). Een rechthoekige toren van 29,8 × 18,8 m
// met gevels van lichtgrijze prefab betonelementen: een regelmatig raster van acht traveeën op de lange
// en vijf op de korte gevels, per laag een breed venster tussen penanten; een hogere begane grond en
// bovenaan een gesloten band met een dakrand. Op het dak een installatie- en liftopbouw.
// Het lage L-vormige blok aan de zuidkant (pand 0855100000815267) en het glazen tussenlid en de pergola bij
// de entree horen bij het complex maar niet bij dit pand; ze blijven PDOK.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2 op AHN5, 2024; het PDOK-AHN4 is van vóór de
// oplevering en ziet hier een bouwterrein), gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "talent-square-tilburg";
// Gebouwstelsel: u langs de zuidgevel naar het oosten (-7,84° op RD-oost; alle BAG-randen evenwijdig of
// haaks binnen 0,02°), v langs de korte gevels naar het noorden. Oorsprong midden in de toren.
const ORIGIN = [133339.85, 396950.44];
const ANGLE = -7.84;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
// NAP, laagste maaiveld rond de toren: 3D BAG-maaiveld 13,11; AHN-DTM oostkant (laan langs Talent
// Square) 13,1–13,2. Aan de west- en zuidkant ligt het maaiveld en het binnenhof hoger (14,3–14,5).
const GROUND = 13.15;
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 (AHN5 2024) ----------
const FLOOR0 = 14.45; // vloer begane grond = binnenhof (AHN-DTM 14,4–14,5; entreetrap vanaf de straat)
const ROOF = 83.02; // dak (dakvlak 82,90–83,03; 70e percentiel 83,02 = 69,9 m boven het 3D BAG-maaiveld)
const PARAPET = 84.15; // dakrand (strook langs de noordgevel 84,02–84,19)
const PLANT = 84.4; // installatie- en liftopbouw (84,28–84,47)

// ---------- Plattegrond in (u, v) ----------
const W = -14.89, E = 14.89, S = -9.42, N = 9.42; // BAG-contour 29,78 × 18,84 m
const TOWER = rect(W, S, E, N);
const PLANT_POLY = rect(-1.8, 1.8, 2.4, 6.9); // 3D BAG-dakvlak en ortho

// ---------- Lagen ----------
// Begane grond 3,9 m, daarboven 22 woonlagen van 2,92 m tot +82,6 m; daarboven de dichte dakband.
const GF = 3.9, STOREY = 2.92;
const FLOORS = [[z(FLOOR0), GF], ...Array.from({ length: 22 }, (_, k) => [z(FLOOR0) + GF + STOREY * k, STOREY])];

// Randen van de toren (linksom, buitennormaal rechts van de looprichting), met het aantal traveeën.
const EDGES = {
  south: { e: [[W, S], [E, S]], bays: 8 },
  east: { e: [[E, S], [E, N]], bays: 5 },
  north: { e: [[E, N], [W, N]], bays: 8 },
  west: { e: [[W, N], [W, S]], bays: 5 },
};
// Punt op afstand s langs rand a→b, t naar buiten, hoogte h.
const frame = ([a, b]) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, Q: (s, t, h) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t, h] };
};

// ---------- Massa ----------
const inset = (x0, y0, x1, y1, d) => rect(x0 + d, y0 + d, x1 - d, y1 - d);
const body = union([
  prism(TOWER, BASE, z(ROOF)),
  // Dakrand van 0,9 m rondom.
  prism(TOWER, z(ROOF) - 0.1, z(PARAPET)).subtract(prism(inset(W, S, E, N, 0.9), z(ROOF) - 1, z(PARAPET) + 1)),
  prism(PLANT_POLY, z(ROOF) - 0.1, z(PLANT)),
]);

// ---------- Gevelreliëf ----------
const DEPTH = 0.35;
const cuts = [];
// Blinde nis van s0 tot s1 tussen lo en hi (bovenkant van de opening), plafond onder 45°.
const niche = (Q, s0, s1, lo, hi, depth = DEPTH) => {
  const P = (s, d, h) => Q(s, -d, h);
  return Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + 0.2), P(s1, -0.2, hi + 0.2), P(s0, depth, hi - depth), P(s1, depth, hi - depth)]);
};
// Hal aan het binnenhof: de middelste twee traveeën van de zuidgevel liggen op de begane grond 1,2 m terug
// (verlichte glazen hal op de foto vanaf het binnenhof).
const LOBBY = { edge: "south", from: 3, to: 5, depth: 1.2 }; // in traveeën
for (const [name, { e, bays }] of Object.entries(EDGES)) {
  const { L, Q } = frame(e);
  const pitch = L / bays;
  // Woonlagen: venster van 2,1 m breed, borstwering 0,8 m, kop 0,35 m onder de volgende vloer.
  for (const [zf, fh] of FLOORS.slice(1)) {
    for (let k = 0; k < bays; k++) {
      const s0 = k * pitch + (pitch - 2.1) / 2;
      cuts.push(niche(Q, s0, s0 + 2.1, zf + 0.8, zf + fh - 0.35));
    }
  }
  // Begane grond: brede ramen van 2,6 m, borstwering 0,4 m, kop 0,6 m onder de eerste verdieping.
  const [zf, fh] = FLOORS[0];
  for (let k = 0; k < bays; k++) {
    if (name === LOBBY.edge && k + 0.5 > LOBBY.from && k + 0.5 < LOBBY.to) continue;
    const s0 = k * pitch + (pitch - 2.6) / 2;
    cuts.push(niche(Q, s0, s0 + 2.6, zf + 0.4, zf + fh - 0.6));
  }
  if (name === LOBBY.edge) {
    const s0 = LOBBY.from * pitch + 0.8, s1 = LOBBY.to * pitch - 0.8;
    cuts.push(niche(Q, s0, s1, zf, zf + fh - 0.4, LOBBY.depth));
  }
}
console.log("nissen", cuts.length);

const tower = body.subtract(union(cuts));
const nodes = [["building:talent-square-tilburg-toren", tower]];
for (const [name, m] of nodes) {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(2)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
}

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "High Lane",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 56.97, // NAP-maaiveld + 43,82 m (NLGEO2018 ter plekke 43,85, geijkt op De Bankier 43,80)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0855100000815266"],
    description:
      "Woontoren High Lane aan Talent Square (Spoorzone Tilburg, 2023, HUB architecten): rechthoekige toren van 29,8 × 18,8 m op de BAG-contour tot NAP +83,02 m (69,9 m boven het laagste maaiveld van +13,15 m) met een dakrand van 0,9 m tot +84,15 m en een installatie- en liftopbouw tot +84,4 m; gevels met een raster van acht traveeën op de lange en vijf op de korte zijden, per woonlaag een venster als blinde nis, een hogere begane grond met brede ramen en aan het binnenhof (zuidzijde) een teruggelegen hal over twee traveeën. Alle hoogtes uit de 3D BAG (AHN5, 2024), want het PDOK-AHN is van vóór de oplevering. Oorsprong midden in de toren, X-as langs de zuidgevel (-7,84° op RD-oost). Verdiepingshoogte, vloerpeil van de begane grond, vensterafmetingen, de hal en de dakrand buiten de noordgevel zijn geschat; het lage L-blok, het glazen tussenlid en de entreepergola horen bij het complex maar staan op andere panden en blijven PDOK.",
    realWorld: {
      groundNapM: GROUND,
      groundFloorNapM: FLOOR0,
      roofNapM: ROOF,
      parapetNapM: PARAPET,
      plantNapM: PLANT,
      heightAboveGroundM: +(ROOF - 13.11).toFixed(2),
      towerPlanM: [+(E - W).toFixed(2), +(N - S).toFixed(2)],
      floors: 23,
      groundFloorM: GF,
      storeyHeightM: STOREY,
      baysLongShort: [8, 5],
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0855100000815266 (bouwjaar 2023), actuele orthoHR, AHN-DTM 0,5 m",
      "3D BAG LoD2.2 (AHN5, 2024): https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0855100000815266",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Tilburg",
      "https://www.hubarchitecten.eu/en/projects/woontoren-tilburg",
      "https://www.vandevenbv.nl/nl/projecten/high-lane",
    ],
  },
});

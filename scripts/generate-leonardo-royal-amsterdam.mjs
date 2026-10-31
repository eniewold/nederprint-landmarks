// Leonardo Royal Hotel Amsterdam (Paul van Vlissingenstraat 24, Amstelkwartier/Overamstel, 2019): hoteltoren
// van rode baksteen met 490 kamers aan de Amstel bij metrostation Overamstel. Een rechthoekige toren van
// 50,5 × 21,7 m op een glazen plint met hoge, wit omlijste ramen; per laag een regelmatig vensterraster en in
// de bovenste twee lagen per travee een groot kruisvenster van twee lagen hoog (de rode kruisen). Achter de
// toren een sokkelvleugel van vier lagen, een lage tussenstrook en een parkeergarage met een parkeerdek op het
// dak (twee halve niveaus met hellingbanen) en een trappenhuis met liftopbouw. Het hele complex is één
// BAG-pand.
// Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG (LoD2.2, AHN5), gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "leonardo-royal-amsterdam";
// Gebouwstelsel: u langs de zuidgevel van de toren naar het oostnoordoosten (22,47° op RD-oost, BAG-randen
// evenwijdig binnen 0,05°), v haaks erop naar het noordnoordwesten; (0, 0) is de zuidwesthoek van de toren
// (RD 122993,72 / 482816,53). Het modelstelsel heeft dezelfde assen met de oorsprong in het hart van de
// BAG-contour (u 25,25, v 34,5).
const ORIGIN = [123003.87, 482858.06];
const ANGLE = 22.47;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const SHIFT = [-25.25, -34.5];
const GROUND = 0.45; // NAP, AHN-DTM rondom (0,37–0,57; 3D BAG-maaiveld 0,38)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM (AHN4) en 3D BAG (AHN5 2023) ----------
const TOWER_ROOF = 60.5; // torendak met dakrand (3D BAG 60,48–60,52; DSM-rand 60,5–60,6)
const PODIUM_ROOF = 15.85; // sokkelvleugel (3D BAG 15,84–15,86; DSM 15,8–16,0)
const LOW_ROOF = 8.35; // lage tussenstrook (3D BAG 8,33–8,39; DSM 8,3–8,4)
const DECK_WEST = 17.35; // parkeerdek, westelijk halfniveau (DSM 17,3–17,4)
const DECK_EAST = 18.7; // parkeerdek, oostelijk halfniveau (DSM 18,7)
const RAMP_LOW = 16.1; // onderkant van de dalende hellingbaan tegen het oostelijke dek (DSM 16,0–16,2)
const CORE_ROOF = 20.1; // trappenhuis op het parkeerdek (3D BAG 20,05–20,12)
const CORE2_ROOF = 19.6; // tweede opbouw ernaast (3D BAG 19,54–19,70)
const LIFT_ROOF = 21.2; // liftopbouw (3D BAG 21,17–21,19)

// ---------- Plattegrond in (u, v), BAG-contour vereenvoudigd tot 0,1 m ----------
// De BAG-contour is een rechthoek van 50,5 × 69,0 m (afwijkingen ≤ 0,1 m en een halfrond uitsteeksel van
// 0,26 m aan de zuidgevel weggelaten). Indeling uit de daken in het DSM en de 3D BAG.
const U1 = 50.5;
const TOWER_V = 21.7; // noordgevel van de toren (DSM-overgang 60,5 → 15,9 tussen v 21,5 en 22)
const PODIUM_V = 36.4; // noordgevel van de sokkelvleugel (DSM 15,9 → 8,4 tussen v 36 en 37)
const GARAGE_V = 45.8; // zuidgevel van de parkeergarage (DSM 8,4 → 17 tussen v 45 en 46)
const V1 = 69.0; // noordgrens (BAG)
const RAMP_U0 = 13.5, RAMP_U1 = 34.8; // hellingbanen tussen de twee dekniveaus (DSM)
const RAMP_SPLIT = 56.8; // grens tussen de stijgende (zuid) en de dalende (noord) hellingbaan (DSM)

// Dakinstallaties op de toren (3D BAG-dakvlakken, gecontroleerd in het DSM): [u0, v0, u1, v1, NAP].
const PLANT = [
  [8.8, 8.5, 16.5, 12.5, 64.35], // liftopbouw (3D BAG 64,29–64,40)
  [14.8, 5.6, 17.0, 17.0, 63.9], // trappenhuis, smalle strook dwars over het dak (63,87–63,92)
  [17.0, 8.3, 23.8, 13.5, 62.5], // installatieplaat (62,45–62,53)
  [18.7, 9.8, 23.8, 12.6, 63.9], // installatiekast daarop (63,91–63,95)
  [26.8, 7.9, 33.5, 11.8, 62.5], // installatieplaat (62,50–62,56)
  [24.9, 11.0, 34.9, 13.4, 64.0], // installatiekast (63,95–64,00)
  [34.8, 6.7, 46.4, 14.6, 63.15], // installatiekast aan de oostkant (63,15–63,18)
  [9.5, 11.4, 28.6, 17.9, 62.1], // lage installatieplaat aan de noordkant (62,04–62,53)
];

// ---------- Gevelindeling (foto's) ----------
// Plint: begane grond geheel van glas tot +6,4 m, daarboven tot +10,2 m hoge wit omlijste ramen op het
// vensterraster. Toren: 16 hotellagen van 3,0 m vanaf +10,6 m; per laag vensters van 1,4 m breed op een
// regelmatig raster (14 kolommen langs de lange gevels, 6 langs de korte); de bovenste twee lagen hebben per
// travee van twee kolommen één kruisvenster van 5,0 m breed en twee lagen hoog. Sokkelvleugel: dezelfde plint en
// één rij vensters op de eerste toren-laag.
const PLINTH = 10.6;
const STOREY = 3.0;
const FLOORS = 16;
const CROWN = 2; // bovenste lagen met kruisvensters
const DEPTH = 0.35;
const WIN = 1.4;
const GLASS_TOP = 6.4;
const TALL_TOP = 10.2;
const floorZ = (k) => PLINTH + STOREY * k;

// Blinde nis langs de rand a→b (buitennormaal rechts van de looprichting): van s0 tot s1, van lo tot de
// bovenkant top, depth diep, met een plafond onder 45°.
function niche(a, b, s0, s1, lo, top, depth = DEPTH) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  const hi = top - depth;
  return Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, top + 0.2), P(s1, -0.2, top + 0.2), P(s0, depth, hi), P(s1, depth, hi)]);
}
const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const columns = (L, n) => Array.from({ length: n }, (_, k) => (k + 0.5) * (L / n));

// Plint langs een rand: glazen band over de hele lengte (behalve 1,0 m hoekpenanten) en per kolom een hoog
// omlijst raam erboven.
function plinth(a, b, n, cuts) {
  const L = len(a, b);
  cuts.push(niche(a, b, 1.0, L - 1.0, 0.2, GLASS_TOP, 0.4));
  for (const c of columns(L, n)) cuts.push(niche(a, b, c - 0.8, c + 0.8, GLASS_TOP - 0.5, TALL_TOP, 0.4));
}
// Vensterrij per laag k langs een rand.
function windows(a, b, n, ks, cuts) {
  const L = len(a, b);
  for (const k of ks) for (const c of columns(L, n)) cuts.push(niche(a, b, c - WIN / 2, c + WIN / 2, floorZ(k) + 0.9, floorZ(k) + 2.7));
}
// Kruisvensters: per travee van twee kolommen één nis van 5,0 m breed over de bovenste twee lagen.
function crown(a, b, n, cuts) {
  const L = len(a, b), pitch = L / n;
  for (let j = 0; j < n / 2; j++) {
    const c = (2 * j + 1) * pitch;
    cuts.push(niche(a, b, c - 2.5, c + 2.5, floorZ(FLOORS - CROWN) + 0.5, floorZ(FLOORS) - 0.0, 0.4));
  }
}
const range = (a, b) => Array.from({ length: b - a }, (_, i) => a + i);

// ---------- Toren ----------
const S = [0, 0], E = [U1, 0], NE = [U1, TOWER_V], NW = [0, TOWER_V];
const towerCuts = [];
plinth(S, E, 14, towerCuts);
plinth(E, NE, 6, towerCuts);
plinth(NW, S, 6, towerCuts);
windows(S, E, 14, range(0, FLOORS - CROWN), towerCuts);
windows(E, NE, 6, range(0, FLOORS - CROWN), towerCuts);
windows(NW, S, 6, range(0, FLOORS - CROWN), towerCuts);
windows(NE, NW, 14, range(2, FLOORS - CROWN), towerCuts); // noordgevel boven de sokkelvleugel
for (const [a, b, n] of [[S, E, 14], [E, NE, 6], [NE, NW, 14], [NW, S, 6]]) crown(a, b, n, towerCuts);
// Entreeluifel aan de oostkant van de zuidgevel (foto): 13 m breed, 3,0 m uitkragend, bovenkant +6,2 m,
// 1,5 m dik met een kraag onder 45° tegen de gevel.
const CANOPY = { u0: 36.0, u1: 49.0, out: 3.0, top: 6.2, thick: 1.5 };
const canopy = Manifold.hull([CANOPY.u0, CANOPY.u1].flatMap((u) => [
  [u, -CANOPY.out, CANOPY.top], [u, 0.6, CANOPY.top], [u, -CANOPY.out, CANOPY.top - CANOPY.thick],
  [u, 0.6, CANOPY.top - CANOPY.thick - CANOPY.out - 0.6],
]));
const tower = union([
  prism(rect(0, 0, U1, TOWER_V), BASE, z(TOWER_ROOF)).subtract(union(towerCuts)),
  canopy,
  ...PLANT.map(([u0, v0, u1, v1, top]) => prism(rect(u0, v0, u1, v1), z(TOWER_ROOF) - 0.1, z(top))),
]);

// ---------- Sokkelvleugel en lage tussenstrook ----------
const podiumCuts = [];
const PW0 = [0, PODIUM_V], PW1 = [0, TOWER_V], PE0 = [U1, TOWER_V], PE1 = [U1, PODIUM_V];
plinth(PW0, PW1, 4, podiumCuts);
plinth(PE0, PE1, 4, podiumCuts);
windows(PW0, PW1, 4, [0], podiumCuts);
windows(PE0, PE1, 4, [0], podiumCuts);
windows(PE1, PW0, 14, [0], podiumCuts); // noordgevel boven de lage strook
// Lage strook: per kolom een hoog raam (geschat), aan de west- en oostkant.
const LW0 = [0, GARAGE_V], LW1 = [0, PODIUM_V], LE0 = [U1, PODIUM_V], LE1 = [U1, GARAGE_V];
for (const [a, b] of [[LW0, LW1], [LE0, LE1]]) for (const c of columns(len(a, b), 3)) podiumCuts.push(niche(a, b, c - 0.8, c + 0.8, 0.2, z(LOW_ROOF) - 1.3, 0.4));
const podium = union([
  prism(rect(0, TOWER_V, U1, PODIUM_V), BASE, z(PODIUM_ROOF)),
  prism(rect(0, PODIUM_V - 0.1, U1, GARAGE_V), BASE, z(LOW_ROOF)),
]).subtract(union(podiumCuts));

// ---------- Parkeergarage met dek en hellingbanen ----------
// Hellingbaan = planvergelijking z = a u + c boven een polygoon (deel van het prisma onder het vlak).
const plane = (poly, a, c) => {
  const n = Math.hypot(a, 1);
  return prism(poly, BASE, 40).trimByPlane([a / n, 0, -1 / n], -c / n);
};
const upSlope = (z(DECK_EAST) - z(DECK_WEST)) / (RAMP_U1 - RAMP_U0);
const downSlope = (z(RAMP_LOW) - z(DECK_WEST)) / (RAMP_U1 - RAMP_U0);
const garage = union([
  prism(rect(0, GARAGE_V, RAMP_U0, V1), BASE, z(DECK_WEST)),
  prism(rect(RAMP_U1, GARAGE_V, U1, V1), BASE, z(DECK_EAST)),
  plane(rect(RAMP_U0 - 0.05, GARAGE_V, RAMP_U1 + 0.05, RAMP_SPLIT), upSlope, z(DECK_WEST) - upSlope * RAMP_U0),
  plane(rect(RAMP_U0 - 0.05, RAMP_SPLIT, RAMP_U1 + 0.05, V1), downSlope, z(DECK_WEST) - downSlope * RAMP_U0),
  prism(rect(0, GARAGE_V, 6.5, 51.5), BASE, z(CORE_ROOF)),
  prism(rect(1.5, 51.4, 5.9, 54.0), BASE, z(CORE2_ROOF)),
  prism(rect(4.3, GARAGE_V, 6.6, 48.0), z(CORE_ROOF) - 0.1, z(LIFT_ROOF)),
]);

const nodes = [
  ["hoteltoren", tower],
  ["sokkel", podium],
  ["parkeergarage", garage],
].map(([label, m]) => {
  const placed = m.translate([SHIFT[0], SHIFT[1], 0]);
  const parts = placed.decompose();
  if (parts.length !== 1) throw new Error(`${label}: ${parts.length} losse delen`);
  console.log(label, placed.status(), "genus", placed.genus(), "driehoeken", placed.numTri());
  return [`building:${slug}-${label}`, placed];
});

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Leonardo Royal Hotel Amsterdam",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.49, // NAP-maaiveld 0,45 + geoïdehoogte NLGEO2018 43,04 (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0363100012242114"],
    description:
      "Leonardo Royal Hotel aan de Paul van Vlissingenstraat 24 (Overamstel): de BAG-contour is een rechthoek van 50,5 × 69,0 m met aan de zuidkant de hoteltoren van 50,5 × 21,7 m tot NAP +60,5 m met dakinstallaties tot +64,35 m, daarachter een sokkelvleugel tot +15,85 m, een lage strook tot +8,35 m en een parkeergarage met een dek op twee halve niveaus (+17,35 en +18,7 m), twee hellingbanen als vlakken en een trappenhuis met liftopbouw tot +21,2 m. De toren heeft een glazen plint met hoge omlijste ramen, 16 hotellagen met een vensterraster als blinde nissen, in de bovenste twee lagen per travee een kruisvenster van twee lagen, en een entreeluifel aan de zuidgevel. Hoogtes uit het AHN-DSM en de 3D BAG, gevelindeling uit een foto van de zuid- en westgevel. Oorsprong in het hart van de BAG-contour, X-as langs de zuidgevel (22,47° op RD-oost). Verdiepingshoogtes, vensterraster, de luifel en de gevels van de lage strook zijn geschat; de gevels van de parkeergarage zijn vlak gelaten.",
    realWorld: {
      groundNapM: GROUND,
      towerRoofNapM: TOWER_ROOF,
      towerPlantNapM: 64.35,
      podiumRoofNapM: PODIUM_ROOF,
      lowRoofNapM: LOW_ROOF,
      parkingDeckNapM: [DECK_WEST, DECK_EAST],
      rampLowNapM: RAMP_LOW,
      stairCoreNapM: CORE_ROOF,
      liftNapM: LIFT_ROOF,
      footprintM: [U1, V1],
      towerM: [U1, TOWER_V],
      hotelFloors: FLOORS,
      storeyHeightM: STOREY,
      plinthHeightM: PLINTH,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012242114 (bouwjaar 2019; verblijfsobjecten Paul van Vlissingenstraat 24, logies, en Isaäc Asscherpad 4), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG LoD2.2 (AHN5 2023), NLGEO2018",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam",
      "https://commons.wikimedia.org/wiki/File:LeonardoRoyalHotelAmsterdam.jpg",
    ],
  },
});

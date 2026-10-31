// Leonardo Hotel Amsterdam Rembrandtpark (Staalmeesterslaan, Amsterdam-West, 1972-1973; Zanstra, Gmelig Meyling
// en De Clercq Zubli): het Rembrandtparkgebouw, een voormalig kantoorcomplex. Een hoteltoren van 17 lagen met
// doorlopende, ver uitstekende betonnen vloerranden boven een hoge glazen begane grond, afgesloten door een dichte
// kroon met venstersleuven; ernaast op een parkeerdek een laag blok van drie lagen rond een binnentuin (nu
// Hotelschool The Hague) met diepe vensternissen boven een terugliggende begane grond op kolommen. Alles is één
// BAG-pand (0363100012148630): toren, laagbouw en het dek boven de parkeerkelder. Het dek zelf zit niet in het
// model: het PDOK-terrein ligt daar al op dekhoogte en een eigen plaat zou ermee samenvallen.
// Contour uit de BAG, hoogtes uit het AHN-DSM (0,5 m) en de 3D BAG (LoD2.2, AHN5 2023), gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "leonardo-hotel-rembrandtpark";
// Gebouwstelsel: u langs de korte gevels van de toren naar het oosten (0,66° op RD-oost; alle BAG-randen
// evenwijdig of haaks binnen 0,05°), v naar het noorden. Oorsprong in het hart van de toren.
const ORIGIN = [118004.14, 486831.35];
const ANGLE = 0.66;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = -0.75; // NAP, maaiveld rond de toren (AHN-DTM -0,98…-0,72; 3D BAG -0,77)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const DECK = 0.3; // parkeerdek en binnentuin (DSM 0,2–0,4)
// Toren
const TOWER_ROOF = 66.6; // dak binnen de kroon (DSM 66,5–66,7; 3D BAG 66,54–66,69)
const PLANT_TOP = 70.13; // installatieopbouw op het dak (3D BAG 70,11–70,16)
const LIFT_TOP = 73.0; // twee liftopbouwen (DSM en 3D BAG 72,96–73,00)
const PLANT_E_TOP = 69.6; // oostelijke installatiekast (3D BAG 69,60–69,62)
const TENT_TOP = 69.3; // paviljoen/zeilen van het dakterras (AHN4 69,3; de 3D BAG meet daar 67,4–67,9)
const PLANT_N_TOP = 68.9; // kast aan de noordkant (3D BAG 68,93–68,96)
const SCREEN_TOP = 69.0; // smal scherm langs het dakterras (DSM 68,9–69,0)
// Laagbouw
const NB_ROOF = 12.03; // dak van de ring (3D BAG 12,02–12,04)
const CORE_TOP = 16.45; // middenkern (3D BAG 16,42–16,50)
const CORE_PLANT_TOP = 18.1; // kast op de kern (3D BAG 18,07–18,10)
const EC_LOW = 4.55; // lage daken in de oostelijke binnenhof (3D BAG 4,55–4,56)
const EC_BLOCK = 7.15; // aula in de oostelijke binnenhof (3D BAG 7,10–7,24)
const EC_SKY = 7.5; // lichtkap op de aula (3D BAG 7,44–7,62)
const PAVILION = 3.37; // paviljoen in de binnentuin (3D BAG 3,36–3,39)

// ---------- Plattegrond in (u, v) ----------
// BAG-contour: dek u -75,8…53,46, v 4,25…109,0 met de toren naar het zuiden uitstekend (knikjes van 0,4 m aan
// de oostrand weggelaten).
const TU0 = -12.67, TU1 = 12.78, TV0 = -24.58, TV1 = 24.25; // toren (BAG; noordrand uit DSM en 3D BAG)
const NB = rect(-66.0, 47.8, 36.0, 109.0); // laagbouw (DSM-randen)
const COURT_W = rect(-45.6, 62.6, -13.6, 94.8); // binnentuin
const COURT_E = rect(-1.4, 62.6, 16.2, 94.8); // oostelijke binnenhof met lage daken
const CORE = rect(-13.6, 59.5, -1.4, 97.6);
const CORE_BUMP = rect(-19.4, 69.7, -13.5, 77.5); // trappenhuis in de binnentuin
const CORE_PLANT = rect(-10.2, 60.4, -5.0, 62.3);
const EC_BLOCK_POLY = rect(2.0, 63.7, 12.7, 93.6);
const EC_SKY_POLY = rect(4.2, 84.9, 10.4, 93.3);
const PAVILION_POLY = rect(-19.2, 67.0, -13.6, 69.75);
// Installatiekasten en kanalen op het dak van de ring (3D BAG-dakvlakken en DSM, top NAP)
const NB_UNITS = [
  [rect(-54.4, 54.6, -40.5, 57.0), 13.9],
  [rect(-34.5, 54.6, -15.0, 57.3), 13.6],
  [rect(-54.0, 100.4, -40.8, 102.7), 13.9],
  [rect(-26.8, 100.4, -16.5, 102.5), 13.6],
  [rect(12.4, 100.4, 26.6, 102.7), 14.6],
  [rect(22.4, 78.6, 25.2, 87.5), 14.9],
  [rect(22.4, 87.4, 25.2, 100.5), 14.4],
  [rect(24.8, 90.0, 26.6, 100.5), 13.8],
  [rect(-13.6, 54.5, -11.2, 59.6), 14.27],
  [rect(-11.5, 58.9, -4.6, 59.9), 14.0],
  [rect(-3.8, 56.9, -1.0, 59.6), 14.4],
  [rect(-12.6, 97.5, -10.6, 102.2), 13.9],
  [rect(-3.5, 97.5, -2.5, 104.5), 13.6],
];

// ---------- Toren ----------
// Begane grond 1,5 m terug, daarboven 17 woonlagen van 3,2 m: per laag een vloerrand van 1,0 m die 0,8 m
// voor de glaswand uitsteekt, met een onderkant onder 45°; daarboven een dichte kroon van 5,3 m.
const STOREY = 3.2, LEDGE = 1.0, D = 0.8, GF_SET = 1.5, CROWN = 5.3, LAYERS = 17;
const ZT = z(TOWER_ROOF);
const C1 = ZT - CROWN - LAYERS * STOREY; // onderkant van de eerste vloerrand
const trect = (inset) => rect(TU0 + inset, TV0 + inset, TU1 - inset, TV1 - inset);
const at = (poly, h) => poly.map(([x, y]) => [x, y, h]);
const frustum = (outer, inner, zLow, zOut, zTop) => Manifold.hull([...at(outer, zOut), ...at(outer, zTop), ...at(inner, zLow), ...at(inner, zTop)]);
const towerParts = [prism(trect(GF_SET), BASE, C1 + LEDGE), prism(trect(D), C1 + LEDGE - 0.01, ZT - CROWN + 0.01)];
for (let k = 0; k < LAYERS; k++) {
  const c = C1 + k * STOREY, inset = k === 0 ? GF_SET : D;
  towerParts.push(frustum(trect(0), trect(inset), c - inset, c, c + LEDGE));
}
const C_CROWN = ZT - CROWN;
towerParts.push(frustum(trect(0), trect(D), C_CROWN - D, C_CROWN, ZT));
// Dakopbouwen
towerParts.push(
  prism(rect(-4.3, -11.5, 4.6, 15.3), ZT - 0.1, z(PLANT_TOP)),
  prism(rect(-3.2, -15.0, 3.0, -11.4), ZT - 0.1, z(PLANT_TOP)),
  prism(rect(-3.4, -5.0, -1.0, 1.0), z(PLANT_TOP) - 0.1, z(LIFT_TOP)),
  prism(rect(0.9, -7.0, 3.7, 2.2), z(PLANT_TOP) - 0.1, z(LIFT_TOP)),
  prism(rect(4.5, -1.7, 10.0, 4.7), ZT - 0.1, z(PLANT_E_TOP)),
  prism(rect(6.0, -15.5, 10.4, -11.3), ZT - 0.1, z(TENT_TOP)),
  prism(rect(0.9, 15.2, 2.9, 21.5), ZT - 0.1, z(PLANT_N_TOP)),
  prism(rect(1.4, -21.3, 2.4, -11.4), ZT - 0.1, z(SCREEN_TOP)),
);
// Glazen entreeluifel voor de zuidgevel (ortho: 10,8 × 5,5 m), als plaat van 1,5 m op twee kolommen.
const CAN_U0 = -5.1, CAN_U1 = 5.7, CAN_V0 = -30.2, CAN_TOP = 4.5;
towerParts.push(
  prism(rect(CAN_U0, CAN_V0, CAN_U1, TV0 + GF_SET + 0.5), CAN_TOP - 1.5, CAN_TOP),
  prism(rect(CAN_U0, CAN_V0, CAN_U0 + 0.9, CAN_V0 + 0.9), BASE, CAN_TOP - 1.45),
  prism(rect(CAN_U1 - 0.9, CAN_V0, CAN_U1, CAN_V0 + 0.9), BASE, CAN_TOP - 1.45),
);
const towerBody = union(towerParts);
// Kroon: venstersleuven als nissen van 0,9 m met een plafond onder 45° (oost- en westgevel twee lange sleuven,
// korte gevels één sleuf bij de oosthoek).
const SLOT_LO = ZT - 3.6, SLOT_HI = ZT - 1.1, SLOT_D = 0.9;
function niche(a, b, s0, s1, lo, hi, depth) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, dd, h) => [a[0] + d[0] * s - n[0] * dd, a[1] + d[1] * s - n[1] * dd, h];
  // Bovenkant van de opening aan de gevel = hi; het plafond loopt onder 45° naar binnen omlaag.
  return Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + 0.2), P(s1, -0.2, hi + 0.2), P(s0, depth, hi - depth), P(s1, depth, hi - depth)]);
}
const SW = [TU0, TV0], SE = [TU1, TV0], NE = [TU1, TV1], NW = [TU0, TV1];
const LT = TV1 - TV0, WT = TU1 - TU0;
const slotCuts = [];
for (const [s0, s1] of [[4.4, 21.0], [30.3, 43.9]]) {
  slotCuts.push(niche(SE, NE, s0, s1, SLOT_LO, SLOT_HI, SLOT_D)); // oostgevel, s vanaf het zuiden
  slotCuts.push(niche(NW, SW, LT - s1, LT - s0, SLOT_LO, SLOT_HI, SLOT_D)); // westgevel, gespiegeld
}
slotCuts.push(niche(SW, SE, WT - 7.5, WT - 2.0, SLOT_LO, SLOT_HI, SLOT_D)); // zuidgevel bij de oosthoek
slotCuts.push(niche(NE, NW, 2.0, 7.5, SLOT_LO, SLOT_HI, SLOT_D)); // noordgevel bij de oosthoek
const tower = towerBody.subtract(union(slotCuts));

// ---------- Laagbouw ----------
const ZD = z(DECK), ZR = z(NB_ROOF);
let nbBody = prism(NB, BASE, ZR).subtract(prism(COURT_W, ZD, 99)).subtract(prism(COURT_E, z(EC_LOW), 99));
nbBody = union([
  nbBody,
  prism(CORE, BASE, z(CORE_TOP)),
  prism(CORE_BUMP, BASE, z(CORE_TOP)),
  prism(CORE_PLANT, z(CORE_TOP) - 0.1, z(CORE_PLANT_TOP)),
  prism(EC_BLOCK_POLY, z(EC_LOW) - 0.1, z(EC_BLOCK)),
  prism(EC_SKY_POLY, z(EC_BLOCK) - 0.1, z(EC_SKY)),
  prism(PAVILION_POLY, ZD - 0.1, z(PAVILION)),
  ...NB_UNITS.map(([poly, top]) => prism(poly, ZR - 0.1, z(top))),
]);
// Gevels (foto's): terugliggende begane grond op kolommen tot NAP +3,3, een dichte band tot +4,7, twee lagen
// diepe vensternissen (travee 1,8 m, nis 0,9 m breed en 0,4 m diep) en een dichte attiek.
const NB_GF_TOP = z(3.3), NB_FLOORS = [[z(4.7), 3.0], [z(7.7), 2.9]];
const NICHE_D = 0.4, PITCH = 1.8, WIDTH = 0.9;
const nbCuts = [];
const exposed = (body, a, b, s, h) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const from = [a[0] + d[0] * s + n[0] * 3, a[1] + d[1] * s + n[1] * 3, h];
  const hit = body.rayCast(from, [a[0] + d[0] * s - n[0], a[1] + d[1] * s - n[1], h])[0];
  const dist = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return dist > 2.95 && dist < 3.05;
};
function windows(a, b, floors) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const bays = Math.floor((L - 0.9) / PITCH), w = (L - bays * PITCH) / 2;
  for (const [zf, fh] of floors) {
    const lo = zf + 0.5, hi = zf + fh - 0.35;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * PITCH + (PITCH - WIDTH) / 2, s1 = s0 + WIDTH;
      if ([s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi - 0.05].every((h) => exposed(nbBody, a, b, s, h)))) nbCuts.push(niche(a, b, s0, s1, lo, hi, NICHE_D));
    }
  }
}
function arcade(a, b) {
  // Begane grond: glaswand 1,2 m terug achter kolommen van 0,9 m op circa 7 m, plafond onder 45°.
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const k = Math.max(1, Math.round((L - 1.8) / 7.0)), bay = (L - 1.8 - (k - 1) * 0.9) / k;
  for (let i = 0; i < k; i++) {
    const s0 = 0.9 + i * (bay + 0.9);
    nbCuts.push(niche(a, b, s0, s0 + bay, ZD, NB_GF_TOP, 1.2));
  }
}
const ring = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
for (const [a, b] of ring(NB)) {
  arcade(a, b);
  windows(a, b, NB_FLOORS);
}
// Binnentuin (rand rechtsom, zodat de buitennormaal de tuin in wijst): vensters op alle drie de lagen.
for (const [a, b] of ring([...COURT_W].reverse())) windows(a, b, [[ZD, 3.0], ...NB_FLOORS]);
const lowBlock = nbBody.subtract(union(nbCuts));

const nodes = [
  ["building:leonardo-hotel-rembrandtpark-toren", tower],
  ["building:leonardo-hotel-rembrandtpark-laagbouw", lowBlock],
];
for (const [name, m] of nodes) {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "volume", Math.round(m.volume()));
}
console.log("sleuven", slotCuts.length, "nissen laagbouw", nbCuts.length, "eerste vloerrand op z", C1.toFixed(2));

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Leonardo Hotel Amsterdam Rembrandtpark",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 42.25, // NAP -0,75 + geoïde 43,00 (ijking B'Mine/Hotel Okura/Vivaldi: offset = geoïde ± 0,02)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0363100012148630"],
    description:
      "Het Rembrandtparkgebouw aan de Staalmeesterslaan (1972–1973), nu Leonardo Hotel Amsterdam Rembrandtpark en Hotelschool The Hague, als één BAG-pand: de hoteltoren van 25,5 × 48,8 m tot NAP +66,6 m met 17 doorlopende vloerranden die 0,8 m voor de glaswand steken (onderkant onder 45°), een terugliggende begane grond, een dichte kroon met venstersleuven, liftopbouwen tot +73,0 m en installaties; de laagbouw van drie lagen tot +12,03 m rond een binnentuin met een middenkern tot +16,45 m, een oostelijke binnenhof met lage daken, vensternissen per travee en een begane grond op kolommen. Het parkeerdek op +0,3 m ligt al in het PDOK-terrein en zit niet in het model. Hoogtes uit het AHN-DSM en de 3D BAG. Oorsprong in het hart van de toren, X-as langs de korte torengevels (0,66° op RD-oost). Verdiepingsindeling, vloerranddiepte, kroonsleuven (westgevel gespiegeld aangenomen), vensterraster van de laagbouw en de entreeluifel zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      deckNapM: DECK,
      towerRoofNapM: TOWER_ROOF,
      towerPlantNapM: PLANT_TOP,
      liftNapM: LIFT_TOP,
      towerFootprintM: [+(TU1 - TU0).toFixed(2), +(TV1 - TV0).toFixed(2)],
      towerStoreys: LAYERS,
      storeyHeightM: STOREY,
      ledgeProjectionM: D,
      crownHeightM: CROWN,
      lowBlockRoofNapM: NB_ROOF,
      lowBlockCoreNapM: CORE_TOP,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012148630 (bouwjaar 1972), actuele orthoHR, AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN5 2023)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam",
      "https://commons.wikimedia.org/wiki/File:Rembrandt_Park_Gebouw_Amsterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Ramada-hotel_Amsterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Rembrandtparkgebouw.jpg",
      "https://commons.wikimedia.org/wiki/File:Amsterdam_Campus_Hotelschool_The_Hague.jpg",
    ],
  },
});

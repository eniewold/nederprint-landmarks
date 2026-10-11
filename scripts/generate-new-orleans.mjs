// New Orleans (Otto Reuchlinweg / Antoine Platekade, Wilhelminapier,
// Rotterdam; Álvaro Siza, 2010): woontoren van 158,35 m met 45 lagen en een
// gevel van natuursteen. De toren is een vierkant blok van 30,1 x 28,4 m. Elke
// gevel is verdeeld in drie beuken met loggia's of vensterparen, twee
// terugliggende verticale sleuven met vensters en twee hoekzones met
// hoekloggia's. Bovenin verspringen die delen als een getrapte kroon: de
// hoekzones houden op op NAP +138,2, de sleuven op +141,5, de beuken op +151,5.
// Achter de middelste beuk staat een tussentrede (+154,8). De kern stijgt tot
// +158,3 met een dakrand van +159,6, en daarop staat een opbouw tot +161,8 met
// installaties tot +163,7. Tegen de zuidwesthoek van de toren staat de lagere
// schijf tot +41,7 met brede vensters. De bovenste twee lagen daarvan kragen
// naar het westen uit als een stenen 'snavel' met een terras onder een
// dakplaat. In hetzelfde BAG-pand ligt de lage stenen onderbouw van
// LantarenVenster en het parkeerdek: een glazen foyerstrook langs de Rijnhaven
// (+11,7), stenen massa's op +18,4 en +21,0, een hogere zaal op +22,35 en een
// terras aan de westkop (+15,2).
//
// Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen gestapelde
// DSM-lagen. Voorbeeld per rij: generate-evoluon.mjs (aanpak primitieven),
// generate-haagse-toren.mjs en generate-montevideo.mjs (skylinetorens op
// efteling-kit.mjs).
//
//   node scripts/generate-new-orleans.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong midden in de toren op RD (93112,96, 435563,81),
// z = 0 op NAP +3,5 m (kade, Otto Reuchlinweg en plein rondom: AHN-DTM +3,4
// tot +3,7; 3D BAG-maaiveld 3,50), Z omhoog. +X loopt op 36,5 graden in RD
// langs de lange gevels van het pand (BAG 36,3-36,6 graden), van de onderbouw
// naar de toren (noordoost); +Y wijst naar 126,5 graden (noordwest), naar de
// Otto Reuchlinweg en de Maas. De Rijnhaven ligt aan -Y.
//
// Bronnen: BAG-pand 0599100000753300 (toren, lagere schijf en onderbouw in één
// pand), AHN4 DSM/DTM 0,5 m (PDOK WCS, in dit stelsel uitgelezen: contour van
// de toren, de hoogtes van hoekzones, sleuven, beuken, tussentreden, kern en
// opbouw, en de daken van de onderbouw), 3D BAG LoD2.2 (TU Delft/3D
// geoinformatie, CC BY 4.0: dakhoogtes 138,2 / 141,5 / 151,5 / 154,8 / 158,3 /
// 161,8 en de lagere schijf tot 41,7), Actueel_orthoHR, Wikipedia (158,35 m,
// 45 lagen) en Commons-foto's van alle kanten.
import { Manifold, CrossSection, prism, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "new-orleans";
const ORIGIN = [93112.96, 435563.81];
const AXIS_DEG = 36.5;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.5;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP; AHN-DSM 0,5 m en 3D BAG LoD2.2) ----------
const H = {
  corner: 138.2, // hoekzones (AHN 138,2-138,8; 3D BAG 138,2)
  slot: 141.5, // sleuven tussen de beuken (AHN 141,5-142,0; 3D BAG 141,5)
  bay: 151.5, // beuken (AHN 151,5-152,6; 3D BAG 151,5)
  step: 154.8, // tussentrede achter de middelste beuk (AHN 154,6-155,9; 3D BAG 154,8)
  core: 158.3, // dak van de kern (AHN en 3D BAG 158,3)
  coreRim: 159.6, // dakrand van de kern (AHN 159,5-159,9; 3D BAG 159,6)
  pent: 161.8, // opbouw op de kern (AHN en 3D BAG 161,8; Wikipedia 158,35 m + 3,5)
  plant: 163.7, // installaties op de opbouw (AHN 163,4-163,8; 3D BAG 163,7)
  slab: 41.7, // lagere schijf tegen de zuidwesthoek (3D BAG 41,7)
  beak0: 34.6, // onderkant van de uitkragende snavel (foto's: twee lagen onder de dakplaat)
  terrace: 38.3, // vloer van het terras in de snavel
  beakRoof0: 40.8, // onderkant van de dakplaat boven het terras
  ground1: 7.9, // eerste verdieping van de toren (begane grond 4,4 m)
  storey: 3.26, // 44 lagen van +7,9 tot de beuken (+151,5)
  glassBox: 11.7, // glazen foyerstrook langs de Rijnhaven (AHN en 3D BAG 11,7)
  low: 18.4, // stenen onderbouw (AHN en 3D BAG 18,4)
  lowRaised: 20.0, // verhoogde daken van de onderbouw (AHN 19,8-20,0; 3D BAG 20,0)
  lowStrip: 21.0, // strook met daklichten aan de westkop (AHN 21,0-21,1; 3D BAG 21,0)
  hall: 22.35, // hogere zaal (AHN 22,3-22,5; 3D BAG 22,35)
  hallBlock: 25.1, // opbouw tussen zaal en toren (AHN 23,3-25,2; 3D BAG 25,1)
  westTerrace: 15.2, // terras aan de westkop (AHN en 3D BAG 15,2)
  westParapet: 16.0, // borstwering langs de westgevel (AHN 16,0)
};
const floorNap = (k) => H.ground1 + H.storey * k; // k = 0..43
const floors = (maxNap, minNap = H.ground1, sill = 0.9, head = 2.6) =>
  Array.from({ length: 46 }, (_, k) => [floorNap(k) + sill, floorNap(k) + head]).filter(([a, b]) => a >= minNap - 1e-6 && b <= maxNap + 1e-6);

// ---------- plattegrond van de toren (m, gebouwstelsel) ----------
// Buitenmaat uit de AHN-randen van de kroon (30,1 x 28,4 m; de BAG-contour is
// de begane grond, aan de noordkant 1,4 m terugliggend). Ring van 3,45 m (W/O)
// en 3,2 m (Z/N) rond de kern, per gevel: hoekzone, beuk, sleuf, middenbeuk,
// sleuf, beuk, hoekzone (AHN-profielen op 1 m achter de gevel).
const TX = 15.05;
const TY = 14.2;
const CX = 11.6; // kern
const CY = 11.0;
// Zuid- en noordgevel (langs x): beuken van 5,0 m, sleuven van 4,0 m, hoeken van 3,55 m.
const SN = { corner: 11.5, bays: [[-11.5, -6.5], [-2.5, 2.5], [6.5, 11.5]], slots: [[-6.5, -2.5], [2.5, 6.5]] };
// West- en oostgevel (langs y): beuken van 4,6 m, sleuven van 3,65 m, hoeken van 3,65 m.
const WE = { corner: 10.55, bays: [[-10.55, -5.95], [-2.3, 2.3], [5.95, 10.55]], slots: [[-5.95, -2.3], [2.3, 5.95]] };
// Tussentrede achter de middelste beuk: 3,6 m breed, 2,7 m diep in de kern.
const NOTCH_W = 1.8;
const NOTCH_D = 2.7;
const PENT = rectP(-6.35, -1.7, 7.05, 5.6); // opbouw (AHN u -1,7..11,7, v -0,4..6,9)
const PLANT = [rectP(-5.85, -0.9, -3.25, 4.3), rectP(-1.0, 0.9, 1.0, 2.1)];
// Lagere schijf: uitbouw van 2,0 m voor de zuidgevel (BAG-contour, x tot -5,85)
// en daarboven de snavel die 3,6 m voorbij de westgevel uitkraagt.
const SLAB = { x0: -TX, x1: -5.85, y0: -16.2, face1: -2.5 };
const BEAK = { x0: -18.65, y1: -10.3, terraceDepth: 1.2 };

// ---------- onderbouw (BAG-contour; hoogtes uit AHN en 3D BAG) ----------
const LOW = {
  west: -82.75, // westgevel (BAG u -78,1)
  south: -13.5, // stenen gevel achter de glazen strook (3D BAG v -12,2)
  glassSouth: -16.2, // glazen foyerstrook (BAG v -14,9)
  north: 14.5, // noordgevel (BAG v 15,8)
  northWest: 12.8, // noordgevel van de westkop (BAG v 14,1, tot u -72,1)
  northWestEnd: -76.75,
};

function rectP(x0, y0, x1, y1) {
  return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
}
const prismN = (poly, nap0, nap1) => prism(poly, nap0 === null ? BASE : z(nap0), z(nap1));
const boxN = (x0, y0, x1, y1, nap0, nap1) => prismN(rectP(x0, y0, x1, y1), nap0, nap1);
// Blinde nis (venster, loggia, sleuf) in een gevel van de toren: side S/N/W/E,
// face = coördinaat van het gevelvlak, s0..s1 langs de gevel, NAP-hoogtes,
// diepte in de gevel; de doos steekt 1 m naar buiten uit.
function cut(side, face, s0, s1, nap0, nap1, depth) {
  switch (side) {
    case "S": return boxN(s0, face - 1, s1, face + depth, nap0, nap1);
    case "N": return boxN(s0, face - depth, s1, face + 1, nap0, nap1);
    case "W": return boxN(face - 1, s0, face + depth, s1, nap0, nap1);
    case "E": return boxN(face - depth, s0, face + 1, s1, nap0, nap1);
  }
  throw Error(side);
}
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
// n vensters van breedte w gelijk verdeeld tussen s0 en s1.
const spread = (s0, s1, n, w) => range(n, (k) => s0 + ((s1 - s0) * (k + 0.5)) / n).map((c) => [c - w / 2, c + w / 2]);

// ---------- toren: schacht, ring, kern en opbouw ----------
const ringS = (x0, x1) => rectP(x0, -TY, x1, -CY);
const ringN = (x0, x1) => rectP(x0, CY, x1, TY);
const ringW = (y0, y1) => rectP(-TX, y0, -CX, y1);
const ringE = (y0, y1) => rectP(CX, y0, TX, y1);
const shaft = boxN(-TX, -TY, TX, TY, null, H.corner);
const slots = union([
  ...SN.slots.flatMap(([a, b]) => [prismN(ringS(a, b), H.corner - 0.1, H.slot), prismN(ringN(a, b), H.corner - 0.1, H.slot)]),
  ...WE.slots.flatMap(([a, b]) => [prismN(ringW(a, b), H.corner - 0.1, H.slot), prismN(ringE(a, b), H.corner - 0.1, H.slot)]),
]);
const bays = union([
  ...SN.bays.flatMap(([a, b]) => [prismN(ringS(a, b), H.corner - 0.1, H.bay), prismN(ringN(a, b), H.corner - 0.1, H.bay)]),
  ...WE.bays.flatMap(([a, b]) => [prismN(ringW(a, b), H.corner - 0.1, H.bay), prismN(ringE(a, b), H.corner - 0.1, H.bay)]),
]);
// Kern met vier inkepingen achter de middelste beuken; daarin de tussentrede.
const CORE = [
  [-CX, -CY], [-NOTCH_W, -CY], [-NOTCH_W, -CY + NOTCH_D], [NOTCH_W, -CY + NOTCH_D], [NOTCH_W, -CY],
  [CX, -CY], [CX, -NOTCH_W], [CX - NOTCH_D, -NOTCH_W], [CX - NOTCH_D, NOTCH_W], [CX, NOTCH_W],
  [CX, CY], [NOTCH_W, CY], [NOTCH_W, CY - NOTCH_D], [-NOTCH_W, CY - NOTCH_D], [-NOTCH_W, CY],
  [-CX, CY], [-CX, NOTCH_W], [-CX + NOTCH_D, NOTCH_W], [-CX + NOTCH_D, -NOTCH_W], [-CX, -NOTCH_W],
];
let core = prismN(CORE, H.corner - 0.1, H.coreRim);
core = core.subtract(prism(new CrossSection([ccw(CORE)]).offset(-0.9, "Miter").toPolygons()[0], z(H.core), z(H.coreRim) + 1));
const steps = union([
  boxN(-NOTCH_W, -CY - 0.05, NOTCH_W, -CY + NOTCH_D + 0.05, H.corner - 0.1, H.step),
  boxN(-NOTCH_W, CY - NOTCH_D - 0.05, NOTCH_W, CY + 0.05, H.corner - 0.1, H.step),
  boxN(-CX - 0.05, -NOTCH_W, -CX + NOTCH_D + 0.05, NOTCH_W, H.corner - 0.1, H.step),
  boxN(CX - NOTCH_D - 0.05, -NOTCH_W, CX + 0.05, NOTCH_W, H.corner - 0.1, H.step),
]);
let pent = prismN(PENT, H.core - 0.1, H.pent);
const plant = union(PLANT.map((p, i) => prismN(p, H.pent - 0.1, i === 0 ? H.plant : 163.3)));

// ---------- lagere schijf met snavel ----------
let slab = boxN(SLAB.x0, SLAB.y0, SLAB.x1, -TY + 0.05, null, H.slab);
let beak = boxN(BEAK.x0, SLAB.y0, -TX + 0.05, BEAK.y1, H.beak0, H.slab);

// ---------- gevelreliëf van de toren ----------
const NICHE = 0.35;
const LOGGIA = 0.45;
const SLOT_DEPTH = 0.45;
const towerCuts = [];
// Per gevel: [zijde, gevelcoördinaat, indeling]. In de lagere schijf (zuidgevel
// x < -2,5 en westgevel y < -10,55, onder +41,7) geen sleuven of loggia's.
const inSlab = (side, s0, s1) => (side === "S" && s1 <= SLAB.face1 + 0.01) || (side === "W" && s1 <= -WE.corner + 0.01);
const loggiaRows = (top) => floors(top - 0.3, H.ground1, 0.45, 2.85);
const windowRows = (top) => floors(top - 0.3);
for (const [side, face, L] of [["S", -TY, SN], ["N", TY, SN], ["W", -TX, WE], ["E", TX, WE]]) {
  const half = side === "S" || side === "N" ? TX : TY;
  const minNap = (s0, s1) => (inSlab(side, s0, s1) ? H.slab + 0.3 : H.ground1);
  // Sleuven: doorlopende groef van 0,45 m tot de bovenkant, met een venster per laag.
  for (const [a, b] of L.slots) {
    const nap0 = inSlab(side, a, b) ? H.slab : H.ground1 - 0.4;
    towerCuts.push(cut(side, face, a, b, nap0, H.slot + 1, SLOT_DEPTH));
    for (const [r0, r1] of windowRows(H.slot).filter(([r]) => r >= minNap(a, b))) {
      const c = (a + b) / 2;
      towerCuts.push(cut(side, face, c - 0.9, c + 0.9, r0, r1, SLOT_DEPTH + NICHE));
    }
  }
  // Buitenste beuken: per laag een loggia van 3,2-3,4 m; middenbeuk: vensterpaar.
  L.bays.forEach(([a, b], i) => {
    const rows = i === 1 ? windowRows(H.bay) : loggiaRows(H.bay);
    for (const [r0, r1] of rows.filter(([r]) => r >= minNap(a, b))) {
      if (i === 1) for (const [s0, s1] of spread(a + 0.3, b - 0.3, 2, 1.6)) towerCuts.push(cut(side, face, s0, s1, r0, r1, NICHE));
      else towerCuts.push(cut(side, face, a + 0.8, b - 0.8, r0, r1, LOGGIA));
    }
  });
  // Hoekzones: loggia om de hoek (2,4 m op elke gevel), elke laag.
  for (const sign of [-1, 1]) {
    const s0 = sign < 0 ? -half : half - 2.4;
    const s1 = sign < 0 ? -half + 2.4 : half;
    for (const [r0, r1] of loggiaRows(H.corner).filter(([r]) => r >= minNap(s0, s1))) towerCuts.push(cut(side, face, s0 - (sign < 0 ? 1 : 0), s1 + (sign > 0 ? 1 : 0), r0, r1, LOGGIA));
  }
  // Glazen begane grond (lobby): 0,4 m, aan de noordkant 1,4 m terug (BAG-contour).
  const lobbyDepth = side === "N" ? 1.4 : 0.4;
  const [g0, g1] = side === "S" ? [SLAB.face1, half] : side === "W" ? [-WE.corner, half] : side === "N" ? [-13.6, half] : [-half, half];
  towerCuts.push(cut(side, face, g0, g1, GROUND_NAP - 0.05, H.ground1 - 0.4, lobbyDepth));
}
// Vensters in de kern boven de ring: boven de hoekzones, sleuven en beuken.
const coreFace = [["S", -CY], ["N", CY], ["W", -CX], ["E", CX]];
for (const [side, face] of coreFace) {
  const L = side === "S" || side === "N" ? SN : WE;
  const half = side === "S" || side === "N" ? CX : CY;
  const zones = [
    [-half + 0.4, -L.corner + 0.1, H.corner],
    [L.corner - 0.1, half - 0.4, H.corner],
    ...L.slots.map(([a, b]) => [a + 0.3, b - 0.3, H.slot]),
    [L.bays[0][0] + 0.6, L.bays[0][1] - 0.6, H.bay],
    [L.bays[2][0] + 0.6, L.bays[2][1] - 0.6, H.bay],
  ];
  for (const [a, b, top] of zones) {
    if (b - a < 1) continue;
    for (const [r0, r1] of floors(H.core - 0.5, top + 0.5, 0.6, 2.7)) {
      for (const [s0, s1] of spread(a, b, b - a > 3.2 ? 2 : 1, Math.min(1.4, b - a - 0.4))) towerCuts.push(cut(side, face, s0, s1, r0, r1, NICHE));
    }
  }
}
// Tussentreden: een hoog venster in de kopgevel.
for (const [side, face] of [["S", -CY], ["N", CY], ["W", -CX], ["E", CX]]) towerCuts.push(cut(side, face, -0.8, 0.8, H.bay + 0.4, H.step - 0.6, NICHE));
// Opbouw: vensterband.
{
  const [x0, y0] = PENT[0];
  const [x1, y1] = PENT[2];
  const pentCuts = [
    ...spread(x0 + 0.6, x1 - 0.6, 5, 1.6).flatMap(([a, b]) => [cut("S", y0, a, b, H.core + 0.5, H.pent - 0.9, NICHE), cut("N", y1, a, b, H.core + 0.5, H.pent - 0.9, NICHE)]),
    ...spread(y0 + 0.6, y1 - 0.6, 3, 1.6).flatMap(([a, b]) => [cut("W", x0, a, b, H.core + 0.5, H.pent - 0.9, NICHE), cut("E", x1, a, b, H.core + 0.5, H.pent - 0.9, NICHE)]),
  ];
  pent = pent.subtract(union(pentCuts));
}

// Lagere schijf: brede vensters, glazen begane grond; snavel met terras onder de dakplaat.
{
  const cuts = [];
  const rows = windowRows(H.slab).filter(([r]) => r < H.beak0 - 0.2);
  for (const [r0, r1] of rows) {
    for (const [a, b] of spread(SLAB.x0 + 0.6, SLAB.x1 - 0.6, 3, 2.0)) cuts.push(cut("S", SLAB.y0, a, b, r0, r1, NICHE));
    for (const [a, b] of spread(SLAB.x1 + 0.4, SLAB.face1 - 0.4, 2, 1.8)) cuts.push(cut("S", -TY, a, b, r0, r1, NICHE));
    for (const [a, b] of spread(-TY + 0.4, -WE.corner - 0.4, 1, 1.8)) cuts.push(cut("W", -TX, a, b, r0, r1, NICHE));
    cuts.push(cut("W", -TX, SLAB.y0 + 0.4, -TY - 0.3, r0, r1, NICHE));
  }
  // Bovenste laag onder de snavel (geen terras ernaast): vensters op +35,3.
  for (const [a, b] of spread(SLAB.x0 + 0.6, SLAB.x1 - 0.6, 3, 2.0)) cuts.push(cut("S", SLAB.y0, a, b, H.beak0 + 0.6, H.terrace - 0.6, NICHE));
  cuts.push(cut("S", SLAB.y0, SLAB.x0 + 0.4, SLAB.x1 - 0.4, GROUND_NAP - 0.05, H.ground1 - 0.4, 0.4));
  // Terras in de snavel: open naar het zuiden en westen, 1,2 m diep onder de dakplaat.
  const d = BEAK.terraceDepth;
  cuts.push(boxN(BEAK.x0 - 1, SLAB.y0 - 1, SLAB.x1 - 0.6, SLAB.y0 + d, H.terrace, H.beakRoof0));
  cuts.push(boxN(BEAK.x0 - 1, SLAB.y0 - 1, BEAK.x0 + d, BEAK.y1 - 1.0, H.terrace, H.beakRoof0));
  // Vensters in de kop van de snavel (onder het terras) en in de westgevel.
  cuts.push(cut("W", BEAK.x0, SLAB.y0 + 0.8, BEAK.y1 - 0.8, H.beak0 + 0.6, H.terrace - 0.6, NICHE));
  slab = slab.subtract(union(cuts));
  beak = beak.subtract(union(cuts));
}

// ---------- onderbouw ----------
const lowNorthPoly = [
  [LOW.west, LOW.south], [-TX + 0.05, LOW.south], [-TX + 0.05, LOW.north], [LOW.northWestEnd, LOW.north],
  [LOW.northWestEnd, LOW.northWest], [LOW.west, LOW.northWest],
];
let low = prismN(lowNorthPoly, null, H.low);
// Westkop: terras op +15,2 achter een borstwering van 0,9 m; daklichtstroken op +21,0.
low = low.subtract(boxN(LOW.west - 1, -9.6, LOW.northWestEnd, 10.0, H.westTerrace, H.low + 1));
low = low.add(boxN(LOW.west, -9.6, LOW.west + 0.9, 10.0, H.westTerrace - 0.1, H.westParapet));
const lowStrips = union([
  boxN(LOW.west, LOW.south, -63.15, -9.6, H.low - 0.1, H.lowStrip),
  prismN([[LOW.west, 10.0], [-63.15, 10.0], [-63.15, LOW.north], [LOW.northWestEnd, LOW.north], [LOW.northWestEnd, LOW.northWest], [LOW.west, LOW.northWest]], H.low - 0.1, H.lowStrip),
]);
const lowRaised = union([
  boxN(-76.6, 7.3, -68.65, 10.0, H.low - 0.1, H.lowRaised),
  boxN(-76.6, -9.3, -68.95, -6.1, H.low - 0.1, H.lowRaised),
  boxN(-62.65, 1.7, -51.15, 7.7, H.low - 0.1, H.lowRaised),
  boxN(-56.65, -7.8, -50.15, -2.3, H.low - 0.1, H.lowRaised),
]);
let hall = boxN(-42.95, -10.3, -18.35, 10.9, H.low - 0.1, H.hall);
const hallBlock = boxN(-18.35, -1.3, -TX + 0.05, 2.3, H.low - 0.1, H.hallBlock);
let glassBox = boxN(LOW.west, LOW.glassSouth, -TX + 0.05, LOW.south + 0.05, null, H.glassBox);
{
  // Glazen foyerstrook: vakken van 2,6 m tussen stijlen van 0,4 m, dakrand van 1 m.
  const cuts = [];
  for (const [a, b] of spread(LOW.west + 0.4, -TX - 0.4, 23, 2.6)) cuts.push(cut("S", LOW.glassSouth, a, b, GROUND_NAP - 0.05, H.glassBox - 1.0, 0.4));
  for (const [a, b] of spread(LOW.glassSouth + 0.4, LOW.south - 0.4, 1, 1.8)) cuts.push(cut("W", LOW.west, a, b, GROUND_NAP - 0.05, H.glassBox - 1.0, 0.4));
  glassBox = glassBox.subtract(union(cuts));
  // Stenen gevels: een vensterband in de zuidgevel boven de glazen strook, de
  // glazen entree van LantarenVenster in de noordgevel, de parkeeringang en
  // een hoog venster in de westgevel, een vensterband in de zaal.
  const lc = [];
  for (const [a, b] of spread(-63, -44, 6, 2.2)) lc.push(cut("S", LOW.south, a, b, 14.3, 15.9, NICHE));
  for (const [a, b] of spread(-42.5, -18.8, 7, 2.2)) lc.push(cut("S", LOW.south, a, b, 14.3, 15.9, NICHE));
  for (const [a, b] of spread(-76.4, -16.0, 22, 2.3)) lc.push(cut("N", LOW.north, a, b, GROUND_NAP - 0.05, 9.4, 0.4));
  for (const [a, b] of spread(-76.4, -16.0, 12, 2.4)) lc.push(cut("N", LOW.north, a, b, 12.6, 14.4, NICHE));
  lc.push(cut("W", LOW.west, -4.0, 4.0, GROUND_NAP - 0.05, 7.0, 1.0));
  lc.push(cut("W", LOW.west, 6.0, 7.4, 9.0, 13.8, NICHE));
  low = low.subtract(union(lc));
  hall = hall.subtract(union([
    ...spread(-42.5, -18.8, 8, 2.0).map(([a, b]) => cut("S", -10.3, a, b, 19.6, 21.4, NICHE)),
    ...spread(-42.5, -18.8, 8, 2.0).map(([a, b]) => cut("N", 10.9, a, b, 19.6, 21.4, NICHE)),
  ]));
}

// ---------- samenvoegen ----------
let tower = union([shaft, slots, bays, core, steps]).subtract(union(towerCuts));
const parts = { tower, pent, plant, slab, beak, low, lowStrips, lowRaised, hall, hallBlock, glassBox };
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts));
// Nissen die een ander bouwdeel afdekt, worden ingesloten holtes: die vallen weg.
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:New Orleans met getrapte kroon lagere schijf met snavel en onderbouw van LantarenVenster", model]],
  catalog: {
    name: "New Orleans",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Kade aan de Rijnhaven (AHN-DTM +3,45), Otto Reuchlinweg (+3,5), plein aan
    // de westkop (+3,6) en de straat oostelijk van de toren (+3,6).
    groundSamplePoints: [[0, -20], [-45, -20], [0, 19], [-45, 19], [-88, 0], [20, 0]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000753300"],
    description:
      "Oorsprong midden in de toren op maaiveld NAP +3,5 m, +X op 36,5 graden in RD (langs de lange gevels, van de onderbouw naar de toren), +Y naar de Otto Reuchlinweg en de Maas; vierkante toren van 30,1 x 28,4 m met per gevel drie beuken (loggia's en vensterparen), twee terugliggende sleuven en hoekloggia's, getrapte kroon met hoekzones tot +138,2, sleuven tot +141,5, beuken tot +151,5, tussentreden tot +154,8, kern tot +158,3 (rand +159,6) en opbouw tot +161,8 met installaties tot +163,7; lagere schijf tot +41,7 tegen de zuidwesthoek met een uitkragende snavel en terras; onderbouw van LantarenVenster met glazen foyerstrook (+11,7), stenen massa's (+18,4 en +21,0), zaal (+22,35) en terras aan de westkop (+15,2); gevelritme, snavel en vensters uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      towerSizeM: [2 * TX, 2 * TY],
      cornerTopNapM: H.corner,
      slotTopNapM: H.slot,
      bayTopNapM: H.bay,
      stepTopNapM: H.step,
      coreRoofNapM: H.core,
      coreRimNapM: H.coreRim,
      penthouseNapM: H.pent,
      plantTopNapM: H.plant,
      slabTopNapM: H.slab,
      beakNapM: [H.beak0, H.terrace, H.slab],
      beakCantileverM: +(-TX - BEAK.x0).toFixed(2),
      podiumNapM: { glassBox: H.glassBox, stone: H.low, raised: H.lowRaised, strips: H.lowStrip, hall: H.hall, block: H.hallBlock, westTerrace: H.westTerrace },
      storeyPitchM: H.storey,
      axisDegrees: AXIS_DEG,
      estimates: [
        "verdeling van elke gevel in hoekzone, beuk, sleuf, middenbeuk, sleuf, beuk en hoekzone uit de AHN-profielen van de kroon; aangenomen dat die verdeling van de grond tot de kroon doorloopt (foto's)",
        "gevelritme uit foto's: 44 lagen van 3,26 m boven een begane grond van 4,4 m; loggia's in de buitenste beuken en hoekzones, vensterparen in de middenbeuk, een venster per laag in de sleuven (groef van 0,45 m)",
        "lagere schijf: uitbouw volgens de BAG-contour (2,0 m voor de zuidgevel), hoogte 41,7 uit de 3D BAG, gevel met brede vensters tot x = -2,5 (hoekzone, beuk en sleuf) uit foto's vanaf de Rijnhaven",
        "snavel: 3,6 m uitkraging voorbij de westgevel (begrensd door het AHN, dat erachter de zaal op +22,35 ziet), onderkant +34,6, terras van 1,2 m diep onder de dakplaat; uit foto's geschat",
        "onderbouw: dakhoogtes en -vlakken uit het AHN en de 3D BAG; vensters, de glazen entree aan de noordgevel en de parkeeringang aan de westgevel uit foto's geschat",
      ],
    },
    sources: [
      "PDOK BAG pand 0599100000753300, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000753300 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes van kroon, kern en opbouw, de lagere schijf en de onderbouw",
      "https://nl.wikipedia.org/wiki/New_Orleans_(gebouw)",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_New_Orleans.jpg",
      "https://commons.wikimedia.org/wiki/File:GraphyArchy_-_Wikipedia_00317.jpg",
      "https://commons.wikimedia.org/wiki/File:New_Orleans_2010.JPG",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_New_Orleans_(3).jpg",
      "https://commons.wikimedia.org/wiki/File:GraphyArchy_-_Wikipedia_00031.jpg",
      "https://commons.wikimedia.org/wiki/File:Kop_van_Zuid,_Rotterdam,_Netherlands_-_panoramio_(14).jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_New_Orleans_Tower_1_(cropped).jpg",
      "https://commons.wikimedia.org/wiki/File:Architecture_in_Rotterdam_(28384615199).jpg",
      "https://commons.wikimedia.org/wiki/File:%27New_Orleans%27_Rotterdam_(7657650598).jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_New_Orleans_in_Rotterdam.jpg",
    ],
  },
});

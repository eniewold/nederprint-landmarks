// 100Hoog (Wijnhaven / Posthoornstraat / Wijnstraat, Rotterdam; Klunder
// Architecten, 2011-2013, aannemer BAM), woontoren van 33 lagen en 105,5 m met
// 152 appartementen, een inpandige parkeergarage en winkels. Het gebouw is één
// BAG-pand van 84,6 x 42,6 m en bestaat uit:
// - de toren (30 x 24 m) aan de westkant, op de hoek met de Posthoornstraat:
//   bakstenen west-, noord- en oostgevels met gestaffelde vensters, een zuidgevel
//   naar de Wijnhaven met een wit raster van vloerbanden en kolommen, loggia's
//   en glas; het westelijke deel van de zuidgevel staat 2,8 m vóór de rest en
//   eindigt drie lagen onder het dak, net als een strook van 2,5 m langs de
//   westgevel; op de noordwest- en noordoosthoek een open inkeping vanaf de
//   onderbouw met hoekloggia's; het dak op +105,8 met borstweringen, een hoger
//   oostdeel en een installatieopbouw tot +108,5;
// - de onderbouw van de toren tot +25,5: baksteen met vensterbanden, een
//   dubbelhoge hoekloggia aan de Wijnhaven en een open hoek aan de Wijnstraat;
// - het lage blok langs de Wijnhaven (tot +28,6): winkels op de begane grond,
//   twee parkeerlagen achter baksteen, vier woonlagen in een wit raster met
//   loggia's en een teruggelegen bovenste laag onder uitkragende dakplaten, met
//   vier dakterrassen aan de kade;
// - de parkeergarage daarachter met een dakhof op +13,9 en een hoger dek op
//   +16,5 aan de Wijnstraat.
// Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen gestapelde
// DSM-lagen. Voorbeelden: generate-evoluon.mjs (aanpak primitieven),
// generate-vestedatoren.mjs en generate-westpoint-tilburg.mjs (woontorens met
// gevelnissen op efteling-kit.mjs).
//
//   node scripts/generate-100hoog.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: (u, v) vanaf de zuidwesthoek van het BAG-pand op RD
// (92946,32, 436932,89); +u loopt op 17,83 graden in RD langs de Wijnhaven
// (oost), +v op 107,83 graden naar de Wijnstraat (noord); de Posthoornstraat
// ligt aan -u. z = 0 op NAP +3,3 m (Posthoornstraat en Wijnstraat, AHN-DTM
// +3,3..+3,4). Het model wordt aan het eind verschoven naar het hart van de
// toren (u 15, v 30): oorsprong RD (92951,41, 436966,04).
//
// Bronnen: BAG-pand 0599100100004790 (bouwjaar 2013): voetafdruk, gevels op
// 17,83 en 107,83 graden, de licht schuine noordgevel; AHN5 DSM 0,5 m (opname
// 2023, ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm): dak +105,8, randen
// +106,45, oostdeel +106,4, installaties +108,5, de trappen +96,5, +99,2 en
// +105,3, de inkepingen op +25,5, het blok aan de kade +28,6 met terrassen op
// +25,5, de dakhof +13,9 en het dek +16,5; AHN4 DSM/DTM 0,5 m (PDOK WCS) voor
// het maaiveld en de hoekloggia's (platen tot +92); de PDOK-gebouwtegel (LoD2.2)
// ter controle; nl.wikipedia (33 lagen, 105,5 m, Klunder, 2013). Lagen,
// vensters, raster, loggia's en dakplaten uit Commons-foto's.
import { CrossSection, Manifold, prism, union, ccw, rect, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "100hoog";
const ORIGIN = [92951.41, 436966.04];
const AXIS_DEG = 17.83;
const RAD = (AXIS_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const HEART = [15, 30]; // (u, v) van de oorsprong
const GROUND_NAP = 3.3;
const BASE = -1.0; // NAP +2,3, onder de kade aan de Wijnhaven (+2,45..+3,2)
const z = (nap) => +(nap - GROUND_NAP).toFixed(3);

// ---------- hoogtes (NAP) ----------
const H = {
  roof: 105.8, // dak van de toren (AHN5 105,7..105,9)
  rim: 106.45, // borstwering rondom (AHN5 106,3..106,6)
  eastHigh: 106.4, // zuidelijk deel van het oostblok (AHN5 106,3..106,4)
  plant: 108.5, // installatieopbouw (AHN5 108,3..108,7)
  westHigh: 105.3, // zuidwestdeel van het dak (AHN5 105,2..105,4)
  westTerrace: 99.2, // terras langs de westgevel (AHN5 99,1..99,2)
  step: 96.5, // voorste zuidgevel en weststrook (AHN5 96,4..96,8)
  podium: 25.5, // onderbouw van de toren, inkepingen en kadeterrassen (AHN5 25,4..25,7)
  podiumNE: 22.8, // lagere noordrand onder de noordoostinkeping (AHN5 22,3..23,8)
  block: 28.6, // dakplaten van het blok aan de kade (AHN5 28,5..28,7)
  blockSlab: 27.9, // onderkant van die dakplaten (foto's)
  liftHouse: 30.4, // opbouw aan de oostkant (AHN5 30,3; PDOK 30,4)
  court: 13.9, // dakhof op de garage (AHN5 13,4..14,0)
  deck: 16.5, // hoger dek aan de Wijnstraat (AHN5 16,5..16,6)
  ground: 3.3,
  shop: 7.8, // bovenkant winkellaag (foto's)
  park2: 10.85, // tweede parkeerlaag
  loggiaNE: 90.33, // plafond van de bovenste hoekloggia noordoost (AHN4 ziet daar platen tot +91,8..+92,5)
  loggiaNW: 71.81, // plafond van de bovenste hoekloggia noordwest (foto's: ca. tien lagen onder het dak)
  arcade: 10.85, // open hoek aan de Wijnstraat onder de onderbouw (geschat)
};
const T_STOREYS = 23; // woonlagen van +25,5 tot +96,5
const T_STOREY = (H.step - H.podium) / T_STOREYS; // 3,087 m
const A_STOREY = (H.podium - H.court) / 4; // 2,9 m: vier woonlagen in het blok aan de kade
const SLAB = 0.9; // vloerband/witte rasterbalk (dikker dan in het echt, printbaar op 1:1000)

const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
const P = (pts, n0, n1) => prism(pts, z(n0), z(n1)); // prisma tussen twee NAP-hoogtes
const B = (u0, v0, u1, v1, n0, n1) => P(rect(u0, v0, u1, v1), n0, n1);
const towerFloors = range(T_STOREYS, (k) => H.podium + T_STOREY * k); // +25,5 .. +93,4
const topFloors = [H.step, H.step + T_STOREY, H.step + 2 * T_STOREY]; // drie lagen boven de trap
const blockFloors = range(4, (k) => H.court + A_STOREY * k);

// ---------- plattegrond (BAG) ----------
// Noordgevel licht schuin: v = 42,64 - 0,04478 (u - 5,41).
const nv = (u) => +(42.64 - 0.04478 * (u - 5.41)).toFixed(3);
const FOOT = [[0, 0], [84.62, 0], [84.66, 20.03], [50.31, 20.27], [50.31, 40.61], [36.56, 41.23], [18.81, 42.04], [5.41, 42.64], [5.45, 40.54], [0, 40.54]];
const U_STEP = 19.5; // einde van de voorste zuidgevel
const V_FRONT = 17.7; // voorste zuidgevel
const V_SOUTH = 20.5; // achterste zuidgevel en het hoofdvolume
const U_EAST = 30.0; // oostgevel van de toren
const U_MAIN = 24.5; // oostgrens van het hoofdvolume (borstwering)
const V_NE = 35.5; // noordgevel van het oostblok in de inkeping
const U_W = 2.5; // weststrook tot +96,5
const U_W2 = 5.41; // westgrens van het hoofdvolume (terras +99,2 ertussen)
const V_W = 40.54; // noordgevel van de weststrook (inkeping noordwest)
const V_BLOCK = 15.3; // noordgevel van het blok aan de kade
const U_BRICK = 9.0; // bakstenen westdeel van de onderbouw over de hele diepte

// ---------- vlak-nissen ----------
// Een gevel is een lijn p + s d met buitennormaal n; een nis loopt van s0 tot
// s1, `depth` diep, tussen twee NAP-hoogtes, en steekt 0,5 m buiten de gevel.
const face = (p, q) => {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const d = [(q[0] - p[0]) / L, (q[1] - p[1]) / L];
  return { p, d, n: [d[1], -d[0]], L }; // rechts van de looprichting = buiten bij linksom
};
const niche = (f, s0, s1, depth, n0, n1) =>
  Manifold.hull([z(n0), z(n1)].flatMap((zz) => [[s0, -depth], [s1, -depth], [s1, 0.5], [s0, 0.5]].map(([s, t]) => [f.p[0] + s * f.d[0] + t * f.n[0], f.p[1] + s * f.d[1] + t * f.n[1], zz])));

const faceOff = (f, t) => ({ ...f, p: [f.p[0] + t * f.n[0], f.p[1] + t * f.n[1]] });
const F = {
  west: face([0, V_W], [0, 0]),
  plinthS: face([0, 0], [84.62, 0]),
  front: face([0, V_FRONT], [U_STEP, V_FRONT]),
  south: face([U_W, V_SOUTH], [U_EAST, V_SOUTH]),
  east: face([U_EAST, V_SOUTH], [U_EAST, nv(U_EAST)]),
  north: face([U_EAST, nv(U_EAST)], [U_W2, nv(U_W2)]),
  courtN: face([77.0, V_BLOCK], [U_BRICK, V_BLOCK]),
  blockE: face([84.62, 0], [84.66, 20.03]),
};
const cuts = [];

// ---------- parkeergarage (BAG-voetafdruk) ----------
const garage = P(FOOT, GROUND_NAP + BASE, H.court);
// Hoger dek aan de Wijnstraat, oostelijk van de toren.
const deck = P([[U_EAST - 0.05, 26.5], [50.31, 26.5], [50.31, 40.61], [36.56, 41.23], [U_EAST - 0.05, nv(U_EAST - 0.05)]], H.court - 0.1, H.deck);

// ---------- blok aan de kade ----------
// Vier woonlagen tot +25,5 over u 9..84,6, v 0..15,3 (oosteinde tot v 20).
const BLOCK = [[U_BRICK, 0], [84.62, 0], [84.66, 20.03], [77.0, 20.07], [77.0, V_BLOCK], [U_BRICK, V_BLOCK]];
const block = P(BLOCK, H.court - 0.1, H.podium);
// Bovenste laag: gevel 0,4 m terug, bij de vier terrassen 4,0 m terug (AHN5
// +25,5 tot v 3,25); dakplaten 0,7 m dik die 1,0 m uitkragen.
const TERRACES = [[U_BRICK, 17.5], [30.0, 37.5], [50.0, 57.5], [70.0, 75.0]];
const topOutline = (front, back) => {
  const pts = [[U_BRICK, back]];
  let u = U_BRICK;
  for (const [a, b] of TERRACES) {
    if (a > u) pts.push([u, front], [a, front]);
    pts.push([a, back], [b, back]);
    u = b;
  }
  pts.push([u, front], [84.62, front], [84.66, 20.03], [77.0, 20.07], [77.0, V_BLOCK], [U_BRICK, V_BLOCK]);
  // eerste punt (u 9, back) ligt al in een terras; dubbele punten weg
  return pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
};
const topFloor = P(topOutline(0.4, 4.0), H.podium - 0.1, H.blockSlab + 0.05);
const roofSlabs = P(topOutline(-0.6, 3.0), H.blockSlab, H.block);
const liftHouse = B(81.0, 13.5, 84.6, 17.0, H.block - 0.1, H.liftHouse);

// ---------- onderbouw van de toren (tot +25,5) ----------
const PODIUM = [[0, 0], [U_BRICK, 0], [U_BRICK, V_FRONT], [U_STEP, V_FRONT], [U_STEP, V_SOUTH], [U_EAST, V_SOUTH], [U_EAST, nv(U_EAST)], [U_W2, nv(U_W2)], [U_W2, V_W], [0, V_W]];
const podium = P(PODIUM, GROUND_NAP + BASE, H.podium);
// Open hoek aan de Wijnstraat (buiten de BAG-voetafdruk), daarboven de onderbouw.
const nwCorner = P([[0, V_W - 0.05], [U_W2, V_W - 0.05], [U_W2, nv(U_W2)], [0, nv(0) - 0.24]], H.arcade, H.podium);
// Noordrand onder de noordoostinkeping op +22,8, met een balkonzone van 1,2 m
// voor de gevel (u 17..28,5).
cuts.push(P([[U_MAIN, V_NE + 5.1], [U_EAST + 1, V_NE + 5.1], [U_EAST + 1, nv(U_EAST) + 1], [U_MAIN, nv(U_MAIN) + 1]], H.podiumNE, H.podium + 1));
const northBalconies = P([[17.0, nv(17.0) - 0.1], [28.5, nv(28.5) - 0.1], [28.5, nv(28.5) + 1.2], [17.0, nv(17.0) + 1.2]], GROUND_NAP + BASE, H.podiumNE);

// ---------- toren boven de onderbouw ----------
const front = P([[0, V_FRONT], [U_STEP, V_FRONT], [U_STEP, V_SOUTH + 0.05], [U_W, V_SOUTH + 0.05], [U_W, V_W], [0, V_W]], H.podium - 0.1, H.step);
const westHigh = B(U_W - 0.05, V_SOUTH, U_W2 + 0.05, 28.5, H.podium - 0.1, H.westHigh);
const westTerrace = B(U_W - 0.05, 28.5, U_W2 + 0.05, V_W, H.podium - 0.1, H.westTerrace);
const MAIN = [[U_W2, V_SOUTH], [U_MAIN, V_SOUTH], [U_MAIN, nv(U_MAIN)], [U_W2, nv(U_W2)]];
const main = P(MAIN, H.podium - 0.1, H.roof);
const EASTB = rect(U_MAIN - 0.05, V_SOUTH, U_EAST, V_NE);
const eastBlock = P(EASTB, H.podium - 0.1, H.roof);
const eastHigh = B(U_MAIN - 0.05, V_SOUTH, U_EAST, 26.5, H.roof - 0.1, H.eastHigh);
// Borstweringen 0,6 m breed rond het hoofdvolume en het oostblok.
const ring = (poly) => new CrossSection([ccw(poly)]).subtract(new CrossSection([ccw(poly)]).offset(-0.6, "Miter"));
const parapets = union([
  Manifold.extrude(ring(MAIN), z(H.rim) - z(H.roof) + 0.1).translate([0, 0, z(H.roof) - 0.1]),
  Manifold.extrude(ring(EASTB), z(H.rim) - z(H.roof) + 0.1).translate([0, 0, z(H.roof) - 0.1]),
]);
const plant = B(7.0, 29.5, 15.5, 35.5, H.roof - 0.1, H.plant);

// ---------- gevels van de toren ----------
// Zuidgevel voor (v 17,7): wit raster met kolommen van 0,9 m op u 0, 6,3,
// 12,6 en 18,6; per laag loggia's van 1,2 m in de buitenste traveeën en glas
// 0,4 m in de middelste, tussen vloerbanden van 0,9 m.
const FRONT_BAYS = [[0.9, 6.3, 1.2], [7.2, 12.6, 0.4], [13.5, 18.6, 1.2]];
for (const f of towerFloors) for (const [s0, s1, d] of FRONT_BAYS) cuts.push(niche(F.front, s0, s1, d, f + SLAB, f + T_STOREY));
// Achterste zuidgevel (v 20,5): twee traveeën naast de trap, vanaf de dakhof
// (vier lagen van 2,9 m) en daarboven per torenlaag; loggia 1,2 m en glas 0,4 m.
const BACK_BAYS = [[U_STEP + 0.9 - U_W, 24.6 - U_W, 1.2], [25.4 - U_W, U_EAST - 0.9 - U_W, 0.4]];
for (const f of [...blockFloors, ...towerFloors, ...topFloors.slice(0, 2)]) {
  const top = f < H.podium ? f + A_STOREY : f + T_STOREY;
  for (const [s0, s1, d] of BACK_BAYS) cuts.push(niche(F.south, s0, s1, d, f + SLAB, top));
}
// Glazen bovenste lagen boven de trap (u 2,5..19,5): glas 0,4 m terug.
for (const f of topFloors.slice(0, 2)) cuts.push(niche(F.south, 0.9, U_STEP - U_W, 0.4, f + SLAB, f + T_STOREY));
// Westgevel (baksteen, v 17,7..40,5): vensters van 2,4 x 1,6 m, per laag
// verspringend; bij de noordwesthoek de hoekloggia's.
const westWin = (k) => (k % 2 ? [21.6, 27.6, 33.6] : [19.2, 25.2, 31.2, 36.6]);
towerFloors.forEach((f, k) => {
  for (const s of westWin(k)) cuts.push(niche(F.west, V_W - s - 2.4, V_W - s, 0.35, f + 0.9, f + 2.5));
});
// Oostgevel (baksteen, v 20,5..35,5): drie vensters per laag, verspringend.
const eastWin = (k) => (k % 2 ? [3.0, 7.6] : [1.2, 5.4, 9.6]);
towerFloors.forEach((f, k) => {
  for (const s of eastWin(k)) cuts.push(niche(F.east, s, s + 2.2, 0.35, f + 0.9, f + 2.5));
});
for (const f of topFloors) for (const s of [1.2, 5.4, 9.6]) cuts.push(niche(F.east, s, s + 2.2, 0.35, f + 0.9, f + 2.5));
// Noordgevel (baksteen, u 5,4..24,5): twee vensterbanden per laag, verspringend;
// bovenin de glazen hoek (u 5,4..11,4, twee lagen).
const sMain = F.north.L - (U_MAIN - U_W2); // begin van het hoofdvolume op de noordlijn
[...towerFloors, ...topFloors].forEach((f, k) => {
  const off = k % 2 ? 1.6 : 0.6;
  for (const [a, b] of [[off, off + 6.5], [off + 8.8, off + 15.3]]) {
    if (f >= topFloors[1] && sMain + b > F.north.L - 6.6) continue;
    cuts.push(niche(F.north, sMain + a, Math.min(sMain + b, F.north.L - 0.9), 0.35, f + 0.9, f + 2.5));
  }
});
cuts.push(niche(F.north, F.north.L - 6.0, F.north.L + 0.6, 0.4, topFloors[1] + 0.6, H.roof - 0.6));
cuts.push(niche(face([U_W2, nv(U_W2)], [U_W2, V_W]), -0.6, 1.4, 0.4, topFloors[1] + 0.6, H.roof - 0.6));
// Inkeping noordoost: vensters in de oostgevel van het hoofdvolume.
const notchE = face([U_MAIN, V_NE], [U_MAIN, nv(U_MAIN)]);
[...towerFloors, ...topFloors].forEach((f, k) => cuts.push(niche(notchE, k % 2 ? 2.4 : 1.0, (k % 2 ? 2.4 : 1.0) + 2.2, 0.35, f + 0.9, f + 2.5)));
// Hoekloggia's: noordoosthoek van het oostblok tot +90,3, noordwesthoek van
// de weststrook tot +71,8; per laag een hoek van 2,4 x 2,3 m uitgespaard.
for (const f of towerFloors) {
  if (f + T_STOREY <= H.loggiaNE + 0.01) cuts.push(B(U_EAST - 2.4, V_NE - 2.3, U_EAST + 0.5, V_NE + 0.5, f + SLAB, f + T_STOREY));
  if (f + T_STOREY <= H.loggiaNW + 0.01) cuts.push(B(-0.5, V_W - 2.6, U_W + 0.6, V_W + 0.5, f + SLAB, f + T_STOREY));
}

// ---------- gevels van de onderbouw en het blok ----------
const PODIUM_LEVELS = [H.shop, H.park2, ...blockFloors]; // +7,8 .. +22,6
// Winkels: glaspuien 0,4 m diep tussen bakstenen penanten van 0,9 m.
const shopBays = (L, w) => range(Math.floor(L / w), (k) => [k * w + 0.9, (k + 1) * w]);
for (const [s0, s1] of shopBays(84.0, 8.4)) cuts.push(niche(F.plinthS, s0, s1, 0.4, H.ground - 0.5, H.shop - 0.5));
for (const [s0, s1] of shopBays(36.0, 6.0)) cuts.push(niche(F.west, s0 + 4.0, s1 + 4.0, 0.4, H.ground - 0.5, H.shop - 0.5));
for (const [s0, s1] of shopBays(24.0, 6.0)) cuts.push(niche(F.north, s0, s1, 0.4, H.ground - 0.5, H.shop - 0.5));
// Bakstenen westdeel (u 0..17,5 aan de kade, westgevel, noordgevel):
// parkeerlagen met kruisvensters en woonlagen met groene vensterbanden.
for (const f of PODIUM_LEVELS) {
  const h0 = f + 0.7, h1 = f + (f < H.court ? 2.2 : 2.3);
  for (const [s0, s1] of [[1.2, 7.8], [9.6, 16.6]]) cuts.push(niche(F.plinthS, s0, s1, 0.35, h0, h1));
  for (const [s0, s1] of [[3.2, 11.0], [13.0, 21.0], [23.0, 31.0], [33.0, 39.0]]) cuts.push(niche(F.west, s0, s1, 0.35, h0, h1));
  for (const [s0, s1] of [[14.0, 23.5]]) cuts.push(niche(F.north, s0, s1, 0.35, h0, h1));
}
// Garage aan de Wijnstraat (u 30..50,3): pui op de begane grond en per
// parkeerlaag een sleuf van 1,2 m (geschat).
const garN = face([50.31, 40.61], [U_EAST, nv(U_EAST)]);
for (const [s0, s1] of shopBays(19.2, 4.8)) cuts.push(niche(garN, s0, s1, 0.4, H.ground - 0.5, H.shop - 0.5));
for (const f of [H.shop, H.park2, H.court]) for (const [s0, s1] of shopBays(19.2, 4.8)) cuts.push(niche(garN, s0, s1, 0.35, f + 0.6, f + 1.8));
// Dubbelhoge hoekloggia op de zuidwesthoek (twee woonlagen).
cuts.push(B(-0.5, -0.5, 3.4, 3.4, blockFloors[1] + 0.1, blockFloors[3]));
// Open hoek aan de Wijnstraat is al weggelaten; de balkonzone op het noorden
// krijgt per laag een balkon: 0,6 m diepe nis tussen platen van 0,9 m.
const northOut = faceOff(F.north, 1.2);
for (const f of PODIUM_LEVELS.slice(0, 5)) cuts.push(niche(northOut, 2.0, 12.9, 0.6, f + SLAB, f + (f < H.court ? 3.05 : A_STOREY)));
// Wit raster aan de kade (u 17,5..84,6): kolommen van 0,6 m om de 8,39 m,
// per laag loggia (1,2 m) of glas (0,4 m) afwisselend, tussen vloerbanden.
const W_BAYS = range(8, (k) => [17.5 + 8.39 * k + 0.6, 17.5 + 8.39 * (k + 1)]);
blockFloors.forEach((f, k) => {
  W_BAYS.forEach(([s0, s1], j) => cuts.push(niche(F.plinthS, s0, Math.min(s1, 84.0), (j + k) % 2 ? 0.4 : 1.2, f + SLAB, f + A_STOREY)));
});
// Parkeerlagen achter baksteen: donkere sleuf van 1,2 m per laag.
for (const f of [H.shop, H.park2]) for (const [s0, s1] of W_BAYS) cuts.push(niche(F.plinthS, s0, Math.min(s1, 84.0), 0.35, f + 0.8, f + 2.0));
// Hofgevel (v 15,3) en oostgevel van het blok: glas 0,4 m per woonlaag.
for (const f of blockFloors) {
  for (const [s0, s1] of range(8, (k) => [k * 8.5 + 0.6, k * 8.5 + 7.9])) cuts.push(niche(F.courtN, s0, s1, 0.4, f + SLAB, f + A_STOREY));
  for (const [s0, s1] of [[1.2, 8.4], [10.0, 18.8]]) cuts.push(niche(F.blockE, s0, s1, 0.35, f + 0.8, f + 2.2));
}

// ---------- samenvoegen ----------
const parts = { garage, deck, block, topFloor, roofSlabs, liftHouse, podium, nwCorner, northBalconies, front, westHigh, westTerrace, main, eastBlock, eastHigh, parapets, plant };
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts)).subtract(union(cuts));
model = model.trimByPlane([0, 0, 1], BASE);
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
model = model.translate([-HEART[0], -HEART[1], 0]);
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 10);
console.log("ondervlakken > 10 m2:", JSON.stringify(down));
console.log("lagen:", { towerStorey: +T_STOREY.toFixed(3), blockStorey: +A_STOREY.toFixed(3), cuts: cuts.length });

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:100Hoog met toren in baksteen en wit raster inkepingen hoekloggia's trappen dakopbouw onderbouw blok aan de kade met dakplaten en parkeergarage", model]],
  catalog: {
    name: "100Hoog",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Posthoornstraat en Wijnstraat (PDOK ellipsoïdisch 46,84..46,94); de
    // lagere kade aan de Wijnhaven (46,0..46,7) blijft erbuiten.
    groundSamplePoints: [[-18, -20], [-18, 0], [0, 14], [25, 14]],
    groundHeight: 46.85,
    replacesBuildings: ["NL.IMBAG.Pand.0599100100004790"],
    description:
      "Oorsprong RD (92951,41, 436966,04) in het hart van de toren op straatniveau NAP +3,3 m, +X op 17,83 graden in RD langs de Wijnhaven (oost), +Y naar de Wijnstraat (noord); toren van 30 x 24 m tot +105,8 (borstwering +106,45, oostdeel +106,4, installaties +108,5) met bakstenen west-, noord- en oostgevels met verspringende vensters, een zuidgevel met een wit raster van loggia's en glas waarvan het westdeel 2,8 m vooruit staat en, net als een weststrook, eindigt op +96,5; terras +99,2 en zuidwestdak +105,3; open inkepingen op de noordwest- en noordoosthoek vanaf de onderbouw (+25,5) met hoekloggia's tot +71,8 en +90,3; bakstenen onderbouw tot +25,5 met vensterbanden, een dubbelhoge hoekloggia en een open hoek aan de Wijnstraat; blok aan de kade met winkels, twee parkeerlagen, vier woonlagen in een wit raster en een teruggelegen bovenste laag onder uitkragende dakplaten (+28,6) met vier dakterrassen (+25,5); parkeergarage met dakhof +13,9 en dek +16,5. Laaghoogtes, vensters, raster, loggia's en dakplaten uit foto's of geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      axisDegrees: AXIS_DEG,
      bagFootprintM: [84.6, 42.6],
      towerPlanM: [U_EAST, +(nv(U_W2) - V_FRONT).toFixed(2)],
      napM: { roof: H.roof, rim: H.rim, eastHigh: H.eastHigh, plant: H.plant, westHigh: H.westHigh, westTerrace: H.westTerrace, step: H.step, podium: H.podium, podiumNorthEast: H.podiumNE, blockRoof: H.block, liftHouse: H.liftHouse, courtyard: H.court, deck: H.deck, loggiaNE: H.loggiaNE, loggiaNW: H.loggiaNW },
      storeys: { total: 33, towerAbovePodium: T_STOREYS + 3, towerStoreyM: +T_STOREY.toFixed(3), blockResidential: 4, blockStoreyM: +A_STOREY.toFixed(2) },
      estimates: [
        "laaghoogtes: 23 torenlagen van 3,09 m tussen de onderbouw (+25,5) en de trap (+96,5), drie lagen daarboven; vier woonlagen van 2,9 m in het blok aan de kade tussen de dakhof (+13,9) en +25,5; winkellaag tot +7,8 en twee parkeerlagen (foto's)",
        "wit raster: kolommen en vloerbanden 0,6..0,9 m, loggia's 1,2 m en glas 0,4 m diep; in het echt slanker en per travee wisselend (foto's)",
        "vensters in de bakstenen gevels als nissen van 0,35 m in een verspringend patroon; aantal en maat per laag geschat",
        "hoekloggia's: AHN4 ziet in de noordoostinkeping platen tot +92 (model: bovenste loggia tot +90,3), het AHN5 en de PDOK-tegel zien alleen de onderbouw op +25,5; de bovenste noordwestloggia (+71,8) uit foto's",
        "open hoek aan de Wijnstraat (buiten het BAG-pand) tot +10,85 en de balkonzone van 1,2 m aan de noordkant tot +22,8 geschat uit foto's en het AHN5",
        "dakplaten van het blok 0,7 m dik en 1,0 m uitkragend; bovenste laag 0,4 m en bij de terrassen 4,0 m terug (AHN5 en foto's)",
      ],
      omitted: [
        "bomen op de dakhof en langs de kade: vegetatie, geen onderdeel van het pand",
        "gevelonderhoudsinstallatie (rails en arm) op het dak: dunner dan 0,9 m",
        "glazen balkonhekken en de witte stijlen tussen de ramen: dunner dan 0,9 m",
      ],
    },
    sources: [
      "PDOK BAG pand 0599100100004790, Actueel_orthoHR; PDOK-gebouwtegels en terrein; 2026-10-12",
      "AHN5 DSM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; AHN4 DSM/DTM 0,5 m (PDOK WCS)",
      "https://nl.wikipedia.org/wiki/100Hoog",
      "https://commons.wikimedia.org/wiki/File:100hoog.jpg",
      "https://commons.wikimedia.org/wiki/File:100HoogRotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_100_Hoog_(26954136536).jpg",
      "https://commons.wikimedia.org/wiki/File:Pijp_-_Glashaven_Rotterdam_(36352765903).jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_The_Muse_aan_de_Wijnhaven_met_op_de_voorgrond_de_Grote_Wijnbrug,_rechts_de_Zwartehondstraat_en_de_Wijnstraat_2019.jpg",
      "https://commons.wikimedia.org/wiki/File:100_hoog_in_aanbouw_RDAM.JPG",
    ],
  },
});

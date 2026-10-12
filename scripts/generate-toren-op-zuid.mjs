// Toren op Zuid (Wilhelminakade 123, Rotterdam; Renzo Piano Building
// Workshop, 1998-2000; sinds 2018 "De Link", hoofdkantoor van KPN), het
// KPN-gebouw naast de Erasmusbrug. 96,5 m hoog, 23 verdiepingen.
// Het gebouw bestaat uit:
// - de kantoortoren: een doos die 17,6 graden gedraaid staat ten opzichte van
//   de rest van het complex, met de glazen voorgevel naar de Erasmusbrug die
//   6 graden voorover helt (Wikipedia: "helt zes graden naar voren") en
//   boven het dak doorloopt als open scherm tot NAP +100,0 (lichtwand van
//   896 groene lampen, KPN-logo); aan de achterkant van het scherm een
//   ligger op +96,6..+97,8 op vijf staanders;
// - de schuine stut: een witte buis van de voet op het plein (zwarte
//   piramide) tot een nis halverwege de hellende gevel (+43..+48);
// - de kern tot +91,8 en de smalle schijf aan de zuidwestkant tot +71,8, met
//   tussen schijf en toren een terugliggende sleuf met rode lisenen (+77,6)
//   en trappenhuizen (+74,8);
// - de glazen plint van de uitbreiding (V8 Architects, 2017-2018) met een dak
//   op +13,2 dat rondom uitkraagt en aan de brugzijde tot ver voor de gevel
//   loopt, met een uitsparing voor de stut; het paviljoen aan de zuidwestkant
//   tot +15,5 met twee daklichtstroken en een schuine glazen insnijding.
// Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen gestapelde
// DSM-lagen. Voorbeelden per rij: generate-evoluon.mjs (aanpak primitieven)
// en generate-rabobank-bestuurscentrum.mjs (gevelnissen op efteling-kit.mjs).
//
//   node scripts/generate-toren-op-zuid.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong op RD (93200, 435790), midden in het complex,
// z = 0 op NAP +3,5 m (3D BAG-maaiveld 3,47; AHN-DTM aan de kade +3,46..+3,51),
// Z omhoog. +X loopt op 39,1 graden in RD langs het raster van de plint en de
// schijf (BAG-gevels), +Y op 129,1 graden naar de Maas (noordwest). De
// kantoortoren staat in een tweede stelsel (a, b), 17,6 graden linksom
// gedraaid: +a is de normaal van de hellende gevel (naar de brug), +b langs
// die gevel naar het noordwesten.
//
// Bronnen: BAG-pand 0599100000691009 (bouwjaar 2000); AHN5 DSM 0,5 m (opname
// 2023, ImageServer Hoogtebestand/AHN5_DSM_50cm van ahn.arcgisonline.nl):
// bovenkant scherm +100,0 en de lijn ervan (17,6 graden), dak +85,3, kern
// +91,8, schijf +71,8, sleuf +74,8/+77,6, plintdak +13,2 en de omtrek ervan,
// paviljoen +15,5 met daklichten +17,0; AHN4 DSM/DTM 0,5 m (PDOK WCS) ter
// controle en voor het maaiveld; 3D BAG LoD2.2 voor de dakopbouwen (+86,6).
// Helling 6 graden: Wikipedia, en de BAG-voetlijn van de hellende gevel
// (a = 17,05 op +13,0) ligt 9,1 m achter de bovenrand van het scherm
// (a = 26,2 op +100,0), dat is 6,0 graden. Lagen, vensters, stut en nis uit
// Commons-foto's.
import { CrossSection, Manifold, prism, union, ccw, rect, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "toren-op-zuid";
const ORIGIN = [93200.0, 435790.0];
const AXIS_DEG = 39.1;
const RAD = (AXIS_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 3.5;
const BASE = -1.0; // NAP +2,5, onder de straat aan de zuidoostzijde (+3,22)
const z = (nap) => +(nap - GROUND_NAP).toFixed(3);

// ---------- hoogtes (NAP) ----------
const H = {
  screenTop: 100.0, // bovenkant scherm (AHN5 99,9..100,0)
  girder: [96.6, 97.8], // ligger achter het scherm (AHN5 96,6..97,8, 3D BAG 96,66)
  roof: 85.3, // dak kantoortoren (AHN5 85,2..85,35)
  roofPlant: 86.6, // drie dakopbouwen (3D BAG 86,58..86,62)
  core: 91.8, // kern (AHN5 91,7..92,3, 3D BAG 91,77)
  coreNotch: 89.3, // verlaagd deel van de kern (3D BAG 89,28)
  slab: 71.8, // schijf zuidwest (AHN5 71,7..72,3, 3D BAG 71,76)
  slabWell: 67.7, // twee dakputten in de schijf (AHN5 67,7)
  fin: 77.6, // rode lisenen in de sleuf (AHN5 77,6)
  stairs: 74.8, // trappenhuizen in de sleuf (AHN5 74,8)
  soffit: 13.0, // onderkant kantoortoren en schijf (foto's: twee lagen boven de kade; BAG-voetlijn)
  darkBand: 16.8, // onderste band donkere panelen (twee rijen, foto's)
  plinthRoof: 13.2, // dak van de glazen plint (AHN5 13,0..13,4)
  plinthSoffit: 12.4, // onderkant dakrand (foto's: dunne witte rand)
  pavilion: 15.5, // paviljoen zuidwest (AHN5 15,4..15,6)
  pavilionLights: 17.0, // daklichtstroken (AHN5 16,9..17,0)
  holeBottom: 43.0, // nis van de stut in de hellende gevel (foto's)
  holeTop: 48.0,
};
const FLOORS = 22; // 22 kantoorlagen boven de donkere band (23 verdiepingen volgens Wikipedia)
const STOREY = (H.roof - H.darkBand) / FLOORS; // 3,114 m

// ---------- kantoortoren in het stelsel (a, b) ----------
const PHI = (17.6 * Math.PI) / 180;
const [C, S] = [Math.cos(PHI), Math.sin(PHI)];
const TW = (a, b) => [a * C - b * S, a * S + b * C]; // (a, b) -> (u, v)
const B_SE = -27.27; // zuidoostgevel (BAG, verticaal tot het dak)
const B_NW = 13.6; // noordwestgevel (AHN5-dakrand)
const A_FOOT = 17.05; // voet van de hellende gevel op +13,0 (BAG)
const TAN6 = Math.tan((6 * Math.PI) / 180);
const facadeA = (nap) => A_FOOT + (nap - H.soffit) * TAN6;
// Stut: voet op de zwarte piramide (luchtfoto, BAG-uitsparing), in een vlak
// loodrecht op de gevel; de buis loopt van 1,2 m dik aan de voet tot 2,2 m
// boven in de nis (foto's).
const STRUT = { b: -7.4, footA: 34.9, topNap: 45.0, rFoot: 0.6, rTop: 1.1 };
const HOLE = { b: [-9.0, -5.8], depth: 2.5 };

// ---------- hulpfuncties ----------
const cs = (poly) => new CrossSection([ccw(poly)]);
const ext = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
const twPoly = (pts) => pts.map(([a, b]) => TW(a, b));
const circlePts = ([cx, cy], r, n = 48) => range(n, (k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)]);
// Blok in het torenstelsel: a-grenzen per hoogte (functie van NAP), b0..b1, nap0..nap1.
const twBlock = (aLo, aHi, b0, b1, nap0, nap1) =>
  Manifold.hull(
    [nap0, nap1].flatMap((h) =>
      [aLo(h), aHi(h)].flatMap((a) => [b0, b1].map((b) => [...TW(a, b), z(h)])),
    ),
  );
const K = (c) => () => c;
// Deel van m boven (keep="above") of onder het vlak z = a u + b v + c (model-z).
const cut = (m, a, b, c, keep = "below") => {
  const n = Math.hypot(a, b, 1);
  return keep === "below" ? m.trimByPlane([a / n, b / n, -1 / n], -c / n) : m.trimByPlane([-a / n, -b / n, 1 / n], c / n);
};
const ringBands = (section, rows, d = 0.35) => {
  const ring = section.subtract(section.offset(-d, "Miter", 2));
  return union(rows.map(([h0, h1]) => ext(ring, z(h0), z(h1))));
};
const floorsFrom = (n) => range(n, (k) => H.darkBand + STOREY * k);

// ---------- kantoortoren ----------
// Toegestane plattegrond in het gebouwstelsel: de toren begint achter de
// kern en de sleuven (u = 6,5 aan de noordwestkant, 10,8 aan de zuidoostkant).
const TOWER_ZONE = cs([[3.3, -16.3], [10.8, -16.3], [10.8, -60], [80, -60], [80, 60], [6.5, 60], [6.5, 7.3], [3.3, 7.3]]);
let tower = twBlock(K(-8), facadeA, B_SE, B_NW, H.plinthSoffit, H.roof).intersect(ext(TOWER_ZONE, z(H.plinthSoffit) - 1, z(H.roof) + 1));
// Hellende gevel: glasvakken per laag in een raster van 12 traveeën (3,24 m),
// 0,35 m diep loodrecht op de gevel, met stijlen en borstweringen van 0,9 m.
const NE_COLS = 12;
const NE_PITCH = (B_NW - B_SE - 2.0) / NE_COLS;
const neCells = [];
for (const f of floorsFrom(FLOORS)) {
  for (let j = 0; j < NE_COLS; j++) {
    const b0 = B_SE + 1.0 + NE_PITCH * j + 0.45;
    const b1 = b0 + NE_PITCH - 0.9;
    const [h0, h1] = [f + 0.9, f + STOREY];
    if (h1 > H.holeBottom - 0.5 && h0 < H.holeTop + 0.5 && b1 > HOLE.b[0] - 0.5 && b0 < HOLE.b[1] + 0.5) continue;
    neCells.push(twBlock((h) => facadeA(h) - 0.35, (h) => facadeA(h) + 0.3, b0, b1, h0, h1));
  }
}
// Zuidoostgevel (witte panelen): vensters van 1,3 x 2,0 m in verspringende
// kolommen (foto's), 0,35 m diep.
const seWindows = [];
floorsFrom(FLOORS).forEach((f, k) => {
  for (let j = 0; j < 8; j++) {
    const a0 = 4.2 + 3.4 * j + (k % 2) * 1.7;
    if (a0 + 1.3 > facadeA(f) - 1.2) continue;
    seWindows.push(twBlock(K(a0), K(a0 + 1.3), B_SE - 0.3, B_SE + 0.35, f + 1.0, f + 3.0));
  }
});
// Noordwestgevel: één kolom vensters bij de sleuf, de rest dicht (foto's).
const nwWindows = floorsFrom(FLOORS).map((f) => twBlock(K(12.3), K(13.6), B_NW - 0.35, B_NW + 0.3, f + 1.0, f + 3.0));
// Nis van de stut: 3,2 m breed, +43..+48, 2,5 m diep.
const hole = twBlock((h) => facadeA(h) - HOLE.depth, (h) => facadeA(h) + 0.3, HOLE.b[0], HOLE.b[1], H.holeBottom, H.holeTop);
tower = tower.subtract(union([...neCells, ...seWindows, ...nwWindows, hole]));
// Drie dakopbouwen (3D BAG, +86,6).
const roofPlant = union(
  [rect(13.9, 2.9, 17.8, 5.8), rect(14.9, -1.3, 19.0, 1.8), rect(15.8, -10.1, 21.9, -7.1)].map((r) => prism(r, z(H.roof) - 0.05, z(H.roofPlant))),
);

// ---------- scherm boven het dak ----------
// Doorgaande hellende gevel van +85,3 tot +100,0, 1,2 m dik rond het
// gevelvlak, met een raster van open vakken als blinde nissen van 0,4 m
// (de lichtwand met het logo is in werkelijkheid een open rooster).
let screen = twBlock((h) => facadeA(h) - 0.6, (h) => facadeA(h) + 0.6, B_SE, B_NW, H.roof - 0.05, H.screenTop);
const screenCells = [];
for (const [h0, h1] of [[86.2, 89.4], [90.3, 93.5], [94.4, 99.1]]) {
  for (let j = 0; j < NE_COLS; j++) {
    const b0 = B_SE + 1.0 + NE_PITCH * j + 0.45;
    screenCells.push(twBlock((h) => facadeA(h) + 0.2, (h) => facadeA(h) + 0.7, b0, b0 + NE_PITCH - 0.9, h0, h1));
  }
}
screen = screen.subtract(union(screenCells));
// Ligger achter het scherm (AHN5: 3 tot 4 m brede strook op +96,6..+97,8) op
// vijf staanders van 1,0 m op het dak (foto's).
const POSTS_B = [-25.2, -15.8, -6.4, 3.0, 12.4];
const girder = twBlock(K(22.2), (h) => facadeA(h) - 0.3, B_SE + 0.5, B_NW - 0.5, H.girder[0], H.girder[1]);
const posts = union(POSTS_B.map((b) => twBlock(K(22.2), K(23.2), b - 0.5, b + 0.5, H.roof - 0.05, H.girder[0] + 0.05)));

// ---------- kern en schijf ----------
let core = prism(rect(3.3, -16.3, 11.3, 7.3), z(H.plinthSoffit), z(H.core));
core = core.subtract(prism(rect(6.4, 1.5, 8.2, 7.4), z(H.coreNotch), z(H.core) + 1));
const SLAB = cs(rect(-4.6, -25.4, 3.3, 16.3)).add(cs(rect(3.2, -25.4, 6.5, -16.2)));
let slab = ext(SLAB, z(H.plinthSoffit), z(H.slab));
slab = slab.subtract(union([rect(-3.7, 13.7, -0.5, 15.5), rect(-3.7, -24.6, -0.5, -22.7)].map((r) => prism(r, z(H.slabWell), z(H.slab) + 1))));
// Vensters in de schijf: verspringende kolommen in de zuidwestgevel, één
// kolom in de kopgevels (foto's).
const slabFloors = floorsFrom(17);
const slabWindows = [];
slabFloors.forEach((f, k) => {
  for (let j = 0; j < 12; j++) {
    const v0 = -23.6 + 3.4 * j + (k % 2) * 1.7;
    if (v0 + 1.3 > 15.0) continue;
    slabWindows.push(prism(rect(-4.95, v0, -4.25, v0 + 1.3), z(f + 1.0), z(f + 3.0)));
  }
  slabWindows.push(prism(rect(-3.3, 15.95, -2.0, 16.65), z(f + 1.0), z(f + 3.0)));
  slabWindows.push(prism(rect(-3.3, -25.75, -2.0, -25.05), z(f + 1.0), z(f + 3.0)));
});
slab = slab.subtract(union(slabWindows));
// Sleuven tussen schijf en toren: rode lisenen tot +77,6 die 0,7 m voor de
// gevels uitsteken en trappenhuizen tot +74,8 (AHN5, foto's).
const slots = union([
  prism(rect(3.3, 7.3, 4.3, 17.0), z(H.plinthSoffit), z(H.fin)),
  prism(rect(4.3, 7.3, 6.55, 15.3), z(H.plinthSoffit), z(H.stairs)),
  prism(rect(7.4, -26.1, 8.2, -16.25), z(H.plinthSoffit), z(H.fin)),
  prism(rect(8.2, -24.6, 10.85, -16.25), z(H.plinthSoffit), z(H.stairs)),
  prism(rect(6.45, -24.0, 7.45, -16.25), z(H.plinthSoffit), z(H.slab)),
]);

// ---------- glazen plint met uitkragend dak ----------
// Dakomtrek uit het AHN5 (+13,0..+13,4), vereenvoudigd op 0,5 m; aan de
// brugzijde een inham waar de stut door het dak gaat.
const PLINTH_ROOF = cs([
  [-27.6, -25.8], [45.6, -25.8], [43.6, -16.8], [30.1, 0.8], [31.4, 3.5], [32.0, 4.4], [36.1, 6.2], [36.1, 8.0],
  [34.9, 9.8], [34.6, 12.5], [31.5, 21.0], [-27.6, 21.0],
]);
const roofPlate = ext(PLINTH_ROOF, z(H.plinthSoffit), z(H.plinthRoof));
// Glazen gevel 1,5 m achter de dakrand; rond de voet van de stut een plein
// (BAG: cirkel van 8 m om a 36,8, b -6,0).
const PLINTH = PLINTH_ROOF.offset(-1.5, "Miter", 2).subtract(cs(circlePts(TW(36.8, -6.0), 8.0)));
let plinth = ext(PLINTH, BASE, z(H.plinthSoffit) + 0.05);
plinth = plinth.subtract(ringBands(PLINTH, [[3.8, 7.7], [8.5, 12.0]]));
// Paviljoen zuidwest tot +15,5 met twee daklichtstroken (+17,0) en een rond
// dakvenster (AHN5).
const PAV = cs(rect(-27.6, -16.0, -4.6, 14.5));
let pavilion = ext(PAV, BASE, z(H.pavilion));
pavilion = pavilion.subtract(ringBands(PAV, [[13.7, 15.0]]).subtract(ext(PAV, BASE, z(H.plinthRoof))));
pavilion = pavilion.subtract(prism(circlePts([-21.0, -9.0], 2.0, 32), z(H.pavilion) - 2.5, z(H.pavilion) + 1));
const lights = union([rect(-25.5, -3.2, -11.5, -1.8), rect(-25.5, -7.0, -11.5, -5.6)].map((r) => prism(r, z(H.pavilion) - 0.05, z(H.pavilionLights))));
// Schuine glazen insnijding in de zuidoosthoek van het paviljoen (AHN5: van
// +13,2 bij v = -14 tot +5,0 aan de rand van het dak).
const notch = cut(prism([[-23.5, -27], [-15.0, -27], [-15.0, -21.5], [-20.5, -13.5], [-23.5, -21.5]], BASE - 1, z(25)), 0, 1.2615, z(13.2) + 1.2615 * 14, "above");

// ---------- stut ----------
const footUV = TW(STRUT.footA, STRUT.b);
const topA = facadeA(STRUT.topNap) - 1.0;
const dA = topA - STRUT.footA;
const dZ = z(STRUT.topNap) - 0;
const len = Math.hypot(dA, dZ);
const tilt = (Math.atan2(dA, dZ) * 180) / Math.PI; // negatief: naar de gevel
// Twee helften met een ring halverwege (dezelfde tapsheid), zodat de buis
// ook in het midden hoekpunten heeft.
const rMid = (STRUT.rFoot + STRUT.rTop) / 2;
const strut = Manifold.union([
  Manifold.cylinder(len / 2 + 1.2, STRUT.rFoot - (1.2 / len) * (STRUT.rTop - STRUT.rFoot), rMid, 40).translate([0, 0, -1.2]),
  Manifold.cylinder(len / 2, rMid, STRUT.rTop, 40).translate([0, 0, len / 2]),
])
  .rotate([0, tilt, 17.6])
  .translate([footUV[0], footUV[1], 0]);
// Zwarte piramide onder de voet (5 x 5 m, 1,6 m hoog, foto's).
const pyramid = Manifold.hull([
  ...twPoly([[STRUT.footA - 2.5, STRUT.b - 2.5], [STRUT.footA + 2.5, STRUT.b - 2.5], [STRUT.footA + 2.5, STRUT.b + 2.5], [STRUT.footA - 2.5, STRUT.b + 2.5]]).flatMap(([u, v]) => [[u, v, BASE], [u, v, 0]]),
  ...twPoly([[STRUT.footA - 0.8, STRUT.b - 0.8], [STRUT.footA + 0.8, STRUT.b - 0.8], [STRUT.footA + 0.8, STRUT.b + 0.8], [STRUT.footA - 0.8, STRUT.b + 0.8]]).map(([u, v]) => [u, v, 1.6]),
]);

const parts = { tower, roofPlant, screen, girder, posts, core, slab, slots, roofPlate, plinth, pavilion, lights, strut, pyramid };
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts)).subtract(notch);
model = model.trimByPlane([0, 0, 1], BASE);
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 10);
console.log("ondervlakken > 10 m2:", JSON.stringify(down));
console.log("stut:", { lengthM: +len.toFixed(2), tiltDeg: +tilt.toFixed(2), foot: footUV.map((c) => +c.toFixed(2)), topA: +topA.toFixed(2) });

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Toren op Zuid met hellende gevel scherm stut kern schijf en glazen plint", model]],
  catalog: {
    name: "Toren op Zuid",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Kade aan de Maas en de stoep aan de zuidwestkant (PDOK ellipsoïdisch
    // 46,93..47,06); de lagere straat aan de zuidoostkant (46,86) en het plein
    // aan de brugzijde (47,3..47,5) blijven erbuiten.
    groundSamplePoints: [[-20, 25], [0, 25], [20, 25], [-33, -10], [-33, 10]],
    groundHeight: 47.0,
    replacesBuildings: ["NL.IMBAG.Pand.0599100000691009"],
    description:
      "Oorsprong RD (93200, 435790) midden in het complex op kadeniveau NAP +3,5 m, +X op 39,1 graden in RD langs het raster van plint en schijf, +Y naar de Maas; kantoortoren 17,6 graden gedraaid met de glazen voorgevel naar de Erasmusbrug die 6 graden voorover helt (voet +13,0, 9,1 m uitkraging), dak +85,3 met drie opbouwen, het scherm met rastervakken tot +100,0 en de ligger op staanders, 22 lagen glasvakken in de hellende gevel en verspringende vensters in de zijgevels; schuine stut van 43 m (1,2 tot 2,2 m dik) van een zwarte piramide op het plein tot een nis op +43..+48; kern +91,8, schijf +71,8 met vensters en dakputten, sleuven met rode lisenen (+77,6) en trappenhuizen (+74,8); glazen plint met een uitkragend dak op +13,2 en een inham voor de stut, paviljoen +15,5 met daklichten en een schuine insnijding. Lagen, vensters, stut, nis, plintgevel en de onderkant van het plintdak uit foto's of geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      axisDegrees: AXIS_DEG,
      towerAxisDegrees: AXIS_DEG + 17.6,
      leaningFacade: { leanDegrees: 6, footNapM: H.soffit, footA: A_FOOT, topA: +facadeA(H.screenTop).toFixed(2), overhangM: +(facadeA(H.screenTop) - A_FOOT).toFixed(2), widthM: +(B_NW - B_SE).toFixed(2) },
      towerNapM: { roof: H.roof, roofPlant: H.roofPlant, screenTop: H.screenTop, girder: H.girder, core: H.core, slab: H.slab, fins: H.fin, stairs: H.stairs },
      officeStoreys: FLOORS,
      storeyM: +STOREY.toFixed(3),
      strut: { lengthM: +len.toFixed(1), tiltFromVerticalDegrees: +Math.abs(tilt).toFixed(1), diameterM: [2 * STRUT.rFoot, 2 * STRUT.rTop], holeNapM: [H.holeBottom, H.holeTop] },
      plinthNapM: { roof: H.plinthRoof, soffit: H.plinthSoffit, pavilion: H.pavilion, pavilionLights: H.pavilionLights },
      estimates: [
        "helling 6 graden (Wikipedia), gecontroleerd met de BAG-voetlijn op +13,0 en de AHN5-bovenrand van het scherm op +100,0",
        "22 kantoorlagen van 3,114 m boven een donkere band van +13,0 tot +16,8 (Wikipedia: 23 verdiepingen); glasvakken 0,35 m diep in een raster van 12 traveeën in plaats van de 24 echte",
        "het scherm boven het dak is een open rooster; in het model een plaat van 1,2 m met blinde vakken, de ligger erachter op vijf staanders van 1,0 m",
        "stut: plaats van de voet uit de luchtfoto en de BAG-uitsparing, de nis uit foto's (+43..+48, 3,2 m breed), de dikte (1,2 tot 2,2 m) uit foto's",
        "vensters in de witte zijgevels en de schijf: maten en ritme uit foto's",
        "glazen plint: gevel 1,5 m achter de dakrand en twee glasbanden geschat; het dak 0,8 m dik",
        "schuine insnijding in het paviljoen als één vlak uit het AHN5 (+13,2 tot +5,0)",
      ],
    },
    sources: [
      "PDOK BAG pand 0599100000691009, Actueel_orthoHR; PDOK-gebouwtegels en terrein; 2026-10-12",
      "AHN5 DSM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; AHN4 DSM/DTM 0,5 m (PDOK WCS); 3D BAG LoD2.2",
      "https://nl.wikipedia.org/wiki/Toren_op_Zuid",
      "https://commons.wikimedia.org/wiki/File:Contrafforte_-_panoramio.jpg",
      "https://commons.wikimedia.org/wiki/File:KPN_building_@_Wilhelminapier_@_Kop_van_Zuid_@_Rotterdam_(29933117024).jpg",
      "https://commons.wikimedia.org/wiki/File:KPN_@_Erasmus_Bridge_@_Rotterdam_(30447721252).jpg",
      "https://commons.wikimedia.org/wiki/File:KPN_Building_(Rotterdam)_IMG_5109.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_KPN_Tower_(1).jpg",
      "https://commons.wikimedia.org/wiki/File:TorenOpZuid.jpg",
      "https://commons.wikimedia.org/wiki/File:GraphyArchy_-_Wikipedia_00773.jpg",
      "https://commons.wikimedia.org/wiki/File:GraphyArchy_-_Wikipedia_00977.jpg",
      "https://commons.wikimedia.org/wiki/File:KPN_Building_-_Rotterdam,_Holland_-_panoramio.jpg",
    ],
  },
});

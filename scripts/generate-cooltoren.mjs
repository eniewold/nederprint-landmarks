// De Cooltoren (Rotterdam, 2021-2022, V8 Architects): woontoren van 51 lagen
// aan de Baan, met de bovengrondse parkeergarage (daktuin) aan de oostzijde en
// een plint van vijf lagen om de voet. Vlakken en benoemde bouwdelen in een
// eigen gebouwstelsel, geen gestapelde DSM-lagen. Voorbeeld per rij:
// generate-evoluon.mjs (aanpak primitieven) en generate-zalmhaven.mjs /
// generate-haagse-toren.mjs (skylinetorens op efteling-kit.mjs).
//
//   node scripts/generate-cooltoren.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het hart van de schacht op RD (92644,5,
// 436604,0), z = 0 op NAP +0,5 m (straat rondom, AHN5-DTM +0,4 tot +0,65),
// Z omhoog. +X loopt langs de gevels op -0,8 graden in RD (BAG-gevels en
// AHN-randen), dus vrijwel naar het oosten; +Y naar het noorden. De garage
// ligt aan +X (oost) en loopt 99 m naar het noorden; de plint vormt een
// vleugel ten zuiden en ten noorden van de toren aan de Baan (-X).
//
// Opbouw (foto's van alle kanten, AHN5, 3D BAG):
// - De schacht is een vierkant van circa 28 m. Op elke gevel staan twee
//   uitgebouwde balkonstapels (1,5 m) met daartussen een terugliggende
//   gleuf van 3,6 m; de hoeken zelf liggen terug (glas met smalle witte
//   vloerranden). Dat zijn de "inkepingen aan de hoeken": van buiten gezien
//   springen de hoeken 1,5 m terug ten opzichte van de stapels en de kroon.
// - Middenkroon: vier lagen (NAP +72,8 tot +83,3) die als volle vierkante
//   band van 32,5 m rondom uitkragen, met diepe terrassen tussen de witte
//   banden. Direct onder en boven de kroon lopen de balkonplaten drie lagen
//   lang over de gleuf door (de gleuf is daar dicht).
// - Bovenin (vanaf NAP +136,7, de 44e laag) zijn de hoeken helemaal
//   weggesneden: de bovenste vijf lagen zijn een kruis, met hoekterrassen.
// - Dak +151,2 met een teruggezette donkere dakopbouw tot +155,0 onder een
//   dakplaat, en een antennemast.
//
// Bronnen: BAG-panden 0599100100017348 (toren en plint) en 0599100100017388
// (parkeergarage met daktuin). Het AHN op PDOK (AHN4) toont de toren nog in
// aanbouw (maximaal NAP +75 m). Hoogtes en plattegronden komen daarom uit
// AHN5 (DSM/DTM 0,5 m, ImageServer Hoogtebestand/AHN5_DSM_50cm van
// ahn.arcgisonline.nl), per 0,5 m in dit stelsel uitgelezen, en uit de 3D BAG
// (LoD2.2 op AHN5, TU Delft/3D geoinformatie, CC BY 4.0) als controle: dak
// +151,2, dakopbouw +155,0, hoekterrassen +136,5, gleufdak +92,1, kroon
// +83,3, plint +21,7, garage +12,85 met trappenhuizen +15,9.
import { CrossSection, Manifold, box, prism, union, writeLandmark, downFaces, circle } from "./efteling-kit.mjs";

const slug = "cooltoren";
const ORIGIN = [92644.5, 436604.0];
const AXIS_DEG = -0.8;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.5;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN5 en 3D BAG) ----------
const H = {
  plinth: 21.7, // dak van de plint (3D BAG 21,7)
  garage: 12.85, // daktuin op de parkeergarage
  garageRim: 14.45, // borstwering langs de lange zijden (AHN5 14,3-14,7)
  garageStair: 16.0, // trappenhuizen op het garagedak
  roof: 151.2, // dak van de schacht (3D BAG 151,2)
  top: 155.0, // dakopbouw met dakplaat (3D BAG 155,0)
  mast: 160.5, // antenne (AHN5-maximum 161,7 op één punt)
};
// Verdiepingen: 49 woonlagen boven de dubbelhoge onderbouw (NAP +0,5 tot
// +9,0); samen 51 lagen (Wikipedia). Steek 2,90 m tussen +9,0 en het dak.
// Met deze steek vallen de kroon (+83,3 = bovenkant band van laag 25), het
// gleufdak (+92,0, laag 28) en de hoekterrassen (+136,7, laag 44) op het raster.
const F0 = 9.0;
const FLOORS = 49;
const P = (H.roof - F0) / FLOORS;
const f = (k) => F0 + k * P;
const BAND = 1.72; // witte balkonplaat met borstwering (foto's: 1,72 / 1,18)
const CROWN = [22, 25]; // middenkroon: lagen 22 t/m 25
const FILLED = [19, 20, 21, 26, 27, 28]; // gleuf dicht onder en boven de kroon
const CORNER_FROM = 44; // hoeken weggesneden vanaf laag 44

// ---------- plattegrond schacht (m, gebouwstelsel) ----------
// Kern (BAG-voetafdruk op maaiveld en de AHN-hoekblokken tot +136,5).
const CORE = { u0: -14.0, u1: 13.9, v0: -13.9, v1: 13.7 };
// Armen van het kruis (AHN5 boven +145): noord-zuid u ±7,9, oost-west v ±6,35.
const ARM = { u: 7.9, v: 6.35 };
const SLOT = 1.8; // halve breedte van de gleuf midden op elke gevel
// Per gevel: as, teken, kern, voorkant stapels, achterwand gleuf, stapels,
// en de hoogte waar de stapels beginnen (west boven de entree, oost boven de
// garage, noord en zuid boven de plint).
const FACES = [
  { name: "west", axis: "u", sign: -1, core: 14.0, front: 15.4, slotBack: 13.0, arm: ARM.v, start: F0 },
  { name: "oost", axis: "u", sign: 1, core: 13.9, front: 15.4, slotBack: 13.0, arm: ARM.v, start: H.garage },
  { name: "zuid", axis: "v", sign: -1, core: 13.9, front: 15.5, slotBack: 13.4, arm: ARM.u, start: H.plinth },
  { name: "noord", axis: "v", sign: 1, core: 13.7, front: 15.4, slotBack: 13.4, arm: ARM.u, start: H.plinth },
];
// Middenkroon (AHN5 +83,3): volle vierkante band.
const CROWN_BOX = { u0: -15.9, u1: 16.6, v0: -16.3, v1: 16.1 };
const CROWN_DEPTH = 1.5; // terrassen tussen de banden
// Dakopbouw (AHN5 +155): kruis u -10,75..11 bij v ±5,75 en u -6,75..7,25 bij v ±9,25.
const TOP = [
  [-10.75, -5.75], [-6.75, -5.75], [-6.75, -9.25], [7.25, -9.25], [7.25, -5.75], [11.0, -5.75],
  [11.0, 5.75], [7.25, 5.75], [7.25, 9.25], [-6.75, 9.25], [-6.75, 5.75], [-10.75, 5.75],
];
const MAST = { at: [0.3, -4.25], half: 0.5 };

// ---------- plint en garage (BAG-contouren in het gebouwstelsel) ----------
// Pand 0599100100017348 zonder de kleine knikjes: zuidvleugel, toren en
// noordvleugel; tussen de vleugels ligt de westgevel van de toren aan de Baan.
const PLINTH = [
  [-16.65, -26.12], [3.65, -26.1], [3.57, -13.82], [13.9, -13.86], [13.64, 13.39], [3.78, 13.35],
  [3.86, 25.77], [-16.51, 25.83], [-16.55, 6.08], [-14.05, 6.07], [-14.09, -6.32], [-16.59, -6.31],
];
// Pand 0599100100017388: parkeergarage langs de oostzijde (westgrens loopt
// 1,4 m de toren in, zodat er geen spleet langs de gemeenschappelijke wand is).
const GARAGE = [
  [13.2, -19.31], [28.71, -19.01], [26.18, 98.75], [10.82, 99.12], [10.85, 94.47], [12.28, 14.48], [12.5, 14.48], [12.5, -14.48], [13.18, -14.48],
];
const GARAGE_STAIR = { c: [21.0, -11.5], r: 2.7 };
const GARAGE_BOX = [16.0, 89.0, 21.0, 94.5];

// ---------- hulpfuncties ----------
// Doos aan een gevel: afstand d0..d1 vanaf het hart langs de normaal,
// s0..s1 langs de gevel, NAP-hoogtes n0..n1.
const faceBox = (F, d0, d1, s0, s1, n0, n1) => {
  const [a, b] = F.sign > 0 ? [d0, d1] : [-d1, -d0];
  return F.axis === "u" ? box(a, s0, z(n0), b, s1, z(n1)) : box(s0, a, z(n0), s1, b, z(n1));
};
// Blinde nis in de gevel a->b (buitenkant rechts van de looprichting, dus
// tegen de klok in rond een veelhoek), zoals generate-zalmhaven.mjs.
const groove = (a, b, s0, s1, nap0, nap1, depth = 0.35, out = 1.2) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return box(-depth, s0, z(nap0), out, s1, z(nap1))
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
const grid = (a, b, rows, { pitch, w, margin = 0.9, depth = 0.35 }) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.floor((len - 2 * margin) / pitch));
  const p = (len - 2 * margin) / n;
  const out = [];
  for (let i = 0; i < n; i++) {
    const c = margin + p * (i + 0.5);
    for (const [n0, n1] of rows) out.push(groove(a, b, c - w / 2, c + w / 2, n0, n1, depth));
  }
  return out;
};
const offsetPoly = (poly, d) => new CrossSection([poly]).offset(d, "Miter", 4).toPolygons()[0];
// Ring van nissen rond een omtrek: van `depth` binnen tot 2 m buiten de omtrek.
const ring = (poly, depth, n0, n1) => prism(offsetPoly(poly, 2), z(n0), z(n1)).subtract(prism(offsetPoly(poly, -depth), z(n0) - 1, z(n1) + 1));
const voidTop = (k) => Math.min(f(k + 1), H.roof - 0.5);

// ---------- schacht: kern met gleuven, hoeken en vloerranden ----------
const coreSquare = [[CORE.u0, CORE.v0], [CORE.u1, CORE.v0], [CORE.u1, CORE.v1], [CORE.u0, CORE.v1]];
const coreCross = [
  [CORE.u0, -ARM.v], [-ARM.u, -ARM.v], [-ARM.u, CORE.v0], [ARM.u, CORE.v0], [ARM.u, -ARM.v], [CORE.u1, -ARM.v],
  [CORE.u1, ARM.v], [ARM.u, ARM.v], [ARM.u, CORE.v1], [-ARM.u, CORE.v1], [-ARM.u, ARM.v], [CORE.u0, ARM.v],
];
let core = prism(coreSquare, BASE, z(H.roof));
{
  const cuts = [];
  // Hoeken boven laag 44 weg: de bovenste vijf lagen zijn een kruis.
  cuts.push(prism(coreSquare, z(f(CORNER_FROM)), z(H.roof) + 1).subtract(prism(coreCross, z(f(CORNER_FROM)) - 1, z(H.roof) + 2)));
  // Gleuven midden op elke gevel, behalve waar de balkonplaten over de gleuf
  // doorlopen (lagen 19 tot en met 28, met de kroon).
  for (const F of FACES) {
    for (const [n0, n1] of [[F.start, f(FILLED[0])], [f(28) + BAND, H.roof + 1]]) {
      cuts.push(faceBox(F, F.slotBack, F.front + 2, -SLOT, SLOT, n0, n1));
    }
  }
  // Vloerranden: per laag een glasband van 0,35 m diep met een witte rand
  // van 0,55 m (hoekzones, gleufwanden, onderbouw van de westgevel).
  const rings = [];
  for (let k = 0; k < FLOORS; k++) {
    if (k >= CROWN[0] && k <= CROWN[1]) continue;
    const poly = k >= CORNER_FROM ? coreCross : coreSquare;
    // Onder de hoekterrassen blijft een plaat van 0,5 m staan.
    rings.push(ring(poly, 0.35, f(k) + 0.55, k === CORNER_FROM - 1 ? f(k + 1) - 0.5 : voidTop(k)));
    for (const F of FACES) {
      if (f(k) + 0.55 < F.start || (k >= FILLED[0] && k <= 28)) continue;
      rings.push(faceBox(F, F.slotBack - 0.35, F.slotBack + 0.01, -SLOT + 0.4, SLOT - 0.4, f(k) + 0.55, voidTop(k)));
    }
  }
  // Onderbouw aan de Baan: dubbelhoge entreehal (1,0 m terug) en een
  // glasband op de eerste verdieping.
  cuts.push(box(CORE.u0 - 1, -5.0, z(GROUND_NAP) - 0.01, CORE.u0 + 1.0, 5.0, z(5.2)));
  cuts.push(box(CORE.u0 - 1, -5.8, z(5.9), CORE.u0 + 0.35, 5.8, z(8.5)));
  core = core.subtract(union([...cuts, ...rings]));
}

// ---------- balkonstapels ----------
let stacks;
{
  const solids = [];
  const voids = [];
  for (const F of FACES) {
    const runs = [[-F.arm, -SLOT], [SLOT, F.arm]];
    // Twee stapels over de hele hoogte; de kroon komt er later overheen.
    for (const [s0, s1] of runs) solids.push(faceBox(F, F.core - 0.4, F.front, s0, s1, F.start, H.roof));
    // Doorlopende balkonplaten over de gleuf, onder en boven de kroon.
    solids.push(faceBox(F, F.slotBack - 0.05, F.front, -SLOT - 0.01, SLOT + 0.01, f(FILLED[0]), f(28) + BAND));
    // Per laag een balkon: 0,9 m diepe ruimte boven de witte plaat.
    for (let k = 0; k < FLOORS; k++) {
      if (k >= CROWN[0] && k <= CROWN[1]) continue;
      const n0 = f(k) + BAND;
      if (n0 < F.start + 0.5) continue;
      const n1 = voidTop(k);
      if (FILLED.includes(k)) voids.push(faceBox(F, F.front - 0.9, F.front + 1, -F.arm + 0.5, F.arm - 0.5, n0, n1));
      else for (const [s0, s1] of runs) voids.push(faceBox(F, F.front - 0.9, F.front + 1, s0 + 0.5, s1 - 0.5, n0, n1));
    }
  }
  stacks = union(solids).subtract(union(voids));
}

// ---------- middenkroon ----------
let crown;
{
  const sq = [[CROWN_BOX.u0, CROWN_BOX.v0], [CROWN_BOX.u1, CROWN_BOX.v0], [CROWN_BOX.u1, CROWN_BOX.v1], [CROWN_BOX.u0, CROWN_BOX.v1]];
  crown = prism(sq, z(f(CROWN[0])), z(f(CROWN[1]) + BAND));
  // Diepe terrassen tussen de vier witte banden (rondom, ook op de hoeken).
  const v = [];
  for (let k = CROWN[0]; k < CROWN[1]; k++) v.push(ring(sq, CROWN_DEPTH, f(k) + BAND, f(k + 1)));
  crown = crown.subtract(union(v));
}

// ---------- dakopbouw en mast ----------
let top = prism(TOP, z(H.roof) - 0.01, z(H.top));
// Donkere, teruggezette laag onder de dakplaat (1,0 m terug).
top = top.subtract(ring(TOP, 1.0, H.roof + 0.4, H.top - 0.8));
const mast = box(MAST.at[0] - MAST.half, MAST.at[1] - MAST.half, z(H.top) - 0.01, MAST.at[0] + MAST.half, MAST.at[1] + MAST.half, z(H.mast));

// ---------- plint ----------
let plinth = prism(PLINTH, BASE, z(H.plinth));
{
  const q = [];
  const rows = [[6.0, 8.4], [9.9, 12.3], [13.8, 16.2], [17.7, 20.1]];
  const shop = [[1.2, 4.6]];
  // Buitengevels van de plint (tegen de klok in): west, zuid, oost van de
  // zuidvleugel; oost, noord en west van de noordvleugel.
  const faces = [
    [[-16.59, -6.31], [-16.65, -26.12]],
    [[-16.65, -26.12], [3.65, -26.1]],
    [[3.65, -26.1], [3.57, -13.82]],
    [[3.78, 13.35], [3.86, 25.77]],
    [[3.86, 25.77], [-16.51, 25.83]],
    [[-16.51, 25.83], [-16.55, 6.08]],
  ];
  for (const [a, b] of faces) {
    q.push(...grid(a, b, rows, { pitch: 3.0, w: 2.0 }));
    q.push(...grid(a, b, shop, { pitch: 6.0, w: 4.8, depth: 0.5 }));
  }
  plinth = plinth.subtract(union(q));
}

// ---------- parkeergarage met daktuin ----------
let garage = prism(GARAGE, BASE, z(H.garage));
{
  // Borstweringen langs de lange zijden (0,6 m breed).
  const rimEast = prism(offsetStrip([28.71, -19.01], [26.18, 98.75], 0.6), z(H.garage) - 0.01, z(H.garageRim));
  const rimWest = prism(offsetStrip([10.82, 99.12], [12.28, 14.48], 0.6, 0), z(H.garage) - 0.01, z(H.garageRim));
  const stair = prism(circle(GARAGE_STAIR.c, GARAGE_STAIR.r, 24), z(H.garage) - 0.01, z(H.garageStair));
  const [x0, y0, x1, y1] = GARAGE_BOX;
  const lift = box(x0, y0, z(H.garage) - 0.01, x1, y1, z(H.garageStair));
  garage = union([garage, rimEast, rimWest, stair, lift]);
  // Parkeerdekken: vier lagen open gevel tussen pijlers van circa 1,1 m.
  const decks = [[1.4, 3.4], [4.3, 6.3], [7.2, 9.2], [10.1, 12.1]];
  const q = [];
  for (const [a, b] of [[[13.2, -19.31], [28.71, -19.01]], [[28.71, -19.01], [26.18, 98.75]], [[26.18, 98.75], [10.82, 99.12]]]) {
    q.push(...grid(a, b, decks, { pitch: 7.5, w: 6.4, margin: 1.0, depth: 0.45 }));
  }
  garage = garage.subtract(union(q));
}
// Strook van `width` aan de binnenkant (links) van de lijn a->b.
function offsetStrip(a, b, width) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [-dy / len, dx / len];
  return [a, b, [b[0] + n[0] * width, b[1] + n[1] * width], [a[0] + n[0] * width, a[1] + n[1] * width]];
}

let model = union([core, stacks, crown, top, mast, plinth, garage]);
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 20);
console.log("ondervlakken > 20 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Cooltoren met balkonstapels middenkroon plint en parkeergarage", model]],
  catalog: {
    name: "Cooltoren",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straat aan de Baan (west), ten zuiden van de plint en oostelijk van de
    // garage, AHN5-DTM NAP +0,4 tot +0,65 m.
    groundSamplePoints: [[-21, -30], [-21, 0], [-21, 25], [0, -30], [31, -20], [31, 0]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100100017348", "NL.IMBAG.Pand.0599100100017388"],
    description:
      "Oorsprong in het hart van de schacht op straatniveau NAP +0,5 m, +X langs de gevels op -0,8 graden in RD (oost, naar de garage), +Y naar het noorden; schacht van 28 m met twee uitgebouwde balkonstapels en een gleuf per gevel en terugliggende hoeken, middenkroon als uitkragende band van 32,5 m van NAP +72,8 tot +83,3, de hoeken boven +136,7 weggesneden, dak +151,2 met dakopbouw tot +155,0 en antenne tot +160,5; plint tot +21,7 en parkeergarage met daktuin tot +12,85; hoogtes uit AHN5 (2023), balkon- en vloerritme uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      plinthNapM: H.plinth,
      garageNapM: H.garage,
      crownNapM: [+f(CROWN[0]).toFixed(2), +(f(CROWN[1]) + BAND).toFixed(2)],
      cornerTerraceNapM: +f(CORNER_FROM).toFixed(2),
      roofNapM: H.roof,
      topNapM: H.top,
      mastTopNapM: H.mast,
      coreM: [+(CORE.u1 - CORE.u0).toFixed(2), +(CORE.v1 - CORE.v0).toFixed(2)],
      crownM: [+(CROWN_BOX.u1 - CROWN_BOX.u0).toFixed(2), +(CROWN_BOX.v1 - CROWN_BOX.v0).toFixed(2)],
      storeyPitchM: +P.toFixed(3),
      axisDegrees: AXIS_DEG,
      estimates: [
        "verdiepingsteek 2,90 m (49 woonlagen tussen NAP +9,0 en het dak) uit de 51 lagen van Wikipedia en de AHN-hoogtes van kroon, gleufdak en hoekterrassen",
        "balkonplaat 1,72 m en balkonruimte 1,18 m (0,9 m diep), vloerrand 0,55 m in de hoekzones, uit foto's",
        "stapels en gleuven onder de kroon gelijk aan die erboven (AHN ziet alleen het bovenste deel), uit foto's van alle kanten",
        "terrassen tussen de kroonbanden 1,5 m diep, uit foto's",
        "dakopbouw als 1,0 m teruggezette laag onder de dakplaat, antenne als paal van 1,0 m",
        "vensterraster van de plint (pui en vier lagen) en de open dekken van de garage",
      ],
    },
    sources: [
      "PDOK BAG panden 0599100100017348 en 0599100100017388 en Actueel_orthoHR; 2026-10-11",
      "AHN5 DSM/DTM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; het PDOK-AHN (AHN4) toont de toren nog in aanbouw",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100017348 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes ter controle",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100017388 (3D BAG, CC BY 4.0)",
      "https://nl.wikipedia.org/wiki/Cooltoren",
      "https://commons.wikimedia.org/wiki/File:Cooltoren_-_september_2022.jpg",
      "https://commons.wikimedia.org/wiki/File:Cooltoren_(Rotterdam).jpg",
      "https://commons.wikimedia.org/wiki/File:De_Cooltoren_in_de_skyline_van_Rotterdam_-_cropped.jpg",
      "https://commons.wikimedia.org/wiki/File:Cooltoren_gezien_vanaf_Terwenakker.jpg",
      "https://commons.wikimedia.org/wiki/File:CoolToren_en_BaanTower.jpg",
      "https://commons.wikimedia.org/wiki/File:Cool_Tower.jpg",
    ],
  },
});

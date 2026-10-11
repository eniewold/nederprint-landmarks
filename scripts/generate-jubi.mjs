// JuBi (Turfmarkt 147, Den Haag; Hans Kollhoff, 2012): rijkskantoor van de
// ministeries van Justitie en Veiligheid (rode toren) en Binnenlandse Zaken en
// Koninkrijksrelaties (witte toren). Twee torens van 146 m met 37 lagen op een
// gezamenlijke onderbouw, met tussen de torens een glazen atrium van vier hoge
// lagen met de hoofdingang aan het plein aan de Turfmarkt. De torens zijn geen
// rechthoeken: elk heeft twee haakse en twee schuine gevels (de rode toren
// loopt naar het plein toe uit in een spitse hoek van 64 graden). Beide
// springen terug: de witte toren aan de west- en noordwestkant op +88,1 en op
// de zuidoosthoek op +123,5, de rode toren aan de oostgevel en de noordoosthoek
// op +105,9. Bovenop een kroon van stenen stijlen die als kantelen boven de
// gevel uitsteken (+147,2), met daarachter een terras op +139,4, een dakopbouw
// tot +144,7 en een kleinere opbouw tot +147,3. Gevels van baksteen (rood) en
// natuursteen (wit) met sterk verticale lisenen en één venster per travee van
// 2,7 m, op een plint van donkere natuursteen. De onderbouw (rode baksteen)
// vult de rest van het blok tot +42,1, aan de zuidoostkant boven +24 terug,
// met op het oostdeel een daktuin. Vlakken en benoemde bouwdelen, geen
// gestapelde DSM-lagen. Voorbeelden per rij: generate-evoluon.mjs (aanpak
// primitieven), generate-haagse-toren.mjs, generate-hoftoren.mjs en
// generate-de-kroon-den-haag.mjs (de buurman, skylinetorens op efteling-kit.mjs).
//
//   node scripts/generate-jubi.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong op RD (81975, 455072), in het atrium bij de
// noordoosthoek van de witte toren, z = 0 op NAP +0,72 m (straten rondom:
// AHN-DTM +0,69 tot +0,98; het plein aan de Turfmarkt loopt op tot +1,5), Z
// omhoog. +X loopt op 37,4 graden in RD langs de zuidoostgevel van het blok
// (BAG 37,4 graden), +Y op 127,4 graden naar het noordwesten (BAG-gevel aan
// het water, 127,4 graden). De rode toren staat aan +X, de witte aan -X, De
// Kroon grenst aan -X (gemeenschappelijke muur op x = -40,8), het plein aan de
// Turfmarkt ligt aan -X/+Y.
//
// Bronnen: BAG-pand 0518100001635181 (contour van het hele complex), AHN
// DSM/DTM 0,5 m (PDOK WCS, in dit stelsel uitgelezen: torencontouren,
// terugsprongen, kroonstijlen en terras), 3D BAG LoD2.2 (TU Delft/3D
// geoinformatie, CC BY 4.0: dakhoogtes 19,3 / 24,0 / 42,1 / 45,7 / 46,4 /
// 88,1 / 105,9 / 123,5 / 139,4 / 144,67 / 147,27 / 150,0 en de opbouwen op de
// daken), Actueel_orthoHR, Wikipedia (146 m, 37 lagen, Kollhoff, 2012) en
// Commons-foto's van alle kanten (kronen, terugsprongen, gevelritme, plint,
// atrium).
import { Manifold, CrossSection, prism, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "jubi";
const AXIS_DEG = 37.4;
const RAD = (AXIS_DEG * Math.PI) / 180;
const ORIGIN = [81975.0, 455072.0];
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 0.72;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  atrium: 19.3, // glazen atrium tussen de torens (3D BAG 19,16-19,35; AHN: glas, geen punten)
  low: 24.0, // onderbouw aan de zuidoostgevel en de noordwesthoek (3D BAG 23,3-24,25)
  plinth: 29.3, // bovenkant van de natuurstenen plint van de torens (foto's: acht lagen)
  slab: 42.1, // onderbouw (3D BAG 42,05-42,16, AHN 42-43)
  garden: 45.7, // daktuin op het oostdeel (3D BAG 45,7)
  gardenRim: 46.4, // rand en opbouw rond de daktuin (3D BAG 46,4)
  plant: 43.5, // installatieblok op het westdeel (3D BAG 43,5)
  whiteStep: 88.1, // terugsprong van de witte toren aan de west- en noordwestkant (3D BAG 88,12, AHN 88)
  redStep: 105.9, // terugsprong van de rode toren aan de oostgevel en noordoosthoek (3D BAG 105,4-105,9, AHN 106)
  whiteNotch: 123.5, // terugsprong op de zuidoosthoek van de witte toren (3D BAG 123,5, AHN 123)
  terrace: 139.4, // terras achter de kroonstijlen (3D BAG 139,4, AHN 139,3-139,4)
  roof: 144.67, // dakopbouw binnen het terras (3D BAG 144,67, AHN 144,6)
  box: 147.27, // kleinere opbouw (3D BAG 147,24-147,27, AHN 147)
  teeth: 147.2, // top van de kroonstijlen (AHN, 98e percentiel langs de gevels 146,8-147,3)
  plantTop: 150.0, // installatieblokje (3D BAG 149,95-150,2)
};
const STEP_PARAPET = 3.0; // stijlen op de terugsprongen (foto's)
const CROWN_SILL = 1.2; // borstwering tussen de kroonstijlen boven het terras
const RING = 1.0; // diepte van de kroonstijlen
const ROOF_INSET = 2.5; // dakopbouw achter het terras (AHN: 139,4 tot 2,5 m achter de gevel)

// ---------- plattegrond (m, gebouwstelsel) ----------
// BAG-contour (alleen ter controle en voor de onderbouw); de westrand is de
// gemeenschappelijke muur met De Kroon (BAG x -40,79..-40,89), hier 0,03 m naar
// binnen zodat de twee landmarks niet overlappen.
const WALL = (y) => -40.79 - (0.1 * (y + 36.28)) / 71.78 + 0.03;
// Schuine noordgevel van de witte toren en de onderbouw ernaast (BAG
// (1,66, 2,77)-(-34,24, 15,43)); 0,3 m naar binnen voor de gevel.
const NW_LINE = (x) => 2.77 + ((15.43 - 2.77) * (x - 1.66)) / (-34.24 - 1.66) - 0.3;

// Witte toren (BZK). Westgevel schuin (u = -29,4 - 0,1625 v, AHN-rand per
// meter), zuidgevel op de BAG-gevel, oostgevel aan het atrium (AHN 2,3),
// noordgevel langs de BAG-lijn en naar het westen 1-3 m terug (AHN).
// Onder +88,1 steekt de westgevel 2,2 m verder uit en loopt de noordgevel tot
// de BAG-lijn door (3D BAG-terras 88,12, AHN 88).
const W_E = 2.3;
const W_S = -36.25;
const wWest = (v, d = 0) => -29.4 - 0.1625 * v - d;
const WHITE_BASE = [[wWest(W_S, 2.2), W_S], [W_E, W_S], [W_E, NW_LINE(W_E)], [-33.9, NW_LINE(-33.9)]];
const WHITE_UP = [[wWest(W_S), W_S], [W_E, W_S], [W_E, NW_LINE(W_E)], [-17.0, NW_LINE(-17.0)], [wWest(10.9), 10.9]];
// Zuidoosthoek boven +123,5: 2,8 m terug, 14,8 m lang (3D BAG, AHN 123 op u 0..2,3).
const NOTCH = { u: -0.5, v: -21.5 };
const WHITE_TOP = [[wWest(W_S), W_S], [NOTCH.u, W_S], [NOTCH.u, NOTCH.v], [W_E, NOTCH.v], [W_E, NW_LINE(W_E)], [-17.0, NW_LINE(-17.0)], [wWest(10.9), 10.9]];

// Rode toren (Justitie). Noordgevel en oostgevel haaks (BAG), zuidgevel schuin
// (AHN: v = -7,0 - 0,33 (u - 22,5)), westgevel naar het plein schuin (AHN en
// BAG-punt (0,93, 35,64): u = 18,4 - 0,49 v). Boven +105,9 springt de oostgevel
// 3,1 m terug en de noordgevel naast de oostgevel 2,5 m (3D BAG, AHN 106).
const R_N = 35.55;
const R_E = 42.65;
const R_E_UP = 39.5;
const rWest = (v) => 18.4 - 0.49 * v;
const R_SW = [21.7, -6.74]; // snijpunt zuid- en westgevel
const RED_BASE = [[rWest(R_N), R_N], R_SW, [R_E_UP, -12.6], [R_E, -13.95], [R_E, R_N]].reverse();
const RED_UP = [[rWest(R_N), R_N], R_SW, [R_E_UP, -12.6], [R_E_UP, 33.0], [29.0, 33.0], [29.0, R_N]].reverse();

// Onderbouw. West: tussen de muur met De Kroon en de witte toren, tot +42,1;
// de strook aan de zuidoostgevel (v < -33,6) en het noordelijke uiteinde
// (v > 25,5) tot +24,0 (3D BAG). Oost: tussen de witte en de rode toren tot
// +42,1, met dezelfde lage strook langs de zuidoostgevel en een daktuin.
const LOW_FRONT = -33.6; // gevel boven +24 aan de zuidoostkant (3D BAG)
const WEST_ALL = [[WALL(W_S), W_S], [wWest(W_S, 2.2), W_S], [-33.9, NW_LINE(-33.9)], [-34.24, 15.43 - 0.3], [-37.62, 35.5], [WALL(35.5), 35.5]];
const WEST_HIGH_V = 25.5;
const EAST_ALL = [[W_E, W_S], [R_E, W_S], [R_E, -13.95], [R_E_UP, -12.6], R_SW, [W_E, -11.0]];
const GARDEN = [[7.1, -28.7], [37.5, -28.7], [37.6, -19.5], [31.4, -16.7], [15.7, -16.5], [7.3, -19.2]];
const WEST_PLANT = [[-37.2, -27.6], [-35.1, -27.6], [-35.1, -18.3], [-37.2, -18.3]];
// Atrium tussen de torens: glazen voorgevel aan het plein (BAG x = 1,63),
// tot de schuine westgevel van de rode toren.
const ATRIUM = [[W_E, -11.0], R_SW, [rWest(34.2), 34.2], [1.63, 34.2], [1.63, 2.77], [W_E, NW_LINE(W_E)]];

// Opbouwen op de daken (3D BAG-vlakken, in dit stelsel).
const RED_BOX = [[16.8, 20.9], [22.7, 7.4], [31.7, 8.3], [32.7, 23.0], [17.5, 23.3]];
const WHITE_BOX = [[-19.1, -2.2], [-20.9, -4.6], [-18.5, -21.9], [-6.4, -22.1], [-6.5, -6.5]];
const RED_PLANT = [[33.8, 26.1], [36.4, 26.1], [36.4, 27.7], [33.8, 27.7]];
const WHITE_PLANT = [[-3.1, -7.4], [-0.4, -7.4], [-0.4, -4.5], [-3.1, -4.5]];

// ---------- gevelritme ----------
// Travees van 2,7 m (AHN: kroonstijlen op 2,75-2,9 m), op één raster per
// gevellijn zodat vensters boven en onder een terugsprong op één lijn staan.
// 37 lagen: een hoge begane grond tot +7,4 en 36 lagen van 3,55 m tot +135,2
// (Wikipedia 37 lagen); ramen 1,3 x 2,15 m als nissen van 0,35 m, de stijlen
// ertussen blijven als lisenen staan.
const PITCH = 2.7;
const NICHE = 0.35;
const FLOOR1 = 7.4;
const STOREY = 3.55;
const floors = Array.from({ length: 36 }, (_, k) => +(FLOOR1 + STOREY * k).toFixed(3));
const ROWS = floors.map((f) => [+(f + 0.85).toFixed(3), +(f + 3.0).toFixed(3)]);
const GROUND_ROW = [1.1, 6.4]; // winkelpuien en ingangen
const PLINTH_BAND = [28.45, 29.3]; // lijst op de plint van de torens (tussen twee vensterrijen)

// ---------- hulpfuncties ----------
const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const polysOf = (section) => section.toPolygons().map((r) => r.map((p) => [p[0], p[1]]));
// Blinde nis in de rand a→b (buitenkant rechts in een tegen de klok in lopende
// veelhoek): s0..s1 vanaf a, NAP-hoogtes, `depth` de gevel in, `out` naar buiten.
const niche = (a, b, s0, s1, nap0, nap1, depth = NICHE, out = 0.2) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return Manifold.cube([depth + out, s1 - s0, nap1 - nap0])
    .translate([-depth, s0, z(nap0)])
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
// Travees langs de rand a→b op het vaste raster (middens op (k + 1/2) * PITCH
// langs de gevelrichting, gemeten vanaf de oorsprong), minstens `margin` van de
// hoeken.
function bays(a, b, width, margin = 0.45) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const ta = a[0] * d[0] + a[1] * d[1];
  const out = [];
  for (let k = Math.ceil((ta + margin + width / 2) / PITCH - 0.5); ; k++) {
    const s = (k + 0.5) * PITCH - ta;
    if (s + width / 2 > len - margin) break;
    if (s - width / 2 >= margin) out.push(s);
  }
  return out;
}
const edges = (poly) => {
  const P = ccw(poly);
  return P.map((a, i) => [a, P[(i + 1) % P.length]]);
};

// Volumes als (veelhoeken, z0, z1) in NAP, voor de controle waar een gevel vrij ligt.
const volumes = [];
const addVolume = (section, nap0, nap1) => {
  volumes.push({ polys: polysOf(section), nap0, nap1 });
  return prismCs(section, nap0 === null ? BASE : z(nap0), z(nap1));
};
const pip = (polys, x, y) => {
  let inside = false;
  for (const P of polys)
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const [xi, yi] = P[i];
      const [xj, yj] = P[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
  return inside;
};
const solidAt = (x, y, nap) => volumes.some((v) => (v.nap0 === null || nap >= v.nap0) && nap <= v.nap1 && pip(v.polys, x, y));

// Vensternissen op alle randen van een veelhoek, per rij, alleen waar de gevel
// over de hele nis vrij ligt (buiten leeg, binnen massief): zo vallen nissen weg
// achter aangrenzende bouwdelen en onder de daken van lagere delen.
const niches = new Map();
function facade(poly, rows, width, { margin = 0.45, depth = NICHE } = {}) {
  for (const [a, b] of edges(poly)) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < width + 2 * margin) continue;
    const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    const n = [d[1], -d[0]]; // naar buiten
    for (const s of bays(a, b, width, margin)) {
      const at = (t, off) => [a[0] + d[0] * t + n[0] * off, a[1] + d[1] * t + n[1] * off];
      for (const [r0, r1] of rows) {
        const free = [s - width / 2 - 0.05, s, s + width / 2 + 0.05].every((t) =>
          [r0 + 0.05, (r0 + r1) / 2, r1 - 0.05].every((h) => !solidAt(...at(t, 0.15), h) && solidAt(...at(t, -0.6), h)),
        );
        if (!free) continue;
        const key = [...at(s, 0).map((c) => c.toFixed(2)), r0].join("|");
        if (!niches.has(key)) niches.set(key, niche(a, b, s - width / 2, s + width / 2, r0, r1, depth));
      }
    }
  }
}
// Kantelen: ring van RING m langs de gevels van `outer` (zonder het deel binnen
// `inner`), van nap0 tot nap1, met per travee een open sleuf vanaf nap0 + sill.
function crenels(outer, inner, nap0, nap1, sill) {
  let ring = cs(outer).subtract(cs(outer).offset(-RING, "Miter"));
  if (inner) ring = ring.subtract(cs(inner));
  let solid = prismCs(ring, z(nap0) - 0.01, z(nap1));
  const slots = [];
  for (const [a, b] of edges(outer)) {
    for (const s of bays(a, b, PITCH - RING, 0.6)) slots.push(niche(a, b, s - (PITCH - RING) / 2, s + (PITCH - RING) / 2, nap0 + sill, nap1 + 1, RING + 0.5, 0.5));
  }
  if (slots.length) solid = solid.subtract(union(slots));
  return solid;
}

const parts = [];
// ---------- onderbouw ----------
const westAll = cs(WEST_ALL);
const westHigh = westAll.intersect(cs([[-60, LOW_FRONT], [0, LOW_FRONT], [0, WEST_HIGH_V], [-60, WEST_HIGH_V]]));
parts.push(addVolume(westAll, null, H.low), addVolume(westHigh, null, H.slab), addVolume(cs(WEST_PLANT), H.slab - 0.01, H.plant));
const eastAll = cs(EAST_ALL);
const eastHigh = eastAll.intersect(cs([[0, LOW_FRONT], [60, LOW_FRONT], [60, 60], [0, 60]]));
parts.push(addVolume(eastAll, null, H.low), addVolume(eastHigh, null, H.slab));
// Daktuin: rand tot +46,4, de tuin 0,7 m lager (+45,7).
{
  const g = cs(GARDEN);
  volumes.push({ polys: polysOf(g), nap0: H.slab - 0.01, nap1: H.gardenRim });
  parts.push(prismCs(g, z(H.slab) - 0.01, z(H.gardenRim)).subtract(prismCs(g.offset(-1.0, "Miter"), z(H.garden), z(H.gardenRim) + 1)));
}
// Atrium: glazen dak 0,6 m verdiept binnen een rand van 1,0 m.
{
  const a = cs(ATRIUM);
  volumes.push({ polys: polysOf(a), nap0: null, nap1: H.atrium });
  parts.push(prismCs(a, BASE, z(H.atrium)).subtract(prismCs(a.offset(-1.0, "Miter"), z(H.atrium - 0.6), z(H.atrium) + 1)));
}

// ---------- witte toren ----------
const white = [];
white.push(addVolume(cs(WHITE_BASE), null, H.whiteStep));
white.push(addVolume(cs(WHITE_UP), null, H.whiteNotch));
white.push(addVolume(cs(WHITE_TOP), null, H.terrace));
// ---------- rode toren ----------
const red = [];
red.push(addVolume(cs(RED_BASE), null, H.redStep));
red.push(addVolume(cs(RED_UP), null, H.terrace));

// ---------- kronen en terugsprongen ----------
const crowns = [];
for (const [top, box, plant] of [[WHITE_TOP, WHITE_BOX, WHITE_PLANT], [RED_UP, RED_BOX, RED_PLANT]]) {
  crowns.push(crenels(top, null, H.terrace, H.teeth, CROWN_SILL));
  crowns.push(prismCs(cs(top).offset(-ROOF_INSET, "Miter"), z(H.terrace) - 0.01, z(H.roof)));
  crowns.push(prismCs(cs(box), z(H.roof) - 0.01, z(H.box)));
  crowns.push(prismCs(cs(plant), z(H.roof) - 0.01, z(H.plantTop)));
}
// Stijlen op de terugsprongen (zoals de kroon, lager).
crowns.push(crenels(WHITE_BASE, WHITE_UP, H.whiteStep, H.whiteStep + STEP_PARAPET, 1.0));
crowns.push(crenels(WHITE_UP, WHITE_TOP, H.whiteNotch, H.whiteNotch + STEP_PARAPET, 1.0));
crowns.push(crenels(RED_BASE, RED_UP, H.redStep, H.redStep + STEP_PARAPET, 1.0));

// ---------- gevelreliëf ----------
const TOWERS = [WHITE_BASE, WHITE_UP, WHITE_TOP, RED_BASE, RED_UP];
for (const poly of TOWERS) {
  facade(poly, ROWS, 1.3);
  facade(poly, [GROUND_ROW], 2.0);
}
// Plintlijst: een doorlopende groef over de hele travee (lisenen inbegrepen).
for (const poly of [WHITE_BASE, RED_BASE]) facade(poly, [PLINTH_BAND], PITCH + 0.02, { margin: 0.6, depth: 0.3 });
// Onderbouw: ramen van 1,5 m, winkelpuien op de begane grond.
for (const poly of [WEST_ALL, EAST_ALL, ...polysOf(westHigh), ...polysOf(eastHigh)]) {
  facade(poly, ROWS, 1.5);
  facade(poly, [GROUND_ROW], 2.0);
}
// Atrium: glazen voorgevel in zeven velden met een gouden kader (foto's); de
// velden als nissen van 0,35 m, kader en stijlen van 0,9 m blijven staan.
const hall = [];
{
  const a = [1.63, 2.77];
  const b = [1.63, 34.2];
  const len = b[1] - a[1];
  const n = 7;
  const w = len / n - 0.9;
  // a→b loopt in +y; de buitenkant (-x) ligt links, dus nis op de omgekeerde rand.
  for (let k = 0; k < n; k++) {
    const s = len - (len * (k + 0.5)) / n;
    hall.push(niche(b, a, s - w / 2, s + w / 2, 1.1, H.atrium - 1.6));
  }
}

// ---------- samenstellen ----------
const cuts = [...niches.values(), ...hall];
let model = union([...parts, ...white, ...red, ...crowns]);
model = model.subtract(union(cuts));
// Nissen die een ander bouwdeel afdekt, worden ingesloten holtes: die vallen weg.
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));
console.log("nissen:", cuts.length, "lagen:", floors.length + 1);

const area = (poly) => Math.abs(cs(poly).area()).toFixed(0);
await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:JuBi met twee getrapte torens kantelenkronen atrium en onderbouw", model]],
  catalog: {
    name: "JuBi",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straten aan de zuidoost- (AHN-DTM +0,69..+0,92) en noordoostkant
    // (+0,71..+0,98) en het plein aan de Turfmarkt (+0,77..+0,86); de lader
    // neemt de laagste.
    groundSamplePoints: [[-30, -39], [10, -39], [45, 0], [45, 30], [10, 38], [-25, 25]],
    replacesBuildings: ["NL.IMBAG.Pand.0518100001635181"],
    description:
      "Oorsprong in het atrium bij de witte toren op straatniveau NAP +0,72 m, +X op 37,4 graden in RD langs de zuidoostgevel, +Y naar het noordwesten; twee torens met elk twee haakse en twee schuine gevels: de witte (BZK) springt op +88,1 (west) en +123,5 (zuidoosthoek) terug, de rode (Justitie) op +105,9 (oostgevel en noordoosthoek); kronen van stenen stijlen tot +147,2 rond een terras op +139,4 met dakopbouwen tot +144,7, +147,3 en +150; onderbouw tot +42,1 (zuidoostkant boven +24 terug) met daktuin en een glazen atrium tot +19,3 aan het plein; vensterritme, lagen, plint en kroonstijlen uit foto's en AHN geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      atriumNapM: H.atrium,
      lowNapM: H.low,
      plinthNapM: H.plinth,
      podiumNapM: H.slab,
      gardenNapM: [H.garden, H.gardenRim],
      whiteStepNapM: H.whiteStep,
      whiteNotchNapM: H.whiteNotch,
      redStepNapM: H.redStep,
      terraceNapM: H.terrace,
      roofNapM: H.roof,
      boxNapM: H.box,
      crownTeethNapM: H.teeth,
      plantNapM: H.plantTop,
      towerFootprintM2: { white: +area(WHITE_BASE), red: +area(RED_BASE), whiteTop: +area(WHITE_TOP), redTop: +area(RED_UP) },
      bayPitchM: PITCH,
      storeyPitchM: STOREY,
      axisDegrees: AXIS_DEG,
      estimates: [
        "37 lagen: begane grond tot +7,4 en 36 lagen van 3,55 m (Wikipedia 37 lagen, 146 m); ramen 1,3 x 2,15 m als nissen van 0,35 m op travees van 2,7 m (AHN-kroonstijlen op 2,75-2,9 m)",
        "kroon: stijlen van 1,0 m op elke travee tot +147,2 boven een borstwering van 1,2 m; werkelijk slankere stijlen met open hoekportalen",
        "dakopbouw 2,5 m achter de gevel (AHN: terras 1,5-2,5 m breed); op de zuidgevel van de witte toren staat hij in werkelijkheid dichter op de gevel",
        "stijlen op de terugsprongen 3,0 m hoog uit foto's",
        "plint van natuursteen tot circa +29,3 (acht lagen op de foto's) als lijst van 0,3 m",
        "atrium: glazen dak (geen AHN-punten) 0,6 m verdiept, voorgevel in zeven velden uit foto's",
        "schuine gevels uit de AHN-rand per meter (pixels 0,5 m); de noordgevel van de witte toren boven +88,1 in twee rechte stukken",
      ],
    },
    sources: [
      "PDOK BAG pand 0518100001635181, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001635181 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes, terugsprongen en opbouwen",
      "https://nl.wikipedia.org/wiki/JuBi-gebouw",
      "https://en.wikipedia.org/wiki/JuBi_Building",
      "https://nl.wikipedia.org/wiki/Wijnhavenkwartier",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Skyscrapers_5.jpg",
      "https://commons.wikimedia.org/wiki/File:Turfmarkt,_The_Hague_-_high_rise_offices_and_urban_housing_(2017).jpg",
      "https://commons.wikimedia.org/wiki/File:Government_office_in_The_Hague_housing_the_Dutch_Ministry_of_Justice_and_Security_(2019).jpg",
      "https://commons.wikimedia.org/wiki/File:Uilebomen,_Den_Haag,_Netherlands_-_panoramio_(2).jpg",
      "https://commons.wikimedia.org/wiki/File:Uilebomen,_Den_Haag,_Netherlands_-_panoramio_(38).jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Skyscrapers_1a_(Kollhoff).jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Skyscrapers_4.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Skyscrapers_6.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag,_straatzicht_Turfmarkt_IMG_8931_2019-03-24_16.04.jpg",
    ],
  },
});

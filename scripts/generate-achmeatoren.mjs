// Achmeatoren (Sophialaan 2-50, Leeuwarden; Bonnema Architecten, Abe Bonnema
// en Jan van der Leij, 2002): kantoortoren van 114,6 m bij het station, het
// hoogste gebouw van Noord-Nederland. Het complex bestaat uit twee in elkaar
// geschoven vierkante torens op een glazen voet: de zwarte hoofdtoren (20,4 x
// 19 m, natuursteen) met een glazen band om de observatieruimte onder de
// bovenrand, en daartegen aan de noordwestkant een lichtgrijze lagere toren
// (18,2 x 17,8 m, 68 m, Deloitte). Beide torens staan op kolommen boven een
// glazen hal van twee à drie lagen; aan de straatkant (oost en noordoost) staat
// de hoofdtoren op open kolommen tot +12,2. Aan de zuidkant ligt de glazen
// entreeluifel met een schuin naar buiten hellende glaswand langs het
// stenen kantoor van 1967. Er is geen uitkragende kop: de glazen band ligt in
// het gevelvlak (zie README). Vlakken en benoemde bouwdelen in een eigen
// gebouwstelsel, geen gestapelde DSM-lagen. Voorbeeld per rij:
// generate-evoluon.mjs (aanpak primitieven), generate-haagse-toren.mjs,
// generate-hoftoren.mjs en generate-maastoren.mjs (skylinetorens op
// efteling-kit.mjs).
//
//   node scripts/generate-achmeatoren.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in de overlap van beide torens op RD (182048,
// 579124), z = 0 op NAP +1,3 m (straten en plein rondom: AHN-DTM +1,15 tot
// +1,48), Z omhoog. +X loopt op -4,8 graden in RD, langs de gevels van beide
// torens en de hal (BAG -4,6 tot -5,0 en 85,3 graden); +Y wijst naar het
// noorden. De lagere toren ligt aan -X/+Y, de entreeluifel aan -Y, de straat
// (Sophialaan) aan +X.
//
// Bronnen: BAG-pand 0080100000352634 (beide torens, glazen hal en de strook
// naar het stenen kantoor in één pand, bouwjaar 2002), AHN DSM/DTM 0,5 m (PDOK
// WCS, AHN4, in dit stelsel uitgelezen: gevellijnen, dak +112,44 binnen een
// rand tot +116,05, installaties +115, lagere toren +67,90, hal en luifel
// +12,2), 3D BAG LoD2.2 (TU Delft/3D geoinformatie, CC BY 4.0: dakhoogtes van
// beide torens, installaties, hal +12,2), Actueel_orthoHR (installaties,
// luifel), Wikipedia (114,6 m, 26 lagen) en Commons-foto's van alle kanten
// (vensterritme per gevel, glazen band, kolommen, luifel).
import { CrossSection, Manifold, prism, union, ccw, rect, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "achmeatoren";
const ORIGIN = [182048.0, 579124.0];
const AXIS_DEG = -4.8;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 1.3;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  top: 116.05, // bovenkant van de dakrand van de hoofdtoren (AHN-rand 116,0-116,07; 3D BAG 116,02)
  roof: 112.44, // dak binnen de rand (AHN-fit, 536 punten, rms 0,20)
  plant: 115.0, // installatieopbouwen op het dak (AHN 114,5-115,5; 3D BAG 114,8-115,1)
  band0: 106.9, // glazen band van de observatieruimte (foto's, schaal op de dakhoogtes)
  band1: 111.0,
  louvre0: 96.3, // roosterband boven de bovenste vensterrij (foto's)
  louvre1: 97.5,
  row0: 93.6, // bovenkant van de bovenste vensterrij (foto's)
  storey: 3.72, // verdiepingshoogte: dezelfde vloeren in beide torens (foto's, 22 rijen)
  low: 67.9, // dak van de lagere toren (AHN-fit, 486 punten, rms 0,10; 3D BAG 67,9)
  hall: 12.2, // glazen hal, strook en entreeluifel (3D BAG 12,1-12,3; AHN-glas 10-12,3)
};
const WIN = 1.3; // vensters 1,3 x 1,3 m (foto's)
const NICHE = 0.35;
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
// 22 vensterrijen in de hoofdtoren (bovenste rij +92,3..+93,6), de lagere toren
// heeft de rijen 8 tot en met 21 (bovenste +62,6..+63,9).
const ROWS = range(22, (k) => [H.row0 - H.storey * k - WIN, H.row0 - H.storey * k]);
const ROWS_LOW = ROWS.slice(8);
// Voegen tussen de natuursteenplaten per verdieping (0,3 m, 0,25 m diep), 0,95 m
// boven elke vensterrij, doorlopend tot onder de dakrand.
const JOINTS = range(28, (k) => H.row0 + 0.95 - H.storey * (k - 5)).filter((j) => j > H.hall + 1.5 && j < H.top - 1.0);

// ---------- plattegrond (m, gebouwstelsel) ----------
// Hoofdtoren: BAG-oost- en zuidgevel, AHN-west- en noordgevel (u -3,8..16,6,
// v -13,1..5,9).
const MAIN = rect(-3.8, -13.1, 16.6, 5.9);
// Lagere toren: AHN-contour van het dak op +67,9 (u -12,6..5,6, v -3,6..14,2).
const LOW = rect(-12.6, -3.6, 5.6, 14.2);
// Glazen hal en strook: de BAG-contour van het pand (vereenvoudigd).
const HALL = [
  [-16.4, -9.4], [-3.8, -9.4], [-3.8, -15.1], [10.9, -15.1], [10.8, -13.1], [16.6, -13.1], [16.6, 5.9],
  [8.2, 6.0], [6.9, 15.45], [-16.4, 15.45],
];
// Installatieopbouwen (AHN, 3D BAG): oostelijk blok en blok midden op het dak.
const PLANT_E = rect(9.0, -10.3, 12.8, 3.3);
const PLANT_M = rect(0.8, -3.8, 7.4, 2.8);
// Entreeluifel (ortho: dakrand; AHN-glas +12,2 op v -16..-31): bovenaan een
// scheve vierhoek tussen de toren en de zuidpunt, de oostwand helt 1,6 m naar
// buiten (foto), de west- en zuidwand staan recht.
// De noordrand ligt 0,3 m in de toren, de westrand raakt de strook.
const CANOPY_TOP = [[10.6, -12.8], [16.6, -12.8], [20.4, -33.4], [13.2, -33.4]];
const LEAN = 1.6;
const CANOPY_FOOT = [[10.6, -12.8], [16.6 - LEAN, -12.8], [20.4 - LEAN, -33.4], [13.2, -33.4]];

// ---------- hulpfuncties ----------
const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
// Blinde nis in de gevel a→b (buitenkant rechts, tegen de klok in rond de
// veelhoek): s0..s1 vanaf a, NAP-hoogtes, diepte in de gevel en `out` naar buiten.
const niche = (a, b, s0, s1, nap0, nap1, depth = NICHE, out = 1.0) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return Manifold.cube([depth + out, s1 - s0, nap1 - nap0])
    .translate([-depth, s0, z(nap0)])
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
const edge = (poly, i) => [poly[i], poly[(i + 1) % poly.length]];
const lenOf = ([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]);
// Vensterkolommen op middens `centers` (m vanaf a), breedte w, rijen in NAP.
const windows = (a, b, centers, w, rows, depth = NICHE) =>
  centers.flatMap((s) => rows.map(([r0, r1]) => niche(a, b, s - w / 2, s + w / 2, r0, r1, depth)));
// n kolommen op steek `pitch`, gecentreerd op `mid`.
const grid = (n, pitch, mid) => range(n, (k) => mid + pitch * (k - (n - 1) / 2));
// Nis in een hellend vlak: punten P(s, t) = onderlijn a0→b0 op t = 0 en
// bovenlijn a1→b1 op t = 1 (3D, wereldmaten), buitennormaal `nrm`.
function slantNiche(a0, b0, a1, b1, s0, s1, t0, t1, nrm, depth) {
  const lerp = (p, q, f) => p.map((c, i) => c + (q[i] - c) * f);
  const pts = [];
  for (const s of [s0, s1]) {
    for (const t of [t0, t1]) {
      const p = lerp(lerp(a0, b0, s), lerp(a1, b1, s), t);
      pts.push(p.map((c, i) => c - nrm[i] * depth), p.map((c, i) => c + nrm[i] * 1.0));
    }
  }
  return Manifold.hull(pts);
}

// ---------- hoofdtoren ----------
const mainCs = cs(MAIN);
const pilCuts = [];
let main = prismCs(mainCs, BASE, z(H.top)).subtract(prismCs(mainCs.offset(-1.0, "Miter"), z(H.roof), z(H.top) + 1));
{
  const cuts = [];
  const [eS, eE, eN, eW] = MAIN.map((_, i) => edge(MAIN, i)); // zuid, oost, noord, west
  // Vensters (Commons: Achmeatoren_Leeuwarden_1.jpg, Achmeatoren_FvL.jpg,
  // 20100707_Sophialaan_2-50_(Achmeatoren)_Leeuwarden_NL.jpg): noord- en
  // oostgevel tien vensters per rij op 1,7 m; zuidgevel twee smalle
  // vensterkolommen aan de westkant en een groep van vier aan de oostkant;
  // westgevel twee vensters aan de noordkant, verder dicht met een verticale voeg.
  const nN = grid(10, 1.7, lenOf(eN) / 2);
  const nE = grid(10, 1.7, lenOf(eE) / 2);
  const sS = [5.4, 7.3];
  const gS = grid(4, 1.8, 14.6);
  const wW = [2.6, 4.4];
  cuts.push(...windows(...eN, nN, WIN, ROWS), ...windows(...eE, nE, WIN, ROWS));
  cuts.push(...windows(...eS, sS, 0.9, ROWS), ...windows(...eS, gS, WIN, ROWS));
  cuts.push(...windows(...eW, wW, WIN, ROWS));
  cuts.push(niche(...eW, 12.0, 12.5, H.hall, H.louvre1, 0.3));
  // Roosterband boven de bovenste vensterrij, over de breedte van de vensters.
  const span = (cs_, w) => [cs_[0] - w / 2 - 0.2, cs_[cs_.length - 1] + w / 2 + 0.2];
  for (const [e, c] of [[eN, nN], [eE, nE], [eS, gS], [eW, wW]]) {
    const [s0, s1] = span(c, WIN);
    cuts.push(niche(...e, s0, s1, H.louvre0, H.louvre1, 0.3));
  }
  // Glazen band van de observatieruimte rondom, 2,2 m van de hoeken: ruiten
  // van 1,2 m tussen stijlen van 0,5 m, 0,45 m diep, met een kozijn van 0,2 m.
  for (const e of [eS, eE, eN, eW]) {
    const len = lenOf(e);
    cuts.push(niche(...e, 2.2, len - 2.2, H.band0, H.band1, 0.2));
    const n = Math.round((len - 4.4) / 1.7);
    cuts.push(...windows(...e, grid(n, (len - 4.4) / n, len / 2), 1.2, [[H.band0 + 0.3, H.band1 - 0.3]], 0.45));
  }
  // Plaatvoegen per verdieping rondom.
  for (const e of [eS, eE, eN, eW]) for (const j of JOINTS) cuts.push(niche(...e, 0.6, lenOf(e) - 0.6, j - 0.15, j + 0.15, 0.25));
  // Open kolommen aan de straat (oostgevel, en de noordgevel oostelijk van de
  // hal): 1,2 m terugliggende glazen pui tot +12,2 tussen kolommen van 1,6 m
  // (Commons: Leeuwarden,_de_Achmeatoren_foto3, de entreeluifel-foto).
  const pil = (e, cols) => {
    const len = lenOf(e);
    const bounds = [...cols.map((c) => [c - 0.8, c + 0.8])];
    let s = 0;
    for (const [c0, c1] of bounds) {
      if (c0 - s > 0.5) pilCuts.push(niche(...e, s, c0, GROUND_NAP + BASE - 0.1, H.hall, 1.2));
      s = c1;
    }
    if (len - s > 0.5) pilCuts.push(niche(...e, s, len, GROUND_NAP + BASE - 0.1, H.hall, 1.2));
  };
  pil(eE, [0.8, 6.33, 12.67, lenOf(eE) - 0.8]);
  pil([eN[0], [8.2, 5.9]], [0.8, 4.6]);
  main = main.subtract(union([...cuts, ...pilCuts]));
}
// Installatieopbouwen.
const plant = union([prism(PLANT_E, z(H.roof) - 0.1, z(H.plant)), prism(PLANT_M, z(H.roof) - 0.1, z(H.plant))]);

// ---------- lagere toren ----------
const lowCs = cs(LOW);
let low = prismCs(lowCs, BASE, z(H.low));
{
  const cuts = [];
  const [eS, eE, eN, eW] = LOW.map((_, i) => edge(LOW, i));
  // Noordgevel acht vensters op 1,84 m (Achmeatoren_Leeuwarden_1.jpg), westgevel
  // acht (Leeuwarden,_de_Achmeatoren_foto3), de vrije delen van zuid- en
  // oostgevel twee (20100707_Sophialaan; Achmeatoren_FvL.jpg).
  cuts.push(...windows(...eN, grid(8, 1.84, 9.6), WIN, ROWS_LOW));
  cuts.push(...windows(...eW, grid(8, 1.84, 9.4), WIN, ROWS_LOW));
  cuts.push(...windows(...eS, [5.0, 6.8], WIN, ROWS_LOW));
  cuts.push(...windows(...eE, [12.7, 14.6], WIN, ROWS_LOW));
  for (const e of [eS, eE, eN, eW]) for (const j of JOINTS.filter((j) => j < H.low - 1.0)) cuts.push(niche(...e, 0.6, lenOf(e) - 0.6, j - 0.15, j + 0.15, 0.25));
  low = low.subtract(union(cuts));
}

// ---------- glazen hal en strook ----------
let hall = prism(HALL, BASE, z(H.hall));
{
  // Glazen pui met stijlen op 1,8 m aan de straatkanten (noord en de schuine
  // noordoostrand); west- en zuidrand grenzen aan het kantoor van 1984.
  const cuts = [];
  for (const i of [7, 8]) {
    const e = edge(HALL, i);
    const len = lenOf(e);
    const n = Math.round(len / 1.8);
    cuts.push(...windows(...e, grid(n, len / n, len / 2), 1.3, [[GROUND_NAP + 0.4, H.hall - 0.8]], 0.3));
  }
  hall = hall.subtract(union([...cuts, ...pilCuts]));
}

// ---------- entreeluifel ----------
let canopy = Manifold.hull([
  ...CANOPY_FOOT.map(([u, v]) => [u, v, BASE]),
  ...CANOPY_TOP.map(([u, v]) => [u, v, z(H.hall)]),
]);
{
  const cuts = [];
  const zb = z(GROUND_NAP + 2.4); // onderkant van het glas: daaronder staan de kolommen
  const zt = z(H.hall - 0.6);
  // Hellende oostwand: van (16,6-LEAN; -13,1) naar (20,4-LEAN; -33,4) op de voet.
  const at = (p0, p1, zz) => {
    const f = (zz - BASE) / (z(H.hall) - BASE);
    return [p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f, zz];
  };
  const eA0 = at(CANOPY_FOOT[1], CANOPY_TOP[1], zb), eB0 = at(CANOPY_FOOT[2], CANOPY_TOP[2], zb);
  const eA1 = at(CANOPY_FOOT[1], CANOPY_TOP[1], zt), eB1 = at(CANOPY_FOOT[2], CANOPY_TOP[2], zt);
  const d = [eB0[0] - eA0[0], eB0[1] - eA0[1]];
  const dl = Math.hypot(...d);
  const up = [eA1[0] - eA0[0], eA1[1] - eA0[1], eA1[2] - eA0[2]];
  const along = [d[0] / dl, d[1] / dl, 0];
  let nrm = [along[1] * up[2] - along[2] * up[1], along[2] * up[0] - along[0] * up[2], along[0] * up[1] - along[1] * up[0]];
  const nl = Math.hypot(...nrm);
  nrm = nrm.map((c) => c / nl);
  if (nrm[0] < 0) nrm = nrm.map((c) => -c);
  const nE = Math.round(dl / 1.8);
  for (let k = 0; k < nE; k++) {
    const s0 = (k + 0.18) / nE, s1 = (k + 0.82) / nE;
    cuts.push(slantNiche(eA0, eB0, eA1, eB1, s0, s1, 0, 1, nrm, 0.3));
  }
  // Voet: open kolomzone als nis van 0,5 m rondom (zonder de torenzijde).
  const footE = [at(CANOPY_FOOT[1], CANOPY_TOP[1], BASE), at(CANOPY_FOOT[2], CANOPY_TOP[2], BASE)];
  const footE1 = [at(CANOPY_FOOT[1], CANOPY_TOP[1], zb), at(CANOPY_FOOT[2], CANOPY_TOP[2], zb)];
  cuts.push(slantNiche(footE[0], footE[1], footE1[0], footE1[1], 0.02, 1.02, -0.1, 1, nrm, 0.5));
  // Rechte zuid- en westwand: glasstijlen op 1,8 m en de kolomzone.
  for (const [a, b] of [[CANOPY_FOOT[3], CANOPY_FOOT[2]], [CANOPY_FOOT[0], CANOPY_FOOT[3]]]) {
    const len = lenOf([a, b]);
    const n = Math.round(len / 1.8);
    cuts.push(...windows(a, b, grid(n, len / n, len / 2), 1.2, [[GROUND_NAP + 2.4, H.hall - 0.6]], 0.3));
    cuts.push(niche(a, b, -0.5, len - 0.6, GROUND_NAP + BASE - 0.1, GROUND_NAP + 2.4, 0.5));
  }
  // Glazen dak: velden tussen de spanten op 2,3 m, 0,25 m verdiept.
  const nB = 9;
  for (let k = 0; k < nB; k++) {
    const v0 = -13.1 - (20.3 * (k + 0.1)) / nB, v1 = -13.1 - (20.3 * (k + 0.9)) / nB;
    const uw = (v) => 10.6 + (2.6 * (-12.8 - v)) / 20.6 + 0.5;
    const ue = (v) => 16.6 + (3.8 * (-12.8 - v)) / 20.6 - 0.5;
    cuts.push(prism([[uw(v0), v0], [ue(v0), v0], [ue(v1), v1], [uw(v1), v1]], z(H.hall) - 0.25, z(H.hall) + 1));
  }
  canopy = canopy.subtract(union(cuts));
}

// Nissen die een ander bouwdeel afdekt (toren tegen toren, toren tegen hal),
// worden ingesloten holtes: die vallen weg.
let model = union([main, plant, low, hall, canopy]);
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Achmeatoren met glazen band lagere toren glazen hal en entreeluifel", model]],
  catalog: {
    name: "Achmeatoren",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Sophialaan aan de oostkant (AHN-DTM +1,2..+1,4), de straat aan de
    // noordkant (+1,15..+1,47) en het plein bij de luifel (+1,26..+1,48).
    groundSamplePoints: [[20, -5], [20, 5], [2, 18], [-12, 18], [24, -25]],
    replacesBuildings: ["NL.IMBAG.Pand.0080100000352634"],
    description:
      "Oorsprong in de overlap van beide torens op straatniveau NAP +1,3 m, +X op -4,8 graden in RD (langs de gevels), +Y naar het noorden; zwarte hoofdtoren van 20,4 x 19 m met dak op NAP +112,44 binnen een dakrand tot +116,05, installaties tot +115, glazen band van de observatieruimte (+106,9 tot +111), roosterband en per gevel het eigen vensterritme, open kolommen aan de straat tot +12,2; lagere grijze toren van 18,2 x 17,8 m tot +67,9; glazen hal en strook tot +12,2 en de glazen entreeluifel met een hellende oostwand; vensterritme, banden en luifel uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      parapetNapM: H.top,
      roofNapM: H.roof,
      plantNapM: H.plant,
      glassBandNapM: [H.band0, H.band1],
      louvreBandNapM: [H.louvre0, H.louvre1],
      lowerTowerNapM: H.low,
      hallNapM: H.hall,
      mainTowerPlanM: [20.4, 19.0],
      lowerTowerPlanM: [18.2, 17.8],
      storeyPitchM: H.storey,
      windowRows: { main: ROWS.length, lower: ROWS_LOW.length },
      canopyLeanM: LEAN,
      axisDegrees: AXIS_DEG,
      estimates: [
        "vensterritme per gevel uit foto's: noord- en oostgevel tien vensters van 1,3 m op 1,7 m, zuidgevel twee smalle kolommen en een groep van vier, westgevel twee vensters; lagere toren acht vensters op 1,84 m (noord, west) en twee (zuid, oost); 22 rijen van 3,72 m in de hoofdtoren, 14 in de lagere toren",
        "glazen band (+106,9 tot +111), roosterband (+96,3 tot +97,5) en bovenste vensterrij (+93,6) gemeten op een frontale foto van de noordkant, geschaald op de dakhoogtes van beide torens",
        "plaatvoegen per verdieping als groeven van 0,3 m; de verticale voeg in de westgevel uit een foto",
        "open kolommen aan de straat: 1,2 m terugliggende pui tot +12,2 tussen kolommen van 1,6 m (foto's)",
        "entreeluifel: dakrand uit de ortho, hoogte uit het AHN-glas (+12,2), helling van de oostwand (1,6 m) en de open kolomzone tot 2,4 m boven de straat uit foto's",
        "glazen hal: hoogte uit de 3D BAG (+12,2), het AHN ziet door het glas",
      ],
    },
    sources: [
      "PDOK BAG pand 0080100000352634, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0080100000352634 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes van beide torens, installaties, glazen hal",
      "https://nl.wikipedia.org/wiki/Achmeatoren",
      "https://commons.wikimedia.org/wiki/File:Achmeatoren_Leeuwarden_1.jpg",
      "https://commons.wikimedia.org/wiki/File:Achmeatoren_FvL.jpg",
      "https://commons.wikimedia.org/wiki/File:20100707_Sophialaan_2-50_(Achmeatoren)_Leeuwarden_NL.jpg",
      "https://commons.wikimedia.org/wiki/File:Leeuwarden,_de_Achmeatoren_foto3_2016-06-05_15.57.jpg",
      "https://commons.wikimedia.org/wiki/File:20180721_545_leeuwarden.jpg",
      "https://commons.wikimedia.org/wiki/File:Achmeatoren_closeup.JPG",
      "https://commons.wikimedia.org/wiki/File:Office_buildings_in_the_city_of_Leeuwarden_(2023).jpg",
      "https://commons.wikimedia.org/wiki/File:Achmeatoren_van_onderen_1.JPG",
    ],
  },
});

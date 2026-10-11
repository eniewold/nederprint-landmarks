// De Zalmhaven (Rotterdam, 2022): Zalmhaven I (Dam & Partners, 215 m met mast,
// het hoogste gebouw van Nederland) met de twee lagere woontorens Zalmhaven II
// en III (KAAN Architecten, NAP +73 m) op de gezamenlijke onderbouw met
// parkeergarage, daktuin en de rij herenhuizen aan de Houtlaan. Vlakken en
// benoemde bouwdelen in een eigen gebouwstelsel, geen gestapelde DSM-lagen.
// Voorbeeld per rij: generate-evoluon.mjs (aanpak primitieven) en
// generate-rembrandttoren.mjs / generate-haagse-toren.mjs (skylinetorens op
// efteling-kit.mjs).
//
//   node scripts/generate-zalmhaven.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het hart van de schacht van Zalmhaven I (en de
// mast) op RD (92632,06, 436135,17), z = 0 op NAP +3,0 m (straat rondom, AHN
// DTM 2,9-3,1), Z omhoog. +X loopt langs de gevels op 27,2 graden in RD (BAG-
// gevels van beide panden), +Y naar het noordnoordwesten. De zuidgevel (-Y)
// staat aan de Houtlaan, de noordgevel (+Y) aan de Gedempte Zalmhaven; de
// onderbouw loopt 142 m naar het westzuidwesten (-X).
//
// Bronnen: BAG-panden 0599100100020122 (Zalmhaven I met de onderbouw rond de
// toren) en 0599100100020123 (onderbouw, herenhuizen, Zalmhaven II en III).
// Het AHN op PDOK (AHN4, kaartblad 37HN1) toont de toren nog in aanbouw (NAP
// +20 tot +40 m) en is dus ouder dan het complex. Hoogtes en plattegronden komen
// daarom uit AHN5 (opname 2023, DSM/DTM 0,5 m via de ImageServer
// Hoogtebestand/AHN5_DSM_50cm van ahn.arcgisonline.nl), per 0,25 m in dit
// stelsel uitgelezen, en uit de 3D BAG (LoD2.2 op AHN5, TU Delft/3D
// geoinformatie, CC BY 4.0) als controle: schacht en balkonstapels NAP +182,
// kroonlaag +191 met rand +193, top +206 met rand +207, mast +218,1, torens II
// en III +72 met rand +73, balkonstapels +63,5. Gevelindeling uit Commons-
// foto's van alle kanten; verdiepingen uit Bouwen met Staal (wonen tot de 56e,
// restaurant 57-58, techniek tot de 62e verdieping).
import { CrossSection, Manifold, box, prism, union, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "zalmhaven";
const ORIGIN = [92632.06, 436135.17];
const AXIS_DEG = 27.2;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.0;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN5 en 3D BAG) ----------
const H = {
  lobby: 9.0, // oostvleugel (entree) naast de toren
  garden: 15.2, // verdiepte daktuin op de parkeergarage
  podium: 16.0, // dak van de onderbouw (parkeergarage, herenhuizen)
  terrace: 13.0, // verdiepte dakterrassen van de herenhuizen
  roofBox: 19.0, // dakopbouwen van de herenhuizen en het oostblok
  westWing: 10.0, // lagere strook aan de westkop
  northBlock: 17.0, // onderbouw ten noorden van de toren
  northRaised: 20.5, // verhoogd deel daarvan (lichtkap)
  towerBase: 20.0, // voet van Zalmhaven I (rand van 1,65 m rond de schacht)
  stoneTop: 182.0 - 4 * 3.176, // bovenste vier woonlagen in glas
  shaft: 182.0, // schacht en balkonstapels
  crownB: 191.0, // restaurantlaag (57e en 58e verdieping)
  crownBRim: 193.0,
  crownC: 206.0, // technische top (59e tot 62e verdieping), Wikipedia 203 m
  crownCRim: 207.0,
  bmu: 196.5, // gevelonderhoudsinstallatie op de restaurantlaag
  mastTop: 218.1, // AHN-top, Wikipedia 215 m boven straat
  lowRoof: 72.0, // dak Zalmhaven II en III
  lowRim: 73.0,
  lowWell: 71.0, // verdiepte installatievloer
  lowSlot: 66.0, // ingesneden hoeken van de bovenste lagen
  lowStack: 63.5, // balkonstapels van II en III
};

// ---------- Zalmhaven I (m, gebouwstelsel) ----------
// Schacht 31,7 m in het vierkant (AHN: ±15,85). Op elke gevel een
// uitgebouwde balkonstapel van 11 m, 1,65 m diep, links van het midden (vanaf
// buiten gezien), vier keer rond gedraaid: AHN-uitbouwen zuid u -11,5..-0,5,
// oost v -12,5..-1,75, noord u 0,25..12,25, west v 2..12,25.
const T = { half: 15.85, out: 17.5, bump0: -12.1, bump1: -1.1 };
// Gevelzones langs de zuidgevel, s vanaf de linkerhoek (u = s - 15,85):
// glaszone, balkonstapel, natuurstenen veld met vensters, glasstrook.
const ZONE = { glass1: [0.7, 3.25], panel: [15.4, 28.0], glass2: [28.95, 31.0] };
const FLOOR = 3.176; // 51 woonlagen tussen de voet (+20) en de schacht (+182)
const FLOORS = 51;
const NICHE = 0.35;
// Kroon (AHN5): restaurantlaag ±14,0 (28 m), top u -6,25..6,5 bij v ±7,6.
const CB = { half: 14.0 };
const CC = { u0: -6.25, u1: 6.5, v: 7.6 };
const MAST = { at: [0.1, 0], foot: 1.2, pole: 0.5, helix: 0.7, tip: 0.45 };

// ---------- Zalmhaven II en III ----------
// Twee gelijke torens, III ligt 48 m oostelijker (AHN). Plattegrond: twee
// overlappende rechthoeken (zuidwest- en noordoostdeel) met balkonstapels in
// de twee open hoeken en een uitgebouwde balkonstapel op elke gevel.
const LOW = {
  r1: [-115, 11, -89, 28],
  r2: [-109.5, 19.5, -84.5, 36.15],
  nwStack: [-112.5, 28, -109.4, 36.15],
  seStack: [-89.1, 11, -86.5, 19.5],
  sStack: [-114.5, 8.7, -108.5, 11],
  wStack: [-117.2, 22, -114.9, 28.5],
  eStack: [-84.6, 20, -81.8, 25.5],
  nStack: [-90.5, 36.15, -84.5, 38.5],
  slots: [[-114, 12, -112.5, 19], [-92.5, 12, -90.5, 19], [-108.5, 28.6, -107, 35.5], [-87, 29, -86, 35.5]],
  well: [-105, 20, -93.5, 27],
  shift: 48,
  floors: 18,
};
const LOW_FLOOR = (H.lowRoof - H.podium) / LOW.floors;

// ---------- onderbouw (BAG-contouren, vereenvoudigd) ----------
// Pand 0599100100020123 zonder de kleine knikjes; de westgevel volgt de
// schuine rooilijn.
const PODIUM_WEST = [
  [-142.15, -24.27], [-138.64, -24.27], [-138.61, -17.38], [-39.05, -17.38], [-39.05, -16.53],
  [-22.56, -16.53], [-22.46, 17.42], [-17.46, 17.4], [-17.4, 36.06], [-136.32, 36.14],
  [-138.0, 19.9], [-139.82, 1.43], [-140.5, -5.42], [-141.16, -12.05], [-141.65, -16.96],
];
// Strook van pand 0599100100020122 ten westen van de torenvoet.
const WEST_STRIP = [-22.56, -16.53, -17.5, 17.42];
// Oostvleugel (entree) en het noordblok van pand 0599100100020122; de
// oostgrens is een gemeenschappelijke muur met de buren (BAG 0599100100016903
// en 0599100000067051).
const EAST_WING = [[17.4, -16.5], [22.9, -16.5], [22.69, -0.64], [22.36, 17.5], [17.4, 17.5]];
const NORTH_BLOCK = [[-17.46, 17.5], [22.36, 17.5], [22.0, 36.06], [-17.4, 36.06]];
const NORTH_RAISED = [[-10.5, 25.5], [22.2, 25.5], [22.05, 33.5], [-10.5, 33.5]];
// Herenhuizen aan de Houtlaan: per 28 m een verdiept dakterras (+13) en een
// dakopbouw (+19) (AHN5); het oostelijke blok staat geheel op +19.
const ROW = { start: -131, pitch: 28, box: [0, 5.6], terrace: [12, 22.5], boxV: [-13.25, -8.5], terraceV: [-16.75, -9.25] };
const EAST_BLOCK = [-36, -16.53, -17.5, -8.5];
const GARDEN = [-124, -7.5, -22.5, 4.0];
const WEST_LOW = [-145, -4, -134, 22.5];
const VENT = [-135.5, -8.5, -133, -4.2, 24.0];

// ---------- hulpfuncties ----------
const rot4 = (m) => union([0, 90, 180, 270].map((a) => (a ? m.rotate([0, 0, a]) : m)));
const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const boxR = ([x0, y0, x1, y1], zz0, zz1) => box(x0, y0, zz0, x1, y1, zz1);
// Blinde nis in de gevel a->b (buitenkant rechts van de looprichting, dus
// tegen de klok in rond een veelhoek): s0..s1 vanaf a, NAP-hoogtes, diepte in
// de gevel en `out` naar buiten.
const groove = (a, b, s0, s1, nap0, nap1, depth = NICHE, out = 1.2) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return box(-depth, s0, z(nap0), out, s1, z(nap1))
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
// Vensterraster langs een gevel: vakken van `pitch`, vensterbreedte w, per
// verdieping [nap0, nap1]; `skip` zijn s-intervallen die vrij blijven.
const grid = (a, b, rows, { pitch, w, margin = 0.9, skip = [], depth = NICHE }) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.floor((len - 2 * margin) / pitch));
  const p = (len - 2 * margin) / n;
  const out = [];
  for (let i = 0; i < n; i++) {
    const c = margin + p * (i + 0.5);
    if (skip.some(([s0, s1]) => c + w / 2 > s0 && c - w / 2 < s1)) continue;
    for (const [n0, n1] of rows) out.push(groove(a, b, c - w / 2, c + w / 2, n0, n1, depth));
  }
  return out;
};
const ccwEdges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);

const parts = [];
const cuts = [];

// ---------- onderbouw ----------
parts.push(prism(PODIUM_WEST, BASE, z(H.podium)));
parts.push(boxR(WEST_STRIP, BASE, z(H.podium)));
parts.push(prism(EAST_WING, BASE, z(H.lobby)));
parts.push(prism(NORTH_BLOCK, BASE, z(H.northBlock)));
parts.push(prism(NORTH_RAISED, z(H.northBlock) - 0.01, z(H.northRaised)));
parts.push(boxR(EAST_BLOCK, BASE, z(H.roofBox)));
for (let k = 0; k < 4; k++) {
  const u = ROW.start + ROW.pitch * k;
  parts.push(box(u + ROW.box[0], ROW.boxV[0], z(H.podium) - 0.01, u + ROW.box[1], ROW.boxV[1], z(H.roofBox)));
  if (k < 3) cuts.push(box(u + ROW.terrace[0], ROW.terraceV[0], z(H.terrace), u + ROW.terrace[1], ROW.terraceV[1], z(H.podium) + 1));
}
// Ventilatie-uitlaat van de garage op de westkop.
parts.push(box(VENT[0], VENT[1], z(H.podium) - 0.01, VENT[2], VENT[3], z(VENT[4])));
// Verdiepte daktuin en de lagere westkop.
cuts.push(boxR(GARDEN, z(H.garden), z(H.podium) + 1));
cuts.push(boxR(WEST_LOW, z(H.westWing), z(H.podium) + 1));

// ---------- Zalmhaven I ----------
// Voet (+20) en schacht met balkonstapels (+182).
parts.push(box(-T.out, -T.out, BASE, T.out, T.out, z(H.towerBase)));
parts.push(box(-T.half, -T.half, z(H.towerBase) - 0.01, T.half, T.half, z(H.shaft)));
parts.push(rot4(box(T.bump0, -T.out, z(H.towerBase) - 0.01, T.bump1, -T.half + 0.01, z(H.shaft))));
// Restaurantlaag met een glazen borstwering van 2 m (rand 1 m breed).
parts.push(
  box(-CB.half, -CB.half, z(H.shaft) - 0.01, CB.half, CB.half, z(H.crownBRim)).subtract(
    box(-CB.half + 1, -CB.half + 1, z(H.crownB), CB.half - 1, CB.half - 1, z(H.crownBRim) + 1),
  ),
);
// Gevelonderhoudsinstallatie (arm aan de westzijde, AHN +195 tot +197).
parts.push(box(-10.6, -9.2, z(H.crownB) - 0.01, -8.9, 1.0, z(H.bmu)));
// Technische top met rand.
parts.push(
  box(CC.u0, -CC.v, z(H.crownB) - 0.01, CC.u1, CC.v, z(H.crownCRim)).subtract(
    box(CC.u0 + 1, -CC.v + 1, z(H.crownC), CC.u1 - 1, CC.v - 1, z(H.crownCRim) + 1),
  ),
);
// Mast: voet, paal en de dikkere schroefantenne (foto's), top op de AHN-hoogte.
{
  const zc = z(H.crownC) - 0.01;
  const prof = [
    [0, zc],
    [MAST.foot, zc],
    [MAST.foot, z(H.crownC) + 1.4],
    [MAST.pole, z(H.crownC) + 1.9],
    [MAST.pole, z(212.6)],
    [MAST.helix, z(213.0)],
    [MAST.helix, z(217.5)],
    [MAST.tip, z(H.mastTop)],
    [0, z(H.mastTop)],
  ];
  parts.push(Manifold.revolve(new CrossSection([prof]), 32).translate([MAST.at[0], MAST.at[1], 0]));
}

// Gevelreliëf van de schacht (zuidgevel, daarna vier keer rond).
{
  const q = [];
  const A = [-T.half, -T.half];
  const B = [T.half, -T.half];
  const Ab = [-T.half, -T.out];
  const Bb = [T.half, -T.out];
  const s0 = T.bump0 + T.half; // 3,75
  const s1 = T.bump1 + T.half; // 14,75
  for (let k = 0; k < FLOORS; k++) {
    const f = H.towerBase + FLOOR * k;
    // Glaszones aan beide hoeken: een glasband per laag.
    q.push(groove(A, B, ...ZONE.glass1, f + 0.7, f + 2.75));
    q.push(groove(A, B, ...ZONE.glass2, f + 0.7, f + 2.75));
    if (f + FLOOR <= H.stoneTop + 0.01) {
      // Natuurstenen veld: tien vensters per laag.
      const [p0, p1] = ZONE.panel;
      const pitch = (p1 - p0) / 10;
      for (let i = 0; i < 10; i++) {
        const c = p0 + pitch * (i + 0.5);
        q.push(groove(A, B, c - 0.36, c + 0.36, f + 0.8, f + 2.7));
      }
    } else {
      // Bovenste vier lagen: doorlopende glasband.
      q.push(groove(A, B, ZONE.panel[0] - 0.3, ZONE.panel[1] + 0.3, f + 0.7, f + 2.75));
    }
    // Balkonstapel: twee loggia's per laag, gescheiden door een stenen
    // penant; daarnaast een dichte kop van 1,6 m.
    q.push(groove(Ab, Bb, s0 + 0.5, s0 + 5.0, f + 0.75, f + 2.85, 0.9));
    q.push(groove(Ab, Bb, s0 + 5.9, s1 - 1.6, f + 0.75, f + 2.85, 0.9));
  }
  // Restaurantlaag: twee hoge glasbanden met stijlen per 4,7 m.
  for (let j = 0; j < 6; j++) {
    const c0 = 0.6 + j * 4.7;
    for (const [n0, n1] of [[182.6, 186.3], [187.0, 190.6]]) q.push(groove([-CB.half, -CB.half], [CB.half, -CB.half], c0, c0 + 4.0, n0, n1, 0.3));
  }
  cuts.push(rot4(union(q)));
  // Technische top: vier glasbanden, stijlen per vak (geen vierkant, dus per gevel).
  const top = [];
  const cc = [[CC.u0, -CC.v], [CC.u1, -CC.v], [CC.u1, CC.v], [CC.u0, CC.v]];
  for (const [a, b] of ccwEdges(cc)) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.round(len / 4.3);
    const p = (len - 1.0) / n;
    for (let j = 0; j < n; j++) for (let k = 0; k < 4; k++) {
      const f = H.crownB + 0.3 + 3.7 * k;
      top.push(groove(a, b, 0.5 + p * j + 0.3, 0.5 + p * (j + 1) - 0.3, f, f + 2.9, 0.3));
    }
  }
  cuts.push(union(top));
}
// Voet: zuilengalerij aan de Houtlaan (BAG-penanten), drie lagen vensters op
// de zuid- en oostgevel (oostgevel pas boven de entreevleugel).
{
  const S = [[-T.out, -T.out], [T.out, -T.out]];
  const E = [[T.out, -T.out], [T.out, T.out]];
  const rowsUp = [[10.0, 12.3], [13.6, 15.9], [17.0, 19.2]];
  for (let k = 0; k < 8; k++) {
    const c = 1.0 + 4.125 * (k + 0.5);
    cuts.push(groove(...S, c - 1.5, c + 1.5, 3.0, 8.4, 0.5));
  }
  cuts.push(...grid(...S, rowsUp, { pitch: 2.2, w: 1.3 }));
  cuts.push(...grid(...E, rowsUp, { pitch: 2.2, w: 1.3, skip: [[0, 1.2]] }));
}

// ---------- Zalmhaven II en III ----------
for (const dx of [0, LOW.shift]) {
  const sh = ([x0, y0, x1, y1]) => [x0 + dx, y0, x1 + dx, y1];
  const r1 = sh(LOW.r1);
  const r2 = sh(LOW.r2);
  const outline = [
    [r1[0], r1[1]], [r1[2], r1[1]], [r1[2], r2[1]], [r2[2], r2[1]], [r2[2], r2[3]], [r2[0], r2[3]], [r2[0], r1[3]], [r1[0], r1[3]],
  ];
  const body = prism(outline, BASE, z(H.lowRim));
  const inner = new CrossSection([outline]).offset(-1, "Miter").toPolygons()[0];
  parts.push(body.subtract(prism(inner, z(H.lowRoof), z(H.lowRim) + 1)));
  cuts.push(boxR(sh(LOW.well), z(H.lowWell), z(H.lowRim) + 1));
  for (const s of LOW.slots) cuts.push(boxR(sh(s), z(H.lowSlot), z(H.lowRim) + 1));
  // Balkonstapels in de open hoeken en op de gevels; de noordelijke kraagt
  // vanaf de onderbouw onder 45 graden uit boven de straat.
  for (const k of ["nwStack", "seStack", "sStack", "wStack", "eStack"]) parts.push(boxR(sh(LOW[k]), BASE, z(H.lowStack)));
  {
    const [x0, y0, x1, y1] = sh(LOW.nStack);
    const d = y1 - y0;
    const corbel = Manifold.hull([
      [x0, y0, z(H.podium) - d], [x1, y0, z(H.podium) - d],
      [x0, y0, z(H.podium)], [x1, y0, z(H.podium)], [x0, y1, z(H.podium)], [x1, y1, z(H.podium)],
    ]);
    parts.push(corbel, box(x0, y0 - 0.01, z(H.podium) - 0.01, x1, y1, z(H.lowStack)));
  }
  // Vensterraster van de woonlagen boven de onderbouw.
  const rows = [];
  for (let k = 0; k < LOW.floors; k++) {
    const f = H.podium + LOW_FLOOR * k;
    rows.push([f + 0.6, f + 2.7]);
  }
  const stackRows = rows.map(([a, b]) => [a + 0.1, Math.min(b + 0.15, H.lowStack - 0.6)]).filter(([a, b]) => b - a > 1.2);
  const S = (u) => u + dx;
  // Gevels van de omtrek (tegen de klok in) met de vrij te houden stukken waar
  // een balkonstapel tegenaan staat.
  const faces = [
    [[S(-115), 11], [S(-89), 11], [[0, 7.2]]],
    [[S(-89), 11], [S(-89), 19.5], [[0, 9]]],
    [[S(-89), 19.5], [S(-84.5), 19.5], [[0, 3.4]]],
    [[S(-84.5), 19.5], [S(-84.5), 36.15], [[0, 6.8]]],
    [[S(-84.5), 36.15], [S(-109.5), 36.15], [[0, 6.8], [24, 26]]],
    [[S(-109.5), 36.15], [S(-109.5), 28], [[0, 9]]],
    [[S(-109.5), 28], [S(-115), 28], [[1.5, 6]]],
    [[S(-115), 28], [S(-115), 11], [[0, 7]]],
  ];
  for (const [a, b, skip] of faces) cuts.push(...grid(a, b, rows, { pitch: 2.45, w: 1.6, skip }));
  // Balkons op de buitenkant van de stapels (loggia's van 0,7 m).
  const stackFaces = [
    [[S(-114.5), 8.7], [S(-108.5), 8.7]],
    [[S(-117.2), 28.5], [S(-117.2), 22]],
    [[S(-81.8), 20], [S(-81.8), 25.5]],
    [[S(-84.5), 38.5], [S(-90.5), 38.5]],
    [[S(-112.5), 36.15], [S(-112.5), 28]],
    [[S(-86.5), 11], [S(-86.5), 19.5]],
  ];
  for (const [a, b] of stackFaces) {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (const [n0, n1] of stackRows) cuts.push(groove(a, b, 0.5, len - 0.5, n0, n1, 0.7));
  }
}

// ---------- gevels van de onderbouw ----------
{
  const rows = [[3.4, 6.2], [7.0, 9.0], [10.2, 12.2]];
  const low = [[3.4, 6.2], [7.0, 9.0]];
  // Zuidgevel (Houtlaan), herenhuizen.
  cuts.push(...grid([-138.61, -17.38], [-39.05, -17.38], rows, { pitch: 2.75, w: 1.7, margin: 1.0 }));
  cuts.push(...grid([-39.05, -16.53], [-22.56, -16.53], rows, { pitch: 2.75, w: 1.7, margin: 1.0 }));
  // Westkop (schuine gevel, lagere strook): twee rijen.
  // Alleen ten noorden van v = 1,4: zuidelijker staan de buurpanden ertegen.
  const west = PODIUM_WEST.slice(9, 12);
  for (let i = 0; i + 1 < west.length; i++) {
    const [a, b] = [west[i], west[i + 1]];
    if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 5) cuts.push(...grid(a, b, low, { pitch: 2.75, w: 1.7, margin: 1.0 }));
  }
  // Noordgevel (Gedempte Zalmhaven): garage en entrees, vrij onder de
  // balkonstapels van II en III; daarnaast het noordblok van Zalmhaven I.
  cuts.push(
    ...grid([-17.4, 36.06], [-136.32, 36.14], rows, {
      pitch: 2.75,
      w: 1.7,
      margin: 1.0,
      // s = -17,4 - u: de noordelijke balkonstapels van II (u -90,5..-84,5) en III.
      skip: [[66.1, 74.1], [18.1, 26.1]],
    }),
  );
  cuts.push(...grid([22.0, 36.06], [-17.4, 36.06], [[3.4, 6.2], [7.0, 9.0], [10.2, 12.2], [13.4, 15.6]], { pitch: 2.75, w: 1.7, margin: 1.0 }));
  // Oostvleugel: glazen entree aan de Houtlaan.
  cuts.push(groove([17.5, -16.5], [22.9, -16.5], 0.9, 4.6, 3.3, 7.6, 0.5));
}

let model = union(parts).subtract(union(cuts));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Zalmhaven I II en III met onderbouw herenhuizen kroon en mast", model]],
  catalog: {
    name: "De Zalmhaven (Zalmhaventoren)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straat aan de Houtlaan (zuid) en de Gedempte Zalmhaven (noord), AHN5-DTM
    // NAP +2,9 tot +3,1 m.
    groundSamplePoints: [[-120, -21], [-60, -21], [0, -25], [-60, 41], [0, 40]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100100020122", "NL.IMBAG.Pand.0599100100020123"],
    description:
      "Oorsprong in het hart van de schacht van Zalmhaven I op straatniveau NAP +3,0 m, +X langs de gevels op 27,2 graden in RD, +Y naar het noordnoordwesten (Gedempte Zalmhaven), de Houtlaan aan -Y; voet tot NAP +20 m, schacht van 31,7 m met vier rondgedraaide balkonstapels tot +182 m, restaurantlaag tot +191 m (rand +193), technische top tot +206 m (rand +207) en mast tot +218,1 m; Zalmhaven II en III 48 m uit elkaar tot +72/+73 m met balkonstapels tot +63,5 m, op de onderbouw (+16 m) met daktuin, herenhuizen en lagere westkop; hoogtes uit AHN5 (2023), gevelritme uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      podiumNapM: H.podium,
      towerBaseNapM: H.towerBase,
      shaftNapM: H.shaft,
      restaurantNapM: H.crownB,
      topNapM: H.crownC,
      mastTopNapM: H.mastTop,
      lowTowersNapM: H.lowRim,
      shaftWidthM: 2 * T.half,
      footprintM: [165.1, 53.5],
      storeyPitchM: FLOOR,
      lowStoreyPitchM: +LOW_FLOOR.toFixed(3),
      axisDegrees: AXIS_DEG,
      estimates: [
        "verdiepingshoogte 3,18 m (51 woonlagen tussen voet en schacht) uit de verdiepingtelling (wonen tot de 56e) en foto's",
        "gevelzones van de schacht (glashoek 3,75 m, balkonstapel 11 m, stenen veld met tien vensters per laag, glasstrook 3,1 m) uit een frontale foto en de AHN-uitbouwen",
        "bovenste vier woonlagen in glas, glasbanden van restaurantlaag en top uit foto's",
        "mastdiameters (voet 2,4 m, paal 1,0 m, schroefantenne 1,4 m) uit foto's, dikker dan echt voor 1:1000",
        "vensterraster van II en III (18 lagen, vakken 2,45 m) en van de onderbouw (drie lagen, vakken 2,75 m) uit foto's",
      ],
    },
    sources: [
      "PDOK BAG panden 0599100100020122 en 0599100100020123 en Actueel_orthoHR; 2026-10-11",
      "AHN5 DSM/DTM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; het PDOK-AHN (AHN4) toont de toren nog in aanbouw",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100020122 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes ter controle",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100020123 (3D BAG, CC BY 4.0)",
      "https://nl.wikipedia.org/wiki/De_Zalmhaven",
      "Bouwen met Staal, 'Het neusje van de Zalm' (verdiepingsindeling)",
      "https://commons.wikimedia.org/wiki/File:Zalmhaventoren.jpg",
      "https://commons.wikimedia.org/wiki/File:Zalmhaventoren_in_2026.jpg",
      "https://commons.wikimedia.org/wiki/File:De_Zalmhaven_I_-_Rotterdam_-_View_from_the_Veerhaven.jpg",
      "https://commons.wikimedia.org/wiki/File:De_Zalmhaven_I,_II_and_III_-_Rotterdam_-_View_from_the_Veerhaven.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_toren_zalmhaven.jpg",
      "https://commons.wikimedia.org/wiki/File:Model_of_De_Zalmhaven.jpg",
    ],
  },
});

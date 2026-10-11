// Maastoren (Wilhelminakade 1, Rotterdam; Dam & Partners met Odile Decq
// Benoit Cornette, 2009): kantoortoren van 164,75 m (tot 2021 het hoogste
// gebouw van Nederland) aan de Nieuwe Maas, voor Deloitte en AKD. Het gebouw
// bestaat uit een hoge schijf met een knik in de plattegrond: het
// noordelijke deel staat 21 graden gedraaid ten opzichte van het zuidelijke.
// Aan de zuidwestgevel staat een glazen liftschacht die boven de schijf
// uitsteekt, met de mast. Tegen de schijf staat de lagere toren van AKD (NAP
// +108,9), met tussen beide torens aan de rivierzijde een glazen tussenlid tot
// +45. Aan de zuidoostkant ligt de plint met de parkeerlagen (+45), aan de
// waterkant een lage glazen uitbouw met een gevouwen glazen dak van vier
// vlakken, en langs de zuidwest- en zuidgevel de luifel met boomkolommen
// boven de entree. De schijf eindigt in een glazen kroon van drie lagen
// waarvan de wanden boven het dak uitsteken; de top is vlak, niet schuin.
// Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen gestapelde
// DSM-lagen. Voorbeeld per rij: generate-evoluon.mjs (aanpak primitieven),
// generate-haagse-toren.mjs, generate-rembrandttoren.mjs en
// generate-hoftoren.mjs (skylinetorens op efteling-kit.mjs).
//
//   node scripts/generate-maastoren.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het zuidelijke deel van de hoge schijf op RD
// (93497, 435966), z = 0 op NAP +3,9 m (plein en straat rondom: AHN-DTM +3,7
// tot +4,2), Z omhoog. +X loopt op 54,8 graden in RD, langs de zuidoostgevel
// van de schijf en de gevels van de AKD-toren en de plint (BAG 54,6-54,9
// graden); +Y wijst naar het noordwesten (144,8 graden), naar de Nieuwe Maas.
// De AKD-toren ligt aan -X, de glazen uitbouw aan +X, de plint aan -Y.
//
// Bronnen: BAG-pand 0599100000754173 (schijf, AKD-toren, plint en uitbouw in
// één pand; het pand loopt ook onder het plein aan de rivierzijde door), AHN
// DSM/DTM 0,5 m (PDOK WCS, in dit stelsel uitgelezen: contouren, knik,
// dakhoogtes, vlakken van het uitbouwdak), 3D BAG LoD2.2 (TU Delft/3D
// geoinformatie, CC BY 4.0: kroon en dak van de liftschacht 168,9, dakvlak van
// de uitbouw langs de schijf, tussenlid +45), Actueel_orthoHR (knik, schacht,
// vouwen van het uitbouwdak, luifel), Wikipedia (164,75 m, 44 lagen, plint met
// parkeerlagen 3 tot 11, glazen kroon) en Commons-foto's van alle kanten.
import { CrossSection, Manifold, prism, box, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "maastoren";
const ORIGIN = [93497.0, 435966.0];
const AXIS_DEG = 54.8;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.9;
// De voet loopt door tot NAP +1,1: aan de waterkant (uitbouw en noordoostgevel
// van de schijf) ligt het AHN op +1,6.
const BASE = -2.8;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  roof: 162.05, // dak van de schijf binnen de glazen kroon (AHN-fit, rms 0,10)
  crownTop: 164.7, // bovenkant van de glazen kroonwanden (AHN-randen 163,8-164,7; 3D BAG 164,7)
  crown0: 154.0, // onderkant van de glazen kroon (drie lagen, foto's)
  column: 169.6, // bovenkant van het stalen frame op de liftschacht (AHN 169,6)
  columnRoof: 168.9, // dak van de liftschacht (3D BAG 168,9)
  mastTop: 177.7, // hoogste AHN-punt op de mast (Wikipedia: 177,7 m boven maaiveld)
  akd: 108.85, // dak van de AKD-toren (AHN-fit, 2043 punten, rms 0,09)
  akdRim: 109.4, // dakrand (AHN-randen 109,3)
  akdBand: 100.4, // onderkant van de glazen kopband van de AKD-toren
  plinth: 44.8, // dak van de parkeerplint (AHN-fit)
  plinthRim: 45.5,
  link: 45.0, // glazen tussenlid tussen de torens (3D BAG 45,0)
  lifts: 45.0, // glazen liften aan de zuidwestgevel van de AKD-toren, tot de bovenste parkeerlaag (foto van de noordwestgevel)
  office0: 45.4, // eerste kantoorvloer boven de parkeerlagen
  storeyT: (154.0 - 45.4) / 30, // 30 lagen tot de kroon (Wikipedia: hoogste vloer 154,1 m boven maaiveld)
  storeyA: (100.4 - 45.4) / 15, // 15 lagen tot de kopband van de AKD-toren
  canopyLow: 8.9, // onderkant luifel
  canopyTop: 10.2, // dal van de gevouwen luifel (AHN-glas 9,5-11)
  canopyRidge: 11.4, // vouw tussen de boomkolommen
};

// ---------- plattegrond (m, gebouwstelsel) ----------
// Hoge schijf: zuidelijk deel recht (u -7,9..7,6 vanaf v = -17,2), noordelijk
// deel 21 graden gedraaid (BAG-gevels 159,0/69,5 graden): noordwestgevel van
// A naar B, 15,56 m. De knik ligt waar de gedraaide gevels de rechte snijden.
const ROT = (-21.0 * Math.PI) / 180;
const E1 = [Math.cos(ROT), Math.sin(ROT)]; // langs de noordwestgevel (van A naar B)
const E2 = [-E1[1], E1[0]]; // naar de rivier
const A = [1.84, 30.72]; // BAG, westhoek van de noordwestgevel
const B = [16.37, 25.14]; // BAG, noordhoek
const westLine = (v) => A[0] - (E2[0] * (A[1] - v)) / E2[1]; // u op de gedraaide zuidwestgevel
const eastLine = (v) => B[0] - (E2[0] * (B[1] - v)) / E2[1]; // u op de gedraaide noordoostgevel
const T = { w: -7.9, e: 7.6, s: -17.2 };
const C = [T.e, B[1] - (E2[1] * (B[0] - T.e)) / E2[0]]; // knik oostzijde (7,6; 2,29)
const F = [T.w, A[1] - (E2[1] * (A[0] - T.w)) / E2[0]]; // knik westzijde (-7,9; 5,33)
const TALL = [[T.w, T.s], [T.e, T.s], C, B, A, F];

// Glazen liftschacht aan de zuidwestgevel (3D BAG-dak 168,9, ortho: kruisverband
// op het frame), 0,4 m in de schijf.
const COL = [[-12.4, -14.0], [-7.5, -14.0], [-7.5, 5.3], [-12.4, 5.3]];
// Spleet tussen AKD-toren, schacht en schijf boven de plint (AHN-gat; 3D BAG:
// plintdak +45 tot v -15,8): de plint loopt eronder door tot de schacht.
const SLOT_FLOOR = [[-12.1, -17.6], [-7.5, -17.6], [-7.5, -13.8], [-12.1, -13.8]];
// AKD-toren (BAG-zuidwest- en zuidoostgevel, AHN-oost- en noordgevel).
const AKD = [[-27.42, -24.37], [-11.6, -24.37], [-11.6, 19.9], [-27.42, 19.9]];
// Verbinding van de AKD-toren met de schijf bij de knik (AHN 108,8 tot u -7,5).
const LINK_HIGH = [[-12.1, 4.9], [-7.5, 4.9], [-7.5, 6.1], [westLine(9.3) + 0.4, 9.3], [-12.1, 9.3]];
// Glazen tussenlid tot +45 tussen de torens, gevel gelijk met de AKD-toren.
const LINK_LOW = [[-12.1, 9.3], [westLine(9.3) + 0.4, 9.3], [westLine(19.9) + 0.4, 19.9], [-12.1, 19.9]];
// Liften: BAG-uitstulping van de zuidwestgevel (v 5,38..15,33, 0,87 m).
const LIFTS = [[-28.29, 5.38], [-27.1, 5.38], [-27.1, 15.33], [-28.29, 15.33]];
// Parkeerplint (BAG).
const PLINTH = [[-11.95, -29.89], [9.42, -29.89], [9.42, -17.2], [-11.95, -17.2]];
// Dakopbouw naast de liftschacht (3D BAG 164,7) en de mast (AHN-top).
const ROOFBOX = [[-6.0, -10.0], [-1.5, -10.0], [-1.5, 1.8], [-6.0, 1.8]];
const MAST = [-5.6, -3.8];

// Glazen uitbouw aan het water (BAG-contour; de zijden langs de schijf en de
// plint 0,4 m in die volumes).
const inT = (p) => [p[0] - 0.4 * E1[0], p[1] - 0.4 * E1[1]]; // 0,4 m de schijf in (normaal van de noordoostgevel = E1)
const EXT = [
  [9.0, -28.59], [24.01, -28.59], [23.81, -30.58], [27.97, -30.58], [28.03, -9.71], [28.72, -9.36], [28.79, 18.9],
  [16.38, 18.82], [16.06, 17.98], [15.7, 17.05], inT([13.64, 17.84]), inT(C), [7.2, -17.6], [9.0, -17.6],
];
// Dak van de uitbouw: vier vlakken (z = c + a u + b v, NAP). A en S zijn
// kleinste-kwadratenfits op het AHN (450 en 619 punten, rms 0,04/0,05); tussen
// A (hoog) en S loopt een glazen trede van 3-4 m. B ligt in het AHN-gat langs
// de schijf en komt uit de 3D BAG (vlak door de nok R0, de vouw R1 en de
// noordwesthoek, 13,0); C sluit A en B aan in de noordoosthoek.
const PA = { a: -0.1323, b: -0.0423, c: 20.01 };
const PS = { a: -0.0682, b: -0.0897, c: 14.31 };
const at = ({ a, b, c }, u, v) => c + a * u + b * v;
const plane3 = (p, q, r) => {
  // z = c + a u + b v door drie punten [u, v, z]
  const d1 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
  const d2 = [r[0] - p[0], r[1] - p[1], r[2] - p[2]];
  const det = d1[0] * d2[1] - d1[1] * d2[0];
  const a = (d1[2] * d2[1] - d2[2] * d1[1]) / det;
  const b = (d1[0] * d2[2] - d2[0] * d1[2]) / det;
  return { a, b, c: p[2] - a * p[0] - b * p[1] };
};
const R0 = [9.42, -17.2]; // nok bij de hoek van schijf en plint (ortho, 3D BAG 19,3)
const R1 = [25.0, 9.0]; // vouw tussen A, B en C (ortho)
const STEP_E = [28.75, -7.5]; // einde van de trede aan de oostgevel (ortho, AHN)
const N1 = [13.64, 17.84, 13.0]; // noordwesthoek tegen de schijf (3D BAG)
const PB = plane3([...R0, at(PA, ...R0)], [...R1, at(PA, ...R1)], N1);
const PC = plane3([...R1, at(PA, ...R1)], [28.75, 9.0, at(PA, 28.75, 9.0)], [16.38, 18.82, at(PB, 16.38, 18.82)]);
const lineV = (u) => R0[1] + ((STEP_E[1] - R0[1]) * (u - R0[0])) / (STEP_E[0] - R0[0]);
const N2far = [R1[0] + ((16.38 - R1[0]) * (30 - R1[1])) / (18.82 - R1[1]), 30];
const FACETS = [
  { name: "S", plane: PS, region: [[-1, -40], [40, -40], [40, lineV(40)], [-1, lineV(-1)]] },
  { name: "A", plane: PA, region: [R0, [40, lineV(40)], [40, 9.0], R1] },
  { name: "B", plane: PB, region: [[-1, lineV(-1)], R0, R1, N2far, [-1, 30]] },
  { name: "C", plane: PC, region: [R1, [40, 9.0], [40, 30], N2far] },
];
const inPoly = (poly, [x, y]) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const extRoof = (u, v) => at((FACETS.find((f) => inPoly(f.region, [u, v])) ?? FACETS[0]).plane, u, v);

// Luifel met boomkolommen langs de zuidwest- en zuidgevel (AHN: glas op
// +9,5..+11, masten tot +17..+22; ortho: wit vakwerk), 11,4 m diep langs de
// AKD-toren en 5,8 m voor de zuidoostgevel, gevouwen tussen de bomen.
const CANOPY_SW = { u0: -38.5, u1: -27.1, v0: -30.2, v1: 18.8, valleys: [-30.2, -27.0, -19.4, -11.8, -4.2, 3.4, 11.0, 18.8] };
const CANOPY_S = { u0: -27.1, u1: -11.6, v0: -30.2, v1: -24.0, valleys: [-27.1, -19.35, -11.6] };
const TREES = [[-33.0, -27.0], [-33.0, -19.4], [-33.0, -11.8], [-33.0, -4.2], [-33.0, 3.4], [-33.0, 11.0], [-19.35, -27.0]];

// ---------- gevelritme (foto's) ----------
const NICHE = 0.35;
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
// Begane grond (glazen entreelaag) en zes rijen grote parkeerroosters tot +45.
const LOBBY = [[4.5, 8.6]];
const PARK = range(6, (k) => [9.4 + 6.0 * k + 1.1, 9.4 + 6.0 * k + 5.1]);
// Kantoorlagen: schijf 30 lagen tot de kroon, AKD-toren 15 lagen tot de kopband.
const OFFICE_T = range(30, (k) => [H.office0 + H.storeyT * k + 0.8, H.office0 + H.storeyT * k + 2.95]);
const OFFICE_A = range(16, (k) => [H.office0 + H.storeyA * k + 0.8, H.office0 + H.storeyA * k + 2.95]);
const CROWN = [[H.crown0 + 0.3, 159.1], [159.5, H.crownTop - 0.4]];
const AKD_BAND = [[H.akdBand + 0.3, 104.4], [104.8, H.akd - 0.5]];
const COL_ROWS = range(34, (k) => [H.office0 + H.storeyT * k + 0.35, H.office0 + H.storeyT * k + 3.27]).filter(([, r1]) => r1 < 166.5);
const above = (rows, nap) => rows.filter(([r0]) => r0 >= nap);
const below = (rows, nap) => rows.filter(([, r1]) => r1 <= nap);

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
// Kolommen vensters langs de gevel a→b: centers gelijk verdeeld over s0..s1 op
// ongeveer `pitch` (of expliciet in `at`), `rows(s)` geeft de NAP-rijen per kolom.
function columns(a, b, { s0 = 0, s1, pitch, at: centers, width, rows, depth = NICHE, top = null }) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const end = s1 ?? len;
  const n = Math.max(1, Math.round((end - s0) / pitch));
  const cs_ = centers ?? range(n, (k) => s0 + ((end - s0) * (k + 0.5)) / n);
  const w = centers ? width : Math.min(width, (end - s0) / n - 0.6);
  const out = [];
  for (const s of cs_) {
    const p = [a[0] + ((b[0] - a[0]) * s) / len, a[1] + ((b[1] - a[1]) * s) / len];
    const cap = top ? top(p[0], p[1]) : Infinity;
    for (const [r0, r1] of typeof rows === "function" ? rows(s) : rows) {
      const hi = Math.min(r1, cap);
      if (hi - r0 > 0.8) out.push(niche(a, b, s - w / 2, s + w / 2, r0, hi, depth));
    }
  }
  return out;
}
// Middens van de kolommen zoals `columns` ze verdeelt.
function centersOf(a, b, { s0 = 0, s1, pitch }) {
  const end = s1 ?? Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(1, Math.round((end - s0) / pitch));
  return range(n, (k) => s0 + ((end - s0) * (k + 0.5)) / n);
}
const edge = (poly, i) => [poly[i], poly[(i + 1) % poly.length]];
const lenOf = ([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]);

// ---------- hoge schijf ----------
const tallCs = cs(TALL);
let tall = prismCs(tallCs, BASE, z(H.crownTop)).subtract(prismCs(tallCs.offset(-1.2, "Miter"), z(H.roof), z(H.crownTop) + 1));
{
  const cuts = [];
  const [e0, e1, e2, e3, e4, e5] = TALL.map((_, i) => edge(TALL, i));
  const sSplit = lenOf(e2) - (B[1] - 17.84) / E2[1];
  const sLow = (A[1] - 19.9) / E2[1];
  const sHigh = (A[1] - 9.3) / E2[1];
  // Per gevel: vensterkolommen en vanaf welke hoogte (NAP) de gevel vrij is.
  // Zuidoostgevel boven de plint, noordoostgevel boven de uitbouw (+20), de
  // gedraaide noordoostgevel voorbij de uitbouw (v > 17,84, aan het water) tot
  // op de kade, de noordwestgevel aan de rivier met drie vensterkolommen aan de
  // westkant en het oostelijke derde dicht (Commons: Maastoren_IMG_5117.jpg en
  // Bovenkant_van_Maastoren.jpg), en de gedraaide zuidwestgevel: vrij tot op het
  // plein, boven het tussenlid (+45) en boven de verbinding (+108,9).
  const faces = [
    { e: e0, centers: centersOf(...e0, { pitch: 3.9 }), low: () => H.plinthRim },
    { e: e1, centers: centersOf(...e1, { pitch: 3.4 }), low: () => 20.5 },
    { e: e2, centers: [...centersOf(...e2, { s1: sSplit, pitch: 3.4 }), ...centersOf(...e2, { s0: sSplit, pitch: 3.4 })], low: (s) => (s < sSplit ? 20.5 : 4.4), cuts: [sSplit] },
    { e: e3, centers: [6.16, 9.56, 13.06], low: () => 4.4, joints: [1.5, 3.0, 4.5, 7.86, 11.31] },
    { e: e4, centers: centersOf(...e4, { pitch: 3.4 }), low: (s) => (s < sLow ? 4.4 : s < sHigh ? H.office0 : H.akdRim), cuts: [sLow, sHigh] },
  ];
  const rowsFrom = (nap) => [...(nap < 5 ? LOBBY : []), ...above(PARK, nap), ...above(OFFICE_T, nap)];
  for (const f of faces) {
    cuts.push(...columns(...f.e, { at: f.centers, width: 1.7, rows: (s) => rowsFrom(f.low(s)) }));
    // Paneelraster (foto's): een verticale voeg van 0,5 m midden in elke witte
    // liseen, doorlopend tot de kroon, en een verdiepingsband van 0,4 m per laag.
    const len = lenOf(f.e);
    const js = f.joints ?? f.centers.slice(1).map((s, i) => (s + f.centers[i]) / 2);
    for (const s of js) cuts.push(niche(...f.e, s - 0.25, s + 0.25, Math.max(9.0, f.low(s)), H.crown0, 0.3));
    const bounds = [0, ...(f.cuts ?? []), len];
    for (let i = 0; i + 1 < bounds.length; i++) {
      const [b0, b1] = [bounds[i] + (i === 0 ? 0.6 : 0), bounds[i + 1] - (i + 2 === bounds.length ? 0.6 : 0)];
      const low = f.low((b0 + b1) / 2);
      for (let k = 1; k < 30; k++) {
        const fl = H.office0 + H.storeyT * k;
        if (fl - 0.2 > low) cuts.push(niche(...f.e, b0, b1, fl - 0.2, fl + 0.2, 0.3));
      }
    }
  }
  // Glazen kroon rondom: stijlen van 0,6 m op 1,7 m en een kalf op de vloer.
  for (const e of [e0, e1, e2, e3, e4]) cuts.push(...columns(...e, { pitch: 1.7, width: 1.1, rows: CROWN, depth: 0.3 }));
  // Stuk zuidwestgevel zuidelijk van de schacht (v -17,2..-14,0): kroon en vensters boven de plint.
  cuts.push(...columns(...e5, { s0: lenOf(e5) - 3.1, pitch: 1.7, width: 1.1, rows: CROWN, depth: 0.3 }));
  cuts.push(...columns(...e5, { s0: lenOf(e5) - 3.1, pitch: 3.1, width: 1.5, rows: OFFICE_T }));
  tall = tall.subtract(union(cuts));
}
// Dakopbouw naast de schacht en de mast.
const roofBox = prism(ROOFBOX, z(H.roof) - 0.1, z(H.crownTop));
const mast = Manifold.revolve(
  new CrossSection([[[0, z(H.crownTop) - 0.1], [0.75, z(H.crownTop) - 0.1], [0.75, z(171.0)], [0.5, z(171.6)], [0.5, z(H.mastTop) - 0.5], [0.45, z(H.mastTop)], [0, z(H.mastTop)]]]),
  32,
).translate([MAST[0], MAST[1], 0]);

// ---------- glazen liftschacht ----------
const colCs = cs(COL);
let column = prismCs(colCs, BASE, z(H.column)).subtract(prismCs(colCs.offset(-0.9, "Miter"), z(H.columnRoof), z(H.column) + 1));
{
  const cuts = [];
  const [g0, , g2, g3] = COL.map((_, i) => edge(COL, i));
  // Glazen gevel per laag in ruiten van 1,2 m op 1,7 m: boven de plint aan de
  // zuidoostkant, boven de AKD-toren aan de zuidwest- en noordwestkant.
  cuts.push(...columns(...g0, { pitch: 1.7, width: 1.2, rows: above(COL_ROWS, H.plinthRim), depth: 0.3 }));
  for (const g of [g2, g3]) cuts.push(...columns(...g, { pitch: 1.7, width: 1.2, rows: above(COL_ROWS, H.akdRim), depth: 0.3 }));
  // Open frame boven het dak van de schacht.
  for (const g of [g0, g2, g3]) cuts.push(...columns(...g, { pitch: 2.4, width: 1.5, rows: [[H.columnRoof - 2.0, H.column - 0.6]], depth: 0.4 }));
  column = column.subtract(union(cuts));
}

// ---------- AKD-toren ----------
const akdCs = cs(AKD);
let akd = prismCs(akdCs, BASE, z(H.akdRim)).subtract(prismCs(akdCs.offset(-0.9, "Miter"), z(H.akd), z(H.akdRim) + 1));
let linkHigh = prism(LINK_HIGH, BASE, z(H.akd));
let linkLow = prism(LINK_LOW, BASE, z(H.link));
let lifts = prism(LIFTS, BASE, z(H.lifts));
{
  const cuts = [];
  const [q0, q1, q2, q3] = AKD.map((_, i) => edge(AKD, i));
  const lowRows = [...LOBBY, ...PARK];
  const bandOr = (inBand) => (inBand ? [...OFFICE_A.slice(0, 15), ...AKD_BAND] : OFFICE_A);
  // Gevelopbouw (Commons: De_Maastoren_in_Rotterdam_in_2021.jpg,
  // Maastoren_2012.jpg): brede donkere lisenen met witte randen en daartussen
  // per kolom een verdiepte strook van 1,9 m met per laag een venster en een
  // borstwering, onderin de parkeerroosters in dezelfde stroken. Strook 0,2 m
  // diep, vensters en roosters 0,45 m.
  const akdFace = (a, b, { s0, s1, pitch, low, top, rows }) => {
    const centers = centersOf(a, b, { s0, s1, pitch });
    const out = columns(a, b, { at: centers, width: 1.4, rows, depth: 0.45 });
    for (const s of centers) out.push(niche(a, b, s - 0.95, s + 0.95, low(s), top(s), 0.2));
    return out;
  };
  // Zuidoostgevel (vier kolommen, akd-logo: geen kopband).
  cuts.push(...akdFace(...q0, { pitch: 3.9, low: () => 4.2, top: () => 104.0, rows: [...lowRows, ...OFFICE_A] }));
  // Noordoostgevel: alleen het deel boven het tussenlid aan de rivierzijde.
  cuts.push(...akdFace(...q1, { s0: 9.3 + 24.37, pitch: 2.95, low: () => H.link + 0.4, top: () => H.akdBand - 0.2, rows: bandOr(true) }));
  // Noordwestgevel aan de rivier met de glazen kopband over de hele breedte.
  cuts.push(...akdFace(...q2, { pitch: 3.9, low: () => 4.2, top: () => H.akdBand - 0.2, rows: [...lowRows, ...bandOr(true)] }));
  // Zuidwestgevel aan het plein: 15 kolommen op 2,95 m, de kopband over de
  // noordwestelijke helft (tot v = -4,5), de liften en de entree.
  const lift = (s) => 19.9 - s > 5.0 && 19.9 - s < 15.7;
  cuts.push(
    ...akdFace(...q3, {
      pitch: 2.95,
      low: (s) => (lift(s) ? H.lifts + 0.4 : 4.2),
      top: (s) => (19.9 - s > -4.5 ? H.akdBand - 0.2 : 104.0),
      rows: (s) => [...(lift(s) ? [] : lowRows), ...bandOr(19.9 - s > -4.5)],
    }),
  );
  cuts.push(niche(...q3, 15.9, 21.9, 4.2, 8.4, 0.5)); // entree onder de luifel (v -2..+4)
  akd = akd.subtract(union(cuts));
  // Liften: glazen schachten, verticale ruiten.
  const [l0, , l2, l3] = LIFTS.map((_, i) => edge(LIFTS, i));
  lifts = lifts.subtract(union([...columns(...l3, { pitch: 1.9, width: 1.2, rows: [[4.6, H.lifts - 0.8]], depth: 0.25 })]));
  void l0;
  void l2;
  // Verbinding: vensters in de noordwestgevel boven het tussenlid.
  const k0 = edge(LINK_HIGH, 3);
  linkHigh = linkHigh.subtract(union(columns(...k0, { pitch: 2.7, width: 1.3, rows: above(OFFICE_A, H.link + 0.5) })));
  // Tussenlid: glazen gevel aan de rivier.
  const k1 = edge(LINK_LOW, 2);
  const linkRows = [[4.5, 8.6], ...range(10, (k) => [9.4 + 3.5 * k + 0.3, 9.4 + 3.5 * k + 3.2])].filter(([, r1]) => r1 < H.link - 0.5);
  linkLow = linkLow.subtract(union(columns(...k1, { s0: 0.4, pitch: 1.9, width: 1.3, rows: linkRows, depth: 0.3 })));
}

// ---------- parkeerplint ----------
const plCs = cs(PLINTH);
let plinth = prismCs(plCs, BASE, z(H.plinthRim)).subtract(prismCs(plCs.offset(-0.9, "Miter"), z(H.plinth), z(H.plinthRim) + 1));
{
  const cuts = [];
  const [p0, p1, , p3] = PLINTH.map((_, i) => edge(PLINTH, i));
  cuts.push(...columns(...p0, { pitch: 3.6, width: 2.2, rows: [...LOBBY, ...PARK] }));
  cuts.push(...columns(...p1, { pitch: 3.6, width: 2.2, rows: above(PARK, 20.5) }));
  cuts.push(...columns(...p3, { s0: 7.2, pitch: 3.6, width: 2.2, rows: [...LOBBY, ...PARK] }));
  plinth = plinth.subtract(union(cuts));
}

// ---------- glazen uitbouw met gevouwen dak ----------
const extCs = cs(EXT);
let ext = union(
  FACETS.map(({ plane, region }) => {
    const sec = extCs.intersect(cs(region));
    if (sec.area() < 0.01) return null;
    const n = Math.hypot(plane.a, plane.b, 1);
    // houd alles onder z = plane - GROUND_NAP
    return prismCs(sec, BASE, z(25)).trimByPlane([plane.a / n, plane.b / n, -1 / n], -z(plane.c) / n);
  }),
);
{
  const cuts = [];
  const top = (u, v) => extRoof(u, v) - 1.0;
  const gl = { pitch: 1.9, width: 1.3, depth: 0.3, top };
  for (const i of [0, 2, 5, 6]) cuts.push(...columns(...edge(EXT, i), { ...gl, rows: [[4.6, 30]] }));
  cuts.push(...columns(...edge(EXT, 3), { ...gl, s0: 0.4, rows: [[4.6, 30]] }));
  ext = ext.subtract(union(cuts));
}

// ---------- luifel met boomkolommen ----------
function foldedStrip({ u0, u1, v0, v1, valleys }, alongU) {
  // Gevouwen glasplaat: per veld tussen twee bomen een dal op +10,2 bij de
  // bomen en een vouw op +11,4 halverwege; onderkant +8,9.
  const parts = [];
  for (let i = 0; i + 1 < valleys.length; i++) {
    const a = valleys[i], b = valleys[i + 1], m = (a + b) / 2;
    const P = (along, across, nap) => (alongU ? [along, across, z(nap)] : [across, along, z(nap)]);
    const [c0, c1] = alongU ? [v0, v1] : [u0, u1];
    parts.push(
      Manifold.hull([
        P(a, c0, H.canopyLow), P(a, c1, H.canopyLow), P(b, c0, H.canopyLow), P(b, c1, H.canopyLow),
        P(a, c0, H.canopyTop), P(a, c1, H.canopyTop), P(b, c0, H.canopyTop), P(b, c1, H.canopyTop),
        P(m, c0, H.canopyRidge), P(m, c1, H.canopyRidge),
      ]),
    );
  }
  return union(parts);
}
const canopy = union([
  foldedStrip(CANOPY_SW, false),
  foldedStrip(CANOPY_S, true),
  ...TREES.map(([u, v]) => box(u - 0.5, v - 0.5, BASE, u + 0.5, v + 0.5, z(H.canopyLow) + 0.3)),
]);

// Nissen die een ander bouwdeel afdekt, worden ingesloten holtes: die vallen weg.
let model = union([tall, roofBox, mast, column, akd, linkHigh, linkLow, lifts, plinth, prism(SLOT_FLOOR, BASE, z(H.plinth)), ext, canopy]);
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));
console.log("knik:", C.map((c) => c.toFixed(2)), F.map((c) => c.toFixed(2)), "uitbouwvlakken:", JSON.stringify({ PB, PC }));

const r2 = (p) => ({ a: +p.a.toFixed(4), b: +p.b.toFixed(4), c: +p.c.toFixed(2) });
await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Maastoren met geknikte schijf glazen kroon liftschacht mast AKD-toren plint uitbouw en luifel", model]],
  catalog: {
    name: "Maastoren",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Plein aan de zuidwestkant (AHN-DTM +3,7..+3,9) en de straat aan de
    // zuidkant (+3,8..+4,0); aan de waterkant ligt het AHN lager (+1,6), daar
    // loopt de voet tot +1,1 door.
    groundSamplePoints: [[-42, -20], [-42, 10], [-20, -34], [0, -34]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000754173"],
    description:
      "Oorsprong in het zuidelijke deel van de hoge schijf op straatniveau NAP +3,9 m, +X op 54,8 graden in RD (langs de zuidoostgevel), +Y naar de Nieuwe Maas; geknikte schijf (noordelijk deel 21 graden gedraaid) met dak op NAP +162,05 binnen een glazen kroon tot +164,7, glazen liftschacht tot +169,6 met mast tot +177,7, AKD-toren tot +108,9 met glazen kopband, glazen tussenlid tot +45, parkeerplint tot +45, glazen uitbouw met een gevouwen dak van vier vlakken (+11,6 tot +19,5) en de gevouwen luifel met boomkolommen; gevelritme, kroon en luifel uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      roofNapM: H.roof,
      crownTopNapM: H.crownTop,
      crownBottomNapM: H.crown0,
      liftShaftNapM: H.column,
      mastTopNapM: H.mastTop,
      akdRoofNapM: H.akd,
      akdBandNapM: H.akdBand,
      plinthNapM: H.plinth,
      linkNapM: H.link,
      kinkDegrees: 21,
      slabWidthM: +(T.e - T.w).toFixed(2),
      slabLengthM: +(A[1] - T.s).toFixed(2),
      storeyPitchM: { slab: +H.storeyT.toFixed(3), akd: +H.storeyA.toFixed(3) },
      extensionRoofPlanes: { nap: "c + a*x + b*y", A: r2(PA), S: r2(PS), B: r2(PB), C: r2(PC) },
      canopyNapM: [H.canopyLow, H.canopyTop, H.canopyRidge],
      axisDegrees: AXIS_DEG,
      estimates: [
        "gevelritme uit foto's: schijf met vensterkolommen op 3,4 m, een paneelvoeg van 0,5 m midden in elke liseen en een verdiepingsband van 0,4 m per laag (noordwestgevel drie vensterkolommen, het oostelijke derde dicht met alleen voegen), 30 kantoorlagen van 3,62 m boven de parkeerlagen; AKD-toren met lisenen en verdiepte vensterstroken van 1,9 m op 2,95 m (zuidwestgevel, 15 kolommen) en 3,9 m (kopgevels), 15 lagen van 3,67 m",
        "parkeerlagen als zes rijen roosters van 4 m op 6 m tot +45 en een glazen entreelaag; de verdeling uit een frontale foto van de noordwestgevel",
        "glazen kroon (+154 tot +164,7) en kopband van de AKD-toren (+100,4 tot +108,9) als ruiten tussen stijlen van 0,6 m",
        "liftschacht 4,9 x 20,1 m uit ortho en 3D BAG; open frame op de schacht als nissen; mast 1,5/1,0 m dik",
        "uitbouwdak: vlak B uit de 3D BAG (AHN-gat), vlak C geschat als aansluiting van A en B",
        "luifel: diepte en glashoogte uit het AHN, vouwen en de zeven boomkolommen (1 m) uit foto's en ortho; de witte masten boven de luifel zijn weggelaten",
        "glazen tussenlid en liften: hoogte uit 3D BAG en foto's",
      ],
    },
    sources: [
      "PDOK BAG pand 0599100000754173, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000754173 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): kroon, liftschacht, dakvlak van de uitbouw langs de schijf, tussenlid",
      "https://nl.wikipedia.org/wiki/Maastoren",
      "https://en.wikipedia.org/wiki/Maastoren",
      "https://commons.wikimedia.org/wiki/File:Bovenkant_van_Maastoren.jpg",
      "https://commons.wikimedia.org/wiki/File:Maastoren_2012.jpg",
      "https://commons.wikimedia.org/wiki/File:Maastoren_IMG_5117.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_toren_maastoren.jpg",
      "https://commons.wikimedia.org/wiki/File:Maastoren_entrance.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_(NL),_Maastoren_--_2023_--_0105.jpg",
      "https://commons.wikimedia.org/wiki/File:De_Maastoren_in_Rotterdam_in_2021.jpg",
      "https://commons.wikimedia.org/wiki/File:Maastoren_Rotterdam.jpg",
    ],
  },
});

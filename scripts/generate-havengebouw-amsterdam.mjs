// Havengebouw (De Ruijterkade 7, Amsterdam, 1960; W.M. Dudok en R. Magnée): kantoorschijf van dertien
// verdiepingen aan het IJ, haaks op de kade, met de smalle noordoostkop naar het water. Elf lagen kantoor
// (begane grond en tien verdiepingen) tot een dakterras op NAP +43,05 m, daarop een teruggezette kroon van
// twee lagen (restaurant, café en bar) tot +51,35 m met een glasband rondom en een installatieopbouw tot
// +53,78 m. Kenmerkend zijn de donkere lisenen op de lange gevels die boven het terras doorlopen in rode
// stalen beugels die met een arm over de rand van de kroon grijpen, de horizontale vensterbanden tussen de
// lisenen, de donkere bakstenen kopgevels met in het midden een uitspringende strook loggia's, en de lage
// paviljoens aan de spoorzijde. Contouren uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023) en het
// AHN-DSM 0,5 m, gevelopbouw uit foto's (Commons).
import { Manifold, ccw, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "havengebouw-amsterdam";
// Gebouwstelsel = modelstelsel: u langs de lange gevels van de schijf (BAG-zijden 59,2° op RD-oost, naar
// het noordoosten, de kade en het IJ), v naar het noordwesten. Oorsprong midden in de BAG-contour van pand
// 0363100012179689 (de oostelijke 35,6 m van de schijf).
const ORIGIN = [121522.8, 488299.2];
const ANGLE = 59.2;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.735; // NAP, 3D BAG b3_h_maaiveld 0,735 (westelijk deel 0,77); PDOK-terrein rondom 43,74–43,94 m ellipsoïdisch
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Schijf ----------
// BAG-contour van de panden 0363100012179689 en 0363100012179691 (westelijke 10 m): u −27,93 … 17,78,
// v −11,05 … 11,13 (22,2 × 45,7 m). Het DSM bevestigt de koppen (u −28,0 en 17,75).
const SLAB = { u0: -27.93, u1: 17.78, v0: -11.05, v1: 11.13 };
// Dakterras van de schijf +43,05 m (3D BAG-vlakken 108, 90, 117: 43,00–43,09; DSM 43,05–43,5) met een
// borstwering tot +44,15 m langs de rand (DSM 44,12–44,20 langs de noordwestgevel en de noordoostkop; op
// de foto's een witte rand met hekwerk, hier 0,9 m breed en dicht).
const TERRACE = 43.05, PARAPET = 44.15, PARAPET_W = 0.9;
// Begane grond tot +5,0 m (zelfde hoogte als het paviljoen), daarboven tien kantoorlagen tot het terras.
const GF_TOP = 5.0, FLOORS = 10;
const STOREY = (TERRACE - GF_TOP) / FLOORS; // 3,805 m
const floorZ = (k) => z(k === 0 ? GROUND : GF_TOP + STOREY * (k - 1));

// ---------- Kroon ----------
// Dakrand van de kroon uit het DSM (dak +51,35 m: DSM 51,34–51,40, 3D BAG-vlak 112: 51,28–51,32): u −25,45
// … 16,55 en v −8,65 … 10,20. De kroon staat dus 2,5 m terug van de zuidwestkop, 1,2 m van de
// noordoostkop, 2,4 m van de zuidoostgevel (3D BAG: terras op 43,0 tot v −8,9) en 0,9 m van de
// noordwestgevel. Op de foto's: boven het terras een lage teruggezette laag met een rij lage ramen, dan
// een witte band onder een glasband die naar buiten helt, met de dakrand erboven. Hier: onderlaag tot
// +45,0 m 0,9 m binnen de dakrand, een kraag van 45° naar de dakrand en de glasband als blinde nis van
// +46,9 tot +50,7 m.
const CROWN = { u0: -25.45, u1: 16.55, v0: -8.65, v1: 10.2 };
const CROWN_TOP = 51.35, CROWN_LOW_TOP = 45.0, CROWN_INSET = 0.9;
const GLASS_LO = 46.9, GLASS_HI = 50.7;
// Installatieopbouw (blauwe kap op de foto's): 3D BAG-vlak 116 op +53,75 m, DSM 53,76–53,80 (mediaan 53,78).
const INSTALL = [[-17.8, -4.4], [12.7, -4.4], [12.7, 2.2], [10.7, 2.8], [7.2, 5.05], [-17.8, 5.05]];
const INSTALL_TOP = 53.78;
// Twee kleinere opbouwen tot +54,65 m (3D BAG-vlakken 109 en 111: 54,62–54,68).
const TOP_BOXES = [[[-0.45, -2.5], [1.3, -2.5], [1.3, 2.5], [-0.45, 2.5]], [[-11.4, 0.1], [-9.55, 0.1], [-9.55, 2.9], [-11.4, 2.9]]];
const TOP_BOX_TOP = 54.65;

// ---------- Lisenen en rode beugels ----------
// Tien lisenen per lange gevel, de buitenste op de hoeken: in het DSM staan de beugels langs de
// noordwestgevel om de 5,0 m (pieken op u −22,5, −17,5, …, 17,5); op de foto's 10 beugels per lange gevel
// en vier per kop (twee op de hoeken, twee naast de loggiastrook). Lisene 0,9 m breed, 0,3 m voor de gevel
// (donkere strook op de foto's), vanaf de eerste verdieping tot het terras.
const PIL_W = 0.9, PIL_OUT = 0.3;
const PIL_U = Array.from({ length: 10 }, (_, k) => SLAB.u0 + PIL_W / 2 + (k * (SLAB.u1 - SLAB.u0 - PIL_W)) / 9);
// Beugel: staander 0,9 × 0,9 m (in werkelijkheid circa 0,5 m; dikker om te printen) van het terras tot
// +51,9 m (op de foto's iets boven de dakrand van de kroon; DSM-pieken tot 51,2 op 0,5 m-pixels), met een
// arm van 0,9 m over de dakrand van de kroon en een schoor van 45° eronder waar de kroon verder terugligt.
const BRACKET_TOP = 51.9, BRACKET = 0.9, BRACKET_OUT = 0.3;

// ---------- Loggiastroken op de koppen ----------
// Op beide koppen een strook loggia's met balkons in een witte omlijsting midden in de bakstenen gevel. DSM:
// bovenkant +42,5 m (42,5–42,6) van v −4,0 tot 4,5, 1,4 m voor de kopgevel (tot u 19,2; zuidwestkop 3D
// BAG-vlak 86 tot u −29,44). Zijkanten (omlijsting) 0,9 m; per laag een loggia van 1,0 m diep met een
// balkonband van 1,0 m (vloer en borstwering dicht) en een plafond van 45°.
const STRIP = { v0: -4.0, v1: 4.5, out: 1.42, top: 42.5, side: 0.9, depth: 1.0, band: 1.0 };
// Kopgevels: per laag aan weerszijden van de strook één liggend venster (foto vanaf het IJ), 2,6 × 1,1 m.
const END_WIN = { w: 2.6, lo: 1.3, hi: 2.4 };

// ---------- Paviljoen en lage vleugel ----------
// Paviljoen aan de zuidwestkop (deel van BAG-pand 0363100012179691), dak +4,95 m (3D BAG-vlak 88: 4,80–5,05).
const PAVILION = [[-27.0, 10.76], [-29.31, 10.76], [-31.46, 4.83], [-32.73, 1.35], [-33.49, -1.74], [-34.65, -10.3], [-36.05, -10.11], [-36.55, -13.79], [-30.21, -14.7], [-29.56, -10.56], [-27.0, -10.61]];
const PAVILION_TOP = 4.95;
// Lage vleugel van twee lagen langs het spoor (BAG-pand 0363100012170978, bouwjaar 1960), dak +9,75 m
// (3D BAG 9,75–9,76), sluit aan op het paviljoen.
// De noordrand loopt 0,4 m het paviljoen in, zodat beide één geheel vormen.
const LOW_WING = [[-33.56, -43.06], [-32.07, -43.2], [-31.56, -39.41], [-28.23, -14.91], [-30.21, -14.7], [-30.4, -14.2], [-36.3, -13.4], [-37.17, -13.7], [-41.01, -42.0]];
const LOW_WING_TOP = 9.75;
// Halfronde entreeluifel aan de zuidoostgevel (in de BAG-contour; 3D BAG-vlak 114: +3,26–3,46 m, straal
// 1,9 m, tot v −12,87). Hier dicht tot het maaiveld.
const PORCH = { c: [-10.25, SLAB.v0], r: 1.9, top: 3.35 };

// ---------- Opbouw ----------
const rect = (u0, v0, u1, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const shrink = (r, d) => ({ u0: r.u0 + d, u1: r.u1 - d, v0: r.v0 + d, v1: r.v1 - d });
const rectOf = (r) => rect(r.u0, r.v0, r.u1, r.v1);
const slabPoly = rectOf(SLAB);
const crownLow = shrink(CROWN, CROWN_INSET);
const box3 = (r, z0, z1) => prism(rectOf(r), z0, z1);
// Kroon: onderlaag binnen de dakrand, kraag van 45° naar de dakrand, glaslaag tot het dak.
const crownCollar = Manifold.hull([
  ...rectOf(crownLow).map(([u, v]) => [u, v, z(CROWN_LOW_TOP)]),
  ...rectOf(CROWN).map(([u, v]) => [u, v, z(CROWN_LOW_TOP) + CROWN_INSET]),
]);
const parapet = prism(slabPoly, z(TERRACE) - 0.1, z(PARAPET)).subtract(prism(rectOf(shrink(SLAB, PARAPET_W)), z(TERRACE), z(PARAPET) + 1));

// Lange gevels: zuidoost (v0, naar buiten −v) en noordwest (v1, naar buiten +v); koppen: noordoost (u1) en zuidwest (u0).
const pilasters = [];
for (const u of PIL_U) for (const [v, s] of [[SLAB.v0, -1], [SLAB.v1, 1]]) {
  const vin = v - s * 0.2, vout = v + s * PIL_OUT;
  const poly = rect(u - PIL_W / 2, Math.min(vin, vout), u + PIL_W / 2, Math.max(vin, vout));
  // Onderkant onder 45° terug naar de gevel boven de begane grond.
  pilasters.push(Manifold.hull([
    ...poly.map(([a, b]) => [a, b, z(TERRACE)]),
    ...poly.map(([a, b]) => [a, b, z(GF_TOP) + PIL_OUT]),
    ...[[u - PIL_W / 2, vin], [u + PIL_W / 2, vin]].map(([a, b]) => [a, b, z(GF_TOP)]),
  ]));
}

// Beugels: staander voor de gevellijn, arm naar de dakrand van de kroon, schoor onder 45°.
const brackets = [];
function bracket(base, out, target) {
  // base: punt op de gevellijn; out: eenheidsvector naar buiten (of diagonaal op de hoek); target: punt op de dakrand.
  const h = BRACKET / 2, side = [-out[1], out[0]];
  const sq = (c) => [-1, 1].flatMap((a) => [-1, 1].map((b) => [c[0] + side[0] * h * a + out[0] * h * b, c[1] + side[1] * h * a + out[1] * h * b]));
  const c0 = [base[0] + out[0] * (BRACKET_OUT - h), base[1] + out[1] * (BRACKET_OUT - h)];
  const top = z(BRACKET_TOP), armLo = top - BRACKET;
  const foot = sq(c0);
  brackets.push(Manifold.hull([...foot.map(([a, b]) => [a, b, z(TERRACE) - 0.6]), ...foot.map(([a, b]) => [a, b, top])]));
  // Arm tot 0,5 m binnen de dakrand, schoor van 45° vanaf de binnenkant van de staander.
  const t = [target[0] - out[0] * 0.5, target[1] - out[1] * 0.5];
  const reach = Math.max(0, (c0[0] - target[0]) * out[0] + (c0[1] - target[1]) * out[1] - h);
  const inner = [c0[0] - out[0] * h, c0[1] - out[1] * h];
  brackets.push(Manifold.hull([
    ...foot.map(([a, b]) => [a, b, armLo]), ...foot.map(([a, b]) => [a, b, top]),
    ...sq(t).map(([a, b]) => [a, b, armLo]), ...sq(t).map(([a, b]) => [a, b, top]),
    ...[-1, 1].map((a) => [inner[0] + side[0] * h * a, inner[1] + side[1] * h * a, armLo - reach]),
  ]));
}
const norm = ([a, b]) => { const l = Math.hypot(a, b); return [a / l, b / l]; };
// Lange gevels: acht tussenbeugels per gevel; hoeken: één diagonale beugel naar de hoek van de kroon.
for (const u of PIL_U.slice(1, -1)) {
  bracket([u, SLAB.v0], [0, -1], [u, CROWN.v0]);
  bracket([u, SLAB.v1], [0, 1], [u, CROWN.v1]);
}
for (const [cu, cv, ku, kv] of [[SLAB.u0, SLAB.v0, CROWN.u0, CROWN.v0], [SLAB.u1, SLAB.v0, CROWN.u1, CROWN.v0], [SLAB.u1, SLAB.v1, CROWN.u1, CROWN.v1], [SLAB.u0, SLAB.v1, CROWN.u0, CROWN.v1]]) {
  const out = norm([Math.sign(cu), Math.sign(cv)]);
  const base = [cu - out[0] * 0.45, cv - out[1] * 0.45];
  bracket(base, out, [ku, kv]);
}
// Koppen: twee beugels naast de loggiastrook.
for (const v of [STRIP.v0 - 0.2, STRIP.v1 + 0.2]) {
  bracket([SLAB.u1, v], [1, 0], [CROWN.u1, v]);
  bracket([SLAB.u0, v], [-1, 0], [CROWN.u0, v]);
}

// Loggiastroken op beide koppen (van het maaiveld tot +42,5 m).
const strips = [
  prism(rect(SLAB.u1 - 0.2, STRIP.v0, SLAB.u1 + STRIP.out, STRIP.v1), BASE, z(STRIP.top)),
  prism(rect(SLAB.u0 - STRIP.out, STRIP.v0, SLAB.u0 + 0.2, STRIP.v1), BASE, z(STRIP.top)),
];

const porch = Manifold.cylinder(PORCH.top - GROUND - BASE, PORCH.r, PORCH.r, 32).translate([PORCH.c[0], PORCH.c[1], BASE]);

const body = union([
  prism(slabPoly, BASE, z(TERRACE)),
  parapet,
  box3(crownLow, z(TERRACE) - 0.1, z(CROWN_LOW_TOP) + 0.01),
  crownCollar,
  box3(CROWN, z(CROWN_LOW_TOP) + CROWN_INSET - 0.01, z(CROWN_TOP)),
  prism(INSTALL, z(CROWN_TOP) - 0.1, z(INSTALL_TOP)),
  ...TOP_BOXES.map((p) => prism(p, z(INSTALL_TOP) - 0.1, z(TOP_BOX_TOP))),
  ...pilasters,
  ...strips,
  porch,
  prism(PAVILION, BASE, z(PAVILION_TOP)),
  prism(LOW_WING, BASE, z(LOW_WING_TOP)),
]);

// ---------- Gevelreliëf ----------
// Blinde nissen van 0,35 m met een plafond onder 45°, alleen waar de gevel vrij ligt met ≥ 1 m materiaal
// erachter (stralen op het volume).
const DEPTH = 0.35;
const cuts = [];
function edgeFrame(a, b) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const exposed = (s, h, depth = DEPTH) => {
    const from = P(s, -3, h), hits = body.rayCast(from, P(s, 12, h));
    const at = (j) => hits[j] && Math.hypot(hits[j].position[0] - from[0], hits[j].position[1] - from[1]);
    return at(0) > 2.75 && at(0) < 3.25 && !(at(1) < 3 + depth + 1);
  };
  return { L, d, n, P, exposed };
}
// Nis van s0 tot s1 langs een gevel, van lo tot hi, plafond onder 45°.
function niche(fr, s0, s1, lo, hi, depth = DEPTH, test = true) {
  if (s1 - s0 < 0.9 || hi - lo < 0.9) return;
  if (test && ![s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi - 0.05].every((h) => fr.exposed(s, h, depth)))) return;
  const { P } = fr;
  cuts.push(Manifold.hull([
    P(s0, -0.3, lo), P(s1, -0.3, lo), P(s0, depth, lo), P(s1, depth, lo),
    P(s0, -0.3, hi + 0.3), P(s1, -0.3, hi + 0.3), P(s0, depth, hi - depth), P(s1, depth, hi - depth),
  ]));
}
// Lange gevels: per laag tussen elk paar lisenen een vensterband (borstwering 1,0 m, venster 1,9 m); op de
// begane grond een hogere glasband.
const SE = edgeFrame([SLAB.u0, SLAB.v0], [SLAB.u1, SLAB.v0]);
const NW = edgeFrame([SLAB.u1, SLAB.v1], [SLAB.u0, SLAB.v1]);
for (const [fr, sOf] of [[SE, (u) => u - SLAB.u0], [NW, (u) => SLAB.u1 - u]]) {
  for (let i = 0; i + 1 < PIL_U.length; i++) {
    const a = sOf(PIL_U[i]), b = sOf(PIL_U[i + 1]);
    const s0 = Math.min(a, b) + PIL_W / 2 + 0.3, s1 = Math.max(a, b) - PIL_W / 2 - 0.3;
    niche(fr, s0, s1, 0.4, z(GF_TOP) - 0.7);
    for (let k = 1; k <= FLOORS; k++) niche(fr, s0, s1, floorZ(k) + 1.0, floorZ(k) + 2.9);
  }
}
// Kopgevels: liggende vensters naast de loggiastrook.
const NE = edgeFrame([SLAB.u1, SLAB.v0], [SLAB.u1, SLAB.v1]);
const SW = edgeFrame([SLAB.u0, SLAB.v1], [SLAB.u0, SLAB.v0]);
for (const [fr, sOf] of [[NE, (v) => v - SLAB.v0], [SW, (v) => SLAB.v1 - v]]) {
  for (const c of [(SLAB.v0 + STRIP.v0) / 2, (STRIP.v1 + SLAB.v1) / 2]) {
    const s = sOf(c);
    for (let k = 1; k <= FLOORS; k++) niche(fr, s - END_WIN.w / 2, s + END_WIN.w / 2, floorZ(k) + END_WIN.lo, floorZ(k) + END_WIN.hi);
  }
}
// Loggia's in de stroken: tussen de omlijsting, per laag een opening boven de balkonband; op de begane grond
// een entreenis.
for (const [fr, sOf] of [
  [edgeFrame([SLAB.u1 + STRIP.out, STRIP.v0], [SLAB.u1 + STRIP.out, STRIP.v1]), (v) => v - STRIP.v0],
  [edgeFrame([SLAB.u0 - STRIP.out, STRIP.v1], [SLAB.u0 - STRIP.out, STRIP.v0]), (v) => STRIP.v1 - v],
]) {
  const s0 = Math.min(sOf(STRIP.v0 + STRIP.side), sOf(STRIP.v1 - STRIP.side)), s1 = Math.max(sOf(STRIP.v0 + STRIP.side), sOf(STRIP.v1 - STRIP.side));
  niche(fr, s0, s1, 0.4, z(GF_TOP) - 0.7); // niet waar het paviljoen ertegen staat
  for (let k = 1; k <= FLOORS; k++) {
    const lo = floorZ(k) + STRIP.band, hi = Math.min(floorZ(k + 1), z(STRIP.top) - 0.9);
    niche(fr, s0, s1, lo, hi, STRIP.depth, false);
  }
}
// Kroon: doorlopende glasband rondom (0,5 m van de hoeken).
for (const fr of [
  edgeFrame([CROWN.u0, CROWN.v0], [CROWN.u1, CROWN.v0]), edgeFrame([CROWN.u1, CROWN.v0], [CROWN.u1, CROWN.v1]),
  edgeFrame([CROWN.u1, CROWN.v1], [CROWN.u0, CROWN.v1]), edgeFrame([CROWN.u0, CROWN.v1], [CROWN.u0, CROWN.v0]),
]) niche(fr, 0.5, fr.L - 0.5, z(GLASS_LO), z(GLASS_HI), DEPTH, false);
// Paviljoen en lage vleugel: vensterbanden per laag in vakken van circa 3,6 m met penanten van 0,9 m.
function bands(poly, rows, bay = 3.6, pier = 0.9) {
  const p = ccw(poly);
  for (let i = 0; i < p.length; i++) {
    const fr = edgeFrame(p[i], p[(i + 1) % p.length]);
    if (fr.L < 3) continue;
    const n = Math.max(1, Math.round((fr.L - pier) / bay)), w = (fr.L - pier) / n;
    for (const [lo, hi] of rows) for (let k = 0; k < n; k++) niche(fr, pier + k * w, pier + (k + 1) * w - pier, lo, hi);
  }
}
bands(PAVILION, [[0.9, z(PAVILION_TOP) - 1.0]]);
bands(LOW_WING, [[0.9, 3.3], [5.2, 7.6]]);

// Kroonbeugels pas na de nissen toevoegen: de glasband loopt achter de staanders door.
const building = body.subtract(union(cuts)).add(union(brackets));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Havengebouw: ${parts.length} losse delen`);
console.log("Havengebouw", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length, "beugels", brackets.length / 2);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:havengebouw-schijf-met-kroon-beugels-loggiastroken-en-paviljoens", building]],
  catalog: {
    name: "Havengebouw",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.737, // laagste PDOK-terrein op de groundSamplePoints (ellipsoïdisch), stoep ten noordoosten
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-22, 13.5], [-12, 13.5], [0, 13.5], [12, 13.5], [21, 8], [21, 0], [21, -7], [12, -13.5], [-2, -13.5], [-20, -13.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0363100012179689", "NL.IMBAG.Pand.0363100012179691", "NL.IMBAG.Pand.0363100012170978"],
    description:
      "Havengebouw aan de De Ruijterkade (Dudok en Magnée, 1960): kantoorschijf van 45,7 × 22,2 m haaks op het IJ met elf lagen tot een dakterras op NAP +43,05 m en een borstwering tot +44,15 m, daarop een teruggezette kroon van twee lagen tot +51,35 m (onderlaag binnen de dakrand, kraag van 45°, glasband rondom) en een installatieopbouw tot +53,78 m met twee kleinere opbouwen tot +54,65 m. Tien lisenen per lange gevel met vensterbanden ertussen, die boven het terras doorlopen in rode beugels tot +51,9 m met een arm over de dakrand van de kroon; op beide bakstenen koppen een uitspringende strook loggia's tot +42,5 m en liggende vensters. Halfronde entreeluifel aan de zuidoostgevel, paviljoen tot +4,95 m aan de zuidwestkop en een lage vleugel tot +9,75 m langs het spoor. BAG-contouren, hoogtes uit de 3D BAG (AHN5 2023) en het AHN-DSM. Oorsprong midden in het oostelijke BAG-pand, X-as langs de lange gevels (59,2° op RD-oost, naar de kade). Verdiepingshoogtes, vensterbanden, de loggia's en de vorm van de beugels zijn geschat; de beugels zijn dikker dan in werkelijkheid.",
    realWorld: {
      groundNapM: GROUND,
      slabM: [+(SLAB.u1 - SLAB.u0).toFixed(2), +(SLAB.v1 - SLAB.v0).toFixed(2)],
      terraceNapM: TERRACE,
      parapetNapM: PARAPET,
      crownLowerNapM: CROWN_LOW_TOP,
      crownRoofNapM: CROWN_TOP,
      crownGlassBandNapM: [GLASS_LO, GLASS_HI],
      crownSetbackM: { southWest: +(CROWN.u0 - SLAB.u0).toFixed(2), northEast: +(SLAB.u1 - CROWN.u1).toFixed(2), southEast: +(CROWN.v0 - SLAB.v0).toFixed(2), northWest: +(SLAB.v1 - CROWN.v1).toFixed(2) },
      installationNapM: INSTALL_TOP,
      topBoxesNapM: TOP_BOX_TOP,
      bracketTopNapM: BRACKET_TOP,
      bracketsPerLongFace: PIL_U.length,
      loggiaStripTopNapM: STRIP.top,
      loggiaStripProjectionM: STRIP.out,
      storeys: { groundFloorTopNapM: GF_TOP, storeyM: +STOREY.toFixed(3), officeFloorsAboveGround: FLOORS, crownFloors: 2 },
      pavilionNapM: PAVILION_TOP,
      lowWingNapM: LOW_WING_TOP,
      porchNapM: PORCH.top,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
      estimatedBracketShape: true,
      estimatedStoreyHeights: true,
    },
    sources: [
      "PDOK BAG panden 0363100012179689, 0363100012179691 en 0363100012170978 (bouwjaar 1960), actuele orthoHR, AHN DSM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012179689",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012179691",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012170978",
      "https://nl.wikipedia.org/wiki/Havengebouw_(Amsterdam)",
      "https://commons.wikimedia.org/wiki/File:Havengebouw_De_Ruijterkade_7,_Amsterdam.JPG",
      "https://commons.wikimedia.org/wiki/File:Amsterdam_Havengebouw_001.JPG",
      "https://commons.wikimedia.org/wiki/File:Amsterdam_Havengebouw_002.JPG",
      "https://commons.wikimedia.org/wiki/File:Havengebouw_Amsterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Amsterdam_20050827_(21).jpg",
    ],
  },
});

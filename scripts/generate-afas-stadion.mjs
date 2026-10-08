// Genereert een vereenvoudigd, gesloten 3D-model van het AFAS Stadion in
// Alkmaar (thuisstadion van AZ) zoals het sinds het nieuwe dak van ZJA (2021)
// is: de afgeronde ring van tribunes rond de veldopening, en daarboven een
// doorlopend dak van 2,5 m dik rondom. Over de drie lage tribunes (noordoost
// en de twee koppen) loopt dat dak van +27,5 m aan de veldkant naar +23 m aan de
// dakgoot op de buitenrand en hangt het aan 20 kraanspanten buiten het
// stadion (masten van +30 m met een schoor naar de binnenrand); boven de
// hoofdtribune in het zuidwesten ligt het dak op +27 m aan de voorrand tot
// +29 m achter, met de megatruss (een boog tot +40,5 m) aan de voorrand en een
// gesloten achtergevel. De rang blijft onder het dak zichtbaar (open ruimte
// tussen rang en dakplaat). De rang is gemeten in 96 stralen vanuit het hart en
// opgebouwd uit vlakke strokken, het dak uit 192 vlakke dakstroken tussen een
// binnen- en een buitenrand (geen hoogteveld); het Mapbox-model is niet gebruikt.
// De vier lichtmasten op de binnenhoeken zijn weg (ledverlichting in de
// dakrand). Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-afas-stadion.mjs              # 1:1000 (standaard)
//   node scripts/generate-afas-stadion.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening op maaiveldniveau
// (NAP -0,26 m), Z omhoog. +X loopt langs de lengteas van het veld naar het
// zuidoosten (RD-richting (0,7056, -0,7086), -45,12 graden), +Y dwars daarop
// naar het noordoosten; de hoofdtribune ligt aan de -Y-kant.
//
// Bronnen: PDOK BAG-panden 0361100000106554 en 0361100000206467 (contour en
// vervangen panden); AHN DSM/DTM 0,5 m (PDOK WCS, opname van toen de dakken
// van de drie tribunes waren gesloopt): de veldopening (138 bij 94 m) en de
// rang (per straal de binnenrand, de achterrand en de hoogte daar); de PDOK
// luchtfoto's van 2021 tot 2026 voor de plattegrond van het dak en de plaats
// van de masten, en de schaduwen daarop (zon recht uit het zuiden) voor de
// hoogtes: de verhoudingen tussen dakrand, voorrand en boog komen uit de
// schaduwlengtes, de schaal uit de bouwcijfers (Wikipedia, ZJA, stadiumdb,
// Royal HaskoningDHV, BAM, ASK Romein: truss van 170 m lang en 17 tot 19 m
// hoog met zijn hoogste punt op 40 m boven het veld, 22 kraanspanten van 30 m,
// dak 30 m het stadion in). Geschat: de hoogtes van het dak op circa 1,5 m, de
// 2 m schuin van de masten, de doorsnede van boog, masten en schoren (in het
// echt open vakwerk en kabels) en de vorm van de achtergevel. Weggelaten: de
// dakribben, de zonnepanelen, de hangers van de boog, de trekstangen langs de
// dakrand en de entreegebouwen aan de zuidwestkant.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "afas-stadion");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Convexe veelhoek in plan met een dakvlak z = a x + b y + c, vanaf z0 omhoog.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([
    ...pts.map(([x, y]) => [x, y, z0]),
    ...pts.map(([x, y]) => [x, y, a * x + b * y + c]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);

const SLUG = "afas-stadion";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP -0,26 m) ----------
const GROUND_NAP = -0.26;
const ORIGIN = [111304.05, 514113.22];
const X_AXIS = [0.705624, -0.708586]; // RD-richting -45,12 graden, langs het veld
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// De tribunerang is een ring rond de veldopening, gemeten in 96 stralen vanuit
// het hart (om de 3,75 graden, hoek vanaf de +X-as tegen de klok in). Per
// straal: de binnenrand (veldkant, eerste rij op +1,5 m), de achterrand van de
// rang en de hoogte daar (AHN-DSM, 0,5 m, toen het oude dak van de drie andere
// tribunes al was gesloopt; gemiddelde van vijf stralen tegen de ruis). De rang
// helt 0,55 tot 0,75 m per meter. Voor de hoofdtribune (stralen MAIN_RAYS, het
// zuidwesten) zat het AHN onder het oude dak en geeft het alleen de binnenrand;
// daar loopt de rang onder dezelfde helling door.
const Z_IN = 1.5;
// [straal binnenrand, straal achterrand, hoogte achterrand]
const RING = [
  [65.7, 85.3, 14.3], [65.8, 85.5, 14.3], [66.2, 86.0, 14.3], [66.9, 86.9, 14.3], [68.0, 88.1, 14.4], [69.1, 89.4, 14.4],
  [70.2, 90.4, 14.4], [70.8, 90.8, 14.4], [70.7, 90.6, 14.4], [69.9, 89.8, 14.4], [68.1, 88.6, 14.4], [65.6, 87.1, 14.4],
  [62.5, 85.2, 14.4], [59.4, 82.9, 14.4], [56.5, 80.5, 14.5], [53.9, 78.3, 14.7], [51.6, 76.5, 14.8], [49.8, 74.9, 15.0],
  [48.3, 73.4, 15.3], [47.2, 72.1, 15.5], [46.4, 71.0, 15.7], [45.7, 70.3, 15.9], [45.2, 69.8, 15.9], [44.9, 69.6, 16.0],
  [44.7, 69.6, 16.0], [44.9, 69.7, 16.0], [45.2, 70.1, 16.0], [45.7, 70.6, 16.0], [46.4, 71.4, 15.9], [47.2, 72.4, 15.8],
  [48.3, 73.5, 15.6], [49.8, 74.9, 15.4], [51.6, 76.6, 15.2], [53.9, 78.5, 14.9], [56.5, 80.5, 14.8], [59.4, 82.6, 14.6],
  [62.6, 84.5, 14.4], [65.6, 86.2, 14.1], [68.1, 87.8, 13.9], [69.8, 89.2, 13.8], [70.6, 90.1, 13.7], [70.7, 90.4, 13.7],
  [70.1, 90.1, 13.6], [69.1, 89.2, 13.6], [67.9, 88.1, 13.6], [67.0, 86.9, 13.6], [66.3, 86.0, 13.6], [66.0, 85.4, 13.6],
  [65.8, 85.2, 13.6], [66.0, 85.2, 13.6], [66.3, 85.5, 13.6], [67.0, 86.0, 13.6], [68.0, 86.5, 13.6], [69.1, 0, 0],
  [70.2, 0, 0], [70.8, 0, 0], [70.7, 0, 0], [69.8, 0, 0], [68.1, 0, 0], [65.6, 0, 0],
  [62.6, 0, 0], [59.4, 0, 0], [56.5, 0, 0], [53.9, 0, 0], [51.7, 0, 0], [49.9, 0, 0],
  [48.4, 0, 0], [47.3, 0, 0], [46.4, 0, 0], [45.8, 0, 0], [45.2, 0, 0], [44.9, 0, 0],
  [44.7, 0, 0], [44.9, 0, 0], [45.2, 0, 0], [45.8, 0, 0], [46.4, 0, 0], [47.3, 0, 0],
  [48.4, 0, 0], [49.8, 0, 0], [51.5, 0, 0], [53.7, 0, 0], [56.3, 0, 0], [59.2, 0, 0],
  [62.4, 0, 0], [65.4, 0, 0], [68.0, 0, 0], [69.7, 0, 0], [70.6, 0, 0], [70.7, 0, 0],
  [70.1, 0, 0], [69.0, 0, 0], [67.9, 0, 0], [66.9, 87.5, 15.6], [66.2, 86.2, 14.8], [65.8, 85.5, 14.4],
];
const RAYS = RING.length;
const MAIN_RAYS = [53, 92];
const MAIN_SLOPE = 0.55;

// Het dak (ZJA, 2021): een doorlopende ring van vlakke dakstroken boven de
// tribunes, hangend aan 20 kraanspanten buiten het stadion en aan de megatruss
// boven de hoofdtribune. Plattegrond (luchtfoto 2026) in het lokale stelsel,
// tegen de klok in vanaf het oosten.
const ROOF_OUT = [
  [90.5, -23], [90.5, 0], [90.8, 26], [90, 32], [88, 38], [85, 44], [82, 49], [78, 53], [74, 56.5], [70, 59.8],
  [65, 62.3], [60, 64.3], [55, 66], [50, 67.5], [45, 68.8], [35, 70], [20, 70.7], [0, 71.4], [-15, 71], [-26, 70.9],
  [-40, 70.2], [-48, 69.3], [-55, 67.5], [-62, 65.4], [-69, 62.5], [-75, 58.6], [-80, 54.3], [-84.3, 49.3], [-87, 44.3],
  [-89, 38.6], [-90.4, 32.9], [-91, 25.7], [-91, 0], [-91, -21], [-85, -24], [-85, -33], [-87, -37], [-88.4, -46],
  [-84.3, -52.1], [-80, -57.9], [-75, -63.6], [-69.3, -68.6], [-62, -72.9], [-50, -74.8], [-40, -76.5], [-30, -77.7],
  [-15, -78.5], [0, -78.7], [15, -78.5], [30, -77.5], [40, -76.3], [50, -74.2], [58, -72.3], [66, -70], [73.6, -65.7],
  [80.7, -60], [85.7, -54.3], [88.4, -46], [86.5, -37], [83.5, -33], [83.5, -26],
];
const ROOF_IN = [
  [57, -34], [58, -30], [62.5, -22], [63.5, -10], [63.5, 20], [62, 28], [57.5, 33], [51, 38], [45, 40.5], [35, 41.8],
  [20, 43], [0, 43.6], [-15, 43], [-30, 42], [-42, 41], [-52, 39], [-58, 35], [-63, 29], [-66, 20], [-66, 0],
  [-66, -18], [-63, -26], [-60, -34], [0, -34],
];
const ROOF_T = 2.5;
// Bovenkant van het dak: aan de buitenrand en aan de binnenrand (veldkant).
// Over de drie tribunes loopt het dak naar de dakgoot op de buitenrand af
// (+27,5 m aan de veldkant, +23,0 m buiten); boven de hoofdtribune ligt de
// voorrand (de megatruss) op +27 m en stijgt het dak 2 m naar de achterkant.
const ZIN_SIDE = 27.5;
const ZOUT_SIDE = 23.0;
const ZIN_MAIN = 27.0;
const ZOUT_MAIN = 29.0;
const MAIN_DEG = [207.5, 332.5];
const RAMP_DEG = 12.5;
// De zuidwestkant: achtergevel tot de grond, de megatruss en haar twee voeten.
const WALL_T = 2.5;
const WALL_Z0 = BASE;
const ARCH_V = [-37.5, -34.5];
const ARCH_SPAN = 85;
const ARCH_CROWN = 40.5;
const ARCH_DEPTH = 3;
const FRAME_U = [81.5, 86.5];
const FRAME_V = [-45.5, -35.5];
// Kraanspanten: masten van 2,4 m op een eigen voet net buiten de dakrand (top
// op +30 m, 2 m uit het lood naar buiten), met een lip van het dak eraan; plaats
// van de toppen in plan afgelezen op de luchtfoto.
const MAST_W = 2.4;
const MAST_TOP = 30;
const STAY_W = 1.2;
const MAST_TIPS = [
  [-56.4, 76.4], [-40.4, 78.2], [-24.6, 79.4], [-8.9, 80], [7, 80], [22.9, 79.4], [38.7, 78.4], [54.6, 76.8],
  [-77.9, 68.6], [-93.2, 51.8], [-100, 30.1], [-100.5, 14.7], [-100.5, -3], [-100, -19.5],
  [76.1, 68.6], [91.4, 51.8], [98.6, 30.7], [98.6, 13.6], [99.3, -2.9], [98.2, -19.6],
];
// Maaiveld (AHN NAP -0,3 tot -0,8 m) op de parkeerplaats rond het stadion.
const GROUND_SAMPLES = [[0, -95], [-100, -70], [100, -70], [-100, 70]];

// ---------- hulpfuncties voor de ring ----------
// Afstand vanuit het hart langs de straal onder `phi` (radialen) tot de
// veelhoek (die om het hart heen ligt).
const radiusAt = (poly, phi) => {
  const dx = Math.cos(phi);
  const dy = Math.sin(phi);
  let best = Infinity;
  poly.forEach(([x0, y0], i) => {
    const [x1, y1] = poly[(i + 1) % poly.length];
    const ex = x1 - x0;
    const ey = y1 - y0;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-12) return;
    const t = (x0 * ey - y0 * ex) / den;
    const s = (x0 * dy - y0 * dx) / den;
    if (t > 0 && s >= -1e-9 && s <= 1 + 1e-9) best = Math.min(best, t);
  });
  if (!Number.isFinite(best)) throw new Error(`geen snijpunt onder ${(phi * 180) / Math.PI} graden`);
  return best;
};
// Punt op de veelhoek het dichtst bij `p` en de naar buiten wijzende normaal.
const nearestOnPoly = (poly, [px, py]) => {
  let best = null;
  poly.forEach(([x0, y0], i) => {
    const [x1, y1] = poly[(i + 1) % poly.length];
    const ex = x1 - x0;
    const ey = y1 - y0;
    const s = Math.min(1, Math.max(0, ((px - x0) * ex + (py - y0) * ey) / (ex * ex + ey * ey)));
    const q = [x0 + s * ex, y0 + s * ey];
    const d = Math.hypot(px - q[0], py - q[1]);
    if (!best || d < best.d) best = { d, q, n: [ey / Math.hypot(ex, ey), -ex / Math.hypot(ex, ey)] };
  });
  return best;
};
// Eerste snijpunt van de straal vanaf `p` in richting `d` met de veelhoek.
const rayHit = (poly, [px, py], [dx, dy]) => {
  let best = Infinity;
  poly.forEach(([x0, y0], i) => {
    const [x1, y1] = poly[(i + 1) % poly.length];
    const ex = x1 - x0;
    const ey = y1 - y0;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-12) return;
    const t = ((x0 - px) * ey - (y0 - py) * ex) / den;
    const u = ((x0 - px) * dy - (y0 - py) * dx) / den;
    if (t > 1 && u >= 0 && u <= 1) best = Math.min(best, t);
  });
  return [px + best * dx, py + best * dy];
};
const rampOf = (x, a, b) => Math.min(1, Math.max(0, (x - a) / (b - a)));
// 1 boven de hoofdtribune, 0 boven de rest, met een overgang over de hoeken.
const mainness = (deg) => {
  const d = ((deg % 360) + 360) % 360;
  return Math.min(rampOf(d, MAIN_DEG[0] - RAMP_DEG, MAIN_DEG[0]), 1 - rampOf(d, MAIN_DEG[1], MAIN_DEG[1] + RAMP_DEG));
};
const zIn = (deg) => ZIN_SIDE + (ZIN_MAIN - ZIN_SIDE) * mainness(deg);
const zOut = (deg) => ZOUT_SIDE + (ZOUT_MAIN - ZOUT_SIDE) * mainness(deg);
// Punt op straal k; `d` draait het punt een fractie van de stralenafstand
// door, zodat aangrenzende stroken een paar centimeter overlappen (rakende
// vlakken laten in de vereniging een spleet zonder dikte achter).
const at = (k, r, d = 0, n = RAYS) => {
  const phi = (2 * Math.PI * (k + d)) / n;
  return [r * Math.cos(phi), r * Math.sin(phi)];
};
const GAP = 0.012;

// ---------- gebouwen ----------
// Elke strook tussen twee stralen is de convexe romp van vier punten op het
// dak en dezelfde vier op de onderkant: een vlak stuk met rechte wanden.
const strip = (pts) => Manifold.hull(pts.flatMap(([x, y, z]) => [[x, y, z], [x, y, BASE]]));

// Dwarsprofiel van de rang per straal: [straal, hoogte] op de binnenrand en op
// de achterrand (de derde plek is er alleen voor een eventueel vlak stuk).
const mainRay = (k) => k >= MAIN_RAYS[0] && k <= MAIN_RAYS[1];
const rakeProfile = (k) => {
  const [rin, re, ze] = RING[k];
  if (mainRay(k)) {
    // Hoofdtribune: dezelfde rang, tot de achtergevel onder de dakrand.
    const rOut = radiusAt(ROOF_OUT, (2 * Math.PI * k) / RAYS);
    const top = [rOut, Z_IN + MAIN_SLOPE * (rOut - rin)];
    return [[rin, Z_IN], top, top];
  }
  return [[rin, Z_IN], [re, ze], [re, ze]];
};
const profiles = Array.from({ length: RAYS }, (_, k) => rakeProfile(k));
const pieces = [];
for (let k = 0; k < RAYS; k++) {
  const n = (k + 1) % RAYS;
  for (let s = 0; s < 2; s++) {
    const a0 = profiles[k][s];
    const a1 = profiles[k][s + 1];
    const b0 = profiles[n][s];
    const b1 = profiles[n][s + 1];
    if (a1[0] - a0[0] < 1e-6 && b1[0] - b0[0] < 1e-6) continue;
    pieces.push(strip([[...at(k, a0[0], -GAP), a0[1]], [...at(k + 1, b0[0], GAP), b0[1]], [...at(k, a1[0], -GAP), a1[1]], [...at(k + 1, b1[0], GAP), b1[1]]]));
  }
}
const rake = Manifold.union(pieces);

// Het dak: 192 dakstroken tussen de binnen- en buitenrand, elk een romp van de
// bovenkant en dezelfde punten 2,5 m lager.
const ROOF_RAYS = 192;
const roofSlab = (j) => {
  const pts = [];
  for (const [jj, d] of [[j, -GAP], [j + 1, GAP]]) {
    const phi = (2 * Math.PI * (jj + d)) / ROOF_RAYS;
    const deg = (360 * (jj + d)) / ROOF_RAYS;
    const rin = radiusAt(ROOF_IN, phi);
    const rout = radiusAt(ROOF_OUT, phi);
    pts.push([rin * Math.cos(phi), rin * Math.sin(phi), zIn(deg)], [rout * Math.cos(phi), rout * Math.sin(phi), zOut(deg)]);
  }
  return Manifold.hull(pts.flatMap(([x, y, z]) => [[x, y, z], [x, y, z - ROOF_T]]));
};
const roof = Manifold.union(Array.from({ length: ROOF_RAYS }, (_, j) => roofSlab(j)));

// Achterwand onder het dak langs de hoofdtribune: van de rang tot in de dakplaat.
const wallPieces = [];
for (let j = 0; j < ROOF_RAYS; j++) {
  const deg0 = (360 * j) / ROOF_RAYS;
  if (deg0 < MAIN_DEG[0] - 1e-6 || deg0 + 360 / ROOF_RAYS > MAIN_DEG[1] + 1e-6) continue;
  const pts = [];
  for (const [jj, d] of [[j, -GAP], [j + 1, GAP]]) {
    const phi = (2 * Math.PI * (jj + d)) / ROOF_RAYS;
    const rout = radiusAt(ROOF_OUT, phi);
    const zTop = zOut((360 * (jj + d)) / ROOF_RAYS) - ROOF_T / 2;
    for (const r of [rout - WALL_T, rout]) pts.push([r * Math.cos(phi), r * Math.sin(phi), zTop], [r * Math.cos(phi), r * Math.sin(phi), WALL_Z0]);
  }
  wallPieces.push(Manifold.hull(pts));
}
const wall = Manifold.union(wallPieces);

// De megatruss (170 m lang, 600 ton) boven de voorrand van het dak van de
// hoofdtribune als boog van 3 m breed en 3 m dik, in 34 rechte stukken van 5 m;
// de top ligt op +40 m, de voeten staan in het dak. Daaronder de twee
// voetstukken op de grond, in de punten van het dak.
const archTop = (u) => ZIN_MAIN - 0.2 + (ARCH_CROWN - ZIN_MAIN + 0.2) * (1 - (u / ARCH_SPAN) ** 2);
const archSection = (u) => [...[ARCH_V[0], ARCH_V[1]].flatMap((v) => [[u, v, archTop(u)], [u, v, archTop(u) - ARCH_DEPTH]])];
const archPieces = [];
for (let u = -ARCH_SPAN; u < ARCH_SPAN - 1e-6; u += 5) archPieces.push(Manifold.hull([...archSection(u - GAP), ...archSection(u + 5 + GAP)]));
const arch = Manifold.union(archPieces);
const frames = [-1, 1].map((sgn) =>
  box(Math.min(sgn * FRAME_U[0], sgn * FRAME_U[1]), Math.max(sgn * FRAME_U[0], sgn * FRAME_U[1]), FRAME_V[0], FRAME_V[1], BASE, ZOUT_MAIN - ROOF_T / 2),
);

// Kraanspant: een lip van het dak (3,5 m breed, tot 4,5 m buiten de dakrand), de
// mast eronder (voet 1 m en top 3 m buiten de rand), een voet van de mast tot
// de rang, zodat het stadion één stuk blijft, en de schoor van de mastkop naar
// de binnenrand van het dak.
const frameBox = (q, t, n, [n0, n1], [t0, t1], z0, z1) =>
  Manifold.hull([n0, n1].flatMap((a) => [t0, t1].flatMap((b) => [z0, z1].map((z) => [q[0] + n[0] * a + t[0] * b, q[1] + n[1] * a + t[1] * b, z]))));
const mast = ([tx, ty]) => {
  const { q, n } = nearestOnPoly(ROOF_OUT, [tx, ty]);
  const t = [-n[1], n[0]];
  const phi = Math.atan2(q[1], q[0]);
  const deg = ((phi * 180) / Math.PI + 360) % 360;
  const k = Math.round((phi * RAYS) / (2 * Math.PI) + RAYS) % RAYS;
  const radial = Math.max(0.3, n[0] * Math.cos(phi) + n[1] * Math.sin(phi));
  const gap = (Math.hypot(...q) - profiles[k][1][0]) / radial + 1;
  const zo = zOut(deg);
  const sq = (c, h) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [c[0] + (t[0] * a + n[0] * b) * (MAST_W / 2), c[1] + (t[1] * a + n[1] * b) * (MAST_W / 2), h]);
  const at1 = (d) => [q[0] + d * n[0], q[1] + d * n[1]];
  // Schoor: van de mastkop (1,2 m dik) schuin naar beneden tot op de binnenrand van het dak.
  const inner = rayHit(ROOF_IN, q, [-n[0], -n[1]]);
  const zi = zIn(((Math.atan2(inner[1], inner[0]) * 180) / Math.PI + 360) % 360);
  const bar = (c, z) => [-1, 1].flatMap((a) => [-1, 1].map((b) => [c[0] + t[0] * a * (STAY_W / 2), c[1] + t[1] * a * (STAY_W / 2), z + b * (STAY_W / 2)]));
  return Manifold.union([
    frameBox(q, t, n, [-1, 4.5], [-1.75, 1.75], zo - ROOF_T - 0.05, zo - 0.05),
    Manifold.hull([...sq(at1(1), BASE), ...sq(at1(3), MAST_TOP)]),
    frameBox(q, t, n, [-gap, 1.5], [-1.5, 1.5], BASE, profiles[k][1][1] - 0.5),
    Manifold.hull([...bar(at1(3), MAST_TOP - 0.7), ...bar(inner, zi - 0.2)]),
  ]);
};
const masts = MAST_TIPS.map(mast);

const stadium = Manifold.union([rake, roof, wall, arch, ...frames, ...masts]);
// Ondervlakken van het dak, de lippen en de boog (vanaf +19,5 m) zijn bedoeld:
// de export vult daaronder op. Ondervlakken lager dan dat blijven verboden.
const OVERHANG_OK = (z) => z >= 19.5;
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "AFAS Stadion",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0361100000106554", "0361100000206467"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (111304,05, 514113,22) in het hart van de veldopening op het maaiveld (NAP -0,26 m), +X langs het veld naar het zuidoosten (-45,12 graden) en +Y naar het noordoosten. Eén node building:stadion: de afgeronde ring van tribunes (rang van +1,5 m aan de veldkant tot +14 à +20 m achter) met daarboven het doorlopende dak van 2,5 m dik: over de drie lage tribunes van +27,5 m aan de veldkant naar +23 m aan de dakgoot, gedragen door 20 kraanspanten (masten tot +30 m met een schoor), en boven de hoofdtribune in het zuidwesten op +27 tot +29 m met de megatruss als boog tot +40,5 m en een gesloten achtergevel. De rang blijft onder het dak zichtbaar; de vier lichtmasten zijn weg. Onderkant op -0,5 m onder het maaiveld; onder het dak, de lippen, de schoren en de boog zitten bedoelde ondervlakken, daar vult de export onder 45 graden op. Vervangt de PDOK-reconstructie van de twee BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 19500,
    fieldOpeningM: [138, 94],
    tierSlope: 0.65,
    roofThicknessM: ROOF_T,
    sideRoofTopM: [ZIN_SIDE, ZOUT_SIDE],
    mainStandRoofTopM: [ZIN_MAIN, ZOUT_MAIN],
    archCrownM: ARCH_CROWN,
    craneMasts: MAST_TIPS.length,
    mastTopM: MAST_TOP,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/AFAS_Stadion",
    "https://www.zja.nl/en/stadion-AZ-Alkmaar",
    "https://www.cobouw.nl/288647/nieuw-dak-op-afas-stadion-vereist-integrale-aanpak",
    "https://betonenstaalbouw.nl/projecten/2-500-ton-staal-voor-nieuw-dak-afas-stadion-in-alkmaar/",
    "PDOK BAG panden 0361100000106554 en 0361100000206467, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: de veldopening en de rang van de drie tribunes",
    "PDOK luchtfoto (Actueel_orthoHR en de jaargangen 2020 tot 2026): plattegrond en schaduwen van het dak",
  ],
};

// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan ��n stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
  }
}

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

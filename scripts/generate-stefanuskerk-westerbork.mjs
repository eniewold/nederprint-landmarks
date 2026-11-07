import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "stefanuskerk-westerbork");
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
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
// Vlak door de gevellijn p0-p1, stijgend naar binnen (kant van 'inside') met helling t vanaf z0.
const facet = ([x0, y0], [x1, y1], z0, t, [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = -(y1 - y0) / len;
  let ny = (x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) < 0) {
    nx = -nx;
    ny = -ny;
  }
  return [t * nx, t * ny, z0 - t * (nx * x0 + ny * y0)];
};
// Doorsneden in plan voor de tussenstukken van een geleding (convexe veelhoeken).
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const diamond = ([cx, cy], r) => [[cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]];
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek]; verspringingen en spitsen.
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel: vierkante schacht met een piramide erop.
const pinnacle = (c, half, z0, shaft, point) =>
  loft([[z0, sq(c, half)], [z0 + shaft, sq(c, half)], [z0 + shaft + point, tip(c)]]);
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 59 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +u) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.9) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.4,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);


// Stefanuskerk (Westerbork), Hoofdstraat 12: eenbeukige gotische kerk (begin XV) met driezijdige sluiting onder één
// zadeldak met afgewolfde oostkant, steunberen met twee versnijdingen, spitsboogvensters; westtoren (onderbouw XIII,
// bovenbouw 1778) met een ingesnoerde achtkante naaldspits op een vierkante voet; portaaltje noord van de toren en
// een lage aanbouw (consistorie) ten noorden van het schip, met een gangetje verbonden.
const SLUG = "stefanuskerk-westerbork";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van toren naar koor (RD-richting -6,1 graden, uit de BAG-gevels:
// zuidgevel -6,3, noordgevel -5,8, westgevel toren -95,8/-96,2), +v naar het noorden. Oorsprong RD (237309; 541051) op
// de as van het schip, z = 0 op maaiveld NAP +17,3 m (AHN-maaiveld langs de gevels 17,3-17,45).
const AXIS_DEG = -6.1;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [237309, 541051];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints rond kerk en toren (PDOK-terreintegels,
// november 2026); zie het rapport van de generator.
const GROUND_ELLIPSOID = 59.0;
const GROUND_SAMPLES = [[-16.4, -0.3], [-11.5, -5.6], [0, -7.6], [10.6, -6.6], [14.2, 0], [11, 6.6], [0, 7.6], [-13, 6.2]];

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Schip en sluiting onder één zadeldak: nok +13,72 (NAP +31,0) op v = 0,05, helling 0,87 (41 graden) aan beide
// zijden (AHN-DSM dwarsprofielen u = -8 .. 9; 3D BAG-dakvlakken b = +0,87 en -0,86, nokhoogte NAP +31,05).
const RIDGE = 13.72, RIDGE_V = 0.05, PITCH = 0.87;
// Schip (BAG): zuidgevel v = -5,88, noordgevel v = 6,2, westgevel u = -9,5 (achter de toren).
const NAVE_S = -5.88, NAVE_N = 6.2, NAVE_W = -9.5;
// Driezijdige sluiting (BAG-gevellijnen): zuidoostvlak van (8,81; -5,88) naar (12,6; -2,37), oostvlak op u = 12,6
// tot v = 2,29, noordoostvlak naar (8,77; 6,2). De nok eindigt op u = 9,0 (3D BAG); daar komen de drie
// schilddakvlakken samen (oostvlak 55 graden, zoals de 3D BAG met a = -1,41).
const APSE = [[8.81, NAVE_S], [12.6, -2.37], [12.6, 2.29], [8.77, NAVE_N]];
const RIDGE_END = [9.0, RIDGE_V];
// Toren (BAG: u = -14,92 .. -9,5, v = -3,42 .. 2,61; de dakrand in het AHN ligt 0,3 m noordelijker, de spits op
// v = -0,1): muren u = -14,9 .. -9,4, v = -3,3 .. 2,7, kroonlijst +18,05, achtkante spits vanaf +19,4 met 4,5 m
// tussen de vlakken tot +27,5 (AHN 27,3 op 0,5 m van de top; verhoudingen uit de foto's).
const TU0 = -14.9, TU1 = -9.4, TV0 = -3.3, TV1 = 2.7;
const TC = [(TU0 + TU1) / 2, (TV0 + TV1) / 2];
const T_WALL = 17.7, T_EAVE = 18.05, T_SKIRT = 18.25, OCT_Z = 19.4, OCT_ACROSS = 4.5, SPIRE_TOP = 27.5;
// Portaaltje tegen de noordkant van de toren (BAG u = -11,95 .. -9,5, v = 2,61 .. 5,05): lessenaarsdak van +4,6
// tegen de toren naar +3,1 (westfoto RCE 20254025).
const PORCH = [-11.95, NAVE_W, TV1, 5.05], PORCH_HI = 4.6, PORCH_LO = 3.1;
// Aanbouw (BAG u = -14,9 .. -1,45, v = 9,8 .. 16,4): zadeldak met topgevels, nok +5,8 op v = 13,1, helling 1,0
// (AHN 5,75 en 3D BAG 5,8; goten +2,5). Gangetje (BAG u = -7,5 .. -5,27) met plat dak op +2,4 (AHN 2,4).
const ANNEX = [-14.9, -1.45, 9.8, 16.4], ANNEX_RIDGE_V = 13.1, ANNEX_RIDGE = 5.8, ANNEX_PITCH = 1.0;
const NECK = [-7.5, -5.27, NAVE_N - 0.3, ANNEX[2] + 0.3], NECK_TOP = 2.4;

const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
// Buitennormaal (eenheid) van gevellijn p0-p1, weg van punt 'inside'.
const outward = ([x0, y0], [x1, y1], [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = (y1 - y0) / len, ny = -(x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) > 0) { nx = -nx; ny = -ny; }
  return [nx, ny];
};
const deg = ([nx, ny]) => (Math.atan2(ny, nx) * 180) / Math.PI;
// Schuine onderkant van een overstek: houd alleen wat boven z = z0 + k * (afstand buiten de gevel) ligt.
const keepAbove = (solid, p0, n, z0, k) => {
  const L = Math.hypot(k * n[0], k * n[1], 1);
  return solid.trimByPlane([(-k * n[0]) / L, (-k * n[1]) / L, 1 / L], (z0 - k * (n[0] * p0[0] + n[1] * p0[1])) / L);
};
// Schuine bovenkant van een plint: houd alleen wat onder z = z0 - (afstand buiten de gevel) ligt.
const keepBelow = (solid, p0, n, z0) => {
  const L = Math.SQRT2;
  return solid.trimByPlane([-n[0] / L, -n[1] / L, -1 / L], -(z0 + n[0] * p0[0] + n[1] * p0[1]) / L);
};
// Steunbeer met twee versnijdingen (45 graden op +2,3 en +5,0) en een afdekking van 45 graden die tegen de gevel
// eindigt (witte zandstenen afdekkingen op de foto's), naar buiten langs 'ang' (graden), breedte w, diepte d.
const buttress = ([x, y], ang, w, d, eave) => {
  const top = eave - 1.8;
  const prof = [
    [-0.45, BASE], [d, BASE], [d, 2.3], [0.7 * d, 2.3 + 0.3 * d], [0.7 * d, 5.0], [0.45 * d, 5.0 + 0.25 * d],
    [0.45 * d, top], [-0.45, top + 0.45 * d + 0.45],
  ];
  // Profiel [x, z] uitgetrokken langs y van -w/2 tot w/2.
  const body = Manifold.extrude(new CrossSection([ccw(prof)]), w)
    .transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, w / 2, 0, 1]);
  return body.rotate([0, 0, ang]).translate([x, y, 0]);
};

const solids = [];
// ---------- schip en sluiting: één veelhoek onder de twee dakvlakken en de drie vlakken van de sluiting ----------
const BODY = [[NAVE_W, NAVE_S], ...APSE, [NAVE_W, NAVE_N]];
const INSIDE = [0, 0];
const eaveS = RIDGE - PITCH * (RIDGE_V - NAVE_S), eaveN = RIDGE - PITCH * (NAVE_N - RIDGE_V), eaveE = (eaveS + eaveN) / 2;
const RIDGE_PT = [RIDGE_END[0], RIDGE_END[1]];
// Dakvlak door gevellijn p0-p1 op goothoogte z0 en door het nokeinde.
const facetTo = (p0, p1, z0) => {
  const n = outward(p0, p1, INSIDE);
  const dist = -(n[0] * (RIDGE_PT[0] - p0[0]) + n[1] * (RIDGE_PT[1] - p0[1]));
  return facet(p0, p1, z0, (RIDGE - z0) / dist, INSIDE);
};
const EAVES = [
  [BODY[0], BODY[1], eaveS], [APSE[0], APSE[1], eaveS], [APSE[1], APSE[2], eaveE], [APSE[2], APSE[3], eaveN], [APSE[3], BODY[5], eaveN],
];
const ROOF = [...ridgeV(RIDGE_V, RIDGE, PITCH), facetTo(APSE[0], APSE[1], eaveS), facetTo(APSE[1], APSE[2], eaveE), facetTo(APSE[2], APSE[3], eaveN)];
solids.push(roofed(BODY, ROOF));
// Bakgoot: dak 0,3 m over de gevels, onderkant 48 graden schuin van 0,7 m onder de goot tegen de gevel.
{
  let eave = roofed(new CrossSection([ccw(BODY)]).offset(0.3, "Miter", 2).toPolygons()[0], ROOF);
  eave = eave.trimByPlane([1, 0, 0], NAVE_W);
  for (const [p0, p1, z] of EAVES) eave = keepAbove(eave, p0, outward(p0, p1, INSIDE), z - 0.7, 1.1);
  solids.push(eave);
}
// ---------- plint tot +2,3 met een waterlijst van 45 graden (0,12 m voor de gevel) ----------
{
  let plinth = prism(new CrossSection([ccw(BODY)]).offset(0.12, "Miter", 2).toPolygons()[0], BASE, 2.5);
  BODY.forEach((p0, i) => { const p1 = BODY[(i + 1) % BODY.length]; plinth = keepBelow(plinth, p0, outward(p0, p1, INSIDE), 2.42); });
  solids.push(plinth);
  const tRect = rectSec(TC, (TU1 - TU0) / 2, (TV1 - TV0) / 2);
  let tPlinth = prism(new CrossSection([ccw(tRect)]).offset(0.12, "Miter", 2).toPolygons()[0], BASE, 1.3);
  tRect.forEach((p0, i) => { const p1 = tRect[(i + 1) % 4]; tPlinth = keepBelow(tPlinth, p0, outward(p0, p1, TC), 1.22); });
  solids.push(tPlinth);
}
// ---------- steunberen (BAG-uitsprongen; breedte op 0,9 m gebracht) ----------
for (const u of [-3.5, 2.55]) solids.push(buttress([u, NAVE_S], 270, 0.9, 1.13, eaveS));
for (const u of [-3.72, 2.4]) solids.push(buttress([u, NAVE_N], 90, 0.9, 0.95, eaveN));
// Hoekberen diagonaal op de hoeken van schip en sluiting (op de bissectrice).
const corner = (pPrev, p, pNext) => {
  const a = outward(pPrev, p, INSIDE), b = outward(p, pNext, INSIDE);
  return deg([a[0] + b[0], a[1] + b[1]]);
};
solids.push(buttress([NAVE_W, NAVE_S], 225, 0.9, 1.0, eaveS));
solids.push(buttress([NAVE_W, NAVE_N], 135, 0.9, 1.0, eaveN));
solids.push(buttress(APSE[0], corner(BODY[0], APSE[0], APSE[1]), 0.9, 1.05, eaveS));
solids.push(buttress(APSE[1], corner(APSE[0], APSE[1], APSE[2]), 0.9, 0.95, eaveE));
solids.push(buttress(APSE[2], corner(APSE[1], APSE[2], APSE[3]), 0.9, 0.95, eaveE));
solids.push(buttress(APSE[3], corner(APSE[2], APSE[3], BODY[5]), 0.9, 1.05, eaveN));
// ---------- toren: romp, kroonlijst (45 graden), vierkante voet van de spits en achtkante naald ----------
const THX = (TU1 - TU0) / 2, THY = (TV1 - TV0) / 2;
solids.push(loft([
  [BASE, rectSec(TC, THX, THY)], [T_WALL, rectSec(TC, THX, THY)], [T_EAVE, rectSec(TC, THX + 0.3, THY + 0.3)],
  [T_SKIRT, rectSec(TC, THX + 0.3, THY + 0.3)], [OCT_Z, oct(TC, OCT_ACROSS)], [SPIRE_TOP, tip(TC)],
]));
// ---------- portaaltje noord van de toren ----------
{
  const t = (PORCH_HI - PORCH_LO) / (PORCH[3] - PORCH[2]);
  solids.push(roofed(rect(PORCH[0], PORCH[1] + 0.3, PORCH[2] - 0.3, PORCH[3]), [[0, -t, PORCH_HI + t * PORCH[2]]]));
}
// ---------- aanbouw met zadeldak en het gangetje ernaartoe ----------
solids.push(roofed(rect(ANNEX[0], ANNEX[1], ANNEX[2], ANNEX[3]), ridgeV(ANNEX_RIDGE_V, ANNEX_RIDGE, ANNEX_PITCH)));
solids.push(prism(rect(NECK[0], NECK[1], NECK[2], NECK[3]), BASE, NECK_TOP));

// ---------- nissen: vensters, deuren, galmgaten en wijzerplaat ----------
const cuts = [];
// Zuidgevel: drie spitsboogvensters op de waterlijst, het oostelijke breder; ingang onder het middelste.
cuts.push(niche([0, 0], 270, -NAVE_S, -6.5, 1.6, 2.9, 6.0, 0.4));
cuts.push(niche([0, 0], 270, -NAVE_S, -0.5, 1.6, 3.4, 6.0, 0.4));
cuts.push(niche([0, 0], 270, -NAVE_S, 5.7, 2.2, 2.8, 6.0, 0.4));
cuts.push(niche([0, 0], 270, -NAVE_S, -0.5, 1.3, 0.0, 2.0, 0.55));
// Noordgevel: drie vensters (s = -u); onder het westelijke de dichtgezette deur, nu achter het gangetje.
cuts.push(niche([0, 0], 90, NAVE_N, 6.5, 1.6, 3.4, 6.0, 0.4));
cuts.push(niche([0, 0], 90, NAVE_N, 0.6, 1.6, 2.9, 6.0, 0.4));
cuts.push(niche([0, 0], 90, NAVE_N, -5.6, 2.0, 2.8, 6.0, 0.4));
// Sluiting: een venster in het zuidoost- en het noordoostvlak, het oostvlak is dicht.
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
cuts.push(niche(mid(APSE[0], APSE[1]), deg(outward(APSE[0], APSE[1], INSIDE)), 0, 0, 1.8, 2.8, 6.0, 0.4));
cuts.push(niche(mid(APSE[2], APSE[3]), deg(outward(APSE[2], APSE[3], INSIDE)), 0, 0, 1.8, 2.8, 6.0, 0.4));
// Toren: westdeur, galmgaten (west, zuid en noord één, oost twee boven het schipdak), wijzerplaat op de zuidkant.
cuts.push(niche(TC, 180, THX, 0, 1.3, 0.0, 2.3, 0.55));
for (const ang of [180, 90, 270]) cuts.push(niche(TC, ang, ang === 180 ? THX : THY, 0, 0.95, 15.4, 16.6, 0.4));
for (const s of [-0.95, 0.95]) cuts.push(niche(TC, 0, THX, s, 0.95, 15.4, 16.6, 0.4));
{
  // Wijzerplaat als ruitvormige nis (plafond 51 graden).
  const dial = [[0, -0.55], [0.5, -0.1], [0.5, 0.05], [0, 0.65], [-0.5, 0.05], [-0.5, -0.1]];
  cuts.push(Manifold.extrude(new CrossSection([ccw(dial)]), 0.6)
    .transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1])
    .translate([TC[0], TC[1] - THY + 0.2, 13.6]));
}
// Portaal: deur in de westgevel.
cuts.push(niche([PORCH[0], (PORCH[2] + PORCH[3]) / 2], 180, 0, 0, 1.1, 0.0, 2.0, 0.5));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Stefanuskerk Westerbork",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["1731100000005010"],
  plate: false,
  description:
    "Stefanuskerk aan de Hoofdstraat in Westerbork: eenbeukige gotische kerk (begin XV) met driezijdige sluiting onder één zadeldak (nok +13,7 m) met afgewolfde oostkant, bakgoot, steunberen met twee versnijdingen, spitsboogvensters en ingang, westtoren (onderbouw XIII, bovenbouw 1778) met galmgaten, wijzerplaat en een achtkante naaldspits op een vierkante voet tot +27,5 m, portaaltje naast de toren en een lage aanbouw met zadeldak ten noorden van het schip. Oorsprong RD (237309; 541051) op de as van het schip op maaiveld (NAP +17,3 m), X-as langs de nok van toren naar koor onder -6,1 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "toren onderbouw XIII, bovenbouw 1778; schip en sluiting begin XV; herstellingen 1778 en 1859; aanbouw XX",
    monument: 38743,
    groundNapM: 17.3,
    naveRidgeM: RIDGE,
    naveEaveSouthM: +eaveS.toFixed(2),
    naveEaveNorthM: +eaveN.toFixed(2),
    towerEaveM: T_EAVE,
    towerTopM: SPIRE_TOP,
    annexRidgeM: ANNEX_RIDGE,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Stefanuskerk_(Westerbork)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/38743",
    "https://commons.wikimedia.org/wiki/Category:Stefanuskerk_(Westerbork) (RCE 20226554, 20254022-20254031; 20211018 Stefanuskerk 1-3; Westerbork, kerk foto1 2011-04-02; Stefanuskerk Westerbork; Stefanustsjerke, Westerbork; Kerk van Westerbork2)",
    "BAG pand 1731100000005010 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
    "PDOK AHN dsm_05m/dtm_05m en actuele luchtfoto",
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

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
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
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
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

import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hervormde-gemeente-zuidwolde");
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

// Hervormde kerk (Zuidwolde, Drenthe), Hoofdstraat 98: neoclassicistische zaalkerk uit 1823 met een dakruiter op de
// westgevel; in 1856 is het oostelijke deel vervangen door een dwarsschip met afgewolfd zadeldak (T-vorm). De dakruiter
// kreeg zijn huidige vorm in 1926 en draagt twee klokken uit 1502 (rijksmonument 526039). Aan de westkant liggen een
// glazen ontmoetingsruimte met plat dak en een zaal met schilddak (zelfde BAG-pand).
const SLUG = "hervormde-gemeente-zuidwolde";
const BASE = -1.2;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van het schip van west naar oost (RD-richting 2,2 graden, uit de
// BAG-gevels van schip en dwarsschip en de nok in de 3D BAG en het AHN), +v naar het noorden. Oorsprong RD (225500; 521156)
// in het schip (de nok ligt op v = 3,15), z = 0 op maaiveld NAP +9,6 m (rond de zaal; het terras rond de kerk ligt op
// NAP +10,6 tot +11,1 m en de straat aan de oostkant op +10,3 m).
const AXIS_DEG = 2.2;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [225500, 521156];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints rond de zaal: zuid 51,88 en 52,23, noord 51,97,
// oost 52,48 (PDOK-terreintegels, november 2026); dat is NAP +9,6 m. Rond de kerk zelf ligt het terras op 52,6 tot 53,1.
const GROUND_ELLIPSOID = 51.88;
const GROUND_SAMPLES = [[-24, -16.5], [-15, -16.5], [-20, -3.5], [-10, -14]];

// ---------- maten (meter boven z = 0, stelsel u/v; AHN-DSM, 3D BAG-dakvlakken, BAG-contour) ----------
// Schip (1823): u = -4,25 .. 6,9, v = -2,64 .. 9,06; zadeldak met nok +13,92 op v = 3,15, helling 1,06 (46,7 graden;
// AHN en 3D BAG: nok 13,95 tegen 13,9 voor het dwarsschip, gelijk gemaakt); het dak loopt door tot de nok van het dwarsschip.
const NAVE_W = -4.25, NAVE_E = 6.9, NAVE_S = -2.64, NAVE_N = 9.06;
const RIDGE = 13.92, RIDGE_V = 3.15, PITCH = 1.06;
const roofZ = (v) => RIDGE - PITCH * Math.abs(v - RIDGE_V);
// Westgevel: middenrisaliet (v = 0,95 .. 5,35) tot een vlakke kroonlijst op +11,9 waarop de dakruiter staat; daarachter
// loopt het dak met een klein schild (helling 1) op naar de nok.
const RIS_S = 0.95, RIS_N = 5.35, RIS_TOP = 11.9;
// Dwarsschip (1856): u = 6,8 .. 18,8, v = -8,54 .. 14,62; nok +13,92 op u = 12,8, helling 1,04; afgewolfde einden met
// de onderkant van het wolfseind op +11,2 en helling 1,42 (3D BAG 1,39-1,44).
const TR_W = 6.8, TR_E = 18.8, TR_S = -8.54, TR_N = 14.62;
const TR_RIDGE = 13.92, TR_RIDGE_U = 12.8, TR_PITCH = 1.04, HIP_Z = 11.2, HIP_PITCH = 1.42;
const trRoofZ = (u) => TR_RIDGE - TR_PITCH * Math.abs(u - TR_RIDGE_U);
// Dakruiter (vorm van 1926): vierkant leien lichaam 3,0 m breed, lijst op +15,7, galmgeleding tot +17,9 met drie
// galmgaten per zijde, overstekende kroonlijst tot 3,7 m breed op +18,2 (AHN 18,2), ingesnoerde voet en achtkante
// naaldspits tot +22,3 (geschat uit foto's).
const TC = [-2.3, RIDGE_V];
const BODY_TOP = 15.7, LOUVRE_TOP = 17.9, CORNICE_TOP = 18.2, SPIRE_FOOT = 18.8, SPIRE_TOP = 22.3;
// Schoorsteen op het noordelijke dakvlak bij de westgevel (AHN-piek 2,4 m boven het dakvlak, foto's).
const CHIMNEY = [-2.1, -1.1, 7.9, 8.9], CHIMNEY_TOP = 10.8;
// Glazen ontmoetingsruimte (BAG-contour), plat dak +4,6; glazen entree aan de noordkant +4,1; koepeltje op het dak.
// Waar de ruimte tegen de zaal ligt, loopt de contour 0,5 m de zaal in (anders raken de twee alleen langs een wand).
const PAVILION = [
  [-1.29, -2.64], [-2.24, -4.5], [-3.39, -5.79], [-4.56, -6.51], [-6.28, -7.13], [-7.4, -6.8], [-8.0, -4.5], [-12.9, -5.0], [-13.07, -3.9],
  [-13.73, -1.27], [-13.65, 0.79], [-12.75, 2.54], [-11.36, 3.99], [-9.53, 5.06], [-7.23, 5.26], [-4.29, 4.77],
  [-2.0, 4.0],
];
const PAV_TOP = 4.6;
const ENTRY = [[-9.53, 5.06], [-7.23, 5.26], [-7.09, 11.26], [-11.67, 11.52]];
const ENTRY_TOP = 4.1;
const DOME = [-7.9, -1.4];
// Zaal (BAG): 19,0 x 9,43 m onder 8,7 graden met de as, schilddak (helling 1,0) met goot +4,85 en nok +9,6.
const HALL_O = [-24.3, -15.16], HALL_DEG = 8.7, HALL_L = 19.02, HALL_W = 9.43, HALL_EAVE = 4.85, HALL_PITCH = 1.0;

const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
// Lisene (muurpijler): breedte w, diepte d uit de gevel met de normaal naar 'ang' (graden, 0 = +u), van BASE tot z1.
const lisene = ([x, y], ang, z1, w = 0.9, d = 0.25) =>
  Manifold.cube([d + 0.3, w, z1 - BASE]).translate([-0.3, -w / 2, BASE]).rotate([0, 0, ang]).translate([x, y, 0]);
// Gootlijst langs een gevel van p0 naar p1 met de buitennormaal n: 0,25 m uitstekend met een ondervlak van 40 graden.
const eaveLedge = (p0, p1, [nx, ny], z) =>
  Manifold.hull([p0, p1].flatMap(([x, y]) => [
    [x - 0.3 * nx, y - 0.3 * ny, z - 0.3], [x - 0.3 * nx, y - 0.3 * ny, z], [x, y, z - 0.3], [x + 0.25 * nx, y + 0.25 * ny, z],
  ]));

// ---------- kerk: schip, westgevel met risaliet, dwarsschip ----------
const church = [];
church.push(roofed(rect(NAVE_W, TR_RIDGE_U, NAVE_S, NAVE_N), [
  ...ridgeV(RIDGE_V, RIDGE, PITCH),
  [1.0, 0, RIS_TOP - NAVE_W],
]));
church.push(roofed(rect(TR_W, TR_E, TR_S, TR_N), [
  ...ridgeU(TR_RIDGE_U, TR_RIDGE, TR_PITCH),
  [0, -HIP_PITCH, HIP_Z + HIP_PITCH * TR_N],
  [0, HIP_PITCH, HIP_Z - HIP_PITCH * TR_S],
]));
// Risaliet in de westgevel, 0,3 m voor de gevel, met een kroonlijst (45 graden) onder de vlakke bovenkant.
const RC = [NAVE_W + 0.15, (RIS_S + RIS_N) / 2], RHX = 0.45, RHY = (RIS_N - RIS_S) / 2;
church.push(loft([
  [BASE, rectSec(RC, RHX, RHY)], [RIS_TOP - 0.25, rectSec(RC, RHX, RHY)],
  [RIS_TOP, rectSec(RC, RHX + 0.2, RHY + 0.2)],
]));
// Plint rondom schip en dwarsschip (0,15 m buiten de gevels tot +2,1; het terras ligt op +1,1 tot +1,6).
const churchPlan = new CrossSection([ccw(rect(NAVE_W, TR_RIDGE_U, NAVE_S, NAVE_N))]).add(new CrossSection([ccw(rect(TR_W, TR_E, TR_S, TR_N))]));
church.push(Manifold.extrude(churchPlan.offset(0.15, "Miter", 2), 2.1 - BASE).translate([0, 0, BASE]));
// Gootlijsten langs de lange gevels.
const eaveN = roofZ(NAVE_N), eaveS = roofZ(NAVE_S), trEave = trRoofZ(TR_W);
church.push(eaveLedge([NAVE_W, NAVE_N], [TR_W, NAVE_N], [0, 1], eaveN));
church.push(eaveLedge([NAVE_W, NAVE_S], [TR_W, NAVE_S], [0, -1], eaveS));
church.push(eaveLedge([TR_E, TR_S], [TR_E, TR_N], [1, 0], trEave));
church.push(eaveLedge([TR_W, NAVE_N], [TR_W, TR_N], [-1, 0], trEave));
church.push(eaveLedge([TR_W, TR_S], [TR_W, NAVE_S], [-1, 0], trEave));
// Lisenen: hoeken en tussen de vensters (foto's), tot net onder de goot.
const LT = trEave - 0.35;
for (const u of [NAVE_W + 0.45, -0.2, 3.2, TR_W - 0.45]) church.push(lisene([u, NAVE_N], 90, LT));
for (const u of [3.2, TR_W - 0.45]) church.push(lisene([u, NAVE_S], 270, LT));
for (const v of [TR_S + 0.45, -3.56, 0.84, 5.24, 9.64, TR_N - 0.45]) church.push(lisene([TR_E, v], 0, LT));
for (const v of [TR_S + 0.45, NAVE_S - 0.45, NAVE_N + 0.45, TR_N - 0.45]) church.push(lisene([TR_W, v], 180, LT));
for (const u of [TR_W + 0.45, 11.0, 14.6, TR_E - 0.45]) {
  church.push(lisene([u, TR_N], 90, LT));
  church.push(lisene([u, TR_S], 270, LT));
}
for (const v of [NAVE_S + 0.45, NAVE_N - 0.45]) church.push(lisene([NAVE_W, v], 180, LT));
// Schoorsteen.
church.push(prism(rect(CHIMNEY[0], CHIMNEY[1], CHIMNEY[2], CHIMNEY[3]), 7.5, CHIMNEY_TOP));

// ---------- dakruiter ----------
church.push(loft([
  [RIS_TOP - 0.05, rectSec(TC, 1.8, 1.8)], [RIS_TOP + 0.35, rectSec(TC, 1.5, 1.5)],
]));
church.push(loft([
  [10.5, rectSec(TC, 1.5, 1.5)], [BODY_TOP, rectSec(TC, 1.5, 1.5)],
  [BODY_TOP + 0.15, rectSec(TC, 1.65, 1.65)], [BODY_TOP + 0.3, rectSec(TC, 1.65, 1.65)],
  [BODY_TOP + 0.4, rectSec(TC, 1.55, 1.55)], [LOUVRE_TOP, rectSec(TC, 1.55, 1.55)],
  [CORNICE_TOP, rectSec(TC, 1.85, 1.85)], [SPIRE_FOOT, oct(TC, 2.5)], [SPIRE_TOP, tip(TC)],
]));

// ---------- nissen: vensters, deuren en galmgaten (alleen in de kerk) ----------
const cuts = [];
// Lange gevels: rondboogvensters als nis met spitse top, 1,4 m breed, +3,6 tot +5,6.
for (const u of [-1.9, 1.5, 4.9]) cuts.push(niche([0, 0], 90, NAVE_N, -u, 1.4, 3.6, 5.6, 0.35));
for (const u of [1.5, 4.9]) cuts.push(niche([0, 0], 270, -NAVE_S, u, 1.4, 3.6, 5.6, 0.35));
for (const v of [-5.76, -1.36, 3.04, 7.44, 11.84]) cuts.push(niche([0, 0], 0, TR_E, v, 1.4, 3.6, 5.6, 0.35));
for (const v of [-5.6, 11.85]) cuts.push(niche([0, 0], 180, -TR_W, -v, 1.4, 3.6, 5.6, 0.35));
// Kopgevels van het dwarsschip: deur met venster erboven in het midden, hoge vensters ernaast, venster in de top.
for (const [ang, a, sgn] of [[90, TR_N, -1], [270, -TR_S, 1]]) {
  cuts.push(niche([0, 0], ang, a, sgn * TR_RIDGE_U, 1.4, 1.2, 3.4, 0.4));
  cuts.push(niche([0, 0], ang, a, sgn * TR_RIDGE_U, 1.2, 4.9, 6.0, 0.35));
  for (const u of [9.1, 16.5]) cuts.push(niche([0, 0], ang, a, sgn * u, 1.4, 3.2, 5.6, 0.35));
  cuts.push(niche([0, 0], ang, a, sgn * TR_RIDGE_U, 1.1, 8.2, 9.1, 0.35));
}
// Westgevel: hoog venster in het risaliet, vensters links en rechts (het zuidelijke half achter de glazen ruimte).
cuts.push(niche([0, 0], 180, -(NAVE_W - 0.3), -RIDGE_V, 1.4, 7.9, 9.6, 0.35));
for (const v of [-0.9, 7.2]) cuts.push(niche([0, 0], 180, -NAVE_W, -v, 1.4, 3.6, 5.4, 0.35));
// Galmgaten: drie per zijde in de galmgeleding.
for (const ang of [0, 90, 180, 270]) for (const s of [-0.85, 0, 0.85]) cuts.push(niche(TC, ang, 1.55, s, 0.55, BODY_TOP + 0.75, 17.3, 0.2));
const churchSolid = Manifold.union(church).subtract(Manifold.union(cuts));

// ---------- glazen ontmoetingsruimte, entree en zaal ----------
const annex = [];
annex.push(prism(PAVILION, BASE, PAV_TOP));
annex.push(prism(ENTRY, BASE, ENTRY_TOP));
// Koepeltje (lichtkoepel) op het platte dak, achtkant.
annex.push(loft([[PAV_TOP - 0.05, oct(DOME, 1.6)], [PAV_TOP + 0.35, oct(DOME, 1.3)], [PAV_TOP + 0.65, oct(DOME, 0.5)]]));
// Zaal in zijn eigen stelsel (s langs de zaal vanaf de zuidwesthoek, t dwars naar het noorden), schilddak.
const hallLocal = roofed(rect(0, HALL_L, 0, HALL_W), [
  [0, HALL_PITCH, HALL_EAVE], [0, -HALL_PITCH, HALL_EAVE + HALL_PITCH * HALL_W],
  [HALL_PITCH, 0, HALL_EAVE], [-HALL_PITCH, 0, HALL_EAVE + HALL_PITCH * HALL_L],
]);
// Dakraam/opbouw op het westelijke schild (luchtfoto, foto vanuit het westen).
const hallDormer = prism(rect(0.9, 2.4, 1.6, 3.0), 3.0, 6.6);
const hallLedge = Manifold.union(
  [[[0, 0], [HALL_L, 0], [0, -1]], [[HALL_L, 0], [HALL_L, HALL_W], [1, 0]], [[HALL_L, HALL_W], [0, HALL_W], [0, 1]], [[0, HALL_W], [0, 0], [-1, 0]]]
    .map(([p0, p1, n]) => eaveLedge(p0, p1, n, HALL_EAVE)),
);
annex.push(Manifold.union([hallLocal, hallDormer, hallLedge]).rotate([0, 0, HALL_DEG]).translate([HALL_O[0], HALL_O[1], 0]));

let complex = Manifold.union([churchSolid, ...annex]);
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Hervormde kerk Zuidwolde",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["1690100000007702"],
  plate: false,
  description:
    "Hervormde kerk aan de Hoofdstraat in Zuidwolde (Drenthe): neoclassicistische zaalkerk uit 1823 met een dwarsschip uit 1856 (T-vorm), zadeldaken met nok +13,92 m, afgewolfde kopgevels van het dwarsschip, lisenen, gootlijsten en rondboogvensters als nissen, een middenrisaliet in de westgevel en daarop de dakruiter van 1926 met galmgeleding, overstekende kroonlijst en ingesnoerde achtkante naaldspits tot +22,3 m; aan de westkant de glazen ontmoetingsruimte en de zaal met schilddak. Oorsprong RD (225500; 521156) in het schip op maaiveld (NAP +9,6 m), X-as langs de nok van west naar oost onder 2,2 graden.",
  realWorld: {
    built: "1823 (zaalkerk), 1856 dwarsschip (jhr. H.G. van Holthe tot Echten), dakruiter in huidige vorm 1926; klokken 1502 (Willem van Wou, rijksmonument 526039)",
    monument: 526039,
    groundNapM: 9.6,
    naveRidgeM: RIDGE,
    naveEaveM: +eaveN.toFixed(2),
    transeptRidgeM: TR_RIDGE,
    transeptEaveM: +trEave.toFixed(2),
    risalitTopM: RIS_TOP,
    corniceM: CORNICE_TOP,
    towerTopM: SPIRE_TOP,
    hallRidgeM: +(HALL_EAVE + HALL_PITCH * HALL_W / 2).toFixed(2),
    pavilionRoofM: PAV_TOP,
    baseM: BASE,
  },
  sources: [
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/526039 (klokken in de dakruiter)",
    "https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0109.php (Monumenten in Nederland, Drenthe: bouwgeschiedenis)",
    "https://www.openstreetmap.org/way/277380567",
    "https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk_(Zuidwolde,_Drenthe) (RCE 20225901; Zuidwolde - Hervormde Kerk - 2014; Súdwâlde, protestantske tsjerke; IMG 3947 2018)",
    "BAG pand 1690100000007702 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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
      if (steep < 40) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
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

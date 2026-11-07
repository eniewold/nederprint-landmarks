import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "koepelkerk-berltsum");
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

// Nis met rechte bovenkant (deuren, kleine vensters): het plafond loopt naar binnen schuin af (helling 1,1 : 1),
// zodat er geen vlak plafond overhangt. Zelfde plaatsing als niche().
const rectNiche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.35) => {
  const y0 = s - w / 2, y1 = s + w / 2;
  const pts = [];
  for (const [x, top] of [[a + 0.4, z1], [a, z1], [a - d, z1 - 1.1 * d]]) {
    for (const y of [y0, y1]) pts.push([x, y, z0], [x, y, top]);
  }
  return Manifold.hull(pts).rotate([0, 0, angle]).translate([cx, cy, 0]);
};
// Rond venster als kegelvormige nis langs +u in de gevel u = a: straal r aan de gevel, (r - 1,17 d) achterin,
// zodat de bovenkant van de nis steiler dan 45 graden loopt.
const oculus = (a, v, z, r, d) => {
  const back = r - 1.17 * d, len = d + 0.4;
  const front = back + (len / d) * (r - back);
  return Manifold.cylinder(len, back, front, 48).rotate([0, 90, 0]).translate([a - d, v, z]);
};

// Koepelkerk (Berltsum, Waadhoeke), rijksmonument 28576: centraalbouw uit 1777-1779 van Willem Douwes (oud-stadsbouwmeester van
// Harlingen) op de plaats van de middeleeuwse kruiskerk, op het kerkhof op de terp. Plattegrond (BAG): een vierkant van 18,84 m
// waarvan de hoeken als cirkelboog (straal 9,93 m om het hart) zijn afgerond, met lisenen op de acht aansluitingen; daarop een
// achtkante koepel met leien en een open achtkante klokkenlantaarn met omgang, uurwerk en een klokvormig kapje met bol en
// windvaan. Ingang met omlijsting en fronton (1778) en het ovale venster op het oosten, tegen de zuidgevel een lage aanbouw met
// afgeschuinde hoeken onder een klokvormig dakje.
const SLUG = "koepelkerk-berltsum";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u naar de ingang (oost), RD-richting 4,44 graden (uit de vier rechte BAG-gevels, die
// onderling binnen 0,1 graad gelijk lopen), +v naar het noorden. Oorsprong RD (172148,08; 584070,76) in het hart van de
// centraalbouw, z = 0 op het laagste maaiveld rond de voet (noordkant, NAP +3,85 m; zuidkant NAP +4,3 m).
const AXIS_DEG = 4.44;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [172148.08, 584070.76];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
const GROUND_NAP = 3.85;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: noord 45,08, noordoost 45,13, oost 45,19, noordwest
// 45,33, zuidoost 45,39, west 45,49, zuidwest 45,54, zuid (voor de aanbouw) 45,24 / 45,26 / 45,29 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 45.08;
const GROUND_SAMPLES = [[11.5, 0], [-11.5, 0], [0, 11.5], [0, -13.5], [8.6, 8.6], [-8.6, 8.6], [8.6, -8.6], [-8.6, -8.6], [5, -13], [-5, -13]];
const z = (nap) => +(nap - GROUND_NAP).toFixed(2);

// ---------- maten (meter boven z = 0, stelsel u/v) ----------
// Romp (BAG): rechte gevels op 9,42 m van het hart (oost/west 9,38 / 9,41, noord/zuid 9,40 / 9,50), lopend tot 4,55 m uit het
// midden; daar springt de gevel 0,55 m in en volgt de hoek een boog met straal 9,93 m. Lisenen van 1,2 m (3,15 .. 4,33 m uit het
// midden) springen 0,21 m uit.
const HALF = 9.42, ARC_R = 9.93, LIS_IN = 3.15, LIS_OUT = 4.33, LIS_D = 0.21;
// Hoogtes: muur tot +11,05, gebroken witte lijst (architraaf en fries met triglyfen, 0,12 m uit) tot +12,55, kroonlijst 0,6 m
// uitkragend tot +13,15 = goot van de koepel (3D BAG LoD2.2 goot NAP +17,0; foto RCE 20033958: hoofdgestel ~2 m hoog).
const WALL_TOP = 11.05, FRIEZE_TOP = 12.55, EAVE = z(17.0), FRIEZE_OUT = 0.12, CORNICE_OUT = 0.72;
// Koepel: achtkant, per hoogte [apothema rechte zijde, NAP, factor schuine zijde]. Het AHN-DSM (dwarsprofielen loodrecht op
// de rechte zijden, mediaan over 5 m breedte) en de 3D BAG-dakvlakken geven goot NAP +17,0 en het dek NAP +23,9 op 3,8 m; daartussen
// ligt het DSM aan de steile voet tot 0,9 m onder een kwartellips door die twee punten (pixels van 0,5 m over de goot), terwijl de
// foto's een vollere koepel tonen. Het profiel is het gemiddelde van beide (DSM 20,05 / ellips 20,98 / model 20,5 op 8,0 m).
// De schuine zijden staan aan de voet 5 % verder uit (de koepel volgt daar de boog van de hoeken) en lopen naar boven toe in
// tot een regelmatige achtkant (DSM: 1,056 op +16,2, 1,035 op +17,7, 1,01 op +19,4).
const DOME = [
  [HALF, 17.0, 1.051],
  [9.3, 17.8, 1.052],
  [9.1, 18.55, 1.053],
  [8.5, 19.75, 1.055],
  [8.0, 20.5, 1.05],
  [7.0, 21.75, 1.036],
  [6.0, 22.65, 1.03],
  [5.0, 23.32, 1.012],
  [4.4, 23.65, 1.0],
  [3.8, 23.9, 1.0],
].map(([a, nap, k]) => [a, z(nap), k]);
const DECK = z(23.9);
// Lantaarn (foto 'torenspits koepelkerk' 2019, telelens, schaal uit DSM-hoogtes): omgang met balustrade apothema 3,8 m tot
// +1,35 boven het dek, achtkante opbouw apothema 3,0 m, kroonlijst tot apothema 3,6 m met bovenkant NAP +31,85 (3D BAG
// 31,83), klokvormig kapje tot NAP +34,6 (DSM 34,5 .. 34,9), bol op NAP +35,5 (DSM 35,6) en makelaar met windvaan tot
// NAP +37,2 (hoogste DSM-punt).
const BAL_A = 3.8, BAL_TOP = DECK + 1.35, LAN_A = 3.0, LAN_ENT = z(31.2), LAN_TOP = z(31.85), LAN_CORNICE = 3.6;
const CAP = [[2.65, LAN_TOP], [2.45, LAN_TOP + 0.9], [2.0, LAN_TOP + 1.8], [1.3, LAN_TOP + 2.4], [0.5, z(34.6)]];
const BALL_Z = z(35.5), SPIRE_TOP = z(37.2);
// Aanbouw zuid (BAG): v = -11,89 .. gevel, u = -3,12 .. 3,12, hoeken 0,93 m afgeschuind; muur tot +3,6, lijstje tot +4,0
// (DSM-goot NAP +7,9), klokvormig dakje tegen de gevel tot +6,65 (foto RCE 20033961: dak ~0,7 x de muurhoogte).
const ANX_V = -11.89, ANX_U = 3.12, ANX_CH = 0.93, ANX_WALL = 3.6, ANX_EAVE = 4.0, ANX_TOP = 6.65;

const solids = [];
const O0 = [0, 0];
const rot = (pts, deg) => {
  const c = Math.cos((deg * Math.PI) / 180), s = Math.sin((deg * Math.PI) / 180);
  return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]);
};
// Plattegrond: acht keer hetzelfde stuk (rechte gevel, inspringing, boog), tegen de klok in vanaf het oosten.
const arc = (from, to, r, n) => Array.from({ length: n + 1 }, (_, i) => {
  const t = ((from + ((to - from) * i) / n) * Math.PI) / 180;
  return [r * Math.cos(t), r * Math.sin(t)];
});
const STEP_U = 4.55;
const stepIn = Math.sqrt(ARC_R * ARC_R - STEP_U * STEP_U);
const arcFrom = (Math.atan2(STEP_U, stepIn) * 180) / Math.PI;
const quarter = [
  [HALF, -STEP_U], [HALF, STEP_U], [stepIn, STEP_U],
  ...arc(arcFrom, 90 - arcFrom, ARC_R, 16).slice(1, -1),
  [STEP_U, stepIn], [STEP_U, HALF],
];
const plan = [0, 90, 180, 270].flatMap((d) => rot(quarter, d));
// Convexe omhullende van de plattegrond voor romp, lijsten en plint: de boog steekt maar 0,05 m buiten de koorde, dus de
// hoekvlakken worden vrijwel vlak, zoals ze op de foto's ook ogen.
const hullPlan = new CrossSection([ccw(plan)]).hull().toPolygons()[0];
const offsetHull = (d) => new CrossSection([ccw(hullPlan)]).offset(d, "Round", 2, 32).toPolygons()[0];

// ---------- romp ----------
// De inspringing van 0,55 m naast de lisene vult de omhullende op (anders hangt het fries er vlak boven).
solids.push(prism(hullPlan, BASE, WALL_TOP + 0.05));
// Lisenen op de acht aansluitingen van rechte gevel en hoek.
for (const d of [0, 90, 180, 270]) for (const sgn of [-1, 1]) {
  const lo = sgn > 0 ? LIS_IN : -LIS_OUT, hi = sgn > 0 ? LIS_OUT : -LIS_IN;
  solids.push(prism(rot(rect(HALF - 0.3, HALF + LIS_D, lo, hi), d), BASE, WALL_TOP));
}
// Plint: 0,08 m uit tot +0,5, bovenkant 45 graden.
solids.push(Manifold.hull([
  ...offsetHull(0.08).flatMap(([x, y]) => [[x, y, BASE], [x, y, 0.5]]),
  ...hullPlan.map(([x, y]) => [x, y, 0.58]),
]));
// Hoofdgestel: fries 0,12 m uit (onderkant 45 graden) tot +12,55, kroonlijst 45 graden tot 0,72 m uit op +13,15.
solids.push(Manifold.hull([
  ...hullPlan.map(([x, y]) => [x, y, WALL_TOP - FRIEZE_OUT - 0.02]),
  ...offsetHull(FRIEZE_OUT).flatMap(([x, y]) => [[x, y, WALL_TOP], [x, y, FRIEZE_TOP]]),
]));
solids.push(Manifold.hull([
  ...offsetHull(FRIEZE_OUT).map(([x, y]) => [x, y, FRIEZE_TOP - 0.01]),
  ...offsetHull(CORNICE_OUT).map(([x, y]) => [x, y, FRIEZE_TOP + (CORNICE_OUT - FRIEZE_OUT)]),
  ...offsetHull(CORNICE_OUT).map(([x, y]) => [x, y, EAVE]),
]));

// ---------- koepel: achtkante ringen per hoogte, convexe huls ----------
const domeRing = (a, k) => {
  const d = a * k, e = d * Math.SQRT2 - a;
  return [[a, -e], [a, e], [e, a], [-e, a], [-a, e], [-a, -e], [-e, -a], [e, -a]];
};
solids.push(Manifold.hull(DOME.flatMap(([a, zz, k], i) => {
  const ring = domeRing(a, k).map(([x, y]) => [x, y, zz]);
  return i === 0 ? [...ring, ...domeRing(a, k).map(([x, y]) => [x, y, EAVE - 0.3])] : ring;
})));
// Dakkapellen op het noordelijke en westelijke vlak (foto's 2010 en RCE 20033961): 1,5 m breed, voorkant op 9,15 m tot
// +15,6, zadeldakje van 45 graden tot +16,35; de rest zit in de koepel.
for (const d of [90, 180]) {
  const half = 0.75, front = 9.15, top = 15.6;
  const cs = Manifold.hull([
    ...[[front, -half], [front, half], [6.5, -half], [6.5, half]].flatMap(([x, y]) => [[x, y, 12.8], [x, y, top]]),
    [front, 0, top + half], [6.5, 0, top + half],
  ]);
  solids.push(cs.rotate([0, 0, d]));
}

// ---------- lantaarn ----------
// Omgang: dichte balustrade (de spijlen zijn te dun voor 1:1000) met een schuine bovenrand.
solids.push(loft([[DECK - 0.6, oct(O0, 2 * BAL_A)], [BAL_TOP - 0.15, oct(O0, 2 * BAL_A)], [BAL_TOP, oct(O0, 2 * BAL_A - 0.3)]]));
// Opbouw met hoofdgestel en kroonlijst (45 graden).
solids.push(loft([
  [BAL_TOP - 0.2, oct(O0, 2 * LAN_A)], [LAN_ENT, oct(O0, 2 * LAN_A)],
  [LAN_TOP - 0.05, oct(O0, 2 * LAN_CORNICE)], [LAN_TOP, oct(O0, 2 * LAN_CORNICE)],
]));
// Klokvormig kapje.
solids.push(loft([[LAN_TOP - 0.05, oct(O0, 2 * CAP[0][0])], ...CAP.map(([a, zz]) => [zz, oct(O0, 2 * a)])]));
// Hals, bol (dubbele kegel van 45 graden) en makelaar met windvaan.
const capTop = CAP[CAP.length - 1][1];
solids.push(loft([[capTop - 0.1, oct(O0, 0.9)], [BALL_Z - 0.55, oct(O0, 0.9)], [BALL_Z, oct(O0, 1.3)], [BALL_Z + 0.45, oct(O0, 0.9)], [SPIRE_TOP, tip(O0)]]));

// ---------- aanbouw zuid ----------
const anx = (t, back = -9.0) => [
  [-(ANX_U - t), back], [-(ANX_U - t), ANX_V + t + ANX_CH], [-(ANX_U - t - ANX_CH), ANX_V + t],
  [ANX_U - t - ANX_CH, ANX_V + t], [ANX_U - t, ANX_V + t + ANX_CH], [ANX_U - t, back],
];
solids.push(prism(anx(0), BASE, ANX_WALL + 0.05));
solids.push(Manifold.hull([
  ...anx(0).map(([x, y]) => [x, y, ANX_WALL]),
  ...anx(-0.2).flatMap(([x, y]) => [[x, y, ANX_WALL + 0.3], [x, y, ANX_EAVE]]),
]));
solids.push(Manifold.hull([
  ...anx(-0.2).map(([x, y]) => [x, y, ANX_EAVE - 0.05]),
  ...anx(0.85).map(([x, y]) => [x, y, ANX_EAVE + 1.45]),
  ...anx(1.75, -9.0).map(([x, y]) => [x, y, ANX_TOP - 0.35]),
  ...anx(2.3, -9.0).map(([x, y]) => [x, y, ANX_TOP]),
]));

// ---------- ingang oost: stoep, omlijsting met fronton ----------
for (const [depth, top] of [[1.5, 0.18], [1.0, 0.36], [0.5, 0.55]]) solids.push(prism(rect(HALF - 0.2, HALF + depth, -2.6, 2.6), BASE, top));
const PORTAL = HALF + 0.3;
solids.push(prism(rect(HALF - 0.2, PORTAL, -2.1, 2.1), BASE, 5.0));
// Hoofdgestel van de omlijsting (0,15 m extra uit, onderkant 45 graden) en driehoekig fronton tot +6,7.
solids.push(Manifold.hull([
  ...rect(HALF - 0.2, PORTAL, -2.1, 2.1).map(([x, y]) => [x, y, 4.62]),
  ...rect(HALF - 0.2, PORTAL + 0.15, -2.4, 2.4).flatMap(([x, y]) => [[x, y, 5.0], [x, y, 5.6]]),
]));
solids.push(Manifold.hull([
  ...rect(HALF - 0.2, PORTAL + 0.15, -2.4, 2.4).map(([x, y]) => [x, y, 5.55]),
  [HALF - 0.2, 0, 6.7], [PORTAL + 0.15, 0, 6.7],
]));

// ---------- nissen: vensters, deur, ovaal venster, galmgaten en uurwerk ----------
const cuts = [];
// Hoge rondboogvensters (als spitse nis) in de vier hoeken en in de noord- en westgevel: 2,0 m breed, +3,2 tot +7,0 en punt.
for (const ang of [45, 135, 225, 315]) cuts.push(niche(O0, ang, ARC_R - 0.05, 0, 2.0, 3.2, 7.0, 0.35));
for (const ang of [90, 180]) cuts.push(niche(O0, ang, HALF, 0, 2.0, 3.2, 7.0, 0.35));
// Dichtgemetselde deur onder het westvenster.
cuts.push(rectNiche(O0, 180, HALF, 0, 1.6, 0.3, 2.7, 0.2));
// Deur in de omlijsting en het ovale venster erboven (3,2 x 2,2 m, midden +9,0).
cuts.push(niche(O0, 0, PORTAL, 0, 1.7, 0.55, 3.2, 0.6));
cuts.push(oculus(HALF, 0, 0, 1.1, 0.3).scale([1, 1.45, 1]).translate([0, 0, 9.0]));
// Aanbouw: twee rondboogvensters in de voorgevel.
for (const s of [-1.05, 1.05]) cuts.push(niche(O0, 270, -ANX_V, -s, 0.9, 1.0, 2.6, 0.3));
// Lantaarn: rondbogen in de schuine zijden, rechthoekige openingen met de wijzerplaat erboven in de rechte zijden.
for (const ang of [45, 135, 225, 315]) cuts.push(niche(O0, ang, LAN_A, 0, 1.6, BAL_TOP, BAL_TOP + 2.9, 0.4));
for (const ang of [0, 90, 180, 270]) {
  cuts.push(rectNiche(O0, ang, LAN_A, 0, 1.6, BAL_TOP, BAL_TOP + 2.55, 0.35));
  cuts.push(oculus(LAN_A, 0, BAL_TOP + 3.8, 0.85, 0.25).rotate([0, 0, ang]));
}

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Koepelkerk Berltsum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0083100000001644"],
  plate: false,
  description:
    "Koepelkerk in Berltsum: centraalbouw uit 1777-1779 van Willem Douwes, een vierkant van 18,8 m met als cirkelboog afgeronde hoeken, lisenen, hoge rondboogvensters, de ingang met omlijsting en fronton en het ovale venster op het oosten, hoofdgestel en kroonlijst (goot +13,15 m) onder een achtkante leien koepel met twee dakkapellen, de open klokkenlantaarn met omgang, uurwerk, kroonlijst en klokvormig kapje met bol en makelaar (top +33,35 m), en tegen de zuidgevel de lage aanbouw met afgeschuinde hoeken. Oorsprong RD (172148,08; 584070,76) in het hart op het laagste maaiveld (NAP +3,85 m), X-as naar de ingang onder 4,44 graden. Vensters, deur en lantaarnopeningen als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "1777-1779 (Willem Douwes) op de fundamenten van de middeleeuwse kruiskerk; jaartal 1778 op het fronton, 1779 op het uurwerk",
    monument: 28576,
    groundNapM: GROUND_NAP,
    wallHalfWidthM: HALF,
    cornerArcRadiusM: ARC_R,
    eaveM: EAVE,
    domeDeckM: DECK,
    lanternCorniceM: LAN_TOP,
    capTopM: capTop,
    spireTopM: SPIRE_TOP,
    annexTopM: ANX_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Koepelkerk_(Berlikum)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/28576",
    "https://www.wikidata.org/wiki/Q2526688",
    "https://commons.wikimedia.org/wiki/Category:Koepelkerk,_Berltsum (RCE 20033957, 20033958, 20033959, 20033961; 20191023 koepelkerk van Berlikum; 20191023 torenspits koepelkerk van Berlikum; 2023 Berltsum, Koepeltsjerke; Koepeltsjerke, Berltsum; Berlikum, kerk foto5 2010)",
    "BAG pand 0083100000001644 (voetafdruk) en 3D BAG LoD2.2 (goot, lantaarn)",
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

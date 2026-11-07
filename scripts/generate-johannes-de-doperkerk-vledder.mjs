import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "johannes-de-doperkerk-vledder");
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


// Johannes de Doperkerk (Vledder), Lesturgeonplein 4: eenbeukige gotische dorpskerk met schip (vanaf 1425) en iets smaller koor
// (ca. 1475) met driezijdige sluiting onder één zadeldak, steunberen, spitsboogvensters, en de romaanse zadeldaktoren (ca. 1350)
// van vier geledingen met de nok langs de kerkas en topgevels naar west en oost.
const SLUG = "johannes-de-doperkerk-vledder";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van toren naar koor (RD-richting -3,8 graden, uit de BAG-gevels die op
// 0,1 m na evenwijdig lopen en de nok in het AHN), +v naar het noorden. Oorsprong RD (210270; 541569) in het schip,
// z = 0 op maaiveld NAP +7,4 m (laagste AHN-maaiveld rond de kerk, oostzijde; west en noord 7,6-7,8).
const AXIS_DEG = -3.8;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [210270, 541569];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
const GROUND_NAP = 7.4;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 49,49, zuid 49,68/49,70/49,50, oost 49,29,
// noord 49,58/49,63/49,67 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 49.29;
const GROUND_SAMPLES = [[-16.5, 0.5], [-6, -7], [3, -7], [12, -6.6], [19.2, 0.2], [12, 7.2], [3, 7.4], [-6, 7.4]];
const nap = (h) => +(h - GROUND_NAP).toFixed(3);

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Schip en koor onder één zadeldak: nok NAP +22,55 op v = 0,5; zuidschild helling 1,36 (53,7 graden), noordschild 1,41
// (54,7 graden) (AHN-DSM dwarsprofielen u = -6 .. 13, mediaan over 3 m).
const RIDGE = nap(22.55), RIDGE_V = 0.5, PITCH_S = 1.36, PITCH_N = 1.41;
const roofZ = (v) => (v < RIDGE_V ? RIDGE - PITCH_S * (RIDGE_V - v) : RIDGE - PITCH_N * (v - RIDGE_V));
// Schip (BAG): zuidgevel v = -4,76, noordgevel v = 5,53, westgevel tegen de toren u = -8,52; koor vanaf u = 5,9 smaller
// (v = -4,40 .. 4,85), dus hogere goten onder hetzelfde dakvlak.
const NAVE_W = -8.52, NAVE_S = -4.76, NAVE_N = 5.53, JOIN = 5.9, CH_S = -4.4, CH_N = 4.85;
// Sluiting (BAG): zuidoostvlak van (14,53; -4,40) naar (16,94; -1,53), oostvlak u = 16,94, noordoostvlak van (16,94; 1,46)
// naar (15,06; 4,85). Schilddak: goot NAP +16,29, helling 1,93 (AHN langs de nok, nokeinde u = 13,7).
const AP_S = [14.53, CH_S], AP_ES = [16.94, -1.53], AP_EN = [16.94, 1.46], AP_N = [15.06, CH_N];
const APSE_EAVE = nap(16.29), APSE_PITCH = 1.93;
// Toren (BAG): u = -14,86 .. -8,52, v = -2,60 .. 3,67. Geledingen uit de foto's: rondboogfries +6,0, band +12,3 en
// waterlijst +18,3 met kleine terugsprongen; goten van het zadeldak NAP +30,8, nok NAP +35,75 langs u (AHN).
const TC = [-11.69, 0.535], THX = 3.17, THY = 3.135;
const FRIEZE = 6.0, BAND = 12.3, LEDGE = 18.3;
const T_EAVE = nap(30.8), T_RIDGE = nap(35.75);
const T_IN = 0.2;
const T_PITCH = (T_RIDGE - T_EAVE) / (THY - T_IN);
const APEX_TOP = 29.2;

const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
// Twee dakvlakken met de nok langs u op v = v0 (verschillende hellingen), opgehoogd met dz.
const saddle = (v0, z, ts, tn, dz = 0) => [[0, -tn, z + dz + tn * v0], [0, ts, z + dz - ts * v0]];
// Steunbeer: naar buiten langs 'ang' (graden, 0 = +u), breedte w, diepte d vanaf de gevel. Versnijdingen (z, k): boven z
// springt de beer 45 graden terug tot k * d; bovenaan een schuine kap van 45 graden tot 0,6 m onder de goot.
const buttress = ([x, y], ang, w, d, eave, steps) => {
  const hw = w / 2;
  let k = 1;
  const prof = [[-0.5, BASE], [d, BASE]];
  for (const [z, kk] of steps) {
    prof.push([k * d, z], [kk * d, z + (k - kk) * d]);
    k = kk;
  }
  const top = eave - 0.6 - k * d - 0.5;
  prof.push([k * d, top], [0, top + k * d], [-0.5, top + k * d + 0.5]);
  return Manifold.hull(prof.flatMap(([px, pz]) => [[px, -hw, pz], [px, hw, pz]])).rotate([0, 0, ang]).translate([x, y, 0]);
};

const solids = [];
// ---------- schip, koor en sluiting: één veelhoek onder de twee schilden en de drie vlakken van de sluiting ----------
const BODY = [
  [NAVE_W, NAVE_S], [JOIN, NAVE_S], [JOIN, CH_S], AP_S, AP_ES, AP_EN, AP_N, [JOIN, CH_N], [JOIN, NAVE_N], [NAVE_W, NAVE_N],
];
const INSIDE = [12, 0.3];
const apsePlanes = (dz = 0) => [
  facet(AP_S, AP_ES, APSE_EAVE + dz, APSE_PITCH, INSIDE),
  facet(AP_ES, AP_EN, APSE_EAVE + dz, APSE_PITCH, INSIDE),
  facet(AP_EN, AP_N, APSE_EAVE + dz, APSE_PITCH, INSIDE),
];
solids.push(roofed(BODY, [...saddle(RIDGE_V, RIDGE, PITCH_S, PITCH_N), ...apsePlanes()]));
// Topgevel van het schip naast de toren: muurkap 0,25 m boven het dakvlak.
solids.push(roofed(rect(NAVE_W, NAVE_W + 0.45, NAVE_S, NAVE_N), saddle(RIDGE_V, RIDGE, PITCH_S, PITCH_N, 0.25)));
// ---------- plint rondom (0,15 m buiten de gevels tot +0,9) ----------
const plan = new CrossSection([ccw(BODY)]).add(new CrossSection([ccw(rectSec(TC, THX, THY))]));
solids.push(Manifold.extrude(plan.offset(0.15, "Miter", 2), 0.9 - BASE).translate([0, 0, BASE]));
// ---------- steunberen (BAG-uitsprongen; breedte minstens 0,9 m) ----------
// Schip: één versnijding op vensterbankhoogte; koor en sluiting: twee (foto koor vanuit het noorden).
const eNS = roofZ(NAVE_S), eNN = roofZ(NAVE_N), eCS = roofZ(CH_S), eCN = roofZ(CH_N);
const NAVE_STEPS = [[2.9, 0.7]], CHOIR_STEPS = [[2.6, 0.8], [5.6, 0.55]];
solids.push(buttress([-3.74, NAVE_S], 270, 0.98, 0.9, eNS, NAVE_STEPS));
solids.push(buttress([0.81, NAVE_S], 270, 1.33, 0.88, eNS, NAVE_STEPS));
solids.push(buttress([5.36, NAVE_S], 270, 1.07, 0.75, eNS, NAVE_STEPS));
solids.push(buttress([10.41, CH_S], 270, 0.95, 1.2, eCS, CHOIR_STEPS));
solids.push(buttress([-3.57, NAVE_N], 90, 0.92, 0.85, eNN, NAVE_STEPS));
solids.push(buttress([0.9, NAVE_N], 90, 1.35, 0.88, eNN, NAVE_STEPS));
solids.push(buttress([5.66, NAVE_N], 90, 1.04, 0.75, eNN, NAVE_STEPS));
solids.push(buttress([10.61, CH_N], 90, 0.9, 1.5, eCN, CHOIR_STEPS));
// Hoekberen: diagonaal op de westhoeken van het schip en op de hoeken van de sluiting.
solids.push(buttress([-8.32, -4.28], -130, 0.98, 1.0, eNS, NAVE_STEPS));
solids.push(buttress([-8.25, 5.05], 120, 1.1, 1.0, eNN, NAVE_STEPS));
solids.push(buttress([14.1, -4.37], -61, 0.99, 1.0, eCS, CHOIR_STEPS));
solids.push(buttress([16.79, -1.54], -31, 0.9, 1.15, APSE_EAVE, CHOIR_STEPS));
solids.push(buttress([16.73, 1.8], 29, 0.9, 1.4, APSE_EAVE, CHOIR_STEPS));
solids.push(buttress([14.62, 4.75], 70.6, 1.05, 1.15, eCN, CHOIR_STEPS));
// ---------- toren: vier geledingen, rondboogfries, band en waterlijst met terugsprongen ----------
solids.push(loft([
  [BASE, rectSec(TC, THX, THY)], [FRIEZE - 0.5, rectSec(TC, THX, THY)],
  [FRIEZE - 0.35, rectSec(TC, THX + 0.12, THY + 0.12)], [FRIEZE, rectSec(TC, THX + 0.12, THY + 0.12)],
  [FRIEZE, rectSec(TC, THX, THY)], [BAND, rectSec(TC, THX, THY)],
  [BAND + 0.1, rectSec(TC, THX - 0.1, THY - 0.1)], [LEDGE, rectSec(TC, THX - 0.1, THY - 0.1)],
  [LEDGE + 0.1, rectSec(TC, THX - T_IN, THY - T_IN)], [T_EAVE - 0.3, rectSec(TC, THX - T_IN, THY - T_IN)],
]));
// Zadeldak met de nok langs u: de bovenste geleding tot de dakvlakken, topgevels west en oost met muurkap.
const TOP = rectSec(TC, THX - T_IN, THY - T_IN);
const tPlanes = (dz = 0) => saddle(TC[1], T_RIDGE, T_PITCH, T_PITCH, dz);
solids.push(roofed(TOP, tPlanes()));
const uW = TC[0] - (THX - T_IN), uE = TC[0] + (THX - T_IN);
for (const [u0, u1] of [[uW, uW + 0.45], [uE - 0.45, uE]]) solids.push(roofed(rect(u0, u1, TC[1] - THY + T_IN, TC[1] + THY - T_IN), tPlanes(0.25)));
// Pijlertjes op de voet van de topgevels en op de top (foto's), 0,9 m in het vierkant.
for (const u of [uW + 0.45, uE - 0.45]) {
  for (const v of [TC[1] - THY + T_IN + 0.45, TC[1] + THY - T_IN - 0.45]) solids.push(prism(sq([u, v], 0.45), T_EAVE - 1, T_EAVE + 1.0));
  solids.push(prism(sq([u, TC[1]], 0.45), T_RIDGE - 1.5, APEX_TOP));
}

// ---------- nissen: vensters, deuren en galmgaten ----------
const cuts = [];
// Zuidgevel: drie vensters in het schip en twee hogere in het koor.
for (const u of [-6.17, -1.55, 3.16]) cuts.push(niche([0, 0], 270, -NAVE_S, u, 1.8, 2.9, 5.4, 0.4));
cuts.push(niche([0, 0], 270, -CH_S, 7.92, 1.8, 3.0, 6.0, 0.4));
cuts.push(niche([0, 0], 270, -CH_S, 12.2, 1.5, 3.0, 6.2, 0.4));
// Noordgevel: hoge smalle spitsboognissen in het schip, vensters in het koor (s = -u aan de noordkant).
for (const u of [-6.0, -1.44, 3.36]) cuts.push(niche([0, 0], 90, NAVE_N, -u, 1.2, 2.8, 5.9, 0.4));
cuts.push(niche([0, 0], 90, CH_N, -8.21, 1.8, 3.0, 6.3, 0.4));
cuts.push(niche([0, 0], 90, CH_N, -12.55, 1.6, 3.0, 6.4, 0.4));
// Sluiting: dichtgezette spitsbogen in het zuidoost- en noordoostvlak, venster in het oostvlak.
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
cuts.push(niche(mid(AP_S, AP_ES), -40, 0, 0, 1.9, 2.6, 6.0, 0.35));
cuts.push(niche(mid(AP_ES, AP_EN), 0, 0, 0, 1.4, 3.0, 6.4, 0.4));
cuts.push(niche(mid(AP_EN, AP_N), 29, 0, 0, 1.9, 2.6, 6.0, 0.35));
// Toren: westdeur; derde geleding twee galmgaten per zijde; vierde geleding één galmgat in een spitsboognis.
cuts.push(niche(TC, 180, THX, 0, 1.2, 0.0, 2.3, 0.5));
const face = (ang) => (ang % 180 === 0 ? THX : THY);
for (const ang of [0, 90, 180, 270]) {
  for (const s of [-0.95, 0.95]) cuts.push(niche(TC, ang, face(ang) - 0.1, s, 0.9, 14.4, 16.0, 0.45));
  cuts.push(niche(TC, ang, face(ang) - T_IN, 0, 1.8, 19.0, 21.3, 0.25));
  cuts.push(niche(TC, ang, face(ang) - T_IN - 0.25, 0, 0.9, 19.4, 21.1, 0.4));
}

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Johannes de Doperkerk Vledder",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["1701100000208934", "1701100000208933"],
  plate: false,
  description:
    "Johannes de Doperkerk aan het Lesturgeonplein in Vledder: eenbeukige gotische dorpskerk met schip (1425) en iets smaller koor (ca. 1475) met driezijdige sluiting onder één zadeldak (nok NAP +22,55 m), steunberen met versnijdingen, spitsboogvensters en dichtgezette bogen, en de romaanse zadeldaktoren (ca. 1350) van vier geledingen met rondboogfries, galmgaten, topgevels naar west en oost en pijlertjes tot +29,2 m. Oorsprong RD (210270; 541569) in het schip op maaiveld (NAP +7,4 m), X-as langs de nok van toren naar koor onder -3,8 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "toren ca. 1350, schip vanaf 1425, koor ca. 1475; dak vernieuwd na de brand van 1621, herstel begin XVIII en 1820",
    monument: [37474, 37475],
    groundNapM: GROUND_NAP,
    naveRidgeM: RIDGE,
    naveEaveSouthM: +eNS.toFixed(2),
    choirEaveSouthM: +eCS.toFixed(2),
    apseEaveM: APSE_EAVE,
    towerEaveM: T_EAVE,
    towerRidgeM: T_RIDGE,
    towerTopM: APEX_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Johannes_de_Doperkerk_(Vledder)",
    "https://reliwiki.nl/index.php/Vledder,_Lesturgeonplein_4_-_Johannes_de_Doperkerk",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/37474 (kerk)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/37475 (toren)",
    "https://commons.wikimedia.org/wiki/Category:Johannes_de_Doperkerk,_Vledder (RCE 20242922, 20242926, 20242928, 20242929, 20322630; Johannes de Doperkerk Vledder.jpg; Vledder - Joh de Doper - 2014; VLEDDER JOHANNES DE DOPERKERK)",
    "BAG panden 1701100000208934 (kerk) en 1701100000208933 (toren)",
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

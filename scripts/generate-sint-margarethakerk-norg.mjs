import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-margarethakerk-norg");
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


// Sint-Margarethakerk (Norg), Kerkbrink: romaanse en romanogotische zaalkerk (XIII) met een smaller koor en een
// vijfzijdige (halve achtkant) sluiting onder één doorlopend zadeldak, en een romaanse westtoren met zadeldak tussen
// twee topgevels (ook de oudste bouwfase, ca. 1260).
const SLUG = "sint-margarethakerk-norg";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van toren naar koor (RD-richting 2 graden, uit de BAG-gevels onder
// 1,3-2,3 graden en de nok in AHN en 3D BAG), +v naar het noorden. Oorsprong RD (227008; 564920,5) midden in het schip,
// z = 0 op maaiveld NAP +10,15 m (laagste AHN-maaiveld langs de gevels, zuid- en westzijde).
const AXIS_DEG = 2;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [227008, 564920.5];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: zuid 51,36, west 51,39, de rest 51,52-51,72
// (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 51.36;
const GROUND_SAMPLES = [[-17.5, 0.3], [-13, -4], [-5, -7.5], [10, -6], [17.5, -4.5], [20, 0], [17.5, 4.5], [10, 6], [-8, 7.8], [-13, 4.6]];

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Schip, koor en sluiting onder één zadeldak: nok +13,9 (NAP +24,05) op v = 0,1, helling 1,08 (47 graden) aan beide
// zijden (AHN-DSM dwarsprofielen u = -10 .. 14; 3D BAG-dakvlakken b = +1,11 en -1,07).
const RIDGE = 13.9, RIDGE_V = 0.1, PITCH = 1.08;
const roofZ = (v) => RIDGE - PITCH * Math.abs(v - RIDGE_V);
// Schip (BAG): u = -10,5 .. 6,68, zuidgevel v = -6,0, noordgevel v = 6,27.
const NAVE_W = -10.5, NAVE_E = 6.68, NAVE_S = -6.0, NAVE_N = 6.27;
// Koor (BAG): smaller (v = -4,4 .. 4,46) onder hetzelfde dakvlak, dus hogere goten; sluiting als halve regelmatige
// achtkant (BAG-hoekpunten u + |v| = 20,0-20,2) met de oostwand op u = 18,4, drie dakschilden tot de nok op u = 14.
const CH_S = -4.4, CH_N = 4.46, CC = (CH_S + CH_N) / 2, CH_HALF = (CH_N - CH_S) / 2;
const APSE_E = 18.4, APSE_C = APSE_E - CH_HALF, APSE_SIDE = CH_HALF * Math.tan(Math.PI / 8);
const CH_APSE_U = APSE_C + APSE_SIDE;
const APSE_EAVE = roofZ(CH_N);
// Toren (BAG): u = -15,98 .. -10,5, v = -2,6 .. 3,05; zadeldak met de nok langs u op +23,75 (AHN 23,5-23,8, 3D BAG
// NAP +34,1), helling 1,95 (63 graden), goten +18,25; topgevels west en oost 0,3 m boven het dak; onderste geleding tot
// +5,4 springt 0,12 m voor (westfoto).
const TW = -15.98, TE = -10.5, TS = -2.6, TN = 3.05, TCV = (TS + TN) / 2, THY = (TN - TS) / 2, TCU = (TW + TE) / 2;
const T_RIDGE = 23.75, T_PITCH = 1.95, T_EAVE = T_RIDGE - T_PITCH * THY, PLINTH_TOP = 5.3, GABLE_T = 0.45;
// Kleine aanbouw tegen de noordgevel (BAG): u = -4,62 .. -2,91, v = 6,27 .. 7,73, plat dak +2,55 (AHN 2,5-2,6).
const ANNEX = [-4.62, -2.91, NAVE_N, 7.73], ANNEX_TOP = 2.55;

const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
// Lisene of steunbeer op een gevel: naar buiten langs 'ang' (graden, 0 = +u), breedte w, diepte d0 tot zStep, daarna
// (via 45 graden) d1 tot 'top'; de bovenkant loopt onder 45 graden de muur in.
const pier = ([x, y], ang, w, d0, zStep, d1, top) => {
  const hw = w / 2;
  const prof = [[-0.6, BASE], [d0, BASE], [d0, zStep], [d1, zStep + (d0 - d1)], [d1, top], [-0.6, top + d1 + 0.6]];
  return Manifold.hull(prof.flatMap(([px, pz]) => [[px, -hw, pz], [px, hw, pz]])).rotate([0, 0, ang]).translate([x, y, 0]);
};
// Goot met een kraag van 47 graden langs de gevellijn p0-p1 (de buitenkant aan de kant van 'out').
const gutter = ([x0, y0], [x1, y1], eave, [ox, oy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = -(y1 - y0) / len, ny = (x1 - x0) / len;
  if (nx * (ox - x0) + ny * (oy - y0) < 0) { nx = -nx; ny = -ny; }
  const prof = [[-0.5, eave - 0.45], [0, eave - 0.45], [0.28, eave - 0.15], [0.28, eave + 0.1], [-0.5, eave + 0.1]];
  return Manifold.hull([[x0, y0], [x1, y1]].flatMap(([x, y]) => prof.map(([d, z]) => [x + nx * d, y + ny * d, z])));
};

const solids = [];
// ---------- schip, koor en sluiting: één veelhoek onder de twee dakvlakken en de drie schilden ----------
const AP = [[CH_APSE_U, CH_S], [APSE_E, CC - APSE_SIDE], [APSE_E, CC + APSE_SIDE], [CH_APSE_U, CH_N]];
const BODY = [
  [NAVE_W, NAVE_S], [NAVE_E, NAVE_S], [NAVE_E, CH_S], ...AP, [NAVE_E, CH_N], [NAVE_E, NAVE_N], [NAVE_W, NAVE_N],
];
const INSIDE = [14, CC];
solids.push(roofed(BODY, [
  ...ridgeV(RIDGE_V, RIDGE, PITCH),
  facet(AP[0], AP[1], APSE_EAVE, PITCH, INSIDE),
  facet(AP[1], AP[2], APSE_EAVE, PITCH, INSIDE),
  facet(AP[2], AP[3], APSE_EAVE, PITCH, INSIDE),
]));
// Goten met kraag langs schip, koor en sluiting.
const eaveS = roofZ(NAVE_S), eaveN = roofZ(NAVE_N), eaveCS = roofZ(CH_S), eaveCN = roofZ(CH_N);
solids.push(gutter([NAVE_W, NAVE_S], [NAVE_E, NAVE_S], eaveS, [0, -20]));
solids.push(gutter([NAVE_W, NAVE_N], [NAVE_E, NAVE_N], eaveN, [0, 20]));
solids.push(gutter([NAVE_E, CH_S], AP[0], eaveCS, [10, -20]));
solids.push(gutter([NAVE_E, CH_N], AP[3], eaveCN, [10, 20]));
for (let i = 0; i < 3; i++) solids.push(gutter(AP[i], AP[i + 1], APSE_EAVE, [40, CC + (i - 1) * 30]));
// ---------- kleine aanbouw aan de noordkant ----------
const annexPoly = rect(ANNEX[0], ANNEX[1], ANNEX[2] - 0.5, ANNEX[3]);
solids.push(prism(annexPoly, BASE, ANNEX_TOP));
// ---------- plint rondom (0,15 m buiten de gevels tot +0,5) ----------
const plan = new CrossSection([ccw(BODY)])
  .add(new CrossSection([ccw(rect(TW, TE, TS, TN))]))
  .add(new CrossSection([ccw(annexPoly)]));
solids.push(Manifold.extrude(plan.offset(0.15, "Miter", 2), 0.5 - BASE).translate([0, 0, BASE]));
// ---------- lisenen en steunberen (foto's; romaans westdeel van het schip met smalle lisenen) ----------
// Zuid- en noordgevel van het schip: hoeklisene, drie lisenen van 0,5 m, en een zware beer die het romaanse deel
// afsluit (zuid op u = -4,45, noord op u = -1,6); in het oostdeel een venster en een deur.
const lisTop = (side) => (side < 0 ? eaveS : eaveN) - 0.5;
for (const [side, vw, ang] of [[-1, NAVE_S, 270], [1, NAVE_N, 90]]) {
  solids.push(pier([NAVE_W + 0.3, vw], ang, 0.6, 0.35, 2.2, 0.22, lisTop(side)));
  for (const u of [-8.6, -7.3, -6.0]) solids.push(pier([u, vw], ang, 0.5, 0.35, 2.2, 0.22, lisTop(side)));
}
solids.push(pier([-4.45, NAVE_S], 270, 1.1, 0.75, 3.0, 0.4, eaveS - 0.9));
solids.push(pier([-1.6, NAVE_N], 90, 1.2, 1.0, 2.6, 0.5, eaveN - 0.9));
// Hoeken van het schip naast de toren (westgevel) en aan de oostkant (tegen het koor).
solids.push(pier([NAVE_W, -4.3], 180, 0.9, 0.3, 2.2, 0.2, eaveS + 1.2));
solids.push(pier([NAVE_W, 4.6], 180, 0.9, 0.3, 2.2, 0.2, eaveN + 1.2));
// Sluiting: platte steunberen op de vier hoeken (oostfoto), langs de bissectrice.
for (const [p, ang] of [[AP[0], -67.5], [AP[1], -22.5], [AP[2], 22.5], [AP[3], 67.5]]) {
  solids.push(pier(p, ang, 1.1, 0.45, 2.8, 0.3, APSE_EAVE - 0.9));
}
// ---------- toren: voet met versnijding, schacht onder het zadeldak, topgevels, schouderstukken en goten ----------
const towerRect = rect(TW, TE, TS, TN);
solids.push(loft([
  [BASE, rect(TW - 0.12, TE, TS - 0.12, TN + 0.12)], [PLINTH_TOP, rect(TW - 0.12, TE, TS - 0.12, TN + 0.12)],
  [PLINTH_TOP + 0.12, towerRect], [PLINTH_TOP + 0.2, towerRect],
]));
solids.push(roofed(towerRect, ridgeV(TCV, T_RIDGE, T_PITCH)));
for (const [u0, u1] of [[TW, TW + GABLE_T], [TE - GABLE_T, TE]]) {
  solids.push(roofed(rect(u0, u1, TS, TN), ridgeV(TCV, T_RIDGE + 0.3, T_PITCH)));
  // Schouderstukken: de voet van de topgevel steekt 0,3 m buiten de zijgevels (westfoto).
  for (const [vw, s] of [[TS, -1], [TN, 1]]) {
    const prof = [[0, T_EAVE - 0.6], [0.3, T_EAVE - 0.25], [0.3, T_EAVE + 0.35], [-0.6, T_EAVE + 0.35], [-0.6, T_EAVE - 0.6]];
    solids.push(Manifold.hull([u0, u1].flatMap((u) => prof.map(([d, z]) => [u, vw + s * d, z]))));
  }
}
solids.push(gutter([TW + GABLE_T, TS], [TE - GABLE_T, TS], T_EAVE, [TCU, -20]));
solids.push(gutter([TW + GABLE_T, TN], [TE - GABLE_T, TN], T_EAVE, [TCU, 20]));

// ---------- nissen: vensters, deuren, galmgaten ----------
const cuts = [];
// Rondboogvensters als spitse nis (top 51 graden voor print) in een ondiepe omlijsting.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.45) =>
  profileX([[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.25 * (w / 2)], [s - w / 2, z1]], a - d, a + 0.4)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
const framed = (c, angle, a, s, w, z0, z1) => {
  cuts.push(niche(c, angle, a, s, w + 0.7, z0 - 0.3, z1, 0.18));
  cuts.push(niche(c, angle, a, s, w, z0, z1, 0.45));
};
// Schip, romaans deel: smalle hoge nissen tussen de lisenen (zuid en noord), met een klein venster erin.
for (const u of [-9.3, -7.95, -6.65, -5.35]) {
  cuts.push(niche([0, 0], 270, -NAVE_S, u, 0.55, 1.4, 4.6, 0.3));
  cuts.push(niche([0, 0], 90, NAVE_N, -u, 0.55, 1.4, 4.6, 0.3));
}
// Schip, oostdeel: zuid deur en venster, noord venster en deur.
cuts.push(niche([0, 0], 270, -NAVE_S, -3.1, 1.1, 0.0, 2.2, 0.5));
framed([0, 0], 270, -NAVE_S, 1.2, 1.2, 3.0, 5.4);
framed([0, 0], 90, NAVE_N, -2.2, 1.2, 3.0, 5.4);
cuts.push(niche([0, 0], 90, NAVE_N, -5.3, 0.9, 0.0, 2.0, 0.5));
// Westgevel van het schip naast de toren: een klein venster aan elke kant.
cuts.push(niche([0, 0], 180, -NAVE_W, 4.4, 0.8, 7.0, 7.9, 0.4));
cuts.push(niche([0, 0], 180, -NAVE_W, -4.5, 0.8, 7.0, 7.9, 0.4));
// Koor: één hoog venster in elke zijgevel; sluiting: een venster in elk van de drie vlakken.
framed([0, 0], 270, -CH_S, 11.0, 1.2, 3.2, 6.9);
framed([0, 0], 90, CH_N, -11.0, 1.2, 3.2, 6.9);
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
framed(mid(AP[0], AP[1]), -45, 0, 0, 1.0, 3.4, 7.0);
framed(mid(AP[1], AP[2]), 0, 0, 0, 1.0, 3.4, 7.0);
framed(mid(AP[2], AP[3]), 45, 0, 0, 1.0, 3.4, 7.0);
// Aanbouw: deur in de oostkant.
cuts.push(niche([ANNEX[1], (NAVE_N + ANNEX[3]) / 2], 0, 0, 0, 0.9, 0.0, 1.85, 0.4));
// Toren: westdeur met boogomlijsting, witte tweelingvensters (west, noord, zuid), galmgaten op alle vier zijden en een
// spleet in beide topgevels.
const TC = [TCU, TCV], THX = (TE - TW) / 2;
cuts.push(niche(TC, 180, THX + 0.12, 0, 1.9, 0.0, 2.9, 0.15));
cuts.push(niche(TC, 180, THX + 0.12, 0, 1.3, 0.0, 2.6, 0.5));
for (const [ang, a] of [[180, THX], [90, THY], [270, THY]]) cuts.push(niche(TC, ang, a, 0, 1.3, 10.6, 13.3, 0.35));
for (const [ang, a] of [[180, THX], [0, THX], [90, THY], [270, THY]]) cuts.push(niche(TC, ang, a, 0, 1.1, 15.0, 16.9, 0.45));
for (const ang of [180, 0]) cuts.push(niche(TC, ang, THX, 0, 0.6, 20.0, 21.2, 0.3));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Sint-Margarethakerk Norg",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["1699100000028356"],
  plate: false,
  description:
    "Sint-Margarethakerk aan de Kerkbrink in Norg: romaanse en romanogotische zaalkerk (XIII) met lisenen en zware steunberen aan het westdeel van het schip, een smaller koor met vijfzijdige sluiting en platte steunberen onder één doorlopend zadeldak (nok +13,9 m), rondboogvensters in omlijstingen, een kleine noordelijke aanbouw, en de romaanse westtoren met zadeldak tussen twee topgevels (nok +23,75 m), witte tweelingvensters en galmgaten. Oorsprong RD (227008; 564920,5) midden in het schip op maaiveld (NAP +10,15 m), X-as langs de nok van toren naar koor onder 2 graden. Vensters en deuren als blinde nissen met een spitse top voor print op 1:1000.",
  realWorld: {
    built: "toren en schip midden XIII (ca. 1260), schip later verhoogd, koor romanogotisch met meloengewelf; restauratie 1969-1971",
    monument: 30783,
    groundNapM: 10.15,
    naveRidgeM: RIDGE,
    naveEaveSouthM: +eaveS.toFixed(2),
    choirEaveM: +APSE_EAVE.toFixed(2),
    towerEaveM: +T_EAVE.toFixed(2),
    towerRidgeM: T_RIDGE,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Margaretakerk_(Norg)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/30783",
    "https://commons.wikimedia.org/wiki/Category:Sint-Margaretakerk_(Norg) (20171016 Sint-Margaretakerk Norg1/2, 20201125 Sint-Margaretakerk1/2 Norg, RCE 20169934, 20169946, 20169951, 20321855, Margarethakerk Norg2, Norg Kerk, NorgChurch)",
    "https://www.openstreetmap.org/way/272777554",
    "BAG pand 1699100000028356 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

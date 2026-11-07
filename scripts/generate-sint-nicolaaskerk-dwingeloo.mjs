import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-nicolaaskerk-dwingeloo");
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


// Sint-Nicolaaskerk (Dwingeloo), Brink 29: eenbeukige dorpskerk (XV) met smaller koor en driezijdige sluiting,
// noordelijke aanbouw, westtoren van drie geledingen met de uivormige spits ('siepel') uit 1631.
const SLUG = "sint-nicolaaskerk-dwingeloo";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van toren naar koor (RD-richting 11 graden, uit de BAG-gevels
// onder 10,9-11,2 graden en de nok in de 3D BAG), +v naar het noorden. Oorsprong RD (220922; 539080) op de as van
// het schip, z = 0 op maaiveld NAP +9,8 m (laagste AHN-maaiveld langs de gevels, oost- en westzijde).
const AXIS_DEG = 11;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [220922, 539080];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west van de toren 52,11, zuid 52,00 en 51,94,
// oost 51,73, noord 52,04 en 52,18 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 51.73;
const GROUND_SAMPLES = [[-18.6, 0.4], [-6, -7.2], [9, -6.3], [18.8, 0.5], [9, 7.2], [-6, 8.4]];

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Schip en koor onder één zadeldak: nok +15,75 op v = 0,85, helling 1,40 (54,5 graden) aan beide zijden
// (AHN-DSM dwarsprofielen u = -10 .. 12; 3D BAG-dakvlakken b = +1,43 en -1,41).
const RIDGE = 15.75, RIDGE_V = 0.85, PITCH = 1.4;
const roofZ = (v) => RIDGE - PITCH * Math.abs(v - RIDGE_V);
// Schip (BAG): zuidgevel v = -5,13 van u = -13,5 tot 5,6, noordgevel v = 6,3 van u = -11,52 tot 6,0.
const NAVE_S = -5.13, NAVE_N = 6.3, NAVE_W_S = -13.5, NAVE_W_N = -11.52, NAVE_E_S = 5.6, NAVE_E_N = 6.0;
// Koor (BAG): smaller (v = -4,07 .. 5,0) onder hetzelfde dakvlak, dus hogere goten; driezijdige sluiting onder
// 45 graden met de oostwand op u = 16,15 (v = -1,5 .. 2,5).
const CH_S = -4.07, CH_N = 5.0, CH_APSE_U = 13.6, CH_E = 16.15, CH_E_S = -1.5, CH_E_N = 2.5;
const APSE_EAVE = 9.3;
// Noordelijke aanbouw (BAG, 3D BAG): zadeldak dwars op het schip, nok +11,3 op u = 2,07, noordkant afgewolfd.
const ANNEX = [-0.86, 5.0, 6.0, 9.65], ANNEX_RIDGE = 11.3, ANNEX_PITCH = 1.37;
const ANNEX_EAVE = ANNEX_RIDGE - ANNEX_PITCH * (ANNEX[1] - ANNEX[0]) / 2;
// Toren (BAG): u = -16,64 .. -11,52, v = -2,53 .. 3,37, drie geledingen (banden +10,0 en +16,4 uit de westfoto),
// plat dak met loodrand +22,15 (AHN 22,0-22,3); geledingen springen 0,1 m terug.
const TC = [-14.08, 0.42], THX = 2.56, THY = 2.95;
const BAND1 = 10.0, BAND2 = 16.4, T_TOP = 22.15;
// Spits uit 1631 (AHN-top van de ui +33,0; vormen uit de foto's): achtkante ingezwenkte voet tot de hals, ui en
// spil (verbreed tot 0,9 m voor print; de bol en windvaan erboven zijn weggelaten).
const NECK = 26.4, BULB_TOP = 33.0, SPIRE_TOP = 34.6;

const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
// Steunbeer met een leien kapje: naar buiten langs 'ang' (graden, 0 = +u), breedte w, diepte d vanaf de gevel.
// De beer heeft een waterlijst van 45 graden op +2,4 en loopt tot 0,9 m onder de goot; het kapje (zadeldakje met
// de nok haaks op de gevel) steekt boven de goot uit en verdwijnt in het dakvlak.
const buttress = ([x, y], ang, w, d, eave) => {
  const top = eave - 0.9, hw = w / 2;
  const prof = [[-0.5, BASE], [d, BASE], [d, 2.4], [0.7 * d, 2.4 + 0.3 * d], [0.7 * d, top], [-0.5, top]];
  const body = Manifold.hull(prof.flatMap(([px, pz]) => [[px, -hw, pz], [px, hw, pz]]));
  const gable = [[-hw, top], [hw, top], [hw, eave + 0.15], [0, eave + 0.15 + hw], [-hw, eave + 0.15]];
  const cap = Manifold.hull(gable.flatMap(([py, pz]) => [[-1.6, py, pz], [0.7 * d, py, pz]]));
  return Manifold.union(body, cap).rotate([0, 0, ang]).translate([x, y, 0]);
};

const solids = [];
// ---------- schip en koor: één veelhoek onder de twee dakvlakken en de drie vlakken van de sluiting ----------
const BODY = [
  [NAVE_W_S, NAVE_S], [NAVE_E_S, NAVE_S], [NAVE_E_S, CH_S], [CH_APSE_U, CH_S], [CH_E, CH_E_S], [CH_E, CH_E_N],
  [CH_APSE_U, CH_N], [NAVE_E_N, CH_N], [NAVE_E_N, NAVE_N], [NAVE_W_N, NAVE_N], [NAVE_W_N, 3.37], [NAVE_W_S, 3.37],
];
const INSIDE = [10, 0.5];
solids.push(roofed(BODY, [
  ...ridgeV(RIDGE_V, RIDGE, PITCH),
  facet([CH_APSE_U, CH_S], [CH_E, CH_E_S], APSE_EAVE, PITCH, INSIDE),
  facet([CH_E, CH_E_S], [CH_E, CH_E_N], APSE_EAVE, PITCH, INSIDE),
  facet([CH_E, CH_E_N], [CH_APSE_U, CH_N], APSE_EAVE, PITCH, INSIDE),
]));
// ---------- noordelijke aanbouw (kapel/consistorie) met afgewolfd noordeinde ----------
// De kap loopt door tot in het dakvlak van het schip (nok en dakvlak snijden elkaar op v = 4,0).
const annexPoly = rect(ANNEX[0], ANNEX[1], 3.5, ANNEX[3]);
solids.push(roofed(annexPoly, [
  ...ridgeU((ANNEX[0] + ANNEX[1]) / 2, ANNEX_RIDGE, ANNEX_PITCH),
  facet([ANNEX[1], ANNEX[3]], [ANNEX[0], ANNEX[3]], ANNEX_EAVE, ANNEX_PITCH, [2, 7]),
]));
// Dakkapel met zadeldakje op de noordkant van het koordak (foto's vanuit het noordoosten en zuidoosten).
solids.push(roofed(rect(11.4, 12.6, 2.4, 4.2), ridgeU(12.0, 12.3, PITCH)));
// ---------- plint rondom (0,2 m buiten de gevels tot +0,7) ----------
const plan = new CrossSection([ccw(BODY)])
  .add(new CrossSection([ccw(annexPoly)]))
  .add(new CrossSection([ccw(rectSec(TC, THX, THY))]));
solids.push(Manifold.extrude(plan.offset(0.2, "Miter", 2), 0.7 - BASE).translate([0, 0, BASE]));
// ---------- steunberen (BAG-uitsprongen; breedte op 0,9 m gebracht) ----------
const eaveS = roofZ(NAVE_S), eaveN = roofZ(NAVE_N), eaveCS = roofZ(CH_S), eaveCN = roofZ(CH_N);
for (const u of [-5.5, -0.18, 4.87]) solids.push(buttress([u, NAVE_S], 270, 0.9, 0.85, eaveS));
solids.push(buttress([10.13, CH_S], 270, 0.95, 1.4, eaveCS));
solids.push(buttress([-5.62, NAVE_N], 90, 0.9, 0.88, eaveN));
solids.push(buttress([9.95, CH_N], 90, 0.9, 1.2, eaveCN));
// Hoekberen van schip en sluiting, diagonaal op de hoeken.
solids.push(buttress([NAVE_W_S, NAVE_S], 225, 0.9, 0.85, eaveS));
solids.push(buttress([NAVE_W_N, NAVE_N], 135, 0.9, 0.85, eaveN));
solids.push(buttress([CH_APSE_U, CH_S], -67.5, 0.9, 1.4, eaveCS));
solids.push(buttress([CH_E, CH_E_S], -22.5, 0.9, 1.35, APSE_EAVE));
solids.push(buttress([CH_E, CH_E_N], 22.5, 0.9, 1.35, APSE_EAVE));
solids.push(buttress([CH_APSE_U, CH_N], 67.5, 0.9, 1.3, eaveCN));
// Hoekberen van de aanbouw.
solids.push(buttress([ANNEX[0], ANNEX[3]], 135, 0.9, 0.8, ANNEX_EAVE));
solids.push(buttress([ANNEX[1], ANNEX[3]], 45, 0.9, 0.8, ANNEX_EAVE));
// ---------- toren: drie geledingen met terugsprongen, kroonlijst onder de loodrand ----------
solids.push(loft([
  [BASE, rectSec(TC, THX, THY)], [BAND1, rectSec(TC, THX, THY)],
  [BAND1 + 0.1, rectSec(TC, THX - 0.1, THY - 0.1)], [BAND2, rectSec(TC, THX - 0.1, THY - 0.1)],
  [BAND2 + 0.1, rectSec(TC, THX - 0.2, THY - 0.2)], [T_TOP - 0.6, rectSec(TC, THX - 0.2, THY - 0.2)],
  [T_TOP - 0.4, rectSec(TC, THX - 0.02, THY - 0.02)], [T_TOP, rectSec(TC, THX - 0.02, THY - 0.02)],
]));
// ---------- spits: ingezwenkte achtkante voet, hals, ui en spil ----------
solids.push(loft([
  [T_TOP - 0.05, oct(TC, 3.9)], [22.8, oct(TC, 3.1)], [23.8, oct(TC, 2.35)], [25.0, oct(TC, 1.95)], [NECK, oct(TC, 1.7)],
  [26.9, oct(TC, 2.5)], [27.5, oct(TC, 3.35)], [28.2, oct(TC, 3.9)], [29.0, oct(TC, 4.0)], [29.9, oct(TC, 3.7)],
  [30.9, oct(TC, 2.9)], [31.8, oct(TC, 1.9)], [32.5, oct(TC, 1.15)], [BULB_TOP, oct(TC, 0.9)],
  [34.0, oct(TC, 0.9)], [SPIRE_TOP, tip(TC)],
]));

// ---------- nissen: vensters, deuren en galmgaten ----------
const cuts = [];
// Zuidgevel schip: ingang met spitsboognis erboven aan de westkant, drie vensters.
cuts.push(niche([0, 0], 270, -NAVE_S, -11.0, 1.3, 0.0, 2.2, 0.5));
cuts.push(niche([0, 0], 270, -NAVE_S, -11.0, 1.1, 3.8, 5.2, 0.4));
cuts.push(niche([0, 0], 270, -NAVE_S, -8.4, 1.4, 3.0, 5.6, 0.4));
for (const u of [-2.85, 2.4]) cuts.push(niche([0, 0], 270, -NAVE_S, u, 1.6, 2.6, 5.4, 0.4));
// Zuidgevel koor: twee hoge vensters, onder het westelijke een deur.
cuts.push(niche([0, 0], 270, -CH_S, 7.85, 1.8, 3.6, 6.7, 0.4));
cuts.push(niche([0, 0], 270, -CH_S, 7.85, 1.2, 0.0, 2.3, 0.5));
cuts.push(niche([0, 0], 270, -CH_S, 11.9, 1.8, 2.8, 6.7, 0.4));
// Sluiting: een venster in elk van de drie vlakken.
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
cuts.push(niche(mid([CH_APSE_U, CH_S], [CH_E, CH_E_S]), -45, 0, 0, 1.6, 2.8, 6.6, 0.4));
cuts.push(niche(mid([CH_E, CH_E_S], [CH_E, CH_E_N]), 0, 0, 0, 1.6, 2.8, 6.6, 0.4));
cuts.push(niche(mid([CH_E, CH_E_N], [CH_APSE_U, CH_N]), 45, 0, 0, 1.6, 2.8, 6.6, 0.4));
// Noordgevel: twee vensters in het schip en twee in het koor (s = -u aan de noordkant).
for (const u of [-8.4, -3.2]) cuts.push(niche([0, 0], 90, NAVE_N, -u, 1.5, 3.0, 5.6, 0.4));
for (const u of [7.8, 11.7]) cuts.push(niche([0, 0], 90, CH_N, -u, 1.8, 3.2, 6.7, 0.4));
// Toren: westdeur, spitsboognis in de middelste geleding (west, zuid, noord), galmgaten boven op alle vier zijden.
cuts.push(niche(TC, 180, THX, 0, 1.3, 0.0, 2.3, 0.5));
cuts.push(niche(TC, 180, THX - 0.1, 0, 1.5, 11.2, 14.6, 0.4));
for (const ang of [90, 270]) cuts.push(niche(TC, ang, THY - 0.1, 0, 1.5, 11.2, 14.6, 0.4));
for (const ang of [0, 90, 180, 270]) cuts.push(niche(TC, ang, (ang % 180 === 0 ? THX : THY) - 0.2, 0, 1.2, 17.6, 19.6, 0.4));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Sint-Nicolaaskerk Dwingeloo",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["1701100000203584"],
  plate: false,
  description:
    "Sint-Nicolaaskerk aan de Brink in Dwingeloo: eenbeukige gotische dorpskerk (XV) met een smaller koor en driezijdige sluiting onder één zadeldak (nok +15,75 m), steunberen met leien kapjes, spitsboogvensters, noordelijke aanbouw met afgewolfd zadeldak, dakkapel op het koordak, en de westtoren van drie geledingen met galmgaten en de uivormige spits ('siepel', 1631) tot +34,6 m. Oorsprong RD (220922; 539080) op de as van het schip op maaiveld (NAP +9,8 m), X-as langs de nok van toren naar koor onder 11 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "schip en koor XV (1450-1500), toren XV, spits 1631 (Rutger van den Boetzelaer), hersteld na de dorpsbrand van 1923 (Jans Boelens)",
    monument: [14228, 14229],
    groundNapM: 9.8,
    naveRidgeM: RIDGE,
    naveEaveSouthM: +eaveS.toFixed(2),
    choirEaveSouthM: +eaveCS.toFixed(2),
    annexRidgeM: ANNEX_RIDGE,
    towerRoofM: T_TOP,
    bulbTopM: BULB_TOP,
    towerTopM: SPIRE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Nicolaaskerk_(Dwingeloo)",
    "https://reliwiki.nl/index.php/Dwingeloo,_Brink_29_-_Sint_Nicolaas",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/14228 (kerk)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/14229 (toren)",
    "https://commons.wikimedia.org/wiki/Category:Sint-Nicolaaskerk_(Dwingeloo) (RCE 20065531, 20065532, 20065533, 20065541, 20065546, 20324951, 20326693; Dwingelo-NH-kerk 1-13; Dwingeloo St. Nicolaaskerk 2005)",
    "BAG pand 1701100000203584 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

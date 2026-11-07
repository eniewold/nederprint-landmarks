import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "dorpskerk-sleen");
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

// Dorpskerk (Hervormde kerk, 'Grote Kerk') Sleen, Brink 7: driebeukige hallenkerk (1420-1450) met het smallere koor
// en zijn vijfzijdige sluiting onder één zadeldak, steunberen, consistorie aan de zuidkant (1962-1966), en de westtoren
// van drie geledingen met blindnissen en de ingezwenkte achtkante naaldspits, de hoogste toren van Drenthe.
const SLUG = "dorpskerk-sleen";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de as van toren naar koor (RD-richting 23,75 graden, uit de BAG-gevels
// onder 23,7-23,8 graden), +v naar het noordwesten. Oorsprong RD (250516; 533017) op de as van het schip, z = 0 op
// maaiveld NAP +18,3 m (3D BAG-maaiveld 18,32; AHN-dtm 18,3-18,8 rondom).
const AXIS_DEG = 23.75;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [250516, 533017];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west van de toren 60,18 (weg), noordwest 60,20,
// verder 60,24-60,71 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 60.18;
const GROUND_SAMPLES = [[-21, 0], [-15, -6.5], [-15, 6], [-8, -9.5], [2, -9.5], [7.8, -17], [12, -7.5], [21.5, 0], [12, 7.5], [2, 9.5], [-8, 9]];

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Schip en koor onder één zadeldak: nok +18,15 op v = -0,17, helling 1,335 (53 graden) aan beide zijden
// (3D BAG-dakvlakken b = +1,33 en -1,34, nok NAP +36,45; AHN-DSM dwarsprofielen).
const RIDGE = 18.15, RIDGE_V = -0.17, PITCH = 1.335;
const roofZ = (v) => RIDGE - PITCH * Math.abs(v - RIDGE_V);
// Schip (BAG): zuidgevel v = -7,45, noordgevel v = 6,8, westgevel u = -10,7 (tegen de toren), oostgevel u = 9,9-10,2.
const NAVE_S = -7.45, NAVE_N = 6.8, NAVE_W = -10.7, NAVE_E_S = 9.89, NAVE_E_N = 10.17;
// Koor (BAG): smaller (v = -5,44 .. 5,59) onder hetzelfde dakvlak, dus hogere goten; vijfzijdige sluiting vanaf u = 14,9
// met de oostwand op u = 19,17 (v = -3,0 .. 3,0). Schilden van de sluiting: helling 1,45, goot +10,6 (3D BAG 1,43-1,47).
const CH_S = -5.44, CH_N = 5.59, CH_APSE_U = 14.9, CH_E = 19.17, CH_E_S = -3.0, CH_E_N = 3.0;
const APSE_EAVE = 10.6, APSE_PITCH = 1.45;
// Consistorie (1962-1966, BAG en 3D BAG): zadeldak noord-zuid met de nok +6,5 op u = 7,8, helling 1,43, puntgevels;
// verbonden met het schip door een smal tussenlid onder het doorgezette dakvlak van het schip.
const ANNEX = [5.59, 10.0, -15.21, -9.34], ANNEX_RIDGE = 6.5, ANNEX_PITCH = 1.43, ANNEX_RIDGE_U = 7.8;
const ANNEX_EAVE = ANNEX_RIDGE - ANNEX_PITCH * (ANNEX[1] - ANNEX_RIDGE_U);
const LINK = [7.75, 9.63, -9.45, -7.3];
// Toren (BAG): u = -19,29 .. -10,81, v = -4,97 .. 4,49; drie geledingen (banden +10,5 en +19,6 uit de westfoto, elk
// 0,15 m terug), kraag en muurplaat +29,0 (AHN-randen 29-31 met de voet van de spits).
const TC = [-15.05, -0.24], THX = 4.24, THY = 4.73;
const BAND1 = 10.5, BAND2 = 19.6, T_TOP = 29.0;
// Spits: ingezwenkte achtkante naaldspits met vier uurwerkfrontjes op de voet; top +59,5 (AHN-DSM 56,5 op 0,35 m van
// de as bij een helling van ~10; Wikipedia 64 m met kruis en haan, die zijn weggelaten).
const SPIRE_TOP = 59.5;

const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
// Steunbeer: naar buiten langs 'ang' (graden, 0 = +u), breedte w, diepte d vanaf de gevel; twee waterlijsten van
// 45 graden (+2,4 en halverwege) en een schuin afgedekte top die tot 0,6 m onder de goot tegen de gevel loopt.
const buttress = ([x, y], ang, w, d, eave) => {
  const top = eave - 0.6 - 0.5 * d, mid = (2.4 + top) / 2, hw = w / 2;
  const prof = [
    [-0.5, BASE], [d, BASE], [d, 2.4], [0.75 * d, 2.4 + 0.25 * d], [0.75 * d, mid], [0.5 * d, mid + 0.25 * d],
    [0.5 * d, top], [0, top + 0.5 * d], [-0.5, top + 0.5 * d],
  ];
  return Manifold.hull(prof.flatMap(([px, pz]) => [[px, -hw, pz], [px, hw, pz]])).rotate([0, 0, ang]).translate([x, y, 0]);
};
const facetNormalDeg = ([x0, y0], [x1, y1]) => (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI - 90;

const solids = [];
// ---------- schip en koor: één veelhoek onder de twee dakvlakken en de drie schilden van de sluiting ----------
const P_SE = [CH_APSE_U, CH_S], P_E_S = [CH_E, CH_E_S], P_E_N = [CH_E, CH_E_N], P_NE = [CH_APSE_U, CH_N];
const BODY = [
  [NAVE_W, NAVE_S], [NAVE_E_S, NAVE_S], [NAVE_E_S, CH_S], P_SE, P_E_S, P_E_N, P_NE,
  [NAVE_E_N, CH_N], [NAVE_E_N, NAVE_N], [NAVE_W, NAVE_N],
];
const INSIDE = [12, 0];
solids.push(roofed(BODY, [
  ...ridgeV(RIDGE_V, RIDGE, PITCH),
  facet(P_SE, P_E_S, APSE_EAVE, APSE_PITCH, INSIDE),
  facet(P_E_S, P_E_N, APSE_EAVE, APSE_PITCH, INSIDE),
  facet(P_E_N, P_NE, APSE_EAVE, APSE_PITCH, INSIDE),
]));
// ---------- consistorie met puntgevels, en het tussenlid onder het dakvlak van het schip ----------
const annexPoly = rect(ANNEX[0], ANNEX[1], ANNEX[2], ANNEX[3]);
solids.push(roofed(annexPoly, ridgeU(ANNEX_RIDGE_U, ANNEX_RIDGE, ANNEX_PITCH)));
const linkPoly = rect(LINK[0], LINK[1], LINK[2], LINK[3]);
solids.push(roofed(linkPoly, ridgeV(RIDGE_V, RIDGE, PITCH)));
// Schoorsteen op de nok (luchtfoto u = 6,7; foto's vanuit het zuidwesten en noordoosten): 0,9 m in het vierkant tot +19,2.
solids.push(prism(rect(6.25, 7.15, RIDGE_V - 0.45, RIDGE_V + 0.45), 15, RIDGE + 1.05));
// ---------- dakkapellen (foto's en luchtfoto): op het zuidelijke dakvlak en op het oostschild van het koor ----------
solids.push(roofed(rect(3.5, 4.7, -4.6, -2.0), ridgeU(4.1, 14.0, 1.4)));
solids.push(roofed(rect(15.2, 17.8, -0.7, 0.7), ridgeV(0, 14.5, 1.4)));
// ---------- plint rondom (0,2 m buiten de gevels tot +0,6) ----------
const plan = new CrossSection([ccw(BODY)])
  .add(new CrossSection([ccw(annexPoly)]))
  .add(new CrossSection([ccw(linkPoly)]))
  .add(new CrossSection([ccw(rectSec(TC, THX, THY))]));
solids.push(Manifold.extrude(plan.offset(0.2, "Miter", 2), 0.6 - BASE).translate([0, 0, BASE]));
// ---------- steunberen (BAG-uitsprongen) ----------
const eaveS = roofZ(NAVE_S), eaveN = roofZ(NAVE_N), eaveCS = roofZ(CH_S), eaveCN = roofZ(CH_N);
for (const [u, w] of [[-5.8, 1.2], [-0.76, 1.06], [4.15, 1.03]]) solids.push(buttress([u, NAVE_S], 270, w, 1.15, eaveS));
for (const [u, w] of [[-5.77, 1.12], [-1.18, 1.22], [4.4, 1.04]]) solids.push(buttress([u, NAVE_N], 90, w, 1.15, eaveN));
// Op de overgang van schip naar koor (noord) en tegen het tussenlid (zuid).
solids.push(buttress([9.66, NAVE_N], 90, 1.01, 1.55, eaveN));
// Hoekberen van het schip aan de westkant, diagonaal.
solids.push(buttress([NAVE_W, NAVE_S], 225, 1.0, 1.15, eaveS));
solids.push(buttress([NAVE_W, NAVE_N], 135, 1.0, 1.15, eaveN));
// Koor: beren op de hoeken van de sluiting.
const nS = facetNormalDeg(P_SE, P_E_S), nN = facetNormalDeg(P_E_N, P_NE);
solids.push(buttress(P_SE, (nS - 90) / 2, 1.1, 1.2, Math.min(eaveCS, APSE_EAVE)));
solids.push(buttress(P_E_S, nS / 2, 1.0, 1.15, APSE_EAVE));
solids.push(buttress(P_E_N, nN / 2, 1.0, 1.15, APSE_EAVE));
solids.push(buttress(P_NE, (nN + 90) / 2, 1.1, 1.2, Math.min(eaveCN, APSE_EAVE)));
// ---------- toren: drie geledingen met terugsprongen, kraag onder de spits ----------
solids.push(loft([
  [BASE, rectSec(TC, THX, THY)], [BAND1, rectSec(TC, THX, THY)],
  [BAND1 + 0.15, rectSec(TC, THX - 0.15, THY - 0.15)], [BAND2, rectSec(TC, THX - 0.15, THY - 0.15)],
  [BAND2 + 0.15, rectSec(TC, THX - 0.3, THY - 0.3)], [T_TOP - 0.5, rectSec(TC, THX - 0.3, THY - 0.3)],
  [T_TOP - 0.25, rectSec(TC, THX - 0.05, THY - 0.05)], [T_TOP, rectSec(TC, THX - 0.05, THY - 0.05)],
]));
// ---------- spits: ingezwenkte voet van de vierkante muurplaat naar de achtkant, dan de naald ----------
solids.push(loft([
  [T_TOP - 0.01, rectSec(TC, THX - 0.05, THY - 0.05)], [30.6, oct(TC, 7.0)], [32.0, oct(TC, 5.9)], [34.0, oct(TC, 5.0)],
  [37.0, oct(TC, 4.3)], [41.0, oct(TC, 3.5)], [46.0, oct(TC, 2.5)], [52.0, oct(TC, 1.4)], [56.0, oct(TC, 0.7)],
  [SPIRE_TOP, tip(TC)],
]));
// Vier uurwerkfrontjes op de voet van de spits: zadeldakje haaks op de gevel, voorvlak in het vlak van de muurplaat.
const clock = (ang, a) => {
  const g = [[-1.0, T_TOP - 0.05], [1.0, T_TOP - 0.05], [1.0, 31.7], [0, 32.9], [-1.0, 31.7]];
  return profileX(g, a - 3.0, a).rotate([0, 0, ang]).translate([TC[0], TC[1], 0]);
};
for (const ang of [0, 180]) solids.push(clock(ang, THX - 0.05));
for (const ang of [90, 270]) solids.push(clock(ang, THY - 0.05));

// ---------- nissen: vensters, deuren en galmgaten ----------
const cuts = [];
// Zuidgevel schip: vier spitsboogvensters tussen de beren; noordgevel idem (s = -u aan de noordkant).
for (const u of [-8.55, -3.25, 1.7, 6.2]) cuts.push(niche([0, 0], 270, -NAVE_S, u, 1.8, 2.6, 6.2, 0.4));
for (const u of [-8.5, -3.5, 1.65, 7.0]) cuts.push(niche([0, 0], 90, NAVE_N, -u, 1.8, 2.6, 6.2, 0.4));
// Koor: zijvensters en een venster in elk van de drie vlakken van de sluiting.
cuts.push(niche([0, 0], 270, -CH_S, 12.3, 2.0, 2.8, 7.6, 0.4));
cuts.push(niche([0, 0], 90, CH_N, -12.4, 2.0, 2.8, 7.6, 0.4));
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
cuts.push(niche(mid(P_SE, P_E_S), nS, 0, 0, 1.8, 2.8, 7.4, 0.4));
cuts.push(niche(mid(P_E_S, P_E_N), 0, 0, 0, 1.8, 2.8, 7.4, 0.4));
cuts.push(niche(mid(P_E_N, P_NE), nN, 0, 0, 1.8, 2.8, 7.4, 0.4));
// Consistorie: deur in de zuidgevel, vensters in de zijgevels.
cuts.push(niche([ANNEX_RIDGE_U, ANNEX[2]], 270, 0, 0, 1.2, 0.0, 2.1, 0.4));
cuts.push(niche([ANNEX[1], -12.3], 0, 0, 0, 1.0, 1.0, 2.2, 0.3));
cuts.push(niche([ANNEX[0], -12.3], 180, 0, 0, 1.0, 1.0, 2.2, 0.3));
// Toren: westdeur en groot spitsboogvenster erboven; op elke zijde drie hoge blindnissen per geleding; galmgat in de
// middelste nis van de bovenste geleding (oostkant: alleen de bovenste geleding, de onderste zitten achter het dak).
cuts.push(niche(TC, 180, THX, 0, 1.8, 0.0, 2.5, 0.5));
cuts.push(niche(TC, 180, THX, 0, 2.4, 3.8, 6.8, 0.4));
for (const ang of [0, 90, 180, 270]) {
  const half = ang % 180 === 0 ? THX : THY, side = ang % 180 === 0 ? THY : THX, sp = side * 0.55;
  for (const s of [-sp, 0, sp]) {
    if (ang !== 0) cuts.push(niche(TC, ang, half - 0.15, s, 1.3, 11.4, 17.6, 0.35));
    cuts.push(niche(TC, ang, half - 0.3, s, 1.3, 20.5, 26.6, 0.35));
  }
  cuts.push(niche(TC, ang, half - 0.3, 0, 0.9, 22.6, 24.6, 0.8));
}

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Dorpskerk Sleen",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0109100000000807"],
  plate: false,
  description:
    "Hervormde kerk (Grote Kerk) aan de Brink in Sleen: driebeukige gotische hallenkerk (1420-1450) met het smallere koor en zijn vijfzijdige sluiting onder één zadeldak (nok +18,15 m), steunberen met waterlijsten, spitsboogvensters, dakkapellen, de consistorie (1962-1966) met tussenlid aan de zuidkant, en de westtoren van drie geledingen met blindnissen en galmgaten onder de ingezwenkte achtkante naaldspits met uurwerkfrontjes tot +59,5 m. Oorsprong RD (250516; 533017) op de as van het schip op maaiveld (NAP +18,3 m), X-as van toren naar koor onder 23,75 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "schip 1420-1450 (hallenkerk), koor XV en verhoogd rond 1500, toren XV met spits (vernieuwd 1703, ingestort 1705, later herbouwd), dak deels ingestort 1880, restauratie C.H. Peters 1882-1883, restauratie en consistorie 1962-1966",
    monument: [33779, 33780],
    groundNapM: 18.3,
    naveRidgeM: RIDGE,
    naveEaveSouthM: +eaveS.toFixed(2),
    naveEaveNorthM: +eaveN.toFixed(2),
    choirEaveSouthM: +eaveCS.toFixed(2),
    apseEaveM: APSE_EAVE,
    annexRidgeM: ANNEX_RIDGE,
    towerTopM: T_TOP,
    spireTopM: SPIRE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Kerk_van_Sleen",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/33779 (kerk)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/33780 (toren)",
    "https://www.wikidata.org/wiki/Q17440827",
    "https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Sleen (RCE 20200481-20200493, 20322183; Kerk Sleen, Kerk Sleen2, 33779 Hervormde Kerk, 33780-Hervormde kerk toren, RM 33780 Kerktoren van Sleen, Sleen Hervormde kerk 2014)",
    "BAG pand 0109100000000807 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

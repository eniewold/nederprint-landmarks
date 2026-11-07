import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "st-nicolaas-of-grote-kerk-vollenhove");
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
// Steunbeer tegen een gevel die naar -v kijkt (zuid): breedte w, diepte d, bovenkant zw tegen de muur en zo aan de buitenkant.
// angle draait de gevel: 0 zuid, 90 oost, 180 noord, 270 west; [x, y] is het punt in de gevel.
const buttress = ([x, y], angle, w, d, zw, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
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




const SLUG = "st-nicolaas-of-grote-kerk-vollenhove";
const BASE = -0.4;
// Stelsel: oorsprong RD (192897, 521732) midden in de hallenkerk op de lijn van de zuilenrij, +u langs de nokken
// van west naar oost (RD-richting -13,9 graden, uit de noord- en zuidgevel van de BAG-contour en de nokken in de
// 3D BAG), +v naar het noorden. z = 0 ligt op het laagste maaiveld rond de voet van de klokkentoren (NAP +4,6 m,
// het plein zakt naar het oosten); de kerk staat op een verhoging van NAP +5,1 tot +5,6 m die PDOK al heeft.
const ORIGIN = [192897, 521732];
const AXIS_DEG = -13.9;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: oost van de toren 47,13 en 47,04, zuidoost
// 47,31, tussen kerk en toren 47,59, koorsluitingen 47,60 en 47,74, zuid 47,91, west 47,92, noordoost 47,47
// (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 47.04;
const GROUND_SAMPLES = [[38, 2], [38, 6], [35, -1], [29, 0], [24, 6], [24, -6], [10, -13], [-30, 4], [21, 11]];
const NAP0 = 4.59; // NAP-hoogte van z = 0
const nap = (h) => +(h - NAP0).toFixed(3);

// ---------- maten ----------
// Twee even brede beuken met elk een zadeldak (3D BAG LoD2.2 en AHN): nokken NAP +24,2 m, helling 1,48 (56 graden),
// tussen de daken een vlakke goot op NAP +17,4 m. Zuidbeuk v -10,45..-0,4, noordbeuk -0,4..10,15 (BAG).
const RIDGE = nap(24.2), PITCH = 1.48;
const WEST = -22.85, EAST = 19.35; // westgevel en begin van de koorsluitingen (BAG)
const S_WALL = -10.45, N_WALL = 10.15, MID = -0.4;
const S_C = (S_WALL + MID) / 2, N_C = (MID + N_WALL) / 2;
const S_EAVE = RIDGE - PITCH * (MID - S_WALL) / 2, N_EAVE = RIDGE - PITCH * (N_WALL - MID) / 2;
const GUTTER = nap(17.4);
// Driezijdige koorsluitingen uit de 14de eeuw (BAG): zuid tot u = 22,0, noord tot u = 22,35.
const S_APSE = [[EAST, S_WALL], [22.0, -7.1], [22.0, -3.75], [EAST, MID]];
const N_APSE = [[EAST, MID], [22.35, 3.15], [22.35, 6.6], [EAST, N_WALL]];
const CG = nap(5.3); // maaiveld langs de kerk
// Achtkante traptoren tussen de sluitingen met naaldspits (AHN-top +25,2 op 0,5 m; naald geschat tot NAP +27).
const TURRET = [20.4, -0.4], TURRET_TOP = nap(19.0), TURRET_SPIRE = nap(27.0);
// Sacristie (gerfkamer) tegen de sluitingen: zadeldak met nok langs u op NAP +17,1 (3D BAG), trapgevel in het oosten;
// het blok loopt door tot u = 19,6 en vult zo de hoeken tussen de sluitingen en de traptoren.
const SAC = [19.6, 26.6, -2.75, 2.6], SAC_RIDGE_V = -0.4, SAC_RIDGE = nap(17.1), SAC_PITCH = 1.33;
// Losse klokkentoren ten oosten van de kerk (BAG-pand 1708100000014816): 7,15 x 5,8 m, 25,5 graden gedraaid
// ten opzichte van de kerk; drie geledingen, tentdak met de top op NAP +22,8 (3D BAG en AHN), goot +18,1.
const TC = [32.1, 6.28], T_ROT = 25.5, T_HS = 3.575, T_HT = 2.9;
const T_BAND1 = 4.9, T_BAND2 = 10.6, T_EAVE = nap(18.1), T_TOP = nap(22.8);

const solids = [];
const cuts = [];
// Steunbeer met één versnijding: diepte d tot z1, dan 45 graden terug naar d2 en met een schuine kop tegen de muur.
// angle: 0 zuid, 90 oost, 180 noord, 270 west (zoals buttress()).
const pier = ([x, y], angle, w, d, d2, z1, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, z1], [-d2, z1 + (d - d2)], [-d2, zo], [0, zo + d2], [0.1, zo + d2]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
// Buitenwaartse richting van een gevelsegment p-q (weg van 'inside') als hoek voor pier()/niche().
const outward = ([x0, y0], [x1, y1], [ix, iy]) => {
  let nx = (y1 - y0), ny = -(x1 - x0);
  const len = Math.hypot(nx, ny);
  nx /= len; ny /= len;
  if (nx * (ix - x0) + ny * (iy - y0) > 0) { nx = -nx; ny = -ny; }
  return { n: [nx, ny], deg: (Math.atan2(ny, nx) * 180) / Math.PI };
};

// ---------- beuken met koorsluitingen ----------
const sPoly = [[WEST, S_WALL], ...S_APSE, [WEST, MID]];
const nPoly = [[WEST, MID], ...N_APSE, [WEST, N_WALL]];
const sRoof = [...ridgeV(S_C, RIDGE, PITCH)];
for (let i = 0; i < S_APSE.length - 1; i++) sRoof.push(facet(S_APSE[i], S_APSE[i + 1], S_EAVE, PITCH, [0, S_C]));
const nRoof = [...ridgeV(N_C, RIDGE, PITCH)];
for (let i = 0; i < N_APSE.length - 1; i++) nRoof.push(facet(N_APSE[i], N_APSE[i + 1], N_EAVE, PITCH, [0, N_C]));
solids.push(roofed(sPoly, sRoof), roofed(nPoly, nRoof));
// Vlakke goot tussen de daken (3D BAG: NAP +17,3 tot +17,6 over 1,2 m).
solids.push(prism(rect(WEST, 18.6, -1.0, 0.2), BASE, GUTTER));
// Gemetselde plint rond beide beuken tot 1,6 m boven het maaiveld.
for (const poly of [sPoly, nPoly])
  solids.push(Manifold.extrude(new CrossSection([ccw(poly)]).offset(0.2, "Miter", 2), CG + 1.6 - BASE).translate([0, 0, BASE]));

// Steunberen: acht traveeën per lange gevel (BAG), met een versnijding en een schuine kop onder de goot.
const S_BUTT = [-16.75, -11.6, -6.5, -1.9, 4.1, 8.75, 13.9];
const N_BUTT = [-16.8, -11.7, -6.6, -1.5, 3.6, 8.65, 13.75];
for (const u of S_BUTT) solids.push(pier([u, S_WALL], 0, 0.9, 1.35, 0.8, CG + 4.3, S_EAVE - 2.6));
for (const u of N_BUTT) solids.push(pier([u, N_WALL], 180, 0.9, 1.35, 0.8, CG + 4.3, N_EAVE - 2.6));
// Hoeksteunberen: diagonaal op de westhoeken, recht aan het begin van de sluitingen, schuin op hun hoeken.
solids.push(pier([WEST, S_WALL], 315, 0.9, 1.6, 1.0, CG + 4.3, S_EAVE - 2.6));
solids.push(pier([WEST, N_WALL], 225, 0.9, 1.6, 1.0, CG + 4.3, N_EAVE - 2.6));
solids.push(pier([EAST, S_WALL], 0, 0.9, 1.35, 0.8, CG + 4.3, S_EAVE - 2.6));
solids.push(pier([EAST, N_WALL], 180, 0.9, 1.35, 0.8, CG + 4.3, N_EAVE - 2.6));
solids.push(pier(S_APSE[1], 42, 0.9, 1.35, 0.8, CG + 4.3, S_EAVE - 2.6));
solids.push(pier(N_APSE[2], 138, 0.9, 1.35, 0.8, CG + 4.3, N_EAVE - 2.6));
solids.push(pier(S_APSE[2], 90, 0.9, 1.0, 0.7, CG + 4.3, S_EAVE - 3.0));
solids.push(pier(N_APSE[1], 90, 0.9, 1.0, 0.7, CG + 4.3, N_EAVE - 3.0));

// Vensters: hoge spitsboogvensters als blinde nissen in elke travee (de travee met het zuidportaal heeft er geen).
const sBays = [WEST, ...S_BUTT, EAST];
for (let i = 0; i < sBays.length - 1; i++) {
  const u = (sBays[i] + sBays[i + 1]) / 2;
  if (u > -1.9 && u < 4.1) continue;
  cuts.push(niche([u, S_WALL], 270, 0, 0, 2.2, CG + 3.4, S_EAVE - 2.5, 0.4));
}
const nBays = [WEST, ...N_BUTT, EAST];
for (let i = 0; i < nBays.length - 1; i++) {
  const u = (nBays[i] + nBays[i + 1]) / 2;
  cuts.push(niche([u, N_WALL], 90, 0, 0, 2.2, CG + 3.4, N_EAVE - 2.5, 0.4));
}
// Vensters in de zichtbare zijden van beide sluitingen.
for (const [apse, c, eave, sides] of [[S_APSE, S_C, S_EAVE, [0, 1]], [N_APSE, N_C, N_EAVE, [1, 2]]]) {
  for (const i of sides) {
    const p = apse[i], q = apse[i + 1];
    const { deg } = outward(p, q, [0, c]);
    cuts.push(niche([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], deg, 0, 0, 2.0, CG + 3.4, eave - 2.5, 0.4));
  }
}
// Noordingang (dubbele deur onder het vierde venster) en de rondboogdeur in de westelijke travee van de zuidgevel.
cuts.push(niche([1.05, N_WALL], 90, 0, 0, 2.4, CG - 0.3, CG + 2.6, 0.4));
cuts.push(niche([(WEST - 16.75) / 2, S_WALL], 270, 0, 0, 2.2, CG - 0.3, CG + 2.4, 0.4));
// Westgevels: lancetnis in beide topgevels, groot venster in de zuidbeuk.
cuts.push(niche([WEST, S_C], 180, 0, 0, 1.1, S_EAVE + 0.6, RIDGE - 4.0, 0.4));
cuts.push(niche([WEST, N_C], 180, 0, 0, 1.1, N_EAVE + 0.6, RIDGE - 4.0, 0.4));
cuts.push(niche([WEST, S_C], 180, 0, 0, 2.6, CG + 3.4, S_EAVE - 2.5, 0.4));

// ---------- portalen ----------
// Zuidportaal (BAG u -1,9..4,0, tot v = -15,4): zadeldak dwars op de kerk, nok NAP +16,3 op u = 1,05 (3D BAG).
const SP = [-1.9, 4.1, -15.4, S_WALL + 0.3];
solids.push(roofed(rect(SP[0], SP[1], SP[2], SP[3]), ridgeU(1.1, nap(16.3), 1.47)));
solids.push(pier([SP[0], SP[2]], 315, 0.9, 0.9, 0.6, CG + 2.5, CG + 4.6));
solids.push(pier([SP[1], SP[2]], 45, 0.9, 0.9, 0.6, CG + 2.5, CG + 4.6));
cuts.push(niche([1.1, SP[2]], 270, 0, 0, 1.8, CG - 0.3, CG + 2.6, 0.4));
cuts.push(niche([1.1, SP[2]], 270, 0, 0, 0.9, CG + 4.6, CG + 6.0, 0.3));
// Westportaal van de noordbeuk (BAG u -27,6..-22,85, v 2,6..6,65): nok langs u op NAP +15,7, puntgevel naar het
// westen met deur; aan de noordkant een lage aanbouw met lessenaarsdak (3D BAG NAP +13,1 tot +10,7).
const WP = [-27.6, WEST + 0.3, 2.6, 6.65];
solids.push(roofed(rect(WP[0], WP[1], WP[2], WP[3]), ridgeV(4.65, nap(15.7), 1.55)));
solids.push(roofed(rect(-24.6, WEST + 0.3, 6.4, 8.8), [[0, -0.9, nap(13.1) + 0.9 * 6.4]]));
solids.push(pier([WP[0], WP[2]], 315, 0.9, 0.9, 0.6, CG + 2.5, CG + 4.6));
solids.push(pier([WP[0], WP[3]], 225, 0.9, 0.9, 0.6, CG + 2.5, CG + 4.6));
cuts.push(niche([WP[0], 4.65], 180, 0, 0, 1.6, CG - 0.3, CG + 2.6, 0.4));
cuts.push(niche([WP[0], 4.65], 180, 0, 0, 0.9, CG + 4.0, CG + 5.4, 0.3));
cuts.push(niche([-25.2, WP[2]], 270, 0, 0, 1.1, CG + 1.8, CG + 4.0, 0.3));

// ---------- traptoren en sacristie ----------
solids.push(loft([[BASE, oct(TURRET, 2.6)], [TURRET_TOP, oct(TURRET, 2.6)], [TURRET_TOP + 0.25, oct(TURRET, 2.9)], [TURRET_TOP + 0.6, oct(TURRET, 2.9)],
  [TURRET_SPIRE, tip(TURRET)]]));
for (let k = 0; k < 8; k++) if (k % 2 === 0) cuts.push(niche(TURRET, k * 45, 1.3, 0, 0.6, TURRET_TOP - 2.2, TURRET_TOP - 1.2, 0.3));
const sacRoof = [[0, SAC_PITCH, SAC_RIDGE - SAC_PITCH * SAC_RIDGE_V], [0, -SAC_PITCH, SAC_RIDGE + SAC_PITCH * SAC_RIDGE_V]];
solids.push(roofed(rect(SAC[0], SAC[1], SAC[2], SAC[3]), sacRoof));
// Trapgevel van de sacristie: treden van 0,9 m breed en circa 1 m hoog boven de dakvlakken, topstuk met pinakel.
const SG = [SAC[1] - 0.9, SAC[1]];
{
  const steps = [[SAC[2], SAC[3], SAC_RIDGE - 3.2], [SAC[2] + 0.9, SAC[3] - 0.9, SAC_RIDGE - 2.0], [SAC[2] + 1.8, SAC[3] - 1.8, SAC_RIDGE - 0.8],
    [SAC_RIDGE_V - 0.6, SAC_RIDGE_V + 0.6, SAC_RIDGE + 0.6]];
  for (const [v0, v1, z] of steps) solids.push(prism(rect(SG[0], SG[1], v0, v1), BASE, z));
  solids.push(pinnacle([SG[0] + 0.45, SAC_RIDGE_V], 0.45, SAC_RIDGE + 0.6, 0.3, 0.9));
}
solids.push(pier([SAC[1], SAC[2]], 45, 0.9, 0.9, 0.6, CG + 2.5, CG + 5.0));
solids.push(pier([SAC[1], SAC[3]], 135, 0.9, 0.9, 0.6, CG + 2.5, CG + 5.0));
cuts.push(niche([SAC[1], SAC_RIDGE_V], 0, 0, 0, 1.6, CG + 1.0, CG + 3.6, 0.4));
cuts.push(niche([SAC[1], SAC_RIDGE_V], 0, 0, 0, 0.8, CG + 6.4, CG + 7.6, 0.3));
cuts.push(niche([24.0, SAC[2]], 270, 0, 0, 1.4, CG + 1.4, CG + 4.6, 0.4));
cuts.push(niche([24.0, SAC[3]], 90, 0, 0, 1.4, CG + 1.4, CG + 4.6, 0.4));

let church = Manifold.union(solids).subtract(Manifold.union(cuts));
church = church.trimByPlane([0, 0, 1], BASE);

// ---------- klokkentoren ----------
// Gebouwd in een eigen stelsel (s langs de lange zijde), daarna gedraaid en verplaatst.
const tSolids = [];
const tCuts = [];
const O0 = [0, 0];
const tr = (hs, ht) => rect(-hs, hs, -ht, ht);
// Plint, drie geledingen met waterlijsten (onderkant 51 graden), de bovenste iets ingesprongen.
tSolids.push(prism(tr(T_HS + 0.2, T_HT + 0.2), BASE, 0.8));
tSolids.push(prism(tr(T_HS, T_HT), BASE, T_BAND2));
for (const z of [T_BAND1, T_BAND2])
  tSolids.push(loft([[z - 0.25, tr(T_HS, T_HT)], [z, tr(T_HS + 0.2, T_HT + 0.2)], [z + 0.25, tr(T_HS + 0.2, T_HT + 0.2)]]));
tSolids.push(prism(tr(T_HS - 0.12, T_HT - 0.12), T_BAND2, T_EAVE));
// Gootlijst en tentdak naar één top (3D BAG), met een dakkapel op de zuid- en oostzijde.
tSolids.push(loft([[T_EAVE - 0.3, tr(T_HS - 0.12, T_HT - 0.12)], [T_EAVE, tr(T_HS + 0.12, T_HT + 0.12)], [T_EAVE + 0.15, tr(T_HS + 0.12, T_HT + 0.12)],
  [T_TOP, tip(O0)]]));
{
  const rise = T_TOP - T_EAVE - 0.15;
  // Dakkapel: blok van 1,2 m breed in het dakvlak met een eigen zadeldakje; voorkant 0,6 m achter de goot.
  const dormer = (alongS, sign) => {
    const half = alongS ? T_HT + 0.12 : T_HS + 0.12;
    const f = half - 0.6; // voorkant
    const zb = T_EAVE + 0.15 + rise * (0.6 / half);
    const body = alongS
      ? roofed(rect(-0.6, 0.6, f - 1.6, f), ridgeU(0, zb + 1.7, 1.2))
      : roofed(rect(f - 1.6, f, -0.6, 0.6), ridgeV(0, zb + 1.7, 1.2));
    return body.trimByPlane([0, 0, 1], zb - 0.6).rotate([0, 0, sign > 0 ? 0 : 180]);
  };
  tSolids.push(dormer(true, -1), dormer(false, 1));
}
// Nissen: per zijde drie hoge blinde spitsboognissen in de middengeleding, drie galmgaten in de klokkenverdieping.
for (const [deg, a, span] of [[0, T_HS, T_HT], [180, T_HS, T_HT], [90, T_HT, T_HS], [270, T_HT, T_HS]]) {
  const step = span * 0.62;
  for (const s of [-step, 0, step]) {
    tCuts.push(niche(O0, deg, a, s, 1.1, T_BAND1 + 0.7, T_BAND2 - 1.4, 0.3));
    tCuts.push(niche(O0, deg, a - 0.12, s, 1.1, T_BAND2 + 0.45, T_EAVE - 1.3, 0.35));
  }
}
// Spitsboogdeur in de zuidgevel (naar de kerk) en een venstertje in de oostgevel.
tCuts.push(niche(O0, 270, T_HT, 0, 1.3, 0, 2.2, 0.4));
tCuts.push(niche(O0, 0, T_HS, 0, 0.8, 2.4, 3.4, 0.3));
let tower = Manifold.union(tSolids).subtract(Manifold.union(tCuts)).trimByPlane([0, 0, 1], BASE);
tower = tower.rotate([0, 0, T_ROT]).translate([TC[0], TC[1], 0]);

const nodes = [["building:kerk", church], ["building:klokkentoren", tower]];
const all = Manifold.union([church, tower]);
const META = {
  name: "Grote of Sint-Nicolaaskerk Vollenhove",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["1708100000010883", "1708100000014816"],
  plate: false,
  description:
    "Tweebeukige hallenkerk aan het Kerkplein in Vollenhove (eind 15de eeuw, koorsluitingen 14de eeuw): twee zadeldaken (nok NAP +24,2 m, 56 graden) met vlakke goot en driezijdige sluitingen, steunberen, spitsboognissen, zuid- en westportaal, sacristie met trapgevel en achtkante traptoren met naaldspits; los ten oosten de klokkentoren van drie geledingen met tentdak (NAP +22,8 m). Oorsprong RD (192897, 521732) midden in de kerk, X-as langs de nokken onder -13,9 graden, z = 0 op NAP +4,6 m bij de toren. Vensters, galmgaten en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "koorsluitingen 14de eeuw, hallenkerk eind 15de eeuw, klokkentoren iets jonger (klokken circa 1511)",
    monument: 10555,
    groundNapM: NAP0,
    churchGroundNapM: 5.3,
    ridgeM: RIDGE,
    southEaveM: +S_EAVE.toFixed(2),
    northEaveM: +N_EAVE.toFixed(2),
    turretTopM: TURRET_SPIRE,
    towerEaveM: T_EAVE,
    towerTopM: T_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_of_Sint-Nicolaaskerk_(Vollenhove)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/10555",
    "https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Nicolaaskerk_(Vollenhove)",
    "BAG panden 1708100000010883 (kerk) en 1708100000014816 (klokkentoren); 3D BAG LoD2.2 (dakvlakken)",
    "PDOK AHN dsm_05m/dtm_05m, actuele luchtfoto en PDOK-terreintegels",
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

import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "margarethakerk-odoorn");
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


// Margarethakerk (Odoorn), Valtherweg 1: zaalkerk van vijf traveeën uit 1856 (W. van Ernst; na de brand van 1897 op de oude
// muren herbouwd), met een gepleisterde geveltoren in de westgevel en een achtkante lantaarn met spits, en ten oosten het smalle,
// rechthoekige koor van omstreeks 1200 van granieten zwerfkeien (nu consistorie) onder een tentdak met een dakkapel.
const SLUG = "margarethakerk-odoorn";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van toren naar koor (RD-richting 12,9 graden, uit de BAG-gevels van schip
// en koor, die op 2 cm na evenwijdig lopen), +v naar het noorden. Oorsprong RD (253362,75; 541406,95) in het midden van het
// schip (BAG-gevels u = -12,26 .. 12,26, v = -6,21 .. 6,22), z = 0 op maaiveld NAP +24,9 m (laagste AHN-maaiveld langs de
// gevels, oostzijde).
const AXIS_DEG = 12.9;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [253362.75, 541406.95];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: pad voor de oostdeur van het koor 66,31; west van de
// toren 66,68, zuid 66,61 .. 66,71, noord 66,62 .. 66,79 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 66.31;
const GROUND_SAMPLES = [[-14.5, 0], [-13.5, -7.6], [0, -7.6], [12, -7.6], [20.2, 0], [20.2, -3], [20.2, 3], [15.7, 5.4], [0, 7.6], [-13.5, 7.6]];

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Schip (BAG): u = -12,26 .. 12,26, v = -6,215 .. 6,215. Zadeldak met de nok +13,65 op de as en helling 0,945 (43,4 graden)
// aan beide zijden (AHN-DSM mediaanprofiel over u = -10 .. 7: 0,94 en 0,95; 3D BAG 0,92 .. 0,95), goot +7,78.
const NAVE_U = 12.26, NAVE_V = 6.215, RIDGE = 13.65, PITCH = 0.945;
const EAVE = RIDGE - PITCH * NAVE_V;
// Oosteinde van het schip: wolfeind boven de koorkap, steil dakvlak (1,48; 3D BAG en AHN) vanaf +10,80 aan de oostgevel.
const HIP_Z = 10.8, HIP_PITCH = 1.48;
// Kroonlijst rondom: 0,35 m uitstek, onderkant onder 41 graden.
const CORNICE = 0.35;
// Koor (BAG): u = 12,26 .. 19,22, v = -3,90 .. 3,99; tentdak met de top +10,3 (AHN 10,2, 3D BAG 10,4) boven het midden,
// goten +6,6 (3D BAG), kleine overstek van 0,3 m.
const CH = [12.26, 19.22, -3.9, 3.99], CH_EAVE = 6.6, CH_TOP = 10.3;
const CH_C = [(CH[0] + CH[1]) / 2, (CH[2] + CH[3]) / 2];
// Toren (BAG-risaliet): u = -12,88 .. -9,30, v = -1,79 .. 1,79, tot de kroonlijst +20,2 (AHN 20,3 .. 21,6 met de leuning,
// westfoto 19,9 .. 20,1). Daarop de achtkante lantaarn (2,3 m breed tot +22,0, kroonlijst tot +22,9) en de leien spits met
// ingezwenkte voet tot +29,0 (AHN-piek 28,8; foto: bol op circa 29,2).
const TC = [-11.09, 0], TH = 1.79, T_TOP = 20.2;
const LANT = 2.3, LANT_TOP = 22.0, LANT_CORNICE = 22.9, SPIRE_TOP = 29.0;

const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
const grow = (r, d) => [[r[0][0] - d, r[0][1] - d], [r[1][0] + d, r[1][1] - d], [r[2][0] + d, r[2][1] + d], [r[3][0] - d, r[3][1] + d]];

const solids = [];
// ---------- schip: muren onder de twee dakvlakken en het wolfeind ----------
const NAVE = rect(-NAVE_U, NAVE_U, -NAVE_V, NAVE_V);
const naveRoof = [...ridgeV(0, RIDGE, PITCH), [-HIP_PITCH, 0, HIP_Z + HIP_PITCH * NAVE_U]];
solids.push(roofed(NAVE, naveRoof));
// Dakvoet over de kroonlijst: het dak loopt door tot de buitenkant van de lijst.
const C_TOP = EAVE - PITCH * CORNICE;
solids.push(roofed(rect(-NAVE_U, NAVE_U, -NAVE_V - CORNICE, NAVE_V + CORNICE), naveRoof).trimByPlane([0, 0, 1], C_TOP - 0.05));
solids.push(loft([[C_TOP - 0.45, grow(NAVE, 0)], [C_TOP - 0.05, grow(NAVE, CORNICE)], [C_TOP, grow(NAVE, CORNICE)]]));
// Lisenen (BAG: 0,55 m breed, 0,21 m uit de gevel) en hoekpilasters, tot in de kroonlijst.
for (const u of [-7.285, -2.455, 2.38, 7.215]) {
  solids.push(prism(rect(u - 0.275, u + 0.275, -NAVE_V - 0.21, -NAVE_V + 0.1), BASE, C_TOP - 0.1));
  solids.push(prism(rect(u - 0.275, u + 0.275, NAVE_V - 0.1, NAVE_V + 0.23), BASE, C_TOP - 0.1));
}
for (const su of [-1, 1]) for (const sv of [-1, 1]) {
  const u0 = su * 11.81, u1 = su * 12.37, v0 = sv * 5.71, v1 = sv * 6.28;
  solids.push(prism(rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1)), BASE, C_TOP - 0.1));
}
// Witte waterlijst onder de vensters (+2,85), 0,12 m uit de gevel.
solids.push(loft([[2.6, grow(NAVE, 0)], [2.73, grow(NAVE, 0.12)], [2.85, grow(NAVE, 0.12)]]));
// Portalen van de zij-ingangen in de middentravee (witte omlijsting met kroonlijstje), noord en zuid.
const portal = (sv) => {
  const prof = [[-0.3, BASE], [0.18, BASE], [0.18, 3.55], [-0.3, 3.75 + 0.48]];
  return Manifold.hull(prof.flatMap(([d, z]) => [[-1.14, sv * (NAVE_V + d), z], [1.06, sv * (NAVE_V + d), z]]));
};
solids.push(portal(-1), portal(1));
// ---------- koor: tentdak, overstek met schuine onderkant, dakkapel op het oostschild ----------
const INSIDE = CH_C;
const chPlanes = [
  facet([CH[0], CH[2]], [CH[1], CH[2]], CH_EAVE, (CH_TOP - CH_EAVE) / (CH_C[1] - CH[2]), INSIDE),
  facet([CH[0], CH[3]], [CH[1], CH[3]], CH_EAVE, (CH_TOP - CH_EAVE) / (CH[3] - CH_C[1]), INSIDE),
  facet([CH[1], CH[2]], [CH[1], CH[3]], CH_EAVE, (CH_TOP - CH_EAVE) / (CH[1] - CH_C[0]), INSIDE),
  facet([CH[0], CH[2]], [CH[0], CH[3]], CH_EAVE, (CH_TOP - CH_EAVE) / (CH_C[0] - CH[0]), INSIDE),
];
const CHOIR = rect(CH[0] - 0.5, CH[1], CH[2], CH[3]);
solids.push(roofed(CHOIR, chPlanes));
const chEaveLow = CH_EAVE - 0.3 * 0.95;
solids.push(roofed(rect(CH[0], CH[1] + 0.3, CH[2] - 0.3, CH[3] + 0.3), chPlanes).trimByPlane([0, 0, 1], chEaveLow));
solids.push(loft([[chEaveLow - 0.35, rect(CH[0], CH[1], CH[2], CH[3])], [chEaveLow, rect(CH[0], CH[1] + 0.3, CH[2] - 0.3, CH[3] + 0.3)]]));
// Dakkapel (witte houten kapel met zadeldakje, nok langs u) op het oostschild, boven de oostdeur.
const DORMER = [17.3, 19.1, -0.75, 0.75], DORMER_RIDGE = 8.2;
solids.push(roofed(rect(...DORMER), ridgeV(0, DORMER_RIDGE, 0.93)));
// ---------- toren: schacht met banden, kroonlijst, lantaarn en spits ----------
const tsq = (d) => rectSec(TC, TH + d, TH + d);
solids.push(prism(tsq(0), BASE, T_TOP - 0.6));
solids.push(loft([[BASE, tsq(0.1)], [0.6, tsq(0.1)], [0.7, tsq(0)]]));
for (const z of [5.5, 9.1]) solids.push(loft([[z - 0.45, tsq(0)], [z - 0.3, tsq(0.12)], [z, tsq(0.12)], [z + 0.01, tsq(0)]]));
solids.push(loft([[T_TOP - 0.7, tsq(0)], [T_TOP - 0.3, tsq(0.3)], [T_TOP, tsq(0.3)]]));
solids.push(loft([
  [T_TOP - 0.05, oct(TC, LANT)], [LANT_TOP, oct(TC, LANT)], [LANT_TOP + 0.45, oct(TC, LANT + 0.7)], [LANT_CORNICE, oct(TC, LANT + 0.7)],
]));
solids.push(loft([
  [LANT_CORNICE - 0.05, oct(TC, 2.0)], [23.3, oct(TC, 1.65)], [23.8, oct(TC, 1.5)], [SPIRE_TOP, tip(TC)],
]));

// ---------- nissen: vensters, deuren, galmgaten ----------
const cuts = [];
const BAYS = [-9.685, -4.87, -0.04, 4.8, 9.65];
for (const u of BAYS) {
  if (Math.abs(u) < 1) continue;
  cuts.push(niche([0, 0], 270, NAVE_V, u, 1.65, 2.95, 5.35, 0.4));
  cuts.push(niche([0, 0], 90, NAVE_V, -u, 1.65, 2.95, 5.35, 0.4));
}
// Middentravee: deur met een korter venster erboven (zuid en noord).
for (const [ang, s] of [[270, -0.04], [90, 0.04]]) {
  cuts.push(niche([0, 0], ang, NAVE_V + 0.18, s, 1.4, 0.0, 2.3, 0.55));
  cuts.push(niche([0, 0], ang, NAVE_V, s, 1.4, 3.95, 5.2, 0.4));
}
// Westgevel: twee hoge blinde rondboognissen naast de toren.
for (const v of [-4.0, 4.0]) cuts.push(niche([0, 0], 180, NAVE_U, -v, 1.5, 2.9, 6.0, 0.3));
// Toren: westdeur met bovenlicht, twee vensters in de westgevel, oculi, galmgaten en ronde nissen onder de kroonlijst.
cuts.push(niche(TC, 180, TH, 0, 1.7, 0.0, 3.1, 0.5));
cuts.push(niche(TC, 180, TH, 0, 1.0, 5.95, 7.6, 0.4));
cuts.push(niche(TC, 180, TH, 0, 1.0, 9.6, 11.4, 0.4));
const rhomb = ([cx, cy], ang, a, zc, hw, hh, d = 0.35) =>
  profileX([[-hw, zc], [0, zc - hh], [hw, zc], [0, zc + hh]], a - d, a + 0.4).rotate([0, 0, ang]).translate([cx, cy, 0]);
for (const ang of [0, 90, 180, 270]) {
  cuts.push(rhomb(TC, ang, TH, 14.35, 0.42, 0.52));
  cuts.push(niche(TC, ang, TH, 0, 0.9, 15.4, 17.3, 0.4));
  cuts.push(rhomb(TC, ang, TH, 18.95, 0.5, 0.62));
}
// Lantaarn: acht rondboogopeningen als nissen.
for (let k = 0; k < 8; k++) cuts.push(niche(TC, k * 45, LANT / 2, 0, 0.55, 20.55, 21.3, 0.3));
// Koor: spitsboogvenster in de zuid- en de noordwand, hoge spitsboogdeur in de oostwand, venster in de dakkapel.
cuts.push(niche([0, 0], 270, -CH[2], 14.5, 1.1, 1.0, 3.4, 0.4));
cuts.push(niche([0, 0], 90, CH[3], -14.6, 0.9, 1.3, 3.0, 0.4));
cuts.push(niche([0, 0], 0, CH[1], 0, 1.1, 0.0, 3.0, 0.45));
cuts.push(niche([0, 0], 0, DORMER[1], 0, 0.7, 6.9, 7.3, 0.3));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Margarethakerk Odoorn",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["1681100000002431"],
  plate: false,
  description:
    "Margarethakerk aan de Valtherweg in Odoorn: zaalkerk van vijf traveeën (1856, W. van Ernst; na de brand van 1897 herbouwd) onder een zadeldak (nok +13,65 m) met wolfeind aan de oostkant, lisenen, kroonlijst, waterlijst, rondboogvensters en zij-ingangen met portaal, de gepleisterde geveltoren in de westgevel met banden, oculi, galmgaten en kroonlijst (+20,2 m), de achtkante lantaarn en de leien spits tot +29,0 m, en ten oosten het koor van omstreeks 1200 (consistorie) onder een tentdak met dakkapel. Oorsprong RD (253362,75; 541406,95) in het midden van het schip op maaiveld (NAP +24,9 m), X-as langs de nok van toren naar koor onder 12,9 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "koor omstreeks 1200 (granieten zwerfkeien), schip en toren 1856-1857 (W. van Ernst), na de brand van 25 november 1897 herbouwd en 28 augustus 1899 heropend",
    monument: 31221,
    groundNapM: 24.9,
    naveRidgeM: RIDGE,
    naveEaveM: +EAVE.toFixed(2),
    naveHipAtEastWallM: HIP_Z,
    choirEaveM: CH_EAVE,
    choirTopM: CH_TOP,
    towerCorniceM: T_TOP,
    lanternCorniceM: LANT_CORNICE,
    towerTopM: SPIRE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Margarethakerk_(Odoorn)",
    "https://reliwiki.nl/index.php/Odoorn,_Valtherweg_1_-_Margarethakerk",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/31221",
    "https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Odoorn (Odoorn NH kerk 2008; Odoorn 191; RCE 20372055, 20372058, 20372059, 20372060, 20372062, 20372063)",
    "BAG pand 1681100000002431 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

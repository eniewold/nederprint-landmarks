import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "willibrordkerk-borger");
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


const SLUG = "willibrordkerk-borger";
const BASE = -0.4;
// Bouwstelsel (u, v) = modelstelsel: +u langs de nok van het schip van de toren naar de koorsluiting (RD-richting
// 16,26 graden, gemeten aan de evenwijdige langsgevels in de BAG-contour), +v naar de noordzijde. De oorsprong ligt op
// de nok van het schip midden tussen de langsgevels, op maaiveld aan de oostkant (NAP +18,05 m; het kerkhof loopt
// naar de toren toe 0,6 m op).
const AXIS_DEG = 16.26;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [249387.89, 549516.38];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: oost van de koorsluiting 59,65, langs de
// zuidgevel 60,09 tot 59,73, langs de noordgevel 60,13 tot 59,77, west van de toren 60,14 (PDOK-terreintegels,
// november 2026).
const GROUND_ELLIPSOID = 59.65;
const GROUND_SAMPLES = [[-18.6, 0], [-13.3, -4.6], [-13.3, 4.8], [-8, -5.6], [-8, 5.6], [2, -5.6], [2, 5.6], [12, -5.6], [12, 5.6], [17.4, 0]];

// ---------- maten (meter boven maaiveld) ----------
// Zaalkerk van 1826 (Waterstaatskerk): 9,92 m breed (BAG), westgevel achter de toren op u = -10,45, driezijdige
// sluiting in het oosten (BAG, symmetrisch gemaakt). Goot +7,15 (NAP +25,2), nok +13,2 (NAP +31,25), dakhelling
// 1,22 (50,7 graden), nokeinde boven de sluiting op u = 12,3 (AHN-DSM).
const HW = 4.96, NAVE_W = -10.45, NAVE_E = 14.0, APSE_E = 16.48, APSE_HW = 2.12;
const EAVE = 7.15, RIDGE = 13.2, PITCH = (RIDGE - EAVE) / HW, RIDGE_END = 12.3;
const OVER = 0.4; // overstek van de houten gootlijst
// Toren (begin XIV): twee geledingen op een voet van veldkeien, de onderste iets verjongend, waterlijst op +12,3,
// goot +19,35 (NAP +37,4), tentdak met leien tot +25,8 en makelaar met bol en windvaan (AHN-top NAP +45,3 = +27,25).
// Voet 7,8 x 7,75 m (BAG); op de goot 7,4 x 7,0 m (AHN-DSM, de dakrand ligt rondom 0,3 m buiten de muur): de toren
// verjongt vooral aan de zuidzijde, zodat het hart boven 0,18 m noordelijker ligt dan aan de voet.
const TC = [-13.3, 0.12], TCT = [-13.3, 0.3], LEDGE = 12.3, SETBACK = 0.1;
const hx0 = 3.9, hy0 = 3.87, hx1 = 3.78, hy1 = 3.58, hx2 = hx1 - SETBACK, hy2 = hy1 - SETBACK;
const T_EAVE = 19.35, T_OVER = 0.3, T_APEX = 25.8, T_TOP = 27.2;

const solids = [];
const cuts = [];
const box = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const normalDeg = (a, b, inside) => {
  const nx = b[1] - a[1], ny = -(b[0] - a[0]);
  const m = mid(a, b);
  const s = nx * (inside[0] - m[0]) + ny * (inside[1] - m[1]) > 0 ? -1 : 1;
  return (Math.atan2(s * ny, s * nx) * 180) / Math.PI;
};
// Dakvlakken van een veelhoekige sluiting: elk vlak door de gevellijn op de goot, oplopend naar het nokeinde.
const apsePlanes = (pts, eave, apex, ridge) =>
  pts.slice(0, -1).map((p0, i) => {
    const p1 = pts[i + 1];
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const dist = Math.abs((p1[0] - p0[0]) * (p0[1] - apex[1]) - (p0[0] - apex[0]) * (p1[1] - p0[1])) / len;
    return facet(p0, p1, eave, (ridge - eave) / dist, apex);
  });
const win = (p, angle, w, z0, z1, d = 0.38) => cuts.push(niche(p, angle, 0, 0, w, z0, z1, d));
const offsetPts = (pts, o) => new CrossSection([ccw(pts)]).offset(o, "Miter").toPolygons()[0];

// ---------- schip met driezijdige sluiting ----------
const APSE = [[NAVE_E, -HW], [APSE_E, -APSE_HW], [APSE_E, APSE_HW], [NAVE_E, HW]];
const PLAN = [[NAVE_W, -HW], ...APSE, [NAVE_W, HW]];
const ridgeEnd = [RIDGE_END, 0];
const sidePlanes = ridgeV(0, RIDGE, PITCH);
const roofPlanes = [...sidePlanes, ...apsePlanes(APSE, EAVE, ridgeEnd, RIDGE)];
// Muren tot de goot, plint van 0,15 m tot +0,6.
solids.push(prism(PLAN, BASE, EAVE));
solids.push(prism(offsetPts(PLAN, 0.15), BASE, 0.6));
// Houten gootlijst: kraag onder het overstek (1,5 keer zo hoog als breed, zodat ook de hoeken steiler dan 45 graden
// blijven), dan een boeiboord van 0,3 m tot het dakvlak.
const CORNICE_Z = EAVE - OVER * PITCH - 0.3;
const CORNICE_FOOT = CORNICE_Z - 1.5 * OVER;
solids.push(loft([[CORNICE_FOOT, PLAN], [CORNICE_Z, offsetPts(PLAN, OVER)], [CORNICE_Z + 0.1, offsetPts(PLAN, OVER)]]));
// Dak: zadeldak met schild over de sluiting; het westeinde loopt tegen de toren. Alleen de smalle hoeken naast
// de toren hebben een klein schild vanaf de westgevel (foto's van noordoost en zuidwest).
const TOWER_E = TCT[0] + hx2; // oostwand van de bovenste torengeleding
const roofPlan = offsetPts(PLAN, OVER).map(([u, v]) => [Math.max(u, TOWER_E - 0.05), v]);
solids.push(roofed(roofPlan, roofPlanes).trimByPlane([0, 0, 1], CORNICE_Z + 0.05));
const westHip = [PITCH, 0, EAVE - PITCH * NAVE_W];
for (const [v0, v1] of [[-HW - OVER, TCT[1] - hy2 + 0.05], [TCT[1] + hy2 - 0.05, HW + OVER]]) {
  solids.push(roofed(rect(NAVE_W - OVER, TOWER_E, v0, v1), [...sidePlanes, westHip]).trimByPlane([0, 0, 1], CORNICE_Z + 0.05));
}
// Twee schoorstenen op de nok (foto noordoost), vergroot tot 0,9 m.
for (const u of [2.6, 10.6]) solids.push(prism(box([u, 0], 0.45, 0.45), RIDGE - 1.0, RIDGE + 0.9));

// Lisenen tussen de vensters en op de hoeken (0,8 m breed, vergroot tot 0,3 m reliëf) met een voet tot +0,9.
const BAY = (NAVE_E - NAVE_W) / 5;
const pil = [];
for (let k = 1; k < 5; k++) pil.push(NAVE_W + k * BAY);
for (const sgn of [-1, 1]) {
  const v = sgn * HW;
  for (const u of pil) solids.push(prism(rect(u - 0.4, u + 0.4, Math.min(v, v + sgn * 0.3), Math.max(v, v + sgn * 0.3)), BASE, CORNICE_FOOT));
  // Westhoeken naast de toren.
  solids.push(prism(rect(NAVE_W, NAVE_W + 0.8, Math.min(v, v + sgn * 0.3), Math.max(v, v + sgn * 0.3)), BASE, CORNICE_FOOT));
}
// Hoeklisenen op de knikken van de sluiting: blok langs de bissectrice.
for (const p of APSE) {
  const theta = (Math.atan2(p[1] - ridgeEnd[1], p[0] - ridgeEnd[0]) * 180) / Math.PI;
  solids.push(prism(box([0, 0], 0.55, 0.45), BASE, CORNICE_FOOT).rotate([0, 0, theta]).translate([p[0], p[1], 0]));
}

// Vensters: vijf hoge rondboogvensters per langsgevel (als spitse nis voor print), het middelste aan de zuidkant
// korter boven de ingang; een venster in elke schuine zijde van de sluiting, de oostzijde blind.
const WIN_W = 1.7, WIN_Z0 = 2.4, WIN_Z1 = 4.5;
for (let k = 0; k < 5; k++) {
  const u = NAVE_W + (k + 0.5) * BAY;
  win([u, HW], 90, WIN_W, WIN_Z0, WIN_Z1);
  if (k === 2) {
    win([u, -HW], 270, WIN_W, 3.7, WIN_Z1);
    win([u, -HW], 270, 1.3, 0.05, 2.2, 0.5); // zuidingang
  } else win([u, -HW], 270, WIN_W, WIN_Z0, WIN_Z1);
}
for (const [a, b] of [[APSE[0], APSE[1]], [APSE[2], APSE[3]]]) win(mid(a, b), normalDeg(a, b, ridgeEnd), WIN_W, WIN_Z0, WIN_Z1);

// ---------- toren ----------
// Onderste geleding verjongend op de veldkeien tot de waterlijst, bovenste geleding iets terug.
solids.push(loft([[BASE, box(TC, hx0, hy0)], [LEDGE, box(TCT, hx1, hy1)]]));
// Voet van veldkeien: een rand van 0,2 m tot +0,5 met een schuine bovenkant.
solids.push(loft([[BASE, box(TC, hx0 + 0.2, hy0 + 0.2)], [0.3, box(TC, hx0 + 0.2, hy0 + 0.2)], [0.5, box(TC, hx0, hy0)]]));
solids.push(loft([[LEDGE - 0.05, box(TCT, hx1, hy1)], [LEDGE + SETBACK, box(TCT, hx2, hy2)]]));
solids.push(prism(box(TCT, hx2, hy2), LEDGE, T_EAVE));
// Gemetselde gootlijst (kraag 1,5 keer zo hoog als breed) en tentdak met overstek.
solids.push(loft([[T_EAVE - 1.5 * T_OVER - 0.2, box(TCT, hx2, hy2)], [T_EAVE - 0.2, box(TCT, hx2 + T_OVER, hy2 + T_OVER)], [T_EAVE, box(TCT, hx2 + T_OVER, hy2 + T_OVER)]]));
solids.push(loft([[T_EAVE - 0.01, box(TCT, hx2 + T_OVER, hy2 + T_OVER)], [T_APEX, tip(TCT)]]));
// Makelaar met bol (de windvaan erboven is te dun): schacht van 0,9 m, bol van 1,3 m, punt tot +27,2.
solids.push(loft([[T_APEX - 0.8, oct(TCT, 0.9)], [26.2, oct(TCT, 0.9)], [26.45, oct(TCT, 1.3)], [26.65, oct(TCT, 1.3)], [T_TOP, tip(TCT)]]));

// Galmgaten: per zijde twee spitsboognissen in de bovenste geleding, met daarin een diepere opening voor de
// twee smalle galmgaten (0,3 m breed, samen als één opening van 0,9 m).
const faces = [[180, hx2, 1], [0, hx2, 1], [90, hy2, 0], [270, hy2, 0]];
for (const [ang, a] of faces) {
  for (const s of [-1.15, 1.15]) {
    cuts.push(niche(TCT, ang, a, s, 1.25, LEDGE + 0.45, 15.4, 0.35));
    cuts.push(niche(TCT, ang, a, s, 0.9, 13.4, 15.0, 0.7));
  }
}
// Westingang: rondboogdeur (als spitse nis) in een verdiepte boogomlijsting.
const wallAt = (z) => hx0 - ((hx0 - hx1) * (z - BASE)) / (LEDGE - BASE);
cuts.push(niche(TC, 180, wallAt(1), 0, 2.4, 0.05, 2.4, 0.3));
cuts.push(niche(TC, 180, wallAt(1), 0, 1.4, 0.05, 2.2, 0.8));
// Klein venster in de zuidzijde van de onderste geleding.
const fz = (7.8 - BASE) / (LEDGE - BASE);
cuts.push(niche([TC[0], TC[1] + (TCT[1] - TC[1]) * fz], 270, hy0 - (hy0 - hy1) * fz, 0, 0.9, 7.0, 8.4, 0.4));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Willibrordkerk Borger",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["1681100000012160"],
  plate: false,
  description:
    "Willibrordkerk aan de Hoofdstraat in Borger: zaalkerk van 1826 (Waterstaatskerk) met driezijdige oostsluiting, zadeldak met schild over de sluiting (goot +7,15, nok +13,2 m), houten gootlijst, lisenen en vijf rondboogvensters per langsgevel, ingang in de zuidgevel, en de veertiende-eeuwse westtoren van twee geledingen op veldkeien met galmnissen, rondboogingang en een tentdak met makelaar tot +27,2 m. Oorsprong RD (249387,89; 549516,38) op de nok van het schip op maaiveld aan de oostkant (NAP +18,05 m), X-as langs de nok van toren naar koor onder 16,26 graden. Vensters als blinde nissen met spitse top voor print op 1:1000.",
  realWorld: {
    built: "toren begin XIV (kloostermoppen op veldkeien), zaalkerk 1826 na afbraak van de middeleeuwse kerk",
    monument: [9897, 9898],
    groundNapM: 18.05,
    naveEaveM: EAVE,
    naveRidgeM: RIDGE,
    towerLedgeM: LEDGE,
    towerEaveM: T_EAVE,
    towerApexM: T_APEX,
    towerTopM: T_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Willibrordkerk_(Borger)",
    "https://reliwiki.nl/index.php/Borger,_Hoofdstraat_34_-_Willibrordkerk (foto's Anton van Daal en Hans Bouma 2016)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/9897 (kerk)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/9898 (toren)",
    "BAG pand 1681100000012160 (voetafdruk) en 3D BAG LoD2.2",
    "PDOK AHN dsm_05m/dtm_05m en PDOK-terreintegels",
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

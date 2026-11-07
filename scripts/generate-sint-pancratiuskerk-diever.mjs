import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-pancratiuskerk-diever");
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


const SLUG = "sint-pancratiuskerk-diever";
const BASE = -0.4;
// Bouwstelsel (u, v): +u langs de nok van de toren naar het koor (RD-richting 6,1 graden, gemeten aan de zuid- en
// noordgevel van de BAG-contour, die op 0,05 m na evenwijdig aan deze as lopen), +v naar het noorden.
// Het stelselpunt (0, 0) is RD (217600; 541340); de modeloorsprong ligt op de hoofdnok halverwege het schip
// (u = 23,5; v = 4,5) op maaiveld (NAP +11,25 m volgens het AHN-DTM rond de kerk).
const AXIS_DEG = 6.1;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const FRAME = [217600, 541340];
const ORIGIN = [217622.89, 541346.97];
const SHIFT = [(ORIGIN[0] - FRAME[0]) * ca + (ORIGIN[1] - FRAME[1]) * sa, -(ORIGIN[0] - FRAME[0]) * sa + (ORIGIN[1] - FRAME[1]) * ca];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 53,19 en 53,08 (straat), zuidwest 53,05,
// zuid 53,08, noord 53,15, zuidoost en noordoost 53,18, oost 53,17 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 53.05;
const GROUND_SAMPLES = [[-21.5, 0], [-20.5, 10.5], [-20.5, -11], [-3.5, -11.5], [-3.5, 11.5], [13.5, -8], [14.5, 7.5], [21, 0]];

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Alle hoogtes uit het AHN-DSM (0,5 m) met kleinste kwadraten per dakvlak; voetafdruk uit BAG 1701100000210598
// (kerk) en 1701100000237458 (toren).
const WEST = 4.95; // westgevel van toren en beide zijbeuken
// Hoofdkap over middenschip, noordbeuk en koor: één zadeldak met de nok op v = 4,22, +16,82; het zuidvlak
// loopt onder 50,2 graden (1,20), het noordvlak onder 47,6 graden (1,096) door tot de lage goot van de noordbeuk.
const RIDGE_V = 4.22, RIDGE = 16.82, PITCH_S = 1.2, PITCH_N = 1.096;
const mainS = [0, PITCH_S, RIDGE - PITCH_S * RIDGE_V];
const mainN = [0, -PITCH_N, RIDGE + PITCH_N * RIDGE_V];
const NORTH = 13.62; // noordgevel noordbeuk, goot +6,52
const NAVE_S = -0.5; // grens middenschip/zuidbeuk (kilgoot +11,1) en zuidwand van het koor
const NAVE_E = 31.35; // oostgevel noordbeuk
// Koor (XIV) met driezijdige sluiting, goot +11,1, nokeinde op u = 38,1 (dakvlakken van de sluiting 57 graden).
const CHOIR_N = 9.32, CHOIR_EAVE = 11.1, CHOIR_APEX = [38.1, RIDGE_V];
const APSE = [[38.85, NAVE_S], [41.75, 2.1], [41.75, 6.72], [38.85, CHOIR_N]];
// Zuidbeuk (XVI) met eigen zadeldak, nok +13,35 op v = -2,6, goot +11,08 (helling 1,087), en de Mariakapel als
// driezijdige oostsluiting met schilddak.
const SOUTH = -4.69, AISLE_V = -2.6, AISLE_RIDGE = 13.35, AISLE_PITCH = 1.087;
const AISLE_EAVE = AISLE_RIDGE - AISLE_PITCH * (AISLE_V - SOUTH);
const CHAPEL = [[33.3, SOUTH], [34.75, -3.45], [34.75, -1.75], [33.3, NAVE_S]];
const CHAPEL_APEX = [33.1, AISLE_V];
// Aanbouw tegen de noordwand van het koor: lessenaarsdak van +8,32 tegen het koor tot +3,22 aan de noordgevel.
const ANNEX = [31.3, 36.1, CHOIR_N - 0.1, 14.2];
// Toren (romaans, later verhoogd): 6,76 x 6,56 m (BAG), onderbouw tot +17,7 en een bovengeleding 0,15 m terug
// tot +21,8; leien spits met een uitgezwenkte voet: goot +22,2 tot +22,45, knik op +23,0 en top +36,0; makelaar
// tot +37,6 (AHN-top +37,65).
const T = [WEST, 11.71, 1.24, 7.8];
const TC = [(T[0] + T[1]) / 2, (T[2] + T[3]) / 2];
const THX = (T[1] - T[0]) / 2, THY = (T[3] - T[2]) / 2;
const T_LEDGE = 17.7, T_SET = 0.15, T_TOP = 21.8, EAVE_T = 22.2, KNICK = 23.0, SPIRE_TOP = 36.0, FINIAL_TOP = 37.6;

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
const box = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
// Ruitvormige nis (oculus of uurwerk) met plafonds van ruim 50 graden.
const oculus = ([cx, cy], angle, s, z, r, d = 0.35) =>
  profileX([[s, z - 1.25 * r], [s + r, z], [s, z + 1.25 * r], [s - r, z]], -d, 0.4)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Vensternis in een gevel met de normaal 'angle' door het punt p.
const win = (p, angle, w, z0, z1, d = 0.38) => cuts.push(niche(p, angle, 0, 0, w, z0, z1, d));
// Dakvlakken van een veelhoekige sluiting: elk vlak door de gevellijn op de goot, oplopend naar het nokeinde.
const apsePlanes = (pts, eave, apex, ridge) =>
  pts.slice(0, -1).map((p0, i) => {
    const p1 = pts[i + 1];
    const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const dist = Math.abs((p1[0] - p0[0]) * (p0[1] - apex[1]) - (p0[0] - apex[0]) * (p1[1] - p0[1])) / len;
    return facet(p0, p1, eave, (ridge - eave) / dist, apex);
  });
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const normalDeg = (a, b, inside) => {
  const nx = b[1] - a[1], ny = -(b[0] - a[0]);
  const m = mid(a, b);
  const s = nx * (inside[0] - m[0]) + ny * (inside[1] - m[1]) > 0 ? -1 : 1;
  return (Math.atan2(s * ny, s * nx) * 180) / Math.PI;
};
// Steunbeer zoals buttress(), maar met de achterkant 'back' m in de muur, zodat een hoeksteunbeer op een
// buitenhoek over zijn hele breedte in het metselwerk grijpt. angle als bij buttress (0 = gevel naar -v).
const pier = ([x, y], angle, w, d, zw, zo, back = 0.6) =>
  profileX([[back, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [back, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
// Buitenwaartse bissectrice van een hoek a-p-b als buttress-hoek.
const cornerAngle = (a, p, b, inside) => {
  const n1 = normalDeg(a, p, inside) * Math.PI / 180, n2 = normalDeg(p, b, inside) * Math.PI / 180;
  const bx = Math.cos(n1) + Math.cos(n2), by = Math.sin(n1) + Math.sin(n2);
  // buttress steekt uit naar (sin angle, -cos angle)
  return (Math.atan2(bx, -by) * 180) / Math.PI;
};

// ---------- middenschip en noordbeuk onder één kap ----------
solids.push(roofed(R(WEST, NAVE_E, NAVE_S, NORTH), [mainS, mainN]));
// ---------- koor met driezijdige sluiting ----------
const choirPlan = [[NAVE_E - 0.2, NAVE_S], ...APSE, [NAVE_E - 0.2, CHOIR_N]];
solids.push(roofed(choirPlan, [mainS, mainN, ...apsePlanes(APSE, CHOIR_EAVE, CHOIR_APEX, RIDGE)]));
// Dakkapel in het oostvlak van de koorsluiting (foto's 2021), zadeldakje langs de as.
solids.push(roofed(R(39.0, 40.95, 3.8, 5.0), ridgeV(4.4, 14.0, 1.0)));
// Schoorsteen op het noordvlak bij het koor.
solids.push(prism(R(29.55, 30.45, 5.55, 6.45), 13.0, 17.6));

// ---------- zuidbeuk met eigen kap en Mariakapel ----------
const aislePlan = [[WEST, SOUTH], ...CHAPEL, [WEST, NAVE_S]];
solids.push(roofed(aislePlan, [...ridgeV(AISLE_V, AISLE_RIDGE, AISLE_PITCH), ...apsePlanes(CHAPEL, AISLE_EAVE, CHAPEL_APEX, AISLE_RIDGE)]));
// Pinakel op de top van de westgevel van de zuidbeuk.
solids.push(pinnacle([WEST + 0.45, AISLE_V], 0.45, AISLE_RIDGE - 0.6, 1.4, 0.9));

// ---------- aanbouw tegen het koor ----------
solids.push(roofed(R(ANNEX[0], ANNEX[1], ANNEX[2], ANNEX[3]), [[0, -1.046, 18.07]]));

// ---------- toren ----------
// Onderbouw, waterlijst (45 graden, naar binnen) en teruggelegde bovengeleding.
solids.push(loft([
  [BASE, box(TC, THX, THY)], [T_LEDGE - 0.15, box(TC, THX, THY)],
  [T_LEDGE, box(TC, THX - T_SET, THY - T_SET)], [T_TOP, box(TC, THX - T_SET, THY - T_SET)],
]));
// Goot van de spits op een kraag van 49 graden, uitgezwenkte voet en de steile leien spits (vier vlakken).
const EH = 0.35; // overstek van de goot buiten de bovengeleding
solids.push(loft([
  [T_TOP - 0.05, box(TC, THX - T_SET, THY - T_SET)],
  [EAVE_T, box(TC, THX - T_SET + EH, THY - T_SET + EH)],
  [EAVE_T + 0.25, box(TC, THX - T_SET + EH, THY - T_SET + EH)],
  [KNICK, box(TC, 2.62, 2.52)],
  [SPIRE_TOP, tip(TC)],
]));
// Makelaar: vierkante stang van 0,9 m (printbaar), vanaf waar de spits even smal is, met een punt.
solids.push(loft([[33.6, box(TC, 0.45, 0.45)], [FINIAL_TOP - 0.7, box(TC, 0.45, 0.45)], [FINIAL_TOP, tip(TC)]]));
// Traptoren tegen de noordoosthoek van de toren (BAG), lessenaarsdak van +14,4 tegen de toren tot +13,7.
solids.push(roofed(R(9.36, T[1], T[3] - 0.3, 9.84), [[0, -0.34, 14.4 + 0.34 * T[3]]]));

// ---------- steunberen ----------
// Zuidbeuk: vijf steunberen (BAG) tot vlak onder de goot, hoeksteunberen schuin op de zuidwest- en kapelhoeken.
for (const u of [11.53, 16.24, 20.8, 25.46, 30.77]) solids.push(buttress([u, SOUTH], 0, 0.9, 0.85, 9.7, 8.7));
solids.push(pier([WEST, SOUTH], -45, 1.0, 1.0, 9.7, 8.7));
const chapelIn = [30, AISLE_V];
solids.push(pier(CHAPEL[0], cornerAngle([WEST, SOUTH], CHAPEL[0], CHAPEL[1], chapelIn), 0.9, 0.9, 9.7, 8.7));
solids.push(pier(CHAPEL[1], cornerAngle(CHAPEL[0], CHAPEL[1], CHAPEL[2], chapelIn), 0.9, 0.9, 9.7, 8.7));
// Westgevel: steunbeer tussen zuidbeuk en toren.
solids.push(buttress([WEST, 0.07], -90, 0.75, 0.9, 9.7, 8.7));
// Noordbeuk: vier steunberen tot onder de lage goot en twee schuine hoeksteunberen.
for (const u of [11.59, 16.28, 20.98, 25.87]) solids.push(buttress([u, NORTH], 180, 0.8, 0.7, 5.6, 4.7));
solids.push(pier([WEST, NORTH], -135, 0.9, 0.9, 5.6, 4.7));
solids.push(pier([NAVE_E, NORTH], 135, 0.9, 0.9, 5.6, 4.7));
// Koor: steunberen op de zijwanden en op de hoeken van de sluiting.
solids.push(buttress([38.39, NAVE_S], 0, 0.9, 0.85, 9.9, 8.9));
solids.push(buttress([38.69, CHOIR_N], 180, 0.85, 0.85, 9.9, 8.9));
const choirIn = [36, RIDGE_V];
for (let i = 1; i < APSE.length - 1; i++) solids.push(pier(APSE[i], cornerAngle(APSE[i - 1], APSE[i], APSE[i + 1], choirIn), 0.9, 0.9, 9.9, 8.9));

// ---------- plint ----------
const plan = CrossSection.union([
  new CrossSection([ccw(R(WEST, NAVE_E, NAVE_S, NORTH))]),
  new CrossSection([ccw(choirPlan)]),
  new CrossSection([ccw(aislePlan)]),
  new CrossSection([ccw(R(ANNEX[0], ANNEX[1], ANNEX[2], ANNEX[3]))]),
]);
solids.push(Manifold.extrude(plan.offset(0.15, "Miter"), 0.9 - BASE).translate([0, 0, BASE]));

// ---------- vensters en deuren (blinde nissen) ----------
// Zuidbeuk: vier hoge spitsboogvensters en in de derde travee het portaal met gedenksteen (1759) en een korter venster.
for (const u of [8.24, 13.9, 23.14, 28.12]) win([u, SOUTH], -90, 1.6, 3.0, 8.4);
win([18.52, SOUTH], -90, 2.4, 0.05, 3.2, 0.3);
win([18.52, SOUTH], -90, 1.6, 0.05, 2.6, 0.6);
win([18.52, SOUTH], -90, 1.4, 5.8, 8.4);
// Mariakapel: smalle vensters in de schuine en de oostzijde.
for (let i = 0; i < CHAPEL.length - 2; i++) win(mid(CHAPEL[i], CHAPEL[i + 1]), normalDeg(CHAPEL[i], CHAPEL[i + 1], chapelIn), 0.95, 3.4, 8.2, 0.35);
// Koor: venster in de zuidwand en hoge vensters in de drie zijden van de sluiting.
win([36.4, NAVE_S], -90, 1.6, 3.6, 8.6);
for (let i = 0; i < APSE.length - 1; i++) win(mid(APSE[i], APSE[i + 1]), normalDeg(APSE[i], APSE[i + 1], choirIn), 1.7, 3.6, 8.6);
// Noordbeuk: vensters tot vlak onder de lage goot, de noordingang in de vierde travee.
for (const u of [8.3, 13.94, 18.63, 28.5]) win([u, NORTH], 90, 1.3, 2.2, 4.5, 0.35);
win([23.43, NORTH], 90, 1.3, 3.5, 4.5, 0.35);
win([23.43, NORTH], 90, 1.2, 0.05, 2.2, 0.5);
// Westgevels: groot venster in de zuidbeuk, rondboogvenster en oculus in de noordbeuk.
win([WEST, AISLE_V], 180, 1.6, 3.0, 8.6);
win([WEST, 10.7], 180, 1.3, 2.4, 4.6, 0.35);
cuts.push(oculus([WEST, 10.7], 180, 0, 8.0, 0.55));
// Toren, westzijde: deur, hoog rondboogvenster en in de bovengeleding galmgat en uurwerk.
win([WEST, TC[1]], 180, 1.1, 0.05, 2.0, 0.5);
win([WEST, TC[1]], 180, 1.2, 13.2, 14.8, 0.4);
// Bovengeleding: per zijde galmgat en (west, zuid, oost) een uurwerk als ruit.
const up = [
  [[WEST + T_SET, TC[1]], 180, -1, true],
  [[TC[0], T[2] + T_SET], -90, 1, true],
  [[T[1] - T_SET, TC[1]], 0, 1, true],
  [[TC[0], T[3] - T_SET], 90, -1, false],
];
for (const [p, ang, , clock] of up) {
  // s loopt langs de gevel: het galmgat aan de noord- (west), west- (zuid) of zuidkant (oost), het uurwerk ernaast.
  const s = clock ? -1.3 : 0;
  cuts.push(niche(p, ang, 0, s, 1.0, 18.4, 19.8, 0.5));
  if (clock) cuts.push(oculus(p, ang, 1.3, 19.6, 0.75, 0.3));
}

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE).translate([-SHIFT[0], -SHIFT[1], 0]);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Sint-Pancratiuskerk Diever",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["1701100000210598", "1701100000237458"],
  plate: false,
  description:
    "Protestantse kerk (Sint-Pancratiuskerk) aan de Hoofdstraat in Diever: driebeukige kerk met middenschip en noordbeuk onder één hoge zadelkap (nok +16,8 m, goot noordbeuk +6,5 m), de zuidbeuk met eigen zadeldak en driezijdige Mariakapel, het koor met driezijdige sluiting, schilddak en dakkapel, de aanbouw tegen het koor, steunberen en spitsboogvensters, en de aan drie zijden ingebouwde romaanse westtoren met traptoren, galmgaten, uurwerken en de leien spits met uitgezwenkte voet tot +37,6 m. Oorsprong RD (217622,89; 541346,97) op de hoofdnok halverwege het schip op maaiveld (NAP +11,25 m), X-as langs de nok van toren naar koor onder 6,1 graden. Vensters als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "toren romaans (XII-XIII, later verhoogd), koor XIV-XV, zijbeuken XVI, herbouw na blikseminslag 1759, restauratie 1959",
    monument: 12902,
    groundNapM: 11.25,
    naveRidgeM: RIDGE,
    northAisleEaveM: +(RIDGE - PITCH_N * (NORTH - RIDGE_V)).toFixed(2),
    southAisleRidgeM: AISLE_RIDGE,
    choirEaveM: CHOIR_EAVE,
    towerMasonryM: T_TOP,
    spireTopM: SPIRE_TOP,
    towerTopM: FINIAL_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Pancratiuskerk_(Diever)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/12902",
    "https://commons.wikimedia.org/wiki/Category:Sint-Pancratiuskerk_(Diever) (RCE 20397439, 20322637, 20057411, 20057442; 20210419 Sint Pancratiuskerk1/2 Diever; P1020296)",
    "BAG panden 1701100000210598 (kerk) en 1701100000237458 (toren): voetafdruk",
    "PDOK AHN dsm_05m/dtm_05m (dakvlakken met kleinste kwadraten) en actuele luchtfoto",
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

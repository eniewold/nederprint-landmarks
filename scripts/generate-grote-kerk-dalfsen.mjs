import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-dalfsen");
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

const SLUG = "grote-kerk-dalfsen";
const BASE = -0.4;
// Stelsel: oorsprong midden in het schip op maaiveld (NAP +4,5 m), +u langs de nok van west (toren) naar oost (koor),
// RD-richting 1,3 graden: de noord- en zuidgevel van de BAG-contour en de nok in het AHN-DSM lopen daarlangs.
// +v wijst naar het noorden van de kerk.
const ORIGIN = [214349.5, 502259.0];
const AXIS_DEG = 1.3;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 47,51, noord 47,50, zuid 47,51,
// zuidwest 47,46, noordwest 47,37, oost 47,63, zuidoost 47,48, noordoost 47,28 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 47.28;
const GROUND_SAMPLES = [[-27, 0], [0, 12.5], [0, -12.5], [-17, -9], [-17, 9], [25, 0], [17, -7], [10, 12.5]];

// ---------- maten (meter boven maaiveld) ----------
// Schip met zijbeuken (pseudobasiliek) onder één kap: BAG-gevels op v = -10,0 en +10,0, west tegen de toren (u = -15,3),
// oost tot de koorsluiting van de zijbeuken (u = 14,3). Middenkap: nok +20,6 en helling 1,42 (55 graden, 3D BAG
// en AHN); de lessenaarsdaken van de zijbeuken lopen vanaf |v| = 6,5 flauwer door (1,05; 46 graden) tot de goot.
const HALF_V = 10.0, BODY_W = -15.3, BODY_E = 14.3;
const RIDGE = 20.6, PITCH = 1.42, KNEE_V = 6.5, AISLE_PITCH = 1.05;
const AISLE_C = RIDGE - PITCH * KNEE_V + AISLE_PITCH * KNEE_V; // vlak z = AISLE_C - 1,05 |v|
const EAVE = AISLE_C - AISLE_PITCH * HALF_V; // goot op de zijgevels, +7,7
// Laatgotisch koor (ca. 1455) onder dezelfde kap, smaller (BAG v = ±4,9), sluiting van drie zijden van een achthoek;
// oostgevel op u = 22,5 (BAG), nokeinde boven de sluiting op u = 18,8 (3D BAG-schild 1,91).
const CHOIR_V = 4.9, CHOIR_EAVE = RIDGE - PITCH * CHOIR_V, APSE_E = 22.5;
const APSE_S = APSE_E - (CHOIR_V - CHOIR_V * Math.tan(Math.PI / 8)); // begin van de schuine zijden
const APSE = [[APSE_S, -CHOIR_V], [APSE_E, -CHOIR_V * Math.tan(Math.PI / 8)], [APSE_E, CHOIR_V * Math.tan(Math.PI / 8)], [APSE_S, CHOIR_V]];
const CHOIR_RIDGE_END = 18.8;
// Toren (16e eeuw, nooit voltooid): onderbouw volgens de BAG-contour tot de waterlijst op +5,0, daarboven een vierkante
// schacht van 8,9 m (AHN: muurkruin 9,5 m inclusief de overstek van het dak) met lijsten op +14,8 en +23,8,
// klokkenverdieping tot de goot op +31,0 en een tentdak met een flauwe voet tot +40,2 (3D BAG en AHN).
const T_BASE = [-24.6, -15.3, -5.9, 4.9];
const TC = [-19.5, -0.4], TH = 4.45;
const T_TABLE = 5.0, T_LEDGE1 = 14.8, T_LEDGE2 = 23.8, T_EAVE = 31.0, T_TOP = 40.2;

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
const box = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
// Rechthoekige paneelnis met een plafond van 45 graden; zie generate-grote-kerk-almelo.mjs.
const recess = ([cx, cy], angle, a, s0, s1, z0, z1, d) =>
  Manifold.extrude(new CrossSection([ccw([[a - d, z0], [a + 1, z0], [a + 1, z1], [a, z1], [a - d, z1 - d - 0.05]])]), s1 - s0)
    .rotate([90, 0, 0])
    .translate([0, s1, 0])
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);

// ---------- schip en zijbeuken ----------
const body = R(BODY_W, BODY_E, -HALF_V, HALF_V);
solids.push(roofed(body, ridgeV(0, RIDGE, PITCH)));
solids.push(roofed(body, ridgeV(0, AISLE_C, AISLE_PITCH)));
// Schoorsteen op de noordelijke dakhelling (foto's van noordwest en noordoost; plaats geschat).
solids.push(prism(R(3.55, 4.45, 5.6, 6.5), 10, 14.2));

// ---------- koor met driezijdige sluiting ----------
const choirPlan = [[BODY_E - 0.5, -CHOIR_V], ...APSE, [BODY_E - 0.5, CHOIR_V]];
const ridgeEnd = [CHOIR_RIDGE_END, 0];
const apsePlane = (p0, p1) => {
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const dist = Math.abs((p1[0] - p0[0]) * (p0[1] - ridgeEnd[1]) - (p0[0] - ridgeEnd[0]) * (p1[1] - p0[1])) / len;
  return facet(p0, p1, CHOIR_EAVE, (RIDGE - CHOIR_EAVE) / dist, [16, 0]);
};
solids.push(roofed(choirPlan, [
  ...ridgeV(0, RIDGE, PITCH),
  apsePlane(APSE[0], APSE[1]), apsePlane(APSE[1], APSE[2]), apsePlane(APSE[2], APSE[3]),
]));
// Steunberen op de hoeken van de sluiting (BAG), met waterlijst; bovenkant onder de goot.
for (const [p, theta] of [[APSE[0], -67.5], [APSE[1], -22.5], [APSE[2], 22.5], [APSE[3], 67.5]])
  solids.push(buttress(p, theta + 90, 1.0, 1.0, 11.2, 9.8));
// Sacristie (15e eeuw) tegen de noordkant van het koor: lessenaarsdak van +7,3 naar +2,8 (3D BAG-vlak 10,8 - 0,72 v).
solids.push(roofed(R(BODY_E - 0.5, 19.5, CHOIR_V - 0.5, 11.1), [[0, -0.72, 10.8]]));

// ---------- steunberen van schip en zijbeuken ----------
// Noordgevel (BAG): op u = -9,1, -3,45, 2,1 en 7,7; zuidgevel op -8,8, -3,2 en 2,25, de lagere van de grafkapel
// Van Rechteren op 3,85 en 9,2. Diepte 1,1 m, schuine afdekking tot +6,4 (foto's).
for (const u of [-9.1, -3.45, 2.1, 7.7]) solids.push(buttress([u, HALF_V], 180, 1.05, 1.1, 6.4, 5.3));
for (const u of [-8.8, -3.2, 2.25]) solids.push(buttress([u, -HALF_V], 0, 1.05, 1.1, 6.4, 5.3));
for (const u of [3.85, 9.2]) solids.push(buttress([u, -HALF_V], 0, 0.9, 0.9, 5.4, 4.4));
// Diagonale hoekberen op de vier hoeken van de zijbeuken.
for (const [p, theta] of [[[BODY_W, HALF_V], 135], [[BODY_W, -HALF_V], 225], [[BODY_E, HALF_V], 45], [[BODY_E, -HALF_V], -45]])
  solids.push(buttress(p, theta + 90, 1.0, 1.0, 6.4, 5.3));

// ---------- plint ----------
const plan = CrossSection.union([
  new CrossSection([ccw(body)]),
  new CrossSection([ccw(choirPlan)]),
  new CrossSection([ccw(R(T_BASE[0], T_BASE[1] + 0.5, T_BASE[2], T_BASE[3]))]),
  new CrossSection([ccw(R(BODY_E - 0.5, 19.5, CHOIR_V - 0.5, 11.1))]),
]);
solids.push(Manifold.extrude(plan.offset(0.15, "Miter"), 0.8 - BASE).translate([0, 0, BASE]));

// ---------- vensters en ingangen van schip en koor ----------
const WIN = (p, angle) => cuts.push(niche(p, angle, 0, 0, 1.8, 2.6, 5.4, 0.38));
for (const u of [-12.2, -6.3, -0.7, 4.9, 11.0]) WIN([u, HALF_V], 90);
for (const u of [-12.0, -6.0, -0.5, 6.5, 11.75]) WIN([u, -HALF_V], 270);
// Noordingang onder het middelste venster.
cuts.push(niche([-0.7, HALF_V], 90, 0, 0, 1.3, 0.0, 1.4, 0.35));
// Westgevels van de zijbeuken (halve topgevels tegen de toren): deur met rondboogvenster erboven.
for (const v of [7.45, -7.95]) {
  cuts.push(niche([BODY_W, v], 180, 0, 0, 1.5, 0.0, 2.2, 0.35));
  cuts.push(niche([BODY_W, v], 180, 0, 0, 1.6, 3.4, 5.6, 0.38));
  cuts.push(recess([BODY_W, v], 180, 0, -0.45, 0.45, 7.6, 8.6, 0.25));
}
// Koor: hoge spitsboogvensters in de drie zijden van de sluiting en de zuidwand, boven de sacristie in de noordwand.
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const CWIN = (p, angle, w, z0) => cuts.push(niche(p, angle, 0, 0, w, z0, 10.4, 0.4));
CWIN(mid(APSE[0], APSE[1]), -45, 2.0, 3.6);
CWIN(mid(APSE[1], APSE[2]), 0, 2.0, 3.6);
CWIN(mid(APSE[2], APSE[3]), 45, 2.0, 3.6);
CWIN([17.0, -CHOIR_V], 270, 2.0, 3.6);
CWIN([17.0, CHOIR_V], 90, 1.8, 8.0);
// Sacristie: twee vensters in de oostgevel en een in de noordgevel.
cuts.push(niche([19.5, 8.0], 0, 0, 0, 1.2, 1.2, 3.2, 0.3));
cuts.push(niche([17.0, 11.1], 90, 0, 0, 1.0, 0.8, 1.6, 0.3));

// ---------- toren ----------
// Onderbouw met tufstenen bekleding tot de waterlijst; de waterlijst loopt onder 45 graden terug naar de schacht.
solids.push(prism(R(...T_BASE), BASE, T_TABLE));
const tb = R(...T_BASE);
const setback = Math.max(TC[0] - TH - T_BASE[0], T_BASE[3] - (TC[1] + TH), TC[1] - TH - T_BASE[2]);
solids.push(Manifold.hull([...tb.map(([x, y]) => [x, y, T_TABLE - 0.01]), ...box(TC, TH).map(([x, y]) => [x, y, T_TABLE + setback])]));
solids.push(prism(box(TC, TH), BASE, T_EAVE));
// Lijsten tussen de geledingen: kraag van 50 graden, 0,25 m uitstekend.
for (const z of [T_LEDGE1, T_LEDGE2])
  solids.push(loft([[z - 0.35, box(TC, TH)], [z - 0.05, box(TC, TH + 0.25)], [z + 0.2, box(TC, TH + 0.25)], [z + 0.45, box(TC, TH)]]));
// Tentdak met overstek op een kraag van 48 graden en een flauwe voet (klokvormig), tot +40,2.
solids.push(loft([[T_EAVE - 0.45, box(TC, TH)], [T_EAVE, box(TC, TH + 0.4)], [T_EAVE + 0.2, box(TC, TH + 0.4)], [T_EAVE + 0.8, box(TC, TH - 0.2)], [T_TOP, tip(TC)]]));
// Westingang: spitsboogportaal met omlijsting in de onderbouw.
solids.push(prism(R(T_BASE[0] - 0.25, T_BASE[0] + 0.1, TC[1] - 1.6, TC[1] + 1.6), BASE, 4.6));
cuts.push(niche([T_BASE[0] - 0.25, TC[1]], 180, 0, 0, 1.9, 0.0, 3.0, 0.45));
// Tweede geleding: west een groot venster met maaswerk tussen twee blinde nissen, noord en zuid drie blinde nissen.
cuts.push(niche(TC, 180, TH, 0, 2.2, 7.0, 11.8, 0.4));
for (const s of [-2.75, 2.75]) cuts.push(niche(TC, 180, TH, s, 1.2, 6.2, 12.4, 0.35));
for (const ang of [90, 270]) for (const s of [-2.75, 0, 2.75]) cuts.push(niche(TC, ang, TH, s, 1.3, 6.2, 12.4, 0.35));
// Derde geleding: drie hoge blinde spitsboognissen op west, noord en zuid.
for (const ang of [180, 90, 270]) for (const s of [-2.75, 0, 2.75]) cuts.push(niche(TC, ang, TH, s, 1.3, 15.6, 21.6, 0.35));
// Klokkenverdieping: galmgat in het midden, ondiepe lisenenvelden ernaast, op alle vier zijden.
for (const ang of [0, 90, 180, 270]) {
  cuts.push(niche(TC, ang, TH, 0, 1.3, 25.3, 28.8, 0.6));
  for (const s of [-2.75, 2.75]) cuts.push(niche(TC, ang, TH, s, 1.4, 24.6, 29.2, 0.2));
}

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Grote Kerk Dalfsen",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0148100000025043"],
  plate: false,
  description:
    "Grote Kerk (Hervormde kerk, voorheen Sint-Cyriacus) aan het Kerkplein in Dalfsen: laatgotische pseudobasiliek met schip en zijbeuken onder één kap (nok +20,6 m, flauwere zijbeukdaken), steunberen, laatgotisch koor van ca. 1455 met driezijdige sluiting en schild, sacristie, en de onvoltooide westtoren met tufstenen onderbouw, drie geledingen met blinde spitsboognissen en een tentdak tot +40,2 m. Oorsprong RD (214349,5; 502259,0) midden in het schip op maaiveld (NAP +4,5 m), X-as langs de nok onder 1,3 graden. Vensters en nissen als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "zijbeuken 14e eeuw, koor ca. 1455, schip 2e helft 15e eeuw en na de brand van 1517, toren 16e eeuw (onvoltooid)",
    monument: [11653, 11654],
    groundNapM: 4.5,
    naveRidgeM: RIDGE,
    aisleEaveM: +EAVE.toFixed(2),
    choirEaveM: +CHOIR_EAVE.toFixed(2),
    towerEaveM: T_EAVE,
    towerTopM: T_TOP,
    baseM: BASE,
  },
  sources: [
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/11653 (kerk: koor 1455, pseudobasilicaal schip, grafkapel Van Rechteren)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/11654 (toren)",
    "https://www.dbnl.org/tekst/sten009monu03_01/sten009monu03_01_0023.php (Monumenten in Nederland, Overijssel: Dalfsen, Herv. kerk)",
    "https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Dalfsen",
    "https://commons.wikimedia.org/wiki/Category:Tower_of_Grote_Kerk,_Dalfsen",
    "BAG pand 0148100000025043 (voetafdruk, steunberen), 3D BAG LoD2.2 (dakvlakken)",
    "PDOK AHN DSM/DTM 0,5 m en actuele luchtfoto; PDOK-terreintegels voor groundHeight",
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

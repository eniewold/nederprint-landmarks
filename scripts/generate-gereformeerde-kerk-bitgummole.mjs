import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "gereformeerde-kerk-bitgummole");
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

// Algemene nis rond een middelpunt: zelfde plaatsing als niche(), maar als kegelvormig rond venster (roosvenster).
const roundNiche = ([cx, cy], angle, a, s, z, r, d = 0.3) => {
  const back = r - 1.17 * d, len = d + 0.4;
  const front = back + (len / d) * (r - back);
  return Manifold.cylinder(len, back, front, 48).rotate([0, 90, 0]).translate([a - d, s, z]).rotate([0, 0, angle]).translate([cx, cy, 0]);
};
// Kraag onder een goot: langs een gevel van p0 naar p1 (plan), 0,3 m uitkragend naar 'out' (eenheidsvector), onderkant 47 graden,
// bovenkant 0,08 m boven de dakvlakken.
const eaveCornice = ([u0, v0], [u1, v1], [ox, oy], eave, planes) => {
  const o = 0.3, drop = 0.32;
  const pts = [];
  for (const [u, v] of [[u0, v0], [u1, v1]]) {
    pts.push([u, v, eave - drop - 0.1], [u + o * ox, v + o * oy, eave - 0.1], [u + o * ox, v + o * oy, eave + 2], [u - 0.3 * ox, v - 0.3 * oy, eave + 2], [u - 0.3 * ox, v - 0.3 * oy, eave - drop - 0.1]);
  }
  return planes.reduce((s, [a, b, c]) => cutBelow(s, [a, b, c + 0.08]), Manifold.hull(pts));
};

// Gereformeerde Kerk (Bitgummole), J.H. van Aismawei 11: kruiskerk van 1924-1925 (A. Nauta, Amsterdamse School) met vier
// armen onder twee elkaar kruisende zadeldaken van 51 graden, tuitgevels met roosvenster (zuid) en vensterreeksen, lage
// portalen, de vierkante toren met vier geveltopjes en een leien naaldspits voor de zuidgevel, en de lage kerklokalen
// (L-vormig onder schilddak, plat dak en tussenlid) aan de oostkant.
const SLUG = "gereformeerde-kerk-bitgummole";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van het schip van de zuidgevel naar de achtergevel (RD-richting 77,9 graden,
// uit de BAG-gevels, die op deze hoek binnen 0,05 m recht liggen), +v naar het westen. Oorsprong RD (176188,73; 583285,51) op
// de kruising van de nokken, z = 0 op het laagste maaiveld rond de voet (NAP +1,46 m aan de oostkant; voorplein NAP +1,6 m).
const AXIS_DEG = 77.9;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [176188.73, 583285.51];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: voorplein 42,82 / 42,82 / 42,83 / 42,79, west 42,76 / 42,73,
// noord 42,87 / 42,79 / 42,79, oost 42,67 / 42,79 / 42,82 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 42.67;
const GROUND_SAMPLES = [[-16.2, -4.5], [-15.4, 0.4], [-12.5, -8], [-12.5, 7], [-7, 11.3], [7, 11.3], [9.4, 0], [10.2, -8], [10.2, -19], [-6.2, -19], [-6.2, -13.5], [-7, -11.3]];

// ---------- maten (meter boven z = 0, stelsel u/v) ----------
// Schip (zuid- en noordarm, BAG): u = -11,44 .. 7,64, v = -5,66 .. 5,59 (as v = -0,035, halve breedte 5,625).
// Dwarsarmen (BAG): u = -5,66 .. 5,64 (as u = -0,01, halve breedte 5,65), v = -9,86 .. 9,82.
const NS = { u0: -11.44, u1: 7.64, v0: -5.66, v1: 5.59 };
const EW = { u0: -5.66, u1: 5.64, v0: -9.86, v1: 9.82 };
const NS_AXIS = (NS.v0 + NS.v1) / 2, EW_AXIS = (EW.u0 + EW.u1) / 2;
// Beide zadeldaken: nok +13,95 (AHN-DSM NAP +15,35 .. 15,47 langs beide nokken; 3D BAG NAP +15,3 .. 15,5), helling 1,25
// (51,3 graden; 3D BAG-dakvlakken 1,244 .. 1,276, AHN-dwarsprofielen 1,27); goot +6,92 (3D BAG NAP +8,3 .. 8,4).
const RIDGE = 13.95, PITCH = 1.25;
const nsRoof = ridgeV(NS_AXIS, RIDGE, PITCH), ewRoof = ridgeU(EW_AXIS, RIDGE, PITCH);
const NS_EAVE = RIDGE - PITCH * (NS.v1 - NS.v0) / 2, EW_EAVE = RIDGE - PITCH * (EW.u1 - EW.u0) / 2;
// Topgevels: 0,5 m dik, deklijst 0,25 m boven het dakvlak.
const COPING = 0.25, GABLE_T = 0.5;
// Toren (BAG): u = -14,71 .. -11,06, v = -6,37 .. -2,72 (3,65 m in het vierkant), tegen de zuidgevel ten oosten van de as.
// Schacht tot +15,8 met een lijst, vier geveltopjes tot +18,35 (AHN NAP +19,6 .. 19,8 op de toren), leien hoekstukken,
// vierkante naaldspits tot +25,25 (AHN-top NAP +26,69); verhoudingen van de frontale foto (2023).
const TW = { u0: -14.71, u1: -11.06, v0: -6.37, v1: -2.72 };
const TC = [(TW.u0 + TW.u1) / 2, (TW.v0 + TW.v1) / 2], TH = (TW.u1 - TW.u0) / 2;
const SHAFT_TOP = 15.8, GABLE_TOP = 18.35, SPIRE_TOP = 25.25;
// Voorportaal (BAG): u = -13,88 .. -11,44, v = -2,72 .. 3,22 met de afgeschuinde westhoek; lessenaarsdak van 43 graden van
// +3,05 aan de voorkant (3D BAG NAP +4,5) tegen de gevel op; daarvoor de spitse portaalgevel met tympaan (top +5,0, foto 1989).
const PORCH = [[-13.86, -2.72], [-11.2, -2.72], [-11.2, 3.22], [-12.8, 3.22], [-13.86, 2.12]];
const PORCH_EAVE = 3.05, PORCH_T = 0.926;
const PORTAL_V = 0.3, PORTAL_HALF = 2.0, PORTAL_TOP = 5.0, PORTAL_T = 1.15;
// Portaaltjes in de oksels van schip en dwarsarmen (BAG): lessenaarsdak van 40 graden van +5,05 tegen de gevel naar +3,35.
const SE_PORCH = { u0: -8.61, u1: -5.66, v0: -7.65, v1: NS.v0 + 0.2 };
const SW_PORCH = { u0: -8.59, u1: -5.66, v0: NS.v1 - 0.2, v1: 7.58 };
const SIDE_T = 0.84;
// Kerklokalen (BAG; 3D BAG en AHN): L-vormig onder schilddaken van 32 graden met nok +5,9 (AHN NAP +7,35), goot +4,08:
// vleugel langs de oostkant u = -4,68 .. 8,70, v = -21,33 .. -15,55 (topgevel op het zuiden) en vleugel langs de noordkant
// u = 3,13 .. 8,70 tot de oostgevel van de dwarsarm (v = -9,86); hoek noordoost afgewolfd. Plat dak +3,05 (NAP +4,5) op
// u = -4,68 .. 3,13, v = -15,55 .. -12,79 en tussenlid met plat dak +2,85 (NAP +4,3) in de oksel noordoost.
const AN_RIDGE = 5.9, AN_T = 0.63;
const WING_T = { u0: -4.68, u1: 8.7, v0: -21.33, v1: -15.55 };
const WING_B = { u0: 3.13, u1: 8.7, v0: -21.33, v1: EW.v0 + 0.2 };
const FLAT = { u0: -4.68, u1: 3.13, v0: -15.55, v1: -12.79, top: 3.05 };
const LINK = [[5.4, -9.86], [8.64, -9.86], [8.64, -6.73], [7.64, -6.73], [7.64, -5.4], [5.4, -5.4]];
const LINK_TOP = 2.85;

const solids = [];
// ---------- schip en dwarsarmen: twee zadeldaken die elkaar kruisen (kilgoten in de oksels) ----------
const nsPoly = rect(NS.u0, NS.u1, NS.v0, NS.v1), ewPoly = rect(EW.u0, EW.u1, EW.v0, EW.v1);
solids.push(roofed(nsPoly, nsRoof), roofed(ewPoly, ewRoof));
// Topgevels met deklijst.
const lift = (planes, d) => planes.map(([a, b, c]) => [a, b, c + d]);
solids.push(roofed(rect(NS.u0, NS.u0 + GABLE_T, NS.v0, NS.v1), lift(nsRoof, COPING)));
solids.push(roofed(rect(NS.u1 - GABLE_T, NS.u1, NS.v0, NS.v1), lift(nsRoof, COPING)));
solids.push(roofed(rect(EW.u0, EW.u1, EW.v0, EW.v0 + GABLE_T), lift(ewRoof, COPING)));
solids.push(roofed(rect(EW.u0, EW.u1, EW.v1 - GABLE_T, EW.v1), lift(ewRoof, COPING)));
// Gootkragen langs alle zijgevels, tot de topgevels en 0,3 m voorbij de oksels (daar verdwijnen ze in de andere arm).
const IN = 0.3;
solids.push(eaveCornice([NS.u0, NS.v1], [EW.u0 + IN, NS.v1], [0, 1], NS_EAVE, nsRoof));
solids.push(eaveCornice([NS.u0, NS.v0], [EW.u0 + IN, NS.v0], [0, -1], NS_EAVE, nsRoof));
solids.push(eaveCornice([EW.u1 - IN, NS.v1], [NS.u1, NS.v1], [0, 1], NS_EAVE, nsRoof));
solids.push(eaveCornice([EW.u1 - IN, NS.v0], [NS.u1, NS.v0], [0, -1], NS_EAVE, nsRoof));
solids.push(eaveCornice([EW.u0, NS.v1 - IN], [EW.u0, EW.v1], [-1, 0], EW_EAVE, ewRoof));
solids.push(eaveCornice([EW.u1, NS.v1 - IN], [EW.u1, EW.v1], [1, 0], EW_EAVE, ewRoof));
solids.push(eaveCornice([EW.u0, NS.v0 + IN], [EW.u0, EW.v0], [-1, 0], EW_EAVE, ewRoof));
solids.push(eaveCornice([EW.u1, NS.v0 + IN], [EW.u1, EW.v0], [1, 0], EW_EAVE, ewRoof));

// ---------- toren ----------
solids.push(prism(rect(TW.u0, TW.u1, TW.v0, TW.v1), BASE, SHAFT_TOP));
// Lijst onder de geveltopjes: 0,15 m uitkragend met een onderkant van 45 graden.
solids.push(loft([[SHAFT_TOP - 0.47, sq(TC, TH)], [SHAFT_TOP - 0.3, sq(TC, TH + 0.15)], [SHAFT_TOP, sq(TC, TH + 0.15)]]));
// Vier geveltopjes: twee zadeldakjes in kruis met de toppen op +18,35.
const TT = (GABLE_TOP - SHAFT_TOP) / TH;
const towerSq = rect(TW.u0, TW.u1, TW.v0, TW.v1);
solids.push(roofed(towerSq, ridgeU(TC[0], GABLE_TOP, TT)).intersect(prism(towerSq, SHAFT_TOP - 0.5, 30)));
solids.push(roofed(towerSq, ridgeV(TC[1], GABLE_TOP, TT)).intersect(prism(towerSq, SHAFT_TOP - 0.5, 30)));
// Leien hoekstukken tussen de geveltopjes: 0,9 m in het vierkant tot +16,9 met een piramidekapje tot +17,5.
for (const su of [-1, 1]) for (const sv of [-1, 1]) {
  const c = [TC[0] + su * (TH - 0.45), TC[1] + sv * (TH - 0.45)];
  solids.push(loft([[SHAFT_TOP - 0.1, sq(c, 0.45)], [16.9, sq(c, 0.45)], [17.5, tip(c)]]));
}
// Vierkante naaldspits: 2,5 m aan de voet, 2,2 m op de geveltoppen, 1,1 m op +22,75 (foto), punt +25,25.
solids.push(loft([[16.4, sq(TC, 1.25)], [GABLE_TOP, sq(TC, 1.1)], [22.75, sq(TC, 0.55)], [SPIRE_TOP, tip(TC)]]));

// ---------- voorportaal met spitse portaalgevel ----------
const porchRoof = [[PORCH_T, 0, PORCH_EAVE - PORCH_T * PORCH[0][0]]];
solids.push(roofed(PORCH, porchRoof));
const portalPoly = rect(-13.88, -11.9, PORTAL_V - PORTAL_HALF, PORTAL_V + PORTAL_HALF);
const portalRoof = ridgeV(PORTAL_V, PORTAL_TOP, PORTAL_T);
solids.push(roofed(portalPoly, portalRoof));
solids.push(roofed(rect(-13.88, -13.5, PORTAL_V - PORTAL_HALF, PORTAL_V + PORTAL_HALF), lift(portalRoof, 0.2)));
// ---------- portaaltjes in de oksels ----------
solids.push(roofed(rect(SE_PORCH.u0, SE_PORCH.u1, SE_PORCH.v0, SE_PORCH.v1), [[0, SIDE_T, 5.05 - SIDE_T * NS.v0]]));
solids.push(roofed(rect(SW_PORCH.u0, SW_PORCH.u1, SW_PORCH.v0, SW_PORCH.v1), [[0, -SIDE_T, 5.15 + SIDE_T * NS.v1]]));

// ---------- kerklokalen ----------
const AN_EAVE = AN_RIDGE - AN_T * (WING_T.v1 - WING_T.v0) / 2;
const wingTRoof = [
  ...ridgeV((WING_T.v0 + WING_T.v1) / 2, AN_RIDGE, AN_T),
  [-AN_T, 0, AN_EAVE + AN_T * WING_T.u1],
];
const wingBRoof = [
  ...ridgeU((WING_B.u0 + WING_B.u1) / 2, AN_RIDGE, AN_T),
  [0, AN_T, AN_EAVE + AN_T * -WING_B.v0],
];
solids.push(roofed(rect(WING_T.u0, WING_T.u1, WING_T.v0, WING_T.v1), wingTRoof));
solids.push(roofed(rect(WING_B.u0, WING_B.u1, WING_B.v0, WING_B.v1), wingBRoof));
solids.push(prism(rect(FLAT.u0, FLAT.u1 + 0.2, FLAT.v0 - 0.2, FLAT.v1), BASE, FLAT.top));
solids.push(prism(LINK, BASE, LINK_TOP));

// ---------- plint rondom (0,12 m buiten de gevels tot +0,8) ----------
const plan = [nsPoly, ewPoly, rect(TW.u0, TW.u1, TW.v0, TW.v1), PORCH, rect(-13.88, -11.9, PORTAL_V - PORTAL_HALF, PORTAL_V + PORTAL_HALF),
  rect(SE_PORCH.u0, SE_PORCH.u1, SE_PORCH.v0, SE_PORCH.v1), rect(SW_PORCH.u0, SW_PORCH.u1, SW_PORCH.v0, SW_PORCH.v1),
  rect(WING_T.u0, WING_T.u1, WING_T.v0, WING_T.v1), rect(WING_B.u0, WING_B.u1, WING_B.v0, WING_B.v1),
  rect(FLAT.u0, FLAT.u1 + 0.2, FLAT.v0 - 0.2, FLAT.v1), LINK]
  .map((p) => new CrossSection([ccw(p)]))
  .reduce((a, b) => a.add(b));
solids.push(Manifold.extrude(plan.offset(0.12, "Miter", 2), 0.8 - BASE).translate([0, 0, BASE]));

// ---------- nissen: vensters, deuren, roosvenster en galmgaten ----------
const cuts = [];
const O0 = [0, 0];
// Zuidgevel: roosvenster (3,6 m) boven het voorportaal (foto 2023: middelpunt +8,2).
cuts.push(roundNiche(O0, 180, -NS.u0, -NS_AXIS, 8.2, 1.8, 0.3));
// Portaalgevel: dubbele deur en het driehoekige tympaan met glas-in-lood erboven.
cuts.push(rectNiche(O0, 180, 13.88, -PORTAL_V, 1.8, 0.15, 2.3, 0.35));
cuts.push(niche(O0, 180, 13.88, -PORTAL_V, 1.5, 2.5, 2.5, 0.3));
// Toren: deur, twee rijen vensterspleten, venstertje, op elke zijde twee galmgaten.
cuts.push(rectNiche(TC, 180, TH, 0, 1.2, 0.2, 2.6, 0.4));
for (const s of [-0.5, 0.5]) cuts.push(rectNiche(TC, 180, TH, s, 0.3, 5.2, 10.0, 0.3));
cuts.push(rectNiche(TC, 180, TH, 0, 0.4, 11.9, 12.8, 0.3));
for (const ang of [0, 90, 180, 270]) for (const s of [-0.5, 0.5]) cuts.push(rectNiche(TC, ang, TH, s, 0.55, 13.3, 14.6, 0.3));
// Topgevels noord, west en oost: vierdelig venster in de top, vier vensters eronder.
const gableWindows = (angle, a) => {
  for (const s of [-1.2, -0.4, 0.4, 1.2]) cuts.push(niche(O0, angle, a, s, 0.55, 7.6, 10.4, 0.3));
  for (const s of [-2.6, -0.9, 0.9, 2.6]) cuts.push(niche(O0, angle, a, s, 0.7, 3.0, 4.8, 0.3));
};
gableWindows(0, NS.u1);
gableWindows(90, EW.v1);
gableWindows(270, -EW.v0);
// Zijgevels: driedelige vensters.
const triple = (angle, a, s0, z0 = 3.2, z1 = 5.8) => { for (const ds of [-0.7, 0, 0.7]) cuts.push(niche(O0, angle, a, s0 + ds, 0.5, z0, z1, 0.3)); };
triple(90, NS.v1, 10.0);          // schip, westgevel (u = -10)
triple(270, -NS.v0, -9.8);        // schip, oostgevel (u = -9,8)
triple(0, EW.u1, 7.7);            // westarm, noordgevel (v = 7,7)
triple(180, -EW.u0, -8.7);        // westarm, zuidgevel boven het portaaltje (v = 8,7)
triple(180, -EW.u0, 8.75);        // oostarm, zuidgevel (v = -8,75)
triple(0, EW.u1, -7.8, 3.4, 5.9); // oostarm, noordgevel boven het tussenlid (v = -7,8)
cuts.push(niche(O0, 90, NS.v1, -6.64, 0.6, 3.2, 5.8, 0.3)); // noordarm, westgevel
// Portaaltjes: deur in de zuidgevel.
cuts.push(rectNiche(O0, 180, -SE_PORCH.u0, 6.65, 1.0, 0, 2.2, 0.35));
cuts.push(rectNiche(O0, 180, -SW_PORCH.u0, -6.6, 1.0, 0, 2.2, 0.35));
// Kerklokalen: vensters in de oost- en noordgevel, deur en venster in het zuiden.
for (const u of [-2.6, 0.4, 3.4, 6.4]) cuts.push(rectNiche(O0, 270, -WING_T.v0, u, 1.3, 0.9, 2.7, 0.35));
for (const v of [-11.8, -14.6, -17.4]) cuts.push(rectNiche(O0, 0, WING_B.u1, v, 1.3, 0.9, 2.7, 0.35));
cuts.push(rectNiche(O0, 180, -WING_T.u0, 18.4, 1.0, 0, 2.2, 0.35));
cuts.push(rectNiche(O0, 180, -FLAT.u0, 14.2, 1.3, 0.9, 2.4, 0.35));
cuts.push(rectNiche(O0, 0, 8.64, -8.3, 1.0, 0, 2.2, 0.35));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Gereformeerde Kerk Bitgummole",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0083100000002267"],
  plate: false,
  description:
    "Gereformeerde Kerk aan de J.H. van Aismawei in Bitgummole (Beetgumermolen): kruiskerk uit 1924-1925 van A. Nauta in de trant van de Amsterdamse School, vier armen onder twee kruisende zadeldaken van 51 graden (nok +13,95 m) met tuitgevels, roosvenster in de zuidgevel en vensterreeksen in de andere topgevels, voorportaal met spitse portaalgevel en lessenaarsdak, portaaltjes in de oksels, de vierkante toren met vier geveltopjes, leien hoekstukken en naaldspits tot +25,25 m, en de lage kerklokalen onder schilddaken aan de oostkant. Oorsprong RD (176188,73; 583285,51) op de kruising van de nokken op het laagste maaiveld (NAP +1,46 m), X-as langs de nok van het schip naar de achtergevel onder 77,9 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "1924-1925 (A. Nauta, Leeuwarden), dak later met golfplaten gedekt; kerklokalen aan de oostkant (niet beschermd)",
    monument: 508683,
    groundNapM: 1.46,
    ridgeM: RIDGE,
    eaveM: +NS_EAVE.toFixed(2),
    roofPitchDeg: +((Math.atan(PITCH) * 180) / Math.PI).toFixed(1),
    towerShaftM: SHAFT_TOP,
    towerGablesM: GABLE_TOP,
    spireTopM: SPIRE_TOP,
    annexRidgeM: AN_RIDGE,
    baseM: BASE,
  },
  sources: [
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/508683",
    "https://www.wikidata.org/wiki/Q7478040",
    "https://www.openstreetmap.org/way/302818711",
    "Wikimedia Commons (Bitgummole, Grifformearde tsjerke; 2023 Bitgummole, griff. tsjerke (PKN); 2023 Bitgummole, tsjerke en pastorij; 2023 Bitgummole, grifformearde tsjerke (PKN); RCE-signaturen 54186, 54188, 54189, 54192, 54198, 54199)",
    "BAG pand 0083100000002267 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

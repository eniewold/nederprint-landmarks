// Domkerk Utrecht (koor en transept) uit dakvlakken en bouwdelen; zie README voor bronnen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "domkerk-utrecht");
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

const SLUG = "domkerk-utrecht";
const BASE = -0.4;
// Stelsel: oorsprong op het hart van de viering (kruising van de nokken van koor en transept), op het
// laagste maaiveld rond de kerk (Achter de Dom, NAP +5,22 m); +u langs de koornok naar het oosten (RD-richting
// 18,5 graden, dezelfde as als de Domtoren, die 65,7 m westelijker op deze as staat), +v naar het noorden.
// Hoofdas gemeten aan de nokken in het AHN-DSM (koornok 0,00 graden, transeptnok -0,36 graden afwijking).
const ORIGIN = [136839.79, 455875.78];
const AXIS_DEG = 18.5;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 5.22;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: Domplein west 49,72, noordwest 49,35,
// zuidwest 49,11, Domplein noord 49,15 en 49,27, Achter de Dom oost 48,69, noordoost 48,78, zuidoost 48,67,
// 48,79, pandhofzijde 49,04 (PDOK-terreintegels, november 2026). Het Domplein ligt 0,9 m hoger dan Achter de Dom.
const GROUND_ELLIPSOID = 48.67;
const GROUND_SAMPLES = [[-13, 0], [-14, 12], [-23, -18], [12, 28], [0, 29], [48, 0], [40, 16], [47, -10], [38, -20], [-4, -33]];
const N = (nap) => +(nap - GROUND_NAP).toFixed(3); // NAP-hoogte (AHN) naar modelhoogte

// ---------- maten (NAP uit AHN-DSM 0,5 m en 3D BAG, plan uit BAG en DSM) ----------
// Transept: nok NAP +47,5 langs v op u = 0, dakhelling 1,48; goot/galerij +38,8; westgevel op u = -8,6 (DSM),
// oostgevel op u = 6,5; kopgevels op v = 24,5 en -25,0 met topgevel tot +48,8 en kruisbloem tot +50,6.
const TW = -8.6, TE = 6.5, TN = 24.5, TS = -25.0;
const RIDGE = N(47.5), EAVE = N(38.8), T_PITCH = 1.48;
// Koor: nok +47,5 langs u op v = 0, helling 1,58; lichtbeukmuren op v = +-6,3; sluiting 5/10 rond (30,5; 0) met R 6,3.
const CV = 6.3, C_PITCH = 1.58;
const AC = [30.5, 0], AR = 6.3;
// Kooromgang en kapellenkrans: buitenmuur 5/10 met R 13,3 rond hetzelfde hart, lessenaarsdak +26,5 tot +23,0.
const RA = 13.3;
// Zijbeuken: lessenaarsdaken van +27,3 tegen de lichtbeuk naar +23,0 (zuid, v = -15,5) en +23,1 (noord, v = 13,5).
const SV = -15.5, NV = 13.5;
// Traveeën van het koor: steunberen met pinakels (DSM-pieken) op u = 7,7 / 13,0 / 19,1 / 25,3.
const PIERS = [7.7, 13.0, 19.1, 25.3];
const BAYS = [10.35, 16.05, 22.2, 27.9];
// Transept: drie traveeën per arm (pinakels op v = 6,3 / 12,4 / 18,4).
const T_BAYS = [9.35, 15.4, 21.45];
const T_PIERS = [6.3, 12.37, 18.43];

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
const deg = Math.PI / 180;
const polar = (c, r, th) => [c[0] + r * Math.cos(th * deg), c[1] + r * Math.sin(th * deg)];
// Rand van een 5/10-sluiting: zes hoekpunten van -90 tot 90 graden.
const closure = (c, r) => [-90, -54, -18, 18, 54, 90].map((th) => polar(c, r, th));
// Pinakel op een muurkop: vierkante schacht (breedte 0,9 m) met piramide.
const pin = (c, z0, shaft = 1.5, point = 2.0, half = 0.45) => pinnacle(c, half, z0, shaft, point);
// Wimberg: driehoekige topgevel (0,9 m dik) boven een venster, als plaat in de gevel langs u (along = "u")
// of langs v; breedte w, top op zTop.
const wimberg = ([cu, cv], along, w, z0, zTop, t0, t1) => {
  const slope = (zTop - z0) / (w / 2);
  return along === "u"
    ? roofed(R(cu - w / 2, cu + w / 2, t0, t1), ridgeU(cu, zTop, slope))
    : roofed(R(t0, t1, cv - w / 2, cv + w / 2), ridgeV(cv, zTop, slope));
};
// Vrije luchtboog als dichte schoor van 0,9 m (geen open boog): in een verticaal vlak door p0 (binnen, top z0)
// en p1 (buiten, top z1), onderkant zb verborgen in het lagere dak.
const flyer = ([u0, v0], [u1, v1], z0, z1, zb, t = 0.9) => {
  const len = Math.hypot(u1 - u0, v1 - v0);
  const ang = Math.atan2(v1 - v0, u1 - u0) / deg;
  return Manifold.extrude(new CrossSection([ccw([[0, zb], [len, zb], [len, z1], [0, z0]])]), t)
    .rotate([90, 0, 0])
    .translate([0, t / 2, 0])
    .rotate([0, 0, ang])
    .translate([u0, v0, 0]);
};
// Steunbeer in plan langs de richting 'ang' (graden) vanaf punt p: van r0 tot r1 buiten de muur, breedte w,
// bovenkant van zIn (tegen de muur) naar zOut (buitenkant).
const pier = ([u, v], ang, r0, r1, w, zIn, zOut) =>
  Manifold.extrude(new CrossSection([ccw([[r0, BASE], [r1, BASE], [r1, zOut], [r0, zIn]])]), w)
    .rotate([90, 0, 0])
    .translate([0, w / 2, 0])
    .rotate([0, 0, ang])
    .translate([u, v, 0]);

// ---------- transept ----------
solids.push(prism(R(TW, TE, TS, TN), BASE, EAVE));
solids.push(roofed(R(TW, TE, TS + 1.2, TN - 1.2), ridgeU(0, RIDGE, T_PITCH)));
// Westzijde: vlak dakterras (+40,9) achter de galerij, tussen u = -7,7 en het dakvlak (DSM, beide armen).
solids.push(prism(R(TW + 0.9, -4.3, TS + 1.2, TN - 1.2), BASE, N(40.9)));
// Kopgevels: topgevel 1,2 m boven het dakvlak, kruisbloem op de top.
for (const [v0, v1] of [[TN - 1.2, TN], [TS, TS + 1.2]]) {
  solids.push(roofed(R(TW, TE, v0, v1), ridgeU(0, N(48.8), T_PITCH)));
  solids.push(pin([0, (v0 + v1) / 2], N(47.9), 0.9, 1.8));
}
// Vier hoektorentjes (traptorens) op de hoeken van de kopgevels, met achtkante spits (DSM +42 tot +45).
for (const c of [[-7.4, 24.6], [6.5, 25.0], [-5.4, -26.0], [6.4, -26.0]]) {
  solids.push(loft([[BASE, oct(c, 2.8)], [N(41.0), oct(c, 2.8)], [N(45.5), tip(c)]]));
}
// Pinakels op de goten van het transept, op de traveegrenzen.
for (const v of [-T_PIERS[2], -T_PIERS[1], T_PIERS[1], T_PIERS[2]]) {
  solids.push(pin([TW + 0.45, v], EAVE));
  solids.push(pin([TE - 0.45, v], EAVE));
}
for (const v of [-CV, CV]) solids.push(pin([TW + 0.45, v], EAVE));
// Wimbergen boven de lichtbeukvensters van het transept (west en oost).
for (const s of [-1, 1]) for (const vb of T_BAYS) {
  solids.push(wimberg([0, s * vb], "v", 3.6, EAVE - 0.5, EAVE + 2.4, TW, TW + 0.9));
  solids.push(wimberg([0, s * vb], "v", 3.6, EAVE - 0.5, EAVE + 2.4, TE - 0.9, TE));
}

// ---------- koor met 5/10-sluiting en lichtbeuk ----------
const apse = closure(AC, AR);
const choirPlan = [[TW, -CV], ...apse, [TW, CV]];
solids.push(prism(choirPlan, BASE, EAVE));
const apseFacets = [];
for (let i = 0; i < 5; i++) apseFacets.push(facet(apse[i], apse[i + 1], RIDGE - C_PITCH * CV, C_PITCH, AC));
// Het dakvlak ligt tegen de muurkant 0,8 m onder de goot; de vlakke galerij (+38,8) loopt erlangs.
solids.push(roofed(choirPlan, [...ridgeV(0, RIDGE, C_PITCH), ...apseFacets]));
// Pinakels op de lichtbeuk bij elke steunbeer en op de hoeken van de sluiting; wimbergen boven de vensters.
for (const u of PIERS.slice(1)) for (const s of [-1, 1]) solids.push(pin([u, s * (CV - 0.45)], EAVE));
for (const p of apse) solids.push(pin(polar(AC, AR - 0.75, Math.atan2(p[1] - AC[1], p[0] - AC[0]) / deg), EAVE));
for (const u of BAYS) for (const s of [-1, 1]) solids.push(wimberg([u, 0], "u", 3.4, EAVE - 0.5, EAVE + 2.4, s * (CV - 0.9), s * CV));

// ---------- zijbeuken, kooromgang en kapellenkrans ----------
solids.push(roofed(R(TE - 0.2, 32.5, SV, -CV + 0.2), [[0, 0.47, N(27.3) + 0.47 * CV]]));
solids.push(roofed(R(TE - 0.2, 31.0, CV - 0.2, NV), [[0, -0.58, N(27.3) + 0.58 * CV]]));
const ring = closure(AC, RA);
const ambulatory = [[28.5, -RA], ...ring, [28.5, RA]];
const ringFacets = [];
for (let i = 0; i < 5; i++) ringFacets.push(facet(ring[i], ring[i + 1], N(23.0), 0.53, AC));
solids.push(roofed(ambulatory, ringFacets));
// Steunberen van de zijbeuken met pinakels en luchtbogen (als dichte schoren) naar de lichtbeuk.
for (const u of PIERS) {
  solids.push(pier([u, SV], -90, -2.5, 1.6, 1.4, N(29.5), N(27.5)));
  solids.push(pier([u, NV], 90, -0.5, 1.6, 1.4, N(29.5), N(27.5)));
  solids.push(pin([u, SV + 1.5], N(28.0), 2.5, 4.0));
  solids.push(pin([u, NV + 0.6], N(28.0), 2.5, 4.0));
  if (u > 8) {
    solids.push(flyer([u, -CV + 0.3], [u, SV + 1.6], N(36.5), N(30.5), N(21)));
    solids.push(flyer([u, CV - 0.3], [u, NV + 0.3], N(36.5), N(30.5), N(21)));
  }
}
// Kooromgang: straalsgewijze steunberen met pinakels op de hoeken van de kapellenkrans en luchtbogen
// naar de hoeken van de sluiting.
for (const th of [-90, -54, -18, 18, 54, 90]) {
  const p = polar(AC, RA, th);
  solids.push(pier(p, th, -1.0, 2.0, 1.3, N(29.0), N(26.5)));
  solids.push(pin(polar(AC, RA + 0.4, th), N(27.0), 3.0, 4.0));
  solids.push(flyer(polar(AC, AR - 0.3, th), polar(AC, RA - 0.7, th), N(36.5), N(30.0), N(21)));
}

// ---------- aanbouwen in hetzelfde BAG-pand ----------
// Zuid: kapellen met plat dak (+23,3) tussen transept en kloostergang, met een steunbeer op de zuidgevel.
solids.push(prism(R(TE - 0.2, 16.3, -25.4, SV + 0.2), BASE, N(23.3)));
solids.push(pier([13.25, -25.4], -90, -0.2, 1.8, 1.3, N(20.0), N(18.0)));
// Noordvleugel van de kloostergang (+9,5) met de halfronde uitbouw en een lessenaar tegen de zijbeuk.
solids.push(prism(R(15.8, 25.4, -21.6, SV + 0.2), BASE, N(9.5)));
solids.push(prism(R(15.8, 23.4, -23.3, -21.5), BASE, N(9.5)));
solids.push(Manifold.cylinder(N(9.5) - BASE, 3.05, 3.05, 48).translate([20.35, -23.3, BASE]).intersect(prism(R(17.0, 23.7, -26.5, -23.25), BASE, 20)));
solids.push(roofed(R(15.8, 25.4, -18.2, SV + 0.2), [[0, 0.75, N(11.6) + 0.75 * -SV]]));
// Zuidoost: kapittelzaal onder een zadeldak langs v (nok +22,4 op u = 28,8), topgevel naar het zuiden.
solids.push(roofed(R(25.3, 32.3, -26.7, SV + 0.2), ridgeU(28.8, N(22.4), 1.45)));
for (const u of [25.3, 32.3]) solids.push(pier([u, -26.7], -90, -0.2, 0.8, 0.9, N(14.0), N(12.5)));
// Noord: lage platte aanbouw (+14,2) naast het transept en de gerfkamer (sacristie): een lage strook (+18,0)
// langs de zijbeuk en drie schilddaken (goot +17,8, top +21,4) met de toppen op de DSM-nokken u = 16 / 22,5 / 29,5.
solids.push(prism(R(TE - 0.2, 12.7, NV - 0.2, 24.2), BASE, N(14.2)));
solids.push(prism(R(12.7, 33.6, NV - 0.2, 16.6), BASE, N(18.0)));
for (const [u0, u1] of [[12.7, 19.3], [19.3, 25.8], [25.8, 33.6]]) {
  const rr = R(u0, u1, 16.5, 23.6);
  solids.push(roofed(rr, [...ridgeU((u0 + u1) / 2, N(17.8) + 1.1 * (u1 - u0) / 2, 1.1), [0, 1.1, N(17.8) - 1.1 * 16.5], [0, -1.1, N(17.8) + 1.1 * 23.6]]));
}
// Zuidwest aan het Domplein: twee kapellen onder schilddaken, de westelijke lager (3D BAG nokken +25,1 en +26,8).
const hip = (u0, u1, v0, v1, eave, t) => roofed(R(u0, u1, v0, v1), [...ridgeU((u0 + u1) / 2, eave + t * (u1 - u0) / 2, t), [0, t, eave - t * v0], [0, -t, eave + t * v1]]);
solids.push(hip(-19.3, -15.7, -24.1, -12.7, N(22.8), 1.2));
solids.push(hip(-15.9, TW + 0.2, -24.1, -12.7, N(22.8), 1.15));
// Eerste travee van de westvleugel van de kloostergang tegen de zuidgevel, met lessenaarsdak (+16,5 tot +12,5).
solids.push(roofed(R(-2.7, 3.0, -30.2, TS + 0.2), [[-0.7, 0, N(16.5) - 0.7 * 2.7]]));
// Plint van 1,0 m rond het hoofdgebouw.
const plan = CrossSection.union([
  new CrossSection([ccw(R(TW, TE, TS, TN))]),
  new CrossSection([ccw(choirPlan)]),
  new CrossSection([ccw(ambulatory)]),
  new CrossSection([ccw(R(TE, 32.5, SV, NV))]),
]);
solids.push(Manifold.extrude(plan.offset(0.15, "Miter"), 1.0 - BASE).translate([0, 0, BASE]));

// ---------- vensters en portalen (blinde nissen met spitse bovenkant) ----------
// Transept: grote lichtbeukvensters west en oost, op de westgevel daaronder blinde bogen.
for (const s of [-1, 1]) for (const vb of T_BAYS) {
  cuts.push(niche([TW, s * vb], 180, 0, 0, 3.6, N(25.0), N(33.8), 0.5));
  if (s * vb > -12) cuts.push(niche([TW, s * vb], 180, 0, 0, 4.4, N(8.0), N(16.5), 1.0));
  cuts.push(niche([TE, s * vb], 0, 0, 0, 3.6, N(28.2), N(33.8), 0.5));
}
// Kopgevels: groot venster en portaal.
cuts.push(niche([0, TN], 90, 0, 0, 7.0, N(14.0), N(33.0), 0.6));
cuts.push(niche([0, TN], 90, 0, 0, 3.2, 0.9, N(10.0), 0.8));
// Zuidgevel: het portaal ligt achter de kloostergang; het venster begint boven het lessenaarsdak.
cuts.push(niche([0, TS], 270, 0, 0, 7.0, N(17.5), N(33.0), 0.6));
// Vieringsmuur aan het Domplein: dichtgemetselde boog (met het glaskunstwerk) en de ingang.
cuts.push(niche([TW, 0], 180, 0, 0, 9.6, N(7.0), N(26.0), 0.6));
cuts.push(niche([TW, 0], 180, 0, 0, 3.0, 0.95, N(10.0), 1.2));
// Koor: lichtbeukvensters in de rechte traveeën en in de vijf zijden van de sluiting.
for (const u of BAYS) for (const [v, ang] of [[-CV, 270], [CV, 90]]) cuts.push(niche([u, v], ang, 0, 0, 3.4, N(28.2), N(34.6), 0.5));
for (let i = 0; i < 5; i++) {
  const th = -72 + 36 * i;
  cuts.push(niche(polar(AC, AR * Math.cos(18 * deg), th), th, 0, 0, 2.8, N(28.2), N(34.6), 0.5));
  cuts.push(niche(polar(AC, RA * Math.cos(18 * deg), th), th, 0, 0, 3.0, N(9.0), N(18.5), 0.5));
}
// Zijbeuk zuid boven de kloostergang, zuidkapellen, kapittelzaal, gerfkamer en zuidwestkapellen.
cuts.push(niche([22.2, SV], 270, 0, 0, 3.0, N(12.0), N(19.5), 0.5));
for (const u of [9.6, 15.0]) cuts.push(niche([u, -25.4], 270, 0, 0, 3.0, N(9.0), N(18.0), 0.5));
cuts.push(niche([28.8, -26.7], 270, 0, 0, 2.6, N(9.0), N(16.0), 0.5));
for (const u of [16.0, 22.55, 29.7]) cuts.push(niche([u, 23.6], 90, 0, 0, 3.0, N(9.0), N(14.5), 0.5));
cuts.push(niche([9.6, 24.2], 90, 0, 0, 1.8, 0.9, N(9.5), 0.5));
for (const v of [-21.5, -15.5]) cuts.push(niche([-19.3, v], 180, 0, 0, 2.0, N(10.0), N(19.5), 0.4));
for (const u of [-17.6, -12.2]) cuts.push(niche([u, -12.7], 90, 0, 0, 2.0, N(10.0), N(19.5), 0.4));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Domkerk Utrecht",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0344100000069167", "0344100000046082"],
  plate: false,
  description:
    "Domkerk (Sint-Maartenskathedraal) aan het Domplein in Utrecht: het gotische koor (vanaf 1254, gereed circa 1320) en het transept (15e eeuw) zonder het in 1674 ingestorte schip. Transept met zadeldak (nok NAP +47,5), vieringsmuur met dichtgemetselde boog naar het Domplein, kopgevels met topgevel en vier hoektorentjes; koor met lichtbeuk, 5/10-sluiting, zijbeuken, kooromgang met kapellenkrans, steunberen met pinakels en luchtbogen als dichte schoren. Aanbouwen in BAG-pand 0344100000069167 (zuidkapellen, kapittelzaal, noordvleugel van de kloostergang, kapellen aan het Domplein) en de gerfkamer (BAG 0344100000046082, waarvan de PDOK-reconstructie de pinakels van de kerk meenam). Oorsprong RD (136839,79; 455875,78) op het hart van de viering op het laagste maaiveld (NAP +5,22 m), X-as langs de koornok onder 18,5 graden, dezelfde as als de Domtoren. Vensters als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "koor vanaf 1254 (gereed circa 1320), transept 15e eeuw, schip ingestort 1674",
    monument: 35973,
    groundNapM: GROUND_NAP,
    ridgeNapM: 47.5,
    eaveNapM: 38.8,
    gableFinialNapM: 50.6,
    ambulatoryNapM: [23.0, 26.5],
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Dom_van_Utrecht",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/35973",
    "https://www.openstreetmap.org/way/1159618262",
    "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000069167 (dakvlakken aanbouwen)",
    "BAG panden 0344100000069167 en 0344100000046082 (voetafdruk aanbouwen, steunberen)",
    "PDOK AHN dsm_05m/dtm_05m (nokken, goten, travee-pinakels, sluiting) en actuele luchtfoto",
    "https://commons.wikimedia.org/wiki/Category:Exterior_of_Utrecht_Dom_church (o.a. Domkerk 2024 gezien vanaf de Domtoren.jpg, Uitzicht vanaf de Domtoren.jpg, St Martin's Cathedral, Utrecht, buttresses as seen from SE.jpg, Utrecht Dom Sint Martin Chor 1 en 5, Querschiff 1 en 3, RCE 20232137 en 20231821)",
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

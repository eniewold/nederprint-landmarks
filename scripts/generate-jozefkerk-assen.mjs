import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "jozefkerk-assen");
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
// Rechthoekige paneelnis met een plafond van 45 graden (zie Almelo).
const recess = ([cx, cy], angle, a, s0, s1, z0, z1, d) =>
  Manifold.extrude(new CrossSection([ccw([[a - d, z0], [a + 1, z0], [a + 1, z1], [a, z1], [a - d, z1 - d - 0.05]])]), s1 - s0)
    .rotate([90, 0, 0])
    .translate([0, s1, 0])
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Ruitvormige nis (uurwerk) met plafonds van 50 graden.
const oculus = ([cx, cy], angle, a, s, z, r, d = 0.3) =>
  profileX([[s, z - 1.2 * r], [s + r, z], [s, z + 1.2 * r], [s - r, z]], a - d, a + 0.4)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);

const SLUG = "jozefkerk-assen";
const BASE = -0.4;
// Meetstelsel = modelstelsel: +u langs de lange gevels van west naar oost (RD-richting -1,7 graden, gemeten aan de
// evenwijdige BAG-gevels en de nok van het schilddak in het AHN-DSM), +v naar het noorden; -v is de voorgevel met het
// portiek aan het Kerkplein. Oorsprong in het midden van de zaal (BAG-gevels u -16,36..16,36 en v -9,63..9,63), op
// maaiveld NAP +10,6 m.
const AXIS_DEG = -1.7;
const ORIGIN = [233744.467, 556808.563];
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (modelstelsel): voor de trap 52,11, Kerkplein
// west 52,26 en oost 51,99, Collardslaan (west) 52,36 en 52,49, Kerkstraat (oost) 51,86 en 51,87, binnenplaats 52,40,
// voor de garage 51,91 en voor het voorhuis 51,82 (PDOK-terreintegels, november 2026). Het terrein loopt van west naar
// oost ongeveer 0,65 m af.
const GROUND_ELLIPSOID = 51.82;
const GROUND_SAMPLES = [[0, -16], [-11, -11.5], [11, -11.5], [-18, -6], [-18, 6], [18, -6], [18, 6], [-12, 11.5], [16.5, 11], [19.5, 18.5]];

// ---------- maten (meter boven maaiveld NAP +10,6) ----------
// Zaal (1845-1848, C.J. Spaan): rechthoek 32,7 x 19,3 m (BAG), schilddak met helling 0,47 (25 graden) aan alle vier
// zijden, goot +14,3 en nok +18,8 van u -6,7 tot 6,7 (3D BAG LoD2.2, gecontroleerd in het AHN-DSM: nok 18,8-19,0).
const HL = 16.36, HW = 9.63, EAVE = 14.3, PITCH = 0.47;
// Gevelopbouw (foto's RCE 20412936-20412940, geschaald op de goot): grijze plint tot +0,9, gepleisterde sokkel tot
// +3,1, bakstenen pilasters van 0,86 m (0,22 m uit de gevel, BAG), architraaf +10,1..10,9, tweede band +12,1..12,5,
// kroonlijst +13,7..14,45 met 0,8 m overstek.
const PLINTH = 3.1, PIL_W = 0.86, PIL_D = 0.22;
// Portiekrisaliet: 14,0 m breed, 3,57 m voor de gevel (BAG v -13,195), hoofdgestel tot +11,9 en fronton met helling
// 0,46 tot +15,26 (3D BAG), inspringend portiek met twee zuilen tussen de anten.
const RIS = { u: 7.0, v0: -13.195, ent0: 10.6, ent1: 11.9, pitch: 0.46 };
const RIS_APEX = RIS.ent1 + RIS.pitch * (RIS.u + 0.3);
// Houten toren (herbouwd 1911) achter het fronton: hart u 0, v -10,87 (AHN-DSM), onderbouw 4,4 m in het vierkant met
// kroonlijst tot +20,95, balustrade, uurwerkverdieping 3,1 m met frontonnetjes tot +26,25, open ronde lantaarn met
// koepel tot +30,0 (hoogste AHN-punt NAP +40,6) en windvaan.
const TC = [0, -10.87];
const T1 = 2.2, T1_TOP = 19.85, T_CORN = 20.95, BAL_TOP = 21.6, T2 = 1.55, T2_TOP = 24.75, GABLE_TOP = 26.25;
const LANT_R = 1.05, LANT_BASE = 25.6, LANT_TOP = 28.15, DOME_BASE = 28.62, DOME_TOP = 30.0, VANE_TOP = 31.6;
// Bijgebouw (consistorie) tegen de noordgevel: twee bouwlagen, schilddak met goot +7,2, nok +9,8, helling 0,65 (3D BAG).
const BIJ = { u0: -7.0, u1: 7.8, v1: 17.3, eave: 7.2, ridgeV: 13.2, ridge: 9.8, pitch: 0.65 };
// Lage garage/tussenbouw (+3,3, plat) met een schuine oostgevel langs de Kerkstraat (BAG).
const GARAGE = [[7.6, 9.4], [12.63, 9.4], [15.04, 15.72], [7.6, 15.9]];
// Voorhuis aan de Kerkstraat (deel van hetzelfde BAG-pand): goot +9,3, zadeldak met helling 0,8 en nok +11,7 dat aan
// de straat afgewolfd is (helling 1,2) en naar achteren op +10,9 plat afloopt (3D BAG).
const HUIS = [[3.5, 15.6], [17.86, 15.58], [18.14, 21.31], [3.6, 22.02]];
const HUIS_EAVE = 9.3, HUIS_PITCH = 0.8, HUIS_FLAT = 10.9, HUIS_SPLIT = 9.8;

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
const grow = (pts, d) => (d === 0 ? pts : new CrossSection([ccw(pts)]).offset(d, "Miter").toPolygons()[0]);
const HALL = R(-HL, HL, -HW, HW);
// Bouwdeel vanaf hoogte z0 tot aan de dakvlakken.
const roofedFrom = (pts, z0, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, z0, 100));
// Lijst rond een convexe plattegrond: onder een kraag van 47 graden vanaf de gevel, dan recht tot z1.
const ledge = (pts, z0, out, z1) => loft([[z0, pts], [z0 + out * 1.08, grow(pts, out)], [z1, grow(pts, out)]]);

// ---------- zaal: schilddak, lijsten, sokkel en pilasters ----------
const hip = [[-PITCH, 0, EAVE + PITCH * HL], [PITCH, 0, EAVE + PITCH * HL], [0, -PITCH, EAVE + PITCH * HW], [0, PITCH, EAVE + PITCH * HW]];
solids.push(roofed(HALL, hip));
solids.push(ledge(HALL, 12.9, 0.8, 14.45)); // kroonlijst
solids.push(ledge(HALL, 11.78, 0.3, 12.5)); // tweede band
solids.push(ledge(HALL, 9.75, 0.34, 10.9)); // architraaf boven de kapitelen
// Gepleisterde sokkel tot +3,1 met een afzaat, grijze plint tot +0,9.
solids.push(loft([[BASE, grow(HALL, PIL_D)], [PLINTH, grow(HALL, PIL_D)], [PLINTH + PIL_D * 1.1, HALL]]));
solids.push(loft([[BASE, grow(HALL, PIL_D + 0.1)], [0.9, grow(HALL, PIL_D + 0.1)], [1.01, grow(HALL, PIL_D)]]));
// Pilasters (BAG): voor- en achtergevel op u ±9,77 en ±12,85, zijgevels op v ±1,85 en ±5,55, hoekpilasters om de hoek.
const PIL_TOP = 12.95;
for (const u of [-12.85, -9.77, 9.77, 12.85]) for (const s of [-1, 1]) solids.push(prism(R(u - PIL_W / 2, u + PIL_W / 2, s * HW, s * (HW + PIL_D)), BASE, PIL_TOP));
for (const v of [-5.55, -1.85, 1.85, 5.55]) for (const s of [-1, 1]) solids.push(prism(R(s * HL, s * (HL + PIL_D), v - PIL_W / 2, v + PIL_W / 2), BASE, PIL_TOP));
for (const su of [-1, 1]) for (const sv of [-1, 1]) solids.push(prism(R(su * (HL - 0.8), su * (HL + PIL_D), sv * (HW - 0.82), sv * (HW + PIL_D)), BASE, PIL_TOP));
// Hoge rondboogvensters (als spitse blinde nissen): drie aan weerszijden van het portiek, drie in de westhelft en
// een in de oosthoek van de noordgevel, op de oostgevel de middelste drie en op de westgevel de tweede en vierde travee.
const WIN = (p, ang) => cuts.push(niche(p, ang, 0, 0, 1.6, 3.6, 8.6, 0.38));
for (const u of [-14.42, -11.31, -8.17, 8.17, 11.31, 14.42]) WIN([u, -HW], 270);
for (const u of [-14.42, -11.31, -8.17, 14.42]) WIN([u, HW], 90);
for (const v of [-3.7, 0, 3.7]) WIN([HL, v], 0);
for (const v of [-3.7, 3.7]) WIN([-HL, v], 180);

// ---------- portiekrisaliet met fronton ----------
const risPlan = R(-RIS.u, RIS.u, RIS.v0, -HW + 0.4);
solids.push(prism(risPlan, BASE, RIS.ent0));
solids.push(loft([[BASE, grow(risPlan, 0.1)], [0.9, grow(risPlan, 0.1)], [1.01, risPlan]]));
// Hoofdgestel met een kroonlijst onder het fronton (twee kragen van 47 graden).
solids.push(loft([[10.3, risPlan], [RIS.ent0, grow(risPlan, 0.28)], [11.6, grow(risPlan, 0.28)], [RIS.ent1, grow(risPlan, 0.56)]]));
// Fronton en zadeldak met de nok haaks op de gevel, tot in het schilddak.
const pedFront = RIS.v0 - 0.28;
solids.push(roofedFrom(R(-RIS.u - 0.3, RIS.u + 0.3, pedFront, -7.0), RIS.ent1 - 0.05, ridgeU(0, RIS_APEX, RIS.pitch)));
// Schuine kroonlijsten van het fronton: 0,3 m voor het timpaan, onderkant 48 graden.
for (const s of [-1, 1]) {
  const end = [s * (RIS.u + 0.56), RIS.ent1];
  const pts = [];
  for (const [u, z] of [end, [0, RIS_APEX]]) pts.push([u, pedFront, z - 0.8], [u, pedFront - 0.3, z - 0.5], [u, pedFront - 0.3, z + 0.06], [u, pedFront, z + 0.06]);
  solids.push(Manifold.hull(pts));
}
// Hoekpilasters (1,2 m) en anten naast het portiek (0,9 m) op het risaliet, 0,2 m uit de gevel.
for (const s of [-1, 1]) {
  solids.push(prism(R(s * (RIS.u - 1.2), s * RIS.u, RIS.v0 - 0.2, RIS.v0 + 0.1), BASE, 10.3));
  solids.push(prism(R(s * 3.3, s * 4.2, RIS.v0 - 0.2, RIS.v0 + 0.1), BASE, 10.3));
}
// Portiek: 6,5 m breed, 1,2 m diep, plafond schuin onder 46 graden naar de deuren; twee zuilen tussen de anten.
cuts.push(profileX([[RIS.v0 - 0.5, 1.1], [-12.0, 1.1], [-12.0, 4.0], [RIS.v0, 5.25], [RIS.v0 - 0.5, 5.25]], -3.25, 3.25));
for (const u of [-1.15, 1.15]) solids.push(Manifold.cylinder(4.4, 0.45, 0.45, 32).translate([u, -12.7, 1.0]));
// Drie deuren achter de zuilen, fries boven het portiek, venster met frontonnetje erboven.
for (const u of [-2.3, 0, 2.3]) cuts.push(recess([u, -12.0], 270, 0, -0.65, 0.65, 1.1, 3.5, 0.25));
solids.push(loft([[5.3, R(-3.6, 3.6, RIS.v0, RIS.v0 + 0.5)], [5.5, R(-3.6, 3.6, RIS.v0 - 0.18, RIS.v0 + 0.5)], [6.1, R(-3.6, 3.6, RIS.v0 - 0.18, RIS.v0 + 0.5)]]));
cuts.push(recess([0, RIS.v0], 270, 0, -0.95, 0.95, 6.6, 8.35, 0.3));
solids.push(Manifold.hull([[-1.3, RIS.v0, 8.4], [1.3, RIS.v0, 8.4], [-1.3, RIS.v0 - 0.25, 8.7], [1.3, RIS.v0 - 0.25, 8.7], [0, RIS.v0 - 0.25, 9.35], [0, RIS.v0, 9.35]]));
// Trap van vijf treden naar het portiek.
for (let k = 0; k < 5; k++) {
  const w = 5.4 - 0.25 * k;
  solids.push(prism(R(-w, w, RIS.v0 - 1.75 + 0.35 * k, RIS.v0 + 0.2), BASE, 0.25 + 0.17 * (k + 1)));
}
// Zijwanden van het risaliet: rondboogvenster en oculus.
for (const s of [-1, 1]) {
  cuts.push(niche([s * RIS.u, -11.45], s < 0 ? 180 : 0, 0, 0, 1.1, 3.6, 6.2, 0.35));
  cuts.push(oculus([s * RIS.u, -11.45], s < 0 ? 180 : 0, 0, 0, 8.4, 0.5, 0.3));
}

// ---------- houten toren met uurwerk en open lantaarn ----------
solids.push(prism(sq(TC, T1), 12.0, T1_TOP));
solids.push(loft([[T1_TOP - 0.01, sq(TC, T1)], [T1_TOP + 0.55, sq(TC, T1 + 0.5)], [T_CORN, sq(TC, T1 + 0.5)]]));
// Balustrade als dichte borstwering, daarop de uurwerkverdieping.
solids.push(prism(sq(TC, T1), T_CORN - 0.05, BAL_TOP));
solids.push(prism(sq(TC, T2), BAL_TOP - 0.05, T2_TOP));
solids.push(loft([[T2_TOP - 0.01, sq(TC, T2)], [T2_TOP + 0.25, sq(TC, T2 + 0.23)], [T2_TOP + 0.45, sq(TC, T2 + 0.23)]]));
// Frontonnetjes op alle vier zijden: twee gekruiste zadeldaken.
const gp = (GABLE_TOP - T2_TOP - 0.45) / (T2 + 0.23);
solids.push(roofedFrom(sq(TC, T2 + 0.23), T2_TOP + 0.4, ridgeU(TC[0], GABLE_TOP, gp)));
solids.push(roofedFrom(sq(TC, T2 + 0.23), T2_TOP + 0.4, ridgeV(TC[1], GABLE_TOP, gp)));
for (const [ang, p] of [[270, [TC[0], TC[1] - T1]], [90, [TC[0], TC[1] + T1]], [180, [TC[0] - T1, TC[1]]], [0, [TC[0] + T1, TC[1]]]]) {
  // Venster in de onderbouw.
  cuts.push(recess(p, ang, 0, -0.6, 0.6, 16.4, 18.1, 0.3));
}
for (const [ang, p] of [[270, [TC[0], TC[1] - T2]], [90, [TC[0], TC[1] + T2]], [180, [TC[0] - T2, TC[1]]], [0, [TC[0] + T2, TC[1]]]]) {
  // Galmgat met uurwerk in een rondboog.
  cuts.push(niche(p, ang, 0, 0, 1.3, 21.95, 23.5, 0.3));
}
// Ronde lantaarn: trommel met zes nissen tussen de zuiltjes, kroonlijst, koepel en windvaan.
solids.push(Manifold.cylinder(LANT_TOP - LANT_BASE, LANT_R, LANT_R, 48).translate([TC[0], TC[1], LANT_BASE]));
for (let k = 0; k < 6; k++) cuts.push(niche(TC, 30 + k * 60, LANT_R, 0, 0.6, 26.55, 27.25, 0.25));
solids.push(Manifold.hull([Manifold.cylinder(0.27, LANT_R, LANT_R + 0.25, 48).translate([TC[0], TC[1], LANT_TOP - 0.01]), Manifold.cylinder(DOME_BASE - LANT_TOP - 0.26, LANT_R + 0.25, LANT_R + 0.25, 48).translate([TC[0], TC[1], LANT_TOP + 0.25])]));
solids.push(Manifold.sphere(1, 48).trimByPlane([0, 0, 1], 0).scale([1.2, 1.2, DOME_TOP - DOME_BASE]).translate([TC[0], TC[1], DOME_BASE - 0.01]));
solids.push(Manifold.cylinder(VANE_TOP - DOME_TOP + 0.4, 0.45, 0, 24).translate([TC[0], TC[1], DOME_TOP - 0.4]));

// ---------- bijgebouw, garage en voorhuis aan de noordkant (hetzelfde BAG-pand) ----------
const bijPlan = R(BIJ.u0, BIJ.u1, HW - 0.4, BIJ.v1);
const bijRoof = [
  [BIJ.pitch, 0, BIJ.eave - BIJ.pitch * BIJ.u0],
  [-BIJ.pitch, 0, BIJ.eave + BIJ.pitch * BIJ.u1],
  [0, -BIJ.pitch, BIJ.eave + BIJ.pitch * BIJ.v1],
  [0, BIJ.pitch, BIJ.ridge - BIJ.pitch * BIJ.ridgeV],
];
solids.push(roofed(bijPlan, bijRoof));
solids.push(ledge(bijPlan, 5.3, 0.4, 7.2));
solids.push(loft([[BASE, grow(bijPlan, 0.08)], [0.6, grow(bijPlan, 0.08)], [0.7, bijPlan]]));
// Westgevel: drie vensters boven, twee vensters en de deur naast de kerk beneden; oostgevel boven de garage drie
// vensters; noordgevel twee.
for (const v of [10.8, 13.3, 15.8]) cuts.push(recess([BIJ.u0, v], 180, 0, -0.6, 0.6, 3.8, 5.0, 0.25));
for (const v of [13.3, 15.8]) cuts.push(recess([BIJ.u0, v], 180, 0, -0.6, 0.6, 1.0, 2.7, 0.25));
cuts.push(recess([BIJ.u0, 10.8], 180, 0, -0.8, 0.8, 0.0, 2.8, 0.3));
for (const v of [11.0, 12.9, 14.8]) cuts.push(recess([BIJ.u1, v], 0, 0, -0.55, 0.55, 3.8, 5.0, 0.25));
for (const u of [-4.5, -1.0]) cuts.push(recess([u, BIJ.v1], 90, 0, -0.6, 0.6, 3.8, 5.0, 0.25));
solids.push(prism(GARAGE, BASE, 3.3));
// Garagedeuren in de schuine oostgevel van de tussenbouw.
{
  const [a, b] = [GARAGE[1], GARAGE[2]];
  const ang = (Math.atan2(-(b[0] - a[0]), b[1] - a[1]) * 180) / Math.PI;
  for (const t of [0.32, 0.56, 0.8]) cuts.push(recess([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])], ang, 0, -0.7, 0.7, 0.0, 2.6, 0.25));
}
// Voorhuis: zadeldak, aan de straat afgewolfd, achter op +10,9 plat.
{
  const inside = [10, 18.6];
  const S = facet(HUIS[0], HUIS[1], HUIS_EAVE, HUIS_PITCH, inside);
  const N = facet(HUIS[3], HUIS[2], HUIS_EAVE, HUIS_PITCH, inside);
  const E = facet(HUIS[1], HUIS[2], HUIS_EAVE, 1.2, inside);
  const west = [HUIS[0], [HUIS_SPLIT, 15.59], [HUIS_SPLIT, 21.72], HUIS[3]];
  const east = [[HUIS_SPLIT - 0.01, 15.59], HUIS[1], HUIS[2], [HUIS_SPLIT - 0.01, 21.72]];
  solids.push(roofed(west, [S, N, [0, 0, HUIS_FLAT]]));
  solids.push(roofed(east, [S, N, E]));
  solids.push(ledge(HUIS, 8.2, 0.4, HUIS_EAVE));
  solids.push(loft([[BASE, grow(HUIS, 0.08)], [0.6, grow(HUIS, 0.08)], [0.7, HUIS]]));
  // Straatgevel: twee assen met hoge vensters op beide bouwlagen; zijgevel boven de garage drie vensters en een
  // venster naast de garage.
  const [a, b] = [HUIS[1], HUIS[2]];
  const ang = (Math.atan2(-(b[0] - a[0]), b[1] - a[1]) * 180) / Math.PI;
  for (const v of [17.4, 19.9]) {
    const t = (v - a[1]) / (b[1] - a[1]);
    const p = [a[0] + t * (b[0] - a[0]), v];
    cuts.push(niche(p, ang, 0, 0, 1.3, 1.4, 3.7, 0.3));
    cuts.push(niche(p, ang, 0, 0, 1.3, 5.4, 7.5, 0.3));
  }
  for (const u of [10.5, 13.0, 15.5]) cuts.push(niche([u, 15.59], 270, 0, 0, 0.9, 5.4, 7.6, 0.3));
  cuts.push(niche([16.6, 15.585], 270, 0, 0, 0.9, 1.4, 3.7, 0.3));
}

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Jozefkerk Assen",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0106100000000497"],
  plate: false,
  description:
    "Jozefkerk (tot 1964 Grote Kerk) aan het Kerkplein in Assen: neoclassicistische waterstaatskerk van C.J. Spaan (1845-1848), rechthoekige zaal onder een schilddak (nok +18,8 m) met bakstenen pilasters, gepleisterde sokkel, lijsten en hoge rondboogvensters, een gepleisterd middenrisaliet met fronton en inspringend zuilenportiek aan de zuidkant, daarachter de houten toren (1911) met uurwerk, frontonnetjes en open ronde lantaarn met koepel tot +30 m, en aan de noordkant het bijgebouw, de garage en het voorhuis aan de Kerkstraat die tot hetzelfde BAG-pand horen. Oorsprong RD (233744,47; 556808,56) in het midden van de zaal op maaiveld (NAP +10,6 m), X-as langs de lange gevels onder -1,7 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "1845-1848 (ingewijd 30 april 1848); toren na blikseminslag 1910 herbouwd in 1911; restauraties 1979-1982 en vanaf 2021",
    monument: 8411,
    architect: "C.J. Spaan (hoofdingenieur van de Waterstaat)",
    groundNapM: 10.6,
    eaveM: EAVE,
    ridgeM: +(EAVE + PITCH * HW).toFixed(2),
    pedimentApexM: +RIS_APEX.toFixed(2),
    domeTopM: DOME_TOP,
    vaneTopM: VANE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Jozefkerk_(Assen)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/8411",
    "https://commons.wikimedia.org/wiki/Category:Josephkerk,_Assen (RCE-foto's 20412934-20412954, tekeningen 1846 20026094; Jozefkerk-Assen-May-2024.jpg; Assen, de Jozefkerk RM8411 foto8)",
    "BAG pand 0106100000000497 (voetafdruk met pilasters) en 3D BAG LoD2.2 (dakvlakken)",
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
      if (steep < 12) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
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

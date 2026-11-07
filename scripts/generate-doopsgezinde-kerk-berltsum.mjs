import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "doopsgezinde-kerk-berltsum");
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

// Ronde nis (rondboog) met breedte w van z0 tot de aanzet z1 en daarboven een halve cirkel, in een gevel met de normaal
// naar 'angle' op afstand a van [cx, cy]; s schuift langs de gevel. Achterin ligt de boog 1,1 d lager, zodat het
// nisplafond steiler dan 45 graden naar binnen afloopt en niet overhangt.
const archNiche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.35) => {
  const r = w / 2, pts = [];
  const outline = (drop) => {
    const q = [[s - r, z0], [s + r, z0]];
    for (let k = 0; k <= 12; k++) {
      const t = (k * Math.PI) / 12;
      q.push([s + r * Math.cos(t), Math.max(z0, z1 - drop) + r * Math.sin(t)]);
    }
    return q;
  };
  for (const [x, drop] of [[a + 0.4, 0], [a, 0], [a - d, 1.1 * d]]) for (const [y, z] of outline(drop)) pts.push([x, y, z]);
  return Manifold.hull(pts).rotate([0, 0, angle]).translate([cx, cy, 0]);
};
// Lunet (halfrond venster) met straal r en aanzet op z1; achterin ook 1,1 d lager.
const lunette = ([cx, cy], angle, a, s, r, z1, d = 0.3) => {
  const pts = [];
  for (const [x, drop] of [[a + 0.4, 0], [a, 0], [a - d, 1.1 * d]]) {
    for (let k = 0; k <= 12; k++) {
      const t = (k * Math.PI) / 12;
      pts.push([x, s + r * Math.cos(t), z1 - drop + r * Math.sin(t)]);
    }
  }
  return Manifold.hull(pts).rotate([0, 0, angle]).translate([cx, cy, 0]);
};

// Doopsgezinde kerk (Berltsum), Vermaningsstrjitte 3: zaalkerk uit 1841 onder een steil schilddak met een driezijdige
// achterkant, de voorgevel op het westen aan de straat met kroonlijst en klassiek fries, een ingang met pilasters en een
// segmentboogvormige bekroning, twee vensters met lunetten erboven en een dakkapel met oculus en koepeltje op het voorschild.
// De kosterswoning is ingebouwd in het voorste deel (BAG-pand 0083100000000062, ook 1841); aan de noordkant een lage
// aanbouw met plat dak, achter de zaal een aanbouw met plat dak (BAG-pand 0083100000000052 samen met de zaal) en rechts
// (zuid) van de voorgevel de toegangspoort.
const SLUG = "doopsgezinde-kerk-berltsum";
const BASE = -0.4;
// Bouwstelsel (u, v): +u langs de nok van de voorgevel naar de achterkant (RD-richting 14,6 graden: de lange BAG-gevels
// van beide panden liggen op deze hoek binnen 0,1 graad recht), +v naar het noorden, oorsprong RD (172622,00; 584229,00).
// Het modelstelsel is hetzelfde, verschoven naar de nok (v = -1,015): oorsprong RD (172622,26; 584228,02), z = 0 op het
// laagste maaiveld rond de voet (NAP +3,70 m achter de kerk; voor de voorgevel NAP +3,85 m).
const AXIS_DEG = 14.6;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const VC = -1.015;
const ORIGIN = [172622.26, 584228.02];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: voor 45,05 / 45,02 / 45,07, zuid 45,06 / 45,02 /
// 45,01 / 44,96, achter 44,94 / 45,09, noordwest 45,12, poort 45,14 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 44.94;
const GROUND_SAMPLES = [[-11, -4], [-11, 0], [-11, 4], [-6, -5.6], [0, -5.6], [6, -5.6], [15, -4.8], [22, -3], [22, 3], [-9.5, 7.5], [-3, -7.8]];
const FRONT_LIFT = 0.15;

// ---------- maten (meter boven z = 0, bouwstelsel u/v) ----------
// Zaal met kosterswoning (BAG 062 + westdeel 052): u = -9,62 .. 7,6 recht, dan twee afgeschuinde hoeken naar de achtergevel
// op u = 9,55 (v = -3,7 .. 1,6); v = -5,78 .. 3,75. De BAG legt de achtergevel op u = 9,23, maar het AHN en de luchtfoto
// zien de dakrand tot u = 10,0: de achtergevel staat op 9,55 met 0,4 m kroonlijst.
const U_FRONT = -9.62, U_CH = 7.6, U_REAR = 9.55, V_S = -5.78, V_N = 3.75, V_RS = -3.7, V_RN = 1.6;
const HALL = [[U_FRONT, V_S], [U_CH, V_S], [U_REAR, V_RS], [U_REAR, V_RN], [U_CH, V_N], [U_FRONT, V_N]];
// Schilddak (AHN-DSM): nok NAP +15,59 (+11,89) op v = -1,015 van u = -5,28 tot 5,33; zijschilden helling 1,32
// (52,9 graden; dwarsprofielen u = -3 .. 3: 1,32 zuid en 1,33 noord), voorschild 1,45 (55 graden), achterschilden 1,49
// (56 graden); dakvoet op de gevellijn +5,6 (NAP +9,3).
const RIDGE = 11.89, EAVE = 5.6, V_RIDGE = VC;
const SP = (RIDGE - EAVE) / (V_RIDGE - V_S), FP = 1.45, RP = 1.49;
// Kroonlijst met fries: vanaf +4,7 aan de gevel 0,4 m uitkragend (48 graden), bovenkant in het verlengde van het dakvlak.
const CORNICE_Z = 4.7, CORNICE_OUT = 0.4;
// Lage aanbouw noord (BAG 062): u = -8,48 .. 1,67, v = 3,75 .. 6,89, plat dak +2,7 (AHN NAP +6,4).
const NORTH = [-8.48, 1.67, V_N, 6.89], NORTH_TOP = 2.7;
// Aanbouw achter (BAG 052 oostdeel): plat dak +4,3 (AHN NAP +8,0), met een lager deel aan de noordkant +3,55 (NAP +7,25).
const REAR_POLY = [[9.3, -3.47], [10.81, -4.76], [21.22, -4.92], [21.3, 2.47], [18.48, 2.51], [13.2, 2.58], [10.34, 2.59], [9.3, 1.63]];
const REAR_TOP = 4.3;
const REAR_LOW = [[13.2, 2.4], [18.48, 2.4], [18.51, 5.33], [13.22, 5.39]], REAR_LOW_TOP = 3.55;
// Toegangspoort zuid van de voorgevel (geen BAG-pand; luchtfoto en foto's): muur van 0,9 m dik op u = -8,45 .. -7,55
// tussen de kerk en het buurpand (v = -8,95 .. -5,78), tot +3,2 met een puntige deklijst tot +3,85.
const GATE = [-8.45, -7.55, -8.95, V_S], GATE_TOP = 3.2, GATE_PEAK = 3.85;
// Dakkapel op het voorschild (foto's): 1,2 m breed, voorkant op u = -8,6, tot +8,1 met een achtkant koepeltje tot +8,7.
const DORMER_U = -8.6, DORMER_HALF = 0.6, DORMER_TOP = 8.1, DOME_TOP = 8.7;

const solids = [];
const hallRoof = [
  [0, SP, RIDGE - SP * V_RIDGE],
  [0, -SP, RIDGE + SP * V_RIDGE],
  [FP, 0, EAVE - FP * U_FRONT],
  [-RP, 0, EAVE + RP * U_REAR],
];
const HALL_IN = [0, V_RIDGE];
hallRoof.push(facet([U_CH, V_S], [U_REAR, V_RS], EAVE, RP, HALL_IN));
hallRoof.push(facet([U_CH, V_N], [U_REAR, V_RN], EAVE, RP, HALL_IN));
// ---------- zaal met kosterswoning onder het schilddak ----------
solids.push(roofed(HALL, hallRoof));
// Kroonlijst rondom: 45 graden uitkragend, bovenkant in het verlengde van de dakvlakken.
const hallOff = new CrossSection([ccw(HALL)]).offset(CORNICE_OUT, "Miter", 2).toPolygons()[0];
const cornice = Manifold.hull([
  ...HALL.map(([u, v]) => [u, v, CORNICE_Z]),
  ...hallOff.flatMap(([u, v]) => [[u, v, CORNICE_Z + CORNICE_OUT + 0.05], [u, v, 20]]),
]);
solids.push(hallRoof.reduce((s, p) => cutBelow(s, p), cornice));
// Hoeklisenen van de voorgevel (0,6 m, 0,12 m uitspringend op beide gevels) tot onder de kroonlijst.
for (const [v0, v1] of [[V_S - 0.12, V_S + 0.6], [V_N - 0.6, V_N + 0.12]]) {
  solids.push(prism(rect(U_FRONT - 0.12, U_FRONT + 0.6, v0, v1), BASE, CORNICE_Z));
}
// Ingangspartij: pilasters 2,1 m breed, 0,16 m voor de gevel tot +3,45, met een segmentboogvormige bekroning tot +4,45
// die 0,3 m uitkraagt (onderkant 48 graden).
const DOOR_V = V_RIDGE, PORTAL_HALF = 1.05, PORTAL_TOP = FRONT_LIFT + 3.3;
solids.push(prism(rect(U_FRONT - 0.16, U_FRONT + 0.1, DOOR_V - PORTAL_HALF, DOOR_V + PORTAL_HALF), BASE, PORTAL_TOP));
const hoodPts = [];
for (const [du, dz] of [[0.1, 0], [0, 0], [-0.3, 0.33]]) {
  for (let k = 0; k <= 16; k++) {
    const t = (k * Math.PI) / 16;
    hoodPts.push([U_FRONT + du, DOOR_V + 1.2 * Math.cos(t), PORTAL_TOP + dz + 1.0 * Math.sin(t)]);
  }
}
solids.push(Manifold.hull(hoodPts));
// Dakkapel met koepeltje op het voorschild.
const DC = [DORMER_U + 0.6, V_RIDGE];
solids.push(prism(rect(DORMER_U, DORMER_U + 1.6, V_RIDGE - DORMER_HALF, V_RIDGE + DORMER_HALF), 6.0, DORMER_TOP));
solids.push(loft([[DORMER_TOP - 0.02, oct(DC, 1.2)], [DORMER_TOP + 0.2, oct(DC, 1.0)], [DOME_TOP, tip(DC)]]));
// ---------- lage aanbouw noord ----------
solids.push(prism(rect(NORTH[0], NORTH[1], NORTH[2] - 0.2, NORTH[3]), BASE, NORTH_TOP));
// ---------- aanbouw achter ----------
solids.push(prism(REAR_POLY, BASE, REAR_TOP));
solids.push(prism(REAR_LOW, BASE, REAR_LOW_TOP));
// ---------- toegangspoort ----------
const gateRect = rect(GATE[0], GATE[1], GATE[2], GATE[3] + 0.2);
const gateV = (GATE[2] + GATE[3]) / 2;
const gatePitch = (GATE_PEAK - GATE_TOP) / ((GATE[3] - GATE[2]) / 2);
solids.push(roofed(gateRect, ridgeV(gateV, GATE_PEAK, gatePitch)));
// ---------- plint rondom (0,12 m buiten de gevels tot +0,6) ----------
const plan = new CrossSection([ccw(HALL)])
  .add(new CrossSection([ccw(rect(NORTH[0], NORTH[1], NORTH[2] - 0.2, NORTH[3]))]))
  .add(new CrossSection([ccw(REAR_POLY)]))
  .add(new CrossSection([ccw(REAR_LOW)]));
solids.push(Manifold.extrude(plan.offset(0.12, "Miter", 2), 0.6 - BASE).translate([0, 0, BASE]));

// ---------- nissen: vensters, deuren, lunetten, poortboog ----------
const cuts = [];
const O0 = [0, 0];
const L = FRONT_LIFT;
// Voorgevel: deur (1,3 m, tot +3,0 met bovenlicht), twee vensters van 1,9 m (+0,9 .. +2,9) en twee lunetten erboven
// (straal 0,6, aanzet +3,75), vensterassen 2,65 m naast het midden.
cuts.push(rectNiche(O0, 180, -U_FRONT + 0.16, -DOOR_V, 1.3, L, L + 3.0, 0.5));
for (const dv of [-2.65, 2.65]) {
  cuts.push(rectNiche(O0, 180, -U_FRONT, -(DOOR_V + dv), 1.9, L + 0.9, L + 2.9, 0.35));
  cuts.push(lunette(O0, 180, -U_FRONT, -(DOOR_V + dv), 0.6, L + 3.75, 0.3));
}
// Zuidgevel: kosterswoning met een venster boven (u = -7,6), zaal met drie rondboogvensters (1,2 m, +1,8 tot de aanzet
// +4,0) op u = -2,15 / 1,75 / 5,65.
const HALL_WIN = [-2.15, 1.75, 5.65];
cuts.push(rectNiche(O0, 270, -V_S, -7.6, 0.9, 3.4, 4.5, 0.3));
for (const u of HALL_WIN) cuts.push(archNiche(O0, 270, -V_S, u, 1.2, 1.8, 4.0, 0.35));
// Noordgevel: dezelfde vensters, boven de lage aanbouw ingekort (vanaf +3,0).
for (const u of HALL_WIN) cuts.push(archNiche(O0, 90, V_N, -u, 1.2, u < NORTH[1] + 0.7 ? 3.0 : 1.8, 4.0, 0.35));
// Lage aanbouw noord, westgevel: deur en venster.
cuts.push(rectNiche(O0, 180, -NORTH[0], -6.1, 1.0, L, L + 2.1, 0.3));
cuts.push(rectNiche(O0, 180, -NORTH[0], -4.6, 0.9, L + 1.1, L + 2.0, 0.3));
// Poort: rondboog van 1,2 m tot de aanzet +2,0 als blinde nis aan beide kanten.
cuts.push(archNiche(O0, 180, -GATE[0], -gateV, 1.2, 0.1, 2.0, 0.3));
cuts.push(archNiche(O0, 0, GATE[1], gateV, 1.2, 0.1, 2.0, 0.3));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE).translate([0, -VC, 0]);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Doopsgezinde kerk Berltsum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0083100000000052", "0083100000000062"],
  plate: false,
  description:
    "Doopsgezinde kerk aan de Vermaningsstrjitte in Berltsum: zaalkerk uit 1841 met ingebouwde kosterswoning onder een steil schilddak (nok +11,9 m) met driezijdige achterkant, voorgevel op het westen met kroonlijst, hoeklisenen, ingang met pilasters en segmentboogbekroning, vensters met lunetten en een dakkapel met koepeltje, rondboogvensters in de zijgevels, een lage aanbouw aan de noordkant, een aanbouw met plat dak achter en de toegangspoort aan de zuidkant. Oorsprong RD (172622,26; 584228,02) op de nok boven de voorgevel-as, op het laagste maaiveld (NAP +3,70 m), X-as langs de nok van de voorgevel naar achteren onder 14,6 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "1841 (zaalkerk met ingebouwde kosterswoning); orgel L. van Dam & Zonen 1916",
    monument: 28577,
    groundNapM: 3.7,
    ridgeM: RIDGE,
    eaveM: EAVE,
    sidePitchDeg: +((Math.atan(SP) * 180) / Math.PI).toFixed(1),
    frontPitchDeg: +((Math.atan(FP) * 180) / Math.PI).toFixed(1),
    rearPitchDeg: +((Math.atan(RP) * 180) / Math.PI).toFixed(1),
    dormerDomeTopM: DOME_TOP,
    rearAnnexTopM: REAR_TOP,
    northAnnexTopM: NORTH_TOP,
    gatePeakM: GATE_PEAK,
    baseM: BASE,
  },
  sources: [
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/28577",
    "https://www.reliwiki.nl/index.php/Berltsum,_Vermaningsstrjitte_3_-_Doopsgezinde_Kerk",
    "https://www.openstreetmap.org/way/302811841",
    "https://commons.wikimedia.org (Doopsgezinde_kerk.jpg; Doopsgezinde kerk te Berlikum - 20033984 - RCE; Voormalige Doopsgezinde kerk in Berlikum, signatuur 54478; Religieus erfgoed in Berlikum Doopsgezinde kerk, signatuur 54479; Fermanje, Berltsum.jpg)",
    "BAG panden 0083100000000052 en 0083100000000062 (voetafdruk)",
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

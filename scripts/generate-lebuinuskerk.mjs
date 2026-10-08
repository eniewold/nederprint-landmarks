// Genereert een gesloten 3D-model van de Lebuïnuskerk (Grote Kerk) in Deventer,
// opgebouwd uit dakvlakken en bouwdelen in plaats van uit lagen: het hoge schip
// met zijn steile zadeldak (aan de westkant afgewolfd, aan de oostkant overgaand
// in de koorsluiting), de twee zijbeuken met een rij dwarse, afgewolfde zadeldaken
// per travee (negen aan de noord-, acht aan de zuidkant, plus twee in het rechte
// koordeel), het dwarsschip met het zuidportaal en zijn slanke dakruiter, de
// straalkapellenkrans van het koor (zes radiale, afgewolfde daken boven een
// kegelvormige kilgoot), de noordwestelijke hal met zijn eigen zadeldak, de
// steunberen met afgeschuinde top, verdiepte spitsboogvensters en de toren in het
// zuidwesten: een licht taps toelopende vierkante schacht, een achthoekige
// lantaarn met galmgaten, een koepel en een kroon (tot +67 m).
// Elk dakvlak is een planvergelijking z = a u + b v + c, afgelezen uit de nokken en
// goten van het AHN-DSM (niet uit de ruis): de dwarsdaken hebben een horizontale
// nok op +22,8 m en vlakken van 61 graden boven een kilgoot die van +22,9 m bij het
// schip met 0,46 m per m naar de vlakke goot op +18,2 m daalt; het schip heeft vlakken
// van 1,67 m per m en een nok op +28,05 m, het dwarsschip van 1,75 m per m en +28,15 m.
// De BAG-contouren van de kerk en de toren begrenzen het model (intersectie met het
// contourprisma). Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-lebuinuskerk.mjs              # 1:1000 (standaard)
//   node scripts/generate-lebuinuskerk.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (207439,04, 474048,45), het zwaartepunt van het
// BAG-pand, op maaiveldniveau (NAP +7,8 m), Z omhoog. +X loopt langs de as van
// het schip naar het noordoosten (24,75 graden tegen de klok in vanaf de RD-X-as)
// en +Y loodrecht daarop naar het noordwesten. De toren staat in het zuidwesten
// (u -46,7 tot -32,4 m, v -17,7 tot -4,2 m), het koor loopt tot u = 58 m en de
// noordwestelijke hal tot u = -75 m. De nok van het schip ligt op v = -0,5 m (west)
// tot -1,1 m (oost): de as van het koor wijkt een halve graad af.
//
// Bronnen: PDOK BAG-panden 0150100000001106 (de kerk met koor en hal) en
// 0150100000002210 (de toren); AHN DSM/DTM 0,5 m (PDOK WCS) voor het maaiveld
// (NAP +7,4 tot +8,8 m) en de hoogtes van nokken, goten, koepel en kroon;
// Wikipedia en foto's op Wikimedia Commons (lantaarn van Hendrick de Keyser, 1613,
// balustrade, steunberen); PDOK luchtfoto. Geschat zijn de vensternissen (ligging
// en afmeting: één per travee, 2,6 m breed en 0,9 m diep), de galmgaten en de
// afschuining van de steunberen; weggelaten zijn het maaswerk, de pinakels onder
// 0,9 m, het uurwerk en de kruisroos op de kroon.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "lebuinuskerk");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

const SLUG = "lebuinuskerk";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP 7,8 m) ----------
const GROUND_NAP = 7.8;
const ORIGIN = [207439.04, 474048.45];
const X_AXIS = [0.908143, 0.41866]; // RD-richting 24,75 graden, langs de as van het schip
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// Maaiveld (AHN NAP +7,4 tot +8,8 m) rond het gebouw.
const GROUND_SAMPLES = [[-70, -20], [-45, -28], [10, -30], [64, -10]];

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
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const slab = (u0, u1, v0, v1, z0, z1) => prism(rect(u0, u1, v0, v1), z0, z1);
// Houdt van een lichaam alleen het deel onder het vlak z = a u + b v + c.
const below = (solid, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Dakvlak dat vanaf het punt (pu, pv) op hoogte z0 in richting (du, dv) met helling s
// (m per m) daalt: z = z0 - s ((u - pu) du + (v - pv) dv). Houdt het deel eronder.
const fall = (solid, z0, [pu, pv], [du, dv], s) => below(solid, -s * du, -s * dv, z0 + s * (pu * du + pv * dv));
// Achthoekige afgeknotte piramide (vlakken evenwijdig aan de assen) van z0 tot z1 met
// apothema a0 onderaan en a1 bovenaan.
const octFrustum = ([cx, cy], a0, a1, z0, z1) => {
  const k = 1 / Math.cos(Math.PI / 8);
  return Manifold.cylinder(z1 - z0, a0 * k, a1 * k, 8).rotate([0, 0, 22.5]).translate([cx, cy, z0]);
};
// Steunbeer [binnen1, buiten1, buiten2, binnen2] met de muur aan de binnenzijde: een vlakke top op
// zTop die over `plateau` meter naar buiten doorloopt en daarna met helling s afloopt.
function buttress([i1, o1, o2, i2], zTop, s, plateau = 0.4) {
  const w = [(i1[0] + i2[0]) / 2, (i1[1] + i2[1]) / 2];
  const out = [(o1[0] + o2[0]) / 2 - w[0], (o1[1] + o2[1]) / 2 - w[1]];
  const len = Math.hypot(...out);
  const d = [out[0] / len, out[1] / len];
  const ref = [w[0] + d[0] * plateau, w[1] + d[1] * plateau];
  return below(fall(prism([i1, o1, o2, i2], BASE, zTop + 2), zTop, ref, d, s), 0, 0, zTop);
}
// Steunbeer tegen een zijbeukmuur: van u0 tot u1, muur op v = wall, punt op v = tip.
const buttressWall = (u0, u1, wall, tip, zTop, s, plateau) => buttress([[u0, wall], [u0, tip], [u1, tip], [u1, wall]], zTop, s, plateau);
// Radiale steunbeer rond de naaf (cx, cy) onder hoek `deg`, van straal r0 tot r1 en 2 halfW breed.
function buttressRadial([cx, cy], deg, r0, r1, halfW, zTop, s, plateau) {
  const a = (deg * Math.PI) / 180;
  const d = [Math.cos(a), Math.sin(a)];
  const t = [-d[1], d[0]];
  const at = (r, k) => [cx + d[0] * r + t[0] * k * halfW, cy + d[1] * r + t[1] * k * halfW];
  return buttress([at(r0, -1), at(r1, -1), at(r1, 1), at(r0, 1)], zTop, s, plateau);
}

// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Spitsboogvenster als verdiepte nis: breedte w, van z0 tot de aanzet op z1 en met een
// spitse top van hoogte `rise` (de flanken van de top lopen steiler dan 45 graden). De nis
// ligt in de lokale richting (x = langs de gevel, y = loodrecht daarop, naar buiten) en wordt
// onder hoek `deg` (richting van de gevelnormaal) om het punt c gezet.
function niche(c, deg, tangent, rIn, rOut, w, z0, z1, rise) {
  const pts = [[tangent - w / 2, z0], [tangent + w / 2, z0], [tangent + w / 2, z1], [tangent, z1 + rise], [tangent - w / 2, z1]];
  return profileY(pts, rIn, rOut).rotate([0, 0, deg - 90]).translate([c[0], c[1], 0]);
}

// BAG-contouren in het lokale stelsel (u, v): de kerk met koor en noordwestelijke hal, en de toren.
const CHURCH_RING = [
  [13.69,-26.41], [15.07,-25.05], [26.3,-25.05], [27.66,-26.44], [28.59,-25.52], [27.24,-24.15],
  [27.25,-22.99], [28.44,-22.03], [28.45,-19.99], [27.3,-19.06], [27.3,-17.66], [32.95,-17.68],
  [32.94,-20.05], [34.18,-20.06], [34.19,-17.69], [39.76,-17.38], [40.13,-19.55], [41.36,-19.34],
  [40.98,-17.17], [47.42,-15.29], [48.38,-17.14], [49.48,-16.57], [48.59,-14.85], [53.52,-9.37],
  [55.56,-10.57], [56.19,-9.5], [54.05,-8.22], [55.4,-1.78], [57.62,-1.85], [57.65,-0.58],
  [55.47,-0.51], [53.93,5.77], [55.98,6.94], [55.2,7.95], [53.56,6.85], [49.08,11.79],
  [50.33,13.56], [48.25,15.46], [42.15,18.25], [33.38,18.47], [32.65,17.75], [29.08,17.78],
  [28.94,15.9], [9.99,15.58], [9.86,17.12], [8.48,17.11], [8.49,15.56], [3.76,15.69],
  [3.85,17.47], [2.88,17.5], [2.9,18.3], [-0.1,18.35], [-0.14,15.68], [-1.17,15.69],
  [-1.15,17.55], [-2.51,17.56], [-2.51,15.7], [-6.64,15.72], [-6.64,17.62], [-7.98,17.63],
  [-8.0,15.77], [-12.26,15.82], [-12.24,17.68], [-13.58,17.7], [-13.61,15.84], [-18.19,15.89],
  [-18.16,17.74], [-19.48,17.75], [-19.5,15.91], [-23.39,15.96], [-23.36,17.8], [-24.68,17.81],
  [-24.7,15.97], [-28.58,16.02], [-28.56,17.86], [-29.88,17.88], [-29.88,17.19], [-33.9,17.24],
  [-33.94,16.19], [-34.02,14.16], [-71.85,15.61], [-71.83,16.24], [-72.24,16.25], [-72.19,18.13],
  [-72.46,18.14], [-74.81,18.2], [-75.08,12.65], [-75.04,8.65], [-74.86,7.32], [-74.24,4.62],
  [-68.67,4.82], [-68.54,3.34], [-67.04,3.43], [-67.19,4.72], [-64.06,4.87], [-64.08,3.41],
  [-62.37,3.59], [-62.34,4.99], [-59.28,5.09], [-59.19,3.63], [-58.41,3.64], [-57.13,3.67],
  [-57.2,5.11], [-54.55,5.14], [-54.46,3.62], [-53.53,3.68], [-52.48,3.76], [-52.53,5.26],
  [-48.64,5.36], [-48.65,3.4], [-47.15,3.35], [-45.25,3.31], [-45.45,-3.35], [-49.35,-3.26],
  [-49.42,-6.31], [-45.85,-6.39], [-34.45,-6.71], [-34.47,-17.82], [-34.29,-17.82], [-34.3,-19.58],
  [-32.58,-19.59], [-32.57,-18.5], [-30.2,-18.51], [-30.2,-19.2], [-28.89,-19.2], [-28.88,-17.36],
  [-24.99,-17.38], [-25.0,-19.22], [-23.69,-19.23], [-23.68,-17.39], [-19.79,-17.41], [-19.8,-19.25],
  [-18.49,-19.26], [-18.48,-17.42], [-13.9,-17.44], [-13.91,-19.3], [-12.83,-19.31], [-12.57,-19.31],
  [-12.56,-17.45], [-8.29,-17.47], [-8.3,-19.33], [-8.13,-19.33], [-6.96,-19.34], [-6.95,-17.48],
  [-2.81,-17.5], [-2.82,-19.36], [-1.47,-19.37], [-1.46,-17.5], [2.57,-17.52], [2.56,-19.39],
  [3.9,-19.39], [3.91,-17.53], [8.44,-17.55], [8.43,-19.42], [9.77,-19.43], [9.78,-17.56],
  [14.21,-17.58], [14.17,-21.79], [14.15,-24.12], [12.77,-25.47],
];
const TOWER_RING = [
  [-34.47,-17.82], [-34.45,-6.71], [-45.85,-6.39], [-46.05,-15.17], [-49.62,-15.09], [-49.68,-18.06],
  [-45.76,-18.12], [-45.76,-19.52], [-44.04,-19.53], [-44.03,-17.77], [-40.02,-17.79], [-40.03,-19.55],
  [-38.31,-19.56], [-38.3,-17.8],
];

// Muurlijnen van de zijbeuken (v) en de goothoogte rondom (vlakke goot langs de buitenmuren).
const WALL_S = -17.5;
const WALL_N = 15.6;
const GUTTER = 18.2;

// Schip: steil zadeldak; de nok loopt iets schuin (v = -0,76 - 0,0078 u: de as van het koor wijkt af), het AHN
// geeft 1,67 m per m op de vlakken en een afgeplatte nok op +28,05 m (de top van de vlakken zou op +28,45 m liggen).
const NAVE = { v: -0.76, tilt: -0.0078, apex: 28.45, cap: 28.05, pitch: 1.67, west: -41.4, east: 40.6, hipWest: 1.67, hipEast: 1.95 };
// Dwarsschip: nok langs v op u = 20,75 (+28,1 m), aan beide uiteinden afgewolfd.
const TRANSEPT = { u: 20.75, apex: 28.3, cap: 28.15, pitch: 1.75, south: -12.2, north: 10.4, hip: 2.1 };
// Dwarse zadeldaken boven de zijbeuken: horizontale nok, vlakken van 60 graden, afwolving bij de buitenmuur.
const GABLE = { ridge: 22.8, pitch: 1.8, hipPitch: 1.6, hipLen: 2.9, half: 3.2 };
const GABLES_S = [-26.9, -21.7, -16.1, -10.5, -4.9, 0.7, 6.2, 11.8, 30.1, 36.9];
const GABLES_N = [-31.6, -26.9, -21.6, -15.9, -10.1, -4.5, 1.0, 6.6, 12.2, 30.2, 37.4];
// Kilgoot tussen de dwarsdaken: vlak dat vanaf de schipmuur (+22,9 m) naar buiten daalt.
const VALLEY = { z: 22.9, south: 0.46, southWest: 0.33, north: 0.45, wallS: -3.65, wallN: 2.75 };
// Koorsluiting: zes radiale daken rond de naaf boven een kegelvormige kilgoot (0,48 m per m).
const APSE = { hub: [38.8, -0.6], ridge: 22.75, hubR: 4.9, valleySlope: 0.48, wallR: 16.6, angles: [-70.5, -43.5, -16.5, 10.5, 37.5, 64.5], hipLen: 2.9,
  // Muurlijn van de koorsluiting (de binnenhoeken van de steunberen in de BAG-contour).
  wall: [[38.8, -17.2], [40.98, -17.17], [47.42, -15.29], [48.59, -14.85], [53.52, -9.37], [54.05, -8.22], [55.4, -1.78], [55.47, -0.51], [53.93, 5.77], [53.56, 6.85], [49.08, 11.79], [42.5, 15.3], [38.8, 15.4]] };
// Toren: vierkante schacht met licht taps toelopende wanden, achthoekige lantaarn (apothema 5,5 m),
// koepel en kroon; het hart van de lantaarn ligt op (-39,0, -11,0).
const TOWER = { u0: -46.7, u1: -32.4, v0: -17.7, v1: -4.2, topU0: -45.0, topU1: -32.6, topV0: -17.3, topV1: -4.7, bodyTop: 46.4, c: [-39.0, -11.0], lantern: 5.75, eaves: 56.4 };
// Noordwestelijke hal: zadeldak waarvan de nok naar het zuiden schuift (de lange muren lopen niet evenwijdig).
const HALL = { u0: -73.0, u1: -32.6, cap: 21.0 };

// ---------- gebouw ----------
const pieces = [];

// Schip.
{
  const t = Math.hypot(1, NAVE.tilt);
  const along = [1 / t, NAVE.tilt / t];
  const side = [NAVE.tilt / t, -1 / t];
  const at = (u) => [u, NAVE.v + NAVE.tilt * u];
  let nave = slab(-48, 48, -8, 8, BASE, 30);
  nave = fall(nave, NAVE.apex, at(0), side, NAVE.pitch);
  nave = fall(nave, NAVE.apex, at(0), [-side[0], -side[1]], NAVE.pitch);
  nave = fall(nave, NAVE.apex, at(NAVE.west), [-along[0], -along[1]], NAVE.hipWest);
  nave = fall(nave, NAVE.apex, at(NAVE.east), along, NAVE.hipEast);
  pieces.push(below(nave, 0, 0, NAVE.cap));
}

// Dwarsschip: ruim over de beide zijbeuken, zodat de afwolving op de muurlijnen uitkomt.
{
  let t = slab(TRANSEPT.u - 7, TRANSEPT.u + 7, -19, 17, BASE, 30);
  t = fall(t, TRANSEPT.apex, [TRANSEPT.u, 0], [-1, 0], TRANSEPT.pitch);
  t = fall(t, TRANSEPT.apex, [TRANSEPT.u, 0], [1, 0], TRANSEPT.pitch);
  t = fall(t, TRANSEPT.apex, [0, TRANSEPT.south], [0, -1], TRANSEPT.hip);
  t = fall(t, TRANSEPT.apex, [0, TRANSEPT.north], [0, 1], TRANSEPT.hip);
  pieces.push(below(t, 0, 0, TRANSEPT.cap));
}

// Zijbeuken: kilgootvlak (met een vlakke goot onder +18,2 m) en daarop de dwarse daken.
{
  const valleyS = (u0, u1, slope) => {
    const body = slab(u0, u1, WALL_S - 0.2, -3.0, BASE, 24);
    return Manifold.union([
      slab(u0, u1, WALL_S - 0.2, -3.0, BASE, GUTTER),
      below(body, 0, slope, VALLEY.z - slope * VALLEY.wallS),
    ]);
  };
  pieces.push(valleyS(-34.5, -21.7, VALLEY.southWest));
  pieces.push(valleyS(-21.7, 42.0, VALLEY.south));
  const body = slab(-32.6, 42.0, 2.0, WALL_N + 0.2, BASE, 24);
  pieces.push(slab(-32.6, 42.0, 2.0, WALL_N + 0.2, BASE, GUTTER));
  pieces.push(below(body, 0, -VALLEY.north, VALLEY.z + VALLEY.north * VALLEY.wallN));
}
// Dwarsdak met horizontale nok op u0, afgewolfd aan de buitenmuur; side -1 = zuid, +1 = noord.
function crossGable(u0, side, wall = side < 0 ? WALL_S : WALL_N) {
  const v0 = side < 0 ? wall - 0.2 : 2.6;
  const v1 = side < 0 ? -3.0 : wall + 0.2;
  let g = slab(u0 - GABLE.half, u0 + GABLE.half, v0, v1, BASE, 26);
  g = fall(g, GABLE.ridge, [u0, 0], [-1, 0], GABLE.pitch);
  g = fall(g, GABLE.ridge, [u0, 0], [1, 0], GABLE.pitch);
  return fall(g, GABLE.ridge, [0, wall - side * GABLE.hipLen], [0, side], GABLE.hipPitch);
}
for (const u of GABLES_S) pieces.push(crossGable(u, -1));
for (const u of GABLES_N) pieces.push(crossGable(u, 1, u > 28 ? 15.4 : WALL_N));

// Koor: kegelvormige kilgoot en zes radiale, afgewolfde daken boven de straalkapellen.
{
  const [hx, hy] = APSE.hub;
  const wall = APSE.wall.map(([x, y]) => {
    const k = 1 + 0.15 / Math.hypot(x - hx, y - hy);
    return [hx + (x - hx) * k, hy + (y - hy) * k];
  });
  const wallPrism = prism(wall, BASE, 60);
  const rGutter = APSE.hubR + (APSE.ridge - GUTTER) / APSE.valleySlope;
  const half = Manifold.cube([40, 60, 200], true).translate([20 + hx, hy, 0]);
  const cone = Manifold.union([
    prism(wall, BASE, GUTTER),
    Manifold.cylinder(APSE.ridge - GUTTER, rGutter, APSE.hubR, 48).translate([hx, hy, GUTTER]),
    Manifold.cylinder(0.5, APSE.hubR, APSE.hubR, 48).translate([hx, hy, APSE.ridge]),
  ]);
  pieces.push(cone.intersect(half));
  for (const a of APSE.angles) {
    let g = slab(3.6, APSE.wallR + 3.0, -GABLE.half, GABLE.half, BASE, 26);
    g = fall(g, GABLE.ridge, [0, 0], [0, -1], GABLE.pitch);
    g = fall(g, GABLE.ridge, [0, 0], [0, 1], GABLE.pitch);
    g = fall(g, GABLE.ridge, [APSE.wallR - APSE.hipLen, 0], [1, 0], GABLE.hipPitch);
    pieces.push(g.rotate([0, 0, a]).translate([hx, hy, 0]).intersect(wallPrism));
  }
}

// Zuidportaal van het dwarsschip: een afgewolfd zadeldak met de nok langs u op v = -21.
{
  let p = slab(14.2, 27.4, -25.3, -17.0, BASE, 28);
  p = fall(p, 25.4, [0, -21.0], [0, -1], 2.2);
  p = fall(p, 25.4, [0, -21.0], [0, 1], 1.8);
  p = fall(p, 25.4, [23.6, 0], [1, 0], 2.6);
  p = fall(p, 25.4, [17.9, 0], [-1, 0], 2.6);
  pieces.push(below(p, 0, 0, 25.4));
  // Trappentorentje aan de oostkant en de diagonale hoeksteunberen.
  pieces.push(prism([[26.5, -19.06], [28.45, -19.99], [28.44, -22.03], [27.25, -22.99], [27.24, -24.15], [26.5, -24.15]], BASE, 18.5));
  pieces.push(buttress([[14.15, -24.12], [12.77, -25.47], [13.69, -26.41], [15.07, -25.05]], 19.0, 6));
  pieces.push(buttress([[26.3, -25.05], [27.66, -26.44], [28.59, -25.52], [27.24, -24.15]], 19.0, 6));
  // Slank torentje (dakruiter) op de nok van het portaal: in het DSM een piek tot +37 m van ongeveer 2,5 m breed.
  pieces.push(octFrustum([20.9, -21.1], 2.0, 0.1, 20.0, 37.0));
}

// Steunberen langs de zuid- en noordgevel van de zijbeuken en rond het koor.
for (const [u0, u1, tip] of [
  [-30.2, -28.89, -19.2], [-25.0, -23.69, -19.23], [-19.8, -18.49, -19.26], [-13.91, -12.57, -19.31],
  [-8.3, -6.96, -19.33], [-2.82, -1.46, -19.37], [2.56, 3.91, -19.39], [8.43, 9.78, -19.42], [32.94, 34.19, -20.05],
]) pieces.push(buttressWall(u0, u1, WALL_S, tip, 19.6, 7, 0.4));
// Steunberen van het rechte koordeel aan de noordkant (door de lage aanbouw heen).
for (const [u0, u1] of [[33.1, 34.6], [40.4, 41.9]]) pieces.push(buttressWall(u0, u1, 15.3, 17.5, 18.6, 6, 0.5));
for (const [u0, u1, tip] of [
  [-29.88, -28.57, 17.87], [-24.69, -23.37, 17.8], [-19.5, -18.17, 17.75], [-13.6, -12.25, 17.69],
  [-7.99, -6.64, 17.63], [-2.51, -1.16, 17.55], [2.88, 3.85, 17.49], [8.48, 9.86, 17.12],
]) pieces.push(buttressWall(u0, u1, 15.7, tip, 19.4, 7));
for (const quad of [
  [[39.76, -17.38], [40.13, -19.55], [41.36, -19.34], [40.98, -17.17]],
  [[47.42, -15.29], [48.38, -17.14], [49.48, -16.57], [48.59, -14.85]],
  [[53.52, -9.37], [55.56, -10.57], [56.19, -9.5], [54.05, -8.22]],
  [[55.4, -1.78], [57.62, -1.85], [57.65, -0.58], [55.47, -0.51]],
  [[53.93, 5.77], [55.98, 6.94], [55.2, 7.95], [53.56, 6.85]],
]) pieces.push(buttress(quad, 19.8, 7, 1.0));
pieces.push(buttressRadial(APSE.hub, 51, 15.8, 18.4, 0.65, 19.5, 7, 1.0));

// Lage aanbouw (sacristie) langs de noordkant van het koor, en het portaaltje tegen de noordbeuk.
pieces.push(prism([[28.9, 15.0], [28.9, 17.9], [32.6, 17.9], [33.4, 18.6], [42.2, 18.4], [48.4, 15.6], [50.4, 13.7], [49.2, 11.7], [45.0, 13.0], [40.0, 15.0]], BASE, 6.8));
pieces.push(slab(-0.14, 2.9, 15.0, 18.4, BASE, 3.2));

// Noordwestelijke hal: zadeldak (zuidvlak, noordvlak en westelijke afwolving) met een gebroken zuidvlak
// langs de goot, de lage aanbouwen aan de westkant en de lage steunberen aan de zuidkant.
{
  const body = slab(HALL.u0, HALL.u1, 4.0, 16.5, BASE, 25);
  let h = below(body, 0.0829, 1.95, 7.34);
  h = below(h, -0.0829, -1.95, 35.05);
  h = below(h, 1.9, 0, 149.99);
  pieces.push(below(h, 0, 0, HALL.cap));
  pieces.push(below(slab(HALL.u0, HALL.u1, 4.0, 9.0, BASE, 20), 0, 1.0, 8.6));
  pieces.push(below(slab(HALL.u0, HALL.u1, 13.0, 16.5, BASE, 20), 0, -1.9, 40.8));
  // Trappentorentje in de noordwesthoek van het schip.
  pieces.push(octFrustum([-45.4, 4.9], 1.7, 1.7, BASE, 22.8));
  pieces.push(octFrustum([-45.4, 4.9], 1.7, 0.3, 22.7, 24.6));
  pieces.push(slab(-75.2, -72.3, 4.4, 11.8, BASE, 3.4));
  pieces.push(slab(-75.2, -72.3, 11.4, 18.4, BASE, 7.7));
  for (const [u0, u1] of [[-68.66, -67.1], [-64.07, -62.35], [-59.2, -57.15], [-54.5, -52.5], [-48.65, -45.25]]) {
    pieces.push(buttressWall(u0, u1, 5.0, 3.3, 13.0, 3.5));
  }
}

// Toren.
{
  const { c } = TOWER;
  const shaft = Manifold.union([
    slab(TOWER.u0, TOWER.u1, TOWER.v0, TOWER.v1, BASE, 15),
    Manifold.hull([
      [TOWER.u0, TOWER.v0, 15], [TOWER.u1, TOWER.v0, 15], [TOWER.u1, TOWER.v1, 15], [TOWER.u0, TOWER.v1, 15],
      [TOWER.topU0, TOWER.topV0, TOWER.bodyTop], [TOWER.topU1, TOWER.topV0, TOWER.bodyTop],
      [TOWER.topU1, TOWER.topV1, TOWER.bodyTop], [TOWER.topU0, TOWER.topV1, TOWER.bodyTop],
    ]),
  ]);
  pieces.push(shaft);
  // Lantaarn en koepel (apothema's en hoogtes uit het DSM), kroon met bol.
  const dome = [[5.75, 56.4], [4.75, 57.9], [3.75, 59.2], [2.65, 60.5], [1.5, 61.5]];
  pieces.push(octFrustum(c, TOWER.lantern, TOWER.lantern, TOWER.bodyTop - 0.2, TOWER.eaves));
  for (let i = 0; i + 1 < dome.length; i++) pieces.push(octFrustum(c, dome[i][0], dome[i + 1][0], dome[i][1], dome[i + 1][1]));
  pieces.push(octFrustum(c, 1.2, 1.2, 61.4, 62.4));
  pieces.push(Manifold.cylinder(4.9, 1.15, 0, 8).rotate([0, 0, 22.5]).translate([c[0], c[1], 62.3]));
  // Steunberen tegen de zuidgevel, de hoekblokken en de trapkoker aan de zuidoosthoek.
  pieces.push(buttressWall(-45.76, -44.03, -17.7, -19.53, 23.5, 4.4));
  pieces.push(buttressWall(-40.03, -38.3, -17.7, -19.55, 23.5, 4.4));
  pieces.push(buttressWall(-34.3, -32.58, -17.7, -19.59, 23.5, 4.4));
  pieces.push(fall(slab(-49.7, -46.0, -18.1, -15.1, BASE, 18.9), 18.9, [-48.4, 0], [-1, 0], 9));
  pieces.push(fall(below(slab(-32.9, -29.0, -17.6, -15.3, BASE, 40), 0, 0, 27.0), 27.0, [-30.3, 0], [1, 0], 6.5));
  pieces.push(fall(slab(-49.4, -45.5, -6.4, -3.3, BASE, 30), 21.0, [-47, 0], [-1, 0], 1.5));
}

// ---------- vensternissen (verdiept, minimaal 0,9 m diep en 2,4 m breed) ----------
const niches = [];
// Zijbeuken: een nis in het midden van elke travee (tussen de steunberen); zuid kijkt naar -v, noord naar +v.
for (const u of GABLES_S) niches.push(niche([u, 0], -90, 0, -WALL_S - (u > 28 ? 1.1 : 0.9), -WALL_S + 0.6, 2.6, 3.0, 11.0, 2.4));
for (const u of GABLES_N.filter((x) => x > -30 && x < 28)) niches.push(niche([u, 0], 90, 0, WALL_N - 0.9, WALL_N + 0.6, 2.6, 3.0, 11.0, 2.4));
// Zuidportaal, koorkapellen en de toren.
niches.push(niche([20.75, 0], -90, 0, 25.05 - 0.95, 26.0, 4.2, 3.5, 11.5, 3.2));
for (const a of APSE.angles) niches.push(niche(APSE.hub, a, 0, 15.75, 18.5, 2.6, 3.0, 11.0, 2.4));
{
  const c = [-39.2, -10.95];
  for (const off of [-2.88, 2.88]) niches.push(niche(c, -90, off, 5.4, 8.2, 2.4, 29.5, 40.5, 2.6));
  niches.push(niche(c, 90, 0, 5.5, 8.0, 3.2, 29.5, 40.5, 3.0));
  niches.push(niche(c, 180, 0, 5.0, 8.5, 3.2, 29.5, 40.5, 3.0));
  niches.push(niche(c, 0, 0, 5.6, 8.0, 3.2, 29.5, 40.5, 3.0));
  // Galmgaten van de lantaarn op de vier windrichtingen.
  for (const a of [0, 90, 180, 270]) niches.push(niche(TOWER.c, a, 0, TOWER.lantern - 1.0, TOWER.lantern + 1.0, 2.8, 48.0, 52.6, 2.3));
}

// ---------- samenstelling en begrenzing op de BAG-contouren ----------
const footprint = Manifold.union([prism(CHURCH_RING, BASE - 1, 90), prism(TOWER_RING, BASE - 1, 90)]);
const complex = Manifold.union(pieces).subtract(Manifold.union(niches)).intersect(footprint);
const nodes = [["building:kerk", complex]];
const all = complex;

const META = {
  name: "Lebuïnuskerk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0150100000001106", "0150100000002210"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (207439,04, 474048,45), het zwaartepunt van het BAG-pand, op het maaiveld (NAP +7,8 m), +X langs de as van het schip naar het noordoosten (24,75 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noordwesten. Eén node building:kerk: de Lebuïnuskerk uit dakvlakken en bouwdelen: het schip met zijn steile zadeldak (nok +28,05 m), de dwarse, afgewolfde zadeldaken boven de beide zijbeuken (nok +22,8 m), het dwarsschip (nok +28,15 m) met zuidportaal en dakruiter, de straalkapellenkrans van het koor, de noordwestelijke hal, de steunberen met verdiepte vensternissen en de toren in het zuidwesten met achthoekige lantaarn, koepel en kroon (tot +67 m). Onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van de kerk en de toren (twee panden). Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { aisleRoofM: 22.8, naveRoofM: 28.05, transeptRoofM: 28.15, towerTopM: 67.2, groundNapM: 7.8, baseM: -0.5 },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_of_Lebuinuskerk",
    "PDOK BAG panden 0150100000001106 (kerk) en 0150100000002210 (toren), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, kilgoten, goten en torenhoogtes, en het maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons: foto's van de toren en de lantaarn (Hendrick de Keyser, 1613)",
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

// Losse delen van het model (genus onder 0 betekent meer dan één stuk).
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

// Genereert een gedetailleerd, gesloten 3D-model van Stadion Galgenwaard in
// Utrecht (thuisstadion van FC Utrecht): de vier tribunedaken als gewelfde
// dakplaten (1,6 tot 3,2 m dik) met de tribunes eronder (onderrang, gang,
// bovenrang en achterwand, de noordtribune met een glazen blok), de witte
// vakwerkbogen langs de veldkant van het zuid-, west- en oostdak, de lagere
// hoekgebouwen waar de daktippen als overhang boven hangen, de schuine
// hoekzuilen, het verzonken dakveld van de noordtribune en het grote gewelfde
// dak van het hoofdgebouw aan de zuidkant. De daken zijn dwarsprofielen langs
// de tribune, geknipt op hun plattegrond (geen hoogteveld); het Mapbox-model
// is niet gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-stadion-galgenwaard.mjs              # 1:1000 (standaard)
//   node scripts/generate-stadion-galgenwaard.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening op maaiveldniveau
// (NAP +2,0 m), Z omhoog. +X loopt langs de lengteas van het veld naar het
// oostzuidoosten (RD-richting (0,9260, -0,3775), -22,18 graden), +Y dwars
// daarop naar het noordnoordoosten; het hoofdgebouw ligt aan de -Y-kant.
//
// Bronnen: PDOK BAG-pand 0344100000056854 (het stadion met het hoofdgebouw en
// de hoekgebouwen als één pand; contour en vervangen pand); AHN DSM/DTM 0,5 m
// (PDOK WCS): de veldopening (124 bij 86 m), de plattegrond van de vier daken
// (afgelezen en vereenvoudigd op 1,2 m), hun dwarsprofielen (+27 tot +31,3 m),
// het dakveld van de noordtribune (3,5 m lager, 105 bij 14 m), de kruinen van
// de bogen (+35,6 m zuid, +34,8 m west en oost, 7 m boven het dak, 7,6 tot
// 8,1 m van de dakrand), de vier hoekgebouwen (+11,2 en +14,6 m, installatieruimten
// van 3,2 m) en het gewelfde dak van het hoofdgebouw (+24,2 m dalend naar
// +20,6 m, boog van 3,6 m); Wikipedia (23.750 plaatsen, hoofdtribune naar
// de noordkant verplaatst), ZJA (vakwerkligger van 100 m, open hoeken);
// PDOK luchtfoto en foto's op Wikimedia Commons (rang, gang, glazen blok,
// overhang van de daktippen). Geschat uit die foto's en de dakhoogten zijn de
// tribunes onder de daken (de rang, de gang, de achterwand, de plaatdikte) en
// de eindwanden die de daken in de hoeken tot 12 m laten overhangen: het AHN ziet
// alleen de bovenkant van de daken.
// Weggelaten: de lichtmasten op de binnenhoeken (+36 tot +40 m), de trappentorens,
// de kabels, de zonnepanelen en alle gevelreliëf.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "stadion-galgenwaard");
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
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Convexe veelhoek in plan met een dakvlak z = a x + b y + c, vanaf z0 omhoog.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([
    ...pts.map(([x, y]) => [x, y, z0]),
    ...pts.map(([x, y]) => [x, y, a * x + b * y + c]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);

const SLUG = "stadion-galgenwaard";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +2,0 m) ----------
const GROUND_NAP = 2.0;
const ORIGIN = [138454.9, 454482.7];
const X_AXIS = [0.926002, -0.377518]; // RD-richting -22,18 graden, langs het veld
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// Plattegronden van de vier tribunedaken (u, v), met schuine hoeken naar de
// binnenhoeken van de kom en afgeronde buitenranden (AHN-DSM, op 1,2 m).
const NORTH = [[-62, 43], [62, 43], [68, 51], [59.5, 75.5], [56.5, 78.5], [38, 83.5], [-15, 85], [-33, 82.5], [-51, 80.5], [-58.5, 77.5], [-69.4, 50]];
const SOUTH = [[-62, -43], [62, -43], [69, -50.5], [60.5, -75.5], [54.5, -80.5], [45.5, -82.5], [45.5, -87], [-52.5, -87], [-52.5, -81.5], [-61.5, -73], [-68.5, -51]];
const WEST = [[-62, -43], [-62, 43], [-69.4, 50], [-89.5, 44], [-100.5, 36.5], [-104.5, 13], [-104.5, -11], [-102.5, -26.5], [-100.5, -36], [-94.5, -42], [-68.5, -51]];
const EAST = [[62, 43], [62, -43], [69, -50.5], [95, -42], [100.5, -36.5], [104.5, -7.5], [102.5, 26], [100.5, 35], [95, 41.5], [68, 51]];
// Dwarsprofielen [afstand tot het hart in v of u, z]: de daken lopen van de veldkant
// naar buiten op (+27 tot +30,9 m); het noorddak heeft een rand van +31,3 m.
// De profielen zijn de bovenkant op de hartlijn van de tribune; de daken zijn
// dwars daarop gewelfd: de hoogte daalt met `curve` · t² naar de uiteinden (t = afstand
// tot de hartlijn, AHN: 3 tot 6 m verval over 40 tot 50 m).
const NORTH_PROFILE = [[43, 27.0], [64, 29.1], [80.5, 29.0], [82, 31.1], [85.5, 31.3]];
const SOUTH_PROFILE = [[-43, 28.5], [-46, 28.9], [-52, 29.9], [-66, 30.3], [-82, 31.2], [-87, 24.4]];
const WEST_PROFILE = [[-62, 27.6], [-68, 28.6], [-100, 30.8], [-104.5, 30.9]];
const EAST_PROFILE = [[62, 27.7], [68, 28.5], [98, 30.7], [104.5, 30.9]];
const CURVE = { north: 0.0007, south: 0.0014, west: 0.0022, east: 0.0021 };
const STATION = 7.5;
// Verzonken dakveld in het noorddak (solar- en lichtstroken): 3,5 m lager.
const SUNKEN = { u: [-52.5, 53.1], v: [66, 80.5], floor: 25.5 };
// Lagere hoekgebouwen met een plat dak: noordwest +14,6 m, de andere drie +11,2 m,
// elk met een installatieruimte van 3,2 m hoog (AHN). Het zichtbare deel eindigt aan
// de dakranden van de twee daken ernaast; de plattegrond loopt hier door tot de
// eindwanden van de tribunes (u = +-57 en v = +-45) waar de daken overheen hangen.
const CORNERS = [
  { z: 14.6, ring: [[-56.5, 72.5], [-85, 72.5], [-91.5, 68], [-91.5, 45], [-56.5, 45]], plant: [-86.5, -75.2, 55.5, 64] },
  { z: 11.2, ring: [[56.5, 72.7], [83, 72.5], [88.5, 67.5], [91, 64.5], [91, 45], [56.5, 45]], plant: [72.5, 82.5, 55.2, 64] },
  { z: 11.2, ring: [[-56.5, -45], [-91, -45], [-91, -65], [-83, -72.5], [-56.5, -73]], plant: [-83, -72.8, -64.2, -55.2] },
  { z: 11.2, ring: [[56.5, -45], [91.5, -45], [91.5, -64], [83, -72.5], [56.5, -72.5]], plant: [73.8, 82.8, -64, -53.8] },
];
// Hoofdgebouw aan de zuidkant: een gewelfd dak (dwarsboog van 3,6 m over 98 m, hoogste op u -2 m) dat van
// +24,2 m bij de tribune daalt naar +20,6 m aan het eind, op de BAG-contour.
const ANNEX = {
  ring: [[-52.5, -86], [-52.5, -93.5], [-47, -101], [-31.5, -115], [-22.5, -121], [22, -121], [32.5, -114], [45.5, -101.5], [45.5, -86]],
  vNear: -86, vFar: -121.5, zNear: 24.2, zFar: 20.6, centre: -2, curve: 0.0012, us: [-52.5, -40, -26, -13, 0, 13, 26, 40, 45.5],
};
// Maaiveld (AHN NAP +1,9 tot +2,0 m) rond het stadion.
const GROUND_SAMPLES = [[0, 95], [-115, 0], [115, 0], [-100, 60]];

// ---------- gebouwen ----------
const clip = (solid, plan) => Manifold.intersection(solid, prism(plan, BASE - 1, 60));
// Gewelfd dak: de romp van elk paar dwarsdoorsneden langs de tribune (de
// bovenkant is dwars op de doorsneden een parabool, dus convex); `along` is de
// as langs de tribune: "u" voor het noord- en zuiddak, "v" voor de koppen.
const dished = (profile, along, half, curve) => {
  const stations = [];
  for (let t = -half; t <= half + 1e-6; t += STATION) stations.push(t);
  const at = (t, [s, z]) => (along === "u" ? [t, s, z - curve * t * t] : [s, t, z - curve * t * t]);
  const sectionAt = (t) => [
    ...profile.map((p) => at(t, p)),
    ...[profile[0], profile[profile.length - 1]].map(([s]) => at(t, [s, BASE + curve * t * t])),
  ];
  const patches = [];
  for (let i = 0; i + 1 < stations.length; i++) patches.push(Manifold.hull([...sectionAt(stations[i]), ...sectionAt(stations[i + 1])]));
  return Manifold.union(patches);
};
const cs = (pts) => new CrossSection([ccw(pts)]);
const rect = (x0, x1, y0, y1) => cs([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
const slab = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
// Dikke staaf met een vierkante doorsnede tussen twee punten (middelpunten van de eindblokjes).
const cubeAt = ([x, y, z], w) => Manifold.cube([w, w, w], true).translate([x, y, z]);
const bar = (a, wa, b, wb = wa) => Manifold.hull([cubeAt(a, wa), cubeAt(b, wb)]);

// ---------- daken: een plaat boven de tribunes ----------
// De bovenkant is het AHN-profiel van hierboven; de onderkant ligt aan de veldkant
// 1,6 m eronder en vanaf 10 m naar achteren 3,2 m (de spantdiepte), zodat het dak
// een plaat is met open ruimte eronder in plaats van een kolom tot het maaiveld.
const T_EDGE = 1.6;
const T_BACK = 3.2;
const T_RAMP = 10;
const underside = (profile) =>
  profile.map(([s, z]) => [s, z - Math.min(T_BACK, T_EDGE + ((T_BACK - T_EDGE) * Math.abs(s - profile[0][0])) / T_RAMP)]);
const roofColumn = (plan, profile, along, half, curve) => clip(dished(profile, along, half, curve), plan);
const roofPlate = (column, plan, profile, along, half, curve, carve) => {
  let below = Manifold.intersection(dished(underside(profile), along, half, curve), slab(cs(plan).offset(1, "Miter"), BASE - 1, 60));
  if (carve) below = below.subtract(carve);
  return column.subtract(below);
};
// Het verzonken dakveld is een bak: de plaat daalt 3,5 m en de randen hangen als balk onder het dak.
const sunkenBox = (pad, z0) => box(SUNKEN.u[0] - pad, SUNKEN.u[1] + pad, SUNKEN.v[0] - pad, SUNKEN.v[1] + pad, z0, 40);
const northColumn = roofColumn(NORTH, NORTH_PROFILE, "u", 75, CURVE.north).subtract(sunkenBox(0, SUNKEN.floor));
const southColumn = roofColumn(SOUTH, SOUTH_PROFILE, "u", 75, CURVE.south);
const westColumn = roofColumn(WEST, WEST_PROFILE, "v", 60, CURVE.west);
const eastColumn = roofColumn(EAST, EAST_PROFILE, "v", 60, CURVE.east);
const roofs = [
  roofPlate(northColumn, NORTH, NORTH_PROFILE, "u", 75, CURVE.north, sunkenBox(1.5, SUNKEN.floor - 2)),
  roofPlate(southColumn, SOUTH, SOUTH_PROFILE, "u", 75, CURVE.south),
  roofPlate(westColumn, WEST, WEST_PROFILE, "v", 60, CURVE.west),
  roofPlate(eastColumn, EAST, EAST_PROFILE, "v", 60, CURVE.east),
];

// ---------- tribunes onder de daken ----------
// Het AHN ziet alleen de daken; de rang eronder is geschat uit foto's (Wikimedia
// Commons) en de dakhoogten: een onderrang van 14 m diep (+1,0 tot +9,0 m, 8 treden),
// een gang van 3 m, een bovenrang van 20 m diep tot `top` en een achterwand tot het dak.
// `front` is de voorkant van de rang (3 m voor de dakrand), `ends` de eindwanden; de
// daken steken daar voorbij, de hoeken van de daken hangen vrij boven de hoekgebouwen.
const stairs = (d0, z0, d1, z1, n) => {
  const pts = [];
  for (let k = 0; k < n; k++) {
    const z = z0 + ((z1 - z0) * k) / n;
    pts.push([d0 + ((d1 - d0) * k) / n, z], [d0 + ((d1 - d0) * (k + 1)) / n, z]);
  }
  pts.push([d1, z1]);
  return pts;
};
const rakeProfile = (topZ, run, steps, terraces) => {
  const upper = terraces ?? stairs(17, 9.0, 17 + run, topZ, steps);
  const pts = [[0, BASE], ...stairs(0, 1.0, 14, 9.0, 8), [17, 9.0], ...upper, [90, topZ], [90, BASE]];
  return pts.filter((p, i) => i === 0 || p[0] !== pts[i - 1][0] || p[1] !== pts[i - 1][1]);
};
const STANDS = [
  // De noordtribune (de hoofdtribune) heeft boven de onderrang een glazen blok met drie terugspringende niveaus.
  { column: northColumn, plan: NORTH, axis: "x", front: 40, dir: 1, ends: [-57, 57], inset: 2.5, band: 60, top: 20.0, terraces: [[17, 13], [20, 13], [20, 17], [23, 17], [23, 20]] },
  { column: southColumn, plan: SOUTH, axis: "x", front: -40, dir: -1, ends: [-57, 57], inset: 0.3, band: -60, top: 20.5, run: 20, steps: 11 },
  { column: westColumn, plan: WEST, axis: "y", front: -59, dir: -1, ends: [-45.5, 45.5], inset: 2.5, band: -85, top: 22.0, run: 20, steps: 13 },
  { column: eastColumn, plan: EAST, axis: "y", front: 59, dir: 1, ends: [-45.5, 45.5], inset: 2.5, band: 85, top: 22.0, run: 20, steps: 13 },
];
const standOf = ({ column, plan, axis, front, dir, ends, inset, band, top, run, steps, terraces }) => {
  const x = axis === "x";
  const profile = rakeProfile(top, run, steps, terraces).map(([d, z]) => [front + dir * d, z]);
  const wedge = x ? profileX(profile, ends[0], ends[1]) : profileY(profile, ends[0], ends[1]);
  const inner = cs(plan).offset(-inset, "Miter");
  const endBox = x ? rect(ends[0], ends[1], -200, 200) : rect(-200, 200, ends[0], ends[1]);
  const f0 = Math.min(front, front + dir * 8);
  const f1 = Math.max(front, front + dir * 8);
  const frontBox = x ? rect(ends[0], ends[1], f0, f1) : rect(f0, f1, ends[0], ends[1]);
  const body = Manifold.intersection(wedge, slab(inner.add(frontBox).intersect(endBox), BASE - 1, 60));
  // Achterwand (de gevel): een ring van 3 m langs de buitenrand van het dak, tot de bovenkant van het dak.
  const bandBox = x ? (band < 0 ? rect(-200, 200, -200, band) : rect(-200, 200, band, 200)) : band < 0 ? rect(-200, band, -200, 200) : rect(band, 200, -200, 200);
  const ring = inner.subtract(cs(plan).offset(-(inset + 3), "Miter")).intersect(endBox).intersect(bandBox);
  const wall = Manifold.intersection(slab(ring, BASE, 60), column);
  return Manifold.union([body, wall]);
};
const stands = STANDS.map(standOf);

// ---------- hoeken ----------
// De hoekgebouwen sluiten aan op de eindwanden van de twee tribunes en houden die en de daken
// bij elkaar; de daktippen hangen er vrij boven (10 tot 12 m ruimte) en rusten op de stadiongevel.
const corners = CORNERS.map(({ z, ring, plant }) =>
  Manifold.union([prism(ring, BASE, z), box(plant[0], plant[1], plant[2], plant[3], BASE, z + 3.2)]),
);
// Op de vier punten waar twee daken aan hun hoek raken blijft een spleet van een
// vierkante meter over; een blokje van 3,8 m dicht die en draagt de boogeinden.
const JOINTS = [[-69.5, 50.3], [68.3, 51.8], [-68.7, -51.3], [69.1, -50.6]];
const joints = JOINTS.map(([u, v]) => box(u - 1.9, u + 1.9, v - 1.9, v + 1.9, 20.5, 25.5));
// Schuine hoekzuilen (op de foto's twee witte buizen, hier een zuil van 1,8 m) van de rang
// bij de hoekvlag naar de plek waar de twee daken elkaar raken.
const posts = [[-1, 1], [1, 1], [-1, -1], [1, -1]].map(([sx, sy]) => bar([sx * 62.8, sy * 44.2, BASE + 0.9], 1.8, [sx * 65, sy * 47, 22.5], 1.6));

// Trappentorens (open stalen trappen) tegen de noordgevel: het AHN toont ze als een helling van +21 m bij de gevel naar +14 m aan de buitenkant.
const TOWERS = [[-41.2, -36.2], [36.2, 40.8]];
const towers = TOWERS.map(([u0, u1]) => planeRoof([[u0, 78.6], [u1, 78.6], [u1, 88.6], [u0, 88.6]], BASE, [0, -1.25, 124.75]));

// ---------- witte vakwerkbogen langs de veldkant van het zuid-, west- en oostdak ----------
// Een boog van een bovenstreng (1,5 m) met diagonalen (1,0 m) die op het dak staan; de bovenkant volgt
// de AHN-kruin (+7 m boven het dak in het midden). Het noorddak heeft geen boog (het AHN toont daar geen kruin).
const mirror = (half) => [...half.slice(1).reverse().map(([t, z]) => [-t, z]), ...half];
const hullTop = (profile, s) => {
  let best = -Infinity;
  for (const [s0, z0] of profile) {
    for (const [s1, z1] of profile) {
      if (s < Math.min(s0, s1) - 1e-9 || s > Math.max(s0, s1) + 1e-9) continue;
      best = Math.max(best, s0 === s1 ? Math.max(z0, z1) : z0 + ((z1 - z0) * (s - s0)) / (s1 - s0));
    }
  }
  return best;
};
const lerpAt = (pts, t) => {
  for (let i = 0; i + 1 < pts.length; i++) {
    const [t0, z0] = pts[i];
    const [t1, z1] = pts[i + 1];
    if (t >= t0 - 1e-9 && t <= t1 + 1e-9) return z0 + ((z1 - z0) * (t - t0)) / (t1 - t0);
  }
  return pts[0][1];
};
const ARCHES = [
  { along: "u", at: -51.1, span: 68.7, profile: SOUTH_PROFILE, curve: CURVE.south, top: mirror([[0, 35.6], [12, 35.4], [24, 34.8], [36, 33.0], [48, 30.9], [56, 29.2], [62, 27.6], [68.7, 26.0]]) },
  { along: "v", at: -69.6, span: 50.8, profile: WEST_PROFILE, curve: CURVE.west, top: mirror([[0, 34.8], [12, 34.0], [24, 32.2], [30, 31.0], [36, 29.6], [45, 26.6], [50.8, 25.3]]) },
  { along: "v", at: 69.3, span: 50.8, profile: EAST_PROFILE, curve: CURVE.east, top: mirror([[0, 34.8], [12, 34.0], [24, 32.2], [30, 31.0], [36, 29.6], [45, 26.6], [50.8, 25.3]]) },
];
const arches = ARCHES.map(({ along, at, span, profile, curve, top }) => {
  const pos = (t, z) => (along === "u" ? [t, at, z] : [at, t, z]);
  const parts = [];
  for (let i = 0; i + 1 < top.length; i++) parts.push(bar(pos(top[i][0], top[i][1] - 0.75), 1.5, pos(top[i + 1][0], top[i + 1][1] - 0.75), 1.5));
  const bays = Math.round((2 * span) / 12);
  const bay = (2 * span) / bays;
  const deck = (t) => hullTop(profile, at) - curve * t * t;
  for (let j = 0; j < bays; j++) {
    const t0 = -span + j * bay;
    const t1 = t0 + bay;
    const tm = (t0 + t1) / 2;
    const foot = pos(tm, deck(tm) + 0.2);
    parts.push(bar(pos(t0, lerpAt(top, t0) - 0.75), 1.0, foot, 1.0), bar(foot, 1.0, pos(t1, lerpAt(top, t1) - 0.75), 1.0));
  }
  return Manifold.union(parts);
});

// ---------- hoofdgebouw ----------
// Gewelfd dak: de romp van twee dwarsdoorsneden (convex, dus een rechte regeloppervlak).
const section = (v, zCentre) => ANNEX.us.flatMap((u) => [[u, v, zCentre - ANNEX.curve * (u - ANNEX.centre) ** 2], [u, v, BASE]]);
const annex = Manifold.intersection(
  Manifold.hull([...section(ANNEX.vNear, ANNEX.zNear), ...section(ANNEX.vFar, ANNEX.zFar)]),
  prism(ANNEX.ring, BASE - 1, 60),
);
// Raamstroken zijn niet gemodelleerd: de gevels zijn in het AHN niet te zien.
const stadium = Manifold.union([...roofs, ...stands, ...corners, annex, ...joints, ...posts, ...towers, ...arches]);
const nodes = [["building:stadion", stadium]];
const all = stadium;
// Dakplaten, daklijsten en bogen hangen vrij boven de rang en de lagere hoeken; onder +8,5 m mag niets overhangen.
const OVERHANG_OK = (z) => z > 8.5;

const META = {
  name: "Stadion Galgenwaard",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0344100000056854"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (138454,90, 454482,70) in het hart van de veldopening op het maaiveld (NAP +2,0 m), +X langs het veld naar het oostzuidoosten (-22,18 graden) en +Y naar het noordnoordoosten. Eén node building:stadion: de vier tribunedaken als gewelfde platen (+27 tot +31,3 m, 1,6 tot 3,2 m dik, de noordtribune met een verzonken dakveld van 105 bij 14,5 m op +25,5 m) met de tribunes eronder (onderrang van +1 tot +9 m, gang, bovenrang tot +22 m of een glazen blok, achterwand), de witte vakwerkbogen langs de veldkant van het zuid-, west- en oostdak (kruin +35,6 m), vier lagere hoekgebouwen (+14,6 en drie keer +11,2 m) met de daktippen als overhang erboven, schuine hoekzuilen en het gewelfde dak van het hoofdgebouw aan de zuidkant (+24,2 m dalend naar +20,6 m). Onderkant op 0,5 m onder het maaiveld; de dakplaten, de bogen en de daktippen hangen vrij boven de rang en de hoekgebouwen (ondervlakken boven +8,5 m), alle andere vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van het stadionpand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 23750,
    fieldOpeningM: [123.5, 85.6],
    roofM: [27.0, 31.3],
    cornerRoofM: [14.6, 11.2],
    roofPlateThicknessM: [T_EDGE, T_BACK],
    archCrestM: 35.6,
    standTiersTopM: [9.0, 22.0],
    annexRoofM: [ANNEX.zNear, ANNEX.zFar],
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Stadion_Galgenwaard",
    "PDOK BAG pand 0344100000056854, EPSG:28992",
    "https://www.zja.nl/en/Stadion-Galgenwaard-Utrecht",
    "PDOK AHN DSM/DTM 0,5 m via WCS: de vier daken, de bogen, de hoeken, het gewelfde dak van het hoofdgebouw en het maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons: foto's van de tribunes en daken (rang, gang, glazen blok, daktippen)",
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

// Losse delen van het model (genus onder 0 betekent meer dan ��n stuk).
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

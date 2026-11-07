import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-of-sint-janskerk-montfoort");
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


const SLUG = "grote-of-sint-janskerk-montfoort";
const BASE = -0.4;
// Stelsel: oorsprong op het hart van de viering (kruising van de nokken) op maaiveld (NAP +1,6 m), +u langs de
// west-oostnok van toren naar koor (RD-richting 3,0 graden, gevels in de BAG-contour), +v naar het noorden.
const ORIGIN = [124899.37, 450842.62];
const AXIS_DEG = 3.0;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 45,79, zuid 45,03, noord 45,85, oost 45,22,
// zuidwest 45,35, zuidoost 45,22, noordoost 46,08, noordwest 46,20 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 45.03;
const GROUND_SAMPLES = [[-37, 0], [0, -21], [0, 21], [27, 0], [-24, -13], [12, -14], [12, 14], [-20, 13]];

// ---------- maten (meter boven maaiveld, NAP +1,6) ----------
// Pseudobasiliek: middenbeuk en zijbeuken onder één kap met een knik. Schip en koor: nok +21,0/+20,9, steile
// middenvlakken (1,47 en 1,43) tot de knik boven de scheiding van de beuken, dan flauwere zijbeukvlakken (0,89 en 0,74)
// tot de goot op +9,0 (3D BAG LoD2.2 en AHN-DSM).
const NAVE = { u0: -31.55, u1: 0, wall: 10.07, ridge: 21.0, pitch: 1.47, knee: 5.2, aisle: 0.89 };
const CHOIR = { u0: 5.42, u1: 18.37, wall: 11.25, ridge: 20.9, pitch: 1.43, knee: 5.1, aisle: 0.74 };
const TR = { u: 5.42, v: 18.05, ridge: 20.9, pitch: 1.47 }; // dwarsschip: goot +13,0, kopgevels recht
// Vijfzijdige koorsluiting (halve tienhoek, BAG) met een eigen goot op +13,0 en schilden naar het nokeinde.
const APSE = [[18.37, -5.38], [21.01, -4.55], [23.33, -1.64], [23.33, 1.64], [21.01, 4.55], [18.37, 5.38]];
const APSE_EAVE = 13.0, APSE_RIDGE_END = 17.7;
// Westtoren (circa 1500, spits 1877): 6,2 m in het vierkant, drie geledingen met spitsboognissen, kroonlijst op +28,7
// (AHN), balustrade, achtkante leien spits tot +47,5 met wijzerplaatkapellen.
const TC = [-31.38, -0.12], TH = 3.1;
const T_BAND1 = 16.2, T_BAND2 = 23.0, T_TOP = 28.7, SPIRE_TOP = 47.5;
// Achtkante traptoren tegen de zuidkant van de toren (na 1629) met tentdak.
const STAIR = [-29.9, -4.3], STAIR_W = 3.0, STAIR_TOP = 24.0, STAIR_APEX = 26.4;
// Ronde traptoren in de noordoosthoek tussen koorsluiting en noordelijke koorbeuk.
const NE_TURRET = [19.1, 6.3], NE_R = 1.35, NE_EAVE = 12.6, NE_APEX = 16.4;
// Achtkante dakruiter op de viering met open lantaarn (hier dicht met nissen) en spits.
const FLECHE_TOP = 28.0;

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));

// ---------- schip, koor en dwarsschip ----------
// Een kap met knik: middenvlakken en zijbeukvlakken als twee daken over hetzelfde grondvlak; de union neemt per plek
// het hoogste vlak, zodat de flauwe zijbeukvlakken buiten de knik en de steile middenvlakken binnen de knik overblijven.
const knee = (p, u0, u1) => {
  const plan = R(u0, u1, -p.wall, p.wall);
  const c = p.ridge - p.pitch * p.knee + p.aisle * p.knee;
  return Manifold.union([roofed(plan, ridgeV(0, p.ridge, p.pitch)), roofed(plan, [[0, -p.aisle, c], [0, p.aisle, c]])]);
};
// Ruitvormige nis (oculus) met plafonds van 50 graden.
const diamondNiche = ([cx, cy], angle, z, r, d = 0.35) =>
  profileX([[0, z - 1.2 * r], [r, z], [0, z + 1.2 * r], [-r, z]], -d, 0.4)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
solids.push(knee(NAVE, NAVE.u0, 0));
solids.push(knee(CHOIR, CHOIR.u0 - 0.5, CHOIR.u1));
solids.push(roofed(R(-TR.u, TR.u, -TR.v, TR.v), ridgeU(0, TR.ridge, TR.pitch)));

// Koorsluiting: schilden van de goot (+13,0) naar het nokeinde, plus de koorvlakken.
const ridgeEnd = [APSE_RIDGE_END, 0];
const apsePlane = (p0, p1) => {
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const dist = Math.abs((p1[0] - p0[0]) * (p0[1] - ridgeEnd[1]) - (p0[0] - ridgeEnd[0]) * (p1[1] - p0[1])) / len;
  return facet(p0, p1, APSE_EAVE, (CHOIR.ridge - APSE_EAVE) / dist, [20, 0]);
};
const apsePlan = [[16.5, -5.38], ...APSE, [16.5, 5.38]];
solids.push(roofed(apsePlan, [...ridgeV(0, CHOIR.ridge, CHOIR.pitch), ...APSE.slice(0, -1).map((p, i) => apsePlane(p, APSE[i + 1]))]));

// ---------- lage aanbouwen ----------
// Heilig Grafkapel tegen de zuidbeuk: zadeldak noord-zuid (goot +6,6, nok +10,5, 3D BAG), topgevel op het zuiden.
const CHAPEL = { u0: -18.1, u1: -12.97, v0: -15.72, ridgeU: -15.53, eave: 6.6, ridge: 10.5 };
const chapelPitch = (CHAPEL.ridge - CHAPEL.eave) / (CHAPEL.ridgeU - CHAPEL.u0);
solids.push(roofed(R(CHAPEL.u0, CHAPEL.u1, CHAPEL.v0, -9.0), ridgeU(CHAPEL.ridgeU, CHAPEL.ridge, chapelPitch)));
// Noordportaal tussen twee steunberen: lessenaarsdak van +5,1 aan de muur tot +3,6 (3D BAG).
solids.push(roofed(R(-13.6, -9.56, 9.5, 12.25), [[0, (3.6 - 5.1) / 2.18, 5.1 + ((5.1 - 3.6) / 2.18) * 10.07]]));

// ---------- plint ----------
const plan = CrossSection.union([
  new CrossSection([ccw(R(NAVE.u0, 0, -NAVE.wall, NAVE.wall))]),
  new CrossSection([ccw(R(CHOIR.u0 - 0.5, CHOIR.u1, -CHOIR.wall, CHOIR.wall))]),
  new CrossSection([ccw(R(-TR.u, TR.u, -TR.v, TR.v))]),
  new CrossSection([ccw(apsePlan)]),
  new CrossSection([ccw(R(TC[0] - TH, TC[0] + TH, TC[1] - TH, TC[1] + TH))]),
  new CrossSection([ccw(R(CHAPEL.u0, CHAPEL.u1, CHAPEL.v0, -9.0))]),
]);
solids.push(Manifold.extrude(plan.offset(0.15, "Miter"), 0.8 - BASE).translate([0, 0, BASE]));

// ---------- steunberen (BAG-inkepingen; zuidbeuk van het schip van foto's) ----------
// angle: 0 zuid, 90 oost, 180 noord, 270 west (zie buttress()).
const B = (p, angle, w, d, zw, zo) => solids.push(buttress(p, angle, w, d, zw, zo));
for (const u of [-31.0, -26.55, -22.3, -18.05, -13.8, -9.35]) B([u, NAVE.wall], 180, 0.9, 1.1, 7.8, 6.6);
for (const u of [-31.0, -26.55, -22.3]) B([u, -NAVE.wall], 0, 0.9, 1.1, 7.8, 6.6);
for (const v of [9.4, 5.15, -5.15, -9.25]) B([NAVE.u0, v], 270, 0.95, 1.0, 7.8, 6.6);
for (const u of [9.3, 13.65, 18.25]) { B([u, CHOIR.wall], 180, 0.9, 1.1, 7.8, 6.6); B([u, -CHOIR.wall], 0, 0.9, 1.1, 7.8, 6.6); }
for (const v of [10.4, -10.4]) B([CHOIR.u1, v], 90, 0.9, 1.0, 7.8, 6.6);
for (const s of [-1, 1]) {
  const ang = s > 0 ? 180 : 0;
  // Hoekberen van de kopgevels en twee beren op elke zijgevel van het dwarsschip, tot onder de goot.
  B([-4.85, s * TR.v], ang, 1.0, 1.25, 11.4, 10.0);
  B([4.7, s * TR.v], ang, 1.0, 1.25, 11.4, 10.0);
  for (const v of [17.4, 13.6]) { B([TR.u, s * v], 90, 1.0, 1.15, 11.0, 9.6); B([-TR.u, s * v], 270, 1.0, 1.15, 11.0, 9.6); }
}
// Koorsluiting: beren op de vier hoeken, radiaal.
for (const [p, n] of [[APSE[1], -55.6], [APSE[2], -19.3], [APSE[3], 19.3], [APSE[4], 55.6]]) B(p, n + 90, 1.0, 1.1, 11.4, 10.2);

// ---------- vensters en deuren als blinde nissen ----------
const WIN = (p, angle, w = 2.2, z0 = 2.8, z1 = 6.6) => cuts.push(niche(p, angle, 0, 0, w, z0, z1, 0.38));
for (const u of [-28.8, -24.4, -20.15, -15.9]) WIN([u, NAVE.wall], 90);
WIN([-11.6, NAVE.wall], 90, 2.0, 5.7, 6.6);
for (const u of [-28.8, -24.4, -20.2, -9.2]) WIN([u, -NAVE.wall], 270);
for (const v of [7.3, -7.3]) WIN([NAVE.u0, v], 180, 2.0);
for (const u of [7.1, 11.45, 15.85]) { WIN([u, CHOIR.wall], 90); WIN([u, -CHOIR.wall], 270); }
for (const v of [8.0, -8.0]) WIN([CHOIR.u1, v], 0, 1.9);
// Drie hoge koorvensters in de oost- en diagonaalzijden.
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
cuts.push(niche(mid(APSE[1], APSE[2]), -38.6, 0, 0, 1.9, 3.8, 10.4, 0.38));
cuts.push(niche(mid(APSE[2], APSE[3]), 0, 0, 0, 1.9, 3.8, 10.4, 0.38));
cuts.push(niche(mid(APSE[3], APSE[4]), 38.6, 0, 0, 1.9, 3.8, 10.4, 0.38));
// Dwarsschip: twee lancetten en een oculus in elke kopgevel, een venster in elke zijgevel.
for (const s of [-1, 1]) {
  const ang = s > 0 ? 90 : 270;
  for (const u of [-1.45, 1.45]) cuts.push(niche([u, s * TR.v], ang, 0, 0, 2.0, 3.2, 12.0, 0.38));
  cuts.push(diamondNiche([0, s * TR.v], ang, 15.6, 0.8));
  cuts.push(niche([0, s * TR.v], ang, 0, 0, 0.9, 18.0, 18.6, 0.3));
  cuts.push(niche([TR.u, s * 15.5], 0, 0, 0, 1.5, 3.2, 9.6, 0.38));
  cuts.push(niche([-TR.u, s * 15.5], 180, 0, 0, 1.5, 3.2, 9.6, 0.38));
}
cuts.push(niche([1.45, -TR.v], 270, 0, 0, 1.6, 0.0, 2.4, 0.4)); // zuiddeur in de kopgevel (onder het venster)
// Grafkapel: venster en oculus in de topgevel, venster in de westmuur.
cuts.push(niche([-15.53, CHAPEL.v0], 270, 0, 0, 1.4, 4.0, 6.0, 0.35));
cuts.push(diamondNiche([-15.53, CHAPEL.v0], 270, 2.4, 0.45));
cuts.push(niche([CHAPEL.u0, -12.9], 180, 0, 0, 1.2, 2.6, 4.6, 0.35));
// Noordportaal: deur.
cuts.push(niche([-11.58, 12.25], 90, 0, 0, 1.6, 0.0, 2.2, 0.35));

// ---------- toren ----------
const box = ([cx, cy], hx, hy = hx) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
const tower = [prism(box(TC, TH), BASE, T_TOP - 0.7)];
// Kroonlijst op een kraag van 45 graden, daarop de balustrade (dichte borstwering met hoekposten).
tower.push(loft([[T_TOP - 0.75, box(TC, TH)], [T_TOP - 0.35, box(TC, TH + 0.35)], [T_TOP, box(TC, TH + 0.35)]]));
tower.push(prism(box(TC, TH + 0.25), T_TOP - 0.05, T_TOP + 1.0).subtract(prism(box(TC, TH - 0.55), T_TOP, T_TOP + 2)));
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const c = [TC[0] + sx * (TH - 0.2), TC[1] + sy * (TH - 0.2)];
  tower.push(loft([[T_TOP, sq(c, 0.45)], [T_TOP + 1.25, sq(c, 0.45)], [T_TOP + 1.9, tip(c)]]));
}
// Banden tussen de geledingen: smalle lijst op een kraag van 45 graden.
for (const z of [T_BAND1, T_BAND2]) tower.push(loft([[z - 0.25, box(TC, TH)], [z, box(TC, TH + 0.2)], [z + 0.25, box(TC, TH + 0.2)]]));
// Achtkante spits met een flauwe voet, vier wijzerplaatkapellen en vier dakkapelletjes hogerop.
tower.push(loft([[T_TOP - 0.1, oct(TC, 3.9)], [T_TOP + 1.2, oct(TC, 3.6)], [SPIRE_TOP - 1.2, oct(TC, 0.9)], [SPIRE_TOP, tip(TC)]]));
const apothem = (z) => (3.6 + ((0.9 - 3.6) * (z - (T_TOP + 1.2))) / (SPIRE_TOP - 1.2 - (T_TOP + 1.2))) / 2;
// Kapel: voorgevel met punt op afstand rf, onderkant onder 45 graden terug de spits in.
const dormer = (angle, w, z0, z1, zpk, rf, rb) => {
  const pts = [];
  for (const s of [-w / 2, w / 2]) pts.push([rf, s, z0], [rf, s, z1], [rb, s, z0 - 1.2 * (rf - rb)], [rb, s, zpk + 0.6]);
  pts.push([rf, 0, zpk], [rb, 0, zpk + 0.6]);
  const a = (angle * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return Manifold.hull(pts.map(([r, q, z]) => [TC[0] + r * c - q * s, TC[1] + r * s + q * c, z]));
};
for (const ang of [0, 90, 180, 270]) {
  const zc = T_TOP + 0.7;
  tower.push(dormer(ang, 1.5, zc, zc + 1.9, zc + 2.9, apothem(zc) + 0.45, apothem(zc) - 1.0));
  const zd = 35.6;
  tower.push(dormer(ang, 0.9, zd, zd + 0.9, zd + 1.4, apothem(zd) + 0.45, Math.max(0.2, apothem(zd) - 0.8)));
}
const towerCuts = [];
// Westdeur in een hoge spitsboognis, venster erboven (foto's van de Lange Kerkstraat).
towerCuts.push(niche([TC[0] - TH, TC[1]], 180, 0, 0, 2.2, 0.0, 3.3, 0.45));
towerCuts.push(niche([TC[0] - TH, TC[1]], 180, 0, 0, 1.6, 5.6, 10.6, 0.4));
// Onderste geleding west: twee hoge smalle nissen naast deur en venster.
for (const s of [-2.05, 2.05]) towerCuts.push(niche([TC[0] - TH, TC[1]], 180, 0, s, 1.1, 4.0, 14.6, 0.3));
// Middelste en bovenste geleding: drie spitsboognissen per zijde, de middelste dieper (galmgat).
for (const [ang, n] of [[0, [1, 0]], [90, [0, 1]], [180, [-1, 0]], [270, [0, -1]]]) {
  const face = [TC[0] + n[0] * TH, TC[1] + n[1] * TH];
  for (const s of [-1.75, 0, 1.75]) {
    const d = s === 0 ? 0.6 : 0.3;
    // Op de zuidzijde staat de traptoren voor de oostelijke helft (s > 0 is daar oost): geen ingesloten holtes.
    const south = ang === 270;
    if (!south || s < 0) towerCuts.push(niche(face, ang, 0, s, 1.3, T_BAND1 + 0.6, T_BAND2 - 1.85, d));
    if (!south || s < 1) towerCuts.push(niche(face, ang, 0, s, 1.3, T_BAND2 + 0.6, T_TOP - 1.95, d));
  }
}
const towerSolid = Manifold.union(tower).subtract(Manifold.union(towerCuts));

// Traptoren: achtkant met kroonlijst op een kraag en een tentdak; schietgaten als nissen.
const stair = [loft([[BASE, oct(STAIR, STAIR_W)], [STAIR_TOP - 0.45, oct(STAIR, STAIR_W)], [STAIR_TOP, oct(STAIR, STAIR_W + 0.45)], [STAIR_TOP + 0.05, oct(STAIR, STAIR_W + 0.45)], [STAIR_APEX - 0.6, oct(STAIR, 0.9)], [STAIR_APEX, tip(STAIR)]])];
stair.push(loft([[T_BAND1 - 0.25, oct(STAIR, STAIR_W)], [T_BAND1, oct(STAIR, STAIR_W + 0.25)], [T_BAND1 + 0.2, oct(STAIR, STAIR_W + 0.25)]]));
const stairCuts = [];
for (const z of [17.6, 20.4]) stairCuts.push(niche(STAIR, 270, STAIR_W / 2, 0, 0.5, z, z + 0.8, 0.25));

// Ronde traptoren in de noordoosthoek met kegeldak.
wasm.setCircularSegments(24);
const neTurret = Manifold.union([
  Manifold.cylinder(NE_EAVE - 0.4 - BASE, NE_R, NE_R, 24).translate([NE_TURRET[0], NE_TURRET[1], BASE]),
  Manifold.cylinder(0.4, NE_R, NE_R + 0.35, 24).translate([NE_TURRET[0], NE_TURRET[1], NE_EAVE - 0.4]),
  loft([[NE_EAVE - 0.01, oct(NE_TURRET, 2 * (NE_R + 0.3) * 0.92)], [NE_APEX - 0.7, oct(NE_TURRET, 0.9)], [NE_APEX, tip(NE_TURRET)]]),
]);
wasm.setCircularSegments(48);

// Dakruiter: achtkante voet op de nokken, dichte lantaarn met nissen, uitkragende voet van de spits op 50 graden.
const F = [0, 0];
const fleche = [loft([[18.6, oct(F, 1.9)], [21.8, oct(F, 1.9)], [21.8, oct(F, 1.6)], [23.6, oct(F, 1.6)], [23.9, oct(F, 2.1)], [24.05, oct(F, 2.1)], [FLECHE_TOP - 0.8, oct(F, 0.5)], [FLECHE_TOP, tip(F)]])];
const flecheCuts = [];
for (let k = 0; k < 8; k++) flecheCuts.push(niche(F, k * 45, 0.8, 0, 0.45, 22.0, 23.0, 0.2));
const flecheSolid = Manifold.union(fleche).subtract(Manifold.union(flecheCuts));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = Manifold.union([complex, towerSolid, Manifold.union(stair).subtract(Manifold.union(stairCuts)), neTurret, flecheSolid]);
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Grote of Sint-Janskerk Montfoort",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0335100000317720"],
  plate: false,
  description:
    "Grote of Sint-Janskerk aan de Kerkstraat in Montfoort: laatgotische kruisvormige pseudobasiliek (circa 1490-1500, na de brand van 1629 hersteld) met schip en koor onder een geknikte kap (nok +21 m, goot +9 m), dwarsschip met rechte kopgevels, vijfzijdige koorsluiting, steunberen, Heilig Grafkapel en noordportaal, achtkante dakruiter op de viering, ronde traptoren bij het koor en een westtoren met drie geledingen, traptoren, balustrade en achtkante spits van 1877 tot +47,5 m. Oorsprong RD (124899,37; 450842,62) op het hart van de viering op maaiveld (NAP +1,6 m), X-as langs de west-oostnok onder 3,0 graden. Vensters en galmgaten als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "schip, dwarsschip en koor circa 1490-1500 (brand 1629, herstel tot 1634), toren onderbouw 13e/15e eeuw, spits 1877",
    monument: 30057,
    groundNapM: 1.6,
    naveRidgeM: NAVE.ridge,
    aisleEaveM: 9.0,
    transeptEaveM: 13.0,
    towerCorniceM: T_TOP,
    towerTopM: SPIRE_TOP,
    flecheTopM: FLECHE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_of_Sint-Janskerk_(Montfoort)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/30057",
    "https://archimon.nl/utrecht/montfoortherv.html",
    "https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Janskerk_(Montfoort) (RCE-foto's 20160538, 20160545, 20160551, 20160552, 20160553, 20160566, 20160638, 20314221; Montfoort 136.JPG; Toren Grote of Sint-Janskerk Montfoort Koninginnedag 2012.JPG; 2010 Grote of Sint-Janskerk (Montfoort).jpg)",
    "BAG pand 0335100000317720 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

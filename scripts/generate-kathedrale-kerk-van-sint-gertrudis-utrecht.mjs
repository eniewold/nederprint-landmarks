import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kathedrale-kerk-van-sint-gertrudis-utrecht");
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


const SLUG = "kathedrale-kerk-van-sint-gertrudis-utrecht";
const BASE = -0.4;
// Stelsel: oorsprong op de nok van het schip boven de lijn van het middenschip (maaiveld oostzijde NAP +2,92 m),
// +u langs de nok van de westgevel (Willemsplantsoen) naar de apsis (RD-richting 30,7 graden), +v naar het
// noordwesten (Mariahoek). Hoofdas uit de BAG-gevels (evenwijdig binnen 0,3 graden) en de nok in het AHN-DSM.
const ORIGIN = [136463.54, 455645.77];
const AXIS_DEG = 30.7;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 47,44 / 47,46 / 47,42 (plantsoen),
// zuid 46,41, zuidoost 46,52, oost (weg) 46,61 en 46,52, noordoost 46,28 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 46.28;
const GROUND_SAMPLES = [[-23.5, 0], [-23.5, -7], [-23.5, 7], [0, -13.5], [10, -11], [22, -8], [27, 0], [22, 8.5]];
// Het Willemsplantsoen voor de westgevel ligt 1,16 m hoger dan de Mariahoek (DTM NAP +4,08 tegen +2,92).
const GW = 1.16;

// ---------- maten (meter boven het maaiveld aan de oostzijde) ----------
// Schip: nok +20,15, dakhelling 1,32 (53 graden) aan beide kanten (AHN-DSM per 0,25 m dwars op de as).
const RIDGE = 20.15, PITCH = 1.32, NAVE_V = 5.25;
const NAVE_W = -20.55, NAVE_E = 18.3; // westgevel tussen de torens (BAG) en de oostgevel boven de apsis (DSM)
// Zijbeuken met lessenaarsdak: +9,5 tegen het schip, helling 0,68, buitenmuur op 8,1 m (BAG en DSM).
const AISLE_V = 8.1, AISLE_TOP = 9.5, AISLE_PITCH = 0.68, AISLE_W = -17.0, AISLE_E = 9.46;
// Kapellen langs het koor met eigen zadeldak evenwijdig aan het schip: nok +11,2 op 7,4 m, helling 0,8.
const CHAPEL_RIDGE = 11.2, CHAPEL_RV = 7.4, CHAPEL_PITCH = 0.8, CHAPEL_V = 9.35;
// Apsis: veelhoekige sluiting, goot +12,5, alle dakvlakken helling 1,3 (52 graden), eindgevel op u = 25,25.
const APSE = [[NAVE_E, -5.2], [22.4, -5.2], [25.25, -1.75], [25.25, 1.75], [22.4, 5.2], [NAVE_E, 5.2]];
const APSE_EAVE = 12.5, APSE_PITCH = 1.3;
// Dubbeltorenfront: twee vierkante torens van 4,0 m (BAG), onderbouw tot +17,4, klokverdieping iets
// ingesprongen tot +24,0, kroonlijst en tentdak (helling 2,0) tot +29,1 (hoogste AHN-punt NAP +32,03).
const TOWER_U = -18.8, TOWER_V = 6.8, T_HALF = 2.0;
const T_STAGE = 17.4, T_EAVE = 24.4, T_TOP = 29.1;
// Achtkante traptorens: west naast de torens (BAG, kap +13,8 tot +15,8), oost naast de apsis (+15,0 tot +18,2).
const STAIRS = [
  { c: [-18.07, -9.5], d: 2.25, eave: 13.8, top: 15.8 },
  { c: [-18.18, 9.55], d: 2.25, eave: 13.8, top: 15.8 },
  { c: [18.95, -5.8], d: 2.1, eave: 15.0, top: 18.2 },
  { c: [18.75, 6.3], d: 2.3, eave: 15.0, top: 18.2 },
];

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
const box = ([cx, cy], hx, hy = hx) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
// Rechthoekige paneelnis met een plafond van 45 graden (zie Grote Kerk Almelo).
const recess = ([cx, cy], angle, a, s0, s1, z0, z1, d) =>
  Manifold.extrude(new CrossSection([ccw([[a - d, z0], [a + 1, z0], [a + 1, z1], [a, z1], [a - d, z1 - d - 0.05]])]), s1 - s0)
    .rotate([90, 0, 0])
    .translate([0, s1, 0])
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Roosvenster als zeshoekige nis met een top van 50 graden.
const rose = ([cx, cy], angle, a, s, z, r, d = 0.35) =>
  profileX([[s, z - 1.2 * r], [s + r, z - 0.3 * r], [s + r, z + 0.3 * r], [s, z + 1.5 * r], [s - r, z + 0.3 * r], [s - r, z - 0.3 * r]], a - d, a + 0.4)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Lijst om een convexe doorsnede: onderkant 50 graden, dan recht omhoog.
const offsetPoly = (poly, p) => {
  const cx = poly.reduce((s, q) => s + q[0], 0) / poly.length, cy = poly.reduce((s, q) => s + q[1], 0) / poly.length;
  return poly.map(([x, y]) => [x + Math.sign(Math.round((x - cx) * 1e6)) * p, y + Math.sign(Math.round((y - cy) * 1e6)) * p]);
};
const cornice = (poly, z, p, h = 0.3) => loft([[z - 1.2 * p, poly], [z, offsetPoly(poly, p)], [z + h, offsetPoly(poly, p)]]);

// ---------- schip met westgevel en oostgevel ----------
solids.push(roofed(R(NAVE_W, NAVE_E, -NAVE_V, NAVE_V), ridgeV(0, RIDGE, PITCH)));
// Gootlijst langs het schip (DSM: vlakke rand op +13,5 tot 0,35 m buiten de muur), onderkant 45 graden.
for (const sy of [-1, 1])
  solids.push(profileX([[sy * 4.85, 12.15], [sy * (NAVE_V + 0.35), 12.95], [sy * (NAVE_V + 0.35), 13.55], [sy * 4.85, 13.55]], AISLE_W, NAVE_E));
// Westgevel: verhoogde topgevel met deklijst (0,45 m boven het dakvlak) en een bol met kruis op de top.
solids.push(roofed(R(NAVE_W, NAVE_W + 0.9, -NAVE_V, NAVE_V), ridgeV(0, RIDGE + 0.45, PITCH)));
solids.push(loft([[RIDGE - 0.2, box([NAVE_W + 0.45, 0], 0.45)], [RIDGE + 0.9, box([NAVE_W + 0.45, 0], 0.45)], [RIDGE + 1.65, tip([NAVE_W + 0.45, 0])]]));
// Dakkapellen: vier per dakschild op een travee-afstand van 7,9 m (luchtfoto en AHN-DSM 0,5 m), met een zadeldakje.
for (const u of [-11.9, -3.9, 4.0, 11.8]) for (const sy of [-1, 1])
  solids.push(roofed(R(u - 0.75, u + 0.75, sy * 2.6, sy * 4.3), ridgeU(u, 16.3, 1.6)));

// ---------- zijbeuken, kapellen en portalen ----------
for (const sy of [-1, 1]) {
  solids.push(roofed(R(AISLE_W, AISLE_E, sy * (NAVE_V - 0.1), sy * AISLE_V), [[0, sy * -AISLE_PITCH, AISLE_TOP + AISLE_PITCH * NAVE_V]]));
}
// Kapellen bij het koor (BAG: zuid u 9,46 tot 17,4, noord 9,13 tot 16,98).
solids.push(roofed(R(9.46, 17.4, -NAVE_V + 0.1, -CHAPEL_V), ridgeV(-CHAPEL_RV, CHAPEL_RIDGE, CHAPEL_PITCH)));
solids.push(roofed(R(9.13, 16.98, NAVE_V - 0.1, CHAPEL_V + 0.1), ridgeV(CHAPEL_RV, CHAPEL_RIDGE, CHAPEL_PITCH)));
// Zijportalen in het midden van de zijbeuken met een zadeldak dwars op het schip (3D BAG: nok +7,1 en +7,6).
solids.push(roofed(R(-2.26, 2.13, -AISLE_V + 0.1, -12.2), ridgeU(-0.05, 7.1, 0.64)));
solids.push(roofed(R(-2.71, 2.6, AISLE_V - 0.1, 10.0), ridgeU(-0.05, 7.6, 0.65)));
// Noordelijke aanbouw met plat dak (+6,2) tussen zijbeuk en Mariahoek (BAG, deel van hetzelfde pand).
solids.push(prism([[-15.6, 7.9], [-4.45, 7.9], [-4.4, 11.06], [1.5, 11.18], [1.55, 12.41], [-5.25, 12.78], [-5.1, 16.58], [-15.45, 16.94]], BASE, 6.2));
// Lage zuidelijke aanbouw: lessenaarsdak van +6,6 naar +5,5 (3D BAG) en een plat deel op +3,2.
solids.push(roofed([[-13.7, -12.8], [-11.76, -12.8], [-11.76, -10.56], [-9.64, -10.56], [-9.64, -AISLE_V + 0.1], [-13.7, -AISLE_V + 0.1]], [[0.23, 0, 6.6 + 0.23 * 9.4]]));
solids.push(prism(R(-9.7, -6.93, -10.25, -AISLE_V + 0.1), BASE, 3.2));

// ---------- apsis ----------
solids.push(roofed(APSE, [
  facet(APSE[0], APSE[1], APSE_EAVE, APSE_PITCH, [21, 0]),
  facet(APSE[1], APSE[2], APSE_EAVE, APSE_PITCH, [21, 0]),
  facet(APSE[2], APSE[3], APSE_EAVE, APSE_PITCH, [21, 0]),
  facet(APSE[3], APSE[4], APSE_EAVE, APSE_PITCH, [21, 0]),
  facet(APSE[4], APSE[5], APSE_EAVE, APSE_PITCH, [21, 0]),
]));
// Vlakke steunberen op de hoeken van de sluiting (BAG-uitsprongen van 0,7 m), schuin afgedekt.
const corner = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
// theta is de buitennormaal (bissectrice van de twee wanden, graden vanaf +u); buttress() wijst bij 0 naar -v.
for (const [p, theta] of [[APSE[1], -65.2], [APSE[2], -20.2], [APSE[3], 20.2], [APSE[4], 65.2]])
  solids.push(buttress(p, theta + 90, 0.9, 0.7, 10.6, 9.9));

// ---------- dubbeltorenfront ----------
for (const sy of [-1, 1]) {
  const tc = [TOWER_U, sy * TOWER_V];
  // Onderbouw: kern met hoeklisenen van 0,9 m, 0,15 m voor de gevel.
  solids.push(prism(box(tc, T_HALF - 0.15), BASE, T_STAGE));
  for (const sx of [-1, 1]) for (const sz of [-1, 1])
    solids.push(prism(R(tc[0] + sx * (T_HALF - 0.9), tc[0] + sx * T_HALF, tc[1] + sz * (T_HALF - 0.9), tc[1] + sz * T_HALF), BASE, T_STAGE - 0.5));
  // Binnenzijde (tegen het schip) vlak, zonder lisenen.
  solids.push(prism(R(TOWER_U - T_HALF, TOWER_U + T_HALF, sy * (TOWER_V - T_HALF), sy * (TOWER_V - T_HALF + 0.2)), BASE, T_STAGE - 0.5));
  // Rondboogfries en lijst onder de klokverdieping, die 0,2 m inspringt; lijst boven het portaal (+7,0).
  solids.push(cornice(box(tc, T_HALF - 0.15), T_STAGE - 0.3, 0.35, 0.3));
  solids.push(cornice(box(tc, T_HALF - 0.15), 7.0, 0.35, 0.25));
  solids.push(prism(box(tc, T_HALF - 0.2), T_STAGE, T_EAVE - 0.55));
  // Kroonlijst en tentdak met de werkelijke vier vlakken.
  solids.push(loft([[T_EAVE - 0.55, box(tc, T_HALF - 0.2)], [T_EAVE, box(tc, T_HALF + 0.25)], [T_EAVE + 0.15, box(tc, T_HALF + 0.25)], [T_TOP, tip(tc)]]));
  // Westzijde: deur in de toren (rondboog als spitse nis), vensters boven elkaar, galmgaten.
  cuts.push(niche(tc, 180, T_HALF - 0.15, 0, 1.6, GW, GW + 2.9, 0.4));
  // Op de vrije zijden (west en buiten): smalle vensters in de onderbouw en een tweelicht in de klokverdieping.
  for (const z0 of [8.2, 11.4, 14.4]) cuts.push(niche(tc, 180, T_HALF - 0.15, 0, 0.9, z0, z0 + 1.2, 0.35));
  for (const ang of [180, sy > 0 ? 90 : 270]) {
    cuts.push(niche(tc, ang, T_HALF - 0.2, 0, 0.9, 18.4, 19.4, 0.35));
    cuts.push(niche(tc, ang, T_HALF - 0.2, 0, 1.6, 20.9, 22.2, 0.4));
  }
  for (const ang of [0, sy > 0 ? 270 : 90]) cuts.push(niche(tc, ang, T_HALF - 0.2, 0, 1.6, 20.9, 22.2, 0.4));
}
// Doorlopende lijst boven het portaal tussen de torens (+7,0).
const frontLedge = (z, p, h) => loft([[z - 1.2 * p, R(NAVE_W, -19.9, -4.8, 4.8)], [z, R(NAVE_W - p, -19.9, -4.8, 4.8)], [z + h, R(NAVE_W - p, -19.9, -4.8, 4.8)]]);
solids.push(frontLedge(7.0, 0.2, 0.25));
// Lijst met rondboogfries onder de topgevel (+14,2).
solids.push(frontLedge(14.2, 0.2, 0.2));

// ---------- westgevel tussen de torens ----------
// Portaal: zandstenen omlijsting, rondboogdeur met mozaïektimpaan (spitse nis), twee vensters ernaast.
solids.push(prism(R(NAVE_W - 0.3, NAVE_W + 0.2, -2.3, 2.3), BASE, 6.9));
cuts.push(niche([NAVE_W - 0.3, 0], 180, 0, 0, 2.9, GW, GW + 3.0, 0.45));
for (const s of [-3.4, 3.4]) cuts.push(niche([NAVE_W, 0], 180, 0, s, 0.9, GW + 1.2, GW + 2.6, 0.35));
// Dwerggalerij van zeven bogen (+7,4 tot +9,9) en drie vensters met zuiltjes erboven.
for (let k = -3; k <= 3; k++) cuts.push(niche([NAVE_W, 0], 180, 0, k * 1.3, 0.95, 7.45, 9.2, 0.35));
for (const s of [-1.6, 0, 1.6]) cuts.push(niche([NAVE_W, 0], 180, 0, s, 1.1, 10.5, 12.3, 0.38));
// Topgevel: tweelicht en een roosvenster.
for (const s of [-0.8, 0.8]) cuts.push(niche([NAVE_W, 0], 180, 0, s, 0.9, 15.0, 16.3, 0.35));
cuts.push(rose([NAVE_W, 0], 180, 0, 0, 18.0, 0.5));

// ---------- traptorens ----------
for (const { c, d, eave, top } of STAIRS) {
  solids.push(loft([[BASE, oct(c, d)], [eave - 0.3, oct(c, d)], [eave, oct(c, d + 0.3)], [eave + 0.1, oct(c, d + 0.3)], [top, tip(c)]]));
}

// ---------- gevelreliëf: lisenen, vensters, plint ----------
// Plint van 0,8 m rond schip, zijbeuken, kapellen en apsis.
const plan = CrossSection.union([
  new CrossSection([ccw(R(AISLE_W, AISLE_E, -AISLE_V, AISLE_V))]),
  new CrossSection([ccw(R(AISLE_E - 1, NAVE_E + 0.5, -NAVE_V, NAVE_V))]),
  new CrossSection([ccw(R(9.46, 17.4, -CHAPEL_V, -5))]),
  new CrossSection([ccw(R(9.13, 16.98, 5, CHAPEL_V + 0.1))]),
  new CrossSection([ccw(APSE)]),
]);
solids.push(Manifold.extrude(plan.offset(0.12, "Miter"), 0.8 - BASE).translate([0, 0, BASE]));
// Traveeën van 3,95 m: lisenen op de zijbeukmuren, rondboogvensters in zijbeuk en lichtbeuk.
const BAYS = [-13.85, -9.9, -5.95, -2.0, 1.95, 5.9];
for (const sy of [-1, 1]) {
  const ang = sy > 0 ? 90 : 270;
  for (const u of [-15.8, -11.85, -7.9, -3.95, 3.9, 7.9])
    if (!(sy > 0 && u < -4.4) && !(sy < 0 && u > -13.7 && u < -6.9)) solids.push(prism(R(u - 0.45, u + 0.45, sy * (AISLE_V - 0.1), sy * (AISLE_V + 0.25)), BASE, 7.0));
  for (const u of BAYS)
    if (Math.abs(u) > 2.5 && !(sy > 0 && u < -4.4) && !(sy < 0 && u > -14.5 && u < -6.3))
      cuts.push(niche([u, sy * AISLE_V], ang, 0, 0, 1.2, 2.6, 5.0, 0.35));
  for (const u of [...BAYS, 9.85, 13.8]) cuts.push(niche([u, sy * NAVE_V], ang, 0, 0, 1.1, 10.0, 11.6, 0.35));
  // Kapellen: twee vensters in de zijmuur en een venster in de oostelijke topgevel.
  const cv = sy > 0 ? CHAPEL_V + 0.1 : CHAPEL_V;
  for (const u of [11.4, 15.2]) cuts.push(niche([u, sy * cv], ang, 0, 0, 1.2, 3.0, 6.6, 0.35));
  cuts.push(niche([sy > 0 ? 16.98 : 17.4, sy * CHAPEL_RV], 0, 0, 0, 1.0, 4.5, 8.0, 0.35));
  // Portalen: deur in de kopgevel.
  cuts.push(niche([0, sy > 0 ? 10.0 : -12.2], ang, 0, sy > 0 ? 0.05 : -0.05, 1.4, 0.1, 2.9, 0.35));
}
// Apsis: hoge rondboogvensters in de zijden en schuine vlakken, roosvenster in de oostwand.
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
cuts.push(niche(mid(APSE[1], APSE[2]), corner(APSE[1], APSE[2]) - 90, 0, 0, 1.3, 4.0, 9.0, 0.38));
cuts.push(niche(mid(APSE[3], APSE[4]), corner(APSE[3], APSE[4]) - 90, 0, 0, 1.3, 4.0, 9.0, 0.38));
cuts.push(rose([25.25, 0], 0, 0, 0, 7.6, 1.3, 0.4));
for (const sy of [-1, 1]) cuts.push(niche([20.9, sy * 5.2], sy > 0 ? 90 : 270, 0, 0, 1.2, 5.0, 9.0, 0.38));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kathedraal", complex]], all = complex;
const META = {
  name: "Sint-Gertrudiskathedraal Utrecht",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0344100000049117"],
  plate: false,
  description:
    "Oud-katholieke Sint-Gertrudiskathedraal aan het Willemsplantsoen in Utrecht (E.G. Wentink jr., 1912-1914, neoromaans): basilicaal schip met zadeldak (nok +20,15 m) en dakkapellen, zijbeuken met lessenaarsdak, kapellen met eigen zadeldak bij het koor, veelhoekige apsis met roosvenster, dubbeltorenfront met tentdaken tot +29,1 m, portaal, dwerggalerij en topgevel, vier achtkante traptorens, zijportalen en de lage aanbouwen van hetzelfde BAG-pand. Oorsprong RD (136463,54; 455645,77) op de as van het schip op het maaiveld van de Mariahoek (NAP +2,92 m), X-as langs de nok onder 30,7 graden naar de apsis. Vensters, galerij en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "1912-1914, architect E.G. Wentink jr.",
    groundNapM: 2.92,
    westGroundM: GW,
    naveRidgeM: RIDGE,
    naveEaveM: +(RIDGE - PITCH * NAVE_V).toFixed(2),
    aisleEaveM: +(AISLE_TOP - AISLE_PITCH * (AISLE_V - NAVE_V)).toFixed(2),
    chapelRidgeM: CHAPEL_RIDGE,
    apseEaveM: APSE_EAVE,
    towerStageM: T_STAGE,
    towerEaveM: T_EAVE,
    towerTopM: T_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Gertrudiskathedraal",
    "https://www.wikidata.org/wiki/Q2395780",
    "https://www.openstreetmap.org/way/237386428",
    "https://commons.wikimedia.org/wiki/Category:Sint_Gertrudiskathedraal,_Utrecht (Sint-Gertrudiskathedraal.JPG, Gertrudiskathedraal Oudkatholiek 9586/9587, SFA022825602 (ca. 1914), Lange Elisabethstraat Mariaplaats panoramio)",
    "BAG pand 0344100000049117 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

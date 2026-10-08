// Genereert een gesloten 3D-model van de Oude Kerk in Amsterdam: de gotische
// hallenkerk met het middenschip onder een zadeldak (nok NAP +27,7 m) met
// dwarse kruiskappen per travee, de zijbeuken onder een zadeldak langs de as
// met daarachter de kapellen onder een rij dwarse zadeldaken met topgevels naar
// buiten, het transept met topgevels aan de noord- en zuidkant, het koor met de
// afgeschilde koorsluiting en de lagere kooromgang, de dakruiter op de
// viering, de lage kapellen en aanbouwen binnen de BAG-contour, en de westtoren
// aan het Oudekerksplein: de bakstenen onderbouw met een uitkragende
// borstwering en hoekpinakels, de met lood beklede uurwerkgeleding, de
// achtkantige open klokkenlantaarn, de peer, de bovenste lantaarn en de spits
// tot 67 m boven het maaiveld. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-oude-kerk-amsterdam.mjs              # 1:1000 (standaard)
//   node scripts/generate-oude-kerk-amsterdam.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alle onderdelen zijn minstens 0,9 m dik en
// staan recht op of lopen schuin omhoog, elke geleding van de toren is smaller
// dan de vorige, de spits loopt uit in een naald van 0,9 m, en de nissen hebben
// een spitse bovenkant van 60 graden. Alleen de borstwering boven de
// bakstenen onderbouw kraagt 0,3 m uit; die vlakke onderkant laat de export de
// nissen behouden (zie de controle onderaan).
//
// Assenstelsel: oorsprong op RD (121656,59, 487499,92), bij de toren (het
// hart van de onderbouw ligt 0,3 m oostelijker), op het maaiveld (NAP +1,4 m),
// Z omhoog. +X loopt langs de as van de
// kerk van de toren naar het koor (RD-richting 2,8 graden, net ten noorden van
// oost), +Y naar het noorden; de toren staat aan de -X-kant, aan het
// Oudekerksplein, het koor aan de Oudezijds Voorburgwal.
//
// Bronnen: BAG-pand 0363100012178469 (contour); AHN DSM/DTM 0,5 m (PDOK WCS)
// in een stelsel langs de as: dwarsprofielen van middenschip, zijbeuken,
// kapellen, transept en koor, de omhullende van de toren per hoogte
// (onderbouw tot +37 m, uurwerkgeleding tot +45,5 m, lantaarn tot +52,5 m,
// peer en bovenste lantaarn tot +62 m, hoogste AHN-punt +65,8 m) en het
// maaiveld; Wikipedia (toren 67 m, spits van Joost Bilhamer uit 1565); foto's
// op Wikimedia Commons (de toren van dichtbij en vanaf de Oudezijds
// Voorburgwal); PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "oude-kerk-amsterdam");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 1,4 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [121656.59, 487499.92];
const ANGLE = (2.8 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 1.4;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour van de kerk (lokaal), met de toren, de kapellen en de aanbouwen.
const OUTLINE = [
  [76.16, 1.94], [76.15, 2.77], [71.51, 9.23], [64.45, 12.0], [64.48, 25.49], [54.76, 28.19], [48.39, 29.18],
  [46.87, 29.17], [46.84, 30.35], [45.84, 30.63], [45.77, 30.63], [45.8, 29.19], [35.72, 28.98], [35.69, 30.51],
  [34.71, 30.49], [34.74, 28.96], [33.25, 28.93], [33.25, 28.51], [30.1, 28.53], [30.09, 27.98], [27.63, 29.35],
  [27.6, 29.79], [27.28, 29.76], [27.31, 29.28], [25.0, 27.81], [24.57, 28.05], [24.42, 27.77], [24.8, 27.56],
  [24.79, 25.64], [23.9, 25.64], [23.17, 24.88], [20.19, 27.71], [4.65, 24.74], [4.65, 24.11], [3.66, 24.1],
  [3.68, 23.16], [2.75, 23.13], [2.75, 22.25], [0.94, 22.25], [0.94, 22.16], [-1.26, 20.05], [-1.36, 20.06],
  [-1.89, 16.41], [2.32, 15.98], [2.27, 16.82], [3.82, 16.95], [3.83, 5.45], [-3.64, 5.44], [-5.01, 5.49],
  [-5.12, 2.17], [-5.27, 2.18], [-5.3, 1.33], [-5.15, 1.32], [-5.16, 0.93], [-5.24, -1.33], [-5.39, -1.32],
  [-5.42, -2.27], [-5.27, -2.28], [-5.38, -5.37], [-4.01, -5.42], [3.84, -5.41], [3.85, -13.96], [-0.16, -13.96],
  [-1.15, -15.12], [-1.15, -17.36], [-0.16, -18.51], [0.62, -18.51], [3.85, -18.5], [3.86, -26.11], [19.94, -25.74],
  [20.04, -30.34], [20.1, -32.94], [25.99, -32.81], [25.99, -32.67], [25.95, -31.12], [28.41, -32.13],
  [28.34, -32.61], [28.78, -32.68], [28.84, -32.26], [33.89, -32.21], [34.1, -32.42], [35.13, -32.42],
  [35.15, -33.61], [35.66, -33.89], [35.96, -33.89], [35.96, -34.14], [36.06, -34.14], [36.36, -34.92],
  [36.36, -35.02], [45.73, -35.09], [45.73, -34.99], [46.05, -34.21], [46.15, -34.22], [46.15, -33.97],
  [46.94, -33.98], [46.96, -32.43], [48.49, -32.45], [48.51, -31.46], [46.98, -31.44], [47.05, -25.88],
  [47.15, -18.53], [61.14, -18.72], [61.05, -25.75], [61.33, -25.75], [65.89, -20.63], [64.39, -18.76],
  [64.4, -12.93], [71.58, -10.15], [76.24, -3.75],
];
// Alles binnen de contour tot de lage aanbouwen (de kerkhuisjes tegen de
// noordgevel en de kapelletjes in de hoeken).
const LOW = 5.0;
// Middenschip: muren tot de goot, zadeldak met de nok iets ten zuiden van de
// as van de toren, van de westgevel tot de koorsluiting; ten oosten van de
// viering iets lager.
const NAVE = { south: -7.35, north: 4.85, ridgeY: -1.1, eave: 20.5, x: [3.85, 40.85, 64.05], ridge: [27.7, 27.0] };
// Dwarse kruiskappen over het middenschip (per travee, tot de nok), de
// breedste over de viering.
const CROSS_GABLES = [
  ...[7.65, 12.65, 17.65, 22.65, 27.65, 32.65].map((x) => ({ x, half: 2.2, ridge: 27.6 })),
  { x: 40.85, half: 3.0, ridge: 27.5 },
  ...[50.15, 59.65].map((x) => ({ x, half: 2.6, ridge: 27.0 })),
];
// Koorsluiting: halve tienhoek rond APSE.center die naar de nok afschildt.
const APSE = { center: [64.05, -1.25], radius: 6.1, eave: 19.5 };
// Zijbeuken: zadeldak langs de as tussen de kil tegen het middenschip en de
// kapellen.
const AISLES = [
  { side: 1, inner: NAVE.north, ridgeY: 10.85, outer: 16.85, ridge: 23.3, x: [3.85, 64.45] },
  { side: -1, inner: -NAVE.south, ridgeY: 13.4, outer: 19.45, ridge: 23.5, x: [3.85, 35.0] },
];
const GUTTER = 15.5;
// Kapellen langs de zijbeuken: per travee een dwars zadeldak van de nok van
// de zijbeuk tot de topgevel in de buitenmuur. [west, oost, nok-x, goot west,
// goot oost].
const BAYS = [
  { from: 10.85, wall: 22.85, ridge: 23.8, bays: [[3.85, 14.65, 9.85, 14.5, 14.5], [14.65, 24.85, 20.25, 14.5, 14.5], [24.85, 35.0, 29.25, 14.5, 14.5]] },
  { from: 10.85, wall: 24.5, ridge: 24.0, bays: [[46.65, 55.15, 50.65, 15.0, 20.0], [55.15, 64.45, 59.45, 20.0, 19.0]] },
  { from: -13.4, wall: -26.0, ridge: 23.8, bays: [[3.85, 14.65, 9.65, 15.0, 15.0], [14.65, 25.65, 20.15, 15.0, 15.0], [25.65, 35.0, 30.3, 15.0, 15.0]] },
];
// Transept: dwars zadeldak van de noordgevel tot de zuidgevel.
const TRANSEPT = { x: [35.0, 46.65], ridgeX: 40.6, north: 28.85, south: -32.45, eave: 14.5, ridge: 24.0 };
// Zuidkant van het koor: zadeldak langs de as.
const SOUTH_CHOIR = { x: [46.65, 64.4], ridgeY: -12.65, wall: -18.65, ridge: 23.5, eave: 14.5 };
// Kooromgang: van de koorsluiting naar de BAG-contour.
const AMBULATORY = {
  outline: [[64.45, 12.0], [71.51, 9.23], [76.15, 2.77], [76.16, 1.94], [76.24, -3.75], [71.58, -10.15], [64.4, -12.93]],
  low: 16.0,
  high: 17.0,
};
// Lagere delen binnen de contour: [x, y, bovenkant].
const ANNEXES = [
  { name: "portaal zuidtransept", x: [35.9, 46.2], y: [-35.2, -32.4], top: 9.5 },
  { name: "kapellen zuid", x: [19.9, 35.0], y: [-33.0, -25.9], top: 10.0 },
  { name: "aanbouw noord", x: [20.0, 35.0], y: [22.8, 30.0], top: 8.5 },
  { name: "aanbouw noordwest", x: [-2.0, 3.85], y: [15.8, 22.5], top: 10.5 },
  { name: "traptoren zuidwest", x: [-1.2, 3.85], y: [-18.6, -13.9], top: 15.0 },
];
// Dakruiter op de viering.
const RIDGE_TURRET = { centre: [40.85, -0.85], radius: 1.3, top: 31.0, tip: 37.0 };
// Toren rond CENTRE: bakstenen onderbouw (op de BAG-voet tot +9 m) met een
// uitkragende borstwering en vier hoekpinakels, een loden rok naar de
// uurwerkgeleding met afgeschuinde hoeken, de achtkantige klokkenlantaarn met
// pinakels op de omgang, de peer, de bovenste lantaarn, de kap en de naald.
const TOWER = {
  centre: [0.3, -0.05],
  plinth: { x: [-5.4, 3.85], y: [-5.45, 5.5], top: 9.0 },
  base: { half: [4.9, 4.85], top: 36.0 },
  parapet: { overhang: 0.3, width: 0.9, top: 37.0 },
  corner: { offset: [4.45, 4.4], size: 0.9, top: 39.5, tip: 42.0 },
  skirt: { half: [4.6, 4.55], top: 39.0 },
  clock: { half: 4.0, chamfer: 1.0, top: 45.5 },
  pinnacle: { radius: 3.7, size: 0.9, top: 47.0, tip: 50.0 },
  lantern: { apothem: 2.8, top: 52.5 },
  bulge: { radius: 2.7, at: 54.0, upper: 1.45, top: 57.5 },
  upper: { apothem: 1.45, top: 60.5 },
  cap: { apothem: 0.9, top: 62.5 },
  needle: { apothem: 0.45, top: 66.0, tip: GROUND_NAP + 67 },
};
// Vensters als spitsboognissen.
const WINDOW = { depth: 0.5 };
// Maaiveld rondom (NAP +1,3 tot +1,6 m): het Oudekerksplein voor de toren en
// het plein langs de noord- en zuidkant. Aan de Oudezijds Voorburgwal (oost)
// ligt de kade 0,4 m lager; die laat de lader buiten beschouwing.
const GROUND_SAMPLES = [[-9, 0], [20, 32], [20, -35]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
const outline = prism(OUTLINE, BASE - 1, 200);
const clip = (solid) => Manifold.intersection(outline, solid);
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const unit = (deg) => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
// Vierkante pinakel: schacht tot `top` (NAP) en een piramide tot `tip`.
const pinnacle = ([x, y], size, top, tip) => {
  const h = size / 2;
  const square = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]];
  return Manifold.hull([...at(square, BASE), ...at(square, NAP(top)), [x, y, NAP(tip)]]);
};
// Regelmatige achthoek met de vlakken op de assen (apothema a).
const octagon = ([cx, cy], a) =>
  [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => polar([cx, cy], a / Math.cos(Math.PI / 8), deg));
const circle = (c, r, n = 24) => Array.from({ length: n }, (_, k) => polar(c, r, (360 * k) / n));
// Vierkant met afgeschuinde hoeken (halve breedte h, afschuining c langs elke zijde).
const chamfered = ([cx, cy], h, c) => [
  [cx - h + c, cy - h], [cx + h - c, cy - h], [cx + h, cy - h + c], [cx + h, cy + h - c],
  [cx + h - c, cy + h], [cx - h + c, cy + h], [cx - h, cy + h - c], [cx - h, cy - h + c],
];
// Spitsboognis in een gevel: breedte w, van z0 tot z1 (NAP), bovenkant onder 60
// graden. `at` is het midden onderaan op het gevelvlak, `normal` de richting
// naar buiten (eenheidsvector in het grondvlak); `out` is hoe ver de nis naar
// buiten doorloopt (klein houden waar een lager dak tegen de gevel ligt).
const niche = ([cx, cy], [nx, ny], w, z0, z1, depth, out = 1.5) => {
  const rise = (w / 2) * Math.tan(Math.PI / 3);
  const profile = [[-w / 2, NAP(z0)], [w / 2, NAP(z0)], [w / 2, NAP(z1) - rise], [0, NAP(z1)], [-w / 2, NAP(z1) - rise]];
  const pts = [];
  for (const d of [-depth, out]) {
    for (const [u, z] of profile) pts.push([cx + nx * d - ny * u, cy + ny * d + nx * u, z]);
  }
  return Manifold.hull(pts);
};

// ---------- opbouw: kerk ----------
const parts = [clip(box([-100, 100], [-100, 100], BASE, NAP(LOW)))];
// Middenschip in twee delen (west en oost van de viering), het oostdeel met de
// koorsluiting.
{
  const N = NAVE;
  const [x0, x1, x2] = N.x;
  const west = rect([x0, x1], [N.south, N.north]);
  parts.push(Manifold.hull([...at(west, BASE), ...at(west, NAP(N.eave)), [x0, N.ridgeY, NAP(N.ridge[0])], [x1, N.ridgeY, NAP(N.ridge[0])]]));
  const apsePoints = [90, 54, 18, -18, -54, -90].map((deg) => polar(APSE.center, APSE.radius, deg));
  parts.push(
    Manifold.hull([
      ...at([[x1, N.south], [x2, N.south], [x2, N.north], [x1, N.north]], BASE),
      ...at([[x1, N.south], [x2, N.south], [x2, N.north], [x1, N.north]], NAP(N.eave)),
      ...at(apsePoints, BASE),
      ...at(apsePoints, NAP(APSE.eave)),
      [x1, N.ridgeY, NAP(N.ridge[1])],
      [APSE.center[0], N.ridgeY, NAP(N.ridge[1])],
    ]),
  );
  // Kruiskappen.
  for (const g of CROSS_GABLES) {
    const r = rect([g.x - g.half, g.x + g.half], [N.south, N.north]);
    parts.push(Manifold.hull([...at(r, BASE), ...at(r, NAP(N.eave)), [g.x, N.south, NAP(g.ridge)], [g.x, N.north, NAP(g.ridge)]]));
  }
}
// Zijbeuken langs de as.
for (const a of AISLES) {
  const profile = [[a.inner, BASE], [a.inner, NAP(GUTTER)], [a.ridgeY, NAP(a.ridge)], [a.outer, NAP(GUTTER)], [a.outer, BASE]];
  parts.push(clip(Manifold.hull(a.x.flatMap((x) => profile.map(([y, z]) => [x, a.side * y, z])))));
}
// Kapellen: dwarse zadeldaken met een topgevel in de buitenmuur.
const bayRidges = [];
for (const row of BAYS) {
  const inner = row.from > 0 ? NAVE.north : NAVE.south;
  for (const [x0, x1, rx, e0, e1] of row.bays) {
    parts.push(
      clip(
        Manifold.hull([
          ...at([[x0, inner], [x0, row.wall], [x1, inner], [x1, row.wall]], BASE),
          [x0, inner, NAP(e0)], [x0, row.wall, NAP(e0)],
          [x1, inner, NAP(e1)], [x1, row.wall, NAP(e1)],
          [rx, row.from, NAP(row.ridge)], [rx, row.wall, NAP(row.ridge)],
        ]),
      ),
    );
    bayRidges.push({ x: rx, wall: row.wall, ridge: row.ridge, eave: Math.max(e0, e1), width: x1 - x0 });
  }
}
// Transept.
{
  const T = TRANSEPT;
  const r = rect(T.x, [T.south, T.north]);
  parts.push(clip(Manifold.hull([...at(r, BASE), ...at(r, NAP(T.eave)), [T.ridgeX, T.south, NAP(T.ridge)], [T.ridgeX, T.north, NAP(T.ridge)]])));
}
// Zuidkant van het koor.
{
  const S = SOUTH_CHOIR;
  const profile = [[NAVE.south, BASE], [NAVE.south, NAP(GUTTER)], [S.ridgeY, NAP(S.ridge)], [S.wall, NAP(S.eave)], [S.wall, BASE]];
  parts.push(clip(Manifold.hull(S.x.flatMap((x) => profile.map(([y, z]) => [x, y, z])))));
}
// Kooromgang.
{
  const inner = [90, 54, 18, -18, -54, -90].map((deg) => polar(APSE.center, APSE.radius, deg));
  parts.push(
    clip(
      Manifold.hull([
        ...at(AMBULATORY.outline, BASE),
        ...at(AMBULATORY.outline, NAP(AMBULATORY.low)),
        ...at(inner, BASE),
        ...at(inner, NAP(AMBULATORY.high)),
      ]),
    ),
  );
}
// Lagere kapellen, portalen en aanbouwen.
for (const a of ANNEXES) parts.push(clip(box(a.x, a.y, BASE, NAP(a.top))));
// Dakruiter.
{
  const R = RIDGE_TURRET;
  const ring = octagon(R.centre, R.radius);
  parts.push(Manifold.hull([...at(ring, BASE), ...at(ring, NAP(R.top)), [...R.centre, NAP(R.tip)]]));
}

// Vensters als nissen: het grote venster in elke topgevel van de kapellen en
// het transept.
const windows = [];
for (const b of bayRidges) {
  const normal = b.wall > 0 ? [0, 1] : [0, -1];
  const top = Math.min(b.ridge - 3.0, 21.0);
  windows.push(niche([b.x, b.wall], normal, Math.min(3.0, b.width - 4), 10.8, top, WINDOW.depth));
}
windows.push(niche([TRANSEPT.ridgeX, TRANSEPT.north], [0, 1], 4.0, 10.5, 21.0, WINDOW.depth));
windows.push(niche([TRANSEPT.ridgeX, TRANSEPT.south], [0, -1], 4.0, 10.5, 21.0, WINDOW.depth));

// ---------- opbouw: toren ----------
const T = TOWER;
const [tcx, tcy] = T.centre;
const rectAround = ([hx, hy]) => rect([tcx - hx, tcx + hx], [tcy - hy, tcy + hy]);
const towerParts = [
  clip(box(T.plinth.x, T.plinth.y, BASE, NAP(T.plinth.top))),
  prism(rectAround(T.base.half), BASE, NAP(T.base.top)),
];
// Borstwering boven de onderbouw: kraagt 0,3 m uit; die vlakke onderkant laat
// de export de nissen behouden (overhangopvulling in plaats van verticale
// opvulling).
{
  const [hx, hy] = T.base.half;
  const o = T.parapet.overhang;
  const w = T.parapet.width;
  towerParts.push(
    prism(rectAround([hx + o, hy + o]), NAP(T.base.top), NAP(T.parapet.top)).subtract(
      prism(rectAround([hx + o - w, hy + o - w]), BASE - 1, 200),
    ),
  );
}
// Hoekpinakels op de borstwering.
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  towerParts.push(pinnacle([tcx + sx * T.corner.offset[0], tcy + sy * T.corner.offset[1]], T.corner.size, T.corner.top, T.corner.tip));
}
// Loden rok en uurwerkgeleding met afgeschuinde hoeken.
const clockPlan = chamfered(T.centre, T.clock.half, T.clock.chamfer);
towerParts.push(
  Manifold.hull([...at(rectAround(T.skirt.half), BASE), ...at(rectAround(T.skirt.half), NAP(T.parapet.top)), ...at(clockPlan, NAP(T.skirt.top))]),
  prism(clockPlan, BASE, NAP(T.clock.top)),
);
// Pinakels op de omgang rond de klokkenlantaarn.
for (const deg of [45, 135, 225, 315]) {
  towerParts.push(pinnacle(polar(T.centre, T.pinnacle.radius, deg), T.pinnacle.size, T.pinnacle.top, T.pinnacle.tip));
}
// Achtkantige klokkenlantaarn, peer, bovenste lantaarn, kap en naald.
{
  const lantern = octagon(T.centre, T.lantern.apothem);
  const upper = octagon(T.centre, T.upper.apothem);
  const cap = octagon(T.centre, T.cap.apothem);
  const needle = octagon(T.centre, T.needle.apothem);
  towerParts.push(
    prism(lantern, BASE, NAP(T.lantern.top)),
    Manifold.hull([...at(lantern, NAP(T.lantern.top) - 0.5), ...at(circle(T.centre, T.bulge.radius), NAP(T.bulge.at)), ...at(circle(T.centre, T.bulge.upper), NAP(T.bulge.top))]),
    prism(upper, NAP(T.bulge.top) - 0.5, NAP(T.upper.top)),
    Manifold.hull([...at(upper, NAP(T.upper.top) - 0.5), ...at(cap, NAP(T.cap.top))]),
    Manifold.hull([...at(needle, NAP(T.cap.top) - 0.5), ...at(needle, NAP(T.needle.top)), [tcx, tcy, NAP(T.needle.tip)]]),
  );
}
let tower = Manifold.union(towerParts);
// Nissen: het portaal in de westgevel, twee rijen van twee hoge nissen in de
// west-, noord- en zuidgevel van de onderbouw (boven de kerkhuisjes), het
// uurwerk in elke gevel van de loden geleding en een galmgat in elk vlak van
// de klokkenlantaarn op de assen.
const faces = ([hx, hy]) => [
  [[tcx - hx, tcy], [-1, 0], "w"],
  [[tcx, tcy + hy], [0, 1], "n"],
  [[tcx, tcy - hy], [0, -1], "z"],
  [[tcx + hx, tcy], [1, 0], "o"],
];
const towerNiches = [niche([tcx - T.base.half[0], tcy], [-1, 0], 2.6, GROUND_NAP, 7.0, 0.8)];
for (const [[fx, fy], [nx, ny], side] of faces(T.base.half)) {
  if (side === "o") continue;
  for (const k of [-2.0, 2.0]) {
    const at0 = [fx - ny * k, fy + nx * k];
    towerNiches.push(niche(at0, [nx, ny], 1.8, 13.0, 22.0, 0.5), niche(at0, [nx, ny], 2.0, 25.0, 34.5, 0.5));
  }
}
for (const [[fx, fy], [nx, ny]] of faces([T.clock.half, T.clock.half])) {
  towerNiches.push(niche([fx, fy], [nx, ny], 2.4, 40.0, 44.5, 0.4));
}
for (const deg of [0, 90, 180, 270]) {
  towerNiches.push(niche(polar(T.centre, T.lantern.apothem, deg), unit(deg), 1.2, 47.0, 51.8, 0.4));
}
tower = tower.subtract(Manifold.union(towerNiches));
parts.push(tower);

const church = Manifold.union(parts).subtract(Manifold.union(windows));
const nodes = [["building:oude-kerk-amsterdam", church]];

// ---------- controles ----------
if (church.status() !== "NoError") throw new Error(church.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // alleen de uitkragende borstwering boven de onderbouw hoort erbij.
  const mesh = church.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const levels = new Map();
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const z = Math.min(...p.map((q) => q[2])).toFixed(2);
    levels.set(z, (levels.get(z) ?? 0) + len / 2);
  }
  console.log("ondervlakken (lokale z: m2):", Object.fromEntries(levels));
  const allowed = NAP(TOWER.base.top).toFixed(2);
  for (const [z, area] of levels) if (z !== allowed && area > 0.01) throw new Error(`overhang op z ${z}`);
  if (!levels.has(allowed)) throw new Error("uitkraging van de borstwering ontbreekt");
  const bb = church.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
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
  const nodes = [];
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
    nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
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
for (const [name, solid] of nodes) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "oude-kerk-amsterdam.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-oude-kerk-amsterdam.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `oude-kerk-amsterdam-1-${scale}.stl`);
const printSolid = church.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Oude Kerk Amsterdam 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

await writeFile(
  path.join(outDir, "oude-kerk-amsterdam.json"),
  JSON.stringify(
    {
      name: "Oude Kerk",
      file: "oude-kerk-amsterdam.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +1,3 tot +1,6 m): het Oudekerksplein voor
      // de toren en langs de noord- en zuidkant; niet aan de lagere kade van
      // de Oudezijds Voorburgwal.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0363100012178469"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (121656,59, 487499,92), bij de toren (het hart van de onderbouw ligt 0,3 m oostelijker), op het maaiveld (NAP +1,4 m), +X langs de as van de toren naar het koor (RD-richting 2,8 graden, net ten noorden van oost) en +Y naar het noorden; de toren staat aan de -X-kant, aan het Oudekerksplein. Eén node building: alles binnen de BAG-contour tot NAP +5 m (de kerkhuisjes en aanbouwen), het middenschip onder een zadeldak (goot +20,5 m, nok +27,7 m, oostelijk van de viering +27 m) met dwarse kruiskappen per travee, de zijbeuken onder zadeldaken langs de as (nok +23,3 en +23,5 m) met daarachter de kapellen onder dwarse zadeldaken (nok +23,8 tot +24 m) met topgevels en vensternissen naar buiten, het transept (nok +24 m) met topgevels aan de noord- en zuidkant, de koorsluiting en de kooromgang (+17 m), de zuidkant van het koor onder een zadeldak, de lagere kapellen en het portaal aan de zuidkant, de dakruiter op de viering tot +37 m, en de westtoren met de bakstenen onderbouw tot +36 m met portaal en nissen, een borstwering met hoekpinakels tot +37 m die 0,3 m uitkraagt, de loden uurwerkgeleding tot +45,5 m, de achtkantige klokkenlantaarn tot +52,5 m met pinakels op de omgang, de peer, de bovenste lantaarn tot +60,5 m, de kap en de naald tot 67 m boven het maaiveld (NAP +68,4 m). Alles staat recht op of loopt schuin omhoog, behalve de borstwering die 0,3 m uitkraagt, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0363100012178469. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`oude-kerk-amsterdam-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        naveRidgeNapM: NAVE.ridge[0],
        aisleRidgeNapM: AISLES[1].ridge,
        transeptRidgeNapM: TRANSEPT.ridge,
        towerBaseNapM: TOWER.parapet.top,
        towerClockNapM: TOWER.clock.top,
        towerLanternNapM: TOWER.lantern.top,
        towerTipNapM: TOWER.needle.tip,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Oude_Kerk_(Amsterdam)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/3990",
        "PDOK BAG pand 0363100012178469 (contour), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dwarsprofielen van middenschip, zijbeuken, kapellen, transept en koor, omhullende van de toren per hoogte, maaiveld",
        "Wikimedia Commons: foto's van de toren (Amsterdam, Oude Kerk, toren 09; Oudezijds Voorburgwal 2011)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

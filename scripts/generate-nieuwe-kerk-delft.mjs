// Genereert een gesloten 3D-model van de Nieuwe Kerk in Delft: de gotische
// kruisbasiliek met het schip onder een zadeldak (nok NAP +30,5 m), de
// zijbeuken langs het schip onder eigen zadeldaken evenwijdig aan de as, het
// transept met de zuidgevel en twee traptorentjes en een afgewolfd noordeind
// met portaal, het hogere koor (nok +36 m) met de afgeschilde koorsluiting, de
// koorzijbeuken en de kooromgang onder lessenaarsdaken met pinakels op de
// steunberen, de sacristie aan de zuidoostkant, en de westtoren aan de Markt:
// de bakstenen onderbouw met steunberen op de hoeken en een uitkragende
// borstwering, de witstenen vierkante geleding met vier hoektorentjes, de
// achtkantige klokkengeleding met pinakels en de achtkantige spits tot
// +108,75 m. Alle maten in het script zijn meters op ware grootte. Uitvoer:
// een GLB in meters (Y omhoog, één node met de materiaalklasse in de nodenaam)
// als catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-nieuwe-kerk-delft.mjs              # 1:1000 (standaard)
//   node scripts/generate-nieuwe-kerk-delft.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alle onderdelen zijn minstens 0,9 m dik en
// staan recht op of lopen schuin omhoog, elke geleding van de toren is smaller
// dan de vorige, de spits loopt uit in een naald van 0,9 m, en de nissen hebben
// een spitse bovenkant van 60 graden. Alleen de borstwering boven de
// bakstenen onderbouw kraagt 0,3 m uit; die vlakke onderkant laat de export de
// nissen behouden (zie de controle onderaan).
//
// Assenstelsel: oorsprong op RD (84543,63, 447609,12), op de viering, op het
// maaiveld (NAP +0,3 m), Z omhoog. +X loopt langs de as van de kerk van de
// toren naar het koor in het oostnoordoosten (RD-richting 31,66 graden), +Y
// naar het noordnoordwesten; de toren staat aan de -X-kant, aan de Markt.
//
// Bronnen: BAG-pand 0503100000000209 (contour); AHN DSM/DTM 0,5 m (PDOK WCS)
// in een stelsel langs de as: dwarsprofielen van schip, zijbeuken, transept,
// koor, koorzijbeuken en kooromgang, de omhullende van de toren per hoogte
// (onderbouw tot +39,5 m, vierkante geleding tot +57 m, achtkant tot +75,5 m,
// spits tot +103 m in het AHN) en het maaiveld; Wikipedia (toren 108,75 m,
// bovenste achtkant van Bentheimer zandsteen); foto's op Wikimedia Commons
// (Rijksdienst voor het Cultureel Erfgoed, toren en zuidgevel); PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "nieuwe-kerk-delft");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 0,3 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [84543.63, 447609.12];
const ANGLE = (31.66 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 0.3;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour van de kerk (lokaal).
const OUTLINE = [
  [11.1, 16.2], [11.3, 16.2], [11.4, 17.5], [10.0, 17.5], [10.0, 17.3], [6.5, 17.3], [6.5, 17.8], [5.1, 18.0],
  [5.1, 18.4], [-5.1, 18.6], [-5.1, 18.0], [-5.7, 18.0], [-5.7, 16.4], [-6.7, 16.4], [-6.7, 15.4], [-8.2, 15.3],
  [-8.2, 14.4], [-9.9, 14.5], [-9.9, 14.7], [-10.9, 14.7], [-10.9, 14.5], [-15.0, 14.5], [-15.0, 14.7],
  [-16.0, 14.7], [-16.0, 14.5], [-20.1, 14.5], [-20.1, 14.8], [-21.1, 14.7], [-21.1, 14.5], [-25.2, 14.5],
  [-25.2, 14.7], [-26.3, 14.7], [-26.3, 14.5], [-30.4, 14.5], [-30.4, 14.7], [-31.5, 14.7], [-31.5, 14.5],
  [-35.4, 14.5], [-35.4, 14.7], [-36.5, 14.7], [-36.5, 14.5], [-40.4, 14.5], [-40.4, 14.7], [-41.5, 14.7],
  [-41.5, 14.5], [-46.0, 14.5], [-46.0, 14.7], [-47.2, 14.7], [-47.2, 14.5], [-48.4, 14.5], [-48.5, 13.4],
  [-47.2, 13.4], [-47.1, 6.5], [-49.1, 6.5], [-49.1, 9.0], [-50.8, 9.0], [-50.8, 6.5], [-60.1, 6.4], [-60.1, 8.9],
  [-61.9, 8.9], [-61.8, 6.4], [-64.3, 6.4], [-64.1, -5.7], [-65.9, -6.8], [-66.4, -6.5], [-66.7, -7.1],
  [-66.3, -7.4], [-66.2, -9.6], [-66.7, -9.9], [-66.3, -10.5], [-65.9, -10.3], [-64.0, -11.3], [-64.0, -11.8],
  [-61.9, -11.8], [-61.9, -11.2], [-61.6, -11.2], [-61.6, -13.5], [-63.2, -13.5], [-63.2, -14.7], [-61.7, -14.7],
  [-61.7, -16.1], [-60.6, -16.0], [-60.5, -14.6], [-56.3, -14.7], [-56.3, -14.9], [-55.2, -14.9], [-55.2, -14.7],
  [-51.3, -14.7], [-51.3, -14.9], [-50.9, -14.9], [-50.2, -14.9], [-50.2, -14.7], [-46.4, -14.7], [-46.4, -14.9],
  [-45.3, -14.9], [-45.3, -14.7], [-41.3, -14.7], [-41.3, -14.9], [-40.2, -14.9], [-40.2, -14.7], [-36.2, -14.7],
  [-36.2, -16.3], [-35.1, -16.3], [-35.1, -14.8], [-31.1, -14.8], [-31.1, -15.0], [-30.1, -15.0], [-30.1, -14.8],
  [-26.1, -14.8], [-26.1, -16.4], [-25.0, -16.4], [-25.0, -14.8], [-21.0, -14.8], [-21.0, -15.0], [-19.9, -15.0],
  [-19.9, -14.8], [-15.8, -14.8], [-15.8, -16.4], [-14.7, -16.4], [-14.7, -14.8], [-10.6, -14.8], [-10.6, -15.0],
  [-9.5, -15.0], [-9.5, -14.8], [-7.6, -14.8], [-7.6, -15.0], [-5.4, -15.0], [-5.4, -15.3], [-5.2, -15.3],
  [-5.2, -16.4], [-4.2, -16.4], [-4.2, -15.3], [5.1, -15.3], [5.1, -16.3], [6.1, -16.3], [6.1, -15.2], [6.4, -15.2],
  [6.4, -15.0], [8.5, -15.0], [8.5, -14.8], [10.3, -14.7], [10.3, -15.8], [11.5, -15.8], [11.5, -14.8],
  [15.2, -14.8], [15.2, -15.8], [16.5, -15.8], [16.5, -14.8], [20.2, -14.8], [20.2, -15.8], [21.4, -15.8],
  [21.4, -14.8], [25.1, -14.8], [25.1, -17.1], [25.9, -17.1], [25.9, -17.5], [31.9, -17.1], [31.7, -15.8],
  [32.3, -15.7], [32.4, -16.7], [37.4, -15.7], [37.3, -14.7], [38.0, -15.4], [40.2, -15.4], [40.9, -14.5],
  [40.7, -14.3], [43.7, -10.4], [44.3, -10.7], [44.8, -9.4], [44.3, -9.1], [46.0, -4.3], [46.3, -4.4], [46.7, -3.2],
  [45.9, -1.9], [44.7, -1.7], [44.6, -2.1], [40.0, -1.4], [39.8, 2.3], [40.9, 2.6], [40.7, 3.9], [39.6, 3.7],
  [38.3, 7.3], [39.3, 7.9], [38.6, 9.0], [37.7, 8.4], [35.2, 11.4], [35.9, 12.2], [35.0, 13.0], [34.2, 12.1],
  [30.9, 14.1], [31.3, 15.1], [30.1, 15.6], [29.7, 14.5], [25.9, 15.1], [25.9, 16.3], [24.7, 16.3], [24.7, 15.3],
  [21.1, 15.2], [21.1, 16.3], [19.8, 16.3], [19.8, 15.2], [16.3, 15.2], [16.3, 16.3], [15.0, 16.3], [15.0, 15.2],
  [11.3, 15.2], [11.1, 15.3],
];
// Alles binnen de contour tot de bovenkant van de steunberen, behalve de lage
// kluis tussen de koorzijbeuk en de sacristie.
const LOW = 9.0;
const KLUIS = { x: [24.5, 38.0], y: [-18.0, -14.9], top: 4.5 };
// Schip: muren tot de goot, zadeldak, van de toren tot de viering.
const NAVE = { halfWidth: 6.5, eave: 19.8, ridge: 30.5, x: [-50.5, 0] };
// Zijbeuken langs het schip: zadeldak evenwijdig aan de as, van de kil tegen
// de lichtbeukmuur over de nok naar de goot aan de buitenmuur. De zuidbeuk
// loopt langs de toren door tot de westgevel.
const AISLES = [
  { side: 1, x: [-48.4, -6.25], wall: 14.6, valley: 13.6, ridgeY: 10.0, ridge: 17.5, eave: 10.4 },
  { side: -1, x: [-62.0, -6.25], wall: 14.8, valley: 14.0, ridgeY: 10.0, ridge: 17.7, eave: 11.3 },
];
// Transept: zadeldak dwars op de as, topgevel aan de zuidkant, afgewolfd aan
// de noordkant, met een lager portaal ervoor en traptorentjes op de zuidhoeken.
const TRANSEPT = { halfWidth: 6.25, south: -14.9, north: 16.0, hipFrom: 9.8, eave: 20.0, ridge: 30.6, cross: 32.2 };
const PORCH = { x: [-5.1, 5.1], y: [14.0, 18.6], top: 18.0 };
const TURRETS = { centres: [[-4.7, -15.85], [5.6, -15.85]], radius: 0.9, top: 22.5, tip: 25.5 };
// Koor: hoger dan het schip, muren tot de goot, zadeldak, koorsluiting als
// halve tienhoek rond APSE.center die naar de nok afschildt.
const CHOIR = { halfWidth: 6.9, eave: 25.0, ridge: 36.0, from: 3.5 };
const APSE = { center: [25.05, 0], radius: 6.9 };
// Koorzijbeuken en kooromgang: lessenaarsdak van de lichtbeukmuur naar de
// buitenmuur, de omgang als halve achttienhoek met straal 15,2 m.
const CHOIR_AISLE = { x: [6.25, 25.05], high: 20.6, low: 13.4, north: 15.3, south: -14.8 };
const AMBULATORY = { radius: 15.2, high: 20.6, low: 13.0 };
// Steunberen van koorzijbeuken en kooromgang (uit de BAG-contour) met pinakels.
const PINNACLES = {
  north: [15.65, 20.45, 25.3],
  south: [10.9, 15.85, 20.8],
  ambulatory: [70, 51, 31, 12],
  size: 1.0,
  top: 14.0,
  tip: 17.0,
};
// Sacristie aan de zuidoostkant van het koor: schilddak naar een top.
const SACRISTY = {
  plan: [[36.0, -14.6], [40.2, -15.4], [43.7, -10.4], [46.0, -4.3], [46.7, -3.2], [45.9, -1.9], [40.0, -1.4], [37.0, -6.0]],
  eave: 12.5,
  apex: [42.0, -5.5, 17.0],
};
// Traptoren op de zuidwesthoek van de toren.
const STAIR = { centre: [-64.6, -8.5], radius: 2.0, top: 10.5, tip: 13.5 };
// Toren rond CENTRE: bakstenen onderbouw met steunberen op de hoeken en een
// uitkragende borstwering, witstenen vierkante geleding met hoektorentjes,
// achtkantige klokkengeleding met pinakels en de spits met een naald.
const TOWER = {
  centre: [-56.3, 0.2],
  base: { half: 6.1, top: 39.5 },
  buttress: { width: 1.4, steps: [[29.0, 1.5], [38.5, 0.8]] },
  parapet: { overhang: 0.3, width: 0.9, top: 40.7 },
  square: { half: 5.8, top: 52.0 },
  corner: { offset: 5.0, radius: 1.0, top: 56.0, tip: 60.5 },
  octagon: { apothem: 4.6, top: 75.5 },
  pinnacle: { radius: 4.3, size: 0.9, top: 77.0, tip: 80.5 },
  spire: { apothem: 3.0, middle: 2.0, middleTop: 88.0, upper: 0.45, upperTop: 101.0, tip: 108.75 },
};
// Vensters als spitsboognissen.
const WINDOW = { depth: 0.5 };
// Maaiveld rondom (NAP +0,2 tot +0,8 m): de Markt voor de toren, de straat
// langs de zuidbeuk en het transept, en de straat langs de noordkant van het koor.
const GROUND_SAMPLES = [[-72, 0], [0, -24], [-30, -22], [20, 19]];

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
// Vierkante pinakel: schacht tot `top` (NAP) en een piramide tot `tip`.
const pinnacle = ([x, y], size, top, tip) => {
  const h = size / 2;
  const square = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]];
  return Manifold.hull([...at(square, BASE), ...at(square, NAP(top)), [x, y, NAP(tip)]]);
};
// Achtkantig torentje vanaf de onderkant: schacht tot `top` en een spits tot `tip` (NAP).
const turret = ([x, y], r, top, tip) =>
  Manifold.union([
    Manifold.cylinder(NAP(top) - BASE, r, r, 8).translate([x, y, BASE]),
    Manifold.cylinder(tip - top, r, 0, 8).translate([x, y, NAP(top)]),
  ]);
// Regelmatige achthoek met de vlakken op de assen (apothema a).
const octagon = ([cx, cy], a) =>
  [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => polar([cx, cy], a / Math.cos(Math.PI / 8), deg));
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
const mids = (xs) => xs.slice(1).map((x, i) => (xs[i] + x) / 2);

// ---------- opbouw: kerk ----------
const parts = [
  // Lage delen tot de bovenkant van de steunberen, de kluis lager.
  clip(box([-100, 100], [-100, 100], BASE, NAP(LOW)).subtract(box(KLUIS.x, KLUIS.y, BASE - 1, 200))),
  clip(box(KLUIS.x, KLUIS.y, BASE, NAP(KLUIS.top))),
  // Schip.
  Manifold.hull([
    ...at([[NAVE.x[0], -NAVE.halfWidth], [NAVE.x[1], -NAVE.halfWidth], [NAVE.x[1], NAVE.halfWidth], [NAVE.x[0], NAVE.halfWidth]], BASE),
    ...at([[NAVE.x[0], -NAVE.halfWidth], [NAVE.x[1], -NAVE.halfWidth], [NAVE.x[1], NAVE.halfWidth], [NAVE.x[0], NAVE.halfWidth]], NAP(NAVE.eave)),
    [NAVE.x[0], 0, NAP(NAVE.ridge)],
    [NAVE.x[1], 0, NAP(NAVE.ridge)],
  ]),
];
// Zijbeuken langs het schip.
for (const a of AISLES) {
  const profile = [
    [NAVE.halfWidth, BASE], [NAVE.halfWidth, NAP(a.valley)], [a.ridgeY, NAP(a.ridge)],
    [a.wall, NAP(a.eave)], [a.wall, BASE],
  ];
  parts.push(clip(Manifold.hull(a.x.flatMap((x) => profile.map(([y, z]) => [x, a.side * y, z])))));
}
// Transept met topgevel aan de zuidkant en een afgewolfd noordeind.
{
  const T = TRANSEPT;
  const w = T.halfWidth;
  const corners = [[-w, T.south], [w, T.south], [w, T.north], [-w, T.north]];
  parts.push(
    clip(Manifold.hull([...at(corners, BASE), ...at(corners, NAP(T.eave)), [0, T.south, NAP(T.ridge)], [0, T.hipFrom, NAP(T.ridge)]])),
    clip(box(PORCH.x, PORCH.y, BASE, NAP(PORCH.top))),
    pinnacle([0, T.south + 0.5], 1.0, T.ridge + 0.3, T.cross),
  );
  for (const c of TURRETS.centres) parts.push(turret(c, TURRETS.radius, TURRETS.top, TURRETS.tip));
}
// Koor met de afgeschilde koorsluiting.
const apsePoints = [90, 54, 18, -18, -54, -90].map((deg) => polar(APSE.center, APSE.radius, deg));
const choirOutline = [[CHOIR.from, -CHOIR.halfWidth], ...[...apsePoints].reverse(), [CHOIR.from, CHOIR.halfWidth]];
parts.push(
  Manifold.hull([
    ...at(choirOutline, BASE),
    ...at(choirOutline, NAP(CHOIR.eave)),
    [CHOIR.from, 0, NAP(CHOIR.ridge)],
    [APSE.center[0], 0, NAP(CHOIR.ridge)],
  ]),
);
// Koorzijbeuken: lessenaarsdak van de lichtbeukmuur naar de buitenmuur.
for (const [s, wall] of [[1, CHOIR_AISLE.north], [-1, CHOIR_AISLE.south]]) {
  const C = CHOIR_AISLE;
  const profile = [[CHOIR.halfWidth, BASE], [CHOIR.halfWidth, NAP(C.high)], [Math.abs(wall), NAP(C.low)], [Math.abs(wall), BASE]];
  parts.push(clip(Manifold.hull(C.x.flatMap((x) => profile.map(([y, z]) => [x, s * y, z])))));
}
// Kooromgang: lessenaarsdak van de koorsluiting naar de buitenmuur.
const ambulatoryRing = [];
for (let deg = 90; deg >= -90; deg -= 10) ambulatoryRing.push(polar(APSE.center, AMBULATORY.radius, deg));
parts.push(
  clip(
    Manifold.hull([
      ...at(ambulatoryRing, BASE),
      ...at(ambulatoryRing, NAP(AMBULATORY.low)),
      ...at(apsePoints, NAP(AMBULATORY.high)),
    ]),
  ),
);
// Sacristie.
parts.push(clip(Manifold.hull([...at(SACRISTY.plan, BASE), ...at(SACRISTY.plan, NAP(SACRISTY.eave)), [SACRISTY.apex[0], SACRISTY.apex[1], NAP(SACRISTY.apex[2])]])));
// Pinakels op de steunberen van koorzijbeuken en kooromgang.
const P = PINNACLES;
for (const x of P.north) parts.push(pinnacle([x, CHOIR_AISLE.north + 0.5], P.size, P.top, P.tip));
for (const x of P.south) parts.push(pinnacle([x, CHOIR_AISLE.south - 0.5], P.size, P.top, P.tip));
for (const deg of P.ambulatory) parts.push(pinnacle(polar(APSE.center, AMBULATORY.radius + 0.4, deg), P.size, P.top, P.tip));
// Traptoren op de zuidwesthoek van de toren.
parts.push(turret(STAIR.centre, STAIR.radius, STAIR.top, STAIR.tip));

// Vensters als nissen: per travee in de zijbeuken, de lichtbeuk van schip en
// koor, de koorzijbeuken en de kooromgang, en het grote venster in de
// zuidgevel van het transept.
const windows = [];
for (const x of mids([-47.2, -41.9, -36.5, -31.4, -26.3, -21.1, -16.0, -10.9, -6.25])) {
  windows.push(niche([x, AISLES[0].wall], [0, 1], 2.4, 2.5, 8.6, WINDOW.depth));
  windows.push(niche([x, NAVE.halfWidth], [0, 1], 2.0, 15.0, 19.0, WINDOW.depth, 0.3));
}
for (const x of mids([-61.0, -55.7, -50.6, -45.8, -40.7, -35.6, -30.6, -25.5, -20.4, -15.25, -10.0, -6.25])) {
  windows.push(niche([x, -AISLES[1].wall], [0, -1], 2.4, 2.5, 9.4, WINDOW.depth));
  if (x > NAVE.x[0] + 1.5) windows.push(niche([x, -NAVE.halfWidth], [0, -1], 2.0, 15.4, 19.0, WINDOW.depth, 0.3));
}
for (const x of mids([6.25, 11.0, 15.65, 20.45, 25.05])) {
  windows.push(niche([x, CHOIR_AISLE.north], [0, 1], 2.8, 2.5, 11.6, WINDOW.depth));
  windows.push(niche([x, CHOIR.halfWidth], [0, 1], 2.4, 21.2, 24.4, WINDOW.depth, 0.3));
}
for (const x of mids([6.25, 10.9, 15.85, 20.8, 25.05])) {
  windows.push(niche([x, CHOIR_AISLE.south], [0, -1], 2.8, 2.5, 11.6, WINDOW.depth));
  windows.push(niche([x, -CHOIR.halfWidth], [0, -1], 2.4, 21.2, 24.4, WINDOW.depth, 0.3));
}
for (const deg of [80, 60, 41, 21.5, 2]) {
  windows.push(niche(polar(APSE.center, AMBULATORY.radius * Math.cos(Math.PI / 36), deg), unit(deg), 2.8, 2.5, 11.2, WINDOW.depth));
}
for (const deg of [72, 36, 0, -36, -72]) {
  const r = APSE.radius * Math.cos(Math.PI / 10);
  windows.push(niche(polar(APSE.center, r, deg), unit(deg), 2.2, 21.2, 24.4, WINDOW.depth, 0.3));
}
windows.push(niche([0.4, TRANSEPT.south], [0, -1], 5.6, 4.0, 19.5, WINDOW.depth));

// ---------- opbouw: toren ----------
const T = TOWER;
const [tcx, tcy] = T.centre;
const square = (half) => [[tcx - half, tcy - half], [tcx + half, tcy - half], [tcx + half, tcy + half], [tcx - half, tcy + half]];
const h0 = T.base.half;
const towerParts = [prism(square(h0), BASE, NAP(T.base.top)), prism(square(T.square.half), BASE, NAP(T.square.top))];
// Steunberen op de hoeken van de onderbouw, twee per hoek haaks op de gevels,
// per stap minder uitspringend.
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  for (const [top, out] of T.buttress.steps) {
    const xs = [tcx + sx * h0, tcx + sx * (h0 + out)].sort((a, b) => a - b);
    const ys = [tcy + sy * (h0 - T.buttress.width), tcy + sy * h0].sort((a, b) => a - b);
    towerParts.push(box(xs, ys, BASE, NAP(top)));
    const xs2 = [tcx + sx * (h0 - T.buttress.width), tcx + sx * h0].sort((a, b) => a - b);
    const ys2 = [tcy + sy * h0, tcy + sy * (h0 + out)].sort((a, b) => a - b);
    towerParts.push(box(xs2, ys2, BASE, NAP(top)));
  }
  // Hoektorentje van de vierkante geleding.
  const c = T.corner.offset;
  towerParts.push(turret([tcx + sx * c, tcy + sy * c], T.corner.radius, T.corner.top, T.corner.tip));
}
// Borstwering boven de onderbouw: kraagt 0,3 m uit; die vlakke onderkant laat
// de export de nissen behouden (overhangopvulling in plaats van verticale opvulling).
const ph = h0 + T.parapet.overhang;
towerParts.push(prism(square(ph), NAP(T.base.top), NAP(T.parapet.top)).subtract(prism(square(ph - T.parapet.width), BASE - 1, 200)));
// Achtkantige klokkengeleding met pinakels op de hoeken.
towerParts.push(prism(octagon(T.centre, T.octagon.apothem), BASE, NAP(T.octagon.top)));
for (let k = 0; k < 8; k++) {
  towerParts.push(pinnacle(polar(T.centre, T.pinnacle.radius, 22.5 + 45 * k), T.pinnacle.size, T.pinnacle.top, T.pinnacle.tip));
}
// Achtkantige spits met een naald.
{
  const S = T.spire;
  const lower = octagon(T.centre, S.apothem);
  const middle = octagon(T.centre, S.middle);
  const upper = octagon(T.centre, S.upper);
  towerParts.push(
    Manifold.hull([...at(lower, BASE), ...at(lower, NAP(T.octagon.top)), ...at(middle, NAP(S.middleTop))]),
    Manifold.hull([...at(middle, NAP(S.middleTop) - 0.5), ...at(upper, NAP(S.upperTop))]),
    Manifold.hull([...at(upper, NAP(S.upperTop) - 0.5), [tcx, tcy, NAP(S.tip)]]),
  );
}
let tower = Manifold.union(towerParts);
// Nissen: portaal in de westgevel, twee hoge nissen per gevel in de onderbouw
// (boven de daken van schip en zuidbeuk), twee per gevel in de vierkante
// geleding en een galmgat per vlak van de achtkant.
const faces = (half) => [
  [[tcx - half, tcy], [-1, 0], "w"],
  [[tcx, tcy + half], [0, 1], "n"],
  [[tcx, tcy - half], [0, -1], "z"],
  [[tcx + half, tcy], [1, 0], "o"],
];
const towerNiches = [niche([tcx - h0, tcy], [-1, 0], 3.2, GROUND_NAP, 9.0, 1.0)];
for (const [[fx, fy], [nx, ny], side] of faces(h0)) {
  if (side === "o") continue;
  for (const k of [-2.4, 2.4]) towerNiches.push(niche([fx - ny * k, fy + nx * k], [nx, ny], 2.0, side === "w" ? 13.0 : 20.0, 36.5, 0.5));
}
for (const [[fx, fy], [nx, ny]] of faces(T.square.half)) {
  for (const k of [-2.0, 2.0]) towerNiches.push(niche([fx - ny * k, fy + nx * k], [nx, ny], 1.8, 42.5, 50.5, 0.5));
}
for (let k = 0; k < 8; k++) {
  const deg = 45 * k;
  towerNiches.push(niche(polar(T.centre, T.octagon.apothem, deg), unit(deg), 1.8, 61.0, 73.0, 0.5));
}
tower = tower.subtract(Manifold.union(towerNiches));
parts.push(tower);

const church = Manifold.union(parts).subtract(Manifold.union(windows));
const nodes = [["building:nieuwe-kerk-delft", church]];

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
const glbFile = path.join(outDir, "nieuwe-kerk-delft.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-nieuwe-kerk-delft.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `nieuwe-kerk-delft-1-${scale}.stl`);
const printSolid = church.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Nieuwe Kerk Delft 1:${scale} mm Z-up`);
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
  path.join(outDir, "nieuwe-kerk-delft.json"),
  JSON.stringify(
    {
      name: "Nieuwe Kerk",
      file: "nieuwe-kerk-delft.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +0,2 tot +0,8 m): de Markt voor de toren,
      // de straat langs de zuidbeuk en het transept en de straat langs de
      // noordkant van het koor.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0503100000000209"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (84543,63, 447609,12), op de viering, op het maaiveld (NAP +0,3 m), +X langs de as van de toren naar het koor in het oostnoordoosten (RD-richting 31,66 graden) en +Y naar het noordnoordwesten; de toren staat aan de -X-kant, aan de Markt. Eén node building: lage delen tot de steunberen (NAP +9 m), het schip onder een zadeldak (goot +20 m, nok +30,5 m), de zijbeuken langs het schip onder zadeldaken evenwijdig aan de as (nok +17,5 en +17,7 m), het transept (nok +31 m) met topgevel en twee traptorentjes aan de zuidkant en een afgewolfd noordeind met portaal, het hogere koor (goot +25 m, nok +36 m) met afgeschilde koorsluiting, de koorzijbeuken en de kooromgang onder lessenaarsdaken (+20,6 naar +13 m) met pinakels op de steunberen, de sacristie aan de zuidoostkant, de traptoren op de zuidwesthoek van de toren, en de westtoren met de bakstenen onderbouw tot +39,5 m met steunberen, portaal en spitsboognissen en een borstwering tot +40,7 m, de vierkante geleding tot +57 m met vier hoektorentjes (+60,5 m), de achtkantige klokkengeleding tot +75,5 m met galmgaten en pinakels, en de achtkantige spits met een naald tot +108,75 m. Alles staat recht op of loopt schuin omhoog, behalve de borstwering boven de onderbouw die 0,3 m uitkraagt, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0503100000000209. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`nieuwe-kerk-delft-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        naveRidgeNapM: NAVE.ridge,
        choirRidgeNapM: CHOIR.ridge,
        transeptRidgeNapM: TRANSEPT.ridge,
        towerBaseNapM: TOWER.base.top,
        towerSquareNapM: TOWER.square.top,
        towerOctagonNapM: TOWER.octagon.top,
        towerTipNapM: TOWER.spire.tip,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Nieuwe_Kerk_(Delft)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/11872",
        "PDOK BAG pand 0503100000000209 (contour), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dwarsprofielen van schip, zijbeuken, transept, koor, koorzijbeuken en kooromgang, omhullende van de toren per hoogte, maaiveld",
        "Wikimedia Commons: foto's van de Rijksdienst voor het Cultureel Erfgoed (overzicht toren, zuidgevel)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

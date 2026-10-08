// Genereert een gesloten 3D-model van de Grote of Onze-Lieve-Vrouwekerk in
// Breda: de kruisbasiliek in Brabantse gotiek met het hoge schip en koor onder
// één zadeldak dat over de koorsluiting afschildt, de zijbeuken met
// lessenaarsdaken, de kapellen langs schip en koor met één kapelgevel per
// travee en pinakels op de steunberen, de luchtbogen langs het koor, de
// kooromgang met vijf straalkapellen onder tentdaken, het transept met
// hoekpinakels en vensters, de dakruiter met een uitje op de viering en de
// westtoren van 97 m: vier vierkante geledingen met hoekpinakels en
// galmgaten, de tweeledige achtkantige lantaarn met een omgang en luchtbogen
// naar de hoekpinakels, en de bekroning met een ui, een open lantaarntje, een
// kleinere ui en de spits. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-grote-kerk-breda.mjs              # 1:1000 (standaard)
//   node scripts/generate-grote-kerk-breda.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alle onderdelen zijn minstens 0,9 m dik en
// staan recht op of lopen schuin omhoog; de nissen hebben een spitse bovenkant
// van 60 graden en de uien worden onderaan onder hoogstens 45 graden breder.
// Alleen de omgang rond de lantaarn kraagt 0,3 m uit; die vlakke onderkant
// laat de export de nissen behouden (zie de controle onderaan).
//
// Assenstelsel: oorsprong op RD (112595, 400194,2), midden in het schip, op
// het maaiveld aan de westkant (NAP +3,3 m), Z omhoog. +X loopt langs de as
// van de kerk naar het koor in het oosten (RD-richting 2,3 graden), +Y naar het
// noorden; de toren staat aan de -X-kant, de Grote Markt aan de zuidkant.
//
// Bronnen: BAG-pand 0758100000024659 (contour en steunberen); AHN DSM/DTM
// 0,5 m (PDOK WCS) in een stelsel langs de as: dwarsprofielen van schip,
// zijbeuken, transept en koor, rasters van de kapellen langs schip en koor, de
// omhullende per hoogte van de toren, de lantaarn en de bekroning (top NAP
// +97,6 m) en het maaiveld; de PDOK 3D-reconstructie (LoD2.2) ter vergelijking;
// foto's op Wikimedia Commons (RCE en anderen); Wikipedia (toren 97 m).
// Geschat: de hoogtes van kapelgevels en pinakels, de luchtbogen, de vensters,
// de straalkapellen en de vorm van de uien en de dakruiter.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-breda");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- maten (lokaal stelsel, z = NAP - 3,3 m) ----------
const ORIGIN = [112595, 400194.2];
const ANGLE = (2.3 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 3.3;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour (lokaal, vereenvoudigd tot 0,3 m).
const OUTLINE = [
  [40.7, 6.0], [39.7, 6.7], [38.8, 6.3], [36.7, 8.8], [36.9, 9.7], [36.0, 9.7], [33.7, 12.4], [33.9, 13.8],
  [33.3, 13.6], [32.7, 12.6], [30.2, 12.8], [30.8, 14.2], [29.8, 14.7], [29.6, 17.6], [30.6, 18.9], [29.9, 19.1],
  [28.9, 18.6], [26.6, 19.9], [26.6, 21.1], [26.2, 21.5], [25.7, 21.1], [25.6, 20.3], [22.5, 20.5], [22.1, 21.9],
  [21.5, 21.4], [21.5, 20.3], [17.6, 20.2], [17.5, 21.2], [17.0, 21.7], [16.4, 21.2], [16.5, 20.2], [12.7, 20.2],
  [12.7, 21.2], [12.2, 21.7], [11.7, 21.3], [11.7, 20.2], [8.7, 20.2], [8.2, 21.3], [7.4, 21.9], [6.1, 21.9],
  [6.1, 20.3], [-2.8, 20.2], [-2.8, 21.7], [-4.0, 21.7], [-5.3, 21.0], [-8.9, 21.0], [-8.9, 20.0], [-12.7, 20.1],
  [-12.6, 21.1], [-13.7, 21.1], [-13.8, 20.1], [-18.0, 20.1], [-18.1, 17.0], [-18.8, 17.0], [-18.8, 16.0],
  [-19.5, 16.0], [-19.4, 16.7], [-22.4, 16.7], [-22.4, 15.9], [-22.9, 16.0], [-22.8, 17.1], [-23.9, 17.1],
  [-24.0, 16.0], [-27.5, 16.1], [-27.4, 17.2], [-28.6, 17.2], [-28.7, 16.1], [-32.8, 16.2], [-32.7, 17.2],
  [-33.9, 17.3], [-33.9, 16.6], [-36.7, 17.5], [-37.1, 18.6], [-38.0, 18.3], [-38.1, 17.4], [-39.5, 18.3],
  [-40.7, 18.0], [-41.2, 17.0], [-41.0, 15.8], [-39.7, 15.0], [-40.4, 14.8], [-40.4, 13.8], [-39.4, 13.7],
  [-37.7, 11.4], [-39.3, 7.4], [-41.1, 9.1], [-42.3, 9.0], [-43.1, 8.3], [-43.1, 7.1], [-41.1, 4.7], [-41.1, 3.8],
  [-41.7, 3.4], [-39.0, 1.9], [-39.1, -1.5], [-41.9, -2.8], [-41.2, -3.3], [-41.3, -4.5], [-43.1, -6.3],
  [-43.1, -7.8], [-42.0, -8.6], [-40.5, -8.2], [-39.5, -8.8], [-38.4, -8.5], [-37.5, -11.2], [-38.7, -13.1],
  [-40.0, -13.2], [-39.8, -14.3], [-38.6, -14.2], [-36.6, -16.7], [-36.9, -17.8], [-35.8, -18.0], [-35.5, -16.9],
  [-32.3, -16.2], [-32.3, -15.2], [-28.8, -15.2], [-28.8, -16.2], [-27.5, -16.2], [-27.5, -15.3], [-23.5, -15.3],
  [-23.6, -16.2], [-22.5, -16.2], [-22.5, -15.3], [-18.6, -15.3], [-18.6, -16.2], [-17.6, -16.2], [-17.6, -15.3],
  [-13.8, -15.3], [-13.8, -16.2], [-12.6, -16.2], [-12.6, -15.3], [-8.8, -15.3], [-8.5, -19.0], [-4.9, -18.9],
  [-4.9, -19.7], [-3.6, -19.7], [-3.5, -21.1], [-2.2, -21.1], [-2.2, -19.7], [6.3, -19.7], [6.3, -21.0],
  [7.5, -22.6], [9.0, -22.6], [9.1, -23.0], [9.6, -23.0], [9.7, -22.6], [11.2, -22.6], [11.2, -23.0], [11.8, -23.0],
  [11.8, -22.6], [13.3, -22.6], [13.3, -23.0], [13.9, -23.0], [13.9, -22.6], [15.5, -22.6], [15.6, -23.0],
  [16.0, -23.0], [16.0, -22.6], [17.8, -22.6], [17.8, -23.0], [18.2, -23.0], [18.3, -22.6], [23.0, -22.6],
  [23.4, -23.0], [23.9, -22.7], [23.3, -21.9], [23.3, -20.7], [32.3, -20.9], [32.8, -19.2], [35.0, -17.8],
  [36.6, -18.2], [35.5, -17.1], [35.4, -14.5], [36.6, -13.4], [34.8, -9.9], [36.8, -7.1], [37.6, -7.2],
  [37.4, -6.3], [39.3, -3.6], [40.6, -3.6], [40.4, -2.9], [39.5, -2.5], [39.5, 0.7], [40.2, 1.2], [39.5, 1.8],
  [39.6, 5.2],
];
// Kapellen en aanbouwen binnen de contour tot een vlak dak; de lage strook
// langs de zuidkant van het koor apart.
const CHAPELS = 16.8;
const SOUTH_STRIP = { x: [7.0, 24.0], y: [-23.5, -20.4], top: 10.0 };
// Zijbeuken en kooromgang: lessenaarsdak van de lichtbeukmuur naar de
// kapellen, daarbuiten één kapelgevel per travee tussen de steunberen.
const AISLE = { x: [-40.5, 30.5], wall: 7.2, edge: 12.5, high: 19.0, low: 17.8 };
const CHAPEL_GABLE = { eave: 16.8, apex: 19.8, reach: 21.6 };
const NORTH_BUTTRESSES = [-37.5, -33.3, -28.0, -23.4, -19.1, -13.25, -8.9, 8.45, 12.2, 17.0, 22.0, 26.2, 29.9];
const SOUTH_BUTTRESSES = [-36.5, -32.3, -28.15, -23.05, -18.1, -13.2, -8.8, 7.5, 12.5, 17.5, 22.5, 27.5, 32.3];
const PINNACLE = { size: 1.0, top: 22.0, tip: 24.0 };
// Luchtbogen langs het koor (als volle steunmuren van 1 m).
const CHOIR_FLYERS = { north: [12.2, 17.0, 22.0, 26.2], south: [12.5, 17.5, 22.5, 27.5], low: 21.0, high: 24.0 };
// Schip en koor: muren tot de goot, zadeldak, afgeschilde koorsluiting.
const NAVE = {
  outline: [[-26, -7.5], [28.0, -7.5], [31.5, -4.5], [33.5, 0], [31.5, 4.5], [28.0, 7.5], [-26, 7.5]],
  axis: -0.3,
  eave: 24.5,
  ridge: 35.4,
  ridgeFrom: -26,
  ridgeTo: 27.0,
};
// Kooromgang: vijf straalkapellen onder tentdaken rond de koorsluiting.
const AMBULATORY = { centre: [27.0, -0.3], tipRadius: 9.0, rim: 15.0, tip: 20.0, deg: [-60, -30, 0, 30, 60] };
const TRANSEPT = { x: [-4.3, 7.6], y: [-21.0, 20.2], eave: 27.0, ridge: 35.0 };
// Dakruiter op de viering: achtkantige schacht met een uitje en een pinakel.
const TURRET = {
  centre: [1.7, -0.3],
  profile: [[0, 33.0], [1.3, 33.0], [1.3, 38.5], [1.6, 38.9], [1.6, 39.6], [1.1, 40.5], [0.6, 41.0], [0, 44.0]],
};
// Toren: vier vierkante geledingen [x0, x1, y0, y1, top] met hoekpinakels, de
// tweeledige achtkantige lantaarn met een omgang en vier luchtbogen naar de
// hoekpinakels, en de bekroning: een ui, een open lantaarntje, een kleinere
// ui en de spits (straal en NAP).
const TOWER = {
  stages: [
    [-41.0, -25.8, -6.0, 6.8, 34.0],
    [-40.8, -28.2, -5.8, 6.3, 42.0],
    [-40.2, -28.8, -4.8, 5.8, 58.0],
    [-39.2, -29.2, -4.2, 5.2, 66.0],
  ],
  pinnacles: [
    { stage: 1, size: 1.2, top: 45.5, tip: 47.5 },
    { stage: 2, size: 1.2, top: 62.0, tip: 64.0 },
    { stage: 3, size: 1.3, top: 70.0, tip: 73.5 },
  ],
  lantern: { centre: [-34.0, 0.3], lower: { radius: 4.6, from: 66.0, to: 73.0 }, gallery: { radius: 4.9, from: 72.6 }, upper: { radius: 3.8, to: 77.0 } },
  crown: [
    [0, 76.8], [3.0, 76.8], [3.0, 77.0], [3.4, 77.5], [3.4, 79.5], [2.8, 81.0], [2.2, 82.2], [1.8, 83.0], [1.8, 87.6],
    [2.1, 88.0], [2.1, 88.8], [1.6, 90.2], [1.0, 91.3], [0.5, 92.3], [0, 97.6],
  ],
  westWindow: { width: 4.5, from: 18.0, to: 32.0 },
};
// Vensters als spitsboognissen.
const WINDOW = { width: 2.2, depth: 0.5 };
// Maaiveld (lokaal) rondom; het laagste punt aan de westkant.
const GROUND_SAMPLES = [[0, 30], [0, -32], [50, 0], [-50, 0]];

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
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const octagon = ([cx, cy], r, z) =>
  Array.from({ length: 8 }, (_, k) => {
    const a = ((k * 45 + 22.5) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z];
  });

const clip = (solid) => Manifold.intersection(outline, solid);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const revolve = ([cx, cy], profile) =>
  Manifold.revolve(new CrossSection([ccw(profile.map(([r, h]) => [r, NAP(h)]))]), 0).translate([cx, cy, 0]);
// Vierkante pinakel: schacht tot `top` (NAP) en een piramide tot `tip`.
const pinnacle = ([x, y], size, top, tip) => {
  const h = size / 2;
  const square = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]];
  return Manifold.hull([...at(square, BASE), ...at(square, NAP(top)), [x, y, NAP(tip)]]);
};
// Zadeldak met topgevels op een rechthoek; de nok loopt langs `along`.
const gable = ([x0, x1], [y0, y1], eave, ridge, along) => {
  const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const ridgeLine =
    along === "x"
      ? [[x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2]]
      : [[(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1]];
  return Manifold.hull([...at(corners, BASE), ...at(corners, NAP(eave)), ...at(ridgeLine, NAP(ridge))]);
};
// Steunmuur van `width` breed tussen twee punten in het grondvlak, met een
// schuine bovenkant van z0 naar z1 (NAP).
const flyer = (from, to, width, z0, z1) => {
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
  const len = Math.hypot(dx, dy);
  const [nx, ny] = [(-dy / len) * (width / 2), (dx / len) * (width / 2)];
  const pts = [];
  for (const [p, z] of [[from, z0], [to, z1]]) {
    for (const s of [-1, 1]) {
      const q = [p[0] + s * nx, p[1] + s * ny];
      pts.push([...q, BASE], [...q, NAP(z)]);
    }
  }
  return Manifold.hull(pts);
};
// Spitsboognis in een gevel: breedte w van z0 tot z1 (NAP), bovenkant onder 60
// graden; `at` is het midden onderaan op het gevelvlak, `normal` naar buiten.
const niche = ([cx, cy], [nx, ny], w, z0, z1, depth) => {
  const rise = (w / 2) * Math.tan(Math.PI / 3);
  const profile = [[-w / 2, NAP(z0)], [w / 2, NAP(z0)], [w / 2, NAP(z1) - rise], [0, NAP(z1)], [-w / 2, NAP(z1) - rise]];
  const pts = [];
  for (const d of [-depth, 1.5]) {
    for (const [u, z] of profile) pts.push([cx + nx * d - ny * u, cy + ny * d + nx * u, z]);
  }
  return Manifold.hull(pts);
};
// Buitenkant van de contour op x (noord of zuid), voor de pinakels.
const edgeAt = (x, side) => {
  if (side > 0) return x < -18.1 ? 16.6 : x < 6.1 ? 20.1 : 20.2;
  return x < -8.8 ? -15.3 : x < 23.3 ? -20.4 : -20.8;
};

// ---------- opbouw ----------
const parts = [];
const cutouts = [];
// Kapellen buiten de zijbeuken en de lage strook langs het koor.
const southStrip = box(SOUTH_STRIP.x, SOUTH_STRIP.y, BASE - 1, 200);
parts.push(
  Manifold.intersection(outline.subtract(southStrip), box([-100, 100], [-100, 100], BASE, NAP(CHAPELS))),
  clip(box(SOUTH_STRIP.x, SOUTH_STRIP.y, BASE, NAP(SOUTH_STRIP.top))),
);
// Zijbeuken: lessenaarsdaken tegen de lichtbeuk.
for (const side of [1, -1]) {
  const [yHigh, yLow] = [side * AISLE.wall, side * AISLE.edge];
  parts.push(
    clip(
      Manifold.hull([
        ...at([[AISLE.x[0], yHigh], [AISLE.x[1], yHigh], [AISLE.x[0], yLow], [AISLE.x[1], yLow]], BASE),
        [AISLE.x[0], yHigh, NAP(AISLE.high)], [AISLE.x[1], yHigh, NAP(AISLE.high)],
        [AISLE.x[0], yLow, NAP(AISLE.low)], [AISLE.x[1], yLow, NAP(AISLE.low)],
      ]),
    ),
  );
}
// Kapelgevels per travee tussen de steunberen, aan beide kanten.
for (const [side, list] of [[1, NORTH_BUTTRESSES], [-1, SOUTH_BUTTRESSES]]) {
  for (let i = 0; i + 1 < list.length; i++) {
    const [x0, x1] = [list[i] + 0.5, list[i + 1] - 0.5];
    if (x1 - x0 < 2 || (x0 < TRANSEPT.x[1] && x1 > TRANSEPT.x[0])) continue;
    const ys = [side * AISLE.edge, side * CHAPEL_GABLE.reach].sort((a, b) => a - b);
    const zone = side < 0 ? outline.subtract(southStrip) : outline;
    parts.push(Manifold.intersection(zone, gable([x0, x1], ys, CHAPEL_GABLE.eave, CHAPEL_GABLE.apex, "y")));
  }
  for (const x of list) parts.push(pinnacle([x, edgeAt(x, side) - side * 0.6], PINNACLE.size, PINNACLE.top, PINNACLE.tip));
}
// Luchtbogen langs het koor.
for (const [side, xs] of [[1, CHOIR_FLYERS.north], [-1, CHOIR_FLYERS.south]]) {
  for (const x of xs) {
    parts.push(flyer([x, side * (Math.abs(edgeAt(x, side)) - 0.8)], [x, side * 7.3], 1.0, CHOIR_FLYERS.low, CHOIR_FLYERS.high));
  }
}
// Schip en koor met de afgeschilde koorsluiting.
parts.push(
  Manifold.hull([
    ...at(NAVE.outline, BASE),
    ...at(NAVE.outline, NAP(NAVE.eave)),
    [NAVE.ridgeFrom, NAVE.axis, NAP(NAVE.ridge)],
    [NAVE.ridgeTo, NAVE.axis, NAP(NAVE.ridge)],
  ]),
);
// Straalkapellen: tentdak over een sector van 30 graden.
for (const deg of AMBULATORY.deg) {
  const rim = [deg - 15, deg + 15].map((d) => polar(AMBULATORY.centre, AMBULATORY.rim, d));
  const inner = [deg - 15, deg + 15].map((d) => polar(AMBULATORY.centre, 5.0, d));
  parts.push(
    clip(
      Manifold.hull([
        ...at([...rim, ...inner], BASE),
        ...at([...rim, ...inner], NAP(CHAPEL_GABLE.eave)),
        [...polar(AMBULATORY.centre, AMBULATORY.tipRadius, deg), NAP(AMBULATORY.tip)],
      ]),
    ),
  );
}
for (const deg of [-75, -45, -15, 15, 45, 75]) {
  parts.push(clip(pinnacle(polar(AMBULATORY.centre, 11.0, deg), PINNACLE.size, PINNACLE.top, PINNACLE.tip)));
}
// Transept met topgevels en hoekpinakels.
parts.push(gable(TRANSEPT.x, TRANSEPT.y, TRANSEPT.eave, TRANSEPT.ridge, "y"));
for (const x of [TRANSEPT.x[0] + 0.6, TRANSEPT.x[1] - 0.6]) {
  for (const y of [TRANSEPT.y[0] + 0.6, TRANSEPT.y[1] - 0.6]) {
    parts.push(pinnacle([x, y], 1.2, TRANSEPT.eave + 3.0, TRANSEPT.eave + 5.5));
  }
}
// Dakruiter op de viering.
parts.push(revolve(TURRET.centre, TURRET.profile));
// Vensters: lichtbeuk van schip en koor, de topgevels van het transept.
const naveBays = [-26.0, -23.4, -19.1, -13.25, -8.9, TRANSEPT.x[0]];
const choirBays = [TRANSEPT.x[1], 12.2, 17.0, 22.0, 26.2];
for (const bays of [naveBays, choirBays]) {
  for (let i = 0; i + 1 < bays.length; i++) {
    const x = (bays[i] + bays[i + 1]) / 2;
    for (const side of [1, -1]) cutouts.push(niche([x, side * 7.5], [0, side], WINDOW.width, 20.6, 24.3, WINDOW.depth));
  }
}
for (const [y, ny] of [[TRANSEPT.y[0], -1], [TRANSEPT.y[1], 1]]) {
  cutouts.push(niche([(TRANSEPT.x[0] + TRANSEPT.x[1]) / 2, y], [0, ny], 5.0, 18.0, 31.0, WINDOW.depth));
}

// ---------- opbouw: toren ----------
const towerParts = TOWER.stages.map(([x0, x1, y0, y1, top]) => box([x0, x1], [y0, y1], BASE, NAP(top)));
for (const { stage, size, top, tip } of TOWER.pinnacles) {
  const [x0, x1, y0, y1] = TOWER.stages[stage];
  for (const x of [x0 + size / 2, x1 - size / 2]) {
    for (const y of [y0 + size / 2, y1 - size / 2]) towerParts.push(pinnacle([x, y], size, top, tip));
  }
}
const { lantern } = TOWER;
towerParts.push(
  Manifold.hull([
    ...octagon(lantern.centre, lantern.lower.radius, NAP(lantern.lower.from) - 0.01),
    ...octagon(lantern.centre, lantern.lower.radius, NAP(lantern.lower.to)),
  ]),
  // Omgang rond de lantaarn, 0,3 m uitkragend.
  Manifold.hull([
    ...octagon(lantern.centre, lantern.gallery.radius, NAP(lantern.gallery.from)),
    ...octagon(lantern.centre, lantern.gallery.radius, NAP(lantern.lower.to)),
  ]),
  Manifold.hull([
    ...octagon(lantern.centre, lantern.upper.radius, NAP(lantern.lower.to) - 0.01),
    ...octagon(lantern.centre, lantern.upper.radius, NAP(lantern.upper.to)),
  ]),
  revolve(lantern.centre, TOWER.crown),
);
// Luchtbogen van de hoekpinakels van de bovenste geleding naar de lantaarn.
{
  const [x0, x1, y0, y1] = TOWER.stages[3];
  const s = TOWER.pinnacles[2].size / 2;
  for (const corner of [[x0 + s, y0 + s], [x1 - s, y0 + s], [x1 - s, y1 - s], [x0 + s, y1 - s]]) {
    const [dx, dy] = [lantern.centre[0] - corner[0], lantern.centre[1] - corner[1]];
    const len = Math.hypot(dx, dy);
    const to = [lantern.centre[0] - (dx / len) * 4.0, lantern.centre[1] - (dy / len) * 4.0];
    towerParts.push(flyer(corner, to, 0.9, 68.0, 71.0));
  }
}
let tower = Manifold.union(towerParts);
const towerNiches = [];
{
  // Galmgaten: twee per gevel op de derde geleding, één op de vierde, en het
  // westvenster boven het portaal.
  const [a0, a1, b0, b1] = TOWER.stages[2];
  const [c0, c1, d0, d1] = TOWER.stages[3];
  const [ax, ay] = [(a0 + a1) / 2, (b0 + b1) / 2];
  for (const k of [-1, 1]) {
    towerNiches.push(
      niche([a0, ay + k * 2.6], [-1, 0], 2.4, 43.0, 56.5, WINDOW.depth),
      niche([a1, ay + k * 2.6], [1, 0], 2.4, 43.0, 56.5, WINDOW.depth),
      niche([ax + k * 2.6, b0], [0, -1], 2.4, 43.0, 56.5, WINDOW.depth),
      niche([ax + k * 2.6, b1], [0, 1], 2.4, 43.0, 56.5, WINDOW.depth),
    );
  }
  const [cx, cy] = [(c0 + c1) / 2, (d0 + d1) / 2];
  towerNiches.push(
    niche([c0, cy], [-1, 0], 2.4, 59.0, 65.0, WINDOW.depth),
    niche([c1, cy], [1, 0], 2.4, 59.0, 65.0, WINDOW.depth),
    niche([cx, d0], [0, -1], 2.4, 59.0, 65.0, WINDOW.depth),
    niche([cx, d1], [0, 1], 2.4, 59.0, 65.0, WINDOW.depth),
    niche([TOWER.stages[0][0], (TOWER.stages[0][2] + TOWER.stages[0][3]) / 2], [-1, 0], TOWER.westWindow.width, TOWER.westWindow.from, TOWER.westWindow.to, WINDOW.depth),
  );
  // Vensters in de acht zijden van de onderste lantaarn.
  const apothem = lantern.lower.radius * Math.cos(Math.PI / 8);
  for (let k = 0; k < 8; k++) {
    const deg = 45 * k;
    towerNiches.push(niche(polar(lantern.centre, apothem, deg), polar([0, 0], 1, deg), 1.8, 67.0, 72.2, 0.4));
  }
}
tower = tower.subtract(Manifold.union(towerNiches));
parts.push(tower);

const church = Manifold.union(parts).subtract(Manifold.union(cutouts));
const nodes = [["building:grote-kerk-breda", church]];

// ---------- controles ----------
if (church.status() !== "NoError") throw new Error(church.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // alleen de omgang rond de lantaarn hoort erbij.
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
  const allowed = NAP(TOWER.lantern.gallery.from).toFixed(2);
  for (const [z, area] of levels) if (z !== allowed && area > 0.01) throw new Error(`overhang op z ${z}`);
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
const glbFile = path.join(outDir, "grote-kerk-breda.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-grote-kerk-breda.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `grote-kerk-breda-1-${scale}.stl`);
const printSolid = church.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Grote Kerk Breda 1:${scale} mm Z-up`);
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
  path.join(outDir, "grote-kerk-breda.json"),
  JSON.stringify(
    {
      name: "Grote of Onze-Lieve-Vrouwekerk",
      file: "grote-kerk-breda.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +3,3 tot +4,3 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0758100000024659"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (112595, 400194,2), midden in het schip, op het maaiveld aan de westkant (NAP +3,3 m), +X langs de as naar het koor in het oosten (RD-richting 2,3 graden) en +Y naar het noorden; de toren staat aan de -X-kant. Eén node building: de kapellen (NAP +16,8 m) met een kapelgevel per travee (+19,8 m) en pinakels, de zijbeuken met lessenaarsdaken (+19,0 tot +17,8 m), luchtbogen langs het koor, de kooromgang met vijf straalkapellen, schip en koor onder één zadeldak (goot +24,5 m, nok +35,4 m) met vensternissen, het transept (nok +35,0 m) met hoekpinakels en vensters, de dakruiter met een uitje (+44 m) en de westtoren met vier geledingen tot +66 m met hoekpinakels en galmgaten, de achtkantige lantaarn tot +77 m en de bekroning met twee uien tot +97,6 m. Alles staat recht op of loopt schuin omhoog, behalve de omgang rond de lantaarn die 0,3 m uitkraagt, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0758100000024659. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`grote-kerk-breda-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        naveRidgeNapM: NAVE.ridge,
        aisleTopNapM: AISLE.high,
        chapelGableNapM: CHAPEL_GABLE.apex,
        towerTopNapM: TOWER.crown[TOWER.crown.length - 1][1],
        lanternNapM: [TOWER.lantern.lower.from, TOWER.lantern.upper.to],
        towerStagesNapM: TOWER.stages.map((s) => s[4]),
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Grote_Kerk_(Breda)",
        "PDOK BAG pand 0758100000024659 (contour en steunberen), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dwarsprofielen, rasters van de kapellen, omhullende van toren, lantaarn en bekroning, maaiveld",
        "PDOK 3D Basisvoorziening gebouwen (LoD2.2), ter vergelijking",
        "Wikimedia Commons: foto's van de toren, het koor en de kapellen (RCE en anderen)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

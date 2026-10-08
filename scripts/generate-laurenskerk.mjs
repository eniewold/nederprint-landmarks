// Genereert een gesloten 3D-model van de Grote of Sint-Laurenskerk in
// Rotterdam: de laatgotische kruisbasiliek met het hoge schip en koor onder één
// zadeldak (nok NAP +35,1 m) dat over de veelhoekige koorsluiting afschildt,
// de brede zijbeuken langs schip en koor onder eigen zadeldaken met een
// balustrade langs de goot en pinakels op de steunberen, de kooromgang onder
// een lessenaarsdak met balustrade, de kapellen in de oksels van transept en
// koor, het transept met topgevels en traptorentjes op de hoeken, de dakruiter
// op de viering, en de vierkante westtoren in vier geledingen: de stenen
// onderbouw met het portaal en het westvenster, de tweede en derde geleding
// met spitsboognissen en diagonale hoeksteunberen tot de omloop met
// hoekpinakels, de smallere vierde geleding uit 1645 met balustrade en
// hoekpinakels, en de koperen bekroning in het midden. Alle maten in het script
// zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node
// met de materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-laurenskerk.mjs              # 1:1000 (standaard)
//   node scripts/generate-laurenskerk.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alle onderdelen zijn minstens 0,9 m dik en
// staan recht op of lopen schuin omhoog, elke geleding van de toren is smaller
// dan de vorige, en de nissen hebben een spitse bovenkant van 60 graden. Alleen
// de balustrade boven de vierde geleding kraagt 0,3 m uit; die vlakke onderkant
// laat de export de nissen behouden (zie de controle onderaan).
//
// Assenstelsel: oorsprong op RD (92975,1, 437394,4), op de viering onder de
// dakruiter, op het maaiveld (NAP +0,7 m), Z omhoog. +X loopt langs de as van
// de kerk van de toren naar het koor in het oostnoordoosten (RD-richting 15,1
// graden), +Y naar het noordnoordwesten; de toren staat aan de -X-kant.
//
// Bronnen: BAG-pand 0599100000702379 (contour); AHN DSM/DTM 0,5 m (PDOK WCS)
// in een stelsel langs de as: dwarsprofielen van schip, zijbeuken, transept,
// koor en kooromgang (alleen de noordhellingen; de zuidhellingen van de
// leien daken hebben geen AHN-punten en zijn gespiegeld), het raster van de
// toren (omloop NAP +51,6 m, vierde geleding +62,8 m, balustrade +64,1 m,
// bekroning +69,8 m), de dakruiter en het maaiveld; Wikipedia (toren 64 tot
// 65 m, vier geledingen); foto's op Wikimedia Commons; PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "laurenskerk");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 0,7 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [92975.1, 437394.4];
const ANGLE = (15.1 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 0.7;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour van de kerk (lokaal).
const OUTLINE = [
  [41.0, -4.8], [42.4, -5.2], [42.8, -3.9], [41.4, -3.4], [41.4, 4.1], [42.9, 4.5], [42.4, 5.8], [41.0, 5.4],
  [36.5, 11.3], [37.4, 12.5], [36.2, 13.4], [35.4, 12.2], [27.9, 15.0], [27.9, 20.0], [28.8, 20.0], [28.8, 20.9],
  [27.9, 20.9], [27.9, 21.9], [27.0, 21.8], [27.0, 20.9], [21.0, 20.9], [21.0, 21.9], [20.0, 21.9], [20.1, 21.0],
  [14.1, 21.1], [14.1, 24.7], [15.0, 24.7], [15.1, 25.6], [14.1, 25.6], [14.1, 26.6], [13.2, 26.5], [13.2, 25.6],
  [8.0, 25.6], [8.1, 27.1], [7.3, 27.9], [6.1, 27.9], [5.3, 27.1], [5.3, 25.9], [2.1, 25.8], [-2.5, 25.8],
  [-5.6, 25.8], [-5.6, 27.0], [-6.4, 27.8], [-7.5, 27.8], [-8.4, 27.0], [-8.4, 25.8], [-8.4, 24.5], [-7.5, 24.5],
  [-7.5, 21.0], [-13.4, 21.0], [-13.4, 21.9], [-14.3, 21.9], [-14.3, 21.0], [-15.6, 21.1], [-19.3, 21.0],
  [-20.5, 21.0], [-20.5, 22.0], [-21.5, 22.0], [-21.5, 21.0], [-27.6, 21.0], [-27.6, 22.0], [-28.6, 22.0],
  [-28.6, 21.0], [-30.0, 21.0], [-33.8, 21.1], [-35.1, 21.1], [-35.1, 22.1], [-36.0, 22.1], [-36.0, 21.1],
  [-42.2, 21.2], [-42.2, 22.1], [-43.1, 22.1], [-43.1, 21.2], [-45.1, 21.2], [-49.3, 21.2], [-49.3, 22.2],
  [-50.2, 22.2], [-50.2, 21.2], [-51.1, 21.2], [-51.1, 20.3], [-50.2, 20.3], [-50.2, 9.7], [-52.9, 6.6],
  [-52.0, 5.9], [-50.7, 4.7], [-50.7, 3.1], [-50.3, 3.2], [-50.3, 2.2], [-48.2, 1.9], [-48.1, -1.1], [-50.1, -1.5],
  [-50.1, -2.4], [-50.4, -2.5], [-50.3, -4.1], [-51.5, -5.4], [-52.2, -6.0], [-49.0, -9.0], [-48.9, -10.7],
  [-48.7, -20.0], [-49.6, -20.0], [-49.5, -21.0], [-48.6, -20.9], [-48.6, -21.8], [-47.7, -21.8], [-47.7, -20.9],
  [-42.0, -20.9], [-42.1, -21.9], [-41.1, -21.9], [-41.1, -20.9], [-35.0, -21.0], [-35.0, -21.9], [-34.1, -21.9],
  [-34.1, -21.0], [-28.0, -20.9], [-28.0, -21.9], [-27.1, -21.9], [-27.1, -20.9], [-21.0, -20.9], [-21.0, -21.8],
  [-20.1, -21.8], [-20.1, -20.9], [-13.8, -20.8], [-13.8, -21.8], [-12.9, -21.8], [-12.9, -20.8], [-7.0, -20.8],
  [-7.1, -24.0], [-8.0, -24.0], [-8.0, -26.5], [-7.2, -27.4], [-6.0, -27.4], [-5.2, -26.6], [-5.1, -25.5],
  [-2.2, -25.5], [2.4, -25.6], [5.6, -25.6], [5.7, -26.7], [6.5, -27.5], [7.7, -27.5], [8.5, -26.5], [8.5, -25.3],
  [13.6, -25.4], [13.6, -26.3], [14.5, -26.3], [14.5, -25.4], [15.5, -25.4], [15.5, -24.4], [14.5, -24.4],
  [14.6, -21.0], [20.6, -21.0], [20.6, -21.9], [21.5, -21.9], [21.5, -20.9], [27.5, -20.9], [27.5, -21.8],
  [28.4, -21.8], [28.4, -20.9], [29.3, -20.9], [29.3, -19.9], [28.4, -19.9], [28.4, -14.9], [35.6, -11.8],
  [36.5, -13.0], [37.6, -12.1], [36.7, -10.9],
];
// Alles binnen de contour tot de bovenkant van de steunberen.
const LOW = 13.5;
// Schip en koor: muren tot de goot, zadeldak, koorsluiting als halve tienhoek
// rond APSE.center die naar de nok afschildt.
const NAVE = { halfWidth: 7.4, eave: 24.5, ridge: 35.1, from: -38.0 };
const APSE = { center: [27.3, 0], radius: 7.4 };
// Zijbeuken langs schip en koor: zadeldak van de kil tegen de lichtbeukmuur
// over de nok naar de goot aan de buitenmuur, met een balustrade langs de goot.
const AISLE = { wall: 21.0, valley: 19.6, ridgeY: 11.75, eave: 14.8 };
const NAVE_AISLE = { x: [-50.2, -7.5], ridge: 24.7 };
const CHOIR_AISLE = { x: [7.6, 27.9], ridge: 25.2 };
const BALUSTRADE = { width: 0.9, top: 15.9 };
// Steunberen langs de buitenmuren (uit de BAG-contour) met pinakels.
const BUTTRESSES = {
  north: [-49.7, -42.6, -35.5, -28.1, -21.0, -13.9, 20.5, 27.4],
  south: [-48.1, -41.6, -34.5, -27.6, -20.5, -13.3, 21.0, 27.9],
  y: 21.5,
  size: 1.0,
  top: 16.6,
  tip: 18.6,
};
// Kooromgang: lessenaarsdak van de koorsluiting naar de buitenmuur (halve
// tienhoek, apothema 14,1 m) met een balustrade; steunberen op de hoeken.
const AMBULATORY = { apothem: 14.1, inner: 8.0, high: 18.6, eave: 14.8 };
// Kapellen in de oksels van transept en koorbeuken: lessenaarsdak naar het oosten.
const CHAPELS = [
  { x: [7.6, 14.1], y: [21.0, 25.6], high: 19.9, low: 15.5 },
  { x: [7.6, 14.6], y: [-25.4, -21.0], high: 20.0, low: 15.5 },
];
// Transept met topgevels (kruis op +36,8 m) en traptorentjes op de vier hoeken.
const TRANSEPT = { x: [-7.6, 7.7], y: [-25.6, 25.8], eave: 24.5, ridge: 35.1, cross: 36.8 };
const TURRETS = { centres: [[-7.0, 26.5], [6.7, 26.7], [-6.6, -26.2], [7.1, -26.4]], radius: 1.4, top: 26.5, tip: 30.0 };
// Dakruiter op de viering: achtkantige lantaarn, smallere bovenlantaarn, spits.
const DAKRUITER = { radius: 1.6, lantern: 41.0, upperRadius: 1.0, upper: 44.0, tip: 49.5 };
// Toren: vierkant rond CENTRE, per geleding smaller, met diagonale steunberen
// op de hoeken die per geleding terugspringen en in pinakels eindigen.
const TOWER = {
  centre: [-43.2, 0.5],
  stages: [
    { half: 7.1, top: 36.5 },
    { half: 6.6, top: 51.6 },
    { half: 5.75, top: 62.8 },
  ],
  buttress: { width: 1.6, steps: [[22.0, 2.6], [36.5, 1.8], [51.6, 1.0]], pinnacle: 1.4, pinnacleTip: 57.0 },
  gallery: { width: 0.9, top: 52.8 },
  // De balustrade kraagt 0,3 m uit: die vlakke onderkant laat de export de
  // nissen behouden (overhangopvulling in plaats van verticale opvulling).
  crown: { width: 0.9, overhang: 0.3, top: 64.1, pinnacle: 1.2, pinnacleTop: 65.0, pinnacleTip: 66.4 },
  cap: { size: 3.0, top: 64.6, tip: 69.8 },
};
// Vensters als spitsboognissen.
const WINDOW = { aisle: 3.4, aisleFrom: 3.5, aisleTo: 12.8, depth: 0.5, transept: 6.5 };
// Maaiveld rondom (NAP +0,6 tot +0,8 m): Grotekerkplein, de straten aan de
// noord- en zuidkant en het plein achter het koor.
const GROUND_SAMPLES = [[-58, 0], [0, 34], [0, -34], [50, 0]];

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
// Vierkante pinakel: schacht tot `top` (NAP) en een piramide tot `tip`.
const pinnacle = ([x, y], size, top, tip) => {
  const h = size / 2;
  const square = [[x - h, y - h], [x + h, y - h], [x + h, y + h], [x - h, y + h]];
  return Manifold.hull([...at(square, BASE), ...at(square, NAP(top)), [x, y, NAP(tip)]]);
};
// Achtkantig torentje: schacht tot `top` en een spits tot `tip` (NAP).
const turret = ([x, y], r, z0, top, tip) =>
  Manifold.union([
    Manifold.cylinder(NAP(top) - z0, r, r, 8).translate([x, y, z0]),
    Manifold.cylinder(tip - top, r, 0, 8).translate([x, y, NAP(top)]),
  ]);
// Zadeldak met topgevels op een rechthoek; de nok loopt langs `along`.
const gable = ([x0, x1], [y0, y1], eave, ridge, along, z0 = BASE) => {
  const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const ridgeLine =
    along === "x"
      ? [[x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2]]
      : [[(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1]];
  return Manifold.hull([...at(corners, z0), ...at(corners, NAP(eave)), ...at(ridgeLine, NAP(ridge))]);
};
// Spitsboognis in een gevel: breedte w, van z0 tot z1 (NAP), bovenkant onder 60
// graden. `at` is het midden onderaan op het gevelvlak, `normal` de richting
// naar buiten (eenheidsvector in het grondvlak).
const niche = ([cx, cy], [nx, ny], w, z0, z1, depth) => {
  const rise = (w / 2) * Math.tan(Math.PI / 3);
  const profile = [[-w / 2, NAP(z0)], [w / 2, NAP(z0)], [w / 2, NAP(z1) - rise], [0, NAP(z1)], [-w / 2, NAP(z1) - rise]];
  const pts = [];
  for (const d of [-depth, 1.5]) {
    for (const [u, z] of profile) pts.push([cx + nx * d - ny * u, cy + ny * d + nx * u, z]);
  }
  return Manifold.hull(pts);
};
const unit = (deg) => [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];

// ---------- opbouw: kerk ----------
const apsePoints = [90, 54, 18, -18, -54, -90].map((deg) => polar(APSE.center, APSE.radius, deg));
const naveOutline = [[NAVE.from, -NAVE.halfWidth], ...[...apsePoints].reverse(), [NAVE.from, NAVE.halfWidth]];
// Dwarsprofiel van een zijbeuk (y, z) aan de kant s (+1 noord, -1 zuid).
const aisle = ([x0, x1], ridge, s) => {
  const profile = [
    [NAVE.halfWidth, BASE], [NAVE.halfWidth, NAP(AISLE.valley)], [AISLE.ridgeY, NAP(ridge)],
    [AISLE.wall, NAP(AISLE.eave)], [AISLE.wall, BASE],
  ];
  return clip(Manifold.hull([x0, x1].flatMap((x) => profile.map(([y, z]) => [x, s * y, z]))));
};
const ambulatoryRing = (r) => [90, 54, 18, -18, -54, -90].map((deg) => polar(APSE.center, r, deg));
const halfDecagon = (apothem) => ambulatoryRing(apothem / Math.cos(Math.PI / 10));
const parts = [
  // Lage delen tot de bovenkant van de steunberen.
  clip(box([-100, 100], [-100, 100], BASE, NAP(LOW))),
  // Schip en koor met de afgeschilde koorsluiting.
  Manifold.hull([
    ...at(naveOutline, BASE),
    ...at(naveOutline, NAP(NAVE.eave)),
    [NAVE.from, 0, NAP(NAVE.ridge)],
    [APSE.center[0], 0, NAP(NAVE.ridge)],
  ]),
  // Zijbeuken langs schip en koor.
  ...[1, -1].flatMap((s) => [aisle(NAVE_AISLE.x, NAVE_AISLE.ridge, s), aisle(CHOIR_AISLE.x, CHOIR_AISLE.ridge, s)]),
  // Kooromgang: lessenaarsdak van de koorsluiting naar de buitenmuur.
  clip(
    Manifold.hull([
      ...at(halfDecagon(AMBULATORY.apothem), BASE),
      ...at(halfDecagon(AMBULATORY.apothem), NAP(AMBULATORY.eave)),
      ...at(ambulatoryRing(AMBULATORY.inner), NAP(AMBULATORY.high)),
    ]),
  ),
  // Transept met topgevels.
  clip(gable(TRANSEPT.x, TRANSEPT.y, TRANSEPT.eave, TRANSEPT.ridge, "y")),
  // Dakruiter: achtkantige lantaarn, bovenlantaarn en spits.
  Manifold.cylinder(NAP(DAKRUITER.lantern) - NAP(33), DAKRUITER.radius, DAKRUITER.radius, 8).translate([0, 0, NAP(33)]),
  Manifold.cylinder(DAKRUITER.upper - DAKRUITER.lantern, DAKRUITER.upperRadius, DAKRUITER.upperRadius, 8)
    .translate([0, 0, NAP(DAKRUITER.lantern)]),
  Manifold.cylinder(DAKRUITER.tip - DAKRUITER.upper, DAKRUITER.upperRadius, 0, 8).translate([0, 0, NAP(DAKRUITER.upper)]),
];
// Kapellen in de oksels van transept en koor: lessenaarsdak aflopend naar het oosten.
for (const c of CHAPELS) {
  const [[x0, x1], [y0, y1]] = [c.x, c.y];
  parts.push(
    clip(
      Manifold.hull([
        ...at([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], BASE),
        [x0, y0, NAP(c.high)], [x0, y1, NAP(c.high)], [x1, y0, NAP(c.low)], [x1, y1, NAP(c.low)],
      ]),
    ),
  );
}
// Balustrades langs de goten van de zijbeuken en de kooromgang.
const bw = BALUSTRADE.width;
for (const s of [1, -1]) {
  for (const xs of [NAVE_AISLE.x, CHOIR_AISLE.x]) {
    const ys = [s * (AISLE.wall - bw), s * AISLE.wall].sort((a, b) => a - b);
    parts.push(clip(box(xs, ys, BASE, NAP(BALUSTRADE.top))));
  }
}
parts.push(
  clip(
    prism(halfDecagon(AMBULATORY.apothem), BASE, NAP(BALUSTRADE.top)).subtract(
      prism(halfDecagon(AMBULATORY.apothem - bw), BASE - 1, NAP(BALUSTRADE.top) + 1),
    ),
  ),
);
// Pinakels op de steunberen langs de zijbeuken en de hoeken van de kooromgang.
const B = BUTTRESSES;
for (const x of B.north) parts.push(pinnacle([x, B.y], B.size, B.top, B.tip));
for (const x of B.south) parts.push(pinnacle([x, -B.y], B.size, B.top, B.tip));
for (const deg of [54, 18, -18, -54]) {
  parts.push(pinnacle(polar(APSE.center, AMBULATORY.apothem / Math.cos(Math.PI / 10) + 0.4, deg), B.size, B.top, B.tip));
}
// Traptorentjes op de hoeken van het transept en het kruis op de topgevels.
for (const c of TURRETS.centres) parts.push(turret(c, TURRETS.radius, BASE, TURRETS.top, TURRETS.tip));
for (const y of [TRANSEPT.y[0] + 0.5, TRANSEPT.y[1] - 0.5]) {
  parts.push(pinnacle([0, y], 1.0, TRANSEPT.ridge + 0.4, TRANSEPT.cross));
}

// Vensters als nissen: per travee in de zijbeuken, in de westgevels van de
// zijbeuken, de vlakken van kooromgang en koorsluiting en de topgevels van het
// transept.
const windows = [];
const bays = (xs) => xs.slice(1).map((x, i) => (xs[i] + x) / 2);
for (const x of bays([...B.north.slice(0, 6), TRANSEPT.x[0]])) {
  windows.push(niche([x, AISLE.wall], [0, 1], WINDOW.aisle, WINDOW.aisleFrom, WINDOW.aisleTo, WINDOW.depth));
}
for (const x of bays(B.north.slice(5).map((x, i) => (i === 0 ? CHAPELS[0].x[1] : x)))) {
  windows.push(niche([x, AISLE.wall], [0, 1], WINDOW.aisle, WINDOW.aisleFrom, WINDOW.aisleTo, WINDOW.depth));
}
for (const x of bays([...B.south.slice(0, 6), TRANSEPT.x[0] + 0.5])) {
  windows.push(niche([x, -20.9], [0, -1], WINDOW.aisle, WINDOW.aisleFrom, WINDOW.aisleTo, WINDOW.depth));
}
for (const x of bays(B.south.slice(5).map((x, i) => (i === 0 ? CHAPELS[1].x[1] : x)))) {
  windows.push(niche([x, -20.9], [0, -1], WINDOW.aisle, WINDOW.aisleFrom, WINDOW.aisleTo, WINDOW.depth));
}
windows.push(
  niche([-50.2, 14.5], [-1, 0], WINDOW.aisle, WINDOW.aisleFrom, WINDOW.aisleTo, WINDOW.depth),
  niche([-48.8, -15.0], [-1, 0], WINDOW.aisle, WINDOW.aisleFrom, WINDOW.aisleTo, WINDOW.depth),
);
for (const deg of [72, 36, 0, -36, -72]) {
  windows.push(niche(polar(APSE.center, AMBULATORY.apothem, deg), unit(deg), WINDOW.aisle, WINDOW.aisleFrom, WINDOW.aisleTo, WINDOW.depth));
  const r = APSE.radius * Math.cos(Math.PI / 10);
  windows.push(niche(polar(APSE.center, r, deg), unit(deg), 2.2, 19.5, 23.8, WINDOW.depth));
}
for (const [y, ny] of [[TRANSEPT.y[0], -1], [TRANSEPT.y[1], 1]]) {
  windows.push(niche([0, y], [0, ny], WINDOW.transept, 6.0, 22.5, WINDOW.depth));
}

// ---------- opbouw: toren ----------
const T = TOWER;
const [tcx, tcy] = T.centre;
const square = (half) => [[tcx - half, tcy - half], [tcx + half, tcy - half], [tcx + half, tcy + half], [tcx - half, tcy + half]];
const towerParts = T.stages.map(({ half, top }) => prism(square(half), BASE, NAP(top)));
// Diagonale steunberen op de vier hoeken van de onderbouw, per geleding minder
// uitspringend, met een pinakel op de omloop.
const h0 = T.stages[0].half;
for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
  const corner = [tcx + sx * h0, tcy + sy * h0];
  const d = [sx / Math.SQRT2, sy / Math.SQRT2];
  const n = [-d[1], d[0]];
  for (const [top, out] of T.buttress.steps) {
    const pts = [];
    for (const t of [-1.5, out]) {
      for (const s of [-1, 1]) {
        const q = [corner[0] + d[0] * t + n[0] * s * (T.buttress.width / 2), corner[1] + d[1] * t + n[1] * s * (T.buttress.width / 2)];
        pts.push([...q, BASE], [...q, NAP(top)]);
      }
    }
    towerParts.push(Manifold.hull(pts));
  }
  const g = T.stages[1].half - T.buttress.pinnacle / 2;
  towerParts.push(pinnacle([tcx + sx * g, tcy + sy * g], T.buttress.pinnacle, T.gallery.top + 0.6, T.buttress.pinnacleTip));
  const c = T.stages[2].half - T.crown.pinnacle / 2;
  towerParts.push(pinnacle([tcx + sx * c, tcy + sy * c], T.crown.pinnacle, T.crown.pinnacleTop, T.crown.pinnacleTip));
}
// Borstwering van de omloop en de uitkragende balustrade van de vierde geleding.
const gh = T.stages[1].half;
towerParts.push(prism(square(gh), BASE, NAP(T.gallery.top)).subtract(prism(square(gh - T.gallery.width), BASE - 1, 200)));
const ch = T.stages[2].half + T.crown.overhang;
towerParts.push(
  prism(square(ch), NAP(T.stages[2].top), NAP(T.crown.top)).subtract(prism(square(ch - T.crown.width), BASE - 1, 200)),
);
// Koperen bekroning in het midden.
towerParts.push(pinnacle(T.centre, T.cap.size, T.cap.top, T.cap.tip));
let tower = Manifold.union(towerParts);
// Nissen: portaal en westvenster, drie nissen per gevel in de bovenste
// geleding van de onderbouw en in de derde geleding, twee in de vierde.
const faces = (half) => [
  [[tcx - half, tcy], [-1, 0], "w"],
  [[tcx, tcy + half], [0, 1], "n"],
  [[tcx, tcy - half], [0, -1], "z"],
  [[tcx + half, tcy], [1, 0], "o"],
];
const towerNiches = [
  niche([tcx - h0, tcy], [-1, 0], 3.2, GROUND_NAP, 9.5, 1.2),
  niche([tcx - h0, tcy], [-1, 0], 5.0, 11.5, 21.0, 0.5),
];
const tiers = [
  { half: h0, z: [24.5, 34.5], width: 2.2, offsets: [-3.6, 0, 3.6], east: false },
  { half: T.stages[1].half, z: [38.5, 50.0], width: 2.6, offsets: [-3.6, 0, 3.6], east: true },
  { half: T.stages[2].half, z: [54.0, 61.5], width: 2.0, offsets: [-2.0, 2.0], east: true },
];
for (const tier of tiers) {
  for (const [[fx, fy], [nx, ny], side] of faces(tier.half)) {
    if (side === "o" && !tier.east) continue;
    for (const k of tier.offsets) {
      towerNiches.push(niche([fx - ny * k, fy + nx * k], [nx, ny], tier.width, tier.z[0], tier.z[1], 0.5));
    }
  }
}
tower = tower.subtract(Manifold.union(towerNiches));
parts.push(tower);

const church = Manifold.union(parts).subtract(Manifold.union(windows));
const nodes = [["building:laurenskerk", church]];

// ---------- controles ----------
if (church.status() !== "NoError") throw new Error(church.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // alleen de uitkragende balustrade van de vierde geleding hoort erbij.
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
  const allowed = NAP(TOWER.stages[2].top).toFixed(2);
  for (const [z, area] of levels) if (z !== allowed && area > 0.01) throw new Error(`overhang op z ${z}`);
  if (!levels.has(allowed)) throw new Error("uitkraging van de balustrade ontbreekt");
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
const glbFile = path.join(outDir, "laurenskerk.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-laurenskerk.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `laurenskerk-1-${scale}.stl`);
const printSolid = church.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Laurenskerk Rotterdam 1:${scale} mm Z-up`);
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
  path.join(outDir, "laurenskerk.json"),
  JSON.stringify(
    {
      name: "Grote of Sint-Laurenskerk",
      file: "laurenskerk.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +0,6 tot +0,8 m): Grotekerkplein, de
      // straten aan de noord- en zuidkant en het plein achter het koor.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0599100000702379"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (92975,1, 437394,4), op de viering onder de dakruiter, op het maaiveld (NAP +0,7 m), +X langs de as van de toren naar het koor in het oostnoordoosten (RD-richting 15,1 graden) en +Y naar het noordnoordwesten; de toren staat aan de -X-kant. Eén node building: lage delen tot de steunberen (NAP +13,5 m), de zijbeuken langs schip en koor onder eigen zadeldaken (nok +24,7 en +25,2 m) met balustrades en pinakels op de steunberen, de kooromgang onder een lessenaarsdak met balustrade, kapellen in de oksels van transept en koor, schip en koor onder één zadeldak (goot +24,5 m, nok +35,1 m) met afgeschilde koorsluiting, het transept met topgevels en vier traptorentjes, de dakruiter (+49,5 m), en de westtoren in vier geledingen met diagonale hoeksteunberen, portaal, westvenster en spitsboognissen, de omloop op +51,6 m met hoekpinakels, de vierde geleding tot +62,8 m met balustrade (+64,1 m) en hoekpinakels, en de bekroning tot +69,8 m. Alles staat recht op of loopt schuin omhoog, behalve de balustrade van de vierde geleding die 0,3 m uitkraagt, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0599100000702379. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`laurenskerk-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        naveRidgeNapM: NAVE.ridge,
        dakruiterNapM: DAKRUITER.tip,
        towerGalleryNapM: TOWER.stages[1].top,
        towerBalustradeNapM: TOWER.crown.top,
        towerCapNapM: TOWER.cap.tip,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Grote_of_Sint-Laurenskerk_(Rotterdam)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/32783",
        "PDOK BAG pand 0599100000702379 (contour), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dwarsprofielen van schip, zijbeuken, transept, koor en kooromgang, raster van de toren en de dakruiter, maaiveld",
        "Wikimedia Commons: foto's van de toren, de noordoostzijde, het koor en de kooromgang",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een gesloten 3D-model van de Grote of Onze-Lieve-Vrouwekerk in
// Dordrecht: de kruisbasiliek in Brabantse gotiek met het hoge schip en koor
// onder één zadeldak dat over de veelhoekige koorsluiting afschildt, de
// zijbeuken met lessenaarsdaken en een rij topgevels per travee, de luchtbogen
// als schuine steunmuren met pinakels op de steunberen, de kooromgang met vijf
// straalkapellen onder tentdaken, het Mariakoor onder een eigen hoog zadeldak,
// het transept met hoekpinakels en de dakruiter op de viering, en de
// onvoltooide ‘stompe’ westtoren met verspringende hoeksteunberen, nissen voor
// het westvenster en de galmgaten, de balustrade met hoekpinakels op het
// platform en de uurwerkstoel met vier uurwerkpaviljoens onder frontons. Alle
// maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, één node met de materiaalklasse in de nodenaam) als catalogusbron
// voor de export en de kaart, plus een binaire STL in millimeters op
// 1:<schaal>.
//
//   node scripts/generate-grote-kerk-dordrecht.mjs              # 1:1000 (standaard)
//   node scripts/generate-grote-kerk-dordrecht.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alle onderdelen zijn minstens 0,9 m dik en
// staan recht op of lopen schuin omhoog; de nissen hebben een spitse bovenkant
// van 60 graden. Alleen de frontons van de uurwerkpaviljoens kragen 0,3 m uit;
// die vlakke onderkant laat de export de nissen behouden (zie de controle
// onderaan).
//
// Assenstelsel: oorsprong op RD (104898,5, 425308,7), midden in de kerk, op het
// maaiveld aan de zuidkant (NAP +2,6 m), Z omhoog. +X loopt langs de as van de
// kerk naar het koor in het oostzuidoosten (RD-richting -10,6 graden), +Y naar
// het noordnoordoosten; de toren staat aan de -X-kant.
//
// Bronnen: BAG-panden 0505100000013404 (kerk) en 0505100000013971 (toren);
// AHN DSM/DTM 0,5 m (PDOK WCS) in een stelsel langs de as: dwarsprofielen van
// schip, zijbeuken, koor en Mariakoor, lengteprofielen langs de zijbeuken
// (topgevels en luchtbogen per travee), de pieken van straalkapellen en
// pinakels rond de koorsluiting, het raster van de torenbekroning (platform
// NAP +55,4 m, uurwerkstoel +60,5 m, paviljoens tot +66 m) en het maaiveld; de
// PDOK 3D-gebouwreconstructie (LoD2.2) van beide panden als vergelijking;
// foto's op Wikimedia Commons (RCE: luchtbogen, koor, toren); Wikipedia.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-dordrecht");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 2,6 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [104898.5, 425308.7];
const ANGLE = (-10.6 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 2.6;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour van de kerk (lokaal, vereenvoudigd tot 0,3 m).
const OUTLINE = [
  [50.0, -1.8], [50.9, -1.2], [50.6, -0.5], [49.7, -0.8], [47.7, 0.9], [47.9, 1.6], [49.1, 1.8], [48.8, 2.9],
  [47.2, 2.7], [47.7, 5.4], [48.7, 5.5], [48.5, 6.3], [47.5, 6.1], [46.0, 8.2], [46.6, 9.2], [45.9, 9.7], [45.2, 8.7],
  [42.7, 9.2], [42.6, 9.7], [43.4, 10.7], [42.5, 11.3], [41.3, 10.4], [40.4, 12.8], [40.8, 13.6], [40.1, 13.9],
  [39.5, 13.0], [37.5, 12.7], [37.3, 13.3], [36.6, 13.2], [36.8, 12.4], [34.9, 13.1], [34.8, 16.1], [36.6, 16.8],
  [36.1, 17.9], [34.4, 17.1], [32.6, 19.6], [33.7, 21.3], [32.8, 21.8], [31.6, 19.9], [28.7, 20.7], [28.7, 22.8],
  [27.6, 22.8], [27.6, 21.1], [23.4, 21.1], [23.3, 22.7], [22.2, 22.7], [22.2, 21.0], [18.4, 21.0], [18.5, 22.5],
  [17.2, 22.5], [17.2, 20.9], [13.2, 20.9], [13.2, 22.4], [12.1, 22.4], [12.2, 20.8], [8.2, 20.8], [8.2, 22.3],
  [7.0, 22.2], [7.0, 20.6], [3.7, 20.7], [3.7, 22.1], [2.8, 22.1], [2.9, 23.3], [-3.2, 23.6], [-3.2, 22.9],
  [-6.5, 23.0], [-6.4, 23.5], [-7.2, 23.6], [-7.2, 22.9], [-12.2, 23.0], [-12.2, 23.5], [-12.9, 23.5], [-13.0, 20.0],
  [-55.2, 20.8], [-55.3, 14.5], [-41.1, 14.3], [-41.1, 13.4], [-40.5, 13.4], [-40.7, 10.9], [-41.2, 11.0],
  [-41.3, 10.1], [-40.7, 10.1], [-40.9, 6.8], [-40.2, 6.8], [-40.5, -8.4], [-39.0, -8.5], [-39.0, -10.3],
  [-40.6, -10.3], [-40.5, -12.2], [-42.4, -12.3], [-42.5, -10.2], [-49.7, -10.1], [-49.8, -14.8], [-49.4, -14.4],
  [-44.9, -14.4], [-44.8, -20.3], [-40.4, -20.3], [-40.4, -20.8], [-39.6, -20.8], [-39.6, -20.3], [-34.3, -20.3],
  [-34.3, -20.8], [-33.6, -20.8], [-33.6, -20.3], [-28.5, -20.3], [-28.5, -20.8], [-27.9, -20.8], [-27.9, -20.3],
  [-22.8, -20.3], [-22.8, -20.8], [-21.9, -20.8], [-21.9, -20.3], [-17.0, -20.4], [-17.0, -20.8], [-16.3, -20.8],
  [-16.3, -20.4], [-12.1, -20.4], [-12.1, -20.8], [-11.5, -20.8], [-11.5, -21.8], [-12.6, -22.9], [-12.6, -23.6],
  [-11.0, -22.6], [1.1, -22.8], [2.2, -23.8], [7.6, -23.8], [7.7, -20.2], [12.2, -20.2], [12.2, -20.8],
  [12.9, -20.7], [12.9, -20.2], [17.5, -20.2], [17.5, -20.7], [18.2, -20.7], [18.2, -20.2], [22.7, -20.1],
  [22.7, -20.7], [23.4, -20.7], [23.4, -20.1], [28.1, -20.1], [28.1, -20.6], [28.7, -20.6], [28.7, -20.1],
  [32.6, -20.1], [32.8, -21.3], [33.9, -21.2], [33.8, -20.0], [34.2, -19.6], [36.6, -20.5], [36.6, -21.7],
  [37.5, -21.7], [37.5, -20.6], [39.8, -19.6], [40.7, -20.3], [41.3, -19.6], [40.5, -19.1], [41.5, -16.4],
  [42.8, -17.4], [43.5, -16.8], [42.8, -16.0], [42.9, -15.3], [45.5, -14.8], [46.1, -15.6], [46.8, -15.1],
  [46.2, -14.3], [47.6, -12.0], [48.6, -12.3], [48.8, -11.4], [47.8, -11.2], [47.3, -8.6], [47.7, -8.3],
  [48.8, -8.8], [49.2, -7.8], [48.0, -7.4], [48.0, -6.9], [49.6, -5.0], [50.6, -5.4], [50.8, -4.7], [49.9, -4.2],
];
// Lage kapellen en aanbouwen binnen de contour (noordkant schip, naast de toren).
const LOW = 9.5;
// Schip en koor: lichtbeukmuren tot de goot, zadeldak, koorsluiting als halve
// tienhoek rond APSE.center die naar de nok afschildt.
const NAVE = { y: [-9.9, 4.9], axis: -2.5, eave: 28.8, ridge: 39.0, from: -41.5, to: 32.0 };
const APSE = { center: [32.0, -2.5], radius: 7.4 };
// Zijbeuken langs het schip: lessenaarsdak van de lichtbeukmuur naar de
// topgevelstrook langs de buitenmuur, één topgevel per travee.
const NAVE_BAYS = [-41.5, -33.95, -28.2, -22.35, -16.65, -12.3];
const SOUTH_AISLE = { wall: -20.4, gableFrom: -17.2, top: 20.5, eave: 18.3 };
const NORTH_AISLE = { wall: 16.6, gableFrom: 13.6, top: 19.5, eave: 18.3 };
const AISLE_GABLE = 21.5;
// Luchtbogen (als volle steunmuren van 1 m) met pinakels op de buitenste steunbeer.
const NAVE_FLYERS = [-33.95, -28.2, -22.35, -16.65];
const FLYER = { width: 1.0, low: 21.5, high: 24.5, pinnacle: 1.1, pinnacleTop: 22.0, pinnacleTip: 23.8 };
// Kapellen langs de zuidkant van het koor (lessenaarsdak) met luchtbogen.
const CHOIR_SOUTH = { x: [2.5, 34.0], wall: -20.4, top: 17.5, eave: 16.5 };
const CHOIR_FLYERS = [7.6, 12.55, 17.85, 23.05, 28.4];
// Kooromgang: vijf straalkapellen onder tentdaken, pinakels met luchtbogen ertussen.
const AMBULATORY = { eave: 16.5, chapelTip: 22.5, chapelRadius: 12.0, chapelsDeg: [-70, -35, 0, 35, 70] };
const AMB_PINNACLES = { radius: 12.3, deg: [-87.5, -52.5, -17.5, 17.5, 52.5, 87.5], top: 23.0, tip: 24.8 };
// Mariakoor ten noorden van het koor: één hoog zadeldak (nok langs X op y 15),
// aan de oostkant afgewolfd, met steunberen langs de noordgevel.
const MARIAKOOR = { x: [2.5, 35.5], south: [4.6, 15.7], ridge: [15.0, 29.2], north: [20.8, 21.0], ridgeTo: 29.5 };
const MARIAKOOR_BUTTRESSES = [3.25, 7.6, 12.65, 17.85, 22.75, 28.15];
// Transept met topgevels, hoekpinakels en de dakruiter op de viering.
const TRANSEPT = { x: [-12.6, 2.8], y: [-22.8, 23.3], eave: 27.5, ridge: 38.0 };
const DAKRUITER = { center: [-4.9, -2.5], radius: 1.8, lantern: 45.0, tip: 56.0 };
// Toren: romp met hoeksteunberen die per geleding terugspringen, tot het
// platform; daarop balustrade, hoekpinakels, de uurwerkstoel met een laag
// tentdak en vier paviljoens met een uurwerk en een fronton.
const TOWER = {
  x: [-55.6, -41.9],
  y: [-8.1, 7.3],
  platform: 55.4,
  // Onderbouw tot de eerste geleding, breder dan de romp (BAG-contour).
  plinth: { x: [-56.6, -41.2], y: [-10.0, 7.3], top: 24.0 },
  buttress: { width: 1.8, steps: [[24.0, 2.0], [42.0, 1.3], [55.4, 0.7]] },
  balustrade: { width: 0.9, top: 56.6 },
  cornerPinnacle: { size: 1.5, top: 57.8, tip: 59.6 },
  stool: { x: [-54.0, -43.2], y: [-5.3, 4.0], top: 60.5, tip: 61.3 },
  pavilion: { top: 64.0, tip: 66.0, overhang: 0.3 },
  // Uurwerkpaviljoens (noord, zuid, oost, west); de frontons kijken naar buiten.
  pavilions: [
    { x: [-52.7, -46.7], y: [4.0, 6.8], along: "y" },
    { x: [-52.7, -46.7], y: [-7.6, -4.8], along: "y" },
    { x: [-45.3, -42.6], y: [-3.8, 2.2], along: "x" },
    { x: [-54.9, -53.0], y: [-3.8, 2.2], along: "x" },
  ],
  niche: { depth: 0.6, west: [5.2, 6.0, 27.0], tiers: [[30.0, 40.5], [43.0, 53.5]], width: 2.2, spacing: 3.7 },
};
// Vensters als spitsboognissen in de gevels.
const WINDOW = { width: 2.4, depth: 0.5, transept: 6.0 };
// Maaiveld (lokaal) rondom; het laagste punt aan de zuidkant.
const GROUND_SAMPLES = [[0, 32], [-64, 0], [56, 0], [16, -24]];

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
// Zadeldak met topgevels op een rechthoek; de nok loopt langs `along`.
const gable = ([x0, x1], [y0, y1], eave, ridge, along, z0 = BASE) => {
  const corners = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const ridgeLine =
    along === "x"
      ? [[x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2]]
      : [[(x0 + x1) / 2, y0], [(x0 + x1) / 2, y1]];
  return Manifold.hull([...at(corners, z0), ...at(corners, NAP(eave)), ...at(ridgeLine, NAP(ridge))]);
};
// Lessenaarsdak over x0..x1: van (yHigh, high) naar (yLow, low), plus de strook
// tot yWall op hoogte `low`.
const leanTo = ([x0, x1], yHigh, high, yLow, low, yWall) =>
  Manifold.union([
    Manifold.hull([
      ...at([[x0, yHigh], [x1, yHigh], [x0, yLow], [x1, yLow]], BASE),
      [x0, yHigh, NAP(high)], [x1, yHigh, NAP(high)], [x0, yLow, NAP(low)], [x1, yLow, NAP(low)],
    ]),
    ...(Math.abs(yWall - yLow) > 0.01
      ? [box([x0, x1], [Math.min(yLow, yWall), Math.max(yLow, yWall)], BASE, NAP(low))]
      : []),
  ]);
// Steunmuur (luchtboog dichtgezet) van `width` breed langs Y bij x, met een
// schuine bovenkant van (y0, z0) naar (y1, z1).
const flyer = (x, width, [y0, z0], [y1, z1]) => {
  const xs = [x - width / 2, x + width / 2];
  return Manifold.hull(xs.flatMap((xx) => [[xx, y0, BASE], [xx, y1, BASE], [xx, y0, NAP(z0)], [xx, y1, NAP(z1)]]));
};
// Idem in een willekeurige richting in het grondvlak (straalsgewijs).
const radialFlyer = (from, to, width, z0, z1) => {
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

// ---------- opbouw: kerk ----------
const apsePoints = [90, 54, 18, -18, -54, -90].map((deg) => polar(APSE.center, APSE.radius, deg));
const naveOutline = [[NAVE.from, NAVE.y[0]], ...apsePoints.reverse(), [NAVE.from, NAVE.y[1]]].map(([x, y]) => [
  x,
  Math.min(Math.max(y, NAVE.y[0]), NAVE.y[1]),
]);
const parts = [
  // Lage kapellen en aanbouwen.
  clip(box([-100, 100], [-100, 100], BASE, NAP(LOW))),
  // Schip en koor met de afgeschilde koorsluiting.
  Manifold.hull([
    ...at(naveOutline, BASE),
    ...at(naveOutline, NAP(NAVE.eave)),
    [NAVE.from, NAVE.axis, NAP(NAVE.ridge)],
    [NAVE.to, NAVE.axis, NAP(NAVE.ridge)],
  ]),
  // Zijbeuken langs het schip.
  clip(leanTo([NAVE.from, -12.3], NAVE.y[0] + 0.3, SOUTH_AISLE.top, SOUTH_AISLE.gableFrom, SOUTH_AISLE.eave, SOUTH_AISLE.wall)),
  clip(leanTo([NAVE.from, -12.3], NAVE.y[1] - 0.3, NORTH_AISLE.top, NORTH_AISLE.gableFrom, NORTH_AISLE.eave, NORTH_AISLE.wall)),
  // Kapellen langs de zuidkant van het koor.
  clip(leanTo(CHOIR_SOUTH.x, NAVE.y[0] + 0.3, CHOIR_SOUTH.top, CHOIR_SOUTH.wall, CHOIR_SOUTH.eave, CHOIR_SOUTH.wall)),
  // Kooromgang tot de goot.
  clip(box([APSE.center[0] - 1, 60], [-40, 40], BASE, NAP(AMBULATORY.eave))),
  // Transept met topgevels.
  clip(gable(TRANSEPT.x, TRANSEPT.y, TRANSEPT.eave, TRANSEPT.ridge, "y")),
  // Mariakoor.
  clip(
    Manifold.hull([
      ...[MARIAKOOR.x[0], MARIAKOOR.x[1]].flatMap((x) => [
        [x, MARIAKOOR.south[0], BASE], [x, MARIAKOOR.north[0], BASE],
        [x, MARIAKOOR.south[0], NAP(MARIAKOOR.south[1])], [x, MARIAKOOR.north[0], NAP(MARIAKOOR.north[1])],
      ]),
      [MARIAKOOR.x[0], MARIAKOOR.ridge[0], NAP(MARIAKOOR.ridge[1])],
      [MARIAKOOR.ridgeTo, MARIAKOOR.ridge[0], NAP(MARIAKOOR.ridge[1])],
    ]),
  ),
  // Dakruiter: achtkantige lantaarn en spits.
  Manifold.cylinder(NAP(DAKRUITER.lantern) - NAP(34), DAKRUITER.radius, DAKRUITER.radius, 8)
    .translate([...DAKRUITER.center, NAP(34)]),
  Manifold.cylinder(DAKRUITER.tip - DAKRUITER.lantern, DAKRUITER.radius, 0, 8)
    .translate([...DAKRUITER.center, NAP(DAKRUITER.lantern)]),
];
// Topgevels per travee op de buitenkant van de zijbeuken.
for (let i = 0; i + 1 < NAVE_BAYS.length; i++) {
  const bay = [NAVE_BAYS[i] + 0.5, NAVE_BAYS[i + 1] - 0.5];
  parts.push(clip(gable(bay, [SOUTH_AISLE.wall, SOUTH_AISLE.gableFrom], SOUTH_AISLE.eave, AISLE_GABLE, "y")));
  parts.push(clip(gable(bay, [NORTH_AISLE.gableFrom, NORTH_AISLE.wall], NORTH_AISLE.eave, AISLE_GABLE, "y")));
}
// Luchtbogen langs het schip, met de pinakels op de buitenste steunberen.
for (const x of NAVE_FLYERS) {
  parts.push(flyer(x, FLYER.width, [-18.0, FLYER.low], [NAVE.y[0], FLYER.high]));
  parts.push(flyer(x, FLYER.width, [15.0, FLYER.low], [NAVE.y[1], FLYER.high]));
  parts.push(pinnacle([x, -18.6], FLYER.pinnacle, FLYER.pinnacleTop, FLYER.pinnacleTip));
  parts.push(pinnacle([x, 15.6], FLYER.pinnacle, FLYER.pinnacleTop, FLYER.pinnacleTip));
}
// Luchtbogen langs de zuidkant van het koor.
for (const x of CHOIR_FLYERS) parts.push(flyer(x, FLYER.width, [-19.6, 19.5], [NAVE.y[0], 23.5]));
// Straalkapellen: tentdak over een sector van 35 graden rond de koorsluiting.
for (const deg of AMBULATORY.chapelsDeg) {
  const rim = [deg - 17.5, deg + 17.5].map((d) => polar(APSE.center, 16, d));
  const inner = [deg - 17.5, deg + 17.5].map((d) => polar(APSE.center, APSE.radius - 0.5, d));
  parts.push(
    clip(
      Manifold.hull([
        ...at([...rim, ...inner], BASE),
        ...at([...rim, ...inner], NAP(AMBULATORY.eave)),
        [...polar(APSE.center, AMBULATORY.chapelRadius, deg), NAP(AMBULATORY.chapelTip)],
      ]),
    ),
  );
}
// Pinakels tussen de straalkapellen met luchtbogen naar de koorsluiting.
for (const deg of AMB_PINNACLES.deg) {
  const foot = polar(APSE.center, AMB_PINNACLES.radius, deg);
  parts.push(pinnacle(foot, FLYER.pinnacle, AMB_PINNACLES.top, AMB_PINNACLES.tip));
  parts.push(radialFlyer(foot, polar(APSE.center, APSE.radius - 0.3, deg), FLYER.width, 22.5, 26.5));
}
// Steunberen langs de noordgevel van het Mariakoor, met een schuine bovenkant.
for (const x of MARIAKOOR_BUTTRESSES) {
  parts.push(clip(flyer(x, 1.1, [22.6, 17.0], [MARIAKOOR.north[0] - 0.3, 19.5])));
}
// Hoekpinakels van het transept.
for (const x of [TRANSEPT.x[0] + 0.6, TRANSEPT.x[1] - 0.6]) {
  for (const y of [TRANSEPT.y[0] + 0.6, TRANSEPT.y[1] - 0.6]) {
    parts.push(pinnacle([x, y], 1.2, TRANSEPT.eave + 3.0, TRANSEPT.eave + 5.5));
  }
}

// Vensters als nissen: lichtbeuk van schip en koor per travee, de vlakken van
// de koorsluiting en de topgevels van het transept.
const windows = [];
for (let i = 0; i + 1 < NAVE_BAYS.length; i++) {
  const x = (NAVE_BAYS[i] + NAVE_BAYS[i + 1]) / 2;
  windows.push(niche([x, NAVE.y[0]], [0, -1], WINDOW.width, 22.0, 27.8, WINDOW.depth));
  windows.push(niche([x, NAVE.y[1]], [0, 1], WINDOW.width, 21.0, 27.8, WINDOW.depth));
}
const choirBays = [TRANSEPT.x[1], ...CHOIR_FLYERS, APSE.center[0]];
for (let i = 0; i + 1 < choirBays.length; i++) {
  windows.push(niche([(choirBays[i] + choirBays[i + 1]) / 2, NAVE.y[0]], [0, -1], WINDOW.width, 19.5, 27.8, WINDOW.depth));
}
for (const deg of [72, 36, 0, -36, -72]) {
  const r = APSE.radius * Math.cos((18 * Math.PI) / 180);
  const n = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
  windows.push(niche(polar(APSE.center, r, deg), n, WINDOW.width, 19.0, 27.8, WINDOW.depth));
}
for (const [y, ny] of [[TRANSEPT.y[0], -1], [TRANSEPT.y[1], 1]]) {
  windows.push(niche([(TRANSEPT.x[0] + TRANSEPT.x[1]) / 2, y], [0, ny], WINDOW.transept, 11.0, 30.0, WINDOW.depth));
}

// ---------- opbouw: toren ----------
const T = TOWER;
const [tx0, tx1] = T.x;
const [ty0, ty1] = T.y;
const towerParts = [box(T.x, T.y, BASE, NAP(T.platform)), box(T.plinth.x, T.plinth.y, BASE, NAP(T.plinth.top))];
// Hoeksteunberen: op elke hoek één per vrije gevel (west, zuid, noord), haaks
// op de gevel, met per geleding minder uitsprong.
const bw = T.buttress.width;
let below = BASE;
for (const [top, out] of T.buttress.steps) {
  const z0 = below;
  const z1 = NAP(top);
  towerParts.push(
    box([tx0 - out, tx0], [ty0, ty0 + bw], z0, z1),
    box([tx0 - out, tx0], [ty1 - bw, ty1], z0, z1),
    box([tx0, tx0 + bw], [ty0 - out, ty0], z0, z1),
    box([tx1 - bw, tx1], [ty0 - out, ty0], z0, z1),
    box([tx0, tx0 + bw], [ty1, ty1 + out], z0, z1),
    box([tx1 - bw, tx1], [ty1, ty1 + out], z0, z1),
  );
  below = z1;
}
// Oostgevel: de hoeksteunberen naast het schip, zonder versprongen geledingen.
towerParts.push(
  box([tx1, tx1 + 1.2], [ty0, ty0 + bw], BASE, NAP(T.platform)),
  box([tx1, tx1 + 1.2], [ty1 - bw, ty1], BASE, NAP(T.platform)),
);
// Balustrade langs de rand van het platform en hoekpinakels.
const bal = T.balustrade.width;
towerParts.push(
  box(T.x, [ty0, ty0 + bal], BASE, NAP(T.balustrade.top)),
  box(T.x, [ty1 - bal, ty1], BASE, NAP(T.balustrade.top)),
  box([tx0, tx0 + bal], T.y, BASE, NAP(T.balustrade.top)),
  box([tx1 - bal, tx1], T.y, BASE, NAP(T.balustrade.top)),
);
const cp = T.cornerPinnacle;
for (const x of [tx0 + cp.size / 2, tx1 - cp.size / 2]) {
  for (const y of [ty0 + cp.size / 2, ty1 - cp.size / 2]) towerParts.push(pinnacle([x, y], cp.size, cp.top, cp.tip));
}
// Uurwerkstoel met een laag tentdak.
const st = T.stool;
const stoolCorners = [[st.x[0], st.y[0]], [st.x[1], st.y[0]], [st.x[1], st.y[1]], [st.x[0], st.y[1]]];
const stoolCentre = [(st.x[0] + st.x[1]) / 2, (st.y[0] + st.y[1]) / 2];
towerParts.push(
  Manifold.hull([...at(stoolCorners, BASE), ...at(stoolCorners, NAP(st.top)), [...stoolCentre, NAP(st.tip)]]),
);
// Vier uurwerkpaviljoens midden op de zijden van de stoel, met een fronton dat
// rondom 0,3 m uitkraagt.
const pv = T.pavilion;
const ov = pv.overhang;
for (const p of T.pavilions) {
  towerParts.push(box(p.x, p.y, BASE, NAP(pv.top)));
  towerParts.push(
    gable([p.x[0] - ov, p.x[1] + ov], [p.y[0] - ov, p.y[1] + ov], pv.top, pv.tip, p.along, NAP(pv.top)),
  );
}
let tower = Manifold.union(towerParts);
// Nissen: het westvenster boven de ingang en twee rijen van drie galmgaten op
// de west-, zuid- en noordgevel (de oostgevel alleen boven het schipdak).
const nc = T.niche;
const cx = (tx0 + tx1) / 2;
const cy = (ty0 + ty1) / 2;
const niches = [niche([tx0, cy], [-1, 0], nc.west[0], nc.west[1], nc.west[2], nc.depth)];
for (const [z0, z1] of nc.tiers) {
  for (const k of [-1, 0, 1]) {
    niches.push(
      niche([tx0, cy + k * nc.spacing], [-1, 0], nc.width, z0, z1, nc.depth),
      niche([cx + k * nc.spacing, ty0], [0, -1], nc.width, z0, z1, nc.depth),
      niche([cx + k * nc.spacing, ty1], [0, 1], nc.width, z0, z1, nc.depth),
    );
    if (z0 > NAVE.ridge) niches.push(niche([tx1, cy + k * nc.spacing], [1, 0], nc.width, z0, z1, nc.depth));
  }
}
tower = tower.subtract(Manifold.union(niches));
// Hoek tussen toren, schip en noordbeuk, en de steunbeer op de zuidoosthoek
// (in de inham van de kerkcontour).
parts.push(tower, box([-41.5, -40.0], [4.9, 7.0], BASE, NAP(19.5)), box([-42.5, -40.5], [-12.3, -9.3], BASE, NAP(24.0)), box([-40.6, -39.0], [-10.4, -8.4], BASE, NAP(24.0)));

const church = Manifold.union(parts).subtract(Manifold.union(windows));
const nodes = [["building:grote-kerk-dordrecht", church]];

// ---------- controles ----------
if (church.status() !== "NoError") throw new Error(church.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // alleen de uitkragende frontons van de uurwerkpaviljoens horen erbij.
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
  const allowed = NAP(T.pavilion.top).toFixed(2);
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
const glbFile = path.join(outDir, "grote-kerk-dordrecht.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-grote-kerk-dordrecht.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `grote-kerk-dordrecht-1-${scale}.stl`);
const printSolid = church.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Grote Kerk Dordrecht 1:${scale} mm Z-up`);
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
  path.join(outDir, "grote-kerk-dordrecht.json"),
  JSON.stringify(
    {
      name: "Grote of Onze-Lieve-Vrouwekerk",
      file: "grote-kerk-dordrecht.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +2,6 tot +3,1 m), niet op de lagere kade
      // aan de Oude Maas.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0505100000013404", "NL.IMBAG.Pand.0505100000013971"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (104898,5, 425308,7), midden in de kerk, op het maaiveld aan de zuidkant (NAP +2,6 m), +X langs de as naar het koor in het oostzuidoosten (RD-richting -10,6 graden) en +Y naar het noordnoordoosten; de toren staat aan de -X-kant. Eén node building: lage kapellen en aanbouwen (NAP +9,5 m), zijbeuken met lessenaarsdaken en een topgevel per travee, luchtbogen met pinakels, kapellen langs het koor, de kooromgang met vijf straalkapellen onder tentdaken, schip en koor onder één zadeldak (goot +28,8 m, nok +39,0 m) met afgeschilde koorsluiting, het transept met hoekpinakels (nok +38,0 m) en de dakruiter (+56 m), het Mariakoor (nok +29,2 m) en de stompe westtoren met verspringende hoeksteunberen, nissen voor westvenster en galmgaten, het platform op +55,4 m met balustrade en hoekpinakels en de uurwerkstoel met vier uurwerkpaviljoens tot +66 m. Alles staat recht op of loopt schuin omhoog, behalve de frontons van de paviljoens die 0,3 m uitkragen, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-panden 0505100000013404 (kerk) en 0505100000013971 (toren). Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`grote-kerk-dordrecht-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        naveRidgeNapM: NAVE.ridge,
        transeptRidgeNapM: TRANSEPT.ridge,
        dakruiterNapM: DAKRUITER.tip,
        towerPlatformNapM: TOWER.platform,
        clockPavilionsNapM: TOWER.pavilion.tip,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Grote_of_Onze-Lieve-Vrouwekerk_(Dordrecht)",
        "PDOK BAG panden 0505100000013404 en 0505100000013971 (contouren), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dwarsprofielen van schip, zijbeuken, koor en Mariakoor, lengteprofielen langs de zijbeuken, pieken van straalkapellen en pinakels, raster van de torenbekroning en maaiveld",
        "PDOK 3D Basisvoorziening gebouwen (LoD2.2) van beide panden, ter vergelijking",
        "Wikimedia Commons: RCE-foto's van de luchtbogen, het koor en de toren",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een gesloten 3D-model van AFAS Live in Amsterdam (de voormalige
// Heineken Music Hall aan de Johan Cruijff Boulevard): het trapeziumvormige
// complex met de hoge zaal (+23,6 m), het blok erachter (+19,7 m), het
// achterdek (+16,3 m), de lage voorstrook (+11 m), het installatieblok (+18 m)
// en het dakplatform (+19,55 m) van de oostvleugel, en de lage verbinding
// (+7,3 m) boven de smalle spleet tussen beide panden. De daken zijn blokken
// met een vaste hoogte, afgesneden op de BAG-contouren en op de maten uit het
// AHN-DSM (geen hoogteveld); daarop de installaties die in het DSM en op de
// recentste luchtfoto herkenbaar zijn: 20 dakramen op de zaal en het blok, de
// technieklokalen en luchtkanalen op de voorstrook, het achterdek en het
// installatieblok (twee ventilatorunits, een rij kanalen), de drie ronde
// lichtkoepels op het platform, de opstaande dakranden langs de noordoostgevel
// en de zuidgevels, de buitentrap en de stalen vakwerkgevel met de lage dakplaat
// in de noordhoek. Het Mapbox-model is niet gebruikt. Alle maten in het script
// zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-afas-live.mjs              # 1:1000 (standaard)
//   node scripts/generate-afas-live.mjs --scale 2000
//
// Assenstelsel: oorsprong op de zuidwesthoek van het complex (RD 124803,
// 480487,5) op het maaiveld (NAP -3,3 m), Z omhoog. +X loopt langs de zuidzijde
// naar het noordoosten (RD-richting (0,8788, 0,4772), 28,5 graden) en +Y
// loodrecht daarop naar het noordwesten, langs de westgevel.
//
// Bronnen: PDOK BAG-panden 0363100012123240 (zaal en achterdeel) en
// 0363100012100092 (oostvleugel); AHN DSM/DTM 0,25 m (PDOK WCS, uit 0,5 m
// herberekend): dakhoogtes, dakramen, kasten en kanalen, de dakranden en de
// open gevel in de noordhoek; PDOK luchtfoto 2026 (de kanalen en de
// luchtbehandeling op het achterdek zijn van 2023 en staan nog niet in het
// AHN; hun plek is voor de reliefverplaatsing van de foto gecorrigeerd, circa
// 1 m); Wikipedia. Weggelaten: de gevelreliefs, de leuningen en palen langs de
// dakrand, de dunne leidingen en de zonnepanelen op het platform.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "afas-live");
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
// Luchtkanaal of balk als lijn door punten [x, y] met breedte w, van z0 tot z1.
const duct = (pts, w, z0, z1) =>
  Manifold.union(
    pts.slice(1).map((q, i) => {
      const p = pts[i];
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      const d = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
      const h = w / 2;
      const a = [p[0] - d[0] * h, p[1] - d[1] * h];
      const b = [q[0] + d[0] * h, q[1] + d[1] * h];
      const n = [-d[1] * h, d[0] * h];
      return prism(
        [[a[0] + n[0], a[1] + n[1]], [b[0] + n[0], b[1] + n[1]], [b[0] - n[0], b[1] - n[1]], [a[0] - n[0], a[1] - n[1]]],
        z0,
        z1,
      );
    }),
  );
// Lichtkoepel: een lage cilinder met een versmalde kap.
const dome = ([cx, cy], r, z0, hCylinder, hCap) =>
  Manifold.union([
    cylinder([cx, cy], r, z0 - 0.05, z0 + hCylinder),
    Manifold.cylinder(hCap + 0.01, r, r * 0.7, 48).translate([cx, cy, z0 + hCylinder - 0.01]),
  ]);

const SLUG = "afas-live";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP -3,3 m) ----------
const GROUND_NAP = -3.3;
const ORIGIN = [124803, 480487.5];
const X_AXIS = [0.878817, 0.477159]; // RD-richting 28,5 graden, langs de zuidzijde
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// BAG-contouren (u, v): het westelijke pand met de zaal en het oostelijke pand.
const WEST_POLY = [[0, 0], [62.4, 0], [61.8, 86.3], [-0.5, 131.1]];
const EAST_POLY = [[62.4, 0], [116.1, 0.4], [132.5, 35.8], [61.8, 86.3]];
// De noordoostgevel langs de kade: v als functie van u (voor de beide panden samen).
const edgeV = (u) => 88.2 - 0.7143 * (u - 59.2);
// De spleet tussen de panden: u 59,2 tot 62,4 m; vanaf v 39 m ligt er een lage
// verbinding op +7,3 m (plaat van 1,5 m dik) tot de noordoostgevel.
const GAP = { u0: 59.2, u1: 62.4, linkFrom: 39, linkTop: 7.3, linkThick: 1.5 };
// Daken van het westelijke pand: achterdek +16,3 m, lage voorstrook (v < 19 m) +11 m,
// de hoge zaal (u 8,4 tot 58,8 m, v 19 tot 43,5 m) +23,6 m en het blok erachter
// (u 8 tot 59,2 m, v 43,5 tot 82,7 m) +19,7 m.
const WEST_ROOF = { back: 16.3, front: 11, frontEdge: 19 };
const HALL = { u: [8.4, 58.8], v: [19, 43.5], top: 23.6 };
const BLOCK = { u: [8, 59.2], v: [43.5, 82.7], top: 19.7 };
// Oostvleugel: het installatieblok (+18 m, 22 m breed, aan de westkant met sprongen
// om de trap en de lage strook) en het platform (+19,55 m) ten oosten van u 84,4 m.
const EAST_ROOF = { west: 18, east: 19.55, split: 84.4 };
const INSTALL_POLY = [[66, 0], [84.45, 0], [84.45, 70.2], [65.2, 70.2], [65.2, 33.5], [62.4, 33.5], [62.4, 12.5], [65.2, 12.5], [65.2, 8], [66, 8]];
// Maaiveld (AHN NAP -3,3 tot -2,9 m) langs de kade en op het plein.
const GROUND_SAMPLES = [[30, -12], [90, -10], [135, 10], [-15, 60]];

// Dakramen op de zaal en het blok (AHN: 0,3 tot 0,8 m hoog, 1,5 bij 2,5 m; hier 2 bij
// 2,6 m en 0,7 m hoog zodat ze printbaar blijven), middelpunten (u, v).
const SKYLIGHT = { halfU: 1, halfV: 1.3, h: 0.7 };
const HALL_LIGHTS = [[10.75, 31.25], [16.35, 31.35], [27.4, 31.6], [39.9, 31.6], [50.85, 31.75], [56.65, 31.75]];
const BLOCK_LIGHTS = [
  [10.8, 48.1], [16.4, 49.3], [27.3, 49.3], [39.8, 49.2], [50.6, 49.2], [56.2, 48.3],
  [10.5, 62.6], [27.1, 60.9], [39.6, 60.9], [56.4, 62.8],
  [16.1, 72.6], [27.1, 72.5], [39.6, 72.5], [50.6, 72.6],
];
// Technieklokaal en kasten op de voorstrook (AHN, boven het dak van +11 m):
// [u0, u1, v0, v1, hoogte].
const FRONT_BOXES = [
  [8.1, 19.2, 9, 16.6, 3.6],
  [32, 40.2, 15.6, 19.3, 2.2],
  [47.7, 50, 12, 17, 2.4],
  [53.5, 55.5, 12, 17, 2.4],
  [21.5, 27.5, 8.3, 10.2, 2.2],
];
// Kanaal in een C om de installatie op de voorstrook (AHN en luchtfoto).
const FRONT_DUCT = { pts: [[20.4, 17.5], [27, 17.5], [27, 7.4], [20.4, 7.4]], w: 1.3, h: 1 };
// Kasten en kanalen op het achterdek (+16,3 m): oude installatie (AHN) en de kanalen en
// de luchtbehandeling uit 2023 (luchtfoto, plek gecorrigeerd voor reliefverplaatsing).
const BACK_BOXES = [
  [21.6, 24.2, 85.6, 88.4, 1.3],
  [34.1, 35.9, 86.4, 88.2, 1.2],
  [11.9, 13.2, 107.4, 110.4, 1.1],
  [17, 22.3, 93.5, 97.3, 2.2],
  [23.8, 25.8, 86.7, 91.5, 1.8],
  [11, 14.2, 92.3, 93.8, 1.2],
];
const BACK_DUCTS = [
  { pts: [[5.9, 30.2], [5.9, 107.3], [3.3, 107.3]], w: 1.3, h: 1.1 },
  { pts: [[15.6, 118], [14.9, 114.6], [15.7, 111.4], [16.2, 108.8]], w: 1.5, h: 1 },
  { pts: [[9.5, 105], [9.5, 86.8]], w: 1.4, h: 1.2 },
  { pts: [[9.5, 104.4], [20.7, 104.4]], w: 2, h: 1.4 },
  { pts: [[9.5, 100], [18.7, 100]], w: 1.4, h: 1.2 },
  { pts: [[9.5, 86.8], [16.3, 86.8]], w: 1.9, h: 1.2 },
  { pts: [[5.9, 84.6], [27.6, 84.6], [27.6, 96.5], [35.1, 96.5], [35.1, 87]], w: 1.3, h: 1.2 },
  { pts: [[11, 95.5], [17.2, 95.5]], w: 2, h: 1.3 },
  { pts: [[22, 96.2], [27.6, 96.2]], w: 1.6, h: 1.2 },
];
// Kasten en kanalen op het installatieblok (+18 m, AHN op 0,25 m afgelezen):
// [u0, u1, v0, v1, hoogte]; de twee ventilatorunits zijn de hoogste (2,2 m).
const INSTALL_BOXES = [
  [72.5, 75.1, 13.8, 17.5, 2.2],
  [78.4, 80.8, 13.8, 17.5, 2.2],
  [62.9, 64.2, 13.9, 23.4, 1.3],
  [63, 77.8, 22.1, 23.4, 1.3],
  [65.4, 66.5, 16.6, 22.1, 1.1],
  [68.7, 69.8, 16.6, 22.1, 1],
  [83.4, 84.45, 13.5, 23, 1.2],
  [64.7, 74.9, 8.2, 10.5, 1.35],
  [70.4, 72.4, 7, 8.3, 1.2],
  [65.6, 66.6, 10.4, 12, 1.2],
  [69.3, 77.7, 3.4, 5, 1.25],
  [76.9, 78.6, 3.4, 8.9, 1.25],
  [77.3, 84.45, 7.1, 8.3, 1.2],
  [63, 82, 24.6, 26.2, 1.35],
  [81.6, 83, 25.5, 33.6, 1.3],
  [83.4, 84.45, 23, 33.6, 1.2],
  [65.2, 82, 29.3, 30.9, 1.4],
  [65.2, 66.5, 25.5, 30.9, 1.2],
  [77.8, 79.1, 25.7, 29.4, 1.2],
  [69, 84.45, 37, 38.6, 1.5],
  [73.8, 77.9, 35.6, 40, 1.8],
  [77.7, 81.8, 36.4, 38.6, 1.7],
  [66.3, 74.1, 43.3, 44.7, 2.4],
  [65.6, 66.8, 41, 44.7, 2],
  [74.1, 76.3, 43.5, 44.6, 1.7],
  [77.7, 84.45, 45.4, 46.7, 1.3],
  [77.7, 78.9, 43.5, 45.5, 1.3],
  [77.7, 82, 43.4, 44.4, 1.3],
  [65.2, 66.8, 49.3, 56.2, 1.6],
  [67.6, 72.8, 49, 50.5, 2.4],
  [68.4, 84.45, 51.8, 53.2, 1.6],
  [76.6, 80, 53.4, 57, 1.6],
  [79.8, 84.45, 55.7, 56.9, 1.2],
  [65.6, 74.9, 56, 57.2, 1.9],
  [65.2, 75.3, 58.2, 59.5, 2],
  [76.2, 80.5, 58.9, 61.6, 1.3],
  [79.7, 84.45, 58, 59, 1.2],
  [67.9, 84.45, 63.2, 64.5, 1.25],
  [72.2, 73.6, 61.9, 63.2, 1.1],
];
// Platform (+19,55 m): drie ronde lichtkoepels (middelpunt, straal, hoogte cilinder en
// kap; AHN: 0,6 tot 0,8 m boven het dak) en een luik (3,5 bij 2,5 m, 1,4 m hoog).
const DOMES = [
  [[95.1, 52.6], 3.5, 0.6, 0.45],
  [[92.1, 43.1], 2.5, 0.55, 0.4],
  [[90.2, 35], 1.7, 0.5, 0.35],
];
const HATCH = { u: [105.4, 108.9], v: [18.9, 21.4], h: 1.4 };
// Dakranden: de noordoostrand van het achterdek (AHN: 1,7 m boven het dek, circa 1,2 m
// breed) en de randen langs de zuidgevel van voorstrook, installatieblok en platform.
const RIM = { backH: 1.6, backW: 1.2, frontH: 0.8, installH: 1.4, platformH: 0.5, southW: 1 };
// Buitentrap tegen de westgevel van het installatieblok (AHN: van +2 m bij u 62,4 m
// tot +9 m bij u 65,6 m, v 0,8 tot 7,8 m).
const STAIR = { u: [62.4, 66.05], v: [0.8, 7.8], low: 2.2, high: 9.5 };
// Trapsgewijze strook (AHN: +2 m bij u 62,4 m, +9,4 m vanaf u 64 m) langs de westwand van
// het installatieblok, de dakplaat (+10,7 m, met een opening naar het maaiveld) in de
// noordhoek en daarlangs de noordoostgevel een loopbrug van 3,5 m breed op +10 tot +11,5 m.
const STRIP = { v: [43.5, 68.5], low: 3, step: 9.4, stepU: 64 };
const PLATE = { u: [62.4, 69.8], v0: 70.2, top: 10.7, thick: 1.5, hole: [[64.8, 72], [68.5, 72], [68.5, 78.5], [64.8, 78.5]] };
const PLATE_POSTS = [[63.5, 84], [69, 78.6]];
const CATWALK = { s: [12, 29.7], t: [1, 4.5], top: 11.5, thick: 1.5 };
// Stalen vakwerkgevel langs de noordoostgevel: kolommen op u 69,8, 77,3 en 83,4 m,
// een ligger op +16,7 tot +17,9 m (door de dakrand van het achterdek heen) en drie
// schoren van 1,1 m dik.
const TRUSS = { colU: [69.8, 77.3, 83.4], colW: 1.2, beamZ: [16.7, 17.9], beamW: 1.2, brace: 1.1, inset: 0.8 };

// ---------- gebouwen ----------
const within = (poly, u0, u1, v0, v1, z0, z1) => Manifold.intersection(prism(poly, z0, z1), box(u0, u1, v0, v1, z0 - 1, z1 + 1));
const FAR = 400;
const west = Manifold.union([
  within(WEST_POLY, -FAR, GAP.u0, WEST_ROOF.frontEdge, FAR, BASE, WEST_ROOF.back),
  // De voorstrook loopt 0,4 m onder het achterdek door, zodat ze een geheel vormen.
  within(WEST_POLY, -FAR, GAP.u0, -FAR, WEST_ROOF.frontEdge + 0.4, BASE, WEST_ROOF.front),
]);
const hall = box(HALL.u[0], HALL.u[1], HALL.v[0], HALL.v[1], BASE, HALL.top);
const block = box(BLOCK.u[0], BLOCK.u[1], BLOCK.v[0], BLOCK.v[1], BASE, BLOCK.top);
const east = Manifold.union([
  prism(INSTALL_POLY, BASE, EAST_ROOF.west),
  within(EAST_POLY, EAST_ROOF.split, FAR, -FAR, FAR, BASE, EAST_ROOF.east),
]);
// De lage verbinding boven de spleet: een plaat die aan de zaal, het blok en het achterdek
// hangt en tot de noordoostgevel loopt (de export vult de ruimte eronder op).
const edgePoly = (u0, u1, v0) => [[u0, v0], [u1, v0], [u1, edgeV(u1)], [u0, edgeV(u0)]];
// Punt op afstand s langs de noordoostgevel (vanaf u 59,2 m) en t naar binnen.
const EDGE_D = [0.8139, -0.5814];
const EDGE_N = [-0.5814, -0.8139];
const edgePt = (s, t) => [GAP.u0 + s * EDGE_D[0] + t * EDGE_N[0], edgeV(GAP.u0) + s * EDGE_D[1] + t * EDGE_N[1]];
const link = prism(edgePoly(GAP.u0 - 0.45, GAP.u1 + 0.1, GAP.linkFrom), GAP.linkTop - GAP.linkThick, GAP.linkTop);
const strip = profileY(
  [[62.4, BASE], [65.3, BASE], [65.3, STRIP.step], [STRIP.stepU, STRIP.step], [62.4, STRIP.low]],
  STRIP.v[0],
  STRIP.v[1],
);
// Dakplaat in de noordhoek tegen de noordwand van het installatieblok, met twee palen, en de
// loopbrug langs de noordoostgevel.
const plate = Manifold.union([
  Manifold.difference(
    prism(edgePoly(PLATE.u[0], PLATE.u[1], PLATE.v0), PLATE.top - PLATE.thick, PLATE.top),
    prism(PLATE.hole, PLATE.top - PLATE.thick - 1, PLATE.top + 1),
  ),
  ...PLATE_POSTS.map(([u, v]) => box(u - 0.6, u + 0.6, v - 0.6, v + 0.6, BASE, PLATE.top - PLATE.thick + 0.05)),
  prism(
    [edgePt(CATWALK.s[0], CATWALK.t[0]), edgePt(CATWALK.s[1], CATWALK.t[0]), edgePt(CATWALK.s[1], CATWALK.t[1]), edgePt(CATWALK.s[0], CATWALK.t[1])],
    CATWALK.top - CATWALK.thick,
    CATWALK.top,
  ),
]);
// De buitentrap als helling tegen de westgevel van het installatieblok.
const stair = profileY(
  [[STAIR.u[0], BASE], [STAIR.u[1], BASE], [STAIR.u[1], STAIR.high], [STAIR.u[0], STAIR.low]],
  STAIR.v[0],
  STAIR.v[1],
);
// Vakwerkgevel in het vlak van de noordoostgevel: lokaal stelsel met s langs de gevel (vanaf
// u 59,2 m) en z omhoog, daarna gedraaid en verplaatst naar de gevellijn (0,8 m naar binnen).
const edgeAngle = (Math.atan2(-0.7143, 1) * 180) / Math.PI;
const sOf = (u) => (u - GAP.u0) / Math.cos((edgeAngle * Math.PI) / 180);
const truss = (() => {
  const w = TRUSS.brace;
  const col = (s) =>
    profileY(
      [[s - TRUSS.colW / 2, BASE], [s + TRUSS.colW / 2, BASE], [s + TRUSS.colW / 2, TRUSS.beamZ[1] - 0.3], [s - TRUSS.colW / 2, TRUSS.beamZ[1] - 0.3]],
      -TRUSS.colW / 2,
      TRUSS.colW / 2,
    );
  const brace = (s0, z0, s1, z1) =>
    profileY([[s0 - w / 2, z0], [s0 + w / 2, z0], [s1 + w / 2, z1], [s1 - w / 2, z1]], -w / 2, w / 2);
  const cols = TRUSS.colU.map(sOf);
  const sEnd = sOf(EAST_ROOF.split + 0.05);
  const beam = profileY(
    [[-1, TRUSS.beamZ[0]], [sEnd, TRUSS.beamZ[0]], [sEnd, TRUSS.beamZ[1]], [-1, TRUSS.beamZ[1]]],
    -TRUSS.beamW / 2,
    TRUSS.beamW / 2,
  );
  const top = TRUSS.beamZ[1] - 0.6;
  const members = [
    ...cols.map(col),
    beam,
    // De eerste schoor staat op de verbinding (bovenkant +7,3 m), de volgende twee op het maaiveld.
    brace(sOf(61.8), GAP.linkTop - 0.05, cols[0], top),
    brace(cols[0], BASE, cols[1], top),
    brace(cols[1], BASE, cols[2], top),
  ];
  return Manifold.union(members)
    .rotate([0, 0, edgeAngle])
    .translate([GAP.u0, edgeV(GAP.u0) - TRUSS.inset, 0]);
})();

// Dakramen, kasten, kanalen, koepels en dakranden op de daken.
const roofLights = (list, top) =>
  list.map(([u, v]) => box(u - SKYLIGHT.halfU, u + SKYLIGHT.halfU, v - SKYLIGHT.halfV, v + SKYLIGHT.halfV, top - 0.05, top + SKYLIGHT.h));
const onDeck = (list, deck) =>
  list.map(([u0, u1, v0, v1, h]) => box(u0, u1, v0, v1, deck - 0.05, deck + Math.max(h, 1)));
const ductOn = ({ pts, w, h }, deck) => duct(pts, w, deck - 0.05, deck + Math.max(h, 1));
// Noordoostrand van het achterdek langs de BAG-contour, 0,7 m naar binnen en tot u 59,4 m.
const rimStart = [-0.5 - 0.41, 131.1 - 0.57];
const rimEnd = [61.8 - 0.41, 86.3 - 0.57];
const backRim = Manifold.intersection(
  duct([rimStart, rimEnd], RIM.backW, WEST_ROOF.back - 0.05, WEST_ROOF.back + RIM.backH),
  Manifold.intersection(prism(WEST_POLY, BASE, 40), box(-FAR, GAP.u0 + 0.2, -FAR, FAR, BASE, 40)),
);
const detail = Manifold.union([
  ...roofLights(HALL_LIGHTS, HALL.top),
  ...roofLights(BLOCK_LIGHTS, BLOCK.top),
  ...onDeck(FRONT_BOXES, WEST_ROOF.front),
  ductOn(FRONT_DUCT, WEST_ROOF.front),
  ...onDeck(BACK_BOXES, WEST_ROOF.back),
  ...BACK_DUCTS.map((d) => ductOn(d, WEST_ROOF.back)),
  cylinder([18.7, 101.7], 0.8, WEST_ROOF.back - 0.05, WEST_ROOF.back + 1.1),
  backRim,
  within(WEST_POLY, 0, GAP.u0, 0, RIM.southW, WEST_ROOF.front - 0.05, WEST_ROOF.front + RIM.frontH),
  Manifold.intersection(
    Manifold.union([
      ...onDeck(INSTALL_BOXES, EAST_ROOF.west),
      box(66, EAST_ROOF.split + 0.05, 0, RIM.southW, EAST_ROOF.west - 0.05, EAST_ROOF.west + RIM.installH),
    ]),
    prism(INSTALL_POLY, BASE, 40),
  ),
  ...DOMES.map(([c, r, hc, hk]) => dome(c, r, EAST_ROOF.east, hc, hk)),
  box(HATCH.u[0], HATCH.u[1], HATCH.v[0], HATCH.v[1], EAST_ROOF.east - 0.05, EAST_ROOF.east + HATCH.h),
  within(EAST_POLY, EAST_ROOF.split, 116, 0, 0.4 + RIM.southW, EAST_ROOF.east - 0.05, EAST_ROOF.east + RIM.platformH),
]);
const complex = Manifold.union([west, hall, block, east, link, strip, plate, stair, truss, detail]);
const nodes = [["building:complex", complex]];
const all = complex;

// De platte onderkanten van de verbinding, de lage strook, de dakplaat en de vakwerkgevel in
// de noordhoek (u 58,5 tot 86 m, v 37 tot 90 m) zijn zo bedoeld: de export vult ze op.
const OVERHANG_OK = (z, p) => {
  const cu = (p[0][0] + p[1][0] + p[2][0]) / 3;
  const cv = (p[0][1] + p[1][1] + p[2][1]) / 3;
  return z > 1 && cu > 58.5 && cu < 86 && cv > 37 && cv < 90;
};

const META = {
  name: "AFAS Live",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0363100012123240", "0363100012100092"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (124803,00, 480487,50), de zuidwesthoek van het complex, op het maaiveld (NAP -3,3 m), +X langs de zuidzijde naar het noordoosten (28,5 graden) en +Y langs de westgevel naar het noordwesten. Een node building:complex: het westelijke pand (achterdek +16,3 m met kanalen, luchtbehandeling en een opstaande rand langs de kade, lage voorstrook +11 m met technieklokaal en kanalen, de hoge zaal +23,6 m en het blok erachter +19,7 m, samen met 20 dakramen), de oostvleugel (installatieblok +18 m met ventilatorunits en een net van kanalen, platform +19,55 m met drie ronde lichtkoepels), de lage verbinding (+7,3 m) als plaat boven de open spleet van 3,2 m tussen beide panden, de buitentrap en in de noordhoek de stalen vakwerkgevel met een loopbrug. Onderkant op 0,5 m onder het maaiveld; de verbinding, de loopbrug en de dakplaat in de noordhoek hangen boven het maaiveld (de export vult de ruimte eronder op). Vervangt de PDOK-reconstructie van de twee BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    hallRoofM: HALL.top,
    backRoofM: [WEST_ROOF.back, BLOCK.top],
    eastRoofM: [EAST_ROOF.west, EAST_ROOF.east],
    gapWidthM: +(GAP.u1 - GAP.u0).toFixed(1),
    linkTopM: GAP.linkTop,
    trussBeamTopM: TRUSS.beamZ[1],
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/AFAS_Live",
    "PDOK BAG panden 0363100012123240 en 0363100012100092, EPSG:28992",
    "PDOK AHN DSM/DTM 0,25 m via WCS (uit 0,5 m herberekend): dakhoogtes, dakramen, kasten, kanalen, dakranden en de open gevel in de noordhoek",
    "PDOK luchtfoto 2026 (Actueel_orthoHR) en 2021 tot 2025_orthoHR: de kanalen en luchtbehandeling op het achterdek zijn van 2023",
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

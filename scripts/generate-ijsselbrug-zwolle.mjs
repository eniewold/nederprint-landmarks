// Genereert een vereenvoudigd, gesloten 3D-model van de IJsselbrug bij Zwolle:
// de verkeersbrug uit 1930 (na vernielingen in 1940 en 1945 in 1947 hersteld)
// over de IJssel tussen Zwolle en Hattem (Zuiderzeestraatweg), met de stalen
// boogbrug van 138 m over de rivier (twee rechtopstaande vakwerkbogen 8,6 m
// uit elkaar met hangers naar het dek, een windverband tussen de
// bovenranden, eindstijlen op het dek en schoren onder het dek naar de
// oplegging op de rivierpijlers) en de betonnen aanbruggen met bogen onder het
// dek: zes aan de kant van Hattem en drie aan de kant van Zwolle. De Hanzeboog
// (spoorbrug, 800 m stroomopwaarts) en de Nieuwe IJsselbrug (A28, 300 m
// stroomafwaarts) hebben een eigen model en zitten er niet in. Alle maten in
// het script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y
// omhoog, de materiaalklasse in de nodenaam: de constructie als building, de
// bovenste 0,5 m van het dek als road:rijbaan en road:fietspad met de
// BGT-attributen) als catalogusbron voor de export en de kaart, plus een
// binaire STL in millimeters op 1:<schaal> met de brug als geheel en een
// printvoet onder het dek.
//
//   node scripts/generate-ijsselbrug-zwolle.mjs              # STL op 1:1250 (standaard)
//   node scripts/generate-ijsselbrug-zwolle.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het dek midden tussen de twee
// rivierpijlers (RD 200533,94, 501238,24), op de waterspiegel van de IJssel
// zoals het PDOK-terrein die legt (NAP +1,3 m), Z omhoog. +X loopt langs de
// brug naar het oosten (Zwolle, RD-richting 28,87 graden vanaf het oosten),
// +Y stroomafwaarts naar het noordnoordwesten. De rivierpijlers staan op
// x = ±69,1, het westelijke landhoofd (Hattem) op x = -262 tot -253,8 en het
// oostelijke (Zwolle) op x = 159,2 tot 175,5.
//
// Bronnen: BGT overbruggingsdeel (dek 15 m breed over de aanbruggen en 17,1 m
// onder de boog, de oostelijke rivierpijler van 6,1 × 22,4 m, twee
// aanbrugpijlers van 3 × 15 m aan de oostkant, de landhoofden); AHN DSM 0,5 m
// (PDOK WCS) voor het lengteprofiel van het wegdek (NAP +8,4 aan de westkant,
// +12,05 m onder de boog, +9,6 m aan de oostkant), de bovenrand van de bogen
// (top NAP +35,7 m) en hun ligging (4,3 m naast de as, rechtop); PDOK-terrein
// voor de waterspiegel (44,10 m ellipsoïdisch); Wikipedia (lengte 412 m,
// breedte 17 m, langste overspanning 138 m, 1930, herbouw 1943 en 1947) en
// Wikimedia Commons-foto's (Zwolle IJsselbrug.jpg, Zwolle IJsselbrug 02.JPG,
// 20151217 IJsselbrug Zwolle.jpg, 20150819 IJsselbrug Zwolle.jpg, The old
// roadbridge across the IJssel at Zwolle - panoramio.jpg, Old steel roadbridge
// over the IJssel at Zwolle - panoramio.jpg, 2007-04-23 10.40 Zwolle, brug
// over de IJssel op de weg naar Hattem.JPG) voor het vakwerk van de bogen, de
// hangers, het windverband, de schoren onder het dek en de betonnen bogen.
// Geschat zijn de binnenrand van de bogen (top 7,0 m onder de bovenkant, op het
// wegdek 55 m uit het midden), de staafmaten (randen 1,4 m, stijlen en
// hangers 1,0 m, plaat 1,2 m), het aantal velden (22 van 6,27 m), de
// constructiehoogtes van het dek (2,0 m onder de boog, 1,8 m boven de
// betonnen bogen), de aanzet van de betonnen bogen (NAP +3,5 m), de plaats van
// de westelijke aanbrugpijlers (zes gelijke velden; niet in de BGT) en de
// westelijke rivierpijler (gespiegeld).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1250"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "ijsselbrug-zwolle");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const rad = (deg) => (deg * Math.PI) / 180;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const polyArea = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return Math.abs(area) / 2;
};
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(points)]), y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Band tussen twee functies van x (onder en boven), uitgetrokken langs Y.
function bandY(x0, x1, bottom, top, y0, y1, step = 1) {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    pts.push([x, bottom(x)]);
  }
  for (let i = n; i >= 0; i--) {
    const x = x0 + ((x1 - x0) * i) / n;
    pts.push([x, top(x)]);
  }
  return profileY(pts, y0, y1);
}
// Stadion in plattegrond (rechthoek met halve cirkels aan de y-kanten),
// uitgetrokken van z0 tot z1.
function stadium(xc, halfX, y0, y1, z0, z1) {
  const r = halfX;
  return Manifold.hull([
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([xc, y0 + r, z0]),
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([xc, y1 - r, z0]),
  ]);
}
// Staaf tussen twee punten in een plattegrondrichting: bovenkant vlak, onderkant
// als V van 50 graden, zodat hij zonder steun print.
function vBar(p0, p1, width) {
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const h = width / 2;
  const vee = h * Math.tan(rad(50));
  const section = (p) => [
    [p[0] + nx * h, p[1] + ny * h, p[2]],
    [p[0] - nx * h, p[1] - ny * h, p[2]],
    [p[0] + nx * h, p[1] + ny * h, p[2] - 0.4],
    [p[0] - nx * h, p[1] - ny * h, p[2] - 0.4],
    [p[0], p[1], p[2] - 0.4 - vee],
  ];
  const pts = [...section(p0), ...section(p1)];
  return Manifold.hull(pts.map((q) => Manifold.cube([0.001, 0.001, 0.001], true).translate(q)));
}
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in gezien vanaf +X, steeds evenveel punten).
function loftX(stations, label) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { x, section } of stations) for (const [y, z] of section) verts.push(x, y, z);
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < stations.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = stations.length - 1;
  for (let j = 1; j + 1 < n; j++) {
    tris.push(id(0, 0), id(0, j + 1), id(0, j));
    tris.push(id(last, 0), id(last, j), id(last, j + 1));
  }
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`${label}: ${solid.status()}`);
  if (solid.volume() <= 0) throw new Error(`${label}: binnenstebuiten`);
  return solid;
}
function inset(poly, d) {
  const polys = new CrossSection([ccw(poly)]).offset(-d, "Miter").toPolygons();
  if (polys.length !== 1 || polys[0].length < 3) return null;
  return polys[0].map(([x, z]) => [x, z]);
}

// ---------- hoofdmaten ----------
const WATER_NAP = 1.3; // waterspiegel van de IJssel in het PDOK-terrein (44,10 m ellipsoïdisch)
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten: het water
// van de IJssel naast de boog.
const GROUND_HEIGHT = 44.1;

// Wegdek in NAP-meters om de 10 m vanaf x = -271,95 (10 m vóór het BGT-dek):
// 30e percentiel van het AHN-DSM over 7 m rond de as, mediaan over 10 m en
// gladgestreken (verkeer, lantaarns en het windverband vallen zo weg).
const ROAD_X0 = -271.95;
const ROAD_NAP = [
  8.4, 8.5, 8.66, 8.82, 8.97, 9.11, 9.28, 9.42, 9.58, 9.73, 9.88, 10.04, 10.17, 10.32, 10.48, 10.62, 10.78,
  10.94, 11.07, 11.23, 11.41, 11.58, 11.73, 11.9, 11.99, 12.01, 12.03, 12.07, 12.05, 12.02, 11.99, 11.94,
  11.78, 11.62, 11.48, 11.26, 11.1, 10.96, 10.8, 10.63, 10.5, 10.35, 10.21, 10.07, 9.89, 9.75, 9.61,
];
function roadZ(x) {
  const f = clamp((x - ROAD_X0) / 10, 0, ROAD_NAP.length - 1);
  const i = Math.min(Math.floor(f), ROAD_NAP.length - 2);
  return Z(lerp(ROAD_NAP[i], ROAD_NAP[i + 1], f - i));
}

// Steunpunten (BGT): rivierpijlers op ±69,1 (138,1 m hart op hart, de
// oostelijke 6,1 × 22,4 m met ronde koppen, de westelijke gespiegeld);
// aanbrugpijlers aan de oostkant op 102,7 en 132,9 (3 × 15 m); aan de westkant
// vijf pijlers op gelijke afstand tussen landhoofd en rivierpijler (zes
// bogen, foto's).
const MAIN_PIER = { x: 69.1, halfX: 3.05, y0: -11.4, y1: 11.2, topNap: 4.5 };
const WEST_FACE = 8.2 - 261.95; // voorzijde van het westelijke landhoofd
const WEST_END = -261.95;
const EAST_FACE = 421.1 - 261.95; // voorzijde van het oostelijke landhoofd
const EAST_END = 437.4 - 261.95;
const APPROACH_PIER = { halfX: 1.5, y0: -7.5, y1: 7.5, topNap: 3.5 };
const WEST_PIERS = Array.from({ length: 5 }, (_, k) => WEST_FACE + ((-MAIN_PIER.x - MAIN_PIER.halfX - WEST_FACE) * (k + 1)) / 6);
const EAST_PIERS = [102.65, 132.85];

// Dek (BGT): over de aanbruggen 15 m breed, onder de boog 17,1 m (de
// fietspaden liggen buiten de bogen).
const APPROACH_HALF = 7.5;
const MAIN_HALF = 8.55;
const MAIN_DEPTH = 2.0; // stalen rijvloer met dwarsdragers
const SLAB = 1.8; // betonnen dek boven de kruin van de bogen
const BARREL_HALF = 7.2; // de boogvlakken 0,3 m terug, de boogring en het dek erboven niet
const RING = 1.0;
const SPRING_NAP = 3.5; // aanzet van de betonnen bogen

// ---------- dek en aanbruggen ----------
// Overspanningen van de betonnen bogen: van pijlervlak tot pijlervlak.
const faces = [
  WEST_FACE,
  ...WEST_PIERS.flatMap((x) => [x - APPROACH_PIER.halfX, x + APPROACH_PIER.halfX]),
  -MAIN_PIER.x - MAIN_PIER.halfX,
];
const eastFaces = [
  MAIN_PIER.x + MAIN_PIER.halfX,
  ...EAST_PIERS.flatMap((x) => [x - APPROACH_PIER.halfX, x + APPROACH_PIER.halfX]),
  EAST_FACE,
];
const spans = [];
for (const list of [faces, eastFaces]) {
  for (let i = 0; i + 1 < list.length; i += 2) spans.push({ a: list[i], b: list[i + 1] });
}
for (const s of spans) {
  s.mid = (s.a + s.b) / 2;
  s.half = (s.b - s.a) / 2;
}
const spring = Z(SPRING_NAP);
const soffit = (s, x) => {
  const xi = clamp((x - s.mid) / s.half, -1, 1);
  const crown = roadZ(s.mid) - SLAB;
  return spring + (crown - spring) * Math.sqrt(Math.max(0, 1 - xi * xi));
};
const spanAt = (x) => spans.find(({ a, b }) => x >= a - 1e-6 && x <= b + 1e-6);
const parts = [];
// Betonnen dek over de aanbruggen, tot op de pijlers en landhoofden.
parts.push(bandY(WEST_FACE, -MAIN_PIER.x, (x) => roadZ(x) - SLAB, roadZ, -APPROACH_HALF, APPROACH_HALF, 2));
parts.push(bandY(MAIN_PIER.x, EAST_FACE, (x) => roadZ(x) - SLAB, roadZ, -APPROACH_HALF, APPROACH_HALF, 2));
// Bogen: dichte boogtrommel tussen soffiet en dek, met de boogring aan beide
// kanten 0,3 m voor het boogvlak.
for (const s of spans) {
  parts.push(bandY(s.a, s.b, (x) => soffit(s, x), (x) => roadZ(x) - SLAB + 0.01, -BARREL_HALF, BARREL_HALF, 0.5));
  for (const side of [-1, 1]) {
    const y0 = side > 0 ? BARREL_HALF - 0.01 : -APPROACH_HALF;
    const y1 = side > 0 ? APPROACH_HALF : -BARREL_HALF + 0.01;
    parts.push(
      bandY(s.a, s.b, (x) => soffit(s, x), (x) => Math.min(soffit(s, x) + RING, roadZ(x) - SLAB + 0.01), y0, y1, 0.5),
    );
  }
}
// Pijlers: voeten met ronde koppen tot de aanzet van de bogen; daarboven
// dicht tot het dek (waar twee bogen samenkomen).
const piers = [
  ...[...WEST_PIERS, ...EAST_PIERS].map((x) =>
    union([
      stadium(x, APPROACH_PIER.halfX, APPROACH_PIER.y0, APPROACH_PIER.y1, BASE, Z(APPROACH_PIER.topNap)),
      bandY(x - APPROACH_PIER.halfX - 0.02, x + APPROACH_PIER.halfX + 0.02, () => Z(APPROACH_PIER.topNap) - 0.01, (xx) => roadZ(xx) - SLAB + 0.01, -BARREL_HALF, BARREL_HALF, 1),
    ]),
  ),
  ...[-1, 1].map((side) => stadium(side * MAIN_PIER.x, MAIN_PIER.halfX, MAIN_PIER.y0, MAIN_PIER.y1, BASE, Z(MAIN_PIER.topNap))),
];
// Op de rivierpijler: de aanzet van de eerste betonnen boog, dicht tot het dek
// aan de landzijde van de pijler.
for (const side of [-1, 1]) {
  const x0 = side < 0 ? -MAIN_PIER.x - MAIN_PIER.halfX - 0.02 : MAIN_PIER.x;
  const x1 = side < 0 ? -MAIN_PIER.x : MAIN_PIER.x + MAIN_PIER.halfX + 0.02;
  piers.push(bandY(x0, x1, () => Z(MAIN_PIER.topNap) - 0.01, (x) => roadZ(x) - SLAB + 0.01, -BARREL_HALF, BARREL_HALF, 1));
}
parts.push(...piers);
// Landhoofden: blokken tot het wegdek.
parts.push(bandY(WEST_END, WEST_FACE + 0.01, () => BASE, (x) => roadZ(x) - 0.01, -APPROACH_HALF, APPROACH_HALF, 2));
parts.push(bandY(EAST_FACE - 0.01, EAST_END, () => BASE, (x) => roadZ(x) - 0.01, -APPROACH_HALF, APPROACH_HALF, 2));
// Stalen rijvloer onder de boog, van rivierpijler tot rivierpijler.
parts.push(bandY(-MAIN_PIER.x - 0.1, MAIN_PIER.x + 0.1, (x) => roadZ(x) - MAIN_DEPTH, roadZ, -MAIN_HALF, MAIN_HALF, 1));

// ---------- stalen boog ----------
// Twee rechtopstaande vakwerkbogen 4,3 m naast de as (AHN). Bovenkant een
// parabool met de top op NAP +35,7 m (AHN) die bij de eindstijlen (x = ±69,6)
// op NAP +18,7 m uitkomt; de binnenrand (onderkant van de onderrand) heeft de
// top 7,0 m lager en kruist het wegdek 55 m uit het midden (foto's), en loopt
// onder het dek door naar de oplegging op de rivierpijler. 22 velden van
// 6,27 m (foto's): op elke knoop een stijl in de boog en een hanger naar het
// dek. Op 1:1000 is elke boog een plaat van 1,2 m: tussen dek en binnenrand
// doorgaande openingen met een spitse top van 55 graden (de hangers als
// stijlen van 1,0 m), in het vakwerk doorgaande driehoeken onder de
// diagonalen met een flank van minstens 53 graden en blinde nissen van 0,35 m
// voor de rest.
const ARCH = { crown: 35.7, k: 0.00357, depth: 7.0, landX: 55, half: 69.6, post: 1.2, chord: 1.4, ribY: 4.3, plate: 1.2, panels: 22, hanger: 1.0, bar: 0.5, flank: 53, pointed: 55, niche: 0.35 };
const upperTop = (x) => Z(ARCH.crown) - ARCH.k * x * x;
const LOW_CROWN = Z(ARCH.crown - ARCH.depth);
const LOW_K = (LOW_CROWN - roadZ(ARCH.landX)) / ARCH.landX ** 2;
const lowBot = (x) => LOW_CROWN - LOW_K * x * x;
const nodeX = Array.from({ length: ARCH.panels + 1 }, (_, k) => -69 + (138 * k) / ARCH.panels);
const ribXs = Array.from({ length: Math.round((2 * ARCH.half) / 0.5) + 1 }, (_, i) => -ARCH.half + i * 0.5);
const ribOutline = [...ribXs.map((x) => [x, roadZ(x) - 1.0]), ...[...ribXs].reverse().map((x) => [x, upperTop(x)])];
const throughHoles = [];
const nicheHoles = [];
const flankAngles = [];
// Openingen tussen dek en binnenrand (hangers).
for (let k = 0; k < ARCH.panels; k++) {
  const a = nodeX[k] + ARCH.hanger / 2;
  const b = nodeX[k + 1] - ARCH.hanger / 2;
  let shoulder = Infinity;
  for (let i = 0; i <= 100; i++) {
    const x = a + ((b - a) * i) / 100;
    shoulder = Math.min(shoulder, lowBot(x) - 0.1 - Math.tan(rad(ARCH.pointed)) * Math.min(x - a, b - x));
  }
  const floor = Math.min(roadZ(a), roadZ(b)) + 0.6;
  if (shoulder < floor + 1.0) continue;
  const apex = shoulder + (Math.tan(rad(ARCH.pointed)) * (b - a)) / 2;
  throughHoles.push([[a, floor], [b, floor], [b, shoulder], [(a + b) / 2, apex], [a, shoulder]]);
  flankAngles.push(ARCH.pointed);
}
// Vakwerk tussen onderrand en bovenrand: stijlen op de knopen, diagonalen van
// de bovenknoop aan de buitenkant naar de onderknoop aan de binnenkant.
const U = (x) => upperTop(x) - ARCH.chord + ARCH.bar;
const L = (x) => Math.max(lowBot(x) + ARCH.chord - ARCH.bar, roadZ(x) + 0.6 + ARCH.bar);
for (let k = 0; k < ARCH.panels; k++) {
  const left = nodeX[k] < 0 || nodeX[k + 1] <= 0;
  const xo = left ? nodeX[k] : nodeX[k + 1]; // buitenkant
  const xi = left ? nodeX[k + 1] : nodeX[k]; // binnenkant
  // Onder de diagonaal: top op de buitenste stijl.
  const below = inset([[xo, L(xo)], [xi, L(xi)], [xo, U(xo)]], ARCH.bar);
  if (below && polyArea(below) > 1.5) {
    const apex = below.reduce((p, q) => (q[1] > p[1] ? q : p));
    const dir = Math.sign(xi - xo);
    const drop = apex[1] - Math.min(...below.map(([, z]) => z)) + 1;
    const run = drop / Math.tan(rad(ARCH.flank));
    const wedge = [apex, [apex[0] + dir * run, apex[1] - drop], [apex[0] - dir * 0.01, apex[1] - drop], [apex[0] - dir * 0.01, apex[1] + 0.01]];
    const hole = CrossSection.intersection(new CrossSection([ccw(below)]), new CrossSection([ccw(wedge)])).toPolygons();
    if (hole.length === 1 && polyArea(hole[0]) > 1.0) {
      throughHoles.push(hole[0]);
      const ap = hole[0].reduce((p, q) => (q[1] > p[1] ? q : p));
      // Helling van de schuine flank vanaf de top.
      const far = hole[0].reduce((p, q) => (Math.abs(q[0] - ap[0]) > Math.abs(p[0] - ap[0]) ? q : p));
      flankAngles.push((Math.atan2(ap[1] - far[1], Math.abs(far[0] - ap[0])) * 180) / Math.PI);
      const rest = new CrossSection([ccw(below)]).subtract(new CrossSection([ccw(wedge)])).toPolygons();
      for (const r of rest) if (polyArea(r) > 1.0) nicheHoles.push(r);
    } else nicheHoles.push(below);
  }
  // Boven de diagonaal: plafond is de bovenrand, dus een blinde nis.
  const above = inset([[xo, U(xo)], [xi, U(xi)], [xi, L(xi)]], ARCH.bar);
  if (above && polyArea(above) > 1.0) nicheHoles.push(above);
}
// Eindstijl: de plaat stopt op x = ±69,6 (stijl van 1,2 m breed).
const ribs = [-1, 1].map((side) => {
  const t = ARCH.plate / 2;
  const yc = side * ARCH.ribY;
  const plate = profileY(ribOutline, yc - t, yc + t);
  const outer = side > 0 ? [yc + t - ARCH.niche, yc + t + 0.5] : [yc - t - 0.5, yc - t + ARCH.niche];
  const cuts = [
    ...throughHoles.map((h) => profileY(h, yc - t - 0.5, yc + t + 0.5)),
    ...nicheHoles.map((h) => profileY(h, outer[0], outer[1])),
  ];
  return plate.subtract(union(cuts));
});
parts.push(...ribs);
// Onder het dek: per boog een schoor van de oplegging op de rivierpijler naar
// de eindstijl en een naar het dek binnen de pijler (de doorgetrokken
// onderrand), staven van 1,2 m.
const BEARING_X = 67.0;
const struts = [];
for (const end of [-1, 1]) {
  const bz = Z(MAIN_PIER.topNap);
  const bx = end * BEARING_X;
  for (const tx of [end * (ARCH.half - 0.6), end * 57.0]) {
    const tz = roadZ(tx) - MAIN_DEPTH + 0.2;
    const dx = tx - bx;
    const dz = tz - bz;
    const len = Math.hypot(dx, dz);
    const nx = (-dz / len) * 0.6;
    const nz = (dx / len) * 0.6;
    const quad = [[bx - nx, bz - 0.01], [bx + nx, bz - 0.01], [tx + nx, tz + nz], [tx - nx, tz - nz]];
    for (const side of [-1, 1]) struts.push(profileY(quad, side * ARCH.ribY - 0.6, side * ARCH.ribY + 0.6));
  }
  // Opleggingsblok op de pijler.
  for (const side of [-1, 1]) {
    struts.push(
      Manifold.cube([2.4, 2.0, 0.8], true).translate([bx, side * ARCH.ribY, Z(MAIN_PIER.topNap) + 0.39]),
    );
  }
}
parts.push(...struts);
// Windverband tussen de bovenranden: dwarsstaven op elke knoop waar de boog
// hoog genoeg is (|x| ≤ 50) en kruisen daartussen, staven van 0,9 m met een
// V-onderkant van 50 graden.
const BRACE_W = 0.9;
const braceNodes = nodeX.filter((x) => Math.abs(x) <= 50.5);
const braces = [];
for (const x of braceNodes) {
  braces.push(vBar([x, -ARCH.ribY, upperTop(x) - 0.15], [x, ARCH.ribY, upperTop(x) - 0.15], BRACE_W));
}
for (let i = 0; i + 1 < braceNodes.length; i++) {
  const x0 = braceNodes[i];
  const x1 = braceNodes[i + 1];
  braces.push(vBar([x0, -ARCH.ribY, upperTop(x0) - 0.15], [x1, ARCH.ribY, upperTop(x1) - 0.15], BRACE_W));
  braces.push(vBar([x0, ARCH.ribY, upperTop(x0) - 0.15], [x1, -ARCH.ribY, upperTop(x1) - 0.15], BRACE_W));
}
parts.push(...braces);

const bridge = union(parts);

// ---------- printvoet (alleen in de STL) ----------
// Onder het dek en de bogen: een wig van 50 graden vanaf de randen die
// uitloopt in een scherm van 0,9 m tot de onderplaat, tussen de landhoofden.
const KNEE = rad(50);
const SCREEN = 0.45;
const under = (x) => {
  if (Math.abs(x) <= MAIN_PIER.x) return { z: roadZ(x) - MAIN_DEPTH, w: MAIN_HALF };
  const s = spanAt(x);
  return { z: s ? soffit(s, x) : roadZ(x) - SLAB, w: s ? APPROACH_HALF : APPROACH_HALF };
};
const footXs = [];
for (let x = WEST_FACE; x <= EAST_FACE; x += 0.5) footXs.push(x);
footXs.push(EAST_FACE, -MAIN_PIER.x - 1e-3, -MAIN_PIER.x + 1e-3, MAIN_PIER.x - 1e-3, MAIN_PIER.x + 1e-3);
for (const s of spans) footXs.push(s.a - 1e-3, s.a + 1e-3, s.b - 1e-3, s.b + 1e-3);
const footStations = footXs
  .filter((x) => x >= WEST_FACE && x <= EAST_FACE)
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-4)
  .map((x) => {
    const { z, w } = under(x);
    const zb = z + 0.02;
    const hit = w - (zb - BASE) / Math.tan(KNEE);
    const section =
      hit > SCREEN
        ? [[-hit, BASE], [hit, BASE], [hit + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-hit - 1e-3, BASE + 1e-3]]
        : [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zb - Math.tan(KNEE) * (w - SCREEN)], [w, zb], [-w, zb], [-SCREEN, zb - Math.tan(KNEE) * (w - SCREEN)]];
    return { x, section };
  });
const printFoot = loftX(footStations, "printvoet");
const printModel = union([bridge, printFoot]);

// ---------- rijbaan en fietspaden als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is een eigen node per BGT-functie met de
// attributen van het wegdeel eronder (glTF `extras.attributes`), zodat de
// kleurregels van een thema (bijvoorbeeld fietspaden rood) op het brugdek
// werken zoals op de PDOK-wegdelen. Pas na het printmodel gebouwd, zodat de
// STL de brug als geheel ongewijzigd houdt.
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
// Actuele BGT-wegdelen met relatieve hoogteligging 1 op het dek: de rijbaan
// G0244.208cd15963e34fc3ab9d4d0d7859962c (rijbaan lokale weg) in het midden en
// de fietspaden G0244.0235022d100f471d9aad7ebe42e7bf07 (zuidkant) en
// G0244.597d21f733c04a8395e1958bb3ededdd (noordkant) ernaast, alle drie
// gesloten verharding zonder plus_fysiek_voorkomen. Hieronder de rijbaan in
// lokale coördinaten (vereenvoudigd tot 5 cm), aan beide einden verlengd tot
// voorbij de landhoofden; de fietspaden zijn de rest van de strook, ook de
// randen tot de dekrand die de BGT-fietspaden niet helemaal halen (onder de
// boog is het dek 1,1 m breder dan het BGT-vlak).
const ROADWAY = [[-263, -3.84], [-261.83, -3.84], [31.43, -3.9], [134.25, -3.2], [175.44, -3.12], [177, -3.12],
  [177, 3.87], [175.41, 3.87], [146.9, 3.94], [62.53, 3.31], [-261.66, 3.23], [-263, 3.23]];
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, over de loftstations
// van alle dekdelen (landhoofden, betonnen dekken, stalen rijvloer), breder
// dan het dek en 1 m voorbij de landhoofden: zo houden constructie en wegdeel
// nergens een vlak zonder dikte over op of tegen het wegdek.
const bandXs = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};
const stripXs = [
  WEST_END - 1,
  ...bandXs(WEST_END, WEST_FACE + 0.01, 2),
  ...bandXs(WEST_FACE, -MAIN_PIER.x, 2),
  ...bandXs(-MAIN_PIER.x - 0.1, MAIN_PIER.x + 0.1, 1),
  ...bandXs(MAIN_PIER.x, EAST_FACE, 2),
  ...bandXs(EAST_FACE - 0.01, EAST_END, 2),
  EAST_END + 1,
]
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-4);
const strip = profileY(
  [...stripXs.map((x) => [x, roadZ(x) - LAYER]), ...[...stripXs].reverse().map((x) => [x, roadZ(x) + ABOVE])],
  -APPROACH_HALF - 2,
  APPROACH_HALF + 2,
);
// De hele strook van elke boog blijft constructie (plaat met eindstijlen, ook
// onder de openingen tussen de hangers), met 2 cm vrij.
const ribGuards = [-1, 1].map((side) =>
  bandY(
    -ARCH.half - 0.02,
    ARCH.half + 0.02,
    (x) => roadZ(x) - LAYER - 0.5,
    (x) => roadZ(x) + ABOVE + 0.5,
    side * ARCH.ribY - ARCH.plate / 2 - 0.02,
    side * ARCH.ribY + ARCH.plate / 2 + 0.02,
    1,
  ),
);
const notLayer = union(ribGuards);
// Onder de boog scheiden de bogen de rijbaan van de fietspaden (die buiten de
// bogen liggen); de BGT-grens ligt aan de noordkant 0,4 m binnen de boog en
// aan de zuidkant 0,2 m in de boog. Daar is alles tussen de bogen rijbaan en
// alles erbuiten fietspad, zodat er geen strookje van 0,4 m langs een boog
// overblijft.
const archBox = Manifold.cube([2 * (ARCH.half + 0.02), 100, 200], true);
const betweenRibs = Manifold.cube([2 * (ARCH.half + 0.02), 2 * ARCH.ribY, 200], true);
const roadPrism = Manifold.extrude(new CrossSection([ccw(ROADWAY)]), 200)
  .translate([0, 0, -50])
  .subtract(archBox)
  .add(betweenRibs);
const roadCut = strip.subtract(notLayer).intersect(roadPrism);
const bikeCut = strip.subtract(notLayer).subtract(roadPrism);
const roadway = roadCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const structure = bridge.subtract(union([roadCut, bikeCut]));
const named = [
  ["building:ijsselbrug-zwolle", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];
// Partitiecontrole: de onderdelen tellen op tot de brug als geheel.
const partition = {
  bridgeM3: +bridge.volume().toFixed(3),
  partsM3: +(structure.volume() + roadway.volume() + bikeway.volume()).toFixed(3),
};
partition.diffM3 = +(partition.partsM3 - partition.bridgeM3).toFixed(4);
if (Math.abs(partition.diffM3) > 0.01) throw new Error(`onderdelen tellen niet op: ${JSON.stringify(partition)}`);

// ---------- controles ----------
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const st = mesh.numProp;
  let area = 0;
  const bins = {};
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * st + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(n[0], n[1], n[2]);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    const k = Math.round((p[0][0] + p[1][0] + p[2][0]) / 3 / 25) * 25;
    bins[k] = (bins[k] ?? 0) + len / 2;
  }
  return { area, bins };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-4) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
if (Math.min(...flankAngles) < 50) throw new Error("opening met een te vlakke flank");
const overhangReport = (() => {
  const model = overhangs(bridge);
  const print = overhangs(printModel);
  return {
    modelM2: Math.round(model.area),
    printM2: +print.area.toFixed(1),
    printByX: Object.fromEntries(Object.entries(print.bins).filter(([, a]) => a > 1).map(([k, a]) => [k, +a.toFixed(1)])),
  };
})();

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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
    meshes.push({ name, primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }] });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of named) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
report.arch = {
  crownNap: ARCH.crown,
  endPostTopNap: +(upperTop(ARCH.half) + WATER_NAP).toFixed(2),
  lowerCrownNap: +(LOW_CROWN + WATER_NAP).toFixed(2),
  bearingNap: +(lowBot(BEARING_X) + WATER_NAP).toFixed(2),
  hangerOpenings: throughHoles.length,
  niches: nicheHoles.length,
  braces: braces.length,
  minFlankDeg: +Math.min(...flankAngles).toFixed(1),
};
report.approach = {
  westPiers: WEST_PIERS.map((x) => +x.toFixed(2)),
  eastPiers: EAST_PIERS,
  spansM: spans.map(({ a, b }) => +(b - a).toFixed(1)),
  crownsNap: spans.map((s) => +(roadZ(s.mid) - SLAB + WATER_NAP).toFixed(2)),
};
report.overhang = overhangReport;
report.partition = partition;
const glbFile = path.join(outDir, "ijsselbrug-zwolle.glb");
await writeFile(glbFile, toGlb(named, "NederPrint generate-ijsselbrug-zwolle.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: named.map(([name]) => name) };

const stlName = `ijsselbrug-zwolle-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint IJsselbrug Zwolle 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveld op het water van de IJssel naast de boog, 30 m naast de as.
const samplePoints = [-40, 0, 40].flatMap((x) => [[x, 30], [x, -30]]);
await writeFile(
  path.join(outDir, "ijsselbrug-zwolle.json"),
  JSON.stringify(
    {
      name: "IJsselbrug Zwolle",
      file: "ijsselbrug-zwolle.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [200533.94, 501238.24],
      xAxis: [0.87568, 0.48288],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "G0244.f1ac59f63bcf4f4c8b26456f97f97966",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden tussen de twee rivierpijlers op de waterspiegel van de IJssel (z = 0, NAP +1,3 m zoals het PDOK-terrein) in de oorsprong, +X langs de brug naar het oosten (Zwolle, RD-richting 28,87 graden vanaf het oosten) en +Y stroomafwaarts naar het noordnoordwesten. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan lokale weg of fietspad, bgt_fysiekvoorkomen gesloten verharding; de fietspaden aan beide kanten, onder de boog buiten de bogen), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het dek van 15 m breed over de aanbruggen en 17,1 m onder de boog van het westelijke landhoofd bij Hattem (x = -262) tot het oostelijke bij Zwolle (x = 175,5), met het wegdek op NAP +8,4 tot +12,05 m (AHN); de stalen boog van 138 m tussen de rivierpijlers als twee rechtopstaande vakwerkbogen 4,3 m naast de as met de top op NAP +35,7 m, als platen van 1,2 m met doorgaande spitse openingen tussen de hangers en in het vakwerk en blinde nissen, eindstijlen op het dek en schoren onder het dek naar de oplegging op de rivierpijlers; het windverband tussen de bovenranden als dwarsstaven en kruisen met een V-onderkant; zes betonnen bogen aan de westkant en drie aan de oostkant onder het dek, met de boogring 0,3 m voor het boogvlak, op pijlers met ronde koppen; de rivierpijlers van 6,1 × 22,6 m met ronde koppen. Het eindportaal tussen de bogen, leuningen en lantaarns zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de boog bemonsterd; groundHeight is de ellipsoïdische PDOK-hoogte van dat water. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_END - WEST_END).toFixed(1),
        deckWidthM: { approach: 2 * APPROACH_HALF, arch: 2 * MAIN_HALF },
        mainSpanPierCentresM: 2 * MAIN_PIER.x,
        archCrownNapM: ARCH.crown,
        archRibsFromAxisM: ARCH.ribY,
        hangerPanelM: +(138 / ARCH.panels).toFixed(2),
        approachArches: { west: WEST_PIERS.length + 1, east: EAST_PIERS.length + 1 },
        roadNapM: { west: ROAD_NAP[0], crest: Math.max(...ROAD_NAP), east: ROAD_NAP[ROAD_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/IJsselbrug_(Zwolle)",
        "PDOK BGT overbruggingsdeel (dek, oostelijke rivierpijler, aanbrugpijlers, landhoofden), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de bovenrand en de ligging van de bogen",
        "Wikimedia Commons: Zwolle IJsselbrug.jpg; Zwolle IJsselbrug 02.JPG; 20151217 IJsselbrug Zwolle.jpg; 20150819 IJsselbrug Zwolle.jpg; The old roadbridge across the IJssel at Zwolle - panoramio.jpg; Old steel roadbridge over the IJssel at Zwolle - panoramio.jpg; 2007-04-23 10.40 Zwolle, brug over de IJssel op de weg naar Hattem.JPG",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

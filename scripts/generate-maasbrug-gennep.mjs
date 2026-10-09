// Genereert een vereenvoudigd, gesloten 3D-model van de Maasbrug bij Gennep
// (N264 tussen Oeffelt en Gennep, verkeersbrug van 1955): een stalen
// vakwerkbrug met evenwijdige randen over vijf overspanningen van circa 62 m,
// elk een losse Warren-ligger zonder verticalen met schuine eindstijlen, op
// de gemetselde pijlers van de spoorbrug van het Duits Lijntje (1873). De
// verkeersbrug ligt op het noordelijke deel van die pijlers; het zuidelijke
// deel, waar de spoorbrug lag (in 1973-1974 afgebroken), steekt nog 8 m naast
// het dek uit met de oude oplegblokken erop. Tussen de liggers de rijbaan, aan
// de noordkant buiten de ligger een fietspad op een uitkraging. Alle maten in
// het script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog,
// één node per onderdeel met de materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal> met een printvoet onder het dek. De brug is 315 m
// lang en past op 1:1000 in 400 mm.
//
//   node scripts/generate-maasbrug-gennep.mjs              # 1:1000 (standaard)
//   node scripts/generate-maasbrug-gennep.mjs --scale 1250
//
// Assenstelsel: oorsprong midden op de brug (midden tussen de uiteinden van de
// vakwerken, in het middelste veld) op de as tussen de twee liggers (RD
// 194494,52, 411755,37), z = 0 op de waterspiegel van de Maas (NAP +8,13 m),
// Z omhoog. +X loopt langs de brug naar het oosten (Gennep, RD-richting 6,27
// graden vanaf het oosten, langs de randen van het BGT-dek), +Y naar het
// noorden (stroomafwaarts). De liggers staan op y = ±4,05; het dek loopt van
// y = -4,6 tot 7,02 en van x = -157,03 (landhoofd Oeffelt) tot 158,02
// (landhoofd Gennep). De pijlers staan op x = -93,3, -30,6, 32,1 en 94,8.
//
// Bronnen: BGT overbruggingsdeel (het dek en zijn randen, het westelijke
// landhoofd, de pijlers op x = -30,6, 32,1 en 94,8 met ronde koppen), BGT
// wegdeel en ondersteunend wegdeel (rijbaan, fietspaden en de strook met
// band en ligger tussen rijbaan en fietspad); AHN DSM 0,5 m (PDOK WCS) voor het
// lengteprofiel van de rijbaan (NAP +20,24 m in het midden, +19,45 m bij de
// landhoofden), het fietspad (0,17 m hoger), de vakwerklijnen (y = ±4,05), de
// bovenrand (5,1 m boven de rijbaan), de uiteinden van de vakwerken (onder
// x = ±156,4), de pijler op x = -93,3 (niet in de BGT), de bovenkant van de
// pijlers (NAP +17,6 tot +18,0 m) met de oude oplegblokken (0,6 m hoger) en de
// voetafdruk van het eerste veld; PDOK-terrein voor de waterspiegel (52,05 m
// ellipsoïdisch, de uiterwaard 43,93 m boven het AHN); PDOK-luchtfoto
// (Actueel_orthoHR) voor het windverband (vakken van 7,8 m), de losse
// overspanningen met de eindportalen boven elke pijler en de pijlers;
// Wikipedia (nl) voor bouwjaar, vijf overspanningen van circa 62 m, lengte en
// de spoorbrug op de zuidkant van de pijlers; Wikimedia Commons-foto's
// (Bridgegennepbrabant.jpg, Bridgegenneplimburg.jpg, Gennep brug N264.jpg,
// Oeffelt Rijksmonument 518572 brugpijlers Maasbrug.JPG, Oeffelt, RM 518573
// brugkazemat noord, positie ten opzichte van de brug.JPG, Opening nieuwe brug
// over Maas bij Gennep, Bestanddeelnr 907-1390.jpg) voor het Warren-vakwerk
// zonder verticalen, de schuine eindstijlen, de uitkraging met het fietspad,
// de band tussen rijbaan en ligger en de gemetselde pijlers met ronde koppen.
// Geschat: de vakverdeling (acht vakken per overspanning), de breedte van de
// staven (0,9 m) en de dikte van de liggerplaten (1,0 m), de constructiehoogte
// van het dek (1,5 m, de uitkraging 1,2 tot 0,6 m), de onderrand tot 0,6 m
// boven het wegdek, de vorm van de pijler op x = -93,3 (gelijk aan die op
// x = -30,6), de kraag om de pijlers, de betonnen oplegging onder het dek en
// de landhoofden.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "maasbrug-gennep");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const area2 = (pts) => {
  let a = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  });
  return a / 2;
};
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const extrudeY = (shape, y0, y1) =>
  Manifold.extrude(shape, y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const profileY = (points, y0, y1) => extrudeY([ccw(points)], y0, y1);
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in gezien vanaf +X, steeds evenveel punten).
function loftX(stations) {
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
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  if (solid.volume() <= 0) throw new Error("loft: omgekeerde doorsnede");
  return solid;
}
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};
// Driehoek naar binnen verschoven over d (de halve breedte van de staven
// eromheen); null als er te weinig opening overblijft.
function insetTriangle(tri, d, minArea = 1.5) {
  const polys = new CrossSection([ccw(tri)]).offset(-d, "Miter").toPolygons();
  if (polys.length !== 1 || polys[0].length < 3) return null;
  const pts = polys[0].map(([a, b]) => [a, b]);
  return Math.abs(area2(pts)) >= minArea ? pts : null;
}
const xRange = (poly) => [
  poly.reduce((m, [x]) => Math.min(m, x), Infinity),
  poly.reduce((m, [x]) => Math.max(m, x), -Infinity),
];

// ---------- hoofdmaten ----------
// z = 0 op de waterspiegel: het PDOK-terrein legt de Maas op ellipsoïdisch
// 52,05 m en de uiterwaard 43,93 m boven het AHN, dus het water op NAP +8,13 m.
const WATER_NAP = 8.13;
const Z = (nap) => nap - WATER_NAP;
const BASE = -1.0; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
const GROUND_HEIGHT = 52.05; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten
const ORIGIN = [194494.52, 411755.37];
const X_AXIS = [0.99402, 0.10921];

const X_WEST = -157.03; // einde van het BGT-dek en voorkant van het landhoofd bij Oeffelt
const X_EAST = 158.02; // einde van het BGT-dek bij Gennep

// Rijbaan in NAP (AHN-DSM, 25e percentiel per 5 m over het midden van de
// rijbaan): een flauwe bolling, symmetrisch rond het midden (aan de oostkant
// is het AHN boven x = 125 verstoord en is de westkant gespiegeld).
const ROAD_NAP = [
  [0, 20.235], [20, 20.22], [40, 20.19], [60, 20.13], [80, 20.04], [100, 19.92], [120, 19.78], [140, 19.62], [160, 19.43],
];
function road(x) {
  const a = Math.abs(x);
  const pts = ROAD_NAP;
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    if (a <= x1) return Z(z0 + ((z1 - z0) * (a - x0)) / (x1 - x0));
  }
  return Z(pts[pts.length - 1][1]);
}
// Dwarsprofiel (BGT, AHN): de zuidelijke ligger op de zuidrand van het dek,
// de rijbaan tussen de liggers met een band van 0,4 m tegen de noordelijke
// ligger, het fietspad buiten de noordelijke ligger 0,17 m hoger op een
// uitkraging met een schampkant langs de rand in plaats van de leuning.
const DECK = { s: -4.6, n: 7.02, depth: 1.5, armDepth: 1.2, edgeDepth: 0.6, curb: 0.17 };
const WALLS = [
  { y0: -4.55, y1: -3.55, niche: "low" }, // zuid, nissen aan de buitenkant
  { y0: 3.55, y1: 4.55, niche: "high" }, // noord, nissen aan de fietspadkant
];
const KERB = { y0: 3.15, y1: 3.55, height: 0.25 }; // band tussen rijbaan en ligger
const EDGE = { y0: 6.32, y1: DECK.n, height: 0.45 }; // schampkant langs het fietspad
const walk = (x) => road(x) + DECK.curb;
const deckBottom = (x) => road(x) - DECK.depth;

// Vakwerk (hoogtes boven de rijbaan): vijf losse liggers, elk acht vakken
// Warren zonder verticalen met schuine eindstijlen. De onderste uiteinden
// liggen op de landhoofden op x = ±156,4 (AHN) en boven de pijlers 0,5 m uit
// elkaar.
const TRUSS = { top: 5.1, floor: 0.6, bar: 0.9, panels: 8, ends: 156.4, pierGap: 0.5 };
const NICHE = 0.35; // blinde nissen
const GABLE_DEG = 52; // plafond van de doorgaande openingen

// Pijlers: BGT-voetafdrukken (lokale coördinaten, vereenvoudigd tot 5 cm) met
// ronde koppen; de pijler op x = -93,3 staat niet in de BGT en is die op
// x = -30,6, 62,7 m verschoven (de BGT-steek). Bovenkant van het metselwerk
// (AHN, NAP), daaronder een kraag; op het zuidelijke deel de oude
// oplegblokken van de spoorbrug (AHN: 1,0 m breed, 0,6 m hoog, y = -10,65 en
// -5,65), op het noordelijke deel een betonnen oplegging tot in het dek.
const PIER_W2 = [
  [-32.87, -10.41], [-32.26, -11.67], [-30.8, -12.89], [-29.52, -11.97], [-28.74, -10.82], [-28.38, -9.27], [-28.18, 2.95],
  [-28.53, 4.65], [-30.01, 6.19], [-30.79, 6.5], [-31.87, 5.95], [-32.7, 4.64], [-33.02, 2.91], [-33.03, -9.09],
];
const PIERS = [
  { poly: PIER_W2.map(([x, y]) => [x - 62.7, y]), top: 17.6, source: "geschat, verschoven" },
  { poly: PIER_W2, top: 17.9, source: "BGT L0002.68934ca98a9f4ba9812e6d82cfe51a9e" },
  {
    poly: [
      [33.89, 7.01], [32.92, 7.82], [32.27, 8.03], [31.93, 8.02], [31.22, 7.74], [30.55, 7.14], [29.21, 5.08], [28.68, 3.7],
      [28.31, 2.14], [28.36, -8.79], [28.49, -10.16], [29.18, -11.99], [30.22, -13.65], [30.93, -14.53], [31.36, -14.77],
      [32.03, -14.99], [32.44, -14.89], [33.07, -14.56], [33.69, -13.77], [34.82, -12.04], [35.26, -10.93], [35.65, -9.32],
      [35.88, -5.09], [35.43, 4.63], [34.98, 5.72], [34.16, 6.78],
    ],
    top: 18.0,
    source: "BGT L0002.da958432226e4f0d8cc4aa0180fc5573",
  },
  {
    poly: [
      [97.08, -3.26], [97.13, 2.74], [96.69, 4.68], [95.66, 6.04], [94.87, 6.57], [93.72, 5.79], [92.84, 4.48], [92.46, 3.12],
      [92.51, -9.21], [92.83, -10.84], [93.66, -12.06], [94.75, -12.98], [95.8, -12.34], [96.83, -10.88], [97.03, -8.74],
    ],
    top: 17.6,
    source: "BGT L0002.e2974049b88649b284fc203dd49ade7c",
  },
];
const PIER_X = PIERS.map(({ poly }) => {
  const [a, b] = xRange(poly);
  return +((a + b) / 2).toFixed(2);
});
const COPING = { below: 1.2, out: 0.25, rise: 0.3, band: 0.35 }; // kraag: 50 graden, 0,25 m uit
const OLD_BEARINGS = { ys: [-10.65, -5.65], width: 1.0, height: 0.6 };
const PIER_INTO = 0.9; // betonnen oplegging tot 0,6 m onder het wegdek
// Landhoofden (BGT P0030.8abeacd5439b7599bf30bbb191c2a3be bij Oeffelt; bij
// Gennep gespiegeld tot het einde van het dek).
const ABUTMENTS = [
  [X_WEST, -154.3],
  [154.3, X_EAST],
];

// ---------- dek, band en schampkant ----------
const deckXs = stationsX(X_WEST, X_EAST, 2);
const deckMain = loftX(
  deckXs.map((x) => {
    const zt = road(x);
    return { x, section: [[DECK.s, zt - DECK.depth], [WALLS[1].y0 + 0.01, zt - DECK.depth], [WALLS[1].y0 + 0.01, zt], [DECK.s, zt]] };
  }),
);
// Uitkraging met het fietspad: onderkant van 1,2 m onder het fietspad aan de
// ligger tot 0,6 m aan de rand.
const deckArm = loftX(
  deckXs.map((x) => {
    const zt = walk(x);
    return {
      x,
      section: [[WALLS[1].y0, zt - DECK.armDepth], [DECK.n, zt - DECK.edgeDepth], [DECK.n, zt], [WALLS[1].y0, zt]],
    };
  }),
);
// Strook langs x van y0 tot y1 van zb(x) tot zt(x), met `margin` rondom groter.
function band(x0, x1, y0, y1, zb, zt, margin = 0, step = 2) {
  return loftX(
    stationsX(x0 - margin, x1 + margin, step).map((x) => ({
      x,
      section: [[y0 - margin, zb(x) - margin], [y1 + margin, zb(x) - margin], [y1 + margin, zt(x) + margin], [y0 - margin, zt(x) + margin]],
    })),
  );
}
const kerb = band(X_WEST, X_EAST, KERB.y0, KERB.y1, (x) => road(x) - 0.3, (x) => road(x) + KERB.height);
const edge = band(X_WEST, X_EAST, EDGE.y0, EDGE.y1, (x) => walk(x) - 0.3, (x) => walk(x) + EDGE.height);

// ---------- vakwerkliggers ----------
// Per overspanning een plaat in (x, h), h boven de rijbaan, van de onderkant
// van het dek tot de bovenrand, daarna langs het lengteprofiel gebogen. De
// driehoeken met de punt omhoog (tussen twee onderknopen en een bovenknoop)
// zijn doorgaande openingen met een spitse top van 52 graden; de driehoeken
// met een vlakke bovenkant zijn blinde nissen van 0,35 m aan de buitenkant.
const TAN_GABLE = Math.tan((GABLE_DEG * Math.PI) / 180);
const openingAngles = [];
let throughOpenings = 0;
let blindNiches = 0;
const apexOf = (poly) => poly.reduce((p, q) => (q[1] > p[1] ? q : p));
function gableCut(hole) {
  const [ax, az] = apexOf(hole);
  const gable = new CrossSection([[[ax - 100, az - 100 * TAN_GABLE], [ax + 100, az - 100 * TAN_GABLE], [ax, az]]]);
  const cut = new CrossSection([ccw(hole)]).intersect(gable);
  const polys = cut.toPolygons();
  if (polys.length !== 1 || cut.area() < 1.5) return null;
  return polys[0].map(([a, b]) => [a, b]);
}
// Scherpe hoeken tussen de vlakke rand en een schuine zijde krijgen een
// verticaal stukje van 0,1 m: zo liggen vloer en plafond van een opening (of
// plafond en zijde van een nis) nergens binnen 1 cm boven elkaar.
const STEP = 0.1;
function stepCorners(poly) {
  if (!poly || poly.length !== 3) return poly;
  const k = [0, 1, 2].find((i) => Math.abs(poly[(i + 1) % 3][1] - poly[(i + 2) % 3][1]) < 1e-6);
  if (k === undefined) return poly;
  const v = poly[k];
  const out = [];
  for (let i = 0; i < 3; i++) {
    const p = poly[(k + i) % 3];
    if (i === 0) {
      out.push(p);
      continue;
    }
    const t = STEP / Math.abs(v[1] - p[1]);
    const q = [p[0] + (v[0] - p[0]) * t, p[1] + (v[1] - p[1]) * t];
    // langs de rand van het vorige punt naar dit hoekpunt: eerst q of eerst de voet
    if (i === 1) out.push(q, [q[0], p[1]]);
    else out.push([q[0], p[1]], q);
  }
  return out;
}
const hb = -DECK.depth; // onderkant
const hcb = TRUSS.floor - TRUSS.bar / 2; // hart onderrand
const hct = TRUSS.top - TRUSS.bar / 2; // hart bovenrand
const SPANS = (() => {
  const bounds = [-TRUSS.ends, ...PIER_X.flatMap((c) => [c - TRUSS.pierGap / 2, c + TRUSS.pierGap / 2]), TRUSS.ends];
  return Array.from({ length: 5 }, (_, k) => ({ xa: bounds[2 * k], xb: bounds[2 * k + 1] }));
})();
const E = TRUSS.pierGap / 2 + 0.01; // de onderranden boven de pijlers raken elkaar
const trussStats = [];
function spanPlate({ xa, xb }) {
  const p = (xb - xa) / TRUSS.panels;
  const m = (hct - hcb) / (p / 2);
  const sin = m / Math.hypot(1, m);
  const dOff = TRUSS.bar / 2 / sin; // horizontale halve breedte van een eindstijl
  const xTopL = xa + (TRUSS.top - hcb) / m - dOff;
  const xTopR = xb - (TRUSS.top - hcb) / m + dOff;
  const h0 = hcb + m * (-E + dOff);
  const outline = [
    ...stationsX(xa - E, xb + E, 2).map((x) => [x, hb]),
    [xb + E, h0],
    ...stationsX(xTopL, xTopR, 2)
      .reverse()
      .map((x) => [x, TRUSS.top]),
    [xa - E, h0],
  ];
  const holes = [];
  const niches = [];
  for (let j = 0; j < TRUSS.panels; j++) {
    const up = [[xa + j * p, hcb], [xa + (j + 1) * p, hcb], [xa + (j + 0.5) * p, hct]];
    const inset = insetTriangle(up, TRUSS.bar / 2);
    const hole = inset && gableCut(inset);
    if (hole) holes.push(stepCorners(hole));
    if (j + 1 < TRUSS.panels) {
      const down = [[xa + (j + 0.5) * p, hct], [xa + (j + 1.5) * p, hct], [xa + (j + 1) * p, hcb]];
      const n = insetTriangle(down, TRUSS.bar / 2);
      if (n) niches.push(stepCorners(n));
    }
  }
  for (const hole of holes) {
    const apex = apexOf(hole);
    for (const q of hole) {
      if (q === apex || Math.abs(q[0] - apex[0]) < 1e-6) continue;
      openingAngles.push((Math.atan2(apex[1] - q[1], Math.abs(apex[0] - q[0])) * 180) / Math.PI);
    }
  }
  trussStats.push({
    xa: +xa.toFixed(2),
    xb: +xb.toFixed(2),
    lengthM: +(xb - xa).toFixed(2),
    panelM: +p.toFixed(3),
    diagonalDeg: +((Math.atan(m) * 180) / Math.PI).toFixed(1),
    holes: holes.length,
    niches: niches.length,
  });
  return { outline, holes, niches };
}
const alongRoad = (solid) =>
  solid.warp((v) => {
    v[2] += road(v[0]);
  });
const trusses = SPANS.flatMap((span) => {
  const { outline, holes, niches } = spanPlate(span);
  return WALLS.map(({ y0, y1, niche }) => {
    const plate = profileY(outline, y0, y1);
    const cut = [
      ...holes.map((h) => profileY(h, y0 - 0.3, y1 + 0.3)),
      ...niches.map((h) => (niche === "low" ? profileY(h, y0 - 0.3, y0 + NICHE) : profileY(h, y1 - NICHE, y1 + 0.3))),
    ];
    throughOpenings += holes.length;
    blindNiches += niches.length;
    return alongRoad(plate.subtract(union(cut)));
  });
});

// ---------- pijlers en landhoofden ----------
const offsetPoly = (poly, d) => new CrossSection([ccw(poly)]).offset(d, "Round", 2, 16);
function pier({ poly, top }) {
  const zt = Z(top);
  const z0 = zt - COPING.below;
  const shaft = prism(poly, BASE, z0 + 0.01);
  // Kraag: 50 graden naar buiten tot 0,25 m, dan een band van 0,35 m, daarboven
  // het metselwerk tot de bovenkant.
  const ring = offsetPoly(poly, COPING.out);
  const collar = Manifold.hull([prism(poly, z0, z0 + 0.01), ring.extrude(0.01).translate([0, 0, z0 + COPING.rise - 0.01])]);
  const bandSolid = ring.extrude(COPING.band).translate([0, 0, z0 + COPING.rise]);
  const upper = prism(poly, z0 + COPING.rise + COPING.band - 0.01, zt);
  const [xa, xb] = xRange(poly);
  const xm = (xa + xb) / 2;
  // Oude oplegblokken van de spoorbrug op het zuidelijke deel.
  const stones = OLD_BEARINGS.ys.map((y) =>
    boxFromTo(xm - 1.6, xm + 1.6, y - OLD_BEARINGS.width / 2, y + OLD_BEARINGS.width / 2, zt - 0.1, zt + OLD_BEARINGS.height),
  );
  // Betonnen oplegging onder het dek tot 0,6 m onder het wegdek.
  const yMax = poly.reduce((mx, [, y]) => Math.max(mx, y), -Infinity);
  const bearing = boxFromTo(
    xm - 1.8,
    xm + 1.8,
    DECK.s + 0.05,
    Math.min(DECK.n, yMax) - 1.6,
    zt - 0.1,
    Math.min(road(xa), road(xb)) - DECK.depth + PIER_INTO,
  );
  return union([shaft, collar, bandSolid, upper, ...stones, bearing]);
}
const piers = PIERS.map(pier);
// Landhoofden tot in het dek: onder de rijbaan tot 0,6 m onder het wegdek,
// onder de uitkraging tot 0,55 m onder het fietspad.
const abutments = ABUTMENTS.map(([x0, x1]) =>
  union([
    boxFromTo(x0, x1, DECK.s, WALLS[1].y0 + 0.01, BASE, Math.min(road(x0), road(x1)) - DECK.depth + PIER_INTO),
    boxFromTo(x0, x1, WALLS[1].y0, DECK.n, BASE, Math.min(walk(x0), walk(x1)) - 0.55),
  ]),
);

// ---------- de brug als geheel ----------
const bridge = union([deckMain, deckArm, kerb, edge, ...trusses, ...piers, ...abutments]);

// ---------- printvoet (alleen in de STL) ----------
// Onder het dek een wig van 50 graden vanaf de onderkant van beide dekranden
// op een scherm van minstens 0,8 mm op printschaal tot de onderplaat, net als
// de overhangopvulling van de export.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const footXs = stationsX(ABUTMENTS[0][1] - 0.5, ABUTMENTS[1][0] + 0.5, 1);
const fc = (DECK.s + DECK.n) / 2;
const footWedge = loftX(
  footXs.map((x) => {
    const zbS = deckBottom(x) - 0.02;
    const zbN = walk(x) - DECK.edgeDepth - 0.02;
    const zIn = road(x) - 0.1;
    const zsS = zbS - KNEE * (fc - SCREEN - DECK.s);
    const zsN = zbN - KNEE * (DECK.n - fc - SCREEN);
    return {
      x,
      section: [[fc - SCREEN, zsS], [fc + SCREEN, zsN], [DECK.n, zbN], [DECK.n, zIn], [DECK.s, zIn], [DECK.s, zbS]],
    };
  }),
);
const footStem = loftX(
  footXs.map((x) => {
    const zs = Math.max(
      deckBottom(x) - 0.02 - KNEE * (fc - SCREEN - DECK.s),
      walk(x) - DECK.edgeDepth - 0.02 - KNEE * (DECK.n - fc - SCREEN),
    );
    return { x, section: [[fc - SCREEN, BASE], [fc + SCREEN, BASE], [fc + SCREEN, zs + 0.05], [fc - SCREEN, zs + 0.05]] };
  }),
);
const printFoot = union([footWedge, footStem]);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant, per soort.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const buckets = {};
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const key = zm < road(xm) - 0.3 ? "dek en pijlers" : zm > road(xm) + TRUSS.floor + 0.05 ? "nissen" : "overig";
    buckets[key] = (buckets[key] ?? 0) + len / 2;
  }
  return Object.fromEntries(Object.entries(buckets).map(([k, a]) => [k, +a.toFixed(1)]));
}
const minAngle = openingAngles.reduce((m, a) => Math.min(m, a), Infinity);
console.log("vrij hangend in het model (m2):", overhangs(bridge));
console.log("vrij hangend in de printversie (m2):", overhangs(printModel));
{
  const left = overhangs(printModel);
  if ((left["dek en pijlers"] ?? 0) + (left.overig ?? 0) > 0.5) throw new Error("printversie heeft overhang buiten de nissen");
}
console.log("doorgaande openingen", throughOpenings, "blinde nissen", blindNiches, "steilste plafond min (graden)", +minAngle.toFixed(1));
if (minAngle < 50) throw new Error("opening met een te vlak plafond");

// ---------- wegdek als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is per wegdeel een eigen node met de
// attributen van het BGT-wegdeel eronder (glTF `extras.attributes`), zodat de
// kleurregels van een thema (fietspaden rood) op de brug werken zoals op de
// PDOK-wegdelen ernaast. Actuele BGT-wegdelen met relatieve hoogteligging 1 op
// het dek (lokale coördinaten, vereenvoudigd tot 5 cm): rijbaan regionale weg
// (asfalt, met langs de zuidelijke ligger een goot van 0,2 m in cementbeton
// die bij de rijbaan is genomen), fietspad in cementbeton op het Brabantse
// deel (tot x = 32,7 tot 32,9) en in asfalt op het Limburgse deel. De strook
// met de band en de noordelijke ligger (BGT ondersteunend wegdeel berm) is
// geen wegdeel en blijft constructie, net als de liggers en de schampkant.
// Rijbaan = de strook tussen de liggers min de band; fietspad = de strook
// buiten de noordelijke ligger, binnen de BGT-contouren in cementbeton of
// anders in asfalt. De strook loopt van 0,5 m onder tot 1 m boven het wegdek
// (rijbaan en fietspad elk op hun eigen hoogte); de liggers, de band en de
// schampkant zijn er met 2 cm vrij uitgenomen. Pas hier gebouwd, nadat het
// printmodel is doorgerekend, zodat de STL gelijk blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_ASPHALT_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_CONCRETE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "cementbeton" };
const ROADWAY = [
  // P0030.2ebda7e4884a4c74928bc24e0d6d6893 (asfalt)
  [[-67.77, -0.02], [-156.92, -0.12], [-156.86, -3.27], [-67.77, -3.29]],
  // P0030.5edde800f2a34347bfd7b442983f2412 (asfalt)
  [[-67.77, 3.08], [-117.9, 3.05], [-156.97, 3.12], [-156.92, -0.12], [-67.77, -0.02]],
  // P0030.00f6f96862f1f68ae050120a080440dd (asfalt)
  [[28.31, -3.26], [33.29, -3.26], [33.11, -0.04], [-67.77, -0.02], [-67.77, -3.28]],
  // P0030.00f6f96862f2f68ae050120a080440dd (asfalt)
  [[33.11, -0.04], [32.93, 3.18], [-67.77, 3.08], [-67.77, -0.02]],
  // P0031.4aadda9114d22225e053160d000a34f1 (asfalt)
  [[33.11, -0.04], [33.29, -3.26], [138.44, -3.27], [158.05, -3.12], [158.05, -0.13], [46.16, -0.15]],
  // P0031.4aadda9114d32225e053160d000a34f1 (asfalt)
  [[158.04, 3.14], [32.94, 3.06], [33.11, -0.04], [46.16, -0.15], [158.05, -0.13]],
  // P0030.46c0ed933c5e46afb5452f674beec6af (goot, cementbeton)
  [[-156.86, -3.27], [-156.86, -3.49], [-67.77, -3.4], [-67.77, -3.29]],
  // P0030.00f6f968d85df68ae050120a080440dd (goot, cementbeton)
  [[33.29, -3.26], [-67.77, -3.28], [-67.77, -3.4], [-33.03, -3.45], [33.3, -3.38]],
];
const BIKE_CONCRETE = [
  // P0030.00f6f96898d3f68ae050120a080440dd
  [[-67.77, 4.22], [-67.77, 7.05], [-143.02, 7.07], [-157.03, 7.01], [-156.99, 4.24], [-116.8, 4.07]],
  // P0030.c801b770d04c4653a65e0e021401d917
  [[32.72, 6.81], [-67.77, 6.73], [-67.77, 4.22], [-22.83, 4.06], [32.88, 4.15]],
];
const BIKE_ASPHALT = [
  // P0031.4aadda9114d42225e053160d000a34f1
  [[89.89, 6.79], [32.72, 6.81], [32.92, 3.28], [73.7, 3.17], [158.02, 3.22], [158.02, 6.75]],
];
// De as van rijbaan en fietspad ligt over de hele lengte in een wegdeel van
// die functie (op het Limburgse deel het fietspad in asfalt).
{
  const inRing = ([x, y], ring) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  for (let x = -156.5; x <= 157.6; x += 0.5) {
    for (const y of [-3.0, 0.5, 2.9]) if (!ROADWAY.some((r) => inRing([x, y], r))) throw new Error(`rijbaan: (${x}, ${y}) buiten de BGT`);
    const bike = x < 32.7 ? BIKE_CONCRETE : BIKE_ASPHALT;
    for (const y of [4.7, 5.5, 6.3]) if (!bike.some((r) => inRing([x, y], r))) throw new Error(`fietspad: (${x}, ${y}) buiten de BGT`);
  }
}
const stripXs = [X_WEST - 0.5, ...deckXs, X_EAST + 0.5];
const roadStrip = loftX(
  stripXs.map((x) => ({ x, section: [[DECK.s - 0.5, road(x) - LAYER], [WALLS[1].y0, road(x) - LAYER], [WALLS[1].y0, road(x) + ABOVE], [DECK.s - 0.5, road(x) + ABOVE]] })),
);
const walkStrip = loftX(
  stripXs.map((x) => ({ x, section: [[WALLS[1].y0, walk(x) - LAYER], [DECK.n + 0.5, walk(x) - LAYER], [DECK.n + 0.5, walk(x) + ABOVE], [WALLS[1].y0, walk(x) + ABOVE]] })),
);
// Wat constructie blijft, met 2 cm vrij: de hele strook van de liggers (ook
// onder de openingen en boven de pijlers), de band en de schampkant, elk tot
// onder de wegdeklaag.
const notLayer = union([
  // de zuidelijke ligger tot voorbij de dekrand
  ...WALLS.map(({ y0, y1 }, i) => band(X_WEST - 1, X_EAST + 1, i === 0 ? DECK.s - 1 : y0, y1, (x) => road(x) - LAYER - 0.1, (x) => walk(x) + ABOVE + 0.1, GUARD)),
  band(X_WEST - 1, X_EAST + 1, KERB.y0, KERB.y1, (x) => road(x) - LAYER - 0.1, (x) => road(x) + KERB.height, GUARD),
  band(X_WEST - 1, X_EAST + 1, EDGE.y0, EDGE.y1 + 1, (x) => walk(x) - LAYER - 0.1, (x) => walk(x) + EDGE.height, GUARD),
]);
const area = (polys) => union(polys.map((poly) => prism(poly, BASE - 1, 100)));
const roadCut = roadStrip.subtract(notLayer);
const walkLayer = walkStrip.subtract(notLayer);
// Grens tussen cementbeton en asfalt: de gedeelde rand van de BGT-fietspaden.
const BIKE_SPLIT = [[-200, -20], [32.93, -20], [32.92, 3.28], [32.88, 4.15], [32.72, 6.81], [32.6, 20], [-200, 20]];
const bikeConcreteCut = walkLayer.intersect(area([BIKE_SPLIT]));
const bikeAsphaltCut = walkLayer.subtract(bikeConcreteCut);
const roadway = roadCut.intersect(bridge);
const bikeConcrete = bikeConcreteCut.intersect(bridge);
const bikeAsphalt = bikeAsphaltCut.intersect(bridge);
const structure = bridge.subtract(union([roadCut, walkLayer]));
const parts = [
  ["building:maasbrug-gennep", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeAsphalt, BIKE_ASPHALT_ATTRIBUTES],
  ["road:fietspad-cementbeton", bikeConcrete, BIKE_CONCRETE_ATTRIBUTES],
];
const partition = (() => {
  const whole = bridge.volume();
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  console.log(
    "volumes (m3): brug",
    +whole.toFixed(1),
    ...parts.flatMap(([name, solid]) => [name, +solid.volume().toFixed(1)]),
    "som - brug",
    +(sum - whole).toFixed(4),
  );
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) {
    if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
    if (solid.isEmpty()) throw new Error(`${name}: leeg`);
  }
  return { bridgeM3: +whole.toFixed(1), diffM3: +(sum - whole).toFixed(4) };
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
    meshes.push({
      name,
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
    // PDOK-attributen (zoals bij de BGT-wegdelen) voor de kleurregels.
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
const report = { trusses: trussStats, partition };
for (const [name, solid, attributes] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    ...(attributes ? { attributes } : {}),
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRangeNap: [+(bb.min[2] + WATER_NAP).toFixed(2), +(bb.max[2] + WATER_NAP).toFixed(2)],
  };
}
const glbFile = path.join(outDir, "maasbrug-gennep.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-maasbrug-gennep.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `maasbrug-gennep-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Maasbrug Gennep 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
{
  const bb = printSolid.boundingBox();
  report.stl = {
    file: path.join(outDir, stlName),
    status: printSolid.status(),
    genus: printSolid.genus(),
    components: printSolid.decompose().length,
    triangles,
    printFootM3: Math.round(printFoot.volume()),
    volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
    sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
  };
}

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten op het
// water van de Maas aan beide kanten van de brug (20 m ten zuiden en 14 m ten
// noorden van de as), in het middelste veld en in de velden ernaast.
const samplePoints = [-15, 12, 60].flatMap((x) => [
  [x, -20],
  [x, 14],
]);
await writeFile(
  path.join(outDir, "maasbrug-gennep.json"),
  JSON.stringify(
    {
      name: "Maasbrug bij Gennep",
      file: "maasbrug-gennep.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het midden van de brug (midden tussen de uiteinden van de vakwerken) op de as tussen de twee liggers op de waterspiegel van de Maas (z = 0, NAP +8,13 m) in de oorsprong, +X langs de brug naar het oosten (Gennep, RD-richting 6,27 graden vanaf het oosten) en +Y naar het noorden (stroomafwaarts). Vier nodes. road:rijbaan, road:fietspad en road:fietspad-cementbeton: de bovenste 0,5 m van het dek binnen de actuele BGT-wegdelen op de brug (rijbaan regionale weg in asfalt tussen de liggers; fietspad buiten de noordelijke ligger, in cementbeton op het Brabantse deel tot x = 32,7 en in asfalt op het Limburgse deel), buiten de liggers, de band en de schampkant, met de BGT-attributen in extras.attributes, zodat de kleurregels van een thema erop werken. building:maasbrug-gennep: de rest van de verkeersbrug van 1955: het dek van 11,6 m breed van x = -157,03 tot 158,02 met de rijbaan op NAP +20,24 m in het midden en +19,45 m bij de landhoofden, de band van 0,4 m tegen de noordelijke ligger en het fietspad 0,17 m hoger op een uitkraging met een schampkant langs de rand; vijf losse vakwerkliggers van circa 62 m met evenwijdige randen 5,1 m boven de rijbaan (NAP +25,3 m in het midden), schuine eindstijlen en acht vakken Warren zonder verticalen, als dichte platen van 1,0 m op y = ±4,05 met doorgaande driehoekige openingen met een spitse top van 52 graden en blinde nissen voor de driehoeken met een vlakke bovenkant; de vier gemetselde pijlers van de spoorbrug van 1873 (x = -93,3, -30,6, 32,1 en 94,8) met ronde koppen, een kraag en het zuidelijke deel naast het dek met de oude oplegblokken (NAP +17,6 tot +18,0 m, blokken 0,6 m hoger), met een betonnen oplegging onder het dek; de landhoofden tot onder het dek. Leuningen, lantaarns, het windverband en de eindportalen boven de rijbaan (horizontaal vrij over 7,1 m, op 1:1000 niet zonder steun dwars over de rijbaan te printen) en de dwarsdragers en consoles onder het dek zijn weggelaten; de export vult onder het dek op, de STL heeft een printvoet. Het maaiveld wordt op het water naast de brug bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(X_EAST - X_WEST).toFixed(2),
        deckWidthM: +(DECK.n - DECK.s).toFixed(2),
        trussLinesM: [-4.05, 4.05],
        trussAboveRoadM: TRUSS.top,
        trussTopNapM: +(road(0) + TRUSS.top + WATER_NAP).toFixed(2),
        spans: trussStats.map(({ lengthM, panelM }) => ({ lengthM, panelM })),
        piersX: PIER_X,
        pierTopNapM: PIERS.map(({ top }) => top),
        roadNapM: { middle: +(road(0) + WATER_NAP).toFixed(2), abutments: +(road(X_WEST) + WATER_NAP).toFixed(2) },
        bikeAboveRoadM: DECK.curb,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Maasbrug_bij_Gennep",
        "PDOK BGT overbruggingsdeel (dek, landhoofd, pijlers), wegdeel en ondersteunend wegdeel (rijbaan, fietspaden, strook met band en ligger), EPSG:28992",
        "PDOK AHN DSM en DTM 0,5 m via WCS voor wegdek, fietspad, vakwerklijnen, bovenrand, uiteinden van de vakwerken, pijlers en oplegblokken",
        "PDOK luchtfoto (Actueel_orthoHR) voor het windverband, de losse overspanningen en de pijlers",
        "Wikimedia Commons: Bridgegennepbrabant.jpg, Bridgegenneplimburg.jpg, Gennep brug N264.jpg, Oeffelt Rijksmonument 518572 brugpijlers Maasbrug.JPG, Oeffelt, RM 518573 brugkazemat noord, positie ten opzichte van de brug.JPG, Opening nieuwe brug over Maas bij Gennep, Bestanddeelnr 907-1390.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

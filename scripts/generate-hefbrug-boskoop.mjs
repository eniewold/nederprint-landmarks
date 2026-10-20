// Genereert een vereenvoudigd, gesloten 3D-model van de Hefbrug Boskoop
// (rijksmonument 512076): de geklonken stalen hefbrug uit 1935-1936 van De
// Vries Robbé over de Gouwe in Boskoop, met de weg Reijerskoop (N455) erover.
// Twee taps toelopende heftorens van open vakwerk op de landhoofden, het val
// (hefdeel, twee vakwerkhoofdliggers met een bovenwindverband en voetpaden
// buiten de liggers sinds 1990) in de laagste stand ertussen, de kabelwielen
// en contragewichten bovenin de torens, de twee landhoofden met aan de
// westkant de lage doorgang (het viaduct) voor de kade-weg, en het veelhoekige
// brugwachtershuisje aan de zuidkant tegen de oostelijke oever. Alle maten in
// het script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog,
// per onderdeel een node met de materiaalklasse in de nodenaam: de constructie
// en de rijbaan en de voetpaden met BGT-attributen) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal> met
// printvormen. De brug is 55 m lang en past op 1:1000 in 55 mm.
//
//   node scripts/generate-hefbrug-boskoop.mjs              # 1:1000 (standaard)
//   node scripts/generate-hefbrug-boskoop.mjs --scale 500
//
// Assenstelsel: oorsprong op de as van de weg midden tussen de twee heftorens
// (RD 105158,52, 454245,78), op de waterspiegel van de Gouwe zoals het
// PDOK-terrein die legt (ellipsoïdisch 43,15 m; met de geoïdehoogte van
// 43,46 m (NLGEO2018) is dat NAP -0,31 m). Z omhoog. +X loopt langs de brug
// naar het oosten (Boskoop-oost, RD-richting -3,90 graden vanaf het oosten),
// +Y naar het noorden.
//
// Bronnen: Rijksmonumentenregister 512076 (opbouw, doorvaartwijdte 25 m,
// breedte tussen de leuningen 9 m, doorvaarthoogte gesloten 2,5 m en open
// 35 m, het veelhoekige betonnen brugwachtershuisje met koperen dak aan de
// zuidzijde tegen de oostelijke oever, het viaduct op de westelijke oever);
// Wikipedia (Hefbrug Boskoop: gebouwd 1935-1936, val van 100 ton, in 1990
// verbreed met twee voetpaden, hefhoogtes 12, 24 en 34 m); BGT overbruggingsdeel
// (het beweegbare dek, de dekken en landhoofden), wegdeel (rijbaan en
// voetpaden op het dek met hun attributen, de lokale weg door het viaduct) en
// pand (het brugwachtershuisje); AHN DSM 0,5 m (PDOK WCS) voor het wegdek
// (NAP +2,72 m op het val, aflopend naar +2,35 m aan de westkant), de
// voetpaden op het val (+2,35 m), de bovenrand van de hoofdliggers (+7,22 m),
// de liggerlijnen (4,6 m naast de as), de torens (binnenkant, schuine
// buitenpoot, kop tot circa +42 m, kabelwielen tot +43,5 m); PDOK-terrein voor
// de waterspiegel; 3D BAG voor het dak van het brugwachtershuisje (+7,07 tot
// +7,36 m); Wikimedia Commons-foto's (zie de JSON) voor het vakwerk van torens
// en val, het bovenwindverband, de kabelwielen, de contragewichten en het
// huisje.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SLUG = "hefbrug-boskoop";
const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), SLUG);
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const rad = (deg) => (deg * Math.PI) / 180;
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const polyArea = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area / 2;
};
const ccw = (pts) => (polyArea(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (x, y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Polygoon in het YZ-vlak (dwarsdoorsnede), uitgetrokken langs X van x0 tot x1.
const profileX = (points, x0, x1) =>
  Manifold.extrude([ccw(points)], x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, 0]);
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in, y naar rechts en z omhoog, steeds evenveel punten).
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
// Driehoek naar binnen verschoven over d (schalen rond het middelpunt van de
// ingeschreven cirkel); null als er dan minder dan `min` straal overblijft.
function insetTriangle(tri, d, min = 0.3) {
  const [a, b, c] = tri;
  const len = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const la = len(b, c);
  const lb = len(c, a);
  const lc = len(a, b);
  const per = la + lb + lc;
  const inc = [(la * a[0] + lb * b[0] + lc * c[0]) / per, (la * a[1] + lb * b[1] + lc * c[1]) / per];
  const area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2;
  const r = (2 * area) / per;
  if (r - d < min) return null;
  const k = (r - d) / r;
  return tri.map(([x, z]) => [inc[0] + (x - inc[0]) * k, inc[1] + (z - inc[1]) * k]);
}
// Een opening (driehoek in een verticaal vlak) print zonder steun als elke
// zijde waar de opening onder ligt (het plafond) minstens 50 graden steil is.
function printableOpening(tri) {
  for (let i = 0; i < 3; i++) {
    const p = tri[i];
    const q = tri[(i + 1) % 3];
    const r = tri[(i + 2) % 3];
    const dx = q[0] - p[0];
    if (Math.abs(dx) < 1e-9) continue; // verticale zijde
    const zLine = p[1] + ((r[0] - p[0]) / dx) * (q[1] - p[1]);
    if (r[1] >= zLine - 1e-9) continue; // de opening ligt boven deze zijde
    const slope = (Math.atan2(Math.abs(q[1] - p[1]), Math.abs(dx)) * 180) / Math.PI;
    if (slope < 50) return false;
  }
  return true;
}
// Staaf in plattegrond: rechthoek van breedte w rond het lijnstuk p-q.
function planBar(p, q, w, z0, z1) {
  const dx = q[0] - p[0];
  const dy = q[1] - p[1];
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * (w / 2);
  const ny = (dx / len) * (w / 2);
  return prism(
    [
      [p[0] + nx, p[1] + ny],
      [q[0] + nx, q[1] + ny],
      [q[0] - nx, q[1] - ny],
      [p[0] - nx, p[1] - ny],
    ],
    z0,
    z1,
  );
}
// Staaf in 3D met een vierkante doorsnede van w: n is de richting van één
// zijvlak (loodrecht op de staaf, bijvoorbeeld de normaal van het vlak waarin
// de staaf ligt).
const sub = (a, b) => a.map((c, i) => c - b[i]);
const crossV = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => {
  const l = Math.hypot(...a);
  return a.map((c) => c / l);
};
function bar3(p, q, n, w) {
  const d = unit(sub(q, p));
  const e1 = unit(n);
  const e2 = unit(crossV(d, e1));
  const pts = [];
  for (const end of [p, q]) {
    for (const s1 of [-1, 1]) {
      for (const s2 of [-1, 1]) {
        pts.push(end.map((c, i) => c + (s1 * e1[i] * w) / 2 + (s2 * e2[i] * w) / 2));
      }
    }
  }
  return Manifold.hull(pts);
}
const interp = (table, x) => {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 0; i + 1 < table.length; i++) {
    const [x0, y0] = table[i];
    const [x1, y1] = table[i + 1];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return table[table.length - 1][1];
};
// Regelmatige veelhoek (n zijden, apothema a) rond (cx, cy), met een zijde
// loodrecht op de X-as.
const ngon = (cx, cy, apothem, n) => {
  const r = apothem / Math.cos(Math.PI / n);
  return Array.from({ length: n }, (_, i) => {
    const t = (2 * Math.PI * (i + 0.5)) / n;
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)];
  });
};

// ---------- hoogtes ----------
// Het PDOK-terrein legt de Gouwe op ellipsoïdisch 43,12 tot 43,17 m; met de
// geoïdehoogte van 43,46 m (NLGEO2018) is dat NAP -0,31 m. Dat is z = 0.
const WATER_NAP = -0.31;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
const GROUND_HEIGHT = 43.12; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten

// Wegdek in NAP-meters langs de as (AHN-DSM, 20e percentiel over 6 m rond de
// as per meter): vlak op het val, aflopend naar de opritten.
const ROAD_NAP = [
  [-30.0, 2.33],
  [-29.5, 2.35],
  [-27.5, 2.42],
  [-25.5, 2.48],
  [-21.5, 2.57],
  [-17.5, 2.66],
  [-14.5, 2.7],
  [-12.55, 2.72],
  [12.55, 2.72],
  [15.5, 2.7],
  [21.5, 2.64],
  [24.5, 2.58],
  [26.0, 2.53],
];
const road = (u) => Z(interp(ROAD_NAP, u));

// ---------- indeling langs de brug ----------
// BGT: het dek van het westelijke landhoofd begint op x = -29,39 (de kop van
// de oprit), het oostelijke landhoofd eindigt op x = 25,48.
const WEST_END = -29.39;
const EAST_END = 25.48;

// Val (hefdeel): 25,0 m lang tussen landhoofden die 25,1 m uit elkaar staan
// (register: doorvaartwijdte 25 m; BGT-voegen op x = -12,55 en 13,45, de
// foto's en het AHN zetten het val en de torens symmetrisch rond x = 0, het
// AHN de torens circa 0,45 m westelijker dan de BGT het val). Rijdek van 8,3 m tussen de
// hoofdliggers (register: 9 m tussen de leuningen; BGT-rijbaan 9,0 m), de
// liggers 0,9 m breed met het hart 4,6 m naast de as (AHN), voetpaden buiten
// de liggers tot 6,9 m naast de as in het midden en 7,7 m bij de einden (BGT),
// 0,37 m lager dan de rijbaan (AHN). De onderkant van het val ligt op NAP
// +1,90 m: doorvaarthoogte 2,5 m boven het boezempeil van NAP -0,61 m
// (register).
const VAL = {
  half: 12.5,
  core: 4.15,
  truss: 5.05,
  bottomNap: 1.9,
  roadNap: 2.72,
  footNap: 2.35,
  topNap: 7.22,
  bar: 0.9,
  chordAbove: 0.6,
  panels: 6,
  endPost: 12.05,
};
// De koppen van de landhoofden op x = ±12,55, met een voeg van 5 cm naar het
// val; het val ligt op opleggingen die 0,3 m in de landhoofden doorlopen.
const LAND = 12.55;
const JOINT = (VAL.half + LAND) / 2; // hart van de voeg
const valEdge = (u) => {
  const a = Math.abs(u);
  if (a <= 6.85) return 6.9;
  return 6.9 + ((Math.min(a, VAL.half) - 6.85) / (VAL.half - 6.85)) * 0.8;
};

// Heftorens (foto's, AHN): per toren twee zijvlakken van vakwerk (hart 5,6 m
// naast de as, 0,9 m dik, AHN), elk met een verticale binnenpoot op de rand
// van het landhoofd (x = ±12,6 tot ±13,5), een tweede verticaal 2,75 m verder
// (de schacht waarin het contragewicht loopt) en een schuine buitenpoot van
// x = ±24,3 op het dek naar x = ±16,4 bovenin (AHN: de buitenste DSM-cellen
// per 2 m hoogte, schuin onder circa 12 graden); zes vakken van 6,48 m hoog
// met horizontale regels, in de schacht één diagonaal per vak, daarbuiten
// kruisen waar het vak breed genoeg is. De
// kop met het machinebordes tot NAP +41,6 m (AHN, register: torens van meer
// dan dertig meter; het val gaat 32,5 m omhoog), met twee kabelwielen van
// 2,2 m boven de hoofdliggers tot +43,4 m. Tussen de zijvlakken regels op de
// tweede verticaal en op de buitenpoot, en in het vlak van de buitenpoten
// kruisen vanaf het eerste niveau boven de weg en een bok onder de kop. De
// binnenkant (naar het val) is open tot de kop, want daar gaat het val omhoog.
// Het contragewicht hangt in gesloten stand bovenin de schacht (foto's: NAP
// +33,7 tot +36,2 m) over de hele breedte tussen de zijvlakken.
const TOWER = {
  inner: 12.6,
  leg: 0.9,
  shaft: 15.8, // hart tweede verticaal
  baseOuter: 24.3,
  topOuter: 16.4,
  frame: [5.15, 6.05],
  topNap: 41.6,
  platform: 0.9,
  levels: 6,
};
const WHEEL = { r: 1.1, u: 13.2, zNap: 42.3 };
const WEIGHT = { u0: 13.55, u1: 15.3, v: 5.2, z0Nap: 33.7, z1Nap: 36.2 };

// Brugwachtershuisje (BGT-pand 0499100002021238, foto's, 3D BAG): een
// twaalfhoek van 4,46 m tussen de zijden (BGT) rond (15,69, -10,12), van het
// water tot NAP +6,3 m, met een raamband (NAP +4,4 tot +6,0 m) als nis van
// 0,3 m, een kroonlijst die onder 50 graden 0,5 m uitkraagt, een rand tot
// +7,05 m en een plat kegeldak tot +7,36 m (3D BAG).
const HOUSE = { cx: 15.69, cy: -10.12, apothem: 2.23, sides: 12, bodyNap: 6.3, window: [4.4, 6.0], niche: 0.3, flare: 0.5, flareRise: 0.6, rimNap: 7.05, roofNap: 7.36 };

// Doorgang onder het westelijke dek (register: viaduct op de westelijke oever
// met een heel flauw tudorgewelf; BGT-wegdeel G0484.2e036f59, lokale weg op
// maaiveld, x = -29,0 tot -25,5): 3,0 m breed tussen een kopmuur van 0,9 m
// onder de kop van het dek en het landhoofd, met het gewelf van NAP +1,40 m
// op de zijkanten tot +1,80 m in het midden (geschat: het AHN ziet er niet
// onder).
const PASSAGE = { u0: -28.5, u1: -25.5, springNap: 1.4, apexNap: 1.8 };

// Plattegrond van de landhoofden (BGT-dek in lokale coördinaten, de kop naar
// het val op x = ±12,55). Het oostelijke landhoofd loopt aan de zuidkant tot
// in het brugwachtershuisje en heeft daarnaast een bordes (BGT).
const WEST_POLY = [
  [-29.39, -7.04],
  [-28.85, -7.03],
  [-26.17, -7.71],
  [-26.16, -8.97],
  [-23.68, -8.98],
  [-23.68, -7.78],
  [-13.53, -7.81],
  [-12.55, -7.7],
  [-12.55, 7.7],
  [-13.51, 7.8],
  [-23.65, 7.78],
  [-23.68, 8.98],
  [-26.16, 8.99],
  [-26.13, 7.72],
  [-29.02, 6.5],
  [-29.39, 6.5], // BGT -29,33: de kop haaks op de as
];
const EAST_POLY = [
  [12.55, -7.84],
  [13.6, -7.84],
  [13.6, -8.2],
  [17.8, -8.2],
  [17.8, -10.72],
  [19.17, -10.72],
  [19.17, -7.87],
  [23.69, -7.88],
  [23.69, -9.05],
  [25.48, -9.06],
  [25.48, 8.95],
  [23.69, 8.94],
  [23.68, 7.77],
  [12.55, 7.78],
];

// ---------- landhoofden ----------
// Stations op de knikken van het lengteprofiel: tussen twee knikken is het
// wegdek een plat vlak.
const roadStations = (x0, x1) =>
  [x0, x1, ...ROAD_NAP.map(([x]) => x).filter((x) => x > x0 + 0.05 && x < x1 - 0.05)].sort((a, b) => a - b);
const roadSlab = (x0, x1, below, above, half = 15) =>
  loftX(
    roadStations(x0, x1).map((x) => ({
      x,
      section: [[-half, road(x) - below], [half, road(x) - below], [half, road(x) + above], [-half, road(x) + above]],
    })),
  );
const westBody = prism(WEST_POLY, BASE, 10).intersect(roadSlab(WEST_END - 1, -LAND + 0.01, road(0) - BASE + 1, 0));
const eastBody = prism(EAST_POLY, BASE, 10).intersect(roadSlab(LAND - 0.01, EAST_END + 1, road(0) - BASE + 1, 0));
// Gewelf van de doorgang (vier middelpunten benaderd), dwars door het dek.
const passageVault = profileY(
  [
    [PASSAGE.u0, BASE - 1],
    [PASSAGE.u1, BASE - 1],
    [PASSAGE.u1, Z(PASSAGE.springNap)],
    [PASSAGE.u1 - 0.2, Z(PASSAGE.springNap) + 0.18],
    [PASSAGE.u1 - 0.6, Z(PASSAGE.springNap) + 0.32],
    [(PASSAGE.u0 + PASSAGE.u1) / 2, Z(PASSAGE.apexNap)],
    [PASSAGE.u0 + 0.6, Z(PASSAGE.springNap) + 0.32],
    [PASSAGE.u0 + 0.2, Z(PASSAGE.springNap) + 0.18],
    [PASSAGE.u0, Z(PASSAGE.springNap)],
  ],
  -12,
  12,
);

// ---------- val ----------
const valDeck = boxFromTo(-VAL.half, VAL.half, -VAL.core - 0.01, VAL.core + 0.01, Z(VAL.bottomNap), Z(VAL.roadNap));
const footPoly = (side) =>
  [
    [-VAL.half, VAL.truss - 0.01],
    [VAL.half, VAL.truss - 0.01],
    [VAL.half, valEdge(VAL.half)],
    [6.85, valEdge(6.85)],
    [-6.85, valEdge(-6.85)],
    [-VAL.half, valEdge(-VAL.half)],
  ].map(([x, y]) => [x, side * y]);
const valFoot = [-1, 1].map((side) => prism(footPoly(side), Z(VAL.bottomNap), Z(VAL.footNap)));
// Opleggingen: een blok van 0,4 m dat het val 0,3 m in elk landhoofd laat
// doorlopen, onder de wegdeklaag, zodat val en landhoofd elkaar met een volume
// raken en niet alleen met een vlak.
const valBearings = [-1, 1].map((s) =>
  boxFromTo(s * (VAL.half - 0.1), s * (LAND + 0.3), -7.5, 7.5, Z(VAL.bottomNap) + 0.05, Z(VAL.roadNap) - 0.6),
);

// Hoofdliggers: een plaat van 0,9 m dik van de onderkant van het val tot de
// bovenrand (AHN NAP +7,22 m), met verticale eindstijlen (foto's), een
// onderrand tot 0,6 m boven het wegdek en een bovenrand van 0,9 m; zes vakken
// van 4,03 m met stijlen op alle knopen en diagonalen als W (onderknopen op
// de einden en op de 2e en 4e knoop, bovenknopen op de 1e, 3e en 5e). Alle
// vakwerkdriehoeken zijn doorgaande openingen; in de STL zijn het blinde
// nissen van 0,35 m aan de buitenkant.
const panelX = Array.from({ length: VAL.panels + 1 }, (_, k) => -VAL.endPost + (k * 2 * VAL.endPost) / VAL.panels);
const zb = Z(VAL.roadNap) + VAL.chordAbove - VAL.bar / 2;
const zt = Z(VAL.topNap) - VAL.bar / 2;
const trussTris = [];
for (let k = 0; k < VAL.panels; k++) {
  const a = panelX[k];
  const b = panelX[k + 1];
  if (k % 2 === 0) {
    // diagonaal van onder links naar boven rechts
    trussTris.push([[a, zb], [b, zb], [b, zt]], [[a, zb], [b, zt], [a, zt]]);
  } else {
    trussTris.push([[a, zb], [b, zb], [a, zt]], [[a, zt], [b, zb], [b, zt]]);
  }
}
const trussHoles = trussTris.map((t) => insetTriangle(t, VAL.bar / 2)).filter(Boolean);
const trussOutline = [
  [-VAL.half, Z(VAL.bottomNap)],
  [VAL.half, Z(VAL.bottomNap)],
  [VAL.half, Z(VAL.topNap)],
  [-VAL.half, Z(VAL.topNap)],
];
const trusses = [];
const printTrusses = [];
for (const side of [-1, 1]) {
  const y0 = side > 0 ? VAL.core : -VAL.truss;
  const y1 = side > 0 ? VAL.truss : -VAL.core;
  const plate = profileY(trussOutline, y0, y1);
  trusses.push(plate.subtract(union(trussHoles.map((h) => profileY(h, y0 - 0.5, y1 + 0.5)))));
  const niche = side > 0 ? [VAL.truss - 0.35, VAL.truss + 0.5] : [-VAL.truss - 0.5, -VAL.truss + 0.35];
  printTrusses.push(plate.subtract(union(trussHoles.map((h) => profileY(h, niche[0], niche[1])))));
}
// Bovenwindverband (foto's, luchtfoto): op de zeven knopen een regel tussen de
// liggers, een langsligger op de as en per vak twee schoren van de
// bovenknopen van de liggers (op de 1e, 3e en 5e regel) naar de as (op de
// einden en de 2e en 4e regel), zodat ruiten ontstaan; staven van 0,9 m op de
// hoogte van de bovenrand. Alleen in de GLB.
// (0,05 m onder de bovenkant van de liggers, zodat geen kant van een staaf
// samenvalt met een rand van een opening in de ligger)
const braceZ = [Z(VAL.topNap) - VAL.bar - 0.05, Z(VAL.topNap) - 0.05];
const trussMid = (VAL.core + VAL.truss) / 2;
const topBracing = [
  ...panelX.map((x) => boxFromTo(x - 0.5, x + 0.5, -VAL.core - 0.01, VAL.core + 0.01, ...braceZ)),
  boxFromTo(panelX[0], panelX[VAL.panels], -VAL.bar / 2, VAL.bar / 2, ...braceZ),
];
for (let k = 0; k < VAL.panels; k++) {
  const [even, odd] = k % 2 === 0 ? [panelX[k], panelX[k + 1]] : [panelX[k + 1], panelX[k]];
  for (const side of [-1, 1]) topBracing.push(planBar([even, 0], [odd, side * trussMid], VAL.bar, ...braceZ));
}

// ---------- heftorens ----------
const zTop = Z(TOWER.topNap);
function towerParts(s) {
  const zDeckIn = road(s * (TOWER.inner + TOWER.leg / 2));
  const zDeckOut = road(s * TOWER.baseOuter);
  const zBottom = Math.min(zDeckIn, zDeckOut) - 0.9;
  const outerEdge = (z) => TOWER.baseOuter + ((z - zDeckOut) * (TOWER.topOuter - TOWER.baseOuter)) / (zTop - zDeckOut);
  const tilt = Math.atan2(TOWER.baseOuter - TOWER.topOuter, zTop - zDeckOut);
  const cIn = TOWER.inner + TOWER.leg / 2;
  const cSh = TOWER.shaft;
  const cOut = (z) => outerEdge(z) - TOWER.leg / 2 / Math.cos(tilt);
  // Hartlijnen van de regels: de onderste 0,45 m onder het dek (de openingen
  // beginnen op het dek), de bovenste in het bordes.
  const z0 = zDeckIn - TOWER.leg / 2;
  const z6 = zTop - TOWER.platform / 2;
  const levels = Array.from({ length: TOWER.levels + 1 }, (_, j) => z0 + ((z6 - z0) * j) / TOWER.levels);
  // Zijvlak in (a, z), a = afstand tot de as langs de brug.
  const outline = [
    [TOWER.inner, zBottom],
    [outerEdge(zBottom), zBottom],
    [TOWER.topOuter, zTop],
    [TOWER.inner, zTop],
  ];
  const tris = [];
  for (let j = 0; j < TOWER.levels; j++) {
    const za = levels[j];
    const zc = levels[j + 1];
    // schacht: één diagonaal per vak, om en om
    if (j % 2 === 0) tris.push([[cIn, za], [cSh, za], [cSh, zc]], [[cIn, za], [cSh, zc], [cIn, zc]]);
    else tris.push([[cIn, za], [cSh, za], [cIn, zc]], [[cIn, zc], [cSh, za], [cSh, zc]]);
    // buitenvak: een kruis als het vak onderaan breder is dan 4,5 m, anders
    // één diagonaal
    const A = [cSh, za];
    const B = [cOut(za), za];
    const C = [cOut(zc), zc];
    const D = [cSh, zc];
    if (B[0] - A[0] > 4.5) {
      // snijpunt van AC en BD
      const den = (A[0] - C[0]) * (B[1] - D[1]) - (A[1] - C[1]) * (B[0] - D[0]);
      const t = ((A[0] - B[0]) * (B[1] - D[1]) - (A[1] - B[1]) * (B[0] - D[0])) / den;
      const M = [A[0] + t * (C[0] - A[0]), A[1] + t * (C[1] - A[1])];
      tris.push([A, B, M], [B, C, M], [C, D, M], [D, A, M]);
    } else if (j % 2 === 0) tris.push([A, B, C], [A, C, D]);
    else tris.push([A, B, D], [B, C, D]);
  }
  const holes = tris.map((t) => insetTriangle(t, TOWER.leg / 2)).filter(Boolean);
  const mapA = (pts) => pts.map(([a, z]) => [s * a, z]);
  const frames = [];
  const printFrames = [];
  const guards = [];
  let through = 0;
  let niches = 0;
  for (const side of [-1, 1]) {
    const [v0, v1] = side > 0 ? TOWER.frame : [-TOWER.frame[1], -TOWER.frame[0]];
    const plate = profileY(mapA(outline), v0, v1);
    frames.push(plate.subtract(union(holes.map((h) => profileY(mapA(h), v0 - 0.5, v1 + 0.5)))));
    // STL: wat zonder steun print blijft open, de rest wordt een nis van
    // 0,35 m aan de buitenkant; in de schacht staat in de STL een kern.
    const outer = side > 0 ? [v1 - 0.35, v1 + 0.5] : [v0 - 0.5, v0 + 0.35];
    const cuts = holes.map((h) => {
      const inShaft = Math.max(...h.map(([a]) => a)) < cSh + 0.5;
      const open = !inShaft && printableOpening(h);
      if (open) through++;
      else niches++;
      return open ? profileY(mapA(h), v0 - 0.5, v1 + 0.5) : profileY(mapA(h), ...outer);
    });
    printFrames.push(plate.subtract(union(cuts)));
    // Bewaking voor de wegdeklaag: een rechthoekig blok om het zijvlak, 2 cm
    // groter. Rechthoekig, zodat de grens tussen wegdeel en constructie een
    // vlak langs de assen is dat in de GLB (float32) vlak blijft; schuine
    // grensvlakken gaven na het afronden spleetjes die de export bij het
    // opvullen een stuk wegdek lieten verliezen.
    guards.push(boxFromTo(s * (TOWER.inner - 0.02), s * (outerEdge(zBottom) + 0.02), v0 - 0.02, v1 + 0.02, zBottom - 0.02, zTop + 0.02));
  }
  const vMid = (TOWER.frame[0] + TOWER.frame[1]) / 2;
  // Kop: machinebordes over de hele kop, de twee kabelwielen erop.
  // (5 cm binnen de omtrek van de zijvlakken, zodat geen hoek samenvalt)
  const platform = boxFromTo(s * (TOWER.inner + 0.05), s * (TOWER.topOuter - 0.05), -TOWER.frame[1] + 0.05, TOWER.frame[1] - 0.05, zTop - TOWER.platform, zTop);
  const wheels = [-1, 1].map((side) =>
    Manifold.cylinder(VAL.truss - VAL.core, WHEEL.r, WHEEL.r, 32, false)
      .rotate([90, 0, 0])
      .translate([s * WHEEL.u, side > 0 ? VAL.truss : -VAL.core, Z(WHEEL.zNap)]),
  );
  const weight = boxFromTo(s * WEIGHT.u0, s * WEIGHT.u1, -WEIGHT.v, WEIGHT.v, Z(WEIGHT.z0Nap), Z(WEIGHT.z1Nap));
  // Dwarsverband (alleen GLB): regels tussen de zijvlakken op de tweede
  // verticaal en op de buitenpoot vanaf het eerste niveau, kruisen in het vlak
  // van de buitenpoten en een bok onder de kop.
  const ties = [];
  // De regels zijn 1,0 × 1,0 m en lopen tot 0,15 m voorbij het hart van de
  // zijvlakken, zodat geen kant samenvalt met een rand van een opening of
  // met het eind van een schoor.
  const tie = 0.5;
  const vTie = vMid + 0.3;
  for (let j = 1; j < TOWER.levels; j++) {
    const z = levels[j];
    ties.push(boxFromTo(s * (cSh - tie), s * (cSh + tie), -vTie, vTie, z - tie, z + tie));
    ties.push(boxFromTo(s * (cOut(z) - tie), s * (cOut(z) + tie), -vTie, vTie, z - tie, z + tie));
  }
  const planeNormal = unit([Math.cos(tilt) * s, 0, Math.sin(tilt)]);
  for (let j = 1; j < TOWER.levels; j++) {
    const za = levels[j];
    const zc = levels[j + 1];
    const P = (z, v) => [s * cOut(z), v, z];
    if (j < TOWER.levels - 1) {
      ties.push(bar3(P(za, -vMid), P(zc, vMid), planeNormal, 1.0));
      ties.push(bar3(P(za, vMid), P(zc, -vMid), planeNormal, 1.0));
    } else {
      ties.push(bar3(P(za, -vMid), P(zc, 0), planeNormal, 1.0));
      ties.push(bar3(P(za, vMid), P(zc, 0), planeNormal, 1.0));
    }
  }
  // STL: kern in de schacht tussen de zijvlakken, met een spitse doorgang
  // (zijden van 55 graden) over de weg en een console van 45 graden onder het
  // bordes buiten de schacht.
  const coreBottom = zDeckIn - 0.3;
  const core = boxFromTo(s * TOWER.inner, s * (cSh + TOWER.leg / 2), -TOWER.frame[0] - 0.01, TOWER.frame[0] + 0.01, coreBottom, zTop - TOWER.platform + 0.01);
  const portalHalf = 4.45;
  const shoulder = zDeckIn + 3.6;
  const portal = profileX(
    [
      [-portalHalf, coreBottom - 1],
      [portalHalf, coreBottom - 1],
      [portalHalf, shoulder],
      [0, shoulder + portalHalf * Math.tan(rad(55))],
      [-portalHalf, shoulder],
    ],
    Math.min(s * TOWER.inner, s * (cSh + 1)) - 0.5,
    Math.max(s * TOWER.inner, s * (cSh + 1)) + 0.5,
  );
  const corbelW = TOWER.topOuter - (cSh + TOWER.leg / 2);
  const corbel = Manifold.hull([
    boxFromTo(s * (cSh + TOWER.leg / 2 - 0.01), s * (cSh + TOWER.leg / 2), -TOWER.frame[0] - 0.01, TOWER.frame[0] + 0.01, zTop - TOWER.platform - corbelW * Math.tan(rad(50)), zTop - TOWER.platform + 0.01),
    boxFromTo(s * (cSh + TOWER.leg / 2), s * TOWER.topOuter, -TOWER.frame[0] - 0.01, TOWER.frame[0] + 0.01, zTop - TOWER.platform, zTop - TOWER.platform + 0.01),
  ]);
  const printCore = union([core.subtract(portal), corbel]);
  return { frames, printFrames, guards, platform, wheels, weight, ties, printCore, levels, through, niches, cIn, cSh, cOut };
}
const towerW = towerParts(-1);
const towerE = towerParts(1);

// ---------- brugwachtershuisje ----------
const hPoly = (apothem) => ngon(HOUSE.cx, HOUSE.cy, apothem, HOUSE.sides);
const houseBody = union([
  prism(hPoly(HOUSE.apothem), BASE, Z(HOUSE.window[0])),
  prism(hPoly(HOUSE.apothem - HOUSE.niche), Z(HOUSE.window[0]) - 0.01, Z(HOUSE.window[1]) + 0.01),
  prism(hPoly(HOUSE.apothem), Z(HOUSE.window[1]), Z(HOUSE.bodyNap)),
]);
const thinPrism = (apothem, z) => prism(hPoly(apothem), z, z + 0.01);
const house = union([
  houseBody,
  Manifold.hull([thinPrism(HOUSE.apothem, Z(HOUSE.bodyNap) - 0.01), thinPrism(HOUSE.apothem + HOUSE.flare, Z(HOUSE.bodyNap) + HOUSE.flareRise - 0.01)]),
  prism(hPoly(HOUSE.apothem + HOUSE.flare), Z(HOUSE.bodyNap) + HOUSE.flareRise - 0.02, Z(HOUSE.rimNap)),
  Manifold.hull([thinPrism(HOUSE.apothem + HOUSE.flare, Z(HOUSE.rimNap) - 0.01), thinPrism(1.6, Z(HOUSE.roofNap) - 0.01)]),
]);

// ---------- samenstellen ----------
const common = [westBody, eastBody, valDeck, ...valFoot, ...valBearings, house];
for (const t of [towerW, towerE]) common.push(t.platform, ...t.wheels, t.weight);
const bridge = union([
  ...common,
  ...trusses,
  ...topBracing,
  ...towerW.frames,
  ...towerE.frames,
  ...towerW.ties,
  ...towerE.ties,
]).subtract(passageVault);
const printBridge = union([
  ...common,
  ...printTrusses,
  ...towerW.printFrames,
  ...towerE.printFrames,
  towerW.printCore,
  towerE.printCore,
]);

// ---------- printvoet (alleen in de STL) ----------
// Het val hangt tussen de landhoofden vrij boven het water. Net als de
// overhangopvulling van de export krijgt de STL daaronder een wig van 50
// graden vanaf de dekrand; het val ligt zo laag (3,0 m boven de onderkant)
// dat de wig als trapezium op de onderplaat uitkomt.
const KNEE = rad(50);
const footXs = [...stationsX(-VAL.half, VAL.half, 1), -6.85, 6.85].sort((a, b) => a - b).filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-4);
const printFoot = loftX(
  footXs.map((x) => {
    const w = valEdge(x) + 0.02;
    const zBot = Z(VAL.bottomNap) - 0.02;
    const zIn = Z(VAL.bottomNap) + 0.2;
    const a = Math.max(0.45, w - (zBot - BASE) / Math.tan(KNEE));
    return { x, section: [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zBot], [w, zIn], [-w, zIn], [-w, zBot], [-a - 1e-3, BASE + 1e-3]] };
  }),
);
const printModel = union([printBridge, printFoot]);

// ---------- controles ----------
function overhangs(solid, classify) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const buckets = {};
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = crossV(e1, e2);
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    const key = classify(p.reduce((m, q) => m.map((c, i) => c + q[i] / 3), [0, 0, 0]));
    buckets[key] = (buckets[key] ?? 0) + len / 2;
  }
  return { area: +area.toFixed(2), buckets: Object.fromEntries(Object.entries(buckets).map(([k, a]) => [k, +a.toFixed(2)])) };
}
const classify = ([x, y, z]) => {
  const ax = Math.abs(x);
  const ay = Math.abs(y);
  if (Math.hypot(x - HOUSE.cx, y - HOUSE.cy) < HOUSE.apothem + 1) return "huisje (raamband, kroonlijst)";
  if (ax <= VAL.half + 0.01) {
    if (z < Z(VAL.roadNap) + 0.01) return "onderkant val";
    if (ay >= VAL.core - 0.05 && ay <= VAL.truss + 0.6) return "openingen hoofdliggers";
    if (z > Z(VAL.topNap) - VAL.bar - 0.1) return "bovenwindverband";
  }
  if (ax > VAL.half - 0.01 && ax < LAND + 0.01 && z < Z(VAL.roadNap)) return "opleggingen in de voeg";
  if (x > PASSAGE.u0 - 0.01 && x < PASSAGE.u1 + 0.01 && z < Z(PASSAGE.apexNap) + 0.01) return "gewelf doorgang";
  if (ax > TOWER.inner - 0.1) {
    if (ay >= TOWER.frame[0] - 0.05 && ay <= TOWER.frame[1] + 0.05) return "openingen torens";
    if (z > Z(WHEEL.zNap) - WHEEL.r - 0.1 && ay < VAL.truss + 0.1 && ay > VAL.core - 0.1) return "kabelwielen";
    if (z > Z(WEIGHT.z0Nap) - 0.05 && z < Z(WEIGHT.z1Nap) && ax > WEIGHT.u0 - 0.05 && ax < WEIGHT.u1 + 0.05) return "contragewicht";
    if (z > zTop - TOWER.platform - 0.05) return "bordes kop";
    return "dwarsverband torens";
  }
  return `overig x ${x.toFixed(1)} y ${y.toFixed(1)} z ${z.toFixed(1)}`;
};
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
const modelOverhang = overhangs(bridge, classify);
const printOverhang = overhangs(printModel, classify);
console.log("vrij hangend in het model (m2):", modelOverhang);
console.log("overhang in de printversie (m2):", printOverhang);
{
  const bad = Object.entries(printOverhang.buckets).filter(([k, a]) => (k.startsWith("overig") || k.startsWith("onderkant") || k === "dwarsverband torens" || k === "bovenwindverband") && a > 0.5);
  if (bad.length) throw new Error(`printversie heeft overhang: ${bad.map(([k, a]) => `${k} (${a} m2)`).join(", ")}`);
}

// ---------- rijbaan en voetpaden als eigen onderdelen ----------
// Pas na de brug en de printversie als geheel (hierboven uitgerekend). De
// bovenste 0,5 m van het dek is per BGT-wegdeel een eigen node met de
// attributen van het BGT-wegdeel eronder (glTF `extras.attributes`), zodat de
// kleurregels van een thema op het brugdek werken zoals op de PDOK-wegdelen
// ernaast. Op het dek liggen tien actuele BGT-wegdelen met relatieve
// hoogteligging 1: op het val de rijbaan P0028.0da21e8abb3443ebbd619e0f7776f163
// (rijbaan regionale weg, gesloten verharding, asfalt) en de voetpaden
// P0028.b7f5a29853624be19cecdd2ef814955c (zuid) en
// P0028.1b9136d90ac844c6a4c884b0239ad2c0 (noord), op de landhoofden de
// rijbanen P0028.eb6bd6c5852a4bbe906ddee27eb33717 (west) en
// P0028.4e2dc2d8038241779557f5aebd803730 (oost) van cementbeton en de
// voetpaden P0028.5a35462518db42068f36335818c0138f,
// P0028.810fc9896bdf414c9907e132e6babe70, P0028.5f13196bb3674178beb74782eacd4f65,
// P0028.d5b1939abbba4cdf9b02c62bcc66cfbc en
// P0028.f8784e1a1d634a5386ff0891b59102d2 (alle voetpaden gesloten verharding,
// asfalt). De grens tussen asfalt en cementbeton ligt in het model op de kop
// van het val (de voeg op x = ±12,525; BGT -12,55 en 13,45).
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const CONCRETE_ATTRIBUTES = { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "cementbeton" };
const FOOT_ATTRIBUTES = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
// BGT-rijbanen van cementbeton op de landhoofden: in lokale coördinaten
// tussen y = -4,49 en 4,48 (west, naar de kop van de oprit versmallend tot
// -3,74 en 4,25) en tussen -4,46 en 4,42 (oost). In het model een rechthoek
// tussen y = ±4,45 van de voeg tot 0,5 m voorbij de koppen, met grenzen langs
// de assen (zie de bewaking van de torens).
const CONCRETE = { half: 4.45, west: WEST_END - 0.5, east: EAST_END + 0.5 };
// Snijstrook van 0,5 m onder tot 1 m boven het dek: over de landhoofden op het
// wegdek (de voetpaden liggen daar op dezelfde hoogte), op het val tussen de
// liggers op de rijbaan en daarbuiten op de voetpaden. Aan de opritzijden loopt
// hij 0,5 m voorbij de brug, zodat zijn kopvlak niet op dat van de brug valt.
// Op de landhoofden is de onderkant van de strook per stuk tussen twee
// knikken van het lengteprofiel horizontaal (0,5 m onder het laagste punt van
// dat stuk, dus 0,5 tot 0,6 m dik): een horizontaal grensvlak tussen wegdeel en
// constructie blijft in de GLB exact vlak.
const terracedStrip = (x0, x1) => {
  const xs = roadStations(x0, x1);
  const pieces = [];
  for (let i = 0; i + 1 < xs.length; i++) {
    const [a, b] = [xs[i], xs[i + 1]];
    const bottom = Math.min(road(a), road(b)) - LAYER;
    pieces.push(
      loftX(
        [a, b].map((x) => ({ x, section: [[-15, bottom], [15, bottom], [15, road(x) + ABOVE], [-15, road(x) + ABOVE]] })),
      ),
    );
  }
  return union(pieces);
};
const strip = union([
  terracedStrip(WEST_END - 0.5, -JOINT),
  terracedStrip(JOINT, EAST_END + 0.5),
  boxFromTo(-JOINT, JOINT, -VAL.truss, VAL.truss, Z(VAL.roadNap) - LAYER, Z(VAL.roadNap) + ABOVE),
  ...[-1, 1].map((side) => boxFromTo(-JOINT, JOINT, side * VAL.truss, side * 9, Z(VAL.footNap) - LAYER, Z(VAL.footNap) + ABOVE)),
]);
// Wat boven het dek uitsteekt blijft constructie, met 2 cm vrij: de
// hoofdliggers (de hele strook, ook onder de openingen), de zijvlakken van de
// torens (2 cm groter, de openingen 2 cm kleiner) en het huisje.
const trussGuards = [-1, 1].map((side) =>
  boxFromTo(-VAL.half, VAL.half, side * (VAL.core - GUARD), side * (VAL.truss + GUARD), Z(VAL.bottomNap) - GUARD, Z(VAL.topNap) + GUARD),
);
const houseR = HOUSE.apothem / Math.cos(Math.PI / HOUSE.sides) + GUARD;
const houseGuard = boxFromTo(HOUSE.cx - houseR, HOUSE.cx + houseR, HOUSE.cy - houseR, HOUSE.cy + houseR, BASE - 1, Z(HOUSE.roofNap) + 1);
const cut = strip.subtract(union([...trussGuards, ...towerW.guards, ...towerE.guards, houseGuard]));
const solidOnly = (solid) => Manifold.compose(solid.decompose().filter((part) => part.volume() > 1e-6));
const asphaltRegion = boxFromTo(-JOINT, JOINT, -VAL.truss, VAL.truss, BASE - 1, 60);
const concreteRegion = union([
  boxFromTo(CONCRETE.west, -JOINT, -CONCRETE.half, CONCRETE.half, BASE - 1, 60),
  boxFromTo(JOINT, CONCRETE.east, -CONCRETE.half, CONCRETE.half, BASE - 1, 60),
]);
const roadway = solidOnly(cut.intersect(asphaltRegion).intersect(bridge));
const concreteway = solidOnly(cut.intersect(concreteRegion).subtract(asphaltRegion).intersect(bridge));
const footway = solidOnly(cut.subtract(asphaltRegion).subtract(concreteRegion).intersect(bridge));
const structure = bridge.subtract(cut);
const partition = {};
{
  // De onderdelen samen zijn de brug: de volumes tellen op, zonder overlap.
  const whole = bridge.volume();
  const vols = { constructie: structure.volume(), rijbaan: roadway.volume(), cementbeton: concreteway.volume(), voetpad: footway.volume() };
  const sum = Object.values(vols).reduce((a, b) => a + b, 0);
  Object.assign(partition, { brug: +whole.toFixed(2), ...Object.fromEntries(Object.entries(vols).map(([k, v]) => [k, +v.toFixed(2)])), verschil: +(sum - whole).toFixed(4) });
  console.log("partitie (m3):", partition);
  if (Math.abs(sum - whole) > 1e-4 * whole) throw new Error(`partitie: ${sum} tegen ${whole}`);
  const all = [structure, roadway, concreteway, footway];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      if (all[i].intersect(all[j]).volume() > 1e-3) throw new Error("onderdelen overlappen");
    }
  }
}
const parts = [
  [`building:${SLUG}`, structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:rijbaan-cementbeton", concreteway, CONCRETE_ATTRIBUTES],
  ["road:voetpad", footway, FOOT_ATTRIBUTES],
];
// Straalcontrole: verticale stralen over het hele dek (om de 0,25 m); geen
// twee bovenvlakken van verschillende onderdelen binnen 1 cm van elkaar, en
// geen onderdeel met een boven- en ondervlak op dezelfde hoogte.
const rays = { points: 0, coincident: 0, zeroThickness: 0, examples: [] };
for (const x of stationsX(WEST_END - 0.3, EAST_END + 0.3, 0.25)) {
  for (const y of stationsX(-13, 9.5, 0.25)) {
    const hits = [];
    parts.forEach(([name, solid], k) => {
      for (const hit of solid.rayCast([x + 0.003, y + 0.007, 60], [x + 0.003, y + 0.007, BASE - 1])) {
        hits.push({ k, z: hit.position[2], up: hit.normal[2] > 0 });
      }
    });
    if (!hits.length) continue;
    rays.points++;
    hits.sort((a, b) => b.z - a.z);
    for (let i = 0; i + 1 < hits.length; i++) {
      for (let j = i + 1; j < hits.length && hits[i].z - hits[j].z < 0.01; j++) {
        const [a, b] = [hits[i], hits[j]];
        if (a.k !== b.k && a.up && b.up) {
          rays.coincident++;
          if (rays.examples.length < 8) rays.examples.push([x, y, +a.z.toFixed(3), parts[a.k][0], parts[b.k][0]]);
        }
        // Een dun stuk (in- en uittreden binnen 1 cm) van een wegdeel, of van
        // de constructie op het dek; hoger in de torens en het vakwerk zijn dat
        // spitse hoeken van openingen.
        if (a.k === b.k && a.up && !b.up && (a.k > 0 || a.z < road(x) + ABOVE + 0.5)) {
          rays.zeroThickness++;
          if (rays.examples.length < 8) rays.examples.push([x, y, +a.z.toFixed(3), parts[a.k][0]]);
        }
      }
    }
  }
}
console.log("straalcontrole:", rays);
if (rays.coincident || rays.zeroThickness) throw new Error("samenvallende vlakken op het dek");

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
report.towers = {
  levelsNap: towerE.levels.map((z) => +(z + WATER_NAP).toFixed(2)),
  outerAtDeck: TOWER.baseOuter,
  outerAtTop: TOWER.topOuter,
  framesOpenInStl: towerE.through + towerW.through,
  framesNicheInStl: towerE.niches + towerW.niches,
};
report.val = { panelM: +(panelX[1] - panelX[0]).toFixed(3), trussOpenings: trussHoles.length };
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van landhoofden, huisje en printvoet op het
// printbed.
const stlName = `${SLUG}-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Hefbrug Boskoop 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  components: printSolid.decompose().length,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveldpunten op de Gouwe 20 m naast de brug, aan beide zijden.
const samplePoints = [-6, 6].flatMap((x) => [
  [x, 20],
  [x, -20],
]);
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: "Hefbrug Boskoop",
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [105158.52, 454245.78],
      xAxis: [0.99768, -0.06802],
      groundOffsetMetres: GROUND_OFFSET,
      // Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten: de
      // Gouwe. Terugval als een uitsnede alleen een uiteinde van de brug raakt.
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0499100002021238", "NL.IMBAG.Pand.0484100002028378"],
      replacesTerrain: [
        "P0028.4b31246ddcb946078ab15fad54ac18c0",
        "P0028.cc0d1124896b4bf4883f591816d5288c",
        "P0028.da325a82c4c34ba5a24152818cf1e3ac",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van de weg midden tussen de twee heftorens op de waterspiegel van de Gouwe (z = 0, NAP -0,31 m zoals het PDOK-terrein het water legt) in de oorsprong, +X langs de brug naar het oosten (RD-richting -3,90 graden vanaf het oosten) en +Y naar het noorden. Vier nodes: road:rijbaan, road:rijbaan-cementbeton en road:voetpad, de bovenste 0,5 m van het dek (op de landhoofden 0,5 tot 0,6 m, met een horizontale onderkant per stuk van het lengteprofiel) met de attributen van het BGT-wegdeel eronder in extras.attributes (rijbaan regionale weg van asfalt op het val en van cementbeton op de landhoofden, voetpaden van asfalt, alle gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van de hefbrug. De twee landhoofden (BGT, x = -29,39 tot -12,55 en 12,55 tot 25,48) tot het wegdek (NAP +2,72 m op het val, aflopend naar +2,35 m aan de westkant), met onder de kop van het westelijke dek de lage doorgang van de kade-weg (3,0 m breed, flauw gewelf tot NAP +1,80 m); het val in de laagste stand (25,0 m met een voeg van 5 cm naar de landhoofden en opleggingen eronder, onderkant NAP +1,90 m: doorvaarthoogte 2,5 m) met een rijdek tussen twee vakwerkhoofdliggers van 0,9 m (hart 4,6 m naast de as, bovenrand NAP +7,22 m, zes vakken met stijlen en diagonalen als W, alle driehoeken doorgaande openingen), het bovenwindverband als ruiten op de bovenrand en voetpaden buiten de liggers op NAP +2,35 m; de twee heftorens met per toren twee zijvlakken van open vakwerk (binnenpoot verticaal op x = ±12,6, tweede verticaal 2,75 m verder, schuine buitenpoot van x = ±24,3 op het dek naar ±16,4 bovenin, zes vakken), regels en kruisen tussen de zijvlakken boven de weg, de kop met machinebordes tot NAP +41,6 m, twee kabelwielen van 2,2 m tot +43,4 m en het contragewicht bovenin de schacht; en het twaalfhoekige brugwachtershuisje (BAG) van het water tot de kroonlijst en het platte dak op NAP +7,36 m, met de raamband als nis. Leuningen, lantaarns, slagbomen, kabels, ladders en trappen langs de torens, de balkons en bordessen halverwege de torens, het remmingwerk en het steigertje bij het huisje zijn weggelaten; wat zonder steun niet print (de vlakke kanten van de vakwerkdriehoeken, het windverband, de regels tussen de zijvlakken, het gewelf, het val) vult de export op. De STL heeft printvormen: blinde nissen waar een opening een vlak plafond heeft, een kern in de schacht van elke toren met een spitse doorgang over de weg, geen windverband of dwarsverband, een dichte doorgang en een printvoet onder het val. Het maaiveld wordt op het water naast de brug bemonsterd; groundHeight is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten. Vervangt het BAG-pand van het brugwachtershuisje en het pand onder de westelijke toren. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_END - WEST_END).toFixed(2),
        liftSpanM: 2 * VAL.half,
        navigationWidthM: 25,
        clearanceClosedM: 2.5,
        deckNapM: { val: VAL.roadNap, west: ROAD_NAP[0][1], east: ROAD_NAP[ROAD_NAP.length - 1][1] },
        footpathValNapM: VAL.footNap,
        trussTopNapM: VAL.topNap,
        trussAxisOffsetM: trussMid,
        valPanels: VAL.panels,
        towerTopNapM: TOWER.topNap,
        wheelTopNapM: +(WHEEL.zNap + WHEEL.r).toFixed(2),
        towerBaseM: +(TOWER.baseOuter - TOWER.inner).toFixed(2),
        towerTopM: +(TOWER.topOuter - TOWER.inner).toFixed(2),
        towerFramesFromAxisM: (TOWER.frame[0] + TOWER.frame[1]) / 2,
        counterweightNapM: [WEIGHT.z0Nap, WEIGHT.z1Nap],
        houseRoofNapM: HOUSE.roofNap,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Hefbrug_Boskoop",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/512076",
        "PDOK BGT overbruggingsdeel (dek, landhoofden), wegdeel (rijbaan en voetpaden op het dek, de lokale weg door het viaduct) en pand (brugwachtershuisje), EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor het wegdek, de hoofdliggers, de torens en de kabelwielen",
        "PDOK luchtfoto (Actueel_orthoHR) voor het bovenwindverband en de ligging",
        "PDOK 3D Basisvoorziening (terrein) voor de waterspiegel; 3D BAG voor het dak van het brugwachtershuisje",
        "Wikimedia Commons: 200408 Hefbrug Boskoop.jpg, Boskoop hefbrug1.jpg, Boskoop hefbrug2.jpg, De Stella Maris voor de Hefbrug Boskoop.jpg, Hefbrug Boskoop - Beweegbaar deel van de hefbrug.jpg, Hefbrug Boskoop - Brugopening.jpg, Hefbrug Boskoop - Voetpad en brugwachtershuisje.jpg, Hefbrug Boskoop - Zuidkant brug.jpg, Hefbrug Boskoop 2019 1 tot en met 4.jpg, Overzicht brugwachtershuisje op de hefbrug over de Gouwe, vanaf de brug - Boskoop - 20353274 - RCE.jpg, Overzicht hefbrug - Boskoop - 20342360 - RCE.jpg, Overzicht hefbrug over de Gouwe, in geopende toestand - Boskoop - 20353275 - RCE.jpg, Overzicht, geklonken stalen brug ... - Boskoop - 20366689 - RCE.jpg",
      ],
    },
    null,
    2,
  ),
);
report.partition = partition;
report.rays = rays;
console.log(JSON.stringify(report, null, 2));

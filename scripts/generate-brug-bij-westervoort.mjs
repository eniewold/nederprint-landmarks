// Genereert een vereenvoudigd, gesloten 3D-model van de Brug bij Westervoort:
// de vier bruggen naast elkaar over de IJssel tussen Arnhem en Westervoort
// (Rkm 881,3). Van noordoost (benedenstrooms) naar zuidwest: twee enkelsporige
// spoorbruggen (1980 en 1984, lijn Arnhem - Zevenaar), de verkeersbrug (1971)
// en de fietsbrug (1981). Over de rivier ligt per brug een stalen vakwerkligger
// van 117 m tussen twee gemetselde rivierpijlers: de spoorbruggen met een
// gebogen bovenrand en verticalen, de verkeersbrug met een veelhoekige
// bovenrand en verticalen, en de fietsbrug als driehoekig A-vakwerk met een
// vlakke bovenrand waar het fietspad doorheen loopt. Over de uiterwaarden lopen
// aanbruggen: betonnen liggers onder de sporen, stalen vakwerkliggers onder het
// wegdek (op gemetselde pijlers met betonnen opleggers) en een slanke plaat op
// smalle wanden voor het fietspad. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node per brug plus een
// node met de pijlers en landhoofden, en drie road-nodes met de bovenste 0,5 m
// van de dekken en de BGT-attributen: spoor, rijbaan en fietspad; met de
// materiaalklasse in de nodenaam)
// als catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal> met een printvoet onder de dekken.
//
//   node scripts/generate-brug-bij-westervoort.mjs              # 1:2500 (standaard)
//   node scripts/generate-brug-bij-westervoort.mjs --scale 1000
//
// Met 554 m is de brug op 1:1000 te lang voor een printbed; de STL staat
// daarom standaard op 1:2500 (222 mm), zoals de Waalbrug.
//
// Assenstelsel: oorsprong midden tussen de twee rivierpijlers (RD 194314,0,
// 442496,8) op de grens tussen de verkeersbrug en de zuidelijke spoorbrug, op
// de waterspiegel van de IJssel (NAP +8,3 m, AHN), Z omhoog. +X loopt langs de
// brug naar Westervoort (oostzuidoost, RD-richting -46,9 graden vanaf het
// oosten, langs de sporen in de BGT), +Y stroomafwaarts naar het noordoosten.
// De spoorbruggen liggen op +Y (sporen op y = 3,76 en 10,7), de verkeersbrug
// op y = -10 tot -1 en de fietsbrug op y = -18,5 tot -12,6. Het westelijke
// landhoofd (Arnhem) ligt op x = -213 tot -206, het oostelijke op x = 329,4 tot
// 341 (fietsbrug tot 345).
//
// Bronnen: BGT overbruggingsdeel (dekken, rivierpijlers van 6,2 m breed met
// een smalle uitbouw onder de fietsbrug, aanbrugpijlers van 3,3 tot 6,4 m
// breed met ronde koppen, wanden van 0,9 m onder de fietsbrug, landhoofden) en
// BGT spoor (as en spoorhartlijnen); AHN DSM/DTM 0,5 m (PDOK WCS) voor de
// lengteprofielen van de vier dekken (NAP +19,3 tot +21,5 m), de bovenranden
// van de vakwerken (spoorbruggen en verkeersbrug circa NAP +34 m in het midden,
// fietsbrug NAP +31,3 m), de ligging van de vakwerkwanden, het maaiveld van de
// uiterwaarden (NAP +11 tot +12 m) en de waterspiegel; PDOK-luchtfoto (8 cm)
// voor de plattegrond; Wikipedia voor de geschiedenis en de samenstelling;
// Wikimedia Commons-foto's voor de vakwerkpatronen (acht velden per ligger),
// de vorm van de bovenranden, het A-vakwerk van de fietsbrug, de aanbruggen
// en de pijlers. Geschat (foto's) zijn de constructiehoogtes van de dekken en
// aanbruggen, de hoogte van het metselwerk van de pijlers en de breedte van de
// staven.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "brug-bij-westervoort");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts.filter(Boolean));
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Doorsnede in het XZ-vlak (als CrossSection in x, z), uitgetrokken langs Y.
const extrudeY = (section, y0, y1) =>
  section
    .extrude(y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const profileY = (points, y0, y1) => extrudeY(new CrossSection([ccw(points)]), y0, y1);
// Band tussen twee functies van x (onder en boven), uitgetrokken langs Y.
function bandY(x0, x1, bottom, top, y0, y1, step = 2) {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  const xs = Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
  return profileY([...xs.map((x) => [x, bottom(x)]), ...[...xs].reverse().map((x) => [x, top(x)])], y0, y1);
}
// Stuksgewijs lineaire tabel [[x, waarde], ...].
const table = (rows) => (x) => {
  if (x <= rows[0][0]) return rows[0][1];
  for (let i = 1; i < rows.length; i++) {
    if (x <= rows[i][0]) {
      const [x0, a] = rows[i - 1];
      const [x1, b] = rows[i];
      return a + ((b - a) * (x - x0)) / (x1 - x0);
    }
  }
  return rows[rows.length - 1][1];
};
// Symmetrische tabel voor |x|.
const mirrored = (rows) => {
  const f = table(rows);
  return (x) => f(Math.abs(x));
};
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
  return solid;
}
// Pijler met ronde koppen: rechthoek in x, halve cirkels aan beide kanten in y.
function roundPier(x0, x1, y0, y1, z0, z1) {
  const r = (x1 - x0) / 2;
  const xc = (x0 + x1) / 2;
  return Manifold.hull([
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([xc, y0 + r, z0]),
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([xc, y1 - r, z0]),
  ]);
}

// ---------- hoofdmaten (boven de waterspiegel, NAP +8,3 m) ----------
const WATER_NAP = 8.3;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de IJssel op de waterspiegel van het model.
const GROUND_OFFSET = 0;
const POINTED = (55 * Math.PI) / 180; // zijden van de spitse openingen
const NICHE = 0.35; // diepte van een blinde nis aan elke kant van een vakwerkwand

// Lengteprofielen van de dekken in NAP (AHN-DSM, 25e percentiel per 4 m over
// het midden van elk dek; over de rivier vlak).
const RAIL_TOP = table([
  [-214, 20.52], [-160, 20.7], [-110, 21.0], [-70, 21.2], [-58.6, 21.45], [58.6, 21.45],
  [62, 21.3], [100, 21.2], [150, 21.05], [200, 20.9], [260, 20.73], [300, 20.58], [342, 20.47],
]);
const ROAD_TOP = table([
  [-210, 19.5], [-195, 19.8], [-160, 20.4], [-130, 20.7], [-62, 20.8], [-58.6, 20.97], [58.6, 20.97],
  [62, 20.81], [100, 20.71], [320, 20.69], [343, 20.45],
]);
const FIETS_TOP = table([
  [-210, 19.25], [-160, 20.0], [-110, 20.5], [-70, 20.9], [-58.6, 21.0], [58.6, 21.0], [62, 20.9],
  [100, 20.82], [200, 20.77], [300, 20.7], [345, 20.6],
]);

// Hoofdoverspanning: vakwerkliggers van 117,2 m tussen de opleggingen op de
// rivierpijlers (hart op hart 118,6 m, BGT), acht velden van 14,65 m (foto's).
const MAIN = { half: 58.6, panels: 8 };
const PANEL = (2 * MAIN.half) / MAIN.panels;
// Bovenrand (bovenkant van de bovenregel) van de spoorbruggen: gebogen, met
// een ronde overgang naar de oplegging (AHN: NAP +34,0 m in het midden,
// +30,6 m op 36,6 m en +27,5 m op 51,3 m uit het midden; foto's).
const RAIL_TRUSS_TOP = mirrored([
  [0, 34.0], [7.3, 33.85], [14.6, 33.35], [22, 32.5], [29.3, 31.6], [36.6, 30.6], [44, 29.3],
  [51.3, 27.5], [55.5, 24.8], [58.6, 21.85],
]);
// Verkeersbrug: veelhoekige bovenrand met knikken op de knopen en rechte
// eindstijlen (AHN: NAP +33,3 m in het midden; foto's).
const ROAD_TRUSS_TOP = mirrored([
  [0, 33.25], [7.325, 33.25], [21.975, 32.1], [36.625, 30.4], [51.275, 28.3], [58.6, 21.37],
]);
// Fietsbrug: A-vakwerk met de top op NAP +31,3 m (AHN), de voet op de randen
// van het dek, vlakke bovenrand tussen de eerste en de laatste bovenknoop.
const FIETS = { v0: -18.5, v1: -12.6, apexV: -15.55, topNap: 31.3, face: 0.95, chordW: 1.6, chordH: 1.7 };
// Dekken (BGT, AHN): y-bereik op de aanbruggen en over de rivier, de wanden van
// de vakwerken (1,0 m dik) en de constructiehoogtes.
const RAIL_S = { track: 3.76, deck: [0.8, 6.7], main: [0.55, 6.95], planes: [[0.55, 1.55], [5.95, 6.95]] };
const RAIL_N = { track: 10.7, deck: [7.75, 13.65], main: [7.4, 14.0], planes: [[7.4, 8.4], [13.0, 14.0]] };
const ROAD = { deck: [-10.0, -1.0], main: [-12.3, -0.45], planes: [[-10.05, -9.05], [-1.45, -0.45]] };
const DEPTH = {
  railMain: 1.8, // vloer met onderregel van de spoorvakwerken
  roadMain: 1.65,
  fietsMain: 1.2,
  railGirder: 3.8, // betonnen ligger onder het spoor op de aanbruggen (foto's)
  roadSlab: 0.9, // rijvloer op de aanbruggen
  fietsSlab: 1.2,
};
const ROAD_TRUSS_BOTTOM_NAP = 15.8; // onderkant van de stalen vakwerkliggers onder het wegdek (foto's)
const MASONRY_TOP_NAP = 15.2; // bovenkant metselwerk aanbrugpijlers (foto's)
const RIVER_PIER_TOP_NAP = 19.35;

// Pijlers (BGT, lokale x- en y-bereiken).
const RIVER_PIERS = [
  { xc: -59.2, w: 6.1 },
  { xc: 59.3, w: 5.8 },
].map((p) => ({ ...p, y0: -11.5, y1: 18.4, ext: [-19.7, -9.0], extW: 1.6 }));
const APPROACH_PIERS = [
  [-176.2, -172.8, -10.2, 15.9],
  [-151.0, -144.6, -10.4, 15.9],
  [-105.0, -101.4, -9.2, 16.0],
  [102.0, 106.0, -9.2, 16.1],
  [145.4, 149.4, -9.2, 16.1],
  [189.1, 193.0, -9.2, 15.9],
  [232.6, 236.7, -9.2, 16.2],
  [276.1, 280.4, -9.0, 16.2],
].map(([x0, x1, y0, y1]) => ({ x0, x1, y0, y1, round: true }));
APPROACH_PIERS.push({ x0: 321.0, x1: 323.9, y0: -10.0, y1: 15.5, round: false });
const FIETS_WALLS = [-174.75, -146.85, -103.2, 104.1, 147.6, 191.05, 234.55, 278.05, 322.2];
const FIETS_WALL = { w: 0.9, y0: -17.5, y1: -12.7 };
const WEST = { x0: -213, x1: -206, top: 18.1, deckEnd: -210 };
const EAST = { x0: 329.4, x1: 341.0, top: 18.0, railEnd: 340.5, roadEnd: 342.8, fietsEnd: 344.8 };
const FIETS_EAST_ABUT = [338.6, 345.0];

// ---------- vakwerkwand ----------
// Een vakwerk is op 1:1000 niet open te printen. Elke wand is daarom een dichte
// plaat met doorgaande driehoekige openingen met de punt omhoog (binnen elke
// Λ van twee diagonalen, gedeeld door de verticaal als die er is) en blinde
// nissen voor de driehoeken met de vlakke kant boven (tussen twee Λ's onder de
// bovenregel). Zijden van openingen die vlakker lopen dan 55 graden worden
// rond de top steiler gezet.
//
// opts: x0, x1 (opleggingen), panels, top(x) (bovenkant), tc (bovenregel),
// bottom (onderkant van de plaat), floor (bovenkant onderregel = vloer van de
// openingen), verticals, wd (diagonaal), wv (verticaal), endW (eindstijl),
// outline (optioneel: eigen omtrek).
function trussSection(opts) {
  const { x0, x1, panels, top, tc, bottom, floor, verticals, wd, wv, endW } = opts;
  const P = (x1 - x0) / panels;
  const under = (x) => top(x) - tc;
  const n = Math.max(8, Math.round((x1 - x0) / 0.5));
  const xs = Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
  const outline =
    opts.outline ?? [[x0, bottom], [x1, bottom], ...[...xs].reverse().map((x) => [x, top(x)])];
  // Lijn door (xa, za) en (xb, zb), loodrecht verschoven met d naar beneden.
  const offsetLine = (xa, za, xb, zb, d) => {
    const m = (zb - za) / (xb - xa);
    const shift = d * Math.sqrt(1 + m * m);
    return { m, at: (x) => za + m * (x - xa) - shift };
  };
  const holes = [];
  const niches = [];
  const nodesX = Array.from({ length: panels + 1 }, (_, k) => x0 + k * P);
  const tops = nodesX.slice(0, -1).map((x) => x + P / 2);
  const tanP = Math.tan(POINTED);
  for (let k = 0; k < panels; k++) {
    const t = tops[k];
    const zt = under(t);
    const dl = k === 0 ? endW : wd / 2;
    const dr = k === panels - 1 ? endW : wd / 2;
    // Beide diagonalen naar binnen (omlaag) verschoven met de halve staafbreedte.
    const left = offsetLine(nodesX[k], floor, t, zt, dl);
    const right = offsetLine(nodesX[k + 1], floor, t, zt, dr);
    const sides = verticals
      ? [
          { xv: t - wv / 2, line: left, dir: -1 },
          { xv: t + wv / 2, line: right, dir: 1 },
        ]
      : [{ xv: null }];
    for (const side of sides) {
      if (side.xv === null) {
        // Eén driehoek met de top op het snijpunt van de twee diagonalen,
        // onder de bovenregel; zijden minstens 55 graden steil.
        const bl = left.at(0);
        const br = right.at(0);
        const xa = (br - bl) / (left.m - right.m);
        const za = Math.min(left.at(xa), under(xa) - 0.15);
        if (za - floor < 0.8) continue;
        const a = xa - (za - floor) / Math.max(left.m, tanP);
        const b = xa + (za - floor) / Math.max(-right.m, tanP);
        holes.push([[a, floor], [b, floor], [xa, za]]);
        continue;
      }
      const { xv, line, dir } = side;
      let za = Math.min(line.at(xv), under(xv) - 0.15);
      const m = Math.max(Math.abs(line.m), tanP);
      if (za - floor < 0.8) continue;
      const xb = xv + (dir * (za - floor)) / m;
      if (Math.abs(xb - xv) < 0.4) continue;
      holes.push(dir < 0 ? [[xb, floor], [xv, floor], [xv, za]] : [[xv, floor], [xb, floor], [xv, za]]);
    }
  }
  // Blinde nissen tussen twee Λ's: driehoek onder de bovenregel.
  for (let k = 0; k + 1 < panels; k++) {
    const xb = nodesX[k + 1];
    const ta = tops[k] + (verticals ? wv / 2 : 0);
    const tb = tops[k + 1] - (verticals ? wv / 2 : 0);
    const l = offsetLine(xb, floor, tops[k], under(tops[k]), -wd / 2); // boven/links van de diagonaal
    const r = offsetLine(xb, floor, tops[k + 1], under(tops[k + 1]), -wd / 2);
    // Halfvlakken boven beide diagonalen, onder de bovenregel.
    const span = 60;
    const above = (line, xa, xc) => new CrossSection([ccw([[xa, line.at(xa)], [xc, line.at(xc)], [xc, line.at(xc) + span], [xa, line.at(xa) + span]])]);
    const m = 24;
    const topPts = Array.from({ length: m + 1 }, (_, i) => {
      const x = ta + ((tb - ta) * i) / m;
      return [x, under(x) - 0.1];
    });
    const cap = new CrossSection([ccw([[ta, floor], [tb, floor], ...[...topPts].reverse()])]);
    const niche = cap.intersect(above(l, xb - 2 * P, xb + 2 * P)).intersect(above(r, xb - 2 * P, xb + 2 * P));
    if (niche.area() > 0.5) niches.push(niche);
  }
  let plate = new CrossSection([ccw(outline)]);
  const holeSection = new CrossSection(holes.map(ccw));
  plate = plate.subtract(holeSection);
  return { plate, niches: niches.length ? CrossSection.union(niches) : null, holes: holes.length, nicheCount: niches.length };
}
// Vakwerkwand als solid tussen y0 en y1.
function trussWall(opts, y0, y1) {
  const { plate, niches, holes, nicheCount } = trussSection(opts);
  let wall = extrudeY(plate, y0, y1);
  if (niches) {
    wall = wall.subtract(extrudeY(niches, y0 - 0.2, y0 + NICHE)).subtract(extrudeY(niches, y1 - NICHE, y1 + 0.2));
  }
  return { wall, holes, niches: nicheCount };
}

const stats = {};

// ---------- spoorbruggen ----------
function railBridge(spec, label) {
  const deckTop = Z(RAIL_TOP(0));
  const deckBottom = deckTop - DEPTH.railMain;
  const top = (x) => Z(RAIL_TRUSS_TOP(x));
  const parts = [];
  let holes = 0;
  let niches = 0;
  for (const [y0, y1] of spec.planes) {
    const w = trussWall(
      {
        x0: -MAIN.half,
        x1: MAIN.half,
        panels: MAIN.panels,
        top,
        tc: 1.2,
        bottom: deckBottom,
        floor: deckTop + 0.5,
        verticals: true,
        wd: 1.0,
        wv: 0.9,
        endW: 1.3,
      },
      y0,
      y1,
    );
    parts.push(w.wall);
    holes += w.holes;
    niches += w.niches;
  }
  // Vloer over de rivier.
  parts.push(boxFromTo(-MAIN.half, MAIN.half, spec.main[0], spec.main[1], deckBottom, deckTop));
  // Aanbruggen: betonnen ligger van 3,8 m onder het spoor, van landhoofd tot
  // rivierpijler, met de uiteinden onder de vakwerkvloer.
  const top2 = (x) => Z(RAIL_TOP(x));
  const bottom2 = (x) => Z(RAIL_TOP(x)) - DEPTH.railGirder;
  parts.push(bandY(WEST.deckEnd, -MAIN.half + 0.6, bottom2, top2, spec.deck[0], spec.deck[1]));
  parts.push(bandY(MAIN.half - 0.6, EAST.railEnd, bottom2, top2, spec.deck[0], spec.deck[1]));
  stats[label] = { holes, niches };
  return union(parts);
}
const railS = railBridge(RAIL_S, "spoorbrug-zuid");
const railN = railBridge(RAIL_N, "spoorbrug-noord");

// ---------- verkeersbrug ----------
// Overspanningen van de aanbruggen tussen de pijlers (voor de vakwerkliggers
// onder het wegdek).
const pierFaces = [
  [WEST.x1, WEST.x1],
  ...APPROACH_PIERS.filter((p) => p.x0 < 0).map((p) => [p.x0, p.x1]),
  [RIVER_PIERS[0].xc - RIVER_PIERS[0].w / 2, RIVER_PIERS[0].xc + RIVER_PIERS[0].w / 2],
  [RIVER_PIERS[1].xc - RIVER_PIERS[1].w / 2, RIVER_PIERS[1].xc + RIVER_PIERS[1].w / 2],
  ...APPROACH_PIERS.filter((p) => p.x0 > 0).map((p) => [p.x0, p.x1]),
  [EAST.x0, EAST.x0],
].sort((a, b) => a[0] - b[0]);
const ROAD_SPANS = [];
for (let i = 0; i + 1 < pierFaces.length; i++) {
  const a = pierFaces[i][1];
  const b = pierFaces[i + 1][0];
  if (a < 0 && b > 0) continue; // hoofdoverspanning
  ROAD_SPANS.push([a, b]);
}
function roadBridge() {
  const deckTop = Z(ROAD_TOP(0));
  const deckBottom = deckTop - DEPTH.roadMain;
  const parts = [];
  let holes = 0;
  let niches = 0;
  for (const [y0, y1] of ROAD.planes) {
    const w = trussWall(
      {
        x0: -MAIN.half,
        x1: MAIN.half,
        panels: MAIN.panels,
        top: (x) => Z(ROAD_TRUSS_TOP(x)),
        tc: 1.1,
        bottom: deckBottom,
        floor: deckTop + 0.5,
        verticals: true,
        wd: 1.0,
        wv: 0.9,
        endW: 1.3,
      },
      y0,
      y1,
    );
    parts.push(w.wall);
    holes += w.holes;
    niches += w.niches;
  }
  // Rijvloer met het inspectiepad buiten de zuidelijke wand.
  parts.push(boxFromTo(-MAIN.half, MAIN.half, ROAD.main[0], ROAD.main[1], deckBottom, deckTop));
  // Aanbruggen: rijvloer van 0,9 m op twee stalen vakwerkliggers per
  // overspanning, met de onderkant op NAP +15,8 m.
  const top2 = (x) => Z(ROAD_TOP(x));
  const slabBottom = (x) => Z(ROAD_TOP(x)) - DEPTH.roadSlab;
  parts.push(bandY(WEST.deckEnd, -MAIN.half + 0.6, slabBottom, top2, ROAD.deck[0], ROAD.deck[1]));
  parts.push(bandY(MAIN.half - 0.6, EAST.roadEnd, slabBottom, top2, ROAD.deck[0], ROAD.deck[1]));
  const girderPlanes = [
    [ROAD.deck[0] + 0.6, ROAD.deck[0] + 1.5],
    [ROAD.deck[1] - 1.5, ROAD.deck[1] - 0.6],
  ];
  let girderHoles = 0;
  for (const [a0, b0] of ROAD_SPANS) {
    const a = a0 - 0.05;
    const b = b0 + 0.05;
    const bottom = Z(ROAD_TRUSS_BOTTOM_NAP);
    const panels = Math.max(3, Math.round((b - a) / 7.3));
    for (const [y0, y1] of girderPlanes) {
      const w = trussWall(
        {
          x0: a,
          x1: b,
          panels,
          top: (x) => slabBottom(x) + 0.05,
          tc: 0.5,
          bottom,
          floor: bottom + 0.8,
          verticals: false,
          wd: 0.9,
          wv: 0,
          endW: 0.9,
          outline: (() => {
            const n = Math.max(2, Math.round((b - a) / 2));
            const xs = Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
            return [[a, bottom], [b, bottom], ...[...xs].reverse().map((x) => [x, slabBottom(x) + 0.05])];
          })(),
        },
        y0,
        y1,
      );
      parts.push(w.wall);
      girderHoles += w.holes;
    }
  }
  stats.verkeersbrug = { holes, niches, girderSpans: ROAD_SPANS.length, girderHoles };
  return union(parts);
}
const road = roadBridge();

// ---------- fietsbrug ----------
function fietsBridge() {
  const deckTop = Z(FIETS_TOP(0));
  const deckBottom = deckTop - DEPTH.fietsMain;
  const H = Z(FIETS.topNap) - deckTop;
  const lean = Math.atan2(FIETS.apexV - FIETS.v0, H); // helling van de zijvlakken vanaf de verticaal
  const S = H / Math.cos(lean); // lengte van een zijvlak langs de helling
  const T = FIETS.face;
  // Zijvlak in zijn eigen vlak (x langs de brug, z langs de helling vanaf het
  // dek), Warren zonder verticalen met eindstijlen naar de opleggingen.
  const t0 = -MAIN.half + PANEL / 2;
  const sBottom = -0.3;
  const outline = [
    [-MAIN.half, sBottom],
    [MAIN.half, sBottom],
    [MAIN.half, 0.4],
    [-t0, S],
    [t0, S],
    [-MAIN.half, 0.4],
  ];
  const { wall, holes, niches } = trussWall(
    {
      x0: -MAIN.half,
      x1: MAIN.half,
      panels: MAIN.panels,
      top: (x) => (Math.abs(x) <= -t0 ? S : S - ((Math.abs(x) + t0) / (MAIN.half + t0)) * (S - 0.4)),
      tc: 1.0,
      bottom: sBottom,
      floor: 0.5,
      verticals: false,
      wd: 1.0,
      wv: 0,
      endW: 1.3,
      outline,
    },
    0,
    T,
  );
  // Kantel het vlak: z (langs de helling) wijst naar de top, y = 0 is de
  // buitenkant.
  const deg = (lean * 180) / Math.PI;
  const south = wall.rotate([-deg, 0, 0]).translate([0, FIETS.v0, deckTop]);
  const north = wall.mirror([0, 1, 0]).rotate([deg, 0, 0]).translate([0, FIETS.v1, deckTop]);
  const top = Z(FIETS.topNap);
  const chord = boxFromTo(t0, -t0, FIETS.apexV - FIETS.chordW / 2, FIETS.apexV + FIETS.chordW / 2, top - FIETS.chordH, top);
  const frame = union([south, north, chord])
    .trimByPlane([0, 0, 1], deckBottom)
    .trimByPlane([0, 0, -1], -top);
  const parts = [frame, boxFromTo(-MAIN.half, MAIN.half, FIETS.v0, FIETS.v1, deckBottom, deckTop)];
  // Aanbruggen: plaat van 1,2 m op wanden van 0,9 m (BGT) en het oostelijke
  // landhoofd.
  const top2 = (x) => Z(FIETS_TOP(x));
  const bottom2 = (x) => Z(FIETS_TOP(x)) - DEPTH.fietsSlab;
  parts.push(bandY(WEST.deckEnd, -MAIN.half + 0.6, bottom2, top2, FIETS.v0, FIETS.v1));
  parts.push(bandY(MAIN.half - 0.6, EAST.fietsEnd, bottom2, top2, FIETS.v0, FIETS.v1));
  for (const xc of FIETS_WALLS) {
    parts.push(boxFromTo(xc - FIETS_WALL.w / 2, xc + FIETS_WALL.w / 2, FIETS_WALL.y0, FIETS_WALL.y1, BASE, bottom2(xc) + 0.05));
  }
  parts.push(
    boxFromTo(FIETS_EAST_ABUT[0], FIETS_EAST_ABUT[1], FIETS.v0, FIETS.v1, BASE, bottom2(FIETS_EAST_ABUT[0]) + 0.05),
  );
  stats.fietsbrug = { holes, niches, leanDeg: +deg.toFixed(1), faceLengthM: +S.toFixed(2) };
  return union(parts);
}
const fiets = fietsBridge();

// ---------- pijlers en landhoofden ----------
function piers() {
  const parts = [];
  const riverTop = Z(RIVER_PIER_TOP_NAP);
  for (const p of RIVER_PIERS) {
    parts.push(roundPier(p.xc - p.w / 2, p.xc + p.w / 2, p.y0, p.y1, BASE, riverTop));
    parts.push(roundPier(p.xc - p.extW / 2, p.xc + p.extW / 2, p.ext[0], p.ext[1], BASE, riverTop));
    // Opleggingen onder de vakwerkvloeren.
    for (const [y0, y1, nap] of [
      [RAIL_S.main[0], RAIL_S.main[1], RAIL_TOP(0) - DEPTH.railMain],
      [RAIL_N.main[0], RAIL_N.main[1], RAIL_TOP(0) - DEPTH.railMain],
      [FIETS.v0 + 0.6, FIETS.v1 - 0.6, FIETS_TOP(0) - DEPTH.fietsMain],
    ]) {
      const w = y0 < -12 ? 1.4 : 2.4;
      parts.push(boxFromTo(p.xc - w / 2, p.xc + w / 2, y0 + 0.4, y1 - 0.4, riverTop - 0.1, Z(nap) + 0.05));
    }
  }
  const masonry = Z(MASONRY_TOP_NAP);
  for (const p of APPROACH_PIERS) {
    const xc = (p.x0 + p.x1) / 2;
    parts.push(p.round ? roundPier(p.x0, p.x1, p.y0, p.y1, BASE, masonry) : boxFromTo(p.x0, p.x1, p.y0, p.y1, BASE, masonry));
    // Betonnen opleggers: onder elk spoordek tot de ligger, onder het wegdek
    // tot de vakwerkliggers en de rijvloer.
    const cw = Math.min(p.x1 - p.x0, 3.2) / 2;
    for (const spec of [RAIL_S, RAIL_N]) {
      parts.push(
        boxFromTo(xc - cw, xc + cw, spec.deck[0] + 0.3, spec.deck[1] - 0.3, masonry - 0.1, Z(RAIL_TOP(xc)) - DEPTH.railGirder + 0.05),
      );
    }
    parts.push(
      boxFromTo(p.x0, p.x1, ROAD.deck[0] + 0.2, ROAD.deck[1] - 0.2, masonry - 0.1, Z(ROAD_TOP(xc)) - DEPTH.roadSlab + 0.05),
    );
  }
  // Landhoofden: blok tot onder de dekken, met opleggers onder het wegdek.
  parts.push(boxFromTo(WEST.x0, WEST.x1, -19.0, 16.0, BASE, Z(WEST.top)));
  parts.push(
    boxFromTo(WEST.x0, WEST.x1, ROAD.deck[0] + 0.2, ROAD.deck[1] - 0.2, BASE, Z(ROAD_TOP(WEST.x1)) - DEPTH.roadSlab + 0.05),
  );
  parts.push(boxFromTo(EAST.x0, EAST.x1, -10.0, 15.6, BASE, Z(EAST.top)));
  parts.push(
    boxFromTo(EAST.x0, EAST.roadEnd, ROAD.deck[0] + 0.2, ROAD.deck[1] - 0.2, BASE, Z(ROAD_TOP(EAST.x0)) - DEPTH.roadSlab + 0.05),
  );
  for (const spec of [RAIL_S, RAIL_N]) {
    parts.push(
      boxFromTo(EAST.x0, EAST.railEnd, spec.deck[0] + 0.3, spec.deck[1] - 0.3, BASE, Z(RAIL_TOP(EAST.x0)) - DEPTH.railGirder + 0.05),
    );
  }
  return union(parts);
}
const pierSolid = piers();

// ---------- spoor, rijbaan en fietspad als eigen onderdelen ----------
// De bovenste 0,5 m van elk dek is een eigen node met de attributen van het
// BGT-wegdeel erop (glTF `extras.attributes`), zodat de kleurregels van een
// thema (bijvoorbeeld fietspaden rood, spoor zwart) op de brug werken zoals op
// de PDOK-wegdelen ernaast. Elk van de vier dekken draagt één functie: de
// actuele BGT-wegdelen met relatieve hoogteligging 1 liggen elk op één dek
// (lokale coördinaten, vereenvoudigd tot 5 cm). Hun randen wijken tot 3 m af
// van de randen van de dekken (over de rivier tekent de BGT het spoor 1,9 m
// breed en de rijbaan tot buiten de zuidelijke wand), daarom krijgt het hele
// dek de functie en controleert het script alleen dat de as van elk dek in
// het wegdeel van zijn functie ligt.
const LAYER = 0.5;
const ABOVE = 1.0;
const RAIL_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
const ROAD_ATTRIBUTES = {
  bgt_functie: "rijbaan regionale weg",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BGT_WEGDELEN = [
  {
    // Spoorbaan, gesloten verharding: zuidelijke spoorbrug van x = -146,7 tot 322.
    id: "L0004.aa8fedb55d820c8fe05332a1e90a2c91",
    functie: "spoorbaan",
    deck: "spoorbrug-zuid",
    ring: [[-146.74, 1.24], [-146.73, 1.1], [-120.78, 1.36], [-59.37, 1.36], [-59.28, 0.33], [-59.17, 0.33],
      [-59.16, 2.7], [59.95, 2.65], [59.95, 0.33], [60.04, 0.33], [60.11, 1.3], [321.67, 1.31], [321.64, 0.63],
      [321.99, 0.62], [321.98, 5.65], [321.66, 5.65], [321.65, 5.58], [265.24, 5.55], [88.67, 5.56], [60.09, 5.58],
      [60.09, 5.67], [59.94, 5.67], [59.94, 4.57], [29.92, 4.53], [-59.16, 4.58], [-59.16, 5.72], [-59.42, 5.72],
      [-59.42, 5.64], [-146.74, 5.67]],
  },
  {
    // Spoorbaan, gesloten verharding: noordelijke spoorbrug van x = -146,7 tot 322.
    id: "L0004.aa8fedb55e540c8fe05332a1e90a2c91",
    functie: "spoorbaan",
    deck: "spoorbrug-noord",
    ring: [[-146.73, 8.47], [-101.52, 8.49], [-59.43, 8.44], [-59.43, 8.38], [-59.15, 8.38], [-59.15, 9.79],
      [28.21, 9.73], [59.94, 9.78], [59.94, 8.32], [60.2, 8.32], [60.2, 8.38], [136.3, 8.41], [310.43, 8.4],
      [321.66, 8.38], [321.66, 8.31], [321.98, 8.31], [321.97, 12.75], [321.66, 12.75], [321.66, 12.65],
      [60.14, 12.67], [60.14, 12.75], [59.94, 12.75], [59.94, 11.66], [36.83, 11.6], [-59.15, 11.64],
      [-59.14, 12.82], [-59.42, 12.81], [-59.42, 12.72], [-146.73, 12.76]],
  },
  {
    // Spoorbaan, half verhard: beide spoorbruggen van het westelijke landhoofd tot x = -146,7.
    id: "L0004.aa8fedb55d9e0c8fe05332a1e90a2c91",
    functie: "spoorbaan",
    deck: "spoorbrug-zuid spoorbrug-noord",
    ring: [[-207.72, 13.8], [-207.55, 0.69], [-178.55, 0.78], [-146.73, 1.1], [-146.73, 12.76], [-146.73, 12.92],
      [-152.07, 12.97], [-152.06, 13.36], [-149.45, 13.33], [-149.44, 13.9]],
  },
  {
    // Spoorbaan, half verhard: beide spoorbruggen van x = 322 tot het oostelijke landhoofd.
    id: "L0004.aa8fedb55e2d0c8fe05332a1e90a2c91",
    functie: "spoorbaan",
    deck: "spoorbrug-zuid spoorbrug-noord",
    ring: [[321.97, 12.75], [321.99, 0.62], [338.81, 0.47], [338.79, 13.27], [324.43, 13.31], [324.43, 13.2],
      [323.77, 13.2], [323.76, 12.85], [322.27, 12.88], [322.26, 12.75]],
  },
  {
    // Rijbaan regionale weg, gesloten verharding, asfalt: de verkeersbrug.
    id: "L0002.8f05055e0db0404eb7873f0e5834944f",
    functie: "rijbaan regionale weg",
    deck: "verkeersbrug",
    ring: [[-208.06, -7.52], [-207.27, -7.13], [-159.87, -7.08], [-146.8, -7.16], [-59.82, -8.72], [-59.82, -11.81],
      [-49.49, -11.83], [60.47, -11.8], [60.49, -8.73], [147.65, -7.12], [168.87, -7.2], [211.09, -7.15],
      [255.2, -7.22], [267.55, -7.15], [308.84, -7.22], [321.81, -7.14], [329.45, -7.37], [332.33, -7.61],
      [332.3, -1.33], [322.23, -1.34], [321.79, -1.24], [286.01, -1.31], [234.64, -1.25], [147.57, -1.29],
      [60.5, -2.81], [60.53, -0.85], [60.62, -0.85], [60.64, -0.23], [58.54, -0.17], [-8.3, -0.22], [-58.72, -0.12],
      [-59.74, -0.12], [-59.83, -2.83], [-97.66, -2.05], [-121.93, -1.72], [-146.84, -1.25], [-171.01, -1.37],
      [-207.25, -1.33], [-207.73, -0.94]],
  },
  {
    // Fietspad, gesloten verharding, asfalt: de fietsbrug.
    id: "L0002.1bbf84598b5442638fcc3145627ba8ed",
    functie: "fietspad",
    deck: "fietsbrug",
    ring: [[-209.41, -17.56], [-205.65, -17.18], [-174.82, -17.1], [-103.46, -17.24], [-66.07, -17.07],
      [-59.17, -17.18], [72.21, -17.11], [204.91, -17.19], [248.49, -17.08], [313.64, -17.14], [339.99, -17.29],
      [339.98, -13.11], [339.38, -13.08], [279.86, -13.16], [185.35, -13.08], [135.48, -13.15], [91.18, -13.07],
      [-59.08, -13.08], [-65.64, -12.99], [-103.43, -13.25], [-191.49, -13.09], [-205.6, -13.31], [-208.29, -12.94],
      [-209.27, -12.94]],
  },
];
// De as van elk dek (spoor, midden tussen de wanden) ligt over de hele lengte
// van de wegdelen in een wegdeel van de functie van dat dek.
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
  for (const [deck, axis, functie, x0, x1] of [
    ["spoorbrug-zuid", RAIL_S.track, "spoorbaan", -207, 338],
    ["spoorbrug-noord", RAIL_N.track, "spoorbaan", -207, 338],
    ["verkeersbrug", -5.25, "rijbaan regionale weg", -207, 332],
    ["fietsbrug", FIETS.apexV, "fietspad", -209, 339.9],
  ]) {
    for (let x = x0; x <= x1; x += 1) {
      const hit = BGT_WEGDELEN.find((w) => w.deck.split(" ").includes(deck) && inRing([x, axis], w.ring));
      if (!hit || hit.functie !== functie) throw new Error(`${deck}: as op x = ${x} niet in een wegdeel ${functie}`);
    }
  }
}
// Snijstrook over het dek: van 0,5 m onder tot 1 m boven het wegdek, met de
// loftstations van de aanbrugplaten (om de 2 m) en de vlakke vloer over de
// rivier. Zo houdt de constructie geen vlak zonder dikte op het wegdek over.
// Lineaire interpolatie door de stations van een aanbrug (zoals bandY).
const bandStations = (x0, x1, step = 2) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};
function deckTop(profile, westEnd, eastEnd) {
  const west = bandStations(westEnd, -MAIN.half + 0.6);
  const east = bandStations(MAIN.half - 0.6, eastEnd);
  const main = Z(profile(0));
  // Buiten de stations: de waarde van het eerste of laatste station.
  const poly = (xs, x) => {
    if (x <= xs[0]) return Z(profile(xs[0]));
    for (let i = 1; i < xs.length; i++) {
      if (x <= xs[i]) {
        const a = Z(profile(xs[i - 1]));
        const b = Z(profile(xs[i]));
        return a + ((b - a) * (x - xs[i - 1])) / (xs[i] - xs[i - 1]);
      }
    }
    return Z(profile(xs[xs.length - 1]));
  };
  // Over de rivier de vloer (en waar de aanbrugplaat 0,6 m onder de vloer
  // doorloopt het hoogste van beide).
  const top = (x) => {
    const band = x < 0 ? poly(west, x) : poly(east, x);
    return Math.abs(x) <= MAIN.half ? Math.max(main, band) : band;
  };
  const stations = [...west, -MAIN.half, MAIN.half, ...east].sort((a, b) => a - b);
  return { top, stations };
}
function strip(deck, x0, x1, y0, y1) {
  const xs = [x0, ...deck.stations.filter((x) => x > x0 + 0.005 && x < x1 - 0.005), x1];
  return loftX(
    xs.map((x) => {
      const zt = deck.top(x);
      return { x, section: [[y0, zt - LAYER], [y1, zt - LAYER], [y1, zt + ABOVE], [y0, zt + ABOVE]] };
    }),
  );
}
const railDeck = deckTop(RAIL_TOP, WEST.deckEnd, EAST.railEnd);
const roadDeck = deckTop(ROAD_TOP, WEST.deckEnd, EAST.roadEnd);
const fietsDeck = deckTop(FIETS_TOP, WEST.deckEnd, EAST.fietsEnd);
// De wanden van de vakwerken blijven over hun hele strook constructie, ook
// onder de openingen, met 2 cm vrij.
const wallGuard = ([y0, y1], deck) =>
  boxFromTo(-MAIN.half - 0.02, MAIN.half + 0.02, y0 - 0.02, y1 + 0.02, deck.top(0) - 2, deck.top(0) + 2);
// Zijvlakken van het A-vakwerk: binnen de strook een verticaal blok van de
// buitenrand tot 2 cm voorbij de binnenkant van de wand op de bovenkant van de
// strook (1 m boven het wegdek). Een blok dat de helling van de wand volgde,
// liet bij de voet van de wand een schuin grensvlak tussen fietspad en
// constructie staan dat de stralencontrole als z-fighting zag.
function fietsGuard() {
  const deckZ = Z(FIETS_TOP(0));
  const lean = Math.atan2(FIETS.apexV - FIETS.v0, Z(FIETS.topNap) - deckZ);
  const reach = FIETS.face / Math.cos(lean) + ABOVE * Math.tan(lean) + 0.02;
  return union([
    boxFromTo(-MAIN.half - 0.02, MAIN.half + 0.02, FIETS.v0 - 1, FIETS.v0 + reach, deckZ - 2, deckZ + 2),
    boxFromTo(-MAIN.half - 0.02, MAIN.half + 0.02, FIETS.v1 - reach, FIETS.v1 + 1, deckZ - 2, deckZ + 2),
  ]);
}
const E = 0.1; // de strook loopt 0,1 m voorbij de randen en uiteinden van het dek
const railCut = (spec) =>
  strip(railDeck, WEST.deckEnd - E, EAST.railEnd + E, spec.main[0] - E, spec.main[1] + E).subtract(
    union(spec.planes.map((p) => wallGuard(p, railDeck))),
  );
const railCutS = railCut(RAIL_S);
const railCutN = railCut(RAIL_N);
// Verkeersbrug: over de rivier alleen tussen de wanden; het inspectiepad
// buiten de zuidelijke wand blijft constructie.
const roadCut = union([
  strip(roadDeck, WEST.deckEnd - E, -MAIN.half - 0.01, ROAD.deck[0] - E, ROAD.deck[1] + E),
  strip(roadDeck, -MAIN.half - 0.02, MAIN.half + 0.02, ROAD.planes[0][0] + 0.5, ROAD.planes[1][1] - 0.5),
  strip(roadDeck, MAIN.half + 0.01, EAST.roadEnd + E, ROAD.deck[0] - E, ROAD.deck[1] + E),
]).subtract(union(ROAD.planes.map((p) => wallGuard(p, roadDeck))));
const bikeCut = strip(fietsDeck, WEST.deckEnd - E, EAST.fietsEnd + E, FIETS.v0 - E, FIETS.v1 + E).subtract(fietsGuard());
const allCuts = union([railCutS, railCutN, roadCut, bikeCut]);
const railway = union([railCutS.intersect(railS), railCutN.intersect(railN)]);
const roadway = roadCut.intersect(road);
const bikeway = bikeCut.intersect(fiets);

const parts = [
  ["building:spoorbrug-noord", railN.subtract(allCuts)],
  ["building:spoorbrug-zuid", railS.subtract(allCuts)],
  ["building:verkeersbrug", road.subtract(allCuts)],
  ["building:fietsbrug", fiets.subtract(allCuts)],
  ["building:pijlers", pierSolid.subtract(allCuts)],
  ["road:spoor", railway, RAIL_ATTRIBUTES],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];
// Controle: per brug tellen constructie en wegdeel op tot de brug als geheel
// (de stroken raken geen andere brug en de pijlers niet).
const partition = {};
{
  const vol = (name) => parts.find(([n]) => n === name)[1].volume();
  for (const [name, whole, layer] of [
    ["spoorbrug-noord", railN, railCutN.intersect(railN)],
    ["spoorbrug-zuid", railS, railCutS.intersect(railS)],
    ["verkeersbrug", road, roadway],
    ["fietsbrug", fiets, bikeway],
    ["pijlers", pierSolid, null],
  ]) {
    const sum = vol(`building:${name}`) + (layer ? layer.volume() : 0);
    const diff = sum - whole.volume();
    partition[name] = { wholeM3: +whole.volume().toFixed(2), partsM3: +sum.toFixed(2), diffM3: +diff.toFixed(4) };
    if (Math.abs(diff) > 0.01) throw new Error(`${name}: onderdelen ${sum} m³, geheel ${whole.volume()} m³`);
  }
  const whole = union([railN, railS, road, fiets, pierSolid]).volume();
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  partition.model = { wholeM3: +whole.toFixed(2), partsM3: +sum.toFixed(2) };
}

// ---------- printvoet (alleen in de STL) ----------
// De dekken hangen tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder per dek een wig van 50 graden die uitloopt in
// een scherm van 0,8 mm (op printschaal) tot de onderplaat.
const KNEE = (50 * Math.PI) / 180;
const SCREEN = Math.max(0.45, 0.4 / mmPerMetre);
function foot(x0, x1, under, y0, y1) {
  const n = Math.max(2, Math.round((x1 - x0) / 1));
  const stations = [];
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const zb = under(x) + 0.02;
    const yc = (y0 + y1) / 2;
    const w = (y1 - y0) / 2 + 0.02;
    const zs = zb - Math.tan(KNEE) * (w - SCREEN);
    const section =
      w > SCREEN && zs > BASE + 0.05
        ? [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]]
        : [[-Math.min(w, SCREEN), BASE], [Math.min(w, SCREEN), BASE], [Math.min(w, SCREEN) + 1e-3, zb - 1e-3], [w, zb], [-w, zb], [-Math.min(w, SCREEN) - 1e-3, zb - 1e-3]];
    stations.push({ x, section: section.map(([y, z]) => [y + yc, z]) });
  }
  return loftX(stations);
}
const feet = [];
for (const [spec, depthMain] of [[RAIL_S, DEPTH.railMain], [RAIL_N, DEPTH.railMain]]) {
  feet.push(foot(WEST.x1, -MAIN.half, (x) => Z(RAIL_TOP(x)) - DEPTH.railGirder, ...spec.deck));
  feet.push(foot(-MAIN.half, MAIN.half, () => Z(RAIL_TOP(0)) - depthMain, ...spec.main));
  feet.push(foot(MAIN.half, EAST.x0, (x) => Z(RAIL_TOP(x)) - DEPTH.railGirder, ...spec.deck));
}
feet.push(foot(WEST.x1, -MAIN.half, () => Z(ROAD_TRUSS_BOTTOM_NAP), ROAD.deck[0] + 0.6, ROAD.deck[1] - 0.6));
feet.push(foot(-MAIN.half, MAIN.half, () => Z(ROAD_TOP(0)) - DEPTH.roadMain, ...ROAD.main));
feet.push(foot(MAIN.half, EAST.x0, () => Z(ROAD_TRUSS_BOTTOM_NAP), ROAD.deck[0] + 0.6, ROAD.deck[1] - 0.6));
feet.push(foot(WEST.x1, -MAIN.half, (x) => Z(FIETS_TOP(x)) - DEPTH.fietsSlab, FIETS.v0, FIETS.v1));
feet.push(foot(-MAIN.half, MAIN.half, () => Z(FIETS_TOP(0)) - DEPTH.fietsMain, FIETS.v0, FIETS.v1));
feet.push(foot(MAIN.half, FIETS_EAST_ABUT[0], (x) => Z(FIETS_TOP(x)) - DEPTH.fietsSlab, FIETS.v0, FIETS.v1));
const printFoot = union(feet);
// De STL bevat de brug als geheel (de originele vijf onderdelen).
const wholeParts = [railN, railS, road, fiets, pierSolid];
const printModel = union([...wholeParts, printFoot]);

// ---------- controles ----------
function overhangArea(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
  }
  return area;
}
for (const [name, solid] of [...parts, ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}
{
  const bb = printModel.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`print: onderkant op ${bb.min[2]}`);
  const pb = pierSolid.boundingBox();
  if (Math.abs(pb.min[2] - BASE) > 1e-6) throw new Error(`pijlers: onderkant op ${pb.min[2]}`);
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
const report = { trusses: stats, partition };
for (const [name, solid, attributes] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    ...(attributes ? { attributes } : {}),
    status: solid.status(),
    genus: solid.genus(),
    components: solid.decompose().length,
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRangeNap: [+(bb.min[2] + WATER_NAP).toFixed(2), +(bb.max[2] + WATER_NAP).toFixed(2)],
    overhangM2: Math.round(overhangArea(solid)),
  };
}
const glbFile = path.join(outDir, "brug-bij-westervoort.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-brug-bij-westervoort.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `brug-bij-westervoort-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Brug bij Westervoort 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
{
  const bb = printSolid.boundingBox();
  report.stl = {
    file: path.join(outDir, stlName),
    status: printSolid.status(),
    genus: printSolid.genus(),
    triangles,
    overhangM2: Math.round(overhangArea(printModel)),
    volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
    sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
  };
}

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Op het water van de IJssel naast de hoofdoverspanning, aan beide zijden.
const samplePoints = [-20, 0, 20].flatMap((x) => [
  [x, 28],
  [x, -30],
]);
const all = union(wholeParts).boundingBox();
await writeFile(
  path.join(outDir, "brug-bij-westervoort.json"),
  JSON.stringify(
    {
      name: "Brug bij Westervoort",
      file: "brug-bij-westervoort.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [194314.0, 442496.8],
      xAxis: [0.68327, -0.73016],
      groundOffsetMetres: GROUND_OFFSET,
      // Laagste PDOK-terreinhoogte (ellipsoïdisch) op de bemonsteringspunten,
      // het water van de IJssel; terugval voor een uitsnede zonder die punten.
      groundHeight: 51.48,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "L0002.18f045ad1db04f3db6bc24bef0972877",
        "L0002.48f2f853f675499eb2d1e6224aa49f76",
        "L0002.52bd3d5999e94d2990fdb1dcdd063d9e",
        "L0002.57e72f7301ac4a51a87759166f3bc2c7",
        "L0002.aed50856ddba407b960116f1edb83703",
        "L0002.c3d8f660562748589355fb93effaf65c",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong midden tussen de twee rivierpijlers op de grens tussen de verkeersbrug en de zuidelijke spoorbrug, op de waterspiegel van de IJssel (z = 0, NAP +8,3 m), +X langs de brug naar Westervoort (RD-richting -46,9 graden vanaf het oosten) en +Y stroomafwaarts naar het noordoosten. Vier bruggen naast elkaar, elk een eigen node: twee enkelsporige spoorbruggen (y = 0,6 tot 7 en 7,4 tot 14) en de verkeersbrug (y = -12,3 tot -0,5), elk met een vakwerkligger van 117 m over de rivier (spoorbruggen gebogen tot NAP +34,0 m, verkeersbrug veelhoekig tot +33,3 m, acht velden met verticalen), en de fietsbrug (y = -18,5 tot -12,6) als A-vakwerk met een vlakke top op NAP +31,3 m waar het fietspad doorheen loopt; de vakwerken zijn dichte wanden van 1 m met doorgaande driehoekige openingen met de punt omhoog en blinde nissen. Aanbruggen over de uiterwaarden van x = -210 tot 345: betonnen liggers onder de sporen, stalen vakwerkliggers onder het wegdek en een plaat op smalle wanden voor het fietspad. De node pijlers heeft de twee gemetselde rivierpijlers, negen aanbrugpijlers met betonnen opleggers en de landhoofden. Drie road-nodes zijn de bovenste 0,5 m van de dekken met de attributen van het BGT-wegdeel erop in extras.attributes, zodat de kleurregels van een thema erop werken: road:spoor (beide spoordekken tussen de vakwerkwanden, bgt_functie spoorbaan, gesloten verharding), road:rijbaan (het wegdek van de verkeersbrug tussen de vakwerkwanden; het inspectiepad buiten de zuidelijke wand blijft constructie; rijbaan regionale weg, gesloten verharding, asfalt) en road:fietspad (het dek van de fietsbrug tussen de zijvlakken van het A-vakwerk; fietspad, gesloten verharding, asfalt); de vakwerkwanden blijven met 2 cm vrij constructie. Windverbanden en portalen tussen de vakwerkwanden, loopbruggen met leuningen, bovenleiding, lantaarns en leuningen zijn weggelaten; de export vult onder de dekken een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(all.max[0] - all.min[0]).toFixed(1),
        widthM: +(all.max[1] - all.min[1]).toFixed(1),
        mainSpanBearingsM: 2 * MAIN.half,
        riverPierCentresM: +(RIVER_PIERS[1].xc - RIVER_PIERS[0].xc).toFixed(1),
        panels: MAIN.panels,
        railTrussCrownNapM: RAIL_TRUSS_TOP(0),
        roadTrussCrownNapM: ROAD_TRUSS_TOP(0),
        fietsTrussTopNapM: FIETS.topNap,
        deckNapM: { rail: RAIL_TOP(0), road: ROAD_TOP(0), fiets: FIETS_TOP(0) },
        approachPierCentresEastM: 43.6,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Brug_bij_Westervoort",
        "PDOK BGT overbruggingsdeel (dekken, rivierpijlers, aanbrugpijlers, wanden fietsbrug, landhoofden) en spoor, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de dekken, de vakwerken, het maaiveld en de waterspiegel",
        "PDOK Luchtfoto RGB (Actueel_orthoHR) voor de plattegrond",
        "Wikimedia Commons: Brug bij Westervoort (1).jpg, Brug bij Westervoort (2).jpg, Westervoort, de Westervoortse Brug foto4 2015-08-20 09.24.jpg, Westervoort, de Westervoortse Brug IMG 8427 2021-02-28 14.22.jpg, Gelderland-26-Bruecke-2010-gje.jpg, The 4 ugly bridges over the IJssel at Westervoort (panoramio), Froma distance the 4 bridges Westervoort are symmetric (panoramio)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

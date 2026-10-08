// Genereert een vereenvoudigd, gesloten 3D-model van de Dr. W. Hupkesbrug:
// de stalen spoorbrug over de Waal tussen Zaltbommel en Waardenburg (Rkm
// 933,5, spoorlijn Utrecht - 's-Hertogenbosch), geopend in 1869 en later
// vernieuwd. Er liggen twee gelijke enkelsporige bruggen naast elkaar, elk met
// twee vakwerkliggers. Over het zomerbed liggen drie overspanningen van circa
// 125 m met een gebogen bovenrand (vakwerk met verticalen, korte steile
// eindstijlen); daarna volgen acht velden van circa 61 m met evenwijdige randen
// over de noordelijke uiterwaard (Waardenburg). De Martinus Nijhoffbrug (A2)
// ligt 75 m stroomafwaarts en hoort niet bij dit model. Alle maten in het
// script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één
// node met de materiaalklasse in de nodenaam) als catalogusbron voor de export
// en de kaart, plus een binaire STL in millimeters op 1:<schaal> met een
// printvoet onder het dek.
//
//   node scripts/generate-hupkesbrug.mjs              # 1:2500 (standaard)
//   node scripts/generate-hupkesbrug.mjs --scale 1000
//
// Met 875 m is de brug op 1:1000 veel te lang voor een printbed; de STL staat
// daarom standaard op 1:2500 (350 mm), zoals de Brug bij Westervoort.
//
// Assenstelsel: oorsprong op de as tussen de twee sporen midden in de middelste
// rivieroverspanning (RD 146323,06, 425598,58), op de waterspiegel van de Waal
// (NAP +2,9 m, het PDOK-water), Z omhoog. +X loopt langs de brug naar het
// noorden (Waardenburg, RD-richting 96,33 graden vanaf het oosten, langs de
// BGT-sporen), +Y stroomafwaarts naar het westen. Het zuidelijke landhoofd
// (Zaltbommel) ligt op x = -194,7 tot -187, de rivierpijlers op x = -62,6,
// 62,9 en 190,3, de pijlers in de uiterwaard om de 61 m tot x = 619 en het
// noordelijke landhoofd op x = 676,6 tot 680,2. De oostelijke brug ligt op
// y < 0, de westelijke op y > 0.
//
// Bronnen: BGT overbruggingsdeel (twee dekken van x = -190,6 tot 680,1,
// rivierpijlers van 8,7 tot 10,3 m dik en 32 tot 39 m lang met spitse en ronde
// koppen, pijlers in de uiterwaard van 6 × 23 m, landhoofden) en BGT spoor (as
// en richting); AHN DSM 0,5 m (PDOK WCS) voor de spoorstaafhoogte (NAP +17,9 m
// op het zuidelijke landhoofd, +18,45 m over de rivier, dalend naar +14,3 m op
// het noordelijke landhoofd), de vier vakwerklijnen (6,6 en 1,0 m oostelijk en
// 0,8 en 6,5 m westelijk van de as) en hun bovenrand (rivieroverspanningen NAP
// +31,0 m in het midden, +26,1 m op 2 m van de oplegging; velden in de
// uiterwaard 6,6 m boven de spoorstaaf); PDOK-luchtfoto (8 cm) voor de twee
// bruggen, de windverbanden en de vakverdeling (circa 6,2 m in de
// rivieroverspanningen, 5,9 m in de uiterwaard); Wikipedia (863 m, 10 pijlers,
// drie overspanningen van 125 m en acht van 61 m); Wikimedia Commons-foto's
// (Zaltbommel Waalbruggen 001.jpg, Bommelse brug en Dr. W. Hupkesbrug.jpg, The
// cable stayed 256 m span Waalbridge at Zaltbommel ... panoramio.jpg, Spoorbrug
// bij Zaltbommel 001.jpg en 002.jpg) voor de vorm van de liggers, het
// vakwerkpatroon en de stenen pijlers; PDOK-terrein voor de waterspiegel
// (46,52 m ellipsoïdisch, NAP = ellipsoïdisch - 43,6 m in de uiterwaard).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hupkesbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts.filter(Boolean));
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
// Plattegrond (BGT, lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
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

// ---------- hoofdmaten (boven de waterspiegel, NAP +2,9 m) ----------
// PDOK legt de Waal bij Zaltbommel op 46,52 m ellipsoïdisch; in de uiterwaard
// ligt het PDOK-terrein circa 43,6 m boven het AHN (NAP), dus de waterspiegel
// van het model ligt op NAP +2,9 m.
const WATER_NAP = 2.9;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de Waal op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 46.51;
const POINTED = (55 * Math.PI) / 180; // zijden van de spitse openingen
const NICHE = 0.35; // diepte van een blinde nis

// Spoorstaafhoogte in NAP (mediaan van het AHN-DSM op de sporen per 15 m):
// +17,9 m op het zuidelijke landhoofd, +18,45 m over de eerste twee
// rivieroverspanningen, daarna dalend met 0,37 % over de derde en 0,78 % over
// de uiterwaard naar +14,3 m op het noordelijke landhoofd.
const RAIL_NAP = table([
  [-195.6, 17.88],
  [-170.6, 18.0],
  [-62.9, 18.42],
  [9.4, 18.48],
  [62.9, 18.4],
  [190.1, 17.93],
  [252.4, 17.65],
  [680.2, 14.3],
]);
const railZ = (x) => Z(RAIL_NAP(x));
// Dek (BGT, AHN): beide bruggen samen van de buitenkant van de oostelijke
// buitenligger tot de dienstweg buiten de westelijke buitenligger; de
// onderkant van de dwarsdragers ligt 1,6 m onder de spoorstaaf (foto's).
const DECK = { x0: -190.6, x1: 680.13, y0: -7.1, y1: 8.6, depth: 1.6 };
const deckBottom = (x) => railZ(x) - DECK.depth;

// Vier vakwerklijnen van 1,0 m dik (AHN-DSM, aandeel cellen meer dan 3 m boven
// de spoorstaaf); tussen de twee bruggen een spleet van 0,8 m. De blinde
// nissen zitten aan de buitenkant van de buitenste en aan de spoorkant van de
// binnenste liggers.
const TRUSSES = [
  { y0: -7.1, y1: -6.1, niche: "y0" },
  { y0: -1.5, y1: -0.5, niche: "y0" },
  { y0: 0.3, y1: 1.3, niche: "y1" },
  { y0: 6.0, y1: 7.0, niche: "y1" },
];

// Opleggingen: de rivierpijlers en de pijlers in de uiterwaard (harten uit de
// BGT); de liggers eindigen 1,4 m (rivier) of 0,7 m (uiterwaard) voor het hart.
const RIVER_PIER_X = [-62.9, 62.9, 190.1];
const FLOOD_PIER_X = [190.1, 252.7, 313.65, 375.0, 436.3, 496.95, 558.3, 619.55, 678.4];
// Rivieroverspanningen: gebogen bovenrand, NAP +31,0 m in het midden (AHN:
// 30,9 tot 31,1 m), 7,7 m boven de spoorstaaf op 2 m van de oplegging en
// daartussen een parabool; de eindstijl loopt steil van 3 m boven de
// spoorstaaf op de oplegging naar dat knooppunt. Twintig vakken (luchtfoto:
// windverbanden om de 6,2 m).
const RIVER = { crown: 31.0, endRise: 7.7, endLength: 2.0, footRise: 3.0, panels: 20 };
const RIVER_SPANS = [
  [-190.6, RIVER_PIER_X[0] - 1.4],
  [RIVER_PIER_X[0] + 1.4, RIVER_PIER_X[1] - 1.4],
  [RIVER_PIER_X[1] + 1.4, RIVER_PIER_X[2] - 1.4],
];
function riverTop(a, b) {
  const m = (a + b) / 2;
  const half = (b - a) / 2 - RIVER.endLength;
  return (x) => {
    const u = Math.min(x - a, b - x);
    const rail = RAIL_NAP(x);
    if (u <= RIVER.endLength) return Z(rail + RIVER.footRise + ((RIVER.endRise - RIVER.footRise) * Math.max(0, u)) / RIVER.endLength);
    const endNap = rail + RIVER.endRise;
    const d = Math.abs(x - m) / half;
    return Z(endNap + (RIVER.crown - endNap) * (1 - d * d));
  };
}
// Velden in de uiterwaard: evenwijdige randen 6,6 m boven de spoorstaaf (AHN:
// NAP +24,2 m bij de eerste en +21,1 m bij de laatste pijler), tien vakken van
// circa 5,9 m (luchtfoto) met verticale eindstijlen.
const FLOOD = { rise: 6.6, panels: 10 };
const FLOOD_SPANS = FLOOD_PIER_X.slice(0, -1).map((x, i) => [
  x + 0.7,
  i + 1 === FLOOD_PIER_X.length - 1 ? 679.4 : FLOOD_PIER_X[i + 1] - 0.7,
]);

// Pijlers (BGT, lokale coördinaten): drie stenen rivierpijlers en zeven
// pijlers in de uiterwaard, alle met een spitse kop stroomopwaarts en een ronde
// stroomafwaarts.
const RIVER_PIERS = [
  [[-63.6, 16.18], [-64.64, 15.45], [-66.58, 13.15], [-67.87, 10.74], [-68.07, -10.63], [-66.79, -13.28], [-65.28, -15.08], [-63.57, -16.23], [-61.43, -14.65], [-59.13, -11.28], [-58.11, -8.56], [-57.8, 3.65], [-58.03, 9.18], [-58.73, 11.33], [-60.34, 13.77], [-62.12, 15.3]],
  [[66.71, -10.93], [67.29, -6.73], [66.86, 7.9], [66.35, 10.17], [65.54, 11.57], [63.18, 14.19], [62.48, 14.29], [61.73, 13.78], [59.29, 10.8], [58.57, 7.87], [58.69, -6.75], [58.74, -9.28], [59.19, -10.88], [60.83, -13.56], [63.17, -15.62], [63.72, -15.29], [65.96, -12.76]],
  [[193.94, 7.55], [194.44, 13.39], [194.4, 14.46], [193.76, 16.11], [190.17, 19.55], [187.55, 17.39], [186.54, 7.57], [186.32, -6.69], [185.76, -12.86], [186.03, -15.06], [187.65, -17.44], [189.08, -18.65], [189.68, -19.0], [190.29, -19.36], [190.89, -18.93], [192.54, -17.36], [193.69, -12.53], [193.69, -6.69]],
];
const FLOOD_PIERS = [
  [[255.01, 9.01], [254.52, 10.05], [254.08, 10.76], [253.23, 11.67], [250.93, 10.11], [249.92, 7.94], [250.21, -6.7], [250.23, -8.22], [250.31, -9.09], [250.55, -9.8], [251.6, -11.48], [252.1, -11.83], [253.78, -11.14], [255.09, -9.89], [255.42, -6.7], [255.27, 7.77]],
  [[313.66, -11.82], [316.06, -9.0], [316.57, -7.34], [316.58, -6.65], [316.41, 7.99], [315.21, 10.39], [314.5, 11.3], [314.01, 11.86], [312.32, 10.76], [311.22, 8.62], [311.16, 7.97], [310.72, -6.66], [310.74, -7.81], [311.1, -9.57], [311.79, -10.61]],
  [[372.11, -7.86], [372.6, -9.19], [373.34, -10.47], [374.43, -11.41], [375.28, -11.74], [376.25, -10.75], [377.28, -9.03], [377.93, -7.39], [378.02, -6.57], [377.57, 8.09], [377.01, 9.45], [375.97, 10.63], [375.04, 11.06], [373.02, 9.29], [372.8, 8.08], [372.03, -6.58]],
  [[436.79, 11.18], [436.17, 11.55], [435.32, 11.12], [434.14, 10.0], [433.37, 8.15], [433.39, -6.62], [433.55, -8.41], [434.47, -10.81], [435.22, -11.86], [435.7, -12.23], [436.78, -12.11], [438.62, -10.0], [439.24, -6.62], [438.05, 8.16], [437.67, 9.69]],
  [[494.77, -10.37], [496.39, -12.18], [498.12, -10.89], [499.11, -9.5], [499.84, -7.9], [499.95, -6.67], [499.54, 8.07], [499.4, 8.69], [498.49, 10.46], [497.28, 11.72], [496.5, 11.71], [494.81, 10.12], [494.67, 8.08], [493.98, -6.67], [494.42, -9.63]],
  [[555.27, 8.82], [555.27, 7.95], [555.12, -6.72], [555.36, -8.41], [555.75, -9.84], [556.41, -10.84], [557.38, -11.65], [558.14, -11.81], [559.34, -10.64], [560.57, -8.7], [561.33, -7.54], [561.54, -6.73], [561.24, 7.94], [560.91, 8.94], [559.53, 10.77], [558.34, 11.58], [556.67, 10.88]],
  [[622.85, -6.79], [622.19, 7.78], [621.68, 8.89], [620.23, 10.92], [619.5, 11.63], [618.22, 11.09], [616.54, 9.12], [616.35, 7.8], [616.27, -6.78], [616.35, -7.59], [616.5, -8.81], [616.7, -9.65], [618.4, -12.24], [620.71, -10.48], [622.44, -8.28]],
];
// Zuidelijk landhoofd (BGT): een pijlervormig blok met ronde koppen tot 20 m
// naast de as, waarvan het middendeel het dek draagt; noordelijk landhoofd
// (BGT) tot de spoorstaaf.
const SOUTH_ABUTMENT = [
  [-194.73, 12.59], [-194.74, 11.76], [-193.59, 11.74], [-193.6, 9.47], [-192.01, 7.88], [-190.93, 7.94], [-190.61, 6.92],
  [-190.6, -6.17], [-191.32, -7.18], [-192.04, -7.93], [-193.63, -9.57], [-193.63, -11.75], [-194.74, -11.74], [-194.72, -12.42],
  [-194.43, -14.27], [-193.8, -16.62], [-192.92, -18.24], [-190.7, -20.36], [-188.85, -18.86], [-187.73, -17.2], [-187.08, -15.11],
  [-187.03, -12.69], [-187.06, -7.1], [-187.15, 7.96], [-187.17, 12.61], [-187.38, 15.7], [-188.52, 18.05], [-189.74, 19.19],
  [-191.09, 20.15], [-192.48, 18.52], [-192.87, 17.93], [-194.03, 16.2], [-194.66, 14.4],
];
const SOUTH_END = -194.74;
const NORTH_ABUTMENT = { x0: 676.63, x1: 680.17, y0: -7.9, y1: 7.89 };

// ---------- vakwerkwand ----------
// Een vakwerk is op 1:1000 niet open te printen. Elke wand is daarom een dichte
// plaat met doorgaande driehoekige openingen met de punt omhoog (binnen elke Λ
// van twee diagonalen, gedeeld door de verticaal) en blinde nissen voor de
// driehoeken met de vlakke kant boven (tussen twee Λ's onder de bovenregel).
// Zijden van openingen die vlakker lopen dan 55 graden worden rond de top
// steiler gezet. De vloer van de openingen ligt per vak 0,5 m boven de hoogste
// spoorstaaf van dat vak.
//
// opts: x0, x1 (opleggingen), panels, top(x) (bovenkant), tc (bovenregel),
// bottom(x) (onderkant van de plaat), floor(x) (vloer van de openingen), wd
// (diagonaal), wv (verticaal), endW (eindstijl).
const openingAngles = [];
function trussSection(opts) {
  const { x0, x1, panels, top, tc, bottom, floor, wd, wv, endW } = opts;
  const P = (x1 - x0) / panels;
  const under = (x) => top(x) - tc;
  const n = Math.max(8, Math.round((x1 - x0) / 0.5));
  const xs = Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
  const outline = [...xs.map((x) => [x, bottom(x)]), ...[...xs].reverse().map((x) => [x, top(x)])];
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
  const fl = nodesX.slice(0, -1).map((x, k) => Math.max(floor(x), floor(nodesX[k + 1])));
  const tanP = Math.tan(POINTED);
  for (let k = 0; k < panels; k++) {
    const t = tops[k];
    const zt = under(t);
    const f = fl[k];
    const dl = k === 0 ? endW : wd / 2;
    const dr = k === panels - 1 ? endW : wd / 2;
    const left = offsetLine(nodesX[k], f, t, zt, dl);
    const right = offsetLine(nodesX[k + 1], f, t, zt, dr);
    for (const { xv, line, dir } of [
      { xv: t - wv / 2, line: left, dir: -1 },
      { xv: t + wv / 2, line: right, dir: 1 },
    ]) {
      const za = Math.min(line.at(xv), under(xv) - 0.15);
      const m = Math.max(Math.abs(line.m), tanP);
      if (za - f < 0.8) continue;
      const xb = xv + (dir * (za - f)) / m;
      if (Math.abs(xb - xv) < 0.4) continue;
      openingAngles.push((Math.atan(m) * 180) / Math.PI);
      holes.push(dir < 0 ? [[xb, f], [xv, f], [xv, za]] : [[xv, f], [xb, f], [xv, za]]);
    }
  }
  // Blinde nissen tussen twee Λ's: driehoek onder de bovenregel.
  for (let k = 0; k + 1 < panels; k++) {
    const xb = nodesX[k + 1];
    const f = Math.max(fl[k], fl[k + 1]);
    const ta = tops[k] + wv / 2;
    const tb = tops[k + 1] - wv / 2;
    const l = offsetLine(xb, f, tops[k], under(tops[k]), -wd / 2);
    const r = offsetLine(xb, f, tops[k + 1], under(tops[k + 1]), -wd / 2);
    const span = 60;
    const above = (line, xa, xc) =>
      new CrossSection([ccw([[xa, line.at(xa)], [xc, line.at(xc)], [xc, line.at(xc) + span], [xa, line.at(xa) + span]])]);
    const m = 24;
    const topPts = Array.from({ length: m + 1 }, (_, i) => {
      const x = ta + ((tb - ta) * i) / m;
      return [x, under(x) - 0.1];
    });
    const cap = new CrossSection([ccw([[ta, f], [tb, f], ...[...topPts].reverse()])]);
    const niche = cap.intersect(above(l, xb - 2 * P, xb + 2 * P)).intersect(above(r, xb - 2 * P, xb + 2 * P));
    if (niche.area() > 0.5) niches.push(niche);
  }
  let plate = new CrossSection([ccw(outline)]);
  plate = plate.subtract(new CrossSection(holes.map(ccw)));
  return { plate, niches: niches.length ? CrossSection.union(niches) : null, holes: holes.length, nicheCount: niches.length };
}

// ---------- liggers ----------
const stats = { river: { holes: 0, niches: 0 }, floodplain: { holes: 0, niches: 0 } };
const girderSolids = [];
const spanSpecs = [
  ...RIVER_SPANS.map(([a, b]) => ({ kind: "river", a, b, panels: RIVER.panels, top: riverTop(a, b), tc: 1.2 })),
  ...FLOOD_SPANS.map(([a, b]) => ({ kind: "floodplain", a, b, panels: FLOOD.panels, top: (x) => railZ(x) + FLOOD.rise, tc: 1.0 })),
];
for (const spec of spanSpecs) {
  const { plate, niches, holes, nicheCount } = trussSection({
    x0: spec.a,
    x1: spec.b,
    panels: spec.panels,
    top: spec.top,
    tc: spec.tc,
    bottom: deckBottom,
    floor: (x) => railZ(x) + 0.5,
    wd: 1.0,
    wv: 0.9,
    endW: 1.2,
  });
  stats[spec.kind].holes += holes * TRUSSES.length;
  stats[spec.kind].niches += nicheCount * TRUSSES.length;
  for (const { y0, y1, niche } of TRUSSES) {
    let wall = extrudeY(plate, y0, y1);
    if (niches) {
      wall =
        niche === "y0"
          ? wall.subtract(extrudeY(niches, y0 - 0.2, y0 + NICHE))
          : wall.subtract(extrudeY(niches, y1 - NICHE, y1 + 0.2));
    }
    girderSolids.push(wall);
  }
}

// ---------- dek, pijlers, landhoofden ----------
const deck = bandY(DECK.x0, DECK.x1, deckBottom, railZ, DECK.y0, DECK.y1, 2);
const centre = (poly) => poly.reduce((s, [x]) => s + x, 0) / poly.length;
const piers = [...RIVER_PIERS, ...FLOOD_PIERS].map((poly) => prism(poly, BASE, deckBottom(centre(poly)) + 0.1));
const abutments = [
  prism(SOUTH_ABUTMENT, BASE, deckBottom(-190.6) + 0.1),
  bandY(SOUTH_END, DECK.x0 + 0.5, () => BASE, (x) => railZ(x) - 0.01, DECK.y0, DECK.y1, 1),
  bandY(NORTH_ABUTMENT.x0, NORTH_ABUTMENT.x1, () => BASE, (x) => railZ(x) - 0.01, NORTH_ABUTMENT.y0, NORTH_ABUTMENT.y1, 1),
];

const bridge = union([deck, ...abutments, ...piers, ...girderSolids]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden die uitloopt in een
// scherm van 0,8 mm (op printschaal) tot de onderplaat.
const KNEE = (50 * Math.PI) / 180;
const SCREEN = Math.max(0.45, 0.4 / mmPerMetre);
const FOOT_X0 = DECK.x0;
const FOOT_X1 = DECK.x1;
const footSteps = Math.round(FOOT_X1 - FOOT_X0);
const footStations = Array.from({ length: footSteps + 1 }, (_, i) => {
  const x = FOOT_X0 + ((FOOT_X1 - FOOT_X0) * i) / footSteps;
  const zb = deckBottom(x) + 0.02;
  const yc = (DECK.y0 + DECK.y1) / 2;
  const w = (DECK.y1 - DECK.y0) / 2 + 0.02;
  const zs = zb - Math.tan(KNEE) * (w - SCREEN);
  const section =
    zs > BASE + 0.05
      ? [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]]
      : (() => {
          const a = w - (zb - BASE) / Math.tan(KNEE);
          return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
        })();
  return { x, section: section.map(([y, z]) => [y + yc, z]) };
});
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van het dek, de pijlerkoppen naast het dek en de
// plafonds van de blinde nissen, in de printversie alleen pijlerkoppen en
// nissen.
const inNiche = (y) =>
  TRUSSES.some(({ y0, y1, niche }) => (niche === "y0" ? y > y0 - 1e-3 && y < y0 + NICHE + 1e-3 : y > y1 - NICHE - 1e-3 && y < y1 + 1e-3));
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  let deckArea = 0;
  let nicheArea = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const yMid = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    if (Math.abs(zMid - deckBottom(xMid)) < 0.15) deckArea += len / 2;
    else if (inNiche(yMid) && zMid > railZ(xMid) + 0.4) nicheArea += len / 2;
    else {
      area += len / 2;
      if (len / 2 > 0.01) console.log("overhang op", [xMid, yMid, zMid].map((c) => +c.toFixed(2)));
    }
  }
  return { area, deckArea, nicheArea };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
const minAngle = openingAngles.reduce((a, b) => Math.min(a, b), Infinity);
{
  const model = overhangs(bridge);
  console.log("vrij hangend (m2): dek en pijlerkoppen", Math.round(model.deckArea), "nissen", Math.round(model.nicheArea), "overig", +model.area.toFixed(2));
  if (model.area > 0.5) throw new Error("overhang buiten dek en nissen");
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2): dek en pijlerkoppen", +print.deckArea.toFixed(2), "overig", +print.area.toFixed(2));
  if (print.area > 0.5) throw new Error("printversie heeft overhang");
  console.log("openingen", stats, "steilste flank min (graden)", +minAngle.toFixed(1));
  if (minAngle < 50) throw new Error("opening met een te vlakke flank");
}

// ---------- spoor als eigen onderdeel ----------
// De bovenste 0,5 m van het dek tussen de vakwerkliggers van elke brug is een
// eigen node met de attributen van het BGT-wegdeel (glTF
// `extras.attributes`), zodat de kleurregels van een thema (bijvoorbeeld
// spoor zwart) op het brugdek werken zoals op de PDOK-wegdelen ernaast. Op
// het dek liggen twee actuele BGT-wegdelen (relatieve hoogteligging 1, over
// de hele lengte van het dek), beide spoorbaan, half verhard, zonder
// plus-fysiek voorkomen. Contouren in lokale coördinaten, vereenvoudigd tot
// 5 cm (Douglas-Peucker, de ring in twee helften).
// Wordt pas hier gebouwd, nadat het printmodel is doorgerekend, zodat de STL
// gelijk blijft.
const BGT_TRACKS = {
  // Westelijke brug (y > 0).
  "L0004.e607835fefa341edaa47d39c3203746f": [[632.52, 2.38], [680.11, 2.41], [680.11, 5.13], [637.92, 5.09], [628.34, 5.01], [600.72, 5.13], [543.83, 5.14], [481.15, 5], [450.6, 5.14], [424.58, 5.02], [387.81, 5.04], [361.55, 4.96], [275.88, 5.03], [263.94, 4.97], [234.05, 5.07], [125.07, 4.94], [-190.6, 5.02], [-190.59, 2.38], [-138.54, 2.32], [-43.86, 2.36], [37.99, 2.29], [62.75, 2.36], [80.09, 2.22], [93.96, 2.35], [164.91, 2.28], [200.78, 2.37], [224.12, 2.26], [255.09, 2.4], [298.31, 2.32], [341.63, 2.36], [360.67, 2.28], [432.74, 2.45], [452.71, 2.28], [504.91, 2.39], [535.15, 2.25], [571.79, 2.45], [602.71, 2.3]],
  // Oostelijke brug (y < 0).
  "L0004.e98e9ba5544848b8a5e7cfdeebf671da": [[629.29, -5.16], [680.12, -5.13], [680.12, -2.44], [577.43, -2.39], [185.36, -2.54], [101.73, -2.47], [32.4, -2.58], [-32.77, -2.51], [-163.46, -2.53], [-190.56, -2.5], [-190.55, -5.15], [-134.8, -5.21], [-102.51, -5.13], [-36.19, -5.14], [-19.39, -5.21], [386.53, -5.15], [411.9, -5.22]],
};
const LAYER = 0.5;
const ABOVE = 1.0;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "half verhard" };
// Spoorbed van elke brug: tussen de binnenkant van de buitenste en de
// binnenste ligger, met 2 cm vrij van de vakwerkplaten (ook waar de plaat
// openingen heeft). De BGT-spoorbaanvlakken (2,7 tot 2,9 m breed) liggen
// helemaal binnen deze bedden; het hele bed is spoor, zodat de constructie
// tussen de liggers geen eigen vlak op het dek houdt. De spleet tussen de
// bruggen, de rand buiten de oostelijke ligger en de dienstweg buiten de
// westelijke blijven constructie.
const GUARD = 0.02;
const TRACK_BEDS = [
  [TRUSSES[0].y1 + GUARD, TRUSSES[1].y0 - GUARD],
  [TRUSSES[2].y1 + GUARD, TRUSSES[3].y0 - GUARD],
];
for (const [id, poly] of Object.entries(BGT_TRACKS)) {
  if (!poly.every(([, y]) => TRACK_BEDS.some(([y0, y1]) => y > y0 && y < y1))) throw new Error(`${id} ligt niet in een spoorbed`);
}
// De strook loopt over dezelfde loftstations als het dek (de spoorstaaf
// tussen twee stations is daar een rechte lijn), van 0,5 m onder tot 1 m
// boven de spoorstaaf, en 0,5 m voorbij de uiteinden van het dek, zodat hij
// geen vlak met de kopse kanten deelt.
const deckSteps = Math.max(1, Math.round((DECK.x1 - DECK.x0) / 2));
const layerXs = [
  DECK.x0 - 0.5,
  ...Array.from({ length: deckSteps + 1 }, (_, i) => DECK.x0 + ((DECK.x1 - DECK.x0) * i) / deckSteps),
  DECK.x1 + 0.5,
];
const trackStrip = union(
  TRACK_BEDS.map(([y0, y1]) =>
    loftX(
      layerXs.map((x) => {
        const zt = railZ(x);
        return { x, section: [[y0, zt - LAYER], [y1, zt - LAYER], [y1, zt + ABOVE], [y0, zt + ABOVE]] };
      }),
    ),
  ),
);
const track = trackStrip.intersect(bridge);
const structure = bridge.subtract(trackStrip);
const parts = [
  ["building:hupkesbrug", structure],
  ["road:spoor", track, SPOOR_ATTRIBUTES],
];
{
  const whole = bridge.volume();
  const sum = structure.volume() + track.volume();
  console.log(
    "volumes (m3): brug",
    +whole.toFixed(2),
    "constructie",
    +structure.volume().toFixed(2),
    "spoor",
    +track.volume().toFixed(2),
    "som - brug",
    +(sum - whole).toFixed(4),
  );
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
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
    meshes.push({ name, primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }] });
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
const report = {};
for (const [name, solid, attributes] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    ...(attributes ? { attributes } : {}),
    status: solid.status(),
    genus: solid.genus(),
    components: solid.decompose().length,
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRangeNap: [+(bb.min[2] + WATER_NAP).toFixed(2), +(bb.max[2] + WATER_NAP).toFixed(2)],
  };
}
report.trusses = {
  riverSpansM: RIVER_SPANS.map(([a, b]) => +(b - a).toFixed(2)),
  floodplainSpansM: FLOOD_SPANS.map(([a, b]) => +(b - a).toFixed(2)),
  ...stats,
  minFlankDeg: +minAngle.toFixed(1),
  riverCrownNap: RIVER_SPANS.map(([a, b]) => +(riverTop(a, b)((a + b) / 2) + WATER_NAP).toFixed(2)),
  floodplainTopNap: [+(railZ(FLOOD_SPANS[0][0]) + FLOOD.rise + WATER_NAP).toFixed(2), +(railZ(FLOOD_SPANS.at(-1)[1]) + FLOOD.rise + WATER_NAP).toFixed(2)],
};
const glbFile = path.join(outDir, "hupkesbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-hupkesbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `hupkesbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Dr. W. Hupkesbrug 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
{
  const bb = printSolid.boundingBox();
  report.stl = {
    file: path.join(outDir, stlName),
    status: printSolid.status(),
    genus: printSolid.genus(),
    triangles,
    printFootM3: Math.round(printFoot.volume()),
    volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
    sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
  };
}

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Op het water van de Waal naast de eerste twee rivieroverspanningen, aan
// beide zijden, verspreid over 220 m.
const samplePoints = [-170, -120, 0, 50].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
const all = bridge.boundingBox();
await writeFile(
  path.join(outDir, "hupkesbrug.json"),
  JSON.stringify(
    {
      name: "Dr. W. Hupkesbrug",
      file: "hupkesbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [146323.06, 425598.58],
      xAxis: [-0.11022, 0.99391],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      // Op het water van de Waal naast de rivieroverspanningen, aan beide zijden.
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as tussen de twee sporen midden in de middelste rivieroverspanning op de waterspiegel van de Waal (z = 0, NAP +2,9 m) in de oorsprong, +X langs de brug naar het noorden (Waardenburg, RD-richting 96,33 graden vanaf het oosten) en +Y stroomafwaarts naar het westen. Twee nodes: road:spoor, de bovenste 0,5 m van het dek tussen de vakwerkliggers van elke brug (twee spoorbedden van 4,6 m) met de attributen van de BGT-wegdelen op het dek in extras.attributes (bgt_functie spoorbaan, bgt_fysiekvoorkomen half verhard), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, twee enkelsporige spoorbruggen naast elkaar met samen een dek van 15,7 m breed van het zuidelijke landhoofd in Zaltbommel (x = -194,7) tot het noordelijke (x = 680,2), met de spoorstaaf op NAP +17,9 tot +18,5 m over de rivier, dalend naar +14,3 m; vier vakwerkliggers (6,6 en 1,0 m oostelijk, 0,8 en 6,5 m westelijk van de as) als dichte platen van 1,0 m met doorgaande driehoekige openingen met de punt omhoog en blinde nissen: drie rivieroverspanningen van circa 124 m met een gebogen bovenrand tot NAP +31,0 m en korte steile eindstijlen, en acht velden van circa 60 m over de uiterwaard met evenwijdige randen 6,6 m boven de spoorstaaf, alle met verticalen; drie stenen rivierpijlers en zeven pijlers in de uiterwaard met spitse en ronde koppen (BGT). Windverbanden en portalen tussen de liggers, bovenleiding, leuningen en de Martinus Nijhoffbrug (75 m stroomafwaarts) zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de rivieroverspanningen bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(all.max[0] - all.min[0]).toFixed(1),
        deckWidthM: +(DECK.y1 - DECK.y0).toFixed(1),
        riverSpansM: RIVER_SPANS.map(([a, b]) => +(b - a).toFixed(1)),
        floodplainSpansM: FLOOD_SPANS.map(([a, b]) => +(b - a).toFixed(1)),
        riverPierCentresM: RIVER_PIER_X,
        trussLinesFromAxisM: TRUSSES.map(({ y0, y1 }) => +((y0 + y1) / 2).toFixed(2)),
        riverTrussCrownNapM: RIVER.crown,
        floodplainTrussAboveRailM: FLOOD.rise,
        railNapM: { south: RAIL_NAP(-195.6), river: RAIL_NAP(9.4), north: RAIL_NAP(680.2) },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Dr._W._Hupkesbrug",
        "PDOK BGT overbruggingsdeel (dekken, pijlers, landhoofden) en spoor, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de spoorstaaf, de vakwerklijnen en hun bovenrand",
        "PDOK Luchtfoto RGB (Actueel_orthoHR) voor de twee bruggen en de vakverdeling",
        "Wikimedia Commons: Zaltbommel Waalbruggen 001.jpg, Bommelse brug en Dr. W. Hupkesbrug.jpg, The cable stayed 256 m span Waalbridge at Zaltbommel from 1992-1996. Behind it the old steel railway bridges - panoramio.jpg, Spoorbrug bij Zaltbommel 001.jpg, Spoorbrug bij Zaltbommel 002.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

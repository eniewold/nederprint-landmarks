// Genereert een vereenvoudigd, gesloten 3D-model van de Edithbrug: de
// enkelsporige spoorbrug van de lijn 's-Hertogenbosch - Nijmegen over de Maas
// tussen Ravenstein (zuidwest) en Niftrik (noordoost), in deze vorm sinds 1946
// (hersteld in 1948). Vier gelijke stalen boogbruggen van circa 63 m achter
// elkaar (boog met verstijvingsligger: twee boogribben met een volle wand en
// platte verticale hangers boven twee doorgaande plaatliggers, met een
// windverband tussen de ribben), aan de noordoostkant twee plaatliggerbruggen
// van circa 44 m over de uiterwaard, op vijf gemetselde pijlers die aan de
// oostkant 10 m breder zijn dan de brug (voor een tweede spoor dat er nooit
// kwam) en twee landhoofden. Een looppad ligt aan de westkant buiten de
// liggers. Alle maten in het script zijn meters op ware grootte. Uitvoer: een
// GLB in meters (Y omhoog, nodes met de materiaalklasse in de nodenaam: de
// constructie, en het spoor met de attributen van het BGT-wegdeel) als
// catalogusbron voor de export en de kaart, plus een binaire STL in millimeters
// op 1:<schaal> met een printvoet onder het dek. De brug is 341 m lang en past
// op 1:1000 in 400 mm.
//
//   node scripts/generate-edithbrug.mjs              # STL op 1:1000 (standaard)
//   node scripts/generate-edithbrug.mjs --scale 1250
//
// Assenstelsel: oorsprong op de spooras (BGT-spoorhartlijn) in het hart van de
// middelste pijler, tussen de tweede en de derde boog (RD 173425,65,
// 423658,51), op de waterspiegel van de Maas zoals het PDOK-terrein die legt
// (NAP +5,10 m), Z omhoog. +X loopt langs de brug naar het noordoosten
// (Niftrik, RD-richting 31,77 graden vanaf het oosten), +Y naar het
// noordwesten (stroomafwaarts). De pijlers staan op x = -63,25, 0, 63,34,
// 126,94 en 170,58; het zuidelijke landhoofd op x = -126,9 tot -124,7, het
// noordelijke op x = 212,5 tot 214,4; het dek loopt van x = -126,51 tot 214,13.
//
// Bronnen: BGT overbruggingsdeel (dek L0004.0eae333b..., de vijf pijlers met
// spitse koppen en de twee landhoofden), BGT wegdeel (spoorbaan op het dek,
// L0004.9833e744..., relatieve hoogteligging 1, ook voor de attributen) en BGT
// spoor (hartlijn, as van het model); AHN DSM 0,5 m (PDOK WCS) voor de
// spoorhoogte (NAP +15,03 m over de eerste twee bogen, daarna 8 promille
// dalend tot +13,25 m bij Niftrik), de bovenrand van de boogribben (parabool,
// 11,07 m boven het spoor in de top, NAP +26,1 m bij de eerste twee bogen), de
// ligging van de ribben en liggers (2,8 m naast de as), het looppad aan de
// westkant (tot 4,6 m naast de as, NAP +15,2 m), de bovenkant van de
// plaatliggers van de aanbruggen (1,2 m boven het spoor) en de koppen van de
// pijlers (NAP +12,65, +12,70, +12,12, +11,58 en +10,75 m) en landhoofden
// (+12,65 en +10,9 m); PDOK-terrein voor het water (48,80 m ellipsoïdisch;
// het PDOK-terrein ligt hier 43,70 m boven het AHN, op de uiterwaard
// gemeten); PDOK-luchtfoto voor de hangers (12 velden per boog) en het
// windverband (dwarsregels op de hangers met kruisende diagonalen tussen de
// ribben); Wikipedia (vier boogbruggen achter elkaar, enkelsporig, pijlers
// breed genoeg voor een tweede brug); Wikimedia Commons-foto's (Edithbrug
// vanaf Niftrik.JPG, Railway bridge Edithbrug on the Niftrik side.jpg, WLM -
// 23dingenvoormusea - Spoorbrug over de Maas bij Ravenstein.jpg, Tussen
// Ravenstein en Niftrik, spoorbrug over de Maas foto5 2016-04-20 10.59.jpg)
// voor de volle boogribben, de platte hangers, de plaatliggers met verstijvers,
// het portaal en het windverband onder de top en de gemetselde pijlers met
// plint en deklijst. Geschat zijn de waterspiegel (NAP +5,10 m), de
// ribhoogte (1,1 m), de staafmaten (ribben, hangers en liggers 0,9 m breed),
// de hoogte van de verstijvingsliggers (van 1,6 m onder tot 0,6 m boven het
// spoor) en van de plaatliggers (van 2,0 m onder tot 1,2 m boven het spoor),
// de dekplaat (1,0 m), de oplegblokken, de plint (tot NAP +8,3 m) en deklijst
// van de pijlers, en het windverband (regels 0,9 m, 0,3 m onder de bovenrand).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "edithbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const rad = (deg) => (deg * Math.PI) / 180;
const T50 = Math.tan(rad(50));
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
// Polygoon of CrossSection in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (shape, y0, y1) =>
  Manifold.extrude(shape instanceof CrossSection ? shape : [ccw(shape)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const rect = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const boxFromTo = (x0, x1, y0, y1, z0, z1) => prism(rect(Math.min(x0, x1), Math.max(x0, x1), Math.min(y0, y1), Math.max(y0, y1)), Math.min(z0, z1), Math.max(z0, z1));
const offsetPoly = (poly, d) => new CrossSection([ccw(poly)]).offset(d, "Round", 2, 16).toPolygons()[0].map(([x, y]) => [x, y]);
const hullPoly = (poly) => new CrossSection([ccw(poly)]).hull().toPolygons()[0].map(([x, y]) => [x, y]);
// Kraag: van de plattegrond `inner` op z0 schuin (hoek `deg`) naar `outer` en
// dan recht omhoog tot z1. Beide plattegronden convex.
function flare(inner, outer, d, z0, z1, deg = 50) {
  const zTop = z0 + d * Math.tan(rad(deg));
  return union([Manifold.hull([prism(inner, z0, z0 + 0.01), prism(outer, zTop, zTop + 0.01)]), prism(outer, zTop, z1)]);
}
// Loft langs X: per station een doorsnede in het YZ-vlak (tegen de klok in
// gezien vanaf +X, steeds evenveel punten, stervormig vanaf het eerste punt).
function loftX(stations, label = "loft") {
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
  const solid = new Manifold(new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }));
  if (solid.status() !== "NoError") throw new Error(`${label}: ${solid.status()}`);
  if (solid.volume() <= 0) throw new Error(`${label}: omgekeerde doorsnede`);
  return solid;
}
const range = (a, b, step) => {
  const n = Math.max(1, Math.round((b - a) / step));
  return Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n);
};
const sortedUnique = (xs) => [...xs].sort((a, b) => a - b).filter((x, i, arr) => i === 0 || x - arr[i - 1] > 1e-4);
// Spitse hoeken (< 80 graden) van een opening krijgen een kort verticaal stuk
// van `h` meter, anders blijft in de hoek een spleet zonder dikte.
function bluntAcute(poly, h = 0.15) {
  const pts = ccw(poly);
  const n = pts.length;
  const out = [];
  for (let i = 0; i < n; i++) {
    const v = pts[i];
    const prev = pts[(i + n - 1) % n];
    const next = pts[(i + 1) % n];
    const a = [prev[0] - v[0], prev[1] - v[1]];
    const b = [next[0] - v[0], next[1] - v[1]];
    const cross = (v[0] - prev[0]) * (next[1] - v[1]) - (v[1] - prev[1]) * (next[0] - v[0]);
    const ang = Math.acos((a[0] * b[0] + a[1] * b[1]) / (Math.hypot(...a) * Math.hypot(...b)));
    if (cross <= 0 || ang > rad(80) || Math.abs(a[0]) < 1e-6 || Math.abs(b[0]) < 1e-6) {
      out.push(v);
      continue;
    }
    const steepIsA = Math.abs(a[1] / a[0]) > Math.abs(b[1] / b[0]);
    const st = steepIsA ? a : b;
    const fl = steepIsA ? b : a;
    if (Math.abs(st[1]) < 2 * h) {
      out.push(v);
      continue;
    }
    const ts = h / Math.abs(st[1]);
    const qs = [v[0] + st[0] * ts, v[1] + st[1] * ts];
    const tf = (qs[0] - v[0]) / fl[0];
    if (tf <= 0 || tf >= 1) {
      out.push(v);
      continue;
    }
    const qf = [v[0] + fl[0] * tf, v[1] + fl[1] * tf];
    if (steepIsA) out.push(qs, qf);
    else out.push(qf, qs);
  }
  return out;
}

// ---------- hoogtes ----------
// PDOK legt de Maas bij de brug op 48,80 m ellipsoïdisch; het PDOK-terrein
// ligt hier 43,70 m boven het AHN (uiterwaard: PDOK 51,2 m, AHN NAP +7,5 m),
// dus NAP +5,10 m.
const WATER_NAP = 5.1;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// PDOK-hoogte (ellipsoïdisch) van het water op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 48.8;

// Bovenkant spoor (spoorstaaf) in NAP uit het AHN (25e percentiel over de
// spoorstrook per 4 m): vlak over de eerste twee bogen, met een
// overgangsboog naar een helling van 8 promille tot het noordelijke landhoofd.
const RAIL_NAP = [
  [-126.51, 15.02],
  [-18.51, 15.03],
  [-2.51, 14.97],
  [13.49, 14.88],
  [209.49, 13.28],
  [214.49, 13.25],
];
const RAIL_XS = RAIL_NAP.map(([x]) => x);
function railNap(x) {
  if (x <= RAIL_NAP[0][0]) return RAIL_NAP[0][1];
  for (let i = 0; i + 1 < RAIL_NAP.length; i++) {
    const [x0, z0] = RAIL_NAP[i];
    const [x1, z1] = RAIL_NAP[i + 1];
    if (x <= x1) return z0 + ((z1 - z0) * (x - x0)) / (x1 - x0);
  }
  return RAIL_NAP[RAIL_NAP.length - 1][1];
}
const rail = (x) => Z(railNap(x));
// Stations voor lofts over [a, b] om de `step` meter, plus de knikken van het spoor.
const deckStations = (a, b, step = 2) => sortedUnique([...range(a, b, step), ...RAIL_XS.filter((x) => x > a && x < b)]);

// ---------- plattegrond (BGT, lokale coördinaten, vereenvoudigd tot 5 cm) ----------
const DECK_X0 = -126.51; // begin van het BGT-dek op het zuidelijke landhoofd
const DECK_X1 = 214.13; // einde van het BGT-dek op het noordelijke landhoofd
// Pijlers met spitse koppen (stroomopwaarts aan de oostkant, -Y, de kant die
// 10 m breder is dan de brug).
const PIERS = [
  // L0002.e70d37451a304a0d837ed103592e4baa
  { x: -63.25, topNap: 12.65, poly: [[-62.05, -12.09], [-61.57, -10.76], [-61.39, 3.19], [-62.09, 4.98], [-62.89, 6.0], [-63.43, 6.43], [-64.48, 5.4], [-65.36, 3.83], [-65.49, -10.73], [-64.69, -12.64], [-63.57, -13.59]] },
  // L0002.7487b1bde61145949070dd3a7cd12d02 (de middelste pijler, opgeblazen in 1944)
  { x: 0.0, topNap: 12.7, poly: [[-0.19, 6.51], [-0.54, 6.29], [-1.44, 5.03], [-2.14, 3.19], [-1.97, -10.39], [-1.57, -11.86], [0.03, -13.72], [1.24, -12.68], [2.13, -11.03], [2.19, 2.26], [1.99, 4.1], [1.13, 5.62]] },
  // G0296.7da54c531b5d437882ff4ed05b4ce36c
  { x: 63.34, topNap: 12.12, poly: [[61.92, 4.7], [61.71, 3.9], [61.68, -10.64], [61.77, -11.64], [62.05, -12.17], [62.76, -12.86], [63.48, -13.2], [63.68, -13.17], [64.01, -12.94], [65.16, -11.64], [65.64, -10.71], [65.59, -5.74], [65.27, 4.33], [64.88, 4.88], [64.05, 5.74], [63.69, 5.92], [63.3, 5.98], [62.91, 5.88], [62.57, 5.68], [62.07, 5.06]] },
  // G0296.a1ab83a2f79c44ecba7e9d7a45e2b697
  { x: 126.94, topNap: 11.58, poly: [[125.45, -10.56], [125.56, -11.56], [125.85, -12.08], [126.57, -12.77], [127.29, -13.08], [127.49, -13.03], [127.96, -12.66], [128.71, -11.73], [129.39, -10.5], [128.94, 3.94], [128.6, 4.8], [127.96, 5.51], [127.62, 5.73], [127.24, 5.86], [126.66, 5.76], [126.31, 5.55], [126.04, 5.27], [125.78, 4.79], [125.42, 3.37]] },
  // G0296.097ba30d441e42b1a40d1dad0fb2b88f
  { x: 170.58, topNap: 10.75, poly: [[169.1, -10.48], [169.15, -11.28], [169.41, -11.82], [170.3, -12.62], [170.81, -12.93], [171.01, -12.96], [171.64, -12.48], [172.27, -11.7], [172.43, -11.34], [172.52, -10.49], [172.51, -3.1], [172.19, 3.56], [171.38, 4.96], [170.87, 5.45], [170.45, 5.62], [169.95, 5.22], [169.29, 4.12], [168.93, 2.77], [169.09, -3.1]] },
];
// Landhoofden: de voorwand met vleugels (BGT) tot de opleghoogte (AHN).
const ABUT_S = {
  // L0004.0df7e834f13d46a69e1650ecefd77fa7
  topNap: 12.65,
  poly: [[-124.73, 4.86], [-124.74, 11.1], [-125.61, 11.03], [-126.15, 7.52], [-126.28, 5.69], [-126.91, 5.8], [-126.96, 3.36], [-126.51, 3.33], [-126.66, -11.9], [-126.89, -11.97], [-126.9, -12.92], [-126.6, -14.6], [-125.58, -17.78], [-125.03, -17.95]],
};
const ABUT_N = {
  // G0296.9f97297a591f41c7825391e61baaf7f3
  topNap: 10.9,
  poly: [[212.45, 3.1], [212.54, -15.91], [213.43, -15.67], [213.92, -15.09], [214.36, -12.61], [213.91, 7.73], [212.45, 7.79]],
};

// ---------- doorsnede ----------
// Ribben, hangers en hoofdliggers liggen in één vlak 2,8 m naast de as (AHN),
// 0,9 m breed (|y| 2,35 tot 3,25). Dekplaat tussen de liggers 1,0 m. Looppad
// aan de westkant (+Y) buiten de ligger tot 4,6 m naast de as (bij de
// plaatliggers 5,0 m; BGT), bovenkant 0,2 m boven het spoor (AHN), rand 0,35 m
// met een onderkant onder 46 graden naar de ligger (die zo boven de onderkant
// van de ligger blijft).
const PLANE = { y: 2.8, w: 0.9 };
const IN = PLANE.y - PLANE.w / 2; // 2,35
const OUT = PLANE.y + PLANE.w / 2; // 3,25
const SLAB = 1.0;
const WALK = { up: 0.2, edge: 0.35, narrow: 4.6, wide: 5.0, change: 171.38, slope: Math.tan(rad(46)) };
// Verstijvingsligger onder de bogen en plaatligger van de aanbruggen (boven en
// onder ten opzichte van het spoor).
const ARCH_GIRDER = { up: 0.6, down: 1.6 };
const PLATE_GIRDER = { up: 1.2, down: 2.0 };
// Verticale verstijvers aan de buitenkant van de liggers, 0,25 m dik en 0,9 m breed.
const STIFF = { t: 0.25, w: 0.9, platePitch: 3.65 };
// Openingen bij de pijlers tussen twee overspanningen.
const JOINT = 0.45;

// ---------- bogen ----------
// Vier gelijke bogen; de bovenrand van de rib is een parabool die in het
// midden 11,07 m boven de koorde van het spoor ligt en tussen de opleggingen
// (pijlerharten) 10,7 m daalt (AHN, op het maximum per 2 m langs de ribben).
// Ribhoogte 1,1 m (foto's). Twaalf velden per boog met elf platte hangers van
// 0,9 m (luchtfoto).
const ARCH = { rise: 11.07, k: 0.0107, depth: 1.1, panels: 12, hanger: 0.9 };
const BEARINGS = [-125.6, ...PIERS.slice(0, 4).map((p) => p.x)]; // zuidelijk landhoofd en vier pijlers
const ARCHES = BEARINGS.slice(0, 4).map((b0, k) => {
  const b1 = BEARINGS[k + 1];
  const m = (b0 + b1) / 2;
  const x0 = k === 0 ? DECK_X0 : b0 + JOINT;
  const x1 = b1 - JOINT;
  const chord = (x) => rail(b0) + ((rail(b1) - rail(b0)) * (x - b0)) / (b1 - b0);
  const top = (x) => chord(x) + ARCH.rise - ARCH.k * (x - m) ** 2;
  const low = (x) => top(x) - ARCH.depth * Math.hypot(1, 2 * ARCH.k * (x - m));
  const panel = (b1 - b0) / ARCH.panels;
  const hangers = Array.from({ length: ARCH.panels - 1 }, (_, i) => b0 + panel * (i + 1));
  return { k, b0, b1, m, x0, x1, chord, top, low, panel, hangers };
});
const archGirderTop = (x) => rail(x) + ARCH_GIRDER.up;

// Openingen in het vlak tussen ligger en rib: tussen twee hangers een
// opening met verticale zijden en een spitse top met flanken van 50 graden
// onder de rib; tussen de oplegging en de eerste hanger een driehoek met de top
// tegen de hanger. Zo hangt boven het dek niets vrij.
function archOpenings(arch) {
  const holes = [];
  const apexes = [];
  const h = arch.hangers;
  for (let i = 0; i + 1 < h.length; i++) {
    const a = h[i] + ARCH.hanger / 2;
    const b = h[i + 1] - ARCH.hanger / 2;
    // Kies de top zo dat de opening zo groot mogelijk is; bij de uiteinden,
    // waar de rib schuin loopt, schuift hij naar de hoge kant.
    const cell = new CrossSection([ccw([[a, archGirderTop(a) - 0.01], [b, archGirderTop(b) - 0.01], [b, 100], [a, 100]])]);
    let best = null;
    for (let xc = a; xc <= b + 1e-9; xc += 0.1) {
      let top = Infinity;
      for (let s = 0; s <= 100; s++) {
        const x = a + ((b - a) * s) / 100;
        top = Math.min(top, arch.low(x) - 0.05 + T50 * Math.abs(x - xc));
      }
      const gable = new CrossSection([[[xc - 100, top - T50 * 100], [xc + 100, top - T50 * 100], [xc, top]]]);
      const cut = cell.intersect(gable);
      const area = cut.area();
      if (!best || area > best.area) best = { area, cut, top };
    }
    if (!best || best.area < 2.0 || best.top - Math.max(archGirderTop(a), archGirderTop(b)) < 1.5) continue;
    for (const poly of best.cut.toPolygons()) holes.push(bluntAcute(poly.map(([x, z]) => [x, z])));
    apexes.push(+(best.top + WATER_NAP).toFixed(2));
  }
  for (const sgn of [-1, 1]) {
    const xa = sgn < 0 ? h[0] - ARCH.hanger / 2 : h[h.length - 1] + ARCH.hanger / 2;
    const floor = archGirderTop(xa);
    const zTop = arch.low(xa) - 0.3;
    if (zTop - floor < 1.0) continue;
    const run = (zTop - floor) / T50;
    holes.push(bluntAcute([[xa, floor - 0.01], [xa + sgn * run, archGirderTop(xa + sgn * run) - 0.01], [xa, zTop]]));
  }
  return { holes, apexes };
}

// Eén boogoverspanning: twee verstijvingsliggers met verstijvers op de
// hangers, de ribben met het hangervlak, en het windverband.
function archSpan(arch) {
  const { x0, x1 } = arch;
  const parts = [];
  // Rib en hangervlak: van binnen de ligger tot de bovenrand van de rib, over
  // het stuk waar de rib boven de ligger uitkomt.
  const xs = range(x0, x1, 0.5).filter((x) => arch.top(x) > archGirderTop(x) + 0.02);
  const band = [...xs.map((x) => [x, rail(x)]), ...[...xs].reverse().map((x) => [x, arch.top(x)])];
  const { holes, apexes } = archOpenings(arch);
  arch.apexes = apexes;
  arch.openings = holes.length;
  for (const side of [-1, 1]) {
    const y0 = side > 0 ? IN : -OUT;
    const y1 = side > 0 ? OUT : -IN;
    const girder = loftX(
      deckStations(x0, x1).map((x) => ({ x, section: [[y0, rail(x) - ARCH_GIRDER.down], [y1, rail(x) - ARCH_GIRDER.down], [y1, archGirderTop(x)], [y0, archGirderTop(x)]] })),
      `ligger boog ${arch.k}`,
    );
    const plate = profileY(band, y0, y1).subtract(union(holes.map((p) => profileY(p, y0 - 0.5, y1 + 0.5))));
    // Verstijvers aan de buitenkant op de hangers en aan de uiteinden.
    const ys = side > 0 ? [OUT - 0.01, OUT + STIFF.t] : [-OUT - STIFF.t, -OUT + 0.01];
    const stiffeners = [...arch.hangers, x0 + STIFF.w / 2, x1 - STIFF.w / 2].map((xh) =>
      boxFromTo(xh - STIFF.w / 2, xh + STIFF.w / 2, ys[0], ys[1], rail(xh) - ARCH_GIRDER.down, archGirderTop(xh) - 0.05),
    );
    parts.push(girder, plate, ...stiffeners);
  }
  parts.push(windBracing(arch));
  return union(parts);
}

// Windverband tussen de ribben (luchtfoto en foto's): dwarsregels op de
// hangers waar de rib meer dan 6 m boven het spoor ligt, de buitenste als
// portaal van 1,2 m breed, met kruisende diagonalen ertussen; staven 0,9 m
// breed, bovenkant 0,3 m onder de bovenrand van de rib, in het midden 0,9 m
// dik (portaal 1,3 m) met de onderkant onder 47 graden naar de ribben, zodat
// het zonder steun print vanaf de ribben en hangers.
const BRACE = { drop: 0.3, thick: 0.9, portalThick: 1.3, bar: 0.9, portal: 1.2, slope: rad(47), reach: 21.6 };
const BY = IN + 0.05;
function bar([x0, y0], [x1, y1], w, ext = 1.5) {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * (w / 2);
  const ny = (dx / len) * (w / 2);
  const ex = (dx / len) * ext;
  const ey = (dy / len) * ext;
  return new CrossSection([ccw([[x0 - ex + nx, y0 - ey + ny], [x1 + ex + nx, y1 + ey + ny], [x1 + ex - nx, y1 + ey - ny], [x0 - ex - nx, y0 - ey - ny]])]);
}
function windBracing(arch) {
  const nodes = arch.hangers.filter((x) => Math.abs(x - arch.m) <= BRACE.reach);
  const xa = nodes[0];
  const xb = nodes[nodes.length - 1];
  const bars = nodes.map((x) => bar([x, -BY], [x, BY], x === xa || x === xb ? BRACE.portal : BRACE.bar));
  for (let i = 0; i + 1 < nodes.length; i++) {
    bars.push(bar([nodes[i], -PLANE.y], [nodes[i + 1], PLANE.y], BRACE.bar), bar([nodes[i], PLANE.y], [nodes[i + 1], -PLANE.y], BRACE.bar));
  }
  let lattice = CrossSection.union(bars);
  const xl = xa - BRACE.portal / 2;
  const xr = xb + BRACE.portal / 2;
  lattice = lattice.intersect(new CrossSection([ccw(rect(xl, xr, -BY, BY))]));
  const topAt = (x) => arch.top(x) - BRACE.drop;
  const underAt = (x, y, thick) => topAt(x) - thick - Math.abs(y) * Math.tan(BRACE.slope);
  const envelope = (thick, a, b) =>
    loftX(
      range(a, b, 0.5).map((x) => ({ x, section: [[0, underAt(x, 0, thick)], [BY, underAt(x, BY, thick)], [BY, topAt(x)], [-BY, topAt(x)], [-BY, underAt(x, BY, thick)]] })),
      `windverband ${arch.k}`,
    );
  const zLo = Math.min(...nodes.map((x) => underAt(x, BY, BRACE.portalThick))) - 1;
  const zHi = arch.top(arch.m) + 1;
  const prismOf = (cs) => Manifold.extrude(cs, zHi - zLo).translate([0, 0, zLo]);
  const regular = prismOf(lattice).intersect(envelope(BRACE.thick, xl, xr));
  // Portalen dieper (1,3 m in het midden).
  const portals = [xa, xb].map((x) =>
    prismOf(new CrossSection([ccw(rect(x - BRACE.portal / 2, x + BRACE.portal / 2, -BY, BY))])).intersect(envelope(BRACE.portalThick, x - BRACE.portal / 2 - 0.01, x + BRACE.portal / 2 + 0.01)),
  );
  arch.braceNodes = nodes.map((x) => +x.toFixed(2));
  return union([regular, ...portals]);
}

// ---------- aanbruggen: plaatliggers ----------
const PLATE_SPANS = [
  [PIERS[3].x + JOINT, PIERS[4].x - JOINT],
  [PIERS[4].x + JOINT, DECK_X1],
];
function plateSpan([x0, x1], k) {
  const parts = [];
  const n = Math.max(1, Math.round((x1 - x0) / STIFF.platePitch));
  const stiffXs = Array.from({ length: n + 1 }, (_, i) => x0 + STIFF.w / 2 + ((x1 - x0 - STIFF.w) * i) / n);
  for (const side of [-1, 1]) {
    const y0 = side > 0 ? IN : -OUT;
    const y1 = side > 0 ? OUT : -IN;
    parts.push(
      loftX(
        deckStations(x0, x1).map((x) => ({ x, section: [[y0, rail(x) - PLATE_GIRDER.down], [y1, rail(x) - PLATE_GIRDER.down], [y1, rail(x) + PLATE_GIRDER.up], [y0, rail(x) + PLATE_GIRDER.up]] })),
        `plaatligger ${k}`,
      ),
    );
    const ys = side > 0 ? [OUT - 0.01, OUT + STIFF.t] : [-OUT - STIFF.t, -OUT + 0.01];
    for (const xs of stiffXs) parts.push(boxFromTo(xs - STIFF.w / 2, xs + STIFF.w / 2, ys[0], ys[1], rail(xs) - PLATE_GIRDER.down, rail(xs) + PLATE_GIRDER.up - 0.05));
  }
  return union(parts);
}

// ---------- dek en looppad ----------
// Dekplaat tussen de liggers over de hele lengte (ook over de voegen op de
// pijlers), van 1,0 m onder het spoor tot het spoor.
const deckSlab = loftX(
  deckStations(DECK_X0, DECK_X1).map((x) => ({ x, section: [[-IN - 0.01, rail(x) - SLAB], [IN + 0.01, rail(x) - SLAB], [IN + 0.01, rail(x)], [-IN - 0.01, rail(x)]] })),
  "dekplaat",
);
function walkway(x0, x1, edge) {
  return loftX(
    deckStations(x0, x1).map((x) => {
      const zt = rail(x) + WALK.up;
      const ze = zt - WALK.edge;
      return { x, section: [[OUT - 0.01, ze - (edge - OUT) * WALK.slope], [edge, ze], [edge, zt], [OUT - 0.01, zt]] };
    }),
    "looppad",
  );
}
const walkways = [walkway(DECK_X0, WALK.change, WALK.narrow), walkway(WALK.change, DECK_X1, WALK.wide)];

// ---------- pijlers en landhoofden ----------
// Gemetseld: een plint 0,4 m breder tot NAP +8,3 m met een afgeschuinde
// bovenkant, de schacht (BGT-vorm) tot 0,5 m onder de kop en een deklijst die
// 0,3 m uitkraagt (foto's).
const PLINTH = { grow: 0.4, topNap: 8.3 };
const COPING = { grow: 0.3, depth: 0.5 };
function pier({ poly, topNap }) {
  const hull = hullPoly(poly);
  const top = Z(topNap);
  const plinthTop = Z(PLINTH.topNap);
  return union([
    prism(poly, BASE, top - COPING.depth),
    prism(offsetPoly(hull, PLINTH.grow), BASE, plinthTop - PLINTH.grow * T50),
    Manifold.hull([prism(offsetPoly(hull, PLINTH.grow), plinthTop - PLINTH.grow * T50 - 0.01, plinthTop - PLINTH.grow * T50), prism(hull, plinthTop, plinthTop + 0.01)]),
    flare(hull, offsetPoly(hull, COPING.grow), COPING.grow, top - COPING.depth - COPING.grow * T50, top),
  ]);
}
const piers = PIERS.map(pier);
const abutments = [ABUT_S, ABUT_N].map(({ poly, topNap }) => prism(poly, BASE, Z(topNap)));
// Oplegblokken van 1,4 × 1,2 m onder elk liggereinde, van de kop van de
// pijler of het landhoofd tot de onderkant van de ligger.
const BEARING = { along: 1.4, across: 1.2 };
function bearing(x, topNap, girderDown, dir) {
  const xc = x + dir * (BEARING.along / 2 + 0.05);
  const zb = rail(xc) - girderDown + 0.05;
  return [-1, 1].map((side) => boxFromTo(xc - BEARING.along / 2, xc + BEARING.along / 2, side * PLANE.y - BEARING.across / 2, side * PLANE.y + BEARING.across / 2, Z(topNap) - 0.05, zb));
}
const bearings = [
  ...bearing(DECK_X0 + 0.6, ABUT_S.topNap, ARCH_GIRDER.down, 1),
  ...ARCHES.slice(1).flatMap((a) => bearing(a.x0, PIERS[a.k - 1].topNap, ARCH_GIRDER.down, 1)),
  ...ARCHES.flatMap((a) => (a.k < 4 ? bearing(a.x1, PIERS[a.k].topNap, ARCH_GIRDER.down, -1) : [])),
  ...bearing(PLATE_SPANS[0][0], PIERS[3].topNap, PLATE_GIRDER.down, 1),
  ...bearing(PLATE_SPANS[0][1], PIERS[4].topNap, PLATE_GIRDER.down, -1),
  ...bearing(PLATE_SPANS[1][0], PIERS[4].topNap, PLATE_GIRDER.down, 1),
  ...bearing(DECK_X1 - 1.4, ABUT_N.topNap, PLATE_GIRDER.down, 1),
];

const archSpans = ARCHES.map(archSpan);
const plateSpans = PLATE_SPANS.map(plateSpan);
const bridge = union([...archSpans, ...plateSpans, deckSlab, ...walkways, ...piers, ...abutments, ...bearings]);

// ---------- printvoet (alleen in de STL) ----------
// Net als de overhangopvulling van de export krijgt de STL onder het dek een
// wig van 50 graden die uitloopt in een scherm van 0,9 m tot de onderplaat:
// onder de liggers en, smaller, onder de dekplaat tussen de liggers.
const KNEE = rad(50);
const SCREEN = Math.max(0.45, (0.45 * scale) / 1000);
const footSection = (zb, w) => {
  const zs = zb - Math.tan(KNEE) * (w - SCREEN);
  if (zs > BASE + 0.05) return [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]];
  const a = w - (zb - BASE) / Math.tan(KNEE);
  return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
};
const footRegions = [
  ...ARCHES.map((a) => [a.x0, a.x1, (x) => rail(x) - ARCH_GIRDER.down, OUT]),
  ...PLATE_SPANS.map(([a, b]) => [a, b, (x) => rail(x) - PLATE_GIRDER.down, OUT]),
  [DECK_X0, DECK_X1, (x) => rail(x) - SLAB, IN],
];
const printFoot = union(
  footRegions.map(([a, b, zbOf, w], i) => loftX(deckStations(a, b).map((x) => ({ x, section: footSection(zbOf(x) + 0.02, w + 0.02) })), `printvoet ${i}`)),
);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
for (const [name, solid] of [["brug", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
// Vrij hangende ondervlakken (vlakker dan 45 graden) boven de onderkant,
// boven en onder het dek apart.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const out = { aboveDeck: 0, belowDeck: 0, worst: [] };
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    if (zm > rail(xm) + 0.25) {
      out.aboveDeck += len / 2;
      if (len / 2 > 0.02) out.worst.push([+xm.toFixed(2), +((p[0][1] + p[1][1] + p[2][1]) / 3).toFixed(2), +zm.toFixed(2), +(len / 2).toFixed(3)]);
    } else out.belowDeck += len / 2;
  }
  out.aboveDeck = +out.aboveDeck.toFixed(2);
  out.belowDeck = +out.belowDeck.toFixed(2);
  out.worst = out.worst.sort((a, b) => b[3] - a[3]).slice(0, 8);
  return out;
}
const checks = {
  overhangM2: { model: overhangs(bridge), print: overhangs(printModel) },
  openingsPerArchSide: ARCHES.map((a) => a.openings),
};
console.log("controles:", JSON.stringify(checks));

// ---------- spoor als eigen onderdeel ----------
// De bovenste 0,5 m van de dekplaat op het BGT-wegdeel spoorbaan van de brug
// (L0004.9833e74410604a149b4c432e714eec3b: gesloten verharding, relatieve
// hoogteligging 1, van x = -126,56 tot 214,09 en 1,4 tot 1,5 m naast de as) is
// een eigen node met de attributen van dat wegdeel (glTF `extras.attributes`),
// zodat de kleurregels van een thema (bijvoorbeeld spoor zwart) op het brugdek
// werken zoals op de BGT-wegdelen ernaast. Contour in lokale coördinaten,
// vereenvoudigd tot 5 cm; de kopse kanten zijn 0,5 m voorbij het dek verlengd,
// zodat daar geen smalle reep constructie op het dek blijft staan. Wordt pas
// hier gebouwd, nadat het printmodel is doorgerekend, zodat de STL gelijk
// blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
const SPOOR_BGT = [
  [DECK_X1 + 0.5, -1.39], [DECK_X1 + 0.5, 1.33], [214.02, 1.33], [26.24, 1.23], [-37.3, 1.27], [-126.53, 1.19], [DECK_X0 - 0.5, 1.19],
  [DECK_X0 - 0.5, -1.5], [-126.56, -1.5], [124.89, -1.37], [214.09, -1.39],
];
const strip = loftX(
  sortedUnique([DECK_X0 - 0.5, ...RAIL_XS.filter((x) => x > DECK_X0 - 0.5 && x < DECK_X1 + 0.5), DECK_X1 + 0.5]).map((x) => {
    const zt = rail(x);
    return { x, section: [[-IN + 0.2, zt - LAYER], [IN - 0.2, zt - LAYER], [IN - 0.2, zt + ABOVE], [-IN + 0.2, zt + ABOVE]] };
  }),
  "spoorstrook",
);
// De liggers blijven over hun hele strook constructie, met 2 cm vrij.
const guards = union([-1, 1].map((side) => boxFromTo(DECK_X0 - 1, DECK_X1 + 1, side * IN - side * GUARD, side * (OUT + GUARD), BASE - 1, 100)));
const spoorArea = prism(SPOOR_BGT, BASE - 1, 100);
const spoorCut = strip.intersect(spoorArea).subtract(guards);
const track = spoorCut.intersect(bridge);
const structure = bridge.subtract(spoorCut);
const parts = [
  ["building:edithbrug", structure],
  ["road:spoor", track, SPOOR_ATTRIBUTES],
];
{
  const whole = bridge.volume();
  const sum = structure.volume() + track.volume();
  checks.partitionM3 = { bridge: +whole.toFixed(2), structure: +structure.volume().toFixed(2), track: +track.volume().toFixed(2), sumMinusBridge: +(sum - whole).toFixed(4) };
  console.log("volumes (m3):", checks.partitionM3);
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
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
report.arches = ARCHES.map((a) => ({
  bearingsX: [a.b0, a.b1],
  spanM: +(a.b1 - a.b0).toFixed(2),
  crownNap: +(a.top(a.m) + WATER_NAP).toFixed(2),
  hangersX: a.hangers.map((x) => +x.toFixed(2)),
  braceNodesX: a.braceNodes,
  openingApexNap: a.apexes,
}));
report.checks = checks;
const glbFile = path.join(outDir, "edithbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-edithbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `edithbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Edithbrug 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Op de Maas naast de eerste drie bogen (20 m naast de as). De uiterwaard aan
// de noordoostkant ligt 2,4 m hoger dan het water; punten daar zouden het
// model optillen.
const samplePoints = [ARCHES[0].m, ARCHES[1].m, ARCHES[2].m].flatMap((x) => [
  [+x.toFixed(2), 20],
  [+x.toFixed(2), -20],
]);
await writeFile(
  path.join(outDir, "edithbrug.json"),
  JSON.stringify(
    {
      name: "Edithbrug",
      file: "edithbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [173425.65, 423658.51],
      xAxis: [0.850152, 0.526537],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de spooras in het hart van de middelste pijler op de waterspiegel van de Maas (z = 0, NAP +5,10 m) in de oorsprong, +X langs de brug naar het noordoosten (Niftrik, RD-richting 31,77 graden vanaf het oosten) en +Y naar het noordwesten (stroomafwaarts). Twee nodes. Node road:spoor: de bovenste 0,5 m van de dekplaat op het BGT-wegdeel spoorbaan van de brug (L0004.9833e744..., 2,9 m breed) met de attributen van dat wegdeel in extras.attributes (bgt_functie spoorbaan, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema op het dek werken. Node building:edithbrug: de rest van het kunstwerk van het zuidelijke landhoofd bij Ravenstein (x = -126,9) tot het noordelijke bij Niftrik (x = 214,4): vier gelijke stalen boogbruggen van circa 63 m met een verstijvingsligger, twee volle boogribben 2,8 m naast de as tot 11,07 m boven het spoor (NAP +26,1 m bij de eerste twee bogen), elk met elf platte hangers en spitse openingen ertussen, verstijvers op de liggers, het windverband tussen de ribben (dwarsregels op de hangers, portalen en kruisende diagonalen); twee plaatliggerbruggen van circa 44 m over de uiterwaard met verstijvers; de dekplaat tussen de liggers en het looppad aan de westkant; vijf gemetselde pijlers met spitse koppen (BGT), plint en deklijst, aan de oostkant 10 m breder dan de brug, met oplegblokken; de twee landhoofden. Spoor op NAP +15,03 m over de eerste twee bogen, daarna dalend tot +13,25 m bij Niftrik. Bovenleiding, leuningen en de bordessen op de pijlers zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de Maas naast de eerste drie bogen bemonsterd; groundHeight is de PDOK-hoogte van dat water. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(ABUT_N.poly.reduce((m, [x]) => Math.max(m, x), -Infinity) - ABUT_S.poly.reduce((m, [x]) => Math.min(m, x), Infinity)).toFixed(1),
        archSpansM: report.arches.map((a) => a.spanM),
        archCrownNapM: report.arches.map((a) => a.crownNap),
        archRiseAboveRailM: ARCH.rise,
        hangersPerArch: ARCH.panels - 1,
        plateGirderSpansM: PLATE_SPANS.map(([a, b]) => +(b - a).toFixed(1)),
        ribsFromAxisM: PLANE.y,
        pierTopNapM: PIERS.map((p) => p.topNap),
        railNapM: { south: RAIL_NAP[0][1], north: RAIL_NAP[RAIL_NAP.length - 1][1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Edithbrug",
        "PDOK BGT overbruggingsdeel (dek, pijlers, landhoofden), wegdeel (spoorbaan op het dek) en spoor (hartlijn), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de spoorhoogte, de boogribben, de liggers, het looppad en de pijlerkoppen",
        "PDOK luchtfoto (Actueel_orthoHR) voor de hangers en het windverband",
        "Wikimedia Commons: Edithbrug vanaf Niftrik.JPG, Railway bridge Edithbrug on the Niftrik side.jpg, WLM - 23dingenvoormusea - Spoorbrug over de Maas bij Ravenstein.jpg, Tussen Ravenstein en Niftrik, spoorbrug over de Maas foto5 2016-04-20 10.59.jpg",
      ],
    },
    null,
    2,
  ),
);
for (const c of structure.decompose()) if (c.volume() < 0.5 * structure.volume()) console.log("los onderdeel", c.volume().toFixed(2), JSON.stringify(c.boundingBox()));
console.log(JSON.stringify(report, null, 2));

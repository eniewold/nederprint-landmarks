// Genereert een vereenvoudigd, gesloten 3D-model van de Hanzeboog bij Zwolle:
// de dubbelsporige spoorbrug van de Hanzelijn uit 2011 (Quist Wintermans
// Architekten) over de IJssel tussen Hattem en Zwolle, met de rode stalen
// vakwerkligger met gebogen bovenrand over drie velden (75, 150 en 75 m;
// twee vakwerken die naar binnen hellen, W-vakwerk met velden van 30 m), de
// betonnen aanbruggen over de uiterwaarden (vier velden van 40 m aan de kant
// van Hattem, tien aan de kant van Zwolle, met korte eindvelden bij de
// landhoofden), de achttien V-vormige pijlers dwars op de brug en het
// fietspad dat er aan de zuidkant met een smalle spleet ‘los’ naast hangt. De
// oude spoorbrug uit 1864, 50 m stroomafwaarts, is in 2011 gesloopt; alleen
// een stenen pijlerrestant staat nog in de rivier (niet in dit model). De
// IJsselbrug (weg Zwolle-Hattem) 800 m stroomafwaarts heeft een
// eigen model. Alle maten in het script zijn meters op ware grootte. Uitvoer:
// een GLB in meters (Y omhoog, nodes met de materiaalklasse in de nodenaam:
// de constructie, en spoor en fietspad met de attributen van het BGT-wegdeel)
// als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal> met een printvoet onder het dek.
//
//   node scripts/generate-hanzeboog.mjs              # STL op 1:2500 (standaard)
//   node scripts/generate-hanzeboog.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het spoor midden boven de
// hoofdoverspanning (RD 200833,13, 500456,87), op de waterspiegel van de
// IJssel zoals het PDOK-terrein die legt (NAP +1,4 m), Z omhoog. +X loopt langs
// de rechte hoofdoverspanning naar het oosten (Zwolle, RD-richting 21,40
// graden vanaf het oosten), +Y naar links, stroomafwaarts naar het
// noordnoordwesten. De brug is tot x = 118 recht en buigt daarna met een
// overgangsboog en een bocht met een straal van circa 1300 m naar links, tot
// 17,3 graden aan het oostelijke landhoofd. Het script bouwt alles in een
// recht stelsel (s langs de as, y links van de as) en buigt het model pas aan
// het eind (warp) langs die as.
//
// Bronnen: BGT overbruggingsdeel (rand van het dek met het fietspad, de
// voeten van de pijlers op s = 75, 150, 190 en 230, de sloof van de eerste
// pijler aan de westkant op s = -310, de landhoofden); AHN DSM 0,5 m (PDOK
// WCS) voor de as en het lengteprofiel van het spoor (NAP +11,6 aan de
// westkant, +15,3 m midden boven de rivier, +7,7 m aan de oostkant), de
// randen van het spoordek en het fietspad (0,7 tot 1,0 m lager), de bovenrand
// van de vakwerken (NAP +30,0 m in het midden, 14,7 m boven het spoor, tot het
// dek dalend over 150 m naar beide kanten) en hun helling naar binnen;
// PDOK-luchtfoto 2021 (schaduw van het vakwerk op het water) voor de velden
// van 30 m; PDOK-terrein voor de waterspiegel (44,20 m ellipsoïdisch, NAP +1,4
// m); Wikipedia (lengte 920 m, breedte 24 m, langste overspanning 150 m,
// doorvaarthoogte 9 m, 18 pijlers), de projectbeschrijving van de Nationale
// Staalprijs (Y-vormige pijlers dwars op de brug, fietsbrug ‘los’ aan de
// spoorbrug gehangen) en Wikimedia Commons-foto's (Hanzeboog.jpg, Hanzeboog
// vanuit de lucht.jpg, New bridge, Zwolle, Overijssel.jpg, 20151027
// Hanzeboog1 IJssel Zwolle.jpg, Spoorbrug Hanzelijn IJssel.jpg, Zwolle
// Hanzeboog IRM 9450 richting Zwolle (20294000598).jpg, New built 75-150-75 m
// mainspan railwaybridge ... - panoramio.jpg) voor het vakwerk, de pijlers en
// het fietspad. Geschat zijn de staafmaten (bovenrand 2,0 × 2,4 m, diagonalen
// 1,6 m, plaat 1,2 m), de constructiehoogtes van het dek (3,0 m onder het
// vakwerk, 2,8 m over de aanbruggen), de plaats van de pijlers die niet in de
// BGT staan (velden van 40 m), de V-vorm van de pijlers (voet uit de BGT,
// bovenkant zo breed als het dek, inkeping tot 55 % van de zichtbare hoogte)
// en de dikte van het fietspad.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hanzeboog");
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
// Polygoon in het sz-vlak, uitgetrokken langs y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(points)]), y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Polygoon in het yz-vlak, uitgetrokken langs s van s0 tot s1.
const profileS = (points, s0, s1) =>
  Manifold.extrude(new CrossSection([ccw(points)]), s1 - s0)
    .rotate([90, 0, 90])
    .translate([s0, 0, 0]);
// Band tussen twee functies van s (onder en boven), uitgetrokken langs y.
function bandY(s0, s1, bottom, top, y0, y1, step = 2) {
  const n = Math.max(1, Math.round((s1 - s0) / step));
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const s = s0 + ((s1 - s0) * i) / n;
    pts.push([s, bottom(s)]);
  }
  for (let i = n; i >= 0; i--) {
    const s = s0 + ((s1 - s0) * i) / n;
    pts.push([s, top(s)]);
  }
  return profileY(pts, y0, y1);
}
// Loft langs s: per station een convexe doorsnede in het yz-vlak (tegen de
// klok in gezien vanaf +s, steeds evenveel punten).
function loftS(stations, label) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { s, section } of stations) for (const [y, z] of section) verts.push(s, y, z);
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

// ---------- hoofdmaten ----------
const WATER_NAP = 1.4; // waterspiegel van de IJssel in het PDOK-terrein (44,20 m ellipsoïdisch)
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten: het water
// van de IJssel naast de hoofdoverspanning.
const GROUND_HEIGHT = 44.18;

// As van het spoor: richting (graden linksom vanaf +X) als functie van de
// booglengte s, stuksgewijs lineair (AHN-randen van het spoordek, midden
// tussen de voeten van de pijlers in de BGT; tot s = 117,8 recht, dan een
// overgangsboog en een bocht naar links met een straal van circa 1300 m).
const AXIS_BREAKS = [[-400, 0], [117.8, 0], [217.8, 2.069], [357.8, 7.805], [600, 17.317 + (600 - 585.8) * ((17.317 - 7.805) / 228)]];
const heading = (s) => {
  if (s <= AXIS_BREAKS[0][0]) return rad(AXIS_BREAKS[0][1]);
  for (let i = 1; i < AXIS_BREAKS.length; i++) {
    const [s1, a1] = AXIS_BREAKS[i];
    if (s <= s1) {
      const [s0, a0] = AXIS_BREAKS[i - 1];
      return rad(lerp(a0, a1, (s - s0) / (s1 - s0)));
    }
  }
  return rad(AXIS_BREAKS[AXIS_BREAKS.length - 1][1]);
};
const AXIS_S0 = -400;
const AXIS_STEP = 0.25;
const AXIS_N = Math.round((600 - AXIS_S0) / AXIS_STEP) + 1;
const axisX = new Float64Array(AXIS_N);
const axisY = new Float64Array(AXIS_N);
{
  const i0 = Math.round(-AXIS_S0 / AXIS_STEP);
  for (let i = i0 + 1; i < AXIS_N; i++) {
    const a = heading(AXIS_S0 + (i - 0.5) * AXIS_STEP);
    axisX[i] = axisX[i - 1] + AXIS_STEP * Math.cos(a);
    axisY[i] = axisY[i - 1] + AXIS_STEP * Math.sin(a);
  }
  for (let i = i0 - 1; i >= 0; i--) {
    const a = heading(AXIS_S0 + (i + 0.5) * AXIS_STEP);
    axisX[i] = axisX[i + 1] - AXIS_STEP * Math.cos(a);
    axisY[i] = axisY[i + 1] - AXIS_STEP * Math.sin(a);
  }
}
// (s, y) langs de as naar modelcoördinaten (x, y).
function sToXY(s, y) {
  const f = clamp((s - AXIS_S0) / AXIS_STEP, 0, AXIS_N - 1);
  const i = Math.min(Math.floor(f), AXIS_N - 2);
  const t = f - i;
  const x = lerp(axisX[i], axisX[i + 1], t);
  const yy = lerp(axisY[i], axisY[i + 1], t);
  const a = heading(s);
  return [x - y * Math.sin(a), yy + y * Math.cos(a)];
}

// Spoor in NAP-meters om de 10 m vanaf s = -342,2 (het westelijke einde van
// het BGT-dek): 40e percentiel van het AHN-DSM tussen de sporen, mediaan over
// 20 m en gladgestreken (bovenleiding en vakwerk vallen zo weg).
const RAIL_S0 = -342.2;
const RAIL_NAP = [
  11.59, 11.7, 11.84, 11.98, 12.12, 12.24, 12.37, 12.51, 12.65, 12.8, 12.93, 13.07, 13.22, 13.36, 13.48,
  13.62, 13.75, 13.9, 14.05, 14.18, 14.31, 14.44, 14.57, 14.69, 14.8, 14.89, 14.98, 15.06, 15.12, 15.17,
  15.22, 15.25, 15.28, 15.3, 15.31, 15.31, 15.29, 15.28, 15.25, 15.21, 15.17, 15.11, 15.03, 14.95, 14.87,
  14.77, 14.66, 14.55, 14.42, 14.3, 14.16, 14.0, 13.85, 13.69, 13.53, 13.38, 13.22, 13.06, 12.9, 12.74,
  12.59, 12.43, 12.29, 12.13, 11.98, 11.82, 11.66, 11.5, 11.34, 11.19, 11.03, 10.87, 10.71, 10.55, 10.39,
  10.24, 10.08, 9.92, 9.78, 9.62, 9.46, 9.3, 9.15, 8.99, 8.83, 8.67, 8.51, 8.36, 8.2, 8.05, 7.9, 7.75,
  7.67, 7.66,
];
function railZ(s) {
  const f = clamp((s - RAIL_S0) / 10, 0, RAIL_NAP.length - 1);
  const i = Math.min(Math.floor(f), RAIL_NAP.length - 2);
  return Z(lerp(RAIL_NAP[i], RAIL_NAP[i + 1], f - i));
}

// Steunpunten langs de as (s): de pijlers onder de vakwerkligger op 75 en
// 150 m van het midden (BGT: 75 en 150 aan de oostkant), aanbruggen met
// velden van 40 m (BGT: 190 en 230, en de sloof van de eerste westelijke
// pijler op -310); de landhoofden op de eindes van het BGT-dek.
const TRUSS_END = 150;
const RIVER_PIER = 75;
const WEST_PIERS = [-310, -270, -230, -190];
const EAST_PIERS = Array.from({ length: 10 }, (_, k) => 190 + 40 * k);
const WEST_FACE = -334.2; // voorzijde van het westelijke landhoofd
const WEST_END = -350.0;
const EAST_FACE = 581.4; // voorzijde van het oostelijke landhoofd (BGT)
const EAST_END = 589.0;

// Dwarsprofiel per deel (y links van de as, AHN): spoordek (zuid- en
// noordrand), fietspad (binnen- en buitenrand) en constructiehoogte onder het
// spoor. Het fietspad ligt 0,95 m (onder het vakwerk 0,7 m) onder het spoor.
const SECTIONS = {
  west: { yS: -7.8, yN: 7.2, cIn: -10.0, cOut: -13.6, depth: 2.8, cycDrop: 0.95 },
  truss: { yS: -9.7, yN: 9.7, cIn: -10.7, cOut: -14.3, depth: 3.0, cycDrop: 0.7 },
  east: { yS: -6.3, yN: 6.7, cIn: -8.0, cOut: -11.6, depth: 2.8, cycDrop: 0.95 },
};
const sectionAt = (s) => (s < -TRUSS_END ? SECTIONS.west : s > TRUSS_END ? SECTIONS.east : SECTIONS.truss);
const SLAB = 1.4; // plaat van de aanbruggen, de kokers 1,0 m teruggezet
const GIRDER_INSET = 1.0;
const CYC_SLAB = 1.0;
const CONSOLE = 0.5; // hoogte van de strook consoles onder de spleet
const deckBottomAt = (s) => railZ(s) - sectionAt(s).depth;

// ---------- spoordek, fietspad, landhoofden ----------
const SEGMENTS = [
  { s0: WEST_FACE, s1: -TRUSS_END, sec: SECTIONS.west },
  { s0: -TRUSS_END, s1: TRUSS_END, sec: SECTIONS.truss },
  { s0: TRUSS_END, s1: EAST_FACE, sec: SECTIONS.east },
];
const deckParts = [];
for (const { s0, s1, sec } of SEGMENTS) {
  if (sec === SECTIONS.truss) {
    deckParts.push(bandY(s0, s1, (s) => railZ(s) - sec.depth, railZ, sec.yS, sec.yN));
  } else {
    deckParts.push(bandY(s0, s1, (s) => railZ(s) - SLAB, railZ, sec.yS, sec.yN));
    deckParts.push(
      bandY(s0, s1, (s) => railZ(s) - sec.depth, (s) => railZ(s) - SLAB + 0.01, sec.yS + GIRDER_INSET, sec.yN - GIRDER_INSET),
    );
  }
  // Fietspad met de strook consoles onder de spleet naar het spoordek.
  const cycTop = (s) => railZ(s) - sec.cycDrop;
  deckParts.push(bandY(s0, s1, (s) => cycTop(s) - CYC_SLAB, cycTop, sec.cOut, sec.cIn));
  deckParts.push(
    bandY(
      s0,
      s1,
      (s) => cycTop(s) - CYC_SLAB,
      (s) => (sec === SECTIONS.truss ? cycTop(s) - CYC_SLAB + CONSOLE : railZ(s) - SLAB + 0.01),
      sec.cIn - 0.1,
      sec.yS + (sec === SECTIONS.truss ? 0.1 : GIRDER_INSET + 0.1),
    ),
  );
}
const abutments = [
  bandY(WEST_END, WEST_FACE + 0.01, () => BASE, (s) => railZ(s) - 0.01, SECTIONS.west.cOut, SECTIONS.west.yN, 4),
  bandY(EAST_FACE - 0.01, EAST_END, () => BASE, (s) => railZ(s) - 0.01, SECTIONS.east.cOut, SECTIONS.east.yN, 4),
];

// ---------- pijlers ----------
// V-vormige wanden dwars op de brug (‘Y-vorm’, staalprijs): de voet uit de
// BGT (aanbruggen 2,1 × 10 m, rivierpijlers 3,6 × 11,2 m, eindpijlers van het
// vakwerk 2,6 × 10,5 m, gecentreerd op de as), de bovenkant zo breed als het
// spoordek (0,5 m binnen de randen) en een inkeping van boven tot 55 % van de
// zichtbare hoogte boven NAP +1,5 m, bovenaan 40 % van de breedte.
const PIER_TYPES = {
  approach: { foot: 5.0, thick: 2.1 },
  end: { foot: 5.25, thick: 2.6 },
  river: { foot: 5.6, thick: 3.6 },
};
const piersList = [
  ...WEST_PIERS.map((s) => ({ s, type: "approach" })),
  { s: -TRUSS_END, type: "end" },
  { s: -RIVER_PIER, type: "river" },
  { s: RIVER_PIER, type: "river" },
  { s: TRUSS_END, type: "end" },
  ...EAST_PIERS.map((s) => ({ s, type: "approach" })),
];
const notchInfo = [];
const piers = piersList.map(({ s, type }) => {
  const { foot, thick } = PIER_TYPES[type];
  // Eindpijlers dragen ook het vakwerkdek: bovenkant zo breed als dat.
  const sec = type === "end" || type === "river" ? SECTIONS.truss : sectionAt(s);
  const top = Math.min(deckBottomAt(s - thick / 2), deckBottomAt(s + thick / 2)) + 0.1;
  const y0 = sec.yS + 0.5 + (sec === SECTIONS.truss ? 0 : GIRDER_INSET - 0.5);
  const y1 = sec.yN - 0.5 - (sec === SECTIONS.truss ? 0 : GIRDER_INSET - 0.5);
  const yc = (y0 + y1) / 2;
  const notchHalf = 0.2 * (y1 - y0);
  const depth = Math.max(2, 0.55 * (top - Z(1.5)));
  const zn = top - depth;
  notchInfo.push({ s, type, topNap: +(top + WATER_NAP).toFixed(2), notchNap: +(zn + WATER_NAP).toFixed(2) });
  const poly = [
    [-foot, BASE],
    [foot, BASE],
    [y1, top],
    [yc + notchHalf, top],
    [yc, zn],
    [yc - notchHalf, top],
    [y0, top],
  ];
  return profileS(poly, s - thick / 2, s + thick / 2);
});

// ---------- vakwerkligger ----------
// Twee vakwerken over 300 m (75, 150 en 75 m) die 14,3 graden naar binnen
// hellen: op spoorhoogte 8,8 m naast de as, in de top 5,05 m (AHN). De
// bovenkant van de bovenrand ligt h(d) boven het spoor, met d de afstand tot
// het midden: h = 14,7 (1 - (d/150)²)^1,8 (AHN: NAP +30,0 m in het midden,
// +24 m boven de rivierpijlers, en vloeiend tot op het dek bij de
// eindpijlers). W-vakwerk met velden van 30 m (luchtfoto 2021, foto's):
// onderknopen boven de pijlers en op 15 + 30k m van het midden, bovenknopen
// midden daartussen. Op 1:1000 is elk vakwerk een plaat van 1,2 m met een
// bovenrand van 2,0 m breed (0,4 m schuine kraag eronder) en 2,4 m hoog; de
// driehoeken met de punt omhoog zijn doorgaande openingen met flanken van 53
// graden vanaf de top (de echte diagonalen staan op circa 40 graden), de rest
// van die driehoeken en de driehoeken met een vlakke bovenkant zijn blinde
// nissen van 0,35 m aan de buitenkant.
const TRUSS = { crown: 14.7, power: 1.8, yRail: 8.8, yCrown: 5.05, plate: 1.2, chordW: 2.0, chordH: 2.4, bar: 0.8, flank: 53, niche: 0.35, panel: 30 };
const LEAN = (TRUSS.yRail - TRUSS.yCrown) / TRUSS.crown;
const trussH = (s) => TRUSS.crown * Math.max(0, 1 - (s / TRUSS_END) ** 2) ** TRUSS.power;
const trussTop = (s) => railZ(s) + trussH(s);
const plateBottom = (s) => railZ(s) - 1.0;
const trussSs = Array.from({ length: 2 * TRUSS_END + 1 }, (_, i) => -TRUSS_END + i);
const plateOutline = [
  ...trussSs.map((s) => [s, plateBottom(s)]),
  ...[...trussSs].reverse().map((s) => [s, Math.max(trussTop(s) - TRUSS.chordH + 0.3, plateBottom(s) + 0.3)]),
];
// Knopen: hartlijn van de onderrand 0,2 m onder het spoor, van de bovenrand
// 1,6 m onder de bovenkant; de openingen liggen een halve staafbreedte binnen
// de hartlijnen.
const bottomNodes = [];
for (let s = -TRUSS_END + 15; s <= TRUSS_END - 15 + 1e-6; s += TRUSS.panel) bottomNodes.push(s);
const nodeLow = (s) => [s, railZ(s) - 0.2];
const nodeHigh = (s) => [s, trussTop(s) - 1.6];
function inset(tri, d) {
  const polys = new CrossSection([ccw(tri)]).offset(-d, "Miter").toPolygons();
  if (polys.length !== 1 || polys[0].length < 3) return null;
  return polys[0].map(([x, z]) => [x, z]);
}
const throughHoles = [];
const nicheHoles = [];
const flankAngles = [];
for (let i = 0; i + 1 < bottomNodes.length; i++) {
  const a = bottomNodes[i];
  const b = bottomNodes[i + 1];
  // Driehoek met de punt omhoog: doorgaande opening (spits deel) plus nissen.
  const up = inset([nodeLow(a), nodeLow(b), nodeHigh((a + b) / 2)], TRUSS.bar);
  if (up && polyArea(up) > 3) {
    const apex = up.reduce((p, q) => (q[1] > p[1] ? q : p));
    const baseZ = Math.min(...up.map(([, z]) => z));
    const rise = apex[1] - baseZ;
    const half = rise / Math.tan(rad(TRUSS.flank));
    const gable = [[apex[0] - half, baseZ - 0.01], [apex[0] + half, baseZ - 0.01], apex];
    const hole = CrossSection.intersection(new CrossSection([ccw(up)]), new CrossSection([ccw(gable)])).toPolygons();
    if (rise > 1.5 && hole.length === 1) {
      throughHoles.push(hole[0]);
      const ap = hole[0].reduce((p, q) => (q[1] > p[1] ? q : p));
      for (const q of hole[0]) if (q !== ap) flankAngles.push((Math.atan2(ap[1] - q[1], Math.abs(ap[0] - q[0])) * 180) / Math.PI);
      const rest = new CrossSection([ccw(up)]).subtract(new CrossSection([ccw(gable)])).toPolygons();
      for (const r of rest) if (polyArea(r) > 1.5) nicheHoles.push(r);
    } else if (polyArea(up) > 2) {
      nicheHoles.push(up);
    }
  }
  // Driehoek met de punt omlaag tussen twee bovenknopen: blinde nis.
  if (i + 2 < bottomNodes.length) {
    const c = bottomNodes[i + 2];
    const down = inset([nodeHigh((a + b) / 2), nodeLow(b), nodeHigh((b + c) / 2)], TRUSS.bar);
    if (down && polyArea(down) > 2) {
      // Doorgaande ruit: onder de diagonalen, boven een spitse top van 53
      // graden onder het midden van de bovenrand; de rest is een nis.
      const [l, r] = [...down].sort((p, q) => q[1] - p[1]).slice(0, 2).sort((p, q) => p[0] - q[0]);
      const apex = [(l[0] + r[0]) / 2, (l[1] + r[1]) / 2];
      const drop = apex[1] - Math.min(...down.map(([, z]) => z)) + 1;
      const half = drop / Math.tan(rad(TRUSS.flank));
      const gable = [[apex[0] - half, apex[1] - drop], [apex[0] + half, apex[1] - drop], apex];
      const dia = CrossSection.intersection(new CrossSection([ccw(down)]), new CrossSection([ccw(gable)])).toPolygons();
      if (dia.length === 1 && polyArea(dia[0]) > 3) {
        throughHoles.push(dia[0]);
        const ap = dia[0].reduce((p, q) => (q[1] > p[1] ? q : p));
        const others = dia[0].filter((q) => q !== ap && q[1] > ap[1] - drop * 0.95);
        for (const q of others) {
          // Alleen de bovenflanken (vanaf de top naar de breedste punten).
          const ang = (Math.atan2(ap[1] - q[1], Math.abs(ap[0] - q[0]) + 1e-9) * 180) / Math.PI;
          if (q[1] > Math.min(...dia[0].map(([, z]) => z)) + 0.01 && Math.abs(q[0] - ap[0]) > 0.01) flankAngles.push(ang);
        }
        const rest = new CrossSection([ccw(down)]).subtract(new CrossSection([ccw(gable)])).toPolygons();
        for (const rr of rest) if (polyArea(rr) > 1.5) nicheHoles.push(rr);
      } else nicheHoles.push(down);
    }
  }
}
// Eén vakwerk, eerst rechtop rond y = 0 gebouwd en daarna geschoven: y krijgt
// side × (8,8 - helling × hoogte boven het spoor) erbij.
function truss(side) {
  const t = TRUSS.plate / 2;
  const plate = profileY(plateOutline, -t, t);
  const outer = side > 0 ? [t - TRUSS.niche, t + 0.5] : [-t - 0.5, -t + TRUSS.niche];
  const cuts = [
    ...throughHoles.map((h) => profileY(h, -t - 0.5, t + 0.5)),
    ...nicheHoles.map((h) => profileY(h, outer[0], outer[1])),
  ];
  const w = TRUSS.chordW / 2;
  const chord = loftS(
    trussSs.map((s) => {
      const top = trussTop(s);
      const lo = (z) => Math.max(z, plateBottom(s));
      return {
        s,
        section: [
          [-t, lo(top - TRUSS.chordH)],
          [t, lo(top - TRUSS.chordH)],
          [w, Math.max(top - TRUSS.chordH + (w - t) * Math.tan(rad(62)), plateBottom(s) + 0.2)],
          [w, top],
          [-w, top],
          [-w, Math.max(top - TRUSS.chordH + (w - t) * Math.tan(rad(62)), plateBottom(s) + 0.2)],
        ],
      };
    }),
    `bovenrand ${side}`,
  );
  return union([plate.subtract(union(cuts)), chord]).warp((v) => {
    v[1] += side * (TRUSS.yRail - LEAN * (v[2] - railZ(v[0])));
  });
}
const trusses = [truss(1), truss(-1)];

// ---------- samenstellen en buigen ----------
const bendToAxis = (solid) =>
  solid.warp((v) => {
    const [x, y] = sToXY(v[0], v[1]);
    v[0] = x;
    v[1] = y;
  });
const straight = union([...deckParts, ...abutments, ...piers, ...trusses]);
const bridge = bendToAxis(straight);

// ---------- printvoet (alleen in de STL) ----------
// Onder het spoordek en het fietspad: een wig van 50 graden vanaf de randen
// die uitloopt in een scherm van 0,9 m tot de onderplaat, tussen de
// landhoofden. Aan de kant van het fietspad begint de wig onder het fietspad.
const KNEE = rad(50);
const SCREEN = 0.45;
const footSs = [];
for (let s = WEST_FACE; s < EAST_FACE; s += 1) footSs.push(s);
footSs.push(EAST_FACE, -TRUSS_END - 1e-3, -TRUSS_END + 1e-3, TRUSS_END - 1e-3, TRUSS_END + 1e-3);
footSs.sort((a, b) => a - b);
// Per kant: waar de lijn van 50 graden vanaf de rand de onderplaat raakt
// vóór het scherm, eindigt de wig daar; anders loopt hij uit in het scherm.
const footSide = (w, z) => {
  const hit = w - (z - BASE) / Math.tan(KNEE);
  return hit > SCREEN ? [[hit, BASE], [hit + 1e-3, BASE + 1e-3]] : [[SCREEN, BASE], [SCREEN, z - Math.tan(KNEE) * (w - SCREEN)]];
};
// Bovenkant van de voet: een knik onder de zuidrand van het spoordek, zodat
// hij boven de onderkant van fietspad en consoles blijft en binnen het dek
// loopt (de doorsnede blijft convex).
const footStations = footSs
  .filter((s, i, xs) => s >= WEST_FACE && s <= EAST_FACE && (i === 0 || s - xs[i - 1] > 1e-4))
  .map((s) => {
    const sec = sectionAt(s);
    const truss = sec === SECTIONS.truss;
    const zN = truss ? railZ(s) - sec.depth + 0.02 : railZ(s) - SLAB + 0.1;
    const zS = railZ(s) - sec.cycDrop - CYC_SLAB + 0.02;
    const zJ = truss ? zS : railZ(s) - SLAB - 0.05;
    const yc = (sec.cOut + sec.yN) / 2;
    const wN = sec.yN - yc + 0.02;
    const wS = yc - sec.cOut + 0.02;
    const [nBase, nKnee] = footSide(wN, zN);
    const [sBase, sKnee] = footSide(wS, zS);
    return {
      s,
      section: [
        [-sBase[0], sBase[1]],
        nBase,
        nKnee,
        [wN, zN],
        [sec.yS - yc, zJ],
        [-wS, zS],
        [-sKnee[0], sKnee[1]],
      ].map(([y, z]) => [y + yc, z]),
    };
  });
const printFoot = bendToAxis(loftS(footStations, "printvoet"));
const printModel = union([bridge, printFoot]);

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
    const k = Math.round((p[0][0] + p[1][0] + p[2][0]) / 3 / 50) * 50;
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

// ---------- spoor en fietspad als eigen onderdelen ----------
// De bovenste 0,5 m van het dek onder het spoor en van het fietspad is een
// eigen node met de attributen van het BGT-wegdeel (glTF `extras.attributes`),
// zodat de kleurregels van een thema (spoor zwart, fietspaden rood) op de brug
// werken zoals op de PDOK-wegdelen ernaast. Op de brug liggen drie actuele
// BGT-wegdelen met relatieve hoogteligging 1: één spoorbaan (half verhard)
// over de hele brug, van het westelijke tot het oostelijke landhoofd, circa
// 8 m breed rond de as, en twee fietspaden (gesloten verharding, geen plus-
// fysiek voorkomen) die op de gemeentegrens bij x = 4,3 op elkaar aansluiten.
// Contouren in lokale coördinaten (na het buigen), vereenvoudigd tot 5 cm
// (Douglas-Peucker). Wat naast de spoorbaan op het spoordek ligt, de randen
// van het fietspad buiten de BGT-contour, de spleet en de vakwerken blijven
// constructie. Wordt pas hier gebouwd, nadat het printmodel is doorgerekend,
// zodat de STL gelijk blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "half verhard" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
const TRACK = [
  // L0004.02e1f991b8964282ab0022f4498a7749: spoorbaan van x = -347,4 tot 579,7.
  [[-347.36, 8.05], [-347.26, -7.76], [-302.25, -6.61], [-242.76, -4.88], [-223.11, -4.41], [-189.77, -4],
    [116.98, -3.92], [164.11, -3.51], [206.89, -2.51], [220.46, -2.05], [245.29, -0.86], [256.81, -0.22],
    [273.13, 0.9], [292.79, 2.52], [308.31, 3.97], [338.3, 7.31], [353.67, 9.27], [371.71, 11.81],
    [383.49, 13.61], [398.78, 16.1], [410, 18], [420.48, 19.88], [432.55, 22.16], [447.85, 25.19],
    [458.64, 27.45], [470.89, 30.12], [486.14, 33.58], [502.45, 37.54], [524.83, 43.27], [540.19, 47.47],
    [550.77, 50.51], [562.81, 54.09], [579.66, 59.41], [577.21, 66.97], [554.58, 59.9], [536.67, 54.73],
    [511.07, 47.89], [483.02, 40.99], [453.5, 34.41], [426.96, 29.1], [388.57, 22.41], [372.19, 19.87],
    [350.77, 16.87], [326.56, 13.9], [304.43, 11.57], [273.95, 8.88], [240.68, 6.83], [204.1, 5.34],
    [181.14, 4.75], [149.92, 4.23], [127.06, 4.07], [96.74, 3.99], [-176.09, 3.96], [-211.55, 4.21],
    [-249.02, 5.06], [-311.98, 6.86]],
];
const BIKE_PATHS = [
  // G0244.3f20b822907e4b64b585a571a15f08dd: fietspad van het landhoofd bij Hattem tot x = 4,3 (Hattem).
  [[-353.24, -12.49], [-353.12, -16.14], [-299.23, -14.76], [-272.06, -13.91], [-242.76, -13.25],
    [-223.19, -13.05], [-132, -13.5], [-107.11, -13.76], [-66.85, -13.98], [4.31, -14.07], [4.31, -10.3],
    [-44.83, -10.32], [-149.9, -9.6], [-179.84, -9.54], [-209.83, -9.3], [-239.82, -9.46], [-259.79, -9.86],
    [-299.76, -11.06], [-326.79, -11.63]],
  // G0193.ea6ec72403ab4a1d87e3b75f934d51a6: fietspad van x = 4,3 tot het landhoofd bij Zwolle (Zwolle).
  [[4.31, -10.3], [4.31, -14.07], [51.57, -13.96], [135.77, -13.33], [183.62, -12.16], [206.69, -11.21],
    [234.37, -9.75], [259.61, -8.04], [287.52, -5.89], [306.1, -4.19], [330.21, -1.62], [352.78, 1.23],
    [373.37, 4.23], [395.42, 7.62], [418.92, 11.47], [441.15, 15.67], [466.51, 20.99], [490.96, 26.58],
    [515.49, 32.59], [541.41, 39.45], [564.98, 46.4], [581.42, 51.5], [580.28, 54.95], [573.35, 52.72],
    [566.74, 50.74], [537.43, 42.16], [527.73, 39.51], [508.27, 34.42], [498.54, 32.02], [488.75, 29.72],
    [469.17, 25.29], [449.54, 21.07], [439.7, 19.08], [419.94, 15.35], [410.06, 13.58], [400.19, 11.85],
    [380.31, 8.65], [370.43, 7.2], [350.47, 4.45], [340.52, 3.16], [320.56, 0.87], [300.58, -1.16],
    [290.58, -2.07], [280.57, -2.88], [250.52, -5.09], [240.54, -5.76], [220.46, -6.93], [200.43, -7.86],
    [180.35, -8.6], [160.37, -9.15], [139.55, -9.54], [107.42, -9.92], [45.2, -10.24]],
];
const prism = (poly, z0, z1) => Manifold.extrude(new CrossSection([ccw(poly)]), z1 - z0).translate([0, 0, z0]);
// Snijstrook van 0,5 m onder tot 1 m boven het spoor, over dezelfde
// loftstations als het dek, van 0,5 m voor tot 0,5 m achter de landhoofden en
// over de hele breedte van fietspad tot spoordek: fietspad, consoles en
// pijlers liggen lager, dus in de strook ligt alleen de bovenkant van het
// spoordek en van de landhoofden (die 1 cm onder het spoor ligt; daar ligt ook
// het begin van de fietspaden).
const STRIP_Y = [-16, 12];
const railStrip = union(
  [[WEST_END - 0.5, WEST_FACE], ...SEGMENTS.map(({ s0, s1 }) => [s0, s1]), [EAST_FACE, EAST_END + 0.5]].map(([s0, s1]) =>
    bandY(s0, s1, (s) => railZ(s) - LAYER, (s) => railZ(s) + ABOVE, ...STRIP_Y),
  ),
);
// Strook over het fietspad per deel, van 0,5 m buiten de buitenrand tot 2 cm
// binnen de binnenrand (de spleet en de consoles blijven buiten), op 2 cm
// afstand van de landhoofden (die 0,95 m boven het fietspad uitsteken).
// Op x = ±150 springt het fietspad 0,25 m omlaag en 0,7 m naar binnen; de
// kopse kant van de lagere strook zou daar tegen de kopse kant van het hogere
// fietspad onder het vakwerk liggen (een vlak zonder dikte). Daarom loopt de
// strook onder het vakwerk de laatste 0,5 m tot de onderkant van de lagere
// strook door.
const T = SECTIONS.truss;
const cycleStrip = union([
  ...SEGMENTS.map(({ s0, s1, sec }) =>
    bandY(s0, s1, (s) => railZ(s) - sec.cycDrop - LAYER, (s) => railZ(s) - sec.cycDrop + ABOVE, sec.cOut - 0.5, sec.cIn - GUARD),
  ),
  ...[
    [-TRUSS_END, -TRUSS_END + 0.5, SECTIONS.west],
    [TRUSS_END - 0.5, TRUSS_END, SECTIONS.east],
  ].map(([s0, s1, low]) =>
    bandY(s0, s1, (s) => railZ(s) - low.cycDrop - LAYER, (s) => railZ(s) - T.cycDrop + ABOVE, T.cOut - 0.5, T.cIn - GUARD),
  ),
]).subtract(
  union([
    bandY(WEST_END - 1, WEST_FACE + 0.01 + GUARD, () => BASE - 1, (s) => railZ(s) + 2, -20, 15, 4),
    bandY(EAST_FACE - 0.01 - GUARD, EAST_END + 1, () => BASE - 1, (s) => railZ(s) + 2, -20, 15, 4),
  ]),
);
// De vakwerken (plaat en bovenrand, met de openingen dicht) blijven met 2 cm
// vrij constructie.
const trussGuard = (side) =>
  bandY(-TRUSS_END - GUARD, TRUSS_END + GUARD, (s) => plateBottom(s) - GUARD, (s) => trussTop(s) + GUARD, -TRUSS.chordW / 2 - GUARD, TRUSS.chordW / 2 + GUARD, 1).warp((v) => {
    v[1] += side * (TRUSS.yRail - LEAN * (v[2] - railZ(v[0])));
  });
const notLayer = bendToAxis(union([trussGuard(1), trussGuard(-1)]));
const trackPrism = union(TRACK.map((poly) => prism(poly, BASE, 100)));
const bikePrism = union(BIKE_PATHS.map((poly) => prism(poly, BASE, 100)));
const railCut = bendToAxis(railStrip).subtract(notLayer);
const spoorCut = railCut.intersect(trackPrism);
const bikeCut = union([railCut, bendToAxis(cycleStrip).subtract(notLayer)]).intersect(bikePrism);
const track = spoorCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const structure = bridge.subtract(union([spoorCut, bikeCut]));
const parts = [
  ["building:hanzeboog", structure],
  ["road:spoor", track, SPOOR_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];
const partition = (() => {
  const whole = bridge.volume();
  const volumes = Object.fromEntries(parts.map(([name, solid]) => [name, +solid.volume().toFixed(2)]));
  const sum = parts.reduce((acc, [, solid]) => acc + solid.volume(), 0);
  console.log("volumes (m3): brug", +whole.toFixed(2), volumes, "som - brug", +(sum - whole).toFixed(4));
  if (Math.abs(sum - whole) > 1e-4 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  return { bridgeM3: +whole.toFixed(2), ...volumes, sumMinusBridgeM3: +(sum - whole).toFixed(4) };
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
for (const [name, solid] of parts) {
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
report.truss = {
  crownNap: +(trussTop(0) + WATER_NAP).toFixed(2),
  overRiverPiersNap: [+(trussTop(-RIVER_PIER) + WATER_NAP).toFixed(2), +(trussTop(RIVER_PIER) + WATER_NAP).toFixed(2)],
  leanDeg: +((Math.atan(LEAN) * 180) / Math.PI).toFixed(1),
  throughOpenings: throughHoles.length,
  niches: nicheHoles.length,
  minFlankDeg: +Math.min(...flankAngles).toFixed(1),
};
report.piers = notchInfo;
report.overhang = overhangReport;
report.partition = partition;
const glbFile = path.join(outDir, "hanzeboog.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-hanzeboog.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `hanzeboog-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Hanzeboog Zwolle 1:${scale} mm Z-up`);
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
// Maaiveld op het water van de IJssel naast de hoofdoverspanning, 30 m naast
// de as aan beide kanten.
const samplePoints = [-40, 0, 40].flatMap((s) => [[s, 30], [s, -30]]).map(([s, y]) => sToXY(s, y).map((c) => +c.toFixed(2)));
await writeFile(
  path.join(outDir, "hanzeboog.json"),
  JSON.stringify(
    {
      name: "Hanzeboog",
      file: "hanzeboog.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [200833.13, 500456.87],
      xAxis: [0.93105, 0.36489],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "G0193.2ae28fd284de43559a1b90d0322b14d7",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het spoor midden boven de hoofdoverspanning op de waterspiegel van de IJssel (z = 0, NAP +1,4 m zoals het PDOK-terrein) in de oorsprong, +X langs de rechte hoofdoverspanning naar het oosten (Zwolle, RD-richting 21,40 graden vanaf het oosten) en +Y stroomafwaarts naar het noordnoordwesten. De brug is tot x = 118 recht en buigt daarna naar links (straal circa 1300 m, 17,3 graden aan het oostelijke landhoofd). Drie nodes: road:spoor, de bovenste 0,5 m van het spoordek en van de landhoofden binnen het BGT-wegdeel spoorbaan (circa 8 m breed rond de as, van x = -347 tot het oostelijke landhoofd), en road:fietspad, de bovenste 0,5 m van het fietspad en van de landhoofden binnen de twee BGT-wegdelen fietspad, met de attributen van het BGT-wegdeel in extras.attributes (bgt_functie spoorbaan of fietspad, bgt_fysiekvoorkomen half verhard of gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het spoordek van 13 tot 19 m breed van het westelijke landhoofd bij Hattem (x = -350 tot -334) tot het oostelijke bij Zwolle (langs de as 581 tot 589), met het spoor op NAP +11,6 tot +15,3 m en +7,7 m aan het oosteinde (AHN); de vakwerkligger van 300 m over de pijlers op x = -150, -75, 75 en 150 als twee vakwerken die 14,3 graden naar binnen hellen (8,8 m naast de as op spoorhoogte, 5,05 m in de top), met de gebogen bovenrand tot NAP +30,0 m in het midden en op het dek bij de eindpijlers, als platen van 1,2 m met doorgaande spitse openingen in de driehoeken met de punt omhoog (velden van 30 m) en blinde nissen; de betonnen aanbruggen met velden van 40 m (vier aan de westkant, tien aan de oostkant) als plaat van 1,4 m op een koker; achttien V-vormige pijlers dwars op de brug; het fietspad van 3,6 m aan de zuidkant, 0,7 tot 0,95 m lager dan het spoor, met een spleet naar het spoordek. Bovenleiding, hekwerken, leuningen en het stenen pijlerrestant van de oude spoorbrug in de rivier zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de hoofdoverspanning bemonsterd; groundHeight is de ellipsoïdische PDOK-hoogte van dat water. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthAlongAxisM: +(EAST_END - WEST_END).toFixed(1),
        trussSpansM: [75, 150, 75],
        trussPanelM: TRUSS.panel,
        trussCrownNapM: report.truss.crownNap,
        trussHeightAboveRailM: TRUSS.crown,
        trussLeanDeg: report.truss.leanDeg,
        approachSpansM: 40,
        piers: piersList.length,
        railNapM: { west: RAIL_NAP[0], crest: Math.max(...RAIL_NAP), east: RAIL_NAP[RAIL_NAP.length - 1] },
        cyclePathWidthM: 3.6,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Hanzeboog",
        "https://www.nationalestaalprijs.nl/sites/default/files/imported_files/396/projectbeschrijving.pdf",
        "PDOK BGT overbruggingsdeel (dek, pijlervoeten, sloof, landhoofden), EPSG:28992",
        "PDOK BGT wegdeel (OGC API, actuele versies met relatieve hoogteligging 1): spoorbaan L0004.02e1f991b8964282ab0022f4498a7749, fietspad G0244.3f20b822907e4b64b585a571a15f08dd en G0193.ea6ec72403ab4a1d87e3b75f934d51a6",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de as, het spoor, het fietspad, de randen van het dek en de vakwerken",
        "PDOK luchtfoto 2021 (Actueel en 2021_orthoHR) voor de velden van het vakwerk (schaduw op het water)",
        "Wikimedia Commons: Hanzeboog.jpg; Hanzeboog vanuit de lucht.jpg; New bridge, Zwolle, Overijssel.jpg; 20151027 Hanzeboog1 IJssel Zwolle.jpg; Spoorbrug Hanzelijn IJssel.jpg; Zwolle Hanzeboog IRM 9450 richting Zwolle (20294000598).jpg; New built 75-150-75 m mainspan railwaybridge in the Hanzelijn ... - panoramio.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

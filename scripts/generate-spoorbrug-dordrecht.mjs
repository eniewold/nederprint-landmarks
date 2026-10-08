// Genereert een vereenvoudigd, gesloten 3D-model van de Spoorbrug Dordrecht
// (Zwijndrechtse spoorbrug, "Het Hemelbed"): de spoorbrug over de Oude Maas
// tussen Zwijndrecht en Dordrecht (spoorlijn Breda - Rotterdam), gebouwd in
// 1991-1994 in drie fasen. Twee gelijke tweesporige bruggen naast elkaar, elk
// met twee stalen vakwerkliggers over de rivier (twee velden, 88 en 77 tot
// 83 m), een hefbrug van 52 m met twee hefbare dekken tussen vier witte
// poten met dwarsbalken en buizen ("hemelbed", hoogste punt NAP +71,5 m), en
// betonnen aanbruggen op kolommen aan beide oevers. De Stadsbrug Zwijndrecht
// (verkeersbrug) ligt direct ten zuidwesten ernaast en zit niet in dit model;
// het ronde bedieningsgebouw tussen beide bruggen (BAG-pand 0505100000067669)
// ook niet. Alle maten in het script zijn meters op ware grootte. Uitvoer: een
// GLB in meters (Y omhoog, één node per onderdeel met de materiaalklasse in
// de nodenaam) als catalogusbron voor de export en de kaart, plus een binaire
// STL in millimeters op 1:<schaal> met een printvoet onder de dekken. De brug
// is 468 m lang en past op 1:1000 niet in 400 mm, vandaar standaard 1:1250.
//
//   node scripts/generate-spoorbrug-dordrecht.mjs              # 1:1250 (standaard)
//   node scripts/generate-spoorbrug-dordrecht.mjs --scale 1500
//
// Assenstelsel: oorsprong midden op de hefbrug, op de lijn midden tussen de
// twee bruggen (RD 104297,57, 424947,98), z = NAP-hoogte (het PDOK-terrein
// legt de Oude Maas op ellipsoïdisch 43,66 tot 43,70 m, NAP + 43,63 m, dus op
// NAP 0), Z omhoog. +X loopt langs de brug naar het zuidoosten (Dordrecht,
// RD-richting -34,68 graden vanaf het oosten), +Y naar het noordoosten
// (stroomopwaarts). De zuidwestelijke brug ligt op y = -14,7 tot -3,2, de
// noordoostelijke op 3,2 tot 14,7. De poten van het hemelbed staan op
// x = ±28,6 en y = ±24; de hefdekken lopen van x = -25,9 tot 25,9. De
// rivierpijlers staan op x = -213,4 tot -199,1 (Zwijndrecht) en -125,8 tot
// -110,6; de hefbrugpijler aan de Zwijndrechtse kant op -44,4 tot -25,5. De
// aanbrug aan de Zwijndrechtse kant begint op x = -305,6 (zuidwest) en
// -310,1 (noordoost), die aan de Dordtse kant eindigt op 150,9 en 158,1.
//
// Bronnen: BGT overbruggingsdeel (dekken en hun uiteinden, de rivierpijlers,
// de ronde voeten van de poten (4 m), de kolommen van 1,0 × 1,6 m en de
// scheve pijlerwanden onder de Dordtse aanbrug, de landhoofden, de dwarsbalken
// van het hemelbed (6,16 × 58 m)); BGT wegdeel (spoorbaan op het dek:
// gesloten verharding over de rivier, de hefbrug en de Dordtse aanbrug, half
// verhard op de Zwijndrechtse aanbrug); AHN DSM 0,5 m (PDOK WCS) voor de
// spoorstaafhoogte (NAP +11,45 m bij Zwijndrecht, +12,9 m over de rivier,
// dalend naar +9,9 m bij Dordrecht), de vier vakwerklijnen (4,4 en 13,5 m
// naast de middenlijn) met de bovenrand op NAP +21,3 m, de uiteinden van de
// liggers, de poten (top NAP +71,5 m, boven 6 m breed), de dwarsbalken en
// buizen (bovenkant NAP +65 m, buizen 5,5 m dik boven het midden van elke
// brug), de pijlerkoppen (NAP +5 m) en de remmingwerken; Wikipedia (lengte
// circa 560 m, breedte 2 × 12,6 m, doorvaarthoogte 11,40 m, langste
// overspanning 88,2 m, hoogste punt 65 m, bouw 1991-1994, architect
// P. v.d. Ree); PDOK-luchtfoto voor de vakken, voegen en remmingwerken;
// Wikimedia Commons-foto's (Dordrecht Spoorbrug 2026-04-22-1.jpg en -2.jpg,
// Het Hemelbed - Flickr - LeonardoDaQuirm.jpg, Geheven spoorbrug in
// Dordrecht.jpg, Dordrecht Railway Bridge.jpg, Railway Bridge Dordrecht
// Netherlands.jpg, Symmetrie, Spoorbrug over de Oude Maas, Dordrecht
// (12171358784).jpg, Spoorbrug in Dordrecht gezien vanaf Veerplein in
// Zwijndrecht I.jpg) voor de vorm van de poten (rond, naar boven breder, schuin
// afgesneden, vier groeven), de dwarsbalken, de buizen, de geleidetorens met
// kruisverbanden, het vakwerk met verticalen en de betonnen aanbruggen.
// Geschat: de vakverdeling (acht en zeven vakken in de vaste liggers, vijf in
// de hefliggers), de constructiehoogtes (stalen dek 1,5 m, betonnen
// kokerligger 2,6 m), de onderkant van de dwarsbalk (NAP +57,5 m), de
// geleidetorens (6,2 m diep, tot de dwarsbalk), de schoren van 50 graden onder
// de dwarsbalk (printbaar in plaats van een vlakke onderkant), de groeven in
// de poten, de pijlerschachten tot onder het dek, de kolommen en kespen onder
// de Zwijndrechtse aanbrug (niet in de BGT, onder het dek niet in het AHN) en
// de hoogte van de remmingwerken (NAP +3,5 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1250"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "spoorbrug-dordrecht");
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
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
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
// Prisma langs X met een vaste convexe doorsnede in het YZ-vlak.
const prismX = (section, x0, x1) => loftX([{ x: x0, section: ccw(section) }, { x: x1, section: ccw(section) }]);
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};
const lerp = (a, b, t) => a + (b - a) * t;
// Driehoek naar binnen verschoven over d (de halve breedte van de staven
// eromheen); null als er te weinig opening overblijft.
function insetTriangle(tri, d, minArea = 2.0) {
  const polys = new CrossSection([ccw(tri)]).offset(-d, "Miter").toPolygons();
  if (polys.length !== 1 || polys[0].length < 3) return null;
  const pts = polys[0].map(([a, b]) => [a, b]);
  return Math.abs(area2(pts)) >= minArea ? pts : null;
}

// ---------- hoofdmaten ----------
// z = NAP-hoogte; de Oude Maas ligt in het PDOK-terrein op NAP 0.
const BASE = -1.0; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
const GROUND_HEIGHT = 43.66; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten

// Spoorstaafhoogte in NAP (AHN, 25e percentiel tussen de liggers per 10 m;
// beide bruggen gelijk).
const RAIL_NAP = [
  [-317.4, 11.33], [-310.1, 11.45], [-287.4, 11.84], [-267.4, 12.13], [-247.4, 12.39], [-227.4, 12.59],
  [-212.4, 12.69], [-197.4, 12.77], [-177.4, 12.84], [-157.4, 12.88], [-132.4, 12.9], [-107.4, 12.9],
  [-87.4, 12.88], [-67.4, 12.85], [-47.4, 12.75], [-31.4, 12.62], [24.6, 12.15], [37.6, 11.97],
  [47.6, 11.83], [57.6, 11.68], [67.6, 11.53], [77.6, 11.34], [87.6, 11.17], [97.6, 11.0], [107.6, 10.84],
  [117.6, 10.67], [127.6, 10.5], [137.6, 10.32], [147.6, 10.12], [157.6, 9.88], [165.0, 9.7],
];
function rail(x) {
  const pts = RAIL_NAP;
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    if (x <= x1) return z0 + ((z1 - z0) * (x - x0)) / (x1 - x0);
  }
  return pts[pts.length - 1][1];
}
// Twee bruggen; c is de middenlijn, s de kant (-1 zuidwest, +1 noordoost).
// Dek 11,5 m breed (BGT 11 tot 12,6 m); de uiteinden volgen de BGT.
const BRIDGES = [
  { label: "zuidwest", s: -1, c: -8.95, xNW: -305.6, xSE: 150.9, trussEnd: -39.4, halfVerhardTo: -275.7 },
  { label: "noordoost", s: 1, c: 8.95, xNW: -310.1, xSE: 158.1, trussEnd: -34.9, halfVerhardTo: -208.2 },
];
const DECK_HALF = 5.75;
const STEEL_DEPTH = 1.5; // stalen dek onder de spoorstaaf (vakwerk en hefbrug)
const BOX = { half: 3.2, depth: 2.6, top: 1.4 }; // betonnen kokerligger onder de aanbruggen
const KERB = { width: 0.6, height: 1.2 }; // borstwering langs de aanbruggen

// Vakwerkliggers: per brug twee lijnen van 1,0 m dik op 4,55 m naast de
// middenlijn (AHN: 4,4 en 13,5 m naast de middenlijn tussen de bruggen).
// Staven 0,9 m; onderrand van 0,3 m onder tot 0,6 m boven de spoorstaaf.
const TRUSS_OFFSET = 4.55;
const TRUSS_HALF = 0.5;
const BAR = 0.9;
const CHORD_TOP = 0.6;
const NICHE = 0.35;
const TRUSS_HEIGHT = 8.4; // bovenrand NAP +21,3 m over de rivier (AHN)
const TRUSS_START = -204.0; // begin van de liggers boven de Zwijndrechtse rivierpijler
const PIER_MID = -118.2; // middensteunpunt (hart van de middelste rivierpijler)
// Hefbrug: dekken van x = -25,9 tot 25,9 met liggers van dezelfde hoogte in
// vijf vakken; de liggers sluiten aan op de geleidetorens.
const LIFT = { x0: -26.15, x1: 26.15, panels: 5 };
// Hemelbed: per kant een portaal op x = ±28,6 met twee poten, een dwarsbalk,
// twee geleidetorens (één per brug) en tussen de portalen twee buizen.
const PORTAL_X = 28.6;
const CROSSBEAM = { half: 3.08, y: 27.0, bottom: 57.5, top: 65.0 };
const LEG = { r: 2.05, y: 24.0, topIn: 22.6, topOut: 28.65, topHalfX: 2.75, topZ: 66.0, peak: 71.5, cut: 65.5 };
const GROOVES = { z: [42.5, 45.0, 47.5, 50.0], height: 1.0, depth: 0.35 };
const TOWER = { half: 3.08, side: TRUSS_OFFSET + TRUSS_HALF, passage: TRUSS_OFFSET - TRUSS_HALF, shoulder: 7.0, top: 57.6, sidePanels: 6 };
const TUBE = { y: 9.0, z: 62.25, r: 2.75, x: 27.6 };
const HAUNCH_DEG = 50; // schoren onder de dwarsbalk: spitse openingen
const PIER_CAP = 5.0; // pijlerkoppen (AHN)
const FENDER_TOP = 3.5; // remmingwerken (AHN)

// Rivierpijlers (BGT, lokale coördinaten).
const RIVER_PIERS = [
  {
    x: -206.3,
    poly: [[-199.11, 15.5], [-213.39, 15.23], [-213.37, 2.29], [-209.52, 2.44], [-209.56, -24.69], [-199.1, -24.69]],
    shaft: [-209.3, -202.3],
  },
  { x: PIER_MID, poly: [[-110.83, 15.47], [-125.81, 15.42], [-125.69, -21.8], [-110.6, -21.65]], shaft: [-122.2, -114.2] },
];
// Hefbrugpijlers (AHN: kop op NAP +5 m), aan de Dordtse kant op de kade.
const LIFT_PIERS = [
  { x0: -44.4, x1: -25.5, y0: -28.0, y1: 30.3, shaft: [-44.0, -25.9] },
  { x0: 25.6, x1: 34.5, y0: -28.0, y1: 30.3, shaft: [26.0, 34.0] },
];
// Kolommen van 1,0 × 1,6 m onder de Dordtse aanbrug (BGT); de scheve rij
// staat langs de straat.
const SE_COLUMNS = [
  [[47.8, 12.47], [47.79, 13.39], [46.79, 13.38], [46.81, 11.79], [47.81, 11.8]],
  [[47.82, 7.07], [46.82, 7.2], [46.82, 5.6], [47.82, 5.6]],
  [[47.93, -5.69], [47.92, -4.59], [46.92, -4.61], [46.94, -6.22], [47.94, -6.21]],
  [[47.94, -10.93], [46.93, -10.8], [46.95, -12.41], [47.95, -12.4]],
  [[34.83, 12.46], [34.83, 11.73], [35.83, 11.73], [35.83, 13.33], [34.83, 13.33]],
  [[34.85, 7.03], [34.87, 5.55], [35.87, 5.56], [35.84, 7.14]],
  [[61.85, -5.65], [61.84, -4.55], [60.84, -4.56], [60.86, -6.16], [61.86, -6.15]],
  [[61.86, -10.75], [60.86, -10.76], [60.88, -12.36], [61.88, -12.35]],
  [[127.73, 11.65], [127.94, 12.12], [127.03, 12.52], [126.33, 10.97], [127.24, 10.56]],
  [[125.33, 6.22], [125.39, 6.36], [124.48, 6.76], [123.79, 5.21], [124.7, 4.8]],
  [[119.07, -5.49], [118.84, -5.99], [119.75, -6.4], [120.45, -4.84], [119.54, -4.44]],
  [[116.84, -10.52], [116.3, -11.74], [117.21, -12.15], [117.9, -10.6], [116.99, -10.19]],
  [[75.87, -11.5], [75.86, -10.7], [74.86, -10.71], [74.87, -12.31], [75.87, -12.3]],
  [[75.85, -5.61], [75.85, -4.5], [74.85, -4.5], [74.85, -6.1], [75.85, -6.1]],
  [[75.79, 7.17], [74.79, 7.3], [74.79, 5.69], [75.79, 5.69]],
  [[75.77, 12.49], [75.76, 13.48], [74.76, 13.47], [74.77, 11.86], [75.77, 11.87]],
  [[60.79, 12.48], [60.79, 11.83], [61.79, 11.84], [61.78, 13.45], [60.78, 13.44]],
  [[60.81, 7.12], [60.81, 5.64], [61.81, 5.65], [61.81, 7.26]],
];
// Kespen op de rechte rijen (geschat op foto's): 1,8 m breed, 1,2 m hoog onder
// de kokerligger, over de twee kolommen van elke brug.
const SE_BENTS = [35.33, 47.37, 61.35, 75.32];
// Scheve pijlerwanden onder de Dordtse aanbrug (BGT).
const SE_WALLS = [
  [[95.51, -2.74], [88.85, -2.79], [88.91, -13.84], [90.45, -13.98]],
  [[98.38, 3.84], [102.09, 12.23], [103.29, 14.93], [88.75, 15.18], [88.82, 3.85]],
];
// Landhoofden aan de Dordtse kant (BGT), afgesneden op het dek.
const SE_ABUTMENTS = [
  [[146.59, -2.53], [140.5, -15.61], [144.97, -15.98], [150.9, -2.51]],
  [[153.59, 14.1], [148.21, 1.89], [152.75, 1.7], [158.09, 13.8]],
];
// Zwijndrechtse aanbrug: kolommen en kespen op de voegen (luchtfoto) op
// x = -282,9 en -235,4, op dezelfde plaatsen naast de as als aan de Dordtse
// kant (geschat).
const NW_BENTS = [-282.9, -235.4];
const COLUMN_Y = [[-12.4, -10.8], [-6.2, -4.6], [5.6, 7.2], [11.8, 13.4]];
const NW_ABUTMENT = 6.0;

// Remmingwerken (AHN, luchtfoto): aan de noordoostkant van elke pijler een
// A-vormig raamwerk met een spitse neus, aan de zuidwestkant van de
// rivierpijlers twee wanden naar de pijlers van de Stadsbrug toe (tot y = -36).
const FENDER_WALL = 1.5;
const A_FENDERS = [
  { xc: -206.4, y0: 15.0, half0: 8.0, yTop: 37.85, halfTop: 3.5, yNose: 40.0, bars: [[18.35, 1.5], [25.35, 1.5], [34.6, 3.0]] },
  { xc: -118.4, y0: 15.0, half0: 8.0, yTop: 37.85, halfTop: 3.5, yNose: 40.0, bars: [[18.35, 1.5], [25.35, 1.5], [34.6, 3.0]] },
  { xc: -31.9, y0: 16.85, half0: 10.5, yTop: 42.35, halfTop: 6.5, yNose: 45.0, bars: [[18.35, 1.5], [36.35, 4.5]] },
];
const SW_FENDERS = [
  { x: [-208.4, -199.4], y0: -24.0, y1: -36.0 },
  { x: [-125.4, -111.4], y0: -21.0, y1: -36.0 },
];

// ---------- dekken, borstweringen, kokerliggers ----------
const deckBottom = (x) => rail(x) - STEEL_DEPTH;
const bridgeStations = (b) => stationsX(b.xNW, b.xSE, 2);
const decks = BRIDGES.map((b) =>
  loftX(
    bridgeStations(b).map((x) => {
      const zt = rail(x);
      return { x, section: [[b.c - DECK_HALF, zt - STEEL_DEPTH], [b.c + DECK_HALF, zt - STEEL_DEPTH], [b.c + DECK_HALF, zt], [b.c - DECK_HALF, zt]] };
    }),
  ),
);
// Aanbruggen: van het uiteinde tot de rivierpijler en vanaf de Dordtse
// geleidetoren.
const approachRanges = (b) => [
  [b.xNW, TRUSS_START],
  [PORTAL_X + TOWER.half, b.xSE],
];
const boxGirders = BRIDGES.flatMap((b) =>
  approachRanges(b).map(([x0, x1]) =>
    loftX(
      stationsX(x0, x1, 2).map((x) => {
        const zt = rail(x);
        return { x, section: [[b.c - BOX.half, zt - BOX.depth], [b.c + BOX.half, zt - BOX.depth], [b.c + BOX.half, zt - BOX.top], [b.c - BOX.half, zt - BOX.top]] };
      }),
    ),
  ),
);
function kerb(x0, x1, y0, y1, margin = 0) {
  return loftX(
    stationsX(x0, x1, 2).map((x) => {
      const zt = rail(x);
      return { x, section: [[y0 - margin, zt - 0.3 - margin], [y1 + margin, zt - 0.3 - margin], [y1 + margin, zt + KERB.height + margin], [y0 - margin, zt + KERB.height + margin]] };
    }),
  );
}
const KERBS = BRIDGES.flatMap((b) =>
  approachRanges(b).flatMap(([x0, x1]) => [
    [x0, x1, b.c - DECK_HALF, b.c - DECK_HALF + KERB.width],
    [x0, x1, b.c + DECK_HALF - KERB.width, b.c + DECK_HALF],
  ]),
);
const kerbs = KERBS.map(([x0, x1, y0, y1]) => kerb(x0, x1, y0, y1));

// ---------- vakwerkliggers ----------
// Per ligger: onderknopen op de vakgrenzen, bovenknopen midden daartussen
// (vakwerk met de diagonalen als W). De plaat loopt van de onderkant van het
// dek tot de bovenrand; bij de uiteinden zakt de bovenrand langs de eindstijl
// naar 0,9 m boven de spoorstaaf. De driehoeken met de punt omhoog zijn
// doorgaande openingen, die met een vlakke bovenkant blinde nissen van 0,35 m.
const openingAngles = [];
let throughOpenings = 0;
let blindNiches = 0;
function girder(spans, top, lines) {
  const bottomX = [];
  for (const [a, b, n] of spans) {
    for (let k = bottomX.length ? 1 : 0; k <= n; k++) bottomX.push(a + ((b - a) * k) / n);
  }
  const tops = bottomX.slice(0, -1).map((x, i) => {
    const xm = (x + bottomX[i + 1]) / 2;
    return [xm, top(xm)];
  });
  const x0 = bottomX[0];
  const x1 = bottomX[bottomX.length - 1];
  const steps = Math.max(1, Math.round((x1 - x0) / 2));
  const outline = [
    ...Array.from({ length: steps + 1 }, (_, i) => {
      const x = x0 + ((x1 - x0) * i) / steps;
      return [x, deckBottom(x)];
    }),
    [x1, rail(x1) + BAR],
    ...[...tops].reverse(),
    [x0, rail(x0) + BAR],
  ];
  const zb = (x) => rail(x) + CHORD_TOP - BAR / 2;
  const holes = [];
  const niches = [];
  for (let i = 0; i < tops.length; i++) {
    const tri = [
      [bottomX[i], zb(bottomX[i])],
      [bottomX[i + 1], zb(bottomX[i + 1])],
      [tops[i][0], tops[i][1] - BAR / 2],
    ];
    const hole = insetTriangle(tri, BAR / 2);
    if (hole) {
      holes.push(hole);
      const apex = hole.reduce((p, q) => (q[1] > p[1] ? q : p));
      for (const q of hole) {
        if (q === apex) continue;
        openingAngles.push((Math.atan2(apex[1] - q[1], Math.abs(apex[0] - q[0])) * 180) / Math.PI);
      }
    }
    if (i > 0) {
      const inv = [
        [tops[i - 1][0], tops[i - 1][1] - BAR / 2],
        [bottomX[i], zb(bottomX[i])],
        [tops[i][0], tops[i][1] - BAR / 2],
      ];
      const niche = insetTriangle(inv, BAR / 2);
      if (niche) niches.push(niche);
    }
  }
  throughOpenings += holes.length * lines.length;
  blindNiches += niches.length * lines.length;
  return {
    x0,
    x1,
    solids: lines.map(({ y0, y1, niche }) => {
      const plate = profileY(outline, y0, y1);
      const cut = [
        ...holes.map((h) => profileY(h, y0 - 0.3, y1 + 0.3)),
        ...niches.map((h) => (niche === "low" ? profileY(h, y0 - 0.3, y0 + NICHE) : profileY(h, y1 - NICHE, y1 + 0.3))),
      ];
      return plate.subtract(union(cut));
    }),
  };
}
// Lijnen per brug; de nis zit aan de buitenkant van de buitenste ligger en aan
// de spoorkant van de binnenste.
const trussLines = (b) => {
  const outer = b.c + b.s * TRUSS_OFFSET;
  const inner = b.c - b.s * TRUSS_OFFSET;
  return [
    { y0: outer - TRUSS_HALF, y1: outer + TRUSS_HALF, niche: b.s < 0 ? "low" : "high" },
    { y0: inner - TRUSS_HALF, y1: inner + TRUSS_HALF, niche: b.s < 0 ? "low" : "high" },
  ];
};
const fixedTop = (x) => rail(x) + TRUSS_HEIGHT;
const fixedGirders = BRIDGES.map((b) =>
  girder(
    [
      [TRUSS_START, PIER_MID, 8],
      [PIER_MID, b.trussEnd, 7],
    ],
    fixedTop,
    trussLines(b),
  ),
);
const liftGirders = BRIDGES.map((b) => girder([[LIFT.x0, LIFT.x1, LIFT.panels]], fixedTop, trussLines(b)));

// ---------- pijlers, kolommen, landhoofden ----------
const yBand = (b) => [b.c - DECK_HALF, b.c + DECK_HALF];
const riverPiers = RIVER_PIERS.flatMap(({ x, poly, shaft }) => [
  prism(poly, BASE, PIER_CAP),
  // Schachten per brug tot NAP +10 (AHN), daarboven een oplegblok tot onder
  // het dek.
  ...BRIDGES.flatMap((b) => {
    const [y0, y1] = b.s < 0 ? [-17.5, -0.7] : [0.7, 17.5];
    const [d0, d1] = yBand(b);
    return [boxFromTo(shaft[0], shaft[1], y0, y1, PIER_CAP - 0.1, 10.0), boxFromTo(shaft[0], shaft[1], d0, d1, 9.9, deckBottom(x) + 0.3)];
  }),
]);
const chamferRect = (x0, x1, y0, y1, c) => [
  [x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c],
];
const liftPiers = LIFT_PIERS.flatMap(({ x0, x1, y0, y1, shaft }) => [
  prism(chamferRect(x0, x1, y0, y1, 2.5), BASE, PIER_CAP),
  ...BRIDGES.map((b) => {
    const [d0, d1] = yBand(b);
    const zTop = Math.max(deckBottom(shaft[0]), deckBottom(shaft[1])) + 0.3;
    return boxFromTo(shaft[0], shaft[1], d0, d1, PIER_CAP - 0.1, zTop);
  }),
]);
const columnFor = (poly, zTop) => prism(poly, BASE, zTop);
const seColumns = SE_COLUMNS.map((poly) => {
  const xc = poly.reduce((s, [x]) => s + x, 0) / poly.length;
  const straight = SE_BENTS.some((xb) => Math.abs(xb - xc) < 1);
  return columnFor(poly, straight ? rail(xc) - BOX.depth - 1.15 : deckBottom(xc) + 0.3);
});
const bentCaps = (xs) =>
  xs.flatMap((xb) =>
    BRIDGES.map((b) => {
      const [y0, y1] = b.s < 0 ? [-12.6, -4.4] : [5.4, 13.6];
      return boxFromTo(xb - 0.9, xb + 0.9, y0, y1, rail(xb) - BOX.depth - 1.2, rail(xb) - BOX.depth + 0.3);
    }),
  );
const nwColumns = NW_BENTS.flatMap((xb) =>
  COLUMN_Y.map(([y0, y1]) => boxFromTo(xb - 0.5, xb + 0.5, y0, y1, BASE, rail(xb) - BOX.depth - 1.15)),
);
const seWalls = SE_WALLS.map((poly) => {
  const xMin = poly.reduce((m, [x]) => Math.min(m, x), Infinity);
  return prism(poly, BASE, deckBottom(xMin) + 0.3);
});
const abutments = [
  ...BRIDGES.map((b) => {
    const [y0, y1] = yBand(b);
    return loftX(
      stationsX(b.xNW, b.xNW + NW_ABUTMENT, 2).map((x) => ({ x, section: [[y0, BASE], [y1, BASE], [y1, rail(x) - 0.05], [y0, rail(x) - 0.05]] })),
    );
  }),
  ...SE_ABUTMENTS.map((poly, i) => {
    const b = BRIDGES[i];
    const [y0, y1] = yBand(b);
    const xMax = poly.reduce((m, [x]) => Math.max(m, x), -Infinity);
    return prism(poly, BASE, rail(xMax) - 0.05).intersect(boxFromTo(-400, 400, y0, y1, BASE - 1, 100));
  }),
];

// ---------- remmingwerken ----------
function aFender({ xc, y0, half0, yTop, halfTop, yNose, bars }) {
  const outer = [[xc - half0, y0], [xc + half0, y0], [xc + halfTop, yTop], [xc, yNose], [xc - halfTop, yTop]];
  const inner = new CrossSection([ccw(outer)]).offset(-FENDER_WALL, "Miter");
  const barSection = new CrossSection(bars.map(([y, w]) => ccw([[xc - 30, y - w / 2], [xc + 30, y - w / 2], [xc + 30, y + w / 2], [xc - 30, y + w / 2]])));
  const ring = new CrossSection([ccw(outer)]).subtract(inner.subtract(barSection));
  return Manifold.extrude(ring, FENDER_TOP - BASE).translate([0, 0, BASE]);
}
const fenders = [
  ...A_FENDERS.map(aFender),
  ...SW_FENDERS.flatMap(({ x, y0, y1 }) => x.map((xw) => boxFromTo(xw - 1.0, xw + 1.0, y1, y0, BASE, FENDER_TOP))),
];

// ---------- hemelbed ----------
// Poot: ronde voet van 4,1 m (BGT) op y = ±24, naar boven verbreed tot 6 m
// (AHN) met een ronde buitenkant, schuin afgesneden: van NAP +65,5 m aan de
// binnenkant tot +71,5 m aan de buitenkant. Op de buitenkant vier groeven als
// nissen van 0,35 m.
function legSection(xc, s, yIn, yOut, hx, grow = 0) {
  // rechthoek van yIn tot het middelpunt van de halve cirkel, daarna de boog
  const yCap = yOut - hx;
  const r = hx + grow;
  const pts = [[xc - r, s * (yIn - grow)], [xc + r, s * (yIn - grow)]];
  const n = 16;
  for (let k = 0; k <= n; k++) {
    const a = (Math.PI * k) / n; // 0..pi: van +x via buiten naar -x
    pts.push([xc + r * Math.cos(a), s * (yCap + r * Math.sin(a))]);
  }
  // de eerste boogpunt valt samen met de tweede hoek; ontdubbelen
  return ccw(pts.filter((p, i, arr) => i === 0 || Math.hypot(p[0] - arr[i - 1][0], p[1] - arr[i - 1][1]) > 1e-6));
}
const disc = (xc, yc, r, z, h = 0.01) => Manifold.cylinder(h, r, r, 32, false).translate([xc, yc, z]);
function leg(xc, s) {
  const slope = (LEG.peak - LEG.cut) / (LEG.topOut - LEG.topIn);
  const sec = (grow) => legSection(xc, s, LEG.topIn, LEG.topOut, LEG.topHalfX, grow);
  const hullOf = (grow) =>
    Manifold.hull([
      disc(xc, s * LEG.y, LEG.r + grow, BASE),
      Manifold.extrude([sec(grow)], 0.01).translate([0, 0, LEG.topZ]),
      Manifold.extrude([sec(grow)], 0.01).translate([0, 0, LEG.peak + 0.5]),
    ]);
  const n = Math.hypot(slope, 1);
  // houd z <= cut + slope * (|y| - topIn)
  const body = hullOf(0).trimByPlane([0, (s * slope) / n, -1 / n], -(LEG.cut - slope * LEG.topIn) / n);
  const core = hullOf(-GROOVES.depth);
  const bands = union(
    GROOVES.z.map((z) => boxFromTo(xc - 10, xc + 10, s * (LEG.y + 0.3), s * 40, z, z + GROOVES.height)),
  );
  return body.subtract(bands.subtract(core));
}
const legs = [-1, 1].flatMap((sx) => [-1, 1].map((s) => leg(sx * PORTAL_X, s)));
// Dwarsbalk met schoren van 50 graden in de openingen eronder (tussen de
// geleidetorens en tussen toren en poot), zodat er geen vlakke onderkant vrij
// hangt.
const TAN_H = Math.tan((HAUNCH_DEG * Math.PI) / 180);
const legInnerAt = (z) => LEG.y - LEG.r + ((LEG.topIn - (LEG.y - LEG.r)) * (z - BASE)) / (LEG.topZ - BASE);
function crossbeam(xc) {
  const beam = boxFromTo(xc - CROSSBEAM.half, xc + CROSSBEAM.half, -CROSSBEAM.y, CROSSBEAM.y, CROSSBEAM.bottom, CROSSBEAM.top);
  const zb = CROSSBEAM.bottom + 0.05;
  const yIn = BRIDGES[1].c - TOWER.side; // binnenkant toren (3,9 m)
  const yOut = BRIDGES[1].c + TOWER.side; // buitenkant toren (14,0 m)
  const yLeg = legInnerAt(CROSSBEAM.bottom - 5);
  const haunches = [];
  const tri = (ya, yb) => {
    // driehoek tegen de wand op ya, met de punt naar yb (halverwege de opening)
    const d = Math.abs(yb - ya);
    const sgn = Math.sign(yb - ya);
    return [[ya - sgn * 0.1, zb], [ya - sgn * 0.1, zb - d * TAN_H - 0.1 * TAN_H], [yb, zb]];
  };
  for (const s of [-1, 1]) {
    const mid = (s * yOut + s * yLeg) / 2;
    haunches.push(tri(s * yOut, mid), tri(s * yLeg, mid));
  }
  haunches.push(tri(-yIn, 0), tri(yIn, 0));
  return union([beam, ...haunches.map((t) => prismX(t, xc - CROSSBEAM.half, xc + CROSSBEAM.half))]);
}
const crossbeams = [-1, 1].map((sx) => crossbeam(sx * PORTAL_X));
// Geleidetorens: per brug een kokervormige toren zo diep als de dwarsbalk over de hele
// breedte tussen de liggers, van het dek tot de dwarsbalk, met onderin een
// doorgang voor de treinen met een spitse bovenkant, op de zijvlakken
// kruisverbanden met doorgaande openingen en op de kopse vlakken als blinde
// nissen.
function xPanelTriangles(a0, a1, z0, z1, n, kinds = ["bottom", "top", "left", "right"]) {
  const tris = [];
  for (let k = 0; k < n; k++) {
    const za = z0 + ((z1 - z0) * k) / n;
    const zc = z0 + ((z1 - z0) * (k + 1)) / n;
    const am = (a0 + a1) / 2;
    const zm = (za + zc) / 2;
    const all = {
      bottom: [[a0, za], [a1, za], [am, zm]],
      top: [[a0, zc], [am, zm], [a1, zc]],
      left: [[a0, za], [am, zm], [a0, zc]],
      right: [[a1, za], [a1, zc], [am, zm]],
    };
    for (const kind of kinds) tris.push(all[kind]);
  }
  return tris.map((t) => insetTriangle(t, BAR / 2, 0.5)).filter(Boolean);
}
let towerNiches = 0;
const towerAngles = [];
function guideTower(xc, b) {
  const zr = rail(xc);
  const y0 = b.c - TOWER.side;
  const y1 = b.c + TOWER.side;
  const box = boxFromTo(xc - TOWER.half, xc + TOWER.half, y0, y1, zr - 0.3, TOWER.top);
  const shoulder = zr + TOWER.shoulder;
  const apex = shoulder + TOWER.passage * TAN_H * 1.1;
  const passage = prismX(
    [[b.c - TOWER.passage, zr - 1], [b.c + TOWER.passage, zr - 1], [b.c + TOWER.passage, shoulder], [b.c, apex], [b.c - TOWER.passage, shoulder]],
    xc - TOWER.half - 1,
    xc + TOWER.half + 1,
  );
  const cuts = [];
  // x-vlakken boven de doorgang: drie velden met een kruis
  const xFaces = xPanelTriangles(b.c - TRUSS_OFFSET, b.c + TRUSS_OFFSET, apex + 0.6, TOWER.top - 0.9, 3);
  for (const fx of [xc - TOWER.half, xc + TOWER.half]) {
    const inward = fx < xc ? 1 : -1;
    for (const t of xFaces) cuts.push(prismX(t, Math.min(fx - inward * 0.3, fx + inward * NICHE), Math.max(fx - inward * 0.3, fx + inward * NICHE)));
  }
  // Zijvlakken: zes velden met een kruis over de hele hoogte; de driehoeken
  // onder en naast het kruis zijn doorgaande openingen dwars door de toren
  // (flanken van 54 graden), die erboven blinde nissen.
  const a0 = xc - TOWER.half + 0.45;
  const a1 = xc + TOWER.half - 0.45;
  const z0 = zr + 0.6;
  const z1 = TOWER.top - 0.9;
  for (const t of xPanelTriangles(a0, a1, z0, z1, TOWER.sidePanels, ["bottom", "left", "right"])) {
    cuts.push(profileY(t, y0 - 0.5, y1 + 0.5));
    const apex = t.reduce((p, q) => (q[1] > p[1] ? q : p));
    for (const q of t) if (q !== apex && Math.abs(q[0] - apex[0]) > 1e-6) towerAngles.push((Math.atan2(apex[1] - q[1], Math.abs(apex[0] - q[0])) * 180) / Math.PI);
  }
  for (const fy of [y0, y1]) {
    const inward = fy < b.c ? 1 : -1;
    for (const t of xPanelTriangles(a0, a1, z0, z1, TOWER.sidePanels, ["top"])) {
      cuts.push(profileY(t, Math.min(fy - inward * 0.3, fy + inward * NICHE), Math.max(fy - inward * 0.3, fy + inward * NICHE)));
    }
  }
  towerNiches += cuts.length;
  return box.subtract(passage).subtract(union(cuts));
}
const towers = [-1, 1].flatMap((sx) => BRIDGES.map((b) => guideTower(sx * PORTAL_X, b)));
// Buizen tussen de portalen boven het midden van elke brug, met een kiel van
// 50 graden aan de onderkant (de export zet er een scherm onder).
function tube(y) {
  const pts = [];
  const n = 24;
  for (let k = 0; k <= n; k++) {
    const a = (-40 * Math.PI) / 180 + ((260 * Math.PI) / 180) * (k / n); // van rechtsonder via boven naar linksonder
    pts.push([y + TUBE.r * Math.cos(a), TUBE.z + TUBE.r * Math.sin(a)]);
  }
  pts.push([y, TUBE.z - TUBE.r / Math.cos((50 * Math.PI) / 180)]);
  return prismX(pts, -TUBE.x, TUBE.x);
}
const tubes = [-TUBE.y, TUBE.y].map(tube);

// ---------- de brug als geheel ----------
const girderSolids = [...fixedGirders, ...liftGirders].flatMap((g) => g.solids);
const bridge = union([
  ...decks,
  ...boxGirders,
  ...kerbs,
  ...girderSolids,
  ...riverPiers,
  ...liftPiers,
  ...seColumns,
  ...bentCaps(SE_BENTS),
  ...nwColumns,
  ...bentCaps(NW_BENTS),
  ...seWalls,
  ...abutments,
  ...fenders,
  ...legs,
  ...crossbeams,
  ...towers,
  ...tubes,
]);

// ---------- printvoet (alleen in de STL) ----------
// Onder elk dek een wig van 50 graden die uitloopt in een scherm van 0,9 m
// tot de onderplaat, net als de overhangopvulling van de export; onder elke
// buis een scherm van 0,9 m tot het hefdek.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const printFoot = union([
  ...BRIDGES.map((b) =>
    loftX(
      stationsX(b.xNW + NW_ABUTMENT, b.xSE - 4, 1).map((x) => {
        const zb = deckBottom(x) - 0.02;
        const zIn = rail(x) - 0.3;
        const w = DECK_HALF;
        const zs = zb - KNEE * (w - SCREEN);
        const c = b.c;
        return {
          x,
          section: [[c - SCREEN, BASE], [c + SCREEN, BASE], [c + SCREEN, zs], [c + w, zb], [c + w, zIn], [c - w, zIn], [c - w, zb], [c - SCREEN, zs]],
        };
      }),
    ),
  ),
  ...[-TUBE.y, TUBE.y].map((y) =>
    prismX([[y - SCREEN, rail(0) - 0.3], [y + SCREEN, rail(0) - 0.3], [y + SCREEN, TUBE.z - TUBE.r], [y - SCREEN, TUBE.z - TUBE.r]], -LIFT.x1, LIFT.x1),
  ),
]);
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
    const key =
      zm < rail(xm) + 0.05 ? "dek en kespen" : zm > CROSSBEAM.bottom - 1 ? "dwarsbalken en buizen" : zm > rail(xm) + CHORD_TOP ? "nissen" : "overig";
    buckets[key] = (buckets[key] ?? 0) + len / 2;
  }
  return Object.fromEntries(Object.entries(buckets).map(([k, a]) => [k, +a.toFixed(1)]));
}
const minAngle = openingAngles.reduce((m, a) => Math.min(m, a), Infinity);
console.log("vrij hangend in het model (m2):", overhangs(bridge));
console.log("torenopeningen: steilste plafond min (graden)", +towerAngles.reduce((m, a) => Math.min(m, a), Infinity).toFixed(1));
console.log("doorgaande openingen", throughOpenings, "blinde nissen", blindNiches, "torennissen", towerNiches, "steilste flank min (graden)", +minAngle.toFixed(1));
if (minAngle < 50) throw new Error("opening met een te vlakke flank");

// ---------- spoor als eigen onderdelen ----------
// De bovenste 0,5 m van elk dek is een eigen node met de attributen van het
// BGT-wegdeel (glTF `extras.attributes`), zodat de kleurregels van een thema
// (bijvoorbeeld spoor zwart) op de brug werken zoals op de PDOK-wegdelen
// ernaast. Op het dek liggen actuele BGT-wegdelen met functie spoorbaan:
// gesloten verharding over de rivier (L0004 ...e25494467883 zuidwest,
// ...bf5f6a91c742 noordoost), op de hefdekken (...47b9927f1d26,
// ...36893941177f) en op de Dordtse aanbrug (...66b05241b330,
// ...9c2b89974516); half verhard op de Zwijndrechtse aanbrug (...bda42cd35582
// zuidwest tot x = -275,7, ...df1c01d7a86c noordoost tot x = -208,2). Het
// spoor is de strook van 0,5 m onder tot 1 m boven de spoorstaaf over de
// hele dekbreedte, min de vakwerkliggers, de geleidetorens en de
// borstweringen met 2 cm vrij; wordt pas hier gebouwd, nadat het printmodel
// is doorgerekend, zodat de STL gelijk blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
const BALLAST_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "half verhard" };
const strips = BRIDGES.map((b) =>
  loftX(
    [b.xNW - 0.5, ...bridgeStations(b), b.xSE + 0.5].map((x) => {
      const zt = rail(x);
      const [y0, y1] = [b.c - DECK_HALF - 0.5, b.c + DECK_HALF + 0.5];
      return { x, section: [[y0, zt - LAYER], [y1, zt - LAYER], [y1, zt + ABOVE], [y0, zt + ABOVE]] };
    }),
  ),
);
// De hele strook van elke ligger- en torenwand blijft constructie, ook onder
// de openingen, met 2 cm vrij.
const plateGuards = BRIDGES.flatMap((b, i) =>
  trussLines(b).flatMap(({ y0, y1 }) =>
    [
      [fixedGirders[i].x0, fixedGirders[i].x1],
      [liftGirders[i].x0, liftGirders[i].x1],
      [-PORTAL_X - TOWER.half, -PORTAL_X + TOWER.half],
      [PORTAL_X - TOWER.half, PORTAL_X + TOWER.half],
    ].map(([x0, x1]) =>
      loftX(
        stationsX(x0 - GUARD, x1 + GUARD, 2).map((x) => ({
          x,
          section: [[y0 - GUARD, rail(x) - LAYER - 0.1], [y1 + GUARD, rail(x) - LAYER - 0.1], [y1 + GUARD, rail(x) + ABOVE + 0.1], [y0 - GUARD, rail(x) + ABOVE + 0.1]],
        })),
      ),
    ),
  ),
);
const kerbGuards = KERBS.map(([x0, x1, y0, y1]) => kerb(x0 - GUARD, x1 + GUARD, y0, y1, GUARD));
const notLayer = union([...plateGuards, ...kerbGuards]);
const layer = union(strips).subtract(notLayer);
const ballastZone = union(BRIDGES.map((b) => boxFromTo(b.xNW - 5, b.halfVerhardTo, b.c - 10, b.c + 10, BASE - 1, 100)));
const ballastCut = layer.intersect(ballastZone);
const spoorCut = layer.subtract(ballastZone);
const ballast = ballastCut.intersect(bridge);
const spoor = spoorCut.intersect(bridge);
const structure = bridge.subtract(layer);
const parts = [
  ["building:spoorbrug-dordrecht", structure],
  ["road:spoor", spoor, SPOOR_ATTRIBUTES],
  ["road:spoor-halfverhard", ballast, BALLAST_ATTRIBUTES],
];
{
  const whole = bridge.volume();
  const sum = structure.volume() + spoor.volume() + ballast.volume();
  console.log(
    "volumes (m3): brug",
    +whole.toFixed(1),
    "constructie",
    +structure.volume().toFixed(1),
    "spoor",
    +spoor.volume().toFixed(1),
    "half verhard",
    +ballast.volume().toFixed(1),
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
const report = {};
for (const [name, solid, attributes] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    ...(attributes ? { attributes } : {}),
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
const glbFile = path.join(outDir, "spoorbrug-dordrecht.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-spoorbrug-dordrecht.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `spoorbrug-dordrecht-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Spoorbrug Dordrecht 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten op het
// water van de Oude Maas, 25 m naast de middenlijn aan beide kanten, bij de
// hefbrug en in de twee rivierveldens.
const samplePoints = [-160, -70, 0].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "spoorbrug-dordrecht.json"),
  JSON.stringify(
    {
      name: "Spoorbrug Dordrecht",
      file: "spoorbrug-dordrecht.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [104297.57, 424947.98],
      xAxis: [0.82239736, -0.56891351],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het midden van de hefbrug op de lijn tussen de twee bruggen in de oorsprong, z = NAP-hoogte (de Oude Maas op NAP 0), +X langs de brug naar het zuidoosten (Dordrecht, RD-richting -34,68 graden vanaf het oosten) en +Y naar het noordoosten (stroomopwaarts). Drie nodes. road:spoor en road:spoor-halfverhard: de bovenste 0,5 m van de twee dekken (y = -14,7 tot -3,2 en 3,2 tot 14,7) buiten de vakwerkliggers, geleidetorens en borstweringen, met de attributen van de BGT-wegdelen op het dek in extras.attributes (bgt_functie spoorbaan; bgt_fysiekvoorkomen gesloten verharding over de rivier, de hefbrug en de Dordtse aanbrug, half verhard op de Zwijndrechtse aanbrug), zodat de kleurregels van een thema erop werken. building:spoorbrug-dordrecht: de rest van het kunstwerk van 1991-1994: twee tweesporige bruggen naast elkaar, elk met twee vakwerkliggers (4,4 en 13,5 m naast de middenlijn, bovenrand NAP +21,3 m) als dichte platen van 1,0 m met doorgaande driehoekige openingen met de punt omhoog en blinde nissen voor de driehoeken met een vlakke bovenkant, over twee velden (88 m en 77 tot 83 m) tussen de rivierpijlers met pijlerkop op NAP +5 m; de hefbrug van 52 m met twee hefdekken in gesloten stand (spoorstaaf NAP +12,6 tot +12,2 m) tussen het hemelbed: vier witte poten op x = ±28,6 en y = ±24 (ronde voet van 4 m, boven 6 m breed, schuin afgesneden tot NAP +71,5 m, vier groeven), twee dwarsbalken van 6,2 m breed tot NAP +65 m met schoren van 50 graden, vier geleidetorens met kruisverbanden en een spitse doorgang en twee buizen van 5,5 m boven het midden van elke brug; de betonnen aanbruggen op kolommen (BGT aan de Dordtse kant, geschat aan de Zwijndrechtse kant) met borstweringen, de landhoofden en de remmingwerken bij de pijlers (NAP +3,5 m). Bovenleiding, seinen, leuningen, loopbruggen, trappen en het bedieningsgebouw (BAG-pand 0505100000067669, blijft de PDOK-reconstructie) zijn weggelaten, de Stadsbrug Zwijndrecht ernaast is een eigen model. De export vult onder de dekken en de buizen op, de STL heeft een printvoet. Het maaiveld wordt op het water naast de brug bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(BRIDGES[1].xSE - BRIDGES[1].xNW).toFixed(1),
        deckWidthM: +(2 * DECK_HALF).toFixed(1),
        bridgeAxesFromCentreM: BRIDGES.map((b) => b.c),
        spansM: { river: +(PIER_MID - TRUSS_START).toFixed(1), second: BRIDGES.map((b) => +(b.trussEnd - PIER_MID).toFixed(1)), lift: +(LIFT.x1 - LIFT.x0).toFixed(1) },
        trussLinesFromCentreM: [-13.5, -4.4, 4.4, 13.5],
        trussTopNapM: +(12.9 + TRUSS_HEIGHT).toFixed(1),
        railNapM: { zwijndrecht: rail(BRIDGES[1].xNW), river: 12.9, lift: [rail(-25.9), rail(25.9)].map((z) => +z.toFixed(2)), dordrecht: +rail(BRIDGES[1].xSE).toFixed(2) },
        portalNapM: { legPeak: LEG.peak, crossbeamTop: CROSSBEAM.top, crossbeamBottom: CROSSBEAM.bottom, tubeTop: TUBE.z + TUBE.r },
        waterNapM: 0,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Spoorbrug_Dordrecht",
        "PDOK BGT overbruggingsdeel (dekken, pijlers, voeten van de poten, kolommen, landhoofden, dwarsbalken) en wegdeel (spoorbaan op het dek), EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor spoorstaaf, vakwerkliggers, poten, dwarsbalken, buizen, pijlerkoppen en remmingwerken",
        "PDOK luchtfoto (Actueel_orthoHR) voor vakken, voegen en remmingwerken",
        "Wikimedia Commons: Dordrecht Spoorbrug 2026-04-22-1.jpg, Dordrecht Spoorbrug 2026-04-22-2.jpg, Het Hemelbed - Flickr - LeonardoDaQuirm.jpg, Geheven spoorbrug in Dordrecht.jpg, Dordrecht Railway Bridge.jpg, Railway Bridge Dordrecht Netherlands.jpg, Symmetrie, Spoorbrug over de Oude Maas, Dordrecht (12171358784).jpg, Spoorbrug in Dordrecht gezien vanaf Veerplein in Zwijndrecht I.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

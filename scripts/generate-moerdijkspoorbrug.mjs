// Genereert een vereenvoudigd, gesloten 3D-model van de Moerdijkspoorbrug:
// de stalen vakwerkbrug van de spoorlijn Breda - Dordrecht over het
// Hollandsch Diep tussen Lage Zwaluwe/Moerdijk (zuid) en Willemsdorp (noord).
// De huidige bovenbouw (ir. C.L. Wisse, tussen 1953 en 1955 overspanning voor
// overspanning ingevaren op de pijlers van na de oorlog) heeft tien velden van
// circa 105 m met evenwijdige randen: vijf doorgaande liggers over twee velden
// elk, met schuine eindstijlen bij de voegen, plus een korte plaatbrug aan de
// noordkant. Er is geen beweegbaar deel. De HSL-brug (catalogusitem
// `brug-hollandsch-diep`) ligt circa 47 m stroomafwaarts en de A16-brug
// stroomopwaarts; beide zitten niet in dit model. Alle maten in het script
// zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, nodes
// met de materiaalklasse in de nodenaam: de constructie en het spoor met
// BGT-attributen) als catalogusbron voor de export en
// de kaart, plus een binaire STL in millimeters op 1:<schaal> met een
// printvoet onder het dek.
//
//   node scripts/generate-moerdijkspoorbrug.mjs              # STL op 1:3000 (standaard, 364 mm)
//   node scripts/generate-moerdijkspoorbrug.mjs --scale 5000
//
// Assenstelsel: oorsprong op de as van het BGT-dek in het hart van de vijfde
// rivierpijler vanaf het zuiden (de middelste pijler van de middelste ligger,
// RD 103685,11, 414729,80), op de waterspiegel van het Hollandsch Diep
// (NAP +0,2 m), Z omhoog. +X loopt langs de brug naar het noordnoordwesten
// (Willemsdorp; RD-richting 111,65 graden vanaf het oosten), +Y stroomafwaarts
// naar het westzuidwesten, naar de HSL-brug. Het zuidelijke landhoofd ligt op
// x = -530,1 tot -521,6, het noordelijke op x = 554,4 tot 561,6.
//
// Bronnen: BGT overbruggingsdeel (dek 13,1 m breed van x = -523,8 tot 556,9,
// tien pijlers van 6,9 × 15,5 m met ronde koppen, de twee landhoofden met de
// ronde voorkant van het zuidelijke); AHN DSM 0,5 m (PDOK WCS) voor de
// spoorhoogte (hellingen van 0,49 en 0,50 % met een top van NAP +11,85 m bij
// de middelste pijler), de twee vakwerklijnen (4,7 m naast de as), de
// bovenrand (11,36 m boven het spoor over de hele lengte, dus evenwijdige
// randen), de voegen om de 210 m met schuine eindstijlen, de dwarsverbanden om
// de 13 m (16 vakken per ligger) en de plaatbrug aan de noordkant (randen
// 1,55 m boven het spoor); Wikipedia (lengte 1040 m, tien overspanningen,
// langste 104 m, breedte 10,5 m, twee sporen, 1955); PDOK-terrein voor de
// waterspiegel (43,95 m ellipsoïdisch, NAP = ellipsoïdisch - 43,77 m op de
// oevers); Wikimedia Commons-foto's (Moerdijk spoorbrug 1990, 1990 1 tot 3,
// Moerdijk brug.jpg, IC-Direct op de Moerdijk.jpg, Sprinter op de Moerdijk.jpg,
// ICR op de Moerdijk.jpg, Moerdijk rail bridges.jpg) voor het W-vakwerk zonder
// stijlen, de schuine eindstijlen, de pijlers met opleggingen en de looppaden
// buiten de liggers. Geschat: de diepte van het dek (1,6 m onder het spoor),
// de staafbreedte (0,9 m), de dikte van de liggers (1,0 m), de hoogte van de
// pijlerkop (1,2 m onder het dek) en de maat van de oplegblokken.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "3000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "moerdijkspoorbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Band tussen twee functies van x (onder en boven), uitgetrokken langs Y.
function bandY(x0, x1, bottom, top, y0, y1, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    pts.push([x, bottom(x)]);
  }
  for (let i = steps; i >= 0; i--) {
    const x = x0 + ((x1 - x0) * i) / steps;
    pts.push([x, top(x)]);
  }
  return profileY(pts, y0, y1);
}
// Plattegrond (BGT, lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) =>
  prism([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1);
// Driehoek in het XZ-vlak, naar binnen verschoven over d (de halve breedte
// van de staven eromheen); null als er te weinig opening overblijft.
function insetTriangle(tri, d) {
  const polys = new CrossSection([ccw(tri)]).offset(-d, "Miter").toPolygons();
  if (polys.length !== 1 || polys[0].length < 3) return null;
  const pts = polys[0].map(([x, z]) => [x, z]);
  let area = 0;
  pts.forEach(([x0, z0], i) => {
    const [x1, z1] = pts[(i + 1) % pts.length];
    area += x0 * z1 - x1 * z0;
  });
  return Math.abs(area) / 2 >= 2.0 ? pts : null;
}
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
const minOf = (xs) => xs.reduce((a, b) => Math.min(a, b), Infinity);
const maxOf = (xs) => xs.reduce((a, b) => Math.max(a, b), -Infinity);

// ---------- hoofdmaten (boven de waterspiegel, NAP +0,2 m) ----------
// PDOK legt het Hollandsch Diep op 43,93 tot 44,0 m ellipsoïdisch; op de
// oevers ligt het PDOK-terrein 43,77 m boven het AHN (NAP), dus de
// waterspiegel ligt op circa NAP +0,2 m (zoals bij de HSL-brug ernaast).
const WATER_NAP = 0.2;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt het water op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten op het
// water, als vaste terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 43.93;

// Spoorhoogte in NAP (AHN, 30e percentiel over het dek per 10 m): twee
// rechte hellingen van +0,494 % en -0,500 % met een parabolische top van
// 205 m rond x = 5,1 (snijpunt NAP +12,10 m, top +11,85 m). Afwijking van het
// AHN: rms 0,011 m, hoogstens 0,03 m.
const RAIL = { g1: 0.00494, g2: -0.005, x0: 5.08, z0: 12.1, length: 205 };
function railNap(x) {
  const { g1, g2, x0, z0, length } = RAIL;
  const a = x0 - length / 2;
  if (x <= a) return z0 + g1 * (x - x0);
  if (x >= x0 + length / 2) return z0 + g2 * (x - x0);
  return z0 + g1 * (a - x0) + g1 * (x - a) + ((g2 - g1) * (x - a) ** 2) / (2 * length);
}
const railZ = (x) => Z(railNap(x));
// Dek (BGT): 13,1 m breed, met de looppaden buiten de liggers; de onderkant
// van de dwarsdragers ligt 1,6 m onder het spoor (geschat op foto's).
const DECK = { x0: -523.8, x1: 556.94, half: 6.53, depth: 1.6 };
const deckBottom = (x) => railZ(x) - DECK.depth;

// Pijlers (BGT, lokale coördinaten): tien pijlers van 6,9 × 15,5 m met ronde
// koppen. De voegen tussen de doorgaande liggers liggen op de 2e, 4e, 6e, 8e
// en 10e pijler, de tussensteunpunten op de 1e, 3e, 5e, 7e en 9e.
const PIERS = [
  [[-423.0, 0.47], [-423.15, -5.32], [-422.61, -6.16], [-421.87, -6.83], [-420.98, -7.27], [-420.0, -7.45], [-419.0, -7.37], [-418.07, -7.02], [-417.26, -6.44], [-416.63, -5.67], [-416.3, -4.95], [-416.21, 0.48], [-416.36, 6.01], [-416.91, 6.84], [-417.67, 7.48], [-418.58, 7.89], [-419.57, 8.03], [-420.55, 7.89], [-421.46, 7.48], [-422.22, 6.83], [-422.78, 6.0], [-422.87, 5.8]],
  [[-313.85, -7.41], [-312.92, -7.06], [-312.11, -6.47], [-311.49, -5.69], [-311.32, -5.35], [-311.11, 0.41], [-311.03, 5.43], [-311.5, 6.3], [-312.2, 7.02], [-313.06, 7.53], [-314.02, 7.78], [-315.02, 7.77], [-315.97, 7.5], [-316.83, 6.98], [-317.51, 6.25], [-317.81, 5.72], [-317.99, -5.35], [-317.46, -6.19], [-316.72, -6.86], [-315.82, -7.3], [-314.84, -7.49]],
  [[-213.22, 0.36], [-213.25, -5.45], [-212.76, -6.32], [-212.05, -7.02], [-211.17, -7.49], [-210.2, -7.7], [-209.2, -7.64], [-208.27, -7.3], [-207.46, -6.71], [-206.85, -5.92], [-206.58, -5.33], [-206.67, 0.37], [-206.58, 5.75], [-207.14, 6.57], [-207.91, 7.21], [-208.81, 7.62], [-209.8, 7.77], [-210.79, 7.65], [-211.71, 7.27], [-212.49, 6.65], [-213.08, 5.85], [-213.13, 5.74]],
  [[-107.91, 5.88], [-108.24, 0.49], [-108.09, -5.13], [-107.7, -6.05], [-107.07, -6.83], [-106.25, -7.39], [-105.3, -7.7], [-104.31, -7.73], [-103.34, -7.48], [-102.49, -6.97], [-101.81, -6.24], [-101.36, -5.31], [-101.3, 6.0], [-101.9, 6.8], [-102.69, 7.41], [-103.61, 7.79], [-104.6, 7.91], [-105.59, 7.77], [-106.51, 7.38], [-107.29, 6.76], [-107.87, 5.95]],
  [[-3.18, 5.95], [-3.42, -5.25], [-3.07, -6.18], [-2.48, -6.98], [-1.68, -7.57], [-0.74, -7.92], [0.25, -7.98], [1.22, -7.75], [2.09, -7.26], [2.77, -6.52], [3.23, -5.64], [3.37, -5.05], [3.25, 6.02], [2.6, 6.78], [1.78, 7.33], [0.84, 7.66], [-0.16, 7.74], [-1.14, 7.55], [-2.04, 7.12], [-2.79, 6.47]],
  [[108.17, -5.17], [108.19, 0.37], [108.04, 5.72], [107.45, 6.53], [106.67, 7.14], [105.74, 7.52], [104.75, 7.63], [103.77, 7.47], [102.87, 7.05], [102.11, 6.39], [101.56, 5.55], [101.43, 5.24], [101.34, 0.36], [101.44, -5.24], [101.81, -6.17], [102.44, -6.93], [103.26, -7.5], [104.21, -7.81], [105.2, -7.84], [106.16, -7.58], [107.01, -7.05], [107.68, -6.31], [108.1, -5.41]],
  [[212.98, -4.97], [213.0, 0.57], [212.85, 5.92], [212.26, 6.73], [211.48, 7.34], [210.55, 7.72], [209.56, 7.83], [208.58, 7.67], [207.68, 7.25], [206.92, 6.59], [206.38, 5.76], [206.24, 5.45], [206.16, 0.57], [206.25, -5.04], [206.62, -5.96], [207.25, -6.73], [208.07, -7.3], [209.02, -7.61], [210.01, -7.64], [210.97, -7.38], [211.82, -6.85], [212.49, -6.11], [212.91, -5.21]],
  [[318.22, -5.39], [318.25, 0.15], [318.1, 5.51], [317.51, 6.31], [316.72, 6.92], [315.8, 7.3], [314.81, 7.41], [313.82, 7.25], [312.92, 6.83], [312.17, 6.18], [311.62, 5.34], [311.49, 5.03], [311.4, 0.15], [311.49, -5.45], [311.87, -6.37], [312.49, -7.15], [313.31, -7.72], [314.26, -8.03], [315.26, -8.05], [316.22, -7.79], [317.07, -7.27], [317.73, -6.53], [318.16, -5.63]],
  [[423.67, -5.73], [423.7, -0.19], [423.55, 5.16], [422.96, 5.97], [422.18, 6.58], [421.25, 6.96], [420.26, 7.07], [419.28, 6.91], [418.38, 6.48], [417.62, 5.83], [417.07, 5.0], [416.94, 4.68], [416.85, -0.19], [416.95, -5.8], [417.32, -6.72], [417.95, -7.5], [418.77, -8.06], [419.71, -8.37], [420.71, -8.4], [421.67, -8.14], [422.52, -7.62], [423.19, -6.87], [423.61, -5.97]],
  [[521.87, 0.35], [521.96, -5.25], [522.34, -6.17], [522.96, -6.95], [523.78, -7.51], [524.73, -7.82], [525.73, -7.84], [526.69, -7.58], [527.54, -7.06], [528.2, -6.31], [528.63, -5.41], [528.69, -5.18], [528.72, 0.36], [528.57, 5.72], [527.98, 6.52], [527.19, 7.14], [526.27, 7.51], [525.28, 7.63], [524.29, 7.45], [523.39, 7.03], [522.64, 6.38], [522.09, 5.55], [521.96, 5.23]],
];
const centreX = (poly) => {
  let a = 0;
  let cx = 0;
  poly.forEach(([x0, y0], i) => {
    const [x1, y1] = poly[(i + 1) % poly.length];
    const c = x0 * y1 - x1 * y0;
    a += c;
    cx += (x0 + x1) * c;
  });
  return cx / (3 * a);
};
const PIER_X = PIERS.map(centreX);
// De pijlerkop ligt 1,2 m onder de onderkant van het dek; daarop staan
// oplegblokken van 1,6 × 1,4 m onder elke ligger (foto's).
const PIER_TOP_DROP = 1.2;
const BEARING = { length: 1.6, width: 1.4 };
// Landhoofden (BGT): het zuidelijke met een ronde voorkant (als een halve
// pijler) tot de pijlerkop en het blok erachter tot het spoor; het
// noordelijke als blok tot het spoor.
const SOUTH_FRONT = [
  [-524.3, -7.75], [-523.84, -7.73], [-523.5, -7.67], [-523.16, -7.55], [-522.84, -7.38], [-522.54, -7.16],
  [-522.27, -6.9], [-522.05, -6.6], [-521.87, -6.27], [-521.75, -5.94], [-521.68, -5.6], [-521.66, -5.27],
  [-521.6, 5.23], [-521.62, 5.56], [-521.69, 5.9], [-521.8, 6.23], [-521.97, 6.56], [-522.19, 6.86],
  [-522.46, 7.13], [-522.76, 7.35], [-523.08, 7.53], [-523.42, 7.65], [-523.74, 7.71], [-524.3, 7.72],
];
const SOUTH_BLOCK = [[-530.1, -6.44], [-524.2, -6.44], [-524.2, 6.4], [-530.1, 6.4]];
// Het noordelijke blok is in de BGT aan de voorkant 0,5 m smaller dan het dek;
// in het model loopt het over de volle breedte van het dek door.
const NORTH_BLOCK = [[554.44, -6.53], [561.62, -6.53], [561.62, 6.61], [554.44, 6.61]];

// Vakwerkliggers: vijf doorgaande liggers over twee velden, met tussen de
// liggers een voeg van 1,2 m boven de pijler. De eerste begint op de ronde
// voorkant van het zuidelijke landhoofd (AHN: de eindstijl begint op
// x = -523,6). Per ligger 16 vakken van circa 13 m (AHN: dwarsverbanden om de
// 13 m); de tussensteunpunten vallen op een onderknoop.
const JOINTS = [PIER_X[1], PIER_X[3], PIER_X[5], PIER_X[7], PIER_X[9]];
const GAP = 1.2;
const SOUTH_BEARING = -523.6;
const PANELS = 16;
const UNITS = JOINTS.map((xj, i) => [i === 0 ? SOUTH_BEARING : JOINTS[i - 1] + GAP / 2, xj - GAP / 2]);
// Twee vakwerklijnen van 1,0 m dik, 4,7 m naast de as (AHN); op 1:1000 een
// dichte plaat met de driehoeken met de punt omhoog als doorgaande opening
// en de driehoeken met een vlakke bovenkant als blinde nis van 0,35 m aan de
// buitenkant.
const NICHE = 0.35;
const TRUSS_Y = 4.7;
const TRUSS_T = 1.0;
const TRUSSES = [
  { y0: -TRUSS_Y - TRUSS_T / 2, y1: -TRUSS_Y + TRUSS_T / 2, niche: [-TRUSS_Y - TRUSS_T / 2, -TRUSS_Y - TRUSS_T / 2 + NICHE] },
  { y0: TRUSS_Y - TRUSS_T / 2, y1: TRUSS_Y + TRUSS_T / 2, niche: [TRUSS_Y + TRUSS_T / 2 - NICHE, TRUSS_Y + TRUSS_T / 2] },
];
// Staven: onderrand van de onderkant van het dek tot 0,6 m boven het spoor,
// bovenrand en diagonalen 0,9 m; de bovenkant van de bovenrand ligt overal
// 11,36 m boven het spoor (AHN: evenwijdige randen).
const BAR = 0.9;
const CHORD_TOP = 0.6;
const TRUSS_HEIGHT = 11.36;
const trussTop = (x) => railZ(x) + TRUSS_HEIGHT;
// Plaatbrug aan de noordkant (AHN): twee plaatliggers op de vakwerklijnen
// van de tiende pijler tot op het noordelijke landhoofd, met de bovenkant
// 1,55 m boven het spoor.
const PLATE = { x0: JOINTS[4] + GAP / 2, x1: 556.9, height: 1.55, half: 0.45 };

// ---------- dek, landhoofden, pijlers ----------
const deck = bandY(DECK.x0, DECK.x1, deckBottom, railZ, -DECK.half, DECK.half, Math.round((DECK.x1 - DECK.x0) / 2));
const pierTop = (x) => deckBottom(x) - PIER_TOP_DROP;
// Oplegblokken: onder elk liggereinde en elk tussensteunpunt, op beide
// vakwerklijnen; bij een voeg één blok onder beide liggereinden.
const bearingX = [
  ...PIER_X.map((x, i) => ({ x, length: i % 2 === 1 ? GAP + BEARING.length : BEARING.length })),
];
const bearings = bearingX.flatMap(({ x, length }) =>
  [-TRUSS_Y, TRUSS_Y].map((y) =>
    box(x - length / 2, x + length / 2, y - BEARING.width / 2, y + BEARING.width / 2, pierTop(x) - 0.1, deckBottom(x) + 0.1),
  ),
);
const southBearings = [-TRUSS_Y, TRUSS_Y].map((y) =>
  box(SOUTH_BEARING - 0.6, SOUTH_BEARING + 1.0, y - BEARING.width / 2, y + BEARING.width / 2, pierTop(SOUTH_BEARING) - 0.1, deckBottom(SOUTH_BEARING) + 0.1),
);
const piers = PIERS.map((poly, i) => prism(poly, BASE, pierTop(PIER_X[i])));
const abutments = [
  prism(SOUTH_FRONT, BASE, pierTop(SOUTH_BEARING)),
  prism(SOUTH_BLOCK, BASE, railZ(-524.2) - 0.01),
  prism(NORTH_BLOCK, BASE, railZ(554.44) - 0.01),
];

// ---------- vakwerkliggers ----------
// Per ligger: onderknopen op de vakgrenzen, bovenknopen midden daartussen
// (W-vakwerk zonder stijlen). De plaat loopt van de onderkant van het dek tot
// de bovenrand; bij de opleggingen zakt de bovenrand langs de schuine
// eindstijl naar 0,9 m boven het spoor.
const openingAngles = [];
let throughOpenings = 0;
let blindNiches = 0;
const girderSolids = UNITS.flatMap(([x0, x1]) => {
  const bottomX = Array.from({ length: PANELS + 1 }, (_, k) => x0 + ((x1 - x0) * k) / PANELS);
  const top = bottomX.slice(0, -1).map((x, i) => {
    const xm = (x + bottomX[i + 1]) / 2;
    return [xm, trussTop(xm)];
  });
  const steps = Math.round((x1 - x0) / 2);
  const outline = [
    ...Array.from({ length: steps + 1 }, (_, i) => {
      const x = x0 + ((x1 - x0) * i) / steps;
      return [x, deckBottom(x)];
    }),
    [x1, railZ(x1) + BAR],
    ...[...top].reverse(),
    [x0, railZ(x0) + BAR],
  ];
  // Hartlijnen: onderrand 0,15 m boven het spoor, bovenrand 0,45 m onder de
  // bovenkant; de opening ligt een halve staafbreedte binnen de hartlijnen.
  const zb = (x) => railZ(x) + CHORD_TOP - BAR / 2;
  const holes = [];
  const niches = [];
  for (let i = 0; i < top.length; i++) {
    const tri = [
      [bottomX[i], zb(bottomX[i])],
      [bottomX[i + 1], zb(bottomX[i + 1])],
      [top[i][0], top[i][1] - BAR / 2],
    ];
    const hole = insetTriangle(tri, BAR / 2);
    if (hole) {
      holes.push(hole);
      // Helling van de flanken van de opening (moet minstens 50 graden zijn).
      const apex = hole.reduce((p, q) => (q[1] > p[1] ? q : p));
      for (const q of hole) {
        if (q === apex) continue;
        openingAngles.push((Math.atan2(apex[1] - q[1], Math.abs(apex[0] - q[0])) * 180) / Math.PI);
      }
    }
    if (i > 0) {
      const inv = [
        [top[i - 1][0], top[i - 1][1] - BAR / 2],
        [bottomX[i], zb(bottomX[i])],
        [top[i][0], top[i][1] - BAR / 2],
      ];
      const niche = insetTriangle(inv, BAR / 2);
      if (niche) niches.push(niche);
    }
  }
  throughOpenings += holes.length;
  blindNiches += niches.length;
  return TRUSSES.map(({ y0, y1, niche }) => {
    const plate = profileY(outline, y0, y1);
    const cut = [
      ...holes.map((h) => profileY(h, y0 - 0.3, y1 + 0.3)),
      ...niches.map((h) => (niche[0] === y0 ? profileY(h, y0 - 0.3, niche[1]) : profileY(h, niche[0], y1 + 0.3))),
    ];
    return plate.subtract(union(cut));
  });
});
const plateGirders = [-TRUSS_Y, TRUSS_Y].map((y) =>
  bandY(PLATE.x0, PLATE.x1, deckBottom, (x) => railZ(x) + PLATE.height, y - PLATE.half, y + PLATE.half, 8),
);

const bridge = union([deck, ...abutments, ...piers, ...bearings, ...southBearings, ...girderSolids, ...plateGirders]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden die uitloopt in een
// scherm tot de onderplaat (minstens 0,9 m, op grove schaal 1 mm breed).
const KNEE = (50 * Math.PI) / 180;
const SCREEN = Math.max(0.45, (0.5 * scale) / 1000);
const FOOT = { x0: DECK.x0 - 0.05, x1: 554.5 };
const footSteps = Math.round((FOOT.x1 - FOOT.x0) / 2);
const footStations = Array.from({ length: footSteps + 1 }, (_, i) => {
  const x = FOOT.x0 + ((FOOT.x1 - FOOT.x0) * i) / footSteps;
  const zb = deckBottom(x) + 0.02;
  const w = DECK.half + 0.02;
  const s = Math.min(SCREEN, w - 0.05);
  const zs = zb - Math.tan(KNEE) * (w - s);
  const section =
    zs > BASE + 0.05
      ? [[-s, BASE], [s, BASE], [s, zs], [w, zb], [-w, zb], [-s, zs]]
      : (() => {
          const a = w - (zb - BASE) / Math.tan(KNEE);
          return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
        })();
  return { x, section };
});
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van het dek, de randen van het dek naast de
// pijlerkoppen en de plafonds van de blinde nissen (0,35 m diep), in de
// printversie alleen die nissen.
const inNiche = (y) => TRUSSES.some(({ niche }) => y > niche[0] - 1e-3 && y < niche[1] + 1e-3);
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  let deckArea = 0;
  let nicheArea = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (maxOf(p.map((q) => q[2])) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const yMid = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    if (Math.abs(zMid - deckBottom(xMid)) < 0.1) deckArea += len / 2;
    else if (inNiche(yMid) && zMid > railZ(xMid) + CHORD_TOP) nicheArea += len / 2;
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
{
  const model = overhangs(bridge);
  console.log("vrij hangend (m2): dek", Math.round(model.deckArea), "nissen", Math.round(model.nicheArea), "overig", +model.area.toFixed(2));
  if (model.area > 0.5) throw new Error("overhang buiten dek en nissen");
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2): dek", +print.deckArea.toFixed(2), "overig", +print.area.toFixed(2));
  if (print.deckArea + print.area > 0.5) throw new Error("printversie heeft overhang");
  const minAngle = minOf(openingAngles);
  console.log("doorgaande openingen", throughOpenings, "blinde nissen", blindNiches, "steilste flank min (graden)", +minAngle.toFixed(1));
  if (minAngle < 50) throw new Error("opening met een te vlakke flank");
}

// ---------- spoor als eigen onderdeel ----------
// De bovenste 0,5 m van het dek onder de twee sporen is een eigen node met de
// attributen van het BGT-wegdeel (glTF `extras.attributes`), zodat de
// kleurregels van een thema (bijvoorbeeld spoor zwart) op het brugdek werken
// zoals op de PDOK-wegdelen ernaast. Op het dek liggen twee actuele
// BGT-wegdelen met relatieve hoogteligging 1, één per spoor, van het
// zuidelijke tot het noordelijke landhoofd: L0004.70844bdc... (westelijk
// spoor, y = 0,8 tot 3,5) en L0004.b14fb6f3... (oostelijk spoor, y = -3,3 tot
// -0,5), beide spoorbaan, gesloten verharding, zonder plus-fysiek voorkomen.
// Contouren in lokale coördinaten, vereenvoudigd tot 5 cm (Douglas-Peucker).
// Wat tussen en naast de sporen ligt, blijft constructie. Wordt pas hier
// gebouwd, nadat het printmodel is doorgerekend, zodat de STL gelijk blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
const TRACKS = [
  // L0004.70844bdc51de446aa0946f76ac7cc571: westelijk spoor.
  [[-525.03, 0.8], [370.39, 0.8], [557.35, 0.89], [557.34, 3.49], [545.59, 3.52], [370.39, 3.4], [-525.01, 3.4]],
  // L0004.b14fb6f3bb61412586ec37fd05b4faed: oostelijk spoor.
  [[-525.05, -3.28], [302.4, -3.23], [401.88, -3.13], [557.35, -3.17], [557.35, -0.57], [401.87, -0.53],
    [302.4, -0.63], [-525.03, -0.67]],
];
// De strook ligt tussen de binnenkanten van de vakwerkplaten, met 2 cm vrij
// (ook waar de plaat openingen heeft, en over de plaatliggers en de voegen
// heen), over dezelfde loftstations als het dek van 0,5 m onder tot 1 m boven
// het spoor. Aan de zuidkant begint hij 0,2 m voor het dek (in de opening
// voor het landhoofdblok), aan de noordkant loopt hij 0,5 m over het
// landhoofd door, zodat hij geen vlak met de kopse kanten deelt.
const GUARD = 0.02;
const deckSteps = Math.round((DECK.x1 - DECK.x0) / 2);
const layerXs = [
  DECK.x0 - 0.2,
  ...Array.from({ length: deckSteps + 1 }, (_, i) => DECK.x0 + ((DECK.x1 - DECK.x0) * i) / deckSteps),
  DECK.x1 + 0.5,
];
const [bedY0, bedY1] = [TRUSSES[0].y1 + GUARD, TRUSSES[1].y0 - GUARD];
const trackStrip = loftX(
  layerXs.map((x) => {
    const zt = railZ(x);
    return { x, section: [[bedY0, zt - LAYER], [bedY1, zt - LAYER], [bedY1, zt + ABOVE], [bedY0, zt + ABOVE]] };
  }),
).intersect(union(TRACKS.map((poly) => prism(poly, BASE, 100))));
const track = trackStrip.intersect(bridge);
const structure = bridge.subtract(trackStrip);
const parts = [
  ["building:moerdijkspoorbrug", structure],
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
report.trusses = {
  units: UNITS.map(([a, b]) => ({ x: [+a.toFixed(2), +b.toFixed(2)], lengthM: +(b - a).toFixed(2), panelM: +((b - a) / PANELS).toFixed(2) })),
  piersX: PIER_X.map((x) => +x.toFixed(2)),
  spansM: [SOUTH_BEARING, ...PIER_X].slice(1).map((x, i) => +(x - [SOUTH_BEARING, ...PIER_X][i]).toFixed(2)),
  throughOpenings,
  blindNiches,
  minFlankDeg: +minOf(openingAngles).toFixed(1),
  railNap: { south: +railNap(DECK.x0).toFixed(2), crest: +railNap(RAIL.x0).toFixed(2), north: +railNap(DECK.x1).toFixed(2) },
  topNap: { south: +(railNap(UNITS[0][0]) + TRUSS_HEIGHT).toFixed(2), crest: +(railNap(RAIL.x0) + TRUSS_HEIGHT).toFixed(2) },
};
const glbFile = path.join(outDir, "moerdijkspoorbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-moerdijkspoorbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `moerdijkspoorbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Moerdijkspoorbrug 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  screenM: +(2 * SCREEN).toFixed(2),
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Op het water midden in het 2e, 4e, 6e, 8e en 10e veld, 20 m naast de as
// (aan de westkant 27 m van de HSL-brug).
const SAMPLE_X = [-367, -157.3, 52.4, 262.2, 472.8];
const samplePoints = SAMPLE_X.flatMap((x) => [
  [x, 20],
  [x, -20],
]);
await writeFile(
  path.join(outDir, "moerdijkspoorbrug.json"),
  JSON.stringify(
    {
      name: "Moerdijkspoorbrug",
      file: "moerdijkspoorbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [103685.11, 414729.8],
      xAxis: [-0.36896, 0.92945],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      // Op het water van het Hollandsch Diep midden in vijf velden.
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "L0004.602e82ad47f54c0b94e5e71df8612b78",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van de spoorbrug in het hart van de vijfde rivierpijler vanaf het zuiden op de waterspiegel van het Hollandsch Diep (z = 0, NAP +0,2 m) in de oorsprong, +X langs de brug naar het noordnoordwesten (Willemsdorp, RD-richting 111,65 graden vanaf het oosten) en +Y stroomafwaarts naar het westzuidwesten (de HSL-brug). Twee nodes: road:spoor, de bovenste 0,5 m van het dek onder de twee sporen (de twee BGT-wegdelen spoorbaan op het dek, elk 2,6 tot 2,7 m breed, tussen y = -3,3 en +3,5) met de attributen van het BGT-wegdeel in extras.attributes (bgt_functie spoorbaan, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het dek van 13,1 m breed van het zuidelijke landhoofd (x = -523,8) tot het noordelijke (x = 556,9) met het spoor op NAP +9,4 m, +11,85 m bij de middelste pijler en +9,3 m (AHN); vijf doorgaande vakwerkliggers over twee velden (208 tot 209 m, 16 vakken van 13 m) op twee vakwerklijnen 4,7 m naast de as, als dichte platen van 1,0 m met doorgaande driehoekige openingen met de punt omhoog en blinde nissen voor de driehoeken met een vlakke bovenkant, met evenwijdige randen 11,36 m boven het spoor en schuine eindstijlen bij de voegen op de 2e, 4e, 6e, 8e en 10e pijler; tien pijlers van 6,9 × 15,5 m met ronde koppen (BGT) met oplegblokken onder de liggers; een plaatbrug van 31 m aan de noordkant (randen 1,55 m boven het spoor); de landhoofden, het zuidelijke met een ronde voorkant. Windverbanden, portalen, bovenleiding, leuningen, bordessen en trappen bij de pijlers zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast vijf velden bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(DECK.x1 - DECK.x0).toFixed(1),
        deckWidthM: 2 * DECK.half,
        spansM: report.trusses.spansM,
        trussUnitsM: report.trusses.units.map(({ lengthM }) => lengthM),
        panelsPerUnit: PANELS,
        trussLinesFromAxisM: TRUSS_Y,
        trussHeightAboveRailM: TRUSS_HEIGHT,
        plateGirderSpanM: +(PLATE.x1 - PLATE.x0).toFixed(1),
        railNapM: report.trusses.railNap,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Moerdijkspoorbrug",
        "PDOK BGT overbruggingsdeel (dek, pijlers, landhoofden), EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor het spoorniveau, de vakwerklijnen, hun bovenrand, de voegen en de plaatbrug; PDOK-terrein voor de waterspiegel",
        "Wikimedia Commons: Moerdijk spoorbrug 1990.jpg, Moerdijk spoorbrug 1990 1.jpg, Moerdijk spoorbrug 1990 2.jpg, Moerdijk spoorbrug 1990 3.jpg, Moerdijk brug.jpg, IC-Direct op de Moerdijk.jpg, Sprinter op de Moerdijk.jpg, ICR op de Moerdijk.jpg, Moerdijk rail bridges.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

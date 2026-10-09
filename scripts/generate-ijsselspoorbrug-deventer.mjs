// Genereert een vereenvoudigd, gesloten 3D-model van de IJsselspoorbrug bij
// Deventer: de dubbelsporige spoorbrug van de lijn Apeldoorn - Deventer over
// de IJssel (1979-1982, geopend op 7 mei 1982, op de fundamenten van de brug
// van 1887), met een fietspad aan de zuidkant en een voetpad aan de
// noordkant. Over het zomerbed ligt één stalen vakwerkbrug van 95,9 m
// (Warrenligger met negen gelijke vakken, alleen diagonalen, evenwijdige
// randen en schuine eindstijlen) op twee rivierpijlers met spitse koppen;
// aan de westkant een betonnen aanbrug als kokerligger over de uiterwaard en
// de nevengeul op negen pijlers (vier op brede achthoekige poeren in de
// nevengeul), een kort veld over de weg langs de dijk en het westelijke
// landhoofd op de dijk; aan de oostkant één betonnen veld over de IJsselkade
// naar het oostelijke landhoofd. Bij de pijler op x = -118,5 daalt een trap
// van het voetpad naar de uiterwaard af. Alle maten in het script zijn meters
// op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node per
// onderdeel met de materiaalklasse in de nodenaam) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal> met
// een printvoet onder de dekken. De brug is 519 m lang en past op 1:1000 niet
// in 400 mm, vandaar standaard 1:1500 (346 mm).
//
//   node scripts/generate-ijsselspoorbrug-deventer.mjs              # 1:1500 (standaard)
//   node scripts/generate-ijsselspoorbrug-deventer.mjs --scale 1000
//
// Assenstelsel: oorsprong op de spooras (midden tussen de twee
// BGT-spoorhartlijnen) midden tussen de harten van de twee rivierpijlers
// (RD 206809,90, 474439,11), Z omhoog, z = NAP-hoogte min de waterspiegel van
// de nevengeul zoals het PDOK-terrein die legt (46,22 m ellipsoïdisch, NAP
// +2,98 m; het PDOK-terrein ligt hier 43,24 m boven het AHN). +X loopt langs
// de brug naar het noordoosten (Deventer, RD-richting 48,60 graden vanaf het
// oosten, langs de spoorhartlijnen), +Y naar het noordwesten (stroomafwaarts,
// de kant van het voetpad); het fietspad ligt aan de zuidoostkant (y < 0).
// Het westelijke landhoofd ligt op x = -416,89 tot -404,61, de rivierpijlers
// op x = -47,93 en 47,93, het oostelijke landhoofd op x = 89,3 tot 102,13.
//
// Bronnen: BGT overbruggingsdeel (dekrand L0004.0de47900..., de twee
// landhoofden, de rivierpijlers L0002.1c7ba8f5... en L0002.8561a905..., de
// drie wandpijlers L0002.f7202111... en L0002.a1d84823... op de uiterwaard en
// de vier achthoekige poeren in de nevengeul L0002.58783fcb..., 62702993...,
// 080f50ee... met 11c1a660... en 63b73415...), BGT wegdeel (spoorbaan,
// fietspad, voetpad en voetpad op trap, ook voor de attributen) en BGT spoor
// (de twee hartlijnen, as van het model); AHN DSM en DTM 0,5 m (PDOK WCS)
// voor het lengteprofiel van het dek (NAP +12,6 m op het westelijke
// landhoofd, +14,9 m bij de westelijke rivierpijler, +15,0 m over het vakwerk
// en +14,8 m op het oostelijke landhoofd), de vakwerklijnen (4,7 m ten
// zuidoosten en 5,0 m ten noordwesten van de as), de bovenrand van het
// vakwerk (NAP +24,3 m), de einden van de bovenrand (5,3 m binnen de
// opleggingen), de schampkanten tussen spoor en paden (0,8 tot 0,9 m boven het
// dek) en de trap; PDOK-terrein voor de waterspiegel van de IJssel (46,35 m)
// en de nevengeul (46,22 m); PDOK-luchtfoto (het vakwerk met de schaduw, het
// windverband, de poeren in de nevengeul, de trap, de voegen); Wikipedia
// (vakwerkbrug, overspanning 95,7 m, lengte circa 500 m, dubbelsporig,
// fietspad van 3 m aan de zuidkant en voetpad van 2 m aan de noordkant, de
// aanbrug van circa 300 m over de uiterwaard); Wikimedia Commons-foto's
// (IJsselspoorbrug Deventer, 2011.jpg, IJsselspoorbrug Deventer.JPG,
// IJsselspoorbrug - Deventer.jpg, Spoorbrug rail bridge Deventer 2019.jpg en
// 2019 2/3, Railway bridge across the IJssel river at Deventer from the
// Northside - panoramio.jpg, Hoogwater Deventer december 2023 03 en 04.jpg,
// Deventer brug over de IJssel (50143597592).jpg, Spoorviaduct Deventer
// 2024.jpg, Spoorbrug rail bridge Deventer train 2019 1.jpg en VIRM train
// 2019.jpg, Deventer - Ijssel - morning with mist ... drone ... 20.jpeg) voor
// het vakwerkpatroon (negen vakken, diagonalen zonder stijlen), de dekken, de
// wandpijlers met kop, de poeren en de trap.
// Geschat: de dekdiktes (vakwerkdek 1,6 m met randen van 0,8 m, westelijke
// aanbrug 3,6 m, het veld over de weg en het oostelijke veld 2,6 m, uit
// foto's), de pijlers op x = -347,45 en -385,6 (niet in de BGT, op de steek
// van 38,2 m en bij de voeg in het dek), de vorm van de wandpijlers op de
// poeren en op die twee plaatsen (als de gemeten wandpijlers, 3,7 × 11,6 m),
// de koppen van de pijlers (1,0 m, 0,35 m breder), de bovenkant van de poeren
// (NAP +4,3 m), de bovenkant van de rivierpijlers (2,4 m onder het dek met
// opleggingen), de breedte van de staven (1,0 m) en de onderrand (0,9 m boven
// het dek), en de trap als dicht blok met zes treden tot NAP +9,5 m.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "ijsselspoorbrug-deventer");
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
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const rect = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const box = (x0, x1, y0, y1, z0, z1) => prism(rect(x0, x1, y0, y1), z0, z1);
// Polygoon(en) verschoven over d als CrossSection.
const grow = (polys, d) => new CrossSection(polys.map(ccw)).offset(d, "Miter", 2);
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
  return Math.abs(area) / 2 >= 1.0 ? pts : null;
}
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
const interp = (table, x) => {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 0; i + 1 < table.length; i++) {
    const [x0, v0] = table[i];
    const [x1, v1] = table[i + 1];
    if (x <= x1) return v0 + ((v1 - v0) * (x - x0)) / (x1 - x0);
  }
  return table[table.length - 1][1];
};

// ---------- hoogtes ----------
// Het PDOK-terrein legt de nevengeul op 46,22 m en de IJssel op 46,35 m
// ellipsoïdisch; op de uiterwaard en de kade ligt het 43,24 m boven het AHN
// (NAP). Het water van het model (z = 0) ligt dus op NAP +2,98 m.
const WATER_NAP = 2.98;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder het water
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 46.22;

// Bovenkant van het dek (de dwarsliggers en de paden) in NAP: mediaan van het
// AHN-DSM tussen de sporen per 6 m, lineair tussen de knikpunten; over het
// vakwerk de hoogte van de paden.
const DECK_NAP = [
  [-416.89, 12.6],
  [-389.2, 12.78],
  [-339.2, 13.04],
  [-289.2, 13.4],
  [-239.2, 13.75],
  [-189.2, 14.09],
  [-139.2, 14.43],
  [-99.2, 14.62],
  [-59.2, 14.86],
  [-47.93, 14.92],
  [-30, 15.0],
  [30, 15.0],
  [47.93, 14.92],
  [60, 14.87],
  [80.8, 14.8],
  [102.13, 14.82],
];
const deckZ = (x) => Z(interp(DECK_NAP, x));

// ---------- indeling langs de brug ----------
const X_W_END = -416.89; // achterkant westelijk landhoofd (BGT)
const X_W_FACE = -404.61; // voorkant westelijk landhoofd (BGT)
const X_JOINT = -385.6; // voeg en pijler aan het einde van het veld over de weg (luchtfoto)
const X_TW = -47.93; // hart westelijke rivierpijler: oplegging vakwerk
const X_TE = 47.93; // hart oostelijke rivierpijler
const X_E_FACE = 89.3; // voorkant oostelijk landhoofd (BGT)
const X_E_END = 102.13; // achterkant oostelijk landhoofd (BGT)
// Dekken: kokerligger (dekplaat 1,0 m, koker eronder 8 tot 10 m breed) of het
// vakwerkdek (plaat van 0,8 m met dwarsdragers tot 1,6 m tussen de liggers).
const SEGMENTS = [
  { label: "westelijk landhoofd", x0: X_W_END, x1: X_W_FACE, kind: "abutment" },
  { label: "veld over de weg", x0: X_W_FACE, x1: X_JOINT, kind: "box", depth: 2.6 },
  { label: "westelijke aanbrug", x0: X_JOINT, x1: X_TW, kind: "box", depth: 3.6 },
  { label: "vakwerkbrug", x0: X_TW, x1: X_TE, kind: "truss", depth: 1.6 },
  { label: "oostelijk veld", x0: X_TE, x1: X_E_FACE, kind: "box", depth: 2.6 },
  { label: "oostelijk landhoofd", x0: X_E_FACE, x1: X_E_END, kind: "abutment" },
];
const SLAB = { box: 1.0, truss: 0.8 };
const BOX = { c: 0.15, bottomHalf: 4.0, topHalf: 5.0 };
const segmentAt = (x) => SEGMENTS.find((s) => x >= s.x0 - 1e-9 && x <= s.x1 + 1e-9);

// Dekranden (BGT overbruggingsdeel), oostrand (y < 0) en westrand (y > 0):
// boven het vakwerk 1,3 m breder, met een overgang op de aangrenzende velden.
const EAST_EDGE = [
  [-416.48, -8.0], [-385.25, -8.05], [-176.87, -7.54], [-123.85, -7.69], [-62.23, -7.68], [-47.75, -9.0],
  [47.9, -8.98], [61.69, -7.61], [102.13, -7.7],
];
const WEST_EDGE = [
  [-416.89, 7.84], [-385.6, 7.7], [-194.62, 7.8], [-145.75, 7.96], [-55.55, 7.93], [-47.82, 8.72], [47.94, 8.83],
  [57.85, 7.92], [102.13, 8.06],
];
// Binnenranden van fietspad en voetpad (BGT wegdeel): de schampkanten tussen
// spoor en paden liggen hier tegenaan.
const BIKE_INNER = [
  [-416.56, -4.72], [-385.85, -4.81], [-61.93, -4.67], [-49.41, -5.91], [48.07, -5.88], [48.81, -5.72],
  [55.22, -4.98], [61.53, -4.38], [89.0, -4.27], [93.0, -4.6], [102.13, -4.69],
];
const FOOT_INNER = [
  [-416.83, 5.48], [-404.64, 5.44], [-384.86, 5.71], [-151.13, 5.8], [-56.91, 5.84], [-48.53, 6.67], [47.95, 6.63],
  [56.81, 5.85], [89.0, 5.89], [90.0, 5.68], [102.13, 5.68],
];
const eE = (x) => interp(EAST_EDGE, x);
const eW = (x) => interp(WEST_EDGE, x);
const fI = (x) => interp(BIKE_INNER, x);
const vI = (x) => interp(FOOT_INNER, x);

// Stations langs X: om de 2 m plus alle knikpunten van de tabellen.
const KNOTS = [DECK_NAP, EAST_EDGE, WEST_EDGE, BIKE_INNER, FOOT_INNER].flatMap((t) => t.map(([x]) => x));
function stations(x0, x1, step = 2) {
  const set = new Set([x0, x1]);
  for (let x = Math.ceil(x0 / step) * step; x < x1; x += step) set.add(+x.toFixed(3));
  for (const k of KNOTS) if (k > x0 + 0.05 && k < x1 - 0.05) set.add(k);
  return [...set].filter((x) => x >= x0 && x <= x1).sort((a, b) => a - b).filter((x, i, a) => i === 0 || x - a[i - 1] > 0.02);
}

// ---------- dekken en landhoofden ----------
const deckParts = [];
for (const s of SEGMENTS) {
  const xs = stations(s.x0 - 0.01, s.x1 + 0.01);
  if (s.kind === "abutment") {
    // Massief landhoofd onder het dek (BGT), vanaf de onderkant.
    deckParts.push(loftX(xs.map((x) => ({ x, section: [[eE(x), BASE], [eW(x), BASE], [eW(x), deckZ(x)], [eE(x), deckZ(x)]] }))));
    continue;
  }
  const slab = SLAB[s.kind === "truss" ? "truss" : "box"];
  deckParts.push(
    loftX(xs.map((x) => ({ x, section: [[eE(x), deckZ(x) - slab], [eW(x), deckZ(x) - slab], [eW(x), deckZ(x)], [eE(x), deckZ(x)]] }))),
  );
  if (s.kind === "truss") {
    // Dwarsdragers en langsliggers tussen de vakwerken.
    deckParts.push(
      loftX(xs.map((x) => ({ x, section: [[-5.2, deckZ(x) - s.depth], [5.5, deckZ(x) - s.depth], [5.5, deckZ(x) - slab + 0.05], [-5.2, deckZ(x) - slab + 0.05]] }))),
    );
  } else {
    deckParts.push(
      loftX(
        xs.map((x) => ({
          x,
          section: [
            [BOX.c - BOX.bottomHalf, deckZ(x) - s.depth],
            [BOX.c + BOX.bottomHalf, deckZ(x) - s.depth],
            [BOX.c + BOX.topHalf, deckZ(x) - slab + 0.05],
            [BOX.c - BOX.topHalf, deckZ(x) - slab + 0.05],
          ],
        })),
      ),
    );
  }
}
const deckDepth = (x) => {
  const s = segmentAt(x);
  return s.kind === "abutment" ? deckZ(x) - BASE : s.depth;
};
// Dikte van de dekrand op een veld (op een landhoofd-grens die van het veld).
const edgeDepth = (x) => {
  const s = SEGMENTS.find((g) => g.kind !== "abutment" && x >= g.x0 - 1e-9 && x <= g.x1 + 1e-9);
  return SLAB[s.kind === "truss" ? "truss" : "box"];
};

// ---------- schampkanten en randbalken ----------
// Schampkanten tussen spoor en paden: 0,9 m breed en 0,9 m boven het dek
// (AHN), tegen de binnenrand van het pad; over het vakwerk tot tegen de
// ligger. Randbalken aan de buitenranden 0,6 m breed en 0,5 m hoog in plaats
// van de leuningen (open hekwerk).
const KERB = { width: 0.9, above: 0.9 };
const RIM = { width: 0.6, above: 0.5 };
// Trap op x = -121,29 tot -117,05 (BGT voetpad op trap): daar geen randbalk.
const STAIR = { x0: -121.29, x1: -117.05, y0: 7.94, y1: 18.35, bottomNap: 9.5, treads: 6 };
const inTruss = (x) => x > X_TW - 1e-6 && x < X_TE + 1e-6;
// Strook langs het dek tussen y0(x) en y1(x), van 0,6 m onder het dek tot
// `above` erboven, rondom `margin` groter.
function band(x0, x1, y0, y1, above, margin = 0) {
  return loftX(
    stations(x0, x1).map((x) => ({
      x,
      section: [
        [y0(x) - margin, deckZ(x) - 0.6 - margin],
        [y1(x) + margin, deckZ(x) - 0.6 - margin],
        [y1(x) + margin, deckZ(x) + above + margin],
        [y0(x) - margin, deckZ(x) + above + margin],
      ],
    })),
  );
}
const TRUSS_FACE = { east: -5.2, west: 5.5 };
const KERBS = [
  // fietspadkant
  [X_W_END, X_TW, fI, (x) => fI(x) + KERB.width, KERB.above],
  [X_TW, X_TE, fI, () => TRUSS_FACE.east + 0.05, KERB.above],
  [X_TE, X_E_END, fI, (x) => fI(x) + KERB.width, KERB.above],
  // voetpadkant
  [X_W_END, X_TW, (x) => vI(x) - KERB.width, vI, KERB.above],
  [X_TW, X_TE, () => TRUSS_FACE.west - 0.05, vI, KERB.above],
  [X_TE, X_E_END, (x) => vI(x) - KERB.width, vI, KERB.above],
  // randbalken
  [X_W_END, X_E_END, eE, (x) => eE(x) + RIM.width, RIM.above],
  [X_W_END, STAIR.x0, (x) => eW(x) - RIM.width, eW, RIM.above],
  [STAIR.x1, X_E_END, (x) => eW(x) - RIM.width, eW, RIM.above],
];
const kerbs = KERBS.map(([x0, x1, y0, y1, above]) => band(x0, x1, y0, y1, above));

// ---------- vakwerkbrug ----------
// Twee vakwerklijnen van 1,0 m dik (AHN: harten 4,7 m ten zuidoosten en
// 5,0 m ten noordwesten van de as). Warrenligger met negen vakken van 10,65 m
// tussen de opleggingen op de pijlerharten, alleen diagonalen (foto's), de
// eindstijlen schuin van de oplegging naar de eerste bovenknoop een half vak
// verder (AHN: de bovenrand begint 5,3 m binnen de oplegging); bovenrand op
// NAP +24,3 m (AHN), onderrand tot 0,9 m boven het dek. Op 1:1000 is het
// vakwerk een dichte plaat: de driehoeken met de punt omhoog zijn doorgaande
// openingen (flanken van 57,6 graden), de driehoeken met een vlakke
// bovenkant blinde nissen van 0,35 m aan de buitenkant.
const TRUSS_LINES = [
  { y0: TRUSS_FACE.east, y1: TRUSS_FACE.east + 1.0, niche: [TRUSS_FACE.east - 0.3, TRUSS_FACE.east + 0.35] },
  { y0: TRUSS_FACE.west - 1.0, y1: TRUSS_FACE.west, niche: [TRUSS_FACE.west - 0.35, TRUSS_FACE.west + 0.3] },
];
const PANELS = 9;
const PANEL = (X_TE - X_TW) / PANELS;
const TRUSS_TOP = Z(24.3);
const BAR = 1.0;
const CHORD_TOP = 0.9; // bovenkant onderrand boven het dek
const openingAngles = [];
let throughOpenings = 0;
let blindNiches = 0;
const trussSolids = (() => {
  const [x0, x1] = [X_TW, X_TE];
  const bottomX = Array.from({ length: PANELS + 1 }, (_, k) => x0 + k * PANEL);
  const topX = Array.from({ length: PANELS }, (_, k) => x0 + (k + 0.5) * PANEL);
  const zb = (x) => deckZ(x) + CHORD_TOP - BAR / 2; // hartlijn onderrand
  const zt = TRUSS_TOP - BAR / 2; // hartlijn bovenrand
  // Buitenkant van de eindstijl: de hartlijn van oplegging naar eerste of
  // laatste bovenknoop, een halve staafbreedte naar buiten.
  function endPost(xb, xt) {
    const dx = xt - xb;
    const dz = zt - zb(xb);
    const len = Math.hypot(dx, dz);
    const d = [dx / len, dz / len];
    const n = [-d[1] * Math.sign(dx), Math.abs(d[0])];
    const ox = xb + n[0] * (BAR / 2);
    const oz = zb(xb) + n[1] * (BAR / 2);
    const sBottom = (xb - ox) / d[0];
    const sTop = (TRUSS_TOP - oz) / d[1];
    return { bottom: [xb, oz + d[1] * sBottom], top: [ox + d[0] * sTop, TRUSS_TOP] };
  }
  const left = endPost(x0, topX[0]);
  const right = endPost(x1, topX[PANELS - 1]);
  const bottomEdge = stations(x0, x1).filter((x) => x > x0 + 1e-6 && x < x1 - 1e-6).map((x) => [x, deckZ(x) - 1.6 + 0.05]);
  const outline = [
    [x0, deckZ(x0) - 1.6 + 0.05],
    ...bottomEdge,
    [x1, deckZ(x1) - 1.6 + 0.05],
    right.bottom,
    right.top,
    left.top,
    left.bottom,
  ];
  const holes = [];
  const niches = [];
  for (let k = 0; k < PANELS; k++) {
    // Opening onder bovenknoop k, tussen de twee diagonalen die daar samenkomen.
    const hole = insetTriangle([[bottomX[k], zb(bottomX[k])], [bottomX[k + 1], zb(bottomX[k + 1])], [topX[k], zt]], BAR / 2);
    if (hole) {
      holes.push(hole);
      const apex = hole.reduce((a, q) => (q[1] > a[1] ? q : a));
      for (const q of hole) {
        if (q === apex) continue;
        const run = Math.abs(apex[0] - q[0]);
        if (run < 1e-6) continue;
        openingAngles.push((Math.atan2(apex[1] - q[1], run) * 180) / Math.PI);
      }
    }
    if (k > 0) {
      const niche = insetTriangle([[topX[k - 1], zt], [bottomX[k], zb(bottomX[k])], [topX[k], zt]], BAR / 2);
      if (niche) niches.push(niche);
    }
  }
  throughOpenings = holes.length * TRUSS_LINES.length;
  blindNiches = niches.length * TRUSS_LINES.length;
  return TRUSS_LINES.map(({ y0, y1, niche }) => {
    const plate = profileY(outline, y0, y1);
    const cut = [...holes.map((h) => profileY(h, y0 - 0.3, y1 + 0.3)), ...niches.map((h) => profileY(h, niche[0], niche[1]))];
    return plate.subtract(union(cut));
  });
})();

// ---------- pijlers ----------
// Wandpijlers van de aanbrug (BGT op de uiterwaard: 3,7 m dik, 11,6 m lang,
// met spitse koppen), met een kop van 1,0 m die 0,35 m uitsteekt boven een
// schuine kraag van 52 graden, tot onder de koker. In de nevengeul staan ze op
// brede achthoekige poeren (BGT) tot NAP +4,3 m; de twee westelijkste
// (x = -347,45 en -385,6) staan niet in de BGT en zijn geschat.
const PIER = { half: 1.85, len: 5.8, tip: 1.85, yc: 0.1 };
const pierOutline = (xc) => [
  [xc, PIER.yc - PIER.len],
  [xc + PIER.half, PIER.yc - PIER.len + PIER.tip],
  [xc + PIER.half, PIER.yc + PIER.len - PIER.tip],
  [xc, PIER.yc + PIER.len],
  [xc - PIER.half, PIER.yc + PIER.len - PIER.tip],
  [xc - PIER.half, PIER.yc - PIER.len + PIER.tip],
];
const CAP = { height: 1.0, grow: 0.35, chamfer: 0.45 };
const APPROACH_PIERS = [
  { x: -385.6, measured: false },
  { x: -347.45, measured: false },
  { x: -309.31, footing: "L0002.58783fcb" },
  { x: -271.12, footing: "L0002.62702993" },
  { x: -232.93, footing: "L0002.080f50ee" },
  { x: -194.75, footing: "L0002.63b73415" },
  { x: -156.76 },
  { x: -118.52 },
  { x: -80.44 },
];
const FOOTING_TOP = Z(4.3);
// Poeren in de nevengeul (BGT, lokale coördinaten, vereenvoudigd tot 5 cm).
const FOOTINGS = {
  "L0002.58783fcb": [
    [[-310.49, -12.33], [-309.36, -12.75], [-308.43, -12.62], [-307.24, -12.01], [-299.85, -4.7], [-299.79, 4.65], [-307.02, 11.89],
      [-307.93, 12.47], [-309.34, 12.77], [-310.87, 12.37], [-311.76, 11.73], [-318.78, 4.71], [-318.83, -4.63], [-311.54, -11.95]],
  ],
  "L0002.62702993": [
    [[-271.48, -12.7], [-270.16, -12.57], [-268.76, -11.73], [-261.63, -4.66], [-261.61, 4.67], [-268.78, 11.9], [-269.67, 12.49],
      [-271.08, 12.8], [-272.5, 12.49], [-273.46, 11.82], [-280.6, 4.76], [-280.64, -4.57], [-273.66, -11.61]],
  ],
  // twee BGT-vlakken (L0002.080f50ee... en L0002.11c1a660...)
  "L0002.080f50ee": [
    [[-223.45, -4.65], [-223.4, 4.71], [-230.47, 11.81], [-231.5, 12.55], [-232.89, 12.84], [-233.35, 12.75], [-241.59, -5.4],
      [-235.41, -11.65], [-234.52, -12.3], [-233.47, -12.66], [-231.73, -12.45], [-230.59, -11.7]],
    [[-241.59, -5.4], [-233.35, 12.75], [-234.15, 12.58], [-235.21, 11.9], [-242.43, 4.77], [-242.45, -4.53]],
  ],
  "L0002.63b73415": [
    [[-189.7, 9.25], [-192.28, 11.84], [-193.18, 12.49], [-194.31, 12.82], [-195.23, 12.8], [-196.25, 12.47], [-196.89, 12.05],
      [-204.26, 4.82], [-204.27, -4.55], [-197.19, -11.65], [-196.03, -12.43], [-194.95, -12.67], [-193.51, -12.42], [-192.37, -11.67],
      [-185.25, -4.6], [-185.23, 4.75]],
  ],
};
// Rivierpijlers (BGT, spitse koppen, 5,6 m dik en 21,8 m lang) tot 2,4 m
// onder het vakwerkdek met dezelfde kop, en opleggingen van 2,0 × 1,2 m onder
// de vakwerklijnen.
const RIVER_PIERS = [
  { x: X_TW, side: 1, outline: [[-45.15, -8.09], [-45.13, 8.39], [-47.87, 11.08], [-50.73, 8.68], [-50.36, -8.08], [-47.8, -10.76]] },
  { x: X_TE, side: -1, outline: [[47.88, 10.9], [45.19, 8.43], [45.32, -8.13], [47.87, -10.7], [50.68, -7.93], [50.33, 8.44]] },
];
const RIVER_PIER_BELOW_DECK = 2.4;
// Kolom met kop: van z0 tot de kop, de kop tot zTop.
function cappedPier(outline, z0, zTop) {
  const capBottom = zTop - CAP.height;
  const kneeBottom = capBottom - CAP.chamfer;
  const capSection = grow([outline], CAP.grow);
  return union([
    prism(outline, z0, kneeBottom + 0.01),
    Manifold.hull([prism(outline, kneeBottom, kneeBottom + 0.01), Manifold.extrude(capSection, 0.01).translate([0, 0, capBottom - 0.01])]),
    Manifold.extrude(capSection, zTop - capBottom).translate([0, 0, capBottom]),
  ]);
}
const boxBottom = (x) => {
  // Diepste dek boven de pijler (bij een voeg de diepere koker).
  const depths = [x - 0.5, x, x + 0.5].map((xx) => deckDepth(Math.min(Math.max(xx, X_W_FACE), X_E_FACE)));
  return deckZ(x) - Math.max(...depths);
};
const piers = [
  ...APPROACH_PIERS.flatMap(({ x, footing }) => {
    const top = boxBottom(x) + 0.05;
    const parts = [cappedPier(pierOutline(x), footing ? FOOTING_TOP - 0.05 : BASE, top)];
    if (footing) parts.push(Manifold.extrude(grow(FOOTINGS[footing], 0), FOOTING_TOP - BASE).translate([0, 0, BASE]));
    return parts;
  }),
  ...RIVER_PIERS.flatMap(({ x, side, outline }) => {
    const top = deckZ(x) - RIVER_PIER_BELOW_DECK;
    const xa = x + side * 0.3;
    const xb = x + side * 2.3;
    return [
      cappedPier(outline, BASE, top),
      ...TRUSS_LINES.map(({ y0, y1 }) => box(Math.min(xa, xb), Math.max(xa, xb), y0 - 0.1, y1 + 0.1, top - 0.05, deckZ(x) - 1.6 + 0.05)),
    ];
  }),
];

// ---------- trap naar de uiterwaard ----------
// Dicht trapblok (BGT voetpad op trap G0150.83ad087f...): een bordes op
// dekhoogte en vijf treden tot NAP +9,5 m (AHN: de bovenste trap daalt van het
// dek tot circa +9,5 m aan het einde; de rest ligt eronder), vanaf de
// onderkant.
const stairTop = deckZ((STAIR.x0 + STAIR.x1) / 2);
const STAIR_RUN = (STAIR.y1 - STAIR.y0) / STAIR.treads;
const STAIR_RISE = (stairTop - Z(STAIR.bottomNap)) / (STAIR.treads - 1);
const stair = union(
  Array.from({ length: STAIR.treads }, (_, k) =>
    box(STAIR.x0, STAIR.x1, k === 0 ? STAIR.y0 - 0.6 : STAIR.y0 + k * STAIR_RUN - 0.01, STAIR.y0 + (k + 1) * STAIR_RUN, BASE, stairTop - k * STAIR_RISE),
  ),
);

const bridge = union([...deckParts, ...kerbs, ...trussSolids, ...piers, stair]);

// ---------- printvoet (alleen in de STL) ----------
// Onder de vrij hangende dekken een wig van 50 graden vanaf de onderkant van
// de dekrand die uitloopt in een scherm tot de onderplaat, zoals de
// overhangopvulling van de export.
const KNEE = (50 * Math.PI) / 180;
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const footXs = stations(X_W_FACE, X_E_FACE, 1);
const printFoot = loftX(
  footXs.map((x) => {
    const zt = deckZ(x);
    const zb = zt - edgeDepth(x) - 0.02;
    const yc = (eE(x) + eW(x)) / 2;
    const w = (eW(x) - eE(x)) / 2;
    const zIn = zt - 0.3;
    const zs = zb - Math.tan(KNEE) * (w - SCREEN);
    const section =
      zs > BASE + 0.05
        ? [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [w, zIn], [-w, zIn], [-w, zb], [-SCREEN, zs]]
        : (() => {
            const a = Math.max(SCREEN, w - (zb - BASE) / Math.tan(KNEE));
            return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [w, zIn], [-w, zIn], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
          })();
    return { x, section: section.map(([y, z]) => [y + yc, z]) };
  }),
);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: de
// onderkant van de dekken en de plafonds van de blinde nissen; verder niets.
const inNiche = (y) => TRUSS_LINES.some(({ niche }) => y > niche[0] - 1e-3 && y < niche[1] + 1e-3);
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const area = { deck: 0, niche: 0, other: 0 };
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const [xm, ym, zm] = [0, 1, 2].map((a) => (p[0][a] + p[1][a] + p[2][a]) / 3);
    const a2 = len / 2;
    const xc = Math.min(Math.max(xm, X_W_END), X_E_END);
    const inDeck = xm > X_W_FACE - 0.6 && xm < X_E_FACE + 0.6 && ym > eE(xc) - 0.01 && ym < eW(xc) + 0.01;
    if (inDeck && zm < deckZ(xc) + 0.5 && zm > deckZ(xc) - 3.8) area.deck += a2;
    else if (inTruss(xm) && inNiche(ym) && zm > deckZ(xc) + CHORD_TOP) area.niche += a2;
    else {
      area.other += a2;
      if (a2 > 0.01) console.log("overhang op", [xm, ym, zm].map((c) => +c.toFixed(2)), +a2.toFixed(3));
    }
  }
  return area;
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
const minFlank = openingAngles.reduce((m, a) => Math.min(m, a), Infinity);
{
  const model = overhangs(bridge);
  console.log("vrij hangend (m2):", Object.fromEntries(Object.entries(model).map(([k, a]) => [k, +a.toFixed(2)])));
  if (model.other > 0.5) throw new Error("overhang buiten dekken en nissen");
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", Object.fromEntries(Object.entries(print).map(([k, a]) => [k, +a.toFixed(2)])));
  console.log("doorgaande openingen", throughOpenings, "blinde nissen", blindNiches, "vlakste plafond (graden)", +minFlank.toFixed(1));
  if (minFlank < 50) throw new Error("opening met een te vlak plafond");
}

// ---------- spoor, fietspad en voetpad als eigen onderdelen ----------
// De bovenste 0,5 m van het dek binnen de actuele BGT-wegdelen op de brug
// (relatieve hoogteligging 1) is per functie een eigen node met de
// attributen van dat wegdeel (glTF `extras.attributes`), zodat de kleurregels
// van een thema (spoor zwart, fietspad rood) op de brug werken zoals op de
// PDOK-wegdelen ernaast; de trap krijgt de attributen van het wegdeel voetpad
// op trap. Wordt pas hier gebouwd, nadat het printmodel is doorgerekend.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
const BALLAST_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "half verhard" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
const FOOT_ATTRIBUTES = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "gesloten verharding" };
const STAIR_ATTRIBUTES = { bgt_functie: "voetpad op trap", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "cementbeton" };
// BGT-wegdelen op de brug, lokale coördinaten, vereenvoudigd tot 5 cm.
const RAIL_PATHS = [
  // L0004.b1b292607e1b29a1e0530b29a8c08503: zuidelijk spoor op de westelijke aanbrug
  [[-48.24, -3.04], [-48.21, -0.75], [-385.64, -0.9], [-385.63, -3.18]],
  // L0004.b1b292607e3429a1e0530b29a8c08503: noordelijk spoor op de westelijke aanbrug
  [[-385.65, 3.07], [-385.64, 0.82], [-74.39, 0.95], [-48.19, 0.98], [-48.16, 3.27], [-264.81, 3.19]],
  // L0004.b1b292607e3329a1e0530b29a8c08503: beide sporen over het vakwerk en het oostelijke veld
  [[48.07, -0.71], [-5.11, -0.84], [-48.21, -0.75], [-48.24, -3.04], [48.07, -3.0], [48.07, -5.88], [48.81, -5.72], [55.22, -4.98],
    [61.53, -4.38], [90.94, -4.27], [90.92, 4.49], [56.8, 4.45], [48.07, 5.33], [48.07, 3.31], [-48.16, 3.27], [-48.19, 0.98],
    [-20.29, 1.11], [48.07, 1.01]],
];
const BALLAST_PATHS = [
  // L0004.b1b292607e4629a1e0530b29a8c08503: westelijk landhoofd en veld over de weg
  [[-385.82, -4.82], [-385.66, -4.82], [-385.63, -3.26], [-385.65, 4.33], [-406.04, 4.35], [-406.07, 5.44], [-416.83, 5.48],
    [-416.56, -4.68], [-406.29, -4.8]],
  // L0004.b1b292607e4429a1e0530b29a8c08503: oostelijk landhoofd
  [[102.08, -4.69], [101.92, 5.68], [91.67, 5.68], [91.67, 4.5], [90.92, 4.49], [90.94, -4.27], [91.17, -4.27], [91.19, -4.6]],
];
const BIKE_PATHS = [
  // L0004.b1b292607e2b29a1e0530b29a8c08503: fietspad van x = -400,9 tot het oostelijke landhoofd
  [[-385.87, -7.65], [-385.56, -7.65], [-385.56, -7.97], [-400.89, -7.96], [-385.25, -8.09], [-176.87, -7.54], [-123.85, -7.69],
    [-71.67, -7.65], [-62.23, -7.68], [-47.75, -9.0], [47.9, -8.98], [61.69, -7.61], [89.46, -7.79], [89.46, -7.42], [102.05, -7.45],
    [102.08, -4.69], [91.19, -4.6], [91.17, -4.27], [61.53, -4.38], [55.22, -4.98], [48.81, -5.72], [48.07, -5.88], [-48.05, -5.92],
    [-49.41, -5.91], [-61.93, -4.67], [-385.85, -4.82]],
  // G0150.e789cd936553481c8245ab67058b9af3: fietspad op het westelijke landhoofd
  [[-385.87, -7.65], [-385.85, -4.81], [-406.29, -4.8], [-416.56, -4.72], [-416.49, -7.69]],
];
const FOOT_PATHS = [
  // L0004.b1b292607e3f29a1e0530b29a8c08503
  [[-151.13, 5.8], [-56.91, 5.84], [-48.53, 6.67], [41.9, 6.68], [47.95, 6.63], [56.81, 5.85], [85.0, 5.92], [89.32, 5.89],
    [89.33, 5.68], [101.92, 5.68], [101.89, 7.8], [68.99, 8.02], [57.85, 7.92], [47.94, 8.83], [-20.31, 8.89], [-47.82, 8.72],
    [-55.55, 7.93], [-145.75, 7.96], [-194.62, 7.8], [-341.89, 7.71], [-385.64, 7.55], [-416.88, 7.54], [-416.83, 5.48],
    [-404.64, 5.44], [-384.86, 5.71]],
];
// G0150.83ad087fda7c49ad94a6af5cc35edcc5: voetpad op trap
const STAIR_PATH = [[-117.05, 7.94], [-117.32, 18.33], [-121.29, 18.37], [-121.26, 7.94]];
const stripXs = stations(X_W_END - 0.5, X_E_END + 0.5);
const strip = loftX(
  stripXs.map((x) => ({
    x,
    section: [
      [eE(x) - 0.5, deckZ(x) - LAYER],
      [eW(x) + 0.5, deckZ(x) - LAYER],
      [eW(x) + 0.5, deckZ(x) + ABOVE],
      [eE(x) - 0.5, deckZ(x) + ABOVE],
    ],
  })),
);
const tall = (polys) => union(polys.map((poly) => prism(poly, BASE - 1, 40)));
// Wat boven het dek uitsteekt en constructie blijft, 2 cm groter.
const guards = union([
  ...KERBS.map(([x0, x1, y0, y1, above]) => band(x0 - GUARD, x1 + GUARD, y0, y1, above, GUARD)),
  ...TRUSS_LINES.map(({ y0, y1 }) => box(X_TW - 1, X_TE + 1, y0 - GUARD, y1 + GUARD, BASE - 1, 40)),
]);
const spoorCut = strip.intersect(tall(RAIL_PATHS)).subtract(guards);
const ballastCut = strip.intersect(tall(BALLAST_PATHS)).subtract(guards);
const bikeCut = strip.intersect(tall(BIKE_PATHS)).subtract(guards);
const footCut = strip.intersect(tall(FOOT_PATHS)).subtract(guards);
// Trap: de bovenste 0,5 m van de treden (met 1 m lucht erboven), binnen het
// BGT-vlak.
const stairCut = union([stair, stair.translate([0, 0, ABOVE])]).subtract(stair.translate([0, 0, -LAYER])).intersect(tall([STAIR_PATH]));
const cuts = [spoorCut, ballastCut, bikeCut, footCut, stairCut];
const structure = bridge.subtract(union(cuts));
const parts = [
  ["building:ijsselspoorbrug-deventer", structure],
  ["road:spoor", spoorCut.intersect(bridge), SPOOR_ATTRIBUTES],
  ["road:spoor-ballastbed", ballastCut.intersect(bridge), BALLAST_ATTRIBUTES],
  ["road:fietspad", bikeCut.intersect(bridge), BIKE_ATTRIBUTES],
  ["road:voetpad", footCut.intersect(bridge), FOOT_ATTRIBUTES],
  ["road:voetpad-op-trap", stairCut.intersect(bridge), STAIR_ATTRIBUTES],
];
{
  const whole = bridge.volume();
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  console.log(
    "volumes (m3): brug",
    +whole.toFixed(2),
    ...parts.flatMap(([name, solid]) => [name, +solid.volume().toFixed(2)]),
    "som - brug",
    +(sum - whole).toFixed(4),
  );
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) {
    if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
    if (solid.isEmpty()) throw new Error(`${name}: leeg`);
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
    // Vertexnormalen met scherpe randen boven 40 graden.
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
report.truss = {
  spanM: +(X_TE - X_TW).toFixed(2),
  panels: PANELS,
  panelM: +PANEL.toFixed(3),
  throughOpenings,
  blindNiches,
  minFlankDeg: +minFlank.toFixed(1),
  topNap: +(TRUSS_TOP + WATER_NAP).toFixed(2),
};
report.piers = APPROACH_PIERS.map(({ x }) => ({ x, capTopNap: +(boxBottom(x) + 0.05 + WATER_NAP).toFixed(2) }));
report.stair = { treads: STAIR.treads, runM: +STAIR_RUN.toFixed(2), riseM: +STAIR_RISE.toFixed(2) };
const glbFile = path.join(outDir, "ijsselspoorbrug-deventer.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-ijsselspoorbrug-deventer.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `ijsselspoorbrug-deventer-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint IJsselspoorbrug Deventer 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveldpunten op het water: de nevengeul naast de poeren en de IJssel naast
// het vakwerk, 25 m naast de as aan beide kanten.
const samplePoints = [-290, -252, -213, -30, 0, 30].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "ijsselspoorbrug-deventer.json"),
  JSON.stringify(
    {
      name: "IJsselspoorbrug (Deventer)",
      file: "ijsselspoorbrug-deventer.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [206809.9, 474439.11],
      xAxis: [0.66128, 0.75014],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de spooras midden tussen de harten van de twee rivierpijlers op het water van de nevengeul (z = 0, NAP +2,98 m) in de oorsprong, +X langs de brug naar het noordoosten (Deventer, RD-richting 48,60 graden vanaf het oosten) en +Y naar het noordwesten (stroomafwaarts, het voetpad); het fietspad ligt aan de zuidoostkant (y < 0). Zes nodes: road:spoor, road:spoor-ballastbed, road:fietspad, road:voetpad en road:voetpad-op-trap, de bovenste 0,5 m van het dek en van de trap binnen de actuele BGT-wegdelen met hun attributen in extras.attributes (spoorbaan, gesloten verharding of half verhard; fietspad en voetpad, gesloten verharding; voetpad op trap, gesloten verharding, cementbeton), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk van het westelijke landhoofd op de dijk (x = -416,89) tot het oostelijke landhoofd aan de IJsselkade (x = 102,13), 519 m. De stalen vakwerkbrug van 95,9 m over de IJssel (Warrenligger met negen vakken van 10,65 m, alleen diagonalen, schuine eindstijlen, bovenrand NAP +24,3 m, vakwerklijnen 4,7 m ten zuidoosten en 5,0 m ten noordwesten van de as) als dichte platen van 1,0 m met doorgaande driehoekige openingen (punt omhoog) en blinde nissen; de rivierpijlers met spitse koppen en opleggingen; de betonnen aanbrug als kokerligger (3,6 m) over de uiterwaard en de nevengeul op negen wandpijlers met kop, vier daarvan op achthoekige poeren in de nevengeul; het veld over de weg langs de dijk en het oostelijke veld over de IJsselkade (2,6 m); de landhoofden; schampkanten van 0,9 m tussen spoor en paden en randbalken van 0,6 m aan de buitenranden; de trap van het voetpad naar de uiterwaard bij x = -118,5 als dicht blok met zes treden. Dek op NAP +12,6 m (westelijk landhoofd), +14,9 m (rivierpijler), +15,0 m (vakwerk) en +14,8 m (oostelijk landhoofd). Windverband en portalen tussen de bovenranden, bovenleiding, leuningen, het looppad op de bovenrand en de trappen langs de landhoofden zijn weggelaten; de export vult onder de dekken een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water van de nevengeul en de IJssel bemonsterd; groundHeight is de laagste PDOK-hoogte daar (ellipsoïdisch). Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(X_E_END - X_W_END).toFixed(2),
        trussSpanM: +(X_TE - X_TW).toFixed(2),
        trussPanels: PANELS,
        trussTopNapM: 24.3,
        trussLinesFromAxisM: TRUSS_LINES.map(({ y0, y1 }) => +((y0 + y1) / 2).toFixed(2)),
        approachPierX: APPROACH_PIERS.map(({ x }) => x),
        approachSpanM: 38.2,
        deckNapM: { west: DECK_NAP[0][1], westRiverPier: 14.92, truss: 15.0, east: DECK_NAP[DECK_NAP.length - 1][1] },
        deckDepthM: { approach: 3.6, truss: 1.6, eastSpan: 2.6, roadSpan: 2.6 },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/IJsselspoorbrug_(Deventer)",
        "PDOK BGT overbruggingsdeel, wegdeel en spoor (dekrand, landhoofden, pijlers, poeren, spoorbaan, fietspad, voetpad, voetpad op trap), EPSG:28992",
        "PDOK AHN DSM en DTM 0,5 m via WCS voor het dek, het vakwerk, de schampkanten en de trap",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: IJsselspoorbrug Deventer, 2011.jpg, IJsselspoorbrug Deventer.JPG, IJsselspoorbrug - Deventer.jpg, Spoorbrug rail bridge Deventer 2019.jpg (en 2019 2, 2019 3), Railway bridge across the IJssel river at Deventer from the Northside - panoramio.jpg, Hoogwater Deventer december 2023 03.jpg en 04.jpg, Deventer brug over de IJssel (50143597592).jpg, Spoorviaduct Deventer 2024.jpg, Spoorbrug rail bridge Deventer train 2019 1.jpg, Spoorbrug rail bridge Deventer VIRM train 2019.jpg, Deventer - Ijssel - morning with mist - 8 nov 2020 - DJI mavic mini drone - aerial imagery - break of the day - 20.jpeg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

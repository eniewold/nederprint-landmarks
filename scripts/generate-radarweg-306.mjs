// Vertical (Radarweg, Amsterdam-Sloterdijk, 2023; NL Architects met Space Encounters, Chris Collaris
// en Studio Donna van Milligen Bielke, ontwikkelaar Heijmans). Eén BAG-pand met twee kavels:
// - oost (kavel N3): een woontoren van 18 lagen met rondom per laag een uitkragende vloer met
//   plantenbakken, bovenop een open stalen kroon met zonnepanelen, op een getrapte witte sokkel
//   langs de Radarweg met een zandkleurig blok op de noordoosthoek dat op kolommen staat;
// - west (kavel N1): een 'rotsachtige' woontoren van 35 m (Studio Donna van Milligen Bielke) en
//   gestapelde blokken op een begroeid dek ("Bretten Carpet") over de dubbelhoge begane grond.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, puntwolk AHN5 2023: het AHN4-DSM toont nog de
// bouwput), indeling van sokkel, kroon en lagen uit de doorsnede, de gevelaanzichten en foto's.
import { Manifold, ccw, prism, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "radarweg-306";
// Gebouwstelsel: u langs de zuid- en noordgevels van de toren (0,24° op RD-oost, BAG-randen
// evenwijdig binnen 0,15°), v naar het noorden. Oorsprong in het hart van de hoge toren.
const ORIGIN = [117416.75, 488912.3];
const ANGLE = 0.24;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const L = ([x, y]) => {
  const dx = x - ORIGIN[0], dy = y - ORIGIN[1];
  return [+(dx * AXIS[0] + dy * AXIS[1]).toFixed(3), +(-dx * AXIS[1] + dy * AXIS[0]).toFixed(3)];
};
const LP = (ring) => ring.map(L);
const GROUND = 1.0; // NAP, maaiveld (3D BAG 1,03)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
// 3D BAG LoD2.2 (AHN5): kroon 84,19–84,51, dak onder de kroon 79,55 (door de panelen heen gemeten),
// westtoren 36,31 met een liftopbouw 37,67, dek 8,73–8,78, blokken op het dek 12,0–16,6.
const CROWN = 84.2; // bovenkant van het zonnedak van de kroon
const ROOF = 79.55; // dak van de bovenste woonlaag
const ROOF_BAND = 0.9; // dakrand met plantenbakken
const TOWER_BASE = 23.5; // onderkant van de eerste uitkragende vloer (doorsnede ×1,023 op het 3D BAG-dak)
const PODIUM = 20.5; // dakterras van de sokkel rond de toren (doorsnede, aanzichten)
const PLINTH_BASE = 9.1; // dubbelhoge begane grond van de sokkel (aanzichten: 8,1 m)
const STEP = 3.0; // terrassen van de sokkel
const CUBE = 23.0; // zandkleurig blok op de noordoosthoek (noordaanzicht: 22 m)
const WEST_TOWER = 36.3; // westtoren (3D BAG 36,31)
const WEST_LIFT = 37.67; // liftopbouw (3D BAG)
const WEST_PLINTH = 15.4; // sokkel van de westtoren (3D BAG 15,43)
const DECK = 8.75; // begroeid dek over de dubbelhoge woningen (3D BAG 8,73–8,78)
const FLOORS = 18;
const STOREY = (ROOF - TOWER_BASE) / FLOORS; // 3,11 m

// ---------- Plattegronden (RD → gebouwstelsel) ----------
// Toren: buitenrand van de vloeren = rand van het 3D BAG-kroondak (dak 71).
const TOWER = LP([[117404.45, 488895.6], [117429.1, 488895.69], [117429.03, 488929.05], [117404.5, 488928.96]]);
// Sokkel oost: BAG-contour, met de schuine rand langs de Radarweg; westrand gelijk met de toren.
const SE = [117427.05, 488889.4], NE = [117441.04, 488929.1];
const PLINTH = LP([[117404.45, 488889.32], SE, NE, [117404.5, 488928.96]]);
// Zandkleurig blok: het noordelijke deel van de wig tussen toren en Radarweg (luchtfoto: dak met
// panelen van 488918 tot de noordgevel).
const cubeEdgeX = (y) => SE[0] + ((y - SE[1]) * (NE[0] - SE[0])) / (NE[1] - SE[1]);
const CUBE_POLY = LP([[117429.06, 488918.0], [cubeEdgeX(488918.0), 488918.0], NE, [117429.03, 488929.05]]);
// West: dek op de BAG-contour tot de open trappassage (x < 117396,5), de westtoren en zijn sokkel
// en de blokken op het dek als vereenvoudigde 3D BAG-dakvlakken (zie westData onderaan).
const WEST = westData();
const DECK_POLY = LP([[117348.6, 488901.55], [117396.46, 488901.74], [117396.31, 488928.93], [117348.58, 488928.77]]);
const WEST_PLINTH_POLY = LP([[117348.6, 488901.55], [117365.0, 488901.62], [117365.0, 488928.8], [117348.58, 488928.77]]);
const WEST_TOWER_POLY = LP([[117350.85, 488903.8], [117365.0, 488904.0], [117365.0, 488926.9], [117350.8, 488926.4]]);
const WEST_LIFT_POLY = LP([[117355.1, 488913.3], [117358.9, 488913.3], [117358.9, 488917.25], [117355.1, 488917.25]]);
// Trappen naar het dek (3D BAG: hellend vlak 5,7–8,6 op de zuidoosthoek, 5,6 aan de noordkant).
const STAIR_SOUTH = LP([[117388.5, 488901.0], [117397.0, 488901.0], [117397.0, 488904.7], [117388.5, 488904.7]]);
const STAIR_NORTH = LP([[117390.1, 488926.3], [117397.0, 488926.3], [117397.0, 488929.5], [117390.1, 488929.5]]);

// ---------- hulpfuncties ----------
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
// Snijdt een veelhoek af met het halfvlak links van de lijn a→b (Sutherland-Hodgman).
function clip(poly, a, b) {
  const side = (p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  const out = [];
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length], sp = side(p), sq = side(q);
    if (sp >= 0) out.push(p);
    if ((sp >= 0) !== (sq >= 0)) { const t = sp / (sp - sq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
  });
  return out;
}
// Sokkel ingesprongen over d m vanaf de zuidrand en de schuine Radarwegrand.
const [pSW, pSE, pNE] = PLINTH;
const shift = ([a, b], d) => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]), n = [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
  return [[a[0] + n[0] * d, a[1] + n[1] * d], [b[0] + n[0] * d, b[1] + n[1] * d]];
};
const terrace = (d) => clip(clip(PLINTH, ...shift([pSW, pSE], d)), ...shift([pSE, pNE], d));

// Snede langs rand a→b (gevel links van de rand gezien van a naar b is binnen): blok van s0 tot s1,
// van lo tot hi diep `depth`, met een plafond onder 45° (aan de gevel hi + depth, binnen hi).
function niche(a, b, s0, s1, lo, hi, depth) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], n = [d[1], -d[0]];
  const P = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  return Manifold.hull([P(s0, -0.3, lo), P(s1, -0.3, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.3, hi + depth + 0.3), P(s1, -0.3, hi + depth + 0.3), P(s0, depth, hi), P(s1, depth, hi)]);
}
// Ligt de gevel van `body` op rand a→b op (s, h) aan de buitenkant? (straal van 3 m buiten de rand)
function exposed(body, a, b, s, h) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], n = [d[1], -d[0]];
  const from = [a[0] + d[0] * s + n[0] * 3, a[1] + d[1] * s + n[1] * 3, h];
  const hit = body.rayCast(from, [a[0] + d[0] * s - n[0], a[1] + d[1] * s - n[1], h])[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.93 && at < 3.07;
}
// Vensters als blinde nissen op een raster per laag, alleen waar de gevel buitengevel is.
function windows(body, poly, floors, { pitch, width, sill = 0.9, head = 0.35, depth = 0.35, minEdge = 3 }) {
  const cuts = [];
  for (const [a, b] of edges(poly)) {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (l < minEdge) continue;
    const bays = Math.max(1, Math.floor((l - 0.9) / pitch)), w0 = (l - bays * pitch) / 2;
    for (const [zf, fh] of floors) {
      const lo = zf + sill, hi = zf + fh - head - depth;
      if (hi - lo < 0.9) continue;
      for (let k = 0; k < bays; k++) {
        const s0 = w0 + k * pitch + (pitch - width) / 2, s1 = s0 + width;
        if (s0 < 0.45 || s1 > l - 0.45) continue;
        const ok = [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + depth - 0.05].every((h) => exposed(body, a, b, s, h)));
        if (ok) cuts.push(niche(a, b, s0, s1, lo, hi, depth));
      }
    }
  }
  return cuts;
}
// Doorlopende glasband per laag achter een vloerrand van `slab` m, over de delen van de rand die
// buitengevel zijn (per halve meter getest).
function bands(body, poly, floors, { slab = 0.9, depth = 0.4, head = 0 } = {}) {
  const cuts = [];
  for (const [a, b] of edges(poly)) {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (l < 2) continue;
    for (const [zf, fh] of floors) {
      const lo = zf + slab, hi = zf + fh - head - depth;
      if (hi - lo < 0.9) continue;
      let start = null;
      const flush = (s1) => { if (start !== null && s1 - start >= 0.9) cuts.push(niche(a, b, start, s1, lo, hi, depth)); start = null; };
      for (let s = 0.45; s <= l - 0.45 + 1e-6; s += 0.5) {
        const ok = [lo + 0.05, hi + depth - 0.05].every((h) => exposed(body, a, b, s, h));
        if (ok && start === null) start = s;
        if (!ok) flush(s - 0.5);
      }
      flush(l - 0.45);
    }
  }
  return cuts;
}

// ---------- Oost: toren, kroon en sokkel ----------
// Toren: per laag een vloerrand van 0,9 m (vloer met plantenbak) rondom op de buitenrand, daartussen
// de gevel 1,2 m terug met een plafond onder 45°. Onder de eerste vloer een teruggezette glazen laag
// (gemeenschappelijke ruimte) boven het sokkeldak.
const SLAB = 0.9;
const RECESS = 1.2;
const TOWER_FLOORS = Array.from({ length: FLOORS }, (_, k) => [z(TOWER_BASE) + STOREY * k, STOREY]);
// Kroon: dakrand, een kern 1,2 m terug, en een zonnedak van 0,9 m op de buitenrand met een kraag van
// 45° naar de kern (1,2 m terug); staanders van 0,9 m op de hoeken en per travee langs de randen.
const CROWN_SLAB = 0.9, CROWN_IN = 1.2;
const inset = (poly, d) => edges(poly).reduce((p, [a, b]) => clip(p, ...shift([a, b], d)), poly);
const towerIn = inset(TOWER, CROWN_IN);
const lift = (poly, h) => poly.map(([x, y]) => [x, y, h]);
const crownTop = z(CROWN) - CROWN_SLAB;
const crown = union([
  prism(towerIn, z(ROOF) + ROOF_BAND - 0.05, crownTop),
  Manifold.hull([...lift(towerIn, crownTop - CROWN_IN), ...lift(TOWER, crownTop)]),
  prism(TOWER, crownTop - 0.01, z(CROWN)),
  ...edges(TOWER).flatMap(([a, b]) => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]), bays = Math.round(l / 6.5);
    const d = [(b[0] - a[0]) / l, (b[1] - a[1]) / l], n = [d[1], -d[0]];
    return Array.from({ length: bays }, (_, k) => {
      const s = Math.min(Math.max((k * l) / bays, 0.45), l - 0.45);
      const c = [a[0] + d[0] * s - n[0] * 0.45, a[1] + d[1] * s - n[1] * 0.45];
      return prism([[c[0] - 0.45, c[1] - 0.45], [c[0] + 0.45, c[1] - 0.45], [c[0] + 0.45, c[1] + 0.45], [c[0] - 0.45, c[1] + 0.45]], z(ROOF) + ROOF_BAND - 0.05, crownTop + 0.01);
    });
  }),
]);
const towerShaft = union([
  prism(TOWER, BASE, z(ROOF) + ROOF_BAND),
  crown,
]);
// Teruggezette laag tussen sokkeldak en eerste vloer: 1,5 m terug, kraag onder 45° naar de vloer.
// Aan de oostkant alleen tot het hoekblok, dat tot +23,0 m tegen de toren staat.
const baseRecess = edges(TOWER).map(([a, b], i) => {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const end = i === 1 ? CUBE_POLY[0][1] - a[1] : l + 0.35;
  return niche(a, b, -0.35, end, z(PODIUM), z(TOWER_BASE) - 1.5, 1.5);
});
// Sokkel: dubbelhoge begane grond tot +9,1 m, dan terrassen van 3 m die per laag 1,57 m terugspringen
// van de zuidrand en de Radarweg, tot het dakterras op +20,5 m rond de toren; het zandkleurige blok
// op de noordoosthoek tot +23,0 m.
// Terrasdiepte = een kwart van de zuidstrook tussen sokkelrand en torengevel (6,3 m).
const DS = TOWER[0][1] - PLINTH[0][1], TD = DS / 4;
const TERRACES = [[0, PLINTH_BASE], [TD, PLINTH_BASE + STEP], [2 * TD, PLINTH_BASE + 2 * STEP], [3 * TD, PLINTH_BASE + 3 * STEP], [DS, PODIUM]];
const terraces = TERRACES.map(([d, top]) => [terrace(d), top]).filter(([p]) => p.length >= 3);
const plinth = union([
  ...terraces.map(([p, top], i) => prism(p, i === 0 ? BASE : z(terraces[i - 1][1]) - 0.05, z(top))),
  prism(CUBE_POLY, BASE, z(CUBE)),
]);
let east = union([towerShaft, plinth]);
const eastCuts = [];
// Vloerranden en teruggezette gevel van de toren.
for (const [a, b] of edges(TOWER)) {
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
  for (const [zf, fh] of TOWER_FLOORS) eastCuts.push(niche(a, b, -0.35, l + 0.35, zf + SLAB, zf + fh - RECESS, RECESS));
}
eastCuts.push(...baseRecess);
// Begane grond van de sokkel: glazen pui 1,0 m terug onder een rand van 1,0 m; onder het blok op de
// hoek een galerij van 2,0 m tussen kolommen (kolommen zelf < 0,9 m, weggelaten).
{
  const [cA, cB] = [PLINTH[1], PLINTH[2]];
  const groundEdges = [[PLINTH[0], PLINTH[1]], [PLINTH[1], PLINTH[2]], [PLINTH[2], [L([117429.03, 488929.05])[0], PLINTH[2][1]]]];
  for (const [a, b] of groundEdges) {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    eastCuts.push(niche(a, b, 0.9, l - 0.9, BASE - 0.5, z(PLINTH_BASE) - 1.0 - 1.0, 1.0));
  }
  const l = Math.hypot(cB[0] - cA[0], cB[1] - cA[1]);
  const sCube = Math.hypot(CUBE_POLY[1][0] - cA[0], CUBE_POLY[1][1] - cA[1]);
  eastCuts.push(niche(cA, cB, sCube + 0.9, l - 0.9, BASE - 0.5, z(PLINTH_BASE) - 1.0 - 2.0, 2.0));
}
east = east.subtract(union(eastCuts));
// Vensterbanden in de terrasgevels en vensters in het hoekblok.
const plinthCuts = [];
terraces.slice(1).forEach(([p], i) => plinthCuts.push(...bands(east, p, [[z(terraces[i][1]), STEP]], { slab: 0.9, depth: 0.4 })));
plinthCuts.push(...windows(east, CUBE_POLY, Array.from({ length: 4 }, (_, k) => [z(PLINTH_BASE) + 3.2 * k, 3.2]), { pitch: 3.2, width: 1.8, minEdge: 4 }));
east = east.subtract(union(plinthCuts));

// ---------- West: dek, westtoren en blokken ----------
const westBody = union([
  prism(DECK_POLY, BASE, z(DECK)).subtract(union([prism(STAIR_SOUTH, z(7.2), 50), prism(STAIR_NORTH, z(5.6), 50)])),
  prism(WEST_PLINTH_POLY, z(DECK) - 0.05, z(WEST_PLINTH)),
  prism(WEST_TOWER_POLY, z(WEST_PLINTH) - 0.05, z(WEST_TOWER)),
  prism(WEST_LIFT_POLY, z(WEST_TOWER) - 0.05, z(WEST_LIFT)),
  ...WEST.map(([nap, ring]) => prism(LP(ring), z(DECK) - 0.05, z(nap))),
]);
const westCuts = [];
// Westtoren: 7 lagen van 2,99 m; sokkel: 2 lagen op het dek; dubbelhoge woningen onder het dek.
const wtFloors = Array.from({ length: 7 }, (_, k) => [z(WEST_PLINTH) + ((WEST_TOWER - WEST_PLINTH) / 7) * k, (WEST_TOWER - WEST_PLINTH) / 7]);
westCuts.push(...windows(westBody, WEST_TOWER_POLY, wtFloors, { pitch: 2.4, width: 1.3, sill: 0.9, head: 0.3 }));
westCuts.push(...windows(westBody, WEST_PLINTH_POLY, [[z(DECK), 3.3], [z(DECK) + 3.3, z(WEST_PLINTH) - z(DECK) - 3.3]], { pitch: 3.0, width: 1.9, sill: 0.8, head: 0.3 }));
westCuts.push(...windows(westBody, DECK_POLY, [[0, z(DECK)]], { pitch: 4.0, width: 2.6, sill: 0.4, head: 1.0, depth: 0.4 }));
for (const [nap, ring] of WEST) {
  const top = z(nap), fl = top - z(DECK) > 5 ? [[z(DECK), 3.4], [z(DECK) + 3.4, top - z(DECK) - 3.4]] : [[z(DECK), top - z(DECK)]];
  westCuts.push(...windows(westBody, ccw(LP(ring)), fl, { pitch: 3.0, width: 1.8, sill: 0.8, head: 0.35, minEdge: 3.5 }));
}
const west = westBody.subtract(union(westCuts));

const nodes = [["building:radarweg-306-oosttoren", east], ["building:radarweg-306-westblok", west]];
for (const [name, m] of nodes) {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
}

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Vertical",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.0, // NAP-maaiveld 1,0 + NLGEO2018-geoïde 42,98 ter plekke (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0363100012253362"],
    description:
      "Vertical aan de Radarweg bij station Sloterdijk (BAG-pand 0363100012253362, 2023), het hele pand met beide kavels. Oost: een toren van 24,7 × 33,4 m met 18 lagen van 3,11 m vanaf NAP +23,5 m tot het dak op +79,55 m, per laag een vloerrand van 0,9 m rondom met de gevel 1,2 m terug (plafond onder 45°), een teruggezette glazen laag boven het sokkeldak (+20,5 m) en een kroon met een zonnedak tot +84,2 m op staanders; de sokkel heeft een dubbelhoge begane grond (+9,1 m) en terrassen die per laag 1,57 m terugspringen van de zuidrand en de Radarweg, met een blok tot +23,0 m op de noordoosthoek boven een galerij. West: een begroeid dek op +8,75 m over de begane grond, een woontoren tot +36,3 m met liftopbouw op een sokkel tot +15,4 m en blokken op het dek (+12,0 tot +16,6 m) uit de 3D BAG-dakvlakken; vensters als blinde nissen. Hoogtes uit de 3D BAG (AHN5, 2023; het AHN4 toont de bouwput). Oorsprong in het hart van de hoge toren, X-as langs de zuidgevel (0,24° op RD-oost). Sokkelhoogtes en terrassen, de verdeling van de lagen, de kroon en de vensterrasters zijn geschat uit de doorsnede, de aanzichten en foto's.",
    realWorld: {
      groundNapM: GROUND,
      crownNapM: CROWN,
      roofNapM: ROOF,
      towerBaseNapM: TOWER_BASE,
      podiumNapM: PODIUM,
      plinthGroundFloorNapM: PLINTH_BASE,
      cornerBlockNapM: CUBE,
      towerFloors: FLOORS,
      storeyHeightM: +STOREY.toFixed(3),
      floorEdgeM: SLAB,
      facadeRecessM: RECESS,
      westTowerNapM: WEST_TOWER,
      westLiftNapM: WEST_LIFT,
      westPlinthNapM: WEST_PLINTH,
      deckNapM: DECK,
      facadeAngleDegrees: ANGLE,
      estimatedPlinthAndFloors: true,
    },
    sources: [
      "PDOK BAG pand 0363100012253362 (bouwjaar 2023), actuele orthoHR, AHN-DSM en -DTM 0,5 m (AHN4: bouwput)",
      "3D BAG LoD2.2 NL.IMBAG.Pand.0363100012253362 (puntwolk AHN5, 2023), https://3dbag.nl",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam (Vertical, 79 m, 22 lagen, 2023)",
      "https://www.metalocus.es/en/news/urban-ecosystem-vertical-nl-architects-space-encounters-donna-van-milligen-bielke-chris (doorsnede, aanzichten, foto's)",
      "https://afasiaarchzine.com/2025/04/vertical-sloterdijk-kavel-n1-and-n3-amsterdam-nl-space-encounters-dvmb-collaris-vdndp",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Vertical_in_aanbouw_in_Amsterdam_Sloterdijk.jpg",
    ],
  },
});

// Blokken op het dek van kavel N1: 3D BAG LoD2.2-dakvlakken (vlak, ≥ 7 m²) als [NAP, ring in RD],
// vereenvoudigd tot 0,3 m. Bron: 3D BAG (CC BY 4.0, 3D geoinformation group TU Delft).
function westData() {
  return [
    [16.59, [[117393.82, 488913.54], [117393.71, 488920.69], [117391.28, 488920.82], [117388.18, 488921.8], [117388.35, 488927.53], [117384.02, 488927.6], [117383.37, 488925.31], [117381.99, 488925.49], [117382.25, 488914.06], [117381.94, 488910.61], [117386.68, 488910.52], [117387.87, 488909.97], [117387.06, 488908.7], [117388, 488904.17], [117393.96, 488904.89]]],
    [15.44, [[117376.88, 488921.66], [117377.11, 488928.74], [117373.06, 488928.73], [117373.07, 488927.68], [117370.68, 488926.36], [117372.6, 488920.17], [117370.89, 488919.81], [117371.21, 488917.7], [117376.73, 488917.26]]],
    [15.43, [[117376.1, 488905.73], [117376.15, 488901.83], [117380.32, 488902.24], [117380.31, 488903.25], [117381.93, 488903.44], [117381.94, 488913.23], [117376.01, 488913.1], [117375.3, 488905.76]]],
    [15.43, [[117369.08, 488915.35], [117369.48, 488922.3], [117368.93, 488922.42], [117368.73, 488928.71], [117363.63, 488928.8], [117364.04, 488926.94], [117364.92, 488926.97], [117364.65, 488917.08], [117364.06, 488917.05], [117364.07, 488914.76], [117364.48, 488913.63], [117367.25, 488913.65], [117366.54, 488910.19], [117368.18, 488902.08], [117368.57, 488901.62], [117372.47, 488901.64], [117373.13, 488902.78], [117372.29, 488903.21], [117372.44, 488913.67], [117372, 488913.67], [117372, 488914.3], [117371.21, 488913.67], [117368.62, 488913.65], [117368.63, 488915.44]]],
    [15.11, [[117380.27, 488925.93], [117380.32, 488917.78], [117382.18, 488917.06], [117382.21, 488926.3]]],
    [12.57, [[117388, 488904.17], [117387.06, 488908.7], [117387.87, 488909.97], [117386.68, 488910.52], [117381.94, 488910.61], [117381.93, 488902.9]]],
    [12.54, [[117394.8, 488924.44], [117395.38, 488925.69], [117395.28, 488927.41], [117392.74, 488927.45], [117392.91, 488926.24], [117390.12, 488927.47], [117388.8, 488926.37], [117388.35, 488927.53], [117388.18, 488921.8], [117391.28, 488920.82], [117393.71, 488920.69], [117393.82, 488913.54], [117395.2, 488924.33]]],
    [12.01, [[117372.37, 488908.9], [117372.29, 488903.21], [117373.31, 488903.1], [117374.84, 488905.77], [117375.3, 488905.76], [117375.52, 488909.6]]],
    [12.0, [[117370.68, 488926.36], [117368.84, 488925.35], [117368.93, 488922.42], [117369.48, 488922.3], [117369.32, 488919.48], [117372.6, 488920.17]]],
    [11.99, [[117366.67, 488909.53], [117365.13, 488909.28], [117365.3, 488905.81], [117367.49, 488905.5]]],
    [11.99, [[117380.3, 488922.38], [117380.27, 488925.93], [117377.02, 488926.1], [117376.88, 488921.66]]],
  ];
}

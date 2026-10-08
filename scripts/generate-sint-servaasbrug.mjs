// Genereert een vereenvoudigd, gesloten 3D-model van de Sint-Servaasbrug in
// Maastricht: de middeleeuwse stenen boogbrug (1280-1298, in 1932-1934 geheel
// herbouwd) over de Maas tussen de binnenstad en Wyck, met zeven bogen op zes
// pijlers met ijsbrekers, de grote pijler met het brugwachtershuis en het beeld
// van Sint-Servaas, en aan de Wyckse kant het stalen beweegbare deel (tafelbrug)
// van circa 50 m tussen twee hoofdliggers. Alle maten in het script zijn meters
// op ware grootte. Uitvoer: een GLB in meters (Y omhoog, de constructie plus
// het wegdek als road:-nodes met de BGT-attributen, materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal> met een printvoet onder het
// stalen deel.
//
//   node scripts/generate-sint-servaasbrug.mjs              # 1:1000 (standaard)
//   node scripts/generate-sint-servaasbrug.mjs --scale 500
//
// Assenstelsel: oorsprong op de as van het BGT-dek (RD 176748,5, 317777,18),
// tussen de vierde en de vijfde pijler, op de waterspiegel van de Maas
// (stuwpeil Borgharen, NAP +44,0 m), Z omhoog. +X loopt langs de brug naar
// Wyck (oost, RD-richting 2,85 graden vanaf het oosten), +Y stroomafwaarts naar
// het noorden. De stenen bogen liggen aan de westkant (x < 35,5), het stalen
// deel aan de oostkant (x = 40 tot 90,6).
//
// Bronnen: BGT overbruggingsdeel (dek 187 m van kade tot kade, 11,8 m breed
// over het stenen deel en 13,2 m over het stalen deel, zes pijlers van 4,7 tot
// 5 m met een spitse ijsbreker stroomopwaarts en een ronde stroomafwaarts, de
// grote pijler van 4,6 × 43 m en het oostelijke landhoofd); AHN DSM 0,5 m (PDOK
// WCS) voor het lengteprofiel van het dek (NAP +50,4 tot +52,3 m), de
// borstwering (0,85 m), de kappen van de ijsbrekers, de hoofdliggers van het
// stalen deel (1,35 m boven het wegdek) en het brugwachtershuis (NAP +57,3 m);
// BAG voor het brugwachtershuis (pand 0935100000104552); Wikipedia en het
// Rijksmonumentenregister (28026) voor de geschiedenis; Wikimedia
// Commons-foto's voor de bogen, de ijsbrekers en het stalen deel.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-servaasbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
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
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Polygoon in het XY-vlak (plattegrond), uitgetrokken van z0 tot z1.
const prismZ = (points, z0, z1) => Manifold.extrude([ccw(points)], z1 - z0).translate([0, 0, z0]);
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

// ---------- hoofdmaten (boven de waterspiegel, NAP +44,0 m) ----------
const WATER_NAP = 44.0;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const WEST_END = -93.4; // kade aan de stadskant (BGT)
const EAST_END = 93.8; // kade in Wyck (BGT)

// Wegdek in NAP-meters om de 2 m van x = -94 tot 94: mediaan van het AHN-DSM
// over 2 × 4 m rond de as.
const DECK_NAP = [
  50.4, 50.48, 50.57, 50.65, 50.73, 50.8, 50.89, 50.95, 51.05, 51.12, 51.2, 51.25, 51.33, 51.4, 51.46,
  51.53, 51.57, 51.62, 51.69, 51.74, 51.79, 51.82, 51.88, 51.92, 51.95, 52.0, 52.04, 52.07, 52.11,
  52.13, 52.17, 52.19, 52.21, 52.26, 52.26, 52.28, 52.29, 52.3, 52.29, 52.28, 52.27, 52.26, 52.23,
  52.23, 52.2, 52.19, 52.17, 52.16, 52.14, 52.11, 52.08, 52.07, 52.06, 52.06, 52.04, 52.02, 52.0,
  51.99, 51.99, 51.98, 51.96, 51.95, 51.94, 51.94, 51.92, 51.9, 51.89, 51.88, 51.86, 51.85, 51.84,
  51.84, 51.83, 51.82, 51.81, 51.79, 51.76, 51.76, 51.74, 51.72, 51.7, 51.68, 51.66, 51.64, 51.62,
  51.61, 51.59, 51.58, 51.56, 51.53, 51.52, 51.49, 51.47, 51.47, 51.4,
];
function deckZ(x) {
  const f = Math.min(Math.max((x + 94) / 2, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return Z(DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t);
}

// Stenen deel: dek 11,8 m breed (BGT), borstwering 0,85 m hoog (AHN) en op
// 1:1000 0,9 m dik.
const STONE = { halfWidth: 5.9, parapet: 0.85, parapetWidth: 0.9 };
// Pijlers (BGT): oost- en westzijde in x, punt van de spitse ijsbreker aan de
// zuidkant (stroomopwaarts) en de ronde kop aan de noordkant.
const PIERS = [
  [-67.91, -62.86],
  [-50.49, -45.77],
  [-33.64, -28.88],
  [-15.55, -10.78],
  [2.43, 7.1],
  [19.31, 24.08],
];
const NOSE = { southTip: -9.4, southShoulder: -5.0, northTip: 7.7, body: Z(48.9), southCap: Z(50.9), northCap: Z(50.2) };
const WEST_ABUTMENT = -80.5; // voorzijde van het westelijke landhoofd
// Grote pijler (BGT): 4,6 m breed, van y = -20,6 tot 22,6, met een platform op
// NAP +52,3 m naast het wegdek en aflopende kappen naar de koppen.
const BIG_PIER = { from: 35.5, to: 40.06, southTip: -20.6, northTip: 22.6, platform: Z(52.3), platformHalf: 15.5 };
// Bogen: de opening krijgt een spitse top van 50 graden met de top 1,05 m
// onder het wegdek (de echte rondbogen hebben hun kruin circa 1,1 m onder het
// wegdek, op foto's geschat); daaronder lopen de zijden recht naar de
// pijlers. Zo print elke boog op 1:1000 zonder steun.
const ARCH = { belowDeck: 1.05, slope: (50 * Math.PI) / 180 };
// Stalen deel: dek 13,2 m breed (BGT) met twee hoofdliggers van 0,9 m
// (AHN: 0,7 m) die 1,35 m boven het wegdek uitsteken; onderkant 1,4 m onder
// het wegdek (geschat op foto's). Leuningen weggelaten.
const STEEL = { from: BIG_PIER.to, to: 90.6, halfWidth: 6.6, depth: 1.4, girderIn: 3.35, girderOut: 4.25, girderTop: 1.35 };
// Brugwachtershuis (BAG 0935100000104552) op de zuidkant van de grote pijler:
// stenen blok tot NAP +55,5 m met een glazen huisje tot NAP +57,3 m (AHN), en
// het beeld van Sint-Servaas (Charles Vos, 1934, circa 3 m) als zuil ervoor.
const HOUSE = { x0: 36.0, x1: 39.1, y0: -15.2, y1: -10.5, top: Z(55.5) };
const GLASS = { x0: 36.4, x1: 38.7, y0: -14.6, y1: -10.7, top: Z(57.3) };
const STATUE = { x0: 37.0, x1: 38.3, y0: -17.8, y1: -15.2, top: Z(55.8) };

// ---------- stenen brug ----------
const STEPS = Math.round((BIG_PIER.to - WEST_END) / 0.5);
let stone = bandY(WEST_END, BIG_PIER.to, () => BASE, deckZ, -STONE.halfWidth, STONE.halfWidth, STEPS);
const archFaces = [[WEST_ABUTMENT, PIERS[0][0]]];
for (let i = 0; i + 1 < PIERS.length; i++) archFaces.push([PIERS[i][1], PIERS[i + 1][0]]);
archFaces.push([PIERS[PIERS.length - 1][1], BIG_PIER.from]);
const arches = archFaces.map(([a, b]) => {
  const mid = (a + b) / 2;
  const half = (b - a) / 2;
  const apex = deckZ(mid) - ARCH.belowDeck;
  const jamb = apex - half * Math.tan(ARCH.slope);
  return { a, b, mid, span: b - a, apex, jamb };
});
const openings = arches.map(({ a, b, mid, apex, jamb }) => {
  const low = BASE - 1;
  const pts =
    jamb > low
      ? [[a, low], [b, low], [b, jamb], [mid, apex], [a, jamb]]
      : (() => {
          const w = (apex - low) / Math.tan(ARCH.slope);
          return [[mid - w, low], [mid + w, low], [mid, apex]];
        })();
  return profileY(pts, -STONE.halfWidth - 1, STONE.halfWidth + 1);
});
stone = stone.subtract(union(openings));

// IJsbrekers: recht tot NAP +48,9 m, dan een kap die naar de gevel oploopt.
function noses([x0, x1], { southTip, southShoulder, northTip, body, southCap, northCap, southFace, northFace }) {
  const r = (x1 - x0) / 2;
  const xc = (x0 + x1) / 2;
  const south = [[x0, southShoulder], [xc, southTip], [x1, southShoulder], [x1, 0], [x0, 0]];
  const northCentre = northTip - r;
  const north = [[x0, 0], [x1, 0]];
  for (let i = 0; i <= 16; i++) {
    const t = (Math.PI * i) / 16;
    north.push([xc + r * Math.cos(t), northCentre + r * Math.sin(t)]);
  }
  const southCapSolid = Manifold.hull([
    prismZ(south, body - 0.01, body).intersect(boxFromTo(x0 - 1, x1 + 1, southTip - 1, -southFace + 0.1, body - 1, body + 1)),
    boxFromTo(x0, x1, -southFace, -southFace + 0.1, southCap - 0.05, southCap),
  ]);
  const northCapSolid = Manifold.hull([
    prismZ(north, body - 0.01, body).intersect(boxFromTo(x0 - 1, x1 + 1, northFace - 0.1, northTip + 1, body - 1, body + 1)),
    boxFromTo(x0, x1, northFace - 0.1, northFace, northCap - 0.05, northCap),
  ]);
  return union([prismZ(south, BASE, body), prismZ(north, BASE, body), southCapSolid, northCapSolid]);
}
const pierNoses = PIERS.map((p) =>
  noses(p, { ...NOSE, southFace: STONE.halfWidth, northFace: STONE.halfWidth }),
);

// Grote pijler: koppen als bij de andere pijlers, met de kappen tot de rand van
// het platform, en het platform naast het wegdek.
const bigPier = union([
  noses([BIG_PIER.from, BIG_PIER.to], {
    southTip: BIG_PIER.southTip,
    southShoulder: BIG_PIER.southTip + 2.3,
    northTip: BIG_PIER.northTip,
    body: NOSE.body,
    southCap: BIG_PIER.platform,
    northCap: BIG_PIER.platform,
    southFace: BIG_PIER.platformHalf,
    northFace: BIG_PIER.platformHalf,
  }),
  boxFromTo(BIG_PIER.from, BIG_PIER.to, -BIG_PIER.platformHalf, BIG_PIER.platformHalf, BASE, BIG_PIER.platform - 0.4),
  boxFromTo(BIG_PIER.from, BIG_PIER.to, -BIG_PIER.platformHalf, -STONE.halfWidth, BASE, BIG_PIER.platform),
  boxFromTo(BIG_PIER.from, BIG_PIER.to, STONE.halfWidth, BIG_PIER.platformHalf, BASE, BIG_PIER.platform),
  boxFromTo(HOUSE.x0, HOUSE.x1, HOUSE.y0, HOUSE.y1, BIG_PIER.platform - 0.1, HOUSE.top),
  boxFromTo(GLASS.x0, GLASS.x1, GLASS.y0, GLASS.y1, HOUSE.top - 0.1, GLASS.top),
  boxFromTo(STATUE.x0, STATUE.x1, STATUE.y0, STATUE.y1, Z(50.0), STATUE.top),
]);

// Borstwering over het stenen deel, aan beide zijden, volgt het wegdek.
const parapets = [-1, 1].map((s) =>
  bandY(
    WEST_END,
    BIG_PIER.from,
    (x) => deckZ(x) - 0.3,
    (x) => deckZ(x) + STONE.parapet,
    s > 0 ? STONE.halfWidth - STONE.parapetWidth : -STONE.halfWidth,
    s > 0 ? STONE.halfWidth : -STONE.halfWidth + STONE.parapetWidth,
    STEPS,
  ),
);

// ---------- stalen deel en oostelijk landhoofd ----------
const steelSteps = Math.round((STEEL.to - STEEL.from) / 0.5);
const steelDeck = bandY(
  STEEL.from - 0.3,
  STEEL.to + 0.3,
  (x) => deckZ(x) - STEEL.depth,
  deckZ,
  -STEEL.halfWidth,
  STEEL.halfWidth,
  steelSteps,
);
const girders = [-1, 1].map((s) =>
  bandY(
    STEEL.from - 0.3,
    STEEL.to + 0.3,
    (x) => deckZ(x) - STEEL.depth,
    (x) => deckZ(x) + STEEL.girderTop,
    s > 0 ? STEEL.girderIn : -STEEL.girderOut,
    s > 0 ? STEEL.girderOut : -STEEL.girderIn,
    steelSteps,
  ),
);
const eastAbutment = bandY(STEEL.to, EAST_END, () => BASE, deckZ, -STEEL.halfWidth, STEEL.halfWidth, 8);

const bridge = union([stone, ...pierNoses, bigPier, ...parapets, steelDeck, ...girders, eastAbutment]);
// ---------- printvoet (alleen in de STL) ----------
// Het stalen deel hangt 50 m vrij boven de doorvaart. Net als de
// overhangopvulling van de export krijgt de STL daaronder een wig van 50
// graden die uitloopt in een scherm van 0,9 m tot de onderplaat.
const SCREEN = 0.45;
const footStations = [];
for (let i = 0; i <= steelSteps; i++) {
  const x = STEEL.from + ((STEEL.to - STEEL.from) * i) / steelSteps;
  const zb = deckZ(x) - STEEL.depth + 0.02;
  const w = STEEL.halfWidth + 0.02;
  const zs = zb - Math.tan(ARCH.slope) * (w - SCREEN);
  const section =
    zs > BASE + 0.05
      ? [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]]
      : (() => {
          const a = w - (zb - BASE) / Math.tan(ARCH.slope);
          return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
        })();
  footStations.push({ x, section });
}
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van het stalen deel, in de printversie geen.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
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
    found.push(p);
  }
  return { area, found };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  const { area, found } = overhangs(bridge);
  for (const p of found) {
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const under = deckZ(xMid) - STEEL.depth;
    if (xMid < STEEL.from - 0.31 || xMid > STEEL.to + 0.31 || Math.abs(zMid - under) > 0.05) {
      throw new Error(`overhang buiten het stalen deel op x ${xMid.toFixed(2)}, z ${zMid.toFixed(2)}`);
    }
  }
  console.log("onderkant van het stalen deel (m2):", Math.round(area));
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2));
  if (print.area > 0.5) throw new Error("printversie heeft overhang");
}

// ---------- wegdek met PDOK-attributen als eigen onderdelen ----------
// Pas hier, nadat brug en printversie zijn doorgerekend, zodat de STL
// ongewijzigd blijft. De bovenste 0,5 m van het wegdek is per BGT-functie een
// eigen node met de attributen van het actuele BGT-wegdeel op het dek
// (relatieve hoogteligging 1) in glTF `extras.attributes`, zodat de
// kleurregels van een thema op de brug werken zoals op de PDOK-wegdelen
// ernaast. Contouren in lokale coördinaten, vereenvoudigd tot 5 cm.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
// Stenen deel: rijbaan lokale weg in sierbestrating met aan beide kanten een
// fietspad (BGT zonder materiaal).
const ROAD_ATTRIBUTES = {
  bgt_functie: "rijbaan lokale weg",
  bgt_fysiekvoorkomen: "open verharding",
  plus_fysiekvoorkomen: "sierbestrating",
};
// Stalen deel: rijbaan lokale weg in asfalt met voetpaden binnen en buiten de
// hoofdliggers.
const STEEL_ROAD_ATTRIBUTES = {
  bgt_functie: "rijbaan lokale weg",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "open verharding" };
const FOOT_ATTRIBUTES = {
  bgt_functie: "voetpad",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_PATHS = [
  // L0002.82b47aa4485647e3afb885dd611ba531: noordkant van het stenen deel.
  [[37.01, 2.08], [37.0, 4.36], [36.04, 4.36], [36.04, 6.62], [35.52, 6.62], [35.58, 6.17], [32.66, 5.39],
    [-1.13, 5.47], [-50.6, 5.46], [-93.18, 5.35], [-92.5, 1.9], [-64.42, 2.13], [-44.12, 2.2], [-21.36, 2.09],
    [-1.0, 2.14], [16.97, 2.03]],
  // L0002.bcbf444e559040489e552a178b0793f8: zuidkant van het stenen deel.
  [[21.07, -1.99], [-81.01, -2.03], [-91.58, -2.81], [-90.49, -7.82], [-80.54, -5.31], [32.8, -5.47],
    [35.51, -6.15], [35.46, -6.6], [36.1, -6.6], [36.09, -4.33], [37.07, -4.33], [37.06, -2.04]],
];
// L0002.ef0d68b3df2346f2a74499ccd7cbf599: rijbaan over het stenen deel tot
// halverwege de grote pijler.
const ROAD_STONE = [[-91.58, -2.81], [-81.01, -2.03], [-19.4, -2.05], [2.91, -1.99], [37.06, -2.04], [37.01, 2.08],
  [16.97, 2.03], [-1.0, 2.14], [-21.36, 2.09], [-44.12, 2.2], [-64.42, 2.13], [-92.5, 1.9]];
// L0002.ddc59588b2c64f9c9d9bc2e43bc6b86a: rijbaan over het stalen deel; de
// BGT houdt op x = 92,8 op, hier doorgetrokken tot voorbij de kade (x = 93,8).
const ROAD_STEEL = [[37.01, 2.08], [37.06, -2.04], [74.39, -2.14], [92.83, -2.0], [95, -2.0], [95, 2.0],
  [92.82, 2.0], [82.46, 2.1], [57.21, 2.14]];
// Voetpaden (L0002.2cb3ef82..., 56e79242..., 77377668..., 8c5bf5ed... in
// asfalt en de twee strookjes L0002.9fdee0d5... en d4742e87... in cementbeton
// van 0,25 × 1 m op het landhoofd): alles vanaf x = 36,0 (de BGT laat de
// voetpaden op x = 36,04 beginnen; de grens ligt binnen het fietspad) dat geen
// fietspad of rijbaan is, dus ook de randen langs de hoofdliggers en tot de
// dekrand (6,6 m; de BGT-voetpaden houden op 6,3 m op).
const FOOT_FROM = 36.0;

// Snijstroken van 0,5 m onder tot 1 m boven het wegdek, over dezelfde
// loftstations als het dek.
const stoneStations = [];
for (let i = 0; i <= STEPS; i++) stoneStations.push(WEST_END + ((BIG_PIER.to - WEST_END) * i) / STEPS);
const steelStations = [];
for (let i = 0; i <= steelSteps; i++)
  steelStations.push(STEEL.from - 0.3 + ((STEEL.to - STEEL.from + 0.6) * i) / steelSteps);
const abutmentStations = [];
for (let i = 0; i <= 8; i++) abutmentStations.push(STEEL.to + ((EAST_END - STEEL.to) * i) / 8);
function strip(stations, x0, x1, e0, e1) {
  const xs = [x0, ...stations.filter((x) => x > x0 + 1e-3 && x < x1 - 1e-3), x1];
  return loftX(
    xs.map((x) => {
      const zt = deckZ(x);
      return { x, section: [[e0, zt - LAYER], [e1, zt - LAYER], [e1, zt + ABOVE], [e0, zt + ABOVE]] };
    }),
  );
}
const innerParapet = STONE.halfWidth - STONE.parapetWidth;
const layer = union([
  // Stenen deel tussen de borstweringen.
  strip(stoneStations, WEST_END - 0.5, BIG_PIER.from + 0.01, -innerParapet, innerParapet),
  // Op de grote pijler zonder borstwering, tot het platform.
  strip(stoneStations, BIG_PIER.from, BIG_PIER.to + 0.01, -STONE.halfWidth, STONE.halfWidth),
  // Stalen deel en oostelijk landhoofd tot voorbij de dekrand.
  strip(steelStations, STEEL.from - 0.3, STEEL.to + 0.3, -STEEL.halfWidth - 0.4, STEEL.halfWidth + 0.4),
  strip(abutmentStations, STEEL.to, EAST_END + 0.5, -STEEL.halfWidth - 0.4, STEEL.halfWidth + 0.4),
]);
// Wat boven het wegdek uitsteekt blijft constructie, met 2 cm vrij: de
// borstweringen, het platform van de grote pijler en de hoofdliggers.
const parapetGuards = [-1, 1].map((s) =>
  bandY(
    WEST_END - 0.6,
    BIG_PIER.from + GUARD,
    (x) => deckZ(x) - LAYER - GUARD,
    (x) => deckZ(x) + STONE.parapet + GUARD,
    s > 0 ? innerParapet - GUARD : -STONE.halfWidth - GUARD,
    s > 0 ? STONE.halfWidth + GUARD : -innerParapet + GUARD,
    STEPS,
  ),
);
const platformGuards = [-1, 1].map((s) =>
  boxFromTo(
    BIG_PIER.from - GUARD,
    BIG_PIER.to + GUARD,
    s * (STONE.halfWidth - GUARD),
    s * (BIG_PIER.platformHalf + GUARD),
    BASE - 1,
    BIG_PIER.platform + GUARD,
  ),
);
const girderGuards = [-1, 1].map((s) =>
  bandY(
    STEEL.from - 0.3 - GUARD,
    STEEL.to + 0.3 + GUARD,
    (x) => deckZ(x) - STEEL.depth - GUARD,
    (x) => deckZ(x) + STEEL.girderTop + GUARD,
    s > 0 ? STEEL.girderIn - GUARD : -STEEL.girderOut - GUARD,
    s > 0 ? STEEL.girderOut + GUARD : -STEEL.girderIn + GUARD,
    steelSteps,
  ),
);
const cutLayer = layer.subtract(union([...parapetGuards, ...platformGuards, ...girderGuards]));
const tall = (poly) => prismZ(poly, BASE - 1, 30);
const bikePrisms = union(BIKE_PATHS.map(tall));
const stoneRoadPrism = tall(ROAD_STONE);
const steelRoadPrism = tall(ROAD_STEEL);
const bikeCut = cutLayer.intersect(bikePrisms);
const steelRoadCut = cutLayer.intersect(steelRoadPrism).subtract(bikePrisms).subtract(stoneRoadPrism);
const footRegion = boxFromTo(FOOT_FROM, EAST_END + 5, -30, 30, BASE - 1, 30);
const footCut = cutLayer.intersect(footRegion).subtract(union([bikePrisms, stoneRoadPrism, steelRoadPrism]));
const roadCut = cutLayer.subtract(union([bikePrisms, steelRoadPrism, footRegion.subtract(stoneRoadPrism)]));
const structure = bridge.subtract(cutLayer);
const parts = [
  ["building:sint-servaasbrug", structure],
  ["road:rijbaan", roadCut.intersect(bridge), ROAD_ATTRIBUTES],
  ["road:rijbaan-staal", steelRoadCut.intersect(bridge), STEEL_ROAD_ATTRIBUTES],
  ["road:fietspad", bikeCut.intersect(bridge), BIKE_ATTRIBUTES],
  ["road:voetpad", footCut.intersect(bridge), FOOT_ATTRIBUTES],
];
{
  // De onderdelen vullen de brug precies: hun volumes tellen op tot die van
  // de brug als geheel.
  const sum = parts.reduce((a, [, solid]) => a + solid.volume(), 0);
  const whole = bridge.volume();
  console.log(
    "volumes (m3):",
    parts.map(([name, solid]) => `${name} ${solid.volume().toFixed(2)}`).join(", "),
    `som ${sum.toFixed(2)}, brug ${whole.toFixed(2)}`,
  );
  if (Math.abs(sum - whole) > 0.05) throw new Error(`onderdelen ${sum} tegen brug ${whole}`);
  for (const [name, solid] of parts) {
    if (solid.status() !== "NoError" || solid.isEmpty()) throw new Error(`${name}: ${solid.status()}`);
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
report.arches = arches.map(({ a, b, span, apex, jamb }) => ({
  from: a,
  to: b,
  span: +span.toFixed(2),
  apexNap: +(apex + WATER_NAP).toFixed(2),
  jambAboveWater: +jamb.toFixed(2),
}));
const glbFile = path.join(outDir, "sint-servaasbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-sint-servaasbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `sint-servaasbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Sint-Servaasbrug Maastricht 1:${scale} mm Z-up`);
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
const samplePoints = [-56.2, -22.2, 13.2, 65].flatMap((x) => [
  [x, 14],
  [x, -14],
]);
await writeFile(
  path.join(outDir, "sint-servaasbrug.json"),
  JSON.stringify(
    {
      name: "Sint-Servaasbrug",
      file: "sint-servaasbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [176748.5, 317777.18],
      xAxis: [0.99876, 0.04972],
      groundOffsetMetres: 0,
      // Op het water van de Maas naast de brug: onder de derde, vijfde en
      // zesde boog en naast het stalen deel, aan beide zijden.
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0935100000104552"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het BGT-dek tussen de vierde en de vijfde pijler op de waterspiegel van de Maas (z = 0, NAP +44,0 m) in de oorsprong, +X langs de brug naar Wyck (RD-richting 2,85 graden vanaf het oosten) en +Y stroomafwaarts naar het noorden. Vijf nodes: road:rijbaan, road:rijbaan-staal, road:fietspad en road:voetpad, de bovenste 0,5 m van het wegdek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan lokale weg, fietspad of voetpad; bgt_fysiekvoorkomen open verharding op het stenen deel, gesloten verharding op het stalen deel; plus_fysiekvoorkomen sierbestrating op de rijbaan over het stenen deel, asfalt op rijbaan en voetpaden van het stalen deel, niet op de fietspaden, waar de BGT geen materiaal geeft), zodat de kleurregels van een thema erop werken (over het stenen deel de rijbaan in het midden met aan beide kanten een fietspad tot de borstwering, over het stalen deel de rijbaan in het midden en voetpaden binnen en buiten de hoofdliggers); en building: de rest van de brug, met het stenen deel van de kade aan de stadskant (x = -93,4) tot de grote pijler (x = 35,5 tot 40,1) met zeven bogen op zes pijlers met een spitse ijsbreker stroomopwaarts en een ronde stroomafwaarts, een borstwering van 0,85 m en een wegdek dat van NAP +50,4 m naar +52,3 m bij de vierde pijler oploopt; de grote pijler met het brugwachtershuis (NAP +57,3 m) en het beeld van Sint-Servaas aan de zuidkant; het stalen beweegbare deel van 50 m met twee hoofdliggers tot de kade in Wyck (x = 93,8). De bogen hebben een spitse top van 50 graden 1,05 m onder het wegdek in plaats van de rondbogen, zodat ze op 1:1000 zonder steun printen; de export vult onder het stalen deel een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd. Vervangt het brugwachtershuis (BAG-pand). Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_END - WEST_END).toFixed(1),
        stoneWidthM: STONE.halfWidth * 2,
        steelWidthM: STEEL.halfWidth * 2,
        arches: arches.length,
        archSpansM: arches.map(({ span }) => +span.toFixed(1)),
        pierWidthsM: PIERS.map(([a, b]) => +(b - a).toFixed(2)),
        steelSpanM: +(STEEL.to - STEEL.from).toFixed(1),
        deckNapM: { west: DECK_NAP[0], crest: Math.max(...DECK_NAP), east: DECK_NAP[DECK_NAP.length - 1] },
        parapetM: STONE.parapet,
        girderAboveDeckM: STEEL.girderTop,
        bridgeHouseTopNapM: GLASS.top + WATER_NAP,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Sint_Servaasbrug",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/28026",
        "PDOK BGT overbruggingsdeel (dek, zes pijlers, grote pijler, landhoofd), EPSG:28992",
        "PDOK BAG pand 0935100000104552 (brugwachtershuis)",
        "PDOK AHN DSM 0,5 m via WCS voor het wegdek, de borstwering, de ijsbrekers, de hoofdliggers en het brugwachtershuis",
        "Rijkswaterstaat: stuwpeil Borgharen (NAP +44,0 m)",
        "Wikimedia Commons: Sint-Servaasbrug Maastricht.jpg, Sint Servaasbrug 2007.JPG, Beweegbaar deel Sint-Servaasbrug 1.jpg, Sint-Servaasbrug Maastricht Maas.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

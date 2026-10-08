// Genereert een vereenvoudigd, gesloten 3D-model van de Hoge Brug in
// Maastricht: de fiets- en voetgangersbrug van bureau René Greisch (2003) over
// de Maas tussen het Stadspark (Onze Lieve Vrouwewal) en Plein 1992 in
// Céramique. Eén stalen boog van circa 165 m in het hart van het dek, zonder
// pijlers in de rivier, met het dek aan diagonaal gekruiste kabels; op beide
// oevers twee ronde kolommen onder de voeten van de boog, een glazen lift op de
// as en een 'luie trap' naar het maaiveld, aan de stadskant bovendien een
// krulvormige oprit naar de Maasboulevard. Alle maten in het script zijn meters
// op ware grootte. Uitvoer: een GLB in meters (Y omhoog, nodes met de
// materiaalklasse in de nodenaam: de constructie en de wegdelen voetpad,
// fietspad en voetpad op trap met hun BGT-attributen) als catalogusbron voor
// de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal> met een printvoet onder
// het dek en de krul.
//
//   node scripts/generate-hoge-brug-maastricht.mjs              # 1:1000 (standaard)
//   node scripts/generate-hoge-brug-maastricht.mjs --scale 1500
//
// Assenstelsel: oorsprong op de as van het BGT-dek midden onder de top van de
// boog (RD 176847,78, 317422,23), op de waterspiegel van de Maas (stuwpeil
// Borgharen, NAP +44,0 m), Z omhoog. +X loopt langs de brug naar Céramique
// (oostnoordoost, RD-richting 8,58 graden vanaf het oosten), +Y stroomafwaarts
// naar het noordnoordwesten. De stadskant (Stadspark, x < 0) ligt aan de
// westoever, Plein 1992 aan de oostoever.
//
// Bronnen: BGT overbruggingsdeel (dek van 6,6 m breed van de voet van de trap in
// het Stadspark (x = -139,4) tot Plein 1992 (x = 121,3), de krul naar de
// Maasboulevard met een binnenstraal van 9,0 m en een buitenstraal van 11,5 m,
// kolommen als pijlers); AHN DSM/DTM 0,5 m (PDOK WCS) voor het lengteprofiel van
// het dek (NAP +54,7 m boven de Maasboulevard, +56,4 m in het midden, +55,2 m
// bij Plein 1992), de trappen (naar NAP +47,1 en +50,0 m), de krul (naar
// NAP +48,2 m), de boog (bovenkant een cirkel met de top op NAP +72,0 m, die
// het dek 82,7 m uit het midden raakt) en de liften (NAP +61,2 m); PDOK-luchtfoto
// voor de liften en de voeten van de boog; Wikipedia (lengte 261 m, breedte
// 7,2 m, geen pijlers in de Maas, kabels, luie trap, liften, krul naar de
// Maasboulevard); Wikimedia Commons-foto's voor de kabels (acht ankers op de
// boog, 18 m uit elkaar, elk met twee kabels naar het dek), de rompvorm van het
// dek, de dubbele kolommen met de uitlopende kop en de wangen van de trappen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hoge-brug-maastricht");
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
const signedArea = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area / 2;
};
const ccw = (pts) => (signedArea(pts) > 0 ? pts : [...pts].reverse());
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Loft langs een pad in plattegrond: per station een punt (x, y), een
// richting (dx, dy) en een convexe doorsnede [lateraal, z] (lateraal positief
// naar links van de looprichting), steeds evenveel punten.
function loftPath(stations) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { x, y, dx, dy, section } of stations) {
    const len = Math.hypot(dx, dy);
    const nx = -dy / len;
    const ny = dx / len;
    for (const [l, z] of section) verts.push(x + l * nx, y + l * ny, z);
  }
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
  let solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  if (solid.volume() < 0) throw new Error("loft binnenstebuiten");
  return solid;
}
// Loft langs X (rechte as): doorsnede [y, z], tegen de klok in met y naar rechts
// (lateraal links van +X is +Y).
const loftX = (stations) => loftPath(stations.map(({ x, section }) => ({ x, y: 0, dx: 1, dy: 0, section })));

// 2D-veelhoeken (x, z) voor de kabelvelden.
const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
// Halveer een veelhoek met de lijn door p en q; geeft [links, rechts].
function splitPolygon(poly, p, q) {
  const side = (pt) => cross(p, q, pt);
  const left = [];
  const right = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const sa = side(a);
    const sb = side(b);
    if (sa >= 0) left.push(a);
    if (sa <= 0) right.push(a);
    if ((sa > 0 && sb < 0) || (sa < 0 && sb > 0)) {
      const t = sa / (sa - sb);
      const m = [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])];
      left.push(m);
      right.push(m);
    }
  }
  return [left, right].filter((pg) => pg.length >= 3 && Math.abs(signedArea(pg)) > 1e-3);
}
// Snijd een convexe veelhoek af op het halfvlak a x + b z <= c.
function clipHalfPlane(poly, a, b, c) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const fp = a * p[0] + b * p[1] - c;
    const fq = a * q[0] + b * q[1] - c;
    if (fp <= 0) out.push(p);
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
      const t = fp / (fp - fq);
      out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
    }
  }
  return out;
}
function convexHull(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (const p of [...pts].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
// Convexe veelhoek (tegen de klok in) een afstand d naar binnen verschoven.
function inset(poly, d) {
  let out = poly;
  for (let i = 0; i < poly.length && out.length >= 3; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const ex = q[0] - p[0];
    const ez = q[1] - p[1];
    const len = Math.hypot(ex, ez);
    if (len < 1e-6) continue;
    // Naar buiten wijzende normaal van een kant tegen de klok in: (ez, -ex).
    const a = ez / len;
    const b = -ex / len;
    out = clipHalfPlane(out, a, b, a * p[0] + b * p[1] - d);
  }
  return out;
}

// ---------- hoofdmaten (boven de waterspiegel, NAP +44,0 m) ----------
const WATER_NAP = 44.0;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel

// Looppad (AHN-DSM, mediaan naast de as om de 2 m): van de bovenkant van de
// westtrap (x = -112, NAP +54,71 m) lineair naar NAP +55,49 m op x = -80 en dan
// een verticale boog met de top op NAP +56,37 m in het midden, symmetrisch
// onder de boog: z = 56,37 - 1,375e-4 x² (NAP +55,21 m op x = 92).
const DECK = { west: -112, east: 92, westNap: 54.71, kneeX: -80, crestNap: 56.37, k: 1.375e-4 };
const deckNap = (x) =>
  x < DECK.kneeX
    ? DECK.westNap + ((DECK.crestNap - DECK.k * DECK.kneeX ** 2 - DECK.westNap) * (x - DECK.west)) / (DECK.kneeX - DECK.west)
    : DECK.crestNap - DECK.k * x * x;
const deckZ = (x) => Z(deckNap(x));
// Dek: 6,6 m breed over de randen (BGT), met een romp eronder: een rand van
// 0,5 m en dan schuin naar een vlakke onderkant van 2,8 m breed, 1,8 m onder
// het looppad (op foto's geschat). Leuningen weggelaten.
const HULL = { half: 3.3, edge: 0.5, keelHalf: 1.4, depth: 1.8 };
const deckBottom = (x) => deckZ(x) - HULL.depth;

// Boog (AHN): bovenkant een cirkel met de top op NAP +72,0 m in het midden en
// NAP +57,2 m op 80 m uit het midden (straal 223,6 m); hij raakt het looppad
// 82,7 m uit het midden (luchtfoto: voeten op x = -82,7 en 82,7) en loopt daar
// in het dek. Doorsnede: 2,0 m breed aan de bovenkant, 0,3 m recht en dan onder
// 61 graden of steiler naar een onderkant van 0,9 m; hoogte 1,3 m in de top tot
// 2,1 m bij de voeten (op foto's geschat).
const ARCH = { crownNap: 72.0, refX: 80, refNap: 57.2, end: 85.2, topHalf: 1.0, bottomHalf: 0.45, side: 0.3 };
const ARCH_R =
  (ARCH.refX ** 2 + (ARCH.crownNap - ARCH.refNap) ** 2) / (2 * (ARCH.crownNap - ARCH.refNap));
const archTop = (x) => Z(ARCH.crownNap) - (ARCH_R - Math.sqrt(ARCH_R ** 2 - x * x));
const archDepth = (x) => 1.3 + 0.8 * (Math.min(Math.abs(x), ARCH.end) / ARCH.end) ** 4;
const archBottom = (x) => Math.max(archTop(x) - archDepth(x), deckBottom(x) + 0.3);

// Kabels: acht ankers op de boog, 18 m uit elkaar en symmetrisch rond het
// midden, elk met twee kabels naar het dek, 18 m links en rechts ervan; de
// ankers in het dek liggen recht onder die op de boog plus twee bij de voeten
// (foto's). Op 1:1000 zijn de kabels niet te printen: tussen dek en boog staat
// een scherm van 0,94 m dik met de kabels als banden van 0,9 m. De driehoeken
// onder de kruisingen en de ruiten onder de ankers op de boog zijn doorgaande
// openingen waarvan de top op 52 graden is afgesneden (de kabels zelf lopen
// vlakker), de driehoeken onder de boog met een vlakke bovenkant blinde
// nissen van 0,3 m aan beide zijden.
const ANCHOR_STEP = 18;
const ARCH_ANCHORS = [-63, -45, -27, -9, 9, 27, 45, 63];
const DECK_ANCHORS = [-81, ...ARCH_ANCHORS, 81];
const SCREEN = { half: 0.47, band: 0.9, roof: (52 * Math.PI) / 180, niche: 0.3 };
const cables = [];
for (const xa of ARCH_ANCHORS) {
  for (const xd of [xa - ANCHOR_STEP, xa + ANCHOR_STEP]) {
    if (DECK_ANCHORS.includes(xd)) cables.push({ xa, xd, a: [xa, archBottom(xa)], d: [xd, deckZ(xd)] });
  }
}

// Kolommen (BGT, foto's): twee ronde kolommen van 2,0 m naast elkaar op elke
// oever, recht onder de voet van de boog, met een kop die onder 50 graden
// naar de onderkant van het dek uitloopt.
const PIERS = [-81.7, 81.7];
const COLUMN = { r: 1.0, dy: 0.8, flare: 3.0, flareHalfX: 3.5 };
// Liften (luchtfoto, AHN): glazen schachten van 2,6 × 2,6 m op de as tot
// NAP +61,2 m, met een ronde machinekap van 1,2 m.
const LIFTS = [-88.5, 88.7];
const LIFT = { half: 1.3, topNap: 61.2, capR: 0.6, cap: 0.9 };
// Luie trappen (BGT, AHN): westtrap van x = -112 (NAP +54,71 m) naar de voet in
// het Stadspark op x = -139,4 (zie hieronder); oosttrap van x = 92 (NAP +55,21 m)
// naar Plein 1992 op x = 121,3 (NAP +49,95 m), die 1,2 graden meer naar het
// noorden draait (aan het eind 0,6 m). Onder beide trappen dicht (wangen,
// glazen ruimte onder de oosttrap); wangen van 0,9 × 0,9 m.
// De voet van de westtrap ligt volgens het AHN op NAP +47,13 m, maar PDOK
// tekent het BGT-dek als vlakke weg op NAP +48,0 m tot aan die voet; de trap
// eindigt daarom op NAP +48,25 m, zodat die strook er niet doorheen steekt.
const WEST_STAIR = { x0: -139.4, x1: DECK.west + 0.4, nap0: 48.25, nap1: DECK.westNap, half: 3.33, ahnFootNap: 47.13 };
const EAST_STAIR = { x0: DECK.east - 0.4, x1: 121.3, nap0: deckNap(DECK.east), nap1: 49.95, half: 3.3, shift: 0.6 };
const CHEEK = { width: 0.9, height: 0.9 };
// Krul naar de Maasboulevard (BGT, AHN): een rechte oprit van 3,0 m breed die
// onder 13,3 graden naar het noordwesten van het dek aftakt, en een boog van
// 152 graden met de klok mee rond (-119,65, 18,88) met een straal van 10,2 m
// en 2,5 m breed, naar de stoep op NAP +48,2 m (x = -122,3, y = 28,8). Looppad
// NAP +55,2 m op het dek, +54,5 m op x = -112,7, +52,9 m aan het begin van de
// boog; romp 1,0 m (foto's). Twee kolommen van 1,0 m (BGT).
const CURL = {
  dir: [-0.9729, 0.2309],
  centre: [-119.65, 18.88],
  r: 10.22,
  startAngle: (-103.35 * Math.PI) / 180,
  sweep: (151.9 * Math.PI) / 180,
  straight: 29.8,
  wStraight: 3.0,
  wArc: 2.5,
  depth: 1.0,
  napKnee: 54.5,
  sKnee: 20.25,
  napArc: 52.92,
  napEnd: 48.2,
};
const CURL_COLUMNS = [
  [-114.5, 7.3],
  [-129.5, 19.0],
];

// ---------- dek ----------
const deckXs = [];
for (let x = DECK.west; x < DECK.east; x += 1) deckXs.push(x);
deckXs.push(DECK.east);
const hullSection = (x) => {
  const zt = deckZ(x);
  return [
    [-HULL.keelHalf, zt - HULL.depth],
    [HULL.keelHalf, zt - HULL.depth],
    [HULL.half, zt - HULL.edge],
    [HULL.half, zt],
    [-HULL.half, zt],
    [-HULL.half, zt - HULL.edge],
  ];
};
const deck = loftX(deckXs.map((x) => ({ x, section: hullSection(x) })));

// ---------- boog ----------
const archXs = [];
for (let x = -ARCH.end; x < ARCH.end; x += 0.5) archXs.push(+x.toFixed(3));
archXs.push(ARCH.end);
const arch = loftX(
  archXs.map((x) => {
    const zt = archTop(x);
    const zb = archBottom(x);
    return {
      x,
      section: [
        [-ARCH.bottomHalf, zb],
        [ARCH.bottomHalf, zb],
        [ARCH.topHalf, zt - ARCH.side],
        [ARCH.topHalf, zt],
        [-ARCH.topHalf, zt],
        [-ARCH.topHalf, zt - ARCH.side],
      ],
    };
  }),
);

// ---------- scherm met kabelvelden ----------
// Venster tussen het looppad en de onderkant van de boog, tussen de punten
// waar die elkaar raken.
function meet(side) {
  let lo = 0;
  let hi = side * ARCH.end;
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    if (archBottom(m) > deckZ(m)) lo = m;
    else hi = m;
  }
  return lo;
}
const winX0 = meet(-1);
const winX1 = meet(1);
const winXs = [];
for (let i = 0; i <= 340; i++) winXs.push(winX0 + ((winX1 - winX0) * i) / 340);
const windowPoly = [
  ...winXs.map((x) => [x, deckZ(x)]),
  ...[...winXs].reverse().map((x) => [x, archBottom(x)]),
];
let regions = [windowPoly];
for (const { a, d } of cables) {
  regions = regions.flatMap((pg) => {
    const xs = pg.map(([x]) => x);
    const lo = Math.min(a[0], d[0]);
    const hi = Math.max(a[0], d[0]);
    if (Math.max(...xs) < lo || Math.min(...xs) > hi) return [pg];
    return splitPolygon(pg, d, a);
  });
}
const onArch = (p) => Math.abs(p[1] - archBottom(p[0])) < 2e-3;
const openings = [];
const niches = [];
for (const region of regions) {
  // Lengte van de rand langs de boog: een vlakke bovenkant maakt er een nis van.
  let archEdge = 0;
  for (let i = 0; i < region.length; i++) {
    const p = region[i];
    const q = region[(i + 1) % region.length];
    if (onArch(p) && onArch(q)) archEdge += Math.hypot(q[0] - p[0], q[1] - p[1]);
  }
  let poly = inset(ccw(convexHull(region)), SCREEN.band / 2);
  if (poly.length < 3) continue;
  if (archEdge > 1) {
    if (Math.abs(signedArea(poly)) > 2 && Math.max(...poly.map(([, z]) => z)) - Math.min(...poly.map(([, z]) => z)) > 1) {
      niches.push(poly);
    }
    continue;
  }
  const apex = poly.reduce((m, p) => (p[1] > m[1] ? p : m));
  const t = Math.tan(SCREEN.roof);
  // z <= apexZ - t (x - apexX) en z <= apexZ + t (x - apexX)
  poly = clipHalfPlane(poly, t, 1, apex[1] + t * apex[0]);
  poly = clipHalfPlane(poly, -t, 1, apex[1] - t * apex[0]);
  if (poly.length < 3) continue;
  const xs = poly.map(([x]) => x);
  const zs = poly.map(([, z]) => z);
  if (Math.abs(signedArea(poly)) > 2 && Math.max(...zs) - Math.min(...zs) > 1.2 && Math.max(...xs) - Math.min(...xs) > 1.5) {
    openings.push(poly);
  }
}
const screenXs = winXs;
let screen = profileY(
  [
    ...screenXs.map((x) => [x, deckZ(x) - 0.3]),
    ...[...screenXs].reverse().map((x) => [x, archBottom(x) + 0.3]),
  ],
  -SCREEN.half,
  SCREEN.half,
);
const holes = openings.map((pg) => profileY(pg, -SCREEN.half - 0.5, SCREEN.half + 0.5));
const nicheCuts = niches.flatMap((pg) => [
  profileY(pg, SCREEN.half - SCREEN.niche, SCREEN.half + 0.5),
  profileY(pg, -SCREEN.half - 0.5, -SCREEN.half + SCREEN.niche),
]);
screen = screen.subtract(union([...holes, ...nicheCuts]));

// ---------- kolommen, liften ----------
const columns = PIERS.map((x) => {
  const top = deckBottom(x) + 0.3;
  const shafts = [-1, 1].map((s) =>
    Manifold.cylinder(top - BASE, COLUMN.r, COLUMN.r, 32, false).translate([x, s * COLUMN.dy, BASE]),
  );
  const zb = deckBottom(x);
  const slice = Manifold.hull(
    [-1, 1].map((s) =>
      Manifold.cylinder(0.01, COLUMN.r, COLUMN.r, 32, false).translate([x, s * COLUMN.dy, zb - COLUMN.flare]),
    ),
  );
  const head = Manifold.hull([
    slice,
    boxFromTo(x - COLUMN.flareHalfX, x + COLUMN.flareHalfX, -HULL.keelHalf, HULL.keelHalf, zb - 0.01, zb + 0.5),
  ]);
  return union([...shafts, head]);
});
const lifts = LIFTS.map((x) =>
  union([
    boxFromTo(x - LIFT.half, x + LIFT.half, -LIFT.half, LIFT.half, BASE, Z(LIFT.topNap)),
    Manifold.cylinder(LIFT.cap + 0.05, LIFT.capR, LIFT.capR, 32, false).translate([x, 0, Z(LIFT.topNap) - 0.05]),
  ]),
);

// ---------- trappen ----------
// Stations, looppad en as van een trap.
function stairFrame({ x0, x1, nap0, nap1, shift = 0 }) {
  const n = Math.max(2, Math.round((x1 - x0) / 1));
  const top = (x) => Z(nap0 + ((nap1 - nap0) * (x - x0)) / (x1 - x0));
  const yc = (x) => (shift * (x - x0)) / (x1 - x0);
  const xs = Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
  return { xs, top, yc };
}
// Wangen van een trap; met margin aan alle kanten groter en tot `down` onder
// het looppad (voor het uitsparen van de wegdeklaag).
function cheeksOf(cfg, margin = 0, down = 0.3) {
  const { xs, top, yc } = stairFrame(cfg);
  return [-1, 1].map((s) =>
    loftX(
      xs.map((x) => {
        const o = yc(x) + s * (cfg.half - CHEEK.width / 2);
        const w = CHEEK.width / 2 + margin;
        return {
          x,
          section: [
            [o - w, top(x) - down],
            [o + w, top(x) - down],
            [o + w, top(x) + CHEEK.height + margin],
            [o - w, top(x) + CHEEK.height + margin],
          ],
        };
      }),
    ),
  );
}
function stair(cfg) {
  const { half } = cfg;
  const { xs, top, yc } = stairFrame(cfg);
  const body = loftX(
    xs.map((x) => ({
      x,
      section: [
        [yc(x) - half, BASE],
        [yc(x) + half, BASE],
        [yc(x) + half, top(x)],
        [yc(x) - half, top(x)],
      ],
    })),
  );
  return union([body, ...cheeksOf(cfg)]);
}
const westStair = stair(WEST_STAIR);
const eastStair = stair(EAST_STAIR);

// ---------- krul naar de Maasboulevard ----------
const T = [
  CURL.centre[0] + CURL.r * Math.cos(CURL.startAngle),
  CURL.centre[1] + CURL.r * Math.sin(CURL.startAngle),
];
const S = [T[0] - CURL.straight * CURL.dir[0], T[1] - CURL.straight * CURL.dir[1]];
const curlNapStart = deckNap(S[0]);
const curlLength = CURL.straight + CURL.r * CURL.sweep;
const curlNap = (s) =>
  s <= CURL.sKnee
    ? curlNapStart + ((CURL.napKnee - curlNapStart) * s) / CURL.sKnee
    : s <= CURL.straight
      ? CURL.napKnee + ((CURL.napArc - CURL.napKnee) * (s - CURL.sKnee)) / (CURL.straight - CURL.sKnee)
      : CURL.napArc + ((CURL.napEnd - CURL.napArc) * (s - CURL.straight)) / (CURL.r * CURL.sweep);
const curlWidth = (s) =>
  s <= CURL.straight ? CURL.wStraight : CURL.wArc + (CURL.wStraight - CURL.wArc) * Math.max(0, 1 - (s - CURL.straight) / 5);
const curlStations = [];
for (let s = 0; s < CURL.straight; s += 1) {
  curlStations.push({ s, x: S[0] + s * CURL.dir[0], y: S[1] + s * CURL.dir[1], dx: CURL.dir[0], dy: CURL.dir[1] });
}
const arcSteps = Math.round((CURL.sweep * 180) / Math.PI / 3);
for (let i = 0; i <= arcSteps; i++) {
  const ang = CURL.startAngle - (CURL.sweep * i) / arcSteps;
  curlStations.push({
    s: CURL.straight + (CURL.r * CURL.sweep * i) / arcSteps,
    x: CURL.centre[0] + CURL.r * Math.cos(ang),
    y: CURL.centre[1] + CURL.r * Math.sin(ang),
    dx: Math.sin(ang),
    dy: -Math.cos(ang),
  });
}
const curl = loftPath(
  curlStations.map(({ s, x, y, dx, dy }) => {
    const h = Z(curlNap(s));
    const w = curlWidth(s) / 2;
    return { x, y, dx, dy, section: [[-w, h - CURL.depth], [w, h - CURL.depth], [w, h], [-w, h]] };
  }),
);
const curlBottomAt = ([px, py]) => {
  const st = curlStations.reduce((a, b) => (Math.hypot(b.x - px, b.y - py) < Math.hypot(a.x - px, a.y - py) ? b : a));
  return Z(curlNap(st.s)) - CURL.depth;
};
const curlColumns = CURL_COLUMNS.map(([x, y]) =>
  Manifold.cylinder(curlBottomAt([x, y]) + 0.3 - BASE, 0.5, 0.5, 32, false).translate([x, y, BASE]),
);

const bridge = union([deck, arch, screen, ...columns, ...lifts, westStair, eastStair, curl, ...curlColumns]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek en de krul hangen vrij. Net als de overhangopvulling van de export
// krijgt de STL daaronder een wig van 50 graden vanaf de rand van het dek die
// uitloopt in een scherm van 0,9 m tot de onderplaat.
const FOOT = { screen: 0.45, slope: Math.tan((50 * Math.PI) / 180) };
function footSection(w, zEdge) {
  const zs = zEdge - FOOT.slope * (w - FOOT.screen);
  if (zs > BASE + 0.05) {
    return [[FOOT.screen, BASE], [FOOT.screen, zs], [w, zEdge], [-w, zEdge], [-FOOT.screen, zs], [-FOOT.screen, BASE]];
  }
  const a = Math.max(w - (zEdge - BASE) / FOOT.slope, 0.05);
  return [[a, BASE], [a + 1e-3, BASE + 1e-3], [w, zEdge], [-w, zEdge], [-a - 1e-3, BASE + 1e-3], [-a, BASE]];
}
const deckFoot = loftX(
  deckXs.map((x) => ({
    x,
    section: footSection(HULL.half + 0.02, deckZ(x) - HULL.edge + 0.02)
      .map(([y, z]) => [-y, z])
      .reverse(),
  })),
);
const curlFoot = loftPath(
  curlStations.map(({ s, x, y, dx, dy }) => ({
    x,
    y,
    dx,
    dy,
    section: footSection(curlWidth(s) / 2 + 0.02, Z(curlNap(s)) - CURL.depth + 0.02),
  })),
);
const printFoot = union([deckFoot, curlFoot]);
const printModel = union([bridge, printFoot]);

// ---------- voetpad, fietspad en trappen als eigen onderdelen ----------
// De bovenste 0,5 m van dek, trappen en krul is per BGT-functie een eigen node
// met de attributen van het BGT-wegdeel (glTF `extras.attributes`), zodat de
// kleurregels van een thema (bijvoorbeeld fietspaden rood) op de brug werken
// zoals op de PDOK-wegdelen ernaast. Actuele BGT-wegdelen met relatieve
// hoogteligging 1 (lokaal stelsel, vereenvoudigd tot 5 cm):
// - G0935.8507e7891ad740d28b7b200f822495a0: voetpad, gesloten verharding,
//   asfalt; het dek van x = -112,2 tot 90,7 (ten noorden van de boog en buiten
//   de voeten van de boog over de hele breedte) en het rechte deel van de krul
//   tot x = -112,7, met gaten voor de twee liften.
// - G0935.86ca0cd4da954494b1dbd5fd39f106ff: fietspad, gesloten verharding,
//   asfalt; de zuidelijke helft van het dek tussen de voeten van de boog.
// - G0935.987436e5cae346a68e11c643f1ae6bc5, G0935.b87ac6f0b6994ee6945e3682f5b68273
//   en G0935.dc981a4083aa400db55dde5513b67868: voetpad op trap, open
//   verharding, beton element; de westtrap, de boog van de krul en de oosttrap.
const LAYER = 0.5;
// De strook loopt tot 1 m boven het looppad door, zodat hij het hele bovenvlak
// uit de constructie snijdt (anders een vlak zonder dikte dat met het wegdeel
// vecht), en 0,1 m buiten de randen; het wegdeel is de strook binnen de brug.
const ABOVE = 1.0;
const SIDE = 0.1;
const FOOTPATH_ATTRIBUTES = {
  bgt_functie: "voetpad",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_ATTRIBUTES = {
  bgt_functie: "fietspad",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const STAIR_ATTRIBUTES = {
  bgt_functie: "voetpad op trap",
  bgt_fysiekvoorkomen: "open verharding",
  plus_fysiekvoorkomen: "beton element",
};
// Grenzen tussen de BGT-vlakken, verlengd tot buiten het model (de buitenranden
// van de BGT-vlakken vallen op de randen van dek en trappen):
// - fietspad: tussen de dwarsgrenzen (-82,61, -3,31)-(-82,63, -0,80) en
//   (82,37, -3,46)-(82,43, -0,64), ten zuiden van de as. De BGT legt de grens
//   met het voetpad 0,6 tot 0,8 m ten zuiden van de as, op de flank van de boog;
//   hier ligt hij op de as, binnen het scherm en de boog, zodat er geen strook
//   voetpad van 0,2 m tussen boog en fietspad overblijft.
// - voetpad op trap: ten westen van (-112,18, -3,28)-(-112,17, 3,17) (westtrap)
//   en van (-112,66, 5,40)-(-111,95, 8,35) (krul), ten oosten van
//   (90,75, -3,47)-(90,70, 3,34) (oosttrap).
const BIKE_REGION = [
  [-82.557, -10],
  [82.231, -10],
  [82.444, 0],
  [-82.636, 0],
];
const STAIR_REGIONS = [
  [
    [-112.18, -10],
    [-112.17, 4.2],
    [-112.95, 4.2],
    [-111.5, 10.2],
    [-111.5, 40],
    [-160, 40],
    [-160, -10],
  ],
  [
    [90.798, -10],
    [130, -10],
    [130, 10],
    [90.651, 10],
  ],
];
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const band = (x, zt, l0, l1) => ({ x, section: [[l0, zt - LAYER], [l1, zt - LAYER], [l1, zt + ABOVE], [l0, zt + ABOVE]] });
const deckStrip = loftX(deckXs.map((x) => band(x, deckZ(x), -HULL.half - SIDE, HULL.half + SIDE)));
// De rand van de romp is 0,5 m hoog en loopt daaronder schuin naar binnen: een
// laag van 0,5 m zou de constructie aan de dekrand op een mes laten eindigen
// (boven- en onderkant binnen 1 cm). Langs de randen gaat de strook daarom
// 0,3 m breed tot 0,8 m onder het looppad, zodat de constructie daar met een
// staande kant van 0,2 m ophoudt en het wegdeel de hoek van de romp krijgt.
const EDGE = { inner: 3.0, depth: 0.8 };
const deckEdgeStrips = [-1, 1].map((s) =>
  loftX(
    deckXs.map((x) => {
      const zt = deckZ(x);
      const [l0, l1] = s > 0 ? [EDGE.inner, HULL.half + SIDE] : [-HULL.half - SIDE, -EDGE.inner];
      return { x, section: [[l0, zt - EDGE.depth], [l1, zt - EDGE.depth], [l1, zt + ABOVE], [l0, zt + ABOVE]] };
    }),
  ),
);
const stairStrip = (cfg) => {
  const { xs, top, yc } = stairFrame(cfg);
  return loftX(xs.map((x) => band(x, top(x), yc(x) - cfg.half - SIDE, yc(x) + cfg.half + SIDE)));
};
const curlStrip = loftPath(
  curlStations.map(({ s, x, y, dx, dy }) => {
    const w = curlWidth(s) / 2 + SIDE;
    const h = Z(curlNap(s));
    return { x, y, dx, dy, section: [[-w, h - LAYER], [w, h - LAYER], [w, h + ABOVE], [-w, h + ABOVE]] };
  }),
);
// Wat boven het looppad uitsteekt blijft constructie, met 2 cm vrij: de boog
// zolang hij boven het dek uitkomt, het hele scherm (ook onder de openingen),
// de liften en de wangen van de trappen (tot onder de wegdeklaag).
function offsetConvex(poly, d) {
  const n = poly.length;
  const lines = poly.map((p, i) => {
    const q = poly[(i + 1) % n];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const nx = (q[1] - p[1]) / len;
    const ny = -(q[0] - p[0]) / len;
    return [nx, ny, nx * p[0] + ny * p[1] + d];
  });
  return poly.map((_, i) => {
    const [a1, b1, c1] = lines[(i + n - 1) % n];
    const [a2, b2, c2] = lines[i];
    const det = a1 * b2 - a2 * b1;
    return [(c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det];
  });
}
// Waar de bovenkant van de boog het looppad snijdt (daarbuiten ligt de boog in
// het dek).
function archEmerges(side) {
  let lo = 75;
  let hi = ARCH.end;
  for (let k = 0; k < 60; k++) {
    const m = (lo + hi) / 2;
    if (archTop(side * m) > deckZ(side * m)) lo = m;
    else hi = m;
  }
  return side * lo;
}
const archGuard = loftX(
  archXs.map((x) => {
    const zt = archTop(x);
    const zb = archBottom(x);
    const section = [
      [-ARCH.bottomHalf, zb],
      [ARCH.bottomHalf, zb],
      [ARCH.topHalf, zt - ARCH.side],
      [ARCH.topHalf, zt],
      [-ARCH.topHalf, zt],
      [-ARCH.topHalf, zt - ARCH.side],
    ];
    return { x, section: offsetConvex(section, 0.02) };
  }),
)
  // Waar de flank van de boog door de wegdeklaag loopt, recht naar beneden
  // vanaf de breedte van de boog op het looppad (anders een wig wegdek onder
  // de flank die op nul uitloopt).
  .add(
    loftX(
      archXs.map((x) => {
        const zt = archTop(x);
        const zb = archBottom(x);
        const zd = deckZ(x);
        const t = Math.min(1, Math.max(0, (zd - zb) / (zt - ARCH.side - zb)));
        // 5 cm vrij: de 2 cm schuin van de flank is op het looppad al iets breder.
        const w = ARCH.bottomHalf + (ARCH.topHalf - ARCH.bottomHalf) * t + 0.05;
        return { x, section: [[-w, zd - LAYER - 0.1], [w, zd - LAYER - 0.1], [w, zd + 0.01], [-w, zd + 0.01]] };
      }),
    ),
  )
  .intersect(boxFromTo(archEmerges(-1), archEmerges(1), -5, 5, BASE - 1, 40));
// Het scherm en de strook onder de boog tot onder de wegdeklaag, ook waar de
// onderkant van de boog bij de voeten door de laag in het dek loopt.
const guardXs = [];
for (let x = archEmerges(-1); x < archEmerges(1); x += 0.25) guardXs.push(x);
guardXs.push(archEmerges(1));
const screenGuard = profileY(
  [
    ...guardXs.map((x) => [x, deckZ(x) - LAYER - 0.1]),
    ...[...guardXs].reverse().map((x) => [x, Math.max(archBottom(x) + 0.3, deckZ(x))]),
  ],
  -SCREEN.half - 0.02,
  SCREEN.half + 0.02,
);
const liftGuards = LIFTS.map((x) =>
  boxFromTo(x - LIFT.half - 0.02, x + LIFT.half + 0.02, -LIFT.half - 0.02, LIFT.half + 0.02, BASE - 1, Z(LIFT.topNap) + 2),
);
const cheekGuards = [WEST_STAIR, EAST_STAIR].flatMap((cfg) => cheeksOf(cfg, 0.02, EDGE.depth + 0.1));
const notLayer = union([archGuard, screenGuard, ...liftGuards, ...cheekGuards]);
const layerCut = union([deckStrip, ...deckEdgeStrips, stairStrip(WEST_STAIR), stairStrip(EAST_STAIR), curlStrip]).subtract(
  notLayer,
);
const bikeRegion = prism(BIKE_REGION, BASE - 1, 100);
const stairRegion = union(STAIR_REGIONS.map((poly) => prism(poly, BASE - 1, 100)));
const footCut = layerCut.subtract(bikeRegion).subtract(stairRegion);
const bikeCut = layerCut.intersect(bikeRegion);
const stairCut = layerCut.intersect(stairRegion);
const footway = footCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const stairway = stairCut.intersect(bridge);
const structure = bridge.subtract(layerCut);
const parts = [
  ["building:hoge-brug", structure],
  ["road:voetpad", footway, FOOTPATH_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
  ["road:voetpad-op-trap", stairway, STAIR_ATTRIBUTES],
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


// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant.
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
    found.push({ p, area: len / 2 });
  }
  return { area, found };
}
// Een overhangend vlak in het scherm hoort bij de bovenkant van een blinde nis.
const inNicheTop = (p) => {
  const c = [0, 1, 2].map((a) => (p[0][a] + p[1][a] + p[2][a]) / 3);
  if (Math.abs(c[1]) < SCREEN.half - SCREEN.niche - 0.01 || Math.abs(c[1]) > SCREEN.half + 0.01) return false;
  return niches.some((pg) => {
    // Binnen de nis of op hoogstens 5 cm van de rand (de bovenkant zelf).
    let inside = true;
    for (let i = 0; i < pg.length; i++) {
      const p = pg[i];
      const q = pg[(i + 1) % pg.length];
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (len < 1e-9) continue;
      if (cross(p, q, [c[0], c[2]]) / len < -0.05) inside = false;
    }
    return inside;
  });
};
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  const model = overhangs(bridge);
  console.log("vrij hangend in het model (m2):", Math.round(model.area));
  const print = overhangs(printModel);
  let niche = 0;
  const rest = [];
  for (const f of print.found) {
    if (inNicheTop(f.p)) niche += f.area;
    else rest.push(f);
  }
  const restArea = rest.reduce((a, f) => a + f.area, 0);
  console.log("overhang in de printversie (m2): nisbovenkanten", +niche.toFixed(1), "overig", +restArea.toFixed(2));
  if (restArea > 1) {
    const worst = rest.sort((a, b) => b.area - a.area).slice(0, 5);
    for (const f of worst) console.log("  overhang bij", f.p[0].map((c) => +c.toFixed(2)), +f.area.toFixed(2));
    throw new Error("printversie heeft overhang buiten de nissen");
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
report.arch = {
  radius: +ARCH_R.toFixed(1),
  crownNap: ARCH.crownNap,
  meetsDeckX: [+winX0.toFixed(2), +winX1.toFixed(2)],
  cables: cables.length,
  openings: openings.length,
  niches: niches.length,
  openingTopsNap: openings.map((pg) => +(Math.max(...pg.map(([, z]) => z)) + WATER_NAP).toFixed(1)),
};
report.curl = {
  start: S.map((c) => +c.toFixed(2)),
  tangent: T.map((c) => +c.toFixed(2)),
  end: [
    +(CURL.centre[0] + CURL.r * Math.cos(CURL.startAngle - CURL.sweep)).toFixed(2),
    +(CURL.centre[1] + CURL.r * Math.sin(CURL.startAngle - CURL.sweep)).toFixed(2),
  ],
  lengthM: +curlLength.toFixed(1),
  napStart: +curlNapStart.toFixed(2),
};
const glbFile = path.join(outDir, "hoge-brug-maastricht.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-hoge-brug-maastricht.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van kolommen, trappen, liften en printvoet op
// het printbed.
const stlName = `hoge-brug-maastricht-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Hoge Brug Maastricht 1:${scale} mm Z-up`);
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
// Maaiveld op het water van de Maas naast de brug, 15 m naast de as.
const samplePoints = [-60, -20, 20, 55].flatMap((x) => [
  [x, 15],
  [x, -15],
]);
await writeFile(
  path.join(outDir, "hoge-brug-maastricht.json"),
  JSON.stringify(
    {
      name: "Hoge Brug",
      file: "hoge-brug-maastricht.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [176847.78, 317422.23],
      xAxis: [0.98881, 0.14919],
      groundOffsetMetres: 0,
      // Ellipsoïdische hoogte van het PDOK-water van de Maas op de
      // bemonsteringspunten (NAP +44,0 m), als terugval voor een uitsnede die
      // alleen een oever raakt.
      groundHeight: 89.9,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het BGT-dek midden onder de top van de boog op de waterspiegel van de Maas (z = 0, NAP +44,0 m) in de oorsprong, +X langs de brug naar Plein 1992 in Céramique (RD-richting 8,58 graden vanaf het oosten) en +Y stroomafwaarts naar het noordnoordwesten. Vier nodes: road:voetpad, road:fietspad en road:voetpad-op-trap, de bovenste 0,5 m van dek, trappen en krul met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie voetpad, fietspad of voetpad op trap; bgt_fysiekvoorkomen gesloten of open verharding; plus_fysiekvoorkomen asfalt of beton element), zodat de kleurregels van een thema erop werken (het fietspad is de zuidelijke helft van het dek tussen de voeten van de boog, het voetpad de rest van het dek en het rechte deel van de krul, voetpad op trap de luie trappen en de boog van de krul); en building: de rest van de brug, met het dek van 6,6 m breed met een romp van 1,8 m, waarvan het looppad van NAP +54,7 m boven de Maasboulevard naar +56,4 m in het midden en +55,2 m bij Plein 1992 loopt; de stalen boog in het hart van het dek met de top op NAP +72,0 m, die het dek 82,7 m uit het midden raakt; tussen dek en boog een scherm van 0,94 m met de gekruiste kabels als banden en spitse openingen en blinde nissen ertussen; op elke oever twee ronde kolommen met een uitlopende kop onder de voet van de boog en een glazen lift op de as tot NAP +61,2 m; de luie trappen naar het Stadspark (x = -139,4, NAP +48,25 m; het AHN geeft +47,1 m, maar PDOK legt daar het BGT-dek als vlakke weg op +48,0 m) en Plein 1992 (x = 121,3, NAP +50,0 m) met wangen, dicht tot de onderkant; aan de stadskant de krul van 2,5 tot 3 m breed die met een boog van 152 graden naar de stoep van de Maasboulevard afdaalt (NAP +48,2 m), op twee kolommen. De kabels, leuningen en lantaarns zijn als zodanig weggelaten; de export vult onder het dek en de krul een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd, met het PDOK-water (89,9 m ellipsoïdisch) als terugval. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_STAIR.x1 - WEST_STAIR.x0).toFixed(1),
        deckWidthM: HULL.half * 2,
        hullDepthM: HULL.depth,
        archSpanAtDeckM: +(winX1 - winX0).toFixed(1),
        archCrownNapM: ARCH.crownNap,
        archRadiusM: +ARCH_R.toFixed(1),
        archAnchorStepM: ANCHOR_STEP,
        deckNapM: { stadspark: DECK.westNap, crest: DECK.crestNap, ceramique: +deckNap(DECK.east).toFixed(2) },
        stairFootNapM: { stadspark: WEST_STAIR.nap0, stadsparkAhn: WEST_STAIR.ahnFootNap, plein1992: EAST_STAIR.nap1 },
        liftTopNapM: LIFT.topNap,
        curlRadiusM: CURL.r,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Hoge_Brug_(Maastricht)",
        "PDOK BGT overbruggingsdeel (dek met trappen en krul, kolommen), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het looppad, de trappen, de krul, de boog, de liften en het maaiveld",
        "PDOK luchtfoto 8 cm (liften, voeten van de boog)",
        "Rijkswaterstaat: stuwpeil Borgharen (NAP +44,0 m)",
        "Wikimedia Commons: Maastricht - Hoge Brug en Céramique - 2022-11-11.jpg, Hoge Brug two from SW Maastricht the Netherlands August 10 2024.jpg, Maastricht, Maasboulevard, lift Hoge Brug.jpg, 20130504 Maastricht Céramique 04 Hoge Brug stairs.JPG, Maastricht - trap naar Hoge Brug in stadspark (De Boompjes) 20200607.jpg, 20130504 Maastricht Céramique 26 Underside of Hoge Brug.JPG",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van de Alexander Ver Huellbrug
// (de IJsselbrug in de N317 bij Doesburg, 1951): een stalen boogbrug met
// trekband over de IJssel tussen Ellecom en Doesburg, met de hoofdoverspanning
// van 89,3 m (twee bogen op de hoofdliggers, tien hangers per boog), twee
// zijoverspanningen van circa 24 m naar de landhoofden in de dijken, de twee
// rivierpijlers (gemetselde voet met twee betonnen kolommen) en het dek met de
// hoofdliggers die boven het wegdek uitsteken en de fiets- en voetpaden op
// consoles aan de buitenkant. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, drie nodes met de
// materiaalklasse in de nodenaam: de constructie, en de rijbaan en de
// fietspaden als bovenste 0,5 m van het dek met de BGT-attributen) als
// catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal> met een printvoet onder het
// dek.
//
//   node scripts/generate-alexander-ver-huellbrug.mjs              # 1:1000 (standaard)
//   node scripts/generate-alexander-ver-huellbrug.mjs --scale 500
//
// Assenstelsel: oorsprong op de as van het BGT-dek midden tussen de twee
// rivierpijlers (RD 205964,41, 448145,60), op de waterspiegel van de IJssel
// zoals het AHN hem zag (NAP +6,25 m), Z omhoog. +X loopt langs de brug naar
// Doesburg (oostzuidoost, RD-richting -28,06 graden vanaf het oosten), +Y
// stroomafwaarts naar het noordnoordoosten. Het westelijke landhoofd (Ellecom)
// ligt op x = -70,6, het oostelijke (Doesburg) op x = 70,2.
//
// Bronnen: BGT overbruggingsdeel (dek 140,9 × 16,2 m, pijlers van 4,0 × 16,8 m
// met ronde koppen op 89,2 m hart op hart, landhoofden); AHN DSM 0,5 m (PDOK
// WCS) voor het lengteprofiel van het wegdek (NAP +18,4 m aan de landhoofden,
// +19,34 m in het midden), de fiets- en voetpaden (0,16 m lager), de bogen
// (4,35 m naast de as, top NAP +32,2 m, cirkelvormig met een straal van circa
// 85,5 m) en de waterspiegel; de PDOK-luchtfoto voor de hangerafstand (elf
// velden van 8,1 m, gemeten aan de dwarsstijlen van het windverband);
// Structurae (hoofdoverspanning 89,32 m, breedte 15,5 m, lengte 138 m, 1951);
// Wikimedia Commons-foto's (IJsselbrug Doesburg.jpg; Brug Doesburg.jpg;
// Provinciale weg 317 (brug Doesburg).jpg; Nieuwe brug in Doesburg,
// Bestanddeelnr 904-9107 en 904-9110) voor het brugtype, de hangers, de
// hoofdliggers boven het dek, de consoles, de pijlers en de doorvaarthoogteschaal.
// Geschat (foto's): de constructiehoogte van het dek (1,9 m), de hoogte van de
// hoofdliggers boven het wegdek (0,9 m), de boogdiepte (1,4 m), de bovenkant
// van de gemetselde pijlervoet (NAP +11,3 m) en de kolommaten.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "alexander-ver-huellbrug");
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
// Band tussen twee functies van x (onder en boven) op de stations xs,
// uitgetrokken langs Y.
function bandY(xs, bottom, top, y0, y1) {
  const pts = [...xs.map((x) => [x, bottom(x)]), ...[...xs].reverse().map((x) => [x, top(x)])];
  return profileY(pts, y0, y1);
}
const stations = (x0, x1, step, extra = []) =>
  [...Array.from({ length: Math.round((x1 - x0) / step) + 1 }, (_, i) => x0 + ((x1 - x0) * i) / Math.round((x1 - x0) / step)), ...extra]
    .filter((x) => x >= x0 - 1e-9 && x <= x1 + 1e-9)
    .sort((a, b) => a - b)
    .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-4);
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in gezien vanaf +X, steeds evenveel punten).
function loftX(list) {
  const n = list[0].section.length;
  const verts = [];
  for (const { x, section } of list) for (const [y, z] of section) verts.push(x, y, z);
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < list.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = list.length - 1;
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
// Pijlervoet met ronde koppen (BGT): rechthoek in x, halfronde koppen in y.
function roundedPier(x0, x1, y0, y1, z0, z1) {
  const r = (x1 - x0) / 2;
  const xc = (x0 + x1) / 2;
  const h = z1 - z0;
  return Manifold.hull([
    Manifold.cylinder(h, r, r, 32, false).translate([xc, y0 + r, z0]),
    Manifold.cylinder(h, r, r, 32, false).translate([xc, y1 - r, z0]),
  ]);
}

// ---------- hoofdmaten (boven de waterspiegel, NAP +6,25 m) ----------
const WATER_NAP = 6.25;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de IJssel circa 0,3 m hoger dan het AHN (NAP +6,55 m
// met de geoïde van de dijkweg); -0,3 zet het wegdek op zijn NAP-hoogte.
const GROUND_OFFSET = -0.3;

// Dek (BGT): van het westelijke tot het oostelijke landhoofd, 16,2 m breed.
const WEST_END = -70.63;
const EAST_END = 70.23;
const WEST_FACE = -68.37; // voorzijde van het westelijke landhoofd (BGT)
const EAST_FACE = 68.5; // voorzijde van het oostelijke landhoofd (BGT)
const DECK_HALF = 8.11;

// Wegdek in NAP-meters om de 2 m vanaf x = -73: 25e percentiel van het
// AHN-DSM over 6 m rond de as, licht gladgestreken.
const DECK_NAP = [
  18.41, 18.43, 18.45, 18.49, 18.53, 18.57, 18.6, 18.64, 18.68, 18.71, 18.75, 18.78, 18.81, 18.84, 18.89,
  18.92, 18.96, 18.99, 19.03, 19.06, 19.1, 19.13, 19.16, 19.18, 19.2, 19.22, 19.25, 19.27, 19.28, 19.28,
  19.3, 19.32, 19.33, 19.34, 19.34, 19.34, 19.34, 19.33, 19.34, 19.34, 19.33, 19.33, 19.33, 19.31, 19.29,
  19.27, 19.26, 19.24, 19.22, 19.19, 19.17, 19.14, 19.12, 19.1, 19.07, 19.03, 18.99, 18.95, 18.91, 18.88,
  18.84, 18.8, 18.76, 18.73, 18.7, 18.66, 18.63, 18.59, 18.55, 18.51, 18.48, 18.44, 18.41, 18.38,
];
function deckZ(x) {
  const f = Math.min(Math.max((x + 73) / 2, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return Z(DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t);
}
// Doorsnede van het dek (foto's, AHN): de rijbaan tussen de twee
// hoofdliggers, de liggers 4,35 m naast de as (1 m breed, 0,9 m boven het
// wegdek, onder de bogen), en daarbuiten de fiets- en voetpaden 0,16 m lager
// op consoles die van de onderkant van de hoofdligger schuin naar een
// randbalk van 0,6 m lopen.
const DECK = {
  depth: 1.9, // wegdek tot onderkant hoofdliggers (geschat)
  girderY: 4.35,
  girderHalf: 0.5,
  girderUp: 0.9, // bovenkant hoofdligger boven het wegdek (geschat, AHN 0,75)
  pathDrop: 0.16, // fiets- en voetpad lager dan de rijbaan (AHN)
  edge: 0.6, // randbalk aan de buitenkant
};
const GIRDER_OUT = DECK.girderY + DECK.girderHalf;
const GIRDER_IN = DECK.girderY - DECK.girderHalf;
const deckBottom = (x) => deckZ(x) - DECK.depth;
const girderTop = (x) => deckZ(x) + DECK.girderUp;

// Pijlers (BGT): gemetselde voet met ronde koppen tot NAP +11,3 m (foto's:
// de doorvaarthoogteschaal loopt van 11 m bij het water tot 7 m aan de
// bovenkant van het metselwerk), daarop onder elke hoofdligger een betonnen
// kolom met een afgeschuinde oplegblok tot onder het dek.
const PIERS = [
  { x0: -46.63, x1: -42.61, y0: -8.14, y1: 8.63 },
  { x0: 42.63, x1: 46.61, y0: -8.55, y1: 8.34 },
];
const PIER_BRICK_TOP = Z(11.3);
const COLUMN = { halfX: 1.4, halfY: 1.7, capHalfX: 1.0, capHalfY: 1.3, cap: 0.5, bearing: 1.0 };
const SPRING = 44.62; // hart van de pijlers, waar de bogen op de liggers staan

// Bogen (AHN): bovenrand een veelhoek door de knopen van de elf velden op een
// cirkel met straal 85,5 m, met het bovenste veld vlak op NAP +32,2 m; aan de
// pijlers komt de bovenrand op de bovenkant van de hoofdligger uit. De boog
// is een kokerligger van 1,4 m hoog (foto) en 1 m breed.
const ARCH = { crown: 32.2, radius: 85.5, depth: 1.4, panels: 11 };
const sag = (x) => ARCH.radius - Math.sqrt(ARCH.radius ** 2 - x * x);
const nodeX = Array.from({ length: ARCH.panels + 1 }, (_, k) => -SPRING + (2 * SPRING * k) / ARCH.panels);
const nodeTop = nodeX.map((x) => Z(ARCH.crown) - (sag(x) - sag(nodeX[5])));
function upper(x) {
  if (x <= nodeX[0]) return nodeTop[0];
  for (let k = 0; k < ARCH.panels; k++) {
    if (x <= nodeX[k + 1]) {
      const t = (x - nodeX[k]) / (nodeX[k + 1] - nodeX[k]);
      return nodeTop[k] * (1 - t) + nodeTop[k + 1] * t;
    }
  }
  return nodeTop[ARCH.panels];
}
const archLower = (x) => upper(x) - ARCH.depth;
// Hangers op de tien binnenste knopen. Op 1:1000 is elke hanger een stijl
// van 1 m en de ruimte tussen hoofdligger en boog een scherm met spitse
// openingen (zijden van 52 graden) tot onder de boog.
const HANGER = 1.0;
const POINTED = Math.tan((52 * Math.PI) / 180);

// ---------- dek, liggers, pijlers, landhoofden ----------
const deckXs = stations(WEST_END, EAST_END, 1, [WEST_FACE, EAST_FACE, ...PIERS.flatMap(({ x0, x1 }) => [x0, x1])]);
const deckCore = bandY(deckXs, deckBottom, deckZ, -GIRDER_OUT, GIRDER_OUT);
const paths = [-1, 1].map((side) =>
  loftX(
    deckXs.map((x) => {
      const top = deckZ(x) - DECK.pathDrop;
      const inner = GIRDER_OUT - 0.05;
      const section = [
        [inner, deckBottom(x)],
        [DECK_HALF, top - DECK.edge],
        [DECK_HALF, top],
        [inner, top],
      ].map(([y, z]) => [side * y, z]);
      return { x, section: side > 0 ? section : [...section].reverse() };
    }),
  ),
);
const girders = [-1, 1].map((side) =>
  bandY(deckXs, (x) => deckZ(x) - 0.5, girderTop, side * DECK.girderY - DECK.girderHalf, side * DECK.girderY + DECK.girderHalf),
);
const piers = PIERS.flatMap(({ x0, x1, y0, y1 }) => {
  const xc = (x0 + x1) / 2;
  const base = roundedPier(x0, x1, y0, y1, BASE, PIER_BRICK_TOP);
  const top = deckBottom(xc) + 0.1;
  const capFoot = deckBottom(xc) - COLUMN.bearing;
  const columns = [-1, 1].map((side) => {
    const yc = side * DECK.girderY;
    return Manifold.hull([
      boxFromTo(xc - COLUMN.halfX, xc + COLUMN.halfX, yc - COLUMN.halfY, yc + COLUMN.halfY, PIER_BRICK_TOP - 0.1, capFoot - COLUMN.cap),
      boxFromTo(xc - COLUMN.capHalfX, xc + COLUMN.capHalfX, yc - COLUMN.capHalfY, yc + COLUMN.capHalfY, capFoot, top),
    ]);
  });
  return [base, ...columns];
});
const abutments = [
  [WEST_END, WEST_FACE],
  [EAST_FACE, EAST_END],
].map(([a, b]) => bandY([a, (a + b) / 2, b], () => BASE, (x) => deckZ(x) - DECK.pathDrop - 0.05, -DECK_HALF, DECK_HALF));

// ---------- bogen met hangers ----------
// Per veld de grootste opening met een spitse top (zijden van 52 graden)
// tussen de hangers, boven de hoofdligger en overal 0,05 m onder de onderrand
// van de boog; de top mag uit het midden liggen, zodat ook de eindvelden
// (waar de boog naar de pijler zakt) een opening krijgen.
const hangerX = nodeX.slice(1, -1);
const panelBounds = [
  [-SPRING, hangerX[0] - HANGER / 2],
  ...hangerX.slice(0, -1).map((x, i) => [x + HANGER / 2, hangerX[i + 1] - HANGER / 2]),
  [hangerX[hangerX.length - 1] + HANGER / 2, SPRING],
];
function bestOpening(a, b) {
  const floor = Math.min(girderTop(a), girderTop(b), girderTop((a + b) / 2)) - 0.05;
  const samples = Array.from({ length: 401 }, (_, k) => a + ((b - a) * k) / 400);
  let best = null;
  for (let k = 0; k <= 200; k++) {
    const p = a + ((b - a) * k) / 200;
    let apex = Infinity;
    for (const x of samples) apex = Math.min(apex, archLower(x) - 0.05 + POINTED * Math.abs(x - p));
    if (apex < floor + 1.5) continue;
    const left = Math.max(a, p - (apex - floor) / POINTED);
    const right = Math.min(b, p + (apex - floor) / POINTED);
    const hl = apex - POINTED * (p - left);
    const hr = apex - POINTED * (right - p);
    if (right - left < 1.0) continue;
    const area = ((hl - floor + apex - floor) / 2) * (p - left) + ((hr - floor + apex - floor) / 2) * (right - p);
    if (!best || area > best.area + 1e-6) best = { a: left, b: right, p, apex, hl, hr, floor, area };
  }
  return best;
}
const openings = panelBounds.map(([a, b]) => bestOpening(a, b)).filter(Boolean);
const ribXs = stations(-SPRING, SPRING, 0.5, nodeX);
const ribs = [-1, 1].map((side) => {
  const y0 = side * DECK.girderY - DECK.girderHalf;
  const y1 = side * DECK.girderY + DECK.girderHalf;
  const band = bandY(ribXs, (x) => deckZ(x) + 0.1, upper, y0, y1);
  const holes = openings.map(({ a, b, p, apex, hl, hr, floor }) => {
    const pts = [[a, floor], [b, floor]];
    if (hr > floor + 1e-3) pts.push([b, hr]);
    pts.push([p, apex]);
    if (hl > floor + 1e-3) pts.push([a, hl]);
    return profileY(pts, Math.min(y0, y1) - 0.5, Math.max(y0, y1) + 0.5);
  });
  return band.subtract(union(holes));
});

for (const [name, solid] of [
  ["dek", deckCore],
  ...paths.map((s, i) => [`pad ${i}`, s]),
  ...girders.map((s, i) => [`ligger ${i}`, s]),
  ...piers.map((s, i) => [`pijler ${i}`, s]),
  ...abutments.map((s, i) => [`landhoofd ${i}`, s]),
  ...ribs.map((s, i) => [`boog ${i}`, s]),
]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}
const bridge = union([deckCore, ...paths, ...girders, ...piers, ...abutments, ...ribs]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de landhoofden en de pijlers vrij. Net als de
// overhangopvulling van de export krijgt de STL daaronder een wig van 50
// graden vanaf de randbalken die uitloopt in een scherm van 0,9 m tot de
// onderplaat.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = 0.45;
const footStations = stations(WEST_FACE, EAST_FACE, 1).map((x) => {
  const ze = deckZ(x) - DECK.pathDrop - DECK.edge;
  const w = DECK_HALF + 0.01;
  const zs = ze - KNEE * (w - SCREEN);
  return {
    x,
    section: [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, ze], [-w, ze], [-SCREEN, zs]],
  };
});
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);

// ---------- rijbaan en fietspaden als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is een eigen node met de attributen van het
// BGT-wegdeel erop (glTF `extras.attributes`), zodat de kleurregels van een
// thema (bijvoorbeeld fietspaden rood) op het brugdek werken zoals op de
// PDOK-wegdelen ernaast. De actuele BGT-wegdelen op het dek
// (relatieve_hoogteligging 1, lokale coördinaten, vereenvoudigd tot 5 cm):
// twee helften rijbaan regionale weg tussen de hoofdliggers en aan elke kant
// een fietspad tussen hoofdligger en dekrand, alle vier asfalt.
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = {
  bgt_functie: "rijbaan regionale weg",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_ATTRIBUTES = {
  bgt_functie: "fietspad",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
// Rijbaan (P0025.fd1d608569ec48c2e04014ac0e2861a4 zuidelijke helft,
// P0025.fd1d608569ed48c2e04014ac0e2861a4 noordelijke helft): samen
// y = -3,58 tot 3,62, het model legt de rijbaan tussen de hoofdliggers
// (tot 3,85 naast de as).
const BIKE_PATHS = {
  // P0025.fd1d608569e748c2e04014ac0e2861a4: noordzijde (stroomafwaarts).
  1: [[-70.59, 7.6], [-70.6, 4.95], [-69.68, 4.95], [-60.54, 4.88], [42.15, 4.78], [69.16, 4.62], [70.05, 4.63],
    [70.01, 7.59]],
  // P0025.fd1d608569da48c2e04014ac0e2861a4: zuidzijde.
  [-1]: [[-69.98, -4.63], [-70.62, -4.63], [-70.63, -7.59], [70.22, -7.76], [70.18, -4.77], [69.21, -4.8],
    [-14.66, -4.84]],
};
// De BGT legt de binnenrand van de fietspaden 0 tot 0,1 m naast de
// hoofdligger en de einden tot 0,2 m binnen het dekeinde; het model laat het
// fietspad tegen de ligger (met 2 cm vrij) en tot voorbij het dekeinde lopen
// en neemt van de BGT de buitenrand over (7,6 tot 7,76 m naast de as). De
// strook van 0,35 tot 0,5 m daarbuiten tot de dekrand blijft constructie
// (de randbalk met de leuning).
function outerEdge(side) {
  const edge = BIKE_PATHS[side].filter(([, y]) => Math.abs(y) > 6).sort((a, b) => a[0] - b[0]);
  const [[x0, y0], [x1, y1]] = [edge[0], edge[edge.length - 1]];
  return (x) => y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
}
// De strook loopt over dezelfde loftstations als het dek (plus 1 m voorbij
// de dekeinden), van 0,5 m onder tot 1 m boven het wegdek: zo snijdt hij het
// hele bovenvlak uit de constructie en houdt die geen vlak zonder dikte over
// dat met de bovenkant van het wegdek vecht. Langs de hoofdliggers (met de
// bogen en het hangerscherm erop) blijft 2 cm vrij.
const layerXs = [WEST_END - 1, ...deckXs, EAST_END + 1];
function topLayer(edges, top) {
  return loftX(
    layerXs.map((x) => {
      const [e0, e1] = edges(x);
      const zt = top(x);
      return { x, section: [[e0, zt - LAYER], [e1, zt - LAYER], [e1, zt + ABOVE], [e0, zt + ABOVE]] };
    }),
  );
}
const GUARD = 0.02;
const roadCut = topLayer(() => [-(GIRDER_IN - GUARD), GIRDER_IN - GUARD], deckZ);
const pathTop = (x) => deckZ(x) - DECK.pathDrop;
const bikeCut = union(
  [-1, 1].map((side) => {
    const outer = outerEdge(side);
    return topLayer(
      (x) => (side > 0 ? [GIRDER_OUT + GUARD, outer(x)] : [outer(x), -(GIRDER_OUT + GUARD)]),
      pathTop,
    );
  }),
);
const roadway = roadCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const structure = bridge.subtract(union([roadCut, bikeCut]));
const parts = [
  ["building:alexander-ver-huellbrug", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];
{
  // De onderdelen vullen de brug precies: samen hetzelfde volume, zonder overlap.
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  const whole = bridge.volume();
  const overlap = union([roadway, bikeway]).intersect(structure).volume() + roadway.intersect(bikeway).volume();
  console.log("volumes (m3):", Object.fromEntries(parts.map(([name, solid]) => [name, +solid.volume().toFixed(2)])), {
    som: +sum.toFixed(2),
    brug: +whole.toFixed(2),
    overlap: +overlap.toFixed(4),
  });
  if (Math.abs(sum - whole) > 0.01 || overlap > 0.01) throw new Error("onderdelen vullen de brug niet precies");
}

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van het dek en de consoles van de paden, in de
// printversie geen.
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
    const yMid = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const onDeck = zMid < deckZ(xMid) - 0.3 && zMid > deckBottom(xMid) - 0.05;
    if (!onDeck) {
      throw new Error(`overhang buiten het dek op x ${xMid.toFixed(2)}, y ${yMid.toFixed(2)}, z ${zMid.toFixed(2)}`);
    }
  }
  console.log("vrij hangend (m2):", Math.round(area));
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2));
  if (print.area > 0.5) throw new Error("printversie heeft overhang");
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
  crownNap: ARCH.crown,
  nodeX: nodeX.map((x) => +x.toFixed(2)),
  nodeTopNap: nodeTop.map((z) => +(z + WATER_NAP).toFixed(2)),
  openings: openings.map(({ a, b, p, apex, floor }) => ({
    x: [+a.toFixed(2), +b.toFixed(2)],
    apexX: +p.toFixed(2),
    apexNap: +(apex + WATER_NAP).toFixed(2),
    floorNap: +(floor + WATER_NAP).toFixed(2),
  })),
};
const glbFile = path.join(outDir, "alexander-ver-huellbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-alexander-ver-huellbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `alexander-ver-huellbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Alexander Ver Huellbrug Doesburg 1:${scale} mm Z-up`);
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
// Op het water van de IJssel naast de hoofdoverspanning, 15 m naast de as.
const samplePoints = [-30, 0, 30].flatMap((x) => [
  [x, 15],
  [x, -15],
]);
await writeFile(
  path.join(outDir, "alexander-ver-huellbrug.json"),
  JSON.stringify(
    {
      name: "Alexander Ver Huellbrug",
      file: "alexander-ver-huellbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [205964.41, 448145.6],
      xAxis: [0.88248, -0.47034],
      groundOffsetMetres: GROUND_OFFSET,
      groundSamplePoints: samplePoints,
      // Laagste PDOK-hoogte (ellipsoïdisch) van het water op die punten, als
      // terugval voor een uitsnede zonder die punten.
      groundHeight: 50.23,
      replacesTerrain: [
        "P0025.0770faefc3904679a44bb777e6a8ce61",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van de brug midden tussen de twee rivierpijlers op de waterspiegel van de IJssel (z = 0, NAP +6,25 m volgens het AHN) in de oorsprong, +X langs de brug naar Doesburg (oostzuidoost, RD-richting -28,06 graden vanaf het oosten) en +Y stroomafwaarts naar het noordnoordoosten. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van het dek met de attributen van de BGT-wegdelen erop in extras.attributes (bgt_functie rijbaan regionale weg tussen de hoofdliggers of fietspad aan beide kanten daarbuiten tot de randbalk, bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk. Het dek van 140,9 m tussen het westelijke landhoofd (Ellecom, x = -70,6) en het oostelijke (Doesburg, x = 70,2), 16,2 m breed, met het wegdek op NAP +18,4 tot +19,34 m, de twee hoofdliggers 4,35 m naast de as 0,9 m boven het wegdek en de fiets- en voetpaden daarbuiten op consoles; de twee rivierpijlers met een gemetselde voet van 4,0 × 16,8 m met ronde koppen en twee betonnen kolommen onder de hoofdliggers, 89,2 m hart op hart; de twee bogen van de hoofdoverspanning als kokers van 1 × 1,4 m op de hoofdliggers, met de top op NAP +32,2 m, en de tien hangers per boog als een scherm met spitse openingen tussen ligger en boog. Het windverband en de eindportalen tussen de bogen, leuningen en lantaarns zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_END - WEST_END).toFixed(1),
        deckWidthM: +(2 * DECK_HALF).toFixed(2),
        mainSpanPierCentresM: +(2 * SPRING).toFixed(2),
        sideSpansM: [+(PIERS[0].x0 - WEST_FACE).toFixed(1), +(EAST_FACE - PIERS[1].x1).toFixed(1)],
        archCrownNapM: ARCH.crown,
        archRadiusM: ARCH.radius,
        archRibsFromAxisM: DECK.girderY,
        hangerPanelM: +((2 * SPRING) / ARCH.panels).toFixed(2),
        deckNapM: { west: +(deckZ(WEST_END) + WATER_NAP).toFixed(2), crest: Math.max(...DECK_NAP), east: +(deckZ(EAST_END) + WATER_NAP).toFixed(2) },
        deckDepthM: DECK.depth,
        waterNapM: WATER_NAP,
        opened: "1952-01-26 (gebouwd 1951)",
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Lijst_van_oeververbindingen_over_de_(Gelderse)_IJssel",
        "https://nl.wikipedia.org/wiki/Alexander_Ver_Huell",
        "https://structurae.net/en/structures/doesburg-bridge",
        "PDOK BGT overbruggingsdeel (dek, pijlers, landhoofden), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de paden, de bogen en de waterspiegel; PDOK-luchtfoto voor de hangerafstand",
        "Wikimedia Commons: IJsselbrug Doesburg.jpg, Brug Doesburg.jpg, Provinciale weg 317 (brug Doesburg).jpg, Nieuwe brug in Doesburg, Bestanddeelnr 904-9107.jpg, Nieuwe brug in Doesburg, Bestanddeelnr 904-9110.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

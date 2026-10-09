// Genereert een vereenvoudigd, gesloten 3D-model van de IJsselbrug in de A1
// bij Deventer (opengesteld op 21 november 1972, in 2020 heringericht tot
// 2 x 4 rijstroken): een betonnen kokerliggerbrug van 1107 m tussen de
// landhoofden op de dijken, met een hoofdoverspanning van 150,5 m over de
// IJssel op twee rivierpijlers, zijoverspanningen van 80,5 m en daarbuiten
// aanbrugvelden van 74 m over de uiterwaarden (zes aan de westkant bij
// Twello, drie aan de oostkant bij Deventer) en eindvelden van 56 m. Het dek
// is één plaat van 34,6 m breed op twee kokers naast elkaar, elk boven een
// eigen wandpijler; boven de rivierpijlers zijn de kokers 7,5 m hoog, in het
// midden van de hoofdoverspanning en over de aanbruggen 4,2 m (toog). De
// hoofdoverspanning is door kruip ruim een halve meter doorgezakt; het wegdek
// volgt het gemeten lengteprofiel. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, de materiaalklasse in de
// nodenaam: de constructie als building, de rijbanen op het dek als road met
// de BGT-attributen) als catalogusbron voor de export en de kaart, plus een
// binaire STL in millimeters op 1:<schaal> met een printvoet onder het dek.
// De brug past op 1:1000 niet in 400 mm, vandaar standaard 1:3000 (369 mm).
//
//   node scripts/generate-ijsselbrug-deventer.mjs              # STL op 1:3000 (standaard)
//   node scripts/generate-ijsselbrug-deventer.mjs --scale 2500
//
// Assenstelsel: oorsprong op de as van het dek midden in de hoofdoverspanning
// (RD 208202,12, 471751,05), op de waterspiegel van de IJssel zoals het
// PDOK-terrein die legt (46,68 m ellipsoïdisch, NAP +3,36 m), Z omhoog. +X loopt
// langs de brug naar het oostnoordoosten (Deventer, RD-richting 21,81 graden
// vanaf het oosten), +Y naar het noordnoordwesten (stroomafwaarts, de rijbaan
// richting Apeldoorn). De rivierpijlers staan op x = -75,27 en 75,27, de
// wandpijlers op x = -155,79 - 74 k (k = 0..6) en 155,79 + 74 k (k = 0..3), de
// landhoofden van x = -664,9 tot -655,74 en van 433,86 tot 442,65.
//
// Bronnen: BGT overbruggingsdeel (het dek L0002.e82d5e2f3b1e48e0891ee13f8d58154c
// van 34,6 m breed en recht, de landhoofden, de twee rivierpijlers van 4,3 m
// dik en 38,2 m lang met spitse koppen, en per aanbrugpijler twee wanden van
// 2,0 x 10,9 m met ronde einden, 3,2 m naast de as beginnend, op 74,0 m hart op
// hart), BGT wegdeel (twee rijbanen autosnelweg, de middenberm en de randen);
// AHN DSM 0,5 m (PDOK WCS) voor het lengteprofiel van het wegdek (NAP +17,46 m
// aan het westelijke landhoofd, +19,37 m boven de rivierpijlers, +18,79 m in het
// midden van de hoofdoverspanning en +18,37 m aan het oostelijke landhoofd);
// AHN DTM en PDOK-terrein voor de uiterwaarden en de waterspiegel (PDOK = NAP +
// 43,32 m); Wikipedia (nl) voor de opening en de verbreding; Wikimedia
// Commons-foto's (IJsselbrug A1 bij Deventer.jpg en (2).jpg, IJsselbrug
// A1.jpg, A1 bij Deventer.jpg) voor de kokers, de toog boven de rivierpijlers en
// in de zijoverspanningen, de wandpijlers en de dichte borstweringen.
// Geschat (foto's, verhoudingen tegen de bekende hoogtes van wegdek en
// maaiveld): de constructiehoogtes (4,2 m over de aanbruggen en midden in de
// hoofdoverspanning, 7,5 m boven de rivierpijlers, de toog in de
// zijoverspanningen over 50 m), de breedte van de kokers (gelijk aan de wanden
// eronder) en de dikte van de dekplaat, en de hoogtes van schampkanten (0,6 m)
// en middenberm (0,8 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "3000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "ijsselbrug-deventer");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const area2 = (pts) => pts.reduce((a, [x0, y0], i) => {
  const [x1, y1] = pts[(i + 1) % pts.length];
  return a + x0 * y1 - x1 * y0;
}, 0);
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const lerp = (a, b, t) => a + (b - a) * t;

// Loft langs X: per station een convexe doorsnede (y, z), tegen de klok in
// gezien vanaf +X, steeds evenveel punten.
function loft(xs, section) {
  const sections = xs.map((x) => section(x));
  const n = sections[0].length;
  const verts = [];
  xs.forEach((x, i) => {
    for (const [y, z] of sections[i]) verts.push(x, y, z);
  });
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < xs.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = xs.length - 1;
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
// Stations van x0 tot x1 om de `step` m, plus de opgegeven tussenpunten.
function stations(x0, x1, step, extra = []) {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return [...Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n), ...extra.filter((x) => x > x0 && x < x1)]
    .sort((a, b) => a - b)
    .filter((x, i, a) => i === 0 || x - a[i - 1] > 1e-3);
}

// ---------- hoofdmaten (boven de waterspiegel, NAP +3,36 m) ----------
const WATER_NAP = 3.36;
const BASE = -1.0; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de IJssel op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// PDOK-waterspiegel (ellipsoïdisch) op de maaiveldpunten, als vaste terugval
// voor een uitsnede die alleen een aanbrug raakt.
const GROUND_HEIGHT = 46.68;

// Wegdek in NAP-meters om de 10 m vanaf x = -668: 25e percentiel van het
// AHN-DSM over beide rijbanen (3 tot 15 m van de randen), voortschrijdende
// mediaan over 25 m en gemiddelde over 15 m (verkeer en lantaarns vallen zo
// weg). De doorzakking midden in de hoofdoverspanning (0,58 m onder de koppen
// van de rivierpijlers) is echt: kruip van het beton.
const ROAD_X0 = -668;
const ROAD_STEP = 10;
const ROAD_NAP = [
  17.46, 17.49, 17.59, 17.68, 17.74, 17.79, 17.82, 17.86, 17.9, 17.94, 18.0, 18.06, 18.1, 18.15, 18.19, 18.24,
  18.31, 18.37, 18.44, 18.49, 18.5, 18.5, 18.51, 18.56, 18.6, 18.63, 18.66, 18.68, 18.7, 18.75, 18.83, 18.88,
  18.91, 18.94, 18.95, 18.94, 18.95, 18.99, 19.01, 19.03, 19.05, 19.07, 19.09, 19.12, 19.12, 19.13, 19.16, 19.19,
  19.25, 19.27, 19.26, 19.27, 19.31, 19.33, 19.35, 19.36, 19.36, 19.37, 19.36, 19.32, 19.26, 19.2, 19.14, 19.07,
  18.98, 18.87, 18.8, 18.79, 18.83, 18.93, 19.04, 19.13, 19.2, 19.27, 19.31, 19.35, 19.37, 19.37, 19.38, 19.38,
  19.37, 19.31, 19.28, 19.25, 19.2, 19.17, 19.14, 19.13, 19.11, 19.08, 19.07, 19.07, 19.06, 19.03, 19.0, 18.95,
  18.91, 18.89, 18.86, 18.83, 18.8, 18.76, 18.72, 18.68, 18.63, 18.6, 18.56, 18.53, 18.48, 18.42, 18.38, 18.37,
];
function road(x) {
  const f = (x - ROAD_X0) / ROAD_STEP;
  const i = Math.min(Math.max(Math.floor(f), 0), ROAD_NAP.length - 2);
  return lerp(ROAD_NAP[i], ROAD_NAP[i + 1], f - i) - WATER_NAP;
}

// Indeling langs de as (BGT).
const RIVER_PIER = 75.27; // harten van de rivierpijlers (hoofdoverspanning 150,5 m)
const SPAN = 74.0; // aanbrugvelden
const FIRST_PIER = 155.79; // eerste wandpijler aan beide kanten (zijoverspanning 80,5 m)
const WEST_PIERS = Array.from({ length: 7 }, (_, k) => -(FIRST_PIER + SPAN * k));
const EAST_PIERS = Array.from({ length: 4 }, (_, k) => FIRST_PIER + SPAN * k);
const WEST_ABUT = { end: -664.9, face: -655.74 }; // achterkant en voorkant
const EAST_ABUT = { face: 433.86, end: 442.65 };

// Dwarsprofiel (y naar +Y, BGT): dekranden op ±17,3; rijbanen tussen de
// schampkanten (-15,82 en 15,74) en de middenberm (-0,78 tot 0,78).
const HALF = 17.3;
// Twee kokers, elk boven een wandpijler (BGT 3,2 tot 14,12 m naast de as); de
// lijven staan bovenaan 0,5 m verder naar buiten.
const GIRDERS = [
  { bottom: [-14.12, -3.2] }, // zuidelijke koker (rijbaan richting Deventer)
  { bottom: [3.2, 14.12] }, // noordelijke koker (rijbaan richting Apeldoorn)
];
const WEB_FLARE = 0.5;
const SLAB = { edge: 0.6, web: 1.0 }; // dikte van de dekplaat aan de rand en bij de lijven en ertussen
// Constructiehoogte onder het wegdek (foto's): aanbruggen en midden in de
// hoofdoverspanning 4,2 m, boven de rivierpijlers 7,5 m (vlak over 2,5 m aan
// weerszijden van het hart), in de hoofdoverspanning een parabolische toog,
// in de zijoverspanningen loopt hij in 50 m terug naar 4,2 m.
const DEPTH = { approach: 4.2, pier: 7.5, mid: 4.2, flat: 2.5, haunch: 50 };
function depth(x) {
  const u = Math.abs(x);
  const inner = RIVER_PIER - DEPTH.flat;
  const outer = RIVER_PIER + DEPTH.flat;
  if (u <= inner) return DEPTH.mid + (DEPTH.pier - DEPTH.mid) * (u / inner) ** 2;
  if (u <= outer) return DEPTH.pier;
  if (u <= outer + DEPTH.haunch) {
    const t = (u - outer) / DEPTH.haunch;
    return DEPTH.approach + (DEPTH.pier - DEPTH.approach) * (1 - t) ** 2;
  }
  return DEPTH.approach;
}
const soffit = (x) => road(x) - depth(x);
// Rivierpijlers (BGT L0002.3c0a668f97a24b08b80780e50add1d14 en
// L0002.5401d8f1da534a9b84df892568fe85c1): 4,3 m dik, recht over 30,2 m en
// spitse koppen tot 19,1 m naast de as; symmetrisch gemaakt.
const RIVER_PIER_RING = [
  [-2.15, -15.1], [-0.8, -18.6], [0, -19.1], [0.8, -18.6], [2.15, -15.1],
  [2.15, 15.1], [0.8, 18.6], [0, 19.1], [-0.8, 18.6], [-2.15, 15.1],
];
// Wandpijlers: 2,0 m dik met ronde einden (BGT), 3,2 tot 14,12 m naast de as.
const WALL = { thick: 2.0, y: [3.2, 14.12] };

// Op het dek (BGT wegdeel): de randen buiten de rijbanen (1,5 m) als
// schampkanten met de borstwering, en de middenberm (1,56 m) als geleider.
const KERBS = [
  { s: [-HALF, -15.82], h: 0.6 }, // zuidelijke schampkant
  { s: [15.74, HALF], h: 0.6 }, // noordelijke schampkant
  { s: [-0.78, 0.78], h: 0.8 }, // middenberm met de dubbele geleiderail
];

// ---------- dek ----------
const keyXs = [
  -RIVER_PIER - DEPTH.flat - DEPTH.haunch, -RIVER_PIER - DEPTH.flat, -RIVER_PIER + DEPTH.flat,
  RIVER_PIER - DEPTH.flat, RIVER_PIER + DEPTH.flat, RIVER_PIER + DEPTH.flat + DEPTH.haunch,
];
const deckXs = stations(WEST_ABUT.face - 0.5, EAST_ABUT.face + 0.5, 2, keyXs); // 0,5 m in het landhoofd
const slabXs = stations(WEST_ABUT.end, EAST_ABUT.end, 2, [...keyXs, WEST_ABUT.face, EAST_ABUT.face]);
const t0 = GIRDERS[0].bottom[0] - WEB_FLARE;
const t1 = GIRDERS[0].bottom[1] + WEB_FLARE;
const t2 = GIRDERS[1].bottom[0] - WEB_FLARE;
const t3 = GIRDERS[1].bottom[1] + WEB_FLARE;
const deck = union([
  // dekplaat: 0,6 m aan de randen, 1,0 m vanaf de lijven en tussen de kokers
  loft(slabXs, (x) => {
    const zt = road(x);
    return [[-HALF, zt - SLAB.edge], [t0, zt - SLAB.web], [t3, zt - SLAB.web], [HALF, zt - SLAB.edge], [HALF, zt], [-HALF, zt]];
  }),
  ...GIRDERS.map(({ bottom: [b0, b1] }) =>
    loft(deckXs, (x) => {
      const zt = road(x);
      return [[b0, soffit(x)], [b1, soffit(x)], [b1 + WEB_FLARE, zt - SLAB.web + 0.05], [b0 - WEB_FLARE, zt - SLAB.web + 0.05]];
    }),
  ),
]);
const kerbXs = stations(WEST_ABUT.end, EAST_ABUT.end, 2, keyXs);
// Schampkant of geleider, van onder de wegdeklaag tot h boven het wegdek;
// `margin` maakt hem rondom groter (de vrije ruimte van het wegdek).
const kerb = ({ s: [s0, s1], h }, margin = 0, xs = kerbXs) =>
  loft(xs, (x) => {
    const zt = road(x);
    return [[s0 - margin, zt - 0.6 - margin], [s1 + margin, zt - 0.6 - margin], [s1 + margin, zt + h + margin], [s0 - margin, zt + h + margin]];
  });
const kerbs = KERBS.map((k) => kerb(k));

// ---------- pijlers en landhoofden ----------
// Wandpijlers: twee wanden per pijler, van de onderkant tot 0,3 m in de koker.
function wall(x, y0, y1, zTop) {
  const r = WALL.thick / 2;
  const h = zTop - BASE;
  return Manifold.hull([
    Manifold.cylinder(h, r, r, 32, false).translate([x, y0 + r, BASE]),
    Manifold.cylinder(h, r, r, 32, false).translate([x, y1 - r, BASE]),
  ]);
}
const walls = [...WEST_PIERS, ...EAST_PIERS].flatMap((x) => [
  wall(x, WALL.y[0], WALL.y[1], soffit(x) + 0.3),
  wall(x, -WALL.y[1], -WALL.y[0], soffit(x) + 0.3),
]);
const riverPiers = [-RIVER_PIER, RIVER_PIER].map((x) =>
  prism(RIVER_PIER_RING.map(([px, py]) => [x + px, py]), BASE, soffit(x) + 0.3),
);
// Landhoofden: massief onder het dek tot 0,3 m onder het wegdek, van de
// voorkant tot de achterkant in de dijk.
const abutments = [
  [WEST_ABUT.end, WEST_ABUT.face + 0.01],
  [EAST_ABUT.face - 0.01, EAST_ABUT.end],
].map(([x0, x1]) =>
  loft(stations(x0, x1, 1), (x) => {
    const zt = road(x);
    return [[-HALF, BASE], [HALF, BASE], [HALF, zt - SLAB.edge + 0.2], [-HALF, zt - SLAB.edge + 0.2]];
  }),
);

const bridge = union([deck, ...kerbs, ...walls, ...riverPiers, ...abutments]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij en de dekplaat kraagt uit. Net als de
// overhangopvulling van de export krijgt de STL daaronder een wig van
// minstens 50 graden vanaf de randen van de dekplaat, onder de buitenste
// hoeken van de kokers door, die uitloopt in een scherm van minstens 0,9 m
// (0,45 mm op printschaal) midden tussen de kokers.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.45 * scale) / 1000);
const ym = 0;
const footXs = stations(WEST_ABUT.face - 0.5, EAST_ABUT.face + 0.5, 1, keyXs);
const printFoot = loft(footXs, (x) => {
  const zt = road(x);
  const zb = zt - SLAB.edge + 0.02;
  const zg = soffit(x) - 0.05;
  const yL = -HALF - 0.02;
  const yR = HALF + 0.02;
  const kL = Math.max(KNEE, (zb - zg) / (GIRDERS[0].bottom[0] - 0.02 - yL));
  const kR = Math.max(KNEE, (zb - zg) / (yR - GIRDERS[1].bottom[1] - 0.02));
  const zsL = zb - kL * (ym - SCREEN - yL);
  const zsR = zb - kR * (yR - ym - SCREEN);
  const left = zsL > BASE + 0.05 ? [[ym - SCREEN, BASE], [ym - SCREEN, zsL]] : (() => {
    const a = yL + (zb - BASE) / kL;
    return [[a, BASE], [a - 1e-3, BASE + 1e-3]];
  })();
  const right = zsR > BASE + 0.05 ? [[ym + SCREEN, BASE], [ym + SCREEN, zsR]] : (() => {
    const a = yR - (zb - BASE) / kR;
    return [[a, BASE], [a + 1e-3, BASE + 1e-3]];
  })();
  return [left[0], right[0], right[1], [yR, zb], [yL, zb], left[1]];
});
const printModel = union([bridge, printFoot]);

// ---------- rijbanen als eigen onderdeel ----------
// De bovenste 0,5 m van het wegdek is een eigen node met de attributen van de
// actuele BGT-wegdelen erop (relatieve hoogteligging 1, glTF
// `extras.attributes`), zodat de kleurregels van een thema op het brugdek
// werken zoals op de PDOK-wegdelen ernaast. Pas na het printmodel opgebouwd,
// zodat de STL het hele brugmodel ongewijzigd bevat.
//
// De BGT legt op het dek twee wegdelen rijbaan autosnelweg (gesloten
// verharding, asfalt), van landhoofd tot landhoofd:
// L0002.073cc8ca61de4e57a8e39958ae2b6d92 (zuidelijke rijbaan, y = -15,8 tot
// -0,8) en L0002.c495665a0da444429f3aeb5469e56ff6 (noordelijke rijbaan, y = 0,8
// tot 15,7). De randen buiten de rijbanen en de middenberm hebben geen eigen
// wegdeel; ze blijven als schampkanten en geleider constructie.
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan autosnelweg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek over de stations van het
// dek, over de volle breedte en 0,5 m voorbij de einden van de landhoofden.
const layerXs = stations(WEST_ABUT.end - 0.5, EAST_ABUT.end + 0.5, 2, [...keyXs, WEST_ABUT.face, EAST_ABUT.face, WEST_ABUT.end, EAST_ABUT.end]);
const layerStrip = loft(layerXs, (x) => {
  const zt = road(x);
  return [[-40, zt - LAYER], [40, zt - LAYER], [40, zt + ABOVE], [-40, zt + ABOVE]];
});
// De schampkanten en de middenberm blijven over hun hele strook met 2 cm vrij
// constructie.
const guardXs = stations(WEST_ABUT.end - 1, EAST_ABUT.end + 1, 2, keyXs);
const notLayer = union(KERBS.map((k) => kerb(k, GUARD, guardXs)));
const layer = layerStrip.subtract(notLayer);
const roadway = layer.intersect(bridge);
const structure = bridge.subtract(layer);
const parts = [
  ["building:ijsselbrug-deventer", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
];
// De onderdelen tellen op tot de brug als geheel (geen overlap, niets kwijt).
const partition = {
  bridgeM3: +bridge.volume().toFixed(1),
  partsM3: Object.fromEntries(parts.map(([name, solid]) => [name, +solid.volume().toFixed(1)])),
};
partition.sumM3 = +parts.reduce((sum, [, solid]) => sum + solid.volume(), 0).toFixed(1);
partition.overlapM3 = +roadway.intersect(structure).volume().toFixed(3);
if (Math.abs(partition.sumM3 - partition.bridgeM3) > 0.5 || partition.overlapM3 > 0.01) {
  throw new Error(`onderdelen tellen niet op: ${JSON.stringify(partition)}`);
}
console.log("partitie (m3):", JSON.stringify(partition));

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
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
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
  if (Math.abs(bb.min[2] - BASE) > 1e-4) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  console.log("vrij hangend in het model (m2):", Math.round(overhangs(bridge).area));
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2));
  if (print.area > 1) {
    for (const p of print.found.slice(0, 12)) console.log(p.map((q) => q.map((c) => +c.toFixed(2))));
    throw new Error("printversie heeft overhang");
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
    components: solid.decompose().length,
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
report.partition = partition;
report.profile = {
  roadNap: {
    west: +(road(WEST_ABUT.end) + WATER_NAP).toFixed(2),
    riverPier: +(road(-RIVER_PIER) + WATER_NAP).toFixed(2),
    mid: +(road(0) + WATER_NAP).toFixed(2),
    east: +(road(EAST_ABUT.end) + WATER_NAP).toFixed(2),
  },
  soffitNap: {
    mid: +(soffit(0) + WATER_NAP).toFixed(2),
    riverPier: +(soffit(RIVER_PIER) + WATER_NAP).toFixed(2),
    approach: +(soffit(FIRST_PIER) + WATER_NAP).toFixed(2),
  },
  piers: { west: WEST_PIERS.map((x) => +x.toFixed(2)), river: [-RIVER_PIER, RIVER_PIER], east: EAST_PIERS.map((x) => +x.toFixed(2)) },
};
const glbFile = path.join(outDir, "ijsselbrug-deventer.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-ijsselbrug-deventer.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `ijsselbrug-deventer-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint IJsselbrug A1 Deventer 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  components: printSolid.decompose().length,
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten op het
// water: de IJssel onder de hoofdoverspanning (25 tot 35 m naast de as) en de
// strang in de westelijke uiterwaard (x = -360).
const samplePoints = [
  [-40, 25],
  [0, 25],
  [-20, -25],
  [20, -25],
  [60, -35],
  [-360, 25],
  [-360, -25],
];
await writeFile(
  path.join(outDir, "ijsselbrug-deventer.json"),
  JSON.stringify(
    {
      name: "IJsselbrug (A1, Deventer)",
      file: "ijsselbrug-deventer.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [208202.12, 471751.05],
      xAxis: [0.92841, 0.37155],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "L0002.e82d5e2f3b1e48e0891ee13f8d58154c",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden in de hoofdoverspanning op de waterspiegel van de IJssel (z = 0, NAP +3,36 m) in de oorsprong, +X langs de brug naar het oostnoordoosten (Deventer, RD-richting 21,81 graden vanaf het oosten) en +Y naar het noordnoordwesten. Twee nodes: road:rijbaan, de bovenste 0,5 m van beide rijbanen met de attributen van de BGT-wegdelen erop in extras.attributes (bgt_functie rijbaan autosnelweg, bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, een betonnen kokerliggerbrug van 1107 m van landhoofd tot landhoofd (wegdek NAP +17,5 m bij Twello, +19,4 m boven de rivierpijlers, +18,8 m in het doorgezakte midden en +18,4 m bij Deventer), met een dekplaat van 34,6 m op twee kokers, schampkanten aan de randen en de middenberm als geleider; de hoofdoverspanning van 150,5 m op twee rivierpijlers met spitse koppen, met een toog van 7,5 m boven de pijlers naar 4,2 m in het midden en in de zijoverspanningen van 80,5 m; aanbrugvelden van 74 m (zes aan de westkant, drie aan de oostkant) en eindvelden van 56 m op wandpijlers (per koker een wand van 2,0 x 10,9 m met ronde einden); de landhoofden in de dijken. Lantaarnpalen, leuningen, het seinportaal boven de rijbanen en de dilatatievoegen zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water van de IJssel en de westelijke strang bemonsterd; groundHeight is de PDOK-waterspiegel daar. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_ABUT.end - WEST_ABUT.end).toFixed(1),
        deckWidthM: 2 * HALF,
        mainSpanM: +(2 * RIVER_PIER).toFixed(2),
        sideSpanM: +(FIRST_PIER - RIVER_PIER).toFixed(2),
        approachSpanM: SPAN,
        endSpanM: { west: +(WEST_PIERS[6] - WEST_ABUT.face).toFixed(2), east: +(EAST_ABUT.face - EAST_PIERS[3]).toFixed(2) },
        riverPierCentresM: [-RIVER_PIER, RIVER_PIER],
        wallPierCentresM: report.profile.piers,
        depthM: DEPTH,
        roadNapM: report.profile.roadNap,
        waterNapM: WATER_NAP,
        opened: "1972-11-21",
      },
      sources: [
        "https://nl.wikipedia.org/wiki/IJsselbrug_(Deventer)",
        "PDOK BGT overbruggingsdeel (dek L0002.e82d5e2f3b1e48e0891ee13f8d58154c, landhoofden, rivierpijlers L0002.3c0a668f97a24b08b80780e50add1d14 en L0002.5401d8f1da534a9b84df892568fe85c1, 22 wandpijlers) en wegdeel (L0002.073cc8ca61de4e57a8e39958ae2b6d92, L0002.c495665a0da444429f3aeb5469e56ff6), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het lengteprofiel van het wegdek en de uiterwaarden; PDOK-luchtfoto voor de indeling van het dek",
        "Wikimedia Commons: IJsselbrug A1 bij Deventer.jpg, IJsselbrug A1 bij Deventer (2).jpg, IJsselbrug A1.jpg, A1 bij Deventer.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

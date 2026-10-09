// Genereert een vereenvoudigd, gesloten 3D-model van de Blauwbrug (brug 236)
// in Amsterdam: de vaste brug uit 1883-1884 van Bastiaan de Greef en Willem
// Springer over de Amstel tussen de Amstelstraat en het Waterlooplein, met drie
// flauwe segmentbogen op twee pijlers met scheepsboegen, een balustrade, en acht
// granieten pylonen met een lantaarnzuil (twee lantaarns op een scheepsvormige
// arm) en een keizerskroon. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, de constructie plus het wegdek
// als road:-nodes met de BGT-attributen, materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in millimeters
// op 1:<schaal>.
//
//   node scripts/generate-blauwbrug.mjs              # 1:300 (standaard)
//   node scripts/generate-blauwbrug.mjs --scale 100
//
// Op 1:300 is de brug 181 mm lang en past hij op een gangbaar printbed; op
// 1:100 zou hij 54 cm worden.
//
// Assenstelsel: oorsprong in het hart van het BGT-dek (RD 121876,64,
// 486608,20) op de waterspiegel van de Amstel (NAP -0,4 m), Z omhoog. +X loopt
// langs de brug naar het Waterlooplein (oostnoordoost, RD-richting 21,2 graden
// boven het oosten), +Y stroomafwaarts naar het noordnoordwesten.
//
// Bronnen: BGT overbruggingsdeel (dek 49,0 × 20,9 m, twee pijlers van 2,56 m op
// x = ±8,4 met spitse koppen tot y = ±13,1, voetstukken van de pylonen van
// 1,45 × 1,45 m), BGT scheiding (muur: balustrade van 0,63 m; kademuur: de
// eindblokken met de buitenste pylonen), BGT wegdeel (voetpaden, fietspaden,
// rijbanen en de OV-baan van de tram op het dek); AHN DSM 0,5 m (PDOK WCS) voor
// het lengteprofiel van het dek (NAP +3,53 m in het midden, +2,94 m aan de
// einden), de balustrade, de boegen en de pylonen (NAP +9,3 tot +9,7 m);
// Wikipedia (acht granieten pylonen met keizerskronen, kalkstenen
// balustrades); Wikimedia Commons-foto's voor de bogen, de boegen en de
// lantaarnzuilen.
//
// Geschat op foto's: aanzet van de bogen 0,9 m boven water, kruin 1,2 m onder
// het wegdek, de boogrib, de lijst onder de balustrade, de hoogte van de
// balustrade (1,0 m), de opbouw van de pylonen (voetstuk 1,75 m, zuil tot
// 5,1 m, kroon tot 6,5 m boven het wegdek), de boeg met krul en de treden van
// de pijlervoet.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "300"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "blauwbrug");
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
// Blok met middelpunt (x, y) in plattegrond.
const boxC = (x, y, sx, sy, z0, z1) => boxFromTo(x - sx / 2, x + sx / 2, y - sy / 2, y + sy / 2, z0, z1);
const cyl = (x, y, r, z0, z1, segs = 32) => Manifold.cylinder(z1 - z0, r, r, segs, false).translate([x, y, z0]);
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
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (steeds
// evenveel punten, tegen de klok in gezien vanaf +X).
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
const mirrorY = (m) => m.mirror([0, 1, 0]);
const mirrorX = (m) => m.mirror([1, 0, 0]);
const bothSides = (m) => union([m, mirrorY(m)]);

// ---------- hoofdmaten (boven de waterspiegel, NAP -0,4 m) ----------
const WATER_NAP = -0.4;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Dek volgens de BGT: x = ±24,5, y = ±10,45 (gevel van de lijst onder de
// balustrade); de boogvlakken liggen 0,15 m terug.
const DECK = { halfX: 24.5, halfY: 10.45, archFace: 10.3 };
// Wegdek (AHN-mediaan over het dek): NAP +3,53 m in het midden, afgerond tot
// x = ±8 en daarna rechtlijnig met 2,95 % tot NAP +2,94 m aan de einden.
const CROWN = Z(3.53);
const CURVE_HALF = 8;
const GRADE = 0.0295;
function deckZ(x) {
  const ax = Math.abs(x);
  const k = GRADE / (2 * CURVE_HALF);
  if (ax <= CURVE_HALF) return CROWN - k * ax * ax;
  return CROWN - k * CURVE_HALF * CURVE_HALF - GRADE * (ax - CURVE_HALF);
}
// Pijlers (BGT, gespiegeld gemiddeld): 2,56 m breed op x = ±8,4, met een spitse
// kop tot y = ±13,1 (schouder op ±11,5).
const PIER = { centre: 8.4, half: 1.28, shoulder: 11.5, tip: 13.1 };
// Voet van de pijlers: drie treden van 0,4 m hoog en 0,2 m diep (foto's).
const PLINTH = { steps: 3, rise: 0.4, tread: 0.2 };
// Bogen: segmentbogen met de aanzet 0,9 m boven water en de kruin 1,2 m onder
// het wegdek (foto's); rib in het vlak van de lijst, 0,6 m breed zodat hij
// overal in de lijst opgaat (op de kruin 0,2 m zichtbaar onder de lijst).
const ARCH = { spring: 0.9, belowDeck: 1.2, rib: 0.6 };
const ABUTMENT = 24.0; // voorkant van de landhoofden (kademuur op x = ±24,4)
// Lijst onder de balustrade (0,15 m voor het boogvlak), balustrade van 0,9 m
// breed (BGT 0,63 m, verbreed naar buiten met een kraag van 45 graden) en
// 1,0 m hoog, met blinde vakken tussen de posten.
const FASCIA = { depth: 0.85, chamfer: 0.15 };
const PARAPET = { inner: 9.82, outer: 10.72, height: 1.0, corbel: 0.27 };
const PANELS = { perBay: 5, post: 0.45, bottom: 0.2, top: 0.8, recess: 0.3 };
// Scheepsboeg op de pijlerkoppen: bovenkant 0,6 m boven het wegdek bij de
// gevel, aflopend naar 0,6 m onder het wegdek op de punt, met een krul.
const BOW = { rise: 0.6, drop: 0.6, scrollY: 11.0, scrollR: 0.45, scrollHalfX: 0.9 };
// Pylonen: voetstuk 1,45 × 1,45 m (BGT) op de pijlers (middelpunt x = ±8,39,
// y = ±10,055) en op de eindblokken (x = ±25,75, y = ±10,75).
const PIER_PYLON = { x: 8.39, y: 10.055 };
const END_PYLON = { x: 25.75, y: 10.75 };
// Eindblokken (BGT kademuur, afgeronde hoek), 0,9 m boven het wegdek.
const END_BLOCK = [
  [24.5, 9.3], [26.45, 9.35], [26.85, 9.65], [27.1, 10.05], [27.2, 10.55], [27.2, 12.0],
  [26.5, 12.0], [25.05, 11.88], [24.7, 11.65], [24.5, 11.3],
];
const END_BLOCK_TOP = deckZ(DECK.halfX) + 0.9;

// ---------- brug ----------
const STEPS = 98;
const stations = [];
for (let i = 0; i <= STEPS; i++) stations.push(-DECK.halfX + (2 * DECK.halfX * i) / STEPS);
const loftSections = (section) => loftX(stations.map((x) => ({ x, section: section(deckZ(x)) })));

// Lichaam tot het wegdek, tussen de boogvlakken.
const body = loftSections((d) => [
  [-DECK.archFace, BASE],
  [DECK.archFace, BASE],
  [DECK.archFace, d],
  [-DECK.archFace, d],
]);
// Lijst (gevel van het dek) en balustrade aan beide zijden.
const fasciaSide = loftSections((d) => [
  [DECK.archFace - 0.01, d - FASCIA.depth - FASCIA.chamfer],
  [DECK.archFace, d - FASCIA.depth - FASCIA.chamfer],
  [DECK.halfY, d - FASCIA.depth],
  [DECK.halfY, d],
  [DECK.archFace - 0.01, d],
]);
const corbelSide = loftSections((d) => [
  [DECK.halfY - 0.01, d - PARAPET.corbel],
  [DECK.halfY, d - PARAPET.corbel],
  [PARAPET.outer, d],
  [DECK.halfY - 0.01, d],
]);
const parapetSide = loftSections((d) => [
  [PARAPET.inner, d - 0.5],
  [PARAPET.outer, d - 0.5],
  [PARAPET.outer, d + PARAPET.height],
  [PARAPET.inner, d + PARAPET.height],
]);
// Blinde vakken in de buitenkant van de balustrade, tussen de posten.
const bays = [
  [-DECK.halfX, -(PIER_PYLON.x + 0.725)],
  [-(PIER_PYLON.x - 0.725), PIER_PYLON.x - 0.725],
  [PIER_PYLON.x + 0.725, DECK.halfX],
];
const panelCuts = [];
for (const [a, b] of bays) {
  const w = (b - a - (PANELS.perBay + 1) * PANELS.post) / PANELS.perBay;
  for (let i = 0; i < PANELS.perBay; i++) {
    const x0 = a + PANELS.post + i * (w + PANELS.post);
    panelCuts.push(
      bandY(
        x0,
        x0 + w,
        (x) => deckZ(x) + PANELS.bottom,
        (x) => deckZ(x) + PANELS.top,
        PARAPET.outer - PANELS.recess,
        PARAPET.outer + 1,
        6,
      ),
    );
  }
}
const parapet = parapetSide.subtract(union(panelCuts));
const deckEdges = bothSides(union([fasciaSide, corbelSide, parapet]));

// Bogen: per overspanning de opening (segmentboog boven de aanzet, rechte
// dagkanten eronder) en de rib erboven.
const spans = [
  [-ABUTMENT, -(PIER.centre + PIER.half)],
  [-(PIER.centre - PIER.half), PIER.centre - PIER.half],
  [PIER.centre + PIER.half, ABUTMENT],
];
const arches = spans.map(([a, b]) => {
  const mid = (a + b) / 2;
  const half = (b - a) / 2;
  const crown = deckZ(mid) - ARCH.belowDeck;
  const rise = crown - ARCH.spring;
  const r = (half * half + rise * rise) / (2 * rise);
  const centreZ = crown - r;
  return { a, b, mid, half, crown, rise, r, centreZ };
});
function archPoints({ a, b, mid, r, centreZ }, radius, bottom, segs = 32) {
  const pts = [[a, bottom], [b, bottom]];
  const za = centreZ + Math.sqrt(radius * radius - ((b - a) / 2) ** 2);
  pts.push([b, za]);
  const a0 = Math.asin((b - a) / 2 / radius);
  for (let i = 1; i < segs; i++) {
    const t = a0 - (2 * a0 * i) / segs;
    pts.push([mid + radius * Math.sin(t), centreZ + radius * Math.cos(t)]);
  }
  pts.push([a, za]);
  return pts;
}
// Blinde bogen: een nis vanaf beide boogvlakken waarvan het plafond onder 45
// graden naar binnen afloopt (zelfdragend op 1:1000, geen vrije overspanning
// onder het dek). Op de waterspiegel is de nis 2,3 tot 2,7 m diep; hij loopt
// door tot de onderkant (onder het PDOK-water), zodat het plafond nergens
// in een vloer uitloopt (geen vlak zonder dikte).
const NICHE = { floor: BASE - 0.5, depth: 4.0 };
const niches = arches.map((arch) => {
  const pts = archPoints(arch, arch.r, NICHE.floor - 1);
  const outer = profileY(pts, DECK.archFace + 1.0, DECK.archFace + 1.01).translate([0, 0, 1.0]);
  const inner = profileY(pts, DECK.archFace - NICHE.depth - 0.01, DECK.archFace - NICHE.depth).translate([
    0,
    0,
    -NICHE.depth,
  ]);
  const one = Manifold.hull([outer, inner]).intersect(
    boxFromTo(arch.a, arch.b, -15, 15, NICHE.floor, 20),
  );
  return bothSides(one);
});
const ribs = arches.map((arch) => {
  const ring = profileY(archPoints(arch, arch.r + ARCH.rib, ARCH.spring - 0.5), DECK.archFace - 0.01, DECK.halfY).subtract(
    profileY(archPoints(arch, arch.r, ARCH.spring - 2), DECK.archFace - 1, DECK.halfY + 1),
  );
  return bothSides(ring);
});

// Pijlers: lichaam volgens de BGT-omtrek met spitse koppen, getrapte voet,
// scheepsboeg met krul op beide koppen.
const pierOutline = (xc) => {
  const x0 = xc - PIER.half;
  const x1 = xc + PIER.half;
  return [
    [x0, -PIER.shoulder], [x0 + 0.29, -12.13], [xc, -PIER.tip], [x1 - 0.29, -12.13], [x1, -PIER.shoulder],
    [x1, PIER.shoulder], [x1 - 0.29, 12.13], [xc, PIER.tip], [x0 + 0.29, 12.13], [x0, PIER.shoulder],
  ];
};
function pier(xc) {
  const ref = deckZ(xc);
  const outline = ccw(pierOutline(xc));
  const parts = [prismZ(outline, BASE, ref - 0.5)];
  // Treden: onderste trede het breedst.
  for (let i = 0; i < PLINTH.steps; i++) {
    const grow = PLINTH.tread * (PLINTH.steps - i);
    const cs = new CrossSection([outline]).offset(grow, "Miter", 2);
    parts.push(Manifold.extrude(cs, (i === 0 ? -BASE : 0) + PLINTH.rise).translate([0, 0, i === 0 ? BASE : i * PLINTH.rise]));
  }
  // Boeg buiten de gevel: bovenkant een vlak dat van ref + 0,6 op y = 10,3
  // afloopt naar ref - 0,6 op de punt.
  const slope = -(BOW.rise + BOW.drop) / (PIER.tip - DECK.archFace);
  const zAt = (y) => ref + BOW.rise + slope * (y - DECK.archFace);
  const n = Math.hypot(slope, 1);
  const c = zAt(0);
  const bowSide = prismZ(outline, BASE, ref + BOW.rise + 0.1)
    .intersect(boxFromTo(xc - 2, xc + 2, DECK.archFace, PIER.tip + 1, BASE - 1, ref + 5))
    .trimByPlane([0, slope / n, -1 / n], -c / n);
  // Krul: liggende cilinder langs X op een blok van dezelfde breedte.
  const scrollZ = ref + BOW.rise + 0.35;
  const scroll = union([
    Manifold.cylinder(2 * BOW.scrollHalfX, BOW.scrollR, BOW.scrollR, 24, false)
      .rotate([0, 90, 0])
      .translate([xc - BOW.scrollHalfX, BOW.scrollY, scrollZ]),
    boxFromTo(xc - BOW.scrollHalfX, xc + BOW.scrollHalfX, BOW.scrollY - BOW.scrollR, BOW.scrollY + BOW.scrollR, ref - 0.5, scrollZ),
  ]);
  parts.push(bowSide, mirrorY(bowSide), scroll, mirrorY(scroll));
  return union(parts);
}

// Pylon: voetstuk met kroonlijst, getrapte basis, zuil (0,9 m, op 1:1000
// verdikt; in het echt circa 0,55 m), scheepsvormige arm (V-vormig onder 45
// graden, zodat hij zonder steun print) halverwege de zuil met twee lantaarns
// van 0,8 m langs de brug, kapiteel en keizerskroon. `ref` is het wegdek
// ernaast; maten boven het wegdek geschat op foto's met een voetganger als
// maat (voetstuk 1,9 m, arm 3,0-4,2 m, lantaarns tot 5,3 m, kroon tot 6,5 m).
function pylon(cx, cy, ref, baseZ) {
  const thin = 0.01;
  const at = (dz) => ref + dz;
  const parts = [
    boxC(cx, cy, 1.45, 1.45, baseZ, at(1.75)),
    Manifold.hull([boxC(cx, cy, 1.45, 1.45, at(1.75) - thin, at(1.75)), boxC(cx, cy, 1.75, 1.75, at(1.9) - thin, at(1.9))]),
    boxC(cx, cy, 1.75, 1.75, at(1.9) - thin, at(2.0)),
    boxC(cx, cy, 1.25, 1.25, at(2.0) - thin, at(2.3)),
    Manifold.hull([boxC(cx, cy, 1.25, 1.25, at(2.3) - thin, at(2.3)), cyl(cx, cy, 0.6, at(2.55) - thin, at(2.55))]),
    cyl(cx, cy, 0.45, at(2.55) - thin, at(5.1)),
    // Arm: V-vormige romp onder 45 graden.
    Manifold.hull([boxC(cx, cy, 0.7, 0.9, at(3.0), at(3.05)), boxC(cx, cy, 2.7, 0.9, at(4.05), at(4.2))]),
    // Kapiteel en abacus.
    Manifold.hull([cyl(cx, cy, 0.45, at(5.1) - thin, at(5.1)), boxC(cx, cy, 1.2, 1.2, at(5.45) - thin, at(5.45))]),
    boxC(cx, cy, 1.2, 1.2, at(5.45) - thin, at(5.55)),
    // Keizerskroon: band, koepel en bol.
    cyl(cx, cy, 0.5, at(5.55) - thin, at(5.8)),
    Manifold.sphere(0.5, 32).scale([1, 1, 0.9]).trimByPlane([0, 0, 1], 0).translate([cx, cy, at(5.8) - thin]),
    Manifold.sphere(0.15, 16).translate([cx, cy, at(6.35)]),
  ];
  for (const s of [-1, 1]) {
    const lx = cx + s * 0.95;
    parts.push(
      boxC(lx, cy, 0.8, 0.8, at(4.2) - thin, at(4.95)),
      Manifold.hull([boxC(lx, cy, 0.8, 0.8, at(4.95) - thin, at(4.95)), boxC(lx, cy, 0.2, 0.2, at(5.3) - thin, at(5.3))]),
    );
  }
  return union(parts);
}

const piers = union([pier(PIER.centre), pier(-PIER.centre)]);
const pierPylons = [];
const endPylons = [];
for (const sx of [-1, 1]) {
  for (const sy of [-1, 1]) {
    const ref = deckZ(PIER_PYLON.x);
    pierPylons.push(pylon(sx * PIER_PYLON.x, sy * PIER_PYLON.y, ref, ref - 0.5));
    const endRef = deckZ(DECK.halfX);
    const block = prismZ(END_BLOCK.map(([x, y]) => [sx * x, sy * y]), BASE, END_BLOCK_TOP);
    endPylons.push(union([block, pylon(sx * END_PYLON.x, sy * END_PYLON.y, endRef, END_BLOCK_TOP - 0.1)]));
  }
}

const bridge = union([
  union([body, deckEdges]).subtract(union(niches)),
  ...ribs,
  piers,
  ...pierPylons,
  ...endPylons,
]);
// Het printmodel (de STL) is de brug als geheel; de wegdeklaag wordt er pas
// hieronder uitgesneden, zodat de STL niet verandert.
const printModel = bridge;
printModel.numTri();

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant en boven
// de waterspiegel: alleen kleine randen (lijst, rib, boognis, nis in de
// balustrade) mogen er zijn.
function overhangArea(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.min(...p.map((q) => q[2])) < 0.05) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len - 1e-6) continue;
    area += len / 2;
  }
  return area;
}
if (printModel.status() !== "NoError") throw new Error(`brug: ${printModel.status()}`);
if (Math.abs(printModel.boundingBox().min[2] - BASE) > 1e-6) throw new Error("onderkant niet vlak");

// ---------- wegdek met PDOK-attributen als eigen onderdelen ----------
// De bovenste 0,5 m van het wegdek is per BGT-functie een eigen node met de
// attributen van het actuele BGT-wegdeel op het dek (relatieve hoogteligging 1)
// in glTF `extras.attributes`, zodat de kleurregels van een thema op de brug
// werken zoals op de PDOK-wegdelen ernaast. Contouren in lokale coördinaten,
// vereenvoudigd tot 5 cm; de kopse kanten (x = ±24,5) zijn doorgetrokken tot
// voorbij het dek en de voetpaden tot voorbij de balustrade, zodat er geen
// randjes van een ander wegdeel overblijven.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding" };
const TRAM_ATTRIBUTES = { bgt_functie: "OV-baan", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
const FOOT_ATTRIBUTES = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "open verharding" };
// G0363.379fb9a415cd414cb01ae9c903dc7ae8: OV-baan (tramlijnen 14) in het midden.
const TRAM = [[24.47, -2.7], [24.47, 2.67], [-24.46, 2.51], [-24.49, -2.94], [-12.68, -2.61], [17.96, -2.55]];
// G0363.2f44751d94934318b1322a051611c437 (noord) en
// G0363.ff6ad275cbb1453d856752f891271f6a (zuid): fietspaden.
const BIKE_PATHS = [
  [[24.47, 5.52], [24.47, 7.02], [-18.9, 7.21], [-24.44, 7.09], [-24.44, 5.6]],
  [[24.47, -6.98], [24.47, -5.62], [-17.18, -5.71], [-24.5, -5.57], [-24.51, -6.98]],
];
// G0363.4d0ec58c0d6149e5a6f51ac1e0fe66dc (noord) en
// G0363.6740aa61a71d450794ad9a1508aab5db (zuid): voetpaden langs de
// balustrade; de uitsparingen voor de voetstukken van de pylonen vallen
// binnen de voetstukken.
const FOOT_PATHS = [
  [[24.47, 7.02], [24.48, 9.79], [-24.42, 9.84], [-24.44, 7.09], [-18.9, 7.21]],
  [[24.47, -6.98], [24.46, -9.82], [-24.52, -9.81], [-24.51, -6.98]],
];
// De rijbanen G0363.ba9ae59f7f274c73bc542154a8c455f8 (zuid) en
// G0363.e28d6fe618a542daa70853c36c143d01 (noord) en de bermen tussen rijbaan
// en OV-baan (ondersteunend wegdeel G0363.0181b4e7... en G0363.2ea62624...,
// 0,4 m) vormen samen de rest van de strook: road:rijbaan.
const stretch = (poly, outward) =>
  poly.map(([x, y]) => [
    Math.abs(x) > 24.3 ? Math.sign(x) * (DECK.halfX + 1.5) : x,
    outward && Math.abs(y) > 9.2 ? Math.sign(y) * 12 : y,
  ]);
const tall = (poly) => prismZ(poly, BASE - 1, 30);
const tramZone = tall(stretch(TRAM, false));
const bikeZone = union(BIKE_PATHS.map((p) => tall(stretch(p, false))));
const footZone = union(FOOT_PATHS.map((p) => tall(stretch(p, true))));

// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, over dezelfde
// loftstations als het dek, 0,5 m voorbij de kopse kanten.
const stripStations = [-DECK.halfX - 0.5, ...stations, DECK.halfX + 0.5];
const strip = loftX(
  stripStations.map((x) => {
    const d = deckZ(Math.max(-DECK.halfX, Math.min(DECK.halfX, x)));
    return { x, section: [[-12, d - LAYER], [12, d - LAYER], [12, d + ABOVE], [-12, d + ABOVE]] };
  }),
);
// Wat boven het wegdek uitsteekt blijft constructie, met 2 cm vrij: de
// balustrade met lijst (de hele strook buiten y = ±9,82), de voetstukken van
// de pylonen op de pijlers en de eindblokken.
const parapetGuard = bothSides(boxFromTo(-30, 30, PARAPET.inner - GUARD, 20, BASE - 2, 30));
const pylonGuards = [];
for (const sx of [-1, 1]) {
  for (const sy of [-1, 1]) {
    pylonGuards.push(boxC(sx * PIER_PYLON.x, sy * PIER_PYLON.y, 1.45 + 2 * GUARD, 1.45 + 2 * GUARD, BASE - 2, 30));
    const blockSection = new CrossSection([ccw(END_BLOCK.map(([x, y]) => [sx * x, sy * y]))]).offset(GUARD, "Miter", 2);
    pylonGuards.push(Manifold.extrude(blockSection, 32).translate([0, 0, BASE - 2]));
  }
}
const endGuard = union([
  boxFromTo(DECK.halfX + GUARD, 30, -20, 20, BASE - 2, 30),
  boxFromTo(-30, -DECK.halfX - GUARD, -20, 20, BASE - 2, 30),
]);
const layer = strip.subtract(union([parapetGuard, ...pylonGuards, endGuard]));
const tramCut = layer.intersect(tramZone);
const bikeCut = layer.intersect(bikeZone).subtract(tramZone);
const footCut = layer.intersect(footZone).subtract(union([tramZone, bikeZone]));
const roadCut = layer.subtract(union([tramZone, bikeZone, footZone]));
const structure = bridge.subtract(layer);
const parts = [
  ["building:blauwbrug", structure],
  ["road:rijbaan", roadCut.intersect(bridge), ROAD_ATTRIBUTES],
  ["road:ov-baan", tramCut.intersect(bridge), TRAM_ATTRIBUTES],
  ["road:fietspad", bikeCut.intersect(bridge), BIKE_ATTRIBUTES],
  ["road:voetpad", footCut.intersect(bridge), FOOT_ATTRIBUTES],
];
{
  // De onderdelen vullen de brug precies.
  const sum = parts.reduce((a, [, solid]) => a + solid.volume(), 0);
  const whole = bridge.volume();
  console.log(
    "volumes (m3):",
    parts.map(([name, solid]) => `${name} ${solid.volume().toFixed(2)}`).join(", "),
    `som ${sum.toFixed(3)}, brug ${whole.toFixed(3)}`,
  );
  if (Math.abs(sum - whole) > 0.02) throw new Error(`onderdelen ${sum} tegen brug ${whole}`);
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
    volumeM3: +solid.volume().toFixed(2),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
report.arches = arches.map(({ a, b, crown, rise, r }) => ({
  from: a,
  to: b,
  span: +(b - a).toFixed(2),
  crownNap: +(crown + WATER_NAP).toFixed(2),
  rise: +rise.toFixed(2),
  radius: +r.toFixed(2),
}));
report.overhangM2 = +overhangArea(printModel).toFixed(2);
const glbFile = path.join(outDir, "blauwbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-blauwbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, lichaam en eindblokken op het
// printbed.
const stlName = `blauwbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Blauwbrug Amsterdam 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
await writeFile(
  path.join(outDir, "blauwbrug.json"),
  JSON.stringify(
    {
      name: "Blauwbrug",
      file: "blauwbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [121876.64, 486608.2],
      xAxis: [0.9321, 0.3622],
      groundOffsetMetres: 0,
      // Op het water van de Amstel naast de brug: voor de middenboog en de
      // beide zijbogen, aan beide zijden.
      groundSamplePoints: [
        [0, 14.5],
        [0, -14.5],
        [16.5, 14.5],
        [-16.5, -14.5],
        [16.5, -14.5],
        [-16.5, 14.5],
      ],
      // Laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten: het water.
      groundHeight: 43.02,
      replacesTerrain: [
        "G0363.c6a9ce7c02a34df1934c2efa0aaa351f",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van het BGT-dek op de waterspiegel van de Amstel (z = 0, NAP -0,4 m) in de oorsprong, +X langs de brug naar het Waterlooplein (RD-richting 21,2 graden boven het oosten) en +Y stroomafwaarts naar het noordnoordwesten. Vijf nodes: road:rijbaan, road:ov-baan, road:fietspad en road:voetpad, de bovenste 0,5 m van het wegdek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan lokale weg, OV-baan, fietspad of voetpad; bgt_fysiekvoorkomen gesloten verharding, voor de voetpaden open verharding), zodat de kleurregels van een thema erop werken (van het midden naar buiten de OV-baan van de tram, de rijbanen met de bermen, de fietspaden en de voetpaden tot de balustrade); en building:blauwbrug, de rest van de brug: het dek van 49 × 20,9 m met een wegdek van NAP +3,53 m in het midden tot +2,94 m aan de einden, drie segmentbogen van 14,2 tot 14,3 m als blinde bogen met een rib (nissen met een plafond van 45 graden, zodat ze op 1:1000 zonder steun printen), de lijst en de balustrade van 1,0 m met blinde vakken, twee pijlers met getrapte voet en spitse koppen met een scheepsboeg en krul, en acht pylonen (vier op de pijlers, vier op de eindblokken aan de kades) met voetstuk, zuil, twee lantaarns op een arm langs de brug, kapiteel en keizerskroon tot 6,5 m boven het wegdek. Het maaiveld wordt op het water naast de brug bemonsterd (groundHeight is de ellipsoïdische waterhoogte als terugval). Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        deckLengthM: DECK.halfX * 2,
        deckWidthM: DECK.halfY * 2,
        overallLengthM: 54.4,
        overallWidthM: PIER.tip * 2,
        archSpansM: arches.map(({ a, b }) => +(b - a).toFixed(2)),
        archCrownsNapM: arches.map(({ crown }) => +(crown + WATER_NAP).toFixed(2)),
        deckNapM: { centre: 3.53, ends: +(deckZ(DECK.halfX) + WATER_NAP).toFixed(2) },
        parapetM: PARAPET.height,
        pylons: 8,
        pylonTopAboveDeckM: 6.5,
        pierPylonTopNapM: +(deckZ(PIER_PYLON.x) + 6.5 + WATER_NAP).toFixed(2),
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Blauwbrug",
        "PDOK BGT overbruggingsdeel (dek G0363.c6a9ce7c02a34df1934c2efa0aaa351f, pijlers G0363.593d3c79... en G0363.a8d8eac9...), scheiding (muur, kademuur), EPSG:28992",
        "PDOK BGT wegdeel en ondersteunend wegdeel (OGC API) op het dek: OV-baan G0363.379fb9a415cd414cb01ae9c903dc7ae8, rijbanen G0363.ba9ae59f7f274c73bc542154a8c455f8 en G0363.e28d6fe618a542daa70853c36c143d01, fietspaden G0363.2f44751d94934318b1322a051611c437 en G0363.ff6ad275cbb1453d856752f891271f6a, voetpaden G0363.4d0ec58c0d6149e5a6f51ac1e0fe66dc en G0363.6740aa61a71d450794ad9a1508aab5db",
        "PDOK AHN DSM 0,5 m via WCS voor het dek, de balustrade, de boegen en de pylonen",
        "Wikimedia Commons: Blauwbrug NW side from river Amstel 2016-09-12-6577.jpg, Column Blauwbrug Amstel 2016-09-12-6584.jpg, Amsterdam, Blauwbrug in 2007.jpg, De Blauwbrug over de Amstel (2020).jpg, Amsterdam - Blauwbrug 1883 B.de Greef & W.Springer - View West.jpg, Blauwbrug over de Amstel (1884) - Amsterdam - 20011031 - RCE.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

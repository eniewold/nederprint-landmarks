// Genereert een vereenvoudigd, gesloten 3D-model van de Lange Jan (Abdijtoren)
// in Middelburg (tweede helft 14e eeuw, bekroning na de brand van 1940
// herbouwd naar die van 1712): de achtkantige stenen toren met de steunberen
// op de hoeken, drie geledingen met de hoge vensters, de blinde bogen en de
// galmgaten, de band met de wapenschilden onder de omloop met balustrade en
// pinakels, de achtkantige opbouw met het eerste open lantaarntje, het tweede
// lantaarntje met de klokvormige kap en de keizerskroon met de windvaan.
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, één node per onderdeel met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// van de toren in millimeters op 1:<schaal>.
//
//   node scripts/generate-lange-jan.mjs              # 1:1000 (standaard)
//   node scripts/generate-lange-jan.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: elke geleding is smaller dan de vorige,
// de dakranden van de lantaarns kragen onder hooguit 40 graden uit en de
// nissen hebben een spitse top; het script controleert dat de massa zonder
// nissen geen vlak heeft dat vlakker dan 45 graden naar beneden wijst.
//
// De toren is geen eigen BAG-pand: hij hoort bij pand 0687100000029292, het
// hele abdijcomplex met de Nieuwe Kerk en de Koorkerk. Omdat de kaart en de
// export alleen hele panden kunnen verbergen, neemt de GLB de rest van dat
// pand over als tweede node: de PDOK-reconstructie (3D Basisvoorziening,
// CC BY 4.0, abdijPdok() onderaan het script), zonder het deel binnen
// de voetafdruk van de toren en zonder de torendelen boven de kerkdaken.
//
// Assenstelsel: oorsprong op RD (31935,8, 391557,0), in het hart van de
// achtkantige onderbouw op het maaiveld van Onder den Toren (NAP +4,5 m),
// Z omhoog. +X staat loodrecht op de oostgevel van de achtkant (RD-richting
// 13,3 graden), zodat de acht gevels op de assen en de diagonalen liggen;
// -Y wijst naar het plein Onder den Toren (zuidzuidoosten).
//
// Bronnen: BAG-pand 0687100000029292 (achtkant met apothema 6,3 m en
// steunberen van 1,5 m breed tot 8,45 m uit het hart); AHN DSM/DTM 0,5 m
// (PDOK WCS) voor de omhullende per richting en hoogte; Wikipedia (90,4 m) en
// het Rijksmonumentenregister (28674: achtkant vanaf de grond, drie
// geledingen, steunberen op de hoeken); Wikimedia Commons-foto's voor de
// geledingen, de omloop, de lantaarns en de kroon.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "lange-jan");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(32);

// ---------- maten (lokaal stelsel, z = NAP - 4,5 m) ----------
const ORIGIN = [31935.8, 391557.0];
const ANGLE_DEG = 13.3;
const ANGLE = (ANGLE_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 4.5;
// Alle onderdelen beginnen op dezelfde vlakke onderkant, een halve meter onder
// het maaiveld.
const BASE = -0.5;

// Stenen achtkant: [z, apothema] van onder naar boven. De gevels wijken per
// geleding iets terug; tussen de geledingen een schuine waterlijst.
const SHAFT = [
  [BASE, 6.3],
  [22.5, 6.15], // eerste geleding met de hoge vensters
  [23.2, 6.0],
  [36.5, 5.95], // tweede geleding met de blinde bogen
  [37.0, 5.9],
  [51.0, 5.8], // derde geleding met de galmgaten
  [52.0, 4.95],
  [57.5, 4.95], // band met de wapenschilden
  [58.5, 5.25], // uitgekraagde lijst
  [60.8, 5.25], // balustrade van de omloop (dicht)
];
// Steunberen op de acht hoeken: [z, afstand van de top tot het hart], 1,5 m
// breed, met schuine waterslagen tussen de versprongen delen.
const BUTTRESS = {
  width: 1.5,
  profile: [
    [BASE, 8.45],
    [10.0, 8.45],
    [10.8, 7.7],
    [22.5, 7.7],
    [23.0, 7.3],
    [36.0, 7.3],
    [36.4, 6.9],
    [47.5, 6.9],
    [49.5, 6.0],
  ],
  inner: 5.0,
};
// Pinakels op de hoeken van de balustrade.
const PINNACLE = { radius: 4.95, size: 0.9, height: 2.0 };
// Achtkantige opbouw achter de balustrade, het eerste (open) lantaarntje en
// het tweede lantaarntje met de klokvormige kap: [z, apothema].
const UPPER = [
  [60.8 - 0.01, 4.2],
  [65.3, 4.2], // opbouw
  [66.0, 4.55], // dakrand
  [67.0, 3.85],
  [71.8, 3.85], // eerste lantaarntje
  [72.4, 4.25], // dakrand
  [73.4, 2.7],
  [76.4, 2.7], // tweede lantaarntje
  [76.8, 3.0], // dakrand
  [77.5, 2.7],
  [78.4, 2.1],
  [79.5, 1.45],
  [80.6, 1.0], // klokvormige kap
];
// Keizerskroon (rond): profiel [straal, z], met de rijksappel en de windvaan.
const CROWN = [
  [0, 80.6 - 0.01],
  [1.0, 80.6 - 0.01],
  [1.0, 81.2],
  [1.45, 81.9],
  [1.45, 83.4],
  [0.45, 85.2],
  [0, 85.2],
];
// Rijksappel als omwentelingslichaam [straal, z] op de top van de kroon.
const ORB = [
  [0, 85.19],
  [0.45, 85.19],
  [0.5, 85.5],
  [0.3, 85.95],
  [0, 86.05],
];
const VANE = { from: 85.9, radius: [0.3, 0.08], top: 90.4 };

// Spitsboognissen per gevel: [breedte, van, aanzet, diepte, gevels]. Gevel k
// heeft zijn normaal op k * 45 graden; 4 t/m 7 en 0 liggen vrij (west, zuid en
// oost), 1 t/m 3 grenzen aan de Koorkerk en de Nieuwe Kerk.
const FREE_LOW = [5, 6, 7, 0];
const FREE_MID = [4, 5, 6, 7, 0];
const ALL = [0, 1, 2, 3, 4, 5, 6, 7];
const NICHES = [
  { width: 2.0, z0: 3.5, spring: 17.5, depth: 0.4, faces: FREE_LOW, shaft: true }, // vensters
  { width: 2.4, z0: 25.0, spring: 32.5, depth: 0.3, faces: FREE_MID, shaft: true }, // blinde bogen
  { width: 1.9, z0: 39.5, spring: 47.5, depth: 0.45, faces: ALL, shaft: true }, // galmgaten
  { width: 1.8, z0: 67.6, spring: 69.9, depth: 0.35, faces: ALL, apothem: 3.85 }, // eerste lantaarntje
  { width: 1.1, z0: 74.0, spring: 75.3, depth: 0.3, faces: ALL, apothem: 2.7 }, // tweede lantaarntje
];
// Maaiveld op het plein Onder den Toren, ten zuiden, zuidwesten en
// zuidoosten van de toren (NAP +4,45 tot +4,55 m volgens het AHN-DTM).
const GROUND_SAMPLES = [
  [0, -11],
  [-8, -8],
  [8, -8],
];

// ---------- hulpfuncties ----------
const union = (parts) => Manifold.union(parts);
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const K = 1 / Math.cos(Math.PI / 8);
// Stapel achtkanten volgens een lijst [z, apothema], als één omwentelingslichaam
// met acht segmenten (geen naden tussen de geledingen).
const octagonStack = (stack) =>
  Manifold.revolve([[[0, stack[0][0]], ...stack.map(([z, a]) => [a * K, z]), [0, stack.at(-1)[0]]]], 8).rotate([
    0,
    0,
    22.5,
  ]);
// Apothema van een stapel op hoogte z (lineair tussen de punten).
function apothemAt(stack, z) {
  for (let i = 1; i < stack.length; i++) {
    const [z0, a0] = stack[i - 1];
    const [z1, a1] = stack[i];
    if (z <= z1) return a0 + ((a1 - a0) * (z - z0)) / (z1 - z0);
  }
  return stack.at(-1)[1];
}
// Polygoon [x, z] in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0).rotate([90, 0, 0]).translate([0, y1, 0]);
// Spitsboog als polygoon [breedterichting, hoogte]: rechte zijden tot
// `spring`, daarboven twee cirkelbogen met straal gelijk aan de breedte.
function pointedArch(width, spring, steps = 10) {
  const half = width / 2;
  const pts = [[-half, 0], [half, 0], [half, spring]];
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 3);
    pts.push([half - width + width * Math.cos(t), spring + width * Math.sin(t)]);
  }
  for (let i = steps - 1; i >= 1; i--) {
    const t = (i / steps) * (Math.PI / 3);
    pts.push([-half + width - width * Math.cos(t), spring + width * Math.sin(t)]);
  }
  pts.push([-half, spring]);
  return pts;
}
// Spitsboognis in gevel k (normaal op k * 45 graden), `depth` achter de gevel
// op apothema `apothem`, van hoogte z0.
function faceNiche(k, apothem, width, spring, z0, depth) {
  return Manifold.extrude([pointedArch(width, spring - z0)], 4)
    .rotate([90, 0, 90])
    .translate([apothem - depth, 0, z0])
    .rotate([0, 0, k * 45]);
}
// Pinakel: vierkante voet met een piramidespits.
const pinnacle = (x, y, z0, size, height) =>
  union([
    Manifold.cube([size, size, height * 0.4], false).translate([x - size / 2, y - size / 2, z0]),
    Manifold.cylinder(height * 0.6 + 0.01, size * Math.SQRT1_2, 0.05, 4, false)
      .rotate([0, 0, 45])
      .translate([x, y, z0 + height * 0.4 - 0.01]),
  ]);

// ---------- toren ----------
const shaft = octagonStack(SHAFT);
const buttresses = ALL.map((k) =>
  profileY(
    [[BUTTRESS.inner, BASE], ...BUTTRESS.profile.map(([z, r]) => [r, z]), [BUTTRESS.inner, BUTTRESS.profile.at(-1)[0]]],
    -BUTTRESS.width / 2,
    BUTTRESS.width / 2,
  ).rotate([0, 0, 22.5 + k * 45]),
);
const top = SHAFT.at(-1)[0];
const pinnacles = ALL.map((k) => {
  const a = ((22.5 + k * 45) * Math.PI) / 180;
  return pinnacle(PINNACLE.radius * Math.cos(a), PINNACLE.radius * Math.sin(a), top - 0.01, PINNACLE.size, PINNACLE.height);
});
const upper = octagonStack(UPPER);
const crown = Manifold.revolve([CROWN], 32);
const orb = Manifold.revolve([ORB], 16);
const vane = Manifold.cylinder(VANE.top - VANE.from, VANE.radius[0], VANE.radius[1], 8, false).translate([0, 0, VANE.from]);
const mass = union([shaft, ...buttresses, ...pinnacles, upper, crown, orb, vane]);

const cuts = [];
for (const niche of NICHES) {
  for (const k of niche.faces) {
    const apothem = niche.shaft ? apothemAt(SHAFT, niche.spring + niche.width) : niche.apothem;
    cuts.push(faceNiche(k, apothem, niche.width, niche.spring, niche.z0, niche.depth));
  }
}
const tower = mass.subtract(union(cuts));

// ---------- controles ----------
for (const [name, solid] of [["massa", mass], ["toren", tower]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}
// Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant
// (m2 per laagste z). De massa zonder nissen mag er geen hebben; in de toren
// zijn het alleen de spitse toppen van de nissen.
function steepFaces(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const levels = new Map();
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const z = Math.min(...p.map((q) => q[2])).toFixed(1);
    levels.set(z, +((levels.get(z) ?? 0) + len / 2).toFixed(3));
  }
  return levels;
}
{
  const massLevels = steepFaces(mass);
  if ([...massLevels.values()].some((area) => area > 0.001)) {
    throw new Error(`overhang in de massa: ${JSON.stringify(Object.fromEntries(massLevels))}`);
  }
  const towerLevels = steepFaces(tower);
  console.log("ondervlakken in de nissen (lokale z: m2):", Object.fromEntries(towerLevels));
  // De top van een nis loopt van de aanzet tot een breedte daarboven.
  for (const [z] of towerLevels) {
    if (!NICHES.some((n) => +z >= n.spring - 0.05 && +z <= n.spring + n.width)) throw new Error(`overhang op z ${z}`);
  }
}

// ---------- abdij: PDOK-reconstructie van de rest van het pand ----------
// Hoekpunten in lokaal stelsel; driehoeken worden geknipt met verticale
// halfvlakken (op x en y) en met een horizontaal vlak.
const abbeyData = abdijPdok();
// De vloer van het PDOK-pand ligt op ellipsoïdische hoogte 46,71 m, ruim 2 m
// onder het PDOK-maaiveld bij de toren (48,75 m op de bemonsteringspunten);
// het pand reikt tot een lagere binnenplaats. De lader zet lokaal z = 0 op dat
// maaiveld plus groundOffsetMetres, dus de abdij zakt zoveel mee dat ze op
// dezelfde hoogte staat als in de PDOK-tegels.
const PDOK_GROUND = 48.75;
const GROUND_OFFSET = -0.3;
const ABBEY_DZ = abbeyData.originHeight - (PDOK_GROUND + GROUND_OFFSET);
const toLocal = ([dx, dy, z]) => {
  // De data staat langs de RD-assen ten opzichte van dezelfde oorsprong.
  const ox = abbeyData.originRd[0] - ORIGIN[0];
  const oy = abbeyData.originRd[1] - ORIGIN[1];
  const x = dx + ox;
  const y = dy + oy;
  return [x * X_AXIS[0] + y * X_AXIS[1], -x * X_AXIS[1] + y * X_AXIS[0], z + ABBEY_DZ];
};
const abbeyVertices = [];
for (let i = 0; i < abbeyData.vertices.length; i += 3) {
  abbeyVertices.push(toLocal(abbeyData.vertices.slice(i, i + 3)));
}
// Halfvlak a*x + b*y + c*z <= d; Sutherland-Hodgman op een convexe veelhoek.
function clip(poly, [a, b, c, d]) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const fp = a * p[0] + b * p[1] + c * p[2] - d;
    const fq = a * q[0] + b * q[1] + c * q[2] - d;
    if (fp <= 0) out.push(p);
    if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) {
      const t = fp / (fp - fq);
      out.push(p.map((value, axis) => value + t * (q[axis] - value)));
    }
  }
  return out.length >= 3 ? out : null;
}
const flip = ([a, b, c, d]) => [-a, -b, -c, -d];
// Halfvlakken (binnenkant) van een convexe veelhoek [x, y] tegen de klok in.
const halfPlanes = (pts) =>
  pts.map(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    const ex = x1 - x0;
    const ey = y1 - y0;
    return [ey, -ex, 0, ey * x0 - ex * y0];
  });
// Wat van een veelhoek buiten een convex gebied (lijst halfvlakken) valt.
function outside(poly, planes) {
  const pieces = [];
  let rest = poly;
  for (const plane of planes) {
    const out = clip(rest, flip(plane));
    if (out) pieces.push(out);
    rest = clip(rest, plane);
    if (!rest) break;
  }
  return pieces;
}
const octagon = (apothem) =>
  Array.from({ length: 8 }, (_, k) => {
    const a = ((22.5 + k * 45) * Math.PI) / 180;
    return [apothem * K * Math.cos(a), apothem * K * Math.sin(a)];
  });
const rotate2 = ([x, y], deg) => {
  const a = (deg * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};
// Voetafdruk van de toren met 0,25 m speling: de achtkant en de steunberen.
const MARGIN = 0.25;
const footprintRegions = [
  halfPlanes(octagon(SHAFT[0][1] + MARGIN)),
  ...ALL.map((k) =>
    halfPlanes(
      [
        [BUTTRESS.inner, -BUTTRESS.width / 2 - MARGIN],
        [BUTTRESS.profile[0][1] + MARGIN, -BUTTRESS.width / 2 - MARGIN],
        [BUTTRESS.profile[0][1] + MARGIN, BUTTRESS.width / 2 + MARGIN],
        [BUTTRESS.inner, BUTTRESS.width / 2 + MARGIN],
      ].map((p) => rotate2(p, 22.5 + k * 45)),
    ),
  ),
];
// Boven de kerkdaken (de nok van de Koorkerk ligt lokaal op 33,4 m, maar
// binnen deze achtkant onder 30 m) hoort alles binnen de achtkant bij de
// PDOK-toren, ook zijn ruimere schachtdelen.
const TOWER_ZONE = { apothem: 9.0, above: 32.3 };
const towerZone = halfPlanes(octagon(TOWER_ZONE.apothem));
// Dichter bij de toren liggen de kerkdaken onder 25 m; daarboven staan
// alleen de wandstroken van de PDOK-toren tussen de steunberen.
const INNER_ZONE = { apothem: 8.0, above: 25.0 };
const innerZone = halfPlanes(octagon(INNER_ZONE.apothem));
// De kerken sluiten aan op de steunberen in het zuidwesten (Nieuwe Kerk) en
// noordoosten (Koorkerk), op lokaal 202,5 en 22,5 graden. Ten zuidoosten van
// de lijn door die twee hoeken staat binnen de achtkant alleen de toren; daar
// verdwijnt de PDOK-reconstructie op elke hoogte, ook de dunne wandstroken
// tussen de steunberen.
const diagonal = (22.5 * Math.PI) / 180;
const southZone = [...towerZone, [-Math.sin(diagonal), Math.cos(diagonal), 0, 0]];
const abbeyTriangles = [];
for (let t = 0; t < abbeyData.triangles.length; t += 3) {
  const poly = [0, 1, 2].map((k) => abbeyVertices[abbeyData.triangles[t + k]]);
  // Wanden binnen de binnenste achtkant zijn wandstroken van de PDOK-toren
  // boven de kerkdaken: alleen de dakvlakken van de kerken blijven daar staan.
  const e1 = poly[1].map((c, a) => c - poly[0][a]);
  const e2 = poly[2].map((c, a) => c - poly[0][a]);
  const nz = e1[0] * e2[1] - e1[1] * e2[0];
  const area2 = Math.hypot(e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], nz);
  const sources = Math.abs(nz) < 0.1 * area2 ? outside(poly, innerZone) : [poly];
  let pieces = [];
  for (const source of sources) {
    const low = clip(source, [0, 0, 1, INNER_ZONE.above]);
    const middle = clip(source, [0, 0, -1, -INNER_ZONE.above]);
    const mid = middle && clip(middle, [0, 0, 1, TOWER_ZONE.above]);
    const high = middle && clip(middle, [0, 0, -1, -TOWER_ZONE.above]);
    if (low) pieces.push(low);
    if (mid) pieces.push(...outside(mid, innerZone));
    if (high) pieces.push(...outside(high, towerZone));
  }
  for (const region of [southZone, ...footprintRegions]) pieces = pieces.flatMap((piece) => outside(piece, region));
  for (const piece of pieces) {
    for (let i = 1; i + 1 < piece.length; i++) {
      const tri = [piece[0], piece[i], piece[i + 1]];
      const e1 = tri[1].map((c, a) => c - tri[0][a]);
      const e2 = tri[2].map((c, a) => c - tri[0][a]);
      const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      if (Math.hypot(...n) > 1e-6) abbeyTriangles.push(tri);
    }
  }
}
// Als losse driehoeken met vlaknormalen; geen gesloten solid, zoals de
// PDOK-panden zelf, dus de export vult hem recht naar beneden op.
function rawMesh(triangles) {
  const positions = new Float32Array(triangles.length * 9);
  const normals = new Float32Array(triangles.length * 9);
  triangles.forEach((tri, t) => {
    const e1 = tri[1].map((c, a) => c - tri[0][a]);
    const e2 = tri[2].map((c, a) => c - tri[0][a]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    tri.forEach((p, k) => {
      for (let a = 0; a < 3; a++) {
        positions[t * 9 + k * 3 + a] = p[a];
        normals[t * 9 + k * 3 + a] = n[a] / len;
      }
    });
  });
  return { numProp: 6, positions, normals, triVerts: Uint32Array.from({ length: triangles.length * 3 }, (_, i) => i) };
}
const abbey = rawMesh(abbeyTriangles);

const nodes = [
  ["building:toren", tower],
  ["building:abdij", abbey],
];

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
// Een onderdeel is een manifold-solid of een losse mesh van rawMesh().
function meshData(part) {
  if (part.positions) {
    const count = part.positions.length / 3;
    const props = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      for (let a = 0; a < 3; a++) {
        props[i * 6 + a] = part.positions[i * 3 + a];
        props[i * 6 + 3 + a] = part.normals[i * 3 + a];
      }
    }
    return { vertProperties: props, numProp: 6, triVerts: part.triVerts };
  }
  // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
  // als properties 3..5, al meegedraaid met de toegepaste transformaties.
  return part.calculateNormals(0, 40).getMesh();
}
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, part] of namedParts) {
    const mesh = meshData(part);
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
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
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
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    nodes.push({ name, mesh: meshes.length - 1 });
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
{
  const bb = tower.boundingBox();
  report["building:toren"] = {
    status: tower.status(),
    genus: tower.genus(),
    triangles: tower.numTri(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
  const z = abbeyTriangles.flat().map((p) => p[2]);
  const x = abbeyTriangles.flat().map((p) => p[0]);
  const y = abbeyTriangles.flat().map((p) => p[1]);
  const range = (values) => [+Math.min(...values).toFixed(2), +Math.max(...values).toFixed(2)];
  report["building:abdij"] = {
    sourceTriangles: abbeyData.triangles.length / 3,
    triangles: abbeyTriangles.length,
    xRange: range(x),
    yRange: range(y),
    zRange: range(z),
  };
}
const glbFile = path.join(outDir, "lange-jan.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-lange-jan.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `lange-jan-1-${scale}.stl`);
const printSolid = tower.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Lange Jan Middelburg 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

await writeFile(
  path.join(outDir, "lange-jan.json"),
  JSON.stringify(
    {
      name: "Lange Jan",
      file: "lange-jan.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: GROUND_OFFSET,
      // Op het plein Onder den Toren, ten zuiden, zuidwesten en zuidoosten van
      // de toren; aan de noordkant staan de kerken.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0687100000029292"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (31935,8, 391557,0), in het hart van de achtkantige onderbouw op het maaiveld van Onder den Toren (NAP +4,5 m), +X loodrecht op de oostgevel van de achtkant (RD-richting 13,3 graden) en -Y naar het plein (zuidzuidoosten). building:toren is de stenen achtkant met steunberen, nissen, omloop en pinakels tot +60,8 m, de opbouw en de twee lantaarntjes tot +80,6 m en de keizerskroon met de windvaan tot +90,4 m boven het maaiveld; alles staat recht op of kraagt onder hooguit 40 graden uit, zodat de toren op 1:1000 zonder steun print. De toren hoort bij BAG-pand 0687100000029292, het hele abdijcomplex; dat pand wordt vervangen en building:abdij is de PDOK-reconstructie (3D Basisvoorziening, CC BY 4.0) van de rest ervan, zonder de toren. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`lange-jan-1-${scale}.stl`],
      realWorld: {
        totalHeightM: VANE.top,
        octagonAcrossFlatsM: SHAFT[0][1] * 2,
        buttressTipRadiusM: BUTTRESS.profile[0][1],
        galleryTopM: SHAFT.at(-1)[0],
        firstLanternTopM: 71.8,
        secondLanternTopM: 76.4,
        crownTopM: CROWN.at(-1)[1],
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Abdijtoren",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/28674",
        "PDOK BAG pand 0687100000029292 (achtkant en steunberen van de toren binnen de contour van het abdijcomplex), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: omhullende per richting en hoogte, hoogtes van omloop, lantaarns en kroon, maaiveld",
        "PDOK 3D Basisvoorziening, gebouwtegel t/10/131/283 (CC BY 4.0, Kadaster): reconstructie van de rest van het abdijcomplex",
        "Wikimedia Commons: 2017-06-05 Middelburg Abdijtoren.jpg, Middelburg - View West on 90.5 m high Abdijtoren, nicknamed 'Lange Jan'.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// ---------- data: PDOK-reconstructie van het abdijcomplex ----------
// PDOK-reconstructie (LoD2.2) van BAG-pand 0687100000029292 (abdijcomplex
// Middelburg met Nieuwe Kerk, Koorkerk en Lange Jan), uit de 3D
// Basisvoorziening-gebouwtegel t/10/131/283 (2026-10-03). Hoekpunten in meters
// ten opzichte van RD (31935.8, 391557.0) en ellipsoïdische hoogte 46.709 (de
// vloer van het pand, maaiveld circa NAP +4,5 m), assen langs RD; dubbele en
// ontaarde driehoeken verwijderd.
// Bron:
// https://api.pdok.nl/kadaster/3d-basisvoorziening/ogc/v1/collections/gebouwen/3dtiles/t/10/131/283.glb
// Licentie: CC BY 4, Kadaster (3D Basisvoorziening). Pand:
// NL.IMBAG.Pand.0687100000029292.
// vertices: x, y, z per hoekpunt; triangles: drie hoekpuntindexen per driehoek.
function abdijPdok() {
  return {
    originRd: [31935.8, 391557],
    originHeight: 46.709,
    vertices: [
      -74.25, 44.23, 10.17, -74.24, 44.24, 0, -73.01, 38.88, 18.51, -73.01, 38.89, 0, -71.82, 33.73, 10.17, -71.81, 33.73, 0,
      -71.81, 33.73, 3.63, -71.79, 33.64, 0.01, -71.79, 33.64, 3.63, -71.61, 33.78, 10.18, -71.6, 33.78, 3.66, -71.59, 33.69, 3.66,
      -71.58, 33.69, 10.04, -71.58, 33.7, 0, -68.27, 75.69, 9.64, -68.27, 75.7, 0.01, -66.77, 72.77, 0, -66.77, 72.77, 15.36,
      -66.42, 9.54, 0.01, -66.42, 9.55, 6.66, -66.33, 78.74, 5.61, -66.32, 78.75, 0, -65.83, 7.12, 0, -65.83, 7.12, 10.53,
      -65.7, 9.66, 0, -65.7, 9.66, 6.67, -65.6, 9.15, 0, -65.6, 9.15, 7.47, -65.5, 77.1, 9.61, -65.49, 77.11, 0,
      -65.49, 77.11, 7.4, -65.25, 4.78, 0.01, -65.25, 4.78, 6.81, -65.15, 69.58, 9.33, -65.15, 69.59, 0, -64.92, 3.42, 0,
      -64.92, 3.42, 8.97, -64.53, 1.85, 0.01, -64.53, 1.85, 6.67, -63.12, 84.28, 7.2, -63.11, 84.28, 0, -62.86, 84.58, 0.01,
      -62.85, 84.57, 8.01, -62.85, 84.58, 9.64, -62.64, 84.29, 9.63, -62.64, 84.3, 8.02, -61.91, 78.87, 9.67, -61.9, 78.87, 7.41,
      -61.61, 84.21, 9.63, -61.43, 80.57, 7.39, -61.43, 80.58, 6.12, -61.42, 80.58, 11.94, -61.36, 81.32, 0, -61.35, 81.32, 5.5,
      -61.35, 81.32, 12.59, -61.27, 81.13, 5.7, -61.27, 81.14, 12.58, -61.27, 81.96, 0.01, -61.27, 81.96, 7.43, -61.27, 81.96, 13.18,
      -61.18, 86.67, 0, -61.18, 86.67, 9.68, -61.04, 86.59, 9.68, -61.03, 86.59, 0, -60.98, 82.17, 8.18, -60.98, 82.18, 9.57,
      -60.94, 81.54, 13.36, -60.94, 87.06, 0, -60.94, 87.06, 9.69, -60.93, 81.54, 0, -60.92, 82.1, 8.18, -60.92, 82.1, 9.57,
      -60.92, 82.1, 13.8, -60.74, 83.01, 9.59, -60.65, 79.77, 9.25, -60.64, 79.78, 12.48, -60.58, 87.01, 0, -60.58, 87.01, 9.69,
      -60.44, 84.1, 11.43, -60.44, 84.11, 9.62, -59.9, 78.15, 12.37, -59.59, 88.9, 9.73, -59.59, 88.91, 0, -59.42, 89.22, 0,
      -59.42, 89.22, 9.74, -59.42, 89.22, 10.33, -59.21, 88.7, 0, -59.2, 88.7, 9.73, -58.73, 77.81, 13.82, -58.27, 73.07, 9.26,
      -58.27, 73.07, 11.01, -58.27, 73.08, 0, -58.14, 75.71, 13.14, -58.11, 77.17, 14.25, -58.11, 77.17, 15.29, -57.97, 92.17, 0,
      -57.97, 92.17, 10.03, -57.87, 92.09, 0, -57.86, 92.09, 10.26, -57.76, 76.82, 14.5, -57.67, 92.82, 0, -57.67, 92.83, 9.93,
      -57.6, 92.8, 0, -57.6, 92.8, 10.06, -57.49, 84.82, 9.63, -57.49, 84.83, 25.68, -57.22, 86.67, 15.68, -57.21, 86.67, 9.67,
      -57.03, 73.7, 0.01, -57.02, 73.7, 13.28, -56.97, 87.05, 9.68, -56.97, 87.06, 15.72, -56.91, 83.66, 20.79, -56.91, 83.66, 23.9,
      -56.9, 83.67, 9.6, -56.88, 85.94, 9.65, -56.88, 85.94, 16.78, -56.88, 85.94, 28.93, -56.37, 6.34, 6.8, -56.34, 57.87, 0,
      -56.33, 57.87, 9.85, -56.3, 6.23, 6.62, -56.3, 6.23, 6.97, -56.05, 8.8, 6.98, -56.05, 8.8, 10.48, -55.99, 84.02, 25.89,
      -55.99, 84.03, 14.09, -55.99, 84.03, 19.2, -55.95, 6.29, 6.62, -55.94, 6.29, 6.97, -55.8, 10.7, 6.99, -55.79, 10.7, 7.64,
      -55.79, 10.71, 0, -55.77, 6.55, 6.96, -55.6, 48.69, 0, -55.6, 48.7, 10.43, -55.58, 8.88, 6.97, -55.57, 8.88, 10.48,
      -55.5, 48.51, 0, -55.5, 48.52, 10.73, -55.49, 5.06, 6.96, -55.49, 5.06, 8.97, -55.18, 54.72, 0, -55.18, 54.73, 15.29,
      -54.92, 84.44, 12.93, -54.92, 84.44, 17.34, -54.7, 53.42, 0, -54.7, 53.42, 13.07, -54.7, 53.42, 13.54, -54.59, 3.76, 6.94,
      -54.39, 3.47, 0.01, -54.39, 3.47, 6.47, -54.39, 3.47, 6.93, -54.22, 99.12, 0.01, -54.22, 99.13, 9.84, -54.11, 6.82, 6.94,
      -54.06, 99.06, 0, -54.06, 99.06, 10.11, -54.02, 51.58, 0, -54.02, 51.58, 13.55, -53.84, 5, 6.93, -53.83, 4.99, 5.95,
      -53.8, 99.83, 0, -53.8, 99.84, 9.87, -53.71, 99.81, 0, -53.71, 99.81, 10.02, -53.48, 6.75, 6.02, -53.48, 6.75, 6.93,
      -53.3, 2, 0, -53.29, 1.99, 26.49, -53.27, 3.65, 0, -53.27, 3.65, 6.01, -53.27, 3.65, 6.91, -53.13, 0.76, 24.43,
      -53.12, 0.76, 0.01, -53.05, 52.09, 9.2, -53.04, 52.09, 13.53, -52.99, 6.84, 6.09, -52.99, 6.84, 6.92, -52.97, 7.21, 6.1,
      -52.97, 7.21, 6.92, -52.95, 12.86, 0, -52.95, 12.86, 6.95, -52.94, 86.43, 11.68, -52.94, 86.43, 13.01, -52.89, 51.99, 0,
      -52.89, 51.99, 9.22, -52.89, 51.99, 13.53, -52.75, 12.9, 6.95, -52.74, 12.9, 0.01, -52.74, 12.9, 15.86, -52.69, 2.84, 0.01,
      -52.69, 2.85, 29.61, -52.68, 11.2, 0, -52.67, 11.2, 6.93, -52.66, 3.74, 6.1, -52.66, 3.74, 28.73, -52.66, 3.75, 0,
      -52.59, 101.97, 9.89, -52.59, 101.98, 0, -52.52, 3.08, 0, -52.52, 3.08, 29, -52.51, 52.12, 0, -52.51, 52.12, 9.23,
      -52.48, 101.93, 0, -52.48, 101.94, 10.09, -52.42, 85.37, 0, -52.41, 85.37, 10.15, -52.41, 85.37, 13.02, -52.24, 85.03, 0,
      -52.24, 85.04, 13.02, -52.23, 6.98, 6.2, -52.23, 6.98, 25.96, -52.16, 50.32, 9.29, -52.16, 50.33, 0, -52.15, 7.57, 25,
      -52.14, 7.57, 6.23, -52.14, 7.57, 6.91, -52.13, 90.54, 13.81, -52.13, 90.55, 13.69, -52.08, 7, 6.23, -52.08, 7, 25.96,
      -52.07, 0.07, 0.01, -52.06, 0.08, 25.6, -52.06, 1.81, 29.06, -52.05, 90.17, 13.31, -52.05, 90.17, 14.21, -52.04, 52.35, 9.25,
      -52.04, 52.35, 13.52, -52.03, 52.34, 9.8, -51.97, 49.29, 0, -51.97, 49.29, 10.88, -51.9, 0.1, 0, -51.89, 0.09, 26.06,
      -51.89, 5.3, 6.24, -51.89, 5.31, 29.17, -51.85, 59.89, 0.01, -51.85, 59.89, 9.82, -51.84, 5.95, 6.25, -51.84, 5.96, 27.79,
      -51.84, 59.89, 10.64, -51.8, 3.57, 6.23, -51.8, 3.57, 26.89, -51.8, 88.89, 11.98, -51.79, 3.57, 26.17, -51.78, 13.09, 0,
      -51.77, 13.09, 15.81, -51.73, 3.87, 6.24, -51.72, 3.86, 26.65, -51.51, 11.4, 18.73, -51.5, 11.4, 0.01, -51.36, 5.32, 28.99,
      -51.36, 5.32, 29.04, -51.35, 5.39, 28.88, -51.34, 5.39, 6.32, -51.34, 5.39, 29.15, -51.33, 0.62, 25.91, -51.33, 0.62, 28.44,
      -51.32, 3.48, 25.87, -51.25, 104.42, 0, -51.25, 104.42, 9.86, -51.18, 6.05, 6.35, -51.18, 6.05, 27.82, -51.12, 104.37, 0.01,
      -51.11, 104.38, 10.09, -51.08, 104.56, 0, -51.08, 104.56, 12.07, -51.06, 0.67, 21.99, -51.06, 0.67, 25.5, -51.05, 0.67, 27.76,
      -51, 89.81, 13.82, -50.97, 0.22, 22.04, -50.97, 104.5, 12.29, -50.96, 0.21, 0, -50.96, 0.21, 24.6, -50.96, 104.5, 0,
      -50.96, 104.5, 10.21, -50.91, 0.22, 0, -50.91, 0.22, 22, -50.88, -9.78, 0, -50.88, -9.77, 20.29, -50.84, 50.62, 9.34,
      -50.78, -0.58, 0, -50.77, -0.58, 22.1, -50.74, 88.6, 10.28, -50.73, 88.6, 12.59, -50.72, -10.8, 0.01, -50.72, -10.8, 18.5,
      -50.66, 2.96, 24.8, -50.48, 89.64, 13.63, -50.48, 89.64, 14.08, -50.47, 89.64, 10.7, -50.41, 60.54, 0, -50.41, 60.54, 13.22,
      -50.22, 5.49, 29.01, -50.13, 52.82, 9.31, -50.12, -4.54, 28.98, -50.11, -4.54, 0, -50.1, 89.51, 10.09, -50.1, 89.51, 13.49,
      -50.1, 89.52, 0, -49.97, 50.04, 9.39, -49.96, 50.03, 10.52, -49.84, 0.88, 21, -49.84, 0.88, 24.76, -49.7, 48.68, 12.62,
      -49.7, 58.77, 13.78, -49.7, 58.78, 12.91, -49.7, 58.78, 12.95, -49.69, 48.68, 9.43, -49.61, 0.29, 20.98, -49.55, 47.9, 13.82,
      -49.55, 90.51, 11.83, -49.54, 47.9, 10.55, -49.54, 90.51, 10.09, -49.54, 90.52, 0, -49.31, 58.98, 13.66, -49.29, -9.47, 0,
      -49.29, -9.47, 20.36, -49.18, 58.5, 13.66, -49.06, 58.44, 13.63, -49.06, 58.44, 13.83, -48.99, -10.56, 0, -48.99, -10.56, 18.41,
      -48.94, 44.81, 12.34, -48.94, 44.81, 18.59, -48.75, 45.78, 13.72, -48.75, 45.79, 17.22, -48.68, 43.47, 16.44, -48.67, 43.47, 10.32,
      -48.66, -12.24, 0, -48.66, -12.23, 15.46, -48.65, 57.57, 13.59, -48.65, 57.57, 15.4, -48.6, 59.34, 13.44, -48.6, 59.34, 14.96,
      -48.58, 57.41, 15.12, -48.57, 57.41, 13.57, -48.43, 44.93, 18.58, -48.43, 44.94, 12.41, -48.39, 54.27, 10.35, -48.33, 56.48, 13.59,
      -48.23, 43.44, 0.01, -48.23, 43.44, 16.22, -48.14, 54.91, 11.15, -48.05, 53.75, 9.38, -48.05, 53.75, 10.52, -47.98, 55.07, 11.28,
      -47.97, 55.07, 11.51, -47.97, 55.08, 13.6, -47.95, 43.67, 10.43, -47.94, 43.67, 16.46, -47.9, 43.53, 0.01, -47.9, 43.53, 10.22,
      -47.89, 43.52, 16.23, -47.86, -10.34, 0.01, -47.86, -10.34, 18.45, -47.76, 53.88, 11.05, -47.75, 53.89, 9.39, -47.64, -12.06, 0,
      -47.63, -12.06, 15.46, -47.62, 102.66, 16.67, -47.62, 102.66, 18.75, -47.58, 53.49, 9.4, -47.57, 53.49, 11.05, -47.38, 52.75, 9.43,
      -47.38, 52.76, 10.84, -47.27, 102.46, 19.41, -47.27, 102.47, 16.04, -47.14, 55.88, 13.3, -47.09, 39.84, 0.01, -47.09, 39.84, 10.27,
      -46.92, 52.05, 9.47, -46.92, 52.05, 11.07, -46.64, 102.11, 14.88, -46.63, 102.11, 18.21, -46.3, 65.17, 18.92, -46.3, 65.18, 24.44,
      -45.87, 102.04, 17.08, -45.86, 102.03, 13.76, -45.65, 49.25, 9.59, -45.65, 49.26, 11.09, -45.53, 49.27, 11.28, -45.53, 49.28, 9.59,
      -45.45, 60.98, 19.22, -45.45, 60.99, 19.46, -45.45, 60.99, 20.75, -45.25, 14.1, 0, -45.25, 14.11, 15.91, -45.02, 12.4, 18.83,
      -45.02, 12.41, 0, -44.7, 48.48, 10.91, -44.7, 48.49, 11.98, -44.58, 48.54, 10.85, -44.58, 48.54, 12.19, -44.52, 59.17, 19.36,
      -44.27, 48.07, 12.34, -44.27, 69.14, 0, -44.27, 69.14, 13.07, -44.26, 48.07, 11.59, -44.26, 69.14, 23.88, -44.14, 14.29, 15.89,
      -44.14, 14.3, 0, -43.93, 100.58, 9.96, -43.93, 100.59, 0, -43.92, 100.58, 0, -43.92, 100.58, 13.1, -43.88, 100.66, 9.95,
      -43.88, 100.66, 13.1, -43.79, 12.57, 0, -43.78, 12.57, 18.9, -43.76, 100.37, 0, -43.76, 100.37, 12.69, -43.28, 47.11, 13.18,
      -43.13, 62.19, 25.07, -43.12, 62.19, 16.49, -43.12, 62.2, 15.11, -43.01, 66.63, 24.35, -43.01, 66.64, 0, -42.93, 46.77, 13.62,
      -42.92, 46.77, 13.47, -42.92, 46.77, 13.74, -42.92, 46.77, 13.77, -42.9, 46.67, 13.61, -42.74, 46.79, 13.76, -42.74, 46.79, 13.92,
      -42.63, 44.94, 0, -42.63, 44.94, 13.51, -42.62, 44.94, 11.02, -42.44, 47.46, 14.65, -42.28, 100.05, 10.34, -42.27, 100.05, 0.01,
      -42.23, 45.05, 0.01, -42.23, 45.05, 14.21, -42.05, 44.22, 0, -42.05, 44.22, 14.22, -42.05, 44.22, 16.62, -41.92, 48.59, 16.18,
      -41.91, 48.59, 15.89, -41.9, 43.49, 0, -41.9, 43.49, 17.71, -41.71, 67.27, 0.01, -41.71, 67.27, 24.31, -41.68, 42.43, 14.26,
      -41.68, 42.43, 16.02, -41.67, 42.42, 0.01, -41.6, 45.05, 15.24, -41.25, -9.24, 18.41, -41.24, -9.24, 0.01, -41.18, 63.06, 0,
      -41.18, 63.06, 11.59, -41.14, 44.57, 15.86, -41.12, 103.25, 0, -41.12, 103.25, 11.53, -40.88, 100.99, 0, -40.88, 100.99, 9.21,
      -40.87, -10.89, 0.01, -40.87, -10.89, 15.5, -40.68, 102.35, 0, -40.68, 102.35, 10.12, -40.53, 50.48, 22.48, -40.53, 50.49, 19.51,
      -40.4, 43.58, 16.75, -40.4, 43.58, 17.19, -40.32, 43.45, 16.87, -40.31, 43.46, 16.96, -40.22, 49.81, 19.12, -40.22, 49.81, 22.5,
      -40.22, 50.63, 18.95, -40.21, 49.81, 19.52, -40.21, 50.62, 22.47, -40.07, -9.02, 18.46, -40.07, -9.01, 0, -40.05, 50.31, 18.93,
      -40.05, 50.31, 22.48, -40.05, 63.79, 24.96, -40.04, 63.79, 0, -40.04, 63.8, 9.37, -40, 63.7, 0, -40, 63.7, 9.37,
      -39.88, -10.69, 15.55, -39.87, -10.69, 0, -39.17, 50.57, 17.41, -39.16, 50.57, 21.12, -39.16, 50.57, 22.46, -38.9, 50.75, 21.62,
      -38.9, 50.76, 16.89, -38.9, 50.76, 22.11, -38.5, 49.49, 21.86, -36.96, 52.16, 12.97, -36.96, 52.16, 18.43, -36.03, 52.32, 0,
      -36.03, 52.32, 11.46, -36.03, 52.32, 16.84, -35.94, 46.89, 18.47, -35.92, 14.74, 14.68, -35.91, 14.74, 0, -35.91, 14.74, 17.42,
      -35.76, 46.07, 18.44, -35.72, 13.85, 18.96, -35.72, 13.86, 0, -35.65, 51.53, 16.46, -35.65, 51.53, 17.29, -35.64, 51.52, 0,
      -35.52, 51.26, 0.01, -35.52, 51.26, 17.8, -35.46, 50.62, 16.45, -35.45, 50.62, 18.98, -34.97, 48.23, 16.42, -34.96, 48.22, 18.51,
      -34.96, 51.34, 0, -34.96, 51.34, 17.82, -34.96, 51.5, 0, -34.95, 51.5, 17.52, -34.49, 50.86, 16.65, -34.49, 50.86, 18.81,
      -34.28, 49.15, 16.6, -34.28, 49.15, 18.54, -34.28, 49.15, 21.95, -34.19, -7.98, 0, -34.19, -7.97, 18.53, -34.14, 43.68, 16.54,
      -34.14, 43.68, 18.38, -34.05, 47.24, 18.48, -34.05, 47.24, 25.47, -34, 14.78, 17.88, -33.83, -9.63, 0, -33.82, -9.64, 15.59,
      -33.57, 43.22, 18.36, -33.57, 43.22, 18.37, -33.57, 43.23, 15.73, -33.57, 43.24, 18.37, -33.51, 42.74, 17.49, -33.5, 42.74, 15.79,
      -33.27, 40.79, 16.03, -33.22, 40.34, 17.03, -33.21, 40.34, 16.09, -33.2, 42.29, 15.43, -33.2, 42.29, 16.63, -33.16, 39.93, 16.14,
      -33.01, -7.78, 0, -33, -7.78, 18.51, -32.85, 14.8, 18.15, -32.85, 14.81, 19.78, -32.76, -9.42, 15.65, -32.76, -9.41, 0.01,
      -32.74, 13.96, 19.61, -32.74, 13.96, 19.69, -32.16, 42.45, 16.63, -32.15, 42.44, 12.73, -32.15, 42.45, 13.64, -32.07, 42.05, 13.64,
      -32.04, 39.29, 14.49, -31.61, 42.52, 16.62, -31.61, 42.53, 12.73, -31.57, 14.51, 19.01, -31.57, 14.51, 21.82, -31.49, 42.67, 12.46,
      -31.48, 42.67, 16.83, -31.48, 118.56, 0, -31.48, 118.56, 11.52, -31.39, 42.56, 16.62, -31.38, 42.56, 12.72, -31.27, 38.12, 13.59,
      -31.26, 38.12, 13.4, -31.24, 38.54, 12.68, -31.23, 38.54, 13.41, -31.16, 38.13, 13.4, -30.85, 14.85, 20.51, -30.84, 14.86, 18.64,
      -30.48, 34.28, 13.43, -30.48, 34.28, 13.55, -30.4, 34.23, 13.42, -30.24, 38.66, 12.66, -30.24, 38.66, 13.39, -30.19, 38.3, 13.4,
      -30.18, 40.77, 17.05, -30.13, 32.87, 13.43, -30.13, 37.86, 13.39, -30.13, 37.86, 13.63, -30.12, 37.86, 14.28, -30.12, 40.86, 16.58,
      -30.12, 40.86, 16.86, -30.12, 40.86, 17.22, -29.99, 15.26, 19.8, -29.98, 15.25, 18.95, -29.89, 14.87, 18.87, -29.89, 14.87, 18.92,
      -29.89, 14.87, 19.76, -29.83, 32.98, 13.43, -29.83, 32.99, 12.88, -29.8, 37.86, 14.22, -29.79, 37.86, 14.38, -29.77, 14.4, 19.7,
      -29.75, 35.11, 13.42, -29.75, 35.11, 13.61, -29.69, 41.54, 15.51, -29.57, 37.79, 14.6, -29.54, 33.09, 13.43, -29.48, 37.76, 14.69,
      -29.48, 37.76, 14.76, -29.24, 34.88, 13.41, -29.23, 34.89, 14.47, -29.15, 34.69, 13.41, -29.15, 34.69, 14.58, -29.14, 40.04, 15.03,
      -29.14, 40.04, 15.22, -29, 29.6, 13.23, -29, 29.6, 13.53, -28.99, 37.41, 15.54, -28.98, 39.86, 14.8, -28.97, 29.4, 12.79,
      -28.97, 29.4, 13.49, -28.97, 29.4, 13.53, -28.93, 34.21, 13.41, -28.87, 34.09, 13.1, -28.87, 34.09, 13.41, -28.8, 33.95, 13.41,
      -28.79, 42.95, 12.68, -28.79, 42.95, 13.28, -28.79, 42.95, 16.61, -28.69, 44.36, 19.03, -28.68, 123.63, 12.05, -28.67, 123.63, 2.58,
      -28.59, 33.45, 13.41, -28.59, 33.46, 15.21, -28.58, 33.46, 14.52, -28.51, 33.29, 14.9, -28.51, 33.29, 15.3, -28.48, 42.99, 16.61,
      -28.48, 43, 12.68, -28.48, 43.43, 17.37, -28.48, 43.43, 19.43, -28.41, 43.09, 12.5, -28.4, 43.09, 16.75, -28.38, 43.01, 8.5,
      -28.38, 43.01, 16.61, -28.38, 43.02, 12.5, -28.19, 43.34, 17.14, -28.19, 43.35, 19.82, -28.18, 38.97, 12.71, -28.18, 38.97, 13.64,
      -28.11, 119.75, 7.84, -28.1, 119.74, 0, -28.09, 25.61, 13.98, -28.09, 25.61, 14.16, -28.07, 22.46, 13.42, -28.06, 25.66, 14.24,
      -28.05, 25.66, 14.1, -28.03, 119.4, 7.43, -28.02, 119.4, 0, -27.97, 44.96, 19.89, -27.96, 16.21, 15.29, -27.96, 16.22, 19.88,
      -27.84, 36.05, 17.25, -27.82, 44.28, 20.18, -27.81, 44.28, 18.67, -27.77, 15.58, 19.81, -27.77, 15.59, 15.16, -27.77, 20.96, 13.4,
      -27.77, 25.24, 14.64, -27.76, 20.96, 13.58, -27.76, 20.96, 13.59, -27.76, 25.24, 13.08, -27.75, 20.87, 13.4, -27.73, 20.75, 13.11,
      -27.72, 20.75, 13.4, -27.71, 39.04, 12.72, -27.7, 20.61, 13.4, -27.7, 31.12, 16.2, -27.67, 20.46, 13.39, -27.67, 20.46, 13.51,
      -27.66, 20.46, 13.73, -27.61, 125.35, 12.06, -27.6, 125.35, 2.58, -27.57, 44.1, 18.3, -27.56, 31.29, 16.49, -27.56, 31.29, 16.53,
      -27.56, 36.4, 17.81, -27.56, 36.4, 17.96, -27.56, 36.4, 17.97, -27.56, 36.4, 18.01, -27.56, 44.11, 20.53, -27.55, 119.4, 0,
      -27.55, 119.4, 2.6, -27.55, 119.4, 6.77, -27.49, 39.07, 8.4, -27.49, 39.07, 12.28, -27.48, 39.07, 12.73, -27.43, 26.38, 15.51,
      -27.34, 20.36, 14.04, -27.16, 24.57, 14.75, -27.16, 24.58, 15.55, -27.16, 32.27, 17.43, -27.04, 24.19, 15.63, -27.04, 24.19, 15.66,
      -27.03, -6.73, 0, -27.02, -6.73, 18.58, -27.02, 32.16, 17.66, -27.02, 32.17, 17.7, -26.93, 16.49, 13.48, -26.92, 16.49, 19.9,
      -26.9, 16.71, 13.35, -26.9, 16.71, 13.88, -26.9, 16.72, 13.53, -26.89, 32.08, 17.87, -26.89, 32.08, 17.92, -26.87, 32.02, 17.87,
      -26.87, 32.02, 17.92, -26.86, 16.51, 19.9, -26.85, 16.51, 13.35, -26.85, 16.51, 13.39, -26.73, 15.9, 11.96, -26.73, 15.9, 19.83,
      -26.65, -8.38, 0, -26.65, -8.38, 15.66, -26.61, 16.85, 14.11, -26.35, 42.89, 8.49, -26.35, 143.74, 11.24, -26.35, 143.74, 12.15,
      -26.34, 143.74, 0, -26.33, 35.52, 15.55, -26.26, 16.6, 19.9, -26.25, 16.6, 13.42, -26.25, 27.74, 17.93, -26.25, 27.74, 18.18,
      -26.21, 32.88, 16.44, -26.18, 27.69, 18.05, -26.03, 27.85, 18.36, -26.03, 144.24, 0, -26.03, 144.24, 10.66, -26.02, 27.85, 17.46,
      -26.02, 27.86, 17.75, -25.91, -6.54, 0, -25.91, -6.53, 18.57, -25.9, 42.97, 9.44, -25.89, 42.97, 8.49, -25.88, 39.31, 8.4,
      -25.88, 39.31, 12.76, -25.8, 27.35, 17.17, -25.79, 39.04, 8.51, -25.78, 39.03, 13.34, -25.73, 42.86, 8.49, -25.72, 34.52, 13.1,
      -25.72, 42.85, 9.76, -25.63, 23.36, 17.96, -25.62, -8.19, 15.68, -25.62, -8.18, 0, -25.61, 23.25, 17.96, -25.58, 39.35, 9.04,
      -25.58, 39.35, 12.77, -25.58, 43.43, 8.5, -25.58, 43.43, 16.6, -25.54, 39.01, 13.47, -25.53, 39.01, 8.39, -25.53, 39.01, 12.56,
      -25.48, 39.09, 13.33, -25.47, 39.09, 8.52, -25.2, 34.71, 12.84, -25.2, 34.72, 13.36, -25.2, 34.72, 13.37, -25.06, 34.62, 13.09,
      -24.99, 28.92, 0, -24.99, 28.93, 15.23, -24.99, 28.93, 15.73, -24.85, 30.78, 14.46, -24.85, 30.78, 14.53, -24.82, 18.8, 18.03,
      -24.77, 30.74, 9.63, -24.77, 30.75, 14.43, -24.76, 30.75, 14.31, -24.73, 18.81, 18.03, -24.53, 30.59, 9.4, -24.53, 30.59, 14.01,
      -24.33, 34.1, 8.61, -24.33, 34.1, 11.67, -24.33, 34.1, 14.41, -24.32, 34.1, 12.56, -24.22, 16.92, 13.49, -24.22, 16.92, 19.91,
      -24.19, 30.12, 12.86, -24.19, 30.12, 13.4, -24.12, 26.29, 14.3, -24.12, 117.25, 2.63, -24.11, 117.24, 0.01, -24.07, 30.26, 13.13,
      -24.04, 30.29, 8.92, -24.04, 30.29, 13.08, -24.04, 30.29, 13.18, -24.04, 41.7, 12.93, -23.83, 33.74, 8.13, -23.83, 33.75, 11.72,
      -23.81, 26.25, 0, -23.81, 26.25, 13.75, -23.8, 25.97, 13.8, -23.8, 30.17, 8.67, -23.8, 30.18, 0, -23.8, 30.18, 13.39,
      -23.79, 25.97, 13.46, -23.78, 25.82, 13.14, -23.77, 25.83, 13.8, -23.77, 30.6, 13.8, -23.77, 30.61, 8.57, -23.73, 25.53, 13.79,
      -23.69, 39.3, 8.39, -23.56, 34.59, 7.7, -23.56, 34.6, 9.81, -23.5, 25.5, 0, -23.5, 25.5, 13.38, -23.4, 26, 0,
      -23.4, 26, 13.04, -23.37, 130.11, 0, -23.37, 130.11, 10.34, -23.35, 25.97, 0, -23.35, 25.98, 12.95, -23.24, 21.76, 13.92,
      -23.18, 129.99, 2.59, -23.17, 25.86, 0, -23.17, 25.86, 12.64, -23.17, 129.99, 0, -23.17, 129.99, 9.95, -23.08, 21.42, 13.1,
      -23.08, 21.42, 13.72, -23.04, 45.05, 18.74, -23.03, 21.25, 13.44, -23.03, 21.25, 13.65, -23.02, 21.25, 13.41, -22.99, 36.44, 6.77,
      -22.98, 36.44, 0, -22.98, 36.44, 7.88, -22.91, 21.44, 13.39, -22.91, 21.45, 13.09, -22.88, 21.28, 13.09, -22.88, 21.28, 13.37,
      -22.88, 22.13, 0, -22.88, 22.13, 13.15, -22.88, 141.22, 16.62, -22.88, 141.22, 19.39, -22.85, 21.53, 13.26, -22.81, 44.43, 17.6,
      -22.8, 44.43, 9.4, -22.8, 44.43, 19.05, -22.76, 21.66, 13.05, -22.76, 21.66, 13.52, -22.76, 21.66, 13.91, -22.67, 21.92, 0,
      -22.67, 21.92, 12.78, -22.66, 21.92, 13.44, -22.63, 141.03, 17.02, -22.63, 141.03, 18.87, -22.61, 21.88, 12.7, -22.61, 21.88, 13.54,
      -22.61, 43.9, 9.15, -22.61, 43.9, 16.62, -22.6, 43.9, 8.46, -22.53, 37.88, 0, -22.53, 37.88, 6.36, -22.5, 43.69, 8.99,
      -22.47, 30.37, 0, -22.47, 30.37, 7.19, -22.4, 17.16, 13.4, -22.4, 17.17, 13.48, -22.4, 17.17, 13.5, -22.4, 17.17, 19.92,
      -22.38, 17.19, 13.45, -22.32, 16.7, 19.87, -22.31, 16.7, 12.49, -22.26, 45.87, 19.95, -22.21, 17.38, 13.01, -22.21, 17.38, 13.76,
      -22.2, 21.33, 14.69, -22.2, 44.04, 16.76, -22.2, 44.04, 19.88, -22.19, 44.04, 8.22, -22.16, 43.9, 8.19, -22.16, 43.9, 16.5,
      -22.08, 17.11, 19.91, -22.08, 17.12, 13.21, -22.02, 43.92, 8.5, -22.02, 43.92, 16.5, -21.95, 39.9, 8.97, -21.92, 17.01, 12.96,
      -21.92, 17.01, 19.9, -21.91, 43.85, 8.72, -21.9, 43.85, 16.35, -21.85, 44.52, 20.42, -21.84, 44.52, 17.5, -21.79, 17.24, 13.37,
      -21.79, 17.25, 19.92, -21.64, 39.63, 3.77, -21.64, 39.63, 8.4, -21.6, 39.38, 0, -21.6, 39.38, 3.77, -21.6, 39.38, 7.91,
      -21.58, 39.96, 8.97, -21.57, 39.95, 8.16, -21.55, 22.11, 0.01, -21.54, 22.11, 13.43, -21.51, 39.53, 0, -21.51, 39.53, 8.15,
      -21.45, 18.26, 15.17, -21.44, 43.93, 8.7, -21.44, 43.93, 9.76, -21.44, 43.94, 16.37, -21.42, 39.67, 0, -21.42, 39.68, 8.39,
      -21.38, 39.41, 0, -21.38, 39.41, 7.91, -21.21, 40.01, 8.96, -21.16, 45.4, 18.85, -21.01, -10.9, 0, -21, -10.91, 7.82,
      -20.93, -10.67, 0.01, -20.93, -10.67, 7.94, -20.93, -10.67, 8.28, -20.9, 141.62, 16.99, -20.55, 19.86, 17.93, -20.37, 19.89, 17.93,
      -20.25, 55.3, 0, -20.25, 55.3, 21.38, -20.22, 53.55, 17.82, -20.15, -8.51, 0.01, -20.15, -8.51, 7.85, -20.15, -8.5, 8.83,
      -20.12, 53.79, 18.55, -20.11, 53.79, 0.01, -20.11, 53.79, 17.42, -20.1, 55.49, 22.14, -20.1, 55.5, 25.85, -20.09, -5.55, 0,
      -20.09, -5.55, 18.58, -20.09, 55.49, 0.01, -20.05, 137.43, 0, -20.05, 137.43, 12.12, -20.03, 53.8, 0, -20.03, 53.8, 18.76,
      -20.01, -5.99, 0, -20.01, -5.99, 4.93, -20.01, -5.99, 17.79, -19.98, 44.26, 8.51, -19.97, 44.19, 8.68, -19.97, 44.19, 16.43,
      -19.97, 44.26, 16.55, -19.95, 19.95, 16.91, -19.95, 19.95, 17.93, -19.92, -7.87, 7.69, -19.92, -7.86, 0, -19.91, 135.64, 0.01,
      -19.9, 135.64, 10.35, -19.87, 20.04, 17.78, -19.86, 20.05, 16.67, -19.78, 137.87, 0, -19.78, 137.87, 24.66, -19.77, 137.88, 12.13,
      -19.76, 53.32, 18.37, -19.71, -7.54, 0.01, -19.71, -7.53, 4.85, -19.71, -7.53, 4.95, -19.7, -7.48, 4.95, -19.7, 42.41, 12.94,
      -19.7, 42.41, 12.97, -19.69, -7.71, 7.46, -19.68, -7.71, 0, -19.68, -7.71, 4.55, -19.66, -7.82, 0, -19.66, -7.81, 7.67,
      -19.65, 42.48, 12.82, -19.59, -10.63, 10.49, -19.49, 19.1, 16.17, -19.39, 56.37, 23.79, -19.39, 56.38, 0, -19.25, 136.68, 0,
      -19.25, 136.69, 21.39, -19.22, 146.48, 0, -19.22, 146.49, 10.72, -19.22, 146.49, 12.15, -19.17, -9.03, 10.13, -19.16, -5.85, 7.58,
      -19.15, -5.85, 4.93, -19.15, -5.85, 17.79, -19.13, -13.14, 7.72, -19.13, -13.13, 0.01, -19.13, -13.13, 7.96, -19.04, -13.24, 0.01,
      -19.04, -13.24, 7.71, -19.04, 137.01, 22.34, -19.04, 137.02, 0, -19, -13.1, 7.97, -18.95, 53.88, 17.57, -18.94, 22.33, 13.52,
      -18.94, 22.33, 13.8, -18.94, 53.28, 18.66, -18.94, 53.28, 20.17, -18.94, 53.88, 21.41, -18.92, 139.25, 12.14, -18.91, 139.25, 28.58,
      -18.89, 44.43, 8.53, -18.89, 44.43, 16.57, -18.85, 22.57, 0, -18.85, 22.57, 13.37, -18.85, 136.61, 21.2, -18.84, -9.22, 10.57,
      -18.84, -9.21, 10.91, -18.84, 136.61, 0, -18.75, 50.02, 28.37, -18.74, 50.03, 24.6, -18.73, -10.5, 12.08, -18.7, 22.18, 13,
      -18.7, 22.19, 14.14, -18.67, 23, 0, -18.66, 23, 12.62, -18.6, 22.6, 13.38, -18.6, 22.61, 0, -18.59, -9.84, 11.84,
      -18.55, 44.29, 16.22, -18.54, 44.28, 9.01, -18.54, 44.29, 9.82, -18.51, 54.25, 23.16, -18.51, 138.76, 11.14, -18.51, 138.77, 27.25,
      -18.43, 44.46, 9.52, -18.43, 44.46, 16.5, -18.38, 49.61, 28.36, -18.37, -10.43, 12.71, -18.37, -10.43, 12.75, -18.37, -10.42, 13.02,
      -18.37, 49.61, 25.44, -18.26, -5.7, 7.6, -18.26, -5.7, 17.78, -18.24, -10.41, 12.98, -18.24, -10.41, 13.03, -18.22, -10.77, 12.52,
      -18.21, -10.41, 13.04, -18.18, 53.99, 17.57, -18.18, 53.99, 23.37, -18.18, 54, 22.59, -18.14, 126.82, 0, -18.13, 126.82, 2.63,
      -18.12, 18.74, 13.08, -18.12, 18.74, 15.06, -18.07, -10.4, 13.21, -18.07, -10.4, 13.27, -18.07, -10.39, 13.06, -18.06, -10.71, 12.59,
      -18.06, -10.71, 12.85, -18.06, -10.71, 12.98, -18.04, -10.65, 12.97, -18.03, -10.64, 12.97, -18.03, -10.64, 13, -18.03, 44.54, 8.59,
      -18.02, 44.56, 16.54, -17.99, -10.39, 13.06, -17.99, 56.6, 0.01, -17.99, 56.6, 20.63, -17.83, 44.61, 8.15, -17.83, 44.61, 16.59,
      -17.72, 44.63, 16.6, -17.71, 44.63, 8.4, -17.61, 48.77, 28.34, -17.6, 48.77, 23.79, -17.58, 40.56, 8.88, -17.55, -11.57, 10.64,
      -17.54, -11.57, 11.4, -17.53, 18.58, 14.39, -17.52, 18.58, 14.57, -17.47, -9.92, 11.73, -17.47, -9.92, 12.35, -17.43, -4.53, 19.54,
      -17.41, 142.82, 18.52, -17.41, 142.83, 16.95, -17.38, 142.76, 16.84, -17.38, 142.76, 18.63, -17.35, -8.57, 9.8, -17.34, 18.77, 14.88,
      -17.33, 40.33, 0, -17.33, 40.33, 8.4, -17.32, 44.68, 16.59, -17.31, 44.69, 9.27, -17.27, 40.6, 8.19, -17.27, 40.6, 8.88,
      -17.26, -7.31, 4.58, -17.26, -7.31, 7.44, -17.24, -6.9, 5.29, -17.24, -6.9, 7.45, -17.24, -6.9, 15.45, -17.23, 39.73, 0.01,
      -17.23, 39.73, 7.26, -17.2, 44.58, 9.5, -17.2, 44.59, 8.83, -17.19, 44.59, 16.39, -17.13, -5.46, 17.86, -17.13, -5.46, 19.63,
      -17.12, -5.51, 7.49, -17.11, -5.51, 17.77, -17.11, -5.51, 19.64, -17.08, -10.16, 11.42, -17.05, -7.65, 8.15, -17.05, 19.06, 15.64,
      -17.05, 19.07, 15.36, -17.04, -7.28, 7.44, -17.04, 54.16, 17.57, -17.04, 54.17, 20, -17, 55.81, 0, -17, 55.81, 18.95,
      -16.96, 21.15, 16.58, -16.96, 40.65, 8.87, -16.95, 40.39, 0, -16.95, 40.39, 8.4, -16.93, 136.48, 7.8, -16.93, 136.48, 21.04,
      -16.93, 136.49, 0.01, -16.92, -11.75, 10.05, -16.88, -7.57, 7.42, -16.88, -7.57, 8.03, -16.88, -7.56, 7.76, -16.84, 55.15, 15.83,
      -16.84, 55.16, 0, -16.83, 55.16, 18.98, -16.79, 139.36, 11.14, -16.79, 139.36, 12.53, -16.78, 139.36, 29.09, -16.74, 23.57, 0,
      -16.74, 23.58, 12.13, -16.73, -7.49, 7.43, -16.7, 141.37, 14.26, -16.7, 141.37, 15.83, -16.66, 136.46, 7.59, -16.66, 136.47, 0,
      -16.63, 22.93, 0, -16.63, 22.94, 13.34, -16.63, 54.35, 0.01, -16.63, 54.35, 17.36, -16.5, -7.75, 7.41, -16.24, 49.5, 28.35,
      -16.23, 49.5, 24.68, -16.17, -8.42, 7.75, -16.17, -8.42, 9.28, -16.17, 20.56, 17.92, -16.17, 20.56, 18.19, -16.12, 20.64, 17.77,
      -16.12, 20.64, 18.34, -16.08, 49.78, 25.13, -16.08, 49.78, 25.76, -16.08, 49.78, 28.35, -16.05, 139.35, 0, -16.05, 139.35, 12,
      -16.02, -8.32, 9.28, -16.02, -8.31, 7.39, -16, 40.54, 0.01, -16, 40.54, 8.4, -15.97, -9.02, 8.23, -15.97, 49.98, 25.44,
      -15.95, -12.73, 7.7, -15.95, -9.93, 9.39, -15.94, -12.74, 0, -15.9, -9.24, 7.85, -15.9, -9.23, 8.4, -15.83, 16.97, 24.29,
      -15.82, 16.97, 19.82, -15.8, 43.42, 12.11, -15.8, 43.42, 12.16, -15.75, -12.09, 0, -15.75, 16.65, 19.79, -15.75, 16.65, 24.88,
      -15.74, -12.09, 7.54, -15.74, -12.09, 8.95, -15.64, 18.07, 13.04, -15.64, 18.08, 19.94, -15.49, 138.26, 9.81, -15.49, 138.27, 0,
      -15.41, 43.18, 12.83, -15.41, 43.18, 12.93, -15.4, 43.1, 12.93, -15.37, -9.55, 0.01, -15.37, -9.55, 7.99, -15.29, -9.7, 8.04,
      -15.29, -9.69, 0.01, -15.29, -9.69, 8.25, -15.28, 17.97, 12.75, -15.28, 17.98, 19.93, -15.28, 17.98, 22.69, -15.25, 18.04, 22.6,
      -15.24, 18.04, 12.85, -15.21, 147.81, 0, -15.21, 147.81, 12.14, -15.13, 43.53, 12.14, -15.13, 43.53, 12.22, -15.12, -9.36, 0.01,
      -15.12, -9.36, 6.89, -15.12, -9.36, 7.34, -15.11, -10, 7.68, -15.1, -10, 0.01, -14.99, 148.2, 0, -14.99, 148.2, 11.66,
      -14.65, 23.68, 0, -14.65, 23.68, 12.55, -14.65, 143.77, 18.45, -14.61, 23.43, 0, -14.61, 23.43, 13.03, -14.58, 23.26, 13.35,
      -14.55, 148.3, 0, -14.55, 148.3, 11.73, -14.5, 23.55, 12.82, -14.5, 23.56, 0, -14.49, 11.41, 28.94, -14.49, 11.41, 34.31,
      -14.46, 19.14, 14.71, -14.45, 45.1, 8.7, -14.45, 45.1, 16.55, -14.44, 23.27, 13.04, -14.44, 23.27, 13.38, -14.38, 10.96, 28.14,
      -14.38, 10.96, 35.06, -14.38, 10.96, 35.11, -14.37, 23.77, 12.46, -14.37, 23.78, 0, -14.3, 23.41, 0.01, -14.3, 23.41, 13.16,
      -14.28, 23.29, 13.39, -14.27, 148.16, 0, -14.27, 148.16, 12.07, -14.23, 6.52, 21.4, -14.22, 6.52, 27.44, -14.08, 45.17, 8.7,
      -14.08, 45.17, 9.52, -14.08, 45.17, 16.57, -14, 6.03, 21.37, -14, 6.03, 26.54, -13.75, 19.23, 13.1, -13.74, 19.23, 14.65,
      -13.72, 18.27, 12.82, -13.72, 18.27, 22.6, -13.66, 39.72, 0, -13.65, 39.73, 6.19, -13.62, 45.24, 16.58, -13.61, 45.24, 8.5,
      -13.59, 18.51, 13.23, -13.58, 18.5, 22.23, -13.51, 39.89, 6.46, -13.51, 39.9, 0.01, -13.5, 23.35, 0, -13.49, 23.36, 13.49,
      -13.48, 7.2, 28.39, -13.47, 7.2, 21.42, -13.46, 45.24, 8.19, -13.46, 45.25, 16.55, -13.35, 6.66, 21.4, -13.35, 6.67, 27.46,
      -13.34, 4.62, 23.95, -13.25, 144.25, 0.01, -13.25, 144.25, 18.3, -13.25, 144.26, 18.42, -13.23, 41.29, 8.96, -13.09, 19.31, 14.59,
      -13.03, 3.94, 22.69, -13.02, 3.93, 25.2, -13.02, 40.65, 0, -13.02, 40.66, 7.73, -12.93, 45.33, 8.63, -12.93, 45.33, 9.35,
      -12.92, 45.33, 16.55, -12.87, 41.26, 8.23, -12.87, 41.27, 8.8, -12.81, -4.8, 7.46, -12.81, -4.8, 19.65, -12.73, 40.85, 0,
      -12.73, 40.85, 7.99, -12.7, 3.98, 22.69, -12.7, 3.98, 25.2, -12.66, 40.26, 6.88, -12.65, 40.26, 0.01, -12.65, 41.25, 8.7,
      -12.55, 41.07, 8.36, -12.55, 41.08, 0, -12.47, 45.47, 8.51, -12.46, 45.47, 16.66, -12.39, 45.41, 16.55, -12.38, 45.41, 8.68,
      -12.33, 140.75, 11.81, -12.33, 140.76, 0, -12.31, 1.85, 28.9, -12.3, 1.85, 19.22, -12.27, 23.68, 0, -12.26, 23.67, 13.27,
      -12.22, 23.47, 0, -12.22, 23.47, 13.66, -12.2, 1.87, 19.22, -12.2, 1.87, 28.91, -12.19, 1.87, 18.95, -11.93, 21.25, 17.89,
      -11.93, 21.25, 17.92, -11.79, -3.56, 19.54, -11.78, -3.56, 13.73, -11.75, 21.3, 17.84, -11.75, 21.3, 17.97, -11.69, -4.62, 12.66,
      -11.69, -4.61, 19.65, -11.68, -4.61, 8.91, -11.66, -4.93, 9.61, -11.65, -4.93, 12.33, -11.28, 43.99, 12.44, -11.08, 60.61, 0,
      -11.08, 60.61, 17.14, -11.04, 43.78, 12.9, -11.04, 43.78, 12.91, -11.04, 43.78, 12.95, -11.04, 43.78, 13.01, -11.01, 60.12, 0.01,
      -11.01, 60.12, 16.74, -11.01, 60.13, 17.14, -10.98, 45.71, 8.6, -10.98, 45.71, 16.69, -10.94, -4.39, 9.66, -10.94, -4.39, 12.74,
      -10.86, 60.04, 17.13, -10.85, 45.64, 16.54, -10.84, 45.64, 8.81, -10.62, 20.6, 15.61, -10.61, 20.6, 16.28, -10.52, -4.94, 0.01,
      -10.51, -4.93, 8.45, -10.43, 23.54, 14.06, -10.34, 55.73, 0, -10.34, 55.73, 16.57, -10.31, -5.34, 7.67, -10.3, -5.35, 0.01,
      -10.28, 55.32, 0.01, -10.28, 55.32, 17.32, -10.27, 24, 0, -10.27, 24, 13.24, -10.24, 24.3, 0, -10.24, 24.3, 12.7,
      -10.21, 24.12, 0.01, -10.21, 24.12, 13.05, -10.18, -5.22, 0, -10.18, -5.21, 7.72, -10.14, 24.22, 0, -10.14, 24.23, 12.87,
      -10.13, 55.47, 17.09, -10.12, 44.99, 10.62, -10.1, -5.61, 7.08, -10.09, -5.61, 0.01, -10.09, 24.31, 0, -10.09, 24.32, 12.72,
      -9.98, 23.62, 14.06, -9.97, 23.61, 13.03, -9.96, 24.49, 0, -9.95, 24.49, 12.43, -9.94, -3.25, 10.25, -9.94, -3.25, 13.68,
      -9.92, 42.87, 10.89, -9.89, 24.06, 0.01, -9.88, 24.06, 13.24, -9.73, 45.81, 8.9, -9.73, 45.81, 9.53, -9.73, 45.81, 16.54,
      -9.67, 23.66, 13.7, -9.67, 23.66, 14.06, -9.65, 45.92, 9.32, -9.65, 45.92, 16.71, -9.63, 20.6, 13.43, -9.63, 20.6, 15.99,
      -9.63, 20.61, 12.75, -9.51, 19.88, 12.76, -9.51, 19.88, 14.58, -9.47, 20.6, 13.09, -9.41, 4.5, 21.29, -9.41, 4.5, 22.72,
      -9.29, 19.74, 13.19, -9.29, 19.74, 14.25, -9.25, -3.13, 9.71, -9.24, -3.13, 13.66, -9.24, 2.52, 19.29, -9.23, 2.37, 19.14,
      -9.22, 2.37, 19.03, -9.22, 23.45, 14.6, -9.16, 40.73, 0.01, -9.16, 40.74, 6.52, -9.12, 46.01, 8.2, -9.12, 46.01, 16.72,
      -9.11, 46.01, 8.17, -9.04, 19.75, 14.18, -9.03, 19.75, 13.74, -9.02, 38.14, 0, -9.01, 38.15, 6.03, -9, 19.8, 13.83,
      -9, 19.8, 14.26, -8.9, 46.15, 8.67, -8.9, 46.15, 16.91, -8.87, 42.01, 8.96, -8.87, 42.01, 9, -8.81, 19.81, 14.25,
      -8.8, 19.81, 14.25, -8.8, 19.81, 14.27, -8.76, -3.09, 7.29, -8.75, -3.09, 9.27, -8.75, -3.09, 13.61, -8.74, 46.17, 8.27,
      -8.74, 46.17, 9.01, -8.74, 46.18, 16.9, -8.71, 41.9, 8.66, -8.71, 41.9, 8.75, -8.63, -4.58, 5.5, -8.62, -4.58, 7.06,
      -8.62, -4.57, 0.01, -8.54, 41.59, 0, -8.54, 41.59, 8.02, -8.54, 41.59, 8.12, -8.5, 41.91, 8.69, -8.49, 41.9, 8.2,
      -8.46, 41.69, 8.21, -8.46, 41.69, 8.28, -8.39, 40.71, 0.01, -8.39, 40.71, 8.05, -8.34, 40.35, 8.06, -8.33, 40.35, 0,
      -8.29, 46.25, 8.26, -8.28, 46.26, 16.93, -8.24, 42.01, 8.76, -8.14, 20.88, 16.05, -8.1, 37.35, 0.01, -8.09, 37.35, 7.65,
      -8.02, 41.41, 9.04, -7.96, 37.37, 7.92, -7.96, 37.38, 0, -7.94, 28.39, 0.01, -7.93, 28.39, 5.26, -7.9, 41.78, 9.39,
      -7.89, 41.78, 8.24, -7.89, 41.78, 8.26, -7.87, 46.3, 16.91, -7.86, 46.31, 8.29, -7.82, 37.21, 8.17, -7.81, 37.21, 0,
      -7.64, 58.22, 17.04, -7.64, 58.23, 25.98, -7.63, 58.23, 12.79, -7.63, 58.23, 26.35, -7.62, 36.04, 0, -7.61, 36.04, 8.21,
      -7.59, -0.36, 16.1, -7.58, -0.36, 53.55, -7.55, 31.4, 0, -7.55, 31.41, 6.96, -7.5, 32.52, 7.42, -7.49, 32.52, 0,
      -7.47, 21.96, 17.88, -7.47, 21.96, 17.9, -7.46, 21.96, 17.86, -7.28, 30.19, 0.01, -7.28, 30.19, 7.12, -7.21, 46.45, 16.99,
      -7.21, 46.46, 8.21, -7.19, 46.4, 16.89, -7.18, 32.91, 8.16, -7.18, 32.91, 8.17, -7.18, 46.4, 8.32, -7.17, -4.3, 0,
      -7.17, -4.3, 5.51, -7.17, -4.29, 53.37, -7.17, 32.9, 0.01, -7.13, 32.62, 8.17, -7.13, 32.63, 0, -7.06, 32.13, 0.01,
      -7.06, 32.13, 8.16, -7.05, 32.82, 8.39, -7.02, 31.79, 8.14, -7.01, 1.49, 17.83, -7.01, 1.49, 53.81, -7.01, 1.49, 54.97,
      -7.01, 31.79, 0, -6.98, 38.34, 10.19, -6.96, 12.12, 35.08, -6.94, 31.25, 8.12, -6.93, 31.25, 0.01, -6.93, 32.73, 8.17,
      -6.93, 32.73, 8.61, -6.92, 28.94, 7.46, -6.91, 28.94, 0.01, -6.91, 41.93, 8.24, -6.88, 37.4, 8.21, -6.88, 37.4, 10.12,
      -6.87, 37.4, 8.29, -6.85, 46.52, 8.19, -6.84, 1.42, 54.96, -6.84, 46.52, 17, -6.83, 1.43, 53.84, -6.82, 30.39, 0,
      -6.82, 30.39, 8.09, -6.8, -2.93, 7.05, -6.8, -2.93, 53.55, -6.79, -2.93, 13.38, -6.78, -4.86, 0.01, -6.78, 36.55, 10.05,
      -6.77, -4.86, 53.42, -6.75, 2.33, 18.62, -6.75, 2.33, 54.96, -6.75, 24.58, 0.01, -6.75, 24.58, 13.21, -6.7, 29.5, 0,
      -6.7, 29.5, 8.06, -6.68, 21.36, 16.52, -6.66, 24.85, 12.73, -6.66, 24.86, 0, -6.65, 0.86, 53.85, -6.65, 0.86, 54.97,
      -6.64, 23.14, 15.93, -6.62, 28.94, 0, -6.62, 28.94, 8.04, -6.59, 28.7, 0, -6.59, 28.7, 8.03, -6.58, 28.61, 0,
      -6.58, 28.61, 8.03, -6.56, 2.96, 19.21, -6.56, 52.45, 23.51, -6.56, 52.45, 27.28, -6.55, 2.96, 55.08, -6.53, 28.21, 8.01,
      -6.52, 28.21, 0, -6.51, 44.41, 12.97, -6.5, 44.4, 12.99, -6.5, 44.4, 13, -6.45, 33.61, 9.83, -6.44, 46.52, 8.32,
      -6.44, 46.52, 16.9, -6.43, 46.58, 8.19, -6.42, 44.51, 12.78, -6.42, 46.59, 17.01, -6.37, 32.82, 8.17, -6.37, 32.82, 8.31,
      -6.37, 32.82, 9.75, -6.34, 41.94, 8.1, -6.34, 41.94, 8.39, -6.33, 51.43, 27.28, -6.33, 51.44, 25.42, -6.31, 32.3, 9.5,
      -6.31, 32.3, 9.7, -6.22, -0.47, 15.72, -6.22, -0.47, 53.85, -6.22, 46.56, 8.32, -6.21, 46.56, 16.91, -6.17, 24.68, 0,
      -6.17, 24.68, 13.2, -6.16, -0.62, 15.56, -6.16, -0.62, 53.85, -6.16, 1.18, 54.97, -6.15, 1.17, 53.98, -6.15, 1.18, 60.86,
      -6.14, 46.49, 8.5, -6.14, 46.49, 16.76, -6.1, 67.43, 0, -6.09, 67.43, 9.89, -6.06, 1.76, 17.91, -6.06, 24.81, 0,
      -6.06, 24.82, 7.89, -6.05, 1.76, 54.96, -6.05, 1.76, 57.92, -6.05, 1.77, 60.87, -6.05, 24.81, 12.99, -6.04, 24.7, 0.01,
      -6.04, 24.7, 13.2, -5.97, 29.16, 9.41, -5.91, 5.05, 54.13, -5.91, 24.72, 13.2, -5.91, 24.73, 8.15, -5.91, 28.66, 8.3,
      -5.91, 28.66, 9.37, -5.9, 5.05, 21.16, -5.9, 5.05, 22.74, -5.9, 5.06, 50.73, -5.9, 28.55, 8.53, -5.9, 28.55, 9.36,
      -5.88, 1.35, 54.97, -5.88, 1.35, 60.86, -5.87, 39.9, 12.9, -5.85, 39.8, 12.9, -5.79, -4.04, 53.69, -5.79, -4.03, 0.01,
      -5.76, -6.12, 0, -5.76, -6.12, 53.55, -5.74, -4.11, 0.01, -5.74, 1.02, 68.55, -5.73, -4.11, 53.7, -5.73, 1.02, 54.06,
      -5.73, 1.02, 60.86, -5.69, 1.46, 58.71, -5.69, 1.47, 60.86, -5.65, 24.42, 13.63, -5.64, 24.42, 13.83, -5.63, 64.64, 0,
      -5.63, 64.65, 14.61, -5.59, -0.52, 53.98, -5.59, -0.52, 68.57, -5.58, 1.54, 60.87, -5.57, 1.54, 58.59, -5.57, 1.54, 68.55,
      -5.49, 24.79, 13.19, -5.48, 24.8, 8.95, -5.48, 24.8, 9.02, -5.45, 24.45, 13.22, -5.45, 24.45, 13.85, -5.44, 6.53, 52.05,
      -5.44, 6.54, 25.15, -5.44, 24.45, 8.16, -5.44, 60.65, 17.01, -5.44, 60.66, 18.58, -5.32, 24.37, 7.93, -5.32, 24.37, 13,
      -5.31, 24.36, 8.43, -5.31, 25.04, 9.45, -5.28, 62.53, 10.79, -5.28, 62.54, 0, -5.28, 62.54, 17.03, -5.19, 46.21, 9.45,
      -5.18, -0.87, 54.05, -5.18, -0.87, 60.86, -5.18, -0.87, 68.57, -5.18, 27.7, 10.53, -5.18, 46.21, 9.51, -5.18, 56.84, 19.65,
      -5.17, 56.84, 15.97, -5.16, 35.35, 12.87, -5.16, 35.35, 12.95, -5.16, 35.35, 12.96, -5.16, 46.49, 16.52, -5.16, 46.5, 8.84,
      -5.16, 46.5, 9.37, -5.15, 46.64, 16.78, -5.15, 46.65, 8.51, -5.14, 19.75, 12.99, -5.14, 19.75, 22.3, -5.14, 61.65, 0,
      -5.13, 61.65, 17.02, -5.09, -0.56, 54.09, -5.09, -0.56, 68.57, -5.06, 30.27, 11.58, -4.98, 43.2, 10.21, -4.92, 20.02, 7.94,
      -4.92, 20.02, 21.88, -4.92, 20.03, 13.44, -4.92, 20.03, 13.52, -4.92, 60.71, 17, -4.9, 0.81, 68.57, -4.9, 0.81, 76.5,
      -4.9, 5.2, 54.41, -4.9, 5.21, 50.77, -4.84, -1.17, 60.86, -4.83, -1.17, 54.1, -4.79, 46.7, 16.79, -4.79, 46.71, 12.46,
      -4.77, 46.55, 8.5, -4.77, 46.55, 12.47, -4.77, 46.55, 16.51, -4.74, -3.24, 53.98, -4.74, -3.24, 68.59, -4.73, 33.06, 8.17,
      -4.69, 0.63, 68.57, -4.69, 0.63, 76.73, -4.66, 19.82, 22.31, -4.65, 19.82, 7.43, -4.65, 59.09, 16.98, -4.64, 46.92, 12.77,
      -4.64, 46.92, 17.11, -4.62, 36.05, 11.66, -4.54, 42.19, 8.09, -4.53, 42.18, 8.4, -4.49, 42.11, 8.57, -4.48, 2.24, 57.47,
      -4.48, 2.25, 59.27, -4.48, 2.25, 76.06, -4.48, 42.11, 7.93, -4.47, 2.24, 68.56, -4.47, 62.68, 10.79, -4.47, 62.69, 17,
      -4.46, 30.99, 12.97, -4.46, 30.99, 12.98, -4.46, 30.99, 12.99, -4.39, 30.94, 12.84, -4.39, 62.78, 10.94, -4.39, 62.78, 17,
      -4.36, 42.13, 8.57, -4.35, 42.13, 7.93, -4.35, 42.13, 9.15, -4.33, 56.13, 17.46, -4.3, 41.86, 9.15, -4.29, -2.48, 54.13,
      -4.29, -2.48, 60.86, -4.29, -2.48, 68.59, -4.28, 0.93, 68.57, -4.28, 0.93, 76.84, -4.26, 59.88, 16.98, -4.25, 6.73, 25.18,
      -4.25, 6.73, 52.37, -4.25, 55.13, 16.49, -4.25, 59.89, 14.59, -4.25, 61.96, 10.93, -4.25, 61.96, 17, -4.24, 55.13, 19.33,
      -4.22, 0.46, 68.57, -4.22, 0.46, 77.12, -4.21, -0.63, 60.86, -4.21, -0.63, 68.58, -4.21, 0.46, 76.83, -4.18, 58.06, 16.96,
      -4.17, 58.06, 16.06, -4.17, 58.06, 16.56, -4.15, -4.93, 53.99, -4.14, -4.92, 0, -4.12, 55.97, 16.93, -4.12, 55.97, 17.82,
      -4.09, 60.81, 10.87, -4.09, 60.81, 13.48, -4.09, 60.81, 16.98, -4.07, -0.6, 76.8, -4.06, -0.64, 68.58, -4.06, -0.64, 76.8,
      -4.06, -0.6, 68.58, -4.06, 62.5, 11.37, -4.06, 62.5, 16.99, -4.05, -2.08, 60.85, -4.05, -2.08, 68.59, -4.05, -0.64, 60.86,
      -4.05, 55.5, 16.51, -4.05, 55.5, 16.93, -4.04, 55.5, 18.69, -4.03, 42.65, 8.4, -4.03, 42.65, 8.87, -4.03, 42.65, 12.74,
      -4.02, -4.99, 0, -4.02, -4.99, 54.02, -4.02, -4.99, 54.99, -4.02, 52.94, 15.3, -4.02, 52.94, 16.28, -4.02, 52.94, 23.33,
      -4.01, 52.94, 27.28, -4, -1.06, 60.86, -4, -1.05, 76.79, -4, 23.57, 10.69, -4, 55.21, 16.48, -4, 55.21, 19.23,
      -3.99, -3.21, 54.15, -3.99, -3.21, 60.85, -3.99, -3.21, 68.59, -3.97, 42.3, 12.76, -3.96, 42.29, 8.15, -3.95, 42.18, 8.33,
      -3.94, 42.18, 7.92, -3.94, 42.18, 12.77, -3.91, 38.46, 9.55, -3.9, 51.8, 15.22, -3.9, 51.8, 25.42, -3.9, 51.8, 27.28,
      -3.9, 55.53, 16.49, -3.89, -1.81, 60.86, -3.89, -1.81, 76.91, -3.89, 31.69, 11.51, -3.89, 31.69, 11.55, -3.89, 62.35, 11.58,
      -3.89, 62.36, 16.99, -3.87, 26.77, 12.82, -3.87, 31.71, 11.5, -3.86, -2.03, 68.59, -3.86, 26.78, 12.87, -3.86, 26.78, 12.91,
      -3.85, -2.02, 60.86, -3.85, -2.02, 76.77, -3.83, 62.3, 11.66, -3.83, 62.3, 16.99, -3.79, 42.51, 13.1, -3.79, 42.52, 8.53,
      -3.69, 21.59, 10.69, -3.66, 24.64, 7.96, -3.66, 24.64, 8.47, -3.66, 55.57, 15.73, -3.66, 55.58, 13.37, -3.66, 55.58, 16.47,
      -3.66, 56.95, 15.06, -3.63, 37.29, 9.42, -3.61, 34.21, 10.09, -3.61, 34.21, 10.16, -3.57, 24.77, 8.21, -3.56, 30.39, 11.24,
      -3.56, 30.39, 11.31, -3.52, 37.29, 9.45, -3.51, 37.29, 9.2, -3.51, 37.29, 12.27, -3.51, 55.6, 13.37, -3.51, 55.61, 15.28,
      -3.47, 53.04, 16.24, -3.44, 47.39, 14.9, -3.44, 47.39, 17.61, -3.4, -0.98, 60.86, -3.4, -0.98, 77.12, -3.4, -0.98, 77.69,
      -3.37, 39.11, 10.75, -3.37, 39.11, 12.98, -3.37, 39.12, 8.26, -3.34, 22.05, 9.86, -3.34, 22.05, 11.49, -3.29, 56.15, 14.35,
      -3.29, 56.16, 14, -3.27, -4.95, 54.99, -3.27, -4.94, 54.19, -3.27, 27.49, 11.46, -3.26, -4.95, 60.85, -3.14, 37.91, 8.29,
      -3.14, 37.91, 13.06, -3.13, 37.91, 8.18, -3.08, 64.38, 13.34, -3.06, 34.61, 10.79, -3.05, 34.6, 8.9, -3.05, 34.61, 12.38,
      -3.02, 37.3, 9.57, -3.02, 37.3, 13.1, -3, 58.57, 16.93, -2.99, 22.96, 12.41, -2.99, 22.96, 13.21, -2.98, 22.96, 8.91,
      -2.94, 33.94, 9.41, -2.94, 33.95, 12.41, -2.87, 58.63, 16.48, -2.87, 58.63, 16.93, -2.87, 58.63, 16.98, -2.85, -0.05, 78.27,
      -2.85, -0.05, 78.58, -2.84, -0.05, 77.5, -2.78, 33.02, 8.77, -2.78, 33.02, 12.45, -2.76, 33.12, 8.55, -2.76, 33.12, 12.51,
      -2.74, 22.82, 12.83, -2.73, 33.33, 12.62, -2.72, 33.32, 8.09, -2.68, 58.47, 16.73, -2.65, 32.25, 8.73, -2.65, 32.25, 10.57,
      -2.65, 32.25, 12.48, -2.59, 34.05, 9.52, -2.59, 34.05, 13.03, -2.53, -3.16, 68.61, -2.53, -3.16, 76.39, -2.52, -3.16, 60.86,
      -2.46, 60.99, 13.41, -2.46, 61, 13.61, -2.44, -0.2, 78.61, -2.44, -0.2, 86.9, -2.41, 61.09, 13.5, -2.34, 23.32, 10.8,
      -2.34, 23.32, 11.85, -2.33, 23.32, 13.73, -2.32, 61.01, 13.4, -2.32, 61.01, 13.62, -2.3, -0.86, 78.18, -2.3, -0.85, 84.59,
      -2.29, 54.44, 14.7, -2.29, 54.44, 16.26, -2.27, 30.05, 12.57, -2.27, 30.06, 10.12, -2.26, 30.06, 8.6, -2.17, 55.87, 13.4,
      -2.15, 29.37, 12.62, -2.14, 29.36, 8.55, -2.12, 29.19, 8.15, -2.12, 29.19, 12.61, -2.11, -4.87, 54.99, -2.11, -4.87, 60.85,
      -2.11, 54.48, 16.24, -2.1, 23.63, 11.27, -2.1, 54.48, 14.7, -2.08, 28.93, 8.53, -2.08, 28.93, 8.72, -2.08, 28.93, 12.62,
      -1.97, -0.08, 78.86, -1.97, -0.08, 87.12, -1.93, 53.33, 14.69, -1.93, 53.33, 18.9, -1.93, 53.34, 16.13, -1.88, 52.93, 18.9,
      -1.87, 52.94, 14.68, -1.81, 3.93, 58.03, -1.8, 3.94, 76.95, -1.8, 3.95, 77.5, -1.76, 59.97, 15.04, -1.72, 25.41, 9.03,
      -1.68, 7.12, 53.13, -1.67, 7.11, 49.2, -1.67, 7.12, 25.17, -1.61, 6.62, 50.26, -1.61, 6.62, 53.95, -1.61, 6.62, 62.8,
      -1.59, -5.69, 54.99, -1.59, -5.69, 60.85, -1.48, 25.45, 8.52, -1.48, 25.45, 9.04, -1.48, 25.45, 12.77, -1.44, 3.41, 77.46,
      -1.43, 3.42, 77.73, -1.42, -8.29, 0, -1.42, 25.11, 8.26, -1.42, 25.11, 12.78, -1.4, -5.6, 54.99, -1.4, -5.6, 60.85,
      -1.4, -1.32, 78.15, -1.4, -1.32, 80.21, -1.4, -1.32, 84.6, -1.36, -6.87, 0.01, -1.36, -6.87, 55, -1.34, -6.35, 0.01,
      -1.34, -6.35, 54.99, -1.33, 24.61, 9.4, -1.33, 24.61, 12.8, -1.3, 61.13, 13.69, -1.3, 61.13, 14.11, -1.3, 61.14, 11.9,
      -1.29, 4.27, 77.13, -1.28, 4.27, 57.78, -1.28, 4.27, 68.06, -1.24, -5.53, 54.99, -1.24, -5.53, 60.85, -1.23, 22.93, 12.56,
      -1.22, -0.71, 84.64, -1.21, -5.46, 54.99, -1.21, -5.46, 60.85, -1.21, -0.72, 78.66, -1.21, -0.65, 78.71, -1.21, -0.65, 84.65,
      -1.21, -0.65, 87.43, -1.21, 1.56, 78.55, -1.2, -5.46, 68.64, -1.2, 1.55, 87.57, -1.19, -0.36, 84.66, -1.18, -0.36, 87.46,
      -1.14, 0.13, 84.69, -1.14, 0.13, 87.51, -1.05, 63.29, 10.79, -1.04, 2.07, 78.39, -1.04, 2.07, 78.46, -1.04, 22.87, 12.35,
      -1.03, 22.86, 12.88, -1.02, 54.72, 14.7, -1.01, 1.59, 78.65, -1.01, 1.6, 84.77, -1.01, 1.6, 87.65, -0.98, 2.05, 84.79,
      -0.97, 2.05, 78.45, -0.95, -4.52, 60.86, -0.95, -4.52, 68.63, -0.95, -4.52, 75.94, -0.88, -0.68, 84.66, -0.88, -0.68, 87.58,
      -0.84, 61.5, 11.09, -0.84, 61.51, 9.68, -0.82, -4.72, 60.86, -0.82, -4.71, 68.63, -0.8, -4.65, 75.9, -0.8, 61.19, 13.33,
      -0.79, -4.66, 68.63, -0.79, 61.19, 9.47, -0.79, 61.19, 11.14, -0.73, 21.13, 8.75, -0.73, 21.13, 12.95, -0.73, 21.13, 24.33,
      -0.72, -1.68, 78.12, -0.72, -1.68, 80.24, -0.65, 60.04, 8.75, -0.64, 60.04, 13.32, -0.63, -1.1, 78.58, -0.63, -1.1, 80.87,
      -0.63, -1.1, 84.65, -0.61, 20.42, 7.26, -0.61, 20.42, 22.34, -0.61, 20.42, 24.36, -0.55, -0.64, 84.67, -0.55, -0.64, 87.74,
      -0.52, 0.28, 87.8, -0.51, 0.27, 84.72, -0.5, 56.49, 13.78, -0.49, 19.72, 23.58, -0.49, 19.72, 24.39, -0.49, 56.49, 13.18,
      -0.45, 0, 87.82, -0.44, 0, 84.71, -0.34, 62.31, 10.11, -0.29, 53.26, 16.15, -0.29, 53.27, 14.68, -0.28, -6.46, 0,
      -0.28, -6.46, 55, -0.26, -0.6, 87.63, -0.25, -0.6, 79.08, -0.25, -0.6, 84.69, -0.2, 56.6, 13.14, -0.19, 56.59, 13.3,
      -0.18, 56.42, 13.3, -0.15, -0.96, 78.84, -0.14, -0.96, 84.67, -0.07, 56.29, 14.71, -0.07, 56.3, 13.45, -0.04, -3.21, 68.63,
      -0.04, -3.21, 77.22, -0.02, 21.36, 14.2, -0.02, 21.36, 24.31, -0.02, 21.37, 20.85, 0.12, -8.34, 0, 0.13, 5.17, 68.59,
      0.14, 5.17, 66.55, 0.14, 5.18, 53.78, 0.14, 5.18, 76.13, 0.16, -3.39, 77.17, 0.16, -3.38, 69.49, 0.17, -3.39, 68.63,
      0.21, 5.1, 76.15, 0.21, 5.11, 68.59, 0.22, 5.11, 53.94, 0.23, 1.04, 84.79, 0.23, 1.04, 87.76, 0.26, -6.72, 55,
      0.26, 0.61, 84.77, 0.26, 0.61, 87.66, 0.26, 19.84, 24.38, 0.27, -6.71, 0.01, 0.27, 0.48, 82.95, 0.27, 19.84, 23.59,
      0.28, 0.31, 82.8, 0.28, 0.32, 87.59, 0.28, 0.47, 87.62, 0.31, -6.23, 0.01, 0.31, -6.23, 55, 0.33, -2.49, 77.89,
      0.33, 5.3, 53.58, 0.33, 5.3, 68.59, 0.34, -2.49, 69.49, 0.36, 46.66, 16.88, 0.37, 46.66, 16.74, 0.43, 0.76, 82.87,
      0.43, 0.77, 84.79, 0.43, 0.77, 87.62, 0.45, -4.72, 55, 0.45, -4.72, 68.64, 0.45, -2.29, 78.08, 0.46, -2.29, 69.49,
      0.46, -2.29, 77.87, 0.52, -3.06, 69.49, 0.52, -3.06, 77.49, 0.54, 58.13, 14.73, 0.58, 0.54, 82.38, 0.58, 0.54, 87.52,
      0.63, 4.77, 54.78, 0.63, 4.77, 68.59, 0.63, 4.77, 76.24, 0.72, -0.49, 79.5, 0.72, -0.48, 81.27, 0.72, -0.48, 87.26,
      0.72, 46.71, 16.14, 0.72, 46.71, 16.88, 0.76, 56.46, 14.71, 0.82, 58.79, 15.27, 0.83, 58.78, 14.73, 0.84, -3.94, 68.65,
      0.84, -3.94, 69.5, 0.91, 0.5, 81.68, 0.92, 0.5, 87.38, 0.95, 60.5, 8.87, 0.95, 60.5, 15.8, 1.09, 53.68, 14.67,
      1.09, 53.68, 16.16, 1.11, 1.37, 84.85, 1.11, 1.38, 78.24, 1.12, 1.37, 81.98, 1.16, 5.09, 54.26, 1.17, 5.09, 68.6,
      1.19, 1.35, 81.79, 1.19, 54.83, 16.16, 1.2, 1.35, 78.23, 1.2, 41.5, 16.67, 1.2, 41.5, 16.78, 1.2, 54.83, 14.68,
      1.29, -3.03, 69.49, 1.29, -3.02, 77.02, 1.41, 1.32, 69.48, 1.41, 1.32, 78.18, 1.41, 56.99, 14.71, 1.41, 57, 15.51,
      1.42, -0.4, 79.81, 1.42, -0.4, 79.9, 1.42, 1.32, 81.32, 1.43, -0.4, 78.14, 1.51, 58.13, 15.52, 1.52, 58.13, 14.72,
      1.61, -3.36, 68.65, 1.61, -3.36, 69.5, 1.61, -3.36, 76.67, 1.61, -0.05, 78.18, 1.61, -0.05, 79.82, 1.64, 59.45, 14.74,
      1.64, 59.45, 16.63, 1.65, 59.53, 8.2, 1.65, 59.53, 16.66, 1.68, 59.48, 8.17, 1.68, 59.48, 16.69, 1.68, 59.49, 14.74,
      1.71, 7.62, 25.14, 1.71, 7.62, 25.15, 1.71, 7.62, 49.14, 1.96, 41.6, 15.36, 1.96, 41.6, 16.22, 1.96, 41.6, 16.78,
      1.97, 53.94, 16.16, 1.98, -3.09, 68.65, 1.98, -3.08, 76.57, 1.98, 53.95, 14.67, 2.04, 68.73, 12.6, 2.04, 68.74, 0,
      2.04, 68.74, 9.96, 2.06, 0.82, 69.48, 2.06, 0.82, 77.7, 2.06, 0.83, 79.61, 2.12, 0.96, 69.48, 2.12, 7.13, 50.3,
      2.13, -3.92, 68.65, 2.13, -3.92, 76.11, 2.13, 0.96, 79.58, 2.13, 7.12, 25.41, 2.26, 1.21, 77.99, 2.26, 1.22, 69.48,
      2.33, -4.14, 55, 2.33, -4.14, 68.66, 2.41, 55.01, 14.68, 2.41, 55.01, 15.51, 2.47, 1.6, 77.26, 2.47, 1.61, 69.48,
      2.47, 1.61, 77.68, 2.53, 66.06, 17.22, 2.54, 66.05, 14.52, 2.69, 6, 25.98, 2.69, 6, 52.81, 2.72, 22.27, 19.03,
      2.73, -4.58, 55, 2.73, 22.27, 20.01, 2.74, -4.58, 68.67, 2.77, 64.79, 12.22, 2.77, 64.79, 19.4, 2.78, 1.03, 69.48,
      2.78, 1.03, 77.15, 2.84, 2.93, 76.73, 2.85, 2.93, 68.62, 2.88, -3.56, 55, 2.88, -3.56, 60.86, 2.88, -3.56, 75.81,
      2.89, -3.56, 68.66, 2.92, 64, 10.79, 2.92, 64.01, 18.03, 2.94, 6.15, 25.92, 2.94, 6.15, 26.63, 2.95, 6.16, 52.57,
      2.95, 39.71, 13.9, 2.96, 39.72, 14.16, 2.96, 39.72, 16.31, 3.06, 2.75, 65.6, 3.06, 2.75, 76.61, 3.06, 2.75, 76.78,
      3.13, 54.29, 14.67, 3.13, 54.29, 16.16, 3.18, 39.31, 13.9, 3.2, 4.99, 53.83, 3.21, 4.98, 55.09, 3.21, 4.98, 68.61,
      3.27, 62.12, 9.6, 3.27, 62.12, 14.76, 3.38, 1.2, 68.64, 3.38, 1.2, 76.71, 3.38, 61.55, 14.76, 3.38, 61.56, 9.25,
      3.42, 3.44, 64.23, 3.42, 3.44, 68.63, 3.42, 3.44, 76.23, 3.49, -0.62, 68.65, 3.49, -0.62, 76.77, 3.5, -5.68, 55,
      3.5, -5.67, 0.01, 3.5, -0.27, 76.92, 3.5, 61.25, 9.05, 3.51, 61.25, 14.75, 3.6, -0.47, 68.65, 3.6, -0.47, 76.77,
      3.6, -0.47, 76.89, 3.65, 4.96, 55.27, 3.66, 4.96, 53.83, 3.76, 5.18, 26.44, 3.76, 5.18, 53.83, 3.76, 5.18, 54.84,
      3.8, 3.78, 68.63, 3.81, -1.72, 68.66, 3.81, 0.1, 60.88, 3.81, 0.1, 76.64, 3.81, 3.79, 53.83, 3.81, 3.79, 63.59,
      3.82, -1.72, 76.07, 3.83, 61.34, 9.07, 3.83, 61.34, 14.75, 3.84, 61.25, 9.01, 3.84, 61.25, 14.75, 3.87, 23.26, 15.61,
      3.87, 23.27, 16.86, 3.95, 0.02, 76.55, 3.95, 0.03, 60.88, 3.96, 0.03, 68.65, 3.96, 4.94, 26.39, 3.96, 4.94, 53.83,
      3.96, 22.67, 19.63, 3.96, 22.68, 16.84, 3.97, 22.67, 16.64, 3.99, 0.39, 60.88, 3.99, 0.39, 68.65, 3.99, 0.39, 76.44,
      4.02, 40.56, 13.92, 4.03, 40.56, 16.29, 4.1, 0.24, 60.88, 4.11, 0.24, 55, 4.11, 0.24, 68.65, 4.15, -1.48, 68.66,
      4.15, -1.47, 60.87, 4.22, 21.13, 19.32, 4.22, 21.13, 22.39, 4.25, 47.21, 16.15, 4.25, 47.21, 16.86, 4.25, 58.65, 14.71,
      4.25, 58.65, 15.57, 4.37, 62.31, 14.76, 4.41, -1.95, 60.87, 4.41, -1.95, 68.67, 4.42, -1.95, 55, 4.47, -0.24, 55,
      4.47, -0.24, 68.66, 4.53, 1.53, 68.58, 4.53, 1.53, 68.64, 4.54, 1.53, 53.84, 4.54, 1.53, 75.84, 4.54, 54.7, 18.72,
      4.54, 54.71, 14.66, 4.65, 47.26, 16.86, 4.66, -4.61, 0, 4.66, -4.61, 55, 4.66, 4.91, 53.83, 4.67, -7.13, 0.01,
      4.67, 4.91, 26.05, 4.68, -7.13, 55.01, 4.72, 7.23, 25.53, 4.75, 1.59, 53.84, 4.75, 1.59, 68.5, 4.76, 55.35, 15.55,
      4.77, 55.36, 14.67, 4.78, -4.67, 0, 4.78, 4.67, 53.83, 4.79, -2.65, 55, 4.79, 4.67, 26.04, 4.79, 8.09, 25.13,
      4.8, -2.65, 60.87, 4.81, 23.93, 15.09, 4.84, 1.73, 53.84, 4.84, 1.73, 68.23, 4.85, 1.26, 53.84, 4.85, 1.27, 55,
      4.85, 1.27, 68.65, 4.88, -4.53, 0.01, 4.88, -4.52, 55, 4.9, 54.46, 19.28, 4.91, 54.47, 14.66, 4.93, 53.49, 19.06,
      4.94, 53.48, 18.81, 4.98, 7.38, 23.86, 4.98, 7.38, 25.38, 4.98, 7.38, 25.48, 5.02, 53.72, 14.64, 5.02, 53.72, 18.62,
      5.02, 53.72, 19.27, 5.04, 4.88, 53.83, 5.04, 4.89, 25.87, 5.04, 53.56, 18.62, 5.04, 53.56, 19.27, 5.07, 42, 16.13,
      5.07, 42, 16.23, 5.08, 42.01, 16.77, 5.16, 41.46, 16.13, 5.16, 41.46, 16.26, 5.18, 6.62, 12.84, 5.18, 6.62, 22.52,
      5.18, 51.51, 18.94, 5.19, 6.62, 25.44, 5.26, -6.69, 55.01, 5.26, -0.65, 55, 5.26, -0.65, 60.87, 5.26, -0.65, 68.67,
      5.27, -6.69, 0, 5.43, 42.06, 16.76, 5.48, 24.4, 13.84, 5.48, 24.41, 14.71, 5.5, 6.43, 0, 5.5, 6.43, 12.44,
      5.53, -0.78, 55, 5.54, -0.78, 60.87, 5.57, 5.14, 25.56, 5.57, 5.15, 0, 5.57, 5.15, 10.31, 5.65, 4.86, 0,
      5.65, 4.86, 25.58, 5.66, 4.85, 53.83, 5.83, 2.61, 55, 5.83, 2.62, 0.01, 5.83, 2.62, 53.83, 5.93, -6.19, 0,
      6, 2.72, 0, 6.13, 3.04, 53.84, 6.14, 3.04, 0, 6.18, 1.93, 55, 6.18, 1.94, 0.01, 6.24, 60.79, 11.64,
      6.24, 60.79, 14.73, 6.25, 4.86, 0, 6.37, 5.33, 10.43, 6.37, 5.34, 0, 6.42, -2.08, 0, 6.42, -2.08, 55.01,
      6.44, 5.26, 0, 6.45, 25.08, 14.18, 6.45, 25.09, 13.86, 6.64, 23.91, 13.86, 6.64, 23.91, 16.21, 6.69, -0.48, 0,
      6.69, -0.48, 55, 6.76, 5.1, 0.01, 7.03, 21.54, 20.33, 7.03, 21.54, 22.41, 7.06, 54.62, 14.65, 7.07, 54.63, 16.35,
      7.08, 55.63, 14.66, 7.16, 54.07, 15.08, 7.16, 54.08, 14.64, 7.16, 54.08, 17.31, 7.16, 60.96, 11.67, 7.16, 60.96, 14.72,
      7.17, 60.96, 5.68, 7.25, 53.54, 16.38, 7.26, 53.54, 15.07, 7.61, 4.02, 0, 7.65, 24.46, 15.92, 7.66, 24.46, 15.76,
      8.38, -2.23, 55.01, 8.39, -2.23, 0.01, 8.41, 23.7, 16.86, 8.41, 23.7, 17.63, 8.41, 52.09, 13.61, 8.57, 22.55, 16.83,
      8.58, -0.77, 0, 8.58, -0.77, 55.01, 8.58, 22.55, 19.61, 8.58, 22.55, 21.08, 8.73, 51.69, 13.2, 8.73, 51.7, 12.84,
      8.92, 50.46, 10.71, 8.92, 50.46, 13.22, 9, 50.37, 13.11, 9, 50.38, 0.01, 9.61, 50.57, 12.08, 9.61, 50.58, 10.71,
      9.68, 50.49, 0.01, 9.68, 50.49, 11.99, 9.69, 50.49, 10.53, 9.73, 23.29, 19.03, 9.74, 23.3, 20.08, 10.28, 41.94, 0.01,
      10.29, 41.94, 13.27, 10.39, 41.13, 0.01, 10.4, 41.13, 13.3, 10.54, 7.39, 0.01, 10.54, 7.39, 12.77, 10.99, 5.15, 8.99,
      10.99, 5.16, 0, 11.11, 42.09, 0, 11.11, 42.09, 11.9, 11.12, 5.19, 9.01, 11.13, 5.2, 0.01, 11.18, 36.15, 13.34,
      11.19, 36.14, 0, 11.3, 35.28, 0, 11.3, 35.29, 13.38, 11.31, 4.31, 0.01, 11.32, 4.31, 7.51, 11.32, 41.26, 11.79,
      11.32, 41.27, 0, 11.46, 70.25, 12.75, 11.46, 70.26, 0, 11.87, 31.43, 13.47, 11.87, 31.44, 0, 11.96, 30.71, 0,
      11.96, 30.71, 13.52, 12.11, 36.28, 0, 12.11, 36.28, 11.82, 12.2, 35.42, 0, 12.2, 35.43, 11.9, 12.84, 25.32, 0,
      12.84, 25.32, 13.52, 12.84, 25.32, 17.39, 12.86, 31.54, 0, 12.86, 31.54, 11.86, 12.96, 4.58, 0.01, 12.96, 4.59, 7.56,
      13.04, 30.84, 0, 13.04, 30.84, 11.76, 13.14, 23.48, 20.65, 13.14, 23.49, 0, 13.26, 5.36, 0, 13.26, 5.36, 8.76,
      13.29, 5.18, 8.46, 13.3, 5.18, 0.01, 13.45, 69.13, 15.21, 13.46, 70.58, 15.74, 13.47, 70.58, 0, 13.61, 7.94, 12.91,
      13.61, 7.95, 22.56, 13.61, 7.95, 22.58, 13.72, 69.18, 15.2, 13.73, 23.53, 20.72, 13.73, 69.18, 15.61, 13.74, 23.54, 0.01,
      14.03, 69.24, 15.19, 14.04, 21.93, 0, 14.04, 21.94, 23.58, 14.26, 62.3, 8.76, 14.26, 62.31, 11.84, 14.27, 62.31, 5.36,
      14.38, 60.48, 8.47, 14.38, 60.49, 8.74, 14.87, 70.14, 11.02, 14.87, 70.14, 13.93, 15.07, 8.17, 22.58, 15.17, 5.64, 8.74,
      15.18, 5.64, 0, 15.19, 5.46, 0.01, 15.19, 5.46, 8.44, 15.28, 62.5, 11.86, 15.28, 62.51, 10.04, 15.33, 66.96, 12.27,
      15.33, 66.97, 19.36, 15.45, 60.48, 10.06, 15.45, 60.49, 8.77, 15.61, 6.31, 9.74, 15.61, 6.31, 22.99, 15.61, 6.32, 0,
      15.61, 70.92, 0, 15.61, 70.93, 9.91, 15.61, 70.93, 12.82, 15.66, 4.98, 0, 15.66, 4.98, 7.53, 15.8, 68.31, 14.39,
      15.81, 68.31, 17.25, 15.84, 68.42, 14.22, 15.85, 68.42, 17.08, 16.07, 65.25, 13.8, 16.07, 65.26, 16.27, 16.29, 60.47, 9,
      16.39, 62.71, 8.6, 16.4, 62.71, 0, 16.4, 62.71, 11.89, 16.54, 67.17, 19.35, 16.54, 67.18, 12.28, 16.7, 60.47, 9.12,
      16.7, 60.48, 8.47, 16.71, 60.48, 0, 16.79, 59.82, 10.26, 16.8, 59.81, 0, 16.84, 8.46, 0.01, 16.84, 8.46, 22.58,
      16.84, 8.46, 22.6, 16.92, 66.48, 12.06, 16.92, 66.49, 18.09, 16.93, 66.49, 11.03, 16.99, 5.19, 7.55, 17, 5.19, 0,
      17.03, 66.3, 12.43, 17.03, 66.3, 17.74, 17.09, 6.16, 0, 17.11, 6.97, 0, 17.11, 6.98, 22.9, 17.18, 5.22, 0,
      17.21, 66.5, 10.96, 17.21, 66.5, 12.18, 17.25, 6.21, 0, 17.49, 64.85, 15.16, 17.55, 66.87, 11.49, 17.56, 66.87, 11.69,
      17.97, 65.75, 13.8, 17.97, 65.76, 9.5, 18, 65.7, 0, 18, 65.7, 9.41, 18, 65.7, 13.9, 18.13, 23.38, 0,
      18.13, 23.39, 22.15, 18.15, 24.59, 20.06, 18.15, 24.6, 0, 18.22, 22.65, 0, 18.22, 22.65, 23.46, 18.32, 23.41, 0.01,
      18.32, 23.41, 22.16, 18.39, 65.04, 0, 18.39, 65.04, 15.22, 18.63, 66.52, 10.59, 18.63, 66.52, 12.78, 18.87, 24.77, 0.01,
      18.87, 24.77, 19.94, 19.11, 23.49, 0, 19.11, 23.49, 22.23, 19.24, 23.51, 0.01, 19.24, 23.51, 22.23, 19.37, 22.89, 0,
      19.37, 22.89, 23.34, 19.43, 63.29, 11.97, 19.44, 63.29, 0, 20.53, 9.04, 0, 20.53, 9.04, 22.63, 20.86, 6.9, 18.9,
      20.86, 6.91, 0.01, 21.86, 8.32, 0, 21.86, 8.32, 21.04, 22.07, 7.08, 0, 22.07, 7.08, 18.86, 22.92, 72.1, 0,
      22.92, 72.1, 10.05, 22.92, 72.23, 0, 22.92, 72.23, 9.84, 23.17, 72.6, 0, 23.18, 72.59, 9.29, 23.19, 25.46, 0,
      23.19, 25.47, 20.45, 23.39, 23.95, 22.56, 23.39, 23.95, 23.33, 23.4, 23.95, 0, 23.45, 23.55, 0.01, 23.45, 23.55, 23.28,
      23.5, 69.62, 14.42, 23.5, 69.63, 19.13, 23.54, 28.69, 0, 23.55, 28.65, 0, 23.55, 28.65, 7.05, 23.57, 72.41, 0.01,
      23.57, 72.41, 9.73, 23.6, 72.26, 0, 23.6, 72.26, 9.99, 23.61, 28.71, 0, 23.62, 28.71, 7.16, 23.63, 28.66, 0,
      23.63, 28.66, 7.16, 23.75, 72.28, 0, 23.75, 72.28, 9.99, 23.92, 26.57, 0, 23.92, 26.57, 6.93, 23.93, 26.57, 18.61,
      24.07, 71.8, 0, 24.08, 71.8, 10.91, 24.09, 25.64, 0, 24.09, 25.64, 20.38, 24.1, 72, 0, 24.1, 72, 10.57,
      24.77, 72.02, 0, 24.77, 72.02, 10.73, 24.77, 72.02, 23.72, 25.35, 68.05, 11.27, 25.35, 68.06, 18.18, 25.42, 24.25, 22.58,
      25.42, 24.25, 23.37, 25.43, 67.03, 9.52, 25.45, 66.94, 9.36, 25.46, 66.94, 0.01, 25.46, 66.94, 9.53, 25.47, 29.12, 0,
      25.47, 29.12, 9.66, 25.48, 29.12, 11.18, 25.63, 9.04, 21.29, 25.64, 9.04, 0, 25.7, 24.71, 21.84, 25.7, 24.71, 22.59,
      25.7, 24.71, 22.64, 25.91, 7.79, 0.01, 25.92, 7.78, 19.07, 26.13, 28.62, 10.36, 26.19, 71.14, 12.64, 26.19, 71.14, 20.88,
      26.46, 26.82, 22.88, 26.46, 26.83, 10.26, 26.46, 26.83, 18.88, 26.46, 70.13, 20.77, 26.46, 70.13, 21.22, 26.47, 70.13, 14.41,
      26.47, 70.13, 14.43, 26.53, 53.27, 0, 26.53, 53.27, 10.4, 26.57, 26.18, 20.13, 26.58, 26.18, 22.81, 26.61, 53.08, 10.06,
      26.61, 53.08, 11.45, 26.62, 53.08, 0, 26.62, 72.61, 0.01, 26.62, 72.61, 11.66, 26.62, 72.61, 18.14, 26.72, 71.17, 11.69,
      26.73, 71.16, 19.41, 26.8, 10.03, 0, 26.8, 10.03, 22.68, 26.8, 68.9, 12.17, 26.8, 68.9, 12.26, 26.8, 68.9, 21.65,
      26.81, 68.85, 12.17, 26.93, 69.01, 11.93, 26.94, 69.02, 21.15, 27.08, 53.51, 10.66, 27.08, 53.52, 12.4, 27.12, 7.96, 0,
      27.13, 7.96, 19.06, 27.24, 26.91, 22.89, 27.25, 26.91, 7.81, 27.25, 26.91, 9.15, 27.36, 69.57, 11.72, 27.36, 69.57, 19.42,
      27.36, 69.58, 11.1, 27.42, 69.42, 11.07, 27.42, 69.42, 11.72, 27.44, 61.38, 0.01, 27.44, 61.38, 10.27, 27.44, 61.39, 10.53,
      27.5, 27.59, 8.65, 27.53, 27.65, 8.61, 27.53, 27.65, 8.72, 27.61, 27.88, 8.44, 27.62, 61.41, 10.54, 27.99, 73.05, 0,
      27.99, 73.05, 11.62, 28.08, 69.96, 9.91, 28.08, 69.96, 11.69, 28.28, 27.01, 7.69, 28.28, 27.02, 22.89, 28.34, 44.54, 0,
      28.34, 44.54, 8.47, 28.34, 61.01, 11.39, 28.38, 24.68, 22.61, 28.51, 53.76, 14.61, 28.52, 53.75, 10.66, 28.58, 29.79, 0,
      28.58, 29.79, 6.73, 28.58, 29.8, 6.1, 28.75, 29.49, 6.55, 28.79, 69.52, 0.01, 28.79, 69.52, 9.06, 28.79, 69.52, 11.69,
      28.87, 54.08, 11.1, 28.87, 54.08, 15.31, 28.99, 60.83, 11.88, 28.99, 60.84, 12.26, 29.18, 60.78, 12.02, 29.36, 46.98, 0,
      29.36, 46.98, 11.48, 29.72, 17.68, 34.97, 29.72, 17.68, 35.14, 29.74, 25.91, 5.86, 29.74, 65.39, 9.36, 29.74, 65.4, 0,
      29.75, 25.91, 22.74, 29.9, 61.74, 10.59, 30.03, 17.28, 34.21, 30.04, 17.28, 34.74, 30.04, 54.44, 17.22, 30.05, 54.44, 11.38,
      30.3, 62.26, 9.82, 30.3, 62.27, 0, 30.33, 62.1, 0, 30.33, 62.1, 9.84, 30.37, 61.82, 0, 30.37, 61.82, 9.88,
      30.38, 61.82, 10.61, 30.43, 61.46, 0, 30.44, 61.46, 11.23, 30.5, 10.66, 22.79, 30.51, 10.67, 0.01, 30.53, 19.36, 32.42,
      30.65, 18.88, 32.88, 30.65, 18.89, 33.28, 30.65, 18.89, 33.43, 30.67, 18.81, 33.41, 30.79, 43.61, 0.01, 30.8, 43.61, 11.37,
      30.91, 58.01, 17.17, 30.92, 58.02, 0, 30.94, 8.63, 0.01, 30.94, 8.63, 19.2, 31.35, 54.84, 0.01, 31.35, 54.84, 11.68,
      31.36, 54.84, 15.05, 31.6, 17.49, 32.3, 31.68, 15.16, 30.16, 31.79, 10.93, 22.91, 31.79, 10.94, 0, 31.9, 14.34, 29.15,
      31.9, 14.35, 28.06, 31.9, 14.35, 28.71, 32.21, 8.87, 19.29, 32.22, 8.88, 0.01, 32.22, 19.15, 30.96, 32.58, 24.64, 23.79,
      32.58, 24.65, 22.56, 32.75, 11.26, 0, 32.75, 11.26, 22.52, 32.75, 11.26, 23.22, 32.86, 25.35, 4.34, 32.86, 25.35, 22.64,
      32.86, 38.19, 10.87, 32.87, 38.19, 0, 32.89, 38.11, 0, 32.89, 38.11, 8.67, 32.89, 38.11, 10.85, 33.09, 38.3, 11.26,
      33.1, 38.29, 0, 33.26, 36.92, 10.85, 33.27, 36.92, 0, 33.34, 26.58, 22.79, 33.34, 26.59, 5.87, 33.44, 55.75, 0,
      33.44, 55.75, 11.42, 33.54, 55.52, 0, 33.54, 55.52, 11.42, 33.59, 55.81, 0.01, 33.7, 55.57, 0.01, 33.7, 55.57, 11.16,
      33.83, 35.11, 0.01, 33.83, 35.11, 8.09, 33.87, 35, 0.01, 34.18, 13.42, 25.28, 34.2, 24.05, 0.01, 34.2, 24.05, 22.89,
      34.29, 24.28, 0, 34.3, 24.28, 2.57, 34.3, 24.28, 22.5, 34.54, 24.9, 3.32, 34.55, 24.9, 0, 34.99, 12.04, 22.54,
      35, 12.04, 0, 35.72, 24.45, 0.01, 35.72, 24.46, 2.44, 35.94, 12.91, 22.46, 35.95, 12.91, 0, 36.17, 12.62, 21.89,
      36.18, 12.62, 0.01, 36.18, 12.62, 22.84, 36.3, 10.43, 0, 36.3, 10.43, 19.18, 36.63, 26.71, 0, 36.63, 26.71, 5.21,
      36.78, 39.47, 8.79, 36.79, 39.47, 17.28, 36.89, 25.47, 0.01, 36.89, 25.47, 3.49, 36.99, 21.7, 0.01, 37, 21.69, 22.96,
      37.26, 11.25, 19.98, 37.27, 11.25, 0, 37.45, 21.94, 22.18, 37.45, 21.95, 0, 37.54, 21.88, 0, 37.54, 21.88, 22.18,
      37.62, 21.82, 0.01, 37.62, 21.83, 22.08, 37.69, 20.64, 0.01, 37.69, 20.65, 22.26, 37.94, 15.83, 0, 37.94, 15.84, 22.34,
      38.1, 16.42, 22.62, 38.16, 15.8, 0.01, 38.16, 15.8, 22.01, 38.16, 15.8, 22.68, 38.22, 17.04, 0, 38.22, 17.04, 22.3,
      38.77, 22.67, 0, 39.43, 33.31, 0.01, 39.44, 33.32, 4.19, 39.44, 40.38, 0, 39.44, 40.38, 12.83, 39.44, 40.39, 8.87,
      39.46, 21.59, 0, 39.54, 32.2, 0, 39.54, 39.1, 0, 39.54, 39.1, 11.03, 39.55, 32.2, 5.73, 39.59, 39.12, 0,
      39.59, 39.12, 11.04, 39.61, 38.95, 0, 39.61, 38.95, 10.79, 39.79, 36.88, 0, 39.81, 40.94, 0, 39.81, 40.94, 11.92,
      39.83, 40.52, 0, 39.83, 40.53, 12.16, 39.84, 37.06, 0, 39.85, 37.06, 8.07, 39.87, 36.52, 0, 39.89, 33.77, 0,
      39.89, 33.78, 3.7, 39.97, 37.09, 0.01, 39.99, 15.52, 19.94, 39.99, 15.53, 0.01, 40.13, 16.72, 19.44, 40.14, 16.73, 0,
      40.27, 33.17, 4.62, 40.27, 41.17, 11.09, 40.27, 41.18, 0.01, 40.28, 33.16, 0, 40.39, 30.11, 0, 40.39, 30.12, 8.78,
      40.44, 37.05, 0, 40.49, 27.31, 0, 40.5, 27.31, 5.03, 40.51, 36.55, 0, 40.62, 33.89, 0, 40.62, 33.89, 3.73,
      40.69, 33.25, 0, 40.69, 33.25, 4.61,
    ],
    triangles: [
      204, 156, 97, 2536, 2513, 2499, 409, 250, 193, 102, 100, 95, 230, 138, 1, 986, 1192, 1183, 2657, 2686, 2718, 355, 472, 519,
      2605, 2680, 2698, 164, 162, 153, 102, 95, 97, 404, 559, 986, 1219, 1200, 1192, 1577, 1580, 1707, 263, 259, 199, 138, 134, 1,
      2393, 2383, 2371, 2818, 2801, 2779, 1183, 275, 199, 2556, 2560, 2551, 2383, 2395, 2382, 76, 63, 69, 559, 811, 986, 929, 1319, 1577,
      2746, 2770, 2776, 174, 222, 277, 1173, 1341, 1325, 292, 202, 230, 69, 21, 29, 964, 946, 910, 2501, 2495, 2499, 1127, 1169, 1144,
      504, 449, 418, 2393, 2406, 2402, 2371, 2377, 2369, 1130, 918, 934, 156, 102, 97, 2734, 2740, 2536, 733, 929, 2310, 2380, 2385, 2404,
      2740, 2743, 2756, 431, 454, 458, 76, 67, 60, 2770, 2807, 2776, 2752, 2811, 2818, 2556, 2551, 2545, 197, 200, 277, 2517, 2521, 2577,
      2513, 2501, 2499, 986, 1183, 204, 2758, 2536, 2499, 317, 279, 286, 2317, 2322, 2296, 2742, 2750, 2761, 1130, 1102, 1052, 63, 40, 69,
      449, 441, 418, 559, 643, 1036, 986, 1127, 1144, 277, 317, 322, 2310, 2317, 2296, 404, 452, 559, 2361, 2692, 510, 2296, 2373, 2758,
      206, 204, 86, 322, 330, 359, 2770, 2805, 2807, 2811, 2820, 2818, 2657, 2639, 2686, 2794, 2810, 2727, 2663, 2633, 2556, 292, 119, 158,
      200, 174, 277, 322, 359, 355, 2178, 2309, 2251, 2577, 2615, 2605, 2740, 2756, 2752, 2803, 2794, 2727, 1130, 1052, 918, 1, 370, 342,
      2025, 2178, 2251, 69, 34, 108, 2740, 2752, 2785, 2692, 1326, 934, 86, 69, 292, 404, 986, 204, 206, 404, 204, 1907, 1897, 2002,
      2517, 2520, 2523, 2577, 2581, 2615, 2752, 2815, 2811, 2785, 2540, 2558, 2509, 2507, 2498, 2425, 2423, 2409, 2692, 2677, 2663, 2525, 1550, 1631,
      643, 784, 1036, 1144, 1279, 1219, 1183, 729, 265, 97, 82, 86, 1, 7, 370, 964, 910, 1154, 1907, 2002, 2025, 2436, 2451, 2480,
      2818, 2779, 2785, 2785, 2558, 2536, 2393, 2402, 2392, 2692, 2663, 2556, 929, 964, 1154, 1707, 1907, 2025, 2657, 2718, 2793, 2793, 2803, 2727,
      404, 458, 452, 559, 1036, 811, 193, 26, 37, 2373, 2410, 2480, 2593, 2657, 2793, 2793, 2727, 2692, 2692, 2545, 1326, 193, 37, 197,
      277, 355, 519, 1577, 2025, 2327, 2373, 2480, 2470, 2605, 2746, 2758, 2593, 2793, 2692, 292, 342, 432, 197, 277, 519, 1577, 2327, 2310,
      2470, 2605, 2758, 500, 409, 197, 197, 519, 696, 2758, 2734, 2536, 500, 197, 696, 2393, 2361, 510, 432, 500, 696, 2409, 2393, 510,
      504, 206, 86, 432, 696, 2310, 2296, 2499, 2425, 504, 86, 432, 432, 2310, 2296, 2296, 2425, 510, 432, 2296, 510, 910, 983, 1154,
      2178, 2243, 2309, 2310, 2343, 2329, 2373, 2376, 2380, 2680, 2690, 2703, 2768, 2784, 2778, 2718, 2713, 2732, 1631, 1301, 1326, 449, 478, 441,
      29, 15, 34, 448, 481, 472, 2373, 2380, 2404, 2718, 2732, 2793, 2525, 1631, 1326, 2776, 2768, 2758, 230, 1, 342, 929, 1154, 1173,
      2025, 2251, 2327, 2746, 2776, 2758, 86, 76, 69, 929, 1173, 1319, 409, 193, 197, 86, 292, 432, 929, 1577, 2310, 2373, 2470, 2758,
      2296, 2758, 2499, 2425, 2409, 510, 448, 456, 481, 1580, 1492, 1578, 2320, 2347, 2352, 2436, 2437, 2451, 2558, 2531, 2536, 986, 1003, 1127,
      409, 402, 387, 317, 286, 322, 2517, 2523, 2521, 2680, 2703, 2698, 2768, 2778, 2758, 2545, 2529, 2525, 1144, 1219, 1192, 409, 387, 390,
      26, 18, 37, 2373, 2404, 2410, 986, 1144, 1192, 277, 322, 355, 1577, 1707, 2025, 292, 230, 342, 2740, 2785, 2536, 519, 526, 545,
      2451, 2483, 2480, 250, 245, 181, 26, 24, 18, 519, 545, 540, 1580, 1578, 1707, 2320, 2352, 2327, 2310, 2329, 2317, 69, 29, 34,
      292, 158, 202, 2513, 2498, 2501, 2361, 2593, 2692, 2692, 934, 510, 696, 714, 747, 2513, 2511, 2509, 696, 747, 733, 250, 181, 193,
      200, 168, 174, 2529, 2527, 2525, 2742, 2761, 2746, 2517, 2577, 2605, 504, 418, 206, 2480, 2486, 2470, 2513, 2509, 2498, 2793, 2817, 2803,
      404, 431, 458, 2692, 2556, 2545, 2605, 2698, 2746, 69, 108, 292, 1154, 1191, 1173, 2383, 2397, 2395, 1052, 970, 918, 2251, 2320, 2327,
      1173, 1325, 1319, 1325, 1334, 1319, 2371, 2388, 2377, 2698, 2742, 2746, 204, 97, 86, 559, 650, 643, 2793, 2800, 2817, 2817, 2814, 2803,
      2393, 2392, 2383, 510, 504, 432, 2410, 2436, 2480, 934, 512, 510, 2752, 2818, 2785, 355, 448, 472, 2404, 2413, 2410, 404, 411, 431,
      2371, 2369, 2361, 696, 733, 2310, 1183, 265, 275, 1183, 199, 204, 2383, 2382, 2371, 519, 540, 696, 164, 153, 156, 2545, 2543, 2529,
      2545, 2525, 1326, 409, 390, 250, 76, 60, 63, 204, 164, 156, 2393, 2371, 2361, 275, 263, 199, 1326, 1130, 934, 2470, 2517, 2605,
      848, 849, 915, 308, 306, 316, 348, 347, 344, 78, 79, 48, 64, 65, 73, 1822, 1821, 1814, 1604, 1605, 1641, 1996, 1995, 2054,
      1775, 1773, 1752, 2626, 2627, 2632, 2676, 2675, 2665, 509, 508, 494, 2465, 2466, 2459, 1875, 1876, 1788, 422, 421, 326, 435, 436, 446,
      735, 736, 717, 128, 129, 133, 424, 425, 429, 47, 50, 53, 20, 30, 47, 53, 20, 47, 2223, 2224, 2239, 50, 55, 53,
      2457, 2458, 2487, 619, 618, 596, 679, 678, 654, 583, 582, 576, 754, 755, 804, 895, 894, 908, 1078, 1079, 1105, 290, 289, 270,
      1079, 1078, 1060, 1428, 1429, 1479, 894, 895, 880, 688, 687, 667, 728, 732, 727, 677, 676, 669, 725, 724, 689, 780, 781, 785,
      1532, 1531, 1479, 1755, 1756, 1760, 1016, 1015, 966, 704, 703, 716, 1528, 1529, 1655, 1520, 1521, 1526, 1618, 1613, 1526, 1717, 1678, 1846,
      1262, 1261, 1252, 924, 926, 920, 868, 869, 900, 869, 868, 864, 1063, 1064, 1073, 843, 842, 838, 1794, 1796, 1748, 1893, 1892, 1883,
      89, 90, 92, 1995, 1996, 1939, 1689, 1643, 1657, 1823, 1844, 1872, 1689, 1657, 1823, 2295, 2294, 2257, 1927, 1940, 1944, 1935, 1895, 1880,
      1880, 1669, 1689, 1823, 1872, 1927, 1935, 1880, 1689, 1689, 1823, 1927, 1927, 1935, 1689, 1927, 1944, 1935, 1842, 1843, 1846, 358, 345, 295,
      1889, 1916, 2004, 1385, 1386, 1391, 1354, 1353, 1339, 1228, 1229, 1253, 1229, 1228, 1206, 2705, 2706, 2642, 1910, 1909, 1867, 1849, 1848, 1830,
      1786, 1774, 1854, 1939, 1996, 1992, 1798, 1797, 1770, 1859, 1786, 1854, 1854, 1939, 1992, 1859, 1854, 1992, 1992, 1990, 1979, 1992, 1979, 1859,
      742, 744, 751, 518, 517, 516, 1771, 1772, 1780, 251, 252, 294, 2099, 2093, 2056, 2151, 2152, 2246, 495, 497, 525, 1912, 1911, 1882,
      1112, 1114, 1123, 2534, 2533, 2535, 2100, 2101, 2255, 641, 667, 687, 1435, 1434, 1314, 2418, 2419, 2434, 1896, 1936, 1944, 1019, 1018, 994,
      1177, 1175, 1153, 994, 995, 1019, 1904, 1968, 1994, 2143, 2010, 1914, 2130, 2143, 1914, 1914, 1944, 2130, 2079, 2122, 2130, 1914, 1896, 1944,
      1944, 2072, 2130, 1929, 1926, 1931, 1973, 1980, 1974, 1933, 1942, 1929, 1929, 1873, 1926, 1931, 1973, 1974, 1931, 1974, 1933, 1933, 1929, 1931,
      2159, 2174, 2143, 1914, 1881, 1896, 2130, 2159, 2143, 977, 978, 958, 1873, 1845, 1926, 1931, 1949, 1973, 2010, 2006, 1914, 2072, 2079, 2130,
      1044, 1045, 1046, 600, 599, 597, 2316, 2315, 2227, 321, 320, 319, 1924, 1844, 1824, 2749, 2747, 2733, 2143, 2048, 2010, 980, 982, 987,
      1024, 1023, 1006, 1726, 1725, 1636, 1039, 1038, 968, 928, 1017, 1035, 1042, 1040, 1051, 1825, 1702, 1713, 1715, 1736, 1792, 1792, 1825, 1713,
      1713, 1715, 1792, 1938, 1919, 1847, 913, 914, 967, 1709, 1708, 1683, 2013, 2034, 2065, 2016, 2013, 1941, 1948, 1930, 1925, 1920, 1853, 1904,
      1994, 1989, 1972, 1920, 1904, 1994, 1994, 1972, 1948, 2065, 1943, 1941, 1941, 1932, 1975, 1975, 1981, 2016, 2013, 2065, 1941, 1941, 1975, 2016,
      1948, 1920, 1994, 1948, 1925, 1920, 1962, 1902, 1852, 1851, 1850, 1846, 1556, 1555, 1552, 428, 427, 423, 688, 687, 686, 1869, 1803, 1763,
      43, 42, 41, 1782, 1781, 1677, 2190, 2195, 2194, 1917, 1900, 1890, 1034, 1035, 1017, 524, 523, 531, 1397, 1398, 1519, 536, 535, 534,
      244, 242, 258, 1815, 1816, 1830, 535, 536, 539, 1390, 1389, 1350, 1608, 1607, 1737, 1454, 1455, 1465, 2008, 2058, 2089, 2089, 2076, 2041,
      2491, 2490, 2494, 2123, 2078, 2116, 2141, 2129, 2123, 2123, 2116, 2141, 1761, 1720, 1687, 2041, 2039, 2030, 2008, 2089, 2041, 2041, 2030, 2008,
      2116, 2113, 2141, 2219, 2291, 2232, 1687, 1654, 1742, 1687, 1742, 1761, 2165, 2069, 2047, 2212, 2218, 2262, 2118, 2088, 2057, 2009, 1997, 1956,
      1953, 1928, 2037, 1956, 1953, 2037, 2118, 2057, 1956, 1956, 2037, 2118, 1716, 1698, 1656, 1671, 1595, 1581, 1634, 1616, 1701, 1701, 1716, 1656,
      1642, 1671, 1581, 2182, 2175, 2191, 2191, 2107, 2148, 2148, 2229, 2219, 2232, 2218, 2205, 2205, 2182, 2191, 2219, 2232, 2205, 2205, 2191, 2219,
      1742, 1839, 1761, 2011, 2029, 2003, 2047, 2144, 2173, 2173, 2190, 2165, 2165, 2047, 2173, 2234, 2168, 2212, 2262, 2234, 2212, 1956, 1946, 1953,
      2037, 2138, 2125, 2125, 2148, 2118, 2057, 2009, 1956, 2037, 2125, 2118, 1634, 1592, 1616, 1642, 1688, 1671, 1581, 1634, 1701, 1701, 1656, 1642,
      1642, 1581, 1701, 766, 765, 708, 2191, 2148, 2219, 1258, 1259, 1300, 1701, 1714, 1716, 1823, 1824, 1844, 2629, 2630, 2631, 2630, 2629, 2628,
      2023, 2024, 2017, 1944, 2066, 2072, 785, 788, 801, 661, 659, 664, 2271, 2255, 2101, 760, 759, 721, 2121, 2133, 2151, 2271, 2101, 2121,
      2121, 2151, 2271, 848, 836, 718, 1762, 1759, 1617, 2365, 2366, 2363, 570, 571, 572, 1140, 1139, 1104, 302, 301, 281, 2075, 2071, 2106,
      2106, 2109, 2075, 800, 799, 803, 1374, 1373, 1372, 2706, 2705, 2711, 1901, 1918, 1922, 724, 725, 727, 2299, 2290, 2220, 2220, 2228, 2299,
      1586, 1557, 1573, 1584, 1586, 1573, 1735, 1721, 1700, 1646, 1686, 1719, 1735, 1700, 1646, 1646, 1719, 1753, 1753, 1735, 1646, 1952, 1945, 1841,
      1841, 1741, 1804, 1865, 1891, 1901, 1922, 1952, 1841, 1922, 1841, 1865, 2192, 2204, 2216, 2228, 2146, 2256, 1573, 1547, 1584, 1700, 1615, 1646,
      1719, 1764, 1753, 1753, 1791, 1735, 1841, 1804, 1865, 1865, 1901, 1922, 2494, 2493, 2491, 1584, 1593, 1586, 2216, 2211, 2192, 1446, 1447, 1501,
      2363, 2362, 2365, 1544, 1576, 1582, 2356, 2357, 2350, 612, 613, 724, 1706, 1729, 1802, 2600, 2562, 2556, 1583, 1546, 1504, 1685, 1647, 1614,
      1591, 1633, 1583, 1468, 1441, 1538, 1582, 1494, 1579, 1802, 1740, 1653, 1653, 1685, 1614, 1591, 1583, 1504, 1706, 1802, 1653, 1653, 1614, 1591,
      1591, 1504, 1538, 1653, 1591, 1538, 1544, 1582, 1653, 1624, 1626, 1625, 1504, 1486, 1468, 1504, 1468, 1538, 1544, 1459, 1576, 1582, 1579, 1706,
      1582, 1706, 1653, 1653, 1538, 1544, 1549, 1548, 1539, 2515, 2516, 2503, 2747, 2749, 2760, 2760, 2761, 2748, 2504, 2503, 2492, 2503, 2504, 2515,
      2748, 2747, 2760, 2742, 2741, 2751, 1165, 1164, 1111, 2747, 2748, 2746, 2751, 2750, 2742, 2619, 2629, 2631, 2746, 2745, 2747, 2492, 2493, 2504,
      599, 600, 609, 2493, 2494, 2504, 2479, 2478, 2473, 1539, 1540, 1549, 2667, 2666, 2659, 901, 902, 960, 2659, 2660, 2667, 627, 628, 693,
      2136, 1917, 1890, 631, 632, 621, 2473, 2474, 2479, 2253, 2145, 2124, 1801, 1730, 1908, 2136, 1921, 1917, 2241, 2321, 2328, 1484, 1505, 1545,
      1545, 1572, 1555, 2313, 2306, 2261, 2261, 2217, 2231, 2298, 2230, 2253, 2136, 2036, 1921, 1890, 1864, 1801, 1908, 1906, 1986, 1986, 2015, 2026,
      2177, 2245, 2288, 2321, 2346, 2353, 2328, 2313, 2261, 2261, 2231, 2298, 2253, 2124, 2136, 1890, 1801, 1908, 1908, 1986, 2026, 2177, 2288, 2241,
      2321, 2353, 2328, 2328, 2261, 2298, 1890, 1908, 2026, 2026, 2177, 2241, 2328, 2298, 2253, 2136, 1890, 2026, 2241, 2328, 2253, 2136, 2026, 2241,
      2241, 2253, 2136, 1555, 1496, 1469, 1484, 1545, 1555, 2241, 2264, 2321, 1555, 1469, 1484, 2432, 2433, 2456, 2475, 2464, 2474, 2207, 2188, 2186,
      2258, 2247, 2260, 2308, 2311, 2305, 2186, 2163, 2194, 2247, 2235, 2260, 2260, 2308, 2305, 2186, 2194, 2258, 2252, 2186, 2258, 2258, 2260, 2305,
      2305, 2252, 2258, 2252, 2242, 2207, 2252, 2207, 2186, 2061, 2062, 2096, 2456, 2455, 2432, 2305, 2275, 2252, 862, 864, 868, 2464, 2463, 2474,
      1144, 1145, 1168, 2096, 2095, 2061, 417, 400, 377, 377, 414, 475, 475, 442, 417, 417, 377, 475, 2169, 2158, 2142, 2142, 2091, 2179,
      2193, 2169, 2142, 2142, 2179, 2193, 2728, 2729, 2809, 2809, 2810, 2728, 2193, 2213, 2169, 2169, 2236, 2158, 1168, 1169, 1144, 2332, 2333, 2334,
      2158, 2128, 2142, 2142, 2114, 2091, 2179, 2184, 2203, 487, 485, 488, 2179, 2203, 2193, 676, 669, 608, 2726, 2725, 2723, 2723, 2724, 2726,
      2786, 2787, 2792, 1829, 1831, 1838, 1068, 1069, 974, 2792, 2791, 2786, 2095, 2096, 2098, 2609, 2612, 2621, 2024, 2035, 2017, 850, 846, 835,
      974, 975, 1068, 1070, 1071, 1125, 2017, 1980, 1973, 1125, 1124, 1070, 992, 954, 920, 1987, 2060, 2023, 405, 403, 412, 1005, 1004, 1022,
      2604, 2564, 2585, 2035, 2014, 2017, 1987, 2051, 2060, 2017, 1973, 1987, 1026, 1022, 1058, 1058, 1059, 1026, 2024, 2045, 2035, 1017, 993, 920,
      45, 48, 78, 412, 411, 405, 1022, 1026, 1005, 2017, 1987, 2023, 2604, 2602, 2564, 2694, 2668, 2755, 2795, 2809, 2729, 2694, 2755, 2797,
      2797, 2795, 2729, 2726, 2694, 2797, 2590, 2609, 2621, 1069, 1068, 1071, 1090, 1091, 1067, 2797, 2729, 2726, 2621, 2604, 2585, 1709, 1724, 1739,
      2437, 2438, 2452, 1136, 1135, 1150, 2585, 2590, 2621, 2647, 2646, 2648, 1256, 1257, 1269, 1269, 1270, 1256, 2099, 2097, 2095, 2623, 2611, 2610,
      403, 406, 412, 2452, 2451, 2437, 2621, 2620, 2603, 1017, 1034, 993, 2622, 2620, 2624, 2726, 2724, 2694, 2593, 2594, 2597, 2597, 2599, 2593,
      93, 94, 99, 920, 924, 935, 935, 919, 927, 2624, 2623, 2622, 2603, 2604, 2621, 935, 927, 1017, 1991, 1990, 1992, 2597, 2598, 2658,
      2658, 2657, 2599, 2599, 2597, 2658, 2231, 2289, 2298, 1378, 1380, 1409, 993, 992, 920, 1290, 1289, 1218, 151, 152, 149, 49, 51, 75,
      1446, 1448, 1506, 75, 74, 49, 1840, 1947, 1954, 566, 565, 552, 2717, 2718, 2686, 2686, 2687, 2717, 94, 93, 88, 2446, 2482, 2471,
      2434, 2419, 2446, 2446, 2471, 2434, 1824, 1793, 1754, 1071, 1070, 1069, 2027, 2038, 2082, 920, 935, 1017, 386, 335, 316, 1000, 1003, 986,
      1094, 1093, 1092, 75, 74, 80, 986, 985, 1000, 2717, 2687, 2658, 1570, 1571, 1617, 1682, 1680, 1684, 1500, 1499, 1449, 1449, 1450, 1500,
      2755, 2712, 2717, 851, 850, 846, 2156, 2215, 2283, 295, 227, 175, 1243, 1211, 1204, 1002, 1001, 976, 2626, 2625, 2571, 2571, 2570, 2626,
      2687, 2640, 2658, 2658, 2598, 2614, 2643, 2668, 2755, 2658, 2614, 2643, 2643, 2755, 2717, 2570, 2572, 2626, 2717, 2658, 2643, 1730, 1729, 1728,
      1065, 1066, 1095, 71, 70, 64, 972, 971, 951, 557, 558, 561, 2607, 2608, 2610, 2643, 2653, 2668, 1006, 1024, 1029, 2300, 2287, 2270,
      953, 952, 972, 2755, 2716, 2712, 2115, 2114, 2113, 846, 847, 851, 2611, 2607, 2610, 561, 562, 557, 2152, 2189, 2188, 951, 953, 972,
      1703, 1814, 1821, 64, 70, 39, 624, 626, 617, 537, 533, 521, 2207, 2206, 2187, 604, 603, 614, 2049, 1993, 1962, 2101, 2102, 2117,
      1998, 2007, 2027, 2296, 2297, 2318, 2318, 2319, 2296, 2110, 2112, 2111, 2152, 2153, 2189, 2188, 2187, 2152, 2117, 2121, 2101, 2049, 1988, 1993,
      1852, 1924, 1824, 1852, 1824, 1840, 1666, 1670, 1664, 2720, 2719, 2731, 1824, 1754, 1840, 1840, 1954, 1998, 1840, 1998, 2027, 2731, 2730, 2720,
      85, 84, 83, 2027, 2082, 2049, 2027, 2049, 1962, 1962, 1852, 1840, 1840, 2027, 1962, 605, 606, 610, 821, 822, 815, 2714, 2715, 2719,
      2719, 2720, 2714, 1453, 1456, 1452, 1754, 1765, 1840, 2080, 2081, 2127, 2127, 2126, 2080, 2584, 2590, 2589, 2090, 2089, 2076, 1949, 1948, 1930,
      1978, 2018, 2000, 2000, 1961, 1971, 1971, 1978, 2000, 2589, 2592, 2584, 1296, 1291, 1067, 1296, 1067, 1094, 1993, 1966, 1962, 2187, 2188, 2207,
      2714, 2713, 2716, 1930, 1931, 1949, 1734, 1515, 1533, 1533, 1751, 1734, 2713, 2712, 2716, 2089, 2090, 2119, 2119, 2118, 2088, 2076, 2077, 2090,
      2589, 2590, 2609, 1227, 1226, 1248, 839, 841, 823, 2670, 2662, 2650, 2665, 2675, 2670, 2670, 2650, 2623, 2609, 2608, 2591, 2589, 2609, 2591,
      385, 384, 395, 2095, 2098, 2099, 2610, 2655, 2656, 2610, 2656, 2665, 2665, 2670, 2623, 2623, 2610, 2665, 2124, 2125, 2138, 2138, 2136, 2124,
      1852, 1923, 1924, 2623, 2622, 2611, 2088, 2089, 2119, 2584, 2585, 2590, 1067, 1091, 1094, 2650, 2635, 2623, 1309, 1314, 1434, 2154, 2155, 2162,
      1143, 1004, 1022, 1022, 1058, 1133, 1133, 1143, 1022, 2103, 2104, 2156, 2156, 2155, 2103, 467, 484, 474, 64, 65, 71, 506, 508, 516,
      516, 514, 506, 474, 470, 460, 474, 460, 467, 806, 829, 856, 40, 39, 58, 58, 57, 40, 66, 69, 57, 663, 660, 692,
      692, 691, 663, 2649, 2650, 2662, 2217, 2216, 2232, 58, 59, 66, 660, 663, 644, 2662, 2663, 2649, 2216, 2218, 2232, 57, 58, 66,
      2213, 2212, 2168, 2633, 2634, 2651, 2650, 2649, 2633, 2633, 2651, 2650, 44, 45, 42, 2704, 2684, 2685, 2168, 2169, 2213, 2232, 2231, 2217,
      2181, 2180, 2171, 42, 43, 44, 2280, 2104, 2156, 2283, 2280, 2156, 2218, 2216, 2211, 8, 11, 10, 2187, 2206, 2244, 1963, 1967, 1903,
      2572, 2569, 2655, 2276, 2304, 2300, 2300, 2270, 2246, 2246, 2187, 2244, 2178, 2177, 2245, 2245, 2243, 2178, 2246, 2152, 2187, 2244, 2254, 2276,
      2300, 2246, 2244, 2171, 2170, 2181, 1094, 1264, 1296, 2569, 2610, 2655, 2655, 2632, 2572, 2244, 2276, 2300, 2632, 2626, 2572, 2685, 2660, 2667,
      2769, 2767, 2765, 2772, 2804, 2777, 2695, 2772, 2777, 2777, 2769, 2704, 2704, 2695, 2777, 211, 220, 216, 2772, 2775, 2804, 2804, 2806, 2777,
      2685, 2667, 2695, 2769, 2765, 2704, 2704, 2685, 2695, 216, 179, 177, 177, 166, 161, 161, 171, 195, 177, 161, 195, 195, 247, 234,
      177, 195, 234, 2547, 2548, 2550, 2550, 2549, 2547, 1664, 1665, 1666, 195, 241, 247, 234, 254, 261, 211, 216, 177, 234, 261, 238,
      238, 211, 177, 234, 238, 177, 2752, 2753, 2757, 2757, 2756, 2752, 644, 645, 660, 1452, 1451, 1453, 1705, 1704, 1660, 2672, 2673, 2675,
      2211, 2212, 2218, 1660, 1703, 1705, 1799, 1800, 1776, 594, 578, 575, 2655, 2641, 2632, 2700, 2701, 2709, 10, 6, 8, 39, 45, 78,
      2013, 2014, 2035, 1243, 303, 310, 310, 1226, 1221, 1221, 1246, 1243, 1243, 310, 1221, 1167, 865, 657, 2709, 2708, 2700, 2045, 2044, 2033,
      2675, 2676, 2678, 2035, 2034, 2013, 2683, 2682, 2681, 938, 937, 936, 2550, 2548, 2574, 365, 363, 358, 295, 175, 203, 70, 58, 39,
      175, 186, 203, 39, 78, 73, 203, 213, 281, 301, 309, 380, 380, 372, 365, 365, 358, 295, 203, 281, 301, 301, 380, 365,
      203, 301, 365, 867, 885, 909, 522, 529, 531, 39, 42, 45, 73, 64, 39, 2673, 2672, 2671, 365, 295, 203, 2670, 2671, 2663,
      852, 854, 857, 2106, 2071, 2064, 2663, 2662, 2670, 2064, 1983, 2052, 2052, 2223, 2161, 2064, 2052, 2161, 616, 614, 603, 2546, 2545, 2543,
      1880, 1881, 1896, 624, 617, 616, 2678, 2677, 2674, 2081, 2127, 2249, 2249, 2226, 2086, 2086, 2081, 2249, 2674, 2675, 2678, 494, 498, 522,
      523, 517, 494, 494, 522, 531, 531, 523, 494, 838, 842, 850, 2791, 2792, 2799, 2634, 2601, 2603, 2636, 2651, 2634, 2634, 2603, 2620,
      2620, 2636, 2634, 2790, 2789, 2781, 2799, 2798, 2791, 1641, 1660, 1703, 1767, 1758, 1696, 1696, 1718, 1679, 1673, 1612, 1632, 1632, 1302, 1309,
      1703, 1821, 1690, 1690, 1767, 1696, 1696, 1679, 1673, 1632, 1309, 1434, 1641, 1703, 1690, 1690, 1696, 1673, 1632, 1434, 1604, 1641, 1690, 1673,
      1673, 1632, 1604, 1604, 1641, 1673, 1938, 1910, 1894, 1579, 1578, 1492, 2781, 2783, 2790, 2034, 2035, 2045, 2293, 2239, 2224, 2031, 2074, 2105,
      2293, 2224, 2031, 2031, 2105, 2293, 2620, 2624, 2636, 1492, 1494, 1579, 2675, 2674, 2672, 2214, 2154, 2162, 2162, 2294, 2324, 2324, 2214, 2162,
      603, 601, 594, 567, 564, 570, 567, 570, 572, 176, 228, 148, 176, 148, 159, 572, 577, 589, 598, 624, 616, 616, 603, 594,
      594, 575, 566, 572, 589, 598, 598, 616, 594, 594, 566, 567, 567, 572, 598, 598, 594, 567, 2818, 2819, 2821, 1896, 1895, 1880,
      159, 187, 176, 575, 574, 566, 2543, 2544, 2546, 463, 462, 451, 2054, 1939, 1874, 2238, 2266, 2336, 2332, 2198, 2200, 2126, 2075, 2332,
      2768, 2769, 2777, 2777, 2776, 2768, 2334, 2339, 2316, 2126, 2080, 2043, 1939, 1868, 1874, 1874, 1878, 1984, 2332, 2334, 2316, 2167, 2181, 2198,
      2126, 2043, 2054, 1874, 1984, 2075, 2075, 2160, 2238, 2316, 2167, 2198, 2200, 2056, 2087, 2054, 1874, 2075, 2238, 2336, 2332, 2332, 2316, 2198,
      2200, 2087, 2225, 2126, 2054, 2075, 2332, 2200, 2225, 2332, 2225, 2250, 345, 346, 340, 2316, 2227, 2167, 2167, 2170, 2181, 2056, 2043, 2080,
      2054, 1995, 1939, 1984, 2063, 2075, 2075, 2109, 2160, 2266, 2272, 2336, 2056, 2080, 2087, 2250, 2126, 2332, 2033, 2034, 2045, 2119, 2147, 2108,
      2821, 2820, 2818, 2108, 2196, 2176, 2179, 2091, 2085, 2077, 2119, 2108, 462, 463, 465, 2788, 2785, 2779, 1046, 1044, 1031, 2085, 2040, 2042,
      2179, 2085, 2042, 2179, 2042, 2077, 2077, 2108, 2179, 2702, 2703, 2698, 584, 588, 593, 2779, 2780, 2788, 2698, 2697, 2702, 533, 532, 538,
      1953, 1952, 1945, 538, 537, 533, 2176, 2183, 2179, 1414, 1413, 1406, 2693, 2692, 2689, 2688, 2689, 2677, 2680, 2679, 2691, 2691, 2690, 2680,
      2689, 2688, 2693, 2677, 2678, 2688, 2671, 2670, 2673, 2183, 2184, 2179, 1945, 1946, 1953, 459, 458, 452, 1325, 1324, 1340, 1340, 1341, 1325,
      2108, 2176, 2179, 1474, 1499, 1518, 2774, 2775, 2772, 2308, 2306, 2313, 666, 646, 571, 452, 453, 459, 1147, 1146, 1132, 2244, 2242, 2252,
      2664, 2638, 2617, 2617, 2586, 2596, 2596, 2580, 2642, 2642, 2706, 2721, 2664, 2617, 2596, 2642, 2721, 2664, 2664, 2596, 2642, 2252, 2254, 2244,
      2583, 2587, 2554, 2554, 2542, 2550, 2574, 2583, 2554, 2307, 2308, 2313, 2229, 2228, 2220, 2554, 2550, 2574, 865, 713, 657, 1577, 1576, 1582,
      1582, 1580, 1577, 2142, 2141, 2129, 657, 653, 584, 352, 426, 432, 2230, 2228, 2256, 2313, 2314, 2307, 865, 863, 779, 1158, 1179, 1167,
      1167, 888, 882, 865, 779, 713, 713, 701, 657, 657, 584, 593, 593, 1158, 1167, 779, 722, 713, 593, 1162, 1158, 882, 876, 865,
      1167, 882, 865, 657, 593, 1167, 2129, 2128, 2142, 713, 709, 701, 1114, 1096, 1072, 1095, 1153, 1175, 1864, 1865, 1891, 2220, 2219, 2229,
      194, 160, 167, 2256, 2253, 2230, 1027, 1028, 1084, 1082, 1027, 1084, 2194, 2163, 2164, 2164, 2190, 2194, 2121, 2117, 2134, 2134, 2133, 2121,
      2194, 2195, 2259, 158, 185, 202, 2259, 2258, 2194, 2075, 2238, 2332, 2164, 2165, 2190, 2415, 2422, 2414, 320, 332, 337, 1132, 1123, 1114,
      79, 73, 71, 1891, 1890, 1864, 2577, 2576, 2582, 1095, 1175, 1174, 1278, 1279, 1249, 1249, 1219, 1251, 2414, 2389, 2415, 2582, 2581, 2577,
      1249, 1250, 1278, 2588, 2586, 2596, 1132, 1095, 1156, 2448, 2390, 2111, 465, 464, 462, 1219, 1220, 1251, 521, 522, 498, 1114, 1072, 1095,
      77, 61, 62, 2794, 2795, 2797, 2596, 2595, 2588, 1135, 1147, 1132, 1132, 1114, 1095, 62, 43, 44, 984, 983, 981, 958, 978, 937,
      736, 742, 751, 1031, 987, 980, 1072, 1065, 1095, 1746, 1744, 1726, 73, 65, 71, 71, 114, 104, 84, 81, 87, 107, 84, 87,
      2811, 2808, 2813, 635, 686, 737, 635, 737, 717, 717, 751, 635, 1095, 1174, 1156, 217, 188, 194, 104, 115, 107, 107, 110, 84,
      62, 44, 48, 71, 104, 107, 62, 48, 79, 79, 71, 107, 107, 87, 77, 77, 62, 79, 79, 107, 77, 2812, 2813, 2816,
      2813, 2812, 2811, 396, 399, 393, 717, 736, 751, 1032, 1048, 1046, 1174, 1189, 1156, 1488, 1466, 1464, 194, 130, 123, 129, 122, 140,
      152, 172, 160, 167, 178, 180, 188, 182, 194, 155, 129, 140, 140, 152, 160, 194, 136, 155, 155, 140, 160, 180, 217, 194,
      194, 155, 160, 2516, 2503, 2492, 2816, 2815, 2812, 2583, 2619, 2631, 194, 123, 136, 167, 180, 194, 77, 68, 61, 1690, 1712, 1767,
      2797, 2796, 2794, 937, 957, 958, 289, 270, 226, 2631, 2648, 2646, 1032, 1041, 1048, 1099, 1112, 1123, 1099, 1123, 1263, 1150, 1135, 1132,
      155, 133, 129, 1371, 1396, 1491, 1336, 1332, 1328, 2559, 2558, 2553, 393, 394, 396, 2583, 2587, 2619, 2631, 2646, 2583, 1006, 1032, 1046,
      1263, 1092, 1083, 1263, 1083, 1099, 2553, 2554, 2559, 2646, 2575, 2583, 1123, 1132, 1263, 1083, 1081, 1099, 2255, 2269, 2285, 2769, 2768, 2766,
      2554, 2553, 2541, 1031, 980, 914, 967, 1006, 1046, 674, 623, 684, 684, 783, 1037, 1037, 816, 674, 674, 684, 1037, 2766, 2767, 2769,
      2541, 2542, 2554, 365, 366, 373, 373, 372, 365, 980, 911, 914, 2554, 2555, 2559, 2387, 2388, 2377, 666, 664, 659, 1518, 1553, 1559,
      1156, 1150, 1132, 1405, 1412, 1415, 2377, 2378, 2387, 425, 429, 438, 2407, 2406, 2402, 1046, 1031, 914, 1075, 1107, 1149, 1789, 1749, 1731,
      355, 519, 696, 2514, 2513, 2511, 2402, 2403, 2407, 210, 208, 184, 904, 1074, 1106, 2605, 2606, 2616, 2645, 2573, 2547, 2616, 2615, 2605,
      2511, 2512, 2514, 910, 911, 980, 980, 981, 910, 955, 962, 964, 1128, 1012, 998, 980, 982, 984, 981, 980, 984, 1512, 1510, 1508,
      1439, 1432, 1414, 277, 282, 297, 2714, 2720, 2730, 2448, 2416, 2390, 1036, 819, 811, 1559, 1541, 1497, 2728, 2725, 2692, 666, 659, 646,
      1847, 1867, 1910, 2698, 2707, 2742, 2674, 2672, 2671, 1173, 1187, 1325, 932, 951, 1183, 2224, 2053, 2031, 1854, 1868, 1939, 1855, 1775, 1752,
      1738, 1693, 1732, 1855, 1752, 1738, 2764, 2763, 2758, 1707, 1728, 1985, 277, 297, 322, 1284, 896, 845, 2361, 510, 504, 1467, 1495, 1513,
      1876, 1866, 1855, 1788, 1876, 1855, 1738, 1732, 1788, 1788, 1855, 1738, 986, 1003, 1110, 1110, 1127, 1169, 1144, 1279, 1249, 1249, 1219, 1200,
      1200, 1192, 1183, 973, 729, 720, 720, 265, 275, 83, 82, 86, 29, 15, 16, 16, 34, 91, 236, 119, 142, 5, 7, 13,
      13, 370, 342, 445, 762, 796, 796, 858, 828, 898, 906, 904, 1074, 1085, 1106, 1148, 1232, 1239, 1256, 1270, 1265, 1405, 1376, 1412,
      1415, 1383, 1424, 1424, 1420, 1433, 1460, 1445, 1462, 1470, 1442, 1474, 1487, 1449, 1499, 1507, 1478, 1509, 1511, 1425, 1518, 1541, 1503, 1497,
      1351, 1346, 1342, 1336, 1330, 1332, 1328, 1282, 1284, 1216, 1215, 1203, 1203, 1194, 1197, 1197, 1121, 1128, 1012, 1009, 998, 807, 817, 813,
      792, 762, 445, 250, 245, 189, 189, 181, 193, 35, 37, 150, 191, 168, 174, 174, 222, 232, 964, 946, 921, 912, 910, 981,
      981, 983, 1154, 1161, 1191, 1176, 1187, 1341, 1325, 1907, 1905, 1985, 1985, 2019, 2025, 2178, 2243, 2292, 2240, 2263, 2320, 2327, 2314, 2307,
      2307, 2312, 2303, 2301, 2319, 2296, 2451, 2477, 2447, 2447, 2481, 2470, 2773, 2805, 2807, 2768, 2766, 2764, 2752, 2815, 2812, 2549, 2541, 2553,
      2558, 2531, 2535, 2718, 2713, 2714, 2730, 2798, 2791, 2786, 2789, 2781, 2781, 2796, 2794, 2794, 2810, 2728, 2725, 2723, 2692, 2692, 2689, 2677,
      2671, 2663, 2649, 2649, 2633, 2600, 2111, 1550, 1589, 1589, 2461, 2516, 2467, 2461, 1589, 1631, 1301, 1307, 1102, 1052, 970, 931, 918, 934,
      925, 512, 510, 504, 503, 491, 449, 478, 476, 476, 441, 418, 405, 411, 431, 683, 784, 1036, 811, 947, 932, 951, 971, 986,
      986, 1110, 1169, 1144, 1249, 1200, 1183, 973, 720, 97, 83, 86, 63, 40, 57, 29, 16, 91, 292, 236, 142, 142, 158, 202,
      1, 5, 13, 434, 445, 796, 1148, 1239, 1256, 1415, 1424, 1433, 1351, 1342, 1336, 1216, 1203, 1197, 807, 813, 809, 792, 445, 500,
      250, 189, 193, 26, 18, 31, 31, 35, 150, 200, 191, 174, 174, 232, 277, 964, 921, 912, 912, 981, 1154, 1154, 1161, 1176,
      1728, 1907, 1985, 2178, 2292, 2240, 2307, 2303, 2301, 2436, 2451, 2447, 2742, 2761, 2748, 2770, 2773, 2807, 2768, 2764, 2758, 2752, 2812, 2811,
      2811, 2818, 2779, 2645, 2547, 2549, 2549, 2553, 2558, 2558, 2535, 2536, 2718, 2714, 2730, 2730, 2791, 2786, 2781, 2794, 2728, 2692, 2677, 2674,
      2674, 2671, 2649, 2649, 2600, 2556, 2111, 1589, 2516, 2469, 2467, 1589, 1631, 1307, 1322, 1130, 1102, 970, 970, 931, 934, 449, 476, 418,
      405, 431, 458, 643, 683, 1036, 951, 986, 1169, 1144, 1200, 1183, 1183, 720, 275, 275, 199, 204, 76, 63, 57, 69, 29, 91,
      292, 142, 202, 230, 1, 13, 432, 434, 796, 1148, 1256, 1273, 1559, 1497, 1351, 1351, 1336, 1328, 1216, 1197, 1128, 807, 809, 792,
      132, 26, 31, 31, 150, 197, 297, 317, 322, 964, 912, 1154, 1154, 1176, 1173, 2025, 2178, 2240, 2240, 2320, 2327, 2410, 2436, 2447,
      2698, 2742, 2748, 2740, 2752, 2811, 2811, 2779, 2785, 2785, 2645, 2549, 2718, 2730, 2786, 2786, 2781, 2728, 2692, 2674, 2649, 2556, 2545, 2525,
      2111, 2516, 2492, 2469, 1589, 1631, 1631, 1322, 1326, 1130, 970, 934, 491, 449, 418, 405, 458, 452, 951, 1169, 1144, 1183, 275, 204,
      86, 76, 57, 69, 91, 108, 292, 202, 214, 230, 13, 342, 432, 796, 828, 1240, 1216, 1128, 834, 807, 792, 193, 132, 31,
      936, 964, 1154, 1577, 1707, 1985, 2025, 2240, 2327, 2373, 2410, 2447, 2605, 2698, 2748, 2776, 2758, 2734, 2785, 2549, 2558, 2657, 2718, 2786,
      2786, 2728, 2692, 2692, 2649, 2556, 2556, 2525, 2448, 2448, 2111, 2492, 2469, 1631, 1326, 504, 491, 418, 405, 452, 559, 951, 1144, 1183,
      1183, 204, 97, 97, 86, 57, 292, 214, 230, 230, 342, 352, 432, 828, 855, 1559, 1351, 1284, 834, 792, 500, 409, 193, 31,
      929, 936, 1154, 1577, 1985, 2025, 2025, 2327, 2307, 2373, 2447, 2470, 2605, 2748, 2746, 2746, 2776, 2734, 2740, 2785, 2558, 2599, 2657, 2786,
      2556, 2448, 2492, 2625, 2469, 1326, 504, 418, 397, 559, 811, 932, 1183, 97, 57, 292, 230, 352, 432, 855, 891, 1284, 1128, 896,
      845, 834, 500, 500, 409, 31, 277, 355, 696, 1577, 2025, 2307, 2470, 2605, 2746, 2736, 2740, 2558, 2593, 2599, 2786, 2556, 2492, 2571,
      504, 397, 206, 405, 559, 932, 932, 1183, 57, 292, 352, 432, 432, 891, 904, 500, 31, 197, 197, 277, 696, 1457, 1577, 2307,
      2373, 2470, 2746, 2734, 2736, 2558, 2593, 2786, 2692, 2692, 2556, 2571, 405, 932, 57, 69, 292, 432, 432, 904, 1148, 1284, 845, 500,
      929, 1319, 1404, 1404, 1457, 2307, 2296, 2373, 2746, 2746, 2734, 2558, 2692, 2571, 2625, 315, 405, 57, 432, 1148, 1273, 1559, 1284, 500,
      500, 696, 733, 929, 1404, 2307, 2746, 2558, 2536, 2361, 2692, 2625, 206, 315, 57, 432, 1273, 1405, 1559, 500, 733, 733, 929, 2307,
      2296, 2746, 2536, 2361, 2625, 510, 504, 206, 57, 1559, 733, 2307, 2296, 2536, 2499, 504, 57, 69, 1518, 1559, 2307, 504, 69, 432,
      1474, 1518, 2307, 2296, 2425, 2409, 2361, 504, 432, 1462, 1474, 2307, 2296, 2409, 2399, 2361, 432, 1405, 1438, 1462, 2307, 2296, 2399, 2393,
      2393, 2361, 1405, 1433, 1438, 2307, 2296, 2393, 1405, 1415, 1433, 2307, 2301, 2296, 1405, 1405, 1415, 2307, 2307, 2301, 1405, 2372, 2370, 2360,
      69, 52, 21, 150, 170, 197, 1256, 1265, 1273, 1351, 1328, 1284, 2740, 2811, 2785, 1284, 1240, 1128, 1326, 925, 510, 2415, 2422, 2424,
      1752, 1722, 1738, 1910, 1899, 1894, 397, 209, 206, 1438, 1460, 1462, 1509, 1511, 1518, 2625, 1326, 510, 2450, 2415, 2424, 434, 439, 445,
      891, 898, 904, 1463, 1470, 1474, 1507, 1509, 1518, 2535, 2533, 2537, 2507, 2508, 2510, 1894, 1893, 1892, 142, 146, 158, 1, 3, 5,
      2510, 2509, 2507, 1130, 1116, 1102, 2601, 2602, 2604, 2701, 2699, 2696, 1474, 1487, 1499, 1326, 934, 925, 2535, 2531, 2534, 1846, 1913, 1950,
      210, 184, 145, 127, 112, 386, 386, 415, 376, 376, 398, 210, 145, 127, 386, 386, 376, 210, 145, 386, 210, 1508, 1500, 1488,
      1488, 1473, 1466, 2604, 2603, 2601, 1950, 1982, 1934, 1934, 1808, 1846, 1950, 1934, 1846, 702, 668, 666, 341, 349, 369, 369, 334, 316,
      316, 306, 319, 337, 341, 369, 320, 337, 369, 369, 316, 320, 140, 149, 152, 2531, 2532, 2534, 2537, 2536, 2535, 316, 319, 320,
      1499, 1507, 1518, 1705, 1704, 1776, 18, 22, 31, 2361, 2364, 2593, 2394, 2391, 2384, 2521, 2522, 2524, 2524, 2523, 2521, 2467, 2466, 2468,
      232, 273, 277, 1913, 1958, 1950, 2619, 2628, 2629, 479, 477, 416, 445, 496, 500, 2684, 2683, 2685, 2468, 2469, 2467, 936, 955, 964,
      2461, 2460, 2466, 2466, 2467, 2461, 2384, 2398, 2396, 2372, 2387, 2378, 2384, 2396, 2381, 2412, 2413, 2410, 206, 207, 210, 2265, 2274, 2278,
      2359, 2356, 2350, 2359, 2350, 2342, 2359, 2342, 2277, 2277, 2268, 2286, 2286, 2367, 2400, 2277, 2286, 2400, 2277, 2400, 2394, 2277, 2394, 2384,
      2359, 2277, 2384, 1589, 1611, 1631, 2394, 2407, 2403, 1894, 1871, 1863, 1128, 998, 896, 450, 479, 416, 2342, 2335, 2273, 2394, 2403, 2391,
      2372, 2360, 2359, 63, 41, 40, 1462, 1463, 1474, 2372, 2378, 2370, 2342, 2273, 2277, 904, 1106, 1148, 2384, 2381, 2372, 2517, 2518, 2519,
      2466, 2465, 2468, 1046, 914, 967, 2519, 2520, 2517, 207, 208, 210, 210, 209, 206, 2384, 2372, 2359, 2502, 2501, 2498, 2423, 2421, 2426,
      2426, 2425, 2423, 2498, 2497, 2502, 476, 477, 479, 222, 223, 173, 173, 174, 222, 1175, 1176, 1173, 2443, 2459, 2460, 416, 385, 395,
      468, 473, 482, 2459, 2466, 2460, 395, 461, 468, 416, 395, 468, 450, 416, 468, 468, 486, 450, 2482, 2481, 2470, 1846, 1850, 1913,
      2460, 2440, 2443, 489, 492, 450, 486, 489, 450, 417, 418, 397, 397, 398, 417, 209, 210, 398, 398, 397, 209, 2470, 2471, 2482,
      398, 400, 417, 183, 184, 208, 208, 207, 183, 1410, 1409, 1378, 2336, 2332, 2337, 2360, 2365, 2362, 1173, 1174, 1175, 2495, 2496, 2500,
      477, 476, 441, 2132, 2131, 2140, 1555, 1556, 1573, 2032, 1983, 2135, 441, 442, 475, 441, 475, 477, 2150, 2149, 2139, 501, 503, 491,
      2131, 2132, 2112, 1766, 1757, 1717, 604, 603, 601, 491, 492, 501, 2341, 2342, 2335, 2266, 2274, 2273, 2399, 2400, 2408, 2166, 2167, 2170,
      2335, 2337, 2341, 615, 616, 617, 1190, 1191, 1176, 2010, 2011, 2012, 468, 482, 486, 2408, 2409, 2399, 2393, 2394, 2400, 2400, 2399, 2393,
      492, 493, 501, 2112, 2110, 2131, 2077, 2090, 2119, 2410, 2411, 2412, 2500, 2499, 2495, 2381, 2382, 2371, 2139, 2140, 2150, 2149, 2150, 2167,
      2167, 2166, 2149, 1740, 1741, 1804, 1801, 1802, 1740, 1043, 1044, 1062, 449, 450, 492, 492, 491, 449, 2360, 2362, 2359, 2380, 2379, 2386,
      2400, 2401, 2408, 2371, 2372, 2381, 2357, 2356, 2359, 1647, 1646, 1686, 1686, 1685, 1647, 1740, 1804, 1801, 1552, 1513, 1556, 1099, 1113, 1114,
      2443, 2431, 2427, 2427, 2440, 2443, 2140, 2139, 2132, 1176, 1175, 1190, 1556, 1557, 1573, 1573, 1572, 1555, 2386, 2385, 2380, 2170, 2171, 2166,
      2269, 2255, 2271, 1227, 1226, 1221, 2302, 2300, 2304, 2304, 2303, 2301, 1584, 1581, 1634, 1634, 1633, 1583, 2359, 2358, 2357, 2311, 2312, 2303,
      1513, 1516, 1556, 468, 470, 474, 2300, 2302, 2284, 2287, 2285, 2269, 1117, 1103, 1053, 2361, 2360, 2370, 2370, 2369, 2361, 2332, 2333, 2337,
      2304, 2305, 2311, 2303, 2304, 2311, 474, 473, 468, 2284, 2285, 2300, 2269, 2270, 2287, 2210, 2209, 2222, 501, 502, 505, 1583, 1584, 1634,
      2285, 2287, 2300, 2383, 2384, 2391, 2391, 2392, 2383, 114, 104, 113, 505, 504, 503, 503, 501, 505, 2375, 2376, 2373, 1062, 1061, 1043,
      1175, 1177, 1190, 1312, 1298, 1146, 2807, 2806, 2804, 104, 105, 113, 1221, 1222, 1227, 2373, 2374, 2375, 1053, 969, 928, 2804, 2805, 2807,
      2175, 2176, 2196, 2257, 2294, 2162, 2032, 2052, 1983, 1983, 1877, 2135, 2202, 2257, 2162, 2135, 2202, 2162, 2073, 2032, 2135, 2135, 2162, 2073,
      2288, 2292, 2240, 1255, 1254, 1248, 1035, 1101, 1117, 1275, 1311, 1359, 2162, 2103, 2073, 2240, 2241, 2288, 1114, 1112, 1099, 1035, 1117, 1053,
      1419, 1393, 1391, 2200, 2099, 2056, 479, 478, 476, 2197, 2198, 2200, 628, 627, 626, 1053, 928, 1035, 1544, 1490, 1459, 1334, 1335, 1320,
      626, 625, 628, 2196, 2191, 2175, 2135, 2209, 2202, 2527, 2528, 2526, 1320, 1319, 1334, 2301, 2302, 2304, 1936, 1935, 1895, 2706, 2711, 2721,
      728, 739, 731, 685, 684, 623, 386, 240, 293, 2431, 2430, 2429, 2225, 2226, 2249, 2249, 2250, 2225, 623, 622, 685, 1352, 1542, 1560,
      2266, 2265, 2274, 2273, 2272, 2266, 762, 763, 793, 793, 792, 762, 2200, 2199, 2197, 1965, 1955, 1882, 2675, 2673, 2670, 75, 51, 56,
      88, 75, 56, 99, 66, 386, 905, 1075, 1149, 99, 56, 66, 2273, 2274, 2278, 2278, 2277, 2273, 1976, 1991, 1965, 88, 80, 75,
      72, 112, 386, 66, 72, 386, 293, 109, 99, 386, 293, 99, 2395, 2396, 2398, 601, 602, 604, 1988, 1989, 1994, 2161, 2106, 2064,
      90, 92, 99, 109, 90, 99, 386, 316, 240, 99, 88, 56, 2398, 2397, 2395, 2209, 2210, 2201, 1955, 1912, 1882, 1882, 1833, 1976,
      1882, 1976, 1965, 2161, 2237, 2265, 2267, 2286, 2351, 2279, 2280, 2283, 2283, 2282, 2279, 2314, 2313, 2328, 2328, 2327, 2314, 1619, 1708, 1787,
      316, 308, 240, 2267, 2351, 2348, 840, 839, 853, 2354, 2351, 2348, 1994, 1993, 1988, 1846, 1710, 1766, 2286, 2367, 2351, 2345, 2325, 2324,
      2324, 2214, 2282, 2239, 2223, 2161, 2345, 2324, 2282, 2239, 2161, 2265, 2348, 2345, 2282, 2239, 2265, 2267, 2348, 2282, 2293, 2293, 2239, 2267,
      2267, 2348, 2293, 66, 59, 72, 461, 460, 467, 108, 109, 293, 293, 292, 108, 2282, 2279, 2293, 2265, 2278, 2267, 640, 641, 610,
      1533, 1534, 1514, 2429, 2427, 2431, 616, 615, 614, 2755, 2782, 2797, 1678, 1808, 1846, 1537, 1538, 1544, 853, 852, 840, 798, 794, 782,
      1514, 1515, 1533, 2326, 2325, 2324, 336, 337, 332, 2444, 2459, 2465, 467, 469, 461, 107, 106, 116, 1044, 1045, 1062, 116, 117, 125,
      127, 126, 116, 1352, 1498, 1542, 1787, 1799, 1776, 1544, 1543, 1537, 2438, 2437, 2436, 116, 125, 127, 1744, 1743, 1747, 1614, 1615, 1592,
      1787, 1776, 1660, 206, 300, 315, 116, 115, 107, 1757, 1695, 1717, 1708, 1723, 1752, 1605, 1437, 1619, 1708, 1752, 1787, 1660, 1605, 1619,
      1787, 1660, 1619, 2526, 2525, 2527, 593, 586, 587, 702, 670, 668, 364, 357, 348, 1660, 1641, 1605, 2348, 2349, 2354, 1505, 1504, 1486,
      1763, 1883, 1892, 1895, 1896, 1936, 2268, 2267, 2286, 419, 421, 413, 1486, 1484, 1505, 139, 138, 134, 2222, 2221, 2210, 2032, 2031, 2074,
      1946, 1947, 1840, 1841, 1945, 1946, 1946, 1840, 1841, 1615, 1614, 1647, 1975, 1974, 1980, 1846, 1842, 1710, 1796, 1745, 1682, 1796, 1682, 1684,
      1684, 1575, 1796, 394, 392, 382, 56, 54, 66, 2209, 2208, 2222, 1839, 1840, 1765, 1980, 1981, 1975, 1956, 1954, 1947, 1575, 1748, 1796,
      1684, 1574, 1575, 1636, 1725, 1650, 134, 135, 139, 2074, 2073, 2032, 1765, 1761, 1839, 1526, 1636, 1650, 1947, 1946, 1956, 1727, 1726, 1725,
      1615, 1616, 1592, 2043, 2054, 1996, 1647, 1646, 1615, 1592, 1591, 1614, 1526, 1521, 1636, 413, 396, 394, 2201, 2202, 2209, 835, 834, 845,
      1607, 1599, 1587, 173, 169, 192, 1650, 1618, 1526, 1991, 1965, 2062, 2062, 2094, 2055, 357, 346, 340, 2436, 2435, 2438, 1102, 1103, 1117,
      1807, 1794, 1806, 2018, 2021, 2001, 2324, 2323, 2326, 1892, 1869, 1763, 1756, 1676, 1677, 2001, 2000, 2018, 1805, 1806, 1813, 358, 357, 364,
      1796, 1745, 1795, 1650, 1651, 1727, 1725, 1650, 1727, 1991, 2062, 2055, 1794, 1795, 1806, 1813, 1812, 1805, 333, 332, 320, 1745, 1747, 1795,
      233, 223, 173, 192, 224, 233, 2062, 2096, 2094, 461, 469, 437, 348, 369, 461, 2008, 2007, 1998, 382, 381, 373, 369, 334, 384,
      384, 395, 461, 394, 382, 373, 369, 384, 461, 420, 394, 373, 437, 420, 373, 1747, 1743, 1768, 2575, 2574, 2573, 1784, 1783, 1811,
      1877, 1878, 1874, 1998, 1997, 2009, 1724, 1723, 1708, 233, 173, 192, 2043, 1996, 1991, 373, 366, 364, 437, 429, 420, 348, 461, 437,
      437, 373, 348, 1894, 1863, 1860, 1723, 1724, 1739, 21, 20, 30, 1589, 1590, 1610, 1590, 1589, 1550, 1632, 1631, 1611, 1868, 1866, 1876,
      320, 321, 333, 1116, 1115, 1131, 1957, 1958, 1965, 396, 399, 413, 1834, 1760, 1756, 340, 344, 348, 373, 364, 348, 1806, 1795, 1747,
      1610, 1611, 1589, 1550, 1551, 1590, 1610, 1612, 1632, 1611, 1610, 1632, 1899, 1898, 1893, 845, 846, 835, 2570, 2572, 2569, 1650, 1626, 1618,
      2096, 2098, 2094, 357, 340, 348, 1958, 1957, 1951, 1860, 1861, 1857, 1898, 1899, 1910, 1958, 1955, 1965, 1708, 1709, 1724, 1116, 1102, 1117,
      1876, 1874, 1868, 382, 383, 391, 1857, 1856, 1860, 2057, 2058, 2008, 2008, 2009, 2057, 332, 333, 336, 1496, 1495, 1552, 391, 392, 382,
      1585, 1586, 1557, 1609, 1598, 1564, 1552, 1555, 1496, 1739, 1738, 1722, 30, 29, 21, 1970, 1969, 1959, 1978, 1977, 1970, 1131, 1130, 1116,
      1965, 1964, 1957, 1744, 1747, 1745, 1656, 1657, 1643, 1640, 1770, 1817, 1858, 1834, 1756, 1756, 1677, 1858, 1783, 1785, 1811, 1870, 1871, 1894,
      1960, 1961, 1971, 1649, 1648, 1652, 1937, 1938, 1960, 1960, 1959, 1937, 1857, 1858, 1834, 1745, 1746, 1744, 1557, 1556, 1585, 1643, 1642, 1656,
      1587, 1448, 1640, 1737, 1587, 1640, 1510, 1477, 1508, 1722, 1723, 1739, 1809, 1810, 1784, 1870, 1894, 1892, 1819, 1818, 1809, 1835, 1836, 1856,
      1834, 1835, 1856, 1856, 1857, 1834, 1640, 1817, 1737, 1811, 1809, 1784, 1892, 1869, 1870, 1826, 1827, 1836, 1999, 1960, 1938, 1811, 1785, 1813,
      1768, 1727, 1651, 1860, 1836, 1829, 1813, 1806, 1768, 1838, 1813, 1789, 1951, 1950, 1958, 1836, 1835, 1826, 372, 373, 381, 381, 380, 372,
      649, 650, 643, 1737, 1607, 1587, 1877, 2135, 1999, 1860, 1856, 1836, 1877, 1999, 1938, 1838, 1811, 1813, 1806, 1747, 1768, 1768, 1651, 1661,
      1789, 1731, 1788, 1788, 1877, 1938, 1768, 1661, 1789, 1789, 1788, 1938, 1938, 1829, 1838, 1789, 1938, 1838, 1970, 1971, 1978, 643, 642, 649,
      278, 283, 310, 267, 271, 278, 1512, 1508, 1476, 1522, 1465, 1454, 1836, 1827, 1829, 1938, 1847, 1910, 1813, 1768, 1789, 1876, 1875, 1877,
      413, 420, 419, 310, 303, 267, 278, 310, 267, 1784, 1777, 1663, 1894, 1860, 1829, 923, 922, 976, 1893, 1894, 1899, 136, 137, 155,
      364, 363, 358, 1809, 1811, 1819, 1418, 1422, 1471, 1996, 1992, 1991, 693, 698, 707, 15, 14, 17, 17, 16, 15, 1910, 1909, 1898,
      1461, 1444, 1455, 1461, 1455, 1476, 1838, 1819, 1811, 1938, 1894, 1829, 16, 17, 33, 33, 34, 16, 1959, 1960, 1971, 1874, 1876, 1877,
      1871, 1870, 1862, 2159, 2158, 2172, 1770, 1797, 1817, 1473, 1443, 1466, 2009, 2008, 1998, 2011, 2010, 2006, 1476, 1561, 1566, 1677, 1781, 1858,
      429, 424, 420, 1788, 1875, 1877, 1500, 1450, 1488, 1476, 1536, 1635, 1476, 1566, 1517, 1862, 1863, 1871, 1778, 1810, 1784, 1784, 1663, 1778,
      1536, 1676, 1635, 1564, 1554, 1517, 1571, 1617, 1609, 1609, 1564, 1517, 1476, 1635, 1561, 1571, 1609, 1517, 1488, 1464, 1476, 1508, 1488, 1476,
      1652, 1651, 1649, 1663, 1621, 1778, 1380, 1354, 1350, 1617, 1762, 1609, 1517, 1426, 1512, 1464, 1461, 1476, 1413, 1377, 1406, 1422, 1574, 1575,
      1493, 1522, 1454, 1439, 1414, 1410, 1471, 1481, 1454, 1339, 1305, 1350, 1400, 1409, 1380, 1354, 1339, 1350, 1350, 1400, 1380, 1476, 1517, 1512,
      1423, 1384, 1414, 1493, 1623, 1522, 1410, 1378, 1398, 1398, 1520, 1418, 1410, 1398, 1418, 1309, 1308, 1307, 1365, 1345, 1321, 1321, 1293, 1317,
      1360, 1365, 1321, 1321, 1317, 1360, 1476, 1530, 1536, 1432, 1423, 1414, 1422, 1575, 1471, 1439, 1410, 1471, 1657, 1699, 1823, 1863, 1862, 1861,
      821, 822, 825, 1380, 1358, 1354, 1414, 1406, 1410, 1410, 1418, 1471, 1471, 1454, 1439, 1139, 1137, 1206, 1418, 1427, 1422, 1481, 1493, 1454,
      1682, 1680, 1681, 637, 633, 630, 1587, 1506, 1448, 2055, 2043, 1991, 56, 55, 53, 122, 121, 118, 1433, 1432, 1439, 1971, 1970, 1959,
      2235, 2260, 2261, 1414, 1415, 1412, 420, 413, 394, 2261, 2262, 2234, 1651, 1649, 1661, 1536, 1535, 1529, 2261, 2234, 2235, 1013, 1025, 1024,
      141, 140, 122, 1439, 1438, 1433, 1861, 1860, 1863, 2044, 2020, 2022, 1432, 1421, 1423, 140, 141, 149, 53, 54, 56, 1323, 1308, 1314,
      2012, 2046, 2047, 2144, 2143, 2048, 2059, 2115, 2033, 1314, 1435, 1323, 2005, 2004, 1889, 1888, 1887, 2005, 2005, 1889, 1888, 2047, 2010, 2012,
      2048, 2047, 2144, 2234, 2236, 2158, 2158, 2157, 2233, 2044, 2022, 2059, 1409, 1408, 1411, 1482, 1480, 1471, 1105, 1060, 908, 1323, 1322, 1307,
      1916, 1915, 1888, 2033, 2044, 2059, 1398, 1519, 1520, 1327, 1326, 1322, 1307, 1308, 1323, 1888, 1889, 1916, 2059, 2050, 2083, 2059, 2083, 2115,
      1764, 1753, 1765, 1693, 1697, 1733, 1885, 1884, 1888, 2047, 2048, 2010, 1303, 1271, 1261, 1228, 1209, 1199, 1206, 1228, 1199, 1199, 1139, 1206,
      2456, 2454, 2442, 2115, 2084, 2033, 1750, 1749, 1731, 1412, 1413, 1414, 1090, 1091, 1094, 2115, 2120, 2084, 1235, 1224, 1186, 1435, 1338, 1323,
      1322, 1323, 1327, 1753, 1754, 1765, 1158, 1157, 1163, 2006, 2003, 2011, 636, 637, 633, 2084, 2070, 2033, 1172, 1252, 1261, 1261, 1244, 1235,
      1261, 1235, 1186, 1749, 1750, 1790, 1790, 1789, 1749, 1156, 1155, 1150, 1411, 1410, 1409, 1733, 1732, 1693, 1888, 1887, 1885, 1566, 1571, 1517,
      1307, 1301, 1309, 1733, 1734, 1751, 1732, 1733, 1751, 1243, 1242, 1247, 1716, 1713, 1715, 1715, 1714, 1716, 1301, 1302, 1309, 1247, 1246, 1243,
      2337, 2335, 2336, 1454, 1460, 1438, 1186, 1172, 1261, 1462, 1461, 1464, 1560, 1559, 1553, 1438, 1439, 1454, 1261, 1259, 1303, 1356, 1375, 1419,
      1385, 1362, 1365, 2070, 2067, 2033, 1211, 1212, 1242, 1242, 1243, 1211, 1162, 1163, 1205, 1464, 1463, 1462, 1204, 1205, 1213, 1211, 1204, 1213,
      1267, 1268, 1287, 1362, 1360, 1364, 1024, 1023, 1013, 1001, 1002, 1013, 1261, 1244, 1259, 1375, 1446, 1419, 1518, 1517, 1554, 1205, 1204, 1162,
      1751, 1750, 1731, 1163, 1162, 1158, 1288, 1267, 1287, 1553, 1554, 1560, 1721, 1714, 1736, 873, 871, 875, 1365, 1345, 1356, 1365, 1356, 1419,
      1365, 1419, 1385, 1554, 1553, 1518, 1466, 1470, 1463, 1474, 1473, 1488, 1488, 1487, 1474, 1333, 1332, 1330, 1499, 1500, 1508, 1508, 1507, 1499,
      1385, 1368, 1362, 1463, 1464, 1466, 1714, 1715, 1736, 1689, 1688, 1671, 1368, 1363, 1362, 1713, 1716, 1698, 698, 699, 693, 1203, 1202, 1195,
      1671, 1669, 1689, 772, 802, 827, 1350, 1389, 1400, 1378, 1387, 1398, 1731, 1732, 1751, 1598, 1596, 1600, 1195, 1194, 1203, 1645, 1644, 1668,
      795, 859, 827, 1419, 1391, 1385, 1105, 908, 894, 1282, 1283, 1285, 1285, 1284, 1282, 1360, 1361, 1364, 1352, 1351, 1346, 2042, 2041, 2039,
      825, 824, 821, 1566, 1565, 1561, 1668, 1667, 1645, 691, 692, 695, 805, 774, 790, 1346, 1347, 1352, 1698, 1702, 1713, 790, 768, 772,
      805, 790, 772, 1364, 1363, 1362, 1330, 1331, 1333, 1599, 1603, 1597, 1094, 1093, 1090, 2039, 2040, 2042, 2023, 2022, 2020, 1471, 1481, 1482,
      605, 606, 583, 1385, 1382, 1368, 1736, 1735, 1721, 700, 710, 702, 2771, 2774, 2695, 1475, 1528, 1655, 1217, 1216, 1215, 2017, 2016, 2013,
      256, 224, 257, 802, 786, 795, 1482, 1481, 1493, 2233, 2234, 2158, 827, 805, 772, 968, 1038, 1007, 1215, 1214, 1217, 2013, 2014, 2017,
      1571, 1570, 1565, 875, 874, 873, 1529, 1530, 1536, 415, 414, 377, 1209, 1218, 1290, 605, 641, 687, 950, 943, 968, 968, 1007, 950,
      377, 376, 415, 1253, 1209, 1290, 687, 637, 630, 1007, 989, 950, 652, 653, 657, 1253, 1228, 1209, 596, 581, 605, 630, 596, 605,
      605, 687, 630, 943, 917, 968, 1060, 1078, 1054, 1060, 1054, 1049, 2334, 2340, 2338, 2338, 2339, 2334, 566, 552, 539, 534, 551, 550,
      1670, 1681, 1746, 966, 959, 1060, 1016, 966, 1060, 1049, 1016, 1060, 2560, 2561, 2557, 861, 862, 771, 1554, 1558, 1560, 563, 567, 566,
      630, 619, 596, 2476, 2445, 2417, 1160, 1171, 1105, 1087, 1160, 1105, 1265, 1266, 1269, 1331, 1330, 1336, 1105, 1078, 1054, 1105, 1054, 1077,
      657, 658, 652, 2020, 2024, 2023, 533, 530, 521, 488, 568, 585, 571, 563, 539, 498, 494, 488, 521, 498, 488, 1049, 1020, 1016,
      876, 877, 881, 494, 508, 506, 506, 501, 493, 488, 556, 568, 646, 590, 577, 494, 506, 493, 652, 700, 702, 494, 493, 488,
      488, 585, 652, 652, 702, 666, 534, 537, 521, 488, 652, 666, 666, 571, 539, 488, 666, 539, 521, 488, 539, 830, 838, 835,
      1186, 1171, 1172, 1105, 1077, 1087, 1512, 1511, 1509, 1269, 1270, 1265, 577, 572, 571, 493, 487, 488, 534, 550, 537, 536, 534, 521,
      2774, 2772, 2695, 1509, 1510, 1512, 581, 605, 583, 493, 490, 487, 646, 577, 571, 539, 536, 521, 2696, 2699, 2733, 803, 745, 748,
      1138, 1097, 1073, 1907, 1908, 1730, 1728, 1907, 1730, 2695, 2666, 2696, 2695, 2696, 2733, 2733, 2745, 2771, 2771, 2695, 2733, 1706, 1707, 1728,
      1074, 1075, 1086, 899, 898, 906, 313, 311, 327, 652, 658, 700, 563, 566, 539, 1390, 1350, 1304, 1728, 1729, 1706, 906, 907, 899,
      338, 339, 326, 2348, 2349, 2344, 2733, 2747, 2745, 883, 902, 960, 1218, 1210, 1199, 354, 353, 350, 1086, 1085, 1074, 1194, 1195, 1198,
      815, 822, 833, 908, 895, 874, 874, 878, 883, 960, 908, 874, 327, 326, 313, 326, 327, 338, 1198, 1197, 1194, 765, 770, 777,
      568, 587, 585, 808, 818, 814, 800, 803, 833, 655, 656, 651, 1129, 1128, 1121, 721, 761, 806, 793, 782, 794, 1565, 1566, 1571,
      695, 694, 691, 770, 791, 777, 777, 706, 765, 804, 755, 680, 856, 889, 804, 793, 763, 731, 731, 739, 782, 838, 850, 835,
      803, 748, 815, 808, 810, 793, 830, 835, 808, 808, 793, 794, 880, 895, 874, 1121, 1122, 1129, 806, 856, 804, 804, 721, 806,
      862, 868, 826, 803, 815, 833, 830, 808, 794, 635, 637, 687, 687, 686, 635, 881, 882, 876, 2019, 2015, 1986, 777, 726, 706,
      856, 892, 889, 761, 775, 806, 802, 795, 827, 868, 832, 826, 826, 771, 862, 857, 789, 880, 857, 880, 874, 1336, 1337, 1331,
      804, 680, 721, 794, 800, 833, 1104, 1140, 1138, 2557, 2556, 2560, 1011, 1012, 1009, 1659, 1638, 1640, 717, 735, 744, 873, 840, 852,
      874, 852, 857, 2477, 2476, 2445, 528, 529, 522, 522, 521, 530, 2344, 2345, 2348, 1659, 1658, 1638, 832, 831, 838, 1038, 1007, 1104,
      2445, 2446, 2419, 2445, 2447, 2477, 530, 528, 522, 2148, 2147, 2108, 1104, 1138, 1073, 1073, 1038, 1104, 2417, 2445, 2419, 918, 919, 935,
      935, 934, 918, 941, 940, 939, 1962, 1963, 1903, 706, 708, 765, 822, 825, 833, 1903, 1902, 1962, 1986, 1985, 2019, 2108, 2107, 2148,
      1009, 1010, 1011, 350, 351, 354, 1903, 1904, 1853, 1853, 1852, 1902, 1902, 1903, 1853, 874, 883, 960, 666, 665, 664, 1600, 1599, 1597,
      832, 838, 870, 932, 933, 948, 147, 148, 159, 793, 731, 782, 159, 158, 146, 609, 678, 679, 609, 679, 680, 680, 681, 609,
      1394, 1395, 1403, 1403, 1402, 1394, 870, 916, 900, 900, 868, 832, 870, 900, 832, 143, 142, 119, 1366, 1367, 1372, 146, 147, 159,
      142, 143, 147, 695, 694, 745, 1062, 1061, 1111, 258, 242, 201, 838, 843, 870, 1073, 1063, 1038, 119, 120, 143, 2204, 2205, 2193,
      2346, 2347, 2352, 948, 947, 932, 219, 218, 226, 716, 704, 671, 767, 716, 671, 423, 419, 425, 833, 830, 794, 2352, 2353, 2346,
      1294, 1293, 1317, 893, 892, 889, 147, 146, 142, 833, 832, 831, 1640, 1637, 1659, 678, 654, 604, 808, 814, 810, 965, 964, 962,
      831, 830, 833, 907, 906, 904, 889, 890, 893, 201, 224, 269, 744, 789, 749, 749, 737, 717, 744, 749, 717, 874, 873, 852,
      1171, 1172, 1105, 645, 660, 695, 835, 834, 807, 2205, 2203, 2193, 1040, 1041, 1048, 1048, 1047, 1040, 201, 192, 224, 269, 258, 201,
      807, 808, 835, 587, 588, 593, 711, 710, 702, 702, 704, 711, 304, 288, 258, 224, 257, 269, 269, 304, 258, 904, 905, 907,
      862, 863, 865, 865, 866, 860, 242, 196, 201, 1906, 1905, 1907, 1639, 1640, 1501, 1297, 1295, 1299, 1051, 1032, 1030, 777, 776, 761,
      1292, 1291, 1296, 1159, 1160, 1087, 1076, 1077, 1087, 2737, 2738, 2735, 2736, 2737, 2735, 2341, 2342, 2350, 1281, 1280, 1291, 1291, 1292, 1281,
      761, 775, 777, 2735, 2734, 2736, 2290, 2291, 2232, 2289, 2290, 2232, 1296, 1295, 1292, 549, 550, 551, 2740, 2739, 2737, 955, 956, 963,
      936, 937, 957, 955, 936, 957, 2232, 2231, 2289, 2116, 2120, 2084, 936, 929, 938, 2737, 2736, 2740, 1907, 1908, 1906, 2078, 2116, 2084,
      773, 769, 770, 1299, 1298, 1297, 790, 791, 777, 704, 703, 711, 597, 600, 609, 2722, 2721, 2711, 2711, 2710, 2722, 1368, 1369, 1364,
      585, 584, 588, 588, 587, 585, 671, 690, 767, 963, 961, 965, 1300, 1303, 1304, 1305, 1306, 1300, 1300, 1304, 1305, 798, 794, 800,
      671, 670, 668, 564, 563, 571, 2290, 2289, 2298, 774, 790, 777, 963, 962, 955, 670, 671, 704, 929, 930, 938, 2015, 2019, 2025,
      342, 343, 371, 371, 370, 342, 571, 570, 564, 704, 702, 670, 1606, 1608, 1599, 817, 818, 814, 793, 792, 809, 501, 502, 507,
      661, 659, 646, 646, 662, 661, 2298, 2299, 2290, 711, 709, 713, 1007, 1008, 990, 713, 712, 711, 598, 625, 628, 809, 810, 793,
      668, 672, 671, 705, 706, 699, 699, 698, 705, 1008, 1007, 1104, 695, 745, 748, 1547, 1545, 1546, 844, 843, 870, 814, 813, 817,
      990, 989, 1007, 2025, 2026, 2015, 2193, 2192, 2204, 660, 692, 695, 613, 662, 598, 1364, 1363, 1368, 633, 634, 636, 1667, 1594, 1585,
      507, 506, 501, 772, 773, 770, 609, 678, 604, 604, 602, 579, 1933, 1932, 1941, 1926, 1925, 1930, 602, 595, 579, 609, 604, 579,
      451, 446, 423, 646, 590, 598, 598, 628, 693, 613, 645, 662, 770, 768, 772, 1930, 1931, 1926, 613, 724, 689, 695, 748, 662,
      662, 646, 598, 613, 689, 647, 645, 695, 662, 613, 647, 645, 598, 676, 608, 696, 697, 715, 680, 679, 721, 1944, 1943, 1941,
      598, 707, 676, 715, 714, 696, 800, 799, 798, 1087, 1088, 1159, 1941, 1942, 1933, 1840, 1839, 1841, 579, 597, 609, 1317, 1318, 1294,
      348, 347, 341, 186, 187, 176, 176, 175, 186, 110, 111, 85, 1941, 1940, 1944, 665, 666, 668, 85, 84, 110, 579, 591, 597,
      962, 963, 965, 451, 423, 425, 759, 758, 761, 1469, 1468, 1486, 1440, 1372, 1373, 810, 809, 813, 1509, 1510, 1477, 1477, 1478, 1509,
      556, 547, 543, 466, 485, 556, 462, 425, 466, 698, 705, 707, 939, 942, 941, 2619, 2618, 2628, 867, 885, 872, 485, 488, 556,
      495, 443, 464, 543, 495, 464, 466, 556, 543, 466, 543, 464, 598, 608, 613, 366, 365, 363, 605, 610, 641, 823, 867, 872,
      446, 435, 433, 433, 427, 423, 446, 433, 423, 598, 693, 707, 1546, 1583, 1547, 1087, 1089, 1076, 1675, 1676, 1536, 1675, 1536, 1674,
      872, 841, 823, 425, 438, 466, 1286, 1281, 1292, 1845, 1844, 1924, 1583, 1584, 1547, 607, 608, 613, 1349, 1371, 1537, 1349, 1537, 1440,
      1925, 1926, 1845, 1924, 1925, 1845, 2081, 2080, 2087, 337, 336, 341, 1475, 1476, 1465, 466, 464, 462, 1513, 1567, 1366, 1371, 1491, 1537,
      1513, 1366, 1372, 1292, 1299, 1349, 1467, 1513, 1372, 1373, 1292, 1349, 1440, 1467, 1372, 1373, 1349, 1440, 655, 656, 675, 2087, 2086, 2081,
      341, 349, 348, 1924, 1925, 1920, 1825, 1823, 1699, 1657, 1656, 1698, 1486, 1484, 1469, 1495, 1552, 1513, 1299, 1313, 1349, 1373, 1286, 1292,
      2162, 2155, 2103, 573, 574, 575, 2257, 2295, 2323, 746, 747, 733, 1698, 1702, 1657, 733, 734, 746, 2075, 2071, 2064, 2064, 2063, 2075,
      161, 160, 172, 363, 364, 366, 423, 419, 421, 421, 422, 423, 1920, 1923, 1924, 1963, 1962, 1966, 172, 171, 161, 579, 578, 575,
      675, 682, 655, 828, 827, 859, 1966, 1967, 1963, 705, 706, 708, 708, 707, 705, 1699, 1702, 1825, 1491, 1543, 1537, 304, 303, 288,
      1564, 1563, 1558, 859, 858, 828, 813, 814, 810, 578, 579, 595, 211, 212, 239, 1558, 1554, 1564, 1599, 1603, 1606, 239, 238, 211,
      1625, 1628, 1624, 1702, 1699, 1657, 595, 594, 578, 1608, 1607, 1599, 435, 434, 432, 496, 495, 499, 2051, 2050, 2059, 439, 444, 443,
      2030, 2027, 2007, 290, 270, 243, 495, 497, 499, 443, 445, 439, 2007, 2008, 2030, 434, 435, 440, 611, 607, 613, 499, 500, 496,
      2059, 2060, 2051, 1536, 1535, 1674, 575, 580, 579, 445, 443, 495, 495, 496, 445, 742, 744, 735, 735, 736, 742, 243, 285, 290,
      1639, 1501, 1447, 1424, 1423, 1384, 439, 440, 444, 1188, 1189, 1156, 1156, 1155, 1188, 432, 433, 435, 1928, 1922, 1921, 270, 225, 243,
      1305, 1304, 1350, 1817, 1815, 1737, 1625, 1626, 1618, 1384, 1383, 1424, 2770, 2771, 2745, 2745, 2746, 2770, 435, 436, 440, 440, 439, 434,
      543, 525, 495, 992, 991, 988, 1628, 1627, 1624, 196, 195, 241, 519, 520, 527, 244, 242, 196, 527, 526, 519, 241, 244, 196,
      1943, 1944, 2066, 2067, 2065, 1943, 2066, 2067, 1943, 942, 997, 1055, 1812, 1783, 1777, 530, 528, 532, 532, 533, 530, 2072, 2070, 2067,
      514, 515, 518, 1778, 1779, 1622, 1622, 1621, 1778, 928, 927, 1017, 517, 518, 524, 1597, 1598, 1600, 516, 514, 518, 1595, 1593, 1594,
      356, 471, 520, 1102, 1103, 1053, 1277, 1276, 1275, 524, 523, 517, 871, 872, 841, 1763, 1762, 1883, 988, 993, 992, 871, 841, 840,
      2657, 2658, 2640, 1053, 1052, 1102, 226, 225, 219, 1618, 1613, 1625, 2640, 2639, 2657, 542, 543, 547, 840, 873, 871, 2067, 2066, 2072,
      546, 555, 569, 1968, 1967, 1966, 1394, 1402, 1458, 1458, 1489, 1394, 1448, 1501, 1640, 1170, 1171, 1160, 1160, 1159, 1170, 338, 325, 2,
      462, 451, 425, 544, 545, 540, 883, 884, 879, 1828, 1829, 1827, 540, 541, 544, 1832, 1831, 1829, 547, 546, 542, 2682, 2681, 2711,
      2151, 2246, 2271, 1676, 1675, 1677, 2711, 2738, 2735, 734, 930, 1067, 1690, 1694, 1820, 1082, 1083, 1081, 2595, 2579, 2568, 2682, 2711, 2735,
      2735, 2759, 2682, 1280, 296, 318, 318, 280, 287, 447, 457, 480, 697, 715, 746, 1028, 1084, 1090, 1067, 1280, 318, 318, 287, 323,
      447, 480, 471, 1067, 318, 323, 1820, 1821, 1690, 2765, 2704, 2682, 1067, 1291, 1280, 323, 331, 360, 520, 527, 544, 930, 938, 979,
      323, 360, 356, 520, 544, 541, 697, 746, 734, 930, 979, 1028, 1028, 1090, 1067, 930, 1028, 1067, 1067, 356, 520, 1067, 520, 697,
      1081, 1080, 1082, 305, 309, 301, 309, 305, 311, 787, 786, 795, 448, 447, 457, 457, 456, 448, 324, 325, 328, 328, 329, 324,
      1821, 1820, 1833, 1061, 1043, 1031, 402, 401, 410, 410, 409, 402, 311, 313, 309, 987, 984, 1111, 697, 734, 1067, 1400, 1401, 1390,
      1390, 1389, 1400, 2759, 2765, 2682, 984, 1165, 1111, 1061, 1031, 987, 1030, 1029, 1032, 1829, 1828, 1832, 672, 671, 690, 1831, 1832, 1837,
      984, 1152, 1165, 1111, 1061, 987, 1092, 1093, 1084, 1084, 1083, 1092, 879, 878, 883, 1357, 1356, 1375, 1833, 1822, 1821, 2758, 2759, 2735,
      2735, 2734, 2758, 301, 302, 305, 1837, 1838, 1831, 1066, 1065, 1072, 1619, 1620, 1683, 1773, 1774, 1854, 1006, 1029, 1032, 987, 982, 984,
      1084, 1093, 1090, 1827, 1826, 1828, 1854, 1775, 1773, 1392, 1391, 1381, 1429, 1427, 1418, 1776, 1704, 1660, 1854, 1855, 1775, 2759, 2762, 2765,
      356, 447, 471, 2413, 2412, 2405, 202, 203, 213, 213, 214, 202, 1275, 1274, 1277, 1001, 976, 945, 2762, 2763, 2764, 2760, 2749, 2733,
      1242, 1374, 1372, 1096, 1051, 1030, 1388, 1417, 1451, 214, 213, 231, 2595, 2596, 2580, 1459, 1458, 1489, 1490, 1491, 1543, 2741, 2751, 2760,
      2733, 2700, 2708, 2733, 2708, 2741, 2405, 2404, 2413, 2568, 2567, 2578, 1766, 1767, 1758, 1491, 1490, 1459, 1543, 1544, 1490, 2741, 2760, 2733,
      956, 963, 1080, 1080, 1082, 1027, 1248, 1254, 1267, 2255, 2434, 2472, 520, 541, 697, 976, 923, 945, 1030, 1013, 1001, 965, 1081, 1113,
      1001, 965, 1096, 99, 93, 88, 2352, 2353, 2328, 2328, 2327, 2352, 1027, 977, 958, 1080, 1027, 958, 2518, 2519, 2524, 2576, 2582, 2616,
      2679, 2691, 2702, 2697, 2709, 2701, 2701, 2696, 2666, 2666, 2659, 1472, 1472, 1212, 1242, 1267, 1288, 1374, 1367, 1568, 1602, 2255, 2285, 2434,
      2518, 2524, 2522, 2576, 2616, 2606, 2679, 2702, 2697, 2697, 2701, 2666, 2666, 1472, 1242, 1248, 1267, 1374, 2697, 2666, 1242, 1247, 1248, 1374,
      2518, 2576, 2606, 2606, 2697, 1242, 2255, 2518, 2606, 2255, 2606, 1242, 1242, 1372, 1367, 1886, 2255, 1242, 1242, 1367, 1602, 1691, 1886, 1242,
      231, 230, 214, 795, 797, 787, 1881, 1880, 1879, 1190, 1095, 1047, 1247, 1222, 1227, 1247, 1227, 1248, 2518, 2522, 2576, 2255, 2472, 2518,
      1242, 1247, 1374, 1242, 1602, 1691, 1030, 1025, 1013, 1081, 1099, 1113, 965, 1113, 1096, 1096, 1030, 1001, 1051, 1040, 1047, 1095, 1051, 1047,
      1072, 1066, 1051, 965, 961, 1081, 2575, 2574, 2583, 1111, 1164, 1190, 1001, 945, 965, 1040, 1041, 1032, 601, 602, 595, 2580, 2579, 2595,
      1418, 1428, 1429, 1489, 1491, 1459, 2661, 2664, 2638, 2638, 2637, 2661, 1046, 1045, 1062, 1190, 1177, 1153, 1095, 1066, 1051, 1047, 1062, 1190,
      958, 956, 1080, 1417, 1430, 1453, 1109, 1108, 1119, 1581, 1584, 1593, 308, 307, 319, 1119, 1118, 1124, 2606, 2679, 2697, 1119, 1120, 1109,
      595, 594, 601, 2070, 2072, 2079, 1062, 1111, 1190, 2578, 2579, 2568, 1711, 1710, 1766, 1124, 1125, 1119, 2095, 2097, 2199, 1690, 1694, 1711,
      2185, 2186, 2188, 1766, 1767, 1712, 1766, 1712, 1711, 2347, 2346, 2321, 2321, 2320, 2347, 1593, 1595, 1581, 1921, 1922, 1918, 1679, 1678, 1717,
      105, 113, 125, 1292, 1295, 1299, 2079, 2084, 2070, 861, 862, 865, 865, 860, 861, 1441, 1440, 1537, 125, 117, 105, 1758, 1757, 1766,
      2123, 2122, 2079, 1633, 1634, 1592, 1711, 1712, 1690, 307, 308, 240, 1537, 1538, 1441, 1190, 1153, 1095, 655, 682, 639, 639, 621, 655,
      1051, 1042, 1032, 1602, 1562, 1569, 2079, 2078, 2123, 1592, 1591, 1633, 2711, 2710, 2737, 1717, 1718, 1679, 1096, 1072, 1051, 2180, 2171, 1982,
      1602, 1601, 1562, 2737, 2738, 2711, 2038, 2040, 2085, 1568, 1569, 1516, 1936, 1935, 1944, 1495, 1496, 1469, 1467, 1468, 1441, 2766, 2767, 2765,
      1569, 1568, 1602, 1516, 1513, 1567, 1441, 1440, 1467, 2264, 2263, 2320, 2158, 2159, 2130, 1468, 1467, 1495, 312, 299, 289, 639, 632, 621,
      621, 651, 655, 1957, 1964, 2061, 2061, 2095, 2199, 2171, 2149, 1982, 1982, 1957, 2061, 1982, 2061, 2180, 2320, 2321, 2264, 770, 769, 766,
      2149, 1934, 1982, 1982, 1951, 1957, 2761, 2760, 2751, 2751, 2750, 2761, 289, 226, 312, 294, 252, 258, 2284, 2302, 2318, 2374, 2375, 2379,
      2379, 2386, 2405, 2435, 2438, 2452, 2452, 2476, 2417, 2374, 2379, 2405, 2374, 2405, 2411, 2411, 2435, 2417, 2374, 2411, 2417, 1721, 1714, 1701,
      1701, 1700, 1721, 2130, 2128, 2158, 288, 303, 1243, 235, 248, 258, 258, 288, 1243, 1243, 1204, 294, 252, 235, 258, 258, 1243, 294,
      2284, 2318, 2297, 2435, 2452, 2417, 2417, 2284, 2374, 1029, 1030, 1025, 1025, 1024, 1029, 1154, 1152, 984, 984, 983, 1154, 2091, 2092, 2083,
      319, 306, 308, 2128, 2130, 2122, 2114, 2115, 2092, 2284, 2297, 2374, 1271, 1262, 1252, 1032, 1042, 1040, 2454, 2453, 2455, 2765, 2764, 2766,
      2085, 2082, 2038, 2085, 2091, 2083, 1952, 1953, 1928, 248, 244, 258, 2171, 2166, 2149, 2405, 2412, 2411, 2455, 2456, 2454, 1997, 1998, 1954,
      1954, 1956, 1997, 2188, 2189, 2185, 2122, 2123, 2129, 2092, 2091, 2114, 2158, 2157, 2172, 480, 481, 472, 2116, 2120, 2115, 2173, 2174, 2159,
      2172, 2173, 2159, 1928, 1922, 1952, 472, 471, 480, 96, 95, 97, 389, 390, 387, 1039, 1038, 1063, 267, 268, 274, 240, 237, 307,
      2129, 2128, 2122, 2113, 2116, 2115, 1006, 967, 913, 1047, 1046, 1062, 387, 388, 389, 197, 195, 201, 1433, 1432, 1421, 1802, 1801, 1730,
      1730, 1729, 1802, 1769, 1768, 1727, 1864, 1865, 1804, 1740, 1741, 1654, 2442, 2441, 2453, 1873, 1872, 1927, 2136, 2138, 2037, 2037, 2036, 2136,
      1167, 1166, 1178, 1567, 1568, 1516, 226, 218, 312, 1804, 1801, 1864, 2764, 2765, 2762, 1927, 1929, 1873, 1841, 1839, 1742, 252, 255, 235,
      2341, 2350, 2357, 2193, 2192, 2211, 1178, 1179, 1167, 1918, 1917, 1921, 1742, 1741, 1841, 2790, 2787, 2715, 2199, 2197, 2180, 1741, 1742, 1654,
      2453, 2454, 2442, 1063, 1064, 1039, 274, 271, 267, 2076, 2077, 2042, 2042, 2041, 2076, 913, 922, 976, 1013, 1023, 1006, 1006, 913, 976,
      976, 1013, 1006, 2061, 2199, 2180, 1654, 1653, 1740, 322, 323, 331, 201, 200, 197, 277, 278, 271, 2027, 2030, 2039, 976, 1002, 1013,
      331, 330, 322, 1152, 1154, 1161, 195, 196, 201, 1421, 1420, 1433, 2040, 2038, 2027, 1727, 1726, 1769, 1191, 1190, 1164, 1164, 1161, 1191,
      2212, 2213, 2193, 1541, 1542, 1502, 847, 846, 845, 851, 999, 1011, 1164, 1165, 1152, 1161, 1164, 1152, 2258, 2259, 2248, 2248, 2247, 2258,
      1502, 1503, 1541, 529, 528, 531, 1067, 323, 356, 1848, 1847, 1919, 2211, 2212, 2193, 1919, 1849, 1848, 2178, 2177, 2026, 2026, 2025, 2178,
      2733, 2699, 2701, 1937, 1938, 1919, 1395, 1396, 1371, 1489, 1491, 1396, 1395, 1394, 1489, 511, 510, 512, 2701, 2700, 2733, 2039, 2040, 2027,
      2216, 2218, 2205, 2216, 2205, 2204, 1371, 1370, 1395, 1489, 1396, 1395, 766, 765, 770, 2261, 2260, 2308, 2216, 2217, 2261, 1320, 1403, 1395,
      1146, 1136, 1150, 1150, 1155, 1188, 1188, 1340, 1324, 1324, 1335, 1320, 1150, 1188, 1324, 245, 246, 249, 249, 250, 245, 2182, 2205, 2184,
      2261, 2262, 2218, 2261, 2218, 2216, 1320, 1395, 1348, 1320, 1348, 1312, 1312, 1150, 1324, 1324, 1320, 1312, 322, 323, 287, 277, 278, 283,
      2205, 2203, 2184, 194, 193, 181, 2308, 2306, 2261, 2312, 2311, 2308, 2308, 2307, 2312, 1395, 1370, 1348, 1312, 1146, 1150, 297, 296, 318,
      318, 317, 297, 2084, 2079, 2078, 282, 283, 296, 296, 297, 282, 181, 182, 194, 2182, 2183, 2176, 2176, 2175, 2182, 1080, 1081, 961,
      961, 963, 1080, 2275, 2276, 2304, 141, 36, 38, 38, 151, 141, 287, 286, 322, 283, 282, 277, 2164, 2165, 2069, 2069, 2068, 2164,
      2164, 2163, 2186, 2207, 2206, 2244, 2304, 2305, 2275, 2186, 2185, 2164, 2244, 2242, 2207, 945, 946, 964, 1226, 1248, 1255, 359, 360, 331,
      331, 330, 359, 1792, 1793, 1754, 978, 977, 938, 1823, 1824, 1793, 1685, 1686, 1654, 1817, 1815, 1798, 2011, 2012, 2028, 512, 513, 511,
      1793, 1792, 1825, 1815, 1816, 1798, 747, 746, 715, 97, 98, 96, 1791, 1792, 1754, 5, 6, 8, 1825, 1823, 1793, 1686, 1687, 1654,
      1084, 1083, 1082, 1719, 1720, 1687, 1798, 1797, 1817, 355, 356, 360, 1754, 1753, 1791, 957, 956, 958, 977, 979, 938, 1654, 1653, 1685,
      1687, 1686, 1719, 2292, 2288, 2245, 360, 359, 355, 715, 714, 747, 1027, 1028, 979, 979, 977, 1027, 1264, 1263, 1297, 1263, 1264, 1094,
      1092, 1263, 1094, 2245, 2243, 2292, 1253, 1206, 1073, 448, 447, 356, 356, 355, 448, 1949, 1948, 1972, 938, 937, 978, 592, 591, 597,
      1295, 1296, 1264, 1297, 1295, 1264, 1989, 1988, 2049, 1987, 1989, 2049, 279, 280, 287, 287, 286, 279, 1402, 1403, 1320, 1404, 1402, 1320,
      1972, 1973, 1949, 1577, 1576, 1459, 1457, 1577, 1459, 2082, 2083, 2050, 2050, 2049, 2082, 1923, 1920, 1853, 1853, 1852, 1923, 1791, 1792, 1736,
      2050, 2051, 1987, 1498, 1497, 1503, 2145, 2146, 2125, 1457, 1458, 1402, 1402, 1404, 1457, 32, 118, 122, 964, 965, 945, 1320, 1319, 1404,
      929, 930, 734, 734, 733, 929, 2228, 2230, 2298, 1736, 1735, 1791, 2049, 2050, 1987, 1989, 1987, 1973, 1973, 1972, 1989, 2228, 2229, 2148,
      2028, 2029, 2011, 527, 526, 545, 696, 697, 541, 541, 540, 696, 1525, 1527, 1524, 229, 228, 148, 1501, 1448, 1446, 471, 472, 519,
      2298, 2299, 2228, 1503, 1502, 1498, 2146, 2148, 2125, 2125, 2124, 2145, 2148, 2146, 2228, 137, 124, 32, 457, 456, 481, 545, 544, 527,
      519, 520, 471, 2241, 2240, 2263, 1370, 1371, 1349, 1349, 1348, 1370, 141, 36, 32, 122, 141, 32, 481, 480, 457, 2801, 2802, 2780,
      1985, 1986, 1906, 1906, 1905, 1985, 2780, 2779, 2801, 1311, 1310, 1316, 2263, 2264, 2241, 148, 147, 229, 1316, 1315, 1311, 2813, 2630, 2628,
      128, 133, 137, 2744, 2743, 2756, 217, 215, 221, 913, 914, 911, 912, 913, 911, 1455, 1465, 1476, 118, 121, 128, 118, 128, 137,
      725, 689, 648, 2756, 2757, 2744, 2237, 2238, 2266, 2266, 2265, 2237, 1043, 1044, 1031, 921, 946, 923, 124, 23, 32, 32, 31, 22,
      921, 922, 913, 913, 912, 921, 173, 174, 168, 1495, 1469, 1468, 2722, 2737, 2739, 2628, 2637, 2722, 133, 155, 137, 137, 32, 118,
      317, 318, 280, 280, 279, 317, 23, 22, 18, 35, 36, 38, 22, 23, 32, 31, 32, 36, 946, 945, 923, 168, 169, 173,
      1255, 1287, 1280, 2637, 2661, 2722, 2722, 2710, 2737, 2753, 2816, 2813, 2628, 2618, 2637, 2739, 2757, 2753, 2753, 2813, 2628, 2722, 2739, 2753,
      18, 19, 23, 36, 35, 31, 10, 9, 12, 234, 235, 248, 911, 910, 912, 215, 217, 188, 2739, 2744, 2757, 2753, 2628, 2722,
      38, 37, 35, 1415, 1414, 1384, 248, 247, 234, 1917, 1918, 1901, 188, 190, 215, 221, 220, 216, 1384, 1383, 1415, 1901, 1900, 1917,
      2036, 2037, 1928, 1921, 2036, 1928, 1226, 1255, 1280, 1429, 1427, 1422, 1900, 1901, 1891, 1891, 1890, 1900, 2148, 2147, 2119, 2119, 2118, 2148,
      2253, 2256, 2146, 2146, 2145, 2253, 1280, 296, 283, 2802, 2819, 2821, 1016, 1014, 997, 283, 310, 1226, 1280, 283, 1226, 2788, 2780, 2802,
      2813, 2630, 2648, 2813, 2648, 2788, 2788, 2802, 2808, 2808, 2813, 2788, 1, 0, 2, 3, 2, 4, 5, 3, 4, 2290, 2291, 2219,
      2219, 2220, 2290, 2108, 2107, 2191, 2088, 2089, 2058, 2058, 2057, 2088, 2630, 2631, 2648, 2648, 2647, 2788, 2802, 2821, 2808, 2477, 2476, 2452,
      2452, 2451, 2477, 2, 3, 1, 2592, 2589, 2566, 2566, 2565, 2591, 1764, 1761, 1720, 1720, 1719, 1764, 1967, 1968, 1904, 1904, 1903, 1967,
      2191, 2196, 2108, 2024, 2020, 2044, 23, 19, 25, 27, 131, 124, 27, 124, 23, 1255, 1268, 1287, 2285, 2418, 2434, 2404, 2405, 2386,
      2386, 2385, 2404, 1115, 1117, 1101, 1845, 1844, 1872, 1993, 1994, 1968, 1700, 1701, 1616, 1975, 1974, 1933, 1933, 1932, 1975, 1146, 1132, 1263,
      2436, 2435, 2411, 2411, 2410, 2436, 1286, 1287, 1280, 2580, 2579, 2578, 1872, 1873, 1845, 1966, 1993, 1968, 1616, 1615, 1700, 1643, 1642, 1688,
      1263, 1297, 1298, 1298, 1146, 1263, 2523, 2524, 2519, 2519, 2520, 2523, 997, 996, 1015, 2044, 2045, 2024, 1688, 1689, 1643, 23, 25, 27,
      2615, 2616, 2582, 2582, 2581, 2615, 1280, 1281, 1286, 1101, 1100, 1115, 1015, 1016, 997, 1941, 1942, 1929, 1929, 1927, 1940, 2703, 2702, 2691,
      2691, 2690, 2703, 1940, 1941, 1929, 2247, 2248, 2233, 2233, 2235, 2247, 2059, 2060, 2023, 2114, 2113, 2141, 757, 890, 905, 2023, 2022, 2059,
      2141, 2142, 2114, 2234, 2236, 2169, 2169, 2168, 2234, 1374, 1373, 1286, 1104, 1008, 990, 2683, 1658, 1977, 1286, 1288, 1374, 1459, 1458, 1457,
      2184, 2183, 2182, 2589, 2539, 2566, 900, 877, 887, 1707, 1706, 1579, 1579, 1578, 1707, 1309, 1308, 1314, 2708, 2709, 2697, 2697, 2698, 2707,
      2707, 2708, 2697, 2742, 2741, 2708, 2708, 2707, 2742, 232, 233, 223, 2591, 2592, 2566, 2195, 2190, 2173, 2252, 2254, 2276, 2067, 2065, 2034,
      2034, 2033, 2067, 2143, 2144, 2173, 596, 582, 576, 2577, 2576, 2522, 2522, 2521, 2577, 271, 274, 233, 233, 232, 273, 2173, 2172, 2195,
      1980, 1981, 2016, 2472, 2471, 2470, 2173, 2174, 2143, 1204, 294, 251, 877, 881, 887, 1391, 1386, 1381, 2380, 2379, 2375, 2375, 2376, 2380,
      1255, 1254, 1267, 1524, 1523, 1525, 2083, 2082, 2085, 2481, 2482, 2446, 2445, 2447, 2481, 2276, 2275, 2252, 2016, 2017, 1980, 864, 860, 866,
      887, 1166, 1236, 1369, 1364, 1290, 63, 62, 61, 12, 11, 13, 27, 26, 24, 2234, 2233, 2235, 2481, 2446, 2445, 2471, 2472, 2434,
      221, 215, 246, 1166, 1178, 1182, 1182, 1230, 1236, 1206, 1098, 1073, 2680, 2679, 2606, 2606, 2605, 2680, 24, 25, 27, 1567, 1568, 1367,
      1367, 1366, 1567, 273, 271, 233, 1149, 1148, 1232, 764, 763, 762, 2517, 2518, 2472, 2470, 2517, 2472, 1645, 1644, 1562, 1562, 1569, 1645,
      2417, 2418, 2285, 2285, 2284, 2417, 1236, 1629, 1639, 1364, 1361, 1318, 1318, 1294, 1290, 968, 916, 900, 1064, 1039, 900, 1369, 1290, 1253,
      1064, 900, 887, 1253, 1064, 887, 2319, 2318, 2302, 1232, 1233, 1149, 1620, 1619, 1437, 968, 917, 916, 1206, 1137, 1098, 1639, 1447, 1419,
      1364, 1318, 1290, 1639, 1419, 1392, 1639, 1392, 1381, 887, 1639, 1381, 887, 1381, 1253, 1580, 1582, 1494, 1494, 1492, 1580, 2805, 2775, 2774,
      2302, 2301, 2319, 2373, 2374, 2297, 2297, 2296, 2373, 223, 222, 232, 1166, 1182, 1236, 1039, 968, 900, 1253, 1073, 1064, 2419, 2418, 2417,
      2773, 2774, 2771, 2739, 2740, 2743, 1267, 1268, 1255, 1434, 1436, 1620, 1620, 1437, 1434, 2805, 2804, 2775, 2774, 2773, 2805, 826, 824, 771,
      900, 864, 866, 1324, 1325, 1334, 2771, 2770, 2773, 2743, 2744, 2739, 1765, 1761, 1764, 1885, 1884, 1692, 1692, 1691, 1886, 1886, 1885, 1692,
      2101, 2102, 1885, 1885, 1886, 2100, 1114, 1113, 1096, 2719, 2731, 2799, 2799, 2792, 2719, 887, 1236, 1639, 1334, 1335, 1324, 1348, 1349, 1313,
      1313, 1312, 1348, 1287, 1286, 1288, 1474, 1473, 1443, 249, 389, 410, 1601, 1602, 1691, 1588, 1357, 1344, 1341, 1340, 1188, 1188, 1187, 1341,
      2807, 2806, 2777, 2777, 2776, 2807, 1858, 1857, 1782, 1188, 1189, 1174, 1174, 1173, 1187, 1187, 1188, 1174, 1443, 1442, 1474, 1691, 1692, 1601,
      2763, 2762, 2759, 1381, 1369, 1253, 2759, 2758, 2763, 262, 212, 221, 440, 436, 451, 2100, 2101, 1885, 711, 712, 723, 1830, 1815, 1737,
      1886, 2100, 2255, 451, 463, 440, 407, 408, 378, 1222, 1221, 1246, 778, 861, 771, 723, 778, 771, 711, 723, 771, 436, 446, 451,
      1752, 1773, 1787, 12, 11, 10, 271, 273, 277, 1147, 1146, 1136, 1047, 1048, 1046, 2792, 2787, 2719, 1312, 1313, 1299, 1299, 1298, 1312,
      8, 7, 5, 1246, 1247, 1222, 1136, 1135, 1147, 1717, 1846, 1766, 957, 956, 955, 2151, 2152, 2134, 632, 631, 638, 923, 922, 921,
      1054, 1057, 1077, 378, 379, 407, 61, 60, 63, 267, 303, 269, 268, 269, 257, 262, 239, 212, 771, 716, 711, 2271, 2270, 2269,
      1782, 1781, 1858, 303, 304, 269, 568, 569, 586, 389, 388, 401, 1659, 1969, 1959, 542, 543, 525, 1717, 1718, 1696, 215, 190, 246,
      569, 586, 593, 389, 401, 410, 716, 703, 711, 1919, 1849, 1830, 1919, 1830, 1798, 1659, 1959, 1919, 1919, 1798, 1659, 1696, 1695, 1717,
      2152, 2153, 2134, 2068, 2069, 2047, 2047, 2046, 2068, 2270, 2271, 2246, 2681, 2705, 2711, 499, 497, 525, 525, 542, 546, 593, 1162, 1204,
      546, 569, 593, 593, 1204, 251, 546, 593, 251, 262, 221, 249, 262, 249, 546, 771, 767, 716, 1830, 1816, 1798, 1770, 1637, 1659,
      1056, 1076, 1208, 1546, 1545, 1505, 2134, 2133, 2151, 499, 525, 546, 221, 246, 249, 546, 251, 262, 990, 949, 944, 1594, 1593, 1586,
      1586, 1585, 1594, 257, 256, 268, 1916, 1914, 1881, 1879, 1669, 1671, 2028, 2003, 2004, 1914, 1916, 2004, 1594, 1667, 1668, 410, 499, 546,
      249, 410, 546, 1505, 1504, 1546, 1572, 1573, 1547, 1572, 1547, 1545, 1879, 1915, 1916, 1916, 1881, 1879, 1879, 1880, 1669, 1671, 1668, 1879,
      2028, 2029, 2003, 2004, 2005, 2028, 2003, 2006, 1914, 2004, 2003, 1914, 1668, 1671, 1595, 1668, 1595, 1594, 1800, 1799, 1787, 1787, 1786, 1800,
      251, 253, 262, 1959, 1937, 1919, 944, 917, 916, 1231, 1630, 1658, 2056, 2055, 2043, 2565, 2566, 2539, 777, 775, 774, 638, 639, 632,
      989, 990, 949, 86, 87, 81, 81, 82, 86, 197, 195, 171, 2539, 2538, 2565, 261, 262, 239, 1798, 1770, 1659, 171, 152, 150,
      517, 509, 494, 1329, 1333, 1337, 150, 151, 38, 38, 37, 150, 171, 172, 152, 150, 170, 171, 1182, 1181, 1180, 586, 587, 568,
      2667, 2666, 2695, 815, 748, 661, 665, 815, 661, 2683, 2685, 2660, 1180, 1181, 1231, 1217, 1216, 1240, 253, 255, 235, 999, 998, 1009,
      2659, 2660, 1472, 665, 821, 815, 171, 170, 197, 1240, 1241, 1217, 1360, 1362, 1365, 239, 238, 261, 1197, 1198, 1122, 1344, 1321, 1218,
      1285, 1329, 1352, 2510, 2512, 2514, 1630, 1638, 1658, 2642, 2681, 2683, 2021, 2222, 2331, 1213, 1212, 1472, 1393, 1392, 1419, 1446, 1447, 1419,
      254, 253, 235, 949, 950, 989, 1122, 1121, 1197, 1198, 1195, 1202, 2368, 2401, 2408, 2408, 2421, 2426, 2500, 2496, 2502, 2502, 2497, 2508,
      2642, 2705, 2681, 1658, 1970, 1977, 2021, 2001, 2137, 2355, 2368, 2408, 2537, 2567, 2642, 2683, 2660, 1472, 1472, 1205, 1163, 2331, 2355, 2408,
      2500, 2508, 2510, 2537, 2642, 2683, 2683, 1472, 1163, 1163, 1231, 1658, 2331, 2408, 2426, 2500, 2510, 2514, 2514, 2537, 2683, 2683, 1163, 1658,
      2500, 2514, 2683, 2426, 2500, 2683, 2683, 1977, 2021, 2021, 2426, 2683, 1392, 1393, 1391, 1253, 1229, 1206, 1705, 1776, 1800, 2537, 2533, 2567,
      2567, 2578, 2642, 1472, 1213, 1205, 2137, 2208, 2222, 2500, 2502, 2508, 1163, 1180, 1231, 2021, 2137, 2222, 2021, 2331, 2426, 235, 234, 254,
      1231, 1237, 1630, 2683, 2682, 2704, 151, 149, 141, 1129, 1198, 1217, 640, 667, 688, 2704, 2684, 2683, 1009, 1010, 999, 1337, 1343, 1347,
      999, 1010, 1011, 2715, 2754, 2790, 1560, 1558, 1563, 1337, 1347, 1352, 1199, 1129, 1217, 1163, 1157, 1180, 2330, 2210, 2257, 1360, 1361, 1318,
      1179, 1178, 1182, 220, 221, 212, 1518, 1517, 1426, 1426, 1425, 1518, 2787, 2719, 2715, 2754, 2783, 2790, 1563, 1596, 1600, 916, 870, 851,
      1329, 1337, 1352, 1199, 851, 1129, 648, 644, 663, 2326, 2344, 2349, 2349, 2354, 2330, 2330, 2221, 2210, 2210, 2201, 2257, 2257, 2323, 2326,
      2326, 2349, 2330, 2257, 2326, 2330, 1318, 1317, 1360, 806, 805, 827, 2568, 2534, 2532, 2559, 2555, 2588, 2588, 2595, 2568, 2568, 2532, 2559,
      2559, 2588, 2568, 668, 665, 821, 1285, 1283, 1329, 1498, 1502, 1542, 1506, 1446, 1375, 1129, 1122, 1198, 1560, 1563, 1600, 1588, 1506, 1375,
      1321, 1289, 1218, 1199, 1104, 990, 1198, 1202, 1217, 1560, 1600, 1588, 990, 916, 851, 1352, 1560, 1588, 1285, 1352, 1588, 1241, 1344, 1218,
      825, 824, 826, 1382, 1381, 1369, 790, 791, 770, 1342, 1343, 1337, 827, 828, 855, 821, 824, 771, 1609, 1597, 1603, 1199, 1139, 1104,
      870, 844, 851, 1588, 1375, 1357, 1285, 1588, 1344, 1218, 1217, 1241, 1157, 1158, 1179, 1369, 1368, 1382, 1138, 1137, 1139, 770, 768, 790,
      212, 211, 220, 855, 856, 829, 690, 672, 668, 1202, 1214, 1217, 1321, 1293, 1289, 851, 847, 897, 990, 944, 916, 851, 897, 999,
      1199, 990, 851, 821, 771, 690, 690, 668, 821, 661, 664, 665, 1898, 1893, 1883, 2046, 2012, 2028, 2028, 2005, 1887, 1887, 1885, 2102,
      2134, 2153, 2189, 2189, 2185, 2164, 2068, 2046, 2028, 2028, 1887, 2102, 2134, 2189, 2164, 2028, 2102, 2134, 2134, 2164, 2028, 1179, 1180, 1157,
      1332, 1333, 1329, 827, 829, 806, 1883, 1762, 1609, 1780, 1898, 1883, 1883, 1609, 1603, 1772, 1780, 1898, 1737, 1772, 1898, 1333, 1331, 1337,
      1218, 1199, 1217, 2164, 2068, 2028, 1516, 1569, 1645, 1585, 1516, 1645, 798, 782, 739, 1337, 1336, 1342, 1737, 1608, 1772, 1898, 1909, 1867,
      1848, 1830, 1737, 1848, 1737, 1898, 2083, 2092, 2115, 1585, 1556, 1516, 1645, 1667, 1585, 727, 725, 648, 1848, 1847, 1867, 1231, 1230, 1236,
      1603, 1606, 1771, 1603, 1771, 1780, 1780, 1883, 1603, 2102, 2117, 2134, 663, 799, 798, 1598, 1597, 1609, 1385, 1386, 1381, 1381, 1382, 1385,
      771, 767, 690, 1570, 1565, 1870, 851, 1011, 1129, 1630, 1629, 1639, 1329, 1328, 1332, 1637, 1770, 1640, 1898, 1867, 1848, 739, 728, 727,
      648, 663, 798, 648, 798, 739, 1640, 1638, 1630, 122, 121, 128, 1759, 1617, 1570, 739, 727, 648, 855, 829, 827, 167, 166, 177,
      2233, 2157, 2172, 2259, 2248, 2233, 1236, 1237, 1231, 1565, 1862, 1870, 1870, 1759, 1570, 1782, 1677, 1675, 900, 866, 877, 2172, 2195, 2259,
      2233, 2172, 2259, 1241, 1285, 1344, 1149, 1390, 1271, 1097, 1098, 1137, 2552, 2551, 2560, 177, 178, 167, 136, 137, 124, 124, 123, 136,
      669, 607, 611, 2560, 2561, 2552, 128, 129, 122, 2578, 2642, 2580, 311, 327, 338, 179, 180, 178, 178, 177, 179, 1202, 1203, 1215,
      1869, 1870, 1803, 1635, 1561, 1565, 1565, 1861, 1782, 390, 389, 249, 249, 250, 390, 888, 887, 1166, 1215, 1214, 1202, 1861, 1857, 1782,
      1675, 1635, 1565, 1782, 1675, 1565, 2423, 2421, 2408, 500, 499, 410, 410, 409, 500, 2021, 2018, 1978, 1978, 1977, 2021, 1166, 1167, 888,
      130, 131, 27, 27, 26, 132, 132, 130, 27, 193, 194, 130, 130, 132, 193, 862, 863, 779, 779, 778, 861, 2536, 2537, 2514,
      2514, 2513, 2536, 1106, 1107, 1086, 2612, 2611, 2622, 1565, 1862, 1861, 2501, 2502, 2496, 2499, 2500, 2426, 2426, 2425, 2499, 2408, 2409, 2423,
      1658, 1659, 1969, 1086, 1085, 1106, 2330, 2331, 2222, 2222, 2221, 2330, 1587, 1588, 1506, 611, 780, 785, 24, 25, 19, 19, 18, 24,
      2567, 2568, 2534, 2534, 2533, 2567, 1969, 1970, 1658, 1139, 1140, 1138, 1230, 1231, 1181, 1181, 1182, 1230, 1629, 1630, 1237, 1237, 1236, 1629,
      887, 888, 882, 1137, 1138, 1097, 611, 801, 773, 1760, 1755, 1535, 2496, 2495, 2501, 2620, 2621, 2612, 766, 708, 677, 773, 766, 677,
      773, 677, 611, 2511, 2512, 2510, 2510, 2509, 2511, 778, 779, 722, 722, 723, 778, 216, 217, 221, 2355, 2354, 2351, 764, 732, 727,
      1522, 1465, 1475, 1655, 1837, 1818, 1888, 1915, 1879, 1879, 1668, 1644, 1644, 1562, 1601, 1601, 1884, 1879, 691, 663, 799, 745, 694, 691,
      2815, 2816, 2753, 2753, 2752, 2815, 2367, 2368, 2355, 2351, 2367, 2355, 2462, 2460, 2461, 861, 862, 779, 2354, 2355, 2331, 2331, 2330, 2354,
      2400, 2401, 2368, 2368, 2367, 2400, 1601, 1692, 1884, 1879, 1644, 1601, 799, 803, 745, 691, 799, 745, 2528, 2527, 2529, 152, 151, 150,
      2722, 2721, 2664, 2664, 2661, 2722, 611, 785, 801, 1655, 1832, 1837, 1818, 1809, 1779, 1522, 1475, 1655, 1818, 1779, 1522, 1522, 1655, 1818,
      1884, 1888, 1879, 1833, 1822, 1814, 1639, 1640, 1630, 1779, 1622, 1522, 1800, 1786, 1859, 2529, 2530, 2528, 865, 866, 877, 1762, 1759, 1803,
      1803, 1759, 1870, 1762, 1803, 1763, 1795, 1794, 1796, 773, 769, 766, 1655, 1832, 1828, 2558, 2559, 2532, 2532, 2531, 2558, 402, 401, 388,
      1343, 1342, 1346, 1284, 1285, 1241, 882, 881, 887, 1755, 1674, 1535, 1535, 1529, 1655, 1535, 1655, 1828, 1225, 1234, 1275, 1859, 1976, 1833,
      1814, 1705, 1800, 1800, 1859, 1833, 2587, 2588, 2555, 2555, 2554, 2587, 2637, 2638, 2617, 2619, 2618, 2637, 2637, 2617, 2619, 2588, 2587, 2619,
      2619, 2586, 2588, 1241, 1240, 1284, 1826, 1835, 1760, 1760, 1535, 1828, 1417, 1453, 1451, 1527, 1627, 1648, 2507, 2508, 2497, 2497, 2498, 2507,
      388, 387, 402, 832, 833, 825, 2619, 2617, 2586, 877, 876, 865, 701, 700, 710, 1507, 1508, 1477, 1259, 1300, 1303, 1833, 1814, 1800,
      2716, 2715, 2714, 1477, 1478, 1507, 1828, 1826, 1760, 2686, 2687, 2640, 2640, 2639, 2686, 1117, 1115, 1116, 1346, 1347, 1343, 1210, 1209, 1218,
      785, 787, 797, 1056, 1388, 1451, 2202, 2201, 2257, 903, 941, 942, 1209, 1210, 1199, 1213, 1212, 1211, 2295, 2294, 2324, 548, 553, 558,
      1234, 1260, 1275, 934, 924, 926, 1599, 1600, 1588, 943, 944, 917, 1056, 1275, 1388, 189, 188, 182, 2324, 2323, 2295, 841, 839, 840,
      1675, 1676, 1635, 233, 274, 268, 638, 631, 531, 245, 246, 190, 189, 245, 190, 1622, 1623, 1522, 1542, 1541, 1559, 2789, 2790, 2787,
      711, 709, 701, 256, 224, 233, 724, 612, 781, 781, 785, 797, 2345, 2344, 2326, 871, 875, 879, 909, 871, 879, 2549, 2550, 2542,
      2810, 2809, 2795, 2795, 2794, 2810, 1755, 1756, 1676, 1675, 1674, 1755, 1755, 1676, 1675, 268, 256, 233, 1359, 1379, 1388, 620, 629, 634,
      558, 620, 634, 997, 1021, 1055, 2326, 2325, 2345, 1588, 1587, 1599, 1182, 1180, 1179, 2613, 2614, 2598, 727, 724, 781, 651, 656, 675,
      558, 634, 839, 1059, 675, 638, 757, 804, 890, 610, 606, 583, 2209, 2208, 2137, 2137, 2135, 2209, 2135, 2137, 2001, 2001, 1999, 2135,
      2001, 2000, 1961, 1961, 1960, 1999, 1999, 2001, 1961, 487, 485, 486, 2598, 2597, 2613, 2643, 2644, 2652, 1356, 1357, 1344, 654, 604, 614,
      614, 743, 721, 1482, 1805, 1812, 1663, 1623, 1493, 1777, 1663, 1493, 1493, 1482, 1777, 781, 797, 727, 1662, 1790, 1750, 1059, 1026, 524,
      532, 538, 548, 531, 532, 548, 1059, 651, 675, 1275, 1359, 1388, 867, 909, 1055, 867, 1055, 1056, 638, 823, 867, 894, 880, 757,
      2647, 2646, 2575, 2573, 2645, 2647, 2647, 2575, 2573, 2785, 2788, 2647, 2647, 2645, 2785, 2573, 2574, 2548, 2548, 2547, 2573, 2542, 2541, 2549,
      2652, 2653, 2643, 721, 679, 654, 614, 615, 743, 721, 654, 614, 1527, 1524, 1540, 1534, 1151, 1141, 524, 621, 651, 631, 621, 524,
      558, 561, 620, 634, 636, 752, 752, 853, 839, 1059, 524, 651, 631, 524, 531, 1648, 1750, 1141, 531, 548, 558, 909, 879, 942,
      1527, 1648, 1141, 638, 531, 558, 909, 942, 1055, 1485, 1527, 1141, 1056, 1451, 1141, 867, 1056, 1134, 802, 801, 773, 1771, 1772, 1608,
      1608, 1606, 1771, 367, 368, 374, 1663, 1623, 1622, 1663, 1622, 1621, 743, 760, 721, 1748, 1575, 1471, 1471, 1480, 1807, 1807, 1748, 1471,
      1076, 1089, 1208, 1627, 1652, 1648, 634, 752, 839, 1451, 1485, 1141, 638, 839, 823, 1345, 1344, 1321, 368, 367, 362, 1344, 1345, 1356,
      1807, 1794, 1748, 1627, 1624, 1652, 879, 884, 903, 1059, 638, 867, 1271, 1105, 894, 1598, 1596, 1563, 1563, 1564, 1598, 1328, 1329, 1283,
      1283, 1282, 1328, 362, 361, 368, 1011, 1012, 1128, 1497, 1498, 1352, 1352, 1351, 1497, 896, 897, 847, 845, 896, 847, 1234, 1245, 1260,
      1311, 1315, 1355, 531, 528, 532, 997, 1014, 1021, 1527, 1540, 1627, 1648, 1662, 1750, 879, 903, 942, 339, 324, 329, 1271, 905, 1149,
      2820, 2821, 2808, 2808, 2811, 2820, 182, 181, 189, 1559, 1560, 1542, 998, 999, 897, 897, 896, 998, 1128, 1129, 1011, 1260, 1276, 1275,
      1540, 1549, 1627, 1311, 1355, 1359, 1056, 1208, 1225, 1134, 1059, 867, 428, 422, 339, 350, 428, 339, 773, 772, 802, 374, 375, 367,
      1056, 1225, 1275, 422, 326, 339, 339, 329, 350, 1640, 1639, 1637, 1482, 1812, 1777, 1075, 1086, 1107, 1454, 1455, 1444, 9, 12, 343,
      693, 626, 617, 1479, 1531, 1664, 1056, 1141, 1134, 757, 754, 804, 124, 123, 130, 726, 706, 699, 1664, 1670, 1746, 890, 893, 899,
      1272, 1401, 1390, 1149, 1272, 1390, 2718, 2717, 2712, 458, 459, 455, 455, 454, 458, 1460, 1454, 1444, 761, 776, 726, 900, 869, 864,
      1750, 1534, 1141, 350, 353, 428, 1252, 1172, 1105, 899, 907, 905, 1272, 1407, 1411, 1149, 1238, 1257, 1390, 1304, 1271, 2818, 2819, 2802,
      2802, 2801, 2818, 2798, 2799, 2731, 2731, 2730, 2798, 1293, 1294, 1290, 361, 362, 272, 272, 276, 361, 1444, 1445, 1460, 693, 627, 626,
      693, 617, 761, 2338, 2428, 2439, 1418, 1428, 1479, 1060, 959, 908, 880, 789, 749, 1149, 1233, 1238, 1257, 1269, 1266, 890, 899, 905,
      1272, 1411, 1401, 576, 535, 539, 552, 565, 573, 573, 640, 610, 576, 539, 552, 552, 573, 610, 610, 576, 552, 2394, 2393, 2406,
      2712, 2713, 2718, 1098, 1097, 1073, 617, 615, 743, 1411, 1408, 1401, 880, 749, 757, 1271, 1252, 1105, 1149, 1257, 1272, 894, 757, 905,
      1271, 894, 905, 2406, 2407, 2394, 826, 832, 825, 130, 131, 124, 1290, 1289, 1293, 2622, 2620, 2612, 343, 354, 351, 1418, 1479, 1664,
      1664, 1746, 1726, 749, 740, 757, 2391, 2392, 2402, 1303, 1304, 1271, 2694, 2693, 2692, 843, 842, 850, 726, 699, 693, 761, 726, 693,
      1636, 1521, 1418, 1726, 1636, 1418, 610, 583, 576, 2402, 2403, 2391, 252, 251, 253, 850, 851, 844, 2594, 2597, 2613, 1744, 1769, 1726,
      1726, 1418, 1664, 1950, 1951, 1982, 2613, 2644, 2652, 2594, 2613, 2688, 244, 241, 247, 723, 722, 713, 713, 712, 723, 1256, 1257, 1238,
      944, 943, 950, 1743, 1744, 1769, 2688, 2337, 2341, 2357, 2358, 2363, 2652, 2669, 2688, 2688, 2341, 2357, 2357, 2363, 2594, 2613, 2652, 2688,
      743, 758, 761, 247, 248, 244, 160, 161, 166, 2669, 2693, 2688, 2688, 2357, 2594, 721, 759, 761, 1806, 1805, 1807, 266, 265, 275,
      166, 167, 160, 2636, 2635, 2650, 1521, 1418, 1520, 253, 255, 252, 2787, 2786, 2789, 1479, 1532, 1684, 253, 254, 261, 1238, 1239, 1256,
      850, 844, 843, 463, 440, 444, 12, 371, 343, 343, 351, 328, 9, 343, 328, 2783, 2781, 2796, 4, 6, 5, 2650, 2651, 2636,
      830, 831, 838, 1511, 1512, 1426, 1426, 1425, 1511, 328, 325, 2, 328, 2, 9, 2796, 2797, 2782, 276, 272, 266, 261, 262, 253,
      1661, 1662, 1648, 1648, 1649, 1661, 2, 4, 9, 2363, 2366, 2594, 1684, 1574, 1422, 1532, 1666, 1684, 1684, 1422, 1479, 1377, 1376, 1405,
      1262, 1261, 1271, 2564, 2563, 2584, 2754, 2755, 2716, 2716, 2715, 2754, 2783, 2782, 2755, 2755, 2754, 2783, 444, 465, 463, 1843, 1846, 1851,
      1532, 1665, 1666, 609, 599, 575, 1405, 1406, 1377, 2584, 2585, 2564, 1422, 1429, 1479, 1257, 1266, 1272, 2796, 2782, 2783, 950, 949, 944,
      1526, 1520, 1519, 575, 640, 688, 1784, 1783, 1777, 2490, 2491, 2505, 1666, 1680, 1684, 597, 592, 575, 599, 597, 575, 2505, 2506, 2490,
      1769, 1768, 1743, 591, 592, 580, 591, 580, 579, 421, 326, 313, 313, 309, 380, 413, 421, 313, 313, 380, 391, 413, 313, 391,
      592, 580, 575, 688, 738, 741, 688, 741, 609, 575, 688, 609, 1133, 1134, 1141, 738, 750, 741, 753, 681, 609, 547, 546, 555,
      1812, 1813, 1785, 1785, 1783, 1812, 864, 862, 861, 861, 860, 864, 1142, 1141, 1151, 575, 573, 640, 1410, 1411, 1407, 617, 743, 761,
      741, 753, 609, 1223, 1224, 1186, 710, 711, 701, 741, 756, 753, 275, 276, 266, 1412, 1413, 1377, 1377, 1376, 1412, 380, 383, 391,
      1820, 1694, 1711, 1882, 1820, 1711, 1142, 1143, 1133, 391, 393, 399, 1851, 1911, 1882, 1843, 1851, 1882, 1882, 1711, 1843, 555, 556, 547,
      102, 103, 101, 569, 568, 556, 556, 555, 569, 652, 653, 584, 584, 585, 652, 858, 859, 795, 795, 796, 858, 1739, 1697, 1005,
      2397, 2398, 2384, 2384, 2383, 2397, 1476, 1475, 1528, 780, 781, 612, 612, 611, 780, 1355, 1354, 1358, 1882, 1833, 1820, 1529, 1530, 1476,
      1186, 1185, 1223, 700, 701, 657, 657, 658, 700, 216, 217, 180, 2395, 2396, 2381, 2381, 2382, 2395, 1528, 1529, 1476, 1358, 1359, 1355,
      180, 179, 216, 1456, 1452, 1483, 648, 647, 645, 959, 960, 908, 583, 582, 581, 2468, 2688, 2340, 1407, 1406, 1410, 891, 892, 856,
      1625, 1613, 1526, 1523, 1539, 1548, 2282, 2283, 2215, 2215, 2214, 2282, 2478, 2479, 2458, 2458, 2457, 2478, 2214, 2215, 2156, 2155, 2154, 2214,
      2214, 2156, 2155, 856, 855, 891, 1526, 1519, 1416, 551, 554, 562, 2485, 2484, 2488, 391, 399, 413, 751, 854, 789, 1523, 1548, 1526,
      554, 557, 562, 898, 899, 893, 789, 744, 751, 1548, 1628, 1625, 1519, 1397, 1416, 1548, 1625, 1526, 1456, 1483, 1523, 1526, 1416, 1431,
      1456, 1523, 1526, 1526, 1431, 1456, 1266, 1265, 1273, 1014, 1016, 1020, 1306, 1305, 1339, 966, 960, 940, 156, 157, 154, 2488, 2489, 2485,
      940, 939, 996, 854, 857, 789, 534, 551, 562, 1388, 1399, 1417, 1483, 1525, 1523, 576, 535, 534, 562, 618, 596, 596, 576, 534,
      562, 596, 534, 1470, 1466, 1443, 1443, 1442, 1470, 1810, 1809, 1779, 645, 644, 648, 1277, 1310, 1316, 1020, 1021, 1014, 1487, 1488, 1450,
      1450, 1449, 1487, 1834, 1835, 1760, 1779, 1778, 1810, 1233, 1232, 1239, 940, 996, 966, 638, 558, 839, 551, 549, 554, 1141, 1142, 1133,
      1339, 1306, 1300, 960, 901, 940, 2676, 2678, 2688, 1159, 1088, 1207, 1207, 1223, 1185, 1004, 1005, 1142, 1273, 1272, 1266, 753, 755, 754,
      1807, 1805, 1482, 2474, 2473, 2475, 817, 818, 808, 892, 891, 898, 2458, 2479, 2474, 1300, 1277, 1316, 1185, 1170, 1159, 1142, 1143, 1004,
      966, 960, 959, 748, 662, 661, 1409, 1408, 1401, 1401, 1400, 1409, 1837, 1838, 1819, 1462, 1461, 1444, 1482, 1480, 1807, 808, 807, 817,
      797, 764, 727, 2474, 2463, 2442, 2442, 2140, 2150, 2439, 2462, 2504, 2439, 2504, 2487, 2487, 2458, 2227, 1316, 1353, 1339, 1300, 1258, 1277,
      1316, 1339, 1300, 996, 1015, 966, 2468, 2627, 2641, 1185, 1159, 1207, 1424, 1423, 1421, 1819, 1818, 1837, 1444, 1445, 1462, 2227, 2315, 2338,
      2462, 2515, 2504, 2150, 2167, 2227, 2227, 2338, 2439, 2458, 2474, 2442, 2442, 2150, 2227, 2458, 2442, 2227, 2227, 2439, 2487, 2688, 2337, 2333,
      2430, 2444, 2468, 2340, 2429, 2430, 2656, 2676, 2688, 2688, 2333, 2340, 2444, 2465, 2468, 2468, 2654, 2688, 2340, 2430, 2468, 2656, 2665, 2676,
      2654, 2656, 2688, 1239, 1238, 1233, 1277, 1274, 1310, 2468, 2641, 2654, 1260, 1259, 1258, 2627, 2632, 2641, 1421, 1420, 1424, 1021, 1050, 1055,
      2388, 2387, 2372, 2372, 2371, 2388, 2490, 2494, 2504, 2433, 2432, 2449, 2, 139, 231, 2105, 2281, 2293, 677, 669, 611, 2543, 2544, 2530,
      786, 802, 788, 749, 750, 741, 231, 213, 281, 281, 302, 305, 311, 338, 2, 802, 801, 788, 898, 893, 892, 2, 0, 135,
      311, 2, 231, 2530, 2529, 2543, 2449, 2450, 2433, 231, 281, 305, 231, 305, 311, 2293, 2281, 2280, 2280, 2279, 2293, 2280, 2281, 2105,
      2105, 2104, 2280, 2370, 2369, 2377, 2104, 2105, 2074, 2103, 2104, 2074, 269, 268, 267, 2611, 2612, 2609, 2, 135, 139, 2464, 2488, 2569,
      2333, 2334, 2340, 2377, 2378, 2370, 741, 740, 749, 2074, 2073, 2103, 1234, 1235, 1244, 2464, 2475, 2488, 566, 565, 573, 1666, 1670, 1681,
      647, 648, 689, 763, 764, 732, 2611, 2609, 2608, 2608, 2591, 2565, 2565, 2538, 2453, 2453, 2441, 2464, 2505, 2493, 2569, 2569, 2608, 2565,
      2565, 2453, 2464, 2569, 2565, 2464, 573, 574, 566, 762, 796, 795, 795, 764, 762, 684, 685, 642, 1185, 1186, 1171, 1171, 1170, 1185,
      2505, 2491, 2493, 2635, 2636, 2624, 1406, 1407, 1272, 1272, 1273, 1405, 1405, 1406, 1272, 795, 797, 764, 2608, 2607, 2611, 1610, 1672, 1678,
      2493, 2570, 2569, 2488, 2505, 2569, 154, 153, 156, 732, 731, 763, 1244, 1245, 1234, 1681, 1746, 1682, 507, 502, 505, 2624, 2623, 2635,
      1664, 1665, 1532, 2475, 2484, 2488, 2569, 2610, 2608, 511, 954, 991, 1532, 1531, 1664, 298, 299, 289, 784, 783, 684, 684, 683, 784,
      582, 581, 596, 1100, 1131, 1327, 260, 259, 263, 754, 757, 753, 787, 788, 785, 1746, 1745, 1682, 641, 640, 667, 1327, 1323, 1338,
      737, 738, 688, 686, 737, 688, 226, 225, 270, 738, 737, 749, 1673, 1672, 1678, 608, 607, 669, 1808, 2139, 1590, 1105, 1079, 1060,
      1151, 1142, 1005, 1005, 1026, 524, 515, 507, 505, 511, 926, 920, 991, 1033, 1100, 1697, 1151, 1005, 515, 505, 511, 991, 1100, 1327,
      1005, 515, 511, 749, 750, 738, 1074, 1075, 905, 905, 904, 1074, 1148, 1149, 1107, 1107, 1106, 1148, 642, 643, 683, 1808, 1934, 2149,
      1590, 1610, 1678, 1808, 2149, 2139, 1590, 1678, 1808, 1697, 1733, 1514, 1514, 1534, 1151, 991, 988, 1033, 1338, 1436, 1620, 1697, 1514, 1151,
      1005, 524, 518, 1620, 1683, 1739, 1005, 518, 515, 1327, 1620, 1739, 991, 1327, 1739, 1005, 511, 991, 991, 1739, 1005, 191, 192, 169,
      169, 168, 191, 1681, 1680, 1666, 200, 201, 192, 191, 200, 192, 289, 291, 298, 886, 885, 872, 889, 890, 804, 731, 732, 728,
      2139, 2132, 1590, 1683, 1709, 1739, 1100, 1115, 1131, 1327, 1338, 1620, 511, 920, 954, 757, 756, 741, 741, 740, 757, 872, 871, 886,
      819, 816, 812, 2655, 2654, 2656, 511, 513, 926, 101, 100, 102, 2505, 2506, 2489, 991, 992, 954, 1619, 1683, 1708, 2723, 2724, 2694,
      2692, 2723, 2694, 755, 753, 681, 341, 336, 333, 707, 708, 677, 707, 677, 676, 2654, 2655, 2641, 683, 684, 642, 757, 756, 753,
      681, 680, 755, 885, 886, 909, 1678, 1679, 1673, 2489, 2488, 2505, 428, 423, 422, 788, 787, 786, 613, 612, 611, 563, 564, 567,
      1388, 1387, 1398, 875, 874, 878, 2490, 2504, 2457, 2490, 2457, 2478, 2267, 2268, 2277, 2223, 2224, 2053, 2053, 2052, 2223, 2526, 2528, 2530,
      2489, 2506, 2490, 2504, 2487, 2457, 2485, 2489, 2490, 2478, 2485, 2490, 2052, 2053, 2031, 1431, 1430, 1417, 1417, 1416, 1431, 1353, 1354, 1315,
      1650, 1651, 1624, 1077, 1076, 1056, 1056, 1057, 1077, 1456, 1453, 1430, 1430, 1431, 1456, 554, 553, 548, 2478, 2473, 2485, 909, 886, 871,
      630, 629, 620, 1259, 1260, 1245, 550, 548, 538, 1398, 1399, 1388, 619, 620, 561, 618, 619, 561, 2112, 2132, 1590, 1604, 1605, 1437,
      2031, 2032, 2052, 620, 619, 630, 1245, 1244, 1259, 743, 758, 759, 561, 562, 618, 1354, 1355, 1315, 1315, 1316, 1353, 589, 590, 598,
      626, 625, 598, 598, 624, 626, 1651, 1652, 1624, 1624, 1626, 1650, 751, 752, 636, 637, 635, 751, 751, 636, 637, 1590, 1551, 2112,
      590, 589, 577, 2728, 2729, 2726, 1225, 1224, 1235, 759, 760, 743, 550, 549, 554, 554, 548, 550, 852, 853, 752, 752, 751, 854,
      854, 852, 752, 878, 879, 875, 996, 997, 942, 942, 939, 996, 1277, 1276, 1260, 1258, 1277, 1260, 1628, 1627, 1549, 2538, 2453, 2455,
      2668, 2669, 2693, 1434, 1604, 1437, 1757, 1758, 1696, 1310, 1311, 1275, 1275, 1274, 1310, 538, 537, 550, 1235, 1234, 1225, 1378, 1379, 1359,
      1358, 1380, 1378, 1549, 1548, 1628, 1055, 1054, 1057, 1338, 1436, 1434, 1434, 1435, 1338, 2546, 2552, 2561, 2526, 2546, 2557, 2693, 2694, 2668,
      419, 420, 424, 1416, 1417, 1399, 1525, 1527, 1485, 1485, 1483, 1525, 1696, 1695, 1757, 1224, 1225, 1208, 1208, 1207, 1223, 1539, 1540, 1524,
      1524, 1523, 1539, 2669, 2668, 2653, 2653, 2652, 2669, 1483, 1485, 1451, 1451, 1452, 1483, 1378, 1359, 1358, 2557, 2563, 2584, 2455, 2449, 2526,
      2557, 2584, 2538, 2538, 2455, 2526, 2557, 2538, 2526, 2726, 2725, 2728, 424, 425, 419, 884, 883, 902, 940, 941, 903, 2455, 2432, 2449,
      2584, 2592, 2538, 2277, 2278, 2267, 902, 903, 884, 902, 901, 940, 940, 903, 902, 2526, 2530, 2546, 2546, 2561, 2557, 2414, 2420, 2456,
      190, 188, 189, 1397, 1416, 1399, 1207, 1208, 1089, 1088, 1207, 1089, 837, 836, 848, 289, 290, 285, 805, 806, 775, 2424, 2433, 2450,
      2442, 2140, 2131, 438, 437, 429, 2363, 2362, 2359, 1223, 1224, 1208, 2366, 2365, 2360, 2360, 2361, 2364, 2364, 2366, 2360, 291, 289, 285,
      775, 774, 805, 2593, 2594, 2366, 2366, 2364, 2593, 777, 776, 726, 2131, 2110, 2389, 2424, 2433, 2456, 2442, 2131, 2389, 2442, 2389, 2414,
      2456, 2442, 2414, 2359, 2358, 2363, 2644, 2643, 2614, 2614, 2613, 2644, 1021, 1020, 1049, 333, 143, 147, 340, 344, 341, 341, 333, 147,
      2530, 2544, 2546, 2420, 2424, 2456, 1399, 1398, 1397, 285, 284, 291, 147, 229, 295, 147, 295, 340, 340, 341, 147, 1057, 1056, 1055,
      1089, 1087, 1088, 295, 345, 340, 1049, 1050, 1021, 719, 718, 836, 284, 285, 243, 1387, 1388, 1379, 344, 347, 341, 675, 682, 639,
      639, 638, 675, 629, 630, 633, 2055, 2056, 2093, 931, 927, 919, 836, 837, 719, 931, 970, 928, 1379, 1378, 1387, 2199, 2200, 2099,
      2099, 2097, 2199, 970, 969, 928, 1789, 1790, 1662, 1662, 1661, 1789, 633, 634, 629, 2093, 2094, 2055, 1054, 1055, 1050, 2099, 2098, 2094,
      2094, 2093, 2099, 848, 849, 837, 164, 165, 163, 1750, 1751, 1533, 1533, 1534, 1750, 207, 298, 284, 919, 918, 931, 2336, 2335, 2273,
      2273, 2272, 2336, 403, 407, 379, 1050, 1049, 1054, 368, 361, 116, 370, 371, 12, 13, 370, 12, 928, 927, 931, 1036, 1037, 816,
      816, 819, 1036, 219, 379, 374, 116, 126, 144, 116, 144, 183, 183, 207, 284, 116, 183, 284, 219, 374, 116, 116, 243, 225,
      8, 7, 13, 2591, 2592, 2589, 298, 291, 284, 219, 314, 403, 219, 403, 379, 374, 368, 116, 225, 219, 116, 10, 9, 4,
      4, 6, 10, 1984, 1983, 1877, 116, 284, 243, 198, 199, 204, 2250, 2249, 2127, 2127, 2126, 2250, 1733, 1734, 1515, 1515, 1514, 1733,
      1877, 1878, 1984, 2431, 2430, 2444, 2443, 2444, 2459, 1732, 1731, 1788, 2444, 2443, 2431, 13, 11, 8, 557, 558, 553, 816, 820, 812,
      934, 935, 924, 204, 205, 198, 553, 554, 557, 263, 264, 260, 510, 511, 505, 505, 504, 510, 2160, 2161, 2106, 2106, 2109, 2160,
      2063, 2064, 1983, 1983, 1984, 2063, 2238, 2237, 2161, 2161, 2160, 2238, 383, 382, 381, 432, 427, 428, 1868, 1866, 1855, 1855, 1854, 1868,
      1035, 1033, 1100, 516, 517, 509, 509, 508, 516, 1773, 1774, 1786, 1100, 1101, 1035, 1035, 1034, 993, 993, 988, 1033, 1033, 1035, 993,
      1326, 1327, 1131, 1131, 1130, 1326, 925, 926, 513, 513, 512, 925, 367, 375, 378, 2626, 2627, 2468, 2468, 2469, 2625, 2625, 2626, 2468,
      812, 811, 819, 1723, 1722, 1752, 353, 354, 343, 319, 321, 333, 560, 649, 642, 1786, 1787, 1773, 307, 319, 333, 426, 428, 353,
      353, 352, 426, 333, 143, 120, 120, 237, 307, 333, 120, 307, 350, 351, 328, 432, 433, 427, 428, 426, 432, 2225, 2226, 2086,
      2086, 2087, 2225, 1134, 1133, 1058, 1058, 1059, 1134, 339, 338, 325, 325, 324, 339, 1990, 1991, 1976, 328, 329, 350, 926, 925, 934,
      1976, 1979, 1990, 490, 489, 492, 343, 342, 352, 352, 353, 343, 1738, 1739, 1697, 1697, 1693, 1738, 1979, 1976, 1859, 969, 970, 1052,
      381, 380, 383, 953, 994, 849, 408, 412, 455, 453, 560, 622, 1052, 1053, 969, 492, 493, 490, 812, 948, 933, 560, 642, 622,
      673, 812, 933, 933, 953, 849, 849, 378, 408, 408, 455, 453, 673, 933, 849, 622, 673, 849, 849, 453, 622, 1958, 1955, 1912,
      1911, 1913, 1958, 994, 915, 849, 849, 837, 367, 412, 430, 455, 455, 459, 453, 642, 685, 622, 849, 367, 378, 849, 408, 453,
      1842, 1843, 1711, 1711, 1710, 1842, 673, 820, 812, 1913, 1911, 1851, 2440, 2439, 2428, 2428, 2427, 2440, 2516, 2515, 2462, 2461, 2516, 2462,
      2460, 2462, 2439, 2439, 2440, 2460, 2427, 2428, 2338, 2338, 2340, 2429, 2429, 2427, 2338, 2338, 2339, 2316, 2316, 2315, 2338, 163, 162, 164,
      1851, 1850, 1913, 55, 56, 51, 514, 515, 507, 507, 506, 514, 46, 47, 50, 408, 406, 412, 2473, 2475, 2484, 1958, 1912, 1911,
      1703, 1705, 1814, 2484, 2485, 2473, 79, 78, 73, 1437, 1435, 1434, 230, 231, 139, 50, 49, 46, 139, 138, 230, 50, 55, 51,
      2061, 2062, 1965, 1965, 1964, 2061, 2197, 2198, 2181, 2181, 2180, 2197, 1631, 1632, 1302, 1302, 1301, 1631, 2571, 2570, 2493, 2493, 2492, 2571,
      377, 376, 398, 134, 135, 0, 0, 1, 134, 466, 483, 485, 398, 400, 377, 1672, 1673, 1612, 1612, 1610, 1672, 483, 484, 474,
      474, 473, 482, 157, 165, 205, 482, 483, 474, 2464, 2463, 2442, 2442, 2441, 2464, 157, 154, 163, 157, 163, 165, 76, 77, 68,
      68, 67, 76, 464, 465, 444, 444, 443, 464, 264, 276, 361, 111, 101, 103, 915, 994, 1018, 2633, 2634, 2601, 2601, 2600, 2633,
      2601, 2602, 2564, 2562, 2600, 2601, 2601, 2564, 2562, 2562, 2563, 2557, 2557, 2556, 2562, 227, 229, 176, 2592, 2589, 2539, 2539, 2538, 2592,
      111, 85, 98, 98, 96, 101, 111, 98, 101, 264, 361, 116, 205, 264, 116, 111, 103, 157, 116, 111, 157, 116, 106, 111,
      157, 205, 116, 205, 260, 264, 89, 92, 94, 229, 227, 295, 205, 198, 260, 229, 228, 176, 176, 175, 227, 2422, 2420, 2424,
      2420, 2422, 2414, 2564, 2563, 2562, 2525, 2526, 2449, 2449, 2448, 2525, 1551, 1550, 2111, 2449, 2450, 2415, 2415, 2416, 2448, 2389, 2390, 2416,
      2390, 2389, 2110, 2551, 2552, 2546, 2546, 2545, 2551, 2111, 2112, 1551, 2448, 2449, 2415, 2416, 2415, 2389, 2111, 2390, 2110, 44, 45, 48,
      460, 461, 468, 468, 470, 460, 393, 394, 392, 466, 469, 437, 437, 438, 466, 483, 484, 467, 469, 466, 483, 483, 467, 469,
      489, 490, 487, 486, 489, 487, 486, 485, 483, 483, 482, 486, 392, 391, 393, 431, 430, 412, 412, 411, 431, 837, 367, 362,
      202, 203, 186, 719, 837, 362, 362, 272, 719, 17, 33, 89, 92, 99, 94, 94, 17, 89, 186, 187, 159, 159, 158, 185,
      185, 186, 159, 272, 266, 719, 186, 185, 202, 218, 219, 314, 358, 357, 346, 346, 345, 358, 349, 348, 369, 1036, 1037, 783,
      783, 784, 1036, 1184, 1183, 1192, 94, 17, 14, 46, 49, 74, 80, 88, 94, 94, 14, 46, 80, 94, 46, 46, 74, 80,
      100, 101, 96, 314, 312, 299, 299, 298, 315, 405, 403, 314, 298, 300, 315, 315, 314, 299, 300, 298, 207, 207, 206, 300,
      384, 385, 335, 314, 315, 405, 1192, 1193, 1184, 96, 95, 100, 113, 112, 114, 385, 386, 335, 335, 334, 384, 477, 475, 414,
      415, 416, 477, 477, 414, 415, 334, 335, 316, 416, 415, 386, 386, 385, 416, 14, 28, 46, 478, 479, 450, 450, 449, 478,
      292, 293, 240, 237, 236, 292, 236, 237, 120, 120, 119, 236, 292, 240, 237, 314, 312, 218, 105, 104, 115, 406, 403, 407,
      1169, 1168, 1126, 1126, 1127, 1169, 116, 117, 105, 947, 948, 812, 812, 811, 947, 933, 932, 951, 441, 442, 417, 417, 418, 441,
      115, 116, 105, 972, 971, 986, 375, 374, 379, 952, 953, 994, 951, 953, 933, 674, 673, 622, 622, 623, 674, 559, 560, 453,
      453, 452, 559, 994, 995, 952, 986, 985, 972, 379, 378, 375, 1201, 1200, 1219, 83, 97, 85, 97, 98, 85, 259, 260, 198,
      198, 199, 259, 83, 84, 81, 81, 82, 83, 156, 157, 103, 103, 102, 156, 407, 408, 406, 1219, 1220, 1201, 204, 205, 165,
      165, 164, 204, 106, 107, 110, 110, 111, 106, 162, 163, 154, 154, 153, 162, 51, 49, 50, 61, 60, 67, 67, 68, 61,
      975, 974, 973, 718, 720, 729, 718, 719, 266, 266, 265, 720, 720, 718, 266, 729, 730, 718, 108, 90, 89, 108, 109, 90,
      89, 91, 108, 91, 89, 33, 33, 34, 91, 145, 144, 183, 183, 184, 145, 86, 87, 77, 77, 76, 86, 144, 145, 127,
      127, 125, 113, 114, 112, 72, 72, 71, 114, 127, 126, 144, 70, 71, 59, 113, 112, 127, 47, 46, 28, 28, 30, 47,
      71, 72, 59, 59, 58, 70, 39, 40, 41, 30, 28, 14, 14, 15, 29, 29, 30, 14, 41, 42, 39, 63, 62, 43,
      41, 63, 43, 53, 52, 69, 69, 54, 53, 52, 53, 20, 20, 21, 52, 69, 66, 54, 1018, 1118, 1124, 1124, 1070, 915,
      915, 1018, 1124, 1070, 1069, 915, 816, 820, 673, 673, 674, 816, 1145, 1278, 1250, 1250, 1196, 1125, 1125, 1119, 1126, 1145, 1250, 1125,
      1125, 1126, 1145, 952, 972, 985, 1196, 1071, 1068, 1196, 1071, 1125, 1119, 1108, 1126, 1126, 1168, 1145, 1109, 1120, 1019, 1019, 952, 985,
      985, 1109, 1019, 985, 1000, 1109, 1019, 995, 952, 718, 730, 974, 974, 1069, 915, 915, 848, 718, 718, 974, 915, 454, 455, 430,
      430, 431, 454, 1068, 975, 1184, 1201, 1220, 1251, 1196, 1068, 1184, 1184, 1201, 1251, 1251, 1196, 1184, 1184, 1193, 1201, 264, 263, 275,
      275, 276, 264, 650, 649, 560, 560, 559, 650, 1127, 1126, 1108, 1110, 1108, 1000, 1108, 1109, 1000, 1108, 1110, 1127, 1000, 1003, 1110,
      1251, 1250, 1249, 1279, 1278, 1145, 1145, 1144, 1279, 1119, 1120, 1019, 1019, 1018, 1118, 1118, 1119, 1019, 1250, 1251, 1196, 973, 974, 730,
      730, 729, 973, 1183, 1184, 975, 973, 1183, 975, 1200, 1201, 1193, 1193, 1192, 1200,
    ],
  };
}

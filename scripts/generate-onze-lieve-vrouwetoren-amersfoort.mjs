// Genereert een vereenvoudigd, gesloten 3D-model van de Onze-Lieve-
// Vrouwetoren in Amersfoort (circa 1444-1470, houten bekroning van 1655): de
// vrijstaande laatgotische toren waarvan de kerk in 1787 verdween, met de
// vierkante onderbouw met het portaal aan het Lieve Vrouwekerkhof en de
// blinde spitsboognissen, twee hoeksteunberen op elke hoek, de tweede
// vierkante geleding met drie hoge nissen per gevel en de omgang met
// hoekpinakels, de zandstenen achtkantige lantaarn met steunberen en
// pinakels, en de houten bekroning met de open lantaarn, de peer, de
// bovenste lantaarn, de kroon en de spits tot 98,33 m.
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, één node per onderdeel met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-onze-lieve-vrouwetoren-amersfoort.mjs             # 1:1000 (standaard)
//   node scripts/generate-onze-lieve-vrouwetoren-amersfoort.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: elke geleding springt naar boven terug,
// de steunberen hebben waterslagen die steiler zijn dan 45 graden, de omgang
// rust op een schuine kraag, de houten bekroning wordt alleen via schuine
// randen breder en de nissen zijn blind met een spitse top; het script
// controleert dat er boven de onderkant geen vlak is dat vlakker dan 45
// graden naar beneden wijst.
//
// Assenstelsel: oorsprong op RD (154999,97, 463000,13), in het hart van de
// vierkante onderbouw (BAG; dit is ook het nulpunt van het RD-stelsel, dat
// vroeger op de spits lag), op het maaiveld ten noorden en zuiden van de
// toren (NAP +3,4 m), Z omhoog. +X staat loodrecht op de gevel met het
// portaal aan het Lieve Vrouwekerkhof, waar de kerk stond (RD-richting 25,5
// graden, oostnoordoost); +Y wijst naar het noordnoordwesten.
//
// Bronnen: BAG-pand 0307100000333887 (vierkant van 14 × 14 m met acht
// hoeksteunberen van 1,45 m breed en 1,17 m diep); AHN DSM/DTM 0,5 m (PDOK
// WCS) voor de breedte per hoogte, de omgang, de lantaarn en de bekroning,
// en het maaiveld; Wikipedia (98,33 m tot de haan, twee vierkante geledingen,
// achtkantige lantaarn, houten bekroning) en het Rijksmonumentenregister
// (7940); Wikimedia Commons-foto's voor de geledingen, nissen en de
// bekroning.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "onze-lieve-vrouwetoren-amersfoort");
const mmPerMetre = 1000 / scale;
const SLUG = "onze-lieve-vrouwetoren-amersfoort";

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(32);

// ---------- maten (lokaal stelsel, z = NAP - 3,4 m) ----------
const ORIGIN = [154999.97, 463000.13];
const ANGLE_DEG = 25.5;
const ANGLE = (ANGLE_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 3.4;
const GROUND_OFFSET = -0.3;
// Het maaiveld loopt over de toren heen van NAP +4,2 m aan het Lieve
// Vrouwekerkhof (oost, +X) naar +2,2 m aan de westkant; alle onderdelen
// beginnen daarom op dezelfde vlakke onderkant 1,5 m onder de oorsprong,
// zodat de voet ook aan de lage westkant in het maaiveld staat.
const BASE = -1.5;

// Vierkante onderbouw (BAG: 14 × 14 m tussen de steunberen) tot de band
// met de omgang op 31,1 m; tweede geleding 12,4 × 12,4 m tot 49,4 m, de
// kraag van de bovenste omgang tot 50 m en de omgang (13,2 × 13,2 m, de
// vloer in het AHN-DSM op NAP +55 m) tot 52,6 m.
const STAGE1 = { half: 7.0, z1: 31.1 };
const STAGE2 = { half: 6.2, z1: 49.4 };
const GALLERY = { half: 6.6, z0: 50.0, z1: 52.6 };
// Hoeksteunberen: twee per hoek in het verlengde van de gevels, 1,45 m
// breed en met de buitenkant gelijk met de hoek van de gevel; profiel
// [z, uitsprong buiten de gevel] met schuine waterslagen.
const BUTTRESS1 = {
  wall: STAGE1.half,
  width: 1.45,
  profile: [
    [BASE, 1.17],
    [12.0, 1.17],
    [12.8, 0.9],
    [22.0, 0.9],
    [22.6, 0.6],
    [28.9, 0.6],
    [30.0, 0.0],
  ],
};
const BUTTRESS2 = {
  wall: STAGE2.half,
  width: 1.2,
  profile: [
    [STAGE1.z1 - 0.01, 0.6],
    [GALLERY.z0, 0.6],
  ],
};
// Pinakels op de hoeken van de omgang.
const GALLERY_PINNACLE = { size: 1.4, height: 4.0 };
// Achtkantige zandstenen lantaarn met de vlakken op de assen en de
// diagonalen (apothema 5,1 m onderaan en 4,9 m bovenaan, AHN-DSM), met op
// de diagonale vlakken steunberen en pinakels.
const LANTERN = { apothem: [5.1, 4.9], z0: GALLERY.z1, z1: 73.5 };
const LANTERN_PIER = { width: 1.2, out: 0.5, z1: 72.0, pinnacle: 4.5 };
// Houten bekroning als omwentelingsprofiel [straal, z]: omgang, open
// lantaarn (dicht), peer, bovenste lantaarn, kroon, bol en spits tot de
// haan op 98,33 m (Wikipedia; het DSM meet tot NAP +98,1 m bij de kroon).
const CROWN_PROFILE = [
  [0, LANTERN.z1 - 0.01],
  [3.4, LANTERN.z1 - 0.01],
  [3.4, 75.2],
  [2.6, 75.2],
  [2.6, 80.0],
  [2.8, 80.4],
  [2.8, 82.4],
  [2.2, 84.6],
  [1.3, 86.2],
  [1.3, 89.8],
  [1.5, 90.1],
  [1.5, 91.2],
  [0.45, 93.4],
  [0.55, 93.9],
  [0.55, 94.4],
  [0.1, 98.33],
  [0, 98.33],
];
const TOP = 98.33;
// Blinde spitsboognissen per gevel: plaats langs de gevel, breedte, z0,
// rechte zijde tot `spring`, diepte en de afstand van het hart tot de gevel.
// Gevel "+x" is de oostgevel met het portaal aan het Lieve Vrouwekerkhof.
const ALL = ["+x", "-x", "+y", "-y"];
const NICHES = [
  // portaal (de Pelgrimsdeur) aan het Lieve Vrouwekerkhof; het plein ligt
  // na plaatsing 1,1 m boven z = 0 (AHN NAP +4,2 m, PDOK-terrein idem)
  { faces: ["+x"], lateral: 0, width: 4.4, z0: 1.1, spring: 3.8, depth: 0.7, half: STAGE1.half },
  // onderbouw: hoge nis, smalle nis en twee hoge blinde vensters
  { faces: ALL, lateral: 0, width: 4.0, z0: 7.4, spring: 9.6, depth: 0.5, half: STAGE1.half },
  { faces: ALL, lateral: 0, width: 2.4, z0: 14.2, spring: 17.6, depth: 0.4, half: STAGE1.half },
  { faces: ALL, lateral: -2.5, width: 2.6, z0: 20.8, spring: 26.2, depth: 0.4, half: STAGE1.half },
  { faces: ALL, lateral: 2.5, width: 2.6, z0: 20.8, spring: 26.2, depth: 0.4, half: STAGE1.half },
  // tweede geleding: galmgat in het midden, blinde vensters ernaast
  { faces: ALL, lateral: 0, width: 2.2, z0: 33.2, spring: 46.6, depth: 0.6, half: STAGE2.half },
  { faces: ALL, lateral: -3.0, width: 1.7, z0: 33.6, spring: 47.0, depth: 0.4, half: STAGE2.half },
  { faces: ALL, lateral: 3.0, width: 1.7, z0: 33.6, spring: 47.0, depth: 0.4, half: STAGE2.half },
];
// Lantaarn: hoge nis in de vlakken op de assen, smallere op de diagonalen.
const LANTERN_NICHES = [
  { angles: [0, 90, 180, 270], width: 2.2, z0: 55.4, spring: 68.6, depth: 0.6 },
  { angles: [45, 135, 225, 315], width: 1.2, z0: 57.0, spring: 67.4, depth: 0.4 },
];
// Maaiveld ten noorden en zuiden van de toren (NAP +3,4 m volgens het
// AHN-DTM); oost ligt hoger (+4,2 m), west lager (+2,2 m).
const GROUND_SAMPLES = [
  [0, 12],
  [0, -12],
];

// ---------- hulpfuncties ----------
const union = (parts) => Manifold.union(parts);
// Rechthoekige afgeknotte piramide rond (cx, cy): halve maten onderaan en bovenaan.
const rectFrustum = (z0, z1, [hx0, hy0], [hx1, hy1], [cx, cy] = [0, 0]) =>
  Manifold.extrude(
    [[[-hx0, -hy0], [hx0, -hy0], [hx0, hy0], [-hx0, hy0]]],
    z1 - z0,
    0,
    0,
    [hx1 / hx0, hy1 / hy0],
  ).translate([cx, cy, z0]);
const square = (z0, z1, h0, h1 = h0) => rectFrustum(z0, z1, [h0, h0], [h1, h1]);
// Regelmatige achthoek met vlakken op de assen en diagonalen; apothema a0
// onderaan, a1 bovenaan.
const octagonFrustum = (z0, z1, a0, a1) => {
  const k = 1 / Math.cos(Math.PI / 8);
  return Manifold.cylinder(z1 - z0, a0 * k, a1 * k, 8, false)
    .rotate([0, 0, 22.5])
    .translate([0, 0, z0]);
};
// Pinakel: vierkante voet met een piramidespits.
const pinnacle = (x, y, z0, size, height) =>
  union([
    rectFrustum(z0, z0 + height * 0.35, [size / 2, size / 2], [size / 2, size / 2], [x, y]),
    Manifold.cylinder(height * 0.65 + 0.01, size * Math.SQRT1_2, 0.05, 4, false)
      .rotate([0, 0, 45])
      .translate([x, y, z0 + height * 0.35 - 0.01]),
  ]);
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
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
const FACE_ANGLE = { "+x": 0, "+y": 90, "-x": 180, "-y": 270 };
// Blinde spitsboognis in een vlak op afstand `half` van het hart, gedraaid
// over `angle` graden: `lateral` is de plaats langs het vlak.
function niche(angle, half, lateral, width, z0, spring, depth) {
  return Manifold.extrude([pointedArch(width, spring - z0)], 4)
    .rotate([90, 0, 90])
    .translate([half - depth, lateral, z0])
    .rotate([0, 0, angle]);
}

// ---------- vierkante geledingen ----------
const body = union([
  square(BASE, STAGE1.z1, STAGE1.half),
  square(STAGE1.z1 - 0.01, STAGE2.z1, STAGE2.half),
  // kraag onder de omgang (0,4 m uit over 0,6 m hoogte) en de omgang
  square(STAGE2.z1 - 0.01, GALLERY.z0, STAGE2.half, GALLERY.half),
  square(GALLERY.z0, GALLERY.z1, GALLERY.half),
]);
// Steunbeer met de kop naar +X, als profiel [afstand tot het hart, z] tussen
// y0 en y1, voor beide hoeken van elke gevel.
function cornerButtresses({ wall, width, profile }) {
  const z0 = profile[0][0];
  const shape = [[0, z0], ...profile.map(([z, out]) => [wall + out, z]), [0, profile.at(-1)[0]]];
  const parts = [];
  for (const angle of [0, 90, 180, 270]) {
    for (const s of [-1, 1]) {
      const yOuter = s * wall;
      const y0 = Math.min(yOuter, yOuter - s * width);
      parts.push(profileY(shape, y0, y0 + width).rotate([0, 0, angle]));
    }
  }
  return union(parts);
}
const buttresses = union([cornerButtresses(BUTTRESS1), cornerButtresses(BUTTRESS2)]);
const galleryPinnacles = [];
for (const sx of [-1, 1]) {
  for (const sy of [-1, 1]) {
    const c = GALLERY.half - GALLERY_PINNACLE.size / 2;
    galleryPinnacles.push(pinnacle(sx * c, sy * c, GALLERY.z1 - 0.01, GALLERY_PINNACLE.size, GALLERY_PINNACLE.height));
  }
}

// ---------- achtkantige lantaarn ----------
const [la0, la1] = LANTERN.apothem;
const lanternParts = [octagonFrustum(LANTERN.z0 - 0.01, LANTERN.z1, la0, la1)];
for (const angle of [45, 135, 225, 315]) {
  const w = LANTERN_PIER.width / 2;
  const pier = profileY(
    [
      [0, LANTERN.z0 - 0.01],
      [la0 + LANTERN_PIER.out, LANTERN.z0 - 0.01],
      [la1 + LANTERN_PIER.out, LANTERN_PIER.z1],
      [0, LANTERN_PIER.z1],
    ],
    -w,
    w,
  );
  lanternParts.push(pier.rotate([0, 0, angle]));
  const r = la1 + LANTERN_PIER.out - w;
  lanternParts.push(
    pinnacle(r, 0, LANTERN_PIER.z1 - 0.01, LANTERN_PIER.width, LANTERN_PIER.pinnacle).rotate([0, 0, angle]),
  );
}
const lantern = union(lanternParts);

// ---------- houten bekroning ----------
const crown = Manifold.revolve([CROWN_PROFILE], 16);

const mass = union([body, buttresses, ...galleryPinnacles, lantern, crown]);

const cuts = [];
for (const n of NICHES) {
  for (const side of n.faces) {
    cuts.push(niche(FACE_ANGLE[side], n.half, n.lateral, n.width, n.z0, n.spring, n.depth));
  }
}
for (const n of LANTERN_NICHES) {
  for (const angle of n.angles) {
    // apothema ter hoogte van de nis (lineair tussen voet en top)
    const zMid = (n.z0 + n.spring) / 2;
    const t = (zMid - LANTERN.z0) / (LANTERN.z1 - LANTERN.z0);
    cuts.push(niche(angle, la0 + (la1 - la0) * t, 0, n.width, n.z0, n.spring, n.depth));
  }
}
const tower = mass.subtract(union(cuts));

// ---------- controles ----------
for (const [name, solid] of [["massa", mass], ["toren", tower]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}
// Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant
// (m2 per laagste z). Alleen de spitse toppen van de nissen mogen er hebben:
// de bovenste helft van een spitsboog met een straal gelijk aan de breedte
// is vlakker dan 45 graden, maar die nissen zijn ondiep en de spits draagt
// zichzelf.
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
  const levels = steepFaces(tower);
  console.log("ondervlakken in de nissen (lokale z: m2):", Object.fromEntries(levels));
  const all = [...NICHES, ...LANTERN_NICHES];
  for (const [z] of levels) {
    if (!all.some((n) => +z >= n.spring - 0.05 && +z <= n.spring + n.width)) throw new Error(`overhang op z ${z}`);
  }
  const bb = tower.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
  if (Math.abs(bb.max[2] - TOP) > 1e-6) throw new Error(`top op ${bb.max[2]}`);
}

const parts = [["building:toren", tower]];
const printModel = tower.translate([0, 0, -BASE]);

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
  for (const [name, solid] of namedParts) {
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
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const { buffer, triangles } = toStl(printModel, `NederPrint Onze-Lieve-Vrouwetoren Amersfoort 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printModel.boundingBox();
report.stl = {
  file: stlFile,
  status: printModel.status(),
  genus: printModel.genus(),
  triangles,
  volumeCm3: +((printModel.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: "Onze-Lieve-Vrouwetoren",
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: GROUND_OFFSET,
      // Ten noorden en zuiden van de toren; het Lieve Vrouwekerkhof aan de
      // oostkant ligt hoger, de westkant lager.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0307100000333887"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (154999,97, 463000,13), in het hart van de vierkante onderbouw op het maaiveld ten noorden en zuiden van de toren (NAP +3,4 m), +X loodrecht op de gevel met het portaal aan het Lieve Vrouwekerkhof (RD-richting 25,5 graden, oostnoordoost) en +Y naar het noordnoordwesten. building:toren is de vrijstaande toren: de vierkante onderbouw van 14 m met acht hoeksteunberen en blinde spitsboognissen tot 31,1 m, de tweede geleding met drie hoge nissen per gevel en de omgang met hoekpinakels tot 52,6 m, de achtkantige zandstenen lantaarn met steunberen en pinakels tot 73,5 m en de houten bekroning (open lantaarn dicht, peer, bovenste lantaarn, kroon en spits) tot 98,33 m boven het maaiveld; elke geleding springt alleen naar boven terug en de toren print op 1:1000 zonder steun. Vervangt de PDOK-reconstructie van BAG-pand 0307100000333887. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`${SLUG}-1-${scale}.stl`],
      realWorld: {
        heightM: TOP,
        stage1TopM: STAGE1.z1,
        galleryTopM: GALLERY.z1,
        lanternTopM: LANTERN.z1,
        baseFootprintM: [STAGE1.half * 2, STAGE1.half * 2],
        buttressReachM: +(STAGE1.half + BUTTRESS1.profile[0][1]).toFixed(2),
        stage2FootprintM: [STAGE2.half * 2, STAGE2.half * 2],
        lanternApothemM: LANTERN.apothem,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Onze_Lieve_Vrouwetoren_(Amersfoort)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/7940",
        "PDOK BAG pand 0307100000333887 (vierkante onderbouw van 14 x 14 m met acht hoeksteunberen), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: breedte per hoogte, omgang, lantaarn, bekroning, maaiveld",
        "Wikimedia Commons: Amersfoort - Onze-Lieve-Vrouwetoren vanaf het Lieve Vrouwekerkhof - 01.jpg, Onze-Lieve-Vrouwetoren Amersfoort, 2007.jpg, Amersfoort Onze-Lieve-Vrouwetoren seen from the northeast.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

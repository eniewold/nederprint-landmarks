// Genereert een vereenvoudigd, gesloten 3D-model van de Domtoren in Utrecht
// (Jan van Henegouwen, 1321-1382): het eerste vierkant met de doorgang, het
// tweede vierkant met de hoge spitsboognissen, de open achthoekige lantaarn en
// het lage dak met spits en windvaan. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel
// met de materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-domtoren.mjs             # 1:1000 (standaard)
//   node scripts/generate-domtoren.mjs --scale 2000
//
// Een STL op 1:100 zou 1,12 m hoog worden; daarom is 1:1000 de standaard.
//
// Assenstelsel: oorsprong in het hart van de toren op het maaiveld van het
// Domplein (circa NAP +5,4 m), Z omhoog. +X loopt langs de doorgang (RD-richting
// 18,5 graden vanaf het oosten, tegen de klok in), +Y staat daar 90 graden
// linksom op.
//
// Bronnen: BAG-pand 0344100000039864 en BGT (muren van het eerste vierkant op
// 19,5 m, doorgang als sierbestrating: 4,1 m breed en over de volle diepte van
// het pand); AHN DSM 0,5 m (PDOK WCS) voor de omhullende per hoogte (de
// steunberen vergroten het eerste vierkant tot circa 24,8 m), het dakplatform
// van de lantaarn (NAP +103,8 m), de daktop en de spits, in een stelsel langs de
// doorgang; erfgoed.utrecht.nl en Wikipedia voor de geledingen (38,6 m, 29,48 m
// en 26 m), de hoogte met spits (106,75 m) en met windvaan (112,32 m);
// Wikimedia Commons-foto's voor de spitsboognissen en de doorgang.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "domtoren");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const box = (sx, sy, sz, x = 0, y = 0, z = 0) =>
  Manifold.cube([sx, sy, sz], false).translate([x - sx / 2, y - sy / 2, z]);
// Vierkante afgeknotte piramide rond de as: halve breedte a0 onderaan, a1 bovenaan.
const squareFrustum = (z0, z1, a0, a1) =>
  Manifold.extrude(
    [[[-a0, -a0], [a0, -a0], [a0, a0], [-a0, a0]]],
    z1 - z0,
    0,
    0,
    [a1 / a0, a1 / a0],
  ).translate([0, 0, z0]);
// Regelmatige achthoek met vlakken op de assen; apothema a0 onderaan, a1 bovenaan.
const octagonFrustum = (z0, z1, a0, a1) => {
  const k = 1 / Math.cos(Math.PI / 8);
  return Manifold.cylinder(z1 - z0, a0 * k, a1 * k, 8, false)
    .rotate([0, 0, 22.5])
    .translate([0, 0, z0]);
};
// Spitsboog als polygoon [breedterichting, hoogte]: rechte zijden tot
// `spring`, daarboven twee cirkelbogen met straal gelijk aan de breedte.
function pointedArch(width, spring, centre = 0, steps = 10) {
  const half = width / 2;
  const pts = [[centre - half, 0], [centre + half, 0], [centre + half, spring]];
  for (let i = 1; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 3);
    pts.push([centre + half - width + width * Math.cos(t), spring + width * Math.sin(t)]);
  }
  for (let i = steps - 1; i >= 1; i--) {
    const t = (i / steps) * (Math.PI / 3);
    pts.push([centre - half + width - width * Math.cos(t), spring + width * Math.sin(t)]);
  }
  pts.push([centre - half, spring]);
  return pts;
}
// Spitsboog (breedte, rechte zijde) uitgetrokken langs de X-as van x0 tot x1
// vanaf hoogte z0, gecentreerd op Y = centre. Extrude loopt langs Z; de
// rotatie zet (X, Y, Z) om naar (Z, X, Y) = (x, breedte, hoogte).
const archAlongX = (width, spring, x0, x1, z0, centre = 0) =>
  Manifold.extrude([pointedArch(width, spring, centre)], x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, z0]);

// ---------- hoofdmaten (hoogte boven het maaiveld, NAP +5,4 m) ----------
// Halve breedte van de omhullende per hoogte, gemiddeld over de vier zijden uit
// het AHN-DSM (1e/99e percentiel per hoogte, zonder de Domkerk aan de +Y-kant).
const STAGE1 = { top: 38.6, a0: 12.4, a1: 11.3 }; // eerste vierkant
const STAGE2 = { top: 38.6 + 29.48, a0: 11.0, a1: 10.3 }; // tweede vierkant
const LANTERN = { top: 98.4, a0: 9.4, a1: 8.3 }; // achthoekig; AHN-platform NAP +103,8 m
const ROOF = { apothem: 6.4, eave: 101.2 }; // laag dak op het platform (AHN: NAP +106,3 m)
const SPIRE = { base: 3.0, top: 106.75, windvaneTop: 112.32 };
const CORNICE = { overhang: 0.7, height: 0.9 };

// Doorgang: 4,1 m breed (BGT), spitsboog tot 13 m, met een portaalnis aan
// beide gevels.
const GATE = { width: 4.1, spring: 9.5, centre: 0 };
const PORTAL = { width: 7.6, spring: 13, recess: 0.9 };

// ---------- opbouw ----------
const stage1 = squareFrustum(0, STAGE1.top, STAGE1.a0, STAGE1.a1);
const stage2 = squareFrustum(STAGE1.top, STAGE2.top, STAGE2.a0, STAGE2.a1);
const cornice1 = box(
  (STAGE1.a1 + CORNICE.overhang) * 2,
  (STAGE1.a1 + CORNICE.overhang) * 2,
  CORNICE.height,
  0,
  0,
  STAGE1.top - CORNICE.height,
);
const cornice2 = box(
  (STAGE2.a1 + CORNICE.overhang) * 2,
  (STAGE2.a1 + CORNICE.overhang) * 2,
  CORNICE.height,
  0,
  0,
  STAGE2.top - CORNICE.height,
);
const lantern = octagonFrustum(STAGE2.top, LANTERN.top, LANTERN.a0, LANTERN.a1);
const lanternPlatform = octagonFrustum(LANTERN.top - 1.6, LANTERN.top, LANTERN.a1 + 0.5, LANTERN.a1 + 0.5);
const roof = octagonFrustum(LANTERN.top, ROOF.eave, ROOF.apothem, ROOF.apothem);
const spire = union([
  Manifold.cylinder(2.6, SPIRE.base, 2.0, 8, false).rotate([0, 0, 22.5]).translate([0, 0, ROOF.eave - 0.1]),
  Manifold.cylinder(SPIRE.top - (ROOF.eave + 2.5), 2.0, 0.3, 8, false).rotate([0, 0, 22.5]).translate([0, 0, ROOF.eave + 2.5]),
  Manifold.cylinder(SPIRE.windvaneTop - SPIRE.top + 0.2, 0.3, 0.2, 8, false).translate([0, 0, SPIRE.top - 0.2]),
]);

// Uitsparingen: doorgang langs X met portaalnis aan beide kanten, nissen in het
// tweede vierkant (twee per zijde) en in elke zijde van de lantaarn.
const cuts = [];
cuts.push(archAlongX(GATE.width, GATE.spring, -STAGE1.a0 - 1, STAGE1.a0 + 1, -0.01, GATE.centre));
for (const sign of [-1, 1]) {
  const x0 = sign < 0 ? -STAGE1.a0 - 1 : STAGE1.a0 - PORTAL.recess;
  cuts.push(archAlongX(PORTAL.width, PORTAL.spring, x0, x0 + PORTAL.recess + 1, 0, GATE.centre));
}
// Blinde spitsbogen in het eerste vierkant boven de doorgang: twee per gevel,
// op de gevels met de doorgang naast het portaal.
for (let k = 0; k < 4; k++) {
  const gateFace = k % 2 === 0;
  for (const lateral of gateFace ? [-8.3, 8.3] : [-4.5, 4.5]) {
    const niche = archAlongX(3.0, 11, STAGE1.a0 - 1.6, STAGE1.a0 + 2, 19, lateral);
    cuts.push(niche.rotate([0, 0, k * 90]));
  }
}
const nicheDepth = 1.0;
const nicheZ0 = STAGE1.top + 4;
for (let k = 0; k < 4; k++) {
  for (const lateral of [-3.3, 3.3]) {
    const niche = archAlongX(2.8, 15, STAGE2.a0 - nicheDepth - 0.4, STAGE2.a0 + 2, nicheZ0, lateral);
    cuts.push(niche.rotate([0, 0, k * 90]));
  }
}
const lanternNicheZ0 = STAGE2.top + 3;
for (let k = 0; k < 8; k++) {
  const apothem = (LANTERN.a0 + LANTERN.a1) / 2;
  const niche = archAlongX(3.4, 17, apothem - 1.3, apothem + 2, lanternNicheZ0, 0);
  cuts.push(niche.rotate([0, 0, k * 45]));
}

const tower = union([
  stage1,
  cornice1,
  stage2,
  cornice2,
  lantern,
  lanternPlatform,
  roof,
  spire,
]).subtract(union(cuts));

// Aanbouwen: PDOK trekt de daken van deze panden met het AHN omhoog tot de hoogte
// van de steunberen (tot circa 80 m), dus ze worden verborgen en hier vervangen
// door een model met zadeldaken op de BAG-voetafdruk (in het modelstelsel), zonder
// het deel dat onder de omhullende van de toren valt.
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Zadeldak op een voetafdruk: nok langs X (axis "u", nok op v = ridgeAt) of langs
// Y (axis "v", nok op u = ridgeAt), dakrand op `eave`, nok op `ridge`; de helling
// volgt uit de afstand van de nok tot de verste gevel.
function gabled(footprint, axis, ridgeAt, eave, ridge) {
  const across = footprint.map(([u, v]) => (axis === "u" ? v : u));
  const half = Math.max(Math.abs(Math.min(...across) - ridgeAt), Math.abs(Math.max(...across) - ridgeAt)) + 0.3;
  const slope = (ridge - eave) / (half - 0.3);
  const c = axis === "u" ? ridgeAt : -ridgeAt;
  const wedge = Manifold.extrude(
    [ccw([[c - half, ridge - slope * half], [c, ridge], [c + half, ridge - slope * half], [c + half, -1], [c - half, -1]])],
    80,
  )
    .rotate([90, 0, 90])
    .translate([-40, 0, 0]);
  const roof = axis === "u" ? wedge : wedge.rotate([0, 0, 90]);
  return Manifold.extrude([ccw(footprint)], ridge).intersect(roof);
}
const cutBox = (u0, u1, v0, v1) => box(u1 - u0, v1 - v0, 40, (u0 + u1) / 2, (v0 + v1) / 2, -1);
const FOOT_5581 = [[-16.01,-13.47],[-15.06,-13.47],[-15.06,-14.4],[-14.76,-14.41],[-14.93,-19.93],[-9.35,-20.13],[-9.2,-14.93],[-10.26,-14.82],[-10.21,-5.58],[-16.09,-5.56],[-16.11,-6.57],[-16.2,-13.47]];
const FOOT_39778 = [[-3.3,-9.63],[-3.24,-12.03],[-4.41,-12.04],[-4.45,-19.89],[10.03,-19.93],[10.29,-12.33],[6.65,-12.28],[1.76,-12.11],[1.79,-9.66],[0.97,-9.65]];
// Dakvormen uit het AHN (nok en dakrand boven het maaiveld, 0,5 m raster):
// 39778: zadeldak langs X, nok 15,4 m op v = -16,1 en dakrand circa 10 m, met een
// lagere vleugel (7 m) aan de kant van de toren-westzijde; 5581: noordvleugel met
// nok langs Y (9 m op u = -13,1, dakrand 5,5 m) en zuidvleugel met nok langs X
// (11,6 m op v = -17,3, dakrand 8 m).
const annexParts = [
  gabled(FOOT_39778, "u", -16.1, 10, 15.4).intersect(cutBox(-2.5, 12, -25, -5)),
  Manifold.extrude([ccw(FOOT_39778)], 7).intersect(cutBox(-6, -2.5, -25, -5)),
  gabled(FOOT_5581, "v", -13.1, 5.5, 9).intersect(cutBox(-18, -9, -14.6, -4)),
  gabled(FOOT_5581, "u", -17.3, 8, 11.6).intersect(cutBox(-18, -9, -25, -14.6)),
];
const envelope = box(STAGE1.a0 * 2, STAGE1.a0 * 2, 140, 0, 0, -1);
const annexes = union(annexParts).subtract(envelope);

const parts = [
  ["building:toren", tower],
  ["building:aanbouwen", annexes],
];
const printModel = union([tower, annexes]);

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
const glbFile = path.join(outDir, "domtoren.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-domtoren.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `domtoren-1-${scale}.stl`);
const { buffer, triangles } = toStl(printModel, `NederPrint Domtoren Utrecht 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printModel.boundingBox();
report.stl = {
  file: stlFile,
  status: printModel.status(),
  genus: printModel.genus(),
  triangles,
  volumeCm3: +((printModel.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. Oorsprong: hart van het
// torenlichaam (het BAG-pand ligt 0,35 m uit het midden van het AHN-stelsel,
// vandaar 0,4 m naar -Y), in RD met de X-as langs de doorgang.
await writeFile(
  path.join(outDir, "domtoren.json"),
  JSON.stringify(
    {
      name: "Domtoren",
      file: "domtoren.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [136777.48, 455854.92],
      xAxis: [0.94832, 0.3173],
      groundOffsetMetres: -0.3,
      groundSamplePoints: [
        [15, 0],
        [0, 15],
        [-15, 0],
        [0, -15],
      ],
      replacesBuildings: [
        "NL.IMBAG.Pand.0344100000039864",
        "NL.IMBAG.Pand.0344100000051237",
        "NL.IMBAG.Pand.0344100000039778",
        "NL.IMBAG.Pand.0344100000005581",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de toren op het maaiveld van het Domplein in de oorsprong, +X langs de doorgang (RD-richting 18,5 graden) en +Y 90 graden linksom. De doorgang loopt door het eerste vierkant langs X. Het maaiveld wordt op 15 m uit het hart bemonsterd. Vervangt de PDOK-reconstructie van BAG-pand 0344100000039864 en van drie kleine aanbouwen (0344100000051237, 0344100000039778, 0344100000005581) waarvan de AHN-daken door de steunberen van de toren omhoog getrokken zijn; de twee aanbouwen die deels buiten de omhullende liggen zijn als eenvoudig blok (node building:aanbouwen) teruggezet. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`domtoren-1-${scale}.stl`],
      realWorld: {
        totalHeightM: SPIRE.windvaneTop,
        heightWithSpireM: SPIRE.top,
        firstSquareTopM: STAGE1.top,
        secondSquareTopM: STAGE2.top,
        lanternTopM: LANTERN.top,
        baseWidthM: STAGE1.a0 * 2,
        gateWidthM: GATE.width,
        lanternAcrossFlatsM: [LANTERN.a0 * 2, LANTERN.a1 * 2],
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Domtoren_(Utrecht)",
        "https://erfgoed.utrecht.nl/de-bouw-van-de-domtoren",
        "https://rijksmonumenten.nl/monument/36075/domtoren/utrecht/",
        "PDOK BAG pand 0344100000039864 en BGT pand/wegdeel (muren 19,5 m, doorgang 4,1 m), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de omhullende per hoogte, het dakplatform, het dak en de spits",
        "Wikimedia Commons: Domtoren Utrecht - 1.jpg, Utrecht, domtoren 01.jpg, Domtoren Utrecht - 2.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

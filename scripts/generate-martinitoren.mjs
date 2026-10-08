// Genereert een vereenvoudigd, gesloten 3D-model van de Martinitoren in
// Groningen (1469-1482, bovenbouw na 1577 in hout en koper): de vierkante
// onderbouw met de drie doorgangen en hoge spitsboognissen, twee
// terugspringende vierkante geledingen met omgangen en pinakels, de groene
// achthoekige lantaarn in twee lagen, de opengewerkte kroon en de windvaan.
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, één node per onderdeel met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-martinitoren.mjs             # 1:1000 (standaard)
//   node scripts/generate-martinitoren.mjs --scale 2000
//
// Een STL op 1:100 zou 0,97 m hoog worden; daarom is 1:1000 de standaard.
//
// Assenstelsel: oorsprong in het hart van de onderbouw op het maaiveld van de
// Grote Markt (circa NAP +6,8 m), Z omhoog. +X loopt langs de kerk naar het
// oostnoordoosten (RD-richting 19,25 graden vanaf het oosten, tegen de klok
// in), dus -X wijst naar de Grote Markt; +Y staat daar 90 graden linksom op
// (noordnoordwest).
//
// Bronnen: BAG-pand 0014100010924795 (voetafdruk 16,5 × 17 m met de nissen van
// de drie doorgangen aan west-, noord- en zuidzijde); AHN DSM 0,5 m (PDOK WCS)
// voor de omhullende en het hart per geleding, in een stelsel langs de
// gevels; Wikipedia en het Rijksmonumentenregister (18553) voor de totale
// hoogte (96,8 m) en de geledingen (eerste en tweede samen 40 m, derde tot
// 55 m, vierde tot 68 m); Wikimedia Commons-foto's voor nissen, omgangen,
// pinakels, lantaarn en kroon.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "martinitoren");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const box = (sx, sy, sz, x = 0, y = 0, z = 0) =>
  Manifold.cube([sx, sy, sz], false).translate([x - sx / 2, y - sy / 2, z]);
// Rechthoekige afgeknotte piramide rond (cx, cy): halve maten [hx, hy] onderaan
// en bovenaan.
const rectFrustum = (z0, z1, [hx0, hy0], [hx1, hy1], [cx, cy] = [0, 0]) =>
  Manifold.extrude(
    [[[-hx0, -hy0], [hx0, -hy0], [hx0, hy0], [-hx0, hy0]]],
    z1 - z0,
    0,
    0,
    [hx1 / hx0, hy1 / hy0],
  ).translate([cx, cy, z0]);
// Regelmatige achthoek met vlakken op de assen; apothema a0 onderaan, a1 bovenaan.
const octagonFrustum = (z0, z1, a0, a1, [cx, cy] = [0, 0]) => {
  const k = 1 / Math.cos(Math.PI / 8);
  return Manifold.cylinder(z1 - z0, a0 * k, a1 * k, 8, false)
    .rotate([0, 0, 22.5])
    .translate([cx, cy, z0]);
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
// Spitsboognis in een gevel van een rechthoekige geleding met hart (cx, cy) en
// halve maten [hx, hy] (de gevel ter hoogte van de nis): `side` is "+x", "-x",
// "+y" of "-y", `lateral` de plaats langs de gevel vanuit het hart, `depth` de
// diepte vanaf die gevel.
function faceNiche(side, [cx, cy], [hx, hy], lateral, width, spring, z0, depth) {
  const half = side.endsWith("x") ? hx : hy;
  const niche = archAlongX(width, spring, half - depth, half + 3, z0, lateral);
  const angle = { "+x": 0, "+y": 90, "-x": 180, "-y": 270 }[side];
  return niche.rotate([0, 0, angle]).translate([cx, cy, 0]);
}
const SIDES = ["+x", "+y", "-x", "-y"];
// Pinakel: vierkante voet met een piramidespits.
const pinnacle = (x, y, z0, size, height) =>
  union([
    box(size, size, height * 0.35, x, y, z0),
    Manifold.cylinder(height * 0.65 + 0.01, size * Math.SQRT1_2, 0.05, 4, false)
      .rotate([0, 0, 45])
      .translate([x, y, z0 + height * 0.35 - 0.01]),
  ]);
// Pinakels op de hoeken van een omgang plus `perSide` gelijk verdeeld langs
// elke gevel.
function galleryPinnacles([cx, cy], [hx, hy], z0, size, height, perSide) {
  const inset = size / 2;
  const parts = [];
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      parts.push(pinnacle(cx + sx * (hx - inset), cy + sy * (hy - inset), z0, size, height));
    }
  }
  for (let i = 1; i <= perSide; i++) {
    const t = -1 + (2 * i) / (perSide + 1);
    for (const s of [-1, 1]) {
      parts.push(pinnacle(cx + t * (hx - inset), cy + s * (hy - inset), z0, size, height * 0.8));
      parts.push(pinnacle(cx + s * (hx - inset), cy + t * (hy - inset), z0, size, height * 0.8));
    }
  }
  return union(parts);
}
// Omgang: uitkragende kraag (consoles) van z0 tot z1, daarboven een dichte
// borstwering tot z2 (in het echt opengewerkt, voor de printbaarheid dicht).
function gallery(centre, inner, outer, z0, z1, z2) {
  return union([
    rectFrustum(z0, z1, inner, outer, centre),
    rectFrustum(z1, z2, outer, outer, centre),
  ]);
}

// ---------- hoofdmaten (hoogte boven het maaiveld, NAP +6,8 m) ----------
// Halve maten [langs X, langs Y] uit het AHN-DSM (1e/99e percentiel per
// hoogte) en de BAG-voetafdruk. Het hart van de bovenbouw ligt volgens het AHN
// 0,5 tot 1 m westelijker (naar de Grote Markt) dan dat van de onderbouw.
const STAGE1 = { base: [8.25, 8.5], top: [6.95, 6.75], z1: 38.7, centre: [0, 0] };
const GALLERY1 = { outer: [7.25, 7.05], z0: 38.7, z1: 39.5, z2: 41.3 };
const STAGE2 = { base: [6.6, 6.85], top: [6.4, 6.6], z1: 55.4, centre: [-0.5, 0.35] };
const GALLERY2 = { outer: [6.7, 6.9], z0: 55.4, z1: 56.0, z2: 57.4 };
const STAGE3 = { base: [5.4, 5.65], top: [5.3, 5.55], z1: 68.6, centre: [-0.85, 0.4] };
const CORNICE3 = { outer: [5.55, 5.8], z1: 69.2, z2: 70.0 };
// Koperen lantaarn: achthoekig, vlakken evenwijdig aan de gevels.
const LANTERN_CENTRE = [-1.05, 0.38];
const LANTERN1 = { apothem: 3.75, z0: 70.0, z1: 76.5, gallery: 4.05, galleryZ: 76.9, top: 78.6 };
const LANTERN2 = { apothem: 2.6, z1: 83.2, cornice: 2.85, top: 84.5 };
// Kroon met bol, makelaar en windvaan (het paard); totale hoogte 96,8 m.
const CROWN = { drum: 1.4, z0: 84.5, z1: 85.4 };
const TOP = { ball: 0.6, ballZ: 90.0, finial: 0.35, finialZ: 92.0, height: 96.8 };

// Doorgangen (sinds 1938 grotendeels dicht): nissen van 2,8 m breed en circa
// 2 m diep volgens de BAG-voetafdruk, aan de Grote Markt (-X) en aan de noord-
// en zuidzijde (+Y, -Y), 0,15 m oostelijk van het hart.
const PORTAL = { width: 2.8, spring: 7.5, depth: 2.0 };

// ---------- stenen toren ----------
const stoneParts = [
  rectFrustum(0, STAGE1.z1, STAGE1.base, STAGE1.top, STAGE1.centre),
  gallery(STAGE1.centre, STAGE1.top, GALLERY1.outer, GALLERY1.z0, GALLERY1.z1, GALLERY1.z2),
  galleryPinnacles(STAGE1.centre, GALLERY1.outer, GALLERY1.z2, 0.8, 1.8, 2),
  rectFrustum(GALLERY1.z1, STAGE2.z1, STAGE2.base, STAGE2.top, STAGE2.centre),
  gallery(STAGE2.centre, STAGE2.top, GALLERY2.outer, GALLERY2.z0, GALLERY2.z1, GALLERY2.z2),
  galleryPinnacles(STAGE2.centre, GALLERY2.outer, GALLERY2.z2, 0.8, 1.6, 2),
  rectFrustum(GALLERY2.z1, STAGE3.z1, STAGE3.base, STAGE3.top, STAGE3.centre),
  gallery(STAGE3.centre, STAGE3.top, CORNICE3.outer, STAGE3.z1, CORNICE3.z1, CORNICE3.z2),
];

// Halve maat van een rechthoekige geleding op hoogte z (lineair tussen voet en top).
const halfAt = (stage, z0, z) => {
  const t = (z - z0) / (stage.z1 - z0);
  return [0, 1].map((i) => stage.base[i] + (stage.top[i] - stage.base[i]) * t);
};
const cuts = [];
for (const side of ["-x", "+y", "-y"]) {
  const lateral = side === "-x" ? 0 : side === "+y" ? 0.15 : -0.15;
  cuts.push(
    faceNiche(side, STAGE1.centre, STAGE1.base, lateral, PORTAL.width, PORTAL.spring, -0.01, PORTAL.depth),
  );
}
// Onderbouw: drie hoge spitsboognissen per gevel boven de doorgangen; de
// achterwand staat 0,4 m achter de gevel bovenaan, onderaan dieper.
for (const side of SIDES) {
  const half = halfAt(STAGE1, 0, 36);
  for (const lateral of [-4.3, 0, 4.3]) {
    cuts.push(faceNiche(side, STAGE1.centre, half, lateral, 2.6, 21.5, 13, 0.4));
  }
}
// Tweede geleding: drie nissen per gevel; derde geleding: twee hoge
// galmgaten per gevel (de uurwerken zitten daarin).
for (const side of SIDES) {
  const half2 = halfAt(STAGE2, GALLERY1.z1, 54);
  for (const lateral of [-3.9, 0, 3.9]) {
    cuts.push(faceNiche(side, STAGE2.centre, half2, lateral, 2.4, 10.4, 42, 0.5));
  }
  const half3 = halfAt(STAGE3, GALLERY2.z1, 67);
  for (const lateral of [-2.5, 2.5]) {
    cuts.push(faceNiche(side, STAGE3.centre, half3, lateral, 2.4, 6.5, 59, 0.7));
  }
}
const tower = union(stoneParts).subtract(union(cuts));

// ---------- koperen lantaarn, kroon en windvaan ----------
const lanternCuts = [];
for (let k = 0; k < 8; k++) {
  const n1 = archAlongX(1.9, 3.8, LANTERN1.apothem - 0.6, LANTERN1.apothem + 2, LANTERN1.z0 + 1, 0);
  const n2 = archAlongX(1.2, 2.6, LANTERN2.apothem - 0.45, LANTERN2.apothem + 2, LANTERN1.top + 0.6, 0);
  for (const niche of [n1, n2]) {
    lanternCuts.push(niche.rotate([0, 0, k * 45]).translate([...LANTERN_CENTRE, 0]));
  }
}
// Kroon als omwentelingslichaam: profiel [straal, hoogte], bol in het midden.
const crownProfile = [
  [0, CROWN.z1 - 0.01],
  [1.4, CROWN.z1 - 0.01],
  [1.9, 86.6],
  [1.9, 87.3],
  [1.2, 88.6],
  [0.35, 89.3],
  [0, 89.3],
];
const crown = Manifold.revolve([crownProfile], 32).translate([...LANTERN_CENTRE, 0]);
const [lx, ly] = LANTERN_CENTRE;
const lantern = union([
  octagonFrustum(LANTERN1.z0, LANTERN1.z1, LANTERN1.apothem, LANTERN1.apothem, LANTERN_CENTRE),
  octagonFrustum(LANTERN1.z1, LANTERN1.galleryZ, LANTERN1.apothem, LANTERN1.gallery, LANTERN_CENTRE),
  octagonFrustum(LANTERN1.galleryZ, LANTERN1.top, LANTERN1.gallery, LANTERN1.gallery, LANTERN_CENTRE),
  octagonFrustum(LANTERN1.top - 0.01, LANTERN2.z1, LANTERN2.apothem, LANTERN2.apothem, LANTERN_CENTRE),
  octagonFrustum(LANTERN2.z1, LANTERN2.z1 + 0.4, LANTERN2.apothem, LANTERN2.cornice, LANTERN_CENTRE),
  octagonFrustum(LANTERN2.z1 + 0.4, LANTERN2.top, LANTERN2.cornice, LANTERN2.cornice, LANTERN_CENTRE),
  Manifold.cylinder(CROWN.z1 - CROWN.z0 + 0.01, CROWN.drum, CROWN.drum, 16, false).translate([lx, ly, CROWN.z0 - 0.01]),
  crown,
  Manifold.sphere(TOP.ball, 16).translate([lx, ly, TOP.ballZ]),
  Manifold.sphere(TOP.finial, 12).translate([lx, ly, TOP.finialZ]),
  Manifold.cylinder(TOP.height - 89.2, 0.2, 0.12, 8, false).translate([lx, ly, 89.2]),
  // Windvaan (paard) als plaatje langs X, vóór de makelaar.
  box(1.3, 0.2, 1.0, lx + 0.55, ly, 95.0),
]).subtract(union(lanternCuts));

const parts = [
  ["building:toren", tower],
  ["building:lantaarn", lantern],
];
const printModel = union([tower, lantern]);

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
const glbFile = path.join(outDir, "martinitoren.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-martinitoren.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `martinitoren-1-${scale}.stl`);
const { buffer, triangles } = toStl(printModel, `NederPrint Martinitoren Groningen 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Oorsprong: hart van de
// BAG-voetafdruk van de onderbouw, in RD met de X-as langs de gevels naar de
// kerk (19,25 graden boven het oosten).
await writeFile(
  path.join(outDir, "martinitoren.json"),
  JSON.stringify(
    {
      name: "Martinitoren",
      file: "martinitoren.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [233884.04, 582065.19],
      xAxis: [0.94409, 0.32969],
      groundOffsetMetres: -0.3,
      // Grote Markt (west) en Martinikerkhof (noord en zuid); oostelijk staat de kerk.
      groundSamplePoints: [
        [-13, 0],
        [0, 13],
        [0, -13],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0014100010924795"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de onderbouw op het maaiveld van de Grote Markt in de oorsprong, +X langs de gevels naar de Martinikerk (RD-richting 19,25 graden) en +Y 90 graden linksom; de doorgangsnissen liggen aan -X (Grote Markt), +Y en -Y. Het maaiveld wordt op 13 m uit het hart bemonsterd aan de drie vrije zijden. Vervangt de PDOK-reconstructie van BAG-pand 0014100010924795. Nodenaam klasse:label bepaalt de materiaalklasse; building:lantaarn is de koperen bovenbouw.",
      printFiles: [`martinitoren-1-${scale}.stl`],
      realWorld: {
        totalHeightM: TOP.height,
        baseFootprintM: STAGE1.base.map((h) => h * 2),
        firstGalleryM: GALLERY1.z2,
        secondGalleryM: GALLERY2.z2,
        thirdStageTopM: CORNICE3.z2,
        lanternTopM: LANTERN2.top,
        lanternAcrossFlatsM: [LANTERN1.apothem * 2, LANTERN2.apothem * 2],
        portalWidthM: PORTAL.width,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Martinitoren",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/18553",
        "PDOK BAG pand 0014100010924795 (voetafdruk 16,5 x 17 m met drie doorgangsnissen), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de omhullende en het hart per geleding, de omgangen, de lantaarn en de kroon",
        "Wikimedia Commons: Groningen, Martinitoren RM-18553-WLM.jpg, Martinitoren in Groningen, bezien vanuit NOK, op de bovenste verdieping van Forum.jpg, Martinitoren from Grote Markt.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

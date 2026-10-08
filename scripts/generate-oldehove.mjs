// Genereert een vereenvoudigd, gesloten 3D-model van de Oldehove in
// Leeuwarden (1529-1533, onvoltooid): de scheve, vierkante bakstenen toren
// met twee steunberen op elke hoek, drie geledingen (de onderbouw met het
// portaal, de middengeleding met de hoge spitsboognis en de klokkengeleding
// met drie bogen per gevel), de hoekpijlers met hun schuine kappen, het
// vlakke dak met de glazen uitkijkpost en de mast met de windvaan. De toren
// helt over naar het noordwesten; het model neemt die scheefstand over als
// een lineaire afschuiving over de hele hoogte.
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, één node per onderdeel met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-oldehove.mjs              # 1:1000 (standaard)
//   node scripts/generate-oldehove.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: elke geleding en elke steunbeer springt
// naar boven terug met waterslagen die steiler zijn dan 45 graden, de
// scheefstand is minder dan 2 graden en de nissen zijn blind met een spitse
// top; het script controleert dat er boven de onderkant geen vlak is dat
// vlakker dan 45 graden naar beneden wijst.
//
// Assenstelsel: oorsprong op RD (181895,64, 579667,21), in het hart van de
// vierkante onderbouw (BAG) op het maaiveld ten noorden en zuiden van de
// toren (NAP +2,75 m), Z omhoog. +X staat loodrecht op de oostgevel met de
// ingang aan het Oldehoofsterkerkhof (RD-richting -5 graden, dus net ten
// zuiden van oost); +Y wijst naar het noordnoordoosten.
//
// Bronnen: BAG-pand 0080100000356999 (vierkant van 13,5 × 13,75 m met acht
// steunberen van 2,3 m breed tot 2,5 m buiten de gevels); AHN DSM/DTM 0,5 m
// (PDOK WCS) voor de dakhoogte, het bovenvlak en daarmee de scheefstand, en
// het maaiveld; Wikipedia (circa 39-40 m, top 2 m uit het lood) en het
// Rijksmonumentenregister (24331); Wikimedia Commons-foto's voor de
// geledingen, nissen, hoekpijlers en de uitkijkpost.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "oldehove");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(32);

// ---------- maten (lokaal stelsel, z = NAP - 2,75 m) ----------
const ORIGIN = [181895.64, 579667.21];
const ANGLE_DEG = -5.0;
const ANGLE = (ANGLE_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 2.75;
const GROUND_OFFSET = -0.3;
// Alle onderdelen beginnen op dezelfde vlakke onderkant, een halve meter onder
// het maaiveld. Het maaiveld loopt van NAP +3,1 m aan het plein (oost) naar
// +2,3 m aan de westkant.
const BASE = -0.5;

// Romp: halve maten [langs X, langs Y] per geleding, met waterslagen ertussen.
// Onderbouw uit de BAG-voetafdruk, de klokkengeleding uit het bovenvlak van
// het AHN-DSM (11,7 × 11,5 m).
const STAGE1 = { half: [6.75, 6.88], z1: 11.6 };
const STAGE2 = { half: [6.45, 6.58], z0: 12.1, z1: 26.4 };
const STAGE3 = { half: [5.85, 5.75], z0: 27.0, z1: 39.05 };
// Steunberen: twee per hoek, loodrecht op de gevels, 2,3 m breed en met de
// buitenkant 0,3 m binnen de hoek van de onderbouw; profiel [z, afstand van
// de kop tot het hart] voor de oost- en westgevel (de noord- en zuidgevel
// liggen 0,13 m verder uit het hart), met schuine waterslagen.
const BUTTRESS = {
  width: 2.3,
  inset: 0.3,
  profile: [
    [BASE, 9.4],
    [11.0, 9.4],
    [12.4, 8.6],
    [24.0, 8.6],
    [24.8, 8.3],
    [29.0, 8.3],
    [31.6, 6.5],
  ],
};
// Hoekpijlers van de klokkengeleding: vierkant van 3 m, 0,5 m buiten de
// gevels, met een schuine kap.
const PIER = { size: 3.0, out: 0.5, z1: 37.0, capTop: 38.6, capHalf: 0.45 };
// Glazen uitkijkpost op het dak en de mast met de windvaan (top van het DSM
// NAP +48,5 m).
const LOOKOUT = { centre: [-0.1, 0.55], size: 2.0, height: 2.4 };
const MAST = { radius: [0.35, 0.15], top: 45.7 };
// Scheefstand: het hart van het bovenvlak (AHN) ligt 0,9 m verder naar -X en
// 0,9 m verder naar +Y dan dat van de onderbouw (BAG), op het dak.
const LEAN = { top: [-0.9, 0.9], height: 39.05 };
// Blinde spitsboognissen per gevel: plaats langs de gevel, breedte, z0,
// rechte zijde tot `spring`, diepte. Gevel "+x" is de oostgevel met de ingang.
const ALL = ["+x", "-x", "+y", "-y"];
const NICHES = [
  // portalen in de onderbouw (oost en west, BAG)
  { faces: ["+x", "-x"], lateral: 0, width: 4.9, z0: 0.3, spring: 6.3, depth: 0.6, stage: STAGE1 },
  // hoge nis in de middengeleding
  { faces: ALL, lateral: 0, width: 6.0, z0: 13.2, spring: 20.5, depth: 0.6, stage: STAGE2 },
  // klokkengeleding: galmgat in het midden, blinde bogen ernaast
  { faces: ALL, lateral: 0, width: 2.4, z0: 29.5, spring: 34.9, depth: 0.6, stage: STAGE3 },
  { faces: ALL, lateral: -2.35, width: 1.6, z0: 30.0, spring: 35.6, depth: 0.4, stage: STAGE3 },
  { faces: ALL, lateral: 2.35, width: 1.6, z0: 30.0, spring: 35.6, depth: 0.4, stage: STAGE3 },
];
// Maaiveld ten noorden en zuiden van de toren (NAP +2,74 en +2,86 m volgens
// het AHN-DTM); oost ligt hoger (+3,1 m), west lager (+2,3 m).
const GROUND_SAMPLES = [
  [0, 12],
  [0, -12],
];

// ---------- hulpfuncties ----------
const union = (parts) => Manifold.union(parts);
const box = (x0, x1, y0, y1, z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
// Rechthoekige afgeknotte piramide rond (cx, cy): halve maten onderaan en bovenaan.
const rectFrustum = (z0, z1, [hx0, hy0], [hx1, hy1], [cx, cy] = [0, 0]) =>
  Manifold.extrude(
    [[[-hx0, -hy0], [hx0, -hy0], [hx0, hy0], [-hx0, hy0]]],
    z1 - z0,
    0,
    0,
    [hx1 / hx0, hy1 / hy0],
  ).translate([cx, cy, z0]);
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
// Blinde spitsboognis in een gevel: `half` is de afstand van het hart tot die
// gevel, `lateral` de plaats langs de gevel.
function faceNiche(side, half, lateral, width, z0, spring, depth) {
  return Manifold.extrude([pointedArch(width, spring - z0)], 4)
    .rotate([90, 0, 90])
    .translate([half - depth, lateral, z0])
    .rotate([0, 0, FACE_ANGLE[side]]);
}

// ---------- toren (recht) ----------
const [h1x, h1y] = STAGE1.half;
const [h3x, h3y] = STAGE3.half;
const body = union([
  rectFrustum(BASE, STAGE1.z1, STAGE1.half, STAGE1.half),
  rectFrustum(STAGE1.z1 - 0.01, STAGE2.z0, STAGE1.half, STAGE2.half),
  rectFrustum(STAGE2.z0 - 0.01, STAGE2.z1, STAGE2.half, STAGE2.half),
  rectFrustum(STAGE2.z1 - 0.01, STAGE3.z0, STAGE2.half, STAGE3.half),
  rectFrustum(STAGE3.z0 - 0.01, STAGE3.z1, STAGE3.half, STAGE3.half),
]);
// Steunbeer met de kop naar +X, als profiel [afstand tot het hart, z] tussen
// y0 en y1; de steunberen op de noord- en zuidgevel zijn dezelfde, gedraaid.
const buttressProfile = (extra) => [
  [0, BASE],
  ...BUTTRESS.profile.map(([z, r]) => [r + extra, z]),
  [0, BUTTRESS.profile.at(-1)[0]],
];
const buttresses = [];
for (const s of [-1, 1]) {
  // op de oost- en westgevel, aan beide hoeken
  const yOuter = s * (h1y - BUTTRESS.inset);
  const y0 = Math.min(yOuter, yOuter - s * BUTTRESS.width);
  const east = profileY(buttressProfile(0), y0, y0 + BUTTRESS.width);
  buttresses.push(east, east.mirror([1, 0, 0]));
  // op de noord- en zuidgevel: gedraaid naar +Y, aan beide hoeken
  const xOuter = s * (h1x - BUTTRESS.inset);
  const x0 = Math.min(xOuter, xOuter - s * BUTTRESS.width);
  // na draaien met 90 graden wordt lokale y = -x
  const north = profileY(buttressProfile(h1y - h1x), -(x0 + BUTTRESS.width), -x0).rotate([0, 0, 90]);
  buttresses.push(north, north.mirror([0, 1, 0]));
}
const piers = [];
for (const sx of [-1, 1]) {
  for (const sy of [-1, 1]) {
    const cx = sx * (h3x + PIER.out - PIER.size / 2);
    const cy = sy * (h3y + PIER.out - PIER.size / 2);
    const half = [PIER.size / 2, PIER.size / 2];
    piers.push(rectFrustum(BASE, PIER.z1, half, half, [cx, cy]));
    piers.push(rectFrustum(PIER.z1 - 0.01, PIER.capTop, half, [PIER.capHalf, PIER.capHalf], [cx, cy]));
  }
}
const [lx, ly] = LOOKOUT.centre;
const roof = union([
  box(lx - LOOKOUT.size / 2, lx + LOOKOUT.size / 2, ly - LOOKOUT.size / 2, ly + LOOKOUT.size / 2, STAGE3.z1 - 0.01, STAGE3.z1 + LOOKOUT.height),
  Manifold.cylinder(MAST.top - STAGE3.z1 - LOOKOUT.height + 0.01, MAST.radius[0], MAST.radius[1], 12, false).translate([
    lx - LOOKOUT.size / 2 + MAST.radius[0],
    ly,
    STAGE3.z1 + LOOKOUT.height - 0.01,
  ]),
]);
const mass = union([body, ...buttresses, ...piers, roof]);

const cuts = [];
for (const niche of NICHES) {
  for (const side of niche.faces) {
    const half = side.endsWith("x") ? niche.stage.half[0] : niche.stage.half[1];
    cuts.push(faceNiche(side, half, niche.lateral, niche.width, niche.z0, niche.spring, niche.depth));
  }
}
const upright = mass.subtract(union(cuts));

// ---------- scheefstand ----------
// Lineaire afschuiving: het hart verschuift evenredig met de hoogte boven het
// maaiveld, tot LEAN.top op het dak; de mast schuift evenredig verder mee.
const tower = upright.warp((v) => {
  const t = Math.max(v[2], 0) / LEAN.height;
  v[0] += LEAN.top[0] * t;
  v[1] += LEAN.top[1] * t;
});

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
  for (const [z] of levels) {
    if (!NICHES.some((n) => +z >= n.spring - 0.05 && +z <= n.spring + n.width)) throw new Error(`overhang op z ${z}`);
  }
  const bb = tower.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
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
const glbFile = path.join(outDir, "oldehove.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-oldehove.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `oldehove-1-${scale}.stl`);
const { buffer, triangles } = toStl(printModel, `NederPrint Oldehove Leeuwarden 1:${scale} mm Z-up`);
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
  path.join(outDir, "oldehove.json"),
  JSON.stringify(
    {
      name: "Oldehove",
      file: "oldehove.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: GROUND_OFFSET,
      // Ten noorden en zuiden van de toren; het plein aan de oostkant ligt
      // hoger, de westkant lager.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0080100000356999"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (181895,64, 579667,21), in het hart van de vierkante onderbouw op het maaiveld ten noorden en zuiden van de toren (NAP +2,75 m), +X loodrecht op de oostgevel met de ingang aan het Oldehoofsterkerkhof (RD-richting -5 graden) en +Y naar het noordnoordoosten. building:toren is de scheve bakstenen toren met acht steunberen, drie geledingen met blinde spitsboognissen, hoekpijlers met schuine kappen en het vlakke dak op 39 m, plus de glazen uitkijkpost en de mast tot 45,7 m boven het maaiveld; de toren helt lineair over tot 0,9 m naar -X en 0,9 m naar +Y op het dak (AHN), springt verder alleen naar boven terug en print op 1:1000 zonder steun. Vervangt de PDOK-reconstructie van BAG-pand 0080100000356999. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`oldehove-1-${scale}.stl`],
      realWorld: {
        roofHeightM: STAGE3.z1,
        mastTopM: MAST.top,
        baseFootprintM: STAGE1.half.map((h) => +(h * 2).toFixed(2)),
        belfryFootprintM: STAGE3.half.map((h) => +(h * 2).toFixed(2)),
        buttressReachM: BUTTRESS.profile[0][1],
        leanAtRoofM: LEAN.top,
        leanDegrees: +((Math.atan(Math.hypot(...LEAN.top) / LEAN.height) * 180) / Math.PI).toFixed(2),
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Oldehove_(gebouw)",
        "https://en.wikipedia.org/wiki/Oldehove_(tower)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/24331",
        "PDOK BAG pand 0080100000356999 (vierkante onderbouw van 13,5 x 13,75 m met acht steunberen), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dakhoogte, bovenvlak en scheefstand, mast, maaiveld",
        "Wikimedia Commons: Leeuwarden, de Oldehove RM24331 IMG 3650 2018-05-21 11.29.jpg, 20140531 Oldehove (Aldehou) Leeuwarden NL.jpg, Zicht vanuit het oosten - Leeuwarden - 20326062 - RCE.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

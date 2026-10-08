// Genereert een vereenvoudigd, gesloten 3D-model van de Essalam-moskee in
// Rotterdam-Feijenoord (Wilfried van Winden, 2010): de gebedszaal met de
// hoofdkoepel op een trommel, het entreeportaal aan de noordwestkant met de
// kleine koepel, de halfronde mihrab met zijn koepel aan de zuidoostkant en de
// twee minaretten van 50 m aan weerszijden van het portaal. Alle maten in het
// script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één
// node met de materiaalklasse in de nodenaam) als catalogusbron voor de export
// en de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-essalam-moskee.mjs              # 1:1000 (standaard)
//   node scripts/generate-essalam-moskee.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: alles wordt naar boven toe smaller of
// staat recht op. De minaretten zijn drie trommels van 5,8, 3,8 en 3,0 m
// doorsnede met een spits; de balkons en de dunne naald op de top (onder
// 0,9 m) zijn weggelaten.
//
// Assenstelsel: oorsprong onder het hart van de hoofdkoepel op RD (94880,4,
// 434824,33), op het maaiveld (NAP +1,5 m), Z omhoog. +X loopt langs de
// lengteas naar het zuidoosten (de mihrab, RD-richting -30,66 graden), +Y naar
// het noordoosten.
//
// Bronnen: BAG-pand 0599100000753081 (contour met de voeten van de
// minaretten); AHN DSM/DTM 0,5 m (PDOK WCS) in een stelsel langs de lengteas:
// daken van gebedszaal (NAP +16,5 m), portaal (+16,0 en +15,3 m) en
// zuidoostkant (+15,7 m), het radiale profiel van de hoofdkoepel (trommel tot
// +22,0 m, top +26,6 m), de kleine koepel (+21,6 m), de mihrab (+19,5 m), de
// omhullende per hoogte van beide minaretten (top +50 m) en het maaiveld;
// Wikipedia (koepel 25 m, minaretten 50 m hoog); PDOK luchtfoto. Geschat: de
// trommelhoogtes van de kleine koepels en de vorm van de spitsen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "essalam-moskee");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(64);

// ---------- maten (lokaal stelsel, z = NAP - 1,5 m) ----------
const ORIGIN = [94880.4, 434824.33];
const X_AXIS = [0.86017, -0.51003];
const GROUND_NAP = 1.5;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour (lokaal, vereenvoudigd tot 0,2 m).
const OUTLINE = [
  [16.5, 9.0], [11.6, 9.4], [11.8, 10.4], [-9.9, 12.2], [-9.8, 13.9], [-14.4, 14.3], [-14.7, 10.9],
  [-21.6, 11.4], [-21.1, 8.6], [-26.9, 7.4], [-26.6, 5.7], [-27.0, 5.6], [-24.9, -5.1], [-24.6, -5.0],
  [-24.2, -6.7], [-18.4, -5.6], [-17.9, -8.2], [-16.2, -8.3], [-16.5, -11.8], [-11.9, -12.2],
  [-11.8, -10.4], [9.9, -12.2], [10.0, -11.1], [14.8, -11.5], [15.5, -3.4], [16.6, -2.8], [17.3, -1.4],
  [16.8, 0.1], [15.8, 0.8],
].map(([x, y]) => [x + 0.5, y - 0.35]); // gemeten rond RD (94880,65, 434823,77)

// Dakvlakken per strook langs X (NAP).
const ROOFS = [
  { x: [-40, -20.45], top: 15.3 }, // portaal
  { x: [-20.45, -15.95], top: 16.0 },
  { x: [-15.95, 15.55], top: 16.5 }, // gebedszaal
  { x: [15.55, 40], top: 15.7 }, // zuidoostkant
];
// Koepels: hart, straal, trommel tot `drum`, profiel (straal als fractie van
// de voetstraal bij hoogte als fractie van de opgang) naar `top`.
const DOME_PROFILE = [[1, 0], [0.91, 0.15], [0.76, 0.41], [0.61, 0.61], [0.45, 0.76], [0.3, 0.87], [0.15, 0.96], [0, 1]];
const DOMES = [
  { name: "hoofdkoepel", centre: [0, 0], radius: 6.6, drum: 22.0, top: 26.6 },
  { name: "portaalkoepel", centre: [-14.6, 0.85], radius: 3.0, drum: 19.5, top: 21.6 },
  { name: "mihrab", centre: [19.15, -1.35], radius: 2.7, drum: 17.5, top: 19.5 },
];
// Minaretten: hart en trommels [straal, tot NAP], spits van de laatste straal
// naar de top.
const MINARETS = [
  { name: "noord", centre: [-11.95, 11.75], tiers: [[2.9, 31.0], [1.9, 39.0], [1.5, 45.5]], tip: 50.0 },
  { name: "west", centre: [-13.74, -9.83], tiers: [[2.9, 31.0], [1.9, 39.0], [1.5, 45.5]], tip: 49.3 },
];
// Maaiveld (lokaal) rondom: zuidwest, noordoost, noordwest en zuidoost.
const GROUND_SAMPLES = [[0.5, -16.3], [0.5, 15.7], [-29.5, -0.3], [24.5, -0.3]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const outline = Manifold.extrude(new CrossSection([ccw(OUTLINE)]), 100).translate([0, 0, BASE - 1]);
const cylinder = ([cx, cy], r, z0, z1) =>
  Manifold.cylinder(z1 - z0, r, r, 0).translate([cx, cy, z0]);
// Omwentelingslichaam uit een profiel [straal, z] dat op de as begint en
// eindigt.
const revolve = ([cx, cy], profile) =>
  Manifold.revolve(new CrossSection([ccw(profile)]), 0).translate([cx, cy, 0]);

// ---------- opbouw ----------
const hall = Manifold.union(
  ROOFS.map(({ x, top }) =>
    Manifold.intersection(outline, Manifold.cube([x[1] - x[0], 200, top - GROUND_NAP - BASE], false).translate([x[0], -100, BASE])),
  ),
);
const domes = DOMES.map(({ centre, radius, drum, top }) => {
  const rise = NAP(top) - NAP(drum);
  const profile = [[0, BASE], [radius, BASE], ...DOME_PROFILE.map(([r, h]) => [radius * r, NAP(drum) + rise * h])];
  return revolve(centre, profile);
});
const minarets = MINARETS.map(({ centre, tiers, tip }) => {
  const profile = [[0, BASE]];
  let z = BASE;
  for (const [r, top] of tiers) {
    profile.push([r, z], [r, NAP(top)]);
    z = NAP(top);
  }
  profile.push([0, NAP(tip)]);
  return revolve(centre, profile);
});
const mosque = Manifold.union([hall, ...domes, ...minarets]);
const nodes = [["building:essalam-moskee", mosque]];

// ---------- controles ----------
if (mosque.status() !== "NoError") throw new Error(mosque.status());
{
  const mesh = mosque.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nz = e1[0] * e2[1] - e1[1] * e2[0];
    if (nz < -1e-6) area += -nz / 2;
  }
  console.log(`ondervlak boven de onderkant: ${area.toFixed(3)} m2`);
  if (area > 0.01) throw new Error("overhang");
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
for (const [name, solid] of nodes) {
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
const glbFile = path.join(outDir, "essalam-moskee.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-essalam-moskee.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `essalam-moskee-1-${scale}.stl`);
const printSolid = mosque.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Essalam-moskee 1:${scale} mm Z-up`);
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
  path.join(outDir, "essalam-moskee.json"),
  JSON.stringify(
    {
      name: "Essalam-moskee",
      file: "essalam-moskee.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het plein en het gras rondom (NAP +1,4 tot +1,9 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0599100000753081"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong onder het hart van de hoofdkoepel op RD (94880,4, 434824,33), op het maaiveld (NAP +1,5 m), +X langs de lengteas naar de mihrab in het zuidoosten (RD-richting -30,66 graden) en +Y naar het noordoosten. Eén node building: gebedszaal (NAP +16,5 m) met de hoofdkoepel op een trommel (top +26,6 m), het portaal met de kleine koepel (+21,6 m), de mihrab met zijn koepel (+19,5 m) en de twee minaretten van drie trommels met een spits (top +50,0 en +49,3 m). Alles wordt naar boven toe smaller, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0599100000753081. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`essalam-moskee-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        hallRoofNapM: 16.5,
        mainDome: { radiusM: 6.6, drumNapM: 22.0, topNapM: 26.6 },
        minaretTopsNapM: MINARETS.map((m) => m.tip),
        minaretDiametersM: MINARETS[0].tiers.map(([r]) => 2 * r),
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Essalammoskee",
        "PDOK BAG pand 0599100000753081 (contour met de voeten van de minaretten), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: daken, radiaal profiel van de hoofdkoepel, kleine koepels, omhullende per hoogte van de minaretten, maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

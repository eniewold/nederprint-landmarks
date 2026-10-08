// Genereert een vereenvoudigd, gesloten 3D-model van het Goffertstadion in
// Nijmegen (thuisstadion van N.E.C.): de afgeronde rechthoekige kom in het
// Goffertpark, waarvan het lage dak over de hele omtrek van de veldkant
// schuin naar buiten afloopt, de vier lichtmasten op de buitenhoeken en het
// hoofdgebouw met de kantine aan de zuidwestkant. Het stadion zelf is geen
// BAG-pand; alleen het hoofdgebouw wordt vervangen. Alle maten in het script
// zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-goffertstadion.mjs              # 1:1000 (standaard)
//   node scripts/generate-goffertstadion.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening op het niveau van
// het veld (NAP +17,4 m; het park rond het stadion ligt tot 8 m hoger), Z
// omhoog. +X loopt langs de lengteas van het veld naar het zuidoosten
// (RD-richting (0,7305, -0,6829), -43,07 graden), +Y dwars daarop naar het
// noordoosten; het hoofdgebouw ligt aan de -Y-kant.
//
// Bronnen: PDOK BAG-pand 0268100000026111 (hoofdgebouw, contour en vervangen
// pand); AHN DSM/DTM 0,5 m (PDOK WCS): de veldopening (122 bij 82 m), het
// dak (+12,5 m aan de veldkant, +11,2 m aan de buitenrand), de buitenrand
// (156 bij 117 m, hoeken met een straal van 24 m), de lichtmasten (tot +39
// m boven het veld), het hoofdgebouw (+13,2 m) en het veld; Wikipedia
// (12.500 plaatsen); PDOK luchtfoto. Geschat: de doorsnede van de
// lichtmasten (2,6 × 2,6 m, in het echt open vakwerk) en de straal van de
// hoeken. Weggelaten: de tribunes onder het dak, de dakribben, de loopbrug
// en het gebouw ten oosten van het stadion (aparte BAG-panden).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "goffertstadion");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Convexe veelhoek in plan met een dakvlak z = a x + b y + c, vanaf z0 omhoog.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([
    ...pts.map(([x, y]) => [x, y, z0]),
    ...pts.map(([x, y]) => [x, y, a * x + b * y + c]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);

const SLUG = "goffertstadion";

// ---------- maten (lokaal stelsel, z = hoogte boven het veld op NAP +17,4 m) ----------
const GROUND_NAP = 17.45;
const ORIGIN = [186026.6, 426077.5];
const X_AXIS = [0.73052, -0.682891]; // RD-richting -43,07 graden, langs het veld
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het veld.
const BASE = -0.5;
// Alle hoogtes hieronder zijn AHN-DSM-hoogtes boven de mediaan van de DTM in
// het gebied, plus 4,4 m: het veld ligt zo veel onder die mediaan.

// Het dak is een ring tussen twee afgeronde rechthoeken: de binnenrand (122 bij
// 82 m, hoekstraal 8 m) en de buitenrand (159 bij 117 m, hoekstraal 24 m). Het
// dak ligt aan de binnenrand op +13,0 m en daalt naar buiten tot +11,3 m
// (AHN: +8,6 naar +6,9 m boven het maaiveld in de DSM); de binnen- en
// buitenwand zijn verticaal.
const INNER = { hu: 61, hv: 41, r: 8, z: 13.0 };
const OUTER = { hu: 79.5, hv: 58.5, r: 24, z: 11.3 };
const ARC_SEGMENTS = 6;
// Lichtmasten op de vier buitenhoeken: vakwerk als pilaar van 2,6 × 2,6 m
// vanaf het dak tot +39,2, +32,8, +33,7 en +35,2 m (AHN).
const MASTS = [
  { at: [-73.5, 45], top: 39.2 },
  { at: [72.8, 45], top: 32.8 },
  { at: [73, -45.2], top: 33.7 },
  { at: [-73.5, -45.5], top: 35.2 },
];
const MAST_WIDTH = 2.6;
const MAST_FOOT = 10.5;
// Hoofdgebouw met de kantine aan de zuidwestkant (BAG 0268100000026111): de
// noordelijke vleugel tegen het stadion op +11,6 m en de zuidelijke vleugel
// op +13,2 m, met de liftopbouw (+21,7 m).
const HALL_NORTH = [
  [29.1, -67.2], [29.2, -50.7], [0.6, -51.0], [0.6, -52.2], [-1.4, -52.2], [-1.4, -51.0], [-30.6, -51.1], [-30.5, -67.1],
];
const HALL_SOUTH = [
  [-33.1, -66.0], [-33.1, -79.0], [-27.2, -79.0], [-27.2, -88.2], [26.3, -88.3], [26.4, -79.6], [32.2, -79.5], [32.3, -66.0],
];
const HALL_NORTH_TOP = 11.6;
const HALL_SOUTH_TOP = 13.2;
const LIFT = { u: [-5, 3], v: [-80, -74], top: 21.7 };
// Maaiveld (AHN, het veld en het park ten westen van het stadion).
const GROUND_SAMPLES = [[0, 0], [-85, 0]];

// ---------- gebouwen ----------
// Afgeronde rechthoek (tegen de klok in) met `ARC_SEGMENTS` stappen per hoek.
const roundedRect = ({ hu, hv, r }) => {
  const pts = [];
  const corners = [[hu - r, hv - r, 0], [-(hu - r), hv - r, 90], [-(hu - r), -(hv - r), 180], [hu - r, -(hv - r), 270]];
  for (const [cx, cy, a0] of corners) {
    for (let s = 0; s <= ARC_SEGMENTS; s++) {
      const a = ((a0 + (90 * s) / ARC_SEGMENTS) * Math.PI) / 180;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
};
const inner = roundedRect(INNER);
const outer = roundedRect(OUTER);
// Elke strook is de convexe romp van twee punten op de binnenrand en twee op de
// buitenrand, op het dak en op de onderkant, 2 cm uitgeschoven zodat de
// stroken overlappen (rakende vlakken laten in de vereniging een spleet
// zonder dikte achter).
const centroid = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
const strip = (k) => {
  const n = (k + 1) % inner.length;
  const pts = [[...inner[k], INNER.z], [...inner[n], INNER.z], [...outer[n], OUTER.z], [...outer[k], OUTER.z]];
  const [cx, cy] = centroid(pts);
  const grown = pts.map(([x, y, z]) => {
    const l = Math.hypot(x - cx, y - cy) || 1;
    return [x + ((x - cx) / l) * 0.02, y + ((y - cy) / l) * 0.02, z];
  });
  return Manifold.hull(grown.flatMap(([x, y, z]) => [[x, y, z], [x, y, BASE]]));
};
const ring = Manifold.union(inner.map((_, k) => strip(k)));
const masts = MASTS.map(({ at: [x, y], top }) => box(x - MAST_WIDTH / 2, x + MAST_WIDTH / 2, y - MAST_WIDTH / 2, y + MAST_WIDTH / 2, MAST_FOOT, top));
const hall = Manifold.union([
  prism(HALL_NORTH, BASE, HALL_NORTH_TOP),
  prism(HALL_SOUTH, BASE, HALL_SOUTH_TOP),
  box(LIFT.u[0], LIFT.u[1], LIFT.v[0], LIFT.v[1], HALL_SOUTH_TOP - 0.5, LIFT.top),
]);
const stadium = Manifold.union([ring, ...masts, hall]);
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "Goffertstadion",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0268100000026111"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (186026,60, 426077,50) in het hart van de veldopening op het niveau van het veld (NAP +17,4 m), +X langs het veld naar het zuidoosten (-43,07 graden) en +Y naar het noordoosten. Eén node building:stadion: de afgeronde ring van het dak (122 bij 82 m binnenrand, 159 bij 117 m buitenrand) dat van +13,0 m aan de veldkant naar +11,3 m aan de buitenrand daalt, vier lichtmasten van 2,6 × 2,6 m tot +33 tot +39 m en het hoofdgebouw met de kantine aan de zuidwestkant (+11,6 en +13,2 m, liftopbouw +21,7 m). Onderkant op 0,5 m onder het veld; alle vlakken wijzen omhoog of staan verticaal. Het stadion is geen BAG-pand; vervangt alleen het hoofdgebouw. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 12500,
    fieldOpeningM: [122, 82],
    roofInnerM: INNER.z,
    roofOuterM: OUTER.z,
    mastTopM: MASTS.map((m) => m.top),
    fieldNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Goffertstadion",
    "PDOK BAG pand 0268100000026111 (hoofdgebouw), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: de ring van het dak, de lichtmasten, het hoofdgebouw en het veld",
    "PDOK luchtfoto (Actueel_orthoHR)",
  ],
};

// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan ��n stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
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
  const gltfNodes = [];
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
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
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
    volumeM3: +solid.volume().toFixed(1),
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
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

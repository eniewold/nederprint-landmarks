// Genereert een vereenvoudigd, gesloten 3D-model van de Johan Cruijff ArenA
// in Amsterdam (Schuurman en Soeters, 1996): het ovale stadion met het gebogen
// dak, de veldopening, de opengeschoven dakdelen boven de lange tribunes, de
// twee boogvormige dwarsspanten op hun vier torens en de lagere bijgebouwen.
// Alle vormen zijn glad en gefit op het AHN; het Mapbox-landmarkmodel is alleen
// visueel vergeleken. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-johan-cruijff-arena.mjs              # 1:1000 (standaard)
//   node scripts/generate-johan-cruijff-arena.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van het veld op straatniveau (NAP -3,4 m),
// Z omhoog. +X loopt langs de lengteas van het veld naar het zuidzuidoosten
// (RD-richting -61 graden), +Y dwars daarop naar het oostnoordoosten.
//
// Bronnen: BAG-pand 0363100012075730 (contour, bijgebouwen); AHN DSM/DTM 0,5 m
// (PDOK WCS): superellips van de dakrand, dakvlak (polynoom, afwijking 0,6 m),
// veldopening, dakdelen (8,3 m boven het dak), spanten (driehoekig, 10 m breed,
// top tot NAP +69,4 m, 118 m uit elkaar), torens en straatniveau; Wikipedia
// (veld 105 × 68 m, dakdelen 37 × 120 m); PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "johan-cruijff-arena");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection, Mesh } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
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
const prism = (polys, z0, z1) =>
  Manifold.extrude(new CrossSection(polys.map(ccw)), z1 - z0).translate([0, 0, z0]);
// Gesloten blok met een glad bovenvlak z = top(u, v) boven een rechthoek.
function heightBlock(u0, u1, v0, v1, step, top, bottom) {
  const nu = Math.max(2, Math.round((u1 - u0) / step) + 1);
  const nv = Math.max(2, Math.round((v1 - v0) / step) + 1);
  const pos = [];
  const tri = [];
  const at = (i, j) => j * nu + i;
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const u = u0 + ((u1 - u0) * i) / (nu - 1);
      const v = v0 + ((v1 - v0) * j) / (nv - 1);
      pos.push(u, v, top(u, v));
    }
  }
  for (let j = 0; j < nv - 1; j++) {
    for (let i = 0; i < nu - 1; i++) {
      tri.push(at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j), at(i + 1, j + 1), at(i, j + 1));
    }
  }
  const ring = [];
  for (let i = 0; i < nu - 1; i++) ring.push(at(i, 0));
  for (let j = 0; j < nv - 1; j++) ring.push(at(nu - 1, j));
  for (let i = nu - 1; i > 0; i--) ring.push(at(i, nv - 1));
  for (let j = nv - 1; j > 0; j--) ring.push(at(0, j));
  const base = pos.length / 3;
  for (const k of ring) pos.push(pos[k * 3], pos[k * 3 + 1], bottom);
  const centre = pos.length / 3;
  pos.push((u0 + u1) / 2, (v0 + v1) / 2, bottom);
  for (let k = 0; k < ring.length; k++) {
    const a = ring[k];
    const b = ring[(k + 1) % ring.length];
    const ab = base + k;
    const bb = base + ((k + 1) % ring.length);
    tri.push(a, ab, bb, a, bb, b, centre, bb, ab);
  }
  return new Manifold(
    new Mesh({ numProp: 3, vertProperties: new Float32Array(pos), triVerts: new Uint32Array(tri) }),
  );
}

// ---------- maten (z = NAP + 3,4 m) ----------
const ORIGIN = [124633.636, 480804.44];
const X_AXIS = [0.48481, -0.87462]; // RD-richting -61 graden, langs het veld
const NAP = (h) => h + 3.4;
const BASE = NAP(-5.0);
// Dakrand als superellips |u/A|^n + |v/B|^n = 1 (AHN, afwijking 0,6 %).
const OVAL = { a: 116, b: 88, n: 2.8 };
// Dakvlak: even polynoom in (u/A, v/B) tot de achtste graad, gefit op het AHN
// buiten veldopening, spanten en dakdelen (NAP, rms 0,6 m).
const ROOF_COEF = [62.69737, -44.38089, 22.90001, 40.54996, -46.87975, -8.86601, 174.02933, -279.0919, 113.86383, -31.66684, -228.68687, 203.98662, 31.96491, 94.16045, -13.5588];
// Bijgebouwen buiten het ovaal (BAG min ovaal), met hun hoogte uit het AHN.
const ANNEX = [
  { height: 13.9, polys: [[[45.91, -118.83], [45.94, -113.64], [41.67, -113.63], [41.7, -103.3], [28.32, -103.28], [28.32, -104.28], [25.02, -104.28], [25.03, -96.18], [45.61, -96.21], [45.6, -97.87], [49.69, -97.9], [54.13, -93.26], [63.51, -93.27], [67.97, -97.92], [72.06, -97.92], [72.08, -93.82], [67.72, -89.44], [77.77, -85.54], [74.93, -78.81], [62.98, -82.99], [55.96, -84.76], [40.08, -87.38], [20.34, -88.76], [-14.12, -88.91], [-35.62, -87.84], [-52.22, -85.53], [-68.22, -81.36], [-69.23, -84.07], [-64.88, -85.87], [-66.01, -89.34], [-67.92, -89.18], [-72.38, -93.63], [-72.39, -97.72], [-68.29, -97.75], [-63.83, -93.11], [-54.46, -93.09], [-50.01, -97.74], [-45.89, -97.75], [-45.91, -96.06], [-12.11, -96.12], [-12.12, -104.22], [-16.22, -104.21], [-16.22, -103.21], [-42.02, -103.17], [-42.01, -113.5], [-46.28, -113.5], [-46.28, -118.74]]] },
  { height: 26.5, polys: [[[25, -96.2], [42.1, -96.2], [42.1, -89.3], [47.1, -89.3], [47.1, -96.3], [51.1, -96.3], [54.1, -93.3], [63.5, -93.3], [66.4, -96.3], [71.1, -96.3], [71.1, -92.8], [67.7, -89.4], [69.1, -88.9], [69.1, -84.3], [71.1, -84.3], [72.1, -82.3], [76, -81.4], [74.9, -78.8], [56, -84.8], [40.1, -87.4], [20.3, -88.8], [-35.6, -87.8], [-52.2, -85.5], [-68.2, -81.4], [-68.9, -84.2], [-64.9, -85.9], [-66, -89.3], [-67.9, -89.2], [-70.9, -92.1], [-70.9, -96.3], [-66.9, -96.3], [-64.9, -93.3], [-54.9, -92.3], [-51.4, -96.3], [-46.9, -96.3], [-46.9, -92.3], [-47.9, -92.3], [-47.9, -88.3], [-42.9, -88.3], [-42.9, -92.3], [-41.9, -92.3], [-41.9, -96.1], [-12.1, -96.1], [-12.1, -103.3], [25, -103.3]]] },
  { height: 43.4, polys: [[[-48.9, -94.3], [-48.9, -87.3], [-42.9, -87.3], [-42.9, -88.3], [-25.8, -88.3], [-52.2, -85.5], [-68.2, -81.4], [-67.9, -84.6], [-64.9, -85.9], [-66, -89.3], [-67.9, -89.2], [-70.9, -92.3], [-68.9, -94.3], [-65.9, -94.3], [-65.9, -93.3], [-64, -93.3], [-63.9, -92.3], [-54.9, -92.3], [-52.9, -93.3], [-52.4, -95.2]], [[52.1, -94.3], [57.1, -92.3], [57.1, -89.3], [62.1, -89.3], [62.1, -92.3], [65.1, -93.3], [65.1, -94.3], [69.1, -94.3], [69.7, -91.4], [67.7, -89.4], [69.1, -88.9], [69.1, -84.3], [71.1, -84.3], [72.1, -82.3], [75.1, -82.3], [74.9, -78.8], [56, -84.8], [26.5, -88.3], [48.1, -88.3], [48.1, -93.3], [49.1, -93.3], [49.1, -95.3], [52.1, -95.3]]] },
  { height: 0.7, polys: [[[128.25, 8.31], [116.95, 8.23], [116.76, -14.22], [128.25, -14.31]], [[-116.77, -13.9], [-116.94, 8.52], [-128.34, 8.63], [-128.36, -13.99]]] },
];
const roofNap = (u, v) => {
  const x = u / OVAL.a;
  const y = v / OVAL.b;
  let z = 0;
  let k = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5 - i; j++) z += ROOF_COEF[k++] * x ** (2 * i) * y ** (2 * j);
  }
  return z;
};
// Veldopening (AHN: veld op NAP +7,4 m, tot |u| 53 en |v| 34,5 m).
const OPENING = { halfU: 53, halfV: 34.5, corner: 4, floor: 7.4 };
// Opengeschoven dakdelen boven de lange tribunes: 8,3 m boven het dak, tot
// |u| 54,5 m, van |v| 39 tot 71 m.
const PANELS = { halfU: 54.5, from: 39, to: 71, above: 8.3 };
// Dwarsspanten: driehoekig vakwerk, 10 m breed en 11,9 m hoog, op u = ±59 m;
// top langs de boog uit het AHN (gemiddelde van beide spanten).
const TRUSS = { u: 59, halfWidth: 5, depth: 11.9 };
const TRUSS_TOP = [
  [0, 69.4], [5, 69.35], [10, 69.15], [15, 68.8], [20, 68.5], [25, 67.95], [30, 67.3],
  [35, 66.9], [40, 66.75], [45, 66.6], [50, 65.6], [55, 63.6], [60, 62.3], [65, 61.0],
  [70, 58.8], [75, 56.0], [80, 53.9], [85, 52.0], [90, 50.0], [92.5, 49.0],
];
// Torens onder de spanteinden, buiten het ovaal, met een koepel (AHN: top op
// NAP +51,5 m).
const TOWER = { u: 59, v: 92, radius: 3.5, top: 51.5 };

// ---------- stadion ----------
const ovalOutline = [];
for (let k = 0; k < 360; k++) {
  const t = (2 * Math.PI * k) / 360;
  const c = Math.cos(t);
  const s = Math.sin(t);
  ovalOutline.push([
    OVAL.a * Math.sign(c) * Math.abs(c) ** (2 / OVAL.n),
    OVAL.b * Math.sign(s) * Math.abs(s) ** (2 / OVAL.n),
  ]);
}
const roof = heightBlock(-OVAL.a - 1, OVAL.a + 1, -OVAL.b - 1, OVAL.b + 1, 2, (u, v) => NAP(roofNap(u, v)), BASE);
const opening = Manifold.extrude(
  new CrossSection([
    ccw([
      [-OPENING.halfU, -OPENING.halfV],
      [OPENING.halfU, -OPENING.halfV],
      [OPENING.halfU, OPENING.halfV],
      [-OPENING.halfU, OPENING.halfV],
    ]),
  ])
    .offset(-OPENING.corner, "Miter")
    .offset(OPENING.corner, "Round"),
  200,
).translate([0, 0, NAP(OPENING.floor)]);
const bowl = roof.intersect(prism([ovalOutline], BASE - 1, NAP(100))).subtract(opening);
const panels = [-1, 1].map((s) => {
  const [v0, v1] = s > 0 ? [PANELS.from, PANELS.to] : [-PANELS.to, -PANELS.from];
  return heightBlock(-PANELS.halfU, PANELS.halfU, v0, v1, 1.5, (u, v) => NAP(roofNap(u, v) + PANELS.above), NAP(40));
});
const annexes = ANNEX.map(({ height, polys }) => prism(polys, BASE, NAP(height)));

// ---------- spanten en torens ----------
const trussTop = (v) => {
  const a = Math.abs(v);
  for (let k = 1; k < TRUSS_TOP.length; k++) {
    const [v0, z0] = TRUSS_TOP[k - 1];
    const [v1, z1] = TRUSS_TOP[k];
    if (a <= v1) return z0 + ((z1 - z0) * (a - v0)) / (v1 - v0);
  }
  return TRUSS_TOP[TRUSS_TOP.length - 1][1];
};
// Geen vlak dat vrij overhangt: op het dak zakt de onderkant minstens 1 m in
// het dak, buiten het ovaal loopt het spant door tot de grond (als pyloon
// tussen de torens). Zo kiest de export de snelle 2,5D-opvulling.
// Op u = ±59 m ligt de dakrand op |v| ≈ 83 m; de pyloon begint net daarbinnen.
const OUTSIDE_OVAL = 82;
const trussSlice = (u, v) => {
  const t = NAP(trussTop(v));
  let bottom = t - TRUSS.depth;
  if (Math.abs(v) >= OUTSIDE_OVAL) bottom = BASE;
  else {
    for (let du = -TRUSS.halfWidth; du <= TRUSS.halfWidth; du += 1) {
      bottom = Math.min(bottom, NAP(roofNap(u + du, v)) - 1);
    }
  }
  return profileY(
    [
      [u - TRUSS.halfWidth, bottom],
      [u + TRUSS.halfWidth, bottom],
      [u + TRUSS.halfWidth, t - TRUSS.depth],
      [u, t],
      [u - TRUSS.halfWidth, t - TRUSS.depth],
    ].filter((p, i, all) => i === 0 || p[1] !== all[i - 1][1] || p[0] !== all[i - 1][0]),
    v,
    v + 0.01,
  );
};
const vEnd = TRUSS_TOP[TRUSS_TOP.length - 1][0];
const trusses = [];
for (const s of [-1, 1]) {
  const u = s * TRUSS.u;
  const vs = [];
  for (let v = -vEnd; v <= vEnd + 1e-6; v += 2.5) vs.push(v);
  // Overgang naar de pyloon precies op de rand, zodat de hull geen schuine
  // onderkant krijgt.
  vs.push(-OUTSIDE_OVAL, -OUTSIDE_OVAL + 0.02, OUTSIDE_OVAL - 0.02, OUTSIDE_OVAL);
  vs.sort((a, b) => a - b);
  for (let k = 0; k + 1 < vs.length; k++) {
    trusses.push(Manifold.hull([trussSlice(u, vs[k]), trussSlice(u, vs[k + 1] - 0.01)]));
  }
}
const towers = [];
for (const su of [-1, 1]) {
  for (const sv of [-1, 1]) {
    const x = su * TOWER.u;
    const y = sv * TOWER.v;
    const capZ = NAP(TOWER.top - TOWER.radius);
    towers.push(Manifold.cylinder(capZ - BASE, TOWER.radius, TOWER.radius, 32, false).translate([x, y, BASE]));
    // Koepel op de toren: alleen de bovenste helft, zonder overhang.
    towers.push(
      Manifold.sphere(TOWER.radius, 32)
        .trimByPlane([0, 0, 1], 0)
        .translate([x, y, capZ]),
    );
  }
}

const arena = union([bowl, ...panels, ...annexes, ...trusses, ...towers]);
const nodes = [["building:stadion", arena]];
const printModel = arena;

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
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "johan-cruijff-arena.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-johan-cruijff-arena.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (NAP -5 m) op het printbed.
const stlFile = path.join(outDir, `johan-cruijff-arena-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Johan Cruijff ArenA 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
await writeFile(
  path.join(outDir, "johan-cruijff-arena.json"),
  JSON.stringify(
    {
      name: "Johan Cruijff ArenA",
      file: "johan-cruijff-arena.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Straten rond het stadion (NAP -3,4 m), niet het verhoogde dek
      // eromheen (NAP +6 m).
      groundSamplePoints: [
        [-126.5, 35.4],
        [-96.3, 94.1],
        [51.5, 95.6],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0363100012075730"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van het veld op straatniveau (NAP -3,4 m) in de oorsprong, +X langs de lengteas van het veld (RD-richting -61 graden) en +Y dwars daarop. Het stadion is opgebouwd uit gladde vormen die op het AHN zijn gefit: superellips als dakrand, polynoom als dakvlak, de veldopening, de dakdelen, de spanten op vier torens en de bijgebouwen uit de BAG-contour. Vervangt de PDOK-reconstructie van BAG-pand 0363100012075730, een LoD1.1-blok zonder veldopening.",
      printFiles: [`johan-cruijff-arena-1-${scale}.stl`],
      realWorld: {
        pitchM: [105, 68],
        pitchNapM: 7.4,
        roofTopNapM: +roofNap(0, OPENING.halfV + 1).toFixed(1),
        oval: OVAL,
        trussTopNapM: TRUSS_TOP[0][1],
        trussSpacingM: TRUSS.u * 2,
        towerTopNapM: TOWER.top,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Johan_Cruijff_ArenA",
        "PDOK BAG pand 0363100012075730, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dakrand, dakvlak, veldopening, dakdelen, spanten, torens, bijgebouwen en straatniveau",
        "Mapbox Standard-landmarkmodel: alleen visueel vergeleken (dakvorm, spanten op torens), geen geometrie overgenomen",
        "PDOK luchtfoto (Actueel_orthoHR): veld, spanten en dakdelen",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

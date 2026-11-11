import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "johannes-de-doperkerk-s-heer-abtskerke");
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
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
// Vlak door de gevellijn p0-p1, stijgend naar binnen (kant van 'inside') met helling t vanaf z0.
const facet = ([x0, y0], [x1, y1], z0, t, [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = -(y1 - y0) / len;
  let ny = (x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) < 0) {
    nx = -nx;
    ny = -ny;
  }
  return [t * nx, t * ny, z0 - t * (nx * x0 + ny * y0)];
};
// Doorsneden in plan voor de tussenstukken van een geleding (convexe veelhoeken).
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const diamond = ([cx, cy], r) => [[cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]];
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek]; verspringingen en spitsen.
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel: vierkante schacht met een piramide erop.
const pinnacle = (c, half, z0, shaft, point) =>
  loft([[z0, sq(c, half)], [z0 + shaft, sq(c, half)], [z0 + shaft + point, tip(c)]]);
// Steunbeer tegen een gevel die naar -v kijkt (zuid): breedte w, diepte d, bovenkant zw tegen de muur en zo aan de buitenkant.
// angle draait de gevel: 0 zuid, 90 oost, 180 noord, 270 west; [x, y] is het punt in de gevel.
const buttress = ([x, y], angle, w, d, zw, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 59 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +u) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.9) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.4,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);

const SLUG="johannes-de-doperkerk-s-heer-abtskerke";
const ORIGIN=[50365,387948], X_AXIS=[0.988,0.156], BASE=-0.5;
const GROUND_SAMPLES=[[-25,-9],[-20,9],[-8,12],[0,14],[12,10],[22,-10]];
const solids=[];
const footprint=[[-0.477, 8.774], [5.154, 8.837], [5.22, 3.033], [10.14, 2.965], [10.136, 3.644], [10.886, 3.647], [10.889, 2.968], [15.22, 2.883], [15.329, 3.696], [16.178, 3.562], [16.052, 2.691], [18.982, 1.367], [19.695, 1.852], [20.14, 1.133], [19.371, 0.687], [19.305, -2.421], [20.085, -2.868], [19.663, -3.612], [18.907, -3.137], [15.984, -4.408], [16.041, -5.258], [15.202, -5.378], [15.11, -4.614], [10.706, -4.608], [10.719, -5.43], [10.495, -5.434], [10.492, -8.4], [5.449, -8.343], [5.456, -10.928], [-0.265, -10.925], [-0.181, -5.328], [-2.552, -5.338], [-2.554, -6.048], [-3.303, -6.051], [-3.303, -5.341], [-6.193, -5.371], [-6.193, -6.07], [-6.902, -6.07], [-6.903, -5.38], [-9.823, -5.396], [-9.819, -6.085], [-10.558, -6.079], [-10.561, -5.39], [-11.465, -5.411], [-11.465, -4.955], [-12.644, -4.98], [-12.67, -3.488], [-15.689, -3.558], [-15.659, -5.031], [-17.161, -5.057], [-17.191, -3.574], [-18.682, -3.592], [-18.712, -2.109], [-17.25, -2.087], [-17.295, 0.958], [-18.757, 0.936], [-18.778, 2.407], [-17.287, 2.425], [-17.353, 3.925], [-14.028, 4.008], [-14.023, 3.592], [-12.898, 3.605], [-12.901, 4.032], [-11.413, 4.029], [-11.413, 3.705], [-10.605, 3.699], [-10.616, 4.399], [-9.864, 4.412], [-9.851, 3.722], [-6.918, 3.765], [-6.93, 4.455], [-6.188, 4.47], [-6.176, 3.78], [-3.254, 3.814], [-3.266, 4.515], [-2.536, 4.521], [-2.525, 3.821], [-0.424, 3.853]];
const roofs=[[[[5.761, -4.962], [10.766, -4.636], [10.78, -5.489], [10.555, -5.493], [10.552, -8.461], [5.582, -8.405]], [0.0098, 0.6297, 8.4617]], [[[2.415, 1.534], [2.358, 8.865], [5.213, 8.898], [5.272, 3.613], [2.886, 1.201]], [-1.5154, -0.0065, 14.4305]], [[[1.837, 1.941], [1.5, 1.777], [-0.529, 3.829], [-0.537, 8.833], [2.478, 8.867], [2.536, 1.449]], [1.5072, 0.0172, 6.913]], [[[18.119, -2.313], [15.598, -0.777], [18.956, 0.948], [18.922, 1.399], [19.713, 1.937], [20.223, 1.112], [19.43, 0.652], [19.368, -2.296]], [-1.5689, 0.0495, 37.487]], [[[19.366, -2.387], [20.167, -2.846], [19.684, -3.696], [18.902, -3.205], [16.137, -4.406], [15.754, -4.431], [16.503, -1.188], [18.152, -2.192], [19.37, -2.176]], [-0.6861, 1.4983, 24.7397]], [[[15.857, 2.928], [16.145, 2.927], [16.117, 2.727], [19.041, 1.409], [19.082, 0.878], [15.719, -0.851], [15.462, -0.799], [15.468, -0.687], [14.647, 0.214], [15.896, 1.168], [14.177, 2.963], [15.168, 2.944], [15.217, 3.315]], [-0.7508, -1.5423, 23.3805]], [[[-11.469, -0.721], [15.666, -0.678], [16.611, -1.254], [15.907, -4.301], [16.416, -4.284], [16.047, -4.446], [16.105, -5.309], [15.15, -5.446], [15.057, -4.674], [10.767, -4.668], [10.768, -4.756], [5.333, -5.111], [2.932, -2.74], [1.259, -3.862], [-0.315, -5.389], [-2.493, -5.398], [-2.494, -6.108], [-3.363, -6.111], [-3.363, -5.402], [-6.133, -5.43], [-6.133, -6.13], [-6.962, -6.13], [-6.963, -5.441], [-9.763, -5.456], [-9.762, -5.527], [-10.621, -5.558], [-10.621, -5.452], [-11.525, -5.472], [-11.525, -5.016], [-12.702, -5.042], [-12.729, -3.549], [-14.088, -3.581], [-14.095, -3.51], [-11.418, -3.002]], [-0.0093, 1.4693, 14.2119]], [[[2.731, -2.731], [2.611, -10.986], [-0.326, -10.985], [-0.242, -5.388], [-0.489, -5.391], [1.183, -3.768]], [1.4016, 0.016, 6.9457]], [[[2.946, -2.586], [5.379, -4.987], [5.881, -4.954], [5.702, -8.407], [5.509, -8.404], [5.516, -10.988], [2.491, -10.986], [2.61, -2.812]], [-1.4038, 0.0566, 14.5495]], [[[-11.466, -0.841], [-11.578, 4.089], [-11.353, 4.089], [-11.353, 3.765], [-10.666, 3.759], [-10.677, 4.458], [-9.805, 4.473], [-9.792, 3.783], [-6.979, 3.824], [-6.991, 4.514], [-6.13, 4.531], [-6.117, 3.841], [-3.315, 3.874], [-3.327, 4.574], [-2.477, 4.582], [-2.466, 3.882], [-0.445, 3.914], [1.524, 1.922], [1.849, 2.079], [2.872, 1.358], [5.215, 3.763], [5.275, 3.092], [10.079, 3.026], [10.076, 3.704], [10.946, 3.708], [10.949, 3.027], [14.347, 2.96], [16.075, 1.154], [14.824, 0.198], [15.59, -0.643], [15.582, -0.799]], [-0.0047, -1.478, 11.9635]]];

// BAG-voet en afzonderlijke vlakke kappen voor schip, dwarspand, koor en aanbouw.
solids.push(prism(footprint,BASE,3.1));
for (const [outline,plane] of roofs) solids.push(roofed(outline,[plane]));
// Zes geledingen van de onversneden torenschacht; hoogte AHN, achthoekige spits geschat naar foto's.
const tc=[-15.15,-0.55]; solids.push(prism(rect(-18.1,-11.9,-3.65,2.55),BASE,25.35));
solids.push(loft([[24.9,oct(tc,5.6)],[31.5,oct(tc,0.9)]]));
let all=Manifold.union(Manifold.union(solids).decompose().filter(part => part.volume()>1));
const cuts=[];
for(const side of [0,90,180,270]) for(const shift of [-0.85,0.85]) cuts.push(niche(tc,side,3.1,shift,0.9,20,22.2,0.4));
cuts.push(niche(tc,180,3.1,0,1.2,0,2.4,0.4));
for(const x of [-8.0,-4.7,-1.4]) for(const [angle,d] of [[90,4.55],[270,5.9]]) cuts.push(niche([x,0],angle,d,0,1.1,2.0,5.2,0.4));
// Grote spitsboogvensters in de kopgevels van het dwarspand en in de koorsluiting.
cuts.push(niche([2.5,0],270,10.87,0,2.1,2.2,7.2,0.4));
cuts.push(niche([2.5,0],90,8.75,0,2.1,2.2,7.2,0.4));
cuts.push(niche([0,0],0,19.8,0,2.0,2.1,6.0,0.4));
all=all.subtract(Manifold.union(cuts));const nodes=[[`building:NL.IMBAG.Pand.0654100000027577`,all]];
const META={name:"Johannes de Doperkerk 's-Heer Abtskerke",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0654100000027577"],plate:false,description:"Kruiskerk met schip, driezijdig gesloten koor, dwarspand, lage aanbouw en westtoren met achthoekige spits.",realWorld:{groundNapM:1.3,towerTopM:31.5},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/9974","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0654100000027577","https://www.kerksheerabtskerke.nl/kerkgebouw.php","https://commons.wikimedia.org/wiki/Category:Kerk_Johannes_de_Doper_(%27s-Heer_Abtskerke)","PDOK AHN DSM/DTM 0,5 m"]};
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

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
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


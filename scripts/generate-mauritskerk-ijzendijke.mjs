import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "mauritskerk-ijzendijke");
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

const SLUG="mauritskerk-ijzendijke";
const ORIGIN=[31475,371800], X_AXIS=[0.947,0.32], BASE=-0.5;
const GROUND_SAMPLES=[[-22,-12],[-22,12],[-4,14],[10,14],[23,10],[18,-20]];
const solids=[];
const footprint=[[-9.86, 8.231], [-4.091, 8.222], [-4.087, 9.08], [-3.044, 9.076], [-3.048, 8.189], [2.989, 8.162], [2.993, 9.085], [4.059, 9.082], [4.055, 8.211], [9.674, 8.186], [9.993, 8.936], [10.964, 8.526], [10.637, 7.754], [14.536, 3.736], [15.583, 4.205], [15.935, 3.346], [15.072, 2.926], [15.097, -2.466], [15.837, -3.003], [15.461, -3.931], [14.727, -3.553], [10.697, -7.36], [11.183, -8.105], [10.154, -8.496], [10.121, -15.942], [7.674, -15.931], [7.668, -17.107], [4.737, -17.093], [4.742, -15.892], [3.151, -15.884], [3.189, -7.719], [-3.132, -7.689], [-3.146, -8.531], [-4.262, -8.515], [-4.25, -7.727], [-10.133, -7.64], [-10.438, -8.426], [-11.272, -8.102], [-11.017, -7.446], [-15.346, -3.235], [-16.267, -3.57], [-16.593, -2.674], [-15.737, -2.364], [-15.572, 3.121], [-16.31, 3.464], [-15.861, 4.431], [-15.046, 4.051], [-10.92, 7.826], [-11.219, 8.598], [-10.193, 8.995]];
const roofs=[[[[7.659, -7.245], [7.628, -8.652], [7.052, -8.384], [7.044, -9.145], [6.161, -8.513], [6.938, -7.714], [6.941, -7.546]], [1.1393, 0.0118, 4.4511]], [[[-11.176, -7.687], [-11.088, -7.461], [-15.361, -3.305], [-15.797, -3.462], [-15.787, -3.198], [-10.145, 0.309], [-10.076, -2.05], [-10.513, -7.705]], [0.9733, 1.0878, 29.1807]], [[[3.771, -5.992], [3.878, -7.463], [3.127, -7.959], [3.129, -7.778], [-3.073, -7.749], [-3.087, -8.592], [-4.323, -8.574], [-4.311, -7.786], [-10.093, -7.701], [-10.404, -8.504], [-11.35, -8.137], [-11.13, -7.568], [-10.624, -7.582], [-10.196, -2.048], [-10.264, 0.263], [3.32, 0.143], [3.676, -4.7], [4.256, -5.436]], [0.0101, 1.1623, 19.5704]], [[[10.136, -8.042], [9.268, -8.921], [8.909, -8.239], [7.518, -8.201], [7.535, -7.427], [7.06, -7.626], [7.058, -7.763], [6.26, -8.584], [5.712, -8.192], [3.869, -8.965], [3.806, -8.099], [3.127, -8.08], [3.128, -7.815], [3.753, -7.402], [3.648, -5.95], [5.126, -4.257], [5.547, -2.693], [6.953, -1.651], [9.451, -6.307]], [-0.0057, 1.6068, 23.6028]], [[[7.01, -1.757], [5.652, -2.765], [5.234, -4.315], [4.175, -5.528], [3.559, -4.745], [3.2, 0.145], [3.732, 0.139], [6.373, -0.573]], [1.2927, 1.2566, 15.3763]], [[[7.966, -1.001], [8.319, -0.597], [15.151, -3.28], [15.163, -3.846], [14.738, -3.626], [10.774, -7.369], [11.274, -8.135], [10.214, -8.537], [10.214, -8.799], [9.67, -8.344], [9.996, -8.014], [9.342, -6.358], [6.855, -1.723], [7.355, -1.352], [7.494, -0.874]], [-1.1372, 1.1605, 31.4097]], [[[6.192, 3.233], [7.001, 1.955], [6.85, 1.551], [6.522, 1.683], [6.155, 1.605], [6.206, 1.443], [5.476, 1.1], [5.623, 0.826], [3.978, -0.051], [3.1, 0.026], [3.593, 7.376], [4.202, 7.747], [5.627, 3.266]], [1.1377, -1.2457, 16.2066]], [[[3.22, 0.025], [-10.261, 0.143], [-10.499, 8.273], [-4.151, 8.282], [-4.147, 9.141], [-2.983, 9.136], [-2.988, 8.249], [2.727, 8.224], [2.751, 7.891], [3.751, 7.955]], [-0.0132, -1.1688, 19.8421]], [[[6.948, 1.814], [6.123, 3.117], [5.537, 3.152], [4.134, 7.565], [3.583, 7.229], [3.622, 7.827], [2.64, 7.764], [2.606, 8.225], [2.929, 8.223], [2.933, 9.145], [4.12, 9.141], [4.116, 8.271], [9.634, 8.246], [9.754, 8.525], [9.931, 8.347], [10.239, 8.367], [8.061, 3.003], [7.405, 3.041]], [0.0259, -1.5991, 23.5459]], [[[4.683, -16.078], [4.682, -15.952], [3.091, -15.944], [3.128, -7.96], [3.917, -7.982], [3.977, -8.79], [5.728, -8.055], [7.046, -8.998], [6.967, -16.44], [4.988, -16.065]], [0.9792, 0.0083, 2.4388]], [[[6.847, -16.417], [6.934, -8.197], [7.512, -8.466], [7.52, -8.081], [8.982, -8.121], [9.298, -8.72], [9.755, -8.259], [10.215, -8.643], [10.181, -16.003], [7.734, -15.991], [7.731, -16.585]], [-1.0986, 0.0302, 17.149]], [[[-10.166, 1.022], [-10.141, 0.17], [-15.792, -3.343], [-15.771, -2.798], [-16.134, -2.443], [-15.795, -2.321], [-15.633, 3.084], [-15.962, 3.238], [-15.514, 3.647], [-11.14, 1.083]], [1.6698, -0.0377, 36.4962]], [[[7.732, -16.463], [7.727, -17.168], [4.677, -17.153], [4.683, -15.958], [4.996, -15.945]], [0.0086, 0.0321, 3.427]], [[[8.626, 0.964], [14.878, 3.746], [14.874, 3.952], [15.615, 4.285], [16.012, 3.316], [15.132, 2.888], [15.157, -2.435], [15.909, -2.981], [15.488, -4.012], [15.042, -3.783], [15.032, -3.363], [8.235, -0.693], [8.409, -0.494], [7.856, 0.379], [8.088, 1.181]], [-1.5946, -0.0047, 34.4429]], [[[8.629, 0.834], [6.739, 1.596], [7.324, 3.166], [7.982, 3.128], [10.106, 8.359], [10.981, 8.413], [10.707, 7.767], [14.55, 3.808], [14.993, 4.005], [14.999, 3.669]], [-1.086, -1.1477, 31.0825]], [[[-11.176, 0.965], [-15.569, 3.54], [-15.499, 4.329], [-15.057, 4.123], [-10.99, 7.842], [-11.158, 8.276], [-10.379, 8.272], [-10.162, 0.902]], [1.0246, -1.1383, 30.424]]];

// Langgerekte kerk met veelhoekige sluitingen, schilddakvlakken en zuidelijke aanbouw.
solids.push(prism(footprint,BASE,3));for(const [outline,plane] of roofs)solids.push(roofed(outline,[plane]));
// Achtzijdige gesloten lantaarn en bolbekroning boven de dakruiter.
const tc=[6.5,0];solids.push(prism(oct(tc,2.4),BASE,20.1));solids.push(loft([[20,oct(tc,2.4)],[23.8,oct(tc,2.4)],[24.3,oct(tc,2.8)],[25.4,oct(tc,2.8)],[26.1,oct(tc,3.2)],[27,oct(tc,2.5)],[28.05,oct(tc,0.9)]]));
let all=Manifold.union(Manifold.union(solids).decompose().filter(part=>part.volume()>1));const cuts=[];
for(const a of [0,90,180,270])cuts.push(niche(tc,a,1.2,0,0.9,21.6,23,0.3));
for(const x of [-9,-4,1])for(const [a,d] of [[90,8.5],[270,8.3]])cuts.push(niche([x,0],a,d,0,1.3,4.0,7.1,0.4));
// Vensters op de veelhoekige eindgevels.
for(const [x,y,a] of [[15.1,0,0],[12.8,5.7,45],[12.8,-5.5,-45],[-15.7,0,180],[-13.3,5.9,135],[-13.3,-5.4,225]])cuts.push(niche([x,y],a,0,0,1.4,4,8,0.35));
all=all.subtract(Manifold.union(cuts));const nodes=[[`building:NL.IMBAG.Pand.1714100000723117`,all]];
const META={name:"Mauritskerk IJzendijke",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["1714100000723117"],plate:false,description:"Langgerekte kerk met veelhoekige sluitingen, zuidelijke aanbouw en achtzijdige dakruiter met bolbekroning.",realWorld:{groundNapM:2.238,towerTopM:28.05},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/31532","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1714100000723117","https://commons.wikimedia.org/wiki/Category:Mauritskerk,_IJzendijke","PDOK AHN DSM/DTM 0,5 m"]};
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



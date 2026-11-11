import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "dorpskerk-aagtekerke");
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

const SLUG="dorpskerk-aagtekerke";
const ORIGIN=[24818,396978], X_AXIS=[0.832,0.555], BASE=-0.5;
const GROUND_SAMPLES=[[-25,-9],[-20,10],[-5,12],[5,12],[25,10],[25,-10]];
const solids=[];
const footprint=[[-8.238, -4.483], [-8.239, -5.188], [-8.635, -5.185], [-8.643, -7.412], [-12.026, -7.398], [-12.017, -5.192], [-12.456, -5.191], [-12.453, -4.5], [-12.856, -4.497], [-12.851, -2.87], [-14.097, -2.89], [-14.405, -3.198], [-14.977, -3.206], [-15.357, -2.827], [-15.37, -1.985], [-16.615, -2.005], [-16.611, -2.904], [-17.606, -2.905], [-17.608, -2.027], [-18.429, -2.03], [-18.431, -1.114], [-17.59, -1.111], [-17.596, 1.813], [-18.48, 1.811], [-18.481, 2.464], [-17.582, 2.465], [-17.582, 2.659], [-17.425, 2.66], [-17.427, 3.524], [-16.626, 3.524], [-16.623, 2.495], [-13.772, 2.502], [-13.774, 3.456], [-12.866, 3.458], [-12.876, 4.815], [-12.393, 4.82], [-12.398, 5.601], [-11.656, 5.606], [-11.651, 4.826], [-8.631, 4.848], [-8.635, 5.632], [-7.943, 5.636], [-7.938, 4.856], [-5.247, 4.875], [-5.253, 5.66], [-4.692, 5.664], [-4.686, 4.883], [-1.601, 4.905], [-1.606, 5.69], [-0.83, 5.694], [-0.825, 4.914], [2.202, 4.936], [2.198, 5.725], [2.88, 5.715], [2.868, 4.94], [3.275, 4.933], [3.269, 4.443], [4.449, 4.427], [4.468, 5.691], [12.127, 5.581], [12.097, 3.474], [20.502, 3.352], [20.505, 3.587], [21.362, 3.573], [21.363, 2.646], [21.134, 2.645], [21.137, 0.349], [22.775, 0.353], [22.777, -1.734], [21.081, -1.736], [21.083, -3.818], [21.347, -3.817], [21.349, -4.777], [20.474, -4.777], [20.473, -4.454], [9.233, -4.461], [9.232, -4.815], [8.563, -4.812], [8.564, -4.48], [3.075, -4.458], [3.073, -5.17], [2.275, -5.167], [2.277, -4.483], [-0.626, -4.471], [-0.629, -5.176], [-1.449, -5.173], [-1.446, -4.488], [-4.577, -4.477], [-4.579, -5.182], [-5.29, -5.179], [-5.289, -4.495]];
const roofs=[[[[21.141, -1.796], [21.143, -2.331], [20.766, -2.343], [20.823, -0.326], [21.894, 0.411], [22.835, 0.413], [22.837, -1.794]], [0.0219, -0.023, 5.7117]], [[[18.294, -0.822], [20.916, 2.984], [20.922, 3.203], [21.423, 3.191], [21.423, 2.586], [21.194, 2.585], [21.196, 0.41], [22.107, 0.411], [20.941, -0.391], [20.89, -2.219], [21.143, -2.211], [21.143, -3.758], [21.407, -3.757], [21.409, -4.837], [20.697, -4.837], [20.712, -4.276]], [-1.0762, 0.0079, 28.6518]], [[[3.199, 3.493], [2.97, 4.998], [3.335, 4.992], [3.329, 4.502], [4.39, 4.487], [4.408, 5.752], [12.188, 5.641], [12.157, 3.533], [12.321, 3.53], [12.493, 3.278]], [0.0032, -0.0021, 3.1244]], [[[4.871, 1.965], [5.288, 1.629], [6.853, 3.528], [12.262, 3.403], [12.174, 3.532], [20.443, 3.413], [20.446, 3.648], [21.054, 3.639], [21.035, 2.945], [18.398, -0.882], [2.987, -0.816], [2.784, -0.001], [2.649, 1.379], [3.52, 1.391], [3.181, 3.614], [4.756, 3.577]], [-0.0089, -0.7274, 8.4463]], [[[4.636, 3.58], [7.006, 3.525], [5.305, 1.461], [4.755, 1.904]], [-0.0193, 0.0585, 7.4361]], [[[-12.857, 2.493], [-13.061, 3.517], [-12.926, 3.518], [-12.936, 4.874], [-12.453, 4.879], [-12.459, 5.661], [-11.596, 5.666], [-11.591, 4.886], [-8.691, 4.907], [-8.695, 5.692], [-7.883, 5.696], [-7.878, 4.916], [-5.308, 4.935], [-5.313, 5.72], [-4.633, 5.724], [-4.627, 4.944], [-1.661, 4.965], [-1.661, 5.036], [-0.767, 5.217], [-0.765, 4.974], [2.141, 4.996], [2.137, 5.786], [2.941, 5.774], [2.929, 4.999], [3.092, 4.996], [3.659, 1.273], [2.782, 1.261], [2.91, -0.052], [-12.906, 0.101]], [-0.0191, -1.4543, 12.0699]], [[[-10.599, -6.059], [-11.939, -7.179], [-12.085, -7.185], [-12.077, -5.252], [-12.517, -5.251], [-12.513, -4.384], [-10.604, -5.852]], [1.2371, 0.0136, 17.7971]], [[[3.043, -2.953], [2.872, -1.288], [3.095, -1.307], [2.959, -0.696], [18.398, -0.762], [20.833, -4.239], [20.817, -4.837], [20.414, -4.837], [20.413, -4.514], [9.293, -4.521], [9.291, -4.875], [8.502, -4.872], [8.504, -4.54], [6.3, -4.531], [6.284, -3.671], [4.752, -3.283], [4.602, -4.525], [3.135, -4.519], [3.132, -5.23], [2.221, -5.227]], [-0.0026, 0.7598, 9.5518]], [[[4.646, -3.165], [6.402, -3.578], [6.42, -4.531], [4.482, -4.524]], [0.0237, -0.0102, 7.2441]], [[[-12.911, -2.931], [-12.969, -2.931], [-12.904, 0.221], [2.891, 0.069], [3.248, -1.441], [3.003, -1.42], [3.119, -2.83], [3.216, -2.827], [2.263, -5.464], [2.219, -4.543], [-0.566, -4.532], [-0.569, -5.237], [-1.509, -5.233], [-1.506, -4.548], [-4.518, -4.537], [-4.52, -5.243], [-5.35, -5.239], [-5.349, -4.554], [-8.178, -4.543], [-8.179, -5.248], [-8.575, -5.246], [-8.578, -5.991], [-9.182, -5.999], [-9.504, -5.098], [-10.664, -5.958], [-12.474, -4.565], [-12.916, -4.555]], [0.0087, 1.432, 11.9641]], [[[-10.719, -6.063], [-10.724, -5.853], [-9.445, -4.905], [-9.098, -5.877], [-8.577, -5.871], [-8.583, -7.472], [-9.124, -7.47], [-9.708, -6.769]], [-1.1011, -0.0464, -7.4887]], [[[-9.626, -6.68], [-8.968, -7.47], [-12.086, -7.458], [-12.084, -7.065], [-11.984, -7.061], [-10.663, -5.956]], [-0.0148, 1.5113, 13.4867]]];

// Schip, portiek en consistorie met afzonderlijke vlakke daken uit 3D BAG.
solids.push(prism(footprint,BASE,2.6));for(const [outline,plane] of roofs)solids.push(roofed(outline,[plane]));
// Middeleeuwse westtoren met vier zware hoekberen en achtzijdige spits.
const tc=[-15.25,0.25];solids.push(prism(rect(-17.6,-12.9,-2.0,2.5),BASE,21.1));
for(const x of [-17.6,-12.9])for(const y of [-2,2.5])solids.push(loft([[BASE,rect(x-.5,x+.5,y-.5,y+.5)],[16.5,rect(x-.5,x+.5,y-.5,y+.5)],[17.3,rect(x-.2,x+.2,y-.2,y+.2)]]));
solids.push(loft([[20.8,oct(tc,4.4)],[27.4,oct(tc,0.9)]]));
// Achthoekige traptoren tegen de zuidzijde.
solids.push(loft([[BASE,oct([-14.75,-2.5],1.5)],[14.8,oct([-14.75,-2.5],1.5)],[15.8,oct([-14.75,-2.5],0.9)]]));
let all=Manifold.union(Manifold.union(solids).decompose().filter(part=>part.volume()>1));const cuts=[];
for(const a of [0,90,180,270])cuts.push(niche(tc,a,2.25,0,1.2,16.5,19.3,0.4));
cuts.push(niche(tc,180,2.35,0,1.0,0,2.1,0.4));
for(const x of [-10.3,-6.8,-3,-0.1,2])for(const [angle,d] of [[90,4.85],[270,4.5]])cuts.push(niche([x,0],angle,d,0,1.1,2,4.6,0.4));
all=all.subtract(Manifold.union(cuts));const nodes=[[`building:NL.IMBAG.Pand.0717100000021200`,all]];
const META={name:"Dorpskerk Aagtekerke",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0717100000021200"],plate:false,description:"Eenbeukig schip met zuidportiek, oostelijke consistorie en oudere westtoren met traptorentje en achtkantige spits.",realWorld:{groundNapM:1.17,towerTopM:27.4},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/28105","https://monumentenregister.cultureelerfgoed.nl/monumenten/28106","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0717100000021200","https://commons.wikimedia.org/wiki/Category:Dorpskerk,_Aagtekerke","PDOK AHN DSM/DTM 0,5 m"]};
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

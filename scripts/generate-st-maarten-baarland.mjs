import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "st-maarten-baarland");
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

const SLUG="st-maarten-baarland";
const ORIGIN=[50553,380980], X_AXIS=[0.995,-0.1], BASE=-0.5;
const GROUND_SAMPLES=[[-25,-12],[-25,10],[-5,12],[5,12],[25,10],[25,-15]];
const solids=[];
const footprint=[[-21.578, 1.504], [-21.575, 2.826], [-20.262, 2.823], [-20.261, 3.259], [-19.809, 3.257], [-19.806, 4.774], [-18.567, 4.772], [-18.57, 3.288], [-14.986, 3.278], [-14.983, 4.842], [-13.272, 4.838], [-13.276, 3.336], [-12.869, 3.334], [-12.866, 4.777], [-12.326, 4.787], [-12.345, 5.793], [-11.726, 5.792], [-11.729, 4.875], [-8.78, 4.868], [-8.778, 5.793], [-8.078, 5.792], [-8.08, 4.863], [-4.855, 4.854], [-4.853, 5.791], [-4.19, 5.791], [-4.192, 4.897], [-0.917, 4.888], [-0.913, 5.79], [-0.245, 5.791], [-0.248, 4.962], [3.058, 4.953], [3.06, 5.791], [3.506, 5.789], [3.503, 5.02], [6.764, 5.012], [6.765, 5.789], [7.441, 5.79], [7.441, 5.387], [7.961, 5.386], [7.958, 4.271], [18.363, 4.243], [18.6, 4.833], [19.055, 4.582], [18.802, 3.911], [21.476, 1.74], [21.916, 1.834], [22.041, 1.168], [21.585, 1.016], [21.577, -2.283], [22.199, -2.773], [21.862, -3.299], [21.378, -2.894], [18.803, -5.268], [18.801, -6.436], [18.087, -6.434], [18.091, -5.562], [14.148, -5.553], [14.154, -12.431], [14.315, -12.43], [14.316, -12.71], [11.614, -12.712], [11.614, -12.983], [6.153, -12.986], [6.149, -5.982], [3.289, -6.003], [3.287, -6.686], [2.556, -6.697], [2.56, -6.008], [-0.611, -6.031], [-0.614, -6.774], [-1.328, -6.752], [-1.326, -6.037], [-4.359, -6.06], [-4.36, -6.796], [-5.078, -6.807], [-5.075, -6.063], [-8.312, -6.088], [-8.313, -6.852], [-8.747, -6.859], [-8.746, -6.092], [-12.331, -6.141], [-12.331, -9.374], [-15.119, -9.373], [-15.12, -6.141], [-12.449, -6.142], [-12.468, -5.403], [-14.791, -5.381], [-14.778, -4.018], [-18.464, -4.009], [-18.469, -5.339], [-19.645, -5.335], [-19.642, -4.041], [-20.172, -4.04], [-20.171, -3.605], [-21.528, -3.6], [-21.526, -2.404], [-20.188, -2.407], [-20.178, 1.5]];
const roofs=[[[[12.285, -5.745], [14.209, -5.896], [14.214, -12.37], [14.374, -12.369], [14.376, -12.77], [12.355, -12.772]], [-0.2672, -0.0036, 6.9389]], [[[-13.392, -4.6], [-13.568, -5.453], [-14.851, -5.44], [-14.845, -4.781]], [0.0504, 1.5071, 20.5571]], [[[-13.875, -9.433], [-15.179, -9.433], [-15.18, -6.081], [-13.751, -6.082]], [1.0596, -0.0353, 19.0931]], [[[11.376, -5.884], [11.511, -5.685], [12.405, -5.755], [12.475, -12.772], [11.674, -12.772], [11.674, -13.043], [8.834, -13.044], [8.815, -6.614], [9.398, -6.702], [10.382, -5.647]], [-0.931, -0.0102, 15.0958]], [[[-12.134, -5.757], [-12.189, -6.2], [-12.271, -6.201], [-12.271, -9.434], [-13.995, -9.433], [-13.871, -6.082], [-12.51, -6.082], [-12.527, -5.422], [-12.194, -5.418]], [-1.0359, 0.0421, -9.3772]], [[[8.936, -6.632], [8.954, -13.044], [6.093, -13.046], [6.088, -6.196]], [0.9806, -0.0048, -1.8357]], [[[20.934, 0.843], [22.063, 1.376], [22.109, 1.128], [21.645, 0.973], [21.637, -2.254], [22.077, -2.601], [21.443, -3.027], [21.38, -2.974], [21.157, -3.178], [18.522, -1.252]], [-1.9591, 0.1428, 50.7715]], [[[18.615, -1.171], [21.247, -3.095], [19.106, -5.07], [18.505, -5.079], [17.953, -1.746]], [-1.006, 1.4466, 34.654]], [[[21.491, 1.804], [21.964, 1.906], [22.086, 1.254], [21.0, 0.741], [18.251, -1.645], [17.556, -0.807], [18.304, 4.259], [18.445, 4.608], [19.129, 4.61], [18.873, 3.931]], [-1.2681, -1.3193, 37.443]], [[[-9.119, -4.191], [-11.986, -4.547], [-12.108, -5.536], [-12.524, -5.542], [-12.526, -5.463], [-13.69, -5.451], [-13.338, -3.74], [-12.596, -3.797], [-12.91, -1.981], [-12.975, -1.961], [-12.836, -0.61], [16.837, -0.489], [17.654, -0.737], [18.342, -1.566], [18.082, -1.793], [18.607, -4.957], [19.239, -4.948], [18.863, -5.294], [18.846, -6.496], [18.027, -6.494], [18.031, -5.622], [14.208, -5.613], [14.209, -6.016], [11.572, -5.81], [11.429, -6.02], [10.422, -5.779], [9.443, -6.831], [6.088, -6.318], [6.042, -5.376]], [-0.0027, 1.6132, 16.8709]], [[[-4.299, -6.119], [-4.3, -6.855], [-5.138, -6.867], [-5.136, -6.124], [-8.252, -6.148], [-8.253, -6.911], [-8.807, -6.92], [-8.806, -6.153], [-12.31, -6.201], [-12.255, -5.76], [-12.315, -5.42], [-12.214, -5.418], [-12.093, -4.439], [-9.121, -4.07], [6.154, -5.265], [6.214, -6.041], [3.348, -6.062], [3.347, -6.746], [2.496, -6.757], [2.5, -6.068], [-0.551, -6.09], [-0.554, -6.836], [-1.388, -6.81], [-1.386, -6.098]], [-0.006, 1.0359, 14.1449]], [[[-0.976, 4.949], [-0.973, 5.85], [-0.184, 5.851], [-0.187, 5.022], [2.998, 5.013], [3.0, 5.851], [3.567, 5.849], [3.564, 5.08], [6.704, 5.072], [6.705, 5.849], [7.501, 5.85], [7.501, 5.447], [8.021, 5.446], [8.018, 4.331], [18.432, 4.303], [17.668, -0.867], [16.82, -0.61], [-12.851, -0.73], [-12.724, 0.539], [-13.008, 0.585], [-12.898, 0.745], [-12.693, 0.844], [-12.444, 3.326], [-14.015, 2.312], [-13.633, 4.473], [-13.213, 4.475], [-13.215, 3.396], [-12.929, 3.395], [-12.925, 4.836], [-12.387, 4.846], [-12.406, 5.853], [-11.666, 5.852], [-11.669, 4.935], [-8.84, 4.928], [-8.837, 5.853], [-8.018, 5.852], [-8.02, 4.923], [-4.915, 4.915], [-4.913, 5.851], [-4.13, 5.851], [-4.132, 4.957]], [0.004, -1.5059, 14.8651]]];

// Eenbeukig schip, koor met driezijdige sluiting en lage aanbouwen, volgens BAG-dakvlakken.
solids.push(prism(footprint,BASE,3));for(const [outline,plane] of roofs)solids.push(roofed(outline,[plane]));
// Grote westtoren met hoekberen, achthoekige traptoren en centrale naaldspits.
const tc=[-17,-0.7];solids.push(prism(rect(-20.4,-13.6,-4.1,2.7),BASE,24.3));
for(const x of [-20.4,-13.6])for(const y of [-4.1,2.7])solids.push(loft([[BASE,rect(x-.65,x+.65,y-.65,y+.65)],[14.5,rect(x-.65,x+.65,y-.65,y+.65)],[15.3,rect(x-.2,x+.2,y-.2,y+.2)]]));
solids.push(loft([[24.0,oct(tc,5.5)],[31.3,oct(tc,0.9)]]));
const stair=[-13.5,2.8];solids.push(loft([[BASE,oct(stair,2.5)],[25.5,oct(stair,2.5)],[27.7,oct(stair,0.9)]]));
let all=Manifold.union(Manifold.union(solids).decompose().filter(part=>part.volume()>1));const cuts=[];
for(const a of [0,90,180,270])for(const s of [-.7,.7])cuts.push(niche(tc,a,3.4,s,0.9,18.8,21.2,0.4));
cuts.push(niche(tc,180,3.4,0,1.2,0,2.3,0.4));
for(const x of [-11.7,-7.8,-3.9,0,3.9])for(const [a,d] of [[90,5.8],[270,6.7]])cuts.push(niche([x,0],a,d,0,1.3,2.1,5.3,0.4));
all=all.subtract(Manifold.union(cuts));const nodes=[[`building:NL.IMBAG.Pand.0654100000022396`,all]];
const META={name:"St. Maarten Baarland",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0654100000022396"],plate:false,description:"Eenbeukige kerk met driezijdig koor, aanbouwen en westtoren met spits en achthoekige traptoren.",realWorld:{groundNapM:1.98,towerTopM:31.3},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/9958","https://monumentenregister.cultureelerfgoed.nl/monumenten/9962","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0654100000022396","https://commons.wikimedia.org/wiki/Category:Sint_Maarten_(Baarland)","PDOK AHN DSM/DTM 0,5 m"]};
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

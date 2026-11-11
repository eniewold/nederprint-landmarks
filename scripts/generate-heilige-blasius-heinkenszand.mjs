import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "heilige-blasius-heinkenszand");
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

const SLUG="heilige-blasius-heinkenszand";
const ORIGIN=[46026,388225], X_AXIS=[0.76,0.65], BASE=-0.5;
const GROUND_SAMPLES=[[-25,-11],[-25,10],[-4,15],[10,13],[25,10],[25,-15]];
const solids=[];
const footprint=[[13.346, 7.845], [13.352, 4.873], [15.48, 4.876], [16.002, 5.7], [16.458, 5.487], [16.002, 4.77], [17.648, 2.887], [18.679, 3.344], [18.68, 2.849], [17.724, 2.426], [17.728, 0.371], [18.88, -0.173], [18.88, -0.585], [20.555, -1.374], [20.557, -1.903], [20.954, -1.903], [20.963, -6.837], [15.988, -6.845], [15.385, -6.562], [15.384, -5.525], [14.78, -5.526], [14.784, -8.359], [0.212, -8.382], [0.209, -5.734], [-0.238, -5.735], [-0.237, -6.61], [-0.81, -6.611], [-0.811, -5.732], [-4.592, -5.739], [-4.591, -6.584], [-5.202, -6.585], [-5.203, -5.806], [-5.829, -5.807], [-5.826, -8.146], [-13.897, -8.16], [-13.901, -5.742], [-14.793, -5.742], [-14.795, -5.381], [-14.093, -5.38], [-14.098, -2.771], [-16.011, -2.775], [-16.271, -0.611], [-18.905, -0.615], [-18.911, 2.784], [-16.161, 2.789], [-16.165, 4.994], [-14.189, 4.997], [-14.193, 7.719], [-14.876, 7.717], [-14.876, 8.129], [-14.062, 8.047], [-14.063, 9.088], [-13.691, 9.058], [-13.69, 8.135], [-9.661, 8.187], [-9.661, 9.088], [-9.174, 9.053], [-9.173, 8.156], [-5.12, 8.215], [-5.121, 9.09], [-4.611, 9.108], [-4.609, 8.174], [-0.665, 8.159], [-0.667, 9.088], [-0.184, 9.096], [-0.182, 8.193], [3.797, 8.245], [3.795, 9.09], [4.419, 9.142], [4.42, 8.215], [8.81, 8.193], [8.809, 9.089], [9.319, 9.117], [9.321, 8.235], [12.79, 8.275], [12.788, 9.091], [13.33, 9.089], [13.332, 8.252], [14.118, 8.251], [14.119, 7.846]];
const roofs=[[[[13.408, 6.506], [9.429, 6.573], [9.479, 8.297], [12.73, 8.334], [12.728, 9.151], [13.389, 9.148], [13.392, 8.312], [14.178, 8.311], [14.179, 7.787], [13.407, 7.785]], [-0.0096, -1.3304, 18.1124]], [[[9.297, -2.114], [9.209, -0.978], [9.282, 1.548], [15.828, 1.479], [16.348, 0.878], [16.168, -1.764], [16.209, -2.296]], [0.0042, 1.019, 12.9836]], [[[16.999, 3.721], [17.664, 2.96], [18.739, 3.436], [18.74, 2.81], [17.784, 2.387], [17.787, 0.534], [16.208, 0.58], [16.225, 0.837], [15.727, 1.413]], [-1.4403, -0.2308, 37.5807]], [[[14.692, -5.405], [14.729, -6.584], [14.841, -6.576], [14.844, -8.418], [0.152, -8.442], [0.149, -5.795], [0.002, -5.795], [-0.124, -5.424]], [0.019, 0.1177, 3.6333]], [[[9.287, -1.994], [16.2, -2.176], [16.322, -3.727], [9.113, -3.647], [9.355, -2.869]], [-0.0202, -1.3445, 4.5752]], [[[17.052, -2.222], [16.082, -2.209], [16.048, -1.765], [16.216, 0.7], [17.787, 0.654], [17.788, 0.409], [19.007, -0.167], [17.176, -1.263]], [-0.9147, 0.9464, 27.6561]], [[[16.487, -6.582], [15.442, -6.654], [15.325, -6.6], [15.324, -5.585], [14.84, -5.586], [14.842, -6.696], [14.613, -6.712], [14.576, -5.525], [9.56, -5.531], [9.407, -3.54], [16.72, -3.611], [16.549, -4.169], [16.752, -4.54]], [0.0053, 1.2461, 13.6614]], [[[-5.082, -5.431], [-5.426, -5.867], [-5.769, -5.867], [-5.766, -8.206], [-13.957, -8.22], [-13.96, -6.169], [-13.037, -6.115], [-12.731, -5.44]], [-0.0108, 0.0316, 3.5492]], [[[12.082, 4.999], [11.902, 5.086], [11.865, 5.006], [9.385, 5.077], [9.432, 6.693], [13.408, 6.626], [13.411, 4.962]], [0.0349, 1.302, 0.2325]], [[[13.412, 4.933], [15.447, 4.936], [15.98, 5.777], [16.545, 5.512], [16.077, 4.775], [17.083, 3.625], [15.834, 1.358], [9.279, 1.428], [9.389, 5.197], [11.789, 5.128], [11.843, 5.248], [12.111, 5.118], [13.41, 5.082]], [-0.0226, -1.0118, 16.2915]], [[[17.065, -1.19], [18.94, -0.067], [18.94, -0.547], [20.615, -1.336], [20.616, -1.843], [21.014, -1.843], [21.024, -6.897], [16.324, -6.904], [16.628, -4.564], [16.419, -4.183], [16.558, -3.729], [16.202, -3.726], [16.073, -2.089], [16.946, -2.1]], [-0.01, -0.003, 5.6568]], [[[-16.113, 0.322], [-14.881, 0.548], [-14.747, 1.408], [-14.079, 1.67], [9.402, 1.547], [9.329, -0.975], [9.476, -2.883], [9.274, -3.533], [9.527, -3.542], [9.68, -5.531], [0.043, -5.544], [0.129, -5.795], [-0.178, -5.795], [-0.178, -6.102], [-0.87, -6.146], [-0.871, -5.792], [-4.532, -5.799], [-4.531, -6.644], [-5.262, -6.645], [-5.263, -5.866], [-5.579, -5.867], [-5.33, -5.551], [-12.654, -5.56], [-12.958, -6.23], [-13.96, -6.289], [-13.961, -5.802], [-14.853, -5.802], [-14.855, -5.321], [-14.154, -5.32], [-14.158, -2.831], [-16.064, -2.835], [-16.324, -0.671], [-16.483, -0.672]], [0.0079, 1.0788, 13.8781]], [[[-18.971, 2.844], [-15.077, 2.758], [-15.55, 1.488], [-18.969, 1.579]], [-0.0681, -1.3649, 7.0772]], [[[-14.221, 4.8], [-14.402, 4.913], [-14.348, 5.055], [-14.25, 5.056], [-14.253, 7.659], [-14.936, 7.657], [-14.936, 8.196], [-14.122, 8.114], [-14.123, 9.153], [-13.631, 9.113], [-13.63, 8.195], [-9.721, 8.247], [-9.721, 9.153], [-9.114, 9.109], [-9.113, 8.217], [-5.18, 8.274], [-5.181, 9.148], [-4.551, 9.17], [-4.55, 8.234], [-0.725, 8.219], [-0.727, 9.147], [-0.124, 9.157], [-0.122, 8.254], [3.736, 8.304], [3.735, 9.145], [4.479, 9.207], [4.48, 8.274], [8.75, 8.253], [8.748, 9.146], [9.379, 9.18], [9.381, 8.296], [9.599, 8.299], [9.399, 1.427], [-14.057, 1.549], [-14.64, 1.321], [-14.656, 1.223], [-15.666, 1.522], [-15.201, 2.766], [-14.541, 2.738]], [-0.005, -1.0768, 17.166]], [[[-16.354, -0.671], [-18.965, -0.675], [-18.969, 1.699], [-15.641, 1.64], [-14.637, 1.342], [-14.776, 0.446], [-16.024, 0.216]], [0.0165, 1.4914, 3.8873]]];

// Pseudobasiliek met schip, zijbeuken onder één kap, driezijdig koor, zijapsiden en sacristie.
solids.push(prism(footprint,BASE,3));for(const [outline,plane] of roofs)solids.push(roofed(outline,[plane]));
// Twee achtkantige traptorens aan weerszijden van de westelijke voorgevel.
for(const y of [-1.7,3.9])solids.push(loft([[BASE,oct([-15.25,y],2.2)],[15.9,oct([-15.25,y],2.2)],[19.15,oct([-15.25,y],0.9)]]));
let all=Manifold.union(Manifold.union(solids).decompose().filter(part=>part.volume()>1));const cuts=[];
for(const y of [-1.7,3.9])for(const a of [90,180,270])cuts.push(niche([-15.25,y],a,1.1,0,0.9,12.4,14.2,0.3));
for(const x of [-12,-8,-4,0,4,8])for(const [a,d] of [[90,8.2],[270,5.7]])if(x!==4 || a!==90)cuts.push(niche([x,0],a,d,0,1.1,2.6,5.8,0.4));
cuts.push(niche([0,1.1],180,18.9,0,1.8,0,2.8,0.4));
for(const cut of cuts)all=all.subtract(cut);const nodes=[[`building:NL.IMBAG.Pand.0654100000046309`,all]];
const META={name:"Heilige Blasius Heinkenszand",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0654100000046309"],plate:false,description:"Pseudobasiliek met twee achtkantige westtorens, koor, zijapsiden en sacristie.",realWorld:{groundNapM:1.3,towerTopM:19.15},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/9991","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0654100000046309","https://www.dbnl.org/tekst/sten009monu09_01/sten009monu09_01_0041.php","https://commons.wikimedia.org/wiki/Category:Sint_Blasiuskerk,_Heinkenszand","PDOK AHN DSM/DTM 0,5 m"]};
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






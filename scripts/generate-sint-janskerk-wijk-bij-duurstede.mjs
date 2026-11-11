import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-janskerk-wijk-bij-duurstede");
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

const SLUG="sint-janskerk-wijk-bij-duurstede";
const ORIGIN=[152166,442690], X_AXIS=[0.988,-0.153], BASE=-0.5;
const GROUND_SAMPLES=[[-40,-15],[-40,15],[-15,20],[0,20],[20,20],[30,-15]];
const solids=[];
const footprint=[[21.869, 16.866], [21.739, 3.812], [37.667, 2.172], [37.085, -2.373], [21.691, -0.742], [21.693, -5.073], [22.231, -5.534], [22.227, -6.152], [21.445, -6.955], [21.239, -6.954], [21.23, -10.378], [21.764, -10.79], [22.181, -10.833], [22.553, -11.231], [22.531, -11.748], [22.18, -12.09], [21.619, -12.077], [21.514, -16.445], [22.673, -16.466], [22.637, -18.505], [21.533, -18.479], [21.51, -19.038], [20.194, -19.034], [20.199, -17.715], [13.412, -17.647], [13.411, -18.807], [12.094, -18.805], [12.139, -17.652], [10.84, -17.622], [10.889, -16.349], [12.198, -16.4], [12.243, -13.164], [8.167, -12.974], [8.18, -14.084], [7.153, -14.097], [7.141, -12.977], [3.964, -12.958], [3.944, -14.076], [2.917, -14.056], [2.936, -12.938], [-0.237, -12.881], [-0.258, -13.997], [-1.325, -13.98], [-1.306, -12.887], [-4.467, -12.83], [-4.487, -13.941], [-5.54, -13.922], [-5.52, -12.831], [-8.659, -12.774], [-8.679, -13.87], [-9.731, -13.851], [-9.71, -12.766], [-12.968, -12.708], [-12.988, -13.792], [-14.024, -13.773], [-14.004, -12.637], [-14.642, -12.625], [-14.941, -12.31], [-16.474, -12.269], [-16.769, -12.585], [-17.396, -12.578], [-17.389, -13.728], [-18.404, -13.733], [-18.397, -12.681], [-19.191, -12.661], [-19.205, -11.635], [-18.395, -11.626], [-18.349, -8.13], [-19.139, -8.134], [-19.157, -6.358], [-26.412, -6.397], [-26.403, -8.158], [-28.093, -8.167], [-28.101, -6.427], [-30.262, -6.41], [-30.28, -4.406], [-28.12, -4.387], [-28.089, -2.665], [-27.614, -2.046], [-27.313, -2.048], [-27.298, -0.008], [-27.596, -0.006], [-28.06, 0.633], [-28.09, 2.291], [-30.233, 2.301], [-30.225, 4.271], [-28.067, 4.262], [-28.061, 6.102], [-27.429, 6.1], [-27.442, 9.68], [-28.553, 9.683], [-28.55, 10.782], [-27.44, 10.78], [-27.437, 11.84], [-26.337, 11.836], [-26.339, 10.777], [-21.781, 10.763], [-21.777, 11.923], [-20.698, 11.921], [-20.702, 10.761], [-16.182, 10.748], [-16.172, 11.998], [-15.075, 11.989], [-15.085, 10.73], [-14.485, 10.75], [-14.103, 10.389], [-12.697, 10.313], [-12.255, 10.726], [-11.537, 10.719], [-11.528, 11.998], [-10.392, 11.992], [-10.4, 10.711], [-6.778, 10.726], [-6.803, 12.005], [-5.714, 12.026], [-5.691, 10.726], [-2.173, 10.71], [-2.154, 12.011], [-1.057, 11.996], [-1.073, 10.716], [2.498, 10.698], [2.498, 11.967], [3.614, 11.966], [3.613, 10.696], [7.336, 10.682], [7.326, 11.953], [8.422, 11.962], [8.433, 10.763], [12.472, 10.722], [12.488, 14.334], [11.159, 14.357], [11.182, 15.671], [12.505, 15.659], [12.529, 16.978], [13.843, 16.955], [13.801, 15.656], [14.571, 15.65], [14.574, 15.932], [17.645, 15.913], [17.643, 15.633], [20.559, 15.607], [20.56, 16.867]];
const roofs=[[[[20.138, -17.781], [21.606, -17.871], [21.567, -19.098], [20.133, -19.094]], [-1.1192, 0.0149, 40.9489]], [[[-0.178, -12.943], [-0.199, -14.058], [-1.386, -14.039], [-1.367, -12.946], [-4.408, -12.891], [-4.428, -14.002], [-5.601, -13.981], [-5.581, -12.889], [-8.6, -12.835], [-8.621, -13.931], [-9.792, -13.91], [-9.771, -12.825], [-12.909, -12.769], [-12.929, -13.853], [-14.085, -13.832], [-14.065, -12.696], [-14.668, -12.685], [-14.967, -12.37], [-16.448, -12.329], [-16.743, -12.646], [-17.336, -12.639], [-17.329, -13.787], [-18.464, -13.793], [-18.457, -12.739], [-19.25, -12.72], [-19.266, -11.576], [-18.454, -11.567], [-18.417, -8.685], [12.527, -9.163], [12.383, -13.041], [11.206, -13.015], [11.163, -13.101], [8.228, -13.035], [8.241, -14.143], [7.094, -14.158], [7.081, -13.037], [4.023, -13.019], [4.003, -14.137], [2.856, -14.115], [2.875, -12.997]], [0.0256, 1.3956, 28.4263]], [[[17.754, 15.285], [16.853, 15.213], [16.848, 15.977], [17.705, 15.972], [17.703, 15.692], [18.037, 15.688]], [-0.0034, -0.4516, 10.5842]], [[[12.669, 3.862], [-27.074, 6.975], [-27.642, 10.84], [-27.499, 10.84], [-27.497, 11.9], [-26.277, 11.896], [-26.279, 10.836], [-21.84, 10.823], [-21.837, 11.983], [-20.638, 11.981], [-20.642, 10.823], [-16.242, 10.809], [-16.231, 12.059], [-15.014, 12.048], [-15.024, 10.792], [-14.462, 10.811], [-14.077, 10.448], [-12.719, 10.374], [-12.278, 10.786], [-11.597, 10.779], [-11.588, 12.058], [-10.332, 12.051], [-10.34, 10.771], [12.697, 10.66]], [-0.006, -1.0286, 21.2171]], [[[16.734, -17.741], [13.472, -17.708], [13.471, -18.867], [12.032, -18.865], [12.077, -17.711], [10.778, -17.68], [10.832, -16.287], [12.139, -16.337], [12.182, -13.223], [11.062, -13.208], [11.067, -13.025], [11.133, -12.893], [12.267, -12.918], [12.402, -9.281], [12.292, -9.28], [12.363, -9.059], [11.302, -7.799], [16.403, -1.963], [16.275, -1.378], [17.054, -1.391]], [1.7977, -0.0509, -4.9101]], [[[12.497, -9.033], [12.418, -9.281], [-18.237, -8.808], [-17.797, -6.987], [11.308, -7.619]], [0.0079, 0.2489, 18.0725]], [[[37.162, -2.242], [21.487, -0.723], [21.487, 1.386], [22.05, 3.84], [37.734, 2.226]], [0.0513, 0.4628, 2.6488]], [[[-15.352, -1.049], [-17.378, 1.179], [-17.543, 2.447], [-15.912, 3.395], [-17.571, 3.638], [-17.228, 4.845], [-21.421, 3.3], [-21.684, 3.854], [-22.253, 3.461], [-23.31, 4.506], [-24.413, 3.362], [-25.011, 3.919], [-26.694, 4.389], [-27.092, 7.097], [12.639, 3.985], [16.973, -1.234], [17.076, -1.234], [17.051, -1.511]], [-0.0164, -1.453, 24.0076]], [[[-15.352, -0.929], [16.399, -1.38], [16.533, -1.996], [11.38, -7.891], [11.251, -7.738], [-17.825, -7.106], [-16.834, -3.006], [-16.875, -2.695]], [0.0178, 1.4834, 27.4368]]];

solids.push(prism(footprint,BASE,3.1));
for (const [outline,plane] of roofs) solids.push(roofed(outline,[plane]));
// Groot dwarspand, met de nok in noord-zuidrichting.
solids.push(roofed(rect(12.4,21.55,-17.65,15.62),ridgeU(17,24.2,1.8)));
// Onvoltooide westtoren: vierkante massieve schacht met vier zware hoekberen.
solids.push(prism(sq([-21.5,2],6.2),BASE,35));
for (const x of [-27,-16]) for (const y of [-3.5,7.5]) solids.push(prism(sq([x,y],1.35),BASE,38.4));
let all=Manifold.union(Manifold.union(solids).decompose().filter(part => part.volume() > 1)); for (const angle of [0,90,180,270]) for (const s of [-3,0,3]) all=all.subtract(niche([-21.5,2],angle,6.2,s,1.6,15,29,0.7)); const nodes=[[`building:NL.IMBAG.Pand.0352100000012296`,all]];
const META={name:"Sint-Janskerk Wijk bij Duurstede",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0352100000012296"],plate:false,description:"Onvoltooide vlakke westtoren, schip en resterend dwarspand; het verdwenen koor is niet gereconstrueerd.",realWorld:{groundNapM:5.502,towerTopM:38.4},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/39695","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0352100000012296","https://commons.wikimedia.org/wiki/Category:Grote_of_Johannes_de_Doperkerk_(Wijk_bij_Duurstede)","PDOK AHN DSM/DTM 0,5 m"]};
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




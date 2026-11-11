import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "buurkerk-utrecht");
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

const SLUG="buurkerk-utrecht";
const ORIGIN=[136645,455845], X_AXIS=[0.966,0.259], BASE=-0.5;
const GROUND_SAMPLES=[[-38,-8],[-38,14],[-20,-18],[0,-24],[30,-25],[34,20]];
const solids=[];
const footprint=[[-35.294, -11.626], [-35.146, -3.386], [-32.713, -3.36], [-32.71, -3.239], [-35.382, -3.152], [-35.321, 8.9], [-33.094, 8.86], [-33.095, 9.001], [-35.033, 9.019], [-34.977, 17.867], [-34.194, 17.821], [-34.155, 18.793], [-29.256, 18.653], [-29.205, 20.028], [-25.345, 19.962], [-25.424, 18.514], [-23.311, 18.501], [-23.228, 19.925], [-3.768, 19.591], [-3.527, 23.57], [-0.691, 23.468], [-0.384, 26.753], [5.173, 26.611], [5.174, 26.783], [9.294, 26.798], [9.27, 27.105], [9.769, 27.126], [9.796, 26.817], [14.325, 26.794], [14.595, 26.646], [14.45, 23.583], [32.177, 22.765], [31.329, -24.387], [28.911, -24.411], [28.879, -21.97], [17.915, -21.875], [17.876, -18.151], [4.742, -18.378], [4.777, -21.481], [3.394, -21.437], [3.404, -20.806], [4.164, -20.817], [4.191, -18.747], [-0.56, -18.686], [-0.587, -20.757], [0.173, -20.766], [0.165, -21.396], [-1.135, -21.381], [-1.096, -18.322], [-3.999, -18.406], [-4.048, -13.271], [-19.761, -13.326], [-19.761, -12.395], [-23.559, -12.392], [-23.564, -13.333], [-24.64, -13.334], [-24.642, -12.411], [-28.4, -12.408], [-28.4, -13.34], [-29.478, -13.341], [-29.474, -12.401], [-33.388, -12.396], [-33.388, -13.328], [-34.454, -13.323], [-34.452, -12.391], [-35.165, -12.387]];
const roofs=[[[[18.165, 16.407], [18.495, 14.849], [-4.043, 15.115], [-4.46, 16.344]], [0.0061, 0.0005, 13.3792]], [[[-9.226, 17.829], [-17.791, 17.52], [-18.457, 19.903], [-9.482, 19.75]], [-0.0168, -0.028, 3.6111]], [[[2.99, 25.448], [-0.686, 24.177], [-0.438, 26.814], [0.232, 26.797]], [-0.5171, -0.0571, 11.625]], [[[4.091, 26.289], [4.249, 24.989], [3.704, 24.965], [1.857, 25.869]], [0.0912, -2.1531, 61.1391]], [[[18.164, -14.931], [18.161, -15.443], [17.612, -16.029], [16.425, -18.237], [4.802, -18.437], [4.838, -21.552], [3.333, -21.496], [3.345, -20.745], [4.105, -20.756], [4.13, -18.806], [-0.5, -18.747], [-0.526, -20.697], [0.234, -20.707], [0.225, -21.457], [-1.203, -21.44], [-1.13, -20.825], [-1.155, -18.383], [-4.058, -18.468], [-4.091, -14.962]], [-0.0019, 1.3774, 38.2039]], [[[-25.573, 16.577], [-25.534, 18.103], [-24.752, 18.569], [-23.368, 18.562], [-23.284, 19.986], [-18.332, 19.901], [-17.376, 16.479], [-25.471, 16.505]], [-0.0104, -1.3983, 34.5396]], [[[12.476, 25.214], [13.687, 26.495], [13.825, 26.856], [14.384, 26.853], [14.386, 26.728], [14.658, 26.699], [14.507, 23.521]], [-0.8074, -0.0946, 19.6696]], [[[-33.612, 15.517], [-33.977, 14.777], [-34.039, 8.95], [-35.093, 8.959], [-35.045, 16.656], [-34.648, 16.654]], [-1.2219, -0.0053, -28.8076]], [[[-33.547, 15.917], [-4.088, 15.626], [-3.956, 15.234], [18.469, 14.97], [19.32, 10.949], [-30.059, 11.44], [-33.756, 15.496]], [-0.0103, -1.398, 34.5349]], [[[29.117, -21.563], [28.754, -21.662], [28.769, -22.029], [27.006, -22.014], [26.969, -17.969], [28.591, -17.787], [28.605, -18.123], [29.111, -18.155]], [1.4426, 0.0244, -32.0035]], [[[29.596, -18.305], [28.49, -18.236], [28.476, -17.921], [26.671, -18.123], [25.989, -18.081], [25.97, -16.941], [26.299, -16.945], [26.803, -7.784], [26.792, 0.669], [26.868, 1.415], [26.993, 19.177], [27.389, 19.171], [27.333, 23.048], [32.238, 22.822], [31.511, -17.582], [30.194, -17.739]], [-1.4424, 0.0319, 62.3748]], [[[23.327, -18.376], [23.302, -19.859], [22.198, -19.13], [22.223, -18.186], [22.885, -18.189], [22.878, -18.426]], [-0.5015, 1.1461, 47.77]], [[[8.775, 23.53], [5.114, 26.663], [5.114, 26.842], [9.229, 26.858], [9.205, 27.163], [9.824, 27.188], [9.851, 26.877], [13.953, 26.855], [13.79, 26.43], [12.589, 25.159], [11.388, 25.141], [9.283, 23.535]], [0.0124, -0.8695, 28.9121]], [[[4.106, 26.17], [2.037, 25.781], [-0.056, 26.804], [4.04, 26.701]], [-0.322, 0.0464, 5.1411]], [[[-3.824, 19.652], [-3.808, 19.916], [19.415, 19.969], [19.595, 19.362], [18.848, 18.591], [18.032, 17.03], [18.19, 16.288], [-4.419, 16.224], [-5.593, 19.683]], [0.0021, 1.4393, -10.069]], [[[-30.876, 9.792], [-31.054, 9.24], [-31.637, 8.874], [-33.155, 8.832], [-33.155, 8.942], [-34.159, 8.951], [-34.097, 14.806], [-33.699, 15.612], [-29.959, 11.509]], [1.4865, -0.0339, 63.8027]], [[[-23.664, 9.094], [-31.295, 8.884], [-30.986, 9.84], [-30.068, 11.56], [19.294, 11.07], [19.566, 9.787], [18.332, 7.403], [-23.126, 7.83], [-23.121, 8.214]], [0.011, 0.7539, 10.4305]], [[[-7.847, 17.989], [-7.766, 17.882], [-9.347, 17.825], [-9.603, 19.752], [-5.465, 19.681], [-4.9, 18.015]], [0.0126, 0.0879, 2.2628]], [[[-6.489, -11.937], [-7.181, -13.342], [-19.821, -13.387], [-19.821, -12.455], [-23.499, -12.452], [-23.504, -13.393], [-24.7, -13.394], [-24.702, -12.471], [-28.34, -12.468], [-28.34, -13.4], [-29.539, -13.401], [-29.534, -12.461], [-33.328, -12.456], [-33.328, -13.388], [-34.514, -13.382], [-34.512, -12.451], [-35.193, -12.446], [-35.343, -12.273], [-35.205, -3.326], [-34.106, -3.314], [-34.242, -10.085], [15.467, -10.219], [16.473, -12.014]], [0.0064, 0.0087, 13.457]], [[[17.791, 22.449], [18.548, 22.459], [18.247, 23.469], [23.361, 23.232], [22.937, 2.667], [18.223, 7.453], [19.44, 9.804], [17.906, 17.048], [18.749, 18.662], [19.46, 19.395], [19.014, 20.893], [18.297, 21.639]], [1.5076, -0.0211, -11.1644]], [[[-23.188, 2.763], [-23.125, 7.95], [18.321, 7.523], [22.961, 2.813], [22.894, 2.56], [6.011, 2.554]], [-0.0123, -1.5185, 27.8192]], [[[23.86, 19.145], [23.088, -10.402], [22.428, -10.465], [22.82, 2.833], [23.241, 23.238], [25.458, 23.135], [25.474, 21.186]], [-1.8643, 0.0483, 65.7889]], [[[26.052, -17.964], [27.089, -17.955], [27.126, -22.015], [23.145, -21.98], [23.216, -17.787]], [0.0098, 0.0109, 6.4787]], [[[26.613, 19.514], [25.354, 21.187], [25.338, 23.141], [27.454, 23.042], [27.511, 19.049], [26.618, 19.063]], [2.0282, 0.0821, -33.8524]], [[[24.116, 19.663], [25.415, 21.305], [26.733, 19.555], [26.738, 19.061], [25.025, 19.088]], [0.0122, -1.4363, 49.5819]], [[[23.334, -17.915], [23.325, -18.497], [22.755, -18.561], [22.795, -17.018], [22.254, -17.011], [22.432, -10.344], [22.971, -10.293], [23.741, 19.188], [24.191, 19.757], [25.061, 19.207], [27.113, 19.175], [26.988, 1.408], [26.912, 0.664], [26.923, -7.788], [26.412, -17.067], [26.092, -17.062], [26.11, -18.088]], [0.0344, -0.0012, 21.549]], [[[31.474, -19.634], [31.388, -24.447], [28.851, -24.471], [28.819, -22.029], [28.649, -22.028], [28.63, -21.571], [28.997, -21.471], [28.991, -18.147], [29.551, -18.182], [30.203, -17.565], [30.659, -19.667]], [-1.4312, 0.0189, 51.3804]], [[[-25.92, -3.279], [-25.913, -2.869], [-22.93, -2.879], [-23.017, -2.304], [17.97, -2.552], [19.421, -5.533], [19.524, -6.144], [-29.959, -5.762], [-31.663, -2.881], [-26.343, -2.867]], [-0.0061, -0.7803, 14.2148]], [[[-23.187, 2.883], [6.012, 2.674], [22.898, 2.68], [22.885, 2.188], [17.957, -2.672], [-22.999, -2.424], [-23.522, 1.045], [-23.21, 1.032]], [0.0092, 1.4816, 19.849]], [[[-26.63, 17.31], [-29.297, 19.162], [-29.263, 20.089], [-25.281, 20.021], [-25.361, 18.573], [-24.52, 18.568]], [-0.0241, -0.0741, 4.108]], [[[-25.413, 18.176], [-25.433, 16.625], [-17.534, 16.6], [-17.824, 17.639], [-8.0, 17.994], [-8.086, 18.107], [-4.941, 18.134], [-4.048, 15.506], [-33.473, 15.796], [-33.669, 15.401], [-34.702, 16.535], [-35.046, 16.536], [-35.036, 17.931], [-34.251, 17.884], [-34.213, 18.844], [-33.989, 18.883], [-29.313, 18.715], [-29.292, 19.305], [-26.625, 17.453]], [0.0047, 0.1284, 10.8373]], [[[-32.886, -3.71], [-32.545, -2.959], [-31.531, -2.868], [-29.85, -5.711], [-34.097, -10.205], [-34.364, -10.205], [-34.226, -3.315], [-33.808, -3.311]], [1.3401, 0.0155, 59.0364]], [[[18.167, -14.506], [18.163, -15.051], [-4.09, -15.082], [-4.107, -13.332], [-7.315, -13.342], [-6.563, -11.817], [16.405, -11.893], [17.309, -13.505]], [0.0018, -1.3367, -2.5511]], [[[19.416, -6.231], [19.306, -5.57], [17.86, -2.6], [22.89, 2.361], [22.377, -16.893], [22.919, -16.9], [22.881, -18.309], [20.941, -18.302], [20.52, -18.023], [20.511, -18.3], [16.288, -18.239], [17.514, -15.958], [18.041, -15.395], [18.047, -14.55], [17.21, -13.574], [15.562, -10.636]], [1.5117, -0.0415, -11.0737]], [[[20.411, -21.956], [17.856, -21.934], [17.816, -18.169], [20.515, -18.18]], [1.3839, -0.0401, -18.8803]], [[[20.291, -21.955], [20.406, -17.805], [20.977, -18.182], [22.343, -18.186], [22.319, -19.067], [23.304, -19.717], [23.265, -21.981]], [-1.2951, 0.0332, 37.2513]], [[[12.011, 24.723], [12.757, 24.077], [13.065, 24.877], [14.513, 23.64], [18.374, 23.463], [18.708, 22.341], [18.006, 22.332], [18.392, 21.714], [19.121, 20.956], [19.45, 19.849], [-3.816, 19.796], [-3.583, 23.632], [-0.745, 23.53], [-0.673, 24.308], [2.838, 25.522], [3.729, 25.087], [4.234, 25.109], [4.408, 23.679], [5.629, 23.671], [6.138, 24.282], [6.678, 23.795], [7.518, 24.764], [8.818, 23.651], [9.242, 23.655], [10.989, 24.988], [11.396, 24.072]], [0.0087, -1.4615, 47.5539]], [[[11.36, 23.858], [10.891, 24.913], [11.347, 25.261], [12.585, 25.279], [13.162, 24.796], [12.808, 23.874], [12.02, 24.557]], [-0.0133, 0.855, -14.2557]], [[[30.563, -19.791], [30.094, -17.63], [31.513, -17.461], [31.472, -19.754]], [-0.2255, 1.0777, 42.0799]], [[[3.919, 26.704], [5.114, 26.673], [5.117, 26.819], [7.609, 24.686], [6.688, 23.624], [6.151, 24.11], [5.685, 23.551], [4.302, 23.56]], [0.8163, 0.0699, -0.3198]], [[[19.543, -6.267], [15.624, -10.747], [15.396, -10.339], [-34.262, -10.204], [-29.951, -5.643], [19.504, -6.024]], [0.0098, 1.2728, 26.3974]]];
// Aaneengesloten BAG-voet met afzonderlijke, uit 3D BAG passende dakvlakken.
solids.push(prism(footprint,BASE,3.1));
for (const [outline,plane] of roofs) solids.push(roofed(outline,[plane]));
// Vrijwel vlakke vierkante toren en daarop de verspringende houten lantaarn.
const tc=[-29.25,3.0];
solids.push(prism(rect(-35.5,-23,-3.4,9.4),BASE,37.8));
solids.push(loft([[BASE,oct(tc,10.5)],[37.8,oct(tc,10.5)],[40.5,oct(tc,6.7)],[42.6,oct(tc,6.7)],[45.5,oct(tc,3.8)],[50.0,oct(tc,3.8)],[52.77,oct(tc,.9)]]));
const cuts=[];
for (const angle of [0,90,180,270]) cuts.push(niche(tc,angle,angle%180===0?6.25:6.4,0,2.3,22.5,34,.55));
const joined=Manifold.union(solids).subtract(Manifold.union(cuts));
const all=Manifold.union(joined.decompose().filter(part => part.volume() > 1)); const nodes=[[`building:NL.IMBAG.Pand.0344100000046743`,all]];
const META={name:"Buurkerk Utrecht",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0344100000046743"],plate:false,
 description:"RD (136645,455845), +X van toren naar oostgevel; brede hallenkerk met parallelle kappen en westtoren met lantaarn. Maaiveld NAP circa +5,02 m.",realWorld:{groundNapM:5.016,towerTopM:52.77},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/18353","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000046743","https://commons.wikimedia.org/wiki/Category:Exterior_of_Buurkerk,_Utrecht","https://www.openmonumentendagutrecht.nl/openstellingen/buurkerk-museum-speelklok/","PDOK AHN DSM/DTM 0,5 m"]};
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


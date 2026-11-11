import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "geboorte-van-de-heilige-johannes-de-doper-montfoort");
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

const SLUG="geboorte-van-de-heilige-johannes-de-doper-montfoort";
const ORIGIN=[124735,450820], X_AXIS=[0.932,0.362], BASE=-0.5;
const GROUND_SAMPLES=[[-30,-20],[-30,10],[-10,18],[10,20],[30,-12],[0,-20]];
const solids=[];
const footprint=[[23.572, 19.179], [24.693, 13.145], [17.958, 11.843], [15.934, 9.981], [15.645, 9.127], [16.137, 8.948], [16.632, 9.576], [17.227, 9.277], [16.913, 8.64], [18.286, 6.084], [19.068, 6.11], [19.094, 5.488], [18.278, 5.511], [17.023, 3.253], [19.587, 2.327], [21.36, -0.216], [21.441, -3.934], [19.54, -6.576], [22.134, -5.281], [25.982, -11.245], [23.074, -15.611], [13.881, -16.809], [13.849, -12.681], [12.274, -12.64], [12.276, -13.587], [12.535, -13.84], [11.994, -14.42], [11.175, -13.626], [4.854, -13.668], [4.836, -16.011], [5.642, -16.859], [5.177, -17.391], [4.309, -16.632], [0.154, -16.609], [0.151, -17.686], [-4.394, -17.787], [-4.367, -16.647], [-12.283, -16.622], [-12.303, -17.749], [-13.014, -17.767], [-13.014, -16.649], [-21.053, -16.618], [-21.895, -17.282], [-22.366, -16.74], [-21.525, -15.965], [-21.496, -12.05], [-24.378, -11.992], [-25.049, -12.557], [-25.436, -12.157], [-25.0, -11.616], [-25.001, -9.113], [-25.922, -9.435], [-27.08, -8.757], [-27.111, -7.554], [-27.306, -7.514], [-27.28, 3.798], [-25.78, 3.77], [-25.683, 6.785], [-24.251, 8.238], [-21.453, 8.22], [-21.39, 12.207], [-22.131, 12.91], [-21.68, 13.392], [-20.803, 12.703], [-12.847, 12.701], [-12.817, 13.821], [-12.085, 13.83], [-12.082, 12.695], [-4.253, 12.638], [-4.239, 13.817], [-3.505, 13.813], [-3.495, 13.634], [0.37, 13.592], [0.42, 12.662], [4.524, 12.644], [5.439, 13.387], [5.809, 12.855], [5.003, 12.235], [5.03, 9.915], [11.323, 9.934], [12.457, 10.418], [14.34, 10.401], [17.686, 12.978], [16.513, 19.046], [21.825, 20.073], [22.055, 18.887]];
const roofs=[[[[0.421, 0.961], [0.324, 3.886], [4.082, 3.806]], [-1.0395, -0.0398, 17.2173]], [[[-25.824, 4.218], [-25.746, 6.697], [-24.07, 4.672], [-23.819, 4.218]], [1.0908, -0.0799, 35.5406]], [[[16.54, 18.59], [16.443, 19.093], [21.873, 20.143], [22.102, 18.958], [23.62, 19.249], [24.763, 13.098], [17.921, 11.776], [16.659, 18.621]], [-0.0009, -0.0023, 8.0381]], [[[-25.802, -6.679], [-25.117, -6.766], [-24.394, -8.092], [-24.216, -8.093], [-24.686, -9.329], [-25.72, -8.753]], [-2.4207, 0.0423, -46.1104]], [[[-26.398, -6.604], [-25.682, -6.695], [-25.576, -9.377], [-25.928, -9.5], [-27.139, -8.792], [-27.162, -7.899]], [1.9573, 0.215, 67.7419]], [[[-16.702, -8.046], [-16.828, -7.691], [-16.847, -5.263], [-16.741, -5.139], [-16.054, -5.697], [-14.23, -7.769], [-15.715, -7.738]], [-1.0758, 0.0339, -1.13]], [[[19.293, 2.497], [19.625, 2.377], [21.419, -0.197], [21.46, -2.06], [16.633, -2.301], [16.509, -2.076]], [-1.0662, -0.6185, 34.3179]], [[[19.741, -6.399], [18.988, -6.51], [16.568, -2.184], [21.457, -1.94], [21.501, -3.953]], [-1.1273, 0.6127, 38.0925]], [[[16.537, -7.451], [15.598, -9.962], [12.029, -10.001], [12.106, -7.445], [14.181, -7.448], [14.899, -7.343], [15.016, -7.449]], [0.0061, -1.0303, -0.3596]], [[[19.82, -8.371], [18.48, -6.463], [19.839, -6.263], [19.73, -6.414], [19.869, -6.345], [20.42, -7.332], [20.506, -8.062]], [-0.1117, 0.2011, 11.7708]], [[[22.155, -5.204], [22.651, -5.971], [22.443, -6.002], [21.257, -8.96], [20.182, -8.644], [19.928, -8.19], [20.376, -7.988], [20.304, -7.37], [19.761, -6.399]], [0.4803, -1.1137, -10.8823]], [[[4.855, -16.669], [5.549, -16.675], [5.723, -16.857], [5.183, -17.475], [4.931, -17.256]], [-0.0476, 1.2177, 21.4655]], [[[-19.121, 3.364], [-17.43, 4.26], [-16.681, 4.243], [-16.635, 1.708], [-16.562, 1.553], [-17.019, 1.292], [-17.379, 1.575]], [1.1007, 0.0293, 35.0102]], [[[23.328, -12.776], [23.158, -13.026], [21.42, -12.83], [22.36, -10.919], [25.772, -11.31], [25.886, -11.496], [24.625, -13.39], [23.933, -13.856]], [-0.7285, 1.3561, 40.4445]], [[[18.311, -9.049], [18.124, -8.719], [18.18, -6.866], [18.843, -6.77], [19.931, -8.321]], [1.0781, -0.6938, -19.2592]], [[[21.155, -8.891], [22.357, -5.893], [22.579, -5.861], [26.054, -11.246], [25.813, -11.606], [25.7, -11.423], [22.357, -11.04]], [-0.946, -0.5421, 24.4665]], [[[-21.206, 13.097], [-20.782, 12.763], [-12.905, 12.761], [-12.876, 13.881], [-12.025, 13.89], [-12.022, 12.754], [-4.313, 12.698], [-4.299, 13.877], [-3.448, 13.873], [-3.438, 13.693], [0.427, 13.652], [0.477, 12.722], [4.501, 12.704], [4.499, 12.499], [-21.239, 12.582]], [-0.0161, -0.6372, 11.9092]], [[[-21.799, 8.282], [-21.434, 7.641], [-21.652, 4.218], [-22.469, 4.218], [-23.011, 3.205], [-23.849, 4.218], [-23.956, 4.218], [-24.17, 4.605], [-25.751, 6.516], [-25.743, 6.81], [-24.276, 8.298]], [0.1614, -0.5924, 15.5008]], [[[-21.772, 4.218], [-21.556, 7.613], [-21.938, 8.283], [-21.512, 8.281], [-21.451, 12.182], [-22.002, 12.704], [-21.111, 12.702], [-21.134, 12.348], [-17.349, 7.807], [-20.376, 4.201]], [1.4067, -0.0093, 41.0471]], [[[12.075, 9.143], [12.078, 9.397], [11.39, 10.028], [12.445, 10.479], [14.319, 10.462], [17.411, 12.965], [17.617, 13.021], [16.517, 18.708], [16.753, 18.769], [18.034, 11.824], [15.986, 9.947], [15.703, 9.06], [14.854, 9.08], [13.271, 8.303], [12.362, 9.136]], [-0.0203, 0.0181, 3.9233]], [[[-3.214, 3.96], [-0.18, 3.896], [0.453, 3.639], [0.541, 0.952]], [1.1245, 0.0317, 16.108]], [[[8.252, -7.438], [11.933, -7.444], [11.926, -7.142], [12.228, -7.424], [12.054, -13.167], [12.335, -13.162], [12.336, -13.562], [12.619, -13.838], [11.996, -14.506], [11.151, -13.686], [8.199, -13.706]], [-1.188, -0.0042, 26.23]], [[[-8.185, 1.375], [-8.184, 4.064], [-4.34, 3.984], [-5.34, 3.202]], [-1.0786, 0.0004, 7.9096]], [[[18.068, 5.012], [16.322, 5.453], [15.742, 5.455], [15.553, 5.578], [16.67, 8.555], [16.592, 9.16], [17.229, 9.145], [16.98, 8.641], [18.322, 6.145], [19.125, 6.172], [19.157, 5.427], [18.313, 5.45]], [-1.1262, -0.6605, 31.231]], [[[22.451, -14.391], [23.821, -14.597], [23.109, -15.667], [22.267, -15.777]], [-0.918, 0.9319, 43.8621]], [[[22.408, -14.411], [22.57, -12.839], [23.1, -12.899], [23.338, -12.548], [23.974, -13.684], [24.795, -13.136], [23.747, -14.707], [22.461, -14.514]], [-1.1683, -0.7348, 25.3942]], [[[8.724, 3.012], [8.157, 3.238], [8.27, 9.986], [11.311, 9.994], [11.511, 10.08], [12.199, 9.45], [12.143, 3.064], [11.944, 3.075], [11.574, 2.744], [11.46, 3.1], [9.349, 3.212]], [-1.1945, 0.0279, 26.162]], [[[1.036, -12.023], [3.79, -8.624], [3.713, -8.046], [4.434, -8.072], [4.434, -8.33], [4.564, -8.442], [4.499, -9.512], [4.432, -9.551], [4.428, -12.529], [4.972, -16.652]], [-1.4234, -0.0128, 17.8804]], [[[-14.988, 2.454], [-16.667, 1.493], [-16.754, 1.68], [-16.801, 4.246], [-14.063, 4.188]], [-1.0885, -0.0107, -1.468]], [[[-8.4, 1.238], [-9.474, 2.087], [-10.797, 4.119], [-8.064, 4.062], [-8.065, 1.452]], [1.0841, -0.0003, 25.4824]], [[[11.275, -2.014], [16.494, -2.1], [16.58, -1.958], [19.115, -6.491], [18.691, -6.554], [18.92, -6.88], [18.297, -6.971], [18.278, -7.574], [14.97, -7.569], [14.86, -7.47], [14.19, -7.568], [12.101, -7.564], [12.155, -5.823], [11.894, -5.804], [11.87, -4.771], [10.649, -3.669]], [-0.0476, 1.2166, 21.449]], [[[1.18, 7.744], [-17.455, 7.747], [-21.257, 12.308], [-21.231, 12.702], [4.38, 12.62], [4.381, 12.704], [4.503, 12.704], [5.451, 13.474], [5.891, 12.842], [5.064, 12.205], [5.078, 10.965], [4.194, 11.304]], [-0.0029, -1.1845, 25.6578]], [[[4.362, 11.368], [5.077, 11.094], [5.089, 9.975], [8.39, 9.986], [8.276, 3.19], [7.2, 3.62], [4.251, 3.682]], [1.197, -0.0023, 6.5509]], [[[15.679, 5.575], [16.337, 5.573], [18.129, 5.12], [17.632, 4.226], [17.424, 4.36], [16.446, 3.054]], [-1.1241, 0.7403, 23.4737]], [[[12.813, 3.029], [12.738, 3.499], [12.026, 3.351], [12.047, 5.712], [15.644, 5.662], [15.811, 5.553], [16.536, 3.173], [16.291, 2.846]], [0.0093, 1.0854, 3.7074]], [[[4.88, -8.535], [5.108, -7.433], [7.683, -7.438], [6.544, -8.537]], [-0.1385, 1.36, 26.7486]], [[[4.904, -8.415], [6.496, -8.417], [7.51, -7.438], [8.372, -7.438], [8.319, -13.705], [4.914, -13.727], [4.896, -15.987], [5.664, -16.795], [5.092, -16.792], [4.829, -16.484], [4.308, -12.537], [4.312, -9.481], [4.383, -9.441], [4.45, -8.35], [4.853, -8.669]], [1.19, -0.0168, 6.4164]], [[[4.315, -7.432], [4.617, -7.318], [4.611, -7.433], [5.23, -7.433], [4.932, -8.884], [4.314, -8.385]], [-0.0101, 2.0388, 33.1373]], [[[4.568, -5.952], [8.334, -5.689], [8.373, -7.558], [4.483, -7.552]], [1.1882, 0.142, 13.5902]], [[[15.752, -10.203], [15.732, -10.082], [15.483, -9.927], [16.409, -7.451], [18.281, -7.454], [18.245, -8.689], [18.909, -9.856], [18.895, -10.028], [17.833, -10.167], [16.988, -9.953], [16.298, -9.957]], [-1.0648, -0.6282, 20.2769]], [[[15.841, -10.009], [16.383, -13.216], [13.792, -13.258], [13.789, -12.739], [12.334, -12.702], [12.335, -13.282], [11.93, -13.289], [12.033, -9.881], [15.573, -9.842]], [-0.0051, 1.0842, 20.751]], [[[16.007, -15.037], [15.245, -15.977], [15.366, -16.677], [14.167, -16.833], [14.163, -16.656], [13.82, -16.697], [13.791, -13.138], [14.753, -13.122], [14.916, -14.069]], [1.4578, -0.0276, -16.5767]], [[[19.935, -14.013], [20.396, -14.082], [20.088, -14.622], [19.76, -14.743], [15.904, -15.106], [14.805, -14.13], [14.632, -13.124], [17.022, -13.086], [17.182, -12.809], [17.68, -13.075], [19.36, -13.048], [19.605, -12.931]], [0.0914, -1.5679, -17.9883]], [[[16.713, 9.157], [16.793, 8.541], [15.667, 5.542], [12.046, 5.592], [12.076, 9.263], [12.409, 9.255], [13.291, 8.447], [14.827, 9.2], [15.67, 9.181], [16.116, 9.019], [16.344, 9.309], [16.434, 9.163]], [-0.021, -1.0752, 16.2845]], [[[11.225, -5.636], [12.279, -5.711], [12.222, -7.583], [12.053, -7.425], [12.056, -7.564], [8.253, -7.558], [8.214, -5.698], [9.253, -5.626], [9.494, -4.465]], [-1.21, 0.0645, 32.9889]], [[[11.854, -0.818], [10.79, -3.635], [11.988, -4.716], [12.014, -5.813], [11.184, -5.753], [9.575, -4.664], [9.352, -5.74], [4.562, -6.073], [4.699, -3.484], [4.974, -2.146], [4.004, -2.145], [4.059, 1.499], [4.277, 1.956], [4.227, 1.976], [4.253, 3.802], [7.224, 3.74], [8.439, 3.255], [8.299, 3.076], [8.296, 2.799], [10.264, -1.022], [11.68, 0.397]], [1.2488, -0.1026, 12.5748]], [[[20.852, -13.024], [21.329, -13.016], [21.476, -12.715], [22.689, -12.853], [22.524, -14.455], [22.181, -14.472], [20.205, -14.175]], [0.7971, -0.9378, -21.6885]], [[[20.421, -16.018], [19.983, -14.564], [20.268, -14.063], [22.187, -14.351], [22.504, -14.336], [22.563, -14.45], [22.389, -15.761]], [1.1171, 0.5711, -7.1457]], [[[15.247, -16.692], [15.117, -15.944], [15.894, -14.986], [19.733, -14.625], [20.091, -14.494], [20.542, -16.002]], [-0.1783, 1.2991, 29.4355]], [[[8.176, 2.77], [8.18, 3.118], [8.323, 3.301], [8.729, 3.139], [9.334, 3.333], [11.549, 3.216], [11.632, 2.957], [11.901, 3.197], [12.144, 3.184], [12.124, 0.671], [10.233, -1.224]], [-1.2133, -0.0613, 32.6728]], [[[11.731, -0.804], [11.574, 0.29], [12.004, 0.721], [12.027, 3.474], [12.837, 3.642], [12.916, 3.144], [16.233, 2.969], [17.396, 4.522], [17.69, 4.331], [17.109, 3.286], [19.408, 2.455], [16.561, -2.222], [11.23, -2.133]], [-0.0879, -1.214, 16.8628]], [[[20.019, -12.732], [18.341, -10.815], [18.772, -10.073], [18.787, -9.884], [18.252, -8.944], [20.037, -8.14], [20.263, -8.543], [21.262, -8.836], [22.462, -10.982], [21.405, -13.135], [20.923, -13.143], [20.332, -14.194], [19.842, -14.121], [19.495, -12.984]], [0.9619, 0.5255, -6.5348]], [[[18.89, -10.109], [17.092, -13.205], [16.261, -13.218], [15.731, -10.081], [16.272, -9.837], [17.003, -9.833], [17.841, -10.045], [18.905, -9.906]], [-1.0786, 0.682, 33.4682]], [[[20.213, -12.772], [19.388, -13.168], [17.651, -13.195], [17.122, -12.913], [18.404, -10.705]], [0.0663, -0.0201, 2.7851]], [[[-8.049, -7.778], [3.835, -8.05], [3.916, -8.66], [1.143, -12.082], [-17.428, -12.077], [-20.637, -8.243], [-20.381, -8.035], [-17.938, -8.088], [-17.548, -7.846], [-17.235, -8.087], [-15.732, -7.618], [-14.338, -7.647], [-13.952, -8.085], [-11.792, -8.082], [-11.332, -7.709], [-8.401, -7.771], [-8.28, -7.545], [-8.052, -7.623]], [-0.0001, -1.166, 2.4302]], [[[-8.057, -7.33], [-8.275, -7.835], [-8.369, -7.892], [-10.806, -7.84], [-9.384, -6.13], [-8.476, -5.393], [-8.063, -6.926]], [1.0671, 0.0511, 25.7004]], [[[-0.205, 3.777], [-17.402, 4.139], [-19.034, 3.274], [-20.257, 4.529], [-17.455, 7.867], [1.181, 7.864], [3.961, 4.341], [4.381, 4.342], [4.371, 3.68], [0.448, 3.763], [0.457, 3.508]], [-0.0023, 1.1734, 7.2571]], [[[-1.458, -8.035], [-1.784, -7.116], [0.057, -5.94], [0.552, -7.407], [0.556, -8.078]], [1.0835, 0.0463, 16.4831]], [[[-21.515, -9.506], [-21.439, -12.113], [-24.357, -12.052], [-24.71, -12.351], [-25.061, -11.325], [-25.061, -9.198], [-25.694, -9.418], [-25.726, -8.613], [-24.749, -9.156], [-24.345, -8.093], [-23.935, -8.092], [-23.609, -7.463], [-21.562, -7.826], [-21.525, -9.124], [-21.592, -9.178]], [0.0117, 0.633, 14.9284]], [[[-21.726, -9.132], [-21.647, -9.068], [-21.683, -7.805], [-20.702, -7.978], [-17.322, -12.018], [-20.177, -15.367], [-20.961, -16.677], [-22.067, -17.493], [-22.109, -17.449], [-21.429, -16.652], [-21.431, -16.598], [-22.292, -16.591], [-21.585, -15.938], [-21.561, -12.052], [-21.634, -9.522]], [1.4, 0.0057, 40.8749]], [[[-21.101, -16.677], [-20.275, -15.297], [-17.428, -11.957], [1.142, -11.962], [5.251, -16.794], [4.992, -16.791], [5.068, -17.376], [4.286, -16.692], [0.214, -16.669], [0.211, -17.744], [-4.456, -17.848], [-4.428, -16.707], [-12.224, -16.682], [-12.244, -17.808], [-13.074, -17.828], [-13.074, -16.709]], [0.0006, 1.1983, 30.8547]], [[[4.379, 4.222], [3.903, 4.221], [1.075, 7.806], [4.158, 11.446], [4.481, 11.322]], [-1.4441, 0.0358, 17.7958]], [[[-16.787, -5.256], [-20.56, -8.335], [-20.766, -8.089], [-23.543, -7.597], [-23.862, -8.212], [-24.465, -8.212], [-25.193, -6.877], [-26.335, -6.733], [-26.79, -7.506], [-27.239, -7.497], [-27.313, -7.328], [-27.21, -1.974], [5.121, -2.026], [4.819, -3.499], [4.609, -7.465], [4.435, -7.552], [4.434, -8.192], [3.729, -8.166], [3.692, -7.884], [0.842, -5.581], [-1.639, -7.166], [-1.329, -8.038], [-5.624, -7.949], [-5.864, -7.109], [-8.149, -5.282], [-9.299, -6.216], [-10.652, -7.844], [-11.29, -7.83], [-11.75, -8.202], [-14.007, -8.205], [-16.138, -5.784]], [0.0024, 1.3637, 23.8563]], [[[0.85, -5.433], [3.805, -7.821], [3.851, -8.17], [0.436, -8.075], [0.432, -7.427], [-0.047, -6.007]], [-1.0751, 0.0306, 17.4276]], [[[-8.15, -5.128], [-5.759, -7.039], [-5.498, -7.951], [-8.168, -7.896], [-8.17, -7.71], [-8.328, -7.656], [-8.177, -7.306], [-8.183, -6.943], [-8.578, -5.475]], [-1.0736, 0.0182, 8.0844]], [[[4.124, -2.145], [-27.354, -2.094], [-27.34, 3.859], [-25.838, 3.831], [-25.82, 4.338], [-23.793, 4.338], [-23.032, 3.419], [-22.541, 4.338], [-20.431, 4.322], [-20.18, 4.622], [-17.008, 1.437], [-15.078, 2.541], [-14.197, 4.191], [-10.652, 4.116], [-9.385, 2.169], [-8.393, 1.385], [-5.409, 3.299], [-4.53, 3.988], [-3.017, 3.956], [0.477, 1.157], [3.892, 3.81], [4.373, 3.8], [4.348, 2.056], [4.441, 2.019], [4.179, 1.471]], [-0.002, -1.3749, 18.1654]], [[[-16.648, -5.215], [-16.727, -5.307], [-16.708, -7.67], [-16.587, -8.01], [-17.217, -8.207], [-17.363, -8.207], [-17.566, -7.999], [-17.904, -8.208], [-20.085, -8.209], [-20.504, -8.135], [-16.788, -5.102]], [1.0739, 0.0504, 35.0422]]];
// Aaneengesloten BAG-voet met afzonderlijke, uit 3D BAG passende dakvlakken.
solids.push(prism(footprint,BASE,3.1));
for (const [outline,plane] of roofs) solids.push(roofed(outline,[plane]));
// Achtzijdige vieringtoren en brede naaldspits, aangevuld uit AHN en foto's.
solids.push(loft([[BASE,oct([8.2,-2.35],8.0)],[28.1,oct([8.2,-2.35],8.0)],[41.12,oct([8.2,-2.35],0.9)]]));
const cuts=[];
for (const angle of [0,90,180,270]) cuts.push(niche([8.2,-2.35],angle,4,0,1.5,21.2,26.2,.5));
for (const x of [-18,-12,-6,0]) {
 cuts.push(niche([x,0],90,13.4,0,1.5,2.2,7.2,.5));
 cuts.push(niche([x,0],270,17.3,0,1.5,2.2,7.2,.5));
}
const joined=Manifold.union(solids).subtract(Manifold.union(cuts));
const all=Manifold.union(joined.decompose().filter(part => part.volume() > 1)); const nodes=[[`building:NL.IMBAG.Pand.0335100000319913`,all]];
const META={name:"Geboorte van de Heilige Johannes de Doper Montfoort",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0335100000319913"],plate:false,
 description:"RD (124735,450820), +X langs het schip naar koor; neogotische kruiskerk met vieringtoren, veelhoekig koor en aanbouwen. Maaiveld NAP circa +2,14 m.",realWorld:{groundNapM:2.139,towerTopM:41.12},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/512115","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0335100000319913","https://commons.wikimedia.org/wiki/Category:Geboorte_van_de_Heilige_Johannes_de_Doper","https://www.stichtingvriendenvanjohannesdedoperkerkmontfoort.nl/historie/100-jarig-kerkgebouw-1925/rijksmonument","PDOK AHN DSM/DTM 0,5 m"]};
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



import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "onze-lieve-vrouwe-ten-hemelopneming-houten");
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

const SLUG="onze-lieve-vrouwe-ten-hemelopneming-houten";
const ORIGIN=[139684,448745], X_AXIS=[0.929,0.370], BASE=-0.5;
const GROUND_SAMPLES=[[-30,0],[-30,12],[-15,18],[0,20],[20,8],[26,-9]];
const solids=[];
const footprint=[[-27.884, 10.923], [-27.491, 11.309], [-26.776, 10.582], [-26.346, 10.578], [-26.326, 13.029], [-26.758, 13.211], [-26.583, 13.625], [-26.169, 13.449], [-25.235, 14.369], [-25.4, 14.776], [-24.993, 14.942], [-24.826, 14.533], [-22.838, 14.517], [-22.828, 15.537], [-22.279, 15.532], [-22.288, 14.512], [-17.527, 14.474], [-17.519, 15.494], [-16.969, 15.489], [-16.977, 14.468], [-12.217, 14.43], [-12.208, 15.45], [-11.679, 15.445], [-11.687, 14.425], [-6.638, 14.385], [-6.617, 16.984], [-7.332, 17.711], [-6.932, 18.103], [-6.217, 17.376], [-2.908, 17.35], [-2.899, 18.37], [-2.348, 18.366], [-2.357, 17.346], [0.951, 17.318], [1.679, 18.034], [2.064, 17.641], [1.523, 17.109], [3.582, 17.091], [3.818, 17.323], [4.049, 17.088], [3.8, 16.842], [3.78, 14.321], [4.159, 14.319], [4.156, 13.869], [5.004, 13.007], [5.42, 13.175], [5.591, 12.757], [5.173, 12.59], [5.164, 11.43], [5.444, 11.428], [5.435, 10.307], [8.184, 10.285], [8.624, 11.325], [9.132, 11.111], [8.691, 10.071], [10.535, 8.195], [11.582, 8.619], [11.793, 8.1], [10.745, 7.677], [10.724, 5.055], [11.765, 4.616], [11.472, 3.926], [10.43, 4.366], [10.281, 4.218], [16.068, -1.506], [24.061, 6.589], [28.301, 2.355], [25.708, -0.477], [30.942, -5.519], [21.598, -15.215], [19.592, -13.418], [16.364, -16.517], [16.619, -17.156], [20.846, -21.454], [16.492, -25.739], [18.259, -27.537], [14.695, -31.042], [12.928, -29.245], [10.696, -31.44], [8.207, -31.421], [6.461, -29.646], [6.48, -27.156], [6.936, -26.707], [4.222, -23.947], [3.772, -23.945], [3.775, -23.615], [4.225, -23.618], [5.907, -21.962], [2.12, -18.112], [8.251, -12.083], [1.632, -5.212], [1.518, -5.323], [0.81, -4.605], [-2.51, -4.577], [-2.518, -5.596], [-3.079, -5.592], [-3.07, -4.572], [-6.39, -4.545], [-7.117, -5.26], [-7.503, -4.869], [-6.775, -4.154], [-6.753, -1.553], [-11.803, -1.512], [-11.812, -2.532], [-12.363, -2.528], [-12.354, -1.508], [-17.114, -1.469], [-17.121, -2.489], [-17.671, -2.485], [-17.664, -1.463], [-22.904, -1.421], [-23.629, -2.136], [-24.016, -1.743], [-23.289, -1.03], [-23.274, 0.702], [-24.072, -0.085], [-25.163, -0.075], [-25.934, 0.707], [-25.925, 1.797], [-25.142, 2.57], [-26.842, 2.583], [-27.569, 1.869], [-27.954, 2.261], [-27.227, 2.977], [-27.168, 10.196]];
const roofs=[[[[4.579, 12.932], [3.662, 11.924], [1.474, 11.366], [1.388, 14.011], [4.612, 13.253]], [-0.2699, -1.237, 24.7159]], [[[28.384, 2.357], [25.394, -0.93], [21.497, 3.411], [24.391, 6.344]], [-0.0128, -0.0058, 3.2198]], [[[16.596, -25.76], [17.899, -27.085], [17.692, -27.316], [18.139, -27.739], [14.694, -31.127], [12.931, -29.336]], [-0.0265, 0.0128, 5.2806]], [[[14.225, 0.295], [16.258, -1.916], [11.871, -1.924], [11.996, 2.718], [14.304, 0.372]], [-1.0059, -0.9833, 18.8167]], [[[16.164, -1.991], [14.058, 0.3], [14.219, 0.458], [16.068, -1.421], [21.268, 3.846], [25.477, -0.843], [16.336, -10.447], [12.11, -6.099]], [0.0015, 0.0085, 3.4756]], [[[8.144, -5.485], [8.875, -6.056], [12.055, -5.872], [18.529, -12.532], [16.132, -15.161], [7.4, -6.214]], [-0.8767, -0.857, 9.8962]], [[[-27.969, 10.923], [-27.49, 11.393], [-26.751, 10.641], [-6.361, 10.375], [-6.514, 10.173], [-6.624, 7.713], [-6.667, 7.771], [-6.657, 6.345], [-27.256, 6.68], [-27.228, 10.172]], [-0.0298, -1.6777, 28.9339]], [[[16.33, -1.994], [12.194, -6.185], [12.008, -5.995], [8.837, -6.178], [8.058, -5.57], [11.908, -1.804], [16.148, -1.796]], [-1.0094, 1.026, 22.6027]], [[[8.913, -21.689], [8.884, -22.037], [5.497, -25.329], [4.197, -24.007], [3.59, -24.004], [4.18, -23.572], [5.67, -22.112], [7.598, -21.706]], [1.3065, -1.3255, -31.7193]], [[[8.594, -25.355], [9.333, -21.803], [7.611, -21.826], [5.512, -22.268], [5.823, -21.961], [2.035, -18.112], [5.245, -14.955], [12.522, -22.328], [12.197, -22.882], [10.723, -23.119]], [0.8495, 0.8426, 18.9444]], [[[-6.745, 2.206], [-6.768, 5.077], [-6.566, 5.338], [-5.69, 3.362]], [2.0122, 0.1062, 29.1228]], [[[-5.209, 2.278], [-6.821, 2.301], [-5.743, 3.482]], [0.2398, 1.7183, 13.4735]], [[[-6.534, -4.513], [-6.701, -4.512], [-6.727, -0.815], [-7.208, 2.427], [-2.647, 2.362], [-2.661, -0.792]], [1.6573, -0.0047, 21.0175]], [[[6.417, -27.56], [6.42, -27.131], [6.851, -26.706], [5.413, -25.243], [8.768, -21.982], [8.792, -21.691], [9.481, -21.681], [8.751, -25.191], [6.619, -27.429]], [-1.2192, 1.2731, 47.7654]], [[[-2.72, -0.683], [1.097, -4.465], [1.28, -4.466], [1.287, -5.175], [0.785, -4.664], [-2.45, -4.637], [-2.458, -5.657], [-3.14, -5.652], [-3.13, -4.632], [-6.366, -4.605], [-6.698, -4.933], [-6.701, -4.392], [-6.582, -4.393]], [0.0252, 1.6944, 17.8802]], [[[8.243, 5.328], [7.664, 4.825], [7.08, 6.224], [10.805, 7.653], [10.785, 5.095], [11.843, 4.648], [11.504, 3.847]], [-1.571, -0.0066, 28.8372]], [[[1.059, 5.516], [1.825, 4.503], [1.092, 2.674], [1.089, 2.674]], [-1.926, 0.162, 18.2899]], [[[0.927, 17.378], [1.385, 17.828], [1.414, 16.943], [-2.474, 13.172], [-6.331, 17.221], [-6.26, 17.436], [-2.967, 17.41], [-2.958, 18.43], [-2.288, 18.425], [-2.297, 17.405]], [-0.0325, -1.6396, 38.1525]], [[[4.635, 13.468], [4.599, 13.132], [1.513, 13.858], [1.633, 10.18], [1.476, 10.039], [0.96, 10.048], [-2.566, 11.593], [-2.532, 13.283], [1.292, 16.992], [1.269, 17.713], [1.68, 18.119], [2.148, 17.64], [1.668, 17.168], [3.558, 17.151], [3.818, 17.408], [4.134, 17.088], [3.86, 16.816], [3.841, 14.381], [4.219, 14.379], [4.217, 13.893]], [-1.6597, 0.0379, 11.8917]], [[[6.952, 6.842], [7.238, 6.156], [7.126, 6.101], [0.434, 6.129], [0.334, 6.258], [1.591, 7.753], [1.524, 9.801], [1.192, 9.947], [1.511, 10.232], [1.47, 11.489], [3.597, 12.032], [4.463, 12.983], [4.526, 13.579], [5.019, 13.078], [5.144, 13.128], [5.543, 13.033], [5.669, 12.724], [5.233, 12.549], [5.224, 11.49], [5.504, 11.488], [5.496, 10.367], [8.145, 10.346], [8.592, 11.404], [9.211, 11.143], [8.762, 10.084], [8.932, 9.91], [8.642, 9.914]], [-0.0159, -1.6575, 28.6652]], [[[8.572, 10.035], [8.813, 10.032], [10.549, 8.266], [11.615, 8.697], [11.871, 8.067], [10.805, 7.636], [10.804, 7.524], [7.126, 6.113], [6.819, 6.85]], [-1.1846, -1.0148, 32.3118]], [[[16.534, -21.714], [16.638, -17.091], [20.931, -21.454], [20.509, -21.871], [20.412, -21.764]], [-1.2192, -1.1678, 8.7923]], [[[9.006, -28.692], [8.903, -28.442], [6.774, -27.627], [6.493, -27.387], [10.664, -23.007], [12.122, -22.772], [13.845, -19.82], [16.618, -17.067], [16.756, -17.211], [16.655, -21.681], [9.523, -28.552]], [1.1813, -1.222, -32.2188]], [[[-6.453, 14.265], [-6.567, 14.266], [-6.432, 14.748], [-6.317, 17.38], [-2.412, 13.281], [-2.447, 11.541], [-2.668, 11.638], [-6.058, 10.775], [-6.451, 10.256], [-6.631, 10.26]], [1.6582, -0.0291, 20.982]], [[[8.678, 2.273], [8.787, 2.442], [10.368, 1.24], [2.657, -6.339], [1.631, -5.296], [1.517, -5.408], [1.166, -5.052], [1.16, -4.465], [1.825, -4.472], [1.141, -2.56], [1.133, -1.77], [1.969, -1.538], [2.552, -2.201], [3.8, -1.031], [4.449, -0.851], [4.231, -0.627], [7.34, 2.289], [7.532, 2.287], [8.166, 1.787], [8.558, 2.274]], [0.0057, -0.0054, 3.3449]], [[[8.722, 2.341], [10.341, 4.498], [10.525, 4.376], [10.368, 4.22], [11.928, 2.773], [10.281, 1.155]], [-0.0125, 0.0022, 3.8858]], [[[-0.095, 2.379], [2.043, -0.061], [1.241, -0.583], [1.243, -0.714], [2.057, -1.638], [1.254, -1.861], [1.261, -2.538], [1.996, -4.593], [1.047, -4.584], [-2.781, -0.791], [-2.767, 2.363]], [-1.6445, 0.0095, 12.0456]], [[[0.581, 1.421], [-0.199, 2.294], [0.881, 2.728], [1.047, 2.566]], [-0.0216, 2.0959, 11.498]], [[[2.956, 0.675], [5.472, 2.312], [7.513, 2.287], [4.315, -0.713]], [-1.3408, 0.1666, 13.4546]], [[[1.641, 6.244], [7.192, 6.267], [7.76, 4.908], [7.577, 4.749], [8.883, 2.369], [8.743, 2.153], [8.615, 2.154], [8.185, 1.619], [7.49, 2.167], [5.507, 2.191], [3.069, 0.605], [1.356, 0.539], [0.492, 1.521], [1.697, 4.504]], [-0.0027, 1.6448, 8.2231]], [[[3.074, 0.726], [4.677, -0.913], [3.86, -1.139], [2.544, -2.373], [1.123, -0.76], [1.12, -0.519], [1.861, -0.036], [1.254, 0.655]], [-0.2306, 1.2523, 9.346]], [[[-6.729, 8.057], [-6.633, 10.216], [-6.128, 10.881], [-2.657, 11.765], [0.412, 10.419], [0.194, 10.182], [0.986, 10.168], [1.642, 9.88], [1.713, 7.711], [0.488, 6.255], [1.761, 6.243], [1.823, 4.307], [1.183, 5.153], [1.206, 2.957], [0.998, 2.445], [0.853, 2.588], [-0.121, 2.196], [-0.161, 2.259], [-5.341, 2.28], [-6.771, 5.507], [-6.789, 8.139]], [-0.012, -0.0038, 25.233]], [[[15.277, -15.92], [16.54, -17.314], [15.338, -18.506], [14.087, -17.225]], [-0.0267, -0.0393, 3.3652]], [[[14.321, -17.148], [13.633, -16.76], [8.816, -11.827], [8.535, -12.098], [3.017, -6.475], [7.509, -6.153], [16.213, -15.072]], [0.8994, 0.8736, 7.3312]], [[[8.994, -28.349], [9.171, -28.776], [7.276, -30.56], [6.4, -29.67], [6.418, -27.416], [6.585, -27.308], [6.837, -27.522]], [1.7336, 0.2206, 3.8025]], [[[10.281, -31.498], [8.181, -31.481], [7.192, -30.474], [9.028, -28.745], [8.96, -28.58], [9.536, -28.424]], [0.4109, 1.6245, 56.2136]], [[[9.426, -28.479], [16.571, -21.595], [20.465, -21.645], [20.595, -21.786], [16.576, -25.74], [16.68, -25.846], [13.015, -29.421], [12.927, -29.33], [10.72, -31.5], [10.157, -31.497]], [-1.1882, 1.2374, 60.3619]], [[[3.174, -6.464], [8.537, -11.929], [8.819, -11.658], [13.707, -16.664], [14.404, -17.057], [14.252, -17.223], [15.423, -18.421], [13.941, -19.894], [12.459, -22.435], [5.16, -15.039], [8.167, -12.082], [2.804, -6.489]], [-0.8404, -0.8253, 2.7233]], [[[2.912, -6.602], [2.573, -6.253], [11.841, 2.855], [12.113, 2.6], [11.992, -1.889], [7.512, -6.273]], [1.0098, -1.0378, -5.3366]], [[[-23.359, 2.537], [-23.305, 0.586], [-24.048, -0.145], [-25.189, -0.135], [-25.995, 0.683], [-25.985, 1.823], [-25.287, 2.511], [-26.823, 2.523], [-27.813, 2.032], [-28.039, 2.262], [-27.287, 3.002], [-27.256, 6.8], [-6.658, 6.465], [-6.651, 5.533], [-6.51, 5.214], [-6.648, 5.037], [-6.626, 2.299]], [0.0243, 1.6487, 7.9868]], [[[-23.338, 0.554], [-23.422, 0.47], [-23.482, 2.658], [-7.086, 2.425], [-6.607, -0.806], [-6.581, -4.513], [-7.221, -4.507], [-6.835, -4.128], [-6.814, -1.613], [-11.744, -1.572], [-11.753, -2.592], [-12.423, -2.587], [-12.414, -1.567], [-17.054, -1.529], [-17.061, -2.549], [-17.732, -2.544], [-17.724, -1.522], [-22.88, -1.481], [-23.357, -1.951]], [0.0099, 0.6372, 8.0341]], [[[9.537, 3.303], [9.639, 3.114], [9.44, 3.182], [8.818, 2.268], [8.714, 2.347], [7.426, 4.777], [8.222, 5.469], [10.329, 4.532], [10.433, 4.42]], [-1.2729, 0.9715, 20.9584]], [[[-26.386, 12.989], [-26.837, 13.18], [-26.614, 13.703], [-26.183, 13.52], [-25.305, 14.383], [-25.478, 14.809], [-24.96, 15.02], [-24.785, 14.593], [-22.897, 14.578], [-22.887, 15.598], [-22.218, 15.591], [-22.227, 14.572], [-17.586, 14.535], [-17.579, 15.554], [-16.908, 15.548], [-16.917, 14.528], [-12.277, 14.491], [-12.268, 15.511], [-11.618, 15.505], [-11.626, 14.484], [-6.698, 14.445], [-6.678, 16.959], [-7.417, 17.711], [-6.932, 18.188], [-6.148, 17.392], [-6.313, 14.729], [-6.409, 14.384], [-6.328, 14.383], [-6.511, 10.258], [-26.407, 10.519]], [-0.0101, -0.6235, 15.8486]]];
// Aaneengesloten BAG-voet met afzonderlijke, uit 3D BAG passende dakvlakken.
solids.push(prism(footprint,BASE,3.1));
for (const [outline,plane] of roofs) solids.push(roofed(outline,[plane]));
// Vieringtoren: stenen schacht, achthoekige galmgatenverdieping en naaldspits.
solids.push(prism(sq([-2.4,6.5],4.25),BASE,25.2));
solids.push(loft([[BASE,oct([-2.4,6.5],8)],[30,oct([-2.4,6.5],8)],[30.9,oct([-2.4,6.5],7.8)],[39.45,oct([-2.4,6.5],0.9)]]));
// Westelijke traptoren met spits, geschat naar de fotoverhoudingen.
solids.push(loft([[BASE,oct([-24.6,0.5],2.6)],[19.8,oct([-24.6,0.5],2.6)],[27,oct([-24.6,0.5],0.9)]]));
const cuts=[];
for (const x of [-20.0,-15.0,-9.8]) {
  cuts.push(niche([x,0],90,14.45,0,1.5,2.0,6.4,0.45));
  cuts.push(niche([x,0],270,1.5,0,1.5,2.0,6.4,0.45));
}
cuts.push(niche([0,6.5],180,27.2,0,2.0,2.2,9.2,0.45));
for (const angle of [0,90,180,270]) cuts.push(niche([-2.4,6.5],angle,4,0,1.7,25.5,28.2,0.45));
const joined=Manifold.union(solids).subtract(Manifold.union(cuts));
const all=Manifold.union(joined.decompose().filter(part => part.volume() > 1)); const nodes=[[`building:NL.IMBAG.Pand.0321100000006826`,all]];
const META={name:"Onze Lieve Vrouwe ten Hemelopneming Houten",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0321100000006826"],plate:false,
 description:"RD (139684,448745), +X langs schip naar koor; neogotische kruiskerk met vieringtoren, afzonderlijk westelijk traptorentje en zuidelijke aanbouwen. Maaiveld circa NAP +2,87 m.",realWorld:{groundNapM:2.872,towerTopM:39.45},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/22665","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0321100000006826","https://commons.wikimedia.org/wiki/Category:Onze_Lieve_Vrouwe_ten_Hemelopneming,_Houten","https://www.oudhouten.nl/recente-tijd/19e-eeuw/rk-kerk-houten/","PDOK AHN DSM/DTM 0,5 m"]};
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



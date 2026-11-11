import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-barbarakerk-nieuwegein");
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

const SLUG="sint-barbarakerk-nieuwegein";
const ORIGIN=[134963,446562], X_AXIS=[0.211,0.977], BASE=-0.5;
const GROUND_SAMPLES=[[-25,0],[-20,18],[0,20],[28,5],[28,-25],[0,-20]];
const solids=[];
const footprint=[[-0.05, -10.024], [-0.591, -10.031], [-0.602, -8.821], [-4.359, -8.856], [-4.381, -15.857], [-15.462, -15.875], [-15.329, -9.528], [-15.949, -8.884], [-15.444, -8.387], [-17.036, -6.737], [-17.963, -7.142], [-18.174, -6.685], [-17.324, -6.309], [-17.373, -4.377], [-18.354, -4.056], [-18.161, -3.473], [-17.16, -3.798], [-16.003, -2.628], [-18.331, -1.985], [-19.211, -2.585], [-19.576, -2.041], [-18.843, -1.543], [-20.823, 1.371], [-21.853, 0.883], [-22.099, 1.402], [-21.022, 1.912], [-21.052, 4.89], [-21.903, 5.424], [-21.588, 5.912], [-20.82, 5.422], [-19.097, 8.146], [-19.722, 9.013], [-19.211, 9.388], [-18.539, 8.45], [-15.963, 9.406], [-17.559, 10.36], [-18.263, 10.443], [-18.211, 10.965], [-17.591, 10.885], [-17.32, 13.181], [-18.136, 13.455], [-17.954, 14.027], [-17.129, 13.756], [-15.622, 15.257], [-15.979, 15.966], [-15.499, 16.205], [-15.125, 15.467], [-12.57, 15.476], [-12.573, 16.671], [-11.972, 16.68], [-11.978, 15.481], [-1.082, 15.502], [-1.102, 16.776], [-0.388, 16.777], [-0.367, 15.545], [0.764, 15.565], [0.773, 15.004], [-0.47, 14.981], [-0.402, 9.319], [5.076, 9.379], [5.059, 10.509], [5.813, 10.52], [5.826, 9.409], [11.09, 9.47], [11.081, 10.552], [17.892, 10.551], [17.853, 9.409], [19.015, 9.373], [20.439, 7.276], [21.613, 7.285], [22.187, 6.622], [22.61, 6.652], [22.651, 6.128], [23.285, 6.175], [23.338, 5.357], [22.494, 5.298], [22.763, 1.439], [23.399, 1.484], [23.449, 0.78], [22.744, 0.729], [22.879, -1.173], [23.542, -1.307], [23.435, -1.903], [22.54, -1.739], [21.507, -2.923], [21.509, -3.73], [21.19, -3.727], [21.16, -9.694], [21.734, -9.705], [21.716, -12.315], [24.164, -12.329], [24.143, -17.63], [23.742, -17.625], [23.716, -22.713], [11.544, -22.643], [11.615, -17.77], [9.84, -17.744], [9.889, -14.85], [11.389, -14.872], [11.423, -12.668], [10.061, -12.655], [10.151, -5.835], [5.662, -5.874], [5.691, -8.76], [-0.063, -8.815]];
const roofs=[[[[11.028, -17.822], [9.779, -17.803], [9.83, -14.79], [11.011, -14.806]], [0.0685, -0.0011, 7.9403]], [[[-19.539, 9.223], [-19.198, 9.473], [-18.531, 8.542], [-18.725, 8.264]], [1.2776, -0.001, 24.9896]], [[[16.898, 3.504], [-6.197, 3.428], [-6.355, 3.579], [-0.347, 9.645], [-0.343, 9.38], [5.015, 9.438], [4.998, 10.568], [5.873, 10.58], [5.885, 9.469], [11.03, 9.529], [11.02, 10.612], [17.274, 10.631], [17.954, 10.609], [17.915, 9.467], [18.411, 9.452], [16.867, 3.638]], [0.0054, -1.2134, 23.1874]], [[[16.853, 3.161], [16.743, 3.64], [18.288, 9.455], [19.073, 9.432], [19.079, 9.24], [20.455, 7.357], [19.508, 3.137]], [1.3116, -1.825, 11.1564]], [[[22.677, 3.534], [19.416, 3.273], [20.362, 7.487], [20.47, 7.336], [21.64, 7.345], [22.213, 6.684], [22.665, 6.716], [22.706, 6.192], [23.34, 6.239], [23.402, 5.301], [22.558, 5.243]], [-1.2748, -1.245, 59.6362]], [[[-16.388, 9.588], [-14.552, 9.638], [-13.76, 7.377], [-14.721, 4.504], [-15.098, 3.991], [-18.805, 8.359], [-18.606, 8.646], [-18.516, 8.521], [-16.062, 9.35]], [0.3824, -1.1877, 28.6879]], [[[-15.285, 15.311], [-15.019, 15.526], [-13.054, 15.535], [-12.475, 13.739], [-13.803, 12.742]], [0.0142, -1.3228, 30.3235]], [[[-17.777, 13.272], [-17.607, 13.411], [-17.687, 14.002], [-17.145, 13.824], [-15.695, 15.269], [-16.06, 15.993], [-15.472, 16.285], [-15.088, 15.527], [-14.829, 15.526], [-15.13, 15.282], [-13.679, 12.765], [-13.737, 12.206], [-17.433, 12.751], [-17.386, 13.14]], [0.8393, -0.8469, 35.5929]], [[[-14.383, 9.523], [-16.195, 9.474], [-17.579, 10.302], [-18.328, 10.39], [-18.265, 11.033], [-17.644, 10.952], [-17.419, 12.87], [-13.716, 12.324]], [1.0386, 0.501, 21.798]], [[[-21.103, 4.048], [-21.111, 4.857], [-21.987, 5.406], [-21.606, 5.994], [-20.838, 5.505], [-19.17, 8.144], [-19.806, 9.026], [-19.442, 9.294], [-14.955, 4.007], [-14.66, 3.475], [-15.345, 3.138]], [0.9717, -0.6877, 35.5437]], [[[-6.45, 15.552], [-1.143, 15.562], [-1.163, 16.836], [-0.329, 16.837], [-0.41, 14.98], [-0.344, 9.476], [-6.269, 3.496], [-6.374, 3.598]], [-1.2192, -0.0, 11.1647]], [[[20.105, 1.364], [17.28, 1.289], [16.825, 3.281], [19.412, 3.258], [19.444, 3.395], [20.149, 3.452]], [1.309, 1.384, -1.1699]], [[[22.825, 1.436], [20.809, 1.383], [20.121, 0.654], [19.983, 1.212], [20.029, 3.442], [22.669, 3.653]], [-1.4889, 1.4413, 54.8383]], [[[-15.214, -15.719], [-15.219, -15.935], [-15.523, -15.935], [-15.405, -10.23], [-14.616, -10.274], [-13.017, -11.72], [-12.981, -13.706]], [1.2786, -0.0004, 25.0021]], [[[-12.957, -3.148], [-6.447, 3.487], [-6.255, 3.486], [-6.213, -8.991], [-12.845, -9.025], [-12.092, -4.619]], [1.2119, -0.0056, 26.5219]], [[[-16.181, 2.718], [-15.738, 3.322], [-15.363, 3.263], [-14.757, 3.561], [-6.279, 3.486], [-12.864, -3.225], [-13.678, -3.003], [-16.297, -2.841], [-16.118, -2.659], [-17.165, -2.369]], [-0.0026, 1.205, 14.7026]], [[[-17.049, -2.401], [-18.32, -2.05], [-19.227, -2.668], [-19.659, -2.025], [-18.927, -1.527], [-19.105, -1.265], [-16.015, 2.944]], [0.3675, 1.1119, 20.19]], [[[-0.075, -8.959], [-0.661, -8.962], [-0.661, -8.882], [-6.333, -8.992], [-6.374, 3.246], [-6.206, 3.407], [0.379, -3.121]], [-1.2106, -0.0136, 11.2539]], [[[-13.1, -11.808], [-14.665, -10.391], [-15.407, -10.35], [-15.389, -9.515], [-15.136, -8.917], [-4.299, -8.861], [-4.302, -9.406], [-6.866, -11.794]], [0.0043, -1.4082, -8.1992]], [[[-4.301, -9.241], [-4.321, -15.917], [-5.049, -15.917], [-5.993, -14.539], [-6.964, -13.671], [-6.95, -11.708]], [-1.2937, -0.0141, -0.7838]], [[[-6.83, -11.674], [-6.844, -13.704], [-13.101, -13.74], [-13.138, -11.688]], [0.0013, -0.0232, 8.0327]], [[[-13.065, -13.62], [-6.881, -13.584], [-5.902, -14.46], [-4.903, -15.917], [-15.339, -15.935], [-15.333, -15.664]], [-0.0071, 1.4257, 27.7435]], [[[-15.604, 3.301], [-19.034, -1.37], [-20.844, 1.295], [-21.882, 0.803], [-22.179, 1.431], [-21.082, 1.95], [-21.104, 4.17]], [1.1637, 0.5274, 34.6024]], [[[11.125, -7.033], [12.781, -7.752], [12.945, -7.738], [12.975, -7.527], [13.559, -7.683], [15.755, -7.487], [16.229, -11.833], [14.101, -11.623], [10.996, -12.366], [10.998, -12.724], [10.001, -12.714], [10.079, -6.754]], [0.0168, -0.0077, 4.5894]], [[[23.515, -22.772], [11.483, -22.703], [11.492, -22.043], [11.825, -22.042], [15.871, -17.319], [19.303, -17.32], [23.519, -22.271]], [-0.0009, 1.0612, 33.2381]], [[[17.105, -3.241], [16.742, -2.956], [0.247, -3.266], [0.255, -3.167], [-6.293, 3.323], [-6.062, 3.548], [16.87, 3.624], [18.436, -3.239]], [-0.0026, 1.205, 14.7026]], [[[19.021, -4.598], [19.061, -6.478], [18.966, -6.81], [19.032, -7.315], [13.548, -7.805], [12.958, -7.646], [13.665, -2.903], [16.782, -2.835], [17.146, -3.121], [18.408, -3.119], [18.685, -4.333]], [0.6965, -0.0069, -4.6874]], [[[23.028, -1.324], [20.47, -0.757], [20.087, 0.792], [20.756, 1.501], [23.454, 1.548], [23.513, 0.725], [22.808, 0.674], [22.935, -1.124], [23.175, -1.173]], [-1.5915, -0.3936, 42.9919]], [[[18.901, -4.608], [20.226, -2.833], [20.603, -3.058], [21.25, -3.702], [21.221, -9.635], [21.795, -9.646], [21.781, -11.564], [19.463, -11.568], [18.844, -6.801], [18.94, -6.463]], [-1.3663, -0.0499, 34.2281]], [[[18.577, -4.401], [18.213, -2.803], [20.103, -2.761], [20.33, -2.895], [18.973, -4.713]], [-0.0886, -1.0034, 5.5875]], [[[21.082, -2.739], [21.76, -2.723], [21.567, -2.945], [21.569, -3.79], [21.165, -3.787], [20.528, -3.153], [20.071, -2.882], [18.24, -2.922], [17.252, 1.408], [20.108, 1.485], [20.103, 1.225], [20.568, -0.656], [20.686, -0.681], [20.626, -0.894]], [0.4369, 1.5846, 2.2195]], [[[15.635, -7.498], [19.017, -7.196], [19.584, -11.567], [16.08, -11.575]], [-0.0041, -0.0057, 8.6589]], [[[11.5, -12.122], [15.977, -17.379], [11.88, -22.162], [11.49, -22.163], [11.554, -17.83], [10.908, -17.82], [10.891, -14.805], [11.33, -14.811], [11.363, -12.728], [10.878, -12.723], [10.876, -12.271]], [1.2309, 0.0057, -4.6882]], [[[10.078, -6.878], [10.09, -5.896], [9.021, -5.906], [9.299, -2.999], [13.787, -2.9], [13.05, -7.849], [12.761, -7.875], [11.085, -7.146]], [-0.0001, 0.0031, 3.6483]], [[[5.639, -5.934], [4.96, -5.293], [4.709, -4.404], [9.287, -4.386], [9.142, -5.905]], [-0.0284, 1.2095, 10.682]], [[[4.293, -7.475], [-0.089, -7.598], [0.164, -4.342], [4.192, -4.362], [4.286, -4.453]], [0.0078, 0.0065, 5.1413]], [[[5.054, -8.13], [5.518, -7.971], [5.519, -8.822], [-0.002, -8.875], [0.0, -8.958], [-0.195, -8.96], [-0.08, -7.477], [4.256, -7.356]], [-0.0265, 1.2376, 14.4181]], [[[-13.014, 10.004], [-12.452, 11.204], [-12.299, 12.801], [-13.18, 15.535], [-12.63, 15.536], [-12.633, 16.73], [-11.912, 16.741], [-11.918, 15.541], [-6.33, 15.552], [-6.253, 3.481]], [1.2095, 0.0155, 26.4411]], [[[-13.856, 12.222], [-13.802, 12.739], [-13.864, 12.847], [-12.514, 13.86], [-12.177, 12.814], [-12.254, 12.017]], [-0.923, -0.6716, 9.142]], [[[-12.898, 9.969], [-14.167, 9.528], [-14.507, 9.519], [-13.836, 12.34], [-12.243, 12.137], [-12.335, 11.172]], [-0.7175, 0.918, -7.5381]], [[[-12.926, 10.086], [-6.184, 3.581], [-6.397, 3.367], [-14.779, 3.441], [-15.178, 4.085], [-14.828, 4.56], [-13.887, 7.376], [-14.678, 9.634], [-14.188, 9.648]], [0.0054, -1.2133, 23.1867]], [[[20.502, -0.892], [20.569, -0.655], [22.989, -1.192], [23.035, -1.145], [23.612, -1.26], [23.483, -1.973], [22.562, -1.805], [21.653, -2.846], [20.989, -2.862]], [-0.9788, 1.2345, 31.0195]], [[[-14.426, -2.836], [-13.658, -2.884], [-12.842, -3.106], [-11.967, -4.596], [-12.16, -5.727], [-13.732, -5.366]], [-0.5672, -1.0509, 0.3038]], [[[-14.109, -5.414], [-17.396, -5.843], [-17.432, -4.421], [-17.555, -4.381], [-17.413, -3.654], [-17.177, -3.73], [-16.185, -2.728], [-14.299, -2.844], [-13.656, -5.261]], [1.0126, -0.6303, 24.1884]], [[[-14.021, -5.383], [-14.631, -7.95], [-15.309, -9.635], [-16.033, -8.883], [-15.528, -8.386], [-17.051, -6.809], [-17.993, -7.22], [-18.254, -6.655], [-17.385, -6.271], [-17.399, -5.722], [-14.098, -5.292]], [0.8181, 0.8608, 29.4272]], [[[-14.226, -5.327], [-13.695, -5.147], [-13.646, -5.263], [-12.14, -5.609], [-12.723, -9.025], [-15.185, -9.037], [-14.746, -7.914], [-14.151, -5.414]], [-0.0627, 1.205, 19.2199]], [[[21.462, -14.935], [23.801, -17.697], [23.776, -22.758], [19.196, -17.38], [21.209, -14.983]], [-1.2459, 0.0009, 38.8067]], [[[4.143, -4.482], [0.155, -4.462], [0.256, -3.146], [9.42, -2.997], [9.276, -4.506], [4.202, -4.539]], [0.0018, -1.2347, -0.3212]], [[[4.166, -4.421], [4.833, -4.4], [5.067, -5.228], [5.722, -5.848], [5.744, -8.022], [5.023, -8.268], [4.173, -7.443]], [-1.2253, 0.0034, 10.338]], [[[24.214, -14.799], [24.203, -17.691], [23.801, -17.686], [23.799, -17.881], [21.327, -14.961], [21.987, -14.833]], [-0.0333, 1.028, 28.2171]], [[[24.213, -14.919], [22.0, -14.953], [21.274, -15.093], [19.303, -17.44], [15.87, -17.439], [11.369, -12.154], [14.093, -11.502], [16.094, -11.699], [16.067, -11.455], [21.782, -11.444], [21.776, -12.255], [24.224, -12.269]], [-0.0019, -1.0441, -3.3336]]];
// Aaneengesloten BAG-voet met afzonderlijke, uit 3D BAG passende dakvlakken.
solids.push(prism(footprint,BASE,3.1));
for (const [outline,plane] of roofs) solids.push(roofed(outline,[plane]));
// Vierkante noordtoren met achtzijdige naaldspits en vier hoekpinakels.
const tc=[19.8,4.0];
solids.push(prism(sq(tc,3.2),BASE,25.5));
solids.push(loft([[BASE,oct(tc,6.3)],[25.5,oct(tc,6.3)],[43.37,oct(tc,.9)]]));
for (const x of [16.9,22.7]) for (const y of [1.1,6.9]) solids.push(loft([[BASE,sq([x,y],.75)],[26.8,sq([x,y],.75)],[30.3,sq([x,y],.45)]]));
// De slanke vieringruiter is zichtbaar op de luchtfoto en in AHN.
solids.push(loft([[BASE,oct([-6.2,3.5],1.7)],[21.3,oct([-6.2,3.5],1.7)],[27.59,oct([-6.2,3.5],.9)]]));
const cuts=[];

cuts.push(niche([-6.2,0],90,15.5,0,2.8,2.4,9.5,.5));

for (const x of [2.2,8.3,14.4]) cuts.push(niche([x,0],90,9.5,0,1.6,2.2,7.7,.5));
const joined=Manifold.union(solids).subtract(Manifold.union(cuts));
const all=Manifold.union(joined.decompose().filter(part => part.volume() > 1)); const nodes=[[`building:NL.IMBAG.Pand.0356100000083786`,all]];
const META={name:"Sint-Barbarakerk Nieuwegein",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0356100000083786"],plate:false,
 description:"RD (134963,446562), +X langs koor naar toren; neogotische kruiskerk met noordtoren, dakruiter en aangebouwde pastorie. Maaiveld NAP circa +1,90 m.",realWorld:{groundNapM:1.901,towerTopM:43.37},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/526657","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0356100000083786","https://commons.wikimedia.org/wiki/Category:Barbarakerk,_Nieuwegein","https://www.dbnl.org/tekst/sten009monu01_01/sten009monu01_01_0058.php","PDOK AHN DSM/DTM 0,5 m"]};
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






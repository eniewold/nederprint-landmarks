// Maasbrug Heumen: twee onafhankelijke betonnen brughelften, parametrische
// kokerliggers en TT-aanbruggen. BGT-contouren/wegdelen en AHN-lengteprofiel
// letterlijk vastgelegd; geen gestapelde DSM-lagen. Meters, NAP-hoogte minus
// 7,9 m; +X naar Heumen (RD-hoek 98,05 graden), +Y naar het westen.
import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2);
const flag=(n,f)=>{const i=argv.indexOf(n);return i>=0?argv[i+1]:f;};
const scale=Number(flag("--scale","1000")),mmPerMetre=1000/scale;
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),"maasbrug-heumen");
const wasm=await Module();wasm.setup();
const {Manifold,Mesh,CrossSection}=wasm;wasm.setCircularSegments(24);
const BASE=-1.0,GROUND_NAP=7.9,GROUND_OFFSET=-0.1,GROUND_HEIGHT=51.55896552558998;
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const area2 = (pts) => {
  let a = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  });
  return a / 2;
};
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Doorsnede in het XZ-vlak (polygoon of CrossSection), uitgetrokken langs Y van y0 tot y1.
const extrudeY = (shape, y0, y1) =>
  Manifold.extrude(shape, y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const profileY = (points, y0, y1) => extrudeY([ccw(points)], y0, y1);
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in, y naar rechts en z omhoog, steeds evenveel punten).
function loftX(stations) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { x, section } of stations) for (const [y, z] of section) verts.push(x, y, z);
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < stations.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = stations.length - 1;
  for (let j = 1; j + 1 < n; j++) {
    tris.push(id(0, 0), id(0, j + 1), id(0, j));
    tris.push(id(last, 0), id(last, j), id(last, j + 1));
  }
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  if (solid.volume() <= 0) throw new Error("loft: omgekeerde doorsnede");
  return solid;
}
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};
const lerp = (a, b, t) => a + (b - a) * t;
// Lineaire interpolatie in een tabel [[x, ...waarden]], buiten de tabel
// lineair doorgetrokken.
function table(rows, x, k) {
  let i = rows.findIndex(([rx]) => rx > x) - 1;
  if (i < 0) i = x < rows[0][0] ? 0 : rows.length - 2;
  i = Math.min(Math.max(i, 0), rows.length - 2);
  const [x0] = rows[i];
  const [x1] = rows[i + 1];
  return lerp(rows[i][k], rows[i + 1][k], (x - x0) / (x1 - x0));
}


const STATIONS=[[-347.0, -19.458, 17.979], [-345.0, -19.434, 18.046], [-343.0, -19.055, 17.633], [-341.0, -19.036, 17.652], [-339.0, -19.016, 17.671], [-337.0, -18.996, 17.691], [-335.0, -18.976, 17.71], [-333.0, -18.956, 17.729], [-331.0, -18.936, 17.749], [-329.0, -18.916, 17.768], [-327.0, -18.897, 17.787], [-325.0, -18.877, 17.807], [-323.0, -18.857, 17.826], [-321.0, -18.837, 17.845], [-319.0, -18.817, 17.865], [-317.0, -18.797, 17.884], [-315.0, -18.777, 17.904], [-313.0, -18.758, 17.923], [-311.0, -18.738, 17.942], [-309.0, -18.718, 17.962], [-307.0, -18.698, 17.981], [-305.0, -18.678, 18.0], [-303.0, -18.658, 18.019], [-301.0, -18.639, 18.039], [-299.0, -18.619, 18.058], [-297.0, -18.599, 18.077], [-295.0, -18.579, 18.097], [-293.0, -18.559, 18.116], [-291.0, -18.539, 18.135], [-289.0, -18.519, 18.155], [-287.0, -18.5, 18.174], [-285.0, -18.48, 18.193], [-283.0, -18.46, 18.212], [-281.0, -18.44, 18.232], [-279.0, -18.42, 18.251], [-277.0, -18.4, 18.27], [-275.0, -18.38, 18.29], [-273.0, -18.361, 18.309], [-271.0, -18.341, 18.328], [-269.0, -18.321, 18.348], [-267.0, -18.301, 18.367], [-265.0, -18.281, 18.386], [-263.0, -18.262, 18.406], [-261.0, -18.243, 18.425], [-259.0, -18.224, 18.444], [-257.0, -18.205, 18.463], [-255.0, -18.187, 18.483], [-253.0, -18.168, 18.502], [-251.0, -18.149, 18.521], [-249.0, -18.13, 18.541], [-247.0, -18.111, 18.56], [-245.0, -18.092, 18.579], [-243.0, -18.074, 18.599], [-241.0, -18.055, 18.618], [-239.0, -18.036, 18.637], [-237.0, -18.017, 18.656], [-235.0, -17.998, 18.676], [-233.0, -17.979, 18.695], [-231.0, -17.961, 18.714], [-229.0, -17.942, 18.734], [-227.0, -17.923, 18.753], [-225.0, -17.904, 18.772], [-223.0, -17.885, 18.791], [-221.0, -17.867, 18.811], [-219.0, -17.848, 18.83], [-217.0, -17.829, 18.849], [-215.0, -17.81, 18.868], [-213.0, -17.791, 18.888], [-211.0, -17.773, 18.907], [-209.0, -17.754, 18.926], [-207.0, -17.735, 18.946], [-205.0, -17.716, 18.965], [-203.0, -17.698, 18.984], [-201.0, -17.679, 19.004], [-199.0, -17.66, 19.023], [-197.0, -17.641, 19.042], [-195.0, -17.622, 19.062], [-193.0, -17.604, 19.081], [-191.0, -17.585, 19.1], [-189.0, -17.566, 19.12], [-187.0, -17.547, 19.139], [-185.0, -17.53, 19.158], [-183.0, -17.512, 19.177], [-181.0, -17.494, 19.197], [-179.0, -17.477, 19.216], [-177.0, -17.459, 19.235], [-175.0, -17.442, 19.254], [-173.0, -17.424, 19.274], [-171.0, -17.406, 19.293], [-169.0, -17.389, 19.312], [-167.0, -17.371, 19.331], [-165.0, -17.354, 19.351], [-163.0, -17.336, 19.37], [-161.0, -17.318, 19.388], [-159.0, -17.301, 19.406], [-157.0, -17.283, 19.424], [-155.0, -17.266, 19.442], [-153.0, -17.248, 19.46], [-151.0, -17.231, 19.477], [-149.0, -17.213, 19.495], [-147.0, -17.196, 19.513], [-145.0, -17.178, 19.531], [-143.0, -17.161, 19.549], [-141.0, -17.143, 19.567], [-139.0, -17.125, 19.585], [-137.0, -17.108, 19.602], [-135.0, -17.09, 19.62], [-133.0, -17.073, 19.638], [-131.0, -17.055, 19.656], [-129.0, -17.037, 19.673], [-127.0, -17.02, 19.691], [-125.0, -17.002, 19.709], [-123.0, -16.985, 19.727], [-121.0, -16.967, 19.744], [-119.0, -16.949, 19.762], [-117.0, -16.932, 19.78], [-115.0, -16.914, 19.798], [-113.0, -16.897, 19.816], [-111.0, -16.879, 19.833], [-109.0, -16.862, 19.851], [-107.0, -16.844, 19.869], [-105.0, -16.827, 19.887], [-103.0, -16.809, 19.905], [-101.0, -16.792, 19.923], [-99.0, -17.011, 19.941], [-97.0, -17.729, 19.958], [-95.0, -16.751, 19.976], [-93.0, -16.735, 19.994], [-91.0, -16.718, 20.012], [-89.0, -16.701, 20.03], [-87.0, -16.685, 20.048], [-85.0, -16.668, 20.065], [-83.0, -16.651, 20.083], [-81.0, -16.635, 20.101], [-79.0, -16.618, 20.119], [-77.0, -16.602, 20.136], [-75.0, -16.585, 20.154], [-73.0, -16.568, 20.172], [-71.0, -16.552, 20.19], [-69.0, -16.535, 20.207], [-67.0, -16.518, 20.225], [-65.0, -16.507, 20.243], [-63.0, -16.501, 20.261], [-61.0, -16.496, 20.278], [-59.0, -16.49, 20.296], [-57.0, -16.484, 20.314], [-55.0, -16.478, 20.331], [-53.0, -16.473, 20.349], [-51.0, -16.467, 20.366], [-49.0, -16.461, 20.384], [-47.0, -16.455, 20.402], [-45.0, -16.45, 20.419], [-43.0, -16.444, 20.437], [-41.0, -16.438, 20.455], [-39.0, -16.432, 20.472], [-37.0, -16.427, 20.49], [-35.0, -16.421, 20.508], [-33.0, -16.415, 20.525], [-31.0, -16.409, 20.543], [-29.0, -16.392, 20.56], [-27.0, -16.375, 20.578], [-25.0, -16.357, 20.596], [-23.0, -16.339, 20.613], [-21.0, -16.321, 20.631], [-19.0, -16.304, 20.649], [-17.0, -16.286, 20.666], [-15.0, -16.268, 20.684], [-13.0, -16.25, 20.701], [-11.0, -16.233, 20.719], [-9.0, -16.215, 20.736], [-7.0, -16.197, 20.754], [-5.0, -16.179, 20.772], [-3.0, -16.162, 20.789], [-1.0, -16.144, 20.807], [1.0, -16.126, 20.824], [3.0, -16.108, 20.842], [5.0, -16.091, 20.86], [7.0, -16.073, 20.877], [9.0, -16.055, 20.895], [11.0, -16.037, 20.912], [13.0, -16.02, 20.93], [15.0, -16.002, 20.947], [17.0, -15.984, 20.965], [19.0, -15.966, 20.982], [21.0, -15.949, 20.999], [23.0, -15.931, 21.017], [25.0, -15.913, 21.034], [27.0, -15.895, 21.051], [29.0, -15.878, 21.069], [31.0, -15.86, 21.086], [33.0, -15.842, 21.103], [35.0, -15.825, 21.121], [37.0, -15.807, 21.138], [39.0, -15.789, 21.155], [41.0, -15.772, 21.172], [43.0, -15.754, 21.19], [45.0, -15.736, 21.207], [47.0, -15.718, 21.224], [49.0, -15.701, 21.241], [51.0, -15.683, 21.259], [53.0, -15.665, 21.276], [55.0, -15.648, 21.293], [57.0, -15.63, 21.31], [59.0, -15.612, 21.328], [61.0, -15.595, 21.345], [63.0, -15.577, 21.362], [65.0, -15.559, 21.38], [67.0, -15.541, 21.397], [69.0, -15.524, 21.414], [71.0, -15.506, 21.432], [73.0, -15.488, 21.449], [75.0, -15.47, 21.466], [77.0, -15.453, 21.484], [79.0, -15.435, 21.501], [81.0, -15.417, 21.518], [83.0, -15.399, 21.536], [85.0, -15.382, 21.553], [87.0, -15.364, 21.57], [89.0, -15.346, 21.587], [91.0, -15.334, 21.605], [93.0, -15.329, 21.622], [95.0, -15.324, 21.639], [97.0, -15.319, 21.656], [99.0, -15.314, 21.674], [101.0, -15.309, 21.691], [103.0, -15.304, 21.708], [105.0, -15.299, 21.726], [107.0, -15.294, 21.743], [109.0, -15.289, 21.76], [111.0, -15.285, 21.76], [113.0, -15.28, 21.754], [115.0, -15.275, 21.748], [117.0, -15.27, 21.742], [119.0, -15.265, 21.736], [121.0, -15.26, 21.73], [123.0, -15.255, 21.724], [125.0, -15.25, 21.718], [127.0, -15.245, 21.712], [129.0, -15.24, 21.707], [131.0, -15.235, 21.701], [133.0, -15.231, 21.695], [135.0, -15.226, 21.689], [137.0, -15.221, 21.683], [139.0, -15.216, 21.677], [141.0, -15.211, 21.672], [143.0, -15.206, 21.666], [145.0, -15.201, 21.66], [147.0, -15.196, 21.654], [149.0, -15.191, 21.648], [151.0, -15.186, 21.643], [153.0, -15.182, 21.637], [155.0, -15.177, 21.631], [157.0, -15.172, 21.625], [159.0, -15.167, 21.619], [161.0, -15.162, 21.613], [163.0, -15.157, 21.607], [165.0, -15.152, 21.602], [167.0, -15.147, 21.596], [169.0, -15.142, 21.59], [171.0, -15.139, 21.584], [173.0, -15.169, 21.578], [175.0, -15.199, 21.572], [177.0, -15.229, 21.566], [179.0, -15.259, 21.56], [181.0, -15.289, 21.554], [183.0, -15.319, 21.549], [185.0, -15.349, 21.543], [187.0, -15.378, 21.537], [189.0, -15.408, 21.531], [191.0, -15.438, 21.525], [193.0, -15.468, 21.519], [195.0, -15.498, 21.513], [197.0, -15.528, 21.507], [199.0, -15.558, 21.482], [201.0, -15.588, 21.448], [203.0, -15.618, 21.413], [205.0, -15.648, 21.379], [207.0, -15.677, 21.344], [209.0, -15.707, 21.309], [211.0, -15.737, 21.275], [213.0, -15.767, 21.24], [215.0, -15.797, 21.206], [217.0, -15.827, 21.171], [219.0, -15.856, 21.137], [221.0, -15.886, 21.102], [223.0, -15.916, 21.068], [225.0, -15.946, 21.033], [227.0, -15.976, 20.999], [229.0, -16.006, 20.964], [231.0, -16.036, 20.929], [233.0, -16.066, 20.895], [235.0, -16.096, 20.86], [237.0, -16.126, 20.826], [239.0, -16.156, 20.791], [241.0, -16.186, 20.757], [243.0, -16.216, 20.722], [245.0, -16.246, 20.688], [247.0, -16.276, 20.653], [249.0, -16.305, 20.619], [251.0, -16.335, 20.584], [253.0, -16.365, 20.549], [255.0, -16.395, 20.515], [257.0, -16.425, 20.48], [259.0, -16.455, 20.446], [261.0, -16.485, 20.411], [263.0, -16.515, 20.377], [265.0, -16.545, 20.342], [267.0, -16.575, 20.308], [269.0, -16.605, 20.264], [271.0, -16.635, 20.21], [273.0, -16.681, 20.156], [275.0, -16.739, 20.102], [277.0, -16.797, 20.048], [279.0, -16.855, 19.994], [281.0, -16.914, 19.94], [283.0, -16.972, 19.886], [285.0, -17.03, 19.832], [287.0, -17.088, 19.778], [289.0, -17.146, 19.724], [291.0, -17.204, 19.67], [293.0, -17.262, 19.616], [295.0, -17.321, 19.562], [297.0, -17.379, 19.507], [299.0, -17.437, 19.453], [301.0, -17.495, 19.399], [303.0, -17.553, 19.345], [305.0, -17.611, 19.291], [307.0, -17.67, 19.237], [309.0, -17.728, 19.183], [311.0, -17.786, 19.129], [313.0, -17.844, 19.075], [315.0, -17.902, 19.021], [317.0, -17.96, 18.967], [319.0, -18.018, 18.913], [321.0, -18.077, 18.859], [323.0, -18.135, 18.804], [325.0, -18.193, 18.75], [327.0, -18.251, 18.696], [329.0, -18.309, 18.642], [331.0, -18.367, 18.588], [333.0, -18.426, 18.534], [335.0, -18.484, 18.48], [337.0, -18.542, 18.426], [339.0, -18.6, 18.372], [341.0, -18.658, 18.318], [343.0, -18.716, 18.264], [345.0, -18.774, 18.697], [347.0, -18.833, 18.609], [349.0, 17.768, 18.522]];
const PROFILE=[[-350.0, 20.02], [-345.0, 20.05], [-340.0, 20.1], [-335.0, 20.17], [-330.0, 20.2], [-325.0, 20.26], [-320.0, 20.31], [-315.0, 20.32], [-310.0, 20.41], [-305.0, 20.44], [-300.0, 20.47], [-295.0, 20.45], [-290.0, 20.49], [-285.0, 20.5], [-280.0, 20.52], [-275.0, 20.54], [-270.0, 20.54], [-265.0, 20.54], [-260.0, 20.55], [-255.0, 20.56], [-250.0, 20.62], [-245.0, 20.59], [-240.0, 20.61], [-235.0, 20.61], [-230.0, 20.6], [-225.0, 20.62], [-220.0, 20.62], [-215.0, 20.61], [-210.0, 20.61], [-205.0, 20.6], [-200.0, 20.61], [-195.0, 20.61], [-190.0, 20.63], [-185.0, 20.63], [-180.0, 20.63], [-175.0, 20.62], [-170.0, 20.61], [-165.0, 20.61], [-160.0, 20.62], [-155.0, 20.6], [-150.0, 20.62], [-145.0, 20.61], [-140.0, 20.61], [-135.0, 20.61], [-130.0, 20.62], [-125.0, 20.62], [-120.0, 20.61], [-115.0, 20.61], [-110.0, 20.59], [-105.0, 20.57], [-100.0, 20.57], [-95.0, 20.54], [-90.0, 20.53], [-85.0, 20.52], [-80.0, 20.53], [-75.0, 20.49], [-70.0, 20.48], [-65.0, 20.45], [-60.0, 20.43], [-55.0, 20.42], [-50.0, 20.38], [-45.0, 20.4], [-40.0, 20.31], [-35.0, 20.28], [-30.0, 20.24], [-25.0, 20.2], [-20.0, 20.17], [-15.0, 20.13], [-10.0, 20.16], [-5.0, 20.17], [0.0, 20.09], [5.0, 20.06], [10.0, 20.06], [15.0, 19.99], [20.0, 19.91], [25.0, 19.87], [30.0, 19.81], [35.0, 19.78], [40.0, 19.72], [45.0, 19.71], [50.0, 19.72], [55.0, 19.67], [60.0, 19.54], [65.0, 19.49], [70.0, 19.44], [75.0, 19.39], [80.0, 19.37], [85.0, 19.3], [90.0, 19.31], [95.0, 19.19], [100.0, 19.16], [105.0, 19.12], [110.0, 19.06], [115.0, 19.02], [120.0, 18.95], [125.0, 18.95], [130.0, 18.86], [135.0, 18.82], [140.0, 18.79], [145.0, 18.74], [150.0, 18.69], [155.0, 18.63], [160.0, 18.57], [165.0, 18.59], [170.0, 18.47], [175.0, 18.45], [180.0, 18.4], [185.0, 18.34], [190.0, 18.3], [195.0, 18.22], [200.0, 18.19], [205.0, 18.13], [210.0, 18.06], [215.0, 18.02], [220.0, 17.95], [225.0, 17.93], [230.0, 17.96], [235.0, 17.85], [240.0, 17.79], [245.0, 17.72], [250.0, 17.7], [255.0, 17.64], [260.0, 17.57], [265.0, 17.51], [270.0, 17.48], [275.0, 17.42], [280.0, 17.38], [285.0, 17.32], [290.0, 17.29], [295.0, 17.23], [300.0, 17.18], [305.0, 17.1], [310.0, 17.06], [315.0, 17.0], [320.0, 16.96], [325.0, 16.96], [330.0, 16.91], [335.0, 16.85], [340.0, 16.8], [345.0, 16.72], [350.0, 16.66]];
// Actuele BGT-wegdelen met relatieve hoogteligging 1, vereenvoudigd tot 5 cm.
const BGT_ROADS=[
  {
    "id": "L0002.6eea37cb80884bf1874bf3a6cae646d8",
    "function": "fietspad",
    "attributes": {
      "bgt_functie": "fietspad",
      "bgt_fysiekvoorkomen": "gesloten verharding"
    },
    "contour": [
      [
        -345.496,
        -18.744
      ],
      [
        83.473,
        -14.848
      ],
      [
        151.504,
        -14.566
      ],
      [
        221.475,
        -15.191
      ],
      [
        277.405,
        -16.252
      ],
      [
        345.235,
        -18.13
      ],
      [
        345.361,
        -14.684
      ],
      [
        267.847,
        -12.665
      ],
      [
        193.873,
        -11.348
      ],
      [
        121.929,
        -11.043
      ],
      [
        93.293,
        -11.362
      ],
      [
        -190.223,
        -13.8
      ],
      [
        -345.535,
        -15.371
      ]
    ]
  },
  {
    "id": "L0002.7d60a86d37354b38912490730750df37",
    "function": "fietspad",
    "attributes": {
      "bgt_functie": "fietspad",
      "bgt_fysiekvoorkomen": "gesloten verharding"
    },
    "contour": [
      [
        -266.413,
        15.063
      ],
      [
        -92.808,
        16.814
      ],
      [
        -1.675,
        17.576
      ],
      [
        155.039,
        18.661
      ],
      [
        332.238,
        15.421
      ],
      [
        346.432,
        14.728
      ],
      [
        346.546,
        17.855
      ],
      [
        275.249,
        19.785
      ],
      [
        176.937,
        21.187
      ],
      [
        91.907,
        21.216
      ],
      [
        -32.632,
        20.1
      ],
      [
        -82.736,
        19.905
      ],
      [
        -345.912,
        17.444
      ],
      [
        -345.871,
        13.965
      ]
    ]
  },
  {
    "id": "L0002.950adf11fa674bb3ada073deedcb0798",
    "function": "rijbaan autosnelweg",
    "attributes": {
      "bgt_functie": "rijbaan autosnelweg",
      "bgt_fysiekvoorkomen": "gesloten verharding"
    },
    "contour": [
      [
        345.379,
        -14.175
      ],
      [
        345.838,
        -1.52
      ],
      [
        277.115,
        0.524
      ],
      [
        202.643,
        1.843
      ],
      [
        165.067,
        2.177
      ],
      [
        95.324,
        2.035
      ],
      [
        -8.818,
        1.008
      ],
      [
        -117.277,
        0.184
      ],
      [
        -345.688,
        -2.017
      ],
      [
        -345.542,
        -14.858
      ],
      [
        -190.173,
        -13.287
      ],
      [
        93.344,
        -10.848
      ],
      [
        121.979,
        -10.529
      ],
      [
        193.924,
        -10.835
      ],
      [
        267.897,
        -12.151
      ]
    ]
  },
  {
    "id": "L0002.96c20f9a88af49439d7db29be12e84ae",
    "function": "rijbaan autosnelweg",
    "attributes": {
      "bgt_functie": "rijbaan autosnelweg",
      "bgt_fysiekvoorkomen": "gesloten verharding"
    },
    "contour": [
      [
        345.951,
        1.526
      ],
      [
        346.411,
        14.146
      ],
      [
        332.181,
        14.693
      ],
      [
        154.98,
        17.933
      ],
      [
        -1.733,
        16.849
      ],
      [
        -92.865,
        16.087
      ],
      [
        -266.47,
        14.335
      ],
      [
        -345.863,
        13.238
      ],
      [
        -345.723,
        1.027
      ],
      [
        -217.912,
        2.102
      ],
      [
        -181.364,
        2.502
      ],
      [
        -105.585,
        3.058
      ],
      [
        -71.11,
        3.525
      ],
      [
        -40.198,
        3.771
      ],
      [
        -8.905,
        4.144
      ],
      [
        51.669,
        4.451
      ],
      [
        82.404,
        5.039
      ],
      [
        141.256,
        5.318
      ],
      [
        182.103,
        5.065
      ],
      [
        250.453,
        4.0
      ]
    ]
  }
];
const road=(x)=>table(PROFILE,x,1)-GROUND_NAP;
const edges=(x)=>{const q=Math.max(-340,Math.min(340,x));return[table(STATIONS,q,1),table(STATIONS,q,2)];};
const center=(x)=>{const [a,b]=edges(x);return(a+b)/2;};
const halfEdges=(x,side)=>{const [a,b]=edges(x),m=center(x);return side<0?[a,m-.4]:[m+.4,b];};
const depth=(x)=>{if(x<-7.07){const knots=[[-347,2.75],[-255,7],[-176.25,2.75],[-97.5,7],[-7.07,2.75]];const i=Math.max(0,Math.min(knots.length-2,knots.findIndex(([k])=>k>x)-1));const t=Math.max(0,Math.min(1,(x-knots[i][0])/(knots[i+1][0]-knots[i][0])));return knots[i][1]+(knots[i+1][1]-knots[i][1])*t*t;}return 2.75;};
// Dezelfde stations voor slab, kokers, schampkanten en snijlaag.
const xs=STATIONS.map(([x])=>x);
const decks=[-1,1].flatMap(side=>[
 loftX(xs.map(x=>{const[a,b]=halfEdges(x,side),z=road(x);return{x,section:[[a,z-.9],[b,z-.9],[b,z],[a,z]]};})),
 loftX([...xs.filter(x=>x<-7.07),-7.07].map(x=>{const[a,b]=halfEdges(x,side),z=road(x),dep=depth(x);return{x,section:[[a+4.9,z-dep],[b-4.9,z-dep],[b-4.7,z-.8],[a+4.7,z-.8]]};}))
]);
decks.push(...[-1,1].flatMap(side=>[-1,1].map(web=>loftX([-7.07,...xs.filter(x=>x>-7.07)].map(x=>{const[a,b]=halfEdges(x,side),z=road(x),y=web<0?a+5.2:b-5.2;return{x,section:[[y-.5,z-2.75],[y+.5,z-2.75],[y+.6,z-.8],[y-.6,z-.8]]};})))));
const kerbSpecs=[-1,1].flatMap(side=>[
 {side,position:"outer"},{side,position:"inner"},{side,position:"bike"}
]);
const kerbEdges=(x,q)=>{const[a,b]=halfEdges(x,q.side);if(q.position==="outer")return q.side<0?[a,a+.9]:[b-.9,b];if(q.position==="inner")return q.side<0?[b-.9,b]:[a,a+.9];return q.side<0?[a+3.7,a+4.6]:[b-4.6,b-3.7];};
const kerbSolid=(q,margin=0)=>loftX(xs.map(x=>{const[a,b]=kerbEdges(x,q),z=road(x);return{x,section:[[a-margin,z-.2-margin],[b+margin,z-.2-margin],[b+margin,z+.6+margin],[a-margin,z+.6+margin]]};}));
const kerbs=kerbSpecs.map(q=>kerbSolid(q));
const pierX=[-255,-97.5,-7.07,38.08,83.23,128.38,173.53,218.68,263.83,308.98];
const piers=pierX.flatMap(x=>[-1,1].map(side=>{const[a,b]=halfEdges(x,side),m=(a+b)/2,top=road(x)-depth(x)+.3;
 const width=x<-90?10.25:9.8,along=x<-90?3.1:2.2;
 return Manifold.hull([boxFromTo(x-along/2,x+along/2,m-width/2,m+width/2,top-.9,top),
 boxFromTo(x-along/2,x+along/2,m-width/2+1.1,m+width/2-1.1,BASE,BASE+1.2)]);}));
const abutments=[[-347,-341],[340,349]].flatMap(([x0,x1])=>[-1,1].map(side=>{const[a,b]=halfEdges((x0+x1)/2,side);return boxFromTo(x0,x1,a,b,BASE,Math.min(road(x0),road(x1))-.1);}));
const bridge=union([...decks,...kerbs,...piers,...abutments]);
const strip=union([-1,1].map(side=>loftX(xs.map(x=>{const[a,b]=halfEdges(x,side),z=road(x);return{x,section:[[a-.01,z-.5],[b+.01,z-.5],[b+.01,z+1],[a-.01,z+1]]};}))))
 .subtract(union(kerbSpecs.map(q=>kerbSolid(q,.02))));
const bikeContours=union(BGT_ROADS.filter(q=>q.function==="fietspad").map(q=>prism(q.contour,BASE,100)));
const roadCut=strip.subtract(bikeContours),bikeCut=strip.intersect(bikeContours);
const parts=[["building:maasbrug-heumen",bridge.subtract(strip)],["road:rijbaan",bridge.intersect(roadCut),BGT_ROADS.find(q=>q.function==="rijbaan autosnelweg").attributes],
 ["road:fietspad",bridge.intersect(bikeCut),BGT_ROADS.find(q=>q.function==="fietspad").attributes]];
// Printvoet alleen STL: 50 graden wig naar een scherm van 0,9 mm op 1:1000.
const tan=Math.tan(50*Math.PI/180),screen=Math.max(.45,.4*scale/1000);
const feet=[-1,1].map(side=>loftX(xs.map(x=>{const[a,b]=halfEdges(x,side),m=(a+b)/2,w=(b-a)/2,z=road(x)-Math.max(.9,depth(x))-.02,low=z-tan*(w-screen);
 const cut=low>BASE?screen:Math.max(screen,w-(z-BASE)/tan);
 return{x,section:[[m-cut,BASE],[m+cut,BASE],[m+cut,Math.max(BASE+.001,low)],[b,z],[b,road(x)-.3],[a,road(x)-.3],[a,z],[m-cut,Math.max(BASE+.001,low)]]};})));
const printModel=union([bridge,...feet]);
const report={};
for(const[n,m] of [...parts,["whole",bridge],["print",printModel]]){
 if(m.status()!=="NoError"||m.volume()<=0)throw Error(n+" "+m.status());
 const bb=m.boundingBox();report[n]={triangles:m.numTri(),volumeM3:m.volume(),genus:m.genus(),bounds:bb};
}
const sum=parts.reduce((v,[,m])=>v+m.volume(),0);if(Math.abs(sum-bridge.volume())>.05)throw Error("wegdelen overlappen");
for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++)if(parts[i][1].intersect(parts[j][1]).volume()>.02)throw Error("overlap");
// Een printbaar ondervlak moet minstens 45 graden hellen; bodem uitgezonderd.
function unsupported(m){const q=m.getMesh(),v=q.vertProperties,st=q.numProp;let area=0;
 for(let t=0;t<q.triVerts.length;t+=3){const p=[0,1,2].map(k=>[0,1,2].map(a=>v[q.triVerts[t+k]*st+a]));if(Math.max(...p.map(a=>a[2]))<BASE+.005)continue;
 const u=p[1].map((z,i)=>z-p[0][i]),w=p[2].map((z,i)=>z-p[0][i]);const n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]],len=Math.hypot(...n);
 if(n[2]<-Math.SQRT1_2*len-1e-5){area+=len/2;if(len/2>.02)console.log("overhang",p.map(a=>a.map(x=>+x.toFixed(3))),len/2);}}return area;}
report.printUnsupportedM2=unsupported(printModel);if(report.printUnsupportedM2>.2)throw Error("printoverhang "+report.printUnsupportedM2);
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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
}


await mkdir(outDir,{recursive:true});
await writeFile(path.join(outDir,"maasbrug-heumen.glb"),toGlb(parts,"NederPrint generate-maasbrug-heumen.mjs"));
const stlName=`maasbrug-heumen-1-${scale}.stl`;
await writeFile(path.join(outDir,stlName),toStl(printModel.translate([0,0,-BASE]),"NederPrint Maasbrug Heumen 1:"+scale).buffer);
await writeFile(path.join(outDir,"maasbrug-heumen.json"),JSON.stringify({
 name:"Maasbrug bij Heumen",file:"maasbrug-heumen.glb",unitsPerMetre:1,className:"building",crs:"EPSG:28992",
 origin:[186126.075,419135.265],xAxis:[-0.140041,0.990146],groundOffsetMetres:GROUND_OFFSET,groundHeight:GROUND_HEIGHT,
 groundSamplePoints:[[-200,-30],[-200,30],[-180,-30],[-180,30]],replacesBuildings:[],replacesTerrain:["L0002.60a1804e97d247e2808a8f3e1d42168e"],
 description:"Twee gescheiden brughelften met variabele kokers van 2,75 tot 7 m boven de Maas, TT-aanbruggen op tien pijlerassen, twee fietspaden en zes schampkanten. BGT-dekranden en actuele wegdelen; AHN-lengteprofiel. De bovenste 0,5 m is road met BGT-attributen; alle opvulling draagt de constructie. STL heeft een interne printvoet. NAP-hoogte minus 7,9 m.",
 printFiles:[stlName],realWorld:{lengthM:696,riverSpanM:157.5,deckWidthM:36.82,deckNapM:[16.7,20.63],boxDepthM:[2.75,7],pierX},
 sources:["https://www.cementonline.nl/artikelen/brug-over-de-maas-bij-heumen","https://commons.wikimedia.org/wiki/File:Linden_(Cuijk,_N-Br)_-_Heumen_(Gld)_graffiti,_bridge_of_A73_over_Meuse_river.JPG","https://www.mookenmiddelaarinbeeld.nl/mooder-maas/bruggen-over-de-maas","PDOK BGT overbruggingsdeel L0002.60a1804e97d247e2808a8f3e1d42168e en vier actuele wegdelen (2026-09-25)","PDOK AHN DSM en DTM 0,5 m; PDOK actuele luchtfoto"]
},null,2));console.log(JSON.stringify(report,null,2));






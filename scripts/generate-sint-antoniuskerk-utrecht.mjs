import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-antoniuskerk-utrecht");
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

const SLUG="sint-antoniuskerk-utrecht";
const ORIGIN=[135073,455863], X_AXIS=[0.859,0.512], BASE=-0.5;
const GROUND_SAMPLES=[[-24,10],[-24,25],[-5,32],[30,-8],[30,12],[5,-22]];
const solids=[];
const footprint=[[-21.375, 14.588], [-15.586, 28.653], [-5.177, 24.371], [-7.726, 18.217], [-11.042, 19.574], [-11.055, 11.844], [-6.473, 11.84], [-6.464, 12.375], [-4.102, 12.356], [-4.09, 14.382], [2.359, 14.359], [2.385, 15.852], [5.372, 15.803], [5.374, 14.344], [11.914, 14.386], [11.867, 11.77], [15.626, 11.798], [15.63, 6.351], [25.856, 6.315], [25.813, 2.043], [29.17, 2.029], [29.193, -5.343], [25.947, -5.316], [25.935, -9.563], [18.314, -9.543], [18.334, -13.34], [14.781, -13.323], [14.776, -16.315], [11.94, -16.311], [11.931, -17.65], [5.428, -17.646], [5.422, -19.145], [2.425, -19.11], [2.406, -17.641], [-4.053, -17.649], [-4.062, -16.711], [-8.523, -16.727], [-8.542, -12.905], [-8.111, -12.913], [-8.114, -11.519], [-8.545, -11.52], [-8.57, -6.223], [-8.786, -6.236], [-8.773, -5.769], [-9.897, -5.588], [-10.929, -5.104], [-11.786, -4.352], [-12.402, -3.393], [-12.73, -2.301], [-12.743, -1.162], [-12.439, -0.064], [-11.493, 1.284], [-12.913, 1.272], [-12.934, 7.705], [-14.928, 7.697], [-14.932, 11.826], [-12.768, 11.837], [-12.768, 13.992], [-13.705, 13.92], [-16.029, 14.871], [-16.897, 12.762]];
const roofs=[[[[29.23, 2.089], [29.241, -1.681], [25.988, -1.685], [26.008, 2.103]], [0.0024, -1.0739, 5.364]], [[[25.989, -1.565], [29.24, -1.561], [29.253, -5.404], [25.971, -5.376]], [-0.0003, 1.0769, 8.9317]], [[[-20.083, 13.996], [-19.179, 16.376], [-18.467, 16.656], [-16.968, 13.131], [-16.726, 13.021], [-16.864, 12.684]], [0.2516, 0.6064, -0.224]], [[[-12.026, -4.132], [-9.101, -1.871], [-8.617, -1.898], [-8.61, -5.891], [-9.915, -5.646], [-10.457, -5.437], [-11.424, -4.804]], [0.505, 0.9111, 17.802]], [[[-12.789, -2.311], [-12.842, -1.663], [-8.918, -1.881], [-11.954, -4.228], [-12.456, -3.419]], [0.9499, 0.336, 20.7314]], [[[-14.857, 24.909], [-14.795, 24.776], [-17.69, 23.7], [-16.851, 25.739]], [0.4532, 1.1331, -11.4686]], [[[-11.703, 1.661], [-11.596, 1.956], [-8.626, 2.866], [-8.618, -1.294]], [0.3447, -0.9687, 13.4025]], [[[-11.658, 1.784], [-8.321, -1.413], [-8.392, -1.779], [-8.617, -1.849], [-8.617, -2.018], [-12.84, -1.783], [-12.688, -0.586], [-12.229, 0.474], [-11.632, 1.223], [-11.863, 1.221]], [0.9099, -0.3784, 18.9885]], [[[-8.61, -6.262], [-8.848, -6.299], [-8.833, -5.76], [-8.73, -5.765], [-8.738, -1.761], [-8.497, -1.686], [-8.474, -1.569], [-3.949, -1.57], [-3.97, -5.57], [-4.602, -6.064], [-6.232, -5.993], [-6.233, -7.073]], [0.0016, 1.3821, 17.2215]], [[[12.628, -16.371], [12.221, -14.96], [12.981, -14.781], [14.838, -14.779], [14.836, -16.376]], [0.0043, 1.0352, 20.4942]], [[[3.826, -17.513], [3.881, -4.831], [8.571, -9.549], [12.769, -9.486], [12.885, -12.72], [11.943, -12.731], [11.942, -13.564], [12.753, -16.371], [12.0, -16.371], [11.993, -17.405]], [-1.3809, 0.0037, 24.3265]], [[[-15.996, 14.794], [-16.771, 12.91], [-17.06, 13.041], [-18.578, 16.612], [-16.297, 17.511], [-15.272, 15.957], [-15.927, 14.767]], [-0.5872, 0.2499, -9.8297]], [[[-5.39, 24.178], [-9.212, 22.427], [-13.694, 24.295], [-14.44, 26.437], [-14.852, 28.416], [-5.099, 24.403], [-5.222, 24.106]], [-0.3881, -0.9217, 28.5131]], [[[-5.176, 24.217], [-7.621, 18.312], [-7.821, 18.38], [-9.288, 22.524], [-5.392, 24.309]], [-1.0026, 0.4192, -7.3082]], [[[-8.349, 9.456], [-5.699, 6.625], [-5.678, 4.306], [-9.488, 8.268]], [-1.2914, -0.0042, -3.2256]], [[[-16.884, 18.4], [-16.229, 17.409], [-18.532, 16.502], [-18.848, 17.247], [-18.148, 19.09]], [-0.2544, -0.5951, 10.3354]], [[[-18.465, 22.028], [-13.648, 24.406], [-9.165, 22.537], [-7.727, 18.475], [-7.575, 18.423], [-7.694, 18.139], [-11.063, 19.491]], [0.3736, 0.9064, -5.5867]], [[[-18.186, 18.975], [-17.154, 21.706], [-10.982, 19.59], [-10.994, 12.855], [-12.828, 12.808], [-12.828, 13.927], [-13.715, 13.86], [-16.04, 14.812], [-15.412, 15.951], [-16.968, 18.309]], [-0.0279, -0.01, 3.0881]], [[[-16.162, 27.413], [-15.619, 28.732], [-14.718, 28.361], [-14.324, 26.469], [-13.572, 24.309], [-18.425, 21.914], [-17.628, 23.852], [-14.959, 24.844]], [1.0331, -0.4271, 35.869]], [[[-18.018, 19.299], [-19.297, 19.794], [-18.343, 22.113], [-17.04, 21.667], [-17.921, 19.349]], [0.0459, -0.0497, 9.4826]], [[[-17.95, 19.402], [-18.719, 17.25], [-18.42, 16.545], [-19.085, 16.284], [-19.971, 13.951], [-21.453, 14.556], [-19.251, 19.905]], [-1.3053, 0.6117, -29.6952]], [[[-9.323, 8.268], [-12.982, 4.385], [-12.993, 7.645], [-14.988, 7.637], [-14.992, 11.886], [-12.742, 11.897]], [1.2663, -0.0006, 20.79]], [[[-14.781, 24.748], [-16.896, 25.628], [-16.1, 27.564]], [-0.493, -1.1416, 30.8937]], [[[-7.545, -15.72], [-8.586, -16.331], [-8.603, -12.844], [-8.171, -12.852], [-8.174, -11.579], [-8.604, -11.581], [-8.63, -6.287], [-8.73, -6.293], [-8.729, -6.094], [-6.233, -6.946], [-6.242, -14.248]], [1.0372, -0.0015, 12.9779]], [[[3.826, -17.393], [11.994, -17.285], [11.991, -17.71], [5.487, -17.706], [5.482, -19.206], [3.826, -19.186]], [0.5049, 0.9111, 17.7996]], [[[-3.142, -17.708], [-3.91, -17.708], [-4.116, -17.36], [-4.112, -9.562], [-0.718, -9.554], [4.001, -4.83], [3.946, -17.512], [-3.232, -17.606]], [1.3769, -0.0057, 13.4112]], [[[-3.494, -17.489], [3.946, -17.392], [3.946, -19.187], [2.366, -19.17], [2.347, -17.701], [-3.302, -17.708]], [-0.5788, -0.0026, 5.4916]], [[[-4.031, 7.996], [-4.033, 7.594], [-5.769, 6.524], [-8.487, 9.428], [-4.956, 9.45], [-4.602, 9.578]], [-0.0043, 1.2095, -3.8251]], [[[-3.991, -9.323], [-4.182, -9.58], [-3.992, -9.568], [-4.027, -16.143], [-4.662, -16.168], [-6.362, -14.248], [-6.352, -5.868], [-3.972, -5.971], [-3.982, -7.841], [-4.428, -7.689], [-3.987, -8.716]], [-1.0595, 0.001, -0.2008]], [[[-6.302, -14.134], [-4.61, -16.046], [-4.026, -16.023], [-4.03, -16.77], [-8.583, -16.787], [-8.587, -16.192], [-7.622, -15.626]], [-0.0123, 0.9273, 19.5749]], [[[-4.186, 2.923], [-3.925, 2.922], [-3.95, -1.69], [-8.498, -1.689], [-8.451, -1.454], [-8.739, -1.178], [-8.745, 2.93], [-8.419, 2.929], [-6.273, 3.588], [-5.671, 4.488]], [-0.0055, -1.3905, 12.6756]], [[[-5.799, 4.428], [-5.819, 6.634], [-4.032, 7.735], [-4.037, 4.329], [-5.679, 4.332]], [0.7316, 0.0145, 8.3016]], [[[-9.405, 8.355], [-5.577, 4.411], [-6.197, 3.485], [-8.402, 2.809], [-8.625, 2.81], [-8.626, 2.741], [-10.701, 2.105], [-11.036, 3.15], [-11.735, 1.222], [-12.973, 1.212], [-12.983, 4.559]], [-0.0047, 1.2024, -1.0909]], [[[14.525, -12.582], [14.84, -13.825], [14.838, -14.899], [12.995, -14.901], [12.254, -15.075], [11.822, -13.581], [11.823, -12.612]], [0.0059, -0.9895, -9.5739]], [[[26.108, -1.685], [-4.07, -1.689], [-4.045, 2.802], [-4.238, 2.803], [-5.802, 4.452], [-4.157, 4.449], [-4.153, 6.394], [-0.7, 6.418], [3.897, 1.824], [11.19, 9.074], [11.235, 6.664], [10.607, 6.083], [13.997, 5.106], [14.408, 6.021], [15.667, 6.071], [15.206, 6.751], [15.21, 7.261], [15.689, 7.388], [15.69, 6.41], [25.917, 6.375], [25.873, 2.103], [26.128, 2.102]], [0.0004, -1.3797, 21.2557]], [[[11.413, 12.34], [11.062, 11.734], [11.142, 11.645], [11.164, 10.471], [10.504, 10.77], [10.293, 10.408], [11.209, 8.923], [3.836, 1.595], [3.888, 15.887], [5.432, 15.862], [5.434, 14.404], [11.975, 14.447], [11.924, 11.587]], [-1.375, 0.0048, 24.207]], [[[-4.028, 9.659], [-4.935, 9.33], [-8.324, 9.309], [-9.405, 8.18], [-12.828, 11.813], [-12.828, 12.928], [-10.993, 12.975], [-10.995, 11.904], [-6.532, 11.9], [-6.523, 12.436], [-4.042, 12.416]], [0.0034, -1.2101, 18.9323]], [[[-4.149, 9.743], [-4.15, 14.442], [2.3, 14.419], [2.326, 15.913], [4.008, 15.885], [3.956, 1.595], [-0.749, 6.298], [-4.154, 6.274], [-4.151, 7.975], [-4.715, 9.537]], [1.3742, -0.0051, 13.5102]], [[[12.765, -12.722], [12.649, -9.488], [20.979, -9.363], [20.816, -9.609], [18.375, -9.603], [18.394, -13.401], [14.841, -13.383], [14.794, -14.133], [14.432, -12.703]], [-0.0053, -0.0038, 3.0474]], [[[26.109, -1.565], [25.994, -9.623], [20.672, -9.609], [20.753, -9.486], [8.521, -9.669], [3.941, -5.061], [-0.668, -9.673], [-4.113, -9.683], [-4.107, -8.741], [-4.645, -7.489], [-4.102, -7.673], [-4.093, -6.086], [-4.787, -6.056], [-4.089, -5.511], [-4.069, -1.569]], [-0.0031, 1.3731, 25.7098]]];
// Aaneengesloten BAG-voet met afzonderlijke, uit 3D BAG passende dakvlakken.
solids.push(prism(footprint,BASE,3.1));
for (const [outline,plane] of roofs) solids.push(roofed(outline,[plane]));
// Zijtoren met forse vierkante bakstenen schacht en Italiaans tentdak.
const tc=[13,8.75];
solids.push(prism(rect(10.2,15.8,5,12.5),BASE,34.5));
solids.push(loft([[BASE,sq(tc,2.8)],[34.5,sq(tc,2.8)],[37.3,sq(tc,1.6)],[41.11,sq(tc,.45)]]));
const cuts=[];
for (const angle of [0,90,180,270]) for (const shift of [-1.05,1.05]) cuts.push(niche(tc,angle,angle%180===0?2.8:3.75,shift,1.1,26.8,32.2,.55));
// De grote rozet aan de voorgevel als steunvrije, ondiepe ruitvorm.
cuts.push(profileX([[-3.6,9],[-1.6,5.8],[.4,9],[-1.6,12.2]],25.5,26.6));
const joined=Manifold.union(solids).subtract(Manifold.union(cuts));
const all=Manifold.union(joined.decompose().filter(part => part.volume() > 1)); const nodes=[[`building:NL.IMBAG.Pand.0344100000001779`,all]];
const META={name:"Sint-Antoniuskerk Utrecht",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0344100000001779"],plate:false,
 description:"RD (135073,455863), +X langs het schip; Antoniuskerk met zijdelingse Italiaanse toren, veelhoekige absis en pastorie. Maaiveld NAP circa +1,81 m.",realWorld:{groundNapM:1.814,towerTopM:41.11},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/514178","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000001779","https://commons.wikimedia.org/wiki/Category:Antoniuskerk_(Utrecht)","https://www.monumenten.nl/monument/514178","PDOK AHN DSM/DTM 0,5 m"]};
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




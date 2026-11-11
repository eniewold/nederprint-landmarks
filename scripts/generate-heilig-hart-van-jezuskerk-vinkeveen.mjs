import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "heilig-hart-van-jezuskerk-vinkeveen");
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

const SLUG="heilig-hart-van-jezuskerk-vinkeveen";
const ORIGIN=[124073,469765], X_AXIS=[0.995,0.100], BASE=-0.5;
const GROUND_SAMPLES=[[-45,-7],[-45,10],[-20,-18],[0,-18],[45,32],[45,10]];
const solids=[];
const footprint=[[-31.489, -13.218], [-31.489, -13.67], [-38.136, -13.649], [-38.101, -2.537], [-40.613, -2.528], [-40.588, 5.701], [-37.456, 5.69], [-36.808, 10.902], [-34.628, 13.145], [-1.507, 13.041], [-1.493, 16.853], [9.611, 16.818], [9.608, 16.0], [17.524, 15.882], [17.565, 25.564], [22.7, 25.542], [22.715, 28.957], [43.098, 28.873], [43.062, 20.313], [42.703, 20.314], [42.68, 14.463], [34.15, 14.499], [34.155, 15.464], [25.05, 15.502], [25.027, 9.631], [25.455, 9.63], [29.245, 4.614], [29.219, -1.548], [25.573, -6.695], [26.145, -7.251], [27.993, -12.979], [18.474, -16.048], [16.498, -9.919], [13.416, -13.087], [9.702, -13.076], [9.699, -13.823], [-1.634, -13.789], [-1.636, -14.032], [-23.14, -13.965], [-23.137, -13.254]];
const roofs=[[[[22.563, 20.379], [22.602, 24.777], [38.456, 24.722], [34.298, 20.503]], [0.0019, 1.6156, -22.4062]], [[[38.27, 24.724], [43.14, 24.676], [43.121, 20.253], [42.663, 20.254]], [0.026, 1.6476, -24.07]], [[[9.762, -13.136], [9.761, -13.471], [9.45, -13.478], [9.469, -12.935], [9.827, -11.723], [14.022, -12.548], [13.441, -13.147]], [-0.2897, 2.2828, 44.1293]], [[[38.443, 18.667], [34.489, 14.731], [34.237, 14.741], [34.212, 20.588], [38.289, 24.724], [38.476, 24.721]], [1.6319, 0.0005, -45.0234]], [[[38.357, 24.807], [42.763, 20.326], [42.739, 14.403], [42.539, 14.402], [38.323, 18.667]], [-1.636, 0.0052, 80.3174]], [[[17.491, 22.26], [19.475, 20.411], [17.475, 18.584]], [0.6735, -0.0049, -3.0293]], [[[32.92, 26.852], [31.903, 27.393], [30.177, 28.987], [32.883, 28.976]], [1.5684, 0.0674, -38.897]], [[[9.262, -13.362], [9.762, -13.351], [9.759, -13.884], [-1.373, -13.849], [-1.373, -13.616], [3.997, -8.223]], [0.009, 1.6895, 42.8259]], [[[-31.684, -13.472], [-31.77, -13.729], [-38.118, -13.709], [-34.778, -10.921]], [-0.0149, 1.3955, 29.4676]], [[[25.031, 15.442], [25.076, 16.352], [17.621, 15.263], [17.678, 18.931], [19.363, 20.471], [34.332, 20.624], [34.357, 14.736], [34.091, 14.748], [34.095, 15.405]], [-0.0009, 0.7327, -5.0108]], [[[34.091, 14.868], [34.441, 14.853], [38.383, 18.777], [42.708, 14.402], [34.09, 14.439]], [0.0088, 1.6312, -13.2055]], [[[19.889, -4.04], [9.454, -4.018], [3.958, 1.355], [4.022, 1.488], [18.792, 1.429], [19.189, 1.3]], [0.0053, 1.6787, 26.4353]], [[[29.125, 4.87], [29.305, 4.634], [29.279, -1.567], [28.996, -1.966], [24.529, -0.535], [24.643, 2.681], [25.151, 2.797], [24.655, 3.325]], [-0.91, -0.0123, 37.2914]], [[[21.951, -3.925], [22.065, -3.925], [22.789, -2.789], [25.414, -7.2], [21.814, -7.836]], [-0.2714, 0.8463, 23.4652]], [[[-1.411, 16.351], [-1.556, 16.351], [-1.553, 16.913], [9.671, 16.878], [9.67, 16.347], [9.358, 16.348], [3.987, 10.981]], [0.0027, -1.7081, 47.7661]], [[[25.485, 9.69], [29.202, 4.769], [24.744, 3.229], [23.698, 4.344], [22.88, 6.026], [25.239, 9.69]], [-0.7166, -0.5718, 34.3498]], [[[24.515, -1.669], [23.233, -2.317], [22.13, -4.045], [19.768, -4.04], [19.063, 1.34], [19.195, 1.299], [19.393, 1.49], [19.798, 1.582], [19.911, 1.202]], [-0.7544, 1.579, 41.097]], [[[22.071, -3.925], [21.907, -8.581], [15.077, -9.007], [10.393, -5.046], [9.738, -4.993], [9.775, -3.899]], [-0.0386, 0.853, 18.8254]], [[[-34.718, -11.027], [-37.931, -13.709], [-38.196, -13.709], [-38.162, -3.056], [-34.688, -2.601]], [1.1588, -0.0101, 54.827]], [[[22.763, 25.602], [22.683, 20.38], [19.363, 20.351], [17.49, 22.096], [17.506, 25.624]], [0.0117, -0.7148, 24.2887]], [[[14.718, 12.046], [14.451, 15.953], [17.464, 15.943], [17.476, 18.747], [17.8, 19.042], [17.743, 15.402], [25.203, 16.492], [25.087, 9.942], [21.233, 10.724], [21.204, 10.975], [19.53, 11.07]], [0.0356, 0.0087, 3.1798]], [[[-32.446, 6.756], [-32.458, 7.051], [-35.703, 12.125], [-34.653, 13.205], [-2.764, 13.105], [-2.467, 10.159], [-4.035, 10.272], [-3.892, 6.675]], [-0.0005, -0.6365, 19.0259]], [[[14.639, 14.948], [14.877, 11.48], [10.017, 7.305], [9.479, 6.768], [9.303, 6.723], [9.617, 14.215]], [-0.7367, -0.0401, 22.1365]], [[[4.079, 3.878], [2.494, 2.779], [-2.338, 7.69], [-2.884, 13.106], [-1.566, 13.101], [-1.555, 16.471], [-1.361, 16.471], [4.046, 11.091]], [1.7084, 0.0065, 21.9929]], [[[33.126, 26.741], [32.799, 26.916], [32.763, 28.976], [34.798, 28.968], [33.408, 26.995]], [-1.4915, 0.0146, 63.0692]], [[[33.318, 27.075], [34.652, 28.968], [43.158, 28.933], [43.14, 24.556], [22.599, 24.657], [22.655, 29.017], [30.354, 28.986], [31.974, 27.491], [33.109, 26.887]], [-0.0062, -1.6386, 58.2099]], [[[27.984, -13.045], [18.479, -16.11], [20.243, -12.547], [24.228, -11.25]], [-0.5195, 1.619, 41.9592]], [[[24.14, -11.341], [26.143, -7.798], [26.361, -7.727], [28.068, -13.018], [27.818, -13.098]], [-1.5167, -0.4677, 42.5058]], [[[-31.896, -13.728], [-31.824, -13.513], [-34.838, -11.027], [-34.816, -4.774], [-34.341, -4.762], [-31.267, -10.364], [-31.089, -13.28], [-31.429, -13.278], [-31.429, -13.73]], [-1.1675, -0.0018, -25.9868]], [[[-30.765, -10.309], [-2.53, -10.279], [-2.291, -14.089], [-23.2, -14.025], [-23.197, -13.314], [-31.209, -13.279], [-31.379, -10.513], [-30.828, -10.502]], [-0.0011, 0.0241, 4.3194]], [[[17.211, -11.114], [17.177, -10.738], [17.354, -10.681], [17.696, -8.723], [21.791, -8.468], [21.818, -7.713], [25.953, -6.981], [26.198, -7.218], [26.397, -7.841], [26.224, -7.897], [24.265, -11.364], [20.28, -12.661]], [0.5382, -1.6291, -20.4129]], [[[16.467, -10.02], [17.299, -10.751], [17.325, -11.037], [20.366, -12.57], [18.632, -16.06], [18.435, -16.123]], [1.6224, 0.5206, -15.326]], [[[14.99, -11.553], [13.923, -12.651], [9.508, -11.782], [9.743, -4.873], [10.441, -4.93], [15.418, -9.138]], [-0.7326, 0.0323, 21.962]], [[[15.288, -9.185], [14.944, -8.895], [17.819, -8.715], [17.46, -10.772], [17.228, -10.848], [16.538, -10.242], [16.471, -10.032], [14.841, -11.706]], [-0.0328, 0.0636, 5.2583]], [[[21.14, 6.647], [15.996, 6.657], [9.306, 6.765], [9.935, 7.393], [14.753, 11.532], [14.709, 12.17], [19.546, 11.189], [21.312, 11.089], [21.544, 9.078]], [-0.038, -0.8535, 21.1443]], [[[22.459, 6.553], [21.006, 6.576], [21.423, 9.081], [21.218, 10.85], [25.088, 10.065], [25.087, 9.691], [25.382, 9.69], [22.782, 5.65]], [-0.2701, -0.8594, 25.8346]], [[[22.544, 6.672], [22.812, 5.921], [22.956, 6.144], [23.798, 4.413], [24.835, 3.31], [20.199, 1.768], [20.878, 5.802], [21.576, 6.686]], [-1.2807, -1.1967, 55.4769]], [[[3.953, 0.4], [3.41, 0.86], [4.031, 1.452], [9.503, -3.898], [9.895, -3.899], [9.631, -11.684], [9.945, -11.746], [9.588, -12.955], [9.57, -13.475], [9.214, -13.483], [3.937, -8.333]], [-1.6395, 0.0006, 35.3844]], [[[4.057, -8.332], [-1.253, -13.665], [-1.253, -13.849], [-1.575, -13.849], [-1.577, -14.092], [-2.411, -14.089], [-2.666, -10.031], [-1.888, -4.841], [-1.995, -4.607], [3.496, 0.944], [4.073, 0.456]], [1.711, -0.0053, 21.9417]], [[[-32.326, 6.756], [-36.991, 6.77], [-37.368, 6.894], [-36.865, 10.93], [-35.617, 12.214], [-32.34, 7.088]], [0.7598, -0.1504, 40.2218]], [[[-32.913, -3.526], [-32.03, -3.158], [-32.211, 1.168], [-32.494, 1.46], [2.923, 1.429], [3.588, 0.866], [-1.941, -4.724], [-2.212, -4.131], [-17.985, -4.051], [-31.883, -4.133]], [0.0011, 1.6859, 26.4674]], [[[-31.85, -4.013], [-17.986, -3.931], [-2.134, -4.011], [-1.764, -4.824], [-2.545, -10.036], [-2.522, -10.399], [-30.678, -10.429], [-30.741, -10.62], [-31.372, -10.633], [-31.386, -10.398], [-34.411, -4.884], [-34.816, -4.894], [-34.807, -2.272]], [0.0012, 0.6394, 17.2792]], [[[4.868, 2.16], [3.502, 0.782], [2.879, 1.309], [-32.219, 1.34], [-32.451, 6.876], [-4.017, 6.795], [-4.161, 10.401], [-2.479, 10.28], [-2.223, 7.744], [2.508, 2.935], [3.172, 3.395]], [-0.0019, -1.6762, 31.0778]], [[[4.782, 2.074], [3.067, 3.323], [3.959, 3.941], [3.926, 11.091], [9.309, 16.468], [9.67, 16.467], [9.668, 16.06], [9.816, 16.06], [9.413, 6.703]], [-1.6891, -0.0144, 35.768]], [[[9.299, 6.758], [9.309, 6.849], [9.441, 6.883], [21.161, 6.767], [21.148, 6.693], [21.726, 6.684], [20.991, 5.751], [20.331, 1.833], [20.213, 1.663], [19.814, 1.525], [19.831, 1.467], [19.453, 1.38], [19.226, 1.163], [18.773, 1.309], [3.917, 1.369]], [-0.0118, -1.6926, 31.3681]], [[[19.809, 1.124], [19.668, 1.602], [20.137, 1.764], [20.237, 1.907], [24.745, 3.406], [25.383, 2.726], [24.76, 2.585], [24.647, -0.573], [24.396, -0.492], [23.828, -1.382]], [-1.6999, 0.063, 61.6363]], [[[23.726, -1.318], [24.345, -0.35], [29.069, -1.864], [25.652, -6.688], [26.059, -7.084], [25.287, -7.222], [22.717, -2.902], [23.15, -2.224], [24.271, -1.658]], [-0.7205, 0.5791, 32.9231]], [[[9.612, 14.093], [9.696, 16.06], [13.354, 16.048], [13.353, 15.955], [14.571, 15.952], [14.648, 14.828]], [-0.6085, -0.9186, 33.3381]]];
// Aaneengesloten BAG-voet met afzonderlijke, uit 3D BAG passende dakvlakken.
solids.push(prism(footprint,BASE,3.1));
for (const [outline,plane] of roofs) solids.push(roofed(outline,[plane]));
// Zware westtoren met achtzijdige hoge spits.
const tc=[-36.3,1.7];
solids.push(prism(rect(-40.6,-32,-3.5,6.9),BASE,41.3));
solids.push(loft([[BASE,oct(tc,8.5)],[41.3,oct(tc,8.5)],[59.9,oct(tc,.9)]]));
// De tweede, slanke vieringruiter is in AHN en op alle overzichtsfoto's aanwezig.
const rc=[4.0,1.4];
solids.push(loft([[BASE,oct(rc,2.5)],[30,oct(rc,2.5)],[43.84,oct(rc,.9)]]));
const cuts=[];
for (const angle of [0,90,180,270]) cuts.push(niche(tc,angle,angle%180===0?4.3:5.2,0,2.1,27,38,.55));
for (const x of [-25,-18,-11,-4]) {
 cuts.push(niche([x,0],90,13.0,0,1.5,2.5,8,.45));
 cuts.push(niche([x,0],270,13.6,0,1.5,2.5,8,.45));
}
const joined=Manifold.union(solids).subtract(Manifold.union(cuts));
const all=Manifold.union(joined.decompose().filter(part => part.volume() > 1)); const nodes=[[`building:NL.IMBAG.Pand.0736100000000699`,all]];
const META={name:"Heilig Hart van Jezuskerk Vinkeveen",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0736100000000699"],plate:false,
 description:"RD (124073,469765), +X langs schip naar koor; neogotische kruiskerk met westtoren, vieringruiter en pastorie. Maaiveld circa NAP -1,84 m.",realWorld:{groundNapM:-1.835,towerTopM:59.9},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/514685","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0736100000000699","https://commons.wikimedia.org/wiki/Category:Heilig_Hartkerk,_Vinkeveen","https://stjandedoper-vechtenvenen.nl/vinkeveen/kerkgebouw/","PDOK AHN DSM/DTM 0,5 m"]};
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



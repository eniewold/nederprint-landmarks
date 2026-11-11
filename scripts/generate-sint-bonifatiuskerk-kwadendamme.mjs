import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-bonifatiuskerk-kwadendamme");
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

const SLUG="sint-bonifatiuskerk-kwadendamme";
const ORIGIN=[49914,383722], X_AXIS=[0.5,-0.866], BASE=-0.5;
const GROUND_SAMPLES=[[-30,-12],[-28,10],[-6,16],[12,17],[30,8],[25,-18]];
const solids=[];
const footprint=[[2.619, 3.582], [2.61, 4.168], [1.439, 4.152], [1.408, 6.576], [2.044, 6.585], [2.025, 7.984], [1.615, 7.978], [1.607, 8.65], [2.775, 8.665], [2.767, 9.285], [3.303, 9.291], [3.311, 8.7], [3.81, 8.706], [3.758, 12.659], [9.428, 12.73], [9.48, 8.794], [12.022, 8.827], [12.005, 10.255], [13.325, 10.272], [13.311, 11.303], [19.415, 11.382], [19.515, 3.643], [19.898, 3.647], [19.909, 2.842], [19.267, 2.834], [19.282, 1.708], [21.086, 1.731], [21.079, 2.265], [21.598, 2.272], [21.605, 1.66], [23.045, 0.865], [23.399, 1.271], [23.716, 0.8], [23.386, 0.422], [24.28, -0.906], [24.822, -0.898], [24.829, -1.409], [24.332, -1.415], [24.353, -2.945], [24.789, -2.94], [24.795, -3.509], [24.425, -3.514], [22.964, -5.185], [23.227, -5.574], [22.884, -5.963], [22.529, -5.434], [21.081, -6.409], [21.089, -7.032], [20.539, -7.04], [20.534, -6.608], [18.728, -6.361], [18.746, -7.773], [19.363, -7.766], [19.368, -8.266], [19.09, -8.27], [19.168, -14.295], [13.282, -14.37], [13.288, -14.749], [12.806, -14.756], [12.798, -14.233], [3.685, -14.349], [3.692, -14.862], [3.067, -14.871], [3.056, -14.056], [2.228, -14.068], [2.221, -13.582], [2.833, -13.575], [2.812, -12.032], [1.594, -12.047], [1.559, -9.476], [2.71, -9.46], [2.7, -8.659], [-1.458, -8.713], [-1.45, -9.471], [-2.025, -9.479], [-2.033, -8.805], [-6.271, -8.86], [-6.261, -9.581], [-6.854, -9.587], [-6.863, -8.908], [-10.952, -8.961], [-10.944, -9.662], [-11.534, -9.671], [-11.541, -9.054], [-15.649, -9.107], [-15.641, -9.733], [-16.164, -9.739], [-16.172, -9.122], [-18.898, -9.156], [-18.89, -9.818], [-19.493, -9.827], [-19.502, -9.219], [-20.36, -9.23], [-20.369, -8.599], [-19.86, -8.593], [-19.873, -7.658], [-21.947, -7.684], [-21.974, -5.556], [-25.094, -5.597], [-25.159, -0.609], [-23.785, -0.59], [-23.805, 0.955], [-24.461, 1.317], [-24.188, 1.628], [-23.656, 1.634], [-22.88, 2.521], [-22.891, 3.229], [-22.434, 3.234], [-22.426, 2.624], [-20.026, 3.259], [-20.034, 3.777], [-19.564, 3.783], [-19.557, 3.317], [-7.199, 3.476], [-7.206, 3.985], [-6.524, 3.993], [-6.517, 3.414], [-2.306, 3.468], [-2.313, 4.117], [-1.732, 4.124], [-1.723, 3.525]];
const roofs=[[[[9.536, 9.076], [3.746, 9.012], [3.697, 12.718], [9.487, 12.791]], [0.0019, -0.0068, 3.2093]], [[[13.473, 11.148], [13.702, 3.476], [8.638, -2.221], [8.304, -2.22], [8.079, 9.18], [9.534, 9.196], [9.539, 8.854], [11.961, 8.886], [11.944, 10.314], [13.264, 10.331], [13.253, 11.15]], [-1.3588, -0.0202, 29.9183]], [[[3.382, -8.515], [2.853, -13.301], [2.77, -13.297], [2.753, -12.093], [1.535, -12.108], [1.499, -9.417], [2.649, -9.401], [2.646, -9.178], [3.202, -8.519]], [0.0477, -0.0075, 3.2785]], [[[2.765, -12.996], [3.271, -8.438], [8.44, -2.299], [8.665, -14.26], [7.179, -14.365], [3.746, -14.408], [3.748, -14.606], [3.004, -14.658], [2.997, -14.117], [2.64, -14.121], [2.707, -13.515], [2.772, -13.515]], [1.3616, 0.0185, 7.2842]], [[[3.259, -8.638], [2.648, -9.362], [2.641, -8.72], [-1.398, -8.773], [-1.389, -9.53], [-2.085, -9.54], [-2.092, -8.866], [-6.211, -8.919], [-6.201, -9.64], [-6.913, -9.648], [-6.922, -8.969], [-10.891, -9.021], [-10.884, -9.721], [-11.593, -9.731], [-11.601, -9.115], [-15.588, -9.166], [-15.58, -9.792], [-16.224, -9.8], [-16.232, -9.182], [-18.837, -9.216], [-18.829, -9.877], [-19.552, -9.888], [-19.561, -9.279], [-20.419, -9.291], [-20.429, -8.54], [-19.921, -8.534], [-19.934, -7.647], [-18.366, -3.621], [-18.64, -2.892], [8.514, -2.397], [3.386, -8.488], [3.368, -8.635]], [-0.0246, 1.1862, 21.7796]], [[[8.327, -2.521], [8.299, -2.1], [8.584, -2.101], [13.581, 3.52], [13.577, 3.636], [19.065, 4.135], [19.205, -2.164]], [0.0485, -1.2711, 15.0964]], [[[13.356, 11.029], [13.254, 11.03], [13.25, 11.362], [19.474, 11.442], [19.569, 4.061], [13.581, 3.516]], [-0.0007, 0.0041, 4.3677]], [[[19.302, -6.501], [18.789, -6.43], [18.805, -7.712], [19.422, -7.706], [19.425, -7.958], [15.361, -8.185], [15.156, -9.957], [13.622, -8.275], [13.598, -8.035], [8.248, -2.404], [19.202, -2.044], [19.205, -2.152], [19.462, -2.153], [19.244, -3.869]], [-0.0291, 1.2386, 21.8662]], [[[14.291, -13.865], [8.545, -14.269], [8.32, -2.306], [13.714, -7.982]], [-1.3781, -0.0362, 30.0809]], [[[19.124, -3.862], [19.341, -2.153], [20.428, -2.145], [23.08, -5.414], [22.551, -5.491], [21.142, -6.441], [21.15, -7.091], [20.48, -7.101], [20.474, -6.66], [19.182, -6.484]], [-0.3436, 1.1677, 24.3883]], [[[23.031, 0.941], [23.405, 1.369], [23.792, 0.796], [23.45, 0.405], [20.428, -2.265], [19.087, -2.272], [18.977, 2.697], [19.331, 2.526], [19.341, 1.769], [20.848, 1.788], [22.869, 0.806], [22.701, 1.121]], [-0.3544, -1.1526, 19.4617]], [[[-22.007, -7.745], [-22.029, -5.936], [-20.829, -7.73]], [2.1604, 2.2727, 77.7389]], [[[8.157, -2.099], [8.419, -2.101], [8.447, -2.518], [-18.595, -3.011], [-19.358, -0.969], [-18.966, -0.089], [-20.287, -0.218], [-21.752, 0.984], [-20.269, 1.466], [-20.878, 3.096], [-20.087, 3.305], [-20.095, 3.837], [-19.505, 3.844], [-19.498, 3.378], [-7.26, 3.535], [-7.267, 4.044], [-6.465, 4.054], [-6.458, 3.475], [-2.366, 3.528], [-2.374, 4.176], [-1.673, 4.185], [-1.664, 3.586], [2.558, 3.641], [2.554, 3.827], [2.828, 3.538], [3.019, 3.54]], [0.0197, -1.1921, 15.586]], [[[-23.798, 0.193], [-23.855, 0.174], [-23.945, 1.691], [-23.683, 1.694], [-23.16, 2.293], [-21.506, 0.937], [-22.128, 0.735], [-21.948, -0.38], [-23.726, -0.554]], [1.464, -0.1486, 40.6869]], [[[2.966, 3.419], [2.777, 3.417], [2.558, 3.649], [2.551, 4.107], [1.38, 4.092], [1.347, 6.635], [1.984, 6.644], [1.966, 7.923], [1.555, 7.917], [1.546, 8.71], [2.715, 8.724], [2.707, 9.344], [3.362, 9.351], [3.37, 8.761], [3.749, 8.765], [3.744, 9.132], [8.199, 9.181], [8.424, -2.221], [8.104, -2.219]], [1.3611, 0.0302, 7.319]], [[[-22.414, -5.426], [-20.131, -5.585], [-19.229, -6.23], [-19.833, -7.717], [-20.972, -7.732], [-22.026, -6.156], [-22.033, -5.617], [-22.323, -5.62]], [-0.1019, 1.3489, 23.4061]], [[[14.224, -14.418], [13.602, -8.076], [15.067, -9.682], [15.254, -8.071], [19.424, -7.838], [19.429, -8.325], [19.151, -8.329], [19.229, -14.354]], [-0.0103, -0.0175, 4.2381]], [[[20.333, -2.182], [24.853, -3.333], [24.856, -3.569], [24.453, -3.574], [23.039, -5.19], [23.17, -5.384], [22.945, -5.437]], [-1.0234, 0.6223, 37.0718]], [[[20.462, -2.339], [20.315, -2.205], [23.42, 0.539], [24.312, -0.845], [24.896, -0.838], [24.692, -1.471], [24.393, -1.475], [24.404, -2.363], [24.113, -3.269]], [-1.2245, -0.1679, 39.3888]], [[[-23.239, 2.203], [-22.94, 2.543], [-22.95, 3.222], [-22.375, 3.23], [-22.367, 2.702], [-20.762, 3.127], [-20.113, 1.39], [-21.642, 0.893]], [0.1718, -1.7248, 14.253]]];

// Eenbeukige kruiskerk met transept, vijfzijdig koor en afzonderlijke dakvlakken.
solids.push(prism(footprint,BASE,3));for(const [outline,plane] of roofs)solids.push(roofed(outline,[plane]));
// Vierkante westtoren, hoog oprijzende achtzijdige spits en zuidelijke traptoren.
const tc=[-21.8,-2.6];solids.push(prism(sq(tc,2.9),BASE,29.4));
solids.push(loft([[29.1,oct(tc,5.4)],[44.5,oct(tc,0.9)]]));
const stair=[-20.5,-6.5];solids.push(loft([[BASE,oct(stair,2.5)],[16.2,oct(stair,2.5)],[18.4,oct(stair,0.9)]]));
// Kleine dakruiter op de viering, ondersteund in het hoofdvolume.
const fleche=[8.1,-2.5];solids.push(prism(oct(fleche,1.3),BASE,20.7));solids.push(loft([[20.4,oct(fleche,1.3)],[26.5,oct(fleche,0.9)]]));
let all=Manifold.union(Manifold.union(solids).decompose().filter(part=>part.volume()>1));const cuts=[];
for(const a of [0,90,180,270])for(const s of [-.65,.65])cuts.push(niche(tc,a,2.9,s,0.9,23,26.2,0.35));
for(const x of [-15,-10,-5,0])for(const [a,d] of [[90,4.0],[270,9.7]])cuts.push(niche([x,0],a,d,0,1.1,3,6.5,0.35));
cuts.push(niche(tc,180,2.9,0,1.4,0,3,0.35));
all=all.subtract(Manifold.union(cuts));const nodes=[[`building:NL.IMBAG.Pand.0654100000037605`,all]];
const META={name:"Sint Bonifatiuskerk Kwadendamme",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0654100000037605"],plate:false,description:"Eenbeukige neogotische kruiskerk met vijfzijdig koor, westtoren met naaldspits en dakruiter.",realWorld:{groundNapM:1.54,towerTopM:44.5},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/9999","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0654100000037605","https://commons.wikimedia.org/wiki/Category:Sint-Bonifatiuskerk_(Kwadendamme)","PDOK AHN DSM/DTM 0,5 m"]};
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


import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-joriskerk-amersfoort");
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

const SLUG="sint-joriskerk-amersfoort";const ORIGIN=[155220,463166],X_AXIS=[.985,-.173],BASE=-.5;
const GROUND_SAMPLES=[[-38,-20],[-38,15],[-20,20],[0,19],[23,15],[40,0],[35,-12],[0,-23]];
const solids=[];
// Driebeukige hallenkerk met drie afzonderlijke nokken, maaiveld circa NAP +3,3 m.
for(const [y0,y1,yc] of [[-20.2,-8.0,-14.1],[-8.15,3.1,-2.5],[3.0,14.4,8.7]]) solids.push(roofed(rect(-35.6,21.8,y0,y1),ridgeV(yc,26.5,1.38)));
// Smal middenkoor met vijfzijdige sluiting en afzonderlijke dakvlakken.
const choir=[[21.5,-8],[32.8,-8],[37.0,-5.8],[39,-2.8],[39,.4],[36.9,3.2],[32.8,4.5],[21.5,4.5]];
solids.push(roofed(choir,[...ridgeV(-2.2,26.2,1.38),facet([32.8,-8],[37,-5.8],16,1.38,[27,-2]),facet([37,-5.8],[39,-2.8],16,1.38,[27,-2]),facet([39,-2.8],[39,.4],16,1.38,[27,-2]),facet([39,.4],[36.9,3.2],16,1.38,[27,-2]),facet([36.9,3.2],[32.8,4.5],16,1.38,[27,-2])]));
// Ingebouwde westtoren met leien naald. De hoge spits is onvolledig in PDOK, AHN meet NAP +54,8 m.
const tc=[-23.2,-11.6];solids.push(prism(rect(-28.2,-18.2,-15.8,-7.5),BASE,35.0));
solids.push(loft([[34.8,oct(tc,5.5)],[53.0,oct(tc,.9)]]));
// Lage aangebouwde vleugels die tot dit BAG-pand behoren.
solids.push(roofed(rect(-35,-18.6,14.3,21.8),[...ridgeV(18,8.6,.55),[.8,0,8.6+.8*33],[-.8,0,8.6-.8*-20]]));
solids.push(roofed(rect(-37.0,-14.2,-27.5,-20),[...ridgeV(-23.75,7.8,.65),[.65,0,7.8+.65*33],[-.65,0,7.8-.65*-18]]));
solids.push(roofed(rect(-10,17.2,14.2,18),ridgeV(16,6.4,.75)));
solids.push(roofed(rect(22,33,4.2,13.2),ridgeV(8.7,12.3,.9)));
// Grote steunberen tussen traveeën en op de koorsluiting.
for(const x of [-33,-28,-23,-18,-13,-8,-3,2,7,12,17,21]) {solids.push(buttress([x,14.4],180,1.1,1.35,17.3,16.0));solids.push(buttress([x,-20.2],0,1.1,1.35,17.3,16.0));}
for(const x of [24,29,33]) solids.push(buttress([x,-8],0,1.1,1.2,14.8,13.5));
for(const [x,y,a] of [[37,-5.8,-45],[39,-2.8,-90],[39,.4,-90],[36.9,3.2,-135]]) solids.push(buttress([x,y],a,1.1,1.1,14.8,13.5));
// Sluit zeer smalle voegen tussen koor en aangebouwde panden voor de print.
for(const [x0,x1,y0,y1] of [[29.5,30.5,-8.4,-7.9],[33.3,34.5,-8.5,-7.1],[34.7,36.6,-7.1,-6.2]]) solids.push(prism(rect(x0,x1,y0,y1),BASE,11));
// Monumentale portaalmassa op de zuidgevel.
solids.push(roofed(rect(-12,-6,-22.2,-19.9),ridgeU(-9,13,1.2)));
const neighbour0307100000332458=Manifold.union([prism([[26.004, -8.848], [25.934, -8.865], [25.891, -9.859], [26.669, -9.904], [27.278, -12.639], [26.567, -13.103], [27.853, -15.259], [29.065, -16.171], [28.831, -16.477], [32.951, -19.605], [35.506, -16.263], [29.527, -11.772], [30.376, -11.032], [30.381, -8.258], [29.625, -8.295], [29.599, -6.774], [25.993, -6.775]],BASE,3.0),roofed([[28.567, -7.846], [27.185, -12.224], [27.278, -12.639], [26.567, -13.103], [26.892, -13.647], [28.917, -11.393], [29.527, -11.772], [30.376, -11.032], [30.381, -8.258], [29.625, -8.295], [29.615, -7.67]],[[0.1343, -0.0613, 2.3735]]),roofed([[27.185, -12.224], [28.567, -7.846], [28.905, -6.774], [25.993, -6.775], [26.004, -8.848], [25.934, -8.865], [25.891, -9.859], [26.669, -9.904]],[[-0.0227, 0.0401, 5.3665]]),roofed([[26.892, -13.647], [27.853, -15.259], [29.065, -16.171], [28.831, -16.477], [32.951, -19.605], [35.506, -16.263], [29.602, -11.829], [29.527, -11.772], [28.917, -11.393]],[[0.0017, -0.0155, 10.0429]])]);
const neighbour0307100000310421=Manifold.union([prism([[39.138, -7.823], [39.102, -7.751], [38.224, -8.242], [37.572, -6.84], [34.27, -6.961], [34.326, -8.4], [33.436, -8.309], [33.411, -6.788], [30.413, -6.776], [30.381, -8.258], [30.376, -11.032], [29.527, -11.772], [35.506, -16.263], [40.918, -10.039]],BASE,3.0),roofed([[32.797, -14.23], [38.154, -8.09], [37.572, -6.84], [34.27, -6.961], [34.326, -8.4], [33.436, -8.309], [33.426, -7.672], [33.192, -7.946], [32.211, -7.22], [30.399, -7.411], [30.381, -8.258], [30.376, -11.032], [29.527, -11.772]],[[0.7161, -0.6119, -20.4197]]),roofed([[38.154, -8.09], [32.797, -14.23], [35.506, -16.263], [40.918, -10.039], [39.138, -7.823], [39.102, -7.751], [38.224, -8.242]],[[-0.7325, 0.6518, 45.0719]])]);
const neighbour0307100000536569=Manifold.union([prism([[15.723, -21.409], [15.61, -17.831], [11.743, -17.917], [11.797, -20.501], [13.546, -21.452]],BASE,3.0),roofed([[13.546, -21.452], [15.723, -21.409], [15.635, -18.622], [11.751, -18.237], [11.797, -20.501]],[[-0.012, 0.0048, 6.3853]])]);
const neighbour0307100000313239=Manifold.union([prism([[5.932, -23.149], [-3.042, -23.523], [-3.387, -20.537], [-3.033, -20.522], [-3.021, -19.758], [-3.828, -19.805], [-3.873, -18.063], [-7.9, -18.181], [-7.844, -19.984], [-8.383, -20.01], [-8.242, -22.594], [-8.316, -22.596], [-8.299, -23.755], [-9.147, -23.646], [-9.416, -25.767], [-9.368, -28.752], [-1.852, -28.438], [-1.834, -28.901], [5.302, -28.603], [5.282, -28.142], [5.525, -28.211]],BASE,3.0),roofed([[5.638, -26.793], [5.339, -26.808], [5.369, -28.166], [5.525, -28.211]],[[0.7829, 0.7683, 27.5002]]),roofed([[-8.975, -28.735], [-8.954, -28.301], [-6.531, -26.231], [-8.52, -24.67], [-8.331, -23.75], [-8.725, -23.71], [-9.158, -23.721], [-9.416, -25.767], [-9.368, -28.752]],[[0.876, -0.0388, 15.5725]]),roofed([[-8.3, -23.699], [-3.042, -23.523], [-3.163, -22.484], [-8.242, -22.594], [-8.316, -22.596]],[[-0.0148, 0.8485, 27.9798]]),roofed([[5.932, -23.149], [-0.463, -23.415], [-1.175, -24.646], [-1.616, -25.41], [-1.836, -25.473], [-1.469, -27.154], [5.339, -26.808], [5.638, -26.793]],[[0.0044, -0.1292, 6.1126]]),roofed([[-3.021, -19.758], [-3.828, -19.805], [-3.841, -19.289], [-7.875, -18.988], [-7.844, -19.984], [-8.383, -20.01], [-8.242, -22.594], [-3.163, -22.484], [-3.387, -20.537], [-3.033, -20.522]],[[0.0254, -0.9558, -12.4614]]),roofed([[-8.975, -28.735], [-1.852, -28.438], [-1.834, -28.901], [5.302, -28.603], [5.282, -28.142], [5.369, -28.166], [5.339, -26.808], [-1.469, -27.154], [-1.836, -25.473], [-4.103, -26.13], [-5.97, -26.671], [-6.531, -26.231], [-8.954, -28.301]],[[-0.0557, 1.0523, 38.1084]]),roofed([[-3.042, -23.523], [-8.3, -23.699], [-8.331, -23.75], [-8.52, -24.67], [-6.531, -26.231], [-5.97, -26.671], [-4.103, -26.13], [-1.836, -25.473], [-1.616, -25.41], [-1.175, -24.646], [-0.463, -23.415], [-2.964, -23.519]],[[0.0344, -1.1109, -18.0459]])]);
let complex=Manifold.union(solids);const cuts=[];
for(const x of [-30,-25,-20,-15,-10,-5,0,5,10,15,19]) cuts.push(niche([x,0],90,14.4,0,1.4,10,15.5,.35));
for(const x of [-5,0,5,10,15,19]) cuts.push(niche([x,0],270,20.2,0,1.4,5,15.5,.35));
for(const side of [0,90,180,270]) for(const s of [-1.6,1.6]) cuts.push(niche(tc,side,side%180===0?5:4.15,s,1.1,29,33,.3));
complex=complex.subtract(Manifold.union(cuts));const nodes=[["building:kerk",complex],["building:0307100000332458",neighbour0307100000332458],["building:0307100000310421",neighbour0307100000310421],["building:0307100000536569",neighbour0307100000536569],["building:0307100000313239",neighbour0307100000313239]],all=Manifold.union(nodes.map(([,s])=>s));
const META={name:"Sint-Joriskerk Amersfoort",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["0307100000319369","0307100000332458","0307100000310421","0307100000536569","0307100000313239"],plate:false,description:"Driebeukige hallenkerk met ingebouwde toren, drie zadeldaken en vijfzijdig koor.",realWorld:{groundNapM:3.29,naveRidgeM:26.5,towerTopM:53},sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/7882","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0307100000319369","https://commons.wikimedia.org/wiki/Category:Sint-Joriskerk_(Amersfoort)","https://www.dbnl.org/tekst/sten009monu01_01/sten009monu01_01_0011.php","PDOK AHN DSM/DTM 0,5 m"]};
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

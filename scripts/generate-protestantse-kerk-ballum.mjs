import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "protestantse-kerk-ballum");
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


// Protestantse kerk (Ballum, Ameland), Camminghastraat 14: sobere zaalkerk uit 1832 ter vervanging van de middeleeuwse
// kerk, rijksmonument 7652 (om de preekstoel van 1604). Baksteen onder een schilddak van rode pannen met een gootlijst
// rondom, rondboogvensters in de lange gevels, de ingang met waaiervormig bovenlicht tussen twee vensters in de
// westgevel, een dakkapel met halfrond venster op het westelijke schild en een lage platte aanbouw tegen de oostgevel.
// De vrijstaande klokkentoren ten zuidwesten (1755, verhoogd 1870, rijksmonument 7647) is een eigen BAG-pand en hoort
// niet bij dit model.
const SLUG = "protestantse-kerk-ballum";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van de westgevel naar de oostgevel, onder 6,81 graden in RD (de
// BAG-gevels van het schip lopen in dat stelsel binnen 3 cm evenwijdig en haaks; de nok in het AHN ligt op v = 0,01),
// +v naar het noorden. Oorsprong RD (174914,56; 606466,66) in het hart van het schip, z = 0 op het laagste maaiveld
// rond de voet (NAP +3,30 m, AHN-dtm aan de zuid- en westkant; aan de noordkant ligt het terrein 0,25 m hoger).
const AXIS_DEG = 6.81;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [174914.56, 606466.66];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 44,22, zuid 44,20 en 44,24, noord 44,48,
// 44,34 en 44,48 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 44.2;
const GROUND_SAMPLES = [[-11, 0], [-5, -5.6], [5, -5.6], [0, 5.8], [-5, 5.8], [6, 5.8]];

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Schip (BAG 0060100000127831): westgevel u = -9,69, oostgevel u = 9,70, zuidgevel v = -4,52, noordgevel v = 4,52.
const U0 = -9.69, U1 = 9.7, S = -4.52, N = 4.52;
// Schilddak (vlakken gepast op het AHN-DSM, rms 3-8 cm; 3D BAG LoD2.2 geeft dezelfde vlakken): nok +9,61 m (NAP 12,91)
// van u = -6,77 tot 6,31, goot +4,65 m (NAP 7,95) aan alle vier de gevels. Lange dakvlakken helling 1,097 (47,7 graden),
// westschild 1,70 (59,5 graden), oostschild 1,46 (55,6 graden; de nok eindigt in AHN en 3D BAG 0,46 m dichter bij het
// midden dan aan de westkant).
const RIDGE = 9.61, EAVE = 4.65, RIDGE_W = -6.77, RIDGE_E = 6.31;
const PITCH = (RIDGE - EAVE) / N, PITCH_W = (RIDGE - EAVE) / (RIDGE_W - U0), PITCH_E = (RIDGE - EAVE) / (U1 - RIDGE_E);
const ROOF = [
  [0, -PITCH, RIDGE],
  [0, PITCH, RIDGE],
  [PITCH_W, 0, RIDGE - PITCH_W * RIDGE_W],
  [-PITCH_E, 0, RIDGE + PITCH_E * RIDGE_E],
];
// Gootlijst rondom: bak 0,35 m buiten de gevels, bovenkant +4,5 m (AHN-DSM 0,4 m buiten de gevel NAP 7,8), onderkant
// onder 47 graden uit de gevel vanaf +3,78 m.
const CORNICE = 0.35, CORNICE_LOW = 3.78, CORNICE_EDGE = 4.15, CORNICE_TOP = 4.5;
// Dakkapel op het westschild (foto's RCE 20345660 en 2021): 1,0 m breed, voorkant van +6,3 tot +7,2 m, zadeldakje
// (helling 1,1) met de nok op +7,75 m.
const DORMER_W = 1.0, DORMER_LOW = 6.3, DORMER_EAVE = 7.2, DORMER_PITCH = 1.1;
const DORMER_U = (DORMER_LOW - ROOF[2][2]) / PITCH_W;
// Aanbouw tegen de oostgevel (BAG/3D BAG/AHN): u = 9,70 .. 15,48, v = -1,95 .. 2,04, plat dak op +2,93 m (NAP 6,23).
const ANNEX = [U1 - 0.2, 15.48, -1.95, 2.04], ANNEX_TOP = 2.93;
// Vensters (foto's RCE 20345660, 20276225 en 2021): vier rondboogvensters per lange gevel op u = ±2,1 en ±6,3, twee in
// de westgevel op v = ±2,45; 1,1 m breed, borstwering +1,4, kämpfer +3,1 (de boog als spitse top tot +3,98).
// Westdeur 1,4 m breed met bovenlicht, kämpfer +2,45 (top +3,57).
const WIN_W = 1.1, WIN_SILL = 1.4, WIN_SPRING = 3.1, DOOR_W = 1.4, DOOR_SPRING = 2.45;

const rectGrow = (d) => rect(U0 - d, U1 + d, S - d, N + d);
const solids = [];
// ---------- schip: muren onder het schilddak, gootlijst rondom ----------
solids.push(roofed(rect(U0, U1, S, N), ROOF));
solids.push(Manifold.hull([
  ...rect(U0, U1, S, N).map(([x, y]) => [x, y, CORNICE_LOW]),
  ...rectGrow(CORNICE).flatMap(([x, y]) => [[x, y, CORNICE_EDGE], [x, y, CORNICE_TOP]]),
]));
// ---------- dakkapel op het westschild ----------
// Het deel onder het schild valt weg in het schip; de voorkant staat verticaal op u = DORMER_U.
solids.push(roofed(rect(DORMER_U, RIDGE_W, -DORMER_W / 2, DORMER_W / 2), [
  [0, -DORMER_PITCH, DORMER_EAVE + (DORMER_PITCH * DORMER_W) / 2],
  [0, DORMER_PITCH, DORMER_EAVE + (DORMER_PITCH * DORMER_W) / 2],
]));
// ---------- aanbouw tegen de oostgevel ----------
solids.push(prism(rect(...ANNEX), BASE, ANNEX_TOP));

// ---------- nissen: vensters en deur ----------
const cuts = [];
for (const u of [-6.3, -2.1, 2.1, 6.3]) {
  cuts.push(niche([0, 0], 270, -S, u, WIN_W, WIN_SILL, WIN_SPRING, 0.35));
  cuts.push(niche([0, 0], 90, N, -u, WIN_W, WIN_SILL, WIN_SPRING, 0.35));
}
for (const v of [-2.45, 2.45]) cuts.push(niche([0, 0], 180, -U0, -v, WIN_W, WIN_SILL, WIN_SPRING, 0.35));
cuts.push(niche([0, 0], 180, -U0, 0, DOOR_W, BASE, DOOR_SPRING, 0.4));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Protestantse kerk Ballum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0060100000127831"],
  plate: false,
  description:
    "Protestantse kerk van Ballum op Ameland (1832): zaalkerk onder een schilddak (nok +9,61 m, goot +4,65 m) met gootlijst rondom, vier rondboogvensters in elke lange gevel, de westgevel met ingang en twee vensters, een dakkapel op het westschild en de platte aanbouw tegen de oostgevel; de vrijstaande klokkentoren is een eigen pand en zit niet in dit model. Oorsprong RD (174914,56; 606466,66) in het hart van het schip op het laagste maaiveld (NAP +3,30 m), X-as langs de nok van west naar oost onder 6,81 graden. Vensters en deur als blinde nissen met een spitse top voor print op 1:1000.",
  realWorld: {
    built: "1832, ter vervanging van de middeleeuwse kerk op het kerkhof aan de Smitteweg (gesloopt 1838); preekstoel van 1604 uit Harlingen; dakkapel op het westschild",
    monument: 7652,
    groundNapM: 3.3,
    ridgeM: RIDGE,
    eaveM: EAVE,
    corniceTopM: CORNICE_TOP,
    roofPitchDeg: +((Math.atan(PITCH) * 180) / Math.PI).toFixed(1),
    westHipPitchDeg: +((Math.atan(PITCH_W) * 180) / Math.PI).toFixed(1),
    eastHipPitchDeg: +((Math.atan(PITCH_E) * 180) / Math.PI).toFixed(1),
    annexTopM: ANNEX_TOP,
    baseM: BASE,
  },
  sources: [
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/7652",
    "https://www.wikidata.org/wiki/Q4011696",
    "https://www.openstreetmap.org/way/267926158",
    "https://www.dbnl.org/tekst/sten009monu06_01/sten009monu06_01_0021.php (Monumenten in Nederland, Fryslân: Ballum)",
    "Wikimedia Commons: RCE 20345660 en 20276225, 'Hervormde kerk in Ballum (Ameland).jpg', '2021-10-12-Hervormde kerk Ballum-4911.jpg', 'Ballum Ameland toren kerk.jpg', 'Hervormde kerk Ballum.jpg'",
    "BAG pand 0060100000127831 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
    "PDOK AHN dsm_05m/dtm_05m",
  ],
};
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
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
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

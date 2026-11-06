import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-walburgisbasiliek-arnhem");
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


const SLUG = "sint-walburgisbasiliek-arnhem";
const BASE = -0.5;
const ORIGIN = [191170,443535];
const X_AXIS = [0.99419,0.10760];
const GROUND_NAP = 12.70;
// 3D BAG: de schip- en dwarsnok op NAP +41,1 m, de goten circa +33,5 m.
const RIDGE = 41.1-GROUND_NAP;
const walls = [];
// Langsschip en dwarsarm; de dakvlakken komen samen in een kilgoot.
walls.push(roofed(rect(-20.5,18.2,-3.8,6.4),ridgeV(1.3,RIDGE,1.35)));
walls.push(roofed(rect(-4.0,5.6,-10.1,12.1),ridgeU(.8,RIDGE,1.35)));
// Flankerende zijbeuken met hellende daken (geen horizontale hoogteplakken).
for(const side of [-1,1]) {
 const inner=side<0?-3.8:6.4,outer=side<0?-10.1:12.1;
 const a=side<0?1.18:-1.18, c=(33.5-GROUND_NAP)-a*inner;
 walls.push(roofed(rect(-15.6,17.0,Math.min(inner,outer),Math.max(inner,outer)),[[0,a,c]]));
}
// Driezijdige koorsluiting, met een lager schilddak.
const apse=[[17.8,-3.9],[24.6,-3.9],[28,-.1],[28,3.3],[24.5,6.8],[17.8,6.8]];
walls.push(roofed(apse,[...ridgeV(1.4,37.5-GROUND_NAP,1.1),
 facet(apse[1],apse[2],30.2-GROUND_NAP,1.1,[21,1.4]),
 facet(apse[2],apse[3],30.2-GROUND_NAP,1.1,[21,1.4]),
 facet(apse[3],apse[4],30.2-GROUND_NAP,1.1,[21,1.4])]));
// Lage kapellen aan de zuidzijde: afzonderlijke dwarskapjes volgens de ortho.
for(const [x0,x1] of [[-20,-15.4],[-15.4,-10.3],[-10.3,-4.5],[-4.5,.5],[.5,5.5],[5.5,10.8]]) {
 const mid=(x0+x1)/2;
 walls.push(roofed(rect(x0,x1,-14.5,-10.0),ridgeU(mid,20.9-GROUND_NAP,0.7)));
}
// De grotere oostelijke kapel heeft een veelhoekige sluiting en eigen schilddak.
const chapel=[[10.8,-14.4],[18.2,-14.4],[20.3,-12],[20.3,-10.2],[17.2,-7.4],[10.8,-9.8]];
walls.push(roofed(chapel,[...ridgeV(-11.8,22.1-GROUND_NAP,0.75), facet(chapel[1],chapel[2],18.4-GROUND_NAP,.75,[15,-11])]));
// Twee westtorens met zeshoekig insnoerende dakvoeten en spitsen.
for(const cy of [-8.5,8.5]) {
 const cx=-19.0;
 walls.push(prism(rect(cx-3.2,cx+3.2,cy-3.1,cy+3.1),BASE,35.7));
 // De geknikte, uitlopende dakvoet staat schuin op de toren en is steunloos printbaar.
 walls.push(loft([[34.9,sq([cx,cy],3.05)],[35.6,sq([cx,cy],3.7)],[37.1,sq([cx,cy],2.4)],[48.4,sq([cx,cy],.45)]]));
 // Uitwendige hoeksteunberen met schuine bovenzijde.
 for(const x of [cx-3,cx+3]) for(const y of [cy-2.9,cy+2.9])
  walls.push(loft([[BASE,sq([x,y],.7)],[28.5,sq([x,y],.7)],[30.0,sq([x,y],.3)]]));
}
// Middengedeelte van de westgevel met de hoge ingang en het spitsvenster.
walls.push(roofed(rect(-21.1,-16.8,-5.4,5.5),ridgeV(0,24.5,1.2)));
// Steunberen langs de kapellen en de buitenmuur van de zuid- en noordbeuk.
for(const x of [-15.4,-10.3,-4.5,5.5,10.8]) {
 walls.push(buttress([x,-14.45],0,1.05,1.0,9.3,8.3));
 walls.push(buttress([x,12.05],180,1.05,1.0,14.0,13.0));
}
for(const x of [-3.6,5.2]) {walls.push(buttress([x,-10.0],0,1.05,1.0,18,17));walls.push(buttress([x,12.0],180,1.05,1.0,18,17));}
let complex=Manifold.union(walls);
const cuts=[];
// Galmgaten in beide torens als ondiepe, spits toelopende nissen.
for(const cy of [-8.5,8.5]){
 for(const s of [-1.05,1.05]) {
  cuts.push(niche([-19,cy],180,3.2,s,1.0,29.0,33.2,.35));
  cuts.push(niche([-19,cy],0,3.2,s,1.0,29.0,33.2,.35));
  cuts.push(niche([-19,cy],90,3.1,s,1.0,29.0,33.2,.35));
  cuts.push(niche([-19,cy],270,3.1,s,1.0,29.0,33.2,.35));
 }
}
// Groot benedenvenster in de westzijde van de zuidtoren (RCE 20024941).
cuts.push(niche([-19,-8.5],180,3.2,0,1.7,2,7,.35));
// Groot spitsvenster in westgevel en de twee transeptgevels.
cuts.push(niche([-19,0],180,2.1,0,3.0,5,20,.35));
cuts.push(niche([.8,0],270,10.1,0,3.4,4.5,18,.35));
cuts.push(niche([.8,0],90,12.1,0,3.4,4.5,18,.35));
// De drie koorvensters en de arcade onder de dakrand (foto RCE 20024945).
for(const [center,angle] of [ [[26.3,-2.0],-41.8], [[28,1.6],0], [[26.25,5.05],45] ]) {
 cuts.push(niche(center,angle,0,0,2.0,3.5,13.2,.35));
 for(const s of [-1.05,1.05]) cuts.push(niche(center,angle,0,s,.95,15.3,16.1,.35));
}
for(const x of [-13,-8,8,13]){
 cuts.push(niche([x,0],90,12.1,0,2.2,4.0,11.5,.35));
 cuts.push(niche([x,0],270,14.5,0,1.8,2.5,6.0,.35));
}
// Reeksen blinde bogen in de karakteristieke fries onder de goot.
for(const x of [-14.1,-12.3,-10.5,-8.7,-6.9,7.6,9.4,11.2,13.0,14.8,16.6]) {
 cuts.push(niche([x,0],90,6.4,0,1.0,19.0,20.4,.35));
 cuts.push(niche([x,0],270,3.8,0,1.0,19.0,20.4,.35));
}
complex=complex.subtract(Manifold.union(cuts));
const nodes=[["building:walburgisbasiliek",complex]],all=complex;
const META={name:"Sint Walburgisbasiliek Arnhem",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,
 groundSamplePoints:[[-27,0],[0,17],[8,-19],[33,0]],replacesBuildings:["0202100000268355"],plate:false,
 description:"Pseudobasiliek met twee westtorens, zadel- en schilddaken, dwarsschip, steunberen, kapellen en een driezijdig koor. Oorsprong bij de viering; +X loopt naar het oosten, Z omhoog in het bouwstelsel en Y omhoog in glTF.",
 realWorld:{groundNapM:GROUND_NAP,ridgeM:RIDGE,towerTopM:48.4,baseM:BASE},
 sources:["https://nl.wikipedia.org/wiki/Sint-Walburgiskerk_(Arnhem)","https://monumentenregister.cultureelerfgoed.nl/monumenten/8370","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0202100000268355","PDOK AHN DSM 0,5 m en actuele orthofoto","https://commons.wikimedia.org/wiki/Category:Sint-Walburgisbasiliek"]};
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

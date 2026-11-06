import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-apeldoorn");
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


const SLUG = "grote-kerk-apeldoorn";
const BASE = -0.4;
const ORIGIN = [193815,470413], X_AXIS = [0.805,0.593];
const GROUND = 17.5, EAVE = 14.5, RIDGE = 25.6;
// Main ridge east-west in local u, cross arm north-south in v. Roof planes
// measured in the LoD2.2 model of BAG 0200100000086059, verified against AHN.
const church1=roofed(rect(-15.1,20,-11.3,10.8),[...ridgeV(-0.2,RIDGE,1.0),[-1,0,RIDGE+18.8]]);
// The cross arms end in chamfered polygons, not rectangles. Their straight
// facets and sloping roof planes follow the BAG outlines and roof ridges.
const crossPlan=[[-9.1,-20.8],[-7.5,-21.2],[-3.7,-25.2],[-2.6,-25.6],[-2.6,-29.1],[8.4,-29.0],[8.4,-25.3],[12.9,-20.9],[13.4,-20.8],[13.4,19.8],[12.3,21.5],[8.4,24.4],[7.1,24.5],[7.1,28.0],[-3.9,27.8],[-3.8,24.3],[-8.3,19.8],[-9.1,19.8]];
const crossRoof=[...ridgeU(2.15,RIDGE,1.0)];
for(const i of [1,4,6,10,13,15]) crossRoof.push(facet(crossPlan[i],crossPlan[i+1],14.5,1.0,[2,0]));
const church2=roofed(crossPlan,crossRoof);
const solids=[church1,church2];
// The sizeable eastern rear volume is present in BAG and PDOK. Its roof
// falls from NAP +35.6 m toward the east at roughly 30 degrees.
solids.push(roofed(rect(18.7,26.0,-7.3,7.0),[[-0.577,0,28.72]]));
// Gabled dormers visible in the oblique RCE photograph, embedded into roof.
for (const v of [-18,-10,10,18]) solids.push(roofed(rect(-5.5,-3.7,v-0.8,v+0.8),ridgeU(-4.6,22.4,1.0)));
// Tower on the southern (local -u) arm: three articulated masonry sections.
const tc=[-19.0,-0.8];
solids.push(prism(rect(-23.0,-15.1,-5.4,4.2),BASE,21.0));
solids.push(prism(rect(-22.6,-15.4,-5.0,3.9),20.9,34.4));
// The front photograph shows the tower framed by broad masonry pilasters;
// model them as connected full-height relief rather than free-standing rails.
for(const [v0,v1] of [[-5.4,-4.4],[3.2,4.2]]) {
  solids.push(prism(rect(-23.4,-22.7,v0,v1),BASE,20.9));
  solids.push(prism(rect(-23.0,-22.3,v0+0.35,v1-0.05),20.8,33.5));
}
// Octagonal concave spire, lantern and its sloped collar; top enlarged to 0.9 m
// for 1:1000 printing. Heights above ground, upper profile estimated from photos.
solids.push(loft([[34.2,oct(tc,7.0)],[37.2,oct(tc,6.3)],[45.5,oct(tc,3.8)],[47.0,oct(tc,3.6)],[49.0,oct(tc,5.1)],[53.2,oct(tc,4.0)],[54.5,oct(tc,3.5)],[57,oct(tc,1.8)],[62,oct(tc,0.9)]]));
// Markante hoekpinakels van de gemetselde ondertoren; printbaar verbreed.
for (const [x,y] of [[-22.0,-4.4],[-22.0,3.3],[-16.0,-4.4],[-16.0,3.3]])
  solids.push(pinnacle([x,y],0.5,33.8,2.4,1.0));
// Low polygonal entrance pavilions, set diagonally in the two inner corners.
for(const s of [-1,1]) {
  const c=[-10.8,s*12.6];
  solids.push(loft([[BASE,oct(c,4.2)],[5.1,oct(c,4.2)],[7.4,tip(c)]]));
}
// Distinctive corner projections on both sides of the tower.
for(const s of [-1,1]) solids.push(roofed(rect(-21.2,-15.3,s<0?-8:-4.7,s<0?-4.7:6.7),ridgeU(-18.3,10.1,1.0)));
// 2022 north-east extension: the BAG outline has a rounded outside corner.
// AHN measurements predate the work; height is estimated from recent photos.
const annex=[[12.9,14.1],[21.0,14.1],[22.1,14.5],[22.7,15.0],[23.1,16.1],[22.8,17.3],[18.9,23.7],[18.2,24.3],[17.5,24.4],[16.9,24.2],[13.5,22.2],[13.1,21.4],[12.5,20.9]];
solids.push(roofed(annex,[[0,0,4.0]]));
let complex=Manifold.union(solids);
const cuts=[];
// Recesses represent the broad masonry windows, and simplify rounded tops.
for(const s of [-1,1]) for(const v of [-21,-15,15,21]) cuts.push(niche([0,v],s<0?180:0,s<0?9.1:13.4,0,2.3,5,12,0.38));
// Tall windows in the angled end bays are prominent in the recent annex
// photograph; place the recesses normal to each of those four wall planes.
for(const [x,y,angle] of [[-5.6,-23.2,-136.5],[10.65,-23.1,-45.6],[10.35,22.95,53.4],[-6.05,22.05,135]])
  cuts.push(niche([x,y],angle,0,0,2.3,5,12,0.38));
for(const angle of [0,90,180,270]) for(const s of [-2.1,0,2.1]) cuts.push(niche(tc,angle,angle%180===0?3.6:4.45,s,1.1,26.1,30.5,0.38));
// Grote galmgaten in de octogonale lantaarn en het frontale uurwerk; door
// puntige blinde nissen blijven de details zonder vrijhangende bogen printbaar.
for(const angle of [0,45,90,135,180,225,270,315])
  cuts.push(niche(tc,angle,2.25,0,0.9,49.9,51.5,0.7));
cuts.push(niche(tc,180,3.25,0,1.6,34.6,35.2,0.6));
for(const side of [-1,1]) for (const u of [-1,3,7])
  cuts.push(niche([0,0],side<0?270:90,side<0?29.0:27.9,u,2,4.0,10.6,0.38));
for(const s of [-2.2,0,2.2]) cuts.push(niche(tc,180,4.0,s,1.0,8,12.6,0.4));
// Shallow circular rose-window recess on the entrance elevation, not an opening.
cuts.push(Manifold.cylinder(0.6,1.65,1.65,32).rotate([0,90,0]).translate([-23.2,-0.8,21.2]));
// Main entrance in the south-facing tower and the large rose window above it.
cuts.push(niche(tc,180,4.0,0,2.0,0.0,3.9,0.4));
cuts.push(niche(tc,180,4.0,0,2.0,16.0,18.8,0.4));
complex=complex.subtract(Manifold.union(cuts));
const nodes=[["building:kerk",complex]], all=complex;
const META={name:"Grote Kerk Apeldoorn",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:0,groundSamplePoints:[[-25,-12],[0,-33],[0,33],[29,0]],replacesBuildings:["0200100000086059"],plate:false,
description:"Kruiskerk op de Loolaan met twee kruisende kappen, polygonale eindgevels, zuidtoren met achtkante spits en lantaarn, lage ingangsportalen en aanbouw uit 2022. RD oorsprong (193815,470413), X-as loopt langs de hoofdnok; alle maten in meters, Y omhoog in glTF. Details en nissen zijn vereenvoudigd voor print op 1:1000.",
realWorld:{naveRidgeM:RIDGE,groundNapM:GROUND,towerTopM:62},
sources:["https://monumentenregister.cultureelerfgoed.nl/monumenten/8162","https://www.vanhoogevest.nl/projecten/grote-kerk-apeldoorn/","https://commons.wikimedia.org/wiki/File:Overzicht_voorzijde_kerk_-_Apeldoorn_-_20369718_-_RCE.jpg","https://commons.wikimedia.org/wiki/File:Exterieur_WESTGEVEL_-_Apeldoorn_-_20339775_-_RCE.jpg","3D BAG pand 0200100000086059: voetafdruk en dakvlakken","PDOK AHN DSM 0,5 m en actuele luchtfoto"]};
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

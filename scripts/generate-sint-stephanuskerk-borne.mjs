import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-stephanuskerk-borne");
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

const SLUG = "sint-stephanuskerk-borne";
// 3D BAG / AHN en foto's: x-as langs de nok naar de voorgevel (NO).
const ORIGIN = [248260, 480090];
const X_AXIS = [0.656059, 0.754710];
const BASE = -0.5;
const solids = [];
// Het hoofdschip: dak uit twee vlakken, nok +17,5 m en helling 52,7 graden.
solids.push(roofed(rect(-13.6, 33.0, -9.25, 1.9), ridgeV(-3.7, 17.5, 1.30)));
// Entreeportaal met zadeldak en dakkapellen op de langskap.
solids.push(roofed(rect(32.8,34.7,-5.6,-1.8),ridgeV(-3.7,7.2,1.25)));
for (const u of [8.0,13.4,18.8,24.2]) {
  solids.push(roofed(rect(u-0.6,u+0.6,-8.0,-6.4),ridgeU(u,13.5,1.4)));
  solids.push(roofed(rect(u-0.6,u+0.6,-0.9,0.7),ridgeU(u,13.5,1.4)));
}
// Twee zijbeuken met lessenaarsdaken; de goot is ca. +7,8 m.
solids.push(roofed(rect(4.4, 25.6, -13.25, -8.8), [[0,0.58,15.5]]));
solids.push(roofed(rect(4.4, 30.8, 1.5, 6.2), [[0,-0.58,11.8]]));
// Dwarsschip: twee dakvlakken haaks op het schip, met zichtbare eindgevels.
solids.push(roofed(rect(-6.2,5.1,-14.8,7.8), ridgeU(-0.4,17.5,1.30)));
// Lagere koorvleugels: lessenaarsdaken op de door PDOK en 3D BAG gemeten plattegrond.
solids.push(roofed(rect(-11.6,-5.7,-13.2,-8.2),[[0,0.59,16.1]]));
solids.push(roofed([[-11.4,1.3],[-5.5,1.3],[-5.5,6.8],[-8.5,6.4],[-11.4,6.1]],[[0,-0.59,11.9]]));
// Achter de noordelijke koorvleugel ligt een lager dwarsdeel met zadeldak.
solids.push(roofed(rect(-18.4,-11.1,2.5,7.8),ridgeV(5.0,8.7,1.45)));
// Portaal aan de gevel van het dwarsschip, zichtbaar op de RCE-foto.
solids.push(roofed(rect(-1.95,0.75,-15.7,-14.4),ridgeU(-0.6,5.1,1.4)));
// Driezijdige koorsluiting, hellingvlakken volgen de polygonale gevel.
const choir=[[-11.8,-9.2],[-14.1,-9.2],[-16.6,-7.2],[-17.3,-4.6],[-16.6,-1.4],[-14.1,0.7],[-11.8,0.7]];
solids.push(roofed(choir,[...ridgeV(-3.7,17.5,1.30),facet(choir[2],choir[3],9.6,1.30,[-12,-3.7]),facet(choir[3],choir[4],9.6,1.30,[-12,-3.7])]));
// Toren links van de voorgevel: vierkante schacht, topgevels en achthoekige naald.
const tc=[29.5,-11.4];
solids.push(prism(rect(26.25,32.8,-14.2,-8.5),BASE,27.3));
solids.push(roofed(rect(26.3,32.7,-14.15,-8.55),ridgeV(-11.35,32.0,1.55)));
solids.push(roofed(rect(26.3,32.7,-14.15,-8.55),ridgeU(29.5,32.0,1.55)));
solids.push(loft([[27.0,oct(tc,5.5)],[32.0,oct(tc,5.5)],[49.6,oct(tc,0.9)]]));
// Hoektorentje aan andere zijde van de westgevel en de dakruiter.
solids.push(loft([[BASE,oct([29.0,7.0],2.0)],[13.0,oct([29.0,7.0],2.0)],[19.0,oct([29.0,7.0],0.9)]]));
solids.push(loft([[16.0,oct([-0.4,-3.7],1.3)],[19.1,oct([-0.4,-3.7],1.3)],[27.0,oct([-0.4,-3.7],0.9)]]));
// Steunberen langs zijgevels, met afgeschuinde bovenzijde.
for (const u of [5.0,10.2,15.7,21.0,25.8]) {
 solids.push(buttress([u,-13.2],0,0.95,0.8,8.5,7.7));
 solids.push(buttress([u,6.2],180,0.95,0.8,8.5,7.7));
}
// Verbonden sacristie en pastorie, uitsluitend op dezelfde BAG-voetafdruk.
solids.push(roofed(rect(-23.8,-16.4,-2.5,1.0),ridgeV(-0.75,5.7,1.7)));
// Pastorie: mansarde-achtig schilddak met vier gemeten dakvlakken en vlakke nok.
solids.push(roofed(rect(-35.7,-23.5,-5.1,8.7), [
  [1.3,0,8.7+1.3*35.7],[-1.3,0,8.9-1.3*23.5],
  [0,1.3,9.0+1.3*5.1],[0,-1.3,8.8+1.3*8.7],[0,0,12.0],
]));
// Uitstekende trapgevel aan de Stationsstraat, met grovere treden voor 1:1000.
solids.push(prism(rect(-33.2,-29.4,-5.75,-4.8),BASE,12.2));
solids.push(prism(rect(-32.3,-30.3,-5.75,-4.8),BASE,13.2));
solids.push(prism(rect(-31.8,-30.8,-5.75,-4.8),BASE,14.2));
// Dakkapellen op beide schildvlakken, schematisch met steil kapje.
for (const u of [-28.0,-25.3]) {
  solids.push(roofed(rect(u-.5,u+.5,-4.7,-3.1),ridgeU(u,12.9,1.35)));
  solids.push(roofed(rect(u-.5,u+.5,6.7,8.1),ridgeU(u,12.9,1.35)));
}
// Brede dakkapel op de kopgevel.
solids.push(prism(rect(-24.4,-23.35,0.1,2.4),BASE,11.2));
solids.push(prism([[-41.05,2.92],[-38.3,0.9],[-38.37,-5.24],[-35.5,-5.24],[-35.5,8.7],[-40.9,8.7]],BASE,4.9));
// Plat afgedekt parochiegebouw ten noordwesten; BAG-grens en AHN dakhoogte.
// Per bouwdeel de gemeten dakhoogte: de hoge zaal, lage tussenbouw en verhoogde ingang.
solids.push(prism([[-25.5,17.5],[-25.5,40],[-19.1,38.15],[-14.9,36.53],[-9.74,29.5],[-2.9,19.47],[-6.5,17.7]],BASE,4.9));
solids.push(prism([[-24.0,8.4],[-11.5,7.9],[-8.5,6.4],[-3.3,7.9],[1.7,8.1],[1.85,12.9],[-.1,15.4],[-2.9,19.5],[-6.5,17.7],[-24,17.7]],BASE,4.0));
solids.push(prism([[-11.5,10.4],[-9.2,9.5],[-3.3,9.5],[-3.1,13.5],[-10.5,13.2]],BASE,4.9));
// Glazen daklicht zichtbaar op de actuele ortho, als gesloten piramide.
solids.push(loft([[4.85,sq([-9.8,21.8],1.65)],[6.7,tip([-9.8,21.8])]]));
solids.push(prism(rect(-29.65,-25.4,17.6,21.1),BASE,3.75));
let complex = Manifold.union(solids);
const cuts=[];
// Rechthoekige vensters van twee bouwlagen in de straatgevel van de pastorie.
for (const u of [-34.5,-32.0,-28.5,-25.2]) for (const z of [1.1,5.3])
 cuts.push(niche([u,0],270,u === -32 ? 5.75 : 5.1,0,1.0,z,z+1.6,0.4));
// Voordeur en vensters aan de kopgevel; blinde uitsparingen 0,35 m diep.
cuts.push(niche([-26.6,0],270,5.1,0,1.0,0.0,2.0,0.4));
for (const v of [-3.3,4.1,7.2]) for (const z of [1.1,5.3])
 cuts.push(niche([0,v],0,-23.5,0,1.0,z,z+1.6,0.4));
cuts.push(niche([0,-3.7],0,34.7,0,1.8,0,4.0,0.4));
// Twee spitsbogige galmgaten per zichtbare torenzijde; blinde nissen van 0,35 m.
for (const side of [0,90,180,270]) for (const s of [-1.25,1.25]) cuts.push(niche(tc,side,3.2,s,1.05,19,25.0,0.4));
// Ramen in de lage torengeleding en nis voor de wijzerplaat in elke geveltop.
for (const side of [0,90,180,270]) {
 const a = side % 180 === 0 ? 3.3 : 2.85;
 for (const offset of [-1.15,1.15]) cuts.push(niche(tc,side,a,offset,1.0,6.0,13.8,0.4));
 cuts.push(niche(tc,side,a,0,1.5,27.8,29.1,0.4));
}
// Vensters tussen de steunberen en tripletten in de transeptgevels.
for (const u of [7.8,13,18.4,23.2]) {
 cuts.push(niche([u,0],270,13.2,0,1.6,3.4,7,0.4));
 cuts.push(niche([u,0],90,6.2,0,1.6,3.4,7,0.4));
}
for (const v of [-5.7,-3.7,-1.7]) cuts.push(niche([0,v],0,33.0,0,1.1,5,10,0.4));
for (const u of [-2.8,-0.4,2.0]) { cuts.push(niche([u,0],270,14.8,0,1.1,4.5,10,0.4)); cuts.push(niche([u,0],90,7.8,0,1.1,4.5,10,0.4)); }
complex = complex.subtract(Manifold.union(cuts));
const nodes = [["building:kerk", complex]];
const all = complex;
const META = {
 name:"Sint-Stephanuskerk Borne", origin:ORIGIN, xAxis:X_AXIS, groundOffsetMetres:-0.3,
 replacesBuildings:["0147100000013192"], plate:true,
 description:"Oorsprong RD (248260,480090); +X langs de kerkas naar de voorgevel; dakvlakken uit 3D BAG en AHN, toren en geveldetails naar foto's. Bevat ook de pastorie en het aanpalende parochiegebouw van hetzelfde BAG-pand.",
 realWorld:{groundNapM:15.2,roofRidgeM:17.5,towerTopM:49.6},
 sources:["https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0147100000013192","https://monumentenregister.cultureelerfgoed.nl/monumenten/9920","https://commons.wikimedia.org/wiki/Category:Stephanuskerk_(Borne)","PDOK AHN DSM 0,5 m en luchtfoto"]
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


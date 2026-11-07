import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "herfoarme-tsjerke-driezum");
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
const rectSec = ([cx, cy], hx, hy) => [[cx - hx, cy - hy], [cx + hx, cy - hy], [cx + hx, cy + hy], [cx - hx, cy + hy]];
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
// Nis (venster, deur, galmgat) met een spitse top van 58 graden: breedte w, van z0 tot z1 plus de punt, diepte d,
// in een gevel met de buitennormaal naar 'angle' (graden, 0 = +u) door het punt c; s schuift langs de gevel.
const niche = ([cx, cy], angle, s, w, z0, z1, d = 0.35) =>
  profileX([[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]], -d, 0.5)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Gevel p0-p1 met buitennormaal: middelpunt, hoek van de normaal en lengte.
const wall = ([x0, y0], [x1, y1], [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = (y1 - y0) / len, ny = -(x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) > 0) {
    nx = -nx;
    ny = -ny;
  }
  return { mid: [(x0 + x1) / 2, (y0 + y1) / 2], angle: (Math.atan2(ny, nx) * 180) / Math.PI, n: [nx, ny], len };
};
// Gootlijst langs een gevel van p0 naar p1 met de buitennormaal n: 0,3 m uitstekend met een ondervlak van 40 graden.
const eaveLedge = (p0, p1, [nx, ny], z) =>
  Manifold.hull([p0, p1].flatMap(([x, y]) => [
    [x - 0.3 * nx, y - 0.3 * ny, z - 0.35], [x - 0.3 * nx, y - 0.3 * ny, z], [x, y, z - 0.35], [x + 0.3 * nx, y + 0.3 * ny, z],
  ]));
// Lisene (muurpijler) van breedte w en diepte d op de gevel met normaal-hoek 'ang', van BASE tot z1.
const lisene = ([x, y], ang, z1, w = 0.6, d = 0.2) =>
  Manifold.cube([d + 0.3, w, z1 - BASE]).translate([-0.3, -w / 2, BASE]).rotate([0, 0, ang]).translate([x, y, 0]);

// Herfoarme tsjerke Driezum: driezijdig gesloten zaal en half ingebouwde westtoren uit 1777.
const SLUG="herfoarme-tsjerke-driezum";
const BASE=-0.8;
const AXIS_DEG=1.62;
const ca=Math.cos(AXIS_DEG*Math.PI/180),sa=Math.sin(AXIS_DEG*Math.PI/180);
const ORIGIN=[198940,590315.2];
const X_AXIS=[+ca.toFixed(5),+sa.toFixed(5)];
const GROUND_SAMPLES=[[-14,-4],[-14,4],[0,-6],[0,6],[13,0],[10,5]];
const NAVE_W=-11.11,NAVE_E=10.04,NAVE_S=-4.88,NAVE_N=4.88,MID_V=0;
const RIDGE=12.8,PITCH=1.27;
const EAVE=RIDGE-PITCH*4.88;
const APSE_E=13.57,APSE_HALF=2.6;
const TW_W=-15.16,TW_E=-10.6,TW_S=-2.39,TW_N=2.16;
const TC=[(TW_W+TW_E)/2,(TW_S+TW_N)/2],THX=(TW_E-TW_W)/2,THY=(TW_N-TW_S)/2;
const BAND1=7.4,BAND2=14.2,BODY_TOP=19.9,CORNICE_TOP=21.35;
const SPIRE=[[CORNICE_TOP-0.05,3.8],[22.5,3.0],[24.4,2.2],[26.4,1.3],[29.9,0]];

// ---------- schip en koor ----------
const P_SW = [NAVE_E, NAVE_S], P_NW = [NAVE_E, NAVE_N];
const P_SE = [APSE_E, MID_V - APSE_HALF], P_NE = [APSE_E, MID_V + APSE_HALF];
const PLAN = [[NAVE_W, NAVE_S], P_SW, P_SE, P_NE, P_NW, [NAVE_W, NAVE_N]];
const IN = [0, MID_V];
const church = [];
church.push(roofed(PLAN, [
  [0, PITCH, EAVE - PITCH * NAVE_S],
  [0, -PITCH, EAVE + PITCH * NAVE_N],
  facet(P_SW, P_SE, EAVE, PITCH, IN),
  facet(P_SE, P_NE, EAVE, PITCH, IN),
  facet(P_NE, P_NW, EAVE, PITCH, IN),
]));
// Plint rondom (0,1 m buiten de gevels tot +0,8 m).
church.push(Manifold.extrude(new CrossSection([ccw(PLAN)]).offset(0.1, "Miter", 2), 0.8 - BASE).translate([0, 0, BASE]));
// Gootlijsten langs de lange gevels en het koor (het witte lijstwerk op de foto's).
const walls = {
  south: wall([NAVE_W, NAVE_S], P_SW, IN),
  north: wall(P_NW, [NAVE_W, NAVE_N], IN),
  se: wall(P_SW, P_SE, IN),
  east: wall(P_SE, P_NE, IN),
  ne: wall(P_NE, P_NW, IN),
};
church.push(eaveLedge([NAVE_W, NAVE_S], P_SW, walls.south.n, EAVE));
church.push(eaveLedge(P_NW, [NAVE_W, NAVE_N], walls.north.n, EAVE));
church.push(eaveLedge(P_SW, P_SE, walls.se.n, EAVE));
church.push(eaveLedge(P_SE, P_NE, walls.east.n, EAVE));
church.push(eaveLedge(P_NE, P_NW, walls.ne.n, EAVE));
// Lisene op de overgang van schip naar koor (foto vanuit het zuidoosten), tot onder de gootlijst.
church.push(lisene([NAVE_E - 0.3, NAVE_S], 270, EAVE - 0.35));
church.push(lisene([NAVE_E - 0.3, NAVE_N], 90, EAVE - 0.35));
// Hoekstukken van de westgevel naast de toren, 0,5 m in het vierkant, tot 0,9 m boven de goot (foto's RCE).
for (const v of [NAVE_S + 0.25, NAVE_N - 0.25]) church.push(prism(rectSec([NAVE_W + 0.25, v], 0.25, 0.25), BASE, EAVE + 0.9));

// ---------- toren ----------
const tower = [];
// Romp (0,3 m het schip in) met plint, hoeklisenen en twee banden met een schuin ondervlak (34 graden).
tower.push(prism(rect(TW_W, TW_E + 0.3, TW_S, TW_N), BASE, BODY_TOP));
tower.push(prism(rectSec(TC, THX + 0.12, THY + 0.12), BASE, 0.8));
for (const [x, y, ang] of [[TW_W, TW_S + 0.3, 180], [TW_W, TW_N - 0.3, 180], [TW_W + 0.3, TW_S, 270], [TW_W + 0.3, TW_N, 90], [TW_E - 0.3, TW_S, 270], [TW_E - 0.3, TW_N, 90]]) {
  tower.push(lisene([x, y], ang, BODY_TOP, 0.6, 0.15));
}
for (const z of [BAND1, BAND2]) {
  tower.push(loft([[z - 0.5, rectSec(TC, THX, THY)], [z - 0.2, rectSec(TC, THX + 0.2, THY + 0.2)], [z, rectSec(TC, THX + 0.2, THY + 0.2)]]));
}
// Kroonlijst met fries: eerst 0,15 m (27 graden), dan 0,45 m uitkragend onder 42 graden, vlakke bovenkant.
tower.push(loft([
  [BODY_TOP - 0.3, rectSec(TC, THX, THY)], [BODY_TOP, rectSec(TC, THX + 0.15, THY + 0.15)], [20.4, rectSec(TC, THX + 0.15, THY + 0.15)],
  [20.9, rectSec(TC, THX + 0.6, THY + 0.6)], [CORNICE_TOP, rectSec(TC, THX + 0.6, THY + 0.6)],
]));
// Ingezwenkte achtkante spits.
tower.push(loft(SPIRE.map(([z, across]) => [z, across > 0 ? oct(TC, across) : tip(TC)])));

// ---------- nissen: vensters, deuren, portaal en galmgaten ----------
const cuts = [];
const at = (w, s) => [w.mid, w.angle, s];
// Zuidgevel: deur in de westelijke travee, vier rondboogvensters (foto's RCE 20026750/20026753); noordgevel gespiegeld
// met een venster op de plaats van de deur (aangenomen).
const sS = (u) => u - walls.south.mid[0];
const sN = (u) => walls.north.mid[0] - u;
cuts.push(niche(...at(walls.south,sS(-9.0)),1.2,0.1,2.7,0.4)); for(const u of [-6.5,-2.2,2.1,6.4]) cuts.push(niche(...at(walls.south,sS(u)),1.35,1.6,4.4));
for(const u of [-8.4,-3.9,0.6,5.1]) cuts.push(niche(...at(walls.north,sN(u)),1.35,1.6,4.4));
cuts.push(niche(...at(walls.east, 0), 1.1, 2.4, 3.6));
// Toren: spitsboogportaal in de westgevel (diepte 0,45), venster in de middelste geleding, twee galmgaten per zijde.
const tW = { mid: [TW_W, TC[1]], angle: 180 }, tS = { mid: [TC[0], TW_S], angle: 270 }, tN = { mid: [TC[0], TW_N], angle: 90 }, tE = { mid: [TW_E, TC[1]], angle: 0 };
cuts.push(niche(tW.mid, 180, 0, 1.6, 1.3, 3.8, 0.4));
cuts.push(niche(tW.mid, 180, 0, 0.9, 7.0, 7.6, 0.3));
for (const f of [tW, tS, tN, tE]) { cuts.push(niche(f.mid, f.angle, 0, 1.2, 16.2, 16.8, 0.35)); cuts.push(niche(f.mid, f.angle, 0, 0.9, 18.0, 18.3, 0.35)); }
const towerSolid = Manifold.union(tower).subtract(Manifold.union(cuts.slice(-10)));
const churchSolid = Manifold.union(church).subtract(Manifold.union(cuts.slice(0, -10)));

let complex = Manifold.union([churchSolid, towerSolid]);
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META={name:"Herfoarme tsjerke Driezum",origin:ORIGIN,xAxis:X_AXIS,groundOffsetMetres:-0.1,groundSamplePoints:GROUND_SAMPLES,replacesBuildings:["1891100001636892"],plate:false,
 description:"Herfoarme tsjerke uit 1713 met driezijdige koorsluiting, zadeldak, gevelvelden en een deels ingebouwde westtoren met spits. Oorsprong RD (198940, 590315,2), X-as 1,62 graden, maaiveld NAP circa +3,8 m. Galmgaten en vensters als blinde nissen voor print op 1:1000.",
 realWorld:{monument:11684,groundNapM:3.8,naveRidgeM:RIDGE,naveEaveM:EAVE,towerTopM:29.9,baseM:BASE},
 sources:["https://www.hervormddriezum.nl/kerk/","https://monumentenregister.cultureelerfgoed.nl/monumenten/11684","https://commons.wikimedia.org/wiki/Category:Hervormde_kerk,_Driezum","https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1891100001636892","PDOK AHN4 DSM en DTM"]};
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
      if (steep < 40) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
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

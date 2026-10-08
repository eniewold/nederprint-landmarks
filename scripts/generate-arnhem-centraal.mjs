// Genereert een vereenvoudigd, gesloten 3D-model van de transferhal van
// Arnhem Centraal (UNStudio, 2015) met de plint van de OV-terminal. Alleen de
// transferhal in het oosten heeft het vrijgevormde dak dat naar het
// busstation afloopt, met het glazen oog; dat is een gefacetteerd vlak op
// knopen van 5 m uit het AHN-DSM (HALL_NODES onderaan het script). De
// plint met de parkeergarage in het westen is een recht blok met een plat dak
// op NAP +44 m, een verhoogd deel met de glazen lichtstraat, een dakrand en
// de gevelbanden van de parkeerlagen. Ten noorden daarvan de vier perronkappen
// (vlakke daken op NAP +33,2 m met ellipsvormige glaspanelen). De
// kantoortorens en de passage over het spoor zijn geen deel van het model. Alle maten in het
// script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog,
// één node met de materiaalklasse in de nodenaam) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-arnhem-centraal.mjs              # 1:1000 (standaard)
//   node scripts/generate-arnhem-centraal.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: de blokken en het facettenvlak staan met
// rechte wanden op de vlakke onderkant; alleen de bovenkanten van de
// gevelbanden zijn vlak (0,35 m diep).
//
// Assenstelsel: oorsprong op RD (190303, 444065), midden in de transferhal,
// op het maaiveld van de straat aan de zuidkant (NAP +24,0 m), Z omhoog, +X
// naar het oosten en +Y naar het noorden (de RD-assen). Het perronniveau en
// het plein aan de noordkant liggen op NAP +31 m, het busstation aan de
// oostkant op NAP +22 m.
//
// Bronnen: BAG-pand 0202100000223614 (de OV-terminal); AHN DSM/DTM 0,5 m
// (PDOK WCS); Wikipedia; PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "arnhem-centraal");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 24,0 m) ----------
const ORIGIN = [190303, 444065];
const X_AXIS = [1, 0];
const GROUND_NAP = 24.0;
const NAP = (h) => h - GROUND_NAP;
// Onderkant op NAP +21,5 m, onder het busstation (NAP +22 m).
const BASE = NAP(21.5);
// Hoogteveld: AHN-DSM 0,5 m met gaten (glas) naar de dichtstbijzijnde waarde
// opgevuld, mediaan over 2,5 m en gemiddeld per cel van 1 m (raster van
// 173 x 95 cellen vanaf (x0, y0)), ten opzichte van RD (190283, 444160). Het
// script gebruikt daarvan alleen de knoophoogtes van het dak van de hal
// (HALL_NODES) en de BAG-contour (PAND), beide onderaan het script.
const GRID_REF = [190283, 444160];
const DSM = { x0: -104, y0: -130, nx: 173, ny: 95 };
const { PAND, HALL_NODES } = arnhemData();
const SHIFT = [GRID_REF[0] - ORIGIN[0], GRID_REF[1] - ORIGIN[1]];
// Contour van het dak in het rasterstelsel: de plint langs de kantoortoren en
// het plein, de glazen noordgevel van de hal, en in het oosten de lijn waar
// het dak het busstation raakt (DSM NAP +25,5 m, per 5 m gladgestreken). Het
// model is de doorsnede hiervan met de BAG-contour (PAND).
const ROOF_OUTLINE = [
  [-104, -36], [-92, -35], [-75, -39], [-75, -50], [-55, -52], [-55, -65], [-25, -67.5], [-20, -73], [15, -73],
  [19, -66], [40, -64], [55, -63], [66, -61], [63, -66], [61, -72], [60, -78], [57, -86], [53, -91], [46, -97],
  [40, -106.5], [35, -116.5], [29, -127], [29, -135], [-110, -135],
];
// Parkeergarage en plint in het westen (stelsel van het raster): plat dak op
// NAP +44 m (tot u = 0, waar het dak van de hal begint), het verhoogde deel
// op +47 m met de glazen lichtstraat op +49 m, een dakrand van 0,8 m hoog en
// banden in de gevel om de 3,5 m (parkeerlagen).
const GARAGE = { until: 0, roof: 44, parapet: 0.8, parapetWidth: 0.8 };
const RAISED = { x: [-104, -44], y: [-108, -72], top: 47 };
const SKYLIGHT = { poly: [[-82, -84], [-52, -86], [-48, -98], [-82, -96]], top: 49 };
const BANDS = { first: 27, step: 3.5, count: 5, height: 0.5, depth: 0.35 };
// Gevels van de garage met de banden (stelsel van het raster): de zuidgevel
// en de westgevel.
const GARAGE_FACADES = [
  [[-100.6, -111.6], [-16.7, -123.9]],
  [[-98, -91], [-101, -109]],
];
// Het dak van de hal: knopen van 5 m (gemiddelde van het DSM rond elke knoop).
const HALL_STEP = 5;
// Perronkappen: vier lange daken boven de perrons, 13 graden gedraaid ten
// opzichte van de RD-assen (de lange as loopt naar het oost-zuidoosten). In het
// stelsel (u langs de kap, v dwars, beide ten opzichte van de oorsprong en
// gedraaid) heeft elke kap een middellijn v, een begin en eind u en een breedte;
// het dak is vlak op NAP +33,2 m (AHN-DSM, 1,2 m dik) met afgeronde uiteinden.
// De ellipsvormige glaspanelen zijn 0,5 m diepe nissen op de middellijn
// (midden u, lengte, breedte), de kolommen staan op de middellijn tussen de
// panelen.
const CANOPIES = {
  angle: -13,
  roof: 33.2,
  thickness: 1.2,
  column: 1.2,
  list: [
    { v: 79.3, u: [-153, 25], w: 12.2, panels: [[-133.1, 28, 5.3], [-106.5, 19.4, 5.1], [-80.8, 17.9, 5.1], [-53.8, 18.6, 5.4], [-24, 34.2, 6.2], [1, 18, 5]] },
    { v: 102.9, u: [-159, 21], w: 11.9, panels: [[-137.4, 29.5, 5.6], [-110.2, 20.2, 5.7], [-85.4, 18.1, 5.2], [-57.8, 18.9, 5.4], [-28.1, 32.8, 7.2], [-3, 18, 5]] },
    { v: 122.7, u: [-163, 10], w: 11.8, panels: [[-140.2, 28.5, 5.6], [-113.6, 19.5, 5.6], [-88.3, 18.1, 6], [-61.4, 17.3, 5.5], [-27.3, 33, 7], [-12, 18, 5]] },
    { v: 144.1, u: [-169, 7], w: 13.5, panels: [[-143.7, 29.6, 6.1], [-117.2, 20, 5.5], [-91.3, 18, 5.1], [-64.7, 18, 5.7], [-30.2, 34, 7.7], [-15, 18, 5]] },
  ],
};
// Maaiveld (AHN-DTM NAP +24 m): de straat langs de zuidgevel.
const GROUND_SAMPLES = [[-60, -40], [-20, -40], [15, -36]];

// ---------- hulpfuncties ----------
// Gesloten blok met een bovenvlak z = top(u, v, i, j) boven een rechthoek van
// knopen i, j.
function heightBlock(u0, u1, v0, v1, step, top, bottom) {
  const nu = Math.max(2, Math.round((u1 - u0) / step) + 1);
  const nv = Math.max(2, Math.round((v1 - v0) / step) + 1);
  const pos = [];
  const tri = [];
  const at = (i, j) => j * nu + i;
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const u = u0 + ((u1 - u0) * i) / (nu - 1);
      const v = v0 + ((v1 - v0) * j) / (nv - 1);
      pos.push(u, v, top(u, v, i, j));
    }
  }
  for (let j = 0; j < nv - 1; j++) {
    for (let i = 0; i < nu - 1; i++) {
      tri.push(at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j), at(i + 1, j + 1), at(i, j + 1));
    }
  }
  const ring = [];
  for (let i = 0; i < nu - 1; i++) ring.push(at(i, 0));
  for (let j = 0; j < nv - 1; j++) ring.push(at(nu - 1, j));
  for (let i = nu - 1; i > 0; i--) ring.push(at(i, nv - 1));
  for (let j = nv - 1; j > 0; j--) ring.push(at(0, j));
  const base = pos.length / 3;
  for (const k of ring) pos.push(pos[k * 3], pos[k * 3 + 1], bottom);
  const centre = pos.length / 3;
  pos.push((u0 + u1) / 2, (v0 + v1) / 2, bottom);
  for (let k = 0; k < ring.length; k++) {
    const a = ring[k];
    const b = ring[(k + 1) % ring.length];
    const ab = base + k;
    const bb = base + ((k + 1) % ring.length);
    tri.push(a, ab, bb, a, bb, b, centre, bb, ab);
  }
  return new Manifold(
    new Mesh({ numProp: 3, vertProperties: new Float32Array(pos), triVerts: new Uint32Array(tri) }),
  );
}

// ---------- transferhal en plint ----------
// Hoekpunten van het hoogteveld op de celmiddens, afgesneden met rechte wanden
// op de contour.
const u0 = DSM.x0 + 0.5 + SHIFT[0];
const v0 = DSM.y0 + 0.5 + SHIFT[1];
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const shifted = (pts) => pts.map(([x, y]) => [x + SHIFT[0], y + SHIFT[1]]);
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
// Hal: gefacetteerd vlak op knopen van HALL_STEP m; HALL_NODES geeft per knoop
// de NAP-hoogte (het gemiddelde van het DSM in een blok van HALL_STEP m rond
// de knoop, op centimeters).
const nodeTop = (u, v, i, j) => NAP(HALL_NODES[j][i]);
const hallU0 = GARAGE.until - 2 + SHIFT[0];
const hallField = heightBlock(hallU0, hallU0 + Math.ceil((u0 + DSM.nx - 1 - hallU0) / HALL_STEP) * HALL_STEP, v0, v0 + DSM.ny - 1, HALL_STEP, nodeTop, BASE - 2);
const outline = prism(shifted(ROOF_OUTLINE), BASE, 200);
const pandPrism = prism(shifted(PAND), BASE, 200);
const clip = (solid) => Manifold.intersection([solid, outline, pandPrism]);
const halfPlane = (uMin, uMax) =>
  prism([[uMin + SHIFT[0], -500], [uMax + SHIFT[0], -500], [uMax + SHIFT[0], 500], [uMin + SHIFT[0], 500]], BASE, 200);
const hall = Manifold.intersection([hallField, outline, pandPrism, halfPlane(GARAGE.until, 500)]);
// Garage: plat dak, verhoogd deel, lichtstraat en dakrand.
const garageOutline = Manifold.intersection([outline, pandPrism, halfPlane(-500, GARAGE.until)]);
const garageBase = Manifold.intersection([garageOutline, prism([[-500, -500], [500, -500], [500, 500], [-500, 500]], BASE, NAP(GARAGE.roof))]);
const rectPoly = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const raised = clip(prism(shifted(rectPoly(RAISED.x, RAISED.y)), BASE, NAP(RAISED.top)));
const skylight = clip(prism(shifted(SKYLIGHT.poly), BASE, NAP(SKYLIGHT.top)));
// Dakrand langs de rand van het dak op +44 m: de contour van de garage minus
// een binnenrand van 0,8 m.
const roofSection = garageBase.slice(NAP(GARAGE.roof) - 0.01);
const roofEdge = Manifold.extrude(roofSection.subtract(roofSection.offset(-GARAGE.parapetWidth, "Miter", 2)), GARAGE.parapet).translate([0, 0, NAP(GARAGE.roof)]);
// Banden (parkeerlagen) in de gevels van de garage.
const bandGrooves = [];
const bandTops = new Set();
for (const [pa, pb] of GARAGE_FACADES) {
  const [p, q] = [pa, pb].map(([x, y]) => [x + SHIFT[0], y + SHIFT[1]]);
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const d = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
  // Binnenkant: aan de kant van het midden van de garage.
  const mid = [-45 + SHIFT[0], -85 + SHIFT[1]];
  let n = [-d[1], d[0]];
  if ((mid[0] - p[0]) * n[0] + (mid[1] - p[1]) * n[1] < 0) n = [-n[0], -n[1]];
  const corner = (a, depth) => [p[0] + d[0] * a + n[0] * depth, p[1] + d[1] * a + n[1] * depth];
  for (let k = 0; k < BANDS.count; k++) {
    const z = NAP(BANDS.first + k * BANDS.step);
    bandGrooves.push(prism([corner(1, -1), corner(len - 1, -1), corner(len - 1, BANDS.depth), corner(1, BANDS.depth)], z, z + BANDS.height));
    bandTops.add((z + BANDS.height).toFixed(2));
  }
}
const garage = Manifold.union([garageBase, raised, skylight, roofEdge]).subtract(Manifold.union(bandGrooves));
// Perronkappen: een stadion (rechthoek met afgeronde uiteinden) als plaat, met
// nissen voor de glaspanelen en kolommen tot de onderkant.
const canopyOf = ({ v, u: [ua, ub], w, panels }) => {
  const r = w / 2;
  const outlinePts = [];
  for (let k = 0; k <= 12; k++) {
    const a = -Math.PI / 2 + (Math.PI * k) / 12;
    outlinePts.push([ub - r + r * Math.cos(a), v + r * Math.sin(a)]);
  }
  for (let k = 0; k <= 12; k++) {
    const a = Math.PI / 2 + (Math.PI * k) / 12;
    outlinePts.push([ua + r + r * Math.cos(a), v + r * Math.sin(a)]);
  }
  const zTop = NAP(CANOPIES.roof);
  const zBottom = zTop - CANOPIES.thickness;
  const slab = prism(outlinePts, zBottom, zTop);
  const dents = panels.map(([cu, len, wid]) =>
    Manifold.cylinder(1, 1, 1, 32).scale([len / 2, wid / 2, 1]).translate([cu, v, zTop - 0.5]),
  );
  const columns = panels.slice(0, -1).map(([cu, len], k) => {
    const cx = (cu + panels[k + 1][0]) / 2;
    const h = CANOPIES.column / 2;
    return prism([[cx - h, v - h], [cx + h, v - h], [cx + h, v + h], [cx - h, v + h]], BASE, zBottom + 0.01);
  });
  return Manifold.union([slab.subtract(Manifold.union(dents)), ...columns]);
};
const canopies = Manifold.union(CANOPIES.list.map(canopyOf)).rotate([0, 0, CANOPIES.angle]);
const complex = Manifold.union([hall, garage, canopies]);

const nodes = [["building:transferhal", complex]];
const all = complex;

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of nodes) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen,
  // behalve de bovenkant van de bandgroeven en de onderkant van de perronkappen
  // (die staan op kolommen; de export zet er steun onder).
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let down = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    const zMin = Math.min(...p.map((q) => q[2])).toFixed(2);
    if (len > 1e-9 && n[2] < -Math.SQRT1_2 * len && !bandTops.has(zMin) && zMin !== (NAP(CANOPIES.roof) - CANOPIES.thickness).toFixed(2)) down += len / 2;
  }
  if (down > 0.01) throw new Error(`${name}: ${down.toFixed(2)} m2 ondervlak boven de onderkant`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
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
  const nodes = [];
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
    nodes.push({ name, mesh: meshes.length - 1 });
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
for (const [name, solid] of nodes) {
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
const glbFile = path.join(outDir, "arnhem-centraal.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-arnhem-centraal.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `arnhem-centraal-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Arnhem Centraal 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

const hallBox = complex.boundingBox();
await writeFile(
  path.join(outDir, "arnhem-centraal.json"),
  JSON.stringify(
    {
      name: "Arnhem Centraal",
      file: "arnhem-centraal.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      // 0: het model begint al 2,5 m onder de straat.
      groundOffsetMetres: 0,
      // Op de straat langs de zuidgevel (NAP +24 m), niet op het plein en het
      // perron (+31 m) of het busstation (+22 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0202100000223614"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (190303, 444065), midden in de transferhal, op het maaiveld van de straat aan de zuidkant (NAP +24,0 m), +X naar het oosten en +Y naar het noorden. Eén node building:transferhal: vier perronkappen ten noorden van de OV-terminal (vlakke daken op NAP +33,2 m van 12 m breed en 176 m lang, 13 graden gedraaid, met elk zes ellipsvormige glaspanelen als nissen en vijf kolommen), in het westen de plint met de parkeergarage als recht blok binnen de BAG-contour (plat dak op NAP +44 m, een verhoogd deel op +47 m met de glazen lichtstraat op +49 m, een dakrand van 0,8 m en vijf banden in de zuid- en westgevel om de 3,5 m), in het oosten de transferhal met het vrijgevormde dak dat naar het busstation afloopt, als gefacetteerd vlak op knopen van 5 m uit het AHN-DSM, met het glazen oog als verdieping van 2 m. De onderkant ligt op NAP +21,5 m en de wanden staan recht op de contour; alleen de onderkant van de perronkappen (NAP +32 m) is vlak, daar zet de export steun onder. Vervangt de PDOK-reconstructie van de OV-terminal; de perronkappen en de kantoortorens blijven uit PDOK. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`arnhem-centraal-1-${scale}.stl`],
      realWorld: {
        lengthM: +(hallBox.max[0] - hallBox.min[0]).toFixed(2),
        widthM: +(hallBox.max[1] - hallBox.min[1]).toFixed(2),
        highestPointNapM: +(hallBox.max[2] + GROUND_NAP).toFixed(2),
        hallNodeStepM: HALL_STEP,
        platformCanopyRoofNapM: CANOPIES.roof,
        platformCanopyCount: CANOPIES.list.length,
        garageRoofNapM: GARAGE.roof,
        garageRaisedNapM: RAISED.top,
        skylightNapM: SKYLIGHT.top,
        groundNapM: GROUND_NAP,
        platformLevelNapM: 31,
        busStationNapM: 22,
        baseNapM: 21.5,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Station_Arnhem_Centraal",
        "PDOK BAG pand 0202100000223614 (OV-terminal), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: het hoogteveld van dak en plint, straat, plein en busstation",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// ---------- data ----------
// PAND: BAG-contour van het station in het rasterstelsel (ten opzichte van RD
// (190283, 444160)). HALL_NODES: 20 rijen (v) van 16 knopen (u) van het dak
// van de hal, van u = -22 tot 53 en v = -34.5 tot 59.5 in het stelsel van het
// model, NAP in meters.
function arnhemData() {
  return {
    PAND: [
      [-100.37,-106.63], [-100.73,-109.2], [-100.76,-109.41], [-101.09,-111.68], [-100.83,-111.71], [-16.98,-123.89],
      [-0.65,-125.98], [-0.07,-122.07], [2.35,-122.08], [2.51,-123.79], [107.18,-138.73], [107.27,-138.08],
      [108.85,-127.04], [115.64,-79.44], [63.84,-71.12], [63.42,-77.15], [57.96,-73.72], [58.26,-73.16],
      [60.27,-69.4], [60.64,-68.71], [60.99,-68.84], [61.37,-68.89], [61.75,-68.87], [62.12,-68.77],
      [62.46,-68.6], [62.75,-68.36], [63,-68.07], [63.18,-67.74], [63.29,-67.37], [63.32,-66.99],
      [63.27,-66.62], [63.15,-66.26], [62.96,-65.93], [62.71,-65.64], [62.4,-65.42], [63.3,-63.71],
      [63.66,-63.84], [64.05,-63.9], [64.44,-63.87], [64.82,-63.77], [65.16,-63.6], [65.47,-63.35],
      [65.72,-63.05], [65.9,-62.71], [66.01,-62.34], [66.05,-61.95], [66,-61.56], [65.88,-61.19],
      [65.68,-60.85], [65.42,-60.56], [65.11,-60.33], [65.75,-59.11], [62.16,-58.33], [59,-57.63],
      [56.72,-57.13], [53.53,-56.33], [49.87,-55.36], [45.39,-53.92], [42.81,-52.67], [40.61,-51.13],
      [38.78,-49.46], [37.18,-47.64], [35.8,-45.42], [34.76,-43.01], [34.02,-40.69], [33.6,-38.26],
      [33.49,-36.96], [33.49,-35.3], [33.55,-34.19], [30.83,-34.2], [26.29,-34.07], [19.92,-33.55],
      [15.64,-32.91], [13.29,-32.47], [13.03,-38.26], [12.98,-38.52], [12.89,-38.76], [12.76,-38.98],
      [12.58,-39.18], [12.38,-39.34], [12.15,-39.46], [11.9,-39.54], [11.65,-39.58], [11.39,-39.57],
      [11.13,-39.51], [-14.42,-33.67], [-14.51,-34.08], [-14.77,-35.23], [-15.05,-35.2], [-15.34,-35.25],
      [-15.61,-35.36], [-15.84,-35.53], [-16.02,-35.75], [-16.15,-36.01], [-16.21,-36.29], [-16.21,-36.58],
      [-16.14,-36.86], [-16,-37.11], [-15.81,-37.33], [-15.57,-37.49], [-15.3,-37.59], [-15.64,-39.12],
      [4.82,-43.81], [4.41,-46.79], [5.51,-46.94], [4.95,-51.29], [3.82,-51.14], [3.77,-51.44],
      [3.75,-51.58], [3.62,-51.56], [3.55,-51.99], [4.56,-52.47], [4.6,-52.5], [5.47,-53.13],
      [6.2,-53.95], [6.82,-54.88], [7.27,-55.91], [7.64,-56.99], [7.59,-58.07], [7.56,-58.62],
      [7.49,-58.61], [6.45,-58.46], [-7.33,-56.49], [-32.06,-52.95], [-51.95,-50.61], [-51.41,-46.83],
      [-51.34,-46.36], [-53.85,-46.62], [-56.35,-46.76], [-58.6,-46.78], [-60.68,-46.68], [-61.97,-46.62],
      [-65.33,-46.26], [-69.44,-45.52], [-69.82,-45.19], [-70.29,-45.12], [-74.28,-44.2], [-73.46,-38.5],
      [-73.11,-38.5], [-71.59,-38.32], [-68.73,-39.9], [-67.75,-40.2], [-66.14,-40.69], [-59.99,-42.09],
      [-54.73,-43.3], [-51.22,-44.09], [-49.05,-44.45], [-48.19,-44.37], [-47.38,-44.15], [-46.43,-43.7],
      [-45.85,-43.28], [-45.35,-42.8], [-44.88,-42.2], [-44.49,-41.53], [-44.25,-40.9], [-44.08,-40.19],
      [-44.01,-39.32], [-44.08,-38.53], [-44.23,-37.89], [-47.29,-28.04], [-47.75,-27.79], [-51.82,-26.72],
      [-55.66,-25.91], [-61.67,-25.13], [-62.55,-25.03], [-63.36,-24.88], [-64.33,-24.61], [-65.15,-24.33],
      [-68.89,-23.02], [-70.41,-22.61], [-74.65,-21.46], [-81.68,-19.85], [-85.11,-19.07], [-85.8,-19],
      [-86.33,-19.04], [-86.74,-19.16], [-87.18,-19.41], [-87.62,-19.77], [-87.99,-20.23], [-88.25,-20.78],
      [-88.38,-21.28], [-88.97,-25.78], [-90.4,-36.69], [-90.88,-40.39], [-97.91,-89.46], [-98.08,-90.6],
    ],
    HALL_NODES: [
      [43.92, 43.44, 42.8, 41.78, 40.64, 39.48, 34.74, 34.1, 34.1, 33.98, 33.6, 33.58, 33.24, 33, 33, 33],
      [43.92, 43.43, 42.8, 41.94, 40.89, 39.53, 35.03, 33.98, 33.72, 33.58, 33.34, 33.05, 32.72, 31.54, 30.65, 30.52],
      [43.94, 43.48, 42.82, 41.96, 40.9, 39.57, 36.95, 33.68, 33.34, 33, 32.35, 31.08, 29.9, 31.3, 31.64, 31.02],
      [44, 43.55, 42.79, 41.82, 40.64, 39.22, 37.52, 33.72, 31.92, 30.75, 29.74, 29.58, 32.22, 31.64, 27.9, 27.9],
      [44.01, 43.56, 42.7, 41.55, 40.2, 38.48, 36.42, 33.52, 29.87, 29.1, 29.37, 32.52, 31.85, 28.11, 27.9, 27.9],
      [44.04, 42.02, 40.84, 40.53, 39.18, 36.72, 34.2, 32.24, 29.32, 29.11, 32.51, 32.68, 28.54, 27.94, 28.07, 28.08],
      [44.13, 42.12, 40.3, 39.75, 37.89, 35.47, 33.75, 33.4, 33.96, 33.26, 34.22, 29.52, 27.94, 28.04, 28, 28],
      [44.26, 43.98, 43.3, 42.32, 41.16, 40.01, 39.03, 38.36, 38.12, 36.87, 32.97, 28, 28.04, 27.98, 27.91, 27.9],
      [44.32, 44.23, 43.85, 43.2, 42.4, 41.48, 40.54, 39.62, 38.92, 38.35, 34.98, 28.17, 27.9, 27.7, 27.44, 27.4],
      [44.34, 44.24, 43.98, 43.46, 42.74, 41.91, 40.98, 39.94, 38.95, 37.96, 36.73, 30.47, 27.36, 27.14, 27.01, 26.98],
      [44.31, 44.14, 43.88, 43.35, 42.6, 41.71, 40.74, 39.61, 38.51, 36.94, 35.42, 32.8, 26.84, 26.54, 26.34, 26.34],
      [44.23, 43.96, 43.63, 42.98, 42.03, 40.95, 39.73, 38.48, 37.34, 35.58, 33.22, 34.01, 28.8, 26.04, 26.04, 26.04],
      [44.22, 43.94, 43.58, 42.24, 39.66, 38.31, 37.35, 36.46, 35.6, 34.08, 32.02, 32.88, 32.38, 31.7, 31.3, 31.3],
      [44.22, 43.94, 42.7, 38.27, 36.15, 36.43, 35.3, 34.84, 33.99, 33.42, 30.85, 31.76, 31.65, 31.21, 31.14, 31.14],
      [44.22, 43.94, 39.89, 36.15, 35.6, 36.04, 35.3, 34.6, 33.88, 33.36, 30.42, 31.5, 31.32, 31.1, 31.1, 31.1],
      [44.22, 42.9, 36.15, 35.6, 35.6, 35.78, 35.3, 34.38, 33.88, 32.78, 30.2, 31.36, 31.22, 31.1, 31.1, 31.1],
      [44.22, 39.31, 35.6, 35.6, 35.6, 35.6, 35.3, 34.18, 33.88, 32.18, 30.2, 31.16, 31.2, 31.1, 31.1, 31.1],
      [44.22, 36.28, 35.6, 35.6, 35.6, 35.6, 35.3, 34, 33.88, 31.54, 30.2, 31.26, 31.2, 31.1, 31.1, 31.1],
      [41.83, 35.6, 35.6, 35.6, 35.6, 35.6, 35.12, 34, 33.88, 31.14, 30.3, 31.22, 31.2, 31.1, 31.1, 31.1],
      [39.42, 35.6, 35.6, 35.6, 35.6, 35.6, 35.08, 34, 33.88, 30.88, 30.4, 31.2, 31.2, 31.1, 31.1, 31.1],
    ],
  };
}

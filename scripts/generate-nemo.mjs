// Genereert een vereenvoudigd, gesloten 3D-model van NEMO Science Museum in
// Amsterdam (Renzo Piano, 1997): de koperen scheepsromp boven de IJtunnel met
// de uitkragende boeg boven het plein aan het Oosterdok, het oplopende
// trappenplein op het dak, het hogere middenvolume, de terugliggende
// trappenhuizen in beide zijgevels, de naar buiten hellende zuidgevel en de
// bakstenen toren. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-nemo.mjs              # 1:1000 (standaard)
//   node scripts/generate-nemo.mjs --scale 500
//
// Printbaar op 1:1000 zonder losse steunconstructie (laag 0,2 mm, overhang 45
// graden, steunbreedte 0,8 mm in lib/server/overhang-support.ts): de onderkant
// van de boeg loopt onder 47 graden op in plaats van de werkelijke circa 30
// graden, en de gevels hellen hooguit 25 graden.
//
// Assenstelsel: oorsprong op RD (122660, 487475), op straatniveau aan de
// zuidkant (NAP +1,5 m), Z omhoog, +X naar het oosten en +Y naar het noorden
// (de boeg).
//
// Bronnen: BAG-pand 0363100012164988 (dakomtrek met de ronde boeg, de schuine
// zuidgevel en de nissen van de trappenhuizen); AHN DSM/DTM 0,5 m (PDOK WCS)
// voor het dakprofiel, het middenvolume, de toren en het straat- en kadeniveau;
// PDOK luchtfoto voor de indeling van het dak; Wikimedia Commons-foto's voor de
// boeg, de entreehal, de gevelhelling en de toren.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "nemo");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Polygoon in het YZ-vlak, uitgetrokken langs X van x0 tot x1.
const profileX = (points, x0, x1) =>
  Manifold.extrude([ccw(points)], x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, 0]);

// ---------- maten (z = NAP - 1,5 m, straatniveau aan de zuidkant) ----------
const ORIGIN = [122660, 487475];
const NAP = (h) => h - 1.5;
const local = ([x, y]) => [x - ORIGIN[0], y - ORIGIN[1]];
// Dakomtrek volgens de BAG (Amsterdam meet de bovenaanzichtcontour), zonder
// de nissen van de trappenhuizen; die worden apart uitgespaard.
const BAG = [
  [122647.9, 487523.1], [122646.0, 487520.1], [122644.4, 487516.9], [122642.9, 487513.2],
  [122641.6, 487509.3], [122640.8, 487505.4], [122640.2, 487501.3], [122640.0, 487497.3],
  [122640.1, 487493.2], [122641.3, 487488.3], [122641.4, 487470.3], [122641.1, 487460.2],
  [122640.7, 487453.7], [122640.2, 487447.6], [122639.6, 487442.0], [122638.8, 487436.4],
  [122638.1, 487431.9], [122637.7, 487429.8], [122678.8, 487416.7], [122680.9, 487447.9],
  [122682.0, 487466.5], [122682.9, 487487.3], [122683.0, 487491.4], [122681.8, 487508.2],
  [122680.8, 487514.3], [122678.6, 487520.0], [122675.6, 487525.2], [122672.5, 487528.9],
  [122669.3, 487531.8], [122666.5, 487533.3], [122663.4, 487534.0], [122660.3, 487533.9],
  [122657.3, 487532.9], [122654.9, 487531.5], [122652.5, 487529.1], [122650.3, 487526.5],
].map(local);
// Trappenhuizen: terugliggende nissen in beide zijgevels (BAG), over de volle
// hoogte, tussen de romp en de boeg.
const STAIR_NICHES = [
  [[122640.1, 487488.3], [122645.5, 487493.6]],
  [[122678.1, 487486.7], [122683.0, 487491.4]],
].map(([a, b]) => [local(a), local(b)]);

const BASE = NAP(-2.0); // onder kade (NAP +0,6 m) en water (NAP -0,4 m)
const HULL_BOTTOM = NAP(4.5); // onderkant van de koperen gevel boven de begane grond
const HULL_FLARE = { inset: 1.5, top: NAP(13.5) }; // gevels waaieren uit tot de dakrand
const PLINTH_INSET = 1.9; // begane grond ligt terug onder de koperen gevel
// Entreehal onder de boeg: dubbelhoog glas tot NAP +9,3 m, van y = 487494 tot
// 487514,4 (foto: 19,6 m achter de punt van de boeg).
// Onder de boeg ligt de glazen hal ver terug: de koperen schaal waaiert vanaf
// de hal uit tot de dakrand (frontale foto: onderrand circa 74 % van de breedte
// bovenaan).
const HALL = { from: 487494 - ORIGIN[1], to: 487514.4 - ORIGIN[1], top: NAP(9.3), inset: 6.5 };
const BOW_FLARE = { inset: 6.0, top: NAP(25.5) };
// Uitbouw in de oostgevel onder de boeg, tussen trappenhuis en halfront (foto
// en Mapbox-landmarkmodel ter vergelijking, maten uit de foto): trapezium van
// 13,3 m onderaan en 8,2 m bovenaan, van 4,7 tot 14,7 m boven straat, met de
// voorkant 2,4 m binnen de dakrand en onderaan een afschuining van 45 graden
// naar de hal.
const BULGE = {
  bottom: [487496.2, 487509.5],
  top: [487498.4, 487506.6],
  z0: 4.7,
  z1: 14.7,
  front: 122680.0 - 122660,
};
// Onderkant van de boeg: van de voorkant van de hal onder 47 graden omhoog.
const PROW_SLOPE = Math.tan((47 * Math.PI) / 180);
// Zuidgevel helt naar buiten: op de hoogte van de onderkant van de romp
// 4 m achter de dakrand (foto: circa 25 graden).
const SOUTH = { a: local([122637.7, 487429.8]), b: local([122678.8, 487416.7]), lean: 4.0 };

// Dakprofiel langs Y (NAP, AHN): trappenplein in negen treden van 13,7 naar
// 22 m, daarachter het middenvolume (25 tot 27 m) en het boegdak (25,3 tot
// 30 m).
const PLAZA = { from: 487426, to: 487480, low: 13.7, high: 22.0, steps: 9 };
const MID = { from: 487481.5, to: 487496.5, low: 24.9, high: 27.0, x0: 122649, x1: 122674 };
const BOW = { from: 487496.5, to: 487535, low: 25.3, high: 30.0 };
// Bakstenen toren aan de zuidgevel (AHN: 3,5 × 3 m, tot NAP +23 m).
const TOWER = { x0: 122649, x1: 122652.5, y0: 487427.7, y1: 487430.8, top: 23.0 };

// ---------- romp ----------
const outline = new CrossSection([ccw(BAG)]);
const slab = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
let hull = Manifold.hull([
  slab(outline.offset(-HULL_FLARE.inset, "Round"), HULL_BOTTOM, HULL_BOTTOM + 0.01),
  slab(outline, HULL_FLARE.top, NAP(40)),
]);

// Dak: alles boven het dakprofiel weg (profiel in YZ, over de volle breedte).
const ly = (y) => y - ORIGIN[1];
const roofPts = [[ly(487400), NAP(12.6)], [ly(PLAZA.from), NAP(PLAZA.low)]];
const stepRun = (PLAZA.to - PLAZA.from) / PLAZA.steps;
const stepRise = (PLAZA.high - PLAZA.low) / (PLAZA.steps - 1);
for (let i = 0; i < PLAZA.steps; i++) {
  const z = NAP(PLAZA.low + stepRise * i);
  roofPts.push([ly(PLAZA.from + stepRun * i), z], [ly(PLAZA.from + stepRun * (i + 1)), z]);
}
roofPts.push(
  [ly(MID.from), NAP(PLAZA.high)],
  [ly(MID.from), NAP(MID.low)],
  [ly(MID.to), NAP(MID.high)],
  [ly(BOW.from), NAP(BOW.low)],
  [ly(BOW.to), NAP(BOW.high)],
  [ly(487560), NAP(BOW.high)],
  [ly(487560), NAP(60)],
  [ly(487400), NAP(60)],
);
hull = hull.subtract(profileX(roofPts, -60, 60));
// Naast het middenvolume ligt het dak op pleinhoogte.
for (const [x0, x1] of [[-60, MID.x0 - ORIGIN[0]], [MID.x1 - ORIGIN[0], 60]]) {
  hull = hull.subtract(boxFromTo(x0, x1, ly(MID.from), ly(MID.to - 2), NAP(PLAZA.high), NAP(60)));
}
// Onder de boeg: entreehal open tot NAP +9,3 m, daarna de schuine onderkant.
const prowCut = profileX(
  [
    [HALL.from, NAP(-10)],
    [HALL.from, HALL.top],
    [HALL.to, HALL.top],
    [HALL.to + 80, HALL.top + 80 * PROW_SLOPE],
    [HALL.to + 80, NAP(-10)],
  ],
  -60,
  60,
);
hull = hull.subtract(prowCut);
// Boeg: vanaf de entreehal waaiert de schaal sterker uit dan de romp.
const bowShell = Manifold.hull([
  slab(outline.offset(-BOW_FLARE.inset, "Round"), HALL.top, HALL.top + 0.01),
  slab(outline, BOW_FLARE.top, NAP(40)),
]);
hull = union([
  hull.intersect(boxFromTo(-60, 60, -80, HALL.from, BASE - 1, NAP(60))),
  hull.intersect(bowShell).intersect(boxFromTo(-60, 60, HALL.from, 80, BASE - 1, NAP(60))),
]);
// Zuidgevel: helt van de dakrand naar buiten; aan de onderkant 4 m terug.
// `profile` ligt in het stelsel langs de gevel: X langs de rand van west naar
// oost, +Y naar binnen (noord); wat het profiel omsluit valt weg.
function southCut(profile) {
  const [ax, ay] = SOUTH.a;
  const [bx, by] = SOUTH.b;
  const angle = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
  return profileX(profile, -20, 80).rotate([0, 0, angle]).translate([ax, ay, 0]);
}
hull = hull.subtract(
  southCut([
    [SOUTH.lean, HULL_BOTTOM],
    [0, HULL_FLARE.top],
    [0, NAP(60)],
    [-60, NAP(60)],
    [-60, BASE - 20],
    [SOUTH.lean, BASE - 20],
  ]),
);
// Nissen tot buiten de gevel, zodat de convexe romp geen dun randje laat staan.
const nicheBox = ([[x0, y0], [x1, y1]]) =>
  boxFromTo(x0 < 0 ? -60 : x0, x1 > 0 ? 60 : x1, y0, y1, BASE - 1, NAP(60));
for (const niche of STAIR_NICHES) hull = hull.subtract(nicheBox(niche));

// Begane grond: terugliggend onder de romp; onder de boeg de hoge entreehal.
const plinthOutline = outline.offset(-PLINTH_INSET, "Round");
let plinth = union([
  slab(plinthOutline, BASE, HULL_BOTTOM + 0.05).intersect(boxFromTo(-60, 60, -80, HALL.from, BASE - 1, 60)),
  slab(outline.offset(-HALL.inset, "Round"), BASE, HALL.top + 0.05).intersect(
    boxFromTo(-60, 60, HALL.from - 0.01, HALL.to, BASE - 1, 60),
  ),
]);
const plinthSouth = SOUTH.lean + 0.4;
plinth = plinth.subtract(
  southCut([[plinthSouth, BASE - 20], [plinthSouth, NAP(60)], [-60, NAP(60)], [-60, BASE - 20]]),
);
for (const niche of STAIR_NICHES) plinth = plinth.subtract(nicheBox(niche));
// Uitbouw: trapezium in het YZ-vlak, uitgetrokken van binnen de romp tot de
// voorkant; daaronder een afschuining van 45 graden tot de gevel van de hal.
const hallFace = 122681.8 - 122660 - HALL.inset;
let bulge = profileX(
  [
    [ly(BULGE.bottom[0]), BULGE.z0],
    [ly(BULGE.bottom[1]), BULGE.z0],
    [ly(BULGE.top[1]), BULGE.z1],
    [ly(BULGE.top[0]), BULGE.z1],
  ],
  hallFace - 3,
  BULGE.front,
);
const chamferDepth = BULGE.front - hallFace;
bulge = union([
  bulge,
  profileY(
    [
      [hallFace - 0.01, BULGE.z0 - chamferDepth],
      [BULGE.front, BULGE.z0 + 0.01],
      [hallFace - 0.01, BULGE.z0 + 0.01],
    ],
    ly(BULGE.bottom[0]),
    ly(BULGE.bottom[1]),
  ),
]);
const body = union([hull, plinth, bulge]);

const tower = boxFromTo(
  TOWER.x0 - ORIGIN[0],
  TOWER.x1 - ORIGIN[0],
  TOWER.y0 - ORIGIN[1],
  TOWER.y1 - ORIGIN[1],
  BASE,
  NAP(TOWER.top),
);

const parts = [
  ["building:romp", body],
  ["building:toren", tower],
];
const printModel = union([body, tower]);

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
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "nemo.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-nemo.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant (NAP -2 m) op het printbed.
const stlFile = path.join(outDir, `nemo-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint NEMO Amsterdam 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. Oorsprong op straatniveau
// aan de zuidkant; het maaiveld wordt daar bemonsterd, niet op de lagere kade
// of de tunnelhelling.
await writeFile(
  path.join(outDir, "nemo.json"),
  JSON.stringify(
    {
      name: "NEMO Science Museum",
      file: "nemo.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: [1, 0],
      groundOffsetMetres: -0.3,
      // Straat ten zuidwesten van het gebouw (NAP +1,5 m).
      groundSamplePoints: [
        [-20, -55],
        [-10, -52],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0363100012164988"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (122660, 487475) op straatniveau aan de zuidkant (NAP +1,5 m), +X naar het oosten en +Y naar het noorden, de boeg. Het model loopt door tot NAP -2 m, onder de kade en het water. Het maaiveld wordt op de straat ten zuidwesten bemonsterd. Vervangt de PDOK-reconstructie van BAG-pand 0363100012164988. Vereenvoudigd om op 1:1000 zonder losse steunconstructie te printen: de onderkant van de boeg loopt onder 47 graden op in plaats van circa 30. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`nemo-1-${scale}.stl`],
      realWorld: {
        lengthM: 117.3,
        widthM: 45.3,
        bowTopNapM: BOW.high,
        plazaNapM: [PLAZA.low, PLAZA.high],
        plazaSteps: PLAZA.steps,
        middleVolumeNapM: [MID.low, MID.high],
        entranceHallTopNapM: 9.3,
        towerTopNapM: TOWER.top,
        prowUndersideDegrees: { real: 30, model: 47 },
      },
      sources: [
        "https://nl.wikipedia.org/wiki/NEMO_(museum)",
        "PDOK BAG pand 0363100012164988 (dakomtrek, boeg, trappenhuizen), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor dakprofiel, middenvolume, toren en straatniveau",
        "PDOK luchtfoto (Actueel_orthoHR) voor de indeling van het dak",
        "Wikimedia Commons: NEMO science center from tour boat 2016-09-12-6565.jpg, A view on the NEMO-museum, located above the entrance of the IJ-tunnel, in Amsterdam, FotoDutch, 2013.jpg, 2018 - NEMO Science Museum, Amsterdam, Netherlands ( Ank Kumar ) 01.jpg, NEMO and area.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van het Olympisch Stadion in
// Amsterdam (Jan Wils, 1928) met de vrijstaande Marathontoren: de ovale
// bakstenen kom met de open tribunering rond het veld, de overdekte
// hoofdtribune aan de westzijde en de overdekte Marathontribune aan de
// oostzijde, de lagere hoekbouwdelen naast de hoofdtribune, de entree onder de
// Marathontribune en het scorebord aan de noordkant, plus de Marathontoren met
// zijn voet, schacht, balkonplaat en de schaal met bol op de top. Alle vormen
// zijn glad en gefit op het AHN; het Mapbox-landmarkmodel is niet gebruikt.
// Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus binaire STL's in millimeters op 1:<schaal> (los, en met een
// grondplaat die stadion en toren tot één stuk verbindt).
//
//   node scripts/generate-olympisch-stadion.mjs              # 1:1000 (standaard)
//   node scripts/generate-olympisch-stadion.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van het veld op straatniveau (NAP +1,1 m),
// Z omhoog. +X loopt langs de lengteas van het veld naar het noordnoordwesten
// (RD-richting 102 graden), +Y dwars daarop naar het westzuidwesten, naar de
// hoofdtribune. De Marathontoren staat aan de -Y-kant (oost), 11 m voor de
// gevel van de Marathontribune.
//
// Bronnen: BAG-panden 0363100012076088 (stadion: gevellijn van de kom) en
// 0363100012250984 (Marathontoren: voet); AHN DSM/DTM 0,5 m (PDOK WCS):
// binnenrand van de kom (even fourierreeks in de hoek, afwijking 0,15 m),
// tribunering (hellend vlak per hoek, afwijking 0,15 m), tribunedaken,
// hoekbouwdelen, entree, scorebord, hoogte van de toren (bol tot NAP +45,9 m,
// balkons +37 m) en straatniveau; Wikipedia (Marathontoren 46 m, betonnen
// skelet met bakstenen platen, vier balkons met uitkragende luifels); foto's op
// Wikimedia Commons (opbouw van de toren); PDOK luchtfoto. Geschat: de hoogte
// van de voet van de toren (NAP +13 m), de breedte van de schacht (3,2 m), de
// maat van de balkonplaat (6 m) en van de bol (3,4 m doorsnede), en de lage
// voorrand van de hoofdtribune (NAP +12 m; het AHN toont daar gemengde waarden).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "olympisch-stadion");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection, Mesh } = wasm;
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
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Polygoon in het YZ-vlak (punten als [y, z]), uitgetrokken langs X van x0 tot x1.
const profileX = (points, x0, x1) => profileY(points, -x1, -x0).rotate([0, 0, 90]);
const prism = (polys, z0, z1) =>
  Manifold.extrude(new CrossSection(polys.map(ccw)), z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Vierkant van zijde a0 op z0 dat taps uitloopt naar zijde a1 op z1, rond (x, y).
const frustum = (x, y, a0, a1, z0, z1) =>
  Manifold.extrude(CrossSection.square([a0, a0], true), z1 - z0, 0, 0, [a1 / a0, a1 / a0]).translate([x, y, z0]);

// ---------- maten (z = NAP - 1,1 m) ----------
const ORIGIN = [118673.178, 484086.631];
const X_AXIS = [-0.20791, 0.97815]; // RD-richting 102 graden, langs het veld
const NAP = (h) => h - 1.1;
// Alle onderdelen beginnen op dezelfde onderkant, 1 m onder straatniveau.
const BASE = NAP(0.1);

// Binnenrand van de kom (AHN, eerste rij boven het veld): straal als even
// fourierreeks in de hoek phi vanaf +X, r = c0 + c1 cos 2phi + ... + c4 cos 8phi.
const INNER = [80.643, 21.363, 0.256, -0.244, 0.266];
// Gevel van de kom (BAG-contour buiten de tribunes): superellips
// |x/A|^n + |y/B|^n = 1.
const OUTER = { a: 121.004, b: 82.375, n: 2.19 };
// Tribunering: hellend vlak van de binnenrand (t = 0) naar de gevel (t = 1),
// z = (a0 + b0 t) + (a1 + b1 t) cos 2phi + (a2 + b2 t) cos 4phi in NAP (AHN,
// afwijking 0,15 m): +5,5 m aan de binnenrand en +12,8 m aan de gevel op de
// lange as, lager in de bochten. Onder de overdekte tribunes valt de kom weg.
const RING = { a: [2.61, 3.312, -1.128], b: [8.656, -0.902, 0.834], min: 2.1 };
const RING_STEPS = 720;
// Overdekte tribunes over de rechte zijden, x van -47,6 tot 47,9 m.
const STAND_X = [-47.6, 47.9];
// Hoofdtribune (west, +Y): voorrand op +12 m, dak +18,83 m tot y 68,5 m,
// daarna +19,5 m aflopend naar +19,25 m en een dakrand van +18,5 m aan de gevel.
const MAIN = { front: 60.2, step: 62.4, frontZ: 12.0, lowZ: 18.83, ridge: 68.5, ridgeZ: 19.5, eave: 88.6, eaveZ: 19.25, wall: 89.7, wallZ: 18.5 };
// Marathontribune (oost, -Y): dak +14,05 m, achterrand +13,72 m.
const EAST = { front: -60.3, back: -77.2, wall: -78.8, z: 14.05, backZ: 13.72 };
// Hoekbouwdelen naast de hoofdtribune tot +11,1 m, entree onder de
// Marathontribune tot +11,2 m, scorebord aan de noordkant tot +20,1 m.
const WINGS = [
  { x0: -53.9, x1: STAND_X[0] + 0.5, y0: 74, y1: 89.6, top: 11.1 },
  { x0: STAND_X[1] - 0.5, x1: 55.6, y0: 74, y1: 89.6, top: 11.1 },
];
const ENTRANCE = { x0: -6.9, x1: 8.1, y0: -81.4, y1: EAST.wall + 0.5, top: 11.2 };
const SCOREBOARD = { x0: 119.4, x1: 123.1, y0: -14.8, y1: 14.8, top: 20.1 };
// Marathontoren: voet volgens de BAG-contour tot +13 m (geschat), schacht van
// 3,2 m, uitkragende balkonplaat (luifel) van 6 m met de bovenkant op +37 m
// (AHN), bovenbouw van 2,4 m tot +41,2 m, hals van 1,4 m en een schaal die
// onder 50 graden uitloopt in een bol van 3,4 m met de top op +45,9 m (AHN).
// De luifel hangt in de GLB vrij uit, zoals in werkelijkheid; de export zet er
// laag voor laag een kraag onder de printbare hoek onder, en de STL's krijgen
// een console van 49 graden (corbelFrom tot slabFrom).
const TOWER_BAG = [
  [11.19, -94.87], [12.98, -94.86], [12.98, -91.03], [9.57, -91.04], [9.57, -89.92],
  [8.88, -89.92], [8.89, -95.49], [9.58, -95.49], [9.58, -94.87],
];
const TOWER = {
  x: 11.28,
  y: -92.95,
  plinthTop: 13.0,
  shaft: 3.2,
  corbelFrom: 34.8,
  slab: 6.0,
  slabFrom: 36.4,
  slabTop: 37.0,
  upper: 2.4,
  upperTop: 41.2,
  neck: 1.4,
  bowlR: 1.7,
  top: 45.9,
  coneR: 0.7,
  coneAngle: 50,
};

// ---------- kom ----------
const rIn = (phi) => INNER[0] + INNER.slice(1).reduce((sum, c, k) => sum + c * Math.cos(2 * (k + 1) * phi), 0);
const rOut = (phi) =>
  1 / ((Math.abs(Math.cos(phi)) / OUTER.a) ** OUTER.n + (Math.abs(Math.sin(phi)) / OUTER.b) ** OUTER.n) ** (1 / OUTER.n);
const ringZ = (phi, t) =>
  Math.max(RING.min, RING.a.reduce((sum, a, k) => sum + (a + RING.b[k] * t) * Math.cos(2 * k * phi), 0));

// Gesloten ring: per hoek vier punten (binnen boven, buiten boven, buiten
// onder, binnen onder); het bovenvlak is per hoek een rechte lijn.
function bowlSolid() {
  const pos = [];
  for (let i = 0; i < RING_STEPS; i++) {
    const phi = (2 * Math.PI * i) / RING_STEPS;
    const [c, s] = [Math.cos(phi), Math.sin(phi)];
    const ri = rIn(phi);
    const ro = rOut(phi);
    pos.push(ri * c, ri * s, NAP(ringZ(phi, 0)));
    pos.push(ro * c, ro * s, NAP(ringZ(phi, 1)));
    pos.push(ro * c, ro * s, BASE);
    pos.push(ri * c, ri * s, BASE);
  }
  const tri = [];
  for (let i = 0; i < RING_STEPS; i++) {
    const a = i * 4;
    const b = ((i + 1) % RING_STEPS) * 4;
    for (let k = 0; k < 4; k++) {
      const k1 = (k + 1) % 4;
      // Vierhoek tussen hoek i en i + 1, linksom gezien van buitenaf.
      tri.push(a + k, a + k1, b + k1, a + k, b + k1, b + k);
    }
  }
  return new Manifold(
    new Mesh({ numProp: 3, vertProperties: new Float32Array(pos), triVerts: new Uint32Array(tri) }),
  );
}
const bowl = bowlSolid().subtract(box(STAND_X[0], STAND_X[1], -100, 100, BASE - 1, NAP(40)));

// ---------- tribunes en bijgebouwen ----------
const mainStand = profileX(
  [
    [MAIN.front, BASE],
    [MAIN.wall, BASE],
    [MAIN.wall, NAP(MAIN.wallZ)],
    [MAIN.eave, NAP(MAIN.eaveZ)],
    [MAIN.ridge, NAP(MAIN.ridgeZ)],
    [MAIN.ridge, NAP(MAIN.lowZ)],
    [MAIN.step, NAP(MAIN.lowZ)],
    [MAIN.step, NAP(MAIN.frontZ)],
    [MAIN.front, NAP(MAIN.frontZ)],
  ],
  STAND_X[0],
  STAND_X[1],
);
const eastStand = profileX(
  [
    [EAST.wall, BASE],
    [EAST.front, BASE],
    [EAST.front, NAP(EAST.z)],
    [EAST.back, NAP(EAST.z)],
    [EAST.back, NAP(EAST.backZ)],
    [EAST.wall, NAP(EAST.backZ)],
  ],
  STAND_X[0],
  STAND_X[1],
);
const blocks = [...WINGS, ENTRANCE, SCOREBOARD].map(({ x0, x1, y0, y1, top }) => box(x0, x1, y0, y1, BASE, NAP(top)));
const stadium = Manifold.union([bowl, mainStand, eastStand, ...blocks]);

// ---------- Marathontoren ----------
const T = TOWER;
const coneDrop = (T.bowlR - T.coneR) * Math.tan((T.coneAngle * Math.PI) / 180);
const bowlCentre = T.top - T.bowlR;
const coneFoot = bowlCentre - coneDrop;
// Profiel (straal, hoogte) van de schaal met bol, gedraaid rond de as: een
// kegel onder 50 graden tot de evenaar en daarboven een halve bol.
const bowlProfile = [
  [0, NAP(coneFoot)],
  [T.coneR, NAP(coneFoot)],
];
for (let k = 0; k < 24; k++) {
  const a = (Math.PI / 2) * (k / 24);
  bowlProfile.push([T.bowlR * Math.cos(a), NAP(bowlCentre + T.bowlR * Math.sin(a))]);
}
bowlProfile.push([0, NAP(T.top)]);
const square = (a, z0, z1) => box(T.x - a / 2, T.x + a / 2, T.y - a / 2, T.y + a / 2, z0, z1);
const tower = Manifold.union([
  prism([TOWER_BAG], BASE, NAP(T.plinthTop)),
  square(T.shaft, BASE, NAP(T.slabFrom + 0.1)),
  square(T.slab, NAP(T.slabFrom), NAP(T.slabTop)),
  square(T.upper, NAP(T.slabTop - 0.1), NAP(T.upperTop)),
  square(T.neck, NAP(T.upperTop - 0.1), NAP(coneFoot + 0.05)),
  Manifold.revolve([bowlProfile], 48).translate([T.x, T.y, 0]),
]);

const nodes = [
  ["building:stadion", stadium],
  ["building:marathontoren", tower],
];
// Een node zonder enig vlak dat steiler dan 45 graden overhangt, krijgt in de
// export de verticale 2,5D-opvulling: dan zou de luifel als pijler van 6 m tot
// de grond doorlopen. Daarom hangt de luifel in de GLB vrij uit en krijgt
// alleen de STL de console eronder.
const corbel = frustum(T.x, T.y, T.shaft, T.slab, NAP(T.corbelFrom), NAP(T.slabFrom));
const printModel = Manifold.union([stadium, tower, corbel]);
// Grondplaat van 2 m (2 mm op 1:1000) onder de kom en de toren, zodat de
// toren met het stadion één stuk wordt.
const plateOutline = [];
for (let i = 0; i < 180; i++) {
  const phi = (2 * Math.PI * i) / 180;
  const r = rOut(phi) + 3;
  plateOutline.push([r * Math.cos(phi), r * Math.sin(phi)]);
}
const plate = Manifold.hull([
  prism([plateOutline], BASE - 2, BASE),
  box(T.x - 6, T.x + 6, T.y - 6, T.y + 6, BASE - 2, BASE),
]);
const printWithPlate = Manifold.union([printModel, plate]);

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
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "olympisch-stadion.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-olympisch-stadion.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL's staan met de onderkant (NAP +0,1 m, met grondplaat 2 m lager) op
// het printbed.
const printFiles = [];
for (const [suffix, solid, label] of [
  ["", printModel, "Olympisch Stadion"],
  ["-grondplaat", printWithPlate, "Olympisch Stadion grondplaat"],
]) {
  const file = `olympisch-stadion${suffix}-1-${scale}.stl`;
  const printSolid = solid.translate([0, 0, -solid.boundingBox().min[2]]);
  const { buffer, triangles } = toStl(printSolid, `NederPrint ${label} 1:${scale} mm Z-up`);
  await writeFile(path.join(outDir, file), buffer);
  const bb = printSolid.boundingBox();
  printFiles.push(file);
  report[file] = {
    status: printSolid.status(),
    genus: printSolid.genus(),
    triangles,
    volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
    sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
  };
}

// Catalogusitem voor lib/server/landmark-catalog.ts.
await writeFile(
  path.join(outDir, "olympisch-stadion.json"),
  JSON.stringify(
    {
      name: "Olympisch Stadion",
      file: "olympisch-stadion.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Straten en pleinen vlak langs de gevels (NAP +1,0 tot +1,2 m), niet
      // de kade aan het Noorder Amstelkanaal ten westen van het stadion.
      groundSamplePoints: [
        [0, -86],
        [0, 94],
        [127, 25],
        [-127, -25],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0363100012076088", "NL.IMBAG.Pand.0363100012250984"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van het veld op straatniveau (NAP +1,1 m) in de oorsprong, +X langs de lengteas van het veld naar het noordnoordwesten (RD-richting 102 graden) en +Y dwars daarop naar de hoofdtribune in het westzuidwesten. Het stadion is opgebouwd uit gladde vormen die op het AHN zijn gefit: de ovale kom met de tribunering als hellend vlak tussen de binnenrand en de BAG-gevel, de overdekte hoofdtribune en Marathontribune langs de rechte zijden, de hoekbouwdelen, de entree en het scorebord. De Marathontoren is een eigen node met voet, schacht, uitkragende balkonplaat (luifel, in de STL's op een console) en de schaal met bol tot NAP +45,9 m. Vervangt de PDOK-reconstructie van BAG-panden 0363100012076088 (stadion) en 0363100012250984 (toren).",
      printFiles,
      realWorld: {
        footprintM: [+(2 * OUTER.a).toFixed(1), +(MAIN.wall - EAST.wall).toFixed(1)],
        innerEdgeM: [+(2 * rIn(0)).toFixed(1), +(2 * rIn(Math.PI / 2)).toFixed(1)],
        outerFacade: OUTER,
        bowlNapM: { innerEdge: +ringZ(0, 0).toFixed(2), facade: +ringZ(0, 1).toFixed(2) },
        mainStandRoofNapM: [MAIN.lowZ, MAIN.ridgeZ],
        marathonStandRoofNapM: EAST.z,
        scoreboardNapM: SCOREBOARD.top,
        marathonTowerTopNapM: T.top,
        marathonTowerHeightM: 46,
        marathonTowerBalconyNapM: T.slabTop,
        streetNapM: 1.1,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Olympisch_Stadion_(Amsterdam)",
        "PDOK BAG panden 0363100012076088 (stadion) en 0363100012250984 (Marathontoren), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: binnenrand en tribunering van de kom, tribunedaken, hoekbouwdelen, entree, scorebord, hoogte van de Marathontoren en straatniveau",
        "Wikimedia Commons: Marathontoren 2018.jpg en Amsterdam Marathonturm am Olympiastadion E 9074 201810.jpg (opbouw van de toren)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

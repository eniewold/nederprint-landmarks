// Genereert een vereenvoudigd, gesloten 3D-model van het Rijksmuseum van
// Oudheden aan het Rapenburg in Leiden: het rondgaande complex van herenhuis
// en voormalig hofje met de vleugels onder mansardedaken met dakkapellen langs
// de straten, de overdekte noordhof onder een plat dak met de bredere
// oostvleugel ernaast, de hogere middenvleugel en de zuidhof onder een scheef
// tentdak naast een plat terras. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-rijksmuseum-van-oudheden.mjs              # 1:1000 (standaard)
//   node scripts/generate-rijksmuseum-van-oudheden.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: alles staat recht op of loopt naar boven
// smaller toe (de mansardevlakken onder 53 graden, het tentdak van de zuidhof
// flauwer maar naar boven), de dakkapellen staan op het dakvlak en er kraagt
// niets uit.
//
// Assenstelsel: oorsprong op RD (93325, 463748), midden in het complex, op het
// maaiveld (NAP +0,5 m), Z omhoog, +X naar het oosten en +Y naar het noorden
// (de assen van RD).
//
// Bronnen: BAG-pand 0546100000042566 (contour van het complex, Rapenburg 28);
// AHN DSM/DTM 0,5 m (PDOK WCS) voor de goot en de bovenkant van de vleugels,
// het platte dak van de noordhof, de middenvleugel, het dak van de zuidhof en
// het maaiveld; Wikipedia; PDOK luchtfoto voor de indeling van de daken, de
// nok van de zuidhof en de plaatsen van de dakkapellen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "rijksmuseum-van-oudheden");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const slab = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);

// ---------- maten (z = NAP - 0,5 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [93325, 463748];
const GROUND_NAP = 0.5;
const z = (nap) => nap - GROUND_NAP;
const BASE = -0.5; // 0,5 m onder het maaiveld
// BAG-pand 0546100000042566 (lokaal), zonder de punten van minder dan 0,5 m.
const OUTLINE = [
  [93343.67, 463777.73], [93336.85, 463776.82], [93336.76, 463777.22], [93335.77, 463777.06], [93313.2, 463773.84],
  [93313.24, 463773.45], [93295.43, 463770.78], [93296.63, 463764.22], [93300.65, 463743.26], [93301.83, 463737.86],
  [93305.7, 463718.28], [93322.71, 463718.05], [93357.43, 463717.64], [93356.74, 463720.64], [93355.96, 463724.02],
  [93351.61, 463743.28],
].map(([x, y]) => [x - ORIGIN[0], y - ORIGIN[1]]);
// Platte dak van de noordhof, omringd door een glazen lichtstraat die van de
// vleugels naar binnen afloopt.
const COURT_ROOF = 13.3;
// Vleugels langs de buitenrand: mansardevlak van de goot (+11,0 m) op de
// gevel tot de bovenkant (+16,1 m) op 3,8 m, vlak tot 6 m van de gevel en
// dan de lichtstraat omlaag tot het dak van de noordhof op 9 m.
const WING = { eave: 11.0, top: 16.1, slope: 3.8, flat: 6.0, depth: 9.0 };
// Ten zuiden van de middenvleugel liggen de vleugels en het terras naast de
// zuidhof lager, op +14,8 m.
const SOUTH = { y: -8, top: 14.8 };
// Middenvleugel tussen de hoven: plat dak op +19,5 m, in een dwarsstrook op
// de hoogte van de vleugels (+16,1 m) die de west- en oostvleugel verbindt.
const MIDDLE = { x: [-9, 13], y: [-8, -1.8], top: 19.5 };
const CROSS_WING = { y: [-5.5, -1.8] };
// Naast de noordhof is de oostvleugel breder: vlak op +16,0 m vanaf x = 8,5.
const EAST_BLOCK = { x: [8.5, 60], y: [-1.8, 60], top: 16.0 };
// Zuidhof: scheef tentdak (luchtfoto: glas aan de westkant, zink aan de
// oostkant) van het terras (+14,8 m) naar een nok van zuidwest naar noordoost
// op +18,0 m.
const SOUTH_COURT = { x: [-9, 26], y: [-23, -8], ridgeFrom: [-2.3, -12.6], ridgeTo: [17.8, -8.1], ridge: 18.0 };
// Dakkapellen op de mansardevlakken (luchtfoto: middens in lokale meters),
// haaks op de dichtstbijzijnde gevel: 1,6 m breed, voorkant 0,5 m achter de
// gevel, wanden tot +13,6 m en een zadeldakje tot +14,3 m.
const DORMER = { width: 1.6, front: 0.5, back: 3.0, wall: 13.6, ridge: 14.3 };
const DORMERS = [
  // westgevel aan het Rapenburg
  [-28.1, 18.6], [-27.2, 12.4], [-26.0, 6.5], [-24.8, 0.0], [-23.6, -5.3], [-21.5, -13.8], [-20.4, -19.1], [-19.5, -24.7],
  // zuidgevel
  [-14.9, -28.7], [-9.7, -28.7], [-4.4, -28.7], [2.2, -28.8], [8.8, -28.9], [15.6, -29.0], [22.1, -29.1], [27.7, -29.1],
  // oostgevel
  [18.4, 25.0], [19.6, 19.7], [21.2, 12.6], [22.9, 5.7], [24.2, 0.0], [26.8, -9.3], [28.0, -14.7], [29.4, -20.1], [30.6, -25.7],
];
// Maaiveld rondom (AHN NAP +0,3 tot +0,6 m): de kade aan het Rapenburg en de
// straten aan de zuid-, oost- en noordkant.
const GROUND_SAMPLES = [[-35, -3], [0, -36], [40, -3], [25, 37]];

// ---------- opbouw ----------
const outline = new CrossSection([ccw(OUTLINE)]);
const ring = (inset, z0, z1) => slab(outline.offset(-inset, "Miter", 2), z0, z1);
// Alles onder de mansardevlakken.
const mansard = Manifold.hull([ring(0, BASE, z(WING.eave)), ring(WING.slope, z(WING.top) - 0.01, z(WING.top))]);
// Dezelfde mansardevlakken doorgetrokken tot boven de nok van de zuidhof.
const tallInset = (WING.slope * (SOUTH_COURT.ridge + 1 - WING.eave)) / (WING.top - WING.eave);
const mansardTall = Manifold.hull([
  ring(0, BASE, z(WING.eave)),
  ring(tallInset, z(SOUTH_COURT.ridge + 1) - 0.01, z(SOUTH_COURT.ridge + 1)),
]);
// De lichtstraat en het platte dak van de noordhof, als omgekeerde trechter.
const court = Manifold.hull([ring(WING.depth, z(COURT_ROOF), 40), ring(WING.flat, z(WING.top), 40)]);
const parts = [
  mansard
    .subtract(court)
    .subtract(box([-60, 60], [-60, SOUTH.y], z(SOUTH.top), 100)),
];
// Dwarsstrook tussen de hoven.
parts.push(mansard.intersect(box([-60, 60], CROSS_WING.y, BASE, 100)));
// Terras en zuidhof tot +14,8 m.
parts.push(mansard.intersect(box([-60, 60], [-60, SOUTH.y], BASE, z(SOUTH.top))));
// Brede oostvleugel naast de noordhof, binnen het mansardevlak.
parts.push(
  ring(WING.slope, BASE, z(EAST_BLOCK.top)).intersect(box(EAST_BLOCK.x, EAST_BLOCK.y, BASE - 1, 100)),
);
// Middenvleugel.
parts.push(ring(WING.slope, BASE, 100).intersect(box(MIDDLE.x, MIDDLE.y, BASE, z(MIDDLE.top))));
// Tentdak over de zuidhof.
{
  const S = SOUTH_COURT;
  const ridge = [S.ridgeFrom, S.ridgeTo].map(([x, y]) => box([x - 0.01, x + 0.01], [y - 0.01, y + 0.01], z(S.ridge) - 0.01, z(S.ridge)));
  parts.push(
    Manifold.hull([box(S.x, S.y, z(SOUTH.top) - 0.01, z(SOUTH.top)), ...ridge]).intersect(mansardTall),
  );
}
// Dakkapellen.
{
  const edges = OUTLINE.map((p, i) => [p, OUTLINE[(i + 1) % OUTLINE.length]]);
  const inward = ccw(OUTLINE) === OUTLINE ? 1 : -1;
  for (const [cx, cy] of DORMERS) {
    let best = null;
    for (const [[px, py], [qx, qy]] of edges) {
      const len = Math.hypot(qx - px, qy - py);
      const u = [(qx - px) / len, (qy - py) / len];
      const along = Math.max(0, Math.min(len, (cx - px) * u[0] + (cy - py) * u[1]));
      const foot = [px + u[0] * along, py + u[1] * along];
      const dist = Math.hypot(cx - foot[0], cy - foot[1]);
      if (!best || dist < best.dist) best = { dist, foot, u };
    }
    const { foot, u } = best;
    // Binnenwaartse normaal (links van de rand bij een linksom contour).
    const n = [-u[1] * inward, u[0] * inward];
    const at = (a, d, h) => [foot[0] + u[0] * a + n[0] * d, foot[1] + u[1] * a + n[1] * d, h];
    const w = DORMER.width / 2;
    const points = [];
    for (const d of [DORMER.front, DORMER.back]) {
      for (const a of [-w, w]) points.push(at(a, d, z(WING.eave) - 0.5), at(a, d, z(DORMER.wall)));
      points.push(at(0, d, z(DORMER.ridge)));
    }
    parts.push(Manifold.hull(points));
  }
}
const museum = Manifold.union(parts);
const nodes = [["building:museum", museum]];
const printModel = museum;

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
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "rijksmuseum-van-oudheden.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-rijksmuseum-van-oudheden.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (0,5 m onder het maaiveld) op het printbed.
const stlFile = path.join(outDir, `rijksmuseum-van-oudheden-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Rijksmuseum van Oudheden Leiden 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Het maaiveld wordt op
// het plein en de straten rondom bemonsterd.
await writeFile(
  path.join(outDir, "rijksmuseum-van-oudheden.json"),
  JSON.stringify(
    {
      name: "Rijksmuseum van Oudheden",
      file: "rijksmuseum-van-oudheden.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: [1, 0],
      groundOffsetMetres: 0,
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0546100000042566"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (93325, 463748) midden in het complex op het maaiveld (NAP +0,5 m), +X naar het oosten en +Y naar het noorden. De vlakke onderkant ligt 0,5 m onder het maaiveld; dat wordt op de kade aan het Rapenburg en de straten rondom bemonsterd. Vervangt de PDOK-reconstructie van BAG-pand 0546100000042566. Vleugels onder mansardedaken rondom met 25 dakkapellen (plaatsen uit de luchtfoto), ten zuiden van de middenvleugel lager; de noordhof onder een plat dak met een lichtstraat rondom, de hogere middenvleugel in een dwarsvleugel en het scheve tentdak over de zuidhof, hoogtes uit het AHN. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`rijksmuseum-van-oudheden-1-${scale}.stl`],
      realWorld: {
        lengthM: 60,
        widthM: 52,
        wingEaveNapM: WING.eave,
        wingTopNapM: WING.top,
        courtRoofNapM: COURT_ROOF,
        middleWingNapM: MIDDLE.top,
        southCourtRidgeNapM: SOUTH_COURT.ridge,
        southWingsNapM: SOUTH.top,
        dormers: DORMERS.length,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Rijksmuseum_van_Oudheden",
        "PDOK BAG pand 0546100000042566 (contour, Rapenburg 28), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de vleugels, de daken van de hoven, de middenvleugel en het maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR) voor de indeling van de daken, de nok van de zuidhof en de dakkapellen",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

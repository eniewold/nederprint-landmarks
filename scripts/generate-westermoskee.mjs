// Genereert een vereenvoudigd, gesloten 3D-model van de Westermoskee (Ayasofya
// Camii) in Amsterdam-West (Marc en Nada Breitman, 2016) aan de
// Kostverlorenvaart: de vierkante gebedszaal met de getrapte hoeken en de
// kruisvormige onderbouw, de grote koepel, de enige minaret van 43 m op de
// oosthoek en de twee zuilengangen met kleine koepels, aan de noordwestkant
// langs het Piri Reisplein en schuin langs de vaart. Alle maten in het script
// zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node
// met de materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-westermoskee.mjs              # 1:1000 (standaard)
//   node scripts/generate-westermoskee.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: alles wordt naar boven toe smaller of
// staat recht op. De zuilengangen zijn dichte blokken; de balkons en de naald
// van de minaret zijn weggelaten.
//
// Assenstelsel: oorsprong onder het hart van de koepel op RD (119135,7,
// 486609,86), op het maaiveld (NAP +0,65 m), Z omhoog. +X loopt langs de zijde
// naar het noordoosten (RD-richting 51,84 graden), +Y naar het noordwesten, het
// Piri Reisplein; de vaart ligt aan de -Y-kant.
//
// Bronnen: BAG-pand 0363100012241498 (contour van de zaal, de
// noordwestvleugel en de voet van de minaret); AHN DSM/DTM 0,5 m (PDOK WCS) in
// een stelsel langs de gevels: de goot van de zaal (NAP +9,6 m), de getrapte
// hoeken (+12,2 m), de kruisvormige onderbouw (+18,5 m), de koepel (bolkap met
// een straal van 11,5 m aan de voet, top +26,8 m), de minaret (top +42,9 m), de
// zuilengangen (+8,3 m, koepeltjes tot +10 m) en het maaiveld; Wikipedia
// (minaret van 43 m); foto's van Wikimedia Commons. Geschat: de tapsheid van de
// minaret en de verdeling van de koepeltjes op de zuilengangen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "westermoskee");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(64);

// ---------- maten (lokaal stelsel, z = NAP - 0,65 m) ----------
const ORIGIN = [119135.7, 486609.86];
const ANGLE = (51.84 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 0.65;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

const HALL = { x: [-14.4, 13.9], y: [-14.3, 14.0], top: 9.6 };
const CORNERS = { half: 13.5, top: 12.2 };
const CROSS = { long: 13.2, short: 8.0, top: 18.5 };
const DOME = { radius: 11.5, base: 18.5, top: 26.8 };
// Noordwestvleugel (BAG) met het verhoogde middendeel.
const WING = { x: [-13.4, 12.9], y: [14.0, 20.3], top: 7.8 };
const PORTAL = { x: [-5.0, 5.0], y: [14.0, 20.3], top: 10.5 };
// Zuilengangen: omtrek (lokaal) en de as waarlangs de koepeltjes staan.
const ARCADES = [
  { name: "noordwest", outline: [[-13.5, 20.3], [13.0, 20.3], [13.0, 23.5], [-13.5, 23.5]], axis: [[-11.5, 21.9], [11.0, 21.9]] },
  { name: "vaart", outline: [[15.5, -14.0], [15.5, -19.7], [-15.0, -23.3], [-15.0, -18.5], [-4.0, -15.2], [-4.0, -14.0]], axis: [[13.5, -17.0], [-13.0, -20.9]] },
];
const ARCADE = { top: 8.3, dome: { radius: 1.5, top: 9.9, spacing: 3.6 } };
// Minaret: vierkante voet in de BAG-contour tot de goot van de zaal, daarop
// de taps toelopende schacht tot de spits.
const MINARET_FOOT = { x: [13.5, 18.3], y: [-14.2, -10.2] };
const MINARET = { centre: [16.46, -12.01], base: 2.1, shaftTop: 36.5, shaftRadius: 1.35, tip: 42.9 };
// Maaiveld (lokaal) rondom, niet aan de lagere kade.
const GROUND_SAMPLES = [[-20, 0], [20, 4], [0, 27], [-20, -12]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const revolve = ([cx, cy], profile) =>
  Manifold.revolve(new CrossSection([ccw(profile)]), 0).translate([cx, cy, 0]);
// Bolkap met voetstraal r en hoogte h, op z0.
const cap = (centre, r, z0, h, steps = 12) => {
  const R = (r * r + h * h) / (2 * h);
  const profile = [[0, BASE], [r, BASE], [r, z0]];
  for (let i = 1; i <= steps; i++) {
    const z = z0 + (h * i) / steps;
    profile.push([Math.sqrt(Math.max(0, R * R - (z - (z0 + h - R)) ** 2)), z]);
  }
  profile[profile.length - 1][0] = 0;
  return revolve(centre, profile);
};

// ---------- opbouw ----------
const c = CORNERS.half;
const parts = [
  box(HALL.x, HALL.y, BASE, NAP(HALL.top)),
  box([-c, c], [-c, c], BASE, NAP(CORNERS.top)),
  box([-CROSS.long, CROSS.long], [-CROSS.short, CROSS.short], BASE, NAP(CROSS.top)),
  box([-CROSS.short, CROSS.short], [-CROSS.long, CROSS.long], BASE, NAP(CROSS.top)),
  cap([0, 0], DOME.radius, NAP(DOME.base), DOME.top - DOME.base, 16),
  box(WING.x, WING.y, BASE, NAP(WING.top)),
  box(PORTAL.x, PORTAL.y, BASE, NAP(PORTAL.top)),
  box(MINARET_FOOT.x, MINARET_FOOT.y, BASE, NAP(HALL.top)),
  revolve(MINARET.centre, [
    [0, BASE],
    [MINARET.base, BASE],
    [MINARET.shaftRadius, NAP(MINARET.shaftTop)],
    [0, NAP(MINARET.tip)],
  ]),
];
for (const { outline, axis } of ARCADES) {
  parts.push(prism(outline, BASE, NAP(ARCADE.top)));
  const [[ax, ay], [bx, by]] = axis;
  const len = Math.hypot(bx - ax, by - ay);
  const n = Math.floor(len / ARCADE.dome.spacing);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    parts.push(cap([ax + (bx - ax) * t, ay + (by - ay) * t], ARCADE.dome.radius, NAP(ARCADE.top) - 0.01, ARCADE.dome.top - ARCADE.top, 6));
  }
}
const mosque = Manifold.union(parts);
const nodes = [["building:westermoskee", mosque]];

// ---------- controles ----------
if (mosque.status() !== "NoError") throw new Error(mosque.status());
{
  const mesh = mosque.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((cc, i) => cc - p[0][i]);
    const e2 = p[2].map((cc, i) => cc - p[0][i]);
    const nz = e1[0] * e2[1] - e1[1] * e2[0];
    if (nz < -1e-6) area += -nz / 2;
  }
  console.log(`ondervlak boven de onderkant: ${area.toFixed(3)} m2`);
  if (area > 0.01) throw new Error("overhang");
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
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "westermoskee.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-westermoskee.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `westermoskee-1-${scale}.stl`);
const printSolid = mosque.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Westermoskee 1:${scale} mm Z-up`);
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

await writeFile(
  path.join(outDir, "westermoskee.json"),
  JSON.stringify(
    {
      name: "Westermoskee",
      file: "westermoskee.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het plein en de straten rondom (NAP +0,6 tot +0,8 m), niet op de
      // lagere kade aan de vaart.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0363100012241498"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong onder het hart van de koepel op RD (119135,7, 486609,86), op het maaiveld (NAP +0,65 m), +X naar het noordoosten (RD-richting 51,84 graden) en +Y naar het noordwesten, het Piri Reisplein; de Kostverlorenvaart ligt aan de -Y-kant. Eén node building: de gebedszaal (goot NAP +9,6 m) met getrapte hoeken (+12,2 m), de kruisvormige onderbouw (+18,5 m) en de koepel (top +26,8 m), de noordwestvleugel met het portaal, de minaret op de oosthoek (top +42,9 m) en de twee zuilengangen met koepeltjes. Alles wordt naar boven toe smaller, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0363100012241498. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`westermoskee-1-${scale}.stl`],
      realWorld: {
        hallM: [+(HALL.x[1] - HALL.x[0]).toFixed(2), +(HALL.y[1] - HALL.y[0]).toFixed(2)],
        dome: { baseRadiusM: DOME.radius, baseNapM: DOME.base, topNapM: DOME.top },
        minaretTopNapM: MINARET.tip,
        arcadeTopNapM: ARCADE.top,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Westermoskee",
        "PDOK BAG pand 0363100012241498 (contour van zaal, noordwestvleugel en voet van de minaret), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: goot, getrapte hoeken, onderbouw, koepelprofiel, minaret, zuilengangen en maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: Westermoskee Aya Sofya (Amsterdam, The Netherlands 2017).jpg, Westermoskee - Amsterdam (26579109769).jpg, Westermoskee @ Schinkel canal @ Amsterdam - 23743717542.jpg, Minaret @ Westermoskee Ayasofya Camii @ Amsterdam West (21947158531).jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

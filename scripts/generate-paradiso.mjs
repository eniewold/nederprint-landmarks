// Genereert een vereenvoudigd, gesloten 3D-model van Paradiso in Amsterdam
// (Weteringschans 6-8), de voormalige zaal van de Vrije Gemeente (G.B. en A.
// Salm, 1880): het hoge voorgebouw aan de Weteringschans met schilddak, de
// middenrisaliet met topgevel, pinakels, een ronde blinde nis voor het
// roosvenster en het ingangsportaal; daarachter de grote zaal met het zadeldak
// (verhoogde middenstrook en twee dakruiters), de halfronde achterzijde aan de
// Singelgracht met een kegeldak, en de lagere aanbouwen aan de tuinzijde. Alle
// maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, één node met de materiaalklasse in de nodenaam) als catalogusbron
// voor de export en de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-paradiso.mjs              # 1:1000 (standaard)
//   node scripts/generate-paradiso.mjs --scale 500
//
// Alles staat op dezelfde onderkant (1 m onder het maaiveld) zonder vrije
// overhang; nissen hebben een spitse of kegelvormige bovenkant (minstens 50
// graden), zodat de export niets hoeft op te vullen.
//
// Assenstelsel: oorsprong in het hart van de BAG-contour (bbox langs de as) op
// het maaiveld (NAP +1,4 m), Z omhoog. +X loopt langs de as van de zaal van de
// voorgevel aan de Weteringschans naar de halfronde achterzijde aan de
// Singelgracht (RD-richting -128,3 graden, naar het zuidwesten), +Y 90 graden
// linksom (naar het zuidoosten, de tuinzijde).
//
// Bronnen: BAG-pand 0363100012169473 (contour); AHN DSM/DTM 0,5 m (PDOK WCS) in
// een stelsel langs de as: goot- en nokhoogtes van voorgebouw en zaal, de
// verhoogde middenstrook, de dakruiters, het kegeldak achter, de aanbouwen en
// het maaiveld; PDOK luchtfoto; Rijksmonumentenregister (nr. 6400), Wikipedia en
// Wikimedia Commons-foto's voor de gevelopbouw. Geschat uit foto's: het portaal
// (diepte, hoogte), de pinakels, de plaats en maat van de ronde nis en de
// spitsboognissen in de zijgevels.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "paradiso");
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
const box = (u0, u1, v0, v1, z0, z1) =>
  Manifold.cube([u1 - u0, v1 - v0, z1 - z0], false).translate([u0, v0, z0]);
// Profiel in het (v, z)-vlak, uitgetrokken langs X over u0..u1.
const alongX = (profile, u0, u1) =>
  Manifold.extrude([ccw(profile)], u1 - u0)
    .rotate([90, 0, 90])
    .translate([u0, 0, 0]);
// Profiel in het (u, z)-vlak, uitgetrokken langs Y over v0..v1.
const alongY = (profile, v0, v1) =>
  Manifold.extrude([ccw(profile)], v1 - v0)
    .rotate([90, 0, 0])
    .translate([0, v1, 0]);
// Vierkante pyramide met de voet op z0.
const pyramid = (cu, cv, size, z0, z1) =>
  Manifold.cylinder(z1 - z0, size / Math.SQRT2, 0.02, 4, false)
    .rotate([0, 0, 45])
    .translate([cu, cv, z0]);

// ---------- maten (hoogte boven het maaiveld, NAP +1,4 m) ----------
const ORIGIN = [120710.058, 486149.966];
const X_AXIS = [-0.61978, -0.78478];
const BASE = -1;
// BAG-pand 0363100012169473 in het lokale stelsel: voorgevel op u = -19,1 m
// (middenrisaliet -19,3 m), zijgevels op v = ±10,2 m, de halfronde achterzijde
// als cirkelsegment rond (9,17, 0) met een straal van 10,11 m.
const OUTLINE = [[-11.21, 10.32], [-11.45, 10.32], [-19.14, 10.31], [-19.13, 2.71], [-19.28, 2.71], [-19.27, -2.73], [-19.12, -2.73], [-19.11, -10.32], [-18.91, -10.32], [-11.17, -10.31], [-11.18, -10.12], [-7.75, -10.07], [-7.74, -10.18], [-0.44, -10.16], [3.84, -10.16], [6.34, -10.15], [14.95, -10.14], [14.94, -8.14], [15.5, -8.13], [15.5, -7.88], [16.18, -7.3], [16.81, -6.66], [17.37, -5.97], [17.87, -5.23], [18.3, -4.45], [18.65, -3.63], [18.93, -2.78], [19.13, -1.91], [19.24, -1.03], [19.28, -0.14], [19.23, 0.75], [19.11, 1.62], [18.9, 2.48], [18.62, 3.32], [18.26, 4.13], [17.83, 4.9], [17.33, 5.63], [16.77, 6.31], [16.15, 6.94], [15.47, 7.5], [15.47, 7.76], [14.91, 7.76], [14.91, 10.13], [14.64, 10.13], [3.77, 10.11], [-0.61, 10.1], [-7.97, 10.09], [-11.21, 10.08]];
// Voorgebouw (AHN): goot NAP +19,3 m, schilddak met de nok dwars op de as tot
// NAP +21,4 m (|v| < 7,6 m).
const FRONT = { u: [-19.12, -11.2], half: 10.32, eave: 17.9, ridge: 20.0, ridgeHalf: 7.6 };
// Middenrisaliet (BAG 0,15 m voor de gevel, AHN tot NAP +21,4 m): topgevel met
// een dwarskap tot de nok van het voorgebouw, pinakels tot 19,6 m, ronde blinde
// nis van 2,4 m (roosvenster/klok).
const RISALIT = { u: [-19.28, -15.16], half: 2.72, apex: 20.05 };
const PINNACLE = { size: 1.0, v: 2.22, top: 18.8, tip: 19.6 };
const ROSE = { z: 15.4, radius: 1.2, depth: 0.35 };
// Ingangsportaal (foto's): 1,1 m voor de gevel, 3,8 m breed, goot 5,4 m, nok 6,9 m.
const PORTAL = { u: [-20.35, -19.0], half: 1.9, eave: 5.4, ridge: 6.9 };
// Grote zaal (AHN, mediaan over u = -9..12 m): goot NAP +14,3 m op v = ±10,15
// m, dakvlak onder 24 graden tot |v| = 3,6 m, daar een trede van 0,8 m naar de
// verhoogde middenstrook, nok NAP +19,55 m.
const HALL = { u: [-11.3, 14.95], half: 10.15, eave: 12.9, step: 3.6, stepLow: 15.85, stepHigh: 16.65, ridge: 18.15 };
// Dakruiters (AHN): 2,4 m in het vierkant, tot NAP +21,7 m, punt NAP +22,1 m.
const LANTERNS = { u: [-6, 12.6], v: 0.1, size: 2.4, top: 20.3, tip: 20.7 };
// Halfronde achterzijde (BAG-boog, AHN): muur tot NAP +14,0 m, kegeldak onder
// 42 graden, tegen de kopgevel van de zaal NAP +17,9 m.
const APSE = { centre: 9.17, radius: 10.11, eave: 12.6, slope: 0.9, from: 14.9 };
// Lage aanbouwen aan de tuinzijde (AHN, buiten de BAG-contour): een lessenaar
// van 2,6 m breed langs de zaal (NAP +8,0 tot +7,3 m) en een uitbouw met
// zadeldak tot v = 16,9 m (goot NAP +7,3 m, nok NAP +8,35 m).
const LEAN_TO = { u: [-11.0, 14.6], v: [9.9, 12.7], inner: 6.6, outer: 5.9 };
const ANNEX = { u: [-0.4, 3.5], v: [10, 16.9], eave: 5.9, ridge: 6.95 };
// Spitsboognissen in de zijgevels van de zaal (foto's): vijf per zijde.
const WINDOWS = { u: [-8.5, -3.5, 1.5, 6.5, 11.5], half: 0.8, sill: 7.6, spring: 11.0, apex: 12.1, depth: 0.35 };

// ---------- opbouw ----------
const parts = [];
const outline = new CrossSection([ccw(OUTLINE)]);
// Muren op de hele BAG-contour tot de goot van de halfronde achterzijde.
parts.push(Manifold.extrude(outline, APSE.eave - BASE).translate([0, 0, BASE]));
// Voorgebouw met schilddak.
parts.push(box(FRONT.u[0], FRONT.u[1], -FRONT.half, FRONT.half, BASE, FRONT.eave));
const ridgeU = (FRONT.u[0] + FRONT.u[1]) / 2;
parts.push(
  Manifold.hull([
    [FRONT.u[0], -FRONT.half, FRONT.eave - 0.01],
    [FRONT.u[1], -FRONT.half, FRONT.eave - 0.01],
    [FRONT.u[1], FRONT.half, FRONT.eave - 0.01],
    [FRONT.u[0], FRONT.half, FRONT.eave - 0.01],
    [ridgeU, -FRONT.ridgeHalf, FRONT.ridge],
    [ridgeU, FRONT.ridgeHalf, FRONT.ridge],
  ]),
);
// Middenrisaliet met topgevel, dwarskap en pinakels.
parts.push(
  alongX(
    [[-RISALIT.half, BASE], [RISALIT.half, BASE], [RISALIT.half, FRONT.eave], [0, RISALIT.apex], [-RISALIT.half, FRONT.eave]],
    RISALIT.u[0],
    RISALIT.u[1],
  ),
);
for (const s of [-1, 1]) {
  const cv = s * PINNACLE.v;
  const cu = RISALIT.u[0] + PINNACLE.size / 2;
  const h = PINNACLE.size / 2;
  parts.push(box(cu - h, cu + h, cv - h, cv + h, BASE, PINNACLE.top));
  parts.push(pyramid(cu, cv, PINNACLE.size, PINNACLE.top, PINNACLE.tip));
}
// Ingangsportaal met zadeldakje langs de as.
parts.push(
  alongX(
    [[-PORTAL.half, BASE], [PORTAL.half, BASE], [PORTAL.half, PORTAL.eave], [0, PORTAL.ridge], [-PORTAL.half, PORTAL.eave]],
    PORTAL.u[0],
    PORTAL.u[1],
  ),
);
// Grote zaal: zadeldak met verhoogde middenstrook.
const hallProfile = [
  [-HALL.half, BASE],
  [HALL.half, BASE],
  [HALL.half, HALL.eave],
  [HALL.step, HALL.stepLow],
  [HALL.step, HALL.stepHigh],
  [0, HALL.ridge],
  [-HALL.step, HALL.stepHigh],
  [-HALL.step, HALL.stepLow],
  [-HALL.half, HALL.eave],
];
parts.push(alongX(hallProfile, HALL.u[0], HALL.u[1]));
// Dakruiters.
for (const u of LANTERNS.u) {
  const h = LANTERNS.size / 2;
  parts.push(box(u - h, u + h, LANTERNS.v - h, LANTERNS.v + h, HALL.stepLow, LANTERNS.top));
  parts.push(pyramid(u, LANTERNS.v, LANTERNS.size, LANTERNS.top, LANTERNS.tip));
}
// Halfronde achterzijde: kegeldak binnen de BAG-boog, niet hoger dan het
// zaaldak en alleen achter de kopgevel van de zaal.
const coneBottom = APSE.eave - 0.1;
const coneRadius = APSE.radius + 0.1 / APSE.slope;
const apseRoof = Manifold.cylinder(coneRadius * APSE.slope, coneRadius, 0, 96, false)
  .translate([APSE.centre, 0, coneBottom])
  .intersect(Manifold.extrude(outline, 30).translate([0, 0, coneBottom - 1]))
  .intersect(box(APSE.from, 30, -20, 20, coneBottom - 1, 40))
  .intersect(alongX(hallProfile, APSE.from - 1, 30));
parts.push(apseRoof);
// Lage aanbouwen aan de tuinzijde.
parts.push(
  alongX(
    [[LEAN_TO.v[0], BASE], [LEAN_TO.v[1], BASE], [LEAN_TO.v[1], LEAN_TO.outer], [LEAN_TO.v[0], LEAN_TO.inner]],
    LEAN_TO.u[0],
    LEAN_TO.u[1],
  ),
);
const annexMid = (ANNEX.u[0] + ANNEX.u[1]) / 2;
parts.push(
  alongY(
    [[ANNEX.u[0], BASE], [ANNEX.u[1], BASE], [ANNEX.u[1], ANNEX.eave], [annexMid, ANNEX.ridge], [ANNEX.u[0], ANNEX.eave]],
    ANNEX.v[0],
    ANNEX.v[1],
  ),
);
let paradiso = Manifold.union(parts);

// Blinde nissen: de ronde nis in de risaliet met een kegelvormige wand (52
// graden) en spitsboognissen in beide zijgevels van de zaal.
const cuts = [];
cuts.push(
  Manifold.cylinder(ROSE.depth + 0.3, ROSE.radius + 0.3 / ROSE.depth * 0.45, ROSE.radius - 0.45, 48, false)
    .rotate([0, 90, 0])
    .translate([RISALIT.u[0] - 0.3, 0, ROSE.z]),
);
const windowProfile = (u) => [
  [u - WINDOWS.half, WINDOWS.sill],
  [u + WINDOWS.half, WINDOWS.sill],
  [u + WINDOWS.half, WINDOWS.spring],
  [u, WINDOWS.apex],
  [u - WINDOWS.half, WINDOWS.spring],
];
for (const u of WINDOWS.u) {
  for (const s of [-1, 1]) {
    const v0 = s > 0 ? HALL.half - WINDOWS.depth : -HALL.half - 1;
    const v1 = s > 0 ? HALL.half + 1 : -HALL.half + WINDOWS.depth;
    cuts.push(alongY(windowProfile(u), v0, v1));
  }
}
paradiso = paradiso.subtract(Manifold.union(cuts));
const nodes = [["building:paradiso", paradiso]];
const printModel = paradiso;

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
const glbFile = path.join(outDir, "paradiso.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-paradiso.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `paradiso-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Paradiso 1:${scale} mm Z-up`);
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
  path.join(outDir, "paradiso.json"),
  JSON.stringify(
    {
      name: "Paradiso",
      file: "paradiso.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Weteringschans voor de gevel (NAP +1,35 m), het pad aan de noordwestkant
      // en de tuin aan de zuidoostkant (NAP +1,5 m); niet de lagere kade en het
      // water van de Singelgracht achter het gebouw, en niet de verdiepte
      // nachtingang naast de zaal (in het PDOK-terrein 0,6 tot 1,5 m lager).
      groundSamplePoints: [
        [-22, -6],
        [-22, 6],
        [-12, -14],
        [-6, 15],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0363100012169473"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de BAG-contour op het maaiveld (NAP +1,4 m) in de oorsprong, +X langs de as van de zaal van de voorgevel aan de Weteringschans naar de halfronde achterzijde aan de Singelgracht (RD-richting -128,3 graden) en +Y naar de tuin aan de zuidoostkant. Eén node zonder vrije overhang. Vervangt de PDOK-reconstructie van BAG-pand 0363100012169473; de lage aanbouwen aan de tuinzijde liggen buiten de BAG-contour.",
      printFiles: [`paradiso-1-${scale}.stl`],
      realWorld: {
        lengthM: +(19.28 - PORTAL.u[0]).toFixed(2),
        widthM: +(2 * FRONT.half).toFixed(2),
        frontRidgeM: FRONT.ridge,
        gableApexM: RISALIT.apex,
        hallEaveM: HALL.eave,
        hallRidgeM: HALL.ridge,
        lanternTipM: LANTERNS.tip,
        apseEaveM: APSE.eave,
        groundNapM: 1.4,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Paradiso_(Amsterdam)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/6400",
        "PDOK BAG pand 0363100012169473, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: goot- en nokhoogtes, middenstrook, dakruiters, kegeldak, aanbouwen en maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: Amsterdam_Paradiso.jpg, Voor_en_linker_zijgevel_-_Amsterdam_-_20021777_-_RCE.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

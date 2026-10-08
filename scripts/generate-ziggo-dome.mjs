// Genereert een vereenvoudigd, gesloten 3D-model van de Ziggo Dome in
// Amsterdam-Zuidoost (De Passage 100, Benthem Crouwel Architekten, 2012), de
// zwarte doos naast de Johan Cruijff ArenA: het rechthoekige volume met de
// ledgevel (verticale lamellen als groeven, een glazen plint eronder, de
// ramen in de laadgevel en de twee glazen bouwlagen met de terrasvloer aan de
// entreezijde), het vrijwel vlakke dak met een lage nok en vier
// installatiekasten met schuine kopse kanten, de twee hoeken aan de
// entreezijde (De Passage) waar de doos boven het plein uitkraagt, en de luifel
// boven de twaalf laaddocks aan de zuidwestkant. Alle maten in het script zijn
// meters op ware grootte.
//
// Het AHN bevestigt dat de massa werkelijk een eenvoudige doos is: rechte
// gevels en haaks gesneden hoeken op de dakrand (op 0,2 m na de
// BGT-voetafdruk), geen schuine gevelvlakken, geen attiek (de dakrand ligt
// hooguit 0,15 m hoger dan het dak) en geen verdiepte daken. De loopbruggen
// naar De Passage (NAP +15,5 en +20,7 m) overspannen het plein vrij en zijn
// weggelaten (niet printbaar zonder steun; ook niet in PDOK).
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-ziggo-dome.mjs              # 1:1000 (standaard)
//   node scripts/generate-ziggo-dome.mjs --scale 2000
//
// Alles staat op dezelfde onderkant (1 m onder het straatniveau). Er hangt
// niets vrij over: onder de uitkragende hoeken loopt de onderkant onder 47,7
// graden (1,1 m per meter) schuin terug naar de gevel op het plein, en de
// onderkant van de luifel boven de laaddocks loopt onder dezelfde hoek terug
// naar de straat. Zo heeft het model geen vlak dat vlakker hangt dan 45 graden
// en kiest de export de snelle verticale opvulling (de uitsparingen en de
// laaddocks worden in de print dicht gezet, op de kaart blijven ze open).
//
// Assenstelsel: oorsprong in het hart van de doos op het straatniveau aan de
// laadzijde (NAP -3,0 m), Z omhoog. +X loopt langs de korte zijde naar het
// zuidzuidoosten (RD-richting (0,482, -0,876), -61,18 graden, evenwijdig aan
// het veld van de ArenA), +Y 90 graden linksom naar het oostnoordoosten, naar
// de entree aan De Passage. De doos staat met drie zijden in het verhoogde dek
// rond het gebouw (NAP +2,1 m); alleen aan de zuidwestkant ligt de straat met
// de laaddocks (NAP -3,0 m).
//
// Bronnen: BGT-pand en BAG-pand 0363100012238052 (voetafdruk op het maaiveld,
// 90,96 × 114,9 m, met de twee uitsparingen onder de uitkragende hoeken; de
// BAG-contour heeft daarnaast de strook van de luifel aan de zuidwestkant, 5,7
// m diep); AHN DSM/DTM 0,5 m (PDOK WCS) in een stelsel langs de as: de
// dakrand (op 0,2 m na gelijk aan de BGT-voetafdruk, dus overal tot het dak
// doorlopend, ook boven de uitsparingen), dakhoogte NAP +28,0 m aan de rand en
// +28,7 m in het midden, de vier installatiekasten (8 × 16,3 m tot NAP
// +30,85 m), het dek (NAP +2,1 m, ook de bovenkant van de luifel) en het
// straatniveau; PDOK luchtfoto; Wikipedia (30 m hoog; de "90 bij 90 m" daar
// is de zaal, het AHN en de BGT geven 91 × 115 m) en Wikimedia
// Commons-foto's. Geschat: de hoogte van de onderkant van de doos boven de
// uitsparingen (NAP +10,8 m in de buitenhoek, foto: twee bouwlagen entree
// onder de doos, hier bepaald door de schuine onderkant) en de vorm van de laaddocks onder de
// luifel (onderkant 1,2 m onder de bovenkant aan de voorrand).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "ziggo-dome");
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
const section = (pts) => new CrossSection([ccw(pts)]);
const prism = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
const box = (u0, u1, v0, v1, z0, z1) =>
  Manifold.cube([u1 - u0, v1 - v0, z1 - z0], false).translate([u0, v0, z0]);
// Profiel in het (v, z)-vlak, uitgetrokken langs X over u0..u1.
const alongX = (profile, u0, u1) =>
  Manifold.extrude([ccw(profile)], u1 - u0)
    .rotate([90, 0, 90])
    .translate([u0, 0, 0]);

// ---------- maten (hoogte boven het straatniveau, NAP -3,0 m) ----------
const ORIGIN = [124311.987, 480705.199];
const X_AXIS = [0.48206, -0.87614];
const NAP = (h) => h + 3.0;
const BASE = -1;
// Dek rond de doos, ook de bovenkant van de luifel (AHN DTM).
const DECK = NAP(2.1);
// De doos (BGT-voetafdruk, AHN-dakrand): 90,96 × 114,9 m. Dak NAP +28,0 m aan
// de rand, met een lage nok tot NAP +28,7 m langs de lange as (AHN).
const HALF_U = 45.48;
const HALF_V = 57.45;
const EAVE = NAP(28.0);
const RIDGE = { top: NAP(28.7), halfV: 19 };
// Vier installatiekasten op het dak (AHN, raster per 0,5 m): 7,6 × 18,4 m,
// met een vlakke bovenkant op NAP +30,85 m tussen 33 en 45 m van de korte as
// en aan beide kopse kanten een schuin vlak (35 graden) vanaf een opstand tot
// NAP +28,8 m.
const PLANT = { u: [29.2, 36.8], v: [29.8, 48.2], top: NAP(30.85), flat: [33, 45], foot: NAP(28.8) };
// Uitsparingen onder de twee hoeken aan de entreezijde (BGT-voetafdruk, voor
// u > 0; gespiegeld voor u < 0): de gevel op het plein springt in trappen en
// schuine stukken terug tot v = 45,45 m, de doos erboven loopt door tot de
// dakrand op v = 57,45 m. De onderkant van de uitkraging loopt 1,1 m per meter
// (47,7 graden) op vanaf de gevel, 0,5 m onder het dek (zodat het plein van
// het PDOK-terrein er niet mee samenvalt); de onderkant van de doos erboven
// (NAP +10,9 m) ligt net boven het hoogste punt van die schuine onderkant in
// de buitenhoek (8,4 m van de gevel, NAP +10,8 m).
const NOTCH = [
  [33.46, 45.45],
  [41.85, 45.45],
  [39.53, 47.82],
  [39.53, 51.54],
  [35.75, 51.54],
  [33.46, 53.87],
];
const SLOPE = 1.1;
const FLOOR = DECK - 0.5;
const BOX_BOTTOM = NAP(10.9);
// Luifel boven de laaddocks aan de zuidwestkant (BAG-strook): 5,73 m diep,
// u tot ±45,17 m, bovenkant op het dek. De laaddocks eronder als schuine
// uitsparing van 86 m breed: aan de voorrand 1,2 m onder de bovenkant, daarna
// 1,1 m per meter terug tot de straat.
const CANOPY = { front: -63.18, halfU: 45.17, edge: 1.2 };
// Twaalf laaddocks onder de luifel (foto's, luchtfoto met de trailers):
// openingen van 5,1 m met penanten van 1 m, van u = -30 tot 43 m; het stuk
// aan de noordnoordwestkant is een dichte wand met een deur.
const DOCKS = { from: -30, to: 43, count: 12, pier: 1.0 };

// Gevelgeleding (foto's op Commons; geschat). De zwarte doos heeft een
// ledgevel van verticale lamellen; die staan hier als groeven van 0,5 m breed
// en 0,3 m diep om de 3 m, van de onderkant van het ledveld tot 0,8 m onder
// de dakrand (een gesloten dakrand). Het ledveld begint aan drie zijden op
// NAP +5,8 m, één bouwlaag boven het dek; daaronder ligt een glazen plint
// 0,4 m terug. Aan de entreezijde (De Passage) begint het ledveld pas op NAP
// +10,8 m: daaronder twee bouwlagen glas 0,4 m terug (de entree en het
// restaurant met het terras), gescheiden door de terrasvloer op NAP +6,3 tot
// +7,0 m. In de laadgevel drie rijen van twaalf ramen van 4,2 × 1,2 m als
// nissen van 0,35 m. Alle nissen en groeven hebben een bovenkant die onder 50
// graden terugloopt naar de gevel, zodat er geen vlak ondervlak bij komt.
const LED_BOTTOM = NAP(5.8);
const ENTRANCE = { slab: [NAP(6.3), NAP(7.0)], top: NAP(10.8) };
const RECESS = 0.4;
const GROOVE = { pitch: 3.0, width: 0.5, depth: 0.3, top: EAVE - 0.8 };
const WINDOWS = { pitch: 6.9, width: 4.2, depth: 0.35, rows: [NAP(9.0), NAP(13.9), NAP(19.0)], height: 1.2 };
// Helling van de bovenkant van een nis: 1,19 m per meter (50 graden).
const CEIL = Math.tan((50 * Math.PI) / 180);

// ---------- opbouw ----------
const rect = section([
  [-HALF_U, -HALF_V],
  [HALF_U, -HALF_V],
  [HALF_U, HALF_V],
  [-HALF_U, HALF_V],
]);
// Voetafdruk op het plein in convexe stukken: het hoofdvlak tot v = 45,45 m,
// de middenstrook tot de gevel aan De Passage en per hoek een vijfhoek en een
// driehoek uit de trappen van de BGT.
const [n0, n1, n2, n3, n4, n5] = NOTCH;
const mirror = (pts) => pts.map(([u, v]) => [-u, v]);
const cornerPieces = [
  [n0, n1, n2, n3, [n0[0], n3[1]]],
  [[n0[0], n3[1]], n4, n5],
];
const footprintPieces = [
  [[-HALF_U, -HALF_V], [HALF_U, -HALF_V], [HALF_U, n0[1]], [-HALF_U, n0[1]]],
  [[-n0[0], n0[1]], [n0[0], n0[1]], [n0[0], HALF_V], [-n0[0], HALF_V]],
  ...cornerPieces,
  ...cornerPieces.map(mirror),
];
// Per stuk de afgeknotte kegel van de voetafdruk onder het dek naar dezelfde
// voetafdruk R meter verbreed, 1,1 R hoger: samen alles wat boven een schuine
// onderkant van 47,7 graden vanaf de gevel op het plein ligt.
const R = 9;
const splay = Manifold.union(
  footprintPieces.map((pts) => {
    const piece = section(pts);
    const wide = piece.offset(R, "Round");
    const lower = piece.toPolygons().flat().map(([u, v]) => [u, v, FLOOR]);
    const upper = wide.toPolygons().flat().map(([u, v]) => [u, v, FLOOR + SLOPE * R]);
    return Manifold.hull([...lower, ...upper]);
  }),
).intersect(prism(rect, FLOOR - 1, BOX_BOTTOM + 0.5));

const parts = [
  // Onderbouw tot net onder het dek over de hele doos: in het dek verdwenen,
  // aan de laadzijde de gevel tot de straat.
  prism(rect, BASE, FLOOR),
  splay,
  prism(rect, BOX_BOTTOM, EAVE),
  // Lage nok over de lange as.
  Manifold.hull([
    ...[-1, 1].flatMap((su) => [-1, 1].map((sv) => [su * HALF_U, sv * HALF_V, EAVE - 0.5])),
    ...[-1, 1].flatMap((su) => [-1, 1].map((sv) => [su * HALF_U, sv * HALF_V, EAVE])),
    [0, -RIDGE.halfV, RIDGE.top],
    [0, RIDGE.halfV, RIDGE.top],
  ]),
];
// Installatiekasten met schuine kopse kanten.
for (const su of [-1, 1]) {
  for (const sv of [-1, 1]) {
    const [u0, u1] = su > 0 ? PLANT.u : [-PLANT.u[1], -PLANT.u[0]];
    const [a, b] = PLANT.v;
    const [f0, f1] = PLANT.flat;
    const profile = [
      [a, EAVE - 0.5],
      [b, EAVE - 0.5],
      [b, PLANT.foot],
      [f1, PLANT.top],
      [f0, PLANT.top],
      [a, PLANT.foot],
    ].map(([v, z]) => [sv * v, z]);
    parts.push(alongX(profile, u0, u1));
  }
}
// Luifel met de laaddocks eronder.
const canopy = prism(
  section([
    [-CANOPY.halfU, CANOPY.front],
    [CANOPY.halfU, CANOPY.front],
    [CANOPY.halfU, -HALF_V + 0.5],
    [-CANOPY.halfU, -HALF_V + 0.5],
  ]),
  BASE,
  DECK,
);
const soffit = DECK - CANOPY.edge;
const dockPitch = (DOCKS.to - DOCKS.from) / DOCKS.count;
const docks = Manifold.union(
  Array.from({ length: DOCKS.count }, (_, k) =>
    alongX(
      [
        [CANOPY.front - 1, 0],
        [CANOPY.front - 1, soffit + SLOPE],
        [CANOPY.front, soffit],
        [CANOPY.front + soffit / SLOPE, 0],
      ],
      DOCKS.from + k * dockPitch + DOCKS.pier / 2,
      DOCKS.from + (k + 1) * dockPitch - DOCKS.pier / 2,
    ),
  ),
);
parts.push(canopy.subtract(docks));

// Gevelgeleding: nissen en groeven als convexe snijvormen per gevel. t loopt
// langs de gevel, d naar buiten (d < 0 is in de doos); de bovenkant loopt
// vanaf de achterwand onder 50 graden schuin naar buiten omhoog.
const FACES = {
  E: (t, d, z) => [HALF_U + d, t, z],
  W: (t, d, z) => [-HALF_U - d, t, z],
  N: (t, d, z) => [t, HALF_V + d, z],
  S: (t, d, z) => [t, -HALF_V - d, z],
};
const OUT = 1.5;
const niche = (face, t0, t1, z0, z1, depth) =>
  Manifold.hull(
    [t0, t1].flatMap((t) => [
      FACES[face](t, -depth, z0),
      FACES[face](t, OUT, z0),
      FACES[face](t, OUT, z1 + (OUT + depth) * CEIL),
      FACES[face](t, -depth, z1),
    ]),
  );
const cuts = [];
// Glazen plint onder het ledveld: op de laadgevel boven de luifel, op de
// lange gevels vanaf net onder het dek tot de uitsparingen aan de entreezijde.
cuts.push(niche("S", -HALF_U - 1, HALF_U + 1, DECK, LED_BOTTOM, RECESS));
for (const face of ["E", "W"]) {
  cuts.push(niche(face, -HALF_V, NOTCH[0][1], FLOOR, LED_BOTTOM, RECESS));
}
// Entree: twee bouwlagen glas onder de doos, gescheiden door de terrasvloer.
const entranceU = NOTCH[0][0];
cuts.push(niche("N", -entranceU, entranceU, FLOOR, ENTRANCE.slab[0], RECESS));
cuts.push(niche("N", -entranceU, entranceU, ENTRANCE.slab[1], ENTRANCE.top, RECESS));
// Ledlamellen.
const grooveBottom = LED_BOTTOM + RECESS * CEIL + 0.1;
const grooveBottomN = ENTRANCE.top + RECESS * CEIL + 0.1;
const grooveCentres = (half) => {
  const n = Math.floor((2 * half - 3) / GROOVE.pitch);
  return Array.from({ length: n + 1 }, (_, k) => (k - n / 2) * GROOVE.pitch);
};
for (const [face, half, z0] of [
  ["E", HALF_V, grooveBottom],
  ["W", HALF_V, grooveBottom],
  ["S", HALF_U, grooveBottom],
  ["N", HALF_U, grooveBottomN],
]) {
  for (const t of grooveCentres(half)) {
    cuts.push(niche(face, t - GROOVE.width / 2, t + GROOVE.width / 2, z0, GROOVE.top, GROOVE.depth));
  }
}
// Ramen in de laadgevel.
for (const z0 of WINDOWS.rows) {
  for (let k = 0; k < 12; k++) {
    const t = (k - 5.5) * WINDOWS.pitch;
    cuts.push(niche("S", t - WINDOWS.width / 2, t + WINDOWS.width / 2, z0, z0 + WINDOWS.height, WINDOWS.depth));
  }
}

const dome = Manifold.union(parts).subtract(Manifold.union(cuts));
const nodes = [["building:ziggo-dome", dome]];
const printModel = dome;

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
const glbFile = path.join(outDir, "ziggo-dome.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-ziggo-dome.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (1 m onder het straatniveau) op het printbed.
const stlFile = path.join(outDir, `ziggo-dome-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Ziggo Dome 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts.
const modelBox = dome.boundingBox();
await writeFile(
  path.join(outDir, "ziggo-dome.json"),
  JSON.stringify(
    {
      name: "Ziggo Dome",
      file: "ziggo-dome.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // De straat met de laaddocks aan de zuidwestkant (NAP -3,0 m), niet het
      // verhoogde dek aan de andere drie zijden (NAP +2,1 m).
      groundSamplePoints: [
        [-30, -70],
        [0, -70],
        [30, -70],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0363100012238052"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de doos op het straatniveau aan de laadzijde (NAP -3,0 m) in de oorsprong, +X langs de korte zijde naar het zuidzuidoosten (RD-richting -61,18 graden, evenwijdig aan de ArenA) en +Y naar de entree aan De Passage. Eén node zonder vrije overhang: de zwarte doos van 91 × 115 m tot NAP +28,0 m met een lage nok en vier installatiekasten met schuine kopse kanten, ledlamellen als groeven van 0,3 m om de 3 m, een glazen plint onder het ledveld (NAP +5,8 m) en aan de entreezijde twee bouwlagen glas tot NAP +10,8 m, drie rijen ramen in de laadgevel, de twee hoeken aan de entreezijde die boven het plein uitkragen met een schuine onderkant, en de luifel boven de laaddocks aan de zuidwestkant met twaalf laaddocks. De onderbouw tot het dek (NAP +2,1 m) verdwijnt aan drie zijden in het terrein. Vervangt de PDOK-reconstructie van BAG-pand 0363100012238052.",
      printFiles: [`ziggo-dome-1-${scale}.stl`],
      realWorld: {
        lengthM: +(modelBox.max[1] - modelBox.min[1]).toFixed(2),
        widthM: +(modelBox.max[0] - modelBox.min[0]).toFixed(2),
        boxM: [+(2 * HALF_U).toFixed(2), +(2 * HALF_V).toFixed(2)],
        eaveNapM: 28.0,
        ridgeNapM: 28.7,
        plantTopNapM: 30.85,
        deckNapM: 2.1,
        streetNapM: -3.0,
        cantileverBottomNapM: 10.8,
        ledFieldBottomNapM: 5.8,
        entranceGlazingTopNapM: 10.8,
        ledGroovePitchM: GROOVE.pitch,
        loadingDocks: DOCKS.count,
        canopyDepthM: +(-HALF_V - CANOPY.front).toFixed(2),
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Ziggo_Dome",
        "PDOK BAG en BGT pand 0363100012238052, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dakrand, dakhoogte en nok, installatiekasten (raster per 0,5 m), dek, luifel en straatniveau",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: 2020 Ziggodome.jpg, Ziggo Dome.JPG, Ziggodome Amsterdam - panoramio.jpg, ZiggoDome2012.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

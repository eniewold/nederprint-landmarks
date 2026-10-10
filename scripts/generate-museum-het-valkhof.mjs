// Genereert een vereenvoudigd, gesloten 3D-model van Museum Het Valkhof in
// Nijmegen (Ben van Berkel / UNStudio, 1999; verbouwd door UNStudio en in juni
// 2026 heropend): de langgerekte doos van 80 bij 38 tot 41 m aan het
// Kelfkensbos, op de flank naar het Valkhofpark. Een teruggezette, deels
// glazen begane grond draagt de doos met de gevel van blauwgroen glas met
// horizontale banden, die aan de pleinzijde 2,8 tot 5,2 m en aan de noordkop
// 2,6 tot 4,4 m uitkraagt. Aan de parkzijde staat een rij van 17 schuin
// geplaatste glazen erkers tussen witte vinnen (zaagtand in plattegrond), aan
// de pleinzijde de brede trap naar de ingang onder de uitkraging (een eigen
// node road:trap), en op het platte dak een installatieblok en twee dakputten
// aan de zuidkop. Alle maten in het script
// zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-museum-het-valkhof.mjs              # 1:1000 (standaard)
//   node scripts/generate-museum-het-valkhof.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (188364,75, 428777,5), het hart van het
// BAG-pand, op het maaiveld van het Kelfkensbos (NAP +33,93 m, het laagste
// PDOK-terreinpunt op de bemonsteringspunten), Z omhoog. +X loopt langs de
// achtergevel (de lange as) naar het zuidzuidwesten, naar de zuidkop (RD-
// richting 251,0 graden) en +Y loodrecht daarop naar het oostzuidoosten, het
// park in. De voorgevel aan het plein ligt dus aan de -Y-kant.
//
// Gemeten (bronnen): BAG-pand 0268100000045512 (contour van de begane grond:
// een rechthoek met twee terugsprongen aan de pleinzijde); AHN DSM/DTM 0,5 m
// (PDOK WCS) in het stelsel langs de achtergevel: het dak op NAP +45,7 m, de
// randen van de doos (achtergevel en zuidkop op de BAG-lijn, de voorgevel
// 3,2 graden gedraaid: v = -21,09 - 0,0562 u, resten 0,2 m, de noordkop
// haaks op de voorgevel), het installatieblok (NAP +47,0 m), de twee
// dakputten aan de zuidkop (NAP +44,3 m) en het maaiveld (plein NAP +33,9 tot
// +34,4 m; pad langs de achtergevel +35,4 tot +36,5 m en daarachter het talud
// naar het park op +41 m; aan de noordkop een verdiepte strook op +34,8 tot
// +35,7 m); PDOK luchtfoto (erkers langs de achtergevel, 17 stuks op 3,09 m,
// 1,8 m diep); Wikipedia.
// Geschat uit foto's op Wikimedia Commons: de onderkant van de uitkraging
// (NAP +38,0 m), de twee gevelbanden (NAP +40,8 en +43,3 m, 0,6 m hoog,
// 0,35 m diep), de trap voor de ingang (vier treden tot +1,0 m, 13 m breed,
// na de verbouwing gefotografeerd) en de vorm van de
// erkers (glas schuin van de buitenrand naar 1,8 m binnen, vin 0,9 m in
// plaats van de echte 0,3 m zodat hij printbaar is).
// Weggelaten: de schuine zuil van het Noviomagusmonument op het plein (geen
// deel van het museum, ±1 m dik), de borstwering van 0,2 tot 0,3 m op het dak,
// de zonnepanelen, de traptreden voor de ingang (samen 0,6 m, onder de
// uitkraging) behalve als trapblok, de gebogen plantenbak naast de trap
// (rand ±0,5 m), de letters op de gevel en de lamellen tussen de banden.
// De witte plintmuur met "museum het valkhof" van vóór de verbouwing bestaat
// niet meer (foto 2026) en zit er dus niet in.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "museum-het-valkhof");
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
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
const unit = ([x, y]) => {
  const n = Math.hypot(x, y);
  return [x / n, y / n];
};

const SLUG = "museum-het-valkhof";

// ---------- maten (lokaal stelsel, z = hoogte boven NAP +33,93 m) ----------
const GROUND_NAP = 33.93;
const nap = (h) => +(h - GROUND_NAP).toFixed(3);
const ORIGIN = [188364.75, 428777.5];
const X_AXIS = [-0.3257, -0.9454]; // RD-richting 251,0 graden, langs de achtergevel naar de zuidkop
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// De doos: achtergevel en zuidkop op de BAG-lijnen, de voorgevel 3,2 graden
// gedraaid (AHN-dakrand, kleinste kwadraten over 36 doorsneden) en de noordkop
// haaks op de voorgevel.
const BACK_V = 17.4;
const SOUTH_U = 37.1;
const FRONT = { c: -21.09, m: -0.0562 }; // v = c + m u
const NORTH = { c: -42.0, m: 0.0562 }; // u = c + m v
const frontV = (u) => FRONT.c + FRONT.m * u;
const northU = (v) => NORTH.c + NORTH.m * v;
const NW_U = (NORTH.c + NORTH.m * FRONT.c) / (1 - NORTH.m * FRONT.m);
const BOX_POLY = [
  [SOUTH_U, frontV(SOUTH_U)],
  [SOUTH_U, BACK_V],
  [northU(BACK_V), BACK_V],
  [NW_U, frontV(NW_U)],
];
const ROOF_Z = nap(45.7);
// Onderkant van de uitkraging (foto's: circa 4,1 m boven het plein).
const SOFFIT_Z = nap(38.0);

// BAG-contour van de begane grond (u, v), achtergevel en zuidkop gelijk aan de doos.
const GROUND_FLOOR = [
  [SOUTH_U, BACK_V],
  [-38.4, BACK_V],
  [-38.4, -13.85],
  [-22.0, -13.85],
  [-22.0, -16.35],
  [-6.5, -16.35],
  [-6.5, -17.96],
  [SOUTH_U, -17.96],
];

// Brede trap voor de ingang in het noordelijke deel van de voorgevel (foto
// na de verbouwing): vier treden van 0,15 m en 0,6 m diep tot de vloer van de
// begane grond (+1,0 m), van de teruggezette gevel tot 1,2 m voor de doos. Het
// PDOK-terrein ligt hier op +0,3 tot +0,6 m (het plein loopt naar de gevel op),
// dus de onderste trede (+0,55 m) blijft er overal boven en de lagere treden
// van de echte trap zitten in het terrein.
const STAIR = { u0: -35.0, u1: -22.02, face: -13.85, beyond: 1.2, steps: 4, rise: 0.15, tread: 0.6, top: 1.0 };

// Gevelbanden (blauwe stroken): 0,6 m hoog, 0,35 m diep, de bovenkant onder
// 47 graden zodat er geen overhang ontstaat.
const BANDS = [nap(40.8), nap(43.3)];
const BAND = { height: 0.6, depth: 0.35 };

// Erkers aan de parkzijde: 17 op 3,09 m, glas schuin van de buitenrand (na een
// vin van 0,9 m) naar 1,8 m binnen de gevel; vanaf de band boven de begane grond.
const BAYS = { count: 17, u0: -40.4, pitch: 3.09, fin: 0.9, depth: 1.8, z0: nap(38.6) };

// Dak: installatieblok en twee dakputten aan de zuidkop.
const PLANT = { u: [15.5, 24.0], v: [2.8, 4.8], top: nap(47.0) };
const ROOF_PITS = [
  { u: [34.4, 36.2], v: [-4.5, -0.5] },
  { u: [34.4, 36.2], v: [4.5, 8.5] },
];
const PIT_FLOOR = nap(44.3);

// Maaiveld: het plein voor de voorgevel en de straat bij de zuidkop
// (PDOK 77,66 tot 78,02 m ellipsoïdisch, NAP +33,9 tot +34,3 m).
const GROUND_SAMPLES = [[-30, -29], [0, -30], [30, -31], [45, -10]];
const GROUND_HEIGHT = 77.66;

// ---------- gebouw ----------
const groundFloor = prism(GROUND_FLOOR, BASE, SOFFIT_Z + 0.5);
const upperBox = prism(BOX_POLY, SOFFIT_Z, ROOF_Z);
const plant = box(PLANT.u[0], PLANT.u[1], PLANT.v[0], PLANT.v[1], ROOF_Z - 0.1, PLANT.top);

// Groef langs een gevellijn: punt p0 op de lijn, richting t, normaal n naar buiten.
function bandCutter(p0, t, n, s0, s1, z0) {
  const { height, depth } = BAND;
  const rise = depth * 1.08; // 47 graden
  const section = [
    [-depth, z0],
    [1, z0],
    [1, z0 + height + 1],
    [0, z0 + height],
    [-depth, z0 + height - rise],
  ];
  const pts = [];
  for (const s of [s0, s1]) {
    for (const [w, z] of section) pts.push([p0[0] + s * t[0] + w * n[0], p0[1] + s * t[1] + w * n[1], z]);
  }
  return Manifold.hull(pts);
}
const facades = [
  // voorgevel aan het plein
  { p0: [0, FRONT.c], t: unit([1, FRONT.m]), n: unit([FRONT.m, -1]), s: [-50, 45] },
  // zuidkop
  { p0: [SOUTH_U, 0], t: [0, 1], n: [1, 0], s: [-30, 25] },
  // noordkop
  { p0: [NORTH.c, 0], t: unit([NORTH.m, 1]), n: unit([-1, NORTH.m]), s: [-25, 25] },
];
const bandCuts = facades.flatMap(({ p0, t, n, s }) => BANDS.map((zc) => bandCutter(p0, t, n, s[0], s[1], zc - BAND.height / 2)));

const bayCuts = [];
for (let i = 0; i < BAYS.count; i++) {
  const ua = BAYS.u0 + i * BAYS.pitch;
  bayCuts.push(
    prism(
      [
        [ua + BAYS.fin, BACK_V],
        [ua + BAYS.pitch, BACK_V - BAYS.depth],
        [ua + BAYS.pitch, BACK_V + 1],
        [ua + BAYS.fin, BACK_V + 1],
      ],
      BAYS.z0,
      ROOF_Z + 1,
    ),
  );
}
const pitCuts = ROOF_PITS.map((p) => box(p.u[0], p.u[1], p.v[0], p.v[1], PIT_FLOOR, ROOF_Z + 1));

const museum = Manifold.union([groundFloor, upperBox, plant]).subtract(Manifold.union([...bandCuts, ...bayCuts, ...pitCuts]));
const stairOuter = (u) => frontV(u) - STAIR.beyond;
const stair = Manifold.union(
  Array.from({ length: STAIR.steps }, (_, k) =>
    prism(
      [
        [STAIR.u0, stairOuter(STAIR.u0) + k * STAIR.tread],
        [STAIR.u1, stairOuter(STAIR.u1) + k * STAIR.tread],
        [STAIR.u1, STAIR.face],
        [STAIR.u0, STAIR.face],
      ],
      BASE,
      STAIR.top - (STAIR.steps - 1 - k) * STAIR.rise,
    ),
  ),
);
const nodes = [
  ["building:museum", museum],
  ["road:trap", stair],
];
const all = Manifold.union([museum, stair]);
// De vlakke onderkant van de uitkraging is bedoeld: de export vult daaronder op.
const OVERHANG_OK = (z) => Math.abs(z - SOFFIT_Z) < 1e-3;

const META = {
  name: "Museum Het Valkhof",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0268100000045512"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (188364,75, 428777,5), het hart van het BAG-pand, op het maaiveld van het Kelfkensbos (NAP +33,93 m), +X langs de achtergevel naar de zuidkop (RD-richting 251,0 graden) en +Y loodrecht daarop naar het park; de voorgevel aan het plein ligt aan de -Y-kant. Eén node building:museum: de glazen doos (dak +11,8 m) die 2,8 tot 5,2 m uitkraagt boven de teruggezette begane grond op de BAG-contour, met twee gevelbanden, 17 schuine erkers aan de parkzijde, een installatieblok en twee dakputten; node road:trap: de brede trap naar de ingang (vier treden tot +1,0 m). Onderkant 0,5 m onder het maaiveld. Vervangt de PDOK-reconstructie van het pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    roofNapM: 45.7,
    roofM: ROOF_Z,
    soffitM: SOFFIT_Z,
    frontCantileverM: [+(-17.96 - frontV(-6.5)).toFixed(2), +(-17.96 - frontV(SOUTH_U)).toFixed(2)],
    northCantileverM: [+(-38.4 - northU(BACK_V)).toFixed(2), +(-38.4 - northU(-13.85)).toFixed(2)],
    bandsM: BANDS,
    bays: BAYS.count,
    bayPitchM: BAYS.pitch,
    plantM: PLANT.top,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Valkhof_Museum",
    "PDOK BAG pand 0268100000045512, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: dak, dakranden, installatieblok, dakputten en maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR): erkers langs de achtergevel",
    "Wikimedia Commons: foto's van de voorgevel, de achtergevel en de noordkop (opstand, uitkraging, banden, erkers)",
  ],
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

// Losse delen van het model (genus onder 0 betekent meer dan één stuk).
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
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
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

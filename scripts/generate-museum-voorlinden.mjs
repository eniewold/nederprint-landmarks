// Genereert een vereenvoudigd, gesloten 3D-model van Museum Voorlinden in Wassenaar
// (Kraaijvanger, Dirk Jan Postel, 2016): een lang, laag museum van natuursteen en glas
// onder een dun, ver overstekend plat dak (122,2 bij 54,7 m) op een colonnade van
// slanke witte kolommenparen. Het dak is een zonnedak van lamellen en buisjes 2 m
// boven het glazen dak van de zalen (bovenkant NAP +10,3 m); boven de grote zaal aan
// de noordoostkop ligt het 0,8 m hoger (NAP +11,1 m). In het dak aan de zuidoostkant
// zit de opening van de Skyspace van James Turrell, met de piramidevormige kap van
// die zaal erin. Het Mapbox-model is niet gebruikt. Alle maten in het script zijn
// meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, nodes met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-museum-voorlinden.mjs              # 1:1000 (standaard)
//   node scripts/generate-museum-voorlinden.mjs --scale 2000
//
// Assenstelsel: oorsprong op het hart van het BAG-pand (= de dakrand; RD 83800,53,
// 459510,86) op maaiveldniveau (NAP +1,95 m), Z omhoog. +X loopt langs de lange
// gevels naar het noordoosten (48,55 graden tegen de klok in vanaf de RD-X-as, de
// richting van de BAG-randen en van de hoofdliggers op de luchtfoto) en +Y
// loodrecht daarop naar het noordwesten, naar het landhuis en de toegangsweg.
//
// Bronnen: PDOK BAG-pand 0629100000021915 (het museum, bouwjaar 2016; de BAG-contour
// is de dakrand); AHN DSM/DTM 0,5 m (PDOK WCS): dak NAP +10,28 tot +10,31 m, de
// verhoogde kop NAP +11,07 tot +11,09 m (u 22,8 tot de kop, v -14,6 tot 14,4), de
// Skyspace-opening (u 30,5 tot 44, v -25,6 tot -18,2) met een dak op NAP +8,6 m en
// een piramidekap tot NAP +9,9 m, maaiveld NAP +1,9 tot +2,0 m; 3D BAG
// (b3_h_dak_50p 10,31 m, b3_h_maaiveld 1,87 m); PDOK luchtfoto (hoofdliggers van
// het zonnedak op v 13,4, 4,7, -4,1 en -12,9 m, raster van 2,4 m); building.co.uk
// (zonnedak 2 m boven het glazen dak, zes evenwijdige wanden); Wikipedia (één
// bovengrondse laag van 7 m); Wikimedia Commons-foto's van de hoeken en gevels.
// Geschat (foto's): de gevellijn van het gesloten volume (5,3 m terug van de lange
// dakranden, 4,8 m van de koppen), de wandhoogte (6,0 m), de plaats en breedte van
// de glazen vakken en de entree, de dikte van de dakrand (1,5 m, de minimale
// printbare plaat; in het echt een open roosterdak met liggers van circa 1 m) en de
// kolomafstand langs de lange zijden (12 gelijke vakken) en de lamellenvelden als
// vakken van 0,3 m diep op een steek van 4,8 m. Weggelaten: de lamellen en buisjes
// van het zonnedak zelf (12,5 cm), de kolommen als paren van circa 0,2 m
// (hier één pijler van 0,9 m per paar), het donkere installatieblok en de
// doorgang naar de tuin (plaats niet vast te stellen), het landhuis (eigen BAG-pand,
// het restaurant) en de koetshuizen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "museum-voorlinden");
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

const SLUG = "museum-voorlinden";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +1,95 m) ----------
const GROUND_NAP = 1.95;
const ORIGIN = [83800.53, 459510.86];
const X_AXIS = [0.661970, 0.749530]; // RD-richting 48,55 graden, langs de lange gevels
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// Het dak (zonnedak): de BAG-contour, een rechthoek van 122,2 bij 54,7 m.
const ROOF = { u: 61.08, v: 27.34, top: 10.3 - GROUND_NAP, thick: 1.5 };
const ROOF_BOTTOM = ROOF.top - ROOF.thick; // 6,85 m: onderkant van de dakrand
// Verhoogd dak boven de grote zaal aan de noordoostkop (AHN NAP +11,08 m).
const RAISED = { u: [22.8, ROOF.u], v: [-14.6, 14.4], top: 11.08 - GROUND_NAP };
// Gesloten volume onder het dak: zes evenwijdige wanden langs de lengteas (hart op de
// hoofdliggers v 13,4, 4,7, -4,1, -12,9 en de buitenwanden op v ±22), natuursteen tot
// WALL_TOP; daarboven het glazen dak en de holte tot het zonnedak, als kern die
// CORE_INSET terugligt.
const VOLUME = { u: 56.3, v: 22.0 };
const WALL_TOP = 6.0;
const CORE_INSET = 1.5;
const INNER_WALLS = [13.4, 4.7, -4.1, -12.9];
// Glazen vakken: 1,2 m terug achter de stenen wandvlakken, over de volle wandhoogte.
const GLASS_DEPTH = 1.2;
const GLASS_NW = [[-47, -39], [-35, -27], [-9, -1], [3, 11], [15, 23], [35, 43]];
const GLASS_SE = [[-47, -39], [-35, -27], [-23, -15], [-9, -1], [3, 11], [15, 23]];
// Kopgevels: glas tussen de wandkoppen (stenen penanten van 1,5 m op de wanden).
const PIER = 1.5;
const GLASS_SW = [[-19, -12.9 - PIER / 2], [-12.9 + PIER / 2, -4.1 - PIER / 2], [-4.1 + PIER / 2, 4.7 - PIER / 2]];
const GLASS_NE = [[4.7 + PIER / 2, 13.4 - PIER / 2], [13.4 + PIER / 2, 19]];
// Entree aan de noordwestzijde, waar het pad vanaf het landhuis aankomt: een glazen
// pui met draaideuren diep tussen twee stenen wanden.
const ENTRANCE = { u: [-24, -12], depth: 4 };
// Kolommen: per paar slanke witte kolommen één pijler van 0,9 m, 0,8 m binnen de
// dakrand. Langs de lange zijden 13 posities (12 gelijke vakken), langs de koppen op
// de hoeken en onder de hoofdliggers.
const COLUMN = { size: 0.9, inset: 0.8, longBays: 12 };
// Skyspace (James Turrell): opening in het zonnedak met daarin de zaal, een vlak dak op
// NAP +8,6 m en een afgeknotte piramide tot NAP +9,9 m met het oculus.
const SKY_OPENING = { u: [30.5, 44.0], v: [-25.6, -18.2] };
const SKY_ROOM = { u: [30.9, 43.6], v: [-25.2, -18.6], top: 8.6 - GROUND_NAP };
const SKY_PYRAMID = { u: [30.9, 36.9], v: [-25.0, -19.5], top: 9.9 - GROUND_NAP, topSize: 2.6, oculus: 1.2, oculusDepth: 0.4 };
// Lamellenvelden op het dak: dakrand 1,0 m, ribben 0,9 m, steek 4,8 m, 0,3 m diep.
const LAMELLA = { edge: 1.0, rib: 0.9, pitch: 4.8, depth: 0.3 };
// Terras van natuursteen onder het overstek, 0,15 m boven het gras.
const TERRACE_TOP = 0.15;
// Maaiveld (AHN NAP +1,9 tot +2,0 m) op het gras rondom, 9 m buiten de dakrand.
const GROUND_SAMPLES = [[-70, 0], [0, 36], [70, 0], [20, -36]];

// ---------- gebouw ----------
// Dakplaat met verhoogde kop en de Skyspace-opening.
const roof = Manifold.union([
  box(-ROOF.u, ROOF.u, -ROOF.v, ROOF.v, ROOF_BOTTOM, ROOF.top),
  box(RAISED.u[0], RAISED.u[1], RAISED.v[0], RAISED.v[1], ROOF_BOTTOM, RAISED.top),
]).subtract(Manifold.union([
  box(SKY_OPENING.u[0], SKY_OPENING.u[1], SKY_OPENING.v[0], SKY_OPENING.v[1], ROOF_BOTTOM - 1, RAISED.top + 1),
  ...lamellaFields(),
]));

// Lamellenvelden van het zonnedak als ondiepe vakken (LAMELLA.depth) tussen een witte
// dakrand, de vier hoofdliggers langs de lengteas en dwarsribben op een steek van 4,8 m
// (twee keer het raster van 2,4 m op de luchtfoto). In het echt liggen de toppen van
// de lamellen en de liggers in één vlak (AHN binnen 3 cm); het reliëf is schematisch,
// zoals een vensternis voor glas.
function lamellaFields() {
  const { edge, rib, pitch, depth } = LAMELLA;
  const half = rib / 2;
  const raisedU = RAISED.u[0];
  // [v0, v1, u0, u1, top]
  const bays = [
    [INNER_WALLS[0] + half, ROOF.v - edge, -ROOF.u + edge, raisedU, ROOF.top],
    [RAISED.v[1] + rib, ROOF.v - edge, raisedU, ROOF.u - edge, ROOF.top],
    [-ROOF.v + edge, INNER_WALLS[3] - half, -ROOF.u + edge, raisedU, ROOF.top],
    [-ROOF.v + edge, RAISED.v[0] - rib, raisedU, ROOF.u - edge, ROOF.top],
    [INNER_WALLS[1] + half, INNER_WALLS[0] - half, -ROOF.u + edge, raisedU - rib, ROOF.top],
    [INNER_WALLS[2] + half, INNER_WALLS[1] - half, -ROOF.u + edge, raisedU - rib, ROOF.top],
    [INNER_WALLS[3] + half, INNER_WALLS[2] - half, -ROOF.u + edge, raisedU - rib, ROOF.top],
    [RAISED.v[0] + rib, INNER_WALLS[2] - half, raisedU + rib, ROOF.u - edge, RAISED.top],
    [INNER_WALLS[2] + half, INNER_WALLS[1] - half, raisedU + rib, ROOF.u - edge, RAISED.top],
    [INNER_WALLS[1] + half, RAISED.v[1] - rib, raisedU + rib, ROOF.u - edge, RAISED.top],
  ];
  const sky = [SKY_OPENING.u[0] - rib, SKY_OPENING.u[1] + rib, SKY_OPENING.v[0] - rib, SKY_OPENING.v[1] + rib];
  const out = [];
  for (const [v0, v1, bu0, bu1, top] of bays) {
    for (let a = -ROOF.u + edge; a < ROOF.u - edge; a += pitch) {
      const u0 = Math.max(a, bu0);
      const u1 = Math.min(a + pitch - rib, bu1);
      if (u1 - u0 < 1) continue;
      if (u1 > sky[0] && u0 < sky[1] && v1 > sky[2] && v0 < sky[3]) continue;
      out.push(box(u0, u1, v0, v1, top - depth, top + 1));
    }
  }
  return out;
}

// Gesloten volume: wanden tot WALL_TOP, kern tot onder het dak.
const cuts = [];
for (const [u0, u1] of GLASS_NW) cuts.push(box(u0, u1, VOLUME.v - GLASS_DEPTH, VOLUME.v + 1, BASE - 1, WALL_TOP + 0.01));
for (const [u0, u1] of GLASS_SE) cuts.push(box(u0, u1, -VOLUME.v - 1, -VOLUME.v + GLASS_DEPTH, BASE - 1, WALL_TOP + 0.01));
for (const [v0, v1] of GLASS_SW) cuts.push(box(-VOLUME.u - 1, -VOLUME.u + GLASS_DEPTH, v0, v1, BASE - 1, WALL_TOP + 0.01));
for (const [v0, v1] of GLASS_NE) cuts.push(box(VOLUME.u - GLASS_DEPTH, VOLUME.u + 1, v0, v1, BASE - 1, WALL_TOP + 0.01));
cuts.push(box(ENTRANCE.u[0], ENTRANCE.u[1], VOLUME.v - ENTRANCE.depth, VOLUME.v + 1, BASE - 1, WALL_TOP + 0.01));
const walls = box(-VOLUME.u, VOLUME.u, -VOLUME.v, VOLUME.v, BASE, WALL_TOP).subtract(Manifold.union(cuts));
const core = box(-VOLUME.u + CORE_INSET, VOLUME.u - CORE_INSET, -VOLUME.v + CORE_INSET, VOLUME.v - CORE_INSET, WALL_TOP - 0.5, ROOF_BOTTOM + 0.3)
  .subtract(box(SKY_OPENING.u[0], SKY_OPENING.u[1], SKY_OPENING.v[0], SKY_OPENING.v[1], SKY_ROOM.top - 0.01, ROOF.top));

// Skyspace-zaal met piramidekap en oculus (blinde nis).
const skyRoom = box(SKY_ROOM.u[0], SKY_ROOM.u[1], SKY_ROOM.v[0], SKY_ROOM.v[1], BASE, SKY_ROOM.top);
const pc = [(SKY_PYRAMID.u[0] + SKY_PYRAMID.u[1]) / 2, (SKY_PYRAMID.v[0] + SKY_PYRAMID.v[1]) / 2];
const h = SKY_PYRAMID.topSize / 2;
const pyramid = Manifold.hull([
  ...[SKY_PYRAMID.u[0], SKY_PYRAMID.u[1]].flatMap((u) => [SKY_PYRAMID.v[0], SKY_PYRAMID.v[1]].map((v) => [u, v, SKY_ROOM.top - 0.3])),
  ...[pc[0] - h, pc[0] + h].flatMap((u) => [pc[1] - h, pc[1] + h].map((v) => [u, v, SKY_PYRAMID.top])),
]);
const o = SKY_PYRAMID.oculus / 2;
const skyspace = Manifold.union([skyRoom, pyramid]).subtract(
  box(pc[0] - o, pc[0] + o, pc[1] - o, pc[1] + o, SKY_PYRAMID.top - SKY_PYRAMID.oculusDepth, SKY_PYRAMID.top + 1),
);

// Kolommen.
const columns = [];
const cu = ROOF.u - COLUMN.inset;
const cv = ROOF.v - COLUMN.inset;
const pillar = (u, v) => box(u - COLUMN.size / 2, u + COLUMN.size / 2, v - COLUMN.size / 2, v + COLUMN.size / 2, BASE, ROOF_BOTTOM + 0.3);
for (let k = 0; k <= COLUMN.longBays; k++) {
  const u = -cu + (2 * cu * k) / COLUMN.longBays;
  columns.push(pillar(u, cv), pillar(u, -cv));
}
for (const v of INNER_WALLS) columns.push(pillar(-cu, v), pillar(cu, v));

const museum = Manifold.union([roof, walls, core, skyspace, ...columns]);

// Terras onder het overstek (zonder het volume en de kolommen).
const terrace = box(-ROOF.u, ROOF.u, -ROOF.v, ROOF.v, BASE, TERRACE_TOP).subtract(museum);

const nodes = [
  ["building:museum", museum],
  ["road:terras", terrace],
];
const all = Manifold.union([museum, terrace]);

// Het plafond van het overstek, de onderkant van de kern en de rand van de
// Skyspace-opening hangen echt vrij boven het terras; de kolommen dragen het dak en
// de export vult de rest op.
const OVERHANG_OK = (z) => z >= WALL_TOP - 0.51;

const META = {
  name: "Museum Voorlinden",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 45.41, // ellipsoïdisch: laagste PDOK-terreinhoogte op de GROUND_SAMPLES (45,41 tot 45,57 m)
  replacesBuildings: ["0629100000021915"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (83800,53, 459510,86), het hart van het BAG-pand (de dakrand), op het maaiveld (NAP +1,95 m), +X langs de lange gevels naar het noordoosten (48,55 graden vanaf de RD-X-as) en +Y naar het noordwesten. Node building:museum: het platte zonnedak van 122,2 bij 54,7 m (bovenkant +8,35 m, dakrand 1,5 m dik, boven de grote zaal aan de noordoostkop +9,13 m) op 34 kolompijlers van 0,9 m (in het echt paren slanke kolommen), het gesloten volume van natuursteen en glas 5,3 m terug van de lange dakranden (wanden tot +6,0 m, glazen vakken 1,2 m terug, entree 4 m diep aan de noordwestzijde) en de Skyspace van Turrell in een opening in het dak (piramidekap tot +7,95 m). Node road:terras: het stenen terras onder het overstek (+0,15 m). Onderkant op 0,5 m onder het maaiveld. Vervangt de PDOK-reconstructie van het pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    roofM: [122.2, 54.7],
    roofTopM: +ROOF.top.toFixed(2),
    roofEdgeThicknessM: ROOF.thick,
    raisedRoofM: +RAISED.top.toFixed(2),
    volumeM: [2 * VOLUME.u, 2 * VOLUME.v],
    wallTopM: WALL_TOP,
    columns: columns.length,
    skyspaceTopM: +SKY_PYRAMID.top.toFixed(2),
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Museum_Voorlinden",
    "https://building.co.uk/buildings/voorlinden-museum-a-light-touch/5084715.article",
    "PDOK BAG pand 0629100000021915, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: het dak, de verhoogde kop, de Skyspace en het maaiveld",
    "3D BAG NL.IMBAG.Pand.0629100000021915 (dak- en maaiveldhoogte)",
    "PDOK luchtfoto (Actueel_orthoHR): dakrand, hoofdliggers en Skyspace-opening",
    "Wikimedia Commons, Category:Museum Voorlinden (foto's van de hoeken en gevels)",
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
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
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

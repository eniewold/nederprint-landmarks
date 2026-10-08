// Genereert een vereenvoudigd, gesloten 3D-model van het Abe Lenstra Stadion
// in Heerenveen (thuisstadion van sc Heerenveen): de rechthoekige kom met vier
// tribunes en vier hoeken rond de veldopening, de hoge hoofdtribune aan de
// noordoostkant met haar raamstroken, de lagere zuidwesttribune, de twee
// kopse tribunes met een zadeldak, de vier lichtmasten op de hoeken en de
// aangebouwde hallen aan de zuidoostkant. Alle vlakken zijn gefit op het AHN
// (planen en dwarsprofielen per tribune, geen hoogteveld); het Mapbox-model is
// niet gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, Ã©Ã©n node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal> en een met grondplaat.
//
//   node scripts/generate-abe-lenstra-stadion.mjs              # 1:1000 (standaard)
//   node scripts/generate-abe-lenstra-stadion.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening op maaiveldniveau
// (NAP +0,1 m), Z omhoog. +X loopt langs de lengteas van het veld naar het
// zuidoosten (RD-richting (0,5920, -0,8059), -53,7 graden), +Y dwars daarop
// naar het noordoosten, naar de hoofdtribune.
//
// Bronnen: PDOK BAG-panden 0074100000349206, 0074100000355314,
// 0074100000342112 en 0074100000335067 (de stadionpanden en de aangebouwde
// hallen; contouren en vervangen panden); AHN DSM/DTM 0,5 m (PDOK WCS): de veldopening (u -58 tot
// 58,5 m, v -40 tot 41 m), het dwarsprofiel van de noordoost- en de
// zuidwesttribune (per blok van 20 m binnen 1,1 en 1,8 m van elkaar), het zadeldak van de kopse tribunes, de vlakke daken van de
// hoeken (+20,0 en +18,5 m), de hallen en de lichtmasten (top tot +32 tot
// +39 m); Wikipedia (26.800 plaatsen, veld 105 Ã— 68 m); PDOK luchtfoto en
// Wikimedia Commons-foto's. Geschat: de raamstroken in de gevels (hoogtes en
// diepte uit foto's), de doorsnede van de lichtmasten (2 Ã— 2 m, in het echt
// een open vakwerk) en hun voet (de masten staan in het echt iets flauwer);
// de dakspanten boven de hoofdtribune en de zuilengang eronder zijn
// weggelaten (dunner dan 0,9 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "abe-lenstra-stadion");
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
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Convexe veelhoek in plan met een dakvlak z = a x + b y + c, vanaf z0 omhoog.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([
    ...pts.map(([x, y]) => [x, y, z0]),
    ...pts.map(([x, y]) => [x, y, a * x + b * y + c]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);

const SLUG = "abe-lenstra-stadion";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +0,1 m) ----------
const GROUND_NAP = 0.11;
const ORIGIN = [191883.55, 552546.0];
const X_AXIS = [0.592013, -0.805928]; // RD-richting -53,7 graden, langs het veld
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// Veldopening (AHN): u -58 tot 58,5 m en v -40 tot 41 m.
// Buitenomtrek van het stadion (AHN-DSM, afgerond op 0,5 m): afgeschuinde
// hoeken, de zuidoostzijde loopt door in de hallen.
const OUTLINE = [
  [-60, 82.5], [-72, 71], [-89, 57], [-94.5, 44], [-96, 37.5], [-96, -41.5], [-90.5, -46],
  [-88, -57], [-84.5, -61], [-77.5, -67], [-64, -71], [-58.5, -72], [59, -72], [64, -71],
  [77.5, -67], [84.5, -61], [88, -57], [90.5, -46], [96, -41.5], [96, 37.5], [94.5, 44],
  [89, 57], [72, 71], [60, 82.5],
];
// Noordoosttribune (hoofdtribune), dwarsprofiel [v, z] langs u -57,4 tot 58 m:
// verticale gevel aan het veld tot +12,3 m, schuine voorkant naar de dakrand
// op +24,8 m, het dak dat over 25 m tot +22,3 m afloopt en dan vlak blijft, en
// de achtergevel op v = 83 m.
const NE = { u0: -57.4, u1: 58, back: 83 };
const NE_PROFILE = [[41, BASE], [41, 12.3], [44, 17.0], [45, 24.8], [70, 22.3], [83, 22.15], [83, BASE]];
// Zuidwesttribune, dwarsprofiel [v, z] langs u -57,5 tot 58,3 m: dak dat naar het
// veld stijgt van +18,4 m op v -71 tot +20,5 m aan het veld.
const SW = { u0: -57.5, u1: 58.3, back: -72 };
const SW_PROFILE = [[-72, BASE], [-72, 18.3], [-62, 18.7], [-58, 18.95], [-41, 20.5], [-41, BASE]];
// Westtribune (kop), profiel [u, z] langs v: zadeldak met de nok op u -76 m
// (+26,4 m), schuin aflopend naar de veldkant (+12,7 m op u -61 m). Voor v
// -41 tot -12 m loopt het dak door tot de buitenrand op u -95,5 m, daarna
// eindigt het op u -90 m en ligt daarbuiten een lagere aanbouw (+14 m).
const WEST_RIDGE = [[-88, 24.4], [-85, 25.3], [-82, 25.9], [-79, 26.3], [-76, 26.4], [-70, 26.2], [-67, 25.7], [-65, 24.8], [-64, 21.6], [-61, 12.7], [-58, 0], [-58, BASE]];
const WEST_LONG = [[-95.5, BASE], [-95.5, 20.5], [-94, 21.9], [-91, 23.3], ...WEST_RIDGE];
const WEST_SHORT = [[-90, BASE], [-90, 23.7], ...WEST_RIDGE];
const WEST = { v0: -41, vSplit: -12, v1: 37.6, annexTop: 14 };
// Osttribune (kop): zadeldak met de nok op u 78 m (+26,35 m), verticale
// veldgevel op u 58 m.
const EAST_PROFILE = [[58, BASE], [58, 22.0], [61, 23.9], [67, 25.5], [72, 26.2], [78, 26.35], [84, 25.55], [90, 23.85], [96.5, 21.0], [96.5, BASE]];
const EAST = { v0: -41, v1: 37.6 };
// Hoeken: vlak dak op +20,0 m (noord) en +18,5 m (zuid), afgesneden op de omtrek,
// 2 cm in de tribunes overlappend zodat de delen één geheel vormen.
const CORNERS = [
  { name: "noordwest", u: [-96, -57.38], v: [37.58, 83], z: 20.0 },
  { name: "noordoost", u: [57.98, 96], v: [37.58, 83], z: 20.0 },
  { name: "zuidwest", u: [-96, -57.48], v: [-72, -40.98], z: 18.5 },
  { name: "zuidoost", u: [58.28, 96], v: [-72, -40.98], z: 18.5 },
];
// Lichtmasten op de vier hoeken: vakwerk als staaf van 2 Ã— 2 m, de top bij de
// binnenhoek van de kom (AHN: +31,8, +38,7, +32,9 en +36,0 m), de voet op het
// hoekdak langs de diagonaal naar buiten, nooit flauwer dan 50 graden.
const MASTS = [
  { top: [-62.5, 43], z: 31.8, out: [-1, 1], roof: 20.0 },
  { top: [62.5, 43], z: 38.7, out: [1, 1], roof: 20.0 },
  { top: [-62.5, -43], z: 32.9, out: [-1, -1], roof: 18.5 },
  { top: [62.5, -43], z: 36.0, out: [1, -1], roof: 18.5 },
];
const MAST_WIDTH = 2.0;
// Hallen aan de zuidoostkant (AHN): hal A met een licht gewelfd dak, een
// lage verbinding, en de grote hal B met een boogvormig dak.
const HALL_A = { u0: 96, u1: 134, v0: -40.5, v1: 40.5, profile: [[96, BASE], [96, 16.5], [98, 16.5], [102, 15.6], [106, 14.9], [110, 14.4], [114, 14.2], [120, 14.3], [126, 14.9], [132, 16.0], [134, 16.0], [134, BASE]] };
const LINK = { u0: 134, u1: 142, v0: -40.5, v1: 40.5, z: 10.7 };
const HALL_B = { u0: 142, u1: 199, v0: -64.5, v1: 58, profile: [[142, BASE], [142, 11.5], [150, 14.3], [160, 16.5], [170, 17.4], [180, 16.9], [190, 15.0], [199, 12.0], [199, BASE]] };
// Lage bouwdelen langs de hallen, binnen het BAG-pand van de hallen (AHN): een
// aanbouw ten noorden van hal A (+7 m), een lage strook ten zuiden ervan (+4,7
// m), de entreehal in de zuidwesttribune (+14,1 m) en de oostrand van hal B.
const LOW_BLOCKS = [
  { z: 7.0, ring: [[114.7, 40.4], [119.6, 44.5], [126.6, 47.5], [130.3, 48.1], [142.0, 48.1], [142.0, 40.4]] },
  { z: 4.7, ring: [[132.3, -51.3], [132.1, -56.8], [109.4, -49.7], [109.4, -52.2], [105.9, -52.3], [105.8, -48.6], [98.8, -46.4], [98.7, -44.9], [93.8, -43.3], [96.5, -40.4], [142.0, -40.4], [142.0, -51.3]] },
  { z: 14.1, ring: [[-13.7, -71.9], [13.6, -71.9], [13.6, -77.6], [-13.7, -77.6]] },
  { z: 11.9, ring: [[198.9, -13.6], [201.2, -13.6], [201.2, 15.1], [198.9, 15.1]] },
];
// Raamstroken als blinde nissen van 0,35 m diep met een vlakke bovenkant.
const GROOVE_DEPTH = 0.35;
const BANDS_NE = [[5.4, 7.8], [8.6, 11.0], [11.8, 14.2]];
const BANDS_SW = [[8.0, 10.4], [12.0, 14.4]];
const BANDS_END = [[8.0, 11.0]];
// Maaiveld (AHN NAP 0,0 tot +0,2 m) rond het stadion.
const GROUND_SAMPLES = [[0, -85], [-70, -85], [100, -50], [-110, 60]];

// ---------- gebouwen ----------
const hull = prism(OUTLINE, BASE, 60);
const tribunes = [
  profileX(NE_PROFILE, NE.u0, NE.u1),
  profileX(SW_PROFILE, SW.u0, SW.u1),
  profileY(WEST_LONG, WEST.v0, WEST.vSplit),
  profileY(WEST_SHORT, WEST.vSplit - 0.01, WEST.v1),
  box(-96, -89.9, WEST.vSplit - 0.01, WEST.v1, BASE, WEST.annexTop),
  profileY(EAST_PROFILE, EAST.v0, EAST.v1),
];
const corners = CORNERS.map((c) =>
  Manifold.intersection(hull, box(c.u[0], c.u[1], c.v[0], c.v[1], BASE, c.z)),
);
const mast = ({ top, z, out, roof }) => {
  // De voet ligt op het hoekdak langs de diagonaal, op hoogstens 0,84 van de hoogte.
  const rise = z - roof;
  const run = Math.min(13, 0.84 * rise);
  const d = out.map((c) => (c * Math.SQRT1_2));
  const foot = [top[0] + d[0] * run, top[1] + d[1] * run];
  const w = MAST_WIDTH / 2;
  const ring = ([x, y], h) => [[x - w, y - w, h], [x + w, y - w, h], [x + w, y + w, h], [x - w, y + w, h]];
  return Manifold.hull([...ring(foot, roof - 0.5), ...ring(top, z - 0.01)]);
};
const masts = MASTS.map(mast);
const hallA = profileY(HALL_A.profile, HALL_A.v0, HALL_A.v1);
const link = box(LINK.u0 - 0.01, LINK.u1 + 0.01, LINK.v0, LINK.v1, BASE, LINK.z);
const hallB = profileY(HALL_B.profile, HALL_B.v0, HALL_B.v1);

// Raamstroken in de buitengevels.
const grooveTops = new Set();
const groove = (x0, x1, y0, y1, [z0, z1]) => {
  grooveTops.add(z1.toFixed(2));
  return box(x0, x1, y0, y1, z0, z1);
};
const grooves = [
  ...BANDS_NE.map((b) => groove(-52, 52, NE.back - GROOVE_DEPTH, NE.back + 1, b)),
  // Niet door de entreehal in het midden van de zuidwestgevel.
  ...BANDS_SW.flatMap((b) => [[-52, -14.5], [14.5, 52]].map(([u0, u1]) => groove(u0, u1, SW.back - 1, SW.back + GROOVE_DEPTH, b))),
  // Aan de kopse zijde van de westtribune (alleen waar het dak tot de rand loopt;
  // de oostkant is dicht tegen hal A gebouwd).
  ...BANDS_END.map((b) => groove(-95.5 - 1, -95.5 + GROOVE_DEPTH, -36, WEST.vSplit - 2, b)),
];
const OVERHANG_OK = (z) => grooveTops.has(z.toFixed(2));

const lowBlocks = LOW_BLOCKS.map(({ ring, z }) => prism(ring, BASE, z));
const bowl = Manifold.union([...tribunes, ...corners, ...masts, hallA, link, hallB, ...lowBlocks]).subtract(Manifold.union(grooves));
const nodes = [["building:stadion", bowl]];
const all = bowl;

const META = {
  name: "Abe Lenstra Stadion",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0074100000349206", "0074100000355314", "0074100000342112", "0074100000335067"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (191883,55, 552546,00) in het hart van de veldopening op het maaiveld (NAP +0,1 m), +X langs het veld naar het zuidoosten (-53,7 graden) en +Y naar de hoofdtribune in het noordoosten. EÃ©n node building:stadion: de hoofdtribune (dwarsprofiel met een dak van +24,8 naar +22,2 m en drie raamstroken), de zuidwesttribune (+18,4 tot +20,5 m), de kopse tribunes met een zadeldak tot +26,4 m, de vier hoeken met een vlak dak (+20,0 en +18,5 m), vier lichtmasten als schuine staven tot +32 tot +39 m en de aangebouwde hallen aan de zuidoostkant (+14 tot +17,4 m) met lage aanbouwen. Onderkant op -0,5 m onder het maaiveld; alleen de bovenkant van de raamstroken is vlak. Vervangt de PDOK-reconstructie van de vier panden van het stadion en de hallen. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 26800,
    fieldOpeningM: [116.5, 81],
    noordoostRoofM: [24.8, 22.15],
    zuidwestRoofM: [18.3, 20.5],
    cornerRoofM: [20.0, 18.5],
    mastTopM: MASTS.map((m) => m.z),
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Abe_Lenstra_Stadion",
    "PDOK BAG panden 0074100000349206, 0074100000355314, 0074100000342112 en 0074100000335067, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: de daken per tribune, de hoeken, de lichtmasten en de hallen",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's",
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

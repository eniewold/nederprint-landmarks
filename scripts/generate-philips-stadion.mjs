// Genereert een vereenvoudigd, gesloten 3D-model van het Philips Stadion in
// Eindhoven (thuisstadion van PSV): de rechthoekige kom met vier gesloten
// tribunes onder één doorlopend dak, de veldopening met de afgeschuinde
// dakrand, de vier hoeken als lage koepels met een schuine rand, de
// vakwerkspanten op het dak van de noordoosttribune en de lagere bouwdelen aan
// de buitenkant. Alle vormen zijn glad en gefit op het AHN; het
// Mapbox-landmarkmodel is niet gebruikt. Alle maten in het script zijn meters
// op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-philips-stadion.mjs              # 1:1000 (standaard)
//   node scripts/generate-philips-stadion.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van het veld (midden van de BAG-veldopening)
// op straatniveau (NAP +17,6 m), Z omhoog. +X loopt langs de lengteas van het
// veld naar het zuidoosten (RD-richting (0,8, -0,6), -36,87 graden), +Y dwars
// daarop naar het noordoosten, naar de tribune met de spanten langs het spoor.
//
// Bronnen: BAG-pand 0772100000950002 (contour van stadion en veldopening, as en
// hart, lagere bouwdelen); AHN DSM/DTM 0,5 m (PDOK WCS): veldopening in het dak
// (afgeronde rechthoek, rand 3,5 m afgeschuind), de dakvlakken van de vier
// tribunes (vlak of zadeldak, afwijking enkele centimeters), de hoeken als
// omwentelingsvlak rond de hoek van de veldopening (parabool, rms 0,1 m) met de
// schuine dakrand, de spanten, de lagere bouwdelen en het straatniveau;
// Wikipedia (veld 105 × 68 m, 35.000 plaatsen); PDOK
// luchtfoto. Geschat: de breedte van de spanten (1,2 m, vakwerk massief
// gemaakt) en het verloop van de schuine dakranden (gemengde AHN-waarden).
// De uiteinden van de spanten die buiten de noordoostgevel in de lucht hangen,
// zijn weggelaten: in de export zouden ze tot de grond worden opgevuld.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "philips-stadion");
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

// ---------- maten (z = NAP - 17,6 m) ----------
const ORIGIN = [160577.885, 383628.23];
const X_AXIS = [0.8, -0.6]; // RD-richting -36,87 graden, langs het veld
const NAP = (h) => h - 17.6;
// Alle onderdelen beginnen op dezelfde onderkant, 1 m onder straatniveau.
const BASE = NAP(16.6);

// BAG-contour van pand 0772100000950002 (buitenrand, vereenvoudigd op 0,3 m) in RD.
const BAG_RD = [
  [160465.60, 383659.02], [160475.49, 383651.65], [160472.23, 383647.30], [160476.01, 383621.13],
  [160469.48, 383620.18], [160470.02, 383616.46], [160476.55, 383617.44], [160477.00, 383614.39],
  [160484.17, 383609.04], [160482.89, 383607.32], [160483.21, 383605.19], [160484.79, 383604.00],
  [160482.52, 383601.00], [160506.86, 383582.86], [160505.94, 383581.62], [160510.92, 383577.88],
  [160510.09, 383576.73], [160510.30, 383575.32], [160516.49, 383570.66], [160517.75, 383572.33],
  [160531.94, 383561.69], [160528.52, 383557.10], [160563.70, 383530.80], [160568.28, 383536.97],
  [160579.18, 383528.81], [160581.47, 383531.81], [160582.99, 383530.70], [160585.33, 383531.05],
  [160593.01, 383525.34], [160627.54, 383530.37], [160636.71, 383542.66], [160641.90, 383538.89],
  [160673.20, 383580.88], [160675.72, 383579.05], [160682.19, 383587.76], [160679.77, 383589.64],
  [160685.27, 383596.97], [160678.04, 383602.52], [160682.70, 383608.78], [160678.02, 383641.00],
  [160664.77, 383650.66], [160665.19, 383653.29], [160663.88, 383655.28], [160661.61, 383655.96],
  [160659.21, 383654.81], [160636.73, 383671.60], [160637.15, 383674.23], [160635.84, 383676.22],
  [160633.26, 383676.88], [160631.16, 383675.75], [160628.32, 383677.88], [160629.61, 383679.68],
  [160618.33, 383688.15], [160612.91, 383692.20], [160611.57, 383690.43], [160608.70, 383692.58],
  [160609.14, 383695.21], [160607.84, 383697.21], [160605.55, 383697.90], [160603.15, 383696.73],
  [160580.67, 383713.52], [160581.15, 383715.85], [160579.79, 383718.15], [160577.20, 383718.80],
  [160575.10, 383717.68], [160562.01, 383727.64], [160529.89, 383722.98], [160520.81, 383710.80],
  [160513.47, 383716.27], [160478.99, 383670.10], [160475.69, 383672.56],
];
const BAG = BAG_RD.map(([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [dx * X_AXIS[0] + dy * X_AXIS[1], -dx * X_AXIS[1] + dy * X_AXIS[0]];
});

// Veldopening in het dak (AHN): afgeronde rechthoek van u -62,5 tot 63,75 m en
// |v| ≤ 36,6 m met hoeken van 5 m. De dakrand loopt over 3,5 m schuin af tot
// 4,5 m onder het dakvlak.
const OPEN = { u0: -62.5, u1: 63.75, halfV: 36.6, r: 5 };
const FASCIA = { drop: 4.5, width: 3.5 };
// Grenzen tussen tribunes en hoeken (AHN: sprong in de dakhoogte).
const JOIN = { uWest: -58.7, uEast: 60.3, v: 32.8 };
// Noordoosttribune (+Y): dak van NAP +46,37 + 0,0145 v (vrijwel vlak, +47,0 m
// aan de veldkant, +47,5 m aan de achterkant), dakrand van v 76,5 tot 78,5 m
// aflopend tot +39 m.
const NE = { z0: 46.37, slope: 0.0145, eave: 76.5, edge: 78.5, edgeZ: 39 };
const zNE = (v) => NE.z0 + NE.slope * v;
// Zuidwesttribune (-Y): dak stijgend van +47,26 m op |v| 40 m met 0,1 m per
// meter tot +50,35 m, vanaf |v| 75 m een schuine rand van 45 graden tot 80,5 m.
const SW = { z40: 47.26, slope: 0.1, top: 50.35, eave: 75, edge: 80.5 };
const zSW = (a) => Math.min(SW.top, SW.z40 + SW.slope * (a - 40));
// Korte tribunes: zadeldak met de nok op |u| 79,2 m op +44,95 m, 0,083 m per
// meter aflopend, met een schuine dakrand: aan de noordwestkant van |u| 91 tot
// 93,5 m aflopend tot +36 m, aan de zuidoostkant van 90,5 tot 94,5 m tot +39 m.
const SHORT = { ridge: 79.2, ridgeZ: 44.95, slope: 0.083 };
const SHORT_EDGE = { west: { eave: 91, edge: 93.5, edgeZ: 36 }, east: { eave: 90.5, edge: 94.5, edgeZ: 39 } };
const zShort = (a) => SHORT.ridgeZ - SHORT.slope * Math.abs(a - SHORT.ridge);
// Hoeken: omwentelingsvlak rond (±58,6, ±31,6) m, parabool met de top van
// +51,12 m op 32,5 m straal (AHN, rms 0,1 m); aan de veldkant van 9 tot 5 m
// straal schuin af tot +42 m. De schuine dakrand zakt over 1,5 m tot +41 m en
// loopt dan flauw af tot +37 m; hij hangt af van de hoek theta vanaf de
// lengteas: van 40 tot 46 m straal tot theta 55 graden (naar de korte
// tribunes), en van 43,5 tot 47,5 m straal vanaf 70 tot 75 graden (naar de
// lange tribunes).
const CORNER = { cu: 58.6, cv: 31.6, peakR: 32.5, peakZ: 51.12, k: 0.0096, inner: 5, innerZ: 42, kneeW: 1.5, kneeZ: 41, edgeZ: 37 };
const zCorner = (r) => CORNER.peakZ - CORNER.k * (r - CORNER.peakR) ** 2;
const ramp = (deg, d0, d1, a, b) => a + (b - a) * Math.min(1, Math.max(0, (deg - d0) / (d1 - d0)));
const cornerEave = (deg) => ramp(deg, 55, 70, 40, 43.5);
const cornerEdge = (deg) => ramp(deg, 60, 75, 46, 47.5);
// Lagere bouwdelen buiten de tribunes (AHN-hoogte, randen uit BAG en AHN).
const ANNEXES = [
  { u0: -104.6, u1: -SHORT_EDGE.west.edge + 0.1, v0: -JOIN.v, v1: JOIN.v, top: 30.7 }, // noordwest
  { u0: SHORT_EDGE.east.edge - 0.1, u1: 104.8, v0: -JOIN.v, v1: JOIN.v, top: 30.7 }, // zuidoost
  { u0: 96.2, u1: 104.8, v0: -25, v1: 17, top: 34.6 }, // zuidoost, hoger deel
  { u0: 3.19, u1: 47.11, v0: -86.5, v1: -SW.edge + 0.1, top: 36.9 }, // zuidwest
  { u0: -23.33, u1: -14.57, v0: -82.89, v1: -SW.edge + 0.1, top: 40.2 }, // zuidwest, klein
];
// BAG-contour tot NAP +22,1 m voor de lage uitbouwen aan de noordwest- en
// zuidoostkant die buiten de lagere bouwdelen vallen.
const PLINTH_TOP = 22.1;
// Vakwerkspanten op de noordoosttribune: zestien stuks om de 7 m (u -52,5 tot
// 52,5 m), 1,2 m breed, van v 40 tot 76,5 m, top van +47,76 m oplopend met
// 0,068 m per meter tot +50,25 m.
const TRUSS = { first: -52.5, pitch: 7, count: 16, width: 1.2, v0: 40, v1: NE.eave, z42: 47.9, slope: 0.068, bottom: 46 };
const zTruss = (v) => TRUSS.z42 + TRUSS.slope * (v - 42);

// ---------- dak en tribunes ----------
const neStand = profileX(
  [
    [OPEN.halfV, BASE],
    [NE.edge, BASE],
    [NE.edge, NAP(NE.edgeZ)],
    [NE.eave, NAP(zNE(NE.eave))],
    [OPEN.halfV + FASCIA.width, NAP(zNE(OPEN.halfV + FASCIA.width))],
    [OPEN.halfV, NAP(zNE(OPEN.halfV) - FASCIA.drop)],
  ],
  JOIN.uWest,
  JOIN.uEast,
);
// Knik waar de helling van de zuidwesttribune zijn hoogste punt bereikt.
const swKnee = 40 + (SW.top - SW.z40) / SW.slope;
const swStand = profileX(
  [
    [-SW.edge, BASE],
    [-OPEN.halfV, BASE],
    [-OPEN.halfV, NAP(zSW(OPEN.halfV) - FASCIA.drop)],
    [-(OPEN.halfV + FASCIA.width), NAP(zSW(OPEN.halfV + FASCIA.width))],
    [-swKnee, NAP(SW.top)],
    [-SW.eave, NAP(SW.top)],
    [-SW.edge, NAP(SW.top - (SW.edge - SW.eave))],
  ],
  JOIN.uWest,
  JOIN.uEast,
);
// Korte tribunes: profiel in (u, z) voor de oostkant; de westkant gespiegeld met
// zijn eigen veldrand.
const shortProfile = (edge, { eave, edge: outer, edgeZ }) => [
  [edge, BASE],
  [outer, BASE],
  [outer, NAP(edgeZ)],
  [eave, NAP(zShort(eave))],
  [SHORT.ridge, NAP(SHORT.ridgeZ)],
  [edge + FASCIA.width, NAP(zShort(edge + FASCIA.width))],
  [edge, NAP(zShort(edge) - FASCIA.drop)],
];
const seStand = profileY(shortProfile(OPEN.u1, SHORT_EDGE.east), -JOIN.v - 0.05, JOIN.v + 0.05);
const nwStand = profileY(shortProfile(-OPEN.u0, SHORT_EDGE.west), -JOIN.v - 0.05, JOIN.v + 0.05).mirror([1, 0, 0]);

// Hoeken: een ring van 2 tot 50 m straal (rechthoekig profiel met punten om de
// 1 m op het bovenvlak) die per hoek theta radiaal wordt uitgerekt tot de
// dakrand en waarvan de bovenkant op de dakhoogte wordt gezet. Daarna per hoek
// gespiegeld en afgesneden op het kwadrant buiten de grenzen met de tribunes.
const RING = { r0: 2, r1: 50, step: 1 };
const ringProfile = [
  [RING.r0, 0],
  [RING.r1, 0],
];
for (let r = RING.r1; r >= RING.r0 - 1e-9; r -= RING.step) ringProfile.push([r, 1]);
const cornerTop = (r, deg) => {
  const eave = cornerEave(deg);
  const edge = cornerEdge(deg);
  // Schuine rand: eerst 1,5 m steil omlaag tot +41 m, dan flauw tot de rand.
  const knee = eave + CORNER.kneeW;
  if (r >= knee) return CORNER.kneeZ + ((CORNER.edgeZ - CORNER.kneeZ) * (r - knee)) / (edge - knee);
  if (r >= eave) return zCorner(eave) + ((CORNER.kneeZ - zCorner(eave)) * (r - eave)) / CORNER.kneeW;
  if (r >= 9) return zCorner(r);
  return CORNER.innerZ + ((zCorner(9) - CORNER.innerZ) * (r - CORNER.inner)) / (9 - CORNER.inner);
};
const dome = Manifold.revolve([ccw(ringProfile)], 160).warp((p) => {
  const phi = Math.atan2(p[1], p[0]);
  const deg = Math.min(90, Math.max(0, (phi * 180) / Math.PI));
  const rho = Math.hypot(p[0], p[1]);
  // Ring van 2 tot 50 m naar 2 m tot de dakrand.
  const r = RING.r0 + ((rho - RING.r0) * (cornerEdge(deg) - RING.r0)) / (RING.r1 - RING.r0);
  const top = p[2] > 0.5;
  p[0] = r * Math.cos(phi);
  p[1] = r * Math.sin(phi);
  p[2] = top ? NAP(cornerTop(r, deg)) : BASE;
});
const corners = [];
for (const su of [-1, 1]) {
  for (const sv of [-1, 1]) {
    const uJoin = su < 0 ? JOIN.uWest : JOIN.uEast;
    const [u0, u1] = su < 0 ? [-120, uJoin + 0.05] : [uJoin - 0.05, 120];
    const [v0, v1] = sv < 0 ? [-120, -JOIN.v] : [JOIN.v, 120];
    let corner = dome.translate([CORNER.cu, CORNER.cv, 0]);
    if (su < 0) corner = corner.mirror([1, 0, 0]);
    if (sv < 0) corner = corner.mirror([0, 1, 0]);
    corners.push(corner.intersect(box(u0, u1, v0, v1, BASE - 1, NAP(80))));
  }
}

// ---------- spanten en lagere bouwdelen ----------
const trusses = [];
for (let k = 0; k < TRUSS.count; k++) {
  const u = TRUSS.first + k * TRUSS.pitch;
  trusses.push(
    profileX(
      [
        [TRUSS.v0, NAP(TRUSS.bottom)],
        [TRUSS.v1, NAP(TRUSS.bottom)],
        [TRUSS.v1, NAP(zTruss(TRUSS.v1))],
        [TRUSS.v0, NAP(zTruss(TRUSS.v0))],
      ],
      u - TRUSS.width / 2,
      u + TRUSS.width / 2,
    ),
  );
}
const annexes = ANNEXES.map(({ u0, u1, v0, v1, top }) => box(u0, u1, v0, v1, BASE, NAP(top)));
// Alleen de delen buiten de lagere bouwdelen; binnen het dak zou het
// bovenvlak langs de veldopening dunne, naar beneden gerichte splinters geven.
const plinth = prism([BAG], BASE, NAP(PLINTH_TOP)).intersect(
  Manifold.union([box(-120, -104.5, -60, 60, BASE - 1, NAP(40)), box(104.7, 120, -60, 60, BASE - 1, NAP(40))]),
);

// Veldopening als afgeronde rechthoek, verticaal door alles heen.
const opening = Manifold.extrude(
  new CrossSection([
    ccw([
      [OPEN.u0, -OPEN.halfV],
      [OPEN.u1, -OPEN.halfV],
      [OPEN.u1, OPEN.halfV],
      [OPEN.u0, OPEN.halfV],
    ]),
  ])
    .offset(-OPEN.r, "Miter")
    .offset(OPEN.r, "Round"),
  200,
).translate([0, 0, BASE - 50]);

const stadium = Manifold.union([plinth, neStand, swStand, seStand, nwStand, ...corners, ...trusses, ...annexes]).subtract(opening);
const nodes = [["building:stadion", stadium]];
const printModel = stadium;

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
const glbFile = path.join(outDir, "philips-stadion.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-philips-stadion.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (NAP +16,6 m) op het printbed.
const stlFile = path.join(outDir, `philips-stadion-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Philips Stadion 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts.
await writeFile(
  path.join(outDir, "philips-stadion.json"),
  JSON.stringify(
    {
      name: "Philips Stadion",
      file: "philips-stadion.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Straten en pleinen vlak langs de vier gevels (NAP +17,5 tot +17,9 m).
      groundSamplePoints: [
        [0, 84],
        [-35, -86],
        [-110, 0],
        [110, -5],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0772100000950002"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van het veld op straatniveau (NAP +17,6 m) in de oorsprong, +X langs de lengteas van het veld naar het zuidoosten (RD-richting -36,87 graden) en +Y dwars daarop naar het noordoosten. Het stadion is opgebouwd uit gladde vormen die op het AHN zijn gefit: het doorlopende dak over de vier tribunes met de veldopening en de afgeschuinde dakrand, de zadeldaken van de korte tribunes, de vier hoeken als lage koepels met een schuine rand, de zestien spanten op de noordoosttribune en de lagere bouwdelen aan de buitenkant. Vervangt de PDOK-reconstructie van BAG-pand 0772100000950002.",
      printFiles: [`philips-stadion-1-${scale}.stl`],
      realWorld: {
        pitchM: [105, 68],
        roofOpeningM: [+(OPEN.u1 - OPEN.u0).toFixed(2), OPEN.halfV * 2],
        footprintM: [0, 1].map((i) => +(stadium.boundingBox().max[i] - stadium.boundingBox().min[i]).toFixed(1)),
        cornerTopNapM: CORNER.peakZ,
        northEastRoofNapM: [+zNE(40).toFixed(2), +zNE(NE.eave).toFixed(2)],
        southWestRoofNapM: [SW.z40, SW.top],
        shortStandRidgeNapM: SHORT.ridgeZ,
        trussTopNapM: +zTruss(TRUSS.v1).toFixed(2),
        trusses: TRUSS.count,
        streetNapM: 17.6,
        capacity: 35000,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Philips_Stadion",
        "PDOK BAG pand 0772100000950002, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: veldopening, dakvlakken, hoeken, dakranden, spanten, lagere bouwdelen en straatniveau",
        "PDOK luchtfoto (Actueel_orthoHR): dakrand langs het veld, spanten en hoeken",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

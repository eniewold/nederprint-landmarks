// Genereert een gesloten 3D-model van Het Spoorwegmuseum in Utrecht uit
// dakvlakken: de grote museumhal (de voormalige werkplaats van 182 m lang) als
// een flauw zadeldak van twee vlakken (5 graden, nok op v = 1,5 m) met de
// lichtstraat langs de nok, drie plat afgedekte opbouwen en twee dakdozen, en
// het station Maliebaan uit 1874: twee lange vleugels met zadeldaken en
// topgevels, het hogere entreegebouw als schilddak met een lange nok dwars op de
// vleugels, twee lagere zijdelen met zadeldaken tegen de voorgevel en de luifel
// boven de ingang. De vlakken zijn z = a u + b v + c, gefit op het
// AHN-DSM (0,25 en 0,5 m) en op de BAG-contouren afgesneden. Het Mapbox-model
// is niet gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-spoorwegmuseum.mjs              # 1:1000 (standaard)
//   node scripts/generate-spoorwegmuseum.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (137483,05, 455450,11), het gezamenlijke
// zwaartepunt van de twee BAG-panden, op maaiveldniveau (NAP +2,9 m), Z omhoog.
// +X loopt langs de lange as van de hal naar het noordnoordoosten (67 graden
// tegen de klok in vanaf de RD-X-as) en +Y loodrecht daarop naar het
// westnoordwesten. Het station ligt ten noordoosten van de hal, aan de overkant
// van de sporen.
//
// Bronnen: PDOK BAG-panden 0344100000128112 (de hal) en 0344100000028153 (station
// Maliebaan); AHN DSM/DTM 0,25 en 0,5 m (PDOK WCS): de dakvlakken, nok- en
// goothoogtes en het maaiveld (NAP +2,7 tot +3,0 m); Wikipedia; PDOK luchtfoto.
// Weggelaten: de dakramen en dakkapellen van nog geen 0,5 m, de zonnepanelen,
// het perrondak achter het station (geen BAG-pand), de spoorlijnen met de
// rijtuigen en locomotieven buiten de gebouwen en alle gevelreliëf.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "spoorwegmuseum");
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
// Houdt van het lichaam alleen wat onder het vlak z = a x + b y + c ligt.
const below = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Zadeldak met de nok evenwijdig aan X op v = ridgeV: twee vlakken met helling pitch
// (m per m), tot de gevels op ridgeV +- halfV; gevels aan de koppen verticaal (topgevels).
const gableX = (u0, u1, ridgeV, halfV, ridgeZ, pitch) =>
  below(
    below(box(u0, u1, ridgeV - halfV, ridgeV + halfV, BASE, ridgeZ + 1), [0, -pitch, ridgeZ + pitch * ridgeV]),
    [0, pitch, ridgeZ - pitch * ridgeV],
  );
// Zelfde met de nok evenwijdig aan Y op u = ridgeU.
const gableY = (v0, v1, ridgeU, halfU, ridgeZ, pitch) =>
  below(
    below(box(ridgeU - halfU, ridgeU + halfU, v0, v1, BASE, ridgeZ + 1), [-pitch, 0, ridgeZ + pitch * ridgeU]),
    [pitch, 0, ridgeZ - pitch * ridgeU],
  );
// Schilddak op een rechthoek met vier vlakken van gelijke helling vanaf de goot op eaveZ.
const hipRoof = (u0, u1, v0, v1, eaveZ, pitch) => {
  const rise = (pitch * Math.min(u1 - u0, v1 - v0)) / 2;
  return [
    [pitch, 0, eaveZ - pitch * u0],
    [-pitch, 0, eaveZ + pitch * u1],
    [0, pitch, eaveZ - pitch * v0],
    [0, -pitch, eaveZ + pitch * v1],
  ].reduce((solid, plane) => below(solid, plane), box(u0, u1, v0, v1, BASE, eaveZ + rise + 1));
};

const SLUG = "spoorwegmuseum";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP 2,9 m) ----------
const GROUND_NAP = 2.9;
const ORIGIN = [137483.05, 455450.11];
const X_AXIS = [0.390731, 0.920505]; // RD-richting 67,0 graden, langs de lange as van de hal
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// BAG-contouren (u, v), op 0,3 m vereenvoudigd: de hal en station Maliebaan.
const HALL_FOOTPRINT = [[89.9,28.5],[89.9,15.0],[41.1,-30.3],[26.7,-30.3],[12.2,-43.7],[-4.4,-43.7],[-4.4,-56.1],[-17.0,-56.1],[-26.3,-64.7],[-64.4,-49.4],[-81.7,-33.2],[-84.6,1.8],[-82.7,23.5],[-69.2,25.0],[-21.2,28.7]];
const STATION_FOOTPRINT = [[91.0,70.2],[121.6,70.3],[121.6,56.7],[36.3,56.9],[36.3,70.4],[66.9,70.2],[66.8,77.7],[91.0,77.7]];
const FOOTPRINTS = [HALL_FOOTPRINT, STATION_FOOTPRINT];

// ---------- de museumhal ----------
// Hoofddak: twee vlakken z = a u + b v + c (hoogte boven het maaiveld), gefit op het DSM
// (restant 0,04 m rms op 23000 cellen): de noordhelft daalt naar de goot op v = 28 (+7,9 m),
// de zuidhelft naar de zuidwestgevel (+7,6 m op v = -30, +5,0 m op v = -60). Nok op v = 1,5 m,
// +10,25 m, helling 0,088 (5 graden).
const HALL_ROOF_NORTH = [-0.0005, -0.0886, 10.384];
const HALL_ROOF_SOUTH = [-0.0005, 0.0881, 10.118];
// Lichtstraat langs de nok: zadeldakje van 5 m breed met de nok op +11,5 m (helling 0,6),
// van u = -79,0 tot +65,6 met verticale koppen.
const LANTERN = { u0: -79.0, u1: 65.6, ridgeV: 1.5, halfV: 2.5, eaveZ: 10.0, ridgeZ: 11.5 };
// Plat afgedekte opbouwen boven het hoofddak [u0, u1, v0, v1, z]: de noordwestelijke en de
// westelijke opbouw op +10,07 m, de twee dakdozen op de westelijke op +11,6 m, de zuidelijke
// opbouw op +10,10 m en de lage verbinding daartussen op +9,0 m.
const HALL_BLOCKS = [
  [-69.4, -20.7, 3.5, 23.1, 10.07],
  [-79.0, -32.0, -26.4, -1.0, 10.07],
  [-40.5, -33.0, -13.0, -4.0, 11.6],
  [-40.5, -33.0, -25.5, -16.4, 11.6],
  [-46.3, -4.4, -56.1, -29.4, 10.1],
  [-39.3, -36.0, -29.8, -26.2, 9.0],
];

// ---------- station Maliebaan ----------
// Symmetrie-as van het entreegebouw: u = 78,95 m. Alle hoogtes boven het maaiveld.
const STATION_AXIS = 78.95;
// Twee vleugels met zadeldak: nok op v = 63,6 m, +8,82 m, goten op +6,78 m, helling 0,30
// (17 graden), topgevels aan de buitenkanten. De binnenkanten verdwijnen in het entreegebouw.
const WING = { ridgeV: 63.6, halfV: 6.8, ridgeZ: 8.82, pitch: 0.3 };
const WING_LEFT = [36.3, 73.0];
const WING_RIGHT = [84.9, 121.7];
// Entreegebouw: schilddak van vier vlakken met helling 0,40 (22 graden) vanaf de goot op
// +13,25 m; de nok ligt dwars op de vleugels op u = 78,95 m, +16,05 m, van v = 63,8 tot 70,7.
const HALL_HIP = { u0: 71.95, u1: 85.95, v0: 56.8, v1: 77.7, eaveZ: 13.25, pitch: 0.4 };
// Twee lagere zijdelen aan de voorzijde (v = 70,1 tot 77,7) met zadeldak, nok langs v,
// op u = 70,0 en 87,9 m, +14,74 m, helling 0,43 (23 graden), topgevels op v = 77,7.
const BAY = { v0: 70.1, v1: 77.7, halfU: 3.15, ridgeZ: 14.74, pitch: 0.43 };
const BAY_RIDGES = [70.0, 87.9];
// Luifel boven de ingang: plaat van 11,5 bij 5,4 m met de bovenkant op +6,2 m (AHN), 1,5 m
// dik, uitkragend vanuit de gevel (de plaat steekt 4,8 m voor de gevel uit). De onderkant is
// vlak en dus een uitkraging (OVERHANG_OK); de export vult hem op (0,08 % extra volume).
const CANOPY = { u0: 73.2, u1: 84.7, v0: 77.4, v1: 82.8, z0: 4.7, z1: 6.2 };

// Maaiveld (AHN NAP +2,7 tot +3,0 m) rond het gebouw.
const GROUND_SAMPLES = [[-70, 40], [-40, 45], [40, -45], [-90, -45]];

// ---------- gebouw ----------
const hallParts = [
  below(below(prism(HALL_FOOTPRINT, BASE, 14), HALL_ROOF_NORTH), HALL_ROOF_SOUTH),
  profileX(
    [
      [LANTERN.ridgeV - LANTERN.halfV, LANTERN.eaveZ - 0.6],
      [LANTERN.ridgeV - LANTERN.halfV, LANTERN.eaveZ],
      [LANTERN.ridgeV, LANTERN.ridgeZ],
      [LANTERN.ridgeV + LANTERN.halfV, LANTERN.eaveZ],
      [LANTERN.ridgeV + LANTERN.halfV, LANTERN.eaveZ - 0.6],
    ],
    LANTERN.u0,
    LANTERN.u1,
  ),
  ...HALL_BLOCKS.map(([u0, u1, v0, v1, z]) => box(u0, u1, v0, v1, BASE, z)),
];
const stationParts = [
  gableX(WING_LEFT[0], WING_LEFT[1], WING.ridgeV, WING.halfV, WING.ridgeZ, WING.pitch),
  gableX(WING_RIGHT[0], WING_RIGHT[1], WING.ridgeV, WING.halfV, WING.ridgeZ, WING.pitch),
  hipRoof(HALL_HIP.u0, HALL_HIP.u1, HALL_HIP.v0, HALL_HIP.v1, HALL_HIP.eaveZ, HALL_HIP.pitch),
  ...BAY_RIDGES.map((ridgeU) => gableY(BAY.v0, BAY.v1, ridgeU, BAY.halfU, BAY.ridgeZ, BAY.pitch)),
];
const body = Manifold.intersection([
  Manifold.union([...hallParts, ...stationParts]),
  Manifold.union(FOOTPRINTS.map((ring) => prism(ring, BASE - 1, 60))),
]);
// De luifel steekt buiten de BAG-contour uit en komt na het afsnijden bij het gebouw.
const canopy = box(CANOPY.u0, CANOPY.u1, CANOPY.v0, CANOPY.v1, CANOPY.z0, CANOPY.z1);
const complex = Manifold.union([body, canopy]);
const nodes = [["building:spoorwegmuseum", complex]];
const all = complex;
// Alleen de onderkant van de luifel hangt vlakker dan 45 graden.
const OVERHANG_OK = (z, p) =>
  Math.abs(z - CANOPY.z0) < 1e-3 &&
  p.every(([x, y]) => x > CANOPY.u0 - 1e-3 && x < CANOPY.u1 + 1e-3 && y > CANOPY.v0 - 1e-3 && y < CANOPY.v1 + 1e-3);

const META = {
  name: "Het Spoorwegmuseum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0344100000128112", "0344100000028153"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (137483,05, 455450,11), het gezamenlijke zwaartepunt van de twee BAG-panden, op het maaiveld (NAP +2,9 m), +X langs de lange as van de hal naar het noordnoordoosten (67 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het westnoordwesten. Eén node building:spoorwegmuseum uit dakvlakken: de grote museumhal (182 bij 50 tot 100 m) als flauw zadeldak van twee vlakken met de lichtstraat langs de nok, drie plat afgedekte opbouwen (+10,1 m) en twee dakdozen (+11,6 m), en station Maliebaan met twee vleugels met zadeldak en topgevels (nok +8,8 m), het entreegebouw als schilddak (nok +16,05 m) met twee lagere zijdelen met zadeldak (nok +14,7 m) en de uitkragende luifel boven de ingang (+4,7 tot +6,2 m), afgesneden op de BAG-contouren. Onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal, behalve de onderkant van de luifel. Vervangt de PDOK-reconstructie van beide panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {"hallM": [182, 100], "hallRoofM": [5.0, 11.6], "stationM": [86, 26], "stationRoofM": [6.8, 16.05], "groundNapM": 2.9, "baseM": -0.5},
  sources: [
      "https://nl.wikipedia.org/wiki/Spoorwegmuseum_%28Utrecht%29",
      "PDOK BAG panden 0344100000128112 en 0344100000028153, EPSG:28992",
      "PDOK AHN DSM/DTM 0,25 en 0,5 m via WCS: de dakvlakken, nok- en goothoogtes en het maaiveld",
      "PDOK luchtfoto (Actueel_orthoHR)"
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

// Losse delen van het model (genus onder 0 betekent meer dan ��n stuk).
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

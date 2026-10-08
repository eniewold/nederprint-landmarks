// Genereert een vereenvoudigd, gesloten 3D-model van molen De Valk in Leiden:
// de ronde stenen stellingmolen uit 1743 op het Valkenburger bolwerk aan de
// Lammermarkt, met de taps toelopende romp, de achtkante stelling als dichte
// plaat op een kraag van 50 graden (de echte stelling is een open houten
// omloop op schoren), de rietgedekte kap, de staart naar de stelling, het
// wiekenkruis als dikke plaat in X-stand en de aanbouw met zadeldak aan de
// noordwestkant. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire
// STL in millimeters op 1:<schaal> met een printsteun onder de onderste
// wiekpunten.
//
//   node scripts/generate-molen-de-valk.mjs              # 1:1000 (standaard)
//   node scripts/generate-molen-de-valk.mjs --scale 250
//
// Printbaar op 1:1000 zonder steun: de romp loopt taps toe, de kraag onder de
// stelling en de onderrand van de kap lopen onder 50 graden, de staart onder
// circa 68 graden, de schuine wieken hangen onder 50 graden; alleen de punten
// van de onderste wieken hangen vrij (de export vult daar een paaltje op, de
// STL heeft een eigen printsteun).
//
// Assenstelsel: oorsprong op RD (93369,48, 464418,24), het hart van de romp
// (het middelpunt van de BAG-cirkel), op het maaiveld van het bolwerk (NAP
// +3,3 m), Z omhoog, +X naar het oosten en +Y naar het noorden (de assen van
// RD). De wieken staan aan de oostkant, zoals op de PDOK-luchtfoto.
//
// Bronnen: BAG-pand 0546100000044130 (de romp als cirkel van 6,36 m straal en
// de aanbouw); AHN DSM/DTM 0,5 m (PDOK WCS) voor de kaphoogte (NAP +32,2 m),
// de stelling (NAP +16,4 m, tot circa 8,5 m van het hart), de aanbouw en het
// maaiveld op het bolwerk; Wikipedia (ronde stenen stellingmolen, vlucht
// 27,0 m, stellinghoogte 14,6 m); PDOK luchtfoto (stand van kap en wieken);
// foto's op Wikimedia Commons voor romp, stelling, kap en aanbouw.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "molen-de-valk");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const hull = (points) => Manifold.hull(points);
const deg = Math.PI / 180;
const ring = (n, r, rot = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot * deg + (2 * Math.PI * i) / n;
    return [r * Math.cos(a), r * Math.sin(a)];
  });
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const frustum = (bottom, z0, top, z1) => hull([...at(bottom, z0), ...at(top, z1)]);
const box = (u0, u1, v0, v1, z0, z1) => {
  const pts = [];
  for (const u of [u0, u1]) for (const v of [v0, v1]) for (const z of [z0, z1]) pts.push([u, v, z]);
  return pts;
};
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);

// ---------- maten (z boven het maaiveld van het bolwerk, NAP +3,3 m) ----------
const ORIGIN = [93369.48, 464418.24];
const GROUND_NAP = 3.3;
const z = (nap) => nap - GROUND_NAP;
const BASE = -1.0; // de molen loopt 1 m onder het maaiveld door
// Romp: cirkel van de BAG (straal 6,36 m) aan de voet, taps tot de kap.
const ROMP = { rBase: 6.36, rTop: 3.8, top: z(27.5) };
const rAt = (h) => ROMP.rBase + ((ROMP.rTop - ROMP.rBase) * h) / ROMP.top;
// Stelling: achtkante plaat van 0,6 m dik met de bovenkant op NAP +16,4 m en
// een apothema van 8,5 m, op een kraag van 50 graden vanaf de romp.
const STELLING = { z: z(16.4), apothem: 8.5, plaat: 0.6, kraag: 50 };
// Kap tot NAP +32,2 m, as op NAP +29,8 m, wieken aan de oostkant.
const KAP = { top: z(32.2) };
const AS = { z: z(29.8), richting: 0 };
// Wiekenkruis: vlucht 27,0 m, platen van 2,4 m breed en 1,0 m dik in X-stand
// onder 50 graden, het midden van de plaat 5,2 m voor het hart van de romp.
const WIEK = { vlucht: 27.0, breedte: 2.4, dikte: 1.0, hoek: 50, vlak: 5.2 };
// Staart: balk van 0,9 m van de achterkant van de kap naar de stelling.
const STAART = 0.9;
// Aanbouw (BAG, lokaal): woning met een zadeldak langs de lange as, goot
// NAP +6,0 m, nok +9,0 m.
const BAG_RD = [
  [93371.05, 464424.69], [93368.94, 464432.31], [93361.72, 464429.96], [93363.0, 464426.28], [93364.43, 464422.15],
];
const ANNEX = { outline: BAG_RD.map(([x, y]) => [x - ORIGIN[0], y - ORIGIN[1]]), eave: z(6.0), ridge: z(9.0) };
// Maaiveld op het bolwerk rondom (AHN NAP +3,2 tot +3,4 m), niet op de lagere
// voet van het bolwerk.
const GROUND_SAMPLES = [[10, 0], [0, -10], [-10, -3], [8, 7]];

// ---------- opbouw (lokaal: u langs de as naar de wieken, v linksom) ----------
const N = 48;
const tanKraag = Math.tan(STELLING.kraag * deg);
const oct = (a) => ring(8, a / Math.cos(22.5 * deg), 22.5);
const zPlaat = STELLING.z - STELLING.plaat;
// Kraag: van de romp onder 50 graden naar de onderkant van de plaat.
const kraagTop = zPlaat;
let zKraag = kraagTop - (STELLING.apothem - rAt(kraagTop)) * tanKraag;
for (let i = 0; i < 4; i++) zKraag = kraagTop - (STELLING.apothem - rAt(zKraag)) * tanKraag;
const parts = [
  frustum(ring(N, ROMP.rBase), BASE, ring(N, ROMP.rBase), 0),
  frustum(ring(N, ROMP.rBase), 0, ring(N, ROMP.rTop), ROMP.top),
  frustum(ring(N, rAt(zKraag)), zKraag, oct(STELLING.apothem + 0.01 / tanKraag), zPlaat + 0.01),
  frustum(oct(STELLING.apothem), zPlaat, oct(STELLING.apothem), STELLING.z),
];

// Kap: van de bovenkant van de romp met een steile onderrand naar een
// langwerpige onderkant en dan als gebogen rieten kap naar de nok.
{
  const z0 = ROMP.top;
  const z1 = z0 + 0.9;
  const zn = KAP.top;
  const w = ROMP.rTop + 0.15;
  const k = ROMP.rTop + 0.4;
  const stadium = [];
  for (let i = 0; i <= 8; i++) {
    const a = -90 + (180 * i) / 8;
    stadium.push([k - w + w * Math.cos(a * deg), w * Math.sin(a * deg)]);
    stadium.push([-k + w - w * Math.cos(a * deg), w * Math.sin(a * deg)]);
  }
  const mid = stadium.map(([u, v]) => [u * 0.92, v * 0.78]);
  const nok = k - 1.6;
  parts.push(
    hull([...at(ring(N, ROMP.rTop), z0), ...at(stadium, z1), ...at(mid, z0 + 0.55 * (zn - z0)), ...box(-nok, nok, -0.4, 0.4, zn - 0.01, zn)]),
  );
}

// Wiekenkruis in X-stand.
const R = WIEK.vlucht / 2;
const u0 = WIEK.vlak - WIEK.dikte / 2;
const u1 = WIEK.vlak + WIEK.dikte / 2;
const tips = [];
{
  const half = WIEK.breedte / 2;
  const arms = [];
  for (const a of [WIEK.hoek, 180 - WIEK.hoek, 180 + WIEK.hoek, 360 - WIEK.hoek]) {
    const d = [Math.cos(a * deg), Math.sin(a * deg)];
    const n = [-d[1], d[0]];
    const corners = [
      [-half * n[0], -half * n[1]],
      [half * n[0], half * n[1]],
      [R * d[0] + half * n[0], R * d[1] + half * n[1]],
      [R * d[0] - half * n[0], R * d[1] - half * n[1]],
    ].map(([v, h]) => [v, h + AS.z]);
    arms.push(hull(corners.flatMap(([v, h]) => [[u0, v, h], [u1, v, h]])));
    if (d[1] < 0) tips.push({ corners: corners.slice(2), d });
  }
  parts.push(union(arms));
  // As: van binnen de kap naar de wiekenplaat, met een schuine onderkant
  // (51 graden).
  const uIn = ROMP.rTop - 1.2;
  const h = 0.7;
  const drop = h + 1.25 * (u0 + 0.3 - uIn - 0.1);
  parts.push(hull([...box(uIn, uIn + 0.1, -h, h, AS.z - drop, AS.z + h), ...box(u0 + 0.3 - 0.6, u0 + 0.3, -h, h, AS.z - h, AS.z + h)]));
}
// Staart van de achterkant van de kap naar de rand van de stelling.
{
  const h = STAART / 2;
  const uTop = -(ROMP.rTop + 0.4) + 0.8;
  const zTop = ROMP.top + 0.6;
  const uFoot = -(STELLING.apothem - 0.6);
  parts.push(hull([...box(uTop - h, uTop + h, -h, h, zTop - h, zTop + h), ...box(uFoot - h, uFoot + h, -h, h, STELLING.z - 0.3, STELLING.z + STAART)]));
}
const mill = union(parts).rotate([0, 0, AS.richting]);

// Aanbouw: zadeldak met de nok langs de lange as (van de romp naar het
// noordnoordwesten), tot in de romp.
let annex;
{
  const pts = ANNEX.outline;
  // Lange as: van het midden van de zijde tegen de romp naar het midden van
  // de buitenzijde.
  const inner = [(pts[0][0] + pts[4][0]) / 2, (pts[0][1] + pts[4][1]) / 2];
  const outer = [(pts[1][0] + pts[2][0]) / 2, (pts[1][1] + pts[2][1]) / 2];
  const d = [outer[0] - inner[0], outer[1] - inner[1]];
  const len = Math.hypot(...d);
  const dir = [d[0] / len, d[1] / len];
  const back = [inner[0] - dir[0] * 3, inner[1] - dir[1] * 3];
  const wedge = hull([
    ...at(pts, BASE),
    ...at(pts, ANNEX.eave),
    [outer[0], outer[1], ANNEX.ridge],
    [back[0], back[1], ANNEX.ridge],
  ]);
  annex = Manifold.intersection(wedge, prism(pts, BASE - 1, 30));
}
const model = union([mill, annex]);
const nodes = [["building:molen", model]];
// Printsteun onder de punten van de onderste wieken (alleen in de STL).
const steun = union(
  tips.map(({ corners, d }) => {
    const pts = corners.flatMap(([v, h]) => [-0.3, 0.05].map((k) => [v + k * d[0], h + k * d[1]]));
    return hull(pts.flatMap(([v, h]) => [[u0, v, h], [u1, v, h], [u0, v, BASE], [u1, v, BASE]]));
  }),
).rotate([0, 0, AS.richting]);
const lowTip = Math.min(...tips.flatMap(({ corners }) => corners.map(([, h]) => h)));
const printModel = union([model, steun]);

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




// ---------- controles ----------
for (const [name, solid] of [["model", model], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
if (lowTip < STELLING.z + 2) throw new Error(`onderste wiekpunt te laag (${lowTip.toFixed(2)})`);

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
report.kraag = { vanaf: +zKraag.toFixed(2), tot: +zPlaat.toFixed(2) };
report.onderstWiekpunt = +lowTip.toFixed(2);
const glbFile = path.join(outDir, "molen-de-valk.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-molen-de-valk.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

// De STL staat met de onderkant (1 m onder het maaiveld) op het printbed.
const stlFile = path.join(outDir, `molen-de-valk-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint De Valk Leiden 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Het maaiveld wordt op het
// bolwerk rond de molen bemonsterd, niet aan de lagere voet ervan.
await writeFile(
  path.join(outDir, "molen-de-valk.json"),
  JSON.stringify(
    {
      name: "De Valk",
      file: "molen-de-valk.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: [1, 0],
      groundOffsetMetres: 0,
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0546100000044130"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (93369,48, 464418,24) in het hart van de romp op het maaiveld van het bolwerk (NAP +3,3 m), +X naar het oosten en +Y naar het noorden. De molen loopt 1 m onder het maaiveld door; dat wordt op het bolwerk rond de molen bemonsterd. Vervangt de PDOK-reconstructie van BAG-pand 0546100000044130. Ronde stenen romp, achtkante stelling als dichte plaat op een kraag van 50 graden, rietgedekte kap, staart, wiekenkruis als plaat in X-stand aan de oostkant en de aanbouw met zadeldak. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`molen-de-valk-1-${scale}.stl`],
      realWorld: {
        flightM: WIEK.vlucht,
        rompRadiusBaseM: ROMP.rBase,
        rompRadiusTopM: ROMP.rTop,
        rompTopNapM: 27.5,
        stellingNapM: 16.4,
        stellingApothemM: STELLING.apothem,
        capTopNapM: 32.2,
        axleNapM: 29.8,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/De_Valk_(Leiden)",
        "PDOK BAG pand 0546100000044130 (romp en aanbouw), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de kap, de stelling, de aanbouw en het maaiveld op het bolwerk",
        "PDOK luchtfoto (Actueel_orthoHR) voor de stand van kap en wieken",
        "Wikimedia Commons: Leiden-Windmill-DeValk.JPG, Close-up van ronde stenen stellingmolen met aanbouw - AMR Molenfoto - 20540486 - RCE.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

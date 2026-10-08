// Genereert een vereenvoudigd, gesloten 3D-model van Depot Boijmans Van
// Beuningen in Rotterdam (Museumpark), de spiegelende kom van MVRDV (2021):
// een omwentelingslichaam dat van een cirkel van 41,6 m op het maaiveld
// uitbolt tot 60,1 m bovenaan, de borstwering rond het platte dak, het
// kruisvormige dakpaviljoen (restaurant en tentoonstellingszaal) met de
// glazen gevel onder de dakrand, de schuine lichtkap boven het atrium en vijf
// installatiekasten, de plantvakken van de daktuin als aparte groene node en
// de hoofdingang aan de noordkant, naar Het Nieuwe Instituut. De berken op het
// dak zitten bewust niet in het model. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node per
// materiaalklasse met de klasse in de nodenaam) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-depot-boijmans.mjs              # 1:1000 (standaard)
//   node scripts/generate-depot-boijmans.mjs --scale 2000
//
// Printbaar zonder steun: alles staat op dezelfde onderkant (1 m onder het
// maaiveld). De gevel helt aan de voet het sterkst naar buiten, 37,4 graden
// uit het lood (52,6 graden boven de horizon, steiler dan 45), en wordt naar
// boven toe steiler tot vrijwel loodrecht onder de borstwering. Het script
// controleert dat geen ondervlak flauwer is dan 45 graden, op de vlakke
// bovenkanten van 0,4 m diep na: de onderkant van de dakrand van het paviljoen
// boven de glazen gevel en de twee treden boven de hoofdingang, zo bedoeld. De export vult de kom laag voor laag op onder de
// printbare hoek (een gesloten node met een naar buiten hellende gevel krijgt
// sinds 2026-10-05 de overhangopvulling, ook zonder vlak ondervlak).
//
// De groene node: de plantvakken liggen 0,5 m boven het dak. Een losse plaat
// op het dak zou de export recht naar beneden of met een wig en een wand tot
// de onderplaat opvullen, en die zou onder de dakrand buiten de kom steken.
// Daarom draagt de node zichzelf met een verborgen kern binnen de kom: een
// cilinder van 19,8 m straal vanaf de onderkant die vanaf 8 m onder 45 graden
// verbreedt tot 0,5 m binnen de gevel, onder het dak. Die kern zit overal in de
// gebouwnode; die staat in de GLB vóór de groene node, zodat een slicer die
// overlappende delen op volgorde afknipt (Bambu Studio, Orca) de kern aan het
// gebouw geeft en alleen de plantvakken groen print.
//
// Assenstelsel: oorsprong in het hart van de kom (het gemeenschappelijke
// middelpunt van de BGT-voetcirkel en de BAG-contour) op het maaiveld van het
// Museumpark (NAP -1,1 m), Z omhoog. +X loopt langs de lange balk van het
// kruisvormige dakpaviljoen naar het oostnoordoosten, RD-richting (0,94609,
// 0,32392), 18,9 graden linksom vanaf het oosten; +Y 90 graden linksom, naar
// het noordnoordwesten.
//
// Bronnen: BGT-pand bij BAG-pand 0599100100015964 (de voet: een cirkel met een
// straal van 20,80 m) en de BAG-contour van datzelfde pand (de grootste
// omtrek: een cirkel met een straal van 30,05 m, concentrisch op 2 cm); AHN
// DSM/DTM 0,5 m (PDOK WCS) voor het dak op NAP +32,95 m, de borstwering, het
// dakpaviljoen (omtrek, dak op NAP +38,95 m, de lichtkap die van NAP +39,4 naar
// +39,85 m oploopt, de installatiekasten) en het maaiveld; PDOK luchtfoto
// (8 cm, 1,0 en 1,7 m verschoven tegen het AHN omdat het dak scheef in beeld
// staat) voor de plantvakken, de terrassen en de details op het paviljoen;
// Wikipedia en MVRDV (39,5 m hoog, 60 m bovenaan, 40 m aan de voet, 1664
// spiegelende panelen, daktuin met berken) en Wikimedia Commons-foto's. De
// dakrand in het AHN ligt aan de noordkant tot 1,8 m binnen de BAG-cirkel en
// is daar rommelig (spiegelingen op de glazen balustrade); de BAG-cirkel en
// de foto's zijn daarom leidend voor de kom. Geschat: het verloop van de gevel
// tussen voet en dakrand (een kromme r(z) = 30,05 - 9,25 (1 - z/40)^3,3, gefit
// op het silhouet in een frontale foto), de hoogte van de plantvakken (0,5 m)
// en hun grenzen (luchtfoto, op een halve meter), de nis van 0,4 m en de
// dakrand van 1 m van het paviljoen, en de maat van de hoofdingang (foto's).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "depot-boijmans");
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
const rect = (u0, u1, v0, v1) =>
  new CrossSection([ccw([[u0, v0], [u1, v0], [u1, v1], [u0, v1]])]);
const prism = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
// Omwentelingslichaam uit een profiel [straal, hoogte] rond de Z-as.
const revolve = (profile, segments = 192) => Manifold.revolve([ccw(profile)], segments);
const rad = (deg) => (deg * Math.PI) / 180;

// ---------- maten (hoogte boven het maaiveld, NAP -1,1 m) ----------
const ORIGIN = [91976.83, 436543.305];
const X_AXIS = [0.94609, 0.32392];
const BASE = -1;
// De kom: voetcirkel (BGT) en grootste omtrek (BAG), de gevel tot de bovenkant
// van de borstwering op 35,3 m (AHN NAP +34,2 m), het dak op 34,05 m (AHN
// NAP +32,95 m) binnen een borstwering van 1 m dik.
const BOWL = { foot: 20.8, top: 30.05, height: 40, power: 3.3, parapet: 35.3, roof: 34.05, wall: 1.0 };
// Gevelkromme: straal op hoogte z, van 20,8 m aan de voet naar 30,05 m.
const facadeRadius = (z) =>
  z <= 0
    ? BOWL.foot
    : BOWL.top - (BOWL.top - BOWL.foot) * Math.max(0, 1 - z / BOWL.height) ** BOWL.power;
// Kruisvormig dakpaviljoen (AHN, in het stelsel langs de lange balk; randen
// waar het DSM door 37 m gaat): de balk van 45,8 × 16,5 m, de armen van 14,35 m
// breed tot 22,4 m uit het hart, het dak op 40,05 m (NAP +38,95 m). De glazen
// gevel staat 0,4 m terug onder een dakrand van 1 m (luchtfoto: een rand van
// circa een meter rondom; de diepte is geschat).
const CROSS = {
  bar: { u: [-22.9, 22.9], v: [-10.75, 5.75] },
  arm: { u: [-7.25, 7.1], v: [-22.4, 22.4] },
  top: 40.05,
  fascia: 1.0,
  recess: 0.4,
};
// Lichtkap boven het atrium: een lessenaarsdak dat van 40,5 m aan de
// noordkant (+Y) oploopt tot 40,95 m aan de zuidkant (AHN: 40,53 tot 40,89 m
// mediaan per halve meter).
const SKYLIGHT = { u: [-14.5, 14.75], v: [-3.75, 3.75], low: 40.5, high: 40.95 };
// Installatiekasten (AHN 10e tot 90e percentiel, luchtfoto): de trappenhuis-
// en liftkast op de noordarm, de ventilatoren op de zuidarm, de witte kast op
// het oosteinde, de kasten op het westeinde en het luchtbehandelingsblok ten
// zuiden van de lichtkap.
const PLANT = [
  { u: [-2.5, 1.75], v: [9.0, 19.5], top: 41.5 },
  { u: [-1.25, 1.75], v: [-17.5, -9.5], top: 41.4 },
  { u: [17.75, 22.25], v: [-8.75, -4.75], top: 41.9 },
  { u: [-22.25, -19.5], v: [0.75, 3.75], top: 41.75 },
  { u: [-7.0, 3.0], v: [-6.75, -4.75], top: 41.5 },
];
// Daktuin (luchtfoto): plantvakken 0,5 m boven het dak, tot in de borstwering
// zodat de rand er zonder naad tegenaan ligt, en 1,5 m vrij van het paviljoen
// (het pad eromheen). Een rand langs de borstwering van 25 m tot de
// borstwering, met open stukken voor het terras aan de zuidoostkant (−80 tot
// −30 graden vanaf +X), het terras en het pad aan de noordoostkant (22 tot 35
// en 55 tot 62 graden) en het pad aan de noordkant (100 tot 112 graden), plus
// drie grote vakken in het noordwestelijke, noordoostelijke en
// zuidwestelijke kwadrant. Het terras aan de zuidoostkant is bestraat.
const GARDEN = {
  top: BOWL.roof + 0.5,
  ring: [25.0, 29.4],
  sectors: [[-30, 22], [35, 55], [62, 100], [112, 280]],
  beds: [
    [[-9.5, 31], [-9.5, 19], [-15.5, 16.5], [-17.5, 11], [-19, 7.5], [-31, 7.5], [-31, 31]],
    [[10, 10.3], [13.5, 10.3], [17, 15.6], [26, 17], [26, 22], [19, 24.5], [10, 14.5]],
    [[-27, -12.5], [-9.5, -12.5], [-9.5, -20], [-10.5, -31], [-31, -31], [-31, -12.5]],
  ],
  clear: 1.5,
};
// Verborgen kern van de groene node (zie boven): binnen de kom en onder het dak.
const CORE = { radius: 19.8, flare: 8, inset: 0.5, top: BOWL.roof - 0.5 };
// Hoofdingang aan de noordkant (RD-azimut 95 graden, naar Het Nieuwe
// Instituut): een nis van 10 m breed met evenwijdige zijwanden, 0,8 m diep tot
// 4 m hoog en daarboven een trede van 0,4 m diep tot 4,4 m, beide met een
// vlakke bovenkant van 0,4 m (foto's: de deuren en de uitklappende panelen
// staan in een vlakke insnijding met een vlakke bovenkant op circa 4 m). In het
// echt staan de deuren loodrecht en is de bovenkant 3 m diep; die zou vrij
// overhangen, en een schuine bovenkant van 45 graden zou onder de naar buiten
// hellende gevel pas op bijna 10 m uitkomen.
const ENTRANCE = { azimuth: 95 - 18.9, width: 10, steps: [[0.8, 4.0], [0.4, 4.4]] };

// ---------- opbouw: gebouw ----------
// Gevelkromme om de 0,5 m tot 20 m hoogte en om de meter daarboven, waar ze
// bijna loodrecht staat.
const facade = [];
for (let z = 0; z < BOWL.parapet - 0.5; z += z < 20 ? 0.5 : 1) facade.push([facadeRadius(z), z]);
facade.push([facadeRadius(BOWL.parapet), BOWL.parapet]);
const bowlProfile = [
  [0, BASE],
  [BOWL.foot, BASE],
  ...facade,
  [BOWL.top - BOWL.wall, BOWL.parapet],
  [BOWL.top - BOWL.wall, BOWL.roof],
  [0, BOWL.roof],
];
let bowl = revolve(bowlProfile, 160);

// Nis van de hoofdingang: per trede een schil die de gevel op een vaste diepte
// volgt, tot de bovenkant van die trede, begrensd door een strook van 10 m
// breed langs de as van de ingang.
const nicheBand = ([depth, top]) => {
  const profile = [
    [BOWL.foot - depth, BASE - 1],
    [BOWL.top + 5, BASE - 1],
    [BOWL.top + 5, top],
  ];
  for (let z = top; z > -1e-9; z -= 0.25) profile.push([facadeRadius(z) - depth, z]);
  return revolve(profile, 160);
};
const entranceStrip = box(0, BOWL.top + 6, -ENTRANCE.width / 2, ENTRANCE.width / 2, BASE - 2, 10).rotate([
  0,
  0,
  ENTRANCE.azimuth,
]);
bowl = bowl.subtract(Manifold.union(ENTRANCE.steps.map(nicheBand)).intersect(entranceStrip));

// Dakpaviljoen: de glazen gevel 0,4 m terug, daarboven de dakrand over de
// volle omtrek.
const crossOutline = CrossSection.union([rect(...CROSS.bar.u, ...CROSS.bar.v), rect(...CROSS.arm.u, ...CROSS.arm.v)]);
const glassLine = crossOutline.offset(-CROSS.recess, "Miter", 2);
const pavilion = Manifold.union([
  prism(glassLine, BOWL.roof - 0.5, CROSS.top - CROSS.fascia),
  prism(crossOutline, CROSS.top - CROSS.fascia, CROSS.top),
]);
// Lichtkap: een prisma met een schuin dak (oplopend naar -Y).
const skylight = Manifold.extrude(
  new CrossSection([
    ccw([
      [SKYLIGHT.v[0], CROSS.top - 0.5],
      [SKYLIGHT.v[1], CROSS.top - 0.5],
      [SKYLIGHT.v[1], SKYLIGHT.low],
      [SKYLIGHT.v[0], SKYLIGHT.high],
    ]),
  ]),
  SKYLIGHT.u[1] - SKYLIGHT.u[0],
)
  // (v, z, u) -> (u, v, z)
  .rotate([90, 0, 90])
  .translate([SKYLIGHT.u[0], 0, 0]);

const building = Manifold.union([
  bowl,
  pavilion,
  skylight,
  ...PLANT.map((p) => box(...p.u, ...p.v, CROSS.top - 0.5, p.top)),
]);

// ---------- opbouw: daktuin (groen) ----------
const sector = ([a0, a1]) => {
  const [r0, r1] = GARDEN.ring;
  const pts = [];
  for (let a = a0; a <= a1 + 1e-9; a += 1) pts.push([r1 * Math.cos(rad(a)), r1 * Math.sin(rad(a))]);
  for (let a = a1; a >= a0 - 1e-9; a -= 1) pts.push([r0 * Math.cos(rad(a)), r0 * Math.sin(rad(a))]);
  return new CrossSection([ccw(pts)]);
};
const roofDisc = CrossSection.circle(GARDEN.ring[1], 160);
const gardenPlan = CrossSection.union([
  ...GARDEN.sectors.map(sector),
  ...GARDEN.beds.map((pts) => new CrossSection([ccw(pts)]).intersect(roofDisc)),
]).subtract(crossOutline.offset(GARDEN.clear, "Miter", 2));
// Iets in de kern laten zakken, zodat ze één geheel worden.
const beds = prism(gardenPlan, CORE.top - 0.2, GARDEN.top);
const coreProfile = [[0, BASE], [CORE.radius, BASE], [CORE.radius, CORE.flare]];
for (let z = CORE.flare + 0.5; z < CORE.top; z += 0.5) {
  const r = Math.min(CORE.radius + (z - CORE.flare), facadeRadius(z) - CORE.inset);
  coreProfile.push([r, z]);
}
coreProfile.push([Math.min(CORE.radius + CORE.top - CORE.flare, facadeRadius(CORE.top) - CORE.inset), CORE.top], [0, CORE.top]);
const core = revolve(coreProfile, 96);
const garden = Manifold.union([core, beds]);

const nodes = [
  ["building:depot-boijmans", building],
  ["vegetation:depot-boijmans-daktuin", garden],
];
const printModel = Manifold.union([building, garden]);

// Controle 1: elk naar beneden gericht vlak boven de onderkant staat minstens
// 45 graden steil (hoek tussen de normaal en recht omlaag), behalve de vlakke
// bovenkanten van 0,4 m diep: de onderkant van de dakrand van het paviljoen en
// de twee treden boven de hoofdingang.
const undersides = (solid, allowedZ = []) => {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 90;
  const allowed = allowedZ.map(() => 0);
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] >= 0) continue;
    const k = allowedZ.findIndex((z) => p.every((q) => Math.abs(q[2] - z) < 1e-4));
    if (k >= 0) {
      allowed[k] += len / 2;
      continue;
    }
    worst = Math.min(worst, (Math.acos(-n[2] / len) * 180) / Math.PI);
  }
  return { worst, allowed };
};
{
  const b = undersides(building, [CROSS.top - CROSS.fascia, ...ENTRANCE.steps.map(([, top]) => top)]);
  const g = undersides(garden);
  console.log(
    `flauwste ondervlak: gebouw ${b.worst.toFixed(2)}, daktuin ${g.worst.toFixed(2)} graden boven de horizon; vlakke bovenkanten: dakrand paviljoen ${b.allowed[0].toFixed(1)} m2, treden van de ingang ${b.allowed.slice(1).map((a) => a.toFixed(1)).join(" en ")} m2`,
  );
  if (b.worst < 44.99 || g.worst < 44.99) throw new Error("ondervlak flauwer dan 45 graden");
  if (!b.allowed.every((a) => a > 1)) throw new Error("vlakke bovenkant ontbreekt");
}
// Controle 2: de kern van de groene node zit helemaal in het gebouw.
{
  const outside = core.subtract(building).volume();
  console.log(`kern buiten het gebouw: ${outside.toFixed(4)} m3`);
  if (outside > 1e-3) throw new Error("kern van de daktuin steekt buiten het gebouw");
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
report.gardenAreaM2 = +gardenPlan.area().toFixed(1);
const glbFile = path.join(outDir, "depot-boijmans.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-depot-boijmans.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `depot-boijmans-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Depot Boijmans Van Beuningen 1:${scale} mm Z-up`);
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
  path.join(outDir, "depot-boijmans.json"),
  JSON.stringify(
    {
      name: "Depot Boijmans Van Beuningen",
      file: "depot-boijmans.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op de bestrating rondom, 3 m buiten de grootste omtrek (NAP -1,2 tot
      // -1,0 m), niet in de verdiepte straat aan de westkant (NAP -3,4 m).
      groundSamplePoints: [
        [23.33, 23.33],
        [-23.33, 23.33],
        [-23.33, -23.33],
        [23.33, -23.33],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0599100100015964"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de kom op het maaiveld van het Museumpark (NAP -1,1 m) in de oorsprong, +X langs de lange balk van het kruisvormige dakpaviljoen naar het oostnoordoosten (RD-richting 18,9 graden linksom vanaf het oosten) en +Y naar het noordnoordwesten. Node building: de spiegelende kom die van 41,6 m aan de voet uitbolt tot 60,1 m, het platte dak met de borstwering, het kruisvormige dakpaviljoen met de glazen gevel onder de dakrand, de schuine lichtkap en vijf installatiekasten, en de hoofdingang aan de noordkant als nis van 10 m breed en 0,8 m diep tot 4 m hoog, met een trede van 0,4 m tot 4,4 m. Node vegetation: de plantvakken van de daktuin, 0,5 m boven het dak, met een verborgen kern binnen de kom waarop ze in de export steunen; de berken zelf zijn weggelaten. Vervangt de PDOK-reconstructie van BAG-pand 0599100100015964; de parkeergarage Museumpark (0599100000423762) ligt er ondergronds naast en raakt de omtrek over 11 m2.",
      printFiles: [`depot-boijmans-1-${scale}.stl`],
      realWorld: {
        footDiameterM: +(2 * BOWL.foot).toFixed(2),
        topDiameterM: +(2 * BOWL.top).toFixed(2),
        parapetM: BOWL.parapet,
        roofM: BOWL.roof,
        gardenTopM: GARDEN.top,
        gardenAreaM2: +gardenPlan.area().toFixed(0),
        pavilionM: [
          +(CROSS.bar.u[1] - CROSS.bar.u[0]).toFixed(2),
          +(CROSS.arm.v[1] - CROSS.arm.v[0]).toFixed(2),
        ],
        pavilionTopM: CROSS.top,
        skylightTopM: SKYLIGHT.high,
        plantTopM: Math.max(...PLANT.map((p) => p.top)),
        maxFacadeLeanDeg: +(
          (Math.atan(((BOWL.top - BOWL.foot) * BOWL.power) / BOWL.height) * 180) /
          Math.PI
        ).toFixed(1),
        entranceAzimuthDeg: 95,
        groundNapM: -1.1,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Depot_Boijmans_Van_Beuningen",
        "https://www.mvrdv.com/projects/10/depot-boijmans-van-beuningen",
        "PDOK BAG pand 0599100100015964 (grootste omtrek) en BGT pand (voet), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dak, borstwering, dakpaviljoen met lichtkap en installatiekasten, maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR): plantvakken, terrassen en paden van de daktuin, dakrand en details van het paviljoen",
        "Wikimedia Commons: Depot Boijmans van Beuningen 2025 (Osten).jpg, 2025DepotBoijmans.jpg, Rotterdam Depot Boijmans Van Beuningen seen from the south.jpg, Depot Boijmans van Beuningen von Westen 2025.jpg, Boijmans Depot, Rotterdam, September 2024 01.jpg en 06.jpg (hoofdingang), Depot Boijmans Van Beuningen in aanbouw 08.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

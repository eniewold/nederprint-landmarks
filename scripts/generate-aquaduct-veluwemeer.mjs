// Genereert een vereenvoudigd, gesloten 3D-model van het Aquaduct Veluwemeer
// bij Harderwijk (2003): een betonnen waterbak waarin de vaargeul tussen het
// Veluwemeer en het Wolderwijd over de verdiepte N302 (Knardijk) heen loopt. De
// weg gaat er in drie kokers onderdoor: een fietskoker aan de zuidwestkant (op
// een hoger niveau) en twee kokers met elk twee rijstroken. Aan de vier hoeken
// buigen de vleugelwanden in een lensvorm uit naar het meer. Alle maten in het
// script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog,
// nodes `klasse:label`, de rijbanen en het fietspad met de BGT-attributen en het
// water in de bak als eigen nodes) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-aquaduct-veluwemeer.mjs              # 1:1000 (standaard)
//   node scripts/generate-aquaduct-veluwemeer.mjs --scale 500
//
// Assenstelsel: oorsprong midden in de bak, op het snijpunt van de as van de
// vaargeul en de as van de weg; Z omhoog. +X loopt langs de vaargeul naar het
// noordoosten (het Wolderwijd, RD-richting 45 graden vanaf het oosten, evenwijdig
// aan de BGT-randen van de bakwanden), +Y naar het noordwesten. De weg kruist
// scheef: hij loopt in het lokale stelsel onder -80 graden (RD -35 graden, naar
// het zuidoosten). Daarom staan dwars op de weg gemeten maten hier als `t`, de
// afstand tot de wegas langs N = (cos 10°, sin 10°) (positief naar het
// noordoosten); een punt (t, y) ligt op x = (t - y sin 10°) / cos 10°. De
// kopgevels van de bak (de portalen boven de weg) liggen op y = ±12,75, de bak
// loopt dwars over de weg tot de buitenkant van de buitenste tunnelwanden
// (t = ±13,73).
//
// Hoogtes: in NAP; z = NAP + 43,03 - 34,616. 43,03 m is hier het verschil
// tussen de ellipsoïdische PDOK-hoogtes en het AHN (gemeten op de dijk en de
// rijbaan naast de bak), 34,616 m de laagste PDOK-wegdekhoogte op de vier
// bemonsteringspunten op de rijbanen net buiten de portalen (z = 0, NAP -8,41).
//
// Waterspiegel en PDOK-terrein: de PDOK-terreintegels hebben in de bak alleen
// het water (ellipsoïdisch 42,54 tot 42,63, NAP circa -0,43) en de bakwanden als
// scheidingen die vanaf de rijbaan schuin oplopen tot 42,3 à 43,2; de weg onder
// de bak ontbreekt. Het water in het model (`water:waterbak`) ligt daarom 7 cm
// boven het hoogste PDOK-water (42,70), zodat de twee vlakken niet samenvallen;
// de bakwanden (NAP +1,52) omsluiten de PDOK-scheidingen. De kopgevels staan
// 5 cm voor de BGT-rand (y = ±12,70), zodat de verticale PDOK-wand daar binnen
// het model valt. In de tunnelmonden blijft de schuine PDOK-scheiding zichtbaar
// (de kaart en de print kunnen niet door de bak heen kijken: PDOK-terrein is een
// hoogteveld); het STL-model heeft doorgaande kokers. De rijbanen liggen op
// NAP -8,23 (AHN bij de portalen, gemiddeld gelijk aan het PDOK-wegdek), het
// fietspad op NAP -5,95 (AHN; het PDOK-fietspad helt bij het zuidoostportaal
// tot 3,5 m te hoog op).
//
// Printbaarheid op 1:1000: de tussenwand naast de fietskoker (0,58 m) en de
// middenwand (0,83 m) zijn verdikt tot 0,9 m; de kokers hebben een vlak plafond
// (de export zet er vanaf de monden een wig onder). Alle onderdelen staan op
// dezelfde vlakke onderkant (0,6 m onder het wegdek), ook de vleugelwanden, die
// in het meer en in de PDOK-eilandjes verdwijnen.
//
// Bronnen: BGT kunstwerkdeel (bakwanden P0025.7da7890b, .17a5a4c0, .95534231,
// .6ac5668d; tunnelwanden P0025.5a75dd90, .8eccf91b, .2ca6f3c4, .a33789d5;
// vleugelwanden P0025.a687a766 en .37ef7a18) en wegdeel (rijbanen en fietspad
// onder de bak, relatieve hoogteligging -1); AHN DSM/DTM 0,5 m (PDOK WCS) voor
// de bovenkant van de bak- en vleugelwanden (NAP +1,52), de rijbaan
// (NAP -8,23 bij de portalen) en het fietspad (NAP -5,95); de PDOK-terreintegels
// voor het water en het wegdek; Wikipedia (Aquaduct Veluwemeer: 25 m lang,
// 19 m breed, 3 m water) en de Wikimedia Commons-foto's Aquaduct Veluwemeer (1)
// tot (3) en Veluwemeer Aquaduct.jpg voor de portalen.
//
// Geschat (foto's): de vrije hoogte onder het plafond (NAP -3,5, 4,7 m boven de
// rijbaan, 2,45 m boven het fietspad), de randbalk boven de rijbanen
// (onderkant NAP -4,0), de verdiepte gevelstrook (0,35 m, NAP -2,9 tot +0,9),
// de schuine kolommen voor de tunnelwanden en de bakvloer (NAP -2,6; daarmee is
// het water 2,2 m diep in plaats van de 3 m van Wikipedia, anders past het
// plafond niet boven de fietskoker).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "aquaduct-veluwemeer");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const area = (pts) => pts.reduce((s, [x, y], i) => {
  const [u, v] = pts[(i + 1) % pts.length];
  return s + x * v - u * y;
}, 0) / 2;
const ccw = (pts) => (area(pts) < 0 ? [...pts].reverse() : pts);
const prismCs = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const prism = (pts, z0, z1) => prismCs(new CrossSection([ccw(pts)], "Positive"), z0, z1);
// Scheve stelsel van de weg: (t, y) -> (x, y).
const COS = Math.cos((10 * Math.PI) / 180);
const SIN = Math.sin((10 * Math.PI) / 180);
const tx = (t, y) => [(t - y * SIN) / COS, y];
// Parallellogram tussen twee lijnen evenwijdig aan de weg (t0, t1) en twee
// lijnen evenwijdig aan de vaargeul (y0, y1).
const para = (t0, t1, y0, y1) => [tx(t0, y0), tx(t1, y0), tx(t1, y1), tx(t0, y1)];
// Convexe vorm uit punten [t, y, z].
const hullTY = (points) => Manifold.hull(points.map(([t, y, z]) => [...tx(t, y), z]));

// ---------- hoogtes ----------
const NAP_TO_ELLIPSOID = 43.03;
const GROUND_ELLIPSOID = 34.616; // laagste PDOK-wegdek op de bemonsteringspunten
const Z = (nap) => +(nap + NAP_TO_ELLIPSOID - GROUND_ELLIPSOID).toFixed(3);
const ROAD = Z(-8.23); // rijbanen onder de bak (AHN bij de portalen)
const BIKE = Z(-5.95); // fietspad in de fietskoker (AHN)
const BASE = +(ROAD - 0.6).toFixed(3); // gemeenschappelijke onderkant
const CEILING = Z(-3.5); // plafond van de kokers (geschat)
const BEAM_BOTTOM = Z(-4.0); // randbalk boven de rijbanen in de portalen (geschat)
const FLOOR = Z(-2.6); // bovenkant bakvloer (geschat)
const WATER_TOP = +(42.7 - GROUND_ELLIPSOID).toFixed(3); // 7 cm boven het hoogste PDOK-water
const TOP = Z(1.52); // bovenkant bak- en vleugelwanden (AHN)
const PANEL_BOTTOM = Z(-2.9); // verdiepte gevelstrook in de kopgevel (geschat)
const PANEL_TOP = Z(0.9);
const PANEL_DEPTH = 0.35;
const COLUMN_TOP = Z(-2.0); // schuine kolommen voor de tunnelwanden (geschat)
const COLUMN_FOOT = 0.9; // uitsprong aan de voet
const COLUMN_HEAD = 0.4; // uitsprong bovenaan

// ---------- plattegrond (BGT, lokaal) ----------
const BAK_T = 13.73; // buitenkant buitenste tunnelwanden (BGT)
const PORTAL = 12.75; // kopgevel, 5 cm voor de BGT-rand op 12,70
const CHANNEL = 9.65; // binnenkant bakwanden: vaargeul 19,3 m breed (BGT)
// Tunnelwanden dwars op de weg [t van, t tot] (BGT; de twee binnenste
// verdikt tot 0,9 m rond hun hart).
const WALLS = [
  [-13.73, -12.09], // buitenwand zuidwest
  [-7.86, -6.96], // tussenwand fietskoker (BGT -7,70 tot -7,12)
  [2.065, 2.965], // middenwand (BGT 2,10 tot 2,93)
  [12.0, 13.73], // buitenwand noordoost
];
// Kokers tussen de wanden met de BGT-wegdelen (relatieve hoogteligging -1).
const TUBES = [
  { name: "fietskoker", t: [-12.09, -7.86], top: BIKE, beam: false }, // fietspad P0025.fd1d608460f5, BGT t -12,22 tot -7,68
  { name: "zuidwest", t: [-6.96, 2.065], top: ROAD, beam: true }, // rijbaan P0025.fd1d608460fa en .fd1d608460fc
  { name: "noordoost", t: [2.965, 12.0], top: ROAD, beam: true }, // rijbaan P0025.fd1d608460f7 en .fd1d60846100
];
// Vleugelwanden (BGT kunstwerkdeel, 'keermuur', vereenvoudigd tot 5 cm):
// lensvormen aan de noordwest- en de zuidoostkant van de vaargeul; elk vlak
// loopt ook als strook langs de binnenkant van de bakwand.
const WING_NW = [[18.94, 23.86], [15.73, 24.19], [15.92, 23.17], [21.9, 22.47], [25.01, 21.84], [28.8, 20.51], [36.18, 16.97], [29.8, 13.78], [28.25, 13.11], [26.67, 12.55], [24.96, 12.11], [23.27, 11.79], [14.66, 10.64], [11.7, 10.68], [11.7, 10.55], [-15.68, 10.52], [-15.68, 10.61], [-18.22, 10.67], [-21.24, 10.96], [-27.27, 11.67], [-29.88, 12.14], [-32.19, 12.78], [-35.02, 13.85], [-41.91, 16.94], [-38.94, 18.26], [-35.04, 19.86], [-32.3, 20.82], [-29.36, 21.53], [-23.98, 22.52], [-24.18, 23.49], [-29.55, 22.51], [-32.64, 21.77], [-35.38, 20.8], [-39.33, 19.18], [-42.37, 17.83], [-42.8, 17.4], [-42.9, 16.83], [-42.74, 16.38], [-42.37, 16.05], [-34.31, 12.48], [-30.99, 11.38], [-29.0, 10.94], [-27.04, 10.63], [-18.32, 9.67], [-15.05, 9.62], [14.78, 9.65], [23.43, 10.8], [25.22, 11.14], [26.95, 11.59], [29.91, 12.73], [34.63, 15.05], [36.73, 16.14], [36.99, 16.38], [37.14, 16.7], [37.18, 17.02], [37.11, 17.34], [36.94, 17.62], [36.69, 17.84], [29.13, 21.45], [25.34, 22.78], [24.54, 22.98], [22.3, 23.42]];
const WING_SE = [[-15.77, -23.87], [-15.95, -22.86], [-19.02, -22.53], [-23.73, -21.86], [-25.52, -21.5], [-27.21, -21.03], [-30.01, -19.9], [-36.05, -16.92], [-35.4, -16.49], [-32.79, -15.22], [-26.98, -12.62], [-24.47, -11.8], [-21.51, -11.27], [-14.2, -10.64], [-11.73, -10.65], [-11.73, -10.52], [15.72, -10.53], [15.72, -10.64], [17.37, -10.64], [25.33, -11.32], [27.71, -11.63], [29.7, -12.02], [31.62, -12.58], [33.79, -13.39], [41.86, -16.91], [37.78, -18.75], [34.5, -20.08], [32.49, -20.73], [28.58, -21.73], [24.06, -22.49], [24.21, -23.48], [28.75, -22.71], [32.8, -21.68], [34.81, -21.04], [38.19, -19.66], [42.33, -17.79], [42.75, -17.37], [42.85, -16.8], [42.67, -16.33], [42.28, -16.01], [34.19, -12.48], [31.9, -11.62], [29.98, -11.06], [27.84, -10.64], [25.46, -10.33], [17.37, -9.64], [-14.2, -9.64], [-20.84, -10.19], [-22.94, -10.47], [-24.7, -10.83], [-26.44, -11.35], [-28.35, -12.1], [-33.23, -14.32], [-35.95, -15.65], [-36.65, -16.12], [-36.9, -16.38], [-37.05, -16.82], [-36.98, -17.28], [-36.83, -17.55], [-36.57, -17.77], [-34.64, -18.75], [-31.09, -20.49], [-29.1, -21.39], [-27.38, -22.03], [-25.57, -22.51], [-23.45, -22.91], [-19.15, -23.52]];
// De vleugelwanden 5 cm breder dan de BGT, zodat de PDOK-scheidingen erbinnen vallen.
const WING_GROW = 0.05;

// ---------- bouwdelen ----------
const FAR = 30; // ruim voorbij de bak, voor uitsnijdingen
// Bak: één blok over de verdiepte weg, van de onderkant tot de wandkop.
const bakBlock = prism(para(-BAK_T, BAK_T, -PORTAL, PORTAL), BASE, TOP);
// Vaargeul: de bak is aan beide kopse kanten open naar het meer.
const channel = prism(para(-FAR, FAR, -CHANNEL, CHANNEL), FLOOR, TOP + 1);
// Kokers: doorgaand tot het plafond.
const tubeVoids = TUBES.map(({ t: [t0, t1] }) => prism(para(t0, t1, -FAR, FAR), BASE - 1, CEILING));
// Verdiepte gevelstrook in beide kopgevels, met een schuine bovenrand (45°).
const panel = (side) => {
  const y0 = side * (PORTAL - PANEL_DEPTH);
  const y1 = side * (PORTAL + 1);
  const pts = [];
  for (const t of [-(BAK_T - 0.75), BAK_T - 0.75]) {
    pts.push([t, y0, PANEL_BOTTOM], [t, y1, PANEL_BOTTOM], [t, y0, PANEL_TOP - PANEL_DEPTH], [t, y1, PANEL_TOP + 1]);
  }
  return hullTY(pts);
};
// Vloer van elke koker: het wegdek (rijbaan of fietspad), 1 cm in de wanden.
const floors = TUBES.map(({ t: [t0, t1], top }) => prism(para(t0 - 0.01, t1 + 0.01, -PORTAL, PORTAL), BASE, top));
// Randbalk onder het plafond aan de monden van de twee rijbaankokers, 0,9 m diep.
const beams = TUBES.filter((tube) => tube.beam).flatMap(({ t: [t0, t1] }) =>
  [1, -1].map((side) => {
    const [ya, yb] = [side * (PORTAL - 0.9), side * PORTAL];
    return prism(para(t0 - 0.01, t1 + 0.01, Math.min(ya, yb), Math.max(ya, yb)), BEAM_BOTTOM, CEILING + 0.01);
  }),
);
// Schuine kolommen voor elke tunnelwand in beide portalen: 0,9 m uitsprong aan
// de voet, 0,4 m bovenaan (zoals de wigvormige kolommen op de foto's).
const columns = WALLS.flatMap(([t0, t1]) =>
  [1, -1].map((side) => {
    const y = (d) => side * (PORTAL + d);
    const pts = [];
    for (const t of [t0, t1]) {
      pts.push([t, y(-0.05), BASE], [t, y(COLUMN_FOOT), BASE], [t, y(-0.05), COLUMN_TOP], [t, y(COLUMN_HEAD), COLUMN_TOP]);
    }
    return hullTY(pts);
  }),
);
// Vleugelwanden: van de onderkant tot de wandkop, behalve binnen de bak, waar
// ze alleen de bakwand aan de waterkant aanvullen (boven de bakvloer).
const wingSection = new CrossSection([ccw(WING_NW), ccw(WING_SE)], "Positive").offset(WING_GROW, "Miter", 2);
const wings = prismCs(wingSection, BASE, TOP).subtract(prism(para(-BAK_T, BAK_T, -FAR, FAR), BASE - 1, FLOOR));

const bridge = union([
  bakBlock.subtract(union([channel, ...tubeVoids, panel(1), panel(-1)])),
  ...floors,
  ...beams,
  ...columns,
  wings,
]);
// Water in de bak tussen de wanden, tot 7 cm boven het hoogste PDOK-water.
const water = prism(para(-BAK_T, BAK_T, -CHANNEL, CHANNEL), FLOOR, WATER_TOP).subtract(bridge);
// Het printmodel: brug en water samen (de bak is in het echt vol water).
const printModel = union([bridge, water]);

// ---------- controles ----------
{
  for (const [name, solid] of [["brug", bridge], ["water", water], ["print", printModel]]) {
    if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  }
  const bb = printModel.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
  console.log("genus brug, water, print:", bridge.genus(), water.genus(), printModel.genus());
}

// ---------- wegdek als eigen onderdelen ----------
// De bovenste 0,5 m van de vloer van elke koker is een eigen node met de
// attributen van de BGT-wegdelen onder de bak (relatieve hoogteligging -1):
// beide rijbaankokers 'rijbaan regionale weg' (vier wegdelen), de fietskoker
// 'fietspad', allemaal gesloten verharding, asfalt. Snijstrook per koker van
// 0,5 m onder tot 1 m boven het wegdek, 2 cm vrij van de tunnelwanden; er
// steekt verder niets boven het wegdek uit (de randbalken hangen 4 m hoger).
// Pas na het printmodel gebouwd, zodat de STL ongewijzigd blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const ROAD_ATTRIBUTES = {
  rijbaan: { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" },
  fietspad: { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" },
};
const WATER_ATTRIBUTES = { bgt_type: "watervlakte" }; // BGT waterdeel L0002.86f5ff7b
const strip = ({ t: [t0, t1], top }) => prism(para(t0 + GUARD, t1 - GUARD, -FAR, FAR), top - LAYER, top + ABOVE);
const bikeCut = strip(TUBES[0]);
const roadCut = union([strip(TUBES[1]), strip(TUBES[2])]);
const bikePath = bikeCut.intersect(bridge);
const carriageway = roadCut.intersect(bridge);
const structure = bridge.subtract(union([bikeCut, roadCut]));
const parts = [
  ["building:aquaduct", structure],
  ["water:waterbak", water, WATER_ATTRIBUTES],
  ["road:rijbaan", carriageway, ROAD_ATTRIBUTES.rijbaan],
  ["road:fietspad", bikePath, ROAD_ATTRIBUTES.fietspad],
];
{
  // De onderdelen vullen brug en water precies op.
  const whole = bridge.volume() + water.volume();
  const sum = parts.reduce((total, [, solid]) => total + solid.volume(), 0);
  console.log("volume brug+water, onderdelen (m3):", +whole.toFixed(3), +sum.toFixed(3));
  if (Math.abs(sum - whole) > 1e-4 * whole) throw new Error("onderdelen tellen niet op tot het geheel");
  for (const [name, solid] of parts) {
    if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
    if (solid.isEmpty()) throw new Error(`${name}: leeg`);
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
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
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
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(2),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "aquaduct-veluwemeer.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-aquaduct-veluwemeer.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de vlakke onderkant op het printbed.
const stlName = `aquaduct-veluwemeer-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Aquaduct Veluwemeer 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Maaiveld: vier punten op de rijbanen, 1,75 m buiten de portalen (midden in
// elke rijbaankoker). Het laagste PDOK-wegdek (34,616 m, noordoostkoker aan de
// zuidoostkant) is z = 0; groundHeight is diezelfde ellipsoïdische hoogte, voor
// een uitsnede waarin geen van de punten valt.
const GROUND_SAMPLES = [
  [-5.1, 14.5],
  [5.06, 14.5],
  [0.02, -14.5],
  [10.17, -14.5],
];
await writeFile(
  path.join(outDir, "aquaduct-veluwemeer.json"),
  JSON.stringify(
    {
      name: "Aquaduct Veluwemeer",
      file: "aquaduct-veluwemeer.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [170754.742, 485919.072],
      xAxis: [0.70711, 0.70711],
      groundOffsetMetres: 0,
      groundHeight: GROUND_ELLIPSOID,
      groundSamplePoints: GROUND_SAMPLES,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong midden in de waterbak op het snijpunt van de vaargeul en de N302, z = 0 op het laagste PDOK-wegdek naast de bak (NAP -8,41 m), +X langs de vaargeul naar het noordoosten (het Wolderwijd, RD-richting 45 graden) en +Y naar het noordwesten; de weg kruist scheef onder RD -35 graden. Vier nodes: building:aquaduct, de bak over de verdiepte weg (dwars over de weg 27,5 m tot de buitenkant van de buitenste tunnelwanden, kopgevels op y = ±12,75, vaargeul 19,3 m breed, wanden tot NAP +1,52 m) met drie kokers (fietskoker op NAP -5,95 m en twee rijbaankokers op NAP -8,23 m, plafond NAP -3,5 m), randbalken, een verdiepte gevelstrook en schuine kolommen in beide portalen, en de vier lensvormige vleugelwanden (BGT) tot x = -42,9 en 42,9; water:waterbak, het water in de bak tot 7 cm boven het PDOK-water (NAP -0,33 m), met bgt_type watervlakte; road:rijbaan en road:fietspad, de bovenste 0,5 m van de kokervloeren met de attributen van de BGT-wegdelen onder de bak (rijbaan regionale weg en fietspad, gesloten verharding, asfalt) in extras.attributes. Het maaiveld wordt op de rijbanen net buiten de portalen bemonsterd. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        tunnelLengthAlongRoadM: 24,
        bakAcrossRoadM: +(2 * BAK_T).toFixed(2),
        channelWidthM: { wikipedia: 19, bgt: +(2 * CHANNEL).toFixed(2) },
        waterDepthM: { wikipedia: 3, model: +(WATER_TOP - FLOOR).toFixed(2) },
        wallTopNapM: 1.52,
        waterNapM: { pdok: -0.43, model: -0.33 },
        roadNapM: -8.23,
        bikePathNapM: -5.95,
        ceilingNapM: { estimate: -3.5 },
        wingTipsM: { west: -42.9, east: 42.85 },
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Aquaduct_Veluwemeer",
        "PDOK BGT kunstwerkdeel P0025.7da7890b, P0025.17a5a4c0, P0025.95534231, P0025.6ac5668d (bakwanden), P0025.5a75dd90, P0025.8eccf91b, P0025.2ca6f3c4, P0025.a33789d5 (tunnelwanden), P0025.a687a76658fa4b4f95802a3c34390ef2 en P0025.37ef7a184e764a52bfb7ed01845ed8dd (vleugelwanden), EPSG:28992",
        "PDOK BGT wegdeel P0025.fd1d608460f548c2e04014ac0e2861a4 (fietspad), P0025.fd1d608460f748c2e04014ac0e2861a4, P0025.fd1d608460fa48c2e04014ac0e2861a4, P0025.fd1d608460fc48c2e04014ac0e2861a4 en P0025.fd1d6084610048c2e04014ac0e2861a4 (rijbaan regionale weg), alle gesloten verharding, asfalt, relatieve hoogteligging -1; BGT waterdeel L0002.86f5ff7b9ed64c4096308b058ca34656 (watervlakte)",
        "PDOK AHN DSM en DTM 0,5 m via WCS voor de wandkoppen, de rijbaan en het fietspad",
        "PDOK 3D-terreintegels voor het water, het wegdek en de scheidingen in en naast de bak",
        "Wikimedia Commons: Aquaduct Veluwemeer (1).jpg, (2).jpg, (3).jpg en Veluwemeer Aquaduct.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

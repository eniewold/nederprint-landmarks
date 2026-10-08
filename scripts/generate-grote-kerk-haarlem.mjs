// Genereert een vereenvoudigd, gesloten 3D-model van de Grote of Sint-Bavokerk
// in Haarlem: de kruisbasiliek in Brabantse gotiek met het hoge schip en koor
// onder één zadeldak dat over de veelhoekige koorsluiting afschildt, de
// zijbeuken en de kooromgang onder lessenaarsdaken (rond de koorsluiting vijf
// vlakke dakvlakken met hoekkepers), het transept met topgevels, de kapellen
// met dwarse zadeldaken en tentdaken langs het koor en het schip, en
// de houten, met lood beklede vieringtoren: de vierkante voet met de uurwerken,
// drie achtkantige geledingen die steeds smaller worden, de lantaarn met de
// kroon en de spits. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-grote-kerk-haarlem.mjs              # 1:1000 (standaard)
//   node scripts/generate-grote-kerk-haarlem.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alles staat recht op of loopt schuin
// omhoog, en elke geleding van de vieringtoren is smaller dan de vorige.
//
// Assenstelsel: oorsprong op RD (103933, 488399,2), op de viering onder de
// toren, op het maaiveld aan de zuidkant (NAP +1,5 m), Z omhoog. +X loopt langs
// de as van de kerk van de westgevel aan de Grote Markt naar het koor in het
// oosten (RD-richting 2,2 graden), +Y naar het noorden.
//
// Bronnen: BAG-pand 0392100000065734 (contour); AHN DSM/DTM 0,5 m (PDOK WCS) in
// een stelsel langs de as: dwarsprofielen van schip, zijbeuken, transept, koor
// en kooromgang (75e percentiel per meter; vlakken gefit op de zijbeuken en
// de kooromgang: helling 0,95 tot 1,08, langs de as vlak op 0,5 m na, dus geen
// dwarse zadeldaken), de kapellen, de omhullende per
// hoogte van de vieringtoren (kroon NAP +70,8 m) en het maaiveld; Wikipedia
// (vieringtoren 78 m, 1520); PDOK luchtfoto. Geschat: de spits boven de kroon,
// de achtkantige geledingen tussen de AHN-stappen en de kapeldaken aan de
// zuidkant van het schip; pinakels, hoektorentjes en steunberen zijn
// weggelaten.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-haarlem");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 1,5 m) ----------
const ORIGIN = [103933, 488399.2];
const ANGLE = (2.2 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 1.5;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour (lokaal, vereenvoudigd tot 0,3 m).
const OUTLINE = [
  [-51.7, 8.6], [-51.7, 6.3], [-49.5, 6.2], [-49.4, 4.9], [-47.9, 3.7], [-47.9, 1.2], [-49.5, 0.2], [-49.4, -0.8],
  [-48.0, -1.9], [-48.0, -4.4], [-49.5, -5.5], [-49.3, -6.8], [-51.6, -6.9], [-51.6, -9.2], [-49.4, -9.2],
  [-49.5, -10.3], [-47.7, -10.4], [-47.5, -16.3], [-48.3, -16.4], [-48.2, -17.5], [-47.1, -17.6], [-47.1, -18.7],
  [-46.3, -18.6], [-46.2, -17.7], [-41.6, -17.9], [-41.3, -19.1], [-39.8, -19.0], [-39.7, -17.8], [-36.9, -17.9],
  [-37.0, -20.9], [-34.0, -20.9], [-34.0, -21.2], [-33.1, -21.3], [-33.1, -22.1], [-31.4, -22.4], [-31.3, -21.2],
  [-25.9, -21.3], [-25.9, -21.7], [-24.2, -21.6], [-11.5, -24.0], [-11.5, -23.1], [-9.9, -23.2], [-10.0, -25.6],
  [-9.6, -25.8], [-4.8, -25.8], [-4.8, -27.3], [-3.5, -27.4], [-3.5, -25.8], [-1.8, -25.8], [-1.6, -30.0],
  [1.8, -30.1], [1.9, -29.1], [2.2, -29.1], [2.1, -25.9], [22.9, -26.0], [22.8, -24.8], [21.5, -24.4],
  [21.8, -17.3], [51.9, -16.7], [52.2, -17.6], [47.9, -28.5], [47.5, -28.3], [47.2, -29.3], [47.4, -29.8],
  [48.1, -29.6], [49.5, -30.6], [49.7, -30.3], [52.4, -31.3], [52.2, -31.7], [52.8, -31.9], [52.9, -31.5],
  [54.4, -32.6], [54.9, -32.3], [54.7, -31.7], [55.8, -28.7], [56.3, -28.8], [56.4, -28.3], [56.1, -28.1],
  [57.0, -25.6], [57.3, -25.7], [58.2, -22.2], [58.6, -22.4], [59.5, -18.9], [60.0, -18.5], [59.7, -18.3],
  [60.7, -15.6], [61.2, -15.3], [60.8, -14.6], [62.1, -10.2], [63.3, -8.7], [64.4, -9.1], [65.1, -10.1],
  [65.6, -9.8], [65.4, -9.3], [66.7, -6.0], [67.2, -5.8], [66.9, -4.9], [66.4, -5.2], [64.6, -4.6], [65.2, -3.0],
  [63.7, -2.8], [63.8, 2.0], [65.2, 2.2], [64.9, 3.5], [63.5, 3.2], [62.0, 7.8], [63.1, 8.5], [62.6, 9.6],
  [61.2, 8.9], [58.2, 12.5], [59.1, 13.6], [58.1, 14.4], [57.2, 13.3], [53.0, 15.7], [53.5, 17.0], [52.4, 17.4],
  [52.0, 16.1], [47.0, 16.7], [47.0, 18.1], [45.9, 18.1], [45.9, 16.9], [40.7, 17.0], [40.7, 18.2], [39.4, 18.2],
  [39.4, 16.9], [34.4, 16.9], [34.4, 18.3], [33.1, 18.3], [33.1, 17.1], [29.8, 17.0], [29.9, 18.9], [27.5, 19.0],
  [27.5, 22.3], [28.5, 23.2], [27.8, 23.8], [27.1, 23.1], [22.7, 23.1], [22.8, 25.0], [21.7, 25.0], [21.6, 26.2],
  [20.3, 26.6], [20.3, 25.0], [15.2, 25.0], [15.2, 26.6], [13.8, 26.6], [13.8, 25.0], [8.7, 25.1], [8.6, 26.6],
  [7.3, 26.6], [7.3, 25.0], [-3.5, 25.1], [-3.5, 26.6], [-5.1, 26.7], [-5.1, 25.1], [-4.6, 25.1], [-5.0, 19.9],
  [-5.7, 19.7], [-5.8, 18.4], [-5.1, 17.1], [-10.9, 17.3], [-11.0, 17.8], [-12.1, 17.8], [-12.1, 17.0],
  [-18.0, 17.1], [-18.0, 17.8], [-18.9, 17.8], [-19.0, 17.1], [-25.0, 17.0], [-25.0, 17.8], [-26.0, 17.7],
  [-26.0, 17.0], [-31.8, 16.9], [-31.9, 17.7], [-32.9, 17.7], [-33.0, 16.8], [-38.8, 17.1], [-38.8, 17.9],
  [-39.9, 17.8], [-40.0, 17.1], [-46.2, 17.1], [-46.5, 17.9], [-47.3, 17.9], [-47.7, 16.6], [-47.7, 9.9],
  [-49.6, 9.9], [-49.5, 8.6]
];
// Lage aanbouwen en portalen binnen de contour.
const LOW = 7.0;
// Koorsluiting: halve tienhoek rond dit middelpunt.
const APSE_CENTRE = [45.5, -0.5];
const apse = (r) =>
  [-90, -54, -18, 18, 54, 90].map((deg) => [
    APSE_CENTRE[0] + r * Math.cos((deg * Math.PI) / 180),
    APSE_CENTRE[1] + r * Math.sin((deg * Math.PI) / 180),
  ]);
const WEST = -51.7;
// Schip en koor: muren tot de goot, zadeldak, afgeschilde koorsluiting.
const NAVE = { halfWidth: 9.0, eave: 30.8, ridge: 43.2 };
// Zijbeuken en kooromgang: lessenaarsdak van de hoge muur (9 m uit de as) naar
// de buitenmuur, in twee delen gescheiden op de viering (x = 1). Rond de
// koorsluiting loopt het dak in vijf vlakke vlakken evenwijdig aan de zijden
// van de halve tienhoek, met hoekkepers ertussen (AHN: helling 1,0, geen
// dwarse zadeldaken). `depth` is de diepte tot voorbij de BAG-contour; die
// snijdt de buitenmuur af.
const AISLES = {
  split: 1,
  depth: 9.6,
  nave: { inner: 22.3, slope: 0.955 },
  choir: { inner: 23.35, slope: 1.08, shift: 1.0 },
};
const TRANSEPT = { x: [-5.5, 7.9], y: [-25.6, 24.6], eave: 31.5, ridge: 43.1 };
// Twee kapellen langs de noordkant van het koor onder een tentdak
// [x0, x1, y0, y1 van het dak, goot, top].
const PYRAMIDS = [
  [7.9, 14.3, 17.4, 24.2, 15.0, 20.6],
  [14.3, 20.8, 17.4, 24.2, 15.0, 19.8],
];
// Kapellen met dwarse zadeldaken [x0, x1, y0, y1, goot, nok] (nok langs Y).
const CHAPELS = [
  // langs de noordkant van het koor
  [20.8, 27.5, 10, 30, 13.5, 17.0],
  // langs de zuidkant van het koor
  [7.9, 14.0, -30, -10, 14.0, 19.1],
  [14.0, 20.2, -30, -10, 14.0, 19.2],
  [20.2, 23.0, -30, -10, 14.0, 16.3],
  // langs de zuidkant van het schip
  [-20.0, -11.0, -30, -10, 9.0, 15.1],
  [-34.5, -26.0, -30, -10, 15.5, 22.2],
];
// Aanbouw aan de zuidoostkant van de kooromgang.
const ANNEX = { x: [44.0, 62.0], y: [-36.0, -16.0], top: 11.0 };
// Vieringtoren: vierkante voet [zijde, top], achtkantige geledingen [straal
// van de omgeschreven cirkel onder en boven, van, tot] en de spits.
const TOWER = {
  centre: [1.0, -0.4],
  base: [7.6, 49.0],
  stages: [
    [3.8, 3.4, 49.0, 55.0],
    [3.0, 2.6, 55.0, 60.5],
    [2.2, 1.9, 60.5, 65.5],
    [1.5, 1.3, 65.5, 69.0],
  ],
  spire: { radius: 1.0, from: 69.0, tip: 80.0 },
};
// Maaiveld (lokaal) rondom; het laagste punt aan de zuidkant.
const GROUND_SAMPLES = [[-58, 0], [0, 31], [72, 0], [0, -33]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
const outline = prism(OUTLINE, BASE - 1, 200);
const clip = (solid) => Manifold.intersection(outline, solid);
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Langgerekte plattegrond, halve breedte w rond de as, met de koorsluiting
// (straal r van de omgeschreven cirkel).
const plan = (w, r = w, shift = 0) => [
  [WEST, APSE_CENTRE[1] - w],
  [APSE_CENTRE[0] + shift, APSE_CENTRE[1] - w],
  ...apse(r).slice(1, -1).map(([x, y]) => [x + shift, y]),
  [APSE_CENTRE[0] + shift, APSE_CENTRE[1] + w],
  [WEST, APSE_CENTRE[1] + w],
];
// Zadeldak met topgevels; nok langs Y in het midden van x.
const gableY = ([x0, x1], [y0, y1], eave, ridge) =>
  Manifold.hull(
    [y0, y1].flatMap((y) => [
      [x0, y, BASE], [x1, y, BASE],
      [x0, y, NAP(eave)], [x1, y, NAP(eave)],
      [(x0 + x1) / 2, y, NAP(ridge)],
    ]),
  );
// Veelhoek (tegen de klok in) evenwijdig naar buiten verschoven over d, met
// verstekhoeken: elke zijde blijft evenwijdig, zodat de romp tussen de
// veelhoek en zijn verschuiving uit vlakke vlakken bestaat.
const offset = (pts, d) => {
  const p = ccw(pts);
  const n = p.length;
  const lines = p.map(([x0, y0], i) => {
    const [x1, y1] = p[(i + 1) % n];
    const len = Math.hypot(x1 - x0, y1 - y0);
    const nx = (y1 - y0) / len;
    const ny = -(x1 - x0) / len;
    return { px: x0 + nx * d, py: y0 + ny * d, dx: (x1 - x0) / len, dy: (y1 - y0) / len };
  });
  return lines.map((b, i) => {
    const a = lines[(i - 1 + n) % n];
    const det = a.dx * b.dy - a.dy * b.dx;
    const t = ((b.px - a.px) * b.dy - (b.py - a.py) * b.dx) / det;
    return [a.px + a.dx * t, a.py + a.dy * t];
  });
};
// Lessenaarsdak rond de hoge muur van schip en koor: van `inner` tegen de
// hoge muur aflopend met `slope`, beperkt tot x in [x0, x1]. `shift` schuift de
// halve tienhoek waarop het dak aansluit naar het oosten (de kooromgang is
// daar dieper dan langs de zijkanten). Het dak loopt 3 m door tot binnen in
// schip en koor, zodat het ook daar op de hoge muur aansluit.
const leanTo = ([x0, x1], { inner, slope, shift = 0 }) => {
  const wall = plan(NAVE.halfWidth, NAVE.halfWidth, shift);
  const outer = offset(wall, AISLES.depth);
  return Manifold.intersection(
    Manifold.hull([
      ...at(outer, BASE),
      ...at(outer, NAP(inner - slope * AISLES.depth)),
      ...at(offset(wall, -3), NAP(inner + slope * 3)),
    ]),
    box([x0, x1], [-100, 100], BASE, 200),
  );
};
// Tentdak: blok tot de goot over [y0 - 8, y1 + 1] en het dak met de top
// midden boven het dakvlak.
const pyramid = ([x0, x1, y0, y1, eave, top]) =>
  Manifold.union([
    box([x0, x1], [y0 - 8, y1 + 1], BASE, NAP(eave)),
    Manifold.hull([
      ...at([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], NAP(eave) - 0.01),
      [(x0 + x1) / 2, (y0 + y1) / 2, NAP(top)],
    ]),
  ]);
const octagon = ([cx, cy], r, z) =>
  Array.from({ length: 8 }, (_, k) => {
    const a = ((k * 45 + 22.5) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z];
  });

// ---------- opbouw ----------
const { centre } = TOWER;
const half = TOWER.base[0] / 2;
const parts = [
  // lage aanbouwen en portalen
  clip(box([-100, 100], [-100, 100], BASE, NAP(LOW))),
  // aanbouw aan de zuidoostkant
  clip(box(ANNEX.x, ANNEX.y, BASE, NAP(ANNEX.top))),
  // zijbeuken van het schip, en zijbeuken van het koor met de kooromgang,
  // onder lessenaarsdaken
  clip(leanTo([-100, AISLES.split], AISLES.nave)),
  clip(leanTo([AISLES.split, 100], AISLES.choir)),
  // kapellen
  ...PYRAMIDS.map((chapel) => clip(pyramid(chapel))),
  ...CHAPELS.map(([x0, x1, y0, y1, eave, ridge]) => clip(gableY([x0, x1], [y0, y1], eave, ridge))),
  // schip en koor
  clip(
    Manifold.hull([
      ...at(plan(NAVE.halfWidth), BASE),
      ...at(plan(NAVE.halfWidth), NAP(NAVE.eave)),
      [WEST, APSE_CENTRE[1], NAP(NAVE.ridge)],
      [APSE_CENTRE[0], APSE_CENTRE[1], NAP(NAVE.ridge)],
    ]),
  ),
  // transept met topgevels
  clip(gableY(TRANSEPT.x, TRANSEPT.y, TRANSEPT.eave, TRANSEPT.ridge)),
  // vieringtoren: vierkante voet, achtkantige geledingen en de spits
  box([centre[0] - half, centre[0] + half], [centre[1] - half, centre[1] + half], BASE, NAP(TOWER.base[1])),
  ...TOWER.stages.map(([r0, r1, z0, z1]) =>
    Manifold.hull([...octagon(centre, r0, NAP(z0) - 0.01), ...octagon(centre, r1, NAP(z1))]),
  ),
  Manifold.hull([
    ...octagon(centre, TOWER.spire.radius, NAP(TOWER.spire.from) - 0.01),
    [centre[0], centre[1], NAP(TOWER.spire.tip)],
  ]),
];
const church = Manifold.union(parts);
const nodes = [["building:grote-kerk-haarlem", church]];

// ---------- controles ----------
if (church.status() !== "NoError") throw new Error(church.status());
{
  const mesh = church.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nz = e1[0] * e2[1] - e1[1] * e2[0];
    if (nz < -1e-6) area += -nz / 2;
  }
  console.log(`ondervlak boven de onderkant: ${area.toFixed(3)} m2`);
  if (area > 0.01) throw new Error("overhang");
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
    // Vertexnormalen met scherpe randen boven 10 graden: het model heeft geen
    // gebogen vlakken, en de dakvlakken rond de koorsluiting verschillen
    // onderling maar 13 tot 22 graden (kooromgang) en 29 graden (koor); met 40
    // graden werden ze glad gearceerd en oogde de koorsluiting rond. getMesh()
    // levert de normalen als properties 3..5, al meegedraaid met de
    // transformaties.
    const mesh = solid.calculateNormals(0, 10).getMesh();
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
const glbFile = path.join(outDir, "grote-kerk-haarlem.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-grote-kerk-haarlem.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `grote-kerk-haarlem-1-${scale}.stl`);
const printSolid = church.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Grote Kerk Haarlem 1:${scale} mm Z-up`);
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
  path.join(outDir, "grote-kerk-haarlem.json"),
  JSON.stringify(
    {
      name: "Grote of Sint-Bavokerk",
      file: "grote-kerk-haarlem.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +1,5 tot +2,5 m): de Grote Markt, de
      // straat ten noorden van het transept, de Oude Groenmarkt en de
      // straat langs de zuidkant.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0392100000065734"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (103933, 488399,2), op de viering onder de toren, op het maaiveld aan de zuidkant (NAP +1,5 m), +X langs de as van de westgevel aan de Grote Markt naar het koor in het oosten (RD-richting 2,2 graden) en +Y naar het noorden. Eén node building: lage aanbouwen (NAP +7 m), zijbeuken en kooromgang onder lessenaarsdaken (van +22,3 tot +24,4 m tegen de hoge muur naar circa +14,3 m aan de buitenmuur, rond de koorsluiting vijf vlakke dakvlakken met hoekkepers), kapellen met dwarse zadeldaken en twee tentdaken langs koor en schip (nok en top +15 tot +22 m), schip en koor onder één zadeldak (goot +30,8 m, nok +43,2 m) met afgeschilde koorsluiting, het transept met topgevels (nok +43,1 m) en de vieringtoren: vierkante voet tot +49 m, drie achtkantige geledingen en de lantaarn met kroon tot +69 m en de spits tot +80 m. Alles staat recht op of loopt schuin omhoog, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0392100000065734. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`grote-kerk-haarlem-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        naveRidgeNapM: NAVE.ridge,
        naveEaveNapM: NAVE.eave,
        transeptRidgeNapM: TRANSEPT.ridge,
        towerBaseNapM: TOWER.base[1],
        towerCrownNapM: TOWER.stages.at(-1)[3],
        towerTipNapM: TOWER.spire.tip,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Grote_of_Sint-Bavokerk",
        "PDOK BAG pand 0392100000065734 (contour), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dwarsprofielen van schip, zijbeuken, transept, koor en kooromgang, vlakfit van de lessenaarsdaken, kapellen, omhullende van de vieringtoren en maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "https://commons.wikimedia.org/wiki/File:Grote-Kerk-Haarlem.jpg",
        "https://commons.wikimedia.org/wiki/File:St._Bavochurch_Haarlem_steeple.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van de Munttoren op het
// Muntplein in Amsterdam: de ronde bakstenen toren van de Regulierspoort
// (1480-1487) met het vierkante aanbouwsel aan de noordwestkant en het
// portaaltje aan de zuidoostkant, de achtkante bovenbouw van Hendrick de
// Keyser (1619-1620) met de gootlijst, de uurwerkgeleding met vier
// wijzerplaten, de open lantaarn met het carillon, de kroon, de bol en de
// windvaan, en het aangebouwde wachthuis van Willem Springer (1885-1887) met
// de lagere tussenvleugel en de voetgangersdoorgang van 1938-1939 naast de
// toren. Alle maten in het script zijn meters op ware grootte. Uitvoer: een
// GLB in meters (Y omhoog, één node per onderdeel met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-munttoren.mjs              # 1:1000 (standaard)
//   node scripts/generate-munttoren.mjs --scale 500
//
// Printbaar op 1:1000 zonder steun: de muren en de toren staan recht op, de
// geledingen springen naar boven terug, de daken lopen onder 50 graden
// omhoog, de nissen en de doorgang hebben een spitse top en de wijzerplaten en
// de kroon lopen onder meer dan 45 graden uit. Alleen de band boven het
// metselwerk, de gootlijsten van de achtkante bovenbouw en de lantaarn en de
// goten van het wachthuis kragen 0,15 tot 0,25 m vlak uit; die vlakke
// onderkanten laten de export beide onderdelen als gesloten solid opvullen
// (zie de controle onderaan).
//
// Assenstelsel: oorsprong op RD (121354,79, 486689,10), het hart van de ronde
// toren (cirkel door de BAG-contour, ook het hoogste DSM-punt), op het
// maaiveld van het Muntplein (NAP +2,2 m), Z omhoog. +X loopt langs het
// wachthuis naar het oosten (RD-richting 2,0 graden vanaf het oosten,
// evenwijdig aan de lange gevels), dus het wachthuis ligt aan -X; +Y wijst
// naar het noorden, het Muntplein. Aan -Y ligt de Amstel (onder het
// wachthuis) en de brug (onder de toren).
//
// Bronnen: BAG-panden 0363100012168045 (de toren) en 0363100012253928 (het
// wachthuis met de tussenvleugel); BGT pand en wegdeel (het voetpad door de
// tussenvleugel); AHN DSM/DTM 0,5 m (PDOK WCS): de hoogtes van het metselwerk,
// de bovenbouw, de lantaarn, de kroon, de daken en het maaiveld; Wikipedia
// (35 m hoog) en het Rijksmonumentenregister (3729); foto's op Wikimedia
// Commons (vanaf het Muntplein en de Vijzelstraat); PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "munttoren");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = 0 op NAP +2,2 m) ----------
const ORIGIN = [121354.79, 486689.1];
const AXIS_DEG = 2.0;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 2.2;
// Alle onderdelen beginnen 2,5 m onder het maaiveld (NAP -0,3 m), onder het
// water van de Amstel (circa NAP -0,4 m) aan de zuidgevel van het wachthuis
// en onder de straat aan de Singelkant (NAP +1,2 m).
const BASE = -2.5;

// Ronde toren: straal 3,0 m (BAG-boog 2,8 m, AHN-omhullende 3,0 m),
// metselwerk tot 14,4 m, de band met de gootlijst tot 14,9 m.
const BRICK = { r0: 3.0, r1: 2.9, z1: 14.4, band: 3.1, bandZ: 14.65, top: 14.9 };
// Aanbouwsel aan de noordwestkant (BAG-contour buiten de cirkel) tot 9,0 m
// met een dakje tot 11,5 m; portaaltje aan de zuidoostkant tot 3,0 m met een
// tentdak tot 4,2 m (AHN-DSM NAP +6,3 m).
const ANNEX = [[-3.49, -0.38], [-3.39, 3.5], [-3.03, 3.54], [-2.59, 4.06], [-1.17, 2.94], [0.75, 2.98], [2.85, 0.84]];
const ANNEX_Z = { eave: 9.0, top: 11.5 };
const PORCH = [[2.5, -1.24], [3.76, -2.43], [4.64, -1.59], [2.85, 0.26]];
const PORCH_Z = { eave: 3.0, top: 4.2 };
// Achtkante bovenbouw (apothema), gootlijst 0,15 m vlak uitkragend op
// 20,15 m (AHN-DSM NAP +22,5 m), daarboven de ingesnoerde kap.
const OCTAGON = { a0: 2.65, a1: 2.55, z1: 19.9, cornice: 2.8, corniceZ0: 20.15, corniceZ1: 20.4, capTop: 21.5 };
// Uurwerkgeleding met vier wijzerplaten van 2 m doorsnede.
const CLOCK = { a: 2.0, z1: 24.6, dialZ: 23.0, dialR: 1.0, dialFront: 0.7, dialDepth: 0.25 };
// Open lantaarn (in het model dicht met spitsboognissen), gootlijst 0,2 m
// uitkragend op 28,25 m, bovenkant 28,5 m (AHN-DSM NAP +30,7 m).
const LANTERN = { a: 1.8, z1: 28.0, cornice: 2.0, corniceZ0: 28.25, corniceZ1: 28.5, capTop: 29.4, capA: 0.9 };
// Kroon, bol en windvaan; het hoogste DSM-punt is NAP +37,4 m (35,2 m).
const CROWN = { r0: 0.9, r1: 1.15, z0: 29.4, z1: 30.2, z2: 31.3, neck: 0.3, z3: 32.5 };
const TOP = { ball: 0.4, ballZ0: 32.7, ballZ1: 33.1, spireR: 0.15, spireZ: 33.45, height: 35.2 };

// Wachthuis (BGT/BAG-contour): muren tot de goot op 8,3 m (AHN-DSM NAP
// +10,5 m), zadeldak met de nok op 13,2 m (NAP +15,4 m) op y = 0,2, goten
// 0,25 m overstekend aan de noord- en zuidgevel.
const MAIN = { u: [-23.9, -9.72], v: [-3.78, 3.9], eave: 8.3, ridge: 13.2, ridgeV: 0.2 };
// Tussenvleugel naar de toren: goot 6,8 m, nok 9,4 m (NAP +9,0 en +11,6 m)
// op y = 1,4; de zuidkant ligt open aan het terras boven de Amstel.
const LINK = { u: [-9.85, -2.95], v: [-0.71, 3.61], eave: 6.8, ridge: 9.4, ridgeV: 1.4 };
const EAVE_OVERHANG = 0.25;
// Voetgangersdoorgang (1938-1939) dwars door de tussenvleugel, van het
// Muntplein naar het terras: 3,2 m breed met een spitse top op 3,6 m.
const PASSAGE = { u: -6.35, w: 3.2, apex: 3.6 };
// Maaiveld (AHN-DTM NAP +2,1 tot +2,4 m) ten noorden, oosten en zuiden van
// de toren; niet aan de Amstel en niet aan de lagere Singelkant.
const GROUND_SAMPLES = [[0, 6], [6, 0], [0, -6]];

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
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Regelmatige achthoek met vlakken op de assen; apothema a0 onderaan, a1 bovenaan.
const octagonFrustum = (z0, z1, a0, a1) => {
  const k = 1 / Math.cos(Math.PI / 8);
  return Manifold.cylinder(z1 - z0, a0 * k, a1 * k, 8, false).rotate([0, 0, 22.5]).translate([0, 0, z0]);
};
// Boog met spitse top als polygoon [breedterichting, hoogte] van z0 tot de
// top op `apex`: rechte zijden, een ronde boog met straal w/2 tot 40 graden
// boven de aanzet en dan rechte stukken onder 50 graden naar de top, zodat
// geen deel van het gewelf vlakker dan 50 graden hangt.
function pointedProfile(w, z0, apex, centre = 0) {
  const r = w / 2;
  const kink = (40 * Math.PI) / 180;
  const rise = r * Math.cos(kink) * Math.tan((50 * Math.PI) / 180);
  const spring = apex - rise - r * Math.sin(kink);
  const pts = [[centre - r, z0], [centre + r, z0]];
  for (let k = 0; k <= 8; k++) {
    const a = (kink * k) / 8;
    pts.push([centre + r * Math.cos(a), spring + r * Math.sin(a)]);
  }
  pts.push([centre, apex]);
  for (let k = 8; k >= 0; k--) {
    const a = (kink * k) / 8;
    pts.push([centre - r * Math.cos(a), spring + r * Math.sin(a)]);
  }
  return { pts, spring };
}
// Spitsboognis in het vlak van een achthoek met apothema `apothem`: `depth`
// diep, van z0 tot de top op `apex`, gedraaid naar vlak k (k * 45 graden
// vanaf +X). Extrude loopt langs Z; de rotatie zet het profiel om naar
// (x, breedte, hoogte).
const octagonNiche = (apothem, width, z0, apex, depth, k) =>
  Manifold.extrude([pointedProfile(width, z0, apex).pts], depth + 2)
    .rotate([90, 0, 90])
    .translate([apothem - depth, 0, 0])
    .rotate([0, 0, k * 45]);
// Zadeldak langs X met goten op v0 en v1 (inclusief overstek) en de nok op ridgeV.
const gableRoof = ([u0, u1], [v0, v1], eave, ridge, ridgeV) =>
  Manifold.hull([
    [u0, v0, eave], [u1, v0, eave], [u0, v1, eave], [u1, v1, eave],
    [u0, ridgeV, ridge], [u1, ridgeV, ridge],
  ]);
// Doorgang dwars door de tussenvleugel (langs Y), tot de onderkant open.
const passage = ({ u, w, apex }) => {
  const { pts: profile, spring } = pointedProfile(w, BASE - 1, apex, u);
  const pts = [];
  for (const y of [-5, 8]) for (const [px, z] of profile) pts.push([px, y, z]);
  return { solid: Manifold.hull(pts), spring };
};

// ---------- toren ----------
const brick = Manifold.union([
  Manifold.cylinder(BRICK.z1 - BASE, BRICK.r0, BRICK.r1, 48, false).translate([0, 0, BASE]),
  // Band boven het metselwerk: 0,2 m vlak uitkragend.
  Manifold.cylinder(BRICK.top - BRICK.bandZ, BRICK.band, BRICK.band, 48, false).translate([0, 0, BRICK.bandZ]),
  Manifold.cylinder(BRICK.bandZ - BRICK.z1 + 0.01, BRICK.r1, BRICK.r1, 48, false).translate([0, 0, BRICK.z1 - 0.01]),
  prism(ANNEX, BASE, ANNEX_Z.eave),
  Manifold.intersection(
    Manifold.hull([...at(ANNEX, ANNEX_Z.eave - 0.01), [-1.6, 1.6, ANNEX_Z.top], [0.2, 1.4, ANNEX_Z.top]]),
    prism(ANNEX, ANNEX_Z.eave - 0.02, ANNEX_Z.top + 1),
  ),
  prism(PORCH, BASE, PORCH_Z.eave),
  Manifold.hull([...at(PORCH, PORCH_Z.eave - 0.01), [3.57, -0.95, PORCH_Z.top]]),
]);
const octagon = Manifold.union([
  octagonFrustum(BRICK.top - 0.01, OCTAGON.z1, OCTAGON.a0, OCTAGON.a1),
  // Gootlijst: 0,2 m schuin (onder 51 graden) en 0,05 m vlak uitkragend.
  octagonFrustum(OCTAGON.z1, OCTAGON.corniceZ0, OCTAGON.a1, OCTAGON.cornice - 0.05),
  octagonFrustum(OCTAGON.corniceZ0 - 0.01, OCTAGON.corniceZ1, OCTAGON.cornice, OCTAGON.cornice),
  octagonFrustum(OCTAGON.corniceZ1 - 0.01, OCTAGON.capTop, OCTAGON.cornice, CLOCK.a),
]);
const clockStage = octagonFrustum(OCTAGON.capTop - 0.01, CLOCK.z1, CLOCK.a, CLOCK.a);
// Wijzerplaten: kegelstomp van 1,0 naar 0,7 m straal over 0,25 m, zodat de
// onderkant steiler dan 45 graden uitloopt.
const dials = Array.from({ length: 4 }, (_, k) =>
  Manifold.cylinder(CLOCK.dialDepth + 0.1, CLOCK.dialR + (0.1 * (CLOCK.dialR - CLOCK.dialFront)) / CLOCK.dialDepth, CLOCK.dialFront, 32, false)
    .rotate([0, 90, 0])
    .translate([CLOCK.a - 0.1, 0, CLOCK.dialZ])
    .rotate([0, 0, k * 90]),
);
const lantern = Manifold.union([
  octagonFrustum(CLOCK.z1 - 0.01, LANTERN.z1, LANTERN.a, LANTERN.a),
  octagonFrustum(LANTERN.z1, LANTERN.corniceZ0, LANTERN.a, LANTERN.cornice - 0.05),
  octagonFrustum(LANTERN.corniceZ0 - 0.01, LANTERN.corniceZ1, LANTERN.cornice, LANTERN.cornice),
  octagonFrustum(LANTERN.corniceZ1 - 0.01, LANTERN.capTop, LANTERN.cornice, LANTERN.capA),
]);
// Kroon, bol en windvaan als omwentelingslichaam: profiel [straal, hoogte].
const crownProfile = [
  [0, CROWN.z0 - 0.01],
  [CROWN.r0, CROWN.z0 - 0.01],
  [CROWN.r1, CROWN.z1],
  [CROWN.r1, CROWN.z2],
  [CROWN.neck, CROWN.z3],
  [TOP.ball, TOP.ballZ0],
  [TOP.ball, TOP.ballZ1],
  [TOP.spireR, TOP.spireZ],
  [0.04, TOP.height],
  [0, TOP.height],
];
const crown = Manifold.revolve([crownProfile], 32);
const nicheCuts = [];
for (let k = 0; k < 8; k++) {
  // Hoge spitsboognissen in de achtkante bovenbouw, galmgaten in de lantaarn.
  nicheCuts.push(octagonNiche(OCTAGON.a0 - 0.02, 1.3, 15.5, 19.2, 0.3, k));
  nicheCuts.push(octagonNiche(LANTERN.a, 0.9, 24.9, 27.3, 0.45, k));
}
const tower = Manifold.union([brick, octagon, clockStage, ...dials, lantern, crown]).subtract(Manifold.union(nicheCuts));

// ---------- wachthuis ----------
const mainWalls = prism(rect(MAIN.u, MAIN.v), BASE, MAIN.eave + 0.01);
const mainRoof = gableRoof(MAIN.u, [MAIN.v[0] - EAVE_OVERHANG, MAIN.v[1] + EAVE_OVERHANG], MAIN.eave, MAIN.ridge, MAIN.ridgeV);
const linkWalls = prism(rect(LINK.u, LINK.v), BASE, LINK.eave + 0.01);
// Het dak van de tussenvleugel loopt van de gevel van het wachthuis tot in de toren.
const linkRoof = gableRoof([MAIN.u[1] - 0.01, -2.0], [LINK.v[0] - EAVE_OVERHANG, LINK.v[1] + EAVE_OVERHANG], LINK.eave, LINK.ridge, LINK.ridgeV);
const passageCut = passage(PASSAGE);
const guardhouse = Manifold.union([mainWalls, mainRoof, linkWalls, linkRoof])
  .subtract(passageCut.solid)
  // Niets van het wachthuis binnen de ronde toren.
  .subtract(Manifold.cylinder(40, BRICK.r1 - 0.05, BRICK.r1 - 0.05, 48, false).translate([0, 0, BASE - 1]));

const nodes = [
  ["building:toren", tower],
  ["building:wachthuis", guardhouse],
];
const all = Manifold.union([tower, guardhouse]);

// ---------- controles ----------
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de
  // onderkant: alleen de band, de twee gootlijsten en de goten.
  const allowed = {
    "building:toren": new Set([BRICK.bandZ, OCTAGON.corniceZ0 - 0.01, LANTERN.corniceZ0 - 0.01].map((z) => z.toFixed(2))),
    "building:wachthuis": new Set([MAIN.eave, LINK.eave].map((z) => z.toFixed(2))),
  };
  for (const [name, solid] of [...nodes, ["print", all]]) {
    const ok = allowed[name] ?? new Set([...allowed["building:toren"], ...allowed["building:wachthuis"]]);
    const mesh = solid.getMesh();
    const v = mesh.vertProperties;
    const s = mesh.numProp;
    const levels = new Map();
    const where = new Map();
    for (let t = 0; t < mesh.triVerts.length; t += 3) {
      const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
      if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
      const e1 = p[1].map((c, i) => c - p[0][i]);
      const e2 = p[2].map((c, i) => c - p[0][i]);
      const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      const len = Math.hypot(...n);
      if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
      const z = Math.min(...p.map((q) => q[2])).toFixed(2);
      levels.set(z, +((levels.get(z) ?? 0) + len / 2).toFixed(3));
      if (!ok.has(z)) where.set(z, [0, 1].map((a) => +((p[0][a] + p[1][a] + p[2][a]) / 3).toFixed(2)));
    }
    console.log(`${name}: ondervlakken (z: m2)`, Object.fromEntries(levels));
    for (const [z, area] of levels) if (!ok.has(z) && area > 0.01) throw new Error(`${name}: overhang op z ${z} bij x, y ${where.get(z)}`);
    if (levels.size === 0) throw new Error(`${name}: geen uitkraging`);
    const bb = solid.boundingBox();
    if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  }
  console.log("aanzet doorgang", +passageCut.spring.toFixed(2));
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
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "munttoren.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-munttoren.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `munttoren-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Munttoren Amsterdam 1:${scale} mm Z-up`);
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

const allBox = all.boundingBox();
await writeFile(
  path.join(outDir, "munttoren.json"),
  JSON.stringify(
    {
      name: "Munttoren",
      file: "munttoren.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      // 0 in plaats van -0,3: alles begint al 2,5 m onder het maaiveld en de
      // doorgang is tot de onderkant open.
      groundOffsetMetres: 0,
      // Op het Muntplein en de brug ten noorden, oosten en zuiden van de toren
      // (NAP +2,1 tot +2,4 m); niet in de Amstel onder het wachthuis en niet
      // aan de lagere Singelkant.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0363100012168045", "NL.IMBAG.Pand.0363100012253928"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (121354,79, 486689,10), het hart van de ronde toren, op het maaiveld van het Muntplein (NAP +2,2 m), +X langs het wachthuis naar het oosten (2,0 graden vanaf het oosten) en +Y naar het noorden, het Muntplein. Node building:toren: de ronde bakstenen toren (straal 3,0 m) tot 14,4 m met de band, het aanbouwsel aan de noordwestkant en het portaaltje aan de zuidoostkant, de achtkante bovenbouw met spitsboognissen en de gootlijst op 20,4 m, de uurwerkgeleding met vier wijzerplaten, de lantaarn (dicht, met galmnissen) tot 28,5 m, de kroon, de bol en de windvaan tot 35,2 m (NAP +37,4 m). Node building:wachthuis aan -X: het wachthuis met zadeldak (goot 8,3 m, nok 13,2 m) en de tussenvleugel naar de toren (goot 6,8 m, nok 9,4 m) met de voetgangersdoorgang van 3,2 m breed. Alles begint 2,5 m onder het maaiveld; de doorgang is tot de onderkant open. Vervangt de PDOK-reconstructie van de twee BAG-panden van toren en wachthuis. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`munttoren-1-${scale}.stl`],
      realWorld: {
        lengthM: +(allBox.max[0] - allBox.min[0]).toFixed(2),
        widthM: +(allBox.max[1] - allBox.min[1]).toFixed(2),
        totalHeightM: TOP.height,
        highestPointNapM: +(TOP.height + GROUND_NAP).toFixed(2),
        towerRadiusM: BRICK.r0,
        brickTopM: BRICK.z1,
        octagonCorniceM: OCTAGON.corniceZ1,
        octagonAcrossFlatsM: OCTAGON.a0 * 2,
        clockDialDiameterM: CLOCK.dialR * 2,
        lanternTopM: LANTERN.corniceZ1,
        lanternAcrossFlatsM: LANTERN.a * 2,
        guardhouseEaveM: MAIN.eave,
        guardhouseRidgeM: MAIN.ridge,
        linkEaveM: LINK.eave,
        linkRidgeM: LINK.ridge,
        passageWidthM: PASSAGE.w,
        passageApexM: PASSAGE.apex,
        groundNapM: GROUND_NAP,
        baseM: BASE,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Munttoren_(Amsterdam)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/3729",
        "PDOK BAG panden 0363100012168045 (de toren) en 0363100012253928 (het wachthuis met de tussenvleugel), EPSG:28992",
        "PDOK BGT pand en wegdeel: het wachthuis zonder de tussenvleugel en het voetpad door de doorgang",
        "PDOK AHN DSM/DTM 0,5 m via WCS: metselwerk, bovenbouw, lantaarn, kroon, daken en maaiveld",
        "Wikimedia Commons: Amsterdam, Munttoren RM-3729-WLM.jpg, Amsterdam - Muntplein - View SW on Munttoren.jpg, Amsterdam - Vijzelstraat - View North on Munttoren.jpg",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van de Pythonbrug (brug 1998,
// officieel Hoge Brug) in Amsterdam: de rode stalen voetbrug van West 8 uit 2001
// over het Spoorwegbassin tussen de Stuurmankade op Borneo en de Panamakade op
// Sporenburg, met het golvende lengteprofiel (een lage boog boven de betonnen
// poer en een hoge boog met 9,5 m doorvaarthoogte), de trog van twee schuin
// uitwaaierende vakwerkliggers met het looppad ertussen, de poer in het water
// en de landhoofden aan beide kades. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, de constructie en het
// looppad met de BGT-attributen als eigen nodes, de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal> met een printvoet onder de
// overspanningen.
//
//   node scripts/generate-pythonbrug.mjs              # 1:1000 (standaard)
//   node scripts/generate-pythonbrug.mjs --scale 500
//
// Assenstelsel: oorsprong in het midden van de as van het BGT-dek op de
// waterspiegel van het Spoorwegbassin (NAP -0,4 m), Z omhoog. +X loopt langs de
// brug naar de Panamakade (noordnoordwest, RD-richting 99,9 graden vanaf het
// oosten), +Y dwars op de brug naar het westzuidwesten. De lage boog met de poer
// ligt aan de zuidkant (Borneo, x < 0), de hoge boog aan de noordkant.
//
// Bronnen: BGT overbruggingsdeel (dek 91,5 × 3,7 m, poer van 9,6 × 4,6 m op
// 26 m van de zuidkade, landhoofden aan beide kades); AHN DSM 0,5 m (PDOK WCS)
// voor het lengteprofiel van het looppad (NAP +1,5 tot +10,4 m), de hoogte van
// de balustraden (1,1 m boven het looppad), de breedte over de balustraden
// (4,2 m aan de kades tot 5 m in het midden) en de poer; Wikipedia voor de
// lengte (93 m), de doorvaarthoogte (9,5 m) en de constructie; Wikimedia
// Commons-foto's voor de schuine vakwerkwanden en de onderrand die naar de poer
// afbuigt.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "pythonbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in gezien vanaf +X, steeds evenveel punten). De as van de brug is in
// plattegrond recht, dus alle doorsneden staan evenwijdig.
function loftX(stations) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { x, section } of stations) for (const [y, z] of section) verts.push(x, y, z);
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < stations.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = stations.length - 1;
  for (let j = 1; j + 1 < n; j++) {
    tris.push(id(0, 0), id(0, j + 1), id(0, j));
    tris.push(id(last, 0), id(last, j), id(last, j + 1));
  }
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  return solid;
}

// ---------- hoofdmaten (boven de waterspiegel, NAP -0,4 m) ----------
const WATER_NAP = -0.4;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant van poer en landhoofden
const LENGTH = 91.47; // as van het BGT-dek, van kade tot kade
const T0 = LENGTH / 2; // t = afstand vanaf de zuidkade, x = t - T0

// Looppad in NAP-meters om de 2 m vanaf de zuidkade (t = 0 tot 90), mediaan
// van het AHN-DSM over 2 × 2 m rond de as; op t = 91,47 de noordkade.
const DECK_NAP = [
  1.55, 2.45, 3.07, 3.69, 4.18, 4.48, 4.67, 4.77, 4.76, 4.71, 4.7, 4.76, 4.83, 4.92, 5.22, 5.78,
  6.15, 6.64, 7.13, 7.77, 8.47, 9.05, 9.65, 9.93, 10.2, 10.34, 10.39, 10.36, 10.26, 10.14, 9.96,
  9.73, 9.49, 9.16, 8.69, 8.25, 7.76, 7.31, 6.8, 6.28, 5.73, 4.94, 4.26, 3.62, 2.91, 2.12,
];
const deckKnots = [...DECK_NAP.map((h, i) => [2 * i, h]), [LENGTH, 1.5]];
// Catmull-Rom door de knopen, zodat het profiel vloeiend golft.
function deckZ(t) {
  const k = deckKnots;
  if (t <= 0) return Z(Math.max(1.5, k[0][1] + (t * (k[1][1] - k[0][1])) / 2));
  if (t >= LENGTH) return Z(1.5);
  let i = 0;
  while (i + 2 < k.length && k[i + 1][0] <= t) i++;
  const p0 = k[Math.max(0, i - 1)];
  const p1 = k[i];
  const p2 = k[i + 1];
  const p3 = k[Math.min(k.length - 1, i + 2)];
  const s = (t - p1[0]) / (p2[0] - p1[0]);
  const m1 = ((p2[1] - p0[1]) / (p2[0] - p0[0])) * (p2[0] - p1[0]);
  const m2 = ((p3[1] - p1[1]) / (p3[0] - p1[0])) * (p2[0] - p1[0]);
  const h =
    (2 * s ** 3 - 3 * s ** 2 + 1) * p1[1] +
    (s ** 3 - 2 * s ** 2 + s) * m1 +
    (-2 * s ** 3 + 3 * s ** 2) * p2[1] +
    (s ** 3 - s ** 2) * m2;
  return Z(h);
}

// Trog: twee vakwerkliggers die naar boven 0,6 m uitwaaieren, met het looppad
// ertussen. Breedte over de balustraden 4,2 m aan de kades en 5 m in het
// midden (AHN), balustrade 1,1 m boven het looppad, onderrand 1,3 m onder het
// looppad (doorvaarthoogte 9,5 m onder de top op NAP +10,4 m). Het vakwerk is
// op 1:1000 niet te printen en wordt een dichte wand van 0,9 m (boven) tot
// 1,1 m (op het looppad); de lantaarns ('vogels') zijn weggelaten.
const TROUGH = { rail: 1.1, depth: 1.3, lean: 0.6, wallTop: 0.9, wallFoot: 1.1 };
const halfWidth = (t) => {
  const s = Math.sin((Math.PI * Math.min(Math.max(t, 0), LENGTH)) / LENGTH);
  return 2.1 + 0.4 * Math.sqrt(s);
};
// Poer (BGT): ovaal van 9,6 × 4,6 m dwars op de brug, 26,0 m van de zuidkade,
// bovenkant net boven het water (AHN NAP +0,0 tot +0,2 m).
const PIER = { t: 26.0, halfLength: 4.8, halfWidth: 2.3, top: Z(0.2) };
// Landhoofden (BGT) aan de kades, bovenkant net onder het kadeniveau
// (NAP +1,45 m), zodat het PDOK-maaiveld erover ligt.
const ABUTMENTS = [
  { from: -1.0, to: 2.9, halfWidth: 3.0 },
  { from: 88.4, to: 92.5, halfWidth: 3.3 },
];
const ABUTMENT_TOP = Z(1.35);
// De onderrand buigt bij de poer en de landhoofden af tot op het beton,
// zoals op de foto's (parabool, 45 graden op 4 m van het hart).
const bottomZ = (t) =>
  Math.min(
    deckZ(t) - TROUGH.depth,
    PIER.top - 0.1 + 0.125 * (t - PIER.t) ** 2,
    ABUTMENT_TOP + 0.125 * (t - 1.0) ** 2,
    ABUTMENT_TOP + 0.125 * (t - 90.5) ** 2,
  );

// Stations om de 0,5 m, van 1 m achter de zuidkade tot 0,5 m achter de noordkade.
const ts = [];
for (let t = -1; t < LENGTH + 0.5; t += 0.5) ts.push(+t.toFixed(3));
ts.push(+(LENGTH + 0.5).toFixed(3));
const geometry = ts.map((t) => {
  const zd = deckZ(t);
  const zt = zd + TROUGH.rail;
  const zb = Math.min(bottomZ(t), zd - 0.6);
  const hw = halfWidth(t);
  const bw = hw - TROUGH.lean;
  return { t, x: t - T0, zd, zt, zb, hw, bw };
});
// Bodem van de trog: van de onderrand tot het looppad, net binnen de wanden.
const slab = loftX(
  geometry.map(({ x, zd, zt, zb, hw, bw }) => {
    const outerAt = (z) => bw + ((hw - bw) * (z - zb)) / (zt - zb) - 0.05;
    return { x, section: [[-bw + 0.05, zb], [bw - 0.05, zb], [outerAt(zd), zd], [-outerAt(zd), zd]] };
  }),
);
// Wanden (vakwerkliggers met balustrade), convex in vijf punten.
const wallSection = ({ zd, zt, zb, hw, bw }, side) => {
  const pts = [
    [bw - 0.25, zb],
    [bw, zb],
    [hw, zt],
    [hw - TROUGH.wallTop, zt],
    [hw - TROUGH.wallFoot, zd],
  ];
  // Spiegelen in y keert de omloopzin om; draai de volgorde dan terug.
  return side > 0 ? pts : pts.map(([y, z]) => [-y, z]).reverse();
};
const wall = (side) => loftX(geometry.map((g) => ({ x: g.x, section: wallSection(g, side) })));
const trough = union([slab, wall(1), wall(-1)]);

const pierSolid = Manifold.hull([
  Manifold.cylinder(PIER.top - BASE, PIER.halfWidth, PIER.halfWidth, 48, false).translate([
    PIER.t - T0,
    -(PIER.halfLength - PIER.halfWidth),
    BASE,
  ]),
  Manifold.cylinder(PIER.top - BASE, PIER.halfWidth, PIER.halfWidth, 48, false).translate([
    PIER.t - T0,
    PIER.halfLength - PIER.halfWidth,
    BASE,
  ]),
]);
const abutments = ABUTMENTS.map(({ from, to, halfWidth: h }) =>
  boxFromTo(from - T0, to - T0, -h, h, BASE, ABUTMENT_TOP),
);
const bridge = union([trough, pierSolid, ...abutments]);

// ---------- printvoet (alleen in de STL) ----------
// De overspanningen hangen vrij boven het water. Net als de overhangopvulling
// van de export (lib/server/overhang-support.ts) krijgt de STL daarom onder de
// onderrand een wig van 50 graden die uitloopt in een scherm van 0,9 m tot de
// onderplaat.
const SCREEN = 0.45;
const printFoot = loftX(
  geometry.map(({ x, zb, bw }) => {
    const zs = Math.max(zb + 0.02 - 1.2 * (bw + 0.03 - SCREEN), BASE + 0.05);
    return {
      x,
      section: [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [bw + 0.03, zb + 0.02], [-bw - 0.03, zb + 0.02], [-SCREEN, zs]],
    };
  }),
);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderrand van de trog, in de printversie geen enkele.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    found.push(p);
  }
  return { area, found };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  const { area, found } = overhangs(bridge);
  for (const p of found) {
    // Elk overhangend vlak hoort bij de onderrand van de trog (|y| <= bw).
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const g = geometry.reduce((a, b) => (Math.abs(b.x - xMid) < Math.abs(a.x - xMid) ? b : a));
    if (Math.abs(zMid - g.zb) > 0.3 || Math.max(...p.map((q) => Math.abs(q[1]))) > g.bw + 0.05) {
      throw new Error(`overhang buiten de onderrand op x ${xMid.toFixed(2)}, z ${zMid.toFixed(2)}`);
    }
  }
  console.log("onderrand van de trog (m2):", Math.round(area));
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2));
  if (print.area > 0.5) throw new Error("printversie heeft overhang");
}

// ---------- looppad als eigen onderdeel ----------
// De bovenste 0,5 m van het looppad tussen de wanden is een eigen node met de
// attributen van het BGT-wegdeel op de brug (glTF `extras.attributes`), zodat
// de kleurregels van een thema er net zo op werken als op de PDOK-wegdelen
// ernaast. De BGT heeft op het dek één actueel wegdeel: G0363.ea9911fa
// (voetpad op trap, gesloten verharding), van kade tot kade; contour in lokale
// coördinaten, vereenvoudigd tot 5 cm. Pas na het printmodel gebouwd, zodat de
// STL ongewijzigd blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const WALKWAY_ATTRIBUTES = { bgt_functie: "voetpad op trap", bgt_fysiekvoorkomen: "gesloten verharding" };
const WALKWAY = [
  [7.98, -1.73], [19.09, -1.81], [45.74, -1.83], [45.74, 1.87], [20.55, 1.8], [5.95, 1.78],
  [-5.43, 2.01], [-32.24, 1.85], [-45.8, 1.85], [-45.74, -1.89], [-35.97, -1.83], [-8.63, -1.89],
];
const ccw = (poly) => {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % poly.length];
    a += x0 * y1 - x1 * y0;
  }
  return a > 0 ? poly : [...poly].reverse();
};
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Convexe doorsnede (tegen de klok in) d naar buiten verschoven.
function offsetConvex(pts, d) {
  const n = pts.length;
  const normals = pts.map((p, i) => {
    const q = pts[(i + 1) % n];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    return [(q[1] - p[1]) / len, -(q[0] - p[0]) / len];
  });
  return pts.map((p, i) => {
    const a = normals[(i + n - 1) % n];
    const b = normals[i];
    const k = d / (1 + a[0] * b[0] + a[1] * b[1]);
    return [p[0] + k * (a[0] + b[0]), p[1] + k * (a[1] + b[1])];
  });
}
// Snijstrook over dezelfde stations als het dek, van 0,5 m onder tot 1 m
// boven het looppad, met verticale zijkanten 3 cm binnen de voet van de
// wanden op het looppad (hw - 1,1). De binnenkant van de wanden wijkt boven en
// onder het looppad naar buiten, dus de strook houdt overal minstens 3 cm vrij
// en de wanden, 2 cm groter afgetrokken, raken hem niet. Schuine zijkanten
// langs de wand (breder naar onderen) gaven een opwaarts zijvlak van het
// looppad vlak onder de rand van de constructie, en een strook precies op de
// 2 cm-rand van de wanden een splinter van de wand in die zijkant.
const strip = loftX(
  geometry.map(({ x, zd, hw }) => {
    const e = hw - TROUGH.wallFoot - 0.03;
    return { x, section: [[-e, zd - LAYER], [e, zd - LAYER], [e, zd + ABOVE], [-e, zd + ABOVE]] };
  }),
);
const wallGuards = [1, -1].map((side) =>
  loftX(geometry.map((g) => ({ x: g.x, section: offsetConvex(wallSection(g, side), 0.02) }))),
);
const walkCut = strip.subtract(union(wallGuards)).intersect(prism(WALKWAY, BASE, 100));
const walkway = walkCut.intersect(bridge);
const structure = bridge.subtract(walkCut);
const parts = [
  ["building:pythonbrug", structure],
  ["road:voetpad", walkway, WALKWAY_ATTRIBUTES],
];
{
  // De onderdelen vullen de brug precies op.
  const whole = bridge.volume();
  const sum = structure.volume() + walkway.volume();
  console.log("volume brug, onderdelen (m3):", +whole.toFixed(3), +sum.toFixed(3));
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
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
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "pythonbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-pythonbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van poer, landhoofden en printvoet op het
// printbed.
const stlName = `pythonbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Pythonbrug Amsterdam 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};
const top = geometry.reduce((a, b) => (b.zd > a.zd ? b : a));
report.top = { t: top.t, x: +top.x.toFixed(2), deckZ: +top.zd.toFixed(2), railZ: +top.zt.toFixed(2), clearance: +top.zb.toFixed(2) };

// Catalogusitem voor lib/server/landmark-catalog.ts. Oorsprong: midden van de
// as van het BGT-dek, op de waterspiegel; X langs de brug naar de Panamakade.
await writeFile(
  path.join(outDir, "pythonbrug.json"),
  JSON.stringify(
    {
      name: "Pythonbrug",
      file: "pythonbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [125151.08, 487327.5],
      xAxis: [-0.17219, 0.98506],
      // Het PDOK-terrein legt het water op circa NAP 0,0 m (0,4 m boven de
      // waterspiegel); zo komt z = 0 weer op NAP -0,4 m en sluiten de uiteinden
      // van het looppad op de kades (NAP +1,45 m) aan.
      groundOffsetMetres: -0.4,
      // Op het water van het Spoorwegbassin naast de brug, buiten de poer.
      groundSamplePoints: [15, 45, 75].flatMap((t) => [
        [+(t - T0).toFixed(2), 10],
        [+(t - T0).toFixed(2), -10],
      ]),
      replacesTerrain: [
        "G0363.340e397cf4af42c7a9a48558f4ce0508",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het midden van de as van het BGT-dek op de waterspiegel van het Spoorwegbassin (z = 0, NAP -0,4 m) in de oorsprong, +X langs de brug naar de Panamakade op Sporenburg (RD-richting 99,9 graden vanaf het oosten) en +Y naar het westzuidwesten. Twee nodes: road:voetpad, de bovenste 0,5 m van het looppad tussen de wanden van kade tot kade met de attributen van het BGT-wegdeel op de brug in extras.attributes (bgt_functie voetpad op trap, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, de trog van twee naar boven uitwaaierende liggers (4,2 m breed aan de kades, 5 m in het midden) met het looppad ertussen, dat van de Stuurmankade (x = -45,7) over een lage boog op NAP +4,7 m en de poer naar de top op NAP +10,4 m (x = 6) en terug naar de Panamakade golft, de balustraden 1,1 m boven het looppad, de onderrand 1,3 m eronder en bij de poer en de landhoofden afbuigend tot op het beton, plus de ovale poer en de twee landhoofden. Het vakwerk is dicht (wanden van 0,9 tot 1,1 m) en de lantaarns zijn weggelaten; de export vult onder de vrije overspanningen een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd; het PDOK-terrein legt dat op circa NAP 0,0 m, vandaar een verzinking van 0,4 m. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: LENGTH,
        deckWidthM: 3.7,
        widthOverBalustradesM: { ends: +(2 * halfWidth(0)).toFixed(2), middle: +(2 * halfWidth(LENGTH / 2)).toFixed(2) },
        walkwayTopNapM: Math.max(...DECK_NAP),
        lowArchNapM: 4.7,
        clearanceAboveWaterM: +top.zb.toFixed(2),
        balustradeAboveWalkwayM: TROUGH.rail,
        pierFromSouthQuayM: PIER.t,
        pierSizeM: [PIER.halfLength * 2, PIER.halfWidth * 2],
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Pythonbrug",
        "PDOK BGT overbruggingsdeel (dek 91,5 x 3,7 m, poer, landhoofden), EPSG:28992",
        "PDOK BGT wegdeel G0363.ea9911faf7f643fbb1a0f44a50ccc507 (voetpad op trap, gesloten verharding, relatieve hoogteligging 1) voor het looppad",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het looppad, de balustraden, de poer en de kades",
        "Wikimedia Commons: Pythonbrug, Amsterdam.jpg, 2021 Brug 1998 Pythonbrug, Asd (1).jpg, Pythonbrug.JPG",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

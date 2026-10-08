// Gedeelde hulpfuncties voor de landmarkmodellen van de Efteling
// (scripts/generate-efteling-*.mjs). Elk model is een losse catalogusbron met
// een eigen oorsprong en maaiveld; dit bestand bevat alleen wat ze delen:
// manifold-3d, de geometriehulpen, de controles en het wegschrijven van GLB,
// STL en catalogus-JSON. De GLB- en STL-schrijvers zijn dezelfde als in de
// andere generatorscripts (bijvoorbeeld generate-pier-scheveningen.mjs).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
export const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
export const scale = Number(flag("--scale", "1000"));
const outRoot = path.resolve(flag("--out", path.join(import.meta.dirname, "../models")));
export const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
export const { Manifold, CrossSection } = wasm;

// ---------- geometrie ----------
export const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Verticaal prisma op een veelhoek tussen z0 en z1.
export const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
// Rechthoek langs de lijn a→b, van s0 tot s1 vanaf a, met de gegeven breedte.
export const strip = ([ax, ay], [bx, by], width, s0, s1) => {
  const len = Math.hypot(bx - ax, by - ay);
  const d = [(bx - ax) / len, (by - ay) / len];
  const n = [-d[1] * (width / 2), d[0] * (width / 2)];
  const p = (s) => [ax + d[0] * s, ay + d[1] * s];
  const [p0, p1] = [p(s0), p(Math.min(s1, len))];
  return [[p0[0] + n[0], p0[1] + n[1]], [p1[0] + n[0], p1[1] + n[1]], [p1[0] - n[0], p1[1] - n[1]], [p0[0] - n[0], p0[1] - n[1]]];
};
export const circle = (c, r, n = 32, phase = 0) =>
  Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos(phase + (2 * Math.PI * k) / n), c[1] + r * Math.sin(phase + (2 * Math.PI * k) / n)]);
export const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
// Box van [x0,y0,z0] tot [x1,y1,z1].
export const box = (x0, y0, z0, x1, y1, z1) => prism(rect(x0, y0, x1, y1), z0, z1);
// Convex omhulsel van een lijst punten [x, y, z].
export const hull = (points) => Manifold.hull(points);
// Veelhoek op hoogte z als puntenlijst voor hull().
export const ring3 = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Lokaal stelsel → wereld: draai om Z met graden en verschuif.
export const place = (m, { at = [0, 0, 0], deg = 0 } = {}) => m.rotate([0, 0, deg]).translate(at);
// Zadeldak: rechthoek van lengte L (langs x) en breedte B, goot op z0, nok op z1, gecentreerd in de oorsprong.
export const gableRoof = (L, B, z0, z1) =>
  Manifold.hull([
    [-L / 2, -B / 2, z0], [L / 2, -B / 2, z0], [L / 2, B / 2, z0], [-L / 2, B / 2, z0],
    [-L / 2, 0, z1], [L / 2, 0, z1],
  ]);
// Schilddak: als zadeldak, met de nok ingekort met 'hip' aan beide uiteinden.
export const hipRoof = (L, B, z0, z1, hip = B / 2) =>
  Manifold.hull([
    [-L / 2, -B / 2, z0], [L / 2, -B / 2, z0], [L / 2, B / 2, z0], [-L / 2, B / 2, z0],
    [-L / 2 + hip, 0, z1], [L / 2 - hip, 0, z1],
  ]);
// Spits (piramide) met n vlakken op een cirkel van straal r, van z0 tot z1.
export const spire = (c, r, z0, z1, n = 8, phase = Math.PI / 8) =>
  Manifold.hull([...ring3(circle(c, r, n, phase), z0), [c[0], c[1], z1]]);
// Ui- of klokvormige koepel als omwenteling van een profiel [[r, z], ...] (r ≥ 0, van onder naar boven).
export const dome = (c, profile, segments = 32) => {
  const pts = [[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]];
  return Manifold.revolve(new CrossSection([ccw(pts)]), segments).translate([c[0], c[1], 0]);
};
// Band langs een polylijn van punten [x, y, z] met een rechthoekige doorsnede
// (breedte w dwars op het pad, dikte h aan de 'onderkant' van het pad): voor
// achtbaanbanen. `up` is de bovenkant van de baan: een vaste vector, of een
// functie (i, a, b) => vector per segment (voor een looping: naar het
// middelpunt van de looping; voor een kanteling: gekanteld om de rijrichting).
// De doorsnede staat per punt loodrecht op de gemiddelde richting; elk segment
// is het omhulsel van de doorsneden op begin en eind, 2 cm langs de baan
// doorgetrokken zodat de segmenten overlappen en één gesloten band vormen.
export const ribbon = (path3, w, h, { up = [0, 0, 1] } = {}) => {
  const pts = path3.filter((p, i) => i === 0 || Math.hypot(p[0] - path3[i - 1][0], p[1] - path3[i - 1][1], p[2] - path3[i - 1][2]) > 1e-6);
  const n = pts.length;
  const unit = (v) => {
    const l = Math.hypot(...v);
    return l < 1e-9 ? null : v.map((c) => c / l);
  };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const seg = (i) => unit(pts[i + 1].map((c, k) => c - pts[i][k]));
  const frames = pts.map((p, i) => {
    const t = unit((i > 0 ? seg(i - 1) : [0, 0, 0]).map((c, k) => c + (i < n - 1 ? seg(i)[k] : 0)));
    const j = Math.min(i, n - 2);
    const upv = typeof up === "function" ? up(j, pts[j], pts[j + 1]) : up;
    const s = unit(cross(t, upv)) ?? [1, 0, 0];
    const u = cross(s, t);
    return { p, t, s, u };
  });
  const corners = ({ p, s, u }, shift) =>
    [
      [w / 2, 0],
      [-w / 2, 0],
      [w / 2, -h],
      [-w / 2, -h],
    ].map(([a, b]) => [0, 1, 2].map((k) => p[k] + shift[k] + s[k] * a + u[k] * b));
  const parts = [];
  for (let i = 0; i + 1 < n; i++) {
    const f0 = frames[i];
    const f1 = frames[i + 1];
    parts.push(Manifold.hull([...corners(f0, f0.t.map((c) => -0.02 * c)), ...corners(f1, f1.t.map((c) => 0.02 * c))]));
  }
  return Manifold.union(parts);
};
export const union = (parts) => Manifold.union(parts.filter(Boolean));

// ---------- controles ----------
// Gooit een fout bij een kapotte manifold of iets onder de onderkant; geeft
// per node een rapport terug (status, genus, driehoeken, volume, bbox).
export function check(nodes, base) {
  const report = {};
  for (const [name, solid] of nodes) {
    if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
    if (solid.isEmpty()) throw new Error(`${name}: leeg`);
    const bb = solid.boundingBox();
    if (bb.min[2] < base - 1e-6) throw new Error(`${name}: onder de onderkant op ${bb.min[2]}`);
    report[name] = {
      genus: solid.genus(),
      parts: solid.decompose().length,
      triangles: solid.numTri(),
      volumeM3: +solid.volume().toFixed(1),
      sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
      xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
      yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
      zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
    };
  }
  return report;
}

// Ondervlakken (normaal meer dan 45° naar beneden) boven de onderkant, als
// lijst {z, area, at}, gegroepeerd per hoogte op 0,1 m. Handig om te zien
// waar de export opvult; niet elk ondervlak is fout.
export function downFaces(solid, base) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const groups = new Map();
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < base + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len) {
      const z = Math.min(...p.map((q) => q[2]));
      const key = z.toFixed(1);
      const g = groups.get(key) ?? { z: +key, area: 0, at: p[0].map((c) => +c.toFixed(1)) };
      g.area += len / 2;
      groups.set(key, g);
    }
  }
  return [...groups.values()].map((g) => ({ ...g, area: +g.area.toFixed(2) })).sort((a, b) => a.z - b.z);
}

// ---------- STL-export ----------
export function toStl(manifold, label) {
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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
export function toGlb(namedParts, generator) {
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
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    const v = mesh.vertProperties;
    for (let i = 0; i < count; i++) {
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
    meshes.push({ name, primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }] });
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
}

// ---------- maaiveld-terugval ----------
// De export knipt het PDOK-terrein af op de uitsnede; valt geen enkel
// groundSamplePoint erbinnen (een uitsnede die alleen de rand van een groot
// model raakt), dan gebruikt de lader `groundHeight` en anders valt het model
// stil weg. Dit is de laagste PDOK-terreinhoogte op de groundSamplePoints,
// ellipsoïdisch zoals de export hem bemonstert (NAP + ca. 43,7 m), gemeten op
// 2026-10-07 met de terreintegels van de export. Na het verplaatsen van
// groundSamplePoints opnieuw meten.
const GROUND_HEIGHTS = {
  "efteling-baron-1898": 53.36,
  "efteling-carnaval-festival": 53.12,
  "efteling-danse-macabre": 52.82,
  "efteling-droomvlucht": 51.66,
  "efteling-fata-morgana": 52.31,
  "efteling-huis-van-de-vijf-zintuigen": 52.63,
  "efteling-joris-en-de-draak": 52.72,
  "efteling-max-en-moritz": 52.81,
  "efteling-pagode": 53.68,
  "efteling-pirana": 53.7,
  "efteling-python": 52.97,
  "efteling-raveleijn": 51.61,
  "efteling-symbolica": 53.56,
  "efteling-villa-volta": 52.16,
  "efteling-vliegende-hollander": 54.18,
  "efteling-vogel-rok": 52.06,
};

// ---------- wegschrijven ----------
// Schrijft <slug>.glb, <slug>-1-<schaal>.stl en <slug>.json in de submap
// <slug> van de catalogus en print een rapport. `catalog` bevat de velden van
// de catalogus-JSON behalve file en printFiles (name, origin, xAxis,
// groundOffsetMetres, groundSamplePoints, replacesBuildings, description,
// realWorld, sources, ...).
export async function writeLandmark({ slug, nodes, base, catalog, title }) {
  const report = check(nodes, base);
  const outDir = path.join(outRoot, slug);
  await mkdir(outDir, { recursive: true });
  const glbFile = path.join(outDir, `${slug}.glb`);
  await writeFile(glbFile, toGlb(nodes, `NederPrint generate-${slug}.mjs (manifold-3d)`));
  const all = Manifold.union(nodes.map(([, solid]) => solid));
  const printSolid = all.translate([0, 0, -base]);
  const stlName = `${slug}-1-${scale}.stl`;
  const { buffer, triangles } = toStl(printSolid, `NederPrint ${title ?? catalog.name} 1:${scale} mm Z-up`);
  await writeFile(path.join(outDir, stlName), buffer);
  const bb = printSolid.boundingBox();
  report.stl = {
    file: stlName,
    status: printSolid.status(),
    genus: printSolid.genus(),
    triangles,
    volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
    sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
  };
  const { name, ...rest } = catalog;
  await writeFile(
    path.join(outDir, `${slug}.json`),
    JSON.stringify(
      {
        name,
        file: `${slug}.glb`,
        unitsPerMetre: 1,
        className: "building",
        crs: "EPSG:28992",
        ...rest,
        ...(GROUND_HEIGHTS[slug] !== undefined && rest.groundHeight === undefined ? { groundHeight: GROUND_HEIGHTS[slug] } : {}),
        printFiles: [stlName],
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(report, null, 2));
  return report;
}

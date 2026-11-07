import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-westzaan");
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
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
// Vlak door de gevellijn p0-p1, stijgend naar binnen (kant van 'inside') met helling t vanaf z0.
const facet = ([x0, y0], [x1, y1], z0, t, [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = -(y1 - y0) / len;
  let ny = (x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) < 0) {
    nx = -nx;
    ny = -ny;
  }
  return [t * nx, t * ny, z0 - t * (nx * x0 + ny * y0)];
};
// Doorsneden in plan voor de tussenstukken van een geleding (convexe veelhoeken).
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const diamond = ([cx, cy], r) => [[cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]];
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek]; verspringingen en spitsen.
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel: vierkante schacht met een piramide erop.
const pinnacle = (c, half, z0, shaft, point) =>
  loft([[z0, sq(c, half)], [z0 + shaft, sq(c, half)], [z0 + shaft + point, tip(c)]]);
// Steunbeer tegen een gevel die naar -v kijkt (zuid): breedte w, diepte d, bovenkant zw tegen de muur en zo aan de buitenkant.
// angle draait de gevel: 0 zuid, 90 oost, 180 noord, 270 west; [x, y] is het punt in de gevel.
const buttress = ([x, y], angle, w, d, zw, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 59 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +u) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.9) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.4,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);


const SLUG = "grote-kerk-westzaan";
// Onderkant iets onder het maaiveld: aan de noordzijde ligt de straat ~0,5 m lager dan het kerkhof.
const BASE = -0.6;
// Oorsprong in het hart van de kruising. De X-as loopt langs de oost-westnok (7,5 graden linksom van RD-oost),
// gemeten uit de vier gevellijnen van BAG-pand 0479100000001164 en de nokken in het AHN-DSM (beide nokken vallen
// binnen 0,25 m op u = 0 en v = 0).
const ORIGIN = [113142.71, 497542.03];
const AXIS_DEG = 7.5;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Hoogtes boven het kerkhof (NAP +0,6 m, AHN-DTM rond de kerk).
const Z0_NAP = 0.6;
// Grieks kruis (1740-1741): vier gelijke armen met zadeldaken van 54,5 graden (helling 1,4) die elkaar in de
// kruising snijden. Nok NAP +21,95, goot en kroonlijst NAP +14,2 (AHN-DSM 0,5 m).
const RIDGE = 21.95 - Z0_NAP;
const SLOPE = 1.4;
const CORNICE = 14.2 - Z0_NAP;
// Armen uit de BAG-contour, in het gebouwstelsel: noord-zuidarm |u| <= 6,1, oost-westarm |v| <= 5,9.
const HW_NS = 6.1, HW_EW = 5.9;
const NORTH = 14.2, SOUTH = -14.2, EAST = 14.35, WEST = -13.65;
// Ronde hoekstukken tussen de armen (BAG: kwartcirkels rond de binnenhoek), plat gedekt op kroonlijsthoogte.
const ROUND_R = 3.7;
const GABLE_T = 0.9;

const solids = [];
// Romp: beide armen en de vier ronde hoekstukken tot de kroonlijst.
solids.push(prism(rect(-HW_NS, HW_NS, SOUTH, NORTH), BASE, CORNICE));
solids.push(prism(rect(WEST, EAST, -HW_EW, HW_EW), BASE, CORNICE));
const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([su, sv]) => [su * HW_NS, sv * HW_EW]);
const disc = (c, r, n = 64) => Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos((2 * Math.PI * k) / n), c[1] + r * Math.sin((2 * Math.PI * k) / n)]);
for (const c of corners) solids.push(prism(disc(c, ROUND_R), BASE, CORNICE));
// Kroonlijst: witte lijst van 0,35 m rond zijgevels en hoekstukken, onderzijde afgeschuind (48 graden).
const CORN_OUT = 0.35, CORN_LOW = CORNICE - 0.7;
const cornice = (lo, hi) => {
  // lo/hi: [veelhoek op de muur, veelhoek met uitsprong]; convex, dus een huls.
  const [p0, p1] = [lo, hi];
  return Manifold.union([
    Manifold.hull([...p0.map(([x, y]) => [x, y, CORN_LOW - 0.4]), ...p1.map(([x, y]) => [x, y, CORN_LOW])]),
    prism(p1, CORN_LOW, CORNICE),
  ]);
};
solids.push(cornice(rect(-HW_NS, HW_NS, SOUTH, NORTH), rect(-HW_NS - CORN_OUT, HW_NS + CORN_OUT, SOUTH, NORTH)));
solids.push(cornice(rect(WEST, EAST, -HW_EW, HW_EW), rect(WEST, EAST, -HW_EW - CORN_OUT, HW_EW + CORN_OUT)));
for (const c of corners) solids.push(cornice(disc(c, ROUND_R), disc(c, ROUND_R + CORN_OUT)));
// Zadeldaken: twee vlakken per arm tot de nok; ze snijden elkaar in vier kilgoten boven de kruising.
solids.push(roofed(rect(-HW_NS, HW_NS, SOUTH, NORTH), ridgeU(0, RIDGE, SLOPE)));
solids.push(roofed(rect(WEST, EAST, -HW_EW, HW_EW), ridgeV(0, RIDGE, SLOPE)));

// Gevels: per arm een eindgevel in het vlak van de gevel; s loopt langs de gevel, de dikte naar binnen.
// angle: 0 = oost (+u), 90 = noord, 180 = west, 270 = zuid; a = afstand van de gevel tot het hart.
const facade = (angle, a) => ({ angle, a });
const FAC = { E: facade(0, EAST), N: facade(90, NORTH), W: facade(180, -WEST), S: facade(270, -SOUTH) };
// Veelhoek [s, z] in het gevelvlak, van a - t tot a + out, gedraaid naar de gevel.
const slab = (f, pts, t, out = 0) => profileX(pts, f.a - t, f.a + out).rotate([0, 0, f.angle]);
const PL_S0 = 4.4, PL_S1 = 5.6, PL_OUT = 0.45;
// Lisenen (pilasters) aan weerszijden van elke eindgevel, 1,2 m breed en 0,45 m vooruit (BAG-sprongen).
const pilasterTop = { E: CORNICE, N: CORNICE + 0.3, S: CORNICE + 0.3, W: 15.0 };
for (const [k, f] of Object.entries(FAC))
  for (const sg of [-1, 1]) solids.push(slab(f, rect(sg * PL_S0, sg * PL_S1, BASE, pilasterTop[k]), 1.0, PL_OUT));
// Rechte topgevel (noord, zuid en de westgevel uit 1969): 0,45 m boven het dakvlak, met een blokje op de top.
const plain = [
  [-5.6, CORNICE - 1.1], [5.6, CORNICE - 1.1], [5.6, RIDGE + 0.45 - SLOPE * 5.6], [0.6, RIDGE + 0.45 - SLOPE * 0.6],
  [0.6, 22.0], [-0.6, 22.0], [-0.6, RIDGE + 0.45 - SLOPE * 0.6], [-5.6, RIDGE + 0.45 - SLOPE * 5.6],
];
for (const k of ["N", "S", "W"]) solids.push(slab(FAC[k], plain, GABLE_T));
// Oostgevel: ingezwenkte geveltop in regencestijl met voluten op de lisenen en een kuif met schelp.
// Contour uit het AHN-DSM op de gevel (NAP +23,6 op de kuif) en de foto's; de krullen zelf zijn vereenvoudigd.
const bell = [[5.6, 15.2], [4.6, 15.8], [4.1, 17.0], [3.6, 18.2], [3.0, 19.6], [2.4, 20.4], [1.6, 21.0], [1.0, 21.9], [0.5, 22.6]];
const eastGable = [[-5.6, CORNICE - 1.1], [5.6, CORNICE - 1.1], ...bell, [0, 23.0], ...bell.map(([s, z]) => [-s, z]).reverse()];
solids.push(slab(FAC.E, eastGable, GABLE_T));
// Lage veelhoekige aanbouwen (consistorie) in de twee westelijke binnenhoeken, schilddak van 27 graden.
const ANNEX_EAVE = 4.2;
for (const sv of [-1, 1]) {
  const p = [[-5.5, sv * 5.5], [-12.66, sv * 5.5], [-12.66, sv * 10.25], [-9.99, sv * 12.95], [-5.5, sv * 12.95]];
  const planes = [];
  for (let i = 1; i < 4; i++) planes.push(facet(p[i], p[i + 1], ANNEX_EAVE, 0.5, [-8, sv * 8]));
  solids.push(roofed(sv < 0 ? p : [...p].reverse(), planes));
}
// Ingangsportaal voor de westgevel (BAG: 2,35 x 3,1 m), met een zadeldakje.
solids.push(roofed(rect(-16.0, WEST + 0.2, -1.55, 1.55), ridgeV(0, 3.3 + 1.55 * 0.75, 0.75)));

let church = Manifold.union(solids);
const cuts = [];
// Vensters: per gevel (oost, noord, zuid) twee hoge rondboogvensters, als blinde nis met een spitse top.
for (const k of ["E", "N", "S"]) for (const s of [-1.95, 1.95]) cuts.push(niche([0, 0], FAC[k].angle, FAC[k].a, s, 2.3, 4.3, 10.6, 0.35));
// Oculus boven de vensters in oost-, noord- en zuidgevel: ronde nis met een punt bovenop (printbaar).
const oculus = (f, zc, r, c = [0, 0]) => {
  const pts = Array.from({ length: 24 }, (_, k) => [r * Math.cos((2 * Math.PI * k) / 24), zc + r * Math.sin((2 * Math.PI * k) / 24)]);
  const hull = CrossSection.hull([...pts, [0, zc + 1.75 * r]]);
  return Manifold.extrude(hull, 0.75).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, f.a - 0.35, 0, 0, 1]).rotate([0, 0, f.angle]).translate([c[0], c[1], 0]);
};
for (const k of ["E", "N", "S"]) cuts.push(oculus(FAC[k], 13.9, 1.1));
// Ronde vensters in de westelijke ronde hoekstukken, boven de daken van de aanbouwen (foto vanuit het zuidwesten).
cuts.push(oculus(facade(135, ROUND_R), 8.0, 0.7, corners[2]), oculus(facade(225, ROUND_R), 8.0, 0.7, corners[3]));
// Deuren: rondboogdeur midden in de oostgevel, deuren in de ronde hoekstukken aan de oostzijde, westdeur in het portaal.
cuts.push(niche([0, 0], 0, EAST, 0, 2.2, BASE, 2.6, 0.35));
for (const sv of [-1, 1]) cuts.push(niche(corners[sv > 0 ? 0 : 1], sv * 45, ROUND_R, 0, 1.4, BASE, 2.2, 0.35));
cuts.push(niche([0, 0], 180, 16.0, 0, 1.6, BASE, 2.4, 0.35));
// Westgevel 1969: twee kleine vensters naast het portaal en een zolderraampje in de top.
for (const s of [-3.2, 3.2]) cuts.push(niche([0, 0], 180, -WEST, s, 1.2, 1.2, 2.4, 0.35));
for (const k of ["W", "N", "S"]) cuts.push(niche([0, 0], FAC[k].angle, FAC[k].a, 0, 1.2, 16.6, 17.8, 0.35));
church = church.subtract(Manifold.union(cuts));

const nodes = [["building:kerk", church]], all = church;
const META = {
  name: "Grote Kerk Westzaan",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundHeight: 43.459,
  groundSamplePoints: [[16.5, 0], [12, -12], [5, -16], [-17, -3], [-17, 4], [12, 12]],
  replacesBuildings: ["0479100000001164"],
  plate: false,
  description:
    "Kruiskerk (Grieks kruis, 1740-1741) aan de Kerkbuurt: vier gelijke armen met zadeldaken van 54,5 graden, ronde hoekstukken tussen de armen, ingezwenkte oostgevel met kuif, rechte topgevels noord, zuid en west, lage aanbouwen en portaal aan de westzijde. RD-oorsprong (113142,71, 497542,03) in het hart van de kruising, X-as langs de oost-westnok (7,5 graden); maten in meters boven het kerkhof (NAP +0,6 m).",
  realWorld: { ridgeNapM: 21.95, corniceNapM: 14.2, eastGableCrestNapM: 23.6, roofPitchDeg: 54.5, groundNapM: Z0_NAP, armWidthM: [2 * HW_NS, 2 * HW_EW] },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_Kerk_(Westzaan)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/40006",
    "https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk,_Westzaan",
    "https://commons.wikimedia.org/wiki/File:Hervormde-kerk.JPG",
    "https://commons.wikimedia.org/wiki/File:Exterieur_vanuit_'t_noorden_-_Westzaan_-_20255050_-_RCE.jpg",
    "https://commons.wikimedia.org/wiki/File:Exterieur_vanuit_het_noord-oosten_-_Westzaan_-_20255058_-_RCE.jpg",
    "BAG-pand 0479100000001164 (PDOK BAG WFS): voetafdruk, lisenen, ronde hoekstukken, aanbouwen en portaal",
    "3D BAG NL.IMBAG.Pand.0479100000001164: nokhoogte en dakvlakken ter controle",
    "PDOK AHN DSM/DTM 0,5 m en actuele luchtfoto",
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

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
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
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
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

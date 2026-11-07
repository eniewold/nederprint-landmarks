import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-pauluskerk-aldtsjerk");
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
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek].
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel: vierkante schacht met een piramide erop.
const pinnacle = (c, half, z0, shaft, point) => loft([[z0, sq(c, half)], [z0 + shaft, sq(c, half)], [z0 + shaft + point, tip(c)]]);
// Lokaal gevelstelsel: x = buitennormaal (graden 'ang', 0 = +u), y langs de gevel, in punt p op de gevellijn.
const onWall = (solid, [px, py], ang) => solid.rotate([0, 0, ang]).translate([px, py, 0]);
// Venster- of deurnis met een spitse top van 58 graden (blinde nis van d diep), breedte w, van z0 tot z1 plus de punt.
const niche = (p, ang, w, z0, z1, d = 0.35) =>
  onWall(profileX([[-w / 2, z0], [w / 2, z0], [w / 2, z1], [0, z1 + 1.6 * (w / 2)], [-w / 2, z1]], -d, 0.4), p, ang);
// Spaarveld: ondiepe nis met een plafond dat onder 50 graden naar buiten oploopt.
const panel = (p, ang, w, z0, z1, d = 0.2) =>
  onWall(Manifold.hull([
    [-d, -w / 2, z0], [-d, w / 2, z0], [0.4, -w / 2, z0], [0.4, w / 2, z0],
    [-d, -w / 2, z1], [-d, w / 2, z1], [0.4, -w / 2, z1 + 1.2 * (d + 0.4)], [0.4, w / 2, z1 + 1.2 * (d + 0.4)],
  ]), p, ang);
// Lisene/pilaster: breedte w, d uit de gevel, van BASE tot z1.
const lisene = (p, ang, z1, w = 0.9, d = 0.25) => onWall(Manifold.cube([d + 0.3, w, z1 - BASE]).translate([-0.3, -w / 2, BASE]), p, ang);
// Gootlijst langs een gevel van p0 naar p1 met de buitennormaal n: 0,25 m uitstekend met een ondervlak van 40 graden.
const eaveLedge = (p0, p1, [nx, ny], z) =>
  Manifold.hull([p0, p1].flatMap(([x, y]) => [
    [x - 0.3 * nx, y - 0.3 * ny, z - 0.3], [x - 0.3 * nx, y - 0.3 * ny, z], [x, y, z - 0.3], [x + 0.25 * nx, y + 0.25 * ny, z],
  ]));
const lerp = ([x0, y0], [x1, y1], t) => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
const outward = ([x0, y0], [x1, y1]) => {
  // Buitennormaal van een gevel die linksom (ccw) om het gebouw loopt.
  const len = Math.hypot(x1 - x0, y1 - y0);
  return [(y1 - y0) / len, -(x1 - x0) / len];
};
const angOf = ([nx, ny]) => (Math.atan2(ny, nx) * 180) / Math.PI;

// Sint-Pauluskerk (Aldtsjerk / Oudkerk, gemeente Tytsjerksteradiel), Van Sminiawei: romaanse kerk uit de 12e eeuw van
// kloostermoppen met tufsteen op een kerkhof op een terp; zadeldaktoren uit het begin van de 13e eeuw tussen twee
// versierde topgevels (westmuur in 1721 opgehoogd), schip met rondboogfries en 19e-eeuwse rondboogvensters, vijfzijdig
// gesloten koor uit de 19e eeuw, bepleisterd en okergeel. Rijksmonument 35669. Eén BAG-pand (0737100000025600).
const SLUG = "sint-pauluskerk-aldtsjerk";
const BASE = -1.0;
// Bouwstelsel = modelstelsel (u, v): +u langs het schip van west naar oost (RD-richting -4,0 graden, uit de lange gevels in de
// BAG: -3,98 graden, en de nok in het AHN en de 3D BAG), +v naar het noorden. Oorsprong RD (188467,5; 586576) midden in het
// schip, z = 0 op het laagste maaiveld rond de voet (oostkant, NAP +2,9 m). De kerk staat op een terp: het kerkhof zakt naar
// NAP +2,0 m aan de randen, aan de westkant ligt het maaiveld tegen de toren op NAP +3,2 tot +3,3 m (dat laat het model aan het
// PDOK-terrein over).
const AXIS_DEG = -4.0;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [188467.5, 586576];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints rond de voet: oost 43,97 en 43,89, zuid 44,19, noord
// 44,22, west 44,23 (PDOK-terreintegels, november 2026); dat is NAP +2,9 m.
const GROUND_ELLIPSOID = 43.89;
const GROUND_SAMPLES = [[18, 0], [17.8, 3], [0, -6], [0, 6.2], [-17.5, 0]];

// ---------- maten (meter boven z = 0, stelsel u/v; BAG-contour, AHN-DSM, 3D BAG-dakvlakken, foto's) ----------
// Schip en koor (BAG): rechthoek u = -12,43 .. 11,26/11,83, v = -5,0 .. 5,15, oostelijk vijfzijdig gesloten.
const S = -5.0, N = 5.15;
const HALL = [
  [-12.43, S], [11.26, S], [15.27, -4.04], [16.97, -1.41], [16.97, 1.37], [15.42, 3.85], [11.83, N], [-12.43, N],
];
// Zadeldak over het schip, aan de oostkant schilden over de koorsluiting; muurhoogte (goot) +6,75 overal (AHN 6,7-7,0,
// 3D BAG 6,7-7,6), helling 1,36 (53,7 graden; AHN zuid 1,39, noord 1,32; 3D BAG 1,30-1,39; koorschilden 1,27-1,48), zodat de
// nok op het midden v = 0,075 op +13,65 ligt (AHN 13,6, 3D BAG 13,5-13,8) en bij u = 11,9 overgaat in de schilden.
const EAVE = 6.75, PITCH = 1.36;
const RIDGE = EAVE + PITCH * (N - S) / 2;
// Het okergele koor begint op u = 7,0 (foto's: een recht travee met venster, daarna de vijf zijden).
const CHOIR_U = 7.0;
// Toren (BAG-deel en AHN): u = -16,6 .. -9,8, v = -2,71 .. 2,98; zadeldak met de nok west-oost op +24,4 (AHN 24,3, 3D BAG
// 24,3-24,5), helling 1,65 (59 graden, 3D BAG 1,59-1,66), goot +19,7 (AHN 19,6-20,0). Topgevels west en oost met een
// muurafdekking 0,3 m boven het dak, hoekpinakels en een pinakel op de top (foto's).
const TW = -16.6, TE = -9.8, TS = -2.71, TN = 2.98;
const TV = (TS + TN) / 2, T_RIDGE = 24.4, T_PITCH = 1.65;
const T_EAVE = T_RIDGE - T_PITCH * (TN - TS) / 2;
const COPING = 0.3, GABLE_T = 0.6;
const FINIAL_TOP = 25.6, CORNER_PIN_TOP = 21.3, FINIAL_BASE = 23.55;

// ---------- schip en koor ----------
const inside = [0, 0];
const hallPlanes = HALL.map((p, i) => facet(p, HALL[(i + 1) % HALL.length], EAVE, PITCH, inside))
  // De westgevel naast de toren is een rechte muur: dat vlak doet niet mee.
  .filter((_, i) => i !== HALL.length - 1);
const church = [];
church.push(roofed(HALL, hallPlanes));
// Plint rondom (0,12 m buiten de gevels tot +0,8; het maaiveld tegen de westkant ligt tot +0,45).
const plan = new CrossSection([ccw(HALL)]).add(new CrossSection([ccw(rect(TW, TE, TS, TN))]));
church.push(Manifold.extrude(plan.offset(0.12, "Miter", 2), 0.8 - BASE).translate([0, 0, BASE]));
// Gootlijsten langs alle gevels met een goot (niet langs de westmuur).
for (let i = 0; i < HALL.length - 1; i++) church.push(eaveLedge(HALL[i], HALL[i + 1], outward(HALL[i], HALL[i + 1]), EAVE));
// Pilasters van het gepleisterde koor: op de overgang naar het schip en op de hoeken van de sluiting (foto's).
church.push(lisene([CHOIR_U, S], 270, EAVE - 0.3, 0.9, 0.15));
church.push(lisene([CHOIR_U, N], 90, EAVE - 0.3, 0.9, 0.15));
for (let i = 1; i <= 5; i++) {
  const p = HALL[i], n0 = outward(HALL[i - 1], p), n1 = outward(p, HALL[i + 1]);
  const nb = [n0[0] + n1[0], n0[1] + n1[1]], l = Math.hypot(...nb);
  church.push(onWall(Manifold.cube([0.45, 0.9, EAVE - 0.3 - BASE]).translate([-0.3, -0.45, BASE]), p, angOf([nb[0] / l, nb[1] / l])));
}

// ---------- toren ----------
const tower = roofed(rect(TW, TE, TS, TN), [[0, T_PITCH, T_EAVE - T_PITCH * TS], [0, -T_PITCH, T_EAVE + T_PITCH * TN]]);
church.push(tower);
// Muurafdekking van de topgevels.
for (const [u0, u1] of [[TW, TW + GABLE_T], [TE - GABLE_T, TE]]) {
  church.push(roofed(rect(u0, u1, TS, TN), [[0, T_PITCH, T_EAVE + COPING - T_PITCH * TS], [0, -T_PITCH, T_EAVE + COPING + T_PITCH * TN]]));
}
// Fries onder de goot van de lange torenzijden (rondboogfries, als lijst met een ondervlak van 40 graden).
church.push(eaveLedge([TW, TS], [TE, TS], [0, -1], T_EAVE));
church.push(eaveLedge([TW, TN], [TE, TN], [0, 1], T_EAVE));
// Hoekpinakels op de voet van de topgevels en een pinakel op elke top.
for (const u of [TW + 0.45, TE - 0.45]) {
  for (const v of [TS + 0.45, TN - 0.45]) church.push(pinnacle([u, v], 0.45, T_EAVE - 0.4, CORNER_PIN_TOP - 0.6 - (T_EAVE - 0.4), 0.6));
  // De voet van de toppinakel ligt onder het dakvlak naast de nok (+23,66 op 0,45 m van de nok), zodat hij nergens overhangt.
  church.push(pinnacle([u, TV], 0.45, FINIAL_BASE, FINIAL_TOP - 0.6 - FINIAL_BASE, 0.6));
}

// ---------- nissen: spaarvelden, vensters, deuren en galmgaten ----------
const cuts = [];
// Spaarvelden in de toren: één hoog veld per zijde met hoekpijlers van 0,9 m (alleen waar de zijde vrij staat).
const TL = TE - TW, TWD = TN - TS, TU = (TW + TE) / 2;
cuts.push(panel([TU, TS], 270, TL - 1.8, 1.4, 18.6));
cuts.push(panel([TU, TN], 90, TL - 1.8, 1.4, 18.6));
cuts.push(panel([TW, TV], 180, TWD - 1.8, 1.4, 18.6));
cuts.push(panel([TE, TV], 0, TWD - 1.8, 14.6, 18.6));
// Galmgaten: één rondboogvenster per zijde (spits als nis), in het spaarveld.
cuts.push(niche([TU - 1.2, TS], 270, 1.1, 15.3, 16.9, 0.55));
cuts.push(niche([TU - 1.2, TN], 90, 1.1, 15.3, 16.9, 0.55));
cuts.push(niche([TW, TV], 180, 1.1, 15.3, 16.9, 0.55));
cuts.push(niche([TE, TV], 0, 1.1, 15.3, 16.9, 0.55));
// Westzijde: vensters op twee hoogten (foto vanuit het noordwesten).
cuts.push(niche([TW, TV], 180, 0.8, 9.0, 10.4, 0.55));
cuts.push(niche([TW, TV], 180, 0.8, 4.4, 5.8, 0.55));
// Topgevels: rondboogvenster op de voet en een klein venster hoger, tussen de visgraatvelden.
for (const [u, ang] of [[TW, 180], [TE, 0]]) {
  cuts.push(niche([u, TV], ang, 1.2, 19.9, 20.9, 0.35));
  cuts.push(niche([u, TV], ang, 0.6, 22.2, 22.6, 0.3));
}
// Zuidgevel van het schip (foto's 2018-2020): deur bij de toren met een venstertje erboven, drie rondboogvensters die
// naar het oosten groter worden; in het koor één groot venster.
cuts.push(niche([-10.1, S], 270, 1.1, -0.2, 1.9, 0.35));
cuts.push(niche([-10.1, S], 270, 0.8, 3.4, 4.4, 0.35));
for (const [u, w, z0, z1] of [[-6.8, 1.0, 2.5, 4.5], [-2.6, 1.1, 2.4, 4.8], [3.6, 1.3, 2.2, 4.9], [9.2, 1.6, 2.3, 4.8]]) {
  cuts.push(niche([u, S], 270, w, z0, z1, 0.35));
  cuts.push(niche([u + 0.6, N], 90, w, z0, z1, 0.35));
}
// Noordgevel: ook bij de toren een venstertje; ingang in de westmuur van het schip ten noorden van de toren.
cuts.push(niche([-10.1, N], 90, 0.8, 3.4, 4.4, 0.35));
cuts.push(niche([-12.43, 4.05], 180, 1.1, -0.2, 2.0, 0.35));
// Koorsluiting: rondboogvenster in de zuidoostzijde (foto vanuit het oosten).
{
  const [p0, p1] = [HALL[2], HALL[3]];
  cuts.push(niche(lerp(p0, p1, 0.5), angOf(outward(p0, p1)), 1.3, 2.4, 4.7, 0.35));
}
const complex = Manifold.union(church).subtract(Manifold.union(cuts)).trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Sint-Pauluskerk Aldtsjerk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0737100000025600"],
  plate: false,
  description:
    "Sint-Pauluskerk (Pauluskerk) in Aldtsjerk/Oudkerk (Fryslân): romaanse kerk uit de 12e eeuw op een terp, schip met zadeldak (nok +13,65 m, goot +6,75 m) dat aan de oostkant in schilden overgaat boven het vijfzijdig gesloten, gepleisterde koor uit de 19e eeuw met pilasters, gootlijsten, plint en rondboogvensters als nissen; westtoren uit de vroege 13e eeuw met spaarvelden, galmgaten en een zadeldak tussen twee topgevels met muurafdekking, hoekpinakels en toppinakels tot +25,6 m. Oorsprong RD (188467,5; 586576) midden in het schip op het laagste maaiveld rond de voet (NAP +2,9 m), X-as langs het schip van west naar oost onder -4,0 graden.",
  realWorld: {
    built: "12e eeuw (schip, romaans), toren begin 13e eeuw, westmuur toren opgehoogd 1721, koorsluiting 19e eeuw",
    monument: 35669,
    groundNapM: 2.9,
    naveRidgeM: +RIDGE.toFixed(2),
    naveEaveM: EAVE,
    roofPitch: PITCH,
    towerEaveM: +T_EAVE.toFixed(2),
    towerRidgeM: T_RIDGE,
    towerTopM: FINIAL_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Pauluskerk_(Oudkerk)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/35669",
    "https://www.wikidata.org/wiki/Q3400952",
    "https://www.openstreetmap.org/way/277506399",
    "https://commons.wikimedia.org/wiki/Category:Pauluskerk,_Aldtsjerk (20180612 Sint-Pauluskerk1/2 en torenspits; 20200902 Sint Pauluskerk1-3; Paulustsjerke mei tsjerkhôf; RCE 20180309, 20180312, 20180313, 20180286)",
    "BAG pand 0737100000025600 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
    "PDOK AHN dsm_05m/dtm_05m en actuele luchtfoto",
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
      if (steep < 40) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
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
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
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

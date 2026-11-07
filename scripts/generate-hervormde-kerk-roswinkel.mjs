import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hervormde-kerk-roswinkel");
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




// Convexe veelhoek (tegen de klok in) met elke rand d[i] naar buiten verschoven.
const offsetPoly = (pts, d) => {
  const lines = pts.map(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = [(y1 - y0) / len, -(x1 - x0) / len];
    const off = typeof d === "number" ? d : d[i];
    return { p: [x0 + n[0] * off, y0 + n[1] * off], t: [(x1 - x0) / len, (y1 - y0) / len] };
  });
  return lines.map((l, i) => {
    const m = lines[(i + lines.length - 1) % lines.length];
    // m.p + m.t * s = l.p + l.t * r
    const det = m.t[0] * -l.t[1] - m.t[1] * -l.t[0];
    const rx = l.p[0] - m.p[0], ry = l.p[1] - m.p[1];
    const s = (rx * -l.t[1] - ry * -l.t[0]) / det;
    return [m.p[0] + m.t[0] * s, m.p[1] + m.t[1] * s];
  });
};
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Afstand van een punt tot de lijn p0-p1.
const dist = ([x, y], [x0, y0], [x1, y1]) => Math.abs((x1 - x0) * (y0 - y) - (x0 - x) * (y1 - y0)) / Math.hypot(x1 - x0, y1 - y0);
// Vensternis op het punt [px, py] van een gevel met buitennormaal 'angle' (graden vanaf +u).
const nicheAt = ([px, py], angle, w, z0, z1, d = 0.35) => niche([px, py], angle, 0, 0, w, z0, z1, d);
const edgeNormal = ([x0, y0], [x1, y1]) => (Math.atan2(-(x1 - x0), y1 - y0) * 180) / Math.PI;


const SLUG = "hervormde-kerk-roswinkel";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van de westtoren naar de driezijdige sluiting in het oosten, RD-richting
// 16,0 graden (BAG-zijgevels 16,0 en -164,0 graden, nok in 3D BAG en AHN evenwijdig); +v wijst naar het noordnoordwesten.
// Oorsprong RD (266617,77; 540399,98): midden tussen de zijgevels en halverwege de rechte zijgevels, op het laagste maaiveld
// rond de voet (oostkant, NAP +13,45 m; aan de westkant ligt het maaiveld tot 0,45 m hoger). De BAG-contour ligt ongeveer
// 0,25 m ten noorden van het AHN (nok op v = -0,25); de BAG is aangehouden.
const AXIS_DEG = 16.0;
const ORIGIN = [266617.77, 540399.98];
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: 55,17 zuidoost van de sluiting; oost 55,22 tot 55,28,
// zuid 55,30 tot 55,43, noord 55,44 tot 55,68, west van de toren 55,60 tot 55,64 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 55.17;
const GROUND_SAMPLES = [[-12.5, 0], [-12.5, -2.8], [-12.5, 2.8], [-4, -5.4], [-4, 5.4], [4, -5.4], [4, 5.4], [11.8, 0], [11, -3], [11, 3]];

// ---------- maten (meter boven het laagste maaiveld, NAP +13,45) ----------
// Schip (1759): BAG-contour symmetrisch gemaakt, 8,30 m breed, rechte zijgevels van u = -8,21 tot 8,21, driezijdige sluiting
// tot u = 10,53 met een oostvlak van 3,66 m.
const HALF = 4.15, WEST = -8.21, APSE_U = 8.21, EAST = 10.53, EAST_V = 1.83;
const WALL = [[WEST, -HALF], [APSE_U, -HALF], [EAST, -EAST_V], [EAST, EAST_V], [APSE_U, HALF], [WEST, HALF]];
// Zadeldak met een wolfdak over de sluiting: nok +10,1 (3D BAG NAP +23,60, AHN +23,4 tot +23,55), helling 1,165 (49 graden;
// 3D BAG 1,15 en 1,18, AHN 1,13 tot 1,17), goot +5,27 op de muurlijn (3D BAG +5,0 tot +5,6). De drie dakvlakken van de sluiting
// lopen naar het nokpunt op u = 8,2 (3D BAG 8,3 tot 8,5; AHN-nok zakt vanaf u = 8,6), oostvlak 64 graden (3D BAG 63), schuine
// vlakken 59 graden (3D BAG 57).
const RIDGE = 10.1, PITCH = 1.165, EAVE = RIDGE - PITCH * HALF, APEX = [8.2, 0];
const OVERHANG = 0.35, VERGE = 0.15, FASCIA = 4.7, CORBEL = 4.3; // overstek met witte bakgoot en een kraag van 49 graden
// Vijf traveeën van 3,28 m tussen lisenen met een versnijding (foto's RCE 2019 en Commons): west een klein venster, dan vier
// hoge rondboogvensters; in elk schuin vlak van de sluiting een breder venster, het oostvlak is dicht.
const BAY = (APSE_U - WEST) / 5;
const PIERS = [WEST + 0.3, ...[1, 2, 3, 4].map((k) => WEST + k * BAY)];
const WINDOWS = [0, 1, 2, 3, 4].map((k) => WEST + (k + 0.5) * BAY);
// Westtoren (1853): BAG 3,02 bij 3,21 m voor de westgevel; schacht met een band op +5,4, kroonlijst tot +11,05 (AHN NAP +24,5),
// wit houten achtkant met rondbogen tot +13,9, kroonlijst tot +14,45 (AHN +14,25 tot +14,95) en een achtkante leien naaldspits
// met een uitgezwenkte voet tot +21,8 (AHN-punt +21,25 net naast de top).
const T_U0 = -11.23, T_U1 = WEST + 0.2, T_HALF = 1.6, T_C = [(-11.23 + WEST) / 2, 0];
const T_BAND = 5.4, T_SHAFT = 10.55, T_CORNICE = 11.05;
const L_ACROSS = 2.1, L_PLINTH = [11.05, 11.5, 2.3], L_TOP = 13.9, L_CORNICE = [14.15, 14.45, 2.5];
const SPIRE_FOOT = [15.3, 1.5], SPIRE_TOP = 21.8;

// Dakvlakken: twee zijvlakken tot de nok en drie vlakken van de sluiting die in het nokpunt samenkomen.
const planes = [...ridgeV(0, RIDGE, PITCH)];
for (const i of [1, 2, 3]) {
  const p0 = WALL[i], p1 = WALL[i + 1];
  planes.push(facet(p0, p1, EAVE, (RIDGE - EAVE) / dist(APEX, p0, p1), APEX));
}
const ROOF_EDGE = offsetPoly(WALL, [OVERHANG, OVERHANG, OVERHANG, OVERHANG, OVERHANG, VERGE]);

const solids = [];
// Muren tot onder de kraag, kraag naar het overstek, bakgoot en dakvlakken (de westgevel krijgt een smalle windveer).
solids.push(prism(WALL, BASE, CORBEL));
const eaves = Manifold.hull([...at(WALL, CORBEL), ...at(ROOF_EDGE, FASCIA), ...at(ROOF_EDGE, 30)]);
solids.push(planes.reduce((s, p) => cutBelow(s, p), eaves));
// Plint van 0,15 m met een schuine bovenkant.
solids.push(Manifold.hull([...at(offsetPoly(WALL, 0.15), BASE), ...at(offsetPoly(WALL, 0.15), 0.45), ...at(WALL, 0.6)]));
// Lisenen met een versnijding: 0,6 m breed, onderin 0,45 m voor de muur, boven 0,25 m, tot onder de kraag; de
// oostelijke lisenen staan op de hoeken van de sluiting.
const pier = ([x, y], angle) =>
  profileX([[0.1, BASE], [-0.45, BASE], [-0.45, 1.2], [-0.25, 1.45], [-0.25, CORBEL], [0.1, CORBEL]], -0.3, 0.3)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
for (const u of PIERS) {
  solids.push(pier([u, -HALF], 0));
  solids.push(pier([u, HALF], 180));
}
// Lisenen op de hoeken van de sluiting, haaks op de bissectrice.
for (const [i, a] of [[1, 22.5], [2, 67.5], [3, 112.5], [4, 157.5]]) solids.push(pier(WALL[i], a));
// Toren: onderbouw 0,1 m breder tot de band, schacht, kroonlijst van 50 graden en een lage kap.
const T_RECT = rect(T_U0, T_U1, -T_HALF, T_HALF);
const T_LOW = offsetPoly(T_RECT, [0.1, 0, 0.1, 0.1]);
solids.push(prism(T_RECT, BASE, T_SHAFT));
solids.push(Manifold.hull([...at(T_LOW, BASE), ...at(T_LOW, T_BAND - 0.1), ...at(T_RECT, T_BAND)]));
const T_CORN = offsetPoly(ccw(T_RECT), 0.25);
solids.push(Manifold.hull([...at(T_RECT, T_SHAFT), ...at(T_CORN, T_SHAFT + 0.3), ...at(T_CORN, T_CORNICE - 0.15)]));
solids.push(Manifold.hull([...at(T_CORN, T_CORNICE - 0.16), ...at(oct(T_C, L_PLINTH[2] + 0.2), T_CORNICE + 0.05)]));
// Houten lantaarn: achtkante voet, achtkant met rondbogen, kroonlijst van 50 graden.
solids.push(prism(oct(T_C, L_PLINTH[2]), T_CORNICE, L_PLINTH[1]));
solids.push(prism(oct(T_C, L_ACROSS), L_PLINTH[1] - 0.01, L_TOP));
solids.push(loft([[L_TOP - 0.01, oct(T_C, L_ACROSS)], [L_CORNICE[0], oct(T_C, L_CORNICE[2])], [L_CORNICE[1], oct(T_C, L_CORNICE[2])]]));
// Naaldspits: uitgezwenkte voet en achtkante naald.
solids.push(
  loft([
    [L_CORNICE[1] - 0.01, oct(T_C, L_CORNICE[2] - 0.1)],
    [SPIRE_FOOT[0], oct(T_C, SPIRE_FOOT[1])],
    [SPIRE_TOP, tip(T_C)],
  ]),
);

const cuts = [];
// Zijgevels: klein venster in de westelijke travee, vier hoge rondboogvensters (als spitsboognis van 58 graden).
for (const [k, u] of WINDOWS.entries()) {
  for (const s of [-1, 1]) {
    if (k === 0) cuts.push(nicheAt([u, s * HALF], s < 0 ? -90 : 90, 0.8, 2.5, 3.3));
    else cuts.push(nicheAt([u, s * HALF], s < 0 ? -90 : 90, 1.3, 1.4, 3.2));
  }
}
for (const i of [1, 3]) {
  const p0 = WALL[i], p1 = WALL[i + 1];
  cuts.push(nicheAt([(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], edgeNormal(p0, p1), 1.5, 1.4, 3.0));
}
// Toren: deur met bovenlicht in de westgevel, galmgaten en oculi in west-, zuid- en noordgevel, rondbogen in de lantaarn.
cuts.push(nicheAt([T_U0 - 0.1, 0], 180, 1.3, 0, 2.4, 0.45));
const rhomb = (c, z, r) => [[c + r, z], [c, z + 1.25 * r], [c - r, z], [c, z - 1.25 * r]];
for (const [p, a] of [[[T_U0, 0], 180], [[T_C[0], -T_HALF], -90], [[T_C[0], T_HALF], 90]]) {
  cuts.push(nicheAt(p, a, 0.8, 6.0, 7.4));
  cuts.push(profileX(rhomb(0, 9.1, 0.4), -0.35, 0.4).rotate([0, 0, a]).translate([...p, 0]));
}
for (let k = 0; k < 8; k++) {
  const a = k * 45, r = L_ACROSS / 2;
  const c = [T_C[0] + r * Math.cos((a * Math.PI) / 180), T_C[1] + r * Math.sin((a * Math.PI) / 180)];
  cuts.push(nicheAt(c, a, 0.55, 11.75, 13.15, 0.3));
}

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Hervormde Kerk Roswinkel",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0114100000223876"],
  plate: false,
  description:
    "Hervormde Kerk aan de Stad in Roswinkel (schip 1759, toren 1853): eenbeukige bakstenen zaalkerk met driezijdige sluiting onder een zadeldak met wolfeind over de sluiting (nok +10,1 m), dakoverstek met bakgoot, plint, lisenen met versnijding, een klein en vier hoge rondboogvensters per zijgevel en twee in de sluiting, en de bakstenen westtoren met band, deur met bovenlicht, galmgaten, oculi, kroonlijst, witte achtkante lantaarn met rondbogen en achtkante naaldspits tot +21,8 m. Oorsprong RD (266617,77; 540399,98) midden in het schip op het laagste maaiveld (NAP +13,45 m), X-as langs de nok van toren naar sluiting onder 16 graden. Vensters, deur, galmgaten en bogen als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "schip 1759, toren 1853",
    monument: 14963,
    groundNapM: 13.45,
    ridgeM: RIDGE,
    eaveM: +EAVE.toFixed(2),
    towerCorniceM: T_CORNICE,
    lanternTopM: L_CORNICE[1],
    spireTopM: SPIRE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Kerk_van_Roswinkel",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/14963",
    "https://www.openstreetmap.org/way/273532334",
    "https://commons.wikimedia.org (Kerk Roswinkel.jpg; Exterieur - Roswinkel - 20191005 - RCE.jpg; Exterieur overzicht noordoostgevel - Roswinkel - 20323208 - RCE.jpg)",
    "BAG pand 0114100000223876 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

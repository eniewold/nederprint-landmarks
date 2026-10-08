// Genereert een gesloten 3D-model van het Mauritshuis in Den Haag (1641, aan de
// Hofvijver, Pieter Post en Jacob van Campen): het vierkante hoofdgebouw van
// 26,3 bij 24,4 m uit vlakken en blokken. Gevel: hoge sokkel, pilasters met
// teruggelegde baaien ertussen (de vensternissen), een middenrisaliet aan de
// noord- en zuidzijde en een omlopende kroonlijst die 0,65 m uitkraagt; aan
// de straatzijde (zuidoost) een trap met wangen. Dak: het ingezwenkte
// schilddak als vlakken (plat bovenvlak op +20,6 m, daaromheen per zijde een
// steil vlak van 55 tot 60 graden en een flauwer dakvoetvlak), met op de
// noord- en zuidzijde een fronton (driehoekig dakje boven het risaliet), op de
// oost- en westhelling twee dakkapellen met plat dak, vier schoorstenen op de
// hoeken van het platte deel en de technische put met twee luchtbehandelings-
// units. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-mauritshuis.mjs              # 1:1000 (standaard)
//   node scripts/generate-mauritshuis.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (81461,19, 455227,58), het zwaartepunt van het
// BAG-pand, op maaiveldniveau (NAP +1,5 m), Z omhoog. +X loopt langs de
// gevels naar het noordoosten (28,25 graden tegen de klok in vanaf de RD-X-as)
// en +Y loodrecht daarop naar het noordwesten, naar de Hofvijver.
//
// Bronnen: PDOK BAG-pand 0518100000300401 (het Mauritshuis); AHN DSM/DTM 0,5 m
// (PDOK WCS, hier ook op 0,25 m geresampled): de dakvlakken (plat vlak NAP
// +22,1 m, dakvoet NAP +16,1 m), de frontons, dakkapellen, schoorstenen (NAP
// +25,1 m) en de put; het maaiveld (NAP +1,5 m aan de straatzijde); de LoD2.2-
// vlakken van de 3D BAG voor de hellingen aan de dakvoet; PDOK luchtfoto
// (plattegrond van de dakdelen); foto's op Wikimedia Commons voor het ritme van
// pilasters en baaien; Wikipedia. Weggelaten: gevelornamenten (guirlandes,
// kapitelen, het fronton-reliëf), vensters, de glazen lichtkoker op het
// voorplein en het ondergrondse bezoekerscentrum.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "mauritshuis");
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
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Convexe veelhoek in plan met een dakvlak z = a x + b y + c, vanaf z0 omhoog.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([
    ...pts.map(([x, y]) => [x, y, z0]),
    ...pts.map(([x, y]) => [x, y, a * x + b * y + c]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);

const SLUG = "mauritshuis";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +1,5 m) ----------
const GROUND_NAP = 1.5;
const ORIGIN = [81461.19, 455227.58];
const X_AXIS = [0.880891, 0.47332]; // RD-richting 28,25 graden, langs de gevels
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// BAG-contour (u, v) van het Mauritshuis: 26,3 bij 24,4 m. De gevel zonder
// kroonlijst valt hierop (de pilasters staan in dit vlak).
const U0 = -19.66;
const U1 = 6.65;
const V0 = -12.33;
const V1 = 12.03;
const UC = (U0 + U1) / 2; // as van de symmetrie in u, -6,5 m
const VC = (V0 + V1) / 2;
const WALL_RECT = [U0, U1, V0, V1];
// Maaiveld (AHN NAP +1,5 m) langs de straat aan de oostzijde.
const GROUND_SAMPLES = [[9, 0], [9, -8], [10, 6]];

// Gevel (hoogtes boven het maaiveld; AHN-DSM met NAP +1,5 m afgetrokken).
const PLINTH_Z = 2.6; // bovenkant van de hoge sokkel
const PIL_W = 1.2; // breedte van een pilaster
const RECESS = 0.6; // de baaien tussen de pilasters liggen 0,6 m dieper dan de pilasters
const ENT_Z = 12.3; // onderkant van het hoofdgestel (architraaf en fries)
const CORNICE_Z0 = 12.9; // hier begint de kroonlijst aan de gevel
const CORNICE_Z1 = 13.7; // en staat hier op 0,65 m uit de gevel
const CORNICE_OUT = 0.65;
const EAVE_Z = 14.6; // bovenkant van de kroonlijst (NAP +16,1 m), de dakvoet
const EAVE_Z_N = 15.2; // aan de vijverzijde ligt de goot 0,6 m hoger (AHN: NAP +16,3 m)
// Vlakke bovenkant van het schilddak (NAP +22,1 m) en de knik naar het flauwe dakvoetvlak.
const TOP_Z = 20.6;
const TOP = [-14.95, 1.85, -7.7, 6.5]; // [u0, u1, v0, v1]
const BREAK_Z = 15.9;
const BREAK = [-18.25, 5.15, -10.4, 9.7]; // steile vlakken: 4,7 m omlaag over 3,3 m (west, oost), 3,2 m (noord), 2,7 m (zuid)
// Frontons boven het risaliet: nok langs v op +17,1 m (zuid) en +18,2 m (noord), hellingen van 25 tot 27 graden.
const PED_HALF = [5.4, 6.0]; // halve breedte op de basis [zuid, noord]
const PED_ZR = [17.1, 18.2];
// Dakkapellen op de oost- en westhelling: plat dak op +17,8 m (NAP +19,3 m), voorkant op u = 5,9.
const DORMER_Z = 17.8;
const DORMER_U = [3.6, 5.9]; // [binnen, voorkant]; west gespiegeld in UC
const DORMER_VC = -0.6; // as van het dak in v (het platte deel ligt niet midden in het pand)
const DORMER_DV = 5.75;
const DORMER_W = 2.5;
// Schoorstenen op de hoeken van het platte deel (NAP +25,1 m).
const CHIMNEY_Z = 23.6;
const CHIMNEY_DU = 8.4;
const CHIMNEY_VC = -0.7;
const CHIMNEY_DV = 3.75;
const CHIMNEY_W = 1.8;
// Technische put in het platte deel (AHN: onderste cellen NAP +20,8 tot +21,0 m) met twee units en een
// lager middenstuk (lichtstraat en kanalen, AHN NAP +21,3 m).
const PIT = [-8.8, -4.2, -4.7, 2.8];
const PIT_Z = 19.4;
const UNITS = [[-7.9, -5.1, 0.2, 2.0], [-7.9, -5.1, -3.8, -2.0]];
const UNIT_Z = 20.4;
const PIT_MID = [-8.2, -4.8, -1.6, 0.0];
const PIT_MID_Z = 19.9;

// ---------- hulpvormen ----------
const expand = ([u0, u1, v0, v1], d) => [u0 - d, u1 + d, v0 - d, v1 + d];
const rectPoly = ([u0, u1, v0, v1]) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const rectPts = (r, z) => rectPoly(r).map(([x, y]) => [x, y, z]);
// Afgeknotte piramide tussen twee evenwijdige rechthoeken: vier vlakke dakvlakken met hoekkepers.
const frustum = (r0, z0, r1, z1) => Manifold.hull([...rectPts(r0, z0), ...rectPts(r1, z1)]);

// Gevelvlak: lokaal (x langs de gevel, y naar buiten, z omhoog) op de BAG-gevel gezet.
const FACES = {
  S: { out: 270, at: [UC, V0], half: (U1 - U0) / 2, front: true },
  N: { out: 90, at: [UC, V1], half: (U1 - U0) / 2, front: true },
  E: { out: 0, at: [U1, VC], half: (V1 - V0) / 2, front: false },
  W: { out: 180, at: [U0, VC], half: (V1 - V0) / 2, front: false },
};
const onFace = (side, solid) => solid.rotate([0, 0, FACES[side].out - 90]).translate([...FACES[side].at, 0]);

// Delen van de gevel die in het vlak van de pilasters liggen, [x0, x1] langs de gevel van het midden af:
// op de lange gevels twee hoekpilasters, twee tussenpilasters en het risaliet van drie assen; op de korte
// gevels zeven pilasters op gelijke afstand (zes baaien).
function flushParts(face) {
  const h = face.half;
  const parts = [];
  if (face.front) {
    for (const s of [-1, 1]) {
      parts.push([s > 0 ? h - PIL_W : -h, s > 0 ? h : -h + PIL_W]);
      parts.push([s * 8.2 - PIL_W / 2, s * 8.2 + PIL_W / 2]);
    }
    parts.push([-4.6, 4.6]);
  } else {
    const pitch = (h - PIL_W / 2) / 3;
    for (let k = -3; k <= 3; k++) parts.push([k * pitch - PIL_W / 2, k * pitch + PIL_W / 2]);
  }
  return parts.sort((a, b) => a[0] - b[0]);
}

// ---------- gebouw ----------
const outerRect = expand(WALL_RECT, CORNICE_OUT);
const pieces = [];

// Kern (de teruggelegde baaien), sokkel, pilasters en risaliet, hoofdgestel en kroonlijst.
pieces.push(prism(rectPoly(expand(WALL_RECT, -RECESS)), BASE, EAVE_Z + 0.02));
pieces.push(prism(rectPoly(WALL_RECT), BASE, PLINTH_Z));
for (const side of Object.keys(FACES)) {
  const face = FACES[side];
  const parts = flushParts(face);
  for (const [x0, x1] of parts) {
    pieces.push(onFace(side, box(x0, x1, -RECESS - 0.05, 0, PLINTH_Z - 0.02, ENT_Z + 0.05)));
  }
  // De baai tussen twee delen krijgt een plafond onder 50 graden, zodat er geen overhang ontstaat.
  const edges = [-face.half, ...parts.flat(), face.half];
  for (let i = 0; i < edges.length; i += 2) {
    const [x0, x1] = [edges[i], edges[i + 1]];
    if (x1 - x0 < 0.5) continue;
    const dy = RECESS + 0.05;
    pieces.push(onFace(side, profileX([[0, ENT_Z + 0.05], [-dy, ENT_Z + 0.05], [-dy, ENT_Z - dy * 1.2], [0, ENT_Z]], x0 - 0.05, x1 + 0.05)));
  }
}
pieces.push(prism(rectPoly(WALL_RECT), ENT_Z, CORNICE_Z0 + 0.05));
// Vensternissen: 0,4 m diep, met een spitse bovenkant van 55 graden (geen overhang) als
// het driehoekige bekroningsdakje boven het raam; de ingang aan de zuidzijde is een deur.
const niche = (x, w, z0, z1, depth) => {
  const rise = (w / 2) * 1.4;
  return profileY([[x - w / 2, z0], [x + w / 2, z0], [x + w / 2, z1], [x, z1 + rise], [x - w / 2, z1]], -depth, 0.2);
};
const cutters = [];
for (const side of Object.keys(FACES)) {
  const face = FACES[side];
  const parts = flushParts(face);
  const edges = [-face.half, ...parts.flat(), face.half];
  const centres = [];
  for (let i = 0; i < edges.length; i += 2) {
    const [x0, x1] = [edges[i], edges[i + 1]];
    if (x1 - x0 < 0.5) continue;
    centres.push([(x0 + x1) / 2, Math.min(face.front ? 1.6 : 1.4, x1 - x0 - 1.2), RECESS + 0.4]);
  }
  if (face.front) for (const x of [-2.5, 0, 2.5]) centres.push([x, 1.6, 0.4]);
  for (const [x, w, depth] of centres) {
    if (side === "S" && x === 0) cutters.push(onFace(side, niche(x, 2.0, PLINTH_Z, 5.6, 0.5)));
    else cutters.push(onFace(side, niche(x, w, 3.8, 6.1, depth)));
    cutters.push(onFace(side, niche(x, w, 8.6, 10.6, depth)));
  }
}
pieces.push(Manifold.hull([...rectPts(expand(WALL_RECT, -0.02), CORNICE_Z0), ...rectPts(outerRect, CORNICE_Z1), ...rectPts(outerRect, EAVE_Z)]));
// Aan de vijverzijde staat de goot 0,6 m hoger: de kroonlijst is daar een band hoger.
pieces.push(box(outerRect[0], outerRect[1], V1 - 0.3, outerRect[3], EAVE_Z - 0.02, EAVE_Z_N));

// Dak: het flauwe dakvoetvlak (knik op +15,9 m), daarboven het steile vlak naar het platte bovenvlak.
pieces.push(frustum(WALL_RECT, EAVE_Z - 0.02, BREAK, BREAK_Z));
// Noordzijde: een goot van 2,3 m breed die vanaf de knik flauw afloopt naar de kroonlijst.
pieces.push(profileX([[BREAK[3] - 0.3, EAVE_Z - 0.5], [V1, EAVE_Z - 0.5], [V1, EAVE_Z_N], [BREAK[3], BREAK_Z], [BREAK[3] - 0.3, BREAK_Z]], U0, U1));
const upper = frustum(BREAK, BREAK_Z - 0.02, TOP, TOP_Z).subtract(box(PIT[0], PIT[1], PIT[2], PIT[3], PIT_Z, TOP_Z + 1));
pieces.push(upper);
for (const [u0, u1, v0, v1] of UNITS) pieces.push(box(u0, u1, v0, v1, PIT_Z - 0.05, UNIT_Z));
pieces.push(box(PIT_MID[0], PIT_MID[1], PIT_MID[2], PIT_MID[3], PIT_Z - 0.05, PIT_MID_Z));

// Frontons: een laag zadeldak met de nok loodrecht op de gevel, dat uit de steile dakvlakken steekt.
const pedSouth = profileY(
  [[UC - PED_HALF[0], EAVE_Z - 0.4], [UC + PED_HALF[0], EAVE_Z - 0.4], [UC + PED_HALF[0], EAVE_Z], [UC, PED_ZR[0]], [UC - PED_HALF[0], EAVE_Z]],
  V0 - CORNICE_OUT,
  V0 + 2.5,
);
const pedNorth = profileY(
  [[UC - PED_HALF[1], EAVE_Z_N - 0.4], [UC + PED_HALF[1], EAVE_Z_N - 0.4], [UC + PED_HALF[1], EAVE_Z_N], [UC, PED_ZR[1]], [UC - PED_HALF[1], EAVE_Z_N]],
  V1 - 5,
  V1 + CORNICE_OUT,
);
pieces.push(pedSouth, pedNorth);

// Dakkapellen: blokken met een plat dak op de oost- en westhelling, twee per zijde.
for (const sv of [-1, 1]) {
  const vc = DORMER_VC + sv * DORMER_DV;
  pieces.push(box(DORMER_U[0], DORMER_U[1], vc - DORMER_W / 2, vc + DORMER_W / 2, EAVE_Z - 0.5, DORMER_Z));
  pieces.push(box(2 * UC - DORMER_U[1], 2 * UC - DORMER_U[0], vc - DORMER_W / 2, vc + DORMER_W / 2, EAVE_Z - 0.5, DORMER_Z));
}

// Schoorstenen: een schacht met een kap die boven iets verbreedt (onderkant steiler dan 45 graden).
for (const su of [-1, 1]) {
  for (const sv of [-1, 1]) {
    const cx = UC + su * CHIMNEY_DU;
    const cy = CHIMNEY_VC + sv * CHIMNEY_DV;
    const r = (w) => [cx - w / 2, cx + w / 2, cy - w / 2, cy + w / 2];
    pieces.push(box(...r(CHIMNEY_W), BREAK_Z, CHIMNEY_Z - 0.9 + 0.02));
    pieces.push(Manifold.hull([...rectPts(r(CHIMNEY_W), CHIMNEY_Z - 0.9), ...rectPts(r(CHIMNEY_W + 0.4), CHIMNEY_Z - 0.4), ...rectPts(r(CHIMNEY_W + 0.4), CHIMNEY_Z)]));
  }
}

// Trap voor de ingang aan de straatzijde (zuidoost): zes treden met een wang aan weerszijden.
const STEPS = 6;
const RISE = PLINTH_Z / STEPS;
const RUN = 0.45;
const stairPts = [[-0.05, BASE], [RUN * STEPS, BASE]];
for (let k = 0; k < STEPS; k++) stairPts.push([RUN * (STEPS - k), RISE * (k + 1)], [RUN * (STEPS - k - 1), RISE * (k + 1)]);
stairPts.push([-0.05, PLINTH_Z]);
pieces.push(onFace("S", profileX(stairPts, -3.4, 3.4)));
for (const s of [-1, 1]) {
  const [x0, x1] = s > 0 ? [3.3, 4.8] : [-4.8, -3.3];
  pieces.push(onFace("S", profileX([[-0.05, BASE], [RUN * STEPS + 0.3, BASE], [RUN * STEPS + 0.3, 0.4], [0, PLINTH_Z + 0.5], [-0.05, PLINTH_Z + 0.5]], x0, x1)));
}

const building = Manifold.union(pieces).subtract(Manifold.union(cutters));
const nodes = [["building:mauritshuis", building]];
const all = building;

const META = {
  name: "Mauritshuis",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0518100000300401"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (81461,19, 455227,58), het zwaartepunt van het BAG-pand, op het maaiveld (NAP +1,5 m), +X langs de gevels naar het noordoosten (28,25 graden vanaf de RD-X-as) en +Y loodrecht daarop naar de Hofvijver. Eén node building:mauritshuis: het blok van 26,3 bij 24,4 m met hoge sokkel (+2,6 m), pilasters van 1,2 m breed op de gevel met teruggelegde baaien en vensternissen ertussen, een middenrisaliet aan de noord- en zuidzijde, een kroonlijst die 0,65 m uitkraagt (bovenkant +14,6 m, aan de vijverzijde +15,2 m) en een trap met wangen aan de zuidoostzijde; daarboven het ingezwenkte schilddak als vlakken (flauw dakvoetvlak tot +15,9 m, steil vlak van 55 tot 60 graden naar het platte bovenvlak van 16,8 bij 14,2 m op +20,6 m) met een fronton op de noord- en zuidzijde (nok +18,2 en +17,1 m), vier dakkapellen met plat dak (+17,8 m), vier schoorstenen (+23,6 m) en de technische put met twee units. Onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog, staan verticaal of hangen niet vlakker dan 50 graden. Vervangt de PDOK-reconstructie van het pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    eaveM: EAVE_Z,
    roofTopM: TOP_Z,
    chimneyTopM: CHIMNEY_Z,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Mauritshuis",
    "PDOK BAG pand 0518100000300401, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: dakvlakken, frontons, dakkapellen, schoorstenen, put en maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): dakvlakken bij de dakvoet",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons: foto's van de gevels (ritme van pilasters en baaien, kroonlijst, frontons)",
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

// Losse delen van het model (genus onder 0 betekent meer dan ��n stuk).
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

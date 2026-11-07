import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "mariakerk-blessum");
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

// Vensternis in een willekeurige gevel: c = midden van de gevellijn op maaiveld, angle = richting van de buitennormaal
// (graden, 0 = +u), s schuift langs de gevel (positief = naar rechts gezien vanaf buiten), spitse top met helling k (1,6 = 58
// graden voor spitsbogen; 1,2 = 50 graden als printbare benadering van een rondboog).
// De nis steekt maar 0,05 m buiten de gevel uit, zodat hij de kraag onder de goot niet raakt.
const nicheAt = ([cx, cy], angle, s, w, z0, z1, d = 0.35, k = 1.6) =>
  profileX([[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + k * (w / 2)], [s - w / 2, z1]], -d, 0.05)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Ronde wijzerplaat als nis met een spitse top van 47 graden (druppelvorm), middelpunt op hoogte zc.
const clockAt = ([cx, cy], angle, zc, r, d = 0.12) => {
  const pts = [];
  for (let k = 0; k <= 12; k++) {
    const a = ((135 + (k * 270) / 12) * Math.PI) / 180;
    pts.push([r * Math.cos(a), zc + r * Math.sin(a)]);
  }
  pts.push([0, zc + r * 1.5]);
  return profileX(pts, -d, 0.05).rotate([0, 0, angle]).translate([cx, cy, 0]);
};
// Steunbeer: voet van w breed en 'depth' diep tot zKnee, daarna een schuin vlak terug tot de gevel op zTop.
const buttress = ([cx, cy], angle, w, depth, zKnee, zTop) =>
  profileX([[-0.15, BASE], [depth, BASE], [depth, zKnee], [-0.15, zTop]], -w / 2, w / 2)
    .rotate([0, 0, angle - 90])
    .translate([cx, cy, 0]);
// Convexe veelhoek (linksom) evenwijdig verschoven over d (verstekhoeken).
const offsetConvex = (pts, d) => {
  const P = ccw(pts), n = P.length;
  const lines = P.map(([x0, y0], i) => {
    const [x1, y1] = P[(i + 1) % n];
    const len = Math.hypot(x1 - x0, y1 - y0);
    const nx = (y1 - y0) / len, ny = -(x1 - x0) / len;
    return [x0 + nx * d, y0 + ny * d, (x1 - x0) / len, (y1 - y0) / len];
  });
  return lines.map((L1, i) => {
    const L0 = lines[(i - 1 + n) % n];
    const den = L0[2] * L1[3] - L0[3] * L1[2];
    const t = ((L1[0] - L0[0]) * L1[3] - (L1[1] - L0[1]) * L1[2]) / den;
    return [L0[0] + L0[2] * t, L0[1] + L0[3] * t];
  });
};
const mid = ([x0, y0], [x1, y1]) => [(x0 + x1) / 2, (y0 + y1) / 2];
const normalDeg = ([x0, y0], [x1, y1]) => (Math.atan2(-(x1 - x0), y1 - y0) * 180) / Math.PI; // buitennormaal van een linksom lopende rand

// Mariakerk (Blessum, Waadhoeke), Mariaweg: eenbeukige gotische kerk, wellicht 14e eeuw, met een driezijdig gesloten koor
// onder een doorlopend schilddak, een noordingang met omlijsting van omstreeks 1500, steunberen langs de noordgevel en het koor,
// in 1860 vernieuwde zuidgevel met rondboogvensters, en de westtoren die in 1879 werd ommetseld en een ingesnoerde spits kreeg;
// tegen de zuidkant van de toren een laag aanbouwtje.
const SLUG = "mariakerk-blessum";
const BASE = -0.4;
// Bouwstelsel = modelstelsel (u, v): +u langs de nok van toren naar koor (RD-richting 4,7 graden, uit de BAG-gevels van het schip:
// zuidgevel 4,70 graden, noordgevel 4,2 graden; nok in AHN en 3D BAG evenwijdig), +v naar het noorden. Oorsprong RD
// (176612,77; 577191,75) in het midden van het schip (BAG-gevels v = -4,21 .. 4,20), z = 0 op maaiveld NAP +2,85 m (AHN-dtm
// langs de gevels 2,8 .. 3,1; laagste bij het koor).
const AXIS_DEG = 4.7;
const ca = Math.cos((AXIS_DEG * Math.PI) / 180), sa = Math.sin((AXIS_DEG * Math.PI) / 180);
const ORIGIN = [176612.77, 577191.75];
const X_AXIS = [+ca.toFixed(5), +sa.toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: 43,98 bij het koor (noordoost); west 44,16 .. 44,29,
// noord 44,13 .. 44,24, zuid (pad) 44,33 .. 44,41, oost 44,03 .. 44,05 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 43.98;
const GROUND_SAMPLES = [[-14, 0], [-14, -3.5], [-14, 3], [-10, -5.4], [-10, 3.2], [-6.5, 5.1], [0, 5.1], [6, 5.1], [-6, -5.1], [0, -5.1], [6, -5.1], [10.5, -3.8], [10.5, 3.8], [12.5, 0], [12.5, 2.5], [12.5, -2.5]];

// ---------- maten (meter boven maaiveld, stelsel u/v) ----------
// Schip (BAG): u = -8,5 .. 8,5, v = -4,2 .. 4,2. Zadeldak met de nok +10,65 (AHN 13,5 NAP; 3D BAG 10,5 boven NAP +3,0) op de
// as en helling 1,24 (51 graden; 3D BAG 1,20 en 1,28, AHN-profiel 1,15 .. 1,35), goot op de muur +5,44.
const NV = 4.2, NU = 8.5, RIDGE = 10.65, PITCH = 1.24;
const EAVE = RIDGE - PITCH * NV;
// Koor (BAG): driezijdig gesloten, oostwand u = 11,4 van v = -1,65 tot 1,65, schuine wanden vanaf de hoeken van het schip.
// Het schilddak loopt door: de nok eindigt op u = 8,35 (3D BAG 8,4 .. 8,6), het oostschild heeft dan helling 1,71 (3D BAG 1,71)
// en de schuine schilden 1,60 (3D BAG 1,51 .. 1,63).
const AE = 11.4, AH = 1.65, RIDGE_END = 8.35;
// Goot rondom: dak 0,35 m over de muur, bakgoot met een onderkant van 47 graden.
const OH = 0.35, KRAAG_TOP = 4.75, KRAAG_FOOT = KRAAG_TOP - 0.37;
// Toren (BAG-westblok en 3D BAG): vierkant van 4,9 m, u = -12,78 .. -7,88, v = -2,68 .. 2,22; banden op +6,4 en +10,5 (foto's),
// kroonlijst 0,42 m uitstekend tot +16,15 (AHN 18,9 .. 19,0 NAP; 3D BAG 15,7 .. 16,0 boven NAP +3,0), ingesnoerde leien spits:
// vierkante voet over de kroonlijst, na 0,85 m achtkant (2,9 m breed) en tot +23,2 (foto's: spits 1,45 keer de torenbreedte;
// AHN-piek 26,45 is het kruis boven de bol).
const TC = [-10.33, -0.23], TH = 2.45, T_TOP = 16.15, SPIRE_TOP = 23.2;
// Aanbouw tegen de zuidkant van de toren (BAG en 3D BAG): u = -12,73 .. -8,5, v = -4,6 .. -2,68, lessenaarsdak van +2,35 tot +3,06.
const ANNEX = [-12.73, -8.5, -4.6, TC[1] - TH], ANNEX_LOW = 2.35, ANNEX_PITCH = 0.37;

const solids = [];
// ---------- schip en koor: muren onder het schilddak ----------
const PLAN = [[-NU, -NV], [NU, -NV], [AE, -AH], [AE, AH], [NU, NV], [-NU, NV]];
const SE = [[NU, -NV], [AE, -AH]], EAST = [[AE, -AH], [AE, AH]], NE = [[AE, AH], [NU, NV]];
const facetTo = ([p0, p1]) => {
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const dist = Math.abs((p1[0] - p0[0]) * (p0[1] - 0) - (p1[1] - p0[1]) * (p0[0] - RIDGE_END)) / len;
  return facet(p0, p1, EAVE, (RIDGE - EAVE) / dist, [0, 0]);
};
const roofPlanes = [...ridgeV(0, RIDGE, PITCH), facetTo(SE), facetTo(EAST), facetTo(NE)];
solids.push(roofed(PLAN, roofPlanes));
// Goot: het dak loopt 0,35 m door; aan de westgevel (tegen de toren) geen overstek.
const westClip = (m) => m.trimByPlane([1, 0, 0], -NU);
const EAVE_PLAN = offsetConvex(PLAN, OH);
solids.push(westClip(roofed(EAVE_PLAN, roofPlanes).trimByPlane([0, 0, 1], KRAAG_TOP)));
solids.push(westClip(loft([[KRAAG_FOOT, PLAN], [KRAAG_TOP, EAVE_PLAN], [KRAAG_TOP + 0.06, EAVE_PLAN]])));
// Plint van 0,12 m tot +1,6 met een afgeschuinde bovenkant (zuidgevel: ander metselwerk onder de vensters).
const PLINTH = offsetConvex(PLAN, 0.12);
solids.push(westClip(loft([[BASE, PLINTH], [1.6, PLINTH], [1.72, PLAN]])));
// Schoorsteen op het noordschild bij de nok.
solids.push(prism(rect(4.55, 5.45, 0.85, 1.75), 8.0, 11.3));
// Steunberen: langs de noordgevel drie schuine beren (foto's 1960 en 2009), een op de noordoosthoek van schip en koor (BAG) en
// twee op de oosthoeken van het koor (BAG), 0,9 m breed.
for (const u of [-3.7, 0.2, 4.1]) solids.push(buttress([u, NV], 90, 0.9, 0.7, 1.5, 4.3));
const angSE = normalDeg(...SE), angNE = normalDeg(...NE);
solids.push(buttress([NU, NV], (90 + angNE) / 2, 0.9, 0.6, 2.0, 4.3));
solids.push(buttress([AE, -AH], angSE / 2, 0.9, 0.7, 2.0, 4.3));
solids.push(buttress([AE, AH], angNE / 2, 0.9, 0.7, 2.0, 4.3));
// Omlijsting van de noordingang (omstreeks 1500), 2,4 m breed en 0,15 m voor de gevel, tot +3,05.
const PORTAL_U = -5.6;
solids.push(prism(rect(PORTAL_U - 1.2, PORTAL_U + 1.2, NV - 0.1, NV + 0.15), BASE, 3.05));
// ---------- aanbouw ----------
solids.push(roofed(rect(...ANNEX), [[0, ANNEX_PITCH, ANNEX_LOW - ANNEX_PITCH * ANNEX[2]]]));
// ---------- toren: schacht met plint, banden, kroonlijst en ingesnoerde spits ----------
const tsq = (d) => sq(TC, TH + d);
solids.push(prism(tsq(0), BASE, T_TOP - 0.6));
solids.push(loft([[BASE, tsq(0.1)], [0.5, tsq(0.1)], [0.6, tsq(0)]]));
for (const z of [6.4, 10.5]) solids.push(loft([[z - 0.15, tsq(0)], [z, tsq(0.12)], [z + 0.18, tsq(0.12)], [z + 0.19, tsq(0)]]));
solids.push(loft([[T_TOP - 0.7, tsq(0)], [T_TOP - 0.25, tsq(0.42)], [T_TOP, tsq(0.42)]]));
solids.push(loft([[T_TOP - 0.05, sq(TC, 2.55)], [T_TOP + 0.85, oct(TC, 2.9)], [SPIRE_TOP, tip(TC)]]));

// ---------- nissen: vensters, deuren, galmgaten, wijzerplaten ----------
const cuts = [];
const S_WALL = [0, -NV], N_WALL = [0, NV];
// Zuidgevel (1860): rondboogdeur bij de westhoek, twee kleine vensters boven elkaar, drie hoge rondboogvensters (gezien vanaf
// het zuiden loopt s van west naar oost).
cuts.push(nicheAt(S_WALL, -90, -7.75, 1.0, 0, 2.3, 0.45, 1.2));
cuts.push(nicheAt(S_WALL, -90, -6.75, 0.6, 1.3, 1.8, 0.35, 1.2));
cuts.push(nicheAt(S_WALL, -90, -6.75, 0.7, 3.3, 3.8, 0.35, 1.2));
for (const [u, w] of [[-5.0, 1.5], [-2.3, 1.6], [1.6, 1.7]]) cuts.push(nicheAt(S_WALL, -90, u, w, 1.9, 4.3 - 0.6 * w, 0.35, 1.2));
// Noordgevel: spitsboogdeur in de omlijsting, venster erboven, klein rondboogvenster ten westen, smalle spitsboogvensters
// tussen de steunberen (gezien vanaf het noorden loopt s van oost naar west: s = -u).
cuts.push(nicheAt([0, NV + 0.15], 90, -PORTAL_U, 1.2, 0, 1.75, 0.6));
cuts.push(nicheAt(N_WALL, 90, -PORTAL_U, 0.9, 3.25, 3.55));
cuts.push(nicheAt(N_WALL, 90, 7.3, 0.6, 1.6, 2.2, 0.35, 1.2));
for (const u of [-1.75, 2.15, 6.2]) cuts.push(nicheAt(N_WALL, 90, -u, 0.7, 2.0, 3.6));
// Koor: grote rondboogvensters in de schuine wanden, hoge blinde spitsboognis in de oostwand.
cuts.push(nicheAt(mid(...SE), angSE, 0, 1.8, 1.9, 3.22, 0.35, 1.2));
cuts.push(nicheAt(mid(...NE), angNE, 0, 1.8, 1.9, 3.22, 0.35, 1.2));
cuts.push(nicheAt(mid(...EAST), 0, 0, 1.2, 0.8, 3.3, 0.25));
// Toren: westdeur en venster erboven, op elke zijde twee galmgaten, wijzerplaten west, zuid en oost.
const face = (ang) => [TC[0] + TH * Math.cos((ang * Math.PI) / 180), TC[1] + TH * Math.sin((ang * Math.PI) / 180)];
cuts.push(nicheAt(face(180), 180, 0, 1.1, 0, 2.1, 0.45, 1.2));
cuts.push(nicheAt(face(180), 180, 0, 0.7, 3.8, 4.5, 0.35, 1.2));
for (const ang of [0, 90, 180, 270]) for (const s of [-0.55, 0.55]) cuts.push(nicheAt(face(ang), ang, s, 0.75, 12.4, 13.6, 0.35, 1.2));
for (const ang of [0, 180, 270]) cuts.push(clockAt(face(ang), ang, 11.35, 0.55));
// Aanbouw: deur in de westgevel.
cuts.push(nicheAt([ANNEX[0], (ANNEX[2] + ANNEX[3]) / 2], 180, 0, 0.9, 0, 1.75, 0.3, 1.2));

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Mariakerk Blessum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["0083100000007588"],
  plate: false,
  description:
    "Mariakerk in Blessum: eenbeukige gotische kerk (wellicht 14e eeuw) met driezijdig gesloten koor onder een doorlopend schilddak (nok +10,65 m) met bakgoot, plint, schoorsteen, steunberen langs de noordgevel en het koor, de noordingang met omlijsting van omstreeks 1500, de in 1860 vernieuwde zuidgevel met rondboogvensters, de in 1879 ommetselde westtoren met banden, deur, galmgaten, wijzerplaten en kroonlijst (+16,15 m) en de ingesnoerde leien spits tot +23,2 m, en het aanbouwtje tegen de zuidkant van de toren. Oorsprong RD (176612,77; 577191,75) in het midden van het schip op maaiveld (NAP +2,85 m), X-as langs de nok van toren naar koor onder 4,7 graden. Vensters en deuren als blinde nissen voor print op 1:1000.",
  realWorld: {
    built: "schip en koor wellicht 14e eeuw; noordingang omstreeks 1500; zuidgevel vernieuwd 1860; toren ommetseld en spits 1879; restauratie 1978",
    monument: 28581,
    groundNapM: 2.85,
    ridgeM: RIDGE,
    eaveM: +EAVE.toFixed(2),
    towerCorniceM: T_TOP,
    spireTopM: SPIRE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Mariakerk_(Blessum)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/28581",
    "https://www.openstreetmap.org/way/292883509",
    "https://commons.wikimedia.org/ (Blessum, Mariatsjerke; Blessum, Marijetsjerke; Kerkje van Blessum; RCE 20035572, 20035577, 20035578, 20035583, 20035584)",
    "BAG pand 0083100000007588 (voetafdruk) en 3D BAG LoD2.2 (dakvlakken)",
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

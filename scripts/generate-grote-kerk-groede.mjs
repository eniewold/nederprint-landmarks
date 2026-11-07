import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-groede");
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


const SLUG = "grote-kerk-groede";
const BASE = -0.4;
// Stelsel: oorsprong midden in de hallenkerk (maaiveld NAP +2,7 m), +u langs de nokken van west (toren) naar oost
// (koor), RD-richting -2,5 graden, +v naar het noorden. Gemeten aan de BAG-contour (gevels en steunberen evenwijdig
// onder -2,5 graden) en de drie nokken in het AHN-DSM en de 3D BAG (nokken op v = 7,25, -0,98 en -8,4 over de hele lengte).
const ORIGIN = [24118.0, 378374.5];
const AXIS_DEG = -2.5;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints: west 47,22, noordwest 47,39, zuidwest 47,09,
// noord 47,34, zuid 46,88, oost 47,16, noordoost 47,32, zuidoost 46,98 (PDOK-terreintegels, november 2026).
const GROUND_ELLIPSOID = 46.88;
const GROUND_SAMPLES = [[-20, -0.5], [-13.6, 6], [-13.6, -7.5], [0, 13.5], [0, -13.5], [21, -1], [15.5, 9], [15.5, -9]];

// ---------- maten (meter boven maaiveld NAP +2,7) ----------
// Drie evenwijdige zadeldaken van de hallenkerk, alle dakvlakken helling 1,5 (56 graden) volgens AHN en 3D BAG.
const PITCH = 1.5;
// Noordbeuk (15e eeuw, met noordkoor): nok +14,4 op v = 7,25, westgevel u = -10,4, oostgevel u = 13,4 met schild.
const N_V = [3.05, 11.8], N_RIDGE_V = 7.25, N_RIDGE = 14.4, N_WEST = -10.4, N_EAST = 13.4;
// Middenschip en koor: nok +14,4 op v = -0,98; koor iets breder, driezijdige sluiting tot u = 19,1, nokeinde u = 15,7.
const M_V = [-5.0, 3.05], M_RIDGE_V = -0.98, M_RIDGE = 14.4, M_WEST = -10.3;
const CH_V = [-5.35, 3.4], CH_W0 = 13.4, APSE_U0 = 15.45, APSE_U1 = 19.1, APSE_HALF = 1.6, CH_RIDGE_END = 15.7;
// Rechtgesloten zuidbeuk (circa 1500): nok +13,5 op v = -8,4, westgevel u = -10,0, oostgevel u = 13,7 met schild.
const S_V = [-11.8, -5.0], S_RIDGE_V = -8.4, S_RIDGE = 13.5, S_WEST = -10.0, S_EAST = 13.7;
const eaveAt = (ridge, rv, v) => ridge - PITCH * Math.abs(v - rv);
const N_EAVE = eaveAt(N_RIDGE, N_RIDGE_V, N_V[1]); // +7,58
const S_EAVE = eaveAt(S_RIDGE, S_RIDGE_V, S_V[0]); // +8,40
const CH_EAVE = eaveAt(M_RIDGE, M_RIDGE_V, CH_V[1]); // +7,84
// Toren (14e eeuw): vierkante onderbouw met haakse steunberen, achtkante bovenbouw, omgang met borstwering,
// leien naaldspits met open lantaarn (dicht gemodelleerd) en naald; top +44,4 (hoogste AHN-punt, NAP +47,1).
const TC = [-13.6, -0.53];
const T_SQ = [-17.1, -10.1, -4.22, 3.16]; // BAG: westgevel, (verborgen) oostgevel, zuid- en noordgevel
const T_SQ_TOP = 14.9, T_OCT0 = 16.0, T_OCT = 6.6, T_CORNICE = 22.4, T_GALLERY_W = 8.2, T_DECK = 23.5, T_PARAPET = 24.5;
const SPIRE_W0 = 5.8, LANTERN_Z0 = 33.0, LANTERN_W = 2.4, LANTERN_Z1 = 36.3, SPIRE_TOP = 44.4;

const solids = [];
const cuts = [];
const R = (u0, u1, v0, v1) => rect(Math.min(u0, u1), Math.max(u0, u1), Math.min(v0, v1), Math.max(v0, v1));
// Rechthoekige nis met een plafond van 45 graden; [cx, cy] punt op de gevel, angle de normaal van de gevel (graden),
// s0..s1 langs de gevel (links van de normaal), diepte d.
const recess = ([cx, cy], angle, s0, s1, z0, z1, d) =>
  Manifold.extrude(new CrossSection([ccw([[-d, z0], [1, z0], [1, z1], [0, z1], [-d, z1 - d - 0.05]])]), s1 - s0)
    .rotate([90, 0, 0])
    .translate([0, s1, 0])
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);

// ---------- noordbeuk ----------
solids.push(roofed(R(N_WEST, N_EAST, N_V[0], N_V[1]), [
  ...ridgeV(N_RIDGE_V, N_RIDGE, PITCH),
  [-PITCH, 0, N_EAVE + PITCH * N_EAST], // schild boven de oostgevel (3D BAG: nokeinde u = 9,1)
]));
// ---------- middenschip, koor en driezijdige sluiting ----------
solids.push(roofed(R(M_WEST, CH_W0 + 0.01, M_V[0], M_V[1]), ridgeV(M_RIDGE_V, M_RIDGE, PITCH)));
const APSE = [[APSE_U0, CH_V[0]], [APSE_U1, M_RIDGE_V - APSE_HALF], [APSE_U1, M_RIDGE_V + APSE_HALF], [APSE_U0, CH_V[1]]];
const choirPlan = [[CH_W0, CH_V[0]], ...APSE, [CH_W0, CH_V[1]]];
const ridgeEnd = [CH_RIDGE_END, M_RIDGE_V];
const apsePlane = (p0, p1) => {
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const dist = Math.abs((p1[0] - p0[0]) * (p0[1] - ridgeEnd[1]) - (p0[0] - ridgeEnd[0]) * (p1[1] - p0[1])) / len;
  return facet(p0, p1, CH_EAVE, (M_RIDGE - CH_EAVE) / dist, [14, M_RIDGE_V]);
};
solids.push(roofed(choirPlan, [
  ...ridgeV(M_RIDGE_V, M_RIDGE, PITCH),
  apsePlane(APSE[0], APSE[1]), apsePlane(APSE[1], APSE[2]), apsePlane(APSE[2], APSE[3]),
]));
// ---------- zuidbeuk ----------
solids.push(roofed(R(S_WEST, S_EAST, S_V[0], S_V[1]), [
  ...ridgeV(S_RIDGE_V, S_RIDGE, PITCH),
  [-PITCH, 0, S_EAVE + PITCH * S_EAST], // schild boven de oostgevel (3D BAG: nokeinde u = 10,3)
]));

// ---------- plint ----------
const plan = CrossSection.union([
  new CrossSection([ccw(R(N_WEST, N_EAST, N_V[0], N_V[1]))]),
  new CrossSection([ccw(R(M_WEST, CH_W0 + 0.01, M_V[0], M_V[1]))]),
  new CrossSection([ccw(choirPlan)]),
  new CrossSection([ccw(R(S_WEST, S_EAST, S_V[0], S_V[1]))]),
  new CrossSection([ccw(R(T_SQ[0], T_SQ[1], T_SQ[2], T_SQ[3]))]),
]);
solids.push(Manifold.extrude(plan.offset(0.12, "Miter"), 1.9 - BASE).translate([0, 0, BASE]));

// ---------- steunberen ----------
// Zijbeuken: steunberen van 0,9 m met een schuine afdekking tot onder de goot (BAG-uitsprongen, foto's noord- en zuidgevel).
for (const u of [-4.4, 1.06, 6.72]) solids.push(buttress([u, N_V[1]], 180, 0.9, 0.75, 6.9, 6.1));
solids.push(buttress([11.06, N_V[1]], 180, 0.85, 0.75, 6.9, 6.1));
for (const u of [-9.72, -3.22, 2.12, 7.53]) solids.push(buttress([u, S_V[0]], 0, 0.85, 0.65, 7.4, 6.6));
// Hoeken: noordwest (west en noord), noordoost (oost), midden van de oostgevel van de noordbeuk, zuidoost (oost).
solids.push(buttress([N_WEST, 10.9], 270, 0.9, 0.7, 6.6, 5.8));
solids.push(buttress([-10.2, N_V[1]], 180, 0.9, 0.7, 6.6, 5.8));
solids.push(buttress([N_EAST, 11.55], 90, 0.9, 0.8, 6.6, 5.8));
solids.push(buttress([N_EAST, 7.41], 90, 0.95, 0.9, 6.6, 5.7));
solids.push(buttress([S_EAST, -11.4], 90, 0.9, 1.05, 6.9, 5.9));
solids.push(buttress([S_WEST, -11.2], 270, 0.9, 0.7, 6.9, 6.1));
// Sluiting van het koor: diagonale steunberen op de vier hoeken (BAG).
for (const [p, theta] of [[APSE[0], -57], [APSE[1], -40], [APSE[2], 40], [APSE[3], 57]])
  solids.push(buttress(p, theta + 90, 0.9, 0.85, 6.6, 5.6));

// ---------- vensters en deuren ----------
const WIN = (p, angle, w, z0, z1, d = 0.38) => cuts.push(niche(p, angle, 0, 0, w, z0, z1, d));
// Noordgevel: drie spitsboogvensters, een breder vierde en de spitsboogdeur met blind veld bij het noordkoor.
for (const u of [-7.3, -1.67, 3.89]) WIN([u, N_V[1]], 90, 1.6, 2.8, 5.6);
WIN([8.89, N_V[1]], 90, 2.0, 2.8, 5.5);
WIN([12.25, N_V[1]], 90, 1.3, 0.05, 2.6, 0.35);
// Zuidgevel: deur in de westelijke travee, twee hoge vensters, twee vensters boven elkaar in de oostelijke travee.
WIN([-6.45, S_V[0]], 270, 1.2, 0.05, 2.3, 0.35);
for (const u of [-0.55, 4.82]) WIN([u, S_V[0]], 270, 1.7, 2.6, 5.7);
WIN([10.6, S_V[0]], 270, 1.3, 4.6, 6.0);
WIN([10.6, S_V[0]], 270, 1.3, 1.1, 2.4);
// Westgevels van de zijbeuken: twee grote vensters (noordbeuk) en één venster (zuidbeuk), luikje in de topgevel.
for (const v of [5.4, 9.45]) WIN([N_WEST, v], 180, 1.7, 2.6, 6.4);
WIN([S_WEST, -8.4], 180, 1.8, 2.6, 6.2);
WIN([N_WEST, N_RIDGE_V], 180, 1.0, 9.6, 10.6, 0.3);
WIN([S_WEST, S_RIDGE_V], 180, 1.0, 9.6, 10.6, 0.3);
// Oostgevel noordbeuk: twee vensters naast de middelste steunbeer.
for (const v of [5.25, 9.5]) WIN([N_EAST, v], 0, 1.5, 2.6, 5.6);
// Oostgevel zuidbeuk: twee schuifvensters en een deur (rechthoekige nissen met een schuin plafond).
for (const v of [-10.2, -8.6]) cuts.push(recess([S_EAST, v], 0, -0.55, 0.55, 1.0, 2.9, 0.3));
cuts.push(recess([S_EAST, -6.95], 0, -0.5, 0.5, 0.05, 2.5, 0.3));
// Koor: hoge spitsboogvensters in de drie zijden van de sluiting.
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const facetAngle = (a, b) => (Math.atan2(-(b[0] - a[0]), b[1] - a[1]) * 180) / Math.PI;
for (const [a, b] of [[APSE[0], APSE[1]], [APSE[1], APSE[2]], [APSE[2], APSE[3]]])
  WIN(mid(a, b), facetAngle(a, b), 1.4, 2.4, 5.6);

// ---------- toren ----------
const [tw, te, ts, tn] = T_SQ;
solids.push(prism(R(tw, te, ts, tn), BASE, T_SQ_TOP));
// Haakse steunberen op de twee vrije westhoeken: elk een naar het westen en een naar het noorden/zuiden, in twee versnijdingen.
const towerButtress = (p, angle) => {
  solids.push(buttress(p, angle, 1.2, 1.25, 6.8, 5.6));
  solids.push(buttress(p, angle, 1.2, 0.8, 13.6, 11.6));
};
towerButtress([tw, 2.42], 270);
towerButtress([tw, -3.42], 270);
towerButtress([-16.5, tn], 180);
towerButtress([-16.16, ts], 0);
// Overgang van vierkant naar achtkant (schuine hoekvlakken) en de achtkante bovenbouw.
const towerSq = R(tw, te, ts, tn);
solids.push(loft([[T_SQ_TOP - 0.01, towerSq], [T_OCT0, oct(TC, T_OCT)]]));
solids.push(loft([[T_OCT0 - 0.01, oct(TC, T_OCT)], [T_CORNICE, oct(TC, T_OCT)]]));
// Kraag onder de omgang (45 graden), vloer van de omgang en de dichte borstwering.
solids.push(loft([[T_CORNICE - 0.01, oct(TC, T_OCT)], [T_CORNICE + 0.9, oct(TC, T_GALLERY_W)], [T_DECK, oct(TC, T_GALLERY_W)]]));
solids.push(loft([[T_DECK - 0.01, oct(TC, T_GALLERY_W)], [T_PARAPET, oct(TC, T_GALLERY_W)]]).subtract(prism(oct(TC, T_GALLERY_W - 1.8), T_DECK, T_PARAPET + 1)));
// Leien spits met een licht uitlopende voet, open lantaarn (dicht, met kroonlijst) en naald tot de top.
solids.push(loft([[T_DECK - 0.01, oct(TC, SPIRE_W0)], [T_DECK + 1.0, oct(TC, SPIRE_W0 - 0.5)], [LANTERN_Z0, oct(TC, LANTERN_W)]]));
solids.push(loft([
  [LANTERN_Z0 - 0.01, oct(TC, LANTERN_W)], [LANTERN_Z1, oct(TC, LANTERN_W)], [LANTERN_Z1 + 0.25, oct(TC, LANTERN_W + 0.4)],
  [LANTERN_Z1 + 0.45, oct(TC, LANTERN_W + 0.4)], [LANTERN_Z1 + 0.46, oct(TC, LANTERN_W + 0.2)], [SPIRE_TOP, tip(TC)],
]));
// Galmgaten (spitsboognissen) in de acht zijden van de bovenbouw, nissen in de lantaarn.
for (let k = 0; k < 8; k++) {
  cuts.push(niche(TC, k * 45, T_OCT / 2, 0, 1.1, 16.9, 19.3, 0.4));
  cuts.push(niche(TC, k * 45, LANTERN_W / 2, 0, 0.6, 33.5, 35.3, 0.3));
}
// Westgevel: spitsboogdeur en een venster erboven; noord- en zuidgevel: blinde spitsboog met twee lancetten.
WIN([tw, TC[1]], 180, 1.7, 0.05, 2.9, 0.4);
WIN([tw, TC[1]], 180, 1.3, 6.2, 9.6, 0.35);
for (const [v, ang] of [[tn, 90], [ts, 270]]) {
  cuts.push(niche([TC[0], v], ang, 0, 0, 2.8, 5.6, 9.2, 0.3));
  for (const s of [-0.65, 0.65]) cuts.push(niche([TC[0] + (ang === 90 ? -s : s), v], ang, 0, 0, 0.9, 6.0, 9.0, 0.6));
}

let complex = Manifold.union(solids).subtract(Manifold.union(cuts));
complex = complex.trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]], all = complex;
const META = {
  name: "Grote Kerk Groede",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_ELLIPSOID,
  replacesBuildings: ["1714100000729751"],
  plate: false,
  description:
    "Grote Kerk aan de Markt in Groede: driebeukige hallenkerk onder drie evenwijdige zadeldaken (helling 56 graden, nokken +14,4 / +14,4 / +13,5 m) met schilden boven de rechtgesloten oostgevels van noord- en zuidbeuk, koor met driezijdige sluiting, steunberen en spitsboogvensters als nissen, en de 14e-eeuwse westtoren met haakse steunberen, achtkante bovenbouw met galmgaten, omgang met borstwering, leien naaldspits met lantaarn tot +44,4 m. Oorsprong RD (24118,00; 378374,50) midden in de kerk op maaiveld (NAP +2,7 m), X-as langs de nokken onder -2,5 graden.",
  realWorld: {
    built: "13e eeuw (oudste delen), toren 14e eeuw, schip en noordbeuk 15e eeuw, zuidbeuk circa 1500, herstel 1619 en 1632-1634, verbouwd 1868, restauraties 1950, 1970 en 2010",
    monument: 31516,
    groundNapM: 2.7,
    pitch: PITCH,
    northAisleRidgeM: N_RIDGE,
    naveRidgeM: M_RIDGE,
    southAisleRidgeM: S_RIDGE,
    towerGalleryM: T_DECK,
    towerTopM: SPIRE_TOP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_Kerk_(Groede)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/31516",
    "https://www.reliwiki.nl/index.php/Groede,_Markt_1_-_Grote_Kerk",
    "https://commons.wikimedia.org/wiki/Category:Grote_Kerk_(Groede) (RCE-foto's 20400999, 20352870, 20400997, 20400989, 20398145, 20398186, 20398188; Grote Kerk (Groede) (4).JPG)",
    "BAG pand 1714100000729751 (voetafdruk en steunberen) en 3D BAG LoD2.2 (dakvlakken)",
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

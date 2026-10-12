// Rabobank Bestuurscentrum (Croeselaan 18, Utrecht; Rob Ligtvoet,
// Kraaijvanger Architects, in gebruik sinds juni 2011), de "Verrekijker":
// twee elliptische torens van 40,9 x 26,9 m die over de volle hoogte met een
// holle taille aan elkaar vastzitten, met 27 lagen glas tot NAP +97,1 en
// daarboven per toren een eigen kroon van zink tot +107,45. Tussen de twee
// kronen blijft boven het tailledak een open uitsparing van ruim 10 m. De
// zuidtoren staat 26,9 graden gedraaid ten opzichte van de noordtoren; de
// installaties binnen de kronen liggen puntsymmetrisch.
// Het BAG-pand omvat ook de rest van het complex aan de Croeselaan:
// - de onderbouw van 2011 (dak +13,9) met een raster van ronde daklichten;
// - de glazen hal langs de Croeselaan onder een luifel (+10,2) op kolommen;
// - het kantoor van 1984 met glazen gevels, vleugels in terrassen van een
//   laag (3,6 m) met schuine glazen overgangen, een kop van +47,0 met een
//   lichthof, de vleugels naar het westen, noorden, oosten en zuiden;
// - het zuidblok (+17,85) met installatiehuizen, de loopbrug naar het zuiden,
//   een tuindek met glazen piramide en een plint (+5,9) rondom.
// Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen gestapelde
// DSM-lagen. Voorbeelden per rij: generate-evoluon.mjs (aanpak primitieven) en
// generate-provinciehuis-noord-brabant.mjs (gevelnissen per laag op
// efteling-kit.mjs).
//
//   node scripts/generate-rabobank-bestuurscentrum.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong midden tussen de twee kronen op RD (135934,345,
// 455317,08), z = 0 op NAP +2,3 m (stoep aan de Croeselaan, AHN-DTM +2,27 tot
// +2,31), Z omhoog. +X loopt op 29,81 graden in RD langs het raster van het
// complex (BAG-gevels), +Y op 119,81 graden; de Croeselaan ligt aan -X, het
// station aan +Y/+X. De noordtoren staat op +Y, de zuidtoren op -Y.
//
// Bronnen: BAG-pand 0344100000018495 (het hele complex, 19.500 m2); AHN5 DSM
// 0,5 m (opname 2023, ImageServer Hoogtebestand/AHN5_DSM_50cm van
// ahn.arcgisonline.nl): ellipsen en kronen (contourfit), tailledak +97,1,
// kroondak +104,4, installaties +107,15 tot +107,9, alle terrassen van het
// kantoor van 1984 (+41,2, +37,6, +34,0, +30,4, +28,6, +26,8, +25,0, +24,75,
// +21,15) en hun schuine overgangen, de kop (+47,0), onderbouw, luifel, plint,
// zuidblok, loopbrug en tuindek; AHN4 DSM/DTM 0,5 m (PDOK WCS) ter controle en
// voor het maaiveld. Lagen, kroonvoeg, luifel en kolommen uit Commons-foto's.
import { CrossSection, Manifold, prism, union, ccw, rect, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "rabobank-bestuurscentrum";
const ORIGIN = [135934.345, 455317.08];
const AXIS_DEG = 29.81;
const RAD = (AXIS_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 2.3;
// Onder het plein aan de zuidzijde (AHN-DTM +1,4) en de noordzijde (+1,6).
const BASE = -1.5;
const z = (nap) => +(nap - GROUND_NAP).toFixed(3);

// ---------- hoogtes (NAP) ----------
const H = {
  towerTop: 97.1, // bovenkant glas en tailledak (AHN5 97,07-97,11)
  waistRim: 98.0, // rand langs de holle tailles (AHN5 97,7-98,0)
  crown: 107.45, // kroonrand (AHN5-mediaan 107,44)
  crownRoof: 104.4, // dak binnen de kroon (AHN5 104,39-104,4)
  crownGroove: [101.4, 102.3], // donkere voeg in de kroon (foto's)
  towerFloors: 27, // 27 lagen van 3,51 m tot +97,1 (brand op de 25e/26e etage, Wikipedia)
  plinth: 13.9, // onderbouw 2011 (AHN5 13,6-14,1)
  skylight: 14.8, // ronde daklichten (AHN5 +14,0; 0,9 m voor de print)
  canopy: 10.2, // luifel en hal aan de Croeselaan (AHN5 10,2-10,4)
  canopySoffit: 9.2, // onderkant luifel (foto's: dunne plaat)
  socle: 5.9, // plint rondom het kantoor van 1984 (AHN5 5,87-5,95)
  strip: 8.8, // lage daken langs de vleugels (AHN5 8,73-8,82)
  ramp: 3.5, // hellingbaan noordwestzijde (AHN5 3,5)
  deckE: 10.2, // laag dek tussen de zuidvleugel en de binnentuin (AHN5 10,17)
  kop: 47.0, // kop van het kantoor van 1984 (AHN5 46,6-47,3)
  centre: 41.2, // middendeel (AHN5 41,2)
  seBlock: 17.85, // zuidblok (AHN5 17,8-17,9)
  seBox: 21.8, // installatiehuizen op het zuidblok (AHN5 21,77)
  seDuct: 19.5, // installatiestrook op het zuidblok (AHN5 19,5)
  link: 13.7, // loopbrug naar het zuiden, tonvormig (AHN5 12,6 rand, 13,7 midden)
  linkEdge: 12.6,
  linkLow: 8.0, // onderkant loopbrug (geschat: eerste verdieping)
  pyramidApex: 16.3, // glazen piramide op het tuindek (AHN5 16,2)
};

// ---------- toren ----------
// Ellipsen uit de AHN5-contour: schacht 20,5 x 13,45 m (halve assen), kroon
// 0,6 m terug (19,9 x 12,85). Noordtoren op -0,77 graden, zuidtoren op 26,16.
const TOWERS = [
  { name: "noord", c: [-0.83, 20.045], deg: -0.77, flip: 1 },
  { name: "zuid", c: [0.83, -20.045], deg: 26.16, flip: -1 },
];
const SHAFT = [20.5, 13.45];
const CROWN = [19.9, 12.85];
const CROWN_WALL = 1.2; // kroonwand (AHN5-randbreedte 1,16)
// Holle tailles: cirkels door de AHN5-contour tussen de torens.
const WAIST_E = { c: [29.733, 2.472], r: 16.57 };
const WAIST_W = { c: [-24.688, -2.724], r: 15.8 };
// Installaties binnen de kroon (noordtoren, eigen stelsel s langs de lange as,
// q dwars); de zuidtoren heeft dezelfde indeling puntgespiegeld (AHN5).
const CROWN_PLANT = [
  { s: [-12.5, -4.5], q: [-6.0, 5.8], top: 107.16 },
  { s: [-3.8, 6.2], q: [-2.2, 4.8], top: 107.22 },
  { s: [-5.5, 6.0], q: [5.5, 8.8], top: 107.15 },
  { s: [-3.5, 8.0], q: [-8.0, -4.5], top: 107.13 },
  { s: [7.8, 9.5], q: [5.2, 7.8], top: 107.94 },
  { s: [10.0, 13.8], q: [5.8, 7.5], top: 107.58 },
];

// ---------- hulpfuncties ----------
const cs = (poly) => new CrossSection([ccw(poly)]);
const ext = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
const ellipse = ([cx, cy], [a, b], deg, n = 128) => {
  const t = (deg * Math.PI) / 180;
  return range(n, (k) => {
    const w = (2 * Math.PI * k) / n;
    const x = a * Math.cos(w);
    const y = b * Math.sin(w);
    return [cx + x * Math.cos(t) - y * Math.sin(t), cy + x * Math.sin(t) + y * Math.cos(t)];
  });
};
const circlePts = ([cx, cy], r, n = 128) => range(n, (k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)]);
// Deel van m onder (keep="below") of boven het vlak z = a u + b v + c (model-z).
const cut = (m, a, b, c, keep = "below") => {
  const n = Math.hypot(a, b, 1);
  return keep === "below" ? m.trimByPlane([a / n, b / n, -1 / n], -c / n) : m.trimByPlane([-a / n, -b / n, 1 / n], c / n);
};
// Gevelnissen: 0,35 m diepe ring langs de hele omtrek van een doorsnede, per laag.
const ringBands = (section, rows, d = 0.35) => {
  const ring = section.subtract(section.offset(-d, "Miter", 2));
  return union(rows.map(([h0, h1]) => ext(ring, z(h0), z(h1))));
};
// Punt in het stelsel van een toren (s langs de lange as, q dwars) naar het gebouwstelsel.
const towerPt = (t, s, q) => {
  const r = (t.deg * Math.PI) / 180;
  const ss = s * t.flip;
  const qq = q * t.flip;
  return [t.c[0] + ss * Math.cos(r) - qq * Math.sin(r), t.c[1] + ss * Math.sin(r) + qq * Math.cos(r)];
};

// ---------- toren: schacht ----------
const shaftEll = TOWERS.map((t) => cs(ellipse(t.c, SHAFT, t.deg)));
const crownEll = TOWERS.map((t) => cs(ellipse(t.c, CROWN, t.deg)));
const waist = CrossSection.hull([...shaftEll]).subtract(cs(circlePts(WAIST_E.c, WAIST_E.r))).subtract(cs(circlePts(WAIST_W.c, WAIST_W.r)));
const SHAFT_CS = shaftEll[0].add(shaftEll[1]).add(waist);
// 27 lagen glas tussen borstweringsbanden van 0,9 m; de bovenste band loopt
// door tot het dak (de witte lijst onder de kroon).
const towerStorey = (H.towerTop - GROUND_NAP) / H.towerFloors;
const towerRows = range(H.towerFloors, (k) => {
  const f = GROUND_NAP + towerStorey * k;
  return [+(f + 0.9).toFixed(3), +Math.min(f + towerStorey, H.towerTop - 0.9).toFixed(3)];
});
let shaft = ext(SHAFT_CS, BASE, z(H.towerTop));
shaft = shaft.subtract(ringBands(SHAFT_CS, towerRows));
// Tailledak met een rand van 2 m langs de holle gevels, open tussen de kronen.
const waistTop = SHAFT_CS.subtract(crownEll[0]).subtract(crownEll[1]);
const waistRim = waistTop.intersect(
  cs(circlePts(WAIST_E.c, WAIST_E.r + 2.0)).add(cs(circlePts(WAIST_W.c, WAIST_W.r + 2.0))),
);
const waistParapet = ext(waistRim, z(H.towerTop) - 0.05, z(H.waistRim));

// ---------- toren: kronen ----------
const crowns = TOWERS.map((t, i) => {
  const outer = crownEll[i];
  const inner = outer.offset(-CROWN_WALL, "Miter", 2);
  let crown = ext(outer, z(H.towerTop) - 0.05, z(H.crown));
  crown = crown.subtract(ext(inner, z(H.crownRoof), z(H.crown) + 1));
  crown = crown.subtract(ringBands(outer, [H.crownGroove]));
  const plant = CROWN_PLANT.map((p) =>
    prism([towerPt(t, p.s[0], p.q[0]), towerPt(t, p.s[1], p.q[0]), towerPt(t, p.s[1], p.q[1]), towerPt(t, p.s[0], p.q[1])], z(H.crownRoof) - 0.05, z(p.top)),
  );
  return union([crown, ...plant]);
});

// ---------- onderbouw 2011 ----------
const PLINTH = cs(rect(-2.41, -68.66, 24.73, 58.6)).add(cs(rect(24.73, -19.82, 47.6, 58.6)));
let plinth = ext(PLINTH, BASE, z(H.plinth));
plinth = plinth.subtract(ringBands(PLINTH, [[3.2, 5.5], [7.1, 9.4], [10.9, 13.0]]));
// Ronde daklichten (AHN5: raster van 8,1 m, doorsnede ca. 5,6 m).
const SKYLIGHTS = [
  [3.31, -63.34], [11.2, -63.22], [19.52, -63.33], [3.31, -55.33], [11.37, -55.32], [19.58, -55.31],
  [3.35, -47.15], [11.35, -47.18], [19.52, -47.16], [3.43, -39.09], [11.35, -39.08], [19.6, -39.09],
  [19.61, -30.88], [27.63, -14.88], [35.68, -14.87], [19.54, -6.63], [27.6, -6.68], [35.66, -6.68],
  [19.53, 1.38], [27.56, 1.4], [35.72, 1.34], [19.54, 9.58], [27.56, 9.55], [35.67, 9.52],
  [27.54, 17.52], [35.66, 17.53], [27.67, 25.79], [35.7, 25.7], [11.29, 33.8], [19.38, 33.75],
  [27.57, 33.73], [35.7, 33.74], [3.18, 41.97], [11.17, 41.98], [19.33, 42.01], [27.54, 41.95],
  [35.3, 41.92], [3.3, 49.92], [11.31, 49.92], [19.55, 49.96], [27.69, 49.95], [35.69, 49.87],
];
const skylights = union(SKYLIGHTS.map((c) => prism(circlePts(c, 2.8, 32), z(H.plinth) - 0.05, z(H.skylight))));
// Schuine glazen overgangen van de onderbouw naar de westgevel van de
// middenvleugel van 1984 (AHN5: van +14 op 4,6 m voor de gevel tot de
// terrashoogte, met afgeronde einden).
const wedgeN = Manifold.hull([
  ...[[42.95, 20.0], [40.0, 21.0], [38.6, 23.5], [38.3, 26.0], [38.3, 40.0], [38.8, 42.5], [40.5, 44.3], [42.95, 44.8]].map(([u, v]) => [u, v, z(H.plinth) - 0.05]),
  [42.95, 23.0, z(33.5)], [42.95, 42.0, z(33.5)],
]);
const wedgeS = Manifold.hull([
  ...[[42.95, 8.5], [40.5, 7.5], [39.5, 5.0], [39.5, 3.0], [40.5, 0.6], [42.5, -1.4], [45.0, -2.4], [47.2, -2.6]].map(([u, v]) => [u, v, z(H.plinth) - 0.05]),
  [42.95, 7.0, z(29.5)], [42.95, 0.3, z(29.5)], [47.2, 0.3, z(29.5)],
]);

// ---------- hal en luifel aan de Croeselaan ----------
const HALL = cs(rect(-26.13, -67.73, -17.6, -35.18)).add(cs(rect(-18.7, -57.0, -2.0, 58.6))).add(cs(rect(-18.7, 58.6, 0.5, 89.8)));
let hall = ext(HALL, BASE, z(H.canopySoffit) + 0.05);
hall = hall.subtract(ringBands(HALL, [[3.0, 8.6]]));
const CANOPY = cs(rect(-26.5, -67.5, 0.5, 98.5)).subtract(cs(rect(-17.6, -70, -2.0, -57.0)));
const canopy = ext(CANOPY, z(H.canopySoffit), z(H.canopy));
// Kolommen langs de buitenrand (foto's), op het raster van 8,1 m.
const colPts = [
  ...range(17, (k) => [-25.9, -33.1 + 8.1 * k]).filter(([, v]) => v < 98),
  ...range(4, (k) => [-21.5 + 6.5 * k, 97.9]),
];
const columns = union([
  ...colPts.map(([u, v]) => prism(rect(u - 0.45, v - 0.45, u + 0.45, v + 0.45), BASE, z(H.canopySoffit) + 0.05)),
  // Twee ronde kolommen van 2,4 m voor de taille (BAG-halfcirkels).
  ...[[-19.9, 1.4], [-19.9, -6.65]].map((c) => prism(circlePts(c, 1.2, 32), BASE, z(H.canopySoffit) + 0.05)),
]);

// ---------- plint, lage daken en dekken ----------
const BAG = cs(bagOutline());
// Plein aan de zuidzijde op maaiveld (AHN5 +1,4 tot +2,6), tot aan de onderbouw en het zuidblok.
const PLAZA = cs(rect(24.73, -70, 100, -19.9));
const SOCLE = BAG.subtract(PLAZA).subtract(cs(rect(-17.6, -70, -2.0, -57.0))).subtract(cs(rect(-0.4, 89.55, 7.0, 99)));
const socle = ext(SOCLE, BASE, z(H.socle));
const ramp = ext(BAG.intersect(cs(rect(-0.4, 89.55, 7.0, 99))), BASE, z(H.ramp));
const lowRoofs = union([
  ext(BAG.intersect(cs(rect(0.0, 80.0, 33.08, 88.5))), z(H.socle) - 0.05, z(H.strip)),
  ext(BAG.intersect(cs(rect(94.0, 7.0, 104.0, 16.1))), z(H.socle) - 0.05, z(H.strip)),
  ext(BAG.intersect(cs(rect(120.5, 33.5, 131.0, 41.5))), z(H.socle) - 0.05, z(H.strip)),
  prism([[45.0, 84.0], [48.5, 84.0], [53.0, 91.8], [48.0, 91.8], [45.0, 88.0]], z(H.socle) - 0.05, z(9.6)),
  ext(BAG.intersect(cs(rect(56.0, 14.1, 66.2, 68.5))), z(H.socle) - 0.05, z(H.deckE)),
]);

// ---------- kantoor van 1984: vleugels in terrassen ----------
// Omtrek uit het AHN5 boven +19,5 (BAG waar hij samenvalt), in het gebouwstelsel.
const OLD = cs([
  [42.95, 0.3], [94.5, 0.3], [101.5, 7.2], [94.5, 14.1], [56.6, 14.1], [56.6, 42.2], [64.9, 51.5], [64.9, 63.2],
  [65.9, 66.0], [65.9, 70.5], [67.5, 72.1], [85.2, 72.1], [89.2, 75.6], [98.5, 80.5], [122.8, 80.5], [122.8, 41.0],
  [129.8, 35.0], [136.8, 40.5], [136.8, 89.5], [131.8, 94.4], [55.8, 94.4], [45.8, 81.6], [43.8, 81.6], [43.0, 80.6],
  [33.5, 80.6], [33.5, 81.9], [-5.2, 81.9], [-17.6, 69.8], [-7.2, 58.6], [42.95, 58.6],
]);
// Elk terras: vak [u0, v0, u1, v1] binnen de omtrek, dakhoogte, en de schuine
// glazen overgang naar een lager terras (voet op u of v = at, stijgend in de
// richting dir over run meter, vanaf het lagere dak low). AHN5-profielen langs
// de vleugelassen.
const TERRACES = [
  { name: "westpunt", box: [-20, 55, 6.8, 85], h: 30.4 },
  { name: "west-2", box: [6.8, 55, 26.2, 73.6], h: 34.0, slope: ["u", 6.8, 1, 30.4, 3.5] },
  { name: "west-3", box: [26.2, 55, 39.2, 73.6], h: 37.6, slope: ["u", 26.2, 1, 34.0, 3.6] },
  { name: "west-4", box: [39.2, 55, 42.95, 73.6], h: 41.2, slope: ["u", 39.2, 1, 37.6, 3.6] },
  { name: "noordstrook-1", box: [6.8, 73.6, 20.0, 85], h: 28.6, slope: ["u", 20.0, -1, 24.75, 3.0] },
  { name: "noordstrook-2", box: [20.0, 73.6, 38.5, 85], h: 24.75, slope: ["u", 38.5, -1, 21.15, 3.7] },
  { name: "noordstrook-3", box: [38.5, 73.6, 42.95, 85], h: 21.15 },
  { name: "midden", box: [42.95, 58.3, 78.2, 96], h: 41.2 },
  { name: "midden-zuid", box: [42.95, 54.6, 66, 58.3], h: 41.2, slope: ["v", 54.6, 1, 37.6, 3.7] },
  { name: "midden-oost", box: [78.2, 60, 82.8, 96], h: 41.2, slope: ["u", 82.8, -1, 37.6, 4.6] },
  { name: "oost-1", box: [82.8, 60, 95.5, 96], h: 37.6 },
  { name: "oost-1b", box: [95.5, 60, 99.0, 96], h: 37.6, slope: ["u", 99.0, -1, 34.0, 3.5] },
  { name: "oost-2", box: [99.0, 60, 111.6, 96], h: 34.0 },
  { name: "oost-2b", box: [111.6, 60, 115.0, 96], h: 34.0, slope: ["u", 115.0, -1, 30.4, 3.4] },
  { name: "oost-3", box: [115.0, 77.7, 140, 96], h: 30.4 },
  { name: "oost-3b", box: [115.0, 74.0, 140, 77.7], h: 30.4, slope: ["v", 74.0, 1, 26.8, 3.7] },
  { name: "haak-1", box: [115.0, 59.5, 140, 74.0], h: 26.8, slope: ["v", 59.5, 1, 25.0, 2.0] },
  { name: "haak-2", box: [115.0, 25, 140, 59.5], h: 25.0 },
  { name: "midden-1", box: [39, 38.3, 66, 54.6], h: 37.6, slope: ["v", 38.3, 1, 34.0, 3.5] },
  { name: "midden-2", box: [39, 22.6, 66, 38.3], h: 34.0, slope: ["v", 22.6, 1, 30.4, 3.4] },
  { name: "midden-3", box: [39, -3, 60.5, 22.6], h: 30.4 },
  { name: "zuidvleugel-0", box: [60.5, -3, 64.0, 20], h: 30.4, slope: ["u", 64.0, -1, 26.8, 3.5] },
  { name: "zuidvleugel-1", box: [64.0, -3, 78.0, 20], h: 26.8, slope: ["u", 78.0, -1, 25.0, 1.5] },
  { name: "zuidvleugel-2", box: [78.0, -3, 110, 20], h: 25.0 },
];
// Glasgevels: per laag van 3,6 m een glasband van 2,0 m, 0,35 m diep, per
// terras tot de bovenste volle laag onder het dak.
const oldRows = range(10, (k) => [8.8 + 3.6 * k + 1.0, 8.8 + 3.6 * k + 3.0]);
const terraces = TERRACES.map((t) => {
  let m = ext(OLD.intersect(cs(rect(...t.box))), BASE, z(t.h));
  const rows = oldRows.filter(([, h1]) => h1 <= t.h - 0.5);
  if (rows.length) m = m.subtract(ringBands(OLD, rows).intersect(prism(rect(...t.box), BASE, z(t.h) + 1)));
  if (t.slope) {
    const [axis, at, dir, low, run] = t.slope;
    const k = (dir * (t.h - low)) / run;
    m = axis === "u" ? cut(m, k, 0, z(low) - k * at) : cut(m, 0, k, z(low) - k * at);
  }
  return m;
});
// Kop: dak +47,0 met schuine glazen zijden naar het middendeel (45 graden) en
// een lichthof tot op het middendeel.
const kopTop = [[43.5, 78.8], [58.6, 78.8], [58.6, 94.4], [56.4, 94.4], [43.5, 81.6]];
const kopBase = [[43.5, 73.0], [64.4, 73.0], [64.4, 94.4], [56.4, 94.4], [43.5, 81.6]];
let kop = Manifold.hull([...kopBase.map(([u, v]) => [u, v, z(H.centre) - 0.05]), ...kopTop.map(([u, v]) => [u, v, z(H.kop)])]);
kop = kop.subtract(prism(rect(47.0, 80.0, 58.0, 83.5), z(H.centre), z(H.kop) + 1));
const old = union(terraces);
// Opbouwen op de zuidvleugel (AHN5 +25,9 en +27,5).
const oldBoxes = union([
  prism(rect(85.5, 4.0, 88.0, 10.5), z(25.0) - 0.05, z(25.9)),
  prism(rect(90.0, 4.0, 92.5, 10.5), z(25.0) - 0.05, z(27.5)),
]);

// ---------- zuidblok ----------
const SEB = cs([[47.32, -27.37], [51.84, -31.88], [89.66, -32.0], [90.91, -31.43], [94.79, -27.38], [94.79, -6.0], [92.0, -6.0], [92.0, 0.6], [50.0, 0.6], [50.0, -6.0], [47.32, -6.0]]);
let seBlock = ext(SEB, BASE, z(H.seBlock));
seBlock = seBlock.subtract(ringBands(SEB, [[6.9, 8.9], [10.5, 12.5], [14.1, 16.1]]));
const seRoof = union([
  prism(rect(55.5, -24.7, 64.8, -7.5), z(H.seBlock) - 0.05, z(H.seBox)),
  prism(rect(77.0, -25.4, 86.8, -11.9), z(H.seBlock) - 0.05, z(H.seBox)),
  prism(rect(55.0, -7.7, 76.0, -3.5), z(H.seBlock) - 0.05, z(H.seDuct)),
  prism(rect(55.0, -3.6, 60.0, 0.4), z(H.seBlock) - 0.05, z(H.seDuct)),
]);

// ---------- loopbrug naar het zuiden ----------
// Tonvormig dak (rand +12,6, midden +13,7) over 6,0 m, van het zuidblok tot de
// gevel van het buurpand; onderkant en pijlers geschat.
const linkProfile = [[60.0, 0], [66.0, 0], [66.0, z(H.linkEdge) - z(H.linkLow)], [65.0, z(13.35) - z(H.linkLow)], [63.0, z(H.link) - z(H.linkLow)], [61.0, z(13.35) - z(H.linkLow)], [60.0, z(H.linkEdge) - z(H.linkLow)]];
const LINK_V = [-70.5, -31.0];
// Profiel in (u, z) extruderen langs v: extrude langs Z, dan kantelen.
const link = Manifold.extrude(cs(linkProfile), LINK_V[1] - LINK_V[0])
  .rotate([90, 0, 0])
  .translate([0, LINK_V[1], z(H.linkLow)]);
const linkPiers = union([-45.0, -58.0].map((v) => prism(rect(61.0, v - 0.45, 65.0, v + 0.45), BASE, z(H.linkLow) + 0.05)));

// ---------- tuindek met glazen piramide ----------
// Dak volgt het AHN5-vlak z = 7,984 + 0,0152 u + 0,018 v (NAP), 4 m binnen de
// schuine BAG-gevel; piramide op een driehoek met de top op +16,3.
const DECK = [[82.0, 80.5], [122.8, 80.5], [122.8, 41.5], [117.0, 41.5], [82.0, 76.46]];
const deckPlane = (u, v) => 7.984 + 0.0152 * u + 0.018 * v;
const deck = cut(prism(DECK, z(H.socle) - 0.05, z(14)), 0.0152, 0.018, z(7.984));
const PYR = [[106.0, 73.5], [119.0, 76.0], [116.5, 62.5]];
const pyramid = Manifold.hull([...PYR.map(([u, v]) => [u, v, z(deckPlane(u, v)) - 0.3]), [111.5, 69.0, z(H.pyramidApex)]]);

const parts = {
  shaft, waistParapet, crownN: crowns[0], crownZ: crowns[1], plinth, skylights, wedgeN, wedgeS, hall, canopy, columns,
  socle, ramp, lowRoofs, old, kop, oldBoxes, seBlock, seRoof, link, linkPiers, deck, pyramid,
};
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts));
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 20);
console.log("ondervlakken > 20 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Rabobank Bestuurscentrum met twee torens en kronen onderbouw hal en kantoor van 1984", model]],
  catalog: {
    name: "Rabobank Bestuurscentrum",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Stoep aan de Croeselaan langs de luifel (PDOK-weg ellipsoïdisch
    // 45,65-45,68); het lagere plein aan de zuidzijde (44,86) en de noordzijde
    // blijven erbuiten.
    groundSamplePoints: [[-30, -50], [-30, 0], [-30, 50], [-30, 90]],
    groundHeight: 45.65,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000018495"],
    description:
      "Oorsprong midden tussen de twee kronen op stoepniveau NAP +2,3 m, +X op 29,81 graden in RD langs het raster van het complex, +Y naar het noordnoordwesten (noordtoren); twee elliptische torens van 41,0 x 26,9 m (zuidtoren 26,9 graden gedraaid) met holle tailles en 27 lagen glas tot +97,1, per toren een zinken kroon tot +107,45 met voeg, dak +104,4 en installaties tot +107,9, en daartussen de open uitsparing boven het tailledak (+97,1, rand +98,0); onderbouw van 2011 (+13,9) met 42 ronde daklichten en schuine glazen overgangen naar het kantoor van 1984; glazen hal onder een luifel (+10,2) op kolommen langs de Croeselaan; kantoor van 1984 met terrassen van +41,2 tot +21,15 en schuine glazen overgangen, de kop (+47,0) met lichthof, glasbanden per laag; zuidblok (+17,85) met installatiehuizen (+21,8), loopbrug (+13,7) naar het zuiden, tuindek met glazen piramide (+16,3) en een plint (+5,9) rondom. Lagen, kroonvoeg, luifeldikte, kolommen en de onderkant van de loopbrug uit foto's of geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      axisDegrees: AXIS_DEG,
      towerShaftSemiAxesM: SHAFT,
      crownSemiAxesM: CROWN,
      towerRotationDegrees: { north: TOWERS[0].deg + AXIS_DEG, south: TOWERS[1].deg + AXIS_DEG },
      towerCentresM: TOWERS.map((t) => t.c),
      waistArcs: { east: WAIST_E, west: WAIST_W },
      towerNapM: { glassTop: H.towerTop, waistRim: H.waistRim, crown: H.crown, crownRoof: H.crownRoof, plant: 107.94 },
      towerStoreys: H.towerFloors,
      openNotchBetweenCrownsM: { from: H.towerTop, to: H.crown },
      plinthNapM: H.plinth,
      canopyNapM: H.canopy,
      socleNapM: H.socle,
      officeTerracesNapM: [...new Set(TERRACES.map((t) => t.h))].sort((a, b) => b - a),
      kopNapM: H.kop,
      southBlockNapM: { roof: H.seBlock, plant: H.seBox },
      linkNapM: [H.linkEdge, H.link],
      pyramidApexNapM: H.pyramidApex,
      estimates: [
        "torenlagen: 27 lagen van 3,51 m van +2,3 tot +97,1 (Wikipedia noemt brand op de 25e en 26e etage); glasbanden 0,35 m diep tussen borstweringsbanden van 0,9 m; de verticale stijlen zijn weggelaten",
        "kroon 0,6 m terug van de glasgevel (AHN5-contouren), kroonwand 1,2 m, de donkere voeg (+101,4 tot +102,3) uit foto's",
        "luifelplaat 1,0 m dik en kolommen van 0,9 m op 8,1 m langs de buitenrand uit foto's; de glazen hal onder de luifel als dicht volume met een glasband",
        "onderbouw en zuidblok: glasbanden per laag geschat; de ronde daklichten zijn 0,9 m hoog gemaakt voor de print (in het AHN ca. 0,4 m)",
        "kantoor van 1984: terrassen en hun schuine overgangen uit het AHN5, de glasbanden per laag van 3,6 m uit foto's (RCE 20339908); de kleine knik boven aan elke schuine overgang is weggelaten",
        "schuine glazen overgangen van de onderbouw naar de middenvleugel als vlakken met afgeronde einden (AHN5)",
        "loopbrug: onderkant +8,0 en twee pijlers geschat; het dak uit het AHN5",
        "tuindek: dakvlak uit het AHN5 als één vlak; de piramide uit de AHN5-omtrek op +12,8 en de top",
      ],
    },
    sources: [
      "PDOK BAG pand 0344100000018495, Actueel_orthoHR; PDOK-gebouwtegels en terrein; 2026-10-12",
      "AHN5 DSM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; AHN4 DSM/DTM 0,5 m (PDOK WCS)",
      "https://nl.wikipedia.org/wiki/Rabobank_Bestuurscentrum",
      "https://commons.wikimedia.org/wiki/File:Rabotoren.jpg",
      "https://commons.wikimedia.org/wiki/File:Rabotoren_Utrecht_in_augustus_2026_2.jpg",
      "https://commons.wikimedia.org/wiki/File:Utrecht,_hoofdkantoor_van_de_Rabobank_foto4_2015-11-01_12.03.jpg",
      "https://commons.wikimedia.org/wiki/File:Glazen_torens_aan_de_Croeselaan.jpg",
      "https://commons.wikimedia.org/wiki/File:Rabobank_Bestuurscentrum_Utrecht.jpg",
      "https://commons.wikimedia.org/wiki/File:Utrecht6.JPG",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_VOORGEVEL_-_Utrecht_-_20339908_-_RCE.jpg",
    ],
  },
});

// BAG-pand 0344100000018495 in het gebouwstelsel (vereenvoudigd op 0,25 m).
function bagOutline() {
  return [
    [96.9, -13.76], [96.89, -4.81], [103.79, 2.1], [103.91, 13.18], [103.41, 14.14], [101.35, 16.04], [92.34, 16.04],
    [92.31, 15.13], [73.96, 15.15], [66.02, 23.12], [66.12, 68.51], [66.01, 70.0], [65.66, 70.36], [67.43, 72.14],
    [81.94, 72.18], [81.93, 70.86], [109.79, 43.01], [108.37, 41.59], [118.55, 31.4], [141.0, 31.39], [144.37, 34.88],
    [144.44, 41.96], [140.41, 46.04], [140.42, 91.51], [134.62, 97.49], [134.38, 97.24], [133.97, 97.65], [134.21, 97.89],
    [133.66, 98.44], [133.42, 98.2], [132.7, 99.4], [132.46, 99.16], [132.05, 99.57], [132.29, 99.8], [130.78, 101.31],
    [130.15, 101.79], [115.51, 101.77], [115.51, 94.67], [114.86, 94.67], [114.58, 94.18], [113.96, 94.18],
    [113.68, 94.67], [109.46, 94.67], [109.18, 94.19], [108.56, 94.19], [108.28, 94.67], [104.07, 94.67], [103.79, 94.2],
    [103.16, 94.2], [102.88, 94.66], [98.67, 94.66], [98.39, 94.2], [97.77, 94.19], [97.49, 94.63], [93.27, 94.63],
    [92.68, 94.19], [92.68, 95.4], [91.07, 95.4], [90.22, 96.25], [90.55, 96.58], [90.15, 96.97], [88.4, 95.22],
    [76.53, 95.24], [76.53, 99.14], [64.18, 99.14], [61.57, 96.55], [60.01, 98.12], [58.47, 96.59], [58.46, 93.77],
    [55.92, 93.78], [55.61, 93.46], [55.62, 89.97], [54.44, 89.97], [54.45, 90.54], [50.95, 88.44], [50.03, 88.91],
    [48.74, 88.47], [48.3, 87.18], [48.76, 86.26], [47.26, 84.06], [46.24, 81.58], [43.76, 81.58], [42.77, 80.59],
    [33.09, 80.6], [33.08, 83.63], [32.05, 83.9], [32.04, 86.67], [32.81, 86.67], [32.81, 97.32], [31.71, 98.42],
    [-0.33, 98.48], [-0.19, 89.55], [-18.73, 89.82], [-18.71, 25.17], [-20.17, 22.8], [-20.72, 19.68], [-20.31, 17.33],
    [-18.71, 14.59], [-18.7, 2.68], [-20.06, 2.8], [-21.06, 1.45], [-20.26, -0.01], [-18.69, 0.02], [-18.71, -5.39],
    [-20.07, -5.29], [-21.04, -6.65], [-20.22, -8.11], [-18.68, -8.07], [-18.69, -35.18], [-26.13, -35.18],
    [-26.15, -67.73], [-2.41, -67.73], [-2.41, -68.66], [24.73, -68.65], [24.73, -67.73], [95.43, -67.73], [95.43, -35.17],
    [24.73, -35.18], [24.73, -19.82], [47.2, -19.82], [47.32, -27.37], [51.84, -31.88], [89.66, -32.01], [90.91, -31.43],
    [94.79, -27.38], [94.79, -14.59], [94.9, -13.76],
  ];
}

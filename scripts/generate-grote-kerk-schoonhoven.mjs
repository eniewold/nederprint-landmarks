// Grote of Sint-Bartholomeüskerk in Schoonhoven (rijksmonument 33472).
// Gebouwstelsel = modelstelsel: oorsprong bij het zwaartepunt van het BAG-pand,
// +X naar het oosten langs de kerkas (8,90 graden linksom van RD-oost), +Y
// naar het noorden; de toren staat aan de westkant (-X), de drie koren aan de
// oostkant. z = 0 ligt op NAP +2,0 m.
// Plattegrond uit de BAG, dakvlakken (helling, nok, richting) uit de 3D BAG
// LoD2.2 en het AHN, de toren uit het AHN en foto's. Elk dak is een stel
// planvlakken: per gevelrand een halfruimte die onder de dakhelling ligt, zodat
// zadeldaken, schilden en de veelhoekige koorsluitingen vanzelf ontstaan.
import { Manifold, box, hull, prism, union, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [118140, 439890.5];
const AXIS = [0.98797, 0.15466];
const BASE = -0.3;
const NAP = 2.0; // NAP-hoogte van z = 0
const T60 = Math.tan((60 * Math.PI) / 180);

// Dak boven een convexe veelhoek: per rand { t: tangens van de helling, z: hoogte
// waar het dakvlak de rand snijdt } of null voor een rand zonder dakvlak
// (topgevel of aansluiting op een ander bouwdeel). Muren tot `eave`, dak tot `top`.
const roofed = (poly, eave, top, edges) => {
  let roof = prism(poly, eave - 0.01, top);
  poly.forEach(([ax, ay], i) => {
    const e = edges[i];
    if (!e) return;
    const [bx, by] = poly[(i + 1) % poly.length];
    const len = Math.hypot(bx - ax, by - ay);
    const nx = (by - ay) / len,
      ny = -(bx - ax) / len; // naar buiten voor een linksom doorlopen veelhoek
    const a = -e.t * nx,
      b = -e.t * ny,
      c = e.z + e.t * (ax * nx + ay * ny);
    const n = Math.hypot(a, b, 1);
    roof = roof.trimByPlane([a / n, b / n, -1 / n], -c / n);
  });
  return union([prism(poly, BASE, eave), roof]);
};
const all = (poly, e) => poly.map(() => e);

// Blinde nis met een spitse top (≥ 50 graden) in de rand a→b van een linksom
// doorlopen veelhoek, op afstand s vanaf a (standaard het midden).
const niche = ([ax, ay], [bx, by], w, z0, z1, { s, depth = 0.4 } = {}) => {
  const len = Math.hypot(bx - ax, by - ay);
  const d = [(bx - ax) / len, (by - ay) / len];
  const n = [d[1], -d[0]];
  const m = s ?? len / 2;
  const at = (k, o) => [ax + d[0] * m + d[0] * k + n[0] * o, ay + d[1] * m + d[1] * k + n[1] * o];
  const pts = [];
  for (const o of [-depth, 0.8]) {
    for (const k of [-w / 2, w / 2]) for (const z of [z0, z1]) pts.push([...at(k, o), z]);
    pts.push([...at(0, o), z1 + w * 0.65]);
  }
  return hull(pts);
};
// Steunbeer tegen een muur: voet (x, y), naar buiten n, breedte w, diepte d, tot
// hoogte h met een afzaat van 45 graden naar de muur, en een versnijding halverwege.
const buttress = ([x, y], [nx, ny], w, d, h) => {
  const l = Math.hypot(nx, ny);
  const [ux, uy] = [nx / l, ny / l];
  const P = (o, k, z) => [x + ux * o - uy * k, y + uy * o + ux * k, z];
  const step = (d0, d1, z0, z1) =>
    hull([...[-w / 2, w / 2].flatMap((k) => [P(-0.3, k, z0), P(d0, k, z0), P(-0.3, k, z1), P(d1, k, z1 - (d0 - d1)), P(d1, k, z1)])]);
  return union([step(d, d, BASE, h * 0.5), step(d, d * 0.6, h * 0.5 - 0.01, h * 0.5 + d * 0.4), hull([...[-w / 2, w / 2].flatMap((k) => [P(-0.3, k, h * 0.5 + d * 0.4 - 0.01), P(d * 0.6, k, h * 0.5 + d * 0.4 - 0.01), P(d * 0.6, k, h - d * 0.6), P(-0.3, k, h + 0.3)])])]);
};

// ---------- westelijke hallenkerk: drie evenwijdige zadeldaken ----------
// Nokken NAP +22,51 (zuid), +23,34 (midden), +22,45 (noord), hellingen 60 graden (3D BAG).
const south = [[-25.4, -13.7], [-4, -13.7], [-4, -4.5], [-25.4, -4.5]];
const nave = [[-16.6, -4.5], [-4, -4.5], [-4, 4.5], [-16.6, 4.5]];
const north = [[-24.8, 4.5], [-4, 4.5], [-4, 13.9], [-24.8, 13.9]];
const ridgeEave = (ridge, half, t = T60) => ridge - NAP - half * t;
const eS = ridgeEave(22.51, 4.6),
  eM = ridgeEave(23.34, 4.5),
  eN = ridgeEave(22.45, 4.7);
const westHall = union([
  // Zuidbeuk met volledig schild naar het westen.
  roofed(south, eS, 22, [{ t: T60, z: eS }, null, { t: T60, z: eS }, { t: T60, z: eS }]),
  roofed(nave, eM, 22, [{ t: T60, z: eM }, null, { t: T60, z: eM }, null]),
  // Noordbeuk met een wolfseind vanaf NAP +19.
  roofed(north, eN, 22, [{ t: T60, z: eN }, null, { t: T60, z: eN }, { t: T60, z: 19 - NAP }]),
]);

// ---------- breed dwarsschip: nok NAP +27,68 op x = 1,4, topgevels noord en zuid ----------
const transeptPoly = [[-5.9, -13.7], [8.7, -13.7], [8.7, 14.1], [-5.9, 14.1]];
const eT = ridgeEave(27.68, 7.3);
const transept = roofed(transeptPoly, eT, 27, [null, { t: T60, z: eT }, null, { t: T60, z: eT }]);
// Lage aanbouw tegen de noordarm (lessenaarsdak van 44 graden, goot NAP +9,6).
const northLean = roofed([[8.5, 9.9], [15.0, 9.9], [15.0, 14.1], [8.5, 14.1]], 9.6 - NAP, 13.6 - NAP, [null, { t: 0.966, z: 9.6 - NAP }, null, null]);
// Consistorie tegen de zuidkant: nok NAP +12,1 oost-west, schild naar het oosten.
const tA = Math.tan((59 * Math.PI) / 180);
const annexPoly = [[8.0, -16.2], [14.6, -16.2], [14.6, -9.8], [8.0, -9.8]];
const annex = roofed(annexPoly, 6.7 - NAP, 12.1 - NAP, [{ t: tA, z: 6.7 - NAP }, { t: tA, z: 6.7 - NAP }, { t: tA, z: 6.7 - NAP }, null]);

// ---------- drie koren met veelhoekige sluiting ----------
// [as y, halve breedte, start sluiting, einde, halve breedte eindvlak, nok NAP, helling]
const CHOIRS = {
  midden: [0, 4.3, 25.7, 27.6, 1.8, 22.19, 54.5],
  noord: [7.1, 2.8, 26.1, 27.9, 1.5, 19.17, 56],
  zuid: [-7.2, 2.9, 25.7, 27.45, 1.35, 19.48, 56],
};
const choirPoly = ([vc, h, us, ue, f]) => [[8.0, vc - h], [us, vc - h], [ue, vc - f], [ue, vc + f], [us, vc + h], [8.0, vc + h]];
const choirs = Object.values(CHOIRS).map((c) => {
  const t = Math.tan((c[6] * Math.PI) / 180);
  const eave = ridgeEave(c[5], c[1], t);
  const poly = choirPoly(c);
  return { poly, eave, solid: roofed(poly, eave, 22, poly.map((_, i) => (i === poly.length - 1 ? null : { t, z: eave }))) };
});

// ---------- steunberen (BAG) en vensters ----------
const butts = [
  ...[-24.95, -15.5, -10.35, -6.25].map((u) => [[u, -13.7], [0, -1], 0.95]),
  ...[-24.3, -15.1, -10.6, -6.3, -2.8, 5.65].map((u) => [[u, 13.9], [0, 1], 1.0]),
  [[-25.4, -13.15], [-1, 0], 1.0],
  [[-24.8, 13.2], [-1, 0], 0.7],
  ...[17.9, 22.6, 25.3].map((u) => [[u, -10.1], [0, -1], 0.85]),
  ...[18.5, 23.4, 25.7].map((u) => [[u, 9.9], [0, 1], 0.7]),
];
// Op de hoeken van elke koorsluiting een steunbeer langs de bissectrice.
for (const { poly } of choirs)
  for (const i of [1, 2, 3, 4]) {
    const [p, q, r] = [poly[i - 1], poly[i], poly[i + 1]];
    const n1 = [q[1] - p[1], -(q[0] - p[0])],
      n2 = [r[1] - q[1], -(r[0] - q[0])];
    const l1 = Math.hypot(...n1),
      l2 = Math.hypot(...n2);
    butts.push([q, [n1[0] / l1 + n2[0] / l2, n1[1] / l1 + n2[1] / l2], 0.7]);
  }
const buttresses = butts.map(([p, n, d]) => buttress(p, n, 0.95, d, Math.abs(p[1]) > 11 || p[0] < 0 ? eS - 1.5 : 11.0));

const windows = [];
const win = (a, b, w, s) => windows.push(niche(a, b, w, 3.6, eS - 2.6, { s }));
// Zuid- en noordbeuk: één venster per travee.
for (const u of [-20.05, -12.95, -8.35]) win([-4, -13.7], [-25.4, -13.7], u === -20.05 ? 2.6 : 2.0, -4 - u);
for (const u of [-19.7, -12.85, -8.45]) win([-24.8, 13.9], [-4, 13.9], u === -19.7 ? 2.6 : 2.0, u + 24.8);
// Grote vensters in de topgevels van het dwarsschip.
windows.push(niche([-5.9, -13.7], [8.7, -13.7], 4.0, 3.6, 13.0, { s: 7.3 }));
windows.push(niche([8.7, 14.1], [-5.9, 14.1], 4.0, 3.6, 13.0, { s: 7.3 }));
// Zijkoren en sluitingen: één hoog venster per vlak.
for (const u of [20.25, 23.95]) windows.push(niche([8, -10.1], [25.7, -10.1], 2.0, 3.2, 11.0, { s: u - 8 }));
for (const u of [16.75, 20.95, 24.55]) windows.push(niche([26.1, 9.9], [8, 9.9], 1.6, 3.2, 10.6, { s: 26.1 - u }));
for (const { poly, eave } of choirs)
  for (const i of [1, 2, 3]) {
    const [a, b] = [poly[i], poly[i + 1]];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    windows.push(niche(a, b, Math.min(1.8, len - 1.0), 3.2, eave - 2.4));
  }
// Middenkoor boven de zijkoren: hoge vensters in de zijvlakken van de sluiting zijn al
// meegenomen; de lange zijwanden zitten achter de zijkoren.

const church = union([westHall, transept, northLean, annex, ...choirs.map((c) => c.solid), ...buttresses])
  .subtract(union(windows))
  // Schoorsteen naast de toren aan de noordwestkant (AHN tot circa NAP +25).
  .add(box(-25.7, 5.8, 10, -24.7, 6.8, 23.0));

// ---------- scheve toren ----------
// Onderbouw 9,4 m in het vierkant tot +25,3 (NAP +27,3, vlakke omgang in de 3D BAG),
// bovengeleding 7,8 m tot de kroonlijst +36,2 (NAP +38,2), tentdak met vier
// uurwerkfrontons, lantaarn en kroon tot +46,2 (NAP +48,2). De top staat circa
// 1,6 m oostelijk en 0,4 m noordelijk uit het lood (AHN: hart van de kap
// tegenover het hart van de voet).
const TC = [-20.8, -0.2];
const LEAN = [1.6 / 36.2, 0.4 / 36.2];
const sq = (h, z0, z1, c = TC) => box(c[0] - h, c[1] - h, z0, c[0] + h, c[1] + h, z1);
const sqRing = (h, z, c = TC) => [[c[0] - h, c[1] - h, z], [c[0] + h, c[1] - h, z], [c[0] + h, c[1] + h, z], [c[0] - h, c[1] + h, z]];
const towerParts = [
  sq(4.7, BASE, 25.3),
  // Ommetselde omgang op +25,3 met schuine kraag naar de bovengeleding.
  hull([...sqRing(4.7, 24.7), ...sqRing(4.95, 25.3)]),
  sq(3.9, 25.0, 35.6),
  hull([...sqRing(3.9, 35.0), ...sqRing(4.4, 35.6)]),
  sq(4.4, 35.59, 36.2),
  // Tentdak, lantaarn, koepeltje en kroon.
  hull([...sqRing(3.7, 36.19), ...sqRing(0.95, 41.6)]),
  sq(0.85, 41.5, 43.6),
  hull([...sqRing(0.95, 43.59), [TC[0], TC[1], 45.1]]),
  hull([...sqRing(0.45, 44.6), ...sqRing(0.6, 45.6), [TC[0], TC[1], 46.2]]),
];
// Hoeksteunberen: aan elke hoek twee haakse beren, versneden, met pinakel op +27,5.
for (const sx of [-1, 1])
  for (const sy of [-1, 1]) {
    const cx = TC[0] + sx * 4.7,
      cy = TC[1] + sy * 4.7;
    towerParts.push(buttress([cx - sx * 0.6, cy], [0, sy], 1.2, sx < 0 ? 2.1 : 1.5, 23.5));
    towerParts.push(buttress([cx, cy - sy * 0.6], [sx, 0], 1.2, sx < 0 ? 1.9 : 1.5, 23.5));
    towerParts.push(box(cx - 0.5, cy - 0.5, 23.0, cx + 0.5, cy + 0.5, 26.6), hull([...sqRing(0.5, 26.59, [cx, cy]), [cx, cy, 28.6]]));
  }
// Uurwerkfrontons: blok met driehoekig fronton in het vlak van de bovengeleding.
for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
  const px = TC[0] + dx * 3.35,
    py = TC[1] + dy * 3.35,
    w = 1.1;
  const pts = [];
  for (const o of [-1.6, 0.75])
    for (const k of [-w, w]) {
      const x = px + dx * o - dy * k,
        y = py + dy * o + dx * k;
      pts.push([x, y, 36.1], [x, y, 39.4]);
    }
  for (const o of [-1.6, 0.75]) pts.push([px + dx * o, py + dy * o, 40.5]);
  towerParts.push(hull(pts));
}
const towerCuts = [];
const face = (dx, dy, h, c = TC) => {
  // Rand a→b van het torenvlak aan de kant (dx, dy), linksom.
  const [ax, ay] = [c[0] + dx * h + dy * h, c[1] + dy * h - dx * h];
  const [bx, by] = [c[0] + dx * h - dy * h, c[1] + dy * h + dx * h];
  return [[ax, ay], [bx, by]];
};
for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
  const [a, b] = face(dx, dy, 4.7);
  const [a2, b2] = face(dx, dy, 3.9);
  // Twee galmgaten in de onderbouw, twee vensters in de bovengeleding (foto's).
  for (const s of [-1.5, 1.5]) {
    towerCuts.push(niche(a, b, 1.7, 16.6, 22.2, { s: 4.7 + s }));
    towerCuts.push(niche(a2, b2, 1.5, 27.4, 32.8, { s: 3.9 + s }));
  }
}
// Westportaal met het grote venster erboven (spitse nis van 3,4 m).
const [wa, wb] = face(-1, 0, 4.7);
towerCuts.push(niche(wa, wb, 2.0, BASE, 4.2, { depth: 0.6 }), niche(wa, wb, 3.4, 5.6, 14.0, { depth: 0.5 }));
// Klokfrontons: ruitvormige wijzerplaat als nis.
const lean = (m) =>
  m.warp((v) => {
    const z = Math.max(0, v[2]);
    v[0] += LEAN[0] * z;
    v[1] += LEAN[1] * z;
  });
const tower = lean(union(towerParts).subtract(union(towerCuts)));

await writeLandmark({
  slug: "grote-kerk-schoonhoven",
  base: BASE,
  nodes: [
    ["building:hallenkerk-dwarsschip-en-drie-koren", church],
    ["building:scheve-toren-met-tentdak", tower],
  ],
  catalog: {
    name: "Grote of Bartholomeüskerk Schoonhoven",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-29, 0], [-12, -15.5], [-12, 15.5], [1, 15.5], [1, -15.5], [20, -12], [20, 12], [30.5, 0]],
    replacesBuildings: ["NL.IMBAG.Pand.0608100001224191"],
    description:
      "Oorsprong bij het zwaartepunt van het BAG-pand op NAP +2,0 m, +X oostwaarts langs de kerkas (8,9 graden linksom van RD-oost), toren aan de westkant. Westelijke hallenkerk met drie evenwijdige zadeldaken (nokken NAP +22,5/+23,3/+22,5, schild en wolfseind naar het westen), breed dwarsschip met nok NAP +27,7 en topgevels met grote vensters, drie oostkoren met veelhoekige sluiting en schilddaken (nokken NAP +19,2/+22,2/+19,5), consistorie en lage aanbouw, steunberen uit de BAG-contour en spitse vensternissen; scheve toren met hoeksteunberen en pinakels, galmgaten, omgang op NAP +27,3, bovengeleding met drie vensters per zijde tot NAP +38,2, tentdak met vier uurwerkfrontons, lantaarn en kroon tot NAP +48,2, circa 1,6 m oostwaarts uit het lood. Dakhellingen en nokken uit 3D BAG en AHN, torenmaten en vensters uit AHN en foto's geschat.",
    realWorld: {
      groundNapM: NAP,
      transeptRidgeNapM: 27.68,
      westRidgesNapM: [22.51, 23.34, 22.45],
      choirRidgesNapM: [19.48, 22.19, 19.17],
      roofPitchDeg: { west: 60, transept: 60, middleChoir: 54.5, sideChoirs: 56 },
      towerGalleryNapM: 27.3,
      towerCorniceNapM: 38.2,
      towerRoofTopNapM: 48.2,
      ahnTopNapM: 53,
      towerLeanM: [1.6, 0.4],
      bagFootprintM2: 1399.3,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Grote_of_Bartholome%C3%BCskerk",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/33472",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0608100001224191 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhellingen, nokken en goten",
      "https://commons.wikimedia.org/wiki/Category:Grote_of_Sint-Bartholome%C3%BCskerk_(Schoonhoven)",
      "https://commons.wikimedia.org/wiki/File:Bartholomeuskerk_Schoonhoven.jpg",
      "https://commons.wikimedia.org/wiki/File:Noordwest-gevel_-_Schoonhoven_-_20198365_-_RCE.jpg",
      "PDOK BAG-pand 0608100001224191, AHN DSM 0,5 m, Actueel_orthoHR, 2026-10-30",
    ],
  },
});

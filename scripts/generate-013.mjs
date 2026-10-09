// Genereert een vereenvoudigd, gesloten 3D-model van poppodium 013 in Tilburg
// (Veemarktstraat 44, geopend 1998, verbouwd 2016): de zwarte doos met het
// flauw gebogen dak dat van de kruin aan de parkeergarage naar de zuidhoek aan
// de Heuvel zakt, de toneeltoren, het lagere oostdeel met installaties, de
// uitkragende hoek met de ronde kolom boven de entree, de wit geplooide plint
// onder een schuine kraag, de drie gouden schijven van het logo en de lage
// strook en de gang langs de parkeergarage. Alle maten in meters op ware
// grootte. Uitvoer via efteling-kit.mjs: een GLB in meters (Y omhoog, één node
// `building:013`), een catalogus-JSON en een STL op 1:<schaal> (standaard
// 1:1000).
//
//   node scripts/generate-013.mjs
//
// Assenstelsel: oorsprong op RD (134610, 396578) op het maaiveld (NAP +14,5 m),
// Z omhoog. +X loopt langs de noordgevel tegen de parkeergarage (RD-richting
// 7,4 graden, naar het oosten), +Y 90 graden linksom (naar het noorden, de
// parkeergarage). De gevel aan de Veemarktstraat is de schuine westgevel, de
// entreehoek ligt in het zuiden op (-19,7, -26,1).
//
// Bronnen: BAG-pand 0855100000132248 (contour); AHN DSM/DTM 0,5 m (PDOK WCS) in
// het stelsel van het gebouw: het gebogen dak (parabool door 270 punten, kruin
// NAP +28,57 m op y = 20, kromtestraal 203 m, rest 0,19 m), de toneeltoren, het
// oostdeel, de dakopbouwen, de lage strook en de gang; PDOK luchtfoto; Wikipedia;
// Wikimedia Commons-foto's (Tilburg poppodium 013.jpg, 2005, en
// 013-Gebouw-02022017-JostijnLigtvoetFotografie-33.jpg) voor de plint, de
// uitkragende hoek, de schijven en de vensters. Geschat uit foto's: de
// plinthoogte (3,4 m), de diepte van de entree (1,6 m), de plooien, de plaats
// en maat van de schijven en de vensters, de naden tussen de gevelpanelen.
import { Manifold, CrossSection, ccw, prism, box, hull, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "013";
const GROUND = 14.5; // NAP-hoogte van het maaiveld rond het gebouw (AHN DTM)
const z = (nap) => nap - GROUND;
const BASE = -1;
const ORIGIN = [134610, 396578];
const ANGLE = 7.4;
const a = (ANGLE * Math.PI) / 180;
const X_AXIS = [+Math.cos(a).toFixed(6), +Math.sin(a).toFixed(6)];

// ---------- maten ----------
// BAG-pand 0855100000132248 in het lokale stelsel, zonder de gang langs de
// parkeergarage (die staat apart in GANG). Westgevel aan de Veemarktstraat van
// (-34,29, 25,54) naar de entreehoek (-19,71, -26,05), met een erker van 1,3 m
// tussen y = -6,9 en -2,5; de zuidgevel verspringt in treden naar het oosten.
const OUTLINE = [
  [3.87, -14.59], [9.55, -14.59], [9.55, -11.82], [9.85, -11.82], [9.85, -11.07], [15.63, -11.06],
  [15.63, -11.29], [16.08, -11.29], [16.08, -8.37], [22.07, -8.36], [22.08, -5.53], [28.19, -5.56],
  [28.22, -2.78], [37.47, -2.77], [37.48, 22.11], [16.19, 22.09], [16.19, 25.54], [-34.29, 25.54],
  [-32.74, 20.01], [-27.71, 2.14], [-26.21, -2.49], [-27.65, -2.51], [-26.44, -6.89], [-25.09, -6.87],
  [-19.71, -26.05],
];
// Gang van 6 m breed langs de oostgevel van de parkeergarage (AHN NAP +22,0 m).
const GANG = { x: [10.2, 16.19], y: [25.54, 67.64], top: z(22.0) };
// Gebogen dak (AHN): z = 27,581 + 0,09868 y - 0,002466 y^2 (NAP), kruin op y =
// 20,0 (NAP +28,57 m), aan de zuidhoek NAP +23,35 m. Het dak eindigt op y =
// 22,2; daarachter ligt tot de parkeergarage een lage strook op NAP +18,3 m.
const ROOF = { c0: 27.581, c1: 0.09868, c2: -0.002466, north: 22.2 };
const roofZ = (y) => z(ROOF.c0 + ROOF.c1 * y + ROOF.c2 * y * y);
const LOW_STRIP = z(18.3);
// Toneeltoren (AHN NAP +31,1 m, vlak).
const STAGE = { x: [8.8, 26.0], y: [-2.0, 21.6], top: z(31.1) };
// Oostdeel (AHN): vlak dak NAP +25,95 m ten zuiden van y = 12,6, twee
// installatieblokken met ventilatoren tot NAP +27,1 m, een opbouw tot NAP +27,5
// m langs de zuidrand en een lagere hoek op NAP +22,5 m.
const EAST = { x0: 25.9, y1: 12.6, top: z(25.95) };
const UNITS = [[28.5, 30.7], [31.4, 34.6]].map(([x0, x1]) => ({ x: [x0, x1], y: [3.5, 11.5], top: z(27.1) }));
const SHAFT = { x: [33.5, 37.48], y: [-0.5, 2.0], top: z(27.5) };
const SE_LOW = { x: [29.5, 37.48], y: [-3, -0.5], top: z(22.5) };
// Dakopbouwen op het gebogen dak (AHN): een blok tot NAP +29,2 m tegen de
// toneeltoren en een lichtkap die van NAP +27,55 m (y = -1,6) naar NAP +28,6 m
// (y = -8,6) oploopt.
const BLOCK = { x: [1.6, 9.8], y: [-8.6, -1.3], top: z(29.2) };
const SHED = { x: [-19.5, -4.5], y: [-8.6, -1.6], low: z(27.55), high: z(28.6) };
// Plint (foto's): 3,4 m hoog, 0,5 m terug onder een kraag van 45 graden, met
// verticale plooien om de 1,2 m tot 0,2 m achter de gevel.
const PLINTH = { top: 3.4, inset: 0.5, pleat: 1.2, pleatOut: 0.2 };
// Entree in de zuidhoek (foto 2005): 1,6 m diep onder de uitkragende hoek, 4 m
// langs de westgevel en 9 m langs de zuidgevel, plafond onder 45 graden, ronde
// kolom van 0,9 m op de hoek.
const ENTRY = { depth: 1.6, west: 4, south: 9, column: 0.45 };
// Glazen pui van het café in de westgevel bij de erker (foto's), 1 m diep.
const CAFE = { y: [-8.5, 4.5], depth: 1.0 };
// Drie gouden schijven van het logo boven aan het noordeinde van de westgevel
// (foto's): straal 1,4 m, 0,9 m dik (printbaar op 1:1000), trapsgewijs.
const DISCS = { y: [19.6, 18.1, 16.6], dz: [0, -0.55, -1.1], radius: 1.4, thick: 0.9, out: 0.5 };
// Vensters als blinde nissen van 0,4 m: één groot raam hoog in de westgevel en
// vier smalle ramen hoog in de zuidgevel bij het oosteinde.
const WINDOW_WEST = { y: 9.5, half: 1.3, z: [5.6, 8.2] };
const WINDOWS_SOUTH = [17.2, 19.6, 24.2, 26.6];
// Naden tussen de zwarte gevelpanelen: om de 2,7 m, 0,3 m breed en 0,15 m diep.
const SEAM = { pitch: 2.7, width: 0.3, depth: 0.15 };

// ---------- hulpfuncties ----------
const outline = ccw(OUTLINE);
const footprint = new CrossSection([outline]);
// Lichaam langs de rand a→b: profiel in (d, z) met d de afstand naar binnen
// (links van de looprichting van een linksom lopende contour), uitgetrokken
// over de lengte van de rand.
function alongEdge(pa, pb, profile, s0 = 0, s1 = null) {
  const L = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
  const dir = [(pb[0] - pa[0]) / L, (pb[1] - pa[1]) / L];
  const n = [-dir[1], dir[0]];
  const e = s1 ?? L;
  const phi = (Math.atan2(n[1], n[0]) * 180) / Math.PI;
  return Manifold.extrude([ccw(profile)], e - s0)
    .rotate([90, 0, 0])
    .rotate([0, 0, phi])
    .translate([pa[0] + dir[0] * s0, pa[1] + dir[1] * s0, 0]);
}
const edgeFrame = (pa, pb) => {
  const L = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
  const dir = [(pb[0] - pa[0]) / L, (pb[1] - pa[1]) / L];
  const n = [-dir[1], dir[0]];
  return { L, at: (s, d) => [pa[0] + dir[0] * s + n[0] * d, pa[1] + dir[1] * s + n[1] * d] };
};
// Randen van de contour (linksom) met de gevels die een plint hebben: de
// westgevel aan de Veemarktstraat en de zuidgevel tot het oosteinde.
const edges = outline.map((p, i) => [p, outline[(i + 1) % outline.length]]);
const isFront = ([pa, pb]) => {
  const mid = [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2];
  const west = mid[0] < -18 && Math.abs(pa[1] - pb[1]) > 0.5;
  const south = mid[1] < -2 && mid[0] > -20;
  return west || south;
};
const frontEdges = edges.filter(isFront);
const CORNER = [-19.71, -26.05];
const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6;

// ---------- massa ----------
const parts = [];
// Gebogen dak: profiel in (y, z) langs X uitgetrokken, binnen de contour.
const arc = [];
for (let y = -27; y <= ROOF.north + 1e-9; y += 0.5) arc.push([y, roofZ(y)]);
const roofProfile = [[-27, BASE], [ROOF.north, BASE], ...arc.reverse()];
const vault = Manifold.extrude([ccw(roofProfile)], 80).rotate([90, 0, 90]).translate([-40, 0, 0]);
const body = Manifold.extrude(footprint, 40).translate([0, 0, BASE]);
parts.push(body.intersect(vault).subtract(box(EAST.x0, -10, EAST.top, 40, EAST.y1, 40)));
// Lage strook tussen het dak en de parkeergarage.
parts.push(body.intersect(box(-40, ROOF.north - 0.5, BASE, 40, 30, LOW_STRIP)));
parts.push(box(GANG.x[0], GANG.y[0] - 0.5, BASE, GANG.x[1], GANG.y[1], GANG.top));
parts.push(box(STAGE.x[0], STAGE.y[0], BASE, STAGE.x[1], STAGE.y[1], STAGE.top));
for (const u of [...UNITS, SHAFT, BLOCK]) parts.push(box(u.x[0], u.y[0], 0, u.x[1], u.y[1], u.top));
parts.push(body.intersect(box(SE_LOW.x[0], SE_LOW.y[0] - 1, BASE, SE_LOW.x[1], SE_LOW.y[1], SE_LOW.top)));
// Lichtkap: hellend vlak van de lage noordrand naar de hoge zuidrand.
parts.push(
  hull([
    [SHED.x[0], SHED.y[1], 5], [SHED.x[1], SHED.y[1], 5], [SHED.x[0], SHED.y[0], 5], [SHED.x[1], SHED.y[0], 5],
    [SHED.x[0], SHED.y[1], SHED.low], [SHED.x[1], SHED.y[1], SHED.low],
    [SHED.x[0], SHED.y[0], SHED.high], [SHED.x[1], SHED.y[0], SHED.high],
  ]),
);
// Gouden schijven aan het noordeinde van de westgevel, met een steun van 45
// graden naar de gevel eronder.
{
  // Westgevel tussen (-27,71, 2,14) en (-32,74, 20,01), van zuid naar noord.
  const [pa, pb] = [[-27.71, 2.14], [-32.74, 20.01]];
  const L = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
  const dir = [(pb[0] - pa[0]) / L, (pb[1] - pa[1]) / L];
  const out = [-dir[1], dir[0]]; // naar buiten (west)
  const deg = (Math.atan2(dir[1], dir[0]) * 180) / Math.PI;
  DISCS.y.forEach((y, i) => {
    const s = (y - pa[1]) / dir[1];
    const foot = [pa[0] + dir[0] * s, pa[1] + dir[1] * s];
    const c = [foot[0] + out[0] * DISCS.out, foot[1] + out[1] * DISCS.out];
    const zc = roofZ(y) - 0.6 + DISCS.dz[i];
    // Schijf met de as langs de gevel.
    const disc = Manifold.cylinder(DISCS.thick, DISCS.radius, DISCS.radius, 40, true)
      .rotate([0, 90, 0])
      .rotate([0, 0, deg])
      .translate([c[0], c[1], zc]);
    // Steun onder 45 graden: omhulsel met een lat op de gevel eronder.
    const reach = DISCS.out + DISCS.radius;
    const lath = Manifold.cube([0.02, DISCS.thick, 0.02], true).rotate([0, 0, deg + 90]).translate([foot[0] - out[0] * 0.3, foot[1] - out[1] * 0.3, zc - reach - 0.3]);
    parts.push(Manifold.hull([disc, lath]));
  });
}
let model = union(parts);

// ---------- uitsparingen ----------
const cuts = [];
// Plint: 0,5 m terug onder een kraag van 45 graden langs de voorgevels.
const plinthProfile = [[-1, BASE - 1], [PLINTH.inset, BASE - 1], [PLINTH.inset, PLINTH.top - PLINTH.inset], [0, PLINTH.top], [-1, PLINTH.top]];
for (const [pa, pb] of frontEdges) cuts.push(alongEdge(pa, pb, plinthProfile, -0.02, null));
// Entree onder de uitkragende hoek: dieper, met een plafond van 45 graden.
const entryProfile = [[-1, BASE - 1], [ENTRY.depth, BASE - 1], [ENTRY.depth, PLINTH.top - ENTRY.depth], [0, PLINTH.top], [-1, PLINTH.top]];
for (const [pa, pb] of frontEdges) {
  if (near(pb, CORNER)) {
    const L = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
    cuts.push(alongEdge(pa, pb, entryProfile, L - ENTRY.west, L + 1));
  }
  if (near(pa, CORNER)) cuts.push(alongEdge(pa, pb, entryProfile, -1, ENTRY.south));
}
// Café-pui in de westgevel bij de erker.
const cafeProfile = [[-1, BASE - 1], [CAFE.depth, BASE - 1], [CAFE.depth, PLINTH.top - CAFE.depth], [0, PLINTH.top], [-1, PLINTH.top]];
for (const [pa, pb] of frontEdges) {
  const ylo = Math.min(pa[1], pb[1]);
  const yhi = Math.max(pa[1], pb[1]);
  if (pa[0] < -18 && yhi > CAFE.y[0] && ylo < CAFE.y[1]) {
    const L = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
    const sAt = (y) => ((y - pa[1]) / (pb[1] - pa[1])) * L;
    const [s0, s1] = [sAt(CAFE.y[0]), sAt(CAFE.y[1])].sort((p, q) => p - q);
    cuts.push(alongEdge(pa, pb, cafeProfile, Math.max(-0.5, s0), Math.min(L + 0.5, s1)));
  }
}
// Naden tussen de gevelpanelen boven de plint.
for (const [pa, pb] of frontEdges) {
  const f = edgeFrame(pa, pb);
  for (let s = SEAM.pitch; s < f.L - 0.6; s += SEAM.pitch) {
    const p = f.at(s, 0);
    const top = Math.max(PLINTH.top + 1, roofZ(p[1]) - 0.5);
    cuts.push(alongEdge(pa, pb, [[-1, PLINTH.top + 0.4], [SEAM.depth, PLINTH.top + 0.4 + SEAM.depth], [SEAM.depth, top], [-1, top]], s - SEAM.width / 2, s + SEAM.width / 2));
  }
}
// Ook op de oost- en noordgevel van het oostdeel (achterkant, zonder plint).
for (const [pa, pb] of edges.filter(([pa, pb]) => pa[0] > 16 && pb[0] > 16 && (pa[0] > 37 || pa[1] > 22))) {
  const f = edgeFrame(pa, pb);
  for (let s = SEAM.pitch; s < f.L - 0.6; s += SEAM.pitch) {
    const p = f.at(s, 0);
    const top = (p[1] < EAST.y1 ? EAST.top : roofZ(p[1])) - 0.5;
    cuts.push(alongEdge(pa, pb, [[-1, 1.2], [SEAM.depth, 1.2 + SEAM.depth], [SEAM.depth, top], [-1, top]], s - SEAM.width / 2, s + SEAM.width / 2));
  }
}
// Venster hoog in de westgevel.
for (const [pa, pb] of frontEdges) {
  if (pa[0] < -18 && Math.min(pa[1], pb[1]) < WINDOW_WEST.y && Math.max(pa[1], pb[1]) > WINDOW_WEST.y) {
    const L = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
    const s = ((WINDOW_WEST.y - pa[1]) / (pb[1] - pa[1])) * L;
    const h = WINDOW_WEST.half * L / Math.abs(pb[1] - pa[1]);
    cuts.push(alongEdge(pa, pb, [[-1, WINDOW_WEST.z[0]], [0.4, WINDOW_WEST.z[0] + 0.4], [0.4, WINDOW_WEST.z[1]], [-1, WINDOW_WEST.z[1]]], s - h, s + h));
  }
}
// Smalle vensters hoog in de zuidgevel.
for (const x of WINDOWS_SOUTH) {
  const e = frontEdges.find(([pa, pb]) => Math.min(pa[0], pb[0]) < x - 0.6 && Math.max(pa[0], pb[0]) > x + 0.6 && Math.abs(pa[1] - pb[1]) < 0.1);
  if (!e) throw new Error(`geen zuidgevel bij x = ${x}`);
  const [pa, pb] = e;
  const s = Math.abs(x - pa[0]);
  cuts.push(alongEdge(pa, pb, [[-1, 5.6], [0.4, 6.0], [0.4, 7.4], [-1, 7.4]], s - 0.45, s + 0.45));
}
model = model.subtract(union(cuts));

// Plooien in de plint en de ronde kolom op de entreehoek.
const adds = [];
for (const [pa, pb] of frontEdges) {
  const f = edgeFrame(pa, pb);
  for (let s = 0; s + PLINTH.pleat <= f.L + 1e-6; s += PLINTH.pleat) {
    const mid = f.at(s + PLINTH.pleat / 2, 0);
    // Geen plooien in de entree en de café-pui.
    const dEntry = Math.hypot(mid[0] - CORNER[0], mid[1] - CORNER[1]);
    if ((near(pb, CORNER) && f.L - s < ENTRY.west + PLINTH.pleat) || (near(pa, CORNER) && s < ENTRY.south)) continue;
    if (mid[0] < -18 && mid[1] > CAFE.y[0] - 0.6 && mid[1] < CAFE.y[1] + 0.6) continue;
    if (dEntry < 0.5) continue;
    const tri = [f.at(s, PLINTH.inset + 0.05), f.at(s + PLINTH.pleat / 2, PLINTH.pleatOut), f.at(s + PLINTH.pleat, PLINTH.inset + 0.05)];
    adds.push(prism(tri, BASE, PLINTH.top - PLINTH.inset));
  }
}
{
  // Kolom op de bissectrice van de hoek, 0,6 m binnen beide gevels.
  const ei = frontEdges.find(([, pb]) => near(pb, CORNER));
  const eo = frontEdges.find(([pa]) => near(pa, CORNER));
  const u1 = [ei[0][0] - CORNER[0], ei[0][1] - CORNER[1]];
  const u2 = [eo[1][0] - CORNER[0], eo[1][1] - CORNER[1]];
  const l1 = Math.hypot(...u1), l2 = Math.hypot(...u2);
  const bis = [u1[0] / l1 + u2[0] / l2, u1[1] / l1 + u2[1] / l2];
  const lb = Math.hypot(...bis);
  const half = Math.acos((u1[0] * u2[0] + u1[1] * u2[1]) / (l1 * l2)) / 2;
  const dist = (ENTRY.column + 0.15) / Math.sin(half);
  const c = [CORNER[0] + (bis[0] / lb) * dist, CORNER[1] + (bis[1] / lb) * dist];
  adds.push(Manifold.cylinder(PLINTH.top + 0.5 - BASE, ENTRY.column, ENTRY.column, 32, false).translate([c[0], c[1], BASE]));
}
model = union([model, ...adds]);

if (model.status() !== "NoError") throw new Error(model.status());
if (model.decompose().length !== 1) throw new Error(`losse delen: ${model.decompose().length}`);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:013", model]],
  catalog: {
    name: "013",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: -0.3,
    // Veemarktstraat, de Heuvel voor de entreehoek, het pad langs de zuidgevel
    // en de achterkant in het oosten (AHN NAP +14,4 tot +14,5 m).
    groundSamplePoints: [
      [-38, 5],
      [-24, -30],
      [8, -19],
      [40, -8],
    ],
    // Laagste PDOK-terreinhoogte op die punten, ellipsoïdisch zoals de export
    // bemonstert (gemeten 2026-10-09), als terugval voor een uitsnede die
    // geen van de punten bevat.
    groundHeight: 58.19,
    replacesBuildings: ["NL.IMBAG.Pand.0855100000132248"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt RD (134610, 396578) op het maaiveld (NAP +14,5 m) in de oorsprong, +X langs de noordgevel tegen de parkeergarage (RD-richting 7,4 graden) en +Y naar het noorden. Eén node: de zwarte doos met het gebogen dak, de toneeltoren, het oostdeel, de geplooide plint onder een kraag, de entreehoek met kolom en de gouden schijven. Vervangt de PDOK-reconstructie van BAG-pand 0855100000132248; de parkeergarage ernaast (0855100000132247) blijft PDOK.",
    realWorld: {
      groundNapM: GROUND,
      roofCrestNapM: 28.57,
      roofCornerNapM: +(roofZ(-26.05) + GROUND).toFixed(2),
      roofRadiusM: 203,
      stageTowerNapM: 31.1,
      eastRoofNapM: 25.95,
      plinthM: PLINTH.top,
      axisDegrees: ANGLE,
      estimates: [
        "plinthoogte, kraag en plooien van de plint uit foto's",
        "diepte van de entree en de café-pui, de ronde kolom op de hoek",
        "plaats, maat en stand van de drie gouden schijven",
        "vensters en naden tussen de gevelpanelen",
      ],
    },
    sources: [
      "https://nl.wikipedia.org/wiki/013",
      "PDOK BAG pand 0855100000132248, EPSG:28992",
      "PDOK AHN DSM/DTM 0,5 m via WCS: gebogen dak, toneeltoren, oostdeel, dakopbouwen, lage strook, gang en maaiveld",
      "PDOK luchtfoto (Actueel_orthoHR)",
      "Wikimedia Commons: Tilburg poppodium 013.jpg, 013-Gebouw-02022017-JostijnLigtvoetFotografie-33.jpg",
    ],
  },
});

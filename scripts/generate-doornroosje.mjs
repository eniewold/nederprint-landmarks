// Genereert een vereenvoudigd, gesloten 3D-model van poppodium Doornroosje in
// Nijmegen (Stationsplein 11, geopend 2014, ontwerp Sjoerd Soeters) met de
// studentenwoningen Talia erboven, die samen één BAG-pand zijn: de witte,
// gefacetteerde sokkel van het poppodium met driehoekige ramen en schuine
// glazen entrees, de glazen strook en de donkere bakstenen band die boven de
// sokkel uitkraagt, het dek met de daktuin, de hoge L-vormige woonschijf langs
// het Stationsplein met de witte vierkante raamkaders en de balkontoren aan
// de oostkop, en de lagere woonvleugel langs het spoor met de wit gefacetteerde
// spoorgevel en galerijen aan de hofzijde. Alle maten in meters op ware
// grootte. Uitvoer via efteling-kit.mjs: een GLB in meters (Y omhoog, één node
// `building:doornroosje`), een catalogus-JSON en een STL op 1:<schaal>
// (standaard 1:1000, vanaf 1 m onder het Stationsplein).
//
//   node scripts/generate-doornroosje.mjs
//
// Assenstelsel: oorsprong op RD (187150, 428545) op het Stationsplein (NAP
// +24,3 m), Z omhoog. +X loopt langs de gevel aan het Stationsplein (RD-richting
// -16,9 graden, naar het oostzuidoosten), +Y 90 graden linksom langs het spoor
// (naar het noordnoordoosten). Aan de noordoostkant ligt de weg naar de
// spoortunnel 9 m lager (NAP +15 m); de onderkant ligt daarom op -9,6 m.
//
// Bronnen: BAG-pand 0268100000086018 (contour); AHN DSM/DTM 0,5 m (PDOK WCS) in
// het stelsel van het gebouw: dek NAP +38,2 m, hoge schijf +68,5 m, westvleugel
// +59,5 m, borstwering van de spoorgevel +60,3 en +69,3 m, opbouw op het dek,
// maaiveld en de lage weg; PDOK luchtfoto; Wikipedia; Wikimedia
// Commons-foto's (Doornroosje Talia 2016.jpg, Doornroosje Nijmegen SSHN
// Talia.jpg, Talia-Doornroosje, Stationsplein, Nijmegen.jpg, Station Nijmegen
// Spoor 35.jpg) voor de sokkel, de band, de raamkaders, de balkontoren, de
// galerijen en de spoorgevel. Geschat uit foto's: hoogte van sokkel (8,6 m),
// glazen strook en band, hoe ver de band uitkraagt, de plaats en maat van de
// ramen en entrees, de raamkaders, de balkontoren, de galerijen en de facetten.
import { Manifold, CrossSection, ccw, prism, box, hull, union, writeLandmark, toStl, scale } from "./efteling-kit.mjs";
import { writeFile } from "node:fs/promises";
import path from "node:path";

const slug = "doornroosje";
const GROUND = 24.3; // NAP-hoogte van het Stationsplein (AHN DTM)
const z = (nap) => nap - GROUND;
const BASE = -9.6; // weg aan de noordoostkant op NAP +15 m
const ORIGIN = [187150, 428545];
const ANGLE = -16.9;
const a = (ANGLE * Math.PI) / 180;
const X_AXIS = [+Math.cos(a).toFixed(6), +Math.sin(a).toFixed(6)];

// ---------- maten ----------
// BAG-pand 0268100000086018 in het lokale stelsel (zonder trapjes onder 0,5 m),
// linksom vanaf de zuidwesthoek aan het spoor.
const OUTLINE = [
  [-21.19, -35.04], [38.84, -35.04], [38.84, -2.97], [27.14, 9.81], [22.36, 14.97], [-4.88, 44.4], [-21.19, 44.5],
];
// Sokkel van het poppodium (foto's): wit tot 8,6 m, glazen strook tot 10 m,
// daarboven de bakstenen band tot het dek (AHN NAP +38,2 m). De sokkel ligt
// terug onder de band: 1,2 m aan het Stationsplein, 3 m aan de oostkant, 2 m
// aan de noordkant; aan het spoor loopt de gevel door met een glazen pui.
const PLINTH = 8.6;
const RIBBON = 10.0;
const DECK = z(38.2);
const INSET = { south: 1.2, east: 3.0, north: 2.0, ribbon: 0.5 };
// Hoge L-vormige woonschijf (AHN NAP +68,5 m) langs het Stationsplein en de
// zuidhoek aan het spoor; balkontoren aan de oostkop (foto's).
const TALL = { top: z(68.5), south: [-21.19, 34.0, -35.04, -21.2], corner: [-21.19, -8.2, -21.2, -12.3] };
const STACK = { x: [34.0, 36.8], y: [-34.5, -21.7], from: 21.0, column: 35.4 };
// Lagere woonvleugel langs het spoor (AHN NAP +59,5 m), noordkop op y = 30,4
// met een inham aan de spoorkant; galerijen aan de hofzijde.
const WING = { x: [-21.19, -7.9], y: [-12.3, 30.4], top: z(59.5), notch: [-20.0, -17.2, 27.6, 30.4] };
// Borstwering van de wit gefacetteerde spoorgevel (AHN NAP +60,3 en +69,3 m).
const PARAPET = { x: [-21.19, -20.3], wing: z(60.3), tall: z(69.3) };
// Opbouw op het dek aan de noordkant (AHN NAP +40,8 m) en de bakstenen
// laadtoren aan het noordeinde van de oostgevel (foto).
const ROOFBOX = [-20.0, -14.0, 41.0, 43.6, z(40.8)];
const LOADING = [35.3, 38.84, -6.5, -2.97];
// Gevel van de hoge schijf aan het Stationsplein (foto 2016, perspectief
// rechtgezet): drie raamvelden met witte vierkante kaders, een gekleurde
// strook aan de spoorkant, twee smalle raamkolommen en een gekleurde inham
// onderaan bij de oostkop.
const FIELDS = [[-3.5, 4.5], [5.6, 13.3], [14.9, 22.2]];
const SQUARES = { z: [20.5, 28.7, 36.9], half: 2.5, halfZ: 3.0 };
const COLOURED = [-17.3, -9.3];
const SLITS = [[23.8, 24.6], [25.6, 26.4]];
const NOTCH = { x: [27.2, 32.5], z: [14.5, 22.0] };
const FLOOR = 3.03;

// ---------- hulpfuncties ----------
// Lichaam langs de rand a→b: profiel in (d, z) met d de afstand naar binnen
// (links van de looprichting), uitgetrokken van s0 tot s1 langs de rand.
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
// Nis met een plafond van 45 graden: diepte d, van z0 tot z1.
const niche = (d, z0, z1) => [[-1, z0], [d, z0], [d, Math.max(z0, z1 - d)], [0, z1], [-1, z1]];
// Driehoekig raam met de punt naar beneden (in het (s, z)-vlak), diepte d.
function vWindow(pa, pb, s, d, top, width, height) {
  const L = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
  const dir = [(pb[0] - pa[0]) / L, (pb[1] - pa[1]) / L];
  const n = [-dir[1], dir[0]];
  const p = (ss, dd, zz) => [pa[0] + dir[0] * ss + n[0] * dd, pa[1] + dir[1] * ss + n[1] * dd, zz];
  return hull([
    p(s - width / 2, -1, top), p(s + width / 2, -1, top), p(s, -1, top - height),
    p(s - width / 2, d, top), p(s + width / 2, d, top), p(s, d, top - height),
  ]);
}
// Schuine glazen pui: parallellogram in het (s, z)-vlak met een hellende
// bovenrand van zA (bij s0) naar zB (bij s1), diepte d.
function slantedGlass(pa, pb, s0, s1, zA, zB, d) {
  const L = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
  const dir = [(pb[0] - pa[0]) / L, (pb[1] - pa[1]) / L];
  const n = [-dir[1], dir[0]];
  const p = (ss, dd, zz) => [pa[0] + dir[0] * ss + n[0] * dd, pa[1] + dir[1] * ss + n[1] * dd, zz];
  return hull([
    p(s0, -1, BASE - 1), p(s1, -1, BASE - 1), p(s0, -1, zA), p(s1, -1, zB),
    p(s0, d, BASE - 1), p(s1, d, BASE - 1), p(s0, d, zA - d), p(s1, d, zB - d),
  ]);
}
const [SW, SE, E1, NE1, NE2, NW, NWW] = OUTLINE;
const EDGE = {
  south: [SW, SE],
  east: [SE, E1],
  ne1: [E1, NE1],
  ne2: [NE1, NE2],
  ne3: [NE2, NW],
  north: [NW, NWW],
  west: [NWW, SW],
};

// ---------- massa ----------
const parts = [];
const footprint = new CrossSection([ccw(OUTLINE)]);
parts.push(Manifold.extrude(footprint, DECK - BASE).translate([0, 0, BASE]));
const [sx0, sx1, sy0, sy1] = TALL.south;
parts.push(box(sx0, sy0, DECK - 0.1, sx1, sy1, TALL.top));
const [cx0, cx1, cy0, cy1] = TALL.corner;
parts.push(box(cx0, cy0 - 0.1, DECK - 0.1, cx1, cy1, TALL.top));
// Balkontoren aan de oostkop: smalle kolom tot 21 m, daarboven de volle toren
// met een kraag van 45 graden.
parts.push(box(STACK.x[0] - 0.1, STACK.y[0], DECK - 0.1, STACK.column, STACK.y[1], STACK.from));
parts.push(
  hull([
    [STACK.x[0] - 0.1, STACK.y[0], STACK.from - (STACK.x[1] - STACK.column)], [STACK.column, STACK.y[0], STACK.from - (STACK.x[1] - STACK.column)],
    [STACK.x[0] - 0.1, STACK.y[1], STACK.from - (STACK.x[1] - STACK.column)], [STACK.column, STACK.y[1], STACK.from - (STACK.x[1] - STACK.column)],
    [STACK.x[0] - 0.1, STACK.y[0], TALL.top], [STACK.x[1], STACK.y[0], TALL.top], [STACK.x[0] - 0.1, STACK.y[1], TALL.top], [STACK.x[1], STACK.y[1], TALL.top],
    [STACK.x[1], STACK.y[0], STACK.from], [STACK.x[1], STACK.y[1], STACK.from],
  ]),
);
parts.push(box(WING.x[0], WING.y[0] - 0.1, DECK - 0.1, WING.x[1], WING.y[1], WING.top).subtract(box(WING.notch[0], WING.notch[2], DECK, WING.notch[1], WING.notch[3] + 1, WING.top + 1)));
parts.push(box(PARAPET.x[0], WING.y[0], DECK, PARAPET.x[1], WING.notch[3] - 0.9, PARAPET.wing));
parts.push(box(PARAPET.x[0], TALL.south[2], DECK, PARAPET.x[1], WING.y[0], PARAPET.tall));
parts.push(box(ROOFBOX[0], ROOFBOX[2], DECK - 0.1, ROOFBOX[1], ROOFBOX[3], ROOFBOX[4]));
let model = union(parts);

// ---------- sokkel, entrees en ramen ----------
const cuts = [];
const plinthProfile = (inset) => [[-1, BASE - 1], [inset, BASE - 1], [inset, PLINTH], [inset + INSET.ribbon, PLINTH], [inset + INSET.ribbon, RIBBON], [-1, RIBBON]];
cuts.push(alongEdge(...EDGE.south, plinthProfile(INSET.south), -0.05, null));
cuts.push(alongEdge(...EDGE.east, plinthProfile(INSET.east), -0.05, null));
for (const k of ["ne1", "ne2", "ne3", "north"]) cuts.push(alongEdge(...EDGE[k], plinthProfile(INSET.north), -0.05, null));
// Glazen pui aan het spoor onder de gefacetteerde gevel.
cuts.push(alongEdge(...EDGE.west, niche(1.0, BASE - 1, 4.2), -0.05, null));
model = model.subtract(union(cuts));

const plinthCuts = [];
// Stationsplein: glazen entree van Talia aan de spoorkant, een lange lage
// raamstrook, twee driehoekige ramen en de schuine glazen hoek van Doornroosje.
const S = EDGE.south;
plinthCuts.push(alongEdge(...S, niche(INSET.south + 0.8, BASE - 1, 5.0), 1.7, 12.2));
plinthCuts.push(alongEdge(...S, niche(INSET.south + 0.4, 3.0, 4.4), 20.7, 34.7));
for (const s of [42.6, 55.8]) plinthCuts.push(vWindow(...S, s, INSET.south + 0.4, PLINTH, 3.2, 3.8));
plinthCuts.push(slantedGlass(...S, 49.0, 60.5, 6.4, 3.4, INSET.south + 0.8));
// Oostgevel: de schuine glazen hoek loopt om, een driehoekig raam, de grote
// schuine pui met de trap naar de fietsenstalling en nog een driehoekig raam.
const E = EDGE.east;
plinthCuts.push(slantedGlass(...E, -0.5, 9.0, 3.4, 6.2, INSET.east + 0.8));
plinthCuts.push(vWindow(...E, 11.5, INSET.east + 0.4, PLINTH, 3.2, 3.8));
plinthCuts.push(slantedGlass(...E, 14.0, 24.0, 3.6, 6.6, INSET.east + 0.8));
plinthCuts.push(vWindow(...E, 26.5, INSET.east + 0.4, PLINTH, 3.2, 3.8));
// Noordkant boven de lage weg: twee driehoekige ramen.
for (const s of [12, 26]) plinthCuts.push(vWindow(...EDGE.ne3, s, INSET.north + 0.4, PLINTH, 3.2, 3.8));
model = model.subtract(union(plinthCuts));
// Bakstenen laadtoren aan het noordeinde van de oostgevel, tot het dek.
model = union([model, box(LOADING[0], LOADING[2], BASE, LOADING[1], LOADING[3], DECK)]);

// ---------- gevels van de woonschijven ----------
const facade = [];
// Stationsplein: raamvelden 0,35 m terug, met de witte kaders als volle
// vlakken erin en een raam in het midden van elk kader.
const sFace = [[TALL.south[0], TALL.south[2]], [TALL.south[1], TALL.south[2]]];
const xs = (x) => x - TALL.south[0];
for (const [x0, x1] of FIELDS) facade.push(alongEdge(...sFace, niche(0.35, DECK + 1.0, TALL.top - 1.3), xs(x0), xs(x1)));
facade.push(alongEdge(...sFace, niche(0.35, DECK + 0.6, TALL.top - 1.3), xs(COLOURED[0]), xs(COLOURED[1])));
for (const [x0, x1] of SLITS) facade.push(alongEdge(...sFace, niche(0.3, DECK + 1.0, TALL.top - 1.3), xs(x0), xs(x1)));
facade.push(alongEdge(...sFace, niche(0.6, NOTCH.z[0], NOTCH.z[1]), xs(NOTCH.x[0]), xs(NOTCH.x[1])));
model = model.subtract(union(facade));
const frames = [];
for (const [x0, x1] of FIELDS) {
  const xc = (x0 + x1) / 2;
  for (const zc of SQUARES.z) frames.push(box(xc - SQUARES.half, TALL.south[2], zc - SQUARES.halfZ, xc + SQUARES.half, TALL.south[2] + 0.45, zc + SQUARES.halfZ));
}
model = union([model, ...frames]);
const windows = [];
for (const [x0, x1] of FIELDS) {
  const xc = (x0 + x1) / 2;
  for (const zc of SQUARES.z) windows.push(alongEdge(...sFace, niche(0.35, zc - 0.9, zc + 0.9), xs(xc - 0.7), xs(xc + 0.7)));
}
// Galerijen en balkons aan de hofzijde: per verdieping een band van 1 m diep
// met een plafond van 45 graden, tussen dichte vloerranden van 0,9 m.
const gallery = (pa, pb, floors, top) => {
  for (let k = 0; k < floors; k++) {
    const z0 = DECK + k * FLOOR + 0.9;
    const z1 = Math.min(DECK + (k + 1) * FLOOR, top - 0.6);
    if (z1 - z0 > 1.2) windows.push(alongEdge(pa, pb, niche(1.0, z0, z1), 0.6, Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) - 0.6));
  }
};
gallery([WING.x[1], WING.y[0]], [WING.x[1], WING.y[1]], 7, WING.top);
gallery([STACK.x[0], TALL.south[3]], [TALL.corner[1], TALL.south[3]], 10, TALL.top);
gallery([STACK.x[1], STACK.y[0]], [STACK.x[1], STACK.y[1]], 10, TALL.top);
model = model.subtract(union(windows));

// ---------- wit gefacetteerde spoorgevel ----------
// Een raster van knopen op de westgevel met een eigen uitsprong (0, 0,45 of
// 0,9 m, vast patroon); elk vak is het omhulsel van de gevel en zijn vier
// knopen, zodat de facetten doorlopen zonder richels.
const vNodes = [-35.04, -27.6, -20.0, -12.3, -5.6, 1.1, 7.8, 14.5, 21.2, 29.5];
const zNodes = [4.2, 9.9, 15.6, 21.3, 27.0, 32.7, PARAPET.wing, 41.0, PARAPET.tall];
const offset = (i, j) => (j === 0 ? 0 : [0, 0.45, 0.9][(i * 7 + j * 3 + ((i * j) % 5)) % 3]);
const facets = [];
for (let i = 0; i + 1 < vNodes.length; i++) {
  for (let j = 0; j + 1 < zNodes.length; j++) {
    const [y0, y1] = [vNodes[i], vNodes[i + 1]];
    const [z0, z1] = [zNodes[j], zNodes[j + 1]];
    const tallPart = y1 <= WING.y[0] + 1e-6;
    if (!tallPart && z0 >= PARAPET.wing - 1e-6) continue;
    const zTop = !tallPart && z1 > PARAPET.wing ? PARAPET.wing : z1;
    const x = OUTLINE[0][0];
    facets.push(
      hull([
        [x + 0.05, y0, z0], [x + 0.05, y1, z0], [x + 0.05, y0, zTop], [x + 0.05, y1, zTop],
        [x - offset(i, j), y0, z0], [x - offset(i + 1, j), y1, z0],
        [x - offset(i, j + 1), y0, zTop], [x - offset(i + 1, j + 1), y1, zTop],
      ]),
    );
  }
}
model = union([model, ...facets]);

if (model.status() !== "NoError") throw new Error(model.status());
if (model.decompose().length !== 1) throw new Error(`losse delen: ${model.decompose().length}`);

const catalog = {
  name: "Doornroosje",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.3,
  // Stationsplein voor de zuidgevel en de oostkant (AHN NAP +24,1 tot +24,3 m),
  // niet de weg aan de noordoostkant (NAP +15 m) en niet het spoor (NAP +29 m).
  groundSamplePoints: [
    [0, -40],
    [20, -40],
    [43, -20],
  ],
  // Laagste PDOK-terreinhoogte op die punten, ellipsoïdisch zoals de export
  // bemonstert (gemeten 2026-10-09), als terugval voor een uitsnede die geen
  // van de punten bevat.
  groundHeight: 67.74,
  replacesBuildings: ["NL.IMBAG.Pand.0268100000086018"],
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt RD (187150, 428545) op het Stationsplein (NAP +24,3 m) in de oorsprong, +X langs de gevel aan het Stationsplein (RD-richting -16,9 graden) en +Y langs het spoor naar het noordnoordoosten. Eén node: de witte sokkel van Doornroosje met de uitkragende bakstenen band, het dek, de hoge L-vormige woonschijf van Talia met de witte raamkaders en de balkontoren, en de woonvleugel langs het spoor met de gefacetteerde spoorgevel. De onderkant ligt 9,6 m onder het plein voor de lage weg aan de noordoostkant. Vervangt de PDOK-reconstructie van BAG-pand 0268100000086018.",
  realWorld: {
    groundNapM: GROUND,
    lowRoadNapM: 15.0,
    deckNapM: 38.2,
    tallSlabNapM: 68.5,
    wingNapM: 59.5,
    plinthM: PLINTH,
    axisDegrees: ANGLE,
    estimates: [
      "hoogte van de witte sokkel, de glazen strook en de band, en hoe ver de band uitkraagt",
      "plaats en maat van de entrees, de driehoekige ramen en de raamstrook",
      "raamvelden, witte kaders, gekleurde strook en inham aan het Stationsplein (perspectief van één foto)",
      "balkontoren, galerijen en de facetten van de spoorgevel",
    ],
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Doornroosje_(Nijmegen)",
    "PDOK BAG pand 0268100000086018, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: dek, woonschijf, woonvleugel, borstwering, opbouw, maaiveld en de lage weg",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons: Doornroosje Talia 2016.jpg, Doornroosje Nijmegen SSHN Talia.jpg, Talia-Doornroosje, Stationsplein, Nijmegen.jpg, Station Nijmegen Spoor 35.jpg",
  ],
};
await writeLandmark({ slug, base: BASE, nodes: [["building:doornroosje", model]], catalog });

// De STL om los te printen begint 1 m onder het Stationsplein; de lage weg aan
// de noordoostkant hoort alleen in de GLB.
const outDir = path.join(path.resolve(process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : path.join(import.meta.dirname, "../models")), slug);
const clipped = model.intersect(box(-100, -100, -1, 100, 100, 100)).translate([0, 0, 1]);
const { buffer } = toStl(clipped, `NederPrint Doornroosje 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, `${slug}-1-${scale}.stl`), buffer);
const bb = clipped.boundingBox();
console.log(JSON.stringify({ stlClipped: { sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * (1000 / scale)).toFixed(1)) } }));

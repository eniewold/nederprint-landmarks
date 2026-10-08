// Genereert een vereenvoudigd, gesloten 3D-model van de Ridderzaal op het
// Binnenhof in Den Haag: de gotische grafelijke zaal (circa 1280-1288) van
// 40,8 bij 20,3 m onder het steile zadeldak (goot NAP +14,2 m, nok +31,3 m)
// met twee rijen dakkapellen, de steunberen langs de zijgevels, de voorgevel
// aan het Binnenhof met de topgevel, het roosvenster, de twee spitsboognissen
// ernaast, twee vensters en het portaal met zijn zadeldakje, en de twee ronde
// torens op de hoeken van de voorgevel: de noordtoren met de uitkragende
// bovenrand, de uurwerkgeleding en de spits tot NAP +38,8 m, de slankere
// zuidtoren met de kegelspits tot +37,9 m. Achter de zaal staat wat verder
// binnen hetzelfde BAG-pand ligt: de lage vleugels naast de torens, de
// tussenbouw met een hoge vleugel aan de noordkant, het ronde traptorentje
// met spits aan de zuidkant, de dwarsvleugel onder een zadeldak en de
// vleugel daarachter langs de as. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-ridderzaal.mjs              # 1:1000 (standaard)
//   node scripts/generate-ridderzaal.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alle onderdelen staan recht op of lopen
// schuin omhoog (daken onder 45 tot 67 graden), de torens worden per geleding
// smaller of kragen onder 45 graden uit, de naalden zijn 0,9 m dik en de
// nissen hebben een spitse bovenkant van 50 tot 60 graden. Alleen de
// bovenrand van de noordtoren kraagt 0,3 m vlak uit; die vlakke onderkant
// laat de export het model als gesloten solid opvullen, zodat de nissen
// behouden blijven (zie de controle onderaan).
//
// Assenstelsel: oorsprong op RD (81364,57, 455124,30), midden op de
// voorgevel van de zaal, op het maaiveld (NAP +2,7 m), Z omhoog. +X loopt
// langs de as van de zaal van de voorgevel naar achteren (RD-richting 30,07
// graden, naar het oostnoordoosten), +Y naar het noordnoordwesten; de
// voorgevel met de twee torens kijkt naar het Binnenhof (-X, west-
// zuidwest), de noordtoren met het uurwerk staat aan de +Y-kant.
//
// Bronnen: BAG-pand 0518100000211472 (contour met de cirkels van de drie
// torens); AHN DSM/DTM 0,5 m (PDOK WCS) in een stelsel langs de as:
// dwarsprofiel van het zaaldak (goot en nok), de dakkapellen als
// afwijkingen van het dakvlak, het portaal, de toppen van de torens, de daken
// van de vleugels achter de zaal en het maaiveld; Wikipedia (inwendig 38,30
// bij 17,89 m, muren van 1,20 m, steunberen van 1,10 bij 1,55 m);
// Rijksmonumentenregister 17475; frontale foto's van de voorgevel op
// Wikimedia Commons (Denhaag ridderzaal.jpg, The Hague Binnenhof -
// Ridderzaal.jpg) voor de geledingen van de torens en de gevelopeningen;
// PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "ridderzaal");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 2,7 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [81364.57, 455124.3];
const ANGLE = (30.07 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 2.7;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour van het pand (lokaal, vereenvoudigd tot 8 cm), met de cirkels
// van de torens, de steunberen en de vleugels achter de zaal.
const OUTLINE = [
  [-2.29, 12.38], [-2.7, 11.55], [-2.73, 10.61], [-2.37, 9.75], [-1.68, 9.12], [-0.79, 8.83], [-0.07, 8.87],
  [0.04, -7.85], [-0.99, -7.81], [-1.85, -8.18], [-2.47, -8.87], [-2.76, -9.76], [-2.65, -10.69], [-2.17, -11.48],
  [-1.4, -12.01], [-0.48, -12.17], [0.43, -11.94], [1.15, -11.35], [1.15, -17.85], [8.21, -17.85], [8.12, -11.64],
  [8.62, -11.65], [8.63, -11.02], [11.58, -10.95], [11.59, -10.09], [13.72, -10.1], [13.73, -11.67], [15.06, -11.66],
  [15.04, -10.1], [20.21, -10.13], [20.22, -11.7], [21.55, -11.69], [21.53, -10.14], [26.63, -10.16], [26.64, -11.74],
  [27.97, -11.73], [27.95, -10.17], [33.08, -10.19], [33.09, -11.76], [34.42, -11.75], [34.4, -10.2], [40.2, -10.23],
  [40.21, -11.67], [41.53, -11.66], [41.52, -10.22], [42.76, -10.21], [42.43, -11.17], [42.48, -12.18], [42.93, -13.1],
  [43.69, -13.77], [44.65, -14.11], [45.66, -14.05], [46.7, -13.52], [46.71, -14.01], [56.65, -13.8], [56.64, -14.78],
  [57.56, -14.79], [57.54, -13.84], [70.66, -13.76], [70.45, -4.05], [71.28, -4.05], [71.28, -0.2], [64.84, -0.26],
  [64.46, 0.35], [63.82, 0.66], [63.11, 0.58], [62.55, 0.14], [62.35, -0.29], [57.67, -0.3], [58.09, 11.74],
  [58.85, 11.76], [58.86, 12.68], [58.12, 12.69], [58.16, 13.68], [57.23, 13.73], [57.19, 12.93], [56.46, 13.14],
  [56.46, 13.29], [54.27, 13.35], [54.29, 14.51], [48.98, 14.6], [48.95, 12.72], [46.09, 12.77], [46.23, 16.33],
  [45.86, 16.34], [45.85, 16.16], [41.97, 17.09], [41.98, 17.44], [41.49, 17.45], [41.41, 12.69], [41.17, 12.69],
  [41.16, 11.68], [40.0, 11.68], [40.0, 10.1], [33.19, 10.11], [33.19, 11.71], [32.01, 11.71], [32.01, 10.11],
  [26.75, 10.12], [26.76, 11.72], [25.58, 11.73], [25.57, 10.13], [20.31, 10.14], [20.32, 11.75], [19.14, 11.75],
  [19.13, 10.14], [13.91, 10.15], [13.91, 11.76], [12.73, 11.76], [12.72, 10.16], [8.6, 10.16], [8.62, 11.76],
  [7.9, 11.77], [7.96, 17.48], [1.13, 17.52], [1.02, 12.54], [0.25, 13.07], [-0.67, 13.22], [-1.57, 12.98],
];
// Alles binnen de contour tot de lage tussenbouw achter de zaal.
const LOW = 5.0;
// De zaal: buitenmaten 40,8 bij 20,3 m (inwendig 38,30 bij 17,89 m met muren
// van 1,20 m), zadeldak van 59 graden met de nok op de as.
const HALL = { length: 40.8, half: 10.15, eave: 14.2, ridge: 31.3 };
// Steunberen langs de zijgevels (BAG): schuin aflopend van +12,8 m tegen de
// muur naar +11,2 m aan de buitenkant.
const BUTTRESS = { from: 8.7, to: 41.6, out: 1.6, inner: 12.8, outer: 11.2 };
// Dakkapellen in twee rijen per dakvlak (afwijkingen van het dakvlak in het
// AHN): voorzijde op |y|, muurtje tot `wall`, nok tot `ridge`.
const DORMERS = [
  { xs: [4.7, 11.0, 17.3, 23.6, 29.9, 36.2], y: 8.3, half: 0.9, wall: 19.2, ridge: 20.2 },
  { xs: [7.9, 14.2, 20.5, 26.8, 33.1], y: 4.4, half: 0.8, wall: 25.6, ridge: 26.4 },
];
// Lage vleugels naast de torens met een schilddak (nok dwars op de zaal).
const WINGS = [
  { x: [1.0, 8.7], y: [10.0, 17.6], ridgeX: 4.5, eave: 11.0, ridge: 15.7, hipTo: 14.1 },
  { x: [1.0, 8.7], y: [-17.9, -10.0], ridgeX: 4.7, eave: 7.3, ridge: 11.3, hipTo: -14.4 },
];
// Portaal voor de middeningang: zadeldakje langs de as.
const PORCH = { x: [-4.6, 0.2], half: 2.4, eave: 7.9, ridge: 12.0 };
// Torens op de hoeken van de voorgevel (cirkels in de BAG, r 2,2 m). De
// noordtoren: ronde voet, iets smallere bovengeleding, een bovenrand die
// 0,3 m vlak uitkraagt, de uurwerkgeleding, de spits en de naald. De
// zuidtoren: voet, bovengeleding, rand onder 45 graden en een kegelspits.
const TOWERS = [
  {
    c: [-0.58, 11.01], foot: { r: 2.2, top: 15.2 }, shaft: { r: 2.0, top: 27.4 }, rim: { r: 2.3, top: 29.8, flat: true },
    spire: { r: 1.75, tip: 35.6 }, needle: { apothem: 0.45, tip: 38.8 },
  },
  {
    c: [-0.57, -9.97], foot: { r: 2.2, top: 14.3 }, shaft: { r: 1.95, top: 25.6 }, rim: { r: 2.15, top: 26.4 },
    spire: { r: 2.05, tip: 33.0 }, needle: { apothem: 0.45, tip: 37.9 },
  },
];
// Achter de zaal (binnen hetzelfde BAG-pand): de hoge noordvleugel van de
// tussenbouw, lage delen ernaast, het traptorentje, de dwarsvleugel en de
// vleugel langs de as daarachter.
const LINK = {
  north: { x: [40.6, 46.7], y: [5.5, 12.7], ridgeY: 9.5, eave: 20.0, ridge: 27.5 },
  northLow: { x: [40.6, 46.7], y: [12.7, 18], top: 14.0 },
  southLow: { x: [40.6, 46.7], y: [-14.5, -6.0], top: 14.0 },
};
const STAIR = { c: [45.02, -11.52], r: 2.4, top: 22.5, tip: 34.0, needle: { apothem: 0.45, tip: 35.9 } };
const CROSS = { x: [46.7, 57.7], y: [-14.9, 14.7], ridgeX: 51.8, eave: 19.5, ridge: 27.0 };
const REAR = { x: [57.6, 71.4], y: [-14.0, -0.2], ridgeY: -7.1, eave: 15.0, ridge: 25.4 };
// Maaiveld rondom (NAP +2,7 tot +3,0 m): het Binnenhof voor de voorgevel en
// de bestrating langs de noord- en zuidgevel.
const GROUND_SAMPLES = [[-8, 0], [20, 13.5], [28, -13.5]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
const outline = prism(OUTLINE, BASE - 1, 200);
const clip = (solid) => Manifold.intersection(outline, solid);
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const circle = (c, r, n = 24) => Array.from({ length: n }, (_, k) => polar(c, r, (360 * k) / n + 7.5));
// Regelmatige achthoek met de vlakken op de assen (apothema a).
const octagon = ([cx, cy], a) =>
  [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => polar([cx, cy], a / Math.cos(Math.PI / 8), deg));
// Spitsboognis in een gevel: breedte w, van z0 tot z1 (NAP), bovenkant onder
// `deg` graden. `at` is het midden onderaan op het gevelvlak, `normal` de
// richting naar buiten (eenheidsvector in het grondvlak); `out` is hoe ver de
// nis naar buiten doorloopt.
const niche = ([cx, cy], [nx, ny], w, z0, z1, depth, out = 1.5, deg = 60) => {
  const rise = (w / 2) * Math.tan((deg * Math.PI) / 180);
  const profile = [[-w / 2, NAP(z0)], [w / 2, NAP(z0)], [w / 2, NAP(z1) - rise], [0, NAP(z1)], [-w / 2, NAP(z1) - rise]];
  const pts = [];
  for (const d of [-depth, out]) {
    for (const [u, z] of profile) pts.push([cx + nx * d - ny * u, cy + ny * d + nx * u, z]);
  }
  return Manifold.hull(pts);
};
// Zadeldak met de nok langs X (ridgeY) of langs Y (ridgeX) boven een
// rechthoek; met `hipTo` loopt de nok niet tot het einde (schilddak).
const gabled = ({ x, y, eave, ridge, ridgeX, ridgeY, hipTo }) => {
  const r = rect(x, y);
  const ridgeLine =
    ridgeX !== undefined
      ? [[ridgeX, hipTo !== undefined && hipTo < 0 ? hipTo : y[0]], [ridgeX, hipTo !== undefined && hipTo > 0 ? hipTo : y[1]]]
      : [[x[0], ridgeY], [x[1], ridgeY]];
  return Manifold.hull([...at(r, BASE), ...at(r, NAP(eave)), ...at(ridgeLine, NAP(ridge))]);
};
// Hoogte van het zaaldak op afstand |y| van de as.
const roofZ = (y) => NAP(HALL.ridge - ((HALL.ridge - HALL.eave) * Math.abs(y)) / HALL.half);

// ---------- opbouw: zaal ----------
const parts = [clip(box([-10, 80], [-20, 20], BASE, NAP(LOW)))];
{
  const r = rect([0, HALL.length], [-HALL.half, HALL.half]);
  parts.push(Manifold.hull([...at(r, BASE), ...at(r, NAP(HALL.eave)), [0, 0, NAP(HALL.ridge)], [HALL.length, 0, NAP(HALL.ridge)]]));
}
// Steunberen: alles buiten de zijgevels binnen de BAG-contour, schuin
// aflopend naar buiten.
for (const sign of [1, -1]) {
  const B = BUTTRESS;
  const profile = [[HALL.half - 0.05, BASE], [HALL.half - 0.05, NAP(B.inner)], [HALL.half + B.out, NAP(B.outer)], [HALL.half + B.out, BASE]];
  parts.push(clip(Manifold.hull([B.from, B.to].flatMap((x) => profile.map(([y, z]) => [x, sign * y, z])))));
}
// Dakkapellen: voorzijde recht, zadeldakje met de nok dwars op het zaaldak.
for (const D of DORMERS) {
  for (const x of D.xs) {
    for (const sign of [1, -1]) {
      // Tot waar het zaaldak boven de nok van de dakkapel uitkomt.
      const back = (HALL.half * (HALL.ridge - D.ridge - 0.3)) / (HALL.ridge - HALL.eave);
      const low = roofZ(D.y) - 0.3;
      const pts = [];
      for (const y of [D.y, back]) {
        for (const dx of [-D.half, D.half]) pts.push([x + dx, sign * y, low], [x + dx, sign * y, NAP(D.wall)]);
        pts.push([x, sign * y, NAP(D.ridge)]);
      }
      parts.push(Manifold.hull(pts));
    }
  }
}
// Vleugels naast de torens en het portaal.
for (const W of WINGS) parts.push(clip(gabled(W)));
parts.push(gabled({ x: PORCH.x, y: [-PORCH.half, PORCH.half], eave: PORCH.eave, ridge: PORCH.ridge, ridgeY: 0 }));

// ---------- opbouw: achter de zaal ----------
parts.push(
  clip(gabled(LINK.north)),
  clip(box(LINK.northLow.x, LINK.northLow.y, BASE, NAP(LINK.northLow.top))),
  clip(box(LINK.southLow.x, LINK.southLow.y, BASE, NAP(LINK.southLow.top))),
  clip(gabled(CROSS)),
  clip(gabled(REAR)),
);

// ---------- opbouw: torens ----------
const spire = (c, r, z0, tip, needle) => [
  Manifold.hull([...at(circle(c, r), NAP(z0) - 0.01), [c[0], c[1], NAP(tip)]]),
  // De naald begint diep genoeg in de spits om er nergens onderuit te steken.
  Manifold.hull([...at(octagon(c, needle.apothem), NAP(tip) - (0.5 * (tip - z0)) / r - 0.1), ...at(octagon(c, needle.apothem), NAP(needle.tip) - 0.6), [c[0], c[1], NAP(needle.tip)]]),
];
for (const T of TOWERS) {
  parts.push(prism(circle(T.c, T.foot.r), BASE, NAP(T.foot.top)), prism(circle(T.c, T.shaft.r), BASE, NAP(T.shaft.top)));
  if (T.rim.flat) {
    // Bovenrand die 0,3 m vlak uitkraagt (de uurwerkgeleding).
    parts.push(prism(circle(T.c, T.rim.r), NAP(T.shaft.top), NAP(T.rim.top)));
  } else {
    const flare = T.rim.r - T.shaft.r;
    parts.push(
      Manifold.hull([
        ...at(circle(T.c, T.shaft.r), NAP(T.shaft.top) - 0.01),
        ...at(circle(T.c, T.rim.r), NAP(T.shaft.top) + flare),
        ...at(circle(T.c, T.rim.r), NAP(T.rim.top)),
      ]),
    );
  }
  parts.push(...spire(T.c, T.spire.r, T.rim.top, T.spire.tip, T.needle));
}
{
  const S = STAIR;
  parts.push(prism(circle(S.c, S.r), BASE, NAP(S.top)), ...spire(S.c, S.r, S.top, S.tip, S.needle));
}

// ---------- nissen in de voorgevel ----------
const front = [
  // Roosvenster: rond onderaan, spitse bovenkant onder 50 graden.
  Manifold.hull(
    [-0.4, 1.5].flatMap((d) =>
      [[-1.25, 14.7], [1.25, 14.7], [2.5, 16.0], [2.5, 17.6], [0, 17.6 + 2.5 * Math.tan((50 * Math.PI) / 180)], [-2.5, 17.6], [-2.5, 16.0]].map(
        ([y, z]) => [-d, y, NAP(z)],
      ),
    ),
  ),
  // Twee spitsboognissen naast het roosvenster en twee vensters eronder.
  niche([0, 4.4], [-1, 0], 2.4, 15.0, 20.3, 0.4),
  niche([0, -4.6], [-1, 0], 2.4, 15.0, 20.3, 0.4),
  niche([0, 5.4], [-1, 0], 2.0, 6.2, 11.4, 0.4),
  niche([0, -6.0], [-1, 0], 2.0, 6.2, 11.4, 0.4),
  // De ingang in de voorkant van het portaal.
  niche([PORCH.x[0], 0], [-1, 0], 2.4, GROUND_NAP, 10.5, 0.8),
];

const hall = Manifold.union(parts).subtract(Manifold.union(front));
const nodes = [["building:ridderzaal", hall]];

// ---------- controles ----------
if (hall.status() !== "NoError") throw new Error(hall.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // alleen de uitkragende bovenrand van de noordtoren hoort erbij.
  const mesh = hall.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const levels = new Map();
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const z = Math.min(...p.map((q) => q[2])).toFixed(2);
    levels.set(z, (levels.get(z) ?? 0) + len / 2);
  }
  console.log("ondervlakken (lokale z: m2):", Object.fromEntries(levels));
  const allowed = NAP(TOWERS[0].shaft.top).toFixed(2);
  for (const [z, area] of levels) if (z !== allowed && area > 0.01) throw new Error(`overhang op z ${z}`);
  if (!levels.has(allowed)) throw new Error("uitkraging van de noordtoren ontbreekt");
  const bb = hall.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
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
  const nodes = [];
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
    nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
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
for (const [name, solid] of nodes) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "ridderzaal.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-ridderzaal.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `ridderzaal-1-${scale}.stl`);
const printSolid = hall.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Ridderzaal Den Haag 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

await writeFile(
  path.join(outDir, "ridderzaal.json"),
  JSON.stringify(
    {
      name: "Ridderzaal",
      file: "ridderzaal.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +2,7 tot +3,0 m): het Binnenhof voor de
      // voorgevel en de bestrating langs de noord- en zuidgevel.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0518100000211472"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (81364,57, 455124,30), midden op de voorgevel van de Ridderzaal, op het maaiveld (NAP +2,7 m), +X langs de as van de zaal van de voorgevel naar achteren (RD-richting 30,07 graden, naar het oostnoordoosten) en +Y naar het noordnoordwesten; de voorgevel met de twee torens kijkt naar het Binnenhof (west-zuidwest), de noordtoren met het uurwerk staat aan de +Y-kant. Eén node building: alles binnen de BAG-contour tot NAP +5 m, de zaal van 40,8 bij 20,3 m onder een zadeldak van 59 graden (goot +14,2 m, nok +31,3 m) met twee rijen dakkapellen per dakvlak en de steunberen langs de zijgevels, de voorgevel met de topgevel, het roosvenster, twee spitsboognissen en twee vensters als nissen en het portaal met zadeldakje tot +12 m, de noordtoren (rond, 4,4 m, bovenrand die 0,3 m uitkraagt tot +29,8 m, spits en naald tot NAP +38,8 m) en de zuidtoren (rond, 4,4 m, rand onder 45 graden tot +26,4 m, kegelspits en naald tot +37,9 m) op de hoeken van de voorgevel, de lage vleugels naast de torens met schilddaken (nok +15,7 en +11,3 m), en achter de zaal de tussenbouw met een hoge noordvleugel (nok +27,5 m), het ronde traptorentje met spits tot +35,9 m, de dwarsvleugel (nok +27 m) en de vleugel langs de as (nok +25,4 m) die binnen hetzelfde BAG-pand liggen. Alles staat recht op of loopt schuin omhoog, behalve de bovenrand van de noordtoren die 0,3 m uitkraagt, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0518100000211472; de rest van het Binnenhof blijft PDOK. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`ridderzaal-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        hallLengthM: HALL.length,
        hallWidthM: 2 * HALL.half,
        hallEaveNapM: HALL.eave,
        hallRidgeNapM: HALL.ridge,
        northTowerTipNapM: TOWERS[0].needle.tip,
        southTowerTipNapM: TOWERS[1].needle.tip,
        stairTowerTipNapM: STAIR.needle.tip,
        crossWingRidgeNapM: CROSS.ridge,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Ridderzaal",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/17475",
        "PDOK BAG pand 0518100000211472 (contour), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dwarsprofiel van het zaaldak, dakkapellen, portaal, toppen van de torens, daken achter de zaal, maaiveld",
        "Wikimedia Commons: frontale foto's van de voorgevel (Denhaag ridderzaal.jpg; The Hague Binnenhof - Ridderzaal.jpg)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

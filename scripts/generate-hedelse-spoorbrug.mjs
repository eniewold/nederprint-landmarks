// Genereert een vereenvoudigd, gesloten 3D-model van de Hedelse spoorbrug:
// de stalen vakwerkbrug over de Maas tussen Hedel en 's-Hertogenbosch
// (spoorlijn Utrecht - Boxtel), sinds de verdubbeling van 1978 twee
// gelijke bruggen naast elkaar, elk met twee vakwerkliggers. Over de rivier
// ligt een doorgaande ligger over drie velden (61,8 m, 106,1 m en 59,9 m)
// die boven de twee rivierpijlers het hoogst is; daarnaast liggen een veld
// van 61,4 m aan de zuidkant en drie velden van 61 tot 63 m in de uiterwaard
// aan de noordkant, met evenwijdige randen. De Hedelse brug (weg) ligt 400 m
// stroomafwaarts (eigen model). Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal> met een printvoet
// onder het dek.
//
//   node scripts/generate-hedelse-spoorbrug.mjs              # 1:1500 (standaard)
//   node scripts/generate-hedelse-spoorbrug.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het BGT-dek midden tussen de twee
// rivierpijlers (RD 147197,04, 416821,90), op de waterspiegel van de Maas
// (NAP +1,1 m), Z omhoog. +X loopt langs de brug naar het noorden (Hedel,
// RD-richting 93,97 graden vanaf het oosten), +Y stroomafwaarts naar het
// westen. De rivierpijlers staan op x = -57,4 tot -49,4 en 48,8 tot 56,7;
// het zuidelijke landhoofd begint op x = -186,8, het noordelijke eindigt op
// x = 308,7. De oostelijke brug (y < 0) en de westelijke (y > 0) zijn gelijk.
//
// Bronnen: BGT overbruggingsdeel (dek 15,4 m breed van x = -186,8 tot 308,7,
// rivierpijlers van 8 × 29,6 m met spitse koppen, pijlers in de uiterwaard
// van 4,1 tot 6,8 × 22 tot 24 m, de pijlertjes van het zuidelijke landhoofd);
// AHN DSM 0,5 m (PDOK WCS) voor de spoorstaafhoogte (NAP +11,6 aan de
// zuidkant, +12,25 m over de rivier, +10,25 m aan de noordkant), de vier
// vakwerklijnen (6,25 m en 1,0 m naast de as) en hun bovenrand (velden in de
// uiterwaard 5,9 m boven de spoorstaaf, de doorgaande ligger NAP +24,7 m
// naast de rivierpijlers en +21,1 m in het midden); Wikipedia (langste
// overspanning 107,16 m, doorvaartbreedte 100 m); PDOK-terrein voor de
// waterspiegel (44,64 m ellipsoïdisch, NAP = ellipsoïdisch - 43,55 m in de
// uiterwaard); Wikimedia Commons-foto's (Hedel spoorbrug 1.jpg, 2.jpg, 3.jpg,
// Hedelse spoorbrug.jpg, Hedelse Brug.jpg, HUA-170350) voor de vorm van de
// liggers, de verdubbeling en de stenen pijlers.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hedelse-spoorbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Band tussen twee functies van x (onder en boven), uitgetrokken langs Y.
function bandY(x0, x1, bottom, top, y0, y1, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    pts.push([x, bottom(x)]);
  }
  for (let i = steps; i >= 0; i--) {
    const x = x0 + ((x1 - x0) * i) / steps;
    pts.push([x, top(x)]);
  }
  return profileY(pts, y0, y1);
}
// Plattegrond (BGT, lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Driehoek in het XZ-vlak, naar binnen verschoven over d (de halve breedte
// van de staven eromheen); null als er te weinig opening overblijft.
function insetTriangle(tri, d) {
  const polys = new CrossSection([ccw(tri)]).offset(-d, "Miter").toPolygons();
  if (polys.length !== 1 || polys[0].length < 3) return null;
  const pts = polys[0].map(([x, z]) => [x, z]);
  let area = 0;
  pts.forEach(([x0, z0], i) => {
    const [x1, z1] = pts[(i + 1) % pts.length];
    area += x0 * z1 - x1 * z0;
  });
  return Math.abs(area) / 2 >= 2.0 ? pts : null;
}
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in gezien vanaf +X, steeds evenveel punten).
function loftX(stations) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { x, section } of stations) for (const [y, z] of section) verts.push(x, y, z);
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < stations.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = stations.length - 1;
  for (let j = 1; j + 1 < n; j++) {
    tris.push(id(0, 0), id(0, j + 1), id(0, j));
    tris.push(id(last, 0), id(last, j), id(last, j + 1));
  }
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  return solid;
}

// ---------- hoofdmaten (boven de waterspiegel, NAP +1,1 m) ----------
// PDOK legt de Maas bij Hedel op 44,64 m ellipsoïdisch; in de uiterwaard
// ligt het PDOK-terrein 43,55 m boven het AHN (NAP), dus de waterspiegel ligt
// op circa NAP +1,1 m.
const WATER_NAP = 1.1;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de Maas op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 44.63;

// Spoorstaafhoogte in NAP (meest voorkomende AHN-hoogte op de sporen per
// 10 m): het spoor loopt van NAP +11,6 m op het zuidelijke talud naar
// +12,25 m over de rivier en daalt naar +10,25 m op het noordelijke talud.
const RAIL_NAP = [
  [-186.83, 11.6],
  [-115.13, 11.75],
  [-53.36, 12.25],
  [52.72, 12.25],
  [112.64, 11.75],
  [173.72, 11.25],
  [234.97, 10.75],
  [298.22, 10.25],
  [308.66, 10.2],
];
function railZ(x) {
  const pts = RAIL_NAP;
  if (x <= pts[0][0]) return Z(pts[0][1]);
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    if (x <= x1) return Z(z0 + ((z1 - z0) * (x - x0)) / (x1 - x0));
  }
  return Z(pts[pts.length - 1][1]);
}
// Dek (BGT): 15,4 m breed over beide bruggen; de onderkant van de
// dwarsdragers ligt 1,5 m onder de spoorstaaf (geschat op foto's).
const DECK = { x0: -186.83, x1: 308.66, y0: -7.6, y1: 7.8, depth: 1.5 };
const deckBottom = (x) => railZ(x) - DECK.depth;
// Landhoofden: het zuidelijke tot aan de pijlertjes, het noordelijke vanaf
// de BGT-sloof.
const SOUTH_FACE = -174.0;
const NORTH_FACE = 296.0;

// Opleggingen (harten van de pijlers, BGT) en de vakwerkliggers.
const BEARINGS = [-176.48, -115.13, -53.36, 52.72, 112.64, 173.72, 234.97, 298.22];
// Vier vakwerklijnen van 1,0 m dik (AHN: 6,25 m en 1,0 m naast de as); de
// oostelijke brug heeft y < 0, de westelijke y > 0. Op 1:1000 is het vakwerk
// een dichte plaat met de driehoeken met de punt omhoog als doorgaande
// opening en de driehoeken met een vlakke bovenkant als blinde nis van
// 0,35 m (aan de buitenkant van de buitenste en aan de spoorkant van de
// binnenste ligger).
const NICHE = 0.35;
const TRUSSES = [
  { y0: -6.75, y1: -5.75, niche: [-6.75, -6.75 + NICHE] },
  { y0: -1.5, y1: -0.5, niche: [-1.5, -1.5 + NICHE] },
  { y0: 0.5, y1: 1.5, niche: [1.5 - NICHE, 1.5] },
  { y0: 5.75, y1: 6.75, niche: [6.75 - NICHE, 6.75] },
];
// Staven: onderrand van 0,3 m onder tot 0,6 m boven de spoorstaaf,
// bovenrand en diagonalen 0,9 m.
const BAR = 0.9;
const CHORD_TOP = 0.6;
// Velden in de uiterwaard: evenwijdige randen 5,9 m boven de spoorstaaf
// (AHN), acht vakken per veld (foto's).
const FLOOD_HEIGHT = 5.9;
// Doorgaande ligger over de rivier (AHN): in het midden van de
// hoofdoverspanning NAP +21,1 m (over 30 m vlak, daarbuiten kwadratisch
// oplopend), boven de rivierpijlers het hoogst en in de zijvelden 50 m lang
// lineair dalend naar +17,6 m. De bovenrand is een veelhoek door de
// bovenknopen; met de vormfunctie tot +25,3 m boven het hart van de pijler
// liggen de twee knopen naast de pijler op +24,5 en +24,7 m (AHN: 24,7 tot
// 25,0 m).
const CONT = { mid: (BEARINGS[2] + BEARINGS[3]) / 2, half: (BEARINGS[3] - BEARINGS[2]) / 2, peak: 25.3, low: 21.1, flat: 15, end: 17.6, fall: 50 };
function contTop(x) {
  const u = Math.abs(x - CONT.mid);
  if (u <= CONT.half) return Z(CONT.low + (CONT.peak - CONT.low) * (Math.max(0, u - CONT.flat) / (CONT.half - CONT.flat)) ** 2);
  return Z(Math.max(CONT.end, CONT.peak - ((CONT.peak - CONT.end) * (u - CONT.half)) / CONT.fall));
}
const GIRDERS = [
  { label: "zuidelijk veld", spans: [[BEARINGS[0], BEARINGS[1], 8]], top: (x) => railZ(x) + FLOOD_HEIGHT },
  {
    label: "doorgaande ligger",
    spans: [
      [BEARINGS[1], BEARINGS[2], 8],
      [BEARINGS[2], BEARINGS[3], 14],
      [BEARINGS[3], BEARINGS[4], 8],
    ],
    top: contTop,
  },
  ...[4, 5, 6].map((i) => ({
    label: `noordelijk veld ${i - 3}`,
    spans: [[BEARINGS[i], BEARINGS[i + 1], 8]],
    top: (x) => railZ(x) + FLOOD_HEIGHT,
  })),
];

// Pijlers (BGT, lokale coördinaten).
const PIERS = [
  // pijler in de uiterwaard aan de zuidoever, ronde koppen
  [
    [-117.14, 7.96], [-117.19, -7.49], [-117.1, -8.42], [-116.83, -9.31], [-116.38, -10.12], [-115.78, -10.84],
    [-114.86, -10.94], [-114.22, -10.3], [-113.7, -9.55], [-113.33, -8.72], [-113.11, -7.83], [-113.07, -4.6],
    [-113.13, 7.83], [-113.29, 8.75], [-113.64, 9.62], [-114.17, 10.39], [-114.86, 11.02], [-115.75, 10.88],
    [-116.35, 10.19], [-116.8, 9.39], [-117.07, 8.52],
  ],
  // rivierpijlers, spitse koppen
  [
    [-49.35, -8.92], [-49.35, 7.92], [-49.99, 11.12], [-51.82, 13.72], [-53.46, 14.79], [-54.64, 13.88],
    [-55.98, 12.51], [-57.36, 9.68], [-57.05, -9.2], [-56.34, -11.53], [-55.23, -13.6], [-53.52, -14.8],
    [-52.51, -14.48], [-50.26, -12.02],
  ],
  [
    [52.73, 14.71], [51.42, 13.9], [50.0, 12.18], [48.9, 8.99], [48.76, -9.34], [49.68, -12.05],
    [51.29, -14.06], [52.67, -14.87], [54.05, -14.39], [55.31, -13.44], [56.26, -11.19], [56.69, -9.44],
    [56.44, 6.1], [56.53, 9.86], [55.17, 12.83],
  ],
  // pijlers in de noordelijke uiterwaard
  [[109.78, -7.9], [113.05, -10.78], [115.5, -7.89], [115.35, 9.08], [112.94, 12.62], [110.31, 10.15]],
  [[171.17, 9.85], [171.11, -8.68], [173.37, -11.42], [176.32, -8.08], [176.19, 9.63], [172.98, 12.44]],
  [[231.77, -7.98], [235.1, -11.07], [238.39, -6.81], [238.2, 8.05], [234.44, 12.81], [231.55, 8.51]],
  // voorkant van het noordelijke landhoofd
  [
    [298.21, 11.15], [297.18, 10.49], [296.33, 9.37], [295.98, 7.93], [296.12, -8.82], [296.61, -10.02],
    [297.4, -11.06], [298.16, -11.56], [298.31, -11.66], [299.21, -11.05], [299.98, -10.01], [300.46, -8.8],
    [300.47, 7.95], [300.11, 9.39], [299.25, 10.5],
  ],
];
// Ronde pijlertjes naast het zuidelijke landhoofd (BGT), tot de spoorstaaf.
const SOUTH_PILLARS = [
  [[-176.47, 11.34], [-177.98, 10.28], [-178.87, 8.7], [-178.95, 7.69], [-174.18, 7.69], [-174.01, 8.23], [-174.05, 8.72], [-174.95, 10.29]],
  [[-177.06, -7.21], [-178.74, -7.2], [-178.71, -8.84], [-178.15, -9.96], [-177.34, -10.89], [-176.39, -11.58], [-175.45, -10.88], [-174.65, -9.95], [-174.21, -9.05], [-174.22, -7.21]],
];

// ---------- dek, landhoofden, pijlers ----------
const deck = bandY(DECK.x0, DECK.x1, deckBottom, railZ, DECK.y0, DECK.y1, Math.round((DECK.x1 - DECK.x0) / 2));
const abutments = [
  bandY(DECK.x0, SOUTH_FACE, () => BASE, (x) => railZ(x) - 0.01, DECK.y0, DECK.y1, 4),
  bandY(NORTH_FACE, DECK.x1, () => BASE, (x) => railZ(x) - 0.01, DECK.y0, DECK.y1, 4),
];
const centre = (poly) => poly.reduce((s, [x]) => s + x, 0) / poly.length;
// De stenen rivierpijlers (de tweede en derde) hebben spitse voorkoppen die
// 2,5 m onder de oplegbank ophouden (foto's): de koppen als prisma tot daar,
// het middendeel (|y| < 9) tot onder het dek.
const RIVER_PIER_NOSE_DROP = 2.5;
const piers = [
  ...PIERS.map((poly, i) => {
    const top = deckBottom(centre(poly)) + 0.1;
    if (i !== 1 && i !== 2) return prism(poly, BASE, top);
    const xs = poly.map(([x]) => x);
    const seat = prism(
      [[Math.min(...xs), -9], [Math.max(...xs), -9], [Math.max(...xs), 9], [Math.min(...xs), 9]],
      BASE,
      top,
    );
    return union([prism(poly, BASE, top - RIVER_PIER_NOSE_DROP), seat]);
  }),
  ...SOUTH_PILLARS.map((poly) => prism(poly, BASE, railZ(centre(poly)))),
];

// ---------- vakwerkliggers ----------
// Per ligger: onderknopen op de vakgrenzen, bovenknopen midden daartussen
// (vakwerk met de diagonalen als W). De plaat loopt van de onderkant van het
// dek tot de bovenrand; bij de opleggingen zakt de bovenrand langs de
// eindstijl naar 0,9 m boven de spoorstaaf.
const openingAngles = [];
let throughOpenings = 0;
let blindNiches = 0;
const girderSolids = GIRDERS.flatMap((girder) => {
  const bottomX = [];
  for (const [a, b, n] of girder.spans) {
    for (let k = bottomX.length ? 1 : 0; k <= n; k++) bottomX.push(a + ((b - a) * k) / n);
  }
  const top = bottomX.slice(0, -1).map((x, i) => {
    const xm = (x + bottomX[i + 1]) / 2;
    return [xm, girder.top(xm)];
  });
  const x0 = bottomX[0];
  const x1 = bottomX[bottomX.length - 1];
  const steps = Math.round((x1 - x0) / 2);
  const outline = [
    ...Array.from({ length: steps + 1 }, (_, i) => {
      const x = x0 + ((x1 - x0) * i) / steps;
      return [x, deckBottom(x)];
    }),
    [x1, railZ(x1) + BAR],
    ...[...top].reverse(),
    [x0, railZ(x0) + BAR],
  ];
  // Hartlijnen: onderrand 0,15 m boven de spoorstaaf, bovenrand 0,45 m onder
  // de bovenkant; de opening ligt een halve staafbreedte binnen de hartlijnen.
  const zb = (x) => railZ(x) + CHORD_TOP - BAR / 2;
  const holes = [];
  const niches = [];
  for (let i = 0; i < top.length; i++) {
    const tri = [
      [bottomX[i], zb(bottomX[i])],
      [bottomX[i + 1], zb(bottomX[i + 1])],
      [top[i][0], top[i][1] - BAR / 2],
    ];
    const hole = insetTriangle(tri, BAR / 2);
    if (hole) {
      holes.push(hole);
      // Helling van de flanken van de opening (moet minstens 50 graden zijn).
      const apex = hole.reduce((p, q) => (q[1] > p[1] ? q : p));
      for (const q of hole) {
        if (q === apex) continue;
        openingAngles.push((Math.atan2(apex[1] - q[1], Math.abs(apex[0] - q[0])) * 180) / Math.PI);
      }
    }
    if (i > 0) {
      const inv = [
        [top[i - 1][0], top[i - 1][1] - BAR / 2],
        [bottomX[i], zb(bottomX[i])],
        [top[i][0], top[i][1] - BAR / 2],
      ];
      const niche = insetTriangle(inv, BAR / 2);
      if (niche) niches.push(niche);
    }
  }
  throughOpenings += holes.length;
  blindNiches += niches.length;
  return TRUSSES.map(({ y0, y1, niche }) => {
    const plate = profileY(outline, y0, y1);
    const cut = [
      ...holes.map((h) => profileY(h, y0 - 0.3, y1 + 0.3)),
      ...niches.map((h) => (niche[0] === y0 ? profileY(h, y0 - 0.3, niche[1]) : profileY(h, niche[0], y1 + 0.3))),
    ];
    return plate.subtract(union(cut));
  });
});

const bridge = union([deck, ...abutments, ...piers, ...girderSolids]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden die uitloopt in een
// scherm van 0,9 m tot de onderplaat.
const KNEE = (50 * Math.PI) / 180;
const SCREEN = 0.45;
const footSteps = Math.round(NORTH_FACE - SOUTH_FACE);
const footStations = Array.from({ length: footSteps + 1 }, (_, i) => {
  const x = SOUTH_FACE + ((NORTH_FACE - SOUTH_FACE) * i) / footSteps;
  const zb = deckBottom(x) + 0.02;
  const yc = (DECK.y0 + DECK.y1) / 2;
  const w = (DECK.y1 - DECK.y0) / 2 + 0.02;
  const zs = zb - Math.tan(KNEE) * (w - SCREEN);
  const section =
    zs > BASE + 0.05
      ? [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]]
      : (() => {
          const a = w - (zb - BASE) / Math.tan(KNEE);
          return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
        })();
  return { x, section: section.map(([y, z]) => [y + yc, z]) };
});
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van het dek en de plafonds van de blinde nissen
// (0,35 m diep), in de printversie alleen die nissen.
const inNiche = (y) => TRUSSES.some(({ niche }) => y > niche[0] - 1e-3 && y < niche[1] + 1e-3);
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  let deckArea = 0;
  let nicheArea = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const yMid = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    if (Math.abs(zMid - deckBottom(xMid)) < 0.1) deckArea += len / 2;
    else if (inNiche(yMid) && zMid > railZ(xMid) + CHORD_TOP) nicheArea += len / 2;
    else {
      area += len / 2;
      if (len / 2 > 0.01) console.log("overhang op", [xMid, yMid, zMid].map((c) => +c.toFixed(2)));
    }
  }
  return { area, deckArea, nicheArea };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  const model = overhangs(bridge);
  console.log("vrij hangend (m2): dek", Math.round(model.deckArea), "nissen", Math.round(model.nicheArea), "overig", +model.area.toFixed(2));
  if (model.area > 0.5) throw new Error("overhang buiten dek en nissen");
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2): dek", +print.deckArea.toFixed(2), "overig", +print.area.toFixed(2));
  if (print.deckArea + print.area > 0.5) throw new Error("printversie heeft overhang");
  const minAngle = Math.min(...openingAngles);
  console.log("doorgaande openingen", throughOpenings, "blinde nissen", blindNiches, "steilste flank min (graden)", +minAngle.toFixed(1));
  if (minAngle < 50) throw new Error("opening met een te vlakke flank");
}

// ---------- spoor als eigen onderdeel ----------
// De bovenste 0,5 m van het dek tussen de vakwerkliggers van elke brug is een
// eigen node met de attributen van het BGT-wegdeel (glTF
// `extras.attributes`), zodat de kleurregels van een thema (bijvoorbeeld
// spoor zwart) op het brugdek werken zoals op de PDOK-wegdelen ernaast. Op
// het dek zelf ligt sinds 7 april 2025 geen actueel BGT-wegdeel meer (de
// spoorbaanvlakken L0004.3a7dc2eb... en L0004.3388baf1... zijn beëindigd);
// daarom de functie van de wegdelen op de landhoofden: L0004.ebfcd0d5...
// (relatieve hoogteligging 1, x = -186,8 tot -177,7 op het zuidelijke
// landhoofd) en L0004.62130dec... (vanaf x = 308,6 op het noordelijke talud),
// beide spoorbaan, half verhard, zonder plus-fysiek voorkomen.
// Wordt pas hier gebouwd, nadat het printmodel is doorgerekend, zodat de STL
// gelijk blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "half verhard" };
// Spoorbed van elke brug: tussen de binnenkant van de buitenste en de
// binnenste ligger, met 2 cm vrij van de vakwerkplaten (ook waar de plaat
// openingen heeft); de spleet tussen de bruggen en de randen buiten de
// liggers blijven constructie.
const GUARD = 0.02;
const TRACK_BEDS = [
  [TRUSSES[0].y1 + GUARD, TRUSSES[1].y0 - GUARD],
  [TRUSSES[2].y1 + GUARD, TRUSSES[3].y0 - GUARD],
];
// De strook loopt over dezelfde loftstations als het dek (de spoorstaaf
// tussen twee stations is daar een rechte lijn), van 0,5 m onder tot 1 m
// boven de spoorstaaf, en 0,5 m voorbij de uiteinden van het dek, zodat hij
// geen vlak met de kopse kanten deelt.
const deckSteps = Math.round((DECK.x1 - DECK.x0) / 2);
const layerXs = [
  DECK.x0 - 0.5,
  ...Array.from({ length: deckSteps + 1 }, (_, i) => DECK.x0 + ((DECK.x1 - DECK.x0) * i) / deckSteps),
  DECK.x1 + 0.5,
];
const trackStrip = union(
  TRACK_BEDS.map(([y0, y1]) =>
    loftX(
      layerXs.map((x) => {
        const zt = railZ(x);
        return { x, section: [[y0, zt - LAYER], [y1, zt - LAYER], [y1, zt + ABOVE], [y0, zt + ABOVE]] };
      }),
    ),
  ),
);
const track = trackStrip.intersect(bridge);
const structure = bridge.subtract(trackStrip);
const parts = [
  ["building:hedelse-spoorbrug", structure],
  ["road:spoor", track, SPOOR_ATTRIBUTES],
];
{
  const whole = bridge.volume();
  const sum = structure.volume() + track.volume();
  console.log(
    "volumes (m3): brug",
    +whole.toFixed(2),
    "constructie",
    +structure.volume().toFixed(2),
    "spoor",
    +track.volume().toFixed(2),
    "som - brug",
    +(sum - whole).toFixed(4),
  );
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
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
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
    // PDOK-attributen (zoals bij de BGT-wegdelen) voor de kleurregels.
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
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
for (const [name, solid, attributes] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    ...(attributes ? { attributes } : {}),
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
report.trusses = {
  girders: GIRDERS.map(({ label, spans }) => ({ label, spansM: spans.map(([a, b]) => +(b - a).toFixed(2)), panels: spans.map(([, , n]) => n) })),
  throughOpenings,
  blindNiches,
  minFlankDeg: +Math.min(...openingAngles).toFixed(1),
  topNap: { besidePier: +(Math.max(...GIRDERS[1].spans.flatMap(([a, b, n]) => Array.from({ length: n }, (_, k) => contTop(a + ((b - a) * (k + 0.5)) / n)))) + WATER_NAP).toFixed(2), mainMid: CONT.low, floodplain: +(FLOOD_HEIGHT + RAIL_NAP[1][1]).toFixed(2) },
};
const glbFile = path.join(outDir, "hedelse-spoorbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-hedelse-spoorbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `hedelse-spoorbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Hedelse spoorbrug 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
const samplePoints = [-30, 0, 30].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "hedelse-spoorbrug.json"),
  JSON.stringify(
    {
      name: "Hedelse spoorbrug",
      file: "hedelse-spoorbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [147197.04, 416821.9],
      xAxis: [-0.06925, 0.9976],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      // Op het water van de Maas naast de hoofdoverspanning, aan beide zijden.
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden tussen de twee rivierpijlers op de waterspiegel van de Maas (z = 0, NAP +1,1 m) in de oorsprong, +X langs de brug naar het noorden (Hedel, RD-richting 93,97 graden vanaf het oosten) en +Y stroomafwaarts naar het westen. Twee nodes: road:spoor, de bovenste 0,5 m van het dek tussen de vakwerkliggers van elke brug (twee spoorbedden van 4,2 m) met de attributen van het BGT-wegdeel in extras.attributes (bgt_functie spoorbaan, bgt_fysiekvoorkomen half verhard; op het dek ligt geen actueel BGT-wegdeel, dus die van de landhoofden), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, twee gelijke spoorbruggen naast elkaar (sinds 1978), samen een dek van 15,4 m breed van het zuidelijke landhoofd (x = -186,8) tot het noordelijke (x = 308,7) met de spoorstaaf op NAP +10,2 tot +12,25 m; vier vakwerkliggers (6,25 en 1,0 m naast de as) als dichte platen van 1,0 m met doorgaande driehoekige openingen met de punt omhoog en blinde nissen voor de driehoeken met een vlakke bovenkant: een doorgaande ligger over de rivier (61,8, 106,1 en 59,9 m) met de bovenrand op NAP +24,7 m naast de rivierpijlers en +21,1 m in het midden, en vier velden van 61 tot 63 m met evenwijdige randen 5,9 m boven de spoorstaaf; de twee stenen rivierpijlers van 8 × 29,6 m met spitse koppen en vier pijlers in de uiterwaarden (BGT). Windverbanden, portalen, bovenleiding, leuningen en loopbruggen zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de hoofdoverspanning bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(DECK.x1 - DECK.x0).toFixed(1),
        deckWidthM: +(DECK.y1 - DECK.y0).toFixed(1),
        spansM: BEARINGS.slice(1).map((x, i) => +(x - BEARINGS[i]).toFixed(2)),
        mainSpanM: +(BEARINGS[3] - BEARINGS[2]).toFixed(2),
        trussLinesFromAxisM: TRUSSES.map(({ y0, y1 }) => +((y0 + y1) / 2).toFixed(2)),
        trussTopNapM: { besideRiverPiers: 24.7, mainMid: CONT.low, floodplainAboveRail: FLOOD_HEIGHT },
        railNapM: { south: RAIL_NAP[0][1], river: 12.25, north: RAIL_NAP[RAIL_NAP.length - 1][1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Hedelse_spoorbrug",
        "PDOK BGT overbruggingsdeel (dek, pijlers, sloven, landhoofden), EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor de spoorstaaf en de bovenrand van de vakwerkliggers",
        "Wikimedia Commons: Hedel spoorbrug 1.jpg, Hedel spoorbrug 2.jpg, Hedel spoorbrug 3.jpg, Hedelse spoorbrug.jpg, Hedelse Brug.jpg, HUA-170350-Gezicht op de spoorbrug over de Maas bij Hedel, na de verdubbeling van de brug.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

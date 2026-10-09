// Genereert een vereenvoudigd, gesloten 3D-model van de Dafne Schippersbrug in
// Utrecht: de fiets- en voetbrug van NEXT architects en Rudy Uytenhaak (2017)
// over het Amsterdam-Rijnkanaal tussen Leidsche Rijn en Oog in Al. Een
// grondverankerde hangbrug met een overspanning van 110 m: aan de westkant
// (Leidsche Rijn) een hoge A-vormige pyloon die naar achteren helt, aan de
// oostkant twee losse kolommen naast het dek, twee hoofdkabels met hangers en
// tuien naar ankers in de grond. Op de oostoever loopt het dek over het dak
// van de tegelijk gebouwde school (OBS Oog in Al, met gymzaal) en draait aan
// de oostkant van de school een kwartslag naar het noorden, de oprit over het
// groene dak en een bakstenen viaduct naar de lus over de grondwal in het
// Victor Hugoplantsoen. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal> met een printvoet onder de
// overspanning.
//
//   node scripts/generate-dafne-schippersbrug.mjs              # 1:1000 (standaard)
//   node scripts/generate-dafne-schippersbrug.mjs --scale 2000
//
// Assenstelsel: oorsprong op de as van het BGT-dek midden tussen de voeten van
// de westpyloon en de oostkolommen (RD 133887,25, 455478,79), op het maaiveld
// van de oostoever (NAP +1,83 m), Z omhoog. +X loopt langs de brug naar het
// oosten (Oog in Al, RD-richting 6,49 graden vanaf het oosten), +Y naar het
// noordnoordwesten. De westpyloon staat op x = -55, de oostkolommen op x = 55,
// de westgevel van de school op x = 86,5 en de oprit op x = 138,3 tot 145,1.
//
// Bronnen: BGT overbruggingsdeel (dek 173,4 × 7,5 m, de twee voeten van de
// westpyloon 11 m uit elkaar, de twee oostkolommen, landhoofd west, pijlers en
// ankers, de oprit ten noorden van de school); BAG-pand 0344100000141216
// (school, bouwjaar 2016, onderwijs- en sportfunctie) voor de plattegrond van
// de school; AHN DSM/DTM 0,5 m (PDOK WCS) voor het lengteprofiel van het dek
// (NAP +8,6 m aan het landhoofd, +10,1 m in het midden, +6,5 m bij de draai),
// de top van de pyloon (NAP +36,8 m), de kolommen (NAP +21,0 m), de ligging en
// hoogte van de kabels, de daken van de school (gymzaal NAP +9,15 m, laagbouw
// +6,4 en +5,9 m) en de oprit (NAP +6,5 tot +5,9 m); Wikipedia en NEXT
// architects voor de overspanning (110 m), de doorvaarthoogte (9 m) en het
// hoogste punt (bijna 35 m boven het water); Wikimedia Commons-foto's voor de
// vorm van pyloon en kolommen, de hangers, de tuien, de bakstenen gevels met
// smalle verticale ramen en de oprit.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "dafne-schippersbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Polygoon in het XY-vlak, uitgetrokken van z0 tot z1.
const prism = (pts, z0, z1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(points)]), y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Dakvlak: houdt alles onder z = z0 + k (y - y0) (planvergelijking).
const belowPlaneY = (solid, y0, z0, k) => {
  const n = Math.hypot(k, 1);
  // trimByPlane houdt n·p >= offset: k y - z >= k y0 - z0.
  return solid.trimByPlane([0, k / n, -1 / n], (-z0 + k * y0) / n);
};
// Staaf als omhullende van twee horizontale vierkanten (halve zijde h).
const rod = (a, b, h) =>
  Manifold.hull([
    boxFromTo(a[0] - h, a[0] + h, a[1] - h, a[1] + h, a[2] - 0.01, a[2] + 0.01),
    boxFromTo(b[0] - h, b[0] + h, b[1] - h, b[1] + h, b[2] - 0.01, b[2] + 0.01),
  ]);
// Spil langs een lijn: omhullende van horizontale vierkanten [x, y, z, h].
const spindle = (stations) =>
  Manifold.hull(
    stations.map(([x, y, z, h]) => boxFromTo(x - h, x + h, y - h, y + h, z - 0.01, z + 0.01)),
  );
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
const range = (a, b, step) => {
  const xs = [];
  const n = Math.max(1, Math.round((b - a) / step));
  for (let i = 0; i <= n; i++) xs.push(+(a + ((b - a) * i) / n).toFixed(4));
  return xs;
};

// ---------- hoofdmaten ----------
// z = 0 is het maaiveld van de oostoever (NAP +1,83 m, de laagste
// PDOK-terreinhoogte op de bemonsteringspunten).
const GROUND_NAP = 1.83;
const Z = (nap) => +(nap - GROUND_NAP).toFixed(3);
const BASE = -0.6; // gemeenschappelijke onderkant (NAP +1,23 m)
const S0 = 85.2; // afstand langs de as van het westelijke landhoofd tot de oorsprong

// Dek in NAP-meters om de 4 m vanaf het westelijke landhoofd (s = -4 tot 224,
// x = s - 85,2): mediaan van het AHN-DSM over 3 × 4 m rond de as; op s = 28
// (de pyloon) geïnterpoleerd. Vanaf s = 172 ligt het dek op de school.
const DECK_NAP = [
  8.51, 8.65, 8.8, 8.96, 9.1, 9.22, 9.36, 9.46, 9.58, 9.7, 9.75, 9.81, 9.87, 9.93, 9.96, 10.0, 10.04,
  10.08, 10.08, 10.1, 10.1, 10.1, 10.09, 10.1, 10.1, 10.1, 10.1, 10.07, 10.05, 10.01, 9.97, 9.94, 9.87,
  9.82, 9.78, 9.72, 9.64, 9.53, 9.4, 9.27, 9.15, 9.0, 8.87, 8.73, 8.61, 8.49, 8.32, 8.18, 8.0, 7.85, 7.7,
  7.53, 7.36, 7.19, 7.03, 6.86, 6.68, 6.52,
];
function deckZ(x) {
  const f = Math.min(Math.max((x + S0 + 4) / 4, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return Z(DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t);
}
// Dek (BGT): 7,42 m breed (de oorsprong ligt op het midden), van het
// landhoofd op x = -86,1 tot de school op x = 86,5. Doorsnede: rand 0,5 m dik,
// onderkant 4 m breed en 1,4 m onder het dek (doorvaarthoogte 9 m volgens de
// bron: onderkant NAP +8,7 m in het midden; geschat op foto's).
const DECK = { half: 3.71, edge: 0.5, depth: 1.4, bottomHalf: 2.0, west: -86.1, school: 86.45 };
// Landhoofd west (BGT): x -86,9 tot -85,1, met vleugels van t = -5,5 tot 8,1.
const ABUTMENT = { x0: -86.9, x1: -85.1, y0: -5.48, y1: 8.14 };

// Westpyloon: A-vorm (twee poten die in de top samenkomen en 5 m naar
// achteren hellen). Voeten (BGT) op x = -54,97, y = ±5,43 op het jaagpad
// (NAP +3,0 m); top (AHN) op x = -59,97 boven de as, NAP +36,8 m. Poten
// 1,6 m aan de voet, 1,9 m op dekhoogte, 1,2 m in de top (foto's).
const PYLON = { foot: [-54.97, 5.43, Z(3.0)], top: [-59.97, 0, Z(36.8)], hFoot: 0.8, hMid: 0.95, hTop: 0.6 };
// Oostkolommen (BGT): voeten op x = 55,17, y = ±4,25; toppen (AHN) op
// x = 54,2, y = ±5,7, NAP +21,0 m; vierkant 1,7 tot 1,5 m.
const COLUMN = { foot: [55.17, 4.25], top: [54.2, 5.7, Z(21.0)], hFoot: 0.85, hTop: 0.75 };
// Hoofdkabels: parabool door de pyloontop, de kolomtoppen en een laagste
// punt van NAP +12,8 m (AHN, 2,7 m boven het dek op x = 12); in plattegrond
// van de as bij de pyloon naar y = ±5,7 bij de kolommen (AHN).
const CABLE = { low: Z(12.8), lateralPower: 0.75 };
const cableR = Math.sqrt((PYLON.top[2] - CABLE.low) / (COLUMN.top[2] - CABLE.low));
const CABLE_X0 = (cableR * COLUMN.top[0] + PYLON.top[0]) / (1 + cableR);
const CABLE_A = (COLUMN.top[2] - CABLE.low) / (COLUMN.top[0] - CABLE_X0) ** 2;
const cableZ = (x) => CABLE.low + CABLE_A * (x - CABLE_X0) ** 2;
const cableY = (x) =>
  COLUMN.top[1] *
  Math.max(0, Math.min(1, (x - PYLON.top[0]) / (COLUMN.top[0] - PYLON.top[0]))) ** CABLE.lateralPower;
// Kabelvlak: kabel en hangers als één plaat van 1 m van de dekrand naar de
// kabel, met spitse openingen (zijden van 55 graden) tussen de hangers en een
// dichte strook van 1 m boven het dek (de leuning). 19 velden van 5,8 m tussen
// pyloon en kolommen (foto's), hangers 0,9 m.
const SHEET = { width: 1.0, rail: 1.0, panels: 19, hanger: 0.9, pointed: (55 * Math.PI) / 180 };
// Tuien: west van de pyloontop naar ankers (BGT) op x = -74,45, y = ±4,7;
// oost van de kolomtoppen naar de pijlers (BGT) op x = 67,55, y = ±3,4. Op
// 1:1000 staven van 1,1 m (in werkelijkheid bundels van drie kabels).
const STAY = { h: 0.55, westAnchor: [-74.45, 4.7, Z(3.0)], eastAnchor: [67.55, 3.4, Z(1.8)] };
const WEST_ANCHOR = { x0: -75.4, x1: -73.5, y0: 3.7, y1: 5.7, top: Z(3.2) };
// Pijlers onder het dek op de oostoever (BGT), per kant twee.
const PIERS = [
  { x0: 66.69, x1: 68.4, y0: 2.66, y1: 4.13 },
  { x0: 69.75, x1: 70.8, y0: 3.0, y1: 3.9 },
];

// School (BAG 0344100000141216) in modelcoördinaten: gymzaal west, laagbouw
// met groen dak oost, en langs de zuidgevel de strook onder het dek.
const SCHOOL_OUTLINE = [
  [113.8, 22.24], [109.19, 22.19], [109.21, 33.04], [109.21, 35.52], [109.09, 36.01], [108.83, 36.44],
  [108.45, 36.78], [107.99, 36.98], [107.49, 37.03], [102.59, 37.06], [86.56, 37.1], [86.46, 10.36],
  [86.45, -3.75], [87.47, -3.77], [104.86, -3.82], [137.61, -3.88], [138.24, -3.88], [138.19, -1.23],
  [140.51, 0.45], [142.42, 2.57], [143.86, 5.05], [144.74, 7.77], [145.05, 10.62], [145.07, 21.61],
  [145.06, 22.07], [144.96, 22.69], [144.66, 23.25], [144.22, 23.69], [143.66, 23.98], [143.04, 24.08],
  [128.45, 24.12], [114.73, 24.14], [114.45, 24.13], [114.18, 24.04], [113.96, 23.87], [113.81, 23.63],
  [113.74, 23.36],
];
const SCHOOL = {
  south: -3.88, // zuidgevel onder het dek
  strip: 6.5, // zuidgevel van gymzaal en laagbouw (AHN)
  gymEast: 109.2, // oostgevel van de gymzaal (BAG)
  rampWest: 138.26, // westrand van de oprit (BGT)
  gymRoof: Z(9.15), // dak gymzaal (AHN, zonnepanelen tot NAP +9,5 m)
  pvTop: Z(9.5),
  lowRoofSouth: Z(6.4), // laagbouw zuid (AHN)
  lowRoofNorth: Z(5.9), // laagbouw noord (AHN)
  lowSplit: 16.5,
};
// Oprit: van het dek op de school (x = 138,2) een kwartslag naar het noorden
// over de oostrand van de laagbouw en daarna als bakstenen viaduct tot het
// landhoofd op de grondwal (BGT, y = 42,7). Bovenkant (AHN): NAP +6,55 m in de
// draai, +5,9 m vanaf y = 30.
const RAMP = { x0: 138.26, x1: 145.12, yEnd: 42.67, cornerTop: Z(6.55), slopeFrom: 3.8, slopeTo: 30, endTop: Z(5.9) };

// ---------- dek ----------
const deckStations = range(DECK.west, DECK.school + 0.4, 0.5);
const deck = loftX(
  deckStations.map((x) => {
    const zt = deckZ(x);
    return {
      x,
      section: [
        [-DECK.half, zt - DECK.edge],
        [-DECK.bottomHalf, zt - DECK.depth],
        [DECK.bottomHalf, zt - DECK.depth],
        [DECK.half, zt - DECK.edge],
        [DECK.half, zt],
        [-DECK.half, zt],
      ],
    };
  }),
);
// Op de school: plaat van 0,6 m, gelijk met de zuidgevel.
const roofDeck = loftX(
  range(DECK.school, RAMP.x0 + 0.05, 0.5).map((x) => {
    const zt = deckZ(x);
    return { x, section: [[SCHOOL.south, zt - 0.6], [DECK.half, zt - 0.6], [DECK.half, zt], [SCHOOL.south, zt]] };
  }),
);
const abutment = boxFromTo(ABUTMENT.x0, ABUTMENT.x1, ABUTMENT.y0, ABUTMENT.y1, BASE, deckZ(ABUTMENT.x1) - 0.05);

// ---------- oprit ----------
const RAMP_PLAN = [
  [138.2, SCHOOL.south], [138.19, -1.23], [140.51, 0.45], [142.42, 2.57], [143.86, 5.05], [144.74, 7.77],
  [145.05, 10.62], [145.07, 22.07], [RAMP.x1, RAMP.yEnd], [RAMP.x0, RAMP.yEnd], [RAMP.x0, DECK.half],
  [138.2, DECK.half],
];
const rampBlock = prism(RAMP_PLAN, BASE, RAMP.cornerTop);
const rampK = (RAMP.endTop - RAMP.cornerTop) / (RAMP.slopeTo - RAMP.slopeFrom);
// Bovenkant: vlak tot y = 3,8, dan hellend, vanaf y = 30 weer vlak. Als twee
// elkaar overlappende stukken (de hele oprit onder het hellende vlak, en de
// hele oprit tot de eindhoogte): drie stukken die precies tegen elkaar aan
// lagen, hielden op de knikken een inwendige naad.
const ramp = union([
  belowPlaneY(rampBlock, RAMP.slopeFrom, RAMP.cornerTop, rampK),
  rampBlock.intersect(boxFromTo(130, 150, -10, 50, BASE - 1, RAMP.endTop)),
]).subtract(
  // Doorgang onder het viaduct (foto): aan beide kanten een blinde nis van
  // 4 m breed en 2,7 m hoog.
  union([
    boxFromTo(RAMP.x0 - 0.1, RAMP.x0 + 0.4, 27, 31, 0.1, 2.8),
    boxFromTo(RAMP.x1 - 0.4, RAMP.x1 + 0.1, 27, 31, 0.1, 2.8),
  ]),
);

// ---------- westpyloon en oostkolommen ----------
const lerp3 = (a, b, f) => a.map((v, i) => v + (b[i] - v) * f);
// grow: alle zijden zoveel groter (voor de vrije marge rond het wegdek).
function pylonLeg(side, grow = 0) {
  const foot = [PYLON.foot[0], side * PYLON.foot[1], PYLON.foot[2]];
  const top = PYLON.top;
  const at = (z) => lerp3(foot, top, (z - foot[2]) / (top[2] - foot[2]));
  return spindle([
    [...at(BASE).slice(0, 2), BASE, PYLON.hFoot + grow],
    [...at(Z(9.5)).slice(0, 2), Z(9.5), PYLON.hMid + grow],
    [...top.slice(0, 2), top[2], PYLON.hTop + grow],
  ]);
}
const pylon = union([pylonLeg(1), pylonLeg(-1)]);
function column(side, grow = 0) {
  const foot = [COLUMN.foot[0], side * COLUMN.foot[1], 0];
  const top = [COLUMN.top[0], side * COLUMN.top[1], COLUMN.top[2]];
  const f = BASE / top[2];
  const base = lerp3(foot, top, f);
  return spindle([
    [base[0], base[1], BASE, COLUMN.hFoot + grow],
    [top[0], top[1], top[2], COLUMN.hTop + grow],
  ]);
}
const columns = union([column(1), column(-1)]);

// ---------- kabelvlakken met hangers ----------
const sheetX0 = PYLON.top[0] + 0.5;
const sheetX1 = COLUMN.top[0];
const hangerX = Array.from(
  { length: SHEET.panels + 1 },
  (_, i) => PYLON.foot[0] + ((COLUMN.foot[0] - PYLON.foot[0]) * i) / SHEET.panels,
);
const openings = [];
for (let i = 0; i < SHEET.panels; i++) {
  const a = hangerX[i] + SHEET.hanger / 2;
  const b = hangerX[i + 1] - SHEET.hanger / 2;
  // Hoogste aanzet van de spitse top die overal 0,9 m onder de kabel blijft.
  let shoulder = Infinity;
  let floor = Infinity;
  for (let k = 0; k <= 200; k++) {
    const x = a + ((b - a) * k) / 200;
    shoulder = Math.min(shoulder, cableZ(x) - 0.9 - Math.tan(SHEET.pointed) * Math.min(x - a, b - x));
    floor = Math.min(floor, deckZ(x) + SHEET.rail);
  }
  floor = Math.max(floor, Math.max(deckZ(a), deckZ(b)) + SHEET.rail - 0.05);
  if (shoulder < floor + 0.8) continue;
  const apex = shoulder + (Math.tan(SHEET.pointed) * (b - a)) / 2;
  openings.push({ a, b, floor, shoulder, apex });
}
// Plaat van dekrand tot kabel zonder openingen; met grow aan alle kanten
// zoveel breder en langer (de zijvlakken blijven evenwijdig aan die van de
// plaat).
function sheetPlate(side, grow = 0) {
  const a = DECK.half - SHEET.width / 2;
  const w = SHEET.width / 2 + grow;
  const xs = [...range(sheetX0, sheetX1, 0.5), ...hangerX.filter((x) => x > sheetX0 && x < sheetX1)]
    .sort((p, q) => p - q)
    .filter((x, i, arr) => i === 0 || x - arr[i - 1] > 1e-3);
  if (grow) {
    xs[0] -= grow;
    xs[xs.length - 1] += grow;
  }
  return loftX(
    xs.map((x) => {
      const zb = deckZ(x) - 0.3;
      const c = cableY(x);
      const zc = cableZ(x);
      const pts = [[a - w, zb], [a + w, zb], [c + w, zc], [c - w, zc]];
      return { x, section: side > 0 ? pts : pts.map(([y, z]) => [-y, z]).reverse() };
    }),
  );
}
function sheet(side) {
  const plate = sheetPlate(side);
  const [y0, y1] = side > 0 ? [0, 12] : [-12, 0];
  const holes = openings.map(({ a: xa, b: xb, floor, shoulder, apex }) =>
    profileY([[xa, floor], [xb, floor], [xb, shoulder], [(xa + xb) / 2, apex], [xa, shoulder]], y0, y1),
  );
  return holes.length ? plate.subtract(union(holes)) : plate;
}
const sheets = union([sheet(1), sheet(-1)]);

// ---------- tuien, ankers en pijlers ----------
const stayRods = (grow = 0) =>
  [1, -1].flatMap((side) => {
    const wa = STAY.westAnchor;
    const ea = STAY.eastAnchor;
    return [
      rod([PYLON.top[0], side * 0.3, PYLON.top[2] - 1.0], [wa[0], side * wa[1], wa[2]], STAY.h + grow),
      rod([COLUMN.top[0], side * COLUMN.top[1], COLUMN.top[2] - 0.6], [ea[0], side * ea[1], ea[2]], STAY.h + grow),
    ];
  });
const stays = union(stayRods());
const anchors = union(
  [1, -1].map((side) =>
    boxFromTo(WEST_ANCHOR.x0, WEST_ANCHOR.x1, side * WEST_ANCHOR.y0, side * WEST_ANCHOR.y1, BASE, WEST_ANCHOR.top),
  ),
);
const piers = union(
  [1, -1].flatMap((side) =>
    PIERS.map(({ x0, x1, y0, y1 }) =>
      boxFromTo(x0, x1, side * y0, side * y1, BASE, deckZ((x0 + x1) / 2) - DECK.edge - 0.1),
    ),
  ),
);

// Alles wat onder de gemeenschappelijke onderkant uitsteekt (de staafeinden)
// wordt daar afgesneden.
const bridge = union([deck, roofDeck, abutment, ramp, pylon, columns, sheets, stays, anchors, piers]).trimByPlane(
  [0, 0, 1],
  BASE,
);

// ---------- school ----------
const outline = prism(SCHOOL_OUTLINE, BASE, 20);
// Strook onder het dek: dak 0,15 m onder het dek, dat er als plaat op ligt.
const strip = loftX(
  range(86.45, 138.2, 0.5).map((x) => {
    const zt = deckZ(x) - 0.15;
    return { x, section: [[SCHOOL.south, BASE], [SCHOOL.strip + 0.05, BASE], [SCHOOL.strip + 0.05, zt], [SCHOOL.south, zt]] };
  }),
).intersect(outline);
const gym = outline.intersect(boxFromTo(80, SCHOOL.gymEast, SCHOOL.strip, 40, BASE, SCHOOL.gymRoof));
const lowSouth = outline.intersect(
  boxFromTo(SCHOOL.gymEast - 0.05, SCHOOL.rampWest, SCHOOL.strip, SCHOOL.lowSplit, BASE, SCHOOL.lowRoofSouth),
);
const lowNorth = outline.intersect(
  boxFromTo(SCHOOL.gymEast - 0.05, SCHOOL.rampWest, SCHOOL.lowSplit - 0.05, 40, BASE, SCHOOL.lowRoofNorth),
);
// Zonnepanelen op de gymzaal: een veld van 0,35 m, 1,2 m van de dakrand.
const pv = boxFromTo(87.8, SCHOOL.gymEast - 1.3, SCHOOL.strip + 1.2, 35.8, SCHOOL.gymRoof - 0.1, SCHOOL.pvTop);
// Gevelreliëf: smalle verticale ramen als blinde nissen van 0,35 m (foto's),
// in de zuidgevel onder het dek, de westgevel en de noordgevels; in de
// noordgevel van de laagbouw brede klaslokaalramen.
const NICHE = 0.35;
const niches = [];
for (let x = 88.5; x < 137; x += 2.7) {
  const top = deckZ(x + 0.5) - 1.9;
  if (top > 2.2) niches.push(boxFromTo(x, x + 1.0, SCHOOL.south - 0.1, SCHOOL.south + NICHE, 1.0, top));
}
for (let y = -2.4; y < 35.5; y += 3.0) {
  if (Math.abs(y + 0.5 - SCHOOL.strip) < 1.0) continue;
  const top = y < SCHOOL.strip ? deckZ(86.5) - 1.9 : SCHOOL.gymRoof - 1.3;
  niches.push(boxFromTo(86.3, 86.5 + NICHE + 0.1, y, y + 1.0, 1.0, top));
}
for (let x = 88.5; x < 106; x += 3.0) {
  niches.push(boxFromTo(x, x + 1.0, 37.1 - NICHE - 0.05, 37.4, 1.0, SCHOOL.gymRoof - 1.3));
}
for (let x = 116; x < 136.5; x += 3.6) {
  niches.push(boxFromTo(x, x + 1.8, 24.12 - NICHE - 0.05, 24.4, 0.9, SCHOOL.lowRoofNorth - 1.3));
}
const school = union([strip, gym, lowSouth, lowNorth, pv]).subtract(union(niches));

// ---------- groen dak ----------
const roofGarden = union([
  boxFromTo(SCHOOL.gymEast + 0.9, SCHOOL.rampWest - 0.2, SCHOOL.strip + 0.9, SCHOOL.lowSplit, SCHOOL.lowRoofSouth - 0.1, SCHOOL.lowRoofSouth + 0.3),
  boxFromTo(SCHOOL.gymEast + 0.9, SCHOOL.rampWest - 0.2, SCHOOL.lowSplit + 0.4, 24.12 - 0.9, SCHOOL.lowRoofNorth - 0.1, SCHOOL.lowRoofNorth + 0.3),
]).intersect(outline);

// ---------- fietspad en voetpad als eigen onderdelen ----------
// De bovenste 0,5 m van het dek, de plaat op de school en de oprit is per
// BGT-functie een eigen node met de attributen van het wegdeel (glTF
// `extras.attributes`), zodat de kleurregels van een thema (bijvoorbeeld
// fietspaden rood) op de brug werken zoals op de PDOK-wegdelen ernaast. Het
// zijn de actuele BGT-wegdelen met relatieve hoogteligging 1 (lokale
// coördinaten, vereenvoudigd tot 5 cm met gedeelde randen): op het dek het
// fietspad en aan de zuidkant het voetpad, op de school dezelfde twee, in de
// draai en op de oprit het fietspad met aan de buitenkant het voetpad, en een
// trapje (voetpad op trap) aan de zuidrand bij de draai. Een rijbaan is er
// niet (fiets- en voetbrug). De dekranden buiten de wegdelen, de kabelvlakken,
// de pyloon, de kolommen en de tuien blijven constructie.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const PAVED = { bgt_fysiekvoorkomen: "gesloten verharding" };
const ROADS = [
  {
    name: "road:fietspad",
    attributes: { bgt_functie: "fietspad", ...PAVED },
    polygons: [
      // G0344.31d3477fa17e4f998b38f137686880c7: het dek over het kanaal, noordkant.
      [[86.45, -1.2], [87.34, -1.2], [87.34, 3.25], [86.93, 3.25], [-86.09, 3.28], [-86.09, 2.93], [-86.08, -1.2]],
      // G0344.f665b5201c874178a4c4650a2314ccef: op de school en door de draai naar het noorden.
      [[143.17, 11.92], [143.2, 23.24], [138.64, 23.25], [138.61, 10.66], [138.5, 9.49], [138.22, 8.35],
        [137.72, 7.14], [136.93, 5.93], [135.91, 4.89], [134.72, 4.07], [133.38, 3.5], [132.68, 3.32],
        [131.2, 3.16], [94.62, 3.24], [87.34, 3.25], [87.34, -1.2], [87.6, -1.2], [131.25, -1.31],
        [132.13, -1.27], [133.87, -0.99], [135.56, -0.48], [137.18, 0.31], [137.96, 0.82], [139.4, 1.99],
        [140.64, 3.37], [141.67, 4.91], [142.48, 6.82], [142.99, 8.82], [143.13, 9.85]],
      // G0344.52a5b4973b9340eda8701f2e16c91973: het viaduct tot de grondwal.
      [[143.24, 37.29], [143.25, 42.67], [138.68, 42.68], [138.64, 24.09], [138.64, 23.25], [143.2, 23.24]],
    ],
  },
  {
    name: "road:voetpad",
    attributes: { bgt_functie: "voetpad", ...PAVED },
    polygons: [
      // G0344.66068976d5db4c1a9c028165a0c935b1: het dek over het kanaal, zuidkant.
      [[87.34, -1.2], [86.45, -1.2], [-86.08, -1.2], [-86.08, -3.21], [86.45, -3.26], [87.34, -3.25]],
      // G0344.60d9f356673e4d62b16af4940985a169: op de school en langs de buitenkant van de draai.
      [[136.92, -3.39], [137.6, -3.4], [137.59, -1.53], [136.93, -1.6], [136.94, -1.37], [138.58, -0.46],
        [140.08, 0.69], [140.76, 1.34], [141.98, 2.77], [142.51, 3.55], [143.26, 4.9], [143.93, 6.59],
        [144.4, 8.56], [144.57, 10.69], [144.58, 15.22], [144.6, 22.74], [143.62, 22.75], [143.62, 23.25],
        [143.2, 23.24], [143.17, 11.92], [143.13, 9.85], [142.99, 8.82], [142.48, 6.82], [141.67, 4.91],
        [140.64, 3.37], [139.4, 1.99], [137.96, 0.82], [137.18, 0.31], [135.56, -0.48], [133.87, -0.99],
        [132.13, -1.27], [131.25, -1.31], [87.6, -1.2], [87.34, -1.2], [87.34, -3.25], [87.36, -3.27]],
      // G0344.69478982fd36490594efbd6df349c381: langs de oostrand van het viaduct.
      [[144.66, 37.16], [144.69, 42.67], [143.25, 42.67], [143.24, 37.29], [143.2, 23.24], [143.62, 23.25],
        [143.62, 22.75], [144.6, 22.74]],
    ],
  },
  {
    name: "road:voetpad op trap",
    attributes: { bgt_functie: "voetpad op trap", ...PAVED },
    polygons: [
      // G0344.7caef7a48c5644c6883bbce0470853ef: het trapje aan de zuidrand bij de draai.
      [[138.18, -1.23], [137.59, -1.53], [137.6, -3.4], [138.23, -3.4]],
    ],
  },
];
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek over dezelfde
// loftstations als het dek en de plaat op de school, en over de oprit met
// dezelfde knikken als de oprit. Hij reikt tot boven het wegdek, zodat de
// constructie onder een wegdeel geen eigen bovenvlak op het wegdek houdt
// (z-fighting op de kaart).
const layerSection = (x, y0, y1) => {
  const zt = deckZ(x);
  return { x, section: [[y0, zt - LAYER], [y1, zt - LAYER], [y1, zt + ABOVE], [y0, zt + ABOVE]] };
};
const deckLayer = loftX(deckStations.map((x) => layerSection(x, -DECK.half - 1, DECK.half + 1)));
const roofLayer = loftX(
  range(DECK.school, RAMP.x0 + 0.05, 0.5).map((x) => layerSection(x, SCHOOL.south - 1, DECK.half + 1)),
);
const rampBox = (y0, y1, z0, z1) => boxFromTo(RAMP.x0 - 0.3, RAMP.x1 + 1, y0, y1, z0, z1);
// Boven het hellende deel: onder het vlak 1 m boven de oprit, boven het vlak
// 0,5 m eronder. Dit stuk loopt 0,5 m over de knikken door: precies tegen de
// vlakke stukken aan bleef het wegdek daar in twee losse delen.
const abovePlaneY = (solid, y0, z0, k) => {
  const n = Math.hypot(k, 1);
  return solid.trimByPlane([0, -k / n, 1 / n], (z0 - k * y0) / n);
};
const rampLayer = union([
  rampBox(SCHOOL.south - 1, RAMP.slopeFrom, RAMP.cornerTop - LAYER, RAMP.cornerTop + ABOVE),
  abovePlaneY(
    belowPlaneY(rampBox(RAMP.slopeFrom - 0.5, RAMP.slopeTo + 0.5, 0, 20), RAMP.slopeFrom, RAMP.cornerTop + ABOVE, rampK),
    RAMP.slopeFrom,
    RAMP.cornerTop - LAYER,
    rampK,
  ),
  rampBox(RAMP.slopeTo, RAMP.yEnd + 1, RAMP.endTop - LAYER, RAMP.endTop + ABOVE),
]);
// Wat boven het dek uitsteekt en constructie blijft, met 2 cm vrij: de
// kabelvlakken over hun hele strook (ook onder de openingen), de poten van de
// pyloon, de kolommen en de tuien. Ze hellen; uit de strook gaat hun hele
// schaduw binnen de strook, zodat de grens tussen wegdeel en constructie
// verticaal is. Met een schuine grens liep het wegdeel of de constructie aan
// het wegdek in een wig zonder dikte uit, met twee bovenvlakken op elkaar.
const notLayer = union([
  sheetPlate(1, GUARD),
  sheetPlate(-1, GUARD),
  pylonLeg(1, GUARD),
  pylonLeg(-1, GUARD),
  column(1, GUARD),
  column(-1, GUARD),
  ...stayRods(GUARD),
]);
const layerBand = union([deckLayer, roofLayer, rampLayer]);
const guardShadow = Manifold.extrude(notLayer.intersect(layerBand).project(), 61).translate([0, 0, BASE - 1]);
const layer = layerBand.subtract(guardShadow);
// De wegdelen per functie en alle samen eerst in het vlak verenigd (gedeelde
// randen vallen dan precies samen); als losse prisma's verenigd hield de
// constructie langs die randen platte restjes zonder volume over.
const plan = (polygons) => CrossSection.union(polygons.map((poly) => new CrossSection([ccw(poly)])));
const planPrism = (section) => Manifold.extrude(section, 61).translate([0, 0, BASE - 1]);
const roadCuts = ROADS.map(({ polygons }) => layer.intersect(planPrism(plan(polygons))));
const roadParts = ROADS.map(({ name, attributes }, i) => [name, roadCuts[i].intersect(bridge), attributes]);
const structure = bridge.subtract(layer.intersect(planPrism(plan(ROADS.flatMap(({ polygons }) => polygons)))));
const parts = [
  ["building:brug", structure],
  ...roadParts,
  ["building:school", school],
  ["vegetation:daktuin", roofGarden],
];
// Partitiecontrole: constructie en wegdelen samen zijn de brug, zonder overlap.
const partition = {
  bridgeM3: +bridge.volume().toFixed(3),
  partsM3: +(structure.volume() + roadParts.reduce((sum, [, solid]) => sum + solid.volume(), 0)).toFixed(3),
  overlapM3: +union(roadParts.map(([, solid]) => solid)).intersect(structure).volume().toFixed(4),
};
if (Math.abs(partition.bridgeM3 - partition.partsM3) > 0.01 || partition.overlapM3 > 0.001) {
  throw new Error(`partitie klopt niet: ${JSON.stringify(partition)}`);
}

// ---------- printvoet (alleen in de STL) ----------
// De overspanning hangt vrij boven het water en de oevers. Net als de
// overhangopvulling van de export krijgt de STL daaronder een wig van 50
// graden die uitloopt in een scherm van 0,9 m tot de onderplaat.
const SCREEN = 0.45;
const KNEE = Math.tan((50 * Math.PI) / 180);
const printFoot = loftX(
  range(ABUTMENT.x1 - 0.2, DECK.school + 0.3, 0.5).map((x) => {
    const zb = deckZ(x) - DECK.edge + 0.02;
    const w = DECK.half + 0.02;
    const zs = Math.max(zb - KNEE * (w - SCREEN), BASE + 0.05);
    return { x, section: [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]] };
  }),
);
// De STL bevat de brug als geheel, zoals vóór de opsplitsing.
const model = union([bridge, school, roofGarden]);
const printModel = union([model, printFoot]);

// ---------- controles ----------
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    found.push({ p, area: len / 2 });
  }
  return { area, found };
}
for (const [name, solid] of [...parts, ["model", model], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (name !== "vegetation:daktuin" && !name.startsWith("road:") && Math.abs(bb.min[2] - BASE) > 1e-6) {
    throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  }
}
const overhangReport = {};
{
  const { area } = overhangs(bridge);
  overhangReport.bridgeM2 = Math.round(area);
  const print = overhangs(printModel);
  // In de printversie mogen alleen de bovenkanten van de nissen (0,35 tot
  // 0,4 m diep) en de dekrand naast de wig naar beneden wijzen.
  const groups = {};
  for (const { p, area: a } of print.found) {
    const c = [0, 1, 2].map((i) => (p[0][i] + p[1][i] + p[2][i]) / 3);
    const key = c[0] > 86 ? "school/oprit" : c[0] > 54 ? "oostoever" : c[0] > -62 ? "overspanning" : "west";
    groups[key] = +((groups[key] ?? 0) + a).toFixed(2);
  }
  overhangReport.printM2 = +print.area.toFixed(2);
  overhangReport.printByZone = groups;
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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
report.cable = {
  lowNap: +(CABLE.low + GROUND_NAP).toFixed(2),
  lowX: +CABLE_X0.toFixed(2),
  deckAtLowNap: +(deckZ(CABLE_X0) + GROUND_NAP).toFixed(2),
  openings: openings.length,
  openingApexNap: openings.map(({ apex }) => +(apex + GROUND_NAP).toFixed(1)),
};
report.overhang = overhangReport;
report.partition = partition;
const glbFile = path.join(outDir, "dafne-schippersbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-dafne-schippersbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `dafne-schippersbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Dafne Schippersbrug Utrecht 1:${scale} mm Z-up`);
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
// Maaiveldpunten alleen op de oostoever (NAP +1,83 tot +1,97 m): langs de
// Kanaalweg naast het dek, in de straat langs de zuidgevel van de school en op
// het schoolplein. Het jaagpad aan de westkant ligt 1 m hoger en het water
// lager; een uitsnede die alleen de westkant raakt valt terug op groundHeight.
const samplePoints = [
  [65, -12],
  [65, 12],
  [110, -12],
  [125, -12],
  [148, -12],
  [130, 32],
  [95, 45],
];
await writeFile(
  path.join(outDir, "dafne-schippersbrug.json"),
  JSON.stringify(
    {
      name: "Dafne Schippersbrug",
      file: "dafne-schippersbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [133887.25, 455478.79],
      xAxis: [0.99359, 0.11307],
      groundOffsetMetres: 0,
      // Laagste PDOK-terreinhoogte (ellipsoïdisch) op de bemonsteringspunten,
      // NAP +1,83 m; terugval als geen enkel punt in de uitsnede valt.
      groundHeight: 45.19,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0344100000141216"],
      replacesTerrain: [
        "G0344.204c1cf67fba4d858b7c9b2ed18a1e78",
        "G0344.a34753b3ec01462fbb337933f32ba422",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het BGT-dek midden tussen de voeten van de westpyloon en de oostkolommen op het maaiveld van de oostoever (z = 0, NAP +1,83 m) in de oorsprong, +X langs de brug naar het oosten (Oog in Al, RD-richting 6,49 graden vanaf het oosten) en +Y naar het noordnoordwesten. Zes nodes. Node road:fietspad, road:voetpad en road:voetpad op trap: de bovenste 0,5 m van het dek, de plaat op de school en de oprit waar de actuele BGT-wegdelen met relatieve hoogteligging 1 liggen, met hun attributen in extras.attributes (bgt_functie fietspad, voetpad of voetpad op trap, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken: het fietspad op de noordhelft van het dek, over de school en door de draai naar het noorden over de oprit, het voetpad langs de zuidrand en langs de buitenkant van de draai en de oprit, en het trapje aan de zuidrand bij de draai. Node building:brug: de rest van het kunstwerk, het dek van 7,4 m breed van het landhoofd in Leidsche Rijn (x = -86,1, NAP +8,6 m) over het Amsterdam-Rijnkanaal (NAP +10,1 m in het midden) naar de school (x = 86,5), daar als plaat op de school tot de draai op x = 138 (NAP +6,5 m) en dan een kwartslag naar het noorden als oprit over de oostrand van de laagbouw en een bakstenen viaduct met een doorgang (blinde nis) tot het landhoofd op de grondwal (y = 42,7, NAP +5,9 m); de A-vormige westpyloon (voeten 10,9 m uit elkaar op x = -55, top NAP +36,8 m op x = -60), de twee oostkolommen (x = 55, top NAP +21,0 m), de twee hoofdkabels met hangers als platen met spitse openingen tussen dekrand en kabel (laagste punt NAP +12,8 m op x = 12), de tuien naar de ankers op de westoever en de pijlers op de oostoever, en die pijlers onder het dek; de dekranden buiten de wegdelen, de kabelvlakken, de pyloon, de kolommen en de tuien blijven constructie. Node building:school: de school (BAG 0344100000141216) met de strook onder het dek, de gymzaal (dak NAP +9,15 m met een veld zonnepanelen) en de laagbouw (NAP +6,4 en +5,9 m), met smalle verticale ramen als nissen. Node vegetation:daktuin: het groene dak van de laagbouw. De lus over de grondwal in het Victor Hugoplantsoen zit in het PDOK-terrein en is niet gedubbeld; leuningen, lantaarns en de letters OOG IN AL zijn weggelaten. De export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        mainSpanM: +(COLUMN.foot[0] - PYLON.foot[0]).toFixed(1),
        deckLengthToSchoolM: +(DECK.school - DECK.west).toFixed(1),
        deckWidthM: 2 * DECK.half,
        deckNapM: { west: DECK_NAP[1], crest: Math.max(...DECK_NAP), turn: 6.55 },
        pylonTopNapM: 36.8,
        pylonFeetApartM: 2 * PYLON.foot[1],
        columnTopNapM: 21.0,
        cableLowNapM: +(CABLE.low + GROUND_NAP).toFixed(2),
        hangerPanelM: +((COLUMN.foot[0] - PYLON.foot[0]) / SHEET.panels).toFixed(2),
        schoolRoofsNapM: { gym: 9.15, lowSouth: 6.4, lowNorth: 5.9 },
        rampNapM: { turn: 6.55, end: 5.9 },
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Dafne_Schippersbrug",
        "https://www.nextarchitects.com/?p=447 (overspanning 110 m, dek 9 m boven het water, hoogste punt bijna 35 m)",
        "PDOK BGT overbruggingsdeel (dek, pyloon- en kolomvoeten, landhoofden, pijlers, oprit), EPSG:28992",
        "PDOK BAG pand 0344100000141216 (school, 2016)",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het dek, de pyloon, de kolommen, de kabels, de daken en het maaiveld",
        "Wikimedia Commons: Dafne Schippersbrug wide shot looking north.jpg, Dafne Schippersbrug east end with school.jpg, Dafne Schippersbrug, Utrecht, the Netherlands.jpg, Dafne Schippersbrug Utrecht 2019 (1-3).jpg, Dafne Schippers bridge.jpeg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

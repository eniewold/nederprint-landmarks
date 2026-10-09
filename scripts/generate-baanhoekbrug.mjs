// Genereert een vereenvoudigd, gesloten 3D-model van de Baanhoekbrug: de
// enkelsporige spoorbrug van de MerwedeLingelijn (Dordrecht - Geldermalsen)
// over de Beneden-Merwede tussen Dordrecht (zuid) en Sliedrecht (noord), met
// een fietspad aan de oostkant. Over de rivier liggen twee gelijke stalen
// vakwerkliggers van 110,7 m (vakwerk met diagonalen en stijlen, evenwijdige
// randen, schuine eindstijlen) op drie stenen pijlers; aan de zuidkant een
// basculebrug (1978-1983) met een vast deel op de basculekelder, het
// bedieningshuis op een kolom in het water en de remmingwerken; aan beide
// kanten een aanbrug als kokerligger met een uitkragend fietsdek. Alle maten in
// het script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog,
// één node per onderdeel met de materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal> met een printvoet onder de dekken.
//
//   node scripts/generate-baanhoekbrug.mjs              # 1:1250 (standaard)
//   node scripts/generate-baanhoekbrug.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het spoor (BGT-spoorhartlijn) in het
// hart van de middelste stenen pijler (RD 110500,73, 426163,54), op het water
// van de Beneden-Merwede (z = 0, NAP +0,07 m), Z omhoog. +X loopt langs de brug
// naar het noorden (Sliedrecht, RD-richting 91,52 graden vanaf het oosten), +Y
// naar het westen (stroomafwaarts); het fietspad ligt aan de oostkant (y < 0).
// Het zuidelijke landhoofd ligt op x = -290,95, het noordelijke op x = 182,3.
//
// Bronnen: BGT overbruggingsdeel (dekken van spoor en fietspad, de drie stenen
// pijlers, de aanbrugpijlers en het landhoofd), BGT wegdeel (spoorbaan en
// fietspad op het dek, ook voor de attributen) en BGT spoor (hartlijn, as van
// het model); AHN DSM en DTM 0,5 m (PDOK WCS) voor de spoorstaaf (NAP +13,07 m
// zuid, +14,3 m boven de middelste pijler, +13,58 m noord), het fietspad, de
// twee vakwerklijnen (2,5 m oost en 2,75 m west van de as) met hun bovenrand
// (10,8 m boven de spoorstaaf), de einden van de liggers en de eindstijlen, de
// pijlerkoppen (NAP +12,3 m) en hun lagere aanbouwen (+10,45 en +7,8 m), de
// aanbrugpijlers (+6,85 tot +7,5 m), de liggers van het vaste basculedeel, de
// basculekelder (+13,55 m), het bedieningshuis (dak +22,4 m) en de dukdalven
// (+4,8 m); BAG (pand 0505100000001555, het bedieningshuis); PDOK-terrein voor
// het water (43,67 m ellipsoïdisch; NAP = ellipsoïdisch - 43,6 m op het land);
// PDOK-luchtfoto (vakwerkpatroon, klep, kelder, dukdalven); Wikipedia (466,5 m,
// overspanning 110 m, beweegbaar deel 30 m wijd, vaste delen 75 m wijd);
// Wikimedia Commons-foto's (Sliedrecht Baanhoekbrug 002 tot 006, Open
// baanhoekbrug (01) en (02), Spoorbrug Sliedrecht - panoramio, Trein over de
// Baanhoekbrug in 2020, Spoorbrug bij Biesbosch, Beneden-Merwede Sliedrecht
// 004, ENI 02320501 STOLT MOSEL (02)) voor de vorm van de liggers (7 vakken,
// stijlen bij de bovenknopen), de pijlers met kraag en voet, de kokerliggers
// van de aanbruggen en het bedieningshuis.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1250"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "baanhoekbrug");
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
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const rect = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const box = (x0, x1, y0, y1, z0, z1) => prism(rect(x0, x1, y0, y1), z0, z1);
// Polygoon verschoven over d (negatief = naar binnen), als lijst polygonen.
const offsetPoly = (poly, d) => new CrossSection([ccw(poly)]).offset(d, "Round", 2, 32).toPolygons();
const clipPoly = (poly, x0, x1) => {
  const out = new CrossSection([ccw(poly)]).intersect(new CrossSection([ccw(rect(x0, x1, -100, 100))])).toPolygons();
  if (out.length !== 1) throw new Error("clipPoly: niet één polygoon");
  return out[0].map(([x, y]) => [x, y]);
};
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
  return Math.abs(area) / 2 >= 1.0 ? pts : null;
}
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in, y naar rechts en z omhoog, steeds evenveel punten).
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
const interp = (table, x) => {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 0; i + 1 < table.length; i++) {
    const [x0, v0] = table[i];
    const [x1, v1] = table[i + 1];
    if (x <= x1) return v0 + ((v1 - v0) * (x - x0)) / (x1 - x0);
  }
  return table[table.length - 1][1];
};

// ---------- hoogtes ----------
// Het PDOK-terrein legt de Beneden-Merwede hier op 43,67 m ellipsoïdisch; op
// het land ligt het PDOK-terrein 43,6 m boven het AHN (NAP), dus het water van
// het model (z = 0) ligt op NAP +0,07 m.
const WATER_NAP = 0.07;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder het water
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 43.67;

// Spoorstaaf en fietspad in NAP (mediaan van het AHN over het spoor en het
// fietspad per meter), lineair tussen de knikpunten.
const RAIL_NAP = [
  [-290.95, 13.07],
  [-176, 13.72],
  [-111.35, 14.07],
  [0, 14.3],
  [111.35, 14.03],
  [139, 13.78],
  [182.3, 13.58],
];
const BIKE_NAP = [
  [-290.95, 12.85],
  [-176, 14.21],
  [-111.35, 14.62],
  [-56, 14.43],
  [59, 14.41],
  [111.35, 14.26],
  [182.3, 12.87],
];
const railZ = (x) => Z(interp(RAIL_NAP, x));
const bikeZ = (x) => Z(interp(BIKE_NAP, x));

// ---------- indeling langs de brug ----------
const X_SOUTH = -290.95; // kopse kant zuidelijk landhoofd (BGT)
const X_NORTH = 182.3; // kopse kant noordelijk landhoofd (BGT)
// Vakwerkliggers: opleggingen (AHN: einden van de onderrand, schuine
// eindstijlen tot 7,9 m van de oplegging), symmetrisch om de middelste pijler.
const SPAN = 110.7;
const TRUSS_GAP = 0.65;
const TRUSS_SPANS = [
  [-TRUSS_GAP - SPAN, -TRUSS_GAP],
  [TRUSS_GAP, TRUSS_GAP + SPAN],
];
const X_TRUSS_S = TRUSS_SPANS[0][0];
const X_TRUSS_N = TRUSS_SPANS[1][1];
// Basculebrug: de klep (BGT-spoorvlak L0004.7052...) van x = -152,4 tot -119,
// draaipunt bij de stenen pijler; het vaste deel op de basculekelder van
// x = -170 tot -152,4.
const X_CELLAR = [-170.0, -151.5];
const X_LEAF = [-152.4, -119.0];
// Segmenten van het dek: x-bereik, onderkant (z), oostrand van het fietsdek.
// Aanbruggen: kokerligger met betonnen dek, 3,5 m onder de spoorstaaf
// (foto's: ongeveer anderhalf keer de installatiekast van 2,1 m op de
// noordelijke pijler), op kopblokken boven de lagere pijlers; klep en vakwerk
// met dwarsdragers 1,8 en 1,5 m onder de spoorstaaf.
const APPROACH_DEPTH = 3.5;
const SEGMENTS = [
  { label: "zuidelijke aanbrug", x0: X_SOUTH, x1: X_CELLAR[0], bottom: (x) => railZ(x) - APPROACH_DEPTH, east: -7.9, parapets: true },
  { label: "vast basculedeel", x0: X_CELLAR[0], x1: X_LEAF[0], bottom: (x) => railZ(x) - 2.0, east: -8.6, parapets: true },
  { label: "klep en draaipunt", x0: X_LEAF[0], x1: X_TRUSS_S, bottom: (x) => railZ(x) - 1.8, east: -8.6, parapets: true },
  { label: "vakwerkliggers", x0: X_TRUSS_S, x1: 113.0, bottom: (x) => railZ(x) - 1.5, east: -9.0, parapets: false },
  { label: "noordelijke aanbrug", x0: 113.0, x1: X_NORTH, bottom: (x) => railZ(x) - APPROACH_DEPTH, east: -8.3, parapets: true },
];
const segmentAt = (x) => SEGMENTS.find((s) => x >= s.x0 - 1e-9 && x <= s.x1 + 1e-9);
const deckBottom = (x) => segmentAt(x).bottom(x);

// Dwarsprofiel (BGT, AHN): spoordek van de schampkant (y = -3,0) tot de
// westrand (y = 3,8); fietsdek van y = -3,4 tot de oostrand; schampkant
// tussen spoor en fietspad (0,9 m boven het hoogste van de twee) en een
// borstwering aan de westrand (0,9 m boven de spoorstaaf), behalve tussen de
// vakwerkliggers.
const WEST = 3.8;
const TRACK_EAST = -3.8; // spoordek loopt onder de schampkant door
const BIKE_IN = -3.4; // fietsdek loopt onder de schampkant door
const KERB = { y0: -4.2, y1: -3.0, above: 0.9 };
const WEST_PARAPET = { y0: 2.9, y1: WEST, above: 0.9 };
// Fietsdek: uitkraging van 0,8 m dik aan de rand met een schuin ondervlak van
// 50 graden naar de koker of het vakwerkdek.
const BIKE_EDGE = 0.8;
const SOFFIT = Math.tan((50 * Math.PI) / 180);
// Oostelijke borstwering van het fietspad op het vaste basculedeel en de klep
// (dichte panelen op de foto's, AHN 0,9 m boven het fietspad), met een
// onderbreking voor de loopbrug naar het bedieningshuis.
const EAST_PARAPET = { x0: X_CELLAR[0], x1: X_TRUSS_S, y0: -8.6, y1: -7.7, above: 0.9 };
const GANGWAY = { x0: -156.2, x1: -155.0, y0: -11.4, y1: -8.4, depth: 0.9 };

// Stations langs X: om de 2 m plus alle knikpunten; bij een sprong in de
// onderkant of de oostrand twee stations 1 cm uit elkaar.
const STEP = 0.01;
const stationSet = new Set();
for (let x = X_SOUTH; x < X_NORTH; x += 2) stationSet.add(+x.toFixed(3));
for (const t of [RAIL_NAP, BIKE_NAP]) for (const [x] of t) stationSet.add(x);
for (const s of SEGMENTS) {
  stationSet.add(s.x0);
  stationSet.add(s.x1);
}
stationSet.add(GANGWAY.x0);
stationSet.add(GANGWAY.x1);
const jumps = SEGMENTS.slice(1).map((s) => s.x0);
for (const x of jumps) stationSet.add(+(x + STEP).toFixed(3));
const XS = [...stationSet].filter((x) => x >= X_SOUTH && x <= X_NORTH).sort((a, b) => a - b);
// Segment van een station: na een sprong hoort het tweede station bij het
// volgende segment.
const stationSegment = (x) => {
  for (const xj of jumps) if (Math.abs(x - xj) < 1e-6) return SEGMENTS.find((s) => s.x1 === xj);
  return segmentAt(x);
};

// ---------- dekken ----------
const trackDeck = loftX(
  XS.map((x) => {
    const s = stationSegment(x);
    const zb = s.bottom(Math.min(Math.max(x, s.x0), s.x1));
    const zt = railZ(x);
    return { x, section: [[TRACK_EAST, zb], [WEST, zb], [WEST, zt], [TRACK_EAST, zt]] };
  }),
);
function bikeSection(x, s) {
  const zb = s.bottom(Math.min(Math.max(x, s.x0), s.x1));
  const zt = bikeZ(x);
  const edgeLow = zt - BIKE_EDGE;
  // Schuin ondervlak vanaf de rand naar binnen tot de onderkant van het dek
  // of tot vlak voor de koker.
  let yMeet = s.east + (edgeLow - zb) / SOFFIT;
  let zMeet = zb;
  if (yMeet > BIKE_IN - 0.05) {
    yMeet = BIKE_IN - 0.05;
    zMeet = edgeLow - (yMeet - s.east) * SOFFIT;
  }
  return [[s.east, edgeLow], [yMeet, zMeet], [BIKE_IN, zMeet], [BIKE_IN, zt], [s.east, zt]];
}
const bikeDeck = loftX(XS.map((x) => ({ x, section: bikeSection(x, stationSegment(x)) })));
const kerb = loftX(
  XS.map((x) => {
    const lo = Math.min(railZ(x), bikeZ(x)) - 0.6;
    const hi = Math.max(railZ(x), bikeZ(x)) + KERB.above;
    return { x, section: [[KERB.y0, lo], [KERB.y1, lo], [KERB.y1, hi], [KERB.y0, hi]] };
  }),
);
const westParapets = SEGMENTS.filter((s) => s.parapets).map((s) =>
  loftX(
    XS.filter((x) => x >= s.x0 - 1e-9 && x <= s.x1 + 1e-9).map((x) => ({
      x,
      section: [
        [WEST_PARAPET.y0, railZ(x) - 0.6],
        [WEST_PARAPET.y1, railZ(x) - 0.6],
        [WEST_PARAPET.y1, railZ(x) + WEST_PARAPET.above],
        [WEST_PARAPET.y0, railZ(x) + WEST_PARAPET.above],
      ],
    })),
  ),
);
const eastParapetStrip = (x0, x1) =>
  loftX(
    [x0, ...XS.filter((x) => x > x0 + 1e-6 && x < x1 - 1e-6), x1].map((x) => ({
      x,
      section: [
        [EAST_PARAPET.y0, bikeZ(x) - 0.6],
        [EAST_PARAPET.y1, bikeZ(x) - 0.6],
        [EAST_PARAPET.y1, bikeZ(x) + EAST_PARAPET.above],
        [EAST_PARAPET.y0, bikeZ(x) + EAST_PARAPET.above],
      ],
    })),
  );
const eastParapets = [eastParapetStrip(EAST_PARAPET.x0, GANGWAY.x0), eastParapetStrip(GANGWAY.x1, EAST_PARAPET.x1)];
// Loopbrug van het fietspad naar de kolom van het bedieningshuis (BGT: het
// fietspadvlak steekt hier uit tot y = -10,2), bovenkant gelijk met het
// fietspad (dezelfde stations).
const gangway = loftX(
  [GANGWAY.x0, GANGWAY.x1].map((x) => ({
    x,
    section: [
      [GANGWAY.y0, bikeZ(x) - GANGWAY.depth],
      [GANGWAY.y1, bikeZ(x) - GANGWAY.depth],
      [GANGWAY.y1, bikeZ(x)],
      [GANGWAY.y0, bikeZ(x)],
    ],
  })),
);

// ---------- vakwerkliggers ----------
// Twee lijnen van 1,0 m dik (AHN: hartlijnen 2,5 m oost en 2,75 m west van de
// spooras). Elke ligger heeft 7 vakken van 15,8 m (foto's), evenwijdige
// randen met de bovenkant 10,8 m boven de spoorstaaf (AHN NAP +24,9 tot
// +25,1 m), schuine eindstijlen van de oplegging naar de eerste bovenknoop,
// diagonalen als W en stijlen bij de bovenknopen. Op 1:1000 is het vakwerk een
// dichte plaat: de vakken met de punt omhoog (door de stijl in twee
// rechthoekige driehoeken verdeeld) zijn doorgaande openingen, de driehoeken
// met een vlakke bovenkant blinde nissen van 0,35 m aan de buitenkant.
const TRUSS_LINES = [
  { y0: -3.0, y1: -2.0, niche: [-3.0 - 0.3, -3.0 + 0.35] },
  { y0: 2.25, y1: 3.25, niche: [3.25 - 0.35, 3.25 + 0.3] },
];
const PANELS = 7;
const TRUSS_HEIGHT = 10.8;
const BAR = 0.9;
const CHORD_TOP = 0.6;
const trussTop = (x) => railZ(x) + TRUSS_HEIGHT;
const openingAngles = [];
let throughOpenings = 0;
let blindNiches = 0;
const trussSolids = TRUSS_SPANS.flatMap(([x0, x1]) => {
  const p = (x1 - x0) / PANELS;
  const bottomX = Array.from({ length: PANELS + 1 }, (_, k) => x0 + k * p);
  const topX = Array.from({ length: PANELS }, (_, k) => x0 + (k + 0.5) * p);
  const zb = (x) => railZ(x) + CHORD_TOP - BAR / 2; // hartlijn onderrand
  const zt = (x) => trussTop(x) - BAR / 2; // hartlijn bovenrand
  // Buitenkant van de eindstijlen: de hartlijn van oplegging naar eerste of
  // laatste bovenknoop, een halve staafbreedte naar buiten.
  function endPost(xb, xt, side) {
    const dx = xt - xb;
    const dz = zt(xt) - zb(xb);
    const len = Math.hypot(dx, dz);
    const d = [dx / len, dz / len];
    const n = [-side * d[1] * Math.sign(dx), side * Math.abs(d[0])];
    const ox = xb + n[0] * (BAR / 2);
    const oz = zb(xb) + n[1] * (BAR / 2);
    // snijpunt met x = xb (onderhoek) en met z = bovenkant (bovenhoek)
    const sBottom = (xb - ox) / d[0];
    const sTop = (trussTop(xt) - oz) / d[1];
    return { bottom: [xb, oz + d[1] * sBottom], top: [ox + d[0] * sTop, trussTop(xt)] };
  }
  const left = endPost(x0, topX[0], 1);
  const right = endPost(x1, topX[PANELS - 1], 1);
  const bottomEdge = XS.filter((x) => x > x0 + 1e-6 && x < x1 - 1e-6).map((x) => [x, deckBottom(x) + 0.05]);
  const outline = [
    [x0, deckBottom(x0) + 0.05],
    ...bottomEdge,
    [x1, deckBottom(x1) + 0.05],
    right.bottom,
    right.top,
    left.top,
    left.bottom,
  ];
  const holes = [];
  const niches = [];
  const addHole = (tri) => {
    const hole = insetTriangle(tri, BAR / 2);
    if (!hole) return;
    holes.push(hole);
    // Helling van het plafond van de opening (moet minstens 50 graden zijn):
    // de zijden naar het hoogste punt.
    const apex = hole.reduce((a, q) => (q[1] > a[1] ? q : a));
    for (const q of hole) {
      if (q === apex) continue;
      const run = Math.abs(apex[0] - q[0]);
      if (run < 1e-6) continue; // de verticale zijde langs de stijl
      openingAngles.push((Math.atan2(apex[1] - q[1], run) * 180) / Math.PI);
    }
  };
  for (let k = 0; k < PANELS; k++) {
    const xt = topX[k];
    addHole([[bottomX[k], zb(bottomX[k])], [xt, zb(xt)], [xt, zt(xt)]]);
    addHole([[xt, zb(xt)], [bottomX[k + 1], zb(bottomX[k + 1])], [xt, zt(xt)]]);
    if (k > 0) {
      const niche = insetTriangle(
        [[topX[k - 1], zt(topX[k - 1])], [bottomX[k], zb(bottomX[k])], [xt, zt(xt)]],
        BAR / 2,
      );
      if (niche) niches.push(niche);
    }
  }
  throughOpenings += holes.length;
  blindNiches += niches.length;
  return TRUSS_LINES.map(({ y0, y1, niche }) => {
    const plate = profileY(outline, y0, y1);
    const cut = [
      ...holes.map((h) => profileY(h, y0 - 0.3, y1 + 0.3)),
      ...niches.map((h) => profileY(h, niche[0], niche[1])),
    ];
    return plate.subtract(union(cut));
  });
});

// ---------- vaste basculedeel en klep ----------
// Op het vaste deel staan twee plaatliggers van 1,0 m breed langs de
// vakwerklijnen, 2,0 m boven de spoorstaaf (AHN NAP +15,9 m) van x = -166 tot
// -157, daarna aflopend naar 0,9 m boven de spoorstaaf; zo lopen ze als lage
// hoofdliggers over de klep door tot het draaipunt.
const BASCULE_GIRDER = { x0: -166.0, xHigh: -157.0, xLow: -151.0, x1: -119.5, high: 2.0, low: 0.9 };
const basculeGirders = [
  [-3.3, -2.3],
  [2.3, 3.3],
].map(([y0, y1]) => {
  const g = BASCULE_GIRDER;
  const bottom = XS.filter((x) => x > g.x0 && x < g.x1).map((x) => [x, railZ(x) - 0.6]);
  return profileY(
    [
      [g.x0, railZ(g.x0) - 0.6],
      ...bottom,
      [g.x1, railZ(g.x1) - 0.6],
      [g.x1, railZ(g.x1) + g.low],
      [g.xLow, railZ(g.xLow) + g.low],
      [g.xHigh, railZ(g.xHigh) + g.high],
      [g.x0, railZ(g.x0) + g.high],
    ],
    y0,
    y1,
  );
});
// Basculekelder onder het vaste deel (beton, foto's en luchtfoto), aan de
// westkant als machinehuis met het dak op NAP +13,55 m (AHN).
const CELLAR = { x0: X_CELLAR[0], x1: X_CELLAR[1], y0: -8.6, y1: 12.5, topNap: 13.55 };
const cellar = box(CELLAR.x0, CELLAR.x1, CELLAR.y0, CELLAR.y1, BASE, Z(CELLAR.topNap));

// Bedieningshuis (BAG-pand 0505100000001555) op een ronde kolom in het water
// ten oosten van het vaste deel: huis van 5,8 × 5,0 m met het dak op NAP
// +22,4 m (AHN), schuin naar buiten lopende ramen, een kraag van 50 graden of
// steiler naar de kolom van 2,6 m en de loopbrug op fietspadhoogte.
const CABIN = { x0: -157.4, x1: -151.6, y0: -13.9, y1: -8.9, floorNap: 18.9, eavesNap: 21.8, roofNap: 22.4, flare: 0.4 };
const STALK = { x: (CABIN.x0 + CABIN.x1) / 2, y: (CABIN.y0 + CABIN.y1) / 2, r: 1.3, collarNap: 15.9 };
const thinRect = (inset, z) => box(CABIN.x0 + inset, CABIN.x1 - inset, CABIN.y0 + inset, CABIN.y1 - inset, z, z + 0.01);
const stalk = Manifold.cylinder(Z(STALK.collarNap) - BASE + 0.01, STALK.r, STALK.r, 32, false).translate([STALK.x, STALK.y, BASE]);
const cabin = union([
  stalk,
  Manifold.hull([
    Manifold.cylinder(0.01, STALK.r, STALK.r, 32, false).translate([STALK.x, STALK.y, Z(STALK.collarNap)]),
    thinRect(CABIN.flare, Z(CABIN.floorNap)),
  ]),
  Manifold.hull([thinRect(CABIN.flare, Z(CABIN.floorNap)), thinRect(0, Z(CABIN.eavesNap) - 0.01)]),
  box(CABIN.x0, CABIN.x1, CABIN.y0, CABIN.y1, Z(CABIN.eavesNap) - 0.01, Z(CABIN.roofNap)),
]);

// Dukdalven van het remmingwerk langs de doorvaart (luchtfoto, AHN NAP
// +4,8 m), Ø 1,6 m.
const DOLPHIN = { r: 0.8, topNap: 4.8 };
const DOLPHINS = [
  [-119.2, 21.3],
  [-120.9, 17.5],
  [-118.9, -13.5],
  [-120.3, -20.1],
  [-150.2, 28.5],
  [-151.3, 19.9],
  [-150.6, 16.0],
  [-151.0, -16.7],
  [-150.0, -21.9],
];
const dolphins = DOLPHINS.map(([x, y]) =>
  Manifold.cylinder(Z(DOLPHIN.topNap) - BASE, DOLPHIN.r, DOLPHIN.r, 24, false).translate([x, y, BASE]),
);

// ---------- pijlers en landhoofden (BGT, lokale coördinaten) ----------
const PIER_SOUTH_STONE = [
  [-120.53, -7.19], [-113.58, -7.44], [-112.76, -8.22], [-111.34, -8.45], [-109.77, -8.35], [-108.76, -7.91],
  [-108.13, -7.1], [-108.0, 14.12], [-108.49, 15.26], [-109.02, 15.72], [-109.75, 16.06], [-110.46, 16.12],
  [-111.27, 16.07], [-112.05, 15.79], [-112.76, 15.13], [-113.27, 14.25], [-120.06, 14.4],
];
const PIER_MIDDLE = [
  [-3.42, 3.7], [-3.64, -3.76], [-3.55, -5.95], [-3.26, -6.62], [-2.64, -7.48], [-1.62, -8.41], [-0.59, -8.75],
  [1.31, -8.54], [1.81, -8.3], [2.35, -7.7], [2.87, -7.0], [3.14, -6.23], [3.27, -5.04], [3.68, 3.7], [3.66, 12.38],
  [3.6, 12.93], [3.25, 13.98], [2.59, 14.86], [2.17, 15.22], [1.18, 15.71], [0.09, 15.88], [-1.0, 15.7],
  [-1.98, 15.2], [-2.76, 14.43], [-3.27, 13.45], [-3.45, 12.36],
];
const PIER_NORTH_STONE = [
  [112.99, 13.69], [112.8, 14.44], [112.62, 14.78], [112.11, 15.37], [111.79, 15.59], [111.07, 15.88], [110.3, 15.93],
  [109.55, 15.74], [108.89, 15.33], [108.4, 14.73], [108.11, 14.01], [108.05, 13.63], [108.28, -6.9], [108.6, -7.55],
  [108.97, -7.99], [109.39, -8.33], [109.88, -8.43], [110.52, -8.52], [111.49, -8.23], [112.04, -7.85], [112.62, -7.33],
  [112.99, -6.58], [113.09, -6.13], [113.53, -6.08], [114.52, -5.55], [114.95, -5.06], [115.3, -4.44], [115.52, -3.7],
  [115.54, 3.19], [115.42, 11.17], [115.16, 11.95], [114.43, 12.93], [113.76, 13.4],
];
// Aanbrugpijlers en het zuidelijke landhoofd (ronde koppen) met de bovenkant
// naast het dek volgens het AHN (landhoofd NAP +6,85 m, pijlers +7,2 en
// +7,5 m); de gemetselde pijler van de noordelijke aanbrug ligt helemaal onder
// het dek en loopt door tot de koker. Onder de koker staat op elke lagere
// pijler een kopblok tot de onderkant van het dek.
const APPROACH_PIER_TOPS = [6.85, 6.85, 6.85, 7.2, 7.5, null];
const APPROACH_PIERS = [
  // zuidelijk landhoofd (drie BGT-vlakken)
  [[-288.41, 1.25], [-288.41, 1.97], [-290.96, 2.05], [-290.95, 1.26]],
  [[-288.41, 1.97], [-288.39, 11.21], [-288.86, 11.83], [-289.41, 12.33], [-290.28, 12.74], [-290.94, 12.98], [-290.96, 2.05]],
  [[-288.42, -3.85], [-288.41, 1.25], [-290.95, 1.26], [-290.95, -1.87], [-290.94, -5.5], [-290.28, -5.38], [-289.66, -5.05], [-289.1, -4.61]],
  // pijlers van de zuidelijke aanbrug
  [[-234.02, 2.41], [-234.13, -3.8], [-233.8, -4.9], [-233.38, -5.37], [-232.92, -5.69], [-232.22, -5.98], [-231.24, -5.95],
    [-230.4, -5.5], [-229.92, -4.99], [-229.61, -4.42], [-229.4, 11.15], [-229.55, 11.93], [-229.86, 12.23], [-230.44, 12.47],
    [-232.12, 12.81], [-233.09, 12.62], [-233.55, 12.0], [-233.87, 10.74]],
  [[-170.77, 12.65], [-172.39, 13.19], [-173.77, 12.61], [-174.69, 11.18], [-174.84, 0.77], [-174.81, -4.01], [-174.06, -4.93],
    [-172.99, -5.44], [-172.4, -5.5], [-171.8, -5.43], [-170.73, -4.92], [-169.99, -3.99], [-169.92, 10.9]],
  // gemetselde pijler van de noordelijke aanbrug (twee BGT-vlakken samen)
  [[145.35, 5.82], [138.07, 5.9], [137.71, 5.49], [137.68, -2.3], [137.85, -5.36], [139.93, -7.88], [140.41, -8.07],
    [140.76, -9.16], [143.92, -9.19], [143.83, 3.76]],
];
// Stenen rivierpijlers: voet tot NAP +2,5 m op de BGT-omtrek, daarboven 0,3 m
// teruggezet, kraag van 0,3 m (schuin onder 53 graden) en bovenkant op NAP
// +12,3 m (AHN, foto's). De zuidelijke heeft aan de zuidkant de betonnen kop
// van de klepkelder tot NAP +10,45 m, de noordelijke aan de noordkant een
// lagere aanbouw tot NAP +7,8 m onder de aanbrug.
const STONE_TOP_NAP = 12.3;
const PLINTH_NAP = 2.5;
const SETBACK = 0.3;
const CAP = { height: 0.8, chamfer: 0.4 };
const SOUTH_KNEE_X = -113.3;
const NORTH_KNEE_X = 113.0;
function stonePier(outline) {
  // Convexe omhullende van de BGT-omtrek (wijkt enkele centimeters af), zodat
  // de schuine kraag (hull) nergens over een inham hangt.
  const poly = new CrossSection([ccw(outline)]).hull().toPolygons()[0].map(([x, y]) => [x, y]);
  const top = Z(STONE_TOP_NAP);
  const inner = offsetPoly(poly, -SETBACK);
  const zPlinth = Z(PLINTH_NAP);
  const zCap = top - CAP.height;
  const zChamfer = zCap - CAP.chamfer;
  const body = Manifold.extrude(inner, zChamfer - zPlinth + 0.01).translate([0, 0, zPlinth - 0.005]);
  const chamfer = Manifold.hull([
    Manifold.extrude(inner, 0.01).translate([0, 0, zChamfer]),
    prism(poly, zCap - 0.01, zCap),
  ]);
  return union([prism(poly, BASE, zPlinth), body, chamfer, prism(poly, zCap - 0.01, top)]);
}
const stoneSouth = clipPoly(PIER_SOUTH_STONE, SOUTH_KNEE_X, -100);
const stoneNorth = clipPoly(PIER_NORTH_STONE, 100, NORTH_KNEE_X);
const southAnnex = clipPoly(PIER_SOUTH_STONE, -130, SOUTH_KNEE_X);
const northAnnex = clipPoly(PIER_NORTH_STONE, NORTH_KNEE_X, 130);
const SOUTH_ANNEX_NAP = 10.45;
const NORTH_ANNEX_NAP = 7.8;
const NORTH_ABUTMENT_NAP = 7.45;
// Kopblok onder de koker van een aanbrug, tot het dek (vanaf de onderkant,
// zodat het nergens buiten de pijlerkop zweeft; zTop documenteert de kop).
const pierHead = (x0, x1, y0, zTop) => box(x0, x1, y0, WEST, Math.min(BASE, zTop), deckBottom((x0 + x1) / 2) + 0.05);
const centre = (poly) => poly.reduce((s, [x]) => s + x, 0) / poly.length;
const piers = [
  stonePier(stoneSouth),
  stonePier(PIER_MIDDLE),
  stonePier(stoneNorth),
  // kop van de klepkelder, onder het dek tot de onderkant van de klep
  prism(southAnnex, BASE, Z(SOUTH_ANNEX_NAP)),
  box(-120.5, SOUTH_KNEE_X + 0.2, -7.2, WEST, BASE, deckBottom(-116) + 0.05),
  prism(northAnnex, BASE, Z(NORTH_ANNEX_NAP)),
  pierHead(NORTH_KNEE_X, 115.3, -5.0, Z(NORTH_ANNEX_NAP)),
  ...APPROACH_PIERS.map((poly, i) =>
    APPROACH_PIER_TOPS[i] === null ? prism(poly, BASE, deckBottom(centre(poly)) + 0.1) : prism(poly, BASE, Z(APPROACH_PIER_TOPS[i])),
  ),
  // kopblokken: zuidelijk landhoofd over de hele dekbreedte, de pijlers onder
  // de koker
  pierHead(X_SOUTH, -288.4, -7.9, Z(6.85)),
  pierHead(-233.7, -229.8, -5.0, Z(7.2)),
  pierHead(-174.5, -170.2, -5.0, Z(7.5)),
  // noordelijk landhoofd (AHN: bovenkant NAP +7,4 m naast het dek) met een
  // kopblok over de hele dekbreedte
  box(179.8, X_NORTH, -8.3, 12.5, BASE, Z(NORTH_ABUTMENT_NAP)),
  pierHead(179.8, X_NORTH, -8.3, Z(NORTH_ABUTMENT_NAP)),
];
// Opleggingen van de vakwerkliggers op de stenen pijlers: blokken van
// 1,6 × 1,6 m onder elke vakwerklijn van de kraag tot het dek.
const BEARINGS = [
  [X_TRUSS_S, X_TRUSS_S + 1.6],
  [-1.6, 1.6],
  [X_TRUSS_N - 1.6, X_TRUSS_N],
];
const bearings = BEARINGS.flatMap(([x0, x1]) =>
  TRUSS_LINES.map(({ y0, y1 }) => box(x0, x1, y0 - 0.3, y1 + 0.3, Z(STONE_TOP_NAP) - 0.05, deckBottom((x0 + x1) / 2) + 0.05)),
);
// Installatiekast (witte cilinder, foto's) naast het noordelijke einde van het
// vakwerk op de pijlerkop, tot NAP +14,4 m (AHN).
const cabinet = Manifold.cylinder(Z(14.4) - Z(STONE_TOP_NAP) + 0.05, 1.2, 1.2, 32, false).translate([110.3, 6.4, Z(STONE_TOP_NAP) - 0.05]);

const bridge = union([
  trackDeck,
  bikeDeck,
  kerb,
  ...westParapets,
  ...eastParapets,
  gangway,
  ...trussSolids,
  ...basculeGirders,
  cellar,
  cabin,
  ...dolphins,
  ...piers,
  ...bearings,
  cabinet,
]);

// ---------- printvoet (alleen in de STL) ----------
// Onder de vrij hangende dekken een wig van 50 graden die uitloopt in een
// scherm van 0,9 m tot de onderplaat, zoals de overhangopvulling van de export.
const KNEE = (50 * Math.PI) / 180;
const SCREEN = 0.45;
const FOOT_X = [-288.4, 179.8];
const footStations = XS.filter((x) => x > FOOT_X[0] && x < FOOT_X[1]);
const printFoot = loftX(
  [FOOT_X[0], ...footStations, FOOT_X[1]].map((x) => {
    const s = stationSegment(x);
    const zb = s.bottom(Math.min(Math.max(x, s.x0), s.x1)) + 0.02;
    const yc = (s.east + WEST) / 2;
    const w = (WEST - s.east) / 2 + 0.02;
    const zs = zb - Math.tan(KNEE) * (w - SCREEN);
    const section =
      zs > BASE + 0.05
        ? [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]]
        : (() => {
            const a = Math.max(SCREEN, w - (zb - BASE) / Math.tan(KNEE));
            return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
          })();
    return { x, section: section.map(([y, z]) => [y + yc, z]) };
  }),
);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: de
// onderkant van de dekken (en van de uitkraging van het fietsdek), de
// plafonds van de blinde nissen, de onderkant van de loopbrug en van het dak
// van het bedieningshuis (alleen randen); verder niets.
const inNiche = (y) => TRUSS_LINES.some(({ niche }) => y > niche[0] - 1e-3 && y < niche[1] + 1e-3);
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const area = { deck: 0, niche: 0, gangway: 0, other: 0 };
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const [xm, ym, zm] = [0, 1, 2].map((a) => (p[0][a] + p[1][a] + p[2][a]) / 3);
    const a2 = len / 2;
    const inDeck = xm > X_SOUTH - 0.01 && xm < X_NORTH + 0.01 && ym > -9.01 && ym < WEST + 0.01;
    if (inDeck && zm < railZ(xm) + 0.5 && zm > deckBottom(xm) - 0.2) area.deck += a2;
    else if (inNiche(ym) && zm > railZ(xm) + CHORD_TOP) area.niche += a2;
    else if (xm > GANGWAY.x0 - 0.01 && xm < GANGWAY.x1 + 0.01 && ym < -8.3) area.gangway += a2;
    else {
      area.other += a2;
      if (a2 > 0.01) console.log("overhang op", [xm, ym, zm].map((c) => +c.toFixed(2)), +a2.toFixed(3));
    }
  }
  return area;
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
const minFlank = openingAngles.reduce((m, a) => Math.min(m, a), Infinity);
{
  const model = overhangs(bridge);
  console.log("vrij hangend (m2):", Object.fromEntries(Object.entries(model).map(([k, a]) => [k, +a.toFixed(2)])));
  if (model.other > 0.5) throw new Error("overhang buiten dekken, nissen en loopbrug");
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", Object.fromEntries(Object.entries(print).map(([k, a]) => [k, +a.toFixed(2)])));
  console.log("doorgaande openingen", throughOpenings, "blinde nissen", blindNiches, "vlakste plafond (graden)", +minFlank.toFixed(1));
  if (minFlank < 50) throw new Error("opening met een te vlak plafond");
}

// ---------- spoor en fietspad als eigen onderdelen ----------
// De bovenste 0,5 m van het dek binnen de actuele BGT-wegdelen op de brug
// (relatieve hoogteligging 1) is per functie een eigen node met de
// attributen van dat wegdeel (glTF `extras.attributes`), zodat de kleurregels
// van een thema (spoor zwart, fietspad rood) op de brug werken zoals op de
// PDOK-wegdelen ernaast. Wordt pas hier gebouwd, nadat het printmodel is
// doorgerekend, zodat de STL gelijk blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
// BGT-wegdelen spoorbaan (gesloten verharding, geen plus-fysiek voorkomen),
// lokale coördinaten, vereenvoudigd tot 5 cm.
const RAIL_PATHS = [
  // L0004.c31ed14f...: zuidelijke aanbrug en vast basculedeel
  [[-290.95, -1.87], [-182.28, -1.89], [-173.63, -1.07], [-173.62, -0.97], [-172.63, -0.99], [-172.54, -1.06], [-152.4, -1.01],
    [-152.41, 0.99], [-153.99, 0.99], [-173.57, 0.95], [-173.57, 1.01], [-182.31, 1.82], [-259.13, 1.76], [-290.96, 1.84]],
  // L0004.705289e5...: de klep
  [[-119.02, 1.06], [-152.41, 0.99], [-152.4, -1.01], [-119.01, -0.94]],
  // L0004.fa0975d2...: vakwerk en noordelijke aanbrug
  [[-119.02, 0.96], [-119.01, -0.94], [-79.48, -1.02], [112.05, -0.97], [112.04, -2.03], [152.69, -1.97], [182.24, -2.09],
    [182.19, 2.07], [112.07, 1.92], [112.07, 0.92]],
];
// BGT-wegdeel fietspad G0505.98caa471... (gesloten verharding, asfalt), met
// de uitstulping naar het bedieningshuis.
const BIKE_PATH = [
  [182.3, -8.26], [182.3, -4.26], [111.08, -4.19], [111.02, -4.25], [0.15, -4.28], [-106.74, -4.58], [-115.07, -4.52],
  [-115.03, -4.99], [-166.36, -5.0], [-170.51, -5.0], [-170.51, -6.02], [-174.65, -5.97], [-176.21, -5.11], [-190.67, -3.85],
  [-291.37, -3.87], [-291.36, -7.86], [-164.9, -7.89], [-156.82, -8.67], [-156.11, -10.21], [-155.14, -10.11],
  [-155.13, -7.85], [-120.45, -7.76], [-119.88, -7.63], [-111.48, -8.21], [-94.93, -8.29],
];
// Stroken over dezelfde stations als de dekken, van 0,5 m onder tot 1 m
// boven het wegdek en 0,5 m voorbij de uiteinden.
const stripXs = [X_SOUTH - 0.5, ...XS, X_NORTH + 0.5];
const strip = (y0, y1, top) =>
  loftX(stripXs.map((x) => ({ x, section: [[y0, top(x) - LAYER], [y1, top(x) - LAYER], [y1, top(x) + ABOVE], [y0, top(x) + ABOVE]] })));
const tall = (poly) => prism(poly, BASE - 1, 40);
// Wat boven het dek uitsteekt en constructie blijft, 2 cm groter.
const grownBox = (x0, x1, y0, y1) => box(x0 - GUARD, x1 + GUARD, y0 - GUARD, y1 + GUARD, BASE - 1, 40);
const guards = union([
  grownBox(X_SOUTH - 1, X_NORTH + 1, KERB.y0, KERB.y1),
  grownBox(X_SOUTH - 1, X_NORTH + 1, WEST_PARAPET.y0, WEST_PARAPET.y1),
  grownBox(EAST_PARAPET.x0, GANGWAY.x0, EAST_PARAPET.y0, EAST_PARAPET.y1),
  grownBox(GANGWAY.x1, EAST_PARAPET.x1, EAST_PARAPET.y0, EAST_PARAPET.y1),
  ...TRUSS_LINES.map(({ y0, y1 }) => grownBox(X_TRUSS_S, X_TRUSS_N, y0, y1)),
  ...[[-3.3, -2.3], [2.3, 3.3]].map(([y0, y1]) => grownBox(BASCULE_GIRDER.x0, BASCULE_GIRDER.x1, y0, y1)),
  Manifold.cylinder(42, STALK.r + GUARD, STALK.r + GUARD, 32, false).translate([STALK.x, STALK.y, BASE - 1]),
]);
const spoorStrip = strip(-2.9, 2.8, railZ).intersect(union(RAIL_PATHS.map(tall))).subtract(guards);
const bikeStrip = strip(-11.5, BIKE_IN, bikeZ).intersect(tall(BIKE_PATH)).subtract(guards);
const spoor = spoorStrip.intersect(bridge);
const bikeway = bikeStrip.intersect(bridge);
const structure = bridge.subtract(spoorStrip).subtract(bikeStrip);
const parts = [
  ["building:baanhoekbrug", structure],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
  ["road:spoor", spoor, SPOOR_ATTRIBUTES],
];
{
  const whole = bridge.volume();
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  console.log(
    "volumes (m3): brug",
    +whole.toFixed(2),
    ...parts.flatMap(([name, solid]) => [name, +solid.volume().toFixed(2)]),
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
    // Vertexnormalen met scherpe randen boven 40 graden.
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
    meshes.push({ name, primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }] });
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
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
  spansM: TRUSS_SPANS.map(([a, b]) => +(b - a).toFixed(2)),
  panels: PANELS,
  panelM: +(SPAN / PANELS).toFixed(2),
  throughOpenings,
  blindNiches,
  minFlankDeg: +minFlank.toFixed(1),
  topNap: [X_TRUSS_S + SPAN / 2, X_TRUSS_N - SPAN / 2].map((x) => +(trussTop(x) + WATER_NAP).toFixed(2)),
};
const glbFile = path.join(outDir, "baanhoekbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-baanhoekbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `baanhoekbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Baanhoekbrug 1:${scale} mm Z-up`);
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
const samplePoints = [-60, 0, 60].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "baanhoekbrug.json"),
  JSON.stringify(
    {
      name: "Baanhoekbrug",
      file: "baanhoekbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [110500.73, 426163.54],
      xAxis: [-0.02644, 0.99965],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      // Op het water van de Beneden-Merwede naast de vakwerkliggers, aan beide zijden.
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0505100000001555"],
      replacesTerrain: [
        "G0505.95be55cfafc041ea9fc4742e1d47d6db",
        "L0004.6ec2d23265e9468e8e7eb712c27a07c8",
        "L0004.74cdd74dd01240a4a5f35dede8146a4e",
        "L0004.f6810264513d4a39b6e8867ca566f71a",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de spooras in het hart van de middelste stenen pijler op het water van de Beneden-Merwede (z = 0, NAP +0,07 m) in de oorsprong, +X langs de brug naar het noorden (Sliedrecht, RD-richting 91,52 graden vanaf het oosten) en +Y naar het westen; het fietspad ligt aan de oostkant (y < 0). Drie nodes: road:spoor en road:fietspad, de bovenste 0,5 m van het dek binnen de actuele BGT-wegdelen op de brug met hun attributen in extras.attributes (spoorbaan, gesloten verharding; fietspad, gesloten verharding, asfalt), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk van het zuidelijke landhoofd (x = -290,95) tot het noordelijke (x = 182,3), 473 m. Twee gelijke vakwerkliggers van 110,7 m over de rivier (7 vakken, evenwijdige randen 10,8 m boven de spoorstaaf tot NAP +25,0 m, schuine eindstijlen, stijlen bij de bovenknopen) als dichte platen van 1,0 m met doorgaande driehoekige openingen en blinde nissen; drie stenen pijlers met voet en kraag tot NAP +12,3 m met lagere aanbouwen; de basculebrug met de klep (x = -152,4 tot -119), het vaste deel met plaatliggers op de basculekelder en het machinehuis, het bedieningshuis (BAG-pand) op een kolom met loopbrug en negen dukdalven; de aanbruggen als kokerligger met uitkragend fietsdek op pijlers met ronde koppen; schampkant tussen spoor en fietspad en borstweringen. Spoorstaaf NAP +13,07 m (zuid) tot +14,3 m (middelste pijler) en +13,58 m (noord). Windverbanden, portalen, bovenleiding, leuningen en de open stand van de klep zijn weggelaten; de export vult onder de dekken een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de vakwerkliggers bemonsterd; groundHeight is de laagste PDOK-hoogte daar (ellipsoïdisch). Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(X_NORTH - X_SOUTH).toFixed(2),
        trussSpansM: TRUSS_SPANS.map(([a, b]) => +(b - a).toFixed(2)),
        trussPanels: PANELS,
        trussHeightAboveRailM: TRUSS_HEIGHT,
        trussLinesFromAxisM: TRUSS_LINES.map(({ y0, y1 }) => +((y0 + y1) / 2).toFixed(2)),
        leafM: +(X_LEAF[1] - X_LEAF[0]).toFixed(1),
        railNapM: { south: RAIL_NAP[0][1], middlePier: 14.3, north: RAIL_NAP[RAIL_NAP.length - 1][1] },
        stonePierTopNapM: STONE_TOP_NAP,
        cabinRoofNapM: CABIN.roofNap,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Baanhoekbrug",
        "PDOK BGT overbruggingsdeel, wegdeel en spoor (dekken, pijlers, landhoofd, spoorbaan en fietspad), EPSG:28992",
        "PDOK AHN DSM en DTM 0,5 m via WCS voor spoorstaaf, fietspad, vakwerk, pijlerkoppen, kelder, bedieningshuis en dukdalven",
        "PDOK BAG pand 0505100000001555 (bedieningshuis)",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: Sliedrecht Baanhoekbrug 002.jpg tot 006.jpg, Open baanhoekbrug (01).JPG en (02).JPG, Spoorbrug Sliedrecht - panoramio.jpg, Trein over de Baanhoekbrug in 2020.jpg, Spoorbrug bij Biesbosch.jpg, Beneden-Merwede Sliedrecht 004.jpg, ENI 02320501 STOLT MOSEL (02).JPG",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

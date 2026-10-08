// Genereert een vereenvoudigd, gesloten 3D-model van de Brug Hollandsch Diep
// bij Moerdijk: de spoorbrug van de HSL-Zuid (Benthem Crouwel, 2000-2004,
// geopend in 2005) over het Hollandsch Diep, enkele tientallen meters ten
// westen van de oude Moerdijkspoorbrug. Het model bevat het hele kunstwerk van
// landhoofd tot landhoofd: de stalen kokerligger van het rivierdeel op elf
// Y-pijlers (tien velden van 105 m en twee eindvelden van 79 m) en de twee
// betonnen aanlandingsviaducten tot waar het spoor op de dijk bij Moerdijk
// (zuid) en op de dam bij Willemsdorp (noord) op een talud komt. De oude
// Moerdijkspoorbrug en de A16-brug ernaast zijn eigen kunstwerken en zitten er
// niet in. Alle maten in het script zijn meters op ware grootte. Uitvoer: een
// GLB in meters (Y omhoog, twee nodes met de materiaalklasse in de nodenaam:
// de constructie en het spoor met de BGT-attributen) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal> met
// een printvoet onder het dek (de brug als geheel).
//
//   node scripts/generate-brug-hollandsch-diep.mjs              # STL op 1:5000 (standaard, 382 mm)
//   node scripts/generate-brug-hollandsch-diep.mjs --scale 2500
//
// Assenstelsel: oorsprong op de as van de brug in het hart van de middelste
// (zesde) rivierpijler (RD 103640,90, 414712,68), op de waterspiegel van het
// Hollandsch Diep (NAP +0,2 m), Z omhoog. +X loopt langs de brug naar het
// noordnoordwesten (Willemsdorp, Dordrecht; RD-richting 111,67 graden vanaf het
// oosten), +Y stroomafwaarts naar het westzuidwesten. Het zuidelijke landhoofd
// (Moerdijk) ligt op x = -946, het noordelijke (Willemsdorp) op x = 954,4; de
// overgangspijlers tussen rivierdeel en aanlandingsviaducten op x = -603,1 en
// 604,1.
//
// Bronnen: BGT overbruggingsdeel (dek 14,7 tot 15 m breed van x = -946 tot
// 954,4, de elf rivierpijlers van 6,0 × 4,7 m op 105 m hart op hart met een
// eerste veld van 104,1 m, de overgangspijlers van 5 × 21 m, de lichte bocht
// van het noordelijke viaduct); AHN DSM 0,5 m (PDOK WCS) voor het lengteprofiel
// van het spoor (NAP +9,0 m bij Moerdijk, +23,4 m in het midden, +5,9 m bij
// Willemsdorp) en het dwarsprofiel van het dek; PDOK-terrein voor de
// waterspiegel (NAP +0,2 m); J.H. Reusink, "Spoorbrug over het Hollandsch
// Diep", Bruggen 10 (2002) nr. 3 voor de opbouw (doorgaande staal-betonligger,
// 10 velden van ca. 105 m en twee eindvelden, veldsecties van 59 m en
// hamerstukken van 46 m, lijven onder 1:10 die bovenaan 6 m uit elkaar staan,
// staalhoogte 4,5 m in het veld en ca. 2,5 m boven de schoorpoten,
// schoorpoten met een verlopende doorsnede, pijlerkoppen die het alignement
// volgen); Wikipedia (lengte, breedte 14,2 m, elf pijlers); Wikimedia
// Commons-foto's en foto's van Benthem Crouwel voor de hoogte van de
// pijlerschachten, de vorm van de Y, de opening tussen de schoorpoten en de
// doorsnede van de aanlandingsviaducten. Geschat: de pijlerschacht (11,7 m
// onder het spoor), de punt van de Y-opening (9,3 m onder het spoor), de
// onderkant van de hamer (3,6 m) en van de veldligger (5,5 m onder het spoor),
// de breedte van de Y-opening (26 m), de doorsnede en de kolomafstand (12
// velden per viaduct) van de aanlandingsviaducten en de hoogte van de
// overgangspijlers.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "5000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "brug-hollandsch-diep");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;
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
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
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
// Stations van x0 tot x1 om de `step` meter plus extra knikpunten.
function stationsBetween(x0, x1, step, extra = []) {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return [...Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n), ...extra]
    .filter((x) => x >= x0 - 1e-9 && x <= x1 + 1e-9)
    .sort((a, b) => a - b)
    .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-3);
}

// ---------- hoofdmaten (boven de waterspiegel, NAP +0,2 m) ----------
const WATER_NAP = 0.2;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt het Hollandsch Diep op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten op het water:
// terugval voor een uitsnede die alleen een uiteinde van de brug raakt.
const GROUND_HEIGHT = 43.95;

// Landhoofden (BGT, einde van het dek) en overgangspijlers tussen rivierdeel
// en aanlandingsviaducten (BGT, 5 × 21 m).
const X_SOUTH = -946.0;
const X_NORTH = 954.4;
const TRANSITIONS = [-603.1, 604.1];
const TRANSITION_PIER = { half: 2.5, halfY: 10.6 };

// Spoorniveau (bovenkant dek) in NAP-meters om de 10 m vanaf x = -946:
// mediaan van het AHN-DSM over 7 m rond de as en 10 m langs de as, licht
// gladgestreken. Top NAP +23,4 m boven de middelste pijler.
const DECK_NAP = [
  9.02, 9.13, 9.25, 9.37, 9.49, 9.62, 9.75, 9.89, 10.03, 10.17, 10.32, 10.46, 10.61, 10.76,
  10.92, 11.08, 11.24, 11.41, 11.58, 11.75, 11.93, 12.10, 12.29, 12.47, 12.65, 12.84, 13.03, 13.23,
  13.42, 13.63, 13.84, 14.05, 14.26, 14.49, 14.72, 14.95, 15.16, 15.38, 15.61, 15.85, 16.08, 16.31,
  16.54, 16.77, 17.00, 17.24, 17.47, 17.71, 17.95, 18.18, 18.41, 18.63, 18.84, 19.05, 19.25, 19.45,
  19.64, 19.83, 20.01, 20.19, 20.37, 20.54, 20.70, 20.86, 21.02, 21.17, 21.32, 21.45, 21.59, 21.72,
  21.85, 21.96, 22.08, 22.20, 22.31, 22.41, 22.50, 22.60, 22.68, 22.76, 22.84, 22.91, 22.98, 23.04,
  23.09, 23.15, 23.20, 23.23, 23.27, 23.30, 23.34, 23.36, 23.38, 23.39, 23.39, 23.40, 23.40, 23.39,
  23.37, 23.35, 23.32, 23.29, 23.26, 23.23, 23.18, 23.13, 23.08, 23.02, 22.95, 22.88, 22.81, 22.73,
  22.65, 22.56, 22.47, 22.37, 22.27, 22.16, 22.04, 21.92, 21.79, 21.66, 21.53, 21.39, 21.25, 21.10,
  20.94, 20.78, 20.62, 20.45, 20.28, 20.10, 19.92, 19.74, 19.55, 19.35, 19.15, 18.94, 18.73, 18.51,
  18.28, 18.06, 17.83, 17.60, 17.36, 17.11, 16.87, 16.63, 16.37, 16.12, 15.86, 15.61, 15.37, 15.10,
  14.86, 14.62, 14.36, 14.10, 13.84, 13.59, 13.34, 13.09, 12.84, 12.59, 12.34, 12.09, 11.84, 11.58,
  11.33, 11.08, 10.83, 10.59, 10.34, 10.10, 9.85, 9.60, 9.34, 9.09, 8.84, 8.59, 8.33, 8.07,
  7.82, 7.57, 7.31, 7.05, 6.79, 6.51, 6.23, 6.00, 5.91,
];
function deckZ(x) {
  const f = Math.min(Math.max((x - X_SOUTH) / 10, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return Z(DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t);
}
// Het noordelijke viaduct buigt in de laatste 214 m licht af naar het westen
// (+Y), 1,78 m op het landhoofd (BGT).
const curveY = (x) => (x > 740 ? 1.78 * ((x - 740) / 214) ** 2 : 0);

// Dek (BGT 14,7 tot 15 m; Wikipedia 14,2 m): betonplaat met een randbalk van
// 0,8 m aan de buitenkant, onder de plaat de stalen koker. Op 4,4 tot 5,6 m
// uit de as liggen kabelgoten met looppaden 0,45 m boven het spoor (AHN).
const DECK = { half: 7.45, edgeDrop: 0.8, webDrop: 1.1 };
const RIDGE = { y0: 4.4, y1: 5.6, height: 0.45 };
// Stalen koker (Reusink): lijven onder 1:10, bovenaan 6 m uit elkaar op de
// bovenflens 1,0 m onder het spoor; staalhoogte 4,5 m in het veld, zodat de
// onderkant 5,5 m onder het spoor ligt en 5,1 m breed is.
const STEEL = { flangeDrop: 1.0, halfTop: 3.0, slope: 0.1, fieldDrop: 5.5 };
const webHalf = (x, z) => STEEL.halfTop - STEEL.slope * (deckZ(x) - STEEL.flangeDrop - z);
// Elf rivierpijlers (BGT): hart op hart 105 m, het eerste veld 104,1 m.
const PIERS = [-524.1, -420, -315, -210, -105, 0, 105, 210, 315, 420, 525.1];
// Pijlerschacht: 6,0 × 4,6 m op de waterlijn (BGT), naar boven verlopend tot
// 6,8 × 5,2 m (foto's); de kop ligt 11,7 m onder het spoor (foto's: in het
// midden 11,4 m boven het water, bij de oevers 4,8 m).
const COLUMN = { bottom: [6.0, 4.6], top: [6.8, 5.2], drop: 11.7 };
// Hamerstuk van 46 m (Reusink): de schoorpoten lopen van de pijlerkop
// (hamervoet 6,8 m) naar de onderkant van de veldligger 23,5 m uit het hart.
// Ertussen een driehoekige opening van 26 m onder de steunpuntligger (3,6 m
// onder het spoor) met de punt 9,3 m onder het spoor (foto's).
const HAMMER = { half: 23.5, footHalf: 3.4, apexDrop: 9.3, openHalf: 13.0, soffitDrop: 3.6 };
// Aanlandingsviaducten (foto's): betonnen ligger van 8,4 m breed met een
// gebogen uitkraging tot de dekrand (aan de ligger 1,6 m onder het spoor),
// onderkant 4,0 m onder het spoor; boven elke kolom een nis van 1,4 × 1,6 m en
// 0,35 m diep in de zijkant van de ligger. Twaalf velden per viaduct op
// kolommen van 6,0 m breed die naar boven verlopen van 3,0 tot 4,0 m.
const APPROACH = {
  girderHalf: 4.2,
  soffitDrop: 1.6,
  bottomDrop: 4.0,
  spans: 12,
  column: { bottom: 3.0, top: 4.0, width: 6.0 },
  niche: { width: 1.4, top: 1.9, height: 1.6, depth: 0.35 },
};

// ---------- rivierdeel: stalen kokerligger met hamerstukken ----------
const nearestPier = (x) => PIERS.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a));
const columnTop = (p) => deckZ(p) - COLUMN.drop;
function steelBottom(x) {
  const p = nearestPier(x);
  const d = Math.abs(x - p);
  if (d <= HAMMER.footHalf) return columnTop(p);
  if (d <= HAMMER.half) {
    const side = Math.sign(x - p);
    const zEnd = deckZ(p + side * HAMMER.half) - STEEL.fieldDrop;
    const t = (d - HAMMER.footHalf) / (HAMMER.half - HAMMER.footHalf);
    return columnTop(p) + t * (zEnd - columnTop(p));
  }
  return deckZ(x) - STEEL.fieldDrop;
}
const [XT_S, XT_N] = TRANSITIONS;
const steelXs = stationsBetween(
  XT_S,
  XT_N,
  1,
  PIERS.flatMap((p) => [p - HAMMER.half, p - HAMMER.footHalf, p + HAMMER.footHalf, p + HAMMER.half]),
);
const steelTop = (x) => deckZ(x) - STEEL.flangeDrop + 0.05;
const steelProfile = profileY(
  [...steelXs.map((x) => [x, steelBottom(x)]), ...[...steelXs].reverse().map((x) => [x, steelTop(x)])],
  -3.6,
  3.6,
);
// Lijven onder 1:10 over de hele hoogte, ook langs de schoorpoten.
const webWedge = loftX(
  stationsBetween(XT_S - 1, XT_N + 1, 5).map((x) => {
    const top = deckZ(x) - STEEL.flangeDrop + 0.5;
    const bottom = BASE - 1;
    const hTop = webHalf(x, top);
    const hBottom = webHalf(x, bottom);
    return { x, section: [[-hBottom, bottom], [hBottom, bottom], [hTop, top], [-hTop, top]] };
  }),
);
const openings = PIERS.map((p) =>
  profileY(
    [
      [p, deckZ(p) - HAMMER.apexDrop],
      [p + HAMMER.openHalf, deckZ(p + HAMMER.openHalf) - HAMMER.soffitDrop],
      [p - HAMMER.openHalf, deckZ(p - HAMMER.openHalf) - HAMMER.soffitDrop],
    ],
    -5,
    5,
  ),
);
const steel = steelProfile.intersect(webWedge).subtract(union(openings));

// ---------- dek, kabelgoten ----------
const riverDeck = loftX(
  stationsBetween(XT_S, XT_N, 5).map((x) => {
    const D = deckZ(x);
    return {
      x,
      section: [
        [-STEEL.halfTop, D - DECK.webDrop],
        [STEEL.halfTop, D - DECK.webDrop],
        [DECK.half, D - DECK.edgeDrop],
        [DECK.half, D],
        [-DECK.half, D],
        [-DECK.half, D - DECK.edgeDrop],
      ],
    };
  }),
);
const ridges = [-1, 1].map((side) =>
  loftX(
    stationsBetween(X_SOUTH, X_NORTH, 5).map((x) => {
      const D = deckZ(x);
      const c = curveY(x);
      const [a, b] = side > 0 ? [RIDGE.y0, RIDGE.y1] : [-RIDGE.y1, -RIDGE.y0];
      return {
        x,
        section: [
          [a + c, D - 0.1],
          [b + c, D - 0.1],
          [b + c, D + RIDGE.height],
          [a + c, D + RIDGE.height],
        ],
      };
    }),
  ),
);

// ---------- aanlandingsviaducten ----------
const SOFFIT_POINTS = 12;
function approachSlabSection(x) {
  const D = deckZ(x);
  const c = curveY(x);
  const right = [];
  // Gebogen onderkant van de uitkraging: kwart ellips van de ligger naar de
  // onderkant van de randbalk.
  for (let i = 0; i <= SOFFIT_POINTS; i++) {
    const th = (Math.PI / 2) * (1 - i / SOFFIT_POINTS);
    right.push([
      APPROACH.girderHalf + (DECK.half - APPROACH.girderHalf) * Math.cos(th),
      D - DECK.edgeDrop - (APPROACH.soffitDrop - DECK.edgeDrop) * Math.sin(th),
    ]);
  }
  const left = [...right].reverse().map(([y, z]) => [-y, z]);
  return [...right, [DECK.half, D], [-DECK.half, D], ...left].map(([y, z]) => [y + c, z]);
}
const approachGirderSection = (x) => {
  const D = deckZ(x);
  const c = curveY(x);
  const h = APPROACH.girderHalf - 0.05;
  return [
    [-h + c, D - APPROACH.bottomDrop],
    [h + c, D - APPROACH.bottomDrop],
    [h + c, D - APPROACH.soffitDrop + 0.1],
    [-h + c, D - APPROACH.soffitDrop + 0.1],
  ];
};
const APPROACHES = [
  { x0: X_SOUTH, x1: XT_S },
  { x0: XT_N, x1: X_NORTH },
];
const approachColumnXs = APPROACHES.flatMap(({ x0, x1 }) => {
  const span = (x1 - x0) / APPROACH.spans;
  return Array.from({ length: APPROACH.spans - 1 }, (_, i) => x0 + span * (i + 1));
});
const niches = approachColumnXs.flatMap((x) => {
  const D = deckZ(x);
  const c = curveY(x);
  const { width, top, height, depth } = APPROACH.niche;
  const h = APPROACH.girderHalf - 0.05;
  return [-1, 1].map((side) =>
    boxFromTo(x - width / 2, x + width / 2, c + side * (h - depth), c + side * (h + 1), D - top - height, D - top),
  );
});
const approaches = APPROACHES.flatMap(({ x0, x1 }) => {
  const xs = stationsBetween(x0, x1, 5);
  return [
    loftX(xs.map((x) => ({ x, section: approachSlabSection(x) }))),
    loftX(xs.map((x) => ({ x, section: approachGirderSection(x) }))),
  ];
});
const approachColumns = approachColumnXs.map((x) => {
  const { bottom, top, width } = APPROACH.column;
  const h = deckZ(x) - APPROACH.bottomDrop + 0.05 - BASE;
  return Manifold.extrude(
    [[[-bottom / 2, -width / 2], [bottom / 2, -width / 2], [bottom / 2, width / 2], [-bottom / 2, width / 2]]],
    h,
    0,
    0,
    [top / bottom, 1],
  ).translate([x, curveY(x), BASE]);
});

// ---------- pijlers, overgangspijlers, landhoofden ----------
const columns = PIERS.map((p) => {
  const [bx, by] = COLUMN.bottom;
  const [tx, ty] = COLUMN.top;
  const h = columnTop(p) + 0.05 - BASE;
  return Manifold.extrude([[[-bx / 2, -by / 2], [bx / 2, -by / 2], [bx / 2, by / 2], [-bx / 2, by / 2]]], h, 0, 0, [
    tx / bx,
    ty / by,
  ]).translate([p, 0, BASE]);
});
const transitionPiers = TRANSITIONS.map((x) =>
  boxFromTo(
    x - TRANSITION_PIER.half,
    x + TRANSITION_PIER.half,
    -TRANSITION_PIER.halfY,
    TRANSITION_PIER.halfY,
    BASE,
    Math.max(deckZ(x - TRANSITION_PIER.half), deckZ(x + TRANSITION_PIER.half)) - DECK.edgeDrop,
  ),
);
const abutments = [
  boxFromTo(X_SOUTH - 4, X_SOUTH + 1, -DECK.half, DECK.half, BASE, deckZ(X_SOUTH) - 0.02),
  boxFromTo(X_NORTH - 1, X_NORTH + 4, -DECK.half, DECK.half, BASE, deckZ(X_NORTH) - 0.02).translate([
    0,
    curveY(X_NORTH),
    0,
  ]),
];

const bridge = union([
  steel,
  riverDeck,
  ...ridges,
  union(approaches).subtract(union(niches)),
  ...approachColumns,
  ...columns,
  ...transitionPiers,
  ...abutments,
]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek, de veldliggers, de schoorpoten en de aanlandingsviaducten hangen
// vrij. Net als de overhangopvulling van de export krijgt de STL daaronder een
// wig van 50 graden die uitloopt in een scherm tot de onderplaat (minstens
// 0,9 m, op grove schaal 1 mm breed). Onder de schoorpoten begint de wig aan
// de onderkant van de poot, zodat de Y-opening erboven open blijft.
const KNEE = (50 * Math.PI) / 180;
const SCREEN = Math.max(0.45, (0.5 * scale) / 1000);
function footSection(zb, w, yc) {
  const s = Math.min(SCREEN, w - 0.05);
  const zs = zb - Math.tan(KNEE) * (w - s);
  const section =
    zs > BASE + 0.05
      ? [[-s, BASE], [s, BASE], [s, zs], [w, zb], [-w, zb], [-s, zs]]
      : (() => {
          const a = w - (zb - BASE) / Math.tan(KNEE);
          return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
        })();
  return section.map(([y, z]) => [y + yc, z]);
}
const deckFoot = (x0, x1) =>
  loftX(
    stationsBetween(x0, x1, 2).map((x) => ({
      x,
      section: footSection(deckZ(x) - DECK.edgeDrop + 0.003, DECK.half + 0.003, curveY(x)),
    })),
  );
// Onder de gebogen uitkraging van de viaducten begint de wig op het hoekpunt
// van de soffit waar die vlakker dan 45 graden gaat lopen, 4 mm omhoog langs
// het steilere stuk ernaar, zodat de bolling binnen de wig valt.
const soffitPoint = (th, D) => [
  APPROACH.girderHalf + (DECK.half - APPROACH.girderHalf) * Math.cos(th),
  D - DECK.edgeDrop - (APPROACH.soffitDrop - DECK.edgeDrop) * Math.sin(th),
];
// Eerste hoekpunt vanaf de rand waarna de soffit vlakker dan 45 graden loopt.
const SOFFIT_START = (() => {
  const step = Math.PI / 2 / SOFFIT_POINTS;
  for (let i = 1; i < SOFFIT_POINTS; i++) {
    const [ya, za] = soffitPoint(i * step, 0);
    const [yb, zb] = soffitPoint((i + 1) * step, 0);
    if (Math.abs(za - zb) < Math.abs(ya - yb)) return i * step;
  }
  throw new Error("soffit zonder steil stuk");
})();
const viaductFoot = (x0, x1) =>
  loftX(
    stationsBetween(x0, x1, 2).map((x) => {
      const [y1, z1] = soffitPoint(SOFFIT_START, deckZ(x));
      const [y0, z0] = soffitPoint(SOFFIT_START - Math.PI / 2 / SOFFIT_POINTS, deckZ(x));
      const l = Math.hypot(y0 - y1, z0 - z1);
      return {
        x,
        section: footSection(z1 + (0.004 * (z0 - z1)) / l, y1 + (0.004 * (y0 - y1)) / l, curveY(x)),
      };
    }),
  );
const strutFoot = (x0, x1) =>
  loftX(
    stationsBetween(
      Math.min(x0, x1),
      Math.max(x0, x1),
      0.5,
      PIERS.flatMap((p) => [p - HAMMER.half, p - HAMMER.footHalf, p + HAMMER.footHalf, p + HAMMER.half]),
    ).map((x) => {
      const zb = steelBottom(x);
      return { x, section: footSection(zb + 0.003, webHalf(x, zb) + 0.003, 0) };
    }),
  );
const footParts = [];
const fieldEnds = [
  XT_S + TRANSITION_PIER.half - 0.1,
  ...PIERS.flatMap((p) => [p - HAMMER.half, p + HAMMER.half]),
  XT_N - TRANSITION_PIER.half + 0.1,
];
for (let i = 0; i < fieldEnds.length; i += 2) footParts.push(deckFoot(fieldEnds[i], fieldEnds[i + 1]));
for (const p of PIERS) {
  footParts.push(strutFoot(p - HAMMER.half - 0.1, p - HAMMER.footHalf + 0.2));
  footParts.push(strutFoot(p + HAMMER.footHalf - 0.2, p + HAMMER.half + 0.1));
}
footParts.push(viaductFoot(X_SOUTH + 0.5, XT_S - TRANSITION_PIER.half + 0.1));
footParts.push(viaductFoot(XT_N + TRANSITION_PIER.half - 0.1, X_NORTH - 0.5));
const printFoot = union(footParts);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant, per soort.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const byKind = {};
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const [x, y, z] = [0, 1, 2].map((a) => (p[0][a] + p[1][a] + p[2][a]) / 3);
    const D = deckZ(x);
    const p0 = nearestPier(x);
    const inHammer = x > XT_S && x < XT_N && Math.abs(x - p0) <= HAMMER.half + 0.2;
    let kind = "overig";
    if (z > D - 1.3 && Math.abs(y - curveY(x)) > 2.8) kind = inHammer ? "uitkraging naast hamer" : "uitkraging dek";
    else if (inHammer && Math.abs(x - p0) < HAMMER.openHalf + 0.1 && Math.abs(z - (D - HAMMER.soffitDrop)) < 0.2)
      kind = "plafond Y-opening";
    else if (x > XT_S && x < XT_N && Math.abs(z - steelBottom(x)) < 0.25) kind = inHammer ? "schoorpoot" : "veldligger";
    else if ((x < XT_S || x > XT_N) && z < D - APPROACH.soffitDrop + 0.2) kind = "aanlandingsviaduct";
    else if (z > D - APPROACH.soffitDrop - 0.1 && z < D - DECK.edgeDrop + 0.05) kind = "uitkraging viaduct";
    else if (z > D - 0.15) kind = "kabelgoot";
    byKind[kind] = (byKind[kind] ?? 0) + len / 2;
  }
  return Object.fromEntries(Object.entries(byKind).map(([k, a]) => [k, +a.toFixed(1)]));
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
const modelOverhang = overhangs(bridge);
const printOverhang = overhangs(printModel);
console.log("vrij hangend in het model (m2):", modelOverhang);
console.log("overhang in de printversie (m2):", printOverhang);
// In de printversie blijven alleen het vlakke plafond van de Y-openingen (een
// brug tussen twee schoorpoten) en de uitkraging van het dek naast de hamers
// over; elders mogen alleen naadjes van millimeters tussen printvoet en model
// hangen (samen hooguit 25 m2 per soort).
for (const [kind, area] of Object.entries(printOverhang)) {
  if (!["plafond Y-opening", "uitkraging naast hamer"].includes(kind) && area > 25) {
    throw new Error(`printversie heeft overhang: ${kind} ${area} m2`);
  }
}

// ---------- spoor als eigen onderdeel ----------
// De bovenste 0,5 m van het dek tussen de kabelgoten is een eigen node met de
// attributen van het BGT-wegdeel (glTF `extras.attributes`), zodat de
// kleurregels van een thema (bijvoorbeeld spoor zwart) op het brugdek werken
// zoals op de PDOK-wegdelen ernaast. Op het dek liggen twee actuele
// BGT-wegdelen met relatieve hoogteligging 1 over de hele lengte (x = -946 tot
// 954,4), één per spoor, beide spoorbaan, gesloten verharding, zonder
// plus-fysiek voorkomen: L0004.14b0a8e412104aa1980f017b714a3ce0 (westelijk
// spoor, y = 1,0 tot 4,4 uit de as) en L0004.7ba3aa82e68245efa6d327db98f11f12
// (oostelijk spoor, y = -4,5 tot -1,1). Met dezelfde functie op beide sporen
// is het hele spoorbed tussen de kabelgoten (ook de strook tussen de sporen
// en die langs de goten) één node road:spoor; de kabelgoten, de looppaden
// erbuiten en de dekranden blijven constructie, net als de landhoofden onder
// het spoorbed. De twee BGT-vlakken "voetpad op trap" naast de
// overgangspijlers (|y| = 7,3 tot 10,7) liggen buiten het dek en zitten niet
// in het model.
// Wordt pas hier gebouwd, nadat brug en printmodel zijn doorgerekend, zodat de
// STL gelijk blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const SPOOR_ATTRIBUTES = { bgt_functie: "spoorbaan", bgt_fysiekvoorkomen: "gesloten verharding" };
// Strook over de loftstations van dek, viaducten en kabelgoten samen, van
// 0,5 m onder tot 1 m boven het spoor, tot in de kabelgoten (|y| = 4,9) en
// 0,5 m voorbij de landhoofden, zodat hij geen vlak met de kopse kanten deelt.
const layerXs = [
  X_SOUTH - 4.5,
  ...stationsBetween(X_SOUTH, X_NORTH, 5, [
    ...stationsBetween(XT_S, XT_N, 5),
    ...APPROACHES.flatMap(({ x0, x1 }) => stationsBetween(x0, x1, 5)),
  ]),
  X_NORTH + 4.5,
];
const trackHalf = (RIDGE.y0 + RIDGE.y1) / 2;
const trackStrip = loftX(
  layerXs.map((x) => {
    const zt = deckZ(x);
    // Op het noordelijke landhoofd niet verder afbuigen dan het dek.
    const c = curveY(Math.min(x, X_NORTH));
    return {
      x,
      section: [
        [-trackHalf + c, zt - LAYER],
        [trackHalf + c, zt - LAYER],
        [trackHalf + c, zt + ABOVE],
        [-trackHalf + c, zt + ABOVE],
      ],
    };
  }),
);
// De kabelgoten blijven constructie over hun hele hoogte, met 2 cm vrij: de
// strook tussen y0 - 2 cm en y1 + 2 cm valt weg van onder tot boven.
const ridgeGuards = [-1, 1].map((side) =>
  loftX(
    stationsBetween(X_SOUTH, X_NORTH, 5).map((x) => {
      const D = deckZ(x);
      const c = curveY(x);
      const [a, b] = side > 0 ? [RIDGE.y0 - GUARD, RIDGE.y1 + GUARD] : [-RIDGE.y1 - GUARD, -RIDGE.y0 + GUARD];
      return {
        x: x === X_SOUTH ? X_SOUTH - 5 : x === X_NORTH ? X_NORTH + 5 : x,
        section: [
          [a + c, D - LAYER - 0.5],
          [b + c, D - LAYER - 0.5],
          [b + c, D + ABOVE + 0.5],
          [a + c, D + ABOVE + 0.5],
        ],
      };
    }),
  ),
);
const trackCut = trackStrip.subtract(union(ridgeGuards));
const track = trackCut.intersect(bridge);
const structure = bridge.subtract(trackCut);
const parts = [
  ["building:brug-hollandsch-diep", structure],
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
  if (Math.abs(sum - whole) > 1e-4 * whole) throw new Error("onderdelen tellen niet op tot de brug");
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
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
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
report.hammer = PIERS.map((p) => ({
  x: p,
  deckNap: +(deckZ(p) + WATER_NAP).toFixed(2),
  columnTopNap: +(columnTop(p) + WATER_NAP).toFixed(2),
  apexNap: +(deckZ(p) - HAMMER.apexDrop + WATER_NAP).toFixed(2),
}));
const glbFile = path.join(outDir, "brug-hollandsch-diep.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-brug-hollandsch-diep.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `brug-hollandsch-diep-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Brug Hollandsch Diep 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  screenM: +(2 * SCREEN).toFixed(2),
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Op het water midden tussen de rivierpijlers, 20 m naast de as.
const SAMPLE_X = [-472, -262.5, -52.5, 157.5, 367.5, 472.5];
const samplePoints = SAMPLE_X.flatMap((x) => [
  [x, 20],
  [x, -20],
]);
await writeFile(
  path.join(outDir, "brug-hollandsch-diep.json"),
  JSON.stringify(
    {
      name: "Brug Hollandsch Diep",
      file: "brug-hollandsch-diep.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [103640.9, 414712.68],
      xAxis: [-0.36933, 0.9293],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      // Op het water van het Hollandsch Diep, midden tussen de rivierpijlers.
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van de HSL-spoorbrug in het hart van de middelste (zesde) rivierpijler op de waterspiegel van het Hollandsch Diep (z = 0, NAP +0,2 m) in de oorsprong, +X langs de brug naar het noordnoordwesten (Willemsdorp, RD-richting 111,67 graden vanaf het oosten) en +Y stroomafwaarts naar het westzuidwesten. Twee nodes: road:spoor, de bovenste 0,5 m van het dek tussen de kabelgoten (8,76 m breed, van landhoofd tot landhoofd) met de attributen van de twee BGT-wegdelen op het dek in extras.attributes (bgt_functie spoorbaan, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het dek van 14,9 m breed van het zuidelijke landhoofd bij Moerdijk (x = -946) tot het noordelijke bij Willemsdorp (x = 954,4), met het spoor op NAP +9,0 m, +23,4 m in het midden en +5,9 m (AHN) en kabelgoten op 4,4 tot 5,6 m uit de as; het rivierdeel als stalen kokerligger met lijven onder 1:10 (onderkant 5,5 m onder het spoor) op elf Y-pijlers op 105 m hart op hart (x = -524,1 tot 525,1), elk met een verlopende betonnen schacht van 6,0 × 4,6 tot 6,8 × 5,2 m en een stalen hamerstuk van 47 m met twee schoorpoten en een driehoekige opening van 26 m onder de steunpuntligger; overgangspijlers van 5 × 21 m op x = -603,1 en 604,1; twee betonnen aanlandingsviaducten met een gebogen uitkraging op elf kolommen elk, het noordelijke met een lichte bocht. De oude Moerdijkspoorbrug en de A16-brug ernaast, de bovenleidingmasten, leuningen en werkplatforms zijn weggelaten; de export vult onder het dek en de schoorpoten een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd, met groundHeight als terugval. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(X_NORTH - X_SOUTH).toFixed(1),
        riverPartM: +(XT_N - XT_S).toFixed(1),
        approachViaductsM: [+(XT_S - X_SOUTH).toFixed(1), +(X_NORTH - XT_N).toFixed(1)],
        deckWidthM: 2 * DECK.half,
        mainSpansM: PIERS.slice(1).map((p, i) => +(p - PIERS[i]).toFixed(1)),
        endSpansM: [+(PIERS[0] - XT_S).toFixed(1), +(XT_N - PIERS[PIERS.length - 1]).toFixed(1)],
        hammerLengthM: 2 * HAMMER.half,
        steelDepthFieldM: STEEL.fieldDrop - STEEL.flangeDrop,
        deckNapM: { south: DECK_NAP[0], crest: Math.max(...DECK_NAP), north: DECK_NAP[DECK_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Brug_Hollandsch_Diep",
        "J.H. Reusink, Spoorbrug over het Hollandsch Diep, Bruggen 10 (2002) nr. 3 (https://www.bruggenstichting.nl/images/bruggen2002/sep-HollandschDiep.pdf)",
        "https://benthemcrouwel.com/projects/bridge-hst",
        "PDOK BGT overbruggingsdeel (dek, rivierpijlers, overgangspijlers), EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor het spoorniveau en het dwarsprofiel; PDOK-terrein voor de waterspiegel",
        "Wikimedia Commons: Brug Hollandsch Diep.jpg, Thalys op de Moerdijk.jpg, Intercity Direct train Moerdijkbrug.jpg, Thalys train Moerdijkbrug.jpg, Moerdijkbruggen bij Willemsdorp.jpg, Moerdijk Slow meets fast (46954209694).jpg, Moerdijkbrug Thalys THA 9364 naar Paris Nord (18282382411).jpg, Nederland Moerdijk 8 januari 2003 ID297071.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

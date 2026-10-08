// Genereert een vereenvoudigd, gesloten 3D-model van de Eilandbrug bij Kampen:
// de asymmetrische tuibrug (2003, Bouwdienst Rijkswaterstaat met Hans van
// Heeswijk) van de N50 over de IJssel tussen Kampen en Ramspol, met de
// achterover hellende betonnen pyloon van 93 m (twee poten die naar boven toe
// naar elkaar toe lopen, met een kop waarin de tuien verankerd zijn), de
// hoofdoverspanning van circa 150 m met twee tuivlakken in het midden van het
// wegdek, de vier achtertuien per vlak naar het ankerblok op de noordelijke
// dijk, de basculebrug (beweegbaar deel) aan de zuidkant van de vaargeul en de
// aanbruggen over de uiterwaarden. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, per onderdeel een node met de
// materiaalklasse in de nodenaam: de constructie en de rijbaan met
// BGT-attributen) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal> met een printvoet onder
// het dek. De brug is 420 m lang en past op 1:1000 niet in 400 mm, vandaar
// standaard 1:1500 (280 mm).
//
//   node scripts/generate-eilandbrug.mjs              # 1:1500 (standaard)
//   node scripts/generate-eilandbrug.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het BGT-dek midden tussen de twee
// landhoofden (RD 186982,81, 510702,83), op de waterspiegel van de IJssel zoals
// het PDOK-terrein die legt (NAP -0,47 m), Z omhoog. +X loopt langs de brug
// naar het noorden (Ramspol, RD-richting 97,84 graden vanaf het oosten), +Y
// naar het westen, stroomafwaarts. Langs de as wordt ook de afstand s gebruikt,
// met s = 0 op de zuidkant van de basculepijler: x = s - 71,3.
//
// Bronnen: BGT overbruggingsdeel (dek 18,8 m breed van s = -138,6 tot 281,2,
// zuidelijk landhoofd, aanbrugpijlers van 8,8 × 1,7 m op s = -90,1 en -42,4,
// basculepijler s = 0,4 tot 4,4, steunpijler s = 25,0 tot 28,9 en het ankerblok
// van 23,8 m breed van s = 259 tot 281); AHN DSM 0,5 m (PDOK WCS) voor het
// lengteprofiel van het wegdek (NAP +16,7 tot +18,5 m), de pyloon (top
// NAP +90,7 m, poten van ±14,3 m naast de as op de uiterwaard tot ±3,4 m in de
// top, achterover hellend), de tuivlakken 3 m naast de as en de basculeklep
// (bij de opname open, top NAP +42 m, dus 23,5 m lang); PDOK-terrein voor de
// waterspiegel (ellipsoïdisch 42,18 m); Wikipedia voor bouwjaar, lengte (412 m),
// hoogte (93 m), hoofdoverspanning (150 m) en doorvaarthoogte (14 m);
// Wikimedia Commons-foto's voor de vorm van pyloon, kop, pijlers, ankerblok en
// basculepijler en het aantal tuien (11 per vlak in de hoofdoverspanning, 4
// achtertuien per vlak).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "eilandbrug");
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
// Polygoon in het YZ-vlak (dwarsdoorsnede), uitgetrokken langs X van x0 tot x1.
const profileX = (points, x0, x1) =>
  Manifold.extrude([ccw(points)], x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, 0]);
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
  if (solid.volume() <= 0) throw new Error("loft: omgekeerde doorsnede");
  return solid;
}
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};

// ---------- hoofdmaten ----------
// Het PDOK-terrein legt de IJssel op ellipsoïdisch 42,18 m; met het verschil
// NAP-ellipsoïde van 42,65 m (uiterwaard en dijk, AHN tegen PDOK) is dat
// NAP -0,47 m. Dat is z = 0 in het model.
const WATER_NAP = -0.47;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// Afstand langs de as (s) en de lokale x: x = s - S0.
const S0 = 71.3;
const X = (s) => +(s - S0).toFixed(3);
const SOUTH_END = X(-138.6); // achterkant zuidelijk landhoofd (BGT)
const SOUTH_FACE = X(-132.0); // voorzijde zuidelijk landhoofd (BGT)
const ANCHOR_FACE = X(259.0); // voorzijde ankerblok op de noordelijke dijk (BGT)
const NORTH_END = X(281.2); // einde dek en ankerblok (BGT)

// Wegdek in NAP-meters om de 4 m vanaf s = -140: 40e percentiel van het
// AHN-DSM in stroken 0-2 en 4-6,2 m naast de as (tussen de tuien door), over
// 4 m, licht gladgestreken; over de basculeklep (bij de opname open) en de
// pyloonkop lineair.
const DECK_NAP = [
  16.65, 16.7, 16.78, 16.86, 16.93, 17.01, 17.08, 17.14, 17.2, 17.26, 17.31, 17.36, 17.41, 17.46, 17.51,
  17.56, 17.61, 17.66, 17.7, 17.75, 17.79, 17.83, 17.87, 17.91, 17.94, 17.98, 18.01, 18.04, 18.07, 18.1,
  18.14, 18.17, 18.2, 18.22, 18.23, 18.24, 18.25, 18.25, 18.25, 18.26, 18.26, 18.26, 18.31, 18.36, 18.42,
  18.44, 18.45, 18.45, 18.47, 18.48, 18.48, 18.49, 18.5, 18.51, 18.51, 18.51, 18.5, 18.51, 18.51, 18.51,
  18.5, 18.5, 18.48, 18.47, 18.45, 18.44, 18.42, 18.4, 18.38, 18.35, 18.32, 18.29, 18.26, 18.23, 18.2,
  18.16, 18.13, 18.09, 18.05, 18.0, 17.96, 17.93, 17.89, 17.85, 17.81, 17.77, 17.74, 17.7, 17.68, 17.63,
  17.58, 17.52, 17.47, 17.43, 17.39, 17.33, 17.28, 17.22, 17.16, 17.09, 17.03, 16.96, 16.89, 16.83, 16.76,
  16.68, 16.63,
];
const deckNap = (s) => {
  const f = Math.min(Math.max((s + 140) / 4, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t;
};
const top = (x) => Z(deckNap(x + S0)); // wegdek in modelhoogte op lokale x

// Dek (BGT): 18,8 m breed. Doorsnede een kokerligger met schuine onderzijde
// (foto's): rand 0,6 m dik, bodem 10 m breed, 2,4 m onder het wegdek; de
// stalen basculeklep is 1,8 m hoog met een bodem van 12 m. Langs de randen
// een schampkant van 0,9 m breed en 0,5 m hoog in plaats van de leuningen.
const DECK = { half: 9.4, edge: 0.6, depth: 2.4, soffitHalf: 5.0 };
const LEAF = { depth: 1.8, soffitHalf: 6.0 };
const KERB = { inner: 8.5, height: 0.5 };
// Pijlers en landhoofden (BGT), in s.
const HINGE = 4.42; // noordkant basculepijler, draaipunt van de klep
const REST = 24.95; // zuidkant steunpijler, punt van de klep
const BASCULE_PIER = { s0: 0.44, s1: 4.42, half: 9.6 };
const REST_PIER = { s0: 24.95, s1: 28.9, half: 9.4, leg: 4.0 };
// Aanbrugpijlers: wanden van 1,7 m dik, onder 8,8 m breed en onder het dek
// 11 m (foto's: naar boven verbreed). De pijler in de achteroverspanning staat
// op s ≈ 216 aan de dijkvoet (foto's), 3 m dik (geschat).
const WALL_PIERS = [
  { s: -90.1, thick: 1.73, half0: 4.4, half1: 5.5 },
  { s: -42.45, thick: 1.73, half0: 4.4, half1: 5.5 },
  { s: 216.0, thick: 3.0, half0: 4.4, half1: 5.5 },
];
const ANCHOR = { half: 11.9, wallTop: 1.2, chamfer: 1.5 };

// Pyloon: twee betonnen poten, naar boven toe naar elkaar toe en achterover
// (noordwaarts) hellend. AHN: top NAP +90,7 m op s = 189,3 tot 191,9, poten op
// de uiterwaard ±14,3 m naast de as, in de top ±3,4 m; zuidvlak 11,5 graden,
// noordvlak 9 graden uit het lood (foto's: hellingshoek circa 10 graden).
// Dikte langs de as 6,7 m onder tot 2,6 m boven, breedte 3,6 tot 2,2 m.
const PYLON = { topNap: 90.7, south0: 170.85, south1: 189.3, north0: 177.5, north1: 191.9, t0: 14.3, t1: 3.4, w0: 3.6, w1: 2.2 };
const pz = (nap) => nap / PYLON.topNap; // 0 op NAP 0, 1 in de top
const legSouth = (nap) => PYLON.south0 + (PYLON.south1 - PYLON.south0) * pz(nap);
const legNorth = (nap) => PYLON.north0 + (PYLON.north1 - PYLON.north0) * pz(nap);
const legCentre = (nap) => (legSouth(nap) + legNorth(nap)) / 2;
const legT = (nap) => PYLON.t0 + (PYLON.t1 - PYLON.t0) * pz(nap);
const legW = (nap) => PYLON.w0 + (PYLON.w1 - PYLON.w0) * pz(nap);
const legInner = (nap) => legT(nap) - legW(nap) / 2;
// De kop tussen de poten (foto's: NAP +71 tot +84 m) met een V-vormige
// onderkant van 50 graden, zodat hij zonder steun print.
const HEAD = { bottomNap: 71.0, topNap: 84.0 };
// Dwarsdrager onder het dek tussen de poten, met schuine schoren van 50
// graden naar de poten (foto's).
const CROSSBEAM = { half: 2.0, flatHalf: 5.0, depth: 3.0 };

// Tuien. Hoofdoverspanning: 11 tuien per vlak in twee verticale vlakken 3 m
// naast de as (AHN), voeten van s = 70 tot 163 om de 9,3 m (foto's), in de kop
// verankerd van NAP +83 (buitenste) tot +72 m. Achtertuien: 4 per vlak van
// NAP +81 tot +75 m naar het ankerblok, s = 271 tot 262, aan de rand van het
// dek (in het model 8,9 m naast de as).
const SAIL = { t: 3.0, thick: 0.9 };
const MAIN_FEET = Array.from({ length: 11 }, (_, k) => 70 + 9.3 * k);
const MAIN_ANCHOR_NAP = MAIN_FEET.map((_, k) => 83 - 1.1 * k);
const BACK_FEET = [271, 268, 265, 262];
const BACK_ANCHOR_NAP = [81, 79, 77, 75];
const BACK_T = 8.9;
// Printbaarheid: een tui van 0,15 m is op 1:1000 niet te printen. Waar de
// tuien steiler staan dan 50 graden (de drie binnenste van de
// hoofdoverspanning) zijn ze vrijstaande staven van 1,0 × 1,0 m; daaronder is
// elk tuivlak een dichte plaat van 0,9 m dik tussen de buitenste tui, het dek
// en een lijn van 50 graden van het dek naar de kop, met de tuien als ribben
// van 1,0 m breed die 0,3 m uitsteken (flanken van 45 graden). Zo hangt geen
// vlak flauwer dan 50 graden vrij.
const POINTED = Math.tan((50 * Math.PI) / 180);
const RIB = { base: 1.0, top: 0.4, proud: 0.3 };
const BAR = 1.0;

// ---------- dek ----------
function deckLoft(s0, s1, depth, soffitHalf) {
  return loftX(
    stationsX(X(s0), X(s1), 2).map((x) => {
      const zt = top(x);
      return {
        x,
        section: [
          [-soffitHalf, zt - depth],
          [soffitHalf, zt - depth],
          [DECK.half, zt - DECK.edge],
          [DECK.half, zt],
          [-DECK.half, zt],
          [-DECK.half, zt - DECK.edge],
        ],
      };
    }),
  );
}
const deck = union([
  deckLoft(-138.6, HINGE + 0.01, DECK.depth, DECK.soffitHalf),
  deckLoft(HINGE - 0.01, REST + 0.01, LEAF.depth, LEAF.soffitHalf),
  deckLoft(REST - 0.01, 281.2, DECK.depth, DECK.soffitHalf),
]);
const kerbs = [-1, 1].map((side) =>
  loftX(
    stationsX(SOUTH_END, NORTH_END, 2).map((x) => {
      const zt = top(x);
      const a = side * KERB.inner;
      const b = side * DECK.half;
      return { x, section: [[Math.min(a, b), zt - 0.1], [Math.max(a, b), zt - 0.1], [Math.max(a, b), zt + KERB.height], [Math.min(a, b), zt + KERB.height]] };
    }),
  ),
);
// Voegen van de basculeklep: sleuven van 0,5 m breed en 0,3 m diep over het
// wegdek bij het draaipunt en de punt.
const joints = [HINGE, REST].map((s) => boxFromTo(X(s) - 0.25, X(s) + 0.25, -KERB.inner + 0.05, KERB.inner - 0.05, top(X(s)) - 0.3, top(X(s)) + 1));

// ---------- landhoofden en ankerblok ----------
const southAbutment = loftX(
  stationsX(SOUTH_END, SOUTH_FACE, 2).map((x) => ({
    x,
    section: [[-BASCULE_PIER.half, BASE], [BASCULE_PIER.half, BASE], [BASCULE_PIER.half, top(x) - 0.05], [-BASCULE_PIER.half, top(x) - 0.05]],
  })),
);
// Ankerblok: onder het wegdek gesloten, aan beide zijden een opstaande wand
// van 3,4 m breed tot 1,2 m boven het wegdek waarin de achtertuien verankerd
// zijn, met een afgeschuinde buitenkant (foto's).
const anchorCore = loftX(
  stationsX(ANCHOR_FACE, NORTH_END, 2).map((x) => ({
    x,
    section: [[-KERB.inner - 0.05, BASE], [KERB.inner + 0.05, BASE], [KERB.inner + 0.05, top(x) - 0.05], [-KERB.inner - 0.05, top(x) - 0.05]],
  })),
);
const anchorWalls = [-1, 1].map((side) =>
  loftX(
    stationsX(ANCHOR_FACE, NORTH_END, 2).map((x) => {
      const zt = top(x) + ANCHOR.wallTop;
      const pts = [
        [KERB.inner, BASE],
        [ANCHOR.half, BASE],
        [ANCHOR.half, zt - ANCHOR.chamfer],
        [ANCHOR.half - ANCHOR.chamfer, zt],
        [KERB.inner, zt],
      ];
      const section = side > 0 ? pts : pts.map(([y, z]) => [-y, z]).reverse();
      return { x, section };
    }),
  ),
);

// ---------- pijlers ----------
const soffitAt = (s) => top(X(s)) - DECK.depth + 0.1;
const wallPiers = WALL_PIERS.map(({ s, thick, half0, half1 }) => {
  const x = X(s);
  const zt = soffitAt(s);
  const pts = [];
  for (const dx of [-thick / 2, thick / 2]) {
    for (const t of [-1, 1]) {
      pts.push([x + dx, t * half0, BASE], [x + dx, t * half1, zt]);
    }
  }
  return Manifold.hull(pts);
});
// Basculepijler: een blok over de hele breedte met aan beide kanten verticale
// sleuven en in het midden het glazen trappenhuis, als blinde nissen van
// 0,4 m (foto's).
const bp = BASCULE_PIER;
const bpTop = soffitAt(bp.s0);
const basculePier = boxFromTo(X(bp.s0), X(bp.s1), -bp.half, bp.half, BASE, bpTop).subtract(
  union(
    [X(bp.s0), X(bp.s1)].flatMap((xf) => [
      ...[-1, 1].map((t) => boxFromTo(xf - 0.4, xf + 0.4, t * 6.5 - 0.6, t * 6.5 + 0.6, 1.0, bpTop - 2.0)),
      boxFromTo(xf - 0.4, xf + 0.4, -1.6, 1.6, 1.0, bpTop - 1.0),
    ]),
  ),
);
// Aandrijving van de klep: aan beide randen een liggende cilinder van 2,5 m
// onder het dek, van de basculepijler 7,4 m naar het zuiden (foto's, ortho).
// Een halve zeshoek met daaronder een kiel van 55 graden, zodat de onderkant
// zonder steun print.
const drives = [-1, 1].map((side) => {
  const r = 1.25;
  const tc = side * 8.6;
  const zc = top(X(0)) - DECK.edge - 0.33 - 0.95;
  const keel = r * Math.tan((55 * Math.PI) / 180);
  const shape = [[r, 0], [r / 2, 0.866 * r], [-r / 2, 0.866 * r], [-r, 0], [0, -keel]];
  return profileX(shape.map(([t, z]) => [tc + t, zc + z]), X(-7.0), X(bp.s0) + 0.5);
});
// Steunpijler aan de noordkant van de doorvaart: een portaal van twee kolommen
// met een bovenregel (foto's); de opening tussen de kolommen is op 1:1000 een
// blinde nis van 0,4 m aan beide kanten.
const rp = REST_PIER;
const rpTop = soffitAt(rp.s0);
const restPier = boxFromTo(X(rp.s0), X(rp.s1), -rp.half, rp.half, BASE, rpTop).subtract(
  union([X(rp.s0), X(rp.s1)].map((xf) => boxFromTo(xf - 0.4, xf + 0.4, -(rp.half - rp.leg), rp.half - rp.leg, 0, rpTop - 2.5))),
);

// ---------- pyloon ----------
const legs = [-1, 1].map((side) => {
  const pts = [];
  for (const nap of [BASE + WATER_NAP, PYLON.topNap]) {
    const z = Z(nap);
    for (const s of [legSouth(nap), legNorth(nap)]) {
      for (const dt of [-legW(nap) / 2, legW(nap) / 2]) pts.push([X(s), side * (legT(nap) + dt), z]);
    }
  }
  return Manifold.hull(pts);
});
const headPts = [];
for (const nap of [HEAD.bottomNap, HEAD.topNap]) {
  for (const s of [legSouth(nap), legNorth(nap)]) {
    for (const t of [-1, 1]) headPts.push([X(s), t * (legInner(nap) + 0.5), Z(nap)]);
  }
}
{
  const apexNap = HEAD.bottomNap - legInner(HEAD.bottomNap) * POINTED;
  for (const s of [legSouth(apexNap), legNorth(apexNap)]) headPts.push([X(s), 0, Z(apexNap)]);
}
const head = Manifold.hull(headPts);
// Dwarsdrager op de hoogte van het dek, langs de as gecentreerd op de poten.
const beamX = X(legCentre(deckNap(legCentre(18))));
const beamTop = top(beamX) - DECK.edge;
const crossbeam = profileX(
  [
    [-CROSSBEAM.flatHalf, beamTop - CROSSBEAM.depth],
    [CROSSBEAM.flatHalf, beamTop - CROSSBEAM.depth],
    [12.0, beamTop - CROSSBEAM.depth - (12.0 - CROSSBEAM.flatHalf) * POINTED],
    [12.0, beamTop],
    [-12.0, beamTop],
    [-12.0, beamTop - CROSSBEAM.depth - (12.0 - CROSSBEAM.flatHalf) * POINTED],
  ],
  beamX - CROSSBEAM.half,
  beamX + CROSSBEAM.half,
);

// ---------- tuivlakken ----------
// Rib langs een tui van (x0, z0) naar (x1, z1) in een vlak y = 0 (lokaal):
// zeskantige doorsnede, 1,0 m breed op de plaat, 0,4 m op de top.
function rib(x0, z0, x1, z1) {
  const len = Math.hypot(x1 - x0, z1 - z0);
  const p = [-(z1 - z0) / len, (x1 - x0) / len]; // loodrecht op de tui in het vlak
  const pts = [];
  for (const [x, z] of [[x0, z0], [x1, z1]]) {
    for (const [w, y] of [[RIB.base / 2, SAIL.thick / 2], [RIB.top / 2, SAIL.thick / 2 + RIB.proud]]) {
      for (const sw of [-1, 1]) for (const sy of [-1, 1]) pts.push([x + sw * w * p[0], sy * y, z + sw * w * p[1]]);
    }
  }
  return Manifold.hull(pts);
}
function bar(x0, z0, x1, z1, y) {
  const pts = [];
  for (const [x, z] of [[x0, z0], [x1, z1]]) {
    for (const dy of [-BAR / 2, BAR / 2]) for (const dz of [-BAR / 2, BAR / 2]) pts.push([x, y + dy, z + dz]);
  }
  return Manifold.hull(pts);
}
const mainSailFoot = (s) => top(X(s)) - 0.3;
// Voet van de lijn van 50 graden onder de kop (hoofdoverspanning).
const mainOpenFoot = legSouth(HEAD.bottomNap + 0.5) - (Z(HEAD.bottomNap + 0.5) - top(X(140))) / POINTED;
const mainFree = MAIN_FEET.map((s, k) => {
  const xh = X(legCentre(MAIN_ANCHOR_NAP[k]));
  const zh = Z(MAIN_ANCHOR_NAP[k]);
  const angle = (Math.atan2(zh - top(X(s)), xh - X(s)) * 180) / Math.PI;
  return { s, k, xh, zh, angle, free: s > mainOpenFoot };
});
if (mainFree.some(({ free, angle }) => free && angle < 50)) throw new Error("vrije tui flauwer dan 50 graden");
const mainSailLocal = union([
  profileY(
    [
      [X(MAIN_FEET[0]), mainSailFoot(MAIN_FEET[0])],
      [X(mainOpenFoot), mainSailFoot(mainOpenFoot)],
      [X(legSouth(HEAD.bottomNap + 0.5)), Z(HEAD.bottomNap + 0.5)],
      [X(legCentre(HEAD.bottomNap + 0.5)), Z(HEAD.bottomNap + 0.5)],
      [mainFree[0].xh, mainFree[0].zh],
    ],
    -SAIL.thick / 2,
    SAIL.thick / 2,
  ),
  ...mainFree.filter(({ free }) => !free).map(({ s, xh, zh }) => rib(X(s), mainSailFoot(s), xh, zh)),
]);
const mainSails = [-1, 1].map((side) =>
  union([
    mainSailLocal.translate([0, side * SAIL.t, 0]),
    ...mainFree.filter(({ free }) => free).map(({ s, xh, zh }) => bar(X(s), top(X(s)) - 0.3, xh, zh, side * SAIL.t)),
  ]),
);
// Achtertuien: vlak van 3 m naast de as in de kop naar 9 m op het dek; lokaal
// gebouwd in y = 0 en daarna scheef gezet (een lineaire afschuiving, zonder
// spiegeling zodat de oriëntatie van de driehoeken blijft).
const backBase = top(X(BACK_FEET[3]));
const backTop = Z(BACK_ANCHOR_NAP[0]);
const backShear = (z) => BACK_T + ((SAIL.t - BACK_T) * (z - backBase)) / (backTop - backBase);
const backOpenFoot = legNorth(HEAD.bottomNap + 0.5) + (Z(HEAD.bottomNap + 0.5) - top(X(234))) / POINTED;
// De voet van het vlak en de ribben zit 0,3 m in het dek.
const backFoot = (s) => top(X(s)) - 0.3;
const backSailLocal = union([
  profileY(
    [
      [X(legCentre(BACK_ANCHOR_NAP[0])), Z(BACK_ANCHOR_NAP[0])],
      [X(legCentre(HEAD.bottomNap + 0.5)), Z(HEAD.bottomNap + 0.5)],
      [X(legNorth(HEAD.bottomNap + 0.5)), Z(HEAD.bottomNap + 0.5)],
      [X(backOpenFoot), backFoot(backOpenFoot)],
      [X(BACK_FEET[0]), backFoot(BACK_FEET[0])],
    ],
    -SAIL.thick / 2,
    SAIL.thick / 2,
  ),
  ...BACK_FEET.map((s, k) => rib(X(s), backFoot(s), X(legCentre(BACK_ANCHOR_NAP[k])), Z(BACK_ANCHOR_NAP[k]))),
]);
const backSails = [-1, 1].map((side) =>
  backSailLocal.warp((v) => {
    v[1] += side * backShear(v[2]);
  }),
);

const bridge = union([
  deck,
  ...kerbs,
  southAbutment,
  anchorCore,
  ...anchorWalls,
  ...wallPiers,
  basculePier,
  ...drives,
  restPier,
  ...legs,
  head,
  crossbeam,
  ...mainSails,
  ...backSails,
]).subtract(union(joints));

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden vanaf de onderkant van
// de dekrand die uitloopt in een scherm van 0,9 m tot de onderplaat.
const SCREEN = 0.45;
const footStations = stationsX(SOUTH_FACE, ANCHOR_FACE, 1).map((x) => {
  // Bovenkant 0,3 m in het dek, de wig begint net onder de onderrand van de
  // dekrand, zodat de schuine onderkant van het dek er helemaal in valt.
  const zb = top(x) - DECK.edge - 0.02;
  const w = DECK.half;
  const zs = zb - POINTED * (w - SCREEN);
  const zIn = top(x) - 0.3;
  return { x, section: [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [w, zIn], [-w, zIn], [-w, zb], [-SCREEN, zs]] };
});
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);
// Eerst de brug en de printversie als geheel uitrekenen: zo blijven hun
// driehoeken (en die van de STL) dezelfde als voordat de rijbaan een eigen
// onderdeel werd.
for (const [name, solid] of [["brug", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}

// ---------- rijbaan als eigen onderdeel ----------
// De bovenste 0,5 m van het dek tussen de schampkanten is een eigen node met
// de attributen van het BGT-wegdeel op de brug (glTF `extras.attributes`),
// zodat de kleurregels van een thema op het brugdek werken zoals op de
// PDOK-wegdelen ernaast. Op het dek ligt één actueel BGT-wegdeel met
// relatieve hoogteligging 1: de rijbaan van de N50 (autoweg). Geen fietspad,
// voetpad of ondersteunend wegdeel op de brug.
const LAYER = 0.5;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan autoweg", bgt_fysiekvoorkomen: "gesloten verharding" };
// L0002.c250d163ad614c63a74aaa92630445cf (rijbaan autoweg, gesloten
// verharding, relatieve hoogteligging 1), in lokale coördinaten,
// vereenvoudigd tot 5 cm. Hij ligt binnen de schampkanten (|y| ≤ 8,2) van
// x = -206,6 tot 206,9; de rijbaan van het model beslaat de hele strook tussen
// de schampkanten over het dek.
const ROADWAY_BGT = [
  [-206.6, -6.71], [-194.84, -6.77], [-138.65, -6.72], [-101.69, -6.86], [-71.47, -6.63], [-45.57, -6.77],
  [206.83, -6.74], [206.85, 6.8], [148.87, 6.88], [148.87, 7.17], [148.19, 7.18], [147.86, 6.88], [109.03, 6.86],
  [109.04, 7.14], [108.35, 7.13], [108.05, 6.86], [76.8, 6.92], [41.65, 6.84], [6.74, 6.91], [-45.55, 6.87],
  [-71.45, 7.01], [-83.26, 6.92], [-85.99, 7.81], [-112.74, 7.82], [-113.17, 8.19], [-113.84, 8.2], [-113.85, 7.7],
  [-116.53, 6.84], [-160.67, 6.94], [-160.99, 7.22], [-161.66, 7.21], [-161.65, 6.94], [-206.56, 6.8],
];
if (ROADWAY_BGT.some(([x, y]) => x < SOUTH_END || x > NORTH_END || Math.abs(y) > KERB.inner)) {
  throw new Error("BGT-rijbaan ligt buiten het dek tussen de schampkanten");
}
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek: zo snijdt hij het hele
// bovenvlak uit de constructie en houdt die daar geen vlak zonder dikte over
// dat met de bovenkant van het wegdek vecht (z-fighting op de kaart). Hij
// loopt 0,5 m voorbij de uiteinden van het dek, zodat zijn kopvlakken niet op
// die van het dek vallen, en houdt 2 cm vrij van de schampkanten (binnenkant
// op 8,5 m naast de as). De voegen van de klep zijn sleuven van 0,3 m in het
// wegdek, dunner dan de laag: ze zijn al leeg in de brug en horen bij de
// rijbaan.
const ABOVE = 1.0;
const STRIP_HALF = KERB.inner - 0.02;
const strip = loftX(
  stationsX(SOUTH_END - 0.5, NORTH_END + 0.5, 2).map((x) => {
    const zt = top(x);
    return { x, section: [[-STRIP_HALF, zt - LAYER], [STRIP_HALF, zt - LAYER], [STRIP_HALF, zt + ABOVE], [-STRIP_HALF, zt + ABOVE]] };
  }),
);
// De tuivlakken (plaat, ribben en vrije staven) en de achtertuien staan op het
// dek en blijven constructie: de hele strook van elk vlak in de laag, met 2 cm
// vrij. De achtertuien komen op het dek 8,9 m naast de as uit en steken met de
// plaat en de ribben in de rijbaan.
const sailGuards = [...mainSails, ...backSails].map((sail) => {
  const bb = sail.intersect(strip).boundingBox();
  return boxFromTo(bb.min[0] - 0.02, bb.max[0] + 0.02, bb.min[1] - 0.02, bb.max[1] + 0.02, BASE, 200);
});
const roadCut = strip.subtract(union(sailGuards));
const roadway = roadCut.intersect(bridge);
const structure = bridge.subtract(roadCut);
{
  // De onderdelen samen zijn de brug: de volumes tellen op, zonder overlap.
  const whole = bridge.volume();
  const sum = roadway.volume() + structure.volume();
  console.log("partitie (m3):", { brug: +whole.toFixed(2), rijbaan: +roadway.volume().toFixed(2), constructie: +structure.volume().toFixed(2), verschil: +(sum - whole).toFixed(4) });
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error(`partitie: ${sum} tegen ${whole}`);
  if (roadway.intersect(structure).volume() > 1e-3) throw new Error("rijbaan en constructie overlappen");
}
const parts = [
  ["building:eilandbrug", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
];

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant.
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
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  // In het model hangen alleen de onderkant van het dek (met de schuine
  // randen), de dwarsdrager en de bovenkant van de nissen vrij.
  const { area, found } = overhangs(bridge);
  const buckets = {};
  for (const { p, area: a } of found) {
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const ym = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const zt = top(xm);
    const key =
      zm > zt - DECK.depth - 0.05 && zm < zt + 0.01 && Math.abs(ym) <= DECK.half + 0.01
        ? "dek"
        : Math.abs(xm - beamX) <= CROSSBEAM.half + 0.01
          ? "dwarsdrager"
          : zm > zt + 0.01
            ? `boven het dek x ${xm.toFixed(0)} y ${ym.toFixed(0)} z ${zm.toFixed(0)}`
            : "nissen/pijlers";
    buckets[key] = (buckets[key] ?? 0) + a;
  }
  // Splinters van een paar cm2 waar ribben en plaat het dek raken tellen niet.
  const above = Object.entries(buckets).filter(([k, a]) => k.startsWith("boven") && a > 0.05);
  if (above.length) throw new Error(`overhang ${above.map(([k, a]) => `${k} (${a.toFixed(2)} m2)`).join(", ")}`);
  console.log("vrij hangend (m2):", Math.round(area), Object.fromEntries(Object.entries(buckets).map(([k, a]) => [k, Math.round(a)])));
  const print = overhangs(printModel);
  const big = print.found.filter(({ p }) => Math.min(...p.map((q) => q[2])) > 0.5);
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2));
  const notNiche = big.filter(({ p }) => {
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    return !(xm > X(bp.s0) - 0.5 && xm < X(rp.s1) + 0.5);
  });
  const rest = notNiche.reduce((sum, { area: a }) => sum + a, 0);
  if (rest > 1) {
    const where = notNiche.slice(0, 5).map(({ p }) => p[0].map((c) => +c.toFixed(1)));
    throw new Error(`printversie heeft overhang buiten de nissen (${rest.toFixed(2)} m2): ${JSON.stringify(where)}`);
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
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
report.pylon = {
  topNap: PYLON.topNap,
  topX: [+X(PYLON.south1).toFixed(2), +X(PYLON.north1).toFixed(2)],
  leanDeg: +((Math.atan((legCentre(PYLON.topNap) - legCentre(0)) / PYLON.topNap) * 180) / Math.PI).toFixed(1),
  legsAtDeck: +legT(18).toFixed(2),
  beamX: +beamX.toFixed(2),
};
report.stays = {
  mainOpenFootS: +mainOpenFoot.toFixed(1),
  backOpenFootS: +backOpenFoot.toFixed(1),
  main: mainFree.map(({ s, angle, free }) => `${s.toFixed(1)}:${angle.toFixed(0)}${free ? " vrij" : ""}`),
};
const glbFile = path.join(outDir, "eilandbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-eilandbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `eilandbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Eilandbrug Kampen 1:${scale} mm Z-up`);
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
// Maaiveldpunten op de IJssel 25 m naast de brug, aan beide zijden, bij de
// basculepijler, midden in de hoofdoverspanning en bij de pyloonkant.
const samplePoints = [-10, 60, 130].flatMap((s) => [
  [X(s), 25],
  [X(s), -25],
]);
await writeFile(
  path.join(outDir, "eilandbrug.json"),
  JSON.stringify(
    {
      name: "Eilandbrug",
      file: "eilandbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [186982.81, 510702.83],
      xAxis: [-0.13639, 0.99066],
      groundOffsetMetres: GROUND_OFFSET,
      // Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten: de
      // IJssel. Terugval als een uitsnede alleen een uiteinde van de brug raakt.
      groundHeight: 42.15,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van de brug midden tussen de twee landhoofden op de waterspiegel van de IJssel (z = 0, NAP -0,47 m zoals het PDOK-terrein het water legt) in de oorsprong, +X langs de brug naar het noorden (Ramspol, RD-richting 97,84 graden vanaf het oosten) en +Y naar het westen. Twee nodes: road:rijbaan, de bovenste 0,5 m van het dek tussen de schampkanten met de attributen van het BGT-wegdeel op de brug in extras.attributes (bgt_functie rijbaan autoweg, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het dek van 18,8 m breed van het zuidelijke landhoofd op de Kamper dijk (x = -209,9) tot het ankerblok op de noordelijke dijk (x = 209,9), met het wegdek op NAP +16,7 tot +18,5 m en een schampkant langs de randen; drie aanbruggen op wandpijlers over de zuidelijke uiterwaard; de basculepijler met de aandrijfcilinders, de stalen basculeklep van 20,5 m in gesloten stand en de steunpijler als portaal; de hoofdoverspanning van circa 150 m; de achterover hellende pyloon van twee poten met de kop tussen NAP +71 en +84 m en de top op NAP +90,7 m, met een dwarsdrager onder het dek; twee tuivlakken van elf tuien 3 m naast de as en vier achtertuien per vlak naar het ankerblok. De tuien zijn op 1:1000 dichte platen van 0,9 m met de tuien als ribben, de drie steilste vrijstaande staven van 1 m. De achteroverspanning heeft een pijler aan de dijkvoet. Leuningen, lantaarns, portalen met verkeerslichten, slagbomen, het remmingwerk en de open stand van de klep zijn weggelaten. Het maaiveld wordt op het water naast de brug bemonsterd; groundHeight is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NORTH_END - SOUTH_END).toFixed(1),
        deckWidthM: 2 * DECK.half,
        pylonTopNapM: PYLON.topNap,
        pylonLeanDeg: report.pylon.leanDeg,
        mainSpanM: +(legCentre(18) - REST_PIER.s1).toFixed(1),
        basculeLeafM: +(REST - HINGE).toFixed(2),
        stayFeetS: MAIN_FEET.map((s) => +s.toFixed(1)),
        backStayFeetS: BACK_FEET,
        deckNapM: { south: DECK_NAP[0], crest: Math.max(...DECK_NAP), north: DECK_NAP[DECK_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Eilandbrug_(Overijssel)",
        "PDOK BGT overbruggingsdeel (dek, landhoofd, pijlers, basculepijler, steunpijler, ankerblok), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de pyloon, de tuivlakken en de basculeklep",
        "PDOK luchtfoto (Actueel_orthoHR) voor de klep, de aandrijving en het ankerblok",
        "Wikimedia Commons: Eilandbrug (Overijssel) 02-03-2021 (actm.) 02, 08 en 09.jpg, Eilandbrug Kampen Panorama.jpg, Eilandbrug.jpg, 20140606 Eilandbrug bij Kampen.jpg, The new IJsselbridge near Kampen from the West at 31 Januari 2015 - panoramio.jpg, Artistic cable stayed bridge at Kampen North over the IJsselriver - panoramio.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

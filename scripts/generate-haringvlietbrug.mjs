// Genereert een vereenvoudigd, gesloten 3D-model van de Haringvlietbrug bij
// Numansdorp (A29, geopend op 20 juli 1964): de hele brug van het zuidelijke
// landhoofd op de Hellegatsdam (Hellegatsplein) tot het noordelijke landhoofd op
// de dijk van de Hoeksche Waard. Tien vaste velden van 106 m, elk een stalen
// kokerligger met een brede rijvloer op schuine schoren (in 1962-1963 als
// complete overspanningen van 106 m ingevaren, gebouwd door Kloos Kinderdijk en
// Penn & Bauduin), op negen gelijke rivierpijlers met een betonnen caisson en
// twee schachten; de rustpijler van de klep; de basculeklep van 38 m in gesloten
// stand; de basculekelder met de toren van het bedieningsgebouw; en het
// noordelijke veld van 81 m naar de oever. Alle maten in het script zijn meters
// op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel
// met de materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal> met een printvoet
// onder het dek. De brug is 1228 m lang en past op 1:1000 niet in 400 mm,
// vandaar standaard 1:3500 (351 mm).
//
//   node scripts/generate-haringvlietbrug.mjs              # 1:3500 (standaard)
//   node scripts/generate-haringvlietbrug.mjs --scale 2500
//
// Assenstelsel: oorsprong op de as van het dek in het hart van de middelste
// (zesde) rivierpijler (RD 86831,685, 414573,372), op de waterspiegel van het
// Haringvliet (NAP +0,7 m: het PDOK-terrein legt het water op ellipsoïdisch
// 44,52 tot 44,56 m, en ligt op de wegen bij de landhoofden 43,85 m boven het
// AHN), Z omhoog, z = NAP - 0,7. +X loopt langs de brug naar het
// noordnoordoosten (Numansdorp; RD-richting 68,01 graden vanaf het oosten), +Y
// naar het westnoordwesten (het Haringvliet, zeewaarts). Het zuidelijke
// landhoofd ligt op x = -648,2 tot -636,8, de rivierpijlers op x = -530,65 tot
// 424,52 om de 106,13 m, de klep van x = 425,4 tot 463,5, de basculekelder van
// 463,5 tot 487,9 en het noordelijke landhoofd van 569,1 tot 580,2.
//
// Bronnen: BGT overbruggingsdeel (dekranden 25,6 m uit elkaar; het zuidelijke
// landhoofd; tien pijlercaissons van 3,5 m breed met ronde koppen, 24,6 m lang
// en bij de rustpijler van de klep 31,4 m; de basculekelder van 24,4 × 27,9 m
// met de uitbouw van de toren; het noordelijke landhoofd); BAG-pand
// 0611100000614366 (de toren van het bedieningsgebouw, 7,0 × 4,5 m); BGT-wegdelen
// voor de indeling van het dek (twee rijbanen autosnelweg met een middenberm en
// aan de oostkant een rijbaan lokale weg); AHN DSM 0,5 m (PDOK WCS) voor het
// lengteprofiel van het wegdek (NAP +14,3 m bij het Hellegatsplein, +19,4 m in
// het midden, +13,6 m bij Numansdorp), de koppen van de rustpijler (NAP +6,0 m)
// en de toren met de bedieningscabine (dak NAP +23,35 m, cabine 8,6 × 5,4 m);
// PDOK-terrein voor de waterspiegel; Wikipedia (nl) voor lengte (1220 m),
// breedte (26 m), doorvaarthoogtes (vast NAP +10,7 tot +13,89 m, klep +9,88 m)
// en de doorvaartbreedte van de klep (35 m); Nationaal Archief / Anefo-foto's
// van de bouw (1962) voor de doorsnede: een kokerligger met verticale lijven,
// schuine schoren onder de uitkraging en overspanningen van 106 m; Wikimedia
// Commons-foto's voor de pijlers (caisson met twee verlopende schachten), de
// kelder (betonnen plint, metselwerk met verdiepte vakken, sleuven voor de
// hoofdliggers van de klep), de toren (witte schacht met een cabine die
// uitkraagt) en de klep (twee hoofdliggers).
// Geschat: de kokerbreedte (11,8 m), de constructiehoogte (5,6 m onder het
// wegdek, uit de doorvaarthoogtes), de aansluiting van de schoren (4,6 m onder
// het wegdek), de caissons van de rivierpijlers tot NAP +6,0 m zoals de
// rustpijler, de maten van de
// schachten, de hoofdliggers van de klep (2 m breed, 4,0 m diep aan de punt en
// 5,6 m bij het draaipunt), de vakken en de plint van de kelder, de hoogte van
// de cabine (3,0 m) en de schampkanten en geleiderails als stroken van 0,9 m.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "3500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "haringvlietbrug");
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
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
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
  if (solid.volume() <= 0) throw new Error("loft: omgekeerde doorsnede");
  return solid;
}
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};
const lerp = (a, b, t) => a + (b - a) * t;
// Stadionvorm (rechthoek met halfronde koppen in de Y-richting) in het vlak.
function stadium(xc, halfX, y0, y1, segments = 12) {
  const pts = [];
  for (let k = 0; k <= segments; k++) {
    const a = Math.PI + (Math.PI * k) / segments; // onderste kop
    pts.push([xc + halfX * Math.cos(a), y0 + halfX + halfX * Math.sin(a)]);
  }
  for (let k = 0; k <= segments; k++) {
    const a = (Math.PI * k) / segments; // bovenste kop
    pts.push([xc + halfX * Math.cos(a), y1 - halfX + halfX * Math.sin(a)]);
  }
  return pts;
}

// ---------- hoofdmaten ----------
const WATER_NAP = 0.7;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten op het water
// (44,04 tot 44,15 m in de noordelijke velden, 44,41 tot 44,60 m in de zuidelijke).
const GROUND_HEIGHT = 44.04;

const SOUTH_END = -648.2; // achterkant zuidelijk landhoofd (BGT)
const SOUTH_FACE = -636.8; // voorzijde zuidelijk landhoofd (BGT)
const SPAN = 106.13; // tien gelijke velden van het landhoofd tot de rustpijler (BGT: 104,1 tot 108,0)
const PIERS = Array.from({ length: 10 }, (_, k) => SOUTH_FACE + SPAN * (k + 1)); // P1..P10, P6 op x = 0
const REST_PIER = PIERS[9]; // rustpijler van de klep, x = 424,52
const LEAF = { x0: 425.4, x1: 463.5 }; // basculeklep, gesloten (punt op de rustpijler)
const KELDER = { x0: 463.5, x1: 487.9, y0: -13.9, y1: 14.0 }; // basculekelder (BGT)
const NORTH_FACE = 569.1; // voorzijde noordelijk landhoofd (BGT)
const NORTH_END = 580.2; // einde van het dek (BGT)

// Wegdek in NAP-meters om de 10 m vanaf x = -650: 35e percentiel van het
// AHN-DSM over |y| < 9 m en 10 m langs de as, gemiddeld over 50 m (verkeer en
// lantaarns vallen zo weg).
const DECK_X0 = -650;
const DECK_STEP = 10;
const DECK_NAP = [
  14.28, 14.37, 14.49, 14.63, 14.78, 14.93, 15.09, 15.24, 15.40, 15.57, 15.74, 15.90, 16.05, 16.20, 16.33, 16.46,
  16.59, 16.72, 16.84, 16.97, 17.09, 17.22, 17.33, 17.44, 17.54, 17.63, 17.72, 17.81, 17.90, 17.99, 18.09, 18.19,
  18.28, 18.37, 18.45, 18.52, 18.59, 18.65, 18.71, 18.77, 18.84, 18.91, 18.98, 19.03, 19.08, 19.12, 19.15, 19.18,
  19.21, 19.24, 19.28, 19.31, 19.35, 19.38, 19.41, 19.42, 19.43, 19.43, 19.43, 19.43, 19.43, 19.43, 19.44, 19.43,
  19.43, 19.41, 19.39, 19.36, 19.33, 19.30, 19.26, 19.23, 19.21, 19.18, 19.15, 19.12, 19.07, 19.02, 18.96, 18.90,
  18.83, 18.76, 18.70, 18.63, 18.57, 18.50, 18.43, 18.35, 18.27, 18.18, 18.09, 18.00, 17.91, 17.82, 17.72, 17.63,
  17.52, 17.41, 17.30, 17.18, 17.05, 16.93, 16.80, 16.67, 16.55, 16.42, 16.28, 16.15, 16.00, 15.85, 15.70, 15.54,
  15.39, 15.23, 15.07, 14.91, 14.74, 14.57, 14.40, 14.23, 14.06, 13.88, 13.74, 13.64,
];
function road(x) {
  const f = Math.min(Math.max((x - DECK_X0) / DECK_STEP, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  return Z(lerp(DECK_NAP[i], DECK_NAP[i + 1], f - i));
}

// Doorsnede van de vaste velden (Anefo-foto's van de bouw, maten geschat): een
// stalen koker van 11,8 m breed met verticale lijven en een onderkant 5,6 m
// onder het wegdek (uit de doorvaarthoogtes: wegdek NAP +19,4 m, doorvaart
// +13,89 m), daarboven de rijvloer van 25,6 m (BGT) met een randbalk van 1,0 m,
// gedragen door schuine schoren die 4,6 m onder het wegdek op de lijven
// aansluiten. Op 1:1000 zijn de schoren niet los te printen: het vlak van de
// schoren is een dichte plaat (vakwerk als dichte band).
const HALF = 12.8; // halve breedte van het dek (BGT)
const DECK = { slab: 1.0, boxHalf: 5.9, depth: 5.6, strutRoot: 4.6 };
// Schampkanten in plaats van de leuningen: 0,9 m breed en 0,6 m hoog; de
// geleiderails in de middenberm en tussen de rijbaan lokale weg en de
// snelweg als stroken van 0,9 m breed en 0,5 m hoog (BGT-bermen van 0,7 tot
// 0,8 m, op 1:1000 verbreed).
const KERB = { width: 0.9, height: 0.6 };
const RIDGES = [
  { y0: 2.6, y1: 3.5, height: 0.5 }, // middenberm
  { y0: -6.65, y1: -5.75, height: 0.5 }, // tussen lokale weg en snelweg
];

// Rivierpijlers (BGT): caisson van 3,5 m breed met halfronde koppen, 24,6 m
// lang (rustpijler 31,4 m), tot NAP +6,0 m (AHN op de koppen van de
// rustpijler naast het dek; de andere caissons liggen onder het dek en hebben
// op de foto's dezelfde verhouding caisson : schacht). Daarop twee schachten onder de lijven van de koker, die
// verlopen van 3,0 × 3,6 m tot 2,4 × 3,0 m (foto's), tot de onderkant van de
// koker. De rustpijler draagt boven het caisson een betonnen wand van 3,5 m
// dik en 22 m breed tot onder de rijvloer, waar de koker van het laatste veld
// en de punt van de klep op rusten.
const CAISSON = { half: 1.75, y0: -12.3, y1: 12.3, topNap: 6.0 };
const REST_CAISSON = { y0: -15.7, y1: 15.7, topNap: 6.0 };
const SHAFT = { y: 4.4, bottom: [3.0, 3.6], top: [2.4, 3.0] };
const REST_WALL = { half: 1.75, halfY: 11.0 };

// Basculeklep (gesloten): rijvloer van 1,0 m, twee hoofdliggers van 2,0 m
// breed op 5,0 tot 7,0 m uit de as (foto van de open klep), 4,0 m diep aan de
// punt en 5,6 m bij het draaipunt (doorvaarthoogte NAP +9,88 m), met tussen de
// hoofdliggers dwarsdragers tot 1,8 m onder het wegdek.
const LEAF_GIRDER = { y0: 5.0, y1: 7.0, tipDepth: 4.0, hingeDepth: 5.6, crossDepth: 1.8 };
// Voegen van de klep: sleuven over het wegdek bij de punt en het draaipunt.
const JOINT = { width: 0.4, depth: 0.3 };

// Basculekelder (BGT 24,4 × 27,9 m) tot onder de rijvloer, met een betonnen
// plint die 0,8 m uitsteekt tot NAP +2,5 m; in de oost- en westgevel vijf
// verdiepte vakken metselwerk van 0,35 m tussen penanten van 1,2 m, van NAP
// +4,5 m tot 2,5 m onder het wegdek (foto's); in de zuidgevel twee sleuven van
// 2,4 m breed en 0,4 m diep onder de hoofdliggers van de klep.
const PLINTH = { grow: 0.8, topNap: 2.5 };
const PANELS = { count: 5, pier: 1.2, bottomNap: 4.5, topDrop: 2.5, depth: 0.35 };
const SLOTS = { width: 2.4, depth: 0.4, bottomNap: 4.0 };
// Toren van het bedieningsgebouw (BAG 0611100000614366, 7,0 × 4,5 m) aan de
// zuidoosthoek van de kelder, met de bedieningscabine van 8,6 × 5,4 m (AHN)
// en 3,0 m hoog onder het dak op NAP +23,35 m (AHN), op een schuine kraag van
// 45 graden; rond de cabine een raamband als nis van 0,35 m.
const TOWER = { x0: 463.44, x1: 470.51, y0: -17.62, y1: -13.03 };
const CABIN = { x0: 462.6, x1: 471.2, y0: -18.2, y1: -12.8, topNap: 23.35, height: 3.0, band: [0.6, 2.4] };

// ---------- dek ----------
const STEP = 2;
const slabStations = stationsX(SOUTH_END, NORTH_END, STEP);
// Rijvloer over de hele lengte.
const slab = loftX(
  slabStations.map((x) => {
    const D = road(x);
    return { x, section: [[-HALF, D - DECK.slab], [HALF, D - DECK.slab], [HALF, D], [-HALF, D]] };
  }),
);
// Kokerligger met het vlak van de schoren, per veldgroep.
function girder(x0, x1) {
  const xs = stationsX(x0, x1, STEP);
  const struts = loftX(
    xs.map((x) => {
      const D = road(x);
      return {
        x,
        section: [
          [-DECK.boxHalf, D - DECK.strutRoot],
          [DECK.boxHalf, D - DECK.strutRoot],
          [HALF, D - DECK.slab],
          [HALF, D - DECK.slab + 0.1],
          [-HALF, D - DECK.slab + 0.1],
          [-HALF, D - DECK.slab],
        ],
      };
    }),
  );
  const box = loftX(
    xs.map((x) => {
      const D = road(x);
      return {
        x,
        section: [
          [-DECK.boxHalf, D - DECK.depth],
          [DECK.boxHalf, D - DECK.depth],
          [DECK.boxHalf, D - DECK.strutRoot + 0.1],
          [-DECK.boxHalf, D - DECK.strutRoot + 0.1],
        ],
      };
    }),
  );
  return union([struts, box]);
}
const girders = [girder(SOUTH_FACE, REST_PIER), girder(KELDER.x1 - 0.01, NORTH_FACE)];
// De schoren zelf: onder het vlak van de schoren om de 6,63 m (zestien vakken
// per veld, Anefo-foto's) een rib van 0,9 m breed die 0,4 m onder het vlak
// uitsteekt, aan beide zijden. Zo staat het ritme van de schoren en lijfverstijvers
// dat op de foto's de ligger tekent ook in het model.
const STRUT = { width: 0.9, drop: 0.4, perSpan: 16 };
const strutXs = [
  ...Array.from({ length: 10 }, (_, s) =>
    Array.from({ length: STRUT.perSpan - 1 }, (_, k) => SOUTH_FACE + SPAN * s + (SPAN * (k + 1)) / STRUT.perSpan),
  ).flat(),
  ...Array.from({ length: 11 }, (_, k) => KELDER.x1 + ((NORTH_FACE - KELDER.x1) * (k + 1)) / 13),
];
const struts = strutXs.flatMap((xc) =>
  [-1, 1].map((s) =>
    loftX(
      [xc - STRUT.width / 2, xc + STRUT.width / 2].map((x) => {
        const D = road(x);
        const root = [DECK.boxHalf - 0.05, D - DECK.strutRoot];
        const tip = [HALF - 1.0, D - DECK.slab - (1.0 * (DECK.strutRoot - DECK.slab)) / (HALF - DECK.boxHalf)];
        const pts = [
          [root[0], root[1] - STRUT.drop],
          [tip[0], tip[1] - STRUT.drop],
          [tip[0], tip[1] + 0.05],
          [root[0], root[1] + 0.05],
        ].map(([y, z]) => [s * y, z]);
        return { x, section: s > 0 ? pts : [...pts].reverse() };
      }),
    ),
  ),
);

// Schampkant langs een rand (side -1 oost, +1 west) tussen x0 en x1, met
// `margin` rondom groter: de vrije ruimte die de wegdelen eromheen houden.
function edgeStrip(x0, x1, y0, y1, height, margin = 0) {
  return loftX(
    stationsX(x0, x1, STEP).map((x) => {
      const zt = road(x);
      const a = y0 - margin;
      const b = y1 + margin;
      return { x, section: [[a, zt - 0.3 - margin], [b, zt - 0.3 - margin], [b, zt + height + margin], [a, zt + height + margin]] };
    }),
  );
}
const STRIPS = [
  [SOUTH_END, NORTH_END, -HALF, -HALF + KERB.width, KERB.height],
  [SOUTH_END, NORTH_END, HALF - KERB.width, HALF, KERB.height],
  ...RIDGES.flatMap(({ y0, y1, height }) => [
    [SOUTH_END, LEAF.x0 - 0.6, y0, y1, height],
    [KELDER.x1, NORTH_END, y0, y1, height],
  ]),
];
const strips = STRIPS.map(([x0, x1, y0, y1, h]) => edgeStrip(x0, x1, y0, y1, h));
const joints = [LEAF.x0, LEAF.x1].map((x) =>
  boxFromTo(x - JOINT.width / 2, x + JOINT.width / 2, -HALF + KERB.width + 0.05, HALF - KERB.width - 0.05, road(x) - JOINT.depth, road(x) + 1),
);

// ---------- landhoofden ----------
const abutment = (x0, x1) =>
  loftX(
    stationsX(x0, x1, STEP).map((x) => {
      const D = road(x);
      return { x, section: [[-HALF, BASE], [HALF, BASE], [HALF, D - DECK.slab + 0.05], [-HALF, D - DECK.slab + 0.05]] };
    }),
  );
const abutments = [abutment(SOUTH_END, SOUTH_FACE + 0.01), abutment(NORTH_FACE - 0.01, NORTH_END)];

// ---------- pijlers ----------
function shaft(xc, yc, zTop, zBottom) {
  const [bx, by] = SHAFT.bottom;
  const [tx, ty] = SHAFT.top;
  return Manifold.extrude([[[-bx / 2, -by / 2], [bx / 2, -by / 2], [bx / 2, by / 2], [-bx / 2, by / 2]]], zTop - zBottom, 0, 0, [
    tx / bx,
    ty / by,
  ]).translate([xc, yc, zBottom]);
}
const riverPiers = PIERS.slice(0, 9).flatMap((xc) => {
  const capTop = Z(CAISSON.topNap);
  const caisson = prism(stadium(xc, CAISSON.half, CAISSON.y0, CAISSON.y1), BASE, capTop);
  const top = road(xc) - DECK.depth + 0.05;
  return [caisson, shaft(xc, -SHAFT.y, top, capTop - 0.05), shaft(xc, SHAFT.y, top, capTop - 0.05)];
});
const restPier = union([
  prism(stadium(REST_PIER, CAISSON.half, REST_CAISSON.y0, REST_CAISSON.y1), BASE, Z(REST_CAISSON.topNap)),
  loftX(
    stationsX(REST_PIER - REST_WALL.half, REST_PIER + REST_WALL.half, 0.5).map((x) => ({
      x,
      section: [
        [-REST_WALL.halfY, Z(REST_CAISSON.topNap) - 0.05],
        [REST_WALL.halfY, Z(REST_CAISSON.topNap) - 0.05],
        [REST_WALL.halfY, road(x) - DECK.slab + 0.05],
        [-REST_WALL.halfY, road(x) - DECK.slab + 0.05],
      ],
    })),
  ),
]);

// ---------- basculeklep ----------
const leafXs = stationsX(LEAF.x0 - 0.9, LEAF.x1 + 0.01, 1);
const leafDepth = (x) => lerp(LEAF_GIRDER.tipDepth, LEAF_GIRDER.hingeDepth, Math.min(Math.max((x - LEAF.x0) / (LEAF.x1 - LEAF.x0), 0), 1));
const leafGirders = [-1, 1].map((s) =>
  loftX(
    leafXs.map((x) => {
      const D = road(x);
      const [a, b] = s > 0 ? [LEAF_GIRDER.y0, LEAF_GIRDER.y1] : [-LEAF_GIRDER.y1, -LEAF_GIRDER.y0];
      return { x, section: [[a, D - leafDepth(x)], [b, D - leafDepth(x)], [b, D - DECK.slab + 0.05], [a, D - DECK.slab + 0.05]] };
    }),
  ),
);
const leafCross = loftX(
  leafXs.map((x) => {
    const D = road(x);
    const h = LEAF_GIRDER.y0 + 0.05;
    return { x, section: [[-h, D - LEAF_GIRDER.crossDepth], [h, D - LEAF_GIRDER.crossDepth], [h, D - DECK.slab + 0.05], [-h, D - DECK.slab + 0.05]] };
  }),
);

// ---------- basculekelder en bedieningsgebouw ----------
// Tussen de onderkant van de rijvloer en die van het wegdek, zodat geen vlak
// van de kelder samenvalt met de rijvloer of met de wegdeklaag.
const kelderTop = Math.min(road(KELDER.x0), road(KELDER.x1)) - 0.55;
if (Math.max(road(KELDER.x0), road(KELDER.x1)) - DECK.slab > kelderTop - 0.03) throw new Error("kelderdak valt samen met de rijvloer");
const kelderRing = [
  [KELDER.x0, KELDER.y0],
  [KELDER.x1, KELDER.y0],
  [KELDER.x1, KELDER.y1],
  [KELDER.x0, KELDER.y1],
];
const kelderBlock = prism(kelderRing, BASE, kelderTop);
const plinth = Manifold.extrude(
  new CrossSection([ccw(kelderRing)]).offset(PLINTH.grow, "Miter", 2),
  Z(PLINTH.topNap) - BASE,
).translate([0, 0, BASE]);
const tower = boxFromTo(TOWER.x0, TOWER.x1, TOWER.y0, TOWER.y1, BASE, Z(CABIN.topNap) - 0.5);
const cabinBottom = Z(CABIN.topNap) - CABIN.height;
const cabin = boxFromTo(CABIN.x0, CABIN.x1, CABIN.y0, CABIN.y1, cabinBottom, Z(CABIN.topNap));
// Kraag van 45 graden van de schacht naar de onderkant van de cabine.
const corbelGrow = Math.max(TOWER.x0 - CABIN.x0, CABIN.x1 - TOWER.x1, TOWER.y0 - CABIN.y0, CABIN.y1 - TOWER.y1);
const corbel = Manifold.hull([
  boxFromTo(TOWER.x0, TOWER.x1, TOWER.y0, TOWER.y1, cabinBottom - corbelGrow - 0.01, cabinBottom - corbelGrow),
  boxFromTo(
    Math.max(CABIN.x0, TOWER.x0 - corbelGrow),
    Math.min(CABIN.x1, TOWER.x1 + corbelGrow),
    Math.max(CABIN.y0, TOWER.y0 - corbelGrow),
    Math.min(CABIN.y1, TOWER.y1 + corbelGrow),
    cabinBottom,
    cabinBottom + 0.01,
  ),
]);
const [band0, band1] = CABIN.band.map((d) => cabinBottom + d);
const cabinBand = union([
  boxFromTo(CABIN.x0 - 0.5, CABIN.x0 + 0.35, CABIN.y0 + 0.9, CABIN.y1 - 0.9, band0, band1),
  boxFromTo(CABIN.x1 - 0.35, CABIN.x1 + 0.5, CABIN.y0 + 0.9, CABIN.y1 - 0.9, band0, band1),
  boxFromTo(CABIN.x0 + 0.9, CABIN.x1 - 0.9, CABIN.y0 - 0.5, CABIN.y0 + 0.35, band0, band1),
  boxFromTo(CABIN.x0 + 0.9, CABIN.x1 - 0.9, CABIN.y1 - 0.35, CABIN.y1 + 0.5, band0, band1),
]);
// Verdiepte vakken in de oost- en westgevel.
const panelWidth = (KELDER.x1 - KELDER.x0 - (PANELS.count + 1) * PANELS.pier) / PANELS.count;
const panelTop = Math.min(road(KELDER.x0), road(KELDER.x1)) - PANELS.topDrop;
const panels = union(
  Array.from({ length: PANELS.count }, (_, k) => {
    const x0 = KELDER.x0 + PANELS.pier + k * (panelWidth + PANELS.pier);
    return [
      boxFromTo(x0, x0 + panelWidth, KELDER.y1 - PANELS.depth, KELDER.y1 + 1, Z(PANELS.bottomNap), panelTop),
      // De oostgevel heeft de toren op de zuidhoek: daar geen vak.
      ...(x0 < TOWER.x1 + 0.9 ? [] : [boxFromTo(x0, x0 + panelWidth, KELDER.y0 - 1, KELDER.y0 + PANELS.depth, Z(PANELS.bottomNap), panelTop)]),
    ];
  }).flat(),
);
const slotTop = road(LEAF.x1) - LEAF_GIRDER.hingeDepth;
const slots = union(
  [-1, 1].map((s) => {
    const yc = s * (LEAF_GIRDER.y0 + LEAF_GIRDER.y1) / 2;
    return boxFromTo(KELDER.x0 - 1, KELDER.x0 + SLOTS.depth, yc - SLOTS.width / 2, yc + SLOTS.width / 2, Z(SLOTS.bottomNap), slotTop);
  }),
);
const kelder = union([kelderBlock, plinth, tower, corbel, cabin]).subtract(union([cabinBand, panels, slots]));

const bridge = union([
  slab,
  ...girders,
  ...struts,
  ...strips,
  ...abutments,
  ...riverPiers,
  restPier,
  ...leafGirders,
  leafCross,
  kelder,
]).subtract(union(joints));

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij en het vlak van de schoren helt maar 26
// graden. Net als de overhangopvulling van de export krijgt de STL onder de
// dekrand een wig van 50 graden die uitloopt in een scherm tot de onderplaat
// (minstens 0,9 m, op grove schaal 1 mm breed).
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.5 * scale) / 1000);
function footSection(zb, w) {
  const s = Math.min(SCREEN, w - 0.05);
  const zs = zb - KNEE * (w - s);
  if (zs > BASE + 0.05) return [[-s, BASE], [s, BASE], [s, zs], [w, zb], [-w, zb], [-s, zs]];
  const a = w - (zb - BASE) / KNEE;
  return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
}
const printFoot = loftX(
  stationsX(SOUTH_FACE + 0.5, NORTH_FACE - 0.5, 1).map((x) => ({ x, section: footSection(road(x) - DECK.slab + 0.003, HALF + 0.003) })),
);
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
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const [x, y, z] = [0, 1, 2].map((a) => (p[0][a] + p[1][a] + p[2][a]) / 3);
    const D = road(x);
    let kind = "overig";
    if (x > KELDER.x0 - 1.1 && x < KELDER.x1 + 1.1 && Math.abs(y) > HALF + 0.01) kind = "kelder en toren";
    else if (z > D + 0.05) kind = "boven het dek";
    else if (x > KELDER.x0 - 1.1 && x < KELDER.x1 + 1.1 && z < D - 1.5) kind = "kelder en toren";
    else if (x > LEAF.x0 - 1 && x < LEAF.x1 + 0.1) kind = "klep";
    else if (z > D - DECK.slab - 0.2) kind = "rijvloer";
    else if (z > D - DECK.depth - 0.2) kind = "koker en schoren";
    else kind = "pijlers";
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
if ((modelOverhang["boven het dek"] ?? 0) > 0.5) throw new Error("overhang boven het dek");

// ---------- rijbanen als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is een eigen node met de attributen van het
// BGT-wegdeel eronder (glTF `extras.attributes`), zodat de kleurregels van een
// thema op het brugdek werken zoals op de PDOK-wegdelen ernaast. Op het dek
// liggen BGT-wegdelen met relatieve hoogteligging 1 (lokale coördinaten,
// rechte banden; de randen wijken minder dan 5 cm af), alle gesloten
// verharding zonder plus_fysiek_voorkomen. Actueel, van x = -636,7 tot 217,3:
//   rijbaan autosnelweg, oostelijke rijbaan (y = -5,9 tot 2,7):
//     L0002.298fef633fc54846b4e289a2ca29ce58, L0002.d5003a7c5f1848e9abcbd387b023bf44,
//     L0002.d4a0f4dfc13944e89619a7286b3395ba;
//   rijbaan autosnelweg, westelijke rijbaan (y = 3,3 tot 11,9):
//     L0002.13cc667e6d9840b0b065c79ffcd5d9c7, L0002.a70e56148fe34fc09173f9449f76ce23,
//     L0002.71f74910edb344a7ad0d673f27b34490;
//   rijbaan lokale weg aan de oostkant (y = -11,7 tot -6,6):
//     L0002.724125374ffa424c8624a09ca20afdac, L0002.3906f22442b443c884ba390a36b4dcd7,
//     L0002.36353446a1b044688e3ebb8540bba5e3 (plus een strook van 1,1 m onder de
//     oostelijke schampkant, L0002.33ba3c70a9e548bdb086b5db89327b54).
// Ten noorden van x = 217,3 heeft de BGT op dit moment geen actuele wegdelen op
// het dek: de laatste versies zijn op 4 juni 2025 beëindigd zonder opvolger.
// Daar gelden die laatste versies, met dezelfde indeling:
//   217,2 tot 424,4: rijbaan autosnelweg L0002.a1887637064d403888c37f474a496ef2
//     en L0002.2b169b2ed1304982b5e27d323322af26, rijbaan lokale weg
//     L0002.729a44fee26e40a2854b437f8f521422;
//   klep (424,3 tot 463,5): rijbaan lokale weg L0002.5927e7146492477cbb32e681f3d65659
//     (y = -11,7 tot -5,2) en rijbaan autosnelweg L0002.7bd6ef584bf7428db0c5ba7ece8f5022
//     (y = -5,2 tot 12,0), zonder bermen;
//   kelder (463,8 tot 487,7): rijbaan autosnelweg L0002.3a49898dcddb4307a8ca9d6e134317a7
//     over de hele breedte (een voetpad van 0,2 m, L0002.77b1de4ec7a54898a4245bfc07bf0d4e,
//     valt onder de schampkant);
//   noordelijk veld (487,7 tot 569,1): rijbaan autosnelweg
//     L0002.8ecb68d03ca148eda9f5da5e0cbd235c en L0002.35762d8af20845e2a978ceb0613f59f3,
//     rijbaan lokale weg L0002.dc7a7658f91d4ca1887663df081c99a9.
// Op de landhoofden (relatieve hoogteligging 0) liggen dezelfde functies:
// rijbaan autosnelweg L0002.db4f6e6dbe5a44e3a901bef5191a337e en rijbaan lokale
// weg G1924.8abeacd5439b75760000000a0219ace0 (zuid), rijbaan autosnelweg
// L0002.8abeacd54afb7500047bb9e21bef2291 en rijbaan lokale weg
// G1963.9f777798457446d7952bfadf7382f876 (noord). De bermen (BGT ondersteunend
// wegdeel, berm gesloten verharding) zijn de schampkanten en de geleiderails en
// blijven constructie.
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan autosnelweg", bgt_fysiekvoorkomen: "gesloten verharding" };
const LOCAL_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding" };
// Banden met de functie rijbaan lokale weg [x0, x1, y0, y1]; tot in de
// schampkant en de geleiderail doorgetrokken, die er met hun vrije ruimte
// weer uit vallen. De rest van het dek tussen de schampkanten is rijbaan
// autosnelweg.
const WEGDELEN = {
  lokaal: [
    // L0002.724125374ffa424c8624a09ca20afdac, L0002.3906f22442b443c884ba390a36b4dcd7,
    // L0002.36353446a1b044688e3ebb8540bba5e3, L0002.729a44fee26e40a2854b437f8f521422
    // en G1924.8abeacd5439b75760000000a0219ace0 op het landhoofd
    [SOUTH_END - 1, LEAF.x0, -HALF - 1, -6.2],
    // L0002.5927e7146492477cbb32e681f3d65659 op de klep
    [LEAF.x0, LEAF.x1, -HALF - 1, -5.2],
    // L0002.dc7a7658f91d4ca1887663df081c99a9 en G1963.9f777798457446d7952bfadf7382f876
    [KELDER.x1, NORTH_END + 1, -HALF - 1, -6.2],
  ],
};
const layerXs = [SOUTH_END - 0.1, ...slabStations.slice(1, -1), NORTH_END + 0.1];
const layer = loftX(
  layerXs.map((x) => {
    const zt = road(Math.min(Math.max(x, SOUTH_END), NORTH_END));
    const h = HALF - KERB.width;
    return { x, section: [[-h, zt - LAYER], [h, zt - LAYER], [h, zt + ABOVE], [-h, zt + ABOVE]] };
  }),
);
// Rond de schampkanten, de geleiderails en de voegen 2 cm vrij.
const guards = union([
  ...STRIPS.map(([x0, x1, y0, y1, h]) => edgeStrip(x0 - (x0 === SOUTH_END ? 0.5 : 0.02), x1 + (x1 === NORTH_END ? 0.5 : 0.02), y0, y1, h, 0.02)),
  ...[LEAF.x0, LEAF.x1].map((x) => boxFromTo(x - JOINT.width / 2 - 0.02, x + JOINT.width / 2 + 0.02, -HALF, HALF, road(x) - 2, road(x) + 2)),
]);
const localBands = union(WEGDELEN.lokaal.map(([x0, x1, y0, y1]) => boxFromTo(x0, x1, y0, y1, -10, 60)));
const strip = layer.subtract(guards);
const roadCut = strip.subtract(localBands);
const localCut = strip.intersect(localBands);
const roadway = roadCut.intersect(bridge);
const localway = localCut.intersect(bridge);
const structure = bridge.subtract(union([roadCut, localCut]));
const parts = [
  ["building:haringvlietbrug", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:rijbaan-lokaal", localway, LOCAL_ATTRIBUTES],
];
const partition = {
  bridgeM3: +bridge.volume().toFixed(2),
  partsM3: +parts.reduce((s, [, solid]) => s + solid.volume(), 0).toFixed(2),
};
partition.diffM3 = +(partition.partsM3 - partition.bridgeM3).toFixed(4);
console.log("volumes (m3):", partition);
if (Math.abs(partition.diffM3) > 1e-4 * partition.bridgeM3) throw new Error("onderdelen tellen niet op tot de brug");
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);

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
report.piers = PIERS.map((x) => ({ x: +x.toFixed(2), deckNap: +(road(x) + WATER_NAP).toFixed(2), girderBottomNap: +(road(x) - DECK.depth + WATER_NAP).toFixed(2) }));
const glbFile = path.join(outDir, "haringvlietbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-haringvlietbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, kelder, landhoofden en printvoet
// op het printbed.
const stlName = `haringvlietbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Haringvlietbrug 1:${scale} mm Z-up`);
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
// Maaiveldpunten op het water, 25 m naast de as, midden in zeven velden.
const SAMPLE_X = [-583.7, -371.5, -159.2, 53.1, 265.3, 444.5, 515.0];
const samplePoints = SAMPLE_X.flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "haringvlietbrug.json"),
  JSON.stringify(
    {
      name: "Haringvlietbrug",
      file: "haringvlietbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [86831.685, 414573.372],
      xAxis: [0.37436, 0.92728],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      // Op het water van het Haringvliet, midden in de velden.
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0611100000614366"],
      replacesTerrain: [
        "L0002.04a62049f34f48a9b66a6578f5b6c5e8",
        "L0002.1a7c684d752c497693558d88183db533",
        "L0002.4c0c7988ff0e473caefa89b415640f35",
        "L0002.b751cc2128a543a1a326a8fc3be4893a",
        "L0002.d9943b6617f64842863cf22e5d5515e5",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek in het hart van de middelste (zesde) rivierpijler op de waterspiegel van het Haringvliet (z = 0, NAP +0,7 m) in de oorsprong, +X langs de brug naar het noordnoordoosten (Numansdorp, RD-richting 68,01 graden vanaf het oosten) en +Y naar het westnoordwesten (het Haringvliet). Drie nodes: road:rijbaan en road:rijbaan-lokaal, de bovenste 0,5 m van het dek tussen de schampkanten met de attributen van de BGT-wegdelen in extras.attributes (bgt_functie rijbaan autosnelweg of rijbaan lokale weg, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van de A29-brug van het zuidelijke landhoofd op de Hellegatsdam (x = -648,2) tot het noordelijke op de dijk bij Numansdorp (x = 580,2). Tien vaste velden van 106,13 m als stalen kokerligger van 11,8 m breed met de rijvloer van 25,6 m op schuine schoren (als dichte plaat), de onderkant 5,6 m onder het wegdek; negen rivierpijlers met een caisson van 3,5 × 24,6 m met ronde koppen tot NAP +6,0 m en twee verlopende schachten; de rustpijler van de klep met een caisson van 31,4 m tot NAP +6,0 m en een wand tot onder de rijvloer; de basculeklep van 38,1 m in gesloten stand met twee hoofdliggers en voegen; de basculekelder van 24,4 × 27,9 m met plint, verdiepte vakken en sleuven voor de hoofdliggers; de toren van het bedieningsgebouw (BAG-pand) met de cabine op een kraag van 45 graden tot NAP +23,35 m; het noordelijke veld van 81,2 m; de landhoofden. Het wegdek ligt op NAP +14,3 m bij het Hellegatsplein, +19,4 m in het midden en +13,6 m bij Numansdorp (AHN). Schampkanten en geleiderails als stroken. Lantaarns, portalen, slagbomen, seinen, de gele werkbordessen bij de klep, het remmingwerk en de dukdalven en de open stand van de klep zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water bemonsterd; groundHeight is de laagste PDOK-waterhoogte (ellipsoïdisch) op die punten. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NORTH_END - SOUTH_END).toFixed(1),
        deckWidthM: 2 * HALF,
        spansM: [...Array(10).fill(SPAN), +(LEAF.x1 - LEAF.x0).toFixed(1), +(NORTH_FACE - KELDER.x1).toFixed(1)],
        pierX: report.piers.map(({ x }) => x),
        girderDepthM: DECK.depth,
        boxWidthM: 2 * DECK.boxHalf,
        basculeLeafM: +(LEAF.x1 - LEAF.x0).toFixed(1),
        kelderM: [+(KELDER.x1 - KELDER.x0).toFixed(1), +(KELDER.y1 - KELDER.y0).toFixed(1)],
        towerTopNapM: CABIN.topNap,
        deckNapM: { south: DECK_NAP[0], crest: Math.max(...DECK_NAP), north: DECK_NAP[DECK_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Haringvlietbrug",
        "PDOK BGT overbruggingsdeel (dekranden, landhoofden, pijlercaissons, basculekelder), wegdeel en ondersteunend wegdeel, EPSG:28992",
        "PDOK BAG pand 0611100000614366 (toren van het bedieningsgebouw)",
        "PDOK AHN DSM 0,5 m via WCS voor het wegdek, de rustpijler en de toren; PDOK-terrein voor de waterspiegel",
        "PDOK luchtfoto (Actueel_orthoHR) voor de klep, de kelder en de toren",
        "Nationaal Archief / Anefo (CC0): Brug over het Haringvliet bij Numansdorp, Bestanddeelnr 914-3033, 914-3034, 914-3038, 914-3040 (bouw 1962)",
        "Wikimedia Commons: Haringvlietbrug (48566257631).jpg, Haringvlietbrug (48566259211).jpg, Haringvlietbrug (48566259466).jpg, Haringvlietbrug (48566401637).jpg, 2009-09-05 Route A29 at the bridge over Haringvliet 03.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

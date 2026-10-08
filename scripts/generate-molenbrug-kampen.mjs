// Genereert een vereenvoudigd, gesloten 3D-model van de Molenbrug bij Kampen:
// de betonnen tuibrug (1983, ontwerp Stahlton AG) van de N764 over de IJssel
// tussen Kampen en IJsselmuiden, in de volksmond "de nieuwe brug", genoemd naar
// de molen D' Olde Zwarver ernaast. Twee H-vormige pylonen van 57 m, elk twee
// vierkante kolommen naast het dek met een dwarsregel die aan beide einden in
// twee schoren naar de kolommen splitst; per pyloon en per kolom zes tuien naar
// de hoofdoverspanning (193,5 m) en zes naar de zijoverspanning (harpvorm, twee
// tuivlakken langs de randen van het dek); een kokerligger van 19,8 m breed
// over de hele lengte van 630 m, met aan elke kant een zijoverspanning van
// circa 91 m en aanbruggen op kolompijlers (één aan de Kamper kant, vier aan de
// kant van IJsselmuiden). Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, per onderdeel een node met de
// materiaalklasse in de nodenaam: de constructie, de rijbaan van de N764 en de
// parallelweg met BGT-attributen) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal> met een printvoet onder het
// dek. De brug is 631 m lang en past op 1:1000 niet in 400 mm, vandaar
// standaard 1:2000 (315 mm).
//
//   node scripts/generate-molenbrug-kampen.mjs              # 1:2000 (standaard)
//   node scripts/generate-molenbrug-kampen.mjs --scale 1500
//
// Assenstelsel: oorsprong op de as van het BGT-dek midden tussen de twee
// pylonen (RD 191971,79, 506178,92), op de waterspiegel van de IJssel zoals het
// PDOK-terrein die legt (NAP +0,10 m), Z omhoog. +X loopt langs de brug naar het
// noordoosten (IJsselmuiden, RD-richting 46,12 graden vanaf het oosten), +Y
// naar het noordwesten, stroomafwaarts. De pylonen staan op x = -96,8 (Kamper
// kant) en x = 96,8.
//
// Bronnen: BGT overbruggingsdeel (dek 19,8 m breed van x = -238,2 tot 392,4,
// randen evenwijdig op 46,12 graden) en wegdeel (rijbaan regionale weg van
// y = -0,7 tot 6,95 in twee rijstroken en de parallelweg, rijbaan lokale weg,
// van y = -7,6 tot -2,9, met daartussen een middenberm); BAG-pand
// 0166100000032251 (bouwjaar 2016, 4,2 × 7,1 m onder het dek op x = -188,2) op
// de plek van de pijler aan de Kamper kant; AHN DSM 0,5 m (PDOK WCS) voor het
// lengteprofiel van het wegdek (NAP +11,8 m aan de Kamper kant, +14,6 m in het
// midden, +8,6 m bij IJsselmuiden), de kolommen van de pylonen (top NAP
// +57,25 m, middens 10,95 m naast de as, circa 2 × 2,5 m) en hun plaats (x =
// ±96,8, hoofdoverspanning 193,6 m); PDOK-terrein voor de waterspiegel
// (ellipsoïdisch 42,70 m; NAP-ellipsoïde 42,61 m op de uiterwaarden);
// PDOK-luchtfoto voor de pijlers van de aanbruggen (x = -188,2, 188,9, 239,9,
// 291,4 en 342,4) en de rijstroken; Wikipedia voor bouwjaar, ontwerper,
// spanwijdte (193,50 m), pylonhoogte (57 m) en dekbreedte (19,40 m);
// Wikimedia Commons-foto's (Kampen, Molenbrug. 28-02-2022 (actm.) 01 tot 08,
// Molenbrug bridge Kampen 2019, Wobbly bridge Kampen, 20150909 Molenbrug 1 tot
// 4) voor de vorm van de kolommen met de schuine top, de dwarsregel met
// schoren (hart NAP +42,7 m, schoren 4 m lang), het verbrede onderste deel van
// de kolommen met de voet, de pijlers met hun kop, de kokerligger en het
// aantal tuien (zes per kolom per richting, ankers NAP +22,6 tot +51,7 m om de
// 5,82 m; op het dek geschat om de 8,5 m van 9 tot 51,5 m van de pyloon).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "molenbrug-kampen");
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
// Polygoon in het YZ-vlak (dwarsdoorsnede), uitgetrokken langs X van x0 tot x1.
const profileX = (points, x0, x1) =>
  Manifold.extrude([ccw(points)], x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, 0]);
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};

// ---------- hoofdmaten ----------
// Het PDOK-terrein legt de IJssel op ellipsoïdisch 42,70 m; met het verschil
// NAP-ellipsoïde van 42,61 m (uiterwaarden, AHN-DTM tegen PDOK) is dat
// NAP +0,10 m. Dat is z = 0 in het model.
const WATER_NAP = 0.1;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
const SW_END = -238.17; // einde dek en landhoofd aan de Kamper kant (BGT)
const NE_END = 392.45; // einde dek en landhoofd bij IJsselmuiden (BGT)
const ABUTMENT = 6.0; // lengte van de landhoofdblokken (geschat)
const PYLONS = [-96.8, 96.8]; // hart van de pylonen (AHN)

// Wegdek in NAP-meters om de 4 m vanaf x = -240: 40e percentiel van het
// AHN-DSM in stroken op de rijbanen (y -6,5 tot -3,5 en 0 tot 6,5) over 4 m;
// bij de pylonen (dwarsregel en tuien in het DSM) lineair.
const DECK_NAP = [
  11.77, 11.85, 11.91, 12.0, 12.08, 12.16, 12.24, 12.31, 12.39, 12.48, 12.55, 12.63, 12.7, 12.78, 12.86,
  12.93, 13.01, 13.07, 13.12, 13.19, 13.26, 13.31, 13.38, 13.44, 13.49, 13.55, 13.61, 13.66, 13.71, 13.76,
  13.81, 13.86, 13.91, 13.96, 14.02, 14.07, 14.11, 14.15, 14.2, 14.24, 14.28, 14.31, 14.34, 14.37, 14.39,
  14.42, 14.43, 14.45, 14.47, 14.49, 14.51, 14.52, 14.54, 14.55, 14.56, 14.57, 14.58, 14.59, 14.6, 14.61,
  14.61, 14.62, 14.62, 14.61, 14.6, 14.6, 14.59, 14.58, 14.56, 14.54, 14.53, 14.5, 14.48, 14.46, 14.44,
  14.42, 14.38, 14.35, 14.33, 14.29, 14.26, 14.22, 14.19, 14.16, 14.12, 14.09, 14.04, 13.99, 13.96, 13.9,
  13.85, 13.81, 13.75, 13.7, 13.64, 13.58, 13.52, 13.47, 13.41, 13.34, 13.28, 13.22, 13.16, 13.09, 13.03,
  12.96, 12.9, 12.82, 12.73, 12.65, 12.58, 12.5, 12.41, 12.33, 12.25, 12.17, 12.09, 12.0, 11.92, 11.84,
  11.77, 11.67, 11.59, 11.51, 11.43, 11.35, 11.27, 11.19, 11.11, 11.02, 10.95, 10.86, 10.8, 10.72, 10.63,
  10.55, 10.47, 10.4, 10.31, 10.24, 10.16, 10.07, 9.99, 9.91, 9.84, 9.77, 9.68, 9.6, 9.51, 9.43,
  9.35, 9.27, 9.19, 9.12, 9.03, 8.95, 8.87, 8.79, 8.71, 8.61,
];
const deckNap = (x) => {
  const f = Math.min(Math.max((x + 240) / 4, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t;
};
const top = (x) => Z(deckNap(x)); // wegdek in modelhoogte op lokale x

// Dek (BGT): 19,8 m breed. Doorsnede een kokerligger (foto's): rand 0,9 m
// dik, schuine onderkant van de uitkraging naar een bodem van 11 m breed,
// 3,0 m onder het wegdek. Langs de randen en in de middenberm verhoogde
// stroken van 0,5 m (schampkanten, met de geleiderails en leuningen erop) op
// de BGT-grenzen van de rijbanen.
const DECK = { half: 9.9, edge: 0.9, depth: 3.0, soffitHalf: 5.5 };
const KERB = { height: 0.5, se: -7.6, median: [-2.9, -0.72], nw: 7.0 };
// Pijlers van de aanbruggen (luchtfoto; de Kamper pijler op het BAG-pand):
// kolommen van 3,6 × 7,0 m met een kop die over 2 m verbreedt tot 4,2 × 10 m
// onder de bodem van de ligger (foto's).
const PIERS = [-188.2, 188.85, 239.85, 291.35, 342.35];
const PIER = { along: 3.6, across: 7.0, capAlong: 4.2, capAcross: 10.0, cap: 2.0 };

// Pylonen: twee kolommen per pyloon, hart 10,95 m naast de as (AHN), boven
// het dek 2,5 m langs de as en 2,2 m dwars (binnenkant 9,85 m van de as, net
// in de dekrand); onder het dek verbreed tot 3,4 × 2,8 m met een voet van
// 4,4 × 3,8 m tot NAP +1,5 m (foto's). De top loopt schuin af, 1 m lager aan
// de kant van de zijoverspanning (foto's).
const LEG = { centre: 10.95, inner: 9.85, half: 1.25, outer: 12.05, topNap: 57.25, slant: 1.0 };
const LOWER = { half: 1.7, outer: 12.65 };
const FOOT = { half: 2.2, inner: 9.35, outer: 13.15, topNap: 1.5, chamferNap: 2.3 };
// Dwarsregel (foto's, frontaal): ligger tussen y = ±5,85 met de bovenkant op
// NAP +43,7 m en 1,3 m hoog; aan elk einde splitst hij in een schoor omhoog en
// een schoor omlaag naar de kolom (bovenkant van de schoren bij de kolom
// NAP +46,4 en +40,9 m). Langs de as 1,9 m breed (geschat). Een vrijhangende
// regel krijgt in de export een wand tot het wegdek (ook met een kiel: de
// onderste lijn hangt in de lucht); daarom rust hij op een verdiept vlak met
// een spitse onderkant, zie pylon().
const BEAM = { end: 5.85, topNap: 43.7, h: 1.3, upNap: 46.4, downNap: 40.9, at: 10.4, half: 0.95 };
const KEEL = Math.tan((50 * Math.PI) / 180);
// Het verdiepte vlak onder de regel is 1,2 m dik (blinde nis van 0,35 m).
const PANEL_HALF = 0.6;

// Tuien: per kolom zes naar elke kant in een harp (foto's), ankers in de kolom
// van NAP +22,6 tot +51,7 m om de 5,82 m, op het dek van 9 tot 51,5 m van de
// pyloon om de 8,5 m (geschat uit de foto's). Het tuivlak ligt op het dek
// 9,15 m naast de as (op de randstrook) en loopt naar de kolom tot 10,6 m bij
// het bovenste anker. Een tui van 0,2 m is op 1:1000 niet te printen en de
// tuien staan 36 tot 44 graden: elk tuivlak is een plaat van 0,9 m met de
// tuien als ribben van 1,0 m breed die 0,3 m uitsteken, en tussen de ribben
// doorgaande driehoekige openingen (een verticale zijde en een bovenzijde van
// 55 graden), zodat geen vlak flauwer dan 50 graden vrij hangt.
const ANCHOR_NAP = Array.from({ length: 6 }, (_, k) => +(22.6 + 5.82 * k).toFixed(2));
const FEET = Array.from({ length: 6 }, (_, k) => 9 + 8.5 * k);
const SAIL = { deckV: 9.15, topV: 10.6, thick: 0.9, foot: 0.2 };
const RIB = { base: 1.0, top: 0.4, proud: 0.3 };
const HOLE = { margin: 0.55, deck: 0.9, leg: 0.6, gap: 0.9, minH: 1.5, minL: 1.2, maxL: 12, side: Math.tan((55 * Math.PI) / 180) };

// ---------- dek ----------
const deckSection = (x) => {
  const zt = top(x);
  return [
    [-DECK.soffitHalf, zt - DECK.depth],
    [DECK.soffitHalf, zt - DECK.depth],
    [DECK.half, zt - DECK.edge],
    [DECK.half, zt],
    [-DECK.half, zt],
    [-DECK.half, zt - DECK.edge],
  ];
};
const DECK_STEP = 2;
const deck = loftX(stationsX(SW_END, NE_END, DECK_STEP).map((x) => ({ x, section: deckSection(x) })));
function kerb(y0, y1, margin = 0) {
  return loftX(
    stationsX(SW_END - (margin ? 0.5 : 0), NE_END + (margin ? 0.5 : 0), DECK_STEP).map((x) => {
      const zt = top(x);
      return {
        x,
        section: [[y0 - margin, zt - 0.1 - margin], [y1 + margin, zt - 0.1 - margin], [y1 + margin, zt + KERB.height + margin], [y0 - margin, zt + KERB.height + margin]],
      };
    }),
  );
}
const KERBS = [
  [-DECK.half, KERB.se],
  KERB.median,
  [KERB.nw, DECK.half],
];
const kerbs = KERBS.map(([y0, y1]) => kerb(y0, y1));

// ---------- landhoofden en pijlers ----------
const abutment = (x0, x1) =>
  loftX(
    stationsX(x0, x1, 2).map((x) => ({
      x,
      section: [[-DECK.half - 0.4, BASE], [DECK.half + 0.4, BASE], [DECK.half + 0.4, top(x) - 0.05], [-DECK.half - 0.4, top(x) - 0.05]],
    })),
  );
const abutments = [abutment(SW_END, SW_END + ABUTMENT), abutment(NE_END - ABUTMENT, NE_END)];
const soffitAt = (x) => top(x) - DECK.depth;
const piers = PIERS.map((x) => {
  const zs = soffitAt(x) + 0.1;
  const column = boxFromTo(x - PIER.along / 2, x + PIER.along / 2, -PIER.across / 2, PIER.across / 2, BASE, zs - PIER.cap + 0.01);
  const pts = [];
  for (const [a, c, z] of [[PIER.along, PIER.across, zs - PIER.cap], [PIER.capAlong, PIER.capAcross, zs]]) {
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) pts.push([x + (sx * a) / 2, (sy * c) / 2, z]);
  }
  return union([column, Manifold.hull(pts)]);
});

// ---------- pylonen ----------
function pylon(xp) {
  const toMain = xp < 0 ? 1 : -1; // richting van de hoofdoverspanning langs x
  const zs = soffitAt(xp);
  const parts = [];
  for (const side of [-1, 1]) {
    const yy = (a, b) => [side * a, side * b];
    // Voet en onderste deel van de kolom.
    const [f0, f1] = yy(FOOT.inner, FOOT.outer);
    parts.push(boxFromTo(xp - FOOT.half, xp + FOOT.half, f0, f1, BASE, Z(FOOT.topNap)));
    const [l0, l1] = yy(LEG.inner, LOWER.outer);
    parts.push(
      Manifold.hull([
        ...[[FOOT.half, FOOT.inner, FOOT.outer, Z(FOOT.topNap) - 0.01], [LOWER.half, LEG.inner, LOWER.outer, Z(FOOT.chamferNap)]].flatMap(([h, a, b, z]) =>
          [-1, 1].flatMap((sx) => [a, b].map((t) => [xp + sx * h, side * t, z])),
        ),
      ]),
    );
    parts.push(boxFromTo(xp - LOWER.half, xp + LOWER.half, l0, l1, Z(FOOT.chamferNap) - 0.01, zs - 1.0));
    // Overgang naar het slanke deel boven het dek (een schuine kraag die naar
    // boven kijkt) en de kolom tot de schuine top.
    const ring = (h, a, b, z) => [-1, 1].flatMap((sx) => [a, b].map((t) => [xp + sx * h, side * t, z]));
    parts.push(Manifold.hull([...ring(LOWER.half, LEG.inner, LOWER.outer, zs - 1.01), ...ring(LEG.half, LEG.inner, LEG.outer, zs - 0.2)]));
    const zTop = Z(LEG.topNap);
    parts.push(
      Manifold.hull([
        ...ring(LEG.half, LEG.inner, LEG.outer, zs - 0.21),
        ...[LEG.inner, LEG.outer].flatMap((t) => [
          [xp + toMain * LEG.half, side * t, zTop],
          [xp - toMain * LEG.half, side * t, zTop - LEG.slant],
        ]),
      ]),
    );
  }
  // Dwarsregel met schoren: elk lid is de omhulling van zijn doorsnede aan
  // beide einden (langs x 1,9 m breed en h hoog). De regel en de schoren omlaag
  // lopen onder in een afschuining van 50 graden over in het verdiepte vlak
  // eronder; de schoren omhoog hangen boven een opening en hebben een kiel van
  // 50 graden die bij het einde van de regel op dat vlak uitkomt.
  const keelDepth = BEAM.half * KEEL;
  const chamfer = (BEAM.half - PANEL_HALF) * KEEL;
  const member = (y0, zTop0, y1, zTop1, keel) => {
    const pts = [];
    for (const [y, zt] of [[y0, zTop0], [y1, zTop1]]) {
      for (const sx of [-1, 1]) pts.push([xp + sx * BEAM.half, y, zt], [xp + sx * BEAM.half, y, zt - BEAM.h]);
      if (keel) pts.push([xp, y, zt - BEAM.h - keelDepth]);
      else for (const sx of [-1, 1]) pts.push([xp + sx * PANEL_HALF, y, zt - BEAM.h - chamfer]);
    }
    return Manifold.hull(pts);
  };
  const zb = Z(BEAM.topNap);
  parts.push(member(-BEAM.end - 0.01, zb, BEAM.end + 0.01, zb, false));
  for (const side of [-1, 1]) {
    parts.push(member(side * BEAM.end, zb, side * BEAM.at, Z(BEAM.upNap), true));
    parts.push(member(side * BEAM.end, zb, side * BEAM.at, Z(BEAM.downNap), false));
  }
  // Onder de dwarsregel een verdiept vlak (1,2 m dik, 0,35 m achter de
  // regel en de schoren) met een spitse onderkant van 50 graden vanaf de
  // kolommen: zo hangt de regel niet vrij boven het dek en vult de export er
  // geen wand onder tot het wegdek; de doorgang eronder heeft een spitse top.
  const zApex = zb - BEAM.h - chamfer - 0.05;
  const zLow = zApex - LEG.inner * KEEL;
  const vIn = LEG.inner + 0.3;
  parts.push(
    profileX(
      [[-vIn, zLow - 0.3 * KEEL], [0, zApex], [vIn, zLow - 0.3 * KEEL], [vIn, zb - 0.01], [-vIn, zb - 0.01]],
      xp - PANEL_HALF,
      xp + PANEL_HALF,
    ),
  );
  return union(parts);
}
const pylons = PYLONS.map(pylon);

// ---------- tuivlakken ----------
// Per pyloon en richting (sigma = +1 naar grotere x) één vlak op de +y-kant;
// de -y-kant is het spiegelbeeld (het dek is symmetrisch).
const sailV = (z, zDeck, zAnchor) => SAIL.deckV + ((SAIL.topV - SAIL.deckV) * (z - zDeck)) / (zAnchor - zDeck);
function sail(xp, sigma) {
  const zAnchors = ANCHOR_NAP.map(Z);
  const zTopA = zAnchors[zAnchors.length - 1];
  const zDeck = top(xp) + KERB.height;
  const foot = (s) => top(xp + sigma * s) + SAIL.foot; // voet van plaat en ribben in de randstrook
  // Tui k in het (s, z)-vlak: van (0, zA_k) naar (S_k, foot(S_k)).
  const cable = (k) => (s) => zAnchors[k] + ((foot(FEET[k]) - zAnchors[k]) * s) / FEET[k];
  const cosT = (k) => FEET[k] / Math.hypot(FEET[k], zAnchors[k] - foot(FEET[k]));
  const outline = [
    [0, foot(0)],
    [FEET[5], foot(FEET[5])],
    [0, zTopA],
  ];
  // Openingen tussen de tuien (en tussen kolom en onderste tui): rechthoekige
  // driehoeken met de onderkant langs de onderste tui (of 0,9 m boven de
  // randstrook), een verticale zijde aan de kant van de pyloon tot onder de
  // bovenste tui en een schuine bovenzijde van minstens 55 graden naar het
  // dek; zo hangt boven een opening geen vlak flauwer dan 55 graden. Tussen
  // de openingen blijft een stijl van 0,9 m staan, tegen de kolom 0,6 m.
  const holes = [];
  for (let k = -1; k < 5; k++) {
    const lower = (s) =>
      Math.max(top(xp + sigma * s) + KERB.height + HOLE.deck, k >= 0 ? cable(k)(s) + HOLE.margin / cosT(k) : -Infinity);
    const upper = (s) => cable(k + 1)(s) - HOLE.margin / cosT(k + 1);
    let s = LEG.half + HOLE.leg; // verticale zijde van de volgende opening
    while (s < FEET[k + 1]) {
      const zc = upper(s);
      const za = lower(s);
      if (zc - za < HOLE.minH) {
        s += 0.25;
        continue;
      }
      // Langste onderkant L waarbij de bovenzijde nog 55 graden staat.
      const steep = (L) => (zc - lower(s + L)) / L - HOLE.side;
      let lo = 0.01;
      let hi = 60;
      if (steep(hi) > 0) lo = hi;
      else for (let it = 0; it < 50; it++) {
        const mid = (lo + hi) / 2;
        if (steep(mid) >= 0) lo = mid;
        else hi = mid;
      }
      const L = Math.min(lo, HOLE.maxL);
      if (L < HOLE.minL) {
        s += 0.25;
        continue;
      }
      holes.push([[s, za], [s + L, lower(s + L)], [s, zc]]);
      s += L + HOLE.gap;
    }
  }
  const toU = (s) => xp + sigma * s;
  const poly = (pts) => ccw(pts.map(([s, z]) => [toU(s), z]));
  let cs = new CrossSection([poly(outline)]);
  if (holes.length) cs = cs.subtract(new CrossSection(holes.map(poly)));
  // Polygoon in het (x, z)-vlak, uitgetrokken over de dikte; daarna scheef
  // gezet naar het tuivlak (een afschuiving, zonder spiegeling).
  const plate = Manifold.extrude(cs, SAIL.thick)
    .rotate([90, 0, 0])
    .translate([0, SAIL.thick / 2, 0])
    .warp((v) => {
      v[1] += sailV(v[2], zDeck, zTopA);
    });
  // Ribben langs de tuien: zeskantige doorsnede, 1,0 m breed op de plaat en
  // 0,4 m op de top, aan beide kanten 0,3 m uitstekend.
  const ribs = FEET.map((S, k) => {
    const a = [sigma * S, foot(S) - zAnchors[k]];
    const len = Math.hypot(a[0], a[1]);
    const p = [-a[1] / len, a[0] / len]; // loodrecht op de tui in het vlak
    const pts = [];
    for (const [x, z] of [[xp, zAnchors[k]], [toU(S), foot(S)]]) {
      for (const [w, y] of [[RIB.base / 2, SAIL.thick / 2], [RIB.top / 2, SAIL.thick / 2 + RIB.proud]]) {
        for (const sw of [-1, 1]) {
          for (const sy of [-1, 1]) {
            const zz = z + sw * w * p[1];
            pts.push([x + sw * w * p[0], sailV(zz, zDeck, zTopA) + sy * y, zz]);
          }
        }
      }
    }
    return Manifold.hull(pts);
  });
  return { solid: union([plate, ...ribs]), holes: holes.length };
}
const sailParts = PYLONS.flatMap((xp) => [-1, 1].map((sigma) => sail(xp, sigma)));
const sailsNW = union(sailParts.map((p) => p.solid));
const sails = [sailsNW, sailsNW.mirror([0, 1, 0])];

const bridge = union([deck, ...kerbs, ...abutments, ...piers, ...pylons, ...sails]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden vanaf de onderkant van
// de dekrand die uitloopt in een scherm van minstens 0,8 mm op printschaal tot
// de onderplaat.
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const footStations = stationsX(SW_END + ABUTMENT, NE_END - ABUTMENT, 1).map((x) => {
  const zb = top(x) - DECK.edge - 0.02;
  const w = DECK.half;
  // Bij IJsselmuiden ligt het dek zo laag dat de wig de onderplaat raakt
  // voordat hij smal is: daar wordt de voet breder.
  const ws = Math.max(SCREEN, w - (zb - BASE - 0.01) / KEEL);
  const zs = zb - KEEL * (w - ws);
  const zIn = top(x) - 0.3;
  return { x, section: [[-ws, BASE], [ws, BASE], [ws, zs], [w, zb], [w, zIn], [-w, zIn], [-w, zb], [-ws, zs]] };
});
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);
// Eerst de brug en de printversie als geheel uitrekenen; de wegdeklaag komt
// pas daarna, zodat de STL de brug als geheel bevat.
for (const [name, solid] of [["brug", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}

// ---------- rijbaan en parallelweg als eigen onderdelen ----------
// De bovenste 0,5 m van het dek tussen de verhoogde stroken is een eigen node
// met de attributen van het BGT-wegdeel eronder (glTF `extras.attributes`),
// zodat de kleurregels van een thema op het brugdek werken zoals op de
// PDOK-wegdelen ernaast. Op het dek liggen drie actuele BGT-wegdelen met
// relatieve hoogteligging 1 (lokale coördinaten, vereenvoudigd tot 5 cm):
// twee rijstroken van de N764 (rijbaan regionale weg) en de parallelweg aan de
// zuidoostkant (rijbaan lokale weg), alle gesloten verharding, asfalt.
const LAYER = 0.5;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const LOCAL_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
// P0023.9bf579d393d04ceca7ca2243659a860e en P0023.e835b40aa4674bdeb6b86a102e7d6c4f
// (rijbaan regionale weg), samen van y = -0,7 tot 6,95.
const ROADWAY_BGT = [
  [[-59.95, -0.74], [209.85, -0.6], [290.42, -0.69], [319.18, -0.57], [392.42, -0.53], [392.42, 2.84], [392.42, 3.18],
    [236.25, 3.05], [-26.89, 2.98], [-144.23, 3.22], [-238.09, 2.91], [-238.07, -0.97], [-187.95, -0.75]],
  [[392.42, 3.18], [392.41, 7.2], [338.98, 7.07], [317.37, 6.78], [290.39, 6.73], [-11.04, 6.71], [-61.52, 6.88],
    [-187.31, 6.88], [-238.09, 6.98], [-238.09, 2.91], [-144.23, 3.22], [-26.89, 2.98], [236.25, 3.05]],
];
// P0023.51b102d581b14a1fa8325ca8ddfbc684 (rijbaan lokale weg), y = -7,6 tot -2,9.
const LOCAL_BGT = [
  [-52.19, -7.65], [-27.74, -7.52], [77.22, -7.49], [131.7, -7.57], [179.12, -7.49], [320.62, -7.5], [376.2, -7.35],
  [392.43, -7.4], [392.43, -2.67], [376.16, -2.77], [341.57, -2.76], [320.51, -2.9], [207.18, -2.86], [13.5, -2.97],
  [-30.82, -2.93], [-63.45, -3.0], [-144.19, -2.91], [-238.07, -2.96], [-238.05, -7.63], [-215.57, -7.69],
  [-176.29, -7.62], [-118.25, -7.73],
];
// De BGT-grenzen liggen tot 0,3 m van de verhoogde stroken van het model; de
// wegdelen van het model volgen die stroken: parallelweg tussen de rand aan
// de zuidoostkant en de middenberm, rijbaan tussen de middenberm en de rand aan
// de noordwestkant.
const SPLIT_Y = (KERB.median[0] + KERB.median[1]) / 2;
for (const [label, ring, lo, hi] of [
  ["parallelweg", LOCAL_BGT, KERB.se, KERB.median[0]],
  ...ROADWAY_BGT.map((ring) => ["rijbaan", ring, KERB.median[1], KERB.nw]),
]) {
  for (const [x, y] of ring) {
    if (x < SW_END - 0.1 || x > NE_END + 0.1 || y < lo - 0.35 || y > hi + 0.35) throw new Error(`BGT-${label} buiten zijn strook: ${x}, ${y}`);
  }
}
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, over dezelfde
// loftstations als het dek en 0,5 m voorbij de uiteinden; de verhoogde
// stroken blijven constructie met 2 cm vrij.
const ABOVE = 1.0;
const strip = loftX(
  stationsX(SW_END - 0.5, NE_END + 0.5, DECK_STEP).map((x) => {
    const zt = top(x);
    const y0 = KERB.se + 0.02;
    const y1 = KERB.nw - 0.02;
    return { x, section: [[y0, zt - LAYER], [y1, zt - LAYER], [y1, zt + ABOVE], [y0, zt + ABOVE]] };
  }),
);
const kerbGuards = union(KERBS.map(([y0, y1]) => kerb(y0, y1, 0.02)));
const roadCut = strip.subtract(kerbGuards);
const southHalf = boxFromTo(SW_END - 2, NE_END + 2, -20, SPLIT_Y, BASE - 1, 100);
const localCut = roadCut.intersect(southHalf);
const roadwayCut = roadCut.subtract(southHalf);
const roadway = roadwayCut.intersect(bridge);
const localRoad = localCut.intersect(bridge);
const structure = bridge.subtract(roadCut);
{
  // De onderdelen samen zijn de brug: de volumes tellen op, zonder overlap.
  const whole = bridge.volume();
  const sum = roadway.volume() + localRoad.volume() + structure.volume();
  console.log("partitie (m3):", {
    brug: +whole.toFixed(2),
    rijbaan: +roadway.volume().toFixed(2),
    parallelweg: +localRoad.volume().toFixed(2),
    constructie: +structure.volume().toFixed(2),
    verschil: +(sum - whole).toFixed(4),
  });
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error(`partitie: ${sum} tegen ${whole}`);
  if (roadway.intersect(structure).volume() > 1e-3 || localRoad.intersect(structure).volume() > 1e-3) throw new Error("wegdeel en constructie overlappen");
}
const parts = [
  ["building:molenbrug-kampen", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:rijbaan-lokaal", localRoad, LOCAL_ATTRIBUTES],
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
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
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
{
  // In het model hangen alleen de onderkant van het dek en de pijlerkoppen
  // vrij; boven het wegdek niets.
  const { area, found } = overhangs(bridge);
  const buckets = {};
  for (const { p, area: a } of found) {
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const ym = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const zt = top(xm);
    const key = zm > zt + 0.01 ? `boven het dek x ${xm.toFixed(0)} y ${ym.toFixed(0)} z ${zm.toFixed(0)}` : "onder het dek";
    buckets[key] = (buckets[key] ?? 0) + a;
  }
  const above = Object.entries(buckets).filter(([k, a]) => k.startsWith("boven") && a > 0.05);
  if (above.length) throw new Error(`overhang ${above.map(([k, a]) => `${k} (${a.toFixed(2)} m2)`).join(", ")}`);
  console.log("vrij hangend (m2):", Math.round(area), Object.fromEntries(Object.entries(buckets).map(([k, a]) => [k, +a.toFixed(2)])));
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
report.pylons = {
  x: PYLONS,
  mainSpanM: PYLONS[1] - PYLONS[0],
  topZ: Z(LEG.topNap),
  beamTopZ: Z(BEAM.topNap),
  anchorsNap: ANCHOR_NAP,
  stayFeetFromPylonM: FEET,
  openingsPerSail: sailParts.map((p) => p.holes),
};
const glbFile = path.join(outDir, "molenbrug-kampen.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-molenbrug-kampen.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, pylonen, landhoofden en printvoet
// op het printbed.
const stlName = `molenbrug-kampen-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Molenbrug Kampen 1:${scale} mm Z-up`);
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
// Maaiveldpunten 20 m naast de brug aan beide zijden, verspreid over de
// lengte: op de uiterwaarden, bij de pylonen en op de IJssel.
const samplePoints = [-170, -100, -40, 10, 60, 120, 200, 280, 350].flatMap((x) => [
  [x, 20],
  [x, -20],
]);
await writeFile(
  path.join(outDir, "molenbrug-kampen.json"),
  JSON.stringify(
    {
      name: "Molenbrug",
      file: "molenbrug-kampen.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [191971.79, 506178.92],
      xAxis: [0.6932, 0.72075],
      groundOffsetMetres: GROUND_OFFSET,
      // Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten: de
      // IJssel. Terugval als een uitsnede alleen een uiteinde van de brug raakt.
      groundHeight: 42.7,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0166100000032251"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden tussen de twee pylonen op de waterspiegel van de IJssel (z = 0, NAP +0,10 m zoals het PDOK-terrein het water legt) in de oorsprong, +X langs de brug naar het noordoosten (IJsselmuiden, RD-richting 46,12 graden vanaf het oosten) en +Y naar het noordwesten. Drie nodes: road:rijbaan en road:rijbaan-lokaal, de bovenste 0,5 m van het dek tussen de verhoogde stroken met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan regionale weg voor de twee rijstroken van de N764 van y = -0,7 tot 7,0, rijbaan lokale weg voor de parallelweg van y = -7,6 tot -2,9; bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, de kokerligger van 19,8 m breed van het landhoofd aan de Kamper kant (x = -238,2) tot dat bij IJsselmuiden (x = 392,4) met het wegdek op NAP +11,8 tot +14,6 en +8,6 m, verhoogde randstroken en een middenberm van 0,5 m in plaats van leuningen en geleiderails; twee H-pylonen op x = ±96,8 (hoofdoverspanning 193,6 m) van twee kolommen 10,95 m naast de as met een schuine top op NAP +57,25 m, een verbreed onderste deel met voet, een dwarsregel op NAP +42,4 tot +43,7 m die aan beide einden in twee schoren naar de kolommen splitst, gedragen door een 0,35 m verdiept vlak met een spitse onderkant van 50 graden vanaf de kolommen (NAP +30,2 m), zodat de export er geen wand tot het wegdek onder zet; per kolom zes tuien naar elke kant in harpvorm (ankers NAP +22,6 tot +51,7 m, op het dek 9 tot 51,5 m van de pyloon), op 1:1000 als platen van 0,9 m met de tuien als ribben en doorgaande driehoekige openingen (verticale zijde, bovenzijde 55 graden); vijf kolompijlers met een verbrede kop onder de aanbruggen (één aan de Kamper kant, vier bij IJsselmuiden). Leuningen, geleiderails, lantaarns, de ankerkoppen op de kolommen en de dilatatievoegen zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt naast de brug bemonsterd; groundHeight is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten, de IJssel. Vervangt het BAG-pand 0166100000032251 onder het dek op de plek van de Kamper pijler. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NE_END - SW_END).toFixed(1),
        deckWidthM: 2 * DECK.half,
        mainSpanM: PYLONS[1] - PYLONS[0],
        pylonTopNapM: LEG.topNap,
        crossbeamNapM: [BEAM.topNap - BEAM.h, BEAM.topNap],
        stayAnchorsNapM: ANCHOR_NAP,
        stayFeetFromPylonM: FEET,
        piersX: PIERS,
        deckNapM: { kampen: DECK_NAP[0], crest: 14.62, ijsselmuiden: DECK_NAP[DECK_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Molenbrug_(Kampen)",
        "PDOK BGT overbruggingsdeel (dek) en wegdeel (P0023.9bf579d393d04ceca7ca2243659a860e, P0023.e835b40aa4674bdeb6b86a102e7d6c4f, P0023.51b102d581b14a1fa8325ca8ddfbc684), EPSG:28992",
        "PDOK BAG pand 0166100000032251",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek en de pylonen",
        "PDOK luchtfoto (Actueel_orthoHR) voor de pijlers en de rijstroken",
        "Wikimedia Commons: Kampen, Molenbrug. 28-02-2022. (actm.) 01 tot 08.jpg, Molenbrug bridge Kampen 2019.jpg (en 2, 3), Wobbly bridge, Kampen, Overijssel.jpg, 20150909 Molenbrug1 tot 4 over de IJssel bij Kampen.jpg, Molenbrug, Kampen.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

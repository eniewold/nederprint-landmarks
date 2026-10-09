// Genereert een vereenvoudigd, gesloten 3D-model van de Brug bij Heusden: de
// tuibrug van de N267 over de Bergsche Maas tussen Heusden en
// Hedikhuizen/Doeveren, met één portaalpyloon midden in de rivier (twee naar
// boven toe naar elkaar toe hellende betonnen poten met een kop waarop twee
// rode kappen over de tuiverankeringen liggen), per kant twee waaiers van
// tuien naar de zuidoverspanning en de noordoverspanning (in het midden van
// het dek, op de scheiding tussen rijbaan en fietspad), en de aanbrug over de
// noordelijke uiterwaard op zeven wandpijlers. Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, per onderdeel
// een node met de materiaalklasse in de nodenaam: de constructie, de rijbaan
// en de twee fietspaden van de N267 met BGT-attributen) als catalogusbron voor
// de export en de kaart, plus een binaire STL in millimeters op 1:<schaal> met
// een printvoet onder het dek. De brug is 563 m lang en past op 1:1000 niet in
// 400 mm, vandaar standaard 1:1500 (375 mm).
//
//   node scripts/generate-brug-bij-heusden.mjs              # 1:1500 (standaard)
//   node scripts/generate-brug-bij-heusden.mjs --scale 2000
//
// Assenstelsel: oorsprong op de as van het BGT-dek midden op de sloof van de
// pyloon (RD 136424,26, 416375,78), op de waterspiegel van de Bergsche Maas
// zoals het PDOK-terrein die legt (NAP +0,63 m), Z omhoog. +X loopt langs de
// brug naar het noorden (Hedikhuizen, RD-richting 106,63 graden vanaf het
// oosten), +Y naar het westen (stroomafwaarts). De pyloon staat op x = -0,4.
//
// Bronnen: BGT overbruggingsdeel (dek 21,1 m breed van x = -127,9 tot 435,0
// met evenwijdige randen op 106,63 graden, twee landhoofden, de sloof van de
// pyloon van 4,9 × 29,5 m met ronde koppen, de overgangspijler op x = 112,9 en
// zes wandpijlers van 1,65 × 11,8 m op x = 152,1 tot 389,2) en wegdeel
// (rijbaan regionale weg |y| ≤ 4,45 en twee fietspaden 5,9 ≤ |y| ≤ 9,4, asfalt,
// met daartussen en langs de randen stroken cementbeton); AHN DSM 0,5 m
// (PDOK WCS) voor het lengteprofiel van het wegdek (NAP +11,0 m bij het
// zuidelijke landhoofd, +11,46 m bij de pyloon, +8,9 m bij het noordelijke
// landhoofd), de pyloon (kappen tot NAP +51,4 m, betonnen kop +49,7 m tussen
// de kappen, buitenkant van de poten 13,1 m naast de as op dekhoogte en 9,1 m
// in de top, kop circa 3,4 m langs de as), de sokkels onder de poten
// (NAP +5,5 m) en de scheidingen op het dek (0,9 m boven het wegdek);
// PDOK-terrein voor de waterspiegel (ellipsoïdisch 44,21 m; verschil
// NAP-ellipsoïde 43,58 m op de uiterwaarden); Wikipedia voor de lengte
// (540 m) en het type; Wikimedia Commons-foto's (N267 bij Heusden, 2007-10-07
// 12.42 Heusden brug over de Bergse Maas foto2, Heusden-Aalburg Bridge, RCE
// 20413539) voor de portaalvorm met de kop en de rode kappen, de hoeken van de
// doorgang, de sokkels met de lagere sloof ertussen, de tuiwaaiers (geschat
// acht tuien per waaier, verankerd in de kop op NAP +46,0 tot +48,9 m, op het
// dek 21 tot 109 m van de pyloon om de 12,6 m), het slanke dek van de
// tuioverspanning en de kokerligger van de aanbrug op wandpijlers.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "brug-bij-heusden");
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
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Polygoon in het XY-vlak (plattegrond), uitgetrokken van z0 tot z1.
const prism = (points, z0, z1) => Manifold.extrude([ccw(points)], z1 - z0).translate([0, 0, z0]);
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};

// ---------- hoofdmaten ----------
// Het PDOK-terrein legt de Bergsche Maas op ellipsoïdisch 44,21 m; met het
// verschil NAP-ellipsoïde van 43,58 m (uiterwaarden, AHN-DTM tegen PDOK) is
// dat NAP +0,63 m. Dat is z = 0 in het model.
const WATER_NAP = 0.63;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
const SW_END = -127.93; // einde dek en zuidelijk landhoofd (BGT)
const SW_FACE = -119.2; // voorzijde zuidelijk landhoofd (BGT)
const NE_FACE = 425.4; // voorzijde noordelijk landhoofd (BGT)
const NE_END = 435.03; // einde dek en noordelijk landhoofd (BGT)

// Wegdek in NAP-meters om de 4 m vanaf x = -130: 40e percentiel van het
// AHN-DSM op de rijbaan (|y| ≤ 3,8) over 4 m, licht gladgestreken; bij de
// pyloon (kop in het DSM) lineair.
const DECK_NAP = [
  11.03, 11.05, 11.08, 11.09, 11.1, 11.11, 11.11, 11.11, 11.11, 11.12, 11.13, 11.13, 11.14, 11.15, 11.17,
  11.19, 11.21, 11.23, 11.25, 11.27, 11.29, 11.31, 11.33, 11.35, 11.37, 11.39, 11.4, 11.4, 11.4, 11.41,
  11.42, 11.43, 11.45, 11.46, 11.45, 11.44, 11.45, 11.45, 11.45, 11.45, 11.44, 11.43, 11.42, 11.4, 11.39,
  11.37, 11.36, 11.35, 11.34, 11.33, 11.31, 11.3, 11.29, 11.28, 11.26, 11.25, 11.24, 11.23, 11.22, 11.21,
  11.19, 11.16, 11.14, 11.13, 11.12, 11.12, 11.1, 11.09, 11.08, 11.05, 11.03, 11.01, 11.0, 10.99, 10.98,
  10.97, 10.95, 10.94, 10.92, 10.89, 10.86, 10.84, 10.81, 10.79, 10.78, 10.77, 10.75, 10.73, 10.71, 10.69,
  10.66, 10.63, 10.61, 10.58, 10.55, 10.53, 10.52, 10.51, 10.49, 10.45, 10.41, 10.38, 10.36, 10.33, 10.29,
  10.26, 10.23, 10.2, 10.18, 10.16, 10.13, 10.11, 10.08, 10.05, 10.01, 9.99, 9.96, 9.92, 9.88, 9.84,
  9.8, 9.77, 9.74, 9.7, 9.66, 9.62, 9.58, 9.53, 9.49, 9.46, 9.42, 9.38, 9.35, 9.32, 9.28,
  9.24, 9.19, 9.15, 9.1, 9.04, 8.99, 8.94, 8.9,
];
const deckNap = (x) => {
  const f = Math.min(Math.max((x + 130) / 4, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t;
};
const top = (x) => Z(deckNap(x)); // wegdek in modelhoogte op lokale x

// Dek (BGT): 21,1 m breed. Tuioverspanning (tot de overgangspijler): een
// slanke ligger met een rand van 1,0 m en een schuine onderkant naar een
// bodem van 13 m breed, 2,2 m onder het wegdek (foto's). Aanbrug: een
// kokerligger met een rand van 0,8 m en een bodem van 10,4 m breed, 3,0 m
// onder het wegdek (foto's).
const DECK = { half: 10.55 };
const STAY_DECK = { edge: 1.0, depth: 2.2, soffitHalf: 6.5 };
const APPROACH_DECK = { edge: 0.8, depth: 3.0, soffitHalf: 5.2 };
const TRANSITION = 112.9; // overgangspijler: einde tuioverspanning, begin aanbrug (BGT)
const edgeAt = (x) => (x < TRANSITION ? STAY_DECK.edge : APPROACH_DECK.edge);
const soffitAt = (x) => top(x) - (x < TRANSITION ? STAY_DECK.depth : APPROACH_DECK.depth);
// Scheidingen tussen rijbaan en fietspaden op de strook cementbeton van de BGT
// (|y| 4,45 tot 5,9), 0,9 m hoog (AHN), met de voeten van de tuien erin; langs
// de randen een opstaande rand van 0,5 m op de strook cementbeton (|y| 9,4 tot
// 10,55) in plaat van de leuningen.
const SEP = { inner: 4.45, outer: 5.9, height: 0.9 };
const EDGE = { inner: 9.4, height: 0.5 };
// Pijlers (BGT): de overgangspijler van 3,75 m dik en zes wandpijlers van
// 1,65 m dik, alle 11,8 m breed.
const PIERS = [
  { x: TRANSITION, thick: 3.75 },
  ...[152.12, 199.55, 246.95, 294.39, 341.81, 389.24].map((x) => ({ x, thick: 1.65 })),
];
const PIER_HALF = 5.9;

// Pyloon (AHN, foto's): twee poten van 2,8 m breed (dwars) en 3,4 m langs de
// as, waarvan de buitenkant van 13,1 m naast de as op dekhoogte (NAP +11,4 m)
// naar 9,1 m in de top (NAP +49,7 m) loopt (circa 6 graden); de binnenkant van
// 10,3 m (net in de dekrand) naar 6,3 m. De kop tussen de poten is 4,4 m hoog
// (foto's: onderkant NAP +45,3 m) met schuine hoeken in de doorgang; erop twee
// rode kappen van 7,45 m breed en 3,0 m langs de as tot NAP +51,4 m, met
// daartussen 3,2 m vrij (AHN, foto's).
const PYLON = { x: -0.4, along: 1.7, width: 2.8, deckNap: 11.4, outerDeck: 13.1, outerTop: 9.1, topNap: 49.7, headBottomNap: 45.3 };
const LEAN = (PYLON.outerDeck - PYLON.outerTop) / (PYLON.topNap - PYLON.deckNap);
const legOuter = (nap) => PYLON.outerDeck + (PYLON.deckNap - nap) * LEAN;
const legInner = (nap) => legOuter(nap) - PYLON.width;
const CAP = { inner: 1.6, outer: 9.05, half: 1.5, topNap: 51.4 };
// De kop zou vlak boven het dek hangen; met alleen een kiel eronder zette de
// export er een wand tot het wegdek onder. Daarom (zoals de dwarsregel van de
// Molenbrug) loopt de kop onder in een afschuining van 50 graden over in een
// verdiept vlak van 2,7 m dik (0,35 m achter de voor- en achterkant van de
// kop) met een spitse onderkant van 50 graden vanaf de poten: de doorgang
// krijgt een spitse top onder de kop in plaats van de kleine schuine hoeken
// op de foto's.
const POINTED = Math.tan((50 * Math.PI) / 180);
const PANEL = { recess: 0.35 };
// Sloof in de rivier (BGT): 5,2 m langs de as, tot 14,8 m naast de as met ronde
// koppen vanaf 12,7 m; onder de poten sokkels tot NAP +5,5 m (AHN) vanaf 10,0 m
// naast de as, daartussen een lagere sloof tot NAP +4,3 m (foto's, geschat).
const FOOT = { half: 2.6, straight: 12.7, end: 2.1, padFrom: 10.0, padNap: 5.5, slabNap: 4.3 };

// Tuien: per kant van de pyloon en per overspanning acht tuien in een waaier
// (foto's, geschat), verankerd in de kop van NAP +46,0 (kortste) tot +48,9 m
// (langste), op het dek 21 tot 109 m van de pyloon om de 12,6 m (geschat), op
// de scheiding 5,175 m naast de as. De echte tuien liggen in de kop over de
// breedte van een kap verspreid; hier ligt elke waaier in één verticaal vlak.
// Een tui van 0,2 m is op 1:1000 niet te printen en de lange tuien staan
// 19 graden: elke waaier is een plaat van 0,9 m met de tuien als ribben van
// 1,0 m breed die 0,25 m uitsteken, en tussen de ribben doorgaande driehoekige
// openingen (een verticale zijde en een bovenzijde van 55 graden), zodat geen
// vlak flauwer dan 50 graden vrij hangt. Onder de kortste tui (59 graden) is
// de doorgang open.
const N_STAYS = 8;
const ANCHOR_NAP = Array.from({ length: N_STAYS }, (_, k) => +(46.0 + 0.42 * k).toFixed(2));
const FEET = Array.from({ length: N_STAYS }, (_, k) => +(21 + 12.6 * k).toFixed(1));
const SAIL = { v: 5.175, thick: 0.9, foot: 0.2 };
const RIB = { base: 1.0, top: 0.4, proud: 0.25 };
const HOLE = { margin: 0.55, deck: 0.9, head: 0.6, gap: 0.9, minH: 1.5, minL: 1.2, maxL: 12, side: Math.tan((55 * Math.PI) / 180) };

// ---------- dek ----------
const deckSection = (x, { edge, depth, soffitHalf }) => {
  const zt = top(x);
  return [
    [-soffitHalf, zt - depth],
    [soffitHalf, zt - depth],
    [DECK.half, zt - edge],
    [DECK.half, zt],
    [-DECK.half, zt],
    [-DECK.half, zt - edge],
  ];
};
const DECK_STEP = 2;
const deckLoft = (x0, x1, kind) => loftX(stationsX(x0, x1, DECK_STEP).map((x) => ({ x, section: deckSection(x, kind) })));
const deck = union([deckLoft(SW_END, TRANSITION + 0.01, STAY_DECK), deckLoft(TRANSITION - 0.01, NE_END, APPROACH_DECK)]);
// Verhoogde strook van y0 tot y1 (0 < y0 < y1) aan beide kanten; met `margin`
// een iets grotere versie om af te trekken, met `full` over de hele hoogte van
// de snijstrook.
function kerb(y0, y1, height, margin = 0, full = false) {
  return [-1, 1].map((side) =>
    loftX(
      stationsX(SW_END - (margin ? 0.5 : 0), NE_END + (margin ? 0.5 : 0), DECK_STEP).map((x) => {
        const zt = top(x);
        const lo = full ? zt - 1.0 : zt - 0.1 - margin;
        const hi = full ? zt + 2.0 : zt + height + margin;
        const a = side * (y0 - margin);
        const b = side * (y1 + margin);
        return { x, section: [[Math.min(a, b), lo], [Math.max(a, b), lo], [Math.max(a, b), hi], [Math.min(a, b), hi]] };
      }),
    ),
  );
}
const kerbs = [...kerb(SEP.inner, SEP.outer, SEP.height), ...kerb(EDGE.inner, DECK.half, EDGE.height)];

// ---------- landhoofden en pijlers ----------
const abutment = (x0, x1) =>
  loftX(
    stationsX(x0, x1, 2).map((x) => ({
      x,
      section: [[-DECK.half - 0.4, BASE], [DECK.half + 0.4, BASE], [DECK.half + 0.4, top(x) - 0.05], [-DECK.half - 0.4, top(x) - 0.05]],
    })),
  );
const abutments = [abutment(SW_END, SW_FACE), abutment(NE_FACE, NE_END)];
const piers = PIERS.map(({ x, thick }) => boxFromTo(x - thick / 2, x + thick / 2, -PIER_HALF, PIER_HALF, BASE, soffitAt(x) + 0.5));

// ---------- pyloon ----------
const px = PYLON.x;
// Sloof met ronde koppen; sokkels onder de poten.
const footOutline = (() => {
  const pts = [];
  const n = 12;
  for (const side of [1, -1]) {
    for (let i = 0; i <= n; i++) {
      const a = (Math.PI * i) / n; // van +x via de kop naar -x
      const u = FOOT.half * Math.cos(a) * side;
      const v = side * (FOOT.straight + FOOT.end * Math.sin(a));
      pts.push([u, v]);
    }
  }
  return pts;
})();
const footSlab = prism(footOutline, BASE, Z(FOOT.slabNap));
const pads = [-1, 1].map((side) =>
  prism(footOutline, BASE, Z(FOOT.padNap)).intersect(boxFromTo(-5, 5, side * FOOT.padFrom, side * 20, BASE - 1, 50)),
);
// Poten: omhulling van de doorsnede op de sokkel en in de top.
const legs = [-1, 1].map((side) => {
  const pts = [];
  for (const nap of [FOOT.padNap - 0.01, PYLON.topNap]) {
    for (const t of [legInner(nap), legOuter(nap)]) {
      for (const dx of [-PYLON.along, PYLON.along]) pts.push([px + dx, side * t, Z(nap)]);
    }
  }
  return Manifold.hull(pts);
});
// Kop tussen de poten, met een afschuining en een verdiept vlak eronder.
const headHalf = legInner(PYLON.headBottomNap) + 1.0;
const head = boxFromTo(px - PYLON.along, px + PYLON.along, -headHalf, headHalf, Z(PYLON.headBottomNap), Z(PYLON.topNap));
const panelHalf = PYLON.along - PANEL.recess;
const chamferBottom = Z(PYLON.headBottomNap) - PANEL.recess * POINTED;
// Afschuining aan de onderkant van de kop, van de voor- en achterkant naar
// het verdiepte vlak.
const headHalfLow = legInner(PYLON.headBottomNap - PANEL.recess * POINTED) + 0.5;
const chamfer = profileY(
  [
    [px - PYLON.along, Z(PYLON.headBottomNap) + 0.01],
    [px + PYLON.along, Z(PYLON.headBottomNap) + 0.01],
    [px + panelHalf, chamferBottom],
    [px - panelHalf, chamferBottom],
  ],
  -headHalfLow,
  headHalfLow,
);
// Verdiept vlak met een spitse onderkant: top net onder de afschuining in
// het midden, aan beide kanten 50 graden omlaag tot in de poten.
const apexZ = chamferBottom - 0.05;
const panelV = (z) => legInner(z + WATER_NAP) + 0.4; // tot 0,4 m in de poot
const panelLowZ = apexZ - legInner(apexZ + WATER_NAP) * POINTED;
const panelSide = panelV(panelLowZ - 0.4 * POINTED);
const panel = profileX(
  [
    [-panelSide, panelLowZ - 0.4 * POINTED],
    [0, apexZ],
    [panelSide, panelLowZ - 0.4 * POINTED],
    [headHalfLow, chamferBottom + 0.01],
    [-headHalfLow, chamferBottom + 0.01],
  ],
  px - panelHalf,
  px + panelHalf,
);
const caps = [-1, 1].map((side) =>
  boxFromTo(px - CAP.half, px + CAP.half, side * CAP.inner, side * CAP.outer, Z(PYLON.topNap) - 0.01, Z(CAP.topNap)),
);
const pylon = union([footSlab, ...pads, ...legs, head, chamfer, panel, ...caps]);

// ---------- tuiwaaiers ----------
// Eén plaat op de westkant (+y) voor beide overspanningen; de oostkant is het
// spiegelbeeld. Coördinaat s langs de as vanaf de pyloon (x = px + s).
const zAnchors = ANCHOR_NAP.map(Z);
const foot = (s) => top(px + s) + SAIL.foot; // voet van plaat en ribben in de scheiding
// Tui k naar richting sigma in het (s, z)-vlak: van (0, zA_k) naar (sigma S_k, foot).
const cable = (k, sigma) => (s) => zAnchors[k] + ((foot(sigma * FEET[k]) - zAnchors[k]) * Math.abs(s)) / FEET[k];
const cosT = (k, sigma) => FEET[k] / Math.hypot(FEET[k], zAnchors[k] - foot(sigma * FEET[k]));
const last = N_STAYS - 1;
function sailOutline() {
  const deckRun = (s0, s1) => stationsX(s0, s1, 6).map((s) => [s, foot(s)]);
  return [
    ...deckRun(-FEET[last], -FEET[0]),
    [0, zAnchors[0]],
    ...deckRun(FEET[0], FEET[last]),
    [0, zAnchors[last]],
  ];
}
function sailHoles() {
  // Openingen tussen de tuien: rechthoekige driehoeken met de onderkant langs
  // de lagere tui (of 0,9 m boven de scheiding), een verticale zijde aan de
  // kant van de pyloon tot onder de hogere tui en een schuine bovenzijde van
  // minstens 55 graden naar het dek; tussen de openingen blijft een stijl van
  // 0,9 m staan.
  const holes = [];
  for (const sigma of [-1, 1]) {
    for (let k = 0; k < last; k++) {
      const lower = (s) => Math.max(top(px + sigma * s) + SEP.height + HOLE.deck, cable(k, sigma)(s) + HOLE.margin / cosT(k, sigma));
      const upper = (s) => cable(k + 1, sigma)(s) - HOLE.margin / cosT(k + 1, sigma);
      let s = PYLON.along + HOLE.head;
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
        else
          for (let it = 0; it < 50; it++) {
            const mid = (lo + hi) / 2;
            if (steep(mid) >= 0) lo = mid;
            else hi = mid;
          }
        const L = Math.min(lo, HOLE.maxL);
        if (L < HOLE.minL) {
          s += 0.25;
          continue;
        }
        // De spitse punt aan de kant van het dek wordt afgeknot op een
        // verticale zijde van 0,15 m, zodat de opening daar geen splinter
        // zonder dikte heeft.
        const zt = lower(s + L);
        const f = 1 - 0.15 / (zc - za);
        holes.push(
          [[s, za], [s + f * L, za + f * (zt - za)], [s + f * L, zc + f * (zt - zc)], [s, zc]].map(([q, z]) => [sigma * q, z]),
        );
        s += L + HOLE.gap;
      }
    }
  }
  return holes;
}
const toX = ([s, z]) => [px + s, z];
const sailHoleList = sailHoles();
const sailSection = new CrossSection([ccw(sailOutline().map(toX))]).subtract(new CrossSection(sailHoleList.map((h) => ccw(h.map(toX)))));
const plate = Manifold.extrude(sailSection, SAIL.thick)
  .rotate([90, 0, 0])
  .translate([0, SAIL.v + SAIL.thick / 2, 0]);
// Ribben langs de tuien: zeskantige doorsnede, 1,0 m breed op de plaat en
// 0,4 m op de top, aan beide kanten 0,25 m uitstekend.
const ribs = [-1, 1].flatMap((sigma) =>
  FEET.map((S, k) => {
    const a = [sigma * S, foot(sigma * S) - zAnchors[k]];
    const len = Math.hypot(a[0], a[1]);
    const p = [-a[1] / len, a[0] / len]; // loodrecht op de tui in het vlak
    const pts = [];
    for (const [x, z] of [[px, zAnchors[k]], [px + sigma * S, foot(sigma * S)]]) {
      for (const [w, y] of [[RIB.base / 2, SAIL.thick / 2], [RIB.top / 2, SAIL.thick / 2 + RIB.proud]]) {
        for (const sw of [-1, 1]) for (const sy of [-1, 1]) pts.push([x + sw * w * p[0], SAIL.v + sy * y, z + sw * w * p[1]]);
      }
    }
    return Manifold.hull(pts);
  }),
);
// Bij de kop lopen de ribben in een waaier samen; tussen twee ribben bleef
// daar een spleet zonder dikte. De eerste 8 m vanaf de pyloon is daarom de
// omhulling van de ribben: een bundel van 1,4 m dik, zoals de tuien daar ook
// dicht opeen in de kop verdwijnen.
const BUNDLE = 8;
const ribBody = union(ribs);
const bundles = [-1, 1].map((sigma) =>
  ribBody.intersect(boxFromTo(px, px + sigma * BUNDLE, SAIL.v - 2, SAIL.v + 2, 0, 80)).hull(),
);
const sailWest = union([plate, ribBody, ...bundles]);
const sails = [sailWest, sailWest.mirror([0, 1, 0])];

const bridge = union([deck, ...kerbs, ...abutments, ...piers, pylon, ...sails]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers en de pyloon vrij. Net als de
// overhangopvulling van de export krijgt de STL daaronder een wig van 50
// graden vanaf de onderkant van de dekrand die uitloopt in een scherm van
// minstens 0,8 mm op printschaal tot de onderplaat.
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const footStations = stationsX(SW_FACE, NE_FACE, 1).map((x) => {
  const zb = top(x) - edgeAt(x) - 0.02;
  const w = DECK.half;
  const ws = Math.max(SCREEN, w - (zb - BASE - 0.01) / POINTED);
  const zs = zb - POINTED * (w - ws);
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

// ---------- rijbaan en fietspaden als eigen onderdelen ----------
// De bovenste 0,5 m van het dek tussen de verhoogde stroken is een eigen node
// met de attributen van het BGT-wegdeel eronder (glTF `extras.attributes`),
// zodat de kleurregels van een thema op het brugdek werken zoals op de
// PDOK-wegdelen ernaast. Op het dek liggen actuele BGT-wegdelen met relatieve
// hoogteligging 1 (lokale coördinaten, vereenvoudigd tot 5 cm): de rijbaan van
// de N267 (rijbaan regionale weg, |y| ≤ 4,45) en aan beide kanten een fietspad
// (5,9 ≤ |y| ≤ 9,4), alle gesloten verharding, asfalt, in stukken tussen
// x = -121,1 en 428,2. De stroken cementbeton ertussen (rijbaan, |y| 4,45 tot
// 5,9) en langs de randen (fietspad, |y| 9,4 tot 10,55) liggen onder de
// scheidingen en de randen en blijven constructie.
const LAYER = 0.5;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const ROADWAY_BGT = [
  // P0030.00f6f9686b5cf68ae050120a080440dd
  [[92.87, -0.02], [113.13, -0.03], [113.13, 4.42], [-7.13, 4.45], [-7.12, -0.02]],
  // P0030.00f6f9686b5df68ae050120a080440dd
  [[92.87, -4.31], [113.13, -4.32], [113.13, -0.03], [-7.12, -0.02], [-7.12, -4.3]],
  // P0030.00f6f9686b5ef68ae050120a080440dd
  [[292.86, -4.51], [292.86, -0.02], [192.89, -0.06], [192.89, -4.5]],
  // P0030.00f6f9686b5ff68ae050120a080440dd
  [[292.86, -0.02], [292.86, 4.45], [192.89, 4.45], [192.89, -0.06]],
  // P0030.00f6f9687577f68ae050120a080440dd
  [[-7.12, -4.3], [-7.12, -0.02], [-121.11, 0.02], [-121.1, -4.29]],
  // P0030.00f6f9687578f68ae050120a080440dd
  [[-7.12, -0.02], [-7.13, 4.45], [-121.13, 4.49], [-121.11, 0.02]],
  // P0030.00f6f968766ff68ae050120a080440dd
  [[192.89, -4.5], [192.89, -0.06], [113.13, -0.03], [113.13, -4.32], [146.69, -4.48]],
  // P0030.00f6f9687754f68ae050120a080440dd
  [[192.89, -0.06], [192.89, 4.45], [113.13, 4.42], [113.13, -0.03]],
  // P0030.00f6f9687755f68ae050120a080440dd
  [[428.21, -4.52], [428.21, -0.06], [391.26, 0.01], [292.86, -0.02], [292.86, -4.51]],
  // P0030.00f6f968784cf68ae050120a080440dd
  [[428.21, -0.06], [428.21, 4.41], [322.09, 4.37], [292.86, 4.45], [292.86, -0.02], [391.26, 0.01]],
];
const BIKE_BGT = [
  // P0030.00f6f96892b8f68ae050120a080440dd
  [[-7.14, 5.95], [-7.13, 9.42], [-121.14, 9.39], [-121.13, 5.99]],
  // P0030.00f6f96893acf68ae050120a080440dd
  [[-7.11, -9.41], [-7.12, -5.9], [-121.09, -5.89], [-121.11, -9.38]],
  // P0030.00f6f96893adf68ae050120a080440dd
  [[192.89, -9.45], [192.89, -5.94], [113.13, -5.92], [113.14, -9.38]],
  // P0030.00f6f96893aef68ae050120a080440dd
  [[192.89, 5.91], [192.89, 9.39], [113.13, 9.44], [113.13, 5.92]],
  // P0030.00f6f96893b6f68ae050120a080440dd
  [[428.2, -9.41], [428.21, -5.95], [292.86, -5.96], [292.86, -9.42]],
  // P0030.00f6f96894a4f68ae050120a080440dd
  [[428.21, 5.95], [428.22, 9.38], [292.87, 9.39], [292.86, 5.9]],
  // P0030.00f6f96894adf68ae050120a080440dd
  [[92.88, 5.93], [113.13, 5.92], [113.13, 9.44], [-7.13, 9.42], [-7.14, 5.95]],
  // P0030.00f6f96895a0f68ae050120a080440dd
  [[92.87, -9.43], [113.14, -9.38], [113.13, -5.92], [-7.12, -5.9], [-7.11, -9.41]],
  // P0030.00f6f96895a1f68ae050120a080440dd
  [[292.86, 5.9], [292.87, 9.39], [192.89, 9.39], [192.89, 5.91]],
  // P0030.00f6f96895a2f68ae050120a080440dd
  [[292.86, -9.42], [292.86, -5.96], [192.89, -5.94], [192.89, -9.45]],
];
// De BGT-grenzen liggen binnen 0,1 m van de verhoogde stroken van het model:
// de rijbaan tussen de scheidingen, de fietspaden tussen een scheiding en een
// rand.
for (const [label, rings, lo, hi] of [
  ["rijbaan", ROADWAY_BGT, 0, SEP.inner],
  ["fietspad", BIKE_BGT, SEP.outer, EDGE.inner],
]) {
  for (const ring of rings) {
    for (const [x, y] of ring) {
      if (x < SW_END - 0.1 || x > NE_END + 0.1 || Math.abs(y) < lo - 0.1 || Math.abs(y) > hi + 0.1) throw new Error(`BGT-${label} buiten zijn strook: ${x}, ${y}`);
    }
  }
}
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, over dezelfde
// loftstations als het dek en 0,5 m voorbij de uiteinden, tot 2 cm voor de
// randen. De scheidingen met de tuiplaten en ribben erin blijven constructie:
// hun hele strook over de volle hoogte, met 2 cm vrij.
const ABOVE = 1.0;
const strip = loftX(
  stationsX(SW_END - 0.5, NE_END + 0.5, DECK_STEP).map((x) => {
    const zt = top(x);
    const y = EDGE.inner - 0.02;
    return { x, section: [[-y, zt - LAYER], [y, zt - LAYER], [y, zt + ABOVE], [-y, zt + ABOVE]] };
  }),
);
const sepGuards = union(kerb(SEP.inner, SEP.outer, SEP.height, 0.02, true));
{
  // De tuiplaten en ribben vallen in de laag helemaal binnen de scheidingen.
  const outside = union(sails).intersect(strip).subtract(sepGuards).volume();
  if (outside > 1e-4) throw new Error(`tuiwaaier buiten de scheiding in het wegdek: ${outside} m3`);
}
const roadCut = strip.subtract(sepGuards);
const middle = boxFromTo(SW_END - 2, NE_END + 2, -(SEP.inner + SEP.outer) / 2, (SEP.inner + SEP.outer) / 2, BASE - 1, 100);
const roadwayCut = roadCut.intersect(middle);
const bikeCut = roadCut.subtract(middle);
const roadway = roadwayCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const structure = bridge.subtract(roadCut);
{
  // De onderdelen samen zijn de brug: de volumes tellen op, zonder overlap.
  const whole = bridge.volume();
  const sum = roadway.volume() + bikeway.volume() + structure.volume();
  console.log("partitie (m3):", {
    brug: +whole.toFixed(2),
    rijbaan: +roadway.volume().toFixed(2),
    fietspad: +bikeway.volume().toFixed(2),
    constructie: +structure.volume().toFixed(2),
    verschil: +(sum - whole).toFixed(4),
  });
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error(`partitie: ${sum} tegen ${whole}`);
  if (roadway.intersect(structure).volume() > 1e-3 || bikeway.intersect(structure).volume() > 1e-3) throw new Error("wegdeel en constructie overlappen");
}
const parts = [
  ["building:brug-bij-heusden", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
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
  // In het model hangen alleen de onderkant van het dek, de sokkels en de
  // pijlers vrij (onder het dek); boven het wegdek niets.
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
report.pylon = {
  x: px,
  headTopZ: Z(PYLON.topNap),
  capTopZ: Z(CAP.topNap),
  panelApexZ: +apexZ.toFixed(2),
  panelLowZ: +panelLowZ.toFixed(2),
  legOuterAtDeck: PYLON.outerDeck,
  legOuterAtTop: PYLON.outerTop,
  anchorsNap: ANCHOR_NAP,
  stayFeetFromPylonM: FEET,
  openingsPerPlate: sailHoleList.length,
};
const glbFile = path.join(outDir, "brug-bij-heusden.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-brug-bij-heusden.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, sloof, landhoofden en printvoet
// op het printbed.
const stlName = `brug-bij-heusden-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Brug bij Heusden 1:${scale} mm Z-up`);
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
// lengte: op de zuidelijke uiterwaard, op de Bergsche Maas en op de noordelijke
// uiterwaard.
const samplePoints = [-95, -45, 0, 45, 90, 150, 220, 290, 360].flatMap((x) => [
  [x, 20],
  [x, -20],
]);
await writeFile(
  path.join(outDir, "brug-bij-heusden.json"),
  JSON.stringify(
    {
      name: "Brug bij Heusden",
      file: "brug-bij-heusden.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [136424.26, 416375.78],
      xAxis: [-0.286211, 0.958167],
      groundOffsetMetres: GROUND_OFFSET,
      // Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten: de
      // Bergsche Maas. Terugval als een uitsnede alleen een uiteinde van de
      // brug raakt.
      groundHeight: 44.21,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "P0030.00f6f96959eaf68ae050120a080440dd",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek op de sloof van de pyloon op de waterspiegel van de Bergsche Maas (z = 0, NAP +0,63 m zoals het PDOK-terrein het water legt) in de oorsprong, +X langs de brug naar het noorden (Hedikhuizen, RD-richting 106,63 graden vanaf het oosten) en +Y naar het westen. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van het dek tussen de verhoogde stroken met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan regionale weg voor de rijbaan van de N267 met |y| ≤ 4,45, fietspad voor de twee fietspaden met 5,9 ≤ |y| ≤ 9,4; bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het dek van 21,1 m breed van het zuidelijke landhoofd (x = -127,9) tot het noordelijke (x = 435,0) met het wegdek op NAP +11,0 tot +11,46 en +8,9 m, als slanke ligger in de tuioverspanning en als kokerligger op de aanbrug, met scheidingen van 0,9 m tussen rijbaan en fietspaden en randen van 0,5 m in plaats van leuningen; de portaalpyloon op x = -0,4 met twee hellende poten (buitenkant 13,1 m naast de as op dekhoogte, 9,1 m in de top), een kop van NAP +45,3 tot +49,7 m die onder via een afschuining van 50 graden overgaat in een 0,35 m verdiept vlak met een spitse onderkant van 50 graden vanaf de poten (zodat de kop niet vlak boven het dek hangt), twee rode kappen tot NAP +51,4 m, en een sloof met ronde koppen en sokkels tot NAP +5,5 m in de rivier; per kant en per overspanning een waaier van acht tuien (in de kop op NAP +46,0 tot +48,9 m, op het dek 21 tot 109 m van de pyloon), op 1:1000 als platen van 0,9 m op de scheiding met de tuien als ribben en doorgaande driehoekige openingen (verticale zijde, bovenzijde 55 graden), onder de kortste tui open; de overgangspijler en zes wandpijlers onder de aanbrug en twee landhoofden. Leuningen, lantaarns, de geleidewerken bij de pyloon en de bliksemafleiders zijn weggelaten; de echte tuien liggen over de breedte van een kap verspreid, hier per waaier in één vlak. De export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt naast de brug bemonsterd; groundHeight is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten, de Bergsche Maas. Geen BAG-pand onder de brug. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(NE_END - SW_END).toFixed(1),
        deckWidthM: 2 * DECK.half,
        pylonX: px,
        southSpanM: +(px - SW_FACE).toFixed(1),
        northSpanM: +(TRANSITION - px).toFixed(1),
        headTopNapM: PYLON.topNap,
        capTopNapM: CAP.topNap,
        headBottomNapM: PYLON.headBottomNap,
        stayAnchorsNapM: ANCHOR_NAP,
        stayFeetFromPylonM: FEET,
        piersX: PIERS.map(({ x }) => x),
        deckNapM: { south: DECK_NAP[0], pylon: +deckNap(px).toFixed(2), north: DECK_NAP[DECK_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Brug_bij_Heusden",
        "PDOK BGT overbruggingsdeel (dek P0030.00f6f96959eaf68ae050120a080440dd, landhoofden, sloof, pijlers) en wegdeel (rijbaan regionale weg en fietspad, asfalt, relatieve hoogteligging 1), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de pyloon, de sokkels en de scheidingen",
        "PDOK luchtfoto (Actueel_orthoHR) voor de kappen, de tuivlakken en de indeling van het dek",
        "Wikimedia Commons: N267 bij Heusden.jpg, 2007-10-07 12.42 Heusden, brug over de Bergse Maas foto2.JPG, Heusden-Aalburg Bridge.JPG, Overzicht van de overgebleven elementen van de oude brug over de Bergsche Maas, de nieuwe brug op de achtergrond - Heusden - 20413539 - RCE.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

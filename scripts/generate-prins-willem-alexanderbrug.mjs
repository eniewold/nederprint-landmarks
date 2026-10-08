// Genereert een vereenvoudigd, gesloten 3D-model van de Prins
// Willem-Alexanderbrug over de Waal tussen Echteld (bij Tiel) en Wamel /
// Beneden-Leeuwen (N323, 1974): de eerste betonnen tuibrug van Nederland, een
// kokerbrug met overspanningen van 77,5 - 95 - 267 - 95 - 77,5 m en twee
// pylonen van elk twee betonnen kolommen met een dwarsregel, met per kolom vier
// in beton gestorte tuien (twee naar de hoofdoverspanning, twee naar de
// zijoverspanning) in twee tuivlakken 10,7 m naast de as, plus de lange
// aanbrug over de noordelijke uiterwaard in een flauwe bocht (straal 5970 m)
// op dubbele wandpijlers. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, per onderdeel een node met de
// materiaalklasse in de nodenaam: de constructie als building, de rijbaan van
// de N323 en de parallelle rijbanen van de lokale weg op het dek als road met
// de BGT-attributen) als catalogusbron voor de export en de kaart, plus een
// binaire STL in millimeters op 1:<schaal> met een printvoet onder het dek. De
// brug is 1416 m lang en past op 1:1000 niet in 400 mm, vandaar standaard
// 1:3600 (393 mm).
//
//   node scripts/generate-prins-willem-alexanderbrug.mjs              # 1:3600 (standaard)
//   node scripts/generate-prins-willem-alexanderbrug.mjs --scale 1000
//
// Assenstelsel: oorsprong op de as van het BGT-dek midden tussen de twee
// pylonen (RD 162596,26, 433401,25), op de waterspiegel van de Waal zoals het
// PDOK-terrein die legt (ellipsoïdisch 48,06 m, NAP +4,46 m), Z omhoog. +X
// loopt langs het rechte deel van de brug naar het noorden (Echteld, RD-richting
// 90,54 graden vanaf het oosten), +Y naar het westen, stroomafwaarts. Vanaf de
// overgangspijler op x = 306 buigt de as van de aanbrug naar het westen af:
// y = (x - 306)² / (2 · 5970).
//
// Bronnen: BGT overbruggingsdeel (dek van 31,2 m breed op het tuibruggedeelte
// en 27,3 m op de aanbrug, van het zuidelijke landhoofd op x = -306,4 tot het
// noordelijke op x = 1110; de pylonkolommen van 5,1 × 2 m op x = ±133,5 en
// y = ±10,7; de tuiankers op het dek op 45,9 en 92,6 m van de pylonen; de
// pijlers met ronde koppen: pylonpijlers 7,1 × 37,2 m, zijpijlers 3,0 × 29,5 m
// op x = ±228,4, overgangspijler 3,0 × 25,6 m op x = 306, aanbrugpijlers twee
// wanden van 2,1 × 9,2 m per steunpunt om de 78,2 m); BGT wegdeel en
// ondersteunend wegdeel voor de rijbanen op het dek; AHN DSM 0,5 m (PDOK WCS)
// voor het lengteprofiel van het wegdek (NAP +21,4 m op de zuidelijke dijk,
// +23,5 m midden in de hoofdoverspanning, +15,1 m op de noordelijke dijk), de
// toppen van de pylonkolommen (NAP +69,0 m), de dwarsregel (bovenkant circa
// NAP +54,5 m) en de ligging van de tuien; PDOK-terrein voor de waterspiegel en
// het verschil tussen NAP en de ellipsoïde (43,59 m op de uiterwaarden);
// PDOK-luchtfoto voor de kolommen, de dwarsregel, de ronde koppen van de
// pijlers en de voegen; Wikipedia voor bouwjaar, lengte (1419 m), breedte
// (31 m), overspanningen en doorvaarthoogte (NAP +19,6 m over 260 m);
// Wikimedia Commons-foto's voor de vorm van kolommen, kap, dwarsregel, tuien,
// ankerblokken, pijlers en caissons. Geschat (foto's): de hoogte van de
// caissons (NAP +13 m), de koker (3,6 m hoog), de positie en breedte van de
// kolommen onder het dek.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "3600"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "prins-willem-alexanderbrug");
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
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
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
// Stadion in plattegrond (lengte lx langs x, breedte ly langs y, ronde koppen
// aan de y-einden), gecentreerd in de oorsprong.
function stadium(lx, ly, z0, z1) {
  const r = lx / 2;
  const h = z1 - z0;
  return Manifold.hull([
    Manifold.cylinder(h, r, r, 32, false).translate([0, -(ly / 2 - r), z0]),
    Manifold.cylinder(h, r, r, 32, false).translate([0, ly / 2 - r, z0]),
  ]);
}

// ---------- hoofdmaten ----------
// Het PDOK-terrein legt de Waal op ellipsoïdisch 48,06 m; op de uiterwaarden
// ligt het PDOK-terrein 43,59 m boven het AHN (NAP), dus de waterspiegel ligt
// op NAP +4,46 m. Dat is z = 0 in het model.
const WATER_NAP = 4.46;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten op de Waal,
// als terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 48.06;

// As: recht tot de overgangspijler, daarna een boog naar het westen (BGT-dek,
// kleinste kwadraten op de middens van het dek en de aanbrugpijlers).
const CURVE = { x0: 306.0, radius: 5970 };
const yc = (x) => (x > CURVE.x0 ? (x - CURVE.x0) ** 2 / (2 * CURVE.radius) : 0);
const slope = (x) => (x > CURVE.x0 ? (x - CURVE.x0) / CURVE.radius : 0);
// Breedtes dwars op de as gemeten; in de doorsneden (loodrecht op X) zijn ze
// met deze factor verbreed.
const kY = (x) => Math.hypot(1, slope(x));

// Wegdek in NAP-meters om de 10 m vanaf x = -310: 30e percentiel van het
// AHN-DSM over de rijstroken (|y| < 8 m), mediaan over 14 m en licht
// gladgestreken; bij de pylonen (kolommen en tuien in het DSM) lineair.
const DECK_X0 = -310;
const DECK_NAP = [
  21.41, 21.53, 21.66, 21.8, 21.94, 22.07, 22.2, 22.34, 22.49, 22.58, 22.67, 22.76, 22.84, 22.93, 23.03, 23.09,
  23.16, 23.23, 23.27, 23.32, 23.38, 23.44, 23.46, 23.46, 23.47, 23.48, 23.51, 23.5, 23.44, 23.44, 23.47, 23.49,
  23.5, 23.5, 23.52, 23.51, 23.52, 23.51, 23.51, 23.5, 23.48, 23.44, 23.4, 23.36, 23.29, 23.24, 23.17, 23.1,
  23.02, 22.95, 22.87, 22.8, 22.72, 22.64, 22.54, 22.45, 22.35, 22.25, 22.18, 22.1, 22.0, 21.91, 21.83, 21.72,
  21.61, 21.51, 21.43, 21.34, 21.3, 21.23, 21.12, 21.03, 20.94, 20.87, 20.77, 20.68, 20.59, 20.51, 20.43, 20.31,
  20.21, 20.13, 20.03, 19.95, 19.88, 19.79, 19.72, 19.62, 19.53, 19.45, 19.37, 19.28, 19.21, 19.12, 19.05, 18.97,
  18.9, 18.8, 18.7, 18.62, 18.56, 18.51, 18.36, 18.28, 18.19, 18.08, 18.0, 17.92, 17.84, 17.77, 17.68, 17.59,
  17.53, 17.46, 17.37, 17.26, 17.17, 17.08, 16.98, 16.88, 16.79, 16.7, 16.63, 16.55, 16.47, 16.39, 16.31, 16.22,
  16.16, 16.07, 15.98, 15.9, 15.82, 15.73, 15.64, 15.56, 15.48, 15.41, 15.35, 15.29, 15.22, 15.14, 15.08, 14.97,
];
const deckNap = (x) => {
  const f = Math.min(Math.max((x - DECK_X0) / 10, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t;
};
const top = (x) => Z(deckNap(x)); // wegdek in modelhoogte op lokale x

// Landhoofden (BGT). Het zuidelijke staat haaks op de rechte as, het
// noordelijke haaks op de boog; zijn achter- en voorkant als lijnen in lokale
// coördinaten.
const SOUTH_END = -306.4;
const SOUTH_FACE = -303.6;
const NORTH_BACK = [[1109.66, 39.98], [1105.86, 67.23]];
const NORTH_FRONT = [[1108.03, 39.76], [1104.22, 67.0]];
const NORTH_LOFT_END = 1116;
// Halfvlak achter (noordelijk van) een lijn door twee punten, verschoven met
// `offset` meter naar het noorden: trim houdt de zuidkant.
function keepSouthOf([[ax, ay], [bx, by]], offset = 0) {
  let nx = by - ay;
  let ny = -(bx - ax);
  const len = Math.hypot(nx, ny);
  nx /= len;
  ny /= len;
  if (nx > 0) {
    nx = -nx;
    ny = -ny;
  }
  // Houd dot(n, p) >= d, met n naar het zuiden.
  return (solid) => solid.trimByPlane([nx, ny, 0], nx * ax + ny * ay - offset);
}

// Dek (BGT): 31,24 m breed tot x = 230, versmald tot 27,3 m op de
// overgangspijler (x = 306) en verder over de aanbrug.
const halfWidth = (x) => (x <= 230 ? 15.62 : x >= 306 ? 13.65 : 15.62 + ((13.65 - 15.62) * (x - 230)) / 76);
// Doorsnede (foto's, geschat): een plaat met een gevelrand van 0,9 m en een
// schuine onderkant naar de koker (1,6 m onder het wegdek); op het
// tuibruggedeelte één koker, onder 15 m en boven 17 m breed, op de aanbrug
// twee kokers onder de twee pijlerwanden (onder 8,4 m, boven 9,2 m breed). De
// koker is 3,6 m hoog: onder de doorvaarthoogte van NAP +19,6 m bij de
// pylonen (wegdek daar NAP +23,3 m).
const DECK = { fascia: 0.9, root: 1.6, depth: 3.6 };
const MAIN_BOX = { top: 8.5, bottom: 7.5 };
const TWIN_BOX = { centre: 6.85, top: 4.6, bottom: 4.2 };
const KERB = { width: 0.9, height: 0.5 };

// Pylonen (BGT, AHN): kolommen van 5,0 m langs de as en 2,6 m dwars, met het
// hart 10,7 m naast de as op x = ±133,5; de top (kap) op NAP +69,0 m. Onder het
// dek zijn de poten breder en staan ze verder naar binnen (foto's: 6,0 × 5,4
// m, van 6,6 tot 12,0 m naast de as), op het caisson van de pylonpijler.
const PYLON_X = [-133.5, 133.5];
const COLUMN = { t: 10.7, half: 2.5, halfT: 1.3, topNap: 69.0, capNap: 65.5 };
const LEG = { half: 3.0, t0: 6.6, t1: 12.0 };
// Dwarsregel tussen de kolommen (AHN, luchtfoto): 4,5 m langs de as, van
// NAP +50,0 tot +54,5 m. De onderkant heeft een spitse groef van 50 graden over
// de hele lengte, zodat hij zonder steun print (van opzij blijft het een balk).
const CROSSBEAM = { half: 2.25, bottomNap: 50.0, topNap: 54.5 };
// Caissons van de pijlers tot NAP +13 m (foto's, geschat), met de BGT-vorm.
const CAISSON_NAP = 13.0;
const PIERS = {
  pylon: { lx: 7.1, ly: 37.2 },
  side: { xs: [-228.4, 228.6], lx: 3.0, ly: 29.5, colT: 8.9, colHalfT: 3.0 },
  transition: { x: 306.0, lx: 3.0, ly: 25.6, colT: 7.6, colHalfT: 3.0 },
};
// Aanbrugpijlers (BGT): per steunpunt twee wanden met ronde koppen, 2,1 × 9,2
// m, met het hart 6,85 m naast de as van de boog.
const APPROACH_PIERS = [384.8, 462.5, 541.4, 619.7, 698.0, 776.3, 854.5, 932.8, 1010.8, 1088.5];
const APPROACH_WALL = { lx: 2.1, ly: 9.2, centre: 6.85 };

// Tuien (BGT-ankers, AHN): per kolom vier, in het vlak van de kolom (10,7 m
// naast de as), van de kap (NAP +67,2 m, 2 m naast het hart van de kolom) naar
// ankerblokken op het dek op 45,9 m (binnenste) en 92,6 m (buitenste) van de
// pylon, naar beide kanten. De binnenste staan 44 graden, de buitenste 25,5
// graden. Ankerblokken: buitenste 5 × 2 m, binnenste 2 × 2 m (BGT), 1,2 m
// boven het wegdek.
const STAY = { attachD: 2.0, attachNap: 67.2, inner: 45.9, outer: 92.6 };
const ANCHOR = { outer: 2.5, inner: 1.0, halfT: 1.0, height: 1.2 };
// Printbaarheid: een tui van 1,2 m die 25 tot 44 graden helt is op 1:1000 niet
// vrij te printen. Elk tuivlak (per kolom en per kant) is daarom een plaat van
// 0,9 m dik tussen kolom, dek en buitenste tui, met de tuien als ribben van
// 1,1 m die 0,3 m uitsteken en met doorgaande openingen: onder de binnenste
// tui een rechthoekige driehoek tegen de kolom met een schuine zijde van 50
// graden, daarboven en daarbuiten driehoeken met de punt omhoog (zijden van 50
// graden) en een vlakke vloer. Tussen de openingen blijven stijlen van minstens
// 0,9 m, langs de tuien 0,9 m naast de rib, en langs het dek een strook van
// 1 m (de leuning).
const SAIL = { thick: 0.9, rail: 1.0, web: 0.9, minBase: 3.0, columnGap: 0.3 };
const RIB = { base: 1.1, top: 0.5, proud: 0.3 };
const POINTED = Math.tan((50 * Math.PI) / 180);

// ---------- dek ----------
const deckSection = (x, root) => {
  const zt = top(x);
  const c = yc(x);
  const k = kY(x);
  const h = halfWidth(x) * k;
  return [
    [c - h, zt - DECK.fascia],
    [c - root * k, zt - DECK.root],
    [c + root * k, zt - DECK.root],
    [c + h, zt - DECK.fascia],
    [c + h, zt],
    [c - h, zt],
  ];
};
const boxSection = (x, centre, halfTop, halfBottom) => {
  const zt = top(x);
  const c = yc(x) + centre * kY(x);
  const k = kY(x);
  return [
    [c - halfBottom * k, zt - DECK.depth],
    [c + halfBottom * k, zt - DECK.depth],
    [c + halfTop * k, zt - 1.0],
    [c - halfTop * k, zt - 1.0],
  ];
};
const northTrim = keepSouthOf(NORTH_BACK);
const slabMain = loftX(stationsX(SOUTH_END, CURVE.x0 + 0.01, 2).map((x) => ({ x, section: deckSection(x, MAIN_BOX.top) })));
const slabApproach = northTrim(
  loftX(
    stationsX(CURVE.x0 - 0.01, NORTH_LOFT_END, 2).map((x) => ({
      x,
      section: deckSection(x, TWIN_BOX.centre + TWIN_BOX.top),
    })),
  ),
);
const mainBox = loftX(
  stationsX(SOUTH_FACE, CURVE.x0 + 0.01, 2).map((x) => ({ x, section: boxSection(x, 0, MAIN_BOX.top, MAIN_BOX.bottom) })),
);
const twinBoxes = [-1, 1].map((side) =>
  keepSouthOf(NORTH_FRONT)(
    loftX(
      stationsX(CURVE.x0 - 0.01, NORTH_LOFT_END, 2).map((x) => ({
        x,
        section: boxSection(x, side * TWIN_BOX.centre, TWIN_BOX.top, TWIN_BOX.bottom),
      })),
    ),
  ),
);
// Schampkanten langs de randen in plaats van de leuningen.
function kerbLoft(side, grow = 0) {
  return northTrim(
    loftX(
      stationsX(SOUTH_END - grow, NORTH_LOFT_END, 2).map((x) => {
        const zt = top(x);
        const c = yc(x);
        const k = kY(x);
        const a = c + side * (halfWidth(x) - KERB.width - grow) * k;
        const b = c + side * (halfWidth(x) + grow) * k;
        return {
          x,
          section: [[Math.min(a, b), zt - 0.1], [Math.max(a, b), zt - 0.1], [Math.max(a, b), zt + KERB.height + grow], [Math.min(a, b), zt + KERB.height + grow]],
        };
      }),
    ),
    grow,
  );
}
const kerbs = [-1, 1].map((side) => kerbLoft(side));

// ---------- landhoofden ----------
const southAbutment = loftX(
  stationsX(SOUTH_END, SOUTH_FACE, 1).map((x) => ({
    x,
    section: [[-15.62, BASE], [15.62, BASE], [15.62, top(x) - 0.05], [-15.62, top(x) - 0.05]],
  })),
);
const northAbutment = prism([NORTH_FRONT[0], NORTH_BACK[0], NORTH_BACK[1], NORTH_FRONT[1]], BASE, Math.min(top(1104), top(1110)) - 0.05);

// ---------- pijlers ----------
const soffit = (x) => top(x) - DECK.depth;
// Een element in plattegrond langs de boog plaatsen: lokaal gebouwd rond de
// oorsprong (x langs de as), gedraaid naar de raaklijn en verschoven naar het
// punt op `rel` meter naast de as.
function onCurve(solid, x, rel) {
  const a = Math.atan(slope(x));
  return solid.rotate([0, 0, (a * 180) / Math.PI]).translate([x - rel * Math.sin(a), yc(x) + rel * Math.cos(a), 0]);
}
const pylonPiers = PYLON_X.map((x) => {
  const caisson = stadium(PIERS.pylon.lx, PIERS.pylon.ly, BASE, Z(CAISSON_NAP)).translate([x, 0, 0]);
  const legs = [-1, 1].map((side) =>
    boxFromTo(x - LEG.half, x + LEG.half, side * LEG.t0, side * LEG.t1, Z(CAISSON_NAP) - 0.5, top(x) - 1.0),
  );
  return union([caisson, ...legs]);
});
const sidePiers = PIERS.side.xs.map((x) => {
  const p = PIERS.side;
  const caisson = stadium(p.lx, p.ly, BASE, Z(CAISSON_NAP)).translate([x, 0, 0]);
  const cols = [-1, 1].map((side) =>
    boxFromTo(x - p.lx / 2, x + p.lx / 2, side * (p.colT - p.colHalfT), side * (p.colT + p.colHalfT), Z(CAISSON_NAP) - 0.5, top(x) - 1.0),
  );
  return union([caisson, ...cols]);
});
const transitionPier = (() => {
  const p = PIERS.transition;
  const caisson = stadium(p.lx, p.ly, BASE, Z(CAISSON_NAP)).translate([p.x, 0, 0]);
  const cols = [-1, 1].map((side) =>
    boxFromTo(p.x - p.lx / 2, p.x + p.lx / 2, side * (p.colT - p.colHalfT), side * (p.colT + p.colHalfT), Z(CAISSON_NAP) - 0.5, top(p.x) - 1.0),
  );
  return union([caisson, ...cols]);
})();
const approachPiers = APPROACH_PIERS.flatMap((x) =>
  [-1, 1].map((side) => onCurve(stadium(APPROACH_WALL.lx, APPROACH_WALL.ly, BASE, soffit(x) + 0.3), x, side * APPROACH_WALL.centre)),
);

// ---------- pylonen ----------
// Kolom met kap: tot NAP +65,5 m recht, daarboven een afgeronde kap die tot
// 3,0 m naast het hart uitwijkt (de zadels van de tuien) en in de top 2,4 m
// breed is (foto's, AHN-top NAP +69,0 m).
const CAP = [
  [-COLUMN.half, Z(COLUMN.capNap)],
  [-3.0, Z(67.2)],
  [-2.4, Z(68.4)],
  [-1.2, Z(COLUMN.topNap)],
  [1.2, Z(COLUMN.topNap)],
  [2.4, Z(68.4)],
  [3.0, Z(67.2)],
  [COLUMN.half, Z(COLUMN.capNap)],
];
function column(xp, side) {
  const y0 = side * COLUMN.t - COLUMN.halfT;
  const y1 = side * COLUMN.t + COLUMN.halfT;
  const shaft = boxFromTo(xp - COLUMN.half, xp + COLUMN.half, y0, y1, top(xp) - 1.0, Z(COLUMN.capNap) + 0.01);
  const cap = profileY(CAP.map(([d, z]) => [xp + d, z]), y0, y1);
  return union([shaft, cap]);
}
function crossbeam(xp) {
  const zb = Z(CROSSBEAM.bottomNap);
  const zt = Z(CROSSBEAM.topNap);
  const h = CROSSBEAM.half;
  const apex = zb + h * POINTED;
  const y = COLUMN.t - COLUMN.halfT + 0.3;
  return profileX(
    [
      [-h, zb],
      [0, apex],
      [h, zb],
      [h, zt],
      [-h, zt],
    ],
    xp,
    -y,
    y,
  );
}
// Polygoon in het XZ-vlak relatief aan xp ([dx, z]), uitgetrokken langs Y.
function profileX(points, xp, y0, y1) {
  return profileY(points.map(([dx, z]) => [xp + dx, z]), y0, y1);
}

// ---------- tuivlakken ----------
// Rib langs een tui van (x0, z0) naar (x1, z1) in het vlak y = 0 (lokaal):
// zeskantige doorsnede, 1,1 m breed op de plaat, 0,5 m op de top.
function rib(x0, z0, x1, z1, grow = 0) {
  const len = Math.hypot(x1 - x0, z1 - z0);
  const p = [-(z1 - z0) / len, (x1 - x0) / len];
  const pts = [];
  for (const [x, z] of [[x0, z0], [x1, z1]]) {
    for (const [w, y] of [[RIB.base / 2 + grow, SAIL.thick / 2 + grow], [RIB.top / 2 + grow, SAIL.thick / 2 + RIB.proud + grow]]) {
      for (const sw of [-1, 1]) for (const sy of [-1, 1]) pts.push([x + sw * w * p[0], sy * y, z + sw * w * p[1]]);
    }
  }
  return Manifold.hull(pts);
}
// Eén tuivlak: kolom op xp, tuien naar richting dir (+1 of -1), in het vlak
// y = side · 10,7. Openingen en tuien worden in (d, z) bepaald, met d de
// afstand tot het hart van de kolom.
function sail(xp, dir, side) {
  const X = (d) => xp + dir * d;
  const dt = (d) => top(X(d));
  const attach = [STAY.attachD, Z(STAY.attachNap)];
  const foot = (d) => [d, dt(d) + 0.6];
  const line = ([d0, z0], [d1, z1]) => (d) => z0 + ((z1 - z0) * (d - d0)) / (d1 - d0);
  const innerFoot = foot(STAY.inner);
  const outerFoot = foot(STAY.outer);
  const si = line(attach, innerFoot);
  const so = line(attach, outerFoot);
  // Verticale afstand van de as van de tui tot de rand van een opening: halve
  // rib plus een stijl van 0,9 m, loodrecht op de tui.
  const clear = ([d0, z0], [d1, z1]) => (RIB.base / 2 + SAIL.web) / Math.cos(Math.atan(Math.abs((z1 - z0) / (d1 - d0))));
  const ci = clear(attach, innerFoot);
  const co = clear(attach, outerFoot);
  const floorAt = (d) => dt(d) + SAIL.rail;
  const sample = (a, b, f) => {
    let m = -Infinity;
    for (let k = 0; k <= 40; k++) m = Math.max(m, f(a + ((b - a) * k) / 40));
    return m;
  };
  const openings = [];
  // A: rechthoekige driehoek tegen de kolom onder de binnenste tui.
  {
    const d0 = COLUMN.half + SAIL.columnGap;
    const zTop = si(d0) - ci;
    let floor = floorAt(d0);
    let dA = d0;
    for (let it = 0; it < 4; it++) {
      dA = d0 + (zTop - floor) / POINTED;
      floor = sample(d0, dA, floorAt);
    }
    openings.push([[d0, floor], [dA, floor], [d0, zTop]]);
  }
  // Driehoeken met de punt omhoog en een vlakke vloer, gulzig van de kolom
  // naar buiten gepakt tussen een onder- en een bovengrens: in de wig tussen
  // opening A en de binnenste tui (tot het anker), en boven de binnenste tui
  // en het dek onder de buitenste tui.
  function pack(lower, upper, start, end) {
    const fits = (d1, b) => {
      const zb = sample(d1, d1 + b, lower);
      for (let k = 0; k <= 60; k++) {
        const d = d1 + (b * k) / 60;
        if (zb + POINTED * Math.min(d - d1, d1 + b - d) > upper(d) + 1e-9) return null;
      }
      return zb;
    };
    let d1 = start;
    while (d1 + SAIL.minBase < end) {
      if (fits(d1, SAIL.minBase) === null) {
        d1 += 0.25;
        continue;
      }
      let lo = SAIL.minBase;
      let hi = end - d1;
      for (let it = 0; it < 30; it++) {
        const mid = (lo + hi) / 2;
        if (fits(d1, mid) !== null) lo = mid;
        else hi = mid;
      }
      const b = Math.floor(lo * 20) / 20;
      const zb = fits(d1, b);
      openings.push([[d1, zb], [d1 + b, zb], [d1 + b / 2, zb + (POINTED * b) / 2]]);
      d1 += b + SAIL.web;
    }
  }
  const dA = openings[0][1][0];
  pack(floorAt, (d) => si(d) - ci, dA + SAIL.web, STAY.inner);
  pack((d) => Math.max(floorAt(d), si(d) + ci), (d) => so(d) - co, COLUMN.half + 0.5, STAY.outer);
  const plate = profileY(
    [
      [X(1.0), dt(1.0) - 0.3],
      [X(STAY.outer), dt(STAY.outer) - 0.3],
      [X(outerFoot[0]), outerFoot[1]],
      [X(attach[0]), attach[1]],
      [X(1.0), attach[1]],
    ],
    -SAIL.thick / 2,
    SAIL.thick / 2,
  );
  const holes = openings.map((tri) => profileY(tri.map(([d, z]) => [X(d), z]), -SAIL.thick, SAIL.thick));
  const ribs = [innerFoot, outerFoot].map(([d, z]) => rib(X(attach[0]), attach[1], X(d), z));
  const anchors = [
    [STAY.inner, ANCHOR.inner],
    [STAY.outer, ANCHOR.outer],
  ].map(([d, half]) => boxFromTo(X(d) - half, X(d) + half, -ANCHOR.halfT, ANCHOR.halfT, dt(d) - 0.3, dt(d) + ANCHOR.height));
  const solid = union([plate.subtract(union(holes)), ...ribs, ...anchors]).translate([0, side * COLUMN.t, 0]);
  return {
    solid,
    openings: openings.length,
    angles: [innerFoot, outerFoot].map(([d, z]) => +((Math.atan((attach[1] - z) / (d - attach[0])) * 180) / Math.PI).toFixed(1)),
    apexNap: Math.max(...openings.map((tri) => Math.max(...tri.map(([, z]) => z)))) + WATER_NAP,
  };
}

const columns = PYLON_X.flatMap((xp) => [-1, 1].map((side) => column(xp, side)));
const crossbeams = PYLON_X.map((xp) => crossbeam(xp));
const sails = PYLON_X.flatMap((xp) =>
  [-1, 1].flatMap((dir) => [-1, 1].map((side) => ({ xp, dir, side, ...sail(xp, dir, side) }))),
);

const bridge = union([
  slabMain,
  slabApproach,
  mainBox,
  ...twinBoxes,
  ...kerbs,
  southAbutment,
  northAbutment,
  ...pylonPiers,
  ...sidePiers,
  transitionPier,
  ...approachPiers,
  ...columns,
  ...crossbeams,
  ...sails.map(({ solid }) => solid),
]).trimByPlane([0, 0, 1], BASE);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden vanaf de onderkant van
// de gevelrand die uitloopt in een scherm van minstens 0,8 mm op printschaal
// tot de onderplaat (waar het dek laag ligt komt de wig al op de onderplaat).
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const footStations = stationsX(SOUTH_FACE, NORTH_LOFT_END, 1).map((x) => {
  const c = yc(x);
  const w = halfWidth(x) * kY(x);
  const zt = top(x);
  const zb = zt - DECK.fascia - 0.02;
  const zIn = zt - 0.3;
  const zs = zb - POINTED * (w - SCREEN);
  if (zs > BASE + 0.05) {
    return {
      x,
      section: [[c - SCREEN, BASE], [c + SCREEN, BASE], [c + SCREEN, zs], [c + w, zb], [c + w, zIn], [c - w, zIn], [c - w, zb], [c - SCREEN, zs]],
    };
  }
  const a = w - (zb - BASE) / POINTED;
  return {
    x,
    section: [[c - a, BASE], [c + a, BASE], [c + a + 1e-3, BASE + 1e-3], [c + w, zb], [c + w, zIn], [c - w, zIn], [c - w, zb], [c - a - 1e-3, BASE + 1e-3]],
  };
});
const printFoot = keepSouthOf(NORTH_FRONT)(loftX(footStations));
const printModel = union([bridge, printFoot]);
// Eerst de brug en de printversie als geheel uitrekenen, zodat de STL het
// hele brugmodel bevat zoals het is.
for (const [name, solid] of [["brug", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}

// ---------- rijbanen als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is per BGT-functie een eigen node met de
// attributen van de actuele BGT-wegdelen erop (relatieve hoogteligging 1,
// glTF `extras.attributes`), zodat de kleurregels van een thema op het
// brugdek werken zoals op de PDOK-wegdelen ernaast. Pas na het printmodel
// opgebouwd, zodat de STL het hele brugmodel bevat.
//
// De BGT legt op het dek 2 × 2 rijstroken van de N323 (rijbaan regionale weg,
// gesloten verharding, asfalt, 46 vlakken van 100 m zoals
// P0025.30c9750d51164914b71dd04bf6a136cd en P0025.186fad8a32da457faa58dcfd8ef3789c,
// samen tot 8,8 m naast de as en op de aanbrug 9,1 m) en aan beide kanten een
// parallelle rijbaan lokale weg (gesloten verharding, asfalt, 28 vlakken zoals
// P0025.48a92572f3d348168549c0e952823f0d en P0025.62586422bddf4310b48678d5098ac67a:
// 12,0 tot 15,15 m naast de as op het tuibruggedeelte, 9,6 tot 13,1 m op de
// aanbrug). Daartussen liggen bermen (ondersteunend wegdeel): de middenberm en
// de geleiderails (cementbeton) en op het tuibruggedeelte een berm van 9,3
// tot 12 m naast de as (asfalt) waarin de kolommen en tuien staan. Eén node
// per functie; de bermen horen bij de aangrenzende rijbaan, met de grens in het
// midden van de berm (10,7 m naast de as tot x = 230, 9,4 m vanaf x = 306,
// lineair daartussen).
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const LOCAL_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const boundary = (x) => (x <= 230 ? 10.7 : x >= 306 ? 9.4 : 10.7 + ((9.4 - 10.7) * (x - 230)) / 76);
const laneXs = stationsX(SOUTH_END - 5, NORTH_LOFT_END + 5, 2);
const regionalRegion = prism(
  [
    ...laneXs.map((x) => [x, yc(x) - boundary(x) * kY(x)]),
    ...[...laneXs].reverse().map((x) => [x, yc(x) + boundary(x) * kY(x)]),
  ],
  BASE - 1,
  120,
);
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, over de stations van
// het dek, tussen de schampkanten (2 cm vrij) en 0,5 m voorbij de uiteinden:
// zo snijdt hij het hele bovenvlak uit de constructie en houdt die daar geen
// vlak zonder dikte over dat met het wegdek vecht (z-fighting op de kaart).
const strip = keepSouthOf(NORTH_BACK, 0.5)(
  loftX(
    stationsX(SOUTH_END - 0.5, NORTH_LOFT_END, 2).map((x) => {
      const zt = top(x);
      const c = yc(x);
      const h = (halfWidth(x) - KERB.width - 0.02) * kY(x);
      return { x, section: [[c - h, zt - LAYER], [c + h, zt - LAYER], [c + h, zt + ABOVE], [c - h, zt + ABOVE]] };
    }),
  ),
);
// Wat in de strook staat en constructie blijft, met 2 cm vrij: de kolommen,
// de tuivlakken (plaat, ribben en ankerblokken) over hun hele strook.
const guards = [...columns, ...sails.map(({ solid }) => solid)].map((part) => {
  const bb = part.intersect(strip).boundingBox();
  return boxFromTo(bb.min[0] - 0.02, bb.max[0] + 0.02, bb.min[1] - 0.02, bb.max[1] + 0.02, BASE - 1, 120);
});
const layer = strip.subtract(union(guards));
const regionalCut = layer.intersect(regionalRegion);
const localCut = layer.subtract(regionalRegion);
const roadway = regionalCut.intersect(bridge);
const localRoads = localCut.intersect(bridge);
const structure = bridge.subtract(layer);
const parts = [
  ["building:prins-willem-alexanderbrug", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:rijbaan-lokaal", localRoads, LOCAL_ATTRIBUTES],
];
// De onderdelen tellen op tot de brug als geheel (geen overlap, niets kwijt).
const partition = {
  bridgeM3: +bridge.volume().toFixed(1),
  partsM3: Object.fromEntries(parts.map(([name, solid]) => [name, +solid.volume().toFixed(1)])),
};
partition.sumM3 = +parts.reduce((sum, [, solid]) => sum + solid.volume(), 0).toFixed(1);
partition.overlapM3 = +union([roadway, localRoads]).intersect(structure).volume().toFixed(3);
partition.roadOverlapM3 = +roadway.intersect(localRoads).volume().toFixed(3);
if (Math.abs(partition.sumM3 - partition.bridgeM3) > 1e-3 * partition.bridgeM3 || partition.overlapM3 > 0.01 || partition.roadOverlapM3 > 0.01) {
  throw new Error(`onderdelen tellen niet op: ${JSON.stringify(partition)}`);
}
console.log("partitie (m3):", JSON.stringify(partition));

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen: boven het wegdek mag niets
// vrij hangen (alleen het dek, de kokers en de pijlers hangen eronder).
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
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  const { area, found } = overhangs(bridge);
  const above = found.filter(({ p }) => {
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    return zm > top(xm) + 0.05;
  });
  const aboveArea = above.reduce((sum, { area: a }) => sum + a, 0);
  console.log("vrij hangend (m2):", Math.round(area), "waarvan boven het wegdek:", +aboveArea.toFixed(2));
  if (aboveArea > 0.5) {
    for (const { p } of above.slice(0, 8)) console.log(p.map((q) => q.map((c) => +c.toFixed(2))));
    throw new Error("overhang boven het wegdek");
  }
  const print = overhangs(printModel);
  const big = print.found.filter(({ p }) => Math.min(p[0][2], p[1][2], p[2][2]) > 0.5);
  const bigArea = big.reduce((sum, { area: a }) => sum + a, 0);
  console.log("overhang in de printversie boven 0,5 m (m2):", +bigArea.toFixed(2));
  if (bigArea > 2) {
    for (const { p } of big.slice(0, 12)) console.log(p.map((q) => q.map((c) => +c.toFixed(2))));
    throw new Error("printversie heeft overhang");
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
report.partition = partition;
report.sails = sails.map(({ xp, dir, side, openings, angles, apexNap }) => ({ xp, dir, side, openings, angles, apexNap: +apexNap.toFixed(1) }));
const glbFile = path.join(outDir, "prins-willem-alexanderbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-prins-willem-alexanderbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `prins-willem-alexanderbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Prins Willem-Alexanderbrug 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten alleen op
// de Waal, 30 m naast de as (14 m naast de dekrand), verspreid over de
// hoofdoverspanning; een uitsnede zonder rivier valt terug op groundHeight.
const samplePoints = [-100, -50, 0, 50, 100].flatMap((x) => [
  [x, 30],
  [x, -30],
]);
await writeFile(
  path.join(outDir, "prins-willem-alexanderbrug.json"),
  JSON.stringify(
    {
      name: "Prins Willem-Alexanderbrug",
      file: "prins-willem-alexanderbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [162596.26, 433401.25],
      xAxis: [-0.009425, 0.999956],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden tussen de twee pylonen op de waterspiegel van de Waal (z = 0, NAP +4,46 m zoals het PDOK-terrein het water legt) in de oorsprong, +X langs het rechte deel van de brug naar het noorden (Echteld, RD-richting 90,54 graden vanaf het oosten) en +Y naar het westen; vanaf x = 306 buigt de as van de aanbrug naar het westen af (y = (x - 306)² / 11940). Drie nodes: road:rijbaan en road:rijbaan-lokaal, de bovenste 0,5 m van het dek met de attributen van de BGT-wegdelen erop in extras.attributes (bgt_functie rijbaan regionale weg voor de 2 × 2 rijstroken van de N323 in het midden, rijbaan lokale weg voor de parallelle rijbanen langs de randen; bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het dek van 31,2 m breed op het tuibruggedeelte en 27,3 m op de aanbrug, van het zuidelijke landhoofd op de dijk bij Wamel (x = -306,4, wegdek NAP +21,4 m) over de Waal (NAP +23,5 m midden in de hoofdoverspanning) en de noordelijke uiterwaard naar het noordelijke landhoofd bij Echteld (x = 1110, NAP +15,1 m), met een schampkant langs de randen en een koker van 3,6 m onder het dek (twee kokers onder de aanbrug); de twee pylonen op x = ±133,5 van elk twee kolommen van 5 × 2,6 m, 10,7 m naast de as, met een afgeronde kap tot NAP +69,0 m en een dwarsregel van NAP +50 tot +54,5 m; per kolom vier tuien naar ankerblokken op het dek op 45,9 en 92,6 m van de pylon, als tuivlakken van 0,9 m dik met de tuien als ribben en driehoekige openingen met een spitse top; de pylonpijlers en zijpijlers (x = ±228,4) met caissons tot NAP +13 m en kolommen onder het dek, de overgangspijler op x = 306 en tien steunpunten van de aanbrug met elk twee wandpijlers. Leuningen, lantaarns, geleiderails en bebording zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de Waal naast de brug bemonsterd; groundHeight is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(1110 - SOUTH_END).toFixed(1),
        spansM: [77.5, 95, 267, 95, 77.5],
        pylonsX: PYLON_X,
        deckWidthM: { cableStayed: 31.24, approach: 27.3 },
        approachCurveRadiusM: CURVE.radius,
        columnTopNapM: COLUMN.topNap,
        crossbeamNapM: [CROSSBEAM.bottomNap, CROSSBEAM.topNap],
        stayAnchorsFromPylonM: [STAY.inner, STAY.outer],
        stayAnglesDeg: sails[0].angles,
        deckNapM: { south: DECK_NAP[0], crest: Math.max(...DECK_NAP), north: deckNap(1107) },
        approachPierX: APPROACH_PIERS,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Prins_Willem-Alexanderbrug",
        "PDOK BGT overbruggingsdeel (dek, landhoofden, pylonkolommen, tuiankers, pijlers), wegdeel en ondersteunend wegdeel, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de kolommen, de dwarsregel en de tuien",
        "PDOK luchtfoto (Actueel_orthoHR) voor kolommen, dwarsregel, caissons en voegen",
        "Wikimedia Commons: Alexanderbrug 073.jpg, Alexanderbrug 075.jpg, Bij Beneden Leeuwen, brug foto10 2010-08-01 15.17.JPG, Bij Beneden Leeuwen, de Prins Willem Alexanderbrug IMG 2693 2019-10-26 13.07.jpg, Detailview of the Prins (since 2013, King^^) Willem Alexander bridge (built 1973) near Tiel - panoramio.jpg, The first all concrete cable stayed bridge (1973) of Holland over the Waal river - panoramio.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

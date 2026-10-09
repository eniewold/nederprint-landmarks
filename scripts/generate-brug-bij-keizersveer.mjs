// Genereert een vereenvoudigd, gesloten 3D-model van de Brug bij Keizersveer
// (Keizersveerse brug) in de A27 over de Bergsche Maas bij Raamsdonksveer:
// twee stalen vakwerkbruggen naast elkaar, elk met drie overspanningen die in
// 1978 zijn hergebruikt van de oude verkeersbrug over het Hollandsch Diep bij
// Moerdijk (1936). Elke overspanning is een vakwerkligger met evenwijdige
// randen, verticale eindstijlen en per veld een kruis van twee diagonalen
// tussen de verticalen. Tussen de twee bruggen ligt een smalle dienstweg, aan
// beide buitenkanten een fietspad op het dek. De bruggen rusten op twee
// betonnen rivierpijlers met spitse koppen en twee landhoofden in de dijken.
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, een node met de constructie en drie road-nodes met de
// bovenste 0,5 m van de rijbanen van de A27, de dienstweg en de fietspaden en
// de BGT-attributen, met de materiaalklasse in de nodenaam) als catalogusbron
// voor de export en de kaart, plus een binaire STL in millimeters op
// 1:<schaal> met de hele brug en een printvoet onder het dek.
//
//   node scripts/generate-brug-bij-keizersveer.mjs              # 1:1000 (standaard)
//   node scripts/generate-brug-bij-keizersveer.mjs --scale 1500
//
// Met 307,5 m van landhoofd tot landhoofd past de brug op 1:1000 in 400 mm.
//
// Assenstelsel: oorsprong op de as van het BGT-dek (midden tussen de twee
// bruggen) midden tussen de twee rivierpijlers (RD 120686,35, 414657,15), op
// de waterspiegel van de Bergsche Maas (NAP +0,55 m), Z omhoog. +X loopt langs
// de brug naar het noordnoordoosten (Land van Altena, RD-richting 76,25 graden
// vanaf het oosten, langs de randen van het BGT-dek), +Y stroomafwaarts naar het
// westnoordwesten. De oostelijke brug (stroomopwaarts) ligt op y = -18,0 tot
// -2,6, de dienstweg op y = -2,6 tot 3,9 en de westelijke brug op y = 3,9 tot
// 19,75. Het zuidelijke landhoofd (Raamsdonksveer) ligt op x = -153,6 tot
// -145,2, het noordelijke op x = 145,4 tot 153,9; de pijlers op x = -45,8 en
// 45,7.
//
// Bronnen: BGT overbruggingsdeel (dek 37,8 m breed van x = -148,4 tot 148,6
// met de randen evenwijdig aan de as, de twee pijlers van 6,4 m breed met
// spitse koppen tot 21,7 m naast de as, de landhoofden) en BGT wegdeel (de vijf
// wegdelen op het dek); AHN DSM 0,5 m (PDOK WCS) voor het lengteprofiel van het
// dek (NAP +12,2 m in het midden, +11,8 m bij de landhoofden), de vier
// vakwerklijnen (y = -15,15, -2,55, 3,9 en 16,6), de bovenrand (11,45 m boven de
// rijbaan, NAP +23,7 m in het midden), de knopen van de vakwerken (de dwarse
// bovenregels op een steek van 12,5 m: acht velden in de buitenste
// overspanningen van 100 m, zeven in de middelste van 87,2 m) en de koppen van
// de pijlers (NAP +4,2 m aan het dek, +3,0 m op de punt); PDOK-terrein voor de
// waterspiegel (43,96 m ellipsoïdisch, de rijbaan bij de landhoofden 43,45 m
// boven het AHN); PDOK-luchtfoto voor de plattegrond; Wikipedia (1931, in 1978
// vervangen door zes overspanningen van de oude Moerdijkbrug, twee bruggen
// naast elkaar, sinds 2003 wit); Wikimedia Commons-foto's
// (Keizersveersebrug.jpg, Old bridge by Raamsdonksveer (9415010697).jpg,
// Vernieuwde brug over Bergse Maas open voor verkeer, Bestanddeelnr 930-0247
// en 930-0248, Bergsemaas.jpg, Keizersveer, brug over de Bergsche Maas bij
// Raamsdonkveer.jpg) voor het vakwerkpatroon, de portalen, de dienstweg en de
// pijlers. Geschat (foto's) zijn de constructiehoogte van het dek (2,0 m onder
// de rijbanen, 1,5 m onder de dienstweg, 0,9 m onder de fietspaden), de dikte
// van de wanden (1,0 m) en de staafbreedtes, de hoogte van de onderrand en de
// vorm van de pijlerschachten onder het dek.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "brug-bij-keizersveer");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts.filter(Boolean));
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
// Doorsnede in het XZ-vlak (CrossSection in x, z), uitgetrokken langs Y.
const extrudeY = (section, y0, y1) =>
  section
    .extrude(y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const profileY = (points, y0, y1) => extrudeY(new CrossSection([ccw(points)]), y0, y1);
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Stuksgewijs lineaire tabel [[x, waarde], ...].
const table = (rows) => (x) => {
  if (x <= rows[0][0]) return rows[0][1];
  for (let i = 1; i < rows.length; i++) {
    if (x <= rows[i][0]) {
      const [x0, a] = rows[i - 1];
      const [x1, b] = rows[i];
      return a + ((b - a) * (x - x0)) / (x1 - x0);
    }
  }
  return rows[rows.length - 1][1];
};
// Loft langs X: per station een doorsnede in het YZ-vlak (tegen de klok in
// gezien vanaf +X, steeds evenveel punten; convex voor de eindkappen).
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

// ---------- hoofdmaten (boven de waterspiegel, NAP +0,55 m) ----------
// PDOK legt de Bergsche Maas op 43,96 m ellipsoïdisch; de rijbaan bij de
// landhoofden ligt in PDOK 43,45 m boven het AHN. De waterspiegel ligt dus op
// circa NAP +0,55 m.
const WATER_NAP = 0.55;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0; // het PDOK-water ligt op de waterspiegel van het model
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten, als vaste
// terugval voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 43.95;

// Rijbaan in NAP (AHN-DSM, 25e percentiel per 10 m over het midden van beide
// rijbanen): een flauwe bolling van +12,22 m in het midden naar +11,8 m bij de
// landhoofden, symmetrisch.
const ROAD_NAP = (() => {
  const f = table([
    [0, 12.22],
    [50, 12.17],
    [100, 12.02],
    [150, 11.8],
    [160, 11.7],
  ]);
  return (x) => f(Math.abs(x));
})();
const roadZ = (x) => Z(ROAD_NAP(x));

// Dek (BGT-overbruggingsdeel van x = -148,4 tot 148,6, y = -18,03 tot 19,75),
// boven de landhoofden doorgetrokken tot hun achterkant. Dwars per strook de
// hoogte onder de rijbaan (AHN) en de constructiehoogte (foto's); de grenzen
// liggen op de harten van de vakwerkwanden.
const DECK = { x0: -148.4, x1: 148.6, end0: -153.6, end1: 153.9, y0: -18.03, y1: 19.75 };
const TRUSS_Y = [-15.15, -2.55, 3.9, 16.6]; // harten van de vier vakwerkwanden (AHN)
const TRUSS_T = 1.0; // dikte van een wand
const SECTIONS = [
  { name: "fietspad-oost", y0: DECK.y0, y1: TRUSS_Y[0], drop: 0.24, depth: 0.9 },
  { name: "rijbaan-oost", y0: TRUSS_Y[0], y1: TRUSS_Y[1], drop: 0, depth: 2.0 },
  { name: "dienstweg", y0: TRUSS_Y[1], y1: TRUSS_Y[2], drop: 0.08, depth: 1.5 },
  { name: "rijbaan-west", y0: TRUSS_Y[2], y1: TRUSS_Y[3], drop: 0, depth: 2.0 },
  { name: "fietspad-west", y0: TRUSS_Y[3], y1: DECK.y1, drop: 0.24, depth: 0.9 },
];
const sectionTop = (s) => (x) => roadZ(x) - s.drop;
const sectionBottom = (s) => (x) => roadZ(x) - s.drop - s.depth;

// Overspanningen (AHN: dwarse bovenregels op de knopen): de buitenste twee 100 m
// met acht velden van 12,5 m, de middelste 87,2 m met zeven velden; tussen de
// eindstijlen boven elke pijler 4,0 m.
const SPANS = [
  { x0: -147.6, x1: -47.6, n: 8 },
  { x0: -43.6, x1: 43.6, n: 7 },
  { x0: 47.6, x1: 147.6, n: 8 },
];
// Vakwerk (hoogtes boven de rijbaan): bovenkant van de bovenrand 11,45 m
// (AHN), onderkant van de wand gelijk met de onderkant van het dek.
const TRUSS_H = 11.45;
const TRUSS_BOTTOM = -2.0;
const TC = 1.0; // bovenrand
const FLOOR = 0.6; // bovenkant onderrand
const WV = 0.9; // verticalen
const WD = 0.9; // diagonalen
const END_W = 1.2; // eindstijl
const NICHE = 0.35; // diepte van een blinde nis aan elke kant van een wand
const POINTED = (56 * Math.PI) / 180; // zijden van de doorgaande openingen

// Pijlers (BGT, lokale coördinaten) met spitse koppen; de koppen buiten het dek
// lopen af van NAP +4,2 m bij y = ±18,5 naar +3,0 m op de punt (AHN).
const PIERS = [
  [[-42.63, 18.51], [-42.67, 18.74], [-43.91, 20.07], [-45.47, 21.57], [-45.66, 21.69], [-45.91, 21.66], [-46.11, 21.54], [-47.76, 19.87], [-48.89, 18.64], [-48.96, 18.38], [-48.95, -18.36], [-48.88, -18.61], [-48.02, -19.75], [-46.04, -21.66], [-45.5, -21.64], [-43.14, -19.21], [-42.66, -18.71], [-42.62, -18.48]],
  [[48.74, 18.94], [47.75, 20.17], [46.49, 21.46], [46.12, 21.77], [45.8, 21.78], [45.54, 21.68], [43.89, 19.89], [42.57, 18.84], [42.49, 18.54], [42.72, -18.35], [42.81, -18.65], [45.62, -21.39], [45.89, -21.55], [46.26, -21.55], [46.5, -21.34], [48.77, -18.97], [48.97, -18.67], [48.98, -18.37], [48.75, 18.64]],
];
const NOSE = { y: 18.5, napAtDeck: 4.2, napAtTip: 3.0, yTip: 21.7 };
// Landhoofden (BGT): onder het dek tot de achterkant in de dijk.
const ABUTMENTS = [
  [-153.6, -145.2],
  [145.4, 153.9],
];

// ---------- vakwerkwand ----------
// Een vakwerk is op 1:1000 niet open te printen. Elke wand is daarom een dichte
// plaat van 1,0 m met per veld (tussen twee verticalen) het kruis van de twee
// diagonalen: de vier driehoeken tussen kruis, verticalen en randen zijn
// blinde nissen van 0,35 m aan beide kanten, en binnen de onderste driehoek en
// de twee zijdriehoeken loopt een opening door met zijden van 56 graden
// (punt omhoog, of tegen de verticaal met de top aan de verticaal). De
// doorsnede staat in (x, h) met h boven de rijbaan en wordt daarna langs het
// lengteprofiel gebogen.
const BIG = 400;
const lineThrough = ([xa, za], [xb, zb]) => {
  const m = (zb - za) / (xb - xa);
  return { m, at: (x) => za + m * (x - xa) };
};
// Halfvlak onder (sign -1) of boven (sign 1) een lijn, met de lijn loodrecht
// verschoven met d van de lijn af.
function halfPlane(line, sign, d) {
  const shift = d * Math.sqrt(1 + line.m * line.m) * sign;
  const xa = -BIG;
  const xb = BIG;
  const za = line.at(xa) + shift;
  const zb = line.at(xb) + shift;
  return new CrossSection([ccw([[xa, za], [xb, zb], [xb, zb + sign * 2 * BIG], [xa, za + sign * 2 * BIG]])]);
}
const flanks = [];
// Kleinste helling (graden) van de plafonds van een opening: randen met de
// buitennormaal omhoog (tegen de klok in: dx < 0), verticale randen niet.
function ceilingAngle(section) {
  let min = 90;
  for (const ring of section.toPolygons()) {
    const pts = ccw(ring);
    pts.forEach(([xa, za], i) => {
      const [xb, zb] = pts[(i + 1) % pts.length];
      const dx = xb - xa;
      if (dx < -1e-6 && Math.hypot(dx, zb - za) > 0.05) min = Math.min(min, (Math.atan2(Math.abs(zb - za), -dx) * 180) / Math.PI);
    });
  }
  return min;
}
function trussSection({ x0, x1, n }) {
  const P = (x1 - x0) / n;
  const steps = Math.max(2, Math.round((x1 - x0) / 2));
  const xs = Array.from({ length: steps + 1 }, (_, i) => x0 + ((x1 - x0) * i) / steps);
  const outline = [...xs.map((x) => [x, TRUSS_BOTTOM]), ...[...xs].reverse().map((x) => [x, TRUSS_H])];
  const hf = FLOOR;
  const hc = TRUSS_H - TC;
  const tanP = Math.tan(POINTED);
  const holes = [];
  const niches = [];
  for (let k = 0; k < n; k++) {
    const xa = x0 + k * P;
    const xb = xa + P;
    const xl = k === 0 ? x0 + END_W : xa + WV / 2;
    const xr = k === n - 1 ? x1 - END_W : xb - WV / 2;
    const rect = new CrossSection([ccw([[xl, hf], [xr, hf], [xr, hc], [xl, hc]])]);
    const d1 = lineThrough([xa, hf], [xb, hc]); // stijgend
    const d2 = lineThrough([xa, hc], [xb, hf]); // dalend
    const off = WD / 2;
    const bottom = rect.intersect(halfPlane(d1, -1, off)).intersect(halfPlane(d2, -1, off));
    const top = rect.intersect(halfPlane(d1, 1, off)).intersect(halfPlane(d2, 1, off));
    const left = rect.intersect(halfPlane(d1, 1, off)).intersect(halfPlane(d2, -1, off));
    const right = rect.intersect(halfPlane(d2, 1, off)).intersect(halfPlane(d1, -1, off));
    for (const tri of [bottom, top, left, right]) if (tri.area() > 0.5) niches.push(tri);
    // Onderste driehoek: opening met de punt op het kruis (onder beide
    // diagonalen) en zijden van 56 graden.
    const v1 = off * Math.sqrt(1 + d1.m * d1.m);
    const v2 = off * Math.sqrt(1 + d2.m * d2.m);
    const xc = (d2.at(0) - v2 - (d1.at(0) - v1)) / (d1.m - d2.m);
    const zc = d1.at(xc) - v1;
    const cone = new CrossSection([ccw([[xc - BIG, zc - BIG * tanP], [xc, zc], [xc + BIG, zc - BIG * tanP]])]);
    const bottomHole = bottom.intersect(cone);
    // Zijdriehoeken: opening tegen de verticaal met het plafond op 56 graden
    // vanaf de bovenste hoek aan de verticaal.
    const zl = d2.at(xl) - v2;
    const coneL = new CrossSection([ccw([[xl - 1, zl + tanP], [xl + BIG, zl - BIG * tanP], [xl + BIG, -BIG], [xl - 1, -BIG]])]);
    const zr = d1.at(xr) - v1;
    const coneR = new CrossSection([ccw([[xr + 1, zr + tanP], [xr - BIG, zr - BIG * tanP], [xr - BIG, -BIG], [xr + 1, -BIG]])]);
    const leftHole = left.intersect(coneL);
    const rightHole = right.intersect(coneR);
    for (const hole of [bottomHole, leftHole, rightHole]) {
      if (hole.area() > 0.8) {
        holes.push(hole);
        flanks.push(ceilingAngle(hole));
      }
    }
  }
  const plate = new CrossSection([ccw(outline)]).subtract(CrossSection.union(holes));
  return { plate, niches: CrossSection.union(niches), holes: holes.length, nicheCount: niches.length, panel: +P.toFixed(3) };
}
// Buig een solid in (x, y, h) naar (x, y, z) langs het lengteprofiel.
const alongRoad = (solid) =>
  solid.warp((v) => {
    v[2] += roadZ(v[0]);
  });
const trussStats = [];
const trussWalls = SPANS.flatMap((span, k) => {
  const { plate, niches, holes, nicheCount, panel } = trussSection(span);
  trussStats.push({ span: k + 1, lengthM: +(span.x1 - span.x0).toFixed(2), panels: span.n, panelM: panel, holesPerWall: holes, nichesPerWall: nicheCount });
  return TRUSS_Y.map((yc) => {
    const y0 = yc - TRUSS_T / 2;
    const y1 = yc + TRUSS_T / 2;
    const wall = extrudeY(plate, y0, y1)
      .subtract(extrudeY(niches, y0 - 0.2, y0 + NICHE))
      .subtract(extrudeY(niches, y1 - NICHE, y1 + 0.2));
    return alongRoad(wall);
  });
});

// ---------- dek ----------
// Per strook een band tussen onderkant en bovenkant langs het lengteprofiel
// (stations om de 2 m), 1 cm overlappend met de buurstroken (binnen de wanden).
const DECK_STEP = 2;
const deckStations = (() => {
  const n = Math.max(1, Math.round((DECK.end1 - DECK.end0) / DECK_STEP));
  return Array.from({ length: n + 1 }, (_, i) => DECK.end0 + ((DECK.end1 - DECK.end0) * i) / n);
})();
function band(y0, y1, bottom, top) {
  const xs = deckStations;
  return profileY([...xs.map((x) => [x, bottom(x)]), ...[...xs].reverse().map((x) => [x, top(x)])], y0, y1);
}
const deckParts = SECTIONS.map((s, i) =>
  band(s.y0 - (i > 0 ? 0.01 : 0), s.y1 + (i < SECTIONS.length - 1 ? 0.01 : 0), sectionBottom(s), sectionTop(s)),
);

// ---------- pijlers en landhoofden ----------
// Onder elke strook een blok tot 0,1 m in het dek (de hoogste onderkant over
// het bereik in x).
function underDeck(x0, x1, z0) {
  return SECTIONS.map((s, i) => {
    const zb = Math.max(sectionBottom(s)(x0), sectionBottom(s)(x1), sectionBottom(s)((x0 + x1) / 2)) + 0.1;
    const y0 = s.y0 - (i > 0 ? 0.01 : 0);
    const y1 = s.y1 + (i < SECTIONS.length - 1 ? 0.01 : 0);
    return boxFromTo(x0, x1, y0, y1, z0, zb);
  });
}
const noseSlope = (NOSE.napAtDeck - NOSE.napAtTip) / (NOSE.yTip - NOSE.y);
const roofPlane = (solid, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
const pierSolids = PIERS.flatMap((poly) => {
  const xs = poly.map(([x]) => x);
  const x0 = xs.reduce((m, x) => Math.min(m, x), Infinity);
  const x1 = xs.reduce((m, x) => Math.max(m, x), -Infinity);
  // Plattegrond met de koppen, afgedekt door twee hellende vlakken.
  let nose = prism(poly, BASE, Z(NOSE.napAtDeck) + 0.5);
  nose = roofPlane(nose, 0, noseSlope, Z(NOSE.napAtDeck) + noseSlope * NOSE.y);
  nose = roofPlane(nose, 0, -noseSlope, Z(NOSE.napAtDeck) + noseSlope * NOSE.y);
  // Schacht onder het dek over de breedte van het dek.
  const shaft = underDeck(x0 + 0.1, x1 - 0.1, BASE);
  return [nose, ...shaft];
});
const abutmentSolids = ABUTMENTS.flatMap(([x0, x1]) => underDeck(x0, x1, BASE));

const bridge = union([...deckParts, ...pierSolids, ...abutmentSolids, ...trussWalls]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen pijlers en landhoofden vrij. Net als de
// overhangopvulling van de export krijgt de STL daaronder een wig van 50 graden
// vanaf de dekranden (op de onderkant van de rijbaanstroken), met daarop
// blokken tot de hogere onderkant van de fietspaden en de dienstweg.
const KNEE = (50 * Math.PI) / 180;
const SCREEN = Math.max(0.45, 0.4 / mmPerMetre);
const footX0 = ABUTMENTS[0][1] - 0.5; // 0,5 m in de landhoofden
const footX1 = ABUTMENTS[1][0] + 0.5;
const footXs = (() => {
  const n = Math.round(footX1 - footX0);
  return Array.from({ length: n + 1 }, (_, i) => footX0 + ((footX1 - footX0) * i) / n);
})();
const mainBottom = (x) => roadZ(x) - 2.0;
const wedge = loftX(
  footXs.map((x) => {
    const ya = DECK.y0 - 0.02;
    const yb = DECK.y1 + 0.02;
    const yc = (ya + yb) / 2;
    const w = (yb - ya) / 2;
    const zb = mainBottom(x) + 0.02;
    const zs = zb - Math.tan(KNEE) * (w - SCREEN);
    const section =
      zs > BASE + 0.05
        ? [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [-w, zb], [-SCREEN, zs]]
        : (() => {
            const a = w - (zb - BASE) / Math.tan(KNEE);
            return [[-a, BASE], [a, BASE], [w, zb], [-w, zb]];
          })();
    return { x, section: section.map(([y, z]) => [y + yc, z]) };
  }),
);
const fills = SECTIONS.filter((s) => s.depth < 2.0).map((s) => {
  const [ya, yb] = [s.y0, s.y1];
  return loftX(
    footXs.map((x) => {
      const z0 = mainBottom(x) + 0.01;
      const z1 = sectionBottom(s)(x) + 0.02;
      return { x, section: [[ya, z0], [yb, z0], [yb, z1], [ya, z1]] };
    }),
  );
});
const printFoot = union([wedge, ...fills]);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de onderkant van het dek en de koppen van de pijlers niet
// (die wijzen omhoog), en de plafonds van de blinde nissen (0,35 m diep); in
// de printversie alleen die nissen.
const inWall = (y) => TRUSS_Y.some((yc) => Math.abs(y - yc) < TRUSS_T / 2 + 1e-3);
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let deckArea = 0;
  let nicheArea = 0;
  let area = 0;
  const other = [];
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const xMid = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const yMid = (p[0][1] + p[1][1] + p[2][1]) / 3;
    const zMid = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const nearDeck = zMid < roadZ(xMid) - 0.5;
    if (inWall(yMid) && zMid > roadZ(xMid) + FLOOR - 0.01) nicheArea += len / 2;
    else if (nearDeck) deckArea += len / 2;
    else {
      area += len / 2;
      if (len / 2 > 0.01) other.push([xMid, yMid, zMid].map((c) => +c.toFixed(2)));
    }
  }
  return { deckArea, nicheArea, area, other };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  const model = overhangs(bridge);
  console.log("vrij hangend (m2): dek", Math.round(model.deckArea), "nissen", Math.round(model.nicheArea), "overig", +model.area.toFixed(2));
  if (model.area > 0.5) {
    console.log(model.other.slice(0, 20));
    throw new Error("overhang buiten dek en nissen");
  }
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2): dek", +print.deckArea.toFixed(2), "nissen", Math.round(print.nicheArea), "overig", +print.area.toFixed(2));
  if (print.deckArea + print.area > 0.5) {
    console.log(print.other.slice(0, 20));
    throw new Error("printversie heeft overhang");
  }
  const minFlank = flanks.reduce((m, a) => Math.min(m, a), 90);
  console.log("doorgaande openingen per wandlijn", flanks.length, "steilste plafond min (graden)", +minFlank.toFixed(1));
  if (minFlank < 50) throw new Error("opening met een te vlak plafond");
}

// ---------- rijbanen, dienstweg en fietspaden als eigen onderdelen ----------
// De bovenste 0,5 m van elke strook is een eigen node met de attributen van het
// BGT-wegdeel erop (glTF `extras.attributes`), zodat de kleurregels van een
// thema (bijvoorbeeld fietspaden rood) op de brug werken zoals op de
// PDOK-wegdelen ernaast. Pas na het printmodel gebouwd: de STL bevat de brug
// als geheel en blijft daardoor ongewijzigd.
//
// Actuele BGT-wegdelen met relatieve hoogteligging 1 op het dek (lokale
// coördinaten, vereenvoudigd tot 5 cm), alle van x = -148,4 tot 148,6 en
// zonder plus_fysiek_voorkomen. De wegdelen liggen tot 0,3 m binnen de
// wanden; het hele dek tussen twee wanden krijgt de functie, de wanden blijven
// constructie.
const LAYER = 0.5;
const ABOVE = 1.0;
const ATTRIBUTES = {
  rijbaan: { bgt_functie: "rijbaan autosnelweg", bgt_fysiekvoorkomen: "gesloten verharding" },
  lokaal: { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding" },
  fietspad: { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" },
};
const BGT_WEGDELEN = [
  {
    id: "L0002.2bfb85a9af1d44b49b7f7b8718ba8382", // rijbaan autosnelweg, oostelijke brug
    functie: "rijbaan autosnelweg",
    ring: [[-148.37, -3.04], [-148.36, -14.3], [148.58, -14.35], [148.59, -3.98], [148.59, -2.96], [71.06, -2.97], [53.52, -2.89], [-127.92, -2.93]],
  },
  {
    id: "L0002.f96a81f881234d76984e6034d51a4d37", // rijbaan autosnelweg, westelijke brug
    functie: "rijbaan autosnelweg",
    ring: [[-148.38, 16.19], [-148.37, 4.73], [-46.92, 4.67], [53.53, 4.74], [71.07, 4.66], [148.59, 4.67], [148.59, 16.13], [71.09, 16.12], [53.55, 16.2], [-46.93, 16.13]],
  },
  {
    id: "L0002.4bcedd3c0f824dd0a42f4be7822ba335", // rijbaan lokale weg, dienstweg
    functie: "rijbaan lokale weg",
    ring: [[-148.37, -1.22], [-122.16, -1.12], [-55.96, -1.07], [-19.24, -1.15], [148.59, -1.17], [148.59, 2.92], [38.28, 3.01], [-127.3, 3.0], [-148.37, 2.98]],
  },
  {
    id: "L0002.74f34babd49e4729898e2f311db7c452", // fietspad, oostkant
    functie: "fietspad",
    ring: [[-148.36, -15.68], [-148.36, -17.96], [-7.4, -17.9], [59.74, -17.91], [81.25, -18.0], [148.58, -17.98], [148.58, -15.7], [118.86, -15.79], [-37.25, -15.68], [-112.79, -15.79]],
  },
  {
    id: "L0002.e353ee43986a4f12b171eaf2416d5880", // fietspad, westkant
    functie: "fietspad",
    ring: [[-148.38, 17.41], [-17.57, 17.55], [132.21, 17.44], [148.59, 17.07], [148.59, 19.69], [-148.38, 19.69]],
  },
];
// De as van elke strook ligt over de hele lengte in een wegdeel van zijn functie.
{
  const inRing = ([x, y], ring) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };
  for (const [y, functie] of [
    [-8.85, "rijbaan autosnelweg"],
    [10.25, "rijbaan autosnelweg"],
    [0.9, "rijbaan lokale weg"],
    [-16.8, "fietspad"],
    [18.5, "fietspad"],
  ]) {
    for (let x = -148; x <= 148.4; x += 1) {
      const hit = BGT_WEGDELEN.find((w) => inRing([x, y], w.ring));
      if (!hit || hit.functie !== functie) throw new Error(`as y = ${y} op x = ${x} niet in een wegdeel ${functie}`);
    }
  }
}
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, met dezelfde
// loftstations als het dek en 0,1 m voorbij de uiteinden van de BGT-wegdelen,
// 0,1 m voorbij de dekranden en tot in de wanden.
const E = 0.1;
function topLayer(y0, y1, top) {
  const xa = DECK.x0 - E;
  const xb = DECK.x1 + E;
  const xs = [xa, ...deckStations.filter((x) => x > xa + 0.005 && x < xb - 0.005), xb];
  return loftX(
    xs.map((x) => {
      const zt = top(x);
      return { x, section: [[y0, zt - LAYER], [y1, zt - LAYER], [y1, zt + ABOVE], [y0, zt + ABOVE]] };
    }),
  );
}
// De vakwerkwanden blijven over de hele lengte van het dek constructie, met
// 2 cm vrij.
const wallGuards = union(
  TRUSS_Y.map((yc) => boxFromTo(DECK.end0 - 1, DECK.end1 + 1, yc - TRUSS_T / 2 - 0.02, yc + TRUSS_T / 2 + 0.02, -10, 60)),
);
const cut = (s) =>
  topLayer(s.y0 === DECK.y0 ? s.y0 - E : s.y0 - 0.5, s.y1 === DECK.y1 ? s.y1 + E : s.y1 + 0.5, sectionTop(s)).subtract(wallGuards);
const cuts = Object.fromEntries(SECTIONS.map((s) => [s.name, cut(s)]));
const roadCut = union([cuts["rijbaan-oost"], cuts["rijbaan-west"]]);
const localCut = cuts.dienstweg;
const bikeCut = union([cuts["fietspad-oost"], cuts["fietspad-west"]]);
const allCuts = union([roadCut, localCut, bikeCut]);
const parts = [
  ["building:brug-bij-keizersveer", bridge.subtract(allCuts)],
  ["road:rijbaan", roadCut.intersect(bridge), ATTRIBUTES.rijbaan],
  ["road:rijbaan-lokaal", localCut.intersect(bridge), ATTRIBUTES.lokaal],
  ["road:fietspad", bikeCut.intersect(bridge), ATTRIBUTES.fietspad],
];
// Controle: de onderdelen tellen op tot de brug als geheel.
const partition = {
  bridgeM3: +bridge.volume().toFixed(3),
  partsM3: +parts.reduce((s, [, solid]) => s + solid.volume(), 0).toFixed(3),
};
partition.diffM3 = +(partition.partsM3 - partition.bridgeM3).toFixed(4);
console.log("partitie (m3)", partition);
if (Math.abs(partition.diffM3) > 0.01) throw new Error("onderdelen tellen niet op tot de brug");
for (const [name, solid] of parts) {
  if (solid.status() !== "NoError" || solid.isEmpty()) throw new Error(`${name}: ${solid.status()}`);
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
const report = { trusses: trussStats, partition };
for (const [name, solid, attributes] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    ...(attributes ? { attributes } : {}),
    status: solid.status(),
    genus: solid.genus(),
    components: solid.decompose().length,
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRangeNap: [+(bb.min[2] + WATER_NAP).toFixed(2), +(bb.max[2] + WATER_NAP).toFixed(2)],
  };
}
const glbFile = path.join(outDir, "brug-bij-keizersveer.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-brug-bij-keizersveer.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `brug-bij-keizersveer-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Brug bij Keizersveer 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
{
  const bb = printSolid.boundingBox();
  report.stl = {
    file: path.join(outDir, stlName),
    status: printSolid.status(),
    genus: printSolid.genus(),
    components: printSolid.decompose().length,
    triangles,
    printFootM3: Math.round(printFoot.volume()),
    volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
    sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
  };
}

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Op het water van de Bergsche Maas aan beide kanten, 32 m naast de as.
const samplePoints = [-30, 0, 30].flatMap((x) => [
  [x, 32],
  [x, -32],
]);
const all = bridge.boundingBox();
await writeFile(
  path.join(outDir, "brug-bij-keizersveer.json"),
  JSON.stringify(
    {
      name: "Brug bij Keizersveer",
      file: "brug-bij-keizersveer.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [120686.35, 414657.15],
      xAxis: [0.23769, 0.97134],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "L0002.82aa8728da9d4f82b71de738a45d8b18",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op de as van het BGT-dek (midden tussen de twee bruggen) midden tussen de twee rivierpijlers op de waterspiegel van de Bergsche Maas (z = 0, NAP +0,55 m), +X langs de brug naar het noordnoordoosten (Land van Altena, RD-richting 76,25 graden vanaf het oosten) en +Y stroomafwaarts naar het westnoordwesten. Vier nodes: road:rijbaan (de rijbanen van de A27 op beide bruggen tussen de vakwerkwanden, bgt_functie rijbaan autosnelweg), road:rijbaan-lokaal (de dienstweg tussen de twee bruggen, rijbaan lokale weg) en road:fietspad (de fietspaden buiten de wanden aan beide kanten, fietspad), elk de bovenste 0,5 m van het dek met bgt_fysiekvoorkomen gesloten verharding in extras.attributes, zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het dek van 37,8 m breed van x = -148,4 tot 148,6 (boven de landhoofden doorgetrokken tot x = -153,6 en 153,9) met de rijbanen op NAP +12,2 m in het midden en +11,8 m bij de landhoofden, de dienstweg 0,08 m en de fietspaden 0,24 m lager; twee bruggen naast elkaar met elk drie vakwerkoverspanningen van de oude Moerdijkbrug (100, 87,2 en 100 m, acht, zeven en acht velden van 12,5 m) met evenwijdige randen 11,45 m boven de rijbaan (NAP +23,7 m), verticale eindstijlen en per veld een kruis van diagonalen, als dichte wanden van 1,0 m (y = -15,15, -2,55, 3,9 en 16,6) met doorgaande driehoekige openingen met zijden van 56 graden en blinde nissen; twee betonnen rivierpijlers van 6,4 m met spitse koppen tot 21,7 m naast de as (NAP +4,2 tot +3,0 m) en een schacht tot onder het dek; de landhoofden tot onder het dek. Portalen, dwarsregels en windverbanden tussen de wanden, leuningen, geleiderails, lantaarns en borden zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(all.max[0] - all.min[0]).toFixed(1),
        deckLengthM: +(DECK.x1 - DECK.x0).toFixed(1),
        deckWidthM: +(DECK.y1 - DECK.y0).toFixed(2),
        spansM: SPANS.map((s) => +(s.x1 - s.x0).toFixed(1)),
        panels: SPANS.map((s) => s.n),
        trussCentresM: [+(TRUSS_Y[1] - TRUSS_Y[0]).toFixed(2), +(TRUSS_Y[3] - TRUSS_Y[2]).toFixed(2)],
        trussHeightAboveRoadM: TRUSS_H,
        trussTopNapM: +(ROAD_NAP(0) + TRUSS_H).toFixed(2),
        roadNapM: { middle: ROAD_NAP(0), abutments: ROAD_NAP(DECK.x1) },
        pierNoseNapM: [NOSE.napAtTip, NOSE.napAtDeck],
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Brug_bij_Keizersveer",
        "PDOK BGT overbruggingsdeel (dek, pijlers, landhoofden) en wegdeel (rijbanen, dienstweg, fietspaden), EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor het dek, de vakwerklijnen, de bovenrand, de knopen en de pijlerkoppen",
        "PDOK Luchtfoto RGB (Actueel_orthoHR) voor de plattegrond",
        "Wikimedia Commons: Keizersveersebrug.jpg, Old bridge by Raamsdonksveer (9415010697).jpg, Vernieuwde brug over Bergse Maas open voor verkeer, Bestanddeelnr 930-0247.jpg en 930-0248.jpg, Bergsemaas.jpg, Keizersveer, brug over de Bergsche Maas bij Raamsdonkveer.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

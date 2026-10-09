// Genereert een vereenvoudigd, gesloten 3D-model van de John F. Kennedybrug
// in Maastricht (N278, Randweg-Zuid, Rijkswaterstaat, geopend op 6 mei 1968):
// een betonnen liggerbrug over de Maas tussen de Prins Bisschopsingel (westoever)
// en de John F. Kennedysingel in Céramique (oostoever). Over de rivier drie
// velden (60, 112 en 60 m) op twee U-vormige rivierpijlers, met een toog in de
// liggers; daarbuiten aanbrugvelden van 36 m op ronde kolommen, zeven aan de
// westkant en vier aan de oostkant, plus een landhoofd aan elk einde. Het dek
// bestaat uit twee kokerliggers naast elkaar (één per rijrichting, elk op een
// eigen kolompaar) met een gezamenlijke dekplaat die aan beide randen uitkraagt.
// Op de westoever takken twee lussen ('krullen') naar de Maasboulevard af; het
// model bevat het deel dat de BGT als overbrugging registreert (tot de
// keerwanden waar de krullen op een aarden baan verder lopen).
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog; de constructie als building, de wegdelen op het dek als road
// met de BGT-attributen) als catalogusbron voor de export en de kaart, plus een
// binaire STL in millimeters op 1:<schaal> met een printvoet onder het dek.
//
//   node scripts/generate-kennedybrug-maastricht.mjs              # STL op 1:1500 (standaard, ca. 400 mm)
//   node scripts/generate-kennedybrug-maastricht.mjs --scale 2000
//
// Assenstelsel: oorsprong op de as van het dek midden tussen de rivierpijlers
// (RD 177017,00, 316930,76), op de waterspiegel van de Maas (stuwpeil Borgharen,
// NAP +44,0 m), Z omhoog. +X loopt langs het rechte oostelijke deel van de brug
// naar Céramique (oostzuidoost, RD-richting -19,83 graden vanaf het oosten), +Y
// naar het noordnoordoosten (stroomafwaarts). Het dek is recht vanaf x = -202,7
// en buigt westelijk daarvan in een boog met een straal van 396 m naar -Y
// (het middelpunt ligt op (-202,7, -396)); lofts, kolommen en landhoofd volgen
// die boog. Rivierpijlers op x = -56,1 en 56,1 (scheef, evenwijdig aan de
// stroom, 20,3 graden uit de dwarsrichting), kolomrijen op ±116,5 en daarna om
// de 36 m; het dek eindigt op x = 264,4 (oost) en rond x = -331,6 (west).
//
// Bronnen: BGT overbruggingsdeel (dek met de aanzetten van de krullen, het dek
// van de zuidelijke krul, de twee rivierpijlers van 24 × 5 m en 56 ronde
// kolommen van 1,2 m), BGT wegdeel en ondersteunend wegdeel (rijbaan, fietspad,
// voetpad, verkeerseilanden en middenberm op het dek); AHN DSM 0,5 m (PDOK WCS)
// voor het lengteprofiel van het wegdek (top NAP +57,01 m tussen x = -40,8 en
// 41,8, topbogen met een straal van 4300 m, hellingen van 1,85 % naar het westen
// en 1,94 % naar het oosten; restfout 5 cm), de verkanting in de boog (3,6 %) en
// de hellingen van de krullen (circa 3 %, NAP +56,4 m bij de splitsing naar
// +51,7 m aan het einde); PDOK-terrein voor de waterspiegel (89,89 m
// ellipsoïdisch = NAP +44,0 m); Wikipedia voor de geschiedenis, de krullen en de
// indeling van het dek; Wikimedia Commons-foto's (Rijkswaterstaat/Joop van
// Houdt, Mark Ahsmann, Kleon3, Gemeente Maastricht; CC BY-SA en CC BY) voor de
// toog, de U-vormige rivierpijlers met
// taps toelopende kolommen, de twee kokerliggers met schuine lijven en de ronde
// kolommen. Geschat (foto's, verhoudingen tegen de hoogte boven het water): de
// constructiehoogte (5,6 m boven de rivierpijlers, 3,0 m midden in het
// hoofdveld, 2,2 m over de aanbruggen en 1,8 m onder de krullen), de breedte van
// de kokers (6,2 m onderaan, 9,2 m bovenaan), de dikte van de dekplaat, de
// hoogte van de muur tussen de kolommen van de rivierpijlers (NAP +46,4 m), de
// vorm van die kolommen, de landhoofden en de hoogte van schampkanten,
// verkeerseilanden en middenberm.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kennedybrug-maastricht");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(24);
const DATA = kennedyData();

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts.filter((p) => p && !p.isEmpty()));
const area2 = (pts) => pts.reduce((a, [x0, y0], i) => {
  const [x1, y1] = pts[(i + 1) % pts.length];
  return a + x0 * y1 - x1 * y0;
}, 0);
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
const cs = (poly) => new CrossSection([ccw(poly)], "Positive");
const csUnion = (polys) => CrossSection.union(polys.map(cs));
// Plattegrond (CrossSection) uitgetrokken van z0 tot z1.
const prismCS = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const lerpTable = (table, t) => {
  if (t <= table[0][0]) return table[0][1];
  for (let i = 1; i < table.length; i++) {
    const [t1, v1] = table[i];
    if (t <= t1) {
      const [t0, v0] = table[i - 1];
      return v0 + ((v1 - v0) * (t - t0)) / (t1 - t0);
    }
  }
  return table[table.length - 1][1];
};

// Loft langs een pad: per station een punt (x, y), een richting (dx, dy) en een
// convexe doorsnede [lateraal, z] (lateraal positief naar links van de
// looprichting), steeds evenveel punten. De omloopzin wordt zo nodig omgedraaid.
function loftPath(stations) {
  const build = (flip) => {
    const n = stations[0].section.length;
    const verts = [];
    for (const { x, y, dx, dy, section } of stations) {
      const len = Math.hypot(dx, dy);
      const nx = -dy / len;
      const ny = dx / len;
      const sec = flip ? [...section].reverse() : section;
      for (const [l, z] of sec) verts.push(x + l * nx, y + l * ny, z);
    }
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
    return new Manifold(new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }));
  };
  let solid = build(false);
  if (solid.status() !== "NoError" || solid.volume() < 0) solid = build(true);
  if (solid.status() !== "NoError" || solid.volume() <= 0) throw new Error(`loft: ${solid.status()}`);
  return solid;
}
// Stations van a tot b om de `step`, plus de opgegeven tussenpunten.
function stations(a, b, step, extra = []) {
  const n = Math.max(1, Math.round((b - a) / step));
  return [...Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n), ...extra.filter((v) => v > a && v < b)]
    .sort((p, q) => p - q)
    .filter((v, i, arr) => i === 0 || v - arr[i - 1] > 1e-3);
}

// ---------- tracé ----------
// Recht vanaf x = XT, westelijk daarvan een boog met straal R naar -Y (fit op
// de BGT-dekranden, restfout 7 cm). at(x, s): punt op afstand s links van de as
// bij station x; stationOf(p): omgekeerd.
const ALIGN = { xt: -202.68, radius: 396.0 };
const heading = (x) => (x < ALIGN.xt ? (x - ALIGN.xt) / ALIGN.radius : 0);
function at(x, s) {
  if (x >= ALIGN.xt) return [x, s];
  const t = heading(x);
  const r = ALIGN.radius + s;
  return [ALIGN.xt + r * Math.sin(t), -ALIGN.radius + r * Math.cos(t)];
}
function stationOf([px, py]) {
  if (px >= ALIGN.xt) return [px, py];
  const vx = px - ALIGN.xt;
  const vy = py + ALIGN.radius;
  const t = Math.atan2(vx, vy);
  return [ALIGN.xt + ALIGN.radius * t, Math.hypot(vx, vy) - ALIGN.radius];
}
const loftAlign = (xs, section) =>
  loftPath(xs.map((x) => {
    const t = heading(x);
    const [px, py] = at(x, 0);
    return { x: px, y: py, dx: Math.cos(t), dy: -Math.sin(t), section: section(x) };
  }));

// ---------- hoogtes (boven de waterspiegel, NAP +44,0 m) ----------
const WATER_NAP = 44.0;
const Z = (nap) => nap - WATER_NAP;
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// PDOK-waterspiegel van de Maas (ellipsoïdisch) op de maaiveldpunten.
const GROUND_HEIGHT = 89.89;

// Lengteprofiel van het hoofddek (AHN DSM, rijstroken): horizontaal tussen
// x = -40,8 en 41,8 op NAP +57,01 m, topbogen met straal 4300 m, daarbuiten
// 1,85 % (west) en 1,94 % (oost) naar beneden.
const PROFILE = { crestNap: 57.01, flat: [-40.8, 41.8], radius: 4300, gradeWest: 0.0185, gradeEast: 0.0194 };
function roadNap(x) {
  const side = x < PROFILE.flat[0] ? -1 : x > PROFILE.flat[1] ? 1 : 0;
  if (side === 0) return PROFILE.crestNap;
  const u = side < 0 ? PROFILE.flat[0] - x : x - PROFILE.flat[1];
  const g = side < 0 ? PROFILE.gradeWest : PROFILE.gradeEast;
  const ut = g * PROFILE.radius;
  return u < ut ? PROFILE.crestNap - (u * u) / (2 * PROFILE.radius) : PROFILE.crestNap - (ut * ut) / (2 * PROFILE.radius) - g * (u - ut);
}
// Verkanting in de boog (AHN): de noordrand (buitenbocht) 3,6 % hoger, tussen
// x = -215 en -175 teruglopend naar een vlak dwarsprofiel.
const SUPER = { value: 0.036, full: -215, zero: -175 };
const superE = (x) => SUPER.value * Math.min(1, Math.max(0, (SUPER.zero - x) / (SUPER.zero - SUPER.full)));
const zMain = (x, s) => Z(roadNap(x)) + superE(x) * s;

// Krullen: hoogte als functie van de hoek (graden) rond het middelpunt van de
// lus (AHN DSM, mediaan per 6 graden, lineair tussen de knopen; bij de
// splitsing gelijk aan het hoofddek).
const RAMPS = {
  north: { centre: [-181.63, 64.45], knots: [[90, 51.53], [120, 52.13], [234, 54.42], [294, 55.36], [323, 56.44], [340, 57.07]] },
  south: { centre: [-168.65, -65.88], knots: [[30, 57.0], [44, 56.44], [70, 55.35], [90, 54.92], [222, 52.13], [255, 51.4]] },
};
const phiOf = (ramp, [px, py]) => {
  const a = (Math.atan2(py - ramp.centre[1], px - ramp.centre[0]) * 180) / Math.PI;
  return a < 0 ? a + 360 : a;
};
const zRamp = (ramp, phi) => Z(lerpTable(ramp.knots, phi));

// ---------- plattegrond en gebieden ----------
// Het hoofddek ligt tussen de randen sS en sN (BGT). Waar de krullen aftakken
// (x = -196 tot -112) is de grens tussen hoofddek en krul de lijn waar de
// rijbaan van de krul begint; elders ligt de grens buiten de brug.
const DECK_S = -13.42;
const DECK_N = [[-332, 13.56], [-195, 13.6], [-115, 13.75], [48, 13.74], [180.5, 13.29], [264.4, 13.22]];
const SPLIT_N = [[-196, 13.62], [-150, 13.62], [-112, 13.8]];
const SPLIT_S = [[-188, -13.47], [-150, -13.47], [-125, -13.72], [-112, -13.75]];
const corridorN = (x) => (x < -196 || x > -112 ? 15 : lerpTable(SPLIT_N, x));
const corridorS = (x) => (x < -188 || x > -112 ? -15 : lerpTable(SPLIT_S, x));
const X_WEST = -345;
const X_EAST = 280;
const corridorXs = stations(X_WEST, X_EAST, 1, [-196, -195.99, -188, -187.99, -150, -125, -112, -111.99]);
const corridorCS = cs([
  ...corridorXs.map((x) => at(x, corridorS(x))),
  ...[...corridorXs].reverse().map((x) => at(x, corridorN(x))),
]);
// De twee BGT-vlakken sluiten op enkele millimeters na op elkaar aan: dichtzetten.
const PLAN = csUnion(DATA.plan).offset(0.05, "Miter", 2).offset(-0.05, "Miter", 2);
const MAIN = PLAN.intersect(corridorCS);
const rampParts = PLAN.subtract(corridorCS).decompose();
const RAMP_N = CrossSection.union(rampParts.filter((p) => p.bounds().max[1] > 0 && p.bounds().min[1] > -5));
const RAMP_S = CrossSection.union(rampParts.filter((p) => p.bounds().max[1] < 5));
// Gebied met de stroken voor het wegdek: tot 1 m buiten de brug.
const PLAN_OUT = PLAN.offset(1, "Miter", 2);
const halfN = cs([[X_WEST, 0], [X_EAST, 0], [X_EAST, 200], [X_WEST, 200]]);
const halfS = cs([[X_WEST, 0], [X_EAST, 0], [X_EAST, -200], [X_WEST, -200]]);
const MAIN_OUT = PLAN_OUT.intersect(corridorCS);
const RAMP_N_OUT = PLAN_OUT.subtract(corridorCS).intersect(halfN);
const RAMP_S_OUT = PLAN_OUT.subtract(corridorCS).intersect(halfS);

// Hoek-bereik van de krullen (uit de plattegrond).
function phiRange(ramp, section) {
  const phis = section.toPolygons().flat().map((p) => phiOf(ramp, p));
  return [Math.min(...phis) - 3, Math.max(...phis) + 3];
}
const RANGE_N = phiRange(RAMPS.north, RAMP_N_OUT);
const RANGE_S = phiRange(RAMPS.south, RAMP_S_OUT);

// Banden: tussen lo(zt) en hi(zt), met zt de hoogte van het wegdek, over een
// gebied; per gebied een eigen loft (hoofddek langs de as, krullen rond hun
// middelpunt).
const mainXs = stations(X_WEST, X_EAST, 2, [-196, -188, -150, -125, -116.5, -112, -59.1, -53, -40.8, 41.8, 53, 59.1, 116.5, ALIGN.xt]);
const mainBand = (lo, hi) =>
  loftAlign(mainXs, (x) => [
    [-20, lo(zMain(x, -20))],
    [20, lo(zMain(x, 20))],
    [20, hi(zMain(x, 20))],
    [-20, hi(zMain(x, -20))],
  ]);
const R0 = 57;
function rampBand(ramp, range, lo, hi) {
  const phis = stations(range[0], range[1], 1.5);
  return loftPath(phis.map((phi) => {
    const a = (phi * Math.PI) / 180;
    const zt = zRamp(ramp, phi);
    return {
      x: ramp.centre[0] + R0 * Math.cos(a),
      y: ramp.centre[1] + R0 * Math.sin(a),
      dx: -Math.sin(a),
      dy: Math.cos(a),
      section: [[-45, lo(zt)], [42, lo(zt)], [42, hi(zt)], [-45, hi(zt)]],
    };
  }));
}
const REGIONS = [
  { name: "main", area: MAIN, out: MAIN_OUT, band: mainBand },
  { name: "north", area: RAMP_N, out: RAMP_N_OUT, band: (lo, hi) => rampBand(RAMPS.north, RANGE_N, lo, hi) },
  { name: "south", area: RAMP_S, out: RAMP_S_OUT, band: (lo, hi) => rampBand(RAMPS.south, RANGE_S, lo, hi) },
];
// Laag op het dek binnen een plattegrond, per gebied tussen lo(zt) en hi(zt).
function onDeck(section, lo, hi, key = "area") {
  return union(REGIONS.map((r) => {
    const part = section.intersect(r[key]);
    if (part.isEmpty()) return null;
    return prismCS(part, BASE - 2, 120).intersect(r.band(lo, hi));
  }));
}
// Hoogte van het wegdek boven een punt.
function zTopAt(p) {
  const [x, s] = stationOf(p);
  if (s <= corridorN(x) && s >= corridorS(x)) return zMain(x, s);
  return s > 0 ? zRamp(RAMPS.north, phiOf(RAMPS.north, p)) : zRamp(RAMPS.south, phiOf(RAMPS.south, p));
}

// ---------- hoofddek: dekplaat en twee kokerliggers ----------
// Rivierpijlers op x = ±56,05 (BGT), kolomrijen op ±116,5 en verder om de 36 m.
const PIER_X = 56.05;
// Constructiehoogte onder het wegdek (geschat op foto's): boven de
// rivierpijlers 5,6 m (vlak tussen ±53 en ±59,1), midden in het hoofdveld
// 3,0 m (parabolische toog), in de zijvelden in een parabool terug naar 2,2 m
// bij de eerste kolomrij (±116,5); de aanbruggen 2,2 m.
const DEPTH = { pier: 5.6, mid: 3.0, approach: 2.2, pierHalf: 3.05, side: 116.5 };
function depth(x) {
  const u = Math.abs(x);
  const p0 = PIER_X - DEPTH.pierHalf;
  const p1 = PIER_X + DEPTH.pierHalf;
  if (u <= p0) return DEPTH.mid + (DEPTH.pier - DEPTH.mid) * (u / p0) ** 2;
  if (u <= p1) return DEPTH.pier;
  if (u <= DEPTH.side) return DEPTH.approach + (DEPTH.pier - DEPTH.approach) * (1 - (u - p1) / (DEPTH.side - p1)) ** 2;
  return DEPTH.approach;
}
// Kokers per rijrichting (BGT-kolommen op s = ±4,3 en ±9,3): hart op ±6,8,
// onderkant 6,2 m breed, bovenkant 9,2 m (schuine lijven).
const BOXES = [-6.8, 6.8];
const BOX = { bottomHalf: 3.1, topHalf: 4.6 };
// Dekplaat: 0,75 m boven de lijven, naar de randen dunner (0,6 m op de dekrand,
// lineair doorgetrokken tot s = ±15) en 0,6 m in het midden tussen de kokers.
const SLAB = { web: 0.75, edge: 0.6, middle: 0.6 };
const slabT = (s) => {
  const u = Math.abs(s);
  const webOut = BOXES[1] + BOX.topHalf; // 11,4
  return u <= webOut ? SLAB.web : SLAB.web - ((SLAB.web - SLAB.edge) * (u - webOut)) / (13.42 - webOut);
};
const webIn = BOXES[1] - BOX.topHalf; // 2,2
const mainSlab = [-1, 1].map((side) =>
  loftAlign(mainXs, (x) => {
    const pts = side < 0 ? [-15, -11.4, -webIn, 0] : [0, webIn, 11.4, 15];
    const bottom = pts.map((s) => [s, zMain(x, s) - (s === 0 ? SLAB.middle : slabT(s))]);
    const top = [[pts[3], zMain(x, pts[3])], [pts[0], zMain(x, pts[0])]];
    return [...bottom, ...top];
  }),
);
const soffitAt = (x, c) => zMain(x, c) - depth(x);
const mainBoxes = BOXES.map((c) =>
  loftAlign(mainXs, (x) => [
    [c - BOX.bottomHalf, soffitAt(x, c)],
    [c + BOX.bottomHalf, soffitAt(x, c)],
    [c + BOX.topHalf, zMain(x, c + BOX.topHalf) - 0.6],
    [c - BOX.topHalf, zMain(x, c - BOX.topHalf) - 0.6],
  ]),
);
const mainDeck = prismCS(MAIN, BASE - 2, 120).intersect(union([...mainSlab, ...mainBoxes]));

// ---------- krullen: dekplaat en koker ----------
// Dekplaat 0,6 m, koker 1,8 m onder het wegdek, 3 m binnen de randen van het
// krul-gebied (ook binnen de grens met het hoofddek).
const RAMP = { slab: 0.6, depth: 1.8, inset: 3.0 };
const rampDecks = [REGIONS[1], REGIONS[2]].map((r) => union([
  prismCS(r.area, BASE - 2, 120).intersect(r.band((zt) => zt - RAMP.slab, (zt) => zt)),
  prismCS(r.area.offset(-RAMP.inset, "Miter", 2), BASE - 2, 120).intersect(r.band((zt) => zt - RAMP.depth, (zt) => zt - 0.4)),
]));

// ---------- landhoofden ----------
// Aan beide einden van het hoofddek en aan het einde van elke krul (waar de
// baan op een aarden lichaam verder loopt): een massief blok onder het dek,
// 3 m diep vanaf de eindlijn van de BGT.
const ENDS = [
  { name: "west", line: [[-325.2, -33.45], [-333.52, -7.9]] },
  { name: "oost", line: [[264.5, -13.48], [264.37, 13.22]] },
  { name: "krul-noord", line: DATA.rampEnds.north },
  { name: "krul-zuid", line: DATA.rampEnds.south },
];
const ABUT_DEPTH = 3.0;
function endStrip([[x0, y0], [x1, y1]], inward, outward, extend = 2) {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const tx = (x1 - x0) / len;
  const ty = (y1 - y0) / len;
  // normaal naar binnen: naar het zwaartepunt van de brug
  let nx = -ty;
  let ny = tx;
  const mid = [(x0 + x1) / 2, (y0 + y1) / 2];
  const inside = PLAN.intersect(cs([
    [mid[0] + nx * 0.5 - tx * 0.5, mid[1] + ny * 0.5 - ty * 0.5],
    [mid[0] + nx * 0.5 + tx * 0.5, mid[1] + ny * 0.5 + ty * 0.5],
    [mid[0] + nx * 0.6 + tx * 0.5, mid[1] + ny * 0.6 + ty * 0.5],
    [mid[0] + nx * 0.6 - tx * 0.5, mid[1] + ny * 0.6 - ty * 0.5],
  ]));
  if (inside.isEmpty()) {
    nx = -nx;
    ny = -ny;
  }
  const a = [x0 - tx * extend, y0 - ty * extend];
  const b = [x1 + tx * extend, y1 + ty * extend];
  return cs([
    [a[0] - nx * outward, a[1] - ny * outward],
    [b[0] - nx * outward, b[1] - ny * outward],
    [b[0] + nx * inward, b[1] + ny * inward],
    [a[0] + nx * inward, a[1] + ny * inward],
  ]);
}
const abutments = ENDS.map(({ line }) => onDeck(endStrip(line, ABUT_DEPTH, 0).intersect(PLAN), () => BASE, (zt) => zt - 0.5));

// ---------- kolommen ----------
// Ronde kolommen van 1,2 m (BGT) van de onderkant tot 0,6 m onder het wegdek.
const COLUMN_D = 1.2;
const columns = DATA.columns.map(([x, y]) =>
  Manifold.cylinder(zTopAt([x, y]) - 0.6 - BASE, COLUMN_D / 2, COLUMN_D / 2, 24).translate([x, y, BASE]),
);

// ---------- rivierpijlers ----------
// Per pijler de BGT-omtrek (24 × 5 m, met spitse koppen, evenwijdig aan de
// stroom) als muur tot NAP +46,4 m, met aan beide einden een taps toelopende
// kolom onder een koker tot 0,3 m in de koker: onderaan van 5,0 tot 12,5 m uit
// het hart, bovenaan van 5,6 tot 10,6 m; daartussen de doorgang boven de muur.
const PIER = { wallTopNap: 46.4, axis: [-0.3477, 0.9377], inner: [5.0, 5.6], outer: [12.5, 10.6] };
const pierParts = DATA.piers.map((poly) => {
  const c = poly.reduce((acc, [x, y]) => [acc[0] + x / poly.length, acc[1] + y / poly.length], [0, 0]);
  const xp = Math.sign(c[0]) * PIER_X;
  const zw = Z(PIER.wallTopNap);
  const plan = cs(poly);
  const wall = prismCS(plan, BASE, zw);
  const [ax, ay] = PIER.axis;
  const angle = (Math.atan2(ay, ax) * 180) / Math.PI;
  const cols = [-1, 1].map((side) => {
    const boxC = side * 6.8;
    const zs = soffitAt(xp, boxC) + 0.3;
    const prof = [[side * PIER.inner[0], zw - 0.1], [side * PIER.outer[0], zw - 0.1], [side * PIER.outer[1], zs], [side * PIER.inner[1], zs]];
    // profiel in het (u, z)-vlak, uitgetrokken over de dikte (v) en gedraaid naar de pijleras
    const slabU = Manifold.extrude([ccw(prof)], 12).rotate([90, 0, 0]).translate([0, 6, 0]);
    return slabU.rotate([0, 0, angle]).translate([c[0], c[1], 0]).intersect(prismCS(plan, BASE, 120));
  });
  return { wall, cols, plan, top: Math.max(soffitAt(xp, -6.8), soffitAt(xp, 6.8)) + 0.3 };
});

// ---------- op het dek: schampkanten, verkeerseilanden, middenberm ----------
// Schampkant met leuningvoet langs alle randen van de brug (ook rond de
// neuzen tussen hoofddek en krullen), 0,9 m breed en 0,6 m boven het wegdek;
// niet over de eindlijnen. De verkeerseilanden tussen fietspad en rijbaan
// (BGT ondersteunend wegdeel) 0,3 m hoog, de middenberm met de dubbele
// geleiderail 0,8 m.
const EDGE = { width: 0.9, h: 0.6 };
const ISLAND_H = 0.3;
const BERM_H = 0.8;
const GUARD = 0.02;
const EXT = CrossSection.union([PLAN, ...ENDS.map(({ line }) => endStrip(line, 0, 5, 0))]);
const ring = PLAN.subtract(EXT.offset(-EDGE.width, "Miter", 2));
const islandsCS = csUnion(DATA.roads.island).intersect(PLAN);
const bermCS = csUnion(DATA.roads.berm).intersect(PLAN);
const edgeBeams = onDeck(ring, (zt) => zt - 0.6, (zt) => zt + EDGE.h);
const islands = onDeck(islandsCS, (zt) => zt - 0.6, (zt) => zt + ISLAND_H);
const berm = onDeck(bermCS, (zt) => zt - 0.6, (zt) => zt + BERM_H);

const bridge = union([
  mainDeck,
  ...rampDecks,
  ...abutments,
  ...columns,
  ...pierParts.flatMap((p) => [p.wall, ...p.cols]),
  edgeBeams,
  islands,
  berm,
]);

// ---------- wegdelen als eigen onderdelen ----------
// De bovenste 0,5 m van het wegdek is per BGT-functie een eigen node met de
// attributen van de actuele BGT-wegdelen erop (relatieve hoogteligging 1,
// glTF `extras.attributes`), zodat de kleurregels van een thema op het brugdek
// werken zoals op de PDOK-wegdelen ernaast. Snijstrook per gebied van 0,5 m
// onder tot 1 m boven het wegdek, tot 1 m buiten de brug; schampkanten,
// verkeerseilanden en middenberm blijven met 2 cm vrij constructie. Volgorde:
// voetpaden, fietspaden en het asfaltdeel van de zuidelijke krul uit de
// BGT-contouren; de rest van de strook is rijbaan.
const LAYER = 0.5;
const ABOVE = 1.0;
const GROUPS = [
  ["road:voetpad", "voetpad", { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "gesloten verharding" }],
  ["road:voetpad-open-verharding", "voetpad-open", { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "open verharding" }],
  ["road:fietspad", "fietspad", { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" }],
  ["road:fietspad-krul-zuid", "fietspad-asfalt", { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" }],
  ["road:rijbaan-krul-zuid", "rijbaan-asfalt", { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" }],
];
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding" };
const strip = onDeck(PLAN_OUT, (zt) => zt - LAYER, (zt) => zt + ABOVE, "out");
const ringGuard = PLAN.offset(GUARD, "Miter", 2).subtract(EXT.offset(-EDGE.width - GUARD, "Miter", 2));
const notLayer = union([
  onDeck(ringGuard, (zt) => zt - 0.6 - GUARD, (zt) => zt + EDGE.h + GUARD, "out"),
  onDeck(islandsCS.offset(GUARD, "Miter", 2), (zt) => zt - 0.6 - GUARD, (zt) => zt + ISLAND_H + GUARD, "out"),
  onDeck(bermCS.offset(GUARD, "Miter", 2), (zt) => zt - 0.6 - GUARD, (zt) => zt + BERM_H + GUARD, "out"),
]);
const layer = strip.subtract(notLayer);
let rest = layer;
const roadParts = [];
for (const [name, key, attributes] of GROUPS) {
  // 6 cm groter: zo vallen de naden tussen de vereenvoudigde BGT-contouren
  // niet als smalle reepjes rijbaan tussen voetpad en fietspad.
  const region = prismCS(csUnion(DATA.roads[key]).offset(0.06, "Miter", 2), BASE - 2, 120);
  roadParts.push([name, rest.intersect(region).intersect(bridge), attributes]);
  rest = rest.subtract(region);
}
roadParts.push(["road:rijbaan", rest.intersect(bridge), ROAD_ATTRIBUTES]);
const structure = bridge.subtract(layer);
// Splinters zonder volume (waar een krul-gebied als smalle strook langs het
// hoofddek loopt) vallen weg.
const clean = (solid) => union(solid.decompose().filter((c) => c.volume() > 0.01));
const parts = [["building:kennedybrug-maastricht", clean(structure)], ...roadParts.map(([n, solid, a]) => [n, clean(solid), a])];
// De onderdelen tellen op tot de brug als geheel (geen overlap, niets kwijt).
const partition = {
  bridgeM3: +bridge.volume().toFixed(1),
  partsM3: Object.fromEntries(parts.map(([name, solid]) => [name, +solid.volume().toFixed(1)])),
};
partition.sumM3 = +parts.reduce((sum, [, solid]) => sum + solid.volume(), 0).toFixed(1);
partition.overlapM3 = +union(parts.slice(1).map(([, solid]) => solid)).intersect(parts[0][1]).volume().toFixed(3);
if (Math.abs(partition.sumM3 - partition.bridgeM3) > 0.5 || partition.overlapM3 > 0.01) {
  throw new Error(`onderdelen tellen niet op: ${JSON.stringify(partition)}`);
}
console.log("partitie (m3):", JSON.stringify(partition));

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de kolommen vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden vanaf de randen van de
// dekplaat, onder de hoeken van de kokers door, die uitloopt in een scherm van
// minstens 0,9 mm op printschaal tot de onderplaat; onder de krullen idem rond
// het midden van de krul; de doorgangen van de rivierpijlers worden dichtgezet.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.45 * scale) / 1000);
function footSection(yL, zbL, yR, zbR, ym, kL, kR) {
  const zsL = zbL - kL * (ym - SCREEN - yL);
  const zsR = zbR - kR * (yR - ym - SCREEN);
  const left = zsL > BASE + 0.05 ? [[ym - SCREEN, BASE], [ym - SCREEN, zsL]] : (() => {
    const a = yL + (zbL - BASE) / kL;
    return [[a, BASE], [a - 1e-3, BASE + 1e-3]];
  })();
  const right = zsR > BASE + 0.05 ? [[ym + SCREEN, BASE], [ym + SCREEN, zsR]] : (() => {
    const a = yR - (zbR - BASE) / kR;
    return [[a, BASE], [a + 1e-3, BASE + 1e-3]];
  })();
  return [left[0], right[0], right[1], [yR, zbR], [yL, zbL], left[1]];
}
const deckN = (x) => lerpTable(DECK_N, x);
const mainFoot = loftAlign(mainXs, (x) => {
  const yL = DECK_S - GUARD;
  const yR = deckN(x) + GUARD;
  const zbL = zMain(x, yL) - SLAB.edge + 0.02;
  const zbR = zMain(x, yR) - SLAB.edge + 0.02;
  const kL = Math.max(KNEE, (zbL - (soffitAt(x, BOXES[0]) - 0.05)) / (BOXES[0] - BOX.bottomHalf - 0.02 - yL));
  const kR = Math.max(KNEE, (zbR - (soffitAt(x, BOXES[1]) - 0.05)) / (yR - BOXES[1] - BOX.bottomHalf - 0.02));
  return footSection(yL, zbL, yR, zbR, 0, kL, kR);
}).intersect(prismCS(PLAN.offset(GUARD, "Miter", 2).intersect(corridorCS), BASE - 2, 120));
// Radiale grenzen van een krul langs een straal vanuit het middelpunt.
function radialHits(ramp, section, phi) {
  const a = (phi * Math.PI) / 180;
  const d = [Math.cos(a), Math.sin(a)];
  const hits = [];
  for (const poly of section.toPolygons()) {
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i];
      const q = poly[(i + 1) % poly.length];
      const e = [q[0] - p[0], q[1] - p[1]];
      const w = [p[0] - ramp.centre[0], p[1] - ramp.centre[1]];
      const den = d[0] * e[1] - d[1] * e[0];
      if (Math.abs(den) < 1e-12) continue;
      const t = (w[0] * e[1] - w[1] * e[0]) / den;
      const u = (w[0] * d[1] - w[1] * d[0]) / den;
      if (u >= 0 && u <= 1 && t > 0) hits.push(t);
    }
  }
  return hits.length >= 2 ? [Math.min(...hits), Math.max(...hits)] : null;
}
const rampFeet = [[RAMPS.north, RANGE_N, RAMP_N], [RAMPS.south, RANGE_S, RAMP_S]].map(([ramp, range, area]) => {
  const st = stations(range[0], range[1], 1.5)
    .map((phi) => ({ phi, hit: radialHits(ramp, area, phi) }))
    .filter(({ hit }) => hit && hit[1] - hit[0] > 0.2);
  const runs = [];
  for (const s of st) {
    const last = runs[runs.length - 1];
    if (last && s.phi - last[last.length - 1].phi < 1.6) last.push(s);
    else runs.push([s]);
  }
  return union(runs.filter((r) => r.length > 1).map((run) => loftPath(run.map(({ phi, hit: [r0, r1] }) => {
    const a = (phi * Math.PI) / 180;
    const zb = zRamp(ramp, phi) - RAMP.slab + 0.02;
    // lateraal l = R0 - r (positief naar het middelpunt)
    const yL = R0 - r1 - 0.5;
    const yR = R0 - r0 + 0.5;
    return {
      x: ramp.centre[0] + R0 * Math.cos(a),
      y: ramp.centre[1] + R0 * Math.sin(a),
      dx: -Math.sin(a),
      dy: Math.cos(a),
      section: footSection(yL, zb, yR, zb, (yL + yR) / 2, KNEE, KNEE),
    };
  })))).intersect(prismCS(area.offset(GUARD, "Miter", 2), BASE - 2, 120));
});
const pierFill = pierParts.map((p) => prismCS(p.plan, BASE, p.top));
const printFoot = union([mainFoot, ...rampFeet, ...pierFill]);
const printModel = clean(union([bridge, printFoot]));

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant.
function overhangArea(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
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
  }
  return area;
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-4) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
console.log("vrij hangend in het model (m2):", Math.round(overhangArea(bridge)));
console.log("overhang in de printversie (m2):", +overhangArea(printModel).toFixed(1));

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
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    components: solid.decompose().length,
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
report.partition = partition;
report.profile = {
  roadNap: { west: +roadNap(-331.6).toFixed(2), pier: +roadNap(PIER_X).toFixed(2), crest: +roadNap(0).toFixed(2), east: +roadNap(264.4).toFixed(2) },
  soffitNap: { mid: +(soffitAt(0, 6.8) + WATER_NAP).toFixed(2), pier: +(soffitAt(PIER_X, 6.8) + WATER_NAP).toFixed(2), approach: +(soffitAt(150, 6.8) + WATER_NAP).toFixed(2) },
  rampRangesDeg: { north: RANGE_N.map((v) => +v.toFixed(1)), south: RANGE_S.map((v) => +v.toFixed(1)) },
};
const glbFile = path.join(outDir, "kennedybrug-maastricht.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-kennedybrug-maastricht.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van kolommen, pijlers, landhoofden en
// printvoet op het printbed.
const stlName = `kennedybrug-maastricht-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint John F. Kennedybrug 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten op de Maas
// naast het dek, aan weerszijden van de rivierpijlers, 24 m naast de as.
const samplePoints = [-65, -20, 20, 45].flatMap((x) => [
  [x, 24],
  [x, -24],
]);
await writeFile(
  path.join(outDir, "kennedybrug-maastricht.json"),
  JSON.stringify(
    {
      name: "John F. Kennedybrug",
      file: "kennedybrug-maastricht.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [177017.0, 316930.76],
      xAxis: [0.9407, -0.33924],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "G0935.f71ef2ef35924cea9e25a03913abc6c5",
        "L0002.119b2bf7ea9640f3ba164b9d9b20246e",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden tussen de rivierpijlers op de waterspiegel van de Maas (z = 0, NAP +44,0 m) in de oorsprong, +X langs het rechte oostelijke deel naar Céramique (RD-richting -19,83 graden vanaf het oosten) en +Y stroomafwaarts naar het noordnoordoosten; westelijk van x = -202,7 buigt het dek in een boog met een straal van 396 m naar -Y. Zeven nodes: road:rijbaan, road:fietspad, road:voetpad, road:voetpad-open-verharding, road:rijbaan-krul-zuid en road:fietspad-krul-zuid, de bovenste 0,5 m van het wegdek met de attributen van het BGT-wegdeel erop in extras.attributes (bgt_functie rijbaan lokale weg, fietspad of voetpad; bgt_fysiekvoorkomen gesloten of open verharding; plus_fysiekvoorkomen asfalt op het dek van de zuidelijke krul), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, twee kokerliggers met een gezamenlijke dekplaat (27 m breed) van landhoofd tot landhoofd (596 m, wegdek NAP +52,4 m aan de westkant, +57,0 m boven de rivier en +53,5 m aan de oostkant), met een toog van 5,6 m boven de rivierpijlers naar 3,0 m midden in het hoofdveld van 112 m; zijvelden van 60 m en aanbrugvelden van 36 m op ronde kolommen (vier per rij); de twee U-vormige rivierpijlers (muur met twee taps toelopende kolommen); de aanzetten van de twee krullen naar de Maasboulevard op de westoever met hun kolommen en landhoofden; schampkanten langs alle randen, verkeerseilanden en de middenberm. Lantaarnpalen, leuningen, geleiderails als staaf en de bebording zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de Maas naast de rivierpijlers bemonsterd; groundHeight is de PDOK-waterspiegel daar. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: 596.0,
        deckWidthM: 27.0,
        mainSpanM: 2 * PIER_X,
        sideSpanM: +(DEPTH.side - PIER_X).toFixed(1),
        approachSpanM: 36,
        pierCentresM: [-PIER_X, PIER_X],
        alignment: ALIGN,
        profile: PROFILE,
        superelevation: SUPER,
        depthM: DEPTH,
        boxes: { centresM: BOXES, ...BOX },
        ramps: RAMPS,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/John_F._Kennedybrug_(Maastricht)",
        "PDOK BGT overbruggingsdeel (L0002.119b2bf7ea9640f3ba164b9d9b20246e, G0935.f71ef2ef35924cea9e25a03913abc6c5, rivierpijlers en kolommen), wegdeel en ondersteunend wegdeel, EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor het lengteprofiel, de verkanting en de hellingen van de krullen; PDOK-luchtfoto voor de indeling van het dek",
        "Wikimedia Commons: John F. Kennedybrug Maastricht.jpg, Meuse in Maastricht with Kennedybrug and Gouvernement.JPG, 20130504 Maastricht Kennedybrug 01/03/05/07.JPG, 2020 Maastricht, Maaspuntweg, Kennedybrug.jpg, Maastricht, krul Kennedybrug, GAM 6830.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// ---------- vaste invoer (BGT) ----------
function kennedyData() {
  return {
    // BGT overbruggingsdeel L0002.119b2bf7ea9640f3ba164b9d9b20246e (brug met aanzet van beide krullen)
    // en G0935.f71ef2ef35924cea9e25a03913abc6c5 (dek van de zuidelijke krul), lokaal, vereenvoudigd tot 5 cm.
    plan: [
      [[-325.09, -33.13], [-325.06, -33.2], [-325.26, -33.26], [-325.2, -33.45], [-315.1, -30.25], [-300.54, -26.01], [-287.94, -22.98], [-274.69, -20.24], [-259.56, -17.57], [-252.16, -16.59], [-240.36, -15.32], [-229.85, -14.34], [-217.35, -13.69], [-186.86, -13.44], [-186.48, -13.46], [-186.04, -13.69], [-185.61, -14.18], [-185.35, -14.82], [-185.43, -15.52], [-185.81, -16.14], [-190.62, -19.29], [-195.62, -23.08], [-200.19, -27.52], [-204.94, -33.45], [-202.37, -39.98], [-193.03, -40.6], [-190.63, -38.04], [-186.36, -34.46], [-179.61, -29.82], [-169.31, -24.28], [-158.68, -20.06], [-148.0, -17.04], [-136.88, -15.02], [-122.95, -13.67], [-115.26, -13.48], [59.84, -13.52], [194.7, -13.34], [264.5, -13.48], [264.37, 13.22], [180.55, 13.29], [48.01, 13.74], [-115.11, 13.75], [-122.46, 13.54], [-130.38, 13.66], [-139.36, 14.2], [-148.39, 15.47], [-157.9, 17.41], [-169.45, 20.7], [-176.68, 23.54], [-184.64, 27.61], [-190.24, 30.99], [-194.76, 34.36], [-199.94, 38.87], [-203.37, 42.41], [-206.69, 46.53], [-209.81, 51.61], [-211.8, 55.95], [-213.06, 60.12], [-213.82, 64.1], [-213.98, 68.73], [-213.64, 72.42], [-212.59, 76.43], [-211.16, 79.51], [-209.03, 82.87], [-206.66, 85.38], [-204.31, 87.29], [-200.65, 89.4], [-198.33, 90.38], [-202.5, 100.26], [-206.7, 98.42], [-211.5, 95.4], [-215.74, 91.52], [-219.16, 87.2], [-221.69, 82.56], [-223.46, 77.97], [-224.74, 71.78], [-224.9, 66.41], [-224.38, 60.03], [-223.03, 53.43], [-221.01, 46.62], [-218.93, 41.66], [-216.52, 37.38], [-214.19, 33.88], [-211.71, 30.63], [-208.41, 26.94], [-204.56, 23.31], [-199.65, 19.38], [-194.53, 16.13], [-194.29, 15.74], [-194.22, 15.3], [-194.31, 14.72], [-194.6, 14.08], [-195.03, 13.75], [-195.56, 13.6], [-207.09, 13.55], [-220.55, 13.18], [-233.6, 12.42], [-252.65, 10.47], [-266.2, 8.69], [-269.68, 8.14], [-285.99, 4.98], [-292.86, 3.5], [-301.94, 1.33], [-311.8, -1.22], [-324.94, -5.0], [-333.52, -7.9], [-333.34, -8.5], [-333.51, -8.56], [-329.45, -20.77], [-325.44, -32.63], [-325.29, -32.58]],
      [[-204.86, -33.66], [-206.27, -35.41], [-206.74, -36.19], [-208.51, -39.29], [-210.34, -42.88], [-211.55, -45.68], [-212.56, -48.56], [-214.21, -54.44], [-214.9, -57.41], [-215.36, -60.43], [-215.63, -63.47], [-215.75, -66.52], [-215.67, -69.57], [-215.33, -72.6], [-214.79, -75.61], [-214.08, -78.58], [-213.13, -81.47], [-211.84, -84.24], [-210.28, -86.86], [-208.46, -89.31], [-206.4, -91.56], [-204.19, -93.67], [-201.87, -95.65], [-199.32, -97.32], [-196.64, -98.79], [-194.98, -99.56], [-190.92, -89.42], [-193.39, -88.15], [-195.67, -86.5], [-197.82, -84.63], [-199.74, -82.56], [-201.41, -80.31], [-202.76, -77.91], [-203.76, -75.38], [-204.39, -72.66], [-204.77, -69.81], [-204.9, -66.92], [-204.78, -64.02], [-204.43, -61.14], [-204.2, -60.05], [-202.81, -55.66], [-201.67, -53.05], [-199.3, -48.59], [-195.84, -43.75], [-193.36, -40.58], [-202.37, -39.98]],
    ],
    // BGT wegdeel en ondersteunend wegdeel met relatieve hoogteligging 1 (actueel), per groep.
    roads: {
      "fietspad-asfalt": [
        // G0935.26e202459246434692a7fe5bb1940ffe: fietspad, gesloten verharding, asfalt
        [[-191.22, -89.87], [-193.66, -88.57], [-195.98, -86.9], [-198.17, -84.99], [-200.13, -82.88], [-201.83, -80.58], [-203.22, -78.12], [-204.24, -75.52], [-204.88, -72.75], [-205.27, -69.85], [-205.4, -66.92], [-205.28, -63.98], [-204.92, -61.06], [-204.33, -58.16], [-203.53, -55.31], [-202.51, -52.52], [-201.3, -49.79], [-199.92, -47.13], [-198.38, -44.54], [-195.54, -40.39], [-198.23, -40.21], [-200.41, -43.26], [-202.01, -45.96], [-203.46, -48.75], [-204.74, -51.62], [-205.82, -54.57], [-206.67, -57.59], [-207.3, -60.67], [-207.68, -63.79], [-207.8, -66.93], [-207.66, -70.07], [-207.24, -73.18], [-206.54, -76.24], [-205.39, -79.16], [-203.84, -81.89], [-201.98, -84.41], [-199.84, -86.72], [-197.48, -88.78], [-194.93, -90.62], [-192.15, -92.09], [-192.01, -92.13], [-191.12, -89.9]],
      ],
      "rijbaan-asfalt": [
        // G0935.facfa8e368434c3e9b32422dcbdd403b: rijbaan lokale weg, gesloten verharding, asfalt
        [[-192.51, -92.94], [-195.41, -91.4], [-198.05, -89.5], [-200.48, -87.38], [-202.69, -85.0], [-204.62, -82.39], [-206.22, -79.55], [-207.42, -76.51], [-208.15, -73.34], [-208.58, -70.15], [-208.73, -66.93], [-208.59, -63.71], [-208.2, -60.52], [-207.01, -54.73], [-205.34, -49.28], [-203.34, -44.62], [-201.04, -40.02], [-202.33, -39.93], [-204.67, -34.0], [-205.65, -35.35], [-207.57, -38.61], [-209.88, -43.09], [-211.08, -45.86], [-212.08, -48.72], [-213.73, -54.56], [-214.41, -57.51], [-214.87, -60.49], [-215.13, -63.5], [-215.25, -66.52], [-215.17, -69.54], [-214.84, -72.53], [-214.3, -75.51], [-213.6, -78.44], [-212.66, -81.29], [-211.4, -84.01], [-209.87, -86.59], [-208.08, -88.99], [-206.04, -91.21], [-203.86, -93.3], [-201.57, -95.25], [-199.06, -96.89], [-196.41, -98.34], [-194.79, -99.09], [-192.35, -92.99]],
      ],
      "voetpad": [
        // L0002.3534fe3667a94b89a44628a8245e1474: voetpad, gesloten verharding
        [[-198.58, 90.84], [-200.9, 89.9], [-204.62, 87.74], [-207.03, 85.79], [-209.43, 83.25], [-211.64, 79.78], [-213.11, 76.61], [-214.18, 72.51], [-214.53, 68.75], [-214.37, 64.04], [-213.75, 60.04], [-213.06, 56.93], [-211.43, 52.45], [-208.9, 47.57], [-205.96, 42.96], [-201.81, 37.9], [-196.7, 33.31], [-189.5, 28.12], [-183.61, 24.77], [-178.17, 22.04], [-173.72, 20.14], [-167.98, 18.04], [-160.33, 15.8], [-152.45, 13.91], [-146.72, 12.92], [-139.72, 12.03], [-133.59, 11.47], [-126.51, 11.4], [181.44, 11.51], [214.84, 11.38], [264.28, 11.17], [264.27, 12.89], [180.67, 12.96], [23.64, 13.39], [-115.06, 13.43], [-122.29, 13.24], [-130.33, 13.38], [-139.28, 13.87], [-148.41, 15.16], [-157.96, 17.19], [-169.35, 20.34], [-176.69, 23.21], [-184.87, 27.37], [-190.29, 30.72], [-194.99, 34.22], [-200.29, 38.82], [-203.49, 42.12], [-206.91, 46.34], [-210.03, 51.39], [-212.09, 55.85], [-213.37, 60.12], [-214.13, 64.07], [-214.28, 68.61], [-213.96, 72.45], [-212.92, 76.47], [-211.51, 79.49], [-209.3, 83.01], [-206.91, 85.54], [-204.52, 87.5], [-200.72, 89.71], [-198.49, 90.62]],
        // L0002.5a0c5ae0f5de473b8e75cde3f2880028: voetpad, gesloten verharding
        [[-190.07, 21.94], [-188.23, 20.94], [-186.6, 23.7], [-188.45, 24.7]],
        // L0002.77d9475db6d24ffa8245d17880619597: voetpad, gesloten verharding
        [[-193.32, -40.53], [-190.82, -37.83], [-186.51, -34.19], [-179.91, -29.67], [-169.32, -23.96], [-158.74, -19.72], [-148.12, -16.74], [-138.82, -15.04], [-132.0, -14.1], [-125.7, -13.57], [-120.69, -13.27], [-115.2, -13.12], [59.79, -13.26], [194.47, -13.0], [224.72, -13.09], [251.24, -12.96], [264.39, -13.05], [264.39, -11.53], [250.43, -11.44], [223.91, -11.56], [193.66, -11.48], [-64.7, -11.33], [-89.29, -11.24], [-120.98, -11.32], [-131.99, -12.18], [-137.3, -12.87], [-143.88, -13.99], [-149.77, -15.29], [-155.33, -16.79], [-159.53, -18.14], [-164.18, -19.79], [-168.76, -21.66], [-172.21, -23.23], [-176.28, -25.44], [-179.82, -27.56], [-184.18, -30.37], [-187.26, -32.5], [-190.27, -34.98], [-193.11, -37.64], [-195.54, -40.39]],
        // L0002.2e68d7b43a64451a99fd32fb2bf1dbc9: voetpad, gesloten verharding
        [[-333.44, -8.16], [-333.36, -8.43], [-324.77, -5.53], [-311.65, -1.76], [-301.81, 0.79], [-292.74, 2.96], [-285.88, 4.44], [-269.58, 7.59], [-266.12, 8.14], [-252.58, 9.92], [-242.9, 10.96], [-233.25, 11.89], [-220.52, 12.63], [-207.08, 13.0], [-195.48, 13.05], [-194.78, 13.24], [-194.15, 13.73], [-193.78, 14.56], [-193.66, 15.3], [-193.76, 15.93], [-194.12, 16.52], [-199.33, 19.83], [-204.2, 23.72], [-208.01, 27.32], [-211.28, 30.99], [-213.75, 34.2], [-216.06, 37.67], [-218.43, 41.9], [-220.5, 46.81], [-222.5, 53.56], [-223.84, 60.11], [-224.35, 66.42], [-224.19, 71.72], [-222.93, 77.81], [-221.19, 82.33], [-218.7, 86.89], [-215.34, 91.14], [-211.17, 94.96], [-206.44, 97.94], [-202.34, 99.75], [-202.45, 99.99], [-206.67, 98.09], [-211.26, 95.18], [-215.55, 91.28], [-218.93, 87.04], [-221.47, 82.4], [-223.21, 77.74], [-224.44, 71.74], [-224.62, 66.36], [-224.12, 60.09], [-222.76, 53.6], [-220.8, 46.89], [-218.68, 41.83], [-216.29, 37.57], [-214.01, 34.09], [-211.56, 30.89], [-208.03, 26.98], [-204.35, 23.51], [-199.45, 19.61], [-194.43, 16.48], [-194.04, 15.94], [-193.94, 15.39], [-194.02, 14.69], [-194.28, 13.94], [-194.86, 13.5], [-195.73, 13.35], [-204.27, 13.34], [-215.34, 13.06], [-224.59, 12.67], [-233.41, 12.16], [-242.93, 11.24], [-252.62, 10.2], [-266.17, 8.42], [-269.63, 7.87], [-285.94, 4.72], [-292.8, 3.24], [-301.88, 1.07], [-311.73, -1.48], [-324.86, -5.26]],
        // L0002.35277d9207a94e80b78792f8c5669bc9: voetpad, gesloten verharding
        [[-229.89, -13.79], [-240.41, -14.78], [-252.22, -16.05], [-259.64, -17.03], [-274.79, -19.7], [-288.06, -22.44], [-300.68, -25.48], [-315.26, -29.73], [-325.17, -32.91], [-325.09, -33.13], [-315.19, -29.98], [-300.62, -25.73], [-288.01, -22.7], [-274.74, -19.96], [-259.6, -17.28], [-252.19, -16.3], [-240.39, -15.04], [-229.87, -14.05], [-217.34, -13.4], [-215.07, -13.36], [-186.46, -13.13], [-185.86, -13.43], [-185.36, -14.03], [-185.04, -14.78], [-185.16, -15.6], [-185.66, -16.37], [-190.48, -19.48], [-195.47, -23.33], [-200.08, -27.81], [-204.81, -33.61], [-204.67, -34.0], [-199.78, -27.89], [-195.26, -23.5], [-190.31, -19.74], [-185.4, -16.53], [-184.9, -15.71], [-184.79, -14.75], [-185.14, -13.88], [-185.69, -13.25], [-186.33, -12.92], [-186.85, -12.89], [-217.38, -13.14]],
      ],
      "voetpad-open": [
        // L0002.9f876b3b95884987b5dd00aebab26e9c: voetpad, open verharding
        [[-179.53, -24.65], [-177.97, -23.69], [-179.59, -20.75], [-181.21, -21.64]],
        // L0002.4f1f861ca7144865bf775239d385262d: voetpad, open verharding
        [[-233.97, -12.57], [-244.61, -13.62], [-255.84, -15.04], [-270.1, -17.27], [-282.68, -19.72], [-294.58, -22.44], [-306.43, -25.48], [-318.11, -28.95], [-325.85, -31.41], [-325.44, -32.63], [-325.29, -32.58], [-325.17, -32.91], [-315.26, -29.73], [-300.68, -25.48], [-288.06, -22.44], [-274.79, -19.7], [-259.64, -17.03], [-252.22, -16.05], [-240.41, -14.78], [-229.89, -13.79], [-217.38, -13.14], [-186.85, -12.89], [-186.33, -12.92], [-185.69, -13.25], [-185.14, -13.88], [-184.79, -14.75], [-184.9, -15.71], [-185.4, -16.53], [-182.64, -14.91], [-183.73, -13.07], [-184.58, -12.05], [-185.34, -11.63], [-186.35, -11.34], [-200.45, -11.28], [-210.49, -11.38], [-224.85, -11.94]],
        // L0002.6596fbc110e647c7a6720e377a392923: voetpad, open verharding
        [[-333.34, -8.5], [-333.51, -8.56], [-333.08, -9.86], [-325.33, -7.26], [-314.92, -4.2], [-308.12, -2.34], [-299.86, -0.26], [-288.29, 2.32], [-281.43, 3.76], [-272.84, 5.34], [-256.69, 7.81], [-242.76, 9.48], [-232.44, 10.38], [-222.52, 10.99], [-209.61, 11.41], [-194.89, 11.53], [-194.27, 11.72], [-193.06, 12.64], [-192.67, 13.1], [-191.51, 15.11], [-194.72, 16.91], [-194.12, 16.52], [-193.76, 15.93], [-193.66, 15.3], [-193.78, 14.56], [-194.15, 13.73], [-194.78, 13.24], [-195.48, 13.05], [-207.08, 13.0], [-220.52, 12.63], [-233.25, 11.89], [-242.9, 10.96], [-252.58, 9.92], [-266.12, 8.14], [-269.58, 7.59], [-285.88, 4.44], [-292.74, 2.96], [-301.81, 0.79], [-311.65, -1.76], [-324.77, -5.53], [-333.36, -8.43]],
      ],
      "fietspad": [
        // L0002.453728fe380e4663b6e717f233115ceb: fietspad, gesloten verharding
        [[-186.26, 19.67], [-185.35, 21.22], [-184.88, 21.64], [-184.19, 21.89], [-183.63, 21.93], [-183.04, 21.78], [-178.1, 19.48], [-172.31, 17.19], [-166.48, 15.15], [-161.15, 13.62], [-155.8, 12.35], [-149.14, 11.06], [-143.44, 10.22], [-138.64, 9.73], [-133.49, 9.35], [-128.66, 9.15], [50.07, 9.12], [182.79, 8.97], [207.1, 8.86], [233.9, 9.02], [264.29, 9.04], [264.28, 11.17], [181.44, 11.51], [-126.51, 11.4], [-133.59, 11.47], [-139.72, 12.03], [-146.72, 12.92], [-152.45, 13.91], [-160.33, 15.8], [-167.98, 18.04], [-173.72, 20.14], [-178.17, 22.04], [-183.61, 24.77], [-189.5, 28.12], [-196.7, 33.31], [-201.81, 37.9], [-205.96, 42.96], [-208.9, 47.57], [-211.43, 52.45], [-213.06, 56.93], [-213.75, 60.04], [-214.37, 64.04], [-214.53, 68.75], [-214.18, 72.51], [-213.11, 76.61], [-211.64, 79.78], [-209.46, 83.21], [-207.03, 85.79], [-204.62, 87.74], [-200.9, 89.9], [-198.58, 90.84], [-199.5, 93.02], [-200.85, 92.49], [-203.48, 91.12], [-205.53, 89.86], [-208.05, 87.92], [-209.89, 86.18], [-211.65, 84.03], [-213.46, 81.25], [-214.94, 78.29], [-216.01, 75.03], [-216.73, 70.78], [-216.86, 67.17], [-216.71, 64.01], [-216.24, 60.42], [-215.36, 56.49], [-214.01, 52.68], [-212.21, 48.62], [-210.5, 45.52], [-208.49, 42.37], [-206.17, 39.16], [-204.29, 37.11], [-200.3, 33.24], [-195.51, 29.43], [-191.42, 26.57], [-188.45, 24.7], [-186.6, 23.7], [-188.23, 20.94]],
        // L0002.a39b742a62bb45db885ffcec8fc46add: fietspad, gesloten verharding
        [[-179.59, -20.75], [-177.97, -23.69], [-182.82, -26.63], [-186.47, -29.07], [-189.73, -31.49], [-193.85, -35.04], [-196.69, -38.13], [-198.23, -40.21], [-195.54, -40.39], [-193.11, -37.64], [-190.27, -34.98], [-187.26, -32.5], [-184.18, -30.37], [-179.82, -27.56], [-176.28, -25.44], [-172.21, -23.23], [-168.76, -21.66], [-164.18, -19.79], [-159.53, -18.14], [-155.33, -16.79], [-149.77, -15.29], [-143.88, -13.99], [-137.3, -12.87], [-131.99, -12.18], [-120.98, -11.32], [-115.19, -11.29], [-89.29, -11.24], [-64.7, -11.33], [-15.52, -11.32], [59.0, -11.44], [193.66, -11.48], [223.91, -11.56], [250.43, -11.44], [264.39, -11.53], [264.37, -8.91], [217.3, -9.38], [192.43, -9.17], [57.91, -8.94], [-16.08, -9.05], [-115.18, -8.88], [-121.66, -9.01], [-132.2, -9.74], [-137.16, -10.39], [-142.38, -11.23], [-148.69, -12.6], [-153.98, -13.92], [-158.89, -15.41], [-164.82, -17.5], [-169.73, -19.56], [-174.73, -21.85], [-175.39, -21.8], [-176.2, -21.49], [-176.57, -21.11], [-177.4, -19.45]],
        // L0002.c09291dad1264b279507ebe929e05a96: fietspad, gesloten verharding
        [[-224.99, -9.52], [-230.17, -9.88], [-244.83, -11.21], [-255.93, -12.6], [-270.6, -14.89], [-283.28, -17.36], [-295.26, -20.09], [-307.21, -23.16], [-317.01, -25.87], [-326.71, -28.87], [-325.85, -31.41], [-318.11, -28.95], [-306.43, -25.48], [-294.58, -22.44], [-282.68, -19.72], [-270.1, -17.27], [-255.84, -15.04], [-244.61, -13.62], [-233.97, -12.57], [-224.85, -11.94], [-210.49, -11.38], [-200.45, -11.28], [-186.35, -11.34], [-185.34, -11.63], [-184.58, -12.05], [-183.73, -13.07], [-182.64, -14.91], [-180.58, -13.72], [-181.79, -11.63], [-182.5, -10.63], [-183.22, -10.07], [-184.28, -9.4], [-185.58, -9.04], [-187.38, -8.9], [-203.81, -8.89], [-213.78, -9.04]],
        // L0002.f9da20ae99264df9b048a476d282861f: fietspad, gesloten verharding
        [[-272.84, 5.34], [-281.43, 3.76], [-288.29, 2.32], [-299.86, -0.26], [-308.12, -2.34], [-314.92, -4.2], [-325.33, -7.26], [-333.08, -9.86], [-332.34, -12.06], [-324.56, -9.58], [-311.31, -5.64], [-299.24, -2.5], [-290.76, -0.55], [-280.53, 1.61], [-270.95, 3.37], [-263.13, 4.61], [-254.23, 5.82], [-242.53, 7.14], [-229.49, 8.21], [-216.85, 8.86], [-206.59, 9.13], [-195.6, 9.15], [-194.53, 9.28], [-193.55, 9.56], [-192.5, 10.06], [-191.7, 10.68], [-190.77, 11.73], [-189.41, 13.98], [-191.51, 15.11], [-192.67, 13.1], [-193.06, 12.64], [-194.27, 11.72], [-194.89, 11.53], [-209.61, 11.41], [-222.52, 10.99], [-232.44, 10.38], [-242.76, 9.48], [-256.69, 7.81]],
      ],
      "rijbaan": [
        // L0002.1746f279e7104d6c8b618d1aedf51c34: rijbaan lokale weg, gesloten verharding
        [[-254.19, 4.93], [-263.0, 3.73], [-270.8, 2.49], [-280.36, 0.74], [-290.57, -1.42], [-299.03, -3.36], [-311.08, -6.5], [-324.28, -10.43], [-332.06, -12.9], [-329.64, -20.2], [-319.52, -16.89], [-306.51, -13.0], [-292.59, -9.59], [-280.04, -6.84], [-263.58, -3.91], [-249.7, -2.03], [-234.86, -0.59], [-226.76, -0.06], [-210.37, 0.61], [-134.54, 0.66], [-115.13, 0.8], [-3.44, 0.85], [187.32, 0.45], [264.33, 0.71], [264.3, 7.75], [233.25, 7.97], [208.55, 7.7], [183.3, 8.01], [-4.11, 8.16], [-49.41, 8.18], [-130.52, 8.04], [-138.34, 8.07], [-145.75, 8.42], [-151.73, 9.0], [-157.69, 9.91], [-164.11, 11.38], [-169.37, 12.83], [-175.74, 15.04], [-181.83, 17.56], [-186.26, 19.67], [-188.23, 20.94], [-194.68, 24.61], [-198.96, 27.7], [-203.03, 31.62], [-206.38, 35.43], [-210.63, 41.49], [-212.78, 45.61], [-214.33, 49.17], [-215.72, 53.38], [-217.04, 58.93], [-217.63, 63.39], [-217.85, 67.75], [-217.68, 71.38], [-217.01, 75.42], [-215.82, 78.89], [-214.12, 82.2], [-212.18, 85.01], [-210.07, 87.46], [-206.81, 90.25], [-203.88, 92.11], [-201.62, 93.27], [-199.88, 93.92], [-202.34, 99.75], [-206.44, 97.94], [-211.17, 94.96], [-215.34, 91.14], [-218.7, 86.89], [-221.19, 82.33], [-222.93, 77.81], [-224.19, 71.72], [-224.35, 66.42], [-223.84, 60.11], [-222.5, 53.56], [-220.5, 46.81], [-218.43, 41.9], [-216.06, 37.67], [-213.75, 34.2], [-211.28, 30.99], [-208.01, 27.32], [-204.2, 23.72], [-199.33, 19.83], [-194.72, 16.91], [-189.41, 13.98], [-183.31, 11.14], [-182.93, 10.66], [-182.6, 9.87], [-182.56, 9.26], [-182.78, 8.73], [-183.15, 8.39], [-184.08, 8.09], [-210.04, 7.94], [-223.04, 7.62], [-242.45, 6.25]],
        // L0002.b45b03e32a184d058cccb0b7e28533e9: rijbaan lokale weg, gesloten verharding
        [[-327.13, -27.62], [-307.48, -22.1], [-295.5, -19.03], [-283.49, -16.28], [-270.78, -13.8], [-255.97, -11.5], [-244.91, -10.11], [-225.05, -8.42], [-213.27, -7.93], [-202.23, -7.83], [-175.33, -7.9], [-174.81, -8.0], [-174.25, -8.26], [-173.72, -8.85], [-173.51, -9.51], [-173.62, -10.28], [-174.0, -10.7], [-174.62, -11.12], [-180.58, -13.72], [-185.4, -16.53], [-190.31, -19.74], [-195.26, -23.5], [-199.78, -27.89], [-204.67, -34.0], [-202.33, -39.93], [-201.04, -40.02], [-199.81, -38.08], [-197.36, -34.75], [-194.65, -31.66], [-191.08, -28.24], [-187.97, -25.75], [-185.3, -24.07], [-177.4, -19.45], [-174.0, -17.84], [-169.14, -15.73], [-166.1, -14.6], [-161.56, -13.04], [-155.15, -11.08], [-149.67, -9.84], [-140.12, -8.41], [-133.72, -7.94], [-115.17, -7.79], [-81.16, -7.79], [13.17, -7.93], [57.45, -7.89], [191.86, -8.1], [223.91, -7.75], [248.18, -7.74], [264.37, -7.5], [264.34, -0.64], [239.32, -0.54], [187.84, -0.54], [54.14, -0.25], [-115.28, -0.2], [-149.53, -0.43], [-199.52, -0.44], [-219.19, -0.76], [-234.79, -1.47], [-249.61, -2.9], [-263.47, -4.78], [-279.9, -7.71], [-292.44, -10.45], [-306.33, -13.85], [-319.38, -17.6], [-329.45, -20.77]],
      ],
      "island": [
        // L0002.20f64d5519ac4b51ab55d7a7236aba7f: verkeerseiland, gesloten verharding
        [[264.3, 7.75], [264.29, 9.04], [233.9, 9.02], [207.1, 8.86], [182.79, 8.97], [50.07, 9.12], [-128.66, 9.15], [-133.49, 9.35], [-138.64, 9.73], [-143.44, 10.22], [-149.14, 11.06], [-155.8, 12.35], [-161.15, 13.62], [-166.48, 15.15], [-172.31, 17.19], [-178.1, 19.48], [-183.04, 21.78], [-183.63, 21.93], [-184.19, 21.89], [-184.88, 21.64], [-185.35, 21.22], [-186.26, 19.67], [-181.83, 17.56], [-175.74, 15.04], [-169.37, 12.83], [-164.11, 11.38], [-157.69, 9.91], [-151.73, 9.0], [-145.75, 8.42], [-138.34, 8.07], [-4.11, 8.16], [183.3, 8.01], [208.55, 7.7], [233.25, 7.97]],
        // L0002.75f9871245044866a03c9677630dcca5: verkeerseiland, gesloten verharding
        [[264.37, -8.91], [264.37, -7.5], [248.18, -7.74], [223.91, -7.75], [191.86, -8.1], [57.45, -7.89], [13.17, -7.93], [-81.16, -7.79], [-115.17, -7.79], [-133.72, -7.94], [-140.12, -8.41], [-149.67, -9.84], [-155.15, -11.08], [-161.56, -13.04], [-166.1, -14.6], [-169.14, -15.73], [-174.0, -17.84], [-177.4, -19.45], [-176.57, -21.11], [-176.2, -21.49], [-175.39, -21.8], [-174.73, -21.85], [-169.73, -19.56], [-164.82, -17.5], [-158.89, -15.41], [-153.98, -13.92], [-148.69, -12.6], [-142.38, -11.23], [-137.16, -10.39], [-132.2, -9.74], [-121.66, -9.01], [-115.18, -8.88], [-16.08, -9.05], [57.91, -8.94], [192.43, -9.17], [217.3, -9.38]],
        // L0002.b5736edc3bba4e0a9e326f02dbb7d859: verkeerseiland, gesloten verharding
        [[-199.5, 93.02], [-199.88, 93.92], [-201.62, 93.27], [-203.88, 92.11], [-206.81, 90.25], [-210.07, 87.46], [-212.18, 85.01], [-214.12, 82.2], [-215.82, 78.89], [-217.01, 75.42], [-217.68, 71.38], [-217.85, 67.75], [-217.63, 63.39], [-217.04, 58.93], [-215.72, 53.38], [-214.33, 49.17], [-212.78, 45.61], [-210.63, 41.49], [-206.38, 35.43], [-203.03, 31.62], [-198.96, 27.7], [-194.68, 24.61], [-190.07, 21.94], [-188.45, 24.7], [-191.42, 26.57], [-195.51, 29.43], [-200.3, 33.24], [-204.29, 37.11], [-206.17, 39.16], [-208.49, 42.37], [-210.5, 45.52], [-212.21, 48.62], [-214.01, 52.68], [-215.36, 56.49], [-216.24, 60.42], [-216.71, 64.01], [-216.86, 67.17], [-216.73, 70.78], [-216.01, 75.03], [-214.94, 78.29], [-213.46, 81.25], [-211.65, 84.03], [-209.89, 86.18], [-208.05, 87.92], [-205.53, 89.86], [-203.48, 91.12], [-200.85, 92.49]],
        // L0002.bf2241debe8e4b44b533dd00117749b7: verkeerseiland, gesloten verharding
        [[-181.21, -21.64], [-185.3, -24.07], [-187.97, -25.75], [-191.08, -28.24], [-194.65, -31.66], [-197.36, -34.75], [-199.81, -38.08], [-201.04, -40.02], [-198.23, -40.21], [-196.69, -38.13], [-193.85, -35.04], [-189.73, -31.49], [-186.47, -29.07], [-182.82, -26.63], [-179.53, -24.65]],
        // L0002.15f03381116c4adea5b2a18322500ad1: verkeerseiland, gesloten verharding
        [[-327.13, -27.62], [-326.71, -28.87], [-317.01, -25.87], [-307.21, -23.16], [-295.26, -20.09], [-283.28, -17.36], [-270.6, -14.89], [-260.59, -13.28], [-255.93, -12.6], [-244.83, -11.21], [-230.17, -9.88], [-224.99, -9.52], [-213.78, -9.04], [-203.81, -8.89], [-187.38, -8.9], [-185.58, -9.04], [-184.28, -9.4], [-183.22, -10.07], [-182.5, -10.63], [-181.79, -11.63], [-180.58, -13.72], [-174.62, -11.12], [-174.0, -10.7], [-173.62, -10.28], [-173.51, -9.51], [-173.72, -8.85], [-174.25, -8.26], [-174.81, -8.0], [-175.33, -7.9], [-202.23, -7.83], [-213.27, -7.93], [-225.05, -8.42], [-244.91, -10.11], [-255.97, -11.5], [-270.78, -13.8], [-283.49, -16.28], [-295.5, -19.03], [-307.48, -22.1]],
        // L0002.f21b12bd164d46c283b7c29289c50a18: verkeerseiland, gesloten verharding
        [[-234.51, 7.82], [-242.53, 7.14], [-254.23, 5.82], [-263.13, 4.61], [-270.95, 3.37], [-280.53, 1.61], [-290.76, -0.55], [-299.24, -2.5], [-311.31, -5.64], [-324.56, -9.58], [-332.34, -12.06], [-332.06, -12.9], [-324.28, -10.43], [-311.08, -6.5], [-299.03, -3.36], [-290.57, -1.42], [-280.36, 0.74], [-270.8, 2.49], [-263.0, 3.73], [-254.19, 4.93], [-242.45, 6.25], [-223.04, 7.62], [-210.04, 7.94], [-184.08, 8.09], [-183.15, 8.39], [-182.78, 8.73], [-182.56, 9.26], [-182.6, 9.87], [-182.93, 10.66], [-183.31, 11.14], [-189.41, 13.98], [-190.77, 11.73], [-191.7, 10.68], [-192.5, 10.06], [-193.55, 9.56], [-194.53, 9.28], [-195.6, 9.15], [-206.59, 9.13], [-216.85, 8.86], [-229.49, 8.21]],
      ],
      "berm": [
        // L0002.d57683bc72844a6681bf96582e6226da: berm, gesloten verharding
        [[-280.04, -6.84], [-292.59, -9.59], [-306.51, -13.0], [-319.52, -16.89], [-329.64, -20.2], [-329.45, -20.77], [-319.38, -17.6], [-306.33, -13.85], [-292.44, -10.45], [-279.9, -7.71], [-263.47, -4.78], [-249.61, -2.9], [-234.79, -1.47], [-219.19, -0.76], [-199.52, -0.44], [-149.53, -0.43], [-115.28, -0.2], [54.14, -0.25], [187.84, -0.54], [239.32, -0.54], [264.34, -0.64], [264.33, 0.71], [187.32, 0.45], [-3.44, 0.85], [-115.13, 0.8], [-134.54, 0.66], [-210.37, 0.61], [-226.76, -0.06], [-234.86, -0.59], [-249.7, -2.03], [-263.58, -3.91]],
      ],
    },
    // BGT overbruggingsdeel type pijler: middelpunten van de ronde kolommen (diameter 1,2 m).
    columns: [[-330.28, -11.17], [-328.54, -15.86], [-325.81, -23.53], [-324.19, -27.99], [-297.53, -1.83], [-296.48, -6.5], [-294.54, -14.92], [-293.44, -19.96], [-261.41, 5.09], [-260.76, 0.2], [-259.62, -8.12], [-259.03, -13.08], [-224.9, 8.81], [-224.61, 3.81], [-224.2, -4.64], [-223.95, -9.64], [-219.59, 77.01], [-216.68, 76.03], [-215.48, 44.37], [-211.6, 46.26], [-210.94, -76.79], [-207.71, -75.97], [-206.22, -44.03], [-202.45, -45.7], [-192.38, 19.82], [-189.26, 25.22], [-188.6, 4.43], [-188.56, -4.19], [-188.53, -9.16], [-188.42, 9.33], [-183.58, -19.49], [-152.53, 11.84], [-152.49, 4.33], [-152.42, -8.89], [-152.38, -13.64], [-152.33, -3.88], [-116.53, -9.07], [-116.53, 4.5], [-116.51, -4.07], [-116.49, 9.36], [115.7, -9.2], [115.79, 4.33], [115.82, 9.93], [115.93, -4.11], [151.86, -9.2], [151.9, -4.21], [151.95, 4.3], [151.98, 9.32], [187.92, 9.29], [187.95, -4.24], [187.97, -9.2], [188.03, 4.31], [223.73, -9.23], [223.77, -4.26], [223.82, 4.24], [223.85, 9.28]],
    // BGT overbruggingsdeel: de twee rivierpijlers (L0002.ae2b86e8782248d49886fc70dc31e098 west,
    // L0002.36d49b8a2a994f659127fac11cad90d6 oost).
    // Eindlijnen van de krullen (BGT), waar de baan op een aarden lichaam verder loopt.
    rampEnds: { north: [[-198.33, 90.38], [-202.5, 100.26]], south: [[-194.98, -99.56], [-190.92, -89.42]] },
    piers: [[[-51.64, -10.63], [-51.96, -9.03], [-56.04, 5.58], [-59.02, 10.56], [-60.33, 11.19], [-60.98, 9.89], [-60.93, 3.65], [-53.51, -11.16], [-52.51, -11.17]], [[60.26, -9.82], [60.22, -3.59], [52.79, 11.22], [51.79, 11.23], [50.92, 10.7], [51.24, 9.09], [55.32, -5.51], [58.3, -10.5], [59.61, -11.12]]],
  };
}

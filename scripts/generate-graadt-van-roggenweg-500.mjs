// Kantoorcomplex Graadt van Roggenweg 400–500 (Utrecht, 2001, De Jong Gortemaker Algra), gebouwd als
// hoofdkantoor van AXA Nederland, nu onder meer het College ter Beoordeling van Geneesmiddelen (nr. 500).
// Eén BAG-pand van 150 m lang tussen de Graadt van Roggenweg en de Jaarbeurshallen: drie bakstenen
// torens van twaalf lagen die op witte V-kolommen boven een terugliggende glazen plint van twee lagen
// staan, ertussen een glazen vleugel met de entreehal en een daktuin op een parkeerdek, en aan de
// noordoostkant een glazen blok van tien lagen met een overstekende dakpunt. De zuidwesttoren draagt
// een glazen kroon met stalen vinnen en een gebogen dak tot NAP +73 m.
// Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG, gevelindeling en kroon uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "graadt-van-roggenweg-500";
// Gebouwstelsel: u langs de lange zuidoostgevel naar het noordoosten (49,7° op RD-oost, BAG-randen
// 49,7–49,8° en -40,3°), v haaks erop naar de Graadt van Roggenweg (noordwest). Oorsprong midden op
// het complex. Het AHN-DSM ligt in dit stelsel circa 0,5 m (u) en 0,85 m (v) lager dan de BAG; maten uit
// het DSM zijn daarvoor gecorrigeerd.
const ORIGIN = [135350.0, 455392.0];
const ANGLE = 49.7;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 2.1; // NAP, 3D BAG-maaiveld 2,07; AHN-DTM achter 2,0–2,2, aan de weg 2,5–2,8
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM (mediaan per vlak) en 3D BAG ----------
const SW_ROOF = 54.85; // zuidwesttoren, hoofddak (DSM 54,8–55,5)
const SW_STRIP = 61.75; // hogere strook aan de noordoostkant van de zuidwesttoren (DSM 61,7–61,9)
const RIDGE = 72.7; // nokbalk over de kroon (DSM 72,6–73,1; 3D BAG 72,5–72,8)
// Kroonprofiel dwars (v, NAP) uit de dakvlakken van de 3D BAG en het DSM: 33° en 28° aan de zuidoostkant,
// vlak rond +70, 19° aan de noordwestkant.
const CROWN_PROFILE = [[-23.45, 63.6], [-19.0, 66.6], [-12.3, 69.5], [-7.0, 70.3], [1.0, 70.4], [8.5, 69.0], [12.5, 66.8], [15.5, 64.6]];
const MID_ROOF = 54.8; // middentoren (DSM 54,7–54,9)
const MID_SIDE = 47.8; // glazen zijvleugel, uiteinden (DSM/3D BAG 47,8)
const MID_SIDE_HI = 51.3; // glazen zijvleugel, midden (51,27)
const MID_PLANT = 59.05; // installatiekast (58,7–59,1)
const MID_RAIL = 63.0; // gevelonderhoudsbaan (62,8–63,2)
const NE_ROOF = (v) => 53.3 + 0.05 * v; // noordoosttoren, dak loopt op naar de weg (52,0 achter, 55,0 voor; 3D BAG 2,9°)
const WING = 33.85; // glazen tussenvleugel (33,8–33,9)
const LOBBY = 12.0; // entreehal (12,0)
const GREEN = 7.8; // laag deel voor de hal (7,8)
const STOEP = 3.6; // verhoogde entreebordessen (DSM 3,5–3,8)
const DECK = 7.2; // parkeerdek met daktuin (DSM 7,0–7,3)
const ANNEX_HI = 7.7, ANNEX_LO = 4.8; // aanbouw zuidwest (DSM 7,7 en 4,5–5,3)
const BLOCK32 = 31.65, STRIP33 = 33.25; // glazen blok noordoost, laag deel met ventilatoren
const BLOCK39 = 39.1, PLANT43 = 42.85, FANS42 = 41.9; // glazen blok noordoost, hoog deel en installaties
const PAV_LOW = 5.7, PAV_HIGH = 7.1; // entreepaviljoens met lessenaarsdak (3D BAG 5,65–7,15)

// ---------- Plattegronden in (u, v), BAG-contour vereenvoudigd (knikjes < 0,9 m weg) ----------
const swFace = (v) => -50.8 - 0.06829 * (v + 26.6); // schuine noordoostgevel van de zuidwesttoren (BAG)
const SW_BOX = [[-76.8, -26.6], [-50.8, -26.6], [-53.74, 16.45], [-68.7, 16.4], [-68.7, 12.6], [-76.8, 12.6]];
const SW_STRIP_POLY = [[-61.0, -26.6], [-50.8, -26.6], [-53.74, 16.45], [-61.0, 16.42]];
const ANNEX_A = rect(-86.2, -10.3, -76.8, -3.5);
const ANNEX_B = rect(-86.2, -3.5, -76.8, 5.9);
const WING_POLY = [[-50.8, -26.6], [-24.34, -26.6], [-24.34, -9.5], [swFace(-9.5), -9.5]];
const LOBBY_POLY = [[swFace(-9.5), -9.5], [-24.34, -9.5], [-24.34, -0.9], [swFace(-0.9), -0.9]];
const GREEN_POLY = rect(-46.5, -0.9, -24.34, 6.25);
const STOEP_SW = [[swFace(-0.9), -0.9], [-46.5, -0.9], [-46.5, 6.25], [swFace(6.25), 6.25]];
const midNw = (u) => 18.0 + 0.16555 * (u + 24.35); // schuine noordwestgevel van de middentoren (BAG)
const MID_BOX = [[-24.34, -26.6], [-6.8, -26.6], [-6.8, midNw(-6.8)], [-24.35, 18.0]];
const MID_SIDE_POLY = [[-6.8, -26.6], [1.2, -26.6], [1.2, 6.5], [-0.71, 6.48], [-1.82, 21.73], [-6.8, midNw(-6.8)]];
const DECK_POLY = rect(1.2, -26.6, 26.4, 6.5);
// Noordoosttoren: de bakstenen doos steekt aan de zuidwestkant 1,8 m voorbij de BAG-plint uit (DSM).
const NE_BOX = [[26.4, -26.6], [43.4, -26.6], [43.4, 34.3], [39.4, 32.9], [33.5, 30.7], [33.5, 21.97], [28.8, 20.3], [26.4, 19.6]];
const blockSw = (v) => 56.4 + 0.28525 * (v + 26.6); // schuine zuidwestgevel van het hoge glazen blok (BAG en DSM)
const BLOCK32_POLY = [[43.4, -26.6], [56.4, -26.6], [blockSw(-3.8), -3.8], [43.4, -3.8]];
const STOEP_NE = [[43.4, -3.8], [blockSw(-3.8), -3.8], [blockSw(6.7), 6.7], [43.43, 6.7]];
const BLOCK39_POLY = [[56.4, -26.6], [73.1, -26.6], [84.2, 15.2], [69.45, 19.15]];
// Dakpunt boven de noordwestgevel van het hoge glazen blok: tot 10 m voorbij de gevel (DSM), met schoren die hier als kraag onder 45° gesloten zijn.
const CANOPY = [[70.5, 18.6], [82.8, 15.3], [81.0, 22.5], [76.0, 29.6], [73.8, 26.8], [70.5, 21.2]];

// ---------- Hulpfuncties ----------
const roofPlane = (poly, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, 120).trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Punt op de rand a→b: s langs de rand, depth naar binnen (buitennormaal rechts van de looprichting).
const frame = (a, b) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, P: (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h] };
};
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);

// ---------- Plint: terugliggend glas onder een witte kraag, V-kolommen ----------
// Begane grond en eerste verdieping (9,9 m, gelijk met het dak van de entreehal) liggen 2,0 m terug;
// de kraag loopt onder 45° van de plint naar de gevel. Paren witte kolommen (0,9 m) staan als een V in
// de gevellijn op een travee van 7,2 m (foto's).
const ZS = z(LOBBY);
const RECESS = 2.0;
function recess(a, b, s0, s1, z0 = 0) {
  const { P } = frame(a, b);
  return Manifold.hull([s0, s1].flatMap((s) => [P(s, -1, z0), P(s, RECESS, z0), P(s, RECESS, ZS - RECESS), P(s, -1, ZS + 1)]));
}
function vColumns(a, b, s0, s1) {
  const { P } = frame(a, b);
  const out = [];
  const n = Math.floor((s1 - s0 - 4.0) / 7.2) + 1;
  if (n < 1) return out;
  const start = (s0 + s1) / 2 - ((n - 1) * 7.2) / 2;
  for (let k = 0; k < n; k++) {
    const foot = start + k * 7.2;
    for (const top of [foot - 1.6, foot + 1.6]) {
      const sq = (s, h) => [P(s - 0.45, 0.25, h), P(s + 0.45, 0.25, h), P(s - 0.45, 1.15, h), P(s + 0.45, 1.15, h)];
      out.push(Manifold.hull([...sq(foot, BASE), ...sq(top, ZS)]));
    }
  }
  return out;
}

// ---------- Massa's ----------
// Zuidwesttoren met de glazen kroon. De kroon is het convexe omhulsel van een achthoek op het dak (met
// afgeschuinde einden, ortho) en het dwarsprofiel bovenin; de zijden hellen 1 m naar buiten, aan de
// noordwestkant 2,5 m (de glazen neus boven de weg).
const crownPoints = (inset) => {
  const pts = [];
  const base = [[-22.5, -67.5, -63.5], [-18.5, -70.25, -56.0], [9.0, -70.25, -56.0], [13.0, -67.5, -60.5]];
  for (const [v, u0, u1] of base) pts.push([u0 + inset, v, z(SW_ROOF) - 0.1], [u1 - inset, v, z(SW_ROOF) - 0.1]);
  for (const [v, nap] of CROWN_PROFILE) {
    const end = v < -20 || v > 14;
    const [u0, u1] = end ? (v < 0 ? [-68.25, -62.75] : [-68.0, -60.5]) : [-71.25, -56.0];
    const vv = v + (v < -20 ? inset : v > 14 ? -inset : 0);
    pts.push([u0 + inset, vv, z(nap) - inset], [u1 - inset, vv, z(nap) - inset]);
  }
  return pts;
};
const crownOuter = Manifold.hull(crownPoints(0));
const crownInner = Manifold.hull(crownPoints(0.4));
// Stalen vinnen van 0,9 m op 3,0 m: tussen de vinnen ligt het glas 0,4 m terug, over het dak en langs
// de zijden.
const finCuts = [];
for (let v = -20.6; v + 2.1 < 12.4; v += 3.0) {
  finCuts.push(crownOuter.subtract(crownInner).intersect(prism(rect(-80, v, -50, v + 2.1), z(SW_ROOF) + 2.0, 100)));
}
const crown = crownOuter.subtract(union(finCuts));
const ridge = prism(rect(-70.5, -9.0, -57.5, -7.2), z(68.5), z(RIDGE));

const swTowerRaw = union([prism(SW_BOX, BASE, z(SW_ROOF)), prism(SW_STRIP_POLY, z(SW_ROOF) - 0.1, z(SW_STRIP))]);
const annex = union([prism(ANNEX_A, BASE, z(ANNEX_HI)), prism(ANNEX_B, BASE, z(ANNEX_LO))]);

const midTowerRaw = union([
  prism(MID_BOX, BASE, z(MID_ROOF)),
  prism(MID_SIDE_POLY, BASE, z(MID_SIDE)),
  prism(rect(-6.85, -22.9, -1.8, 11.9), z(MID_SIDE) - 0.1, z(MID_SIDE_HI)),
  prism(rect(-21.5, -17.0, -6.8, -5.2), z(MID_ROOF) - 0.1, z(MID_PLANT)),
  prism(rect(-14.1, -19.6, -11.7, 3.0), z(MID_ROOF) - 0.1, z(MID_RAIL)),
]);

// Noordoosttoren: dakvlak oplopend naar de weg; installatieruimte met een lessenaarsdak van 14° dat naar
// het zuidoosten oploopt en een steile achterwand (3D BAG 69°).
const neRoof = (v) => z(NE_ROOF(v));
const nePlant = Manifold.hull([29.5, 43.4].flatMap((u) => [
  [u, -22.0, neRoof(-22.0) - 0.2], [u, -19.6, z(59.3)], [u, -3.2, z(55.3)], [u, -3.2, neRoof(-3.2) - 0.2],
]));
const neTowerRaw = union([roofPlane(NE_BOX, 0, 0.05, z(53.3)), nePlant]);

const wingRaw = union([
  prism(WING_POLY, BASE, z(WING)),
  prism(LOBBY_POLY, BASE, z(LOBBY)),
  prism(GREEN_POLY, BASE, z(GREEN)),
  prism(STOEP_SW, BASE, z(STOEP)),
]);
const deck = prism(DECK_POLY, BASE, z(DECK));

// Glazen blok noordoost: laag deel, hoog parallellogram, bordes met twee paviljoens, installaties en de
// dakpunt (plaat van 1,5 m; de schoren eronder zijn als kraag onder 45° naar de gevel gesloten).
const pavilion = (u0, u1) => roofPlane(rect(u0, -3.8, u1, 5.3), 0, (PAV_HIGH - PAV_LOW) / 9.1, z(PAV_LOW) + ((PAV_HIGH - PAV_LOW) / 9.1) * 3.8);
const outward = (p) => { // afstand van een punt tot de noordwestgevel, naar buiten
  const L = Math.hypot(14.75, -3.95), n = [3.95 / L, 14.75 / L];
  return (p[0] - 69.45) * n[0] + (p[1] - 19.15) * n[1];
};
// Plaat plus kraag: elk hoekpunt van de plaat zakt onder 45° terug naar de gevel (0,3 m erin).
const canopy = (() => {
  const L = Math.hypot(14.75, -3.95), n = [3.95 / L, 14.75 / L], top = z(BLOCK39), bot = top - 1.5;
  return Manifold.hull(CANOPY.flatMap((p) => {
    const d = Math.max(0, outward(p));
    return [[...p, top], [...p, bot], [p[0] - n[0] * (d + 0.3), p[1] - n[1] * (d + 0.3), bot - d - 0.3]];
  }));
})();
const neWingRaw = union([
  prism(BLOCK32_POLY, BASE, z(BLOCK32)),
  prism(rect(47.5, -7.5, 55.0, -5.4), z(BLOCK32) - 0.1, z(STRIP33)),
  prism(STOEP_NE, BASE, z(STOEP)),
  pavilion(46.2, 51.4),
  pavilion(54.6, 59.0),
  prism(BLOCK39_POLY, BASE, z(BLOCK39)),
  prism(rect(61.0, -19.6, 67.0, -4.6), z(BLOCK39) - 0.1, z(PLANT43)),
  prism(rect(67.0, -20.1, 72.0, -15.6), z(BLOCK39) - 0.1, z(PLANT43)),
  prism(rect(67.0, -15.6, 72.0, -6.0), z(BLOCK39) - 0.1, z(FANS42)),
  canopy,
]);

// ---------- Plint-uitsparingen en kolommen (alleen waar de gevel buitengevel is) ----------
const swE = edges(SW_BOX), midE = edges(MID_BOX), neE = edges(NE_BOX);
// [rand, s0, s1, z0, kolommen]; s langs de rand vanaf het beginpunt.
const segs = (e, list) => list.map(([i, s0, s1, z0 = 0, cols = true]) => ({ a: e[i][0], b: e[i][1], s0, s1, z0, cols }));
const at = (e, i, pt) => { // s van punt pt langs rand i
  const [a, b] = e[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return ((pt[0] - a[0]) * (b[0] - a[0]) + (pt[1] - a[1]) * (b[1] - a[1])) / L;
};
const len = (e, i) => Math.hypot(e[i][1][0] - e[i][0][0], e[i][1][1] - e[i][0][1]);
const swSegs = segs(swE, [
  [5, 0, at(swE, 5, [-76.8, 5.9]), 0, true], // zuidwestgevel, noordelijk van de aanbouw
  [5, at(swE, 5, [-76.8, 5.9]), at(swE, 5, [-76.8, -3.5]), z(ANNEX_LO), false],
  [5, at(swE, 5, [-76.8, -3.5]), at(swE, 5, [-76.8, -10.3]), z(ANNEX_HI), false],
  [5, at(swE, 5, [-76.8, -10.3]), len(swE, 5), 0, true],
  [4, 0, len(swE, 4)], [3, 0, len(swE, 3)], [2, 0, len(swE, 2)],
  [1, at(swE, 1, [swFace(6.25), 6.25]), len(swE, 1), 0, true],
  [1, at(swE, 1, [swFace(-0.9), -0.9]), at(swE, 1, [swFace(6.25), 6.25]), z(STOEP), false],
]);
const midSegs = segs(midE, [
  [3, 0, at(midE, 3, [-24.34, 6.25]), 0, true],
  [3, at(midE, 3, [-24.34, 6.25]), at(midE, 3, [-24.34, -0.9]), z(GREEN), false],
  [2, 0, len(midE, 2)],
]);
const neSegs = segs(neE, [
  [7, 0, at(neE, 7, [26.4, 6.5]), 0, true],
  [7, at(neE, 7, [26.4, 6.5]), len(neE, 7), z(DECK), false],
  [6, 0, len(neE, 6)], [5, 0, len(neE, 5)], [4, 0, len(neE, 4)], [3, 0, len(neE, 3)], [2, 0, len(neE, 2)],
  [1, at(neE, 1, [43.4, 6.7]), len(neE, 1), 0, true],
  [1, at(neE, 1, [43.4, -3.8]), at(neE, 1, [43.4, 6.7]), z(STOEP), false],
]);
const plinth = (raw, list) => {
  const cut = raw.subtract(union(list.map(({ a, b, s0, s1, z0 }) => recess(a, b, s0, s1, z0))));
  return union([cut, ...list.filter((g) => g.cols).flatMap(({ a, b, s0, s1 }) => vColumns(a, b, s0, s1))]);
};
const swTower = union([plinth(swTowerRaw, swSegs), crown, ridge, annex]);
const midTower = plinth(midTowerRaw, midSegs);
const neTower = plinth(neTowerRaw, neSegs);

// Alle massa's samen, voor de vraag of een gevel buitengevel is.
const ALL = union([swTower, wingRaw, midTower, deck, neTower, neWingRaw]);
const exposed = (P, s, h) => {
  const from = P(s, -3, h), hit = ALL.rayCast(from, P(s, 1, h))[0];
  const d = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return d > 2.95 && d < 3.05;
};

// ---------- Gevelreliëf ----------
// Baksteen: twaalf lagen van 3,57 m boven de plint (dak +54,85 = 9,9 + 12 × 3,57), in de hogere strook
// nog twee. Per laag liggende vensters van 2,2 m op een travee van 3,0 m als blinde nissen van 0,35 m
// met een plafond onder 45°.
const STOREY = 3.57;
const TOWER_FLOORS = Array.from({ length: 14 }, (_, k) => [ZS + STOREY * k, STOREY]);
const DEPTH = 0.35;
function windows(a, b, floors, cuts, { pitch = 3.0, width = 2.2, sill = 1.2, head = 2.4 } = {}) {
  const { L, P } = frame(a, b);
  if (L < 3) return;
  const bays = Math.max(1, Math.floor((L - 0.9) / pitch)), w = (L - bays * pitch) / 2;
  for (const [zf] of floors) {
    const lo = zf + sill, hi = zf + head;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * pitch + (pitch - width) / 2, s1 = s0 + width;
      if (![s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => exposed(P, s, h)))) continue;
      cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
// Glas: per laag een glasband achter een doorlopende borstwering van 1,0 m, 0,4 m diep met een plafond
// onder 45°, getest per halve meter.
const BAND = 0.4;
function bands(a, b, floors, cuts, slab = 1.0) {
  const { L, P } = frame(a, b);
  for (const [zf, fh] of floors) {
    const lo = zf + slab, hi = zf + fh - BAND;
    if (hi - lo < 0.9) continue;
    let start = null;
    const flush = (s1) => {
      if (start !== null && s1 - start >= 0.9) cuts.push(Manifold.hull([P(start, -0.2, lo), P(s1, -0.2, lo), P(start, BAND, lo), P(s1, BAND, lo), P(start, -0.2, hi + BAND + 0.2), P(s1, -0.2, hi + BAND + 0.2), P(start, BAND, hi), P(s1, BAND, hi)]));
      start = null;
    };
    for (let s = 0.95; s <= L - 0.95 + 1e-6; s += 0.5) {
      const ok = exposed(P, s, lo + 0.05) && exposed(P, s, hi + BAND - 0.05);
      if (ok && start === null) start = s;
      if (!ok) flush(s - 0.5);
    }
    flush(L - 0.95);
  }
}
const glassFloors = (roofLocal, first = 5.0) => {
  const out = [[0, first]];
  const n = Math.round((roofLocal - 0.4 - first) / 3.55);
  const h = (roofLocal - 0.4 - first) / n;
  for (let k = 0; k < n; k++) out.push([first + h * k, h]);
  return out;
};
const PLINTH_GLASS = [[0, 5.0], [5.0, ZS - 5.0]];

const below = (nap) => TOWER_FLOORS.filter(([zf, fh]) => zf + fh <= z(nap) + 0.01);
const swCuts = [], midCuts = [], neCuts = [], wingCuts = [], neWingCuts = [];
for (const [a, b] of swE) windows(a, b, below(SW_ROOF), swCuts);
for (const [a, b] of edges(SW_STRIP_POLY)) windows(a, b, TOWER_FLOORS.slice(below(SW_ROOF).length), swCuts);
for (const [a, b] of midE) windows(a, b, below(MID_ROOF), midCuts);
for (const [a, b] of neE) windows(a, b, TOWER_FLOORS, neCuts);
// Glazen plint waar hij niet terugligt (achtergevels).
for (const [a, b] of swE) bands(a, b, PLINTH_GLASS, swCuts);
for (const [a, b] of midE) bands(a, b, PLINTH_GLASS, midCuts);
for (const [a, b] of neE) bands(a, b, PLINTH_GLASS, neCuts);
// Glazen zijvleugel van de middentoren: lagen gelijk met de toren.
for (const [a, b] of edges(MID_SIDE_POLY)) bands(a, b, [...PLINTH_GLASS, ...TOWER_FLOORS], midCuts);
// Tussenvleugel (zes lagen boven de hal) en entreehal.
const WING_STOREY = (z(WING) - 0.4 - ZS) / 6;
for (const [a, b] of edges(WING_POLY)) bands(a, b, [...PLINTH_GLASS, ...Array.from({ length: 6 }, (_, k) => [ZS + WING_STOREY * k, WING_STOREY])], wingCuts);
for (const [a, b] of edges(LOBBY_POLY)) bands(a, b, PLINTH_GLASS, wingCuts);
// Glazen blok noordoost.
for (const [a, b] of edges(BLOCK32_POLY)) bands(a, b, glassFloors(z(BLOCK32)), neWingCuts);
for (const [a, b] of edges(BLOCK39_POLY)) bands(a, b, glassFloors(z(BLOCK39)), neWingCuts);

const finish = (name, raw, cuts) => {
  const m = cuts.length ? raw.subtract(union(cuts)) : raw;
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "nissen/banden", cuts.length);
  return [`building:${slug}-${name}`, m];
};
const nodes = [
  finish("zuidwesttoren", swTower, swCuts),
  finish("tussenvleugel", wingRaw, wingCuts),
  finish("middentoren", midTower, midCuts),
  finish("tuindek", deck, []),
  finish("noordoosttoren", neTower, neCuts),
  finish("noordoostvleugel", neWingRaw, neWingCuts),
];

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Graadt van Roggenweg 500 (voormalig AXA-kantoor)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 45.55, // NAP-maaiveld + 43,45 (Utrecht, ellipsoïdisch)
    groundOffsetMetres: -0.2,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000001816"],
    description:
      "Kantoorcomplex Graadt van Roggenweg 400–500 achter de Jaarbeurs (2001, De Jong Gortemaker Algra), gebouwd als hoofdkantoor van AXA en nu onder meer het College ter Beoordeling van Geneesmiddelen: op de BAG-contour drie bakstenen torens van twaalf lagen (zuidwest NAP +54,85 m met een strook tot +61,75 m en een glazen kroon met vinnen en een gebogen dak tot +70,4 m en een nokbalk tot +72,7 m; midden +54,8 m met een glazen zijvleugel; noordoost met een dak dat oploopt van +52,0 naar +55,0 m) boven een plint van twee lagen die 2,0 m terugligt achter witte V-kolommen, een glazen tussenvleugel tot +33,85 m met de entreehal tot +12,0 m, een parkeerdek met daktuin op +7,2 m en een glazen blok van tien lagen tot +39,1 m met een dakpunt boven de weg die op een kraag onder 45° rust. Hoogtes uit het AHN-DSM en de dakvlakken van de 3D BAG. Oorsprong midden op het complex, X-as langs de zuidoostgevel (49,7° op RD-oost). Verdiepingshoogtes, vensterraster, de diepte van de plint, de kolommen en de vinnen van de kroon zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      towerRoofsNapM: { southWest: SW_ROOF, southWestStrip: SW_STRIP, middle: MID_ROOF, northEast: [NE_ROOF(-26.6), NE_ROOF(34.3)] },
      crownNapM: { eaves: [63.6, 64.6], top: 70.4, ridge: RIDGE },
      wingNapM: WING,
      lobbyNapM: LOBBY,
      deckNapM: DECK,
      glassBlockNapM: [BLOCK32, BLOCK39],
      plinthM: { height: ZS, recess: RECESS, columnPitch: 7.2 },
      floors: { plinth: 2, brick: 12 },
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0344100000001816 (bouwjaar 2001, Graadt van Roggenweg 400 en 500), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG (LoD2.2, AHN4 2020), NL.IMBAG.Pand.0344100000001816",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Utrecht_(stad)",
      "https://commons.wikimedia.org/wiki/File:College_ter_Beoordeling_van_Geneesmiddelen_building_Utrecht_2019.jpg",
      "https://commons.wikimedia.org/wiki/File:AXA_in_Utrecht.JPG",
      "https://commons.wikimedia.org/wiki/File:AXA_Utrecht.JPG",
      "https://commons.wikimedia.org/wiki/File:Sneltramhalte_Graadt_van_Roggenweg.jpg",
    ],
  },
});

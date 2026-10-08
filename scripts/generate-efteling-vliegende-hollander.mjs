// Genereert een vereenvoudigd, gesloten 3D-model van De Vliegende Hollander in
// de Efteling (Kaatsheuvel, Ruigrijk): de waterachtbaan met dark water ride uit
// 2007 (ontwerp Karel Willemen, baan van Kumbak, door de Efteling gebouwd). Het
// model bevat het 17e-eeuwse havenstadje aan het plein: de liftoren met de vier
// hoektorentjes, de mezekouwen en de kantelen, de schuine houten lifthuisbak
// achter de toren, de rij havenhuisjes met klok-, trap- en spitse houten gevels
// achter de stadsmuur met pilasters en leeuwen, het huis van kapitein Willem
// van der Decken met trapgevels en houten dakkapel, de showhal (BAG-pand) met
// kantelen, en de kademuur met bogen langs de vijver. Buiten: de val uit de
// toren naar het 'mistige gat' (het wrak aan de oever), de baan door het
// duinlandschap met de luchtheuvel, de overhelde bocht in het noorden, het
// duinhuisje op palen (tussenrem), de tweede val, de linkerbocht over het
// water, de laatste bult en de plons in de vijver. Alle maten in meters op ware
// grootte.
//
//   node scripts/generate-efteling-vliegende-hollander.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-vliegende-hollander.mjs --scale 500
//
// Assenstelsel: oorsprong op RD (131782,45, 406568,49), het hart van de
// liftoren, op het maaiveld bij de toren (NAP +10,4 m; het plein ligt op
// +10,6 m), Z omhoog, +X langs de gevel aan het plein (RD-richting -14,4°, dus
// ongeveer naar het oosten) en +Y de hal in (ongeveer naar het noorden). De
// voorzijde met de toren, het plein en de vijver ligt aan -Y. De baanpunten
// staan in het script in RD en NAP (gemeten) en worden omgerekend.
//
// Onderkant op NAP +7,3 m (Z = -3,1), een halve meter onder het water van de
// vijver (NAP ca. +7,9 m), omdat de kademuur, de pijlers van de baan en de
// plons in het water staan. De vijver zelf is niet gemodelleerd (PDOK-water).
//
// Baan: één dichte band (ribbon) van 1,5 m breed en 0,9 m dik onder de
// bovenkant van de baan; in de bochten helt hij (tot 30° in de val uit de
// toren, tot 75° in de overhelde bocht in het noorden). Lage delen (onderkant
// onder Z = 1) staan op een doorlopende voet van 1,0 m tot de onderkant, hoger
// staan kolommen (achtkant, 1,0 m) om de ca. 6 m. Het ondergrondse deel (van
// het gat bij het wrak tot de uitgang in het duin) is niet gemodelleerd; de
// band duikt daar het maaiveld in. Printbaar op 1:1000: de export zet onder de
// band tussen de kolommen, onder het duinhuisje en onder de mezekouwen een wig.
//
// Bronnen: BAG-pand 0809100000017610 (showhal met toren, bouwjaar 2006) en de
// BGT (oever van de vijver: ligging van de kademuur); AHN DSM/DTM 0,5 m (PDOK
// WCS): dakhoogtes (hal +17,3 m, noordoostdeel +15,8 m, havenhuisjes tot +20,5
// m, huis Van der Decken tot +21,5 m, toren +29,3 m, torentjes tot +33 m,
// lifthuisbak onder 42-44°, duinhuisje +22,6 m) en de baanhoogtes als maxima
// langs het pad (val bij de toren +25,7 m op 1,5 m, bult over het water +13,2
// m, plons op +8,2 m, luchtheuvel ca. +17,5 m, rem op ca. +18 m); PDOK
// luchtfoto 8 cm (tracé; geen ware orthofoto: hoge delen staan tot ca. 0,35 m
// per meter hoogte naar het noorden verschoven, daarom komt de ligging van de
// toren en het duinhuisje uit het AHN); nl/en.wikipedia (hoogte 22,5 m, 420 m
// baan, 70 km/u, volgorde van de rit) en Commons-foto's (toren, gevels,
// kademuur, wrak, duinhuisje, steunen).
//
// Geschat: het tracé onder de bomen (de ligging van de baan in het bos is uit
// de luchtfoto en losse AHN-punten afgeleid, ca. 1-2 m nauwkeurig), de helling
// van de banken, de steunafstanden, de hoogte van de baan in de overhelde
// bocht (+14 tot +16 m), de vorm van het wrak, de indeling van de gevelrij in
// vijf huisjes van 4,2 m en hun geveltypes (naar de foto's), de vensters
// (blinde nissen), de leeuwen (blokken) en de kantelen op de hal.
import {
  Manifold,
  box,
  circle,
  downFaces,
  hull,
  prism,
  rect,
  ribbon,
  ring3,
  spire,
  strip,
  union,
  writeLandmark,
} from "./efteling-kit.mjs";

// ---------- assenstelsel ----------
const ORIGIN = [131782.45, 406568.49];
const ANGLE = -14.4; // graden: RD-richting van de lokale X-as
const COS = Math.cos((ANGLE * Math.PI) / 180);
const SIN = Math.sin((ANGLE * Math.PI) / 180);
const X_AXIS = [+COS.toFixed(5), +SIN.toFixed(5)];
const GROUND_NAP = 10.4;
const Z = (nap) => +(nap - GROUND_NAP).toFixed(3);
const BASE = Z(7.3);
// RD → lokaal (u langs de gevel, v de hal in).
const L = ([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [dx * COS + dy * SIN, -dx * SIN + dy * COS];
};
const clipBase = (m) => Manifold.intersection(m, box(-300, -300, BASE, 300, 300, 200));

// ---------- maten ----------
// BAG-pand 0809100000017610 (RD, rechtsom zoals in de BAG).
const BAG_HALL = [
  [131790.62, 406630.29], [131783.13, 406599.92], [131784.86, 406599.48], [131778.97, 406575.59],
  [131778.6, 406575.74], [131778.43, 406574.73], [131779.29, 406574.5], [131779.38, 406574.83],
  [131780.92, 406574.42], [131780.85, 406574.13], [131781.17, 406574.05], [131780.78, 406572.48],
  [131779.74, 406572.74], [131778.09, 406566.0], [131785.1, 406564.31], [131787.43, 406573.66],
  [131808.03, 406568.18], [131810.83, 406580.51], [131815.87, 406578.93], [131817.51, 406584.59],
  [131814.24, 406585.56], [131815.14, 406589.45], [131810.6, 406590.82], [131818.95, 406623.13],
].map(L);
// Hal (AHN): dak +17,3 m, het noordoostdeel (X > 6, Y > 37,5) +15,8 m; borstwering
// met kantelen langs de buitenranden, installaties op het dak tot +18,4 m.
const HALL = { roof: Z(17.3), roofLow: Z(15.8), lowFrom: [6, 37.5], parapet: 0.45, merlon: 0.9 };
// Gevelrij aan het plein: stadsmuur (looppad +14 m) van Y 6 tot 9, daarachter
// vijf havenhuisjes van X 3,6 tot 24,7 met de gevels op Y = 9, goot +17 m.
const ROW = { u0: 3.6, u1: 24.7, wallFront: 6.0, wallTop: Z(14.0), front: 9.0, back: 13.6, eave: Z(17.0) };
const HOUSE_TYPES = ["klok", "spits", "trap", "spits", "trap"];
// Huis Van der Decken (AHN tot +21,5 m): X 19,8-29,9, Y 18,4-24,4 met de
// trapgevels op de kopse kanten en een houten dakkapel aan de voorkant; een
// achterbouw tot Y 28,5.
const VDD = { u0: 19.8, u1: 29.9, v0: 18.4, v1: 24.4, rear: 28.5, rearU1: 26.5, eave: Z(17.8), ridge: Z(21.5) };
// Toren (AHN: dak +29,3 m, torentjes tot +33 m; BAG 7,2 bij 7,0 m).
const TOWER = { hu: 3.6, hv: 3.5, corbel: Z(24.8), gallery: Z(25.4), parapet: Z(28.3), top: Z(29.3), turretR: 1.0, turretTop: Z(30.1), spireTop: Z(32.8) };
// Lifthuisbak: van de top van de toren (+29,8 m) onder 42° naar het dak van de hal.
const LIFT = { u0: -3.4, u1: 2.6, v0: 2.4, v1: 16.0, top: Z(29.8), foot: Z(17.6) };
// Kademuur langs de BGT-oever (buitenkant), 1,2 m dik, borstwering +12,1 m.
const QUAY = { pts: [[-3.6, -3.2], [-2.4, -11.0], [-0.9, -12.4], [1.9, -13.9], [20.0, -13.0], [20.2, -9.0], [26.5, -8.9], [32.2, -7.8], [38.0, -6.2]], thick: 1.2, top: Z(12.1), water: Z(7.9) };
// Baan: band 1,5 bij 0,9 m, kolommen 1,0 m om de ca. 6 m.
const TRACK = { w: 1.5, h: 0.9, col: 0.5, step: 6 };
// Val uit de toren (lokaal waar hij de toren uitkomt, daarna RD; NAP, helling in
// graden, positief = naar links).
const DROP = [
  { l: [0.7, 0.5], nap: 26.2, bank: 0 },
  { l: [0.7, -3.0], nap: 26.1, bank: 0 },
  { l: [0.75, -4.7], nap: 25.3, bank: 0 },
  { l: [0.4, -6.8], nap: 22.4, bank: -10 },
  { rd: [131779.3, 406558.5], nap: 19.3, bank: -25 },
  { rd: [131777.5, 406556.0], nap: 17.8, bank: -30 },
  { rd: [131775.5, 406553.8], nap: 16.2, bank: -30 },
  { rd: [131773.0, 406551.8], nap: 14.6, bank: -30 },
  { rd: [131770.5, 406550.2], nap: 13.2, bank: -25 },
  { rd: [131767.8, 406549.3], nap: 12.0, bank: -15 },
  { rd: [131764.5, 406549.6], nap: 10.6, bank: 0 },
  { rd: [131761.0, 406550.4], nap: 8.3, bank: 0 },
  { rd: [131758.0, 406551.4], nap: 6.4, bank: 0 },
];
// Van de uitgang in het duin tot de plons.
const MAIN = [
  // uitgang van de tunnel, luchtheuvel en dal
  { rd: [131755.6, 406572.0], nap: 7.0, bank: 0 },
  { rd: [131757.0, 406577.0], nap: 9.6, bank: 0 },
  { rd: [131758.8, 406583.0], nap: 12.4, bank: 0 },
  { rd: [131760.9, 406589.5], nap: 16.0, bank: 0 },
  { rd: [131762.6, 406594.8], nap: 17.5, bank: 0 },
  { rd: [131764.5, 406600.5], nap: 15.0, bank: 0 },
  { rd: [131766.6, 406606.5], nap: 11.8, bank: 0 },
  { rd: [131769.0, 406613.0], nap: 10.6, bank: 0 },
  { rd: [131771.5, 406619.0], nap: 10.6, bank: 0 },
  { rd: [131773.8, 406624.5], nap: 12.0, bank: 15 },
  // overhelde linkerbocht in het noorden
  { rd: [131775.6, 406629.0], nap: 13.6, bank: 40 },
  { rd: [131776.6, 406633.2], nap: 14.8, bank: 65 },
  { rd: [131775.0, 406637.2], nap: 15.6, bank: 75 },
  { rd: [131771.2, 406639.6], nap: 16.0, bank: 75 },
  { rd: [131766.4, 406640.0], nap: 16.0, bank: 75 },
  { rd: [131762.4, 406638.8], nap: 15.6, bank: 70 },
  { rd: [131759.6, 406635.8], nap: 14.8, bank: 45 },
  // terug naar het zuiden, omhoog naar het duinhuisje (tussenrem)
  { rd: [131757.6, 406631.5], nap: 13.6, bank: 15 },
  { rd: [131756.0, 406624.0], nap: 12.0, bank: 0 },
  { rd: [131754.6, 406617.0], nap: 10.8, bank: 0 },
  { rd: [131753.1, 406609.5], nap: 13.6, bank: 0 },
  { rd: [131751.9, 406603.5], nap: 16.6, bank: 0 },
  { rd: [131750.8, 406598.5], nap: 18.1, bank: 0 },
  { rd: [131749.5, 406592.5], nap: 18.2, bank: 0 },
  { rd: [131748.2, 406586.5], nap: 18.2, bank: 0 },
  // tweede val (actiefoto) en de linkerbocht over het water
  { rd: [131746.9, 406581.5], nap: 17.4, bank: 0 },
  { rd: [131745.7, 406576.5], nap: 15.0, bank: 0 },
  { rd: [131744.4, 406571.0], nap: 11.6, bank: 0 },
  { rd: [131742.7, 406565.0], nap: 10.0, bank: 0 },
  { rd: [131740.9, 406559.5], nap: 9.4, bank: 0 },
  { rd: [131739.4, 406554.0], nap: 9.3, bank: 10 },
  { rd: [131738.7, 406548.2], nap: 9.7, bank: 30 },
  { rd: [131739.6, 406542.8], nap: 10.3, bank: 40 },
  { rd: [131742.2, 406538.7], nap: 10.6, bank: 40 },
  { rd: [131746.4, 406535.8], nap: 10.8, bank: 25 },
  { rd: [131751.5, 406534.4], nap: 11.3, bank: 5 },
  // laatste bult en de plons
  { rd: [131757.5, 406533.5], nap: 12.4, bank: 0 },
  { rd: [131763.0, 406532.8], nap: 13.1, bank: 0 },
  { rd: [131768.0, 406532.2], nap: 13.2, bank: 0 },
  { rd: [131773.0, 406531.5], nap: 12.0, bank: 0 },
  { rd: [131777.8, 406530.8], nap: 10.2, bank: 0 },
  { rd: [131782.0, 406530.2], nap: 8.7, bank: 0 },
  { rd: [131786.0, 406529.6], nap: 8.2, bank: 0 },
  { rd: [131791.0, 406528.9], nap: 8.1, bank: 0 },
];
// Duinhuisje (AHN: 6 bij 7 m, nok +22,6 m) rond de rem, langs de baan.
const DUNE_HOUSE = { a: [131749.5, 406592.5], b: [131748.2, 406586.5], width: 6.0, len: 7.6, floor: Z(17.0), eave: Z(20.6), ridge: Z(22.6) };
// Wrak met het 'mistige gat' aan de oever (luchtfoto: ca. 10 bij 4,5 m).
const WRECK = { u0: -21.2, u1: -11.0, v: -22.4, half: 2.4, top: Z(13.0) };
// Maaiveld: het pad ten westen van de toren (+10,4 m) en het plein (+10,6 m).
const GROUND_SAMPLES = [[-8, 0], [-8, -6], [8, -9], [16, -8]];

// ---------- hulpfuncties ----------
const add = (a, b) => a.map((c, i) => c + b[i]);
const sub = (a, b) => a.map((c, i) => c - b[i]);
const mul = (a, k) => a.map((c) => c * k);
const norm = (v) => {
  const l = Math.hypot(...v);
  return l < 1e-9 ? v : v.map((c) => c / l);
};
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
// Blinde nis in een gevel met constante Y (vlak op v, de nis gaat in richting dir = ±1
// de gevel in), breedte w, van z0 tot z1, met een spitse top (60°) als pointed.
const nicheV = (u, v, dir, w, z0, z1, depth = 0.35, pointed = false) => {
  const va = v - dir * 0.2;
  const vb = v + dir * depth;
  const pts = [];
  for (const vv of [va, vb]) {
    pts.push([u - w / 2, vv, z0], [u + w / 2, vv, z0], [u - w / 2, vv, z1], [u + w / 2, vv, z1]);
    if (pointed) pts.push([u, vv, z1 + (w / 2) * Math.tan(Math.PI / 3)]);
  }
  return hull(pts);
};
const nicheU = (u, v, dir, w, z0, z1, depth = 0.35, pointed = false) => {
  const ua = u - dir * 0.2;
  const ub = u + dir * depth;
  const pts = [];
  for (const uu of [ua, ub]) {
    pts.push([uu, v - w / 2, z0], [uu, v + w / 2, z0], [uu, v - w / 2, z1], [uu, v + w / 2, z1]);
    if (pointed) pts.push([uu, v, z1 + (w / 2) * Math.tan(Math.PI / 3)]);
  }
  return hull(pts);
};
// Borstwering met kantelen langs a→b aan de linkerkant (binnenkant van een
// linksom veelhoek): een doorlopende rand tot z0 + low en kantelen van 1 m
// breed om de 2 m tot z0 + low + high. zAt(u, v) geeft het dakvlak.
const battlement = (a, b, thick, zAt, low, high, pitch = 2) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const left = [-d[1], d[0]];
  const a2 = [a[0] + (left[0] * thick) / 2, a[1] + (left[1] * thick) / 2];
  const b2 = [b[0] + (left[0] * thick) / 2, b[1] + (left[1] * thick) / 2];
  const parts = [];
  const n = Math.max(1, Math.round(len / pitch));
  const step = len / n;
  for (let k = 0; k < n; k++) {
    const s0 = k * step;
    const mid = [a2[0] + d[0] * (s0 + step / 2), a2[1] + d[1] * (s0 + step / 2)];
    const z0 = zAt(mid[0], mid[1]);
    parts.push(prism(strip(a2, b2, thick, s0 - 0.01, s0 + step + 0.01), z0 - 0.3, z0 + low));
    parts.push(prism(strip(a2, b2, thick, s0 + step / 4, s0 + (3 * step) / 4), z0 + low - 0.02, z0 + low + high));
  }
  return union(parts);
};
// Catmull-Rom door de baanpunten, bemonsterd om de ca. 1 m; helling lineair.
const spline = (pts, step = 1.0) => {
  const out = [];
  for (let i = 0; i + 1 < pts.length; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const n = Math.max(2, Math.ceil(Math.hypot(...sub(p2.p, p1.p)) / step));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const t2 = t * t;
      const t3 = t2 * t;
      const p = [0, 1, 2].map(
        (c) =>
          0.5 *
          (2 * p1.p[c] + (-p0.p[c] + p2.p[c]) * t + (2 * p0.p[c] - 5 * p1.p[c] + 4 * p2.p[c] - p3.p[c]) * t2 + (-p0.p[c] + 3 * p1.p[c] - 3 * p2.p[c] + p3.p[c]) * t3),
      );
      out.push({ p, bank: p1.bank + (p2.bank - p1.bank) * t });
    }
  }
  out.push({ p: pts[pts.length - 1].p, bank: pts[pts.length - 1].bank });
  return out;
};
const toTrackPoints = (list) => list.map(({ l, rd, nap, bank }) => ({ p: [...(l ?? L(rd)), Z(nap)], bank }));
// Bovenkant (up) van de baan bij helling bank (graden, positief naar links).
const upFor = (t, bank) => {
  const left = norm([-t[1], t[0], 0]);
  const b = (bank * Math.PI) / 180;
  return add(mul([0, 0, 1], Math.cos(b)), mul(left, Math.sin(b)));
};
// Baan met voet en kolommen; geeft { band, supports } terug.
// Lage delen (onderkant onder Z = 1) krijgen een doorlopende voet, behalve waar
// noFoot geldt (boven het water: daar pijlers zoals in het echt).
function track(samples, { noColumn = () => false, noFoot = () => false } = {}) {
  const path = samples.map((s) => s.p);
  const segUp = samples.slice(0, -1).map((s, i) => {
    const t = norm(sub(samples[i + 1].p, s.p));
    return upFor(t, (s.bank + samples[i + 1].bank) / 2);
  });
  const band = ribbon(path, TRACK.w, TRACK.h, { up: (i) => segUp[i] });
  const supports = [];
  // Doorlopende voet onder lage delen (onderkant onder Z = 1).
  const bottomOf = (i) => {
    const t = norm(sub(path[Math.min(i + 1, path.length - 1)], path[Math.max(i - 1, 0)]));
    const up = upFor(t, samples[i].bank);
    const s = norm(cross(t, up));
    const u = cross(s, t);
    return { c: sub(path[i], mul(u, TRACK.h * 0.9)), t };
  };
  for (let i = 0; i + 1 < path.length; i++) {
    const a = bottomOf(i);
    const b = bottomOf(i + 1);
    if (Math.max(a.c[2], b.c[2]) > 1.0 || Math.min(a.c[2], b.c[2]) < BASE + 0.3) continue;
    if (noColumn(path[i]) || noColumn(path[i + 1]) || noFoot(path[i]) || noFoot(path[i + 1])) continue;
    const side = (q, t) => {
      const n = norm([-t[1], t[0], 0]);
      return [add(q, mul(n, 0.5)), add(q, mul(n, -0.5))];
    };
    const [a1, a2] = side(a.c, a.t);
    const [b1, b2] = side(b.c, b.t);
    supports.push(hull([a1, a2, b1, b2, [a1[0], a1[1], BASE], [a2[0], a2[1], BASE], [b1[0], b1[1], BASE], [b2[0], b2[1], BASE]]));
  }
  // Kolommen onder hogere delen, om de ca. TRACK.step m.
  let acc = TRACK.step / 2;
  for (let i = 1; i < path.length; i++) {
    acc += Math.hypot(...sub(path[i], path[i - 1]));
    if (acc < TRACK.step) continue;
    const { c } = bottomOf(i);
    if ((c[2] <= 1.0 && !noFoot(path[i])) || c[2] < BASE + 0.6 || noColumn(path[i])) continue;
    acc = 0;
    supports.push(prism(circle([c[0], c[1]], TRACK.col, 8, Math.PI / 8), BASE, c[2] + 0.35));
  }
  return { band, supports };
}

// ---------- havenstadje: hal, gevelrij, huis Van der Decken, kademuur ----------
const hallPoly = BAG_HALL;
const hallPrism = (z0, z1) => prism(hallPoly, z0, z1);
const roofAt = (u, v) => (u > HALL.lowFrom[0] && v > HALL.lowFrom[1] ? HALL.roofLow : HALL.roof);
// Hal achter de gevelrij en naast de toren.
const hallBody = union([
  Manifold.intersection(hallPrism(BASE, HALL.roofLow), box(-20, ROW.back - 0.2, BASE, 40, 80, 50)),
  Manifold.intersection(hallPrism(BASE, HALL.roof), box(-20, ROW.back - 0.2, BASE, HALL.lowFrom[0], 80, 50)),
  Manifold.intersection(hallPrism(BASE, HALL.roof), box(-20, ROW.back - 0.2, BASE, 40, HALL.lowFrom[1], 50)),
  // tussen toren en hal (achter de toren, onder de lifthuisbak)
  Manifold.intersection(hallPrism(BASE, ROW.wallTop), box(-20, TOWER.hv - 0.3, BASE, ROW.u0 + 0.05, ROW.back, 50)),
]);
// Kantelen langs de buitenranden van de hal achter de gevelrij (niet langs het
// huis Van der Decken).
const hallCcw = (() => {
  let area = 0;
  hallPoly.forEach(([x0, y0], i) => {
    const [x1, y1] = hallPoly[(i + 1) % hallPoly.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? hallPoly : [...hallPoly].reverse();
})();
const hallBattlements = [];
hallCcw.forEach((a, i) => {
  const b = hallCcw[(i + 1) % hallCcw.length];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  if (len < 3 || mid[1] < ROW.back + 1 || (mid[0] > VDD.u0 - 0.5 && mid[1] < VDD.rear + 0.5)) return;
  hallBattlements.push(Manifold.intersection(battlement(a, b, 0.9, roofAt, HALL.parapet, HALL.merlon), box(-30, ROW.back, BASE, 50, 80, 50)));
});
// Installaties op het dak (AHN tot +18,4 m).
const rooftop = union([box(8, 32, HALL.roof - 0.1, 14, 35, Z(18.4)), box(15.5, 33, HALL.roof - 0.1, 17.5, 36, Z(18.4))]);

// Stadsmuur met looppad, pilasters met leeuwen en de poort.
const pilasterUs = [1, 2, 3, 4].map((k) => ROW.u0 + ((ROW.u1 - ROW.u0) * k) / 5);
const cityWall = union([
  box(ROW.u0 - 0.05, ROW.wallFront, BASE, ROW.u1, ROW.front + 0.05, ROW.wallTop),
  ...pilasterUs.map((u) => box(u - 0.5, ROW.wallFront - 0.45, BASE, u + 0.5, ROW.wallFront + 0.05, ROW.wallTop + 0.3)),
  // leeuw met schild: romp en kop op de pilaster
  ...pilasterUs.map((u) => box(u - 0.4, ROW.wallFront - 0.4, ROW.wallTop - 0.05, u + 0.4, ROW.wallFront + 0.5, ROW.wallTop + 0.9)),
  ...pilasterUs.map((u) => box(u - 0.3, ROW.wallFront - 0.35, ROW.wallTop + 0.85, u + 0.3, ROW.wallFront + 0.25, ROW.wallTop + 1.45)),
]).subtract(
  union([
    // poort (roestige dubbele deur) en twee kleine deuren
    nicheV(10.0, ROW.wallFront, 1, 2.4, Z(10.6), Z(13.4), 0.4),
    nicheV(17.4, ROW.wallFront, 1, 1.2, Z(10.6), Z(12.6), 0.35, true),
    nicheV(22.6, ROW.wallFront, 1, 1.2, Z(10.6), Z(12.6), 0.35, true),
  ]),
);
// Havenhuisjes: romp tot de goot, zadeldak met de nok de hal in, en de gevel
// aan de voorkant (klokgevel, spitse houten gevel of trapgevel).
const houses = [];
const houseNiches = [];
const houseW = (ROW.u1 - ROW.u0) / HOUSE_TYPES.length;
HOUSE_TYPES.forEach((type, k) => {
  const u0 = ROW.u0 + k * houseW;
  const u1 = u0 + houseW;
  const uc = (u0 + u1) / 2;
  const f = ROW.front;
  houses.push(box(u0, f, BASE, u1, ROW.back, ROW.eave));
  if (type === "spits") {
    // Steile spitse houten gevel die 0,4 m voor de gevel uitsteekt, met een
    // kraag van 45° eronder; het dak erachter even steil.
    const apex = Z(21.4);
    houses.push(
      hull([...ring3(rect(u0, f, u1, ROW.back), ROW.eave - 0.01), [uc, f, apex], [uc, ROW.back, apex]]),
      hull([[u0 + 0.1, f - 0.4, ROW.eave], [u1 - 0.1, f - 0.4, ROW.eave], [u0 + 0.1, f + 0.6, ROW.eave], [u1 - 0.1, f + 0.6, ROW.eave], [uc, f - 0.4, apex + 0.2], [uc, f + 0.6, apex + 0.2], [u0 + 0.1, f, ROW.eave - 0.4], [u1 - 0.1, f, ROW.eave - 0.4]]),
    );
    houseNiches.push(nicheV(uc, f - 0.4, 1, 0.9, Z(17.9), Z(19.0), 0.35, true));
  } else if (type === "trap") {
    // Trapgevel: treden van 0,9 m, de gevel 0,3 m boven het dakvlak.
    const ridge = Z(20.2);
    houses.push(hull([...ring3(rect(u0, f, u1, ROW.back), ROW.eave - 0.01), [uc, f, ridge], [uc, ROW.back, ridge]]));
    const steps = 3;
    const run = houseW / 2 / (steps + 0.5);
    for (let s = 0; s <= steps; s++) {
      const half = houseW / 2 - s * run;
      const top = ROW.eave + 0.3 + (s + 1) * ((ridge - ROW.eave) / (steps + 0.5));
      houses.push(box(uc - half, f - 0.05, ROW.eave - 0.1, uc + half, f + 0.5, top));
    }
    houseNiches.push(nicheV(uc, f, 1, 0.8, Z(17.6), Z(18.6), 0.35));
  } else {
    // Klokgevel: brede voet, smalle hals met schouders van 45° en een spitse kap.
    const ridge = Z(20.0);
    houses.push(hull([...ring3(rect(u0, f, u1, ROW.back), ROW.eave - 0.01), [uc, f, ridge], [uc, ROW.back, ridge]]));
    const neck = 1.3;
    houses.push(
      hull([
        [u0 + 0.1, f - 0.05, ROW.eave - 0.1], [u1 - 0.1, f - 0.05, ROW.eave - 0.1], [u0 + 0.1, f + 0.5, ROW.eave - 0.1], [u1 - 0.1, f + 0.5, ROW.eave - 0.1],
        [u0 + 0.1, f - 0.05, ROW.eave + 0.5], [u1 - 0.1, f - 0.05, ROW.eave + 0.5], [u0 + 0.1, f + 0.5, ROW.eave + 0.5], [u1 - 0.1, f + 0.5, ROW.eave + 0.5],
        [uc - neck, f - 0.05, ROW.eave + 0.5 + (houseW / 2 - 0.1 - neck)], [uc + neck, f - 0.05, ROW.eave + 0.5 + (houseW / 2 - 0.1 - neck)],
        [uc - neck, f + 0.5, ROW.eave + 0.5 + (houseW / 2 - 0.1 - neck)], [uc + neck, f + 0.5, ROW.eave + 0.5 + (houseW / 2 - 0.1 - neck)],
      ]),
      hull([
        ...ring3(rect(uc - neck, f - 0.05, uc + neck, f + 0.5), ROW.eave + 0.4),
        ...ring3(rect(uc - neck, f - 0.05, uc + neck, f + 0.5), ridge + 0.1),
        [uc, f - 0.05, ridge + 0.9], [uc, f + 0.5, ridge + 0.9],
      ]),
    );
    houseNiches.push(nicheV(uc, f - 0.05, 1, 0.8, Z(17.9), Z(19.0), 0.35, true));
  }
  // twee vensters per huis boven het looppad
  houseNiches.push(nicheV(uc - 1.0, f, 1, 0.8, Z(14.6), Z(16.0)), nicheV(uc + 1.0, f, 1, 0.8, Z(14.6), Z(16.0)));
});
const houseRow = union(houses).subtract(union(houseNiches));

// Huis Van der Decken: trapgevels op de kopse kanten, houten dakkapel voor.
const vddMid = (VDD.v0 + VDD.v1) / 2;
const vddHalf = (VDD.v1 - VDD.v0) / 2;
const vddParts = [
  box(VDD.u0, VDD.v0, BASE, VDD.u1, VDD.v1, VDD.eave),
  hull([...ring3(rect(VDD.u0, VDD.v0, VDD.u1, VDD.v1), VDD.eave - 0.01), [VDD.u0, vddMid, VDD.ridge], [VDD.u1, vddMid, VDD.ridge]]),
  // achterbouw
  box(VDD.u0, VDD.v1 - 0.1, BASE, VDD.rearU1, VDD.rear, VDD.eave - 0.4),
  hull([...ring3(rect(VDD.u0, VDD.v1 - 0.1, VDD.rearU1, VDD.rear), VDD.eave - 0.41), [VDD.u0, (VDD.v1 + VDD.rear) / 2, Z(20.6)], [VDD.rearU1, (VDD.v1 + VDD.rear) / 2, Z(20.6)]]),
];
for (const [ue, dir] of [[VDD.u0, -1], [VDD.u1, 1]]) {
  // drie treden van 1,25 m hoog en 1 m breed per kant, plus een pinakel
  for (let s = 0; s < 3; s++) {
    const half = vddHalf - s * 1.0;
    const top = VDD.eave + 0.35 + (s + 1) * 1.25;
    const ua = dir < 0 ? ue - 0.3 : ue - 0.4;
    vddParts.push(box(ua, vddMid - half, VDD.eave - 0.2, ua + 0.7, vddMid + half, top));
  }
  vddParts.push(box(ue - 0.35 - (dir < 0 ? 0 : 0.05), vddMid - 0.45, VDD.eave, ue + 0.35, vddMid + 0.45, VDD.eave + 0.35 + 3 * 1.25 + 0.9));
}
// Dakkapel: spitse houten gevel 0,4 m voor de gevel op een kraag van 45°.
{
  const du0 = 23.3;
  const du1 = 26.5;
  const dc = (du0 + du1) / 2;
  const f = VDD.v0 - 0.4;
  vddParts.push(
    hull([[du0, f, VDD.eave - 0.4], [du1, f, VDD.eave - 0.4], [du0, vddMid, VDD.eave - 0.4], [du1, vddMid, VDD.eave - 0.4], [dc, f, Z(21.9)], [dc, vddMid, Z(21.9)], [du0, VDD.v0, VDD.eave - 0.8], [du1, VDD.v0, VDD.eave - 0.8]]),
  );
}
// Leeuwen bij de deur.
vddParts.push(box(23.2, VDD.v0 - 0.9, BASE, 24.0, VDD.v0 + 0.05, Z(11.8)), box(25.8, VDD.v0 - 0.9, BASE, 26.6, VDD.v0 + 0.05, Z(11.8)));
const vddNiches = [
  nicheV(24.9, VDD.v0, 1, 1.4, Z(10.6), Z(12.8), 0.4, true),
  ...[20.9, 22.2, 27.6, 28.9].flatMap((u) => [nicheV(u, VDD.v0, 1, 0.9, Z(12.0), Z(13.4)), nicheV(u, VDD.v0, 1, 0.9, Z(14.8), Z(16.4))]),
  nicheV(24.9, VDD.v0 - 0.4, 1, 1.0, Z(18.6), Z(19.8), 0.35, true),
  ...[-1, 1].map((d) => nicheU(d < 0 ? VDD.u0 - 0.3 : VDD.u1 + 0.3, vddMid, -d, 0.9, Z(18.4), Z(19.6), 0.35)),
];
const vddHouse = union(vddParts).subtract(union(vddNiches));

// Kademuur langs de vijver met kantelen en bogen op de waterlijn (de grote
// boog is de doorvaart van de sloepen onder het plein).
const quayParts = [];
const quayNiches = [];
for (let i = 0; i + 1 < QUAY.pts.length; i++) {
  const a = QUAY.pts[i];
  const b = QUAY.pts[i + 1];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  const left = [-d[1], d[0]];
  const a2 = [a[0] + (left[0] * QUAY.thick) / 2, a[1] + (left[1] * QUAY.thick) / 2];
  const b2 = [b[0] + (left[0] * QUAY.thick) / 2, b[1] + (left[1] * QUAY.thick) / 2];
  quayParts.push(prism(strip(a2, b2, QUAY.thick, -0.6, len + 0.6), BASE, QUAY.top));
  quayParts.push(battlement(a, b, 0.6, () => QUAY.top, 0.02, 0.9));
  // bogen: blinde spitse nissen 0,5 m diep op de waterlijn
  const arch = (s, w, spring) =>
    hull(
      [0, 0.5].flatMap((depth) => {
        const p = [a[0] + d[0] * s + left[0] * depth, a[1] + d[1] * s + left[1] * depth];
        const o = [-0.2 * left[0], -0.2 * left[1]];
        return [
          [p[0] + o[0] - (d[0] * w) / 2, p[1] + o[1] - (d[1] * w) / 2, BASE + 0.4],
          [p[0] + o[0] + (d[0] * w) / 2, p[1] + o[1] + (d[1] * w) / 2, BASE + 0.4],
          [p[0] + o[0] - (d[0] * w) / 2, p[1] + o[1] - (d[1] * w) / 2, spring],
          [p[0] + o[0] + (d[0] * w) / 2, p[1] + o[1] + (d[1] * w) / 2, spring],
          [p[0] + o[0], p[1] + o[1], spring + (w / 2) * Math.tan(Math.PI / 3)],
          [p[0] - (d[0] * w) / 2, p[1] - (d[1] * w) / 2, BASE + 0.4],
          [p[0] + (d[0] * w) / 2, p[1] + (d[1] * w) / 2, BASE + 0.4],
          [p[0] - (d[0] * w) / 2, p[1] - (d[1] * w) / 2, spring],
          [p[0] + (d[0] * w) / 2, p[1] + (d[1] * w) / 2, spring],
          [p[0], p[1], spring + (w / 2) * Math.tan(Math.PI / 3)],
        ];
      }),
    );
  if (len > 6) {
    const n = Math.floor(len / 4.5);
    for (let k = 0; k < n; k++) {
      const s = (len / n) * (k + 0.5);
      // de doorvaart bij X 5-8 (BGT-steiger)
      const at = [a[0] + d[0] * s, a[1] + d[1] * s];
      const boat = Math.abs(at[0] - 6.8) < 2.4 && at[1] < -12;
      quayNiches.push(boat ? arch(s, 3.0, Z(9.0)) : arch(s, 1.8, Z(8.6)));
    }
  }
}
const quay = union(quayParts).subtract(union(quayNiches));

const havenstad = clipBase(union([hallBody, ...hallBattlements, rooftop, cityWall, houseRow, vddHouse, quay]));

// ---------- toren met lifthuisbak ----------
const T = TOWER;
const towerParts = [
  box(-T.hu, -T.hv, BASE, T.hu, T.hv, T.corbel),
  // plint met een schuine kraag
  hull([...ring3(rect(-T.hu - 0.3, -T.hv - 0.3, T.hu + 0.3, T.hv + 0.3), BASE), ...ring3(rect(-T.hu - 0.3, -T.hv - 0.3, T.hu + 0.3, T.hv + 0.3), Z(11.2)), ...ring3(rect(-T.hu, -T.hv, T.hu, T.hv), Z(11.5))]),
  // lichte band op een derde van de hoogte
  hull([...ring3(rect(-T.hu, -T.hv, T.hu, T.hv), Z(15.0)), ...ring3(rect(-T.hu - 0.3, -T.hv - 0.3, T.hu + 0.3, T.hv + 0.3), Z(15.3)), ...ring3(rect(-T.hu - 0.3, -T.hv - 0.3, T.hu + 0.3, T.hv + 0.3), Z(16.0))]),
  // mezekouwen: kraag van 45° en de omgang met kantelen
  hull([...ring3(rect(-T.hu, -T.hv, T.hu, T.hv), T.corbel - 0.05), ...ring3(rect(-T.hu - 0.6, -T.hv - 0.6, T.hu + 0.6, T.hv + 0.6), T.gallery)]),
  box(-T.hu - 0.6, -T.hv - 0.6, T.gallery - 0.01, T.hu + 0.6, T.hv + 0.6, T.parapet),
];
{
  const g = [
    [-T.hu - 0.6, -T.hv - 0.6],
    [T.hu + 0.6, -T.hv - 0.6],
    [T.hu + 0.6, T.hv + 0.6],
    [-T.hu - 0.6, T.hv + 0.6],
  ];
  g.forEach((a, i) => towerParts.push(battlement(a, g[(i + 1) % 4], 0.6, () => T.parapet, 0.02, T.top - T.parapet - 0.02, 1.9)));
}
// hoektorentjes op een kraag van 45° met een achtkante spits
for (const sx of [-1, 1]) {
  for (const sy of [-1, 1]) {
    const c = [sx * (T.hu + 0.5), sy * (T.hv + 0.5)];
    const inner = [sx * (T.hu - 0.25), sy * (T.hv - 0.25)];
    towerParts.push(
      hull([...ring3(circle(inner, 0.3, 8, Math.PI / 8), Z(22.6)), ...ring3(circle(c, T.turretR, 8, Math.PI / 8), T.corbel + 0.2)]),
      prism(circle(c, T.turretR, 8, Math.PI / 8), T.corbel + 0.15, T.turretTop),
      spire(c, T.turretR + 0.12, T.turretTop - 0.05, T.spireTop, 8),
    );
  }
}
// houten bak op de zuidkant waar de baan de toren uitkomt
towerParts.push(
  hull([...ring3(rect(-1.0, -T.hv - 0.05, 2.4, -T.hv + 0.2), Z(22.3)), ...ring3(rect(-1.0, -T.hv - 1.5, 2.4, -T.hv + 0.2), Z(23.8)), ...ring3(rect(-1.0, -T.hv - 1.5, 2.4, -T.hv + 0.2), T.gallery + 0.6)]),
);
// lifthuisbak: van de top van de toren onder 42° naar het dak van de hal, met
// een flauwe nok
towerParts.push(
  hull([
    [LIFT.u0, LIFT.v0, BASE], [LIFT.u1, LIFT.v0, BASE], [LIFT.u0, LIFT.v1, BASE], [LIFT.u1, LIFT.v1, BASE],
    [LIFT.u0, LIFT.v0, LIFT.top], [LIFT.u1, LIFT.v0, LIFT.top], [(LIFT.u0 + LIFT.u1) / 2, LIFT.v0, LIFT.top + 0.6],
    [LIFT.u0, LIFT.v1, LIFT.foot], [LIFT.u1, LIFT.v1, LIFT.foot], [(LIFT.u0 + LIFT.u1) / 2, LIFT.v1, LIFT.foot + 0.6],
  ]),
);
const towerNiches = [
  // deur en vensters (luiken) als blinde nissen
  nicheV(-1.6, -T.hv, 1, 1.6, Z(10.6), Z(12.8), 0.4, true),
  nicheV(-1.5, -T.hv, 1, 0.9, Z(17.2), Z(18.5)),
  nicheV(1.5, -T.hv, 1, 0.9, Z(17.2), Z(18.5)),
  nicheV(0.7, -T.hv, 1, 0.9, Z(19.8), Z(21.1)),
  ...[-1, 1].flatMap((d) => [
    nicheU(d * T.hu, -1.5, -d, 0.9, Z(17.2), Z(18.5)),
    nicheU(d * T.hu, 1.5, -d, 0.9, Z(17.2), Z(18.5)),
    nicheU(d * T.hu, 0, -d, 0.9, Z(20.0), Z(21.3)),
    nicheU(d * T.hu, -1.2, -d, 0.6, Z(12.6), Z(13.6)),
  ]),
  // spleten in de omgang (mezekouwen)
  ...[-3, -1.8, -0.6, 0.6, 1.8, 3].flatMap((s) => [
    nicheU(-T.hu - 0.6, s, 1, 0.4, T.gallery + 0.3, T.parapet - 0.4, 0.3),
    nicheU(T.hu + 0.6, s, -1, 0.4, T.gallery + 0.3, T.parapet - 0.4, 0.3),
    ...(Math.abs(s) > 1.5 ? [nicheV(s, -T.hv - 0.6, 1, 0.4, T.gallery + 0.3, T.parapet - 0.4, 0.3)] : []),
  ]),
];
const toren = clipBase(union(towerParts).subtract(union(towerNiches)));

// ---------- baan ----------
const dropSamples = spline(toTrackPoints(DROP), 1.0);
const mainSamples = spline(toTrackPoints(MAIN), 1.0);
// Geen kolommen in de toren, op het plein voor de toren of op de kademuur.
const inTower = ([u, v]) => Math.abs(u) < T.hu + 1.2 && Math.abs(v) < T.hv + 2.0;
const drop = track(dropSamples, { noColumn: inTower });
// Boven de vijver (Y < -27) staat de baan op pijlers.
const main = track(mainSamples, { noFoot: ([, v]) => v < -27 });
// Duinhuisje op palen rond de rem.
const houseA = L(DUNE_HOUSE.a);
const houseB = L(DUNE_HOUSE.b);
const houseMid = [(houseA[0] + houseB[0]) / 2, (houseA[1] + houseB[1]) / 2];
const houseDeg = (Math.atan2(houseB[1] - houseA[1], houseB[0] - houseA[0]) * 180) / Math.PI;
const dh = DUNE_HOUSE;
const duneHouse = union([
  box(-dh.len / 2, -dh.width / 2, dh.floor, dh.len / 2, dh.width / 2, dh.eave),
  hull([...ring3(rect(-dh.len / 2 - 0.3, -dh.width / 2 - 0.3, dh.len / 2 + 0.3, dh.width / 2 + 0.3), dh.eave - 0.01), [-dh.len / 2 - 0.3, 0, dh.ridge], [dh.len / 2 + 0.3, 0, dh.ridge]]),
  ...[-1, 1].flatMap((sx) => [-1, 1].map((sy) => box(sx * (dh.len / 2 - 0.6) - 0.5, sy * (dh.width / 2 - 0.6) - 0.5, BASE, sx * (dh.len / 2 - 0.6) + 0.5, sy * (dh.width / 2 - 0.6) + 0.5, dh.floor + 0.05))),
  // kraag van 45° onder de vloer naar de palen
  hull([...ring3(rect(-dh.len / 2, -dh.width / 2, dh.len / 2, dh.width / 2), dh.floor + 0.01), ...ring3(rect(-dh.len / 2 + 1.6, -dh.width / 2 + 1.6, dh.len / 2 - 1.6, dh.width / 2 - 1.6), dh.floor - 1.6)]),
])
  .subtract(union([nicheU(dh.len / 2, 0, -1, 2.2, dh.floor + 0.3, dh.eave - 0.6, 0.6, true), nicheU(-dh.len / 2, 0, 1, 2.2, dh.floor + 0.3, dh.eave - 0.6, 0.6, true)]))
  .rotate([0, 0, houseDeg])
  .translate([houseMid[0], houseMid[1], 0]);
// Wrak aan de oever, met de mond van het 'mistige gat' waar de baan induikt.
const W = WRECK;
// Omgekeerde romp: smalle, spitse achtersteven in het westen, de brede
// gebroken boeg met de mond in het oosten, de kiel bovenop.
const wreck = hull([
  [W.u0, W.v - 0.6, BASE], [W.u0, W.v + 0.6, BASE], [W.u0 + 3, W.v - W.half, BASE], [W.u0 + 3, W.v + W.half, BASE],
  [W.u1, W.v - W.half - 0.2, BASE], [W.u1, W.v + W.half + 0.2, BASE],
  [W.u0 + 3, W.v - W.half - 0.2, Z(10.4)], [W.u0 + 3, W.v + W.half + 0.2, Z(10.4)], [W.u1 - 0.3, W.v - W.half - 0.4, Z(10.6)], [W.u1 - 0.3, W.v + W.half + 0.4, Z(10.6)],
  [W.u0 + 0.4, W.v, W.top - 1.6], [W.u1 - 0.8, W.v, W.top],
]).subtract(nicheU(W.u1, W.v + 0.1, -1, 2.6, BASE + 0.5, Z(10.6), 3.0, true));
// Afgebroken mast op het wrak.
const mast = prism(circle([W.u0 + 4.2, W.v + 0.6], 0.5, 8), BASE, W.top + 2.2);
const baan = clipBase(union([drop.band, ...drop.supports, main.band, ...main.supports, duneHouse, wreck, mast]));

// ---------- controles en schrijven ----------
const nodes = [
  ["building:havenstad", havenstad],
  ["building:toren", toren],
  ["building:baan", baan],
];
for (const [name, solid] of nodes) {
  const faces = downFaces(solid, BASE).filter((f) => f.area > 0.5);
  console.error(`${name}: ${faces.length} ondervlakken > 0,5 m², grootste`, JSON.stringify(faces.sort((a, b) => b.area - a.area).slice(0, 6)));
}
const all = Manifold.union(nodes.map(([, s]) => s));
const bb = all.boundingBox();
const highest = (() => {
  const mesh = toren.getMesh();
  let top = -Infinity;
  for (let i = 2; i < mesh.vertProperties.length; i += mesh.numProp) top = Math.max(top, mesh.vertProperties[i]);
  return top;
})();
await writeLandmark({
  slug: "efteling-vliegende-hollander",
  nodes,
  base: BASE,
  catalog: {
    name: "De Vliegende Hollander (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Op het pad ten westen van de toren en op het plein (NAP +10,4 tot +10,6 m).
    groundSamplePoints: GROUND_SAMPLES,
    replacesBuildings: ["NL.IMBAG.Pand.0809100000017610"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (131782,45, 406568,49), het hart van de liftoren, op het maaiveld bij de toren (NAP +10,4 m), +X langs de gevel aan het plein (RD-richting -14,4°) en +Y de hal in. Node building:havenstad: de showhal op het BAG-pand (dak +17,3 m en +15,8 m) met kantelen, de stadsmuur met pilasters en leeuwen, vijf havenhuisjes met klok-, trap- en spitse houten gevels, het huis Van der Decken met trapgevels en dakkapel en de kademuur met bogen langs de vijver. Node building:toren: de liftoren (+29,3 m) met mezekouwen, kantelen, vier hoektorentjes (spitsen tot +32,8 m), de houten bak waar de baan uitkomt en de schuine lifthuisbak. Node building:baan: de band van 1,5 bij 0,9 m van de val uit de toren tot het wrak met het 'mistige gat' en van de uitgang in het duin over de luchtheuvel, de overhelde bocht, het duinhuisje op palen (tussenrem), de tweede val en de bocht over het water tot de plons, op kolommen en een doorlopende voet. Onderkant op NAP +7,3 m, onder het water van de vijver; de vijver zelf is niet gemodelleerd. Vervangt de PDOK-reconstructie van de hal. Nodenaam klasse:label bepaalt de materiaalklasse.",
    realWorld: {
      lengthM: +(bb.max[1] - bb.min[1]).toFixed(1),
      widthM: +(bb.max[0] - bb.min[0]).toFixed(1),
      highestPointNapM: +(highest + GROUND_NAP).toFixed(2),
      liftHeightM: 22.5,
      trackLengthM: 420,
      towerRoofNapM: TOWER.top + GROUND_NAP,
      hallRoofNapM: HALL.roof + GROUND_NAP,
      duneHouseRidgeNapM: DUNE_HOUSE.ridge + GROUND_NAP,
      splashNapM: 8.2,
      groundNapM: GROUND_NAP,
      waterNapM: 7.9,
      baseNapM: 7.3,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/De_Vliegende_Hollander_(Efteling)",
      "https://en.wikipedia.org/wiki/De_Vliegende_Hollander",
      "PDOK BAG pand 0809100000017610 (showhal met liftoren), EPSG:28992",
      "PDOK BGT waterdeel (oever van de vijver: ligging van de kademuur)",
      "PDOK AHN DSM/DTM 0,5 m via WCS: daken, toren, lifthuisbak, duinhuisje en baanhoogtes",
      "PDOK luchtfoto (Actueel_orthoHR): tracé van de baan, kademuur, wrak",
      "Wikimedia Commons, Category:De Vliegende Hollander (toren, gevels, kademuur, duinhuisje, plons)",
    ],
  },
});

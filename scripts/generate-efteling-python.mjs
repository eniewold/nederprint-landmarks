// Genereert een vereenvoudigd, gesloten 3D-model van de Python in de Efteling
// (Kaatsheuvel): de stalen achtbaan van Vekoma uit 1981 (lay-out van Arrow,
// gelijk aan de Carolina Cyclone), in 2018 tussen de eerste val en de
// eindremmen vernieuwd door CSM. Het model bevat het station met zijn
// rode zadeldak, de remsectie met de groene geluidsschermen, de
// lift-heuvel (29 m) met de keerbocht op een stalen vakwerktoren, de eerste
// val (22 m), de twee verticale loopings, de dubbele kurkentrekker langs de
// vijver, de helix en de stalen steunen (portalen onder de lift en de
// keerbocht, kolommen onder de rest). Alle maten in meters op ware grootte.
//
//   node scripts/generate-efteling-python.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-python.mjs --scale 500
//
// Assenstelsel: oorsprong op RD (131906, 406497), het midden van het station,
// op het maaiveld (NAP ca. +9,3 m), Z omhoog, +X naar het noorden (langs de
// baan door het station, de lift en de loopings) en +Y naar het westen. Het
// script rekent in een werkstelsel (oost, noord) ten opzichte van de
// oorsprong en draait het resultaat aan het eind een kwartslag.
//
// Baan: één dichte band van 1,4 m breed met een driehoekige kiel tot 1,0 m
// onder de bovenkant van de rails (zijvlakken onder 55°, dus zonder overhang
// tussen de steunen); in de loopings wijst de bovenkant naar het middelpunt,
// in de kurkentrekkers naar de as, in bochten helt hij tot 8°.
// Lage delen (onderkant onder 1,4 m) staan op een doorlopende voet tot de
// onderkant; hoger staat de baan op een steunwand van 0,9 m dik met spitse
// openingen (poten van 1 m om de ~6 m, zijden onder 55°): de abstractie van
// het groene vakwerk onder lift en keerbocht en van de kolommen elders. De
// loopings hebben een zware kolom aan elke zijkant, de kurkentrekkers een
// kolom onder de top en onder beide zijlussen. Printbaar op 1:1000 en 1:500:
// de export zet alleen onder de ondersteboven liggende delen (top van de
// loopings en kurkentrekkers) een wig. Met --kolommen staan er portalen en
// losse kolommen zoals in het echt; dan vult de export onder de hele baan een
// wand op (+240 % op 1:1000) en loopt de opvulling op 1:500 vast.
//
// Bronnen: PDOK luchtfoto 8 cm (tracé; let op, de luchtfoto is geen ware
// orthofoto: hoge delen staan tot ca. 0,4 m per meter hoogte naar het
// noorden verschoven, dus de ligging komt uit het AHN), AHN DSM/DTM 0,5 m
// (ligging van alle baandelen en hoogtes als maxima langs het pad, station),
// nl.wikipedia (hoogte 29 m, valhoogte 22 m, 750 m baan, 4 inversies),
// Commons-foto's (vorm van lift, keerbocht, loopings, kurkentrekkers,
// station). Geschat: de loopinghoogte (top 18 en 17,5 m; het DSM ziet 17-18 m),
// de kurkentrekkers (straal 4 m, top 13 m), het verloop van de helix (in- en
// uitgang en de kruising in het noordoosten zijn uit de foto afgeleid), de
// railhoogte in het station (1,0 m) en de steunafstanden. Het water van de
// vijver is niet gemodelleerd. Het station is geen BAG-pand; er is dus geen
// PDOK-reconstructie die vervangen moet worden.
import {
  Manifold,
  box,
  circle,
  downFaces,
  hull,
  prism,
  union,
  writeLandmark,
} from "./efteling-kit.mjs";

const ORIGIN = [131906, 406497];
const X_AXIS = [0, 1];
const GROUND_NAP = 9.3;
const BASE = -0.5;
const W = 1.4; // baanbreedte
const H = 1.0; // diepte van de kiel onder de bovenkant van de rails

// ---------- vectorhulp ----------
const add = (a, b) => a.map((c, i) => c + b[i]);
const sub = (a, b) => a.map((c, i) => c - b[i]);
const mul = (a, k) => a.map((c) => c * k);
const dot = (a, b) => a.reduce((s, c, i) => s + c * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(...a);
const unit = (a) => mul(a, 1 / len(a));
// RD (oost, noord, z) → werkstelsel ten opzichte van de oorsprong
const L = ([e, n, z]) => [e - ORIGIN[0], n - ORIGIN[1], z];

// ---------- tracé ----------
// Kubische Hermite-spline door controlepunten (RD + z), raaklijnen uit de
// buren of opgegeven aan de uiteinden, bemonsterd om de ~step meter.
function spline(ctrl, { t0, t1, step = 1.5 } = {}) {
  const P = ctrl.map(L);
  const n = P.length;
  const m = P.map((p, i) => {
    if (i === 0 && t0) return unit(t0);
    if (i === n - 1 && t1) return unit(t1);
    return unit(sub(P[Math.min(n - 1, i + 1)], P[Math.max(0, i - 1)]));
  });
  const out = [];
  for (let i = 0; i + 1 < n; i++) {
    const span = len(sub(P[i + 1], P[i]));
    const k = Math.max(1, Math.ceil(span / step));
    for (let j = 0; j < k; j++) {
      const t = j / k;
      const h00 = 2 * t ** 3 - 3 * t ** 2 + 1;
      const h10 = t ** 3 - 2 * t ** 2 + t;
      const h01 = -2 * t ** 3 + 3 * t ** 2;
      const h11 = t ** 3 - t ** 2;
      out.push([0, 1, 2].map((c) => h00 * P[i][c] + h10 * span * m[i][c] + h01 * P[i + 1][c] + h11 * span * m[i + 1][c]));
    }
  }
  out.push(P[n - 1]);
  return { pts: out, ups: null };
}

// Verticale looping in het vlak oost = constant, rijrichting naar het zuiden:
// druppelvorm (boven smaller), onderkant op zb, hoogte hh, halve breedte a.
// Tijdens de looping schuift de baan van eIn naar eOut opzij, zodat in- en
// uitloop naast elkaar onder de looping door gaan.
function loop({ eIn, eOut, yc, zb, a, hh, n = 64 }) {
  const pts = [];
  const ups = [];
  for (let k = 0; k <= n; k++) {
    const f = (2 * Math.PI * k) / n;
    const s = k / n;
    const e = eIn + (eOut - eIn) * (s * s * (3 - 2 * s));
    const p = L([e, yc - a * Math.sin(f) * (1 + 0.25 * Math.cos(f)), zb + (hh * (1 - Math.cos(f))) / 2]);
    pts.push(p);
    ups.push(unit([0, L([0, yc, 0])[1] - p[1], zb + hh * 0.55 - p[2]]));
  }
  return { pts, ups };
}

// Kurkentrekker: een volle rol om een as van start naar eind (RD + z). De
// baan gaat eerst links omhoog, over de top (ondersteboven) en rechts weer
// omlaag; de bovenkant wijst steeds naar de as.
function corkscrew({ from, to, r, alpha = 0, n = 56 }) {
  const a = L(from);
  const b = L(to);
  const dPlan = unit([b[0] - a[0], b[1] - a[1], 0]);
  const lenPlan = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const left = [-dPlan[1], dPlan[0], 0];
  const pts = [];
  const ups = [];
  for (let k = 0; k <= n; k++) {
    const t = (2 * Math.PI * k) / n;
    const fwd = (lenPlan * (t + alpha * Math.sin(t))) / (2 * Math.PI);
    const zLin = a[2] + ((b[2] - a[2]) * k) / n;
    pts.push(add(add([a[0], a[1], zLin], mul(dPlan, fwd)), add(mul(left, r * Math.sin(t)), [0, 0, r * (1 - Math.cos(t))])));
    ups.push(unit(add(mul(left, -Math.sin(t)), [0, 0, Math.cos(t)])));
  }
  return { pts, ups };
}

const startTan = (piece) => sub(piece.pts[1], piece.pts[0]);
const endTan = (piece) => sub(piece.pts.at(-1), piece.pts.at(-2));

// Loopings: ligging en lengte uit het DSM (loop 1 van RD-noord 406516,5 tot
// 406529,5, loop 2 van 406493,5 tot 406506); hoogte geschat op 18 en 17,5 m.
const LOOP1 = { eIn: 131898.2, eOut: 131896.84, yc: 406523, zb: 1.8, a: 5.2, hh: 16.2 };
const LOOP2 = { eIn: 131898.2, eOut: 131896.84, yc: 406499.5, zb: 1.8, a: 5.0, hh: 15.7 };
// Kurkentrekkers langs de vijver: assen uit de DSM-pieken (top 13-14 m).
const CS1 = { from: [131871, 406462, 5.0], to: [131873.5, 406491, 4.8], r: 4.0 };
const CS2 = { from: [131873.5, 406491, 4.8], to: [131876, 406517, 4.5], r: 4.0 };

const pLoop1 = loop(LOOP1);
const pLoop2 = loop(LOOP2);
const pCs1 = corkscrew(CS1);
const pCs2 = corkscrew(CS2);

// Keerbocht boven de lift: halve cirkel met straal 10 om RD (131907,5, 406568,5)
// op ca. 24 m, van de lift (oost) via het noorden naar de val (west).
const turn = Array.from({ length: 7 }, (_, k) => {
  const f = (Math.PI * k) / 6;
  return [131907.5 + 10 * Math.cos(f), 406568.5 + 10 * Math.sin(f), 24.2 - 0.7 * (k / 6)];
});
// Helix: binnenring met straal 10,5 om RD (131883,5, 406550), met de klok
// mee; de aanloop komt over een buitenbaan (straal ~13) aan de noordkant en
// de uitloop kruist hem in het noordoosten erboven.
const HC = [131883.5, 406550];
const ring = (deg, r, z) => [HC[0] + r * Math.cos((deg * Math.PI) / 180), HC[1] + r * Math.sin((deg * Math.PI) / 180), z];

const pieces = [
  // station (rijrichting zuid) → bocht onder het station → lift → keerbocht → val
  spline(
    [
      [131905.5, 406507, 1.0],
      [131905.5, 406486, 1.0],
      [131905.5, 406477, 1.0],
      [131905.5, 406473, 1.0],
      [131907.26, 406468.76, 1.0],
      [131911.5, 406467, 1.0],
      [131915.74, 406468.76, 1.0],
      [131917.5, 406473, 1.0],
      [131917.5, 406480, 1.0],
      [131917.5, 406486, 1.4],
      [131917.5, 406492, 3.9],
      [131917.5, 406534, 25.0],
      [131917.5, 406540, 27.6],
      [131917.5, 406545, 28.85],
      [131917.5, 406549, 29.0],
      [131917.5, 406554, 28.0],
      [131917.5, 406559, 26.0],
      [131917.5, 406564, 24.6],
      ...turn,
      [131897.5, 406564, 23.0],
      [131897.5, 406558, 21.2],
      [131897.5, 406552, 16.5],
      [131897.6, 406548, 11.0],
      [131897.8, 406544, 5.8],
      [131898.0, 406540, 2.6],
      [131898.2, 406535, 1.85],
      [LOOP1.eIn, LOOP1.yc, LOOP1.zb],
    ],
    { t0: [0, -1, 0], t1: startTan(pLoop1) },
  ),
  pLoop1,
  spline(
    [
      [LOOP1.eOut, LOOP1.yc, LOOP1.zb],
      [131897.0, 406516, 1.9],
      [131897.8, 406510, 2.1],
      [131898.2, 406505, 1.9],
      [LOOP2.eIn, LOOP2.yc, LOOP2.zb],
    ],
    { t0: endTan(pLoop1), t1: startTan(pLoop2) },
  ),
  pLoop2,
  // na de loopings naar het zuiden, de bocht naar het westen en noorden
  spline(
    [
      [LOOP2.eOut, LOOP2.yc, LOOP2.zb],
      [131896.6, 406491, 2.3],
      [131895.6, 406480, 3.4],
      [131892.6, 406467, 4.7],
      [131888.6, 406459.3, 5.3],
      [131882.5, 406456, 5.5],
      [131876, 406457, 5.4],
      CS1.from,
    ],
    { t0: endTan(pLoop2), t1: startTan(pCs1) },
  ),
  pCs1,
  pCs2,
  // van de kurkentrekkers langs de westkant naar de helix
  spline(
    [
      CS2.to,
      [131871.5, 406523.5, 4.6],
      [131867.8, 406531, 4.8],
      [131866.6, 406540, 5.0],
      [131867.4, 406548, 5.2],
      [131870.6, 406555.5, 5.4],
      [131876.5, 406561.3, 5.6],
      [131883.5, 406563.2, 5.5],
      [131890.2, 406560.6, 5.0],
      ring(0, 10.5, 3.4),
      ring(-45, 10.5, 2.4),
      ring(-90, 10.5, 1.8),
      ring(-135, 10.5, 2.2),
      ring(-180, 10.5, 3.2),
      ring(-225, 10.5, 4.8),
      ring(-270, 10.4, 6.6),
      ring(-312, 10.6, 8.0),
      [131897.2, 406552.2, 7.4],
      [131901.2, 406547, 5.8],
      [131904.4, 406541, 3.6],
      [131905.5, 406534, 2.0],
      [131905.5, 406525, 1.4],
      [131905.5, 406515, 1.05],
      [131905.5, 406507, 1.0],
    ],
    { t0: endTan(pCs2), t1: [0, -1, 0] },
  ),
];

// Aaneenrijgen; punten die samenvallen met het vorige stuk vervallen.
const P = [];
const U = [];
const pieceRange = [];
for (const piece of pieces) {
  const i0 = P.length;
  piece.pts.forEach((p, k) => {
    if (P.length && len(sub(p, P.at(-1))) < 0.05) return;
    P.push(p);
    U.push(piece.ups ? piece.ups[k] : null);
  });
  pieceRange.push([i0, P.length - 1]);
}
const N = P.length;
const S = [0];
for (let i = 1; i < N; i++) S.push(S[i - 1] + len(sub(P[i], P[i - 1])));
const tangent = (i) => unit(sub(P[Math.min(N - 1, i + 1)], P[Math.max(0, i - 1)]));

// Kanteling in bochten van de splinestukken: tot 8° naar binnen (meer maakt
// een kielvlak flauwer dan 45°), afhankelijk
// van de kromming in het platte vlak, licht uitgemiddeld.
const bankRaw = P.map((_, i) => {
  if (U[i]) return 0;
  const a = P[Math.max(0, i - 2)];
  const b = P[i];
  const c = P[Math.min(N - 1, i + 2)];
  const t1 = [b[0] - a[0], b[1] - a[1]];
  const t2 = [c[0] - b[0], c[1] - b[1]];
  const l1 = Math.hypot(...t1);
  const l2 = Math.hypot(...t2);
  if (l1 < 1e-6 || l2 < 1e-6) return 0;
  const sin = (t1[0] * t2[1] - t1[1] * t2[0]) / (l1 * l2);
  const kappa = (2 * sin) / (l1 + l2);
  return Math.max(-8, Math.min(8, kappa * 80));
});
const bank = bankRaw.map((_, i) => {
  if (U[i]) return 0;
  let s = 0;
  let c = 0;
  for (let k = -3; k <= 3; k++) {
    const j = i + k;
    if (j >= 0 && j < N && !U[j]) {
      s += bankRaw[j];
      c++;
    }
  }
  return s / c;
});
for (let i = 0; i < N; i++) {
  if (U[i]) continue;
  const t = tangent(i);
  const zUp = unit(sub([0, 0, 1], mul(t, t[2])));
  const inward = cross(t, zUp); // links van de rijrichting
  const b = (bank[i] * Math.PI) / 180;
  U[i] = unit(add(mul(zUp, Math.cos(b)), mul(inward, Math.sin(b))));
}

// Band met een driehoekige doorsnede: bovenkant (de rails) W breed, eronder
// een kiel tot H diep (zijvlakken onder 55°, zoals de driehoekige ligger van
// de Vekoma-baan). Zo hangt de rechtop liggende baan tussen de steunen niet
// over; alleen de ondersteboven liggende delen (top van de loopings en
// kurkentrekkers) krijgen een wig in de export. Verder als ribbon() uit de
// kit: doorsnede loodrecht op de gemiddelde richting, segmenten 2 cm verlengd.
function keelRibbon(pts, w, h, upAt) {
  const n = pts.length;
  const seg = (i) => unit(sub(pts[i + 1], pts[i]));
  const frames = pts.map((p, i) => {
    const t = unit(add(i > 0 ? seg(i - 1) : [0, 0, 0], i < n - 1 ? seg(i) : [0, 0, 0]));
    const s = unit(cross(t, upAt(Math.min(i, n - 2))));
    return { p, t, s, u: cross(s, t) };
  });
  const corners = ({ p, s, u }, shift) =>
    [
      [w / 2, 0],
      [-w / 2, 0],
      [0, -h],
    ].map(([a, b]) => [0, 1, 2].map((k) => p[k] + shift[k] + s[k] * a + u[k] * b));
  const parts = [];
  for (let i = 0; i + 1 < n; i++) {
    parts.push(hull([...corners(frames[i], mul(frames[i].t, -0.02)), ...corners(frames[i + 1], mul(frames[i + 1].t, 0.02))]));
  }
  return Manifold.union(parts);
}
const track = keelRibbon(P, W, H, (i) => U[i]);

// ---------- steunen ----------
// Onderkant van de band op punt i (de baan ligt rechtop: ongeveer z - H).
const under = (i) => P[i][2] - H * Math.max(0.5, U[i][2]);
const R = (e, n) => L([e, n, 0]).slice(0, 2);
const octagon = (c, r) => circle(c, r, 8, Math.PI / 8);
const column = (c, zTop, r = 0.5) => prism(octagon(c, r), BASE, zTop);

// Een plek is vrij als geen ander baandeel (verder dan 'skip' meter langs de
// baan) binnen 'clear' meter in het platte vlak onder 'zTop' doorloopt.
function free(c, zTop, iSelf, clear = 1.0, skip = 6) {
  for (let j = 0; j < N; j++) {
    if (Math.abs(S[j] - S[iSelf]) < skip) continue;
    const d = Math.hypot(P[j][0] - c[0], P[j][1] - c[1]);
    if (d < clear + W / 2 + 0.3 && P[j][2] - 1.2 < zTop + 0.3) return false;
  }
  return true;
}

// Portaal dwars op de baan: twee poten op ±spread, bovenregel onder de band
// met een onderkant die onder 45° naar het midden oploopt (spitse opening),
// en tussenregels om de 8 m.
function portal(i, spread = 1.9, leg = 0.9) {
  const t = tangent(i);
  const nrm = unit([-t[1], t[0], 0]);
  const zTop = under(i) + 0.4;
  const c = [P[i][0], P[i][1]];
  const feet = [-1, 1].map((sgn) => [c[0] + nrm[0] * spread * sgn, c[1] + nrm[1] * spread * sgn]);
  if (!feet.every((f) => free(f, zTop, i, 0.6)) || !free(c, zTop, i, 0.6)) return null;
  const parts = [];
  const half = leg / 2;
  const along = [t[0], t[1]];
  const al = Math.hypot(...along) || 1;
  const a = [along[0] / al, along[1] / al];
  const legSq = (f) => [
    [f[0] + a[0] * half + nrm[0] * half, f[1] + a[1] * half + nrm[1] * half],
    [f[0] - a[0] * half + nrm[0] * half, f[1] - a[1] * half + nrm[1] * half],
    [f[0] - a[0] * half - nrm[0] * half, f[1] - a[1] * half - nrm[1] * half],
    [f[0] + a[0] * half - nrm[0] * half, f[1] + a[1] * half - nrm[1] * half],
  ];
  for (const f of feet) parts.push(prism(legSq(f), BASE, zTop));
  // regels: bovenkant op zr, onderkant 0,6 m lager, met 45°-schoren naar de poten
  const inner = spread - half;
  const beam = (zr) => {
    for (const sgn of [-1, 1]) {
      const p = (s, z, da) => [c[0] + nrm[0] * s * sgn + a[0] * da, c[1] + nrm[1] * s * sgn + a[1] * da, z];
      const pts = [];
      for (const da of [-half * 0.8, half * 0.8]) {
        pts.push(p(0, zr, da), p(spread, zr, da), p(0, zr - 0.6, da), p(inner, zr - 0.6 - inner, da), p(spread, zr - 0.6 - inner, da));
      }
      parts.push(hull(pts));
    }
  };
  beam(zTop);
  for (let zr = zTop - 8; zr - 0.6 - inner > 2; zr -= 8) beam(zr);
  return union(parts);
}

const supports = [];
const placeAlong = (i0, i1, spacing, make, offset = spacing / 2) => {
  let next = S[i0] + offset;
  for (let i = i0; i <= i1; i++) {
    if (S[i] < next) continue;
    const m = make(i);
    if (m) {
      supports.push(m);
      next = S[i] + spacing;
    }
  }
};
// kolom onder de band, als de band hoog genoeg ligt en de plek vrij is
const col = (i) => {
  if (under(i) < 1.5) return null;
  const c = [P[i][0], P[i][1]];
  return free(c, under(i), i) ? column(c, under(i) + 0.4) : null;
};
const findIndex = (pred, from = 0) => {
  for (let i = from; i < N; i++) if (pred(P[i])) return i;
  return -1;
};
// Steunwanden: onder de rechtop liggende, hoge baan een wand van 0,9 m dik
// (het groene vakwerk en de kolommen, op 1:1000 toch één printlijn breed) met
// spitse openingen: poten van 1 m om de ~6 m, daartussen een opening met
// zijden onder 55° en de top 1 m onder de kiel. Zo draagt elke laag de laag
// erboven en hangt er tussen de steunen niets; de export hoeft alleen onder
// de ondersteboven liggende delen op te vullen. Met --kolommen staan er
// portalen en losse kolommen (zoals in het echt), maar dan zet de export
// onder de hele baan een wand en loopt de opvulling op 1:500 vast.
const isParam = new Set();
for (const k of [1, 3, 5, 6]) for (let i = pieceRange[k][0]; i <= pieceRange[k][1]; i++) isParam.add(i);
const segAt = (s) => {
  let lo = 0;
  let hi = N - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (S[mid] <= s) lo = mid;
    else hi = mid;
  }
  return [lo, Math.min(1, Math.max(0, (s - S[lo]) / (S[hi] - S[lo] || 1)))];
};
const at = (s) => {
  const [i, f] = segAt(s);
  const j = Math.min(N - 1, i + 1);
  const p = P[i].map((c, k) => c + (P[j][k] - c) * f);
  const t = sub(P[j], P[i]);
  const tl = Math.hypot(t[0], t[1]) || 1;
  return { p, n: [-t[1] / tl, t[0] / tl], top: under(i) + (under(j) - under(i)) * f + 0.4 };
};
const SLOPE = Math.tan((55 * Math.PI) / 180);
const webs = [];
function web(sA, sB) {
  const count = Math.max(1, Math.round((sB - sA) / 6));
  const lp = (sB - sA) / count;
  for (let k = 0; k < count; k++) {
    const s0 = sA + k * lp;
    const mid = s0 + lp / 2;
    const g = lp - 1.0;
    let minTop = Infinity;
    for (let s = s0; s <= s0 + lp + 1e-9; s += 0.25) minTop = Math.min(minTop, at(s).top);
    const apex = minTop - 1.0;
    // lo(s): onderkant van het materiaal; de opening ligt eronder
    const samples = [
      [s0, BASE],
      [s0 + 0.5, BASE],
    ];
    const arch = (s) => Math.max(BASE, apex - SLOPE * Math.abs(s - mid));
    if (apex - BASE > 1.5 && g > 1) {
      samples.push([s0 + 0.51, arch(s0 + 0.51)]);
      const steps = Math.max(2, Math.ceil(g / 0.75));
      for (let q = 1; q < steps; q++) samples.push([s0 + 0.5 + (g * q) / steps, arch(s0 + 0.5 + (g * q) / steps)]);
      samples.push([mid, arch(mid)]);
      samples.push([s0 + lp - 0.51, arch(s0 + lp - 0.51)]);
    } else {
      for (let q = 1; q < 4; q++) samples.push([s0 + (lp * q) / 4, BASE]);
    }
    samples.push([s0 + lp - 0.5, BASE], [s0 + lp, BASE]);
    samples.sort((a, b) => a[0] - b[0]);
    for (let q = 0; q + 1 < samples.length; q++) {
      const pts = [];
      for (const [s, lo] of [samples[q], samples[q + 1]]) {
        const { p, n, top } = at(s);
        for (const sg of [-0.45, 0.45]) for (const z of [lo, top]) pts.push([p[0] + n[0] * sg, p[1] + n[1] * sg, z]);
      }
      webs.push(hull(pts));
    }
  }
}
if (process.argv.includes("--kolommen")) {
  // Lift, keerbocht en de top van de val op portalen (het groene vakwerk).
  const [r0] = pieceRange[0];
  const liftStart = findIndex((p) => p[1] > L([0, 406490, 0])[1] && p[0] > 8, r0);
  const dropEnd = findIndex((p) => p[0] < -5 && p[1] < L([0, 406552, 0])[1], liftStart);
  placeAlong(liftStart, dropEnd, 5, (i) => (under(i) > 2.5 ? portal(i) : null), 2);
  // Rest van het eerste stuk (val tot looping) en alle splinestukken op kolommen.
  placeAlong(dropEnd, pieceRange[0][1], 7, col, 3);
  for (const k of [2, 4, 7]) placeAlong(pieceRange[k][0], pieceRange[k][1], 7, col, 3);
} else {
  // Aaneengesloten stukken waar de baan rechtop en hoog genoeg ligt en geen
  // ander baandeel eronder door loopt.
  const ok = (i) => !isParam.has(i) && under(i) >= 1.4 && free([P[i][0], P[i][1]], under(i), i, 0.45, 4);
  let start = -1;
  for (let i = 0; i <= N; i++) {
    if (i < N && ok(i)) {
      if (start < 0) start = i;
    } else if (start >= 0) {
      if (S[i - 1] - S[start] > 2) web(S[start], S[i - 1]);
      start = -1;
    }
  }
}
supports.push(...webs);

// Loopings: een zware kolom tegen elke zijkant (op de breedste plek), iets
// naast het loopingvlak aan de kant waar de in- of uitloop niet langs komt.
for (const lp of [LOOP1, LOOP2]) {
  const eS = lp.eIn + (lp.eOut - lp.eIn) * 0.156; // zuidzijde (fase 90°)
  const eN = lp.eIn + (lp.eOut - lp.eIn) * 0.844; // noordzijde (fase 270°)
  const zTop = lp.zb + lp.hh * 0.5 + 0.6;
  // net naast het midden van de kiel, zodat in- en uitloop eronder vrij blijven
  supports.push(column(R(eS + 0.75, lp.yc - lp.a - 0.7), zTop, 0.55));
  supports.push(column(R(eN - 0.75, lp.yc + lp.a + 0.7), zTop, 0.55));
}
// Kurkentrekkers: kolommen onder de top en onder beide zijlussen.
for (const k of [5, 6]) {
  const [i0, i1] = pieceRange[k];
  const n = i1 - i0;
  for (const [frac, kind] of [
    [0.25, "side"],
    [0.5, "top"],
    [0.75, "side"],
  ]) {
    const i = i0 + Math.round(n * frac);
    const u = U[i];
    if (kind === "top") {
      supports.push(column([P[i][0], P[i][1]], P[i][2] + 0.1, 0.55));
    } else {
      // zijlus: de band staat rechtop; kolom onder het midden van de dikte
      const out = [-u[0] * 0.4, -u[1] * 0.4];
      supports.push(column([P[i][0] + out[0], P[i][1] + out[1]], P[i][2] - 0.15, 0.5));
    }
  }
}

// Doorlopende voet onder de lage delen (onderkant van de band onder 1,5 m).
const plinths = [];
for (let i = 0; i + 1 < N; i++) {
  if (under(i) > 1.5 || under(i + 1) > 1.5) continue;
  const corners = [i, i + 1].flatMap((j) => {
    const t = tangent(j);
    const s = unit(cross(t, U[j]));
    const bottom = sub(P[j], mul(U[j], H * 0.5));
    return [-1, 1].map((sg) => add(bottom, mul(s, sg * 0.3)));
  });
  const block = hull([...corners, ...corners.map(([x, y]) => [x, y, BASE])]);
  if (block.volume() > 0.05) plinths.push(block);
}

// De vereniging laat langs gekromde voeten een paar vlakke snippers zonder
// volume achter; alleen het hoofddeel blijft.
const baan = union(
  union([track, ...supports, ...plinths])
    .decompose()
    .filter((p) => p.volume() > 0.5),
);

// ---------- station ----------
// Romp uit het DSM: RD-oost 131902-131911,5, noord 406486,5-406506,5, plat dak
// op 8,1 m met een rood zadeldak (nok 9,6 m) boven het midden; lage aanbouw
// aan de westkant (4,4 m). In de kopgevels een spitse nis waar de trein in- en
// uitrijdt, in de lange gevels hoge vensternissen.
const rectRd = (e0, n0, e1, n1) => [R(e0, n0), R(e1, n0), R(e1, n1), R(e0, n1)];
const stationParts = [
  prism(rectRd(131902, 406486.5, 131911.5, 406506.5), BASE, 8.1),
  prism(rectRd(131900, 406487, 131902.05, 406506), BASE, 4.4),
  hull(
    [
      [131903.6, 406486.5, 8.0],
      [131908.4, 406486.5, 8.0],
      [131903.6, 406506.5, 8.0],
      [131908.4, 406506.5, 8.0],
      [131906, 406486.5, 9.6],
      [131906, 406506.5, 9.6],
    ].map(L),
  ),
];
// geluidsschermen langs de remsectie (groene lamellen in het echt)
for (const e of [131902.6, 131908.6]) stationParts.push(prism(rectRd(e - 0.45, 406506.4, e + 0.45, 406542), BASE, 3.9));
let station = union(stationParts);
const niches = [];
// spitse nissen in de kopgevels (top onder 56°)
for (const [n0, n1] of [
  [406506.1, 406506.6],
  [406486.4, 406486.9],
]) {
  niches.push(
    hull(
      [
        [131904.0, n0, 0.0],
        [131907.0, n0, 0.0],
        [131904.0, n0, 3.0],
        [131907.0, n0, 3.0],
        [131905.5, n0, 5.2],
        [131904.0, n1, 0.0],
        [131907.0, n1, 0.0],
        [131904.0, n1, 3.0],
        [131907.0, n1, 3.0],
        [131905.5, n1, 5.2],
      ].map((p) => L(p)),
    ),
  );
}
// hoge vensters in de oostgevel en boven de aanbouw in de westgevel
for (let n = 406489; n < 406505; n += 3.2) {
  for (const [e0, e1, z0] of [
    [131911.15, 131911.6, 2.2],
    [131901.9, 131902.35, 5.0],
  ]) {
    niches.push(
      hull(
        [
          [e0, n, z0],
          [e1, n, z0],
          [e0, n + 1.6, z0],
          [e1, n + 1.6, z0],
          [e0, n, 6.4],
          [e1, n, 6.4],
          [e0, n + 1.6, 6.4],
          [e1, n + 1.6, 6.4],
          [e0, n + 0.8, 7.55],
          [e1, n + 0.8, 7.55],
        ].map(L),
      ),
    );
  }
}
station = station.subtract(union(niches));

// ---------- naar het lokale stelsel (+X noord, +Y west) ----------
const toLocal = (m) => m.rotate([0, 0, -90]);
const nodes = [
  ["building:baan", toLocal(baan)],
  ["building:station", toLocal(station)],
];

const rdToLocal = ([e, n]) => [n - ORIGIN[1], -(e - ORIGIN[0])];
// Maaiveld rond de baan: zuid van het station, tussen de loopings en de
// kurkentrekkers, in de bocht onder de kurkentrekkers, in de helix, tussen
// remsectie en lift en oostelijk van de lift (DTM NAP +9,2 tot +9,6 m).
const GROUND_SAMPLES = [
  [131906, 406478],
  [131885, 406500],
  [131883, 406470],
  [131884, 406550],
  [131907, 406560],
  [131925, 406530],
].map(rdToLocal);

const allBox = Manifold.union(nodes.map(([, m]) => m)).boundingBox();
const report = await writeLandmark({
  slug: "efteling-python",
  base: BASE,
  nodes,
  catalog: {
    name: "Python (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: GROUND_SAMPLES,
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (131906, 406497), het midden van het station, op het maaiveld (NAP ca. +9,3 m), +X naar het noorden langs de baan door het station en de lift, +Y naar het westen. Node building:baan: de baan als dichte band van 1,4 m breed met een driehoekige kiel tot 1,0 m diep (station en remsectie +1 m, lift tot +29 m, keerbocht +24 m, eerste val van 22 m, twee verticale loopings tot +18 en +17,5 m, de dubbele kurkentrekker tot +13 m, de helix van +1,8 tot +8 m) op een steunwand van 0,9 m met spitse openingen om de ~6 m (het vakwerk en de kolommen), met zware kolommen naast de loopings en onder de kurkentrekkers en een doorlopende voet onder de lage delen. Node building:station: het station (plat dak +8,1 m, rood zadeldak tot +9,6 m, aanbouw +4,4 m) met spitse nissen waar de trein in- en uitrijdt en de geluidsschermen langs de remsectie (+3,9 m). Onderkant op 0,5 m onder het maaiveld; de export zet onder de bovenkant van de loopings en kurkentrekkers een wig. Het station is geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
    realWorld: {
      lengthM: +(allBox.max[0] - allBox.min[0]).toFixed(1),
      widthM: +(allBox.max[1] - allBox.min[1]).toFixed(1),
      highestPointM: +allBox.max[2].toFixed(2),
      trackLengthM: +S.at(-1).toFixed(0),
      liftHeightM: 29,
      dropM: 22,
      loopTopsM: [LOOP1.zb + LOOP1.hh, LOOP2.zb + LOOP2.hh],
      corkscrewTopM: CS1.from[2] + 2 * CS1.r,
      trackWidthM: W,
      trackDepthM: H,
      stationRoofM: [8.1, 9.6],
      groundNapM: GROUND_NAP,
      baseM: BASE,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Python_(Efteling)",
      "https://en.wikipedia.org/wiki/Python_(Efteling)",
      "PDOK AHN DSM/DTM 0,5 m via WCS: ligging van de baandelen, hoogtes als maxima langs het pad, station en maaiveld",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR): tracé en volgorde van de elementen",
      "Wikimedia Commons, Category:Python (Efteling): lift, keerbocht, loopings, kurkentrekkers en station",
    ],
  },
});

// Ondervlakken per hoogte (waar de export een wig zet), alleen ter controle.
if (process.argv.includes("--parts")) {
  for (const p of baan.decompose()) {
    const b = p.boundingBox();
    const rd = (v) => [v[0] + ORIGIN[0], v[1] + ORIGIN[1], v[2]].map((c) => +c.toFixed(1));
    console.log("deel", +p.volume().toFixed(1), rd(b.min), rd(b.max));
  }
}
if (process.argv.includes("--down")) {
  for (const [name, m] of nodes) console.log(name, JSON.stringify(downFaces(m, BASE).filter((g) => g.area > 1)));
}
console.log(JSON.stringify({ trackPoints: N, trackLengthM: +S.at(-1).toFixed(1), supports: supports.length, triangles: report["building:baan"].triangles }));

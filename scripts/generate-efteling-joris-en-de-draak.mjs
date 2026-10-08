// Genereert een vereenvoudigd, gesloten 3D-model van Joris en de Draak in de
// Efteling (Kaatsheuvel, Ruigrijk): de houten racer-achtbaan van Great
// Coasters International uit 2010 (ontwerp Karel Willemen) met twee banen,
// Water en Vuur, van elk ca. 810 m. Het model bevat beide banen met hun
// houten draagconstructie, de twee lift-heuvels naast elkaar (top ca. 22 m
// boven het maaiveld), de twee keerbochten boven op de lift (Water linksom,
// Vuur rechtsom), de first drops tussen de lifts door en over het station,
// de grote bocht bij de Python, de twee keerbochten op palen in de
// Kanovijver, de terugweg onder de keerbochten door naar de eindremmen, de
// overkapte remise, het station (het Tuyghuys) en de draak Edna in haar
// vijvertje tussen de banen. Alle maten in meters op ware grootte.
//
//   node scripts/generate-efteling-joris-en-de-draak.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-joris-en-de-draak.mjs --scale 500
//
// Assenstelsel: oorsprong op RD (131780, 406490), midden tussen de twee
// lift-heuvels, op het maaiveld (NAP +9,0 m), Z omhoog, +X langs de lifts
// naar het oost-noordoosten (15,5° linksom van RD-oost, de richting van het
// station en de remise) en +Y 90° linksom daarop. Het script rekent de
// controlepunten in RD (oost, noord, NAP) om naar dat stelsel.
//
// Baan: per spoor een dichte band van 1,6 m breed en 0,8 m dik langs een
// Catmull-Rom-spline door de controlepunten (om de 1 m), in bochten gekanteld
// tot 55° (de keerbochten) met de binnenkant omlaag. Daaronder de houten
// draagconstructie als dichte vakwerkwand: bovenaan 1,0 m breed (de baan
// steekt 0,3 m uit), naar onderen per kant 0,12 m per meter breder, tot de
// vlakke onderkant; om de 4 m een portaal (bent) dat 0,45 m uitsteekt, en per
// vak en verdieping (ca. 4,2 m) vakwerkreliëf: een kruis van schoren en regels
// van 0,5 m met blinde nissen van 0,35 m diep in de driehoeken ertussen en
// een ruit in het bovenste vak (geen vlakke nisplafonds). Waar
// banen elkaar kruisen, lopen de wanden in elkaar over (zoals in het echte
// vakwerk); het hoogteverschil tussen de banen is daar minstens ca. 2,5 m.
// Station en remise zijn blokken met een flauw zadeldak, lisenen, blinde
// spitsboognissen en ronde drakenschilden; de draak is een romp op het water
// met een hals tot ca. 9 m boven het water en een kop met open bek.
//
// Printbaar op 1:1000: alle delen staan op de onderkant (NAP +7,3 m, onder
// het water van de Kanovijver op ca. NAP +7,9 m); de wanden lopen naar onderen
// uit, dus de export vult alleen de lip onder de baan, de dakranden, de
// drakenschilden en de kop van de draak op.
//
// Bronnen: PDOK luchtfoto 8 cm (tracé en gebouwen; let op: geen ware
// orthofoto, hoge delen staan ca. 0,3 m per meter hoogte naar het noorden
// verschoven, dus de ligging van lifts en keerbochten komt uit het AHN), AHN
// DSM/DTM 0,5 m (ligging van de lifts en keerbochten, hoogtes als maxima
// langs het pad, station- en remisedak, maaiveld en waterpeil),
// nl.wikipedia en Eftepedia (25 m hoog, 2 × 810 m, verloop van de rit: lifts
// aan weerskanten van het station, keerbochten, drop over het station,
// bocht bij de Python, doorgang door de lift, Vuur onder water door,
// keerbochten op de Kanovijver, finish, remise, bocht naar links het station
// in; draak van 9 m), OpenStreetMap (volgorde en verbindingen van de
// baandelen; ODbL) en Wikimedia Commons, Category:Joris en de Draak (lifts,
// keerbochten, palen in de vijver, station, draak). Geschat: de hoogte van
// alle baandelen die onder andere doorlopen (first drops op ca. 1,4 m boven
// het maaiveld, terugweg onder de keerbochten ca. 2 m), de railhoogte in
// station, remise en keerlus (3 m), de kanteling, de straal van de
// keerbochten (8,0 en 8,2 m; het AHN geeft 7,5–9,5 m), de breedte van het
// vakwerk, de gevelindeling van station en remise en de vorm van de draak.
// Station en remise zijn geen BAG-panden; er is dus geen PDOK-reconstructie
// die vervangen moet worden.
import { Manifold, box, gableRoof, hull, downFaces, ribbon, union, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [131780, 406490];
const THETA = (15.5 * Math.PI) / 180;
const X_AXIS = [+Math.cos(THETA).toFixed(5), +Math.sin(THETA).toFixed(5)];
const GROUND_NAP = 9.0;
const WATER_NAP = 7.9;
const BASE = +(7.3 - GROUND_NAP).toFixed(2); // -1,7 m: onder het water van de Kanovijver
const W = 1.6; // baanbreedte
const H = 0.8; // dikte van de baan
const WT = 1.0; // breedte van het vakwerk direct onder de baan
const SPLAY = 0.12; // verbreding van het vakwerk per kant per meter hoogte
const BENT = 4; // afstand tussen de portalen

// ---------- vectorhulp ----------
const add = (a, b) => a.map((c, i) => c + b[i]);
const sub = (a, b) => a.map((c, i) => c - b[i]);
const mul = (a, k) => a.map((c) => c * k);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const len = (a) => Math.hypot(...a);
const unit = (a) => mul(a, 1 / len(a));
const [C, S] = [Math.cos(THETA), Math.sin(THETA)];
// RD (oost, noord, NAP) → modelstelsel
const L = ([e, n, z]) => {
  const [dx, dy] = [e - ORIGIN[0], n - ORIGIN[1]];
  return [dx * C + dy * S, -dx * S + dy * C, z - GROUND_NAP];
};
// Lokaal stelsel van een gebouw dat in RD recht staat → modelstelsel.
const fromRdAxes = (m, [e, n]) => {
  const p = L([e, n, GROUND_NAP]);
  return m.rotate([0, 0, -15.5]).translate([p[0], p[1], 0]);
};

// ---------- tracé (RD oost, RD noord, NAP bovenkant rails) ----------
// Cirkelboog als controlepunten: middelpunt, straal, hoeken a0 → a1 (graden,
// linksom positief), hoogte z0 → z1.
const ring = ([cx, cy], r, a0, a1, z0, z1, step = 22) => {
  const n = Math.max(2, Math.floor(Math.abs(a1 - a0) / step) + 1);
  return Array.from({ length: n }, (_, k) => {
    const a = ((a0 + ((a1 - a0) * k) / (n - 1)) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a), z0 + ((z1 - z0) * k) / (n - 1)];
  });
};
// Water: noordelijk perron, noordelijke lift, keerbocht linksom, drop tussen
// de lifts en over het station, buitenste spoor van de grote bocht bij de
// Python, terug naar het westen en noordwaarts door de lift, langs de
// draak, keerbocht in het zuiden van de Kanovijver, diagonaal terug, onder
// de keerbochten door, eindremmen, remise (zuidelijk spoor), keerlus.
const WATER = [
  [131840, 406501.3, 12.0], [131823, 406496.9, 12.0], [131810, 406493.0, 12.3],
  [131800, 406489.8, 16.8], [131790, 406487.3, 21.3], [131780, 406485.0, 26.0], [131772, 406482.2, 30.5],
  [131766, 406479.8, 31.3], [131760, 406478.2, 31.2], [131752, 406478.3, 30.5], [131745, 406480.0, 29.8],
  ...ring([131736, 406477.2], 8.0, 45, 270, 29.2, 26.0),
  [131744, 406470.2, 25.6], [131751, 406472.4, 24.8], [131758, 406475.0, 23.0], [131766, 406477.4, 19.5], [131774, 406479.6, 15.8],
  [131782, 406481.9, 12.8], [131790, 406484.2, 10.8], [131797, 406486.4, 10.4], [131802, 406487.7, 11.4], [131806, 406488.9, 13.8],
  [131811, 406490.4, 16.8], [131816, 406491.9, 18.9], [131821, 406493.4, 20.0], [131830, 406495.8, 20.5], [131840, 406498.0, 20.5],
  [131848, 406499.6, 20.0], [131855, 406500.6, 19.4], [131861, 406499.0, 18.6], [131865.5, 406494.5, 17.8], [131867.8, 406488, 17.0],
  [131867.5, 406481, 16.2], [131864.5, 406476, 15.6], [131858, 406472.0, 15.3], [131849, 406471.2, 15.2], [131838, 406471.4, 15.2],
  [131826, 406471.6, 15.0], [131815, 406471.8, 14.7], [131808, 406473.0, 14.5], [131803, 406476.3, 14.4], [131800.5, 406481, 14.3],
  [131799.5, 406488, 14.0], [131797.8, 406495, 13.7], [131794.5, 406500.5, 13.5], [131789, 406504.4, 13.4], [131781, 406506.0, 13.3],
  [131772, 406506.2, 13.2], [131763, 406504.6, 12.8], [131755, 406504.0, 12.0], [131745, 406505.6, 13.6], [131735, 406508.6, 12.6],
  [131727, 406511.0, 12.0], [131720, 406516.5, 11.8], [131713, 406521.6, 11.8], [131706, 406522.9, 12.6], [131699, 406520.5, 14.0],
  [131692, 406517.9, 14.8], [131685.5, 406519.3, 14.5], [131681, 406524.5, 12.8], [131679.6, 406530.5, 12.0], [131681.5, 406536.6, 11.6],
  [131686.5, 406540.9, 11.2], [131693, 406542.3, 10.6], [131700, 406542.3, 10.6], [131706, 406540.6, 11.2], [131712, 406536.3, 12.0],
  [131721.5, 406529.9, 12.2], [131729.5, 406521.9, 12.0], [131736.3, 406514.7, 10.8], [131741.3, 406508.3, 10.4], [131743.6, 406500.5, 10.2],
  [131744.3, 406493, 10.6], [131743.3, 406485, 11.0], [131742.6, 406477, 11.0], [131743.2, 406470.5, 11.0], [131745.2, 406465, 11.0],
  [131748.6, 406460.2, 11.0], [131754, 406453.8, 11.2], [131760.5, 406447.3, 12.0], [131766, 406444.6, 12.8], [131772, 406444.5, 13.2],
  [131778, 406446.3, 13.3], [131790, 406451.8, 13.3], [131800, 406456.6, 13.2], [131808, 406459.8, 13.0],
  [131812, 406460.7, 12.2], [131830, 406461.8, 12.0], [131836, 406463.6, 12.0], [131841.5, 406467.6, 12.0], [131845.5, 406473.5, 12.0],
  [131848, 406480.5, 12.0], [131848.5, 406488, 12.0], [131847, 406494.5, 12.0], [131843.5, 406499.6, 12.0],
];
// Vuur: zuidelijk perron, zuidelijke lift, keerbocht rechtsom, drop, binnenste
// spoor van de grote bocht (twee keer over Water heen), diagonaal door de
// lift, onder Water door het vijvertje van de draak (onder water door),
// keerbocht in het noorden van de Kanovijver, diagonaal terug, eindremmen,
// remise (noordelijk spoor), keerlus.
const VUUR = [
  [131840, 406494.0, 12.0], [131823, 406489.4, 12.0], [131810, 406485.6, 12.3],
  [131800, 406482.0, 17.5], [131790, 406479.0, 21.8], [131780, 406476.0, 26.3], [131772, 406474.0, 30.8],
  [131766, 406472.3, 31.6], [131760, 406470.6, 31.3], [131755.5, 406468.6, 30.8], [131752, 406465.3, 30.2],
  ...ring([131742, 406458.0], 8.2, 20, -270, 30.0, 26.0),
  [131749, 406466.8, 25.5], [131756, 406469.6, 24.2], [131763, 406472.6, 22.0], [131770, 406476.0, 18.5], [131778, 406478.4, 14.8],
  [131786, 406480.6, 11.8], [131794, 406482.9, 10.4], [131799, 406484.3, 10.8], [131803, 406485.4, 12.2], [131808, 406486.9, 15.0],
  [131813, 406488.4, 17.6], [131818, 406489.9, 19.2], [131823, 406491.1, 20.1], [131830, 406492.6, 20.5], [131840, 406494.6, 20.4],
  [131848, 406495.6, 20.0], [131854, 406494.4, 19.4], [131858.6, 406490.6, 18.6], [131861, 406484.5, 17.8], [131860.8, 406478.5, 18.4],
  [131858.5, 406473.5, 18.5], [131853, 406468.4, 18.5], [131845, 406466.5, 18.5], [131837, 406467.8, 18.5], [131829, 406471.2, 18.2],
  [131820, 406475.4, 15.8], [131810, 406478.7, 12.6], [131803, 406480.5, 11.2], [131796, 406482.2, 12.6], [131790, 406485.5, 14.0],
  [131784, 406491.5, 13.6], [131779, 406497.0, 13.0], [131776, 406501.5, 11.5], [131768, 406507.0, 9.8], [131760, 406512.0, 9.0],
  [131752, 406515.3, 10.0], [131742, 406519.8, 10.8], [131734, 406524.2, 12.6], [131727, 406530.0, 14.3], [131721, 406536.3, 12.4],
  [131717.5, 406542.5, 10.5], [131715.5, 406549, 10.8], [131713.6, 406556, 11.3], [131710.6, 406561.8, 12.0], [131705, 406566.2, 12.8],
  [131698, 406569.0, 13.4], [131691.5, 406569.2, 13.4], [131686, 406566.2, 12.4], [131682.8, 406561.5, 12.2], [131682.4, 406555, 11.6],
  [131685, 406549.6, 11.6], [131690, 406546.0, 11.4], [131696, 406545.2, 10.9], [131703, 406544.6, 10.8], [131709, 406542.5, 11.4],
  [131714, 406539, 12.0], [131722.8, 406531.6, 12.2], [131730.8, 406523.4, 11.9], [131737.8, 406516.2, 10.8], [131743.4, 406509.4, 10.3],
  [131745.8, 406502.5, 10.2], [131746.8, 406495, 10.8], [131746.3, 406486, 11.0], [131745.8, 406477.5, 11.0], [131746.3, 406471, 11.0],
  [131748.2, 406465.8, 11.0], [131751.3, 406461.5, 11.0], [131756.5, 406455.5, 11.4], [131762, 406450.2, 12.2], [131767, 406447.8, 12.9],
  [131772, 406447.4, 13.3], [131778, 406449.3, 13.4], [131790, 406454.9, 13.4], [131800, 406459.6, 13.3], [131808, 406462.9, 13.0],
  [131812, 406463.8, 12.2], [131830, 406464.8, 12.0], [131834.5, 406466.2, 12.0], [131838.5, 406469.6, 12.0], [131841, 406475, 12.0],
  [131842.3, 406481, 12.0], [131842.3, 406487, 12.0], [131841.3, 406491.3, 12.0],
];

// Gesloten Catmull-Rom-spline door de controlepunten in het vlak, om de ≤ 1 m;
// de hoogte lineair tussen de controlepunten en daarna glad over ±5 m.
function trackPath(ctrl) {
  const P = ctrl.map(L);
  const n = P.length;
  const pts = [];
  const zs = [];
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [-1, 0, 1, 2].map((k) => P[(i + k + n) % n]);
    const m = Math.max(1, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1])));
    for (let j = 0; j < m; j++) {
      const t = j / m;
      const xy = [0, 1].map(
        (c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t * t + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t ** 3),
      );
      pts.push(xy);
      zs.push(p1[2] + (p2[2] - p1[2]) * t);
    }
  }
  const N = pts.length;
  const K = 5;
  const z = zs.map((_, i) => {
    let s = 0;
    for (let k = -K; k <= K; k++) s += zs[(i + k + N) % N];
    return s / (2 * K + 1);
  });
  // Kanteling uit de kromming in het vlak (over ±3 m), tot 55°.
  const curv = pts.map((_, i) => {
    const a = pts[(i - 3 + N) % N];
    const b = pts[i];
    const c = pts[(i + 3) % N];
    const ab = [b[0] - a[0], b[1] - a[1]];
    const bc = [c[0] - b[0], c[1] - b[1]];
    const cr = ab[0] * bc[1] - ab[1] * bc[0];
    const la = Math.hypot(...ab);
    const lb = Math.hypot(...bc);
    const lc = Math.hypot(c[0] - a[0], c[1] - a[1]);
    return (2 * cr) / (la * lb * lc || 1);
  });
  const bank = curv.map((_, i) => {
    let s = 0;
    for (let k = -3; k <= 3; k++) s += curv[(i + k + N) % N];
    const kappa = s / 7;
    return Math.sign(kappa) * Math.min((55 * Math.PI) / 180, Math.atan(12 * Math.abs(kappa)));
  });
  const path = pts.map(([x, y], i) => [x, y, z[i]]);
  path.push(path[0]);
  bank.push(bank[0]);
  return { path, bank };
}

// Raakvector, horizontale zijvector en gekantelde 'up' per punt.
function frames({ path, bank }) {
  const n = path.length;
  return path.map((p, i) => {
    const a = path[Math.max(0, i - 1)];
    const b = path[Math.min(n - 1, i + 1)];
    const t = unit(sub(b, a));
    const side = unit([-t[1], t[0], 0]); // links van de rijrichting
    // Bocht naar links (bank > 0): bovenkant kantelt naar links (binnenkant omlaag).
    const up = unit(add(mul([0, 0, 1], Math.cos(bank[i])), mul(side, Math.sin(bank[i]))));
    const s = unit(cross(t, up));
    const u = cross(s, t);
    return { p, t, side, s, u };
  });
}

// Baan als band, met de gekantelde 'up' per segment.
function trackRibbon(track, F) {
  const ups = F.map((f) => f.u);
  return ribbon(track.path, W, H, { up: (i) => unit(add(ups[i], ups[i + 1])) });
}

// Vakwerk: per stuk van ~2 m het omhulsel van de onderkant van de baan
// (1,0 m breed) en de verbrede voet op de onderkant, 2 cm overlappend. Om de
// BENT m een portaal (0,6 m dik, 0,45 m breder dan de wand). In elk vak
// tussen twee portalen op beide zijvlakken vakwerkreliëf: per verdieping
// (ca. 4,2 m, met een regel van 0,5 m ertussen) een kruis van schoren van
// 0,5 m breed; de vier driehoeken ertussen zijn blinde nissen van 0,35 m diep
// (in het bovenste vak een ruit, zodat geen nis een vlak plafond heeft: alle
// bovenranden lopen onder minstens 50° omhoog naar een punt).
const NICHE = 0.35;
const BRACE = 0.5;
function trestle(F) {
  const parts = [];
  const bents = [];
  const top = (f, half) => [1, -1].map((k) => add(sub(f.p, mul(f.u, H - 0.02)), mul(f.s, k * half)));
  const foot = (f, half) => [1, -1].map((k) => [f.p[0] + f.side[0] * k * half, f.p[1] + f.side[1] * k * half, BASE]);
  const halfBase = (f) => WT / 2 + SPLAY * (f.p[2] - H - BASE);
  for (let i = 0; i + 1 < F.length; i += 2) {
    const j = Math.min(i + 2, F.length - 1);
    const a = F[i];
    const b = F[j];
    const ext = (f, d) => ({ ...f, p: add(f.p, mul(f.t, d)) });
    const [a2, b2] = [ext(a, -0.02), ext(b, 0.02)];
    parts.push(hull([...top(a2, WT / 2), ...top(b2, WT / 2), ...foot(a2, halfBase(a)), ...foot(b2, halfBase(b))]));
  }
  // Booglengte langs de baan en interpolatie van positie, zijvector en wandtop.
  const cs = [0];
  for (let i = 1; i < F.length; i++) cs.push(cs[i - 1] + len(sub(F[i].p, F[i - 1].p)));
  const at = (sArc) => {
    let i = Math.max(0, Math.min(F.length - 2, cs.findIndex((c) => c > sArc) - 1));
    if (sArc >= cs.at(-1)) i = F.length - 2;
    const f = (sArc - cs[i]) / (cs[i + 1] - cs[i] || 1);
    const p = add(F[i].p, mul(sub(F[i + 1].p, F[i].p), f));
    const side = unit(add(mul(F[i].side, 1 - f), mul(F[i + 1].side, f)));
    return { p, side };
  };
  // Punt op het zijvlak (k = ±1) op booglengte sArc en hoogte z, met extra
  // uitwaartse verschuiving d.
  const onFace = (sArc, z, k, d) => {
    const { p, side } = at(sArc);
    const hw = WT / 2 + SPLAY * (p[2] - H - z) + d;
    return [p[0] + side[0] * k * hw, p[1] + side[1] * k * hw, z];
  };
  // Driehoek of veelhoek (u langs de baan, z) iets naar binnen verschoven
  // (inzet d) en als nis van NICHE diep uitgesneden.
  const inset = (poly, d) => {
    const c = poly.reduce((s, q) => [s[0] + q[0] / poly.length, s[1] + q[1] / poly.length], [0, 0]);
    // kleinste afstand van het midden tot een zijde
    let r = Infinity;
    poly.forEach((q, i) => {
      const n = poly[(i + 1) % poly.length];
      const e = [n[0] - q[0], n[1] - q[1]];
      r = Math.min(r, Math.abs((c[0] - q[0]) * e[1] - (c[1] - q[1]) * e[0]) / Math.hypot(...e));
    });
    if (r <= d + 0.15) return null;
    return poly.map((q) => [c[0] + ((q[0] - c[0]) * (r - d)) / r, c[1] + ((q[1] - c[1]) * (r - d)) / r]);
  };
  const niches = [];
  const addNiche = (s0, poly, k) => {
    const q = inset(poly, BRACE / 2);
    if (!q) return;
    niches.push(hull(q.flatMap(([u, z]) => [onFace(s0 + u, z, k, 0.3), onFace(s0 + u, z, k, -NICHE)])));
  };
  for (let s0 = 0; s0 + BENT <= cs.at(-1); s0 += BENT) {
    const a = at(s0);
    const fa = F[Math.max(0, cs.findIndex((c) => c >= s0))];
    if (a.p[2] - H - BASE >= 3) {
      const b = { ...fa, p: add(fa.p, mul(fa.t, 0.6)) };
      bents.push(hull([...top(fa, WT / 2 + 0.45), ...top(b, WT / 2 + 0.45), ...foot(fa, halfBase(fa) + 0.45), ...foot(b, halfBase(fa) + 0.45)]));
    }
    // Vak van s0 + 0,6 tot s0 + BENT; de laagste wandtop in het vak (met kanteling).
    let wallTop = Infinity;
    for (let i = 0; i < F.length; i++) {
      if (cs[i] < s0 - 0.5 || cs[i] > s0 + BENT + 0.5) continue;
      wallTop = Math.min(wallTop, F[i].p[2] - H - 0.5 * Math.abs(F[i].s[2]));
    }
    const zLow = 0.4;
    const zHigh = wallTop - 0.6;
    const avail = zHigh - zLow;
    if (avail < 1.4) continue;
    const n = Math.max(1, Math.round(avail / 4.2));
    const tierH = (avail + BRACE) / n;
    const h = tierH - BRACE;
    const w = Math.min(BENT - 0.6 - 0.6, h / 1.2);
    if (w < 1.0) continue;
    const uc = s0 + 0.3 + BENT / 2; // midden van het vak
    for (let t = 0; t < n; t++) {
      const z0 = zLow + t * tierH;
      const [L0, R0, zc, z1] = [-w / 2, w / 2, z0 + h / 2, z0 + h];
      for (const k of [1, -1]) {
        addNiche(uc, [[L0, z0], [R0, z0], [0, zc]], k); // onder
        addNiche(uc, [[L0, z0], [0, zc], [L0, z1]], k); // links
        addNiche(uc, [[R0, z0], [R0, z1], [0, zc]], k); // rechts
        addNiche(uc, [[0, zc], [w / 4, z0 + 0.75 * h], [0, z1], [-w / 4, z0 + 0.75 * h]], k); // ruit boven
      }
    }
  }
  const wall = union(parts).subtract(union(niches));
  return union([wall, ...bents]);
}

const tracks = [WATER, VUUR].map((ctrl) => {
  const tr = trackPath(ctrl);
  const F = frames(tr);
  return { tr, F, rib: trackRibbon(tr, F), sup: trestle(F) };
});
// Waar wanden elkaar overlappen ontstaan kleine ingesloten holtes (negatief
// volume na decompose); die laten we weg, zodat de baan één massief deel is.
const baan = Manifold.compose(
  union(tracks.flatMap((t) => [t.rib, t.sup]))
    .decompose()
    .filter((p) => p.volume() > 0),
);

// ---------- gebouwen ----------
// Blinde spitsboognis in een gevel: breedte w, hoogte tot het begin van de
// boog hv, diep d; de boog loopt onder 60° naar een punt. Lokaal: gevel in
// het vlak y = 0, de nis gaat in +y het gebouw in.
const archNiche = (w, hv, d, z0 = 0) => {
  const r = w / 2;
  const top = hv + r * Math.tan((60 * Math.PI) / 180);
  return hull([
    [-r, -0.05, z0], [r, -0.05, z0], [-r, d, z0], [r, d, z0],
    [-r, -0.05, hv], [r, -0.05, hv], [-r, d, hv], [r, d, hv],
    [0, -0.05, top], [0, d, top],
  ]);
};
// Rond drakenschild (r, 0,3 m dik) op een gevel in het vlak y = 0, naar −y.
const roundel = (r, zc) => Manifold.cylinder(0.3, r, r, 24).rotate([90, 0, 0]).translate([0, 0.02, zc]);

// Station (Tuyghuys): 15,5 m langs de sporen bij 18,5 m, gevels tot 7,0 m,
// flauw zadeldak tot 8,8 m met de nok langs de sporen (AHN: 16,0–17,4 m NAP
// aan de dakranden). Aan de vijverkant (+y) een galerij tot 3,6 m.
function station() {
  const [Lx, By, eave, ridge] = [15.5, 18.5, 7.0, 8.8];
  const parts = [box(-Lx / 2, -By / 2, BASE, Lx / 2, By / 2, eave), gableRoof(Lx + 0.6, By + 0.6, eave - 0.01, ridge)];
  // Galerij aan de vijverkant met een borstwering als blok.
  parts.push(box(-6.5, By / 2 - 0.05, BASE, 6.5, By / 2 + 1.6, 3.6));
  // Lisenen (0,4 m) om de 3,5 m op de lange gevels en op de kopgevels.
  for (const x of [-7.35, -3.6, 0, 3.6, 7.35]) {
    parts.push(box(x - 0.3, -By / 2 - 0.4, BASE, x + 0.3, -By / 2 + 0.05, eave));
    parts.push(box(x - 0.3, By / 2 - 0.05, BASE, x + 0.3, By / 2 + 0.4, eave));
  }
  for (const y of [-6, 0, 6]) {
    parts.push(box(-Lx / 2 - 0.4, y - 0.3, BASE, -Lx / 2 + 0.05, y + 0.3, eave));
    parts.push(box(Lx / 2 - 0.05, y - 0.3, BASE, Lx / 2 + 0.4, y + 0.3, eave));
  }
  // Drakenschilden boven de galerij en op de zuidgevel.
  for (const x of [-5.4, -1.8, 1.8, 5.4]) {
    parts.push(roundel(0.75, 5.4).rotate([0, 0, 180]).translate([x, By / 2, 0]));
    parts.push(roundel(0.75, 5.6).translate([x, -By / 2, 0]));
  }
  let solid = union(parts);
  // Toegangspoort in het midden van de zuidgevel (wachtrij), blinde
  // spitsboognissen ernaast, en nissen in de kopgevels waar de sporen in- en
  // uitrijden (railhoogte 3,0 m).
  const cuts = [archNiche(2.6, 3.2, 0.5).translate([0, -By / 2, 0])];
  for (const x of [-5.4, -1.8, 1.8, 5.4]) {
    if (Math.abs(x) > 2) cuts.push(archNiche(1.4, 2.2, 0.35, 0.6).translate([x, -By / 2, 0]));
  }
  for (const y of [-3.3, 3.3]) {
    cuts.push(archNiche(2.6, 2.4, 0.4, 3.0).rotate([0, 0, 90]).translate([Lx / 2, y, 0]));
    cuts.push(archNiche(2.6, 2.4, 0.4, 3.0).rotate([0, 0, -90]).translate([-Lx / 2, y, 0]));
  }
  solid = solid.subtract(union(cuts));
  return solid;
}
// Middelpunt van het station in RD (uit het AHN: hoeken ca. (131826, 406484),
// (131841, 406488), (131837, 406506,5) en (131822, 406502)).
const STATION_RD = [131831.5, 406495.1];
const stationSolid = (() => {
  const c = L([...STATION_RD, GROUND_NAP]);
  return station().translate([c[0], c[1], 0]);
})();

// Remise: RD 131811–131831 × 406457,5–406469,5, gevels tot 7,2 m, nok op
// 8,4 m langs RD-oost (AHN 16,1–17,4 m NAP). Open kopgevels waar de sporen
// in- en uitrijden, als spitse nissen van 1,2 m diep.
const remiseSolid = (() => {
  const [Lx, By, eave, ridge] = [20, 12, 7.2, 8.4];
  let m = union([box(-Lx / 2, -By / 2, BASE, Lx / 2, By / 2, eave), gableRoof(Lx + 0.6, By + 0.6, eave - 0.01, ridge)]);
  // Lisenen op de lange gevels.
  const ribs = [];
  for (let x = -Lx / 2 + 0.3; x <= Lx / 2; x += 4.9) {
    ribs.push(box(x - 0.3, -By / 2 - 0.35, BASE, x + 0.3, -By / 2 + 0.05, eave));
    ribs.push(box(x - 0.3, By / 2 - 0.05, BASE, x + 0.3, By / 2 + 0.35, eave));
  }
  m = union([m, ...ribs]);
  const cuts = [];
  // Sporen op RD-noord 406461,0 en 406464,5 → lokaal −2,5 en +1,0 ten opzichte van het midden (406463,5).
  for (const y of [-2.5, 1.0]) {
    cuts.push(archNiche(2.6, 2.6, 1.2, 3.0).rotate([0, 0, 90]).translate([Lx / 2, y, 0]));
    cuts.push(archNiche(2.6, 2.6, 1.2, 3.0).rotate([0, 0, -90]).translate([-Lx / 2, y, 0]));
  }
  return fromRdAxes(m.subtract(union(cuts)), [131821, 406463.5]);
})();

// ---------- draak Edna ----------
// Romp op het water van haar vijvertje tussen de banen (RD ca. 131753–131763,
// 406506–406510; het water ligt op NAP +7,9 m), hals schuin omhoog tot de kop
// op ca. 9 m boven het water, bek open naar het zuidoosten. Rugstekels als
// kleine piramides.
const sphere = (c, r) => Manifold.sphere(r, 16).translate(c);
const draakSolid = (() => {
  const w = WATER_NAP;
  const P = (e, n, z) => L([e, n, z]);
  const chain = (pts) => union(pts.slice(1).map((q, i) => hull([...sphereHull(pts[i]), ...sphereHull(q)])));
  const sphereHull = ([e, n, z, r]) => {
    const c = P(e, n, z);
    const out = [];
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4;
      out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), c[2]]);
      out.push([c[0] + 0.7 * r * Math.cos(a), c[1] + 0.7 * r * Math.sin(a), c[2] + 0.7 * r]);
      out.push([c[0] + 0.7 * r * Math.cos(a), c[1] + 0.7 * r * Math.sin(a), c[2] - 0.7 * r]);
    }
    out.push([c[0], c[1], c[2] + r], [c[0], c[1], c[2] - r]);
    return out;
  };
  // Romp en staart: van de onderkant tot ca. 1,6 m boven het water.
  const body = union([
    hull([...sphereHull([131754.5, 406509.2, w + 0.6, 1.3]), ...sphereHull([131758, 406508.4, w + 0.9, 1.7]), ...sphereHull([131760.6, 406507.6, w + 0.8, 1.4])]),
    chain([
      [131754.5, 406509.2, w + 0.4, 1.0],
      [131751.5, 406509.9, w + 0.2, 0.75],
      [131748.8, 406511.0, w + 0.1, 0.55],
    ]),
  ]);
  const plinth = hull([
    ...[[131753.5, 406508.4], [131761.5, 406506.4], [131762, 406508.3], [131754, 406510.4], [131748.2, 406511.4], [131748.6, 406510.2]].map(([e, n]) => P(e, n, w - 0.3)),
    ...[[131753.5, 406508.4], [131761.5, 406506.4], [131762, 406508.3], [131754, 406510.4], [131748.2, 406511.4], [131748.6, 406510.2]].map(([e, n]) => {
      const q = P(e, n, 0);
      return [q[0], q[1], BASE];
    }),
  ]);
  // Hals: van de romp schuin omhoog (helling ca. 15° uit het lood), 1,0 m dik.
  const neck = chain([
    [131760.6, 406507.6, w + 1.2, 0.95],
    [131761.4, 406507.0, w + 3.6, 0.85],
    [131762.0, 406506.6, w + 6.0, 0.8],
    [131762.4, 406506.4, w + 8.0, 0.8],
  ]);
  // Kop met open bek: bovenkaak en onderkaak als twee wiggen naar het zuidoosten.
  const head = union([
    hull([...sphereHull([131762.5, 406506.3, w + 8.6, 0.95]), ...sphereHull([131764.2, 406505.4, w + 8.8, 0.5])]),
    hull([...sphereHull([131762.5, 406506.3, w + 8.0, 0.7]), ...sphereHull([131764.0, 406505.5, w + 7.7, 0.45])]),
  ]);
  // Rugstekels en kraag van stekels achter de kop.
  const spikes = [];
  for (const [e, n, z] of [
    [131755.5, 406508.9, w + 1.9],
    [131757.3, 406508.5, w + 2.4],
    [131759.1, 406508.0, w + 2.1],
    [131761.7, 406507.6, w + 4.6],
    [131762.1, 406507.2, w + 6.8],
    [131762.3, 406507.2, w + 9.0],
  ]) {
    const c = P(e, n, z);
    spikes.push(hull([[c[0] - 0.4, c[1] - 0.4, c[2] - 0.4], [c[0] + 0.4, c[1] - 0.4, c[2] - 0.4], [c[0] + 0.4, c[1] + 0.4, c[2] - 0.4], [c[0] - 0.4, c[1] + 0.4, c[2] - 0.4], [c[0], c[1], c[2] + 0.6]]));
  }
  // Alles boven de onderkant.
  return union([plinth, body, neck, head, ...spikes]).intersect(box(-500, -500, BASE, 500, 500, 50));
})();

const gebouwen = union([stationSolid, remiseSolid]);
const nodes = [
  ["building:baan", baan],
  ["building:station", gebouwen],
  ["building:draak", draakSolid],
];

// ---------- catalogus ----------
const all = union(nodes.map(([, s]) => s));
const allBox = all.boundingBox();
const trackLen = tracks.map(({ tr }) => tr.path.slice(1).reduce((s, p, i) => s + len(sub(p, tr.path[i])), 0));
const topOf = (t) => Math.max(...t.tr.path.map((p) => p[2]));
// Op het maaiveld rond remise, eindremmen en het pad ten westen van de lifts
// (AHN-maaiveld 9,0–9,1 m NAP), niet in de vijvers of de lage wachtrij.
const GROUND_SAMPLES = [
  [131820, 406452],
  [131805, 406452],
  [131835, 406455],
  [131790, 406446],
  [131725, 406468],
].map(([e, n]) => L([e, n, GROUND_NAP]).slice(0, 2).map((v) => +v.toFixed(1)));

const report = await writeLandmark({
  slug: "efteling-joris-en-de-draak",
  base: BASE,
  nodes,
  catalog: {
    name: "Joris en de Draak (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: GROUND_SAMPLES,
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (131780, 406490), midden tussen de twee lift-heuvels, op het maaiveld (NAP +9,0 m), +X langs de lifts naar het oost-noordoosten (15,5° linksom van RD-oost), +Y 90° linksom daarop. Node building:baan: de twee banen Water en Vuur (elk ca. 790 m in het model) als dichte band van 1,6 m breed en 0,8 m dik, in bochten gekanteld tot 55°, op een dichte vakwerkwand (1,0 m breed onder de baan, per kant 0,12 m per meter breder naar onderen) met portalen om de 4 m en vakwerkreliëf per vak (kruisschoren en regels van 0,5 m, blinde nissen van 0,35 m diep): de lifts naast elkaar tot +22,6 m, de keerbochten boven op de lift (+17 tot +20 m), de drops tussen de lifts door (laagste punt +1,4 m) en over het station (+11,5 m), de grote bocht bij de Python, de doorgang door de lift, de keerbochten op palen in de Kanovijver (+1,6 tot +5,8 m) en de terugweg onder de keerbochten door naar de eindremmen (+4,3 m). Node building:station: het station (Tuyghuys, 15,5 × 18,5 m, gevels 7,0 m, nok 8,8 m, galerij aan de vijverkant, poort, spitsboognissen en drakenschilden) en de overkapte remise (20 × 12 m, nok 8,4 m). Node building:draak: de draak Edna in haar vijvertje, kop ca. 9 m boven het water. Onderkant op NAP +7,3 m (1,7 m onder het maaiveld, onder het water). Geen BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
    realWorld: {
      lengthM: +(allBox.max[0] - allBox.min[0]).toFixed(1),
      widthM: +(allBox.max[1] - allBox.min[1]).toFixed(1),
      highestPointM: +allBox.max[2].toFixed(2),
      highestPointNapM: +(allBox.max[2] + GROUND_NAP).toFixed(2),
      trackLengthWaterM: +trackLen[0].toFixed(0),
      trackLengthVuurM: +trackLen[1].toFixed(0),
      liftTopM: [+topOf(tracks[0]).toFixed(2), +topOf(tracks[1]).toFixed(2)],
      trackWidthM: W,
      trackDepthM: H,
      stationM: [15.5, 18.5, 8.8],
      remiseM: [20, 12, 8.4],
      dragonHeadAboveWaterM: +(draakSolid.boundingBox().max[2] + GROUND_NAP - WATER_NAP).toFixed(1),
      groundNapM: GROUND_NAP,
      waterNapM: WATER_NAP,
      baseM: BASE,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Joris_en_de_Draak",
      "https://www.eftepedia.nl/lemma/Joris_en_de_Draak",
      "PDOK AHN DSM/DTM 0,5 m via WCS: ligging van lifts en keerbochten, hoogtes als maxima langs het pad, station- en remisedak, maaiveld en waterpeil",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR): tracé van de lage baandelen, station, remise en draak (hoge delen ca. 0,3 m per meter hoogte naar het noorden verschoven)",
      "OpenStreetMap (ODbL), railway/roller_coaster-wegen: volgorde en verbindingen van de baandelen",
      "Wikimedia Commons, Category:Joris en de Draak: lifts, keerbochten, palen in de vijver, station, draak",
    ],
  },
});

if (process.argv.includes("--faces")) {
  for (const [name, s] of nodes) console.log(name, JSON.stringify(downFaces(s, BASE).filter((g) => g.area > 2)));
}
console.log(JSON.stringify({ trackLen: trackLen.map((v) => +v.toFixed(1)), tops: tracks.map(topOf), bbox: allBox }, null, 1));
void report;

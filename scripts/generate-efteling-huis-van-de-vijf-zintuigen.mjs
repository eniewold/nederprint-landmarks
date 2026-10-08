// Genereert een vereenvoudigd, gesloten 3D-model van het Huis van de Vijf
// Zintuigen, de hoofdingang van de Efteling (Kaatsheuvel, ontwerp Ton van de
// Ven, gebouwd 1995, geopend 1996): het entreegebouw met het rieten dak van
// 4500 m2 en de vijf punten die elk een zintuig voorstellen. Alle maten in het
// script zijn meters op ware grootte. Uitvoer via scripts/efteling-kit.mjs: een
// GLB in meters (Y omhoog, nodes `building:entreegebouw` en `building:winkel`),
// de catalogus-JSON en een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-efteling-huis-van-de-vijf-zintuigen.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-huis-van-de-vijf-zintuigen.mjs --scale 500
//
// Wat erin zit:
// - Het entreegebouw (node building:entreegebouw): het middenschip langs de
//   hoofdas met de doorgezakte nok tussen de twee spitsen (voorpunt boven de
//   ingang aan de parkeerkant op +32,2 m, achterpunt boven de glazen gevel aan
//   de parkkant op +27,2 m), en links en rechts de twee hoorns: holle kegels met
//   een eigen, naar buiten gekrulde punt (west +31,9 m, oost +28,4 m), elk met
//   twee rietbanden (de knik waar de steile kegel begint en de kraag onder de
//   donkere metalen punt). Alle rietvlakken zijn hol: de hoorns en de vijf
//   punten zijn "algemene kegels" (ringen die van de dakvoet naar de top
//   krimpen langs r(z) = r0 (1 - z/h)^2,2, paarsgewijs met hull() gesloten), het
//   schip is een zadeldak uit stroken met holle dwarsprofielen dat tussen de
//   punten doorzakt en naar de voorpunt hol opzwiept; schip en hoorns snijden
//   elkaar in de kilgoten op +12 a +13 m.
//   Onder de dakrand (+4,4 m) staan de witte muren 1 m terug op een kraag van
//   45 graden, met rondom blinde rondboognissen voor de arcade. Aan de voorkant
//   de ingang: een spitse opening onder de holle kap tot +19,7 m, 3 m diep, met
//   de houten "boom" (stam, drie paar takken) en het balkon; aan de achterkant
//   de glazen puntgevel met stijlen en een regel. De voorgevel en de glasgevel
//   hellen naar buiten (de punten hangen over de ingang heen).
// - De winkel (node building:winkel, BAG-pand 0809100000017169): de ronde winkel
//   aan de parkkant (muur r = 12,6 m, dakrand r = 13,5 m) met de holle rieten
//   kegel tot +25,2 m (de vijfde punt) en zeven oogvormige dakkapellen in twee
//   ringen, en de lage verbindingsvleugel (zadeldak, nok +10,9 m) met een
//   dakkapel aan de oostkant.
//
// Printbaar op 1:1000: alle punten hellen hooguit 26 graden over, de hoorns
// krullen binnen hun voet naar buiten, de dakranden rusten op een kraag van 45
// graden en de ingang is een spitse opening (hol plafond, overal steiler dan 46
// graden). Alleen de getrapte kraag (stappen van 0,2 m), de bovenkant van de
// rondboognissen (0,5 m diep) en de onderkant van de rietbanden geven kleine
// ondervlakken die de export opvult: +0,5 % volume op 1:1000, +0,3 % op 1:500.
//
// Assenstelsel: oorsprong op RD (131227,3, 406805,1), op het snijpunt van de
// hoofdas (van de achterpunt naar de voorpunt) met de lijn tussen de hoorns, op
// het maaiveld (NAP +8,9 m), Z omhoog. +X dwars op de hoofdas naar de oosthoorn
// (9,5 graden vanaf de RD-X-as, oost-noordoost), +Y langs de hoofdas naar de
// ingang aan de parkeerkant (noord-noordwest).
//
// Bronnen: AHN DSM/DTM 0,5 m (PDOK WCS): de vijf toppen (NAP +41,1 / +40,8 /
// +37,3 / +36,1 / +34,1 m), de dakrand rondom (stralen per 5 graden), de
// dwarsprofielen van het schip per 2 m, de profielen van de hoorns en de winkel,
// de verbindingsvleugel; maaiveld NAP +8,9 m (DTM); PDOK luchtfoto 8 cm
// (dakkapellen, nok, glasgevel); BAG-panden 0809100000017169 (winkel, 1994) en
// de kassa- en poorthuisjes 0809100000017876, -17878, -17880, -17882 en -17883
// (1994) onder het dak, die PDOK als kolommen tot in de nok reconstrueert;
// nl.wikipedia.org/wiki/Huis_van_de_Vijf_Zintuigen (4500 m2 riet, vijf punten,
// kassa's, gastenservice, winkel); Wikimedia Commons-foto's (Category:The House
// of the Five Senses) voor de ingang, de banden, de glasgevel, de muren met
// rondbogen en de dakkapellen.
// Geschat uit foto's: de dakrandhoogte (+4,4 m) en de muren 1 m terug, de
// ingangsopening (+19,7 m, 3 m diep), de holle kap aan de voorkant (p 0,5) en de boomconstructie, de glasgevel, de
// hoogtes van de rietbanden, de kromming van de punten, de plaats en maat van
// de nissen en dakkapellen. De punten zelf zijn het AHN-maximum; de dunne
// metalen pinnen kunnen in werkelijkheid een halve meter hoger reiken.
import {
  CrossSection,
  Manifold,
  box,
  ccw,
  check,
  downFaces,
  dome,
  hull,
  prism,
  ring3,
  union,
  writeLandmark,
} from "./efteling-kit.mjs";

// ---------- maten (lokaal stelsel, z = 0 op NAP +8,9 m) ----------
const deg = Math.PI / 180;
const ORIGIN = [131227.3, 406805.1];
const ANGLE = 9.5 * deg;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const BASE = -0.5;
const Z_EAVE = 4.4; // dakrand rondom
const KRAAG = 1.0; // muren 1 m terug, kraag van 45 graden
const Z_WALL = Z_EAVE - KRAAG;
const FRONT_LEAN = 0.0583; // voorgevel helt 1,4 m over op 24 m
const BACK_LEAN = 0.058; // glasgevel idem naar het zuiden
const frontAt = (z) => 17.6 + FRONT_LEAN * z;
const backAt = (z) => -19.7 - BACK_LEAN * z;

// Dakrand van het entreegebouw in het lokale stelsel (AHN-DSM, stralen per 5
// graden vanuit (-1, 0), drempel 3,2 m boven maaiveld; midden voor en achter
// op de gevels gezet in plaats van op de overhangende punten).
const OUTLINE = [
  [30.5, 0], [30.3, 2.7], [29.5, 5.4], [28.1, 7.8], [26.2, 9.9], [24.6, 12.0], [22.7, 13.7], [19.6, 14.5],
  [16.8, 14.9], [14.6, 15.6], [12.4, 15.9], [10.4, 16.3], [8.4, 16.5], [6.6, 16.9], [4.5, 17.3], [2.3, 17.55],
  [0, 17.6], [-2.3, 17.55], [-4.5, 17.3], [-6.6, 16.9], [-8.6, 16.4], [-10.2, 15.9], [-12.0, 15.7], [-14.2, 15.7],
  [-17.1, 16.0], [-19.8, 15.7], [-22.1, 14.8], [-24.4, 13.5], [-26.3, 11.8], [-27.7, 9.7], [-29.1, 7.5], [-30.0, 5.1],
  [-30.6, 2.6], [-30.5, 0], [-30.2, -2.6], [-29.6, -5.0], [-28.5, -7.4], [-26.9, -9.4], [-25.2, -11.3], [-23.1, -12.8],
  [-20.7, -13.8], [-18.5, -14.7], [-16.3, -15.3], [-14.2, -15.8], [-12.2, -16.1], [-10.5, -16.5], [-8.9, -16.9], [-7.4, -17.6],
  [-6.0, -18.6], [-4.5, -19.3], [-2.3, -19.65], [0, -19.7], [2.3, -19.65], [4.5, -19.3], [6.2, -18.6], [7.5, -17.7],
  [8.8, -16.9], [10.5, -16.4], [12.6, -16.2], [14.5, -15.6], [17.2, -15.2], [19.9, -14.6], [22.2, -13.4], [24.2, -11.7],
  [26.4, -10.0], [28.3, -7.8], [29.6, -5.4], [30.3, -2.7],
];

// ---------- hulpjes ----------
const lerp = (table, t) => {
  for (let i = 0; i + 1 < table.length; i++) {
    const [t0, f0] = table[i];
    const [t1, f1] = table[i + 1];
    if ((t <= t0 && t >= t1) || (t >= t0 && t <= t1)) return f0 + ((t - t0) / (t1 - t0)) * (f1 - f0);
  }
  return table[table.length - 1][1];
};
// Convex omhulsel in 2D (monotone keten), tegen de klok in.
const hull2 = (pts) => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper = [];
  for (const q of [...p].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
// Veelhoek verschoven (positief = naar buiten), afgeronde hoeken.
const offsetPoly = (pts, d) => new CrossSection([ccw(pts)]).offset(d, "Round", 2, 32).toPolygons()[0];
const offsetCs = (pts, d) => new CrossSection([ccw(pts)]).offset(d, "Round", 2, 32);
const prismCs = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
// Afschuiving voor de hellende gevels: v += k * z.
const shear = (m, k) =>
  m.warp((p) => {
    p[1] += k * p[2];
  });
// Prisma met een doorsnede in het (u, z)-vlak, van v0 tot v1.
const vPrism = (polyUZ, v0, v1) =>
  hull([...polyUZ.map(([u, z]) => [u, v0, z]), ...polyUZ.map(([u, z]) => [u, v1, z])]);
// Balk met vierkante doorsnede (breedte w in u, diepte d in v vanaf v0) tussen twee punten in het (u, z)-vlak.
const bar = ([u0, z0], [u1, z1], w, v0, d) =>
  hull(
    [
      [u0, z0],
      [u1, z1],
    ].flatMap(([u, z]) => [
      [u - w / 2, v0, z - w / 2],
      [u + w / 2, v0, z - w / 2],
      [u - w / 2, v0, z + w / 2],
      [u + w / 2, v0, z + w / 2],
      [u - w / 2, v0 + d, z - w / 2],
      [u + w / 2, v0 + d, z - w / 2],
      [u - w / 2, v0 + d, z + w / 2],
      [u + w / 2, v0 + d, z + w / 2],
    ]),
  );

// Algemene kegel: de voet (convexe veelhoek op hoogte zBase) krimpt naar de
// top; de ring op fractie t (1 = voet, 0 = top) ligt op apex + t * (voet - apex)
// op hoogte zBase + (top - zBase) * f(t). `curl` schuift de ringen van de
// spits naar binnen (tussen t = 0,4 en 0), zodat de punt naar buiten krult.
function generalCone({ base, apex, profile, zBase, curl = 0, inward = [0, 0], ts, round = 0 }) {
  const [ax, ay, az] = apex;
  const zAt = (t) => zBase + (az - zBase) * lerp(profile, t);
  // De voet per hoek rond zijn zwaartepunt bemonsterd (48 stralen), zodat de
  // ringen boven t = `round` geleidelijk rond worden (de steile kegel en de
  // spits zijn rond, de voet volgt de dakrand).
  const n = base.length;
  const bc = base.reduce((a, [x, y]) => [a[0] + x / n, a[1] + y / n], [0, 0]);
  const NA = 48;
  const rho = Array.from({ length: NA }, (_, k) => {
    const d = [Math.cos((2 * Math.PI * k) / NA), Math.sin((2 * Math.PI * k) / NA)];
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      const [px, py] = base[i];
      const [qx, qy] = base[(i + 1) % n];
      const ex = qx - px;
      const ey = qy - py;
      const den = d[0] * ey - d[1] * ex;
      if (Math.abs(den) < 1e-12) continue;
      const r = ((px - bc[0]) * ey - (py - bc[1]) * ex) / den;
      const s = ((px - bc[0]) * d[1] - (py - bc[1]) * d[0]) / den;
      if (r > 0 && s >= -1e-9 && s <= 1 + 1e-9) best = Math.min(best, r);
    }
    return best;
  });
  const rhoMean = Math.sqrt(rho.reduce((a, r) => a + r * r, 0) / NA);
  const ringAt = (t, grow = 0) => {
    const c = t < 0.4 ? curl * Math.sin((Math.PI * t) / 0.4) : 0;
    const m = round > 0 ? Math.min(1, Math.max(0, (round - t) / 0.3)) : 0;
    const cx = ax + t * (bc[0] - ax) + c * inward[0];
    const cy = ay + t * (bc[1] - ay) + c * inward[1];
    const pts = rho.map((r, k) => {
      const rr = t * ((1 - m) * r + m * rhoMean);
      return [cx + rr * Math.cos((2 * Math.PI * k) / NA), cy + rr * Math.sin((2 * Math.PI * k) / NA)];
    });
    return grow ? offsetPoly(pts, grow) : pts;
  };
  const tOfZ = (z) => {
    let lo = 0;
    let hi = 1;
    for (let k = 0; k < 40; k++) {
      const mid = (lo + hi) / 2;
      if (zAt(mid) > z) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  };
  const slabs = [];
  for (let i = 0; i < ts.length; i++) {
    const a = ring3(ringAt(ts[i]), zAt(ts[i]));
    const b = i + 1 < ts.length ? ring3(ringAt(ts[i + 1]), zAt(ts[i + 1])) : [apex];
    slabs.push(hull([...a, ...b]));
  }
  // Rietband: ring op hoogte z, `grow` naar buiten, onderkant van 45 graden of steiler.
  const band = (z, grow, under = 0.35, top = 0.12) =>
    hull([...ring3(ringAt(tOfZ(z - under)), z - under), ...ring3(ringAt(tOfZ(z), grow), z), ...ring3(ringAt(tOfZ(z + top), grow), z + top)]);
  return { solid: union(slabs), ringAt, zAt, tOfZ, band };
}

// Dakprofiel van de hoorns: hol, f(t) = 1 - t^(1/K) met K = 2,2 (dus
// r(z) = r0 (1 - z/h)^K): vanaf de dakrand eerst bijna vlak, dan steeds steiler
// naar de punt, als een tentdoek of een Thaise hoorn. Getoetst aan het AHN
// langs vier richtingen van de westhoorn: tussen t = 0,2 en 0,9 binnen 1,5 m;
// aan de rand meet het DSM 1 a 2 m hoger (de dikke rietrand in de randcellen)
// en bij de pin iets breder (cellen van 0,5 m); de foto's tonen het holle
// profiel.
const K_HORN = 2.2;
const HORN_TS = [1, 0.95, 0.9, 0.84, 0.77, 0.7, 0.62, 0.54, 0.47, 0.4, 0.34, 0.28, 0.23, 0.185, 0.145, 0.11, 0.08, 0.055, 0.035, 0.02, 0.01, 0.004];
const HORN_PROFILE = [...HORN_TS.map((t) => [t, 1 - t ** (1 / K_HORN)]), [0, 1]];
const SPIRE_PROFILE = [[1, 0], [0.8, 0.12], [0.6, 0.25], [0.42, 0.38], [0.28, 0.52], [0.16, 0.67], [0.08, 0.8], [0.03, 0.91], [0, 1]];
const SPIRE_TS = [1, 0.8, 0.6, 0.42, 0.28, 0.16, 0.08, 0.03];

// ---------- entreegebouw ----------
// Hoorns: de voet is het convexe omhulsel van de dakrand aan die kant plus twee
// punten in de lengteas (waar het schip de hoorn overneemt; de afstand van de
// top tot die punten volgt uit het oostprofiel van de westhoorn).
const W_APEX = [-25.1, -1.2, 31.9];
const E_APEX = [23.5, 1.3, 28.4];
const W_BASE = hull2([...OUTLINE.filter(([u]) => u < -6), [-1.1, 16.6], [-1.1, -17.6]]);
const E_BASE = hull2([...OUTLINE.filter(([u]) => u > 6), [3.5, 16.6], [3.5, -17.4]]);
const hornW = generalCone({ base: W_BASE, apex: W_APEX, profile: HORN_PROFILE, zBase: Z_EAVE, curl: 1.0, inward: [1, 0], round: 0.5, ts: HORN_TS });
const hornE = generalCone({ base: E_BASE, apex: E_APEX, profile: HORN_PROFILE, zBase: Z_EAVE, curl: 0.9, inward: [-1, 0], round: 0.5, ts: HORN_TS });
const hornBands = [
  hornW.band(14.5, 0.35),
  hornW.band(23.6, 0.25, 0.3, 0.1),
  hornE.band(13.7, 0.35),
  hornE.band(22.5, 0.25, 0.3, 0.1),
];

// Middenschip als zadeldak: per station langs de as een hol dwarsprofiel
// z(u) = 1 + (h - 1) (1 - (|u| / w)^p) met de nok h op u = 0 (p < 1: steil bij
// de nok, flauw naar de voet). De nok zakt tussen de punten door tot +18,9 m en
// zwiept naar voor- en achterpunt op. h, w en p per station uit de AHN-
// dwarsprofielen: in het midden licht hol (p 0,8; het DSM wijkt op u = 2 tot
// 10 m hooguit 1 m af, het AHN-profiel is daar bijna recht); aan de voorkant
// de holle kap van de foto's (p 0,5; het DSM ziet daar ook de overhellende
// punt en meet 4 m uit de nok tot 3 m hoger). Tussen twee stations is
// elke strook tussen twee knopen een eigen hull.
const NAVE = [
  // [v, nokhoogte h, halve breedte w (op +1 m), exponent p]
  [19.5, 26.0, 14, 0.5],
  [17.6, 26.5, 14, 0.5],
  [16, 27.0, 15, 0.55],
  [14, 27.4, 18, 0.6],
  [12, 25.9, 23, 0.75],
  [8, 23.4, 30, 0.8],
  [4, 21.4, 31, 0.8],
  [0, 19.9, 32, 0.8],
  [-4, 19.1, 32, 0.8],
  [-8, 18.9, 32, 0.8],
  [-12, 19.7, 30, 0.8],
  [-14, 20.9, 25, 0.8],
  [-16, 21.8, 16, 0.75],
  [-18, 23.6, 15, 0.8],
  [-19.7, 24.5, 13, 0.75],
  [-21.5, 24.0, 12, 0.75],
];
const naveZ = ([, h, w, p], u) => 1 + (h - 1) * (1 - Math.min(1, Math.abs(u) / w) ** p);
const NAVE_S = [0, 0.02, 0.06, 0.12, 0.2, 0.3, 0.42, 0.56, 0.72, 0.86, 1];
const naveCells = [];
for (let i = 0; i + 1 < NAVE.length; i++) {
  const [a, b] = [NAVE[i], NAVE[i + 1]];
  for (let j = 0; j + 1 < NAVE_S.length; j++) {
    for (const sg of [1, -1]) {
      const pts = [
        [a, NAVE_S[j]],
        [a, NAVE_S[j + 1]],
        [b, NAVE_S[j]],
        [b, NAVE_S[j + 1]],
      ].map(([st, s]) => [sg * s * st[2], st[0], naveZ(st, s * st[2])]);
      naveCells.push(hull([...pts, ...pts.map(([u, v]) => [u, v, BASE])]));
    }
  }
}
const naveRaw = union(naveCells);
// Dakprofiel in de voorgevel (station v 17,6) en de achtergevel (v -19,7).
const faceZ = (u) => naveZ(NAVE[1], u);
const backZ = (u) => naveZ(NAVE[14], u);
// Hellende voor- en achtergevel als halfruimten.
const halfSpace = (pts) => hull(pts.flatMap(([v, z]) => [[-40, v, z], [40, v, z]]));
const naveClip = halfSpace([
  [backAt(BASE - 1), BASE - 1],
  [frontAt(BASE - 1), BASE - 1],
  [frontAt(50), 50],
  [backAt(50), 50],
]);
const nave = naveRaw.intersect(naveClip);

// Voor- en achterpunt: holle algemene kegels vanuit een ellips diep in de kap,
// die naar buiten overhellen naar de AHN-top (hooguit 26 graden).
const ellipse = ([cu, cv], a, b, n = 24) => Array.from({ length: n }, (_, k) => [cu + a * Math.cos((2 * Math.PI * k) / n), cv + b * Math.sin((2 * Math.PI * k) / n)]);
const N_APEX = [0.15, 19.4, 32.2];
const S_APEX = [-0.04, -21.1, 27.2];
const spireN = generalCone({ base: ellipse([0, 14.8], 4.0, 3.4), apex: N_APEX, profile: SPIRE_PROFILE, zBase: 12.0, ts: SPIRE_TS });
const spireS = generalCone({ base: ellipse([0, -17.6], 3.2, 2.8), apex: S_APEX, profile: SPIRE_PROFILE, zBase: 13.0, ts: SPIRE_TS });

// Omhullende: binnen de dakrand, daaronder de muren 1 m terug met een
// getrapte kraag van 45 graden (stappen van 0,2 m; de export maakt er een
// schuine kraag van). In het midden voor en achter mag het schip tot zijn
// hellende gevels doorlopen.
const envelope = union([
  prismCs(offsetCs(OUTLINE, -KRAAG), BASE - 0.1, Z_EAVE),
  ...[1, 2, 3, 4, 5].map((k) => prismCs(offsetCs(OUTLINE, -KRAAG + 0.2 * k), Z_WALL + 0.2 * (k - 1), Z_WALL + 0.2 * k + 0.01)),
  prism(OUTLINE, Z_EAVE, 45),
  box(-5, -23, Z_EAVE, 5, 21, 45),
]);
const filler = prism(OUTLINE, BASE, Z_EAVE);
let main = union([filler, nave, hornW.solid, hornE.solid]).intersect(envelope);
main = union([main, spireN.solid, spireS.solid, ...hornBands]);

// Opening onder een hol dakprofiel: van zMin tot top(u), per strook tussen
// twee knopen een eigen hull, van v0 tot v1.
const archUnder = (top, us, zMin, v0, v1) => {
  const parts = [];
  for (let j = 0; j + 1 < us.length; j++) {
    for (const sg of [1, -1]) {
      const q = [
        [sg * us[j], zMin],
        [sg * us[j + 1], zMin],
        [sg * us[j + 1], top(us[j + 1])],
        [sg * us[j], top(us[j])],
      ];
      parts.push(vPrism(q, v0, v1));
    }
  }
  return union(parts);
};

// Ingang aan de parkeerkant: spitse opening onder de holle kap (rand 0,8 m
// horizontaal en 0,7 m verticaal onder het dakprofiel van de gevel), 3 m diep
// in de overhellende voorgevel; het plafond van de opening blijft overal
// steiler dan 46 graden.
const FRONT_DEPTH = 3.0;
const frontTop = (u) => faceZ(u + 0.8) - 0.7;
const frontRecess = shear(
  archUnder(frontTop, [0, 0.4, 1, 2, 3, 4.5, 6, 7.5, 9, 9.6], BASE - 1, 17.6 - FRONT_DEPTH, 17.6 + 3),
  FRONT_LEAN,
);
// De houten boom tegen de achterwand van de opening: stam, drie paar takken
// (steiler dan 50 graden) en het balkon met een kraag van 45 graden.
const vb = 17.6 - FRONT_DEPTH - 0.2; // achterwand (onafgeschoven)
const tree = shear(
  union([
    box(-0.55, vb, BASE, 0.55, vb + 1.2, frontTop(0.55) + 0.3),
    bar([0, 5.0], [3.6, 9.6], 0.6, vb, 0.9),
    bar([0, 5.0], [-3.6, 9.6], 0.6, vb, 0.9),
    bar([0, 9.5], [2.0, 14.0], 0.6, vb, 0.9),
    bar([0, 9.5], [-2.0, 14.0], 0.6, vb, 0.9),
    bar([0, 13.5], [0.9, 16.6], 0.6, vb, 0.9),
    bar([0, 13.5], [-0.9, 16.6], 0.6, vb, 0.9),
    hull([...ring3([[-2.6, vb], [2.6, vb], [2.6, vb + 1.8], [-2.6, vb + 1.8]], 5.2), ...ring3([[-2.6, vb], [2.6, vb], [2.6, vb + 1.0], [-2.6, vb + 1.0]], 4.4)]),
  ]),
  FRONT_LEAN,
);

// Glazen puntgevel aan de parkkant: 0,7 m diepe nis onder de holle kap van de
// achtergevel, boven de verbindingsvleugel, met drie stijlen en een schuine
// regel.
const GLASS_DEPTH = 0.7;
const glassTop = (u) => backZ(u + 0.8) - 0.8;
const GLASS_US = [0, 0.4, 1, 2, 3, 4, 5, 6, 6.6];
const glassRecess = shear(archUnder(glassTop, GLASS_US, 8.0, -19.7 - 3, -19.7 + GLASS_DEPTH), -BACK_LEAN);
const G0 = -19.65; // stijlen 5 cm achter het gevelvlak
const GB = -19.7 + GLASS_DEPTH + 0.1; // 0,1 m in de achterwand
const mullions = shear(
  union([
    box(-0.2, G0, 7.5, 0.2, GB, 22.5),
    box(-3.2, G0, 7.5, -2.8, GB, 16.5),
    box(2.8, G0, 7.5, 3.2, GB, 16.5),
    // Regel: schuin aflopend van de achterwand naar voren (45 graden), geen vlak ondervlak.
    hull([[-5, G0, 12.3], [5, G0, 12.3], [-5, GB, 12.3], [5, GB, 12.3], [-5, GB, 11.4], [5, GB, 11.4], [-5, G0, 12.25], [5, G0, 12.25]]),
  ]),
  -BACK_LEAN,
).intersect(shear(archUnder(glassTop, GLASS_US, 7.0, -25, -15), -BACK_LEAN));

// Rondboognissen in de muren onder de dakrand (de arcade), 3,2 m breed en
// hoog, 0,5 m diep, om de ~7,5 m langs de muur; niet bij de ingang en de
// verbindingsvleugel.
const archPoints = (w, zTop, n = 10) => {
  const r = w / 2;
  const zs = zTop - r;
  return [
    [-r, 0],
    [r, 0],
    ...Array.from({ length: n + 1 }, (_, k) => [r * Math.cos((Math.PI * k) / n), zs + r * Math.sin((Math.PI * k) / n)]),
  ];
};
const niche = ([px, py], [tx, ty], w, zTop, depth, z0 = 0) => {
  const nx = -ty;
  const ny = tx; // naar binnen bij een veelhoek tegen de klok in
  return hull(
    archPoints(w, zTop - z0).flatMap(([s, z]) =>
      [-0.4, depth].map((d) => [px + tx * s + nx * d, py + ty * s + ny * d, z + z0]),
    ),
  );
};
const wallLine = offsetPoly(OUTLINE, -KRAAG);
const wallNiches = [];
{
  const n = wallLine.length;
  let acc = 0;
  const step = 7.5;
  let next = 3;
  for (let i = 0; i < n; i++) {
    const a = wallLine[i];
    const b = wallLine[(i + 1) % n];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    while (next <= acc + len) {
      const s = (next - acc) / len;
      const p = [a[0] + s * (b[0] - a[0]), a[1] + s * (b[1] - a[1])];
      const t = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
      const skip = (Math.abs(p[0]) < 10.8 && p[1] > 10) || (Math.abs(p[0]) < 9.8 && p[1] < -12);
      if (!skip) wallNiches.push(niche(p, t, 3.2, 3.2, 0.5));
      next += step;
    }
    acc += len;
  }
}

main = main.subtract(union([frontRecess, glassRecess, ...wallNiches]));
main = union([main, tree, mullions]);

// ---------- winkel en verbindingsvleugel ----------
const SHOP = [0.2, -41.1];
const SHOP_WALL = 12.6;
const SHOP_EAVE = 13.5;
// Holle kegel (AHN-profiel r -> z) met de kraag van 45 graden onder de dakrand.
const SHOP_PROFILE = [
  [SHOP_WALL, BASE], [SHOP_WALL, Z_WALL], [SHOP_EAVE, Z_WALL + 0.9], [SHOP_EAVE, Z_EAVE], [13, 5.0], [12, 5.6],
  [11, 6.2], [10, 7.1], [9, 8.1], [8, 9.2], [7, 10.6], [6, 12.1], [5, 13.3], [4, 14.6], [3, 16.2], [2, 18.4],
  [1.2, 20.7], [0.6, 22.8], [0.25, 24.4], [0.05, 25.2],
];
const shopCone = dome(SHOP, SHOP_PROFILE, 64);
const coneZ = (r) => {
  const prof = SHOP_PROFILE.slice(3).map(([rr, z]) => [rr, z]);
  return lerp(prof, Math.min(Math.max(r, 0.05), SHOP_EAVE));
};
// Oogvormige dakkapellen: halve ellips als voorkant op straal rf, 3 m diep in
// het riet; een bovenring (oost, west, zuid) en een onderring (schuin).
const dormer = (angleDeg, rf, w, h) => {
  const c = Math.cos(angleDeg * deg);
  const s = Math.sin(angleDeg * deg);
  const z0 = coneZ(rf) - 0.1;
  const arc = Array.from({ length: 9 }, (_, k) => [(w / 2) * Math.cos((Math.PI * k) / 8), h * Math.sin((Math.PI * k) / 8)]);
  return hull(
    [rf, rf - 3].flatMap((r) =>
      arc.map(([t, z]) => [SHOP[0] + r * c - t * s, SHOP[1] + r * s + t * c, z0 + z]),
    ),
  );
};
const shopDormers = [
  ...[0, 180, 270].map((a) => dormer(a, 5.6, 2.2, 1.3)),
  ...[40, 140, 215, 325].map((a) => dormer(a, 10.3, 2.0, 1.6)),
];
// Ramen van de winkel als nissen in de muur (niet aan de kant van de vleugel).
const shopNiches = [];
for (let a = -60; a <= 240; a += 25) {
  if (a > 50 && a < 130) continue;
  const c = Math.cos(a * deg);
  const s = Math.sin(a * deg);
  shopNiches.push(niche([SHOP[0] + SHOP_WALL * c, SHOP[1] + SHOP_WALL * s], [-s, c], 2.4, 2.9, 0.35, 0.5));
}

// Verbindingsvleugel: zadeldak langs de as van v -16 (onder het entreegebouw)
// tot v -36 (in de kegel van de winkel), dakrand op +4,4 m, muren 1 m terug.
const NECK_W = 7.7;
const NECK_RIDGE = 10.9;
const neckSection = [[-NECK_W + KRAAG, BASE], [NECK_W - KRAAG, BASE], [NECK_W - KRAAG, Z_WALL], [NECK_W, Z_EAVE], [0, NECK_RIDGE], [-NECK_W, Z_EAVE], [-NECK_W + KRAAG, Z_WALL]];
const neck = vPrism(neckSection, -36, -16);
const slope = (NECK_RIDGE - Z_EAVE) / NECK_W;
const roofZ = (u) => NECK_RIDGE - slope * Math.abs(u);
// Lange dakkapel aan de oostkant (v -30 tot -24) met een flauwer dak.
const neckDormer = hull(
  [-30, -24].flatMap((v) => [
    [6.4, v, roofZ(6.4) - 0.2],
    [6.4, v, 7.0],
    [2.5, v, roofZ(2.5) + 0.1],
    [2.5, v, 7.0],
  ]),
);
const neckDormerWindows = box(6.1, -29.4, 5.75, 6.8, -24.6, 6.65);
const neckNiches = [-21.5, -26, -30.5].flatMap((v) => [
  niche([NECK_W - KRAAG, v], [0, 1], 3.0, 3.0, 0.5),
  niche([-NECK_W + KRAAG, v], [0, -1], 3.0, 3.0, 0.5),
]);

let shop = union([shopCone, ...shopDormers, neck, neckDormer]);
shop = shop.subtract(union([...shopNiches, ...neckNiches, neckDormerWindows]));

const nodes = [
  ["building:entreegebouw", main],
  ["building:winkel", shop],
];

check(nodes, BASE);
for (const [name, solid] of nodes) {
  const faces = downFaces(solid, BASE + 0.01).filter((f) => f.area > 0.5);
  console.log(name, "ondervlakken > 0,5 m2:", JSON.stringify(faces));
}

await writeLandmark({
  slug: "efteling-huis-van-de-vijf-zintuigen",
  nodes,
  base: BASE,
  catalog: {
    name: "Huis van de Vijf Zintuigen (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: [
      [-15, 19],
      [0, 21],
      [15, 19],
      [-14, -19],
      [14, -19],
      [-16, -41],
      [16, -41],
    ],
    replacesBuildings: [
      "NL.IMBAG.Pand.0809100000017169",
      "NL.IMBAG.Pand.0809100000017876",
      "NL.IMBAG.Pand.0809100000017878",
      "NL.IMBAG.Pand.0809100000017880",
      "NL.IMBAG.Pand.0809100000017882",
      "NL.IMBAG.Pand.0809100000017883",
    ],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (131227,3, 406805,1), op het snijpunt van de hoofdas met de lijn tussen de hoorns, op het maaiveld (NAP +8,9 m), +X dwars op de hoofdas naar de oosthoorn (9,5 graden vanaf de RD-X-as) en +Y langs de hoofdas naar de ingang aan de parkeerkant (noord-noordwest). Node building:entreegebouw: het rieten dak (61 x 37 m) met het middenschip tussen de voorpunt (+32,2 m) en de achterpunt boven de glasgevel (+27,2 m), de west- en oosthoorn (+31,9 en +28,4 m) met rietbanden, de muren met rondboognissen onder de dakrand (+4,4 m), de ingang met de houten boom en de glazen puntgevel; node building:winkel: de ronde winkel met de vijfde punt (+25,2 m) en dakkapellen en de verbindingsvleugel. Onderkant 0,5 m onder het maaiveld. Vervangt de PDOK-reconstructie van de winkel en van de kassa- en poorthuisjes onder het dak. Nodenaam klasse:label bepaalt de materiaalklasse.",
    realWorld: {
      opening: 1996,
      ontwerper: "Ton van de Ven",
      rietdakM2: 4500,
      lengteM: 74.3,
      breedteM: 61.1,
      dakrandM: Z_EAVE,
      voorpuntM: N_APEX[2],
      achterpuntM: S_APEX[2],
      westhoornM: W_APEX[2],
      oosthoornM: E_APEX[2],
      winkelpuntM: 25.2,
      nokSchipMinM: 18.9,
      winkelStraalM: SHOP_WALL,
      maaiveldNapM: 8.9,
    },
    sources: [
      "AHN DSM/DTM 0,5 m (PDOK WCS): toppen, dakrand, dwarsprofielen van schip, hoorns, winkel en vleugel",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR)",
      "BAG-panden 0809100000017169 (winkel) en 0809100000017876, -17878, -17880, -17882, -17883 (kassa- en poorthuisjes onder het dak) via PDOK BAG WFS; PDOK 3D-gebouwtegels",
      "nl.wikipedia.org/wiki/Huis_van_de_Vijf_Zintuigen",
      "Wikimedia Commons: Category:The House of the Five Senses",
    ],
  },
});

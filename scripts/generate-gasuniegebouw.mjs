// Gasuniegebouw (Concourslaan 17, Groningen; Alberts en Van Huut, geopend in
// april 1994): hoofdkantoor van de Gasunie, organische architectuur ("weinig
// rechte hoeken"), bijnaam de Apenrots. Een geknikte hoogbouwschijf van twee
// vleugels van 13 m breed rond een hogere kern, met schuin uitlopende glazen
// koppen, gevelkammen die naar de kern opzwaaien en bij de koppen in bolle
// kappen met een punt eindigen, schuine bakstenen steunberen,
// een glazen "stropdas" (de trappenhal) voor de westgevel van de kern en een
// laagbouw van zinken lessenaars- en schilddaken met een rand die rondom
// schuin afloopt. Voorbeeld per rij: generate-evoluon.mjs (aanpak
// primitieven), generate-forum-groningen.mjs (schuine vlakken) en de
// skylinemodellen op efteling-kit.mjs (generate-haagse-toren.mjs,
// generate-castalia.mjs, generate-cooltoren.mjs).
//
//   node scripts/generate-gasuniegebouw.mjs              # 1:1000 (standaard)
//
// Opbouw: benoemde bouwdelen met de maten als constanten; dakvlakken als
// planvergelijking boven een veelhoek, de schuine koppen en steunberen als
// geëxtrudeerde profielen; geen gestapelde DSM-lagen.
//
// Gebouwstelsel (= modelstelsel): oorsprong in de kern op RD (232800, 580010),
// z = 0 op NAP -0,85 m (maaiveld aan de zuidoostkant, AHN-DTM -0,8 tot -0,9;
// aan de westkant ligt het maaiveld op -0,1 tot -0,4, aan de oostkant op
// -1,2 tot -1,5), Z omhoog. +X loopt op 44,6 graden in RD langs de
// zuidwestvleugel naar de kern (naar het noordoosten), +Y naar het
// noordwesten (de entreezijde met de rotonde). De noordvleugel staat op 80,9
// graden in RD, dus 36,3 graden gedraaid ten opzichte van dit stelsel ("N-stelsel",
// zelfde oorsprong).
//
// Bronnen: BAG-pand 0014100010929941 (bouwjaar 1994), AHN DSM/DTM 0,5 m (PDOK
// WCS, AHN4; gevellijnen per vleugel met een lijnfit op de dakranden, de
// schuine koppen en steunberen uit doorsneden), 3D BAG LoD2.2 (TU Delft/3D
// geoinformatie, CC BY 4.0: dakhoogtes 67,0/68,4/76,05/81,85/70,8 en de
// dakvlakken van de laagbouw), Actueel_orthoHR (de toren staat er schuin op,
// zodat de oost- en zuidgevels en de kop te zien zijn), Wikipedia en
// Commons-foto's van alle kanten.
import { Manifold, CrossSection, box, prism, hull, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "gasuniegebouw";
const ORIGIN = [232800.0, 580010.0];
const AXIS_DEG = 44.6;
const N_DEG = 80.9;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = -0.85;
const BASE = -1.1; // NAP -1,95: onder het laagste maaiveld (-1,5 aan de oostkant)
const z = (nap) => nap - GROUND_NAP;
const rad = (d) => (d * Math.PI) / 180;
const [cA, sA] = [Math.cos(rad(AXIS_DEG)), Math.sin(rad(AXIS_DEG))];
const D = N_DEG - AXIS_DEG;
const [cD, sD] = [Math.cos(rad(D)), Math.sin(rad(D))];
// RD ten opzichte van ORIGIN -> modelstelsel.
const R = ([x, y]) => [x * cA + y * sA, -x * sA + y * cA];
// N-stelsel (langs de noordvleugel) -> modelstelsel.
const N = ([u, v]) => [u * cD - v * sD, u * sD + v * cD];
// Modelstelsel -> N-stelsel.
const toN = ([x, y]) => [x * cD + y * sD, -x * sD + y * cD];

const parts = [];
const cuts = [];

// ---------- hulpfuncties ----------
// Dakvlak: veelhoek met verticale wanden vanaf BASE tot het vlak z(X,Y) = a X + b Y + c (NAP).
const roofPlane = (poly, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, 140).trimByPlane([a / n, b / n, -1 / n], -(c - GROUND_NAP) / n);
};
// Lessenaarsdak: hoogte h0 (NAP) op punt p0, daalt met `slope` (m/m) in richting `dir`.
const monopitch = (poly, p0, dir, h0, slope) => {
  const l = Math.hypot(...dir);
  const [dx, dy] = [dir[0] / l, dir[1] / l];
  return roofPlane(poly, -slope * dx, -slope * dy, h0 + slope * (p0[0] * dx + p0[1] * dy));
};
// Profiel in het (X, Z)-vlak (Z in NAP), geëxtrudeerd over Y van y0 tot y1.
const profileX = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts.map(([x, n]) => [x, z(n)]))]), y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Profiel in het (W, Z)-vlak, W = afstand naar buiten vanaf een gevel op Y = yf
// (side +1: naar +Y, side -1: naar -Y), dikte t langs X rond xc.
const finProfile = (pts, xc, t, yf, side) => {
  let m = Manifold.extrude(new CrossSection([ccw(pts.map(([w, n]) => [w, z(n)]))]), t)
    .rotate([90, 0, 0]) // (w, -t, z)
    .rotate([0, 0, 90]); // (t, w, z)
  if (side < 0) m = m.mirror([0, 1, 0]);
  return m.translate([xc - t / 2, yf, 0]);
};
// Blinde nis in een gevel p->q (modelstelsel, buitennormaal `out`), s0..s1 langs
// de gevel vanaf p, NAP n0..n1, `depth` het vlak in en 1 m naar buiten.
const nicheAlong = (p, q, out, s0, s1, n0, n1, depth = 0.35) => {
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const d = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
  const pts = [];
  for (const s of [s0, s1]) for (const n of [n0, n1]) {
    const c = [p[0] + d[0] * s, p[1] + d[1] * s];
    pts.push([c[0] - out[0] * depth, c[1] - out[1] * depth, z(n)], [c[0] + out[0], c[1] + out[1], z(n)]);
  }
  return hull(pts);
};
const outward = (p, q, inside) => {
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
  let n = [(q[1] - p[1]) / len, -(q[0] - p[0]) / len];
  if (n[0] * (inside[0] - p[0]) + n[1] * (inside[1] - p[1]) > 0) n = n.map((c) => -c);
  return n;
};

// Gevelkam: de bovenkant van een lange gevel als wand van `t` m dik binnen de
// gevellijn Y = f(X) (side +1: gevel aan de +Y-kant), met een bovenrand die het
// profiel [[X, NAP], ...] volgt en een onderkant op `foot` (NAP). Zo zwaait de
// dakrand op naar de kern en naar de punten bij de koppen, zonder hoogtelagen.
const crest = (profile, f, side, t, foot, x0 = -Infinity, x1 = Infinity) => {
  const pts = profile.filter(([x]) => x >= x0 - 1e-9 && x <= x1 + 1e-9);
  const a = Math.max(x0, profile[0][0]);
  const b = Math.min(x1, profile[profile.length - 1][0]);
  const zAt = (x) => {
    for (let i = 0; i + 1 < profile.length; i++) {
      const [p0, n0] = profile[i];
      const [p1, n1] = profile[i + 1];
      if (x >= p0 && x <= p1) return n0 + ((n1 - n0) * (x - p0)) / (p1 - p0 || 1);
    }
    return profile[profile.length - 1][1];
  };
  const top = [[a, zAt(a)], ...pts.filter(([x]) => x > a + 1e-6 && x < b - 1e-6), [b, zAt(b)]];
  const poly = [[b, foot], [a, foot], ...top];
  const band = profileX(poly, -80, 80);
  const strip = [[a, f(a)], [b, f(b)], [b, f(b) - side * t], [a, f(a) - side * t]];
  return band.intersect(prism(strip, BASE, 140));
};
// Bolle kap: kwartellips van p0 (laag) naar p1 (top), eerst steil, dan vlak.
const cap = ([u0, n0], [u1, n1], k = 6) =>
  Array.from({ length: k + 1 }, (_, i) => {
    const t = (i / k) * (Math.PI / 2);
    return [u1 + (u0 - u1) * Math.cos(t), n0 + (n1 - n0) * Math.sin(t)];
  });
const sortX = (pts) => [...pts].sort((p, q) => p[0] - q[0]);

// ---------- verdiepingen en vensters ----------
// Verdiepingen van 3,6 m vanaf NAP 0,0 (vensterrijen op de foto's: 15 rijen
// tussen de laagbouw op +12 en het dak van de noordvleugel op +67). Vensters
// als dubbele ramen van 2,0 x 1,6 m op 3,3 m (13 per laag over de 42 m van de
// westgevel van de noordvleugel, foto RCE 20365637), blinde nissen van 0,35 m.
const PITCH = 3.6;
const floorNap = (k) => k * PITCH;
const WIN = { sill: 0.9, h: 1.6, w: 2.0, step: 3.3, depth: 0.35 };
// Ponsgevel: vensters tussen s0 en s1 op de gevel p->q, rijen tussen NAP lo en hi.
const punched = (p, q, inside, s0, s1, lo, hi) => {
  const out = outward(p, q, inside);
  const n = Math.floor((s1 - s0 - WIN.w) / WIN.step) + 1;
  if (n < 1) return;
  const start = (s0 + s1) / 2 - ((n - 1) * WIN.step) / 2;
  for (let k = 0; k < 40; k++) {
    const n0 = floorNap(k) + WIN.sill;
    const n1 = n0 + WIN.h;
    if (n0 < lo || n1 > hi) continue;
    for (let i = 0; i < n; i++) {
      const c = start + i * WIN.step;
      cuts.push(nicheAlong(p, q, out, c - WIN.w / 2, c + WIN.w / 2, n0, n1, WIN.depth));
    }
  }
};
// Glazen gevelvlak (de blauwe koppen en de stropdas): per laag een glasband van
// 2,6 m, 0,3 m diep, met 1,0 m borstwering ertussen.
const glassBands = (p, q, inside, s0, s1, lo, hi) => {
  const out = outward(p, q, inside);
  for (let k = 0; k < 40; k++) {
    const n0 = floorNap(k) + 0.6;
    const n1 = n0 + 2.6;
    if (n0 < lo || n1 > hi) continue;
    cuts.push(nicheAlong(p, q, out, s0, s1, n0, n1, 0.3));
  }
};

// ---------- zuidwestvleugel ----------
// Gevellijnen uit een lijnfit op de dakranden in het AHN (Y als functie van X):
// zuidoostgevel 45,3 graden, noordwestgevel 43,9 graden in RD; de vleugel is bij
// de kop 13,6 m en bij de kern 12,6 m breed. Dak +76,0 (3D BAG 76,05).
const SW = {
  se: (x) => -6.7 + 0.012 * x,
  nw: (x) => 5.75 - 0.012 * x,
  roof: 76.0,
  // De glazen kop loopt schuin naar buiten: dakrand op X -50,5, dan
  // (AHN-doorsnede over de hele breedte) -52,0 op +52, -54,0 op +29 en -56,5
  // op +15,5, waar hij in de laagbouw verdwijnt.
  end: [[-50.5, 76.0], [-52.0, 52.0], [-54.0, 29.0], [-56.5, 15.5]],
};
{
  const x0 = -57;
  const x1 = 6;
  const plan = [[x0, SW.se(x0)], [x1, SW.se(x1)], [x1, SW.nw(x1)], [x0, SW.nw(x0)]];
  const slab = prism(plan, BASE, z(SW.roof));
  const prof = profileX([[x0, GROUND_NAP + BASE - 1], [x1 + 1, GROUND_NAP + BASE - 1], [x1 + 1, 100], ...SW.end, [SW.end[3][0], GROUND_NAP + BASE - 1]].map(([x, n]) => [x, n]), -20, 20);
  parts.push(slab.intersect(prof));
  // Installatiestrook in het midden van het dak (3D BAG 79,6; AHN 80).
  parts.push(box(-36, -1.8, z(SW.roof) - 0.01, -15, 1.2, z(79.7)));
}

// ---------- noordvleugel (N-stelsel) ----------
// Gevels op 80,9 graden (lijnfit: 80,6 en 81,2), oostgevel V -2,2 en westgevel
// V 10,9 (13,1 m). Dak +67,0 (3D BAG 67,03; AHN 67,0 langs beide gevels), met
// in het midden de blauwe dakopbouw van V 2,5 tot 7,6 op +68,4 (3D BAG 68,42),
// bij U 41-45,5 verhoogd tot +69,2 (AHN 69,1-69,2).
const NV = {
  e: -2.2,
  w: 10.9,
  roof: 67.0,
  // Glazen kop: dakrand op U 55,5, dan 57,0 op +51, 59,0 op +29, 62,0 op +14 (AHN).
  end: [[55.5, 70], [57.0, 51.0], [59.0, 29.0], [62.0, 14.0]],
};
const nParts = [];
{
  const u0 = -2;
  const u1 = 62.5;
  const wing = prism([[u0, NV.e], [u1, NV.e], [u1, NV.w], [u0, NV.w]], BASE, z(NV.roof));
  const prof = profileX([[u0 - 1, GROUND_NAP + BASE - 1], [NV.end[3][0], GROUND_NAP + BASE - 1], ...[...NV.end].reverse(), [u0 - 1, 100]].reverse(), -10, 20);
  nParts.push(wing.intersect(prof));
  nParts.push(box(12, 2.5, z(NV.roof) - 0.01, 41.0, 7.6, z(68.4)));
  nParts.push(box(40.9, 2.5, z(NV.roof) - 0.01, 45.5, 7.6, z(69.2)));
}

// ---------- kern ----------
// Hoogste blok op de knik: dak +82,0 (3D BAG 81,84; AHN 82), met een
// dakrand tot +84,8 rondom (AHN 84-85) en een dwarsmuur op het dak.
// Hoekpunten uit het AHN (RD ten opzichte van ORIGIN): westhoek (-12,8; -3,0),
// noordwest (-9,8; 12,8), noordoost (5,5; 13,3), oost (9,0; 1,0); aan de
// zuidwestkant gaat hij over in de zuidwestvleugel op X -8.
const CORE_ROOF = 82.0;
const C1 = R([-12.8, -3.0]);
const C2 = R([-9.8, 12.8]);
const C3 = R([5.5, 13.3]);
const C4 = R([9.0, 1.0]);
const CORE = [[-8.0, SW.se(-8.0)], [6.0, SW.se(6.0)], C4, C3, C2, C1, [-8.0, SW.nw(-8.0)]];
parts.push(prism(CORE, BASE, z(CORE_ROOF)));
{
  const cs = new CrossSection([ccw(CORE)]);
  const inner = cs.offset(-0.9, "Miter", 2).toPolygons();
  parts.push(prism(CORE, z(CORE_ROOF) - 0.01, z(84.8)).subtract(Manifold.extrude(new CrossSection(inner), 10).translate([0, 0, z(CORE_ROOF)])));
  parts.push(box(-4.2, -6.4, z(CORE_ROOF) - 0.01, -3.2, 1.0, z(84.8)));
}
// Lagere oostpartij tussen de kern en de noordvleugel, dak +70,8 (3D BAG 70,80-70,89).
const ESTEP = [C4, R([12.8, 3.2]), R([15.5, 8.0]), R([11.5, 14.2]), R([5.0, 13.8])];
parts.push(prism(ESTEP, BASE, z(70.8)));

// ---------- gevelkammen, punten en kappen ----------
// De bovenkant van elke lange gevel uit het AHN als profiel langs de gevellijn
// (maximum per 0,5 m in een strook tot 2 m binnen de gevel), regelmatig
// gemaakt. De gevels zwaaien op naar de kern en lopen bij de koppen uit in een
// bolle kap met een spitse punt; daartussen staat een borstwering van 1-2 m.
// Kammen zijn 0,9 m dik, de kappen bij de punten 2,5 m.
const SW_NW = sortX([
  [-50.5, 77.6], [-48.6, 79.0], ...cap([-44.6, 77.9], [-47.0, 81.0]).slice(0, -1), [-47.0, 81.0],
  [-36.0, 78.2], [-31.0, 77.4], [-26.0, 76.8], [-16.0, 76.6], [-12.5, 76.8], [-11.0, 78.5],
]);
const SW_SE = sortX([
  [-50.5, 77.6], [-49.3, 78.6], ...cap([-45.2, 77.9], [-47.8, 82.0]).slice(0, -1), [-47.8, 82.0],
  [-40.0, 77.9], [-37.0, 77.9], [-36.2, 80.4], [-32.3, 80.2], [-31.3, 77.2], [-27.0, 76.7], [-12.0, 76.7], [-8.2, 78.0],
]);
parts.push(crest(SW_NW, SW.nw, 1, 0.9, SW.roof - 0.3));
parts.push(crest(SW_SE, SW.se, -1, 0.9, SW.roof - 0.3));
parts.push(crest(SW_NW, SW.nw, 1, 2.5, SW.roof - 0.3, -48.0, -44.6));
parts.push(crest(SW_SE, SW.se, -1, 2.5, SW.roof - 0.3, -48.8, -45.2));
// Noordvleugel (N-stelsel): bij de kern +69,2 (west) en een opgezet stuk tot
// +73 naast de oostpartij (oost), vlak +67,6-67,8, dan opzwaaiend tot een punt
// van +70,6 bij U 41,6 met een kap, en de hoekpunt van +70,2 bij de noordkop.
const N_W = sortX([
  [11.5, 69.2], [13.5, 68.2], [16.0, 67.6], [32.0, 67.6], [35.0, 67.9], [37.0, 68.4],
  ...cap([38.0, 68.8], [41.6, 70.6]).slice(1, -1), [41.6, 70.6], [42.6, 68.0], [52.8, 67.8], [54.6, 70.2], [55.5, 69.5],
]);
const N_E = sortX([
  [14.0, 69.2], [15.6, 73.0], [18.8, 72.6], [20.2, 68.0], [26.0, 67.5], [33.0, 67.8], [36.0, 68.5],
  ...cap([38.0, 69.2], [41.8, 70.4]).slice(1, -1), [41.8, 70.4], [43.0, 68.0], [55.5, 67.8],
]);
nParts.push(crest(N_W, () => NV.w, 1, 0.9, NV.roof - 0.3));
nParts.push(crest(N_E, () => NV.e, -1, 0.9, NV.roof - 0.3));
nParts.push(crest(N_W, () => NV.w, 1, 2.5, NV.roof - 0.3, 38.0, 42.6));
nParts.push(crest(N_E, () => NV.e, -1, 2.5, NV.roof - 0.3, 38.0, 43.0));
// Schuine bakstenen beren op de grens van de glazen kop, aan beide lange
// gevels: in het AHN een rug van 1,5 m breed die van de gevel tot circa 7 m
// naar buiten afloopt (noordvleugel U 46: +60 aan de gevel, +41 op 2 m, +13 op
// 6,5 m; zuidwestvleugel X -40,5: +70 op 1 m, +22 op 5 m). Ze eindigen onder de
// gevelkam; de punten staan in het AHN niet boven de beren maar bij de kappen.
const fin = (roof, baseNap) => [[-3, baseNap - 0.5], [7, baseNap - 0.5], [7, baseNap + 1.5], [3.5, 36], [1.2, roof - 8], [0, roof], [-3, roof - 0.3]];
parts.push(finProfile(fin(SW.roof, 13.0), -40.6, 1.4, SW.se(-40.6) + 0.3, -1));
parts.push(finProfile(fin(SW.roof, 13.0), -45.5, 1.4, SW.nw(-45.5) - 0.3, 1));
nParts.push(finProfile(fin(NV.roof, 11.5), 46.0, 1.4, NV.e + 0.3, -1));
nParts.push(finProfile(fin(NV.roof, 6.5), 46.0, 1.4, NV.w - 0.3, 1));

// ---------- stropdas (glazen trappenhal voor de westgevel van de kern) ----------
// Volgens Wikipedia een tientallen meters hoge scheve glazen gevel voor de
// trappenkolom. Foto RCE 20365637: schacht van 9 m breed vanaf de laagbouw tot
// de "knoop" bovenin met een V-insnijding, onderaan uitwaaierend tot het dak
// van de entreehal. Top +63,5 (AHN 63-65), uitsteek 3,0 m (geschat).
const TIE = (() => {
  const out = outward(C1, C2, [0, 0]);
  const len = Math.hypot(C2[0] - C1[0], C2[1] - C1[1]);
  const d = [(C2[0] - C1[0]) / len, (C2[1] - C1[1]) / len];
  const at = (s, w, nap) => [C1[0] + d[0] * s + out[0] * w, C1[1] + d[1] * s + out[1] * w, z(nap)];
  const c = 9.0; // midden langs de westgevel van de kern, vanaf de westhoek
  const block = (half, w, n0, n1) => [at(c - half, -1, n0), at(c + half, -1, n0), at(c - half, w, n0), at(c + half, w, n0), at(c - half, -1, n1), at(c + half, -1, n1), at(c - half, w, n1), at(c + half, w, n1)];
  const shaft = hull(block(4.5, 3.0, 12, 49));
  // Knoop: 11 m breed en 3,6 m uit, onderkant 45 graden ingesnoerd naar de schacht.
  const knot = hull([...block(4.5, 3.0, 48, 48), ...block(5.5, 3.6, 49.5, 63.5)]);
  const notch = hull([at(c - 2.2, -2, 64), at(c + 2.2, -2, 64), at(c, -2, 61.0), at(c - 2.2, 5, 64), at(c + 2.2, 5, 64), at(c, 5, 61.0)]);
  // Kraag: van de schacht op +30 uitwaaierend tot 17 m breed en 8 m uit op +12.
  const collar = hull([...block(4.5, 3.0, 30, 30), ...block(8.5, 8.0, 12, 12), ...block(8.5, 8.0, BASE + GROUND_NAP, BASE + GROUND_NAP)]);
  const solid = union([shaft, knot.subtract(notch), collar]);
  // Glasbanden per laag op de voorkant van de schacht en de knoop.
  const front = [at(0, 3.0, 0).slice(0, 2), at(18, 3.0, 0).slice(0, 2)];
  const bands = [];
  for (let k = 9; k < 17; k++) bands.push(nicheAlong(front[0], front[1], out, c - 3.8, c + 3.8, floorNap(k) + 0.6, floorNap(k) + 3.2, 0.3));
  return { solid, bands };
})();
parts.push(TIE.solid);
cuts.push(...TIE.bands);

// ---------- laagbouw ----------
// Onderbouw: de BAG-contour tot +6,5 (daktuin aan de oostkant, 3D BAG 6,1-6,5),
// met rondom een schuine rand van 45 graden tot +3,5 aan de gevel (3D BAG-vlakken
// van 2,8-5,7 m onder 41-45 graden).
const BAG = [
  [37.31, 54.38], [26.99, 64.75], [26.69, 64.83], [13.52, 60.57], [12.86, 64.41], [-1.99, 66.75], [-2.48, 63.15], [-3.63, 54.6],
  [-19.49, 49.7], [-21.17, 39.04], [-33.33, 19.17], [-36.89, 16.13], [-41.12, 15.47], [-43.03, 3.36], [-66.97, -20.57], [-68.18, -19.26],
  [-83.58, -25.68], [-88.64, -30.8], [-56.44, -62.98], [-54.46, -61.99], [-51.07, -68.66], [-47.85, -67.02], [-47.04, -68.62], [-18.53, -54.09],
  [-1.54, -45.44], [47.5, 3.46], [55.07, 26.47], [35.97, 45.54],
].map(R);
const PODIUM = 6.5;
{
  const ring = ccw(BAG);
  const wedges = [];
  for (let i = 0; i < ring.length; i++) {
    const p = ring[i];
    const q = ring[(i + 1) % ring.length];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (len < 2) continue;
    // Linksom doorlopen: de buitennormaal staat rechts van p->q.
    const o = [(q[1] - p[1]) / len, -(q[0] - p[0]) / len];
    const at = (r, w, n) => [r[0] + o[0] * w, r[1] + o[1] * w, z(n)];
    wedges.push(hull([at(p, 1, 2.5), at(q, 1, 2.5), at(p, 1, 8), at(q, 1, 8), at(p, -3.0, PODIUM), at(q, -3.0, PODIUM), at(p, -3.0, 8), at(q, -3.0, 8)]));
  }
  parts.push(prism(BAG, BASE, z(PODIUM)).subtract(union(wedges)));
}
// Westvleugel rond de zuidwestkop: schilddak met de nok op Y 20 van +17,3
// (X -62) tot +17,0 (X -33), goten op +12,8 (AHN 12-13; 3D BAG-vlakken 659, 643,
// 654, 713, 672: 11,8-18,3 onder 18-25 graden).
const WEST = { eave: 12.8, x0: -79, x1: -31, y0: -11, y1: 31.5 };
parts.push(
  hull([
    [WEST.x0, WEST.y0, z(WEST.eave)], [WEST.x1, WEST.y0, z(WEST.eave)], [WEST.x1, WEST.y1, z(WEST.eave)], [WEST.x0, WEST.y1, z(WEST.eave)],
    [WEST.x0, WEST.y0, BASE], [WEST.x1, WEST.y0, BASE], [WEST.x1, WEST.y1, BASE], [WEST.x0, WEST.y1, BASE],
    [-62, 20, z(17.3)], [-33, 20, z(17.0)],
  ]),
);
// Zuidoostvleugel langs de zuidwestvleugel (met het glazen atrium bij de knik):
// lessenaarsdak van +17,3 aan de gevel naar +13,0 op Y -21 (17 graden; 3D BAG
// 665/718/707: 17,6-22 graden).
parts.push(monopitch([[-50, -6], [-50, -21], [10, -21], [10, -6]], [0, -7], [0, -1], 17.3, 4.3 / 14));
// Lagere strook erlangs tot de rand: +8,0 naar +7,0 (AHN 7-8).
parts.push(monopitch([[-51, -20.9], [-51, -28], [36, -28], [36, -20.9]], [0, -21], [0, -1], 8.0, 1 / 7));
// Bij de knik draait het lessenaarsdak mee met de noordvleugel (N-stelsel):
// +15,5 aan de gevel naar +12,4 op V -14 (AHN).
parts.push(monopitch([[0, -1], [24, -1], [24, -14], [0, -14]].map(N), N([0, -3]), N([0, -1]), 15.5, 3.1 / 11));
// Noordoostblok (zeshoekig plat dak op de luchtfoto): +13,0 aan de gevel naar
// +10,0 op V -26 (AHN; 3D BAG 729: 8,8-13,6).
parts.push(monopitch([[46, -2.0], [61.9, -2.0], [68.2, -16.4], [59.6, -28.2], [46, -28]].map(N), N([0, -2]), N([0, -1]), 13.0, 3 / 24));
// Westkant van de noordvleugel: lessenaarsdak van +11,5 naar +9,0 (AHN 9-11; 3D BAG 715/734).
parts.push(monopitch([[-12, 20], [18, 20], [18, 34], [13.7, 35.9], [-12, 36]].map(N), N([0, 20]), N([0, 1]), 11.5, 2.5 / 16));
// Tussen de westvleugel en de entreehal: +11,0 naar +10,0 (AHN 10-11).
parts.push(monopitch([[-31, 6], [-14, 6], [-14, 30], [-31, 30]], [0, 6], [0, 1], 11.0, 1 / 24));
// Entreehal op de knik aan de westkant (glas: geen AHN-punten): dak oplopend
// van +10 aan de buitenkant naar +18 tegen de toren (geschat; 3D BAG 709 tot 19,3).
{
  const HALL = [[-30, -7], [-30, 12], [-25, 21], [-9, 21], [-9.5, 13], [-12.8, -3], [-16, -8.5]].map(R);
  // z = 18 + 0,44 (x_RD + 12), x_RD = X cos A - Y sin A
  parts.push(roofPlane(HALL, 0.44 * cA, -0.44 * sA, 18 + 0.44 * 12));
}
// Entreeluifel aan de rotonde (foto "Gasunie Luifel"): dikke koperen plaat van
// 10 x 7 m op vier gemetselde pijlers, bovenkant +6,3, onderkant met een kraag
// van 45 graden.
{
  const c = [-25.5, 36.0];
  const ang = Math.atan2(7.0, 9.6);
  const e = [Math.cos(ang), Math.sin(ang)];
  const o = [-e[1], e[0]];
  const P = (a, b, n) => [c[0] + e[0] * a + o[0] * b, c[1] + e[1] * a + o[1] * b, z(n)];
  parts.push(hull([P(-5, -4, 6.3), P(5, -4, 6.3), P(5, 3.5, 6.3), P(-5, 3.5, 6.3), P(-5, -4, 4.8), P(5, -4, 4.8), P(3.5, 2.0, 4.8), P(-3.5, 2.0, 4.8)]));
  for (const [a, b] of [[-3.8, 1.2], [3.8, 1.2], [-3.8, -3], [3.8, -3]]) parts.push(hull([P(a - 0.6, b - 0.6, -2), P(a + 0.6, b - 0.6, -2), P(a + 0.6, b + 0.6, -2), P(a - 0.6, b + 0.6, -2), P(a - 0.6, b - 0.6, 5), P(a + 0.6, b - 0.6, 5), P(a + 0.6, b + 0.6, 5), P(a - 0.6, b + 0.6, 5)]).intersect(box(-200, -200, BASE, 200, 200, 50)));
}

// ---------- gevels ----------
// Zuidwestvleugel, noordwestgevel: ponsgevel tussen de steunbeer en de kern,
// glazen kop tussen de beer en de kopgevel.
{
  const p = [-56, SW.nw(-56)];
  const q = [0, SW.nw(0)];
  const ins = [-30, 0];
  punched(p, q, ins, -44.6 - p[0], -12.5 - p[0], 18.8, SW.roof - 1.4);
  glassBands(p, q, ins, -50.3 - p[0], -46.4 - p[0], 18.0, SW.roof - 0.8);
}
// Zuidoostgevel: idem, langs de kern door tot de oostpartij.
{
  const p = [-56, SW.se(-56)];
  const q = [8, SW.se(8)];
  const ins = [-30, 0];
  punched(p, q, ins, -40.1 - p[0], -9.0 - p[0], 18.0, SW.roof - 1.4);
  punched(p, q, ins, -7.0 - p[0], 5.5 - p[0], 18.0, CORE_ROOF - 1.4);
  glassBands(p, q, ins, -50.3 - p[0], -41.9 - p[0], 18.0, SW.roof - 0.8);
}
// Glazen zuidwestkop: banden die het schuine profiel volgen.
{
  const [a, b] = [SW.nw(-56) - 0.6, SW.se(-56) + 0.6];
  const uAt = (n) => {
    const e = SW.end;
    for (let i = 0; i + 1 < e.length; i++) {
      const [x0, n0] = e[i];
      const [x1, n1] = e[i + 1];
      if (n <= n0 && n >= n1) return x0 + ((x1 - x0) * (n - n0)) / (n1 - n0);
    }
    return e[e.length - 1][0];
  };
  for (let k = 5; k < 21; k++) {
    const n0 = floorNap(k) + 0.6;
    const n1 = n0 + 2.6;
    if (n0 < 17.0 || n1 > SW.roof - 0.8) continue;
    const pts = [];
    for (const [n, x] of [[n0, uAt(n0)], [n1, uAt(n1)]]) for (const y of [a, b]) pts.push([x + 0.3, y, z(n)], [x - 1.5, y, z(n)]);
    cuts.push(hull(pts));
  }
}
// Noordvleugel (N-stelsel).
const nCuts = [];
{
  const nPunched = (p, q, ins, s0, s1, lo, hi) => {
    const before = cuts.length;
    punched(p, q, ins, s0, s1, lo, hi);
    nCuts.push(...cuts.splice(before));
  };
  const nGlass = (p, q, ins, s0, s1, lo, hi) => {
    const before = cuts.length;
    glassBands(p, q, ins, s0, s1, lo, hi);
    nCuts.push(...cuts.splice(before));
  };
  const ins = [30, 4];
  // Westgevel: boven de entreehal (U < 18) vanaf +19, verder vanaf de onderbouw.
  nPunched([0, NV.w], [60, NV.w], ins, 12.5, 18.0, 19.5, NV.roof - 1.4);
  nPunched([0, NV.w], [60, NV.w], ins, 18.0, 45.1, 8.0, NV.roof - 1.4);
  nGlass([0, NV.w], [60, NV.w], ins, 46.9, 55.3, 8.0, NV.roof - 0.8);
  // Oostgevel: boven het lessenaarsdak bij de knik vanaf +16, boven de daktuin vanaf +8.
  nPunched([0, NV.e], [60, NV.e], ins, 16.5, 24.0, 16.5, NV.roof - 1.4);
  nPunched([0, NV.e], [60, NV.e], ins, 24.0, 45.1, 14.0, NV.roof - 1.4);
  nGlass([0, NV.e], [60, NV.e], ins, 46.9, 55.3, 14.0, NV.roof - 0.8);
  // Glazen noordkop.
  const uAt = (n) => {
    const e = NV.end;
    for (let i = 0; i + 1 < e.length; i++) {
      const [x0, n0] = e[i];
      const [x1, n1] = e[i + 1];
      if (n <= n0 && n >= n1) return x0 + ((x1 - x0) * (n - n0)) / (n1 - n0);
    }
    return e[e.length - 1][0];
  };
  for (let k = 4; k < 19; k++) {
    const n0 = floorNap(k) + 0.6;
    const n1 = n0 + 2.6;
    if (n0 < 15.0 || n1 > NV.roof - 0.8) continue;
    const pts = [];
    for (const [n, x] of [[n0, uAt(n0)], [n1, uAt(n1)]]) for (const y of [NV.e + 0.6, NV.w - 0.6]) pts.push([x - 0.3, y, z(n)], [x + 1.5, y, z(n)]);
    nCuts.push(hull(pts));
  }
}
// Kern: noordgevel boven de noordvleugel, twee vensterrijen onder de dakrand.
const elen = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
punched(C2, C3, [0, 0], 2.0, elen(C2, C3) - 2.0, 72.0, 80.6);
// Oostpartij en kern aan de oostkant (foto vanaf het Vrijheidsplein): ponsgevels
// boven het lessenaarsdak bij de knik, de kern boven de oostpartij.
for (let i = 0; i < 3; i++) punched(ESTEP[i], ESTEP[i + 1], [5, 5], 1.6, elen(ESTEP[i], ESTEP[i + 1]) - 1.6, 16.5, 70.8 - 1.4);
punched(C4, C3, [0, 0], 1.6, elen(C4, C3) - 1.6, 72.0, 80.6);

// ---------- samenstellen ----------
const north = union(nParts).subtract(union(nCuts)).rotate([0, 0, D]);
let model = union([...parts, north]).subtract(union(cuts));
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Gasuniegebouw geknikte schijf met kern glazen koppen gevelkammen steunberen stropdas en laagbouw", model]],
  catalog: {
    name: "Gasuniegebouw",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Maaiveld aan de zuidoostkant (AHN-DTM NAP -0,83 tot -0,92); de lader
    // neemt de laagste. Aan de westkant ligt het maaiveld hoger (-0,1 tot -0,4)
    // en bedekt het de voet.
    groundSamplePoints: [[-20, -35], [0, -35], [40, -33]],
    replacesBuildings: ["NL.IMBAG.Pand.0014100010929941"],
    description:
      "Oorsprong in de kern op RD (232800, 580010), z = 0 op NAP -0,85 m (maaiveld zuidoost), +X op 44,6 graden in RD langs de zuidwestvleugel naar de kern, +Y naar het noordwesten (entree); geknikte schijf van twee vleugels van 13 m breed (zuidwest tot +76,0, noord op 80,9 graden tot +67,0 met dakopbouw +68,4/+69,2) rond een kern tot +82,0 met dakrand tot +84,8 en een oostpartij op +70,8, schuin uitlopende glazen koppen, gevelkammen die naar de kern opzwaaien en bij de koppen uitlopen in bolle kappen met punten (+81 en +82 zuidwest, +70,4 tot +70,6 noord), schuine steunberen, de glazen stropdas tot +63,5 voor de kern, ponsgevels met vensters per laag van 3,6 m en een laagbouw van lessenaars- en schilddaken (+10 tot +17,3) op een onderbouw tot +6,5 met een schuine rand; hoogtes uit AHN en 3D BAG, vensterritme, stropdas, luifel en entreehal uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      groundWestNapM: -0.3,
      groundEastNapM: -1.4,
      coreRoofNapM: CORE_ROOF,
      coreParapetNapM: 84.8,
      eastStepNapM: 70.8,
      southwestWingRoofNapM: SW.roof,
      northWingRoofNapM: NV.roof,
      northWingRoofStripNapM: [68.4, 69.2],
      crestPeaksNapM: { southwestSE: 82.0, southwestNW: 81.0, northW: 70.6, northE: 70.4, northCorner: 70.2, northEastBump: 73.0 },
      tieTopNapM: 63.5,
      lowRoofsNapM: [6.5, 17.3],
      wingWidthM: 13.1,
      storeyPitchM: PITCH,
      axisDegrees: AXIS_DEG,
      northWingAxisDegrees: N_DEG,
      estimates: [
        "verdiepingshoogte 3,6 m en vensters van 2,0 x 1,6 m op 3,3 m uit de vensterrijen op de foto's; het werkelijke verspringende patroon is regelmatig gemaakt",
        "glazen koppen als banden per laag; het profiel van de schuine koppen uit AHN-doorsneden",
        "steunberen: positie en uitloop uit het AHN (noordvleugel U 46, zuidwestvleugel X -40,6 en -45,5)",
        "gevelkammen: profiel uit het AHN (maximum per 0,5 m binnen de gevel), regelmatig gemaakt; bolle vorm en dikte van de kappen bij de punten uit de foto's, hoogte begrensd door het AHN",
        "stropdas: breedte, uitsteek en knoop uit de frontale foto RCE 20365637, top uit het AHN",
        "entreehal (glas, geen AHN-punten) en luifel uit foto's en de luchtfoto",
        "laagbouw: dakvlakken regelmatig gemaakt uit AHN en 3D BAG; onderbouw op +6,5 met een rand van 45 graden",
      ],
    },
    sources: [
      "PDOK BAG pand 0014100010929941 (bouwjaar 1994), AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010929941 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes van kern, vleugels en oostpartij en de dakvlakken van de laagbouw",
      "https://nl.wikipedia.org/wiki/Gasuniegebouw (Alberts en Van Huut, 1994, organische architectuur, 18 verdiepingen, trappenkolom achter een scheve glazen gevel)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_-_Groningen_-_20365637_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Overzicht_voorgevel_-_Groningen_-_20365462_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Gasuniegebouw_Groningen.jpg",
      "https://commons.wikimedia.org/wiki/File:Gasuniegebouw.jpg",
      "https://commons.wikimedia.org/wiki/File:20090623_Gasuniegebouw_Groningen_NL.jpg",
      "https://commons.wikimedia.org/wiki/File:6043_Gasunie.Rotonde.VrijheidsPlein.Aanpak.Zuidring.Ring.Zuid.Plan.west.jpg",
      "https://commons.wikimedia.org/wiki/File:Gasunie,_Groningen_(2012).jpg",
      "https://commons.wikimedia.org/wiki/File:Gasunie_Luifel.jpg",
      "https://commons.wikimedia.org/wiki/File:20080129_Gasuniegebouw_Groningen_NL.jpg",
    ],
  },
});

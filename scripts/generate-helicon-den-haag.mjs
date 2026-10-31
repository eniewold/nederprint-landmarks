// Helicon (Turfmarkt / Parnassusplein, Den Haag, 1998, Soeters Van Eldonk): kantoor van het ministerie
// van VWS naast Castalia. Drie slanke torens van baksteen (15 verdiepingen, dak +57,6 m) staan dwars op
// de Turfmarkt en zijn verbonden door laagbouw van zes lagen met tussen de torens een glazen tongewelf.
// Aan de Turfmarkt trappen de torens in vier treden van twee lagen terug, elke trede met een witte
// natuurstenen lijst; op het dak een plat tongewelf, en op een lijn over elke toren vijf witte naalden
// boven een strook witte lisenen op de lange gevels.
// Contour uit de BAG, hoogtes uit de 3D BAG (AHN5, 2023) en het AHN-DSM, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "helicon-den-haag";
// Gebouwstelsel = modelstelsel: u (X) langs de Turfmarktgevel naar het noordoosten (37,4° op RD-oost,
// BAG-randen 37,35–37,47°), v (Y) naar het noordwesten. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [81927.94, 455135.86];
const A = (37.4 * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(5), +Math.sin(A).toFixed(5)];
const GROUND = 0.6; // NAP, AHN-DTM rondom (Turfmarkt 0,76, noordoost 0,53, noordwest 0,62; 3D BAG 0,46)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 57.6; // dakvlak van de torens (3D BAG 57,57–57,62; DSM 57,6)
const PARAPET = 59.0; // dakrand rondom (DSM 58,9–59,1; 3D BAG 58,96–59,0)
const VAULT_EAVE = 59.0; // tongewelf op het dak: zijwanden (DSM 59,0)
const VAULT_TOP = 60.0; // kruin (DSM 60,0; 3D BAG-nok 60,2)
const STEPS = [26.3, 33.05, 39.8, 46.65]; // treden aan de Turfmarkt (3D BAG 26,15–26,42 / 32,9–33,2 / 39,7–39,85 / 46,5–46,7)
const LOW = 22.76; // laagbouw tussen de torens (3D BAG 22,76; DSM 22,7–22,8)
const LOW_CORNICE = 23.3; // lijst langs de Turfmarkt (DSM 23,3)
const ATRIUM_TOP = 26.1; // kruin van het glazen tongewelf (DSM 26,0–26,2)
const NEEDLE_TOP = 68.0; // witte naalden (DSM-treffers tot 67,3; geschat)

// ---------- Plattegrond (u, v), BAG ----------
const TOWERS = [
  { name: "toren-zuidwest", u0: -42.32, u1: -28.43 },
  { name: "toren-midden", u0: -6.92, u1: 6.96 },
  { name: "toren-noordoost", u0: 28.47, u1: 42.32 },
];
const NW = 24.15; // noordwestgevel van de torens
const NW_RECESS = 23.0; // middelste 6,4 m van die gevel (BAG 23,15; 0,15 m verder terug, vrij van Castalia)
const RECESS_HALF = 3.18;
const SE = -24.13; // Turfmarktgevel van de torens
const STEP_FACES = [SE, -22.75, -21.2, -19.3, -17.4]; // gevel van de voet en van treden 2–4 en de toren (DSM-randen)
const LOW_SE = -23.45; // laagbouw ligt 0,7 m terug
const LOW_NW = 22.84;
const ATRIUM = { vc: -2.0, v0: -11.6, v1: 7.6, inset: 1.0, biteU: 3.0, biteV: 5.0, biteC: -1.5 };

// ---------- Verdiepingen ----------
// Elke trede is twee lagen; verdiepingshoogte (46,65 − 26,3) / 6 = 3,39 m, begane grond tot +5,95 m.
const STOREY = (STEPS[3] - STEPS[0]) / 6;
const FLOOR_NAP = Array.from({ length: 16 }, (_, k) => STEPS[0] + STOREY * (k - 6));
const DEPTH = 0.35;

const seg = 48;
const arc = (cx, cz, r, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return [cx + r * Math.cos(t), cz + r * Math.sin(t)]; });

// Tongewelf: dwarsprofiel (w, z) als cirkelsegment van zEave tot zTop boven een voet op zFoot, als convexe
// hull over [s0, s1]; alongU: as langs u (profiel in v), anders langs v (profiel in u).
function vaultHull(w0, w1, zEave, zTop, s0, s1, alongU, zFoot) {
  const half = (w1 - w0) / 2, sag = zTop - zEave, r = (half * half + sag * sag) / (2 * sag), cw = (w0 + w1) / 2, cz = zTop - r;
  const a = Math.asin(half / r);
  const top = arc(cw, cz, r, Math.PI / 2 + a, Math.PI / 2 - a, seg);
  const prof = [[w0, zFoot], [w1, zFoot], ...top];
  const pts = [];
  for (const s of [s0, s1]) for (const [w, h] of prof) pts.push(alongU ? [s, w, h] : [w, s, h]);
  return Manifold.hull(pts);
}

// Plattegrond van een toren op de hoogte van trede k (k = 0 voet … 4 toren).
const towerPoly = ({ u0, u1 }, k) => {
  const c = (u0 + u1) / 2;
  return [[u0, STEP_FACES[k]], [u1, STEP_FACES[k]], [u1, NW], [c + RECESS_HALF, NW], [c + RECESS_HALF, NW_RECESS], [c - RECESS_HALF, NW_RECESS], [c - RECESS_HALF, NW], [u0, NW]];
};

// Witte lijst langs een gevelrand a→b (buitennormaal rechts): 0,4 m uit de gevel, bovenkant `top`,
// onderkant onder 45° van top − 0,75 aan de gevel naar top − 0,35 buiten.
function cornice(a, b, top, out = 0.4, ext = 0.4) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, t, h) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t, h];
  return Manifold.hull([-ext, L + ext].flatMap((s) => [P(s, -0.1, top), P(s, out, top), P(s, -0.1, top - out - 0.35), P(s, out, top - 0.35)]));
}
const ringCornice = (poly, top) => poly.map((a, i) => cornice(a, poly[(i + 1) % poly.length], top));

// Blinde nis in een gevelrand a→b tussen s0 en s1, van lo tot hi, met een plafond onder 45°.
function niche(a, b, s0, s1, lo, hi) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  return Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]);
}

// ---------- Torens ----------
function tower(t) {
  const { u0, u1 } = t, c = (u0 + u1) / 2;
  const parts = [];
  // Voet en treden: geneste prisma's, elk tot zijn eigen hoogte.
  STEP_FACES.forEach((_, k) => parts.push(prism(towerPoly(t, k), BASE, z(k < 4 ? STEPS[k] : PARAPET))));
  // Witte lijsten rond elke trede (ook langs de lange gevels) en rond de dakrand.
  STEPS.forEach((h, k) => parts.push(...ringCornice(towerPoly(t, k), z(h) + 0.3)));
  parts.push(...ringCornice(towerPoly(t, 4), z(PARAPET)));
  // Strook witte lisenen op de lange gevels (v = −2 ± 1,8), op de binnengevels vanaf het laagbouwdak.
  const inner = { left: u0 > -40, right: u1 < 40 };
  for (const [uf, sgn, isInner] of [[u0, -1, inner.left], [u1, 1, inner.right]]) {
    const zb = isInner ? z(LOW) : BASE;
    for (const vc of [-3.8, -2.0, -0.2]) {
      const pts = [];
      for (const v of [vc - 0.45, vc + 0.45]) pts.push([uf - sgn * 0.1, v, isInner ? zb : zb], [uf + sgn * 0.4, v, isInner ? zb + 0.4 : zb], [uf - sgn * 0.1, v, z(PARAPET)], [uf + sgn * 0.4, v, z(PARAPET)]);
      parts.push(Manifold.hull(pts));
    }
  }
  let body = union(parts);
  // Dakvlak binnen een rand van 0,9 m.
  body = body.subtract(prism(rect(u0 + 0.9, STEP_FACES[4] + 0.9, u1 - 0.9, NW_RECESS - 0.9), z(ROOF), z(PARAPET) + 1));
  // Plat tongewelf op het dak (8,4 m breed, v −0,6…19,8) en een witte balk met vijf naalden op v = −2.
  const roofParts = [
    vaultHull(c - 4.2, c + 4.2, z(VAULT_EAVE), z(VAULT_TOP), -0.6, 19.8, false, z(ROOF) - 0.1),
    prism(rect(u0 + 0.5, -2.5, u1 - 0.5, -1.5), z(ROOF) - 0.1, z(PARAPET)),
  ];
  for (const du of [-6.45, -3.3, 0, 3.3, 6.45]) {
    const x = Math.max(u0 + 0.5, Math.min(u1 - 0.5, c + du));
    roofParts.push(Manifold.hull([[x - 0.5, -2.5, z(PARAPET) - 0.1], [x + 0.5, -2.5, z(PARAPET) - 0.1], [x - 0.5, -1.5, z(PARAPET) - 0.1], [x + 0.5, -1.5, z(PARAPET) - 0.1], [x, -2.0, z(NEEDLE_TOP)]]));
  }
  return union([body, ...roofParts]);
}

// ---------- Laagbouw met glazen tongewelf ----------
function lowBlock(ua, ub) {
  const block = union([
    prism(rect(ua, LOW_SE, ub, LOW_NW), BASE, z(LOW)),
    cornice([ua, LOW_SE], [ub, LOW_SE], z(LOW_CORNICE), 0.4, 0),
  ]);
  const { v0, v1, inset, biteU, biteV, biteC } = ATRIUM;
  // Gewelf over v0…v1 (cirkelsegment, kruin +26,1 op v = −2,0), 1 m vrij van beide torens; aan de
  // kopse kanten een holle hap (ellips 3 × 5 m) zoals op de luchtfoto.
  const sa = ua + inset, sb = ub - inset;
  let vlt = vaultHull(v0, v1, z(LOW) + 0.05, z(ATRIUM_TOP), sa, sb, true, z(LOW) - 0.3);
  const ell = (uc) => { const pts = Array.from({ length: 40 }, (_, i) => { const t = (2 * Math.PI * i) / 40; return [uc + biteU * Math.cos(t), biteC + biteV * Math.sin(t)]; }); return prism(pts, z(LOW), z(ATRIUM_TOP) + 1); };
  vlt = vlt.subtract(union([ell(sa), ell(sb)]));
  return union([block, vlt]);
}

const solids = [
  ...TOWERS.map((t) => [t.name, tower(t)]),
  ["laagbouw-west", lowBlock(TOWERS[0].u1, TOWERS[1].u0)],
  ["laagbouw-oost", lowBlock(TOWERS[1].u1, TOWERS[2].u0)],
];

// ---------- Vensters als blinde nissen ----------
// Per laag vensters van 1,2 m (torens) of 1,5 m (laagbouw) als nis van 0,35 m met een plafond onder
// 45°; alleen waar de gevel buitengevel is (getest tegen het geheel, dus niet achter de laagbouw, een
// lijst of een lisene).
const whole = union(solids.map(([, m]) => m));
function exposed(a, b, s0, s1, lo, hi) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  return [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
    const from = P(s, -3, h), hit = whole.rayCast(from, P(s, 1, h))[0];
    const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
    return at > 2.95 && at < 3.05;
  }));
}
const addWindow = (cuts, a, b, sc, w, lo, hi) => { if (exposed(a, b, sc - w / 2, sc + w / 2, lo, hi)) cuts.push(niche(a, b, sc - w / 2, sc + w / 2, lo, hi)); };

const nodes = solids.map(([name, m], idx) => {
  const cuts = [];
  if (idx < 3) {
    const t = TOWERS[idx], { u0, u1 } = t, c = (u0 + u1) / 2;
    for (let k = 0; k < 15; k++) {
      const zf = z(FLOOR_NAP[k]), zt = z(FLOOR_NAP[k + 1]);
      const lo = zf + 0.9, hi = zt - 0.6 - DEPTH;
      // Trede waarin deze laag valt.
      const tier = STEPS.findIndex((h) => FLOOR_NAP[k] < h - 0.01);
      const vf = STEP_FACES[tier < 0 ? 4 : tier];
      // Turfmarktgevel: vijf vensters op 2,5 m.
      for (const du of [-5, -2.5, 0, 2.5, 5]) addWindow(cuts, [u0, vf], [u1, vf], c + du - u0, 1.2, lo, hi);
      // Lange gevels: raster van 2,5 m vanaf de noordwestgevel.
      for (let j = 0; ; j++) {
        const vc = NW - 1.6 - 2.5 * j;
        if (vc - 0.6 < vf + 0.5) break;
        addWindow(cuts, [u1, vf], [u1, NW], vc - vf, 1.2, lo, hi); // oostkant: rand loopt naar +v
        addWindow(cuts, [u0, NW], [u0, vf], NW - vc, 1.2, lo, hi); // westkant: rand loopt naar −v
      }
      // Noordwestgevel: één venster naast de inham aan elke kant, twee in de inham.
      addWindow(cuts, [u1, NW], [c + RECESS_HALF, NW], u1 - (c + 5.1), 1.2, lo, hi);
      addWindow(cuts, [c - RECESS_HALF, NW], [u0, NW], (c - RECESS_HALF) - (c - 5.1), 1.2, lo, hi);
      for (const du of [1.6, -1.6]) addWindow(cuts, [c + RECESS_HALF, NW_RECESS], [c - RECESS_HALF, NW_RECESS], RECESS_HALF - du, 1.2, lo, hi);
    }
  } else {
    const ua = idx === 3 ? TOWERS[0].u1 : TOWERS[1].u1, ub = idx === 3 ? TOWERS[1].u0 : TOWERS[2].u0;
    const L = ub - ua, pitch = 2.6, bays = Math.floor((L - 0.9) / pitch), w0 = (L - bays * pitch) / 2;
    for (let k = 0; k < 5; k++) {
      const zf = z(FLOOR_NAP[k]), zt = k < 4 ? z(FLOOR_NAP[k + 1]) : z(LOW);
      const lo = zf + 0.9, hi = zt - (k < 4 ? 0.5 : 0.75) - DEPTH;
      for (let j = 0; j < bays; j++) addWindow(cuts, [ua, LOW_SE], [ub, LOW_SE], w0 + pitch * (j + 0.5), 1.5, lo, hi);
    }
  }
  const out = cuts.length ? m.subtract(union(cuts)) : m;
  const parts = out.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen`);
  console.log(name, out.status(), "genus", out.genus(), "driehoeken", out.numTri(), "nissen", cuts.length);
  return [`building:helicon-${name}`, out];
});

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Helicon",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.05, // NAP +0,6 m + 43,45 (Den Haag)
    groundOffsetMetres: -0.2,
    replacesBuildings: ["NL.IMBAG.Pand.0518100001754311"],
    description:
      "Oorsprong in het hart van de BAG-contour op maaiveld NAP +0,6 m, +X langs de Turfmarktgevel naar het noordoosten (37,4 graden in RD), +Y naar het noordwesten (Castalia); drie bakstenen torens van 13,9 m breed tot een dakrand op +59,0 (dak +57,6) met elk een plat tongewelf tot +60,0, aan de Turfmarkt vier treden van twee lagen (+26,3, +33,05, +39,8, +46,65) met witte lijsten, op v = −2 een witte balk met vijf naalden tot circa +68 boven drie witte lisenen op de lange gevels; daartussen laagbouw tot +22,76 met een glazen tongewelf tot +26,1; hoogtes uit de 3D BAG (AHN5) en het AHN-DSM, verdiepingen, vensterraster, lijsten, lisenen en naaldhoogte uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      parapetNapM: PARAPET,
      roofVaultNapM: VAULT_TOP,
      stepNapM: STEPS,
      stepFaceV: STEP_FACES,
      lowNapM: LOW,
      atriumVaultNapM: ATRIUM_TOP,
      needleTopNapM: NEEDLE_TOP,
      towerWidthM: 13.9,
      floors: 16,
      storeyHeightM: +STOREY.toFixed(3),
      axisDegrees: 37.4,
      estimates: [
        "verdiepingshoogte 3,39 m uit de treden (twee lagen per trede), begane grond tot +5,95",
        "vensters 1,2 m op 2,5 m (torens) en 1,5 m op 2,6 m (laagbouw) als nissen van 0,35 m",
        "witte lijsten 0,4 m uit de gevel rond elke trede en de dakrand, ook langs de lange gevels",
        "drie witte lisenen van 0,9 m op v = −2 en vijf naalden tot +68 (DSM raakt de dunne naalden tot +67,3)",
        "kopse kanten van het glazen tongewelf als holle ellips van 3 × 5 m, 1 m vrij van de torens",
      ],
    },
    sources: [
      "PDOK BAG pand 0518100001754311 (bouwjaar 1998), AHN-DSM en -DTM 0,5 m (WCS), Actueel_orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001754311 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dak, treden, laagbouw, tongewelven",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag",
      "https://www.rijksoverheid.nl/ministeries/ministerie-van-volksgezondheid-welzijn-en-sport/organisatie/gebouwen",
      "https://commons.wikimedia.org/wiki/File:Helicon1.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_-_De_Resident_(28056663929).jpg",
      "https://commons.wikimedia.org/wiki/File:Turfmarkt_The_Hague_2016_1.jpg",
    ],
  },
});

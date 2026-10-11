// Forum Groningen (Nieuwe Markt 1, Groningen; NL Architects, geopend 29
// november 2019): cultuurgebouw van circa 48 m naast de Grote Markt, een
// gefacetteerde veelvlak in natuursteen met een zeshoekig grondvlak en een
// zeshoekig dakterras. Zijvlakken (Wikipedia): achtereenvolgens een vierhoek,
// een driehoek met de punt naar boven, een vierhoek, een driehoek met de punt
// naar beneden, en nog eens die vier; geen enkel vlak is verticaal. Het
// gebouw is puntsymmetrisch: tegenover elke driehoek staat dezelfde driehoek
// omgekeerd. Voorbeeld per rij: generate-evoluon.mjs (aanpak primitieven) en de
// skylinemodellen op efteling-kit.mjs (generate-haagse-toren.mjs,
// generate-cooltoren.mjs, generate-montevideo.mjs).
//
//   node scripts/generate-forum-groningen.mjs              # 1:1000 (standaard)
//
// Opbouw: het gebouw is convex, dus de massa is de doorsnede van tien
// halfruimtes (acht gevelvlakken, het dak en de onderkant), elk een
// planvergelijking; geen gestapelde DSM-lagen. Daarin:
// - het verdiepte dakterras (patio) met de zittrap naar het dak aan de oostkant,
//   het trapgat in de zuidwesthoek, het lichtgat naast de patio en het glazen
//   dak in de noordoosthoek;
// - de glazen insnijdingen (de "kloof" in de lange gevels) als nissen van
//   0,5 m met vloerranden per laag;
// - de liggende vensters in de natuursteen als blinde nissen van 0,35 m,
//   loodrecht op het gevelvlak, in verspringende rijen per laag.
//
// Gebouwstelsel: oorsprong midden op het dak op RD (234026, 582018), z = 0 op
// NAP +4,5 m (straat aan de oostkant, AHN-DTM +4,5; aan de westkant ligt de
// Nieuwe Markt op +6,3 tot +6,5), Z omhoog. +X loopt op 22 graden in RD, langs
// de lange noordgevel (BAG-gevel 22,1 graden), dus naar het oostnoordoosten;
// +Y naar het noordnoordwesten.
//
// Bronnen: BAG-pand 0014100022188313 (het Forum boven maaiveld; de
// parkeergarage en fietsenkelder 0014100022188314 liggen onder de Nieuwe Markt
// en worden niet gemodelleerd), AHN DSM/DTM 0,5 m (PDOK WCS, AHN4; het gebouw
// stond er toen al: 3D BAG b3_pw_bron ahn4, 2022), de 3D BAG LoD2.2 (TU
// Delft/3D geoinformatie, CC BY 4.0: de dakrand op NAP +52,2, de patio op
// +47,75 en de hellende driehoeken), Actueel_orthoHR, Wikipedia en
// Commons-foto's van alle kanten.
import { Manifold, box, prism, union, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "forum-groningen";
const ORIGIN = [234026.0, 582018.0];
const AXIS_DEG = 22.0;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 4.5;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;
const A = (AXIS_DEG * Math.PI) / 180;
// RD -> gebouwstelsel.
const L = ([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [dx * Math.cos(A) + dy * Math.sin(A), -dx * Math.sin(A) + dy * Math.cos(A)];
};

// ---------- hoekpunten (RD, NAP) ----------
// Dak: de zeshoek van de 3D BAG-dakrand op NAP +52,15 (3D BAG 52,17-52,22,
// AHN 52,0-52,2). T2 en T3 liggen op het in het AHN gemeten vlak van de
// zuidoostelijke driehoek, T5 en T6 op dat van de noordwestelijke; de
// bovenranden van de vierhoeken lopen evenwijdig aan hun onderrand (BAG).
const ROOF_NAP = 52.15;
const T = {
  T1: [233994.24, 581998.47], // zuidwesthoek (BAG-voetafdruk: overstek boven de zuidwestdriehoek)
  T2: [234028.65, 582005.92],
  T3: [234059.91, 582026.77],
  T4: [234055.73, 582041.84], // noordoosthoek (BAG-voetafdruk: overstek boven de noordoostdriehoek)
  T5: [234022.66, 582028.37],
  T6: [233991.66, 582007.77],
};
// Voet: de zeshoek van de BAG-voetafdruk (0014100022188313) zonder de twee
// dakhoeken, met de maaiveldhoogte (AHN-DTM) bij elk hoekpunt. B2 en B5 zijn
// de punten van de omgekeerde driehoeken; de AHN-vlakken van die driehoeken
// komen daar op +4,64 en +6,26 uit, gelijk aan het maaiveld.
const B = {
  B1: [[234030.95, 581998.66], 5.4],
  B2: [[234069.69, 582007.05], 4.64],
  B3: [[234063.37, 582029.85], 4.55],
  B4: [[234020.58, 582035.83], 5.4],
  B5: [[233983.67, 582020.8], 6.26],
  B6: [[233988.17, 582004.59], 6.45],
};
const P3 = (rd, nap) => [...L(rd), z(nap)];
const t = Object.fromEntries(Object.entries(T).map(([k, p]) => [k, P3(p, ROOF_NAP)]));
const b = Object.fromEntries(Object.entries(B).map(([k, [p, nap]]) => [k, P3(p, nap)]));
// Onderrand van een vierhoek als lijn evenwijdig aan de bovenrand door een
// voetpunt, op de gemiddelde maaiveldhoogte langs die gevel.
const atNap = (p, nap) => [p[0], p[1], z(nap)];

// ---------- vlakken ----------
const sub = (p, q) => p.map((v, i) => v - q[i]);
const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const unit = (v) => v.map((c) => c / Math.hypot(...v));
const CENTER = [0, 0, z(28)];
// Vlak door drie punten, normaal naar binnen.
const plane = (name, p, q, r) => {
  let n = unit(cross(sub(q, p), sub(r, p)));
  if (dot(n, sub(CENTER, p)) < 0) n = n.map((c) => -c);
  return { name, n, d: dot(n, p) };
};
const FACES = [
  // zuid (vierhoek, 9 graden naar binnen): bovenrand T1-T2, onderrand B1-B2
  plane("zuid", t.T1, t.T2, atNap(b.B1, 5.0)),
  // zuidoost (driehoek, punt naar beneden in B2): AHN-vlak, 24,6 graden naar binnen
  plane("zuidoost", t.T2, t.T3, b.B2),
  // oost (vierhoek, 5 graden): bovenrand T3-T4, onderrand B2-B3
  plane("oost", t.T3, t.T4, atNap(b.B3, 4.6)),
  // noordoost (driehoek, punt naar boven in T4): kraagt 12,9 graden uit
  plane("noordoost", b.B3, b.B4, t.T4),
  // noord (vierhoek, 9 graden): bovenrand T4-T5, onderrand B4-B5
  plane("noord", t.T4, t.T5, atNap(b.B4, 5.85)),
  // noordwest (driehoek, punt naar beneden in B5): AHN-vlak, 18 graden naar binnen
  plane("noordwest", t.T5, t.T6, b.B5),
  // west (vierhoek, 5 graden): bovenrand T6-T1, onderrand B5-B6
  plane("west", t.T6, t.T1, atNap(b.B6, 6.35)),
  // zuidwest (driehoek, punt naar boven in T1): kraagt 6,3 graden uit
  plane("zuidwest", b.B6, b.B1, t.T1),
];
const face = (name) => FACES.find((f) => f.name === name);

// Massa: doos, afgesneden door de acht gevelvlakken (onderkant BASE, dak).
let mass = box(-80, -60, BASE, 80, 60, z(ROOF_NAP));
for (const f of FACES) mass = mass.trimByPlane(f.n, f.d);

// ---------- gevelstelsel ----------
// Per gevelvlak: e horizontaal langs de gevel (met de klok mee gezien van
// buiten: van links naar rechts), u omhoog in het vlak, o naar buiten.
const frameOf = (f) => {
  const o = f.n.map((c) => -c);
  const e = unit(cross([0, 0, 1], o));
  const u = unit(cross(o, e));
  return { e, u, o };
};
// Punt op het vlak op hoogte NAP `nap` en positie s langs e, gemeten vanaf de
// loodlijn door de oorsprong.
const onFace = (f, s, nap) => {
  const { e } = frameOf(f);
  const h = unit([f.n[0], f.n[1], 0]);
  const zz = z(nap);
  const k = (f.d - zz * f.n[2]) / dot(f.n, h);
  return [k * h[0] + s * e[0], k * h[1] + s * e[1], zz];
};
// Bereik van s waar het vlak op hoogte `nap` bij de massa hoort.
const spanAt = (f, nap) => {
  const { e } = frameOf(f);
  const p0 = onFace(f, 0, nap);
  let lo = -1e9;
  let hi = 1e9;
  for (const g of FACES) {
    if (g === f) continue;
    const a = dot(g.n, e);
    const c = g.d - dot(g.n, p0);
    if (Math.abs(a) < 1e-9) {
      if (c > 0) return null;
      continue;
    }
    if (a > 0) lo = Math.max(lo, c / a);
    else hi = Math.min(hi, c / a);
  }
  return hi > lo ? [lo, hi] : null;
};
// Nis in het vlak: s0..s1 langs de gevel, NAP-hoogtes n0..n1 (verticaal),
// `depth` loodrecht het vlak in en 1 m naar buiten.
const niche = (f, s0, s1, n0, n1, depth) => {
  const { o } = frameOf(f);
  const pts = [];
  for (const s of [s0, s1]) for (const n of [n0, n1]) {
    const p = onFace(f, s, n);
    pts.push(p.map((c, i) => c - o[i] * depth), p.map((c, i) => c + o[i] * 1.0));
  }
  return Manifold.hull(pts);
};
// Past een venster s0..s1 bij n0..n1 met `margin` binnen het vlak?
const fits = (f, s0, s1, n0, n1, margin = 0.9) =>
  [n0, n1].every((n) => {
    const sp = spanAt(f, n);
    return sp && s0 >= sp[0] + margin && s1 <= sp[1] - margin;
  });

// ---------- dak ----------
// Patio: verdiept dakterras op NAP +47,75 (3D BAG 47,74-47,77, AHN 47,5-48,0),
// een langgerekte zeshoek met de punt naar het oosten (AHN, in dit stelsel),
// en een zittrap die van de vloer (x 6,0) naar de dakrand (x 13,6) oploopt.
const PATIO_NAP = 47.75;
const PATIO = [[-7.2, 4.75], [4.0, 4.75], [13.6, 2.6], [13.6, -3.8], [7.0, -5.75], [-7.2, -5.75]];
const STAIR = { x0: 6.0, x1: 13.6, steps: 8 };
// De zittrap blijft staan: de patio wordt uitgesneden zonder de treden.
const stair = [];
for (let k = 0; k < STAIR.steps; k++) {
  const x0 = STAIR.x0 + ((STAIR.x1 - STAIR.x0) * k) / STAIR.steps;
  const top = k === STAIR.steps - 1 ? ROOF_NAP + 2 : PATIO_NAP + ((ROOF_NAP - PATIO_NAP) * (k + 1)) / STAIR.steps;
  stair.push(box(x0, -8, z(PATIO_NAP) - 1, STAIR.x1 + 2, 8, z(top)));
}
const roofCuts = [prism(PATIO, z(PATIO_NAP), z(ROOF_NAP) + 1).subtract(union(stair))];
// Trapgat naar het dak in de zuidwesthoek (AHN +47,3 tot +49,7, ortho), het
// lichtgat ten oosten van de patio (AHN +47,7) en het glazen dak boven het
// atrium in de noordoosthoek (ortho; in het AHN ruis tussen +50,5 en +52).
const HATCH = { c: L([234001.5, 582007.5]), half: [2.0, 1.3], nap: 49.7 };
const SKYLIGHT = { c: L([234046.3, 582023.6]), half: [1.4, 0.8], nap: 49.5 };
const GLASSROOF = [L([234049.0, 582026.2]), L([234055.6, 582027.6]), L([234052.6, 582038.6]), L([234047.5, 582036.6])];
const rectAround = ({ c, half }) => [
  [c[0] - half[0], c[1] - half[1]], [c[0] + half[0], c[1] - half[1]], [c[0] + half[0], c[1] + half[1]], [c[0] - half[0], c[1] + half[1]],
];
roofCuts.push(prism(rectAround(HATCH), z(HATCH.nap), z(ROOF_NAP) + 1));
roofCuts.push(prism(rectAround(SKYLIGHT), z(SKYLIGHT.nap), z(ROOF_NAP) + 1));
roofCuts.push(prism(GLASSROOF, z(ROOF_NAP - 0.5), z(ROOF_NAP) + 1));

// ---------- verdiepingen ----------
// Tien lagen van 4,55 m vanaf de begane-grondvloer op NAP +6,5 (Nieuwe
// Markt); de bovenste laag (+47,45) ligt 4,7 m onder het dak. Uit de
// vensterrijen op de foto's (Commons) geschat, gelijk aan circa 4,2-4,6 m per
// rij op de schuine foto's.
const FLOOR0 = 6.5;
const PITCH = 4.55;
const FLOORS = 10;
const floor = (k) => FLOOR0 + k * PITCH;

// ---------- glazen insnijdingen ----------
// De glazen zigzag ("kloof") loopt over de lange noordzijde (noordvierhoek,
// met uitlopers in de noordwest- en noordoostdriehoek) en, puntsymmetrisch,
// over de zuidzijde. Per laag een glasband van vloer + 0,4 tot vloer + 4,0
// (0,95 m steen tussen de lagen), 0,5 m diep loodrecht op elk gevelvlak;
// x-bereiken (gebouwstelsel) uit de foto vanaf de Martinitoren
// (Forum_Groningen,_22_Augustus_2022_-_06) en de ortho. De zuidzijde krijgt
// dezelfde banden gespiegeld in de oorsprong (x -> -x), zoals de
// glasbanden in de zuidoostdriehoek op de ortho.
const GLASS = [
  { k: 0, x: [2.0, 15.0] },
  { k: 1, x: [-10.0, 10.7] },
  { k: 2, x: [-24.6, 10.7] },
  { k: 3, x: [4.0, 20.0] },
  { k: 4, x: [-15.9, 14.5] },
  { k: 5, x: [0.5, 23.7] },
  { k: 6, x: [2.0, 12.0] },
  { k: 7, x: [-25.0, 30.0] },
];
// Smalle donkere band onder de bovenste vensterrij (foto Martinitoren).
const SLOT = { nap: [45.3, 46.3], x: [12.0, 29.0] };
const GLASS_DEPTH = 0.5;
// Schil van `depth` binnen de gevelvlakken: de doorsnede van de massa met de
// naar binnen verschoven halfruimtes eruit.
// De schil steekt 1 m buiten de gevel uit, zodat een uitsnede geen vlak deelt
// met de gevel.
const shell = (depth) => {
  let inner = box(-80, -60, BASE - 1, 80, 60, z(ROOF_NAP) + 1);
  let outer = box(-80, -60, BASE - 1, 80, 60, z(ROOF_NAP) - 0.3);
  for (const f of FACES) {
    inner = inner.trimByPlane(f.n, f.d + depth);
    outer = outer.trimByPlane(f.n, f.d - 1.0);
  }
  return outer.subtract(inner);
};
const glassShell = shell(GLASS_DEPTH);
const SIDES = [
  { sign: 1, y: [3.0, 60] }, // noordzijde
  { sign: -1, y: [-60, -2.0] }, // zuidzijde, gespiegeld
];
const bands = [];
for (const { sign, y } of SIDES) {
  for (const g of GLASS) {
    const [x0, x1] = sign > 0 ? g.x : [-g.x[1], -g.x[0]];
    bands.push({ x: [x0, x1], y, nap: [floor(g.k) + 0.4, floor(g.k) + 4.0] });
  }
  const [x0, x1] = sign > 0 ? SLOT.x : [-SLOT.x[1], -SLOT.x[0]];
  bands.push({ x: [x0, x1], y, nap: SLOT.nap });
}
const glassCuts = bands.map((q) => box(q.x[0], q.y[0], z(q.nap[0]), q.x[1], q.y[1], z(q.nap[1])).intersect(glassShell));
// Glazen pui van de begane grond aan de smalle oost- en westgevel (entrees aan
// de Nieuwe Markt en de Oude Boteringestraat), 0,5 m terug.
for (const name of ["west", "oost"]) {
  const f = face(name);
  const sp = spanAt(f, FLOOR0 + 3.6);
  glassCuts.push(niche(f, sp[0] + 2.0, sp[1] - 2.0, FLOOR0 - 2.0, FLOOR0 + 3.6, 0.5));
}

// ---------- vensters ----------
// Liggende vensters in de natuursteen, blinde nissen van 0,35 m loodrecht op
// het gevelvlak, in verspringende rijen per laag (foto's van alle kanten):
// breed (3,2 m), middel (2,2 m) en smal (1,3 m), 1,3 m hoog met de onderkant
// 1,0 m boven de vloer. De bovenste laag heeft een regelmatige rij onder de
// dakrand. Plaatsing met een vaste pseudo-willekeurige reeks, zodat het
// script steeds hetzelfde model geeft; niet over de glasbanden.
const WINDOW = { sill: 1.0, h: 1.3, depth: 0.35, widths: [3.2, 2.2, 1.3, 2.2, 1.3] };
let seed = 20191129;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};
const inBand = (p, nap0, nap1) =>
  bands.some((q) => p[0] > q.x[0] - 1.5 && p[0] < q.x[1] + 1.5 && p[1] > q.y[0] - 1 && p[1] < q.y[1] && nap1 > q.nap[0] - 0.6 && nap0 < q.nap[1] + 0.6);
const windowCuts = [];
for (const f of FACES) {
  for (let k = 1; k < FLOORS; k++) {
    const n0 = floor(k) + WINDOW.sill;
    const n1 = n0 + WINDOW.h;
    const top = k === FLOORS - 1;
    const sp0 = spanAt(f, n0);
    const sp1 = spanAt(f, n1);
    if (!sp0 || !sp1) continue;
    const lo = Math.max(sp0[0], sp1[0]) + 1.2;
    const hi = Math.min(sp0[1], sp1[1]) - 1.2;
    let s = lo + (top ? 0.4 : rnd() * 3.0);
    while (s < hi) {
      const w = top ? 2.2 : WINDOW.widths[Math.floor(rnd() * WINDOW.widths.length)];
      const skip = !top && rnd() < 0.3;
      if (s + w > hi) break;
      const c = onFace(f, s + w / 2, (n0 + n1) / 2);
      if (!skip && !inBand(c, n0, n1)) windowCuts.push(niche(f, s, s + w, n0, n1, WINDOW.depth));
      s += w + (top ? 2.0 : 1.6 + rnd() * 3.2);
    }
  }
}
console.log("glasbanden", glassCuts.length, "vensters", windowCuts.length);

let model = mass.subtract(union([...roofCuts, ...glassCuts, ...windowCuts]));
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));
for (const f of FACES) {
  const lo = spanAt(f, 6.5);
  const hi = spanAt(f, ROOF_NAP - 0.01);
  const tilt = (Math.asin(Math.abs(f.n[2])) * 180) / Math.PI;
  console.log(f.name, (f.n[2] > 0 ? "kraagt uit, " : "helt naar binnen, ") + tilt.toFixed(1) + " graden uit het lood;", "breedte op +6,5:", lo ? (lo[1] - lo[0]).toFixed(1) : "-", "op dak:", hi ? (hi[1] - hi[0]).toFixed(1) : "-");
}

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Forum Groningen gefacetteerde veelvlak met dakterras patio en glazen insnijdingen", model]],
  catalog: {
    name: "Forum Groningen",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straat aan de oostkant (Oude Boteringestraat/Poelestraat), AHN-DTM NAP
    // +4,45 tot +4,55; de lader neemt de laagste. Aan de westkant ligt de
    // Nieuwe Markt hoger (+6,3 tot +6,5): daar zit de voet in het terrein.
    groundSamplePoints: [[40, -28], [43, -12], [42, -1]],
    // 0014100022188313 is het Forum; 0014100022188314 is de ondergrondse
    // parkeergarage en fietsenkelder, waarvan de BAG-contour het Forum en de
    // Nieuwe Markt omvat. De PDOK-reconstructie van die garage neemt de
    // punten van het Forum mee en staat als blok tot de dakrand (export
    // 2026-10-11: tot 59,6 mm op 1:1000), dus ook die wordt verborgen; op de
    // Nieuwe Markt blijft het PDOK-terrein.
    replacesBuildings: ["NL.IMBAG.Pand.0014100022188313", "NL.IMBAG.Pand.0014100022188314"],
    description:
      "Oorsprong midden op het dak, z = 0 op NAP +4,5 m (straat aan de oostkant), +X op 22 graden in RD langs de lange noordgevel (naar het oostnoordoosten), +Y naar het noordnoordwesten; convexe veelvlak uit acht gevelvlakken (vier vierhoeken, twee driehoeken met de punt omhoog die 6 en 13 graden uitkragen, twee met de punt omlaag die 18 en 25 graden naar binnen hellen) tussen de zeshoekige BAG-voet en het zeshoekige dak op NAP +52,15, met de verdiepte patio (+47,75) en zittrap op het dak, trapgat, lichtgat en glazen dak, de glazen zigzag over de lange noord- en zuidzijde en liggende vensters per laag; vlakken uit BAG, AHN en 3D BAG, glas- en vensterpatroon en verdiepingshoogte uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      groundWestNapM: 6.45,
      roofNapM: ROOF_NAP,
      patioNapM: PATIO_NAP,
      heightAboveStreetM: +(ROOF_NAP - GROUND_NAP).toFixed(2),
      footprintM2: 2677,
      faces: Object.fromEntries(
        FACES.map((f) => [f.name, `${f.n[2] > 0 ? "kraagt uit" : "helt naar binnen"} ${((Math.asin(Math.abs(f.n[2])) * 180) / Math.PI).toFixed(1)} graden`]),
      ),
      floors: FLOORS,
      storeyPitchM: PITCH,
      axisDegrees: AXIS_DEG,
      estimates: [
        "verdiepingshoogte 4,55 m (tien lagen vanaf NAP +6,5) uit de vensterrijen op de foto's",
        "glazen zigzag: x-bereiken per laag uit de foto vanaf de Martinitoren en de ortho; de zuidzijde puntsymmetrisch aan de noordzijde (ortho: glasbanden in de zuidoostdriehoek en de zuidvierhoek)",
        "vensters: 1,3 m hoog, 1,3-3,2 m breed, in verspringende rijen met een vaste pseudo-willekeurige reeks; het werkelijke patroon per gevel is niet overgenomen",
        "glazen pui van de begane grond aan de smalle oost- en westgevel, 0,5 m terug",
        "zittrap als acht treden van 0,55 m (AHN: helling van +47,75 naar +52,15 over 7,6 m)",
        "glazen dak in de noordoosthoek als nis van 0,5 m (AHN ruis door glas)",
      ],
    },
    sources: [
      "PDOK BAG pand 0014100022188313 (Forum, bouwjaar 2020) en 0014100022188314 (ondergrondse parkeergarage en fietsenkelder onder de Nieuwe Markt, niet gemodelleerd), AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100022188313 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakrand +52,2, patio +47,75, zittrap en de hellende driehoeken",
      "https://nl.wikipedia.org/wiki/Forum_Groningen (veelvlak met zeshoekig grondvlak en dakterras, acht zijvlakken, geen enkel verticaal)",
      "https://commons.wikimedia.org/wiki/File:Forum_Groningen,_22_Augustus_2022_-_06.jpg",
      "https://commons.wikimedia.org/wiki/File:Forum_Groningen.jpg",
      "https://commons.wikimedia.org/wiki/File:Forum_Groningen_Westseite.jpg",
      "https://commons.wikimedia.org/wiki/File:Forum-Groningen1-Kirschbluete-2026-04-msu7-3811.jpg",
      "https://commons.wikimedia.org/wiki/File:Groninger_Forum-2026-04-msu2-3811.jpg",
      "https://commons.wikimedia.org/wiki/File:Groninger_Forum.jpg",
      "https://commons.wikimedia.org/wiki/File:Groninger_Forum_-_dakterras.jpg",
      "https://commons.wikimedia.org/wiki/File:Forum_Groningen,_22_Augustus_2022_-_07.jpg",
      "https://commons.wikimedia.org/wiki/File:Wageningen_and_Groningen_(Netherlands,_July-August_2020)_-_67_(50553910866).jpg",
    ],
  },
});

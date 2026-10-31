// Parktoren (Ien Daleshof, Prinsenland, Rotterdam-Prins Alexander, 2009): woontoren van 76 m en 24 lagen aan
// de noordrand van het Prinsenpark, het hoogste gebouw van Prins Alexander. Een donkerrode baksteentoren op
// een glazen plint van twee lagen met witte kolommen; de bakstenen 'tafel' kraagt boven de plint uit. De
// zuidgevel is bol en glazen, met in de westhelft een stapel grote balkons onder een gebogen bakstenen kroon
// op NAP +61 m, een bakstenen lisene en daarnaast een smalle stapel kleine balkons tot de top. Aan de oostkant
// staat een lagere vleugel (NAP +61 m) die met zijn zuidoosthoek op twee hoge kolommen boven het park hangt,
// met loggia's in de zuidgevel; in de noordwesthoek een vleugel tot NAP +55 m. Op het dak installatiekasten.
// Contour uit de BAG, hoogtes per bouwdeel uit de 3D BAG (LoD2.2, AHN5 2023: het AHN4-DSM heeft hier veel
// gaten), gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "ien-daleshof";
// RD-assen: x naar het oosten, y naar het noorden; oorsprong in het hart van de BAG-contour.
const ORIGIN = [96977.0, 439168.0];
const AXIS = [1, 0];
const GROUND = -6.2; // NAP, AHN-DTM rondom (p50 -6,18) en 3D BAG-maaiveld (-6,23)
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const L = ([x, y]) => [+(x - ORIGIN[0]).toFixed(2), +(y - ORIGIN[1]).toFixed(2)];

// ---------- Hoogtes (NAP), 3D BAG LoD2.2-dakvlakken ----------
const ROOF = 69.95; // hoofdtoren (dakvlak 69,90–70,02)
const WING = 60.97; // westelijke strook en noordoostvleugel (60,89–61,04)
const NW = 55.0; // noordwestvleugel (54,97–55,02)
const PLANT = 72.38; // installatiekast midden op het dak (72,37–72,40)
const PLANT2 = 71.51; // kleine kast in de noordhoek (71,50–71,52)
const HATCH = 71.0; // dakluik aan de westrand van het hoofddak (hellend 70,65–71,26)

// ---------- Plattegronden (BAG/3D BAG, RD, vereenvoudigd: knikjes < 0,9 m weg) ----------
// Bolle zuidgevel als boog van BAG-punten (pijl circa 1,1 m over 20,5 m).
const ARC = [[96967.8, 439153.89], [96970.13, 439153.6], [96972.32, 439153.39], [96974.59, 439153.3], [96976.81, 439153.29], [96979.03, 439153.4], [96981.27, 439153.6], [96983.7, 439153.95], [96985.86, 439154.37], [96988.3, 439154.92]];
const CONTOUR = [
  ...ARC,
  [96989.24, 439155.53], [96989.24, 439156.9], [96986.21, 439169.1], [96992.1, 439171.1], [96986.42, 439183.27],
  [96982.6, 439181.95], [96979.26, 439181.43], [96979.74, 439177.18], [96973.86, 439176.95], [96973.89, 439178.38],
  [96970.5, 439178.6], [96966.6, 439179.5], [96962.6, 439169.0], [96968.65, 439167.79], [96968.28, 439165.8],
  [96966.74, 439156.05], [96966.91, 439154.62],
].map(L);
// Hoofdtoren tot ROOF (3D BAG-dakvlak 100).
const MAIN = [
  [96973.1, 439153.37], ...ARC.slice(4),
  [96989.24, 439155.53], [96989.24, 439156.9], [96986.21, 439169.1], [96985.9, 439171.3], [96984.08, 439175.61],
  [96983.4, 439178.3], [96981.5, 439178.45], [96979.7, 439177.63], [96979.74, 439177.18], [96973.9, 439176.95],
  [96974.11, 439171.53], [96974.2, 439169.6], [96972.54, 439169.44],
].map(L);
// Snijvlak boven de noordwestvleugel (alles hierbinnen boven NW gaat eraf).
const NW_CUT = [[96968.75, 439167.6], [96970.2, 439176.96], [96971.4, 439176.63], [96973.74, 439176.61], [96973.74, 439190], [96950, 439190], [96950, 439169.6], [96962.2, 439168.95]].map(L);
const PLANT_POLY = [[96974.76, 439164.82], [96979.91, 439164.38], [96979.74, 439170.1], [96974.87, 439169.65]].map(L);
const PLANT2_POLY = [[96978.11, 439175.55], [96981.18, 439175.3], [96981.12, 439176.87], [96978.5, 439176.78]].map(L);
const HATCH_POLY = [[96972.6, 439169.5], [96974.2, 439169.65], [96974.1, 439171.4], [96972.55, 439171.0]].map(L);

// ---------- Lagen (lokaal, maaiveld = 0) ----------
const PLINTH = 7.3; // glazen plint van twee lagen tot de bakstenen tafel (foto's)
const STOREY = 3.05; // 22 woonlagen tot het hoofddak (24 lagen met de plint)
const FLOORS = Array.from({ length: 22 }, (_, k) => [PLINTH + STOREY * k, STOREY]);

// ---------- Hulpen langs een gevellijn ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const unit = (v) => { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l]; };
// Buitennormaal van rand a→b (contour linksom: buiten = rechts).
const outward = (a, b) => { const d = unit(sub(b, a)); return [d[1], -d[0]]; };
// Punten langs een open lijn met hoeknormalen (gemiddelde van de aanliggende randen).
function pathFrame(pts) {
  return pts.map((p, i) => {
    const ns = [];
    if (i > 0) ns.push(outward(pts[i - 1], p));
    if (i < pts.length - 1) ns.push(outward(p, pts[i + 1]));
    const n = unit([ns.reduce((s, q) => s + q[0], 0), ns.reduce((s, q) => s + q[1], 0)]);
    const c = ns.length === 2 ? ns[0][0] * n[0] + ns[0][1] * n[1] : 1;
    return { p, n: [n[0] / c, n[1] / c] };
  });
}
const off = ({ p, n }, t) => [p[0] + n[0] * t, p[1] + n[1] * t];
// Deel van de boog tussen x0 en x1 (lokaal), met ingevoegde eindpunten.
function arcPart(arc, x0, x1) {
  const out = [];
  for (let i = 0; i < arc.length - 1; i++) {
    const [a, b] = [arc[i], arc[i + 1]];
    const at = (x) => { const t = (x - a[0]) / (b[0] - a[0]); return [x, a[1] + t * (b[1] - a[1])]; };
    if (a[0] <= x0 && b[0] > x0) out.push(at(x0));
    if (a[0] > x0 && a[0] < x1) out.push(a);
    if (a[0] < x1 && b[0] >= x1) out.push(at(x1));
  }
  return out;
}

// ---------- Massa ----------
const LARC = ARC.map(L);
const massing = union([
  prism(CONTOUR, BASE, z(WING)).subtract(prism(NW_CUT, z(NW), 120)),
  prism(MAIN, BASE, z(ROOF)),
  prism(PLANT_POLY, z(ROOF) - 0.1, z(PLANT)),
  prism(PLANT2_POLY, z(ROOF) - 0.1, z(PLANT2)),
  prism(HATCH_POLY, z(ROOF) - 0.1, z(HATCH)),
]);

// ---------- Balkonstapels op de bolle zuidgevel ----------
// Stapel langs een deel van de boog: blok van `out` m buiten de gevel van PLINTH tot top, met een kraag van
// 45° onder de tafel; per laag een open balkon van `deep` m diep met een plafond onder 45°. De laatste
// `solidEnd` m aan de oostkant blijft dicht (de bakstenen lisene).
function balconyStack(x0, x1, out, top, deep, solidEnd = 0, firstFloor = 1) {
  const fr = pathFrame(arcPart(LARC, x0, x1));
  const poly = [...fr.map((f) => off(f, -0.3)), ...[...fr].reverse().map((f) => off(f, out))];
  const parts = [prism(poly, PLINTH, top)];
  for (let i = 0; i < fr.length - 1; i++) {
    const [f, g] = [fr[i], fr[i + 1]];
    parts.push(Manifold.hull([[...off(f, -0.3), PLINTH - out - 0.3], [...off(g, -0.3), PLINTH - out - 0.3], [...off(f, out), PLINTH], [...off(g, out), PLINTH], [...off(f, -0.3), PLINTH + 0.1], [...off(g, -0.3), PLINTH + 0.1], [...off(f, out), PLINTH + 0.1], [...off(g, out), PLINTH + 0.1]]));
  }
  const cuts = [];
  const open = pathFrame(arcPart(LARC, x0 + 0.9, solidEnd > 0 ? x1 - solidEnd : x1 + 0.3)); // open einde: door de zijkant heen
  for (const [zf, fh] of FLOORS.slice(firstFloor)) {
    const lo = zf + 1.0, hi = zf + fh - 0.3 - deep;
    if (hi + deep + 0.2 > top - 1.0) continue;
    for (let i = 0; i < open.length - 1; i++) {
      const [f, g] = [open[i], open[i + 1]];
      cuts.push(Manifold.hull([[...off(f, out + 0.2), lo], [...off(g, out + 0.2), lo], [...off(f, out - deep), lo], [...off(g, out - deep), lo], [...off(f, out + 0.2), hi + deep + 0.2], [...off(g, out + 0.2), hi + deep + 0.2], [...off(f, out - deep), hi], [...off(g, out - deep), hi]]));
    }
  }
  return { block: union(parts), cuts };
}
// Westhelft: grote balkons 2,0 m buiten de gevel tot de kroon op WING, met de lisene (1,5 m) aan de oostkant.
const WEST_STACK = [-9.2, 1.5];
const big = balconyStack(WEST_STACK[0], WEST_STACK[1], 2.0, z(WING), 1.2, 1.5);
// Naast de lisene: smalle stapel kleine balkons tot onder de dakrand.
const SMALL_STACK = [1.5, 4.6];
const small = balconyStack(SMALL_STACK[0], SMALL_STACK[1], 1.4, z(ROOF) - 1.8, 0.9);

// ---------- Plint: glazen onderbouw onder de bakstenen tafel, met kolommen ----------
// Per gevelrand een inham van `depth` m tot PLINTH met een plafond onder 45°; onder de noordoostvleugel is
// de inham 2,5 m diep (de vleugel staat daar op kolommen boven het park). Onder de balkonstapels loopt het
// plafond door in het vlak van hun kraag, zodat er geen omgekeerde V onder de tafel hangt.
const ring = (poly, i) => [poly[i], poly[(i + 1) % poly.length]];
const PILOTI_EDGES = new Set([12, 13]); // zuid- en oostgevel van de noordoostvleugel
function edgeCut(a, b, s0, s1, depth, lo, hi) {
  const d = unit(sub(b, a)), n = outward(a, b);
  const P = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  return Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + 0.2), P(s1, -0.2, hi + 0.2), P(s0, depth, hi - depth), P(s1, depth, hi - depth)]);
}
const convex = (i) => {
  const N = CONTOUR.length, p = CONTOUR[(i - 1 + N) % N], q = CONTOUR[i], r = CONTOUR[(i + 1) % N];
  return (q[0] - p[0]) * (r[1] - q[1]) - (q[1] - p[1]) * (r[0] - q[0]) > 0;
};
const plinthCuts = [];
const ceilingAt = (x) => (x > WEST_STACK[0] && x < WEST_STACK[1] ? PLINTH - 2.05 : x > SMALL_STACK[0] && x < SMALL_STACK[1] ? PLINTH - 1.45 : PLINTH);
CONTOUR.forEach((_, i) => {
  const [a, b] = ring(CONTOUR, i);
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const depth = PILOTI_EDGES.has(i) ? 2.5 : 1.2;
  const e0 = convex(i) ? 1.5 : 0, e1 = convex((i + 1) % CONTOUR.length) ? 1.5 : 0;
  if (i < LARC.length - 1) {
    // Boogranden: alleen aan de buitenhoeken verlengen, en splitsen op de randen van de balkonstapels.
    const xs = [a[0], ...[WEST_STACK[0], WEST_STACK[1], SMALL_STACK[0], SMALL_STACK[1]].filter((x) => x > a[0] && x < b[0]), b[0]];
    for (let k = 0; k < xs.length - 1; k++) {
      const s0 = ((xs[k] - a[0]) / (b[0] - a[0])) * len, s1 = ((xs[k + 1] - a[0]) / (b[0] - a[0])) * len;
      // Aan de knikken binnen de boog 5 cm doorlopen, anders blijft op het boogpunt een lijntje staan.
      const ext0 = k > 0 ? 0 : i === 0 ? e0 : 0.05, ext1 = k < xs.length - 2 ? 0 : i === LARC.length - 2 ? e1 : 0.05;
      plinthCuts.push(edgeCut(a, b, s0 - ext0, s1 + ext1, depth, BASE - 0.1, ceilingAt((xs[k] + xs[k + 1]) / 2)));
    }
    return;
  }
  plinthCuts.push(edgeCut(a, b, -e0, len + e1, depth, BASE - 0.1, PLINTH));
});
// Kolommen van 1,0 m in de gevellijn: om de 4,6 m langs de zuidgevel, om de 3,2 m langs de oostgevel van
// de hoofdtoren, en twee hoge kolommen onder de zuidoosthoek van de noordoostvleugel.
const columns = [];
const column = (c, d, n) => {
  const P = (s, t) => [c[0] + d[0] * s - n[0] * t, c[1] + d[1] * s - n[1] * t];
  return prism([P(-0.5, 0.05), P(0.5, 0.05), P(0.5, 1.35), P(-0.5, 1.35)], BASE, PLINTH + 0.2);
};
function colonnade(pts, pitch, margin) {
  const segs = pts.slice(0, -1).map((p, i) => [p, pts[i + 1], Math.hypot(pts[i + 1][0] - p[0], pts[i + 1][1] - p[1])]);
  const total = segs.reduce((s, q) => s + q[2], 0), n = Math.floor((total - 2 * margin) / pitch);
  const start = (total - n * pitch) / 2;
  for (let k = 0; k <= n; k++) {
    let s = start + k * pitch;
    for (const [a, b, l] of segs) {
      if (s <= l) { const d = unit(sub(b, a)); columns.push(column([a[0] + d[0] * s, a[1] + d[1] * s], d, outward(a, b))); break; }
      s -= l;
    }
  }
}
colonnade(LARC, 4.6, 1.0);
colonnade([CONTOUR[11], CONTOUR[12]], 3.2, 1.0);
{
  // Hoekkolommen van de noordoostvleugel: aan het eind van zijn zuidgevel en 2,2 m langs zijn oostgevel.
  const [a, b] = ring(CONTOUR, 12), d = unit(sub(b, a)), n = outward(a, b);
  const P = (s, t) => [b[0] - d[0] * s - n[0] * t, b[1] - d[1] * s - n[1] * t];
  columns.push(prism([P(1.1, 0.05), P(0.1, 0.05), P(0.1, 1.05), P(1.1, 1.05)], BASE, PLINTH + 0.2));
  const [c, e] = ring(CONTOUR, 13), d2 = unit(sub(e, c));
  columns.push(column([c[0] + d2[0] * 2.2, c[1] + d2[1] * 2.2], d2, outward(c, e)));
}

// ---------- Loggia's in de zuidgevel van de noordoostvleugel ----------
const loggiaCuts = [];
{
  const [a, b] = ring(CONTOUR, 12);
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  for (const [zf] of FLOORS) {
    const lo = zf + 1.0, hi = zf + 2.9;
    if (hi + 1.0 > z(WING)) continue;
    loggiaCuts.push(edgeCut(a, b, 0.9, len - 0.9, 1.2, lo, hi));
  }
}
// Kleine balkons om de twee lagen aan de oostgevel van de noordoostvleugel, bij de zuidoosthoek.
const eastBalconies = [];
{
  const [a, b] = ring(CONTOUR, 13), d = unit(sub(b, a)), n = outward(a, b);
  const P = (s, t, h) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t, h];
  FLOORS.forEach(([zf], k) => {
    if (k % 2 === 0 || zf + 1.2 > z(WING) - 1.5) return;
    // Plaat met borstwering van 1,0 m, 1,2 m uit de gevel, met een kraag onder 45°.
    const top = zf + 1.1;
    eastBalconies.push(Manifold.hull([P(0.4, -0.2, top - 2.2), P(2.0, -0.2, top - 2.2), P(0.4, -0.2, top), P(2.0, -0.2, top), P(0.4, 1.0, top - 1.0), P(2.0, 1.0, top - 1.0), P(0.4, 1.0, top), P(2.0, 1.0, top)]));
  });
}

let body = union([massing, big.block, small.block, ...eastBalconies]);

// ---------- Gevelreliëf ----------
// Glazen delen van de zuidgevel (en de glazen zuidoosthoek): per laag een glasband achter een doorlopende
// vloerrand van 0,9 m, 0,35 m diep met een plafond onder 45°. Bakstenen gevels (oost, noord, west en de
// vleugels): per laag vensters van 1,2 × 1,5 m op een travee van 2,4 m als blinde nissen.
const DEPTH = 0.35;
const exposedAt = (a, b, s, h) => {
  const d = unit(sub(b, a)), n = outward(a, b);
  const from = [a[0] + d[0] * s + n[0] * 3, a[1] + d[1] * s + n[1] * 3, h];
  const hit = body.rayCast(from, [a[0] + d[0] * s - n[0], a[1] + d[1] * s - n[1], h])[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
};
const facadeCuts = [];
const arcEdges = new Set(LARC.slice(0, -1).map((_, i) => i));
CONTOUR.forEach((_, i) => {
  const [a, b] = ring(CONTOUR, i);
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (i === 12) return; // loggia's
  const glass = arcEdges.has(i) || i === 9 || i === 10;
  if (glass) {
    for (const [zf, fh] of FLOORS) {
      const lo = zf + 0.9, hi = zf + fh - DEPTH;
      let start = null;
      const flush = (s1) => { if (start !== null && s1 - start >= 0.9) facadeCuts.push(edgeCut(a, b, start, s1, DEPTH, lo, hi)); start = null; };
      for (let s = 0.25; s <= len - 0.25 + 1e-6; s += 0.25) {
        const ok = [lo + 0.05, hi - 0.05, hi + 1.0].every((h) => exposedAt(a, b, s, h));
        if (ok && start === null) start = s;
        if (!ok) flush(s - 0.25);
      }
      flush(len - 0.25);
    }
    return;
  }
  if (len < 3.5) return;
  const pitch = 2.4, width = 1.2, bays = Math.floor((len - 0.9) / pitch), w = (len - bays * pitch) / 2;
  for (const [zf] of FLOORS) {
    const lo = zf + 0.9, hi = lo + 1.5;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * pitch + (pitch - width) / 2, s1 = s0 + width;
      const ok = [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi - 0.05, hi + 1.0].every((h) => exposedAt(a, b, s, h)));
      if (ok) facadeCuts.push(edgeCut(a, b, s0, s1, DEPTH, lo, hi));
    }
  }
});

const merged = union([body.subtract(union([...plinthCuts, ...loggiaCuts, ...facadeCuts, ...big.cuts, ...small.cuts])), ...columns]);
// Booleans laten soms een los lijntje zonder volume achter (waar een kolom precies op een boogpunt staat).
const parts = merged.decompose().sort((p, q) => q.volume() - p.volume());
if (parts.slice(1).some((p) => p.volume() > 1e-6)) throw new Error(`Parktoren: ${parts.length} losse delen`);
const building = parts[0];
console.log("Parktoren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", facadeCuts.length, "kolommen", columns.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:ien-daleshof-parktoren", building]],
  catalog: {
    name: "Parktoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 37.25, // NAP -6,2 + 43,45 (geoïde 43,57 hier; offset van de Rotterdamse modellen)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0599100000753214"],
    description:
      "Parktoren aan het Ien Daleshof (Prinsenland, Prins Alexander) aan de noordrand van het Prinsenpark: baksteentoren op de BAG-contour met een bolle zuidgevel, hoofdtoren tot NAP +69,95 m, westelijke strook en noordoostvleugel tot +60,97 m, noordwestvleugel tot +55,0 m en installatiekasten tot +72,38 m (dakvlakken uit de 3D BAG, AHN5). Glazen plint van twee lagen (7,3 m) 1,2 m achter de bakstenen tafel met witte kolommen, onder de noordoostvleugel 2,5 m diep met twee hoekkolommen; op de zuidgevel een stapel grote balkons tot de kroon op +61 m, een lisene en een smalle stapel kleine balkons, glasbanden op de glazen delen, loggia's in de zuidgevel van de noordoostvleugel en blinde vensters in de bakstenen gevels. Oorsprong in het hart van de BAG-contour, X-as naar RD-oost. Laaghoogte, balkondiepte, vensterraster en kolomafstand zijn geschat uit foto's; de taak noemde het gebouw naar de straat (Ien Daleshof).",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      wingNapM: WING,
      northWestWingNapM: NW,
      plantNapM: [PLANT, PLANT2, HATCH],
      heightAboveGroundM: +(ROOF - GROUND).toFixed(2),
      floors: { plinth: 2, residential: 22 },
      plinthHeightM: PLINTH,
      storeyHeightM: STOREY,
      balconyDepthM: { west: 2.0, east: 1.4 },
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000753214 (bouwjaar 2009, Ien Daleshof), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000753214 (3D BAG LoD2.2, AHN5 2023, TU Delft/3DGI CC BY 4.0)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Rotterdam (Parktoren, 76 m, 24 verdiepingen, 2009)",
      "https://commons.wikimedia.org/wiki/File:Parktoren_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/Category:Parktoren_Rotterdam",
    ],
  },
});

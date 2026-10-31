// Gemini I en Gemini II aan het Rivium Quadrant (Rivium, Capelle aan den IJssel; VTBS, 1995 en 1998):
// twee kantoortorens van 19 lagen op het halfronde parkeerdek rond de vijver, zichtbaar vanaf de A16
// bij de Van Brienenoordbrug.
// - Gemini I (Rivium Quadrant 81, Schouten Zekerheid): vierkante toren met een kruis van witte armen,
//   per arm een gevel met vensters, een verticale sleuf en patrijspoorten bovenin; in de hoeken donkere
//   glazen blokken die in drie treden naar buiten aflopen; in het midden een hoger reclameblok met
//   vakwerkschermen opzij en een vakwerkkubus erop; aan de vijverkant een halfrond glazen entreepaviljoen.
// - Gemini II (Rivium Quadrant 141–181, ooit Ballast Nedam): witte west- en oostgevel met vensters,
//   donkere noord- en zuidgevel met glasbanden; bovenop een glazen opbouw van twee lagen met een pergola
//   langs de west- en zuidrand, een witte kroon met aan de noord- en zuidkant een donkere schijf die naar
//   het oosten rond afloopt, een installatieblok en aan de oostkant een lage aanbouw.
// Contouren uit de BAG, hoogtes uit de 3D BAG (LoD2.2) en het AHN-DSM, opstand en gevelindeling uit foto's.
import { Manifold, CrossSection, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "rivium-quadrant";
// Modelstelsel: u langs de zuidgevels naar het oostnoordoosten (11,32° op RD-oost; de BAG-randen van
// beide torens liggen binnen 0,05° op die richting), v naar het noordnoordwesten. Oorsprong midden
// tussen de twee torens, op het maaiveld aan de vijver.
const ORIGIN = [96607.2, 436508.25];
const ANGLE = 11.32;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const toModel = ([x, y]) => {
  const dx = x - ORIGIN[0], dy = y - ORIGIN[1];
  return [dx * AXIS[0] + dy * AXIS[1], -dx * AXIS[1] + dy * AXIS[0]];
};
const GROUND = 4.75; // NAP, AHN-DTM op de bestrating rond de vijver (4,69–4,80; 3D BAG-maaiveld 4,68 en 4,77)
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const DEPTH = 0.35; // diepte van vensternissen en glasbanden

// ---------- Gevelreliëf (gedeeld) ----------
// Een rand a→b van een linksom lopende contour; P(s, diepte, h) ligt op afstand s langs de rand, diepte
// naar binnen. Een nis is het omhulsel van het gat in het gevelvlak en hetzelfde gat diepte naar binnen en
// diepte omlaag: het plafond loopt onder 45° op naar de gevel.
function edgeFrame(a, b) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  return { L, P };
}
// Is de gevel op (s, h) buitengevel van body? Straal van 3 m buiten naar 1 m binnen.
function exposed(body, P, s, h) {
  const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
}
// Nis met omtrek outline [[s, h], ...] (convex, linksom) in het gevelvlak.
function niche(P, outline) {
  return Manifold.hull(outline.flatMap(([s, h]) => [P(s, -0.2, h + 0.2), P(s, DEPTH, h - DEPTH)]));
}
const rectNiche = (P, s0, s1, lo, hi) => niche(P, [[s0, lo + DEPTH], [s1, lo + DEPTH], [s1, hi], [s0, hi]]);
// Achthoekige patrijspoort met middelpunt (s, h) en straal r.
const porthole = (P, s, h, r) => niche(P, Array.from({ length: 8 }, (_, k) => {
  const t = Math.PI / 8 + (k * Math.PI) / 4;
  return [s + r * Math.cos(t), h + r * Math.sin(t)];
}));
// Glasband per laag achter een borstwering van `slab`, op elk stuk van de rand dat over minstens 0,9 m
// buitengevel is (per halve meter getest); `skip` = [s0, s1]-stukken die dicht blijven (witte penanten).
function bands(body, a, b, floors, cuts, { slab = 0.9, skip = [] } = {}) {
  const { L, P } = edgeFrame(a, b);
  for (const [zf, fh] of floors) {
    const lo = zf + slab, hi = zf + fh - DEPTH;
    if (hi - lo < 0.9) continue;
    let start = null;
    const flush = (s1) => {
      if (start !== null && s1 - start >= 0.9) cuts.push(rectNiche(P, start, s1, lo - DEPTH, hi));
      start = null;
    };
    for (let s = 0.75; s <= L - 0.75 + 1e-6; s += 0.5) {
      const ok = !skip.some(([s0, s1]) => s > s0 - 0.25 && s < s1 + 0.25) && [lo + 0.05, hi + DEPTH - 0.05].every((h) => exposed(body, P, s, h));
      if (ok && start === null) start = s;
      if (!ok) flush(s - 0.5);
    }
    flush(L - 0.75);
  }
}
const edges = (ring) => ccw(ring).map((p, i, r) => [p, r[(i + 1) % r.length]]);
const storeys = (ground, top, n) => [[0, ground], ...Array.from({ length: n }, (_, k) => [ground + ((top - ground) / n) * k, (top - ground) / n])];

// =====================================================================================================
// Gemini I (pand 0502100000021139, Rivium Quadrant 81, 1995). Stelsel rond het hart van de contour.
// =====================================================================================================
const GEMINI_I = {
  pand: "0502100000021139",
  centre: [96590.35, 436485.36], // hart van de BAG-contour (22,25 × 22,25 m)
  // Hoogtes NAP: 3D BAG LoD2.2 (puntwolk AHN3 2011); het AHN4-DSM bevestigt de zuidhelft (armen 68–69,
  // midden 77–79, hoektrede 61), de noordhelft is in het AHN4 ruis.
  arms: 67.8,
  tiers: [61.1, 44.2, 27.2], // hoekblokken, van de armen naar de buitenhoek
  core: 76.6, // reclameblok in het midden
  lattice: 83.8, // vakwerkkubus op het reclameblok (AHN4-DSM, hoogste punt 83,8)
  pavilion: 4.0, // halfrond glazen entreepaviljoen, hoogte boven maaiveld (geschat)
};
function geminiI() {
  const H = 11.125; // halve zijde (BAG 22,25 m)
  const N = 1.72; // inkeping in elke hoek (BAG)
  const W = 5.1; // halve breedte van de armen (3D BAG-trederanden ±5,0…5,6)
  const T = [1.5, 2.5]; // breedte van de 61,1- en 44,2-trede vanaf de armen (3D BAG)
  const footprint = [[-H + N, -H], [H - N, -H], [H - N, -H + N], [H, -H + N], [H, H - N], [H - N, H - N], [H - N, H], [-H + N, H], [-H + N, H - N], [-H, H - N], [-H, -H + N], [-H + N, -H + N]];
  const floors = storeys(5.0, z(GEMINI_I.arms), 18);

  // Hoekblok in het kwadrant (sx, sy): de hele hoek tot de laagste trede, het L-vormige stuk langs de
  // armen tot de hogere treden. In (p, q) = afstand vanaf de armen naar buiten.
  const quad = (sx, sy, pts) => pts.map(([p, q]) => [sx * (W + p), sy * (W + q)]);
  const outer = H - W; // 6,025
  const cornerRings = [];
  const cornerSolids = [];
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    const full = quad(sx, sy, [[-0.1, -0.1], [outer, -0.1], [outer, outer - N], [outer - N, outer - N], [outer - N, outer], [-0.1, outer]]);
    const lShape = (t) => quad(sx, sy, [[-0.1, -0.1], [outer, -0.1], [outer, t], [t, t], [t, outer], [-0.1, outer]]);
    const rings = [[full, GEMINI_I.tiers[2]], [lShape(T[1]), GEMINI_I.tiers[1]], [lShape(T[0]), GEMINI_I.tiers[0]]];
    for (const [ring, top] of rings) {
      cornerSolids.push(prism(ring, BASE, z(top)));
      cornerRings.push([ring, top]);
    }
  }
  const armRings = [rect(-W, -H, W, H), rect(-H, -W, H, W)];
  const core = rect(-W, -W, W, W);
  // Vakwerkschermen naast het reclameblok op de oost- en westarm (foto's): 1,2 m dik, 5 m lang.
  const screens = [rect(W - 0.1, -2.5, W + 1.2, 2.5), rect(-W - 1.2, -2.5, -W + 0.1, 2.5)];
  // Vakwerkkubus: vier stijlen van 0,9 m op een vierkant van 5,1 m, bovenin balken met een
  // V-vormige onderkant onder 45°; de mast erop is dunner dan 0,9 m.
  const post = 0.9, half = 2.55, top = z(GEMINI_I.lattice);
  const latticeParts = [];
  for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
    latticeParts.push(prism(rect(Math.min(sx * half, sx * (half - post)), Math.min(sy * half, sy * (half - post)), Math.max(sx * half, sx * (half - post)), Math.max(sy * half, sy * (half - post))), z(GEMINI_I.core) - 0.1, top));
  }
  const inner = half - post; // 1,65
  for (const rot of [0, 90, 180, 270]) {
    for (const side of [-1, 1]) {
      // Halve balk langs de rand v = half, van de stijl (s = side*inner) tot het midden (s = 0).
      const pts = [];
      for (const [s, bottom] of [[side * (inner + 0.1), top - post - inner - 0.2], [0, top - post]]) {
        for (const v of [half - post, half]) pts.push([s, v, bottom], [s, v, top]);
      }
      latticeParts.push(Manifold.hull(pts).rotate([0, 0, rot]));
    }
  }
  // Entreepaviljoen: halve schijf van 6,5 m straal tegen het midden van de zuidgevel (orthofoto).
  const pav = [[-6.5, -H + 0.1], ...Array.from({ length: 13 }, (_, k) => {
    const t = Math.PI + (k * Math.PI) / 12;
    return [6.5 * Math.cos(t), -H + 5.8 * Math.sin(t)];
  }).slice(1, -1), [6.5, -H + 0.1]];

  const body = union([
    ...armRings.map((r) => prism(r, BASE, z(GEMINI_I.arms))),
    ...cornerSolids,
    prism(core, BASE, z(GEMINI_I.core)),
    ...screens.map((r) => prism(r, z(GEMINI_I.arms) - 0.1, z(GEMINI_I.core))),
    ...latticeParts,
    prism(pav, BASE, GEMINI_I.pavilion),
  ]).intersect(union([prism(footprint, BASE - 1, 200), prism(pav, BASE - 1, 200), prism(rect(-W - 1.3, -W, W + 1.3, W), BASE - 1, 200)]));

  const cuts = [];
  // Witte kop van elke arm: per laag twee vensters van 1,2 m links en rechts van een verticale sleuf van
  // 1,2 m; in de bovenste twee lagen per kant één patrijspoort (foto's).
  for (const [a, b] of [[[-W, -H], [W, -H]], [[H, -W], [H, W]], [[W, H], [-W, H]], [[-H, W], [-H, -W]]]) {
    const { L, P } = edgeFrame(a, b), mid = L / 2;
    cuts.push(Manifold.hull([P(mid - 0.6, -0.2, 5.0), P(mid + 0.6, -0.2, 5.0), P(mid - 0.6, 0.4, 5.0), P(mid + 0.6, 0.4, 5.0), P(mid - 0.6, -0.2, z(GEMINI_I.arms) + 1), P(mid + 0.6, -0.2, z(GEMINI_I.arms) + 1), P(mid - 0.6, 0.4, z(GEMINI_I.arms) + 1), P(mid + 0.6, 0.4, z(GEMINI_I.arms) + 1)]));
    floors.forEach(([zf, fh], k) => {
      if (k >= floors.length - 2) {
        for (const s of [mid - 2.6, mid + 2.6]) if (exposed(body, P, s, zf + fh / 2)) cuts.push(porthole(P, s, zf + fh / 2 + 0.1, 1.0));
        return;
      }
      const lo = zf + (k === 0 ? 1.2 : 0.9), hi = zf + fh - 0.35 - DEPTH;
      for (const c of [-3.7, -1.9, 1.9, 3.7]) {
        const s0 = mid + c - 0.6, s1 = mid + c + 0.6;
        if ([s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => exposed(body, P, s, h)))) cuts.push(rectNiche(P, s0, s1, lo, hi));
      }
    });
  }
  // Donkere hoekblokken: per laag een glasband achter een borstwering, op elke buitengevel van elke trede.
  for (const [ring, top] of cornerRings) {
    const f = floors.filter(([zf, fh]) => zf + fh <= z(top) + 0.01);
    for (const [a, b] of edges(ring)) if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 0.9) bands(body, a, b, f, cuts);
  }
  // Vakwerkschermen: drie rijen van twee blinde vakken op de buitenkant.
  for (const sx of [1, -1]) {
    const a = [sx * (W + 1.2), -sx * 2.5], b = [sx * (W + 1.2), sx * 2.5];
    const { P } = edgeFrame(a, b);
    for (let k = 0; k < 3; k++) {
      const lo = z(GEMINI_I.arms) + 0.6 + k * 2.75, hi = lo + 1.6;
      for (const [s0, s1] of [[0.6, 2.2], [2.8, 4.4]]) cuts.push(rectNiche(P, s0, s1, lo, hi));
    }
  }
  // Paviljoen: glazen gevel boven een plint van 0,9 m, rondom.
  {
    const ring = ccw(pav);
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      if (Math.abs(a[1] - b[1]) < 0.01 && a[1] > -H) continue; // zijde tegen de toren
      const { L, P } = edgeFrame(a, b);
      if (L < 1.4) continue;
      if (exposed(body, P, L / 2, 2.0)) cuts.push(rectNiche(P, 0.2, L - 0.2, 0.9, GEMINI_I.pavilion - 0.5));
    }
  }
  return body.subtract(union(cuts));
}

// =====================================================================================================
// Gemini II (pand 0502100000021143, Rivium Quadrant 141–181, 1998). Stelsel rond het BAG-zwaartepunt.
// =====================================================================================================
const GEMINI_II = {
  pand: "0502100000021143",
  centre: [96624.0, 436531.0],
  // Hoogtes NAP: 3D BAG LoD2.2 (puntwolk AHN4 2020) en AHN4-DSM in de zuidhelft (de noordhelft is ruis).
  shaft: 68.0, // witte en donkere gevels (3D BAG 67,9–68,0; zuidrand 68,6)
  glass: 74.7, // glazen opbouw met pergola (3D BAG 74,7, DSM 75)
  crown: 81.6, // witte kroon (3D BAG 81,6, DSM 82)
  blade: 82.9, // donkere schijven aan de noord- en zuidkant van de kroon (3D BAG 82,9, DSM 83)
  bladeEnd: 79.4, // oosteinde van de schijven na de ronding (foto vanaf de A16, ~3,5 m lager; geschat)
  plant: 84.2, // installatieblok (3D BAG 84,2)
  annex: 12.9, // lage aanbouw aan de oostkant (3D BAG 12,9)
};
function geminiII() {
  // BAG-contour in het torenstelsel (hoeken < 0,9 m weggelaten): vierkant met ingekeepte zuidhoeken,
  // een gebogen noordgevel en een uitbouw van 2,9 m aan de noordkant.
  const shaft = [[-14.04, -8.52], [-12.2, -8.52], [-12.2, -10.34], [6.42, -10.34], [6.42, -8.48], [8.22, -8.48], [8.22, 8.25], [6.1, 8.94], [5.02, 9.22], [5.8, 12.1], [-11.61, 12.08], [-10.84, 9.19], [-12.66, 8.7], [-14.04, 8.23]];
  const annex = [[8.0, -7.74], [10.24, -7.74], [12.17, -4.35], [15.9, 2.18], [12.6, 4.33], [9.29, 5.95], [8.0, 6.35]];
  const glass = rect(-12.4, -8.5, 7.2, 8.5);
  const CU0 = -9.6, CU1 = 3.7; // kroon in u (3D BAG -10,8…4,9, scheef; geregulariseerd)
  const CV0 = -5.8, CV1 = 8.5; // kroon in v (noordrand in het AHN4 onbetrouwbaar)
  const floors = storeys(5.0, z(GEMINI_II.shaft), 18);
  const glassFloors = [[z(GEMINI_II.shaft), 3.35], [z(GEMINI_II.shaft) + 3.35, z(GEMINI_II.glass) - z(GEMINI_II.shaft) - 3.35]]; // twee lagen

  // Kroonprofiel in (u, z): vlak tot u = 0,2, dan een kwartellips naar bladeEnd op de oostrand.
  const profile = (topZ) => {
    const r = CU1 - 0.2, drop = z(GEMINI_II.blade) - z(GEMINI_II.bladeEnd);
    const pts = [[CU0, z(GEMINI_II.glass) - 0.1], [CU1, z(GEMINI_II.glass) - 0.1]];
    for (let k = 0; k <= 12; k++) {
      const t = (k * Math.PI) / 24; // 0 … 90°
      pts.push([0.2 + r * Math.cos(t), z(GEMINI_II.blade) - drop + drop * Math.sin(t)]);
    }
    pts.push([CU0, z(GEMINI_II.blade)]);
    return pts.map(([u, h]) => [u, Math.min(h, topZ)]);
  };
  // Extrudeer een (u, z)-profiel langs v van v0 tot v1.
  const alongV = (pts, v0, v1) => Manifold.extrude(new CrossSection([ccw(pts)]), v1 - v0).rotate([90, 0, 0]).translate([0, v1, 0]);
  const crown = union([
    alongV(profile(z(GEMINI_II.crown)), CV0, CV1),
    alongV(profile(z(GEMINI_II.blade)), CV0, CV0 + 2.0),
    alongV(profile(z(GEMINI_II.blade)), CV1 - 2.0, CV1),
  ]);
  // Pergola langs de west- en zuidrand van de glazen opbouw: plaat van 1,5 m dik met de bovenkant op
  // het dak van de opbouw, 2,2 m (west) en 2,4 m (zuid) uitkragend, met een kraag onder 45°.
  const top = z(GEMINI_II.glass), bot = top - 1.5;
  const pergola = [
    Manifold.hull([-14.6, -12.3].flatMap((u) => [-10.9, 8.5].flatMap((v) => [[u, v, top], [u, v, u === -14.6 ? bot : bot - 2.4]]))),
    Manifold.hull([-10.9, -8.4].flatMap((v) => [-14.6, 7.2].flatMap((u) => [[u, v, top], [u, v, v === -10.9 ? bot : bot - 2.6]]))),
  ];
  const body = union([
    prism(shaft, BASE, z(GEMINI_II.shaft)),
    prism(annex, BASE, z(GEMINI_II.annex)),
    prism(glass, z(GEMINI_II.shaft) - 0.1, z(GEMINI_II.glass)),
    ...pergola,
    crown,
    prism(rect(-5.2, -1.4, -0.3, 3.4), z(GEMINI_II.crown) - 0.1, z(GEMINI_II.plant)),
  ]);

  const cuts = [];
  for (const [a, b] of edges(shaft)) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 2) continue;
    const alongU = Math.abs(b[1] - a[1]) < 0.5 * L;
    const { P } = edgeFrame(a, b);
    if (alongU) {
      // Donkere noord- en zuidgevel: glasbanden per laag, met een witte penant van 2,4 m in het midden
      // (foto's).
      bands(body, a, b, floors, cuts, { skip: L > 12 ? [[L / 2 - 1.2, L / 2 + 1.2]] : [] });
    } else {
      // Witte west- en oostgevel: vensters van 1,5 m op een travee van 2,7 m.
      const pitch = 2.7, width = 1.5, bays = Math.floor((L - 0.9) / pitch), w = (L - bays * pitch) / 2;
      floors.forEach(([zf, fh], k) => {
        const lo = zf + (k === 0 ? 1.2 : 0.9), hi = zf + fh - 0.35 - DEPTH;
        for (let j = 0; j < bays; j++) {
          const s0 = w + j * pitch + (pitch - width) / 2, s1 = s0 + width;
          if ([s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => exposed(body, P, s, h)))) cuts.push(rectNiche(P, s0, s1, lo, hi));
        }
      });
    }
  }
  // Glazen opbouw en aanbouw: glasbanden rondom.
  for (const [a, b] of edges(glass)) bands(body, a, b, glassFloors, cuts, { slab: 0.6 });
  for (const [a, b] of edges(annex)) bands(body, a, b, [[0, 4.0], [4.0, z(GEMINI_II.annex) - 4.0]], cuts, { slab: 1.0 });
  return body.subtract(union(cuts));
}

const nodes = [];
for (const [label, build, t] of [["gemini-i", geminiI, GEMINI_I], ["gemini-ii", geminiII, GEMINI_II]]) {
  const [cu, cv] = toModel(t.centre);
  const m = build().translate([cu, cv, 0]);
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${label}: ${parts.length} losse delen`);
  console.log(label, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "hart", [cu, cv].map((x) => +x.toFixed(2)));
  nodes.push([`building:${slug}-${label}`, m]);
}

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Gemini I en II (Rivium Quadrant)",
    origin: ORIGIN,
    xAxis: AXIS.map((x) => +x.toFixed(6)),
    groundNap: GROUND,
    groundHeight: 48.25, // NAP + 43,50 (geoïde NLGEO2018 43,60; ijking op Ien Dalesshof en Hoge Maas)
    groundOffsetMetres: -0.15,
    // Bestrating rond de vijver (AHN-DTM 4,70–4,80); het parkeerdek rond de torens ligt 2 m hoger en de
    // vijver lager.
    groundSamplePoints: [[30.9, 7.0], [2.9, 5.0], [-7.9, -23.0], [-7.9, -13.0]],
    replacesBuildings: [`NL.IMBAG.Pand.${GEMINI_I.pand}`, `NL.IMBAG.Pand.${GEMINI_II.pand}`],
    description:
      "De twee kantoortorens Gemini I (Rivium Quadrant 81, 1995) en Gemini II (Rivium Quadrant 141–181, 1998) van VTBS op het Rivium in Capelle aan den IJssel, beide op hun BAG-contour. Gemini I: een kruis van witte armen tot NAP +67,8 m met per armkop vensters, een verticale sleuf en patrijspoorten, donkere hoekblokken in treden van +61,1, +44,2 en +27,2 m, een reclameblok tot +76,6 m met vakwerkschermen opzij, een vakwerkkubus tot +83,8 m en een halfrond entreepaviljoen aan de vijver. Gemini II: witte west- en oostgevel met vensters en donkere noord- en zuidgevel met glasbanden tot +68,0 m, een glazen opbouw tot +74,7 m met een pergola langs de west- en zuidrand, een witte kroon tot +81,6 m met aan noord- en zuidkant een donkere schijf tot +82,9 m die naar het oosten rond afloopt, een installatieblok tot +84,2 m en een aanbouw tot +12,9 m. Hoogtes uit de 3D BAG en het AHN-DSM. Oorsprong midden tussen de torens, X-as langs de zuidgevels (11,32° op RD-oost). Verdiepingshoogtes, gevelindeling, de schermen, de pergola, de ronding van de schijven en het paviljoen zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      geminiI: { armsNapM: GEMINI_I.arms, cornerTiersNapM: GEMINI_I.tiers, coreNapM: GEMINI_I.core, latticeNapM: GEMINI_I.lattice, pavilionHeightM: GEMINI_I.pavilion, sideM: 22.25 },
      geminiII: { shaftNapM: GEMINI_II.shaft, glassNapM: GEMINI_II.glass, crownNapM: GEMINI_II.crown, bladeNapM: GEMINI_II.blade, bladeEndNapM: GEMINI_II.bladeEnd, plantNapM: GEMINI_II.plant, annexNapM: GEMINI_II.annex },
      floors: 19,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0502100000021139 (bouwjaar 1995) en 0502100000021143 (bouwjaar 1998), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG LoD2.2",
      "https://nl.wikipedia.org/wiki/Rivium",
      "https://www.pss-archi.eu/immeubles/NL-502-73261.html",
      "https://www.pss-archi.eu/immeubles/NL-502-73260.html",
      "https://commons.wikimedia.org/wiki/File:Capelle_ad_IJssel,_zicht_op_het_Rivium_foto1_2013-07-07_15.56.jpg",
      "https://commons.wikimedia.org/wiki/File:Rivium.jpg",
      "https://commons.wikimedia.org/wiki/File:Capelle_aan_den_IJssel_-_Rivium_-_kantoorgebouw.jpg",
    ],
  },
});

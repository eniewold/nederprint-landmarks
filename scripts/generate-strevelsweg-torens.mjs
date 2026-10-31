// Poort van Zuid (Rotterdam-Zuid, Klunder Architecten): twee identieke woontorens van 24 lagen aan weerszijden
// van de Strevelsweg bij winkelcentrum Zuidplein, de westelijke (huur, 1993) en een jaar later de oostelijke
// (koop, 1994). Elke toren is een lange schijf op de as NNO–ZZW: aan de straatkant een bruine schijf tot de
// volle hoogte met aan beide koppen een smalle staart, daarachter een witte, één laag lagere schijf waarvan de
// lange buitengevel in drie treden naar buiten springt ("getrapte gevel"). In elke trede staat een stapel
// balkons die op het zuiden uitkijkt. Verder een balkonstapel op de zuidkop en één aan de straatkant bij de
// noordkop, een doorlopende sleuf met vluchtbalkons midden in de straatgevel, een liftopbouw, en een onderbouw
// met winkels langs de straat en een parkeerdek met een hellingbaan aan de buitenkant.
// Contouren uit de BAG, dak- en balkonhoogtes en de treden uit de 3D BAG (LoD2.2, AHN5 2022) en het AHN-DSM,
// gevelindeling uit foto's.
import { Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "strevelsweg-torens";
// Modelstelsel: X langs de lange as van de torens (RD-richting 81,58°, naar het NNO), Y 90° linksom (WNW).
// Oorsprong midden op de Strevelsweg tussen de twee torens.
const ORIGIN = [93405.0, 433581.5];
const AXIS_DEG = 81.58;
const AXIS = [Math.cos((AXIS_DEG * Math.PI) / 180), Math.sin((AXIS_DEG * Math.PI) / 180)];
const GROUND = -1.25; // NAP, maaiveld rond de torens (AHN-DTM -1,2; 3D BAG -1,28 en -1,37)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Verdiepingen ----------
// 24 verdiepingen boven de begane grond (Rotterdam-woont), tunnelbekisting. De bruine schijf (dak NAP +66,6)
// telt één laag meer dan de witte (+64,0); de balkonstapels houden op bij +61,0.
const GROUND_FLOOR = 3.05;
const STOREY = 2.7;
const level = (k) => (k === 0 ? 0 : GROUND_FLOOR + STOREY * (k - 1));
const FLOORS = Array.from({ length: 23 }, (_, k) => [level(k + 2), STOREY]); // lagen 2..24

// ---------- Torens ----------
// Per toren een eigen stelsel (s, t) met RD-oorsprong `frame` en dezelfde as; s langs de as, t 90° linksom.
// Gevelmaten in (s, w): w is de afstand vanaf de straatgevel naar buiten, t = road + dir · w.
// brown/white: trapveelhoeken als [s0, s1, w-buitengevel] per stuk, vanaf w = 0.
// stacks: balkonstapels als [s0, s1, w0, w1, open] met open = kant waar de balkons openliggen
// ("w+" buitengevel, "w-" straatkant, "s-" zuidkop); de bovenkant is STACK_TOP.
// plinth/ramp/boxes in (s, t) uit de BAG-contour en de 3D BAG.
const ROOF_BROWN = 66.6; // NAP, 3D BAG 66,54–66,61, DSM-mediaan 66,6
const ROOF_WHITE = 64.0; // 3D BAG 63,85–64,13
const STACK_TOP = 61.0; // 3D BAG 60,97–61,07 op alle stapels
const TOWERS = [
  {
    name: "oost",
    label: "Poort van Zuid 1994",
    pand: "0599100000678559",
    frame: [93445.0, 433578.0],
    road: 10.65,
    dir: -1,
    brown: [[-29.5, -25.3, 6.0], [-25.3, -16.5, 9.65], [-16.5, -11.5, 11.15], [-11.5, 3.75, 12.15], [3.75, 12.75, 11.15], [12.75, 17.2, 6.0]],
    white: [[-25.3, -20.25, 13.55], [-20.25, -9.0, 15.05], [-9.0, 1.75, 16.85], [1.75, 12.75, 18.75]],
    stacks: [
      [-25.3, -20.25, 13.55, 15.05, "w+"],
      [-14.5, -9.0, 15.05, 16.85, "w+"],
      [-3.6, 1.75, 16.85, 18.75, "w+"],
      [7.1, 12.9, 18.75, 20.55, "w+"],
      [8.4, 14.0, -1.55, 0, "w-"],
      [-30.8, -29.5, 0.25, 5.75, "s-"],
    ],
    lift: [-8.9, -3.0, 3.65, 9.8, 70.6],
    kast: null,
    slot: [-8.25, -4.05],
    plinthTop: 4.5, // parkeerdek 4,36–4,79, winkels 4,26–4,33
    plinth: [[-16.84, 14.45], [-16.85, 10.71], [-29.46, 10.7], [-29.47, 4.64], [-25.3, 4.64], [-25.16, -7.89], [-27.42, -10.6], [1.71, -34.97], [28.05, -3.55], [21.43, 2.01], [22.74, 4.76], [22.68, 7.72], [21.19, 10.28], [19.75, 11.34], [18.07, 11.93], [-5.86, 14.55]],
    // Hellingbaan langs de zuidoostrand van het dek, 10° omlaag naar het noordoosten (3D BAG 5,04 → 1,76).
    ramp: [[[-15.54, -13.5], [-19.02, -17.64], 4.5], [[-3.74, -23.45], [-7.22, -27.5], 1.76]],
    boxes: [{ ring: [[-3.51, -23.23], [-0.28, -19.07], [-2.93, -16.7], [-6.03, -20.52]], top: 6.83 }], // trappenhuis op het dek
  },
  {
    name: "west",
    label: "Poort van Zuid 1993",
    pand: "0599100000651925",
    frame: [93365.0, 433585.0],
    road: -3.6,
    dir: 1,
    brown: [[-24.7, -14.0, 6.0], [-14.0, -11.0, 10.2], [-11.0, -5.75, 11.3], [-5.75, 9.25, 12.2], [9.25, 12.25, 11.3], [12.25, 21.9, 6.0]],
    white: [[-20.5, -14.5, 13.35], [-14.5, -3.9, 15.15], [-3.9, 7.0, 16.9], [7.0, 18.0, 18.7]],
    stacks: [
      [-20.3, -14.5, 13.35, 15.15, "w+"],
      [-8.7, -3.9, 15.15, 16.9, "w+"],
      [1.15, 7.0, 16.9, 18.7, "w+"],
      [11.9, 17.7, 18.7, 20.3, "w+"],
      [13.4, 18.7, -1.6, 0, "w-"],
      [-26.0, -24.7, 0.25, 5.65, "s-"],
    ],
    lift: [-4.4, 1.6, 3.3, 9.6, 70.57],
    kast: [9.5, 12.15, 6.0, 7.66, 67.6],
    slot: [-3.4, 0.8],
    plinthTop: 4.4, // parkeerdek 4,25–4,60, winkels 4,22
    plinth: [[-15.89, 31.74], [-17.82, 31.17], [-19.58, 30.11], [-21.83, 27.25], [-25.85, 10.74], [-25.41, 10.62], [-25.23, 11.25], [-20.47, 10.19], [-20.53, 2.48], [-24.69, 2.47], [-24.7, -3.62], [-12.04, -3.61], [-12.06, -7.36], [-9.6, -7.49], [1.35, -7.22], [22.82, -4.85], [23.99, -4.56], [25.97, -3.22], [27.63, -0.06], [27.1, 3.49], [25.65, 5.37], [23.51, 6.62], [27.19, 22.3], [-12.72, 31.66]],
    // Gebogen hellingbaan om de zuidwesthoek van het dek (3D BAG 4,79 → 1,42), als doorsneden binnen/buiten.
    ramp: [
      [[-12.6, 30.9], [-13.3, 31.8], 4.4],
      [[-14.85, 27.96], [-18.12, 31.03], 3.9],
      [[-16.95, 25.09], [-21.04, 28.59], 3.18],
      [[-18.95, 19.08], [-23.05, 22.66], 2.0],
      [[-18.92, 17.92], [-24.22, 17.69], 1.6],
    ],
    boxes: [{ ring: [[-20.93, 10.83], [-20.15, 12.05], [-23.57, 12.58], [-24.94, 11.18], [-21.29, 10.37]], top: [5.22, 5.09, 5.87, 6.13, 5.28] }], // schuine kap op het dek
  },
];

// Vensters als blinde nissen met een plafond onder 45°: bruine gevels kleine vierkante ramen, witte gevels
// liggende ramen (foto's).
const DEPTH = 0.35;
const WINDOWS = { brown: { pitch: 2.2, width: 1.2, open: 1.35 }, white: { pitch: 3.0, width: 1.8, open: 0.9 } };
const SLOT_DEPTH = 1.5; // sleuf met vluchtbalkons in de straatgevel
const SLOT_TOP = z(ROOF_BROWN) - 3.4;

const offset = (frame) => {
  const d = [frame[0] - ORIGIN[0], frame[1] - ORIGIN[1]];
  return [d[0] * AXIS[0] + d[1] * AXIS[1], -d[0] * AXIS[1] + d[1] * AXIS[0]];
};
const stairPoly = (ranges) => [[ranges[0][0], 0], [ranges.at(-1)[1], 0], ...[...ranges].reverse().flatMap(([s0, s1, w]) => [[s1, w], [s0, w]])];

function tower(T) {
  const [os, ot] = offset(T.frame);
  const st = ([s, t]) => [s + os, t + ot]; // (s, t) → model
  const sw = ([s, w]) => [s + os, T.road + T.dir * w + ot]; // (s, w) → model
  const swz = (s, w, h) => [...sw([s, w]), h];

  // Onderbouw: winkels en parkeerdek op de BAG-contour, met de hellingbaan erin verdiept.
  let plinth = prism(T.plinth.map(st), BASE, z(T.plinthTop));
  const rampCuts = [];
  for (let i = 0; i + 1 < T.ramp.length; i++) {
    const pts = [T.ramp[i], T.ramp[i + 1]].flatMap(([a, b, nap]) => [a, b].flatMap((p) => [[...st(p), z(nap)], [...st(p), z(nap) + 20]]));
    rampCuts.push(Manifold.hull(pts));
  }
  plinth = plinth.subtract(union(rampCuts));
  const boxes = T.boxes.map(({ ring, top }) => Manifold.hull(ring.flatMap((p, i) => [[...st(p), z(T.plinthTop) - 0.2], [...st(p), z(Array.isArray(top) ? top[i] : top)]])));

  // Schijven.
  const brownPoly = stairPoly(T.brown).map(sw);
  const whitePoly = stairPoly(T.white).map(sw);
  const brown = prism(brownPoly, BASE, z(ROOF_BROWN));
  const white = prism(whitePoly, BASE, z(ROOF_WHITE));
  const [l0, l1, lw0, lw1, ltop] = T.lift;
  const lift = prism(rect(l0, lw0, l1, lw1).map(sw), z(ROOF_BROWN) - 0.1, z(ltop));
  const kast = T.kast && prism(rect(T.kast[0], T.kast[2], T.kast[1], T.kast[3]).map(sw), z(ROOF_BROWN) - 0.1, z(T.kast[4]));

  // Balkonstapels: blok tot STACK_TOP met een kraag onder 45° naar de gevel; per laag een open balkon
  // (0,9 m diep vanaf de buitenrand, borstwering 1,0 m, plafond onder 45°).
  const stacks = [], stackCuts = [];
  for (const [s0, s1, w0, w1, open] of T.stacks) {
    const top = z(STACK_TOP);
    const bottom = open === "s-" ? level(3) : level(2);
    if (open === "s-") {
      // Zuidkop: de stapel hangt aan de kopgevel (s1); kraag van de buitenrand s0 terug naar de gevel.
      const D = s1 - s0;
      stacks.push(Manifold.hull([w0, w1].flatMap((w) => [swz(s0, w, top), swz(s1 + 0.1, w, top), swz(s0, w, bottom), swz(s1 + 0.1, w, bottom - D - 0.1)])));
      for (const [zf, fh] of FLOORS) {
        const lo = zf + 1.0, hi = zf + fh - 0.3 - 0.9;
        if (zf < bottom - 0.01 || hi + 1.1 > top - 0.3) continue;
        stackCuts.push(Manifold.hull([w0 + 0.9, w1 - 0.9].flatMap((w) => [swz(s0 - 0.2, w, lo), swz(s0 + 0.9, w, lo), swz(s0 - 0.2, w, hi + 0.9 + 0.2), swz(s0 + 0.9, w, hi)])));
      }
      continue;
    }
    // w+: buitenrand bij w1, gevel bij w0; w-: buitenrand bij w0 (straatkant), gevel bij w1.
    const [face, edge, sign] = open === "w+" ? [w0, w1, 1] : [w1, w0, -1];
    const D = Math.abs(edge - face);
    stacks.push(Manifold.hull([s0, s1].flatMap((s) => [swz(s, face - 0.1 * sign, top), swz(s, edge, top), swz(s, edge, bottom), swz(s, face - 0.1 * sign, bottom - D - 0.1)])));
    for (const [zf, fh] of FLOORS) {
      const lo = zf + 1.0, hi = zf + fh - 0.3 - 0.9;
      if (zf < bottom - 0.01 || hi + 1.1 > top - 0.3) continue;
      // Open naar buiten en naar het zuiden (s0); aan de noordkant 0,9 m wand.
      stackCuts.push(Manifold.hull([s0 - 0.2, s1 - 0.9].flatMap((s) => [swz(s, edge + 0.2 * sign, lo), swz(s, edge - 0.9 * sign, lo), swz(s, edge + 0.2 * sign, hi + 0.9 + 0.2), swz(s, edge - 0.9 * sign, hi)])));
    }
  }

  // Sleuf met vluchtbalkons midden in de straatgevel, van de winkelonderbouw tot drie lagen onder het dak.
  const [q0, q1] = T.slot;
  const slot = Manifold.hull([q0, q1].flatMap((s) => [swz(s, -0.2, level(2) + 0.1), swz(s, SLOT_DEPTH, level(2) + 0.1), swz(s, -0.2, SLOT_TOP + SLOT_DEPTH + 0.2), swz(s, SLOT_DEPTH, SLOT_TOP)]));

  let body = union([plinth, ...boxes, brown, white, lift, kast, ...stacks]).subtract(union([...stackCuts, slot]));

  // Vensterraster: per gevel van de bruine en witte schijf, per laag, alleen waar de gevel vrij ligt.
  const cuts = [];
  for (const [poly, kind, roofZ] of [[brownPoly, "brown", z(ROOF_BROWN)], [whitePoly, "white", z(ROOF_WHITE)]]) {
    const { pitch, width, open: oh } = WINDOWS[kind];
    const ring = ccw(poly);
    ring.forEach((a, i) => {
      const b = ring[(i + 1) % ring.length];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L < 3.5) return;
      const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]]; // n naar buiten
      const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
      const bays = Math.floor((L - 0.9) / pitch), m = (L - bays * pitch) / 2;
      for (const [zf, fh] of FLOORS) {
        const lo = zf + (fh - oh) / 2 + 0.1, hi = lo + oh - DEPTH;
        if (hi + DEPTH + 0.2 > roofZ - 0.3) continue;
        for (let k = 0; k < bays; k++) {
          const s0 = m + k * pitch + (pitch - width) / 2, s1 = s0 + width;
          const exposed = [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
            const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
            const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
            return at > 2.95 && at < 3.05;
          }));
          if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
        }
      }
    });
  }
  console.log(T.name, "vensters", cuts.length);
  return body.subtract(union(cuts));
}

const nodes = TOWERS.map((T) => {
  const m = tower(T);
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${T.name}: ${parts.length} losse delen`);
  console.log(T.name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [`building:${slug}-${T.name}`, m];
});

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Poort van Zuid",
    origin: ORIGIN,
    xAxis: [+AXIS[0].toFixed(5), +AXIS[1].toFixed(5)],
    groundNap: GROUND,
    groundHeight: 42.26, // NAP -1,25 + geoïde NLGEO2018 43,63 - 0,12 (zelfde afwijking als Ien Daleshof en Hoge Maas)
    groundOffsetMetres: -0.15,
    replacesBuildings: TOWERS.map((T) => `NL.IMBAG.Pand.${T.pand}`),
    description:
      "Poort van Zuid (Klunder Architecten): twee identieke woontorens aan weerszijden van de Strevelsweg bij Zuidplein, de westelijke uit 1993 en de oostelijke uit 1994. Per toren een bruine schijf langs de straat tot NAP +66,6 m met smalle staarten aan beide koppen, een witte schijf erachter tot +64,0 m waarvan de buitengevel in drie treden naar buiten springt, in elke trede en aan de zuidkop een balkonstapel tot +61,0 m met per laag een open balkon, een balkonstapel aan de straatkant bij de noordkop, een sleuf met vluchtbalkons midden in de straatgevel, een liftopbouw tot +70,6 m, vensterrasters per laag, en de onderbouw met winkels en parkeerdek (+4,5 en +4,4 m) op de BAG-contour met de hellingbaan. Contouren uit de BAG, hoogtes en treden uit de 3D BAG (LoD2.2, AHN5) en het AHN-DSM. Oorsprong midden op de Strevelsweg tussen de torens, X-as langs de lange as van de torens (RD-richting 81,6°). Verdiepingshoogte, vensterraster, de sleuf en de balkonopeningen zijn geschat uit foto's; de taaknaam 'Torens Strevelsweg' en het woord kantoortorens kloppen niet.",
    realWorld: {
      groundNapM: GROUND,
      roofBrownNapM: ROOF_BROWN,
      roofWhiteNapM: ROOF_WHITE,
      liftNapM: 70.6,
      balconyTopNapM: STACK_TOP,
      plinthNapM: [4.5, 4.4],
      floors: 24,
      storeyHeightM: STOREY,
      apartments: 252,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0599100000651925 (bouwjaar 1994) en 0599100000678559 (bouwjaar 1995), 3D BAG LoD2.2 (AHN5 2022), AHN-DSM en -DTM 0,5 m, actuele orthoHR",
      "https://rotterdamwoont.nl/app/uploads/2018/01/5.1993.3-projectblad-Poort-van-Zuid-3.pdf",
      "https://hoog500.nl/gebouw/poort_van_zuid_1993-10299",
      "https://commons.wikimedia.org/wiki/Category:Poort_van_Zuid_(Rotterdam)",
    ],
  },
});

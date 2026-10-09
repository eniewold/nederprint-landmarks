// Genereert een gedetailleerd, gesloten 3D-model van het Rat Verlegh Stadion in
// Breda (thuisstadion van NAC Breda, 1996). Het model vervangt de
// PDOK-reconstructie van de acht BAG-panden van het stadion (vier tribunes en
// vier hoektorens) en bestaat uit: een gesloten ring van vier tribunes met
// verstekhoeken, per zijde één doorsnede die langs de zijde is uitgetrokken (een
// zitrang van tien treden van +3,0 tot +13,3 m onder het dak, aan de lange
// zijden een extra voorste rij van 2025, de schuin oplopende onderkant van de
// rang die buiten boven de lage aanbouwen zichtbaar is, een achterwand met een
// glazen band aan de binnenzijde, de vakwerkligger langs de veldopening en de
// dakplaat met spanten eronder); per traveelijn (10,9 m) een betonnen spant
// buiten de achterwand (kolom, schuine ligger onder de rang en een schoor met
// het groene vakwerk tot de dakrand); de bakstenen aanbouwen met hun gebogen
// gevels (noordwest drie lagen met de hoofdingang, zuidoost drie lagen,
// noordoost en zuidwest twee lagen) met raamnissen; de vier hoektorens van vier
// lagen met raamnissen en de kolommen naar het dak erboven; de vier lichtmasten
// op de dakhoeken; de dug-outs en de buitentrap aan de zuidwestkant. Alles is
// opgebouwd uit convexe rompen van vlakken, prisma's en cirkelbogen (geen
// hoogteveld); het Mapbox-model is niet gebruikt. Alle maten zijn meters op
// ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-rat-verlegh-stadion.mjs              # 1:1000 (standaard)
//   node scripts/generate-rat-verlegh-stadion.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening op maaiveldniveau
// (straat rond het stadion, NAP +3,25 m), Z omhoog. +X loopt langs de lengteas
// van het veld naar het noordoosten (RD-richting (0,6561, 0,7547), 49,0 graden,
// uit de kleinste omhullende rechthoek van de veldopening in het AHN), +Y dwars
// daarop naar het noordwesten (de hoofdingang). Een maat n is de afstand vanaf
// de rand van de veldopening (de voorkant van het dak) naar buiten.
//
// Overhang: de dakplaat, de vakwerkligger, de onderkant van de rang boven de
// aanbouwen, de spanten, de lampkoppen en de plafonds van de raamnissen hangen
// uit (ondervlakken vlakker dan 45 graden boven OVERHANG_MIN_Z); de export vult
// ze bij het printen op.
//
// Bronnen: de acht BAG-panden (0758100000070836 noordwesttribune, 070840
// zuidoosttribune, 070842 noordoosttribune, 096090 zuidwesttribune en de
// hoektorens 070833, 070841, 095930 en 096089; contouren van de gebogen gevels en
// de torens, vervangen panden); AHN DSM/DTM 0,5 m (PDOK WCS): de veldopening
// (128,6 bij 83,3 m op 49,0 graden), het dak (+20,55 m aan de veldkant tot
// +19,9 m aan de achterrand, 19,4 m diep op alle vier zijden), de aanbouwen
// (noordwest +12,6 m, zuidoost +11,8 m, noordoost +7,9 m), de lichtmasten
// (DSM tot +34,2 m op de binnenhoeken van de torens), de buitentrap (+7 m) en de
// dug-outs; PDOK luchtfoto 2024 en 2026 (traveelijnen van 10,9 m, zonnepanelen,
// de nieuwe voorste rijen van 2025); Wikipedia (20.500 plaatsen, verbouwing 2025:
// veld verlaagd en hoofd- en eretribune naar het veld doorgetrokken) en foto's op
// Wikimedia Commons (NAC Breda DSCF4040 tot 4071, Rat Verlegh Stadion
// P1030371 tot 386 en DSCF9251 tot 9258, NAC stadium inside, Rat Verleghstadium
// 2 en 3): zitrang van één ring onder het dak, glazen band tussen rang en dak,
// vakwerkligger langs de veldopening, betonspanten met groen vakwerk, getrapte
// onderkant van de rang boven de bakstenen aanbouwen, hoektorens van vier lagen
// met het dak op kolommen erboven, lichtmasten op het dak. Geschat: de treden van
// de zitrang (begin, hoogte, aantal), de onderkant van het dak en de diepte van
// de vakwerkligger, de maten van de betonspanten en het groene vakwerk, de
// hoogte van de hoektorens (+16,4 m, uit foto's), de zuidwestaanbouw (+7,9 m,
// onder het dak), de raamnissen en de lampkoppen. Weggelaten: de zonnepanelen
// (0,2 m), de stoelen, trappen en hekken op de rang, de reclameborden, de
// kabels, de staven van het groene vakwerk (als dichte schoor van 1,0 m) en de
// doorschijnende strook voorin het dak (in het AHN deels doorzichtig; als dicht
// dak).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "rat-verlegh-stadion");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
const hull = (pts) => Manifold.hull(pts);

const SLUG = "rat-verlegh-stadion";

// ---------- maten (lokaal stelsel, z = hoogte boven de straat op NAP +3,25 m) ----------
const GROUND_NAP = 3.25;
const ORIGIN = [110872.29, 400846.31];
const X_AXIS = [0.656059, 0.75471]; // RD-richting 49,0 graden, langs het veld
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de bemonsteringspunten hieronder.
const GROUND_HEIGHT = 47.12;
// Maaiveld op de straten en pleinen rond het stadion, 12 tot 16 m buiten de gevels.
const GROUND_SAMPLES = [[0, 84], [0, -80], [100, 0], [-96, 0]];
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// Overlap tussen aangrenzende stukken (rakende vlakken laten spleten achter).
const E = 0.02;

// De veldopening (de voorkant van het dak, AHN): halve lengte en breedte.
const HU = 64.3;
const HV = 41.65;
// Dwarsdoorsnede, gelijk op alle vier zijden (AHN: het dak is overal 19,4 m diep
// en even hoog). n = afstand vanaf de veldopening naar buiten.
const ROOF = {
  depth: 19.4, // achterrand van het dak (AHN: 18,8 tot 19,5 m)
  topFront: 20.55, // bovenkant aan de veldkant (AHN +20,4 tot +20,6 m)
  topBack: 19.9, // bovenkant aan de achterrand (AHN +19,7 tot +20,0 m)
  truss: { n: 1.2, bottom: 17.9 }, // vakwerkligger langs de veldopening, 2,6 m hoog
  under: [[1.2, 18.85], [19.4, 18.35]], // onderkant van de dakplaat (1,7 tot 1,55 m dik)
};
// Zitrang: tien treden van n = -1,0 tot 18,3 m (+3,0 tot +13,3 m); aan de lange
// zijden een extra voorste rij (2025) van n = -2,6 tot -1,0 m op +2,3 m (het PDOK-veld ligt op +1,9 m).
const RAKE = { n0: -1.0, n1: 18.3, z0: 3.0, z1: 13.3, steps: 10, extra: { n0: -2.6, z: 2.3 } };
// Schuine onderkant van de rang (zichtbaar boven de lage aanbouwen): van +7,5 m bij
// n = 11,4 m tot +11,9 m aan de achterkant (n = 19,4 m), evenwijdig aan de rang.
const UNDER = { nk: 11.4, zk: 7.5, zBack: 11.9 };
// Achterwand (n 18,3 tot 19,4 m) van de bovenste trede tot het dak, met aan de
// binnenzijde de glazen band (0,4 m diep, +13,9 tot +17,95 m) tussen de spanten.
const WALL = { n0: 18.3, band: [13.9, 17.95], bandDepth: 0.4 };
// Traveelijnen (luchtfoto: groene vakwerkschoren om de 10,9 m), langs u of v.
const FRAMES_LONG = [-59.95, -49.05, -38.15, -27.25, -16.35, -5.45, 5.45, 16.35, 27.25, 38.15, 49.05, 59.95];
const FRAMES_SHORT = [-38.15, -27.25, -16.35, -5.45, 5.45, 16.35, 27.25, 38.15];
// Hoektorens (BAG-contouren, vier lagen, bovenkant geschat uit foto's), met het dak op kolommen erboven.
const TOWER_TOP = 16.4;
const TOWERS = [
  { u: [70.1, 84.1], v: [50.1, 62.1] },
  { u: [70.2, 84.2], v: [-61.0, -46.9] },
  { u: [-84.1, -70.1], v: [-61.2, -47.2] },
  { u: [-84.2, -70.3], v: [49.9, 61.9] },
];
// Lichtmasten op de binnenhoeken van de torens (AHN: kern van de DSM-pieken), top +34,0 m.
const MASTS = [[70.5, 50.75], [70.9, -47.5], [-70.6, -47.9], [-70.9, 50.1]];
const MAST_TOP = 34.0;
// Aanbouwen: gebogen gevels als cirkelbogen door de BAG-contouren (middelpunt en straal), hoogte uit het AHN.
const ANNEX = {
  nw: { center: -131.84, r: 203.2, end: 60.0, top: 12.6 }, // v = c + sqrt(r² - u²), |u| <= 60
  se: { center: 136.96, r: 205.4, end: 59.65, top: 11.8 }, // v = c - sqrt(r² - u²)
  ne: { center: -23.6, r: 113.2, end: 40.0, top: 7.9 }, // u = c + sqrt(r² - v²)
  sw: { face: 18.9, from: -36.8, to: 39.0, top: 7.9 }, // rechte gevel onder de dakrand (BAG v -36,8 tot 39,0)
};
// Raamnissen in de gevels van de aanbouwen: [z0, z1] per laag, 0,4 m diep, om de 4,4 m.
const WINDOW_ROWS = {
  nw: [[0.6, 3.0], [4.3, 6.5], [7.9, 10.1]],
  se: [[0.6, 3.0], [4.3, 6.5], [7.7, 9.9]],
  ne: [[0.6, 3.0], [4.3, 6.5]],
  sw: [[0.6, 3.0], [4.3, 6.5]],
};
const WINDOW = { width: 2.4, step: 4.4, depth: 0.4 };
// Hoofdingang in het midden van de noordwestgevel, opbouw op het dak van die aanbouw.
const ENTRANCE = { width: 8.0, top: 3.6, depth: 1.2 };
const NW_ROOFBOX = { u: [-2.5, 1.5], v: [65.0, 70.5], top: 15.0 };
// Dug-outs aan de noordwestkant (AHN 1,5 tot 2 m boven het veld) en de buitentrap aan de zuidwestkant (AHN +7 m).
const DUGOUTS = [[-21.5, -10.5], [10.0, 23.0]];
const DUGOUT = { v: [38.8, 40.7], front: 3.0, back: 3.6 };
const SW_STAIR = { u: [-89.0, -83.0], v: [15.0, 22.0], top: 7.0 };
// Naar beneden gerichte vlakken boven deze hoogte zijn bedoelde uitkragingen
// (dak, ligger, onderkant van de rang, spanten, lampkoppen, plafonds van nissen).
const OVERHANG_MIN_Z = 2.9;

// ---------- doorsnede ----------
const lin = (p, q, n) => p[1] + ((q[1] - p[1]) * (n - p[0])) / (q[0] - p[0]);
const roofTop = (n) => ROOF.topFront + ((ROOF.topBack - ROOF.topFront) * n) / ROOF.depth;
const roofUnder = (n) => lin(ROOF.under[0], ROOF.under[1], n);
const rakeUnder = (n) => lin([UNDER.nk, UNDER.zk], [ROOF.depth, UNDER.zBack], n);
// (a, n) per zijde naar (x, y): a loopt langs de zijde, n vanaf de veldopening naar buiten.
const SIDES = {
  nw: (a, n) => [a, HV + n],
  se: (a, n) => [a, -(HV + n)],
  ne: (a, n) => [HU + n, a],
  sw: (a, n) => [-(HU + n), a],
};
const LONG = { nw: true, se: true, ne: false, sw: false };
const sideHull = (side, pts) => hull(pts.map(([a, n, z]) => [...SIDES[side](a, n), z]));
// Een convex stuk van de doorsnede [n, z] uitgetrokken langs de zijde van a0 tot a1.
const sweep = (side, quad, a0, a1) => sideHull(side, quad.flatMap(([n, z]) => [[a0, n, z], [a1, n, z]]));

// De zitrang en de schuine onderkant: per trede een blok van de onderkant (de grond of
// de schuine onderkant) tot de trede, plus de rugbalk achter de bovenste trede.
const bodyQuads = (long) => {
  const q = [];
  const { n0, n1, z0, z1, steps, extra } = RAKE;
  if (long) q.push([[extra.n0, BASE], [n0 + E, BASE], [n0 + E, extra.z], [extra.n0, extra.z]]);
  const d = (n1 - n0) / steps;
  const rise = (z1 - z0) / (steps - 1);
  for (let j = 0; j < steps; j++) {
    const a = n0 + j * d - (j > 0 ? E : 0);
    const b = n0 + (j + 1) * d + (j < steps - 1 ? E : 0);
    const z = z0 + j * rise;
    const nk = UNDER.nk;
    if (b <= nk) q.push([[a, BASE], [b, BASE], [b, z], [a, z]]);
    else if (a >= nk) q.push([[a, rakeUnder(a)], [b, rakeUnder(b)], [b, z], [a, z]]);
    else {
      q.push([[a, BASE], [nk + E, BASE], [nk + E, z], [a, z]]);
      q.push([[nk, rakeUnder(nk)], [b, rakeUnder(b)], [b, z], [nk, z]]);
    }
  }
  q.push([[n1 - E, rakeUnder(n1 - E)], [ROOF.depth, UNDER.zBack], [ROOF.depth, z1], [n1 - E, z1]]);
  return q;
};
const wallQuad = [[WALL.n0, RAKE.z1 - E], [ROOF.depth, RAKE.z1 - E], [ROOF.depth, roofUnder(ROOF.depth) + 0.05], [WALL.n0, roofUnder(WALL.n0) + 0.05]];
const roofQuads = [
  [[0, ROOF.truss.bottom], [ROOF.truss.n + E, ROOF.truss.bottom], [ROOF.truss.n + E, roofTop(ROOF.truss.n + E)], [0, roofTop(0)]],
  [[ROOF.truss.n, roofUnder(ROOF.truss.n)], [ROOF.depth, roofUnder(ROOF.depth)], [ROOF.depth, roofTop(ROOF.depth)], [ROOF.truss.n, roofTop(ROOF.truss.n)]],
];

// Verstek: elke zijde houdt het deel buiten de diagonalen door de hoeken van de veldopening
// (2 cm erover, zodat de zijden elkaar overlappen in plaats van raken).
const wedge = (side) => {
  const far = 40;
  const pts = {
    nw: [[-(HU - 10) - E, HV - 10], [HU - 10 + E, HV - 10], [HU + far + E, HV + far], [-(HU + far) - E, HV + far]],
    se: [[-(HU - 10) - E, -(HV - 10)], [HU - 10 + E, -(HV - 10)], [HU + far + E, -(HV + far)], [-(HU + far) - E, -(HV + far)]],
    ne: [[HU - 10, -(HV - 10) - E], [HU + far, -(HV + far) - E], [HU + far, HV + far + E], [HU - 10, HV - 10 + E]],
    sw: [[-(HU - 10), -(HV - 10) - E], [-(HU + far), -(HV + far) - E], [-(HU + far), HV + far + E], [-(HU - 10), HV - 10 + E]],
  }[side];
  return prism(pts, BASE - 1, 60);
};

// De ruimte boven een hoektoren tot het dak blijft open (het dak rust daar op kolommen).
const towerGaps = Manifold.union(TOWERS.map(({ u, v }) => box(u[0] - 0.3, u[1] + 0.3, v[0] - 0.3, v[1] + 0.3, TOWER_TOP, 40)));

const ringParts = [];
for (const side of Object.keys(SIDES)) {
  const long = LONG[side];
  const span = long ? 90 : 70;
  const frames = long ? FRAMES_LONG : FRAMES_SHORT;
  const clip = wedge(side);
  const body = Manifold.union([...bodyQuads(long), ...roofQuads].map((q) => sweep(side, q, -span, span)));
  // Glazen band aan de binnenzijde van de achterwand: per travee tussen de spanten, en
  // aan de uiteinden tot vlak voor de hoektoren.
  const towerEdge = long ? 69.6 : 46.5;
  const bays = [];
  for (let i = 0; i + 1 < frames.length; i++) bays.push([frames[i] + 0.8, frames[i + 1] - 0.8]);
  bays.push([-towerEdge, frames[0] - 0.8], [frames[frames.length - 1] + 0.8, towerEdge]);
  const bands = bays.map(([a0, a1]) =>
    sweep(side, [[WALL.n0 - 0.05, WALL.band[0]], [WALL.n0 + WALL.bandDepth, WALL.band[0]], [WALL.n0 + WALL.bandDepth, WALL.band[1]], [WALL.n0 - 0.05, WALL.band[1]]], a0, a1),
  );
  const wall = sweep(side, wallQuad, -span, span).subtract(Manifold.union(bands)).subtract(towerGaps);
  ringParts.push(Manifold.union([body, wall]).intersect(clip));
}

// ---------- spanten ----------
// Per traveelijn (1,0 m breed): de kolom buiten de achterwand, de ligger onder de
// schuine onderkant van de rang, de schoor met het groene vakwerk van de rugbalk tot
// de dakrand (2,4 m buiten de wand) en het dakspant onder de dakplaat (0,9 m breed).
const frameParts = [];
for (const side of Object.keys(SIDES)) {
  for (const a of LONG[side] ? FRAMES_LONG : FRAMES_SHORT) {
    const [a0, a1] = [a - 0.5, a + 0.5];
    const nb = ROOF.depth;
    frameParts.push(sweep(side, [[UNDER.nk, UNDER.zk + 0.1], [nb, UNDER.zBack + 0.1], [nb, UNDER.zBack - 0.9], [UNDER.nk, UNDER.zk - 0.9]], a0, a1));
    frameParts.push(sweep(side, [[nb - 0.1, 11.0], [nb + 2.4, 14.4], [nb + 2.4, 15.4], [nb - 0.1, roofTop(nb - 0.1) - 0.2]], a0, a1));
    frameParts.push(sweep(side, [[nb + 0.1, BASE], [nb + 1.1, BASE], [nb + 1.1, 13.8], [nb + 0.1, 13.8]], a0, a1));
    const n0 = ROOF.truss.n - E;
    const n1 = WALL.n0 + E;
    frameParts.push(
      sweep(side, [[n0, roofUnder(n0) + 0.05], [n1, roofUnder(n1) + 0.05], [n1, roofUnder(n1) - 1.0], [n0, roofUnder(n0) - 0.4]], a + 0.05 - 0.5, a - 0.05 + 0.5),
    );
  }
}
// Hoekliggers onder het dak: van de hoek van de veldopening naar de mast op de toren.
for (const [mx, my] of MASTS) {
  const sx = Math.sign(mx);
  const sy = Math.sign(my);
  const p0 = [sx * HU, sy * HV];
  const d = [mx - p0[0], my - p0[1]];
  const l = Math.hypot(...d);
  const o = [(-d[1] / l) * 0.45, (d[0] / l) * 0.45];
  const zTop = roofUnder(ROOF.truss.n) + 0.05;
  frameParts.push(
    hull(
      [p0, [mx, my]].flatMap(([x, y]) =>
        [1, -1].flatMap((s) => [[x + s * o[0], y + s * o[1], zTop], [x + s * o[0], y + s * o[1], ROOF.truss.bottom + 0.3]]),
      ),
    ),
  );
}

// ---------- aanbouwen ----------
// Gevelpunt en buitennormaal van de gebogen gevel op langscoördinaat a.
const FACADE = {
  nw: (a) => {
    const { center, r } = ANNEX.nw;
    const p = [a, center + Math.sqrt(r * r - a * a)];
    return [p, [(p[0] - 0) / r, (p[1] - center) / r]];
  },
  se: (a) => {
    const { center, r } = ANNEX.se;
    const p = [a, center - Math.sqrt(r * r - a * a)];
    return [p, [p[0] / r, (p[1] - center) / r]];
  },
  ne: (a) => {
    const { center, r } = ANNEX.ne;
    const p = [center + Math.sqrt(r * r - a * a), a];
    return [p, [(p[0] - center) / r, p[1] / r]];
  },
  sw: (a) => [SIDES.sw(a, ANNEX.sw.face), [-1, 0]],
};
// Toegestane ruimte voor een aanbouw: tot 0,1 m boven de schuine onderkant van de rang (in de rang,
// zodat geen vlakken samenvallen) en buiten de achterwand.
const allowed = (side) =>
  Manifold.union([
    sweep(side, [[UNDER.nk, BASE], [ROOF.depth, BASE], [ROOF.depth, UNDER.zBack + 0.1], [UNDER.nk, UNDER.zk + 0.1]], -100, 100),
    sweep(side, [[ROOF.depth - E, BASE], [80, BASE], [80, 40], [ROOF.depth - E, 40]], -100, 100),
  ]);
// Raamnis (of ingang) in de gevel op langscoördinaat a: 0,4 m diep, haaks op de gevel.
const niche = (side, a, width, z0, z1, depth) => {
  const [[px, py], [nx, ny]] = FACADE[side](a);
  const t = [-ny, nx];
  const pts = [];
  for (const s of [-1, 1]) for (const k of [-depth, 1.0]) for (const z of [z0, z1]) pts.push([px + t[0] * s * width / 2 + nx * k, py + t[1] * s * width / 2 + ny * k, z]);
  return hull(pts);
};
const annexParts = [];
for (const side of ["nw", "se", "ne", "sw"]) {
  const spec = ANNEX[side];
  let plan;
  let range;
  if (side === "sw") {
    plan = [[spec.from, UNDER.nk], [spec.to, UNDER.nk], [spec.to, spec.face], [spec.from, spec.face]].map(([a, n]) => SIDES.sw(a, n));
    range = [spec.from + 2.5, spec.to - 2.5];
  } else {
    const pts = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) pts.push(FACADE[side](-spec.end + (2 * spec.end * i) / steps)[0]);
    plan = [...pts, SIDES[side](spec.end, UNDER.nk), SIDES[side](-spec.end, UNDER.nk)];
    range = [-spec.end + 2.5, spec.end - 2.5];
  }
  const cuts = [];
  for (let a = 0; a <= range[1]; a += WINDOW.step) {
    for (const s of a === 0 ? [1] : [1, -1]) {
      const at = s * a;
      if (at < range[0]) continue;
      for (const [z0, z1] of WINDOW_ROWS[side]) {
        if (side === "nw" && z0 < 1 && Math.abs(at) < ENTRANCE.width / 2 + 1.5) continue;
        if (side === "sw" && at > SW_STAIR.v[0] - 2.5 && at < SW_STAIR.v[1] + 2.5) continue;
        cuts.push(niche(side, at, WINDOW.width, z0, z1, WINDOW.depth));
      }
    }
  }
  if (side === "nw") cuts.push(niche("nw", 0, ENTRANCE.width, 0, ENTRANCE.top, ENTRANCE.depth));
  annexParts.push(prism(plan, BASE, spec.top).intersect(allowed(side)).subtract(Manifold.union(cuts)));
}
annexParts.push(box(NW_ROOFBOX.u[0], NW_ROOFBOX.u[1], NW_ROOFBOX.v[0], NW_ROOFBOX.v[1], ANNEX.nw.top - E, NW_ROOFBOX.top));
annexParts.push(box(SW_STAIR.u[0], SW_STAIR.u[1], SW_STAIR.v[0], SW_STAIR.v[1], BASE, SW_STAIR.top));
for (const [u0, u1] of DUGOUTS) {
  annexParts.push(
    hull([u0, u1].flatMap((u) => [[u, DUGOUT.v[0], BASE], [u, DUGOUT.v[1], BASE], [u, DUGOUT.v[0], DUGOUT.front], [u, DUGOUT.v[1], DUGOUT.back]])),
  );
}

// ---------- hoektorens ----------
// Vier lagen met raamnissen (2,0 m breed, 0,35 m diep, drie per gevel) in de twee
// buitengevels, en kolommen van 0,9 m van het torendak tot in de dakplaat.
const towerParts = [];
const TOWER_ROWS = [[1.0, 3.0], [4.6, 6.4], [8.2, 10.0], [11.8, 13.6]];
for (const { u, v } of TOWERS) {
  const outU = Math.abs(u[0]) > Math.abs(u[1]) ? u[0] : u[1];
  const outV = Math.abs(v[0]) > Math.abs(v[1]) ? v[0] : v[1];
  const su = Math.sign(outU);
  const sv = Math.sign(outV);
  const cuts = [];
  const cu = (u[0] + u[1]) / 2;
  const cv = (v[0] + v[1]) / 2;
  for (const off of [-4.2, 0, 4.2]) {
    for (const [z0, z1] of TOWER_ROWS) {
      cuts.push(box(outU - su * 0.35 - 1, outU - su * 0.35 + 1, cv + off - 1.0, cv + off + 1.0, z0, z1).translate([su * 1, 0, 0]));
      cuts.push(box(cu + off - 1.0, cu + off + 1.0, outV - sv * 0.35 - 1, outV - sv * 0.35 + 1, z0, z1).translate([0, sv * 1, 0]));
    }
  }
  towerParts.push(box(u[0], u[1], v[0], v[1], BASE, TOWER_TOP).subtract(Manifold.union(cuts)));
  // Kolommen binnen de dakrand (u tot 83,7 m, v tot 61,05 m).
  const uIn = su > 0 ? u[0] : u[1];
  const vIn = sv > 0 ? v[0] : v[1];
  const uOut = su * Math.min(Math.abs(outU), HU + ROOF.depth);
  const vOut = sv * Math.min(Math.abs(outV), HV + ROOF.depth);
  const cols = [
    [uIn + su * 0.45, vOut - sv * 0.45],
    [(uIn + uOut) / 2, vOut - sv * 0.45],
    [uOut - su * 0.45, vOut - sv * 0.45],
    [uOut - su * 0.45, (vIn + vOut) / 2],
    [uOut - su * 0.45, vIn + sv * 0.45],
  ];
  for (const [x, y] of cols) towerParts.push(box(x - 0.45, x + 0.45, y - 0.45, y + 0.45, TOWER_TOP - E, 19.0));
}

// ---------- lichtmasten ----------
// Mast van 1,2 m op een voet van 2,8 m op het dak, bovenaan een lampkop van 5,0 bij 1,6 m
// die naar het midden van het veld wijst.
const mastParts = MASTS.map(([cx, cy]) => {
  const z0 = 19.5;
  const zHead = MAST_TOP - 3.2;
  const foot = hull([1, -1].flatMap((sx) => [1, -1].flatMap((sy) => [[sx * 1.4, sy * 1.4, z0], [sx * 0.6, sy * 0.6, z0 + 3.0]])));
  const pole = box(-0.6, 0.6, -0.6, 0.6, z0 + 2.9, zHead + 0.2);
  const half = [0.8, 2.5];
  const flare = hull([
    ...[1, -1].flatMap((sx) => [1, -1].map((sy) => [sx * 0.6, sy * 0.6, zHead])),
    ...[1, -1].flatMap((sx) => [1, -1].map((sy) => [sx * half[0], sy * half[1], zHead + 1.9])),
  ]);
  const head = box(-half[0], half[0], -half[1], half[1], zHead + 1.85, MAST_TOP);
  const facing = (Math.atan2(-cy, -cx) * 180) / Math.PI;
  return Manifold.union([foot, pole, Manifold.union([flare, head]).rotate([0, 0, facing])]).translate([cx, cy, 0]);
});

const OVERHANG_OK = (z) => z >= OVERHANG_MIN_Z;
const stadium = Manifold.union([...ringParts, ...frameParts, ...annexParts, ...towerParts, ...mastParts]);
// BAG-panden van het stadion: de vier tribunes en de vier hoektorens.
const REPLACED_BUILDINGS = [
  "0758100000070836",
  "0758100000070840",
  "0758100000070842",
  "0758100000096090",
  "0758100000070833",
  "0758100000070841",
  "0758100000095930",
  "0758100000096089",
];
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "Rat Verlegh Stadion",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: REPLACED_BUILDINGS,
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (110872,29, 400846,31) in het hart van de veldopening op het maaiveld (NAP +3,25 m), +X langs het veld naar het noordoosten (49,0 graden) en +Y naar het noordwesten (de hoofdingang). Eén node building:stadion: een gesloten ring van vier tribunes met verstekhoeken onder één dak (+20,55 m aan de veldkant tot +19,9 m aan de achterrand, 19,4 m diep) met de vakwerkligger langs de veldopening en dakspanten eronder, boven een zitrang van tien treden (+3,0 tot +13,3 m, aan de lange zijden een extra voorste rij van 2025) en een achterwand met een glazen band; de schuine onderkant van de rang boven de bakstenen aanbouwen, betonspanten met groen vakwerk om de 10,9 m, de gebogen aanbouwen (noordwest +12,6 m met de hoofdingang, zuidoost +11,8 m, noordoost en zuidwest +7,9 m) met raamnissen, vier hoektorens (+16,4 m) met raamnissen waarboven het dak op kolommen rust, vier lichtmasten op de dakhoeken (+34,0 m), de dug-outs en een buitentrap. Onderkant op 0,5 m onder het maaiveld; het dak en de onderkant van de rang hangen uit (de export vult ze op). Het maaiveld wordt op vier punten rond het stadion bemonsterd; groundHeight is de laagste PDOK-terreinhoogte daar (ellipsoïdisch). Vervangt de PDOK-reconstructie van de acht BAG-panden van het stadion. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 20500,
    fieldOpeningM: [2 * HU, 2 * HV],
    roofM: [ROOF.topFront, ROOF.topBack],
    roofDepthM: ROOF.depth,
    rakeM: [RAKE.z0, RAKE.z1],
    annexM: { northWest: ANNEX.nw.top, southEast: ANNEX.se.top, northEast: ANNEX.ne.top, southWest: ANNEX.sw.top },
    cornerTowerM: TOWER_TOP,
    mastTopM: MAST_TOP,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Rat_Verlegh_Stadion",
    "PDOK BAG panden van het stadion (zie replacesBuildings), EPSG:28992: contouren van de gebogen gevels en de hoektorens",
    "PDOK AHN DSM/DTM 0,5 m via WCS: veldopening, dakprofiel, aanbouwen, lichtmasten, buitentrap en dug-outs",
    "PDOK luchtfoto (2024_orthoHR en 2026_orthoHR): traveelijnen, zonnepanelen en de voorste rijen van 2025",
    "Wikimedia Commons: NAC Breda DSCF4040 tot 4071, Rat Verlegh Stadion P1030371 tot 386 en DSCF9251 tot 9258, NAC stadium inside, Rat Verleghstadium 2 en 3 (zitrang, glazen band, vakwerkligger, betonspanten met groen vakwerk, aanbouwen, hoektorens, lichtmasten)",
  ],
};

const parts = nodes;
// Losse delen van het model (genus onder 0 betekent meer dan één stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
  }
}

// ---------- controles ----------
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Genereert een vereenvoudigd, gesloten 3D-model van de IJsselbrug in de A12
// tussen Arnhem (Velperbroek) en Westervoort/Duiven: drie bruggen naast
// elkaar over de IJssel en haar uiterwaarden. Aan de zuidwestkant twee
// stalen liggerbruggen voor het verkeer richting Duitsland (de oostelijke van
// 1961 en de westelijke van 1964, op landhoofden en bakstenen pijlers waarvan
// de bouw in 1941 begon), aan de noordoostkant de betonnen brug van circa 1970
// voor het verkeer richting Arnhem en Utrecht, met naast de rijbaan een
// lokale weg (fiets- en dienstweg). Alle drie hebben zeven aanbrugvelden van
// circa 40 m over de noordwestelijke uiterwaard op dezelfde pijlerlijnen, een
// rivieroverspanning van 105 m en een kort veld over de zuidoostelijke
// uiterwaard; de rivieroverspanningen hebben een vouten-ligger (stalen
// plaatliggers met een boogvormige onderkant, een betonnen kokerligger met
// vouten) en de aanbruggen een ligger van constante hoogte (stalen
// plaatliggers op bakstenen pijlers met ronde koppen, de betonnen koker op
// dwarsregels met vijf ronde kolommen). Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, de materiaalklasse in de
// nodenaam: de constructie als building, de rijbanen en de lokale weg op het
// dek als road met de BGT-attributen) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal> met een printvoet
// onder de dekken.
//
//   node scripts/generate-ijsselbrug-a12.mjs              # STL op 1:1500 (standaard, 369 mm)
//   node scripts/generate-ijsselbrug-a12.mjs --scale 2000
//
// Assenstelsel: oorsprong midden op de lengte van de brug (tussen de
// BGT-einden van de dekken) op de as van de middelste (oostelijke stalen)
// brug (RD 196332,97, 443156,92), op de waterspiegel van de IJssel zoals het
// PDOK-terrein die legt (NAP +7,47 m), Z omhoog. +X loopt langs de brug naar
// het zuidoosten (Westervoort/Duiven, RD-richting -52,11 graden vanaf het
// oosten), +Y naar het noordoosten (stroomafwaarts, de kant van de betonnen
// brug). De pijlerlijnen van de aanbruggen liggen op x = -228,3, -188,2,
// -148,1, -107,9, -67,8, -27,7 en 18,0 (en 223,2 aan de zuidoostkant); de
// stalen bruggen staan in de rivier op bakstenen pijlers op x = 67,7 en 172,6,
// de betonnen brug op betonnen schijven op x = 84,2 en 189,5. De landhoofden
// staan op x = -266,8 en 266,25 (voorkant); dekken en landhoofden lopen over de
// dijk door tot x = -292 en 292, tot ruim over het PDOK-wegvlak.
//
// Bronnen: BGT overbruggingsdeel (drie dekken: zuidwest y = -18,65 tot -7,95,
// midden -4,75 tot 4,75, betonnen brug 5,53 tot 31,75, van x = -268,6 tot
// 268,5; de vier rivierpijlers en de landhoofden met vleugelwanden), BGT
// wegdeel (rijbaan autosnelweg op elk dek, rijbaan lokale weg aan de
// noordoostrand van de betonnen brug); AHN DSM 0,5 m (PDOK WCS) voor het
// lengteprofiel (één topboog met een straal van 16 000 m en de top op
// NAP +24,60 m bij x = 125, helling 2,35 % naar het noordwesten en 1,0 % naar
// het zuidoosten; restfout 7 cm), de dwarshelling van 2,5 % op de betonnen
// brug en de geleiders en schampkanten; de onderbrekingen in de AHN-punten op
// de stalen dekken en de voegen in de PDOK-luchtfoto voor de pijlerlijnen
// (40,1 m hart op hart); AHN DTM en PDOK-terrein voor de uiterwaarden
// (NAP +10,35 m noordwest, +12,0 m zuidoost) en de waterspiegel
// (51,30 m ellipsoïdisch; NAP = ellipsoïdisch - 43,83 m op de uiterwaarden);
// imsafe.wikixl.nl (IJsselbrug Arnhem) voor de bouwgeschiedenis;
// Rijkswaterstaat en de Arnhemse Koerier (onderhoud 2025-2026) voor de
// indeling (twee stalen bruggen richting Duitsland, één betonnen richting
// Arnhem met vier rijstroken en een fietspad); Wikimedia Commons-foto's
// (Apdency, Henk Monster, Koos de Geest) voor de bakstenen pijlers met kappen
// en opleggingen, de vouten van de stalen liggers, de kokerligger met vouten,
// de betonnen rivierpijler en de kolommen van de betonnen aanbruggen.
// Geschat (foto's, verhoudingen tegen bekende hoogtes): de liggerhoogtes
// (staal 2,6 m in de aanbruggen, 5,8 m boven de rivierpijlers en 3,0 m midden
// in de rivieroverspanning; beton 2,4 m, 6,5 m en 2,8 m), de plaats van de
// stalen hoofdliggers (1,4 m binnen de dekranden), de breedte van de koker
// (13 m), de bakstenen pijlers op de uiterwaarden (4,0 m dik, even lang als de
// rivierpijlers, kap 1,05 m en opleggingen 1,55 m), de dwarsregels (2,0 m dik,
// 1,6 m hoog) en de kolommen (vijf per rij, 1,3 m), de randbalk van de
// betonnen brug (1,1 m) en de hoogtes van schampkanten en geleiders.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "ijsselbrug-a12");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const area2 = (pts) => pts.reduce((a, [x0, y0], i) => {
  const [x1, y1] = pts[(i + 1) % pts.length];
  return a + x0 * y1 - x1 * y0;
}, 0);
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
// Rechthoek met halfronde koppen aan de y-einden (pijler met ronde koppen).
function roundEnded(xc, thick, y0, y1, n = 12) {
  const r = thick / 2;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = Math.PI + (Math.PI * i) / n;
    pts.push([xc - r * Math.cos(a), y0 + r + r * Math.sin(a)]);
  }
  for (let i = 0; i <= n; i++) {
    const a = (Math.PI * i) / n;
    pts.push([xc - r * Math.cos(a), y1 - r + r * Math.sin(a)]);
  }
  return pts;
}
// Polygoon rondom `d` groter (alleen voor convexe polygonen tegen de klok in).
function grow(poly, d) {
  const p = ccw(poly);
  const n = p.length;
  return p.map((q, i) => {
    const a = p[(i - 1 + n) % n];
    const b = p[(i + 1) % n];
    const n1 = [q[1] - a[1], a[0] - q[0]];
    const n2 = [b[1] - q[1], q[0] - b[0]];
    const l1 = Math.hypot(...n1) || 1;
    const l2 = Math.hypot(...n2) || 1;
    const m = [n1[0] / l1 + n2[0] / l2, n1[1] / l1 + n2[1] / l2];
    const lm = Math.hypot(...m) || 1;
    const cos = (m[0] / lm) * (n1[0] / l1) + (m[1] / lm) * (n1[1] / l1);
    const k = d / Math.max(cos, 0.3);
    return [q[0] + (m[0] / lm) * k, q[1] + (m[1] / lm) * k];
  });
}

// Loft langs de as (recht): per station een convexe doorsnede (s, z), tegen de
// klok in gezien vanaf +X, steeds evenveel punten.
function loft(xs, section) {
  const sections = xs.map((x) => section(x));
  const n = sections[0].length;
  const verts = [];
  xs.forEach((x, i) => {
    for (const [s, z] of sections[i]) verts.push(x, s, z);
  });
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < xs.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = xs.length - 1;
  for (let j = 1; j + 1 < n; j++) {
    tris.push(id(0, 0), id(0, j + 1), id(0, j));
    tris.push(id(last, 0), id(last, j), id(last, j + 1));
  }
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  return solid;
}
// Stations van x0 tot x1 om de `step` m, plus de opgegeven tussenpunten.
function stations(x0, x1, step, extra = []) {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return [...Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n), ...extra.filter((x) => x > x0 && x < x1)]
    .sort((a, b) => a - b)
    .filter((x, i, a) => i === 0 || x - a[i - 1] > 1e-3);
}

// ---------- hoogtes (boven de waterspiegel, NAP +7,47 m) ----------
const WATER_NAP = 7.47;
const Z = (nap) => nap - WATER_NAP;
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de IJssel op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// PDOK-waterspiegel (ellipsoïdisch) op de maaiveldpunten, als vaste terugval
// voor een uitsnede die alleen een aanbrug raakt.
const GROUND_HEIGHT = 51.3;

// Lengteprofiel van het wegdek (AHN DSM, rijstroken zonder geleiders): één
// topboog met straal 16 000 m, top NAP +24,60 m bij x = 125, daarbuiten
// rechte hellingen van 2,35 % (noordwest) en 1,0 % (zuidoost). Geldt voor de
// stalen dekken (vlak dwarsprofiel) en voor de betonnen brug op y = 17,0; die
// heeft een dwarshelling van 2,5 % naar het noordoosten.
const PROFILE = { crestNap: 24.6, crestX: 125, radius: 16000, gradeNw: 0.0235, gradeSe: 0.01 };
function road(x) {
  const { crestNap, crestX, radius, gradeNw, gradeSe } = PROFILE;
  const xa = crestX - gradeNw * radius;
  const xb = crestX + gradeSe * radius;
  const arc = (u) => crestNap - ((u - crestX) ** 2) / (2 * radius);
  if (x < xa) return Z(arc(xa) + gradeNw * (x - xa));
  if (x > xb) return Z(arc(xb) - gradeSe * (x - xb));
  return Z(arc(x));
}
const CROSS_FALL = { ref: 17.0, grade: 0.025 };
// Voorbij de landhoofden lopen dek en wegdek over de dijk door tot ruim over
// het PDOK-wegvlak (zie END); daar zakt het wegdek lineair tot 0,9 m
// (noordwest) en 0,8 m (zuidoost) onder het profiel, zodat het einde in het
// PDOK-wegvlak ligt (dat ligt op de dijk 0,2 tot 0,7 m lager dan het AHN).
const endDrop = (x) => {
  if (x < ABUT.nwEnd) return (END.dropNw * (ABUT.nwEnd - x)) / (ABUT.nwEnd - END.nw);
  if (x > ABUT.seEnd) return (END.dropSe * (x - ABUT.seEnd)) / (END.se - ABUT.seEnd);
  return 0;
};
const steelTop = (x) => road(x) - endDrop(x);
const concreteTop = (x, s) => road(x) - endDrop(x) + CROSS_FALL.grade * (CROSS_FALL.ref - s);

// ---------- indeling langs de as ----------
// Pijlerlijnen van de aanbruggen over de noordwestelijke uiterwaard (40,12 m
// hart op hart, AHN en luchtfoto), samen voor de drie bruggen.
const NW_LINES = [0, 1, 2, 3, 4, 5].map((k) => +(-27.7 - 40.12 * k).toFixed(2)).reverse();
const LINE_RIVER_NW = 18.0; // laatste aanbrugpijler, begin van de vouten-ligger
const LINE_SE = 223.2; // pijlerlijn op de zuidoostelijke uiterwaard
const STEEL_RIVER = [67.7, 172.6]; // bakstenen rivierpijlers (BGT)
const CONCRETE_RIVER = [84.2, 189.5]; // betonnen rivierschijven (BGT)
const ABUT = { nwFace: -266.8, nwEnd: -269.4, seFace: 266.25, seEnd: 269.5 };
// Dekken, wegdek en landhoofden lopen over de dijk door tot x = -292 en 292:
// het PDOK-wegvlak zakt aan het zuidoosteinde (bij de fabriek) tussen het
// landhoofd en x = 284 tot 8 m onder het dek naar de uiterwaard en ligt pas
// daarna op de dijk; aan het noordwesteinde ligt het 0,4 tot 0,7 m lager dan
// het dek (de lokale weg tot 2,6 m). Zonder doorloop bleef daar op de kaart een
// spleet tussen het PDOK-wegdek en het einde van de brug.
const END = { nw: -292.0, se: 292.0, dropNw: 0.9, dropSe: 0.8 };
const DECK = [END.nw, END.se];

// ---------- dwarsprofiel (BGT) ----------
const STEEL = [
  { name: "zuidwest", edge: [-18.65, -7.95], girders: [-17.25, -9.35] },
  { name: "midden", edge: [-4.75, 4.75], girders: [-3.35, 3.35] },
];
const CONCRETE = { edge: [5.53, 31.75], bottom: [12.14, 25.14] };
const GIRDER_WIDTH = 0.9; // hoofdligger als dichte wand (de werkelijke lijf- en flensbreedte is kleiner)
const STEEL_SLAB = 0.6; // dek met consoles
const CONCRETE_SLAB = { edge: 0.7, web: 0.9 }; // minstens 0,2 m onder de wegdeklaag
const WEB_FLARE = 0.5;
const EDGE_BEAM = { width: 0.6, depth: 1.1 }; // randbalk van de betonnen brug (foto)
// Liggerhoogte onder het wegdek (geschat op foto's).
const STEEL_DEPTH = { approach: 2.6, pier: 5.8, mid: 3.0 };
const CONCRETE_DEPTH = { approach: 2.4, pier: 6.5, mid: 2.8 };
// Vouten-ligger: van de laatste aanbrugpijler (18,0) via de twee
// rivierpijlers tot de pijler op de zuidoostelijke uiterwaard (223,2), met een
// parabolische onderkant (boogvorm op de foto's).
function haunched(x, piers, d) {
  const [p0, p1] = piers;
  if (x <= LINE_RIVER_NW || x >= LINE_SE) return d.approach;
  if (x < p0) return d.approach + (d.pier - d.approach) * ((x - LINE_RIVER_NW) / (p0 - LINE_RIVER_NW)) ** 2;
  if (x > p1) return d.approach + (d.pier - d.approach) * ((LINE_SE - x) / (LINE_SE - p1)) ** 2;
  const c = (p0 + p1) / 2;
  return d.mid + (d.pier - d.mid) * ((x - c) / ((p1 - p0) / 2)) ** 2;
}
const steelSoffit = (x) => steelTop(x) - haunched(x, STEEL_RIVER, STEEL_DEPTH);
const concreteSoffit = (x) => concreteTop(x, CONCRETE.bottom[0]) - haunched(x, CONCRETE_RIVER, CONCRETE_DEPTH);

// Schampkanten en geleiders op de dekken (BGT-randen; hoogtes geschat, het
// AHN ziet 0,3 tot 0,8 m): de schouwpaden op de consoles van de stalen
// bruggen (1975), de geleiders aan de binnenranden, de schampkant en geleider
// aan de zuidwestrand van de betonnen brug, de scheiding tussen rijbaan en
// lokale weg en de randbalk met leuning aan de noordoostrand.
const KERBS = [
  { s: [-18.65, -17.25], h: 0.6, top: steelTop },
  { s: [-8.85, -7.95], h: 0.8, top: steelTop },
  { s: [-4.75, -3.85], h: 0.8, top: steelTop },
  { s: [3.85, 4.75], h: 0.8, top: steelTop },
  { s: [5.53, 6.6], h: 0.8, top: concreteTop },
  { s: [26.8, 27.7], h: 0.8, top: concreteTop },
  { s: [30.85, 31.75], h: 0.6, top: concreteTop },
];
const LOCAL_EDGE = 27.25; // midden van de scheiding: lokale weg aan de noordoostkant

// ---------- pijlers ----------
// Bakstenen rivierpijlers van de stalen bruggen (BGT L0002.61324ffd en
// L0002.33ce51bf, ronde koppen), en de betonnen schijven van de betonnen brug
// (BGT L0002.75a74671 en L0002.a434af09).
const STEEL_RIVER_PIERS = [
  [[70.6, -18.76], [70.89, -18.2], [71.02, -17.53], [70.99, -2.12], [70.98, 4.49], [70.53, 6.14], [69.32, 7.34],
    [67.67, 7.78], [66.02, 7.33], [64.82, 6.12], [64.38, 4.47], [64.74, -18.57], [65.56, -19.44], [65.96, -19.75],
    [66.7, -20.15], [67.51, -20.32], [68.31, -20.29], [69.06, -20.07], [69.7, -19.71], [70.22, -19.26]],
  [[176.02, -1.89], [175.99, 4.37], [175.53, 6.02], [174.32, 7.23], [172.87, 7.48], [171.87, 7.53], [170.69, 6.79],
    [170.04, 5.92], [169.8, 5.13], [169.6, 2.38], [169.67, -9.19], [169.29, -16.33], [169.19, -17.33],
    [169.35, -18.18], [170.21, -19.47], [170.97, -20.1], [172.0, -20.43], [172.87, -20.47], [174.34, -20.15],
    [175.54, -18.94], [175.69, -18.4], [175.98, -17.29]],
];
const CONCRETE_RIVER_PIERS = [
  [[85.22, 14.68], [85.25, 23.94], [85.26, 27.2], [84.96, 27.91], [84.26, 28.2], [83.55, 27.91], [83.26, 27.2],
    [83.23, 17.82], [83.32, 9.87], [83.5, 9.43], [84.21, 9.14], [84.92, 9.43], [85.21, 10.14]],
  [[189.59, 28.27], [188.88, 27.98], [188.59, 27.28], [188.54, 10.26], [188.83, 9.56], [189.54, 9.26],
    [190.25, 9.55], [190.54, 10.26], [190.59, 27.27], [190.3, 27.98], [190.15, 28.04]],
];
// Bakstenen pijlers op de uiterwaarden (geschat): 4,0 m dik met ronde koppen,
// even lang als de rivierpijlers; daarop een betonnen kap met een schuine
// onderrand en per hoofdligger een opleggingsblok.
const BRICK = { thick: 4.0, y: [-20.3, 7.8], cap: 1.05, capGrow: 0.2, seat: 1.55, seatSize: [2.0, 1.8] };
// Betonnen aanbruggen (geschat): per pijlerlijn een dwarsregel op vijf ronde
// kolommen.
const CROSSBEAM = { thick: 2.0, y: [8.8, 30.5], depth: 1.6 };
const COLUMNS = { y: [10.0, 14.5, 19.0, 23.5, 28.0], d: 1.3 };

const steelLines = [...NW_LINES, LINE_RIVER_NW, LINE_SE];
const keyXs = [ABUT.nwEnd, ABUT.seEnd, ...NW_LINES, LINE_RIVER_NW, ...STEEL_RIVER, ...CONCRETE_RIVER, LINE_SE, ABUT.nwFace, ABUT.seFace, PROFILE.crestX - PROFILE.gradeNw * PROFILE.radius];
const deckXs = stations(DECK[0], DECK[1], 2, keyXs);

// ---------- dekken ----------
const parts = [];
// Stalen bruggen: dek met consoles over de volle breedte en twee hoofdliggers.
for (const { edge: [e0, e1], girders } of STEEL) {
  parts.push(loft(deckXs, (x) => {
    const zt = steelTop(x);
    return [[e0, zt - STEEL_SLAB], [e1, zt - STEEL_SLAB], [e1, zt], [e0, zt]];
  }));
  for (const g of girders) {
    parts.push(loft(deckXs, (x) => {
      const zt = steelTop(x);
      const zb = steelSoffit(x);
      return [[g - GIRDER_WIDTH / 2, zb], [g + GIRDER_WIDTH / 2, zb], [g + GIRDER_WIDTH / 2, zt - STEEL_SLAB + 0.05], [g - GIRDER_WIDTH / 2, zt - STEEL_SLAB + 0.05]];
    }));
  }
}
// Betonnen brug: dekplaat met uitkragingen, randbalken en de koker.
{
  const [e0, e1] = CONCRETE.edge;
  const [b0, b1] = CONCRETE.bottom;
  const t0 = b0 - WEB_FLARE;
  const t1 = b1 + WEB_FLARE;
  parts.push(
    loft(deckXs, (x) => {
      const zt = (s) => concreteTop(x, s);
      return [[e0, zt(e0) - CONCRETE_SLAB.edge], [t0, zt(t0) - CONCRETE_SLAB.web], [t1, zt(t1) - CONCRETE_SLAB.web], [e1, zt(e1) - CONCRETE_SLAB.edge], [e1, zt(e1)], [e0, zt(e0)]];
    }),
    loft(deckXs, (x) => {
      const zt = (s) => concreteTop(x, s);
      const zb = concreteSoffit(x);
      return [[b0, zb], [b1, zb], [t1, zt(t1) - CONCRETE_SLAB.web + 0.05], [t0, zt(t0) - CONCRETE_SLAB.web + 0.05]];
    }),
    ...[[e0, e0 + EDGE_BEAM.width], [e1 - EDGE_BEAM.width, e1]].map(([s0, s1]) =>
      loft(deckXs, (x) => [[s0, concreteTop(x, s0) - EDGE_BEAM.depth], [s1, concreteTop(x, s1) - EDGE_BEAM.depth], [s1, concreteTop(x, s1) - 0.1], [s0, concreteTop(x, s0) - 0.1]]),
    ),
  );
}
// Schampkant of geleider, van onder de wegdeklaag tot h boven het wegdek;
// `margin` maakt hem rondom groter (de vrije ruimte van het wegdek).
const kerb = ({ s: [s0, s1], h, top }, margin = 0, xs = deckXs) =>
  loft(xs, (x) => [[s0 - margin, top(x, s0) - 0.6 - margin], [s1 + margin, top(x, s1) - 0.6 - margin], [s1 + margin, top(x, s1) + h + margin], [s0 - margin, top(x, s0) + h + margin]]);
const kerbs = KERBS.map((k) => kerb(k));

// ---------- pijlers en landhoofden ----------
const piers = [];
// Stalen bruggen: bakstenen pijler, kap en opleggingsblokken.
function brickPier(plan, xc) {
  const zSeatTop = steelSoffit(xc);
  const zCap = zSeatTop - BRICK.seat;
  const zBrick = zCap - BRICK.cap;
  const capPlan = grow(plan, BRICK.capGrow);
  const out = [
    // Convex omhulsel: de BGT-contouren van de rivierpijlers hebben kleine
    // inhammen die onder de kap een randje zonder steun zouden laten.
    Manifold.hull([prism(plan, BASE, zBrick + 0.01)]),
    // Kap met een schuine onderrand: het convexe omhulsel van de pijlervoet
    // en de 0,2 m grotere kap.
    Manifold.hull([prism(plan, zBrick, zBrick + 0.01), prism(capPlan, zBrick + 0.25, zCap)]),
  ];
  const [sx, sy] = BRICK.seatSize;
  for (const { girders } of STEEL) {
    for (const g of girders) out.push(box(xc - sx / 2, xc + sx / 2, g - sy / 2, g + sy / 2, zCap - 0.01, Math.max(steelSoffit(xc - sx / 2), steelSoffit(xc + sx / 2)) + 0.3));
  }
  return out;
}
for (const xc of steelLines) piers.push(...brickPier(roundEnded(xc, BRICK.thick, ...BRICK.y), xc));
STEEL_RIVER_PIERS.forEach((plan, i) => piers.push(...brickPier(plan, STEEL_RIVER[i])));
// Betonnen brug: schijven in de rivier, dwarsregels op kolommen op de
// uiterwaarden.
// De schijf loopt 0,3 m in de koker door boven het hoogste punt van de
// onderkant boven de schijf (de vouten lopen daar al op).
CONCRETE_RIVER_PIERS.forEach((plan) => {
  const xs = plan.map(([x]) => x);
  const top = Math.max(concreteSoffit(Math.min(...xs)), concreteSoffit(Math.max(...xs)));
  piers.push(prism(plan, BASE, top + 0.3));
});
const concreteLines = [...NW_LINES, LINE_RIVER_NW, LINE_SE];
for (const xc of concreteLines) {
  const zb = concreteSoffit(xc);
  const [y0, y1] = CROSSBEAM.y;
  piers.push(box(xc - CROSSBEAM.thick / 2, xc + CROSSBEAM.thick / 2, y0, y1, zb - CROSSBEAM.depth, zb + 0.15));
  for (const y of COLUMNS.y) {
    piers.push(Manifold.cylinder(zb - CROSSBEAM.depth + 0.1 - BASE, COLUMNS.d / 2, COLUMNS.d / 2, 24).translate([xc, y, BASE]));
  }
}
// Landhoofden: een blok over de volle breedte van de voorkant (BGT, met de
// vleugelwanden langs de buitenranden tot x = -282,6 en 282,0) tot het einde
// van de doorgetrokken dekken op de dijk, tot onder de dekplaten; de spleten
// tussen de dekken zijn daar tot het wegdek dicht.
const abutments = [];
for (const [x0, x1] of [[END.nw, ABUT.nwFace], [ABUT.seFace, END.se]]) {
  const xs = stations(x0, x1, 1);
  abutments.push(
    loft(xs, (x) => [[STEEL[0].edge[0], BASE], [STEEL[1].edge[1], BASE], [STEEL[1].edge[1], steelTop(x) - STEEL_SLAB + 0.05], [STEEL[0].edge[0], steelTop(x) - STEEL_SLAB + 0.05]]),
    loft(xs, (x) => {
      const [, e1] = CONCRETE.edge;
      const s0 = STEEL[1].edge[1];
      return [[s0, BASE], [e1, BASE], [e1, concreteTop(x, e1) - CONCRETE_SLAB.edge + 0.05], [s0, concreteTop(x, s0) - CONCRETE_SLAB.edge + 0.05]];
    }),
    ...[[STEEL[0].edge[1], STEEL[1].edge[0]], [STEEL[1].edge[1], CONCRETE.edge[0]]].map(([s0, s1]) =>
      loft(xs, (x) => [[s0 - 0.01, BASE], [s1 + 0.01, BASE], [s1 + 0.01, steelTop(x)], [s0 - 0.01, steelTop(x)]]),
    ),
  );
}
const bridge = union([...parts, ...kerbs, ...piers, ...abutments]);

// ---------- printvoet (alleen in de STL) ----------
// De dekken hangen tussen de pijlers vrij en kragen uit. Net als de
// overhangopvulling van de export krijgt de STL onder elk dek een wig van
// minstens 50 graden vanaf de dekranden, onder de hoeken van de liggers door,
// die uitloopt in een scherm van minstens 0,9 m in het midden tot de
// onderplaat.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.45 * scale) / 1000);
function foot(e0, e1, c, zIn, zEdge0, zEdge1, corners, zIn1 = zIn) {
  // corners: [[afstand vanaf e0 of e1 (positief naar binnen), z], ...] die de wig moet ontwijken
  const k0 = Math.max(KNEE, ...corners.filter(([side]) => side === 0).map(([, d, z]) => (zEdge0 - z) / d));
  const k1 = Math.max(KNEE, ...corners.filter(([side]) => side === 1).map(([, d, z]) => (zEdge1 - z) / d));
  const zs0 = zEdge0 - k0 * (c - SCREEN - e0);
  const zs1 = zEdge1 - k1 * (e1 - c - SCREEN);
  const left = zs0 > BASE + 0.05 ? [[c - SCREEN, BASE], [c - SCREEN, zs0]] : (() => {
    const a = e0 + (zEdge0 - BASE) / k0;
    return [[a, BASE], [a - 1e-3, BASE + 1e-3]];
  })();
  const right = zs1 > BASE + 0.05 ? [[c + SCREEN, BASE], [c + SCREEN, zs1]] : (() => {
    const a = e1 - (zEdge1 - BASE) / k1;
    return [[a, BASE], [a + 1e-3, BASE + 1e-3]];
  })();
  return [left[0], right[0], right[1], [e1, zEdge1], [e1, zIn1], [e0, zIn], [e0, zEdge0], left[1]];
}
const footXs = stations(ABUT.nwFace - 0.3, ABUT.seFace + 0.3, 1, keyXs);
const feet = [];
for (const { edge: [e0, e1], girders: [g0, g1] } of STEEL) {
  feet.push(loft(footXs, (x) => {
    const zt = steelTop(x);
    const zg = steelSoffit(x) - 0.05;
    return foot(e0 - 0.02, e1 + 0.02, (g0 + g1) / 2, zt - 0.3, zt - STEEL_SLAB - 0.02, zt - STEEL_SLAB - 0.02, [
      [0, g0 - GIRDER_WIDTH / 2 - 0.02 - (e0 - 0.02), zg],
      [1, e1 + 0.02 - (g1 + GIRDER_WIDTH / 2 + 0.02), zg],
    ]);
  }));
}
{
  const [e0, e1] = CONCRETE.edge;
  const [b0, b1] = CONCRETE.bottom;
  feet.push(loft(footXs, (x) => {
    const zg = concreteSoffit(x) - 0.05;
    return foot(e0 - 0.02, e1 + 0.02, (b0 + b1) / 2, concreteTop(x, e0) - 0.3, concreteTop(x, e0) - EDGE_BEAM.depth - 0.02, concreteTop(x, e1) - EDGE_BEAM.depth - 0.02, [
      [0, b0 - 0.02 - (e0 - 0.02), zg],
      [1, e1 + 0.02 - (b1 + 0.02), zg],
      [0, CROSSBEAM.y[0] - e0, concreteSoffit(x) - CROSSBEAM.depth - 0.05],
      [1, e1 - CROSSBEAM.y[1], concreteSoffit(x) - CROSSBEAM.depth - 0.05],
    ], concreteTop(x, e1) - 0.3);
  }));
}
const printFoot = union(feet);
const printModel = union([bridge, printFoot]);

// ---------- rijbanen en lokale weg als eigen onderdelen ----------
// De bovenste 0,5 m van het wegdek is per BGT-functie een eigen node met de
// attributen van de actuele BGT-wegdelen erop (relatieve hoogteligging 1,
// glTF `extras.attributes`), zodat de kleurregels van een thema op het brugdek
// werken zoals op de PDOK-wegdelen ernaast. Pas na het printmodel opgebouwd,
// zodat de STL het hele brugmodel ongewijzigd bevat.
//
// De BGT legt op elk dek een rijbaan autosnelweg (gesloten verharding;
// zuidwest L0002.…a70cf5c2 en L0002.…3f51efdf, y = -17,23 tot -8,65; midden
// L0002.…c4e9ce13 en L0002.…755c3737, -4,1 tot 3,95; betonnen brug
// L0002.…af572188 en L0002.a67252847527443691ef8abdb2bc9327, 6,76 tot 26,84)
// en aan de noordoostrand van de betonnen brug een rijbaan lokale weg
// (gesloten verharding; L0002.…90c65326 en L0002.d5c57ddeae24442291344f91adc6e721,
// y = 27,65 tot 31,22). De BGT deelt elk wegdeel op x = -58 in tweeën. De
// schampkanten, geleiders, de scheiding en de randbalk blijven constructie.
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan autosnelweg", bgt_fysiekvoorkomen: "gesloten verharding" };
const LOCAL_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding" };
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek per dek, 0,5 m voorbij
// de einden van de dekken, elk tussen de randen van zijn dek (daar staan
// overal schampkanten of geleiders, die met 2 cm marge constructie blijven).
const layerXs = stations(DECK[0] - 0.5, DECK[1] + 0.5, 2, keyXs);
const STRIPS = [
  { s: STEEL[0].edge, top: steelTop },
  { s: STEEL[1].edge, top: steelTop },
  { s: CONCRETE.edge, top: concreteTop },
];
const layerStrip = union(STRIPS.map(({ s: [s0, s1], top }) =>
  loft(layerXs, (x) => [[s0, top(x, s0) - LAYER], [s1, top(x, s1) - LAYER], [s1, top(x, s1) + ABOVE], [s0, top(x, s0) + ABOVE]]),
));
const guardXs = stations(DECK[0] - 1, DECK[1] + 1, 2, keyXs);
const notLayer = union(KERBS.map((k) => kerb(k, GUARD, guardXs)));
const localRegion = box(DECK[0] - 5, DECK[1] + 5, LOCAL_EDGE, 40, BASE - 1, 100);
const layer = layerStrip.subtract(notLayer);
const roadCut = layer.subtract(localRegion);
const localCut = layer.intersect(localRegion);
const roadway = roadCut.intersect(bridge);
const localway = localCut.intersect(bridge);
const structure = bridge.subtract(layer);
const namedParts = [
  ["building:ijsselbrug-a12", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:rijbaan-lokaal", localway, LOCAL_ATTRIBUTES],
];
// De onderdelen tellen op tot de brug als geheel (geen overlap, niets kwijt).
const partition = {
  bridgeM3: +bridge.volume().toFixed(1),
  partsM3: Object.fromEntries(namedParts.map(([name, solid]) => [name, +solid.volume().toFixed(1)])),
};
partition.sumM3 = +namedParts.reduce((sum, [, solid]) => sum + solid.volume(), 0).toFixed(1);
partition.overlapM3 = +union(namedParts.slice(1).map(([, solid]) => solid)).intersect(structure).volume().toFixed(3);
if (Math.abs(partition.sumM3 - partition.bridgeM3) > 0.5 || partition.overlapM3 > 0.01) {
  throw new Error(`onderdelen tellen niet op: ${JSON.stringify(partition)}`);
}
console.log("partitie (m3):", JSON.stringify(partition));

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 0.01) continue; // de rand van de printvoet op het bed
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    found.push(p);
  }
  return { area, found };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-4) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  console.log("vrij hangend in het model (m2):", Math.round(overhangs(bridge).area));
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2));
  if (print.area > 1) {
    const buckets = {};
    for (const p of print.found) {
      const k = p[0].map((c, i) => Math.round(c / [20, 2, 2][i]) * [20, 2, 2][i]).join(",");
      buckets[k] = (buckets[k] || 0) + 1;
    }
    console.log(Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, 30));
    for (const p of print.found.slice(0, 6)) console.log(JSON.stringify(p.map((q) => q.map((c) => +c.toFixed(2)))));
    throw new Error("printversie heeft overhang");
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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
function toGlb(parts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of parts) {
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
    meshes.push({ name, primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }] });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of namedParts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    components: solid.decompose().map((c) => {
      const b = c.boundingBox();
      return `${c.volume().toFixed(1)} m3 x ${b.min[0].toFixed(1)}..${b.max[0].toFixed(1)} y ${b.min[1].toFixed(2)}..${b.max[1].toFixed(2)}`;
    }),
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
report.partition = partition;
const nap = (z) => +(z + WATER_NAP).toFixed(2);
report.profile = {
  roadNap: { nwAbutment: nap(road(ABUT.nwEnd)), nwEnd: nap(steelTop(END.nw)), middle: nap(road(0)), crest: nap(road(PROFILE.crestX)), seAbutment: nap(road(ABUT.seEnd)), seEnd: nap(steelTop(END.se)) },
  steelSoffitNap: { approach: nap(steelSoffit(NW_LINES[0])), riverPier: nap(steelSoffit(STEEL_RIVER[0])), mainMid: nap(steelSoffit((STEEL_RIVER[0] + STEEL_RIVER[1]) / 2)) },
  concreteSoffitNap: { approach: nap(concreteSoffit(NW_LINES[0])), riverPier: nap(concreteSoffit(CONCRETE_RIVER[0])), mainMid: nap(concreteSoffit((CONCRETE_RIVER[0] + CONCRETE_RIVER[1]) / 2)) },
  pierLines: { nw: NW_LINES, riverNw: LINE_RIVER_NW, steelRiver: STEEL_RIVER, concreteRiver: CONCRETE_RIVER, se: LINE_SE },
};
const glbFile = path.join(outDir, "ijsselbrug-a12.glb");
await writeFile(glbFile, toGlb(namedParts, "NederPrint generate-ijsselbrug-a12.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: namedParts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `ijsselbrug-a12-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint IJsselbrug A12 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  components: printSolid.decompose().length,
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten alleen
// op de IJssel, aan beide kanten naast de rivieroverspanningen.
const samplePoints = [[90, -29], [115, -29], [140, -29], [115, 41], [140, 41], [165, 41]];
await writeFile(
  path.join(outDir, "ijsselbrug-a12.json"),
  JSON.stringify(
    {
      name: "IJsselbrug A12",
      file: "ijsselbrug-a12.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [196332.97, 443156.92],
      xAxis: [0.61418, -0.78916],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "L0002.8250add69805475a89628bb22c9f960d",
        "L0002.8f20b65efc894ddba965627cfa7dede6",
        "L0002.9d42293093ee418889f313ec8dcce0b7",
        "L0002.bae93a9ef66a4b61a6ecc34500f24541",
        "L0002.c47e11e9c9214a27bce6f34040f31858",
        "L0002.c7f5990c12f5469e8aaa7f619d72a662",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong midden op de lengte van de brug op de as van de middelste (oostelijke stalen) brug op de waterspiegel van de IJssel (z = 0, NAP +7,47 m), +X langs de brug naar het zuidoosten (Westervoort/Duiven, RD-richting -52,11 graden vanaf het oosten) en +Y naar het noordoosten (stroomafwaarts, de kant van de betonnen brug). Drie nodes: road:rijbaan en road:rijbaan-lokaal, de bovenste 0,5 m van het wegdek met de attributen van het BGT-wegdeel erop in extras.attributes (bgt_functie rijbaan autosnelweg op de drie dekken en rijbaan lokale weg aan de noordoostrand van de betonnen brug, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, drie bruggen naast elkaar van landhoofd tot landhoofd (538 m, wegdek NAP +19,8 m bij het noordwestelijke landhoofd, top +24,6 m boven de rivier en +24,0 m bij het zuidoostelijke; dekken en landhoofden lopen over de dijk door tot x = -292 en 292, waar het wegdek lineair tot 0,9 en 0,8 m onder het profiel zakt zodat het in het PDOK-wegvlak eindigt): twee stalen liggerbruggen (10,7 en 9,5 m breed) met elk twee hoofdliggers, 2,6 m hoog over de aanbruggen en met een boogvormige onderkant van 5,8 m boven de rivierpijlers naar 3,0 m in het midden van de rivieroverspanning van 105 m, op bakstenen pijlers met ronde koppen, betonnen kappen en opleggingsblokken; en de betonnen brug (26,2 m breed, dwarshelling 2,5 %) met een kokerligger van 2,4 m, met vouten tot 6,5 m boven de betonnen rivierschijven, op dwarsregels met vijf ronde kolommen over de uiterwaarden; schouwpaden, schampkanten, geleiders, de scheiding met de lokale weg en de randbalken; de landhoofden als blokken tot het einde van de doorloop. Lantaarnpalen, leuningen, de seinportalen en de voegen zijn weggelaten; de export vult onder de dekken een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de IJssel naast de rivieroverspanningen bemonsterd; groundHeight is de PDOK-waterspiegel daar. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(DECK[1] - DECK[0]).toFixed(1),
        abutmentEndsM: [ABUT.nwEnd, ABUT.seEnd],
        dikeExtension: END,
        deckLengthBgtM: 537.1,
        deckWidthsM: { steelSouthWest: 10.7, steelMiddle: 9.5, concrete: 26.22 },
        totalWidthM: +(CONCRETE.edge[1] - STEEL[0].edge[0]).toFixed(2),
        pierLinesM: { nw: NW_LINES, riverNw: LINE_RIVER_NW, steelRiver: STEEL_RIVER, concreteRiver: CONCRETE_RIVER, se: LINE_SE },
        riverSpansM: { steel: +(STEEL_RIVER[1] - STEEL_RIVER[0]).toFixed(1), concrete: +(CONCRETE_RIVER[1] - CONCRETE_RIVER[0]).toFixed(1) },
        approachSpanM: 40.12,
        profile: PROFILE,
        crossFall: CROSS_FALL,
        steelDepthM: STEEL_DEPTH,
        concreteDepthM: CONCRETE_DEPTH,
        brickPier: BRICK,
        waterNapM: WATER_NAP,
        built: { abutmentsStarted: 1941, steelEast: 1961, steelWest: 1964, concrete: "circa 1970" },
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Lijst_van_oeververbindingen_over_de_(Gelderse)_IJssel",
        "https://imsafe.wikixl.nl/index.php/IJsselbrug_Arnhem",
        "https://www.rijkswaterstaat.nl/wegen/projectenoverzicht/a12-groot-onderhoud-aan-betonnen-ijsselbrug-in-2026",
        "PDOK BGT overbruggingsdeel (dekken, rivierpijlers L0002.61324ffd2670441c915e7ff76176fda5, L0002.33ce51bfed9540bdaec2fdaff8a2a179, L0002.75a746717ba0454eb9639b55f324f86f, L0002.a434af09335d46aebee5430dd38383aa, landhoofden L0002.60d70d0401184ce2ad91a7f4a1e6c011 en L0002.eda9b58469e14d6e94d2ca56c0eddc3a) en wegdeel, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het lengte- en dwarsprofiel van het wegdek, de pijlerlijnen en de uiterwaarden; PDOK-luchtfoto voor de voegen en de indeling van de dekken",
        "Wikimedia Commons: IJsselbrug A12 Velp.jpg (Apdency, CC0), Brug A12.jpg (Koos de Geest, CC BY-SA 3.0), Old steel girderbridge across the IJsselriver at Arnhem-Westervoort - panoramio.jpg en twee panoramio-foto's van de betonnen brug (Henk Monster, CC BY 3.0)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

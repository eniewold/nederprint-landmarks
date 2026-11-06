// De Inktpot aan het Moreelsepark in Utrecht: Hoofdadministratiegebouw III van de Nederlandse Spoorwegen, 1918-1921,
// ontwerp G.W. van Heukelom, het grootste bakstenen gebouw van Nederland en sinds 1995 het hoofdkantoor van ProRail
// (rijksmonument 46955, complex met Hoofdgebouw I en II). In de toren boven de hoofdingang aan het Moreelsepark zit de
// watertoren van 1921 (reservoir 27 m³, ook van Van Heukelom). Het register: plat afgedekt, vijf bouwlagen, symmetrisch
// rond een rechthoekige binnenplaats, aan elke gevel (buiten en aan de binnenplaats, behalve de zuidwestelijke
// binnengevel) een hoger middenrisaliet met ingang, de hoog oprijzende trap- annex watertoren boven de hoofdingang,
// sprongsgewijs verjongende steunberen en verdiepte vensters in spaarvelden met lisenen; 19 en 16 traveeën.
//
// Het model vervangt het hele BAG-pand 0344100000012848 (bouwjaar 1921 in de BAG, 8907 m² grondvlak). Let op: de
// Kanzo-taak noemde pand 0344100000042112; dat is Hoofdgebouw II (De Tulpenburgh, 1893-1895) ten noorden ervan.
//
// Opbouw: de plattegrond is de BAG-contour (inktpotBag() onderaan, met de steunberen en de binnenplaats als gat). De
// steunberen staan in de BAG op het maaiveld 1,7 m (buiten) of 1,04 m (binnenplaats) voor de gevel; ze verjongen in
// het model tot 1,1 m vanaf 7 m en tot 0,5 m vanaf 12 m. De gevellijn zelf is de BAG-contour na een opening van 0,5 m
// (smalle uitsteeksels weg). Elke bouwmassa (vleugels, risalieten, torenblok, hal) is de plattegrond binnen een
// rechthoek tot zijn dakhoogte uit het AHN; de randen van de daken zijn borstweringen. Tussen de steunberen zitten
// verdiepte spaarvelden (0,3 m) met per verdieping verdiepte venstergroepen (nog 0,25 m), plafonds onder 45 graden.
// Daarboven de toren (schacht met twee hogere pylonen opzij, verdiept middenveld met spleten) en de UFO 'Zover' van
// Marc Ruygrok (Panorama 2000, 12 m) op het dak van het torenblok.
//
// Oorsprong op de as van de toren op het maaiveld (AHN-DTM langs de zij- en achtergevel NAP +2,45). +X naar de
// hoofdingang aan het Moreelsepark (RD-richting 28,0 graden, loodrecht op de gevels; de BAG-gevels liggen binnen 0,1 m
// evenwijdig), +Y linksom daarop (noordwest). Hoogtes uit het AHN-DSM 0,5 m en de 3D BAG (LoD2.2), boven NAP +2,45.
import { Manifold, CrossSection, ccw, hull, union, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [136367.28, 455491.55];
const AXIS_DEG = 28.0;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 2.45;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06 op de straat langs de
// zij- en achtergevel: (-27, 57) 45,88, (-27, -57) 45,80, (-78, 0) 45,86; voor de hoofdingang ligt PDOK hoger (46,3 tot 46,4).
const GROUND_ELLIPSOID = 45.8;
const TOP = 70;

// ---------- hoogtes boven het maaiveld (AHN-DSM, NAP − 2,45) ----------
const H = {
  wing: 22.7, // platte daken van de vleugels (NAP +25,15)
  wingParapet: 24.25, // borstwering aan de buitengevel (NAP +26,7)
  side: 27.15, // middenrisalieten van de zijgevels (NAP +29,6)
  sideParapet: 28.55,
  sideCore: [29.85, 29.7], // trappenhuis op het zijrisaliet (+Y, −Y)
  back: 29.45, // middenrisaliet achtergevel (NAP +31,9)
  backParapet: 30.65,
  front: 29.7, // middenrisaliet voorgevel met de hoofdingang (NAP +32,15)
  frontParapet: 30.95,
  flank: 28.65, // zijdelen naast het torenblok (NAP +31,1)
  flankParapet: 30.95,
  block: 41.6, // torenblok (NAP +44,05)
  blockParapet: 42.85,
  shaft: 60.0, // toren (NAP +62,45)
  shaftParapet: 60.95,
  pylon: 61.5, // pylonen opzij van de toren (NAP +63,95, 3D BAG 63,91)
  hall: 8.95, // hal op de binnenplaats (NAP +11,4)
  lantern: 10.9,
  backLink: 3.85,
  frontLink: 3.75,
  backEntrance: 3.8, // verhoogde ingang achter een borstwering
  landing: 3.15, // bordes van de hoofdingang
};

// ---------- plattegrond (BAG) ----------
const flatPts = (f) => Array.from({ length: f.length / 2 }, (_, i) => [f[2 * i], f[2 * i + 1]]);
const [outerFlat, holeFlat] = inktpotBag();
const outerRing = ccw(flatPts(outerFlat));
const holeRing = ccw(flatPts(holeFlat)).reverse();
const plan = new CrossSection([outerRing, holeRing], "EvenOdd");
const open = (cs) => cs.offset(-0.5, "Miter", 4).offset(0.5, "Miter", 4);
const opened = open(plan);
const openedOuter = open(new CrossSection([outerRing], "EvenOdd"));
const trim = (k) => plan.intersect(opened.offset(k, "Miter", 4));
const ext = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
const STEP = [7, 12]; // steunberen verjongen op deze hoogtes
const planSolid = union([ext(plan, BASE, STEP[0]), ext(trim(1.1), STEP[0], STEP[1]), ext(trim(0.5), STEP[1], TOP)]);

// ---------- bouwmassa's: rechthoeken [x0, y0, x1, y1] met dakhoogte ----------
const COURT = [-51.65, -32.3, -2.35, 31.8]; // binnenplaats (met hal en risalieten erin)
const Z = {
  wings: [[-71.95, -60, COURT[0], 60], [COURT[2], -60, 18.05, 60], [COURT[0], COURT[3], COURT[2], 60], [COURT[0], -60, COURT[2], COURT[1]]],
  sidePos: [[-38.4, 24.7, -15.7, 60]],
  sideNeg: [[-38.4, -60, -15.7, -25.3]],
  back: [[-71.95, -13.9, COURT[0], 13.6], [-74, 7.8, -71.95, 13.6], [-74, -13.9, -71.95, -8.2]],
  backEntrance: [[-76, -8.2, -71.95, 7.8]],
  hall: [[-48.6, -15.1, -20.4, 14.7]],
  backLink: [[COURT[0], -15.1, -48.6, 14.7]],
  frontLink: [[-20.6, -14.0, -11.2, -7.0]],
  flank: [[-11.2, -14.4, 8.15, 14.6]],
  block: [[-11.2, -8.4, 9.65, 7.9]],
  front: [[8.15, -14.4, 18.05, 14.6], [18.05, 7.9, 19.8, 14.6], [18.05, -14.4, 19.8, -8.0]],
  landing: [[18.05, -8.0, 21.0, 7.9]],
};
const ZONES = [
  [Z.wings, H.wing], [Z.sidePos, H.side], [Z.sideNeg, H.side], [Z.back, H.back], [Z.backEntrance, H.backEntrance],
  [Z.hall, H.hall], [Z.backLink, H.backLink], [Z.frontLink, H.frontLink], [Z.flank, H.flank], [Z.block, H.block],
  [Z.front, H.front], [Z.landing, H.landing],
];
const inRect = ([x0, y0, x1, y1], x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1;
const zoneHeight = (x, y) => Math.max(0, ...ZONES.filter(([rs]) => rs.some((r) => inRect(r, x, y))).map(([, h]) => h));
const rectsBox = (rs, z0, z1) => union(rs.map(([x0, y0, x1, y1]) => box(x0, y0, z0, x1, y1, z1)));
const zoneMass = (rs, z0, z1) => planSolid.intersect(rectsBox(rs, z0, z1));
const rectCs = ([x0, y0, x1, y1]) => new CrossSection([[[x0, y0], [x1, y0], [x1, y1], [x0, y1]]]);
// Borstwering: de massa van de zone tussen dak en top, behalve wat meer dan w binnen de gevel en binnen de rechthoek ligt.
const rim = (rs, outer, h, top, w, edge = opened) => {
  const [x0, y0, x1, y1] = outer;
  const inner = edge.offset(-w, "Miter", 4).intersect(rectCs([x0 + w, y0 + w, x1 - w, y1 - w]));
  return zoneMass(rs, h - 0.01, top).subtract(ext(inner, h - 1, top + 1));
};

const masses = ZONES.map(([rs, h]) => zoneMass(rs, BASE, h));
const rims = [
  rim(Z.wings, [-80, -60, 30, 60], H.wing, H.wingParapet, 0.9, openedOuter),
  rim(Z.sidePos, Z.sidePos[0], H.side, H.sideParapet, 1.0),
  rim(Z.sideNeg, Z.sideNeg[0], H.side, H.sideParapet, 1.0),
  rim(Z.back, [-74, -13.9, COURT[0], 13.6], H.back, H.backParapet, 0.9),
  rim(Z.front, [8.15, -14.4, 19.8, 14.6], H.front, H.frontParapet, 0.9),
  rim(Z.flank, Z.flank[0], H.flank, H.flankParapet, 0.9),
  rim(Z.block, Z.block[0], H.block, H.blockParapet, 0.6),
];
const extras = [
  box(-38.55, -3.2, H.hall - 0.1, -32.55, 3.1, H.lantern), // lantaarn op de hal
  box(-29.85, 30.3, H.side - 0.1, -24.35, 36.3, H.sideCore[0]), // trappenhuizen op de zijrisalieten
  box(-29.25, -37.2, H.side - 0.1, -25.25, -31.2, H.sideCore[1]),
];
// Stoep van de hoofdingang: bordes en vier treden naar het Moreelsepark (BAG-uitbouw tot x = 24,7).
const steps = [2.5, 1.85, 1.2, 0.55].map((z, i) => box(21.0 + 0.925 * i, -8.0, BASE, 21.0 + 0.925 * (i + 1), 7.9, z));
const stoep = planSolid.intersect(union(steps));

// ---------- gevels: spaarvelden en vensters ----------
const R1 = 0.3; // diepte spaarveld
const R2 = 0.25; // diepte venster in het spaarveld
const LISENE = 0.45;
const FLOORS = [[3.0, 6.4], [7.4, 10.8], [11.8, 15.2], [16.2, 19.6], [20.6, 24.0], [25.0, 28.4], [29.4, 32.8], [33.8, 37.2]];
// Gevelstelsel: punt a, richting t, buitennormaal n; s langs de gevel, d naar buiten.
const frame = (a, t, n) => (s, d, z) => [a[0] + t[0] * s + n[0] * d, a[1] + t[1] * s + n[1] * d, z];
// Uitsparing van s0 tot s1, van z0 tot z1, vanaf vlak d (diepte dep), met een plafond onder 50 graden.
const recess = (P, s0, s1, d, dep, z0, z1) => hull([
  P(s0, d - dep, z0), P(s1, d - dep, z0), P(s0, d + 1, z0), P(s1, d + 1, z0),
  P(s0, d - dep, z1 - 1.2 * dep), P(s1, d - dep, z1 - 1.2 * dep), P(s0, d + 1, z1 + 1.2), P(s1, d + 1, z1 + 1.2),
]);
// Spaarveld met per verdieping een venstergroep van één tot drie vensters met penanten van 0,35 m.
const bay = (P, s0, s1, z0, z1, floors = FLOORS) => {
  const w = s1 - s0;
  if (w < 1.4 || z1 - z0 < 3) return [];
  const out = [recess(P, s0, s1, 0, R1, z0, z1)];
  const n = w >= 3.6 ? 3 : w >= 2.4 ? 2 : 1;
  const ww = (w - 0.35 * (n + 1)) / n;
  for (const [f0, f1] of floors) {
    if (f0 < z0 + 0.5 || f1 > z1 - 0.6) continue;
    for (let k = 0; k < n; k++) {
      const a = s0 + 0.35 + k * (ww + 0.35);
      out.push(recess(P, a, a + ww, -R1, R2, f0, f1));
    }
  }
  return out;
};
// Gevels van de BAG-contour: per recht stuk de steunberen (uitsteeksels van de BAG-contour buiten de geopende gevel)
// en daartussen de spaarvelden tot 2,2 m onder het dak van de massa erachter.
const buttresses = plan.subtract(opened).decompose().map((c) => {
  const b = c.bounds();
  return [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, b];
});
const cuts = [];
let facadeBays = 0;
for (const poly of opened.toPolygons()) {
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 4) continue; // korte stukken (zijkant van een risaliet met hoeksteunbeer) zijn te dun voor een veld
    const t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
    const n = [t[1], -t[0]];
    const P = frame(a, t, n);
    const spans = [];
    for (const [cx, cy, bb] of buttresses) {
      const s = (cx - a[0]) * t[0] + (cy - a[1]) * t[1];
      const d = (cx - a[0]) * n[0] + (cy - a[1]) * n[1];
      if (d < 0 || d > 1.2 || s < -0.5 || s > L + 0.5) continue;
      const half = Math.abs(t[0]) > 0.5 ? (bb.max[0] - bb.min[0]) / 2 : (bb.max[1] - bb.min[1]) / 2;
      spans.push([s - half, s + half]);
    }
    spans.sort((p, q) => p[0] - q[0]);
    const gaps = [];
    let cur = 0;
    for (const [s0, s1] of spans) {
      gaps.push([cur, s0]);
      cur = Math.max(cur, s1);
    }
    gaps.push([cur, L]);
    for (const [g0, g1] of gaps) {
      // laagste dak achter het veld (een veld kan op de grens van twee massa's liggen)
      const h = Math.min(...[g0 + 0.5, (g0 + g1) / 2, g1 - 0.5].map((s) => zoneHeight(...P(s, -1, 0).slice(0, 2))));
      if (h < 6) continue;
      const parts = bay(P, g0 + LISENE, g1 - LISENE, 2.0, h - 2.2);
      if (parts.length) facadeBays++;
      cuts.push(...parts);
    }
  }
}

// Gevels boven de daken eromheen, met eigen lisenen (0,9 m breed, 0,4 m uit de gevel).
const PIL = 0.9;
const explicitFace = (a, t, n, L, k, z0, z1, floors, pilZ0) => {
  const P = frame(a, t, n);
  const step = (L - PIL) / k;
  const adds = [];
  for (let j = 0; j <= k; j++) {
    const s = j * step;
    adds.push(hull([P(s, 0, pilZ0), P(s + PIL, 0, pilZ0), P(s, 0.4, pilZ0), P(s + PIL, 0.4, pilZ0), P(s, 0, z1 + 0.6), P(s + PIL, 0, z1 + 0.6), P(s, 0.4, z1 + 0.6), P(s + PIL, 0.4, z1 + 0.6)]));
    if (j < k) cuts.push(...bay(P, s + PIL + 0.25, s + step - 0.25, z0, z1, floors));
  }
  return adds;
};
const BLOCK_FLOORS = [[31.0, 34.4], [35.4, 38.8]];
const [bx0, by0, bx1, by1] = Z.block[0];
const pilasters = [
  // torenblok: voorgevel boven het voorrisaliet (drie traveeën), zijgevels boven de zijdelen (vier traveeën)
  ...explicitFace([bx1, by1], [0, -1], [1, 0], by1 - by0, 3, H.front + 0.8, H.block - 2.2, BLOCK_FLOORS, H.front),
  ...explicitFace([bx0 + 1.4, by1], [1, 0], [0, 1], bx1 - bx0 - 1.4, 4, H.flank + 0.8, H.block - 2.2, BLOCK_FLOORS, H.flank),
  ...explicitFace([bx1, by0], [-1, 0], [0, -1], bx1 - bx0 - 1.4, 4, H.flank + 0.8, H.block - 2.2, BLOCK_FLOORS, H.flank),
  // voorrisaliet boven de stoep: drie traveeën met de drievoudige hoofdingang
  ...explicitFace([18.0, 7.9], [0, -1], [1, 0], 15.9, 3, 8.2, H.front - 2.2, FLOORS, H.landing),
  // hoekpenanten van het torenblok aan de voorkant (de lisenen van beide gevels komen hier samen)
  ...[by0, by1].map((y) => box(bx1 - 1.0, y - 1.0, H.flank, bx1 + 0.4, y + 0.4, H.block - 1.6)),
];
// Drie ingangen in zich verdiepende nissen (0,4 en 0,9 m) boven het bordes.
for (const y of [-5.05, 0, 4.95]) {
  const P = frame([18.0, y], [0, -1], [1, 0]);
  cuts.push(recess(P, -1.5, 1.5, 0, 0.4, H.landing, 7.6), recess(P, -1.1, 1.1, -0.4, 0.5, H.landing, 7.0));
}

// ---------- toren ----------
const SX = 4.65, SY = 3.0; // schacht 9,3 × 6,0 m (AHN-DSM)
const PY = [-1.65, 2.15, 4.4]; // pylonen: x van, x tot, halve diepte (AHN: 3,8 m breed, 1,4 m uit de schacht)
const shaftBody = union([
  box(-SX, -SY, BASE, SX, SY, H.shaft),
  box(SX - 0.7, -SY, H.shaft - 0.1, SX, SY, H.shaftParapet),
  box(-SX, -SY, H.shaft - 0.1, -SX + 0.7, SY, H.shaftParapet),
  box(PY[0], -PY[2], BASE, PY[1], PY[2], H.pylon),
]);
const towerCuts = [];
for (const sgn of [1, -1]) {
  // voor- en achtergevel: verdiept middenveld met drie spleten en bovenin vier nissen
  const P = frame([sgn * SX, sgn * SY], [0, -sgn], [sgn, 0]);
  towerCuts.push(recess(P, 0.7, 5.3, 0, R1, 43.5, 57.0));
  for (const s of [1.4, 3.0, 4.6]) towerCuts.push(recess(P, s - 0.35, s + 0.35, -R1, 0.3, 45.0, 56.0));
  for (const s of [0.6, 2.2, 3.8, 5.4]) towerCuts.push(recess(P, s - 0.35, s + 0.35, 0, 0.35, 57.8, 59.2));
  // pylonen: twee spleten
  const Q = frame([PY[1], sgn * PY[2]], [-1, 0], [0, sgn]);
  for (const s of [1.05, 2.75]) towerCuts.push(recess(Q, s - 0.35, s + 0.35, 0, 0.35, 46.0, 58.0));
}
const shaft = shaftBody.subtract(union(towerCuts));

// ---------- UFO 'Zover' (Marc Ruygrok, 2000) ----------
// Schotel van 12 m op het dak van het torenblok, half over de voorgevel en de noordwestgevel (3D BAG-dakvlakken van
// de schotel: hart x = 9,9, y = 5,85, top NAP +49,07). De onderkant is een kegel van 48 graden waarvan de punt in het
// torenblok ligt (in werkelijkheid vlakker, op een poot), zodat hij zonder steun print; daarvoor staat de as 0,6 m
// achter de gemeten plek, net binnen de voorgevel van het torenblok.
const UFO = { x: 9.3, y: 5.85, r: 6.0, rim: [44.15, 44.65], top: 46.62 };
const apex = UFO.rim[0] - UFO.r * Math.tan((48 * Math.PI) / 180);
const ufo = Manifold.revolve(
  new CrossSection([[[0, apex], [UFO.r, UFO.rim[0]], [UFO.r, UFO.rim[1]], [4.4, 45.4], [2.3, 45.8], [2.0, 46.3], [0, UFO.top]]]),
  48,
).translate([UFO.x, UFO.y, 0]);

// Kilgoot van 2,5 m breed en 0,6 m diep midden over de vleugeldaken (AHN-DSM: NAP +24,55 tegen +25,15 ernaast), als
// ring rond de binnenplaats; onderbroken door de hogere risalieten en het torenblok.
const GUTTER = { w: 2.5, z: H.wing - 0.6, x: [-60.85, 6.8], y: [41.05, -41.45] };
const g = GUTTER.w / 2;
const gutterRing = union([
  box(GUTTER.x[0] - g, GUTTER.y[1] - g, GUTTER.z, GUTTER.x[0] + g, GUTTER.y[0] + g, H.wing + 1),
  box(GUTTER.x[1] - g, GUTTER.y[1] - g, GUTTER.z, GUTTER.x[1] + g, GUTTER.y[0] + g, H.wing + 1),
  box(GUTTER.x[0] - g, GUTTER.y[0] - g, GUTTER.z, GUTTER.x[1] + g, GUTTER.y[0] + g, H.wing + 1),
  box(GUTTER.x[0] - g, GUTTER.y[1] - g, GUTTER.z, GUTTER.x[1] + g, GUTTER.y[1] + g, H.wing + 1),
]).subtract(rectsBox([...Z.sidePos, ...Z.sideNeg, ...Z.back, ...Z.flank, ...Z.front].map(([x0, y0, x1, y1]) => [x0 - 0.5, y0 - 0.5, x1 + 0.5, y1 + 0.5]), H.wing - 2, H.wing + 2));
cuts.push(gutterRing);

// ---------- samenvoegen ----------
const mass = union([...masses, ...rims, ...extras, stoep, ...pilasters]).subtract(union(cuts));
// De toren staat als eigen onderdeel op het maaiveld: schacht en pylonen lopen door het torenblok tot de onderkant.
const towerColumn = union([box(-SX, -SY, BASE - 1, SX, SY, H.block), box(PY[0], -PY[2], BASE - 1, PY[1], PY[2], H.block)]);
const building = union([mass, ufo.subtract(shaftBody)]).subtract(towerColumn);
const tower = shaft.subtract(building);

await writeLandmark({
  slug: "watertoren-utrecht-de-inktpot",
  base: BASE,
  nodes: [
    ["building:watertoren-schacht-pylonen-en-middenveld", tower],
    ["building:inktpot-vleugels-risalieten-torenblok-en-ufo", building],
  ],
  catalog: {
    name: "De Inktpot (watertoren) Utrecht",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-27, 57], [-27, -57], [-78, 0]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de straat langs de zij- en achtergevel.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000012848"],
    description:
      "Oorsprong op de as van de watertoren op het maaiveld (NAP +2,45 m), +X naar de hoofdingang aan het Moreelsepark (RD-richting 28,0 graden), +Y naar het noordwesten. Het hele BAG-pand 0344100000012848 (Hoofdadministratiegebouw III, 1918-1921): vleugels rond de binnenplaats tot 22,7 m met borstwering, hogere middenrisalieten aan elke gevel (27,15 tot 29,7 m), steunberen uit de BAG-contour die verjongen op 7 en 12 m, spaarvelden met venstergroepen per verdieping, de hal op de binnenplaats (8,95 m), de stoep en de drievoudige hoofdingang, het torenblok tot 41,6 m, de toren tot 60,0 m met pylonen tot 61,5 m en de UFO 'Zover' op het torenblok.",
    realWorld: {
      built: "1918-1921",
      architect: "G.W. van Heukelom",
      monument: 46955,
      waterTowerReservoirM3: 27,
      wikipediaHeightM: 60,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 63.95,
      heightsM: H,
      ufoDiameterM: 12,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/De_Inktpot (1918-1921, G.W. van Heukelom, watertoren 1921 met reservoir van 27 m³, UFO van Marc Ruygrok, 12 m)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/46955 (Hoofdgebouw III: vijf bouwlagen, binnenplaats, middenrisalieten, steunberen, spaarvelden, toren boven de hoofdingang)",
      "https://commons.wikimedia.org/wiki/File:Voorgevel_-_Utrecht_-_20235288_-_RCE.jpg, File:Middenpartij_voorgevel_-_Utrecht_-_20235289_-_RCE.jpg, File:Linker_zijgevel_-_Utrecht_-_20235292_-_RCE.jpg, File:Achtergevel_-_Utrecht_-_20235293_-_RCE.jpg (gevels, steunberen, spaarvelden, toren)",
      "https://commons.wikimedia.org/wiki/File:Voorzijde_met_kunstwerk_%27De_UFO%27_-_Utrecht_-_20350262_-_RCE.jpg (UFO op het torenblok)",
      "https://commons.wikimedia.org/wiki/File:NIMH_-_2011_-_3666_-_Aerial_photograph_of_Utrecht,_The_Netherlands.jpg (luchtfoto uit de bouwtijd: binnenplaats en daken)",
      "PDOK BAG-pand 0344100000012848, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0344100000012848, LoD2.2-dakvlakken als controle, opgehaald 2026-11-06",
    ],
  },
});
console.log({ facadeBays, cuts: cuts.length, ufoApex: +apex.toFixed(2) });

// ---------- data: BAG-contour ----------
// Contour van BAG-pand 0344100000012848 (PDOK BAG WFS, opgehaald 2026-11-06) in het modelstelsel (x langs RD-richting
// 28,0 graden, y haaks daarop linksom, in meters vanaf ORIGIN), vereenvoudigd tot 5 cm (Douglas-Peucker): de buitenring
// en de binnenplaats, elk als vlakke lijst x, y.
function inktpotBag() {
  return [
    [8.63, 52.05, 8.63, 50.35, 4.48, 50.35, 4.48, 52.05, 3.6, 52.05, 3.6, 50.35, -0.61, 50.35, -0.61, 52.05, -1.49, 52.05, -1.49, 50.35, -5.51, 50.35, -5.51, 52.05, -6.39, 52.05, -6.39, 50.35, -10.58, 50.34, -10.58, 52.04, -11.46, 52.04, -11.46, 50.34, -15.81, 50.34, -15.81, 52.04, -16, 52.04, -16, 53.99, -16.88, 53.99, -16.88, 52.29, -21.5, 52.29, -21.5, 53.99, -22.38, 53.99, -22.38, 52.29, -26.48, 52.29, -26.48, 53.99, -27.36, 53.99, -27.36, 52.29, -31.58, 52.29, -31.58, 53.99, -32.46, 53.99, -32.46, 52.29, -37.11, 52.29, -37.11, 53.99, -37.99, 53.99, -37.99, 52.02, -38.14, 52.02, -38.14, 50.32, -42.57, 50.32, -42.57, 52.02, -43.45, 52.02, -43.45, 50.32, -47.52, 50.32, -47.52, 52.02, -48.4, 52.02, -48.4, 50.32, -52.47, 50.31, -52.47, 52.01, -53.35, 52.01, -53.35, 50.31, -57.51, 50.31, -57.51, 52.01, -58.39, 52.01, -58.39, 50.31, -62.48, 50.31, -62.48, 52.01, -63.36, 52.01, -63.36, 50.31, -68.66, 50.31, -68.66, 52.01, -69.54, 52.01, -69.54, 50.31, -69.88, 50.31, -69.88, 49.71, -71.58, 49.71, -71.58, 48.83, -69.88, 48.83, -69.88, 43.74, -71.58, 43.74, -71.59, 42.86, -69.89, 42.86, -69.89, 38.75, -71.59, 38.75, -71.59, 37.87, -69.89, 37.87, -69.89, 33.69, -71.59, 33.7, -71.59, 32.82, -69.89, 32.82, -69.9, 28.69, -71.6, 28.7, -71.6, 27.82, -69.9, 27.81, -69.9, 23.69, -71.6, 23.69, -71.6, 22.81, -69.9, 22.81, -69.9, 18.73, -71.61, 18.73, -71.61, 18.28, -71.61, 17.85, -69.91, 17.85, -69.91, 13.46, -73.69, 13.4, -73.69, 12.36, -71.92, 12.36, -71.91, 7.76, -75.81, 7.75, -75.79, -8.15, -71.89, -8.14, -71.89, -12.74, -73.65, -12.74, -73.65, -13.65, -71.62, -13.64, -71.62, -13.83, -69.92, -13.83, -69.93, -18.24, -71.63, -18.24, -71.63, -18.67, -71.63, -19.12, -69.93, -19.12, -69.93, -23.36, -71.63, -23.36, -71.63, -24.24, -69.93, -24.24, -69.93, -28.29, -71.63, -28.29, -71.64, -29.17, -69.94, -29.17, -69.94, -33.23, -71.64, -33.23, -71.64, -34.11, -69.94, -34.11, -69.94, -38.35, -71.64, -38.35, -71.64, -39.22, -69.94, -39.23, -69.95, -43.3, -71.65, -43.3, -71.65, -44.18, -69.95, -44.18, -69.95, -49.3, -71.65, -49.3, -71.65, -50.18, -69.95, -50.18, -69.95, -50.54, -69.51, -50.54, -69.51, -52.24, -68.63, -52.24, -68.63, -50.54, -63.47, -50.54, -63.47, -52.24, -62.59, -52.24, -62.59, -50.54, -58.47, -50.53, -58.47, -52.23, -57.59, -52.23, -57.59, -50.53, -53.42, -50.53, -53.42, -52.23, -52.54, -52.23, -52.54, -50.53, -48.41, -50.53, -48.41, -52.23, -47.53, -52.22, -47.53, -50.53, -43.43, -50.52, -43.43, -52.22, -42.55, -52.22, -42.55, -50.52, -38.11, -50.52, -38.11, -52.22, -37.98, -52.21, -37.98, -54.24, -37.09, -54.24, -37.1, -52.54, -32.49, -52.53, -32.48, -54.23, -31.6, -54.23, -31.61, -52.53, -27.37, -52.55, -27.38, -54.22, -26.54, -54.22, -26.53, -52.55, -22.4, -52.56, -22.41, -54.23, -21.52, -54.23, -21.51, -52.56, -16.94, -52.57, -16.94, -54.24, -15.95, -54.24, -15.95, -52.57, -15.82, -52.57, -15.82, -50.54, -11.44, -50.55, -11.44, -52.26, -10.6, -52.26, -10.6, -50.55, -6.45, -50.55, -6.45, -52.27, -5.57, -52.27, -5.57, -50.55, -1.43, -50.56, -1.43, -52.27, -0.57, -52.27, -0.56, -50.56, 3.61, -50.56, 3.6, -52.28, 4.49, -52.28, 4.49, -50.56, 8.61, -50.56, 8.61, -52.28, 9.52, -52.28, 9.52, -50.56, 14.61, -50.57, 14.61, -52.28, 15.55, -52.28, 15.55, -50.57, 15.96, -50.57, 15.94, -50.03, 17.64, -50.03, 17.64, -49.15, 15.94, -49.15, 15.93, -44.06, 17.63, -44.06, 17.63, -43.18, 15.93, -43.18, 15.94, -39.03, 17.64, -39.03, 17.64, -38.15, 15.94, -38.15, 15.94, -34.03, 17.64, -34.03, 17.64, -33.15, 15.94, -33.15, 15.94, -29.05, 17.64, -29.05, 17.64, -28.17, 15.94, -28.17, 15.94, -23.99, 17.64, -23.99, 17.64, -23.11, 15.94, -23.11, 15.94, -19.03, 17.64, -19.03, 17.64, -18.15, 15.94, -18.15, 15.94, -13.7, 17.64, -13.7, 17.64, -13.61, 19.7, -13.61, 19.7, -12.73, 18, -12.73, 17.99, -8.05, 24.7, -8.02, 24.6, 7.9, 17.98, 7.88, 17.97, 12.54, 19.67, 12.54, 19.67, 13.42, 17.65, 13.42, 17.65, 13.62, 15.95, 13.62, 15.95, 17.93, 17.65, 17.93, 17.65, 18.81, 15.95, 18.81, 15.94, 22.92, 17.64, 22.92, 17.64, 23.8, 15.94, 23.8, 15.94, 27.98, 17.64, 27.98, 17.64, 28.86, 15.94, 28.86, 15.94, 32.82, 17.64, 32.82, 17.64, 33.7, 15.94, 33.7, 15.94, 37.92, 17.64, 37.92, 17.64, 38.8, 15.94, 38.8, 15.93, 42.88, 17.64, 42.88, 17.64, 43.76, 15.93, 43.76, 15.93, 49.08, 17.63, 49.09, 17.63, 49.97, 15.93, 49.96, 15.93, 50.36, 15.57, 50.35, 15.57, 52.06, 14.69, 52.06, 14.69, 50.35, 9.51, 50.35, 9.51, 52.05],
    [-20.54, -3.11, -20.54, -2.23, -21.58, -2.22, -21.6, 1.9, -20.56, 1.89, -20.55, 2.77, -21.59, 2.77, -21.61, 6.87, -20.57, 6.87, -20.57, 7.74, -21.61, 7.75, -21.63, 12.35, -20.59, 12.34, -20.58, 13.22, -21.62, 13.23, -21.63, 13.61, -22.05, 13.6, -22.04, 14.64, -22.92, 14.65, -22.93, 13.61, -27.54, 13.6, -27.53, 14.64, -28.41, 14.64, -28.42, 13.6, -32.54, 13.59, -32.53, 14.63, -33.41, 14.64, -33.42, 13.6, -37.57, 13.59, -37.56, 14.63, -38.44, 14.64, -38.45, 13.6, -42.54, 13.58, -42.53, 14.62, -43.41, 14.63, -43.42, 13.59, -47.56, 13.58, -47.55, 14.62, -48.43, 14.63, -48.44, 13.59, -51.61, 13.59, -51.61, 17.87, -50.57, 17.86, -50.57, 18.74, -51.61, 18.75, -51.61, 22.82, -50.57, 22.81, -50.57, 23.69, -51.6, 23.7, -51.61, 27.84, -50.57, 27.83, -50.56, 28.71, -51.6, 28.72, -51.6, 31.92, -48.46, 31.93, -48.47, 30.89, -47.59, 30.88, -47.58, 31.92, -43.47, 31.87, -43.48, 30.83, -42.6, 30.82, -42.6, 31.86, -42.18, 31.86, -42.19, 31.75, -41.86, 31.82, -41.63, 32.14, -41.62, 32.34, -39.14, 32.31, -39.08, 32.04, -38.78, 31.77, -38.58, 31.74, -38.58, 31.92, -38.2, 31.91, -38.2, 31.81, -38.03, 31.81, -38.04, 30.77, -37.16, 30.76, -37.15, 31.8, -36.36, 31.81, -36.36, 27.25, -37.4, 27.26, -37.4, 26.38, -36.36, 26.37, -36.36, 25.98, -35.89, 25.99, -35.9, 24.95, -35.02, 24.94, -35.01, 25.98, -32.38, 25.99, -32.38, 24.95, -31.5, 24.95, -31.5, 25.99, -27.36, 26, -27.37, 24.96, -26.49, 24.96, -26.48, 26, -22.47, 26.01, -22.48, 24.97, -21.6, 24.97, -21.59, 26.01, -18.95, 26, -18.96, 24.96, -18.08, 24.95, -18.07, 25.99, -17.62, 26.01, -17.62, 26.54, -16.58, 26.53, -16.58, 27.41, -17.62, 27.42, -17.6, 31.93, -16.9, 31.91, -16.91, 30.87, -16.03, 30.86, -16.02, 31.9, -15.73, 31.89, -15.73, 32, -15.34, 32.01, -15.34, 31.9, -15.12, 31.96, -14.83, 32.27, -14.8, 32.48, -12.36, 32.46, -12.29, 32.23, -11.95, 31.9, -11.71, 31.84, -11.7, 32.04, -11.45, 32.04, -11.45, 31, -10.57, 30.99, -10.57, 32.03, -6.36, 32.02, -6.36, 30.98, -5.48, 30.97, -5.48, 32.01, -2.28, 32, -2.29, 28.76, -3.33, 28.77, -3.33, 27.89, -2.29, 27.88, -2.29, 23.78, -3.33, 23.79, -3.34, 22.91, -2.3, 22.9, -2.3, 18.7, -3.34, 18.71, -3.34, 17.83, -2.3, 17.82, -2.3, 15.96, -2.04, 15.96, -2.04, 14.58, -2.3, 14.58, -2.3, 13.74, -3.61, 13.74, -3.61, 14.78, -4.49, 14.79, -4.49, 13.75, -8.14, 13.77, -8.14, 14.81, -9.02, 14.81, -9.02, 13.77, -9.57, 13.78, -9.56, 13.2, -10.94, 13.21, -10.95, 12.33, -9.57, 12.32, -9.56, 7.74, -10.94, 7.75, -10.95, 6.87, -9.57, 6.86, -9.55, 2.73, -10.93, 2.74, -10.94, 1.86, -9.56, 1.85, -9.54, -2.19, -10.92, -2.18, -10.93, -3.06, -9.55, -3.07, -9.53, -7.13, -10.91, -7.12, -10.92, -7.55, -13.51, -7.57, -13.51, -7.36, -13.83, -7.36, -13.94, -7.58, -14.05, -7.58, -14.04, -7.7, -14.16, -7.7, -14.07, -12.62, -14.11, -12.92, -14.22, -12.92, -14.22, -13.09, -14, -13.2, -13.89, -13.42, -13.52, -13.42, -13.52, -13.2, -10.91, -13.21, -10.91, -13.71, -9.53, -13.72, -9.52, -13.98, -9.19, -13.98, -9.19, -15.02, -8.31, -15.02, -8.31, -13.98, -4.44, -14, -4.44, -15.04, -3.56, -15.04, -3.56, -14.01, -2.37, -14.01, -2.38, -18.16, -3.42, -18.15, -3.43, -19.03, -2.39, -19.04, -2.4, -23.16, -3.44, -23.15, -3.45, -24.03, -2.41, -24.04, -2.42, -28.18, -3.46, -28.17, -3.47, -29.05, -2.43, -29.06, -2.44, -32.23, -5.6, -32.25, -5.6, -31.21, -6.48, -31.2, -6.48, -32.24, -10.63, -32.25, -10.62, -31.21, -11.5, -31.2, -11.51, -32.24, -15.88, -32.25, -15.88, -32.12, -16.03, -32.13, -16.02, -31.09, -16.9, -31.08, -16.91, -32.12, -17.65, -32.12, -17.66, -27.67, -16.62, -27.68, -16.61, -26.8, -17.65, -26.79, -17.66, -26.28, -18.25, -26.29, -18.24, -25.25, -19.12, -25.24, -19.13, -26.28, -21.63, -26.28, -21.63, -25.24, -22.51, -25.24, -22.51, -26.28, -26.54, -26.29, -26.53, -25.25, -27.41, -25.24, -27.42, -26.28, -31.59, -26.29, -31.58, -25.25, -32.46, -25.25, -32.47, -26.29, -34.99, -26.3, -34.98, -25.26, -35.86, -25.25, -35.87, -26.29, -36.35, -26.3, -36.35, -26.83, -37.38, -26.83, -37.39, -27.71, -36.35, -27.71, -36.34, -32.14, -37.01, -32.14, -37, -31.1, -37.88, -31.09, -37.89, -32.13, -38.11, -32.14, -38.11, -32.28, -42.6, -32.28, -42.59, -31.25, -43.47, -31.24, -43.48, -32.28, -47.56, -32.29, -47.55, -31.25, -48.43, -31.25, -48.44, -32.29, -51.71, -32.29, -51.69, -29.1, -50.65, -29.11, -50.64, -28.23, -51.68, -28.22, -51.65, -24.03, -50.61, -24.04, -50.6, -23.16, -51.64, -23.15, -51.61, -19.06, -50.57, -19.06, -50.56, -18.18, -51.6, -18.18, -51.58, -13.91, -48.34, -13.91, -48.34, -14.95, -47.46, -14.96, -47.46, -13.92, -43.36, -13.92, -43.36, -14.96, -42.48, -14.97, -42.48, -13.93, -38.43, -13.94, -38.43, -14.98, -37.55, -14.98, -37.55, -13.94, -33.36, -13.95, -33.37, -14.99, -32.49, -14.99, -32.48, -13.95, -28.27, -13.96, -28.28, -15, -27.4, -15, -27.39, -13.96, -22.77, -13.97, -22.77, -15.01, -21.89, -15.01, -21.89, -13.97, -21.55, -13.97, -21.56, -13.65, -20.52, -13.66, -20.51, -13.2, -17.93, -13.2, -17.93, -13.42, -17.38, -13.42, -17.38, -13.31, -17.27, -13.31, -17.27, -13.2, -17.05, -13.09, -17.05, -12.98, -17.12, -12.98, -17.12, -12.39, -17.67, -12.39, -17.7, -8.33, -17.15, -8.33, -17.15, -7.72, -17.26, -7.72, -17.27, -7.61, -17.38, -7.61, -17.38, -7.5, -17.49, -7.5, -17.49, -7.39, -17.93, -7.4, -17.93, -7.62, -20.52, -7.64, -20.52, -7.2, -21.56, -7.19, -21.58, -3.1],
  ];
}

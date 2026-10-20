// Europoint aan het Marconiplein (Marconistraat / Galvanistraat, Bospolder, Rotterdam), de "Marconitorens":
// drie identieke kantoortorens van Skidmore, Owings & Merrill (1971–1979) naast het Overbeekhuis (F.U. Verbruggen
// en P.R. Goldschmidt, 1960–1965). De twee oostelijke torens (BAG-pand 0599100000701896, bouwjaar 1974) zijn
// sinds 2019 de woontorens Lee Towers (diederendirrix) met een lage entreebouw ertussen; de westelijke toren
// (pand 0599100000649440, bouwjaar 1979) is de Rotterdam Science Tower met een laag deel aan de zuidkant. Elke
// toren is een schijf van 33,5 × 47,4–47,7 m tot NAP +97 m: 22 lagen achter een raster van witte natuurstenen
// penanten en borstweringsbanden met diepliggende ramen (9 × 13 traveeën), een hoge begane grond en bovenin
// een dubbelhoge installatielaag met donkere roosters, op het dak installatieblokken. Het Overbeekhuis (pand
// 0599100000701700, bouwjaar 1966) is een vliesgevelblok van elf lagen dat aan een betonnen dakparasol op een
// kern hangt: de vloeren zweven boven een lage onderbouw, bovenop een open laag onder een raster van balken met
// een installatieopbouw. Contouren uit de BAG, hoogtes uit de 3D BAG (LoD2.2; AHN4 2020 en AHN5 2023 voor de
// torens, AHN3 2011 voor het Overbeekhuis) en het AHN-DSM 0,5 m, gevelopbouw uit foto's (Commons).
import { CrossSection, Manifold, ccw, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "marconitorens";
// Meetstelsel: u langs de korte gevels van de torens (5,86° op RD-oost; de lange BAG-zijden van alle drie de
// torens liggen in dit stelsel op een constante u, afwijking < 0,02 m), v naar het noordnoordwesten.
// S0 is een vast meetpunt; de oorsprong ligt in het midden van de entreebouw tussen de Lee Towers (u 11,5, v 2,6).
const S0 = [89200, 436390];
const ANGLE = 5.86;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const ORIGIN = [89211.17, 436393.76];
const UC = (ORIGIN[0] - S0[0]) * AXIS[0] + (ORIGIN[1] - S0[1]) * AXIS[1];
const VC = -(ORIGIN[0] - S0[0]) * AXIS[1] + (ORIGIN[1] - S0[1]) * AXIS[0];
// NAP-maaiveld: 3D BAG b3_h_maaiveld 3,31 (Lee Towers), 3,17 (Science Tower), 3,60 (Overbeekhuis); AHN-DTM op de
// straten rondom 3,2–3,7. Het verhoogde plein ten noorden van de Lee Towers (+4,4) zit in het PDOK-terrein.
const GROUND = 3.3;
const BASE = -0.8;
const z = (nap) => nap - GROUND;

const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (sec, z0, z1) => Manifold.extrude(sec, z1 - z0).translate([0, 0, z0]);
const prism = (poly, z0, z1) => prismCs(cs(poly), z0, z1);
const rect = (u0, v0, u1, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const boxNap = (u0, v0, u1, v1, top, from = BASE) => prism(rect(u0, v0, u1, v1), from, z(top));

// ---------- Torens (SOM) ----------
// Schijven in het meetstelsel (u, v), uit de BAG-zijden en de dakvlakken van de 3D BAG. Dakhoogte = 3D BAG-dakvlak
// (Lee West 96,98–97,13, Lee Oost 97,07–97,18, Science Tower 97,00–97,02; DSM-mediaan 97,0–97,1).
const TOWERS = {
  leeWest: { u: [-34.2, -0.7], v: [-41.24, 6.1], roof: 97.05 },
  leeEast: { u: [23.42, 56.9], v: [-19.66, 27.8], roof: 97.12 },
  science: { u: [-98.97, -65.47], v: [-16.07, 31.7], roof: 97.01 },
};
// Gevelraster (foto's): 9 traveeën op de korte en 13 op de lange gevels, penanten van 0,9 m. 22 lagen (begane
// grond plus 21; skyscrapercenter/PSS R+21): begane grond 7,2 m (op foto's circa 1,9 keer een gewone laag), 21
// lagen van 3,78 m, daarboven de installatielaag tot het dak (circa 7,2 m, roosters 1,5 laag hoog). Geschat uit
// frontale foto's (verhouding laag/gevelbreedte), passend op de gemeten dakhoogte.
const BAYS_SHORT = 9, BAYS_LONG = 13;
const LOBBY = 7.2, STOREY = 3.78, FLOORS = 21;
const PIER = 0.9, DEPTH = 0.35;
// Installatieblokken op de daken (3D BAG): Lee West vlak 133 (+101,1) met een lagere strook vlakken 122/123
// (+98,65); Lee Oost vlak 128 (+101,55) met daarop de witte S-vormige opbouw (vlak 129, +102,75; ook op de
// luchtfoto); Science Tower vlak 69 (+100,04) en twee kasten (vlakken 70 en 73, +98,1).
const ROOF_BOXES = [
  { poly: rect(-24.7, -29.4, -10.17, -6.5), top: 101.1 },
  { poly: rect(-24.28, -7.0, -11.2, -1.25), top: 98.65 },
  { poly: rect(33.07, -6.8, 47.52, 15.4), top: 101.55 },
  { poly: rect(-89.32, -3.2, -82.1, 18.6), top: 100.04 },
  { poly: rect(-81.1, -7.17, -76.85, -5.17), top: 98.1 },
  { poly: rect(-87.5, -7.05, -83.3, -5.1), top: 98.1 },
];
const S_SCULPTURE = { top: 102.75, poly: [[45.52, 3.82], [44.51, 4.77], [45.09, 7.82], [41.25, 11.29], [33.2, 7.92], [33.84, 5.92], [36.32, 5.4], [36.69, 6.73], [41.23, 7.97], [42.38, 6.89], [41.3, 2.94], [33.07, 1.84], [33.07, -0.19], [42.22, -0.27]] };

// Lage delen. Entreebouw tussen de Lee Towers: 3D BAG vlak 136 (+10,75–10,82), u −0,7 … 23,65, v −15,5 … 20,7.
const LEE_LOBBY = { poly: rect(-0.7, -15.5, 23.65, 20.7), top: 10.8 };
// Science Tower, zuidkant: vlak 71 (+9,16) u −98,66 … −55,0, v −49,05 … −26,97 en vlak 75 (+7,6) tussen de toren
// en dat blok (u −95,26 … −69,2). Beide daken liggen vol zonnepanelen (luchtfoto).
const SCI_LOW = { poly: rect(-98.66, -49.04, -55.0, -26.97), top: 9.16 };
const SCI_LINK = { poly: rect(-95.26, -26.97, -69.2, -16.07), top: 7.6 };
// Lage delen schuiven 0,5 m de toren in, zodat de gevelnissen erachter dicht blijven.
const INTO = 0.5;

// ---------- Overbeekhuis ----------
// Dakparasol: 3D BAG vlak 193 (+55,03–55,10), buitenrand u 82,46 … 111,78, v −25,12 … 2,84 (DSM-rand 55,0).
const SLAB = { u: [82.46, 111.78], v: [-25.12, 2.84], top: 55.05 };
// Op de luchtfoto een raster: buitenrand van 2,5 m en vier balken van 1,5 m langs de randen van het
// middenvak; daaronder de open daklaag (DSM in de vakken +49,4, 3D BAG vlakken 172–179: +49,46). Onderkant van de
// balken geschat op +53,4 (foto's: witte boeiboord van circa 1,6 m).
const RING = 2.5, BEAM = 1.5, TERRACE = 49.46, SLAB_SOFFIT = 53.4;
// Middenvak = installatieopbouw op de kern, 3D BAG vlak 190 (+63,6–63,69); ten oosten ervan een lagere
// installatieruimte (vlakken 170/189/192: +58,2–58,9; DSM 57–58,8).
const CORE = { u: [93.14, 102.3], v: [-17.72, -6.42] };
const PLANT_TOP = 63.65;
const PLANT_EAST = { poly: rect(102.3, -15.7, 108.9, -7.0), top: 58.5 };
// Gevel (vliesgevel met glas en bruine borstweringen tussen doorlopende stijlen) 0,85 m binnen de dakrand (foto's).
const FACADE_IN = 0.85;
// Elf lagen van 3,2 m tot het dakterras (foto's: elf glasbanden); onderkant van de zwevende vloeren op +14,26 m.
const OB_FLOORS = 11, OB_STOREY = 3.2;
const OB_SOFFIT = TERRACE - OB_FLOORS * OB_STOREY;
// Onderbouw: 3D BAG vlak 194 (+11,06–11,14; westkant, met de KFC) en vlak 174 (+9,83–9,94; oostkant).
const OB_BASE_W = { top: 11.1, poly: [[69.84, -21.03], [83.99, -21.03], [83.99, 2.27], [87.76, 2.27], [87.71, 27.55], [77.95, 27.55], [77.93, 18.7], [69.88, 18.72], [69.87, 7.57], [77.98, 7.54], [77.96, -2.8], [69.86, -2.79]] };
// Het oostblok loopt onder de zwevende vloeren door tot de kern (foto vanaf het zuiden: laag donker blok rechts
// van de kern, ruim onder de onderkant van de vloeren); aan de westkant verbindt een lage entreehal de onderbouw
// met de kern (geschat, onder de vloeren niet te meten).
const OB_BASE_E = { top: 9.9, poly: rect(CORE.u[1] - 0.1, -19.7, 117.2, -6.58) };
const OB_HALL = { top: 7.6, poly: rect(83.9, CORE.v[0], CORE.u[0] + 0.1, CORE.v[1]) };
// Stijlen van de open laag: 0,9 m op de gevellijn om de 3,9 m (in werkelijkheid slanke hangers om de 1,95 m),
// en in de vier hoekvakken een schoor onder 45° van de buitenhoek naar het dakterras (foto's).

// ---------- Opbouw ----------
function towerSolid(t) {
  const [u0, u1] = t.u, [v0, v1] = t.v;
  return prism(rect(u0, v0, u1, v1), BASE, z(t.roof));
}
const leeMass = union([
  towerSolid(TOWERS.leeWest),
  towerSolid(TOWERS.leeEast),
  prism(LEE_LOBBY.poly, BASE, z(LEE_LOBBY.top)),
  prism(rect(-0.7 - INTO, -15.5, -0.6, 6.0), BASE, z(LEE_LOBBY.top)),
  prism(rect(23.55, -15.5, 23.65 + INTO, 20.7), BASE, z(LEE_LOBBY.top)),
]);
const sciMass = union([
  towerSolid(TOWERS.science),
  prism(SCI_LOW.poly, BASE, z(SCI_LOW.top)),
  prism(rect(-95.26, -26.97 - INTO, -69.2, -16.07 + INTO), BASE, z(SCI_LINK.top)),
]);

const slab = rect(SLAB.u[0], SLAB.v[0], SLAB.u[1], SLAB.v[1]);
const body = rect(SLAB.u[0] + FACADE_IN, SLAB.v[0] + FACADE_IN, SLAB.u[1] - FACADE_IN, SLAB.v[1] - FACADE_IN);
const [BU0, BV0] = body[0], [BU1, BV1] = body[2];
const obParts = [
  prism(OB_BASE_W.poly, BASE, z(OB_BASE_W.top)),
  prism(OB_BASE_E.poly, BASE, z(OB_BASE_E.top)),
  prism(OB_HALL.poly, BASE, z(OB_HALL.top)),
  // Kern van maaiveld tot de installatieopbouw.
  boxNap(CORE.u[0], CORE.v[0], CORE.u[1], CORE.v[1], PLANT_TOP),
  // Hangende vloeren.
  prism(body, z(OB_SOFFIT), z(TERRACE)),
  prism(PLANT_EAST.poly, z(TERRACE) - 0.1, z(PLANT_EAST.top)),
];
// Dakparasol: buitenrand en vier balken.
const slabCs = cs(slab);
const holes = [
  [SLAB.u[0] + RING, CORE.u[0] - BEAM / 2], [CORE.u[0] + BEAM / 2, CORE.u[1] - BEAM / 2], [CORE.u[1] + BEAM / 2, SLAB.u[1] - RING],
].flatMap(([a, b]) => [
  [SLAB.v[0] + RING, CORE.v[0] - BEAM / 2], [CORE.v[0] + BEAM / 2, CORE.v[1] - BEAM / 2], [CORE.v[1] + BEAM / 2, SLAB.v[1] - RING],
].map(([c, d]) => rect(a, c, b, d)));
const grid = holes.reduce((sec, h) => sec.subtract(cs(h)), slabCs);
obParts.push(prismCs(grid, z(SLAB_SOFFIT), z(SLAB.top)));
// Stijlen op de gevellijn.
const POST = 0.9, POST_PITCH = 3.9;
for (const [a, b] of [[[BU0, BV0], [BU1, BV0]], [[BU1, BV0], [BU1, BV1]], [[BU1, BV1], [BU0, BV1]], [[BU0, BV1], [BU0, BV0]]]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
  const n = Math.round(L / POST_PITCH), step = (L - POST) / n;
  for (let k = 0; k < n; k++) {
    const s = k * step, p = [a[0] + d[0] * s, a[1] + d[1] * s], q = [p[0] + d[0] * POST, p[1] + d[1] * POST];
    const inward = [-d[1], d[0]];
    obParts.push(prism([p, q, [q[0] + inward[0] * POST, q[1] + inward[1] * POST], [p[0] + inward[0] * POST, p[1] + inward[1] * POST]], z(TERRACE) - 0.1, z(SLAB_SOFFIT) + 0.1));
  }
}
// Schoren in de hoekvakken: van de buitenhoek van de rand (onderkant balk) onder 45° naar het dakterras.
const BRACE_W = 0.9, RISE = SLAB_SOFFIT - TERRACE;
for (const [cu, cv, su, sv] of [[BU0, BV0, 1, 1], [BU1, BV0, -1, 1], [BU1, BV1, -1, -1], [BU0, BV1, 1, -1]]) {
  const dir = [su / Math.SQRT2, sv / Math.SQRT2], nrm = [-dir[1] * BRACE_W / 2, dir[0] * BRACE_W / 2];
  const P = (t, h) => [[cu + dir[0] * t + nrm[0], cv + dir[1] * t + nrm[1], h], [cu + dir[0] * t - nrm[0], cv + dir[1] * t - nrm[1], h]];
  // Onderkant van de buitenhoek (onderkant balk) onder 45° naar binnen tot het dakterras; 1,2 m dik.
  obParts.push(Manifold.hull([...P(0, z(SLAB_SOFFIT) + 0.1), ...P(1.7, z(SLAB_SOFFIT) + 0.1), ...P(0, z(SLAB_SOFFIT)), ...P(RISE, z(TERRACE) - 0.1), ...P(RISE + 1.7, z(TERRACE) - 0.1)]));
}
const obMass = union(obParts);

// ---------- Gevelreliëf ----------
// Nissen per gevelzijde: n gelijke vakken met penanten van PIER (ook op de hoeken), per rij [onder, boven] een
// opening van de gegeven diepte met een kop onder 45°. Alleen waar de gevel vrij ligt met ≥ 1 m materiaal erachter
// (straal vanuit 3 m buiten de gevel, zoals in generate-lighthouse-eindhoven.mjs).
function facadeNiches(mass, edges, rows, { bays, pitch, pier = PIER, depth = DEPTH }) {
  const cuts = [];
  for (const [a, b] of edges) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]]; // n naar buiten (gebouw links van a→b)
    const P = (s, dep, h) => [a[0] + d[0] * s - n[0] * dep, a[1] + d[1] * s - n[1] * dep, h];
    const cnt = bays ?? Math.max(1, Math.round((L - pier) / pitch));
    const w = (L - pier * (cnt + 1)) / cnt;
    if (w < 0.9) continue;
    for (let k = 0; k < cnt; k++) {
      const s0 = pier + k * (w + pier), s1 = s0 + w;
      for (const [lo, top] of rows) {
        const hi = top - depth;
        if (hi - lo < 0.9) continue;
        const free = [lo + 0.1, top - 0.1].every((h) => [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => {
          const from = P(s, -3, h), hits = mass.rayCast(from, P(s, 3, h));
          const at = (j) => hits[j] && Math.hypot(hits[j].position[0] - from[0], hits[j].position[1] - from[1]);
          return at(0) > 2.95 && at(0) < 3.05 && !(at(1) < 3 + depth + 1);
        }));
        if (!free) continue;
        cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, top + 0.2), P(s1, -0.2, top + 0.2), P(s0, depth, hi), P(s1, depth, hi)]));
      }
    }
  }
  return cuts;
}
// Gevelzijden linksom van een rechthoek, met het aantal traveeën.
const sides = (t) => {
  const [u0, u1] = t.u, [v0, v1] = t.v;
  return [
    { e: [[u0, v0], [u1, v0]], bays: BAYS_SHORT }, { e: [[u1, v0], [u1, v1]], bays: BAYS_LONG },
    { e: [[u1, v1], [u0, v1]], bays: BAYS_SHORT }, { e: [[u0, v1], [u0, v0]], bays: BAYS_LONG },
  ];
};
// Rijen per toren: begane grond (glas 0,6 m diep), 21 lagen (opening 2,68 m, band 1,1 m), installatielaag.
const towerRows = (t) => {
  const rows = [[0.3, LOBBY - 0.6]];
  for (let k = 0; k < FLOORS; k++) rows.push([LOBBY + k * STOREY + 0.55, LOBBY + (k + 1) * STOREY - 0.55]);
  rows.push([LOBBY + FLOORS * STOREY + 0.55, z(t.roof) - 1.0]);
  return rows;
};
function towerCuts(mass, t) {
  const rows = towerRows(t);
  return sides(t).flatMap(({ e, bays }) => [
    ...facadeNiches(mass, [e], rows.slice(0, 1), { bays, depth: 0.6 }),
    ...facadeNiches(mass, [e], rows.slice(1), { bays }),
  ]);
}
const ringEdges = (pts) => ccw(pts).map((p, i, r) => [p, r[(i + 1) % r.length]]);
const leeCuts = [
  ...towerCuts(leeMass, TOWERS.leeWest),
  ...towerCuts(leeMass, TOWERS.leeEast),
  // Entreebouw: glazen pui over de begane grond, dichte band tot de dakrand.
  ...facadeNiches(leeMass, ringEdges(LEE_LOBBY.poly), [[0.3, z(LEE_LOBBY.top) - 2.0]], { pitch: 3.7, depth: 0.5 }),
];
const sciCuts = [
  ...towerCuts(sciMass, TOWERS.science),
  ...facadeNiches(sciMass, ringEdges(SCI_LOW.poly), [[0.4, 2.6], [3.3, z(SCI_LOW.top) - 1.0]], { pitch: 3.7 }),
  ...facadeNiches(sciMass, ringEdges(SCI_LINK.poly), [[0.4, z(SCI_LINK.top) - 1.0]], { pitch: 3.7 }),
];
// Overbeekhuis: per laag een glasband tussen stijlen om de circa 1,95 m (nissen van 1,0 m breed, 2,2 m hoog,
// borstwering 1,0 m); onderbouw met een pui op de begane grond en een vensterband erboven.
const obRows = Array.from({ length: OB_FLOORS }, (_, k) => [z(OB_SOFFIT) + k * OB_STOREY + 0.5, z(OB_SOFFIT) + (k + 1) * OB_STOREY - 0.5]);
const obCuts = [
  ...facadeNiches(obMass, ringEdges(body), obRows, { pitch: 1.95, depth: 0.3 }),
  ...facadeNiches(obMass, ringEdges(OB_BASE_W.poly), [[0.3, 3.4], [4.4, z(OB_BASE_W.top) - 1.0]], { pitch: 3.8 }),
  ...facadeNiches(obMass, ringEdges(OB_BASE_E.poly), [[0.3, 2.8], [3.6, z(OB_BASE_E.top) - 1.0]], { pitch: 3.8 }),
  ...facadeNiches(obMass, ringEdges(OB_HALL.poly), [[0.3, z(OB_HALL.top) - 0.9]], { pitch: 3.8, depth: 0.5 }),
];

const leeTop = union([
  ...ROOF_BOXES.filter((b) => b.poly[0][0] > -40).map((b) => prism(b.poly, z(97.0) - 0.2, z(b.top))),
  prism(S_SCULPTURE.poly, z(101.55) - 0.1, z(S_SCULPTURE.top)),
]);
const sciTop = union(ROOF_BOXES.filter((b) => b.poly[0][0] < -40).map((b) => prism(b.poly, z(96.9) - 0.2, z(b.top))));

const toModel = (m) => m.translate([-UC, -VC, 0]);
const lee = toModel(union([leeMass.subtract(union(leeCuts)), leeTop]));
const sci = toModel(union([sciMass.subtract(union(sciCuts)), sciTop]));
const ob = toModel(obMass.subtract(union(obCuts)));
for (const [name, m] of [["Lee Towers", lee], ["Science Tower", sci], ["Overbeekhuis", ob]]) {
  const n = m.decompose().length;
  if (n !== 1) throw new Error(`${name}: ${n} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
}
console.log("nissen", leeCuts.length, sciCuts.length, obCuts.length, "origin-uv", UC.toFixed(3), VC.toFixed(3));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [
    ["building:europoint-lee-towers", lee],
    ["building:europoint-rotterdam-science-tower", sci],
    ["building:europoint-overbeekhuis", ob],
  ],
  catalog: {
    name: "Europoint (Marconitorens)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 46.809, // laagste PDOK-terrein op de groundSamplePoints (Galvanistraat ten noordwesten), NAP circa +3,25
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-28.5, -48.6], [-1.5, -47.6], [28.5, -32.6], [50.5, -2.6], [8.5, 39.4], [-31.5, 17.4], [-56.5, -2.6], [-71.5, -12.6], [-91.5, -55.6], [-71.5, 33.4], [68.5, -32.6], [88.5, -32.6], [110.5, -12.6], [83.5, 5.4]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000701896", "NL.IMBAG.Pand.0599100000649440", "NL.IMBAG.Pand.0599100000701700"],
    description:
      "Europoint aan het Marconiplein: drie torens van Skidmore, Owings & Merrill (Lee Towers West en Oost, sinds 2019 woningen, en de Rotterdam Science Tower), elk een schijf van 33,5 × 47,4–47,7 m tot NAP +97,0–97,1 m met een raster van 9 × 13 traveeën diepliggende ramen tussen penanten en borstweringsbanden (hoge begane grond, 21 lagen, dubbelhoge installatielaag met roosters) en installatieblokken op het dak tot +101,1, +101,55 (met de witte S tot +102,75) en +100,04 m; een entreebouw tussen de Lee Towers tot +10,8 m en lage delen aan de zuidkant van de Science Tower tot +9,16 en +7,6 m. Het Overbeekhuis (1966): elf lagen vliesgevel van +14,26 tot +49,46 m die aan een dakparasol op een kern hangen, een open daklaag met stijlen en hoekschoren onder een raster van balken tot +55,05 m, een installatieopbouw tot +63,65 m en een onderbouw tot +11,1 en +9,9 m. BAG-contouren, hoogtes uit de 3D BAG en het AHN-DSM. Oorsprong in de entreebouw van de Lee Towers, X-as langs de korte gevels (5,86° op RD-oost). Verdiepingshoogtes, het gevelraster, de kern en de onderkant van het Overbeekhuis, de balken en stijlen van de parasol zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      towerFootprintM: [33.5, 47.4],
      towerRoofNapM: { leeWest: TOWERS.leeWest.roof, leeEast: TOWERS.leeEast.roof, scienceTower: TOWERS.science.roof },
      roofBoxesNapM: [101.1, 98.65, 101.55, 102.75, 100.04, 98.1],
      towerStoreys: 22,
      towerBays: [BAYS_SHORT, BAYS_LONG],
      towerStoreyM: STOREY,
      lobbyNapM: LEE_LOBBY.top,
      scienceLowNapM: [SCI_LOW.top, SCI_LINK.top],
      overbeekhuis: { soffitNapM: OB_SOFFIT, terraceNapM: TERRACE, parasolNapM: SLAB.top, plantNapM: PLANT_TOP, plantEastNapM: PLANT_EAST.top, floors: OB_FLOORS, baseNapM: [OB_BASE_W.top, OB_BASE_E.top], hallNapM: OB_HALL.top },
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
      estimatedOverbeekCoreAndSoffit: true,
    },
    sources: [
      "PDOK BAG panden 0599100000701896 (bouwjaar 1974, Lee Towers), 0599100000649440 (bouwjaar 1979, Rotterdam Science Tower), 0599100000701700 (bouwjaar 1966, Overbeekhuis); actuele orthoHR; AHN DSM/DTM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000701896",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000649440",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000701700",
      "https://nl.wikipedia.org/wiki/Marconiplein",
      "https://www.architectureguide.nl/project/list_projects_of_city/cit_id/242/prj_id/1855",
      "https://structurae.net/structures/europoint-i",
      "https://commons.wikimedia.org/wiki/File:Europoint_-_Rotterdam_-_2010.jpg",
      "https://commons.wikimedia.org/wiki/File:Europoint_Rotterdam_2018_1.jpg",
      "https://commons.wikimedia.org/wiki/File:Europoint_Rotterdam_2018_2.jpg",
      "https://commons.wikimedia.org/wiki/File:Europoint_Rotterdam_2019_2.jpg",
      "https://commons.wikimedia.org/wiki/File:Europoint.jpg",
      "https://commons.wikimedia.org/wiki/File:Overbeekhuis_in_2013.jpg",
      "https://commons.wikimedia.org/wiki/File:Overbeekhuis2.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam,_Marconiplein_foto3_2014-03-09_10.56.jpg",
    ],
  },
});

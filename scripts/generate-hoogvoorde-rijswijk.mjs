// Hoogvoorde (Bogaardplein 15, Rijswijk, 1970-1971, Jan Lucas van Lucas & Niemeijer; renovatie 2003,
// Alynia-Lerou): kantoortoren van het voormalige ministerie van CRM/VWS, sinds de renovatie stadhuis van
// Rijswijk. Een rechthoekige toren van 53,7 × 24,5 m met per laag een doorlopende witte vloerrand, lichtblauwe
// pilasters op een raster van zeven bij drie traveeën en bovenin een glazen kroon van tweeënhalve laag
// waarvan de gevel naar buiten helt, met uitlopende stijlen. Op het dak een groen bekleed installatiehuis met
// een hoger middendeel en twee rijen koelers. Aan de voet een begane grond met vier ronde uitbouwen
// ("Stadhuis Rijswijk"), daarop aan de noordwestelijke helft een eerste verdieping met een fascia
// ("Hoogvoorde") die als luifel over de twee ingangen met hun ronde trappenhuizen doorloopt.
// Contour van de begane grond uit de BAG, toren en dakopbouw uit het AHN-DSM en de 3D BAG (AHN4 en AHN5
// tonen dezelfde vorm), gevelindeling uit foto's.
import { CrossSection, Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "hoogvoorde-rijswijk";
// Gebouwstelsel: x langs de lange gevels naar het zuidoosten (-59,7° op RD-oost, BAG- en DSM-randen
// evenwijdig binnen 0,3°), y haaks erop naar het noordoosten. Oorsprong in het hart van de toren.
const ORIGIN = [81616.52, 450229.19];
const ANGLE = -59.7;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.65; // NAP, maaiveld rondom (AHN-DTM 0,64–0,73 op 1,5 m buiten de contour; 3D BAG 0,67)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM en 3D BAG (AHN5) ----------
const PLINTH = 5.43; // begane grond met de ronde uitbouwen (3D BAG 5,42–5,49)
const ANNEX = 8.85; // eerste verdieping en luifel aan de noordwestelijke helft (3D BAG 8,79–8,90, DSM 8–9)
const CROWN_BASE = 66.31; // bovenkant van de vloerrand onder de kroon (3D BAG 66,12–66,43)
const ROOF = 74.25; // dakvlak binnen de kroon (3D BAG 74,22–74,28)
const RIM = 75.4; // bovenkant van de kroon (3D BAG 75,40–75,41, DSM 75–76)
const PLANT = 77.1; // twee rijen koelers (3D BAG 77,18, DSM 77,1)
const PLANT_SMALL = 77.0; // kast aan de zuidoostkant (3D BAG 76,7–77,1)
const HOUSE_BASE = 78.5; // grijze onderbouw van het installatiehuis (DSM 78–79, 3D BAG 77,5–78,6)
const HOUSE_SIDE = 81.6; // groene schouders van het installatiehuis (3D BAG 81,57–81,65)
const HOUSE_TOP = 83.15; // hoog middendeel (3D BAG 83,17–83,19, DSM 83,1)

// ---------- Plattegronden in (x, y) ----------
const X0 = 26.83, Y0 = 12.22; // toren tot de vloerranden (DSM-randen u -26,75…26,9 en v -10,25…14,2)
const TOWER = rect(-X0, -Y0, X0, Y0);
// BAG-contour van de begane grond (465 punten), vereenvoudigd tot 0,12 m; een knik van 0,3 m aan de
// noordwestkant is rechtgetrokken. De vier ronde uitbouwen en de twee halfronde trappenhuizen bij de ingangen.
const CONTOUR = [[-28.75, 11.39], [-28.75, -8.47], [-28.28, -10.58], [-27.38, -12.8], [-25.78, -15.0], [-23.51, -17.03], [-21.3, -18.17], [-19.91, -18.48], [-18.22, -18.56], [-16.53, -18.42], [-14.56, -17.99], [-13.19, -17.39], [-11.98, -16.6], [-8.38, -13.07], [-5.92, -11.56], [-4.21, -11.0], [-2.06, -10.73], [-1.93, -11.55], [-1.47, -12.24], [-0.76, -12.68], [0.07, -12.79], [0.75, -12.6], [1.36, -12.13], [1.77, -11.4], [1.85, -10.7], [4.6, -11.06], [6.82, -12.0], [8.54, -13.27], [11.27, -16.12], [13.83, -17.7], [16.71, -18.43], [19.86, -18.23], [21.47, -17.79], [23.21, -17.0], [24.68, -15.98], [25.95, -14.72], [27.09, -13.05], [27.67, -11.78], [28.14, -10.09], [28.31, -8.25], [28.01, -5.68], [25.4, 3.51], [25.34, 11.77], [22.58, 11.75], [20.48, 13.45], [17.82, 14.73], [14.51, 15.43], [12.13, 15.37], [10.44, 14.66], [6.53, 12.32], [5.13, 11.86], [3.31, 11.58], [1.84, 11.6], [1.69, 12.47], [1.19, 13.17], [0.39, 13.61], [-0.47, 13.66], [-1.08, 13.45], [-1.69, 12.95], [-2.04, 12.31], [-2.13, 11.59], [-3.18, 11.54], [-4.91, 11.71], [-6.91, 12.31], [-10.35, 14.4], [-11.98, 15.11], [-13.72, 15.51], [-15.69, 15.58], [-17.78, 15.19], [-19.74, 14.36], [-21.39, 13.18], [-22.95, 11.41]];
const STAIRS = [[0, -10.7], [-0.2, 11.6]]; // middelpunten van de halfronde trappenhuizen (straal 2,1 m)
// Eerste verdieping: tot 2,1–2,3 m buiten de toren, van de noordwestgevel tot halverwege de vijfde travee
// (DSM 8–9 tot v = 16,5 en tot u = 7,5; aan de zuidwestkant bedekt de toren het DSM, daar de 3D BAG).
const ANNEX_POLY = rect(-28.75, -14.5, 7.4, 14.3);
const FASCIA = 1.5; // fascia "Hoogvoorde" onder de luifel
const ROOF_INNER = rect(-25.0, -9.5, 25.0, 11.0); // dakvlak binnen de kroonrand (DSM: rand 1,2–2,7 m)
const COOLERS = [rect(-21.5, -4.7, -18.9, 5.2), rect(-17.3, -4.7, -14.6, 5.2)];
const SMALL_PLANT = rect(12.0, 5.7, 15.3, 7.6);
const HOUSE_X = [-13.6, 14.2], HOUSE_TOP_X = [-5.7, 8.4];

const inset = (r, d) => [[r[0][0] + d, r[0][1] + d], [r[1][0] - d, r[1][1] + d], [r[2][0] - d, r[2][1] - d], [r[3][0] + d, r[3][1] - d]];
const at = (poly, h) => poly.map(([x, y]) => [x, y, h]);

// ---------- Massa ----------
const plinth = prism(CONTOUR, BASE, z(PLINTH));
// Toren: vloerranden tot de kroon; waar hij buiten de begane grond steekt (zuidoostkop 1,4 m, ingangen)
// een kraag onder 45°.
const tower = union([
  prism(TOWER, z(PLINTH) - 0.1, z(CROWN_BASE)),
  Manifold.hull([...at(TOWER, z(PLINTH) - 0.1), ...at(inset(TOWER, 2.4), z(PLINTH) - 2.5)]),
]);
// Kroon: gevel helt over 9,1 m hoogte 0,9 m naar buiten, van achter de vloerrand tot de dakrand.
const crown = Manifold.hull([...at(inset(TOWER, 0.9), z(CROWN_BASE) - 0.01), ...at(TOWER, z(RIM))]);
// Eerste verdieping: op de begane grond waar die eronder ligt, als luifel met fascia en kraag onder 45°
// boven de ingangen en de kop.
const annex = union([
  prism(CONTOUR, BASE, z(ANNEX)).intersect(prism(ANNEX_POLY, BASE - 1, 100)),
  prism(ANNEX_POLY, z(ANNEX) - FASCIA, z(ANNEX)),
  Manifold.hull([...at(ANNEX_POLY, z(ANNEX) - FASCIA), ...at(inset(ANNEX_POLY, 4.0), z(ANNEX) - FASCIA - 4.0)]),
]);
// Installatiehuis: grijze onderbouw met een schuin dak naar de noordoostrand, groene bovenbouw met een steile
// zuidwestflank (3D BAG 65°) en een hoger middendeel.
const house = union([
  Manifold.hull([...at(rect(HOUSE_X[0], -5.4, HOUSE_X[1], 3.9), z(ROOF) - 0.1), ...at(rect(HOUSE_X[0], -5.4, HOUSE_X[1], 3.9), z(HOUSE_BASE)),
    [HOUSE_X[0], 6.0, z(ROOF) - 0.1], [HOUSE_X[1], 6.0, z(ROOF) - 0.1], [HOUSE_X[0], 6.0, z(77.4)], [HOUSE_X[1], 6.0, z(77.4)]]),
  Manifold.hull([...at(rect(-13.4, -5.4, 14.0, 3.9), z(HOUSE_BASE) - 0.1), ...at(rect(-13.4, -4.3, 14.0, 3.9), z(HOUSE_SIDE))]),
  Manifold.hull([...at(rect(HOUSE_TOP_X[0], -5.4, HOUSE_TOP_X[1], 3.9), z(HOUSE_BASE) - 0.1), ...at(rect(HOUSE_TOP_X[0], -4.1, HOUSE_TOP_X[1], 3.9), z(HOUSE_TOP))]),
]);
const roofStuff = union([...COOLERS.map((c) => prism(c, z(ROOF) - 0.1, z(PLANT))), prism(SMALL_PLANT, z(ROOF) - 0.1, z(PLANT_SMALL)), house]);

const body = union([plinth, tower, crown, annex]).subtract(prism(ROOF_INNER, z(ROOF), z(90)));

// ---------- Gevelreliëf ----------
// Lagen: vloerranden van 0,9 m met de bovenkant op +8,85 + 3,38 k (k = 0…17, de zeventiende is de rand onder
// de kroon op +66,31); daartussen per laag een glasband. Pilasters van 0,9 m op het raster van de kroon:
// zeven traveeën van 7,41 m op de lange en drie van 7,55 m op de korte gevels.
const STOREY = (CROWN_BASE - ANNEX) / 17;
const BAND = 0.9;
const TOPS = Array.from({ length: 18 }, (_, k) => z(ANNEX) + STOREY * k);
const FLOORS = [[z(PLINTH) + 0.1, TOPS[0]], ...TOPS.slice(1).map((t, k) => [TOPS[k] + 0.05, t])]; // [onderkant glas, bovenkant vloerrand]
const SHALLOW = 0.45, DEEP = 0.9;
const cuts = [];
// Snede in de gevel a→b (buitennormaal rechts van de looprichting): van s0 tot s1, diepte d, glas van lo tot
// hi aan de gevel met een plafond onder 45°.
const edgeFrame = (a, b) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, P: (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h] };
};
const recess = (P, s0, s1, depth, lo, hi) => Manifold.hull([
  P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo),
  P(s0, depth, hi - depth), P(s1, depth, hi - depth), P(s0, -0.2, hi + 0.2), P(s1, -0.2, hi + 0.2),
]);
const exposed = (P, s, h) => {
  const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
  const dist = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return dist > 2.95 && dist < 3.05;
};
// Aaneengesloten stukken van de rand waar de gevel tussen lo en hi buitengevel is, per halve meter.
function runs(P, L, lo, hi, s0 = 0.25, s1 = L - 0.25) {
  const out = [];
  let start = null;
  for (let s = s0; s <= s1 + 1e-6; s += 0.5) {
    const ok = exposed(P, s, lo + 0.05) && exposed(P, s, hi - 0.05);
    if (ok && start === null) start = s;
    if (!ok && start !== null) { out.push([start, s - 0.5]); start = null; }
  }
  if (start !== null) out.push([start, s1]);
  return out;
}
const towerEdges = TOWER.map((p, i) => [p, TOWER[(i + 1) % 4], i % 2 === 0 ? 7 : 3]);
for (const [a, b, bays] of towerEdges) {
  const { L, P } = edgeFrame(a, b);
  const pitch = (L - 2 * DEEP) / bays;
  const grid = Array.from({ length: bays + 1 }, (_, i) => DEEP + i * pitch);
  for (const [lo, top] of FLOORS) {
    const hi = top - BAND;
    // Pilastervlak: 0,45 m achter de vloerrand, over de hele lengte waar de gevel vrij is.
    for (let [r0, r1] of runs(P, L, lo, hi)) {
      if (r0 <= 0.25 + 1e-6) r0 = -0.3;
      if (r1 >= L - 0.25 - 1e-6) r1 = L + 0.3;
      if (r1 - r0 >= 0.9) cuts.push(recess(P, r0, r1, SHALLOW, lo, hi));
    }
    // Glas: 0,9 m achter de vloerrand tussen de pilasters.
    for (let i = 0; i < bays; i++) {
      const s0 = grid[i] + 0.45, s1 = grid[i + 1] - 0.45;
      if ([s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => exposed(P, s, lo + 0.05) && exposed(P, s, hi - 0.05))) cuts.push(recess(P, s0, s1, DEEP, lo, hi));
    }
  }
  // Kroon: per travee een glasvlak 0,35 m achter de hellende gevel, tussen stijlen die van 0,9 m onderaan
  // uitlopen tot 2,0 m bovenaan; een dakrand van 1,0 m blijft staan.
  const lean = (h) => (0.9 * (z(RIM) - h)) / (z(RIM) - z(CROWN_BASE));
  const c0 = z(CROWN_BASE) + 0.1, c1 = z(73.9);
  for (let i = 0; i < bays; i++) {
    const s0 = grid[i] + 0.45, s1 = grid[i + 1] - 0.45;
    cuts.push(Manifold.hull([
      P(s0, -0.3, c0), P(s1, -0.3, c0), P(s0, lean(c0) + 0.35, c0), P(s1, lean(c0) + 0.35, c0),
      P(s0 + 0.55, lean(c1) + 0.35, c1), P(s1 - 0.55, lean(c1) + 0.35, c1),
      P(s0 + 0.55, -0.3, c1 + lean(c1) + 0.35 + 0.3), P(s1 - 0.55, -0.3, c1 + lean(c1) + 0.35 + 0.3),
    ]));
  }
}
// Eerste verdieping: glasband van 0,5 m diep onder de fascia, waar hij op de begane grond staat.
for (const [a, b] of ANNEX_POLY.map((p, i) => [p, ANNEX_POLY[(i + 1) % 4]])) {
  const { L, P } = edgeFrame(a, b);
  const lo = z(PLINTH) + 0.1, hi = z(ANNEX) - FASCIA;
  for (const [r0, r1] of runs(P, L, lo, hi)) if (r1 - r0 >= 0.9) cuts.push(recess(P, r0, r1, 0.5, lo, hi));
}
// Begane grond: glas 0,35 m achter de ronde uitbouwen onder een fascia van 1,2 m ("Stadhuis Rijswijk"), met
// een plafond in drie stappen van 0,12 m; niet onder de toren en niet in de trappenhuizen.
const ground = new CrossSection([CONTOUR]);
const outer = ground.offset(1.0, "Miter");
const keep = union([prism(inset(TOWER, -0.3), BASE - 2, 100), ...STAIRS.map((c) => Manifold.cylinder(200, 2.4, 2.4, 48).translate([c[0], c[1], BASE - 2]))]);
const GF_TOP = z(PLINTH) - 1.2;
const slice = (depth, h0, h1) => Manifold.extrude(outer.subtract(ground.offset(-depth, "Miter")), h1 - h0).translate([0, 0, h0]);
cuts.push(union([slice(0.35, BASE - 0.1, GF_TOP - 0.24), slice(0.35 * 2 / 3, GF_TOP - 0.25, GF_TOP - 0.12), slice(0.35 / 3, GF_TOP - 0.13, GF_TOP)]).subtract(keep));

const building = union([body.subtract(union(cuts)), roofStuff]);
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Hoogvoorde: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Hoogvoorde", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "sneden", cuts.length, "laag", STOREY.toFixed(3));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [[`building:${slug}`, building]],
  catalog: {
    name: "Hoogvoorde",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.05, // NAP-maaiveld + 43,4 (Rijswijk, ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0603100000007372"],
    description:
      "Hoogvoorde aan het Bogaardplein (stadhuis van Rijswijk): toren van 53,7 × 24,5 m met per laag een witte vloerrand (17 lagen van 3,38 m boven de eerste verdieping), pilasters op een raster van zeven bij drie traveeën en een glazen kroon van +66,3 tot +75,4 m NAP die 0,9 m naar buiten helt, met uitlopende stijlen; dakvlak op +74,25 m, koelers tot +77,1 m en een installatiehuis met schouders op +81,6 m en een middendeel op +83,15 m. Aan de voet de begane grond op de BAG-contour met vier ronde uitbouwen tot +5,43 m en aan de noordwestelijke helft een eerste verdieping met fascia tot +8,85 m die als luifel over de twee ingangen doorloopt. Hoogtes uit het AHN-DSM en de 3D BAG (AHN4 en AHN5 gelijk). Oorsprong in het hart van de toren, X-as langs de lange gevels naar het zuidoosten (-59,7° op RD-oost). Verdiepingshoogte, pilasterbreedte, glasdiepte, de helling van de kroon en de zuidwestrand van de eerste verdieping (achter de toren niet in het DSM) zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      plinthNapM: PLINTH,
      firstFloorNapM: ANNEX,
      crownBaseNapM: CROWN_BASE,
      roofNapM: ROOF,
      rimNapM: RIM,
      coolersNapM: PLANT,
      plantHouseNapM: [HOUSE_BASE, HOUSE_SIDE, HOUSE_TOP],
      towerPlanM: [+(2 * X0).toFixed(2), +(2 * Y0).toFixed(2)],
      storeys: { tower: 17, crown: 2.5, base: 2 },
      storeyHeightM: +STOREY.toFixed(3),
      bays: [7, 3],
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0603100000007372 (bouwjaar 1970), actuele orthoHR, AHN-DSM en -DTM 0,5 m (AHN4), 3D BAG LoD2.2 (AHN5, 2023)",
      "https://nl.wikipedia.org/wiki/Hoogvoorde_(gebouw)",
      "https://commons.wikimedia.org/wiki/File:Nieuwe_gemeentehuis.jpg",
      "https://commons.wikimedia.org/wiki/File:Hoogvoorde_en_De_Generaal_Rijswijk.jpg",
    ],
  },
});

// De Pyth (Pythagoraslaan 101, Rijnsweerd, Utrecht, 1995): kantoortoren van 17 lagen met een laagbouw in
// de vorm van een kwart cirkelschijf die in een vijver steekt. Het hele ontwerp draait om één middelpunt:
// de zuidoosthoek van de toren is een kwart cirkel (r 10,55 m) om het hart van de waaier (r 34,27 m).
// De toren bestaat uit een wit gebogen deel met horizontale raambanden tot NAP +60,9 m, een lager
// noordblok tot +53,9 m (de oostgevel is een dichte witte schijf), een donkerglazen
// dakopbouw tot +66,75 m en aan de oostkant een donkerglazen cilinder tot +63,8 m. De waaier heeft een
// zaagtanddak van twee glazen ringen die naar buiten oplopen (14,8°), met lichtstroken die naar buiten
// kijken, een schuine glazen rand en een witte daklijst boven een hoge glazen pui. Aan de zuidwestkant
// ligt een luifel op NAP +11,4 m boven het parkeerdek (buiten het BAG-pand, eigen node).
// Contour uit de BAG, hoogtes uit het AHN-DSM (0,5 m) en de 3D BAG (LoD2.2, AHN5 2023), gevelindeling
// en lagen uit de foto van de oostkant.
import { CrossSection, Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "pythagoraslaan-101";
// Gebouwstelsel: u langs de lange gevels naar het oosten (-9,45° op RD-oost; BAG-randen van toren en
// waaier evenwijdig binnen 0,2°), v naar het noorden. Oorsprong in het middelpunt van de waaier
// (cirkelfit op 36 BAG-punten, afwijking < 2 cm), tevens middelpunt van de gebogen torenhoek.
const ORIGIN = [138739.04, 456081.78];
const ANGLE = -9.45;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 1.05; // NAP, maaiveld rondom (AHN-DTM p10 1,05; 3D BAG 1,01)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM en 3D BAG ----------
const SOUTH_ROOF = 60.9; // gebogen witte deel (DSM 60,8–61,0; 3D BAG 60,84–61,02)
const NORTH_ROOF = 53.9; // noordblok (DSM 53,9; 3D BAG 53,88; binnenstrook 54,35 meegenomen)
const NORTH_EDGE = 55.06; // opstand langs de witte oostschijf (3D BAG 55,06)
const NORTH_BOX = 56.3; // kastje aan de noordrand (3D BAG 55,9–56,6)
const CORE_ROOF = 66.75; // donkerglazen dakopbouw (DSM 66,7–66,8; 3D BAG 66,75–66,78)
const CORE_BOX = 67.65; // vier dakkasten (DSM 67,6–67,7)
const CYLINDER = 63.8; // donkerglazen cilinder oostzijde (3D BAG 63,75–63,82)
const LOW = 11.4; // binnenring waaier, ronde trappenhuizen en luifel (DSM 11,3–11,4)

// ---------- Plattegronden in (u, v), uit de BAG-contour ----------
const arc = (c, r, a0, a1, step = 3) => {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / step));
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  });
};
const circle = (c, r, n = 32) => arc(c, r, 0, 360 - 360 / n, 360 / n);
const R_TOWER = 10.55; // gebogen zuidoosthoek (DSM-rand 10,3–10,8)
const SOUTH_END_V = 1.67; // noordrand van het gebogen deel (BAG)
const endAngle = (Math.asin(SOUTH_END_V / R_TOWER) * 180) / Math.PI;
const SOUTH = [[-13.33, -2.4], [-13.33, -R_TOWER], [0, -R_TOWER], ...arc([0, 0], R_TOWER, -90, endAngle).slice(1), [-10.8, SOUTH_END_V], [-10.8, -2.4]];
// Noordblok met een gebogen noordwesthoek (cirkelfit op 24 BAG-punten: middelpunt (-5,11; 2,85), r 11,23).
const NORTH = [[-16.87, 1.65], [7.04, 1.65], [7.04, 13.9], ...arc([-5.11, 2.85], 11.23, 96.8, 170.6), [-16.4, 3.42], [-16.87, 3.42]];
// Glazen voeg tussen noordblok en gebogen deel aan de westkant: gat in het DSM, randen op 53,5–55,9.
const SLOT = rect(-12.7, -2.4, -10.8, 1.67);
const CORE = [[-10.8, -5.6], [1.3, -5.6], [2.4, -2.6], [2.4, 8.85], [-8.0, 8.85], [-9.6, 7.2], [-10.8, 5.0]];
const EAST_CYL = circle([5.15, 3.75], 1.9);
const EAST_LINK = rect(2.4, 1.85, 5.15, 5.65);
// Ronde trappenhuizen tot de luifel (BAG-contour, 3D BAG-dakvlak op 11,4 m).
const WEST_ROUND = circle([-14.85, -0.6], 1.95);
const WEST_ROUND_LINK = rect(-15.2, 1.0, -13.2, 1.7);
const SOUTH_ROUND = circle([-7.62, -12.55], 1.97);
const SOUTH_ROUND_LINK = rect(-9.61, -12.55, -5.64, -10.5);
const CORE_BOXES = [rect(-2.5, 6.5, -1.0, 8.0), rect(-8.75, 4.25, -7.25, 5.75), rect(0.0, 4.0, 1.5, 5.5), rect(-5.0, 2.0, -3.0, 3.5)];

const body = union([
  prism(SOUTH, BASE, z(SOUTH_ROOF)),
  prism(NORTH, BASE, z(NORTH_ROOF)),
  prism(SLOT, BASE, z(NORTH_ROOF)),
  prism(CORE, BASE, z(CORE_ROOF)),
  prism(EAST_CYL, BASE, z(CYLINDER)),
  prism(EAST_LINK, BASE, z(CYLINDER)),
  prism(WEST_ROUND, BASE, z(LOW)),
  prism(WEST_ROUND_LINK, BASE, z(LOW)),
  prism(SOUTH_ROUND, BASE, z(LOW)),
  prism(SOUTH_ROUND_LINK, BASE, z(LOW)),
]);
const towerMass = union([
  body,
  prism(rect(6.1, 5.82, 7.04, 13.9), z(NORTH_ROOF) - 0.1, z(NORTH_EDGE)),
  prism(rect(0.6, 11.4, 3.1, 13.9), z(NORTH_ROOF) - 0.1, z(NORTH_BOX)),
  ...CORE_BOXES.map((b) => prism(b, z(CORE_ROOF) - 0.1, z(CORE_BOX))),
]);

// ---------- Gevelreliëf toren ----------
// 17 lagen van 3,5 m vanaf NAP +1,4 (dak 60,9 = 1,4 + 17 × 3,5; noordblok 53,9 na 15 lagen). Per laag een
// raamband van 1,7 m (borstwering 0,8 m) als doorlopende nis van 0,35 m met een plafond dat in drie
// treden van 0,12 m onder 45° terugloopt, om de hele doorsnede van die laag behalve de dichte witte
// oostschijf, de eindpenant van het gebogen deel, de glazen cilinder en de glazen voeg. Onder de luifel
// en de waaier (lagen 0–2) alleen op het noordblok.
const STOREY = 3.5, FLOOR0 = 1.4, DEPTH = 0.35;
const csOf = (polys) => polys.map((p) => new CrossSection([ccw(p)])).reduce((acc, cs) => acc.add(cs));
const BLANK = csOf([rect(6.0, -0.9, 40, 13.3), rect(2.4, 1.0, 40, 6.2), rect(-13.5, -2.6, -10.0, 2.0)]);
const cuts = [];
for (let k = 0; k < 17; k++) {
  const f = FLOOR0 + STOREY * k;
  const lo = z(f + 0.8), hi = z(f + 2.5) - 0.24;
  let allowed = k <= 2 ? csOf([rect(-40, 2.0, 40, 40)]) : k >= 15 ? csOf([rect(-40, -40, 40, 1.0)]) : csOf([rect(-40, -40, 40, 40)]);
  allowed = allowed.subtract(BLANK);
  const section = body.slice((lo + hi) / 2);
  const outer = section.offset(1.0, "Miter");
  const band = (depth, h0, h1) => Manifold.extrude(outer.subtract(section.offset(-depth, "Miter")).intersect(allowed), h1 - h0).translate([0, 0, h0]);
  cuts.push(band(DEPTH, lo, hi), band((DEPTH * 2) / 3, hi - 0.01, hi + 0.12), band(DEPTH / 3, hi + 0.11, hi + 0.24));
}
const tower = towerMass.subtract(union(cuts));

// ---------- Waaier ----------
// Kwart cirkelschijf r 34,27 m, rechte randen langs u = -0,37 en v = 0,44 met aan beide kanten een uitbouw
// van 2,2 m tussen r 17,6 en 29,6 (BAG). Dakprofiel per straal (DSM-mediaan over -92…-18°, 0,5 m-stappen):
// binnenring 11,4 tot r 12,6; ring 1 van 13,06 (r 13) oplopend met 0,262 per m tot r 18,7; lichtstrook
// naar buiten, ring 2 van 12,74 (r 19) oplopend met 0,265 per m tot 15,6 op r 29,8; lichtstrook naar
// buiten tot 12,5; schuine glazen rand met 0,26 per m aflopend tot 11,33 op de gevel (3D BAG 11,3–11,8;
// het DSM zakt daar door het glas heen).
const R_FAN = 34.27, R1 = 12.6, R2 = 18.7, R3 = 29.8;
const ring1 = (r) => 13.06 + 0.262 * (r - 13.0);
const ring2 = (r) => 12.74 + 0.265 * (r - 19.0);
const rim = (r) => 12.44 - 0.26 * (r - 30.0);
const EAVE = rim(R_FAN);
const profile = [[0, BASE], [R_FAN, BASE], [R_FAN, z(EAVE)], [R3, z(rim(R3))], [R3, z(ring2(R3))], [R2, z(ring2(R2))], [R2, z(ring1(R2))], [R1, z(ring1(R1))], [R1, z(LOW)], [0, z(LOW)]];
const roofSolid = Manifold.revolve([ccw(profile)], 360);
const FAN = [[-0.37, -R_TOWER], [-0.37, -17.59], [-2.58, -17.59], [-2.58, -29.58], [-0.37, -29.58], ...arc([0, 0], R_FAN + 0.3, -90.62, 0.74), [29.57, 0.44], [29.57, 2.62], [17.57, 2.62], [17.57, 0.42], [12.9, 0.42], [12.9, 0.22], [9.0, 0.22], [0, 0]];
let fan = roofSolid.intersect(prism(FAN, BASE, 30)).subtract(prism(SOUTH, BASE - 1, 100));
// Lichtstroken in de twee opstanden (glas als nis van 0,35 m, plafond onder 45° in treden) en de hoge
// glazen pui onder de witte daklijst (nis van 0,4 m), tussen witte eindpenanten van ~2 m.
const annulus = (r0, r1, h0, h1) => Manifold.revolve([ccw([[r0, h0], [r1, h0], [r1, h1], [r0, h1]])], 360);
const fanCuts = [];
const clerestory = (r, nap0, nap1) => {
  const lo = z(nap0), hi = z(nap1);
  fanCuts.push(annulus(r - DEPTH, r + 0.6, lo, hi), annulus(r - (DEPTH * 2) / 3, r + 0.6, hi - 0.01, hi + 0.12), annulus(r - DEPTH / 3, r + 0.6, hi + 0.11, hi + 0.24));
};
clerestory(R3, 12.6, 13.85); // buitenste lichtstrook 12,5–15,6: glas 12,6–14,1, witte rand erboven
clerestory(R2, 12.85, 14.0); // binnenste lichtstrook 12,7–14,5
const PUI_TOP = EAVE - 1.15 - 0.4; // witte daklijst 1,15 m (foto), nisplafond eronder
const puiMask = prism([[0, 0], ...arc([0, 0], 40, -86.5, -3.5)], BASE - 1, 40);
fanCuts.push(
  annulus(R_FAN - 0.4, R_FAN + 1, z(1.6), z(PUI_TOP)).intersect(puiMask),
  annulus(R_FAN - 0.27, R_FAN + 1, z(PUI_TOP) - 0.01, z(PUI_TOP) + 0.14).intersect(puiMask),
  annulus(R_FAN - 0.13, R_FAN + 1, z(PUI_TOP) + 0.13, z(PUI_TOP) + 0.28).intersect(puiMask),
);
fan = fan.subtract(union(fanCuts));

// ---------- Luifel boven het parkeerdek (buiten het BAG-pand) ----------
// Bruin dak op +11,4 m ten westen en zuiden van de toren (DSM 11,3–11,4; luchtfoto), tot de waaier. Dak
// 1,5 m dik; eronder een dichte onderbouw die 1,5 m (noord, west) en 3,0 m (zuid, langs de rij
// BGT-pijlers) terugligt met een kraag onder 45° of steiler. Wat er werkelijk onder het dak staat (open
// of glas) is niet bekend; dicht omdat een vrije plaat op 1:1000 niet te printen is.
const CANOPY = [[-22.5, -0.6], [-0.37, -0.6], [-0.37, -17.5], [-20.5, -17.5], [-22.5, -15.5]];
const CANOPY_IN = rect(-21.0, -14.5, -0.37, -2.1);
const SLAB_BOTTOM = z(LOW) - 1.5;
const canopy = union([
  prism(CANOPY, SLAB_BOTTOM, z(LOW)),
  Manifold.hull([...CANOPY.map(([u, v]) => [u, v, SLAB_BOTTOM]), ...CANOPY_IN.map(([u, v]) => [u, v, SLAB_BOTTOM - 3.1])]),
  prism(CANOPY_IN, BASE, SLAB_BOTTOM - 3.05),
]).subtract(prism(SOUTH, BASE - 1, 100)).subtract(body);

const nodes = [
  ["building:pythagoraslaan-101-toren", tower],
  ["building:pythagoraslaan-101-waaier", fan],
  ["building:pythagoraslaan-101-luifel", canopy],
];
for (const [name, m] of nodes) {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "volume", m.volume().toFixed(0));
}

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "De Pyth (Pythagoraslaan 101)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.4, // NAP 1,05 + NLGEO2018-geoïde 43,35 ter plekke (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000130837"],
    description:
      "Kantoortoren De Pyth aan de Pythagoraslaan in Rijnsweerd: op de BAG-contour een wit gebogen deel (kwart cirkel r 10,55 m om het middelpunt van de waaier) tot NAP +60,9 m, een noordblok met gebogen noordwesthoek tot +53,9 m, een donkerglazen dakopbouw tot +66,75 m met vier dakkasten, een glazen cilinder tot +63,8 m en een glazen voeg aan de westkant; 17 lagen van 3,5 m met een doorlopende raamband per laag, behalve op de dichte witte oostschijf. De laagbouw is een kwart cirkelschijf van r 34,27 m met een zaagtanddak van twee glazen ringen (14,8°, lichtstroken naar buiten), een schuine glazen rand, een witte daklijst op +11,3 m en een hoge glazen pui. Aan de zuidwestkant een luifel op +11,4 m boven het parkeerdek (buiten het BAG-pand, eigen node, met dichte onderbouw). Hoogtes uit het AHN-DSM en de 3D BAG. Oorsprong in het middelpunt van de waaier, X-as langs de lange gevels (-9,45° op RD-oost). Verdiepingsindeling, raambanden, lichtstroken, de hoogte van de glazen voeg en de onderbouw van de luifel zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      southRoofNapM: SOUTH_ROOF,
      northRoofNapM: NORTH_ROOF,
      coreRoofNapM: CORE_ROOF,
      cylinderNapM: CYLINDER,
      towerArcRadiusM: R_TOWER,
      fanRadiusM: R_FAN,
      fanRoofSlopeDegrees: 14.8,
      fanEaveNapM: +EAVE.toFixed(2),
      canopyNapM: LOW,
      floors: 17,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0344100000130837 (bouwjaar 1995), actuele orthoHR, AHN-DSM en -DTM 0,5 m, BGT (overbruggingsdelen bij het parkeerdek)",
      "3D BAG NL.IMBAG.Pand.0344100000130837 (LoD2.2, AHN5 2023)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Utrecht_(stad)",
      "https://commons.wikimedia.org/wiki/File:Pythagoraslaan_101.jpg",
    ],
  },
});

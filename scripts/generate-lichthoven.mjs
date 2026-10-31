// Lichthoven / The Social Hub (Stationsweg, Eindhoven, 2016, Sarafopoulos Architecten en Architecten Cie):
// hotel- en woontoren van 23 lagen aan de noordkant van het Stationsplein, op de plek van het oude
// postkantoor. Een rechthoekige schijf van 43,2 × 14,8 m met gevels van lichte baksteenlisenen en
// donkere baksteenvelden ertussen, per vier lagen een lichte horizontale band, een glazen plint van
// twee lagen tussen dezelfde penanten en op het dak een borstwering rondom, een installatiekast en
// een paar kanalen. Aan de Stationsweg twee entreeluifels.
// Contour en dakhoogtes uit de BAG en de 3D BAG (AHN5), gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "lichthoven";
// Gebouwstelsel: u langs de lange gevels naar het oostnoordoosten (12,52° op RD-oost, BAG-randen
// evenwijdig binnen 0,05°), v haaks erop naar het noordnoordwesten. Oorsprong in het hart van de
// BAG-contour. De zuidgevel (v = -7,42) staat aan de Stationsweg, de westgevel naar het station.
const ORIGIN = [161534.31, 383657.88];
const ANGLE = 12.52;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 16.0; // NAP, AHN-DTM rondom (p50 16,03; 3D BAG-maaiveld 15,94)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 (AHN5 2024) en AHN-DSM ----------
const ROOF = 89.17; // dakvlak binnen de borstwering (3D BAG 89,16–89,18; DSM 89,2)
const PARAPET = 89.85; // borstwering rondom (DSM 89,8–89,9 op een rand van 0,7 m)
const PLANT = 92.04; // installatiekast (3D BAG 92,03–92,05; DSM 92,1)
const PLANT_EAST = 90.46; // lager blok tegen de oostkant van de kast (3D BAG)
const DUCTS = 90.65; // kanalen en ventilatoren op het oostelijke dak (DSM 90,5–90,7)

// ---------- Plattegrond in (u, v): BAG-contour (rechthoek binnen 3 cm) ----------
const U = 21.61, V = 7.42;
const FOOTPRINT = rect(-U, -V, U, V);
const RIM = 0.9; // borstwering (0,7 m in het DSM, verbreed tot de printmaat)
const PLANT_POLY = rect(-14.6, -4.1, 10.12, 3.85); // 3D BAG-dakvlak op 92,04
const PLANT_EAST_POLY = rect(10.0, -3.75, 13.3, 0.8); // 3D BAG-dakvlak op 90,46, op het DSM verbreed
const DUCT_POLYS = [rect(13.2, -4.1, 19.0, -3.0), rect(13.2, -0.5, 19.0, 0.6), rect(13.4, 2.4, 15.6, 3.6)];

// Entreeluifels aan de Stationsweg: [van travee, tot travee] op de zuidgevel, geteld vanaf de westhoek.
const CANOPIES = [[3, 5], [8, 10]];
const CANOPY_TOP = 4.0, CANOPY_THICK = 1.5, CANOPY_OUT = 1.0;

const body = union([
  prism(FOOTPRINT, BASE, z(PARAPET)).subtract(prism(rect(-U + RIM, -V + RIM, U - RIM, V - RIM), z(ROOF), z(PARAPET) + 1)),
  prism(PLANT_POLY, z(ROOF) - 0.1, z(PLANT)),
  prism(PLANT_EAST_POLY, z(ROOF) - 0.1, z(PLANT_EAST)),
  ...DUCT_POLYS.map((p) => prism(p, z(ROOF) - 0.1, z(DUCTS))),
]);

// ---------- Gevels ----------
// Plint: begane grond en eerste verdieping in glas tot +10,2 m boven maaiveld; daarboven 21 lagen van
// 3,0 m tot het dak (23 lagen volgens Wikipedia). Lichte banden op de plintrand en na elke vier lagen;
// de bovenste vijf lagen vormen de kroon. Lisenen van 0,9 m op een travee van 43,22/14 m (lange gevels)
// en 14,84/5 m (korte gevels), op de hoeken een lisene van 0,9 m op beide gevels.
const PLINTH = 10.2;
const STOREY = 3.0;
const FLOORS = Array.from({ length: 21 }, (_, k) => PLINTH + STOREY * k);
const BANDS = [PLINTH, PLINTH + 12, PLINTH + 24, PLINTH + 36, PLINTH + 48];
const TOP = z(PARAPET) - 0.9; // onderkant van de lichte dakrand
const HALF_BAND = 0.45;
const LISENE = 0.9;
const PANEL = 0.3; // donkere baksteenvelden liggen 0,3 m achter de lisenen
const WINDOW = 0.35; // vensters 0,35 m achter het veld
const GLASS = 0.45; // plintglas achter de penanten

// Rand a→b met de buitennormaal rechts van de looprichting (de contour loopt linksom).
const faces = [
  { name: "zuid", a: [-U, -V], b: [U, -V], bays: 14, stagger: false },
  { name: "oost", a: [U, -V], b: [U, V], bays: 5, stagger: true },
  { name: "noord", a: [U, V], b: [-U, V], bays: 14, stagger: false },
  { name: "west", a: [-U, V], b: [-U, -V], bays: 5, stagger: true },
];

const cuts = [];
const additions = [];
for (const f of faces) {
  const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]);
  const d = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L], n = [d[1], -d[0]];
  // depth > 0 = de gevel in, < 0 = naar buiten
  const P = (s, depth, h) => [f.a[0] + d[0] * s - n[0] * depth, f.a[1] + d[1] * s - n[1] * depth, h];
  // Blinde nis van s0..s1, van t0 tot diepte t1, onderkant lo, plafond onder 45° (op diepte t1 op hi).
  const niche = (s0, s1, t0, t1, lo, hi) => Manifold.hull([
    P(s0, t0, lo), P(s1, t0, lo), P(s0, t1, lo), P(s1, t1, lo),
    P(s0, t0, hi + (t1 - t0)), P(s1, t0, hi + (t1 - t0)), P(s0, t1, hi), P(s1, t1, hi),
  ]);
  const bay = L / f.bays;
  const panels = Array.from({ length: f.bays }, (_, k) => [
    k === 0 ? LISENE : k * bay + LISENE / 2,
    k === f.bays - 1 ? L - LISENE : (k + 1) * bay - LISENE / 2,
  ]);
  // Plint: glas tussen de penanten, tot onder de plintband.
  for (const [s0, s1] of panels) cuts.push(niche(s0, s1, -0.2, GLASS, 0.2, PLINTH - HALF_BAND - GLASS));
  // Segmenten van vier (bovenaan vijf) lagen: donker veld per travee, per laag een venster.
  const segments = BANDS.map((zb, i) => [zb + HALF_BAND, (BANDS[i + 1] ?? TOP + HALF_BAND) - HALF_BAND]);
  for (const [lo, hi] of segments) {
    panels.forEach(([s0, s1], k) => {
      cuts.push(niche(s0, s1, -0.2, PANEL, lo, hi - PANEL));
      const width = f.stagger ? 1.0 : 1.2;
      const mid = (s0 + s1) / 2;
      const shift = f.stagger ? Math.min(0.45, (s1 - s0 - width) / 2 - 0.15) : 0;
      FLOORS.filter((zf) => zf >= lo - 0.5 && zf + STOREY <= hi + HALF_BAND + 0.5).forEach((zf, j) => {
        const c = mid + (f.stagger ? ((j + k) % 2 ? shift : -shift) : 0);
        const wlo = zf + 0.8, whi = Math.min(zf + 2.5, hi) - WINDOW; // bovenkant 2,5 m boven de vloer op het veld
        cuts.push(niche(c - width / 2, c + width / 2, 0.1, PANEL + WINDOW, wlo, whi));
      });
    });
  }
  // Entreeluifels: zwart blok van 1,5 m dik, 1,0 m voor de penanten, kraag onder 45° tot in de glasnis.
  if (f.name === "zuid") {
    for (const [k0, k1] of CANOPIES) {
      const s0 = k0 * bay + 0.2, s1 = k1 * bay - 0.2, bot = CANOPY_TOP - CANOPY_THICK;
      const wall = GLASS + 0.05, drop = CANOPY_OUT + wall;
      additions.push(Manifold.hull([
        P(s0, wall, CANOPY_TOP), P(s1, wall, CANOPY_TOP), P(s0, -CANOPY_OUT, CANOPY_TOP), P(s1, -CANOPY_OUT, CANOPY_TOP),
        P(s0, -CANOPY_OUT, bot), P(s1, -CANOPY_OUT, bot), P(s0, wall, bot - drop), P(s1, wall, bot - drop),
      ]));
    }
  }
}

const building = union([body.subtract(union(cuts)), ...additions]);
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Lichthoven: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Lichthoven", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:lichthoven-toren", building]],
  catalog: {
    name: "Lichthoven (The Social Hub)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 59.93, // NAP-maaiveld + NLGEO2018-geoïde 43,93 (Kennedytoren ernaast: 43,92)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0772100001019300"],
    description:
      "Lichthoven (The Social Hub, voorheen The Student Hotel) aan de Stationsweg bij Eindhoven Centraal: schijf van 43,2 × 14,8 m op de BAG-contour tot NAP +89,17 m met een borstwering tot +89,85 m, een installatiekast van 24,7 × 7,95 m tot +92,04 m en een lager blok en kanalen aan de oostkant; gevels met lisenen van 0,9 m (14 traveeën op de lange, 5 op de korte gevels), per travee een donker veld 0,3 m terug en per laag een venster als blinde nis, lichte banden op de plintrand en na elke vier lagen, een glazen plint van 10,2 m tussen de penanten en twee entreeluifels aan de Stationsweg. Hoogtes uit de 3D BAG (AHN5). Oorsprong in het hart van de BAG-contour, X-as langs de lange gevels (12,52° op RD-oost). Verdiepingshoogte, plinthoogte, vensterraster, luifels en de dakkanalen zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      parapetNapM: PARAPET,
      plantNapM: [PLANT_EAST, PLANT],
      ductsNapM: DUCTS,
      planM: [2 * U, 2 * V],
      floors: 23,
      plinthHeightM: PLINTH,
      storeyHeightM: STOREY,
      bays: { long: 14, short: 5 },
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0772100001019300 (bouwjaar 2016), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100001019300 (3D BAG LoD2.2, AHN5 2024; TU Delft/3DGI, CC BY 4.0)",
      "https://nl.wikipedia.org/wiki/Lichthoven",
      "https://commons.wikimedia.org/wiki/File:Lichthoven_Eindhoven.jpg",
      "https://commons.wikimedia.org/wiki/File:The_Student_Hotel_-_Stationsweg_Eindhoven.jpg",
      "https://commons.wikimedia.org/wiki/File:Bouwproject_Lightyards_(2026)_(1).jpg",
    ],
  },
});

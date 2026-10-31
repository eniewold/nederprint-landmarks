// Rechtbank Amsterdam (Parnassusweg 280, Zuidas, 2020, KAAN Architecten): gerechtsgebouw van 50 m hoog uit
// twee even grote, in elkaar geschoven blokken van circa 43 × 65 m; de noordwest- en de zuidoosthoek blijven
// open. In de zuidoosthoek ligt het verhoogde plein met het beeld "Love or Generosity". Elk blok heeft een
// open binnenhof die in het dak is uitgespaard, met daarin lichtschachten naar de hal. De buitengevels zijn
// een donker bronskleurig raster in drie zones: een publieke onderzone van drie rijen grote vensters, twee
// overgangslagen met halve vensters en vijf kantoorlagen met fijne lamellen. Aan het plein (de twee
// binnengevels van de zuidoosthoek) staat de onderzone achter een reuzenorde van witte natuurstenen pijlers.
// Contouren en hoven uit de 3D BAG (LoD2.2, AHN5) en de BGT, hoogtes uit het AHN4-DSM (het gebouw staat er
// al in) en de 3D BAG, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "rechtbank-amsterdam";
// Gebouwstelsel: u langs de zuidgevels naar het oosten (3,17° op RD-oost; BAG-randen evenwijdig binnen
// 0,05°), v langs de oost- en westgevels naar het noorden. Oorsprong in de binnenhoek van de twee blokken
// aan het plein.
const ORIGIN = [119581.73, 483690.77];
const ANGLE = 3.17;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.5; // NAP, AHN-DTM langs de noord- en oostgevel (0,48–0,52); plein +1,33, zuidkant +0,83
const GEOID = 43.04; // NLGEO2018 ter plekke
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 50.75; // dak van beide blokken (AHN4-DSM 50,67, 3D BAG 50,80)
const COURT_SW = 34.3; // vloer van de hof in het zuidwestblok (3D BAG 34,30, DSM 34)
const COURT_NE = 29.75; // vloer van de hof in het noordoostblok (3D BAG 29,75, DSM 29–30)
const PLANTER_SW = 36.4; // plantenbak langs de noordwand van de zuidwesthof (3D BAG 36,4)
const WELL_SW = 11.8; // glasdak onder de lichtschacht van de zuidwesthof (3D BAG 11,8, DSM 7–12)
const WELL_NE = 11.5; // glasdaken onder de twee lichtschachten van de noordoosthof (3D BAG 11,5, DSM 11–12)
const CANOPY = 4.4; // bovenkant van de entreeluifel aan het plein (3D BAG 4,40–4,45)

// ---------- Plattegrond in (u, v) ----------
const SW = rect(-43.2, -43.6, 0, 22.1); // zuidwestblok, 43,2 × 65,7 m (3D BAG-dakrand, BGT-pand)
const NE = rect(-21.5, 0, 43.8, 43.9); // noordoostblok, 65,3 × 43,9 m
const OUTLINE = [[-43.2, -43.6], [0, -43.6], [0, 0], [43.8, 0], [43.8, 43.9], [-21.5, 43.9], [-21.5, 22.1], [-43.2, 22.1]];
const HOF_SW = rect(-30.7, -29.5, -12.4, -0.3); // 18,3 × 29,2 m (3D BAG, DSM)
const HOF_NE = rect(0.9, 12.8, 29.3, 30.6); // 28,4 × 17,8 m
const PLANTER = rect(-25.1, -2.2, -16.4, -0.3);
// Entreeluifel voor de zuidgevel van het noordoostblok: 19,9 m breed, 3,1 m voor de pijlers (3D BAG); hij loopt
// door tot de teruggelegen glaspui. Op foto's een dunne plaat; hier 1,5 m dik, vrij uitkragend zoals in het echt.
const CANOPY_POLY = rect(15.3, -3.1, 35.2, 1.0);
const WELLS_SW = [rect(-26.1, -20.9, -18.1, -11.9)];
const WELLS_NE = [rect(11.3, 16.6, 15.3, 25.9), rect(22.3, 16.6, 26.3, 25.9)];
// Installaties op het dak waar het DSM minstens 0,9 m boven het dak meet: [veelhoek, bovenkant NAP].
const PLANT = [
  [rect(-19.0, 4.6, -16.5, 12.1), 52.2], // twee rijen luchtbehandelingskasten
  [rect(-15.5, 5.1, -13.0, 12.1), 52.2],
  [rect(-22.0, 8.1, -19.5, 11.6), 52.1],
  [rect(-11.0, 16.6, -9.0, 19.1), 52.05],
  [rect(-35.0, -15.4, -31.5, -9.9), 51.9],
  [rect(29.8, 15.6, 32.0, 18.1), 52.2],
  [rect(-14.0, 38.1, -7.5, 40.6), 51.7],
];

// ---------- Lagen (lokaal, boven het maaiveld) ----------
// Onderzone: hal van dubbele hoogte en twee lagen met zittingszalen; overgangszone van twee lagen;
// vijf kantoorlagen tot een borstwering van 1,75 m. De vloer van de noordoosthof ligt op de grens van
// overgangs- en kantoorzone (+29,25 m), de zuidwesthof één laag hoger.
const LOWER = [[0, 7.4], [7.4, 6.0], [13.4, 6.0]];
const TRANS = [[19.4, 5.0], [24.4, 4.85]];
const UPPER = Array.from({ length: 5 }, (_, k) => [29.25 + 3.85 * k, 3.85]);
const COLONNADE_TOP = 19.4;

const body = union([
  prism(SW, BASE, z(ROOF)),
  prism(NE, BASE, z(ROOF)),
  ...PLANT.map(([p, top]) => prism(p, z(ROOF) - 0.1, z(top))),
]).subtract(union([
  prism(HOF_SW, z(COURT_SW), z(ROOF) + 5),
  prism(HOF_NE, z(COURT_NE), z(ROOF) + 5),
  ...WELLS_SW.map((p) => prism(p, z(WELL_SW), z(COURT_SW) + 1)),
  ...WELLS_NE.map((p) => prism(p, z(WELL_NE), z(COURT_NE) + 1)),
]));
const planter = prism(PLANTER, z(COURT_SW) - 0.1, z(PLANTER_SW));
const canopy = prism(CANOPY_POLY, z(CANOPY) - 1.5, z(CANOPY));

// ---------- Gevelreliëf ----------
// Langs de rand a→b met de leegte rechts (buitenring linksom, hoven rechtsom): per laag vensters als
// blinde nissen met een plafond onder 45°, op een travee van circa 3,96 m (elf traveeën op de korte gevel).
const DEPTH = 0.35;
const cuts = [];
function niches(a, b, floors, { perBay = 1, sill = 0.45, header = 0.45, depth = DEPTH, post = 1.0 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  const bays = Math.max(1, Math.round(L / 3.96)), pitch = L / bays / perBay, width = pitch - post;
  for (const [zf, fh] of floors) {
    const lo = Math.max(zf + sill, 0.3), hi = zf + fh - header - depth;
    if (hi - lo < 0.9) continue;
    for (let k = 0; k < bays * perBay; k++) {
      const s0 = k * pitch + post / 2, s1 = s0 + width;
      cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + depth + 0.2), P(s1, -0.2, hi + depth + 0.2), P(s0, depth, hi), P(s1, depth, hi)]));
    }
  }
}
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
const cw = (poly) => [...poly].reverse();
// Binnengevels aan het plein: oostgevel van het zuidwestblok en zuidgevel van het noordoostblok.
const PLAZA = [[[0, -43.6], [0, 0]], [[0, 0], [43.8, 0]]];
for (const [a, b] of edges(OUTLINE)) {
  const plaza = PLAZA.some(([p, q]) => p[0] === a[0] && p[1] === a[1] && q[0] === b[0] && q[1] === b[1]);
  if (plaza) {
    // Reuzenorde: witte pijlers van 1,0 m op de travee, het glas 1,0 m terug met een plafond onder 45°.
    niches(a, b, [[0, COLONNADE_TOP]], { sill: -0.3, header: 0, depth: 1.0 });
  } else {
    niches(a, b, LOWER);
  }
  niches(a, b, TRANS, { perBay: 2, sill: 0.9, post: 0.95 });
  niches(a, b, UPPER, { perBay: 2, sill: 0.9, header: 0.35, post: 0.95 });
}
// Hofgevels: kantoorlagen vanaf de hofvloer.
for (const [hof, floor] of [[HOF_SW, z(COURT_SW)], [HOF_NE, z(COURT_NE)]]) {
  const rows = Array.from({ length: Math.floor((z(ROOF) - 1.75 - floor) / 3.6) }, (_, k) => [floor + 3.6 * k, 3.6]);
  for (const [a, b] of edges(cw(hof))) niches(a, b, rows, { perBay: 2, sill: 0.9, header: 0.35, post: 0.95 });
}

const building = union([body.subtract(union(cuts)), planter, canopy]);
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Rechtbank: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Rechtbank", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:rechtbank-amsterdam", building]],
  catalog: {
    name: "Rechtbank Amsterdam",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: +(GROUND + GEOID).toFixed(2), // NAP-maaiveld + NLGEO2018 (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    // Langs de noord-, oost- en zuidgevel: aan de westkant ligt een verdiepte inrit (NAP -3,9).
    groundSamplePoints: [[-5, 48], [25, 48], [48, 25], [48, 5], [-20, -48]],
    replacesBuildings: ["NL.IMBAG.Pand.0363100012252557"],
    description:
      "Rechtbank Amsterdam aan de Parnassusweg (Zuidas, KAAN Architecten): twee in elkaar geschoven blokken van 43,2 × 65,7 m en 65,3 × 43,9 m tot NAP +50,75 m op de contour uit de 3D BAG en de BGT, met de open noordwest- en zuidoosthoek. In het dak een hof per blok (vloer +34,3 en +29,75 m) met lichtschachten tot het glasdak van de hal (+11,8 en +11,5 m) en een plantenbak; op het dak luchtbehandelingskasten. Buitengevels per laag als blinde nissen: drie rijen grote vensters, twee overgangslagen en vijf kantoorlagen met halve vensters; aan het plein een reuzenorde van pijlers van 1,0 m voor een 1,0 m teruggelegen glaspui tot +19,9 m, met daarvoor een entreeluifel van 19,9 × 3,1 m tot +4,4 m. Hoogtes uit het AHN4-DSM en de 3D BAG. Oorsprong in de binnenhoek aan het plein, X-as langs de zuidgevels (3,17° op RD-oost). Verdiepingshoogtes, het travee- en lamellenraster, de diepte van de pijlers en de dikte van de luifel zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      courtyardFloorNapM: [COURT_SW, COURT_NE],
      lightWellNapM: [WELL_SW, WELL_NE],
      blocksM: [[43.2, 65.7], [65.3, 43.9]],
      courtyardsM: [[18.3, 29.2], [28.4, 17.8]],
      floors: { lower: LOWER.length, transition: TRANS.length, upper: UPPER.length },
      bayM: 3.96,
      colonnadeTopM: COLONNADE_TOP,
      canopyTopNapM: CANOPY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012252557 (bouwjaar 2022), BGT-pand en -erf, actuele orthoHR, AHN4-DSM en -DTM 0,5 m, 3D BAG LoD2.2 (AHN5, 2023)",
      "https://nl.wikipedia.org/wiki/Rechtbank_Amsterdam",
      "https://www.baunetzwissen.de/treppen/objekte/buero-gewerbe/gerichtsgebaeude-in-amsterdam-8231951",
      "https://commons.wikimedia.org/wiki/File:2021_Rechtbank_Amsterdam,_Parnassusweg_280_(1).jpg",
      "https://commons.wikimedia.org/wiki/File:2021_Rechtbank_Amsterdam,_Parnassusweg_280_(3).jpg",
      "https://commons.wikimedia.org/wiki/File:2021_Love_or_generosity_(1).jpg",
    ],
  },
});

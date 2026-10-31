// La Liberté (Laan van de Vrijheid / Vrijheidsplein, Groningen, 2011, Dominique Perrault): de hoge
// toren van het complex, schuin tegenover het Gasuniegebouw. Drie op elkaar gestapelde blokken op
// dezelfde vierkante plattegrond van 25,2 m: een glazen kantoorsokkel met horizontale strepen, daarop
// een teruggelegen glazen terrasverdieping, een donker woonblok dat over die verdieping heen kraagt en
// een wit woonblok dat 1,4 m naar het noordwesten is verschoven (aan de zuidoostkant blijft een strook
// dak van het donkere blok vrij, aan de noordwestkant hangt het witte blok over). In beide woonblokken
// een vrij verspreid patroon van kleine vensters en brede balkonramen.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2) en het AHN-DSM, verspringing en verdiepingen uit
// foto's en de luchtfoto.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "la-liberte-groningen";
// Gebouwstelsel: x langs de zuidoostgevel naar het noordoosten (52,6° op RD-oost; de vier BAG-randen
// staan haaks binnen 0,01°), y langs de zuidwestgevel naar het noordwesten. Oorsprong in het hart van
// de BAG-contour.
const ORIGIN = [233015.91, 579933.24];
const AXIS = [15.3, 19.99]; // BAG-rand van de zuid- naar de oosthoek
const GROUND = -0.15; // NAP, plein rondom (AHN-DTM -0,36…0,12; 3D BAG-maaiveld -0,30)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const PLINTH = 11.77; // dak van de glazen sokkel (3D BAG-dakvlak langs de zuidwestrand 11,76–11,81)
const DARK_BOTTOM = 14.6; // onderkant van het donkere blok (foto's; geschat)
const DARK_TOP = 45.6; // dak van het donkere blok waar het witte blok terugligt (3D BAG 45,54–45,84)
const ROOF = 72.5; // dak van het witte blok (3D BAG 72,47–72,52; AHN-mediaan 72,50)
const PARAPET = 73.3; // dakrand (AHN-DSM langs de randen 73–75; geschat)
const PLANT = [
  // installaties op het dak (3D BAG-dakvlakken, plaats en hoogte in het DSM nagekeken)
  { name: "koelers", poly: rect(-5.67, -2.31, -3.47, 4.89), top: 74.92 },
  { name: "opbouw", poly: rect(-2.5, -1.52, 1.87, 1.89), top: 74.27 },
  { name: "gevelliftkraan", poly: rect(6.1, -11.19, 7.44, -9.69), top: 74.2 },
];

// ---------- Plattegronden ----------
const H = 12.59; // halve zijde van de BAG-contour (25,18 m)
const SQUARE = rect(-H, -H, H, H);
const SHIFT = 1.4; // het witte blok ligt zoveel naar het noordwesten (+y)
const WHITE = rect(-H, -H + SHIFT, H, H + SHIFT);
const TERRACE_IN = 3.0; // glazen terrasverdieping ligt rondom zoveel terug (foto's; geschat)
const TERRACE = rect(-H + TERRACE_IN, -H + TERRACE_IN, H - TERRACE_IN, H - TERRACE_IN);

// ---------- Verdiepingen (lokaal z) ----------
const PLINTH_FLOORS = [[0, 4.4], [4.4, 3.75], [8.15, z(PLINTH) - 8.15]];
const DARK_FLOORS = Array.from({ length: 10 }, (_, k) => [z(DARK_BOTTOM) + 3.1 * k, 3.1]);
const WHITE_STOREY = (ROOF - DARK_TOP) / 9;
const WHITE_FLOORS = Array.from({ length: 9 }, (_, k) => [z(DARK_TOP) + WHITE_STOREY * k, WHITE_STOREY]);
const DEPTH = 0.35;

const body = union([
  prism(SQUARE, BASE, z(PLINTH)),
  prism(TERRACE, z(PLINTH) - 0.1, z(DARK_BOTTOM) + 0.1),
  prism(SQUARE, z(DARK_BOTTOM), z(DARK_TOP)),
  prism(WHITE, z(DARK_TOP), z(ROOF)), // vlak op het donkere blok, zodat de overstek aan de noordwestkant op +45,6 m blijft
  prism(WHITE, z(ROOF) - 0.1, z(PARAPET)).subtract(prism(rect(-H + 0.9, -H + SHIFT + 0.9, H - 0.9, H + SHIFT - 0.9), z(ROOF), z(PARAPET) + 1)),
  ...PLANT.map((p) => prism(p.poly, z(ROOF) - 0.1, z(p.top))),
]);

// ---------- Gevelreliëf ----------
const cuts = [];
// Sokkel: per laag een glasband 0,3 m diep die om de hoeken doorloopt, met een borstwering van 0,9 m
// en een plafond onder 45°.
const ring = (half, cx, cy, d) => rect(cx - half - d, cy - half - d, cx + half + d, cy + half + d);
for (const [zf, fh] of PLINTH_FLOORS) {
  const lo = zf === 0 ? 0 : zf + 0.9, hi = zf + fh - 0.3 - 0.3;
  const outer = ring(H, 0, 0, 0.2), inner = ring(H, 0, 0, -0.3);
  const band = Manifold.hull([
    ...outer.map(([x, y]) => [x, y, lo]), ...outer.map(([x, y]) => [x, y, hi + 0.3 + 0.2]),
    ...inner.map(([x, y]) => [x, y, lo]), ...inner.map(([x, y]) => [x, y, hi]),
  ]);
  cuts.push(band.subtract(prism(inner, lo - 1, hi + 2)));
}

// Woonblokken: een vrij verspreid vensterpatroon zoals op de foto's, per laag en per gevel zes tot
// acht openingen: kleine vensters (1,5 × 1,6 m) en brede balkonramen (2,7 × 2,05 m), als blinde nissen
// van 0,35 m met een plafond onder 45°, minstens 0,9 m uit elkaar en 1,0 m uit de hoeken. Het patroon
// komt uit een vaste pseudo-willekeurige reeks (zelfde model bij elke run); de echte posities zijn niet
// overgenomen.
function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
function windows(poly, floors, seed) {
  const rnd = mulberry32(seed);
  edges(poly).forEach(([a, b]) => {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    for (const [zf] of floors) {
      const types = Array.from({ length: 6 + Math.floor(rnd() * 3) }, () => (rnd() < 0.3 ? "wide" : "small"));
      const room = () => L - 2 * 1.0 - types.reduce((s, t) => s + (t === "wide" ? 2.7 : 1.5), 0) - (types.length - 1) * 0.9;
      while (room() < 0.5) types.pop();
      const count = types.length, widths = types.map((t) => (t === "wide" ? 2.7 : 1.5)), free = room();
      const weights = Array.from({ length: count + 1 }, () => 0.2 + rnd());
      const total = weights.reduce((s, w) => s + w, 0);
      let s = 1.0 + (free * weights[0]) / total;
      types.forEach((t, k) => {
        const lo = zf + (t === "wide" ? 0.4 : 0.85), top = zf + 2.45;
        const s0 = s, s1 = s + widths[k];
        cuts.push(Manifold.hull([
          P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo),
          P(s0, -0.2, top + 0.2), P(s1, -0.2, top + 0.2), P(s0, DEPTH, top - DEPTH), P(s1, DEPTH, top - DEPTH),
        ]));
        s = s1 + 0.9 + (free * weights[k + 1]) / total;
      });
    }
  });
}
windows(SQUARE, DARK_FLOORS, 1011);
windows(WHITE, WHITE_FLOORS, 2011);

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`La Liberté: ${parts.length} losse delen`);
console.log("La Liberté", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:la-liberte-groningen", building]],
  catalog: {
    name: "La Liberté",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 40.6, // NAP -0,15 + 40,75 (geoïde NLGEO2018 40,80; Oosterpoort en Vera 40,61–40,68)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0014100010982642"],
    description:
      "Hoge toren van La Liberté aan de Laan van de Vrijheid (Dominique Perrault, 2011): op de vierkante BAG-contour van 25,2 m een glazen sokkel tot NAP +11,8 m met per laag een glasband, een rondom 3 m teruggelegen glazen terrasverdieping, een donker woonblok van +14,6 tot +45,6 m en een wit woonblok tot +72,5 m dat 1,4 m naar het noordwesten is verschoven, met een dakrand tot +73,3 m en drie installaties tot +74,9 m; in beide woonblokken een vrij verspreid patroon van vensters en balkonramen als blinde nissen. Hoogtes uit de 3D BAG en het AHN-DSM, verschuiving en verdiepingen uit foto's. Oorsprong in het hart van de BAG-contour, X-as langs de zuidoostgevel (52,6° op RD-oost). Geschat zijn de onderkant van het donkere blok, de terugsprong van de terrasverdieping, de verdiepingshoogtes en het vensterpatroon, dat niet de echte posities volgt.",
    realWorld: {
      groundNapM: GROUND,
      plinthNapM: PLINTH,
      darkBlockNapM: [DARK_BOTTOM, DARK_TOP],
      roofNapM: ROOF,
      parapetNapM: PARAPET,
      plantNapM: PLANT.map((p) => p.top),
      footprintM: 25.18,
      whiteBlockShiftM: SHIFT,
      terraceSetbackM: TERRACE_IN,
      floors: { plinth: 3, terrace: 1, darkBlock: 10, whiteBlock: 9 },
      facadeAngleDegrees: 52.58,
      estimatedWindowPattern: true,
    },
    sources: [
      "PDOK BAG pand 0014100010982642 (bouwjaar 2011), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010982642 (3D BAG LoD2.2, TU Delft/3DGI, CC BY 4.0)",
      "https://nl.wikipedia.org/wiki/La_Libert%C3%A9_(gebouw)",
      "https://perraultarchitecture.com/en/projects/la-liberte/",
      "https://commons.wikimedia.org/wiki/File:20120326_La_Libert%C3%A9_Groningen_NL.jpg",
      "https://commons.wikimedia.org/wiki/File:La_Libert%C3%A9_20110719.jpg",
      "https://commons.wikimedia.org/wiki/File:La_Libert%C3%A9_Groningen.JPG",
    ],
  },
});

// OurDomain Rotterdam Blaak (André van der Louwbrug / Gapersteeg, Rotterdam, 2021–2022, Tangram
// Architekten): woontoren van 24 lagen op de kop van de Wijnhaven, naast de Willem de Kooning Academie
// (Blaak 10). Een schijf van 20 m breed en 64 m lang met witte lisenen aan de zuidwestgevel, aan de
// zuidoostkant een iets hoger blok met aluminium panelen met een vlekkenprint en losse ramen. Rondom
// lopen drie horizontale banden: een onderbouw van zes lagen met witte lisenen, een teruggezette
// middenzone met de print en een bovenzone van acht lagen die aan de zuid- en noordoostgevel uitkraagt.
// Langs de Gapersteeg staat de onderbouw 2,3 m buiten de toren op schuine kolommen; op de noordwestpunt
// staat een glazen paviljoen van twee lagen.
// Contour uit de BAG; hoogtes uit de 3D BAG-dakvlakken (AHN5 2023: het AHN4 van PDOK dateert van vóór de
// bouw en meet hier nog de bouwput); banden, terugsprongen en gevelindeling uit foto's.
import { CrossSection, Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "blaak-10";
// Gebouwstelsel: u langs de lange gevels naar het zuidoosten (-54,61° op RD-oost; BAG-randen 0 en 10
// evenwijdig binnen 0,01°), v haaks erop naar het noordoosten (de André van der Louwbrug).
const ORIGIN = [93232.0, 437050.0];
const ANGLE = -54.61;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 2.47; // NAP, 3D BAG-maaiveld (AHN-DTM aan de Gapersteeg 2,6–2,8; aan de brugzijde 4,2–5,2)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 (dakvlakken uit AHN5 2023) ----------
const ROOF_SW = 75.22; // schijf, zuidwestelijke helft (dakvlak 229 m², 75,12–75,36)
const ROOF_NE = 75.88; // schijf, noordoostelijke helft (299 m², 75,79–76,08)
const ROOF_NOTCH = 75.26; // inham aan de noordoostgevel naast het hoge blok (47 m²)
const ROOF_SE = 78.06; // zuidoostelijk blok (365 m², 78,00–78,14; 70e percentiel van het hele pand 78,07)
const SPINE = 79.01; // dakopbouw midden over de schijf (114 m², 78,96–79,06)
const CORE_NW = 78.32; // trappenhuis/liftkern op de noordwestpunt (17,5 m², 78,27–78,36)
const PODIUM = 24.76; // onderbouw langs de Gapersteeg (40 m², 24,63–24,98)
const PAVILION = 8.68; // glazen paviljoen op de noordwestpunt (33 m², 8,56–8,82)
// Installaties op het hoge blok: [u0, v0, u1, v1, top]
const PLANT = [
  [7.9, -8.35, 14.0, 0.05, 80.36], // 35 m²
  [13.9, -4.9, 19.8, -1.8, 81.22], // 15 m²
  [19.8, -7.9, 21.9, 0.5, 80.0], // 13 m²
  [16.7, -9.2, 24.2, -6.4, 79.13], // 13 m²
  [19.8, -1.1, 23.5, 2.8, 79.0], // 7 m²
  [-2.9, -6.1, -1.1, -3.6, 81.32], // liftopbouw op de schijf, 3,5 m²
];

// ---------- Plattegrond in (u, v), BAG-contour vereenvoudigd ----------
const E1A = [3.13, -13.66]; // begin van de schuine zuidwestgevel langs de Gapersteeg (BAG-rand 1)
const E1B = [22.68, -20.85]; // hoek Gapersteeg / Wijnhaven
const SEC = [32.53, 6.38]; // oosthoek: zuidgevel (BAG-rand 2, verlengd) op de noordoostgevel
// Het terras ten zuidoosten van rand 2 (BAG-randen 3–9) heeft geen opbouw: de 3D BAG geeft er geen
// dakvlak en de ortho toont stoelen en een plantenbak op maaiveld.
const FOOTPRINT = [[-26.84, -13.66], E1A, E1B, SEC, [-33.48, 6.38], [-33.32, -6.2], [-31.68, -6.28], [-29.2, -8.82], [-26.76, -8.84]];
const SPLIT_V = -3.3; // grens tussen de twee dakhelften van de schijf (midden onder de dakopbouw)
const JOINT_U = 6.5; // grens tussen schijf en hoog blok (3D BAG)
const NOTCH = [JOINT_U, 3.6, 13.0]; // inham aan de noordoostgevel: u0, v0, u1
// Zuidwestgevel van het blok boven de onderbouw: 2,3 m binnen BAG-rand 1 (3D BAG-dakrand en dakvlak
// van de onderbouw), vanaf de aansluiting op de schijf bij u = 5,62.
const UP_A = [6.75, -12.62], UP_B = [23.49, -18.56];
const UP_U0 = 5.62;

// ---------- Banden (lokaal z) en lagen ----------
// Begane grond 4,0 m, daarboven lagen van 3,05 m (geschat): 24 lagen tot het hoge blok, 23 tot de schijf.
const STOREY = 3.05;
const FLOORS = [[0, 4.0], ...Array.from({ length: 23 }, (_, k) => [4.0 + STOREY * k, STOREY])];
const Z_LOW = z(PODIUM); // bovenkant onderbouw = laag 6
const Z_TOP = FLOORS[16][0]; // onderkant bovenzone = laag 16 (foto: NAP circa +52,2)
const RECESS_S = 2.0; // middenzone achter de zuidgevel (foto's, geschat)
const RECESS_NE = 1.0; // middenzone achter de noordoostgevel (foto, geschat)

// ---------- Hulpfuncties ----------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const lerpLine = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function intersect(p1, p2, q1, q2) {
  const r = sub(p2, p1), s = sub(q2, q1), d = r[0] * s[1] - r[1] * s[0];
  const t = ((q1[0] - p1[0]) * s[1] - (q1[1] - p1[1]) * s[0]) / d;
  return lerpLine(p1, p2, t);
}
const vUp = (u) => UP_A[1] + ((u - UP_A[0]) * (UP_B[1] - UP_A[1])) / (UP_B[0] - UP_A[0]);
const UP_START = [UP_U0, vUp(UP_U0)];
const UP_END = intersect(UP_A, UP_B, E1B, SEC); // zuidwesthoek van het blok boven de onderbouw
const fp = new CrossSection([FOOTPRINT]);
const clip = (poly) => fp.intersect(new CrossSection([poly]));
const slab = (cs, top) => Manifold.extrude(cs, z(top) - BASE).translate([0, 0, BASE]);
// Lijn a→b met de buitennormaal rechts; P(s, n, h) met n naar buiten positief.
function frame(a, b) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, P: (s, out, h) => [a[0] + d[0] * s + n[0] * out, a[1] + d[1] * s + n[1] * out, h] };
}
// Terugsprong van de middenzone: alles tussen de buitenlijn a→b en `depth` erachter, van Z_LOW tot
// Z_TOP, met onder de bovenzone een kraag onder 45°. `ext` verlengt langs de lijn.
function recess(a, b, depth, ext = 6) {
  const { L, P } = frame(a, b);
  const pts = [];
  for (const s of [-ext, L + ext]) pts.push(P(s, -depth, Z_LOW), P(s, 8, Z_LOW), P(s, 8, Z_TOP), P(s, 0, Z_TOP), P(s, -depth, Z_TOP - depth));
  return Manifold.hull(pts);
}

// ---------- Massa ----------
const roofs = [
  slab(clip(rect(-50, -40, JOINT_U, SPLIT_V)), ROOF_SW),
  slab(clip(rect(-50, SPLIT_V, JOINT_U, 20)), ROOF_NE),
  slab(clip(rect(NOTCH[0], NOTCH[1], NOTCH[2], 20)), ROOF_NOTCH),
  slab(clip(rect(JOINT_U, -40, 50, NOTCH[1])), ROOF_SE),
  slab(clip(rect(NOTCH[2], NOTCH[1], 50, 20)), ROOF_SE),
];
const tops = [
  prism(rect(-26.0, -5.0, 13.5, -1.6), z(ROOF_SW) - 0.1, z(SPINE)),
  prism([[-33.4, -4.0], [-33.32, -6.2], [-31.68, -6.28], [-29.2, -8.82], [-26.0, -8.84], [-26.0, -4.0]], z(ROOF_SW) - 0.1, z(CORE_NW)),
  ...PLANT.map(([u0, v0, u1, v1, top]) => prism(rect(u0, v0, u1, v1), z(ROOF_SW) - 0.1, z(top))),
];
// Zuidwestgevel van het blok boven de onderbouw (ligt 2,3 m binnen rand 1).
const upperSw = prism([UP_START, [UP_START[0], -40], [40, -40], lerpLine(UP_A, UP_B, 2)], Z_LOW, 200);
const mass = union([...roofs, ...tops]).subtract(union([
  upperSw,
  recess(E1B, SEC, RECESS_S),
  recess(SEC, [-33.48, 6.38], RECESS_NE),
]));

// ---------- Gevelreliëf ----------
const DEPTH = 0.35;
const LISENE = { pitch: 2.7, width: 1.8, sill: 0.3, header: 0.35 }; // hoog glas tussen witte lisenen van 0,9 m
const PRINT = { pitch: 3.4, width: 1.4, sill: 0.9, header: 0.55, jitter: [0, 1.0, -0.7, 0.4, -1.0, 0.7, -0.3, 0.9, -0.8, 0.2, -0.5] }; // losse ramen in de print
const band = (from, to) => FLOORS.slice(from, to + 1);
function face(body, a, b, floors, style, cuts, { depth = DEPTH, ground = false } = {}) {
  const { L, P } = frame(a, b);
  const jit = style.jitter ?? [0];
  const margin = 0.9 + Math.max(...jit.map(Math.abs));
  const bays = Math.floor((L - 2 * margin + (style.pitch - style.width)) / style.pitch);
  if (bays < 1) return;
  const w0 = (L - bays * style.pitch) / 2;
  floors.forEach(([zf, fh], fi) => {
    const lo = ground ? zf : zf + style.sill, hi = zf + fh - style.header - depth;
    if (hi - lo < 0.9) return;
    const j = jit[(Math.round(zf * 10) + fi) % jit.length];
    for (let k = 0; k < bays; k++) {
      const s0 = w0 + k * style.pitch + (style.pitch - style.width) / 2 + j, s1 = s0 + style.width;
      if (s0 < 0.9 || s1 > L - 0.9) continue;
      const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [ground ? lo + 0.3 : lo + 0.05, hi + depth - 0.05].every((h) => {
        const from = P(s, 3, h), hit = body.rayCast(from, P(s, -1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, 0.2, lo), P(s1, 0.2, lo), P(s0, -depth, lo), P(s1, -depth, lo), P(s0, 0.2, hi + depth + 0.2), P(s1, 0.2, hi + depth + 0.2), P(s0, -depth, hi), P(s1, -depth, hi)]));
    }
  });
}
const cuts = [];
const NE_W = [-33.48, 6.38], NE_J = [NOTCH[2], 6.38];
const S_MID = [intersect(sub(E1B, [0.9405 * RECESS_S, -0.3399 * RECESS_S]), sub(SEC, [0.9405 * RECESS_S, -0.3399 * RECESS_S]), UP_A, UP_B),
  intersect(sub(E1B, [0.9405 * RECESS_S, -0.3399 * RECESS_S]), sub(SEC, [0.9405 * RECESS_S, -0.3399 * RECESS_S]), [0, 6.38 - RECESS_NE], [1, 6.38 - RECESS_NE])];
const NE_MID = [[S_MID[1][0], 6.38 - RECESS_NE], [-33.48, 6.38 - RECESS_NE]];
// Schijf, zuidwestgevel: lisenen over de volle hoogte.
face(mass, [-26.84, -13.66], E1A, band(1, 22), LISENE, cuts);
face(mass, [-26.84, -13.66], E1A, band(0, 0), { ...LISENE, header: 1.0 }, cuts, { ground: true });
// Gapersteeg: onderbouw met een galerij op schuine kolommen (nissen 1,5 m diep, kolommen 1,4 m),
// daarboven print in de onderbouw en op de teruggezette gevel.
face(mass, E1A, E1B, band(0, 0), { pitch: 5.5, width: 4.1, sill: 0, header: 0 }, cuts, { depth: 1.5, ground: true });
face(mass, E1A, E1B, band(1, 6), PRINT, cuts);
face(mass, UP_START, UP_END, band(7, 23), PRINT, cuts);
// Zuidgevel: glazen pui, onderbouw en bovenzone met lisenen, middenzone met print.
face(mass, E1B, SEC, band(0, 0), { pitch: 5.4, width: 4.4, sill: 0, header: 0 }, cuts, { depth: 1.0, ground: true });
face(mass, E1B, SEC, [...band(1, 6), ...band(16, 23)], LISENE, cuts);
face(mass, S_MID[0], S_MID[1], band(7, 15), PRINT, cuts);
// Noordoostgevel (brugzijde, maaiveld 1,7–2,7 m hoger: geen pui-nissen): het hoge blok met print,
// de schijf met lisenen in onderbouw en bovenzone; de middenzone met print.
face(mass, SEC, NE_J, [...band(1, 6), ...band(16, 23)], PRINT, cuts);
face(mass, NE_J, NE_W, [...band(1, 6), ...band(16, 22)], LISENE, cuts);
face(mass, NE_MID[0], NE_MID[1], band(7, 15), PRINT, cuts);
// Noordwestkop: print.
for (const [a, b] of [[NE_W, [-33.32, -6.2]], [[-31.68, -6.28], [-29.2, -8.82]], [[-26.76, -8.84], [-26.84, -13.66]]]) face(mass, a, b, band(2, 23), PRINT, cuts); // laag 1 zit achter het paviljoen
const tower = mass.subtract(union(cuts));

// ---------- Paviljoen op de noordwestpunt ----------
const PAV_RING = [[-33.1, 4.51], [-39.58, 4.49], [-39.6, 1.84], [-39.62, -1.05], [-36.77, -1.06], [-33.1, -4.83]];
const pavBody = prism(PAV_RING, BASE, z(PAVILION));
const pavCuts = [];
const GLASS = { pitch: 2.4, width: 1.6, sill: 0.3, header: 0.9 };
for (let i = 0; i < PAV_RING.length - 1; i++) {
  const [a, b] = [PAV_RING[i], PAV_RING[i + 1]];
  face(pavBody, a, b, [[0, z(PAVILION)]], GLASS, pavCuts);
}
const pavilion = pavCuts.length ? pavBody.subtract(union(pavCuts)) : pavBody;

const nodes = [["building:blaak-10-toren", tower], ["building:blaak-10-paviljoen", pavilion]].map(([name, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [name, m];
});
console.log("nissen", cuts.length, "paviljoen", pavCuts.length, "bovenzone vanaf NAP", (Z_TOP + GROUND).toFixed(2), "hoek boven onderbouw", UP_END.map((c) => c.toFixed(2)).join(", "));

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "OurDomain Rotterdam Blaak",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 46.0, // NAP + 43,5 (Rotterdam centrum)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0599100100015362"],
    description:
      "OurDomain Rotterdam Blaak (Tangram Architekten, 2022) op de kop van de Wijnhaven naast de Willem de Kooning Academie: een schijf van 20 × 40 m op de BAG-contour met daken op NAP +75,2 m (zuidwesthelft) en +75,9 m (noordoosthelft) en een dakopbouw midden over het dak tot +79,0 m, aan de zuidoostkant een hoger blok tot +78,1 m met installaties tot +81,2 m, en een trappenhuis op de noordwestpunt tot +78,3 m. Rondom een onderbouw van zes lagen tot +24,8 m, een middenzone die 2,0 m achter de zuidgevel en 1,0 m achter de noordoostgevel ligt en een bovenzone van acht lagen vanaf circa +52,2 m die daarboven uitkraagt (kraag onder 45°); langs de Gapersteeg staat de onderbouw 2,3 m buiten de toren met een galerij in de begane grond. Op de noordwestpunt een glazen paviljoen tot +8,7 m. Gevels met lisenen als vensterraster per laag, de print als verspringende losse ramen. Hoogtes uit de 3D BAG-dakvlakken (AHN5 2023; het AHN4 dateert van vóór de bouw), contour uit de BAG. Oorsprong in het hart van de contour, X-as langs de lange gevels naar het zuidoosten (-54,61° op RD-oost). Verdiepingshoogtes, de hoogte van de bovenzone, de terugsprongen en de gevelindeling zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: { slabSouthWest: ROOF_SW, slabNorthEast: ROOF_NE, notch: ROOF_NOTCH, southEastBlock: ROOF_SE, roofSpine: SPINE, coreNorthWest: CORE_NW },
      plantNapM: PLANT.map((p) => p[4]),
      podiumNapM: PODIUM,
      pavilionNapM: PAVILION,
      upperBandFromNapM: +(Z_TOP + GROUND).toFixed(2),
      recessM: { south: RECESS_S, northEast: RECESS_NE, gapersteeg: 2.3 },
      floors: 24,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100100015362 (bouwjaar 2021, oorspronkelijk 2022), actuele orthoHR, AHN-DTM 0,5 m",
      "3D BAG LoD2.2 NL.IMBAG.Pand.0599100100015362 (puntwolk AHN5 2023), https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100015362",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Rotterdam",
      "https://commons.wikimedia.org/wiki/File:OurDomain_Rotterdam_Blaak.jpg",
      "https://commons.wikimedia.org/wiki/File:Woongebouw_van_OurDomain_aan_de_Blaak.jpg",
      "https://commons.wikimedia.org/wiki/File:2025_Gapersteeg,_Rotterdam_vanaf_de_Wijnhaven_tot_aan_de_Wijnstraat.jpg",
      "https://commons.wikimedia.org/wiki/File:2025_Vissteeg,_Rotterdam_vanaf_de_Blaak_tot_aan_de_Wijnstraat.jpg",
    ],
  },
});

// The Rock (Van Heuven Goedhartplein, Kanaleneiland, Utrecht, 2020, LIAG Architecten): studententoren van
// 23 lagen met 463 woningen op het terrein van het voormalige Antonius-ziekenhuis Oudenrijn. Een rechthoekige
// toren met een witte gevel van horizontale, golvende banden (gevouwen composietplaten, "Panta Rhei"):
// per laag steekt een band onder de vensters uit, met een uitsprong die langs de gevel golft en per laag
// verschuift. Op de lange gevels een regelmatig raster van achttien vensters per laag, op de korte gevels
// een enkel venster bij de hoek en een breed driedelig venster in het midden. Gemetselde plint.
// Op het dak een installatieframe van twee lange kokers met korte poten, lage leidingkokers en twee kasten.
// Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "the-rock-utrecht";
// Gebouwstelsel: u langs de lange gevels naar het oostnoordoosten (29,55° op RD-oost, BAG-randen 29,55° en
// 119,6°), v langs de korte gevels naar het noordnoordwesten. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [134640.47, 454680.37];
const ANGLE = 29.55;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 1.72; // NAP, maaiveld uit de 3D BAG (AHN-DTM west en noord 1,7–1,8)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 73.95; // dakvlak (3D BAG 73,92–73,95; AHN-DSM 73,8–74,0, dakrand 74,3–74,5)
const PLINTH_TOP = 5.6; // plint, op de hoogte van het verhoogde binnenhof tegen de zuidoostgevel (DTM 5,5–5,6; geschat)
const FRAME_TOP = 77.05; // installatieframe (DSM 77,0–77,1; 3D BAG 77,02–77,05)
const DUCT_TOP = 75.2; // lage leidingkokers (DSM 75,0–75,4)
const PLANT_HIGH = 76.3; // installatiekast (DSM 76,2–76,4; 3D BAG 76,28–76,37)
const PLANT_LOW = 75.75; // twee lagere kasten (DSM 75,6–75,8; 3D BAG 75,64–75,85)

// ---------- Plattegrond in (u, v) ----------
// BAG-contour 33,28 × 22,99 m (knikjes < 0,3 m weggelaten): dat is de buitenrand van de gevelbanden.
const HU = 16.64, HV = 11.49;
const INSET = 1.0; // vensterwand achter de verste uitsprong van de banden (geschat)
const CORE = rect(-HU + INSET, -HV + INSET, HU - INSET, HV - INSET);
const PLINTH = rect(-HU + 0.5, -HV + 0.5, HU - 0.5, HV - 0.5);

// ---------- Lagen ----------
// Plint (begane grond) tot het binnenhof, daarboven 22 woonlagen; de bovenste band loopt door tot het dak.
const FLOORS = 22;
const CROWN = 1.4; // dakrand boven de bovenste woonlaag (foto)
const STOREY = (z(ROOF) - CROWN - z(PLINTH_TOP)) / FLOORS; // 3,04 m
const floorZ = (k) => z(PLINTH_TOP) + STOREY * k;
const SILL = 0.9, HEAD = 2.3; // venster 1,4 m hoog boven een borstwering van 0,9 m (foto)
const BAND_FOOT = 2.35; // de band begint op de wand net boven de vensters en loopt onder 45° naar buiten

// Gevels van de kern, linksom: de buitenkant ligt rechts van de looprichting.
const [c0, c1, c2, c3] = CORE;
const FACES = [
  { name: "zuidzuidoost", a: c0, b: c1 },
  { name: "oostnoordoost", a: c1, b: c2 },
  { name: "noordnoordwest", a: c2, b: c3 },
  { name: "westzuidwest", a: c3, b: c0 },
];
FACES.forEach((f) => {
  f.L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]);
  f.d = [(f.b[0] - f.a[0]) / f.L, (f.b[1] - f.a[1]) / f.L];
  f.n = [f.d[1], -f.d[0]];
});
const PERIMETER = FACES.reduce((s, f) => s + f.L, 0);
FACES.reduce((s, f) => ((f.S0 = s), s + f.L), 0);

// Uitsprong van de band: een golf rond de hele toren (acht golven, golflengte 13 m) die per laag 0,35 rad
// verschuift, tussen 0,35 en 1,0 m. Vorm en verloop zijn een stilering van de foto's.
const P_MID = 0.675, P_AMP = 0.325, WAVES = 8, SHIFT = 0.35;
const proj = (S, k) => P_MID + P_AMP * Math.sin((2 * Math.PI * WAVES * S) / PERIMETER + SHIFT * k + 0.6);

const bands = [];
for (let k = 0; k < FLOORS; k++) {
  const foot = floorZ(k) + BAND_FOOT;
  const top = k === FLOORS - 1 ? z(ROOF) : floorZ(k + 1) + SILL;
  for (const f of FACES) {
    const P = (s, t, h) => [f.a[0] + f.d[0] * s + f.n[0] * t, f.a[1] + f.d[1] * s + f.n[1] * t, h];
    const n = Math.ceil(f.L / 1.0);
    const at = (s) => [s, proj(f.S0 + s, k)];
    for (let i = 0; i < n; i++) {
      const pts = [];
      for (const [s, p] of [at((f.L * i) / n), at((f.L * (i + 1)) / n)]) {
        pts.push(P(s, -0.2, top), P(s, -0.2, foot - 0.2), P(s, p, top), P(s, p, foot + p));
      }
      bands.push(Manifold.hull(pts));
    }
    // Hoekstuk aan het eind van de gevel: onderkant één vlak onder 45° naar de kernhoek.
    const p = proj(f.S0 + f.L, k);
    const Q = (t, e, h) => [f.b[0] + f.n[0] * t + f.d[0] * e, f.b[1] + f.n[1] * t + f.d[1] * e, h];
    bands.push(Manifold.hull([
      Q(0, 0, top), Q(p, 0, top), Q(0, p, top), Q(p, p, top),
      Q(-0.2, -0.2, foot - 0.28), Q(p, 0, foot + p / Math.SQRT2), Q(0, p, foot + p / Math.SQRT2), Q(p, p, foot + p * Math.SQRT2),
      Q(0, 0, foot),
    ]));
  }
}

// ---------- Vensters als blinde nissen ----------
const DEPTH = 0.35;
const nicheCuts = [];
function niche(f, s0, s1, lo, hi) {
  const P = (s, depth, h) => [f.a[0] + f.d[0] * s - f.n[0] * depth, f.a[1] + f.d[1] * s - f.n[1] * depth, h];
  nicheCuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
}
// Lange gevels: 18 vensters van 1,1 m per laag over de hele breedte (foto 2020). Korte gevels: een venster
// van 1,1 m op 2,0 m van de noordnoordwestelijke (westzuidwest) of zuidzuidoostelijke hoek (oostnoordoost,
// puntsymmetrisch aangenomen) en een driedelig venster van 3,6 m rond 11,5 m (foto 2020).
const WIN = 1.1;
for (let k = 0; k < FLOORS; k++) {
  const lo = floorZ(k) + SILL, hi = floorZ(k) + HEAD - DEPTH;
  for (const f of FACES) {
    if (f.L > 25) {
      const pitch = f.L / 18;
      for (let j = 0; j < 18; j++) niche(f, pitch * (j + 0.5) - WIN / 2, pitch * (j + 0.5) + WIN / 2, lo, hi);
    } else {
      niche(f, 2.0, 2.0 + WIN, lo, hi);
      niche(f, 11.5 - 1.8, 11.5 + 1.8, lo, hi);
    }
  }
}

// Plint: begane grond met deuren en ramen van 2,4 m op 3,6 m (geschat), niet aan de zuidzuidoostkant waar
// het verhoogde binnenhof tegen de toren ligt.
const plinthCuts = [];
{
  const [q0, q1, q2, q3] = PLINTH;
  for (const [a, b] of [[q1, q2], [q2, q3], [q3, q0]]) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const pitch = 3.6, bays = Math.floor((L - 1.8) / pitch), w = (L - bays * pitch) / 2;
    const lo = 0.3, hi = z(PLINTH_TOP) - 0.6 - DEPTH;
    for (let j = 0; j < bays; j++) {
      const s0 = w + j * pitch + (pitch - 2.4) / 2;
      const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
      plinthCuts.push(Manifold.hull([P(s0, -0.2, lo), P(s0 + 2.4, -0.2, lo), P(s0, DEPTH, lo), P(s0 + 2.4, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s0 + 2.4, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s0 + 2.4, DEPTH, hi)]));
    }
  }
}

// ---------- Dakinstallaties (AHN-DSM 0,5 m) ----------
const r0 = z(ROOF) - 0.1;
const roofParts = [
  // Installatieframe: twee lange kokers van 2 m breed met korte poten naar binnen aan beide einden.
  prism(rect(-10.75, -8.0, 10.25, -5.75), r0, z(FRAME_TOP)),
  prism(rect(-10.5, -5.85, -9.0, -4.25), r0, z(FRAME_TOP)),
  prism(rect(9.0, -5.85, 10.5, -4.25), r0, z(FRAME_TOP)),
  prism(rect(-10.25, 6.25, 10.25, 8.25), r0, z(FRAME_TOP)),
  prism(rect(-10.5, 4.25, -9.0, 6.35), r0, z(FRAME_TOP)),
  prism(rect(9.0, 4.25, 10.5, 6.35), r0, z(FRAME_TOP)),
  // Lage leidingkokers in de lengte en één dwars aan de oostkant.
  prism(rect(-14.5, -4.75, 13.75, -3.75), r0, z(DUCT_TOP)),
  prism(rect(-14.5, 3.75, 14.0, 4.75), r0, z(DUCT_TOP)),
  prism(rect(10.75, -3.85, 11.75, 3.85), r0, z(DUCT_TOP)),
  // Kasten in het midden.
  prism(rect(3.25, -2.75, 7.0, 2.75), r0, z(PLANT_HIGH)),
  prism(rect(0.75, -1.75, 3.35, 1.25), r0, z(PLANT_LOW)),
  prism(rect(6.9, 0.25, 8.75, 1.75), r0, z(PLANT_LOW)),
];

const tower = union([prism(CORE, BASE, z(ROOF)), ...bands, ...roofParts])
  .subtract(union(nicheCuts));
const plinth = prism(PLINTH, BASE, z(PLINTH_TOP))
  .subtract(prism(CORE, BASE - 1, z(PLINTH_TOP) + 1))
  .subtract(union(plinthCuts));

const nodes = [["building:the-rock-utrecht-toren", tower], ["building:the-rock-utrecht-plint", plinth]].map(([name, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [name, m];
});
console.log("bandstukken", bands.length, "vensternissen", nicheCuts.length, "plintnissen", plinthCuts.length, "laaghoogte", STOREY.toFixed(3));

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "The Rock Utrecht",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 45.17, // NAP-maaiveld + 43,45 (geoïde NLGEO2018 43,37 zoals bij De Hoogt, geijkt op De Hoogt: 44,81 bij NAP 1,36)
    groundOffsetMetres: -0.15,
    // Straatniveau ten westen en noordwesten van de toren; niet op het verhoogde binnenhof (NAP 5,6) aan de zuidoostkant.
    groundSamplePoints: [[-19, 8], [-19, -4], [-19, -14], [-22, 15]],
    replacesBuildings: ["NL.IMBAG.Pand.0344100000146591"],
    description:
      "Studententoren The Rock (2020, LIAG Architecten) aan het Van Heuven Goedhartplein in Kanaleneiland: een rechthoekige toren van 33,3 × 23,0 m (BAG-contour, buitenrand van de gevelbanden) tot NAP +73,95 m op een gemetselde plint tot +5,6 m (de hoogte van het verhoogde binnenhof ernaast), met 22 woonlagen van 3,04 m. Per laag steekt onder de vensters een witte band 0,35 tot 1,0 m uit de vensterwand, met een onderkant onder 45°; de uitsprong golft rond de toren en verschuift per laag. Op de lange gevels achttien vensters per laag, op de korte gevels een enkel venster bij de hoek en een breed driedelig venster in het midden, als blinde nissen. Op het dak een installatieframe tot +77,05 m, lage leidingkokers tot +75,2 m en kasten tot +76,3 m. Hoogtes uit het AHN-DSM en de 3D BAG (AHN5). Oorsprong in het hart van de BAG-contour, X-as langs de lange gevels (29,55° op RD-oost). Het golfpatroon, de laaghoogte, de vensterwand 1,0 m achter de BAG-contour, de plint met haar nissen en de indeling van de oostnoordoostgevel (puntsymmetrisch aangenomen) zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      plinthNapM: PLINTH_TOP,
      roofNapM: ROOF,
      frameNapM: FRAME_TOP,
      plantNapM: PLANT_HIGH,
      planM: [+(2 * HU).toFixed(2), +(2 * HV).toFixed(2)],
      floors: { plinth: 1, residential: FLOORS },
      storeyHeightM: +STOREY.toFixed(3),
      bandProjectionM: [+(P_MID - P_AMP).toFixed(2), +(P_MID + P_AMP).toFixed(2)],
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0344100000146591 (bouwjaar 2020), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG (LoD2.2, AHN5 2023)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Utrecht_(stad)",
      "https://www.duic.nl/algemeen/studenten-nemen-intrek-in-nieuwe-woontoren-de-rock-in-kanaleneiland/",
      "https://commons.wikimedia.org/wiki/File:Woontoren_The_Rock.jpg",
      "https://commons.wikimedia.org/wiki/File:Up_Living_woontoren_in_Utrecht.jpg",
      "https://commons.wikimedia.org/wiki/File:Panta_Rhei_-_Flickr_-_Rob_Oo.jpg",
    ],
  },
});

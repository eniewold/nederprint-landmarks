// Hondsrugtoren (Weerdingerstraat, Emmen, 2021, Attika Architekten): woontoren van 17 lagen op de hoek van
// de Weerdingerstraat en de Hondsrugweg, het hoogste gebouw van Drenthe. Een rechthoekige toren met twee
// lagere vleugels aan de west- en oostkant die in twee stappen naar de zuidhoeken aflopen (dakterrassen op
// +46 m, loggia's in de twee lagen daarboven), een blinde kern met reliëfpanelen die aan de noord- en
// zuidgevel uitsteekt, balkonstapels op de hoeken, een installatieopbouw op het dak en een bakstenen
// plint van twee lagen met een lage uitbouw van één laag aan de zuid- en westkant.
// Contour uit de BAG, hoogtes uit het AHN-DSM (AHN4, 2022, na de oplevering) en de 3D BAG, gevelindeling
// uit foto's.
import { Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "hondsrugtoren";
// Gebouwstelsel: u langs de lange gevels naar het oosten (4,9° op RD-oost, BAG-randen evenwijdig binnen
// 0,1°), v langs de korte gevels naar het noorden. Oorsprong in de hoofdmassa, 3 m ten westen van de kern.
const ORIGIN = [256503.0, 534525.0];
const ANGLE = 4.9;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 22.3; // NAP, AHN-DTM rondom (22,2–22,4; 3D BAG-maaiveld 22,27)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM (medianen binnen elk bouwdeel) ----------
const ROOF = 79.6; // hoofdmassa en de uitstekende kern (79,45–79,73; 3D BAG 70e percentiel 79,62)
const BOX = 82.3; // installatieopbouw en de rug over de noordkern (82,24–82,38)
const LIFT = 83.4; // liftopbouw op de installatieopbouw (DSM 83,2–83,6)
const WING_HIGH = 75.45; // vleugels boven de loggialagen (75,42 en 75,47)
const WING_LOW = 68.4; // dakterrassen op de zuidhoeken van de vleugels (68,33 en 68,50)
const CORNER_STACK = 64.8; // balkonstapels op de zuidhoeken (64,74 en 64,85)
const SIDE_STACK = 55.0; // balkonstapels aan de west- en oostgevel (54,4–55,2)
const PLINTH = 26.77; // lage uitbouw aan de zuid- en westkant (3D BAG 26,73–26,79)
const ENTRY = 30.22; // hogere strook van de uitbouw voor de zuidkern (3D BAG 30,20–30,26)

// ---------- Plattegronden (u, v), BAG-contour en DSM-randen ----------
const S0 = -4.1; // zuidgevel van de toren (BAG 3,89 m, de bovenbouw tot 0,2 m verder in het DSM)
const N0 = 10.92; // noordgevel
const W0 = -10.53; // westgevel
const E0 = 16.96; // oostgevel
const WU = -5.75; // grens westvleugel en hoofdmassa (DSM)
const EU = 12.75; // grens oostvleugel en hoofdmassa (DSM)
const STEP = -0.7; // grens dakterras en loggialagen in beide vleugels (DSM)
const EAST_HIGH = 3.25; // noordrand van de lage oostvleugel (DSM)
const MAIN = [[WU, S0], [EU, S0], [EU, EAST_HIGH], [E0, EAST_HIGH], [E0, N0], [WU, N0]];
const WEST_HIGH = rect(W0, STEP, WU, N0);
const WEST_LOW = rect(W0, S0, WU, STEP);
const EAST_HIGH_POLY = rect(EU, STEP, E0, EAST_HIGH);
const EAST_LOW = rect(EU, S0, E0, STEP);
const CORE_N = rect(0.9, N0 - 0.1, 5.52, 13.7); // uitstekende kern aan de noordgevel (BAG)
const CORE_S = rect(1.25, -5.85, 5.3, S0 + 0.1); // uitstekende kern aan de zuidgevel (DSM)
const BOX_POLY = rect(-2.25, -0.3, 9.6, 6.75);
const SPINE = rect(1.25, 6.6, 2.75, 11.75); // rug van 1,5 m over de noordkern, op de hoogte van de opbouw
const LIFT_POLY = rect(2.75, 1.0, 5.25, 5.0);
const PLINTH_POLY = [[-14.32, -9.06], [8.93, -9.06], [8.93, S0 + 0.1], [W0 + 0.1, S0 + 0.1], [W0 + 0.1, 3.25], [-14.32, 3.25]];
const ENTRY_POLY = rect(0.75, -9.06, 5.75, -5.75);

// ---------- Lagen ----------
// Begane grond 4,45 m (gelijk met het dak van de uitbouw), daarboven 16 lagen van 3,2 m: de vleugels houden
// na 13 lagen op (dakterras +46,05 m boven maaiveld = NAP 68,35) of na 15 lagen (+52,45 m, dak 53,15), de
// hoofdmassa na 16 lagen (+55,65 m) met een dakrand tot 57,3 m.
const STOREY = 3.2;
const FLOORS = [[0, 4.45], ...Array.from({ length: 16 }, (_, k) => [4.45 + STOREY * k, STOREY])];
const LOGGIA_FLOORS = [14, 15];

// ---------- Balkonstapels ----------
// [rand als twee punten (buitenkant links bij kijken vanaf buiten), van s, tot s, uitsteek, bovenkant (NAP)]
// Balkons per laag vanaf de eerste verdieping; de stapel staat op een kraag onder 45° (op de zuidwesthoek
// op het dak van de uitbouw).
const STACKS = [
  { name: "zuidwest", a: [W0, S0], b: [WU, S0], s0: 0.15, s1: 5.05, out: 2.1, top: CORNER_STACK, onPlinth: true },
  { name: "zuidoost", a: [EU, S0], b: [E0, S0], s0: -0.15, s1: 4.2, out: 2.1, top: CORNER_STACK },
  { name: "west", a: [W0, N0], b: [W0, S0], s0: 0.3, s1: 3.8, out: 1.9, top: SIDE_STACK },
  { name: "oost", a: [E0, S0], b: [E0, N0], s0: 11.05, s1: 14.6, out: 2.3, top: SIDE_STACK },
];
// Rand a→b linksom rond het gebouw, met de buitennormaal n rechts ervan; P(s, t) ligt t buiten de gevel.
const frame = (a, b) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, P: (s, t) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t] };
};
const stackBodies = [], stackCuts = [];
for (const { a, b, s0, s1, out, top, onPlinth } of STACKS) {
  const { P } = frame(a, b);
  const zt = z(top), zb = FLOORS[1][0];
  stackBodies.push(Manifold.hull([
    ...[s0, s1].flatMap((s) => [
      [...P(s, -0.1), zt], [...P(s, out), zt],
      ...(onPlinth ? [[...P(s, -0.1), z(PLINTH) - 0.1], [...P(s, out), z(PLINTH) - 0.1]] : [[...P(s, -0.1), zb - out], [...P(s, out), zb]]),
    ]),
  ]));
  // Open balkon per laag: 1,2 m diep, borstwering 1,0 m, plafond onder 45° naar buiten.
  for (const [zf, fh] of FLOORS.slice(1)) {
    const lo = zf + 1.0, hi = zf + fh - 0.3 - 1.2;
    if (zf + fh > zt - 0.25) continue;
    stackCuts.push(Manifold.hull([
      ...[s0 + 0.9, s1 - 0.9].flatMap((s) => [[...P(s, out + 0.2), lo], [...P(s, out - 1.2), lo], [...P(s, out + 0.2), hi + 1.2 + 0.2], [...P(s, out - 1.2), hi]]),
    ]));
  }
}

const body = union([
  prism(MAIN, BASE, z(ROOF)),
  prism(WEST_HIGH, BASE, z(WING_HIGH)),
  prism(WEST_LOW, BASE, z(WING_LOW)),
  prism(EAST_HIGH_POLY, BASE, z(WING_HIGH)),
  prism(EAST_LOW, BASE, z(WING_LOW)),
  prism(CORE_N, BASE, z(ROOF)),
  prism(CORE_S, BASE, z(ROOF)),
  prism(BOX_POLY, z(ROOF) - 0.1, z(BOX)),
  prism(SPINE, z(ROOF) - 0.1, z(BOX)),
  prism(LIFT_POLY, z(BOX) - 0.1, z(LIFT)),
  prism(PLINTH_POLY, BASE, z(PLINTH)),
  prism(ENTRY_POLY, BASE, z(ENTRY)),
  ...stackBodies,
]);

// ---------- Gevelreliëf ----------
// Vensters per laag in paren (twee ramen in één kader) als blinde nissen van 2,2 m breed op een travee van
// 3,1 m, 0,35 m diep met een plafond onder 45°; begane grond als winkelpui van 0,4 m tot onder de eerste
// verdieping. Loggia's in de twee bovenste lagen van de vleugels: 2,6 m breed op 3,5 m, 1,2 m diep.
// Alleen waar de gevel op die hoogte buitengevel is (niet achter balkonstapels, uitbouw of kernen).
// De kernen blijven blind (reliëfpanelen kleiner dan 0,9 m).
const cuts = [...stackCuts];
function facade(poly, floors, style = () => "window") {
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    const { L, P } = frame(a, b);
    if (L < 3.5) return;
    const at = (s, t, h) => [...P(s, t), h];
    for (const k of floors) {
      const [zf, fh] = FLOORS[k];
      const loggia = style(k) === "loggia";
      const depth = loggia ? 1.2 : 0.35;
      const width = loggia ? 2.6 : 2.2, pitch = loggia ? 3.5 : 3.1;
      const lo = k === 0 ? 0.4 : zf + (loggia ? 1.0 : 0.9);
      const hi = zf + fh - 0.35 - depth;
      const bays = Math.floor((L - 0.9) / pitch), w = (L - bays * pitch) / 2;
      for (let j = 0; j < bays; j++) {
        const s0 = w + j * pitch + (pitch - width) / 2, s1 = s0 + width;
        const exposed = [s0 - 0.05, (s0 + s1) / 2, s1 + 0.05].every((s) => [lo + 0.05, hi + depth - 0.05].every((h) => {
          const from = at(s, 3, h), hit = body.rayCast(from, at(s, -1, h))[0];
          const dist = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
          return dist > 2.95 && dist < 3.05;
        }));
        if (exposed) cuts.push(Manifold.hull([at(s0, 0.2, lo), at(s1, 0.2, lo), at(s0, -depth, lo), at(s1, -depth, lo), at(s0, 0.2, hi + depth + 0.2), at(s1, 0.2, hi + depth + 0.2), at(s0, -depth, hi), at(s1, -depth, hi)]));
      }
    }
  });
}
const ALL = FLOORS.map((_, k) => k);
// Randen linksom, zodat n = [d1, -d0] in frame() naar buiten wijst.
facade(ccw(MAIN), ALL);
for (const wing of [WEST_HIGH, EAST_HIGH_POLY]) facade(ccw(wing), ALL.slice(0, 16), (k) => (LOGGIA_FLOORS.includes(k) ? "loggia" : "window"));
for (const wing of [WEST_LOW, EAST_LOW]) facade(ccw(wing), ALL.slice(0, 14));
facade(ccw(PLINTH_POLY), [0]);

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Hondsrugtoren: ${parts.length} losse delen`);
console.log("Hondsrugtoren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "uitsparingen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:hondsrugtoren-toren", building]],
  catalog: {
    name: "Hondsrugtoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 64.15, // NAP 22,3 + 41,85 (NLGEO2018-geoïde in Emmen 41,89; Groningen en Zwolle liggen 0,05–0,1 m onder de geoïde)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0114100000405358"],
    description:
      "Hondsrugtoren aan de Weerdingerstraat in Emmen (2021): hoofdmassa van 18,5 × 15 m tot NAP +79,6 m met een installatieopbouw tot +82,3 m en een liftopbouw tot +83,4 m; aan de west- en oostkant vleugels van 4,2 tot 4,8 m breed tot +75,45 m die op de zuidhoeken tot +68,4 m aflopen (dakterrassen), met loggia's in de twee lagen onder het vleugeldak; een blinde kern die 2,8 m uit de noordgevel en 1,75 m uit de zuidgevel steekt, met een rug van 1,5 m tot +82,3 m over de noordkern; vier balkonstapels (zuidhoeken tot +64,8 m, west- en oostgevel tot +55,0 m) met per laag een open balkon; een vensterraster per laag en een winkelpui op de begane grond; de lage uitbouw aan de zuid- en westkant tot +26,77 m met een strook tot +30,22 m voor de zuidkern. Contour uit de BAG, hoogtes uit het AHN-DSM (AHN4, 2022, na de oplevering) en de 3D BAG. Oorsprong in de hoofdmassa, X-as langs de lange gevels (4,9° op RD-oost). Verdiepingshoogte (begane grond 4,45 m, daarboven 3,2 m), vensterraster, loggiadiepte, balkondiepte en de onderkant van de balkonstapels zijn geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      installationNapM: BOX,
      liftNapM: LIFT,
      wingNapM: [WING_HIGH, WING_LOW],
      balconyStackNapM: { corners: CORNER_STACK, sides: SIDE_STACK },
      plinthNapM: [PLINTH, ENTRY],
      floors: 17,
      groundFloorHeightM: 4.45,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      heightAboveGroundM: +(LIFT - GROUND).toFixed(2),
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0114100000405358 (bouwjaar 2021), actuele orthoHR, AHN-DSM en -DTM 0,5 m (AHN4, opname 2022), 3D BAG LoD2.2 (https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0114100000405358, TU Delft/3DGI, CC BY 4.0)",
      "https://nl.wikipedia.org/wiki/Hondsrugtoren",
      "https://commons.wikimedia.org/wiki/File:Hondsrugtoren_Emmen_2021.jpg",
      "https://commons.wikimedia.org/wiki/File:Hondsrugtoren.jpg",
      "NLGEO2018-geoïde (data/geoid in de webshop) voor groundHeight",
    ],
  },
});

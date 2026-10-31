// De Generaal (Rijswijk, 1966, Jan Lucas van Lucas & Niemeijer; transformatie 2016–2021 door Mei architecten):
// voormalig CRM-gebouw en belastingkantoor aan de Generaal Spoorlaan / Prinses Ariane Promenade, het eerste
// jackblockgebouw van Nederland, nu een woontoren van circa 200 appartementen. De oude gevel is gesloopt en de
// vloeren zijn tot de kelderrand verlengd; de nieuwe gevel is glas van vloer tot plafond tussen witte vloerranden.
// Op de korte gevels hangen stapels balkons in een verspringend patroon (onder drie, in het midden vier, boven
// twee brede), in de lange gevels zit midden een strook loggia's, en de bovenste laag springt midden in de lange
// gevels terug voor een dakterras. Op het dak een stalen bordes rond een installatieplatform met leidingkokers.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023), gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "de-generaal-rijswijk";
// Gebouwstelsel: u langs de lange gevels naar het oostnoordoosten (30,8° op RD-oost: gemiddelde van de lange
// BAG-randen 31,2° en 30,4°; de korte randen staan op 120,4°), v naar het noordnoordwesten. Oorsprong in het hart
// van de toren (BAG-contour zonder de balkonstroken).
const ORIGIN = [81393.98, 450609.92];
const ANGLE = 30.8;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.5; // NAP, maaiveld (3D BAG 0,52; AHN-DTM rondom 0,29–0,59)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 ----------
const ROOF = 63.28; // hoofddak (dakvlak van 1218 m², 63,27–63,30)
const FRAME = 65.53; // stalen bordes rond het installatieplatform (65,51–65,57)
const PLATFORM = 63.67; // installatieplatform binnen het bordes (63,63–63,71)
const PLANT = 65.9; // installatiekast op het oostelijke deel van het bordes (65,90–65,91)
// Balkonvloeren: bovenste laag en dakterras op +59,5 (59,45–59,56), bovenkant van de middelste balkonstapel op de
// korte gevels op +22,1 (21,98–22,46); daartussen elf lagen, dus 3,4 m per laag en de eerste verdieping op +5,1.
const STOREY = 3.4;
const F1 = 5.1;
const floorNap = (n) => F1 + (n - 1) * STOREY; // vloer van laag n (1 = eerste verdieping, 17 = bovenste laag)
const TOP = 17;

// ---------- Plattegrond in (u, v), BAG-contour ----------
// Toren 46,56 × 29,3 m (BAG-randen binnen 0,3 m recht gemaakt); op de korte gevels de balkonstroken van 2,52 m
// diep en 26,8 m breed (BAG 26,4–26,8).
const HU = 23.28, HV = 14.65;
const STRIP_OUT = 25.8, STRIP_HV = 13.4;
const OUT = STRIP_OUT - HU; // uitsteek van de balkons

// ---------- Dakopbouw, 3D BAG ----------
const FRAME_OUT = rect(-12.7, -6.5, 13.7, 6.85);
const FRAME_IN = rect(-10.1, -3.7, 9.4, 3.9);
const PLANT_BOX = rect(9.2, -3.6, 12.6, 3.8);
// Leidingkokers en kasten op het dak, [poly, bovenkant NAP] (3D BAG-dakvlakken 254, 271, 275, 265, 262, 263, 277).
const DUCTS = [
  [[[-22.7, 4.8], [-21.0, 4.8], [-21.0, 10.4], [-17.9, 10.4], [-17.9, 11.75], [-22.7, 11.75]], 64.06],
  [rect(-8.3, 10.4, 9.07, 11.75), 64.04],
  [[[-14.45, 7.2], [-10.1, 6.6], [-8.2, 6.6], [-8.2, 9.7], [-10.4, 8.95], [-14.45, 8.4]], 64.4],
  [rect(-16.0, -7.5, -11.0, -5.85), 64.33],
  [rect(0.82, 1.38, 6.41, 3.35), 64.3],
  [rect(3.53, -3.48, 6.66, -1.27), 64.25],
  [rect(9.15, -8.27, 13.34, -6.0), 64.4],
];

// ---------- Balkonstapels op de korte gevels (foto's van Mei architecten, 3D BAG) ----------
// [v0, v1, eerste laag, laatste laag]: onder twee buitenste stapels en een brede middelste (lagen 1–6), daarboven
// tot laag 10 de buitenste en twee binnenste, en vanaf laag 11 twee brede blokken tot de bovenste laag met
// daartussen een glazen middenstrook van 6,2 m. Beide korte gevels hebben hetzelfde patroon (3D BAG).
const STACKS = [
  [8.8, STRIP_HV, 1, 10], [-STRIP_HV, -8.8, 1, 10],
  [-4.9, 4.9, 1, 6],
  [2.6, 7.7, 7, 10], [-7.7, -2.6, 7, 10],
  [3.1, STRIP_HV, 11, TOP], [-STRIP_HV, -3.1, 11, TOP],
];
const SLAB = 0.4; // onderkant balkonplaat onder de vloer
const BAND = 0.5; // dichte rand boven de vloer (plaat plus onderkant van de glazen borstwering, samen 0,9 m)
const OPEN_DEPTH = 1.5; // diepte van een open balkon, plafond onder 45°

// ---------- Loggia's, dakterras, plint ----------
const LOGGIA = 3.1; // halve breedte van de loggiastrook midden in de lange gevels (foto: 6,2 m)
const TERRACE_HU = 6.9, TERRACE_DEPTH = 2.7; // terugsprong van de bovenste laag (3D BAG 252, 253, 270)
const ARCADE_DEPTH = 1.5, ARCADE_TOP = z(F1) - 0.9; // plint onder de lange gevels achter kolommen
const COLUMNS = 8; // kolommen per lange gevel, 0,9 m (in het echt rond, circa 0,4 m)

// ---------- Massa ----------
const body = prism(rect(-HU, -HV, HU, HV), BASE, z(ROOF));
const stacks = [], openings = [];
for (const side of [1, -1]) {
  // Punt op de korte gevel: diepte d buiten de gevel (u = side·(HU + d)).
  const P = (d, v, h) => [side * (HU + d), v, h];
  for (const [v0, v1, n0, n1] of STACKS) {
    const bottom = z(floorNap(n0)) - SLAB, top = z(floorNap(n1)) + BAND;
    // Blok van 0,5 m in de gevel tot de buitenrand, met een kraag onder 45° naar de gevel.
    stacks.push(Manifold.hull([v0, v1].flatMap((v) => [P(-0.5, v, top), P(OUT, v, top), P(OUT, v, bottom), P(-0.5, v, bottom - OUT - 0.5)])));
    for (let n = n0; n < n1; n++) {
      const lo = z(floorNap(n)) + BAND, ceil = z(floorNap(n + 1)) - SLAB;
      const a = v0 - 0.2, b = v1 + 0.2;
      openings.push(Manifold.hull([a, b].flatMap((v) => [P(OUT + 0.2, v, lo), P(OUT - OPEN_DEPTH, v, lo), P(OUT + 0.2, v, ceil + 0.2), P(OUT - OPEN_DEPTH, v, ceil - OPEN_DEPTH)])));
    }
  }
}
const roofParts = [
  prism(FRAME_OUT, z(ROOF) - 0.1, z(FRAME)).subtract(prism(FRAME_IN, z(ROOF), z(FRAME) + 1)),
  prism(FRAME_IN, z(ROOF) - 0.1, z(PLATFORM)),
  prism(PLANT_BOX, z(FRAME) - 0.1, z(PLANT)),
  ...DUCTS.map(([poly, top]) => prism(poly, z(ROOF) - 0.1, z(top))),
];
const massing = union([body, ...stacks]);

// ---------- Gevelreliëf ----------
// Per laag een glasband als blinde nis van 0,35 m met een plafond onder 45°, tussen witte vloerranden van 0,9 m.
const DEPTH = 0.35;
const FLOORS = [[0, z(F1), 0.3], ...Array.from({ length: TOP }, (_, k) => [z(floorNap(k + 1)), k + 1 < TOP ? STOREY : z(ROOF) - z(floorNap(TOP)), 0.25])];
const cuts = [...openings];
// Nis langs de rand a→b (gevel links van de looprichting is binnen) van s0 tot s1.
function niche(a, b, s0, s1, lo, hi, depth = DEPTH) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  return Manifold.hull([s0, s1].flatMap((s) => [P(s, -0.2, lo), P(s, depth, lo), P(s, -0.2, hi + depth + 0.2), P(s, depth, hi)]));
}
const nicheRange = ([zf, fh, sill]) => [zf + sill, zf + fh - 0.65 - DEPTH];
// Lange gevels (v = ±HV, gevel naar buiten): links en rechts van de loggiastrook, met penanten van 0,9 m.
for (const side of [1, -1]) {
  const a = [side * HU, side * HV], b = [-side * HU, side * HV]; // linksom, binnen ligt links
  const s = (u) => HU - side * u; // afstand langs a→b
  FLOORS.forEach((floor, k) => {
    const [lo, hi] = nicheRange(floor);
    if (k === 0) return; // plint: arcade, zie hieronder
    const segs = k === TOP ? [[-HU + 0.9, -TERRACE_HU - 0.9], [TERRACE_HU + 0.9, HU - 0.9]] : [[-HU + 0.9, -LOGGIA - 0.9], [LOGGIA + 0.9, HU - 0.9]];
    for (const [u0, u1] of segs) cuts.push(niche(a, b, Math.min(s(u0), s(u1)), Math.max(s(u0), s(u1)), lo, hi));
    if (k === TOP) {
      const v = side * (HV - TERRACE_DEPTH);
      const a2 = [side * TERRACE_HU, v], b2 = [-side * TERRACE_HU, v];
      cuts.push(niche(a2, b2, 0.9, 2 * TERRACE_HU - 0.9, lo, hi));
    }
  });
  // Loggia's: per laag 1–16 een open loggia van 1,5 m diep met een plafond onder 45°.
  for (let n = 1; n < TOP; n++) {
    const lo = z(floorNap(n)) + BAND, ceil = z(floorNap(n + 1)) - SLAB;
    cuts.push(Manifold.hull([-LOGGIA, LOGGIA].flatMap((u) => [[u, side * (HV + 0.2), lo], [u, side * (HV - OPEN_DEPTH), lo], [u, side * (HV + 0.2), ceil + 0.2], [u, side * (HV - OPEN_DEPTH), ceil - OPEN_DEPTH]])));
  }
  // Dakterras van de bovenste laag midden in de lange gevel.
  cuts.push(prism(rect(-TERRACE_HU, side > 0 ? HV - TERRACE_DEPTH : -HV - 1, TERRACE_HU, side > 0 ? HV + 1 : -HV + TERRACE_DEPTH), z(floorNap(TOP)), z(ROOF) + 1));
  // Plint: winkels 1,5 m terug achter een rij kolommen, onder een donkere vloerrand.
  cuts.push(prism(rect(-HU + 0.6, side > 0 ? HV - ARCADE_DEPTH : -HV - 1, HU - 0.6, side > 0 ? HV + 1 : -HV + ARCADE_DEPTH), 0, ARCADE_TOP));
}
// Korte gevels: alleen waar de gevel buitengevel is (niet achter of onder een balkonstapel), per halve meter getest.
for (const side of [1, -1]) {
  const a = [side * HU, -side * HV], b = [side * HU, side * HV];
  const L = 2 * HV;
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const at = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  for (const floor of FLOORS) {
    const [lo, hi] = nicheRange(floor);
    let start = null;
    const flush = (s1) => {
      if (start !== null && s1 - start >= 1.4) cuts.push(niche(a, b, start + 0.25, s1 - 0.25, lo, hi));
      start = null;
    };
    for (let s = 0.9; s <= L - 0.9 + 1e-6; s += 0.5) {
      const ok = [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = at(s, -4, h), hit = massing.rayCast(from, at(s, 1, h))[0];
        const dist = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return dist > 3.95 && dist < 4.05;
      });
      if (ok && start === null) start = s;
      if (!ok) flush(s - 0.5);
    }
    flush(L - 0.9);
  }
}
const columns = [];
for (const side of [1, -1]) {
  for (let k = 0; k < COLUMNS; k++) {
    const u = -HU + 0.45 + (k * (2 * HU - 0.9)) / (COLUMNS - 1);
    const v = side * (HV - 0.45);
    columns.push(prism(rect(u - 0.45, v - 0.45, u + 0.45, v + 0.45), -0.1, ARCADE_TOP + 0.1));
  }
}

const tower = union([massing.subtract(union(cuts)), ...columns, ...roofParts]);
const parts = tower.decompose();
if (parts.length !== 1) throw new Error(`De Generaal: ${parts.length} losse delen`);
console.log("De Generaal", tower.status(), "genus", tower.genus(), "driehoeken", tower.numTri(), "uitsparingen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:de-generaal-rijswijk-toren", tower]],
  catalog: {
    name: "De Generaal",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.9, // NAP-maaiveld + 43,4 (Rijswijk, ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0603100000005789"],
    description:
      "De Generaal aan de Generaal Spoorlaan / Prinses Ariane Promenade in Rijswijk (1966, getransformeerd tot woontoren 2016–2021): toren van 46,6 × 29,3 m op de BAG-contour tot NAP +63,28 m met per laag een glasband tussen witte vloerranden (17 lagen van 3,4 m boven een plint van 4,6 m), midden in de lange gevels een strook loggia's en een dakterras op +59,5 m in de bovenste laag, op de korte gevels 2,5 m diepe balkonstapels in het verspringende patroon van de foto's (onder drie, in het midden vier, boven twee brede blokken tot +59,5 m), een plint achter kolommen langs de lange gevels, en op het dak een stalen bordes tot +65,53 m rond een installatieplatform met een kast tot +65,9 m en leidingkokers. Hoogtes uit de 3D BAG (AHN5 2023); het AHN4-DSM is opgenomen tijdens de verbouwing en toont een bouwkraan tot +86 m. Oorsprong in het hart van de toren, X-as langs de lange gevels (30,8° op RD-oost). Verdiepingshoogte uit de balkonhoogtes afgeleid; balkonbreedtes, loggiadiepte, plintdiepte en kolomafstand geschat uit foto's.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      frameNapM: FRAME,
      platformNapM: PLATFORM,
      plantNapM: PLANT,
      topFloorTerraceNapM: floorNap(TOP),
      firstFloorNapM: F1,
      storeyHeightM: STOREY,
      floorsAboveGround: TOP + 1,
      towerM: [2 * HU, 2 * HV],
      balconyDepthM: +OUT.toFixed(2),
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0603100000005789 (bouwjaar 1968), 3D BAG LoD2.2 (AHN5 2023), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://nl.wikipedia.org/wiki/De_Generaal_(gebouw)",
      "https://mei-arch.eu/en/de-generaal-in-rijswijk-completed/",
      "https://mei-arch.eu/en/generaal-under-construction/",
    ],
  },
});

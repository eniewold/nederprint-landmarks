// Torens Prinses Beatrixlaan 9 en 11 (Beatrixkwartier, Den Haag, 2019): twee woontorens van 22 lagen
// naast de Zilveren Toren, elk op een plattegrond van vier hoeken met één schuine gevel. Witte gevels
// met een raster van vensters en per toren twee stapels balkons die buiten de gevel uitsteken; op het
// dak een installatiekast.
// Contouren uit de BAG, hoogtes en de balkonstapels uit het AHN-DSM, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "beatrixlaan-9-11";
// RD-assen: u naar het oosten, v naar het noorden; oorsprong tussen de twee torens.
const ORIGIN = [82784.0, 455167.0];
const AXIS = [1, 0];
const GROUND = 0.8; // NAP, maaiveld aan de Prinses Beatrixlaan (PDOK-voet 44,13–44,19 ellipsoïdisch)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM ----------
const ROOF = 73.0; // beide torens (mediaan 73,0 binnen de BAG-contour)
const PLANT = 75.0; // installatiekast (74,5–75,5)
const BALCONY_TOP = 70.0; // balkonstapels, tot onder de bovenste laag (DSM 54–64 op de randen; geschat)

// ---------- Plattegronden (BAG) en balkonstapels ----------
// Per toren: contour linksom, installatiekast, en twee balkonstapels als [rand-index, van s, tot s] op
// de randen waar het DSM buiten de gevel balkonranden meet.
const TOWERS = [
  {
    name: "toren-11",
    pand: "0518100001753745",
    ring: [[0.73, 4.35], [18.01, -6.48], [31.23, 14.58], [20.23, 31.0], [18.8, 33.13], [15.54, 27.93]],
    plant: rect(13.0, 9.0, 17.0, 17.0),
    balconies: [[1, 10.0, 19.5], [5, 6.0, 14.0]],
  },
  {
    name: "toren-9",
    pand: "0518100001753747",
    ring: [[-35.67, -0.65], [-25.84, -15.29], [-28.11, -16.82], [-23.48, -23.71], [-21.2, -22.19], [-16.73, -28.85], [0.2, -17.47], [-13.68, 3.18]],
    plant: rect(-22.0, -13.0, -17.0, -9.0),
    balconies: [[6, 11.0, 19.0], [0, 12.0, 17.5]],
  },
];
const STOREY = 3.15;
const FLOORS = [[0, 5.0], ...Array.from({ length: 21 }, (_, k) => [5.0 + STOREY * k, STOREY])];
const DEPTH = 0.35;
const OUT = 1.4; // uitsteek van de balkonstapels

function tower({ ring, plant, balconies }) {
  // Balkonstapel: blok van OUT m buiten de gevel, per laag een open balkon van 0,9 m diep.
  const stacks = [], stackCuts = [];
  for (const [i, s0, s1] of balconies) {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const P = (s, t) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t];
    stacks.push(Manifold.hull([
      ...[s0, s1].flatMap((s) => [[...P(s, -0.1), z(BALCONY_TOP)], [...P(s, OUT), z(BALCONY_TOP)], [...P(s, -0.1), FLOORS[1][0] - OUT], [...P(s, OUT), FLOORS[1][0]]]),
    ]));
    for (const [zf, fh] of FLOORS.slice(1)) {
      const lo = zf + 1.0, hi = zf + fh - 0.3 - 0.9;
      if (zf + fh > z(BALCONY_TOP) + 0.01) continue;
      stackCuts.push(Manifold.hull([
        ...[s0 + 0.9, s1 - 0.9].flatMap((s) => [[...P(s, OUT + 0.2), lo], [...P(s, OUT - 0.9), lo], [...P(s, OUT + 0.2), hi + 0.9 + 0.2], [...P(s, OUT - 0.9), hi]]),
      ]));
    }
  }
  const body = union([prism(ring, BASE, z(ROOF)), prism(plant, z(ROOF) - 0.1, z(PLANT)), ...stacks]);
  // Vensterraster: per laag vensters van 1,5 m op een travee van 2,4 m als blinde nissen met een
  // plafond onder 45°, alleen waar de gevel buitengevel is (niet achter de balkons).
  const cuts = [...stackCuts];
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < 4) return;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    const pitch = 2.4, width = 1.5, bays = Math.floor((L - 0.9) / pitch), w = (L - bays * pitch) / 2;
    for (const [zf, fh] of FLOORS) {
      const lo = zf + 0.9, hi = zf + fh - 0.35 - DEPTH;
      for (let k = 0; k < bays; k++) {
        const s0 = w + k * pitch + (pitch - width) / 2, s1 = s0 + width;
        const exposed = [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
          const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
          const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
          return at > 2.95 && at < 3.05;
        }));
        if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
      }
    }
  });
  return body.subtract(union(cuts));
}

const nodes = TOWERS.map((t) => {
  const m = tower(t);
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${t.name}: ${parts.length} losse delen`);
  console.log(t.name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [`building:beatrixlaan-${t.name}`, m];
});

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Torens Prinses Beatrixlaan 9 en 11",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.2, // PDOK-terrein aan de Prinses Beatrixlaan (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: TOWERS.map((t) => `NL.IMBAG.Pand.${t.pand}`),
    description:
      "Twee woontorens aan de Prinses Beatrixlaan (Beatrixkwartier): beide op hun BAG-contour (vier hoeken met één schuine gevel) tot NAP +73,0 m met een installatiekast tot +75,0 m, een vensterraster per laag en per toren twee balkonstapels die 1,4 m buiten de gevel steken tot +70,0 m, met per laag een open balkon. Hoogtes en de plaats van de balkons uit het AHN-DSM. Oorsprong tussen de torens, X-as naar RD-oost. Verdiepingshoogte, vensterraster en de hoogte van de balkonstapels zijn geschat; de naam komt uit de hoogbouwlijst en is niet nagekeken.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      plantNapM: PLANT,
      balconyTopNapM: BALCONY_TOP,
      balconyDepthM: OUT,
      floors: 22,
      storeyHeightM: STOREY,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0518100001753745 en 0518100001753747 (bouwjaar 2019), actuele orthoHR, AHN-DSM en -DTM 0,5 m, PDOK 3D-gebouwtegels (LoD2.2)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag",
      "https://commons.wikimedia.org/wiki/File:Monarch_III,_Prinses_Beatrixlaan_Den_Haag_(49900924528).jpg",
    ],
  },
});

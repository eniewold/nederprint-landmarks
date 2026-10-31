// Eschertoren (Willem de Zwijgerlaan / Eschertoren, Leiden-Noord, 2000–2002, Patrick Barras & Partners):
// toren van 17 lagen bij de voormalige Groenoordhallen, gebouwd als kantoor en later woningen. Drie
// bouwdelen van verschillende hoogte: een middenblok tot NAP +64,5 m, een lichte vleugel aan de oost-
// en noordkant tot +54,2 m met installaties op het dak en een glazen blok op de zuidwesthoek tot
// +61,2 m. Tussen het glazen blok en de oostvleugel springt de zuidgevel 3 m terug. Aan de westkant
// staat de toren op een sokkel van twee lagen (+9,3 m) met een gebogen gevel langs het plein.
// Het dak is getrapt, niet hellend: de schuine dakvlakken van 66,6° in de 3D BAG (vlakken 116 en 117)
// liggen op de westgevel en zijn de overgang van +54/+64 naar de sokkel, geen echte dakhelling.
// Contour uit de BAG, hoogtes uit de 3D BAG (LoD2.2) en het AHN-DSM, gevelindeling uit luchtfoto's
// van 2021–2026 (de toren helt daarop telkens naar een andere kant, zodat elke gevel te zien is).
import { CrossSection, Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "eschertoren-leiden";
// Gebouwstelsel: u langs de lange zuid- en noordgevels naar het oostzuidoosten (-24,1° op RD-oost;
// BAG-randen -24,02…-24,17°), v naar het noordnoordoosten. Oorsprong in het middenblok.
const ORIGIN = [93912.0, 464908.0];
const ANGLE = -24.1;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = 0.15; // NAP, maaiveld (3D BAG 0,14; AHN-DTM rondom p50 0,19)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 en AHN-DSM ----------
const WING = 54.2; // oost- en noordvleugel (3D BAG 54,18–54,22)
const WING_PARAPET = 55.25; // dakrand (DSM 55,2–55,3)
const MID = 64.5; // middenblok (3D BAG 64,42–64,57)
const MID_PARAPET = 65.55; // dakrand (DSM 65,4–65,6)
const GLASS = 61.15; // glazen zuidwestblok (3D BAG 61,11–61,18)
const GLASS_PARAPET = 62.25; // dakrand (DSM 62,2–62,3)
const PODIUM = 9.25; // sokkel (3D BAG 9,20–9,34)
const FANS = 56.5; // ventilatorblok noordoost (3D BAG 56,49–56,50; DSM 56,4–56,6)
const UNITS = 55.6; // rij koelunits oost (3D BAG 55,34–55,66)
const BOX = 65.9; // kast op het middenblok (DSM 65,8–65,9)

// ---------- Plattegronden in (u, v), BAG-contour en 3D BAG-dakvlakken ----------
// Vleugel tot +54,2: de hele toren behalve het glazen blok, met de sleuf in de oostgevel (1 m diep,
// 5 m breed) en de inham in de noordgevel (1 m).
const WING_POLY = [[6.17, -12.0], [16.13, -12.0], [16.13, -2.07], [15.12, -2.07], [15.12, 3.0], [16.13, 3.0], [16.13, 12.93],
  [6.17, 12.93], [6.17, 11.92], [1.1, 11.92], [1.1, 12.5], [-9.4, 12.5], [-9.4, 3.2], [-8.8, 3.2], [-8.8, -3.7], [-7.1, -3.7],
  [-7.1, -10.41], [6.17, -10.41]];
// Middenblok tot +64,5, vanaf het maaiveld; aan de westkant tussen v = -3,7 en 3,2 tot op de sokkel
// (DSM 65,5 tot u = -8,5), noordwesthoek een trede lager (3D BAG 54,2).
const MID_POLY = [[-7.1, -10.41], [6.9, -10.41], [6.9, -5.4], [9.0, -5.4], [9.0, 5.3], [-1.2, 5.3], [-1.2, 3.2], [-8.8, 3.2], [-8.8, -3.7], [-7.1, -3.7]];
// Glazen blok op de zuidwesthoek tot +61,15.
const GLASS_POLY = rect(-10.2, -13.4, -0.32, -3.7);
// Sokkel: westelijk deel van de BAG-contour met de gebogen gevel langs het plein (straal 24,5 m om
// het plein met het Schapenkunstwerk), loopt 0,6–0,9 m de toren in.
const PODIUM_POLY = [[-8.5, -3.68], [-19.02, -3.68], [-19.01, 0.37], [-19.03, 1.14], [-19.07, 1.9], [-19.13, 2.67], [-19.22, 3.44],
  [-19.32, 4.2], [-19.46, 4.95], [-19.61, 5.71], [-19.79, 6.45], [-19.99, 7.2], [-20.21, 7.93], [-20.45, 8.66], [-20.72, 9.38],
  [-21.01, 10.1], [-21.3, 10.76], [-21.61, 11.41], [-21.94, 12.06], [-22.29, 12.69], [-22.66, 13.32], [-23.05, 13.93],
  [1.06, 15.43], [1.06, 11.6], [-8.6, 11.6]];

// ---------- Massa ----------
const rim = (poly, z0, z1, w = 0.9) => {
  const cs = new CrossSection([ccw(poly)]);
  return Manifold.extrude(cs.subtract(cs.offset(-w, "Miter")), z1 - z0).translate([0, 0, z0]);
};
const towerMass = union([
  prism(WING_POLY, BASE, z(WING)),
  rim(WING_POLY, z(WING) - 0.1, z(WING_PARAPET)),
  prism(MID_POLY, BASE, z(MID)),
  rim(MID_POLY, z(MID) - 0.1, z(MID_PARAPET)),
  prism(GLASS_POLY, BASE, z(GLASS)),
  rim(GLASS_POLY, z(GLASS) - 0.1, z(GLASS_PARAPET)),
  prism(rect(7.97, 7.2, 12.8, 9.8), z(WING) - 0.1, z(FANS)),
  prism(rect(10.1, 0.13, 12.75, 5.07), z(WING) - 0.1, z(UNITS)),
  prism(rect(10.0, -3.56, 12.7, -1.64), z(WING) - 0.1, z(UNITS)),
  prism(rect(3.7, 1.2, 6.7, 2.8), z(MID) - 0.1, z(BOX)),
]);
const podiumMass = prism(PODIUM_POLY, BASE, z(PODIUM));
const all = union([towerMass, podiumMass]); // voor de zichtbaarheidstest van de nissen

// ---------- Gevelreliëf ----------
// Begane grond 4,6 m, daarboven 3,5 m per laag: 14 lagen tot het vleugeldak (+54,2), twee in het
// middenblok en het glazen blok, en een installatielaag zonder vensters onder het dak van het
// middenblok (17 lagen volgens de hoogbouwlijst). Op de luchtfoto's van 2025 zijn op de zuidgevel
// van de vleugel 15 banden te tellen.
const STOREY = 3.5;
const FLOORS = [[0, 4.6], ...Array.from({ length: 16 }, (_, k) => [4.6 + STOREY * k, STOREY])];
const DEPTH = 0.35;
// Nis met plafond onder 45° tussen s0 en s1 langs een polylijn (meerdere segmenten bij de gebogen gevel).
function nicheCut(path, s0, s1, lo, hi) {
  const out = [];
  let acc = 0;
  for (let i = 0; i + 1 < path.length; i++) {
    const a = path[i], b = path[i + 1];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const t0 = Math.max(s0, acc) - acc, t1 = Math.min(s1, acc + L) - acc;
    acc += L;
    if (t1 - t0 < 1e-6) continue;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const e0 = t0 - (t0 > 0 ? 0.05 : 0), e1 = t1 + (t1 < L ? 0.05 : 0);
    const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
    out.push(Manifold.hull([P(e0, -0.2, lo), P(e1, -0.2, lo), P(e0, DEPTH, lo), P(e1, DEPTH, lo),
      P(e0, -0.2, hi + DEPTH + 0.2), P(e1, -0.2, hi + DEPTH + 0.2), P(e0, DEPTH, hi), P(e1, DEPTH, hi)]));
  }
  return out;
}
// Punt op afstand s langs de polylijn met de buitennormaal.
function along(path, s) {
  let acc = 0;
  for (let i = 0; i + 1 < path.length; i++) {
    const a = path[i], b = path[i + 1];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (s <= acc + L + 1e-9 || i + 2 === path.length) {
      const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], t = s - acc;
      return { p: [a[0] + d[0] * t, a[1] + d[1] * t], n: [d[1], -d[0]] };
    }
    acc += L;
  }
}
const pathLength = (path) => path.slice(1).reduce((sum, b, i) => sum + Math.hypot(b[0] - path[i][0], b[1] - path[i][1]), 0);
// Is de gevel op (s, h) buitengevel van het hele gebouw (niet achter de sokkel of een ander bouwdeel)?
function exposed(path, s, h) {
  const { p, n } = along(path, s);
  const from = [p[0] + n[0] * 3, p[1] + n[1] * 3, h], hit = all.rayCast(from, [p[0] - n[0], p[1] - n[1], h])[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
}
const cuts = { tower: [], podium: [] };
// Doorlopende vensterband per laag (lichte vleugels): borstwering 1,0 m, latei 0,4 m.
function ribbons(target, path, floors, { sill = 1.0, head = 0.4 } = {}) {
  const L = pathLength(path);
  for (const [zf, fh] of floors) {
    const lo = zf + sill, hi = zf + fh - head - DEPTH;
    if (hi - lo < 0.9) continue;
    let start = null;
    const flush = (s1) => {
      if (start !== null && s1 - start >= 0.9) cuts[target].push(...nicheCut(path, start, s1, lo, hi));
      start = null;
    };
    for (let s = 0.95; s <= L - 0.95 + 1e-6; s += 0.25) {
      const ok = exposed(path, s, lo + 0.05) && exposed(path, s, hi + DEPTH - 0.05);
      if (ok && start === null) start = s;
      if (!ok) flush(s - 0.25);
    }
    flush(L - 0.95);
  }
}
// Losse vensters op een travee (glazen blok: hoge ruiten tussen stijlen van 0,9 m).
function windows(target, path, floors, { pitch, width, sill, head }) {
  const L = pathLength(path);
  const bays = Math.floor((L - 0.9) / pitch);
  if (bays < 1) return;
  const w0 = (L - bays * pitch) / 2;
  for (const [zf, fh] of floors) {
    const lo = zf + sill, hi = zf + fh - head - DEPTH;
    if (hi - lo < 0.9) continue;
    for (let k = 0; k < bays; k++) {
      const s0 = w0 + k * pitch + (pitch - width) / 2, s1 = s0 + width;
      const ok = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => exposed(path, s, lo + 0.05) && exposed(path, s, hi + DEPTH - 0.05));
      if (ok) cuts[target].push(...nicheCut(path, s0, s1, lo, hi));
    }
  }
}
const edges = (poly) => ccw(poly).map((p, i, q) => [p, q[(i + 1) % q.length]]);
const long = ([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]) > 3;
const atRecess = ([a, b]) => Math.abs(a[1] + 10.41) < 0.01 && Math.abs(b[1] + 10.41) < 0.01;
const GF = FLOORS.slice(0, 1), UPPER = FLOORS.slice(1); // UPPER: lagen 1–16 (tot +60,7)
const shopfront = { pitch: 3.0, width: 2.0, sill: 0.4, head: 0.6 };
// Lichte vleugels en het middenblok: vensterbanden; de begane grond met grote ramen.
for (const e of [...edges(WING_POLY), ...edges(MID_POLY)].filter(long).filter((e) => !atRecess(e))) {
  ribbons("tower", e, UPPER);
  windows("tower", e, GF, shopfront);
}
// Glazen blok: rasters van ruiten van 1,5 m op 2,4 m, hoog (borstwering 0,6 m).
for (const e of edges(GLASS_POLY).filter(long)) windows("tower", e, [...GF, ...UPPER], { pitch: 2.4, width: 1.5, sill: 0.6, head: 0.35 });
// Teruggesprongen middendeel van de zuidgevel: twee kolommen vensters per laag.
const RECESS = [[-0.32, -10.41], [6.17, -10.41]];
for (const [zf, fh] of FLOORS) {
  const lo = zf + (zf === 0 ? 0.4 : 0.8), hi = zf + fh - 0.4 - DEPTH;
  for (const [s0, s1] of [[0.92, 2.92], [3.57, 5.57]]) if (exposed(RECESS, (s0 + s1) / 2, lo + 0.05)) cuts.tower.push(...nicheCut(RECESS, s0, s1, lo, hi));
}
// Sokkel: begane grond met grote ramen, verdieping met een vensterband; de gebogen gevel als één polylijn.
const PODIUM_FLOORS = [[0, 4.6], [4.6, z(PODIUM) - 4.6]];
const CURVE = PODIUM_POLY.slice(1, 22); // van (-19,02, -3,68) tot (-23,05, 13,93)
const PODIUM_SOUTH = [[-8.5, -3.68], [-19.02, -3.68]];
for (const path of [[...CURVE].reverse(), [...PODIUM_SOUTH].reverse()]) {
  // Buitennormaal rechts van de looprichting: de westgevel loopt van noord naar zuid, de zuidgevel van west naar oost.
  windows("podium", path, PODIUM_FLOORS.slice(0, 1), shopfront);
  ribbons("podium", path, PODIUM_FLOORS.slice(1), { sill: 0.9, head: 0.6 });
}

const tower = towerMass.subtract(union(cuts.tower));
const podium = podiumMass.subtract(union(cuts.podium));
const nodes = [["building:eschertoren-leiden-toren", tower], ["building:eschertoren-leiden-sokkel", podium]].map(([name, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [name, m];
});
console.log("nissen", cuts.tower.length, "toren,", cuts.podium.length, "sokkel");

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Eschertoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.6, // NAP-maaiveld + circa 43,45 (Leiden), ellipsoïdisch
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0546100000025644"],
    description:
      "Eschertoren aan de Willem de Zwijgerlaan in Leiden-Noord (2002, 17 lagen): op de BAG-contour een getrapte toren met een middenblok tot NAP +64,5 m, een oost- en noordvleugel tot +54,2 m met een ventilatorblok en een rij koelunits op het dak, een glazen blok op de zuidwesthoek tot +61,15 m en een 3 m teruggesprongen middendeel in de zuidgevel; alle daken met een dakrand van 1 m. Aan de westkant een sokkel van twee lagen tot +9,25 m met een gebogen gevel langs het plein. Hoogtes uit de 3D BAG (LoD2.2, AHN4) en het AHN-DSM; de schuine dakvlakken van 66,6° in de 3D BAG zijn de overgang aan de westgevel en zijn als verticale gevels gebouwd. Oorsprong in het middenblok, X-as langs de zuidgevel (-24,1° op RD-oost). Verdiepingshoogtes, vensterbanden, het ruitenraster van het glazen blok en de sokkelgevel zijn geschat uit luchtfoto's.",
    realWorld: {
      groundNapM: GROUND,
      wingRoofNapM: WING,
      middleRoofNapM: MID,
      glassBlockRoofNapM: GLASS,
      podiumRoofNapM: PODIUM,
      parapetM: 1.05,
      fansNapM: FANS,
      unitsNapM: UNITS,
      floors: 17,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0546100000025644 (bouwjaar 2001), orthoHR 2021–2026, AHN-DSM en -DTM 0,5 m, 3D BAG LoD2.2 (api.3dbag.nl, AHN4 2020)",
      "https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0546100000025644",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Leiden",
      "https://skyscraperpage.com/b9564",
    ],
  },
});

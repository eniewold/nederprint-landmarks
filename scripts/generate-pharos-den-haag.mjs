// Pharos (Loevesteinlaan / Melis Stokelaan, Escamp, Den Haag, 2009, DOK architecten): woontoren van
// 25 lagen met 88 woningen in gele baksteen, opgebouwd als "voeten, lijf en hoofd". Een kern van
// 21,6 × 18,1 m tot het dak; aan de noordwest- en zuidoostkant een zone van 3 m met balkons en aan
// beide uiteinden glazen erkers, twee lagen lager dan het dak. Op de lagen 6 tot en met 11 (het lijf)
// steken op de vier hoeken balkonstapels uit, elk boven een schuine voet die naar het maaiveld breder
// wordt. In het midden van de zuidwestgevel een balkonstapel op de onderbouw en het hoofd, in de
// noordoostgevel een glazen entreestrook. Op het dak twee witte installatiekasten, een liftopbouw en
// een mast tot circa 80 m boven het maaiveld.
// Contour en hoogtes uit de 3D BAG (LoD2.2, AHN4) en het AHN-DSM, gevelindeling uit foto's van
// DOK architecten (Arjen Schmitz). De BAG-contour van het pand omvat ook de ondergrondse
// parkeergarage onder het grasdek rond de toren; die is niet gemodelleerd.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "pharos-den-haag";
// Gebouwstelsel: u langs de lange gevels naar het noordoosten (40,6° op RD-oost; BAG-randen 40,59–40,63°),
// v haaks erop naar het noordwesten. (u, v) = (0, 0) ligt op RD 79235,00 / 451774,00; de oorsprong van
// het model ligt in het hart van de kern op (u, v) = (2,4, 2,75). De toren is spiegelsymmetrisch in v = 2,75.
const ANGLE = 40.6;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const UC = 2.4, VC = 2.75;
const ORIGIN = [+(79235 + UC * AXIS[0] - VC * AXIS[1]).toFixed(2), +(451774 + UC * AXIS[1] + VC * AXIS[0]).toFixed(2)];
const GROUND = 0.35; // NAP, AHN-DTM rondom de toren (0,27–0,39; straat 0,05, 3D BAG-maaiveld -0,09)
const GEOID = 43.46; // NLGEO2018 ter plekke (scripts/bridges/geoide.mjs in de webshop)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 72.5; // kerndak (3D BAG 72,51–72,52, 70e percentiel 72,54; DSM 72–73)
const STRIP = 66.5; // balkon- en erkerzones noordwest en zuidoost (3D BAG 66,49–66,57; DSM 66–67)
const STACK = 34.0; // balkonstapels op de hoeken (3D BAG 33,8–34,0; lijf = lagen 6–11)
const PLANT = 75.2; // twee installatiekasten (3D BAG 75,20–75,25; DSM 75)
const LIFT = 76.0; // liftopbouw met de mast (3D BAG 75,86–76,02)
const MAST = 80.3; // masttop, circa 80 m boven het maaiveld (Wikipedia 80 m; foto 72,6 : 80,1)

// ---------- Lagen (lokaal z) ----------
// 25 lagen: begane grond 3,6 m, daarboven 24 lagen van 2,84 m tot 71,76 m plus dakrand tot 72,15 m.
// Onderbouw = lagen 0–5, lijf = lagen 6–11, hoofd = lagen 12–24; de zones van 3 m eindigen op laag 22.
const STOREY = 2.84;
const floorAt = (k) => (k === 0 ? 0 : 3.6 + (k - 1) * STOREY);
const FLOORS = Array.from({ length: 25 }, (_, k) => [floorAt(k), k === 0 ? 3.6 : STOREY]);
const range = (a, b) => FLOORS.slice(a, b + 1);
const BODY_BOTTOM = floorAt(6) - 0.3; // onderkant van de balkonstapels (vloer laag 6 min de plaat)
const FOOT_TOP = 15.8; // de schuine voeten raken de gevel op 15,8 m (foto zuidwestgevel)

// ---------- Plattegrond in (u, v) ----------
const U0 = -8.4, U1 = 13.2; // kern (3D BAG)
const V0 = -6.2, V1 = 11.9;
const SV0 = -9.4, SV1 = 14.9; // buitenkant van de zones (3D BAG; symmetrisch in v = 2,75)
const BAY = 3.4; // glazen erkers aan de uiteinden van de zones (foto zuidwestgevel: 3,4 van 21,6 m)
// Balkonstapels op de hoeken: [naam, rechthoek, uitsteekrichting, gevel met de balkons].
// Noord en oost steken in ±v uit (3D BAG u 10,1–13,2 en 9,4–13,8; DSM u 9,5–14), zuidwest en west in -u
// (3D BAG u -12,7 en -12,1; DSM tot -13).
const STACKS = [
  { name: "noord", poly: rect(9.3, SV1, U1, 19.1), out: [0, 1], foot: rect(U1 - 2.0, SV1, U1, 19.1), balc: [[9.3, 19.1], [9.3, SV1]], spans: [[0.9, 3.75]] },
  { name: "oost", poly: rect(9.3, -13.6, U1, SV0), out: [0, -1], foot: rect(U1 - 2.0, -13.6, U1, SV0), balc: [[9.3, SV0], [9.3, -13.6]], spans: [[0.45, 3.3]] },
  { name: "zuidwest", poly: rect(-12.9, SV0, U0, -5.4), out: [-1, 0], foot: rect(-12.9, SV0, U0, SV0 + 2.0), balc: [[-12.9, -5.4], [-12.9, SV0]], spans: [[0.45, 3.55]] },
  { name: "west", poly: rect(-12.9, 10.9, U0, SV1), out: [-1, 0], foot: rect(-12.9, SV1 - 2.0, U0, SV1), balc: [[-12.9, SV1], [-12.9, 10.9]], spans: [[0.45, 3.55]] },
];
// Balkonstapel in het midden van de zuidwestgevel: 13,7 m breed, 1,5 m voor de gevel (DSM u -10 tot -8,4).
const SW_BALC = rect(-9.9, VC - 6.85, U0, VC + 6.85);
// Installatiekasten: langgerekte zeshoeken van 2,4 × 15,9 m langs u, op v = 2,75 ± 4,1 (3D BAG, luchtfoto).
const casing = (vc) => [[-6.0, vc], [-4.8, vc - 1.2], [8.7, vc - 1.2], [9.9, vc], [8.7, vc + 1.2], [-4.8, vc + 1.2]];

// Wig onder een uitkraging: van de gevel (breedte = de rechthoek) onder 45° tot de buitenrand op zTop.
function wedge(poly, out, zTop) {
  const us = poly.map((p) => p[0]), vs = poly.map((p) => p[1]);
  const [u0, u1, v0, v1] = [Math.min(...us), Math.max(...us), Math.min(...vs), Math.max(...vs)];
  const d = out[0] ? u1 - u0 : v1 - v0;
  // binnenrand = de gevelkant, tegenover de uitsteekrichting
  const inner = out[0] > 0 ? [[u0, v0], [u0, v1]] : out[0] < 0 ? [[u1, v0], [u1, v1]] : out[1] > 0 ? [[u0, v0], [u1, v0]] : [[u0, v1], [u1, v1]];
  return Manifold.hull([...poly.map(([u, v]) => [u, v, zTop]), ...inner.map(([u, v]) => [u, v, zTop - d - 0.01]), ...inner.map(([u, v]) => [u, v, zTop])]);
}
// Schuine voet: schijf onder de buitenrand van de stapel, op het maaiveld even breed als de stapel uitsteekt
// en op FOOT_TOP vlak met de gevel.
function foot(poly, out) {
  const us = poly.map((p) => p[0]), vs = poly.map((p) => p[1]);
  const [u0, u1, v0, v1] = [Math.min(...us), Math.max(...us), Math.min(...vs), Math.max(...vs)];
  const inner = out[0] > 0 ? [[u0, v0], [u0, v1]] : out[0] < 0 ? [[u1, v0], [u1, v1]] : out[1] > 0 ? [[u0, v0], [u1, v0]] : [[u0, v1], [u1, v1]];
  return Manifold.hull([...poly.map(([u, v]) => [u, v, BASE]), ...inner.map(([u, v]) => [u, v, FOOT_TOP])]);
}

// ---------- Massa ----------
const balcBottom = (k) => floorAt(k) - 0.3;
const swBalcony = [
  // onderbouw lagen 1–5 en hoofd lagen 12–22, elk met een kraag onder 45° (1,5 m)
  union([prism(SW_BALC, balcBottom(1), floorAt(6)), wedge(SW_BALC, [-1, 0], balcBottom(1))]),
  union([prism(SW_BALC, balcBottom(12), floorAt(22) + 1.1), wedge(SW_BALC, [-1, 0], balcBottom(12))]),
];
const body = union([
  prism(rect(U0, V0, U1, V1), BASE, z(ROOF)),
  prism(rect(U0, SV0, U1, V0 + 0.05), BASE, z(STRIP)),
  prism(rect(U0, V1 - 0.05, U1, SV1), BASE, z(STRIP)),
  ...STACKS.flatMap((s) => [prism(s.poly, BODY_BOTTOM, z(STACK)), wedge(s.poly, s.out, BODY_BOTTOM + 0.01), foot(s.foot, s.out)]),
  ...swBalcony,
  prism(casing(VC - 4.1), z(ROOF) - 0.1, z(PLANT)),
  prism(casing(VC + 4.1), z(ROOF) - 0.1, z(PLANT)),
  prism(rect(-4.3, VC - 1.1, -2.8, VC + 1.1), z(ROOF) - 0.1, z(LIFT)),
  prism(rect(-4.05, VC - 0.5, -3.05, VC + 0.5), z(LIFT) - 0.1, z(MAST)), // mast, verdikt tot 1,0 m
]);

// ---------- Gevelreliëf ----------
const cuts = [];
// Punt op de rand a→b: s langs de rand, depth naar binnen (buitennormaal rechts van de looprichting).
const frame = (a, b) => {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, P: (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h] };
};
// Is de gevel op (s, h) buitengevel, en niet bedekt door een ander bouwdeel?
const exposed = (P, ss, hs) => ss.every((s) => hs.every((h) => {
  const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
}));
// Nis met een plafond onder 45°: van lo tot top aan de voorkant, top - depth achterin.
const niche = (P, s0, s1, lo, top, depth) =>
  Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, top + 0.2), P(s1, -0.2, top + 0.2), P(s0, depth, top - depth), P(s1, depth, top - depth)]);
// Vensters als blinde nissen van 0,35 m op een raster langs a→b.
function windows(a, b, floors, { pitch = 3.0, width = 1.8, from = 0, to = Infinity } = {}) {
  const { L, P } = frame(a, b);
  const s1 = Math.min(to, L), s0 = from, len = s1 - s0;
  const bays = Math.max(1, Math.floor((len - 0.6) / pitch)), w = Math.min(width, len - 1.0);
  if (w < 0.9) return;
  const step = len / bays;
  for (const [zf, fh] of floors) {
    const lo = zf + 0.9, top = zf + fh - 0.35;
    for (let k = 0; k < bays; k++) {
      const c = s0 + step * (k + 0.5), a0 = c - w / 2, a1 = c + w / 2;
      if (exposed(P, [a0 + 0.1, c, a1 - 0.1], [lo + 0.05, top - 0.05])) cuts.push(niche(P, a0, a1, lo, top, 0.35));
    }
  }
}
// Open balkons als nissen van 0,9 m diep met een plafond onder 45°: borstwering en plaat samen 0,9 m.
function balconies(a, b, floors, spans) {
  const { P } = frame(a, b);
  for (const [zf, fh] of floors) {
    const lo = zf + 0.6, top = zf + fh - 0.3;
    for (const [s0, s1] of spans) if (exposed(P, [s0 + 0.1, s1 - 0.1], [lo + 0.05, top - 0.05])) cuts.push(niche(P, s0, s1, lo, top, 0.9));
  }
}
const HEAD = range(12, 22), BASEF = range(1, 5), BODYF = range(6, 11);
// Kern: vensters op alle gevels, ook de twee bovenste lagen boven de zones.
windows([U1, V0], [U1, V1], FLOORS); // noordoost
windows([U0, V1], [U0, V0], FLOORS); // zuidwest (achter de balkonstapel valt weg)
windows([U0, V0], [U1, V0], range(23, 24)); // zuidoost boven de zone
windows([U1, V1], [U0, V1], range(23, 24)); // noordwest boven de zone
// Zones noordwest en zuidoost: glazen erkers aan de uiteinden, ertussen per laag twee balkons
// (onderbouw en hoofd) of vensters (lijf).
const mid = U1 - U0 - 2 * BAY, half = mid / 2;
for (const [a, b] of [[[U0, SV0], [U1, SV0]], [[U1, SV1], [U0, SV1]]]) {
  windows(a, b, range(0, 22), { pitch: BAY, width: 2.2, from: 0, to: BAY });
  windows(a, b, range(0, 22), { pitch: BAY, width: 2.2, from: BAY + mid, to: 2 * BAY + mid });
  balconies(a, b, [...range(1, 5), ...HEAD], [[BAY + 0.45, BAY + half - 0.45], [BAY + half + 0.45, BAY + mid - 0.45]]);
  windows(a, b, BODYF, { from: BAY, to: BAY + mid });
}
// Kopse kanten van de zones (de erkers in de noordoost- en zuidwestgevel): glas per laag.
for (const [a, b] of [[[U1, SV0], [U1, V0]], [[U1, V1], [U1, SV1]], [[U0, SV1], [U0, V1]], [[U0, V0], [U0, SV0]]]) windows(a, b, range(0, 22), { pitch: 3.2, width: 2.0 });
// Balkonstapel zuidwestgevel: twee balkons per laag, gescheiden door een penant van 0,9 m.
{
  const a = [-9.9, VC + 6.85], b = [-9.9, VC - 6.85];
  balconies(a, b, [...BASEF, ...HEAD], [[0.45, 6.4], [7.3, 13.25]]);
}
// Hoekstapels: balkons op de lagen 6–10 (laag 11 is het open dakterras op +34,0), een zijwand van 0,9 m
// aan de buitenkant; vensters op de andere gevels.
for (const s of STACKS) {
  balconies(...s.balc, range(6, 10), s.spans);
  const poly = s.poly;
  poly.forEach((p, i) => windows(p, poly[(i + 1) % poly.length], range(6, 10), { pitch: 2.4, width: 1.4 }));
}
// Glazen entreestrook midden in de noordoostgevel: vijf lagen plus de entree, 5 m breed, 0,4 m diep.
{
  const { P } = frame([U1, V0], [U1, V1]);
  cuts.push(niche(P, VC - 2.5 - V0, VC + 2.5 - V0, 0, BODY_BOTTOM - 0.2, 0.4));
}

const building = body.subtract(union(cuts)).translate([-UC, -VC, 0]);
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Pharos: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Pharos", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:pharos-den-haag", building]],
  catalog: {
    name: "Pharos",
    origin: ORIGIN,
    xAxis: AXIS.map((c) => +c.toFixed(6)),
    groundNap: GROUND,
    groundHeight: +(GROUND + GEOID).toFixed(2), // NAP-maaiveld + NLGEO2018-geoïde (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0518100000208808"],
    description:
      "Pharos aan de Loevesteinlaan en de Melis Stokelaan (Escamp, DOK architecten, 2009): woontoren van 25 lagen met een kern van 21,6 × 18,1 m tot NAP +72,5 m, aan de noordwest- en zuidoostkant zones van 3 m tot +66,5 m met per laag twee balkons en glazen erkers aan de uiteinden, op de lagen 6–11 vier hoekstapels met balkons tot +34,0 m die 4,2–4,5 m uitkragen boven schuine voeten (op het maaiveld even breed als de uitkraging, 15,8 m hoog), een balkonstapel in de zuidwestgevel, een glazen entreestrook in de noordoostgevel, twee installatiekasten tot +75,2 m, een liftopbouw tot +76,0 m en een mast tot +80,3 m (verdikt tot 1,0 m). Hoogtes uit de 3D BAG (AHN4), plattegrond uit de 3D BAG en het AHN-DSM. Oorsprong in het hart van de kern, X-as langs de lange gevels naar het noordoosten (40,6° op RD-oost). Verdiepingshoogte, vensterraster, balkons, de plaats van de voeten en de kragen onder de uitkragingen zijn geschat uit foto's; de ondergrondse garage onder het grasdek binnen de BAG-contour is niet gemodelleerd.",
    realWorld: {
      groundNapM: GROUND,
      geoidM: GEOID,
      roofNapM: ROOF,
      roofAboveGroundM3dBag70p: 72.6,
      stripNapM: STRIP,
      cornerStackNapM: STACK,
      plantNapM: PLANT,
      liftNapM: LIFT,
      mastTopNapM: MAST,
      corePlanM: [+(U1 - U0).toFixed(2), +(V1 - V0).toFixed(2)],
      floors: 25,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0518100000208808 (bouwjaar 2009), 3D BAG LoD2.2 (AHN4, 2020), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag",
      "https://dokarchitecten.nl/en/project/pharos-den-haag",
    ],
  },
});

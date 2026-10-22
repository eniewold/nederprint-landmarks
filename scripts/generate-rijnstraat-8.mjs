// Rijnstraat 8 (Den Haag, 1992 Jan Hoogstad als ministerie van VROM, 2017 verbouwd door OMA): een blok
// van 140 bij 56 m naast Den Haag Centraal. Over de lengte wisselen vier witte kantoorschijven af met
// drie glazen serres van volle hoogte, aan beide langsgevels; de serres hebben een dak van glazen
// zaagtanden. Aan de zuidoostkant een kantoorblok met een glazen gevel en een verhoogde lichtkap, aan
// de noordwestkant een smalle kopschijf met een trappenhuis. Onder de schijven een open plint met
// Λ-vormige kolommen, onder de serres een donkere, inspringende plint; de verhoogde tramlijn naar
// het station gaat in de Rijnstraatgevel het gebouw in. Aan de zuidwestkant twee lage vleugels rond
// een plein, met op de zuidoostelijke een sportveld.
// Contouren uit de BAG, hoogtes uit het AHN-DSM (per kolom van 1 m langs de as), de serres en
// schijven uit de luchtfoto, de plint, kolommen en gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "rijnstraat-8";
// Gebouwstelsel: u langs de lange as naar het noordwesten (127,4° linksom op RD-oost, BAG-randen
// evenwijdig binnen 0,1°), v haaks erop naar het zuidwesten (plein); -v is de Rijnstraat.
const ORIGIN = [82053.81, 455166.13];
const ANGLE = 127.4;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.7; // NAP, AHN-DTM rondom (0,6…0,8); de Rijnstraat ligt 0,5–0,9 m lager
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM ----------
const SLAB_ROOF = 61.0; // witte schijven (DSM-mediaan 60,8–61,0)
const SERRE_EAVES = 60.4; // daken tussen de schijven (DSM 60,2–60,6)
const SERRE_RIDGE = 61.4; // glazen zaagtanden boven de gevelserres (geschat; het AHN ziet door het glas)
const ATRIUM_EAVES = 61.9, ATRIUM_RIDGE = 62.5; // verhoogde glazen kap in het midden (DSM 61,9–62,8)
const HEAD_ROOF = 60.4; // zuidoostelijk kopblok (60,3–60,5)
const SKYLIGHT_EAVES = 61.6, SKYLIGHT_RIDGE = 62.8; // lichtkap op het kopblok (p90 62,7–62,8)
const END_SLAB_ROOF = 60.8; // noordwestelijke kopschijf
const STAIR_TOP = 57.3; // trappenhuis aan de noordwestgevel (DSM 57)
const WING_SE = 13.8, WING_NW = 14.0; // lage vleugels aan het plein (DSM 13,6–14,0)
const PLINTH_SERRE = 13.0; // onderkant van de serres: donkere plintband tot circa de vierde laag (foto's)
const PLINTH_SLAB = 9.0; // onderkant van de schijven boven de Λ-kolommen (foto's)
const PLINTH_HEAD = 8.0; // inspringende plint van het kopblok (foto's)

// ---------- Plattegrond in (u, v) ----------
const V_NE = -35.6, V_SW = 20.65; // langsgevels (BAG)
const U_SE = -69.9, U_NW = 69.93; // kopgevels (BAG)
// Indeling langs de as (overgangen in het DSM: glas geeft ruis en zaagtanden, schijven een vlak dak).
const HEAD = [U_SE, -34.5]; // kantoorblok aan de zuidoostkant
const SLABS = [[-34.5, -24.3], [-2.4, 8.6], [30.6, 40.6], [62.4, U_NW]];
const SERRES = [[-24.3, -2.4], [8.6, 30.6], [40.6, 62.4]];
const SERRE_INSET = 1.2; // glasgevel van de serres ligt achter de schijven (foto's)
// Dwarsindeling van een travee tussen twee schijven: gevelserre (glas, het AHN kijkt erdoorheen),
// kantoren met een plat dak, het middenatrium onder een verhoogde glazen kap, weer kantoren en de
// gevelserre aan het plein.
const SERRE_NE = -29.0, ATRIUM = [-18.5, 3.5], SERRE_SW = 13.5;
const SKYLIGHT = rect(-56.5, -18.0, -35.5, 4.5);
const STAIR = rect(U_NW - 0.05, -13.5, 73.9, -1.5);
const WINGS = [
  { poly: rect(U_SE, V_SW - 0.05, -22.68, 42.3), top: WING_SE },
  { poly: rect(29.65, V_SW - 0.05, U_NW, 42.26), top: WING_NW },
];

// Glazen zaagtanden: `n` nokken langs de as over de breedte v0…v1.
function sawtooth([u0, u1], v0, v1, eaves, ridge, n) {
  const w = (v1 - v0) / n, parts = [];
  for (let k = 0; k < n; k++) {
    const a = v0 + k * w, b = a + w, m = (a + b) / 2;
    parts.push(Manifold.hull([
      [u0, a, z(eaves) - 0.1], [u1, a, z(eaves) - 0.1], [u0, b, z(eaves) - 0.1], [u1, b, z(eaves) - 0.1],
      [u0, m, z(ridge)], [u1, m, z(ridge)],
    ]));
  }
  return union(parts);
}

const body0 = union([
  prism(rect(HEAD[0], V_NE, HEAD[1], V_SW), BASE, z(HEAD_ROOF)),
  prism(SKYLIGHT, z(HEAD_ROOF) - 0.1, z(SKYLIGHT_EAVES)),
  sawtooth([SKYLIGHT[0][0], SKYLIGHT[1][0]], SKYLIGHT[0][1], SKYLIGHT[2][1], SKYLIGHT_EAVES, SKYLIGHT_RIDGE, 4),
  ...SLABS.map(([a, b], i) => prism(rect(a, V_NE, b, V_SW), BASE, z(i === SLABS.length - 1 ? END_SLAB_ROOF : SLAB_ROOF))),
  ...SERRES.map(([a, b]) => prism(rect(a, V_NE + SERRE_INSET, b, V_SW - SERRE_INSET), BASE, z(SERRE_EAVES))),
  ...SERRES.flatMap((s) => [
    sawtooth(s, V_NE + SERRE_INSET, SERRE_NE, SERRE_EAVES, SERRE_RIDGE, 3),
    sawtooth(s, SERRE_SW, V_SW - SERRE_INSET, SERRE_EAVES, SERRE_RIDGE, 3),
    prism(rect(s[0], ATRIUM[0], s[1], ATRIUM[1]), z(SERRE_EAVES) - 0.1, z(ATRIUM_EAVES)),
    sawtooth(s, ATRIUM[0], ATRIUM[1], ATRIUM_EAVES, ATRIUM_RIDGE, 4),
  ]),
  prism(STAIR, BASE, z(STAIR_TOP)),
  ...WINGS.map(({ poly, top }) => prism(poly, BASE, z(top))),
]);

// ---------- Plint ----------
// Inspringing onder een gevel: van de grond tot `top`, `depth` diep, met een plafond onder 45° zodat de
// overstek zonder steun print. side = -1 voor de Rijnstraatgevel (V_NE), +1 voor de pleingevel (V_SW).
function recess([u0, u1], face, side, top, depth) {
  const inner = face - side * depth;
  return Manifold.hull([
    [u0, face + side * 1, BASE - 1], [u1, face + side * 1, BASE - 1], [u0, inner, BASE - 1], [u1, inner, BASE - 1],
    [u0, face + side * 1, z(top) + 1], [u1, face + side * 1, z(top) + 1], [u0, inner, z(top) - depth], [u1, inner, z(top) - depth],
  ]);
}
const cutsPlinth = [];
const legs = [];
for (const side of [-1, 1]) {
  const face = side < 0 ? V_NE : V_SW;
  // Serres: donkere plint 2,5 m terug.
  for (const s of SERRES) cutsPlinth.push(recess(s, face + side * -SERRE_INSET, side, PLINTH_SERRE, 2.5));
  // Schijven: open plint 3 m diep met per schijf één Λ-kolom (benen van 1 m, 2,8 m uit elkaar aan de voet).
  for (const [a, b] of SLABS.slice(0, 3)) {
    cutsPlinth.push(recess([a + 0.9, b - 0.9], face, side, PLINTH_SLAB, 3.0));
    const uc = (a + b) / 2, vc = face - side * 1.5, h = z(PLINTH_SLAB) - 1.5; // plafond op 1,5 m diepte
    for (const d of [-2.8, 2.8]) {
      legs.push(Manifold.hull([
        [uc + d - 0.5, vc - 0.5, BASE], [uc + d + 0.5, vc - 0.5, BASE], [uc + d - 0.5, vc + 0.5, BASE], [uc + d + 0.5, vc + 0.5, BASE],
        [uc - 0.5, vc - 0.5, h + 0.5], [uc + 0.5, vc - 0.5, h + 0.5], [uc - 0.5, vc + 0.5, h + 0.5], [uc + 0.5, vc + 0.5, h + 0.5],
      ]));
    }
  }
}
// Kopblok: plint 2 m terug aan de Rijnstraat en de zuidoostgevel.
cutsPlinth.push(recess([HEAD[0] + 0.9, HEAD[1]], V_NE, -1, PLINTH_HEAD, 2.0));
cutsPlinth.push(Manifold.hull([
  [U_SE - 1, V_NE + 0.9, BASE - 1], [U_SE - 1, V_SW - 0.9, BASE - 1], [U_SE + 2, V_NE + 0.9, BASE - 1], [U_SE + 2, V_SW - 0.9, BASE - 1],
  [U_SE - 1, V_NE + 0.9, z(PLINTH_HEAD) + 1], [U_SE - 1, V_SW - 0.9, z(PLINTH_HEAD) + 1], [U_SE + 2, V_NE + 0.9, z(PLINTH_HEAD) - 2], [U_SE + 2, V_SW - 0.9, z(PLINTH_HEAD) - 2],
]).subtract(prism(WINGS[0].poly, BASE - 2, 100)));
// Trampoort in de Rijnstraatgevel onder de derde serre (sporen op de luchtfoto bij u = 45…59): een
// blinde doorgang van 12 m breed en 18 m diep, wanden tot NAP +10,5 m en een spitse top onder 45°
// (de werkelijke poort is rechthoekig; een vlak plafond van 12 m zou in de print dichtgezet worden).
const TRAM = [46.0, 58.0];
const tramMid = (TRAM[0] + TRAM[1]) / 2, tramHalf = (TRAM[1] - TRAM[0]) / 2;
cutsPlinth.push(Manifold.hull([
  ...[V_NE - 1, V_NE + 18].flatMap((v) => [[TRAM[0], v, BASE - 1], [TRAM[1], v, BASE - 1], [TRAM[0], v, z(10.5)], [TRAM[1], v, z(10.5)], [tramMid, v, z(10.5) + tramHalf]]),
]));
const body = body0.subtract(union(cutsPlinth)).add(union(legs));

// ---------- Gevelreliëf ----------
// Lagen: begane grond 4,5 m, daarboven 15 lagen van 3,6 m (16 lagen, Wikipedia).
const STOREY = 3.6;
const FLOORS = [[0, 4.5], ...Array.from({ length: 15 }, (_, k) => [4.5 + STOREY * k, STOREY])];
const DEPTH = 0.35;
const cuts = [];
// Nissen langs de rand a→b (buitennormaal rechts van de looprichting). mode "window": vensters per
// travee; mode "band": één doorlopende glasband per laag tussen penanten van 0,9 m. Plafond onder 45°.
function face(a, b, { mode, pitch = 2.7, width = 1.4, from = -10, to = 200, sill = 0.9, header = 0.35 }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const spans = [];
  if (mode === "band") spans.push([0.9, L - 0.9]);
  else {
    const bays = Math.max(1, Math.floor((L - 0.9) / pitch)), w = (L - bays * pitch) / 2;
    for (let k = 0; k < bays; k++) spans.push([w + k * pitch + (pitch - width) / 2, w + k * pitch + (pitch + width) / 2]);
  }
  for (const [zf, fh] of FLOORS) {
    const lo = zf + sill, hi = zf + fh - header - DEPTH;
    if (zf < z(from) - 0.01 || zf + fh > z(to) + 0.01 || hi - lo < 0.9) continue;
    for (const [s0, s1] of spans) {
      if (s1 - s0 < 0.9) continue;
      const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
// Serres: glasgevel met een band per laag, aan beide kanten.
for (const [a, b] of SERRES) {
  face([a, V_NE + SERRE_INSET], [b, V_NE + SERRE_INSET], { mode: "band", from: PLINTH_SERRE, to: SERRE_EAVES });
  face([b, V_SW - SERRE_INSET], [a, V_SW - SERRE_INSET], { mode: "band", from: PLINTH_SERRE, to: SERRE_EAVES });
}
// Kopblok: glasgevel rondom met een band per laag (sinds de verbouwing van 2017).
face([HEAD[0], V_SW], [HEAD[0], V_NE], { mode: "band", from: PLINTH_HEAD, to: HEAD_ROOF });
face([HEAD[0], V_NE], [HEAD[1], V_NE], { mode: "band", from: PLINTH_HEAD, to: HEAD_ROOF });
face([HEAD[1], V_SW], [HEAD[0], V_SW], { mode: "band", from: WING_SE, to: HEAD_ROOF });
// Noordwestelijke kopgevel: vensters per travee.
face([U_NW, V_NE], [U_NW, V_SW], { mode: "window", from: PLINTH_SLAB, to: END_SLAB_ROOF });
// Witte schijven: één verticale vensterstrook van 1,4 m in het midden van elke langsgevel.
const slots = [];
for (const [a, b] of SLABS.slice(0, 3)) {
  const uc = (a + b) / 2;
  for (const [face0, side] of [[V_NE, -1], [V_SW, 1]]) {
    const top = z(SLAB_ROOF) - 3.0, bottom = z(PLINTH_SLAB) + 1.0;
    slots.push(Manifold.hull([
      [uc - 0.7, face0 + side * 0.2, bottom], [uc + 0.7, face0 + side * 0.2, bottom], [uc - 0.7, face0 - side * 0.4, bottom], [uc + 0.7, face0 - side * 0.4, bottom],
      [uc - 0.7, face0 + side * 0.2, top + 0.6], [uc + 0.7, face0 + side * 0.2, top + 0.6], [uc - 0.7, face0 - side * 0.4, top], [uc + 0.7, face0 - side * 0.4, top],
    ]).subtract(prism(rect(-80, V_SW - 5, 80, V_SW + 30), BASE, z(WING_NW) + 0.5)));
  }
}

const building = body.subtract(union([...cuts, ...slots]));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Rijnstraat 8: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Rijnstraat 8", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length + slots.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:rijnstraat-8", building]],
  catalog: {
    name: "Rijnstraat 8",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.2, // PDOK-terrein op het plein en rondom (ellipsoïdisch); de Rijnstraat ligt lager
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[0, 30], [-73, 0], [-73, -20]],
    replacesBuildings: ["NL.IMBAG.Pand.0518100000274290"],
    description:
      "Rijnstraat 8 (voormalig VROM-gebouw) naast Den Haag Centraal: een blok van 140 × 56 m met over de lengte vier witte kantoorschijven tot NAP +61,0 m en drie travees met glazen gevelserres en een verhoogde glazen kap op het middenatrium (+60,4 tot +62,5 m), aan de zuidoostkant een kantoorblok met glasgevel tot +60,4 m en een lichtkap tot +62,8 m, aan de noordwestgevel een trappenhuis tot +57,3 m en aan het plein twee lage vleugels van +13,8 en +14,0 m. Onder de schijven een open plint met Λ-kolommen tot +9 m, onder de serres een inspringende plint tot +13 m en in de Rijnstraatgevel de trampoort. Glasbanden per laag in serres en kopblok, een verticale vensterstrook per schijf. Hoogtes uit het AHN-DSM, indeling uit de luchtfoto. Oorsprong in het hart van de BAG-contour, X-as langs de lange as naar het noordwesten (127,4° op RD-oost). Plinthoogtes, kolommen, trampoort, zaagtandsteek en gevelindeling zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      slabRoofNapM: SLAB_ROOF,
      serreRoofNapM: [SERRE_EAVES, SERRE_RIDGE],
      atriumRoofNapM: [ATRIUM_EAVES, ATRIUM_RIDGE],
      headRoofNapM: HEAD_ROOF,
      skylightNapM: [SKYLIGHT_EAVES, SKYLIGHT_RIDGE],
      wingsNapM: [WING_SE, WING_NW],
      plinthNapM: { serres: PLINTH_SERRE, slabs: PLINTH_SLAB, head: PLINTH_HEAD },
      tramPortalNapM: [10.5, 16.5],
      lengthM: +(U_NW - U_SE).toFixed(2),
      widthM: +(V_SW - V_NE).toFixed(2),
      floors: 16,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedPlinthAndFacade: true,
    },
    sources: [
      "PDOK BAG pand 0518100000274290 (bouwjaar 1993), actuele orthoHR, AHN-DSM en -DTM 0,5 m, PDOK 3D-gebouwtegel (LoD2.2)",
      "https://nl.wikipedia.org/wiki/VROM-gebouw",
      "https://commons.wikimedia.org/wiki/File:Rijnstraat_8_The_Hague_2020.jpg",
      "https://commons.wikimedia.org/wiki/File:Rijksgebouw_Den_Haag.jpg",
      "https://commons.wikimedia.org/wiki/File:Rijkskantoor_Rijnstraat_8_gezien_vanaf_de_Lekstraat.jpg",
      "https://commons.wikimedia.org/wiki/File:Rijkskantoorgebouw_Rijnstraat_8.jpg",
      "https://commons.wikimedia.org/wiki/File:Former_VROM_building_The_Hague.jpg",
    ],
  },
});

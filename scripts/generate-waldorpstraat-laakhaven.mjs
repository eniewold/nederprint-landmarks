// Studententorens Waldorpstraat (Laakhaven-Oost, Den Haag, 2013, K2 Architecten): twee vrijstaande
// woontorens van 24 lagen voor 620 studenten (DUWO) langs het spoor bij Den Haag HS, Waldorpstraat 47
// (zuidwest) en 45 (noordoost). Elke toren is een rechthoekig blok van 27,5 × 22,3 m in donkere
// baksteen met een 'streepjescodegevel': witte verticale vensterbanen van wisselende breedte, per gevel
// anders. Langs de straatgevel en de spoorgevel loopt een luifel boven de begane grond; op het platte
// dak staan een liftopbouw, een installatie en een reeks ventilatiekappen.
// Contouren uit de BAG, hoogtes uit de 3D BAG en het AHN-DSM, de streepjescode per gevel uit de
// luchtfoto's van 2026 (straat- en zuidwestgevel) en 2023 (spoor- en noordoostgevel).
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "waldorpstraat-laakhaven";
// Gebouwstelsel: x langs de lange gevels naar het noordoosten (34,96° op RD-oost, BAG-randen van
// beide torens evenwijdig binnen 0,1°), y haaks erop naar het noordwesten (naar het spoor).
// Oorsprong midden tussen de twee torens.
const ORIGIN = [81703.53, 453728.71];
const ANGLE = 34.96;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const N = [-AXIS[1], AXIS[0]];
const GROUND = 0.7; // NAP, maaiveld aan de Waldorpstraat (AHN-DTM 0,6–0,8; 3D BAG 0,72 en 0,75)
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const local = ([x, y]) => [(x - ORIGIN[0]) * AXIS[0] + (y - ORIGIN[1]) * AXIS[1], (x - ORIGIN[0]) * N[0] + (y - ORIGIN[1]) * N[1]];

// ---------- Hoogtes (NAP) ----------
const ROOF = 72.1; // dak van beide torens (3D BAG 70e percentiel 72,11 en 72,12; AHN-DSM mediaan 72,07)
const LIFT = 73.22; // liftopbouw (3D BAG-dakvlak 73,21–73,25)
const HOOD = 73.0; // ventilatiekappen (AHN-DSM 72,9–73,1)
const CANOPY = 6.55; // luifels boven de begane grond (AHN-DSM 6,4–6,7)
const CANOPY_THICK = 1.5;

// ---------- Lagen ----------
// Begane grond 5,4 m, daarboven 23 woonlagen van 2,82 m (het ritme van de vensterbanen in de luchtfoto),
// tot +70,3 m boven het maaiveld; de dakrand loopt dicht door tot +71,4 m.
const STOREY = 2.82;
const FLOORS = Array.from({ length: 23 }, (_, k) => [5.4 + STOREY * k, STOREY]);
const DEPTH = 0.35;

// ---------- Torens ----------
// Contour linksom uit de BAG: hoeken noord (A), west (B), zuid (C), oost (D). Gevels als randen van
// de contour: 0 = A→B spoorgevel (noordwest), 1 = B→C zuidwest, 2 = C→D straatgevel (zuidoost),
// 3 = D→A noordoost. Vensterbanen per gevel als [van, tot] in meters vanaf de beginhoek. Dakopbouwen
// in (s, t) vanaf hoek C, s langs x en t langs y (AHN-DSM, 0,5 m).
const TOWERS = [
  {
    name: "toren-47",
    pand: "0518100001625661",
    ring: [[81675.47, 453722.73], [81652.83, 453706.88], [81665.63, 453688.57], [81688.26, 453704.39]],
    stripes: [
      [[3.6, 4.8], [8.7, 10.4], [12.3, 13.6], [15.9, 17.1], [18.0, 19.9]],
      [[0.9, 2.8], [10.6, 13.1], [17.6, 20.2]],
      [[5.4, 7.2], [10.5, 13.7], [14.8, 15.8], [19.4, 21.1], [22.4, 23.4]],
      [[0.9, 3.4], [8.2, 10.8], [12.4, 14.2], [19.2, 21.8]],
    ],
    lift: rect(11.6, 11.6, 15.6, 14.9),
    plant: [[rect(13.75, 19.75, 15.5, 21.25), 73.75], [rect(13.5, 16.75, 15.5, 17.75), 73.65]],
    hoods: [[7.25, 4.4], [7.5, 18.0], [7.75, 13.4], [19.25, 7.9], [20.25, 17.9], [20.4, 4.6], [20.25, 12.9]],
  },
  {
    name: "toren-45",
    pand: "0518100001625111",
    ring: [[81741.33, 453768.77], [81718.87, 453753.08], [81731.7, 453734.78], [81754.14, 453750.47]],
    stripes: [
      [[5.0, 6.1], [9.4, 10.8], [13.8, 14.9], [17.8, 18.8]],
      [[1.1, 2.4], [4.5, 5.8], [8.5, 9.8], [11.9, 13.2], [15.5, 16.8], [19.4, 20.8]],
      [[6.7, 7.7], [12.0, 13.0], [14.6, 15.8], [20.0, 22.2]],
      [[1.0, 2.6], [4.8, 6.4], [8.4, 9.9], [11.7, 13.3], [15.6, 17.2], [18.9, 20.6]],
    ],
    lift: rect(10.5, 4.5, 14.75, 8.0),
    plant: [[rect(12.25, 16.75, 14.75, 18.25), 73.6], [rect(12.5, 19.75, 14.5, 21.25), 73.45]],
    hoods: [[6.1, 11.25], [6.0, 18.1], [6.1, 4.4], [14.25, 9.9], [19.25, 18.5], [19.5, 11.1]],
  },
];
// Luifels: op de straatgevel 3,5 m diep, op de spoorgevel 2,4 m (AHN-DSM), 0,3 m binnen de hoeken.
const CANOPIES = [[2, 3.5], [0, 2.4]];

function tower({ ring: rd, stripes, lift, plant, hoods }) {
  const ring = rd.map(local);
  const C = ring[2];
  const at = (poly) => poly.map(([s, t]) => [C[0] + s, C[1] + t]);
  const parts = [prism(ring, BASE, z(ROOF))];
  parts.push(prism(at(lift), z(ROOF) - 0.1, z(LIFT)));
  for (const [poly, top] of plant) parts.push(prism(at(poly), z(ROOF) - 0.1, z(top)));
  for (const [s, t] of hoods) parts.push(prism(at(rect(s - 0.5, t - 0.5, s + 0.5, t + 0.5)), z(ROOF) - 0.1, z(HOOD)));
  const edge = (i) => {
    const a = ring[i], b = ring[(i + 1) % ring.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]]; // n: buitennormaal
    return { L, P: (s, out, h) => [a[0] + d[0] * s + n[0] * out, a[1] + d[1] * s + n[1] * out, h] };
  };
  // Luifel: plaat van 1,5 m met een kraag onder 45° naar de gevel.
  for (const [i, deep] of CANOPIES) {
    const { L, P } = edge(i);
    const top = z(CANOPY), bot = top - CANOPY_THICK;
    parts.push(Manifold.hull([0.3, L - 0.3].flatMap((s) => [P(s, -0.2, top), P(s, deep, top), P(s, deep, bot), P(s, -0.2, bot - deep - 0.2)])));
  }
  const body = union(parts);
  // Streepjescode: per laag een venster over de volle breedte van elke witte baan als blinde nis van
  // 0,35 m met een plafond onder 45°; tussen de lagen blijft een borstwering van 1,15 m staan.
  const cuts = [];
  stripes.forEach((list, i) => {
    const { P } = edge(i);
    for (const [s0, s1] of list) {
      for (const [zf, fh] of FLOORS) {
        const lo = zf + 0.8, hi = zf + fh - 0.35 - DEPTH;
        cuts.push(Manifold.hull([P(s0, 0.2, lo), P(s1, 0.2, lo), P(s0, -DEPTH, lo), P(s1, -DEPTH, lo), P(s0, 0.2, hi + DEPTH + 0.2), P(s1, 0.2, hi + DEPTH + 0.2), P(s0, -DEPTH, hi), P(s1, -DEPTH, hi)]));
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
  return [`building:waldorpstraat-laakhaven-${t.name}`, m];
});

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Studententorens Waldorpstraat",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.14, // NAP +0,7 m plus de geoïde NLGEO2018 ter plekke (43,44; Laakhaventoren 43,43)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-45, -17], [-32, -17], [35, -17], [48, -17]], // stoep langs de Waldorpstraat (AHN-DTM 0,6–0,7)
    replacesBuildings: TOWERS.map((t) => `NL.IMBAG.Pand.${t.pand}`),
    description:
      "Twee vrijstaande studententorens van K2 Architecten (2013) aan de Waldorpstraat bij Den Haag HS: elk op de rechthoekige BAG-contour (27,5 × 22,3 m) tot NAP +72,1 m met een liftopbouw tot +73,2 m, een installatie, ventilatiekappen en per gevel de 'streepjescode' van witte vensterbanen als blinde nissen per laag, met luifels boven de begane grond langs de straat- en de spoorgevel. Hoogtes uit de 3D BAG en het AHN-DSM, de vensterbanen uit de luchtfoto's van 2026 en 2023. Oorsprong midden tussen de torens, X-as langs de lange gevels (34,96° op RD-oost). Het aantal lagen (begane grond en 23 woonlagen van 2,82 m), de breedte van de banen op de schuin gefotografeerde gevels en de dikte van de luifels zijn geschat; de torens hebben geen eigen projectnaam.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      liftNapM: LIFT,
      hoodNapM: HOOD,
      canopyNapM: CANOPY,
      canopyDepthM: Object.fromEntries(CANOPIES.map(([i, d]) => [i === 2 ? "street" : "rail", d])),
      floors: 1 + FLOORS.length,
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0518100001625661 (Waldorpstraat 47) en 0518100001625111 (Waldorpstraat 45), bouwjaar 2013; luchtfoto's orthoHR 2026 en 2023; AHN-DSM en -DTM 0,5 m; 3D BAG (LoD2.2, AHN5 2023)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag",
      "https://kegro.nl/studenten-waldorpstraat-den-haag/",
    ],
  },
});

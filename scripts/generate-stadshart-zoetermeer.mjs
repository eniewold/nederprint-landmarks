// City Tower (Berlijnstraat) en de toren aan het Noordwaarts (Stadshart Zoetermeer, 1998): twee bakstenen
// woontorens van 23 en 22 lagen, 210 m uit elkaar aan weerszijden van de Europaweg.
// - City Tower (Cees Reijers, 65 m): een hoofdblok tot NAP +60,1 m met een schuine zuidoostgevel waarop drie
//   balkonstapels uitsteken, aan de westkant een liftkop tot +64,0 m en twee lagere vleugels (+35,9 en +27,8 m)
//   boven de vijver, en aan de noordkant een strook één laag lager en een entreebouw van twee lagen.
// - Noordwaarts (Kokon, 63 m): een schijf van 18,7 × 32,5 m tot +59,4 m waarvan beide kopse kanten in vier
//   terrassen van één laag naar het westen aflopen, een kern die aan de oostgevel uitsteekt tot +64,5 m en aan de
//   oostkant een winkelonderbouw tot +5,25 m.
// Contouren uit de BAG, dakvlakken en hoogtes uit de 3D BAG (LoD2.2, AHN5 2023) gecontroleerd tegen het AHN-DSM,
// de balkonstapels uit het AHN-DSM buiten de gevel, het vensterraster geschat (lagen van 2,7 m uit de terrassen).
import { Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "stadshart-zoetermeer";
// Gebouwstelsel: u langs de lange noordgevel van City Tower en de kopse kanten van Noordwaarts naar het
// oostnoordoosten (21,5° op RD-oost; BAG-randen van beide torens evenwijdig binnen 0,2°), v haaks erop naar het
// noordnoordwesten. Oorsprong midden tussen de torens.
const ORIGIN = [93647.0, 453116.0];
const ANGLE = 21.5;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = -4.2; // NAP, maaiveld rond City Tower (AHN-DTM -4,1 noord en west, -4,4 oost; 3D BAG -4,39)
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const STOREY = 2.7; // terrassen van Noordwaarts en vleugels van City Tower verspringen 2,65–3,0 m

// ---------- City Tower: hoogtes (NAP) uit de 3D BAG, plattegrond in (u, v) uit BAG en 3D BAG ----------
const CT = {
  main: 60.1, // hoofdblok (3D BAG 60,08–60,16, DSM 60)
  strip: 57.3, // strook langs de noordgevel (57,23–57,31)
  entrance: 3.3, // entreebouw aan de noordkant (3,28–3,36)
  head: 64.0, // liftkop (64,00–64,06, DSM 64–66)
  headNorth: 62.6, // noordelijk deel van de kop (62,60–62,63)
  wingHigh: 35.9, // vleugel aan de zuidwestkant (35,88–35,96)
  wingHighCorner: 33.0, // zuidwesthoek van die vleugel (33,00–33,26)
  wingLow: 27.8, // westvleugel (27,72–27,89)
  wingLowCorner: 24.9, // zuidwesthoek van de westvleugel (24,89–24,99)
  balcony: 57.4, // balkonstapels op de zuidoostgevel (DSM 57–58 tot 2 m buiten de gevel)
};
const CT_PARTS = [
  [[[115.67, -10.4], [137.68, -3.11], [136.9, 1.09], [136.88, 10.06], [129.3, 10.06], [129.2, 6.67], [116.38, 5.64], [116.33, 4.02], [117.18, 4.14], [116.51, 1.98], [116.26, 1.96], [116.23, 1.08], [114.77, -3.64], [115.65, -3.45]], CT.main],
  [[[116.38, 5.64], [129.2, 6.67], [129.25, 8.0], [116.44, 7.27]], CT.strip],
  [[[116.44, 7.27], [129.25, 8.0], [129.3, 10.06], [116.54, 10.06]], CT.entrance],
  [[[110.95, 1.7], [116.26, 1.96], [116.51, 1.98], [117.18, 4.14], [116.33, 4.02], [116.44, 7.27], [110.92, 7.0]], CT.head],
  [[[110.92, 7.0], [116.44, 7.27], [116.54, 10.06], [110.88, 10.06]], CT.headNorth],
  [[[104.1, -5.88], [114.77, -3.64], [116.23, 1.08], [116.26, 1.96], [110.95, 1.7], [110.95, 3.3], [101.88, 2.0], [101.88, -4.08], [103.88, -3.7]], CT.wingHigh],
  [[[101.88, -6.35], [104.1, -5.88], [103.88, -3.7], [101.88, -4.08]], CT.wingHighCorner],
  [[[99.02, 2.89], [101.88, 2.0], [110.95, 3.3], [110.92, 7.0], [110.88, 10.06], [96.67, 10.06], [96.67, 3.46], [97.94, 4.64]], CT.wingLow],
  [[[96.67, 1.45], [97.43, 1.49], [99.02, 2.89], [97.94, 4.64], [96.67, 3.46]], CT.wingLowCorner],
];
// Balkonstapels: [rand a, rand b, van s, tot s, bovenkant NAP, uitsteek]. Op de schuine zuidoostgevel drie
// stapels waar het DSM tot 1,5–2 m buiten de gevel 57–58 meet; op de vleugels één stapel per zuidgevel (DSM 25–26
// en 33–37 buiten de gevel).
const CT_STACKS = [
  [[115.67, -10.4], [137.68, -3.11], 1.8, 4.8, CT.balcony, 1.8],
  [[115.67, -10.4], [137.68, -3.11], 9.8, 15.8, CT.balcony, 1.8],
  [[115.67, -10.4], [137.68, -3.11], 16.8, 22.6, CT.balcony, 1.8],
  [[101.88, -6.35], [115.65, -3.45], 0.0, 3.0, 34.0, 1.5],
  [[96.67, 1.45], [101.88, 2.0], 0.2, 2.6, 25.9, 1.5],
];
// Lagen: begane grond 4,6 m, daarboven 22 woonlagen van 2,7 m (23 lagen, CTBUH).
const CT_FLOORS = [[0, 4.6], ...Array.from({ length: 22 }, (_, k) => [4.6 + STOREY * k, STOREY])];

// ---------- Noordwaarts: hoogtes (NAP) uit de 3D BAG, grenzen van de terrassen uit het DSM ----------
const NW = {
  ground: -1.4, // voetgangersstraat aan de westkant (AHN-DTM -1,5…-1,2; oostkant -2,7)
  main: 59.4, // schijf (3D BAG 59,36–59,43, DSM 59)
  core: 64.5, // kern aan de oostgevel (64,47–64,51)
  vents: 61.6, // twee ventilatorkasten op het dak (61,57; DSM 61–62)
  podium: 5.25, // winkelonderbouw aan de oostkant (5,20–5,31)
  south: [48.25, 51.25, 53.95, 56.6], // terrassen aan de zuidkop van west naar oost
  north: [42.9, 45.85, 48.55, 51.2], // terrassen aan de noordkop van west naar oost
};
const NW_U = [-120.4, -118.6, -114.4, -109.4, -101.75]; // grenzen van de terraskolommen (DSM, 3D BAG ±0,9 m)
const NW_V = [-16.6, -12.2, 10.33, 15.85]; // zuidgevel, voet van de zuidelijke terrassen, noordelijke terrassen, noordgevel
const NW_PARTS = [
  [rect(NW_U[0], NW_V[1], NW_U[4], NW_V[2]), NW.main],
  ...NW.south.map((h, i) => [rect(NW_U[i], NW_V[0], NW_U[i + 1], NW_V[1]), h]),
  ...NW.north.map((h, i) => [rect(NW_U[i], NW_V[2], NW_U[i + 1], NW_V[3]), h]),
  [rect(-107.0, -3.4, -100.94, 1.77), NW.core],
  [rect(NW_U[4] - 0.05, -16.6, -95.55, -3.32), NW.podium],
  [rect(NW_U[4] - 0.05, 1.96, -95.55, 14.23), NW.podium],
];
const NW_VENTS = [rect(-114.4, -9.4, -112.6, -6.4), rect(-110.4, -7.4, -108.6, -4.6)];
// Lagen: begane grond 4,0 m vanaf de straat aan de westkant, daarboven 21 lagen van 2,7 m (22 lagen);
// de winkelonderbouw: twee lagen vanaf het lagere maaiveld aan de oostkant.
const NW_FLOORS = [[z(NW.ground), 4.0], ...Array.from({ length: 21 }, (_, k) => [z(NW.ground) + 4.0 + STOREY * k, STOREY])];
const PODIUM_FLOORS = [[z(-2.7), 4.2], [z(-2.7) + 4.2, z(NW.podium) - z(-2.7) - 4.2]];

const DEPTH = 0.35;
const edgesOf = (poly) => { const p = ccw(poly); return p.map((a, i) => [a, p[(i + 1) % p.length]]); };

// Balkonstapel langs a→b (buitennormaal rechts): blok van `out` m buiten de gevel tot de bovenkant, onderaan een
// kraag onder 45° vanaf de eerste verdieping, per laag een open balkon van 0,9 m diep met een plafond onder 45°.
function balconyStack([a, b, s0, s1, top, out], floors) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, t) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t];
  const first = floors[1][0];
  const stack = Manifold.hull([s0, s1].flatMap((s) => [[...P(s, -0.1), z(top)], [...P(s, out), z(top)], [...P(s, -0.1), first - out], [...P(s, out), first]]));
  const cuts = [];
  for (const [zf, fh] of floors.slice(1)) {
    if (zf + fh > z(top) + 0.01) continue;
    const lo = zf + 1.0, hi = zf + fh - 0.3 - 0.9;
    cuts.push(Manifold.hull([s0 + 0.9, s1 - 0.9].flatMap((s) => [[...P(s, out + 0.2), lo], [...P(s, out - 0.9), lo], [...P(s, out + 0.2), hi + 0.9 + 0.2], [...P(s, out - 0.9), hi]])));
  }
  return { stack, cuts };
}

// Vensters langs a→b als blinde nissen met een plafond onder 45°, alleen waar de gevel op beide hoogtes van het
// venster buitengevel is (niet achter balkons, terrassen of lagere delen).
function windows(body, a, b, floors, top, cuts, { pitch = 3.0, width = 1.8, sill = 0.8, header = 0.35 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 2.5) return;
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const bays = Math.max(1, Math.floor((L - 0.9) / pitch)), w = (L - bays * pitch) / 2;
  if (w + (pitch - width) / 2 < 0.45) return;
  for (const [zf, fh] of floors) {
    if (zf + fh > z(top) + 0.01) continue;
    const lo = zf + sill, hi = zf + fh - header - DEPTH;
    if (hi - lo < 0.9) continue;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * pitch + (pitch - width) / 2, s1 = s0 + width;
      const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}

// ---------- City Tower ----------
function cityTower() {
  const stacks = CT_STACKS.map((s) => balconyStack(s, CT_FLOORS));
  const body = union([...CT_PARTS.map(([poly, h]) => prism(poly, BASE, z(h))), ...stacks.map((s) => s.stack)]);
  const cuts = stacks.flatMap((s) => s.cuts);
  for (const [poly, h] of CT_PARTS) {
    if (h === CT.entrance) continue; // entreebouw: glazen pui, geen raster
    for (const [a, b] of edgesOf(poly)) windows(body, a, b, CT_FLOORS, h, cuts);
  }
  // Entreebouw: twee hoge glasvlakken in de noordgevel.
  windows(body, [129.3, 10.06], [116.54, 10.06], [[0, 7.5]], CT.entrance, cuts, { pitch: 4.2, width: 3.0, sill: 0.9, header: 0.9 });
  return body.subtract(union(cuts));
}

// ---------- Noordwaarts ----------
function noordwaarts() {
  const body = union([
    ...NW_PARTS.map(([poly, h]) => prism(poly, BASE, z(h))),
    ...NW_VENTS.map((poly) => prism(poly, z(NW.main) - 0.1, z(NW.vents))),
  ]);
  const cuts = [];
  for (const [poly, h] of NW_PARTS) {
    if (h === NW.podium) {
      for (const [a, b] of edgesOf(poly)) windows(body, a, b, PODIUM_FLOORS, h, cuts, { pitch: 3.6, width: 2.4, sill: 0.6, header: 0.6 });
      continue;
    }
    for (const [a, b] of edgesOf(poly)) windows(body, a, b, NW_FLOORS, h, cuts);
  }
  return body.subtract(union(cuts));
}

const nodes = [["city-tower", cityTower()], ["noordwaarts", noordwaarts()]].map(([name, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [`building:${slug}-${name}`, m];
});

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "City Tower en Noordwaarts",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 39.27, // NAP -4,2 + geoïde 43,47 (NLGEO2018) rond City Tower
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[120, 14], [132, 14], [141, 2]],
    replacesBuildings: ["NL.IMBAG.Pand.0637100000178446", "NL.IMBAG.Pand.0637100000178154"],
    description:
      "Twee woontorens uit 1998 in het Stadshart van Zoetermeer: City Tower aan de Berlijnstraat (oosten) met een hoofdblok tot NAP +60,1 m, een liftkop tot +64,0 m, vleugels tot +35,9 en +27,8 m, een strook tot +57,3 m en een entreebouw tot +3,3 m, en drie balkonstapels op de schuine zuidoostgevel tot +57,4 m; Noordwaarts (westen) als schijf tot +59,4 m met aan beide kopse kanten vier terrassen van één laag die naar het westen aflopen (zuid +56,6 tot +48,25, noord +51,2 tot +42,9), een kern tot +64,5 m en een winkelonderbouw tot +5,25 m. Contouren uit de BAG, hoogtes en dakdelen uit de 3D BAG (LoD2.2) en het AHN-DSM, balkonstapels uit het DSM buiten de gevel. Oorsprong midden tussen de torens, X-as langs de noordgevel van City Tower (21,5° op RD-oost); het maaiveld van City Tower (NAP -4,2) is z = 0, Noordwaarts staat 2,8 m hoger en loopt door tot dezelfde onderkant. Vensterraster (lagen van 2,7 m, travee 3,0 m) en balkondiepte zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      cityTower: { roofNapM: CT.main, headNapM: [CT.headNorth, CT.head], wingsNapM: [CT.wingLow, CT.wingHigh], stripNapM: CT.strip, entranceNapM: CT.entrance, balconyTopNapM: CT.balcony, floors: 23, heightM: 65 },
      noordwaarts: { groundNapM: NW.ground, roofNapM: NW.main, coreNapM: NW.core, terracesSouthNapM: NW.south, terracesNorthNapM: NW.north, podiumNapM: NW.podium, floors: 22, heightM: 63 },
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0637100000178446 (Berlijnstraat 27–193, bouwjaar 1998) en 0637100000178154 (Noordwaarts 34–196, bouwjaar 1998), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG LoD2.2 (puntenwolk AHN5 2023): https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0637100000178446 en https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0637100000178154",
      "https://www.skyscrapercenter.com/building/city-tower/6762",
      "https://www.skyscrapercenter.com/building/noordwaarts/6763",
      "https://bagviewer.kadaster.nl/lvbag/bag-viewer/?objectId=0637100000178446",
    ],
  },
});

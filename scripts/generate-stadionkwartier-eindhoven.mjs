// Hartje New York / E' Tower (Gerard Philipslaan, Stadionkwartier, Eindhoven, 2013, Wiel Arets
// Architects): woontoren van 22 woonlagen op een begane grond naast het Philips Stadion. Een glazen
// schijf op een plattegrond met een schuine noordwestkop; per laag een doorlopende witte vloerrand
// (de gefacetteerde brise-soleils) met het glas erachter, en op de hoeken balkonstapels die per
// hoogte van plaats wisselen. Vanaf de achtste woonlaag kraagt de westelijke helft van de zuidwestgevel
// ruim een meter uit; aan de zuidoostkop een balkonstapel boven de lage doorgang naar het
// buurgebouw, op het dak een liftopbouw.
// Contour uit de BAG, hoogtes uit de 3D BAG (AHN5) en het AHN-DSM, opbouw uit de gevel- en
// plattegronden van de architect en foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "stadionkwartier-eindhoven";
// Gebouwstelsel: u langs de lange gevels naar het zuidoosten (-36,83° op RD-oost, BAG-randen evenwijdig
// binnen 0,1°), v haaks erop naar het noordoosten. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [160340.33, 383825.28];
const ANGLE = -36.83;
const A_ = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A_).toFixed(5), +Math.sin(A_).toFixed(5)];
const GROUND = 18.32; // NAP, 3D BAG-maaiveld (AHN-DTM rondom 18,25 noordwest … 18,9 zuidwest)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 (AHN5 2024) en AHN-DSM ----------
const ROOF = 91.85; // dak, 70e percentiel 3D BAG (DSM-mediaan 91,87)
const LIFT = 93.45; // liftopbouw (3D BAG-dakvlak 93,34–93,54)
const STACK_TOP = 88.5; // balkonrand van de bovenste laag (3D BAG-dakvlak 88,52–88,54 aan de zuidoostkop)

// ---------- Lagen (gevelaanzicht van de architect: 22 woonlagen boven een begane grond) ----------
const GF = 3.3; // begane grond (lobby 0,7 m boven straat)
const STOREY = 3.12;
const FLOORS = [[0, GF], ...Array.from({ length: 22 }, (_, k) => [GF + STOREY * k, STOREY])];
const zf = (k) => FLOORS[k][0]; // k = 0 begane grond, 1…22 woonlagen

// ---------- Plattegrond in (u, v), BAG-contour vereenvoudigd tot 0,6 m ----------
const NW_TOP = [-22.77, 8.4]; // noordhoek van de schuine noordwestkop
const uNW = (v) => NW_TOP[0] + (NW_TOP[1] - v) * (5.01 / 15.91); // lijn van de noordwestkop
const V_SW = -7.51, V_NE = 8.4, U_SE = 10.8;
const B = [uNW(V_SW), V_SW]; // westhoek
const TOWER = [B, [U_SE, V_SW], [U_SE, V_NE], NW_TOP];
const STRIP = rect(U_SE - 0.1, V_SW, 13.4, V_NE); // lage doorgang tussen toren en buurgebouw (begane grond)
// Uitkraging van de zuidwestgevel tot v = -8,6 over de westelijke helft vanaf de achtste woonlaag (AHN-DSM
// op het dak: -8,5…-9,0 tot u = -1, daarna -7,5…-8,0; startlaag van foto's).
const V_CANT = -8.6, U_CANT = 0.0, K_CANT = 8;
const C = [uNW(V_CANT), V_CANT];
const CANT = [[uNW(V_SW + 0.1), V_SW + 0.1], C, [U_CANT, V_CANT], [U_CANT, V_SW + 0.1]];
const LIFT_POLY = rect(-12.95, -2.6, -8.65, 1.1); // liftopbouw boven de liftschachten (3D BAG, twee reconstructies)

const zc = zf(K_CANT);
const cantilever = union([
  prism(CANT, zc, z(ROOF)),
  // kraag onder 45°: van de onderkant van de uitkraging terug naar de gevel
  Manifold.hull([...CANT.map(([u, v]) => [u, v, zc + 0.01]), [uNW(V_SW + 0.1), V_SW + 0.1, zc - 1.3], [U_CANT, V_SW + 0.1, zc - 1.3]]),
]);

// ---------- Balkonstapels ----------
// Per rand a→b (buitennormaal rechts van de looprichting): stapel van OUT m buiten de gevel tussen s0 en s1
// langs de rand, voor de woonlagen k0…k1, met per laag een open balkon van 0,9 m diep tussen zijschotten.
// Plaatsen uit de plattegronden (eerste en 22e laag), laagbereiken uit het gevelaanzicht (noordoost) en
// foto's (zuidwest); de bovenste balkons eindigen op de gemeten balkonrand.
const NE = [[U_SE, V_NE], NW_TOP];
const NW = [NW_TOP, C];
const SW = [B, [U_SE, V_SW]];
const SWC = [C, [U_CANT, V_CANT]];
const SE = [[U_SE, V_SW], [U_SE, V_NE]];
// De bovenkanten 88,3–88,7 en 66,4–66,7 komen uit de 3D BAG-reconstructie van het parkeergaragepand
// 0772100001018057, die de toren met zijn balkonstapels (AHN5) dubbel bevat.
const OUT = 2.0;
const STACKS = [
  { edge: NE, s: [28.0, 33.5], k: [1, 12] }, // noordoostgevel, noordhoek (gevelaanzicht)
  { edge: NE, s: [28.0, 33.5], k: [16, 22] },
  { edge: NE, s: [0.0, 4.3], k: [1, 6] }, // noordoostgevel, oosthoek (gevelaanzicht; 3D BAG u 6,5…)
  { edge: NE, s: [0.0, 4.3], k: [16, 22] },
  { edge: NW, s: [0.4, 6.0], k: [13, 15] }, // noordwestkop bij de noordhoek (gevelaanzicht, foto)
  { edge: NW, s: [11.0, 16.6], k: [1, 22] }, // noordwestkop bij de westhoek (plattegrond, foto, DSM 85–91)
  { edge: SW, s: [8.0, 13.7], k: [1, K_CANT - 1] }, // zuidwestgevel midden onder de uitkraging (plattegrond 1e laag)
  { edge: SWC, s: [4.5, 9.1], k: [K_CANT, 22] }, // zuidwestgevel op de uitkraging (3D BAG u -12,8…-8,4, v tot -10,8)
  { edge: SW, s: [23.3, 28.56], k: [1, 10] }, // zuidwestgevel, zuidhoek (plattegrond 1e laag, foto; niet in het DSM op het dak)
  { edge: SE, s: [1.6, 6.0], k: [1, 22], out: 2.1 }, // zuidoostkop (3D BAG v -6,6…-1,9 en -5,1…-0,2, 88,4–88,6)
  { edge: SE, s: [6.0, 15.3], k: [7, 15], out: 2.4, top: 66.5 }, // zuidoostkop, lagen 7–15 (3D BAG 66,4–66,7, gevelaanzicht)
];

function frame([a, b]) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  return { L, P: (s, t, h) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t, h] };
}
const stacks = [], stackCuts = [];
for (const { edge, s: [s0, s1], k: [k0, k1], out = OUT, top: topNap } of STACKS) {
  const { P } = frame(edge);
  const top = topNap !== undefined ? z(topNap) : k1 === 22 ? z(STACK_TOP) : zf(k1) + STOREY;
  const zb = zf(k0) - 0.3; // onderkant van de onderste balkonplaat
  stacks.push(Manifold.hull([s0, s1].flatMap((s) => [P(s, -0.1, top), P(s, out, top), P(s, -0.1, zb - out - 0.15), P(s, out, zb)])));
  for (let k = k0; k <= k1; k++) {
    const [z0, fh] = FLOORS[k];
    if (z0 + fh > top + 0.01) continue;
    const lo = z0 + 1.0, hi = z0 + fh - 0.3 - 0.9;
    stackCuts.push(Manifold.hull([s0 + 0.9, s1 - 0.9].flatMap((s) => [P(s, out + 0.2, lo), P(s, out - 0.9, lo), P(s, out + 0.2, hi + 0.9 + 0.2), P(s, out - 0.9, hi)])));
  }
}

const body = union([
  prism(TOWER, BASE, z(ROOF)),
  prism(STRIP, BASE, GF),
  cantilever,
  prism(LIFT_POLY, z(ROOF) - 0.1, z(LIFT)),
  ...stacks,
]);

// ---------- Gevelreliëf ----------
// Per laag een glasband achter een doorlopende witte vloerrand van 0,9 m, 0,4 m diep met een plafond onder
// 45°, alleen waar de gevel op die hoogte buitengevel is (per halve meter getest); begane grond met een
// plint van 0,6 m.
const DEPTH = 0.4;
const cuts = [...stackCuts];
function bands(edge) {
  const { L, P: Q } = frame(edge);
  const P = (s, depth, h) => Q(s, -depth, h);
  for (const [k, [z0, fh]] of FLOORS.entries()) {
    const lo = z0 + (k === 0 ? 0.6 : 0.9), hi = z0 + fh - DEPTH;
    let start = null;
    const flush = (s1) => {
      if (start !== null && s1 - start >= 0.9) cuts.push(Manifold.hull([P(start, -0.2, lo), P(s1, -0.2, lo), P(start, DEPTH, lo), P(s1, DEPTH, lo), P(start, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(start, DEPTH, hi), P(s1, DEPTH, hi)]));
      start = null;
    };
    for (let s = 0.95; s <= L - 0.95 + 1e-6; s += 0.5) {
      const ok = [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      });
      if (ok && start === null) start = s;
      if (!ok) flush(s - 0.5);
    }
    flush(L - 0.95);
  }
}
for (const edge of [NE, NW, SW, SWC, SE]) bands(edge);

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Hartje New York: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Hartje New York", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "uitsparingen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [[`building:${slug}-toren`, building]],
  catalog: {
    name: "Hartje New York (E' Tower)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 62.25, // NAP-maaiveld + geoïde NLGEO2018 ter plekke (43,93)
    groundOffsetMetres: -0.15,
    // 0772100001018057 is de parkeergarage onder het blok (geen verblijfsobjecten); de PDOK-reconstructie
    // ervan bevat de toren nog eens tot ellipsoïdisch 138,4 m en zou door het model heen steken. Op een
    // garage-inrit van 119 m² (NAP +22,4) na dubbelt hij alleen panden met een eigen reconstructie.
    replacesBuildings: ["NL.IMBAG.Pand.0772100001013392", "NL.IMBAG.Pand.0772100001018057"],
    description:
      "Woontoren Hartje New York (E' Tower, Wiel Arets Architects, 2013) aan de Gerard Philipslaan in het Stadionkwartier: glazen schijf op de BAG-contour met de schuine noordwestkop tot NAP +91,85 m (3D BAG, 70e percentiel van het dak) met een liftopbouw tot +93,45 m; per laag een glasband achter een doorlopende witte vloerrand (begane grond van 3,3 m en 22 woonlagen van 3,12 m), vanaf de achtste woonlaag een uitkraging van 1,1 m over de westelijke helft van de zuidwestgevel, elf balkonstapels van 2–2,4 m diep met per laag een open balkon die per hoogte van plaats wisselen (bovenste balkonranden +88,5 m) en aan de zuidoostkop een lage doorgang naar het buurgebouw. Vervangt ook de PDOK-reconstructie van de parkeergarage 0772100001018057, die de toren dubbel bevat. Oorsprong in het hart van de BAG-contour, X-as langs de lange gevels naar het zuidoosten (-36,83° op RD-oost). De lagen komen uit het gevelaanzicht van de architect; de plaats en laagbereiken van de balkonstapels, de startlaag van de uitkraging en de banddiepte zijn geschat uit plattegronden, 3D BAG en foto's.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      liftNapM: LIFT,
      topBalconyNapM: STACK_TOP,
      groundFloorM: GF,
      storeyHeightM: STOREY,
      floors: 22,
      cantileverM: +(V_SW - V_CANT).toFixed(2),
      cantileverFromFloor: K_CANT,
      balconyDepthM: OUT,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0772100001013392 (bouwjaar 2013, Gerard Philipslaan), 3D BAG LoD2.2 (AHN5 2024), AHN-DSM en -DTM 0,5 m, actuele orthoHR",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Eindhoven",
      "https://www.archdaily.com/445282/e-tower-wiel-arets-architects",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Hartje_New_York_in_Eindhoven.jpg",
      "https://commons.wikimedia.org/wiki/File:Hartje_New_York.jpg",
      "https://commons.wikimedia.org/wiki/File:Hartje_NY,_Eindhoven.jpg",
    ],
  },
});

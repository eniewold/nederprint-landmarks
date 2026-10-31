// Nimbus (Spoorstraat, Nijmegen, 2016, Hoogte Twee Architecten): woontoren van 24 lagen (begane grond
// plus 23) bij station Nijmegen, met aan weerszijden een lage vleugel van zes lagen in hetzelfde
// BAG-pand. De toren is een vierkant van baksteen; aan de westkant staan twee lagere bakstenen
// schijven voor de gevel (tot de 12e en de 17e laag), daarboven is de westgevel met grijs-blauwe
// pixelpanelen bekleed. De dakrand loopt schuin af van west naar oost ("de top is afgeschuind"),
// op het dak staat een installatieopbouw met zonnepanelen. De zuidoosthoek staat tot de bovenkant
// van de vleugels op één pijler; daaronder lopen de balkons van de oostvleugel door. De westvleugel
// is van donkergrijze baksteen met een balkonstapel tegen de toren, de oostvleugel heeft aan de
// zuidkant een strook verspringende balkons met een teruggelegde bovenste laag.
// Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG (LoD2.2), gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "nimbus-nijmegen";
// Gebouwstelsel: u langs de zuidgevel naar het oosten (-2,52° op RD-oost, BAG-randen evenwijdig binnen
// 0,05°), v haaks erop naar het noorden. Oorsprong in het hart van de toren.
const ORIGIN = [187310.7, 428508.0];
const ANGLE = -2.52;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = 22.6; // NAP, Spoorstraat en parkeerdek (AHN-DTM 22,5–22,7)
const GEOID = 43.73; // NLGEO2018 op 51,8442 N 5,8561 O
// De onderkant ligt 2,0 m onder het maaiveld: langs de noordgevel van de toren daalt de inrit van de
// parkeerkelder naar NAP +20,9 m.
const BASE = -2.0;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM en 3D BAG ----------
const ROOF = 94.9; // torendak (DSM 94,9 op de rand rondom de opbouw; 3D BAG 94,91–94,94)
const CROWN_W = 98.0; // schuine dakrand aan de westkant (3D BAG 97,95–98,13), loopt af tot het dak aan de oostgevel
const PLANT_W = 97.18, PLANT_E = 98.91; // installatieopbouw, schuin oplopend naar het oosten (DSM 97,2–98,8)
const STEP_S = 74.15; // zuidelijke schijf voor de westgevel (3D BAG 74,07–74,18)
const STEP_N = 59.35; // noordelijke schijf (3D BAG 59,30–59,41)
const WING = 41.7; // daken van beide vleugels (DSM 41,6–41,7; 3D BAG 41,63–41,70)
const SOLAR = 42.6; // zonnepanelenvelden op de vleugels (3D BAG 42,55–42,65)
const BALC = 38.6; // balkonstrook oostvleugel en balkonstapel westvleugel (DSM en 3D BAG 38,56–38,62)

// Lagen: begane grond 4,0 m, daarboven 23 lagen van 2,97 m (dak 72,31 m boven maaiveld = NAP +94,91; de
// schijven eindigen precies op de 12e en 17e laag en de vleugels op de 6e).
const STOREY = 2.97;
const LEVEL = (k) => (k === 0 ? 0 : 4.0 + (k - 1) * STOREY);
const FLOORS = Array.from({ length: 24 }, (_, k) => [LEVEL(k), LEVEL(k + 1) - LEVEL(k)]);
const upTo = (nap, from = 0) => FLOORS.filter(([zf, fh]) => zf + fh <= z(nap) + 0.3 && zf >= from - 0.01);

// ---------- Plattegrond in (u, v), BAG-contour en 3D BAG ----------
const U_W = -10.0, U_E = 9.8, V_S = -9.79, V_N = 9.8; // toren (dakrand uit 3D BAG en DSM)
const STEP_U = -11.33; // buitenkant van de schijven (BAG)
const STEP_SPLIT = 4.1; // grens tussen zuidelijke en noordelijke schijf (3D BAG)
const RECESS = { u0: -0.03, u1: 8.83, v: -6.91 }; // open zuidoosthoek onder de toren (BAG), pijler tot U_E
const WEST_WING = [[STEP_U, -6.64], [STEP_U, 4.6], [-27.49, 4.56], [-20.11, -8.94], [-16.5, -8.92], [-16.51, -6.64]];
const WEST_STACK = rect(-16.5, -8.92, STEP_U, -6.64); // balkonstapel tussen westvleugel en toren
const WEST_SOLAR = rect(-21.5, -4.8, -14.6, 3.6);
const EAST_BACK = -6.9; // achterkant van de balkonstrook
const eastEndU = (v) => 48.65 - 0.4157 * (v + 9.79); // schuine oostgevel van (48,65; -9,79) naar (42,68; 4,57)
const EAST_WING = [[U_E, EAST_BACK], [eastEndU(EAST_BACK), EAST_BACK], [42.68, 4.57], [U_E, 4.5]];
const EAST_BALC = [[RECESS.u0, V_S], [48.65, V_S], [eastEndU(EAST_BACK), EAST_BACK], [RECESS.u0, EAST_BACK]];
// Het deel van de balkonstrook onder de toren (westelijk van de pijler) hoort bij de torennode.
const RECESS_BALC = rect(RECESS.u0, V_S, RECESS.u1 + 0.05, RECESS.v);
const EAST_SOLAR = rect(15.3, -5.4, 41.4, 2.6);
const PLANT = rect(-7.05, -6.45, 6.3, 6.8);

// Schuin vlak z = a·u + c (NAP) boven een prisma.
const slopedTop = (poly, z0, napAtU0, slope, u0) => {
  const a = slope, c = z(napAtU0) - slope * u0, n = Math.hypot(a, 1);
  return prism(poly, z0, 200).trimByPlane([a / n, 0, -1 / n], -c / n);
};

// ---------- Massa's ----------
const crownSlope = (ROOF - CROWN_W) / (U_E - U_W); // 8,9° naar het oosten (3D BAG 8,6°)
const ring = Manifold.difference(prism(rect(U_W, V_S, U_E, V_N), 0, 1), prism(rect(U_W + 0.9, V_S + 0.9, U_E - 0.9, V_N + -0.9), -1, 2));
const crown = slopedTop([[U_W, V_S], [U_E, V_S], [U_E, V_N], [U_W, V_N]], z(ROOF) - 0.1, CROWN_W, crownSlope, U_W).intersect(
  ring.scale([1, 1, 300]).translate([0, 0, -50]),
);
const plant = slopedTop(PLANT, z(ROOF) - 0.1, PLANT_W, (PLANT_E - PLANT_W) / (6.3 + 7.05), -7.05);
// Open zuidoosthoek: tot de bovenkant van de balkonstrook, met een plafond onder 45° naar de gevel.
const recessCut = Manifold.hull([
  ...[RECESS.u0, RECESS.u1].flatMap((u) => [
    [u, RECESS.v, BASE - 1], [u, V_S - 0.6, BASE - 1],
    [u, RECESS.v, z(BALC)], [u, V_S - 0.6, z(BALC) + (RECESS.v - V_S) + 0.6],
  ]),
]);
const towerMass = union([
  prism(rect(U_W, V_S, U_E, V_N), BASE, z(ROOF)),
  prism(rect(STEP_U, V_S, U_W + 0.05, STEP_SPLIT), BASE, z(STEP_S)),
  prism(rect(STEP_U, STEP_SPLIT - 0.05, U_W + 0.05, V_N), BASE, z(STEP_N)),
  crown,
  plant,
]).subtract(recessCut).add(prism(RECESS_BALC, BASE, z(BALC)));
const westMass = union([
  prism(WEST_WING, BASE, z(WING)),
  prism(WEST_STACK, BASE, z(BALC)),
  prism(WEST_SOLAR, z(WING) - 0.1, z(SOLAR)),
]);
const eastMass = union([
  prism(EAST_WING, BASE, z(WING)),
  prism(EAST_BALC, BASE, z(BALC)),
  prism(EAST_SOLAR, z(WING) - 0.1, z(SOLAR)),
]).subtract(towerMass);
const massing = union([towerMass, westMass, eastMass]);

// ---------- Gevelreliëf ----------
const DEPTH = 0.35;
// Deterministische 'willekeur' voor het verspringende vensterpatroon in de baksteen.
const hash = (...k) => {
  let h = 2166136261;
  for (const x of k) h = Math.imul(h ^ Math.round(x * 100), 16777619) >>> 0;
  return ((h ^ (h >>> 13)) >>> 0) / 4294967295;
};
// Nis langs de rand a→b (buitennormaal rechts van de looprichting), van s0 tot s1, met een plafond onder
// 45°; alleen als de gevel daar buitengevel is (straal van buitenaf raakt de massa op de gevel).
function niche(cuts, a, b, s0, s1, lo, hi, depth = DEPTH) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, t, h) => [a[0] + d[0] * s - n[0] * t, a[1] + d[1] * s - n[1] * t, h];
  if (s1 - s0 < 0.9 || hi - lo < 0.5) return;
  const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + depth - 0.05].every((h) => {
    const from = P(s, -3, h), hit = massing.rayCast(from, P(s, 1, h))[0];
    const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
    return at > 2.95 && at < 3.05;
  }));
  if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.2, hi + depth + 0.2), P(s1, -0.2, hi + depth + 0.2), P(s0, depth, hi), P(s1, depth, hi)]));
}
const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
// Baksteengevel: vensters van 1,2 of 1,8 m op een travee van 2,4 m, per laag verspringend.
function brick(cuts, key, a, b, floors, { pitch = 2.4, chance = 0.55 } = {}) {
  const L = len(a, b), bays = Math.floor((L - 1.0) / pitch), w = (L - bays * pitch) / 2;
  for (const [zf, fh] of floors) {
    if (zf === 0) continue;
    for (let k = 0; k < bays; k++) {
      if (hash(key, zf, k) > chance) continue;
      const width = hash(key, zf, k, 1) < 0.35 ? 1.8 : 1.2;
      const shift = (hash(key, zf, k, 2) - 0.5) * (pitch - width - 0.5);
      const s0 = w + k * pitch + (pitch - width) / 2 + shift;
      niche(cuts, a, b, s0, s0 + width, zf + 0.9, zf + fh - 0.35 - DEPTH);
    }
  }
}
// Regelmatig raster (pixelgevel, vleugels).
function grid(cuts, a, b, floors, { pitch = 3.0, width = 1.5, sill = 0.9 } = {}) {
  const L = len(a, b), bays = Math.max(1, Math.floor((L - 0.9) / pitch)), w = (L - bays * pitch) / 2;
  for (const [zf, fh] of floors) for (let k = 0; k < bays; k++) {
    const s0 = w + k * pitch + (pitch - width) / 2;
    niche(cuts, a, b, s0, s0 + width, zf + sill, zf + fh - 0.35 - DEPTH);
  }
}
// Plint: hoge pui per travee op de begane grond.
const plinth = (cuts, a, b, pitch = 3.3, width = 2.4) => grid(cuts, a, b, [FLOORS[0]], { pitch, width, sill: 0.5 });

// Toren
const towerCuts = [];
const S0 = [U_W, V_S], S1 = [U_E, V_S], N1 = [U_E, V_N], N0 = [U_W, V_N];
brick(towerCuts, 1, S0, S1, FLOORS);
brick(towerCuts, 2, S1, N1, FLOORS);
brick(towerCuts, 3, N1, N0, FLOORS);
grid(towerCuts, N0, S0, FLOORS, { pitch: 3.9, width: 1.5 }); // pixelgevel boven de schijven
brick(towerCuts, 4, [STEP_U, V_N], [STEP_U, STEP_SPLIT], upTo(STEP_N), { chance: 0.6 });
brick(towerCuts, 5, [STEP_U, STEP_SPLIT], [STEP_U, V_S], upTo(STEP_S), { chance: 0.6 });
plinth(towerCuts, S0, [RECESS.u0, V_S]);
plinth(towerCuts, N1, N0);
// Glazen hoekloggia's: zuidwesthoek laag 17–20, zuidoosthoek laag 12–14 (foto's), 0,6 m diep.
for (const [k0, k1, corner] of [[17, 20, "sw"], [12, 14, "se"]]) {
  for (const [zf, fh] of FLOORS.slice(k0, k1 + 1)) {
    const lo = zf + 0.6, hi = zf + fh - 0.35 - 0.6;
    if (corner === "sw") { niche(towerCuts, S0, S1, 0, 2.6, lo, hi, 0.6); niche(towerCuts, N0, S0, len(N0, S0) - 2.6, len(N0, S0), lo, hi, 0.6); }
    else { niche(towerCuts, S0, S1, len(S0, S1) - 2.6, len(S0, S1), lo, hi, 0.6); niche(towerCuts, S1, N1, 0, 2.6, lo, hi, 0.6); }
  }
}

// Westvleugel: donkergrijze baksteen met verspringende vensters; balkonstapel met per laag een open
// balkon van 0,9 m diep tussen zijwanden van 0,9 m.
const westCuts = [];
WEST_WING.forEach((a, i) => {
  const b = WEST_WING[(i + 1) % WEST_WING.length];
  if (len(a, b) > 4) { brick(westCuts, 10 + i, a, b, FLOORS.slice(0, 6), { pitch: 2.6, chance: 0.6 }); plinth(westCuts, a, b); }
});
for (const [zf, fh] of FLOORS.slice(1, 5)) niche(westCuts, [-16.5, -8.92], [STEP_U, -8.92], 0.9, 5.17 - 0.9, zf + 1.0, zf + fh - 0.3 - 0.9, 0.9);
niche(westCuts, [-16.5, -8.92], [STEP_U, -8.92], 0.9, 5.17 - 0.9, 0.3, 4.0 - 0.3 - 0.9, 0.9); // entree

// Oostvleugel: strook verspringende balkons (laag 1–4), glazen pui op de begane grond, teruggelegde
// bovenste laag, rode baksteen met een regelmatig raster aan de noordkant en de schuine oostgevel.
const eastCuts = [];
const B0 = [RECESS.u0, V_S], B1 = [48.65, V_S];
const balcCuts = [];
for (const [k, [zf, fh]] of FLOORS.slice(1, 5).entries()) {
  const pitch = 3.6, off = (k % 2) * 1.8, L = len(B0, B1);
  for (let s = 0.9 + off; s + 2.7 <= L - 0.9; s += pitch) niche(balcCuts, B0, B1, s, s + 2.7, zf + 1.0, zf + fh - 0.3 - 0.9, 0.9);
}
plinth(balcCuts, B0, B1, 3.6, 2.7);
towerCuts.push(...balcCuts);
eastCuts.push(...balcCuts);
grid(eastCuts, [U_E, EAST_BACK], [eastEndU(EAST_BACK), EAST_BACK], [FLOORS[5]], { pitch: 3.6, width: 2.7, sill: 0.5 });
grid(eastCuts, [42.68, 4.57], [U_E, 4.5], FLOORS.slice(1, 6), { pitch: 3.0, width: 1.5 });
grid(eastCuts, [48.65, V_S], [42.68, 4.57], FLOORS.slice(1, 6), { pitch: 3.0, width: 1.5 });

const tower = towerMass.subtract(union(towerCuts));
const west = westMass.subtract(union(westCuts)).subtract(towerMass);
const east = eastMass.subtract(union(eastCuts));
const nodes = [["toren", tower, towerCuts], ["westvleugel", west, westCuts], ["oostvleugel", east, eastCuts]].map(([name, m, cuts]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(2)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "nissen", cuts.length);
  return [`building:${slug}-${name}`, m];
});

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Nimbus",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: +(GROUND + GEOID).toFixed(2), // NAP-maaiveld + NLGEO2018-geoïde (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    // Straatniveau aan de Spoorstraat en op het parkeerdek; noordelijk van de toren ligt de kelderinrit
    // (NAP +20,9) en de lage weg (+20,2), die het model anders laten wegzakken.
    groundSamplePoints: [[-5, -13], [15, -13], [35, -13.5], [-20, 8]],
    replacesBuildings: ["NL.IMBAG.Pand.0268100000087616"],
    description:
      "Woontoren Nimbus aan de Spoorstraat bij station Nijmegen met de twee vleugels van hetzelfde BAG-pand: toren van 19,8 × 19,6 m tot NAP +94,9 m (24 lagen) met een dakrand die van +98,0 m aan de westkant schuin afloopt naar het dak aan de oostgevel en een installatieopbouw tot +98,9 m; voor de westgevel twee bakstenen schijven van 1,3 m tot +74,15 en +59,35 m; de zuidoosthoek staat op een pijler boven de balkonstrook. Westvleugel (donkergrijs) en oostvleugel (balkonstrook tot +38,6 m) tot +41,7 m met zonnepanelenvelden tot +42,6 m. Vensters als blinde nissen, in de baksteen verspringend, in de pixelgevel en de vleugels in een raster; glazen hoekloggia's. Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG. Oorsprong in het hart van de toren, X-as langs de zuidgevel (-2,52° op RD-oost). Verdiepingshoogte, vensterpatroon, balkons, hoekloggia's en de hoogte van de open zuidoosthoek zijn geschat; de parkeerkelder onder het dek (op maaiveld) is weggelaten.",
    realWorld: {
      groundNapM: GROUND,
      geoidM: GEOID,
      roofNapM: ROOF,
      crownNapM: [CROWN_W, ROOF],
      plantNapM: [PLANT_W, PLANT_E],
      westStepsNapM: [STEP_S, STEP_N],
      wingRoofNapM: WING,
      solarNapM: SOLAR,
      balconyNapM: BALC,
      floors: 24,
      groundFloorM: 4.0,
      storeyHeightM: STOREY,
      towerPlanM: [+(U_E - U_W).toFixed(2), +(V_N - V_S).toFixed(2)],
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0268100000087616 (bouwjaar 2016), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG LoD2.2 NL.IMBAG.Pand.0268100000087616 (AHN4 2021): dakrand, schijven, vleugels",
      "NLGEO2018-geoïde (data/geoid in de webshop)",
      "https://nl.wikipedia.org/wiki/Nimbus_(Nijmegen)",
      "https://www.pss-archi.eu/immeubles/NL-268-70281.html",
      "https://commons.wikimedia.org/wiki/File:Nimbus_Nijmegen_2016.jpg",
      "https://commons.wikimedia.org/wiki/File:Nimbus_Nijmegen.jpg",
      "https://commons.wikimedia.org/wiki/File:Nimbus_Nijmegen_voormalig_Belastingkantoor.jpg",
    ],
  },
});

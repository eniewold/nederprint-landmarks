// Crystal Building A (Rivium Boulevard 201-231, Capelle aan den IJssel; Groep 5 Architecten, 2001): glazen
// kantoorschijf van tien lagen aan de westkant van de Rivium Boulevard, tegenover XO Hotels Rivium. De schijf van
// 52 × 15 m loopt in drie treden op naar de boulevard: NAP +27,5 m in het westen, +38,5 m in het midden en aan de
// oostkant een "kristal": het dak loopt onder 37 en daarna 47 graden op tot een rand van +50,7 m op de oostgevel.
// Aan de zuidoosthoek een entreeblok van twee lagen; het westelijke deel van de schijf staat op kolommen.
// Hoogtes uit de 3D BAG LoD2.2 en het AHN-DSM, contour uit de BAG (hoofdas 17,47 graden op RD-oost), begane grond
// en kolommen uit de BGT, gevelindeling uit de luchtfoto's.
import { Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "crystal-building-a";
// Modelstelsel: u langs de lange gevels naar het oostnoordoosten (17,47 graden op RD-oost), v naar het noorden;
// oorsprong in het hart van de schijf op het plein aan de zuidkant.
const ORIGIN = [97107.5, 436472.0];
const ANGLE = 17.47;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = 5.0; // NAP, plein aan de zuid- en oostkant (AHN-DTM 5,0-5,4); noordkant -1,1, westkant 2,5-3,5
const BASE = -7.0; // NAP -2,0
const z = (nap) => nap - GROUND;
const DEPTH = 0.35;

// ---------- Plattegrond (u, v) uit de BAG ----------
const SLAB = [[-25.21, -7.2], [25.23, -7.65], [26.31, 7.64], [-26.06, 8.09]];
const ENTRANCE = [[17.6, -12.9], [24.2, -13.5], [24.6, -7.0], [17.9, -7.0]]; // entreeblok, overlapt de schijf
const GROUND_U = -15.1; // westelijk daarvan staat de schijf op kolommen (BGT)
const COLUMNS = [[-20.4, 7.3], [-19.7, -6.4]];
const STEP1 = -3.0, STEP2 = 11.3, STEP3 = 21.3; // treden in het dak

// ---------- Hoogtes (NAP) ----------
const L = Array.from({ length: 11 }, (_, k) => 5.0 + 3.4 * k); // vloeren, tien lagen tot 39,0
const ROOF_W = 27.45, ROOF_M = 38.5; // 3D BAG 27,44-27,47 en 38,48-38,52
const SLOPE1 = 0.754, RIDGE1 = 46.0; // 37 graden van 38,5 (u 11,3) tot 46,0 (u 21,3)
const SLOPE2 = 1.06; // 47 graden tot 50,7 op de oostgevel (u 25,8)
const ENTRANCE_ROOF = 9.5;
const PLANT_W = [[-14.5, -3.1, -11.3, -0.7], 30.1]; // installatieblok op het westdak (3D BAG 29,6-30,3)
const PLANT_M = [[5.8, -0.3, 9.4, 2.4], 41.1]; // liftopbouw op het middendak (3D BAG 41,1)

// Deel van de schijf tussen u0 en u1 tot hoogte top.
const slabPart = (u0, u1, z0, z1) => prism(SLAB, z0, z1).trimByPlane([1, 0, 0], u0).trimByPlane([-1, 0, 0], -u1);
// Houdt alles onder het vlak z = z0 + s (u - u0).
const belowPlane = (solid, s, u0, z0) => {
  const n = Math.hypot(s, 1);
  return solid.trimByPlane([s / n, 0, -1 / n], (s * u0 - z0) / n);
};

let body = union([
  slabPart(GROUND_U, 30, BASE, z(L[1]) + 0.1), // begane grond (BGT)
  slabPart(-30, STEP1, z(L[1]), z(ROOF_W)),
  slabPart(STEP1 - 0.1, STEP2, z(L[1]), z(ROOF_M)),
  // Kristal: het dak volgt het hoogste van de twee vlakken (37 graden vanaf u 11,3, 47 graden vanaf u 21,3).
  belowPlane(slabPart(STEP2 - 0.1, 30, z(L[1]), z(51)), SLOPE1, STEP2, z(ROOF_M)),
  belowPlane(slabPart(STEP3 - 0.1, 30, z(L[1]), z(51)), SLOPE2, STEP3, z(RIDGE1)),
  prism(ENTRANCE, BASE, z(ENTRANCE_ROOF)),
  ...COLUMNS.map(([u, v]) => prism(rect(u - 0.45, v - 0.45, u + 0.45, v + 0.45), BASE, z(L[1]) + 0.1)),
  prism(rect(...PLANT_W[0]), z(ROOF_W) - 0.1, z(PLANT_W[1])),
  prism(rect(...PLANT_M[0]), z(ROOF_M) - 0.1, z(PLANT_M[1])),
]);

// ---------- Gevels: glasband per laag ----------
function exposed(solid, from, to) {
  const hit = solid.rayCast(from, to)[0];
  if (!hit) return false;
  const at = Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.9 && at < 3.1;
}
// Band langs een rechte gevel a→b (lucht rechts van a→b), alleen waar over minstens 0,9 m buitengevel is.
function lineBand(solid, a, b, lo, hi, cuts, depth = DEPTH) {
  const Ln = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / Ln, (b[1] - a[1]) / Ln], n = [d[1], -d[0]];
  const P = (s, dd, h) => [a[0] + d[0] * s - n[0] * dd, a[1] + d[1] * s - n[1] * dd, h];
  let start = null;
  const seg = (s0, s1) => cuts.push(Manifold.hull([P(s0, -0.25, lo), P(s1, -0.25, lo), P(s0, depth, lo), P(s1, depth, lo), P(s0, -0.25, hi + 0.25), P(s1, -0.25, hi + 0.25), P(s0, depth, hi - depth), P(s1, depth, hi - depth)]));
  for (let s = 0.6; s <= Ln - 0.6 + 1e-9; s += 0.5) {
    const ok = [lo + 0.05, hi - 0.05].every((h) => exposed(solid, P(s, -3, h), P(s, 1, h)));
    if (ok && start === null) start = s;
    if (!ok && start !== null) {
      if (s - 0.5 - start >= 0.9) seg(start, s - 0.5);
      start = null;
    }
  }
  if (start !== null && Ln - 0.6 - start >= 0.9) seg(start, Ln - 0.6);
}
const cuts = [];
const ring = ccw(SLAB);
// Glas van +1,3 tot +3,1 m boven elke vloer (laag 0 is de begane grond, de band hoger: glazen plint).
for (let k = 0; k < 10; k++) {
  const [lo, hi] = k === 0 ? [L[0] + 0.5, L[1] - 0.5] : [L[k] + 1.3, L[k] + 3.1];
  for (let i = 0; i < ring.length; i++) lineBand(body, ring[i], ring[(i + 1) % ring.length], z(lo), z(hi), cuts, k === 0 ? 0.5 : DEPTH);
}
const ent = ccw(ENTRANCE);
for (const [lo, hi] of [[L[0] + 0.5, L[1] - 0.5], [L[1] + 0.4, ENTRANCE_ROOF - 0.5]]) {
  for (let i = 0; i < ent.length; i++) lineBand(body, ent[i], ent[(i + 1) % ent.length], z(lo), z(hi), cuts, 0.4);
}
console.log("gevelnissen", cuts.length);
body = body.subtract(union(cuts));
{
  const parts = body.decompose();
  if (parts.length !== 1) throw new Error(`${parts.length} losse delen`);
  console.log(slug, body.status(), "genus", body.genus(), "driehoeken", body.numTri());
}

await writeLandmark({
  slug,
  base: BASE,
  nodes: [[`building:${slug}`, body]],
  catalog: {
    name: "Crystal Building A (Rivium)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 48.5, // NAP 5,0 + geoïde NLGEO2018 circa 43,5 (ijking Rivium Quadrant)
    groundOffsetMetres: -0.15,
    // Plein aan de zuid- en oostkant bij de entree (AHN-DTM 5,0-5,4); noord en west liggen tot 6 m lager.
    groundSamplePoints: [[6, -12], [0, -10], [-10, -10], [26, -12]],
    replacesBuildings: ["NL.IMBAG.Pand.0502100000021052"],
    description:
      "Crystal Building A (2001, Groep 5 Architecten), glazen kantoorschijf van 52 × 15 m aan de westkant van de Rivium Boulevard, tegenover XO Hotels Rivium. Het dak loopt in treden op naar de boulevard: NAP +27,5 m in het westen, +38,5 m in het midden en aan de oostkant een kristal dat onder 37 en 47 graden oploopt tot +50,7 m op de oostgevel; entreeblok van twee lagen aan de zuidoosthoek, het westelijke deel op kolommen, installatieblokken op de daken. Glasband per laag van 3,4 m als blinde nis. Oorsprong in het hart van de schijf op het plein (NAP +5,0 m), X-as langs de lange gevels (17,47 graden op RD-oost). Hoogtes uit de 3D BAG en het AHN; lagen en gevelbanden geschat uit de luchtfoto's.",
    realWorld: {
      built: 2001,
      architect: "Groep 5 Architecten",
      floors: 10,
      groundNapM: GROUND,
      roofWestNapM: ROOF_W,
      roofMiddleNapM: ROOF_M,
      ridgeNapM: 50.7,
      roofSlopesDegrees: [37, 47],
      entranceRoofNapM: ENTRANCE_ROOF,
      footprintM: [52, 15.3],
      storeyHeightM: 3.4,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0502100000021052 (bouwjaar 2000; Rivium Boulevard 201-223), BGT (begane grond en kolommen), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG LoD2.2 (AHN5 2023)",
      "https://www.pss-archi.eu/immeubles/NL-502-73263.html (Groep 5 Architecten, 2001, tien lagen, circa 45 m)",
      "https://skyscraperpage.com/b63184 (Crystal Building West, 2001, tien lagen)",
      "https://capellebouwtaandestad.nl/project/rivium-boulevard-301-321 (schuine luchtfoto van de gemeente met beide Crystal Buildings op de voorgrond)",
    ],
  },
});

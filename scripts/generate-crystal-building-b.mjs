// Crystal Building B (Rivium Boulevard 234, Capelle aan den IJssel; Groep 5 Architecten, 2001): glazen
// kantoorschijf van vijftien lagen aan de oostkant van de Rivium Boulevard, tegenover XO Hotels Rivium en
// spiegelbeeldig aan Crystal Building A. De licht gebogen schijf van 69 × 15 m loopt in treden op naar de
// boulevard: NAP +34,8 m in het oosten, +38,5 m in het midden en +56,9 m in het westen, waar het dak als een
// kristal onder 42 graden oploopt tot een rand van +71 m op de westgevel. Aan de zuidwesthoek een entreeblok
// van twee lagen; het oostelijke deel van de schijf staat op kolommen.
// Hoogtes uit de 3D BAG LoD2.2 en het AHN-DSM, contour uit de BAG (hoofdas 2,64 graden op RD-oost), begane grond
// en kolommen uit de BGT, gevelindeling uit de luchtfoto's.
import { Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "crystal-building-b";
// Modelstelsel: u langs de lange gevels naar het oosten (2,64 graden op RD-oost), v naar het noorden; oorsprong
// in het hart van de schijf op het niveau van het plein aan de boulevard.
const ORIGIN = [97205.0, 436489.0];
const ANGLE = 2.64;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = 5.2; // NAP, plein aan de boulevard bij de entree (AHN-DTM 5,0-5,3); oostkant 1,6, noordkant -0,5
const BASE = -7.2; // NAP -2,0
const z = (nap) => nap - GROUND;
const DEPTH = 0.35;

// ---------- Plattegrond (u, v) uit de BAG: beide lange gevels bollen 1,4 m naar het noorden ----------
const SLAB = [[-33.4, -8.17], [-27.0, -7.66], [-11.7, -6.91], [2.7, -6.75], [16.4, -7.08], [33.4, -8.19], [34.72, 7.1], [17.73, 8.19], [2.79, 8.56], [-19.62, 8.08], [-34.73, 7.07]];
const ENTRANCE = [[-32.3, -14.0], [-25.6, -13.3], [-26.0, -7.0], [-32.7, -7.0]]; // entreeblok, overlapt de schijf
const GROUND_U = 21.7; // oostelijk daarvan staat de schijf op kolommen (BGT)
const COLUMNS = [[25.8, -6.6], [26.7, 6.6]];
const STEP1 = -5.0, STEP2 = 17.6; // treden in het dak
const SLOPE_U = -18.5; // vanaf hier loopt het dak naar het westen op

// ---------- Hoogtes (NAP) ----------
const L = Array.from({ length: 16 }, (_, k) => 5.2 + 3.46 * k); // vloeren, vijftien lagen tot 57,1
const ROOF_E = 34.8, ROOF_M = 38.5, ROOF_W = 56.9; // 3D BAG 34,83, 38,53 en 56,87
const SLOPE = 0.888; // 41,6 graden, van 56,9 (u -18,5) tot 71,3 op de westgevel (3D BAG 70,4-71,6)
const ENTRANCE_ROOF = 9.5;
const LIFT = [[-16.0, -0.4, -11.5, 2.2], 59.5]; // liftopbouw op het westdak (3D BAG 59,5)

const slabPart = (u0, u1, z0, z1) => prism(SLAB, z0, z1).trimByPlane([1, 0, 0], u0).trimByPlane([-1, 0, 0], -u1);
// Houdt alles onder het vlak z = z0 + s (u0 - u) (oplopend naar het westen).
const belowPlane = (solid, s, u0, z0) => {
  const n = Math.hypot(s, 1);
  return solid.trimByPlane([-s / n, 0, -1 / n], (-s * u0 - z0) / n);
};

let body = union([
  slabPart(-40, GROUND_U, BASE, z(L[1]) + 0.1), // begane grond (BGT)
  slabPart(-40, STEP1, z(L[1]), z(ROOF_W)),
  belowPlane(slabPart(-40, SLOPE_U, z(ROOF_W) - 0.1, z(72)), SLOPE, SLOPE_U, z(ROOF_W)), // kristal boven het westdak
  slabPart(STEP1 - 0.1, STEP2, z(L[1]), z(ROOF_M)),
  slabPart(STEP2 - 0.1, 40, z(L[1]), z(ROOF_E)),
  prism(ENTRANCE, BASE, z(ENTRANCE_ROOF)),
  ...COLUMNS.map(([u, v]) => prism(rect(u - 0.45, v - 0.45, u + 0.45, v + 0.45), BASE, z(L[1]) + 0.1)),
  prism(rect(...LIFT[0]), z(ROOF_W) - 0.1, z(LIFT[1])),
]);

// ---------- Gevels: glasband per laag ----------
function exposed(solid, from, to) {
  const hit = solid.rayCast(from, to)[0];
  if (!hit) return false;
  const at = Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.9 && at < 3.1;
}
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
// Glas van +1,3 tot +3,1 m boven elke vloer; de begane grond een glazen plint. Boven het schuine glasvlak
// (westgevel boven 56,9) geen banden: exposed() ziet daar de schuine kant.
for (let k = 0; k < 15; k++) {
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
    name: "Crystal Building B (Rivium)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 48.7, // NAP 5,2 + geoïde NLGEO2018 circa 43,5 (ijking Rivium Quadrant)
    groundOffsetMetres: -0.15,
    // Plein aan de boulevard bij de entree (AHN-DTM 5,0-5,3); oost en noord liggen tot 6 m lager.
    groundSamplePoints: [[-36, -10], [-36, 0], [-38, -14], [-36, -5]],
    replacesBuildings: ["NL.IMBAG.Pand.0502100000021056"],
    description:
      "Crystal Building B (2001, Groep 5 Architecten), licht gebogen glazen kantoorschijf van 69 × 15 m aan de oostkant van de Rivium Boulevard, tegenover XO Hotels Rivium en spiegelbeeldig aan Crystal Building A. Het dak loopt in treden op naar de boulevard: NAP +34,8 m in het oosten, +38,5 m in het midden en +56,9 m in het westen, waar het dak als een kristal onder 42 graden oploopt tot +71 m op de westgevel; entreeblok van twee lagen aan de zuidwesthoek, het oostelijke deel op kolommen, liftopbouw op het westdak. Glasband per laag van 3,46 m als blinde nis. Oorsprong in het hart van de schijf op het niveau van het plein aan de boulevard (NAP +5,2 m), X-as langs de lange gevels (2,64 graden op RD-oost). Hoogtes uit de 3D BAG en het AHN; lagen en gevelbanden geschat uit de luchtfoto's.",
    realWorld: {
      built: 2001,
      architect: "Groep 5 Architecten",
      floors: 15,
      groundNapM: GROUND,
      roofEastNapM: ROOF_E,
      roofMiddleNapM: ROOF_M,
      roofWestNapM: ROOF_W,
      ridgeNapM: 71.3,
      roofSlopeDegrees: 42,
      entranceRoofNapM: ENTRANCE_ROOF,
      footprintM: [69.4, 15.3],
      storeyHeightM: 3.46,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0502100000021056 (bouwjaar 2000; Rivium Boulevard 202-234), BGT (begane grond en kolommen), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG LoD2.2 (AHN5 2023)",
      "https://www.pss-archi.eu/immeubles/NL-502-73262.html (Groep 5 Architecten, 2001, vijftien lagen, circa 59,5 m)",
      "https://capellebouwtaandestad.nl/project/rivium-boulevard-301-321 (schuine luchtfoto van de gemeente met beide Crystal Buildings op de voorgrond)",
    ],
  },
});

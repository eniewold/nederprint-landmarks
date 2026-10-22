// De Rokade (Spijkenisse, 2010, Klunder Architecten): woontoren van 33 lagen op een plint van zes
// lagen met parkeren en daarboven evenementendekken. De toren heeft een plattegrond als
// parallellogram: de lange gevels liggen in de lijn van de plint, de kopgevels lopen schuin. Hij
// bestaat uit een zwarte (noordwestelijke) en een witte (zuidoostelijke) helft met daartussen een
// inspringende strook met gekleurde balkonpanelen; op het dak een installatiekast en een mastkroon.
// Contouren uit de BAG, de torenvorm en de hoogtes uit het AHN-DSM, de indeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "rokade-spijkenisse";
// Gebouwstelsel: u langs de lange gevels naar het zuidoosten (-50,4° op RD-oost, BAG-randen evenwijdig
// binnen 0,1°), v haaks erop naar het noordoosten. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [83005.63, 429862.36];
const ANGLE = -50.4;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 5.6; // NAP, maaiveld aan de zuidwestkant (AHN-DTM 5,5–5,7, PDOK-voet 49,26 ellipsoïdisch);
// de Hongerlandsedijk aan de noordoostkant ligt op +8,5
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM ----------
const PLINTH_ROOF = 27.9; // plint met evenementendekken (27,8–28,0)
const ROOF = 110.3; // torendak (110,2–110,4 over het hele dak)
const PLANT = 114.4; // installatiekast op de naad tussen de helften (114,3–114,5)
const CROWN = 120.0; // open mastkroon aan de zuidwestgevel (DSM 116–122, als dicht blok)

// ---------- Plattegrond in (u, v) ----------
const PLINTH = [
  [-51.64, -11.29], [2.21, -11.33], [2.21, -9.77], [8.41, -9.77], [8.41, -11.34], [51.66, -11.38],
  [51.67, -2.0], [53.03, -2.0], [53.03, 1.82], [51.68, 1.82], [51.68, 11.2], [-51.62, 11.29],
  [-51.63, 1.9], [-52.99, 1.9], [-52.99, -1.9], [-51.63, -1.9],
];
// Toren: kopgevels onder 55° op de lange gevels (u neemt 0,69 m af per meter v), gemeten op de
// dakrand in het DSM bij v = -10…10.
const SKEW = 0.69;
const V0 = -11.3, V1 = 11.25;
const left = (v) => -13.8 - SKEW * v, right = (v) => 26.2 - SKEW * v, mid = (v) => 6.2 - SKEW * v;
const TOWER = [[left(V0), V0], [right(V0), V0], [right(V1), V1], [left(V1), V1]];
// Naad tussen de zwarte en de witte helft: 3 m brede, 1,2 m diepe strook met balkons over de hele
// torenhoogte, in beide lange gevels.
const SEAM_W = 3.0, SEAM_D = 1.2;

const body = union([
  prism(PLINTH, BASE, z(PLINTH_ROOF)),
  prism(TOWER, BASE, z(ROOF)),
  // Installatiekast en mastkroon op de plek waar het DSM ze meet.
  prism(rect(4.0, -5.2, 7.6, 3.2), z(ROOF) - 0.1, z(PLANT)),
  prism(rect(4.0, -10.4, 7.6, -5.6), z(ROOF) - 0.1, z(CROWN)),
]).subtract(union([V0, V1].map((v) => {
  // Strook evenwijdig aan de schuine kopgevels, van 1 m buiten de gevel tot SEAM_D erin.
  const s = v < 0 ? -1 : 1, vo = v + s, vi = v - s * SEAM_D;
  return prism([[mid(vo) - SEAM_W / 2, vo], [mid(vo) + SEAM_W / 2, vo], [mid(vi) + SEAM_W / 2, vi], [mid(vi) - SEAM_W / 2, vi]], z(PLINTH_ROOF) + 0.01, z(ROOF) + 1);
})));

// ---------- Gevelreliëf ----------
// Plint: begane grond 4,6 m en vijf lagen van 3,56 m; toren: 27 lagen van 3,05 m tot het dak.
const PLINTH_FLOORS = [[0, 4.6], ...Array.from({ length: 5 }, (_, k) => [4.6 + 3.56 * k, 3.56])];
const TOWER_FLOORS = Array.from({ length: 27 }, (_, k) => [z(PLINTH_ROOF) + 3.05 * k, 3.05]);
const DEPTH = 0.35;
const cuts = [];
// Nissen langs de rand a→b (buitennormaal rechts van de looprichting). mode "window": vensters per
// travee; mode "band": één doorlopende band per laag tussen penanten van 0,9 m. Plafond onder 45°.
function face(a, b, floors, { mode, pitch = 2.7, width = 1.4, sill = 0.9, header = 0.35 }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const spans = [];
  if (mode === "band") spans.push([0.9, L - 0.9]);
  else {
    const bays = Math.max(1, Math.floor((L - 0.9) / pitch)), w = (L - bays * pitch) / 2;
    for (let k = 0; k < bays; k++) spans.push([w + k * pitch + (pitch - width) / 2, w + k * pitch + (pitch + width) / 2]);
  }
  for (const [zf, fh] of floors) {
    const lo = zf + sill, hi = zf + fh - header - DEPTH;
    if (hi - lo < 0.9) continue;
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
// Toren: lange gevels per helft met vensters per travee (2,7 m); kopgevels: zwart met loggia's
// (brede nissen), wit met een doorlopende glasband op de hoek.
const sw = [[left(V0), V0], [mid(V0) - SEAM_W / 2, V0], [mid(V0) + SEAM_W / 2, V0], [right(V0), V0]];
const ne = [[right(V1), V1], [mid(V1) + SEAM_W / 2, V1], [mid(V1) - SEAM_W / 2, V1], [left(V1), V1]];
face(sw[0], sw[1], TOWER_FLOORS, { mode: "window" });
face(sw[2], sw[3], TOWER_FLOORS, { mode: "window" });
face(ne[0], ne[1], TOWER_FLOORS, { mode: "window" });
face(ne[2], ne[3], TOWER_FLOORS, { mode: "window" });
face([left(V1), V1], [left(V0), V0], TOWER_FLOORS, { mode: "window", pitch: 4.4, width: 3.2 });
face([right(V0), V0], [right(V1), V1], TOWER_FLOORS, { mode: "band" });
// Naad: balkonbanden per laag op de achterwand.
for (const v of [V0, V1]) {
  const s = v < 0 ? -1 : 1, vb = v - s * SEAM_D, a = [mid(vb) - SEAM_W / 2, vb], b = [mid(vb) + SEAM_W / 2, vb];
  face(s < 0 ? a : b, s < 0 ? b : a, TOWER_FLOORS, { mode: "band", sill: 1.0 });
}
// Plint (linksom, buitenkant rechts van elke rand): vensters op de vijf woonlagen, winkelpuien op de
// begane grond.
for (let i = 0; i < PLINTH.length; i++) {
  const a = PLINTH[i], b = PLINTH[(i + 1) % PLINTH.length];
  if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 8) continue;
  face(a, b, PLINTH_FLOORS.slice(1), { mode: "window" });
  face(a, b, PLINTH_FLOORS.slice(0, 1), { mode: "window", pitch: 6.0, width: 4.5, sill: 0.3 });
}

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`De Rokade: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("De Rokade", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:rokade-spijkenisse", building]],
  catalog: {
    name: "De Rokade",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 49.3, // PDOK-terrein aan de zuidwestkant (ellipsoïdisch); de dijk aan de noordoostkant ligt hoger
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-30, -20], [0, -20], [30, -20]],
    replacesBuildings: ["NL.IMBAG.Pand.0612100000000569"],
    description:
      "De Rokade in Spijkenisse: woontoren van 33 lagen op een plint van zes lagen (dak NAP +27,9 m) over de hele BAG-contour van 103 × 22,5 m. De toren heeft een plattegrond als parallellogram (40 m langs de gevel, kopgevels onder 55°, uit het AHN-DSM) en een dak op +110,3 m met een installatiekast tot +114,4 m en een mastkroon tot +120 m; tussen de zwarte en de witte helft een 3 m brede, 1,2 m diepe naad met balkonbanden. Vensters per travee als blinde nissen, loggia's in de noordwestelijke kopgevel en een glasband in de zuidoostelijke, winkelpuien en vensters in de plint. Oorsprong in het hart van de BAG-contour, X-as langs de lange gevels naar het zuidoosten (-50,4° op RD-oost). Verdiepingshoogtes, naad, kroon en gevelindeling zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      plinthRoofNapM: PLINTH_ROOF,
      roofNapM: ROOF,
      plantNapM: PLANT,
      crownNapM: CROWN,
      towerLengthM: +(right(0) - left(0)).toFixed(2),
      towerDepthM: +(V1 - V0).toFixed(2),
      endFaceAngleDegrees: +((Math.atan2(1, SKEW) * 180) / Math.PI).toFixed(1),
      floors: { plinth: 6, tower: 27 },
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0612100000000569 (bouwjaar 2010), actuele orthoHR, AHN-DSM en -DTM 0,5 m, PDOK 3D-gebouwtegel (LoD2.2)",
      "https://nl.wikipedia.org/wiki/De_Rokade_(Spijkenisse)",
      "https://commons.wikimedia.org/wiki/File:Spijkenisse_DSCF1949.JPG",
      "https://commons.wikimedia.org/wiki/File:Hooge_flats_kant_oude_maas_Spijkenisse.jpg",
      "https://commons.wikimedia.org/wiki/File:Vier_Werelden_en_De_Rokade_Spijkenisse_2016.jpg",
      "https://commons.wikimedia.org/wiki/File:Spijkenisse_uitzicht_De_Stoep_richting_De_Elementen_2013.jpg",
    ],
  },
});

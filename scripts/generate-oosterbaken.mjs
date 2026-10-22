// Oosterbaken (Hoogvliet, Rotterdam, 2007): woontoren van 33 lagen aan het Oedevlietsepark. Een
// plattegrond als pijlpunt: een rechte noordwest- en noordoostgevel in baksteen en aan de parkkant
// (zuid) twee inspringende gevels met een donker paneel en glasstroken. Bovenin kragen drie glazen
// kopvolumes met een witte rand uit (noordhoek, zuidpunt van de oostarm en de westkop); langs de
// holle zuidgevels springt de bovenste laag terug achter een terras. Onderaan een lage westvleugel
// in twee hoogtes en een lage entree aan de noordkant.
// Contouren uit de BAG, hoogtes uit het AHN-DSM en de PDOK-reconstructie (LoD2.2), de kopvolumes,
// glasstroken en het vensterstramien uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "oosterbaken";
// Gebouwstelsel: u langs de noordwestgevel (39,3° linksom op RD-oost, BAG-randen evenwijdig binnen
// 0,1°), v haaks erop naar het noordwesten. Oorsprong in het hart van de BAG-contour.
const ORIGIN = [83721.19, 430909.54];
const ANGLE = 39.3;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.1; // NAP, maaiveld aan de parkkant (AHN-DTM 0,0…0,3, PDOK-terrein 43,8 ellipsoïdisch); de straat
// aan de noordkant ligt op +3,3 en de vijver tegen de zuidwestgevel op -0,8
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const ROOF = 97.2; // AHN-DSM 97,2–97,6 over het hele dak; PDOK 140,9 ellipsoïdisch
const TERRACE = 91.6; // terras langs de holle zuidgevels (DSM 91,4–92,6, PDOK 135,1)
const SETBACK = 2.5; // bovenste laag springt 2,5 m terug achter dat terras (breedte van de 91,5-strook)
const PLANT_HIGH = 102.1; // installatieopbouw (DSM 102,0–102,3)
const PLANT_LOW = 100.2; // liftopbouw ernaast (DSM 100,0–100,3)
const PLANT_STRIP = 98.5; // smalle installatiestrook (DSM 98,2–98,6)
const WING_WEST = 6.5; // westvleugel, buitenste deel (PDOK 50,2 ellipsoïdisch, AHN geen meting: plat dak met water)
const WING_MID = 9.4; // westvleugel tegen de toren (PDOK 53,1)
const ENTRANCE = 8.4; // lage entree aan de noordkant (PDOK 51,6–52,7)
const LANTERN_NORTH = 66.0; // onderkant kopvolume noordhoek (foto's: circa twee derde van de hoogte)
const LANTERN_EAST = 70.0; // onderkant kopvolume zuidpunt oostarm (foto's: 9 lagen onder het dak)
const LANTERN_WEST = 68.0; // onderkant kopvolume westkop (foto's)

// ---------- Plattegronden in (u, v), uit de BAG-contour ----------
const TOWER_W = -13.3; // westgevel van de toren: AHN-DSM (97 m tot u = -13) en PDOK (-13,3)
const TOWER = [
  [TOWER_W, 3.18], [-10.6, 3.16], [-8.35, -2.25], [-10.28, -3.07], [-7.48, -9.8], [-5.38, -8.95],
  [6.31, -15.84], [6.32, -18.71], [13.42, -18.74], [13.45, 9.72], [6.44, 9.72], [6.44, 10.27], [TOWER_W, 10.27],
];
// Holle zuidgevels: de twee glasstroken (-67°) en het donkere paneel (-30,5°).
const HOLLOW = [[-10.6, 3.16], [-8.35, -2.25], [-10.28, -3.07], [-7.48, -9.8], [-5.38, -8.95], [6.31, -15.84]];
const WING_A = rect(-25.14, 3.19, -19.0, 10.26);
const WING_B = rect(-19.0, 3.19, TOWER_W + 0.05, 10.26);
const ENTRANCE_POLY = [[6.44, 9.6], [13.06, 9.6], [13.06, 9.72], [11.99, 9.72], [11.99, 15.42], [6.44, 15.43]];
// Kopvolumes: deel binnen de gevel en uitkraging (1,0–1,2 m, foto's).
const LANTERNS = [
  { inner: rect(8.6, 5.6, 13.45, 9.72), outer: rect(8.6, 5.6, 13.45, 10.9), from: LANTERN_NORTH },
  { inner: rect(6.32, -18.72, 13.43, -12.5), outer: rect(6.32, -19.9, 14.45, -12.5), from: LANTERN_EAST },
  { inner: rect(TOWER_W, 3.18, TOWER_W + 4.0, 10.27), outer: rect(TOWER_W - 1.2, 3.6, TOWER_W + 4.0, 10.27), from: LANTERN_WEST },
];

// Prisma tot het dak met een terugsprong boven het terras langs de holle gevels.
const hollowCut = (() => {
  // Strook van SETBACK m breed binnen elke holle gevel, boven het terras.
  const pieces = [];
  for (let i = 0; i + 1 < HOLLOW.length; i++) {
    const [a, b] = [HOLLOW[i], HOLLOW[i + 1]];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
    const n = [-d[1], d[0]]; // naar binnen (de toren ligt links van de rand bij deze looprichting)
    const e = 0.6; // iets voorbij de hoeken zodat de stroken aansluiten
    const p = (s, t) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t];
    pieces.push(prism([p(-e, -2), p(L + e, -2), p(L + e, SETBACK), p(-e, SETBACK)], z(TERRACE), z(ROOF) + 1));
  }
  return union(pieces);
})();

const lantern = ({ inner, outer, from }) => {
  // Uitkraging met een kraag onder 45° naar de gevel, zodat hij zonder steun print.
  const reach = 1.25;
  return Manifold.hull([
    ...outer.map(([u, v]) => [u, v, z(ROOF)]),
    ...outer.map(([u, v]) => [u, v, z(from)]),
    ...inner.map(([u, v]) => [u, v, z(from) - reach]),
  ]);
};

const body = union([
  prism(TOWER, BASE, z(ROOF)).subtract(hollowCut),
  ...LANTERNS.map(lantern),
  prism(WING_A, BASE, z(WING_WEST)),
  prism(WING_B, BASE, z(WING_MID)),
  prism(ENTRANCE_POLY, BASE, z(ENTRANCE)),
  // Installaties op het dak (AHN-DSM), deels ook op de luchtfoto.
  prism(rect(-0.8, -2.6, 4.6, 2.9), z(ROOF) - 0.1, z(PLANT_HIGH)),
  prism(rect(-3.8, -3.8, -0.8, 0.0), z(ROOF) - 0.1, z(PLANT_LOW)),
  prism(rect(7.4, -9.6, 9.0, -4.4), z(ROOF) - 0.1, z(PLANT_STRIP)),
]);

// ---------- Gevelreliëf ----------
// Lagen: begane grond 4,0 m, daarboven 2,9 m (33 lagen tot het dak).
const STOREY = 2.9;
const FLOORS = [[0, 4.0], ...Array.from({ length: 31 }, (_, k) => [4.0 + STOREY * k, STOREY])];
const DEPTH = 0.35;
const cuts = [];
// Nissen langs de rand a→b (het gebouw ligt rechts van de looprichting bij een linksom-veelhoek,
// dus de buitennormaal is (dy, -dx)). mode "window": vensters van `width` per travee `pitch`;
// mode "band": één doorlopende glasband per laag tussen penanten van 0,9 m. Het plafond van de nis loopt
// onder 45°, zodat de nis na de printcorrectie open blijft.
function face(a, b, { mode, pitch = 2.4, width = 1.2, from = -10, to = 200, sill = 0.9, header = 0.35 }) {
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
      // Alleen waar de gevel buitengevel is: stralen van 3 m buiten naar binnen moeten op de gevel stuiten.
      const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const edge = (poly, i) => [poly[i], poly[(i + 1) % poly.length]];
const T = TOWER; // linksom, dus de buitennormaal ligt rechts van elke rand
// Baksteen: noordwest-, noordoost- en westgevel met vensters per travee.
face([6.44, 10.27], [TOWER_W, 10.27], { mode: "window", to: ROOF });
face([13.42, -18.74], [13.45, 5.6], { mode: "window", to: ROOF });
face([TOWER_W, 10.27], [TOWER_W, 3.18], { mode: "window", pitch: 2.3, to: ROOF });
// Donker paneel (-30,5°) en glasstroken (-67°) in de holle zuidgevels, tot het terras.
face(...edge(T, 5), { mode: "window", pitch: 2.2, to: TERRACE });
face(...edge(T, 6), { mode: "window", pitch: 2.2, to: TERRACE });
face(...edge(T, 1), { mode: "band", to: TERRACE });
face(...edge(T, 3), { mode: "band", to: TERRACE });
// Glasstroken onder de kopvolumes: zuidpunt van de oostarm en de noordhoek.
face(...edge(T, 8), { mode: "band", to: LANTERN_EAST });
face([13.45, 5.6], [13.45, 9.72], { mode: "band", from: ENTRANCE, to: LANTERN_NORTH });
// Kopvolumes: glas met een witte rand, een band per laag.
for (const { outer, from } of LANTERNS) for (let i = 0; i < 4; i++) face(...edge(outer, i), { mode: "band", from, to: ROOF });
// Westvleugel: vensters op de begane grond.
face([-25.14, 10.26], [-25.14, 3.19], { mode: "window", to: WING_WEST });
face([-25.14, 3.19], [TOWER_W, 3.19], { mode: "window", to: WING_WEST });
face([TOWER_W, 10.26], [-25.14, 10.26], { mode: "window", to: WING_WEST });

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Oosterbaken: ${parts.length} losse delen`);
console.log("Oosterbaken", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:oosterbaken", building]],
  catalog: {
    name: "Oosterbaken",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.8, // PDOK-terrein op de grasstrook langs de holle zuidgevels (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    // Grasstrook aan de parkkant; zonder deze punten zou de lader de vijver (42,9) als maaiveld nemen.
    groundSamplePoints: [[-9, -9], [0, -15], [3, -15]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000431103"],
    description:
      "Oosterbaken in Hoogvliet: woontoren van 33 lagen op een plattegrond als pijlpunt (BAG-contour), dak op NAP +97,2 m met installatieopbouwen tot +102,1 m; langs de holle zuidgevels een terras op +91,6 m met de bovenste laag 2,5 m terug. Drie glazen kopvolumes kragen 1,0–1,2 m uit vanaf +66 tot +70 m tot het dak (noordhoek, zuidpunt van de oostarm, westkop), met een kraag onder 45°. Onderaan de westvleugel (+6,5 en +9,4 m) en de entree aan de noordkant (+8,4 m). Vensters in de bakstenen gevels en het donkere paneel als blinde nissen per travee, glasstroken als doorlopende band per laag. Hoogtes uit het AHN-DSM en de PDOK-reconstructie. Oorsprong in het hart van de BAG-contour, X-as langs de noordwestgevel (39,3° op RD-oost). Uitkraging en onderkant van de kopvolumes, verdiepingshoogte en vensterstramien zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      terraceNapM: TERRACE,
      setbackM: SETBACK,
      plantNapM: [PLANT_LOW, PLANT_HIGH],
      westWingNapM: [WING_WEST, WING_MID],
      entranceNapM: ENTRANCE,
      lanternBottomNapM: { north: LANTERN_NORTH, east: LANTERN_EAST, west: LANTERN_WEST },
      storeyHeightM: STOREY,
      floors: 33,
      facadeAngleDegrees: ANGLE,
      estimatedLanterns: true,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000431103 (bouwjaar 2007), actuele orthoHR, AHN-DSM en -DTM 0,5 m, PDOK 3D-gebouwtegel (LoD2.2)",
      "https://nl.wikipedia.org/wiki/Oosterbaken",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_toren_hoogvliet_oosterbaken.jpg",
      "https://commons.wikimedia.org/wiki/File:Oosterbaken_1.jpg",
      "https://commons.wikimedia.org/wiki/File:Oosterbaken_4_copy.jpg",
      "https://commons.wikimedia.org/wiki/File:Hoogvliet_De_Oosterbaken_lente_2007.jpg",
      "https://commons.wikimedia.org/wiki/File:Hoogvliet_Oosterbaken.jpg",
    ],
  },
});

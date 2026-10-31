// De Statendam (Botersloot / Binnenrotte, Rotterdam, 2009, Hans Kollhoff): woontoren van 22 lagen
// achter de Blaaktoren, op een vierkante plattegrond van 28 × 28 m. Een plint van drie lagen in grijze
// natuursteen met op de begane grond afgeschuinde hoeken onder een schuin vlak; daarboven per gevel twee
// bakstenen vleugels met elk een erker en een grijze natuurstenen middenstrook die iets terugligt.
// Boven een stenen kroonlijst een koperen mansardekap met per gevel twee steile bakstenen
// topgevels met een boogvenster; de topgevels van twee gevels komen bij elke hoek in een kilgoot samen.
// Midden in het platte dak ligt een verdiept lichthof.
// Contour uit de BAG, dakvlakken uit de 3D BAG (LoD2.2, AHN5 2023) en het AHN-DSM, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "statendam-rotterdam";
// Gebouwstelsel: u langs de gevels naar het oostnoordoosten (22,5° op RD-oost; BAG-randen 22,3–22,6°),
// v haaks erop naar het noordnoordwesten. Oorsprong in het hart van de vier BAG-hoekpunten.
const ORIGIN = [93135.84, 437382.75];
const ANGLE = 22.5;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 1.3; // NAP, maaiveld aan de Botersloot (AHN-DTM 1,15–1,4; 3D BAG 1,29); Binnenrotte 1,7
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 en AHN-DSM ----------
const EAVE = 65.0; // bovenkant kroonlijst en voet van de mansardekap (3D BAG 64,85 aan de gevel)
const FLAT = 74.48; // plat dak binnen de mansardekap (3D BAG 74,47–74,49; DSM 74–75)
const RIDGE = 74.75; // nokken van de topgevels (3D BAG 74,6–74,9)
const GABLE_TIP = 75.3; // top van de stenen afdekking van de topgevels (3D BAG 75,1–75,5)
const WELL = 71.86; // vloer van het lichthof in het dak (3D BAG 71,85–71,88; DSM 72)
const PITCH = 57.5; // helling van de topgeveldaken (3D BAG 57,3–57,7°)

// ---------- Plattegrond in (u, v), BAG-contour (hoekpunten binnen 0,1 m) ----------
const U = 14.03, V = 13.93;
const FOOT = rect(-U, -V, U, V);
const TOP = 8.3; // halve breedte van het platte dak; ook de as van de topgevels (3D BAG 8,1–8,5)
const CHAMFER = 5.7; // afgeschuinde hoeken op de begane grond, 5,7 m langs beide gevels (BAG-tussenpunten)
const STRIP = 2.6; // halve breedte van de grijze middenstrook (foto's)
const STRIP_DEPTH = 0.4; // terugligging van de middenstrook (geschat)

// ---------- Lagen (lokaal z) ----------
// Plint: begane grond 4,8 m, eerste verdieping 4,4 m (met de stenen band), tweede 2,8 m; daarboven
// 18 woonlagen tot de onderkant van de kroonlijst; de bovenste laag (loggia's) ligt direct eronder.
const PLINTH_TOP = 12.0;
const CORNICE_LO = 62.4; // aanzet van de kraag onder de kroonlijst
const CORNICE_FACE = 62.8; // onderkant van de voorkant van de kroonlijst
const STOREY = (CORNICE_FACE - 0.1 - PLINTH_TOP) / 18;
const FLOORS = [[0, 4.8], [4.8, 4.4], [9.2, 2.8], ...Array.from({ length: 18 }, (_, k) => [PLINTH_TOP + STOREY * k, STOREY])];
const BAND = [9.2, 9.7]; // stenen band boven de eerste verdieping, 0,3 m uitstekend
const CHAMFER_LO = 4.8; // plafond van de afgeschuinde hoek aan de afschuining
const CHAMFER_SLOPE = 46; // graden; het schuine vlak loopt tot de hoek op tot ca. +9,0 m
const DEPTH = 0.35;

// Gevelvlakken: P(t, diepte, z) met t langs de gevel en diepte naar binnen.
const FACES = [
  { name: "noord", half: U, deep: V, P: (t, d, h) => [t, V - d, h] },
  { name: "zuid", half: U, deep: V, P: (t, d, h) => [-t, -V + d, h] },
  { name: "oost", half: V, deep: U, P: (t, d, h) => [U - d, -t, h] },
  { name: "west", half: V, deep: U, P: (t, d, h) => [-U + d, t, h] },
];
// Vensterraster per gevel (gespiegeld): grijze middenstrook twee vensters, per bakstenen vleugel een
// dubbel venster aan de binnenkant, de erker in het midden en een dubbel venster bij de hoek.
const GREY_WINDOWS = [[0.75, 1.75]];
const BRICK_WINDOWS = [[3.6, 5.9], [10.6, 12.9]];
const ERKER = { c: 8.25, base: 1.5, front: 0.9, out: 0.6 }; // halve breedtes, uitsteek 0,6 m
const ERKER_TOP = FLOORS.at(-1)[0] + 1.0; // tot de borstwering van de bovenste laag (balkon erop)

// ---------- Hoofdvolume ----------
const hullPts = (pts) => Manifold.hull(pts);
const footPrism = prism(FOOT, BASE, 200);
const k = Math.tan((PITCH * Math.PI) / 180);
const zb = z(EAVE) - 0.1;
// Topgevel (zadeldak haaks op de gevel) rond t = c, van diepte 0 tot TOP-binnenkant, afgesneden op de plattegrond.
function gable(face, c, ridge, d0, d1) {
  const w = (ridge - zb) / k;
  const pts = [];
  for (const d of [d0, d1]) pts.push(face.P(c - w, d, zb), face.P(c + w, d, zb), face.P(c, d, ridge));
  return hullPts(pts).intersect(footPrism);
}
const mansard = hullPts([
  ...rect(-U, -V, U, V).map(([x, y]) => [x, y, zb]),
  ...rect(-TOP, -TOP, TOP, TOP).map(([x, y]) => [x, y, z(FLAT)]),
]);
const gables = [], fronts = [];
for (const f of FACES) for (const s of [-1, 1]) {
  gables.push(gable(f, s * TOP, z(RIDGE), 0, f.deep - TOP + 0.3));
  fronts.push(gable(f, s * TOP, z(GABLE_TIP), 0, 0.9)); // afdekking: de topgevel steekt 0,55 m boven het dak uit
}
let body = union([prism(FOOT, BASE, z(EAVE)), mansard, ...gables, ...fronts]);

// Afgeschuinde hoeken op de begane grond: verticaal vlak tussen de punten 5,7 m van de hoek, erboven
// een schuin vlak onder 46° dat naar de hoek oploopt (het grijze driehoekige vlak op de foto's).
const chamferCuts = [];
for (const [sx, sy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  const a = [sx * (U - CHAMFER), sy * V], b = [sx * U, sy * (V - CHAMFER)], c = [sx * (U + 3), sy * (V + 3)];
  const sC = -3 * Math.SQRT2; // afstand van c tot de hoek langs de diagonaal (buiten)
  const dLine = CHAMFER / Math.SQRT2;
  const t = Math.tan((CHAMFER_SLOPE * Math.PI) / 180);
  chamferCuts.push(hullPts([
    [...a, BASE - 1], [...b, BASE - 1], [...c, BASE - 1],
    [...a, CHAMFER_LO], [...b, CHAMFER_LO], [...c, CHAMFER_LO + (dLine - sC) * t],
  ]));
}
// Grijze middenstrook ligt boven de plint terug tot onder de kroonlijst; het plafond loopt onder 45°
// door in de kraag van de kroonlijst.
const stripCuts = FACES.map((f) => hullPts([
  f.P(-STRIP, -0.5, PLINTH_TOP), f.P(STRIP, -0.5, PLINTH_TOP), f.P(-STRIP, STRIP_DEPTH, PLINTH_TOP), f.P(STRIP, STRIP_DEPTH, PLINTH_TOP),
  f.P(-STRIP, -0.5, CORNICE_LO + 0.5), f.P(STRIP, -0.5, CORNICE_LO + 0.5), f.P(-STRIP, STRIP_DEPTH, CORNICE_LO - STRIP_DEPTH), f.P(STRIP, STRIP_DEPTH, CORNICE_LO - STRIP_DEPTH),
]));
// Lichthof midden in het platte dak.
const well = prism(rect(-2.6, -2.0, 2.7, 2.4), z(WELL), z(FLAT) + 5);
body = body.subtract(union([...chamferCuts, ...stripCuts, well]));

// ---------- Gevelreliëf ----------
// Vensters als blinde nissen met een plafond onder 45°, alleen waar de gevel op die hoogte buitengevel is.
const niche = (f, s0, s1, lo, hi, off = 0) => hullPts([
  f.P(s0, off - 0.2, lo), f.P(s1, off - 0.2, lo), f.P(s0, off + DEPTH, lo), f.P(s1, off + DEPTH, lo),
  f.P(s0, off - 0.2, hi + DEPTH + 0.2), f.P(s1, off - 0.2, hi + DEPTH + 0.2), f.P(s0, off + DEPTH, hi), f.P(s1, off + DEPTH, hi),
]);
const exposed = (solid, f, s0, s1, lo, hi, off) => [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
  const from = f.P(s, -3, h), hit = solid.rayCast(from, f.P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 + off && at < 3.05 + off;
}));
const cuts = [];
for (const f of FACES) for (const [zf, fh] of FLOORS) {
  const ground = zf === 0;
  const lo = zf + (ground ? 0.5 : 0.9), hi = zf + fh - (ground ? 0.6 : 0.35) - DEPTH;
  for (const sg of [-1, 1]) {
    const windows = [...BRICK_WINDOWS.map((w) => [w, 0]), ...(zf >= PLINTH_TOP - 0.01 ? GREY_WINDOWS.map((w) => [w, STRIP_DEPTH]) : [])];
    if (zf < PLINTH_TOP - 0.01) windows.push([[ERKER.c - ERKER.base + 0.3, ERKER.c + ERKER.base - 0.3], 0], [[0.75, 1.75], 0]);
    for (const [[a, b], off] of windows) {
      const s0 = sg > 0 ? a : -b, s1 = sg > 0 ? b : -a;
      if (exposed(body, f, s0, s1, lo, hi, off)) cuts.push(niche(f, s0, s1, lo, hi, off));
    }
  }
}
// Boogvensters in de topgevels: halfrond van 3,2 m straal op de kroonlijst, als nis met een plafond
// dat naar binnen onder 45° zakt.
const ARCH_R = 3.2, ARCH_SPRING = z(EAVE) + 0.35;
for (const f of FACES) for (const sg of [-1, 1]) {
  const c = sg * TOP, pts = [];
  for (let i = 0; i <= 16; i++) {
    const a = (Math.PI * i) / 16, x = c + ARCH_R * Math.cos(a), h = ARCH_SPRING + ARCH_R * Math.sin(a);
    pts.push(f.P(x, -0.2, h + 0.2), f.P(x, DEPTH, h - DEPTH));
  }
  pts.push(f.P(c - ARCH_R, -0.2, ARCH_SPRING - 0.3), f.P(c + ARCH_R, -0.2, ARCH_SPRING - 0.3), f.P(c - ARCH_R, DEPTH, ARCH_SPRING - 0.3), f.P(c + ARCH_R, DEPTH, ARCH_SPRING - 0.3));
  cuts.push(hullPts(pts));
}
body = body.subtract(union(cuts));

// ---------- Erkers, kroonlijst en plintband ----------
// Erker: driezijdig, 3,0 m breed aan de gevel, 1,8 m aan de voorkant, 0,6 m uitstekend; van de plint
// tot de borstwering van de bovenste laag, met een kraag onder 45° op de plint. Per laag een venster in
// de voorkant als nis.
const erkers = [], erkerCuts = [];
for (const f of FACES) for (const sg of [-1, 1]) {
  const c = sg * ERKER.c, o = ERKER.out;
  erkers.push(hullPts([
    f.P(c - ERKER.base, 0.1, PLINTH_TOP - o), f.P(c + ERKER.base, 0.1, PLINTH_TOP - o),
    f.P(c - ERKER.front, -o, PLINTH_TOP), f.P(c + ERKER.front, -o, PLINTH_TOP),
    f.P(c - ERKER.base, 0.1, ERKER_TOP), f.P(c + ERKER.base, 0.1, ERKER_TOP),
    f.P(c - ERKER.front, -o, ERKER_TOP), f.P(c + ERKER.front, -o, ERKER_TOP),
  ]));
  for (const [zf, fh] of FLOORS) {
    if (zf < PLINTH_TOP - 0.01 || zf + fh > ERKER_TOP + 0.01) continue;
    erkerCuts.push(niche(f, c - ERKER.front + 0.2, c + ERKER.front - 0.2, zf + 0.9, zf + fh - 0.35 - DEPTH, -o));
  }
}
const ring = (out, h) => rect(-U - out, -V - out, U + out, V + out).map(([x, y]) => [x, y, h]);
const cornice = hullPts([...ring(0, CORNICE_LO), ...ring(0.4, CORNICE_FACE), ...ring(0.4, z(EAVE))]);
const band = hullPts([...ring(0, BAND[0] - 0.3), ...ring(0.3, BAND[0]), ...ring(0.3, BAND[1])]);
const building = union([body, union(erkers).subtract(union(erkerCuts)), cornice, band]).subtract(union(chamferCuts));

const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Statendam: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Statendam", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length + erkerCuts.length, "laag", STOREY.toFixed(3));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:statendam-rotterdam-toren", building]],
  catalog: {
    name: "De Statendam",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.83, // NAP +1,3 m + 43,53 (NLGEO2018 43,59, geijkt op Blaak 10)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0599100000754175"],
    description:
      "De Statendam aan de Botersloot (Hans Kollhoff, 2009): vierkante toren van 28,1 × 27,9 m op de BAG-contour tot de kroonlijst op NAP +65,0 m, met een grijze plint van drie lagen waarvan de hoeken op de begane grond 5,7 m zijn afgeschuind onder een schuin vlak van 46°, een stenen band op +10,5 m, per gevel twee bakstenen vleugels met elk een erker van 0,6 m en een grijze middenstrook die 0,4 m terugligt, en een kroonlijst die 0,4 m uitsteekt. Daarboven een mansardekap tot het platte dak op +74,48 m met een lichthof tot +71,86 m en per gevel twee topgevels met een zadeldak onder 57,5° (nok +74,75 m, afdekking +75,3 m) en een boogvenster, die bij elke hoek in een kilgoot samenkomen. Dakvlakken uit de 3D BAG (LoD2.2) en het AHN-DSM, gevelindeling uit foto's. Oorsprong in het hart van de BAG-contour, X-as langs de gevels (22,5° op RD-oost). Verdiepingshoogte, vensterraster, erkers, terugligging van de middenstrook en de helling onder de afgeschuinde hoeken zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      corniceNapM: EAVE,
      flatRoofNapM: FLAT,
      gableRidgeNapM: RIDGE,
      gableTipNapM: GABLE_TIP,
      lightWellNapM: WELL,
      gablePitchDegrees: PITCH,
      planM: [+(2 * U).toFixed(2), +(2 * V).toFixed(2)],
      floors: 22,
      storeyHeightM: +STOREY.toFixed(3),
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000754175 (bouwjaar 2009), actuele orthoHR, AHN-DSM en -DTM 0,5 m; 3D BAG LoD2.2 (AHN5 2023)",
      "https://nl.wikipedia.org/wiki/De_Statendam",
      "https://commons.wikimedia.org/wiki/File:De_Statendam.jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_De_Statendam_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Statendam_-_Binnenrotte_-_City_of_Rotterdam_(22159316163).jpg",
    ],
  },
});

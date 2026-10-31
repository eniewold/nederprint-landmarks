// De Witte Keizer (Vissersdijk / Keizerstraat, Rotterdam, KCAP 2001–2005): woontoren van circa 71 m op
// een driehoekig perceel aan de Leuvekolk, naast Five55 en tegenover Blaak 333. Op de Kanzo-taak heette
// hij "De Hoofdpoort", maar dat is de oude naam van het kantoorgebouw Blaak 333 (1962, gesloopt 2023);
// BAG-pand 0599100000394211 (bouwjaar 2005, 107 woningen aan de Vissersdijk) is De Witte Keizer.
// Opbouw: een plint over het hele perceel tot NAP +18,0 m (glazen begane grond, kantoorlagen), daarop
// twee vleugels die samen een L vormen: een zuidvleugel langs de Blaak-kant en een noordvleugel langs
// de oostgevel, allebei tot NAP +73,1 m. In de binnenhoek blijft het driehoekige dak van de plint
// over, met in de hoek tussen de vleugels een teruggelegen glazen strook. In de zuidgevel zit een
// open insnijding van 6,8 × 4,45 m vanaf +32,45 m tot het dak, daaronder een glazen strook. Een
// teruggelegen glazen laag scheidt de plint van de woonlagen. Witte prefab-betongevel met een raster
// van vensters (vier per vleugelgevel op de zuidkant, travee circa 4 m). Op het dak een
// installatieblok met een uitlaat, een langwerpige kanaalkast, een kast op de noordvleugel en vijf
// ventilatieschachten.
// Contouren uit de BAG, hoogtes uit de 3D BAG (AHN5 2023) en het AHN4-DSM, gevelindeling uit foto's.
import { CrossSection, Manifold, ccw, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "hoofdpoort-rotterdam";
// Gebouwstelsel: u langs de zuidgevel naar het oostnoordoosten (19,87° op RD-oost; zuid- en noordgevel
// evenwijdig, oostgevel haaks erop binnen 0,01°), v haaks erop naar het noordnoordwesten. Oorsprong
// midden in het gebouw, in de hoek tussen de twee vleugels zuidoostelijk van de plint.
const ORIGIN = [92835.0, 437160.0];
const ANGLE = 19.87;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 2.1; // NAP, Vissersdijk aan de noord- en westkant (AHN-DTM 2,0–2,2; 3D BAG-maaiveld 2,04);
// de Blaak-kant in het zuiden ligt op +3,0…+3,3
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 en AHN-DSM ----------
const ROOF = 73.08; // dak van beide vleugels (3D BAG 73,06–73,09, 70e percentiel 73,09; DSM 73,0–73,1)
const PODIUM = 17.97; // dak van de plint in de binnenhoek (3D BAG 17,95–17,98; DSM-mediaan 17,94)
const NOTCH_FLOOR = 32.45; // bodem van de insnijding in de zuidgevel (3D BAG 32,39–32,52; DSM 32,47)
const PLANT = 74.6; // installatieblok (3D BAG 74,41–74,79; DSM-mediaan 74,5)
const PLANT_STACK = 75.8; // uitlaat op het installatieblok (DSM 75,4–76,0)
const DUCT = 74.4; // kanaalkast (DSM 74,36–74,46)
const NORTH_BOX = 75.6; // kast op de noordvleugel (DSM 75,2–76,3; 3D BAG 74,4 voor een deel van het bovenvlak)

// ---------- Plattegrond in (u, v), BAG-contour vereenvoudigd (knikjes < 0,9 m weg) ----------
const FOOT = [[-23.93, -12.55], [15.87, -12.55], [15.87, 21.04], [0.31, 21.04], [0.31, 18.93], [-19.41, 2.8]];
const NORTH_FACE_V = 5.75; // noordgevel van de zuidvleugel (3D BAG 5,39…6,06, DSM 5,5–6,0)
const DIAG_U = (v) => 0.31 - ((18.93 - v) / 16.13) * 19.72; // schuine noordwestgevel van de plint
const SOUTH_WING = [[-23.93, -12.55], [15.87, -12.55], [15.87, NORTH_FACE_V], [DIAG_U(NORTH_FACE_V), NORTH_FACE_V], [-19.41, 2.8]];
const WEST_FACE_U = 0.28; // westgevel van de noordvleugel (3D BAG 0,17–0,50, DSM 0,3–0,8)
const NORTH_WING = [[WEST_FACE_U, NORTH_FACE_V - 0.15], [15.87, NORTH_FACE_V - 0.15], [15.87, 21.04], [WEST_FACE_U, 21.04]];
const NOTCH = { u0: -6.8, u1: 0.0, v0: -12.55, v1: -8.1 }; // insnijding zuidgevel (DSM u -6,9…-0,1; 3D BAG -7,2…0,4)
const CORNER = { u0: -2.0, u1: WEST_FACE_U + 1.0, v0: NORTH_FACE_V - 1.0, v1: 8.2 }; // glazen hoekstrook, 1 m diep

// ---------- Lagen (z boven maaiveld) ----------
// Begane grond 4,6 m glas; vleugels: drie kantoorlagen tot 15,9 m, een teruggelegen glazen laag tot
// 18,9 m en 18 woonlagen van 2,86 m tot 70,38 m (borstwering tot het dak). Plint in de binnenhoek: vier
// lagen van 2,75 m boven de begane grond. Aantallen geteld op foto's, verdiepingshoogtes geschat.
const STOREY = 2.86;
const TOWER_FLOORS = Array.from({ length: 18 }, (_, k) => [18.9 + STOREY * k, STOREY]);
const WING_PODIUM_FLOORS = [[4.6, 3.7], [8.3, 3.7], [12.0, 3.9]];
const TRIANGLE_FLOORS = Array.from({ length: 4 }, (_, k) => [4.6 + 2.75 * k, 2.75]);
const DEPTH = 0.35;

// ---------- Massa ----------
const block = (r, top, bottom = z(ROOF) - 0.1) => prism(rect(...r), bottom, z(top));
const sq = (u, v, top, w = 1.0, d = 1.0) => block([u - w / 2, v - d / 2, u + w / 2, v + d / 2], top);
const mass = union([
  prism(FOOT, BASE, z(PODIUM)),
  prism(SOUTH_WING, BASE, z(ROOF)),
  prism(NORTH_WING, BASE, z(ROOF)),
  // Dakopbouwen uit het DSM (≥ 0,9 m breed en ≥ 1 m hoog).
  block([2.8, -0.5, 8.2, 3.2], PLANT),
  block([3.3, 0.8, 4.5, 2.2], PLANT_STACK, z(PLANT) - 0.1),
  block([7.9, 4.3, 13.3, 5.3], DUCT),
  block([7.0, 11.4, 9.2, 13.1], NORTH_BOX),
  sq(8.7, -3.95, 75.6), // ventilatieschachten, DSM-mediaan 75,1–75,3, maxima 75,4–76,1
  sq(3.95, -3.0, 75.3),
  sq(-8.9, -4.2, 75.5),
  sq(-14.15, -4.25, 75.6),
  sq(-11.6, 1.95, 75.0, 1.2, 1.4),
]);
// Insnijding in de zuidgevel (open naar boven) en de glazen hoekstrook tussen de vleugels.
const body = mass.subtract(union([
  prism(rect(NOTCH.u0, NOTCH.v0 - 1, NOTCH.u1, NOTCH.v1), z(NOTCH_FLOOR), 120),
  prism(rect(CORNER.u0, CORNER.v0, CORNER.u1, CORNER.v1), z(PODIUM), 120),
]));

// ---------- Gevelreliëf ----------
const cuts = [];
// Vensters langs de rand a→b (buitennormaal rechts van de looprichting): blinde nissen met een plafond
// onder 45°, alleen waar de gevel op die hoogte buitengevel is.
function face(a, b, floors, { bays, pitch = 4.0, width = 1.8, sill = 0.7, header = 0.45 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const count = bays ?? Math.max(1, Math.round((L - 1.2) / pitch));
  const step = (L - 1.2) / count;
  for (const [zf, fh] of floors) {
    const lo = zf + sill, hi = zf + fh - header - DEPTH;
    if (hi - lo < 0.9) continue;
    for (let k = 0; k < count; k++) {
      const s0 = 0.6 + (k + 0.5) * step - width / 2, s1 = s0 + width;
      const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const S = -12.55, E = 15.87, N = 21.04;
const SW = [-23.93, S], NW = [-19.41, 2.8], DIAG_TOP = [DIAG_U(NORTH_FACE_V), NORTH_FACE_V];
// Zuidgevel: vier vensterkolommen aan weerszijden van de insnijding.
face(SW, [NOTCH.u0, S], [...WING_PODIUM_FLOORS, ...TOWER_FLOORS], { bays: 4 });
face([NOTCH.u1, S], [E, S], [...WING_PODIUM_FLOORS, ...TOWER_FLOORS], { bays: 4 });
face([NOTCH.u0, S], [NOTCH.u1, S], WING_PODIUM_FLOORS, { bays: 2 });
// Oost-, noord- en westgevel en het korte schuine stuk van de zuidvleugel.
face([E, S], [E, N], [...WING_PODIUM_FLOORS, ...TOWER_FLOORS], { bays: 8 });
face([E, N], [WEST_FACE_U, N], [...WING_PODIUM_FLOORS, ...TOWER_FLOORS], { bays: 4 });
face(NW, SW, [...WING_PODIUM_FLOORS, ...TOWER_FLOORS], { bays: 4 });
face(DIAG_TOP, NW, [...WING_PODIUM_FLOORS, ...TOWER_FLOORS], { bays: 1 });
// Gevels boven de plint in de binnenhoek (vier kolommen elk, foto vanaf de Leuvekolk).
face([WEST_FACE_U, N], [WEST_FACE_U, CORNER.v1], TOWER_FLOORS, { bays: 4, width: 1.6 });
face([CORNER.u0, NORTH_FACE_V], DIAG_TOP, TOWER_FLOORS, { bays: 4, width: 1.8 });
// Wanden van de insnijding boven +32,45 m.
const notchFloors = TOWER_FLOORS.filter(([zf]) => zf >= z(NOTCH_FLOOR) - 0.01);
face([NOTCH.u0, NOTCH.v1], [NOTCH.u1, NOTCH.v1], notchFloors, { bays: 2, width: 1.8 });
face([NOTCH.u0, NOTCH.v0], [NOTCH.u0, NOTCH.v1], notchFloors, { bays: 1, width: 1.6 });
face([NOTCH.u1, NOTCH.v1], [NOTCH.u1, NOTCH.v0], notchFloors, { bays: 1, width: 1.6 });
// Schuine gevel van de plint aan de Leuvekolk: smallere vensters op een kleinere travee.
face([0.31, 18.93], DIAG_TOP, TRIANGLE_FLOORS, { pitch: 2.6, width: 1.3, sill: 0.6, header: 0.35 });

// Doorlopende glasbanden, 0,4 m diep met een plafond in drie treden van 0,13 m (45°): de glazen begane
// grond rondom en de teruggelegen glazen laag tussen de kantoorlagen en de woonlagen.
const band = (cs, h0, h1, depth = 0.4) => {
  const outer = cs.offset(1.5, "Miter");
  const slice = (d, a, b) => Manifold.extrude(outer.subtract(cs.offset(-d, "Miter")), b - a).translate([0, 0, a]);
  return union([slice(depth, h0, h1), slice((depth * 2) / 3, h1 - 0.01, h1 + depth / 3), slice(depth / 3, h1 + depth / 3 - 0.01, h1 + (depth * 2) / 3)]);
};
cuts.push(band(new CrossSection([ccw(FOOT)]), 0.3, 4.6 - 0.3 - 0.4));
cuts.push(band(new CrossSection([ccw(SOUTH_WING)]).add(new CrossSection([ccw(NORTH_WING)])), z(PODIUM) + 0.3, 18.9 - 0.4 - 0.1));
// Glazen strook onder de insnijding (0,4 m diep, van de glazen laag tot de bodem van de insnijding).
cuts.push(prism(rect(NOTCH.u0, S - 1, NOTCH.u1, S + 0.4), 18.9 - 0.1, z(NOTCH_FLOOR) + 0.01));

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`De Witte Keizer: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("De Witte Keizer", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:hoofdpoort-rotterdam-witte-keizer", building]],
  catalog: {
    name: "De Witte Keizer",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 45.64, // PDOK-terrein aan de Vissersdijk (ellipsoïdisch, NAP + 43,54 zoals Five55)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[8, 23], [18, 4], [0, -15]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000394211"],
    description:
      "De Witte Keizer (KCAP, 2005) aan de Vissersdijk bij de Leuvekolk, in de Kanzo-taak 'De Hoofdpoort' genoemd (dat is de oude naam van Blaak 333): plint over de hele BAG-contour tot NAP +17,97 m met een glazen begane grond, daarop een zuidvleugel en een noordvleugel in een L tot +73,08 m met een teruggelegen glazen laag boven de plint, een glazen hoekstrook tussen de vleugels, een open insnijding van 6,8 × 4,45 m in de zuidgevel vanaf +32,45 m, een vensterraster per laag (18 woonlagen, vier kantoorlagen) en op het dak een installatieblok, een kanaalkast, een kast en vijf ventilatieschachten. Hoogtes uit de 3D BAG (AHN5 2023) en het AHN-DSM. Oorsprong in de binnenhoek tussen de vleugels, X-as langs de zuidgevel (19,87° op RD-oost). Verdiepingshoogtes, vensterraster, de diepte van de glazen banden en hoekstrook en de maten van de dakopbouwen zijn geschat; Five55 en Blaak 333 blijven eigen panden.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      podiumNapM: PODIUM,
      notchFloorNapM: NOTCH_FLOOR,
      notchM: [+(NOTCH.u1 - NOTCH.u0).toFixed(2), +(NOTCH.v1 - NOTCH.v0).toFixed(2)],
      plantNapM: PLANT,
      plantStackNapM: PLANT_STACK,
      ductNapM: DUCT,
      northBoxNapM: NORTH_BOX,
      floors: { ground: 1, podium: 3, glassBand: 1, residential: 18 },
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000394211 (bouwjaar 2005, Vissersdijk 1–217 en Hang 33), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG LoD2.2 NL.IMBAG.Pand.0599100000394211 (AHN5 2023): dak 73,06–73,09, plintdak 17,98, insnijding 32,4, installatie 74,4–74,8",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Rotterdam",
      "https://nl.wikipedia.org/wiki/Blaak_333 (oorspronkelijke naam Hoofdpoort; ander gebouw)",
      "https://www.e-architect.com/rotterdam/de-witte-keizer (KCAP, 107 appartementen; foto's Rob 't Hart)",
      "https://www.architectureguide.nl/project/item/prj_id/1924/alfa/H",
    ],
  },
});

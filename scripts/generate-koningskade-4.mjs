// Kantoor Koningskade 4 (Den Haag, 1967–1970, Gouwetor, Mulder en Tielman): het voormalige kantoor van
// Rijkswaterstaat aan de Koningskade bij het Malieveld, sinds 2019 onder meer het hoofdkantoor van de
// Nederlandse Emissieautoriteit. Een kantoortoren van 40 × 29 m met een vliesgevel van grijze borstweringen
// en vensters op een stramien van 1,8 m, een hogere kroonverdieping met verticale lamellen en op het dak
// een teruggezette installatieopbouw met een schoorsteenbundel. Aan de noordoostkant een lange laagbouw
// van zes lagen (88 × 15,5 m) met een ronde glazen trommel en een installatiekast, via een tussenlid
// aan de toren gekoppeld.
// Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG (LoD2.2), gevelindeling uit foto's.
import { Manifold, circle, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "koningskade-4";
// Gebouwstelsel: u langs de zuidoostgevel van de toren naar het noordoosten (25,9° op RD-oost, alle
// BAG-randen evenwijdig of haaks binnen 0,2°), v haaks erop naar het noordwesten. Oorsprong in het hart
// van de toren.
const ORIGIN = [81504.0, 456077.0];
const ANGLE = 25.9;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.85; // NAP, ventweg en parkeerterrein aan de noord- en oostkant (AHN-DTM 0,81–0,90)
const GARDEN = 2.45; // NAP, tuin en Koningskade aan de zuid- en westkant (AHN-DTM 2,4–2,9)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM en 3D BAG ----------
const TOWER_ROOF = 63.05; // torendak rond de opbouw (DSM-mediaan 63,02; 3D BAG 63,03–63,11)
const TOWER_BOX = 67.28; // installatieopbouw (DSM 67,22; 3D BAG 67,27–67,29)
const LIFT_HEADS = 64.9; // twee opbouwen tegen de noordwestkant van de opbouw (DSM 64,63–65,0; 3D BAG 64,7–65,0)
const PLANT_SMALL = 64.5; // losse installatie bij de zuidwesthoek (3D BAG 64,1–64,7)
const CHIMNEY = 70.5; // schoorsteenbundel op de opbouw (DSM 70,3–71,1)
const WING_ROOF = 23.95; // laagbouw (DSM 23,8–24,1)
const LINK_ROOF = 23.0; // tussenlid tussen toren en laagbouw (DSM-mediaan 22,94; 3D BAG 22,96–23,18)
const ENTRANCE = 3.75; // laag bordes/entreedeel tussen toren en laagbouw (DSM 3,6–3,9)
const DRUM = 29.75; // ronde trommel op de laagbouw (DSM 29,73–29,79)
const WING_PLANT = 28.15; // installatiekast op de laagbouw (DSM 28,09–28,26)
const SKYLIGHT = 22.75; // verdiepte glazen strook langs de oostrand (DSM 12–21 met gaten: glas; diepte geschat)

// ---------- Plattegrond in (u, v), BAG-contour vereenvoudigd tot 0,2 m ----------
const TOWER = [-20.06, -14.43, 19.7, 14.56];
const WING = [28.5, -79.23, 44.06, 9.16];
const LINK = rect(19.6, -7.8, 28.6, 3.16);
const ENTRY = rect(19.6, -13.73, 28.6, -7.8);
const BOX = rect(-14.3, -8.5, 13.6, 8.8);
const LIFTS = [rect(7.6, 8.7, 13.5, 11.8), rect(-14.2, 8.7, -8.6, 11.2)];
const SMALL_PLANT = rect(-18.3, 4.1, -16.5, 6.9);
const STACK = rect(5.2, -2.4, 8.7, -1.3); // vier pijpen, samen één blok van 3,5 × 1,1 m
const DRUM_C = [36.27, -5.24], DRUM_R = 4.9; // middelpunt en straal uit het DSM (> 27 m) en de 3D BAG
const WING_PLANT_POLY = rect(29.4, -67.5, 40.6, -51.6);
const SKYLIGHTS = [rect(40.4, -50.6, 43.1, -16.5), rect(40.4, -77.6, 43.1, -68.6)];

const towerBody = union([
  prism(rect(...TOWER), BASE, z(TOWER_ROOF)),
  prism(BOX, z(TOWER_ROOF) - 0.1, z(TOWER_BOX)),
  ...LIFTS.map((p) => prism(p, z(TOWER_ROOF) - 0.1, z(LIFT_HEADS))),
  prism(SMALL_PLANT, z(TOWER_ROOF) - 0.1, z(PLANT_SMALL)),
  prism(STACK, z(TOWER_BOX) - 0.1, z(CHIMNEY)),
]);
const lowBody = union([
  prism(rect(...WING), BASE, z(WING_ROOF)),
  prism(LINK, BASE, z(LINK_ROOF)),
  prism(ENTRY, BASE, z(ENTRANCE)),
  prism(circle(DRUM_C, DRUM_R, 40), z(WING_ROOF) - 0.1, z(DRUM)),
  prism(WING_PLANT_POLY, z(WING_ROOF) - 0.1, z(WING_PLANT)),
]).subtract(union(SKYLIGHTS.map((p) => prism(p, z(SKYLIGHT), z(WING_ROOF) + 1))));
const body = union([towerBody, lowBody]);

// ---------- Gevelreliëf ----------
// Toren: begane grond vanaf de tuin (+2,45) 3,9 m, 16 kantoorlagen van 3,2 m, kroonverdieping van 5,5 m
// tot het dak. Laagbouw: begane grond vanaf +2,8 4,5 m en vijf lagen van 3,3 m.
const STOREY = 3.2;
const TOWER_FLOORS = [[z(GARDEN), 3.9], ...Array.from({ length: 16 }, (_, k) => [z(GARDEN) + 3.9 + STOREY * k, STOREY])];
const CROWN = [[z(GARDEN) + 3.9 + STOREY * 16, z(TOWER_ROOF) - (z(GARDEN) + 3.9 + STOREY * 16)]];
const WING_FLOORS = [[z(2.8), 4.5], ...Array.from({ length: 5 }, (_, k) => [z(2.8) + 4.5 + 3.3 * k, 3.3])];
const DEPTH = 0.35;
const PITCH = 1.8; // stramien van de vliesgevel (22 vakken op de lange torengevel, foto)
// Vensters per vak langs de rand a→b (buitennormaal rechts van de looprichting): blinde nissen van 0,9 m
// breed met een plafond onder 45°, alleen waar de gevel op die hoogte buitengevel is.
function face(cuts, a, b, floors, { width = 0.9, sill = 1.0, header = 0.3 } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const bays = Math.floor((L + 0.3) / PITCH), w = (L - bays * PITCH) / 2;
  for (const [zf, fh] of floors) {
    const lo = zf + sill, hi = zf + fh - header - DEPTH;
    if (hi - lo < 0.9) continue;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * PITCH + (PITCH - width) / 2, s1 = s0 + width;
      const exposed = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const ring = ([u0, v0, u1, v1]) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);

const towerCuts = [];
for (const [a, b] of edges(ring(TOWER))) {
  face(towerCuts, a, b, TOWER_FLOORS.slice(0, 1), { sill: 0.6, header: 0.3 });
  face(towerCuts, a, b, TOWER_FLOORS.slice(1));
  // Kroon: hoge smalle vakken tussen de lamellen, onder een dichte dakrand van 0,6 m.
  face(towerCuts, a, b, CROWN, { sill: 0.6, header: 0.6 });
}
const lowCuts = [];
for (const [a, b] of edges(ring(WING))) {
  face(lowCuts, a, b, WING_FLOORS.slice(0, 1), { sill: 0.6, header: 0.4 });
  face(lowCuts, a, b, WING_FLOORS.slice(1).filter(([zf, fh]) => zf + fh <= z(WING_ROOF) + 0.01));
}
const linkFloors = WING_FLOORS.slice(1).filter(([zf, fh]) => zf + fh <= z(LINK_ROOF) + 0.01);
face(lowCuts, [28.6, 3.16], [19.6, 3.16], linkFloors);
face(lowCuts, [19.6, -7.8], [28.6, -7.8], linkFloors);

const tower = towerBody.subtract(union(towerCuts));
const low = lowBody.subtract(union(lowCuts));
const nodes = [["toren", tower, towerCuts.length], ["laagbouw", low, lowCuts.length]].map(([name, m, n]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri(), "nissen", n);
  return [`building:koningskade-4-${name}`, m];
});

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "Kantoor Koningskade 4",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.27, // NAP +0,85 plus de lokale geoïdehoogte 43,42 (ellipsoïdisch; Beatrixlaan 9–11: 43,40)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0518100000302196"],
    description:
      "Voormalig kantoor van Rijkswaterstaat aan de Koningskade 4 bij het Malieveld (1967–1970, sinds 2019 onder meer de Nederlandse Emissieautoriteit): toren van 39,8 × 29,0 m tot NAP +63,05 m met een vensterraster op een stramien van 1,8 m (begane grond, 16 kantoorlagen en een kroonverdieping met hoge smalle vakken), daarop een teruggezette installatieopbouw tot +67,28 m met twee liftopbouwen tot +64,9 m en een schoorsteenbundel tot +70,5 m; aan de noordoostkant een laagbouw van 88,4 × 15,6 m tot +23,95 m met een vensterraster per laag, een ronde trommel tot +29,75 m, een installatiekast tot +28,15 m en een verdiepte glazen strook langs de oostrand, en een tussenlid tot +23,0 m met een laag entreedeel. Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG. Oorsprong in het hart van de toren, X-as langs de zuidoostgevel (25,9° op RD-oost). Verdiepingshoogtes, vensterraster, de diepte van de glazen strook en de schoorsteenbundel als één blok zijn geschat; het gebouw heeft geen eigen naam en staat niet in de hoogbouwlijst van Den Haag.",
    realWorld: {
      groundNapM: GROUND,
      gardenNapM: GARDEN,
      towerRoofNapM: TOWER_ROOF,
      towerPlantNapM: TOWER_BOX,
      liftHeadsNapM: LIFT_HEADS,
      chimneyNapM: CHIMNEY,
      wingRoofNapM: WING_ROOF,
      linkRoofNapM: LINK_ROOF,
      drumNapM: DRUM,
      wingPlantNapM: WING_PLANT,
      towerPlanM: [+(TOWER[2] - TOWER[0]).toFixed(2), +(TOWER[3] - TOWER[1]).toFixed(2)],
      wingPlanM: [+(WING[2] - WING[0]).toFixed(2), +(WING[3] - WING[1]).toFixed(2)],
      floors: { tower: 18, wing: 6 },
      storeyHeightM: STOREY,
      facadePitchM: PITCH,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0518100000302196 (bouwjaar 1968), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG (LoD2.2, AHN5 2023)",
      "https://skyscraperpage.com/b8339",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Den_Haag",
      "https://commons.wikimedia.org/wiki/File:Hoofdkantoor_Nederlandse_Emissieautorieit.jpg",
      "https://commons.wikimedia.org/wiki/File:Fontein_Joop_Beljon_Koningskade-4_Den_Haag_zijaanzicht.jpg",
      "https://commons.wikimedia.org/wiki/File:Denhaag_kunstwerk_objectengroep.jpg",
    ],
  },
});

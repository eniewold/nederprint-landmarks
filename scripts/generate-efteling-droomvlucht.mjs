// Genereert een vereenvoudigd, gesloten 3D-model van Droomvlucht (1993, dark
// ride in het Marerijk van de Efteling, Kaatsheuvel, ontwerp Ton van de Ven):
// de grote showhal met de lage oosthal, het achtkantige paviljoen met het
// piramidedak en de lantaarn met spits aan de zuidwestkant, en aan de oostkant
// de sprookjesachtige entree: de vrijstaande gevelmuur aan het water met de
// spitse poortboog, drie torenspitsen (de middelste als gestapelde
// lotusringen, de zijspitsen als uivormige knoppen op een steel), de
// bladwaaiers ("elfenvleugels") naast de boog, de tulpzuilen, de
// bloemschalen, de twee grote tulpen aan de uiteinden en de grillige
// stenen muurkap; daarachter de overdekte gewelfde entreehal en de overdekte
// wachtrijgang naar de oosthal, en de bolle brug over het water naar het
// Ton van de Venplein. Alle maten zijn meters op ware grootte. Uitvoer: GLB
// in meters (Y omhoog, nodes `klasse:label`), catalogus-JSON en een binaire
// STL in millimeters op 1:<schaal> (via scripts/efteling-kit.mjs).
//
//   node scripts/generate-efteling-droomvlucht.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-droomvlucht.mjs --scale 500
//
// Assenstelsel: oorsprong op RD (131364, 407123), midden in de hal, op het
// maaiveld (NAP +8,1 m), Z omhoog, +X langs de lange gevels van de hal naar het
// oosten (1,69 graden linksom vanaf de RD-X-as), +Y loodrecht daarop naar het
// noorden. De entreemuur, de entreehal, de wachtrijgang en de brug staan
// precies noord-zuid/oost-west in RD; ze worden in RD-richting opgebouwd en
// 1,69 graden teruggedraaid.
//
// Maten:
// - Hal: BAG-contour van pand 0809100000017596. AHN-DSM (0,5 m, in het
//   stelsel van de hal bekeken): het westelijke deel (tot x = 7,25) is een
//   vlak dak op +10,3 m, de oosthal +5,5 m met een lager deel op +4,5 m
//   (x 19,75 tot 40,5, y -4,75 tot 14; en x 31,8 tot 40,5 vanaf y -9,6).
// - Achtkant: de BAG-contour heeft een regelmatige achthoek met zijden van
//   10 m (apothema 12,05 m, hart op x -29,3, y -17,26). DSM: goten op +10,6
//   m, dakvlakken van 27 graden tot een plateau op +14 m (apothema 5,2 m); het
//   oostelijke deel van de achthoek (vanaf x -24,3 en boven y -22,3) is plat
//   op +14 m. Daarop een achtkantige lantaarn (apothema 4,8 m, muurtje tot
//   +15,5 m, dak van 53 graden tot +19 m), een trommel van 2 m en een spits
//   tot +25 m (DSM +23,7 m op 0,5 m van het hart; de top is dunner dan het
//   raster). Op de acht hoeken van de lantaarn pinakels (luchtfoto: lichte
//   knoppen op de hoeken).
// - Entree: muur op RD x 131419,7-131420,7 van y 407129,4 tot 407153,8
//   (luchtfoto: lichte muurkap; DSM +5 tot +6,5 m), poortboog op y 407141,6
//   (as van de entreehal). Opstand uit de Commons-foto's (vooraanzicht,
//   schaal uit de bezoekers): muur 5,9 m met een stenen kap tot 6,3 m, de
//   uiteinden afbrokkelend; spitse doorgang 3 m breed en 7,1 m hoog (op foto
//   6,9 m; de top is 51 graden gemaakt om printbaar te zijn) in een omlijsting
//   van 3,9 m breed tot 7,75 m; middelste spits tot 11,9 m, zijspitsen op 2 m
//   van de as tot 10,1 m (DSM 10 tot 11,4 m rond de boog); bladwaaiers tot
//   4,75 m uit de as en 7,45 m hoog; tulpen op 10,5 m uit de as tot 6,7 m.
// - Entreehal: DSM-dwarsprofiel gewelf met goten op 5,6 m en kruin op 8,5 m,
//   5,4 m breed, RD x 131413-131420. Wachtrijgang: platte daken op 6,6 m
//   (x 131408-131413) en 6,0 m (schuine gang naar de oosthal).
// - Brug: luchtfoto-contour (bol, 6,4 tot 10 m breed), dek op +0,15 m,
//   borstweringen van ruwe steen 0,7 m breed tot 1,0 m (foto's).
//
// Geschat: alle maten van de gevelornamenten (uit foto's met de bezoekers als
// maat), de vorm van de lantaarn en de spits (DSM grof), de diepte van de
// poortnis (2,5 m in de entreehal; in werkelijkheid een open doorgang naar de
// overdekte wachtrij), de ligging van de wachtrijgang (DSM plus luchtfoto,
// bomen erboven) en de dikte van de muur (1 m).
//
// Printbaar op 1:1000 zonder steun: de hal, de achtkant en de gangen staan op
// de onderkant; dakvlakken lopen omhoog; de poortnis heeft een spitse top van
// 51 graden; de bladwaaiers hebben een onderrand van 48 tot 56 graden, de
// spitsen en schalen ondervlakken van minstens 47 graden; de muurkap rust op
// een kraag van 50 graden. Alle onderdelen beginnen op 0,5 m onder het
// maaiveld.
//
// Bronnen: BAG-pand 0809100000017596; AHN DSM/DTM 0,5 m (PDOK WCS); PDOK
// luchtfoto 8 cm (Actueel_orthoHR); Wikimedia Commons, categorie
// Droomvlucht (Efteling) (entreefoto's -i---i- 31448394048, 43507438690,
// 43507629300, 45322543561, "Droomvlucht entrance Efteling.jpg",
// "Efteling Droomvlucht.jpg"); nl.wikipedia (Droomvlucht (darkride));
// Eftepedia (Droomvlucht, Ton van de Venplein).
import {
  CrossSection,
  Manifold,
  box,
  ccw,
  circle,
  dome,
  downFaces,
  hull,
  prism,
  ring3,
  spire,
  union,
  writeLandmark,
} from "./efteling-kit.mjs";

// ---------- stelsel ----------
const ORIGIN = [131364, 407123];
const GROUND_NAP = 8.1;
const ANGLE = 1.69; // graden linksom vanaf de RD-X-as
const TH = (ANGLE * Math.PI) / 180;
const X_AXIS = [+Math.cos(TH).toFixed(6), +Math.sin(TH).toFixed(6)];
const BASE = -0.5;
// RD → lokaal (meters).
const local = ([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [dx * Math.cos(TH) + dy * Math.sin(TH), -dx * Math.sin(TH) + dy * Math.cos(TH)];
};
// Onderdelen die in RD-richting zijn opgebouwd (coördinaten = RD min ORIGIN)
// terugdraaien naar het lokale stelsel.
const fromRd = (m) => m.rotate([0, 0, -ANGLE]);
const rdOff = ([x, y]) => [x - ORIGIN[0], y - ORIGIN[1]];

// Prisma van een veelhoek in het (a, z)-vlak, uitgerekt langs n van n0 tot n1,
// in een stelsel met X = n, Y = a, Z = z (voor gevelvormen en dwarsprofielen).
const azPrism = (pts, n0, n1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), n1 - n0)
    .translate([0, 0, n0])
    .rotate([90, 0, 90]);
{
  // Controle van de asafbeelding (a, z, n) → (n, a, z).
  const t = azPrism([[1, 2], [1.5, 2], [1.5, 2.5], [1, 2.5]], 3, 3.5).boundingBox();
  if (Math.abs(t.min[0] - 3) > 1e-6 || Math.abs(t.min[1] - 1) > 1e-6 || Math.abs(t.min[2] - 2) > 1e-6) {
    throw new Error(`azPrism-assen kloppen niet: ${JSON.stringify(t)}`);
  }
}
const mirrorA = (pts) => pts.map(([a, z]) => [-a, z]);
// Symmetrisch profiel (a ≥ 0 van onder naar boven) tot een gesloten veelhoek.
const symmetric = (half) => [...half, ...mirrorA(half).reverse()];

// ---------- showhal ----------
// BAG-contour van pand 0809100000017596 (RD).
const BAG_RD = [
  [131328.96, 407152.95], [131329.54, 407133.37], [131332.13, 407133.45], [131332.62, 407116.81], [131329.87, 407116.74],
  [131323.04, 407109.48], [131323.33, 407099.5], [131330.6, 407092.69], [131340.56, 407092.98], [131343.85, 407096.52],
  [131347.41, 407093.2], [131366.94, 407093.78], [131366.99, 407092.06], [131371.87, 407092.23], [131371.8, 407093.92],
  [131389.68, 407094.45], [131391.84, 407092.41], [131396.88, 407092.46], [131398.69, 407094.38], [131398.16, 407109.0],
  [131396.27, 407108.93], [131396.11, 407114.38], [131404.77, 407114.6], [131404.66, 407119.09], [131399.48, 407118.95],
  [131399.32, 407124.97], [131404.46, 407125.11], [131404.11, 407138.53], [131399.49, 407138.41], [131399.37, 407142.43],
  [131355.73, 407141.14], [131355.36, 407153.72],
];
const BAG = BAG_RD.map(local);
const HALL_TOP = 10.3;
const HALL_EAST_EDGE = 7.25;
const EAST_TOP = 5.5;
const EAST_LOW = 4.5;

function showhal() {
  const east = prism(BAG, BASE, EAST_TOP)
    .subtract(box(19.75, -4.75, EAST_LOW, 45, 14.0, EAST_TOP + 1))
    .subtract(box(31.8, -9.7, EAST_LOW, 45, -4.7, EAST_TOP + 1));
  const main = prism(BAG, BASE, HALL_TOP).intersect(box(-50, -40, BASE - 1, HALL_EAST_EDGE, 40, HALL_TOP + 1));
  return union([east, main, achtkant()]);
}

// ---------- achtkant met lantaarn ----------
const OCT_C = [-29.3, -17.26];
const OCT_AP = 12.05;
// Achthoek met platte zijden op de assen (apothema ap).
const oct = (ap, c = OCT_C) => circle(c, ap / Math.cos(Math.PI / 8), 8, Math.PI / 8);
const OCT_EAVE = 10.6;
const OCT_PLATEAU = 14.0;
const OCT_TOP_AP = 5.2;
const LANTERN_AP = 4.8;
const LANTERN_EAVE = 15.5;
const LANTERN_ROOF_AP = 2.2;
const LANTERN_ROOF_TOP = 19.0;
const DRUM_AP = 2.0;
const DRUM_TOP = 20.5;
const SPIRE_TOP = 25.0;

function achtkant() {
  const walls = prism(oct(OCT_AP), BASE, OCT_EAVE + 0.02);
  const roof = hull([...ring3(oct(OCT_AP), OCT_EAVE), ...ring3(oct(OCT_TOP_AP), OCT_PLATEAU)]);
  // Het oostelijke deel van de achthoek is plat op +14 m.
  const plateau = prism(oct(OCT_AP), OCT_EAVE - 0.5, OCT_PLATEAU).intersect(box(-24.3, -22.3, 0, 0, 0, 20));
  const lantern = prism(oct(LANTERN_AP), OCT_PLATEAU - 0.1, LANTERN_EAVE);
  const lanternRoof = hull([...ring3(oct(LANTERN_AP), LANTERN_EAVE), ...ring3(oct(LANTERN_ROOF_AP), LANTERN_ROOF_TOP)]);
  const drum = prism(oct(DRUM_AP), LANTERN_ROOF_TOP - 0.1, DRUM_TOP);
  const top = spire(OCT_C, DRUM_AP / Math.cos(Math.PI / 8), DRUM_TOP - 0.02, SPIRE_TOP, 8, Math.PI / 8);
  // Pinakels op de hoeken van de lantaarn.
  const pinnacles = oct(LANTERN_AP + 0.4).map((p) =>
    union([prism(circle(p, 0.38, 8, Math.PI / 8), 13.0, 16.0), spire(p, 0.38, 15.98, 17.2, 8)]),
  );
  return union([walls, roof, plateau, lantern, lanternRoof, drum, top, ...pinnacles]);
}

// ---------- entree (stelsel E: X = n naar het oosten, Y = a naar het noorden) ----------
// Oostgevel van de muur op RD x 131420,7; as van de poort op y 407141,6.
const GATE_RD = [131420.7, 407141.6];
const toE = (m) => fromRd(m.translate([GATE_RD[0] - ORIGIN[0], GATE_RD[1] - ORIGIN[1], 0]));
const WALL_T = 1.0;
const WALL_HALF = 12.2;
const WALL_TOP = 5.9;
// Poortboog: binnenkant (doorgang) en buitenkant (omlijsting), halve profielen
// a ≥ 0 van onder naar boven. Elk segment van de top is minstens 51 graden.
const ARCH_IN = [[1.5, 0], [1.5, 4.2], [1.4, 5.0], [1.15, 5.7], [0.65, 6.3], [0, 7.1]];
const ARCH_OUT = [[1.95, BASE], [1.95, 4.2], [1.85, 5.1], [1.55, 5.95], [0.9, 6.85], [0, 7.75]];
const FRAME_FRONT = 0.5;
const NICHE_BACK = -3.5;

function entreeMuur() {
  // Muur met afbrokkelende uiteinden (getrapt).
  const ends = [[WALL_HALF, BASE], [WALL_HALF, 4.3], [11.85, 4.3], [11.85, 4.9], [11.45, 4.9], [11.45, 5.45], [11.0, 5.45], [11.0, WALL_TOP]];
  const wall = azPrism(symmetric(ends), -WALL_T, 0);
  // Stenen muurkap: blokken van wisselende hoogte op een kraag van 50 graden.
  const stones = [];
  const lengths = [1.3, 1.1, 1.5, 1.2, 1.4, 1.0, 1.3, 1.6, 1.2];
  const heights = [0.35, 0.25, 0.45, 0.3, 0.4, 0.28, 0.42, 0.32, 0.38];
  let k = 0;
  for (const side of [-1, 1]) {
    let a = 2.2;
    while (a < 10.9) {
      const len = Math.min(lengths[k % lengths.length], 10.95 - a);
      const h = heights[k % heights.length];
      const a0 = side > 0 ? a : -a - len;
      const a1 = side > 0 ? a + len : -a;
      stones.push(
        hull([
          [-WALL_T, a0, WALL_TOP - 0.15], [0, a0, WALL_TOP - 0.15], [-WALL_T, a1, WALL_TOP - 0.15], [0, a1, WALL_TOP - 0.15],
          [-WALL_T - 0.1, a0, WALL_TOP - 0.03], [0.1, a0, WALL_TOP - 0.03], [-WALL_T - 0.1, a1, WALL_TOP - 0.03], [0.1, a1, WALL_TOP - 0.03],
          [-WALL_T - 0.1, a0, WALL_TOP + h], [0.1, a0, WALL_TOP + h], [-WALL_T - 0.1, a1, WALL_TOP + h], [0.1, a1, WALL_TOP + h],
        ]),
      );
      a += len + 0.02;
      k++;
    }
  }
  return union([wall, ...stones]);
}

function poort() {
  const frame = azPrism(symmetric(ARCH_OUT), -WALL_T, FRAME_FRONT);
  // Middelste spits: lotuskelk met bladeren op de top van de omlijsting en
  // daarop een stapel lotusringen tot 11,9 m.
  const c = [-0.25, 0];
  const cup = dome(c, [[0.35, 7.2], [1.0, 7.95], [0.55, 8.12]], 16);
  const stack = dome(
    c,
    [
      [0.55, 8.05], [0.62, 8.2], [0.5, 8.6], [0.55, 8.75], [0.44, 9.15], [0.49, 9.3], [0.38, 9.7], [0.42, 9.85],
      [0.31, 10.25], [0.34, 10.4], [0.23, 10.8], [0.25, 10.95], [0.13, 11.35], [0.05, 11.9],
    ],
    16,
  );
  return union([frame, cup, stack]);
}

// Zijspits op een steel (a = ±2 m, half in de muur).
function zijspits(a) {
  return dome(
    [0, a],
    [
      [0.22, 3.9], [0.22, 6.6], [0.46, 7.05], [0.3, 7.3], [0.43, 7.75], [0.43, 8.0], [0.22, 8.7], [0.12, 9.3], [0.05, 10.1],
    ],
    16,
  );
}

// Bladwaaier (elfenvleugel) rechts van de boog; links gespiegeld. Twee
// nerven als reliëf van 0,15 m op het blad; de onderrand loopt 49 tot 56
// graden op.
const WING = [
  [1.9, 3.6], [2.5, 4.3], [3.3, 5.25], [4.1, 6.2], [4.6, 6.95], [4.75, 7.45], [4.2, 7.2], [3.7, 7.4], [3.2, 7.0],
  [2.7, 7.05], [2.3, 6.7], [1.9, 6.6],
];
// Nerf als spoelvorm van p naar q (breedte w in het midden) in het (a,
// z)-vlak; de punten houden de onderranden steiler dan 45 graden.
const nerf = ([a0, z0], [a1, z1], w) => {
  const l = Math.hypot(a1 - a0, z1 - z0);
  const [na, nz] = [(-(z1 - z0) / l) * (w / 2), ((a1 - a0) / l) * (w / 2)];
  const [ma, mz] = [(a0 + a1) / 2, (z0 + z1) / 2];
  return [[a0, z0], [ma - na, mz - nz], [a1, z1], [ma + na, mz + nz]];
};
const NERVEN = [
  [[2.15, 4.3], [4.45, 7.1]],
  [[2.1, 4.9], [3.65, 7.05]],
];
function vleugels() {
  const one = (pts, ribs) => union([azPrism(pts, -0.7, 0.4), ...ribs.map((r) => azPrism(r, 0.3, 0.55))]);
  const ribs = NERVEN.map(([p, q]) => nerf(p, q, 0.35));
  return union([one(WING, ribs), one(mirrorA(WING), ribs.map(mirrorA))]);
}

// Tulpzuil onder een zijspits: pilaster met kelk aan de voet en twee knoppen.
function tulpzuil(a) {
  const pil = box(-0.1, a - 0.28, BASE, 0.3, a + 0.28, 4.0);
  const cup = hull([
    ...[[0, a - 0.25, 0.2], [0.25, a - 0.25, 0.2], [0, a + 0.25, 0.2], [0.25, a + 0.25, 0.2]],
    ...[[0, a - 0.42, 1.45], [0.45, a - 0.42, 1.45], [0, a + 0.42, 1.45], [0.45, a + 0.42, 1.45]],
    ...[[0, a - 0.3, 1.65], [0.35, a - 0.3, 1.65], [0, a + 0.3, 1.65], [0.35, a + 0.3, 1.65]],
  ]);
  const bud = (z) => dome([0.2, a], [[0.12, z], [0.3, z + 0.25], [0.28, z + 0.5], [0.05, z + 0.8]], 12);
  return union([pil, cup, bud(2.2), bud(3.3)]);
}

// Bloemschaal tegen de muur (half in de muur), met de beplanting als kussen.
const schaal = (a, z0, r) =>
  dome([0, a], [[0.12, z0], [r, z0 + r * 0.95], [r, z0 + r * 0.95 + 0.2], [r * 0.6, z0 + r * 0.95 + 0.45], [0.1, z0 + r * 0.95 + 0.55]], 16);

// Grote tulp voor het uiteinde van de muur: steel, bladwaaier en roze knop.
function tulp(a) {
  const n = 0.45;
  const stem = prism(circle([n, a], 0.24, 12), BASE, 4.75);
  const leaves = azPrism(
    [[-0.3, BASE], [0.3, BASE], [0.3, 0.4], [1.15, 3.4], [1.05, 4.3], [0.3, 2.4], [-0.3, 2.4], [-1.05, 4.3], [-1.15, 3.4], [-0.3, 0.4]].map(([da, z]) => [a + da, z]),
    0.1,
    0.75,
  );
  const bud = dome([n, a], [[0.22, 4.55], [0.5, 4.85], [0.6, 5.3], [0.55, 5.9], [0.32, 6.35], [0.05, 6.68]], 16);
  return union([stem, leaves, bud]);
}

function entree() {
  const parts = [
    entreeMuur(),
    poort(),
    zijspits(2.05),
    zijspits(-2.05),
    vleugels(),
    tulpzuil(2.05),
    tulpzuil(-2.05),
    schaal(3.5, 2.75, 0.57),
    schaal(-3.5, 2.75, 0.57),
    schaal(3.6, 1.85, 0.43),
    schaal(-3.6, 1.85, 0.43),
    tulp(10.5),
    tulp(-10.5),
  ];
  return union(parts).subtract(poortnis());
}

// Spitse doorgang als nis tot 2,5 m in de entreehal.
const poortnis = () => azPrism(symmetric(ARCH_IN), NICHE_BACK, FRAME_FRONT + 0.5);

// ---------- entreehal en wachtrijgang ----------
// Gewelfde entreehal achter de muur (DSM-dwarsprofiel), RD x 131413-131420.
const VAULT = [[2.7, BASE], [2.7, 5.6], [2.4, 6.6], [1.9, 7.4], [1.2, 8.05], [0, 8.5]];
function wachtrij() {
  const hall = azPrism(symmetric(VAULT), 131413.0 - GATE_RD[0], -WALL_T + 0.05);
  const gang2 = box(131408.0 - GATE_RD[0], -1.4, BASE, 131413.1 - GATE_RD[0], 2.4, 6.6);
  const inE = toE(union([hall, gang2]).subtract(poortnis()));
  // Schuine gang van de oosthal naar het entreegebouw (RD, platte kap op 6,0 m).
  const gang1 = fromRd(
    prism(
      [
        [131399.2, 407138.9], [131404.8, 407138.5], [131408.5, 407139.4], [131408.5, 407143.0], [131406.3, 407142.6],
        [131402.0, 407141.3], [131399.2, 407141.3],
      ].map(rdOff),
      BASE,
      6.0,
    ),
  );
  return union([inE, gang1]);
}

// ---------- brug ----------
const BRIDGE_RD = [
  [131420.6, 407138.4], [131424.0, 407138.0], [131428.0, 407137.3], [131432.0, 407137.6], [131435.0, 407139.0], [131437.5, 407140.6],
  [131437.5, 407145.0], [131434.0, 407146.2], [131430.5, 407147.3], [131427.0, 407147.3], [131424.0, 407146.6], [131420.6, 407144.8],
];
const DECK_TOP = 0.15;
const PARAPET = 0.7;
const PARAPET_TOP = 1.0;
function brug() {
  const outline = BRIDGE_RD.map(rdOff);
  const deck = prism(outline, BASE, DECK_TOP);
  const outer = new CrossSection([ccw(outline)]);
  const inner = outer.offset(-PARAPET, "Miter");
  const ring = Manifold.extrude(outer.subtract(inner), PARAPET_TOP - DECK_TOP + 0.02).translate([0, 0, DECK_TOP - 0.02]);
  // Open aan de muurkant en aan de pleinkant.
  const [wx, wy] = rdOff([131419.0, 407139.1]);
  const [px, py] = rdOff([131436.6, 407141.3]);
  const parapets = ring
    .subtract(box(wx, wy, 0, wx + 2.3, wy + 5.0, 2))
    .subtract(box(px, py, 0, px + 3, py + 3.0, 2));
  return fromRd(union([deck, parapets]));
}

// ---------- samenstellen ----------
const nodes = [
  ["building:showhal", showhal()],
  ["building:wachtrij", wachtrij()],
  ["building:entree", toE(entree())],
  ["road:brug", brug()],
];

for (const [name, solid] of nodes) {
  const df = downFaces(solid, BASE).filter((g) => g.area > 0.05);
  console.log(name, "ondervlakken:", JSON.stringify(df));
}

const lantern = SPIRE_TOP;
await writeLandmark({
  slug: "efteling-droomvlucht",
  nodes,
  base: BASE,
  catalog: {
    name: "Droomvlucht (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: [
      [-10, -35],
      [20, -35],
      [45, -5],
      [-20, 35],
    ],
    replacesBuildings: ["NL.IMBAG.Pand.0809100000017596"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (131364, 407123), midden in de showhal op het maaiveld (NAP +8,1 m), +X langs de lange gevels naar het oosten (1,69 graden linksom vanaf de RD-X-as) en +Y naar het noorden. Nodes: building:showhal (hal +10,3 m, oosthal +5,5/+4,5 m, achtkant met piramidedak, plateau op +14 m, lantaarn en spits tot +25 m), building:wachtrij (gewelfde entreehal en wachtrijgang), building:entree (de sprookjesgevel aan het water met spitse poortnis, drie spitsen tot +11,9 m, bladwaaiers, tulpzuilen, bloemschalen en tulpen) en road:brug (de brug naar het Ton van de Venplein). Onderkant op 0,5 m onder het maaiveld. Vervangt de PDOK-reconstructie van de hal.",
    realWorld: {
      hallLengthM: 81.9,
      hallWidthM: 62.5,
      hallRoofM: HALL_TOP,
      eastHallRoofM: [EAST_LOW, EAST_TOP],
      octagonSideM: 10,
      octagonEaveM: OCT_EAVE,
      octagonPlateauM: OCT_PLATEAU,
      lanternSpireTopM: lantern,
      entranceWallLengthM: 2 * WALL_HALF,
      entranceWallHeightM: WALL_TOP,
      gateOpeningM: [3.0, 7.1],
      centralSpireTopM: 11.9,
      sideSpireTopM: 10.1,
      vaultHallRidgeM: 8.5,
      groundNapM: GROUND_NAP,
      baseM: BASE,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Droomvlucht_(darkride)",
      "https://www.eftepedia.nl/lemma/Droomvlucht",
      "https://www.eftepedia.nl/lemma/Ton_van_de_Venplein",
      "https://commons.wikimedia.org/wiki/Category:Droomvlucht_(Efteling) (entreefoto's)",
      "PDOK BAG pand 0809100000017596, EPSG:28992",
      "PDOK AHN DSM/DTM 0,5 m via WCS: daken van de hal, de achtkant en de lantaarn, de entreehal, de wachtrijgang, de muur en het maaiveld",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR): lantaarn, muur, gang en brug",
    ],
  },
});

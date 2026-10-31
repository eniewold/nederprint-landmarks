// De Hoogt (Beneluxlaan / Van Weerden Poelmanlaan, Kanaleneiland, Utrecht, 1968, H. Nefkens en
// Th. Benschop): woontoren van 18 woonlagen op een kantoorsokkel van twee lagen. Bij de opening de
// hoogste woontoren van Nederland. Elke woonlaag heeft een rondlopende balkonplaat; de witte
// borstweringen beslaan per gevel vaste stukken, ertussen en op de hoeken open balkons met hekken.
// Bovenop een gesloten dakrand van 4,5 m en een liftopbouw. Aan de zuidoostkant staat tegen de toren
// een lage strook van één laag op de sokkel.
// Contour uit de BAG, hoogtes uit het AHN-DSM en de 3D BAG, gevelindeling uit foto's.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "de-hoogt-utrecht";
// Gebouwstelsel: u langs de korte gevels van de toren naar het noordoosten (29,5° op RD-oost, BAG-randen
// 29,46° en 119,53°), v langs de lange gevels naar het noordwesten. Oorsprong in het hart van de
// BAG-contour (de sokkel).
const ORIGIN = [134803.57, 454678.18];
const ANGLE = 29.5;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 1.36; // NAP, maaiveld uit de 3D BAG (AHN-DTM rondom 1,3–2,2)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP) ----------
const PODIUM_ROOF = 10.95; // sokkel (AHN-DSM 10,9–11,0; 3D BAG 10,95–11,03)
const LOW_WING = 13.65; // strook tegen de zuidoostgevel van de toren (DSM 13,6–13,7; 3D BAG 13,64–13,70)
const TOWER_ROOF = 64.95; // torendak en dakrand (DSM 64,9–65,0; 3D BAG 64,93–64,99, 70p 64,99)
const LIFT_ROOF = 68.0; // liftopbouw (DSM 67,98; 3D BAG 68,01–68,04)
const VENT_TOP = 68.5; // twee afzuigkokers naast de liftopbouw (DSM 68,5)

// ---------- Plattegrond in (u, v) ----------
const PODIUM = rect(-18.33, -20.88, 17.14, 29.37); // BAG-contour (afwijkingen < 0,05 m weggelaten)
// Toren tot de buitenrand van balkonplaten en dakrand (AHN-DSM: scherpe randen aan de noordoost- en
// noordwestkant, aan de zuidwestkant vervuild door schuine treffers op de balkons).
const U0 = -12.25, U1 = 11.25, V0 = -12.75, V1 = 21.75;
const TOWER = rect(U0, V0, U1, V1);
const WING = rect(-12.1, -18.0, 10.9, V0 + 0.05); // DSM
const LIFT = rect(-3.75, 5.75, 2.9, 15.25); // DSM
const VENTS = [rect(-4.85, 8.0, -3.7, 9.0), rect(2.85, 8.0, 4.0, 9.0)]; // DSM, tegen de liftopbouw

// ---------- Lagen ----------
// 18 woonlagen van 2,75 m vanaf het sokkeldak, daarboven de dakrand van 4,5 m (foto's: 18 platen onder
// de dakrand, dakrand ongeveer 1,6 laag hoog; 18 × 2,75 + 4,5 = 54,0 = 64,95 − 10,95).
const STOREY = 2.75;
const TOWER_FLOORS = Array.from({ length: 18 }, (_, k) => z(PODIUM_ROOF) + STOREY * k);
const CROWN = z(PODIUM_ROOF) + STOREY * 18;
const BALCONY = 1.2; // diepte van de balkons achter de plaatrand (geschat)
const RAIL_SILL = 0.4; // plaatrand onder een open balkon met hek
const WHITE_SILL = 1.3; // plaat plus witte borstwering

// Gevels van de toren, elk van hoek naar hoek met de buitenkant rechts van de looprichting, en per gevel
// de stukken witte borstwering ("w") en open balkon ("r") in meters vanaf de eerste hoek. Zuidwest- en
// noordwestgevel van foto's (2017 en 1988); noordoost en zuidoost puntsymmetrisch aangenomen.
const FACES = [
  { name: "zuidwest", a: [U0, V1], b: [U0, V0], parts: [[0, 19.5, "w"], [19.5, 24.0, "r"], [24.0, 28.8, "w"], [28.8, 34.5, "r"]] },
  { name: "zuidoost", a: [U0, V0], b: [U1, V0], parts: [[0, 5.5, "r"], [5.5, 18.0, "w"], [18.0, 23.5, "r"]], from: z(LOW_WING) },
  { name: "noordoost", a: [U1, V0], b: [U1, V1], parts: [[0, 19.5, "w"], [19.5, 24.0, "r"], [24.0, 28.8, "w"], [28.8, 34.5, "r"]] },
  { name: "noordwest", a: [U1, V1], b: [U0, V1], parts: [[0, 5.5, "r"], [5.5, 18.0, "w"], [18.0, 23.5, "r"]] },
];

// Hoeken: een open balkon loopt om de hoek door als de buurgevel daar ook open is; grenst het aan een
// witte borstwering, dan stopt het op de balkondiepte zodat de witte band om de hoek blijft.
const towerCuts = [];
FACES.forEach((f, i) => {
  const L = Math.hypot(f.b[0] - f.a[0], f.b[1] - f.a[1]);
  const d = [(f.b[0] - f.a[0]) / L, (f.b[1] - f.a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [f.a[0] + d[0] * s - n[0] * depth, f.a[1] + d[1] * s - n[1] * depth, h];
  const prev = FACES[(i + 3) % 4].parts.at(-1)[2], next = FACES[(i + 1) % 4].parts[0][2];
  for (const [p0, p1, kind] of f.parts) {
    let s0 = p0, s1 = p1;
    if (p0 === 0) s0 = kind === "r" && prev === "w" ? BALCONY : -0.5;
    if (Math.abs(p1 - L) < 1e-6) s1 = kind === "r" && next === "w" ? L - BALCONY : L + 0.5;
    const sill = kind === "r" ? RAIL_SILL : WHITE_SILL;
    for (const zf of TOWER_FLOORS) {
      if (f.from !== undefined && zf < f.from - 0.01) continue;
      const lo = zf + sill, top = zf + STOREY, hi = top - BALCONY;
      // Nis tot de balkondiepte met een plafond onder 45° naar de plaatrand van de laag erboven.
      towerCuts.push(Manifold.hull([
        P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, BALCONY, lo), P(s1, BALCONY, lo),
        P(s0, -0.2, top + 0.2), P(s1, -0.2, top + 0.2), P(s0, BALCONY, hi), P(s1, BALCONY, hi),
      ]));
    }
  }
});

const towerBody = union([
  prism(TOWER, BASE, z(TOWER_ROOF)),
  prism(WING, BASE, z(LOW_WING)),
  prism(LIFT, z(TOWER_ROOF) - 0.1, z(LIFT_ROOF)),
  ...VENTS.map((v) => prism(v, z(TOWER_ROOF) - 0.1, z(VENT_TOP))),
]);

// ---------- Vensters als blinde nissen ----------
const DEPTH = 0.35;
const nicheCuts = [];
function face(a, b, floors, { pitch, width, sill, header, margin = 0.9 }) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const bays = Math.max(1, Math.floor((L - 2 * margin + (pitch - width)) / pitch)), w = (L - bays * pitch) / 2;
  for (const [zf, fh] of floors) {
    const lo = zf + sill, hi = zf + fh - header - DEPTH;
    if (hi - lo < 0.5) continue;
    for (let k = 0; k < bays; k++) {
      const s0 = w + k * pitch + (pitch - width) / 2, s1 = s0 + width;
      nicheCuts.push(Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]));
    }
  }
}
const edges = (poly) => poly.map((p, i) => [p, poly[(i + 1) % poly.length]]); // rect is linksom: de buitenkant ligt rechts
// Sokkel: twee kantoorlagen van 4,8 m met vensters van 2,4 × 1,9 m op een travee van 3,6 m (foto 2017).
const PODIUM_FLOORS = [[0, 4.8], [4.8, z(PODIUM_ROOF) - 4.8]];
for (const [a, b] of edges(PODIUM)) face(a, b, PODIUM_FLOORS, { pitch: 3.6, width: 2.4, sill: 1.2, header: 1.4 });
// Lage strook: één laag met een doorlopende glasstrook op de drie vrije gevels.
const WING_FLOOR = [[z(PODIUM_ROOF), z(LOW_WING) - z(PODIUM_ROOF)]];
const [w0, w1, w2, w3] = WING; // [u0,v0] [u1,v0] [u1,v1] [u0,v1]
for (const [a, b] of [[w3, w0], [w0, w1], [w1, w2]]) face(a, b, WING_FLOOR, { pitch: Math.hypot(b[0] - a[0], b[1] - a[1]) - 1.8, width: Math.hypot(b[0] - a[0], b[1] - a[1]) - 1.8, sill: 0.8, header: 0.35 });

// De balkonnissen van de eerste woonlaag lopen bij de zuid- en oosthoek om de hoek; de lage strook blijft heel.
const balconies = union(towerCuts).subtract(prism(WING, BASE - 1, z(LOW_WING)));
const tower = towerBody.subtract(union([balconies, ...nicheCuts.filter((c) => c.boundingBox().min[2] > z(PODIUM_ROOF) - 0.01)]));
const podium = prism(PODIUM, BASE, z(PODIUM_ROOF))
  .subtract(prism(TOWER, BASE - 1, z(PODIUM_ROOF) + 1))
  .subtract(prism(WING, BASE - 1, z(PODIUM_ROOF) + 1))
  .subtract(union(nicheCuts.filter((c) => c.boundingBox().min[2] < z(PODIUM_ROOF) - 0.01)));

const nodes = [["building:de-hoogt-utrecht-toren", tower], ["building:de-hoogt-utrecht-sokkel", podium]].map(([name, m]) => {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
  return [name, m];
});
console.log("balkonnissen", towerCuts.length, "vensternissen", nicheCuts.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "De Hoogt",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 44.81, // NAP-maaiveld + 43,45 (plaatselijke offset Kanaleneiland, zoals het Piet van Dommelenhuis)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000065643"],
    description:
      "Woontoren De Hoogt (1968) aan de Beneluxlaan en de Van Weerden Poelmanlaan in Kanaleneiland: kantoorsokkel van twee lagen over de BAG-contour tot NAP +10,95 m met vensters per laag, daarop een toren van 23,5 × 34,5 m (buitenrand van de balkonplaten) tot +64,95 m met 18 woonlagen van 2,75 m, per laag een rondlopende balkonplaat met vaste stukken witte borstwering en open balkons op de hoeken, een gesloten dakrand van 4,5 m en een liftopbouw tot +68,0 m; tegen de zuidoostgevel een lage strook van één laag tot +13,65 m. Hoogtes uit het AHN-DSM en de 3D BAG. Oorsprong in het hart van de BAG-contour, X-as langs de korte torengevels (29,5° op RD-oost). Verdiepingshoogte, balkondiepte, de indeling van de noordoost- en zuidoostgevel (puntsymmetrisch aangenomen) en de vensters van de sokkel zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      podiumNapM: PODIUM_ROOF,
      lowWingNapM: LOW_WING,
      towerRoofNapM: TOWER_ROOF,
      liftNapM: LIFT_ROOF,
      towerPlanM: [+(U1 - U0).toFixed(2), +(V1 - V0).toFixed(2)],
      floors: { podium: 2, tower: 18 },
      storeyHeightM: STOREY,
      crownHeightM: +(z(TOWER_ROOF) - CROWN).toFixed(2),
      balconyDepthM: BALCONY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0344100000065643 (bouwjaar 1968), actuele orthoHR, AHN-DSM en -DTM 0,5 m, 3D BAG (LoD2.2, AHN5 2023)",
      "https://nl.wikipedia.org/wiki/De_Hoogt_(toren)",
      "https://commons.wikimedia.org/wiki/File:Utrecht_De_Hoogt.jpg",
      "https://commons.wikimedia.org/wiki/File:Toren_De_Hoogt_te_stad_Utrecht.jpg",
    ],
  },
});

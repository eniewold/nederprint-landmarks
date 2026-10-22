// 2Amsterdam (Eduard van Beinumstraat, Zuidas, Amsterdam; 1992 W.Th. Ellerman als de Stibbe Torens,
// 2018-2021 verbouwd door KCAP): twee kantoortorens waarvan de naar elkaar gekeerde gevels gebogen
// zijn. De westelijke toren is verhoogd tot hoteltoren (glasgevel met verticale vinnen), de oostelijke
// is kantoor gebleven met een gebogen glazen schild dat lager is dan het blok erachter. Aan beide torens
// lage vleugels; onder het geheel ligt sinds 2021 een parkeergarage (eigen BAG-pand) met een
// toegangspaviljoen aan de noordkant.
// Contouren uit de BAG, hoogtes uit het AHN-DSM, gevelindeling uit foto's.
import { CrossSection, Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "2amsterdam";
// Gebouwstelsel: u naar het oosten langs de zuidgevels (3,0° linksom op RD-oost, BAG-randen evenwijdig
// binnen 0,1°), v naar het noorden. Oorsprong tussen de twee torens.
const ORIGIN = [119840.0, 483700.0];
const ANGLE = 3.0;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.8; // NAP, AHN-DTM rondom (0,7–0,8; PDOK-terrein 43,6 ellipsoïdisch)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), AHN-DSM ----------
const HOTEL_ROOF = 75.3; // hoteltoren (74–76; 73,4 m boven maaiveld volgens de hoogbouwlijst)
const HOTEL_PLANT = 86.0; // installatieopbouw (82–87)
const HOTEL_ANNEX = 9.2; // lage oostvleugel van de hoteltoren (9)
const HOTEL_NORTH = 8.3; // lage noordvleugel (8)
const OFFICE_SHIELD = 61.0; // gebogen glazen schild van de kantoortoren (60–63)
const OFFICE_ROOF = 65.5; // blok achter het schild (64–66)
const OFFICE_PLANT = 68.0; // installatiekast (68)
const OFFICE_WING = 22.5; // lage vleugels om de kantoortoren (19–23)
const PAVILION = 7.0; // toegangspaviljoen van de parkeergarage (7)

// ---------- Plattegronden in (u, v) ----------
// Hoteltoren: rechte westgevel, gebogen oostgevel. De BAG geeft de noordelijke helft van de boog; de
// zuidelijke helft is gespiegeld om v = -17,2 (het DSM toont dezelfde boog, de BAG heeft daar de
// oostvleugel ertegenaan).
const ARC_N = [[-9.36, -15.1], [-9.6, -12.41], [-10.04, -9.75], [-10.68, -7.13], [-11.51, -4.57], [-12.54, -2.08], [-13.75, 0.33], [-15.14, 2.64], [-16.7, 4.84]];
const ARC_S = ARC_N.slice(1).map(([u, v]) => [u, -34.4 - v]).reverse();
const HOTEL = [[-32.27, -35.44], [-24.83, -35.44], [-24.85, -38.22], [-18.19, -37.37], ...ARC_S, ...ARC_N, [-18.23, 3.79], [-24.88, 4.65], [-24.94, 1.84], [-32.27, 1.7]];
const HOTEL_ANNEX_POLY = rect(-11.5, -35.44, 0.29, -15.08);
const HOTEL_NORTH_POLY = [[-29.5, 1.0], [-29.5, 28.11], [-37.43, 28.08], [-37.42, 25.72], [-34.88, 25.71], [-34.93, 15.69], [-33.26, 1.0]]; // tot v = 1,0 zodat hij op de toren aansluit
const HOTEL_PLANT_POLY = rect(-27.0, -11.0, -17.5, 2.0);
// Kantoortoren: gebogen westgevel (BAG), daarachter het blok tot u = 20,5 (DSM).
const OFFICE_ARC = [[7.39, 44.57], [5.83, 42.43], [4.45, 40.17], [3.24, 37.81], [2.22, 35.37], [1.38, 32.86], [0.74, 30.29], [0.29, 27.68], [0.05, 25.04], [0.01, 22.4], [0.17, 19.53], [0.56, 16.69], [1.18, 13.89], [2.01, 11.15], [3.06, 8.48], [4.32, 5.9], [5.78, 3.43], [7.43, 1.09]];
const SHIELD_U = 10.0; // grens tussen het lage schild en het hoge blok (DSM)
const OFFICE_E = 20.5;
const OFFICE = [...OFFICE_ARC.slice().reverse(), [OFFICE_E, 1.09], [OFFICE_E, 44.57]].reverse();
const OFFICE_WING_POLY = [[29.87, 53.18], [9.62, 53.2], [9.62, 43.54], [8.9, 43.38], [7.39, 44.57], [OFFICE_E, 44.57], [OFFICE_E, 1.09], [7.43, 1.09], [8.98, 2.19], [9.67, 2.08], [9.6, -17.94], [23.19, -17.99], [23.29, -18.58], [24.01, -19.54], [25.14, -19.91], [25.74, -19.82], [26.71, -19.13], [27.11, -18.0], [29.89, -18.0]];
const OFFICE_PLANT_POLY = rect(13.5, 17.5, 16.5, 26.5);
const PAVILION_POLY = rect(-36.5, 40.0, -29.6, 52.5);

const hotelBody = union([
  prism(HOTEL, BASE, z(HOTEL_ROOF)),
  prism(HOTEL_PLANT_POLY, z(HOTEL_ROOF) - 0.1, z(HOTEL_PLANT)),
  prism(HOTEL_ANNEX_POLY, BASE, z(HOTEL_ANNEX)),
  prism(HOTEL_NORTH_POLY, BASE, z(HOTEL_NORTH)),
]);
const officeBody = union([
  prism(OFFICE, BASE, z(OFFICE_SHIELD)),
  prism(rect(SHIELD_U, 1.09, OFFICE_E, 44.57), BASE, z(OFFICE_ROOF)),
  prism(OFFICE_PLANT_POLY, z(OFFICE_ROOF) - 0.1, z(OFFICE_PLANT)),
  prism(OFFICE_WING_POLY, BASE, z(OFFICE_WING)),
]);

// ---------- Gevelreliëf ----------
const DEPTH = 0.35;
const floorsOf = (ground, storey, top) => {
  const out = [[0, ground]];
  for (let zf = ground; zf + storey <= z(top) + 0.01; zf += storey) out.push([zf, storey]);
  return out;
};
// Vensters per travee of één doorlopende band per laag langs de rand a→b (buitennormaal rechts),
// blinde nissen met een plafond onder 45°, alleen waar de gevel buitengevel is.
function face(body, cuts, a, b, floors, { mode = "window", pitch = 2.4, width = 1.2, sill = 0.9, header = 0.35 } = {}) {
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
// Doorlopende glasband per laag langs een gebogen gevel: ring tussen de contour en 0,35 m erbinnen,
// met een plafond dat in drie stappen van 0,12 m terugloopt; `keep` beperkt de band tot de boog.
function curvedBands(poly, floors, keep) {
  const cs = new CrossSection([poly]), outer = cs.offset(1.0, "Miter"), bands = [];
  for (const [zf, fh] of floors) {
    const lo = zf + 0.9, hi = zf + fh - 0.35 - DEPTH;
    if (hi - lo < 0.9) continue;
    const slice = (depth, h0, h1) => Manifold.extrude(outer.subtract(cs.offset(-depth, "Miter")), h1 - h0).translate([0, 0, h0]);
    bands.push(slice(DEPTH, lo, hi), slice((DEPTH * 2) / 3, hi - 0.01, hi + 0.12), slice(DEPTH / 3, hi + 0.11, hi + 0.24));
  }
  return union(bands).intersect(keep);
}

// Hoteltoren: begane grond 4,5 m en lagen van 3,4 m; glasgevel met verticale vinnen als smalle
// vensterkolommen (travee 1,8 m), de boog met een band per laag boven de vleugels.
const HOTEL_FLOORS = floorsOf(4.5, 3.4, HOTEL_ROOF);
const hotelCuts = [];
face(hotelBody, hotelCuts, [-32.27, 1.7], [-32.27, -35.44], HOTEL_FLOORS, { pitch: 1.8, width: 1.0 });
face(hotelBody, hotelCuts, [-32.27, -35.44], [-24.83, -35.44], HOTEL_FLOORS, { pitch: 1.8, width: 1.0 });
face(hotelBody, hotelCuts, [-24.88, 4.65], [-32.27, 4.65], HOTEL_FLOORS.filter(([zf]) => zf > z(HOTEL_NORTH)), { pitch: 1.8, width: 1.0 });
hotelCuts.push(curvedBands(HOTEL, HOTEL_FLOORS.filter(([zf]) => zf > z(HOTEL_ANNEX)), prism(rect(-20.5, -40, 5, 10), z(HOTEL_ANNEX) + 0.5, 200)));
face(hotelBody, hotelCuts, [0.29, -35.44], [0.29, -15.08], [[0, 4.5]], { pitch: 4.0, width: 2.8, sill: 0.3 });
// Kantoortoren: begane grond 4,5 m en lagen van 3,6 m; glasbanden per laag, ook rond het schild.
const OFFICE_FLOORS = floorsOf(4.5, 3.6, OFFICE_ROOF);
const officeCuts = [];
officeCuts.push(curvedBands(OFFICE, OFFICE_FLOORS.filter(([zf, fh]) => zf > z(OFFICE_WING) && zf + fh <= z(OFFICE_SHIELD)), prism(rect(-5, 0, SHIELD_U - 1, 46), BASE, 200)));
face(officeBody, officeCuts, [OFFICE_E, 1.09], [OFFICE_E, 44.57], OFFICE_FLOORS, { mode: "band" });
face(officeBody, officeCuts, [SHIELD_U, 1.09], [OFFICE_E, 1.09], OFFICE_FLOORS, { mode: "band" });
face(officeBody, officeCuts, [OFFICE_E, 44.57], [SHIELD_U, 44.57], OFFICE_FLOORS, { mode: "band" });
face(officeBody, officeCuts, [SHIELD_U, 44.57], [SHIELD_U, 1.09], OFFICE_FLOORS.filter(([zf]) => zf > z(OFFICE_SHIELD)), { mode: "band" });
face(officeBody, officeCuts, [29.89, -18.0], [29.87, 53.18], floorsOf(4.5, 3.6, OFFICE_WING), { mode: "band" });

const hotel = hotelBody.subtract(union(hotelCuts));
const office = officeBody.subtract(union(officeCuts));
const pavilion = prism(PAVILION_POLY, BASE, z(PAVILION));
for (const [name, m] of [["hoteltoren", hotel], ["kantoortoren", office]]) {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`2Amsterdam ${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(`2Amsterdam ${name}`, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
}

await writeLandmark({
  slug,
  base: BASE,
  nodes: [
    ["building:2amsterdam-hoteltoren", hotel],
    ["building:2amsterdam-kantoortoren", office],
    ["building:2amsterdam-garagepaviljoen", pavilion],
  ],
  catalog: {
    name: "2Amsterdam",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.6, // PDOK-terrein rondom (ellipsoïdisch)
    groundOffsetMetres: -0.15,
    // De garage (pand 0363100012252214) wordt in PDOK tot de kantoortoren opgetrokken en gaat daarom mee.
    replacesBuildings: ["NL.IMBAG.Pand.0363100012081222", "NL.IMBAG.Pand.0363100012075036", "NL.IMBAG.Pand.0363100012252214"],
    description:
      "2Amsterdam aan de Eduard van Beinumstraat (Zuidas): de westelijke hoteltoren tot NAP +75,3 m met een gebogen oostgevel (BAG-boog, zuidhelft gespiegeld), installatieopbouw tot +86,0 m en lage vleugels van +9,2 en +8,3 m; de oostelijke kantoortoren met een gebogen glazen schild tot +61,0 m voor een blok tot +65,5 m, een installatiekast tot +68,0 m en lage vleugels tot +22,5 m; en het toegangspaviljoen van de parkeergarage tot +7,0 m. Verticale vensterkolommen in de hoteltoren, glasbanden per laag in de kantoortoren en langs beide bogen. Hoogtes uit het AHN-DSM. Oorsprong tussen de torens, X-as langs de zuidgevels (3,0° op RD-oost). Verdiepingshoogtes, vinnen en banden zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      hotelRoofNapM: HOTEL_ROOF,
      hotelPlantNapM: HOTEL_PLANT,
      hotelWingsNapM: [HOTEL_ANNEX, HOTEL_NORTH],
      officeRoofNapM: [OFFICE_SHIELD, OFFICE_ROOF],
      officePlantNapM: OFFICE_PLANT,
      officeWingsNapM: OFFICE_WING,
      garagePavilionNapM: PAVILION,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG panden 0363100012081222 (1985), 0363100012075036 (1992) en 0363100012252214 (2021), actuele orthoHR, AHN-DSM en -DTM 0,5 m, PDOK 3D-gebouwtegel (LoD2.2)",
      "https://nl.wikipedia.org/wiki/2Amsterdam",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam",
      "https://commons.wikimedia.org/wiki/File:2Amsterdam_hoteltoren_in_2025.jpg",
      "https://commons.wikimedia.org/wiki/File:2Amsterdam_II_(2019.06.09).jpg",
      "https://commons.wikimedia.org/wiki/File:Zuidas_Strawinsky_01.jpg",
      "https://commons.wikimedia.org/wiki/File:Zuidas_Strawinsky_02.jpg",
    ],
  },
});

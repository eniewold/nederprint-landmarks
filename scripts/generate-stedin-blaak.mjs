// Blaak 8 (Rotterdam, 2012, GROUP A met Dreissen Architecten): kantoortoren van twintig lagen aan de Blaak
// bij de Oude Haven, hoofdkantoor van Stedin. Opbouw "voet, romp en kop": een trapeziumvormige sokkel van
// zes lagen evenwijdig aan de verlengde Willemsbrug, met aan de zuidoostkant een lager deel met een
// parkeergarage en installaties op het dak; daarop een rechthoekige romp van elf lagen die aan de westhoek
// tot 5,9 m over de sokkel uitkraagt (vlak plafond); bovenop een kop van drie lagen waarvan de gevel aan de
// Blaak zo'n 13° is weggedraaid, zodat aan de westhoek een driehoekig terras overblijft. Witte betonnen
// dragende gevel met smalle staande vensters op een travee van 1,8 m (basismaat 7,2 m), hier en daar een
// dicht paneel. Op het dak een sleuf met installaties en een koelerblok.
// Contouren uit de BAG, hoogtes uit de 3D BAG (LoD2.2, AHN5 2023) en het AHN-DSM, gevelindeling uit foto's.
import { Manifold, ccw, circle, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "stedin-blaak";
// Gebouwstelsel: X langs de gevel aan de Blaak van de noordhoek naar de westhoek (221,56° op RD-oost, BAG-
// randen van de romp binnen 0,3° evenwijdig), Y langs de lange gevels naar het zuidoosten; de gevel met de
// ingang aan de Blaak ligt aan -Y. Oorsprong in het hart van de romp.
const ORIGIN = [93240.81, 437122.82];
const ANGLE = 221.56;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [+Math.cos(A).toFixed(6), +Math.sin(A).toFixed(6)];
const GROUND = 3.9; // NAP, AHN-DTM langs de noordwest- en zuidwestgevel (3,9–4,05; 3D BAG-maaiveld 3,87)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 ----------
const PLINTH = 24.85; // sokkel en lager deel (dakvlak 24,80–25,02); ook het plafond onder de uitkraging (foto 24,7)
const BODY = 63.7; // romp: terras aan de westhoek (63,62–63,84)
const TOP = 74.33; // kop (dakvlak 74,30–74,40; 3D BAG-70p 74,36)
const PLANT = 75.94; // koelerblok op het dak (75,90–75,97)
const WELL = 70.78; // verdiepte dakstrook met installaties aan de zuidwestkant (70,75–70,82)
const WELL_STEPS = [72.06, 73.52]; // trappen in de sleuf (72,01–72,12 en 73,46–73,58)
const PODIUM_BOX = 27.4; // installatiekast op het lagere deel (27,33–27,46)
const PODIUM_TANKS = 28.42; // drie ronde installatietanks naast de kast (28,40–28,44)
const ROOFLIGHT = 25.85; // twee lage lichtstraten op het lagere deel (3D BAG 25,15–26,40, DSM +1 m)

// ---------- Plattegronden in (x, y), BAG-contour ----------
const N = [-11.82, -19.84], W = [11.94, -19.88], S = [11.73, 19.89], E = [-11.85, 20.09];
// Sokkel: de zuidwestgevel van het lagere deel loopt in één lijn door tot de gevel aan de Blaak (5,9 m uit
// de westhoek; foto 5,4 m); de noordoostgevel ligt in het vlak van de romp.
const Q = [14.75, 40.59], R = [-11.88, 40.88];
const P = [S[0] + ((N[1] - S[1]) * (Q[0] - S[0])) / (Q[1] - S[1]), N[1]];
const PLINTH_POLY = [N, P, Q, R];
const BODY_POLY = [N, W, S, E];
const TOP_CORNER = [11.91, -14.3]; // kop: gevel aan de Blaak gedraaid van de noordhoek naar dit punt
const TOP_POLY = [N, TOP_CORNER, S, E];

const solid = union([
  prism(PLINTH_POLY, BASE, z(PLINTH)),
  prism(BODY_POLY, z(PLINTH) - 0.1, z(BODY)),
  prism(TOP_POLY, z(BODY) - 0.1, z(TOP)),
  prism(rect(0.0, -12.67, 2.1, -3.6), z(TOP) - 0.1, z(PLANT)),
  prism(rect(3.7, 27.4, 11.4, 32.3), z(PLINTH) - 0.1, z(PODIUM_BOX)),
  ...[4.95, 7.6, 10.25].map((x) => prism(circle([x, 33.7], 1.3, 24), z(PLINTH) - 0.1, z(PODIUM_TANKS))),
  prism(rect(-5.9, 21.0, -4.7, 39.8), z(PLINTH) - 0.1, z(ROOFLIGHT)),
  prism(rect(0.0, 23.3, 1.4, 38.6), z(PLINTH) - 0.1, z(ROOFLIGHT)),
]);
// Sleuf in het dak (wand van 0,94 m naar de zuidwestgevel) met twee treden.
const roofWell = union([
  prism(rect(7.3, -4.5, 11.0, 1.57), z(WELL), z(TOP) + 1),
  prism(rect(7.3, -8.3, 8.9, -4.5), z(WELL), z(TOP) + 1),
  prism(rect(8.9, -6.3, 11.0, -4.5), z(WELL_STEPS[0]), z(TOP) + 1),
  prism(rect(8.9, -8.3, 11.0, -6.3), z(WELL_STEPS[1]), z(TOP) + 1),
]);
const body = solid.subtract(roofWell);

// ---------- Gevelreliëf ----------
// Begane grond 4,4 m, dan vijf sokkellagen tot +24,85, elf romplagen en drie kooplagen. Per laag smalle
// staande vensters van 0,9 m op een travee van 1,8 m als blinde nissen van 0,35 m met een plafond onder
// 45°; ongeveer één op de elf posities is een dicht paneel (de "boom"-gevel met zeven venstertypen).
const floors = (z0, z1, n) => Array.from({ length: n }, (_, k) => [z0 + ((z1 - z0) * k) / n, (z1 - z0) / n]);
const GROUND_FLOOR = 4.4;
const PLINTH_FLOORS = [[0, GROUND_FLOOR], ...floors(GROUND_FLOOR, z(PLINTH), 5)];
const BODY_FLOORS = floors(z(PLINTH), z(BODY), 11);
const TOP_FLOORS = floors(z(BODY), z(TOP), 3);
const DEPTH = 0.35, PITCH = 1.8, WIDTH = 0.9;
const ENTRANCE = [-3.8, 0.6]; // ingang aan de Blaak (x), 4,4 m breed, onder het opschrift BLAAK8
const ENTRANCE_DEPTH = 0.6, ENTRANCE_HEIGHT = 3.9;

const cuts = [];
let windowIndex = 0;
function niches(a, b, floorList, { minNap = -Infinity, skip = () => false } = {}) {
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (L < 4) return;
  const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
  const Pt = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
  const bays = Math.floor((L - 0.9) / PITCH), w = (L - bays * PITCH) / 2;
  floorList.forEach(([zf, fh], fi) => {
    const lo = zf + 0.9, hi = zf + fh - 0.35 - DEPTH;
    if (lo + GROUND < minNap) return;
    for (let k = 0; k < bays; k++) {
      windowIndex++;
      if ((k * 7 + fi * 3 + Math.round(L)) % 11 === 0) continue; // dicht paneel
      const s0 = w + k * PITCH + (PITCH - WIDTH) / 2, s1 = s0 + WIDTH;
      if (skip(Pt(s0, 0, lo), Pt(s1, 0, lo))) continue;
      const exposed = [s0 + 0.1, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => {
        const from = Pt(s, -3, h), hit = body.rayCast(from, Pt(s, 1, h))[0];
        const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
        return at > 2.95 && at < 3.05;
      }));
      if (exposed) cuts.push(Manifold.hull([Pt(s0, -0.2, lo), Pt(s1, -0.2, lo), Pt(s0, DEPTH, lo), Pt(s1, DEPTH, lo), Pt(s0, -0.2, hi + DEPTH + 0.2), Pt(s1, -0.2, hi + DEPTH + 0.2), Pt(s0, DEPTH, hi), Pt(s1, DEPTH, hi)]));
    }
  });
}
const edges = (poly) => ccw(poly).map((p, i, r) => [p, r[(i + 1) % r.length]]);
const near = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.05;
const isEdge = ([a, b], p, q) => (near(a, p) && near(b, q)) || (near(a, q) && near(b, p));
const inEntrance = (p0, p1) => p0[2] < GROUND_FLOOR && Math.max(p0[0], p1[0]) > ENTRANCE[0] - 0.5 && Math.min(p0[0], p1[0]) < ENTRANCE[1] + 0.5;
for (const e of edges(PLINTH_POLY)) {
  // Noordoostgevel: buurpand tot NAP +23,7 tegen de hele sokkel; zuidoostkop: buurpand tot +20,5.
  if (isEdge(e, R, N)) continue;
  niches(e[0], e[1], PLINTH_FLOORS, { minNap: isEdge(e, Q, R) ? 20.6 : -Infinity, skip: isEdge(e, N, P) ? inEntrance : () => false });
}
for (const [a, b] of edges(BODY_POLY)) niches(a, b, BODY_FLOORS);
for (const [a, b] of edges(TOP_POLY)) niches(a, b, TOP_FLOORS);
// Ingang aan de Blaak: portaal van 0,6 m diep met een plafond onder 45°.
{
  const [x0, x1] = ENTRANCE, y = N[1];
  cuts.push(Manifold.hull([
    [x0, y - 0.2, 0], [x1, y - 0.2, 0], [x0, y + ENTRANCE_DEPTH, 0], [x1, y + ENTRANCE_DEPTH, 0],
    [x0, y - 0.2, ENTRANCE_HEIGHT + 0.2], [x1, y - 0.2, ENTRANCE_HEIGHT + 0.2],
    [x0, y + ENTRANCE_DEPTH, ENTRANCE_HEIGHT - ENTRANCE_DEPTH], [x1, y + ENTRANCE_DEPTH, ENTRANCE_HEIGHT - ENTRANCE_DEPTH],
  ]));
}

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Blaak 8: ${parts.length} losse delen`);
console.log("Blaak 8", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "nissen", cuts.length, "posities", windowIndex);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [[`building:${slug}-toren`, building]],
  catalog: {
    name: "Blaak 8",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 47.43, // NAP 3,9 + 43,53 (geoïde NLGEO2018 43,60; geijkt op OurDomain Blaak en De Witte Keizer)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0599100000755012"],
    description:
      "Kantoortoren Blaak 8 (hoofdkantoor van Stedin) aan de Blaak bij de Oude Haven: sokkel van zes lagen tot NAP +24,85 m op de BAG-contour, waarvan de zuidwestgevel in één lijn met die van het lagere zuidoostelijke deel doorloopt; daarop een romp van 23,7 × 39,7 m tot +63,7 m die aan de westhoek tot 5,9 m over de sokkel uitkraagt, en een kop van drie lagen tot +74,33 m waarvan de gevel aan de Blaak gedraaid is, zodat aan de westhoek een driehoekig terras op +63,7 m blijft. Op het dak een koelerblok tot +75,94 m en een verdiepte installatiesleuf, op het lagere deel een installatiekast, drie tanks en twee lichtstraten. Per laag smalle staande vensters op een travee van 1,8 m als blinde nissen, met hier en daar een dicht paneel, en de ingang aan de Blaak. Hoogtes uit de 3D BAG (AHN5 2023). Oorsprong in het hart van de romp, X-as langs de gevel aan de Blaak naar de westhoek (221,56° op RD-oost), ingang aan -Y. Verdiepingshoogtes, vensterraster, de dichte panelen, de ingang en de vorm van de installaties zijn geschat; de taak noemde het gebouw 'Kantoor Stedin (Blaak 8)', de naam van het gebouw is Blaak 8.",
    realWorld: {
      groundNapM: GROUND,
      plinthNapM: PLINTH,
      bodyNapM: BODY,
      topNapM: TOP,
      plantNapM: PLANT,
      roofWellNapM: [WELL, ...WELL_STEPS],
      podiumBoxNapM: PODIUM_BOX,
      podiumTanksNapM: PODIUM_TANKS,
      rooflightNapM: ROOFLIGHT,
      bodyM: [23.75, 39.75],
      cantileverM: +(W[0] - P[0]).toFixed(2),
      topSetbackM: +(TOP_CORNER[1] - W[1]).toFixed(2),
      floors: { plinth: 6, body: 11, top: 3 },
      windowPitchM: PITCH,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100000755012 (bouwjaar 2011), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG LoD2.2 NL.IMBAG.Pand.0599100000755012 (puntwolk AHN5 2023)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Rotterdam",
      "https://divisare.com/projects/210530-group-a-ossip-van-duivenbode-blaak-8",
      "https://www.pss-archi.eu/immeubles/NL-599-43079.html",
      "https://commons.wikimedia.org/wiki/File:1503_Blaak_8,_Rotterdam_026.jpg",
      "https://commons.wikimedia.org/wiki/File:Kantoorgebouw_Blaak_8.jpg",
    ],
  },
});

// De Entree II (De Entree 230–266, Amsterdam-Zuidoost, 2002): kantoortoren van 18 lagen bij station
// Bijlmer ArenA. Een glazen schijf van 27,5 × 32,2 m met afgeronde hoeken aan de zuidoostkop staat op
// kolommen boven een open onderbouw van twee lagen; per twee lagen loopt een lichte vloerrand rondom.
// Aan de noordwestkop staat een witte kern die boven het dak uitsteekt, in een verdiepte ronde patio
// (NAP -6,8) die bij het pand hoort maar maaiveld blijft. Op het dak een teruggezette installatiekast en
// twee groepen koelers; aan de noordoostgevel een laag entreepaviljoen met een ronde kop.
// Contouren uit de BAG (dak) en de BGT (pand op maaiveld, kolommen), hoogtes uit de 3D BAG (AHN5, 2023)
// en het AHN4-DSM, gevelindeling en de hoogte van de onderbouw uit een foto.
import { CrossSection, Manifold, circle, prism, rect, ring3, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "entree-ii";
// Gebouwstelsel: u langs de zuidoostkop naar het oostnoordoosten (28,97° op RD-oost; BAG-randen evenwijdig
// binnen 0,1°), v langs de lange gevels naar het noordnoordwesten. Oorsprong bij het hart van de schijf.
const ORIGIN = [124574.0, 480312.0];
const ANGLE = 28.97;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
// NAP, het plein rondom (AHN-DTM -3,1…-3,5 aan alle kanten). De 3D BAG noemt -6,81 als maaiveld: dat is de
// bodem van de verdiepte patio binnen de BAG-contour, niet het plein waarop de toren staat.
const GROUND = -3.3;
const PATIO = -6.8; // bodem van de patio rond de kern (AHN-DTM -6,6…-6,8, BGT erf)
// De onderkant ligt 0,8 m onder de patiobodem, zodat de kern en de noordwestkop tot daar doorlopen; onder
// het plein zit dat deel in het PDOK-terrein.
const BASE = PATIO - 0.8 - GROUND;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 (AHN5) en AHN4-DSM ----------
const ROOF = 65.26; // dak van de schijf (3D BAG 65,25–65,27; DSM 65,2–65,3)
const PLANT = 69.29; // teruggezette installatiekast (3D BAG 69,26–69,31; DSM 69,2–69,4)
const COOLERS = 67.65; // twee groepen koelers op het dak (3D BAG 67,63–67,69)
const CORE = 70.4; // witte kern (3D BAG 70,38–70,44; DSM 70,4)
const PAVILION = 2.2; // entreepaviljoen (3D BAG 2,08–2,33)
const SOFFIT = 8.1; // onderkant van de schijf boven het plein (foto, schaal op de dakhoogte; geschat)

// ---------- Plattegrond in (u, v) ----------
// Schijf: BAG-dakcontour, afgeronde hoeken (straal 2,7 m) aan de zuidoostkop, rechte hoeken aan de kern.
const U0 = -12.39, U1 = 15.07, V0 = -15.36, V1 = 16.79, R = 2.7;
const arc = (c, a0, a1, n = 10) => Array.from({ length: n + 1 }, (_, k) => {
  const a = a0 + ((a1 - a0) * k) / n;
  return [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)];
});
const SLAB = [
  ...arc([U0 + R, V0 + R], Math.PI, 1.5 * Math.PI),
  ...arc([U1 - R, V0 + R], 1.5 * Math.PI, 2 * Math.PI),
  [U1, V1], [U0, V1],
];
// Kern (BGT-pand op maaiveld en 3D BAG-dak), aan de noordwestkop in de patio.
const CORE_POLY = rect(-3.2, V1 - 0.8, 5.9, 23.65);
// Installatiekast (3D BAG-dakvlak), met de verbinding naar de kern.
const PLANT_POLY = [[-5.4, -5.4], [7.3, -5.4], [7.4, 13.8], [3.4, 14.6], [3.4, V1 - 0.1], [-0.3, V1 - 0.1], [-0.3, 14.6], [-5.3, 13.6]];
const COOLER_POLYS = [rect(-4.9, -10.8, -2.3, -5.8), rect(5.0, -11.3, 7.25, -6.2)];
// Onderbouw: de schijf rust op een kern van lobby's en trappenhuizen met kolommen ervoor (BGT). Model:
// rondom een terugligging tot een achterwand van 3,6 m, met een plafond dat onder minstens 45° naar de
// gevelrand loopt (zuidwest en noordoost 3,5 m diep, zuidoostkop 4,3 m, waar twee kolommen vrij staan).
const UNDER_TOP = 3.6;
const UNDER = rect(U0 + 3.5, V0 + 4.3, U1 - 3.5, V1);
const COLUMNS = [[-4.35, -12.69], [7.05, -12.71]]; // BGT, doorsnede 1,05 m
// Entreepaviljoen (BAG/BGT) met ronde kop, doorgetrokken tot in de terugligging (de lobby onder de schijf).
const PAV_RECT = rect(11.0, 6.16, 16.76, 13.42);
const PAV_DISC = circle([16.76, 9.78], 1.78, 24);

const slabSection = new CrossSection([SLAB]);
const body = union([
  prism(SLAB, BASE, 0.0),
  prism(UNDER, -0.1, UNDER_TOP),
  Manifold.hull([...ring3(UNDER, UNDER_TOP - 0.01), ...ring3(SLAB, SOFFIT)]),
  prism(SLAB, SOFFIT, z(ROOF)),
  prism(PLANT_POLY, z(ROOF) - 0.1, z(PLANT)),
  ...COOLER_POLYS.map((p) => prism(p, z(ROOF) - 0.1, z(COOLERS))),
  ...COLUMNS.map((c) => prism(circle(c, 0.525, 24), -0.1, SOFFIT - 2.0)),
  prism(PAV_RECT, -0.1, z(PAVILION)),
  prism(PAV_DISC, -0.1, z(PAVILION)),
]);

// ---------- Gevelreliëf ----------
// 16 kantoorlagen boven de onderbouw: 15 van 3,75 m en een hogere bovenste laag tot de dakrand (foto:
// 16 glasbanden boven de kolommen, Wikipedia: 18 lagen met de twee lagen van de onderbouw). Per laag een
// glasband achter een doorlopende borstwering, 0,35 m diep met een plafond onder 45°. De lichte
// vloerrand komt per twee lagen terug (onder kantoorlaag 1, 2, 4, …, 16): daar is de borstwering 1,3 m, anders 0,9 m.
const STOREY = 3.75;
const FLOORS = Array.from({ length: 16 }, (_, k) => [SOFFIT + STOREY * k, k === 15 ? z(ROOF) - SOFFIT - 15 * STOREY : STOREY]);
const DEPTH = 0.35;
// Geen banden in de kern en tot 0,9 m ernaast.
const notCore = prism(rect(-60, -60, 60, 60), -10, 200).subtract(prism(rect(-4.1, V1 - 1.5, 6.8, 40), -10, 200));
const outer = slabSection.offset(1.0, "Miter");
const inset = slabSection.offset(-DEPTH, "Miter").toPolygons()[0];
const bands = FLOORS.map(([zf, fh], k) => {
  const sill = k === 0 || k % 2 === 1 ? 1.3 : 0.9;
  const header = k === 15 ? 0.6 : 0.3;
  const lo = zf + sill, hi = zf + fh - header - DEPTH;
  const inner = union([prism(inset, lo - 0.01, hi), Manifold.hull([...ring3(inset, hi - 0.01), ...ring3(SLAB, hi + DEPTH)])]);
  return Manifold.extrude(outer, hi + DEPTH - 0.02 - lo).translate([0, 0, lo]).subtract(inner);
});
// Paviljoen: één glasband rondom op de vrijstaande kop (buiten de schijf). Rechthoek en ronde kop zijn
// elk convex; per stuk een binnenvorm met een plafond onder 45°.
const pavLo = 0.9, pavHi = z(PAVILION) - 0.6 - DEPTH;
const pavInner = union([PAV_RECT, PAV_DISC].map((poly) => {
  const inner = new CrossSection([poly]).offset(-DEPTH, "Miter").toPolygons()[0];
  return union([prism(inner, pavLo - 0.01, pavHi), Manifold.hull([...ring3(inner, pavHi - 0.01), ...ring3(poly, pavHi + DEPTH)])]);
}));
const pavBand = Manifold.extrude(new CrossSection([PAV_RECT, PAV_DISC].map((p) => p), "Positive").offset(1.0, "Miter"), pavHi + DEPTH - 0.02 - pavLo)
  .translate([0, 0, pavLo]).subtract(pavInner)
  .intersect(prism(rect(U1 + 0.9, -60, 60, 60), -10, 200));

const tower = body.subtract(union([...bands, pavBand]).intersect(notCore));
const core = prism(CORE_POLY, BASE, z(CORE));

const nodes = [["building:entree-ii-toren", tower], ["building:entree-ii-kern", core]];
for (const [name, m] of nodes) {
  const parts = m.decompose();
  if (parts.length !== 1) throw new Error(`${name}: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
  console.log(name, m.status(), "genus", m.genus(), "driehoeken", m.numTri());
}

await writeLandmark({
  slug,
  base: BASE,
  nodes,
  catalog: {
    name: "De Entree II",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 39.7, // PDOK-terrein op het plein (ellipsoïdisch, NAP -3,3 + 43,0 zoals bij Oval Tower en Arena Towers)
    groundOffsetMetres: -0.15,
    // Op het plein aan de zuidwest-, zuidoost- en noordoostkant, buiten de verdiepte patio.
    groundSamplePoints: [[-17, 0], [1, -20], [21, 0]],
    replacesBuildings: ["NL.IMBAG.Pand.0363100012138124"],
    description:
      "Kantoortoren De Entree II (2002) bij station Bijlmer ArenA: glazen schijf van 27,5 × 32,2 m op de BAG-dakcontour met afgeronde hoeken aan de zuidoostkop tot NAP +65,26 m, per laag een glasband (16 kantoorlagen, een lichte vloerrand per twee lagen), een teruggezette installatiekast tot +69,29 m, twee groepen koelers tot +67,65 m en een witte kern aan de noordwestkop tot +70,4 m. De schijf staat op een open onderbouw tot +4,8 m: rondom een terugligging met een plafond onder 45° en aan de zuidoostkop twee vrijstaande kolommen (BGT); aan de noordoostgevel een entreepaviljoen tot +2,2 m. Hoogtes uit de 3D BAG (AHN5). Model-z 0 is het plein op NAP -3,3 m; de kern en de noordwestkop lopen door tot onder de verdiepte patio (NAP -6,8 m), die als maaiveld in het PDOK-terrein blijft. Oorsprong bij het hart van de schijf, X-as langs de zuidoostkop (28,97° op RD-oost). Verdiepingshoogte, hoogte van de onderbouw, diepte van de terugligging en de glasbanden zijn geschat uit een foto.",
    realWorld: {
      groundNapM: GROUND,
      patioNapM: PATIO,
      roofNapM: ROOF,
      plantNapM: PLANT,
      coolersNapM: COOLERS,
      coreNapM: CORE,
      pavilionNapM: PAVILION,
      slabSoffitAboveGroundM: SOFFIT,
      slabPlanM: [+(U1 - U0).toFixed(2), +(V1 - V0).toFixed(2)],
      floors: { offices: 16, undercroft: 2 },
      storeyHeightM: STOREY,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012138124 (bouwjaar 2002, De Entree 230–260), BGT pand, erf en scheiding (kolommen, patio), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "3D BAG NL.IMBAG.Pand.0363100012138124 (LoD2.2, AHN5 2023)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Amsterdam",
      "https://commons.wikimedia.org/wiki/File:Kantoorgebouw_De_Entree_II.jpg",
    ],
  },
});

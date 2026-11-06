// Watertoren van Paleis Soestdijk (Baarn, in het park bij Amsterdamsestraatweg 1), gebouwd in 1680 naar ontwerp van
// fontainier Willem Meesters als reservoir voor de fonteinen van Willem III (rijksmonument 531294, onderdeel van complex
// 531285; Wikipedia: circa 10 m hoog, reservoir 60 m³; oorspronkelijk met een zeswiekige windmolen op het platte dak en
// een rosmolen, rond 1884 verbouwd door L.H. Eberson). Het register beschrijft een cilindrische bakstenen toren op een
// natuurstenen plint met een twaalfzijdige uitkraging op een natuurstenen rondboogfries, een plat dak, natuurstenen
// omlijstingen om (halve) kruisvensters, en aan de zuidwestzijde een uitbouw van één bouwlaag met een driezijdige
// beëindiging en een schilddak van leien; de hoofdingang zit in die uitbouw.
//
// Oorsprong op het hart van de toren: cirkelfit op de tien boogpunten en de twee aansluitpunten van BAG-pand
// 0308100000001971 (RD [147528.71, 467456.93], straal 5,29 m, restfout 0,06 m; de BAG-contour is de dakrand, op de
// luchtfoto ook 10,6 m). Lokale -Y is de as van de uitbouw naar zijn deur (de zijgevels van de uitbouw in de BAG lopen op
// 32,8 graden in RD), dus +X op RD -57,2 graden (zuidoost) en +Y naar het noordoosten. In dat stelsel is de BAG-contour
// spiegelsymmetrisch: zijgevels van de uitbouw op x = -3,30 en 3,20, voorgevel op y = -10,02 (2,54 m breed), schuine
// gevels van (±3,25, -8,37) naar (±1,27, -10,02).
//
// Hoogtes uit het AHN-DSM 0,5 m (2026-11-06): plat dak NAP +15,72 binnen de hele dakrand (3D BAG h_dak_50p 15,71), nok van
// de uitbouw NAP +12,4 tot 12,5 van y = -5,5 tot -8,0 (3D BAG h_nok 12,39), goot van de uitbouw circa NAP +9,0. Maaiveld:
// AHN-DTM NAP +5,7 tot 6,1; PDOK-terrein op de groundSamplePoints ellipsoïdisch 49,00 tot 49,31, het PDOK-pand loopt van
// 48,81 tot 58,96 (AHN 15,72, dus ellipsoïdisch = NAP + 43,24) en z = 0 ligt op NAP +5,76.
// Opstand uit de Commons-foto's (zie README): "Overzicht van de watertoren - Soestdijk - 20423187 - RCE.jpg" (vanuit het
// zuidzuidoosten, ver weg), "Overzicht van de achtergevel en zijgevel ... 20423404 - RCE.jpg" (vanuit het oosten),
// "Overzicht van de voorgevel ... 20423403 - RCE.jpg" (frontaal op de uitbouw) en "Soestdijk Watertoren 0537.JPG". De
// cilinder is op de foto's 0,81 tot 0,91 keer zo breed als hoog en de dakrand 1,04 tot 1,10 keer zo breed als de
// cilinder; met de dakrand uit de BAG (10,6 m) en de hoogte uit het AHN (9,96 m) wordt dat een cilinder van 9,2 m (het
// register noemt 8,20 m; zie README).
const argv = process.argv;
if (!argv.includes("--scale")) argv.push("--scale", "100"); // los printen op 1:100 (het model is kleiner dan 15 m)
const { Manifold, CrossSection, ccw, hull, union, prism, circle, place, writeLandmark } = await import("./efteling-kit.mjs");

const ORIGIN = [147528.71, 467456.93];
const DEG = -57.2;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const NAP0 = 5.76; // NAP-hoogte van z = 0 (PDOK-terrein ellipsoïdisch 49,00 min 43,24)
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: oost (+X, 6 m) 49,00,
// noordoost (+Y) 49,31, west (-X) 49,13, voor de deur van de uitbouw (y = -11) 49,08.
const GROUND_ELLIPSOID = 49.0;
const N = 96; // segmenten van de cilinder

// ---------- toren ----------
const H = {
  plinth: 0.55, // natuurstenen plint (foto's: 0,55 tot 0,6 m)
  corbel: 8.0, // onderkant van het rondboogfries, begin van de uitkraging (foto's 7,9 tot 8,2)
  upper: 8.5, // twaalfzijdige bovenwand na de uitkraging (op de hoeken 0,42 m over 0,5 m, 40 graden)
  fascia: 9.45, // begin van de witte dakrand (foto's: circa 0,5 m onder de bovenkant)
  fasciaOut: 9.75, // onderkant van de dakrand: 0,25 m over 0,3 m (40 graden)
  top: 15.72 - NAP0, // plat dak (AHN-DSM NAP +15,72)
};
const R = 4.6; // cilinder (foto's, zie boven; register 4,10)
const R_PLINTH = 4.7;
const R_UPPER = 5.02; // twaalfhoek boven het fries (omgeschreven straal)
const R_ROOF = 5.27; // dakrand: BAG-contour (omgeschreven straal van de twaalfhoek, apothema 5,09)
const PHASE = Math.PI / 12; // hoekpunten op 15 + k × 30 graden: de BAG-hoekpunten liggen symmetrisch rond de as van de uitbouw
const dodecagon = (r) => circle([0, 0], r, 12, PHASE);
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);

const plinth = union([
  prism(circle([0, 0], R_PLINTH, N), BASE, H.plinth),
  hull([...ring(circle([0, 0], R_PLINTH, N), H.plinth - 0.01), ...ring(circle([0, 0], R, N), H.plinth + 1.2 * (R_PLINTH - R))]),
]);
const drumWall = prism(circle([0, 0], R, N), BASE, H.corbel + 0.01);
// Rondboogfries als uitkraging onder 40 graden (op de hoeken van de twaalfhoek 0,42 m over 0,5 m).
const corbel = hull([...ring(circle([0, 0], R, N), H.corbel), ...ring(dodecagon(R_UPPER), H.upper)]);
const upper = prism(dodecagon(R_UPPER), H.upper - 0.01, H.fascia + 0.01);
const fascia = hull([...ring(dodecagon(R_UPPER), H.fascia), ...ring(dodecagon(R_ROOF), H.fasciaOut), ...ring(dodecagon(R_ROOF), H.top)]);

// Nis in het vlak met normaal +X (vlak op x = f), breedte wd rond y, plafond onder 63 graden naar binnen oplopend.
const niche = (f, wd, z0, z1, depth, y = 0) => {
  const y0 = y - wd / 2, y1 = y + wd / 2, za = z1 + 2 * depth, out = Math.min(1, (z1 - z0) / 2);
  return hull([
    [f - depth, y0, z0], [f + out, y0, z0], [f - depth, y1, z0], [f + out, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + out, y0, z1 - 2 * out], [f + out, y1, z1 - 2 * out],
  ]);
};
// Vensters en deur van de toren, hoeken linksom vanaf +X (lokaal = 147,2 - kompasrichting). Uit de foto's vanuit het
// zuidzuidoosten en het oosten: drie vensters op de verdieping (kompas 114, 137 en 159 graden; foto 117), een venster eronder
// (137 graden) en een deur met bovenlicht naar het noordoosten (kompas 35 graden).
const TOWER_OPENINGS = [
  { deg: 33, w: 0.8, z: [4.4, 5.75] }, // half kruisvenster, breed (foto: 30 graden; 33 zodat de penant ook achter in de nissen 0,9 m blijft)
  { deg: 10.2, w: 0.75, z: [4.2, 6.0] }, // kruisvenster
  { deg: -11.8, w: 0.6, z: [4.2, 6.0] }, // smal venster
  { deg: 10.2, w: 0.75, z: [1.0, 2.9] }, // venster op de begane grond
  { deg: 112, w: 0.85, z: [BASE - 0.1, 3.0] }, // deur met bovenlicht
];
const towerOpenings = TOWER_OPENINGS.map(({ deg, w, z }) => place(niche(R, w, z[0], z[1], 0.3), { deg }));
const tower = union([plinth, drumWall, corbel, upper, fascia]).subtract(union(towerOpenings));

// ---------- uitbouw ----------
const SIDE = 3.25, BACK = -2.0, CORNER_Y = -8.37, FRONT_X = 1.27, FRONT_Y = -10.02;
const annexPlan = [[SIDE, BACK], [SIDE, CORNER_Y], [FRONT_X, FRONT_Y], [-FRONT_X, FRONT_Y], [-SIDE, CORNER_Y], [-SIDE, BACK]];
const OVERHANG = 0.3;
const offsetPlan = (d) => new CrossSection([ccw(annexPlan)]).offset(d, "Miter", 4).toPolygons()[0].map(([x, y]) => [x, y]);
const eavePlan = offsetPlan(OVERHANG);
const A = {
  wall: 2.8, // bovenkant van de gevel, begin van de kroonlijst (rondboogfries) onder 45 graden
  eave: 3.15, // goot (AHN-DSM circa NAP +9,0)
  kink: 0.5, // de leien lopen de onderste 0,5 m flauwer (28 graden) uit naar de goot
  ridge: 12.4 - NAP0, // nok (AHN-DSM NAP +12,4 tot 12,5; 3D BAG 12,39)
  apex: -8.0, // voorkant van de nok (AHN-DSM)
};
const walls = prism(annexPlan, BASE, A.wall + 0.01);
const cornice = hull([...ring(annexPlan, A.wall), ...ring(eavePlan, A.eave)]);
// Dakvlakken: per gootlijn een flauw vlak (28 graden) vanaf de goot en een steil vlak door de knik en de nok; het dak is
// het deel onder max(flauw, steil) van elk vlak, samen genomen (min over de vlakken). Zijvlakken lopen naar de nok
// (x = 0), de drie vlakken van de beëindiging naar de voorkant van de nok (0, -8,0).
const below = (a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return prism([[-30, -30], [30, -30], [30, 30], [-30, 30]], BASE, 30).trimByPlane([a / n, b / n, -1 / n], -c / n);
};
const T_FLAT = Math.tan((28 * Math.PI) / 180);
const zKink = A.eave + A.kink * T_FLAT;
const facets = [];
for (let i = 0; i < eavePlan.length; i++) {
  const p = eavePlan[i], q = eavePlan[(i + 1) % eavePlan.length];
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const nx = (q[1] - p[1]) / len, ny = -(q[0] - p[0]) / len; // buitennormaal (ccw-veelhoek)
  if (ny > 0.99) continue; // de achterkant zit in de toren
  const dist = (x, y) => (p[0] - x) * nx + (p[1] - y) * ny; // afstand binnen de gootlijn
  const target = Math.abs(nx) > 0.99 ? [0, -5] : [0, A.apex];
  const s = (A.ridge - zKink) / (dist(...target) - A.kink);
  const pn = p[0] * nx + p[1] * ny;
  const flat = below(-T_FLAT * nx, -T_FLAT * ny, A.eave + T_FLAT * pn);
  const steep = below(-s * nx, -s * ny, zKink + s * (pn - A.kink));
  facets.push(union([flat, steep]));
}
let roof = prism(eavePlan, A.eave - 0.01, 20);
for (const f of facets) roof = roof.intersect(f);

// Dakkapel op het voorste dakvlak (foto voorgevel): 1,0 m breed, venster vanaf circa 4,3 m, zijwangen tot 5,25 m en een
// schilddakje van 48 graden.
const frontEave = FRONT_Y - OVERHANG;
const frontSlope = (A.ridge - zKink) / (A.apex - frontEave - A.kink);
const dormerY = frontEave + A.kink + (4.3 - zKink) / frontSlope;
const DW = 0.5;
const dormer = union([
  prism([[-DW, dormerY], [DW, dormerY], [DW, A.apex + 0.2], [-DW, A.apex + 0.2]], 3.8, 5.25),
  hull([
    ...ring([[-DW, dormerY], [DW, dormerY], [DW, A.apex + 0.2], [-DW, A.apex + 0.2]], 5.24),
    [0, dormerY + DW, 5.25 + 1.1 * DW], [0, A.apex + 0.2, 5.25 + 1.1 * DW],
  ]),
]);

// Deur in de voorgevel (normaal -Y), venster in de zuidoostgevel (+X).
const annexDoor = place(niche(-FRONT_Y, 1.05, BASE - 0.1, 2.35, 0.3), { deg: -90 });
const annexWindow = niche(SIDE, 0.8, 1.15, 1.85, 0.3, -5.8);
const annex = union([walls, cornice, roof, dormer]).subtract(union([annexDoor, annexWindow]));

const building = union([tower, annex]);

await writeLandmark({
  slug: "watertoren-soestdijk",
  base: BASE,
  nodes: [["building:watertoren-met-twaalfzijdige-uitkraging-en-uitbouw-met-schilddak", building]],
  catalog: {
    name: "Watertoren Soestdijk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6, 0], [0, 6], [-6, 0], [0, -11]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0308100000001971"],
    description:
      "Oorsprong op het hart van de toren (BAG-cirkelfit op de dakrand, straal 5,29 m) op het maaiveld in het park van Paleis Soestdijk (NAP circa +5,8 m), -Y langs de as van de uitbouw naar zijn deur (RD 237 graden kompas, zuidwest), +X naar het zuidoosten. Bakstenen cilinder van 9,2 m op een natuurstenen plint, rondboogfries als uitkraging naar een twaalfzijdige bovenwand met witte dakrand tot 9,96 m (NAP +15,72), vensters en een deur als nissen; uitbouw van één laag met een driezijdige beëindiging, kroonlijst, schilddak van leien met knik en dakkapel tot 6,64 m. Maten uit BAG, AHN, 3D BAG, het register en foto's.",
    realWorld: {
      built: 1680,
      architect: "Willem Meesters",
      wikipediaHeightM: 10,
      registerHeightM: 9,
      registerDiameterM: 8.2,
      reservoirM3: 60,
      rijksmonument: 531294,
      groundNapM: NAP0,
      ahnRoofNapM: 15.72,
      ahnAnnexRidgeNapM: 12.4,
      drumDiameterM: 2 * R,
      roofEdgeAcrossFlatsM: +(2 * R_ROOF * Math.cos(PHASE)).toFixed(2),
      annexWidthM: 2 * SIDE,
      topM: +H.top.toFixed(2),
      annexRidgeM: +A.ridge.toFixed(2),
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Soestdijk) (1678-1683, Willem Meesters, 10 m, 60 m³, oorspronkelijk met windmolen op het platte dak)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/531294 (cilindrische toren van 8,20 m doorsnede en circa 9 m hoog op natuurstenen plint, twaalfzijdige uitkraging op een natuurstenen rondboogfries, plat dak, hele en halve kruisvensters met natuurstenen omlijstingen, uitbouw van één laag met driezijdige beëindiging en leien schilddak aan de zuidwestzijde, hoofdingang in de uitbouw)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Soestdijk_-_20423187_-_RCE.jpg (vanuit het zuidzuidoosten: zuidoostgevel van de uitbouw met venster, drie vensters op de verdieping en één op de begane grond)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_achtergevel_en_zijgevel_van_de_watertoren_-_Soestdijk_-_20423404_-_RCE.jpg (vanuit het oosten: vensters en de deur met bovenlicht, fries, bovenwand en dakrand)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_voorgevel_van_de_watertoren_-_Soestdijk_-_20423403_-_RCE.jpg (frontaal op de uitbouw: deur, kroonlijst, schilddak met dakkapel)",
      "https://commons.wikimedia.org/wiki/File:Soestdijk_Watertoren_0537.JPG (vanuit het zuiden)",
      "PDOK BAG-pand 0308100000001971 (bouwjaar 1680), AHN DSM/DTM 0,5 m, luchtfoto en PDOK-terrein, 2026-11-06",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0308100000001971: dak- en nokhoogte, opgehaald 2026-11-06",
    ],
  },
});

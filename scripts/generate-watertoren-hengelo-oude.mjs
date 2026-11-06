// Oude watertoren van Hengelo aan de Watertorenlaan 60, bij het Fanny Blankers-Koen Stadion. Gebouwd in 1896-1897 naar
// ontwerp van ir. J. Schotel voor Stork en de waterleiding, neorenaissance; rijksmonument 511440 (complex 511439 met
// kolenschuur, elektrisch gemaal, trafohuisje en dienstwoning). Volgens Wikipedia en het register 29,2 m hoog met een ijzeren
// hangbodemreservoir van 300 m³; het reservoir is na oorlogsschade in 1959 vernieuwd (betonnen consoles, lisenen en
// kanteelblokken op de vlakke bovenkant). Een ronde bakstenen toren op een natuurstenen voet met een vooruitspringende
// geprofileerde plint; een onderbouw met banden en rondboogvensters, een brede geprofileerde waterlijst, een ronde taps
// toelopende schacht met rondboogvensters langs de trap; betonnen consoles onder een betonnen band waarop het uitkragende
// reservoir staat, met lisenen en kijkspleten en een kanteelrand. Aan de voet een ingangsportaal met tuitgevel en enkele
// aanbouwen met zadeldaken (machinekamer met gekoppelde vensters onder segmentbogen, kantoortje met drie rondboogvensters).
//
// Oorsprong op het hart van de cirkel in BAG-pand 0164100000008027 (straal 5,29 m, de voet met de plint; het pand omvat ook
// het portaal en de twee aanbouwen), op maaiveld NAP +20,65 (AHN-DTM rond de toren 20,6 tot 20,7; 3D BAG 20,37).
// +X wijst naar RD-richting 57,6 graden (kompas 32,4 graden, noordnoordoost), langs de nok van de noordoostelijke aanbouw;
// +Y naar kompas 302,4 graden (noordwest): daar staat het ingangsportaal. De machinekamer ligt langs -X. De hoek komt uit de
// rechthoekige zijden van het BAG-pand (machinekamer 9,3 × 6,0 m, aanbouw 7,0 × 3,5 m, portaal 3,15 m), evenwijdig aan de
// nokken in het AHN-DSM.
// Hoogtes: dak binnen de borstwering NAP +48,70 (AHN-DSM en 3D BAG 48,69 = 28,05 m), nok machinekamer NAP +26,8 (DSM 6,15 m;
// 3D BAG 26,98), nok kantoortje 6,2 m (DSM). Geledingen eronder uit de foto "Hengelo Watertoren 8749.JPG" (Commons, 2007,
// Olympus C-8080 op 8,9 mm): perspectief opgelost met de brandpuntsafstand (2309 px), het maaiveld aan de voet en de
// kanteelrand op 29,3 m (camera op 38 m, 18 graden omhoog), breedtes uit de verhouding tot de BAG-cirkel en het DSM
// (reservoir 11,0 m, band 11,7 m, schacht 9,4 tot 9,0 m, onderbouw 10,2 m).
import { Manifold, CrossSection, ccw, hull, union, box, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [251812.41, 475165.92];
const AXIS_DEG = 57.6;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 20.65;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints op 6,5 m van het hart in de vier vrije hoeken tussen
// portaal en aanbouwen (64,04, 64,04, 64,10 en 64,11), gemeten 2026-11-06. Het terrein rond de toren ligt tussen 63,98 en
// 64,25.
const GROUND_ELLIPSOID = 64.04;

// Omwenteling van een gesloten profiel [[r, z], ...].
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
const coneR = (ra, za, rb, zb) => (z) => ra + ((rb - ra) * (z - za)) / (zb - za);
// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder 56 graden
// op, buiten de gevel loopt de snede schuin af (niet onder z0). Met gable een spitse top van 50 graden.
const niche = (f, w, z0, z1, depth = 0.3, y = 0, gable = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  const pts = [[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]];
  if (gable > 0) pts.push([f, 0, z1 + gable], [a, 0, za + gable]);
  return hull(pts).translate([0, y, 0]);
};
// Rondboognis (halfrond als veelhoek van 7 punten), plafond naar binnen onder 63 graden.
const archNiche = (f, w, z0, zSpring, depth = 0.3, y = 0) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([s, z]) => [a, s, z + 2 * depth]),
    ...arc.map(([s, z]) => [f, s, z]),
    ...arc.map(([s, z]) => [f + 1, s, Math.max(z0, z - 1.5)]),
    [a, -r, z0], [a, r, z0], [f + 1, -r, z0], [f + 1, r, z0],
  ]).translate([0, y, 0]);
};
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
// Radiaal blok van r0 tot r1, breedte w langs de omtrek, van z0 tot z1, onder hoek deg.
const radial = (deg, r0, r1, w, z0, z1) => place(box(r0, -w / 2, z0, r1, w / 2, z1), { deg });

// ---------- hoogtes boven het maaiveld (NAP +20,65) en stralen ----------
const H = {
  plinth: [0.5, 0.75], // natuurstenen plint, geprofileerd terug naar de onderbouw
  waterTable: [6.72, 6.9, 7.1, 7.55], // onderkant (50 graden), voorkant, schuin terug naar de schacht (foto 6,8 tot 7,3)
  shaftTop: 18.65,
  footBand: [18.0, 18.18, 18.4], // band onder de consoles
  ring: [19.85, 20.27, 20.55], // betonnen band: onderkant 50 graden van de bodem tot de voorkant, bovenkant (foto 20,5)
  pilasters: 22.75, // lisenen boven de band (foto 22,7)
  midSlits: [21.65, 22.45],
  topSlits: [27.0, 27.75],
  roof: 28.05, // NAP +48,70 (AHN-DSM, 3D BAG 48,69)
  parapet: 28.85, // bovenkant van de borstwering (foto 28,9)
  merlons: 29.3, // kanteelblokken (foto; register en Wikipedia 29,2)
};
const R = {
  plinth: 5.3, // BAG-cirkel 5,29
  base: 5.1, // onderbouw (foto 10,2 m)
  waterTable: 5.25,
  shaftFoot: 4.7, // schacht 9,4 m op 7,5 m tot 9,0 m op 18,65 m (foto)
  shaftTop: 4.5,
  footBand: 4.65,
  bottom: 5.5, // bodem van het reservoir
  ring: 5.85, // betonnen band, 11,7 m (foto; AHN-DSM-omhullende circa 11 tot 11,2 m)
  reservoir: 5.5, // 11,0 m (foto 11,0 tot 11,3; DSM boven 30 m 11,2)
  parapetInner: 4.6, // dak binnen de borstwering (DSM: vlak tot 4,5 m van het hart)
};
const shaftR = coneR(R.shaftFoot, H.waterTable[3], R.shaftTop, H.shaftTop);
const CONSOLES = every(28, 360 / 56); // consoles en lisenen (foto: 12,9 graden steek)
const GAPS = every(14, 0); // kijkspleten in elk tweede veld tussen de lisenen
const MERLONS = every(18, 10); // kanteelblokken van 0,9 m met 1,0 m ertussen (in het echt circa 28 van 0,45 m)

// ---------- voet, onderbouw, waterlijst en schacht ----------
const plinth = rev([[0, BASE], [R.plinth, BASE], [R.plinth, H.plinth[0]], [R.base, H.plinth[1]], [0, H.plinth[1]]]);
const baseWall = solidRev([[R.base, H.plinth[1] - 0.05], [R.base, H.waterTable[0] + 0.01]]);
const waterTable = rev([
  [0, H.waterTable[0]], [R.base, H.waterTable[0]], [R.waterTable, H.waterTable[1]], [R.waterTable, H.waterTable[2]],
  [R.shaftFoot, H.waterTable[3]], [0, H.waterTable[3]],
]);
const shaft = solidRev([[R.shaftFoot, H.waterTable[3] - 0.05], [R.shaftTop, H.shaftTop + 0.01]]);

// ---------- consoles, betonnen band en reservoir ----------
// Band aan de voet van de consoles: onderkant 50 graden.
const footBand = rev([
  [0, H.footBand[0]], [shaftR(H.footBand[0]), H.footBand[0]], [R.footBand, H.footBand[1]], [R.footBand, H.footBand[2]],
  [R.shaftTop, H.footBand[2] + 0.05], [0, H.footBand[2] + 0.05],
]);
// Bodem tussen de consoles: kegel van 50 graden van de schacht tot de onderkant van de band; de band zelf met een onderkant van
// 50 graden tot de voorkant van 11,7 m.
const bottom = rev([
  [0, H.shaftTop], [R.shaftTop, H.shaftTop], [R.bottom, H.ring[0]], [R.ring, H.ring[1]], [R.ring, H.ring[2]], [0, H.ring[2]],
]);
// 28 betonnen consoles van 0,4 m breed: voorkant onder 50 graden van de voetband (4,65 m op 18,4 m) tot de band (5,85 m).
const console0 = hull([-0.2, 0.2].flatMap((s) => [
  [4.3, s, H.footBand[2]], [R.footBand, s, H.footBand[2]], [R.ring, s, H.footBand[2] + 1.2 * (R.ring - R.footBand)],
  [R.ring, s, H.ring[1] + 0.05], [4.3, s, H.ring[1] + 0.05],
]));
const consoles = CONSOLES.map((deg) => place(console0, { deg }));
const reservoir = solidRev([[R.reservoir, H.ring[2] - 0.05], [R.reservoir, H.parapet]])
  .subtract(solidRev([[R.parapetInner, H.roof], [R.parapetInner, H.parapet + 1]]));
// Lisenen boven de band, 0,45 m breed en 0,2 m voor het reservoir, met een schuine kop.
const pilaster0 = hull([-0.225, 0.225].flatMap((s) => [
  [5.3, s, H.ring[2] - 0.05], [R.reservoir + 0.2, s, H.ring[2] - 0.05], [R.reservoir + 0.2, s, H.pilasters], [5.3, s, H.pilasters + 0.3],
]));
const pilasters = CONSOLES.map((deg) => place(pilaster0, { deg }));
// Kanteelblokken van 0,9 × 0,9 m op de borstwering.
const merlons = MERLONS.map((deg) => radial(deg, R.parapetInner, R.reservoir, 0.9, H.parapet - 0.01, H.merlons));

// ---------- ingangsportaal (+Y) ----------
// 3,4 m breed (BAG 3,15 m op de muur), voorgevel op 6,4 m van het hart; zadeldak van 45 graden van de goot (4,3 m) tot de nok
// (6,0 m) en een tuitgevel tot 6,3 m die 0,3 m boven het dak uitsteekt; deur onder een rondboog tot 3,77 m.
const P = { half: 1.7, back: 3.8, front: 6.4, eave: 4.3, ridge: 6.0, shoulder: 4.55, apex: 6.3 };
const porchBody = box(-P.half, P.back, BASE, P.half, P.front, P.eave + 0.01);
const porchRoof = hull([
  [-P.half, P.back, P.eave], [P.half, P.back, P.eave], [-P.half, P.front - 0.4, P.eave], [P.half, P.front - 0.4, P.eave],
  [0, P.back, P.ridge], [0, P.front - 0.4, P.ridge],
]);
const porchGable = hull([P.front - 0.4, P.front].flatMap((y) => [
  [-P.half, y, P.eave - 0.01], [P.half, y, P.eave - 0.01], [-P.half, y, P.shoulder], [P.half, y, P.shoulder], [0, y, P.apex],
]));
const porch = union([porchBody, porchRoof, porchGable]);
const porchOpenings = [place(archNiche(P.front, 1.2, 0, 3.17, 0.3), { deg: 90 })];

// ---------- machinekamer (-X) ----------
// BAG: 9,3 × 6,0 m tot x = -13,28, y van -3,24 tot 2,76; zadeldak met de nok langs X op y = -0,24 (DSM 6,15 m, goten 3,65 m,
// 40 graden). Kopgevel met een borstwering van 0,3 m boven het dak, hoeklisenen tot 4,3 m, gekoppelde vensters onder
// segmentbogen (foto: twee paar aan de noordwestkant, de zuidoostkant gespiegeld) en een roosvenster in de kopgevel.
const M = { x0: -13.28, x1: -3.5, y0: -3.24, y1: 2.76, eave: 3.65, ridge: 6.15 };
const mMid = (M.y0 + M.y1) / 2;
const machineBody = box(M.x0, M.y0, BASE, M.x1, M.y1, M.eave + 0.01);
const machineRoof = hull([
  [M.x0, M.y0, M.eave], [M.x1, M.y0, M.eave], [M.x0, M.y1, M.eave], [M.x1, M.y1, M.eave],
  [M.x0, mMid, M.ridge], [M.x1, mMid, M.ridge],
]);
const machineGable = hull([M.x0, M.x0 + 0.4].flatMap((x) => [
  [x, M.y0, M.eave - 0.01], [x, M.y1, M.eave - 0.01], [x, M.y0, M.eave + 0.3], [x, M.y1, M.eave + 0.3], [x, mMid, M.ridge + 0.3],
]));
const cornerPilasters = [M.y0, M.y1].map((y) => {
  const s = Math.sign(y - mMid);
  return hull([
    ...[[M.x0 - 0.15, y - s * 0.45], [M.x0 + 0.6, y - s * 0.45], [M.x0 - 0.15, y + s * 0.15], [M.x0 + 0.6, y + s * 0.15]].flatMap(([x, yy]) => [[x, yy, BASE], [x, yy, 4.1]]),
    [M.x0 + 0.225, y - s * 0.15, 4.4],
  ]);
});
const machine = union([machineBody, machineRoof, machineGable, ...cornerPilasters]);
// Gekoppeld venster: twee rondboognissen van 0,65 m met een middenstijl, in de zijgevel op y (+Y of -Y naar buiten).
const twin = (x, y) => [-0.5, 0.5].map((dx) =>
  archNiche(0, 0.65, 1.65, 3.0, 0.2).rotate([0, 0, y > 0 ? 90 : -90]).translate([x + dx, y, 0]));
const machineOpenings = [
  ...[-6.9, -11.0].flatMap((x) => [...twin(x, M.y1), ...twin(x, M.y0)]),
  // Roosvenster in de kopgevel, als nis met een spitse top.
  place(niche(-M.x0, 1.0, 4.05, 4.85, 0.25, -mMid, 0.45), { deg: 180 }),
  // Venster onder het roosvenster.
  place(archNiche(-M.x0, 0.8, 1.6, 3.0, 0.2, -mMid), { deg: 180 }),
];

// ---------- kantoortje (+X) ----------
// BAG: 7,0 × 3,5 m van de toren tot x = 7,09, y van -3,58 tot 3,46; zadeldak met de nok langs X (DSM 6,2 m, goten 4,1 m,
// 31 graden); in de kopgevel drie rondboogvensters (register).
const K = { x0: 3.0, x1: 7.09, y0: -3.58, y1: 3.46, eave: 4.1, ridge: 6.2 };
const kMid = (K.y0 + K.y1) / 2;
const officeBody = box(K.x0, K.y0, BASE, K.x1, K.y1, K.eave + 0.01);
const officeRoof = hull([
  [K.x0, K.y0, K.eave], [K.x1, K.y0, K.eave], [K.x0, K.y1, K.eave], [K.x1, K.y1, K.eave],
  [K.x0, kMid, K.ridge], [K.x1, kMid, K.ridge],
]);
const office = union([officeBody, officeRoof]);
const officeOpenings = [-1.7, 0, 1.7].map((y) => archNiche(K.x1, 0.75, 1.3, 2.9, 0.25, kMid + y));

// ---------- natuurstenen blok aan de voet (onder het venster op 131 graden) ----------
const stoneBlock = radial(131, 4.8, 5.8, 3.0, BASE, 1.0);

// ---------- openingen in de toren ----------
const towerOpenings = [
  // Onderbouw: rondboogvensters met natuurstenen tracering (enkel op 56 en 131 graden, gekoppeld op 245 en 295 graden).
  ...[56, 131].map((deg) => place(archNiche(R.base, 0.65, 1.65, 4.2, 0.3), { deg })),
  ...[245, 295].flatMap((deg) => [-0.45, 0.45].map((y) => place(archNiche(R.base, 0.6, 1.65, 4.2, 0.3, y), { deg }))),
  // Schacht: rondboogvensters langs de trap, twee rijen (foto's van het westen en het noordoosten).
  ...[355, 63, 131, 220, 290].map((deg) => place(archNiche(shaftR(11.8), 0.75, 10.85, 12.33, 0.3), { deg })),
  ...[24, 96, 166, 240, 315].map((deg) => place(archNiche(shaftR(15.9), 0.75, 14.9, 16.43, 0.3), { deg })),
  // Reservoir: kijkspleten tussen de lisenen en onder de borstwering (0,3 m breed).
  ...GAPS.map((deg) => place(niche(R.reservoir, 0.3, ...H.midSlits, 0.25), { deg })),
  ...GAPS.map((deg) => place(niche(R.reservoir, 0.3, ...H.topSlits, 0.25), { deg })),
];

const tower = union([plinth, baseWall, waterTable, shaft, footBand, bottom, ...consoles, reservoir, ...pilasters, ...merlons, stoneBlock])
  .subtract(union(towerOpenings));
const annexes = union([
  porch.subtract(union(porchOpenings)),
  machine.subtract(union(machineOpenings)),
  office.subtract(union(officeOpenings)),
]);
const all = union([annexes, tower]).trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-hengelo-oude",
  base: BASE,
  nodes: [["building:watertoren-voet-schacht-reservoir-portaal-en-aanbouwen", all]],
  catalog: {
    name: "Oude watertoren Hengelo",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[4.6, 4.6], [-4.6, 4.6], [-4.6, -4.6], [4.6, -4.6]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0164100000008027"],
    description:
      "Oorsprong op het hart van de cirkel in BAG-pand 0164100000008027 (straal 5,29 m) op maaiveld NAP +20,65 m; +X wijst naar kompas 32,4 graden langs de nok van het kantoortje, +Y naar kompas 302,4 graden naar het ingangsportaal, de machinekamer ligt langs -X. Natuurstenen plint, onderbouw van 10,2 m met rondboogvensters, waterlijst op 6,7 tot 7,55 m, taps toelopende schacht van 9,4 tot 9,0 m met tien rondboogvensters, voetband en 28 betonnen consoles onder een bodem van 50 graden, betonnen band van 11,7 m op 20,3 tot 20,55 m, reservoir van 11,0 m met 28 lisenen en twee rijen kijkspleten, dak op 28,05 m (NAP +48,70), borstwering tot 28,85 m met 18 kanteelblokken tot 29,3 m; ingangsportaal met tuitgevel tot 6,3 m, machinekamer met zadeldak tot 6,15 m, kopgevel en hoeklisenen, kantoortje met zadeldak tot 6,2 m en drie rondboogvensters. Maten uit BAG, AHN, 3D BAG en een foto met opgelost perspectief.",
    realWorld: {
      built: "1896-1897",
      architect: "J. Schotel",
      reservoirM3: 300,
      reservoirRenewed: 1959,
      registerHeightM: 29.2,
      rijksmonument: 511440,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 48.7,
      bagFootprintRadiusM: 5.29,
      baseDiameterM: R.base * 2,
      shaftDiameterM: [R.shaftFoot * 2, R.shaftTop * 2],
      ringDiameterM: R.ring * 2,
      reservoirDiameterM: R.reservoir * 2,
      roofM: H.roof,
      parapetM: H.parapet,
      merlonsM: H.merlons,
      machineRoomRidgeM: M.ridge,
      officeRidgeM: K.ridge,
      entranceBearingDeg: 302.4,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Oude_watertoren_(Hengelo) (1896-1897, J. Schotel, 29,2 m, 300 m³, rijksmonument 511440)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/511440 (natuurstenen voet met plint, onderbouw met banden en waterlijst, rondboogvensters, schacht met betonnen consoles en lisenen, ingang met tuitgevel, aanbouwen met zadeldaken, machinekamer met segmentboogvensters en roosvenster, kantoortje met drie rondboogvensters, vlakke bovenkant met betonnen modillons)",
      "https://commons.wikimedia.org/wiki/File:Hengelo_Watertoren_8749.JPG (2007, vanaf het westen: geledingen, breedtes, portaal, machinekamer; perspectief opgelost met f = 2309 px)",
      "https://commons.wikimedia.org/wiki/File:Hengelo-Watertorenlaan-Gemaal.JPG (vanaf het oosten: vensters in de schacht, kopgevel van het kantoortje)",
      "PDOK BAG-pand 0164100000008027 (toren met portaal en aanbouwen) en 0164100000007902 (losse aanbouw, blijft PDOK), AHN DSM/DTM 0,5 m, luchtfoto en PDOK-terrein, 2026-11-06",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0164100000008027: dak NAP +48,69, nok aanbouw 26,98, maaiveld 20,37, opgehaald 2026-11-06",
    ],
  },
});

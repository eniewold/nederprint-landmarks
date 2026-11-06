// Watertoren van Steenwijkerwold (ook: watertoren van Tuk) aan de Oldemarktseweg 51A, gebouwd in 1931 als eerste
// bouwwerk van de N.V. Waterleidingmaatschappij "Noord Overijssel" naar een ontwerp van ingenieurs van de NV v/h Butzers
// Beton en Waterbouw; verwant aan de torens van Sint Jansklooster en Raalte. Rijksmonument 508646: 35,20 m hoog, een
// rechte bakstenen schacht met art-decomotieven en een betonnen vlakbodemreservoir van 208 m³. Het register beschrijft
// "een gebroken, met geglazuurde pannen gedekt tentdak op rechtstandige onderste dakschilden met een in de hoeken
// verspringende onderrand", afgeschuinde hoeken die in tweeën zijn gedeeld met een over de hele schacht doorlopende
// uitgemetselde vertanding, een dubbele deur onder een latei in de voorgevel, drie stalen vensters op de begane grond in
// de overige gevels, smalle staande vensters aan alle vier de zijden en een reeks van vijf vensters onder de dakrand.
//
// Oorsprong op het hart van BAG-pand 1708100000024661 (vierkant van 8,68 m met afgeschuinde hoeken; de top van het
// dak ligt in het AHN-DSM 0,1 m ernaast) op maaiveld NAP +17,0 (AHN-DTM rondom 16,9 à 17,0). +X wijst naar RD-richting
// -15,93 graden (oost-zuidoost, de richting van de lange BAG-zijden), +Y naar 74,07 graden (noord-noordoost): naar de
// Oldemarktseweg, de voorgevel met de deur. Plattegrond uit de BAG: zijden op 4,34 m, schuine hoeken van (4,34; 2,81)
// via een knik op (3,72; 3,72) naar (2,81; 4,34). Dak uit het AHN-DSM 0,5 m: top NAP +52,14 (35,14 m; register 35,20),
// tentdak met vlakken van 40,7 tot 42,4 graden boven de zijden en 35 tot 39 graden boven de hoeken (vlakfit per sector),
// knik naar de rechtstandige onderste dakschilden op NAP +48,8 à 49,0. Geledingen uit de foto's op Commons (zie sources):
// "20140416 Zicht op watertoren van Tuk2.jpg" (telelens vanuit het zuidwesten, 44,5 px/m in de uitsnede, op de top van
// het AHN gezet) en de RCE-foto's 20350297 (zuidwesten) en 20350476 (noordoosten).
import { CrossSection, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [201853.14, 534860.69];
const DEG = -15.93;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 17.0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06 met de terreintegels van de
// export (oost 59,13, west 59,09, noord 59,13, zuid 59,08).
const GROUND_ELLIPSOID = 59.08;

// ---------- plattegrond (BAG) ----------
const S = 4.34; // halve breedte tussen de zijden
const K = 2.81; // eind van de zijde, begin van de schuine hoek
const M = 3.72; // knik in het midden van de schuine hoek (in tweeën gedeeld)
// Achthoek met tweedelige schuine hoeken, tegen de klok in vanaf de oostzijde.
const plan = [0, 1, 2, 3].flatMap((k) => {
  const r = ([x, y]) => [[x, y], [-y, x], [-x, -y], [y, -x]][k];
  return [r([S, -K]), r([S, K]), r([M, M])];
});
const planAt = (offset) => (offset === 0 ? new CrossSection([plan]) : new CrossSection([plan]).offset(offset, "Miter", 4));
const ring = (cs, z) => cs.toPolygons()[0].map(([x, y]) => [x, y, z]);

// ---------- hoogtes boven maaiveld (NAP +17,0) ----------
const H = {
  wall: 29.7, // bovenkant van het metselwerk op de zijden
  ledge: [29.55, 30.0], // goot- en dakrand onder de rechtstandige dakschilden (onderkant schuin 45 graden)
  skirt: 28.9, // onderrand van de rechtstandige schilden boven de schuine hoeken (verspringt 0,8 m omlaag)
  knick: 31.85, // knik van de rechtstandige schilden naar het tentdak (AHN NAP +48,8 à 49,0)
  apex: 35.14, // top van het tentdak (AHN NAP +52,14)
  lisene: [22.4, 28.9], // lisenen op de schuine hoeken, met een schuine onderkant
};
const KNICK_IN = 0.24; // de rechtstandige schilden lopen 0,24 m in (circa 83 graden)

// ---------- nissen ----------
// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder 56
// graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const y0 = y - w / 2, y1 = y + w / 2, za = z1 + 1.5 * depth, out = Math.min(1, (z1 - z0) / 1.5);
  return hull([
    [f - depth, y0, z0], [f + out, y0, z0], [f - depth, y1, z0], [f + out, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + out, y0, z1 - 1.5 * out], [f + out, y1, z1 - 1.5 * out],
  ]);
};

// ---------- schacht, gootrand, dakschilden en tentdak ----------
const shaft = planAt(0).extrude(H.wall - BASE).translate([0, 0, BASE]);
const ledge = hull([...ring(planAt(0), H.ledge[0] - 0.01), ...ring(planAt(0.15), H.ledge[0] + 0.15), ...ring(planAt(0.15), H.ledge[1])]);
const knickRing = ring(planAt(-KNICK_IN), H.knick);
const attic = hull([...ring(planAt(0), H.ledge[1] - 0.01), ...knickRing]);
const tent = hull([...knickRing, [0, 0, H.apex]]);

// ---------- schuine hoek (gebouwd voor de hoek tussen +X en +Y, daarna rondgedraaid) ----------
const N = [Math.SQRT1_2, Math.SQRT1_2]; // normaal van de schuine hoek
const P0 = [S, K], PM = [M, M], P1 = [K, S];
const add = ([x, y], s, [dx, dy] = N) => [x + s * dx, y + s * dy];
const at = ([x, y], z) => [x, y, z];
// Rechtstandig schild boven de hoek: 0,25 m voor de gevel, onderrand op 28,9 (onderkant 50 graden naar de gevel), tot
// de knik van het tentdak.
const kneeCorner = ring(planAt(-KNICK_IN), H.knick).filter(([x, y]) => x > 2.4 && y > 2.4);
const skirt = hull([
  ...[P0, PM, P1].flatMap((p) => [at(p, H.skirt - 0.3), at(add(p, 0.25), H.skirt), at(add(p, 0.25), H.ledge[1]), at(add(p, -0.6), H.skirt - 0.3), at(add(p, -0.6), H.knick)]),
  ...kneeCorner,
]);
// Twee lisenen per hoek, 0,55 m breed op de buitenste einden van de twee helften, 0,25 m vooruit, van 22,4 tot onder het
// schild; de onderkant loopt onder 54 graden naar de gevel.
const lisene = (p, q) => {
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const t = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
  const a = p, b = add(p, 0.55, t);
  const [z0, z1] = H.lisene;
  return hull([
    ...[a, b].flatMap((c) => [at(add(c, 0.25), z0 + 0.35), at(add(c, 0.25), z1 + 0.1), at(add(c, -0.3), z0 - 0.42), at(add(c, -0.3), z1 + 0.1)]),
  ]);
};
// Uitgemetselde vertanding op de knik van de hoek, over de hele schacht: 0,3 m breed, 0,12 m vooruit.
const T = [-Math.SQRT1_2, Math.SQRT1_2];
const tooth = hull([
  ...[-0.15, 0.15].flatMap((s) => {
    const c = add(PM, s, T);
    return [at(add(c, 0.12), BASE), at(add(c, 0.12), H.skirt), at(add(c, -0.3), BASE), at(add(c, -0.3), H.skirt)];
  }),
]);
const corner = union([skirt, lisene(P0, PM), lisene(P1, PM), tooth]);

// ---------- gevels (gebouwd met de gevel naar +X op x = S, langs de gevel y) ----------
// Vijf vensters onder de dakrand, staande vensters om de 4,7 m, drie smalle vensters bovenaan de schacht; op de begane
// grond de deur (voorgevel, +Y) of drie stalen vensters (de overige gevels).
const facadeCut = ({ door }) =>
  union([
    ...[-1.3, -0.65, 0, 0.65, 1.3].map((y) => niche(S, 0.4, 28.7, 29.3, 0.3, y)),
    ...[-0.55, 0, 0.55].map((y) => niche(S, 0.3, 23.35, 24.25, 0.3, y)),
    ...[[20.6, 22.4], [16.4, 18.1], [11.7, 13.4], [6.9, 8.6]].map(([z0, z1]) => niche(S, 0.4, z0, z1, 0.3)),
    ...(door ? [niche(S, 1.8, 0, 2.6, 0.35)] : [-0.75, 0, 0.75].map((y) => niche(S, 0.5, 1.5, 2.6, 0.3, y))),
  ]);
// Dakkapel (luik) in de westgevel (-X), op de rechtstandige schilden: 1,0 m breed, zadeldakje van 45 graden tot 32,0 m,
// raam van 0,5 × 0,7 m als nis.
const dormer = union([
  box(3.4, -0.5, H.ledge[1] - 0.1, S + 0.06, 0.5, 31.5),
  hull([[3.4, -0.5, 31.49], [S + 0.06, -0.5, 31.49], [3.4, 0.5, 31.49], [S + 0.06, 0.5, 31.49], [3.4, 0, 32.0], [S + 0.06, 0, 32.0]]),
]).subtract(niche(S + 0.06, 0.5, 30.35, 31.05, 0.25));

const FACES = [[0, false], [90, true], [180, false], [270, false]]; // oost, noord (voorgevel), west, zuid
const tower = union([
  shaft, ledge, attic, tent,
  ...[0, 90, 180, 270].map((deg) => place(corner, { deg })),
  place(dormer, { deg: 180 }),
]).subtract(union(FACES.map(([deg, door]) => place(facadeCut({ door }), { deg }))));

await writeLandmark({
  slug: "watertoren-steenwijkerwold",
  base: BASE,
  nodes: [["building:schacht-met-schuine-hoeken-lisenen-vensters-deur-en-gebroken-tentdak", tower]],
  catalog: {
    name: "Watertoren Steenwijkerwold",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1708100000024661"],
    description:
      "Oorsprong op het hart van het BAG-pand op maaiveld (NAP +17,0 m), +X naar RD-richting -15,93 graden (oost-zuidoost), +Y naar 74,07 graden (noord-noordoost): de voorgevel met de deur, naar de Oldemarktseweg. Rechte bakstenen schacht van 8,68 m met tweedelige schuine hoeken, vertanding en lisenen op de hoeken, vijf vensters onder de dakrand, staande vensters, drie vensters op de begane grond en de deur; gootrand op 30,0 m, rechtstandige onderste dakschilden met een verspringende onderrand op de hoeken, knik op 31,85 m en tentdak tot 35,14 m, dakkapel aan de westzijde. Maten uit BAG, AHN, register en foto's.",
    realWorld: {
      built: 1931,
      registerHeightM: 35.2,
      reservoirM3: 208,
      monument: 508646,
      ahnGroundNapM: GROUND_NAP,
      ahnKnickNapM: 48.85,
      ahnTopNapM: 52.14,
      widthM: S * 2,
      wallTopM: H.wall,
      ledgeM: H.ledge[1],
      skirtM: H.skirt,
      knickM: H.knick,
      topM: H.apex,
      minimumPartM: 0.55,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/508646 (1931, 35,20 m, gebroken tentdak op rechtstandige onderste dakschilden met verspringende onderrand, tweedelige afgeschuinde hoeken met vertanding, dubbele deur in de voorgevel, drie stalen vensters, staande vensters, vijf vensters onder de dakrand, 208 m³)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Steenwijkerwold) (1931, 35,2 m, 208 m³, Butzers)",
      "https://commons.wikimedia.org/wiki/File:20140416_Zicht_op_watertoren_van_Tuk2.jpg (telelens vanuit het zuidwesten: dakschilden, knik, dakrand, vensters, lisenen)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Tuk_-_20350297_-_RCE.jpg (vanuit het zuidwesten: geledingen, vensters, dakkapel)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Tuk_-_20350476_-_RCE.jpg (vanuit het noordoosten: vensters op de begane grond)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Steenwijkerwold_07.JPG (2007, vanuit het zuidwesten)",
      "PDOK BAG-pand 1708100000024661, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

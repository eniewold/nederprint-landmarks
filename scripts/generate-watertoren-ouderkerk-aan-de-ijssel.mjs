// Watertoren van Ouderkerk aan den IJssel, op het bedrijventerrein aan de dijk (Kerkweg). Gebouwd in 1916 door Visser &
// Smit (later Visser & Smit Hanab), 32,5 m hoog volgens Wikipedia, één reservoir van 400 m³, sinds 1980 buiten gebruik;
// gedenkplaat boven de ingang. Lijkt op de watertoren van Nieuw-Lekkerland. Zeskante schacht van beton met velden van gele
// IJsselsteentjes: betonnen hoekpilasters en banden omlijsten verdiepte baksteenvelden, een betonnen plint die naar de voet
// iets uitloopt, smalle vensters per veld. Bovenaan een bolle overgang naar het ronde betonnen reservoir, met zes lisenen op
// de hoeken die boven de borstwering uitsteken en een rij kleine gaten onder de bovenrand. Tegen de zuidoostgevel hangt het
// rechthoekige trappenhuis, dat vanaf een uitkraging boven de schacht tot boven het dak doorloopt met een plat overstekend
// dak en kleine vensters.
//
// Oorsprong op het hart van de zeskant: kleinste-kwadratenfit op de zes gevellijnen van BAG-pand 0644100002062228 (apothema
// 4,67 m, spreiding 5 cm), op het laagste maaiveld rond de voet (AHN-DTM NAP +3,3 à +3,4 aan de noord- en westkant; de
// zuidoostkant loopt op naar +4,2 bij het pad en de weg). +X wijst loodrecht uit de zuidoostgevel met de deur en het
// trappenhuis (RD -60,7 graden: gevelnormalen uit de BAG op 0,9, 58,6, 118,9, 179,3, -120,4 en -61,7 graden, gemiddeld
// 0,7 graden gedraaid).
// Maten: het reservoirdak (AHN-DSM 0,5 m NAP +33,2, vlak) en het trappenhuisdak (NAP +36,0) uit het AHN, de zeskant uit de
// BAG, de straal van het reservoir (5,7 m) en het trappenhuis (4,0 m breed, buitengevel 5,65 m uit het hart) uit DSM en
// luchtfoto, de banden, vensters, onderkant van het reservoir en van het trappenhuis uit de RCE-foto 20302525 (rechtstandig
// genomen, dus lineair per diepte: horizon op de weg, schaal uit de schachtbreedte) en de plint uit de foto van 2006 (dubbele
// verhouding met de banden).
import { Manifold, CrossSection, ccw, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [102188.15, 438248.13];
const AXIS_DEG = -60.7;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(4), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(4)];
const GROUND_NAP = 3.35;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (west 46,897, noordwest 46,929, zuidwest 46,966,
// noordoost 47,094), gemeten 2026-11-07; aan de deurkant (oost, +X) 47,77. Het PDOK-pand begint op 46,84.
const GROUND_ELLIPSOID = 46.9;

const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const every6 = (from = 0) => Array.from({ length: 6 }, (_, k) => from + 60 * k);
const rad = (d) => (d * Math.PI) / 180;

// ---------- hoogtes boven het maaiveld (NAP +3,35) ----------
const H = {
  plinth: 5.0, // betonnen plint, band tot 5,6
  panels: [[5.6, 12.25], [13.05, 18.3]], // verdiepte baksteenvelden tussen de banden (foto: banden op 12,65 en 18,75 m)
  lip: [20.45, 21.85], // bolle overgang van de schacht naar het reservoir, als kegel van 45 graden
  roof: 29.9, // reservoirdak en borstwering (AHN NAP +33,2 à +33,25)
  holes: [28.85, 29.3], // rij kleine gaten onder de bovenrand, als groef
  lisene: 30.8, // lisenen steken 0,9 m boven de borstwering uit (foto)
  stairFoot: 18.55, // onderkant van het trappenhuis aan de buitengevel
  stairRoof: [32.05, 32.65], // plat overstekend dak (AHN NAP +36,0)
  door: [0.85, 3.6], // deur op het pad (maaiveld aan die kant +0,85 à +0,9)
  plaque: [3.8, 5.0], // gedenkplaat met fronton boven de deur
};
// Apothema van de zeskant: BAG 4,67 aan de voet, verjongend tot 4,50 op de plint en 4,35 onder het reservoir (foto: de
// schacht is boven 3 % smaller dan onder de plint).
const apo = (z) => (z <= H.plinth ? 4.67 + ((4.5 - 4.67) * Math.max(z, 0)) / H.plinth : 4.5 + ((4.35 - 4.5) * (z - H.plinth)) / (20.45 - H.plinth));
const R = {
  reservoir: 5.7,
  pilasterOut: 0.3, // hoekpilaster steekt 0,3 m buiten de hoek uit (BAG: buitenkant 5,69 m uit het hart)
  pilasterHalf: 0.35, // 0,7 m breed (BAG)
  lisene: 6.0, // lisenen op het reservoir, 0,3 m uit de gevel
  lisenHalf: 0.45,
  frame: 0.75, // betonnen strook langs elke hoek op de gevel
  recess: 0.3,
};
const STAIR = { x: [2.2, 5.65], y: [-2.2, 1.8], cap: 0.2 };

// ---------- schacht ----------
// Zeskant met de gevelnormalen op 0, 60, ..., 300 graden: hoekpunten op 30 + 60k graden, straal apothema / cos 30.
const hexAt = (z) => Array.from({ length: 6 }, (_, k) => {
  const r = apo(z) / Math.cos(rad(30)), a = rad(30 + 60 * k);
  return [r * Math.cos(a), r * Math.sin(a), z];
});
const shaftLevels = [BASE, 0, H.plinth, 20.46];
const shaft = union(shaftLevels.slice(1).map((z, i) => hull([...hexAt(shaftLevels[i]), ...hexAt(z)])));

// Verdiept baksteenveld op de gevel met normaal +X: breedte = gevellengte min twee hoekstroken, diepte 0,3 m, het plafond
// loopt onder 56 graden naar binnen op (45 graden precies gaf in de export een randje opvulling).
const panel = (z0, z1) => {
  const pts = [];
  for (const z of [z0, z1]) {
    const a = apo(z), half = a * Math.tan(rad(30)) - R.frame;
    for (const y of [-half, half]) {
      pts.push([a - R.recess, y, z], [a + 1.5, y, z0]);
      if (z === z1) pts.push([a, y, z1 - 1.5 * R.recess], [a + 1.5, y, z1 - 1.5 * R.recess - 2.25]);
    }
  }
  return hull(pts.map(([x, y, z]) => [x, y, Math.max(z, z0)]));
};
// Nis met normaal +X in de gevel op afstand f, breedte w rond y, van z0 tot z1, plafond onder 56 graden.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) =>
  hull([
    [f - depth, -w / 2, z0], [f - depth, w / 2, z0], [f + 1.5, -w / 2, z0], [f + 1.5, w / 2, z0],
    [f - depth, -w / 2, z1], [f - depth, w / 2, z1], [f, -w / 2, z1 - 1.5 * depth], [f, w / 2, z1 - 1.5 * depth],
    [f + 1.5, -w / 2, z1 - 1.5 * depth - 2.25], [f + 1.5, w / 2, z1 - 1.5 * depth - 2.25],
  ].map(([x, yy, z]) => [x, yy + y, Math.max(z, z0)]));

const panels = union(every6().flatMap((deg) => H.panels.map(([z0, z1]) => place(panel(z0, z1), { deg }))));
// De smalle vensters (0,35 x 0,9 m op de foto, één per veld en kleine vierkante in het trappenhuis en onder het reservoir)
// zijn weggelaten: als nis van 0,5 tot 0,9 m in het verdiepte veld vulde de export de achterkant van elke nis op, en ze zijn
// kleiner dan 0,9 m. Het bovenste baksteenveld (19,2 tot 20,4 m) is om dezelfde reden vlak: direct onder de bolle overgang
// vulde de export het hele veld.
// Deur (dubbele deur, 1,9 m breed) in de zuidoostgevel, op het pad.
const door = niche(apo(1), 1.9, H.door[0], H.door[1], 0.4);
// Gedenkplaat met fronton boven de deur: 0,3 m voor de plint, onderkant onder 45 graden.
const pf = apo(H.plaque[0]);
const plaque = hull([
  [pf - 0.5, -0.55, H.plaque[0] - 0.5], [pf - 0.5, 0.55, H.plaque[0] - 0.5],
  [pf + 0.3, -0.55, H.plaque[0] + 0.3], [pf + 0.3, 0.55, H.plaque[0] + 0.3],
  [pf + 0.3, -0.55, H.plaque[1] - 0.35], [pf + 0.3, 0.55, H.plaque[1] - 0.35],
  [pf + 0.3, 0, H.plaque[1]], [pf - 0.5, 0, H.plaque[1]],
  [pf - 0.5, -0.55, H.plaque[1] - 0.35], [pf - 0.5, 0.55, H.plaque[1] - 0.35],
]);

// Hoekpilasters: 0,7 m brede blokken op de zes hoeken, 0,3 m buiten de hoek, die de verjonging volgen en boven de bolle
// overgang onder 45 graden uitlopen in de lisenen van het reservoir.
const cornerR = (z) => apo(z) / Math.cos(rad(30));
const pil = (z, out, half) => [[out, -half, z], [out, half, z], [out - 1.2, -half, z], [out - 1.2, half, z]];
const pilasterLow = union([
  hull([...pil(BASE, cornerR(0) + R.pilasterOut, R.pilasterHalf), ...pil(H.plinth, cornerR(H.plinth) + R.pilasterOut, R.pilasterHalf)]),
  hull([...pil(H.plinth, cornerR(H.plinth) + R.pilasterOut, R.pilasterHalf), ...pil(20.45, cornerR(20.45) + R.pilasterOut, R.pilasterHalf)]),
]);
const zLis = 20.45 + (R.lisene - cornerR(20.45) - R.pilasterOut);
const pilasterHigh = union([
  hull([...pil(20.45, cornerR(20.45) + R.pilasterOut, R.pilasterHalf), ...pil(zLis, R.lisene, R.lisenHalf)]),
  hull([...pil(zLis, R.lisene, R.lisenHalf), ...pil(H.lisene, R.lisene, R.lisenHalf)]),
]);
const pilasters = union(every6(30).map((deg) => place(union([pilasterLow, pilasterHigh]), { deg })));

// ---------- reservoir ----------
const lip = rev([[0, H.lip[0] - 0.01], [apo(20.45) - 0.05, H.lip[0] - 0.01], [R.reservoir, H.lip[1]], [R.reservoir, H.lip[1] + 0.01], [0, H.lip[1] + 0.01]]);
const reservoir = rev([[0, H.lip[1]], [R.reservoir, H.lip[1]], [R.reservoir, H.roof], [0, H.roof]]);
// Rij kleine gaten onder de bovenrand (0,4 m, 0,4 m uit elkaar): als groef van 0,45 m hoog en 0,3 m diep tussen de
// lisenen, plafond onder 56 graden.
const holes = rev([[R.reservoir - 0.3, H.holes[0]], [R.reservoir + 0.3, H.holes[0]], [R.reservoir, H.holes[1]], [R.reservoir - 0.3, H.holes[1] + 0.45]]);

// ---------- trappenhuis ----------
// Rechthoekig, 4,0 m breed, buitengevel 5,65 m uit het hart; de onderkant kraagt onder 45 graden uit de zuidoostgevel van
// de schacht, het platte dak steekt 0,2 m over (onderkant 45 graden).
const sx1 = STAIR.x[1], sy = STAIR.y;
const xUnder = apo(17) - R.recess - 0.05; // tot achter de achterwand van het verdiepte veld eronder
const zUnder = H.stairFoot - (sx1 - xUnder);
const stairBody = hull([
  ...[sy[0], sy[1]].flatMap((y) => [
    [STAIR.x[0], y, zUnder], [xUnder, y, zUnder], [sx1, y, H.stairFoot], [sx1, y, H.stairRoof[0]], [STAIR.x[0], y, H.stairRoof[0]],
  ]),
]);
const c = STAIR.cap;
const stairCap = hull([
  ...[[STAIR.x[0], sy[0]], [sx1, sy[0]], [sx1, sy[1]], [STAIR.x[0], sy[1]]].map(([x, y]) => [x, y, H.stairRoof[0] - 0.01]),
  ...[[STAIR.x[0] - c, sy[0] - c], [sx1 + c, sy[0] - c], [sx1 + c, sy[1] + c], [STAIR.x[0] - c, sy[1] + c]].map(([x, y]) => [x, y, H.stairRoof[0] + c]),
  ...[[STAIR.x[0] - c, sy[0] - c], [sx1 + c, sy[0] - c], [sx1 + c, sy[1] + c], [STAIR.x[0] - c, sy[1] + c]].map(([x, y]) => [x, y, H.stairRoof[1]]),
]);

const tower = union([shaft, lip, reservoir.subtract(holes), plaque])
  .subtract(union([panels, door]))
  .add(pilasters)
  .add(union([stairBody, stairCap]));

await writeLandmark({
  slug: "watertoren-ouderkerk-aan-de-ijssel",
  base: BASE,
  nodes: [["building:watertoren-zeskante-schacht-met-velden-reservoir-met-lisenen-en-trappenhuis", tower]],
  catalog: {
    name: "Watertoren Ouderkerk aan den IJssel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-6.8, 0], [-5.9, 3.4], [-5.9, -3.4], [0, 6.8]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0644100002062228"],
    description:
      "Oorsprong op het hart van de zeskante schacht (BAG, apothema 4,67 m) op het laagste maaiveld (NAP +3,35 m), +X loodrecht uit de zuidoostgevel met de deur en het trappenhuis (RD -60,7 graden). Betonnen plint tot 5,0 m, zeskante schacht met hoekpilasters, banden en verdiepte baksteenvelden, bolle overgang van 45 graden naar het ronde reservoir van 11,4 m (21,85 tot 29,9 m) met zes lisenen tot 30,8 m en een rij gaten onder de rand, en het uitkragende trappenhuis tot 32,65 m met overstekend dak. Maten uit BAG, AHN, luchtfoto en de RCE-foto.",
    realWorld: {
      built: 1916,
      builder: "Visser & Smit (Visser & Smit Hanab)",
      wikipediaHeightM: 32.5,
      reservoirM3: 400,
      outOfUseSince: 1980,
      ahnGroundNapM: GROUND_NAP,
      ahnReservoirRoofNapM: 33.25,
      ahnStairRoofNapM: 36.0,
      hexApothemM: [4.67, 4.35],
      reservoirDiameterM: R.reservoir * 2,
      reservoirM: [H.lip[1], H.roof],
      stairHouseM: [H.stairFoot, H.stairRoof[1]],
      topM: H.stairRoof[1],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Ouderkerk_aan_den_IJssel) (1916, Visser & Smit Hanab, 32,5 m, één reservoir van 400 m³, beton en IJsselsteentjes, trappenhuis boven het dak, sinds 1980 buiten gebruik, gedenkplaat boven de ingang)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Ouderkerk_aan_den_IJssel_-_20302525_-_RCE.jpg (1994, vanaf de dijk in het zuidwesten: schacht met banden en vensters, reservoir met lisenen en gaten, trappenhuis)",
      "https://commons.wikimedia.org/wiki/File:Ouderkerk_ad_IJssel_Watertoren_2986.JPG (2006, vanaf het zuiden: plint, deur met gedenkplaat, velden, bolle overgang, uitkraging van het trappenhuis)",
      "PDOK BAG-pand 0644100002062228, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-07",
    ],
  },
});

// Genereert een vereenvoudigd, gesloten 3D-model van de Berlagebrug (brug 423)
// over de Amstel in Amsterdam: de basculebrug van H.P. Berlage (architectuur)
// en C. Biemond (techniek), gebouwd 1929-1932, met vijf doorvaarten (vier vaste
// overspanningen met een vlakke liggerbrug op bakstenen pijlers en de
// basculeklep), de zware middenpijler met de basculekelder en het bakstenen
// brugwachtershuis (toren) aan de stadszijde met de keramische Genius van
// Amsterdam van Hildo Krop. Alle maten in het script zijn meters op ware
// grootte. Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-berlagebrug.mjs              # 1:1000 (standaard)
//   node scripts/generate-berlagebrug.mjs --scale 500
//
// Assenstelsel: oorsprong op de as van het dek (de tramsporen), 3,2 m ten
// westen van het hart van de basculedoorvaart, op de waterspiegel van de Amstel
// (NAP -0,4 m; het PDOK-terrein legt het water op ellipsoïdisch 42,69 m), Z
// omhoog. +X loopt langs de brug naar de oostoever (Mr. Treublaan, RD-richting
// 12,57 graden boven het oosten), +Y stroomafwaarts naar het noorden (de
// stadszijde met de toren).
//
// Bronnen: BGT overbruggingsdeel (dek van 73,7 × 24,2 m van x = -36,98 tot
// 36,68; de basculeklep 23,2 m breed tussen de middenpijler en pijler E1;
// pijlers W1 x = -26,25 .. -23,74, middenpijler -13,04 .. -2,76, E1 9,1 ..
// 12,69 en E2 23,46 .. 26,0, met hun puntige voorkoppen); BGT wegdeel (rijbaan
// regionale weg, OV-baan, fietspad en voetpad op het dek, relatieve
// hoogteligging 1); BAG-pand 0363100012197554 (het brugwachtershuis); AHN DSM
// 0,5 m (PDOK WCS) voor het lengteprofiel van het wegdek (NAP +3,30 m aan de
// westkade, +4,10 m boven de doorvaart, +3,44 m aan de oostkade; hyperbool met
// 6 mm afwijking), de toren (kern NAP +13,9 m, zijdelen +11,5 m), de
// pijlerkoppen boven het dek (NAP +5,3 tot +5,5 m), het bordes aan de
// noordzijde van de middenpijler (NAP +0,8 m) en de voorkoppen (NAP +0,2 tot
// +0,3 m); PDOK luchtfoto voor de plattegrond; Wikipedia (80 × 24 m,
// rijksmonument 530055) en Wikimedia Commons-foto's voor de opstand.
// Geschat (foto's): de constructiehoogte van het dek (1,5 m, waarvan 0,9 m
// rand), de pilasters op de pijlers, de lengte van de pijlerkoppen boven het
// dek, de kern van de toren (2,45 m breed) en de ramen, de Genius als reliëf
// van 1,25 × 3,4 m.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "berlagebrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Verticaal prisma van een contour (xy) van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Polygoon in het YZ-vlak, uitgetrokken langs X van x0 tot x1.
const profileX = (points, x0, x1) =>
  Manifold.extrude([ccw(points)], x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, 0]);

// ---------- wegdek ----------
// Lengteprofiel van het wegdek uit het AHN (NAP), als hyperbool met de top
// boven het hart van de doorvaart: NAP +4,10 m op x = 3,25, +3,30 m aan de
// westkade en +3,44 m aan de oostkade (6 mm RMS over het hele dek).
const WATER_NAP = -0.4;
const deckNap = (x) => 4.195 - 0.02212 * Math.hypot(x - 3.25, 4.5);
const Z = (x) => deckNap(x) - WATER_NAP; // wegdek boven de waterspiegel
const BOTTOM = -0.8; // onderkant van pijlers en landhoofden, onder water

const DECK = { west: -36.98, east: 36.68, halfWidth: 12.1 };
// Basculeklep tussen de middenpijler en pijler E1, 0,5 m smaller dan het
// vaste dek (BGT).
const LEAF = { x0: -2.76, x1: 9.1, halfWidth: 11.6 };
// Constructiehoogte (geschat op foto's): een rand van 0,9 m (met groene
// tegels) en daaronder de liggers, 0,3 m terug.
const EDGE_DEPTH = 0.9;
const DECK_DEPTH = 1.5;
const GIRDER_INSET = 0.3;
const ABUTMENT = 0.5; // eindwand tegen de kade

// Pijlers (BGT): x-bereik en de buitenkant van de pijlermuur (|y|).
const PIERS = {
  w1: { x0: -26.25, x1: -23.74, face: 12.7 },
  mid: { x0: -13.04, x1: -2.76, face: 12.62 },
  e1: { x0: 9.1, x1: 12.69, face: 13.0 },
  e2: { x0: 23.46, x1: 26.0, face: 12.7 },
};
// Voorkoppen (BGT-pijlercontouren in lokale coördinaten, 10 cm): lage
// granieten koppen tot NAP +0,3 m die buiten het dek uitsteken. De
// middenpijler is vereenvoudigd tot de omtrek met de punt onder de toren.
const NOSE_TOP = 0.7;
const NOSES = [
  // G0363.7492092676e443a6b9058b1585c9db9e (W1)
  [[-23.74, -12.75], [-23.74, 12.57], [-24.77, 13.6], [-25.05, 13.7], [-26.27, 12.59], [-26.25, -12.76], [-25.21, -13.66], [-24.88, -13.71]],
  // G0363.578c9d31793d4594aab7421c3ee0e7ad (middenpijler met toren en bordes)
  [[-13.04, -12.62], [-7.43, -14.86], [-7.05, -14.81], [-2.79, -12.75], [-2.76, 12.79], [-3.12, 12.79], [-3.12, 16.6], [-5.22, 18.51],
    [-7.32, 16.6], [-11.76, 16.55], [-11.86, 13.79], [-13.0, 12.64]],
  // G0363.cb3eaf99d33b469c81583d08be94e735 (E1)
  [[9.1, 12.9], [9.2, -13.19], [10.73, -14.57], [11.15, -14.48], [12.69, -12.89], [12.68, 13.06], [10.93, 14.75], [9.23, 13.21]],
  // G0363.e6adf06fc05c48b183eb5c36b87e3e9a (E2)
  [[25.99, -12.72], [26.08, 12.46], [25.0, 13.5], [24.72, 13.59], [23.56, 12.49], [23.46, -12.68], [24.46, -13.69], [24.8, -13.77]],
];
// Granieten pilasters op de kopse kanten van W1 en E2 (foto's): 0,7 m breed
// op de hoeken van de pijler, de baksteen ertussen 0,35 m terug.
const PILASTER = { width: 0.7, recess: 0.35 };
// Pijlerkoppen boven het dek (AHN NAP +5,3 tot +5,5 m, foto's): bakstenen
// blokken met een granieten deksteen op E1 aan beide zijden en op de
// middenpijler aan de zuidzijde naast de klep.
const HEADS = [
  { x0: PIERS.e1.x0, x1: PIERS.e1.x1, y0: LEAF.halfWidth, y1: PIERS.e1.face, rise: 1.2 },
  { x0: PIERS.e1.x0, x1: PIERS.e1.x1, y0: -LEAF.halfWidth, y1: -PIERS.e1.face, rise: 1.2 },
  { x0: -6.8, x1: LEAF.x0, y0: -LEAF.halfWidth, y1: -13.0, rise: 1.3 },
];
// Noordzijde van de middenpijler, ten westen van de toren: een balkon op
// dekhoogte (0,3 m boven het wegdek) met eronder de deur naar de kelder, en
// een granieten bordes op NAP +0,8 m (AHN) aan het water.
const BALCONY = { x0: -11.86, x1: -7.3, y0: LEAF.halfWidth, y1: 13.1, rise: 0.3 };
const LANDING = { x0: -11.86, x1: -7.3, y0: 12.6, y1: 15.2, top: 0.8 - WATER_NAP };
const KELDER_DOOR = { x0: -10.4, x1: -8.8, height: 2.2, depth: 0.3 };

// Brugwachtershuis (BAG 0363100012197554): rechthoek van 4,2 m met aan de
// waterzijde twee schuine hoeken, kern van 2,45 m breed tot NAP +13,9 m en
// zijdelen tot NAP +11,5 m (AHN). De zuidgevel staat tegen de dekrand (BAG
// y = 12,33, hier 12,0 zodat er geen spleet tussen dek en toren blijft).
const TOWER = {
  cx: -5.22,
  halfWidth: 2.1,
  south: 12.0,
  chamferY: 15.45,
  north: 16.57,
  noseHalf: 1.0,
  sideTop: 11.5 - WATER_NAP,
  coreHalf: 1.225,
  coreTop: 13.9 - WATER_NAP,
};
// Ramen als blinde nissen van 0,3 m (foto's): een band op NAP +8,6 .. +9,9 m,
// galmgaten erboven in de schuine gevels, en de Genius van Amsterdam (Hildo
// Krop, keramiek van 4 m) als reliëf van 0,2 m boven het middenraam.
const WINDOW = { z0: 8.6 - WATER_NAP, z1: 9.9 - WATER_NAP, depth: 0.3 };
const LOUVRE = { z0: 10.0 - WATER_NAP, z1: 11.0 - WATER_NAP };
const GENIUS = { halfWidth: 0.625, z0: 10.2 - WATER_NAP, z1: 13.6 - WATER_NAP, relief: 0.2 };

// ---------- lengtestations ----------
// Eén lijst voor het dek en de wegdeklaag, zodat hun bovenvlakken precies
// samenvallen; met de randen van pijlers en klep als stations.
const BREAKS = [
  DECK.west, DECK.west + ABUTMENT, PIERS.w1.x0, PIERS.w1.x1, -11.86, PIERS.mid.x0, -7.3, -6.8, PIERS.mid.x1,
  PIERS.e1.x0, PIERS.e1.x1, PIERS.e2.x0, PIERS.e2.x1, DECK.east - ABUTMENT, DECK.east,
];
const STATIONS = [...new Set([...BREAKS, ...Array.from({ length: 148 }, (_, i) => -36.5 + i * 0.5)])]
  .filter((x) => x >= DECK.west && x <= DECK.east)
  .sort((a, b) => a - b);
const stationsIn = (x0, x1) => [x0, ...STATIONS.filter((x) => x > x0 + 1e-6 && x < x1 - 1e-6), x1];
// Band tussen twee functies van x, uitgetrokken langs Y.
function band(x0, x1, bottom, top, y0, y1) {
  const xs = stationsIn(x0, x1);
  const pts = [...xs.map((x) => [x, bottom(x)]), ...[...xs].reverse().map((x) => [x, top(x)])];
  return profileY(pts, Math.min(y0, y1), Math.max(y0, y1));
}

// ---------- dek ----------
const edgeBottom = (x) => Z(x) - EDGE_DEPTH;
const soffit = (x) => Z(x) - DECK_DEPTH;
// Over de hele lengte de breedte van de klep, daarbuiten de vaste delen tot
// de volle breedte; de liggers 0,3 m terug onder de rand.
const deckCore = union([
  band(DECK.west, DECK.east, edgeBottom, Z, -LEAF.halfWidth, LEAF.halfWidth),
  band(DECK.west, DECK.east, soffit, edgeBottom, -(LEAF.halfWidth - GIRDER_INSET), LEAF.halfWidth - GIRDER_INSET),
]);
const fixedRanges = [[DECK.west, LEAF.x0], [LEAF.x1, DECK.east]];
const deckSides = [];
for (const [x0, x1] of fixedRanges) {
  for (const s of [-1, 1]) {
    deckSides.push(
      band(x0, x1, edgeBottom, Z, s * LEAF.halfWidth, s * DECK.halfWidth),
      band(x0, x1, soffit, edgeBottom, s * (LEAF.halfWidth - GIRDER_INSET), s * (DECK.halfWidth - GIRDER_INSET)),
    );
  }
}
const deck = union([deckCore, ...deckSides]);
const leafZone = boxFromTo(LEAF.x0, LEAF.x1, -20, 20, BOTTOM - 1, 30);
const leaf = deckCore.intersect(leafZone);
const fixedDeck = deck.subtract(leafZone);

// ---------- pijlers en landhoofden ----------
const substructure = [];
// Landhoofden: eindwanden van 0,5 m tegen de kades.
substructure.push(
  band(DECK.west, DECK.west + ABUTMENT, () => BOTTOM, edgeBottom, -(DECK.halfWidth - GIRDER_INSET), DECK.halfWidth - GIRDER_INSET),
  band(DECK.east - ABUTMENT, DECK.east, () => BOTTOM, edgeBottom, -(DECK.halfWidth - GIRDER_INSET), DECK.halfWidth - GIRDER_INSET),
);
// Pijlermuren tot onder de dekrand, dwars over de hele brug.
for (const [name, pier] of Object.entries(PIERS)) {
  const plain = name === "w1" || name === "e2";
  const wall = plain ? pier.face - PILASTER.recess : pier.face;
  substructure.push(band(pier.x0, pier.x1, () => BOTTOM, edgeBottom, -wall, wall));
  if (plain) {
    for (const s of [-1, 1]) {
      for (const [a, b] of [[pier.x0, pier.x0 + PILASTER.width], [pier.x1 - PILASTER.width, pier.x1]]) {
        substructure.push(band(a, b, () => BOTTOM, edgeBottom, s * (wall - 0.05), s * pier.face));
      }
    }
  }
}
substructure.push(...NOSES.map((poly) => prism(poly, BOTTOM, NOSE_TOP)));
// Doorvaarten: in werkelijkheid open onder een vlak dek. Een vrije
// horizontale overspanning van 10,7 m vult de export op 1:1000 op met een
// gestreepte wig (+110 % volume); daarom is de ruimte onder het dek dicht en
// heeft elke doorvaart aan beide gevels een diepe nis met een plafond dat
// onder 50 graden naar binnen afloopt (zelfdragend), van de onderkant van de
// liggers tot onder water. De bovenrand van de nis ligt per doorvaart op de
// laagste liggeronderkant.
const ARCH_SLOPE = Math.tan((50 * Math.PI) / 180);
const OPENINGS = [
  { x0: DECK.west + ABUTMENT, x1: PIERS.w1.x0 },
  { x0: PIERS.w1.x1, x1: PIERS.mid.x0 },
  { x0: PIERS.mid.x1, x1: PIERS.e1.x0, leaf: true },
  { x0: PIERS.e1.x1, x1: PIERS.e2.x0 },
  { x0: PIERS.e2.x1, x1: DECK.east - ABUTMENT },
];
const openingReport = [];
for (const { x0, x1, leaf: isLeaf } of OPENINGS) {
  const face = (isLeaf ? LEAF.halfWidth : DECK.halfWidth) - GIRDER_INSET;
  const top = isLeaf ? soffit : (x) => soffit(x) + 0.01;
  const body = band(x0, x1, () => BOTTOM, top, -face, face);
  const zr = Math.min(soffit(x0), soffit(x1));
  const depthAtBase = (zr - (BOTTOM - 1)) / ARCH_SLOPE;
  const recesses = [-1, 1].map((s) =>
    profileX(
      [
        [s * (face + 5), BOTTOM - 1],
        [s * (face + 5), zr],
        [s * face, zr],
        [s * (face - depthAtBase), BOTTOM - 1],
      ],
      x0 - 0.01,
      x1 + 0.01,
    ),
  );
  substructure.push(body.subtract(union(recesses)));
  openingReport.push({ x0, x1, span: +(x1 - x0).toFixed(2), recessTop: +zr.toFixed(2), depthAtWater: +(zr / ARCH_SLOPE).toFixed(2) });
}
// Pijlerkoppen boven het dek.
const heads = HEADS.map(({ x0, x1, y0, y1, rise }) => band(x0, x1, () => BOTTOM, (x) => Z(x) + rise, y0, y1));
// Balkon, keldermuur en bordes aan de noordzijde van de middenpijler.
const balconyWall = band(BALCONY.x0, BALCONY.x1, () => BOTTOM, (x) => Z(x) + BALCONY.rise, BALCONY.y0, BALCONY.y1);
const kelderDoor = boxFromTo(
  KELDER_DOOR.x0,
  KELDER_DOOR.x1,
  BALCONY.y1 - KELDER_DOOR.depth,
  BALCONY.y1 + 1,
  LANDING.top - 0.05,
  LANDING.top + KELDER_DOOR.height,
);
const balcony = balconyWall.subtract(kelderDoor);
const landing = boxFromTo(LANDING.x0, LANDING.x1, LANDING.y0, LANDING.y1, BOTTOM, LANDING.top);

// ---------- brugwachtershuis ----------
const T = TOWER;
const towerPlan = [
  [T.cx - T.halfWidth, T.south],
  [T.cx + T.halfWidth, T.south],
  [T.cx + T.halfWidth, T.chamferY],
  [T.cx + T.noseHalf, T.north],
  [T.cx - T.noseHalf, T.north],
  [T.cx - T.halfWidth, T.chamferY],
];
const towerBody = prism(towerPlan, BOTTOM, T.sideTop);
const towerCore = prism(towerPlan, BOTTOM, T.coreTop).intersect(
  boxFromTo(T.cx - T.coreHalf, T.cx + T.coreHalf, T.south - 1, T.north + 1, BOTTOM - 1, T.coreTop + 1),
);
// Nissen: middenraam in de noordgevel, ramen in de schuine gevels en de
// zijgevels, galmgaten boven de ramen in de schuine gevels.
const niches = [];
const nicheOnFace = ([ax, ay], [bx, by], centre, width, z0, z1) => {
  // Blok op de gevel tussen a en b (buitenkant rechts van a -> b, tegen de
  // klok in), `centre` als fractie langs de gevel.
  const len = Math.hypot(bx - ax, by - ay);
  const ux = (bx - ax) / len;
  const uy = (by - ay) / len;
  const nx = uy;
  const ny = -ux; // buitennormaal bij een contour tegen de klok in
  const cx = ax + ux * len * centre;
  const cy = ay + uy * len * centre;
  const h = width / 2;
  const d = WINDOW.depth;
  const poly = [
    [cx - ux * h - nx * d, cy - uy * h - ny * d],
    [cx + ux * h - nx * d, cy + uy * h - ny * d],
    [cx + ux * h + nx * 1, cy + uy * h + ny * 1],
    [cx - ux * h + nx * 1, cy - uy * h + ny * 1],
  ];
  return prism(poly, z0, z1);
};
const P = ccw(towerPlan);
const face = (i) => [P[i], P[(i + 1) % P.length]];
// Volgorde tegen de klok in: zuid, oost, schuin noordoost, noord, schuin
// noordwest, west.
const [south, east, northEast, north, northWest, west] = [0, 1, 2, 3, 4, 5].map(face);
niches.push(
  nicheOnFace(...north, 0.5, 1.35, WINDOW.z0, WINDOW.z1),
  nicheOnFace(...northEast, 0.5, 0.8, WINDOW.z0, WINDOW.z1),
  nicheOnFace(...northWest, 0.5, 0.8, WINDOW.z0, WINDOW.z1),
  nicheOnFace(...northEast, 0.5, 0.8, LOUVRE.z0, LOUVRE.z1),
  nicheOnFace(...northWest, 0.5, 0.8, LOUVRE.z0, LOUVRE.z1),
  nicheOnFace(...east, 0.55, 0.9, WINDOW.z0, WINDOW.z1),
  nicheOnFace(...west, 0.45, 0.9, WINDOW.z0, WINDOW.z1),
  nicheOnFace(...south, 0.5, 1.0, WINDOW.z0, WINDOW.z1),
);
const genius = boxFromTo(
  T.cx - GENIUS.halfWidth,
  T.cx + GENIUS.halfWidth,
  T.north - 0.05,
  T.north + GENIUS.relief,
  GENIUS.z0,
  GENIUS.z1,
);
const tower = union([towerBody, towerCore]).subtract(union(niches)).add(genius);

const fixedStructure = union([fixedDeck, ...substructure, ...heads, balcony, landing]);
const printModel = union([fixedStructure, leaf, tower]);
// Het printmodel eerst doorrekenen: de wegdeklaag hieronder verandert de STL niet.
printModel.numTri();

// ---------- wegdelen als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is per BGT-functie een eigen node met de
// attributen van het BGT-wegdeel eronder (glTF `extras.attributes`), zodat de
// kleurregels van een thema (fietspaden rood, OV-baan) op de brug werken zoals
// op de PDOK-wegdelen ernaast. Contouren: de actuele BGT-wegdelen met
// relatieve hoogteligging 1 in het lokale stelsel, vereenvoudigd tot 5 cm. De
// BGT deelt het dek in drie stukken (x = -5,05 en 9,9); per functie zijn ze
// samengenomen. Geen van de wegdelen heeft een plus_fysiek_voorkomen.
const LAYER = 0.5;
const ABOVE = 1.0;
const GAP = 0.02;
const OV_ATTRIBUTES = { bgt_functie: "OV-baan", bgt_fysiekvoorkomen: "gesloten verharding" };
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
const FOOT_ATTRIBUTES = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "gesloten verharding" };
const FOOT_OPEN_ATTRIBUTES = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "open verharding" };
// OV-baan (tramlijn 4) in het midden: G0363.1ba784a6, G0363.bab20121 (west),
// G0363.f3fdf0ce, G0363.0ac0dd86 (klep), G0363.15b03284, G0363.ce4b9793 (oost).
const OV_LANES = [
  [[-5.05, -0.12], [-5.03, 3.13], [-36.98, 3.18], [-36.98, 0.03]],
  [[-5.06, -3.16], [-5.05, -0.12], [-36.98, 0.03], [-36.97, -3.07]],
  [[9.9, -3.2], [9.91, -0.19], [-5.05, -0.12], [-5.06, -3.16]],
  [[9.91, -0.19], [9.92, 3.1], [-5.03, 3.13], [-5.05, -0.12]],
  [[36.69, -3.27], [36.68, -0.32], [9.91, -0.19], [9.9, -3.2]],
  [[36.68, -0.32], [36.68, 3.05], [9.92, 3.1], [9.91, -0.19]],
];
// Rijbanen: G0363.84a2d60c, G0363.bb1608d3, G0363.bfc8293e, G0363.79275a1f,
// G0363.e22088b9, G0363.75e1338c. De strook van 0,4 m tussen de noordelijke
// rijbaan en het fietspad (y = 6,42 .. 6,84, de band) staat niet in de BGT en
// hoort hier bij de rijbaan, net als de rest van het dek die geen ander
// wegdeel is.
const ROAD_LANES = [
  [[-5.02, 6.42], [-36.98, 6.42], [-36.98, 3.18], [-5.03, 3.13]],
  [[-5.06, -3.16], [-36.97, -3.07], [-36.97, -6.37], [-5.07, -6.45]],
  [[9.89, -6.48], [9.9, -3.2], [-5.06, -3.16], [-5.07, -6.45]],
  [[9.92, 3.1], [9.94, 6.43], [-5.02, 6.42], [-5.03, 3.13]],
  [[36.69, -6.54], [36.69, -3.27], [9.9, -3.2], [9.89, -6.48]],
  [[36.68, 3.05], [36.67, 6.43], [9.94, 6.43], [9.92, 3.1]],
];
// Fietspaden: G0363.c33a9271, G0363.86bc25f1, G0363.4ac5ad92, G0363.c414a33e,
// G0363.29bda179, G0363.40dc72f9.
const BIKE_PATHS = [
  [[-5.02, 6.84], [-5.01, 8.54], [-26.27, 8.58], [-36.99, 8.51], [-36.99, 6.83]],
  [[-5.08, -8.53], [-5.07, -6.45], [-36.97, -6.37], [-36.97, -8.47]],
  [[9.88, -8.56], [9.89, -6.48], [-5.07, -6.45], [-5.08, -8.53]],
  [[9.94, 6.84], [9.95, 8.51], [-5.01, 8.54], [-5.02, 6.84]],
  [[36.7, -8.61], [36.69, -6.54], [9.89, -6.48], [9.88, -8.56]],
  [[36.67, 6.84], [36.67, 8.45], [9.95, 8.51], [9.94, 6.84]],
];
// Voetpaden in gesloten verharding (west en klep): G0363.7d1f0395,
// G0363.48b9e3df, G0363.d1b590f5, G0363.99febca1, G0363.cef14279,
// G0363.76782d02; in open verharding (oost, vanaf x = 11,42 .. 11,50):
// G0363.a29bafc5 en G0363.0c5dc990. Ze liggen buiten de fietspaden
// (|y| > 8,45 .. 8,61) tot de dekrand; de dekranden buiten de BGT-vlakken
// (|y| > 11,5 tot 12,1, waar de leuningen staan) horen erbij.
const FOOT_OPEN_X = 11.46;
const OUTER_Y = 8.0;

// Snijstrook van 0,5 m onder tot 1 m boven het wegdek over dezelfde stations
// als het dek, breder en langer dan het dek zodat hij de dekranden en de
// kopse kanten helemaal doorsnijdt.
const STRIP_HALF_WIDTH = DECK.halfWidth + 0.2;
const stripXs = [DECK.west - 0.5, ...STATIONS, DECK.east + 0.5];
const stripZ = (x) => Z(Math.min(Math.max(x, DECK.west), DECK.east));
const strip = profileY(
  [...stripXs.map((x) => [x, stripZ(x) - LAYER]), ...[...stripXs].reverse().map((x) => [x, stripZ(x) + ABOVE])],
  -STRIP_HALF_WIDTH,
  STRIP_HALF_WIDTH,
);
// Wat door het wegdek steekt, blijft constructie, met 2 cm vrij: de toren,
// de pijlerkoppen en het balkon.
const guards = union([
  ...HEADS.map(({ x0, x1, y0, y1 }) =>
    boxFromTo(Math.min(x0, x1) - GAP, Math.max(x0, x1) + GAP, Math.min(y0, y1) - GAP, Math.max(y0, y1) + GAP, BOTTOM, 30),
  ),
  boxFromTo(BALCONY.x0 - GAP, BALCONY.x1 + GAP, BALCONY.y0 - GAP, BALCONY.y1 + GAP, BOTTOM, 30),
]);
// De toren 2 cm groter: elke hoek 2 cm naar buiten.
const towerGuard = Manifold.extrude(
  wasm.CrossSection.ofPolygons([ccw(towerPlan)]).offset(GAP, "Miter"),
  40,
).translate([0, 0, BOTTOM]);
const layer = strip.subtract(union([guards, towerGuard]));
const zone = (polys) => union(polys.map((poly) => prism(poly, BOTTOM - 1, 30)));
const ovZone = zone(OV_LANES);
const bikeZone = zone(BIKE_PATHS).subtract(ovZone);
// Voetpaden: alles buiten de fietspaden (|y| > 8,0), ten oosten van x = 11,46
// in open verharding. Zo vallen de dekranden buiten de BGT-vlakken er ook
// onder, en blijven er tussen de BGT-vlakken geen strookjes over.
const outer = (x0, x1) =>
  union([boxFromTo(x0, x1, OUTER_Y, 20, BOTTOM - 1, 30), boxFromTo(x0, x1, -20, -OUTER_Y, BOTTOM - 1, 30)]);
const footOpenZone = outer(FOOT_OPEN_X, DECK.east + 2).subtract(ovZone).subtract(bikeZone);
const footZone = outer(DECK.west - 2, FOOT_OPEN_X).subtract(ovZone).subtract(bikeZone);
const ovCut = layer.intersect(ovZone);
const bikeCut = layer.intersect(bikeZone);
const footOpenCut = layer.intersect(footOpenZone);
const footCut = layer.intersect(footZone);
// Rijbaan: de rest van de strook (de BGT-rijbanen en de band ernaast).
const roadCut = layer.subtract(union([ovZone, bikeZone, outer(DECK.west - 2, DECK.east + 2)]));
// De constructie verliest de hele strook (niet de som van de wegdelen), zodat
// de grenzen tussen de wegdelen geen splinters in de constructie laten.
const cut = layer;
const ovLane = ovCut.intersect(printModel);
const roadway = roadCut.intersect(printModel);
const bikeway = bikeCut.intersect(printModel);
const footway = footCut.intersect(printModel);
const footwayOpen = footOpenCut.intersect(printModel);
// Constructie: vaste brug, klep en toren onder of naast het wegdek, uit de
// losse onderdelen (de klep en de vaste brug grenzen alleen in x = -2,76 en
// 9,1 aan elkaar; de toren gaat voor waar hij in pijler en dek staat).
const fixedPart = fixedStructure.subtract(tower).subtract(cut);
const leafPart = leaf.subtract(cut);
const towerPart = tower.subtract(cut);

const parts = [
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:ov-baan", ovLane, OV_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
  ["road:voetpad", footway, FOOT_ATTRIBUTES],
  ["road:voetpad-open", footwayOpen, FOOT_OPEN_ATTRIBUTES],
  ["building:brug", fixedPart],
  ["building:basculeklep", leafPart],
  ["building:brugwachtershuis", towerPart],
];

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}



await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(3),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
// De onderdelen vormen samen precies de brug als geheel (geen overlap).
const partsVolume = parts.reduce((sum, [, solid]) => sum + solid.volume(), 0);
const roadParts = parts.filter(([name]) => name.startsWith("road:")).map(([, solid]) => solid);
const buildingParts = parts.filter(([name]) => name.startsWith("building:")).map(([, solid]) => solid);
report.partition = {
  partsM3: +partsVolume.toFixed(3),
  wholeM3: +printModel.volume().toFixed(3),
  differenceM3: +(partsVolume - printModel.volume()).toFixed(4),
  overlapRoadBuildingM3: +union(roadParts).intersect(union(buildingParts)).volume().toFixed(4),
};
report.openings = openingReport;
report.deck = {
  westNap: +deckNap(DECK.west).toFixed(2),
  crownNap: +deckNap(3.25).toFixed(2),
  eastNap: +deckNap(DECK.east).toFixed(2),
};
const glbFile = path.join(outDir, "berlagebrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-berlagebrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers en landhoofden op het printbed.
const stlName = `berlagebrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BOTTOM]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Berlagebrug Amsterdam 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten op het
// water van de Amstel, 5 m buiten de dekranden in de doorvaarten; groundHeight
// is de PDOK-waterspiegel (ellipsoïdisch) als terugval.
const GROUND_HEIGHT = 42.69;
const samplePoints = [
  [-31.6, 17],
  [-18.4, -17],
  [3.2, 17],
  [3.2, -17],
  [18.1, 17],
  [31.4, -17],
];
await writeFile(
  path.join(outDir, "berlagebrug.json"),
  JSON.stringify(
    {
      name: "Berlagebrug",
      file: "berlagebrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [122668.0, 484486.3],
      xAxis: [0.97603, 0.21764],
      groundOffsetMetres: 0,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0363100012197554"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek (de tramsporen), 3,2 m ten westen van het hart van de basculedoorvaart, op de waterspiegel van de Amstel (z = 0, NAP -0,4 m) in de oorsprong, +X langs de brug naar de oostoever (Mr. Treublaan, RD-richting 12,57 graden) en +Y stroomafwaarts naar het noorden (de stadszijde met de toren). Nodenaam klasse:label bepaalt de materiaalklasse: road:rijbaan, road:ov-baan, road:fietspad, road:voetpad en road:voetpad-open zijn de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan regionale weg, OV-baan, fietspad of voetpad; bgt_fysiekvoorkomen gesloten verharding, de oostelijke voetpaden open verharding), zodat de kleurregels van een thema erop werken; building:brug is de vaste brug (dek van 73,7 × 24,2 m met rand en liggers, landhoofden, vier bakstenen pijlers met voorkoppen en pilasters, pijlerkoppen boven het dek, balkon, keldermuur en bordes aan de noordzijde van de middenpijler), building:basculeklep de klep van 11,9 × 23,2 m onder het wegdek, building:brugwachtershuis de toren (BAG-pand) met de kern tot NAP +13,9 m, zijdelen tot NAP +11,5 m, ramen als nissen en de Genius van Amsterdam als reliëf. De vijf doorvaarten (vier vaste overspanningen van 10,7 m en de basculedoorvaart van 11,9 m) zijn aan beide gevels diepe nissen met een plafond dat onder 50 graden naar binnen afloopt, zodat het model op 1:1000 zonder opvulling print; daartussen is de onderbouw dicht. Leuningen, lichtmasten, bovenleiding, vlaggenmasten en de trappen op het bordes zijn weggelaten. Het maaiveld wordt op het water naast de brug bemonsterd; groundHeight is de PDOK-waterspiegel (ellipsoïdisch).",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(DECK.east - DECK.west).toFixed(2),
        widthM: DECK.halfWidth * 2,
        leafM: { length: +(LEAF.x1 - LEAF.x0).toFixed(2), width: LEAF.halfWidth * 2 },
        openingsRecessDepthAtWaterM: openingReport.map((o) => o.depthAtWater),
        spansM: [
          +(PIERS.w1.x0 - DECK.west - ABUTMENT).toFixed(2),
          +(PIERS.mid.x0 - PIERS.w1.x1).toFixed(2),
          +(PIERS.e1.x0 - PIERS.mid.x1).toFixed(2),
          +(PIERS.e2.x0 - PIERS.e1.x1).toFixed(2),
          +(DECK.east - ABUTMENT - PIERS.e2.x1).toFixed(2),
        ],
        deckNapM: report.deck,
        towerTopNapM: { core: 13.9, sides: 11.5 },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Berlagebrug_(Amsterdam)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/530055",
        "PDOK BGT overbruggingsdeel (dek, klep, pijlers met voorkoppen), EPSG:28992",
        "PDOK BGT wegdeel (OGC API), relatieve hoogteligging 1: rijbaan regionale weg, OV-baan, fietspad, voetpad (gesloten en open verharding)",
        "PDOK BAG pand 0363100012197554 (brugwachtershuis)",
        "PDOK AHN DSM 0,5 m via WCS voor het wegdek, de toren, de pijlerkoppen, het bordes en de voorkoppen",
        "PDOK luchtfoto (Actueel_orthoHR) voor de plattegrond",
        "Wikimedia Commons: Amsterdam Berlagebrug 001.JPG, 002.JPG, Berlagebrug opened.JPG, Berlagebrug.jpg, 2023 Genius van Amsterdam, Berlagebrug, Asd.jpg, Overzicht Berlagebrug over de Amstel en een bedieningshuisje - Amsterdam - 20409346 - RCE.jpg, 2023 Berlagebrug, Asd (05).jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

// Watertoren van Hellevoetsluis aan de Opzoomerlaan, binnen de vesting. Gebouwd in 1896 naar ontwerp van N. Biezeveld,
// 22 m hoog volgens Wikipedia, twee reservoirs van 60 m³; in 1965 buiten gebruik, voor één gulden verkocht en sinds de
// verbouwing een woning met werkruimte (de reservoirs zijn verwijderd); gemeentelijk monument. Ronde toren van rode
// baksteen met gele banden in neorenaissance-/burchtstijl: een plint met de rondboogdeur, een slanke schacht met kleine
// vensters en een medaillon, een rand van consoles met rondbogen ertussen die de schacht uitkraagt naar de bredere
// reservoircilinder, met acht kruisvormige schietgatvensters, een rondgaande lijst en een borstwering met ronde gaten en
// kantelen om een plat dakterras met een rond trappenhuis. Aan de noordkant ligt een plat afgedekte aanbouw van één laag
// (zelfde BAG-pand) met een glazen piramide-lichtkoepel in de westvleugel.
//
// Oorsprong op het hart van de schacht: cirkelfit op de 64 boogpunten van BAG-pand 0530100002230574 (straal 2,81 m,
// spreiding 1 mm), op maaiveld (AHN-DTM NAP +2,0 à +2,1 rondom; 3D BAG-maaiveld 2,0). +X wijst naar het westen (RD 180
// graden): de rondboogdeur aan de kant van de Opzoomerlaan, zoals op de RCE-foto 20300202 (recht op de deur, het
// dienstwoonhuis van 1898 rechts = zuid, de aanbouw links = noord).
// Maten: hoogtes uit het AHN-DSM 0,5 m (dakterras NAP +22,7, kantelen en trappenhuis +25,1 à +25,2, aanbouw +5,0 à +5,1;
// 3D BAG: 22,74, 25,05 à 25,17 en 5,0 à 5,1), de stralen uit BAG (plint 2,81) en DSM (top tot circa 3,2 m), de geledingen
// en vensters uit de frontale RCE-foto (schaal 45 px per m, maaiveld tot kanteeltop 23,1 m), de lichtkoepel uit de
// luchtfoto en het DSM-gat in het dak.
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [68457.78, 427243.1];
const AXIS_DEG = 180;
const AXIS = [-1, 0];
const GROUND_NAP = 2.0;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (west 45,889, zuid 45,925, oost 45,857, west van de
// aanbouw 45,871, noord 45,956), gemeten 2026-11-06; rondom op 4 tot 8 m 45,74 tot 46,2, het terrein is vlak. Het
// PDOK-pand begint op 45,79.
const GROUND_ELLIPSOID = 45.86;

// Omwenteling van een gesloten profiel [[r, z], ...].
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Massief onder een profiel van onder naar boven, gesloten langs de as.
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Schijf tot r1 tussen z0 en z1, met een onderkant van 50 graden vanaf de straal rIn (massief tot de as).
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder 56
// graden op.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Rondboognis: als niche, met een halfrond bovenop; het boogplafond loopt naar binnen onder 63 graden op.
const archNiche = (f, w, z0, zSpring, depth = 0.3) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([y, z]) => [a, y, z + 2 * depth]),
    ...arc.map(([y, z]) => [f, y, z]),
    ...arc.map(([y, z]) => [f + 1, y, Math.max(z0, z - 1.5)]),
    [a, -r, z0], [a, r, z0], [f + 1, -r, z0], [f + 1, r, z0],
  ]);
};

// ---------- hoogtes boven het maaiveld (NAP +2,0) ----------
const H = {
  foot: 0.5, // verbrede voet
  plinth: [4.2, 4.6], // lijst boven de plint (RCE-foto 4,2 tot 4,75)
  door: [0, 2.55], // rondboogdeur, kruin 3,45
  molding: [12.95, 13.3], // lijst onder de consoles
  consoleFoot: 13.3,
  consoleTop: 15.3, // aanzet van de rondbogen
  drum: 15.9, // onderkant van de reservoircilinder (kruin van de bogen)
  drumBand: [16.45, 16.75],
  cross: [17.3, 19.3], // schietgatvensters (spleet), ruit op 18,3 m
  cornice: [19.96, 20.24], // rondgaande lijst onder de borstwering
  terrace: 20.7, // dakterras (AHN NAP +22,7)
  crenel: 21.6, // onderkant van de kantelen
  merlon: 23.15, // kantelen (AHN NAP +25,1)
  stair: [22.95, 23.15], // trappenhuis op het dakterras (AHN NAP +25,05 à +25,17)
  annex: 3.05, // platte aanbouw (AHN NAP +5,0 à +5,1)
  skylight: 1.0, // lichtkoepel boven het dak van de aanbouw
};
// Stralen.
const R = {
  foot: 2.95,
  plinth: 2.85, // BAG 2,81
  plinthLedge: 2.95,
  shaft: 2.62,
  molding: 2.8,
  consoleIn: 2.3,
  consoleFoot: 2.72,
  drum: 3.2, // DSM: top tot circa 3,2 m van het hart
  drumBand: 3.28,
  cornice: 3.35,
  parapet: 3.25,
  parapetIn: 2.35, // borstwering en kantelen 0,9 m dik
  stair: 1.0,
};
const FRONT = 0; // deur (+X, west)

// ---------- voet en plint ----------
const foot = solidRev([[R.foot, BASE], [R.foot, H.foot], [R.plinth, H.foot + 0.1]]);
const plinth = solidRev([[R.plinth, BASE], [R.plinth, H.plinth[0] + 0.01]]);
// Lijst boven de plint met een onderkant van 50 graden; de bovenkant loopt af naar de schacht.
const plinthLedge = rev([[0, H.plinth[0] - 0.12], [R.plinth, H.plinth[0] - 0.12], [R.plinthLedge, H.plinth[0]], [R.plinthLedge, H.plinth[1]], [R.shaft, H.plinth[1] + 0.25], [0, H.plinth[1] + 0.25]]);

// ---------- schacht ----------
const shaft = solidRev([[R.shaft, H.foot], [R.shaft, H.drum + 0.01]]);
const molding = ledge(R.shaft, R.molding, ...H.molding);
// Twaalf consoles van 0,9 m breed die schuin naar buiten lopen tot onder de reservoircilinder (buitenkant 76 graden).
const consoleBlock = hull([
  [R.consoleIn, -0.45, H.consoleFoot], [R.consoleIn, 0.45, H.consoleFoot], [R.consoleFoot, -0.45, H.consoleFoot], [R.consoleFoot, 0.45, H.consoleFoot],
  [R.drum, -0.45, H.consoleTop], [R.drum, 0.45, H.consoleTop], [R.drum, -0.45, H.drum + 0.01], [R.drum, 0.45, H.drum + 0.01],
  [R.consoleIn, -0.45, H.drum + 0.01], [R.consoleIn, 0.45, H.drum + 0.01],
]);
const consoles = union(around(consoleBlock, every(12, FRONT)));
// Tussen de consoles: de bogen als schuine onderkant van de reservoircilinder (50 graden van de schacht tot de gevel).
const drumUnder = rev([[0, H.consoleTop - 0.1], [R.shaft, H.consoleTop - 0.1], [R.drum, H.drum], [R.drum, H.drum + 0.02], [0, H.drum + 0.02]]);

// Vensters in de schacht als nissen: rondboogvensters op 5,7 tot 7,4 m en kleine vensters op 11,2 tot 12,2 m op de vier
// schuine kanten, een rond medaillon (als nis van 0,9 m) boven de deur op 9,45 tot 10,35 m. Rondboogdeur van 1,8 m breed.
const DIAG = [45, 135, 225, 315].map((d) => FRONT + d);
const shaftOpenings = union([
  ...around(archNiche(R.shaft, 0.9, 5.7, 6.95, 0.3), DIAG),
  ...around(niche(R.shaft, 0.9, 11.2, 12.2, 0.3), DIAG),
  place(niche(R.shaft, 0.9, 9.45, 10.35, 0.3), { deg: FRONT }),
  place(archNiche(R.plinth, 1.8, H.door[0], H.door[1], 0.4), { deg: FRONT }),
]);

// ---------- reservoircilinder ----------
const drum = solidRev([[R.drum, H.drum], [R.drum, H.cornice[0] + 0.01]]);
const drumBand = ledge(R.drum, R.drumBand, ...H.drumBand);
// Acht schietgatvensters op de deur en om de 45 graden: een smalle verticale spleet met op de kruising een ronde
// verbreding en korte stenen armen (foto). Als nis: de spleet met een ruit van 1,1 m breed op 18,3 m, met een vlakke
// achterwand en zijden van 57 graden. Een dwarsarm met een plafond dat naar binnen oploopt liet boven de arm een dunne lip
// naast de spleet over die de export opvulde.
const CROSS = { half: 0.55, slit: 0.3, depth: 0.3, z: 18.3 };
const crossBoss = hull(
  [R.drum - CROSS.depth, R.drum + 1].flatMap((x) => [
    [x, -CROSS.half, CROSS.z], [x, CROSS.half, CROSS.z],
    [x, 0, CROSS.z - CROSS.half * 1.3], [x, 0, CROSS.z + CROSS.half * 1.55],
  ]),
);
const crossWindow = union([niche(R.drum, 2 * CROSS.slit, ...H.cross, CROSS.depth), crossBoss]);
const crossWindows = union(around(crossWindow, every(8, FRONT)));
const cornice = ledge(R.drum, R.cornice, ...H.cornice);

// ---------- borstwering, kantelen, dakterras en trappenhuis ----------
const parapet = solidRev([[R.parapet, H.cornice[1] - 0.01], [R.parapet, H.crenel]]);
// Tien kantelen van 18 graden (1,0 m breed aan de buitenkant, tussenruimte 1,0 m); een kanteel boven de deur.
const MERLON_HALF = (9 * Math.PI) / 180;
// De buitenhoeken 5 mm binnen de straal, zodat ze niet buiten de veelhoek van de borstwering uitsteken.
const merlonPts = [[R.parapetIn, -1], [R.parapet - 0.005, -1], [R.parapet - 0.005, 1], [R.parapetIn, 1]].map(([r, s]) => [r * Math.cos(s * MERLON_HALF), r * Math.sin(s * MERLON_HALF)]);
const merlon = hull([...merlonPts.map(([x, y]) => [x, y, H.crenel - 0.01]), ...merlonPts.map(([x, y]) => [x, y, H.merlon])]);
const merlons = union(around(merlon, every(10, FRONT)));
const terrace = prism(Array.from({ length: SEG }, (_, k) => [R.parapetIn * Math.cos((2 * Math.PI * k) / SEG), R.parapetIn * Math.sin((2 * Math.PI * k) / SEG)]), H.terrace, H.merlon + 1);
// Rond trappenhuis op het dakterras tegen de oostkant (RD +1,5 m oost, +1,0 m noord van het hart), met een platte kegel
// als kap.
const STAIR_AT = [-1.5, -1.0];
const stair = union([
  solidRev([[R.stair, H.terrace - 0.05], [R.stair, H.stair[0]], [0.3, H.stair[1]]]),
]).translate([...STAIR_AT, 0]);

// ---------- aanbouw (zelfde BAG-pand) ----------
// BAG-contour ten opzichte van de oorsprong in RD (oost, noord), omgezet naar het modelstelsel (x = -oost, y = -noord); de
// boog om de toren is vervangen door het hart, de toren dekt die hoek.
const ANNEX_RD = [
  [-12.9, 7.34], [-9.38, 2.74], [-7.22, 4.51], [-3.24, 4.28], [-3.39, 3.58], [0.26, 3.29], [0.22, 2.81], [0, 0], [2.25, 1.7],
  [5.34, 3.97], [5.93, 11.41], [0.95, 11.81], [-2.83, 12.12], [-3.01, 10.15], [-8.58, 10.65],
];
const annexPoly = ANNEX_RD.map(([e, n]) => [-e, -n]);
const annex = prism(annexPoly, BASE, H.annex);
// Glazen piramide-lichtkoepel van 2,4 m in de westvleugel (DSM-gat en luchtfoto, RD -9,6 oost, +6,9 noord), evenwijdig aan
// de zuidwestgevel van die vleugel (52,6 graden), 1,0 m hoog (40 graden).
const SKY = { at: [9.6, -6.9], half: 1.2, deg: -52.6 + 180 };
const skylight = place(
  hull([[-SKY.half, -SKY.half, H.annex - 0.01], [SKY.half, -SKY.half, H.annex - 0.01], [SKY.half, SKY.half, H.annex - 0.01], [-SKY.half, SKY.half, H.annex - 0.01], [0, 0, H.annex + H.skylight]]),
  { deg: SKY.deg, at: [...SKY.at, 0] },
);

const tower = union([foot, plinth, plinthLedge, shaft, molding, consoles, drumUnder, drum, drumBand, cornice, parapet, merlons])
  .subtract(union([shaftOpenings, crossWindows, terrace]))
  .add(stair);
const building = union([tower, annex, skylight]);

await writeLandmark({
  slug: "watertoren-hellevoetsluis",
  base: BASE,
  nodes: [["building:watertoren-plint-schacht-consoles-reservoir-kantelen-en-aanbouw", building]],
  catalog: {
    name: "Watertoren Hellevoetsluis",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[4.5, 0], [0, 4.5], [-4.5, 1], [11, -2], [0, -13]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0530100002230574"],
    description:
      "Oorsprong op het hart van de ronde schacht (BAG-boog, straal 2,81 m) op maaiveld (NAP +2,0 m), +X naar het westen (RD 180 graden): de rondboogdeur aan de kant van de Opzoomerlaan. Plint met deur en lijst tot 4,6 m, schacht van 5,2 m met rondboogvensters, medaillon en kleine vensters, lijst en twaalf consoles met bogen naar de reservoircilinder van 6,4 m (15,9 tot 20,0 m) met acht schietgatvensters, lijst, borstwering met tien kantelen tot 23,15 m om het dakterras op 20,7 m met een rond trappenhuis; de platte aanbouw van het BAG-pand (3,05 m) met een piramide-lichtkoepel. Maten uit BAG, AHN, 3D BAG, luchtfoto en een frontale RCE-foto.",
    realWorld: {
      built: 1896,
      architect: "N. Biezeveld",
      wikipediaHeightM: 22,
      reservoirM3: [60, 60],
      monument: "gemeentelijk monument",
      ahnGroundNapM: GROUND_NAP,
      ahnTerraceNapM: 22.7,
      ahnTopNapM: 25.15,
      ahnAnnexNapM: 5.05,
      plinthDiameterM: R.plinth * 2,
      shaftDiameterM: R.shaft * 2,
      reservoirDiameterM: R.drum * 2,
      reservoirM: [H.drum, H.cornice[1]],
      terraceM: H.terrace,
      merlonM: H.merlon,
      annexM: H.annex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Hellevoetsluis) (1896, N. Biezeveld, 22 m, twee reservoirs van 60 m³, in 1965 buiten gebruik, verbouwd tot woning, gemeentelijk monument)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Hellevoetsluis_-_20300202_-_RCE.jpg (frontaal op de deur vanaf het westen: plint, schacht, vensters, consoles met bogen, reservoir met kruisvormige schietgatvensters, borstwering met ronde gaten en kantelen)",
      "https://commons.wikimedia.org/wiki/File:Fortress_Hellevoetsluis_-_Watertower_and_Church.JPG en File:Hellevoetsluis_003.jpg (silhouet van de andere kanten)",
      "PDOK BAG-pand 0530100002230574, AHN DSM/DTM 0,5 m, 3D BAG en luchtfoto, 2026-11-06",
    ],
  },
});

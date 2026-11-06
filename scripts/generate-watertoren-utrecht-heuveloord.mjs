// Watertoren Heuveloord in Utrecht (Tolsteeg, Zuid), tussen de straat Heuveloord en de Vaartsche Rijn, op de oude grens met
// Jutphaas. Gebouwd 1906-1907 als derde toren van de Utrechtsche Waterleiding Maatschappij, 37 m hoog, reservoir van
// 1000 m³ (Wikipedia); gemeentelijk monument. In 1977 bekleed met Luxalon-panelen, in 1996 in de oorspronkelijke staat
// hersteld; sinds 2015 een restaurant in de top met een glazen paviljoen op het dakterras binnen de kantelen, een café met
// terras op de begane grond. Een ronde, licht verjongende schacht op een bredere plint met waterlijst, bovenaan een
// boogfries op consoles en een lichte band; een kegelvormige uitkraging van siermetselwerk naar het veel bredere reservoir
// (14,7 m) met een stalen onderrand en een lichte kroonlijst, een rij kleine vensters tussen twee lichte banden, zestien
// rondboogvelden met elk een hoog smal venster, twee lichte banden en een kroonlijst, en een borstwering met kantelen rond
// het dakterras. Daarop het glazen restaurant met een overstekend plat dak en installatiekasten.
//
// Oorsprong op het hart van het ronde BAG-pand 0344100000127759 (cirkel door 62 hoekpunten, straal 7,37 m: de omtrek van
// het reservoir) op het maaiveld: AHN-DTM NAP +1,95 aan de straat- en noordzijde (aan de kant van de Vaartsche Rijn ligt de
// kade lager, NAP +1,2). De rand van de top in het AHN-DSM (7,0 à 7,2 m per sector van 30 graden, celmiddens) en het
// dak van het restaurant (cirkel r 4,3 m, 0,05 m oost en 0,6 m zuid) liggen op dat hart. +X naar het oosten (RD-richting
// 0), +Y naar het noorden; de toren is rond, de deur staat aan de straatzijde (+X, geschat).
// Maten: hoogtes van de top uit het AHN-DSM 0,5 m (kantelen NAP +37,5 à +37,6 = 35,6 m, kantelen-tussenruimte en
// dakterras +36,9 à +37,0, dak van het restaurant +39,7 à +39,8 = 37,8 m, installaties tot +41,2) en de PDOK-
// reconstructie (top 84,37 ellipsoïdisch = 39,1 m); de straal van het reservoir uit de BAG; de restaurant- en
// terrasmaten uit de luchtfoto (8 cm). Geledingen, banden, vensters, schacht en plint uit de foto "Watertoren Utrecht
// Heuveloord.jpg" (Commons, vanaf de Vaartsche Rijn, 2015), geschaald op de breedte van het reservoir (550 px = 14,74 m)
// en de kantelen (35,6 m).
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [136735.42, 454168.87];
const AXIS = [1, 0];
const GROUND_NAP = 1.95;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 45,42, noord 45,36, zuid 45,30, zuidoost 45,43),
// gemeten 2026-11-06; aan de westkant (kade van de Vaartsche Rijn) ligt het PDOK-terrein op 44,35 en die punten zijn
// bewust weggelaten, anders zakt de toren 0,95 m in de straat.
const GROUND_ELLIPSOID = 45.3;

// Omwenteling van een gesloten profiel [[r, z], ...].
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Massief onder een profiel van onder naar boven, gesloten langs de as.
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Schijf tot r1 tussen z0 en z1, met een onderkant van 50 graden vanaf de straal rIn (massief tot de as).
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
// Straal van een rechte kegel van (ra, za) tot (rb, zb) op hoogte z.
const coneR = (ra, za, rb, zb) => (z) => ra + ((rb - ra) * (z - za)) / (zb - za);
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 56 graden op.
// Ook bij een lage nis ligt het buitenpunt 1,5 m onder de bovenkant, anders wordt het plafond vlakker dan 45 graden.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = z1 - 1.5;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
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
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
const DOOR = 0; // straatzijde Heuveloord (lokaal +X, geschat)
const BAYS = every(16, 360 / 32); // zestien velden van het reservoir, met een penant op de deuras

// ---------- hoogtes boven het maaiveld (NAP +1,95) ----------
const H = {
  plinth: 2.7, // bredere plint met donker siermetselwerk
  plinthLedge: [2.7, 2.95], // lichte waterlijst
  consoles: [15.1, 15.7], // consoles onder de boogfries van de schacht
  frieze: [15.7, 16.5],
  shaftBand: [16.6, 17.1], // lichte band onder de uitkraging
  resBottom: 20.0, // onderkant reservoir (stalen rand)
  steelRing: [20.0, 20.35],
  lowerCornice: [20.35, 21.0],
  smallWindows: [21.4, 22.3],
  band1: [22.95, 23.2],
  band2: [23.6, 23.9],
  panels: [24.3, 29.9], // rondboogvelden, aanzet van de boog 29,9 (kruin 30,85)
  windows: [25.0, 29.7],
  band3: [31.9, 32.3],
  cornice: [33.3, 33.9],
  terrace: 34.0, // dakterras (AHN tussen de kantelen +36,9 à +37,0 met borstwering en glazen balustrade)
  crenel: 34.7,
  merlon: 35.6, // AHN NAP +37,5 à +37,6
  glassTop: 37.5,
  roof: 37.8, // dak van het restaurant, AHN NAP +39,7 à +39,8
};
// Stralen.
const R = {
  plinth: 5.4,
  plinthLedge: 5.5,
  shaftFoot: 5.15,
  shaftTop: 4.95,
  frieze: 5.1,
  shaftBand: 5.15,
  reservoir: 7.25,
  steelRing: 7.37, // BAG-omtrek
  lowerCornice: 7.33,
  band: 7.35,
  cornice: 7.4,
  parapetOut: 7.2,
  parapetIn: 6.3,
  glass: 4.6, // glazen wand: foto 9,7 m breed; AHN-dak r 4,3 (celmiddens)
  roof: 5.3, // dichte overstekende dakrand (luchtfoto: donkere ring tot r 5,1 à 5,5)
};
const shaftR = coneR(R.shaftFoot, H.plinthLedge[1], R.shaftTop, H.consoles[0]);

// ---------- plint met deur ----------
const plinth = solidRev([[R.plinth, BASE], [R.plinth, H.plinth + 0.01]]);
const plinthLedge = ledge(R.plinth, R.plinthLedge, ...H.plinthLedge);
// Deur met rondboog aan de straatzijde: 1,6 m breed, aanzet 1,55 m, kruin 2,35 m onder de waterlijst (geschat).
const door = place(archNiche(R.plinth, 1.6, BASE + 0.25, 1.55, 0.4), { deg: DOOR });
const foot = union([plinth, plinthLedge]);

// ---------- schacht ----------
const shaft = solidRev([[R.shaftFoot, H.plinthLedge[1] - 0.01], [R.shaftTop, H.consoles[0]], [R.shaftTop, H.shaftBand[1] + 0.01]]);
// Kleine rondboogvensters als nis van 0,9 m: vier op 5,6 tot 7,2 m (45 graden naast de deur), vier op 9,6 tot 11,4 m
// (boven de deur en rondom), vier op 13,3 tot 14,6 m (45 graden naast de deur).
const shaftWin = (z0, zSpring, degs) => around(archNiche(shaftR(zSpring + 0.45), 0.9, z0, zSpring, 0.3), degs);
const shaftOpenings = union([
  ...shaftWin(5.6, 6.75, every(4, DOOR + 45)),
  ...shaftWin(9.6, 10.95, every(4, DOOR)),
  ...shaftWin(13.3, 14.15, every(4, DOOR + 45)),
]);
// Boogfries: band van 0,15 m uitsteek (onderkant 50 graden) op zestien consoles van 0,9 m breed met een onderkant van
// 48 graden; daarboven de lichte band onder de uitkraging.
const frieze = ledge(R.shaftTop, R.frieze, ...H.frieze);
const friezeConsole = hull([
  [R.shaftTop - 0.2, -0.45, H.consoles[0]], [R.shaftTop - 0.2, 0.45, H.consoles[0]], [R.shaftTop - 0.2, -0.45, H.frieze[0] + 0.1], [R.shaftTop - 0.2, 0.45, H.frieze[0] + 0.1],
  [R.frieze, -0.45, H.consoles[0] + 0.17], [R.frieze, 0.45, H.consoles[0] + 0.17], [R.frieze, -0.45, H.frieze[0] + 0.1], [R.frieze, 0.45, H.frieze[0] + 0.1],
]);
const friezeConsoles = union(around(friezeConsole, BAYS));
const shaftBand = ledge(R.shaftTop, R.shaftBand, ...H.shaftBand);
const shaftAll = union([shaft.subtract(shaftOpenings), frieze, friezeConsoles, shaftBand]);

// ---------- uitkraging en reservoir ----------
// Kegel van siermetselwerk van 5,15 m op 17,1 m (de band) tot 7,25 m op 20,0 m (54 graden).
const corbel = rev([[0, H.shaftBand[1] - 0.01], [R.shaftBand, H.shaftBand[1] - 0.01], [R.reservoir, H.resBottom], [R.reservoir, H.resBottom + 0.3], [0, H.resBottom + 0.3]]);
// De onderkant van de rand begint binnen de kegel (r 6,9), zodat er geen vlak randje onder de kegelrand overblijft.
const steelRing = ledge(6.9, R.steelRing, ...H.steelRing);
const lowerCornice = rev([[0, H.lowerCornice[0] - 0.01], [R.lowerCornice, H.lowerCornice[0] - 0.01], [R.lowerCornice, H.lowerCornice[1]], [0, H.lowerCornice[1]]]);
const drum = solidRev([[R.reservoir, H.resBottom], [R.reservoir, H.cornice[0] + 0.01]]);
// Zestien kleine vensters tussen de onderste banden, zestien rondboogvelden (1,9 m breed, 0,2 m diep) met elk een hoog
// smal venster (0,9 m, nog 0,25 m dieper).
const smallWindows = around(niche(R.reservoir, 0.9, ...H.smallWindows, 0.3), BAYS);
const panels = around(archNiche(R.reservoir, 1.9, H.panels[0], H.panels[1], 0.2), BAYS);
const tallWindows = around(niche(R.reservoir - 0.2, 0.9, ...H.windows, 0.25), BAYS);
const bands = union([
  ledge(R.reservoir, R.band, ...H.band1),
  ledge(R.reservoir, R.band, ...H.band2),
  ledge(R.reservoir, R.band, ...H.band3),
  ledge(R.reservoir, R.cornice, ...H.cornice),
]);
const reservoir = union([corbel, steelRing, lowerCornice, drum.subtract(union([...smallWindows, ...panels, ...tallWindows])), bands]);

// ---------- borstwering, kantelen en dakterras ----------
// Borstwering van 0,9 m dik tot 34,7 m rond het dakterras op 34,0 m; daarop zestien kantelen van 1,9 m breed boven de
// vensters (tussenruimte 0,93 m op de buitenkant, foto: brede kantelen, smalle tussenruimtes) tot 35,6 m.
const parapet = rev([[R.parapetIn, H.cornice[1] - 0.01], [R.parapetOut, H.cornice[1] - 0.01], [R.parapetOut, H.crenel], [R.parapetIn, H.crenel]]);
const deck = solidRev([[R.parapetIn + 0.01, H.cornice[1] - 0.01], [R.parapetIn + 0.01, H.terrace]]);
const MERLON_HALF = 0.95 / R.parapetOut;
const merlon = (() => {
  const pts = [[R.parapetIn * Math.cos(-MERLON_HALF), R.parapetIn * Math.sin(-MERLON_HALF)], [R.parapetOut * Math.cos(-MERLON_HALF), R.parapetOut * Math.sin(-MERLON_HALF)], [R.parapetOut * Math.cos(MERLON_HALF), R.parapetOut * Math.sin(MERLON_HALF)], [R.parapetIn * Math.cos(MERLON_HALF), R.parapetIn * Math.sin(MERLON_HALF)]];
  return hull([...pts.map(([x, y]) => [x, y, H.crenel - 0.01]), ...pts.map(([x, y]) => [x, y, H.merlon])]);
})();
const merlons = union(around(merlon, BAYS));

// ---------- restaurant op het dakterras ----------
// Glazen paviljoen r 4,6 m tot 37,5 m, plat dak tot 37,8 m dat tot r 5,3 m overkraagt met een onderkant van 50 graden.
// De open lamellenrand daaromheen (foto, tot circa r 6,3) is weggelaten: in de luchtfoto en het AHN doorzichtig.
const pavilion = solidRev([[R.glass, H.terrace - 0.01], [R.glass, H.glassTop]]);
const roof = rev([[0, H.glassTop - 1.2 * (R.roof - R.glass)], [R.glass, H.glassTop - 1.2 * (R.roof - R.glass)], [R.roof, H.glassTop], [R.roof, H.roof], [0, H.roof]]);
// Installatiekasten op het dak (AHN-DSM en luchtfoto): oost tot 39,1 m, west en zuidwest tot 38,7 en 38,8 m.
const plant = union([
  box(0.3, -2.5, H.roof - 0.01, 2.0, 1.6, 39.1),
  box(-3.5, 0.6, H.roof - 0.01, -1.9, 1.6, 38.7),
  box(-2.2, -2.5, H.roof - 0.01, -0.6, -1.5, 38.8),
]);
const top = union([parapet, deck, merlons, pavilion, roof, plant]);

// De deur pas aan het eind, zodat de onderkant van de schacht geen plat plafond in de nis laat.
const tower = union([foot, shaftAll, reservoir, top]).subtract(door);

await writeLandmark({
  slug: "watertoren-utrecht-heuveloord",
  base: BASE,
  nodes: [["building:watertoren-plint-schacht-reservoir-kantelen-en-restaurant", tower]],
  catalog: {
    name: "Watertoren Heuveloord Utrecht",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8.5, 0], [0, 8.5], [0, -8.5], [6, -6]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000127759"],
    description:
      "Oorsprong op het hart van het ronde BAG-pand (de omtrek van het reservoir) op het maaiveld (NAP +1,95 m), +X naar het oosten (straatzijde Heuveloord, deur geschat), +Y naar het noorden. Plint met waterlijst en deur; verjongende schacht met kleine rondboogvensters, boogfries op zestien consoles en een lichte band; kegelvormige uitkraging naar het reservoir van 14,7 m met stalen onderrand, kroonlijst, kleine vensters, banden, zestien rondboogvelden met hoge vensters en een kroonlijst; zestien kantelen tot 35,6 m rond het dakterras met het glazen restaurant tot 37,8 m en installatiekasten tot 39,1 m. Maten uit BAG, AHN, luchtfoto en een foto.",
    realWorld: {
      built: 1907,
      architect: "Utrechtsche Waterleiding Maatschappij",
      publishedHeightM: 37,
      reservoirM3: 1000,
      ahnGroundNapM: GROUND_NAP,
      ahnMerlonNapM: [37.5, 37.6],
      ahnRestaurantRoofNapM: [39.7, 39.8],
      ahnTopNapM: 41.2,
      plinthDiameterM: R.plinth * 2,
      shaftDiameterM: [R.shaftFoot * 2, R.shaftTop * 2],
      reservoirDiameterM: R.steelRing * 2,
      merlonM: H.merlon,
      restaurantRoofM: H.roof,
      topM: 39.1,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Utrecht_Heuveloord) (1906-1907, Utrechtsche Waterleiding Maatschappij, 37 m, 1000 m³, rond en licht verjongend, overstekend reservoir, Luxalon 1977, herstel 1996, restaurant sinds 2015)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Utrecht_Heuveloord.jpg (vanaf de Vaartsche Rijn: plint, schacht met vensters en boogfries, uitkraging, reservoir met banden, kleine vensters, rondboogvelden met hoge vensters, kroonlijst, kantelen en het glazen restaurant)",
      "https://commons.wikimedia.org/wiki/File:Vaartsche-Rijn_Pastoe_watertoren_Utrecht_Nederland.JPG (reservoir en kantelen vóór het restaurant)",
      "PDOK BAG-pand 0344100000127759, AHN DSM/DTM 0,5 m, luchtfoto en PDOK-gebouwtegel, 2026-11-06",
    ],
  },
});

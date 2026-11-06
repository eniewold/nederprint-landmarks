// Watertoren Boskoop ("De hoge hoed"), Zijde 442, gebouwd in 1908 naar ontwerp van J. Schotel en op 30 maart 1909 in
// gebruik genomen; rijksmonument 511321, tot 1976 in gebruik. Oorspronkelijk 32,5 m hoog met een sterk uitkragende
// bovenbouw van gele verblendsteen met kantelen en smeedijzeren hekwerken rond een Intze-reservoir van 150 m³ (register,
// Wikipedia). Die bovenbouw is bij een vastgelopen restauratie in februari 1999 afgebroken en het reservoir is
// neergelaten (DBNL, Rodi 28-01-2026: "mist al 30 jaar z'n kop"); de toren staat sindsdien zonder kop. Dit model is de
// huidige toestand zoals het AHN, de luchtfoto en de foto "Watertoren Boskoop 2019.jpg" die tonen: de schacht tot de
// dichtgemetselde en met cement afgedekte uitkraging (gele band met ronde gaten en stalen stompen), tot 23,3 m.
//
// Opbouw (register en foto's): een conische schacht van rode baksteen op een gemetseld basement met een natuurstenen
// cordonband. De eerste geleding heeft op de begane grond langgerekte vensters en eindigt in een segmentboogfries met
// een natuurstenen band en uitkragende tandlijst; daarboven springt de tweede geleding terug. De tweede geleding heeft
// rode banden met vensters, afwisselend op twee niveaus (de hoge met grotere sluitstenen), en eindigt in een rondboogfries
// onder de gele band. Aan de kant van de Zijde (noord) staat een rechthoekig, vlak gedekt portaal met een natuurstenen
// afdekbalk, pinakels op de voorhoeken en de deur in een rondboogvormig spaarveld.
//
// Oorsprong op het hart van de ronde BAG-contour van pand 0499100002023098 (cirkelfit op 58 punten, straal 4,42 m, rest
// < 1 mm) op het maaiveld. +X wijst naar RD-richting -4,5 graden (oost), +Y naar 85,5 graden (noord): de as van het
// portaal (BAG: voorgevel 2,71 m breed op 5,07 m van het hart, zijwanden lopen naar de schacht 3,7 m uit elkaar).
//
// Hoogtes: z = 0 ligt op NAP -1,69 (laagste PDOK-terrein op de groundSamplePoints ellipsoïdisch 41,73; PDOK min AHN-DTM
// rond de toren 43,24 tot 43,57, gemiddeld 43,42; AHN-DTM rond de voet NAP -1,5 tot -1,75). AHN-DSM 0,5 m (2026-11-06):
// bovenrand van de gele band NAP +21,5 tot +21,7 op een ring met buitenstraal circa 2,9 tot 3,0 m, daarbinnen tot circa
// 2,0 m een plat dak op NAP +19,9; de richel boven de tandlijst van de eerste geleding NAP +7,5 tussen straal 3,3 en
// 3,9 m; portaal NAP +2,4 tot +3,1. De overige hoogtes (geledingen, vensters, banden, pinakels) zijn geschat van
// "Watertoren Boskoop 2019.jpg" (Commons, vanaf het westen; 40,8 px/m tussen de richel en de bovenrand, 47,8 px/m
// tussen het maaiveld en de richel) en gecontroleerd op "Boskoop watertoren - panoramio.jpg" (2005).
//
// Printbaar op 1:1000 zonder steun: banden en kragen met een onderkant van 50 graden, vensternissen met een plafond van
// 56 graden en een rondboog van 63 graden, pinakels van 0,9 m.
import { Manifold, CrossSection, ccw, hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [103630.19, 454412.08];
const AXIS_DEG = -4.5;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: oost 41,943, west 41,809,
// zuid 41,773, zuidoost 41,772, zuidwest 41,726, voor het portaal 41,935, noordoost 41,974, noordwest 41,920.
const GROUND_ELLIPSOID = 41.73;
const GEOID = 43.42; // ellipsoïdisch min NAP hier (PDOK-terrein min AHN-DTM)
const NAP0 = +(GROUND_ELLIPSOID - GEOID).toFixed(2); // NAP-hoogte van z = 0: -1,69
const nap = (h) => +(h - NAP0).toFixed(2);

// Omwenteling van een gesloten profiel [[r, z], ...].
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Massief onder een profiel van onder naar boven, gesloten langs de as.
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Schijf tot r1 tussen z0 en z1 met een onderkant van 50 graden vanaf straal rIn (massief tot de as).
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
// Straal van een rechte kegel van (ra, za) tot (rb, zb) op hoogte z.
const coneR = (ra, za, rb, zb) => (z) => ra + ((rb - ra) * (z - za)) / (zb - za);
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; plafond naar binnen onder 56 graden.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Rondboognis: als niche met een halfrond bovenop; het boogplafond loopt naar binnen onder 63 graden op.
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

// ---------- hoogtes boven het maaiveld (NAP -1,69) ----------
const H = {
  plinth: 1.7, // basement met natuurstenen cordonband (foto)
  frieze: 7.3, // onderkant segmentboogfries (foto)
  band: 8.6, // natuurstenen band met tandlijst (foto)
  ledge: nap(7.5), // bovenkant tandlijst = richel van de eerste geleding (AHN NAP +7,5)
  arcFrieze: 20.0, // rondboogfries onder de gele band (foto)
  collar: 20.35, // onderkant van de gele band (dichtgemetselde uitkraging, foto)
  roof: nap(19.9), // plat dak binnen de rand (AHN)
  top: nap(21.6), // bovenrand van de gele band (AHN NAP +21,5 tot +21,7)
  portal: 4.2, // afdekbalk van het portaal (AHN NAP +2,4 tot +3,1 op het dak, foto)
  pinnacle: [5.0, 5.5], // pinakels op de voorhoeken (foto)
};
// Stralen.
const R = {
  plinth: 4.42, // BAG-cirkel
  shaftFoot: 4.25, // register: doorsnede aan de voet 8,5 m
  shaftUp1: 4.0, // eerste geleding onder het fries (foto: nauwelijks taps)
  frieze: 4.1,
  band: 4.2,
  shaft2Foot: 3.6, // tweede geleding boven de richel (AHN-richel 3,3 tot 3,9; foto 0,91 x eerste geleding)
  shaft2Top: 2.87, // onder het rondboogfries (foto, AHN)
  collar: 3.0, // gele band (AHN-buitenstraal 2,9 tot 3,0)
  rimInner: 2.05, // binnenkant van de rand (AHN: plat dak tot circa 2,0 m)
};
const shaft1R = coneR(R.shaftFoot, H.plinth, R.shaftUp1, H.frieze);
const shaft2R = coneR(R.shaft2Foot, H.ledge, R.shaft2Top, H.arcFrieze);

// ---------- basement en eerste geleding ----------
// Basement met de cordonband, afgeschuind onder 45 graden naar de schacht.
const plinth = solidRev([[R.plinth, BASE], [R.plinth, H.plinth], [R.shaftFoot - 0.05, H.plinth + (R.plinth - R.shaftFoot) + 0.05]]);
const shaft1 = solidRev([[R.shaftFoot, H.plinth - 0.01], [R.shaftUp1, H.frieze + 0.01]]);
// Segmentboogfries en de natuurstenen band met tandlijst, elk 0,1 m uitkragend met een onderkant van 50 graden.
const frieze = ledge(R.shaftUp1, R.frieze, H.frieze + 0.12, H.band);
const band = ledge(R.frieze, R.band, H.band + 0.12, H.ledge);
// Vier langgerekte vensters op de begane grond (foto: west; register: vier); de vierde zit achter het portaal-
// hekwerk of naast het portaal en is niet te zien, dus drie nissen op oost, zuid en west.
const win1 = around(niche(shaft1R(5.9), 0.9, 3.1, 5.9, 0.3), [0, 180, 270]);

// ---------- tweede geleding ----------
const shaft2 = solidRev([[R.shaft2Foot, H.ledge - 0.01], [R.shaft2Top, H.collar + 0.01]]);
// Zes vensters, afwisselend laag (11,7 tot 16,6 m) en hoog (13,9 tot 18,6 m, met sluitsteen); laag op west (foto).
const LOW = [60, 180, 300];
const HIGH = [0, 120, 240];
const win2 = [
  ...around(niche(shaft2R(16.6), 0.9, 11.7, 16.6, 0.3), LOW),
  ...around(niche(shaft2R(18.6), 0.9, 13.9, 18.6, 0.3), HIGH),
];

// ---------- gele band (dichtgemetselde uitkraging; het rondboogfries eronder ligt vrijwel vlak in de gevel) ----------
// Kraag van 50 graden van het rondboogfries naar de gele band, de band tot de bovenrand, een plat dak binnen de rand.
const collar = ledge(R.shaft2Top, R.collar, H.collar, H.top);
const roofWell = solidRev([[R.rimInner, H.roof], [R.rimInner, H.top + 1]]);

// ---------- portaal (noord, +Y) ----------
// BAG-voorgevel van (-1,24; 5,08) tot (1,47; 5,06), zijwanden naar (-1,68; 4,09) en (2,03; 3,92), doorgetrokken tot
// in de schacht.
const PORTAL = [[-1.24, 5.08], [1.47, 5.06], [2.47, 3.0], [-2.16, 3.0]];
const portalBody = prism(PORTAL, BASE, H.portal);
// Pinakels op de voorhoeken (0,9 m, op de verblendstenen aanzet) met een spits van vier vlakken.
const pinnacle = (x0) => union([
  box(x0, 4.16, H.portal - 0.01, x0 + 0.9, 5.07, H.pinnacle[0]),
  hull([[x0, 4.16, H.pinnacle[0] - 0.01], [x0 + 0.9, 4.16, H.pinnacle[0] - 0.01], [x0, 5.07, H.pinnacle[0] - 0.01], [x0 + 0.9, 5.07, H.pinnacle[0] - 0.01], [x0 + 0.45, 4.615, H.pinnacle[1]]]),
]);
const pinnacles = [pinnacle(-1.24), pinnacle(0.57)];
// Deur in het rondboogvormige spaarveld (1,2 m breed, aanzet 2,6 m), naar +Y.
const door = place(archNiche(5.07, 1.2, 0.0, 2.6, 0.35), { deg: 90, at: [0.12, 0, 0] });

const tower = union([
  union([plinth, shaft1, frieze, band]).subtract(union(win1)),
  shaft2.subtract(union(win2)),
  collar.subtract(roofWell),
  union([portalBody, ...pinnacles]).subtract(door),
]);

await writeLandmark({
  slug: "watertoren-boskoop",
  base: BASE,
  nodes: [["building:watertoren-basement-schacht-gele-band-en-portaal", tower]],
  catalog: {
    name: "Watertoren Boskoop",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6, 0], [-6, 0], [0, -6], [4.5, -4.5], [-4.5, -4.5], [0, 7.5], [4.5, 4.5], [-4.5, 4.5]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0499100002023098"],
    description:
      "Oorsprong op het hart van het ronde BAG-pand op het maaiveld (NAP circa -1,7 m), +X naar RD-richting -4,5 graden, +Y naar het noorden (85,5 graden): portaal aan de Zijde. Huidige toestand zonder de in 1999 afgebroken bovenbouw: basement van 8,84 m met cordonband, conische eerste geleding met drie vensters, segmentboogfries en band met tandlijst tot 9,19 m (AHN), terugspringende tweede geleding van 7,2 tot 5,74 m met zes vensters op twee niveaus, rondboogfries en de dichtgemetselde gele band van 6,0 m tot 23,29 m (AHN) rond een plat dak; vlak gedekt portaal met pinakels en rondboogdeur. Maten uit BAG, AHN, register en foto's.",
    realWorld: {
      built: 1908,
      inUse: "1909-1976",
      architect: "J. Schotel",
      rijksmonument: 511321,
      publishedHeightM: 32.5,
      publishedHeightNote: "oorspronkelijke hoogte met de bovenbouw, die in 1999 is afgebroken",
      reservoirM3: 150,
      groundNapM: NAP0,
      ahnTopNapM: 21.6,
      ahnRoofNapM: 19.9,
      ahnLedgeNapM: 7.5,
      topM: H.top,
      plinthDiameterM: R.plinth * 2,
      shaftDiameterM: [R.shaftFoot * 2, R.shaftUp1 * 2, R.shaft2Foot * 2, R.shaft2Top * 2],
      collarDiameterM: R.collar * 2,
      ledgeM: H.ledge,
      portalM: { front: 2.71, depthFromCentre: 5.07, height: H.portal, pinnacle: H.pinnacle[1] },
      photoScalePxPerM: [40.8, 47.8],
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/511321 (1908, J. Schotel, 32,5 m, conische schacht van 8,5 m aan de voet, twee geledingen, segmentboogfries met tandlijst, rondboogfries, vensters op twee niveaus, rechthoekig vlak gedekt portaal met pinakels, Intze-reservoir van 150 m³ en 8 m)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Boskoop) ('had' een hoogte van 32,5 m; 'De hoge hoed')",
      "https://dbnl.org/tekst/sten009monu10_01/sten009monu10_01_0024.php en https://www.rodi.nl/alphenaandenrijn/historie/482006/is-de-watertoren-het-mooiste-monument-van-boskoop- (bovenbouw na 1994 afgebroken, februari 1999 kop eraf en reservoir neergelaten; restauratie vastgelopen)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Boskoop_2019.jpg (Steven Lek, CC BY-SA 4.0; huidige toestand, vanaf het westen: geledingen, vensters, portaal)",
      "https://commons.wikimedia.org/wiki/File:Boskoop_watertoren_-_panoramio.jpg (2005, vensters op twee niveaus, gele band)",
      "PDOK BAG-pand 0499100002023098, AHN DSM/DTM 0,5 m, luchtfoto Actueel_orthoHR en PDOK-terrein, 2026-11-06",
    ],
  },
});

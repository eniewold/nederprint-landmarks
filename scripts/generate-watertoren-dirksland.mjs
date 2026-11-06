// Watertoren van Dirksland (ook: van Sommelsdijk), Goeree-Overflakkee. Gebouwd 1939-1941 naar ontwerp van J. Gerber in
// de stijl van de Delftse School; 62,50 m hoog, reservoir van 575 m³ op acht buiten- en vier binnenkolommen achter de
// gemetselde mantel; in 1993 een nieuw dak; 2007-2009 restaurant, sindsdien leeg (Wikipedia). Rijksmonument 525002.
// Een slanke, licht verjongende ronde bakstenen schacht zonder geledingen, met een rij kleine vensters aan de voet,
// vier kolommen spleetvensters, een rij vensters halverwege het reservoir en een rij kleine vensters onder het dak; een
// breed, plat uitkragend "hoed"-dak met een dikke boeiboord en een flauwe koperen kegel, een open lantaarntje met een
// kraag en een slanke koperen spits met een knop en een naald.
//
// Oorsprong op het middelpunt van de ronde BAG-voetafdruk van pand 0504100001641890 (cirkelfit op 28 hoekpunten,
// straal 5,93 m); lokale X-as naar RD-oost (de toren is rond). Maaiveld AHN-DTM NAP +0,52 (ring van 6 tot 8 m).
// Hoogtes uit het AHN-DSM (0,5 m) min dat maaiveld: rand van het dak NAP +40,5 op 7,7 m uit het hart, kegel van
// 28 graden (NAP +42,4 op 4 m, +43,7 op 2 m), kraag van de lantaarn NAP +45,9 op 1,5 m, voet van de spits NAP +47,4
// op 1 m, spits nog NAP +59,6 in de middelste pixel; de naald tot 62,0 m boven het maaiveld (NAP +62,5, Wikipedia
// 62,50 m). Verjonging van de schacht (5,93 naar 5,55 m), dikte van de boeiboord, onderkant van het dak, de lantaarn,
// de knop en de hoogtes en aantallen van de vensters van de foto's "Overzicht met omgeving - Dirksland - 20338063 -
// RCE.jpg" (0,071 m per pixel op de schacht), "Overzicht watertoren met omgeving - Dirksland - 20353450 - RCE.jpg",
// "Dirksland - Watertoren.jpg" en "Watertoren Dirksland.jpg", geschaald op de BAG-diameter en het AHN.
import { Manifold, CrossSection, ccw, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [67535.25, 418699.23];
const AXIS_DEG = 0;
const AXIS = [1, 0];
const GROUND_NAP = 0.52;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (noord 44,398, west 44,399, oost 44,423,
// zuid 44,423; bestrating rond de voet), gemeten 2026-11-06. Het PDOK-pand staat op 44,36 met de top op 91,78.
const GROUND_ELLIPSOID = 44.398;

// ---------- maten (meters boven het maaiveld, stralen vanaf het hart) ----------
const R = {
  foot: 5.93, // BAG-cirkel
  shaftTop: 5.55, // onder de kraag van het dak (foto: 0,93 x de voet)
  brim: 7.7, // rand van het hoeddak (AHN; foto 1,3 x de schacht)
  brimLip: 7.35, // binnenkant van de boeiboord, begin van de kegel
  cone: 1.7, // kegel tot de lantaarn
  lantern: 1.3,
  collar: 1.75, // kraag op de lantaarn
  spireFoot: 1.15,
  spireBell: 0.7, // einde van de uitlopende voet van de spits
  spireKnob: 0.45,
  knob: 0.62,
  needle: 0.3,
};
const H = {
  shaftTop: 36.95, // begin van de kraag onder het dak (foto 37,0 tot 37,6)
  brimSoffit: 39.15, // onderkant van de boeiboord (kraag van 45 graden)
  brim: 40.1, // bovenkant van de boeiboord (AHN NAP +40,5)
  cone: 43.15, // top van de kegel (AHN NAP +43,7 op 2 m)
  lantern: 44.9,
  collarTop: 45.75, // kraag van de lantaarn (AHN NAP +45,9 op 1,5 m)
  bell: 47.0, // voet van de spits (AHN NAP +47,4 op 1 m)
  knob0: 56.5,
  knob1: 56.75,
  knob2: 57.05,
  needleFoot: 57.45,
  top: 62.0, // naald (Wikipedia 62,50 m; NAP +62,5)
};

const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
const shaftR = (z) => R.foot + ((R.shaftTop - R.foot) * Math.max(0, z)) / H.shaftTop;

// Nis in een gevel met normaal +X op afstand f, breedte w, van z0 tot z1, 0,3 m diep; het plafond loopt naar binnen
// onder 56 graden op, zodat er niets vrij hangt.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Deur met een ronde boog als nis: het boogplafond loopt schuin naar binnen op.
const archNiche = (f, w, z0, zSpring, depth = 0.35) => {
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
const steps = (n, phase = 0) => Array.from({ length: n }, (_, k) => phase + (360 * k) / n);
// Nis op de schacht: de voorkant op de straal halverwege de nis.
const shaftNiche = (w, z0, z1) => niche(shaftR((z0 + z1) / 2) - 0.05, w, z0, z1);

// ---------- toren als één omwentelingsprofiel ----------
const tower = solidRev([
  [R.foot, BASE],
  [R.foot, 0],
  [R.shaftTop, H.shaftTop],
  [R.brim, H.brimSoffit], // kraag van 45 graden onder het hoeddak
  [R.brim, H.brim], // boeiboord
  [R.brimLip, H.brim],
  [R.cone, H.cone], // koperen kegel van 28 graden
  [R.lantern, H.cone],
  [R.lantern, H.lantern], // lantaarn
  [R.collar, H.lantern + (R.collar - R.lantern)], // kraag van 45 graden
  [R.collar, H.collarTop],
  [R.spireFoot, H.collarTop],
  [R.spireBell, H.bell], // uitlopende voet van de spits
  [R.spireKnob, H.knob0],
  [R.knob, H.knob1], // knop
  [R.knob, H.knob2],
  [R.needle, H.needleFoot],
  [0.0001, H.top], // naald
]);

// ---------- vensters en deur als blinde nissen ----------
// Deur (1,3 m, boog) aan de oost-zuidoostkant, waar de luchtfoto een stoep toont; de stand is onzeker.
const DOOR_DEG = -13;
const door = place(archNiche(R.foot - 0.05, 1.3, 0, 2.2), { deg: DOOR_DEG });
// Twaalf kleine vensters aan de voet (foto: 0,5 tot 1,4 m), behalve waar de deur zit.
const footWindows = around(shaftNiche(0.9, 0.5, 1.4), steps(12, 15).filter((d) => Math.abs(((d - DOOR_DEG + 540) % 360) - 180) > 20));
// Vier kolommen spleetvensters van het trappenhuis op drie hoogtes (foto: 0,3 m breed; hier 0,9 m).
const slits = [[6.8, 8.8], [13.4, 15.4], [20.0, 22.0]].flatMap(([z0, z1]) => around(shaftNiche(0.9, z0, z1), steps(4, 45)));
// Acht vensters halverwege (foto 27,0 tot 28,4 m) en twaalf kleine vensters onder het dak (35,2 tot 36,2 m).
const midWindows = around(shaftNiche(0.9, 27.0, 28.4), steps(8));
const topWindows = around(shaftNiche(0.9, 35.2, 36.2), steps(12, 15));
// Lantaarn: zes openingen tussen de kolommetjes, als nis.
const lanternBays = around(niche(R.lantern, 0.9, H.cone + 0.15, H.lantern - 0.35, 0.3), steps(6, 30));

const all = tower.subtract(union([door, ...footWindows, ...slits, ...midWindows, ...topWindows, ...lanternBays]));

await writeLandmark({
  slug: "watertoren-dirksland",
  base: BASE,
  nodes: [["building:watertoren-schacht-hoeddak-lantaarn-en-spits", all]],
  catalog: {
    name: "Watertoren Dirksland",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, 7.5], [0, -7.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0504100001641890"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-voetafdruk (straal 5,93 m) op het maaiveld (NAP +0,52 m), X-as naar RD-oost. Ronde bakstenen schacht die verjongt tot 5,55 m op 36,95 m, met kleine vensters aan de voet, een deur, vier kolommen spleetvensters, acht vensters op 27 m en twaalf onder het dak als nissen; hoeddak met een kraag van 45 graden tot de boeiboord van 15,4 m (39,15 tot 40,1 m, AHN), koperen kegel van 28 graden tot 43,15 m, lantaarn met zes openingen, kraag op 45,75 m, spits met knop op 56,75 m en naald tot 62,0 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: "1939-1941",
      architect: "J. Gerber",
      rijksmonument: 525002,
      publishedHeightM: 62.5,
      reservoirM3: 575,
      newRoof: 1993,
      ahnGroundNapM: GROUND_NAP,
      ahnBrimNapM: 40.5,
      ahnConeTopNapM: 43.7,
      ahnSpireFootNapM: 47.4,
      ahnSpireNapM: 59.6,
      footDiameterM: 2 * R.foot,
      shaftTopDiameterM: 2 * R.shaftTop,
      brimDiameterM: 2 * R.brim,
      brimM: [H.brimSoffit, H.brim],
      coneTopM: H.cone,
      lanternM: [H.cone, H.collarTop],
      knobM: H.knob1,
      topM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Dirksland) (1939-1941, J. Gerber, 62,50 m, 575 m³, nieuw dak 1993)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/525002",
      "Wikimedia Commons: Overzicht met omgeving - Dirksland - 20338063 - RCE.jpg; Overzicht watertoren met omgeving - Dirksland - 20353450 - RCE.jpg; Dirksland - Watertoren.jpg; Watertoren Dirksland.jpg; Netherlands-Dirksland-watertower.jpg",
      "PDOK BAG-pand 0504100001641890, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

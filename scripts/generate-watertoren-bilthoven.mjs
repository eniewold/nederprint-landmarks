// Watertoren van Bilthoven aan de Burgemeester van der Borchlaan, in de bossen ten noorden van het openluchtbad. Gebouwd
// in 1926-1927 naar ontwerp van H.F. Mertens (die ook de torens van Soest, Stadskanaal en Oude Pekela ontwierp), naar
// een idee uit 1912 van Michel de Klerk; 42,00 m hoog, reservoir van 300 m³ (Wikipedia), sinds 2008 gemeentelijk
// monument, in 2006 door Vitens gerenoveerd (de pleisterlaag van 1998 is weer schoon metselwerk) en buiten gebruik.
// Een ronde, slanke toren van baksteen met vier steunberen op de diagonalen, die van het maaiveld tot vlak onder de top
// doorlopen en in twee treden versprongen zijn. Onderaan een iets bredere voet met vensters tussen de steunberen en aan
// de straatzijde (zuidwest) een portaal tegen de voet van een steunbeer. Het reservoir kraagt boven een lichte betonnen
// ring iets uit en draagt twee banden van uitstekende blokken met kleine vensters ertussen; een derde band zit vlak
// onder de betonnen dakrand met een opstaande, afgeronde rand rond een vlak dak (nu met een antennemast).
//
// Oorsprong op het hart van het ronde BAG-pand 0310100000657245 (cirkel door 38 punten, straal 4,69 m) op het maaiveld:
// AHN-DTM NAP +5,2 (ring van 6 tot 10 m: 5,1 tot 5,26). De steunberen staan in de BAG als vier stompjes van 1,7 m breed
// tot 5,35 m van het hart (drie als eigen pand 0310100000657246, -247 en -248, één in het hoofdpand) op RD-richtingen
// 40, 129, 220 en 310 graden. +X wijst naar RD-richting -5 graden (oost), zodat de steunberen op 45 + 90k graden lokaal
// staan; het portaal staat tegen de zuidwestelijke steunbeer (lokaal 225 graden), aan de kant van de straat en het pad.
// Maten: de top uit het AHN-DSM 0,5 m (dak NAP +47,5, dus 42,3 m boven het maaiveld; rand tot +47,9; het vlakke dak
// beslaat 188 cellen, straal 3,9 à 4,0 m, de rand dus circa 4,3 à 4,45 m); hoogtes van de geledingen uit de RCE-foto
// "Bakstenen watertoren met vier steunberen - Bilthoven - 20370893 - RCE.jpg" (1998, perspectiefgecorrigeerd, 41,8 px/m
// tussen het maaiveld en de dakrand: reservoirring 30,9 m, top van de steunberen 39,2 m, voet tot 4,3 m); de banden van
// blokken uit "Watertoren-bilthoven-2012.jpg" en "Watertoren Bilthoven.jpg" (Commons), verdeeld over de hoogte van het
// reservoir; de breedtes van schacht en reservoir uit de silhouetbreedte op de RCE-foto (8,4 m tussen de steunberen).
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [143477.67, 460403.47];
const AXIS_DEG = -5;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 5.2;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 48,61, west 48,49, noord 48,54, zuid 48,49),
// gemeten 2026-11-06; het terrein is vlak (hart 48,64, op 6 tot 10 m 48,07 tot 48,64).
const GROUND_ELLIPSOID = 48.49;

// Omwenteling van een gesloten profiel [[r, z], ...] (r = 0 op de as voor een massief).
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Massief onder een profiel van onder naar boven, gesloten langs de as.
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder
// 56 graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);

// ---------- hoogtes boven het maaiveld (NAP +5,2) ----------
const H = {
  foot: 4.3, // bovenkant van de voet (schouder, 50 graden naar de schacht)
  ring: [30.9, 31.35], // lichte betonnen ring onder het reservoir
  bands: [34.45, 38.2, 40.8], // banden van blokken (onderkant van de blokken)
  bandH: 0.6,
  pierTop: 39.8, // steunbeer: bovenkant tegen het reservoir, loopt naar buiten af tot 39,2
  stripTop: 39.2, // voorste trede van de steunbeer, loopt af tot 38,7
  rim: [41.75, 42.15], // betonnen dakrand
  roof: 42.3, // vlak dak (AHN NAP +47,5)
  rimTop: 42.5, // opstaande rand (AHN tot NAP +47,9)
};
// Stralen.
const R = {
  foot: 4.69, // BAG-cirkel
  shaft: 3.95,
  ring: 4.42,
  reservoir: 4.28,
  block: 0.25, // uitsteek van de blokken
  rim: 4.45,
  pier: 4.9, // binnenste trede van de steunbeer (2,4 m breed)
  strip: 5.35, // voorste trede (1,6 m breed), BAG-stompjes tot 5,3 à 5,4 m
};
const PIER_W = 2.4;
const STRIP_W = 1.6;
const BUTTRESSES = every(4, 45);
const BAYS = every(4, 0); // tussen de steunberen
const PORCH_DEG = 225;

// ---------- voet en schacht ----------
const foot = solidRev([[R.foot, BASE], [R.foot, H.foot], [R.shaft - 0.01, H.foot + 1.2 * (R.foot - R.shaft) + 0.01]]);
const shaft = solidRev([[R.shaft, H.foot], [R.shaft, H.ring[0] + 0.05]]);
// Twee vensters per veld in de voet (1,0 m breed, 0,9 tot 2,5 m), als nis.
const footWindows = union([
  ...around(niche(R.foot, 1.0, 0.9, 2.5, 0.3, -0.9), BAYS),
  ...around(niche(R.foot, 1.0, 0.9, 2.5, 0.3, 0.9), BAYS),
]);

// ---------- reservoir ----------
// Betonnen ring met een onderkant van 50 graden vanaf de schacht, daarop de trommel en de dakrand.
const ringZ0 = H.ring[0] - 1.2 * (R.ring - R.shaft);
const reservoir = solidRev([
  [R.shaft, ringZ0 - 0.01], [R.ring, H.ring[0]], [R.ring, H.ring[1]], [R.reservoir, H.ring[1]],
  [R.reservoir, H.rim[0] - 1.2 * (R.rim - R.reservoir)], [R.rim, H.rim[0]], [R.rim, H.rim[1]],
  [R.rim - 0.12, H.rimTop - 0.1], [R.rim - 0.3, H.rimTop], [3.95, H.rimTop], [3.8, H.roof],
]);
// Banden: twintig blokken van 0,8 m breed en 0,6 m hoog die 0,25 m uitsteken (onderkant 50 graden), in de onderste twee
// banden met tussen de blokken een klein venster (0,5 m breed, 0,45 m hoog) als nis.
const block = (z0) => {
  const a = R.reservoir - 0.1, o = R.reservoir + R.block, zb = z0 - 1.2 * (o - a);
  return hull([[a, -0.4, zb], [a, 0.4, zb], [o, -0.4, z0], [o, 0.4, z0], [a, -0.4, z0 + H.bandH], [a, 0.4, z0 + H.bandH], [o, -0.4, z0 + H.bandH], [o, 0.4, z0 + H.bandH]]);
};
const BAND_N = 20;
const bandBlocks = union(H.bands.flatMap((z) => around(block(z), every(BAND_N, 0))));
// De bovenste band krijgt geen vensternissen: de strook metselwerk tussen de nis en de dakrand (0,2 m) is dunner dan de
// export als drager toestaat en werd in de nissen opgevuld.
const bandWindows = union(H.bands.slice(0, 2).flatMap((z) => around(niche(R.reservoir, 0.5, z + 0.08, z + 0.53, 0.2), every(BAND_N, 180 / BAND_N))));

// ---------- steunberen (gebouwd op lokaal 0 graden, radiaal = +X) ----------
// Binnenste trede 2,4 m breed tot 4,9 m, voorste trede 1,6 m breed tot 5,35 m; de bovenkanten lopen onder 45 graden
// naar buiten af. In de voorste trede lange blinde nissen (0,6 m breed) voor de trapvensters.
const slab = (r0, r1, w, zTopIn, zTopOut) => hull([
  [r0, -w / 2, BASE], [r0, w / 2, BASE], [r1, -w / 2, BASE], [r1, w / 2, BASE],
  [r0, -w / 2, zTopIn], [r0, w / 2, zTopIn], [r1, -w / 2, zTopOut], [r1, w / 2, zTopOut],
]);
const pier = slab(3.6, R.pier, PIER_W, H.pierTop, H.pierTop - (R.pier - R.reservoir));
const stripPart = slab(R.pier - 0.1, R.strip, STRIP_W, H.stripTop, H.stripTop - (R.strip - R.pier + 0.1));
const SLOTS = [[5.6, 8.6], [10.6, 13.6], [15.6, 18.6], [20.6, 23.6], [25.6, 28.6], [31.6, 34.6]];
const slots = union(SLOTS.map(([z0, z1]) => niche(R.strip, 0.6, z0, z1, 0.25)));
const buttress = union([pier, stripPart]).subtract(slots);

// ---------- portaal (tegen de steunbeer op lokaal 225 graden, gebouwd op 0 graden) ----------
// 3,2 m breed tot 5,6 m van het hart, 3,6 m hoog met een plat dak en een smallere opstand tot 4,0 m; de deur (1,1 m
// breed, tot 2,4 m) als nis in de voorgevel, naast de steunbeer.
const PORCH = { r0: 3.9, r1: 5.6, w: 3.2, top: 3.6 };
const porch = union([
  box(PORCH.r0, -PORCH.w / 2, BASE, PORCH.r1, PORCH.w / 2, PORCH.top),
  box(PORCH.r0, -STRIP_W / 2 - 0.3, BASE, PORCH.r1 - 0.3, STRIP_W / 2 + 0.3, 4.0),
]).subtract(niche(PORCH.r1, 1.1, 0, 2.4, 0.22, 0.95));

const tower = union([
  union([foot, shaft]).subtract(footWindows),
  union([reservoir, bandBlocks]).subtract(bandWindows),
  ...around(buttress, BUTTRESSES),
  place(porch, { deg: PORCH_DEG }),
]);

await writeLandmark({
  slug: "watertoren-bilthoven",
  base: BASE,
  nodes: [["building:watertoren-voet-schacht-steunberen-reservoir-en-dakrand", tower]],
  catalog: {
    name: "Watertoren Bilthoven",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: [
      "NL.IMBAG.Pand.0310100000657245",
      "NL.IMBAG.Pand.0310100000657246",
      "NL.IMBAG.Pand.0310100000657247",
      "NL.IMBAG.Pand.0310100000657248",
    ],
    description:
      "Oorsprong op het hart van het ronde BAG-pand op het maaiveld (NAP +5,2 m), +X naar RD-richting -5 graden (oost), steunberen op 45 + 90k graden lokaal, portaal op 225 graden (zuidwest, straatzijde). Voet van 9,4 m met vensters tot 4,3 m; schacht van 7,9 m; vier steunberen in twee treden tot 5,35 m van het hart en 39,2 à 39,8 m hoog, met lange nissen; betonnen ring op 30,9 m, reservoir van 8,56 m met drie banden van twintig blokken en kleine vensters; betonnen dakrand van 8,9 m met opstaande rand tot 42,5 m rond een vlak dak op 42,3 m (AHN). Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: "1926-1927",
      architect: "H.F. Mertens",
      publishedHeightM: 42,
      reservoirM3: 300,
      monument: "gemeentelijk monument (2008)",
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 47.5,
      ahnRimNapM: 47.9,
      footDiameterM: R.foot * 2,
      shaftDiameterM: R.shaft * 2,
      reservoirDiameterM: R.reservoir * 2,
      rimDiameterM: R.rim * 2,
      buttressDepthM: R.strip,
      buttressWidthM: [PIER_W, STRIP_W],
      ringM: H.ring,
      bandsM: H.bands,
      roofM: H.roof,
      topM: H.rimTop,
      photoScalePxPerM: 41.8,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Bilthoven) (1926-1927, H.F. Mertens, 42,00 m, 300 m³, Burgemeester van der Borchlaan, Vitens, gerenoveerd 2006, gemeentelijk monument 2008)",
      "https://commons.wikimedia.org/wiki/File:Bakstenen_watertoren_met_vier_steunberen_-_Bilthoven_-_20370893_-_RCE.jpg (1998, perspectiefgecorrigeerd: geledingen, steunberen, reservoir, schaal 41,8 px/m)",
      "https://commons.wikimedia.org/wiki/File:Watertoren-bilthoven-2012.jpg (vanaf de straat: banden van blokken, steunberen met nissen, voet met vensters en portaal)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Bilthoven.jpg (dakrand, banden en vensters, steunberen in twee treden, portaal)",
      "PDOK BAG-panden 0310100000657245 tot -248, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

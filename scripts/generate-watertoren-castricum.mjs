// Watertoren van het psychiatrisch ziekenhuis Duin en Bosch in Castricum (Watertorenpad), 1908-1909, ontwerp
// J. Scholtens (hoofdingenieur Provinciale Waterstaat Noord-Holland), reservoir van F.A. Neuman (Eschweiler);
// rijksmonument 524182. Volgens het register 33,5 m hoog: een achthoekig, taps basement van bruinrode waalsteen met
// een getoogde deur in de zuidzijde en getoogde vensters aan drie zijden, een gepleisterde waterlijst boven een fries,
// een taps toelopende ronde schacht van rode baksteen met tien kleine getoogde vensters (oost en west drie boven
// elkaar, noord en zuid twee), een geklonken ijzeren reservoir van 5 m doorsnede en 50 m³ (bodem type Intze) in een
// stalen ommanteling (1936) met een omloop (1965), en een flauw kegeldak met overstek en een lantaarn. Na de
// restauratie van 2019-2021 is de toren een hotelkamer; daarvoor is het dak opgetild, met een glazen strook tussen
// mantel en dak.
//
// Oorsprong op het midden van de ronde BAG-contour (pand 0383100000005733, straal 3,93 m: de hoeken van het
// achtkant) op de voet van de toren (AHN-DTM NAP +4,4 tot +4,5 op 4 tot 6 m uit het hart; gebruikt +4,45).
// +X is RD-oost; de vlakken van het achtkant staan op de windrichtingen (deur in de zuidzijde, -Y).
//
// Maten. Plattegrond: BAG-cirkel = achtkant over de hoeken (7,86 m, apothema 3,63); schachtvoet 6,4 m (luchtfoto:
// 6,3 m baksteen boven de waterlijst; foto 1394: 435/515 van het achtkant over de hoeken); dakrand r 4,3 (luchtfoto
// 8 cm, het dak staat er 5,1 m te ver naar het noorden: circa 30 m hoog). Hoogtes: schachttop NAP +28,5 = 24,1 m
// (AHN-DSM uit 2020, toen het reservoir en het dak voor de restauratie weg waren: de ring van de schachttop op
// 24,0 tot 24,3 m); foto 1394 (2006, verticale schaal vrijwel gelijk over de hoogte: de schacht is boven en onder
// 32 px/m) geeft 24,3 m en een basement van 4,5 m. Reservoir en dak uit twee foto's geschaald op de mantel (6,15 m =
// 1,56 maal de schachttop): RCE 20284731 (vóór de restauratie: omloop 1,3 m boven de schachttop) en de dronefoto van
// NH Nieuws (2026: mantel van de omloop tot de glazen strook 3,6 m, glas 0,67 m, dakrand 0,42 m, dak 1,85 m,
// lantaarn 0,4 m). De 3D BAG (AHN5, 2022) geeft 31,9 m boven maaiveld als 70e percentiel van het dak, het model op
// r 2,1 31,4 m.
import { hull, ring3, circle, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [104731.91, 508169.17];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 4.45; // AHN-DTM 4,4 tot 4,5 op 4 tot 6 m uit het hart
const GROUND_ELLIPSOID = 47.21; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (47,21 tot 47,87)
const SEG = 64;
const C8 = Math.cos(Math.PI / 8);

// ---------- maten ----------
const R = {
  plinth: 3.63, // apothema van het achtkant aan de voet (BAG-cirkel 3,93 over de hoeken)
  plinthTop: 3.55, // apothema onder de waterlijst (taps, foto: 500/515)
  ledge: 3.65, // apothema van de gepleisterde waterlijst
  shaftFoot: 3.2, // schacht boven de waterlijst (6,4 m)
  shaftTop: 1.97, // schacht onder de fries (3,95 m)
  frieze: 0.12, // uitsprong van de bovenste fries
  casing: 3.08, // stalen mantel (6,15 m)
  gallery: 3.8, // buitenrand van de omloop (1,23 maal de mantel)
  eave: 4.3, // dakrand (luchtfoto)
  lantern: 0.45,
};
const H = {
  plinthTop: 4.35, // bovenkant van het achtkant onder de waterlijst
  ledgeTop: 4.6,
  shaftFoot: 5.0, // waterlijst sluit aan op de schacht
  friezeFoot: 22.25, // onderkant van de bovenste fries (1,85 m onder de schachttop)
  shaftTop: 24.1, // AHN-DSM 2020
  gallery: 25.95, // vloer van de omloop (foto's 25,6; opgetild zodat de kraag onder 45 graden blijft)
  soffit: 28.66, // begin van de schuine dakonderkant tegen de mantel
  eaveFoot: 29.88, // onderkant van de dakrand
  eave: 30.3, // bovenkant van de dakrand
  apex: 32.15, // top van de kegel onder de lantaarn
  lanternTop: 32.55,
};
const shaftR = (z) => R.shaftFoot - ((R.shaftFoot - R.shaftTop) * (z - H.shaftFoot)) / (H.shaftTop - H.shaftFoot);
const oct = (apothem, z) => ring3(circle([0, 0], apothem / C8, 8, Math.PI / 8), z); // vlakken op de windrichtingen
const ring = (r, z, n = SEG) => ring3(circle([0, 0], r, n), z);

// ---------- basement en waterlijst ----------
const plinth = hull([...oct(R.plinth, BASE), ...oct(R.plinth, 0), ...oct(R.plinthTop, H.plinthTop)]);
// Waterlijst: 0,1 m uit het achtkant met een onderkant van 45 graden, daarboven een schuine afdekking naar de schacht.
const ledge = hull([...oct(R.plinthTop, H.plinthTop - 0.1), ...oct(R.ledge, H.plinthTop), ...oct(R.ledge, H.ledgeTop), ...ring(R.shaftFoot, H.shaftFoot)]);

// ---------- schacht en bovenste fries ----------
const shaft = hull([...ring(shaftR(H.ledgeTop), H.ledgeTop), ...ring(shaftR(H.shaftTop), H.shaftTop + 0.05)]);
const frieze = hull([
  ...ring(shaftR(H.friezeFoot - R.frieze), H.friezeFoot - R.frieze),
  ...ring(shaftR(H.friezeFoot) + R.frieze, H.friezeFoot),
  ...ring(shaftR(H.shaftTop) + R.frieze, H.shaftTop),
]);

// ---------- reservoir: Intze-bodem, omloop, mantel ----------
// Intze-bodem en omloop als één kraag van 45 graden: van de schachttop (r 2,09) naar de buitenrand van de omloop (r 3,8),
// met een vloerrand van 0,15 m; de bodem loopt in het echt bol uit naar de mantel en de omloop kraagt erboven uit.
const gallery = hull([
  ...ring(shaftR(H.shaftTop) + R.frieze, H.shaftTop - 0.01),
  ...ring(R.gallery, H.shaftTop + R.gallery - shaftR(H.shaftTop) - R.frieze),
  ...ring(R.gallery, H.gallery),
]);
const casing = hull([...ring(R.casing, H.gallery - 0.05), ...ring(R.casing, H.eaveFoot + 0.05)]);

// ---------- dak ----------
// Dakonderkant onder 45 graden van de mantel naar de dakrand (de glazen strook valt erachter), dakrand van 0,42 m,
// kegeldak in zestien vlakken (luchtfoto) en een achtkante lantaarn.
const soffit = hull([...ring(R.casing, H.soffit), ...ring(R.eave, H.eaveFoot)]);
const fascia = hull([...ring(R.eave, H.eaveFoot), ...ring(R.eave, H.eave)]);
const roof = hull([...ring3(circle([0, 0], R.eave, 16, Math.PI / 16), H.eave - 0.01), ...ring3(circle([0, 0], R.lantern, 16, Math.PI / 16), H.apex)]);
const lantern = hull([...ring3(circle([0, 0], R.lantern, 8, Math.PI / 8), H.apex - 0.3), ...ring3(circle([0, 0], R.lantern, 8, Math.PI / 8), H.lanternTop - 0.15), [0, 0, H.lanternTop]]);

// ---------- deur en vensters als nissen ----------
// Nis in een vlak met normaal +X op afstand f: binnenkant `depth` erachter, plafond onder 56 graden naar binnen
// oplopend, zoals bij de watertoren van Aalsmeer.
const niche = (f, wd, z0, z1, depth) => {
  const a = f - depth, b = f + 1.5, za = z1 + 1.5 * depth, y0 = -wd / 2, y1 = wd / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 2.25], [b, y1, z1 - 2.25]]);
};
const compass = (k) => 90 - k; // kompasrichting → lokale hoek (linksom vanaf oost)
const cuts = [];
// Deur in de zuidzijde, 1,3 m breed tot 2,7 m, 0,4 m diep; getoogde vensters van 1,1 m (1,3 tot 3,4 m) aan de
// noord-, oost- en westzijde van het basement.
const plinthFace = (z) => R.plinth - ((R.plinth - R.plinthTop) * z) / H.plinthTop;
cuts.push(place(niche(plinthFace(1.35), 1.3, 0, 2.7, 0.4), { deg: compass(180) }));
for (const k of [0, 90, 270]) cuts.push(place(niche(plinthFace(2.35), 1.1, 1.3, 3.4, 0.3), { deg: compass(k) }));
// Schachtvensters: oost en west drie boven elkaar, noord en zuid twee (register), 0,85 m breed en 1,1 m hoog tot
// de aanzet, als nis van 0,3 m met een spitse top van 55 graden (het segmentboogje is kleiner dan 0,9 m). Op de tapse
// schacht ligt de achterwand 0,3 m binnen de wand op de hoogte van de aanzet.
const pointedNiche = (f, wd, z0, z1, depth = 0.3) => {
  const apex = z1 + (wd / 2) * Math.tan((55 * Math.PI) / 180);
  return hull([-wd / 2, wd / 2].flatMap((y) => [[f - depth, y, z0], [f + 1.0, y, z0], [f - depth, y, z1], [f + 1.0, y, z1]])
    .concat([[f - depth, 0, apex], [f + 1.0, 0, apex]]));
};
const shaftWindow = (k, z) => place(pointedNiche(shaftR(z + 1.1), 0.85, z, z + 1.1), { deg: compass(k) });
for (const k of [90, 270]) for (const z of [8.5, 13.5, 18.5]) cuts.push(shaftWindow(k, z));
for (const k of [0, 180]) for (const z of [11.0, 16.0]) cuts.push(shaftWindow(k, z));

const tower = union([plinth, ledge, shaft, frieze, gallery, casing, soffit, fascia, roof, lantern]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-castricum",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:basement-schacht-reservoir-en-kegeldak", tower]],
  catalog: {
    name: "Watertoren Castricum",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: Array.from({ length: 8 }, (_, k) => [+(4.5 * Math.cos((k * Math.PI) / 4)).toFixed(2), +(4.5 * Math.sin((k * Math.PI) / 4)).toFixed(2)]),
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0383100000005733"],
    description:
      "Oorsprong op het midden van de ronde BAG-contour op de voet (NAP +4,45 m), +X naar RD-oost, deur in de zuidzijde (-Y). Achthoekig taps basement van 7,3 m over de vlakken tot 4,6 m met deur, drie vensters en een waterlijst; taps ronde schacht van 6,4 tot 3,95 m met tien vensternissen en een fries tot 24,1 m; Intze-bodem met omloop op 25,95 m (kraag onder 45 graden) en stalen mantel van 6,15 m; opgetild kegeldak in zestien vlakken met overstek (8,6 m) van 30,3 tot 32,15 m en een lantaarn tot 32,55 m. Maten uit BAG, AHN, luchtfoto, register en foto's.",
    realWorld: {
      registerHeightM: 33.5,
      reservoirM3: 50,
      reservoirDiameterM: 5,
      built: "1908-1909",
      engineer: "J. Scholtens",
      monument: 524182,
      ahnGroundNapM: GROUND_NAP,
      ahnShaftTopNapM: 28.5,
      bag3dRoof70pAboveGroundM: 31.9,
      plinthAcrossFlatsM: 2 * R.plinth,
      shaftDiameterM: [2 * R.shaftFoot, 2 * R.shaftTop],
      casingDiameterM: 2 * R.casing,
      galleryDiameterM: 2 * R.gallery,
      eaveDiameterM: 2 * R.eave,
      plinthTopM: H.ledgeTop,
      shaftTopM: H.shaftTop,
      galleryM: H.gallery,
      eaveM: H.eave,
      apexM: H.apex,
      modelTopM: H.lanternTop,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Castricum) (1908, 33,4 m, 50 m³)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/524182 (J. Scholtens, achthoekig taps basement met deur zuid en vensters aan drie zijden, waterlijst en fries, taps ronde schacht met tien vensters, reservoir 5 m en 50 m³ type Intze, ommanteling 1936, omloop 1965, flauw kegeldak met overstek en lantaarn, 33,5 m)",
      "https://commons.wikimedia.org/wiki/File:Castricum_Watertoren_1394.JPG (2006: basement, waterlijst, schacht, verhoudingen over de hele hoogte)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Castricum_-_20284731_-_RCE.jpg (Intze-bodem, omloop, mantel en dak vóór de restauratie)",
      "Dronefoto bij https://www.nhnieuws.nl/nieuws/361510/slapen-op-grote-hoogte-in-monumentale-watertoren (2026: opgetild dak met glazen strook, verhoudingen van mantel, dak en lantaarn)",
      "PDOK BAG-pand 0383100000005733 (ronde contour r 3,93 m), AHN DSM/DTM 0,5 m en luchtfoto 8 cm, 3D BAG (AHN5 2022), 2026-11-04",
    ],
  },
});

// Watertoren De Reus van Schimmert (Jos Wielders, 1927, Amsterdamse School),
// 38 m hoog, hoogste punt NAP +178 m, vlakbodemreservoir van 1150 m³ (13,5 m
// binnenwerks). Een zestienzijdige bakstenen schacht met lisenen op de hoeken,
// een rond reservoir dat 1,3 m uitkraagt op een afgeronde onderrand, met twee
// vensterbanden tussen uitstekende lijsten, een borstwering met een omloop,
// een terugliggende glazen torenkamer onder een vlak kegeldak met overstek, en
// aan de zuidzijde twee ronde trappenhuizen die met een kopwand boven het dak
// uitsteken; tussen hun voeten een lage aanbouw met platte daken.
// Oorsprong op de as van het reservoir: de top van het kegeldak in het
// AHN4-DSM (rond het hart van de BAG-cirkel, 0,1-0,2 m ernaast), op het plateau
// rond de voet (AHN-DTM NAP +140,0 m). Gebouwstelsel: +X 12,5 graden linksom
// van RD-oost, -Y naar het zuidzuidoosten, de symmetrielijn tussen de
// trappenhuizen; de zuidgevel van de aanbouw (de grens met BAG-pand 3113) loopt
// in dit stelsel precies langs X. Hoogtes uit het AHN4-DSM en de 3D BAG (AHN5):
// kegeltop NAP +176,4, dakrand +173,4, omloop +170,9, trappenhuizen +178,6 en
// +177,4, aanbouw +143,3..146,5. De bandindeling uit de telefoto "Schimmert-
// Watertoren (1)" (vrijwel horizontaal van opzij, 50,9 px/m, geschaald op de
// diameter van het reservoir); de diameters uit de RCE-foto 20197530 (19,8 px/m,
// geschaald op het trappenhuis uit de BAG, r 1,55 m, en de hoogte).
import { Manifold, CrossSection, hull, prism, circle, union, place, box, writeLandmark } from "./efteling-kit.mjs";

const DEG = 12.5;
const ORIGIN = [185741.33, 323226.15];
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(4), +Math.sin((DEG * Math.PI) / 180).toFixed(4)];
// Dieper dan gewoonlijk: de toren staat op een heuvel; naast de aanbouw ligt het maaiveld 0,3-0,45 m lager dan bij de schacht.
const BASE = -0.6;
const R = {
  shaft: 7.15, // apothema van de zestienhoek (BAG-cirkel r 7,05, gat in het AHN-DTM r 7,3)
  rib: 7.5, // buitenkant van de lisenen op de hoeken
  plinth: 7.65, // apothema van de plint
  tank: 8.45, // reservoir (16,9 m op de RCE-foto)
  roll: 7.85, // begin van de afgeronde onderrand
  ledge: 8.7, // uitstekende lijsten van de vensterbanden
  strip: 8.25, // terugliggende vensterband
  parapetIn: 7.55, // binnenkant van de borstwering
  glass: 6.2, // glazen torenkamer
  eaves: 7.8, // dakrand van het kegeldak
  stair: 1.55, // trappenhuizen (BAG-cirkel)
};
const H = {
  under: 21.0, // onderkant van het reservoir
  rollTop: 21.7,
  band1: 23.5, // bovenkant van de onderste lijst van de onderste vensterband
  band2: 28.9,
  parapet: 31.9, // borstwering
  walk: 30.9, // omloop (3D BAG NAP +170,7..171,1)
  eavesLow: 33.0,
  eaves: 33.35, // dakrand (3D BAG NAP +173,3..173,7)
  apex: 36.4, // top van het kegeldak (AHN4 NAP +176,4, 3D BAG +176,7)
  stairW: 38.6, // westelijk trappenhuis (3D BAG NAP +178,6)
  stairE: 37.4, // oostelijk trappenhuis (3D BAG NAP +177,4)
  wall: 38.1, // kopwand tussen de trappenhuizen
};
const STAIR_W = [-5.95, -6.55];
const STAIR_E = [5.97, -6.6];
const N = 16; // zijden van de schacht
const SLOPE = 1.5; // 56 graden: onderkanten van lijsten en plafonds van nissen

// ---------- schacht: zestienhoek met lisenen en een plint ----------
const poly = (apothem, phaseDeg = 90 + 180 / N) =>
  Array.from({ length: N }, (_, k) => {
    const t = ((phaseDeg + (360 * k) / N) * Math.PI) / 180, rc = apothem / Math.cos(Math.PI / N);
    return [rc * Math.cos(t), rc * Math.sin(t)];
  });
const shaft = prism(poly(R.shaft), BASE, H.under + 0.3);
const ribs = union(Array.from({ length: N }, (_, k) =>
  place(box(R.shaft - 0.3, -0.5, BASE, R.rib, 0.5, H.under + 0.3), { deg: 90 + 180 / N + (360 * k) / N })));
// Plint tot 1,0 m, met een schuine bovenkant terug naar de lisenen.
const plinth = hull([...poly(R.plinth).map(([x, y]) => [x, y, BASE]), ...poly(R.plinth).map(([x, y]) => [x, y, 1.0]),
  ...poly(R.rib - 0.2).map(([x, y]) => [x, y, 1.6])]);

// ---------- reservoir, borstwering, torenkamer en kegeldak als één omwentelingsprofiel ----------
const roll = Array.from({ length: 7 }, (_, k) => {
  const t = ((k + 1) / 8) * (Math.PI / 2);
  return [R.roll + (R.tank - R.roll) * Math.sin(t), H.rollTop - (H.rollTop - H.under) * Math.cos(t)];
});
// Vensterband: onderste lijst (onderkant onder 56 graden), terugliggende band van 0,6 m, plafond onder 56 graden
// naar de bovenste lijst van 0,2 m.
const band = (zb) => {
  const z1 = zb + 0.6, z2 = z1 + (R.ledge - R.strip) * SLOPE;
  return [[R.tank, zb - (R.ledge - R.tank) * SLOPE], [R.ledge, zb], [R.strip, zb], [R.strip, z1], [R.ledge, z2], [R.ledge, z2 + 0.2], [R.tank, z2 + 0.2]];
};
const tank = Manifold.revolve(
  new CrossSection([[
    [0, H.under], [R.roll, H.under], ...roll, [R.tank, H.rollTop],
    ...band(H.band1), ...band(H.band2),
    [R.tank, H.parapet], [R.parapetIn, H.parapet], [R.parapetIn, H.walk], [R.glass, H.walk], [R.glass, H.eavesLow],
    [R.eaves, H.eavesLow], [R.eaves, H.eaves], [0, H.apex],
  ]]),
  128,
);

// ---------- trappenhuizen en kopwand ----------
// Cilinder met een ring vensters in de kop (0,3 m diep, plafond onder 56 graden), vanaf de grond; een verbindingsmuur
// naar de schacht (in de BAG-contour dicht).
const stair = ([cx, cy], top) => {
  const zr0 = top - 2.6, zr1 = top - 0.9 - 0.3 * SLOPE;
  const body = Manifold.revolve(new CrossSection([[
    [0, BASE], [R.stair, BASE], [R.stair, zr0], [R.stair - 0.3, zr0], [R.stair - 0.3, zr1], [R.stair, top - 0.9], [R.stair, top], [0, top],
  ]]), 48).translate([cx, cy, 0]);
  const d = Math.hypot(cx, cy), ux = cx / d, uy = cy / d, m = [ux * (d - 2.2), uy * (d - 2.2)];
  const link = hull([...circle([cx, cy], R.stair - 0.05, 24).flatMap(([x, y]) => [[x, y, BASE], [x, y, H.under + 0.3]]),
    ...circle(m, 1.2, 16).flatMap(([x, y]) => [[x, y, BASE], [x, y, H.under + 0.3]])]);
  return union([body, link]);
};
// Kopwand van 1,2 m dik tussen de trappenhuizen, vanaf de omloop tot 38,1 m (3D BAG NAP +178,6; AHN4 +177,5..178,5).
const headWall = box(STAIR_W[0], -5.7, H.walk - 0.6, STAIR_E[0], -4.5, H.wall);

// ---------- aanbouw tussen de voeten van de trappenhuizen ----------
// Voetafdruk uit de BAG-contour (zuidgevel y -10,18, de grens met pand 3113; west en oost langs de trappenhuizen), aan de
// noordkant tot in schacht en trappenhuizen, zodat er geen spleet tussen aanbouw, trappenhuis en schacht overblijft.
// Platte daken op de hoogtes van de 3D BAG-dakvlakken (NAP +143,3, +146,5, +143,9 en +143,4).
const annexFoot = prism([[-7.48, -10.18], [5.17, -10.18], [5.17, -6.6], [3.5, -5.5], [-3.5, -5.5], [-7.46, -6.55]], BASE, 6.5);
const annex = union([[-7.6, -6.1, 3.3], [-6.1, -1.5, 6.5], [-1.5, 2.4, 3.9], [2.4, 5.3, 3.4]].map(([x0, x1, z]) =>
  annexFoot.intersect(box(x0, -10.3, BASE, x1, -5, z))));

// ---------- vensters in de schacht ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + SLOPE * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Vlakken die vrij liggen (niet achter trappenhuis of aanbouw): 337,5 tot 202,5 graden.
const FREE = [-22.5, 0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5];
const windows = union(FREE.flatMap((deg) => [
  place(niche(R.shaft, 0.9, 18.4, 20.4), { deg }), // smalle hoge vensters onder het reservoir
  place(niche(R.shaft, 1.1, 3.2, 4.4), { deg }), // vierkante vensters boven de plint
]));

const tower = union([shaft, ribs, plinth, tank, stair(STAIR_W, H.stairW), stair(STAIR_E, H.stairE), headWall, annex]).subtract(windows);

await writeLandmark({
  slug: "watertoren-schimmert-de-reus-van-schimmert",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los reservoir zou een eigen voet tot de grondplaat krijgen.
  nodes: [["building:schacht-reservoir-trappenhuizen-en-aanbouw", tower]],
  catalog: {
    name: "Watertoren De Reus van Schimmert",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch: NAP 140,0 + 45,64 (NLGEO2018-geoïde op de oorsprong).
    groundHeight: 185.64,
    // Op het plateau net buiten de plint en naast de trappenhuizen (AHN NAP 139,95..140,30); de laagste (oost, naast het
    // oostelijke trappenhuis) bepaalt de hoogte. BASE -0,6 houdt de voet van de aanbouw, waar het maaiveld tot NAP +139,55
    // zakt, onder het terrein.
    groundSamplePoints: [[8.6, -3.5], [-8.6, -3.5], [6.5, 6.5], [-6.5, 6.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0951100000003112"],
    description:
      "Oorsprong op de as van het reservoir op het plateau rond de voet (NAP +140,0 m), +X 12,5 graden linksom van RD-oost, trappenhuizen naar het zuidzuidoosten (-Y). Zestienzijdige bakstenen schacht met lisenen, plint en twee rijen vensters, rond reservoir van 16,9 m op een afgeronde onderrand op 21 m met twee vensterbanden, borstwering en omloop op 31 m, glazen torenkamer onder een kegeldak tot 36,4 m, twee ronde trappenhuizen met een kopwand tot 37,4-38,6 m en een lage aanbouw met platte daken tussen hun voeten. Maten uit BAG, 3D BAG (AHN5), AHN en foto's.",
    realWorld: {
      publishedHeightM: 38,
      publishedTopNapM: 178,
      reservoirM3: 1150,
      reservoirInnerDiameterM: 13.5,
      ahnGroundNapM: 140.0,
      groundLowSideNapM: 139.55,
      geoidNlgeo2018M: 45.64,
      tankDiameterM: 16.9,
      shaftAcrossFlatsM: 14.3,
      shaftSides: N,
      stairDiameterM: 3.1,
      tankBottomM: H.under,
      windowBandsM: [H.band1, H.band2],
      parapetM: H.parapet,
      eavesM: H.eaves,
      roofApexM: H.apex,
      stairTopsM: [H.stairW, H.stairE],
      headWallM: H.wall,
      annexRoofsM: [3.3, 6.5, 3.9, 3.4],
      modelTopM: H.stairW,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Schimmert)",
      "https://commons.wikimedia.org/wiki/File:Schimmert-Watertoren_(1).JPG (telefoto van het noorden: bandindeling, torenkamer, kegeldak, kopwand)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_-_Schimmert_-_20197530_-_RCE.jpg (diameters van reservoir, schacht en trappenhuis, banden)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_-_Schimmert_-_20197529_-_RCE.jpg (zuidzijde: trappenhuizen, kopwand, aanbouw)",
      "https://commons.wikimedia.org/wiki/File:Schimmert_-_Watertoren_De_Reus_1.jpg (huidige toestand: schacht met lisenen en vensters, glazen balustrade)",
      "PDOK BAG-panden 0951100000003112 en 0951100000003113, 3D BAG (AHN5), AHN DSM/DTM 0,5 m, luchtfoto 8 cm en NLGEO2018, 2026-11-01",
    ],
  },
});

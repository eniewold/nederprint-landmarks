// Watertoren van 's-Gravendeel (Hoeksche Waard). Gebouwd in 1914 naar ontwerp van Visser en Smit, 35 m hoog, reservoir
// van 200 m³, gemeentelijk monument (Wikipedia). Een betonskelet met metselwerk: een ronde, licht taps toelopende
// bakstenen schacht op een voet met vier steunberen met natuurstenen afdekking; bovenaan twee banden, een getoogde
// consolezone waarop het reservoir uitkraagt, een ronde reservoirmantel met acht lisenen en per veld een smal venster,
// een kroonlijst en een borstwering waar de lisenen als pijlertjes boven uitsteken. Plat dak met een trappenhuisopbouw.
//
// Oorsprong op het hart van de ronde BAG-voetafdruk van pand 0585100001641941 (cirkelfit op 21 hoekpunten van de ronde
// wand, straal 4,84 m, afwijking hooguit 0,12 m). Lokale X-as 8 graden linksom van RD-oost, naar de deur (oostzijde,
// waar het pad uit de BGT/luchtfoto naartoe loopt); de vier steunberen staan dan op ±45 en ±135 graden (BAG: de
// noordwestelijke op 143,4 en de zuidwestelijke op 232,7 graden RD, dus 135,4 en 224,7 lokaal), de lisenen op k maal 45.
// Hoeken hieronder in graden linksom vanaf de lokale X-as. Maaiveld AHN-DTM NAP 0,0 rond de voet (west -0,1 tot 0,1,
// oost tot +0,4).
// Maten: dak (NAP +33,8) en borstwering (NAP +35,0 à +35,2) en de dakopbouw (NAP +35,5) uit het AHN-DSM 0,5 m; stralen uit
// de BAG (voet), het AHN (bovenkant tot circa 4,8 m) en verhoudingen op de enige foto "Gravendeel Watertoren 3595.JPG"
// (Commons, 2007, van het oosten-zuidoosten); hoogtes van de banden, consoles, ringen, vensters en steunberen uit die
// foto, verticaal geschaald op maaiveld en borstwering. De opbouwen op het dak uit de luchtfoto (Actueel_orthoHR).
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [102340.67, 420936.79];
const AXIS_DEG = 8;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.0;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 43,82, west 43,42, noord 43,78, zuid 43,60),
// gemeten 2026-11-06. Het PDOK-pand staat op 43,41.
const GROUND_ELLIPSOID = 43.42;

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
// Nis in een wand met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 56 graden op.
const niche = (f, w, z0, z1, depth = 0.35) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};

// ---------- hoogtes boven het maaiveld (NAP 0,0) ----------
const H = {
  buttressFace: 9.3, // voorkant van de steunberen, onder de schuine natuurstenen afdekking
  buttressTop: 10.6, // afdekking tegen de schacht
  shaftTop: 24.3, // onderste band (foto: dunne lijst)
  band: 25.0, // brede witte band
  bandTop: 26.0,
  drumKnee: 27.2, // consolezone; het reservoir kraagt daarboven onder 50 graden uit
  ringFoot: 27.62,
  ringTop: 28.2, // witte ring onder de reservoirmantel
  cornice: 33.5, // kroonlijst onder de borstwering
  roof: 33.8, // AHN: dak NAP +33,8
  parapet: 35.1, // AHN: borstwering NAP +35,0 à +35,2; Wikipedia 35 m
  pier: 35.45, // lisenen als pijlertjes boven de borstwering (foto)
  hatch: 35.5, // AHN: dakopbouw NAP +35,5
};
const R = {
  foot: 4.84, // BAG-cirkel
  shaftTop: 4.24, // foto: schacht onder de banden 0,88 maal het reservoir
  band1: 4.4,
  band2: 4.55,
  drumKnee: 4.7,
  ring: 5.05, // foto: breedste deel, 1,05 maal het reservoir
  reservoir: 4.8, // AHN: bovenkant tot circa 4,8 m van het hart
  cornice: 4.92,
  parapet: 4.65, // foto 0,97 maal het reservoir
  parapetInner: 3.75, // 0,9 m dik (in het echt dunner)
  lisene: 5.0,
};
const LISENE_W = 0.9;
const BUTTRESS = { w: 1.35, face: 6.15, faceTop: 5.2 }; // BAG: hoekpunten op 6,24 tot 6,35 m van het hart, 1,2 tot 1,45 m breed

// ---------- toren ----------
// Schacht, banden, consolezone, ring, reservoir, kroonlijst en borstwering in één omwentelingsprofiel; het dak ligt
// binnen de borstwering op 33,8 m.
const body = rev([
  [0, BASE], [R.foot, BASE], [R.foot, 0], [R.shaftTop, H.shaftTop],
  [R.band1, H.shaftTop + 0.2], [R.band1, H.band], [R.band2, H.band + 0.18], [R.band2, H.bandTop],
  [R.drumKnee, H.drumKnee], [R.ring, H.ringFoot], [R.ring, H.ringTop], [R.reservoir, H.ringTop],
  [R.reservoir, H.cornice - 0.15], [R.cornice, H.cornice], [R.cornice, H.roof], [R.parapet, H.roof],
  [R.parapet, H.parapet], [R.parapetInner, H.parapet], [R.parapetInner, H.roof], [0, H.roof],
]);
// Lisenen op het reservoir (acht, op k maal 45 graden), van de ring tot boven de borstwering.
const lisene = prism([[R.parapetInner + 0.3, -LISENE_W / 2], [R.lisene, -LISENE_W / 2], [R.lisene, LISENE_W / 2], [R.parapetInner + 0.3, LISENE_W / 2]], H.ringTop - 0.01, H.pier);
// Consoles in de consolezone onder elke lisene: een wig van de band tot de ring, onderkant 63 graden.
const console_ = hull([[4.3, -LISENE_W / 2, H.bandTop - 0.1], [4.3, LISENE_W / 2, H.bandTop - 0.1], [4.3, -LISENE_W / 2, H.ringFoot], [4.3, LISENE_W / 2, H.ringFoot],
  [R.ring, -LISENE_W / 2, H.ringFoot], [R.ring, LISENE_W / 2, H.ringFoot], [R.ring, -LISENE_W / 2, H.bandTop + 1.0], [R.ring, LISENE_W / 2, H.bandTop + 1.0]]);
const lisenes = union([...around(lisene, Array.from({ length: 8 }, (_, k) => 45 * k)), ...around(console_, Array.from({ length: 8 }, (_, k) => 45 * k))]);
// Steunberen: vier op ±45 en ±135 graden. De voorkant helt naar de schacht (BAG: 1,3 m voor de wand op het maaiveld;
// foto: circa 0,6 m onder de afdekking), met een schuine natuurstenen afdekking (64 graden) tot tegen de schacht.
const buttress = hull([-1, 1].flatMap((s) => {
  const y = (s * BUTTRESS.w) / 2;
  return [[4.2, y, BASE], [BUTTRESS.face, y, BASE], [BUTTRESS.faceTop, y, H.buttressFace], [4.3, y, H.buttressTop]];
}));
const buttresses = union(around(buttress, [45, 135, 225, 315]));
// Ingang aan de oostzijde: natuurstenen omlijsting 0,2 m voor de wand, deur als nis.
const doorFrame = prism([[R.foot - 0.6, -1.0], [R.foot + 0.2, -1.0], [R.foot + 0.2, 1.0], [R.foot - 0.6, 1.0]], BASE, 3.0);
// Opbouwen op het dak (luchtfoto, AHN): het trappenhuis (2,6 m in het vierkant, tot 35,5 m) en een klein kastje tegen
// de borstwering aan de westzijde.
const hatch = place(prism([[-1.3, -1.3], [1.3, -1.3], [1.3, 1.3], [-1.3, 1.3]], H.roof - 0.01, H.hatch), { deg: 37, at: [...polar(2.0, 46), 0] });
const box = place(prism([[-0.5, -0.6], [0.5, -0.6], [0.5, 0.6], [-0.5, 0.6]], H.roof - 0.01, 35.0), { at: [...polar(3.4, 175), 0] });

// Vensters en deur als blinde nissen:
// - de deur (1,2 m breed, tot 2,4 m) in de omlijsting op 0 graden;
// - vier vensters in de schacht die op de foto te zien zijn (0 graden op 6,6 en 17,0 m; -118 graden op 11,4 m; -83 graden
//   op 21,4 m), elk 0,9 m breed en 1,6 m hoog (in het echt circa 0,5 m breed);
// - per veld van het reservoir één smal venster (in het echt twee boven elkaar), 0,9 m breed, van 29,7 tot 32,9 m.
const shaftR = (z) => R.foot + ((R.shaftTop - R.foot) * z) / H.shaftTop;
const shaftWindows = [[0, 6.6], [0, 17.0], [-118, 11.4], [-83, 21.4]];
const windows = union([
  place(niche(R.foot + 0.2, 1.2, 0, 2.4, 0.55), { deg: 0 }),
  ...shaftWindows.map(([deg, z0]) => place(niche(shaftR(z0 + 1.6), 0.9, z0, z0 + 1.6), { deg })),
  ...around(niche(R.reservoir, 0.9, 29.7, 32.9), Array.from({ length: 8 }, (_, k) => 22.5 + 45 * k)),
]);

const all = union([body, lisenes, buttresses, doorFrame, hatch, box]).subtract(windows);

await writeLandmark({
  slug: "watertoren-s-gravendeel",
  base: BASE,
  nodes: [["building:watertoren-schacht-steunberen-reservoir-en-borstwering", all]],
  catalog: {
    name: "Watertoren 's-Gravendeel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-9, 0], [0, 9], [0, -9]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0585100001641941"],
    description:
      "Oorsprong op het hart van de ronde BAG-voetafdruk (straal 4,84 m) op het maaiveld (NAP 0,0 m), X-as 8 graden linksom van RD-oost naar de deur. Taps toelopende ronde schacht met vier steunberen tot 10,6 m en vier vensters, twee banden tot 26,0 m, consolezone met acht consoles, ring tot 28,2 m, ronde reservoirmantel (straal 4,8 m) met acht lisenen en acht vensters, kroonlijst, plat dak op 33,8 m, borstwering tot 35,1 m met pijlertjes tot 35,45 m en een trappenhuisopbouw tot 35,5 m. Maten uit BAG, AHN, luchtfoto en één foto.",
    realWorld: {
      built: 1914,
      architect: "Visser en Smit",
      publishedHeightM: 35,
      reservoirM3: 200,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 33.8,
      ahnParapetNapM: 35.1,
      ahnTopNapM: 35.5,
      footRadiusM: R.foot,
      shaftTopRadiusM: R.shaftTop,
      reservoirRadiusM: R.reservoir,
      ringRadiusM: R.ring,
      buttressTopM: H.buttressTop,
      ringTopM: H.ringTop,
      roofM: H.roof,
      parapetM: H.parapet,
      topM: H.hatch,
      buttressDegrees: [45, 135, 225, 315],
      entranceDegrees: 0,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_('s-Gravendeel) (1914, Visser en Smit, 35 m, 200 m³, betonskelet met metselwerk op een bakstenen voet met vier steunberen met natuurstenen afdekking; gemeentelijk monument)",
      "https://commons.wikimedia.org/wiki/File:Gravendeel_Watertoren_3595.JPG (Willemjans, 2007, CC BY-SA 3.0; vanaf het oosten-zuidoosten)",
      "PDOK BAG-pand 0585100001641941, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

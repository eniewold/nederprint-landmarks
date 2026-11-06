// Watertoren van Bodegraven aan Rond de Watertoren. Gebouwd in 1907 naar ontwerp van Visser & Smit (Hanab), 34,15 m
// hoog, reservoir van 200 m³; in 1954 kreeg hij een nieuw reservoir, in 1995 is hij gerestaureerd en nu draagt hij een
// zendmast (Wikipedia). Gemeentelijk monument GM1901WN031. Een ronde, licht taps toelopende bakstenen schacht op een
// onderbouw met acht betonnen steunberen en een betonnen plintband op 5,2 m. Boven in de schacht een rondboogfries onder
// een betonnen band; daarop een kraag met consoles die een bredere, gepleisterde reservoirmantel draagt met acht betonnen
// lisenen en per travee drie vierkante vensters boven elkaar. Bovenop een plat dak met een betonnen borstwering met
// ruitvormig open werk tussen acht penanten (foto's Commons).
//
// Oorsprong op het hart van de cirkelvormige BAG-voetafdruk van pand 0497100000000004 (cirkelfit, straal 4,25 m, de
// buitenkant van de steunberen). Lokale X-as 40 graden linksom van RD-oost: daar staat een steunbeer; de acht steunberen,
// de lisenen en de penanten staan op k maal 45 graden, de vensters van het reservoir midden in de travees (22,5 + k maal
// 45). Hoeken hieronder in graden linksom vanaf de lokale X-as. De stand van de steunberen is gemeten op de luchtfoto
// (voet van de toren, vier steunberen op -8, -47, -95 en -144 graden RD) en op foto 3 (camera-GPS); hij is op circa 5
// graden nauwkeurig. Maaiveld AHN-DTM NAP -0,25.
// Hoogtes: dak NAP +33,3 en borstwering NAP +34 in het AHN-DSM (0,5 m); reservoir, fries, band, plint en steunberen van
// de (verticaal rechte) foto "Bodegraven, watertoren GM1901WN031 foto11 2017-07-09 09.26.jpg", geschaald op het dak uit het
// AHN (0,0266 m per pixel); stralen van dezelfde foto, geschaald op de BAG-cirkel.
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [110766.51, 455691.93];
const AXIS_DEG = 40;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = -0.25;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (noordoost 43,64, zuidwest 43,39,
// noordwest 43,60, zuidoost 43,315 op de weg), gemeten 2026-11-06. Het PDOK-pand staat op 43,14 met het dak op 76,72.
const GROUND_ELLIPSOID = 43.315;

const rad = (deg) => (deg * Math.PI) / 180;
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const EIGHT = Array.from({ length: 8 }, (_, k) => 45 * k);
const BAYS = EIGHT.map((d) => d + 22.5);
// Nis in de wand met normaal +X op afstand f, breedte w, van z0 tot z1, 0,3 m diep; het plafond loopt naar binnen onder
// 56 graden op, zodat er niets vrij hangt.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Lage, brede nis (open werk van de borstwering): plafond onder 56 graden van binnen naar buiten omlaag.
const flatNiche = (f, w, z0, z1, depth) => {
  const a = f - depth, b = f + 0.15;
  return hull([[a, -w / 2, z0], [a, w / 2, z0], [b, -w / 2, z0 - 0.3], [b, w / 2, z0 - 0.3], [a, -w / 2, z1 + 1.5 * depth], [a, w / 2, z1 + 1.5 * depth], [b, -w / 2, z1 - 0.225], [b, w / 2, z1 - 0.225]]);
};
// Nis met een spitse (rondboog benaderende) bovenkant: rechte wangen tot z1, top op z1 + w/2 * tan(55 graden).
const archNiche = (f, w, z0, z1, depth = 0.3) => {
  const top = z1 + (w / 2) * Math.tan(rad(55));
  const a = f - depth, b = f + 1.0;
  return hull([
    [a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0],
    [a, -w / 2, z1], [a, w / 2, z1], [a, 0, top], [b, -w / 2, z1], [b, w / 2, z1], [b, 0, top + 1.5 * depth],
  ]);
};

// ---------- hoogtes boven het maaiveld (NAP -0,25) ----------
const H = {
  buttress: 5.2, // bovenkant steunberen = onderkant plintband
  plinth: 5.7, // betonnen plintband
  frieze0: 20.2, // onderkant rondboogfries
  shaftTop: 21.6, // bovenkant van de bakstenen schacht
  band: 22.4, // betonnen band onder de consoles
  corbel: 23.36, // kraag met consoles, 50 graden
  cornice: 24.1, // onderste lijst van het reservoir
  tankTop: 33.0, // bovenkant reservoirmantel
  deck: 33.55, // dak (AHN NAP +33,3)
  parapet: 34.45, // borstwering (AHN NAP +34 op de rand; Wikipedia 34,15 m)
  post: 34.8, // penanten van de borstwering
};
const R = {
  bag: 4.25, // BAG-cirkel: buitenkant steunberen aan de voet
  buttressTop: 4.1,
  base: 3.95, // bakstenen onderbouw tussen de steunberen
  plinth: 4.15,
  shaftFoot: 3.9,
  shaftTop: 3.6,
  band: 3.95,
  cornice: 4.75, // AHN: tot 4,8 m van het hart
  tank: 4.5,
  lisene: 4.68,
  lip: 4.65,
  parapetIn: 3.75, // borstwering 0,9 m dik
};

// ---------- toren ----------
// Schacht, plintband, fries, band, kraag, lijst, reservoir, dakrand en borstwering in één omwentelingsprofiel.
const body = rev([
  [0, BASE], [R.base, BASE], [R.base, H.buttress - 0.24], [R.plinth, H.buttress], [R.plinth, H.plinth],
  [R.shaftFoot, H.plinth], [R.shaftTop, H.shaftTop - 0.42], [R.band, H.shaftTop], [R.band, H.band],
  [R.cornice, H.corbel], [R.cornice, H.cornice], [R.tank, H.cornice], [R.tank, H.tankTop],
  [R.lip, H.tankTop + 0.18], [R.lip, H.parapet], [R.parapetIn, H.parapet], [R.parapetIn, H.deck], [0, H.deck],
]);
// Acht betonnen steunberen van 1,1 m breed, aan de voet tot de BAG-cirkel, schuin afgedekt onder de plintband.
const buttress = hull([-0.55, 0.55].flatMap((y) => [
  [3.5, y, BASE], [R.bag, y, BASE], [R.buttressTop, y, H.buttress - 0.4], [3.5, y, H.buttress + 0.1], [R.buttressTop - 0.2, y, H.buttress + 0.1],
]));
// Lisenen op de reservoirmantel (0,9 m breed, 0,18 m voor de mantel) en penanten op de borstwering.
const lisene = prism([[4.2, -0.45], [R.lisene, -0.45], [R.lisene, 0.45], [4.2, 0.45]], H.cornice, H.tankTop + 0.18);
const post = prism([[3.75, -0.45], [R.lisene, -0.45], [R.lisene, 0.45], [3.75, 0.45]], H.tankTop, H.post);

// Vensters en open werk als blinde nissen:
// - drie vierkante vensters per travee in het reservoir (foto: 0,8 x 1,1 m, midden op 25,8, 28,6 en 31,4 m), als nis van
//   0,9 m breed;
// - het ruitvormige open werk van de borstwering als een ondiepe nis tussen de penanten;
// - zestien rondbogen van het fries (1,43 m hart op hart) als nissen van 0,9 m breed met een spitse top;
// - de smalle rondboogvensters boven elkaar in de schacht aan de noordoostzijde (foto 3 en de RCE-foto) en de lage
//   rondboogvensters tussen de steunberen (foto 3).
const tankWindows = [[25.25, 26.35], [28.05, 29.15], [30.85, 31.95]];
const windows = union([
  ...tankWindows.flatMap(([z0, z1]) => around(niche(R.tank, 0.9, z0, z1), BAYS)),
  ...around(flatNiche(R.lip, 2.4, 33.75, 33.95, 0.25), BAYS),
  ...around(archNiche(3.63, 0.9, H.frieze0, H.frieze0 + 0.5), Array.from({ length: 16 }, (_, k) => 11.25 + 22.5 * k)),
  ...[[7.4, 8.4], [12.6, 13.6], [17.4, 18.4]].map(([z0, z1]) => place(archNiche(3.72, 0.9, z0, z1), { deg: -22.5 })),
  ...around(archNiche(R.base, 0.9, 0.8, 1.6), [-22.5, 22.5, 112.5, 202.5]),
]);

const all = union([body, ...around(buttress, EIGHT), ...around(lisene, EIGHT), ...around(post, EIGHT)]).subtract(windows);

await writeLandmark({
  slug: "watertoren-bodegraven",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-reservoir-en-borstwering", all]],
  catalog: {
    name: "Watertoren Bodegraven",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0497100000000004"],
    description:
      "Oorsprong op het hart van de ronde BAG-voetafdruk (straal 4,25 m) op het maaiveld (NAP -0,25 m), X-as 40 graden linksom van RD-oost op een steunbeer. Bakstenen schacht op een onderbouw met acht betonnen steunberen tot 5,2 m en een plintband; taps tot 3,6 m straal op 21,6 m met een rondboogfries en een betonnen band; kraag van 45 graden onder een reservoir van 9 m doorsnede (24,1 tot 33 m) met acht lisenen en drie vensters per travee; plat dak op 33,55 m met een borstwering tot 34,45 m en acht penanten. Zendmast weggelaten. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1907,
      architect: "Visser & Smit (Hanab)",
      gemeentelijkMonument: "GM1901WN031",
      publishedHeightM: 34.15,
      reservoirM3: 200,
      ahnGroundNapM: GROUND_NAP,
      ahnDeckNapM: 33.3,
      ahnParapetNapM: 34.0,
      footprintRadiusM: R.bag,
      buttressTopM: H.buttress,
      shaftRadiusFootM: R.shaftFoot,
      shaftRadiusTopM: R.shaftTop,
      reservoirBottomM: H.cornice,
      reservoirTopM: H.tankTop,
      reservoirDiameterM: R.tank * 2,
      corniceDiameterM: R.cornice * 2,
      deckM: H.deck,
      parapetM: H.parapet,
      topM: H.post,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Bodegraven) (1907, Visser & Smit Hanab, 34,15 m, 200 m³, nieuw reservoir 1954, restauratie 1995, zendmast)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Bodegraven) (Bodegraven, watertoren GM1901WN031 foto11 2017-07-09 09.26.jpg vanaf het noordoosten; Watertoren (Bodegraven).JPG vanaf de Oude Rijn; Watertoren, voormalige - Bodegraven - 20374386 - RCE.jpg; Overzicht - Bodegraven - 20373708 - RCE.jpg)",
      "PDOK BAG-pand 0497100000000004, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

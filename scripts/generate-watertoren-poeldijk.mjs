// Watertoren van tuinderij "Kaas en Brood" in Poeldijk (Westland), aan de sloot naast de Kaas en Broodweg. Een kleine
// stalen watertoren voor de besproeiing van de kassen (Wikipedia; bouwjaar, hoogte en inhoud onbekend; op het reservoir
// staat "Tuinderij Kaas en Brood, sedert 1895"). Een taps vakwerkframe van vier hoekstijlen met kruisende trekstangen
// en een ring op circa twee derde draagt een vierkant stalen reservoir met een vlak deksel; onder in het frame staat een
// houten pomphuisje met een plat dak en een deur naar het erf (foto Quistnix 2009). De toren staat er nog: het AHN en
// de luchtfoto's van 2022 tot 2026 tonen het reservoir, en de BAG kent hem sinds 2025 als pand 1783100000810342.
//
// Dat BAG-pand is een vierkant van 2,15 m (de voetafdruk van het reservoir), met randen op 47 graden; PDOK maakt er een
// blok van NAP-ellipsoïde 44,0 tot 51,07 van. Het model vervangt het. De kas (pand 1783100000021037) ligt 3,3 m
// noordwestelijk, evenwijdig aan de toren (BAG-rand 46,8 graden), en blijft staan.
//
// Oorsprong op het hart van het BAG-pand (74436,66; 449131,73), op het maaiveld (AHN-DTM NAP +0,35 op het erf). Het
// vlakke reservoirdeksel in het AHN-DSM 0,5 m (NAP +7,4 à +7,5, zwaartepunt (74436,75; 449131,25)) valt daar binnen
// een halve meter op. Lokale X-as 47 graden linksom van RD-oost (BAG-randen van toren en kas), +Y naar de kas
// (noordwest), -Y naar het erf (zuidoost) met de deur van het pomphuisje.
// Maten: bovenkant van het reservoir uit het AHN-DSM (NAP +7,4, dus 7,05 m boven het erf; PDOK-blok 7,07 m), breedte van
// het reservoir uit de BAG (2,15 m). Uit de foto (frontaal op de zuidoostgevel van het frame) zijn geschat: het
// reservoir 1,25 m hoog, het frame onderaan twee keer zo breed als bovenaan (4,6 en 2,4 m), de ring op 4,0 m en het
// pomphuisje 2,4 m hoog (deur van circa 2 m als maat).
import { Manifold, hull, union, prism, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [74436.66, 449131.73];
const AXIS_DEG = 47;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.35;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (+X 43,969, -X 43,941, +Y 43,921 aan de kaskant,
// -Y 44,003 op het erf), gemeten 2026-11-07; onder het hart ligt het PDOK-terrein op 43,886.
const GROUND_ELLIPSOID = 43.92;

const TAN50 = Math.tan((50 * Math.PI) / 180);

// ---------- hoogtes boven het maaiveld (NAP +0,35) ----------
const H = {
  shed: 2.4, // plat dak van het pomphuisje
  door: 1.95, // deur in de zuidoostgevel (-Y), nis met een plafond van 49 graden
  tier1Top: 3.0, // zijkant van het onderste vak; de top loopt onder 50 graden tot onder de ring (3,99)
  tier2: 4.25, // onderkant van het bovenste vak (ring op circa 4,0 tot 4,25)
  tier2Top: 5.0, // zijkant van het bovenste vak; top op 5,54 onder het platform
  tank: 5.8, // platform en onderkant van het reservoir
  top: 7.05, // deksel van het reservoir (AHN NAP +7,4)
};
const R = {
  frameFoot: 2.3, // halve breedte van het frame op het maaiveld (foto: twee keer de bovenkant)
  frameTop: 1.2, // halve breedte van het platform onder het reservoir
  leg: 0.9, // hoekstijl 0,9 m (in het echt een hoekprofiel van circa 0,15 m; 0,9 m minimum op 1:1000)
  tank: 1.075, // reservoir 2,15 m in het vierkant (BAG)
};
// Halve breedte van het frame op hoogte z.
const w = (z) => R.frameFoot - ((R.frameFoot - R.frameTop) * z) / H.tank;
const square = (h) => [[-h, -h], [h, -h], [h, h], [-h, h]];
// Het pomphuisje vult het onderste vak tussen de stijlen op het maaiveld (in het echt circa 2,4 m breed, hier 2,86 m zodat
// er tussen huisje en stijlen geen spleten van een paar decimeter blijven).
R.shed = +(w(0) - R.leg + 0.03).toFixed(2); // 3 cm in de stijlen, geen samenvallende vlakken

// ---------- frame: afgeknotte piramide met vier hoekstijlen en een ring ----------
// De vakken tussen de stijlen zijn open: per vak twee doorgangen dwars door het frame (langs X en langs Y). De zijden
// volgen de binnenkant van de stijlen (10,7 graden uit het lood) en de top loopt onder 50 graden naar het midden; waar de
// twee doorgangen elkaar kruisen ontstaat een kruisgewelf met vlakken van 50 graden, zodat er niets vrij overhangt. Boven
// elk vak blijft een dichte plaat staan: de ring van 3,99 tot 4,25 m en het platform onder het reservoir. Het onderste vak
// begint op het maaiveld; daaronder blijft een drempel van 0,3 m in het terrein, zodat de schuine binnenzijden van de
// stijlen niet op de onderkant van het model eindigen (de 45-gradenopvulling zette daar anders een spleetje bij).
const frame = hull([...square(w(BASE)).map(([x, y]) => [x, y, BASE]), ...square(R.frameTop).map(([x, y]) => [x, y, H.tank])]);
// Doorgang langs X, van z0 tot de zijkant z1, met een spitse top.
const opening = (z0, z1) => {
  const g0 = w(z0) - R.leg, g1 = w(z1) - R.leg, apex = z1 + g1 * TAN50, X = R.frameFoot + 1;
  return hull([-X, X].flatMap((x) => [[x, -g0, z0], [x, g0, z0], [x, -g1, z1], [x, g1, z1], [x, 0, apex]]));
};
const panels = union([opening(0, H.tier1Top), opening(H.tier2, H.tier2Top)].flatMap((m) => [m, place(m, { deg: 90 })]));

// ---------- pomphuisje: plat dak, deur naar het erf (-Y) ----------
// Deurnis 0,9 m breed en 0,3 m diep van het maaiveld tot 1,95; het plafond loopt onder 49 graden naar achteren omhoog naar
// de gevel.
const doorDepth = 0.3, doorDrop = doorDepth * Math.tan((49 * Math.PI) / 180);
const doorNiche = hull([-0.45, 0.45].flatMap((x) => [
  [x, -R.shed - 0.2, BASE + 0.25], [x, -R.shed + doorDepth, BASE + 0.25],
  [x, -R.shed - 0.2, H.door + 0.2 * Math.tan((49 * Math.PI) / 180)], [x, -R.shed + doorDepth, H.door - doorDrop],
]));
const shed = prism(square(R.shed), BASE, H.shed).subtract(doorNiche);

// ---------- reservoir: vierkante bak op het platform ----------
const tank = box(-R.tank, -R.tank, H.tank, R.tank, R.tank, H.top);

const all = union([frame.subtract(panels), shed, tank]);

await writeLandmark({
  slug: "watertoren-poeldijk",
  base: BASE,
  nodes: [["building:watertoren-frame-pomphuisje-en-reservoir", all]],
  catalog: {
    name: "Watertoren Poeldijk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[3, 0], [-3, 0], [0, 3], [0, -3]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1783100000810342"],
    description:
      "Oorsprong op het hart van BAG-pand 1783100000810342 (het reservoir) op het erf (NAP +0,35 m), X-as 47 graden linksom van RD-oost evenwijdig aan toren en kas, +Y naar de kas, -Y naar het erf. Taps vakwerkframe van 4,6 m op het maaiveld tot 2,4 m onder het reservoir met vier hoekstijlen van 0,9 m, een ring op circa 4,0 m en open vakken met een spitse top (kruisgewelf); pomphuisje met plat dak (2,4 m) en deurnis in het onderste vak; vierkant reservoir van 2,15 m van 5,8 tot 7,05 m. Hoogte uit het AHN, breedte van het reservoir uit de BAG, verhoudingen uit de foto.",
    realWorld: {
      tuinderij: "Kaas en Brood (sedert 1895)",
      bagPand: "1783100000810342",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 7.4,
      frameFootWidthM: 2 * R.frameFoot,
      frameTopWidthM: 2 * R.frameTop,
      legM: R.leg,
      ringM: [+(H.tier1Top + (w(H.tier1Top) - R.leg) * TAN50).toFixed(2), H.tier2],
      shedHeightM: H.shed,
      shedWidthM: +(2 * R.shed).toFixed(2),
      tankWidthM: 2 * R.tank,
      tankBottomM: H.tank,
      topM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Poeldijk) (besproeiingsinstallatie van de kassen van tuinderij Kaas en Brood; bouwjaar, hoogte en inhoud onbekend)",
      "https://commons.wikimedia.org/wiki/File:Poeldijk_-_watertoren_tuinderij_Kaas_en_Brood.jpg (Quistnix, 13 februari 2009, CC BY-SA: frame, ring, reservoir met opschrift, pomphuisje met deur, vlaggenmast, ladder)",
      "PDOK BAG-WFS (pand 1783100000810342, bouwjaar 2025, 2,15 m in het vierkant op 47 graden) en gebouwtegels (blok tot ellipsoïde 51,07), 2026-11-07",
      "AHN DSM/DTM 0,5 m (PDOK WCS) en luchtfoto's 2022, 2024 en 2026 (orthoHR), 2026-11-07",
    ],
  },
});

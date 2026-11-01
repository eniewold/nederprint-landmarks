// Watertoren van Delfzijl (1966) op het terrein van de aluminiumfabriek
// (Aldel, nu Klesch Aluminium Delfzijl), aan het spoor naar Oosterhorn. Een
// geheel stalen toren met een reservoir van het type Barkhausen: een cilinder
// met een halfbolvormige bodem, gedragen door vier buispoten met
// windverbanden, en een centrale stijgbuis onder de bodem. Rond de voet van de
// cilinder loopt een omloop.
// Geen BAG-pand: de toren staat niet in de BAG en dus ook niet in de PDOK-
// gebouwtegels; het enige pand ernaast (0010100000008450, een schakelhuisje
// 1,5 m ten oosten van de omloop) blijft staan.
// Oorsprong op het hart van het reservoir in het AHN (cirkelfit op de
// pixels boven 20 m) op maaiveld (NAP +0,6 m), assen in RD-richting. De poten
// staan op 23,5 + k*90 graden: de voeten van twee poten op de luchtfoto (de
// toren helt daar naar het noorden, de voeten staan op hun plek) op 4,3 m van
// het hart, en de stand op de Commons-foto (poten op ±141 en ±71 px).
// Hoogtes van de foto "Delfzijl Watertoren Aldel" (bijna frontaal van onderaf,
// 38,5 px/m, geschaald op de omloop van 9,7 m in het AHN, maaiveld op
// foto-y 1325 zodat de rand van het dak op 30,3 m ligt zoals het AHN).
import { Manifold, CrossSection, hull, circle, union, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [260814.1, 592166.8];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 0.6;
const H = {
  bowlCentre: 27.2, // overgang van halfbolle bodem naar cilinder
  bowlBottom: 23.6, // aansluiting op de stijgbuis
  galleryUnder: 27.5, // onderkant van de rand van de omloop
  gallery: 27.9, // vloer van de omloop
  rim: 30.3, // bovenrand van de cilinder
  roof: 30.9, // midden van het vlakke kegeldak
  rings: [7.0, 13.4, 19.8], // horizontale verbanden tussen de poten
};
const R = { tank: 3.9, gallery: 4.85, riser: 0.62, legs: 4.2 };
const LEG_DEG = 23.5; // eerste poot, dan elke 90 graden
const BAR = 0.9; // poten en verbanden: 0,3 m buis, verdikt tot de printminimum

// ---------- reservoir: halfbolle bodem, cilinder en vlak kegeldak ----------
const bowl = Array.from({ length: 12 }, (_, k) => {
  const t = (k / 12) * (Math.PI / 2);
  return [R.tank * Math.sin(t), H.bowlCentre - (H.bowlCentre - H.bowlBottom) * Math.cos(t)];
}).filter(([r]) => r > R.riser);
const tank = Manifold.revolve(
  new CrossSection([[
    [0, H.bowlBottom - 0.5], [R.riser, H.bowlBottom - 0.5], ...bowl, [R.tank, H.bowlCentre], [R.tank, H.rim], [0, H.roof],
  ]]),
  96,
);
// Omloop: vloer met een rand van 0,4 m en een kegelvormige onderkant onder 56 graden tot in de bodem.
const slope = Math.tan((56 * Math.PI) / 180);
const galleryLow = H.galleryUnder - (R.gallery - R.tank + 0.3) * slope;
const gallery = Manifold.revolve(
  new CrossSection([[
    [R.tank - 0.3, galleryLow], [R.gallery, H.galleryUnder], [R.gallery, H.gallery], [R.tank - 0.3, H.gallery],
  ]]),
  96,
);
// Stijgbuis van de voet tot in de bodem.
const riser = Manifold.cylinder(H.bowlBottom + 0.5 - BASE, R.riser, R.riser, 32).translate([0, 0, BASE]);

// ---------- vier poten met verbanden ----------
// Per vlak tussen twee poten (normaal +X op afstand a, poten op y = ±a): een
// horizontale ring per verdieping en een omgekeerde V van de twee poten naar
// het midden van de ring erboven (onder 65 tot 67 graden), zodat elke ring in
// het midden gedragen wordt. Boven de bovenste ring alleen de poten: daar
// blijft de bolle bodem zichtbaar zoals op de foto (de dunne kruisschoren daar
// zijn weggelaten).
const a = R.legs * Math.SQRT1_2;
const legShape = circle([0, 0], BAR / 2 / Math.cos(Math.PI / 8), 8, Math.PI / 8);
const leg = Manifold.extrude(new CrossSection([legShape]), H.galleryUnder + 0.2 - BASE).translate([0, 0, BASE]);
const legs = union([0, 1, 2, 3].map((k) => {
  const t = ((LEG_DEG + k * 90) * Math.PI) / 180;
  return leg.translate([R.legs * Math.cos(t), R.legs * Math.sin(t), 0]);
}));
const cube = (x, y, z) => box(x - BAR / 2, y - BAR / 2, z - BAR / 2, x + BAR / 2, y + BAR / 2, z + BAR / 2);
const levels = [BASE + BAR / 2, ...H.rings.slice(0, -1)];
const face = union([
  ...H.rings.map((z) => box(a - BAR / 2, -a, z - BAR / 2, a + BAR / 2, a, z + BAR / 2)),
  ...levels.flatMap((z0, i) => [-1, 1].map((s) => hull([cube(a, s * a, z0), cube(a, 0, H.rings[i])]))),
]);
const frame = union([0, 1, 2, 3].map((k) => place(face, { deg: LEG_DEG + 45 + k * 90 })));

const tower = union([tank, gallery, riser, legs, frame]).trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-delfzijl",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op; een los reservoir zou een voet tot de grondplaat krijgen.
  nodes: [["building:poten-stijgbuis-en-reservoir", tower]],
  catalog: {
    name: "Watertoren Delfzijl",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6.4, 0], [-6.4, 0], [0, 6.4], [0, -6.4]],
    // Ellipsoïdisch maaiveld: NAP +0,6 m plus de NLGEO2018-geoïdehoogte 40,57 m op de oorsprong.
    groundHeight: 41.17,
    description:
      "Oorsprong op het hart van het reservoir in het AHN op maaiveld (NAP +0,6 m), assen in RD-richting. Stalen Barkhausentoren: vier poten op 4,2 m van het hart (op 23,5 + k·90 graden, 0,9 m dik in plaats van 0,3 m) met ringen op 7,0, 13,4 en 19,8 m en daaronder een omgekeerde V per vlak per verdieping, centrale stijgbuis van 1,24 m, reservoir van 7,8 m met halfbolle bodem van 23,6 tot 27,2 m, cilinder tot 30,3 m en een vlak kegeldak tot 30,9 m, omloop van 9,7 m op 27,9 m. Geen BAG-pand. Maten uit AHN, luchtfoto en de Commons-foto.",
    realWorld: {
      built: 1966,
      type: "Barkhausen",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 31.6,
      tankDiameterM: R.tank * 2,
      galleryDiameterM: R.gallery * 2,
      galleryM: H.gallery,
      bowlBottomM: H.bowlBottom,
      rimM: H.rim,
      modelTopM: H.roof,
      riserDiameterM: R.riser * 2,
      legRadiusM: R.legs,
      legDiameterRealM: 0.31,
      ringsM: H.rings,
      photoScalePxPerM: 38.5,
      minimumPartM: BAR,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Delfzijl)",
      "https://commons.wikimedia.org/wiki/File:Delfzijl_Watertoren_Aldel.JPG (frontale foto van onderaf, maten)",
      "PDOK BAG-panden (geen pand onder de toren), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
      "NLGEO2018-geoïdehoogte op de oorsprong (40,57 m) voor groundHeight",
    ],
  },
});

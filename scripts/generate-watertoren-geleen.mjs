// Voormalige watertoren van Staatsmijn Maurits in Geleen (1924–1926, ontwerp
// Ir. A.E. Dinger, hoofd-bedrijfsingenieur van de Staatsmijnen), gemeentelijk
// monument GM066 aan het Mauritspark (vroeger het DSM-terrein). Een betonnen
// toren: een achttienhoekig reservoir met lisenen op de hoeken, een kroonlijst
// en een lage ronde trommel met zes steunblokken op het platte dak, gedragen
// door zes kolommen met twee ringbalken en een kraagbalk onder de bodem, en
// een ronde middenschacht met een kleine ingang. In 2007 grijs, nu wit.
//
// BAG-pand 1883100000047359 (bouwjaar 1940 in de BAG, 6,5 m²) is alleen de
// voet van de middenschacht met de ingang: een cirkel van 2,08 m met een
// rechthoek van 1,41 bij 2,35 m naar het zuidzuidoosten. De oorsprong ligt op
// het hart van die cirkel, op maaiveld (NAP +70,6 m), assen in RD-richting.
//
// Stand: de voeten van vier kolommen staan op de luchtfoto (de toren helt daar
// naar het noorden) op 5,9 m van het hart, op -9 + k·60 graden; de zes
// steunblokken rond de trommel staan op dezelfde hoeken, de ingang van de BAG
// wijst naar de kolom op -69 graden. De hoeken van de achttienhoek (en de
// lisenen) liggen op -9 + k·20 graden; het aantal volgt uit de lisenen op de
// Commons-foto (circa 20 graden uit elkaar).
// Hoogtes: dak, rand en trommel uit het AHN (35,7, 36,0 en 37,6 tot 37,9 m);
// kroonlijst, reservoir en kraagbalk van de foto "7061 Geleen Watertoren DSM
// terrein" (34,9 px/m, geschaald op de kroonlijst van 13,6 m uit het AHN, met
// de bovenkant van de rand op 36,0 m); de ringbalken uit de luchtfoto (de
// verschuiving per hoogte, gelijkgezet op de onderkant van het reservoir).
import { Manifold, CrossSection, hull, ring3, circle, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [185190.24, 331660.27];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 70.6;
const SIDES = 18;
const PHASE = -9; // eerste kolom, steunblok en hoek van de achttienhoek (graden, linksom vanaf RD-oost)
const R = {
  body: 6.45, // hoeken van de achttienhoekige wand
  bottom: 6.05, // onderrand van de afgeschuinde bodem
  cornice: 6.8, // hoeken van de kroonlijst
  rimInner: 6.3, // binnenkant van de rand rond het dak
  drum: 4.0,
  blockOut: 5.0, // buitenkant van de steunblokken
  legs: 5.9, // hart van de kolommen
  shaft: 1.04, // middenschacht (BAG-cirkel)
};
const H = {
  ring1: [6.05, 6.95], // onderste ringbalk
  ring2: [14.35, 15.25], // middelste ringbalk
  collar: [22.2, 23.8], // kraagbalk onder de bodem
  bodyBottom: 24.5, // boven de afgeschuinde onderrand (60 graden)
  corniceUnder: 34.7, // aansluiting van de kroonlijst op de wand
  corniceLow: 35.2, // onderkant van de uitkraging (55 graden)
  roof: 35.7,
  rim: 36.0,
  block: 36.8,
  drumEdge: 37.6,
  top: 37.9,
  entrance: 2.7,
};
const BAR = 0.9; // kolommen en balken: printminimum op 1:1000 (werkelijk circa 0,7 tot 0,8 m)
const deg = (d) => (d * Math.PI) / 180;
const poly = (r) => circle([0, 0], r, SIDES, deg(PHASE));

// ---------- reservoir ----------
// Wand met een onderrand onder 60 graden naar de kraagbalk.
const body = hull([
  ...ring3(poly(R.bottom), H.collar[1]),
  ...ring3(poly(R.body), H.bodyBottom),
  ...ring3(poly(R.body), H.corniceLow + 0.1),
]);
// Lisenen op de hoeken: 0,6 m breed en 0,25 m voor de wand, van de onderrand tot in de kroonlijst.
const pilaster = box(R.body - 0.3, -0.3, H.bodyBottom, R.body + 0.25, 0.3, H.corniceLow + 0.05);
const pilasters = union(Array.from({ length: SIDES }, (_, k) => place(pilaster, { deg: PHASE + k * (360 / SIDES) })));
// Kroonlijst met een onderkant onder 55 graden en een rand van 0,3 m boven het dak.
const cornice = hull([
  ...ring3(poly(R.body - 0.05), H.corniceUnder),
  ...ring3(poly(R.cornice), H.corniceLow),
  ...ring3(poly(R.cornice), H.rim),
  ...ring3(poly(R.body - 0.05), H.rim),
]).subtract(Manifold.extrude(new CrossSection([poly(R.rimInner)]), 2).translate([0, 0, H.roof]));

// ---------- trommel en steunblokken op het dak ----------
const drum = Manifold.revolve(
  new CrossSection([[[0, H.roof - 0.1], [R.drum, H.roof - 0.1], [R.drum, H.drumEdge], [0, H.top]]]),
  64,
);
const block = box(R.drum - 0.3, -BAR / 2, H.roof - 0.1, R.blockOut, BAR / 2, H.block);
const blocks = union([0, 1, 2, 3, 4, 5].map((k) => place(block, { deg: PHASE + k * 60 })));

// ---------- onderbouw: zes kolommen, ringbalken, kraagbalk, schacht ----------
const legAt = (k) => [R.legs * Math.cos(deg(PHASE + k * 60)), R.legs * Math.sin(deg(PHASE + k * 60))];
const leg = box(R.legs - BAR / 2, -BAR / 2, BASE, R.legs + BAR / 2, BAR / 2, H.bodyBottom);
const legs = union([0, 1, 2, 3, 4, 5].map((k) => place(leg, { deg: PHASE + k * 60 })));
// Rechte balk van kolom k naar kolom k+1 tussen z0 en z1, 0,9 m breed (zonder schoren of vouten: die staan
// niet op de foto's en de luchtfoto).
const beam = (k, [z0, z1]) => {
  const [a, b] = [legAt(k), legAt(k + 1)];
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
  return place(box(0, -BAR / 2, z0, len, BAR / 2, z1), { at: [a[0], a[1], 0], deg: ang });
};
const beams = union([0, 1, 2, 3, 4, 5].flatMap((k) => [beam(k, H.ring1), beam(k, H.ring2), beam(k, H.collar)]));
const shaft = Manifold.cylinder(H.collar[1] + 0.2 - BASE, R.shaft, R.shaft, 40).translate([0, 0, BASE]);
// Ingang uit de BAG: 1,41 m breed tot 3,0 m van het hart, naar de kolom op -69 graden.
const entrance = place(box(0, -0.705, BASE, 3.0, 0.705, H.entrance), { deg: PHASE - 60 });

const tower = union([body, pilasters, cornice, drum, blocks, legs, beams, shaft, entrance]).trimByPlane([0, 0, 1], BASE);

const GROUND_N = 45.36; // NLGEO2018-geoïdehoogte op de oorsprong
await writeLandmark({
  slug: "watertoren-geleen",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op; een los reservoir zou een voet tot de grondplaat krijgen.
  nodes: [["building:kolommen-schacht-en-reservoir", tower]],
  catalog: {
    name: "Watertoren Geleen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8.3, 0], [-8.3, 0], [0, 8.3], [0, -8.3]],
    // Ellipsoïdisch maaiveld: NAP +70,6 m plus de NLGEO2018-geoïdehoogte 45,36 m op de oorsprong.
    groundHeight: +(GROUND_NAP + GROUND_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.1883100000047359"],
    description:
      "Oorsprong op het hart van de middenschacht (BAG-pand 1883100000047359) op maaiveld (NAP +70,6 m), assen in RD-richting. Betonnen toren van Staatsmijn Maurits: zes kolommen op 5,9 m van het hart (op -9 + k·60 graden) met ringbalken op 6,05–6,95 en 14,35–15,25 m en een kraagbalk van 22,2 tot 23,8 m, middenschacht van 2,08 m met ingang naar het zuidzuidoosten, achttienhoekig reservoir van 12,9 m met lisenen op de hoeken van 23,8 tot de kroonlijst (13,6 m) op 36,0 m, plat dak op 35,7 m en een ronde trommel van 8,0 m tot 37,9 m met zes steunblokken. Maten uit AHN, BAG, luchtfoto en Commons-foto.",
    realWorld: {
      built: "1924–1926",
      designer: "Ir. A.E. Dinger (Staatsmijnen)",
      wikipediaHeightM: 30,
      reservoirM3: 640,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 108.54,
      reservoirDiameterM: R.body * 2,
      corniceDiameterM: R.cornice * 2,
      drumDiameterM: R.drum * 2,
      legRadiusM: R.legs,
      legs: 6,
      sides: SIDES,
      ringsM: [H.ring1, H.ring2, H.collar],
      roofM: H.roof,
      rimM: H.rim,
      modelTopM: H.top,
      shaftDiameterM: R.shaft * 2,
      photoScalePxPerM: 34.9,
      minimumPartM: BAR,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Limburg_(Nederland) (bouwjaar 1924, ontwerper, 30 m, 640 m³)",
      "https://nl.wikipedia.org/wiki/Lijst_van_gemeentelijke_monumenten_in_Geleen (GM066, voormalige watertoren Mijn Maurits, Mauritspark 1a)",
      "https://commons.wikimedia.org/wiki/File:7061_Geleen_Watertoren_DSM_terrein.JPG (maten)",
      "https://commons.wikimedia.org/wiki/File:Geleen_Watertoren_DSM_terrein_2e.JPG",
      "PDOK BAG-pand 1883100000047359, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
      "NLGEO2018-geoïdehoogte op de oorsprong (45,36 m) voor groundHeight",
    ],
  },
});

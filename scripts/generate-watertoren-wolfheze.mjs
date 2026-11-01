// Watertoren van Wolfheze (Evert Knevel, 1907), gemeentelijk monument, 27 m hoog
// met een reservoir van 40 m³, op het terrein van de psychiatrische inrichting
// (nu Pro Persona). Ronde, licht taps toelopende bakstenen schacht op een plint
// met een band van geglazuurde tegels en een rondboogdeur, kleine vensters in
// twee rijen en een oculus onder de kop. Bovenaan wijkt de schacht in een holle
// welving uit naar een achtkantige kop met een lijst aan de voet, een
// rondboogvenster in elk hoofdvlak, een overstekende daklijst en een achtkant
// tentdak (met windvaan).
// Oorsprong op het hart van de BAG-cirkel (straal 3,07 m; de top van het tentdak
// ligt er in het AHN op minder dan 0,1 m van) op maaiveld NAP +32,33 m, assen in
// RD-richting. Grondvlak van de kop uit de luchtfoto (achtkant van 7,35 m over de
// vlakken, vlakken naar de windstreken), goot en top uit het AHN, de overige
// hoogtes uit de enige Commons-foto met een gekantelde camera die op maaiveld,
// goot en top is gepast (de schachtbreedte aan de voet komt dan op 6,2 m, de
// BAG geeft 6,14 m).
import { Manifold, CrossSection, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [182416.26, 445999.45];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  plinth: 0.95, // plint met een schuine afzaat tot +1,07
  bandFoot: 1.07, // band van geglazuurde tegels
  bandTop: 2.98,
  flareFoot: 18.2, // de schacht welft hier uit naar de kop
  soffit: 19.64, // onderkant van de kop
  ledge: 20.0, // bovenkant van de voetlijst van de kop
  cornice: 23.0, // voet van de schuine daklijst
  fascia: 23.7,
  eave: 24.0, // goot, AHN
  apex: 27.1, // top van het tentdak, AHN (NAP +59,44)
};
// Schacht: plint op de BAG-straal, tegelband 0,08 m uit, dan taps naar 2,43 onder de welving.
const R = { plinth: 3.07, band: 2.99, shaftFoot: 2.91, shaftTop: 2.43, flare: 3.1 };
const RS = (z) => R.shaftFoot + ((R.shaftTop - R.shaftFoot) * (z - H.bandTop - 0.08)) / (H.flareFoot - H.bandTop - 0.08);
// Achtkantige kop, apothema's; vlakken naar de windstreken (luchtfoto).
const A = { ledge: 3.3, wall: 3.2, eave: 3.68 };
const oct = (apothem, z) => ring3(circle([0, 0], apothem / Math.cos(Math.PI / 8), 8, Math.PI / 8), z);

// ---------- ronde schacht als omwentelingsprofiel ----------
// Holle welving (kwartellips) van de schacht naar de onderkant van de kop.
const flare = Array.from({ length: 9 }, (_, k) => {
  const t = ((k + 1) / 10) * (Math.PI / 2);
  return [R.flare - (R.flare - R.shaftTop) * Math.cos(t), H.flareFoot + (H.soffit - H.flareFoot) * Math.sin(t)];
});
const shaft = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.band, H.bandFoot], [R.band, H.bandTop], [R.shaftFoot, H.bandTop + 0.08],
    [R.shaftTop, H.flareFoot], ...flare, [R.flare, H.soffit], [R.flare - 0.3, H.soffit + 0.2], [0, H.soffit + 0.2],
  ]]),
  96,
);

// ---------- achtkantige kop met voetlijst, daklijst en tentdak ----------
const ledge = hull([...oct(A.ledge, H.soffit), ...oct(A.ledge, H.ledge)]);
const walls = hull([...oct(A.wall, H.ledge - 0.05), ...oct(A.wall, H.cornice)]);
// Daklijst: 0,48 m uit onder 56 graden, dan een rechte boeiboord tot de goot.
const cornice = hull([...oct(A.wall, H.cornice), ...oct(A.eave, H.fascia), ...oct(A.eave, H.eave)]);
const roof = hull([...oct(A.eave, H.eave), [0, 0, H.apex]]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Op de foto (vanuit het westzuidwesten): de deur met een rij vensters erboven
// naar het noordwesten, een tweede rij vensters met de oculus naar het zuidwesten.
const DOOR_DEG = 136.5;
const ROW_DEG = 220.5;
const WINDOW_Z = [[4.83, 5.99], [8.96, 10.13], [12.9, 14.08]];
const cuts = [
  place(niche(R.plinth, 1.2, 0, 3.1, 0.35), { deg: DOOR_DEG }),
  ...WINDOW_Z.flatMap(([z0, z1]) => [DOOR_DEG, ROW_DEG].map((deg) => place(niche(RS(z0), 0.6, z0, z1, 0.25), { deg }))),
  place(niche(RS(17.45), 0.6, 17.45, 18.0, 0.25), { deg: ROW_DEG }), // oculus
  // Rondboogvensters in de kop, één per hoofdvlak (op de foto in het westvlak, niet in het zuidwestvlak).
  // De plafondrand ligt 0,05 m voor het vlak: precies in het vlak liet de 45-gradenopvulling een richeltje achter.
  ...[0, 90, 180, 270].map((deg) => place(niche(A.wall + 0.05, 0.7, 21.4, 22.5, 0.3), { deg })),
];

const tower = union([shaft, ledge, walls, cornice, roof]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-wolfheze",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op; een losse kop zou een voet tot de grondplaat krijgen.
  nodes: [["building:schacht-kop-en-tentdak", tower]],
  catalog: {
    name: "Watertoren Wolfheze",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[4.6, 0], [-4.6, 0], [0, 4.6], [0, -4.6]],
    replacesBuildings: ["NL.IMBAG.Pand.0274100000012591"],
    description:
      "Oorsprong op het hart van de BAG-cirkel op maaiveld (NAP +32,33 m), assen in RD-richting. Ronde schacht van 6,14 m op een plint met tegelband en rondboogdeur naar het noordwesten, taps naar 4,9 m met twee rijen vensters en een oculus, holle welving naar een achtkantige kop (6,4 m over de vlakken) met voetlijst op 20 m, vier vensters en een schuine daklijst tot de goot op 24 m (7,35 m over de vlakken), achtkant tentdak tot 27,1 m. Maten uit AHN, BAG, luchtfoto en één foto.",
    realWorld: {
      publishedHeightM: 27,
      reservoirM3: 40,
      ahnGroundNapM: 32.33,
      ahnTopNapM: 59.44,
      bagShaftDiameterM: 6.14,
      shaftDiameterBelowFlareM: 4.86,
      headAcrossFlatsM: 6.4,
      eaveAcrossFlatsM: 7.36,
      soffitM: 19.64,
      eaveM: 24.0,
      roofPitchDeg: 40,
      modelTopM: 27.1,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Wolfheze)",
      "https://commons.wikimedia.org/wiki/File:Wolfheze_Watertoren_2006.JPG (enige foto, maten via een gepaste camera)",
      "PDOK BAG-pand 0274100000012591, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

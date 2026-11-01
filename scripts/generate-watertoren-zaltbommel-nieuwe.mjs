// Nieuwe watertoren van Zaltbommel (1964, Brouwer en Deurvorst), rijksmonument
// 532144 aan de Steenweg, 38 m hoog met drie reservoirs (1255, 875 en 415 m³).
// Een betonnen trechter: een ronde schacht met een plint van twaalf spitse,
// beglaasde nissen met schuine lichte dagkanten, daarboven gaat de schacht
// met een holle overgang over in een rechte kegel die tot de dakrand uitwaaiert
// tot bijna twee keer de breedte van de voet. Tien horizontale voegen verdelen
// de schacht in gelijke ringen. Plat dak met een antenne-installatie in het
// midden.
// Oorsprong op het middelpunt van de ronde BAG-contour (straal 5,1 m) op
// maaiveld (NAP +3,04 m), assen in RD-richting. Dak en dakrand uit het AHN
// (NAP +40,0; de rand van het DSM ligt op 9,8 tot 10 m van het hart), de
// vorm van de schacht en de hoogte van de voegen en de plint van drie
// frontale foto's (de linkerrand tegen de lucht is boven 18 m een rechte lijn).
import { Manifold, CrossSection, box, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [145070.94, 423357.22];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  nicheTop: 4.4, // top van de spitse nissen in de plint
  filletFoot: 13.7, // begin van de holle overgang van schacht naar kegel
  knee: 15.7, // snijpunt van de kegellijn met de schacht
  filletTop: 17.7, // daarboven een rechte kegel
  firstJoint: 5.7, // onderste voeg; tien voegen op gelijke afstand
  jointStep: 3.18,
  chamfer: 36.75, // afgeschuinde bovenrand
  roof: 36.95, // plat dak, NAP +39,99 (AHN)
  frame: 39.15, // antenneframe (AHN 2 tot 3 m boven het dak)
  panels: 40.35, // antennepanelen (foto, 3,4 m boven het dak)
};
const R = { shaft: 5.1, top: 9.85 };
const K = (R.top - R.shaft) / (H.roof - H.knee); // kegel: 0,2235 m per m (12,6 graden uit het lood)

// Straal van de buitenkant per hoogte: schacht, holle overgang (kwadratische Bézier met het knikpunt als
// controlepunt, raakt aan beide kanten), rechte kegel.
const radius = (z) => {
  if (z <= H.filletFoot) return R.shaft;
  if (z >= H.filletTop) return R.shaft + K * (z - H.knee);
  const t = (z - H.filletFoot) / (H.filletTop - H.filletFoot);
  return R.shaft + t * t * K * (H.filletTop - H.knee);
};

// ---------- schacht, kegel en dak als één omwentelingsprofiel ----------
const profile = [[0, BASE], [R.shaft, BASE]];
for (let i = 0; i <= 16; i++) {
  const z = H.filletFoot + ((H.filletTop - H.filletFoot) * i) / 16;
  profile.push([radius(z), z]);
}
profile.push([radius(H.chamfer), H.chamfer], [radius(H.chamfer) - 0.2, H.roof], [0, H.roof]);
const body = Manifold.revolve(new CrossSection([profile]), 128);

// ---------- voegen: V-groef van 0,12 m diep, plafond onder 62 graden ----------
const joint = (h) =>
  Manifold.revolve(
    new CrossSection([[
      [radius(h - 0.12) + 0.1, h - 0.12],
      [radius(h - 0.12) + 0.3, h - 0.12],
      [radius(h + 0.45) + 0.3, h + 0.45],
      [radius(h + 0.45) + 0.02, h + 0.45],
      [radius(h) - 0.12, h],
    ]]),
    128,
  );
const JOINTS = Array.from({ length: 10 }, (_, k) => +(H.firstJoint + k * H.jointStep).toFixed(2));

// ---------- plint: twaalf spitse nissen met schuine dagkanten ----------
// Achterkant (glas) 0,8 m breed met de top op 4,0 m, 0,4 m diep; buiten de schacht 2,0 m breed met de top op 4,6 m,
// zodat de opening in het oppervlak circa 1,3 m breed is en tot 4,4 m reikt. De zijvlakken staan onder 78 graden.
const nicheShape = hull([
  [R.shaft - 0.4, -0.4, 0], [R.shaft - 0.4, 0.4, 0], [R.shaft - 0.4, 0, 4.0],
  [R.shaft + 0.5, -1.0, 0], [R.shaft + 0.5, 1.0, 0], [R.shaft + 0.5, 0, 4.6],
]);
const niches = union(Array.from({ length: 12 }, (_, k) => place(nicheShape, { deg: k * 30 })));

// ---------- antenne-installatie op het dak ----------
// Vakwerkframe als blok van 3,4 × 3,4 m, met vier antennepanelen van 0,9 m op de hoeken (dunne zendmasten weggelaten).
const frame = box(-1.7, -1.7, H.roof - 0.01, 1.7, 1.7, H.frame);
const corner = (s) => (s > 0 ? [0.8, 1.7] : [-1.7, -0.8]);
const panels = union([-1, 1].flatMap((sx) => [-1, 1].map((sy) => box(corner(sx)[0], corner(sy)[0], H.frame - 0.01, corner(sx)[1], corner(sy)[1], H.panels))));

const tower = union([body, frame, panels]).subtract(union([niches, ...JOINTS.map(joint)]));

await writeLandmark({
  slug: "watertoren-zaltbommel-nieuwe",
  base: BASE,
  // Eén node: de export vult elke node apart op.
  nodes: [["building:schacht-kegel-dak-en-antennes", tower]],
  catalog: {
    name: "Nieuwe watertoren Zaltbommel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6.6, 0], [-6.6, 0], [0, 6.6], [0, -6.6]],
    replacesBuildings: ["NL.IMBAG.Pand.0297100000002210"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +3,04 m), assen in RD-richting. Ronde betonnen schacht van 10,2 m met twaalf spitse nissen in de plint tot 4,4 m, vanaf 13,7 m een holle overgang naar een rechte kegel die uitwaaiert tot 19,7 m aan de dakrand, tien voegen om de 3,18 m vanaf 5,7 m, plat dak op 36,95 m met een afgeschuinde rand en een antenne-installatie tot 40,35 m. Maten uit AHN, BAG en drie frontale foto's.",
    realWorld: {
      publishedHeightM: 38,
      reservoirsM3: [1255, 875, 415],
      built: 1964,
      architect: "Brouwer en Deurvorst",
      rijksmonument: 532144,
      ahnGroundNapM: 3.04,
      ahnRoofNapM: 39.99,
      bagDiameterM: 10.2,
      topDiameterM: 19.7,
      coneKneeM: 15.7,
      coneAngleFromVerticalDeg: 12.6,
      joints: JOINTS,
      plinthNiches: 12,
      roofM: 36.95,
      modelTopM: 40.35,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Zaltbommel)",
      "https://commons.wikimedia.org/wiki/File:Zaltbommel_Nieuwe_Watertoren_gezien_vanaf_zuidelijk_fietspad_2024-09-24-2.jpg (frontaal, schachtprofiel, voegen en plint)",
      "https://commons.wikimedia.org/wiki/File:Zaltbommel_-_watertoren_gebouwd_in_1964.jpg (frontaal, schachtprofiel en voegen)",
      "https://commons.wikimedia.org/wiki/File:Zaltbommel_Nieuwe_Watertoren_gezien_vanaf_zuidelijk_fietspad_2024-09-24-1.jpg (plint, dakrand en antennes)",
      "PDOK BAG-pand 0297100000002210, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

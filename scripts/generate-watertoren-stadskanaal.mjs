// Watertoren van Stadskanaal (Waprog, vormgeving ir. H.F. Mertens, 1935),
// rijksmonument 516263, 42,76 m met een reservoir van 900 m³, in de stijl van
// de Amsterdamse School. Ronde bakstenen schacht met op de vier diagonalen een
// steunbeer van drie schijven (met de traplichten in de sleuven), op elk van
// de vier vlakken ertussen een sikkelvormige betonnen luifel onder het
// reservoir, een rond venster eronder en twee smalle vensters erboven, een
// kroonlijst en een iets terugliggende opbouw met plat dak en dakluik.
// Oorsprong op het hart van de cirkel door de BAG-contour (r 5,63 m) op
// maaiveld (NAP +7,25 m), assen in RD-richting: de steunberen staan in de BAG
// op 45 + k·90 graden. Hoogtes uit het AHN (dak, kroonlijst, kappen van de
// steunberen) en uit de schuine luchtfoto (0,32 m verschuiving per meter
// hoogte) en drie Commons-foto's; de ingang staat op het zuiden.
import { Manifold, CrossSection, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [261661.62, 555096.81];
const AXIS = [1, 0];
const BASE = -0.3;
const R = { shaft: 5.63, cornice: 5.93, drum: 5.1, roof: 4.75 };
const H = {
  cornice: 39.0, // onderkant van de kroonlijst (schuine onderkant tot 39,45)
  corniceTop: 39.85,
  rim: 42.65, // dakrand van de opbouw (AHN 42,6–42,8)
  roof: 42.2, // plat dak (AHN-mediaan NAP 49,42)
  hatch: 42.85, // dakluik, hoogste punt (AHN NAP 50,08)
  ledge: 26.8, // bovenkant van de luifels
  capWall: 36.2, // kap van de steunbeer tegen de schacht
  capOuter: 35.8, // en aan de buitenkant
};
// Steunberen: 2,44 m breed, buitenvlak op 8,27 m (BAG) dat met 2,6 cm per meter
// terugwijkt (AHN en foto: 7,33 m bij de kap), drie schijven met sleuven van 0,25 m.
const BUTTRESS = { half: 1.22, outer0: 8.27, batter: 0.026, slot: 0.25, slotDepth: 0.8 };
const outerAt = (z) => BUTTRESS.outer0 - BUTTRESS.batter * z;

// ---------- schacht, kroonlijst en opbouw als één omwentelingsprofiel ----------
const body = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.shaft, BASE], [R.shaft, H.cornice], [R.cornice, H.cornice + 0.45], [R.cornice, H.corniceTop],
    [R.drum, H.corniceTop], [R.drum, H.rim], [R.roof, H.rim], [R.roof, H.roof], [0, H.roof],
  ]]),
  128,
);

// ---------- vier steunberen op de diagonalen ----------
// Lokaal stelsel: x radiaal langs de diagonaal, y tangentieel.
const buttress = (() => {
  const { half } = BUTTRESS;
  const pts = [];
  for (const y of [-half, half]) {
    pts.push([4.6, y, BASE], [outerAt(BASE), y, BASE], [4.6, y, H.capWall], [R.shaft, y, H.capWall], [outerAt(H.capOuter), y, H.capOuter]);
  }
  const solid = hull(pts);
  const w = (2 * half - 2 * BUTTRESS.slot) / 3; // schijven van 0,65 m
  const slots = [-1, 1].map((s) => {
    const yc = s * (w / 2 + BUTTRESS.slot / 2), y0 = yc - BUTTRESS.slot / 2, y1 = yc + BUTTRESS.slot / 2;
    const ps = [];
    for (const z of [BASE - 1, H.capWall + 1]) {
      for (const y of [y0, y1]) ps.push([outerAt(z) - BUTTRESS.slotDepth, y, z], [outerAt(z) + 2, y, z]);
    }
    return hull(ps);
  });
  return solid.subtract(union(slots));
})();
const buttresses = union([45, 135, 225, 315].map((deg) => place(buttress, { deg })));

// ---------- sikkelvormige luifel op elk vlak ----------
// Steekt in het midden 0,9 m uit en aan de steunberen 0,25 m; voorkant 0,3 m
// hoog, schuine onderkant onder 56 graden terug naar de gevel.
const PHI0 = 90 / 2 - (Math.asin(BUTTRESS.half / R.shaft) * 180) / Math.PI; // halve vlakbreedte, 32,5 graden
const ledge = (() => {
  const n = 16, slices = [];
  const ring = (phi) => {
    const p = 0.25 + 0.65 * (1 - (phi / PHI0) ** 2);
    const t = (phi * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    const at = (r, z) => [r * c, r * s, z];
    return [at(5.2, H.ledge), at(R.shaft + p, H.ledge), at(R.shaft + p, H.ledge - 0.3), at(R.shaft, H.ledge - 0.3 - 1.5 * p), at(5.2, H.ledge - 0.3 - 1.5 * p)];
  };
  for (let i = 0; i < n; i++) {
    // Overlappende schijfjes: samenvallende zijvlakken lieten bij de vereniging een splinter achter.
    const a = -PHI0 + (2 * PHI0 * i) / n, b = Math.min(PHI0, -PHI0 + (2 * PHI0 * (i + 1.4)) / n);
    slices.push(hull([...ring(a), ...ring(b)]));
  }
  return union(slices);
})();
const ledges = union([0, 90, 180, 270].map((deg) => place(ledge, { deg })));

// ---------- dakluik ----------
const hatch = hull([[0.45, -1.65, H.roof - 0.2], [1.75, -1.65, H.roof - 0.2], [0.45, -0.35, H.roof - 0.2], [1.75, -0.35, H.roof - 0.2],
  [0.45, -1.65, H.hatch], [1.75, -1.65, H.hatch], [0.45, -0.35, H.hatch], [1.75, -0.35, H.hatch]]);

// ---------- nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Rond venster als zeshoek met de punt omhoog (zijden onder 60 graden), achterkant 1,5·diepte hoger.
const roundWindow = (f, rad, zc, depth = 0.3) => {
  const pts = [];
  for (let k = 0; k < 6; k++) {
    const t = Math.PI / 2 + (k * Math.PI) / 3, y = rad * Math.cos(t), z = zc + rad * Math.sin(t);
    pts.push([f - depth, y, z + 1.5 * depth], [f, y, z], [f + 1.0, y, z - 1.5]);
  }
  return hull(pts);
};
const faceCuts = (deg) => [
  place(roundWindow(R.shaft, 0.8, 21.5), { deg }), // rond venster onder de luifel
  place(niche(R.shaft, 0.5, 27.6, 29.1), { deg }), // twee smalle vensters boven de luifel
  place(niche(R.shaft, 0.5, 32.5, 34.0), { deg }),
];
const cuts = [
  ...[0, 90, 180, 270].flatMap(faceCuts),
  place(niche(R.shaft, 2.6, 0, 3.0, 0.4), { deg: 270 }), // ingang op het zuiden
  place(niche(R.shaft, 2.0, 12.8, 16.8), { deg: 270 }), // groot venster boven de ingang (luchtfoto)
];

await writeLandmark({
  slug: "watertoren-stadskanaal",
  base: BASE,
  // Eén node: de export vult elke node apart op; losse luifels of een losse opbouw zouden een eigen voet krijgen.
  nodes: [["building:schacht-steunberen-luifels-en-opbouw", union([body, buttresses, ledges, hatch]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Stadskanaal",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundHeight: 48.6, // NAP 7,25 + 41,35 (NLGEO2018-geoïde op de oorsprong)
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, 7.5], [0, -7.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0037100000008106"],
    description:
      "Oorsprong op het hart van de BAG-cirkel op maaiveld (NAP +7,25 m), assen in RD-richting. Ronde schacht van 11,26 m met vier steunberen van drie schijven op de diagonalen (2,44 m breed, tot 8,27 m uit het hart, kap op 36 m), op elk vlak een sikkelvormige luifel op 26,8 m, een rond venster en twee smalle vensters, ingang en groot venster op het zuiden, kroonlijst tot 39,85 m en een opbouw van 10,2 m met plat dak op 42,2 m, dakrand 42,65 m en dakluik tot 42,85 m. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 42.76,
      publishedBaseNapM: 7.1,
      reservoirM3: 900,
      ahnGroundNapM: 7.25,
      ahnRoofNapM: 49.42,
      ahnTopNapM: 50.08,
      geoidNlgeo2018M: 41.35,
      shaftDiameterM: 11.26,
      buttressWidthM: 2.44,
      buttressOuterFromAxisM: [8.27, 7.33],
      buttressCapM: [35.8, 36.2],
      ledgeTopM: 26.8,
      corniceM: [39.0, 39.85],
      drumDiameterM: 10.2,
      roofM: 42.2,
      rimM: 42.65,
      modelTopM: 42.85,
      minimumPartM: 0.65,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Stadskanaal)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_van_Stadskanaal.jpg (luifel, vensters, steunberen)",
      "https://commons.wikimedia.org/wiki/File:Stadskanaal_Watertoren_2006.JPG (steunbeer van drie schijven, kroonlijst en opbouw)",
      "https://commons.wikimedia.org/wiki/File:Watertoren%2Bmuseum.jpg (steunbeer van voren, luifels op twee vlakken)",
      "PDOK BAG-pand 0037100000008106, AHN DSM/DTM 0,5 m, luchtfoto 8 cm en NLGEO2018, 2026-11-01",
    ],
  },
});

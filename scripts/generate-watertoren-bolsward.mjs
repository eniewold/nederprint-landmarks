// Watertoren van Bolsward (1929, Bredasche Beton Mij. v/h H. Vriens), betonnen
// achthoek met twee reservoirs van 200 m³, sinds 2015 van Sonnema Berenburg.
// Oorsprong op het hart van de achthoekige BAG-contour op maaiveld (NAP +0,5 m).
// De achthoek is onregelmatig: vier brede vlakken (5,3 m, apothema 4,95) met
// normaal op 45 + k*90 graden en vier smalle (3,3 m, apothema 5,39) op k*90,
// in het lokale stelsel dat 1,65 graden linksom van RD-oost gedraaid staat.
// Hoogtes uit twee frontale foto's op een breed vlak (band op 22 m en dakvoet
// op 35 m bij een verhouding van 0,63), de kap uit AHN en luchtfoto. De deur
// staat in het brede vlak naar het noordwesten: op de foto's van 2019 staat het
// bijgebouw (BAG, ten noordoosten) links achter de toren.
import { Manifold, CrossSection, hull, ring3, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [162941.65, 564082.56];
const AXIS = [0.99959, 0.02879]; // 1,65 graden
const BASE = -0.3;
const H = {
  plinth: 1.4, // voetrand
  chamfer: 21.0, // onderkant van de schuine band
  band: 21.6, // het bovendeel staat vanaf hier in het vlak van de band
  windowLow: 33.5,
  windowHigh: 34.5,
  eave: 35.0, // dakrand, voet van de koperen kap
  knee: 36.2,
  apex: 37.3,
};
const NARROW = 5.39, WIDE = 4.95; // apothema's van de BAG-contour (het bovendeel)

// Hoekpunten als snijpunten van opeenvolgende vlakken (normaal k*45 graden).
const oct = (grow = 0) => {
  const A = Array.from({ length: 8 }, (_, k) => (k % 2 ? WIDE : NARROW) + grow);
  return A.map((a, k) => {
    const t0 = (k * Math.PI) / 4, t1 = ((k + 1) * Math.PI) / 4, b = A[(k + 1) % 8];
    const det = Math.sin(t1 - t0);
    return [(a * Math.sin(t1) - b * Math.sin(t0)) / det, (b * Math.cos(t0) - a * Math.cos(t1)) / det];
  });
};
const prismOct = (grow, z0, z1) => Manifold.extrude(new CrossSection([oct(grow)]), z1 - z0).translate([0, 0, z0]);

// ---------- voetrand, schacht, band met schuine onderkant, bovendeel en kap ----------
const body = union([
  prismOct(-0.1, BASE, H.plinth),
  prismOct(-0.2, H.plinth - 0.05, H.chamfer + 0.05),
  hull([...ring3(oct(-0.2), H.chamfer), ...ring3(oct(0), H.band)]),
  prismOct(0, H.band - 0.05, H.eave),
  // Koperen kap: steil tot de knik, dan flauw naar een kleine top.
  hull([...ring3(oct(-0.3), H.eave - 0.05), ...ring3(oct(-1.3), H.knee), ...ring3(oct(-3.6), H.apex)]),
]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const cuts = [
  place(niche(WIDE - 0.1, 1.8, 0, 2.4, 0.3), { deg: 135 }), // dubbele deur met bovenlicht
  // Vensterstrook onder de dakrand in elk breed vlak.
  ...[45, 135, 225, 315].map((deg) => place(niche(WIDE, 2.4, H.windowLow, H.windowHigh), { deg })),
];

await writeLandmark({
  slug: "watertoren-bolsward",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-bovendeel-en-kap", body.subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Bolsward",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8], [0, -8]],
    replacesBuildings: ["NL.IMBAG.Pand.0064100000129055"],
    description:
      "Oorsprong op het hart van de achthoekige BAG-contour op maaiveld (NAP +0,5 m), +X naar het smalle vlak op 1,65 graden (oost). Onregelmatige betonnen achthoek met brede vlakken van 5,3 m en smalle van 3,3 m (9,9 bij 10,8 m over de vlakken): voetrand, schacht 0,2 m ingesprongen tot de band met schuine onderkant op 21 m, bovendeel met vensterstrook tot de dakrand op 35 m en een koperen achtzijdige kap tot 37,3 m. Deur in het brede vlak naar het noordwesten. Maten uit BAG, AHN, Wikipedia en foto's.",
    realWorld: {
      publishedHeightM: 37.4,
      reservoirsM3: [200, 200],
      ahnGroundNapM: 0.49,
      ahnTopNapM: 37.68,
      acrossWideFacesM: 9.9,
      acrossNarrowFacesM: 10.78,
      shaftInsetM: 0.2,
      bandM: 21.6,
      eaveM: 35.0,
      modelTopM: 37.3,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Bolsward)",
      "https://commons.wikimedia.org/wiki/File:20190821_Bolsward_watertoren2.jpg (frontale foto, hoogtes, deur)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Bolsward_Industrieel_Erfgoed_in_Beeld,_18-03-1996,_signatuur_54992.jpg (breedte boven en onder de band)",
      "PDOK BAG-panden 0064100000129055 en 0064100000129086, AHN DSM/DTM 0,5 m en luchtfoto, 2026-10-31",
    ],
  },
});

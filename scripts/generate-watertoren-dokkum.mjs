// Watertoren van Dokkum (J.J.M. Vegter, 1958), rijksmonument 530878. Het
// reservoir van 1000 m³ is met witte tegeltjes bekleed; onder het platte dak
// een raamband voor het restaurant dat bij het ontwerp was voorzien.
// Oorsprong op het middelpunt van de ronde BAG-contour (het reservoir, 15,56 m)
// op maaiveld (NAP +0,8 m), assen in RD-richting. Hoogtes uit de RCE-foto
// 20421405 (camera recht, 24,7 px/m op de reservoirbreedte), gelezen op de
// raakpunten aan de zijkanten; de dakhoogte uit het AHN. De schacht is een
// achthoekige kern (vlakken 2,4 m) met acht ribben op de hoeken, 8,9 m over de
// ribben; de stand van de achthoek is niet bekend en staat op de RD-assen.
import { Manifold, CrossSection, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [195144.4, 593637.27];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  core: 20.0, // bovenkant van de kern, in de kegel
  fin: 21.0, // de ribben lopen door tot in de onderkant van het reservoir
  coneFoot: 19.8, // de kegelvormige onderkant begint op de kern
  rim: 21.6, // onderrand van het reservoir
  tiles: 30.6, // bovenkant van de tegelbekleding
  windowsTop: 31.6,
  fascia: 32.4,
  roof: 32.6,
  housing: 33.6, // dakopbouw met het lichtkoepeltje
};
const R = { core: 2.93, finOuter: 4.5, finWidth: 0.9, coneFoot: 3.2, tank: 7.78, windows: 7.28, roof: 7.98 };

// ---------- achthoekige kern met acht ribben ----------
const core = hull([...ring3(circle([0, 0], R.core / Math.cos(Math.PI / 8), 8, Math.PI / 8), BASE), ...ring3(circle([0, 0], R.core / Math.cos(Math.PI / 8), 8, Math.PI / 8), H.core)]);
const fin = Manifold.extrude(
  new CrossSection([[[R.core, -R.finWidth / 2], [R.finOuter, -R.finWidth / 2], [R.finOuter, R.finWidth / 2], [R.core, R.finWidth / 2]]]),
  H.fin - BASE,
).translate([0, 0, BASE]);
const fins = union(Array.from({ length: 8 }, (_, k) => place(fin, { deg: 22.5 + k * 45 }))); // op de hoeken van de kern

// ---------- reservoir als omwentelingsprofiel ----------
// Kegelvormige onderkant, tegelcilinder, verdiepte raamband, schuine dakrand en plat dak.
const tank = Manifold.revolve(
  new CrossSection([[
    [0, H.coneFoot], [R.coneFoot, H.coneFoot], [R.tank - 0.3, H.rim], [R.tank, H.rim], [R.tank, H.tiles], [R.windows, H.tiles],
    [R.windows, H.windowsTop], [R.roof, H.fascia], [R.roof, H.roof], [0, H.roof],
  ]]),
  96,
);
// Dakopbouw met de zeszijdige lichtkoepel, uit het midden (AHN).
const housing = hull([...ring3(circle([0.55, 0.6], 1.15, 6), H.roof - 0.05), ...ring3(circle([0.55, 0.6], 1.15, 6), H.housing)]);

await writeLandmark({
  slug: "watertoren-dokkum",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-met-ribben-reservoir-en-dak", union([core, fins, tank, housing])]],
  catalog: {
    name: "Watertoren Dokkum",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-9, 0], [0, 9], [0, -9]],
    replacesBuildings: ["NL.IMBAG.Pand.0058100000215831"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour (het reservoir) op maaiveld (NAP +0,8 m), assen in RD-richting. Achthoekige kern met acht ribben (8,9 m over de ribben) tot de kegelvormige onderkant van het reservoir, reservoir van 15,56 m met tegelbekleding van 21,6 tot 30,6 m, verdiepte raamband tot 31,6 m, schuine dakrand en plat dak op 32,6 m met een kleine dakopbouw tot 33,6 m. Maten uit BAG, AHN en een RCE-foto.",
    realWorld: {
      publishedHeightM: 37,
      reservoirM3: 1000,
      ahnGroundNapM: 0.79,
      ahnTopNapM: 36.24,
      bagTankDiameterM: 15.56,
      shaftAcrossFinsM: 9.0,
      coreFaceM: 2.43,
      rimM: 21.6,
      roofM: 32.6,
      modelTopM: 33.6,
      photoScalePxPerM: 24.7,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Dokkum)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/530878",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Dokkum_-_20421405_-_RCE.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:Zicht_op_het_bovenste_gedeelte_van_de_watertoren_-_Dokkum_-_20421409_-_RCE.jpg (ribben en onderkant)",
      "PDOK BAG-pand 0058100000215831, AHN DSM/DTM 0,5 m en luchtfoto, 2026-10-31",
    ],
  },
});

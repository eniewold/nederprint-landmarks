// Watertoren van Hoogeveen (A. Kool en J. Wildeboer, 1927), Vos van Steenwijklaan.
// Oorsprong op het hart van de twaalfzijdige schacht (midden van de BAG-contour
// en zwaartepunt van het AHN boven 8 m) op maaiveld (NAP +12,4 m), assen in
// RD-richting. De BAG-contour (60,8 m², slordig getekend) volgt zijden om de
// 30 graden, dus de vlakken van de twaalfhoek staan met hun normaal op N, O, Z
// en W. De deur met de vensterkolom erboven ligt op het zuidvlak (-Y), zoals op
// de Commons-foto met de container linksvoor en het kantoor rechts.
// Hoogtes uit die foto, geschaald op de AHN-top van 38,3 m (57 px/m); stralen
// uit de BAG-oppervlakte en de AHN-doorsnede per hoogte (verjonging ~0,2 m).
import { Manifold, circle, hull, ring3, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [229750.7, 527264.8];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  bandFoot: 27.9, // onderste witte band
  bandTop: 30.8, // bovenste witte band
  gutter: 36.9, // blauwe goot
  apex: 38.3, // top van de twaalfzijdige kap (antenne weggelaten)
};
const R = { foot: 4.55, bandFoot: 4.4, band: 4.55, gutter: 4.35, rim: 4.45 };
const N = 12;
const FRONT = -90; // deur naar -Y (zuid)
// Twaalfhoek met vlaknormalen op 0, 30, ... graden: r is de apothema (afstand tot het vlak).
const poly = (a, z) => ring3(circle([0, 0], a / Math.cos(Math.PI / N), N, Math.PI / N), z);
const prismoid = (a0, z0, a1, z1) => hull([...poly(a0, z0), ...poly(a1, z1)]);

// ---------- schacht, band en kap ----------
const body = union([
  prismoid(R.foot, BASE, R.bandFoot, H.bandFoot + 0.05), // verjongende schacht
  prismoid(R.band, H.bandFoot, R.band, H.bandTop), // band met witte randen en vensters, iets uitkragend
  prismoid(R.bandFoot - 0.02, H.bandTop - 0.05, R.gutter, H.gutter), // bovenste schacht rond het reservoir
  prismoid(R.rim, H.gutter - 0.25, R.rim, H.gutter + 0.1), // goot
  hull([...poly(R.gutter, H.gutter), [0, 0, H.apex]]), // lage twaalfzijdige kap
]);

// Venster of deur als ondiepe nis in het vlak met normaal +X op afstand f. Het plafond
// loopt naar binnen onder 45 graden op, zodat de export de nis niet opvult.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.0], [b, w / 2, z1 - 1.0]]);
};
const shaftA = (z) => R.foot + ((z - BASE) / (H.bandFoot - BASE)) * (R.bandFoot - R.foot);
const cuts = [
  place(niche(R.foot, 1.6, 0, 2.4, 0.3), { deg: FRONT }), // blauwe dubbele deur
  // Kolom van vier lamellenvensters boven de deur (trappenhuis).
  ...[[12.2, 13.6], [17.0, 18.4], [21.8, 23.2], [26.2, 27.5]].map(([z0, z1]) => place(niche(shaftA((z0 + z1) / 2), 0.7, z0, z1), { deg: FRONT })),
  // Band: vensters in de vlakken naast de voor- en achterzijde.
  ...[-30, 30, 150, 210].map((d) => place(niche(R.band, 0.6, 28.9, 29.8, 0.2), { deg: FRONT + d })),
];

await writeLandmark({
  slug: "watertoren-hoogeveen",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-band-en-kap", body.subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Hoogeveen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    replacesBuildings: ["NL.IMBAG.Pand.0118100000059573"],
    description:
      "Oorsprong op het hart van de twaalfzijdige schacht op maaiveld (NAP +12,4 m), deur naar -Y (zuid). Bakstenen twaalfhoek van 9,1 m over de vlakken, verjongend tot 8,8 m, met deur en een kolom lamellenvensters; band met witte randen en vensters van 27,9 tot 30,8 m; bovenste schacht rond het reservoir tot de goot op 36,9 m en een lage twaalfzijdige kap tot 38,3 m. Maten uit BAG, AHN en een Commons-foto.",
    realWorld: {
      publishedHeightM: 38.3,
      reservoirM3: 300,
      ahnGroundNapM: 12.38,
      ahnTopNapM: 50.68,
      bagAreaM2: 60.8,
      footAcrossFlatsM: 9.1,
      gutterAcrossFlatsM: 8.7,
      bandM: [27.9, 30.8],
      gutterM: 36.9,
      modelTopM: 38.3,
      photoScalePxPerM: 57,
      minimumPartM: 0.6,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Hoogeveen)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Hoogeveen.JPG (maten, deur en band)",
      "PDOK BAG-pand 0118100000059573, AHN DSM/DTM 0,5 m en luchtfoto, 2026-10-31",
    ],
  },
});

// Watertoren van Drachten (J.J.M. Vegter, 1959), gemeentelijk monument, met
// reservoirs van 500 en 1000 m³. Zustertoren van die in Dokkum: geribde
// achthoekige schacht en een met tegeltjes bekleed reservoir, hier met een
// licht bol dak en een zeszijdige glazen uitkijklantaarn met puntgevels.
// Oorsprong op het hart van het reservoir in het AHN (de BAG-contour is grof,
// straal 7,4 tot 8,6 m) op maaiveld (NAP +1,55 m), assen in RD-richting.
// Hoogtes uit de frontale foto "Watertoren Drachten 12w" (15,0 px/m, geschaald
// op de dakrand in het AHN), de lantaarn uit het AHN (hoeken op 45 + k*60
// graden) en de foto van de top. De deur staat naar het zuidoosten, aan het plein.
import { Manifold, CrossSection, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [201400.2, 570187.2];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  core: 22.2, // bovenkant van de kern, in de kegel
  fin: 23.2,
  coneFoot: 22.0, // de kegelvormige onderkant begint op de kern
  rim: 24.0, // onderrand van het reservoir
  shoulder: 34.5, // begin van de ronde dakrand
  roofEdge: 35.3,
  roof: 36.0, // het licht bolle dak bij de lantaarn
  eave: 40.3, // bovenkant van de lantaarngevels
  apex: 41.0, // toppen van de puntgevels en het midden van het dak
};
const R = { core: 2.93, finOuter: 4.5, finWidth: 0.9, coneFoot: 3.2, tank: 7.6, roofEdge: 6.8, lantern: 2.9 };
const LANTERN_CORNER = 45; // graden, dan elke 60

// ---------- achthoekige kern met acht ribben ----------
const core = hull([...ring3(circle([0, 0], R.core / Math.cos(Math.PI / 8), 8, Math.PI / 8), BASE), ...ring3(circle([0, 0], R.core / Math.cos(Math.PI / 8), 8, Math.PI / 8), H.core)]);
const fin = Manifold.extrude(
  new CrossSection([[[R.core, -R.finWidth / 2], [R.finOuter, -R.finWidth / 2], [R.finOuter, R.finWidth / 2], [R.core, R.finWidth / 2]]]),
  H.fin - BASE,
).translate([0, 0, BASE]);
const fins = union(Array.from({ length: 8 }, (_, k) => place(fin, { deg: 22.5 + k * 45 }))); // op de hoeken van de kern

// ---------- reservoir als omwentelingsprofiel ----------
// Kegelvormige onderkant, tegelcilinder, ronde dakrand en licht bol dak.
const shoulder = Array.from({ length: 5 }, (_, k) => {
  const t = ((k + 1) / 6) * (Math.PI / 2);
  return [R.roofEdge + (R.tank - R.roofEdge) * Math.cos(t), H.shoulder + (H.roofEdge - H.shoulder) * Math.sin(t)];
});
const tank = Manifold.revolve(
  new CrossSection([[
    [0, H.coneFoot], [R.coneFoot, H.coneFoot], [R.tank - 0.3, H.rim], [R.tank, H.rim], [R.tank, H.shoulder], ...shoulder,
    [R.roofEdge, H.roofEdge], [R.lantern, H.roof], [0, H.roof],
  ]]),
  96,
);

// ---------- zeszijdige lantaarn met puntgevels ----------
const hex = (r) => circle([0, 0], r, 6, (LANTERN_CORNER * Math.PI) / 180);
const corners = hex(R.lantern);
const lanternBody = hull([...ring3(corners, H.roof - 0.3), ...ring3(corners, H.eave)]);
// Per vlak een wig van de gevel naar het midden: de gevels staan in de vlakken,
// de kilgoten lopen van de hoeken omhoog naar de nok in het midden.
const gables = union(
  corners.map((a, k) => {
    const b = corners[(k + 1) % 6];
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    return hull([[...a, H.eave - 0.05], [...b, H.eave - 0.05], [...m, H.apex], [0, 0, H.eave - 0.05], [0, 0, H.apex]]);
  }),
);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const lanternApothem = R.lantern * Math.cos(Math.PI / 6);
const cuts = [
  place(niche(R.core, 2.0, 0, 2.6, 0.3), { deg: -45 }), // deur naar het plein
  // Glaspuien van de lantaarn: één hoge nis per vlak tussen de hoekpijlers.
  ...Array.from({ length: 6 }, (_, k) => place(niche(lanternApothem, 2.0, H.roof + 0.3, H.eave - 0.4, 0.2), { deg: LANTERN_CORNER + 30 + k * 60 })),
];

await writeLandmark({
  slug: "watertoren-drachten",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-met-ribben-reservoir-en-lantaarn", union([core, fins, tank, lanternBody, gables]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Drachten",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-9, 0], [0, 9], [0, -9]],
    replacesBuildings: ["NL.IMBAG.Pand.0090100000606260"],
    description:
      "Oorsprong op het hart van het reservoir in het AHN op maaiveld (NAP +1,55 m), assen in RD-richting. Achthoekige kern met acht ribben (8,9 m over de ribben) en een deur naar het zuidoosten, reservoir van 15,2 m met kegelvormige onderkant van 22 tot 24 m en tegelbekleding tot 34,5 m, ronde dakrand en licht bol dak tot 36 m, zeszijdige glazen lantaarn van 5,0 m met puntgevels tot 41 m. Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 42,
      reservoirsM3: [500, 1000],
      ahnGroundNapM: 1.55,
      ahnTopNapM: 43.54,
      tankDiameterM: 15.2,
      shaftAcrossFinsM: 9.0,
      rimM: 24.0,
      roofEdgeM: 35.3,
      lanternAcrossFlatsM: 5.0,
      eaveM: 40.3,
      modelTopM: 41.0,
      photoScalePxPerM: 15.0,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Drachten)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Drachten_12w.JPG (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:De_top_van_de_watertoren._Drachten.JPG (lantaarn)",
      "PDOK BAG-pand 0090100000606260, AHN DSM/DTM 0,5 m en luchtfoto, 2026-10-31",
    ],
  },
});

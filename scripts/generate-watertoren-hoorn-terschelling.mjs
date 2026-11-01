// Watertoren van Hoorn op Terschelling (1958), 10 m hoog met één reservoir van
// 200 m³, op een duin in het Hoornse Bos aan de Duinweg. Een bakstenen cilinder
// met een betonnen dakrand en een plat dak, met aan de zuidzuidoostkant een laag
// betonnen deurportaal van drie vlakken met een overstekend plat dak.
// Oorsprong op het middelpunt van de cirkel door de BAG-contour (straal 3,27 m,
// het bovenaanzicht met de dakrand) op maaiveld (NAP +17,9 m in het AHN-DTM),
// assen in RD-richting. Het portaal komt uit de BAG-contour (drie vlakken van
// 1,3 m tussen -87 en -40 graden, 1,45 m voor de muur), de hoogtes uit het AHN
// (dakrand NAP +27,1, dak tot +27,5, dakluik tot +28,6, portaaldak +20,45) en
// de verhoudingen uit de enige Commons-foto, frontaal op het portaal (tank
// 6,55 m = 83 px/m; het portaal staat dichter bij de camera, 136 px/m op de
// AHN-hoogte van 2,6 m).
import { CrossSection, Manifold, circle, hull, place, ring3, union, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [152416.89, 601676.59];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  coping: 8.85, // onderkant van de betonnen dakrand (de schuine kraag begint hier)
  copingFoot: 9.07, // de kraag loopt onder 56 graden naar buiten
  roofEdge: 9.25, // bovenkant van de dakrand (AHN NAP +27,1)
  roof: 9.5, // het dak loopt licht op naar het midden (AHN tot NAP +27,5)
  hatch: 10.5, // dakluik of ontluchting in het midden (AHN NAP +28,4 tot 28,6)
  porchWall: 2.1, // bovenkant van de portaalmuren, voet van de schuine dakrand
  porchFascia: 2.4,
  porchRoof: 2.65, // AHN NAP +20,45
};
const R = { wall: 3.15, coping: 3.3, roofInner: 2.95, hatch: 0.7 };

// ---------- bakstenen cilinder, dakrand en dak als omwentelingsprofiel ----------
const tank = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.wall, BASE], [R.wall, H.coping], [R.coping, H.copingFoot], [R.coping, H.roofEdge], [R.roofInner, H.roofEdge], [0, H.roof],
  ]]),
  96,
);
// Dakluik of ontluchtingskap, iets uit het midden (AHN).
const hatchRing = circle([-0.15, 0.2], R.hatch / Math.cos(Math.PI / 8), 8, Math.PI / 8);
const hatch = hull([...ring3(hatchRing, H.roof - 0.4), ...ring3(hatchRing, H.hatch)]);

// ---------- deurportaal van drie vlakken met overstekend plat dak ----------
const PORCH = -63.4; // richting van het middelste vlak met de deur (zuidzuidoost)
const porchPts = (grow = 0) => {
  const at = (deg, r) => [r * Math.cos(((PORCH + deg) * Math.PI) / 180), r * Math.sin(((PORCH + deg) * Math.PI) / 180)];
  const wide = 23.3 + (grow / 4.71) * (180 / Math.PI);
  // Binnenhoeken in de cilinder; buitenhoeken uit de BAG-contour.
  return [at(-wide, 2.8), at(-wide, 4.71 + grow), at(-8.0, 4.84 + grow), at(8.0, 4.84 + grow), at(wide, 4.71 + grow), at(wide, 2.8)];
};
const porchBody = hull([...ring3(porchPts(), BASE), ...ring3(porchPts(), H.porchWall + 0.05)]);
// Dakplaat 0,2 m overstek met een schuine onderkant onder 56 graden.
const porchRoof = hull([...ring3(porchPts(), H.porchWall), ...ring3(porchPts(0.2), H.porchFascia), ...ring3(porchPts(0.2), H.porchRoof)]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Nis midden op het vlak p→q (veelhoek tegen de klok in, buitenkant rechts van p→q).
const faceNiche = (p, q, w, z0, z1, depth) => {
  const deg = (Math.atan2(-(q[0] - p[0]), q[1] - p[1]) * 180) / Math.PI; // buitennormaal
  const t = (deg * Math.PI) / 180;
  const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const f = m[0] * Math.cos(t) + m[1] * Math.sin(t); // apothema
  const s = -m[0] * Math.sin(t) + m[1] * Math.cos(t); // midden van het vlak langs het vlak
  return place(niche(f, w, z0, z1, depth).translate([0, s, 0]), { deg });
};
const P = porchPts();
const cuts = [
  faceNiche(P[2], P[3], 0.95, 0, 2.0, 0.3), // deur in het middelste vlak
  faceNiche(P[1], P[2], 0.9, 0.25, 1.95, 0.2), // dichte panelen met grindbeton in de zijvlakken
  faceNiche(P[3], P[4], 0.9, 0.25, 1.95, 0.2),
];

await writeLandmark({
  slug: "watertoren-hoorn-terschelling",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:cilinder-dakrand-dakluik-en-portaal", union([tank, hatch, porchBody, porchRoof]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Hoorn (Terschelling)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5, 0], [-5, 0], [0, 5], [-1.5, -5]],
    replacesBuildings: ["NL.IMBAG.Pand.0093100000216576"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +17,9 m), assen in RD-richting. Bakstenen cilinder van 6,3 m tot 8,85 m met een betonnen dakrand van 6,6 m tot 9,25 m, licht oplopend dak tot 9,5 m en een dakluik tot 10,5 m; aan de zuidzuidoostkant een betonnen deurportaal van drie vlakken met deur, panelen en een overstekend plat dak op 2,65 m. Maten uit BAG, AHN en een foto.",
    realWorld: {
      publishedHeightM: 10,
      reservoirM3: 200,
      ahnGroundNapM: 17.9,
      ahnRoofEdgeNapM: 27.1,
      ahnTopNapM: 28.6,
      bagDiameterM: 6.55,
      wallDiameterM: 6.3,
      roofEdgeM: 9.25,
      porchRoofM: 2.65,
      porchDepthM: 1.5,
      modelTopM: 10.5,
      photoScalePxPerM: 83,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Hoorn_Terschelling)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Hoorn,_Terschelling.jpg (frontale foto op het portaal, verhoudingen)",
      "PDOK BAG-pand 0093100000216576, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

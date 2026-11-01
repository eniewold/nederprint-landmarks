// Watertoren van Oosterbeek (Th.K.J. Koch, 1938), gemeentelijk monument, 22,35 m
// hoog met een reservoir van 150 m³. Ronde bakstenen toren in het bos aan de
// noordkant van Oosterbeek: een licht taps toelopende schacht met lisenen, een
// stenen band met consoles op de hoogte van de reservoirvloer, daarboven vier
// uitgebouwde smalle vensters met een kapje en een balkonkastje op de band, een
// dunne afdeklijst en een plat dak achter de borstwering. Aan de zuidkant een
// trappentoren met ronde kop die als trappenhuis boven het dak uitkomt.
// Oorsprong op het hart van de BAG-cirkel (straal 4,02 m, valt samen met het AHN)
// op maaiveld NAP +55,25 m, assen in RD-richting. Hoogtes uit het AHN (dak,
// borstwering, trappenhuis) en de enige Commons-foto (vanuit het noordoosten,
// band en vensters geteld in steenlagen van 6,25 cm vanaf de borstwering).
import { Manifold, CrossSection, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [184278.04, 444665.48];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  roof: 19.75, // plat dak, NAP +75,0
  parapet: 20.8, // bovenkant borstwering, NAP +76,05
  bandTop: 15.3, // stenen band op de reservoirvloer
  bandFoot: 14.9,
  corbelFoot: 14.3, // consoles onder de band
  boxFoot: 14.45, // balkonkastjes op de band
  bayFoot: 16.75, // uitgebouwde vensters
  bayTop: 19.0,
  stair: 22.6, // trappenhuis, NAP +77,85
  plant: 23.65, // installatieblok met antennekasten, NAP +78,9
};
// Schacht taps van 4,02 (BAG, aan de voet) naar 3,92 (AHN, onder de afdeklijst).
const R = (z) => 4.02 - (0.1 * z) / H.parapet;
const PARAPET = 0.9; // borstwering, dikker dan in het echt (0,5 m) om op 1:1000 te staan
const T = Math.tan((56 * Math.PI) / 180); // ondervlakken van lijsten en consoles onder 56 graden
const STAIR = { x: 0.1, south: -4.49, north: 0.85, r: 1.03 }; // trappentoren: BAG-uitbouw en AHN-trappenhuis

// ---------- schacht, borstwering en dak ----------
const shaft = Manifold.revolve(new CrossSection([[[0, BASE], [R(BASE), BASE], [R(H.parapet), H.parapet], [0, H.parapet]]]), 96)
  .subtract(Manifold.cylinder(2, R(H.parapet) - PARAPET, R(H.parapet) - PARAPET, 96).translate([0, 0, H.roof]));
// Afdeklijst: 0,08 m uit, schuin ondervlak.
const rTop = R(H.parapet);
const coping = Manifold.revolve(
  new CrossSection([[[rTop - 0.3, H.parapet - 0.37], [rTop, H.parapet - 0.37], [rTop + 0.08, H.parapet - 0.37 + 0.08 * T], [rTop + 0.08, H.parapet], [rTop - 0.3, H.parapet]]]),
  96,
);
// Stenen band, 0,2 m uit, met een schuin ondervlak naar de muur.
const rb = R(H.bandFoot);
const band = Manifold.revolve(
  new CrossSection([[[rb - 0.3, H.bandFoot - 0.2 * T], [rb, H.bandFoot - 0.2 * T], [rb + 0.2, H.bandFoot], [rb + 0.2, H.bandTop], [rb - 0.3, H.bandTop]]]),
  96,
);

// ---------- consoles en lisenen om de 45 graden (die op het zuiden is de trappentoren) ----------
const CORBEL_W = 0.55;
const rc = R(H.corbelFoot);
const corbel = hull(
  [-1, 1].flatMap((s) => [
    [rc - 0.2, (s * CORBEL_W) / 2, H.corbelFoot - 0.06 * T], [rc - 0.06, (s * CORBEL_W) / 2, H.corbelFoot - 0.06 * T],
    [rc + 0.3, (s * CORBEL_W) / 2, H.corbelFoot + 0.3 * T], [rc + 0.3, (s * CORBEL_W) / 2, H.bandTop], [rc - 0.2, (s * CORBEL_W) / 2, H.bandTop],
  ]),
);
const lisene = hull(
  [-1, 1].flatMap((s) => [
    [R(BASE) - 0.2, (s * CORBEL_W) / 2, BASE], [R(BASE) + 0.1, (s * CORBEL_W) / 2, BASE],
    [R(H.corbelFoot) - 0.2, (s * CORBEL_W) / 2, H.corbelFoot], [R(H.corbelFoot) + 0.1, (s * CORBEL_W) / 2, H.corbelFoot],
  ]),
);
const CORBEL_DEG = [0, 45, 90, 135, 180, 225, 315];
const corbels = union(CORBEL_DEG.flatMap((deg) => [place(corbel, { deg }), place(lisene, { deg })]));

// ---------- vier uitgebouwde vensters met een balkonkastje op de band ----------
// Op de foto: bij 67,5 en -22,5 graden (tussen de consoles); de andere twee gespiegeld om de as van de trappentoren.
const WINDOW_DEG = [-22.5, 67.5, 112.5, 202.5];
const rw = R(17.9);
const BAY = { w: 0.9, d: 0.25 };
const bay = hull(
  [-1, 1].flatMap((s) => [
    [rw - 0.2, (s * BAY.w) / 2, H.bayFoot - (BAY.d + 0.06) * T], [rw - 0.06, (s * BAY.w) / 2, H.bayFoot - (BAY.d + 0.06) * T],
    [rw + BAY.d, (s * BAY.w) / 2, H.bayFoot], [rw + BAY.d, (s * BAY.w) / 2, H.bayTop], [rw - 0.2, (s * BAY.w) / 2, H.bayTop],
  ]),
);
// Kapje: 0,1 m uit over voor- en zijkanten, onder 56 graden.
const hood = hull(
  [-1, 1].flatMap((s) => [
    [rw - 0.2, (s * BAY.w) / 2, H.bayTop], [rw + BAY.d, (s * BAY.w) / 2, H.bayTop],
    [rw - 0.2, s * (BAY.w / 2 + 0.1), H.bayTop + 0.1 * T], [rw + BAY.d + 0.1, s * (BAY.w / 2 + 0.1), H.bayTop + 0.1 * T],
    [rw - 0.2, s * (BAY.w / 2 + 0.1), H.bayTop + 0.28], [rw + BAY.d + 0.1, s * (BAY.w / 2 + 0.1), H.bayTop + 0.28],
  ]),
);
const BOX = { w: 1.2, d: 0.55 };
const rx = R(H.boxFoot);
const box = hull(
  [-1, 1].flatMap((s) => [
    [rx - 0.3, (s * BOX.w) / 2, H.boxFoot - (BOX.d + 0.06) * T], [rx - 0.06, (s * BOX.w) / 2, H.boxFoot - (BOX.d + 0.06) * T],
    [rx + BOX.d, (s * BOX.w) / 2, H.boxFoot], [rx + BOX.d, (s * BOX.w) / 2, H.bandTop], [rx - 0.3, (s * BOX.w) / 2, H.bandTop],
  ]),
);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const glazing = niche(rw + BAY.d, 0.55, 17.0, 18.85, 0.15);
const windows = union(WINDOW_DEG.flatMap((deg) => [place(bay, { deg }), place(hood, { deg }), place(box, { deg })]));

// ---------- trappentoren met ronde koppen, als trappenhuis boven het dak ----------
const stadium = (z0, z1) =>
  hull([
    ...ring3(circle([STAIR.x, STAIR.south], STAIR.r, 32), z0), ...ring3(circle([STAIR.x, STAIR.south], STAIR.r, 32), z1),
    ...ring3(circle([STAIR.x, STAIR.north], STAIR.r, 32), z0), ...ring3(circle([STAIR.x, STAIR.north], STAIR.r, 32), z1),
  ]);
const stair = stadium(BASE, H.stair);
// Installatieblok met de antennekasten op het trappenhuis (AHN en 3D BAG), binnen de omtrek.
const plant = Manifold.cube([1.9, 2.8, H.plant - H.stair + 0.1]).translate([STAIR.x - 0.95, -2.0, H.stair - 0.1]);
const door = place(niche(STAIR.r, 1.0, 0, 2.2, 0.3), { deg: -90, at: [STAIR.x, STAIR.south, 0] });

const tower = union([shaft, coping, band, corbels, windows, stair, plant])
  .subtract(union([...WINDOW_DEG.map((deg) => place(glazing, { deg })), door]));

await writeLandmark({
  slug: "watertoren-oosterbeek",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-met-band-vensters-en-trappentoren", tower]],
  catalog: {
    name: "Watertoren Oosterbeek",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5.5, 0], [-5.5, 0], [0, 5.5], [0, -7]],
    replacesBuildings: ["NL.IMBAG.Pand.0274100000009522"],
    description:
      "Oorsprong op het hart van de BAG-cirkel op maaiveld (NAP +55,25 m), assen in RD-richting. Ronde schacht van 8,0 m, taps naar 7,8 m, met lisenen en een stenen band met consoles op 15,3 m, vier uitgebouwde vensters met kapje en balkonkastje, afdeklijst en borstwering tot 20,8 m rond een plat dak op 19,75 m; trappentoren met ronde kop aan de zuidkant met deur, als trappenhuis tot 22,6 m met een installatieblok tot 23,65 m. Maten uit AHN, BAG en de foto.",
    realWorld: {
      publishedHeightM: 22.35,
      reservoirM3: 150,
      ahnGroundNapM: 55.25,
      ahnRoofNapM: 75.0,
      ahnParapetNapM: 76.05,
      ahnStairHouseNapM: 77.85,
      bagShaftDiameterM: 8.04,
      shaftTopDiameterM: 7.84,
      bandTopM: 15.3,
      brickCoursesParapetToBand: 88,
      stairTurretWidthM: 2.06,
      stairTurretProjectionM: 1.6,
      modelTopM: 23.65,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Oosterbeek)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Oosterbeek.jpg (foto vanuit het noordoosten, maten in steenlagen)",
      "PDOK BAG-pand 0274100000009522, AHN DSM/DTM 0,5 m en luchtfoto, 3D BAG (dakhoogtes), 2026-11-01",
    ],
  },
});

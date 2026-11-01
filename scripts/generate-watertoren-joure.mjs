// Watertoren van Joure (C.J. Wierda, 1928), betonskelet met bakstenen vakken,
// 150 m³, sinds 1990 woonhuis met twee lage vleugels.
// Oorsprong op het hart van de achthoekige BAG-contour (pand 0051100001222389,
// apothema 3,98 m, de hoekpunten passen op 3 cm) op maaiveld (NAP +0,3 m).
// +X staat loodrecht op het oostvlak, 17,1 graden linksom van RD-oost; de
// vlakken van de achthoek staan op 0, 45, ... graden.
// Hoogtes: dak uit de 3D BAG (AHN5, 2023: nok 29,2 m boven maaiveld, dakvoet
// rond r = 4 op 27,0 m, dus 28 graden helling). Overige hoogtes uit de RCE-foto
// 62618 (1991, recht op het oostvlak), geschaald tussen de onderkant van de
// dakrand (26,1 m) en de aansluiting van de oostvleugel (5,2 m): 37,9 px/m.
// Breedtes uit dezelfde foto, geschaald op de dakrand (ortho: omgeschreven
// straal 5,5 m) en de BAG-voet. De vensters in de schuine vlakken naast het
// oostvlak komen van de latere foto "Watertoren Joure uo".
// De vleugels zijn BAG-vormen met de dakvlakken uit de 3D BAG.
import { Manifold, CrossSection, hull, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [182684.16, 553077.5];
const AXIS = [0.9558, 0.2941];
const BASE = -0.3;
const H = {
  plinth: 0.6, // lichte voet, daarboven wijken de hoekpijlers uit
  flare: 4.2, // einde van de uitwijkende voet
  panelFoot: 5.9, // lichte band onder de bakstenen vakken van de schacht
  shaftTop: 16.75, // begin van de kraag naar het reservoir
  corbelTop: 18.05,
  beltTop: 18.85, // betonnen band onder het reservoir
  capitals: 23.4, // de hoekpijlers verbreden zich tot kapitelen
  frieze: 24.4, // lichte fries met ventilatieramen
  soffit: 26.1, // onderkant van de overstekende dakrand
  eave: 26.55, // bovenkant van de dakrand, voet van het tentdak
  apex: 29.2, // nok (3D BAG 29,26 NAP); bol en bliksemafleider weggelaten
};
// Apothema's (afstand van het hart tot het vlak).
const A = { foot: 3.98, shaftFoot: 3.68, shaftTop: 3.37, tank: 4.13, belt: 4.25, eave: 5.08 };

// ---------- achthoekige toren als omwentelingsprofiel in acht segmenten ----------
// Profiel (apothema, hoogte); revolve zet de hoeken op 0, 45, ... graden, dus
// straal = apothema / cos(22,5°) en daarna 22,5 graden draaien.
const R8 = (a) => a / Math.cos(Math.PI / 8);
const tower = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [A.foot, BASE], [A.foot, H.plinth],
    [A.shaftFoot, H.flare], // uitwijkende voet
    [A.shaftTop, H.shaftTop], // verjongende schacht
    [A.tank, H.corbelTop], // kraag onder 60 graden
    [A.belt, H.corbelTop + 0.15], [A.belt, H.beltTop], [A.tank, H.beltTop], // band met schuine onderkant (51 graden)
    [A.tank, H.soffit], // reservoir
    [A.eave, H.soffit], [A.eave, H.eave], // overstekende dakrand met vlakke onderkant
    [0, H.apex], // koperen tentdak in acht vlakken
  ].map(([a, z]) => [R8(a), z])]),
  8,
).rotate([0, 0, 22.5]);

// Verdiept vak in het vlak met normaal +X, dat van apothema f0 op z0 naar f1 op z1
// verloopt (verjongende schacht). Het plafond loopt naar binnen onder 56 graden op,
// zodat de export het vak niet opvult.
const recess = (f0, w0, z0, f1, w1, z1, depth) => {
  const zc = z1 + 1.5 * depth;
  return hull([
    [f0 - depth, -w0 / 2, z0], [f0 + 1, -w0 / 2, z0], [f0 - depth, w0 / 2, z0], [f0 + 1, w0 / 2, z0],
    [f1 - depth, -w1 / 2, zc], [f1, -w1 / 2, z1], [f1 - depth, w1 / 2, zc], [f1, w1 / 2, z1],
    [f1 + 1, -w1 / 2, z1 - 1.5], [f1 + 1, w1 / 2, z1 - 1.5],
  ]);
};
const shaftA = (z) => A.shaftFoot + ((z - H.flare) / (H.shaftTop - H.flare)) * (A.shaftTop - A.shaftFoot);
const side = (a) => 2 * a * Math.tan(Math.PI / 8); // zijde van de achthoek
const PILASTER = 0.4; // hoekpijler per vlak, gemeten van de hoek
const PANEL = 0.3; // diepte van de bakstenen vakken achter het betonskelet (zichtbaar op 1:1000)
const shaftPanel = (() => {
  const z0 = H.panelFoot, z1 = H.shaftTop - 0.5, a0 = shaftA(z0), a1 = shaftA(z1);
  return recess(a0, side(a0) - 2 * PILASTER, z0, a1, side(a1) - 2 * PILASTER, z1, PANEL);
})();
const tankPanel = union([
  recess(A.tank, 2.2, H.beltTop + 0.15, A.tank, 2.2, H.capitals, PANEL),
  recess(A.tank, 1.4, H.beltTop + 0.15, A.tank, 1.4, H.frieze, PANEL), // tussen de kapitelen
]);
const vent = recess(A.tank, 1.6, 25.05, A.tank, 1.6, 25.6, 0.25); // ventilatieraam in de fries
// Twee hoge smalle vensters in de vakken van de vlakken op ±45 graden (trappenhuis).
const shaftWindow = (z0, z1) => recess(shaftA(z0) - PANEL, 0.6, z0, shaftA(z1) - PANEL, 0.6, z1, 0.25);
const cuts = [
  ...Array.from({ length: 8 }, (_, k) => [shaftPanel, tankPanel, vent].map((m) => place(m, { deg: k * 45 }))).flat(),
  ...[45, -45].flatMap((deg) => [shaftWindow(7.6, 10.3), shaftWindow(11.8, 14.6)].map((m) => place(m, { deg }))),
];

// ---------- vleugels van de woning (1990) ----------
// Lessenaarsdak z = a u + b v + c door drie punten (3D BAG, NAP min 0,3 m maaiveld).
const plane3 = ([x1, y1, z1], [x2, y2, z2], [x3, y3, z3]) => {
  const ux = x2 - x1, uy = y2 - y1, uz = z2 - z1, vx = x3 - x1, vy = y3 - y1, vz = z3 - z1;
  const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
  const a = -nx / nz, b = -ny / nz;
  return [a, b, z1 - a * x1 - b * y1];
};
const roofPlane = (poly, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, 12).trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Westvleugel: een wig die van het westvlak naar een smalle punt loopt, met een
// lessenaarsdak van 6,9 m aan de toren naar 2,0 m op de punt.
const westWing = roofPlane(
  [[0, 0], [-3.99, 1.66], [-4.82, 2.01], [-12.65, 5.62], [-13.28, 5.06], [-7.11, -1.03], [-5.65, -2.48], [-3.95, -1.73]],
  plane3([-4.8, 2.0, 6.9], [-5.6, -2.5, 6.3], [-13.3, 5.1, 2.0]),
);
// Oostvleugel: plat dak op 3,25 m, met aan de noordzijde een dakvlak dat van 5,4 m
// aan de toren naar 3,0 m aan de oostgevel afloopt.
const eastPoly = [[0, 0], [3.98, 1.65], [8.73, 3.72], [8.76, -3.78], [3.12, -9.15], [2.3, -6.34], [1.65, -3.98]];
const eastWing = union([
  prism(eastPoly, BASE, 3.25),
  roofPlane([[0, 0], [3.98, 1.65], [8.73, 3.72], [8.76, -3.6], [5.6, -2.1], [5.0, -2.0], [3.98, -1.65]], plane3([4.9, 1.9, 4.94], [8.7, 3.7, 3.01], [8.8, -3.5, 2.99])),
]);

await writeLandmark({
  slug: "watertoren-joure",
  base: BASE,
  // Eén node: de export vult elke node apart op; de vleugels staan op het maaiveld tegen de toren.
  nodes: [["building:schacht-reservoir-tentdak-en-vleugels", union([tower.subtract(union(cuts)), westWing, eastWing])]],
  catalog: {
    name: "Watertoren Joure",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, 5.5], [0, -5.5], [10.5, 0], [-8, 5.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0051100001222389"],
    description:
      "Oorsprong op het hart van de achthoekige BAG-contour op maaiveld (NAP +0,3 m), +X loodrecht op het oostvlak (17,1 graden). Achthoekig betonskelet met verdiepte bakstenen vakken: uitwijkende voet van 7,96 m over de vlakken, verjongende schacht tot 16,75 m met twee vensters in de vlakken naast het oostvlak, kraag naar het reservoir van 8,26 m met band, kapitelen en een fries met ventilatieramen, overstekende dakrand van 10,16 m op 26,1 tot 26,55 m en een achtzijdig koperen tentdak tot 29,2 m; lage west- en oostvleugel van de woning met lessenaarsdaken. Maten uit BAG, 3D BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 30.3,
      reservoirM3: 150,
      ahnGroundNapM: 0.3,
      bag3dRidgeNapM: 29.26,
      footAcrossFlatsM: 7.96,
      shaftTopAcrossFlatsM: 6.74,
      tankAcrossFlatsM: 8.26,
      eaveAcrossFlatsM: 10.16,
      soffitM: 26.1,
      eaveM: 26.55,
      modelTopM: 29.2,
      roofPitchDeg: 28,
      photoScalePxPerM: 37.9,
      minimumPartM: 0.6,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Joure)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_in_Joure_verbouwd_tot_woning,_21-08-1991,_signatuur_62618.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Joure_uo.JPG (vensters, dakrand)",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0051100001222389 (dakvlakken, AHN5 2023)",
      "PDOK BAG-pand 0051100001222389, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

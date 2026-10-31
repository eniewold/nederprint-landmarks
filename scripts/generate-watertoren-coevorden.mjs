// Watertoren van Coevorden (J.P. Hazeu, 1914, rijksmonument 468592).
// Oorsprong op het middelpunt van de ronde BAG-contour (straal 3,9 m) op
// maaiveld (NAP +11,4 m). De deur met de stoep ligt naar -Y, op 242 graden
// linksom van RD-oost (zuidwest, zoals de stoep op de luchtfoto).
// Hoogtes en stralen uit de frontale RCE-foto 20322147, geschaald op de
// BAG-doorsnede van de voet (50 px/m op 1028 px breed); daarmee komt de kap van
// de lantaarn op 32,2 m, gelijk aan het AHN. Het AHN zelf is rond de toren
// vervuild door parkbomen en heeft gaten op het zinken dak.
import { Manifold, CrossSection, box, circle, hull, ring3, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [246787.11, 520566.99];
const AXIS = [0.8829, -0.4695];
const BASE = -0.3;
const H = {
  plinth: 0.5, // donkere plint
  cordonFoot: 6.0, // gepleisterde voet tot de cordonlijst
  shaftFoot: 6.85,
  shaftTop: 16.5, // verjongende bakstenen schacht
  friezeTop: 18.7, // fries van boognissen
  corbelFoot: 18.95, // kwartholle kraag naar het reservoir
  tankFoot: 20.45,
  tankTop: 25.95,
  eave: 26.7, // kroonlijst
  lanternFoot: 30.4,
  lanternTop: 31.5,
  capTop: 32.2,
  needleTop: 34.8,
};
const R = { plinth: 4.0, foot: 3.9, footTop: 3.76, cordon: 3.86, shaftFoot: 3.47, shaftTop: 3.0, frieze: 3.05, ledge: 3.15, tank: 4.1, eave: 4.55, roof: 4.5, lantern: 1.15 };

// ---------- omwentelingsprofiel (r, z): plint, voet, cordonlijst, schacht, fries, kraag, reservoir, kroonlijst ----------
const corbel = Array.from({ length: 10 }, (_, k) => {
  const t = ((k + 1) / 10) * (Math.PI / 2);
  return [R.tank - (R.tank - R.ledge) * Math.cos(t), H.corbelFoot + (H.tankFoot - H.corbelFoot) * Math.sin(t)];
});
const profile = [
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.foot, H.plinth],
  [R.footTop, H.cordonFoot], [R.cordon, H.cordonFoot + 0.15], [R.cordon, H.cordonFoot + 0.45], [R.shaftFoot, H.shaftFoot],
  [R.shaftTop, H.shaftTop], [R.ledge - 0.03, H.shaftTop + 0.1], [R.ledge - 0.03, 17.0], [R.frieze, 17.0], [R.frieze, 18.55],
  [R.ledge, H.friezeTop], [R.ledge, H.corbelFoot], ...corbel,
  [R.tank, H.tankTop], [R.eave, H.tankTop + 0.45], [R.eave, H.eave], [0, H.eave],
];
let body = Manifold.revolve(new CrossSection([profile]), 96);

// Blinde nis met een spitse top (≥ 50 graden) in een vlak met de normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, top = z1 + w * 0.65;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, z1], [b, -w / 2, z1], [a, w / 2, z1], [b, w / 2, z1], [a, 0, top], [b, 0, top]]);
};
// Straal van de verjongende schacht op hoogte z.
const shaftR = (z) => R.shaftFoot + ((z - H.shaftFoot) / (H.shaftTop - H.shaftFoot)) * (R.shaftTop - R.shaftFoot);
const FRONT = -90; // deur naar -Y
const cuts = [
  place(niche(R.foot - 0.1, 1.5, 0.32, 3.2, 0.35), { deg: FRONT }), // deur met rondboog (spits gemaakt)
  ...[FRONT, 0, 180].map((deg) => place(niche(R.footTop + 0.05, 1.0, 4.9, 5.4, 0.3), { deg })), // kleine vensters boven in de voet
];
// Smalle getoogde vensters in de schacht, verspringend zoals het trappenhuis: midden op 10-12 m, op ±50 graden op 7-8,5 en 14-16 m (voor- en achterzijde).
for (const side of [FRONT, FRONT + 180]) {
  cuts.push(place(niche(shaftR(10.9), 0.8, 9.9, 11.6), { deg: side }));
  for (const d of [-50, 50]) for (const [z0, z1] of [[6.95, 8.2], [13.8, 15.5]]) cuts.push(place(niche(shaftR((z0 + z1) / 2), 0.8, z0, z1), { deg: side + d }));
}
// Fries: twintig gepleisterde boognissen, de vier in de windrichtingen zijn vensters.
for (let k = 0; k < 20; k++) cuts.push(place(niche(R.frieze, 0.6, 17.15, 17.95, 0.25), { deg: FRONT + k * 18 }));
// Reservoir: acht langwerpige vensters.
for (let k = 0; k < 8; k++) cuts.push(place(niche(R.tank, 0.6, 23.2, 25.0, 0.25), { deg: FRONT + 22.5 + k * 45 }));
body = body.subtract(union(cuts));
// Stoep van twee treden voor de deur.
const stoop = place(union([box(R.foot - 0.4, -1.0, BASE, 4.95, 1.0, 0.15), box(R.foot - 0.4, -0.85, BASE, 4.45, 0.85, 0.32)]), { deg: FRONT });

// ---------- zinken tentdak in zestien banen, vier frontondakkapellen, lantaarn en naald ----------
const poly = (r, n, z, phase = Math.PI / n) => ring3(circle([0, 0], r, n, phase), z);
const roofZ = (r) => H.eave + ((R.roof - r) / (R.roof - R.lantern)) * (H.lanternFoot - H.eave);
const dormer = () => {
  const f = 3.3, b = 1.6, w = 0.9, z0 = roofZ(f) - 0.4, z1 = 29.1, apex = 30.05;
  const front = [[f, -w, z0], [f, w, z0], [f, -w, z1], [f, w, z1], [f, 0, apex]];
  return hull([...front, ...front.map(([, y, z]) => [b, y, z])]).subtract(niche(f, 0.6, 28.4, 28.95, 0.25));
};
const roof = union([
  hull([...poly(R.roof, 16, H.eave - 0.05), ...poly(R.lantern, 16, H.lanternFoot + 0.05)]),
  ...[0, 90, 180, 270].map((d) => place(dormer(), { deg: FRONT + d })),
  // Lantaarn met acht vensters, uitlopende kap en de naald (windwijzer weggelaten).
  Manifold.cylinder(H.lanternTop - H.lanternFoot, R.lantern, R.lantern, 32).translate([0, 0, H.lanternFoot]).subtract(
    union(Array.from({ length: 8 }, (_, k) => place(niche(R.lantern, 0.5, 30.65, 31.0, 0.2), { deg: k * 45 + 22.5 }))),
  ),
  hull([...poly(R.lantern, 32, H.lanternTop - 0.05), ...poly(1.4, 32, H.lanternTop + 0.15), ...poly(0.35, 16, H.capTop)]),
  hull([...poly(0.35, 16, H.capTop - 0.05), [0, 0, H.needleTop]]),
]);

await writeLandmark({
  slug: "watertoren-coevorden",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:voet-schacht-reservoir-en-tentdak", union([body, stoop, roof])]],
  catalog: {
    name: "Watertoren Coevorden",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6, 0], [-6, 0], [0, 6], [0, -6]],
    replacesBuildings: ["NL.IMBAG.Pand.0109100000006543"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +11,4 m), deur naar -Y (zuidwest). Gepleisterde voet van 7,8 m met deur en cordonlijst tot 6,85 m, verjongende bakstenen schacht met smalle vensters tot 16,5 m, fries van twintig boognissen, kwartholle kraag naar het reservoir van 8,2 m met acht vensters tot de kroonlijst op 26,7 m, zinken tentdak in zestien banen met vier frontondakkapellen, lantaarn tot 32,2 m en naald. Maten uit BAG, AHN en een frontale RCE-foto.",
    realWorld: {
      publishedHeightM: 32.2,
      reservoirM3: 150,
      ahnGroundNapM: 11.36,
      ahnTopNapM: 43.6,
      bagFootDiameterM: 7.8,
      shaftTopDiameterM: 6.0,
      tankDiameterM: 8.2,
      eaveM: 26.7,
      lanternCapM: 32.2,
      modelTopM: 34.8,
      photoScalePxPerM: 50,
      minimumPartM: 0.6,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Coevorden)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/468592",
      "https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_voorzijde_-_Coevorden_-_20322147_-_RCE.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Coevorden.jpg",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Coevorden_2.JPG",
      "PDOK BAG-pand 0109100000006543, AHN DSM/DTM 0,5 m en luchtfoto, 2026-10-31",
    ],
  },
});

// Oude watertoren van Zaltbommel (J. Schotel, 1905), gemeentelijk monument
// 0297/WN233, Stadsdijk 3-5, op de dijk ten oosten van de binnenstad. Reservoir
// van 50 m³, in de jaren zestig uitgesloopt; de kop is in 1996 opnieuw
// opgemetseld (watertorenprijs) en de toren is nu een woning. Een ronde
// bakstenen schacht op een iets bredere plint met een deuromlijsting naar het
// dijkpad, een gemetselde kraaglijst, een holle trompet met witte ribben onder
// een bredere ronde kop met acht spitsboogvensters, een boogfries, een
// kroonlijst en kantelen.
// Oorsprong op het middelpunt van de ronde BAG-contour (straal 2,80 m) op
// maaiveld (NAP +8,85 m), assen in RD-richting. Het platte dak binnen de
// kantelen is het vlak op NAP +29,76 in het AHN (20,9 m); de borstwering ziet
// het AHN niet (de randcellen liggen tussen boomkruinen en dak). Diameter van de
// kop (6,6 m) uit de luchtfoto; alle andere maten uit de foto "positie1 foto6"
// (bijna frontaal op de deur, 26 px/m op de kop), verankerd op de bovenkant van
// de kroonlijst op het dak, en voor de plint uit de RCE-foto 20339441 (op de
// deur geschaald). Stand: deur, onderste schachtvenster en één rib op kompas
// 172 graden (naar het hek aan het dijkpad); kopvensters 22,5 graden daarnaast
// en verder elke 45 graden.
import { Manifold, CrossSection, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [145974.06, 425148.81];
const AXIS = [1, 0];
const BASE = -0.3;
const SEG = 120; // omwentelingen in stappen van 3 graden
const deg = (bearing) => 90 - bearing; // kompasrichting -> hoek linksom vanaf RD-oost
const DOOR = deg(172);
const H = {
  band: 4.85, // gemetselde band op de plint, schuine onderkant
  plinthTop: 5.45, // begin van het waterlijst naar de schacht
  shaftFoot: 5.8,
  shaftCornice: 13.88, // kraaglijst onder de trompet
  flareFoot: 14.46, // witte ring onderaan de trompet
  kop: 15.94, // witte rand onder de kop
  kopBand: 16.46, // gemetselde band onderaan de kop
  frieze: 19.73, // boogfries
  cornice: 20.3, // schuine onderkant van de kroonlijst
  roof: 20.9, // bovenkant van de kroonlijst en plat dak (AHN 20,9)
  crenel: 21.1, // onderkant van de kantelen
  top: 22.0, // bovenkant van de kantelen
};
const R = { plinth: 2.45, band: 2.52, shaft: 2.1, shaftCornice: 2.2, kop: 3.3, kopBand: 3.4, frieze: 3.37, cornice: 3.45, parapet: 3.3, roof: 2.5 };

// ---------- plint, schacht, trompet en kop in één omwentelingsprofiel ----------
// Trompet: hol, onderaan verticaal en bovenaan horizontaal (een kwartellips).
const flare = (t) => [R.shaftCornice + (R.kopBand - R.shaftCornice) * (1 - Math.cos(t)), H.flareFoot + (H.kop - H.flareFoot) * Math.sin(t)];
const FLARE_STEPS = 12;
const ts = Array.from({ length: FLARE_STEPS + 1 }, (_, k) => ((k / FLARE_STEPS) * Math.PI) / 2);
const body = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.plinth, BASE], [R.plinth, H.band], [R.band, H.band + 0.1], [R.band, H.band + 0.25], [R.plinth, H.band + 0.3],
    [R.plinth, H.plinthTop], [R.shaft, H.shaftFoot], [R.shaft, H.shaftCornice - 0.15], [R.shaftCornice, H.shaftCornice],
    ...ts.map(flare),
    [R.kopBand, H.kopBand], [R.kop, H.kopBand + 0.08], [R.kop, H.frieze], [R.frieze, H.frieze + 0.1], [R.frieze, H.cornice],
    [R.cornice, H.cornice + 0.12], [R.cornice, H.roof - 0.05], [R.parapet, H.roof], [R.parapet, H.crenel], [R.roof, H.crenel], [R.roof, H.roof], [0, H.roof],
  ]]),
  SEG,
);

// Wig van a0 tot a1 graden rond de as, van z0 tot z1 (om een omwenteling in sectoren te knippen).
const wedge = (a0, a1, z0, z1) => {
  const p = (a) => [12 * Math.cos((a * Math.PI) / 180), 12 * Math.sin((a * Math.PI) / 180)];
  return hull([[0, 0, z0], [0, 0, z1], ...[p(a0), p((a0 + a1) / 2), p(a1)].flatMap(([x, y]) => [[x, y, z0], [x, y, z1]])]);
};

// Tien kantelen van 18 graden (1,04 m buiten, 0,79 m binnen, 0,9 m hoog) met even brede tussenruimtes,
// één boven de deur. In het echt circa twintig van 0,5 m; zo blijven ze en de tussenruimtes ≥ 0,9 m.
const merlonRing = Manifold.revolve(new CrossSection([[[R.roof, H.crenel - 0.05], [R.parapet, H.crenel - 0.05], [R.parapet, H.top], [R.roof, H.top]]]), SEG);
const merlons = merlonRing.intersect(union(Array.from({ length: 10 }, (_, k) => wedge(DOOR - 9 + k * 36, DOOR + 9 + k * 36, H.crenel - 0.1, H.top + 0.1))));

// Achttien witte ribben over de trompet (0,25 m breed, 0,12 m uit het vlak), één boven de deur.
const normal = (t) => {
  const n = [(H.kop - H.flareFoot) * Math.cos(t), -(R.kopBand - R.shaftCornice) * Math.sin(t)];
  const l = Math.hypot(...n);
  return [n[0] / l, n[1] / l];
};
const offset = (d) => ts.map((t) => {
  const [r, z] = flare(t), [nr, nz] = normal(t);
  return [r + d * nr, z + d * nz];
});
// Onderaan lopen de ribben schuin (34 graden) uit op de kraaglijst, bovenaan tot in de kop.
const ribBand = Manifold.revolve(
  new CrossSection([[[R.shaftCornice - 0.1, H.flareFoot - 0.3], [R.shaftCornice, H.flareFoot - 0.18], ...offset(0.12), ...offset(-0.1).reverse()]]),
  SEG,
);
const ribs = ribBand.intersect(union(Array.from({ length: 18 }, (_, k) => place(Manifold.cube([12, 0.25, 4]).translate([0, -0.125, 13]), { deg: DOOR + k * 20 }))));

// Deuromlijsting: gemetselde penanten en boog, 1,9 m breed en 0,12 m voor de plint, met een spitse top onder 56 graden.
const surround = place(
  hull([R.plinth - 0.2, R.plinth + 0.12].flatMap((x) => [[-0.95, BASE], [0.95, BASE], [-0.95, 3.75], [0.95, 3.75], [0, 3.75 + 0.95 * 1.48]].map(([t, z]) => [x, t, z]))),
  { deg: DOOR },
);

// Spitsboognis in het vlak met normaal +X op afstand f: w breed van z0 tot z1, top onder 56 graden.
const arch = (f, w, z0, z1, depth = 0.3) => {
  const shoulder = z1 - (w / 2) * Math.tan((56 * Math.PI) / 180);
  const prof = [[-w / 2, z0], [w / 2, z0], [w / 2, shoulder], [0, z1], [-w / 2, shoulder]];
  return hull([f - depth, f + 1.0].flatMap((x) => prof.map(([t, z]) => [x, t, z])));
};
const cuts = [
  place(arch(R.plinth + 0.12, 1.0, 0.15, 3.5, 0.42), { deg: DOOR }), // deur met bovenlicht naar het dijkpad
  place(arch(R.shaft, 0.7, 7.05, 8.95, 0.25), { deg: DOOR }), // trappenhuisvenster boven de deur
  place(arch(R.shaft, 0.7, 10.3, 12.2, 0.25), { deg: DOOR - 40 }), // en een verdieping hoger links en rechts
  place(arch(R.shaft, 0.7, 10.3, 12.2, 0.25), { deg: DOOR + 40 }),
  // Acht spitsboogvensters in de kop.
  ...Array.from({ length: 8 }, (_, k) => place(arch(R.kop, 0.8, 17.45, 19.35, 0.3), { deg: DOOR + 22.5 + k * 45 })),
];

await writeLandmark({
  slug: "watertoren-zaltbommel-oude",
  base: BASE,
  // Eén node: de export vult elke node apart op; een losse kop zou een eigen voet krijgen.
  nodes: [["building:plint-schacht-trompet-en-kop-met-kantelen", union([body, merlons, ribs, surround]).subtract(union(cuts))]],
  catalog: {
    name: "Oude watertoren Zaltbommel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[3.8, 0], [-3.8, 0], [0, 3.8], [0, -3.8]],
    replacesBuildings: ["NL.IMBAG.Pand.0297100000003677"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +8,85 m), assen in RD-richting. Plint van 4,9 m tot 5,45 m met een band en een deuromlijsting met spitsboogdeur naar het zuiden, ronde schacht van 4,2 m met drie vensters, kraaglijst tot 14,46 m, holle trompet met achttien ribben naar de kop van 6,6 m op 15,94 m, acht spitsboogvensters, boogfries, kroonlijst en plat dak op 20,9 m, tien kantelen tot 22,0 m. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 21,
      reservoirM3: 50,
      built: 1905,
      kopRebuilt: 1996,
      ahnGroundNapM: 8.85,
      ahnRoofNapM: 29.76,
      bagContourDiameterM: 5.6,
      plinthDiameterM: 4.9,
      shaftDiameterM: 4.2,
      kopDiameterM: 6.6,
      corniceDiameterM: 6.9,
      plinthTopM: 5.45,
      flareM: [14.46, 15.94],
      roofM: 20.9,
      modelTopM: 22.0,
      photoScalePxPerM: 26,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Oude_watertoren_(Zaltbommel)",
      "https://commons.wikimedia.org/wiki/File:Zaltbommel,_de_Oude_Watertoren_positie1_foto6_2015-08-06_11.04.jpg (bijna frontaal op de deur, maten)",
      "https://commons.wikimedia.org/wiki/File:Oude_watertoren,_Zaltbommel_-_panoramio.jpg (kop, vensters, trompet en ribben)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_VOORZIJDE_-_Zaltbommel_-_20339441_-_RCE.jpg (plint, deuromlijsting en schachtvensters)",
      "https://commons.wikimedia.org/wiki/File:Zaltbommel_watertoren_01.jpg (kop van de andere kant)",
      "PDOK BAG-pand 0297100000003677, 3D BAG, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

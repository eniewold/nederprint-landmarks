// Watertoren van Enschede aan Hoog en Droog (nr. 28), in de wijk De Bothoven. Gebouwd in 1890 (tot 1891) naar ontwerp
// van N. Biezeveld, gemeentelijk monument, volgens Wikipedia 40 m hoog met een ijzeren hangbodemreservoir (300 m³; de
// opdracht en andere bronnen noemen 600 m³), in 1956 gerenoveerd; sinds 2019 kantoor (CLAFIS), in 2020 vergunning voor
// kantoor, wonen en horeca. Een ronde toren van rode baksteen met lichte natuurstenen banden: een onderbouw met een
// kroonlijst, rondboogvensters en een deur met een waaiervormig bovenlicht, een vrijwel rechte schacht in drie
// geledingen met rondboogvensters en kleine vensters, bovenaan een krans van ronde venstertjes (oculi) met
// muurankers, een zware rondlijst waarop het reservoir iets uitkraagt. Het reservoir is ommanteld met verdiepte velden
// tussen lisenen, in twee rijen door een band gescheiden, met kleine vensters, en een kroonlijst. Daarop een vlak
// kegeldak van koper (op de luchtfoto 24 banen) met een kleine ronde lantaarn met een kap en een makelaar.
//
// Oorsprong op het hart van BAG-pand 0153100000204953 (cirkel van 60 punten, straal 6,17 m; dezelfde cirkel staat sinds
// 2016 in de BGT) op het maaiveld: AHN-DTM NAP +46,88 (ring van 6,5 tot 12 m: 46,75 tot 46,95, vlak plein). +X wijst
// naar het oosten (RD-richting 0 graden), +Y naar het noorden. Het hoge deel van het AHN-DSM (reservoir, dak, lantaarn)
// ligt 1,1 m westelijker dan de BAG-cirkel, terwijl de schuine luchtfoto's (2022 tot 2026, die de toren naar het noorden
// of zuiden laten hellen) het dak recht boven de voet tonen en het lage pand ten zuiden in het DSM wel op zijn
// BAG-contour ligt; de toren staat dus op de BAG-cirkel en de vormen komen uit het DSM rond zijn eigen top.
// Maten: AHN-DSM 0,5 m rond de top (RD 258634,25 471444,0): kroonlijst NAP +80,0 (33,1 m) tot r 6,0 à 6,3; dak per halve
// meter straal (p50) 82,12 op 2,25 m, 81,51 op 3,25, 80,92 op 4,25, 80,36 op 5,25: rechte kegel z = 36,49 - 0,57 r
// (30 graden); lantaarn tot NAP +86,5 binnen r 0,9 (39,6 m), piek +87,25 (40,4 m; 3D BAG h_dak_max 86,60). Geledingen
// uit de enige bruikbare foto "Watertoren Enschede.jpg" (Commons, PD, 268 x 376 px, vanaf het west-zuidwesten met het
// lage pand ten zuiden rechts): 9,5 px/m tussen het maaiveld en de kroonlijst uit het AHN. Breedtes daarop kloppen met
// een rechte schacht in perspectief (boven 0,90 van onder op 22 m hoogte) en een reservoir dat iets uitkraagt; de luchtfoto
// geeft een dakrand van 12,8 à 13,3 m.
import { Manifold, CrossSection, ccw, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [258635.31, 471443.9];
const AXIS = [1, 0];
const GROUND_NAP = 46.88;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints op 8 m van het hart (oost 90,46, noord 90,46,
// west 90,46, zuid 90,40), gemeten 2026-11-06; het PDOK-pand begint op 90,37.
const GROUND_ELLIPSOID = 90.4;

// Omwenteling van een gesloten profiel [[r, z], ...].
const rev = (pts, seg = SEG) => Manifold.revolve(new CrossSection([ccw(pts)]), seg);
// Massief onder een profiel van onder naar boven, gesloten langs de as.
const solidRev = (profile, seg = SEG) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]], seg);
// Band van r0 tot r1 tussen z0 en z1, met een onderkant van 50 graden vanaf r0 (massief tot de as).
const ledge = (r0, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - r0)], [r0, z0 - 1.2 * (r1 - r0)], [r1, z0], [r1, z1], [0, z1]]);
const coneR = (ra, za, rb, zb) => (z) => ra + ((rb - ra) * (z - za)) / (zb - za);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen
// onder 56 graden op, buiten de gevel loopt de snede schuin af.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Rondboognis met aanzet zSpring; het boogplafond loopt naar binnen onder 63 graden op.
const archNiche = (f, w, z0, zSpring, depth = 0.3) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([y, z]) => [a, y, z + 2 * depth]),
    ...arc.map(([y, z]) => [f, y, z]),
    ...arc.map(([y, z]) => [f + 1, y, Math.max(z0, z - 1.5)]),
    [a, -r, z0], [a, r, z0], [f + 1, -r, z0], [f + 1, r, z0],
  ]);
};
// Rond venster (oculus) als nis met diameter d rond zc; de binnenkant ligt 2,5 x de diepte hoger (68 graden; bij 63 graden
// vulde de export boven de twaalf oculi nog een randje op).
const oculus = (f, d, zc, depth = 0.3) => {
  const ring = Array.from({ length: 12 }, (_, k) => {
    const t = (2 * Math.PI * k) / 12;
    return [(d / 2) * Math.cos(t), zc + (d / 2) * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...ring.map(([y, z]) => [a, y, z + 2.5 * depth]),
    ...ring.map(([y, z]) => [f, y, z]),
    ...ring.map(([y, z]) => [f + 1, y, z - 1.0]),
  ]);
};

// ---------- hoogtes boven het maaiveld (NAP +46,88) ----------
const H = {
  plinth: 0.8, // hardstenen plint
  socleCornice: [5.6, 6.0], // kroonlijst van de onderbouw
  socleWindows: [1.9, 3.45], // rondboogvensters (kruin 3,9)
  door: 3.4, // aanzet van het waaierlicht (kruin 4,2)
  bands: [9.65, 12.45, 16.3, 18.4, 20.7, 21.9], // natuurstenen banden (0,3 m)
  lowWindows: [6.8, 8.85], // rondboog, kruin 9,3
  midWindows: [13.5, 15.35], // rondboog, kruin 15,8
  highWindows: [18.9, 20.2], // klein, recht
  oculi: 22.85, // ronde venstertjes (0,9 m)
  shaftTop: 23.9, // aanzet van de rondlijst (boven de binnenkant van de oculi, anders vult de export eronder op)
  roll: [24.5, 24.75], // rondlijst onder het reservoir
  resBand: [28.1, 28.4], // band halverwege het reservoir
  resPanels: [[25.15, 27.75], [28.75, 32.0]], // verdiepte velden onder en boven de band
  resWindowsLow: [25.6, 26.6],
  resWindowsHigh: [30.8, 31.75],
  cornice: [32.6, 33.0], // kroonlijst van het reservoir (AHN NAP +80,0 tot 80,4)
  lanternFoot: [35.3, 36.1],
  lanternTop: 38.9,
  cap: [38.9, 39.2],
  dome: 39.6, // AHN NAP +86,5
  top: 40.4, // AHN-piek NAP +87,25
};
// Stralen.
const R = {
  plinth: 6.17, // BAG-cirkel
  socle: 6.1,
  socleCornice: 6.3,
  shaftFoot: 6.0,
  shaftTop: 5.85,
  band: 0.12,
  roll: 6.4,
  reservoir: 6.3,
  recess: 0.2,
  cornice: 6.55,
  lanternFoot: 1.3,
  lantern: 1.15,
  cap: 1.4,
};
const shaftR = coneR(R.shaftFoot, H.socleCornice[1], R.shaftTop, H.shaftTop);

// Richtingen (graden, wiskundig vanaf +X = oost): deur naar het zuid-zuidwesten (-116, foto); vensters van de onderste
// en bovenste geleding boven de deur en elke 60 graden, de middelste geleding en de onderbouw 30 graden verspringend;
// twaalf oculi op -116 + 30k; zestien reservoirvelden op -160 + 22,5k (foto-as), kleine vensters om en om boven en onder.
const DOOR = -116;
const ROW_A = every(6, DOOR);
const ROW_B = every(6, DOOR + 30);
const OCULI = every(12, DOOR);
const PANELS = every(16, -160);
const RES_HIGH = every(8, -160 + 22.5);
const RES_LOW = every(8, -160);

// ---------- onderbouw ----------
const socle = union([
  rev([[0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.socle, H.plinth + 0.06], [0, H.plinth + 0.06]]),
  solidRev([[R.socle, H.plinth], [R.socle, H.socleCornice[0] + 0.01]]),
  ledge(R.socle, R.socleCornice, ...H.socleCornice),
]);
const socleOpenings = union([
  ...around(archNiche(R.socle, 0.9, H.socleWindows[0], H.socleWindows[1]), ROW_B),
  place(archNiche(R.socle, 1.6, H.plinth - 0.6, H.door, 0.4), { deg: DOOR }),
]);
// Stoep voor de deur: twee treden van 2,2 m breed.
const stoop = place(union([
  hull([[R.socle - 0.4, -1.1, BASE], [R.plinth + 0.9, -1.1, BASE], [R.socle - 0.4, 1.1, BASE], [R.plinth + 0.9, 1.1, BASE],
    [R.socle - 0.4, -1.1, 0.2], [R.plinth + 0.9, -1.1, 0.2], [R.socle - 0.4, 1.1, 0.2], [R.plinth + 0.9, 1.1, 0.2]]),
  hull([[R.socle - 0.4, -1.1, BASE], [R.plinth + 0.45, -1.1, BASE], [R.socle - 0.4, 1.1, BASE], [R.plinth + 0.45, 1.1, BASE],
    [R.socle - 0.4, -1.1, 0.4], [R.plinth + 0.45, -1.1, 0.4], [R.socle - 0.4, 1.1, 0.4], [R.plinth + 0.45, 1.1, 0.4]]),
]), { deg: DOOR });
const base = union([socle.subtract(socleOpenings), stoop]);

// ---------- schacht ----------
const shaft = solidRev([[R.shaftFoot, H.socleCornice[1] - 0.01], [R.shaftTop, H.shaftTop + 0.01]]);
const bands = union(H.bands.map((z) => ledge(shaftR(z), shaftR(z) + R.band, z, z + 0.3)));
const shaftOpenings = union([
  ...around(archNiche(shaftR(9.3), 0.9, ...H.lowWindows), ROW_A),
  ...around(archNiche(shaftR(15.8), 0.9, ...H.midWindows), ROW_B),
  ...around(niche(shaftR(20.2), 0.9, ...H.highWindows), ROW_A),
  ...around(oculus(shaftR(H.oculi), 0.9, H.oculi, 0.2), OCULI),
]);
const shaftAll = union([shaft, bands]).subtract(shaftOpenings);

// ---------- rondlijst en reservoir ----------
// Rondlijst: van de schacht onder 42,5 graden uit het lood naar 6,4 m, daarboven het reservoir.
const roll = solidRev([[R.shaftTop, H.shaftTop], [R.roll, H.roll[0]], [R.roll, H.roll[1]], [R.reservoir, H.roll[1] + 0.05]]);
const drum = solidRev([[R.reservoir, H.roll[1]], [R.reservoir, H.cornice[0] + 0.01]]);
const resBand = ledge(R.reservoir, R.reservoir + R.band, ...H.resBand);
const cornice = ledge(R.reservoir, R.cornice, ...H.cornice);
// Zestien verdiepte velden (1,9 m breed, 0,2 m diep) tussen lisenen van circa 0,55 m, in twee rijen; in de velden kleine
// vensters (0,9 m) om en om boven en onder.
const panelW = 1.9;
const resOpenings = union([
  ...H.resPanels.flatMap(([z0, z1]) => around(niche(R.reservoir, panelW, z0, z1, R.recess), PANELS)),
  ...around(niche(R.reservoir - R.recess, 0.9, ...H.resWindowsHigh), RES_HIGH),
  ...around(niche(R.reservoir - R.recess, 0.9, ...H.resWindowsLow), RES_LOW),
]);
const reservoir = union([roll, union([drum, resBand, cornice]).subtract(resOpenings)]);

// ---------- dak en lantaarn ----------
// Vlak kegeldak van 24 koperen banen uit het AHN: z = 36,49 - 0,57 r, van de kroonlijst tot de lantaarn.
const roofZ = (r) => 36.49 - 0.57 * r;
const roof = solidRev([[6.0, H.cornice[1] - 0.2], [6.0, roofZ(6.0)], [R.lanternFoot - 0.2, roofZ(R.lanternFoot - 0.2)]], 24).rotate([0, 0, 7.5]);
// Lantaarn: voetring, ronde trommel met acht rondboogopeningen (als nis), kap met kraag van 50 graden, koepeltje en makelaar.
const lantern = union([
  solidRev([[R.lanternFoot, H.lanternFoot[0]], [R.lanternFoot, H.lanternFoot[1]], [R.lantern, H.lanternFoot[1] + 0.05]], 48),
  solidRev([[R.lantern, H.lanternFoot[1]], [R.lantern, H.lanternTop + 0.01]], 48).subtract(union(around(archNiche(R.lantern, 0.6, 36.4, 37.9, 0.25), every(8, 22.5)))),
  ledge(R.lantern, R.cap, ...H.cap),
  solidRev([[R.cap - 0.05, H.cap[1] - 0.01], [1.1, 39.45], [0.55, H.dome]], 48),
  solidRev([[0.45, H.dome - 0.05], [0.45, 39.9], [0.05, H.top]], 24),
]);

const tower = union([base, shaftAll, reservoir, roof, lantern]);

await writeLandmark({
  slug: "watertoren-enschede-hoog-en-droog",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-reservoir-dak-en-lantaarn", tower]],
  catalog: {
    name: "Watertoren Enschede (Hoog & Droog)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [0, 8], [-8, 0], [0, -8]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0153100000204953"],
    description:
      "Oorsprong op het hart van het ronde BAG-pand op het maaiveld (NAP +46,88 m), +X naar het oosten, +Y naar het noorden; deur naar het zuid-zuidwesten. Onderbouw van 12,3 m met plint, rondboogvensters, deur met waaierlicht, stoep en kroonlijst; ronde schacht met zes banden, drie rijen vensters en twaalf oculi; rondlijst tot 6,4 m; reservoir van 12,6 m met zestien verdiepte velden in twee rijen, band, kleine vensters en kroonlijst tot 33,0 m; vlak kegeldak van 24 banen (30 graden); lantaarn met kap, koepeltje en makelaar tot 40,4 m. Maten uit BAG, AHN en één foto.",
    realWorld: {
      built: 1890,
      architect: "N. Biezeveld",
      publishedHeightM: 40,
      reservoirM3: 300,
      ahnGroundNapM: GROUND_NAP,
      ahnCorniceNapM: 80.0,
      ahnDomeNapM: 86.5,
      ahnTopNapM: 87.25,
      plinthDiameterM: R.plinth * 2,
      shaftDiameterM: [R.shaftFoot * 2, R.shaftTop * 2],
      reservoirDiameterM: R.reservoir * 2,
      corniceDiameterM: R.cornice * 2,
      corniceM: H.cornice,
      roofSlopeDeg: 29.7,
      topM: H.top,
      photoScalePxPerM: 9.5,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Enschede_Hoog_%26_Droog) (1890, N. Biezeveld, 40 m, ijzeren hangbodemreservoir van 300 m³, gerenoveerd 1956, gemeentelijk monument, sinds 2019 CLAFIS)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Enschede.jpg (PD, vanaf het west-zuidwesten: geledingen, vensters, oculi, rondlijst, reservoir, lantaarn; schaal 9,5 px/m)",
      "PDOK BAG/BGT-pand 0153100000204953 (cirkel, straal 6,17 m), AHN DSM/DTM 0,5 m, 3D BAG (h_dak_max NAP +86,60) en luchtfoto's 2022 tot 2026, 2026-11-06",
    ],
  },
});

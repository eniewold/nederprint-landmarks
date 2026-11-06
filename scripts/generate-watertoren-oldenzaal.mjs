// Watertoren van Oldenzaal aan de Watertorenstraat (nr. 2), gebouwd in 1905 naar ontwerp van J.P. Hazeu; volgens
// Wikipedia 31,7 m hoog met een reservoir van 250 m³. In 2003 moest de kop op last van de gemeente worden verwijderd
// (er vielen brokstukken af); in 2006 is hij herbouwd met vier woonlagen (BAG-bouwjaar 2004), sindsdien met kantelen
// en een hek op het dakterras. Een ronde toren van rode baksteen: een gebatterde voet met een donkere plint, een
// zware natuurstenen band met een profiellijst, een licht taps toelopende schacht met een kolom trapvensters en
// paren rondboogvensters, een natuurstenen ring en daarboven een uitlopende kraag (witte ribben, oculi) onder een
// overstekende witte rand. Op die rand de bredere kop: een gele zigzagband, een witte band, twaalf hoge vensters,
// een boogfries met hangende consoles (gele bogen), twee witte banden en een borstwering met twaalf kantelen.
//
// Oorsprong op het hart van BAG-pand 0173100000132934 (cirkel van 30 punten, straal 4,31 m; het vlakke dak in het
// AHN-DSM ligt 0,5 m ernaast, binnen de randruis) op het maaiveld, AHN-DTM NAP +50,2 (ring van 4 tot 10 m: 50,1 tot
// 50,4). Lokaal stelsel = RD (+X oost, +Y noord, xAxis [1, 0]); hoeken hieronder zijn RD-richtingen (0 = oost,
// 90 = noord).
// Maten: BAG (voet, straal 4,31 m), AHN-DSM 0,5 m (dakterras NAP +81,7 = 31,5 m, vlak tot circa 3 m van het hart;
// dakopbouw van 1,5 bij 1,3 m tot NAP +82,4 ten noorden van het hart; kop en rand tot circa 4,4 à 5 m in de randruis).
// Geledingen uit "Oldenzaal, de watertoren foto2 2013-04-22 18.16.jpg" (Commons, vanuit het noordwesten van onderaf;
// schaal per beeldregel 43 tot 53 px/m uit de schachtbreedte, perspectief lineair verdeeld en verankerd op de voet uit
// de BAG en de kantelen) en "Oldenzaal, de watertoren IMG 7374 2020-08-10 17.41.jpg" (Commons, GPS 39 m west en 34 m
// noord: richting van de trapkolom, de vensterparen, de twaalf vensters en kantelen in de kop); deur en het tweede
// vensterpaar uit "Watertoren (water tower) - panoramio.jpg" (Commons, 2007, vanuit het zuiden).
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [260344.31, 481191.385];
const AXIS = [1, 0];
const GROUND_NAP = 50.2;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 93,62, west 93,54, noord 93,54, zuid 93,61;
// het PDOK-pand begint op 93,45), gemeten 2026-11-06 met de terreintegels van de
// export).
const GROUND_ELLIPSOID = 93.54;

const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Schijf tot r1 tussen z0 en z1 met een onderkant van 50 graden vanaf rIn (massief tot de as).
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
const coneR = (ra, za, rb, zb) => (z) => ra + ((rb - ra) * (z - za)) / (zb - za);
// Rechte nis in het vlak met normaal +X op afstand f (zie generate-watertoren-deventer.mjs).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Rondboognis met een plafond dat naar binnen onder 63 graden oploopt.
const archNiche = (f, w, z0, zSpring, depth = 0.3, y = 0) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([v, z]) => [a, v, z + 2 * depth]),
    ...arc.map(([v, z]) => [f, v, z]),
    ...arc.map(([v, z]) => [f + 1, v, Math.max(z0, z - 1.5)]),
    [a, -r, z0], [a, r, z0], [f + 1, -r, z0], [f + 1, r, z0],
  ]).translate([0, y, 0]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);

// ---------- hoogtes boven het maaiveld (NAP +50,2) ----------
const H = {
  plinth: 1.0, // donkere plint
  baseTop: 6.0, // bovenkant van de gebatterde voet, onderkant van de profiellijst
  bandCornice: [6.0, 6.6], // profiellijst van de natuurstenen band (foto 5,8 tot 6,7)
  band: [6.6, 7.45], // vlakke band erboven (tot 7,56)
  shaftFoot: 7.75,
  ring: [21.03, 21.73], // natuurstenen ring onder de kraag
  flareTop: 22.93, // bovenkant van de uitlopende kraag
  rim: [23.12, 23.8], // overstekende witte rand (foto 23,28 tot 23,94)
  head: 23.94, // voet van de kop
  bands: [[24.9, 25.2], [29.6, 29.9], [30.55, 30.85]], // witte banden
  windows: [25.35, 28.2], // twaalf hoge vensters
  frieze: [28.85, 29.45], // boogfries, hangende consoles tot 28,3
  roof: 31.5, // dakterras (AHN NAP +81,7)
  parapet: 31.85, // borstwering tussen de kantelen
  merlon: 32.75, // kantelen
  hatch: 32.2, // dakopbouw (AHN NAP +82,4)
};
// Stralen.
const R = {
  plinth: 4.33, // BAG-cirkel 4,31
  baseFoot: 4.28,
  baseTop: 4.12,
  bandCornice: 4.42,
  band: 4.24,
  shaftFoot: 3.72,
  shaftTop: 3.64,
  ring: 3.88,
  flare: 4.85,
  rim: 5.0,
  head: 4.45,
  band2: 0.1, // uitsteek van de witte banden
  parapetIn: 3.55,
};
const baseR = coneR(R.baseFoot, H.plinth, R.baseTop, H.baseTop);
const shaftR = coneR(R.shaftFoot, H.shaftFoot, R.shaftTop, H.ring[0]);

// ---------- voet, band en schacht ----------
const foot = solidRev([
  [R.plinth, BASE], [R.plinth, H.plinth - 0.05], [R.baseFoot, H.plinth],
  [R.baseTop, H.baseTop],
]);
const bandCornice = ledge(R.baseTop - 0.02, R.bandCornice, ...H.bandCornice);
const band = solidRev([[R.band, H.bandCornice[1] - 0.01], [R.band, H.band[1]], [R.shaftFoot, H.shaftFoot]]);
const shaft = solidRev([[R.shaftFoot, H.shaftFoot - 0.01], [R.shaftTop, H.ring[0] + 0.01]]);
// Openingen: kolom trapvensters naar het noorden (90 graden, 0,9 m breed, 11,4 tot 19,85 m), paren rondboogvensters
// (0,7 m, hart op hart 1,1 m) naar het noordwesten (139 graden, 12,6 tot 14,4 m) en het zuidwesten (229 graden, 12,6
// tot 14,4 en 18,3 tot 20,0 m), het rondboogvenster in de voet (145 graden, 1,5 tot 3,9 m) en de deur (275 graden).
const pair = (z0, z1) => {
  const f = shaftR(z1 + 0.35);
  return union([archNiche(f, 0.7, z0, z1 - 0.35, 0.3, -0.55), archNiche(f, 0.7, z0, z1 - 0.35, 0.3, 0.55)]);
};
const shaftOpenings = union([
  place(niche(shaftR(19.85), 0.9, 11.4, 19.85, 0.3), { deg: 90 }),
  place(pair(12.6, 14.4), { deg: 139 }),
  place(pair(12.6, 14.4), { deg: 229 }),
  place(pair(18.3, 20.0), { deg: 229 }),
]);
// Deur met een natuurstenen omlijsting (2,2 m breed, 0,15 m uit, schuin afgedekt tot 3,4 m) en een rondboog van 1,3 m.
const doorFrame = hull([
  [baseR(3.4) - 0.3, -1.1, 0], [baseR(0) + 0.15, -1.1, 0], [baseR(0) - 0.3, 1.1, 0], [baseR(0) + 0.15, 1.1, 0],
  [baseR(3.1) - 0.3, -1.1, 3.1], [baseR(3.1) + 0.15, -1.1, 3.1], [baseR(3.1) - 0.3, 1.1, 3.1], [baseR(3.1) + 0.15, 1.1, 3.1],
  [baseR(3.4) - 0.3, -0.9, 3.4], [baseR(3.4) - 0.3, 0.9, 3.4],
]);
const door = archNiche(baseR(2.4) + 0.15, 1.3, BASE + 0.2, 2.0, 0.45);
const footOpenings = union([
  place(archNiche(baseR(3.9), 0.9, 1.5, 3.45, 0.3), { deg: 145 }),
  place(door, { deg: 275 }),
]);
const lower = union([foot, bandCornice, band, shaft, place(doorFrame, { deg: 275 })]).subtract(union([shaftOpenings, footOpenings]));

// ---------- ring, kraag en rand ----------
const ring = ledge(R.shaftTop, R.ring, ...H.ring);
// Uitlopende kraag onder 50 graden (Δz 1,2 over Δr 0,97), daarop de rand.
const flare = solidRev([[R.ring - 0.03, H.ring[1] - 0.01], [R.flare, H.flareTop], [R.rim, H.rim[0]], [R.rim, H.rim[1]], [R.rim - 0.1, H.head], [R.head, H.head + 0.01]]);
// Twaalf witte ribben op de kraag (0,4 m breed, 0,12 m uit), tussen de oculi.
const rib = hull([
  [R.shaftTop, -0.2, H.ring[1]], [R.ring + 0.09, -0.2, H.ring[1]], [R.shaftTop, 0.2, H.ring[1]], [R.ring + 0.09, 0.2, H.ring[1]],
  [R.flare + 0.12, -0.2, H.flareTop + 0.1], [R.flare + 0.12, 0.2, H.flareTop + 0.1],
  [4.4, -0.2, H.rim[0]], [4.4, 0.2, H.rim[0]],
]);
const collar = union([ring, flare, ...around(rib, every(12, 15))]);

// ---------- kop ----------
const headWall = solidRev([[R.head, H.head], [R.head, H.parapet]]);
const bands = union(H.bands.map(([z0, z1]) => ledge(R.head, R.head + R.band2, z0, z1)));
const frieze = ledge(R.head, R.head + 0.12, ...H.frieze);
// Hangende consoles onder het boogfries, boven de penanten tussen de vensters (op 0 + 30k graden).
const pendant = hull([
  [R.head - 0.1, -0.25, 28.15], [R.head - 0.1, 0.25, 28.15],
  [R.head + 0.12, -0.25, 28.35], [R.head + 0.12, 0.25, 28.35],
  [R.head - 0.1, -0.25, H.frieze[0] + 0.05], [R.head - 0.1, 0.25, H.frieze[0] + 0.05],
  [R.head + 0.12, -0.25, H.frieze[0] + 0.05], [R.head + 0.12, 0.25, H.frieze[0] + 0.05],
]);
const merlon = box(R.parapetIn, -0.5, H.parapet - 0.01, R.head - 0.03, 0.5, H.merlon);
const headSolid = union([headWall, bands, frieze, ...around(pendant, every(12, 0)), ...around(merlon, every(12, 0))]);
// Dakterras binnen de borstwering (0,9 m dik) en twaalf vensters (0,7 m breed als nis) op 15 + 30k graden.
const terrace = solidRev([[R.parapetIn, H.roof], [R.parapetIn, H.merlon + 1]]);
const headWindows = union(around(niche(R.head, 0.7, ...H.windows, 0.3), every(12, 15)));
const hatch = box(0.0, 1.75, H.roof - 0.1, 1.5, 3.05, H.hatch);
const head = union([headSolid.subtract(union([terrace, headWindows])), hatch]);

const tower = union([lower, collar, head]);

await writeLandmark({
  slug: "watertoren-oldenzaal",
  base: BASE,
  nodes: [["building:watertoren-voet-schacht-kraag-en-kop", tower]],
  catalog: {
    name: "Watertoren Oldenzaal",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6.5, 0], [-6.5, 0], [0, 6.5], [0, -6.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0173100000132934"],
    description:
      "Oorsprong op het hart van het ronde BAG-pand op het maaiveld (NAP +50,2 m), lokaal stelsel = RD (+X oost, +Y noord). Gebatterde voet met plint, deur (zuid) en rondboogvenster; natuurstenen band met profiellijst; taps toelopende schacht met een kolom trapvensters (noord) en paren rondboogvensters; natuurstenen ring, uitlopende kraag met twaalf ribben en een overstekende rand van 10 m; kop van 8,9 m met witte banden, twaalf hoge vensters, boogfries met hangende consoles, dakterras op 31,5 m en borstwering met twaalf kantelen tot 32,75 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1905,
      headRebuilt: 2006,
      architect: "J.P. Hazeu",
      publishedHeightM: 31.7,
      reservoirM3: 250,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 81.7,
      ahnHatchNapM: 82.4,
      footDiameterM: R.plinth * 2,
      shaftDiameterM: [R.shaftFoot * 2, R.shaftTop * 2],
      rimDiameterM: R.rim * 2,
      headDiameterM: R.head * 2,
      roofM: H.roof,
      parapetM: H.parapet,
      topM: H.merlon,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Oldenzaal) (1905, J.P. Hazeu, 31,7 m, 250 m³, kop in 2003 verwijderd en in 2006 herbouwd als woning)",
      "https://commons.wikimedia.org/wiki/File:Oldenzaal,_de_watertoren_foto2_2013-04-22_18.16.jpg (vanuit het noordwesten: geledingen, breedteverhoudingen)",
      "https://commons.wikimedia.org/wiki/File:Oldenzaal,_de_watertoren_IMG_7374_2020-08-10_17.41.jpg (GPS-standpunt: richting van trapkolom, vensterparen, vensters en kantelen)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_(water_tower)_-_panoramio.jpg en File:2006-07-15_14.53_Oldenzaal,toren.JPG (deur, tweede vensterpaar, kop)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Oldenzaal_-_20297190_-_RCE.jpg (1987, oude kop zonder kantelen)",
      "PDOK BAG-pand 0173100000132934, AHN DSM/DTM 0,5 m, 2026-11-06",
    ],
  },
});

// Watertoren van Heinenoord, bij Sluisendijk 2, aan de voet van de Sluisendijk tussen Heinenoord en Goidschalxoord. Gebouwd
// in 1910 naar ontwerp van J. Smit (constructeur Visser) voor de drinkwatervoorziening van het dorp; een van de kleinste
// watertorens van Nederland, ijzeren vlakbodemreservoir van 50 m³, rijksmonument 525095. Sobere neoromaanse stijl: een ronde,
// taps toelopende onderbouw van rode baksteen met een gepleisterde plint en twee kunststenen banden, een rondboogfries op
// aanzetstenen, daarboven uitkragende banden van baksteen en kunststeen, een uitkragende cilindrische bovenbouw met leien in
// rijndekking, een zestienzijdige houten gootlijst op schoren en een flauw hellend zestienzijdig kegeldak (bitumen). De deur
// zit aan de oostzijde in een rondboog; ter hoogte daarvan vier kleine zesruitsvensters, in de tweede band vier ronde vensters,
// in de band tussen de uitkragende banden acht ronde vensters en in de leien vier drieruitsvensters (Rijksmonumentenregister).
//
// Oorsprong op het hart van de cirkelvormige BAG-voetafdruk van pand 0585100001340143 (cirkelfit op 23 hoeken, straal 3,34 m,
// afwijking < 1 cm). Die cirkel is de omtrek van de gootlijst: de luchtfoto toont het dak met die doorsnede en op de foto van de
// RCE is de gootlijst 1,27 keer zo breed als de voet; de voet is dus circa 5,3 m breed. Lokale X-as naar RD-oost, naar de deur.
// Hoeken hieronder in graden linksom vanaf de lokale X-as. Maaiveld AHN-DTM NAP +0,65 rond de voet (0,45 tot 0,98; de dijk ligt
// 15 m naar het zuiden). Top van het dak in het AHN-DSM NAP +15,25 (14,6 m boven het maaiveld; Wikipedia en register noemen
// 18 m), dakhelling in het DSM 0,56 tot 0,6; 3D BAG: dakvlakken van NAP +13,46 tot +15,24. Alle overige hoogtes en stralen uit
// de RCE-foto "Overzicht watertoren - Heinenoord - 20353440 - RCE.jpg" (vanuit het oostzuidoosten, deur rechts in beeld), geschaald op de
// gootlijst (6,68 m) en verticaal met 1,03 bijgesteld op de AHN-top; vormen en banden ook uit "Hoeksche Waard Heinenoord, de
// watertoren RM525095 IMG 2550 2022-07-11 15.16.jpg" (Commons).
import { Manifold, CrossSection, ccw, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [91330.83, 426967.22];
const AXIS_DEG = 0;
const AXIS = [1, 0];
const GROUND_NAP = 0.65;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 44,31, west 44,45, noord 44,28, zuid 44,50),
// gemeten 2026-11-06. Het PDOK-pand staat op 44,1.
const GROUND_ELLIPSOID = 44.28;

const rad = (deg) => (deg * Math.PI) / 180;
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const ngon = (r, n, z, phase = 0) => Array.from({ length: n }, (_, k) => [r * Math.cos(rad(phase + (360 * k) / n)), r * Math.sin(rad(phase + (360 * k) / n)), z]);
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 68 graden op
// (met 56 graden vulde de export op de ronde gevel onder elk nisplafond en onder de kraag boven de bovenste nissen een randje op).
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 2.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));

// ---------- hoogtes boven het maaiveld (NAP +0,65) ----------
const H = {
  plinth: 0.45, // gepleisterde plint (foto 2022: lichtgrijze voet)
  plinthTop: 0.53,
  band1: [2.08, 2.24], // eerste kunststenen band, ter hoogte van de aanzet van de deurboog
  band2: [4.72, 4.88], // tweede kunststenen band met vier ronde vensters
  shaftTop: 7.0, // onderkant van het rondboogfries (aanzetstenen)
  frieze: 7.21, // aanzetstenen: onderkant van 51 graden
  friezeTop: 8.24, // bovenkant van het fries, begin van de uitkragende banden
  corbel: 8.45, // onderkant van 51 graden
  bandTop: 9.68, // band met acht ronde vensters tussen de uitkragende banden
  slate: 10.0, // onderkant van de leien bovenbouw
  slateTop: 12.01, // schoren onder de gootlijst (kraag van 50 graden tot de hoeken van de zestienhoek)
  gutterUnder: 12.47,
  gutterTop: 12.85, // bovenkant van de gootlijst = voet van het dak (3D BAG NAP +13,46)
  apex: 14.6, // AHN-DSM NAP +15,25
};
const R = {
  plinth: 2.72,
  foot: 2.64, // voet van de schacht: 5,28 m doorsnede (foto, geschaald op de gootlijst)
  shaftTop: 2.38, // onder het fries: 4,76 m
  band: 0.1, // uitsprong van de kunststenen banden
  frieze: 2.55,
  corbel: 2.72,
  slate: 2.98, // leien bovenbouw: 5,96 m
  gutter: 3.36, // zestienhoek om de BAG-cirkel (straal 3,34)
  roof: 3.2, // voet van het dak binnen de gootlijst
};
const shaftR = (z) => R.foot + ((R.shaftTop - R.foot) * (z - H.plinthTop)) / (H.shaftTop - H.plinthTop);
const DOOR_DEG = 0; // deur aan de oostzijde (register)

// ---------- toren ----------
// Plint, taps toelopende schacht, rondboogfries, uitkragende banden en leien bovenbouw in één omwentelingsprofiel.
const body = rev([
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.foot, H.plinthTop], [R.shaftTop, H.shaftTop], [R.frieze, H.frieze],
  [R.frieze, H.friezeTop], [R.corbel, H.corbel], [R.corbel, H.bandTop], [R.slate, H.slate], [R.slate, H.slateTop], [0, H.slateTop],
]);
// Kunststenen banden: 0,1 m uitspringend met een onderkant van 50 graden.
const band = ([z0, z1]) => rev([[0, z0 - 1.2 * R.band], [shaftR(z0 - 1.2 * R.band), z0 - 1.2 * R.band], [shaftR(z0) + R.band, z0], [shaftR(z1) + R.band, z1], [0, z1]]);
// Zestienzijdige gootlijst op schoren (als kraag van 50 graden) en het flauwe zestienzijdige kegeldak.
const gutter = hull([...ngon(R.slate, 64, H.slateTop - 0.01), ...ngon(R.gutter, 16, H.gutterUnder), ...ngon(R.gutter, 16, H.gutterTop)]);
const roof = hull([...ngon(R.roof, 16, H.gutterTop - 0.01), [0, 0, H.apex]]);

// Vensters en deur als blinde nissen (in het echt 0,4 à 0,5 m breed; als nis 0,9 m zodat ze op 1:1000 te zien zijn):
// - de deur in een rondboog (1,0 m breed, tot 2,73 m) aan de oostzijde;
// - vier kleine zesruitsvensters ter hoogte van de deurboog, op 45 graden van de deur (foto RCE);
// - vier ronde vensters in de tweede band, recht boven de deur en op 90 graden daarvan;
// - tien bogen in het rondboogfries (in het echt circa 14 smalle bogen);
// - acht ronde vensters in de band tussen de uitkragende banden, tussen de vensters eronder (0,15 m diep en iets lager dan op
//   de foto, zodat het plafond onder de uitkragende band blijft);
// - vier drieruitsvensters in de leien, op de vier hoofdrichtingen (0,2 m diep, 0,3 m lager dan op de foto, onder de schoren).
const windows = union([
  ...around(niche(shaftR(1.3), 1.0, 0, 2.73), [DOOR_DEG]),
  ...around(niche(shaftR(2.8), 0.9, 2.3, 3.25), [45, 135, 225, 315]),
  ...around(niche(shaftR(4.8), 0.9, 4.4, 5.25), [0, 90, 180, 270]),
  ...around(niche(R.frieze, 0.9, 7.25, 8.05, 0.25), Array.from({ length: 10 }, (_, k) => 18 + 36 * k)),
  ...around(niche(R.corbel, 0.9, 8.65, 9.35, 0.15), Array.from({ length: 8 }, (_, k) => 22.5 + 45 * k)),
  ...around(niche(R.slate, 0.9, 10.6, 11.5, 0.2), [0, 90, 180, 270]),
]);

const all = union([body, band(H.band1), band(H.band2), gutter, roof]).subtract(windows);

await writeLandmark({
  slug: "watertoren-heinenoord",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-fries-bovenbouw-gootlijst-en-dak", all]],
  catalog: {
    name: "Watertoren Heinenoord",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[4.5, 0], [-4.5, 0], [0, 4.5], [0, -4.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0585100001340143"],
    description:
      "Oorsprong op het hart van de cirkelvormige BAG-voetafdruk (straal 3,34 m, de omtrek van de gootlijst) op het maaiveld (NAP +0,65 m), X-as naar RD-oost, naar de deur. Ronde, taps toelopende bakstenen onderbouw (5,28 tot 4,76 m doorsnede) met plint, twee kunststenen banden, deur, vier vensters en vier ronde vensters tot 7,0 m; rondboogfries tot 8,24 m; uitkragende banden met acht ronde vensters tot 10,0 m; leien bovenbouw (5,96 m) met vier vensters tot 12,07 m; zestienzijdige gootlijst op schoren tot 12,85 m; flauw zestienzijdig kegeldak tot 14,6 m (AHN). Maten uit BAG, AHN, 3D BAG en foto's.",
    realWorld: {
      built: 1910,
      architect: "J. Smit",
      rijksmonument: 525095,
      publishedHeightM: 18,
      reservoirM3: 50,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 15.25,
      footDiameterM: R.foot * 2,
      shaftTopDiameterM: R.shaftTop * 2,
      friezeM: [H.shaftTop, H.friezeTop],
      slateDiameterM: R.slate * 2,
      slateM: [H.slate, H.slateTop],
      gutterDiameterM: R.gutter * 2,
      gutterTopM: H.gutterTop,
      topM: H.apex,
      roofSides: 16,
      entranceDegrees: DOOR_DEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Heinenoord) (1910, J. Smit, 18 m, 50 m³, aan de Sluisendijk tussen Heinenoord en Goidschalxoord)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/525095 (cirkelvormige plattegrond, taps toelopende onderbouw met gepleisterde plint en twee kunststenen banden, rondboogfries op aanzetstenen, uitkragende banden, cilindrische bovenbouw met leien, zestienzijdige houten gootlijst op schoren, flauw hellend zestienzijdig kegeldak, deur aan de oostzijde, vier zesruitsvensters, vier en acht ronde vensters, vier drieruitsvensters in de leien; loden piron verwijderd)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Heinenoord_-_20353440_-_RCE.jpg en File:Hoeksche_Waard_Heinenoord,_de_watertoren_RM525095_IMG_2550_2022-07-11_15.16.jpg",
      "PDOK BAG-pand 0585100001340143, 3D BAG (dakvlakken NAP +13,46 tot +15,24), AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

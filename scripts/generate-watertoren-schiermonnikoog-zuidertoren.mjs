// Zuidertoren op Schiermonnikoog (1854), gebouwd als vuurtoren, sinds 1950
// watertoren met een reservoir van 44 m³ in de schacht, rijksmonument 398179.
// Een gepleisterde, licht taps toelopende ronde schacht met een rondboogdeur
// op het zuiden, twee rijen ronde vensters langs de trap, een ringband met
// daarboven een fries van blinde rondboogjes, een zwaar overstekende
// omloopkroonlijst, het lage lantaarnhuis met een eigen kroonlijst en een
// geribde koepel.
// Oorsprong op het middelpunt van de cirkel door de BAG-contour (straal 3,86 m,
// de plint) op maaiveld (NAP +13,33 m in het AHN-DTM, de duintop), assen in
// RD-richting. Hoogtes van omloop (29,8 m), lantaarnkroonlijst (31,05 m) en
// koepel uit het AHN; de stralen boven uit de frontale foto "Zuidertoren
// Schiermonnikoog" geschaald op de omloop in het AHN (5,6 m = 22,3 px/m), de
// hoogtes van fries en kroonlijst en de vensters uit drie foto's vanuit het
// zuiden en zuidwesten. De deur staat op het zuiden, aan het schelpenpad op de
// luchtfoto; de tweede vensterrij een kwartslag linksom gezien van buiten (west).
import { Manifold, CrossSection, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [206213.86, 610862.86];
const AXIS = [1, 0];
const BASE = -0.3;
const H = {
  plinth: 0.7, // bovenkant van de plint
  bandFoot: 27.55, // de ringband onder het fries begint hier met een schuine onderkant
  band: 27.77,
  frieze: 28.0, // fries met blinde rondboogjes
  cornice: 28.8, // onderkant van de omloopkroonlijst (schuin onder 51 graden naar buiten)
  rim: 29.55,
  gallery: 29.8, // omloop (AHN)
  lantern: 30.3, // het lantaarnhuis tot de schuine onderkant van zijn kroonlijst
  lanternRim: 30.85,
  lanternTop: 31.05, // AHN
  domeRise: 1.8, // koepel tot 32,85 (AHN 32,6 tot 33,2 rond de voet van de windvaan)
};
const R = { plinth: 3.86, foot: 3.78, shaftTop: 2.2, band: 2.35, gallery: 2.8, lantern: 1.5, lanternRim: 1.89, dome: 1.3 };
const DOOR = -90; // graden, het zuiden
const WEST = DOOR - 90; // tweede vensterrij
const shaftR = (z) => R.foot + ((z - H.plinth) / (H.bandFoot - H.plinth)) * (R.shaftTop - R.foot);

// ---------- schacht, fries, kroonlijsten en lantaarn als één omwentelingsprofiel ----------
const body = Manifold.revolve(
  new CrossSection([[
    [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.foot, H.plinth],
    [R.shaftTop, H.bandFoot], [R.band, H.band], [R.band, H.frieze], [R.shaftTop, H.frieze],
    [R.shaftTop, H.cornice], [R.gallery, H.rim], [R.gallery, H.gallery],
    [R.lantern, H.gallery], [R.lantern, H.lantern], [R.lanternRim, H.lanternRim], [R.lanternRim, H.lanternTop],
    [0, H.lanternTop],
  ]]),
  96,
);
// Geribde koepel: een halve ellipsoïde met twaalf vlakken.
const dome = Manifold.revolve(
  new CrossSection([[
    [0, H.lanternTop - 0.05], [R.dome, H.lanternTop - 0.05],
    ...Array.from({ length: 9 }, (_, k) => {
      const t = (k / 9) * (Math.PI / 2);
      return [R.dome * Math.cos(t), H.lanternTop + H.domeRise * Math.sin(t)];
    }),
    [0, H.lanternTop + H.domeRise],
  ]]),
  12,
);

// ---------- nissen: deur, vensters en het boogjesfries ----------
// Rondboognis in het vlak met normaal +X op afstand f: het plafond loopt naar
// binnen onder 56 graden op (1,5 m per m diepte), ook in de boog, zodat de
// export hem niet opvult.
const archNiche = (f, w, z0, zs, depth) => {
  const a = f - depth, b = f + 1.0, rise = 1.5 * depth;
  const arc = Array.from({ length: 9 }, (_, k) => {
    const t = (k / 8) * Math.PI;
    return [(w / 2) * Math.cos(t), zs + (w / 2) * Math.sin(t)];
  });
  return hull([
    [a, -w / 2, z0], [a, w / 2, z0], [b, -w / 2, z0], [b, w / 2, z0],
    ...arc.flatMap(([y, z]) => [[f, y, z], [a, y, z + rise], [b, y, z - 1.5]]),
  ]);
};
// Rond venster (oculus) met een plafond onder 56 graden.
const roundNiche = (f, rad, zc, depth) => {
  const a = f - depth, b = f + 1.0, rise = 1.5 * depth;
  const ring = Array.from({ length: 12 }, (_, k) => [rad * Math.cos((k * Math.PI) / 6), zc + rad * Math.sin((k * Math.PI) / 6)]);
  return hull(ring.flatMap(([y, z]) => [[f, y, z], [a, y, z + rise], [b, y, z - 1.5]]));
};
const OCULUS = 0.35;
const cuts = [
  place(archNiche(shaftR(3.0), 1.65, 0, 2.2, 0.4), { deg: DOOR }), // dubbele deur met bovenlicht, boog tot 3,0 m
  ...[10.5, 19.0, 26.7].map((z) => place(roundNiche(shaftR(z), OCULUS, z, 0.25), { deg: DOOR })),
  ...[5.7, 14.6, 22.5].map((z) => place(roundNiche(shaftR(z), OCULUS, z, 0.25), { deg: WEST })),
  // Twaalf blinde rondboogjes van 0,7 m tussen penanten van 0,45 m.
  ...Array.from({ length: 12 }, (_, k) => place(archNiche(R.shaftTop, 0.7, 28.1, 28.35, 0.2), { deg: DOOR + 15 + k * 30 })),
];

await writeLandmark({
  slug: "watertoren-schiermonnikoog-zuidertoren",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-omloop-lantaarn-en-koepel", union([body, dome]).subtract(union(cuts))]],
  catalog: {
    name: "Zuidertoren Schiermonnikoog",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5.4, 0], [-5.4, 0], [0, 5.4], [0, -5.4]],
    replacesBuildings: ["NL.IMBAG.Pand.0088100000138176"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +13,33 m, duintop), assen in RD-richting. Gepleisterde ronde schacht van 7,7 m met plint, taps tot 4,4 m op 27,55 m, rondboogdeur op het zuiden en twee rijen ronde vensters (zuid en west); ringband, fries met twaalf blinde rondboogjes, omloopkroonlijst van 5,6 m op 29,8 m, lantaarnhuis van 3,0 m met kroonlijst tot 31,05 m en een twaalfzijdige geribde koepel tot 32,85 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      publishedHeightM: 31.5,
      reservoirM3: 44,
      built: 1854,
      ahnGroundNapM: 13.33,
      ahnGalleryNapM: 43.13,
      ahnTopNapM: 46.77,
      bagDiameterM: 7.72,
      footDiameterM: 7.56,
      shaftTopDiameterM: 4.4,
      galleryDiameterM: 5.6,
      galleryM: 29.8,
      lanternDiameterM: 3.0,
      lanternCorniceM: 31.05,
      domeDiameterM: 2.6,
      modelTopM: 32.85,
      photoScalePxPerM: 22.3,
      minimumPartM: 0.45,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Zuidertoren_(Schiermonnikoog)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/398179",
      "https://commons.wikimedia.org/wiki/File:Zuidertoren_Schiermonnikoog.jpg (frontale foto op de deur, stralen en hoogtes boven)",
      "https://commons.wikimedia.org/wiki/File:Torenstreek22_Zuidertoren_Schiermonnikoog.jpg (vensters boven de deur, fries)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Schiermonnikoog_15m.JPG (tweede vensterrij)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Schiermonnikoog_-_20273297_-_RCE.jpg (vensterhoogtes, fries en lantaarn)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_ENTREE_-_Schiermonnikoog_-_20273300_-_RCE.jpg (deur, plint)",
      "PDOK BAG-pand 0088100000138176, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

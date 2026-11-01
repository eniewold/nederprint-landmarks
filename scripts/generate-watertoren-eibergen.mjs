// Watertoren van Eibergen (J.H.J. Kording, 1935), rijksmonument 509417, met
// reservoirs van 400 en 200 m³. Bakstenen ronde schacht met vier vlakke
// risalieten, een witte betonnen band op de bodem van de reservoirzone, drie
// hoge spleetvensters per hoek met witte kruisblokken in de kroonlijst en een
// koperen kegeldak.
// Oorsprong op het middelpunt van de BAG-contour (de hoekpunten tussen de
// risalieten liggen op een cirkel van 5,83 m, binnen 0,12 m; de kegel in het
// AHN ligt 0,1 m daarnaast) op maaiveld (NAP +29,2 m, de verhoogde berm rond de
// voet). +X wijst naar de oostelijke risaliet, 4,6 graden linksom van RD-oost
// (de rechte vlakken van de BAG-contour). Hoogtes uit de frontale RCE-foto
// 20359578 (camera recht, 32,0 px/m, geschaald op de risaliet van 3,8 m en de
// kroonlijst in het AHN); de kegel uit het AHN (helling 1:1, top NAP +74,4).
// De ingang zit in de noordwestelijke hoek, onder de ventilatieroosters.
import { Manifold, CrossSection, hull, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [242361.39, 459482.32];
const AXIS = [0.99678, 0.0802]; // 4,6 graden
const BASE = -0.3;
const H = {
  plinth: 2.5, // bovenkant van de gemetselde plint met witte waterlijst
  door: 2.1, // het nisplafond blijft onder de plint
  bandFoot: 27.6, // schuine onderkant van de witte band (in de muur)
  bandFront: 28.7,
  band: 29.4,
  slitFoot: 30.6,
  slitTop: 37.8,
  corniceFoot: 37.8, // schuine onderkant van de kroonlijst (in de muur)
  corniceFront: 38.9,
  cornice: 39.3,
  crossTop: 39.6, // de kruisblokken steken 0,3 m boven de kroonlijst uit
  apex: 45.2, // AHN: kegel 1:1, top NAP +74,4
};
const R = { shaft: 5.83, face: 5.88, half: 1.9, plinth: 0.15, band: 6.25, coneFoot: 5.9 };
const SLOPE = Math.tan((56 * Math.PI) / 180); // onderkanten onder 56 graden

// ---------- ronde schacht met vier vlakke risalieten ----------
// Elke risaliet is 3,8 m breed met het vlak op 5,88 m: in het midden 0,05 m
// voor de cirkel, aan de randen 0,37 m (de stappen in de BAG-contour).
const plan = (grow, z0, z1) =>
  union([
    prism(circle([0, 0], R.shaft + grow, 96), z0, z1),
    ...[0, 90, 180, 270].map((deg) => place(prism([[0, -R.half - grow], [R.face + grow, -R.half - grow], [R.face + grow, R.half + grow], [0, R.half + grow]], z0, z1), { deg })),
  ]);
const shaft = plan(0, BASE, H.cornice - 0.05);
const plinth = plan(R.plinth, BASE, H.plinth);

// ---------- witte band en kroonlijst als omwentelingsprofiel ----------
// Schuine onderkant onder 56 graden vanuit de muur, dan een rechte voorkant.
const ring = (foot, front, top) =>
  Manifold.revolve(new CrossSection([[[5.0, foot - (R.band - 5.0 - 0.75) * SLOPE], [5.5, foot], [R.band, front], [R.band, top], [5.0, top]]]), 96);
const band = ring(H.bandFoot, H.bandFront, H.band);
const cornice = ring(H.corniceFoot, H.corniceFront, H.cornice);

// ---------- koperen kegeldak ----------
const cone = Manifold.revolve(new CrossSection([[[0, H.cornice - 0.05], [R.coneFoot, H.cornice - 0.05], [R.coneFoot, H.cornice], [0, H.apex]]]), 96);

// ---------- hoeken: spleetvensters met kruisblokken ----------
const CORNERS = [45, 135, 225, 315];
const SLIT_STEP = (1.3 / R.shaft) * (180 / Math.PI); // 1,3 m hart op hart langs de cirkel
// Kruisblok boven elk spleetvenster: 0,7 m breed, tot 6,3 m uit het hart en
// 0,3 m boven de kroonlijst, met een onderkant onder 56 graden.
const crossBlock = (() => {
  const w = 0.35, a = 5.5, b = 6.3, z0 = H.slitTop + 0.05;
  const zb = z0 + (b - R.shaft) * SLOPE;
  return hull([[a, -w, z0 - (R.shaft - a) * SLOPE], [a, w, z0 - (R.shaft - a) * SLOPE], [b, -w, zb], [b, w, zb], [a, -w, H.crossTop], [a, w, H.crossTop], [b, -w, H.crossTop], [b, w, H.crossTop]]);
})();
const crosses = union(CORNERS.flatMap((c) => [-1, 0, 1].map((k) => place(crossBlock, { deg: c + k * SLIT_STEP }))));

// Nis met een plafond dat naar binnen onder 56 graden oploopt (de export vult hem niet op), in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const cuts = [
  ...CORNERS.flatMap((deg) => [
    // Drie hoge vensters boven elkaar, ventilatierooster en raamband onder de witte band.
    ...[[7.4, 10.4], [13.3, 16.6], [19.6, 22.7]].map(([z0, z1]) => place(niche(R.shaft, 0.6, z0, z1), { deg })),
    place(niche(R.shaft, 0.6, 4.2, 5.3, 0.25), { deg }),
    place(niche(R.shaft, 2.4, 25.6, 27.1), { deg }),
    // Drie spleetvensters in de reservoirzone, pijlers van 0,9 m.
    ...[-1, 0, 1].map((k) => place(niche(R.shaft, 0.4, H.slitFoot, H.slitTop, 0.25), { deg: deg + k * SLIT_STEP })),
  ]),
  // Deur in de noordwestelijke hoek, onder het rooster.
  place(niche(R.shaft + R.plinth, 1.2, 0, H.door, 0.45), { deg: 135 }),
  // Verdiept middenvlak tussen twee lisenen van 1,1 m op elke risaliet, van de plint tot onder de band.
  ...[0, 90, 180, 270].map((deg) => place(niche(R.face, 1.6, H.plinth, 27.9, 0.2), { deg })),
];

await writeLandmark({
  slug: "watertoren-eibergen",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-band-kroonlijst-en-kegeldak", union([shaft, plinth, band, cornice, crosses, cone]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Eibergen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, 7.5], [0, -7.5]],
    replacesBuildings: ["NL.IMBAG.Pand.1859100000791649"],
    description:
      "Oorsprong op het middelpunt van de BAG-contour op maaiveld (NAP +29,2 m), +X naar de oostelijke risaliet op 4,6 graden. Ronde bakstenen schacht van 11,7 m met vier vlakke risalieten van 3,8 m (lisenen en verdiept middenvlak), plint tot 2,5 m, per hoek drie vensters boven elkaar en een raamband, witte band van 28 tot 29,4 m, drie spleetvensters per hoek met kruisblokken in de kroonlijst op 39,3 m en een koperen kegeldak tot 45,2 m; deur in de noordwestelijke hoek. Maten uit BAG, AHN en een RCE-foto.",
    realWorld: {
      publishedHeightM: 46,
      reservoirsM3: [400, 200],
      ahnGroundNapM: 29.2,
      ahnTopNapM: 74.4,
      shaftDiameterM: 11.66,
      risalitWidthM: 3.8,
      bandM: [28.0, 29.4],
      corniceM: 39.3,
      roofPitchDeg: 45,
      modelTopM: 45.2,
      photoScalePxPerM: 32.0,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Eibergen)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/509417",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Eibergen_-_20359578_-_RCE.jpg (frontale foto op de westelijke risaliet, maten)",
      "https://commons.wikimedia.org/wiki/File:Eibergen_Watertoren_2006.JPG (hoek met vensters, kroonlijst en kegeldak)",
      "PDOK BAG-pand 1859100000791649, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

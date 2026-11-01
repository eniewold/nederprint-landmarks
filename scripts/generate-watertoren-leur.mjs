// Watertoren van Leur (gemeente Wijchen), ontworpen door Brouwer en Deurvorst
// en gebouwd in 1960, 40 m hoog met een reservoir van 800 m³. Ronde betonnen
// schacht met horizontale banden, een grijs beklede plint en bovenaan een band
// met kleine vensters; daarop een gladde kraag en een omgekeerde kegel met
// verticale ribben tot een witte dakrand, een plat dak met een ronde
// dakopbouw in het midden.
// Oorsprong op het hart van de ronde BAG-contour (straal 2,5 m, de schacht) op
// maaiveld (NAP +7,45 m), assen in RD-richting. Het hart van het reservoir en
// van de dakopbouw in het AHN ligt 0,15 tot 0,3 m daarvandaan.
// Hoogtes uit de foto "Leur Watertoren 2006" met een cameramodel geschaald op
// de schachtbreedte (BAG, 5,0 m) en de reservoirbreedte (AHN, 20,2 m); de top
// van de dakopbouw uit het AHN (NAP +47,58 m). Het AHN ziet het metalen dak
// van het reservoir niet goed (losse punten van 20 tot 33 m boven maaiveld);
// de foto en de slagschaduw van de dakopbouw op de luchtfoto geven de dakrand
// rond 38 m.
import { Manifold, CrossSection, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [176832.1, 425308.2];
const AXIS = [1, 0];
const BASE = -0.3;
const SEG = 144; // 2,5 graden: de kammen van de ribben vallen op hoekpunten
const H = {
  plinth: 3.8, // bovenkant van de grijze plaatbekleding
  bands: [7.0, 9.95, 12.9, 15.85, 18.8, 21.75, 24.7], // onderkant van de betonbanden, steek 2,95 m
  band: 0.35, // hoogte van een band
  windowBand: 27.6, // onderkant van de vensterband boven aan de schacht
  shaftTop: 28.3, // begin van de gladde kraag
  coneFoot: 30.0, // begin van de geribde kegel
  rimFoot: 37.45, // bovenrand van de kegel, begin van de schuine onderkant van de dakrand
  fasciaFoot: 37.9,
  eave: 38.05, // bovenkant van de witte dakrand
  deck: 38.45, // plat dak binnen de schuine dakring
  drumEave: 39.15, // ronde dakopbouw
  drumTop: 39.85,
  top: 40.1, // ventilatiekap (AHN-top 40,13 m boven maaiveld)
};
const R = {
  shaft: 2.5,
  plinth: 2.58,
  band: 2.62,
  coneFoot: 3.5,
  rimFoot: 9.76,
  rim: 10.1,
  deck: 8.1,
  drum: 3.35,
  drumTop: 2.1,
  vent: 0.6,
};
const RIBS = 72; // geteld op de foto: 5 graden steek

const revolve = (profile) => Manifold.revolve(new CrossSection([profile]), SEG);

// ---------- schacht, kraag, kegel, dakrand en dak in één omwentelingsprofiel ----------
// De banden en de vensterband steken 0,12 m uit met een onderkant van 56 graden.
// De kegel loopt van r 3,5 op +30,0 naar r 9,76 op +37,45 (50 graden), dan een
// schuine onderkant van 55 graden naar de witte dakrand, een dakring die naar
// binnen oploopt (lichter aan de zonkant op de luchtfoto), het platte dak en de
// ronde dakopbouw met een kegelvormig dak en een ventilatiekap.
const bandProfile = (z) => [[R.shaft, z], [R.band, z + 0.18], [R.band, z + H.band], [R.shaft, z + H.band]];
const body = revolve([
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.shaft, H.plinth],
  ...H.bands.flatMap(bandProfile),
  [R.shaft, H.windowBand - 0.18], [R.band, H.windowBand], [R.band, H.shaftTop], [R.shaft, H.shaftTop],
  [R.coneFoot, H.coneFoot], [R.rimFoot, H.rimFoot], [R.rim, H.fasciaFoot], [R.rim, H.eave],
  [R.deck, H.deck], [R.drum, H.deck], [R.drum, H.drumEave], [R.drumTop, H.drumTop],
  [R.vent, H.drumTop], [R.vent, H.top], [0, H.top],
]);

// ---------- ribben van de kegel ----------
// 72 V-groeven tussen scherpe kammen op de kegel. De groef wordt dieper tot
// 0,17 m op +35,3 en loopt dan onder 47 graden uit tot niets onder de dakrand,
// zodat er geen vlak plafondje onder de rand overblijft.
const coneR = (z) => R.coneFoot + ((z - H.coneFoot) * (R.rimFoot - R.coneFoot)) / (H.rimFoot - H.coneFoot);
const pitch = (2 * Math.PI) / RIBS;
const grooveSection = (phi, z, d) => {
  const out = coneR(z) / Math.cos(pitch / 2) + 0.1;
  return [
    [out * Math.cos(phi - pitch / 2), out * Math.sin(phi - pitch / 2), z],
    [out * Math.cos(phi + pitch / 2), out * Math.sin(phi + pitch / 2), z],
    [(coneR(z) - d) * Math.cos(phi), (coneR(z) - d) * Math.sin(phi), z],
  ];
};
const GROOVE = [[H.coneFoot, 0.06], [35.3, 0.17], [H.rimFoot, 0]]; // [z, diepte]
const grooves = union(
  Array.from({ length: RIBS }, (_, k) => {
    const phi = pitch * (k + 0.5); // kammen op veelvouden van 5 graden, op hoekpunten van de omwenteling
    return union(GROOVE.slice(1).map(([z1, d1], i) => {
      const [z0, d0] = GROOVE[i];
      return Manifold.hull([...grooveSection(phi, z0, d0), ...grooveSection(phi, z1, d1)]);
    }));
  }),
);

// ---------- deur en vensters ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return Manifold.hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const cuts = union([
  place(niche(R.plinth, 1.2, 0, 2.4, 0.3), { deg: -90 }), // deur naar het pad aan de zuidkant
  // Twaalf kleine vensters in de band boven aan de schacht (penanten van 0,97 m).
  ...Array.from({ length: 12 }, (_, k) => place(niche(R.band, 0.4, H.windowBand + 0.15, H.windowBand + 0.5, 0.25), { deg: 15 + k * 30 })),
]);

await writeLandmark({
  slug: "watertoren-leur",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los reservoir zou een voet tot de grondplaat krijgen.
  nodes: [["building:schacht-kegelreservoir-en-dakopbouw", body.subtract(union([grooves, cuts]))]],
  catalog: {
    name: "Watertoren Leur",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[4, 0], [-4, 0], [0, 4], [0, -4]],
    replacesBuildings: ["NL.IMBAG.Pand.0296100000021710"],
    description:
      "Oorsprong op het hart van de ronde BAG-contour van de schacht op maaiveld (NAP +7,45 m), assen in RD-richting. Ronde schacht van 5,0 m met plint, zeven banden en een vensterband tot 28,3 m, gladde kraag tot 30 m, omgekeerde kegel met 72 ribben onder 50 graden tot een witte dakrand van 20,2 m op 38 m, plat dak met ronde dakopbouw tot 40,1 m; deur naar het zuiden geschat. Maten uit BAG, AHN, luchtfoto en één foto.",
    realWorld: {
      publishedHeightM: 40,
      reservoirM3: 800,
      ahnGroundNapM: 7.45,
      ahnTopNapM: 47.58,
      shaftDiameterM: 5.0,
      rimDiameterM: 20.2,
      shaftTopM: 28.3,
      coneFootM: 30.0,
      coneAngleDeg: 50,
      ribs: RIBS,
      eaveM: 38.05,
      deckM: 38.45,
      drumDiameterM: 6.7,
      modelTopM: 40.1,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Leur)",
      "https://commons.wikimedia.org/wiki/File:Leur_Watertoren_2006.JPG (foto, hoogtes en ribben)",
      "PDOK BAG-pand 0296100000021710, AHN DSM/DTM 0,5 m en luchtfoto, 3D BAG, 2026-11-01",
    ],
  },
});

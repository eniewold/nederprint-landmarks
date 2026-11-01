// Watertoren Oranje Nassaumijnen in Heerlen ("Nieuwe Watertoren", 1952), op het
// terrein van de voormalige steenkolenmijn Oranje Nassau I naast station Heerlen
// Woonboulevard; 35 m hoog, reservoir van 630 m³, sinds 2006 buiten bedrijf.
// Ronde, licht verjongende bakstenen schacht met trappenhuisvensters (kleine
// rondboogvensters, om en om in vier kolommen), bovenaan een rondboogfries op een
// licht uitkragende band met tien getraliede rondboogvensters en blinde panelen
// eronder, een zware lichte kroonlijst, een vlak kegeldak en een ventilatiekap.
// Oorsprong op het hart in het AHN (cirkelfit per hoogte; de BAG-cirkel met straal
// 6,48 m is de kroonlijst en ligt 0,27 m daarvandaan) op maaiveld aan de lage,
// zuidkant van de voet (NAP +107,5 m; de voet loopt op tot NAP +107,8 aan de
// noordkant en het terrein zakt verder naar het noordoosten weg), assen in RD-richting.
// Kroonlijst, dak en kap uit het AHN; de zones van de top en de vensters uit de
// frontale foto "Heerlen Watertoren 3808" (30,5 px/m, geschaald op de kroonlijst
// van 12,96 m en de dakrand in het AHN); de verjonging uit dezelfde foto.
import { Manifold, CrossSection, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [195339.08, 323001.34];
const AXIS = [1, 0];
// Onderkant 1 m onder het maaiveld: de voet staat op een licht hellend terrein
// (0,35 m verschil rond de voet) en moet aan de lage kant in het PDOK-terrein blijven.
const BASE = -1.0;
const H = {
  band: 32.46, // onderkant van de uitkragende band (voet van de kraagsteentjes van het boogfries)
  arch: 32.67, // aanzet van de boogjes; de top van de boogjes ligt op 33,17
  corniceFoot: 33.33, // de kroonlijst begint op de band, onder 56 graden
  corniceFace: 33.85,
  eave: 34.1, // bovenkant van de kroonlijst = dakrand (AHN NAP +141,6)
  capFoot: 35.03, // waar het kegeldak de kap raakt
  lid: 35.75, // onderkant van de deksel van de kap
  lidFace: 36.22,
  top: 36.32, // AHN-top NAP +143,82
};
const R = { foot: 6.35, cornice: 6.48, bandOut: 0.15, cap: 0.55, lid: 0.87 };
const TAPER = 0.011; // m per m: 12,7 m aan de voet, 12,0 m onder de band
const rz = (z) => R.foot - TAPER * z;
const T = Math.tan((56 * Math.PI) / 180); // 1,48: onderkanten van band, kroonlijst en deksel onder 56 graden

// ---------- schacht, band, kroonlijst, kegeldak en kap als één omwentelingsprofiel ----------
const bandFace = rz(H.band) + R.bandOut;
const profile = [
  [0, BASE],
  [rz(BASE), BASE],
  [rz(H.band - R.bandOut * T), H.band - R.bandOut * T],
  [bandFace, H.band],
  [bandFace, H.corniceFoot],
  [R.cornice, H.corniceFace],
  [R.cornice, H.eave],
  [R.cap, H.capFoot], // kegeldak van circa 9 graden (AHN 0,157 m per m)
  [R.cap, H.lid],
  [R.lid, H.lidFace],
  [R.lid, H.top],
  [0, H.top],
];
const body = Manifold.revolve(new CrossSection([profile]), 96);

// ---------- nissen ----------
// Nis in het vlak met normaal +X op afstand f; het plafond loopt naar binnen op onder 56 graden.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Rondboogvenster: rechte stijlen tot z1, boog met pijl `rise` erboven; plafond onder 56 graden.
const archNiche = (f, w, z0, z1, rise, depth = 0.3) => {
  const arc = Array.from({ length: 7 }, (_, i) => {
    const v = -w / 2 + (w * i) / 6;
    return [v, z1 + rise * Math.sqrt(Math.max(0, 1 - (2 * v / w) ** 2))];
  });
  const a = f - depth, b = f + 1.0;
  return hull([
    [a, -w / 2, z0], [a, w / 2, z0], [b, -w / 2, z0], [b, w / 2, z0],
    ...arc.map(([v, z]) => [f, v, z]), ...arc.map(([v, z]) => [a, v, z + 1.5 * depth]),
    [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5],
  ]);
};

const cuts = [];
// Rondboogfries: dertig boogjes van 1,0 m (steek 1,26 m) in de uitkragende band, tot in de schacht; ertussen
// blijven kraagsteentjes van 0,26 m staan, vast aan de schacht en met de 56-gradenonderkant van de band.
const TOP_PHASE = -5; // graden; de stand is niet bekend en volgt de oostelijke vensterkolom
for (let k = 0; k < 30; k++) cuts.push(place(archNiche(bandFace, 1.0, H.band - 0.25, H.arch, 0.5, R.bandOut + 0.03), { deg: TOP_PHASE + k * 12 }));
// Tien getraliede rondboogvensters in het boogfries (elk derde boogje), 0,75 m breed, met een blind paneel eronder.
for (let k = 0; k < 10; k++) {
  const deg = TOP_PHASE + k * 36;
  cuts.push(place(archNiche(bandFace, 0.75, 31.54, 32.42, 0.37, 0.45), { deg }));
  cuts.push(place(niche(rz(30.5), 0.75, 29.57, 31.6, 0.15), { deg }));
}
// Trappenhuisvensters: 0,65 × 1,3 m, om en om in vier kolommen (oost/west en zuid/noord 3,1 m verspringend).
const STAIR = [
  [-5, [10.5, 16.6, 22.8]], // oost
  [175, [10.5, 16.6, 22.8]], // west
  [-95, [7.2, 13.3, 19.5, 25.9]], // zuid
  [85, [7.2, 13.3, 19.5, 25.9]], // noord
];
for (const [deg, zs] of STAIR) for (const c of zs) cuts.push(place(archNiche(rz(c), 0.65, c - 0.65, c + 0.35, 0.3), { deg }));
// Deur naar het pad langs het spoor (zuidzuidwest).
cuts.push(place(niche(rz(1.2), 1.3, 0, 2.5, 0.35), { deg: -110 }));

const tower = body.subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-heerlen-oranje-nassaumijnen",
  base: BASE,
  // Eén node: de export vult elke node apart op; een losse kroonlijst of kap zou een voet tot de grondplaat krijgen.
  nodes: [["building:schacht-boogfries-kroonlijst-en-dak", tower]],
  catalog: {
    name: "Watertoren Oranje Nassaumijnen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Acht punten net buiten de voet; de lader neemt de laagste (de zuidkant, NAP +107,5).
    groundSamplePoints: [[7.9, 0], [5.59, 5.59], [0, 7.9], [-5.59, 5.59], [-7.9, 0], [-5.59, -5.59], [0, -7.9], [5.59, -5.59]],
    // Ellipsoïdisch maaiveld: NAP +107,5 m plus de NLGEO2018-geoïdehoogte 45,73 m op de oorsprong.
    groundHeight: 153.23,
    replacesBuildings: ["NL.IMBAG.Pand.0917100000030863"],
    description:
      "Oorsprong op het hart in het AHN op maaiveld aan de lage zuidkant van de voet (NAP +107,5 m), assen in RD-richting. Ronde bakstenen schacht van 12,7 m aan de voet naar 12,0 m onder de band, met trappenhuisvensters in vier kolommen en een deur naar het zuidzuidwesten; uitkragende band van het boogfries op 32,5 m met tien rondboogvensters en blinde panelen eronder, kroonlijst van 12,96 m tot 34,1 m, vlak kegeldak en ventilatiekap tot 36,3 m. Maten uit AHN, BAG en foto.",
    realWorld: {
      publishedHeightM: 35,
      reservoirM3: 630,
      built: 1952,
      ahnGroundNapM: 107.5,
      ahnGroundNorthNapM: 107.8,
      ahnRoofEdgeNapM: 141.6,
      ahnTopNapM: 143.82,
      geoidHeightM: 45.73,
      shaftDiameterFootM: 12.7,
      shaftDiameterTopM: 11.99,
      bandDiameterM: +(2 * bandFace).toFixed(2),
      corniceDiameterM: 12.96,
      bandM: H.band,
      eaveM: H.eave,
      roofPitchDeg: 9,
      capDiameterM: [1.1, 1.74],
      modelTopM: H.top,
      photoScalePxPerM: 30.5,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Heerlen_Oranje_Nassaumijnen)",
      "https://commons.wikimedia.org/wiki/File:Heerlen_Watertoren_3808.JPG (frontaal: boogfries, vensters, panelen, kroonlijst, kap, verjonging)",
      "PDOK BAG-pand 0917100000030863, AHN DSM/DTM 0,5 m en luchtfoto, NLGEO2018, 2026-11-01",
    ],
  },
});

// Poldertoren van Emmeloord (H. van Gent met J.W.H.C. Pot, 1957-1959),
// watertoren met carillon, rijksmonument 532139.
// Oorsprong op het hart van de achthoekige BAG-contour (14,0 m over de vlakken)
// op maaiveld (NAP -2,5 m). +X wijst naar het klokvlak op 14,5 graden linksom
// van RD-oost: de vier hoofdvlakken (0/90/180/270) dragen de klok, de vier
// diagonale vlakken hoge smalle vensters. De lantaarn is een langwerpige
// achthoek: aan de oost- en westzijde (0/180) springt hij 2 m in, zodat daar het
// platform op 48 m in het AHN te zien is; aan de andere zes zijden 0,5 m.
// Hoogtes uit de frontale RCE-foto 20413330 (genomen loodrecht op vlak 90 of
// 270), geschaald op het platform in het AHN (48,5 m, 21,2 px/m); de breedtes
// van de lantaarn en het tentdak uit het AHN (dakvoet 60,8, top 65,3 m zoals
// Wikipedia zonder windvaan).
import { Manifold, CrossSection, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [179582.51, 524787.84];
const AXIS = [0.9681, 0.2504];
const BASE = -0.3;
const H = {
  platform: 48.5, // bezoekersplatform, bovenkant schacht
  eave: 60.8, // voet van het tentdak
  apex: 65.3,
};
const A = { foot: 7.0, platform: 6.7 }; // apothema van de achthoekige schacht
const L = [4.7, 6.2, 6.2, 6.2, 4.7, 6.2, 6.2, 6.2]; // apothema van de lantaarn per vlak (0, 45, ... graden)

// ---------- verjongende achthoekige schacht ----------
const oct = (a, z) => ring3(circle([0, 0], a / Math.cos(Math.PI / 8), 8, Math.PI / 8), z);
const shaft = hull([...oct(A.foot, BASE), ...oct(A.platform, H.platform)]);
const apo = (z) => A.foot + ((z - BASE) / (H.platform - BASE)) * (A.platform - A.foot);

// ---------- lantaarn met carillon en tentdak ----------
// Hoekpunten als snijpunten van opeenvolgende vlakken (normaal k*45 graden, apothema L[k] + grow).
const lanternPts = (grow = 0) =>
  L.map((a0, k) => {
    const t0 = (k * Math.PI) / 4, t1 = ((k + 1) * Math.PI) / 4, a = a0 + grow, b = L[(k + 1) % 8] + grow;
    const det = Math.sin(t1 - t0);
    return [(a * Math.sin(t1) - b * Math.sin(t0)) / det, (b * Math.cos(t0) - a * Math.cos(t1)) / det];
  });
const lantern = union([
  Manifold.extrude(new CrossSection([lanternPts()]), H.eave - H.platform + 0.05).translate([0, 0, H.platform - 0.05]),
  hull([...ring3(lanternPts(0.2), H.eave - 0.05), ...ring3(lanternPts(0.2), H.eave + 0.25), [0, 0, H.apex]]),
]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt (de export vult hem niet op), in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const MAIN = [0, 90, 180, 270];
const DIAG = [45, 135, 225, 315];
const cuts = [
  ...[0, 270].map((deg) => place(niche(A.foot, 2.6, 0, 4.25, 0.4), { deg })), // ingang en glaspui
  ...MAIN.flatMap((deg) => [
    // Klokzone: drie hoge vensters achter de wijzerplaat.
    ...[-1.15, 0, 1.15].map((y) => place(niche(apo(34.6), 0.75, 30.0, 39.2).translate([0, y, 0]), { deg })),
    // Lantaarn: drie hoge galmgaten voor het carillon, met pijlers van minstens 0,9 m (smallere vult de export op).
    ...(deg % 180 === 0 ? [-1.8, 0, 1.8] : [-1.6, 0, 1.6]).map((y) => place(niche(L[deg / 45], deg % 180 === 0 ? 0.9 : 0.7, 49.8, 59.3, 0.9).translate([0, y, 0]), { deg })),
  ]),
  ...DIAG.flatMap((deg) => [
    // Twee hoge smalle vensters in de klokzone en twee bij de voet.
    ...[-0.7, 0.7].map((y) => place(niche(apo(34.6), 0.6, 30.0, 39.2).translate([0, y, 0]), { deg })),
    ...[-0.7, 0.7].map((y) => place(niche(A.foot, 0.6, 0.3, 4.2).translate([0, y, 0]), { deg })),
    // Paren kleine vensters langs de trap.
    ...[12.5, 18.2, 24.0, 43.9].flatMap((z) => [-0.7, 0.7].map((y) => place(niche(apo(z), 0.6, z - 0.45, z + 0.45, 0.25).translate([0, y, 0]), { deg }))),
    // Lantaarn: één breed galmgat in elk afgeschuind vlak (3,0 m breed, pijlers 0,9 m).
    // Het voetpunt van de loodlijn ligt 1,06 m van het midden van het vlak (langwerpige achthoek).
    place(niche(L[deg / 45], 1.2, 49.8, 59.3, 0.9).translate([0, deg % 180 === 45 ? 1.06 : -1.06, 0]), { deg }),
  ]),
];

await writeLandmark({
  slug: "watertoren-emmeloord",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-lantaarn-en-tentdak", union([shaft, lantern]).subtract(union(cuts))]],
  catalog: {
    name: "Poldertoren Emmeloord",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[10, 0], [-10, 0], [0, 10], [0, -10]],
    replacesBuildings: ["NL.IMBAG.Pand.0171100000012589"],
    description:
      "Oorsprong op het hart van de achthoekige BAG-contour op maaiveld (NAP -2,5 m), +X naar het klokvlak op 14,5 graden (oost). Bakstenen achthoek van 14,0 m over de vlakken, verjongend tot 13,4 m op het bezoekersplatform op 48,5 m, met ingang, klokzone met hoge vensters (30 tot 39 m) en kleine vensters langs de trap; langwerpige achthoekige lantaarn (9,4 bij 12,4 m) met galmgaten voor het carillon tot 60,8 m en een koperen tentdak tot 65,3 m. Maten uit BAG, AHN, Wikipedia en RCE-foto's.",
    realWorld: {
      publishedHeightM: 65.3,
      withVaneM: 70.5,
      reservoirM3: 1850,
      ahnGroundNapM: -2.51,
      ahnTopNapM: 64.41,
      footAcrossFlatsM: 14.0,
      platformAcrossFlatsM: 13.4,
      platformM: 48.5,
      publishedPlatformM: 43.4,
      lanternAcrossFlatsM: [9.4, 12.4],
      eaveM: 60.8,
      modelTopM: 65.3,
      photoScalePxPerM: 21.2,
      minimumPartM: 0.6,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Poldertoren",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/532139",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren,_vanaf_de_Kampwal_-_Emmeloord_-_20413330_-_RCE.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren,_gezien_vanaf_de_noordzijde,_Onder_de_Toren_-_Emmeloord_-_20413332_-_RCE.jpg (richting van de klokvlakken)",
      "https://commons.wikimedia.org/wiki/File:Zicht_op_opengewerkte_lantaarn_met_tentdak_en_carillon_-_Emmeloord_-_20409639_-_RCE.jpg",
      "PDOK BAG-pand 0171100000012589, AHN DSM/DTM 0,5 m en luchtfoto, 2026-10-31",
    ],
  },
});

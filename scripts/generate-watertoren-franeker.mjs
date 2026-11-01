// Watertoren van Franeker (I.W.G.L., 1925), betonnen achthoek met een
// reservoir van 445 m³, nu in verbouwing tot logies. Op elke hoek een lisene
// die aan de voet schuin uitloopt, een band onder het reservoir, een fries
// onder de dakrand en een laag achtzijdig metalen tentdak.
// Oorsprong op het hart van de achthoek in het AHN op maaiveld aan de voet
// (NAP +1,65 m; de toren staat op een lage verhoging). De BAG-contour is
// kleiner dan de toren (vlakken op 5,1 m van het hart, het AHN geeft 5,9 m bij
// een silhouet van 12,6 m op de foto) en dient alleen voor de richting.
// +X wijst naar het vlak op 12,9 graden linksom van RD-oost (vlaknormalen uit
// de steunfunctie van het DSM en uit de BAG-contour); de deur staat in het
// vlak op -90 graden, naar het pad aan de zuidkant.
// Hoogtes uit de frontale foto "Watertoren Franeker 03cw" (camera recht,
// geschaald op de top in het AHN: 12,8 px/m op de zijhoeken, 13,6 px/m op het
// voorste vlak), de dakhelling en top uit het AHN.
import { Manifold, CrossSection, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [166462.95, 577889.5];
const AXIS = [0.97476, 0.22325]; // 12,9 graden
const BASE = -0.3;
const H = {
  foot: 6.0, // tot hier lopen de lisenen schuin uit
  bandChamfer: 27.8, // schuine onderkant van de band
  band: 28.5,
  bandTop: 31.1, // band met ronde ventilatiegaten onder het reservoir
  friezeChamfer: 39.45,
  frieze: 39.6, // fries onder de dakrand
  rim: 43.4, // dakrand en bovenkant van de lisenen
  eave: 43.2, // voet van het tentdak, binnen de dakrand
  apex: 47.2,
};
const A = { shaft: 5.65, band: 6.1, upper: 5.85, frieze: 5.95, roof: 5.8 }; // apothema's van de achthoek
const PILASTER = { front: 6.35, footFront: 7.0, width: 0.9, back: 5.0 }; // lisenen, gemeten langs de bissectrice van de hoek

// ---------- achthoekige schacht, band, bovendeel en fries ----------
const octPts = (a) => circle([0, 0], a / Math.cos(Math.PI / 8), 8, Math.PI / 8); // vlakken op k*45 graden
const oct = (a, z0, z1) => Manifold.extrude(new CrossSection([octPts(a)]), z1 - z0).translate([0, 0, z0]);
// De hoeken van bovendeel en fries blijven binnen de voorkant van de lisenen.
const cornerClip = (z0, z1) => Manifold.extrude(new CrossSection([circle([0, 0], PILASTER.front / Math.cos(Math.PI / 8), 8, 0)]), z1 - z0).translate([0, 0, z0]);
// Een uitspringend deel met schuine onderkant (56 graden of steiler) als één omhulsel.
const ledge = (a0, a1, z0, z1, z2) => hull([...ring3(octPts(a0), z0), ...ring3(octPts(a1), z1), ...ring3(octPts(a1), z2)]);
const body = union([
  oct(A.shaft, BASE, H.bandChamfer + 0.05),
  ledge(A.shaft, A.band, H.bandChamfer, H.band, H.bandTop),
  oct(A.upper, H.bandTop - 0.05, H.friezeChamfer + 0.05).intersect(cornerClip(H.bandTop - 0.1, H.rim)),
  ledge(A.upper, A.frieze, H.friezeChamfer, H.frieze, H.rim).intersect(cornerClip(H.friezeChamfer - 0.1, H.rim)),
]);

// ---------- lisenen op de hoeken, aan de voet schuin uitlopend ----------
const w = PILASTER.width / 2;
const footAtBase = PILASTER.footFront + ((PILASTER.footFront - PILASTER.front) / H.foot) * -BASE;
const pilaster = union([
  hull([
    [PILASTER.back, -w, BASE], [PILASTER.back, w, BASE], [footAtBase, -w, BASE], [footAtBase, w, BASE],
    [PILASTER.back, -w, H.foot], [PILASTER.back, w, H.foot], [PILASTER.front, -w, H.foot], [PILASTER.front, w, H.foot],
  ]),
  hull([
    [PILASTER.back, -w, H.foot - 0.05], [PILASTER.back, w, H.foot - 0.05], [PILASTER.front, -w, H.foot - 0.05], [PILASTER.front, w, H.foot - 0.05],
    [PILASTER.back, -w, H.rim], [PILASTER.back, w, H.rim], [PILASTER.front, -w, H.rim], [PILASTER.front, w, H.rim],
  ]),
]);
const pilasters = union(Array.from({ length: 8 }, (_, k) => place(pilaster, { deg: 22.5 + k * 45 })));

// ---------- laag achtzijdig tentdak met graten op de hoeken ----------
const roof = hull([...ring3(octPts(A.roof), H.eave), [0, 0, H.apex]]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, wd, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -wd / 2, z0], [b, -wd / 2, z0], [a, wd / 2, z0], [b, wd / 2, z0], [a, -wd / 2, za], [f, -wd / 2, z1], [a, wd / 2, za], [f, wd / 2, z1], [b, -wd / 2, z1 - 1.5], [b, wd / 2, z1 - 1.5]]);
};
const cuts = [place(niche(A.shaft, 1.6, 0, 2.6), { deg: -90 })]; // deur naar het pad aan de zuidkant

await writeLandmark({
  slug: "watertoren-franeker",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-met-lisenen-band-fries-en-tentdak", union([body, pilasters, roof]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Franeker",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, 7.5], [0, -7.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0070100000322890"],
    description:
      "Oorsprong op het hart van de achthoek in het AHN op maaiveld aan de voet (NAP +1,65 m), +X naar het vlak op 12,9 graden (oost). Betonnen achthoek van 11,3 m over de vlakken met op elke hoek een lisene van 0,9 m die aan de voet tot 7,0 m uit het hart schuin uitloopt, een band met schuine onderkant van 27,8 tot 31,1 m, een fries vanaf 39,6 m, dakrand op 43,4 m en een achtzijdig tentdak tot 47,2 m; deur naar het zuiden. Maten uit AHN, BAG en een foto.",
    realWorld: {
      publishedHeightM: 48.8,
      postcardHeightM: 49,
      reservoirM3: 445,
      ahnGroundNapM: 1.65,
      ahnTopNapM: 48.88,
      acrossFacesM: 11.3,
      bagAcrossFacesM: 10.2,
      pilasterWidthM: 0.9,
      footReachM: 7.0,
      bandM: [28.5, 31.1],
      friezeM: 39.6,
      rimM: 43.4,
      modelTopM: 47.2,
      photoScalePxPerM: [12.8, 13.6],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Franeker)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Franeker_03cw.JPG (frontale foto 2007, maten)",
      "https://commons.wikimedia.org/wiki/File:Watertorens_van_Franeker_Nutsbedrijven_en_Infrastructuur,_24-09-1925,_archiefnr_2086.jpg (lisenen, band, oorspronkelijke koepel)",
      "PDOK BAG-pand 0070100000322890, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

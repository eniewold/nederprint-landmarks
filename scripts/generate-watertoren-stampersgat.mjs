// Watertoren van Stampersgat (gemeente Halderberge): 1952, ontwerp Jacques (J.M.) Hurks, reservoir van 900 m³,
// sinds 2009 woning en galerie. Een ronde, licht tapse bakstenen schacht zonder geledingen, bovenaan een iets
// bredere ronde kop met een band van zestien smalle rondboogvensters op een gemetselde band, daarop een
// uitkragende koperen dakrand en een flauw koperen kegeldak met een piron met bol. Onderaan een rondboogportaal
// met natuursteenblokken en een tympaan in visgraatverband, en in de onderste tien meter paren vierkante vensters.
//
// Oorsprong op het midden van de ronde BAG-contour (pand 1655100000495658, straal 7,30 m) op maaiveld (AHN-DTM
// 9 tot 14 m uit het hart NAP +2,55 tot +2,78, mediaan +2,71; 3D BAG +2,54). De toren is rond, dus lokale +X is
// RD-oost; de deur staat op oostzuidoost (-20 graden), aan de kant van de bestrate binnenplaats op de luchtfoto
// en frontaal op de foto vanaf het gazon aan de oostkant.
//
// Hoogtes uit het AHN-DSM 0,5 m (NAP): kegeltop +43,99 op het hart, dak +42,19 op 5,5 m uit het hart (helling
// 0,31) en +41,86 op 7,0 m (vlakker naar de rand), dakrand tot 7,5 m uit het hart (99e percentiel 7,36 m op 0,5 m
// raster, luchtfoto 15,0 m doorsnede). 3D BAG (LoD2.2, AHN5 2024): dak +41,5 tot +44,1, nok +43,89, maaiveld
// +2,54; 43,89 - 2,54 = 41,35 m, dus de 41,45 m van Wikipedia is de kegeltop boven het 3D BAG-maaiveld. Boven het
// lokale maaiveld (+2,7) ligt de top op 41,3 m. De wanden ziet het DSM niet: de verjonging van de schacht en de
// kop komen uit de verhoudingen op de foto met de minste perspectief (Willemjans 2006: dakrand : kop : schacht
// onder de kop = 558 : 528 : 500 px) geschaald op de dakrand van 15,0 m.
import { hull, ring3, circle, union, place, dome, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [89579.96, 403226.61];
const AXIS = [1, 0]; // ronde toren: lokale +X is RD-oost
const BASE = -0.3;
const GROUND_NAP = 2.7; // AHN-DTM rond de voet
const GEOID_N = 44.07; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 72;
const DOOR_DEG = -20; // deur op oostzuidoost

const R = {
  base: 7.3, // BAG-contour op maaiveld
  shaftTop: 6.7, // schacht onder de kop (foto: 500/558 van de dakrand)
  head: 7.1, // kop met de vensterband (foto: 528/558)
  band: 7.25, // gemetselde band onder de vensters
  eave: 7.5, // koperen dakrand (AHN, luchtfoto)
  roofKnee: 5.5, // tot hier meet het DSM de steile binnenhelling
  finial: 0.45,
};
const H = {
  shaftTop: 33.0,
  headFoot: 34.1, // schuine onderrand van de schacht naar de kop (foto: 1,1 m, 70 graden)
  band: [36.0, 36.25], // band onder de vensters
  windowTop: 37.85, // boogtop van de rondboogvensters
  eaveFoot: 38.3, // kraag van 45 graden onder de dakrand; de bogenband erboven gaat erin op
  eave: [38.7, 39.2], // rechte dakrand
  roofKnee: 39.55, // AHN: NAP +42,19 op 5,5 m
  apex: 41.3, // AHN: NAP +43,99 op het hart
  finialTop: 42.6,
};
const rShaft = (z) => R.base + ((R.shaftTop - R.base) * (z - 0)) / H.shaftTop;

// ---------- romp: schacht, kop, dakrand en kegel als één omwentelingsprofiel (r, z) ----------
const body = dome([0, 0], [
  [0, BASE], [R.base, BASE], [R.shaftTop, H.shaftTop], [R.head, H.headFoot], [R.head, H.eaveFoot],
  [R.eave, H.eave[0]], [R.eave, H.eave[1]], [R.roofKnee, H.roofKnee], [0, H.apex],
], SEG);
const ring = (r, z, n = SEG) => ring3(circle([0, 0], r, n), z);
// Banden: 0,15 m uit de kop, onderkant onder 45 graden.
const band = ([z0, z1]) => hull([...ring(R.head, z0 - (R.band - R.head)), ...ring(R.band, z0), ...ring(R.band, z1)]);
const bands = [band(H.band)];
// Piron met bol.
const finial = hull([...ring(R.finial, H.apex - 0.5, 16), ...ring(R.finial, 42.0, 16), ...ring(R.finial, 42.3, 16), ...ring(0.25, 42.5, 16), [0, 0, H.finialTop]]);

// ---------- portaal: rondboogomlijsting met natuursteenblokken, 0,25 m voor de gevel ----------
const arch = (w, z0, zs, n = 10) => [
  [-w / 2, z0], [w / 2, z0],
  ...Array.from({ length: n + 1 }, (_, i) => {
    const a = (Math.PI * i) / n;
    return [(w / 2) * Math.cos(a), zs + (w / 2) * Math.sin(a)];
  }),
];
const PORTAL_W = 3.6, PORTAL_SPRING = 3.1; // boogtop op 4,9 m
const portal = place(hull(arch(PORTAL_W, BASE, PORTAL_SPRING).flatMap(([y, z]) => [[rShaft(z) - 0.2, y, z], [R.base + 0.25, y, z]])), { deg: DOOR_DEG });

// ---------- nissen: deur, vierkante vensters en de rondboogvensters in de kop ----------
// Nis in de wand met normaal +X op straal faceR(z): de binnenkant op `depth` erachter, het plafond loopt naar
// binnen onder 56 graden op. Omtrek als lijst (y, z).
const faceNiche = (faceR, outline, depth = 0.3) => {
  const zBot = Math.min(...outline.map(([, z]) => z));
  return hull(outline.flatMap(([y, z]) => [
    [faceR(z) - depth, y, z === zBot ? z : z + 1.5 * depth],
    [faceR(z), y, z],
    [faceR(z) + 1.0, y, z === zBot ? z : Math.max(zBot, z - 1.5)],
  ]));
};
const rectOutline = (w, z0, z1) => [[-w / 2, z0], [w / 2, z0], [w / 2, z1], [-w / 2, z1]];
const cuts = [];
// Deur 1,6 × 2,6 m, 0,4 m diep in de omlijsting.
cuts.push(place(faceNiche(() => R.base + 0.25, rectOutline(1.6, BASE, 2.6), 0.4), { deg: DOOR_DEG }));
// Vierkante vensters van 1,0 × 0,9 m in twee rijen, in kolommen rond de deur en op de zuidkant (foto's van oost en zuidzuidwest).
const WINDOW_ROWS = [7.6, 11.4];
const WINDOW_COLS = [DOOR_DEG + 32, DOOR_DEG - 28, DOOR_DEG - 68, DOOR_DEG - 108];
for (const deg of WINDOW_COLS) for (const z of WINDOW_ROWS) cuts.push(place(faceNiche(rShaft, rectOutline(1.0, z, z + 0.9)), { deg }));
// Zestien rondboogvensters van 0,6 m breed in de kop, van de band (36,25) tot de boogtop op 37,85 m, 0,3 m diep in
// de kopwand; de binnenkant blijft onder de kraag van de dakrand, zodat de nis alleen aan de voorkant open is.
const HEAD_WINDOWS = 16;
for (let k = 0; k < HEAD_WINDOWS; k++) cuts.push(place(faceNiche(() => R.head, arch(0.6, H.band[1], H.windowTop - 0.3, 6)), { deg: (360 * k) / HEAD_WINDOWS }));

const tower = union([body, ...bands, finial, portal]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-stampersgat",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-kop-en-koperen-dak", tower]],
  catalog: {
    name: "Watertoren Stampersgat",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.3,
    groundSamplePoints: [[9, 0], [0, 9], [-9, 0], [0, -9]],
    // Ellipsoïdisch: NAP +2,70 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.1655100000495658"],
    description:
      "Oorsprong op het midden van de ronde BAG-contour op maaiveld (NAP +2,70 m), +X naar RD-oost, deur op oostzuidoost (-20 graden). Ronde bakstenen schacht van 14,6 m op maaiveld (BAG) tot 13,4 m op 33,0 m; schuine onderrand naar een ronde kop van 14,2 m (34,1 tot 38,3 m) met een gemetselde band en zestien rondboogvensters als nissen; uitkragende koperen dakrand van 15,0 m op 38,7 tot 39,2 m; flauw kegeldak (helling 0,31 binnen, vlakker naar de rand) tot 41,3 m met piron en bol tot 42,6 m; rondboogportaal met deur op de oostzuidoostkant en acht vierkante vensters in twee rijen. Maten uit BAG, AHN, 3D BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 41.45,
      reservoirM3: 900,
      built: 1952,
      architect: "J.M. (Jacques) Hurks",
      ahnGroundNapM: GROUND_NAP,
      ahnApexNapM: 43.99,
      ahnRoofAt5p5mNapM: 42.19,
      ahnEaveNapM: 41.86,
      bag3dRoofNapM: [41.5, 44.1],
      bag3dGroundNapM: 2.54,
      geoidNlgeo2018M: GEOID_N,
      doorDeg: DOOR_DEG,
      baseDiameterM: 2 * R.base,
      shaftTopDiameterM: 2 * R.shaftTop,
      headDiameterM: 2 * R.head,
      eaveDiameterM: 2 * R.eave,
      shaftTopM: H.shaftTop,
      eaveM: H.eave,
      headWindows: HEAD_WINDOWS,
      roofPitchDeg: +((Math.atan((H.apex - H.roofKnee) / R.roofKnee) * 180) / Math.PI).toFixed(1),
      apexM: H.apex,
      modelTopM: H.finialTop,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Stampersgat) (Jacques Hurks, 1952, 41,45 m, 900 m³, sinds 2009 woning en galerie)",
      "https://commons.wikimedia.org/wiki/File:Stampersgat_Watertoren_1253.JPG (Willemjans, 2006, CC BY-SA 3.0: verhoudingen dakrand, kop en schacht, portaal, vensters)",
      "https://commons.wikimedia.org/wiki/File:Stampersgat,_watertoren_foto4_2010-09-11_13.40.JPG (Michielverbeek, 2010, CC BY-SA 3.0: zuidzuidwestkant, vensters, kop)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_P1070262.JPG (G.Lanting, 2011, CC BY-SA 3.0: kop met banden en rondboogvensters, dakrand, piron)",
      "PDOK BAG-pand 1655100000495658 (bouwjaar 1952, cirkel van 7,30 m), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "3D BAG (LoD2.2, AHN5 2024) van pand 1655100000495658: maaiveld 2,54, dak 41,5 tot 44,1, nok 43,89 (NAP)",
      "NLGEO2018-geoïdehoogte op de oorsprong (44,07 m) voor groundHeight",
    ],
  },
});

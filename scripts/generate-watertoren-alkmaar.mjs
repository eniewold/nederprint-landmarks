// Watertoren aan de Bergerweg in Alkmaar (hoek Van Teylingenstraat): 1900, ontwerp J.C. Franken en A. Holmberg de
// Beckfelt, reservoir 800 m³, gemeentelijk monument, sinds 2014 kantoren. Een ronde, licht tapse bakstenen schacht
// met gele banden, een dikke band op circa 5 m, rondboogvensters die verspringend omhoog lopen (de trap binnen) en
// een rondboogfries met consoles onder een zestienzijdige bovenbouw. Die bovenbouw kraagt uit op betonnen ribben
// vanaf de fries, heeft bakstenen vlakken tussen betonnen hoekpilasters die als paaltjes boven de deklijst uitsteken
// en draagt sinds de verbouwing een dakopbouw: een platte opbouw, een hoger blok met een glazen zadeldak en aan de
// noordkant een dakterras achter de borstwering. De kantelen van 1900 zijn in 1955 verwijderd.
//
// Oorsprong op het midden van de ronde BAG-contour (pand 0361100000105882, straal 6,62 m: de bovenbouw met
// pilasters) op maaiveld (AHN-DTM rond de toren NAP +0,4 tot +0,9, PDOK-maaiveld NAP +0,40). Lokale +X loopt langs
// RD -20 graden: de lange as van het dakblok (randen van de PDOK-reconstructie op -19 tot -22 graden, de luchtfoto
// -21). Hoeken in dit script zijn lokaal, linksom vanaf +X; een kompasrichting k ligt lokaal op 110 - k graden.
//
// Hoogtes: de PDOK-reconstructie (uit het AHN) geeft de borstwering en het dakterras op 30,3 tot 31,4 m boven
// maaiveld, de platte opbouw op 33,5 en het blok op 34,4 m; het AHN-DSM ziet 33,3 en 34,2 m en tot 37,6 m op de nok
// (glas en antennes geven weinig punten). Wikipedia: 31,4 m. De hoogtes van schacht, fries, ribben en vensters en de
// doorsnedes komen uit de foto IMG 3329 (2024, evenwijdige verticalen), geschaald op de deklijst (31,0 m) en de
// BAG-cirkel; de vlakrichting van de bovenbouw uit dezelfde foto (een vlak recht naar de camera op kompas 264).
import { hull, ring3, circle, union, box, prism, place, writeLandmark, Manifold } from "./efteling-kit.mjs";

const ORIGIN = [110951.45, 516758.88];
const ROT = -20; // lokale +X in graden linksom van RD-oost (lange as van het dakblok)
const AXIS = [+Math.cos((ROT * Math.PI) / 180).toFixed(4), +Math.sin((ROT * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 0.6; // AHN-DTM 8 m uit het hart: 0,44 tot 0,87, gemiddeld 0,63
const GEOID_N = 42.6; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 96;
const D = Math.PI / 180;
const compass = (k) => 110 - k; // kompasrichting → lokale hoek in graden

// ---------- maten ----------
const H = {
  band: [5.0, 6.0], // dikke band boven de begane grond
  shaftTop: 16.4, // schacht tot de fries
  corbelFoot: 15.5, // onderkant van de consoles
  frieze: 17.4, // bovenkant van de rondboogfries, begin van de ribben
  rim: 19.4, // onderkant van de bovenbouw (foto: silhouet van de ribvoet)
  ribFoot: 19.1, // onderkant van rib en pilaster op de hoek
  deck: 30.5, // dakterras en dakvloer (PDOK 30,4 tot 30,7)
  coping: 31.0, // deklijst van de borstwering (PDOK 30,3 tot 31,4)
  post: 31.5, // paaltjes van de pilasters boven de deklijst
  annex: 33.4, // platte dakopbouw (PDOK 33,5, AHN 33,3)
  block: 34.3, // hoger blok (PDOK 34,4, AHN 34,2)
  ridge: 36.8, // nok van het glazen zadeldak (AHN tot 37,6 met antennes)
};
const shaftR = (z) => 5.08 - (0.66 * z) / H.shaftTop; // 10,16 m aan de voet, 8,84 m onder de fries
const R = {
  band: 0.2, // uitsprong van de dikke band
  frieze: 4.75, // rondboogfries (foto: 9,2 tot 9,5 m)
  wall: 6.35, // apothema van de zestienhoek (bakstenen vlakken)
  parapetIn: 5.95, // binnenkant van de borstwering
  roof: 5.4, // apothema van de dakopbouw (AHN: 33,3 tot 5,0 à 5,3 m uit het hart)
};
const N = 16;
const FACE0 = 3.5; // lokale richting van een vlaknormaal (kompas 264 + 22,5k)
const CORNER0 = FACE0 + 180 / N;
const C16 = Math.cos(Math.PI / N);
const poly16 = (apothem) => circle([0, 0], apothem / C16, N, CORNER0 * D);
const ring = (r, z, n = SEG) => ring3(circle([0, 0], r, n), z);

// ---------- schacht met dikke band ----------
const shaft = hull([...ring(shaftR(BASE), BASE), ...ring(shaftR(H.shaftTop + 0.05), H.shaftTop + 0.05)]);
// Dikke band met een kraag van 45 graden en een rechte bovenkant.
const bandR = (z) => shaftR(z) + R.band;
const band = hull([...ring(shaftR(H.band[0] - R.band), H.band[0] - R.band), ...ring(bandR(H.band[0]), H.band[0]), ...ring(bandR(H.band[1]), H.band[1])]);

// ---------- rondboogfries met consoles ----------
// Band van 16,4 tot 17,4 m op een kraag van 45 graden; 28 consoles van 0,55 m die tot 15,5 m naar beneden steken met
// een schuine onderkant (53 graden). De boogjes ertussen (circa 0,6 m) zijn te klein.
const friezeFoot = H.shaftTop - (R.frieze - shaftR(H.shaftTop));
const frieze = hull([...ring(shaftR(friezeFoot), friezeFoot), ...ring(R.frieze, H.shaftTop), ...ring(R.frieze, H.frieze + 0.05)]);
const corbel = (deg) => {
  const w = 0.275, rIn = shaftR(H.corbelFoot) - 0.1, rOut = R.frieze - 0.03;
  return place(hull([
    [rIn, -w, H.corbelFoot], [rIn, w, H.corbelFoot], [rIn, -w, H.shaftTop + 0.05], [rIn, w, H.shaftTop + 0.05],
    [rOut, -w, H.corbelFoot + 0.4], [rOut, w, H.corbelFoot + 0.4], [rOut, -w, H.shaftTop + 0.05], [rOut, w, H.shaftTop + 0.05],
  ]), { deg });
};
const corbels = Array.from({ length: 28 }, (_, k) => corbel((360 / 28) * k + 6.4));

// ---------- uitkragende bovenbouw ----------
// Onderkant: kegelvormig plafond van de fries (r 4,75 op 17,4 m) naar de zestienhoek op 19,4 m (51 graden), met op
// elke hoek een betonnen rib van 0,6 m die 0,35 m onder het plafond uitsteekt (onderkant 46 graden).
const soffit = hull([...ring(R.frieze, H.frieze), ...ring3(poly16(R.wall), H.rim)]);
const body = prism(poly16(R.wall), H.rim - 0.01, H.deck);
const parapet = prism(poly16(R.wall), H.deck - 0.05, H.coping).subtract(prism(poly16(R.parapetIn), H.deck - 0.1, H.coping + 0.1));
const cornerR = R.wall / C16;
const PIL = 0.3; // halve breedte van pilaster en rib
const PIL_OUT = 0.25; // uitsprong van de pilaster buiten de hoek
const rib = (deg) => place(hull([
  [4.6, -PIL, 17.05], [4.6, PIL, 17.05], [4.6, -PIL, 17.6], [4.6, PIL, 17.6],
  [cornerR + PIL_OUT, -PIL, H.ribFoot], [cornerR + PIL_OUT, PIL, H.ribFoot], [cornerR + PIL_OUT, -PIL, H.rim + 0.2], [cornerR + PIL_OUT, PIL, H.rim + 0.2],
]), { deg });
const pilaster = (deg) => place(box(cornerR - 0.3, -PIL, H.ribFoot, cornerR + PIL_OUT, PIL, H.post), { deg });
const corners = Array.from({ length: N }, (_, k) => CORNER0 + (360 / N) * k);
const ribs = corners.map(rib);
const pilasters = corners.map(pilaster);

// ---------- dakopbouw ----------
// In het stelsel van het blok (u = +X, v = +Y): het dakterras ligt ten noorden van v = 2,6 op de dakvloer achter de
// borstwering; de platte opbouw vult de rest binnen een zestienhoek van 5,4 m; het blok loopt van u = -2,1 tot die
// zestienhoek en van v = -2,2 tot 2,6 en draagt een glazen zadeldak met de nok langs u op v = 0,2.
const roofPoly = poly16(R.roof);
const V_TERRACE = 2.6, U_BLOCK = -2.1, V_BLOCK = -2.2;
const roofClip = (z0, z1) => prism(roofPoly, z0, z1);
const annex = roofClip(H.deck - 0.05, H.annex).intersect(box(-8, -8, H.deck - 0.1, 8, V_TERRACE, H.annex + 0.1));
const blockBox = box(U_BLOCK, V_BLOCK, H.deck - 0.05, 8, V_TERRACE, H.block);
const block = roofClip(H.deck - 0.05, H.block).intersect(blockBox);
const vRidge = (V_BLOCK + V_TERRACE) / 2;
const gable = roofClip(H.block - 0.05, H.ridge + 0.1).intersect(hull([
  [U_BLOCK, V_BLOCK, H.block - 0.05], [8, V_BLOCK, H.block - 0.05], [U_BLOCK, V_TERRACE, H.block - 0.05], [8, V_TERRACE, H.block - 0.05],
  [U_BLOCK, vRidge, H.ridge], [8, vRidge, H.ridge],
]));

// ---------- nissen: vensters en deur ----------
// Nis in een vlak met normaal +X op afstand faceA(z): de binnenkant ligt `depth` erachter, het plafond loopt naar
// binnen onder 56 graden op (1,5 maal de diepte), zoals bij de watertoren van Roosendaal.
const faceNiche = (faceA, outline, depth = 0.3) => {
  const zBot = Math.min(...outline.map(([, z]) => z));
  return hull(outline.flatMap(([y, z]) => [
    [faceA(z) - depth, y, z === zBot ? z : z + 1.5 * depth],
    [faceA(z), y, z],
    [faceA(z) + 1.0, y, z === zBot ? z : Math.max(zBot, z - 1.5)],
  ]));
};
const rectOutline = (w, z0, z1) => [[-w / 2, z0], [w / 2, z0], [w / 2, z1], [-w / 2, z1]];
// Rondboog: breedte w, onderkant z0, top z1 (halve cirkel).
const archOutline = (w, z0, z1, n = 8) => {
  const zs = z1 - w / 2;
  return [[-w / 2, z0], [w / 2, z0], ...Array.from({ length: n + 1 }, (_, i) => {
    const a = (Math.PI * i) / n;
    return [(w / 2) * Math.cos(a), zs + (w / 2) * Math.sin(a)];
  })];
};
// Op de ronde schacht: het vlak ligt 0,05 m binnen de schacht (koorde van 1,2 m wijkt 0,04 m af).
const shaftFace = (z) => shaftR(z) - 0.05;
const cuts = [];
// Deur in de rondboog richting de Bergerweg (kompas 225) en twee rondboogvensters op de begane grond.
cuts.push(place(faceNiche(shaftFace, archOutline(1.6, BASE, 3.9), 0.35), { deg: compass(225) }));
for (const k of [126, 320]) cuts.push(place(faceNiche(shaftFace, archOutline(1.2, 1.1, 3.8)), { deg: compass(k) }));
// Later ingebroken rechthoekig venster rechts van de deur.
cuts.push(place(faceNiche(shaftFace, rectOutline(1.1, 2.3, 3.6)), { deg: compass(186) }));
// Rondboogvensters van de trap, twee rijen; kompasrichtingen van drie foto's, de noordoostkant aangenomen.
const TIER_A = [225, 161, 288, 50], TIER_B = [194, 258, 130, 317, 15];
for (const k of TIER_A) cuts.push(place(faceNiche(shaftFace, archOutline(1.2, 7.0, 9.2)), { deg: compass(k) }));
for (const k of TIER_B) cuts.push(place(faceNiche(shaftFace, archOutline(1.2, 12.0, 14.2)), { deg: compass(k) }));
// Vensters van de kantoren in elk vlak van de bovenbouw, twee rijen.
const wallFace = () => R.wall;
for (let k = 0; k < N; k++) {
  const deg = FACE0 + (360 / N) * k;
  cuts.push(place(faceNiche(wallFace, rectOutline(1.3, 22.2, 24.2)), { deg }));
  cuts.push(place(faceNiche(wallFace, rectOutline(1.3, 26.4, 28.8)), { deg }));
}

const tower = union([shaft, band, frieze, ...corbels, soffit, body, parapet, ...ribs, ...pilasters, annex, block, gable]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-alkmaar",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-bovenbouw-en-dakopbouw", tower]],
  catalog: {
    name: "Watertoren Alkmaar",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [0, 8], [-8, 0], [0, -8], [5.7, 5.7], [-5.7, 5.7], [-5.7, -5.7], [5.7, -5.7]],
    // Ellipsoïdisch: NAP +0,60 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0361100000105882"],
    description:
      "Oorsprong op het midden van de ronde BAG-contour op maaiveld (NAP +0,6 m), +X langs RD -20 graden (lange as van het dakblok), deur richting de Bergerweg (zuidwest). Ronde tapse bakstenen schacht van 10,2 tot 8,8 m met een dikke band op 5 m, deur, rondboogvensters in twee rijen en een rondboogfries met consoles tot 17,4 m; zestienzijdige bovenbouw van 12,7 m over de vlakken op een kegelvormig plafond met betonnen ribben, hoekpilasters met paaltjes, twee rijen kantoorvensters en een deklijst op 31,0 m; dakopbouw tot 33,4 m, blok tot 34,3 m met een glazen zadeldak tot 36,8 m en een dakterras aan de noordkant. Maten uit BAG, PDOK-reconstructie, AHN en foto's.",
    realWorld: {
      wikipediaHeightM: 31.4,
      reservoirM3: 800,
      built: 1900,
      architects: "J.C. Franken en A. Holmberg de Beckfelt",
      battlementsRemoved: 1955,
      ahnGroundNapM: GROUND_NAP,
      pdokParapetAboveGroundM: [30.3, 31.4],
      pdokRoofAboveGroundM: [33.5, 34.4],
      ahnRoofNapM: [33.9, 34.8],
      ahnRidgeNapM: 38.2,
      geoidNlgeo2018M: GEOID_N,
      axisDeg: ROT,
      shaftDiameterM: [+(2 * shaftR(0)).toFixed(2), +(2 * shaftR(H.shaftTop)).toFixed(2)],
      upperAcrossFlatsM: 2 * R.wall,
      upperSides: N,
      friezeTopM: H.frieze,
      rimM: H.rim,
      copingM: H.coping,
      roofAnnexM: H.annex,
      roofBlockM: H.block,
      modelTopM: H.ridge,
      minimumPartM: 0.55,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Alkmaar) (1900, J.C. Franken en A. Holmberg de Beckfelt, 31,4 m, 800 m³, kantelen in 1955 verwijderd, sinds 2014 kantoren)",
      "https://commons.wikimedia.org/wiki/File:Alkmaar,_watertoren_GM036-WN012_IMG_3329_2024-06-23_18.01.jpg (evenwijdige verticalen: verhoudingen, hoogtes, zestienhoek, ribben, pilasters, kantoorvensters, glazen zadeldak)",
      "https://commons.wikimedia.org/wiki/File:Bergerweg_62,_Alkmaar.JPG, File:Alkmaar_-_Watertoren.jpg, File:Water_tower_in_Alkmaar_(Watertoren_)_-_The_Netherlands.jpg, File:Alkmaar_Watertoren_0606.JPG (deur, vensters, fries, plafond met ribben)",
      "https://commons.wikimedia.org/wiki/File:Bergerweg_62,_hoek_Van_Teylingenstraat,_watertoren._Gebouwd_in_1900._-_RAA011000262_-_RAA_Elsinga.jpg (toestand voor de verbouwing: vensters, deur, paaltjes)",
      "PDOK BAG-pand 0361100000105882 (ronde contour r 6,62 m), BGT, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-03",
      "PDOK-gebouwtegel van pand 0361100000105882 (rf_roof_type slanted): borstwering en terras 30,3 tot 31,4 m, dakopbouw 33,5 en 34,4 m boven maaiveld, randen op -19 tot -22 graden",
      "NLGEO2018-geoïdehoogte op de oorsprong (42,60 m) voor groundHeight",
    ],
  },
});

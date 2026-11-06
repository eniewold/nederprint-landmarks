// Watertoren van Sint Jansklooster aan de Barsbeek (nr. 6), in 1931-1932 gebouwd door de Waterleiding Maatschappij
// Overijssel (W.M.O.); rijksmonument 507463, volgens het register 45,5 m hoog (Wikipedia 45,7 m) met een betonnen
// holbodemreservoir van 400 m³, verwant aan de torens van Steenwijkerwold en Raalte. Sinds 2011 van BOEi en
// herbestemd tot uitkijktoren (vier ramen in het dak). Een vierkante toren van gewapend beton (glijbekisting) met een
// baksteenbekleding die licht verjongt vanuit de basis, met "uit- en inspringende hoeken": elke hoek is een verdiepte
// sleuf met een smalle penant erin, en bovenin vult een overhoeks blok de sleuf. Daarboven een recessie met een
// glazen-bouwsteenvenster en een "octogonaal, gebroken tentdak": een staande band van geglazuurde pannen (boven de
// hoeken lager dan boven de gevels: de verspringende randen) onder een achtkante tentkap. Voorgevel (oost-noordoost)
// met een keperboogportiek met dubbele deur; smalle vensters (glazen bouwstenen) in de gevels, bovenin per gevel drie.
//
// Oorsprong op het hart van BAG-pand 1708100000028702 (achthoek van 8 punten: een vierkant van 11,1 m met afgeschuinde hoeken; de apex in het AHN-DSM ligt 0,2 m ernaast) op het maaiveld, AHN-DTM
// NAP +4,9 (4,85 tot 5,0 tot 12 m eromheen). +X wijst naar RD-richting 26,5 graden (de gevelnormaal uit de BAG-zijden,
// oost-noordoost): de voorgevel met de ingang (rijksmonumentenregister: voorgevel met entree, de "linker gevelpartij"
// van nieuwe, lichte baksteen is dan de gevel naar -Y; zo staat het ook op de foto's met hun zonstand). +Y wijst naar
// 116,5 graden (noord-noordwest).
// Maten: plattegrond uit de BAG (gevels op 5,51 tot 5,57 m van het hart, afschuiningen van 3,4 m); de sleuven uit
// "Watertoren Sint Jansklooste.jpg" (Commons; de zichtbare gevelbreedtes 203 en 134 px en de hoekzone 124 px passen
// precies bij een vierkant van 11,1 m met sleuven van 2,35 m, 38 px/m); dak uit het AHN-DSM 0,5 m (apex NAP +50,45,
// helling 0,7 (35 graden) over 5 m in alle richtingen, knik naar de staande band op circa NAP +46,6); de hoogtes van
// band, recessie en hoekblok uit dezelfde foto (verankerd op de apex), gecontroleerd met
// "Sint Jansklooster, de watertoren RM507463 foto4 2013-04-28 10.44.jpg" (deur en vensters) en
// "Watertoren, Barsbeek 6, Sint Jansklooster.JPG".
import { Manifold, hull, union, box, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [197294.38, 521134.22];
const AXIS_DEG = 26.5;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 4.9;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 47,08, west 47,41, noord en zuid 47,26;
// het PDOK-pand begint op 47,09), gemeten 2026-11-06 met de terreintegels van de export.
const GROUND_ELLIPSOID = 47.08;
const SQ2 = Math.SQRT2;
const SLOPE = Math.tan((50 * Math.PI) / 180); // 1,19: onderkanten van overstekken onder 50 graden

// ---------- maten (meter boven het maaiveld NAP +4,9; stralen vanaf het hart) ----------
const A = { foot: 5.68, top: 5.55, band: 5.58 }; // halve breedte van het vierkant: verjongt van 5,68 tot 5,55 op 40 m
const C = 3.25; // binnenhoek van de sleuf: sleuf van 2,35 m (bovenin) tot 2,43 m (voet) in beide richtingen
const PIER = 0.9; // penant in de binnenhoek van de sleuf
const S_CHAMFER = (A.band + C) / SQ2; // 6,24: afschuining van de band en de tentkap boven de sleuven
const H = {
  wallTop: 40.0, // onderkant van de staande band boven de gevels (goot)
  cornerBand: 39.5, // onderkant van de staande band boven de hoeken (verspringende rand)
  blockTop: 37.6, // bovenkant van het overhoekse blok; daarboven de recessie
  blockBottom: 31.1, // voorkant van de onderzijde van het blok
  eaves: 41.75, // knik van de staande band naar de tentkap (AHN NAP +46,6)
  apex: 45.55, // top van de tentkap (AHN NAP +50,45)
};
const BLOCK = { front: 6.0, half: 1.3 }; // voorvlak van het hoekblok (diagonaal) en halve breedte (2,6 m, foto)

// Achthoek: vierkant met halve breedte a, hoeken afgeschuind op diagonale afstand s.
const octagon = (a, s) => {
  const b = s * SQ2 - a;
  return [[a, -b], [a, b], [b, a], [-b, a], [-a, b], [-a, -b], [-b, -a], [b, -a]];
};
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Halfruimte n·p >= off als groot blok (voor intersect).
const keep = (m, n, off) => m.trimByPlane(n, off);
const unit = (v) => { const l = Math.hypot(...v); return v.map((c) => c / l); };
// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1, met een plafond dat naar binnen onder
// 56 graden oploopt (zie generate-watertoren-deventer.mjs).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Keperboog (spitse top van rechte lijnen) als nis in het vlak met normaal +X op afstand f.
const keperNiche = (f, w, z0, spring, apex, depth) => hull(
  [f - depth, f + 1].flatMap((x) => [[x, -w / 2, z0], [x, w / 2, z0], [x, -w / 2, spring], [x, w / 2, spring], [x, 0, apex]]),
);
const QUARTERS = [0, 90, 180, 270];

// ---------- schacht ----------
const shaft = hull([...at(octagon(A.foot, A.foot * SQ2), BASE), ...at(octagon(A.top, A.top * SQ2), H.wallTop)]);
const aAt = (z) => A.foot + ((A.top - A.foot) * z) / H.wallTop;

// Sleuf in de hoek (+X, +Y), daarna rondgedraaid: alles boven de buitenhoek C in beide richtingen, tot het plafond dat
// vanaf de voorkant van de band (s = 6,24 op 39,5 m) onder 50 graden naar binnen zakt, en boven de afschuining ook de
// rest van de hoek tot de goot. De penant in de binnenhoek blijft staan.
const notchCell = box(C, C, BASE - 1, 8, 8, H.wallTop + 0.01);
const ceilingN = unit([-SLOPE / SQ2, -SLOPE / SQ2, 1]);
const ceilingOff = (H.cornerBand - SLOPE * S_CHAMFER) * ceilingN[2];
const notchCut = union([
  keep(notchCell, ceilingN.map((c) => -c), -ceilingOff),
  keep(keep(notchCell, [1 / SQ2, 1 / SQ2, 0], S_CHAMFER), [0, 0, 1], H.cornerBand - 0.1),
]).subtract(box(C - 1, C - 1, BASE - 2, C + PIER, C + PIER, 50));

// Overhoeks blok in de sleuf: voorvlak op de diagonaal (s = 6,0), 2,6 m breed, onderkant onder 50 graden naar binnen
// aflopend (aan de voorkant 31,1 m), bovenkant 37,6 m.
const underN = unit([-SLOPE / SQ2, -SLOPE / SQ2, 1]);
const block = [
  [[-1 / SQ2, -1 / SQ2, 0], -BLOCK.front],
  [[-1 / SQ2, 1 / SQ2, 0], -BLOCK.half],
  [[1 / SQ2, -1 / SQ2, 0], -BLOCK.half],
  [underN, (H.blockBottom - SLOPE * BLOCK.front) * underN[2]],
].reduce((m, [n, off]) => keep(m, n, off), box(C - 0.2, C - 0.2, 20, 7, 7, H.blockTop));

// ---------- staande band, goten en tentkap ----------
const OCT = octagon(A.band, S_CHAMFER);
const band = prism(OCT, H.cornerBand, H.eaves + 0.01);
// Goot: 0,18 m uit, onderkant onder 50 graden, boven de gevels op 40,0 m en boven de hoeken op 39,5 m.
const gutter = (z) => hull([...at(OCT, z), ...at(octagon(A.band + 0.18, S_CHAMFER + 0.18), z + 0.18 * SLOPE), ...at(octagon(A.band + 0.18, S_CHAMFER + 0.18), z + 0.4)]);
const faces = union([box(-C, -8, H.cornerBand - 1, C, 8, H.eaves), box(-8, -C, H.cornerBand - 1, 8, C, H.eaves)]);
const corners = union(QUARTERS.map((deg) => place(box(C, C, H.cornerBand - 1, 8, 8, H.eaves), { deg })));
const gutters = union([gutter(H.wallTop).intersect(faces), gutter(H.cornerBand).intersect(corners)]);
const roof = hull([...at(OCT, H.eaves), [0, 0, H.apex]]);

// ---------- openingen ----------
// Vier uitkijkramen in de band boven de hoeken (1,9 m breed, 39,9 tot 41,15 m).
const lookouts = union(QUARTERS.map((deg) => place(niche(S_CHAMFER, 1.9, 39.9, 41.15, 0.3), { deg: deg + 45 })));
// Smalle vensters (glazen bouwstenen, als nis van 0,35 m): bovenin drie per gevel (aan de voorgevel twee), daaronder
// één per geleding van 5,7 m in het midden van de gevel.
const slit = (z0, z1, y = 0) => niche(aAt(z1), 0.35, z0, z1, 0.25, y);
const singles = [[30.9, 32.5], [25.2, 26.8], [19.5, 21.1], [13.8, 15.4]];
const faceSlits = (front) => union([
  ...(front ? [-1.5, 1.5] : [-0.8, 0, 0.8]).map((y) => slit(36.4, 38.1, y)),
  ...singles.map(([z0, z1]) => slit(z0, z1)),
]);
const slits = union(QUARTERS.map((deg) => place(faceSlits(deg === 0), { deg })));
// Keperboogportiek (2,4 m breed, 0,6 m diep, top 3,95 m) met de dubbele deur (1,8 m, 0,3 m dieper, top 3,3 m).
const portal = union([
  keperNiche(aAt(3.95), 2.4, BASE + 0.2, 2.5, 3.95, 0.6),
  keperNiche(aAt(3.3) - 0.6, 1.8, BASE + 0.2, 2.15, 3.3, 0.3),
]);

const body = shaft
  .subtract(union(QUARTERS.map((deg) => place(notchCut, { deg }))))
  .subtract(union([slits, portal]));
const top = union([band, gutters, roof]).subtract(lookouts);
const tower = union([body, ...QUARTERS.map((deg) => place(block, { deg })), top]);

await writeLandmark({
  slug: "watertoren-sint-jansklooster",
  base: BASE,
  nodes: [["building:watertoren-schacht-hoekblokken-band-en-tentdak", tower]],
  catalog: {
    name: "Watertoren Sint Jansklooster",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8], [0, -8]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1708100000028702"],
    description:
      "Oorsprong op het hart van het BAG-pand op het maaiveld (NAP +4,9 m), +X naar RD-richting 26,5 graden (oost-noordoost): de voorgevel met de keperboogportiek. Vierkante schacht van 11,4 tot 11,1 m die verjongt tot 40 m, met in elke hoek een sleuf van 2,35 m met een penant en bovenin een overhoeks blok (31,1 tot 37,6 m) onder een recessie; smalle vensters; staande band van 39,5 (hoeken) of 40,0 m (gevels) tot 41,75 m met goten en vier uitkijkramen; achtkante tentkap tot 45,55 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: "1931-1932",
      builder: "Waterleiding Maatschappij Overijssel (W.M.O.)",
      publishedHeightM: 45.5,
      wikipediaHeightM: 45.7,
      reservoirM3: 400,
      monument: 507463,
      ahnGroundNapM: GROUND_NAP,
      ahnEavesNapM: 46.6,
      ahnApexNapM: 50.45,
      shaftWidthM: [A.foot * 2, A.top * 2],
      cornerSlotM: [A.foot - C, A.top - C],
      pierM: PIER,
      cornerBlockM: [H.blockBottom, H.blockTop],
      bandM: [H.cornerBand, H.wallTop, H.eaves],
      topM: H.apex,
      photoScalePxPerM: 38,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/507463 (1931, W.M.O., 45,5 m, 400 m³ holbodemreservoir, glijbekisting, verjongend, uit- en inspringende hoeken met bovenin overhoekse invullingen, smalle vensters, octogonaal gebroken tentdak met geglazuurde pannen en verspringende randen, keperboogportiek, linker gevelpartij vernieuwd)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Sint_Jansklooster) (1931-1932, 45,7 m, 400 m³, uitkijktoren met vier ramen)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Sint_Jansklooste.jpg (vanuit het zuid-zuidwesten: sleuf, penant, hoekblok, band en tentkap; schaal 38 px/m)",
      "https://commons.wikimedia.org/wiki/File:Sint_Jansklooster,_de_watertoren_RM507463_foto4_2013-04-28_10.44.jpg (vanuit het oosten: hoekblok, uitkijkraam, vensters, portiek)",
      "https://commons.wikimedia.org/wiki/File:Watertoren,_Barsbeek_6,_Sint_Jansklooster.JPG en File:20131030_Belterwijde_met_watertoren_Sint_Jansklooster.jpg (silhouet, uitkijkramen)",
      "PDOK BAG-pand 1708100000028702, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

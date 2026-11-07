// Watertoren van Roelofarendsveen (gemeente Kaag en Braassem), gemeentelijk monument. Gebouwd in 1932 naar ontwerp van
// Hendrik Sangster, 31,5 m hoog met een reservoir van 150 m³. Een betonnen toren op een vierkant met afgeschuinde hoeken
// (vier brede en vier smalle zijden), met een kroonlijst en een lage achtkante piramide als dak. Na de buitengebruikstelling
// verbouwd tot woon- en bedrijfsruimte: vensters op alle lagen, een balkon aan de zuidzijde, en aan de voet een paviljoen
// van donkere baksteen met een bloemenwinkel (etalages onder een luifel) en een dakterras. Sinds 1986 staat op elk van de
// vier brede zijden een meters hoge tulp.
//
// De toren en het paviljoen zijn samen BAG-pand 1884100000002910 (bouwjaar 1931): het model vervangt het hele pand. Het
// paviljoen volgt de BAG-contour; het is aan de west- en zuidzijde rond en loopt aan de noordoostkant schuin langs de
// parkeerplaats tot aan de sloot.
//
// Oorsprong op het hart van de toren op maaiveld (AHN-DTM NAP -0,65; ring van 8 tot 14 m: mediaan -0,59 tot -0,73; 3D BAG
// -0,72). De toren is 9 graden rechtsom gedraaid ten opzichte van RD (achthoekfit op het AHN-DSM boven 20 m: -9 graden,
// hart [103390.3, 468607.5]; de BAG-contour volgt de zuidoostelijke afschuining en de zuidgevel, en geeft het hart
// [103390.06, 468607.24]; top van het dak in het DSM op [103389.9..103390.1, 468607.2]). +X is de zuidgevel met het balkon
// en de winkelpui (RD -99 graden), +Y wijst naar het oosten (RD -9 graden).
// Maten: BAG (paviljoencontour en de afschuining), AHN-DSM 0,5 m (dak top NAP +30,46, kroonlijst circa +27,6 à +27,9,
// paviljoendak +2,5 met een rand tot +3,0 à +3,3, balkon +15 à +17,5 tot 1,2 m voor de gevel, breedte 7,5 tot 7,7 m over
// de brede zijden en 8,5 tot 8,7 m over de afschuiningen), luchtfoto 4 cm (achtkant dak, dakterras met borstwering) en de
// Commons-foto's "Roelofarendsveen watertoren.jpg" (2010, vanuit het zuiden), "Watertoren Roelofarendsveen.jpg" (2007,
// vanuit het zuidwesten), "Roelofarendsveen, watertoren in straatzicht foto2 2009-10-25" en "Roelofsarendsveen, de
// watertoren in straatzicht IMG 0045 2021-08-03" (hoogtes van vensters, balkon, luifel en tulpen).
import { CrossSection, Manifold, prism, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [103390.1, 468607.3];
const DEG = -99;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = -0.65;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints rond het paviljoen (voor 42,712, oost 42,727,
// noordoost 42,620, west 42,514), gemeten 2026-11-07; het PDOK-pand begint op 42,56.
const GROUND_ELLIPSOID = 42.51;

// ---------- hoogtes boven maaiveld (NAP -0,65) ----------
const H = {
  pavilion: 3.7, // borstwering van het paviljoen (AHN NAP +3,0 à +3,3 op de rand)
  terrace: 3.1, // dakterras van het paviljoen (AHN NAP +2,45)
  glazing: 2.45, // bovenkant van de etalages
  canopy: [2.5, 3.0, 3.2], // luifel: aan de gevel, onderkant aan de voorrand, bovenkant
  cornice: [27.4, 27.6, 28.2], // kroonlijst: onderkant aan de gevel, aan de voorrand, bovenkant (AHN circa +27,6 à +27,9)
  apex: 31.1, // top van het piramidedak (AHN NAP +30,46)
  balcony: [15.4, 16.9, 17.9], // balkon: onderkant aan de gevel, vloer aan de voorrand, bovenkant borstwering
};
// Toren: vierkant van 7,6 m met afgeschuinde hoeken; de afschuiningen liggen op 4,4 m van het hart (vlak van 1,95 m).
const HALF = 3.8;
const CHAMFER = 4.4;
const CORNICE_OUT = 0.2;
const BALCONY = { depth: 1.2, width: 4.6 };

// Achthoek: vierkant met halve zijde h, hoeken afgeschuind op afstand d van het hart.
const oct = (h, d) => {
  const c = d * Math.SQRT2 - h;
  return [[h, -c], [h, c], [c, h], [-c, h], [-h, c], [-h, -c], [-c, -h], [c, -h]];
};
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);

// Nis in een gevel met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder 56
// graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};

// ---------- paviljoen (BAG-contour in het lokale stelsel) ----------
// BAG-pand 1884100000002910, 18 hoekpunten, omgerekend naar het lokale stelsel (+X zuid, +Y oost).
const PAVILION = [
  [2.5, 3.63], [-1.32, 7.1], [-9.23, -1.6], [-5.75, -7.35], [-5.5, -7.16], [-5.58, -7.02], [3.52, -7.1], [5.18, -5.72],
  [6.38, -3.92], [7.01, -1.85], [7.1, -0.43], [7.01, 0.99], [6.76, 2.39], [6.42, 2.29], [6.5, 2.05], [3.86, 2.08],
  [3.86, 2.4], [2.77, 3.62],
];
const pavilionCs = new CrossSection([PAVILION]);
const pavilion = Manifold.extrude(pavilionCs, H.pavilion - BASE).translate([0, 0, BASE]);
// Dakterras: 0,6 m verdiept binnen een borstwering van 0,9 m; het oostelijke deel naast de toren (trappenhuis met een
// hellend glazen dak, AHN +3,4 à +4,0) blijft op de volle hoogte.
const terraceCs = pavilionCs.offset(-0.9, "Miter").intersect(new CrossSection([[[-12, -10], [12, -10], [12, 3.0], [-12, 3.0]]]));
const terrace = Manifold.extrude(terraceCs, 2).translate([0, 0, H.terrace]);

// Etalages en luifel langs een rij hoekpunten van de contour (bolle kant): per zijde een nis van 0,3 m met een plafond
// onder 49 graden, en een luifel die 0,4 m uitsteekt met een onderkant onder 45 graden. De voorrand van de luifel ligt
// op de bissectrice van elk hoekpunt, zodat de stukken naadloos aansluiten.
const outward = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dy / l, -dx / l]; };
const shopfront = (pts) => {
  const n = pts.slice(1).map((p, i) => outward(pts[i], p)); // contour loopt linksom: buitennormaal rechts van de zijde
  const miter = pts.map((_, i) => {
    const a = n[Math.max(0, i - 1)], b = n[Math.min(n.length - 1, i)];
    const m = [a[0] + b[0], a[1] + b[1]], l = Math.hypot(...m), c = (m[0] * a[0] + m[1] * a[1]) / l;
    return [m[0] / l / c, m[1] / l / c];
  });
  const off = (i, d) => [pts[i][0] + miter[i][0] * d, pts[i][1] + miter[i][1] * d];
  const glass = [], canopy = [];
  for (let i = 0; i + 1 < pts.length; i++) {
    const at = (d, z) => [[...off(i, d), z], [...off(i + 1, d), z]];
    glass.push(hull([...at(-0.3, 0), ...at(1, 0), ...at(-0.3, H.glazing + 0.35), ...at(0, H.glazing), ...at(1, H.glazing - 1)]));
    canopy.push(hull([...at(-0.05, H.canopy[0]), ...at(0.4, H.canopy[1]), ...at(0.4, H.canopy[2]), ...at(-0.05, H.canopy[2])]));
  }
  return { glass, canopy };
};
// Zuidzijde (de winkel met de deur) van de ronde zuidwesthoek tot de pijler met het logo, en de westelijke etalage.
const southFront = shopfront([[5.18, -5.72], [6.38, -3.92], [7.01, -1.85], [7.1, -0.43], [7.01, 0.99]]);
const westFront = shopfront([[0.4, -7.1], [3.0, -7.1]]);
// De luifel loopt langs de hele zuid- en westkant door.
const canopyAll = shopfront([[-5.58, -7.02], [3.52, -7.1], [5.18, -5.72], [6.38, -3.92], [7.01, -1.85], [7.1, -0.43], [7.01, 0.99], [6.76, 2.39]]).canopy;

// ---------- toren ----------
const shaft = prism(oct(HALF, CHAMFER), BASE, H.cornice[1] + 0.01);
const corniceOct = oct(HALF + CORNICE_OUT, CHAMFER + CORNICE_OUT);
const cornice = union([
  hull([...ring(oct(HALF, CHAMFER), H.cornice[0]), ...ring(corniceOct, H.cornice[1])]),
  prism(corniceOct, H.cornice[1] - 0.01, H.cornice[2]),
]);
// Lage achtkante piramide (36 graden) vanaf de kroonlijst.
const roof = hull([...ring(corniceOct, H.cornice[2] - 0.01), [0, 0, H.apex]]);

// Balkon aan de zuidgevel (+X): dichte borstwering, onderkant onder 45 graden.
const balcony = hull([
  [HALF - 0.1, -BALCONY.width / 2, H.balcony[0]], [HALF - 0.1, BALCONY.width / 2, H.balcony[0]],
  [HALF + BALCONY.depth, -BALCONY.width / 2, H.balcony[1]], [HALF + BALCONY.depth, BALCONY.width / 2, H.balcony[1]],
  [HALF + BALCONY.depth, -BALCONY.width / 2, H.balcony[2]], [HALF + BALCONY.depth, BALCONY.width / 2, H.balcony[2]],
  [HALF - 0.1, -BALCONY.width / 2, H.balcony[2]], [HALF - 0.1, BALCONY.width / 2, H.balcony[2]],
]);

// Tulpen op de vier brede zijden: kelk van 2,3 × 3,1 m, 0,25 m reliëf, onderkant onder 45 graden. De stelen (circa 0,4 m
// breed) en bladeren zijn te dun voor 1:1000.
const TULIP = [[0, 0], [0.6, 0.15], [1.0, 0.7], [1.15, 1.6], [1.05, 2.6], [0.7, 3.1], [-0.7, 3.1], [-1.05, 2.6], [-1.15, 1.6], [-1.0, 0.7], [-0.6, 0.15]];
const TULIP_Z = 22.7;
const tulip = hull([
  ...TULIP.map(([s, t]) => [HALF - 0.05, s, TULIP_Z + t]),
  ...TULIP.map(([s, t]) => [HALF + 0.25, s, TULIP_Z + 0.35 + t * 0.9]),
]);

// ---------- vensters (nissen) ----------
// Zuidgevel (+X), van onder naar boven, y positief naar het oosten: de hoge pui van twee lagen boven het paviljoen, twee
// smalle hoge vensters aan de oostkant, een venster en daarboven twee vensters naast de steel, de balkondeur, twee
// vierkante vensters onder de tulp.
const southWindows = [
  niche(HALF, 3.4, 3.9, 8.0, 0.35),
  niche(HALF, 0.9, 8.9, 11.0, 0.3, 1.85), niche(HALF, 0.9, 12.0, 14.0, 0.3, 1.85),
  niche(HALF, 1.2, 11.6, 13.4, 0.3, -0.75),
  niche(HALF, 1.2, 14.3, 15.1, 0.3, -0.75), niche(HALF, 1.2, 14.3, 15.1, 0.3, 0.75),
  niche(HALF, 3.0, 18.0, 19.4, 0.3),
  niche(HALF, 1.0, 21.0, 22.0, 0.35, -1.2), niche(HALF, 1.0, 21.0, 22.0, 0.35, 1.2),
];
// Zij- en achtergevels: twee smalle hoge vensters aan de kant van de zuidgevel en een liggend venster (geschat naar de
// foto's van het zuidwesten).
const sideWindows = (towardSouth) => [
  niche(HALF, 0.9, 8.0, 10.0, 0.3, 1.8 * towardSouth), niche(HALF, 0.9, 13.5, 15.5, 0.3, 1.8 * towardSouth),
  niche(HALF, 1.2, 11.8, 12.7, 0.3, 0.9 * towardSouth),
];
const windows = union([
  ...southWindows,
  ...sideWindows(-1).map((m) => place(m, { deg: 90 })), // oost: lokaal +y van die gevel wijst naar het noorden
  ...sideWindows(1).map((m) => place(m, { deg: 270 })), // west
  ...sideWindows(1).map((m) => place(m, { deg: 180 })), // noord
]);
const tulips = union([0, 90, 180, 270].map((deg) => place(tulip, { deg })));

const pavilionBody = pavilion.subtract(terrace);
const tower = union([shaft, cornice, roof, balcony]).subtract(windows).add(tulips);
const building = union([pavilionBody, tower, ...canopyAll])
  .subtract(union([...southFront.glass, ...westFront.glass]))
  .add(union(canopyAll));

await writeLandmark({
  slug: "watertoren-roelofarendsveen",
  base: BASE,
  nodes: [["building:watertoren-schacht-balkon-dak-tulpen-en-winkelpaviljoen", building]],
  catalog: {
    name: "Watertoren Roelofarendsveen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8.5, 0], [5, 4.5], [-4, 6], [-5, -9]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1884100000002910"],
    description:
      "Oorsprong op het hart van de toren op maaiveld (NAP -0,65 m), +X de zuidgevel met balkon en winkelpui (RD -99 graden). Betonnen toren op een vierkant van 7,6 m met afgeschuinde hoeken tot de kroonlijst op 28,2 m en een achtkante piramide tot 31,1 m, vensters als nissen, balkon op 16,9 m, tulpen als reliëf op de vier brede zijden; paviljoen volgens de BAG-contour tot 3,7 m met dakterras, etalages en luifel. Maten uit BAG, AHN, luchtfoto en foto's.",
    realWorld: {
      built: "1932",
      architect: "H. Sangster",
      use: "bloemenwinkel en woon- en bedrijfsruimte; tulpen op de gevels sinds 1986",
      monument: "gemeentelijk monument",
      wikipediaHeightM: 31.5,
      reservoirM3: 150,
      ahnGroundNapM: GROUND_NAP,
      ahnApexNapM: 30.46,
      ahnPavilionRoofNapM: 2.45,
      towerWidthM: 2 * HALF,
      towerChamferM: CHAMFER,
      corniceM: H.cornice[2],
      apexM: H.apex,
      balconyM: H.balcony[1],
      pavilionM: H.pavilion,
      terraceM: H.terrace,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Roelofarendsveen) (1932, H. Sangster, 31,5 m, 150 m³, bloemenwinkel, tulpen sinds 1986)",
      "https://commons.wikimedia.org/wiki/File:Roelofarendsveen_watertoren.jpg (2010, vanuit het zuiden)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Roelofarendsveen.jpg (2007, vanuit het zuidwesten)",
      "https://commons.wikimedia.org/wiki/File:Roelofarendsveen,_watertoren_in_straatzicht_foto2_2009-10-25_15.46.JPG",
      "https://commons.wikimedia.org/wiki/File:Roelofsarendsveen,_de_watertoren_in_straatzicht_IMG_0045_2021-08-03_14.49.jpg",
      "PDOK BAG-pand 1884100000002910, AHN DSM/DTM 0,5 m, 3D BAG en luchtfoto, 2026-11-07",
    ],
  },
});

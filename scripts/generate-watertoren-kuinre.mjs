// Watertoren van Kuinre (gemeente Steenwijkerland), gebouwd in 1933 in de stijl van de Amsterdamse School (Wikipedia: 35,45 m
// hoog, reservoir 120 m³; rijksmonument 506466). Een vierkante bakstenen schacht van circa 8 × 8 m, waarvan de vier hoeken over
// de hele hoogte zijn uitgespaard (BAG: inkepingen van 0,6 à 0,75 bij 1,3 à 1,5 m). Bovenin zit in elke inkeping een bolle erker
// van glazen bouwstenen: zes rijen glas tussen stenen banden, op een stenen dorpel. Daarboven is de toren weer volledig vierkant;
// aan de noordwest- en noordoostzijde ligt het dak lager, de rest is een opbouw met een verdiept plat dak binnen een rand.
// In de zuidoostgevel een deur onder een luifel, in de zuidwestgevel een driedelig venster; verder smalle spleetvensters.
//
// Oorsprong op het hart van de BAG-contour van pand 1708100000028231 (midden van de omhullende rechthoek in het stelsel van de
// gevels), op maaiveld NAP +1,4 (AHN-DTM in een ring van 5,5 tot 8 m: 0,95 tot 1,87, mediaan 1,37; de toren staat op een lage
// verhoging die naar het oosten oploopt). +X langs de zuidoostgevel naar het noordoosten (44,85 graden, gemeten op de lange
// BAG-gevels), +Y naar het noordwesten. Hoogtes: AHN-DSM 0,5 m en 3D BAG (LoD2.2): rand van de opbouw NAP +35,9 à +36,1,
// verdiept dak daarbinnen +34,75, lage strook aan de noordwestkant +33,2 à +33,7 (3D BAG +33,2), strook aan de noordoostkant
// +34,8. Geledingen, vensters, deur en luifel uit de foto's op Commons (zie sources), geschaald op de AHN-hoogte van de opbouw.
import { hull, union, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [185656.01, 533514.43];
const ANGLE = 44.85; // graden linksom vanaf oost: richting van de lange BAG-gevels
const AXIS = [+Math.cos((ANGLE * Math.PI) / 180).toFixed(5), +Math.sin((ANGLE * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 1.4;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06 met de terreintegels van de export
// (noordoost 44,02 op het pad, zuidwest 43,52, noordwest 43,58, zuidoost 43,69).
const GROUND_ELLIPSOID = 43.52;

// ---------- plattegrond (BAG-contour in het lokale stelsel, op centimeters) ----------
const U = 4.11; // halve maat langs X (noordoost- en zuidwestgevel op ±4,11)
const V = 3.94; // halve maat langs Y (noordwest- en zuidoostgevel op ±3,94)
// Binnenhoek van elke inkeping met de richting naar buiten.
const CORNERS = [
  { c: [-3.36, -2.65], s: [-1, -1] }, // zuid
  { c: [3.46, -2.65], s: [1, -1] }, // oost
  { c: [3.43, 2.47], s: [1, 1] }, // noord
  { c: [-3.53, 2.58], s: [-1, 1] }, // west
].map(({ c, s }) => ({ c, s, a: U - Math.abs(c[0]), b: V - Math.abs(c[1]) }));
const BODY = [
  [-3.36, -V], [3.46, -V], [3.46, -2.65], [U, -2.65], [U, 2.47], [3.43, 2.47],
  [3.43, V], [-3.53, V], [-3.53, 2.58], [-U, 2.58], [-U, -2.65], [-3.36, -2.65],
];
const rect = (u0, v0, u1, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];

// ---------- hoogtes (meters boven maaiveld NAP +1,4) ----------
const H = {
  sill: 26.9, // bovenkant stenen dorpel onder de erkers (foto 01d: 26,6 tot 27,0)
  sillLip: 0.25, // dorpel steekt 0,25 m buiten de gevels uit, onderkant 45 graden
  corbel: 1.6, // kraag onder de dorpel in de inkeping (niet op de foto; nodig om zonder steun te printen)
  band: 0.22, // stenen banden tussen de glasrijen
  glass: 0.55, // zes rijen glazen bouwstenen
  glassDepth: 0.12, // glas achter de banden
  fill: 0.46, // overgang van erker naar de volle hoek, onder 42 graden
  ledge: 32.3, // lage strook aan de noordwestkant, NAP +33,7 (AHN 33,2 tot 33,7; 3D BAG 33,2)
  stepNE: 33.4, // strook aan de noordoostkant, NAP +34,8
  roof: 33.35, // verdiept dak binnen de rand, NAP +34,75 (3D BAG 34,75)
  top: 34.6, // rand van de opbouw, NAP +36,0 (AHN 35,9 tot 36,1)
};
const ROWS = 6;
const BAY_TOP = H.sill + (ROWS + 1) * H.band + ROWS * H.glass; // 31,74
const FULL = BAY_TOP + H.fill; // 32,2: vanaf hier is de toren volledig vierkant
// Opbouw: vlak met de zuidwest- en zuidoostgevel, 0,66 m terug van de noordoostgevel en 1,94 m van de noordwestgevel.
const ATTIC = [-U, -V, 3.45, 2.0];
const RIM = 1.0;

// ---------- erkers ----------
// Kwart ellips in de inkeping, met het middelpunt op de binnenhoek: raakt beide gevelvlakken aan de rand van de inkeping.
// IN: de erker en de dorpel steken 5 cm in de binnenwanden van de inkeping, zodat er geen samenvallende vlakken zijn.
const IN = 0.05;
const sector = ({ c, s, a, b }, shrink, n = 24) => [
  [c[0] - s[0] * IN, c[1] - s[1] * IN],
  [c[0] + s[0] * (a - shrink), c[1] - s[1] * IN],
  ...Array.from({ length: n + 1 }, (_, k) => {
    const t = (Math.PI / 2) * (k / n);
    return [c[0] + s[0] * (a - shrink) * Math.cos(t), c[1] + s[1] * (b - shrink) * Math.sin(t)];
  }),
  [c[0] - s[0] * IN, c[1] + s[1] * (b - shrink)],
];
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const notchRect = ({ c, s, a, b }, grow = 0) =>
  rect(c[0] - s[0] * IN, c[1] - s[1] * IN, c[0] + s[0] * (a + grow), c[1] + s[1] * (b + grow));

const bay = (k) => {
  const full = sector(k, 0), glass = sector(k, H.glassDepth);
  const parts = [prism(glass, H.sill - 0.01, BAY_TOP)];
  for (let i = 0; i <= ROWS; i++) {
    const z = H.sill + i * (H.band + H.glass);
    // Band met een onderkant van 45 graden over het glas eronder.
    parts.push(hull([...ring(glass, z - H.glassDepth), ...ring(full, z), ...ring(full, z + H.band)]));
  }
  // Boven de erker vult een schuine overgang de inkeping tot de volle hoek.
  parts.push(hull([...ring(full, BAY_TOP - 0.01), ...ring(notchRect(k), FULL)]));
  // Dorpel: 0,25 m buiten de gevels met een onderkant van 45 graden, eronder een kraag die in de binnenhoek van de inkeping
  // uitloopt in een punt 1,6 m lager (alle ondervlakken 46 graden of steiler).
  const { c, s } = k;
  parts.push(hull([
    ...ring(notchRect(k, H.sillLip), H.sill),
    ...ring(notchRect(k), H.sill - H.sillLip),
    [c[0] - s[0] * IN, c[1] - s[1] * IN, H.sill - H.sillLip - H.corbel],
  ]));
  return union(parts);
};

// ---------- gevelopeningen ----------
// Gevel met buitennormaal n op afstand d van het hart; s loopt langs de gevel.
const FACES = {
  SE: { n: [0, -1], d: V },
  NW: { n: [0, 1], d: V },
  NE: { n: [1, 0], d: U },
  SW: { n: [-1, 0], d: U },
};
const at = ({ n, d }) => (o, s, z) => [n[0] * (d + o) - n[1] * s, n[1] * (d + o) + n[0] * s, z];
// Blinde nis (breedte w, van z0 tot z1, diepte depth) met een plafond dat onder 56 graden de muur in loopt.
const niche = (face, s0, w, z0, z1, depth = 0.3) => {
  const p = at(FACES[face]);
  return hull([s0 - w / 2, s0 + w / 2].flatMap((s) => [
    p(-depth, s, z0), p(0.5, s, z0), p(-depth, s, z1 + 1.5 * depth), p(0, s, z1), p(0.5, s, z1 - 0.75),
  ]));
};
const SLITS = [[7.7, 8.7], [13.5, 14.5], [19.4, 20.4], [23.8, 24.8]];
const DOOR_S = 1.2; // deur in de zuidoostgevel, 1,2 m naar het noordoosten (foto 01d)
const openings = union([
  // Spleetvensters (0,6 × 1,0 m; in het echt circa 0,35 × 0,8 m) op de middellijn: vier boven elkaar in de zuidoost- en
  // noordwestgevel, één in de zuidwest- en noordoostgevel.
  ...["SE", "NW"].flatMap((f) => SLITS.map(([z0, z1]) => niche(f, 0, 0.6, z0, z1))),
  ...["SW", "NE"].map((f) => niche(f, 0, 0.6, ...SLITS[3])),
  // Hoge opening in de zuidoostgevel onder de opbouw (foto 01d: 29,3 tot 31,4 m).
  niche("SE", -0.9, 0.9, 29.3, 31.4),
  // Driedelig venster in de zuidwestgevel (foto 01d: 0,75 m breed, 1,7 tot 2,8 m).
  niche("SW", 0, 1.0, 1.6, 2.8),
  // Deur onder de luifel.
  niche("SE", DOOR_S, 1.2, 0, 2.0),
]);
// Luifel boven de deur: 2,3 m breed, 0,6 m uit de gevel, onderkant 45 graden, bovenkant op 3,0 m.
const canopy = (() => {
  const p = at(FACES.SE);
  return hull([DOOR_S - 1.15, DOOR_S + 1.15].flatMap((s) => [
    p(-0.05, s, 2.1), p(-0.05, s, 3.0), p(0.6, s, 2.75), p(0.6, s, 3.0),
  ]));
})();

// ---------- toren ----------
const shaft = prism(BODY, BASE, FULL);
const upper = prism(rect(-U, -V, U, V), FULL - 0.01, H.ledge);
const stepNE = prism(rect(ATTIC[2] - 0.01, -V, U, ATTIC[3]), H.ledge - 0.01, H.stepNE);
const attic = prism(rect(...ATTIC), H.ledge - 0.01, H.top)
  .subtract(prism(rect(ATTIC[0] + RIM, ATTIC[1] + RIM, ATTIC[2] - RIM, ATTIC[3] - RIM), H.roof, H.top + 1));
const tower = union([shaft, ...CORNERS.map(bay), upper, stepNE, attic]).subtract(openings).add(canopy);

await writeLandmark({
  slug: "watertoren-kuinre",
  base: BASE,
  nodes: [["building:watertoren-schacht-hoekerkers-opbouw-deur-en-luifel", tower]],
  catalog: {
    name: "Watertoren Kuinre",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5.5, 0], [-5.5, 0], [0, 5.5], [0, -5.5]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1708100000028231"],
    description:
      "Oorsprong op het hart van de BAG-contour op maaiveld NAP +1,4 m, +X langs de zuidoostgevel naar het noordoosten (44,85 graden), +Y naar het noordwesten. Vierkante bakstenen schacht van 8,2 × 7,9 m met over de hele hoogte uitgespaarde hoeken; bovenin in elke hoek een bolle erker van glazen bouwstenen (zes rijen tussen stenen banden, 26,9 tot 31,74 m) op een stenen dorpel, daarboven weer vierkant; lage strook aan de noordwestkant op 32,3 m, strook aan de noordoostkant op 33,4 m, opbouw met een rand tot 34,6 m (NAP +36,0) rond een verdiept dak op 33,35 m. Deur met luifel in de zuidoostgevel, driedelig venster in de zuidwestgevel, spleetvensters. Maten uit BAG, AHN, 3D BAG, luchtfoto en drie foto's.",
    realWorld: {
      built: 1933,
      style: "Amsterdamse School",
      rijksmonument: 506466,
      wikipediaHeightM: 35.45,
      reservoirM3: 120,
      ahnGroundNapM: GROUND_NAP,
      ahnRimNapM: 36.0,
      ahnSunkenRoofNapM: 34.75,
      ahnLedgeNwNapM: 33.7,
      ahnStepNeNapM: 34.8,
      ahnDsmMaxNapM: 36.46,
      bag3dRoofNapM: [33.2, 34.75],
      bag3dMaxNapM: 36.21,
      planM: [U * 2, V * 2],
      bayTopM: BAY_TOP,
      topM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Kuinre) (1933, 35,45 m, 120 m³, Amsterdamse School, rijksmonument 506466)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Kuinre_01d.JPG (vanuit het zuiden: geledingen, erkers, opbouw, spleetvensters, deur met luifel en driedelig venster; schaal 18,4 px/m uit de AHN-hoogte)",
      "https://commons.wikimedia.org/wiki/File:De_watertoren_van_Kuinre.JPG (erkers met glazen bouwstenen, dorpels, opbouw met lagere hoeken)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Kuinre.jpg (gevel met twee erkers en de lagere strook aan één kant)",
      "PDOK BAG-pand 1708100000028231 (contour met uitgespaarde hoeken), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.1708100000028231: maaiveld 0,94, dakvlakken op 34,75 en 33,2, h_dak_max 36,21, opgehaald 2026-11-06",
    ],
  },
});

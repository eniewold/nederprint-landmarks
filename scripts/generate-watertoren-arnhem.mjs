// Watertoren "De Steenen Tafel" in Arnhem (gemeentewerken Arnhem, ontwerp
// J. van Biesen 1925, gebouwd 1926-1928), rijksmonument 516836, 22,5 m hoog,
// reservoir van 600 m³. Veelzijdig hoofdblok (een langgerekte achthoek met
// licht geknikte lange gevels) op een gepleisterde onderbouw met een hoge
// betonnen band, daarboven gele baksteen; de bovenste verdieping springt iets
// terug. Aan de oostkant een halfrond trappenhuis dat boven het hoofdblok
// uitsteekt. Sinds 1967 restaurant; het glazen paviljoen aan de zuidkant hoort
// bij hetzelfde BAG-pand.
// Oorsprong op de symmetrie-as van hoofdblok en trappenhuis in het AHN op
// maaiveld (NAP +83,40 m); +X wijst langs de lange as naar het trappenhuis,
// 14,5 graden linksom van RD-oost (gelijk aan de gevels van het paviljoen).
// Plattegrond uit het AHN (dakranden) en de BAG-contour (onderbouw, 0,5 m
// breder); hoogtes uit het AHN (dak 17,2, borstwering 18,0, trappenhuis 22,1 tot
// 22,5) en uit de frontale foto's van de westgevel (onderbouw 4,2, band 5,5,
// terugsprong 15,4), geschaald op de borstwering in het AHN.
import { Manifold, CrossSection, hull, circle, union, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [191865.88, 446038.48];
const AXIS = [0.9681, 0.2504];
const BASE = -0.3;
const H = {
  plinth: 4.2, // bovenkant van de gepleisterde onderbouw
  band: 5.5, // bovenkant van de hoge betonnen band
  step: 15.4, // terugsprong van de bovenste verdieping
  roof: 17.2, // dakterras van het hoofdblok
  parapet: 18.0, // bakstenen borstwering
  stairRoof: 22.1,
  stairTop: 22.5,
  annex: 3.8, // glazen paviljoen
  link: 4.0, // glazen tussenlid naar de toren
  roofLight: 5.1,
};

// ---------- plattegrond (gevels van de baksteen, linksom) ----------
// Langgerekte achthoek: westgevel, twee afgeschuinde hoeken, lange noord- en
// zuidgevels met een flauwe knik bij x = -1,7, en schuine oostgevels die op het
// trappenhuis aansluiten.
const MAIN = [
  [-8.1, -2.4], [-6.4, -4.75], [-1.7, -5.15], [3.0, -4.75], [4.2, -2.45],
  [4.2, 2.45], [3.0, 4.75], [-1.7, 5.15], [-6.4, 4.75], [-8.1, 2.4],
];
const STAIR_C = [7.0, 0];
const STAIR_R = 2.45;
const cs = (pts) => new CrossSection([pts]);
const mainCs = cs(MAIN);
const stairCs = cs([[3.6, -STAIR_R], [STAIR_C[0], -STAIR_R], [STAIR_C[0], STAIR_R], [3.6, STAIR_R]]).add(cs(circle(STAIR_C, STAIR_R, 48)));
const extrude = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);

// Onderbouw en band 0,5 m buiten de baksteen (BAG-contour), om het trappenhuis 0,3 m.
const plinth = extrude(mainCs.offset(0.5, "Miter").add(stairCs.offset(0.3, "Miter")), BASE, H.band);
const shaft = extrude(mainCs, H.band - 0.05, H.step);
// Bovenste verdieping 0,2 m terug, dakterras achter een borstwering van 0,9 m (in het echt dunner).
const top = extrude(mainCs.offset(-0.2, "Miter"), H.step - 0.05, H.parapet).subtract(extrude(mainCs.offset(-1.1, "Miter"), H.roof, H.parapet + 1));
const stair = extrude(stairCs, H.band - 0.05, H.stairTop).subtract(extrude(stairCs.offset(-0.9, "Miter"), H.stairRoof, H.stairTop + 1));

// ---------- paviljoen (restaurant) aan de zuidkant ----------
const ANNEX = { x0: -7.8, x1: 4.3, y0: -15.1, y1: -6.8 };
const annex = union([
  box(ANNEX.x0, ANNEX.y0, BASE, ANNEX.x1, ANNEX.y1, H.annex),
  box(-6.2, -7.0, BASE, 3.3, -5.0, H.link),
  box(-1.3, -8.8, H.annex - 0.1, 1.6, -7.6, H.roofLight), // lichtkap
]);

// ---------- nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt (de export vult hem niet op), in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
// Gevel i van MAIN (van punt i naar i+1), verschoven over d naar buiten; s is de afstand vanaf punt i.
const onFace = (i, d, s, w, z0, z1, depth) => {
  const [ax, ay] = MAIN[i], [bx, by] = MAIN[(i + 1) % MAIN.length];
  const L = Math.hypot(bx - ax, by - ay), n = [(by - ay) / L, -(bx - ax) / L];
  const px = ax + ((bx - ax) * s) / L, py = ay + ((by - ay) * s) / L;
  const f = n[0] * ax + n[1] * ay + d, t = -n[1] * px + n[0] * py;
  return place(niche(f, w, z0, z1, depth).translate([0, t, 0]), { deg: (Math.atan2(n[1], n[0]) * 180) / Math.PI });
};
const len = (i) => Math.hypot(MAIN[(i + 1) % MAIN.length][0] - MAIN[i][0], MAIN[(i + 1) % MAIN.length][1] - MAIN[i][1]);
// Gevels: 0 zuidwest, 1 en 2 zuid (west en oost van de knik), 3 zuidoost, 5 noordoost, 6 en 7 noord (oost en west), 8 noordwest, 9 west.
const cuts = [
  // Bovenste verdieping: per helft van de noord- en zuidgevel een drieruits bandvenster naast de knik.
  onFace(1, -0.2, len(1) - 1.9, 2.8, H.step + 0.05, 16.65),
  onFace(2, -0.2, 1.9, 2.8, H.step + 0.05, 16.65),
  onFace(6, -0.2, len(6) - 1.9, 2.8, H.step + 0.05, 16.65),
  onFace(7, -0.2, 1.9, 2.8, H.step + 0.05, 16.65),
  // Onderbouw: groot restaurantvenster in de westgevel, deur in de zuidwesthoek, getralied venster in de noordwesthoek.
  onFace(9, 0.5, len(9) / 2, 3.2, 0.6, 2.8),
  onFace(0, 0.5, len(0) / 2, 1.3, 0, 2.5),
  onFace(8, 0.5, len(8) / 2, 1.0, 1.0, 2.2),
  // Noordgevel van de onderbouw: per helft een venster naast de knik en een ingang naar de hoek.
  ...[6, 7].flatMap((i) => {
    const fromBend = (s) => (i === 6 ? len(i) - s : s);
    return [onFace(i, 0.5, fromBend(1.4), 1.6, 0.9, 2.4), onFace(i, 0.5, fromBend(3.7), 1.2, 0, 2.5)];
  }),
  // Trappenhuis: vier bandvensters boven elkaar in de ronding (zuidzijde).
  ...[7.8, 11.4, 15.0, 18.6].map((z) => place(niche(STAIR_R, 1.4, z - 0.5, z + 0.5), { deg: -65 }).translate([...STAIR_C, 0])),
  // Paviljoen: vier glaspuien in de zuidgevel, twee in de west- en de oostgevel.
  ...[0, 1, 2, 3].map((k) => place(niche(-ANNEX.y0, 1.8, 0.5, 2.9).translate([0, -1.75 + (k - 1.5) * 2.8, 0]), { deg: -90 })),
  ...[-2, 2].map((dy) => place(niche(-ANNEX.x0, 2.4, 0.5, 2.9).translate([0, 10.95 + dy, 0]), { deg: 180 })),
  ...[-2, 2].map((dy) => place(niche(ANNEX.x1, 2.4, 0.5, 2.9).translate([0, -10.95 + dy, 0]), { deg: 0 })),
];

await writeLandmark({
  slug: "watertoren-arnhem",
  base: BASE,
  // Eén node: de export vult elke node apart op; toren, trappenhuis en paviljoen staan samen op het maaiveld.
  nodes: [["building:toren-trappenhuis-en-paviljoen", union([plinth, shaft, top, stair, annex]).subtract(union(cuts))]],
  catalog: {
    name: "Watertoren Arnhem",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-10.2, 0], [11.5, 0], [0, 7.3], [0, -16.6]],
    replacesBuildings: ["NL.IMBAG.Pand.0202100000235137"],
    description:
      "Watertoren De Steenen Tafel. Oorsprong op de symmetrie-as van hoofdblok en trappenhuis in het AHN op maaiveld (NAP +83,40 m), +X langs de lange as naar het halfronde trappenhuis op 14,5 graden (oost). Langgerekt achtzijdig hoofdblok van 12,3 bij 10,3 m met licht geknikte lange gevels op een gepleisterde onderbouw met betonnen band tot 5,5 m (0,5 m breder), bovenste verdieping vanaf 15,4 m 0,2 m terug met bandvensters, dakterras op 17,2 m achter een borstwering tot 18,0 m; trappenhuis van 4,9 m breed tot 22,5 m met vier vensters in de ronding; glazen paviljoen van 3,8 m hoog aan de zuidkant. Maten uit AHN, BAG, het monumentenregister en foto's.",
    realWorld: {
      publishedHeightM: 22.5,
      reservoirM3: 600,
      ahnGroundNapM: 83.4,
      ahnRoofNapM: 100.65,
      ahnStairRoofNapM: 105.5,
      mainLengthM: 12.3,
      mainWidthM: 10.3,
      plinthM: 4.2,
      bandM: 5.5,
      setbackM: 15.4,
      roofM: 17.2,
      parapetM: 18.0,
      stairWidthM: 4.9,
      stairTopM: 22.5,
      annexM: 3.8,
      modelTopM: 22.5,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Arnhem)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/516836",
      "https://commons.wikimedia.org/wiki/File:Watertower_Arnhem.JPG (westgevel, hoogtes onderbouw en band)",
      "https://commons.wikimedia.org/wiki/File:Klarenbeek_Stenen_Tafel_watertoren.jpg (westgevel van verder weg)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren,_thans_restaurant_-_Arnhem_-_20345330_-_RCE.jpg (zuidgevel met knik en bandvensters)",
      "https://commons.wikimedia.org/wiki/File:Restaurant_%22de_Stenen_tafel%22_at_the_highest_point_of_Arnhem_some_85_m_above_sealevel_-_panoramio.jpg (zuidkant, trappenhuis en paviljoen)",
      "PDOK BAG-pand 0202100000235137, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

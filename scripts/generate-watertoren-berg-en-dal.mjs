// Watertoren van Berg en Dal (1929, A. Busselaar en J.H.J. Kording), reservoir
// van 110 m³, aan de Watertorenweg. Bakstenen toren op een achthoekige
// plattegrond (een vierkant met afgeschuinde hoeken), met verticale wanden, een
// sokkel, in elk hoofdvlak een strook louvreramen met twee reliëfblokken en een
// lisene, in elk schuin vlak twee verdiepte panelen, een betonnen dakrand en
// een laag achtzijdig tentdak.
// Oorsprong op het hart van de BAG-contour (hoofdvlakken 4,5 m, schuine vlakken
// 2,6 m, 8,2 m over de vlakken) op maaiveld (NAP +93,2 m). +X staat loodrecht
// op het oostelijke hoofdvlak, 13,3 graden linksom van RD-oost; +Y wijst naar de
// deur aan de Watertorenweg (noord). Hoogtes uit de frontale RCE-foto 20313815
// (shiftlens, verticalen evenwijdig), geschaald op de bovenkant van de dakrand
// in het AHN (24,0 m, 41 px/m); tentdak uit het AHN (top 26,7 m).
import { Manifold, hull, ring3, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [191564.2, 425604.29];
const AXIS = [0.9732, 0.23];
const BASE = -0.3;
const H = {
  plinth: 1.4, // sokkel, met een schuine waterlijst tot 1,55
  plinthBevel: 1.55,
  pier: 3.0, // penant onder de lisene op de drie zijvlakken
  portal: 2.5, // deurportaal, met een luifel tot 2,9
  canopy: 2.9,
  relief0: 15.54, // twee reliëfblokken onder de louvrestrook
  relief1: 16.15,
  relief2: 16.32,
  relief3: 16.9,
  louvre0: 17.0, // strook louvreramen
  louvre1: 22.4,
  panelLow: [1.55, 15.4], // verdiepte panelen in de schuine vlakken
  panelHigh: [16.3, 22.1],
  wall: 23.35, // onderkant van de dakrand
  coping: 24.0, // bovenkant van de dakrand
  apex: 26.6, // top van het tentdak
};
// Achthoek als vierkant met afgeschuinde hoeken: apothema A van de hoofdvlakken, D van de schuine.
const WALL = { A: 4.0, D: 4.39 };
const PLINTH = { A: 4.1, D: 4.49 }; // = BAG-contour
const oct = ({ A, D }, d = 0) => {
  const a = A + d, c = (D + d) * Math.SQRT2 - a;
  return [[a, -c], [a, c], [c, a], [-c, a], [-a, c], [-a, -c], [-c, -a], [c, -a]];
};

// ---------- schacht met sokkel, dakrand en tentdak ----------
const shaft = prism(oct(WALL), BASE, H.wall + 0.05);
const plinth = hull([...ring3(oct(PLINTH), BASE), ...ring3(oct(PLINTH), H.plinth), ...ring3(oct(WALL), H.plinthBevel)]);
// Dakrand: kraagt 0,12 m uit op een schuine onderkant (56 graden).
const coping = hull([...ring3(oct(WALL), H.wall), ...ring3(oct(WALL, 0.12), H.wall + 0.18), ...ring3(oct(WALL, 0.12), H.coping)]);
// Achtzijdig tentdak achter de dakrand (36 graden), graten naar de hoeken.
const roof = hull([...ring3(oct(WALL, -0.45), H.coping - 0.05), [0, 0, H.apex]]);

// ---------- reliëf op de vlakken (vlak met normaal +X op afstand f) ----------
const block = (x0, x1, y0, y1, z0, z1) => hull([[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]]);
// Uitstekend blok met een onderkant die onder 56 graden naar de gevel terugloopt.
const corbel = (f, w, out, z0, z1) =>
  hull([[f - 0.05, -w / 2, z0], [f - 0.05, w / 2, z0], [f + out, -w / 2, z0 + 1.5 * out], [f + out, w / 2, z0 + 1.5 * out], [f - 0.05, -w / 2, z1], [f - 0.05, w / 2, z1], [f + out, -w / 2, z1], [f + out, w / 2, z1]]);
// Nis met een plafond dat naar binnen onder 56 graden oploopt (de export vult hem niet op).
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};

const f = WALL.A;
const reliefs = [corbel(f, 2.0, 0.2, H.relief0, H.relief1), corbel(f, 2.0, 0.2, H.relief2, H.relief3)];
const lisene = (z0) => block(f - 0.05, f + 0.12, -0.25, 0.25, z0, H.relief0 + 0.26);
// Penant onder de lisene: 0,9 m breed, 0,25 m voor de gevel, met een aflopende bovenkant.
const pier = hull([[f - 0.05, -0.45, BASE], [f + 0.25, -0.45, BASE], [f - 0.05, 0.45, BASE], [f + 0.25, 0.45, BASE], [f - 0.05, -0.45, H.pier], [f - 0.05, 0.45, H.pier], [f + 0.25, -0.45, H.pier - 0.4], [f + 0.25, 0.45, H.pier - 0.4]]);
// Deurportaal: omlijsting 2,6 m breed en 0,3 m diep, luifel tot 0,55 m voor de gevel op schuine kanten.
const portal = union([
  block(f - 0.05, f + 0.3, -1.3, 1.3, BASE, H.portal),
  hull([[f - 0.05, -1.3, H.portal - 0.01], [f + 0.3, -1.3, H.portal - 0.01], [f - 0.05, 1.3, H.portal - 0.01], [f + 0.3, 1.3, H.portal - 0.01], [f - 0.05, -1.4, H.canopy], [f + 0.55, -1.4, H.canopy], [f - 0.05, 1.4, H.canopy], [f + 0.55, 1.4, H.canopy]]),
]);

const MAIN = [0, 90, 180, 270];
const DOOR = 90; // noord, aan de Watertorenweg
const relief = union(
  MAIN.map((deg) => place(union([...reliefs, ...(deg === DOOR ? [portal, lisene(H.canopy - 0.1)] : [pier, lisene(H.pier - 0.3)])]), { deg })),
);

const D = WALL.D;
const cuts = union([
  // Strook louvreramen (1,6 m breed) in elk hoofdvlak, de deur in het noordvlak.
  ...MAIN.map((deg) => place(niche(f, 1.6, H.louvre0, H.louvre1, 0.4), { deg })),
  place(niche(f + 0.3, 1.2, 0, 2.4, 0.6), { deg: DOOR }),
  // Twee verdiepte panelen (1,7 m breed) in elk schuin vlak, met de band ertussen op de hoogte van de reliëfblokken.
  ...[45, 135, 225, 315].flatMap((deg) => [H.panelLow, H.panelHigh].map(([z0, z1]) => place(niche(D, 1.7, z0, z1, 0.25), { deg }))),
]);

const tower = union([shaft, plinth, coping, roof, relief]).subtract(cuts);

await writeLandmark({
  slug: "watertoren-berg-en-dal",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los dak zou een eigen voet krijgen.
  nodes: [["building:schacht-dakrand-en-tentdak", tower]],
  catalog: {
    name: "Watertoren Berg en Dal",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5.6, 0], [-5.6, 0], [0, 5.6], [0, -5.6]],
    replacesBuildings: ["NL.IMBAG.Pand.0241100000002828"],
    description:
      "Oorsprong op het hart van de BAG-contour op maaiveld (NAP +93,2 m), +X loodrecht op het oostelijke hoofdvlak (13,3 graden), +Y naar de deur aan de Watertorenweg. Bakstenen achthoek (vierkant met afgeschuinde hoeken, 8,0 m over de vlakken boven een sokkel van 8,2 m) met verticale wanden tot 23,35 m; in elk hoofdvlak een louvrestrook (17,0 tot 22,4 m), twee reliëfblokken en een lisene op een penant of op het deurportaal, in elk schuin vlak twee verdiepte panelen; uitkragende dakrand tot 24,0 m en een achtzijdig tentdak tot 26,6 m. Maten uit BAG, AHN en een RCE-foto.",
    realWorld: {
      publishedHeightM: 37.6,
      reservoirM3: 110,
      ahnGroundNapM: 93.2,
      ahnTopNapM: 119.9,
      bagMainFaceM: 4.5,
      bagChamferFaceM: 2.6,
      bagAcrossFlatsM: 8.2,
      wallAcrossFlatsM: 8.0,
      copingTopM: 24.0,
      louvreStripM: [17.0, 22.4],
      modelTopM: 26.6,
      photoScalePxPerM: 41,
      minimumPartM: 0.5,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Berg_en_Dal)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Berg_en_Dal_-_20313815_-_RCE.jpg (frontale foto, maten)",
      "https://commons.wikimedia.org/wiki/File:Berg_en_Dal_(Groesbeek)_Watertoren_(01).JPG",
      "https://commons.wikimedia.org/wiki/File:Berg_en_Dal_(Groesbeek)_Watertoren_(02).JPG (zijvlak met penant en sokkel)",
      "PDOK BAG-pand 0241100000002828, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

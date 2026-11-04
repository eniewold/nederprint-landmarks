// Watertoren aan de 1e Leijweg in Vogelenzang (gemeente Bloemendaal), gebouwd omstreeks 1957 naar ontwerp van J.P. Kloos
// (Wikipedia, Lijst van watertorens in Noord-Holland; geen eigen artikel, geen monument). Hij staat in het bos van de
// Amsterdamse Waterleidingduinen tussen de ingang Oranjekom (1e Leijweg 2) en het bezoekerscentrum (1e Leijweg 6), op het
// adres 1e Leijweg 4, en is BAG-pand 0377100000015288 (bouwjaar 1957, in gebruik). Niet te verwarren met de "Watertoren
// Vogelenzang" van 1927 in Bennebroek (model watertoren-bennebroek-watertoren-vogelenzang, BAG 0377100000002980, 2,8 km
// zuidelijker).
//
// Vorm volgens AHN en luchtfoto's: een slanke, regelmatig achtkante betonnen schacht van 6,2 m over de vlakken, van het
// maaiveld tot het platte dak op 33,3 m, zonder verbrede kuip. Op de schuine luchtfoto's van 2021 (van het zuidwesten),
// 2022 (zuiden) en 2025 (zuidoosten) zijn de hoeken lichte ribben met de vlakken ertussen, liggende bekistingsstrepen, een
// lichte dakrand rond een donker dak met zendapparatuur, en een wit vlak onder aan de zuidoostgevel (de deur). Er zijn
// geen schuine foto's van opzij op Commons of elders gevonden: de geleding komt uit de luchtfoto's (8 cm) en is
// geschat.
//
// Oorsprong op het hart van de achthoek uit het AHN-DSM (beste passende regelmatige achthoek op de dakcellen, IoU 0,97;
// de BAG-contour ligt 1 m westelijker en is onregelmatig getekend, de luchtfoto's volgen het AHN), op maaiveld (AHN-DTM
// NAP +4,05 rond de voet). Lokale +X is de normaal van de oostgevel (RD -7,5 graden), de andere vlakken per 45 graden.
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [100046.3, 484651.75];
const DEG = -7.5;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 4.05; // AHN-DTM 4,0 tot 4,2 in een ring van 1 tot 5 m rond de voet
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 47,13, zuidoost 47,18, west 47,17, noord
// 47,44), gemeten 2026-11-04 in een export op 1:1000. Recht ten zuiden ligt een smalle laagte langs het pad (PDOK 46,87;
// AHN-DTM NAP +3,7) die niet meetelt: de voet loopt daar 0,3 m door.
const GROUND_ELLIPSOID = 47.13;

// ---------- maten (boven maaiveld) ----------
const A = 3.1; // apothema van de achthoek (AHN-DSM 6,0 m over de vlakken, BAG 6,4; gebruikt 6,2)
const H = {
  plinth: 0.6, // voet zonder verdiepte vlakken (geschat)
  band: 32.6, // onderkant van de dakband (geschat, de vlakken lopen op de luchtfoto's tot vlak onder de rand)
  rim: 33.35, // bovenkant dakrand (AHN NAP +37,3 tot +37,4)
  roof: 33.1, // dakvlak binnen de rand (AHN NAP +37,2)
  kit: 34.6, // apparatuurkast op het dak (AHN NAP +38,1 tot +39,7 in het zuidwestelijke deel, zonder de antennes)
};
const RIB = 0.45; // hoekrib langs elk vlak vanaf de hoek (luchtfoto)
const D_PANEL = 0.3; // vlakken tussen de hoekribben verdiept
const RIM = 0.35; // breedte van de lichte dakrand (luchtfoto)

const octagon = (a) => Array.from({ length: 8 }, (_, k) => {
  const t = ((k + 0.5) * Math.PI) / 4;
  const r = a / Math.cos(Math.PI / 8);
  return [r * Math.cos(t), r * Math.sin(t)];
});
const FACES = [0, 45, 90, 135, 180, 225, 270, 315];
const SE = 315;
const halfSide = A * Math.tan(Math.PI / 8); // halve breedte van een vlak (1,28 m)

// Verdiept vlak (normaal +X) tussen de hoekribben, van z0 tot z1, plafond onder 45 graden.
const panel = (a, h, z0, z1, d) => hull([
  [a - d, -h, z0], [a - d, h, z0], [a + 0.8, -h, z0], [a + 0.8, h, z0],
  [a - d, -h, z1 - d], [a - d, h, z1 - d], [a + 0.8, -h, z1 + 0.8], [a + 0.8, h, z1 + 0.8],
]);
// Nis (normaal +X) in het vlak f: breedte wd, van z0 tot z1, diepte depth, plafond onder 63 graden.
const niche = (f, wd, z0, z1, depth) => {
  const y0 = -wd / 2, y1 = wd / 2, za = z1 + 2 * depth;
  return hull([
    [f - depth, y0, z0], [f + 1.0, y0, z0], [f - depth, y1, z0], [f + 1.0, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + 1.0, y0, z1 - 1.5], [f + 1.0, y1, z1 - 1.5],
  ]);
};

// ---------- schacht ----------
const shaft = prism(octagon(A), BASE, H.rim);
const panels = union(FACES.map((deg) => place(panel(A, halfSide - RIB, H.plinth, H.band, D_PANEL), { deg })));
// Plat dak binnen een lichte rand van 0,35 m, 0,25 m verdiept.
const roofRecess = prism(octagon(A - RIM), H.roof, H.rim + 1);
// Deur onder aan de zuidoostgevel (wit vlak op de luchtfoto van 2025): 1,2 x 2,4 m, 0,3 m achter het verdiepte vlak.
const door = place(niche(A, 1.2, 0, 2.4, D_PANEL + 0.3), { deg: SE });
// Apparatuurkast in het zuidwestelijke deel van het dak (AHN), 1,6 x 1,5 m.
const kit = box(-1.3, -2.3, H.roof - 0.05, 0.3, -0.8, H.kit);

const tower = union([shaft.subtract(union([panels, roofRecess, door])), kit]);

await writeLandmark({
  slug: "watertoren-vogelenzang-leijweg",
  base: BASE,
  nodes: [["building:achtkante-schacht-dakrand-en-apparatuur", tower]],
  catalog: {
    name: "Watertoren Leijweg Vogelenzang",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5, 0], [0, 5], [-5, 0], [3.5, -3.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0377100000015288"],
    description:
      "Oorsprong op het hart van de achthoek uit het AHN op maaiveld (NAP +4,05 m), +X de normaal van de oostgevel (RD -7,5 graden). Regelmatig achtkante betonnen schacht van 6,2 m over de vlakken met hoekribben en verdiepte vlakken tot een dakband, een plat dak tot 33,1 m binnen een dakrand tot 33,35 m, een apparatuurkast op het dak tot 34,6 m en een deur onder aan de zuidoostgevel. Watertoren van circa 1957 naar ontwerp van J.P. Kloos aan de 1e Leijweg in de Amsterdamse Waterleidingduinen. Maten uit AHN, BAG en schuine luchtfoto's; geleding geschat.",
    realWorld: {
      built: "ca. 1957",
      architect: "J.P. Kloos",
      address: "1e Leijweg 4, Vogelenzang",
      ahnGroundNapM: GROUND_NAP,
      ahnRimNapM: 37.35,
      ahnRoofNapM: 37.2,
      ahnAntennaNapM: 42.0,
      acrossFlatsM: A * 2,
      rimM: H.rim,
      roofM: H.roof,
      equipmentM: H.kit,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Noord-Holland (Vogelenzang, Leijweg, ca. 1957, J.P. Kloos)",
      "PDOK BAG-pand 0377100000015288 (bouwjaar 1957, 1e Leijweg 4), AHN DSM/DTM 0,5 m, 2026-11-04",
      "PDOK luchtfoto's 2021, 2022, 2023, 2024 en 2025 (orthoHR, 8 cm): schuin zicht op de zuidwest-, zuid- en zuidoostgevels, hoekribben, dakrand, deur",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0377100000015288 (plat dak NAP +37,2), opgehaald 2026-11-04",
    ],
  },
});

// Watertoren van Breukelen aan de Straatweg 187, ongeveer vijftig meter terug van de straat in het noorden van het dorp.
// Gebouwd in 1927-1928 voor de Stichting Drinkwaterleiding Noord-West Utrecht (DNWU), vermoedelijk naar ontwerp van de
// Bussumse architect J. Gerber, door Schäffer & Co. uit Duisburg; gemeentelijk monument. Dragend metselwerk, sinds de
// restauratie van 1963 met kristalcement bespoten (lichtgrijs), reservoir van 400 m³ (holbodem, 10,2 m doorsnede) boven
// een lekvloer op 26 à 27 m. De onderbouw is achtkant; op twee derde van de hoogte verspringt de toren naar een
// zestienhoekige opbouw met het reservoir. De onderbouw grijpt met kanteelachtige hoeken in die opbouw, terwijl de
// opbouw tussen de kantelen over de onderbouw kraagt. Om het andere vlak loopt een verticale, verdiepte strook tot aan de
// opbouw. Kleine vensters in de schuine vlakken, vensterparen boven de ingang, onder de kraag en onder de dakrand. Entree
// met luifel en gemetselde stoep. Sinds 1963 een zestienzijdig puntdak met bitumineuze bedekking op een steile voet
// boven een smalle kroonlijst (tekening T 07/9 van 1963: muurkroon NAP +38,70, top +43,50).
//
// Oorsprong op het hart van BAG-pand 0311100000007807 (achthoek, gemiddelde van de acht hoekpunten; apothema 5,61 tot
// 5,69, gemiddeld 5,65 m) op maaiveld, AHN-DTM NAP -0,7 (ring van 6 tot 14 m: mediaan -0,70 tot -0,76). +X is de
// normaal van het oostelijke vlak met de ingang (RD 7,43 graden, gemiddelde van de acht vlaknormalen modulo 45 graden):
// daar ligt het BGT-erf van de stoep (2,6 × 4,9 m tegen dat vlak) en komt de oprit van de Straatweg aan.
// Maten: BAG (achthoek), AHN-DSM 0,5 m (dak: helling 0,65 op apothema 1 tot 4,5 m, NAP +40,5 op 4,25 m; top NAP +43,21;
// muur tot circa 5,5 à 5,7 m van het hart), bouwhistorische beschrijving (Vocus 2019, bijlage 12 van het bestemmingsplan
// "Watertoren Breukelen") met de tekeningen van 1927 en 1963 uit Bokma (1996): hoogte van de kraag, de strook, de
// vensters en de luifel uit het vooraanzicht van 1963 (circa 37,8 px/m, geschaald op 43,9 m van maaiveld tot de top), en
// "Breukelen Watertoren 4787.JPG" (Commons, 2007, vanuit het oosten: kantelen, kraag, vensters, luifel en deur).
import { hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [128846.05, 466420.24];
const DEG = 7.43;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = -0.7;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (noord 42,56, west 42,69, zuid 42,50, noordoost
// 42,59), gemeten 2026-11-06; het PDOK-pand begint op 42,29.
const GROUND_ELLIPSOID = 42.5;

// Regelmatige n-hoek met apothema a op hoogte z, met een vlaknormaal op 0 graden (+X).
const ngon = (n, a, z) => {
  const r = a / Math.cos(Math.PI / n);
  return Array.from({ length: n }, (_, k) => {
    const t = (Math.PI * (2 * k + 1)) / n;
    return [r * Math.cos(t), r * Math.sin(t), z];
  });
};
const oct = (a, z) => ngon(8, a, z);
const hex16 = (a, z) => ngon(16, a, z);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));

// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder 56
// graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};

// ---------- hoogtes boven maaiveld (NAP -0,7) ----------
const H = {
  corbel: [27.25, 27.5], // kraag van de zestienhoek over de achtkant (lekvloer NAP +26,83)
  merlon: 28.3, // kantelen van de onderbouw in de opbouw
  cornice: [38.8, 38.9, 39.3], // kroonlijst onder de dakvoet (muurkroon NAP +38,70 in 1963)
  roofFoot: 40.55, // bovenkant van de steile dakvoet
  apex: 43.9, // top (AHN-DSM NAP +43,21)
};
// Apothema's.
const A = {
  foot: 5.65, // achtkant op maaiveld (BAG)
  top: 5.55, // achtkant onder de kraag (licht verjongend, vooraanzicht 1963)
  upper: 5.66, // zestienhoekige opbouw
  corbelFoot: 5.49,
  cornice: 5.76,
  gutter: 5.3,
  roof: 5.05,
};
const octA = (z) => A.foot + ((A.top - A.foot) * z) / H.corbel[1];

// ---------- onderbouw, kantelen, opbouw ----------
const lower = hull([...oct(octA(BASE), BASE), ...oct(octA(H.corbel[1]), H.corbel[1])]);
// Kantelen: de achtkant loopt op de hoeken 0,8 m door in de zestienhoek; zichtbaar is alleen de hoek die buiten de
// zestienhoek steekt (0,35 m bij de hoek, tot 0,7 m langs elk vlak).
const merlonBody = hull([...oct(octA(H.corbel[0]), H.corbel[0]), ...oct(octA(H.merlon), H.merlon)]);
const merlons = merlonBody.intersect(union(around(box(4.0, -0.95, H.corbel[0], 7.0, 0.95, H.merlon), [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5])));
// Opbouw met kraag (0,17 m uitkraging over 0,25 m: 56 graden) en kroonlijst.
const upper = hull([...hex16(A.corbelFoot, H.corbel[0]), ...hex16(A.upper, H.corbel[1]), ...hex16(A.upper, H.cornice[0])]);
const cornice = hull([...hex16(A.upper, H.cornice[0] - 0.01), ...hex16(A.cornice, H.cornice[1]), ...hex16(A.cornice, H.cornice[2])]);

// ---------- dak (zestien vlakken) ----------
const roofFoot = hull([...hex16(A.cornice, H.cornice[2] - 0.01), ...hex16(A.gutter, H.cornice[2]), ...hex16(A.roof, H.roofFoot)]);
const roof = hull([...hex16(A.roof, H.roofFoot - 0.01), [0, 0, H.apex]]);

// ---------- entree: stoep, deur en luifel (vlak +X) ----------
// De luifel staat in het AHN-DSM tot circa 1,3 m voor de gevel op NAP +2,7 à +3,0; het PDOK-terrein legt het erf van de
// stoep (BGT, 2,6 × 4,9 m) tot 0,87 m boven de onderkant van het model. De stoep (gemetseld, met treden; tekening 1963)
// komt daarom tot 0,9 m, met een trede van 0,5 m ervoor, zodat het PDOK-erf er niet doorheen steekt.
const fDoor = octA(0);
const stoep = union([
  box(fDoor - 0.2, -2.0, BASE, fDoor + 1.5, 2.0, 0.9),
  box(fDoor + 1.4, -1.7, BASE, fDoor + 2.2, 1.7, 0.5),
]);
// Luifel van 3,6 m breed en 0,5 m diep, onderzijde onder 48 graden van 3,1 m aan de gevel tot 3,65 m, bovenkant 3,85 m
// (in het echt een vlakke plaat van circa 1,3 m diep; AHN-DSM NAP +2,7 à +3,0).
const canopy = hull([
  [fDoor - 0.05, -1.8, 3.04], [fDoor - 0.05, 1.8, 3.04], [fDoor - 0.05, -1.8, 3.85], [fDoor - 0.05, 1.8, 3.85],
  [fDoor + 0.5, -1.8, 3.65], [fDoor + 0.5, 1.8, 3.65], [fDoor + 0.5, -1.8, 3.85], [fDoor + 0.5, 1.8, 3.85],
]);

// ---------- openingen ----------
const fOct = (z) => octA(z);
const STRIP = [0, 90, 180, 270];
const DIAG = [45, 135, 225, 315];
const openings = union([
  // Verdiepte strook van 1,05 m om het andere vlak, van boven het vensterpaar tot onder de kraag.
  ...around(niche(fOct(26.8), 1.05, 5.6, 26.8, 0.3), STRIP),
  // Vensterpaar (als één nis) boven de luifel en in de schuine vlakken naast de ingang, 4,1 tot 5,1 m.
  niche(fOct(5), 1.5, 4.1, 5.1, 0.3),
  ...around(niche(fOct(5), 1.5, 4.1, 5.1, 0.3), [45, 315]),
  // Kleine trapvensters in de schuine vlakken op 10,4, 16,9 en 23,8 m (tekening 1927; foto 2007).
  ...[10.4, 16.9, 23.8].flatMap((z) => around(niche(fOct(z + 1.1), 0.9, z, z + 1.1, 0.3), DIAG)),
  // Opbouw: vensterparen boven de kraag en onder de kroonlijst op het vlak van de ingang en de achterzijde, smalle
  // vensters op de zijvlakken.
  ...around(niche(A.upper, 1.5, 28.6, 29.7, 0.3), [0, 180]),
  ...around(niche(A.upper, 1.5, 37.6, 38.45, 0.3), [0, 180]),
  ...around(niche(A.upper, 0.9, 28.6, 29.7, 0.3), [90, 270]),
  ...around(niche(A.upper, 0.9, 37.6, 38.45, 0.3), [90, 270]),
]);

const tower = union([lower, merlons, upper, cornice, roofFoot, roof]).subtract(openings);
// Deur (dubbele houten deur) van 2,0 m breed, van de stoep (0,9 m) tot 2,75 m, 0,4 m diep; daarboven een latei tot de
// luifel (anders vormen nisplafond en luifel samen een hangende knik die de export opvult).
const door = niche(fDoor, 2.0, 0.9, 2.75, 0.4);
const building = union([tower, stoep, canopy]).subtract(door);

await writeLandmark({
  slug: "watertoren-breukelen",
  base: BASE,
  nodes: [["building:watertoren-achtkant-kantelen-zestienhoek-en-puntdak", building]],
  catalog: {
    name: "Watertoren Breukelen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, 8], [-8, 0], [0, -8], [5.7, 5.7]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0311100000007807"],
    description:
      "Oorsprong op het hart van het achtkante BAG-pand op maaiveld (NAP -0,7 m), +X de normaal van het oostvlak met de ingang (RD 7,43 graden). Achtkante, licht verjongende onderbouw met verdiepte stroken om het andere vlak, kleine vensters, stoep, deur en luifel; op 27,5 m kraagt de zestienhoekige opbouw over de onderbouw, waarvan de hoeken als kantelen tot 28,3 m doorlopen; vensterparen, kroonlijst tot 39,3 m, steile dakvoet en zestienzijdig puntdak tot 43,9 m. Maten uit BAG, AHN, de tekeningen van 1927 en 1963 en een foto.",
    realWorld: {
      built: "1927-1928",
      architect: "J. Gerber (vermoedelijk)",
      wikipediaHeightM: 44,
      reservoirM3: 400,
      reservoirDiameterM: 10.2,
      drawing1963TopNapM: 43.5,
      drawing1963WallTopNapM: 38.7,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 43.21,
      octagonAcrossFlatsM: [A.foot * 2, A.top * 2],
      upperAcrossFlatsM: A.upper * 2,
      corbelM: H.corbel[1],
      merlonTopM: H.merlon,
      corniceM: H.cornice[2],
      roofFootM: H.roofFoot,
      apexM: H.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Breukelen) (1927-1928, J. Gerber(?), circa 44 m, 400 m³)",
      "https://www.ruimtelijkeplannen.nl/documents/NL.IMRO.1904.PBwatertorenBKL-CC01/b_NL.IMRO.1904.PBwatertorenBKL-CC01_Bijlage12.Monument.pdf (Vocus: gemeentelijk monument, architectonische omschrijving, foto's, tekeningen 1927 en 1963 uit J.G. Bokma, Tijdschrift Historische Kring Breukelen 1996-4)",
      "https://commons.wikimedia.org/wiki/File:Breukelen_Watertoren_4787.JPG (vanuit het oosten, 2007: kantelen, kraag, vensters, luifel en deur)",
      "PDOK BAG-pand 0311100000007807, BGT (erf van de stoep, oprit), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

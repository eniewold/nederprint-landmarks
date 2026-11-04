// Nieuwe watertoren van Sanatorium Zonnestraal in Hilversum (Loosdrechtse Bos), gebouwd in 1926-1928 naar ontwerp van
// J. Duiker en B. Bijvoet, onderdeel van rijksmonument 46771. Geen vrijstaande toren: een betonnen cilinderreservoir
// op een ronde schacht, in de zuidelijke binnenhoek van het hoofdgebouw, tegen de verdieping aan en met de voet op het
// dakterras van de lage voorvleugel. Omdat de toren in hetzelfde BAG-pand ligt als het hoofdgebouw
// (0402100001480421), vervangt dit model het hele hoofdgebouw: anders blijft de PDOK-reconstructie van het pand (met
// een eigen blok op de plek van de toren) door het model heen steken.
//
// Het hoofdgebouw volgens het AHN en de BAG: een kruisvormig blok van twee lagen (dak op 7,62 m boven maaiveld) met
// in het hart een ronde opbouw boven de eetzaal (9,03 m), een lage voorvleugel aan de zuidkant en een lage
// achtervleugel aan de noordkant (één laag, 3,6 m), in het noorden een hoog blok met een ronde glazen trappenhuistoren,
// en een gang naar een laag blok in het noordwesten (3,16 m). Alles met platte daken, dus blokken op een hoogte;
// de gevels krijgen het ritme van Duiker: een gesloten borstwering, een verdiepte glasstrook en een dakrand, per laag.
//
// Lokaal stelsel: oorsprong in het hart van het reservoir (AHN-DSM, cirkel van 4,7 m boven 8,3 m) op maaiveld
// (AHN-DTM NAP +3,3); +X (u) langs de lange gevels van het hoofdgebouw (BAG-randen, gewogen 32,7 graden linksom op
// RD-oost), +Y (v) naar het noordwesten. Alle maten in dat stelsel uit het AHN-DSM 0,25 m en de BAG-contour.
import { hull, union, prism, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [139000.27, 468074.65];
const DEG = 32.7;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 3.3; // AHN-DTM rond het gebouw (3,0 tot 3,35)
const GROUND_ELLIPSOID = 46.5; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, 2026-11-04 (46,50 tot 46,66)

const H = {
  low: 3.62, // dak van de lage vleugels (AHN 3,59 tot 3,64)
  lowNorth: 3.16, // gang en noordwestblok (AHN 3,16)
  high: 7.62, // dak van het kruis, de noordbalk en het noordblok (AHN 7,62)
  drum: 9.03, // ronde opbouw boven de eetzaal (AHN 9,03)
  tank: 9.2, // bovenkant reservoir (AHN 9,2; ventilatiekappen tot 9,6)
  tankBottom: 7.0, // onderkant reservoir (foto: 2,2 m hoog bij 4,4 m doorsnede)
  stair: 5.5, // zuidelijk trappenhuis met afdak (AHN 5,5)
};

// Gevelprofielen als (hoogte, terugsprong) van onder naar boven. Per laag een gesloten borstwering, een glasstrook
// 0,4 tot 0,5 m terug en een plafond onder 45 graden naar de dakrand, zodat niets vrij overhangt.
const ONE_STOREY = (top) => [[BASE, 0], [0.9, 0], [0.9, 0.4], [top - 0.95, 0.4], [top - 0.55, 0], [top, 0]];
const TWO_STOREY = [[BASE, 0], [0.9, 0], [0.9, 0.4], [2.7, 0.4], [3.1, 0], [4.6, 0], [4.6, 0.5], [6.7, 0.5], [7.2, 0], [H.high, 0]];

// Een blok met een gevelprofiel: per segment de hull van twee ringen (rechthoek of cirkel ingekrompen met de terugsprong).
const ring = (shape, inset, z) => shape(inset).map(([x, y]) => [x, y, z]);
const rectShape = (u0, v0, u1, v1) => (d) => [[u0 + d, v0 + d], [u1 - d, v0 + d], [u1 - d, v1 - d], [u0 + d, v1 - d]];
const circleShape = (cu, cv, r, n = 48) => (d) => Array.from({ length: n }, (_, k) => [cu + (r - d) * Math.cos((2 * Math.PI * k) / n), cv + (r - d) * Math.sin((2 * Math.PI * k) / n)]);
const profiled = (shape, profile) => {
  const parts = [];
  for (let i = 0; i + 1 < profile.length; i++) {
    const [za, da] = profile[i], [zb, db] = profile[i + 1];
    if (zb - za < 1e-6) continue;
    parts.push(hull([...ring(shape, da, za), ...ring(shape, db, zb)]));
  }
  return union(parts);
};
const block = (u0, v0, u1, v1, profile) => profiled(rectShape(u0, v0, u1, v1), profile);

// ---------- lage vleugels (één laag) ----------
const south = block(-10.55, -6.65, 22.2, -0.45, ONE_STOREY(H.low)); // voorvleugel met dakterras
const north = block(-13.68, 23.3, 29.42, 30.97, ONE_STOREY(H.low)); // achtervleugel
const northFoot = block(4.22, 29.0, 10.5, 34.03, ONE_STOREY(H.low)); // voet van het trappenhuis
const corridor = block(-9.03, 29.5, -6.17, 41.0, ONE_STOREY(H.lowNorth)); // gang naar het noordwestblok
const northWest = block(-16.75, 39.92, 1.4, 48.7, ONE_STOREY(H.lowNorth));
// Lage bank langs de voorvleugel tussen terras en schacht (AHN 1 tot 2 m, BAG tot v 0,78).
const bench = box(-9.2, -0.6, BASE, -1.2, 0.75, 1.2);

// ---------- het kruis en de noordbalk (twee lagen) ----------
const bar = block(0.1, -5.2, 11.58, 7.0, TWO_STOREY); // zuidarm, naast de toren
const arms = block(-10.65, 5.35, 22.15, 17.2, TWO_STOREY); // dwarsarm
// Noordbalk: de verdieping kraagt uit tot u -0,3 en 11,2 (AHN), de begane grond staat op de BAG-contour (1,25 tot
// 10,7); de kraag loopt onder 45 graden naar binnen.
const northBarUpper = block(-0.3, 15.0, 11.2, 25.0, [[3.6, 0], ...TWO_STOREY.filter(([z]) => z > 3.6)]);
const northBarLower = block(1.25, 15.0, 10.7, 25.0, [[BASE, 0], [0.9, 0], [0.9, 0.4], [1.6, 0.4]]);
const northBarCollar = hull([...ring(rectShape(1.25, 15.0, 10.7, 25.0), 0.4, 1.6), ...ring(rectShape(-0.3, 15.0, 11.2, 25.0), 0, 3.6)]);
// Noordblok met een rond glazen trappenhuis aan de kop (halve cirkel van 3,14 m, AHN tot v 33,4).
const northBlock = block(4.22, 23.3, 10.5, 30.3, TWO_STOREY);
const stairTower = profiled(circleShape(7.36, 30.3, 3.14), TWO_STOREY);

// Ronde opbouw boven de eetzaal: glasstrook rondom en een dakrand.
const DRUM = { u: 5.84, v: 11.27, r: 4.6 };
const drum = profiled(circleShape(DRUM.u, DRUM.v, DRUM.r, 64), [[H.high - 0.5, 0], [H.high, 0], [H.high, 0.35], [8.3, 0.35], [8.65, 0], [H.drum, 0]]);

// Zuidelijk trappenhuis: halfronde glazen toren van 1,4 m straal met een afdak (kraag onder 45 graden).
const STAIR = { u: 1.6, v: -6.5, r: 1.4 };
const southStair = union([
  profiled(circleShape(STAIR.u, STAIR.v, STAIR.r), [[BASE, 0], [0.9, 0], [0.9, 0.3], [4.6, 0.3], [4.9, 0], [H.stair, 0]]),
  hull([...ring(circleShape(STAIR.u, STAIR.v, STAIR.r), 0, 4.9), ...ring(circleShape(STAIR.u, STAIR.v, STAIR.r + 0.3), 0, 5.2), ...ring(circleShape(STAIR.u, STAIR.v, STAIR.r + 0.3), 0, H.stair)]),
]);

// ---------- de watertoren ----------
// Ronde schacht van 2,2 m (foto: 0,44 van het reservoir) van het maaiveld door het terras; reservoir van 4,4 m
// doorsnede (AHN 4,7 inclusief rand) en 2,2 m hoog met een plat dak. De vlakke onderkant van het reservoir krijgt een
// kraag onder 45 graden naar de schacht, zodat hij op 1:1000 zonder steun print.
const SHAFT_R = 1.1;
const TANK_R = 2.2;
const circle3 = (r, z, n = 64) => Array.from({ length: n }, (_, k) => [r * Math.cos((2 * Math.PI * k) / n), r * Math.sin((2 * Math.PI * k) / n), z]);
const tower = union([
  hull([...circle3(SHAFT_R, BASE), ...circle3(SHAFT_R, H.tankBottom - (TANK_R - SHAFT_R))]),
  hull([...circle3(SHAFT_R, H.tankBottom - (TANK_R - SHAFT_R)), ...circle3(TANK_R, H.tankBottom), ...circle3(TANK_R, H.tank)]),
]);

const building = union([south, north, northFoot, corridor, northWest, bench, bar, arms, northBarUpper, northBarLower, northBarCollar, northBlock, stairTower, drum, southStair, tower]);

await writeLandmark({
  slug: "watertoren-hilversum-nieuwe-watertoren",
  base: BASE,
  nodes: [["building:hoofdgebouw-zonnestraal-met-watertoren", building]],
  catalog: {
    name: "Nieuwe watertoren Hilversum",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-3, -9], [12, -9], [25, -4], [-13, 10], [25, 11], [14, 20], [-3, 20], [32, 27], [-16, 27], [14, 36], [-12, 36], [-19, 44], [4, 44], [-8, 51]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte rond het gebouw.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0402100001480421"],
    description:
      "Oorsprong in het hart van het reservoir op maaiveld (NAP +3,3 m), +X langs de lange gevels van het hoofdgebouw (RD 32,7 graden). Watertoren van Zonnestraal (Duiker en Bijvoet, 1926-1928): cilinderreservoir van 4,4 m tot 9,2 m op een ronde schacht in de zuidelijke binnenhoek, met het hele hoofdgebouw van hetzelfde BAG-pand: kruis van twee lagen tot 7,62 m met ronde opbouw tot 9,03 m, lage voor- en achtervleugels, noordblok met rond trappenhuis, zuidelijk trappenhuis met afdak; gevels met borstwering, verdiepte glasstrook en dakrand per laag. Maten uit AHN, BAG en foto's.",
    realWorld: {
      built: "1926-1928",
      architects: "J. Duiker en B. Bijvoet",
      monument: 46771,
      ahnGroundNapM: GROUND_NAP,
      tankTopM: H.tank,
      tankBottomM: H.tankBottom,
      tankDiameterM: TANK_R * 2,
      shaftDiameterM: SHAFT_R * 2,
      lowRoofM: H.low,
      highRoofM: H.high,
      drumM: H.drum,
      drumDiameterM: DRUM.r * 2,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Hilversum) (Duiker en Bijvoet, 1927, voor Sanatorium Zonnestraal)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/46771 (Sanatorium Zonnestraal, hoofdgebouw)",
      "https://commons.wikimedia.org/wiki/File:Hoofdgebouw,_waterreservoir_-_Hilversum_-_20372212_-_RCE.jpg en File:Rijksmonument_46771_Sanatorium_Zonnestraal_Hilversum_03.JPG (reservoir op de schacht vanaf het terras)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_achtergevel,_na_restauratie_-_Hilversum_-_20349385_-_RCE.jpg, File:Rijksmonument_46771_Sanatorium_Zonnestraal_Hilversum_19.JPG en File:Zonstrhoofd02achter.jpg (gevels, glasstroken, trappenhuizen)",
      "PDOK BAG-pand 0402100001480421, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});

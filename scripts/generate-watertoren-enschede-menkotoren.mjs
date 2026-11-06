// Watertoren van Menko (Menkotoren) in Enschede, wijk Roombeek, aan de Bosuilstraat. Gebouwd in 1912 als deel van de
// spinnerij, weverij en ververij van N.J. Menko; de toren voorzag het fabriekscomplex van water. Van het complex staan
// alleen het opslaggebouw met de watertoren en enkele delen nog overeind. Beschadigd bij de vuurwerkramp van 2000,
// daarna gerestaureerd en, met het opslaggebouw, verbouwd tot woningen (BAG-pand 0153100000286271, BAG-bouwjaar 2007 na
// de verbouwing). Hoogte en reservoirinhoud zijn onbekend (Wikipedia).
//
// Vorm (Commons-foto's "Menko Building.JPG", "Menko building, tower.JPG", "Enschede - 2021 - Menko.jpg" en "Roombeek
// Enschede - 4034724764.jpg", luchtfoto, AHN en 3D BAG): een vierkant bakstenen opslaggebouw van vier verdiepingen met
// grote fabrieksvensters in paren tussen penanten, een lichte kroonlijst en een glazen penthouse met overstekend dak; aan
// de zuidkant een lagere vleugel, aan de westkant (de vijver) een glazen aanbouw met zes witte lessenaarsdaken in een
// zaagtand. In de zuidgevel, gelijk met de gevel, de vierkante bakstenen schacht van de watertoren met een venster per
// zijde boven het dak; daarop een witte betonnen plaat op acht gebogen consoles (twee per hoek), en daarop de bredere
// vierkante reservoirbak met hoeklisenen, een venster per zijde, de tegelfries "N.J. MENKO." en een metselwerklijst.
//
// Oorsprong op het hart van de toren (RD 258141,0 472752,0) op maaiveld NAP +40,67 (3D BAG; AHN-DTM rond het gebouw 40,7
// tot 41,6, aan de noordkant 0,8 m hoger). +X wijst naar RD-richting -5,2 graden (oost), +Y naar 84,8 graden (noord): de
// gevels van het BAG-pand en de reservoirbak in het AHN-DSM lopen evenwijdig aan dit stelsel.
// Hoogtes uit het AHN-DSM 0,5 m in dit stelsel: dakterras van het opslaggebouw NAP +54,8 (14,1 m; 3D BAG 50p 54,81),
// penthouse NAP +57,7 (17,0 m), reservoirbak NAP +63,5 (22,8 m; 3D BAG max 63,51), zuidvleugel 6,0 tot 7,2 m, laag deel
// 3,3 m, glazen aanbouw 6,0 tot 7,3 m. Breedte van de bak 7,2 × 6,4 m uit de luchtfoto (dakrand, 0,08 m/px, scheefstand
// 0,37 m per m hoogte verrekend) en het DSM; de geledingen van de toren (consoles, plaat) uit de foto's.
import { hull, union, prism, box, rect, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [258141.0, 472752.0];
const AXIS_DEG = -5.2;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 40.67;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 84,24 en 84,27, zuid 84,32, west 84,44),
// gemeten 2026-11-06. Aan de noordkant ligt het PDOK-terrein 0,8 m hoger (85,05); daar staat geen punt.
const GROUND_ELLIPSOID = 84.24;

const deg = (a) => (a * Math.PI) / 180;
// Punt in het stelsel van een gevel met normaal onder hoek a (graden, linksom vanaf +X) door punt p: o langs de normaal,
// s langs de gevel (linksom positief).
const frame = (a, p = [0, 0]) => {
  const n = [Math.cos(deg(a)), Math.sin(deg(a))];
  const t = [-n[1], n[0]];
  return (o, s, z) => [p[0] + n[0] * o + t[0] * s, p[1] + n[1] * o + t[1] * s, z];
};
// Blinde nis in een gevel (normaal a, door p), gecentreerd op s = u, breedte w, van z0 tot z1, diepte depth. Het plafond
// loopt onder 56 graden (rise 1,5) de muur in; buiten de gevel loopt de snede schuin omlaag, zodat lijsten erboven heel blijven.
const niche = (a, p, u, w, z0, z1, depth = 0.3, rise = 1.5) => {
  const at = frame(a, p);
  const zb = Math.max(z0, z1 - 1.5);
  return hull([-w / 2, w / 2].flatMap((s) => [
    at(-depth, u + s, z0), at(1.0, u + s, z0), at(-depth, u + s, z1 + rise * depth), at(0, u + s, z1), at(1.0, u + s, zb),
  ]));
};
// Rechthoek u0..u1 × v0..v1 als ring op hoogte z.
const ringAt = (u0, v0, u1, v1, z) => rect(u0, v0, u1, v1).map(([x, y]) => [x, y, z]);
// Dakvlak z = a u + b v + c boven een veelhoek (planvergelijking).
const roofPlane = (poly, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, 40).trimByPlane([a / n, b / n, -1 / n], -c / n);
};

// ---------- maten (meters, hoogtes boven maaiveld NAP +40,67) ----------
// Opslaggebouw (BAG-gevels in het stelsel): u -8,2 tot 11,2, v -2,4 tot 18,6.
const MAIN = { u0: -8.2, u1: 11.2, v0: -2.4, v1: 18.6, roof: 14.1, cornice: [13.1, 13.4], corniceOut: 0.25 };
const PENT = { u0: -5.5, u1: 8.5, v0: 2.4, v1: 16.0, wall: 16.25, top: 17.0, eave: 0.5 };
const T = {
  shaft: [2.8, 2.4], // halve breedtes van de schacht (5,6 × 4,8 m), zuidgevel gelijk met het opslaggebouw
  soffit: 16.3, // onderkant van de schuine onderzijde van de plaat aan de schacht
  slab: [18.0, 18.45], // witte betonnen plaat
  slabHalf: [3.9, 3.5],
  box: [3.6, 3.2], // reservoirbak 7,2 × 6,4 m (luchtfoto en DSM)
  top: 22.8, // NAP +63,5
  frieze: [22.15, 22.35], // metselwerklijst: 0,15 m uit, onderkant onder 53 graden
  bracket: { w: 0.9, foot: 15.3, tip: 17.5 },
};
// Vier verdiepingen: vensters van 1,8 m hoog, borstwering op 1,0 + 3,3 k.
const FLOORS = [0, 1, 2, 3].map((k) => [1.0 + 3.3 * k, 2.8 + 3.3 * k]);

// ---------- opslaggebouw ----------
const mainBlock = union([
  box(MAIN.u0, MAIN.v0, BASE, MAIN.u1, MAIN.v1, MAIN.cornice[0] + 0.01),
  // Kroonlijst met een onderkant van 50 graden, 0,25 m uit, tot het dakterras.
  hull([
    ...ringAt(MAIN.u0, MAIN.v0, MAIN.u1, MAIN.v1, MAIN.cornice[0]),
    ...ringAt(MAIN.u0 - MAIN.corniceOut, MAIN.v0 - MAIN.corniceOut, MAIN.u1 + MAIN.corniceOut, MAIN.v1 + MAIN.corniceOut, MAIN.cornice[1]),
    ...ringAt(MAIN.u0 - MAIN.corniceOut, MAIN.v0 - MAIN.corniceOut, MAIN.u1 + MAIN.corniceOut, MAIN.v1 + MAIN.corniceOut, MAIN.roof),
  ]),
]);
// Vensters in paren (1,4 m breed, 0,4 m penant ertussen), vijf paren per gevel van 20 tot 21 m; in de zuidgevel naast de
// toren een paar links en twee rechts.
const pairCentres = (s0, s1, n) => Array.from({ length: n }, (_, k) => s0 + ((k + 0.5) * (s1 - s0)) / n);
const pair = (a, p, c, z0, z1) => [-0.9, 0.9].map((d) => niche(a, p, c + d, 1.4, z0, z1));
const vMid = (MAIN.v0 + MAIN.v1) / 2;
const uMid = (MAIN.u0 + MAIN.u1) / 2;
// Achter de glazen aanbouw (west, tot 7,3 m) en de zuidvleugel (tot 7,2 m) blijven de onderste twee verdiepingen dicht;
// alleen het oostelijke paar in de zuidgevel heeft boven de lage vleugel (3,3 m) ook een venster op de eerste verdieping.
const mainWindows = FLOORS.flatMap(([z0, z1], k) => [
  // West (normaal -X, s loopt naar -Y): s = -(v - vMid).
  ...(k < 2 ? [] : pairCentres(MAIN.v0, MAIN.v1, 5).flatMap((v) => pair(180, [MAIN.u0, vMid], -(v - vMid), z0, z1))),
  // Oost (normaal +X, s naar +Y).
  ...pairCentres(MAIN.v0, MAIN.v1, 5).flatMap((v) => pair(0, [MAIN.u1, vMid], v - vMid, z0, z1)),
  // Noord (normaal +Y, s naar -X).
  ...pairCentres(MAIN.u0, MAIN.u1, 5).flatMap((u) => pair(90, [uMid, MAIN.v1], -(u - uMid), z0, z1)),
  // Zuid (normaal -Y, s naar +X), naast de toren.
  ...(k === 0 ? [] : k === 1 ? [8.6] : [-5.5, 5.0, 8.6]).flatMap((u) => pair(270, [0, MAIN.v0], u, z0, z1)),
  // Toren in de zuidgevel: één venster van 1,6 m per verdieping boven de vleugel.
  ...(k < 2 ? [] : [niche(270, [0, MAIN.v0], 0, 1.6, z0, z1)]),
]);
// De schacht van de toren loopt in het opslaggebouw tot het maaiveld door; zijn zuidgevel ligt in de gevel.
const storehouse = union([mainBlock, box(-T.shaft[0], -T.shaft[1], BASE, T.shaft[0], T.shaft[1], MAIN.roof)]).subtract(union(mainWindows));

// Penthouse: wanden tot 16,25 m, glas tussen stijlen als nissen van 0,2 m, dak met 0,5 m overstek (onderkant 50 graden)
// tot 17,0 m (AHN NAP +57,7).
const penthouse = union([
  box(PENT.u0, PENT.v0, MAIN.roof - 0.05, PENT.u1, PENT.v1, PENT.wall + 0.01),
  hull([
    ...ringAt(PENT.u0, PENT.v0, PENT.u1, PENT.v1, PENT.wall),
    ...ringAt(PENT.u0 - PENT.eave, PENT.v0 - PENT.eave, PENT.u1 + PENT.eave, PENT.v1 + PENT.eave, PENT.wall + 1.2 * PENT.eave),
    ...ringAt(PENT.u0 - PENT.eave, PENT.v0 - PENT.eave, PENT.u1 + PENT.eave, PENT.v1 + PENT.eave, PENT.top),
  ]),
]).subtract(union([
  ...pairCentres(PENT.v0 + 0.5, PENT.v1, 6).map((v) => niche(180, [PENT.u0, 0], -v, 1.6, 14.4, 15.9, 0.2)),
  ...pairCentres(PENT.v0 + 0.5, PENT.v1, 6).map((v) => niche(0, [PENT.u1, 0], v, 1.6, 14.4, 15.9, 0.2)),
  ...pairCentres(PENT.u0, PENT.u1, 6).map((u) => niche(90, [0, PENT.v1], -u, 1.6, 14.4, 15.9, 0.2)),
]));

// ---------- zuidvleugel ----------
// Hoge deel u -15,74 tot 5,62: lessenaarsdak van 6,0 m aan de zuidgevel tot 7,2 m op v -4,7, daarna vlak tot het
// opslaggebouw (AHN-DSM); oostelijk deel u 5,62 tot 8,3 plat op 3,3 m.
const WING = { u0: -15.74, u1: 5.62, v0: -7.2, low: 6.0, high: 7.2, knee: -4.7 };
const wing = union([
  hull([
    ...ringAt(WING.u0, WING.v0, WING.u1, WING.knee, BASE),
    [WING.u0, WING.v0, WING.low], [WING.u1, WING.v0, WING.low],
    [WING.u0, WING.knee, WING.high], [WING.u1, WING.knee, WING.high],
  ]),
  box(MAIN.u0, WING.knee - 0.01, BASE, WING.u1, MAIN.v0 + 0.1, WING.high),
  box(WING.u1 - 0.01, WING.v0, BASE, 8.3, MAIN.v0 + 0.1, 3.3),
]).subtract(union([
  // Vensters in de zuidgevel van de vleugel (begane grond en verdieping).
  ...[-13.5, -9.5, -5.5, -1.5, 2.5].flatMap((u) => [niche(270, [0, WING.v0], u, 1.6, 1.0, 2.8), niche(270, [0, WING.v0], u, 1.6, 3.6, 5.0)]),
  niche(270, [0, WING.v0], 7.0, 1.4, 0.4, 2.6),
]));

// ---------- glazen aanbouw aan de westkant ----------
// Trapezium uit het BAG-pand: oostzijde tegen het opslaggebouw (u -8,2), westzijde schuin van (-19,16; -4,71) naar
// (-10,87; 15,26). Zes lessenaarsdaken in een zaagtand, elk van 5,9 m aan de zuidkant tot 7,3 m aan de noordkant.
const ANNEX = { v0: -4.71, v1: 15.26, low: 5.9, high: 7.3, n: 6 };
const westU = (v) => -19.16 + ((v - ANNEX.v0) * (19.16 - 10.87)) / (ANNEX.v1 - ANNEX.v0);
const annexUnits = Array.from({ length: ANNEX.n }, (_, k) => {
  const v0 = ANNEX.v0 + ((ANNEX.v1 - ANNEX.v0) * k) / ANNEX.n;
  const v1 = ANNEX.v0 + ((ANNEX.v1 - ANNEX.v0) * (k + 1)) / ANNEX.n;
  const poly = [[westU(v0), v0], [MAIN.u0 + 0.1, v0], [MAIN.u0 + 0.1, v1], [westU(v1), v1]];
  const b = (ANNEX.high - ANNEX.low) / (v1 - v0);
  return roofPlane(poly, 0, b, ANNEX.low - b * v0);
});
// Glaspuien tussen stijlen als ondiepe nissen in de schuine westgevel.
const annexFace = Math.atan2(19.16 - 10.87, -(ANNEX.v1 - ANNEX.v0)) * (180 / Math.PI); // normaal naar buiten (157 graden)
const annexLen = Math.hypot(19.16 - 10.87, ANNEX.v1 - ANNEX.v0);
const annexMid = [westU((ANNEX.v0 + ANNEX.v1) / 2), (ANNEX.v0 + ANNEX.v1) / 2];
const annex = union(annexUnits).subtract(union(
  pairCentres(-annexLen / 2, annexLen / 2, 6).map((s) => niche(annexFace, annexMid, s, 2.4, 0.6, 5.0, 0.2)),
));

// ---------- watertoren ----------
const [sx, sy] = T.shaft;
const [lx, ly] = T.slabHalf;
const [bx, by] = T.box;
// Boven het dakterras; eronder zit de schacht in het opslaggebouw.
const shaft = box(-sx, -sy, MAIN.roof - 0.5, sx, sy, T.soffit + 0.01);
// Schuine onderkant van de plaat (56 graden over de zijden, 46 graden over de hoeken) en de plaat zelf.
const slab = hull([
  ...ringAt(-sx, -sy, sx, sy, T.soffit),
  ...ringAt(-lx, -ly, lx, ly, T.slab[0]),
  ...ringAt(-lx, -ly, lx, ly, T.slab[1]),
]);
// Acht consoles, twee per hoek, 0,9 m breed, onderkant onder 63 graden van 15,3 m aan de schacht tot 17,5 m aan de
// rand van de plaat.
const bracket = (a, half, out, s) => {
  const at = frame(a);
  const { w, foot, tip } = T.bracket;
  return hull([-w / 2, w / 2].flatMap((d) => [
    at(half - 0.2, s + d, foot), at(half - 0.2, s + d, T.slab[0] + 0.05),
    at(out, s + d, tip), at(out, s + d, T.slab[0] + 0.05),
  ]));
};
const brackets = [
  ...[-1, 1].map((k) => bracket(0, sx, lx, k * (sy - 0.45))),
  ...[-1, 1].map((k) => bracket(180, sx, lx, k * (sy - 0.45))),
  ...[-1, 1].map((k) => bracket(90, sy, ly, k * (sx - 0.45))),
  ...[-1, 1].map((k) => bracket(270, sy, ly, k * (sx - 0.45))),
];
const tank = union([
  box(-bx, -by, T.slab[1] - 0.01, bx, by, T.frieze[0] + 0.01),
  hull([
    ...ringAt(-bx, -by, bx, by, T.frieze[0]),
    ...ringAt(-bx - 0.15, -by - 0.15, bx + 0.15, by + 0.15, T.frieze[1]),
    ...ringAt(-bx - 0.15, -by - 0.15, bx + 0.15, by + 0.15, T.top),
  ]),
]);
// Bak: per zijde een verdiept veld van 0,15 m tussen hoeklisenen van 0,9 m (18,8 tot 21,9 m, met de tegelfries) en een
// venster van 1,3 m (19,3 tot 20,7 m). Schacht: per vrije zijde een venster van 1,6 m net boven het dakterras, met een
// plafond van 66 graden (onder 56 graden vulde de export een randje op tussen de consoles).
const tankFaces = [[0, bx, by], [180, bx, by], [90, by, bx], [270, by, bx]];
const towerOpenings = union([
  ...tankFaces.map(([a, f, half]) => niche(a, frame(a)(f, 0, 0).slice(0, 2), 0, 2 * (half - 0.9), 18.8, 21.6, 0.15)),
  ...tankFaces.map(([a, f]) => niche(a, frame(a)(f - 0.15, 0, 0).slice(0, 2), 0, 1.3, 19.3, 20.7, 0.3)),
  ...[[0, sx], [180, sx], [270, sy]].map(([a, f]) => niche(a, frame(a)(f, 0, 0).slice(0, 2), 0, 1.6, 14.55, 15.5, 0.3, 2.2)),
]);
const tower = union([shaft, slab, ...brackets, tank]).subtract(towerOpenings);

const building = union([storehouse, penthouse, wing, annex, tower]);

await writeLandmark({
  slug: "watertoren-enschede-menkotoren",
  base: BASE,
  nodes: [["building:menko-opslaggebouw-met-watertoren-penthouse-vleugel-en-glazen-aanbouw", building]],
  catalog: {
    name: "Watertoren Enschede (Menkotoren)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[13, 8], [13, 0], [0, -9.5], [-17, 5]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0153100000286271"],
    description:
      "Oorsprong op het hart van de watertoren in de zuidgevel van het Menko-opslaggebouw, op maaiveld NAP +40,67 m, +X naar RD-richting -5,2 graden (oost), +Y naar 84,8 graden (noord). Het hele BAG-pand: opslaggebouw van vier verdiepingen met vensterparen en kroonlijst tot 14,1 m, glazen penthouse tot 17,0 m, zuidvleugel met lessenaarsdak tot 7,2 m, glazen aanbouw aan de westkant met zes lessenaarsdaken tot 7,3 m; de vierkante schacht van de toren (5,6 × 4,8 m) met vensters, een plaat op acht consoles op 18,0 m en de reservoirbak van 7,2 × 6,4 m met verdiepte velden en vensters tot 22,8 m (NAP +63,5). Maten uit BAG, AHN, 3D BAG, luchtfoto en foto's.",
    realWorld: {
      built: 1912,
      owner: "N.J. Menko (textielfabriek)",
      reservoirM3: null,
      publishedHeightM: null,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofTerraceNapM: 54.8,
      ahnPenthouseNapM: 57.7,
      ahnTopNapM: 63.5,
      bag3dMaxNapM: 63.51,
      storehouseM: [MAIN.u1 - MAIN.u0, MAIN.v1 - MAIN.v0, MAIN.roof],
      shaftM: [2 * sx, 2 * sy],
      tankM: [2 * bx, 2 * by],
      slabM: T.slab,
      topM: T.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Enschede_Menkotoren) (1912, Menko-complex, Bosuilstraat, Roombeek, woningen, hoogte en inhoud onbekend)",
      "https://commons.wikimedia.org/wiki/File:Menko_Building.JPG en File:Roombeek_Enschede_-_4034724764.jpg (vanaf de vijver: opslaggebouw, penthouse, glazen aanbouw, toren)",
      "https://commons.wikimedia.org/wiki/File:Menko_building,_tower.JPG (schacht, plaat op consoles, reservoirbak met hoeklisenen, vensters en tegelfries)",
      "https://commons.wikimedia.org/wiki/File:Enschede_-_2021_-_Menko.jpg (2021, R. Broekhuijzen, CC BY-SA 4.0)",
      "PDOK BAG-pand 0153100000286271, AHN DSM/DTM 0,5 m, luchtfoto en PDOK-terrein, 2026-11-06",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0153100000286271: maaiveld 40,67, dak 50p 54,81, max 63,51, opgehaald 2026-11-06",
    ],
  },
});

// Watertoren van Rimburg (Ubach over Worms, Landgraaf), 1925-1926 gebouwd door
// de steenkolenmijn Laura en Vereeniging naar ontwerp van het eigen bouwbureau,
// 35,7 m, reservoir 200 m³, rijksmonument 521662. Sinds de verbouwing door
// architectenbureau Ton Vandenbergh uitkijktoren met een brasserie ernaast.
// Verjongende achthoekige betonnen schacht met witte hoeklisenen en banden om
// de vijf meter en bakstenen vakken, een bredere achthoekige reservoirkop op
// acht consoles met een smal hoog venster per vlak, een achtzijdig tentdak, en
// de cortenstalen uitbouw: een balkon naar het zuidoosten en aan de
// noordwestkant een trap die van een glazen deur in de kop naar een bordes
// afdaalt en daarnaast terug naar de schacht. Die trap staat niet in het AHN
// (alleen het balkon); hij komt uit de luchtfoto en foto's.
// Oorsprong op het hart van de kop in het AHN (de BAG-contour is de kop, 0,8 m
// naar het noordwesten verschoven) op maaiveld (NAP +125,75 m, de lage
// zuidwestkant van de voet; de noordoostkant ligt 0,45 m hoger). +X wijst naar het oostvlak op 8 graden linksom van
// RD-oost; de vlakken staan op 0, 45, ... graden. Hoogtes uit de foto
// "Water tower (Rimburg) 06" (32,8 px/m, geschaald op de dakvoet in het AHN),
// breedtes uit AHN en luchtfoto, verhoudingen van kop en schacht uit drie foto's.
import { Manifold, CrossSection, hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [202957.5, 324501.25];
const AXIS = [0.9903, 0.1392]; // 8 graden
const BASE = -0.5; // de voet staat op de lage zuidwestkant; aan de noordoostkant ligt het maaiveld 0,45 m hoger
const H = {
  plinth: 0.3, // betonnen voet onder de onderste vakken
  bands: [5, 10, 15, 20, 25], // onderkant van de witte banden van 0,4 m
  band: 0.4,
  ring: 26.8, // onderkant van de betonnen ring onder de kop
  ringTop: 27.5,
  cornice: 32.9, // onderkant van de dakrand
  eave: 33.35, // dakvoet (AHN)
  apex: 35.7, // top van het tentdak (AHN, Wikipedia 35,7 m)
};
const A = { foot: 3.85, top: 3.25, head: 4.25, ring: 4.35 }; // apothema's (halve breedte over de vlakken)
const RECESS = 0.15; // bakstenen vakken achter de lisenen en banden
const LISENE = 0.4; // breedte van een hoeklisene per vlak

const oct = (a, z) => ring3(circle([0, 0], a / Math.cos(Math.PI / 8), 8, Math.PI / 8), z);
const prismOct = (a, z0, z1) => hull([...oct(a, z0), ...oct(a, z1)]);
const apo = (z) => A.foot + ((z - 0) / (H.ring - 0)) * (A.top - A.foot);

// ---------- schacht, kop en dak ----------
const shaft = hull([...oct(apo(BASE), BASE), ...oct(apo(H.ringTop), H.ringTop)]);
const ring = prismOct(A.ring, H.ring, H.ringTop);
const head = prismOct(A.head, H.ringTop - 0.05, H.cornice);
// Dakrand met een schuine onderkant (56 graden), dan het tentdak.
const cornice = hull([...oct(A.head, H.cornice - 0.15), ...oct(A.ring, H.cornice), ...oct(A.ring, H.eave)]);
const roof = hull([...oct(A.ring, H.eave - 0.05), [0, 0, H.apex]]);

// Acht consoles op de hoeken onder de ring: 0,6 m breed, onderkant onder 56 graden
// van de hoek van de schacht naar de hoek van de ring.
const rc = (a) => a / Math.cos(Math.PI / 8);
const consoleZ = H.ring - 0.3 - (rc(A.ring) - 0.05 - rc(apo(25))) * 1.4826;
const bracket = hull(
  [-0.3, 0.3].flatMap((t) => [
    [3.1, t, consoleZ - (rc(apo(25)) - 3.1) * 1.4826],
    [rc(A.ring) - 0.05, t, H.ring - 0.3],
    [rc(A.ring) - 0.05, t, H.ring + 0.1],
    [3.1, t, H.ring + 0.1],
  ]),
);
const consoles = union(Array.from({ length: 8 }, (_, k) => place(bracket, { deg: 22.5 + k * 45 })));

// ---------- vakken, vensters en deur ----------
// Nis in het vlak met normaal +X, dat op hoogte z op apothema f(z) staat; het
// plafond loopt naar binnen onder 56 graden op (de export vult het niet op).
const niche = (f, hw, z0, z1, depth) => {
  const za = z1 + 1.5 * depth;
  const pts = [];
  for (const s of [-1, 1]) {
    pts.push([f(z0) - depth, s * hw(z0), z0], [f(z0) + 1, s * hw(z0), z0]);
    pts.push([f(za) - depth, s * hw(z1), za], [f(z1), s * hw(z1), z1], [f(z1) + 1, s * hw(z1), z1 - 1.5]);
  }
  return hull(pts);
};
const T = Math.tan(Math.PI / 8);
const panelHw = (f) => (z) => f(z) * T - LISENE;
const fixed = (w) => () => w / 2;
const headApo = () => A.head;
const storeys = [
  [H.plinth, H.bands[0]],
  ...H.bands.map((z, k) => [z + H.band, k + 1 < H.bands.length ? H.bands[k + 1] : H.ring]),
];
const FACES = Array.from({ length: 8 }, (_, k) => k * 45);
// Kleine vensters per verdieping, op wisselende vlakken (zoals op de foto's de trap volgen).
const WINDOWS = { 7.5: [90, 270], 12.5: [135, 315], 17.5: [45, 225], 22.5: [90, 0, 180] };
const DOOR = 45; // ingang naar het terras van de brasserie (noordoosten)
const STAIR_DOOR = 135; // glazen deur naar de trap (noordwesten)
const cuts = [
  // Bakstenen vakken tussen lisenen en banden, in de schacht en in de kop.
  ...FACES.flatMap((deg) => storeys.map(([z0, z1]) => place(niche(apo, panelHw(apo), z0, z1 - 1.5 * RECESS, RECESS), { deg }))),
  ...FACES.map((deg) => place(niche(headApo, panelHw(headApo), H.ringTop, H.cornice - 0.15 - 1.5 * RECESS, RECESS), { deg })),
  // Kleine vensters in de schacht.
  ...Object.entries(WINDOWS).flatMap(([z, faces]) => faces.map((deg) => place(niche(apo, fixed(0.6), +z - 0.5, +z + 0.5, RECESS + 0.2), { deg }))),
  place(niche(apo, fixed(1.2), -0.1, 2.4, RECESS + 0.25), { deg: DOOR }),
  // Hoge smalle vensters in de kop, op het noordwesten de glazen deur naar de trap.
  ...FACES.filter((deg) => deg !== STAIR_DOOR).map((deg) => place(niche(headApo, fixed(0.6), 29.6, 31.4, RECESS + 0.15), { deg })),
  place(niche(headApo, fixed(1.6), 29.6, 32.3, RECESS + 0.15), { deg: STAIR_DOOR }),
];
const tower = union([shaft, ring, head, cornice, roof, consoles]).subtract(union(cuts));

// ---------- cortenstalen uitbouw ----------
// Stelsel (u, p) met u langs een richting uit het hart en p 90 graden rechtsom daarvan.
const local = (deg) => {
  const t = (deg * Math.PI) / 180, ux = [Math.cos(t), Math.sin(t)], px = [Math.sin(t), -Math.cos(t)];
  return (u, p, z) => [u * ux[0] + p * px[0], u * ux[1] + p * px[1], z];
};
// Balkon naar het zuidoosten: 2,0 m breed, 2,6 m uit het vlak, bovenkant 29,45 (AHN).
const se = local(-45);
const balcony = hull([3.6, 6.85].flatMap((u) => [-1, 1].flatMap((p) => [se(u, p, 27.6), se(u, p, 29.45)])));
// Trap naar het noordwesten (u langs 135 graden): bovenste trap van de deur (bovenkant
// 29,3 op het vlak) naar het bordes (bovenkant 26,3, 41 graden), bordes van 2,8 bij
// 5,3 m, en daarnaast de onderste trap (30 graden) terug tot in de schacht op 18 tot 20 m.
const nw = local(135);
const U = { door: A.head, landing: 7.6, end: 10.4 };
const upperTop = (u) => 29.3 - ((u - U.door) * 3.0) / (U.landing - U.door);
const lowerTop = (u) => 24.3 - (U.landing - u) * Math.tan(Math.PI / 6);
const flight = (u0, u1, p0, p1, top, thick) =>
  hull([u0, u1].flatMap((u) => [p0, p1].flatMap((p) => [nw(u, p, top(u)), nw(u, p, top(u) - thick)])));
const upperFlight = flight(3.6, U.landing + 0.3, -0.2, 2.0, upperTop, 1.8);
const landing = hull([U.landing, U.end].flatMap((u) => [-3.3, 2.0].flatMap((p) => [nw(u, p, 23.9), nw(u, p, 26.3)])));
const lowerFlight = flight(0, 8.0, -3.3, -1.1, lowerTop, 1.6);

const building = union([tower, balcony, upperFlight, landing, lowerFlight]);

await writeLandmark({
  slug: "watertoren-rimburg",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-kop-tentdak-en-cortenstalen-trap", building]],
  catalog: {
    name: "Watertoren Rimburg",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundHeight: 171.51, // NAP 125,75 + 45,76 (NLGEO2018-geoïde op de oorsprong)
    groundSamplePoints: [[5.7, 0], [4.03, 4.03], [0, 5.7], [-4.03, 4.03], [-5.7, 0], [-4.03, -4.03], [0, -5.7], [4.03, -4.03]],
    replacesBuildings: ["NL.IMBAG.Pand.0882100000000477"],
    description:
      "Oorsprong op het hart van de kop in het AHN op maaiveld (NAP +125,75 m, lage zuidwestkant), +X naar het oostvlak op 8 graden. Verjongende achthoekige schacht (7,7 m over de vlakken aan de voet, 6,5 m op 26,8 m) met hoeklisenen, banden om de 5 m, bakstenen vakken, kleine vensters en een deur naar het noordoosten; reservoirkop van 8,5 m van 26,8 tot 33,35 m op acht consoles met een hoog venster per vlak; achtzijdig tentdak tot 35,7 m; cortenstalen balkon naar het zuidoosten en trap met bordes naar het noordwesten. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 35.7,
      reservoirM3: 200,
      ahnGroundNapM: 125.75,
      ahnGroundRangeNapM: [125.65, 126.1],
      ahnTopNapM: 161.45,
      geoidNlgeo2018M: 45.76,
      footAcrossFlatsM: 7.7,
      shaftTopAcrossFlatsM: 6.5,
      headAcrossFlatsM: 8.5,
      corniceAcrossFlatsM: 8.7,
      ringM: 26.8,
      eaveM: 33.35,
      modelTopM: 35.7,
      bandsM: [5, 10, 15, 20, 25],
      balconyTopM: 29.45,
      stairLandingM: [23.9, 26.3],
      stairLandingOutM: 10.4,
      photoScalePxPerM: 32.8,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Rimburg)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/521662",
      "https://commons.wikimedia.org/wiki/File:Water_tower_(Rimburg)_Watertoren_(Rimburg)_06.jpg (hoogtes, trap en balkon, van het noorden)",
      "https://commons.wikimedia.org/wiki/File:Rimburg_-_Watertoren.jpg (consoles, vensters, trap)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Rimburg.jpg (verhoudingen van kop en schacht, van ver)",
      "https://commons.wikimedia.org/wiki/File:Landgraaf_Watertoren_6235.JPG (vóór de verbouwing: banden, vakken, consoles)",
      "PDOK BAG-pand 0882100000000477, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

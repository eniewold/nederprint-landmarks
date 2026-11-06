// Watertoren van Rhenen ("De Koerheuvel") aan de Koerheuvelweg, op de Koerheuvel (circa NAP +51 m) aan de westkant van
// Rhenen. Ontworpen door H. van Hoogdalem en gebouwd in 1935, als watertoren in gebruik van 1937 tot 1989, één reservoir
// van 600 m³, volgens Wikipedia 42,7 m hoog en negen verdiepingen. Was hotel Koerheuvel; sinds 9 december 1994
// appartementen, met rijtjeshuizen ertegenaan. Een wit gepleisterd, bijna vierkant blok van 13,3 × 13,0 m tot 26,3 m
// (dakrand 27,6 m) met aan de noordoosthoek een smalle vierkante schacht van 5,2 m die 1,5 m uit de oostgevel steekt en
// doorloopt tot 31,5 m. Op de schacht een achtkante glazen lantaarn onder een overstekend achtkant dak met een slanke,
// holle achtkante naaldspits. In de oostgevel van de schacht de ingang onder een gebogen luifel met de naam
// "De Koerheuvel", daarboven een lange smalle vensterstrook en hoog een rond balkonnetje met een rondboogdeur. Op de
// noordgevel een stalen brandtrap over het dak van de rijtjeshuizen. Tegen de west- en zuidzijde een lage onderbouw van
// 5,1 m met een dakterras en een afgeronde zuidwesthoek (in hetzelfde BAG-pand).
//
// Oorsprong op het hart van de schacht (de spits in het AHN-DSM ligt er 0,2 m naast) op het maaiveld: NAP +51,58
// (3D BAG-maaiveld; AHN-DTM oost 51,55 tot 51,6, noord 52,0, west tot 53,3). +X wijst naar RD-richting -6,0 graden (de
// gevels van BAG-pand 0340100000331993 lopen op 84,0 graden), +Y naar 84,0 graden (noord).
// Maten: gevels uit de BAG; hoogtes uit het AHN-DSM 0,5 m (dak van het blok NAP +77,87, dakrand +79,15, schacht +83,05,
// dak van de lantaarn +85,45, top van de spits +94,73, onderbouw +56,68, rijtjeshuis 0340100000331991 +59,5);
// lantaarn, spits, ingang, balkon, vensters en brandtrap uit de foto's "Watertoren - Rhenen - 20371381 - RCE.jpg" (1998,
// vanuit het noordoosten, verticaal gecorrigeerd), "Watertoren Rhenen.jpg" (2009, noordoost, van dichtbij) en "Koerheuvel
// met Watertoren Rhenen.JPG" (2014, van ver uit het zuidwesten, 22,6 px/m op de BAG-diagonaal).
import { CrossSection, Manifold, ccw, hull, union, box, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [167163.49, 441798.73];
const AXIS_DEG = -6.0;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 51.58;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: oost 95,16, oost bij de
// zuidgevel 95,29, zuidoost 95,42, noord tussen schacht en rijtjeshuis 95,20. Het terrein loopt naar het westen op
// (96,1 tot 96,7 achter de onderbouw); de onderbouw zakt daar in het terrein.
const GROUND_ELLIPSOID = 95.16;

// ---------- maten (meters boven het maaiveld, lokaal stelsel) ----------
const BLOCK = { u0: -12.3, u1: 1.09, v0: -10.64, v1: 2.35, roof: 26.29, rim: 27.57 }; // blok met het reservoir
const SHAFT = { u0: -2.55, u1: 2.63, v0: -2.61, v1: 2.61, top: 31.47 }; // schacht met trappenhuis
const FLOOR = BLOCK.roof / 9; // negen verdiepingen (Wikipedia): 2,92 m
const PODIUM = 5.1; // onderbouw met dakterras (AHN NAP +56,68)
const LANTERN = { a: 1.65, glass: 32.9, eaveA: 2.2, eave: 33.55, top: 33.9 }; // apothema's van de achtkanten
// Top van de naald: het AHN raakt de dunne punt niet (hoogste cel NAP +94,73 = 43,15 m is een ondergrens); de foto's
// geven een naald van 10 m (RCE, op de lantaarnbreedte) tot 12 m (verre foto uit het zuidwesten) boven het lantaarndak.
// Gekozen: 11,0 m, top 44,9 m (Wikipedia: 42,7 m voor de hele toren).
const TIP = 44.9;
// Rijtjeshuis 0340100000331991 (1994) tegen de noordgevel: PDOK reconstrueert het tot 26 m door de brandtrap, het AHN
// geeft 7,9 m. Het model vervangt het en zet het op die hoogte.
const ROW_HOUSE_TOP = 7.95;

// BAG-contouren in het lokale stelsel (PDOK BAG-WFS, 2026-11-06).
const BAG_TOWER = [[-15.2, -14.85], [-14.13, -15.35], [-12.96, -15.53], [-2.99, -15.53], [-2.99, -10.64], [1.09, -10.64], [1.1, -2.6], [2.62, -2.61], [2.63, 2.61], [2.49, 2.61], [-1.75, 2.59], [-2.55, 2.59], [-2.54, 2.4], [-8.2, 2.31], [-8.19, 2.14], [-16.95, 1.98], [-16.95, 1.81], [-16.93, -10.69], [-16.9, -11.57], [-16.8, -12.45], [-16.55, -13.31], [-16.08, -14.06]];
const BAG_ROW_HOUSE = [[-18.89, 7.99], [-18.91, 1.8], [-16.95, 1.81], [-16.95, 1.98], [-8.19, 2.14], [-8.2, 2.31], [-8.29, 4.72], [-6.96, 4.73], [-6.95, 8.03]];

// ---------- hulpstukken ----------
// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar
// binnen onder 63 graden op, buiten de gevel loopt de snede schuin af.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, y - w / 2, z0], [f + 1, y - w / 2, z0], [a, y + w / 2, z0], [f + 1, y + w / 2, z0], [a, y - w / 2, za], [f, y - w / 2, z1], [a, y + w / 2, za], [f, y + w / 2, z1], [f + 1, y - w / 2, zb], [f + 1, y + w / 2, zb]]);
};
// Rondboognis: als niche, met een halfrond (7 punten) vanaf de aanzet zSpring.
const archNiche = (f, w, z0, zSpring, depth = 0.3, y = 0) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [y - r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([v, z]) => [a, v, z + 2 * depth]),
    ...arc.map(([v, z]) => [f, v, z]),
    ...arc.map(([v, z]) => [f + 1, v, Math.max(z0, z - 1.5)]),
    [a, y - r, z0], [a, y + r, z0], [f + 1, y - r, z0], [f + 1, y + r, z0],
  ]);
};
// Gevels: draaihoek; s is de lokale coördinaat langs de gevel (v bij oost en west, u bij noord en zuid).
const FACES = { oost: { deg: 0, t: (s) => s }, noord: { deg: 90, t: (s) => -s }, west: { deg: 180, t: (s) => -s }, zuid: { deg: -90, t: (s) => s } };
const win = (face, f, s, w, z0, z1, depth = 0.3) => place(niche(f, w, z0, z1, depth, FACES[face].t(s)), { deg: FACES[face].deg });
const arch = (face, f, s, w, z0, zSpring, depth = 0.3) => place(archNiche(f, w, z0, zSpring, depth, FACES[face].t(s)), { deg: FACES[face].deg });
const floors = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
const zf = (k) => k * FLOOR;
// Regelmatige achthoek met apothema a (vlakken haaks op de assen).
const oct = (a, z) => Array.from({ length: 8 }, (_, k) => {
  const t = Math.PI / 8 + (k * Math.PI) / 4, r = a / Math.cos(Math.PI / 8);
  return [r * Math.cos(t), r * Math.sin(t), z];
});
const rect3 = (u0, v0, u1, v1, z) => [[u0, v0, z], [u1, v0, z], [u1, v1, z], [u0, v1, z]];

// ---------- onderbouw (hele BAG-contour tot 5,1 m) met een rand om het dakterras ----------
const outline = new CrossSection([ccw(BAG_TOWER)]);
const podium = prism(BAG_TOWER, BASE, PODIUM);
// Borstwering/plantenbakken langs de buitenrand van het dakterras: 0,9 m breed, 1,0 m hoog.
const terraceRim = Manifold.extrude(outline.subtract(outline.offset(-0.9, "Miter")), 1.0).translate([0, 0, PODIUM - 0.01]);

// ---------- blok met het reservoir ----------
const block = box(BLOCK.u0, BLOCK.v0, BASE, BLOCK.u1, BLOCK.v1, BLOCK.roof);
// Dakrand: 0,9 m brede opstand rondom tot 27,57 m (AHN-rand NAP +79,15 op alle vier de zijden).
const blockRim = box(BLOCK.u0, BLOCK.v0, BLOCK.roof - 0.01, BLOCK.u1, BLOCK.v1, BLOCK.rim)
  .subtract(box(BLOCK.u0 + 0.9, BLOCK.v0 + 0.9, BLOCK.roof - 0.5, BLOCK.u1 - 0.9, BLOCK.v1 - 0.9, BLOCK.rim + 1));

// ---------- schacht ----------
const shaft = box(SHAFT.u0, SHAFT.v0, BASE, SHAFT.u1, SHAFT.v1, SHAFT.top);

// Ingang: portiek onder de gebogen luifel tegen de oostgevel van de schacht (2,6 m breed, 1,4 m diep, wanden tot 2,9 m
// en een halfronde kap tot 4,2 m), met een rondboognis als deur.
const PORCH = { v: -1.2, w: 2.6, d: 1.4, wall: 2.9 };
const porch = (() => {
  const r = PORCH.w / 2, pts = [];
  for (let k = 0; k <= 12; k++) {
    const t = (Math.PI * k) / 12, v = PORCH.v - r * Math.cos(t), z = PORCH.wall + r * Math.sin(t);
    pts.push([SHAFT.u1 - 0.01, v, z], [SHAFT.u1 + PORCH.d, v, z]);
  }
  pts.push(...rect3(SHAFT.u1 - 0.01, PORCH.v - r, SHAFT.u1 + PORCH.d, PORCH.v + r, BASE));
  return hull(pts);
})();
const porchDoor = arch("oost", SHAFT.u1 + PORCH.d, PORCH.v, 1.6, 0, 2.4, 0.4);

// Balkonnetje hoog in de oostgevel van de schacht: halve trommel (straal 0,9 m) met een kegel van 50 graden eronder.
const BALCONY = { v: -0.9, r: 0.9, floor: 28.9 };
const balcony = (() => {
  const pts = [];
  for (let k = 0; k <= 12; k++) {
    const t = -Math.PI / 2 + (Math.PI * k) / 12;
    const du = BALCONY.r * Math.cos(t), dv = BALCONY.r * Math.sin(t);
    pts.push([SHAFT.u1 + du, BALCONY.v + dv, BALCONY.floor], [SHAFT.u1 + du, BALCONY.v + dv, BALCONY.floor - 0.45]);
  }
  pts.push([SHAFT.u1 - 0.01, BALCONY.v - BALCONY.r, BALCONY.floor], [SHAFT.u1 - 0.01, BALCONY.v + BALCONY.r, BALCONY.floor]);
  pts.push([SHAFT.u1 - 0.01, BALCONY.v, BALCONY.floor - 0.45 - 1.2 * BALCONY.r]);
  return hull(pts);
})();

// Brandtrap op de noordgevel: zes bordessen op de verdiepingen 3 tot en met 8, 1,6 m diep, met een onderkant van
// 50 graden naar de gevel (de stalen treden en hekken zelf zijn te dun).
const ESCAPE = { u0: -10.9, u1: -6.6, d: 1.6, t: 0.9 };
const landing = (k) => hull([
  ...rect3(ESCAPE.u0, BLOCK.v1 - 0.01, ESCAPE.u1, BLOCK.v1 + ESCAPE.d, zf(k)),
  [ESCAPE.u0, BLOCK.v1 + ESCAPE.d, zf(k) - ESCAPE.t], [ESCAPE.u1, BLOCK.v1 + ESCAPE.d, zf(k) - ESCAPE.t],
  [ESCAPE.u0, BLOCK.v1 - 0.01, zf(k) - ESCAPE.t - 1.2 * ESCAPE.d], [ESCAPE.u1, BLOCK.v1 - 0.01, zf(k) - ESCAPE.t - 1.2 * ESCAPE.d],
]);
const fireEscape = union(floors(3, 8).map(landing));

// Rijtjeshuis 0340100000331991 als blok op de AHN-hoogte (plat dak).
const rowHouse = prism(BAG_ROW_HOUSE, BASE, ROW_HOUSE_TOP);

// ---------- vensters ----------
const SILL = 0.9, HEAD = 2.2;
const openings = union([
  // oostgevel van het blok: twee vensters en een spleetvenster per verdieping
  ...floors(0, 8).flatMap((k) => [
    win("oost", BLOCK.u1, -8.5, 1.0, zf(k) + SILL, zf(k) + HEAD), win("oost", BLOCK.u1, -6.8, 1.0, zf(k) + SILL, zf(k) + HEAD),
    win("oost", BLOCK.u1, -4.3, 0.4, zf(k) + 0.6, zf(k) + 2.3),
  ]),
  // oostgevel van de schacht: lange vensterstrook boven de ingang, rondboogdeur achter het balkon
  win("oost", SHAFT.u1, PORCH.v, 0.5, 4.8, 11.4),
  arch("oost", SHAFT.u1, BALCONY.v, 0.9, BALCONY.floor, 30.15),
  // noordgevel van de schacht: spleetvensters van het trappenhuis en twee hoge smalle vensters onderin
  ...floors(1, 9).map((k) => win("noord", SHAFT.v1, 0.3, 0.4, zf(k) + 1.2, zf(k) + 2.6)),
  win("noord", SHAFT.v1, -0.9, 0.4, 0.3, 3.3), win("noord", SHAFT.v1, -1.9, 0.4, 0.3, 3.3),
  // noordgevel van het blok: een venster per verdieping (de deuren naar de brandtrap zitten achter de bordessen)
  ...floors(0, 8).map((k) => win("noord", BLOCK.v1, -4.6, 1.0, zf(k) + SILL, zf(k) + HEAD)),
  // westgevel (boven de onderbouw): vijf vensters per verdieping
  ...floors(2, 8).flatMap((k) => [-0.6, -1.9, -3.2, -4.5, -5.8].map((v) => win("west", -BLOCK.u0, v, 0.8, zf(k) + SILL, zf(k) + HEAD))),
  // zuidgevel: drie vensters per verdieping, op de bovenste een breed venster; onderin oostelijk van de onderbouw twee
  ...floors(2, 8).flatMap((k) => [
    win("zuid", -BLOCK.v0, -9.4, 1.0, zf(k) + SILL, zf(k) + HEAD), win("zuid", -BLOCK.v0, -3.0, 1.0, zf(k) + SILL, zf(k) + HEAD),
    ...(k === 8 ? [win("zuid", -BLOCK.v0, -5.9, 3.2, zf(k) + 0.6, zf(k) + 2.4)] : [win("zuid", -BLOCK.v0, -6.6, 1.0, zf(k) + SILL, zf(k) + HEAD), win("zuid", -BLOCK.v0, -5.0, 1.0, zf(k) + SILL, zf(k) + HEAD)]),
  ]),
  ...floors(0, 1).map((k) => win("zuid", -BLOCK.v0, -1.0, 1.0, zf(k) + SILL, zf(k) + HEAD)),
  // schacht boven het dak: een klein venster in de zuidgevel
  win("zuid", -SHAFT.v0, 1.2, 0.9, 28.2, 29.3),
]);

// ---------- lantaarn, dak en spits ----------
const lantern = hull([...oct(LANTERN.a, SHAFT.top - 0.01), ...oct(LANTERN.a, LANTERN.glass)]);
// Overstekend achtkant dak: onderkant van 50 graden van de glazen trommel naar de boeirand (0,55 m uit), boeirand van
// 0,35 m.
const lanternRoof = hull([...oct(LANTERN.a, LANTERN.glass), ...oct(LANTERN.eaveA, LANTERN.eave), ...oct(LANTERN.eaveA, LANTERN.top)]);
// Glas als ondiepe nissen in de acht vlakken (0,9 m breed).
const lanternGlass = union(Array.from({ length: 8 }, (_, k) => place(niche(LANTERN.a, 0.9, SHAFT.top + 0.3, LANTERN.glass - 0.25, 0.2), { deg: 45 * k })));
// Holle achtkante naaldspits: apothema per hoogte boven het lantaarndak (verhoudingen uit de RCE-foto).
const SPIRE = [[0, 0.95], [0.7, 0.72], [1.8, 0.55], [3.6, 0.4], [6.0, 0.26], [9.0, 0.12]];
const spire = union([
  ...SPIRE.slice(0, -1).map(([h, a], i) => hull([...oct(a, LANTERN.top + h - 0.01), ...oct(SPIRE[i + 1][1], LANTERN.top + SPIRE[i + 1][0])])),
  hull([...oct(SPIRE.at(-1)[1], LANTERN.top + SPIRE.at(-1)[0]), [0, 0, TIP]]),
]);

const all = union([podium, terraceRim, block, blockRim, shaft, porch, balcony, fireEscape, rowHouse, lantern, lanternRoof, spire])
  .subtract(union([openings, porchDoor, lanternGlass]))
  .trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-rhenen",
  base: BASE,
  nodes: [["building:watertoren-blok-schacht-lantaarn-spits-onderbouw-en-rijtjeshuis", all]],
  catalog: {
    name: "Watertoren Rhenen (De Koerheuvel)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[5, 0], [5, -6], [0, -13], [-4, 4]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0340100000331993", "NL.IMBAG.Pand.0340100000331991"],
    description:
      "Oorsprong op het hart van de schacht op het maaiveld (NAP +51,58 m), +X naar RD-richting -6,0 graden (oost, ingang), +Y naar 84,0 graden (noord). Wit blok van 13,4 × 13,0 m tot 26,3 m met een dakrand tot 27,6 m en vensters op elke verdieping; aan de noordoosthoek de schacht van 5,2 m tot 31,5 m met de ingang onder een gebogen luifel, een vensterstrook en een balkonnetje; achtkante glazen lantaarn onder een overstekend dak tot 33,9 m en een holle naaldspits tot 44,9 m; brandtrap met zes bordessen op de noordgevel; onderbouw van 5,1 m met dakterras en afgeronde zuidwesthoek; het aangebouwde rijtjeshuis 0340100000331991 als blok van 7,95 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1935,
      architect: "H. van Hoogdalem",
      publishedHeightM: 42.7,
      reservoirM3: 600,
      floors: 9,
      ahnGroundNapM: GROUND_NAP,
      ahnTipNapM: 94.73,
      ahnTipIsLowerBound: true,
      blockM: [+(BLOCK.u1 - BLOCK.u0).toFixed(2), +(BLOCK.v1 - BLOCK.v0).toFixed(2), BLOCK.roof, BLOCK.rim],
      shaftM: [+(SHAFT.u1 - SHAFT.u0).toFixed(2), +(SHAFT.v1 - SHAFT.v0).toFixed(2), SHAFT.top],
      lanternAcrossFlatsM: [LANTERN.a * 2, LANTERN.eaveA * 2],
      lanternRoofM: LANTERN.top,
      tipM: TIP,
      podiumM: PODIUM,
      rowHouseM: ROW_HOUSE_TOP,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Rhenen) (1935, H. van Hoogdalem, 42,7 m, negen verdiepingen, 600 m³, Koerheuvelweg, appartementen sinds 1994)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_-_Rhenen_-_20371381_-_RCE.jpg (1998, noordoost: ingang, schacht, brandtrap, lantaarn en spits)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Rhenen.jpg (2009, noordoost van dichtbij: vensters, balkon, luifel)",
      "https://commons.wikimedia.org/wiki/File:Koerheuvel_met_Watertoren_Rhenen.JPG (2014, van ver uit het zuidwesten: west- en zuidgevel, lantaarn, verhoudingen)",
      "PDOK BAG-panden 0340100000331993 en 0340100000331991, 3D BAG, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

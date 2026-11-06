// Watertoren De Lichtmis aan de Lichtmisweg (nr. 51) in De Lichtmis, het noordelijkste deel van de gemeente Zwolle, naast
// het knooppunt van de A28 en de N377. Gebouwd in 1932 naar ontwerp van Hendrik Sangster, 29,5 m hoog met een reservoir
// van 400 m³ (Wikipedia); eind jaren tachtig buiten gebruik. Vanaf 1990 liet Hennie van der Most hem verbouwen tot hotel
// en restaurant De Koperen Hoogte (2001-2022, sinds 2023 Hotel & Restaurant Infinity). Sindsdien is het een ronde
// schacht van circa 15 m doorsnede met hotelkamers, op 37 m een kraag met omgang, een glazen restaurantring die naar
// buiten uitloopt, een breed koperen kegeldak (25,6 m) met een overstekende boeiboord, een kleiner koperen dak met
// lantaarn en een witte koepel tot circa 58,6 m. Aan de noordoostkant staat een witte schijf ("HOTEL", tot 51 m) met een
// open trappenhuis tussen schijf en schacht, aan de zuidoostkant een groen-koperen liftstrook met een panoramalift. Om
// de voet ligt een laag paviljoen met koperen dakvlakken die van de toren af aflopen (circa 11 graden) en een glazen
// lensvormige kap; dat paviljoen hoort bij hetzelfde BAG-pand en is daarom mee gemodelleerd.
//
// Oorsprong op het hart van de schacht (cirkelfit op de dakrand in het AHN-DSM, straal 12,8 m; de koepel ligt erop; op
// de luchtfoto's van 2021-2026 valt de voet van de schacht met straal 7,45 m precies op deze cirkel) op maaiveld NAP
// +1,15 (AHN-DTM rond het paviljoen: noordoost 1,13-1,16, zuid 1,28, oost 1,6, het plein aan de westkant 0,15). +X is
// RD-oost, +Y RD-noord (de toren is rond; het paviljoen volgt de BAG-contour). Alle hoogtes zijn boven NAP +1,15.
//
// Bronnen: BAG-pand 0193100000001220 (paviljoen en schacht, 1971 m²) en 3D BAG (dakvlakken van het paviljoen en de lens),
// AHN DSM/DTM 0,5 m (dakrand NAP +49,9, kegeldak 25 graden, bovendak 24 graden, koepel NAP +59,8), PDOK-luchtfoto's
// 2021-2026 (ligging van schacht, schijf en trappenhuis via de scheefstand) en Commons-foto's "De Koperen Hoogte, De
// Lichtmis.jpg" (2021, vanuit het noordoosten; hoogtes op 25,1 px/m), "KoperenHoogte-close-up0987.JPG" (2009, kroon,
// lift en schijf; 27,9 px/m), "ON THE ROAD,2010 (1) - Flickr - bertknot.jpg" (lift, trappenhuis, schijf) en "Koperen
// Hoogte.jpg".
import { Manifold, CrossSection, ccw, hull, union, box, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [209509.55, 511042.16];
const AXIS = [1, 0];
const GROUND_NAP = 1.15;
// Het plein aan de westkant ligt op NAP +0,15: de onderkant loopt tot NAP -0,05 door, zodat de westgevel daar niet zweeft.
const BASE = -1.2;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: binnenhof 43,71 en 43,78,
// zuid 43,83, noord 43,66. Niet op (18, 10): daar ligt in de PDOK-tegel water (42,82), en niet op het westplein (42,73).
const GROUND_ELLIPSOID = 43.66;
const nap = (z) => z - GROUND_NAP;
const rad = (deg) => (deg * Math.PI) / 180;

const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder
// 56 graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));

// ---------- hoogtes (boven NAP +1,15) en stralen ----------
const R = {
  shaft: 7.45, // schacht (luchtfoto's en foto's: 14,9 m)
  bowl: 9.1, // groen beklede kraag onder de omgang
  balcony: 10.85, // omgang
  glassFoot: 10.4, // glazen restaurantring, loopt naar buiten uit
  glassTop: 11.0,
  eave: 12.8, // boeiboord van het kegeldak (AHN-DSM, luchtfoto 25,5 m)
  lantern: 4.9, // binnenrand van de onderzijde van het bovendak
  upperEave: 5.8, // bovendak (AHN-DSM: rand op 5,75-6,0 m)
  drum: 1.5, // tamboer onder de koepel
  dome: 1.95,
};
const H = {
  bowlFoot: 37.6, // begin van de kraag (foto 2021: onderkant kraag circa 39,6)
  bowl: [39.57, 40.3],
  balcony: [42.39, 42.8],
  glassTop: 45.8,
  eaveRim: [47.9, 48.7], // boeiboord; bovenkant AHN NAP +49,85
  upperRim: [53.45, 53.7], // bovendak AHN NAP +54,9
  drum: [55.0, 56.4],
  domeTop: 58.6, // AHN NAP +59,8
};
// Kegeldak uit het AHN: 25 graden, van de boeiboord (12,8 m, +48,7) naar binnen.
const ROOF_SLOPE = 0.469;
const roofZ = (r) => H.eaveRim[1] + ROOF_SLOPE * (R.eave - r);
// Bovendak: 24 graden, van de rand (5,8 m, +53,7) naar de tamboer.
const UPPER_SLOPE = 0.44;
const upperZ = (r) => H.upperRim[1] + UPPER_SLOPE * (R.upperEave - r);
const glassR = (z) => R.glassFoot + ((R.glassTop - R.glassFoot) * (z - H.balcony[1])) / (H.glassTop - H.balcony[1]);

// ---------- schacht, kraag, restaurantring en daken als één omwenteling ----------
// Elke onderzijde loopt onder minstens 47 graden: kraag 50, omgang 50, boeiboord 49, bovendak 49 graden.
const crown = rev([
  [0, BASE],
  [R.shaft, BASE],
  [R.shaft, H.bowlFoot],
  [R.bowl, H.bowl[0]],
  [R.bowl, H.bowl[1]],
  [R.balcony, H.balcony[0]],
  [R.balcony, H.balcony[1]],
  [R.glassFoot, H.balcony[1]],
  [R.glassTop, H.glassTop],
  [R.eave, H.eaveRim[0]],
  [R.eave, H.eaveRim[1]],
  [R.lantern, roofZ(R.lantern)],
  [R.upperEave, H.upperRim[0]],
  [R.upperEave, H.upperRim[1]],
  [R.drum, upperZ(R.drum)],
  [R.drum, H.drum[1]],
  [R.dome, H.drum[1] + 0.5],
  [R.dome, 57.0],
  [1.8, 57.6],
  [1.4, 58.1],
  [0.8, 58.45],
  [0, H.domeTop],
]);

// Glasvlakken van het restaurant als ondiepe nissen tussen stijlen van circa 1 m (twintig velden), in de schuin
// uitlopende ring; het plafond loopt onder 50 graden naar binnen op. Niet achter de schijf (60 graden).
const PANE = { n: 20, w: 2.3, z0: 43.1, z1: 45.3, depth: 0.25 };
const pane = (() => {
  const { w, z0, z1, depth } = PANE;
  const r0 = glassR(z0), r1 = glassR(z1);
  return hull([
    [r0 - depth, -w / 2, z0], [r0 - depth, w / 2, z0], [r0 + 1.5, -w / 2, z0], [r0 + 1.5, w / 2, z0],
    [r1 - depth, -w / 2, z1 + 1.2 * depth], [r1 - depth, w / 2, z1 + 1.2 * depth],
    [r1, -w / 2, z1], [r1, w / 2, z1],
    [r1 + 1.5, -w / 2, z1 - 1.5], [r1 + 1.5, w / 2, z1 - 1.5],
  ]);
})();
const SLAB_DEG = 60;
const angDiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
const PANE_DEGS = Array.from({ length: PANE.n }, (_, k) => 9 + (360 * k) / PANE.n).filter((d) => angDiff(d, SLAB_DEG) > 22);

// Hotelvensters: kolommen nissen van 0,9 × 1,6 m, per verdieping 3,3 m (foto 2021: luifels op 7,6 tot 37,5 m; de
// onderste rij valt achter het paviljoendak en de bovenste onder de kraag, dus 10,9 tot 34,0 m). De
// kolommen naast de lift (-35 graden) en het trappenhuis (60 graden) vallen weg.
const WINDOW_DEGS = [5, 25, 95, 140, 185, 230, 275];
const WINDOW_TOPS = Array.from({ length: 8 }, (_, k) => 10.9 + 3.3 * k);
const windows = union(WINDOW_DEGS.flatMap((deg) => WINDOW_TOPS.map((z1) => place(niche(R.shaft, 0.9, z1 - 1.6, z1, 0.3), { deg }))));

// ---------- liftstrook (zuidoost, -35 graden) ----------
// Groen beklede strook van 5,4 m breed, 0,4 m voor de schacht, met de glazen liftkoker als verdiepte gleuf van 1,8 m.
const LIFT_DEG = -35;
const liftStrip = place(box(7.0, -2.7, BASE, 7.85, 2.7, 39.0), { deg: LIFT_DEG });
const liftSlot = place(niche(7.85, 1.8, 7.0, 37.0, 0.3), { deg: LIFT_DEG });

// ---------- trappenhuis en schijf (noordoost, 60 graden) ----------
// Stelsel u (radiaal) en t (tangentieel). Open trappenhuis tussen schacht en schijf (u 7,0-11,6, t ±2,2) tot onder het
// kegeldak; de bordessen zijn per verdieping verdiepte stroken in beide zijgevels. De schijf (u 11,6-14,4, t ±2,6) staat
// vrij in de binnenhof van het paviljoen en steekt door het dak tot 51,2 m (AHN NAP +52 à +53).
const STAIR = { u0: 7.0, u1: 11.6, t: 2.2, top: 47.9 };
const SLAB = { u0: 11.6, u1: 14.4, t: 2.6, top: 51.2 };
const stairBlock = box(STAIR.u0, -STAIR.t, BASE, STAIR.u1, STAIR.t, STAIR.top);
const slab = box(SLAB.u0, -SLAB.t, BASE, SLAB.u1, SLAB.t, SLAB.top);
const landingSlot = (z0, side) => {
  // Nis met normaal +X op x = t; draai zodat +X langs ±t wijst, schuif naar het midden van de gevel in u.
  const uMid = (STAIR.u0 + 0.6 + STAIR.u1 - 0.3) / 2, w = STAIR.u1 - 0.3 - (STAIR.u0 + 0.6);
  return place(niche(STAIR.t, w, z0, z0 + 2.0, 0.6), { deg: side > 0 ? 90 : -90 }).translate([uMid, 0, 0]);
};
const LANDINGS = Array.from({ length: 10 }, (_, k) => 4.4 + 3.3 * k); // tot 36,1 m, onder de kraag
const stair = stairBlock.subtract(union(LANDINGS.flatMap((z) => [landingSlot(z, 1), landingSlot(z, -1)])));
const stairAndSlab = place(union([stair, slab]), { deg: SLAB_DEG });

// ---------- paviljoen ----------
// BAG-contour (Douglas-Peucker 0,15 m) in het lokale stelsel. In het noordoosten volgt de contour de schacht: het
// trappenhuis en de schijf staan in een open binnenhof buiten het pand.
const PAVILION = [[23.89, -0.09], [16.47, 0.14], [16.56, 5.66], [12.66, 7.93], [6.2, 3.92], [5.73, 4.67], [6.23, 5.56], [5.63, 6.51], [3.26, 7.93], [2.62, 8.31], [1.67, 8.33], [1, 7.46], [0.23, 7.48], [0.3, 14.3], [-11.86, 21.75], [-13.27, 20.96], [-14.67, 23.49], [-26.94, 16.66], [-26.98, 12.06], [-37.52, 12.21], [-38.33, 11.78], [-38.5, 11.25], [-38.85, -10.53], [-38.62, -11.11], [-38.13, -11.43], [-27.38, -11.67], [-27.46, -15.19], [-21.73, -18.61], [-22.68, -20.17], [-21.24, -21.02], [-21.44, -22.37], [-20.62, -23.62], [-19.29, -23.83], [-18, -22.92], [-16.58, -23.78], [-15.64, -22.21], [-3.49, -29.37], [-0.44, -27.68], [-0.24, -19.18], [7.63, -14.73], [11.23, -21.19], [23.67, -14.22]];
// AHN-DTM 2 m buiten het midden van elke gevel (NAP); null langs de schacht.
const EDGE_GROUND = [1.5, 1.5, 1.19, 1.26, null, null, null, null, null, null, null, null, null, 1.22, 1.19, 1.18, 0.5, 0.51, 0.5, 0.15, 0.16, 0.16, 0.15, 0.15, 1.12, 1.28, 1.3, 1.33, 1.32, 1.31, 1.3, 1.3, 1.32, 1.31, 1.29, 1.38, 1.33, 1.3, 1.31, 1.4, 1.6, 1.74];
// Dakvlakken uit de 3D BAG (LoD2.2), z_NAP = a x + b y + c in het lokale stelsel; elk vlak loopt van de toren af
// (circa 11 graden). Het dak is het laagste van de vijf vlakken, zodat de graten vanzelf ontstaan.
const ROOF_PLANES = {
  oost: [-0.1856, 0.0227, 10.1176],
  zuidoost: [-0.1005, 0.1779, 10.4193],
  zuid: [0.1002, 0.1738, 10.3752],
  west: [0.2088, -0.0039, 10.5246],
  noordwest: [0.1008, -0.1608, 10.1719],
};
const trimBelow = (m, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return m.trimByPlane([a / n, b / n, -1 / n], -nap(c) / n);
};
const pavRoofZ = (x, y) => Math.min(...Object.values(ROOF_PLANES).map(([a, b, c]) => nap(a * x + b * y + c)));
let pavilion = prism(PAVILION, BASE, 12);
for (const p of Object.values(ROOF_PLANES)) pavilion = trimBelow(pavilion, p);
// Glazen lens in het zuidwesten (3D BAG-vlak 212: 1,2 m boven het dakvlak, bijna vlak), punt naar de toren, ronde kop
// boven de luifel van de ingang.
const LENS = [[-15.1, -13.8], [-18.7, -16.3], [-21.5, -20.8], [-21.5, -22.0], [-21.2, -23.0], [-20.6, -23.6], [-19.9, -23.9], [-19.1, -23.8], [-18.3, -23.2], [-18.1, -23.0], [-14.1, -15.1]];
const lens = trimBelow(prism(LENS, 0, 12), [0.1068, -0.0565, 7.5036]);
// Vensters en deuren in het paviljoen: nissen van 1,4 m breed om de 3 m, 0,8 tot 2,6 m boven het maaiveld langs de
// gevel, alleen waar de goot minstens 3 m boven dat maaiveld ligt.
const pavWindows = [];
PAVILION.forEach((a, i) => {
  const g = EDGE_GROUND[i];
  if (g === null) return;
  const b = PAVILION[(i + 1) % PAVILION.length];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const eave = Math.min(pavRoofZ(...a), pavRoofZ(...b));
  const z0 = nap(g) + 0.8, z1 = Math.min(nap(g) + 2.6, eave - 0.6);
  if (L < 4.4 || z1 - z0 < 1.4) return;
  const n = Math.floor((L - 1.4) / 3.0);
  // Contour linksom: de buitennormaal is (dy, -dx).
  const deg = (Math.atan2(-(b[0] - a[0]), b[1] - a[1]) * 180) / Math.PI;
  for (let k = 0; k < n; k++) {
    const s = (L - (n - 1) * 3.0) / 2 + 3.0 * k;
    const p = [a[0] + ((b[0] - a[0]) * s) / L, a[1] + ((b[1] - a[1]) * s) / L];
    pavWindows.push(place(niche(0, 1.4, z0, z1, 0.3), { deg, at: [p[0], p[1], 0] }));
  }
});
pavilion = union([pavilion, lens]).subtract(union(pavWindows));

// ---------- samenvoegen ----------
const tower = union([crown, liftStrip]).subtract(union([windows, liftSlot, ...around(pane, PANE_DEGS)]));
const all = union([tower, stairAndSlab, pavilion]);

await writeLandmark({
  slug: "watertoren-lichtmis",
  base: BASE,
  nodes: [["building:watertoren-kroon-trappenhuis-en-paviljoen", all]],
  catalog: {
    name: "Watertoren De Lichtmis",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[10, 15], [12, 12], [2, -25], [-5, 24]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0193100000001220"],
    description:
      "Oorsprong op het hart van de schacht op maaiveld (NAP +1,15 m), +X naar RD-oost. Ronde schacht van 14,9 m met hotelvensters en een groene liftstrook (zuidoost); kraag, omgang en schuin uitlopende glazen restaurantring op 42,8 m; koperen kegeldak van 25,6 m met boeiboord tot 48,7 m, bovendak tot 55,4 m en witte koepel tot 58,6 m; witte schijf met open trappenhuis (noordoost) tot 51,2 m; laag paviljoen met vijf koperen dakvlakken die van de toren af lopen en een glazen lens. Maten uit BAG, 3D BAG, AHN, luchtfoto's en foto's.",
    realWorld: {
      built: 1932,
      architect: "Hendrik Sangster",
      wikipediaHeightM: 29.5,
      reservoirM3: 400,
      conversion: "hotel en restaurant De Koperen Hoogte (Hennie van der Most, vanaf 1990)",
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 49.85,
      ahnUpperEaveNapM: 54.9,
      ahnTopNapM: 59.8,
      shaftDiameterM: R.shaft * 2,
      balconyDiameterM: R.balcony * 2,
      roofDiameterM: R.eave * 2,
      eaveM: H.eaveRim[1],
      topM: H.domeTop,
      slabTopM: SLAB.top,
      pavilionFootprintM2: 1971,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Lichtmis) (1932, Hendrik Sangster, 29,5 m, 400 m³, De Koperen Hoogte)",
      "https://commons.wikimedia.org/wiki/File:De_Koperen_Hoogte,_De_Lichtmis.jpg (2021, vanuit het noordoosten: kraag, glasring, daken, schijf, liftstrook, paviljoen)",
      "https://commons.wikimedia.org/wiki/File:KoperenHoogte-close-up0987.JPG (2009: kroon, koepel, lift en schijf)",
      "https://commons.wikimedia.org/wiki/File:ON_THE_ROAD,2010_(1)_-_Flickr_-_bertknot.jpg (lift, open trappenhuis, schijf, paviljoen)",
      "https://commons.wikimedia.org/wiki/File:Koperen_Hoogte.jpg (schacht met groene stroken)",
      "PDOK BAG-pand 0193100000001220 en 3D BAG (dakvlakken paviljoen), AHN DSM/DTM 0,5 m, luchtfoto's 2021-2026, 2026-11-06",
    ],
  },
});

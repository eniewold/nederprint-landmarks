// Watertoren van Ulft (1913) op het Beltmancomplex van de voormalige
// ijzergieterij DRU, industrieel erfgoed. Vierkante bakstenen schacht met
// rondboogvensters, op de hoeken vier consoles met tussen elk paar een gewelf
// onder de uitkragende vierkante waterkamer; die heeft een betonnen voetplaat
// met tandlijst, drie vensters per zijde, een rondboogfries en een betonnen
// kroonlijst onder het platte dak.
//
// De toren is geen eigen BAG-pand: hij hoort bij pand 1509100000186256, het
// hele Beltmancomplex (3103 m², 19 woningen en kantoren). Omdat de kaart en de
// export alleen hele panden kunnen verbergen, neemt de GLB de rest van dat pand
// over als tweede node: de 3D BAG-reconstructie (LoD2.2, dezelfde vlakken als
// de PDOK-gebouwtegels; CC BY 4.0) als prisma's onder elk dakvlak, zonder het
// torenblok. Waar de 3D BAG het torenblok tot het dak van het complex had,
// loopt het complexdak (NAP +24,6) door tot aan de schacht.
//
// Oorsprong op het hart van de waterkamer in het AHN (omhullende boven 10 m:
// 6,3 bij 6,4 m) op het maaiveld van de binnenplaats (NAP +15,19 m). +X langs
// de zuidgevel van de toren en de gevel van het complex aan de binnenplaats
// (RD-richting 28,4 graden, uit de BAG-contour en de dakvlakken van de
// 3D BAG); -Y wijst naar de binnenplaats (zuidzuidoosten).
// Maten: hoogtes en breedtes uit de RCE-foto's 20530862 (waterkamer op de
// hoek, 82,4 px/m) en 20530905 (hele toren op de hoek, 44,3 px/m), geschaald
// op de breedte van de waterkamer (5,7 m, kroonlijst 6,2 m) in het AHN; het
// platte dak op 25,2 m uit het AHN (NAP +40,38).
import { Manifold, CrossSection, hull, union, place, prism, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [223450.26, 434748.43];
const AXIS_DEG = 28.4;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 15.19; // binnenplaats in het AHN-DTM
const BASE = -0.3;
const H = {
  shaftTop: 17.0, // voet van consoles en gewelven
  slab: 18.95, // onderkant van de voetplaat van de waterkamer
  ledge: 19.85, // bovenkant voetplaat met tandlijst
  windowFoot: 20.9,
  windowTop: 22.6,
  frieze: 23.6, // onderkant rondboogfries
  cornice: 24.4, // onderkant kroonlijst
  roof: 25.2, // plat dak (AHN)
  shaftWindowFoot: 12.3,
  shaftWindowTop: 14.6,
};
const HALF = {
  shaft: 1.775, // schacht 3,55 m
  ledge: 2.97, // voetplaat en fries 5,94 m
  body: 2.85, // waterkamer 5,7 m
  cornice: 3.1, // kroonlijst 6,2 m
};
const TAN56 = Math.tan((56 * Math.PI) / 180);
const square = (h) => [[-h, -h], [h, -h], [h, h], [-h, h]];
const ring = (h, z) => square(h).map(([x, y]) => [x, y, z]);
const ALL = [0, 90, 180, 270];

// ---------- schacht en consoles ----------
const shaft = box(-HALF.shaft, -HALF.shaft, BASE, HALF.shaft, HALF.shaft, H.shaftTop);
// De consoles en gewelven samen als afgeknotte piramide van de schacht naar
// de voetplaat: de vlakken onder 58,5 graden, de hoekgraten (de consoles)
// onder 49 graden.
const flare = hull([...ring(HALF.shaft, H.shaftTop), ...ring(HALF.ledge, H.slab)]);
// Gewelf tussen twee hoekconsoles: per zijde een nis van 0,3 m diep evenwijdig
// aan het schuine vlak, 1,8 m breed met een spitse top onder 55 graden tot
// vlak onder de voetplaat (een vlak gewelf van 3,5 m zou de export dichtzetten);
// de hoekconsoles blijven onderaan 1,0 m en halverwege 1,2 m breed.
const vault = (() => {
  const k = (H.slab - H.shaftTop) / (HALF.ledge - HALF.shaft);
  const L = (z) => HALF.shaft + (z - H.shaftTop) / k;
  const d = 0.3, w = 1.8, z1 = 17.2, zc = 18.85;
  const zs = zc - (w / 2) * Math.tan((55 * Math.PI) / 180);
  const xo = HALF.ledge + 0.2;
  const pts = [[L(zc) - d, 0, zc], [xo, 0, zc]];
  for (const s of [-1, 1]) {
    pts.push([L(z1) - d, (s * w) / 2, z1], [xo, (s * w) / 2, z1], [L(zs) - d, (s * w) / 2, zs], [xo, (s * w) / 2, zs]);
  }
  return hull(pts);
})();

// ---------- waterkamer ----------
const ledge = box(-HALF.ledge, -HALF.ledge, H.slab, HALF.ledge, HALF.ledge, H.ledge);
const body = box(-HALF.body, -HALF.body, H.ledge - 0.05, HALF.body, HALF.body, H.cornice + 0.05);
// Rondboogfries als band van 0,12 m op een schuine onderkant (56 graden).
const frieze = hull([...ring(HALF.body, H.frieze), ...ring(HALF.ledge, H.frieze + (HALF.ledge - HALF.body) * TAN56), ...ring(HALF.ledge, H.cornice)]);
// Kroonlijst van 0,25 m (over de fries 0,13 m) met een schuine onderkant.
const cornice = hull([...ring(HALF.ledge, H.cornice), ...ring(HALF.cornice, H.cornice + (HALF.cornice - HALF.ledge) * TAN56), ...ring(HALF.cornice, H.roof)]);

// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.25) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const cuts = ALL.flatMap((deg) => [
  place(vault, { deg }),
  // Eén rondboogvenster per zijde van de schacht (1,4 m breed), boven het complexdak.
  place(niche(HALF.shaft, 1.4, H.shaftWindowFoot, H.shaftWindowTop, 0.3), { deg }),
  // Drie vensters per zijde van de waterkamer, 1,5 m uit elkaar; de penanten blijven 0,92 m.
  ...[-1.5, 0, 1.5].map((y) => place(niche(HALF.body, 0.58, H.windowFoot, H.windowTop, 0.25).translate([0, y, 0]), { deg })),
]);
const tower = union([shaft, flare, ledge, body, frieze, cornice]).subtract(union(cuts));

// ---------- rest van het Beltmancomplex (3D BAG) ----------
const c = AXIS[0] / Math.hypot(...AXIS), s = AXIS[1] / Math.hypot(...AXIS);
const toModel = ([dx, dy]) => [dx * c + dy * s, -dx * s + dy * c];
const COMPLEX_ROOF_NAP = 24.6; // dak rond het torenblok in de 3D BAG
const roofs = beltmanRoofs().map((flat) => {
  const pts = [];
  for (let i = 0; i < flat.length; i += 3) pts.push([...toModel([flat[i], flat[i + 1]]), flat[i + 2] - GROUND_NAP]);
  return pts;
});
// Dakvlak als prisma onder het vlak z = a x + b y + c (kleinste kwadraten).
const roofPrism = (pts, flatZ) => {
  const poly = pts.map(([x, y]) => [x, y]);
  if (flatZ !== undefined) return prism(poly, BASE, flatZ);
  const n = pts.length;
  let sx = 0, sy = 0, sz = 0, sxx = 0, sxy = 0, syy = 0, sxz = 0, syz = 0;
  for (const [x, y, z] of pts) {
    sx += x; sy += y; sz += z; sxx += x * x; sxy += x * y; syy += y * y; sxz += x * z; syz += y * z;
  }
  // Normaalvergelijkingen, opgelost rond het gemiddelde.
  const mx = sx / n, my = sy / n, mz = sz / n;
  const cxx = sxx / n - mx * mx, cxy = sxy / n - mx * my, cyy = syy / n - my * my;
  const cxz = sxz / n - mx * mz, cyz = syz / n - my * mz;
  const det = cxx * cyy - cxy * cxy;
  const a = det > 1e-9 ? (cxz * cyy - cyz * cxy) / det : 0;
  const b = det > 1e-9 ? (cyz * cxx - cxz * cxy) / det : 0;
  const c0 = mz - a * mx - b * my;
  const len = Math.hypot(a, b, 1);
  const top = Math.max(...pts.map((p) => p[2])) + 1;
  return prism(poly, BASE, top).trimByPlane([a / len, b / len, -1 / len], -c0 / len);
};
const isTowerBlock = (pts) => Math.max(...pts.map((p) => p[2])) > 20;
const complexParts = roofs.map((pts) => (isTowerBlock(pts) ? roofPrism(pts, COMPLEX_ROOF_NAP - GROUND_NAP) : roofPrism(pts)));
// Zonder de schacht en de strook ervoor aan de binnenplaats: daar staat de
// toren tot het maaiveld.
const complex = union(complexParts).subtract(box(-HALF.shaft, -8, BASE - 1, HALF.shaft, HALF.shaft, 40));

await writeLandmark({
  slug: "watertoren-ulft",
  base: BASE,
  // De toren als één node (schacht, consoles, waterkamer en dak), zodat de
  // export de waterkamer niet apart tot de grondplaat opvult; het complex is
  // een eigen bouwdeel op het maaiveld.
  nodes: [
    ["building:schacht-consoles-en-waterkamer", tower],
    ["building:beltmancomplex", complex],
  ],
  catalog: {
    name: "Watertoren Ulft",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Op de binnenplaats voor de toren; aan de andere drie kanten staat het complex.
    groundSamplePoints: [[0, -4.5], [-3, -5], [3, -5], [0, -8]],
    // Terugval voor uitsnedes zonder de binnenplaats: PDOK-terreinhoogte op de
    // binnenplaats, ellipsoïdisch, gemeten op de kaart op 2026-11-01.
    groundHeight: 59.09,
    replacesBuildings: ["NL.IMBAG.Pand.1509100000186256"],
    description:
      "Oorsprong op het hart van de waterkamer in het AHN op het maaiveld van de binnenplaats (NAP +15,19 m), +X langs de gevel aan de binnenplaats (RD-richting 28,4 graden), -Y naar de binnenplaats. Vierkante schacht van 3,55 m met een rondboogvenster per zijde tot 17,0 m, hoekconsoles met gewelven tot de voetplaat op 18,95 m, waterkamer van 5,7 m met voetplaat en tandlijst, drie vensters per zijde, rondboogfries en kroonlijst van 6,2 m tot het platte dak op 25,2 m. De toren hoort bij BAG-pand 1509100000186256 (het hele Beltmancomplex); dat pand wordt vervangen en building:beltmancomplex is de 3D BAG-reconstructie (CC BY 4.0) van de rest ervan, zonder het torenblok.",
    realWorld: {
      built: 1913,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 40.51,
      roofM: H.roof,
      shaftWidthM: HALF.shaft * 2,
      tankWidthM: HALF.body * 2,
      corniceWidthM: HALF.cornice * 2,
      consoleFootM: H.shaftTop,
      tankFootM: H.slab,
      complexRoofNapM: COMPLEX_ROOF_NAP,
      photoScalePxPerM: [82.4, 44.3],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Ulft)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_het_waterreservoir_van_de_watertoren_-_Ulft_-_20530862_-_RCE.jpg (waterkamer, consoles, maten)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Ulft_-_20530905_-_RCE.jpg (hele toren, hoogtes)",
      "https://commons.wikimedia.org/wiki/File:2025-02-08_Water_tower_DRU_Ulft_ZvD_01.jpg (huidige staat, schachtvensters)",
      "PDOK BAG-pand 1509100000186256, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
      "3DBAG (3DGI en TU Delft), pand NL.IMBAG.Pand.1509100000186256, LoD2.2-dakvlakken, CC BY 4.0, 2026-11-01",
    ],
  },
});

// ---------- data: dakvlakken van het Beltmancomplex ----------
// 3D BAG LoD2.2 (CC BY 4.0, 3DGI en TU Delft) van BAG-pand
// NL.IMBAG.Pand.1509100000186256, opgehaald 2026-11-01 van
// https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1509100000186256.
// Per dakvlak de buitenring als x, y, z: x en y in meters ten opzichte van
// ORIGIN langs de RD-assen, z in NAP. De gaten in drie dakvlakken zijn de
// hogere dakvlakken die er zelf in staan en zijn weggelaten. Het vlak op
// NAP +40,4 is het torenblok; het script vervangt het door het complexdak.
function beltmanRoofs() {
  return [
    [-22.62, -71.81, 21.8, -21.43, -71.17, 21.56, -27.64, -59.55, 21.53, -29.88, -60.75, 21.99],
    [-42.77, -54.33, 21.98, -31.15, -76.37, 21.82, -22.62, -71.81, 22.3, -29.88, -60.75, 22.33, -27.64, -59.55, 22.45, -24.89, -58.08, 22.61, -25.14, -57.63, 22.61, -27.84, -59.06, 22.46, -33, -49.38, 22.53],
    [-34.64, -46.31, 23.38, -44.27, -51.5, 23.33, -42.77, -54.33, 21.6, -33, -49.38, 21.5],
    [-42.03, -4.61, 20.42, -40.83, -6.85, 20.66, -6.56, 11.34, 20.63, -6.97, 12.72, 20.5, -5.92, 13.17, 20.51, -6.58, 14.37, 20.37],
    [-5.92, 13.17, 21.61, -5.29, 12.02, 21.7, 6.92, 18.5, 21.67, 3.57, 24.76, 21.18, -8.61, 18.25, 21.22, -7.9, 15.86, 21.39, -7.5, 16.06, 21.39, -6.58, 14.37, 21.52],
    [-1.68, -3.03, 40.4, -1.67, -3.26, 40.4, 3.62, -0.39, 40.39, 1.13, 3.76, 40.25, -3.59, 1.51, 40.26, -2.27, -3.35, 40.4],
    [-18.39, -69.55, 20.92, -24.89, -58.08, 20.7, -27.64, -59.55, 18.91, -21.43, -71.17, 18.95],
    [-6.58, 14.37, 18.86, -7.5, 16.06, 18.73, -7.9, 15.86, 18.73, -8.61, 18.25, 18.57, -44.13, -0.73, 18.6, -42.03, -4.61, 18.89],
    [-1.83, 14.94, 24, -2.53, 16.45, 24.21, -1.01, 18.42, 24.35, -2.55, 18.58, 24.46, -6.54, 16.55, 24.46, -4.45, 13.81, 24.03],
    [-5.29, 12.02, 26.02, -5.92, 13.17, 25.8, -6.97, 12.72, 25.89, -6.56, 11.34, 26.15],
    [1.28, 10.03, 26.2, 2.06, 9.2, 26.17, 2.9, 8.61, 26.12, 4.06, 9.29, 26.01, 2.52, 11.15, 26.08],
    [-46.51, -47.25, 20.62, -44.27, -51.5, 23.33, -34.64, -46.31, 23.38, -36.95, -41.96, 20.61],
    [-56.16, -28.85, 20.62, -56.2, -28.88, 20.62, -46.51, -47.25, 20.62, -36.95, -41.96, 20.61, -46.64, -23.78, 20.61, -56.19, -28.79, 20.62],
    [-33.47, -20.47, 24.53, -1.67, -3.26, 24.61, -1.68, -3.03, 24.61, -2.27, -3.35, 24.61, -3.59, 1.51, 24.59, 1.13, 3.76, 24.6, 3.62, -0.39, 24.63, 4.71, 0.2, 24.63, 22.1, -32.47, 24.82, -25.14, -57.63, 24.69, -24.89, -58.08, 24.7, -18.39, -69.55, 24.76, 37.9, -39.48, 24.91, 6.92, 18.5, 24.58, -5.29, 12.02, 24.55, -6.56, 11.34, 24.54, -40.83, -6.85, 24.45],
    [15.56, -39.66, 30.29, 13.35, -41.5, 30.27, 13.95, -43.25, 30.26, 14.64, -43.93, 30.25, 17.32, -42.79, 30.26, 16.51, -41.34, 30.28, 16.26, -39.95, 30.29, 15.87, -40.21, 30.29],
  ];
}

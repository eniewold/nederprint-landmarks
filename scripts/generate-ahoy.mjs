// Genereert een gedetailleerd, gesloten 3D-model van Rotterdam Ahoy: de Ahoy
// Arena met haar gewelfde dak (+30,7 m), een dakrand met verdiepte goot en een
// schuin aflopende muur, de oostkop met een hol dakveld (+17,7 tot +22 m), de
// evenementenhallen aan de westkant met tonvormige beuken (+12,6 m) en holle
// dakvelden (+10 m) gescheiden door ruggen met smalle dakgoten, de lange westhal,
// het nieuwe hoogbouwdeel (Ahoy Convention Centre, +20 tot +28,5 m) aan de
// noordwestkant, de zuidhal als tongewelf (+16 tot +20 m) en de noordkant van de
// Arena met een verdiept dakveld en een aflopend dak. Alle bouwdelen worden op hun
// BAG-contour afgesneden. De gebogen daken zijn dwarsprofielen (parabolen, ruggen,
// goten) uit het AHN-DSM op 0,25 m, uitgetrokken over de lengte van het bouwdeel
// (profileX / profileY); het dak van de Arena is de romp van gemeten AHN-hoogtes op
// een veelhoek (geen hoogteveld); het Mapbox-model is niet gebruikt. Alle maten in
// het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, Ã©Ã©n node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-ahoy.mjs              # 1:1000 (standaard)
//   node scripts/generate-ahoy.mjs --scale 2000
//
// Assenstelsel: oorsprong op het hart van de Arena (RD 93100, 433080) op
// maaiveldniveau (NAP -0,9 m), Z omhoog. +X loopt naar het oosten (2,25 graden
// gedraaid met de klok mee: RD-richting (0,9992, -0,0393)) en +Y naar het
// noorden, loodrecht daarop; de hallen zijn zo uitgelijnd.
//
// Bronnen: PDOK BAG-panden 0599100000232364 (de Arena, de hallen en de zuidhal)
// en 0599100100018688 (het nieuwe deel in het noordwesten); AHN DSM/DTM 0,5 en 0,25 m
// (PDOK WCS): de dwarsprofielen van de hallen (beuk A: parabool van 32 m breed, 1,2 m
// steek; beuk C: 33 m breed, 1,1 m steek; ruggen en goten op 0,25 m), de holle dakvelden
// (parabool van 48 m breed, bodem +10,05 m), het tongewelf van de zuidhal, de goot en de
// lip rond de Arena en de oostkop; de dakhoogtes van de overige blokken (op 1 m
// afgelezen, uit een indeling van het DSM in gebieden van gelijke hoogte), het dakprofiel
// van de Arena (+30,7 m op u 3 m; punten op 8 tot 9 m, mediaan over 3 m) en het
// maaiveld; Wikipedia; PDOK luchtfoto. Weggelaten: de installaties, lichtstraten en
// dakkapjes, het stalen vakwerk langs de zuidgevel van de zuidhal, de dunne
// luchtkanalen, de wagens op het terrein en de binnenhoven op de grond.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "ahoy");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
// Convexe veelhoek in plan met een dakvlak z = a x + b y + c, vanaf z0 omhoog.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([
    ...pts.map(([x, y]) => [x, y, z0]),
    ...pts.map(([x, y]) => [x, y, a * x + b * y + c]),
  ]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);

const SLUG = "ahoy";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP -0,9 m) ----------
const GROUND_NAP = -0.9;
const ORIGIN = [93100, 433080];
const X_AXIS = [0.999229, -0.03926]; // RD-richting -2,25 graden, langs de hallen
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// BAG-contouren (u, v), op 0,25 m vereenvoudigd: het hoofdpand (Arena, hallen
// en zuidhal) en het nieuwe deel in het noordwesten.
const MAIN_POLY = [
  [-263.9, -47.3], [-212.4, -47.4], [-212.5, -78.5], [-100.6, -78.6], [-100.6, -59.7], [-90.5, -59.7], [-90.2, -75.9], [-91.9, -75.9], [-92, -84], [-90.2, -84],
  [-90.9, -107.1], [-90.9, -132.3], [-74.5, -132.3], [-74.5, -133.9], [-70.1, -133.9], [-70, -132.3], [-53.7, -132.3], [-53.9, -107.2], [-54.1, -76.2], [-46.5, -76.3],
  [-46.5, -139.1], [-15.8, -139.2], [-15.8, -144.6], [7.2, -144.6], [7.2, -139.3], [44.2, -139.4], [44.2, -144.7], [67.2, -144.8], [67.2, -139.4], [98.1, -139.5],
  [98.3, -67.9], [91.1, -67.9], [91.1, -61.3], [62.7, -61.2], [62.6, -67.8], [-54.1, -67.5], [-54, -35.8], [-40.8, -36.2], [-38.9, -49.6], [4.9, -57.6],
  [48.7, -50], [50.2, -39.5], [62.8, -38], [66.9, -3.1], [62.6, 26.3], [51.7, 24.7], [48.9, 44], [51.1, 50.8], [24.2, 55.7], [19.1, 72.6], [-8.7, 72.6],
  [-13.9, 55.7], [-40.9, 51], [-41.1, 27.9], [-53.9, 28], [-52.1, 37.5], [-100.1, 37.5], [-100.1, 60.3], [-210.9, 60.6], [-211, 42.6], [-263.7, 42.7],
];
const NORTHWEST_POLY = [
  [-209.4, 68.6], [-144.9, 68.3], [-144.9, 60.4], [-100.1, 60.3], [-100.1, 37.5], [-48.7, 37.5], [-48.4, 153.5], [-109, 153.6], [-109, 146.4], [-134.4, 146.4],
  [-134.4, 132.5], [-148, 132.5], [-148, 120.4], [-188.3, 120.5], [-188.4, 115.2], [-196.7, 115.2], [-196.7, 109.6], [-203.8, 109.6], [-203.8, 98.5], [-209.3, 98.5],
];
// Dakblokken [u0, u1, v0, v1, z]: de dakhoogte boven het maaiveld, uit het
// AHN-DSM (gebieden van gelijke hoogte op 2 m afgelezen). De hallen, de zuidhal en
// de randen rond de Arena hebben een gebogen dak en staan hieronder apart.
const BLOCKS = [
  // Nieuwe deel in het noordwesten: de trapsgewijze koppen, de strook met luchtkanalen en
  // de oostvleugel (de hoge hal staat apart: dat dak is in v licht gewelfd).
  [-130, -102, 60, 68.4, 17.3],
  [-109, -101.9, 120, 153.6, 22.0],
  [-107.4, -101.9, 60.4, 120.2, 22.0],
  [-102, -90, 58, 154, 22.0],
  [-99.5, -91, 80, 121, 24.0],
  [-90, -48, 38, 153.5, 25.0],
  [-134, -109, 120, 146.4, 20.9],
  [-148, -134.5, 120.5, 133, 16.4],
  [-197, -188, 68.5, 115.5, 22.2],
  [-204, -196.5, 68.5, 110, 14.0],
  [-209.5, -203.5, 68.5, 99, 6.3],
  // Lage bouwdelen tussen de hallen en de Arena, met de lage verbindingen over de binnenhof.
  [-89, -48, -18, 40, 15.1],
  [-100.1, -91.5, 25, 36.5, 7.0],
  [-100.1, -91.5, -5, 0, 7.3],
  [-100.1, -93, 38.5, 60.4, 3.9],
  [-102, -50, -102, -16, 7.4],
  [-91, -54, -134, -100.5, 14.0],
  [-76.3, -68.2, -119.7, -103.8, 14.5],
  [-89, -85.3, -108.2, -103.7, 16.7],
  [-59.6, -55.6, -108.6, -104.2, 16.7],
  // Verbinding tussen de middenblokken en de zuidhal (BAG-contour, 7,6 m breed).
  [-55, -46, -78, -66, 7.4],
  // Lage dakrand ten oosten van de Arena en de lage gevelband langs de zuidmuur.
  [50, 67, -42, 26, 8.3],
  [-45, 52, -60, -40, 7.6],
  // Lage aanbouw tegen de noordgevel van de zuidhal.
  [62.5, 91.5, -68.5, -61, 3.9],
  // Vier technische kasten op de dakrug van de middenblokken (4 bij 3 m, +13,2 m).
  [-72.4, -68.4, -25.5, -22.5, 13.2],
  [-72.4, -68.4, -34.5, -31.5, 13.2],
  [-72.4, -68.4, -43.5, -40.5, 13.2],
  [-72.4, -68.4, -52.5, -49.5, 13.2],
  // Dakopbouw boven de middenblokken (7 bij 32 m, +18,8 m).
  [-71.4, -64.4, -13.7, 18.3, 18.8],
  // Entreeblokken aan de zuidgevel van de zuidhal.
  [-16, 7.5, -145, -139, 13.2],
  [44, 67.5, -145, -139, 13.2],
];
// De Arena in het midden. De buitenmuur (de wand van het dak) heeft een knik naar
// buiten (punt op u = 6 m, v = -52,8 m aan de zuid- en +47,2 m aan de noordkant) en
// loopt van u = -40,5 tot 46,3 m. Daarbinnen ligt eerst een dakrand op +22 tot +23,4
// m (de lip) met een smalle verdiepte goot (5 tot 7 m van de muur), dan het gewelfde
// dak (de binnenpunten zijn het AHN-DSM, 3 m mediaan, [u, v, z] boven het maaiveld;
// de randpunten liggen op de goot). Ten westen daarvan ligt een lagere dakbox (u =
// -54 tot -40 m, v = -36 tot 28 m) die in het dak overloopt.
const DOME_MAIN = {
  rim: [
    [-40.0, -37.8, 21.5], [-32.2, -39.2, 22.1], [-24.4, -40.5, 22.1], [-16.5, -41.9, 22.4], [-8.7, -43.3, 22.5], [-0.9, -44.6, 22.7],
    [4.0, -45.5, 22.7], [6.9, -45.6, 22.5], [14.7, -44.3, 22.6], [22.5, -42.9, 22.4], [30.4, -41.5, 22.2], [38.2, -40.2, 22.1],
    [46.0, -38.8, 21.8], [46.3, -29.8, 25.0], [46.3, -20.8, 27.1], [46.3, -11.9, 28.3], [46.3, -2.9, 28.7], [46.3, 6.1, 28.3],
    [46.3, 15.1, 27.0], [46.3, 24.0, 24.9], [46.0, 33.0, 21.8], [38.2, 34.4, 22.1], [30.4, 35.8, 22.2], [22.5, 37.2, 22.5],
    [14.7, 38.6, 22.6], [6.9, 40.0, 22.5], [4.0, 39.9, 22.5], [-0.9, 39.0, 22.7], [-8.7, 37.7, 22.6], [-16.5, 36.4, 22.3],
    [-24.4, 35.0, 22.1], [-32.2, 33.7, 22.0], [-40.0, 32.4, 21.6], [-40.0, 23.6, 24.6], [-40.0, 14.8, 26.5], [-40.0, 6.0, 27.7],
    [-40.0, -2.7, 28.2], [-40.0, -11.5, 27.7], [-40.0, -20.3, 26.5], [-40.0, -29.1, 24.6],
  ],
  inner: [
    [3.0, 0.0, 30.7],
    [-32.0, -36.0, 23.0], [-32.0, -27.0, 25.8], [-32.0, -18.0, 27.7], [-32.0, -9.0, 28.6], [-32.0, 0.0, 28.8], [-32.0, 9.0, 28.1],
    [-32.0, 18.0, 26.5], [-32.0, 27.0, 24.1], [-24.0, -36.0, 23.8], [-24.0, -27.0, 26.5], [-24.0, -18.0, 28.4], [-24.0, -9.0, 29.3],
    [-24.0, 0.0, 29.5], [-24.0, 9.0, 28.8], [-24.0, 18.0, 27.3], [-24.0, 27.0, 24.8], [-16.0, -36.0, 24.4], [-16.0, -27.0, 27.1],
    [-16.0, -18.0, 28.9], [-16.0, -9.0, 29.9], [-16.0, 0.0, 30.0], [-16.0, 9.0, 29.4], [-16.0, 18.0, 27.9], [-16.0, 27.0, 25.5],
    [-8.0, -36.0, 25.1], [-8.0, -27.0, 27.6], [-8.0, -18.0, 29.3], [-8.0, -9.0, 30.2], [-8.0, 0.0, 30.4], [-8.0, 9.0, 29.7],
    [-8.0, 18.0, 28.3], [-8.0, 27.0, 26.0], [0.0, -36.0, 25.6], [0.0, -27.0, 28.0], [0.0, -18.0, 29.6], [0.0, -9.0, 30.5],
    [0.0, 0.0, 30.6], [0.0, 9.0, 30.0], [0.0, 18.0, 28.6], [0.0, 27.0, 26.5], [0.0, 36.0, 23.5], [8.0, -36.0, 25.7],
    [8.0, -27.0, 28.1], [8.0, -18.0, 29.7], [8.0, -9.0, 30.5], [8.0, 0.0, 30.6], [8.0, 9.0, 30.0], [8.0, 18.0, 28.7],
    [8.0, 27.0, 26.6], [8.0, 36.0, 23.7], [16.0, -36.0, 25.2], [16.0, -27.0, 27.8], [16.0, -18.0, 29.5], [16.0, -9.0, 30.3],
    [16.0, 0.0, 30.5], [16.0, 9.0, 29.8], [16.0, 18.0, 28.4], [16.0, 27.0, 26.1], [24.0, -36.0, 24.6], [24.0, -27.0, 27.3],
    [24.0, -18.0, 29.1], [24.0, -9.0, 30.0], [24.0, 0.0, 30.1], [24.0, 9.0, 29.5], [24.0, 18.0, 28.0], [24.0, 27.0, 25.6],
    [32.0, -36.0, 24.0], [32.0, -27.0, 26.7], [32.0, -18.0, 28.5], [32.0, -9.0, 29.5], [32.0, 0.0, 29.6], [32.0, 9.0, 28.9],
    [32.0, 18.0, 27.4], [32.0, 27.0, 25.0], [40.0, -36.0, 23.3], [40.0, -27.0, 26.1], [40.0, -18.0, 27.9], [40.0, -9.0, 28.9],
    [40.0, 0.0, 29.0], [40.0, 9.0, 28.3], [40.0, 18.0, 26.7], [40.0, 27.0, 24.3],
  ],
};
const DOME_BOX = {
  rim: [
    [-54.3, -35.4, 22.2], [-46.4, -35.4, 22.3], [-39.0, -35.4, 22.9], [-39.0, -26.4, 25.1], [-39.0, -17.5, 26.8], [-39.0, -8.5, 27.7],
    [-39.0, 0.5, 27.8], [-39.0, 9.5, 27.1], [-39.0, 18.4, 25.7], [-39.0, 27.4, 23.6], [-46.4, 27.4, 23.1], [-54.3, 27.4, 22.1],
    [-54.3, 18.4, 24.2], [-54.3, 9.5, 25.5], [-54.3, 0.5, 26.0], [-54.3, -8.5, 25.9], [-54.3, -17.5, 25.2], [-54.3, -26.4, 23.7],
  ],
  inner: [
    [-50.0, -27.0, 23.9], [-50.0, -18.0, 25.5], [-50.0, -9.0, 26.3], [-50.0, 0.0, 26.4], [-50.0, 9.0, 25.9], [-50.0, 18.0, 24.6],
    [-50.0, 27.0, 22.5], [-44.0, -27.0, 24.6], [-44.0, -18.0, 26.3], [-44.0, -9.0, 27.1], [-44.0, 0.0, 27.3], [-44.0, 9.0, 26.6],
    [-44.0, 18.0, 25.2], [-44.0, 27.0, 23.2],
  ],
};
// Maaiveld (AHN NAP -0,9 tot -0,5 m) rond het complex.
const GROUND_SAMPLES = [[0, -160], [60, -155], [110, -60], [60, 100], [-240, -60], [-70, -150]];

// ---------- dwarsprofielen (gebogen daken) ----------
// Een dwarsprofiel is een lijn [x, z] van west naar oost (of van zuid naar noord);
// section() sluit hem af met de onderkant op BASE.
const section = (top) => [[top[0][0], BASE], [top[top.length - 1][0], BASE], ...[...top].reverse()];
// Bolle parabool (tonvormig dak) van uc - h tot uc + h: voet z0, steek in het midden.
const arch = (uc, h, z0, steek, n) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const x = uc - h + (2 * h * i) / n;
    return [x, z0 + steek * Math.max(0, 1 - ((x - uc) / h) ** 2)];
  });
// Holle parabool (dakgoot): bodem zf in het midden uc, op uc +- h de hoogte zr.
const trough = (uc, h, zf, zr, n) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const x = uc - h + (2 * h * i) / n;
    return [x, zf + (zr - zf) * Math.min(1, ((x - uc) / h) ** 2)];
  });

// De evenementenhallen in het westen. Het dak is overal over de hele lengte (v)
// hetzelfde dwarsprofiel, behalve de verdiepte dakvelden. Van west naar oost: de
// lange hal (vlak, met een lichte welving in v en een goot bij u = -219 m), een
// rug met een smalle goot (u = -208,5 m), beuk A (tonvormig, 32 m breed, +1,2 m
// steek, daken tussen de goten op +11,4 m), een rug met een smalle goot (u =
// -156 m), beuk C (tonvormig, 33 m breed), en de oostrand met een goot (u = -103
// m). In de middelste strook (v = -11,4 tot 6,2 m) liggen de beuken er omgekeerd
// bij: een hol dakveld van 48 m breed, 2,7 m onder de ruggen. Aan de zuidkant
// (v < -71,8 m) en de noordkant van beuk A (v > 54,5 m) is het dak ook hol, met de
// bodem op +9,6 tot +10 m. Alle maten zijn uit het AHN-DSM (0,25 m) afgelezen.
const RIDGE_A = [-206.6, -158.5, 12.72];
const RIDGE_C = [-153.0, -105.8, 12.85];
const hallTop = ({ long = "main", a = "barrel", c = "barrel" }) => {
  const west =
    long === "strip"
      ? [
          [-264, 9.58], [-232, 9.58], [-230.5, 9.69], [-226.5, 10.0], [-222.5, 10.53], [-218.5, 11.2], [-215.5, 11.87],
          [-212.5, 12.5], [-211.5, 12.68],
        ]
      : [
          [-264, 12.45], [-235, 12.45], [-231.5, 12.4], [-228, 12.27], [-224, 11.99], [-221, 11.65], [-218.8, 11.35],
          [-217.5, 11.48], [-211.5, 12.67],
        ];
  // Een beuk: tonvormig (parabool) of, met een getal, een hol dakveld met die bodemhoogte.
  const bay = (mode, [r0, r1, zr], zt, uc, h, steek) =>
    typeof mode === "number"
      ? trough((r0 + r1) / 2, (r1 - r0) / 2, mode, zr, 24)
      : [[r0, zr], ...arch(uc, h, zt, steek, 16), [r1, zr]];
  return [
    ...west,
    [-210.7, 12.55], [-209.6, 11.95], [-208.5, 11.67], [-207.5, 12.2],
    ...bay(a, RIDGE_A, 11.385, -182.1, 16.3, 1.215),
    [-157.8, 12.7], [-157.3, 12.1], [-156.6, 11.62], [-155.7, 11.58], [-154.9, 12.1], [-154.2, 12.55],
    ...bay(c, RIDGE_C, 11.515, -129.35, 16.35, 1.105),
    [-105.2, 12.7], [-104.4, 12.0], [-103.7, 11.75], [-102.7, 11.72], [-102.0, 11.95], [-101.4, 12.1], [-100.0, 12.1],
  ];
};
const hallZone = (v0, v1, opts) => profileY(section(hallTop(opts)), v0 - 0.01, v1 + 0.01);
const westHalls = Manifold.union([
  hallZone(-78.8, -71.8, { a: 9.8, c: 10.0 }),
  hallZone(-71.8, -47.5, {}),
  hallZone(-47.5, -42.5, { long: "strip" }),
  hallZone(-42.5, -11.4, {}),
  hallZone(-11.4, 6.2, { a: 10.05, c: 10.05 }),
  hallZone(6.2, 36.5, {}),
  hallZone(36.5, 42.8, { long: "strip" }),
  hallZone(42.8, 54.5, {}),
  hallZone(54.5, 60.6, { a: 9.6 }),
  // De lange hal is in v een flauwe boog (+0,33 m steek over 79 m), die bij u = -235 m
  // vlak uitloopt.
  Manifold.intersection(
    profileY([[-235, 12.4], [-235, 12.45], [-264, 13.9], [-264, 12.4]], -42.3, 36.4),
    profileX(
      [
        [-42.3, 12.4],
        ...Array.from({ length: 17 }, (_, i) => {
          const v = -42.3 + (78.7 * i) / 16;
          return [v, 12.45 + 0.33 * Math.max(0, 1 - ((v + 2.95) / 39.35) ** 2)];
        }),
        [36.4, 12.4],
      ],
      -264,
      -234.9,
    ),
  ),
]);

// De zuidhal: een tongewelf langs u met bolle schouders (+16 tot +19 m in 10 m) en
// een nok op +20,0 m bij v = -104,5 m; het dwarsprofiel is over de hele lengte gelijk.
const SOUTH_HALL = [
  [-139.6, 15.9], [-138.5, 16.3], [-137.5, 16.78], [-135.5, 17.44], [-133.5, 18.05], [-131.5, 18.41], [-129.5, 18.73],
  [-127.5, 19.01], [-124, 19.2], [-119.5, 19.37], [-113.5, 19.61], [-107.5, 19.86], [-104.5, 19.98], [-99.5, 19.86],
  [-94.5, 19.65], [-90.5, 19.29], [-84.5, 19.05], [-79.5, 18.84], [-75.5, 18.21], [-71.5, 17.23], [-68.5, 16.11], [-67.2, 15.9],
];
const southHall = profileX(section(SOUTH_HALL), -47, 98.5);

// Buitenmuur van de Arena (zie verderop): knik op u = 6 m, v = -52,8 m (zuid) en +47,2 m (noord).
const WALL_S = (u) => (u < 6 ? -52.8 + (6 - u) * 0.173 : -52.8 + (u - 6) * 0.175);
const WALL_N = (u) => (u < 6 ? 47.2 - (6 - u) * 0.17 : 47.2 - (u - 6) * 0.18);
// Noordkant van de Arena: een verdiept dakveld, een trapeziumvormige goot tussen
// twee hoge delen (+13 m): flanken van 16 graden en een bodem op +8,6 tot +9 m,
// 37 m breed; daarachter de noordneus met een aflopend dak (+9,0 naar +6,9 m).
const NORTH_TROUGH = [[-42, 13.0], [-27, 13.0], [-13, 9.05], [2, 8.62], [23.5, 9.05], [36.5, 12.75], [49, 13.05]];
const northTrough = profileY(section(NORTH_TROUGH), 36, 56.2);
// Tussen de Arena en dat dakveld loopt een smalle spleet (2,5 m breed, bodem op +7,4 m).
const northGap = Manifold.extrude(
  new CrossSection([
    ccw([
      [-41, WALL_N(-41) + 0.8], [6, WALL_N(6) + 0.8], [49, WALL_N(49) + 0.8],
      [49, WALL_N(49) + 3.3], [6, WALL_N(6) + 3.3], [-41, WALL_N(-41) + 3.3],
    ]),
  ]),
  40,
).translate([0, 0, 7.4]);
const northNose = profileX(section([[54.5, 9.01], [73, 6.85]]), -14.6, 25);

// De hoge hal in het noordwesten: het dak is in v een flauwe boog (+0,5 m steek over 51 m),
// het oostelijke deel ligt 0,5 m hoger dan het westelijke.
const highHall = Manifold.union(
  [[-190, -162.9, 27.53], [-163, -107.2, 28.0]].map(([u0, u1, z0]) =>
    profileX(section([...arch(94, 25.7, z0, 0.5, 12), [122, z0]]), u0, u1),
  ),
);
// Lage middenblokken: een dakrug (trapezium, +2,4 m) over 41 m lengte.
const midRidge = profileY([[-75.6, 6], [-75.6, 7.8], [-73.5, 10.0], [-70.2, 10.2], [-68.2, 7.8], [-68.2, 6]], -58.5, -17.5);
// Lager dak aan de noordkant van de hallen: een vlak dat van +5,7 naar +7,6 m loopt.
const lowWing = planeRoof([[-191, 60.4], [-130, 60.4], [-130, 68.4], [-191, 68.4]], BASE, [0.035, 0, 12.3]);

// De oostkop van de Arena: een hol dakveld (parabool, +17,7 m in het midden tot
// +22 m aan de uiteinden) over de smalle strook tussen het hoge dak en de rand.
const HEAD_POLY = [
  [45.8, -44.3], [49.2, -44], [50.5, -38], [52, -30], [53.5, -22], [54.7, -14], [56, -6], [56.2, 2], [54.7, 10],
  [54, 14], [53.2, 18], [52.4, 22], [52, 26], [51.2, 30], [50.4, 34], [49.8, 38], [45.8, 38.6],
];
const headTop = Array.from({ length: 23 }, (_, i) => {
  const v = -44.5 + (84 * i) / 22;
  return [v, 17.65 + 0.00253 * (v + 3) ** 2];
});
const eastHead = Manifold.intersection(profileX(section(headTop), 45, 55), prism(HEAD_POLY, BASE - 1, 40));

// ---------- gebouwen ----------
const footprint = Manifold.union([prism(MAIN_POLY, BASE - 1, 80), prism(NORTHWEST_POLY, BASE - 1, 80)]);
const blocks = Manifold.union(BLOCKS.map(([u0, u1, v0, v1, z]) => box(u0, u1, v0, v1, BASE, z)));
const halls = Manifold.intersection(
  Manifold.union([blocks, westHalls, southHall, Manifold.difference(northTrough, northGap), northNose, midRidge, lowWing, highHall]),
  footprint,
);
// Een romp op het dak: de randpunten krijgen een wand tot de onderkant.
const domeHull = ({ rim, inner }) =>
  Manifold.hull([...rim, ...inner, ...rim.map(([u, v]) => [u, v, BASE])]);
const ARENA_U = [-40.5, 46.3];
const arenaPoly = (dS, dN) => [
  [ARENA_U[0], WALL_S(ARENA_U[0]) + dS], [6, WALL_S(6) + dS], [ARENA_U[1], WALL_S(ARENA_U[1]) + dS],
  [ARENA_U[1], WALL_N(ARENA_U[1]) - dN], [6, WALL_N(6) - dN], [ARENA_U[0], WALL_N(ARENA_U[0]) - dN],
];
// De dakrand (lip): +23,4 m bij de knik, +22,1 m aan de uiteinden; daarin een goot van
// 4 m breed en 1 m diep, 3 tot 7 m binnen de muur.
const lip = (u) => 23.4 - 0.031 * Math.abs(u - 4);
const skirtSlab = Manifold.intersection(
  profileY([[-41, BASE], [47, BASE], [47, lip(47)], [4, 23.4], [-41, lip(-41)]], -60, 60),
  prism(arenaPoly(0.8, 0.8), BASE - 1, 40),
);
const gutter = Manifold.intersection(
  Manifold.difference(prism(arenaPoly(3, 3), BASE - 1, 40), prism(arenaPoly(7, 7), BASE - 1, 40)),
  profileY([[-41, lip(-41) - 0.95], [4, 22.45], [47, lip(47) - 0.95], [47, 40], [-41, 40]], -60, 60),
);
// De muur helt naar buiten (3,3 m over 15 m hoogte aan de zuidkant, 2,3 m aan de noordkant)
// tot de lage band op +7,6 m.
const leanWall = Manifold.intersection(
  Manifold.hull([
    ...[ARENA_U[0], 6, ARENA_U[1]].flatMap((u) => [[u, WALL_S(u) + 0.8, lip(u)], [u, WALL_S(u) - 2.5, 7.2]]),
    ...[ARENA_U[0], 6, ARENA_U[1]].flatMap((u) => [[u, WALL_N(u) - 0.8, lip(u)], [u, WALL_N(u) + 1.5, 7.2]]),
  ]),
  footprint,
);
const dome = Manifold.union([Manifold.difference(skirtSlab, gutter), leanWall, domeHull(DOME_MAIN), domeHull(DOME_BOX)]);
// Vier ronde luchtkanalen op elk entreeblok van de zuidhal (2,4 m doorsnede, +16,7 m).
const ducts = Manifold.union(
  [-8.8, -5.9, -3.1, -0.2, 51.2, 54.1, 56.9, 59.8].map((u) => cylinder([u, -142.2], 1.2, 13.0, 16.7, 24)),
);
const complex = Manifold.union([halls, dome, eastHead, ducts]);
const nodes = [["building:complex", complex]];
const all = complex;

const META = {
  name: "Rotterdam Ahoy",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0599100000232364", "0599100100018688"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (93100,00, 433080,00), het hart van de Ahoy Arena, op het maaiveld (NAP -0,9 m), +X langs de hallen naar het oosten (-2,25 graden vanaf de RD-X-as) en +Y naar het noorden. EÃ©n node building:complex: de Arena met een gewelfd dak van +30,7 m (het AHN-profiel), een dakrand met verdiepte goot en een schuin aflopende muur, de oostkop met een hol dakveld (+17,7 tot +22 m), de evenementenhallen in het westen met twee tonvormige beuken (+12,6 m, 32 en 33 m breed), holle dakvelden (+10 m) en ruggen met smalle dakgoten, de lange westhal (+12,5 tot +12,8 m), het nieuwe deel in het noordwesten (+6 tot +28,5 m), de zuidhal als tongewelf (+16 tot +20 m), de noordkant van de Arena met een verdiept dakveld en een aflopend dak, en de lage bouwdelen en dakranden ertussen, alles afgesneden op de BAG-contouren. Onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van de twee BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    arenaRoofM: 30.7,
    westHallsM: [12.85, 12.6, 10.05],
    newWingM: [28.5, 25.0, 22.0],
    southHallM: [20.0, 16.0],
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Rotterdam_Ahoy",
    "PDOK BAG panden 0599100000232364 en 0599100100018688, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 en 0,25 m via WCS: de dwarsprofielen van de gebogen daken, de dakhoogtes per blok, het dak van de Arena en het maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR)",
  ],
};

// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan één stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
  }
}

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

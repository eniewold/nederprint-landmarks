// Genereert een vereenvoudigd, gesloten 3D-model van de Piraña (1983), de
// wildwaterbaan met ronde vlotten in het themagebied Anderrijk van de Efteling
// in Kaatsheuvel: het tempelcomplex van het station in Chimú-adobestijl (Chan
// Chan) met de ronde hal van de draaischijf, de vleugel met de tunnel naar de
// rivier, de betonnen goot van ruim 500 m met kademuren, de rotspartijen met de
// watervallen, de afgodsbeelden op het rotseiland, de Tolteekse krijgers op
// het plein, de twee themahuisjes en de lange houten brug over de Karpervijver.
// Alle maten in het script zijn meters op ware grootte. Uitvoer via
// scripts/efteling-kit.mjs: een GLB in meters (Y omhoog, nodes
// `klasse:label`), de catalogus-JSON en een binaire STL op 1:<schaal>.
//
//   node scripts/generate-efteling-pirana.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-pirana.mjs --scale 500
//
// Onderdelen (nodes):
// - building:station: BAG-pand 0809100000017607 met daken per zone (AHN-DSM):
//   de ronde hal met de draaischijf (straal 13,2 m) en het aansluitende blok
//   tot +17,4 m, het poortgebouw aan het plein tot +19,3 m met de grote
//   trapeziumvormige uitgang, het blok met de lift (+15,2 m binnen
//   borstweringen tot +17,7 m en twee torens tot +18,6 m), de lagere stroken
//   aan de kloof (+14,3 m) en op de noordwesthoek (+12,2 m), het noordoostblok
//   (+14,0 m), de tunnelvleugel langs de Kanovijver (+13,8 m) met toren
//   (+18,4 m), het binnenplaatsblok met twee torens (+17,5 m) en de
//   tunnelmond met twee torens (+17,3 m) en het kijkbalkon. Getrapte
//   Chan Chan-kantelen op de borstweringen, lisenen en trapeziumnissen op de
//   trommel, trapeziumnissen langs de gevels.
// - building:huisjes: de twee themahuisjes op het plein (BAG 0809100000017604
//   en 0809100000017605; volgens Eftepedia het trafohuisje en het lage
//   decorhuisje boven de wachtrij), adobe met getrapte kantelen.
// - building:beelden: de twee Tolteekse krijgers op het plein (ca. 5,9 m) en
//   de twee kwijlbeelden (Dioses Gárgola) op het rotseiland in het brede deel.
// - building:rotsen: de rotspartijen (luchtfoto: roodbruine kunstrots;
//   hoogtes uit het AHN-DSM): de hoge waterval op de zuidwesthoek van het
//   bassin (tot +16,6 m), de rotsen bij de bocht ten zuiden van het bassin,
//   de rotskloof langs de westgevel van het station, de rotsen bij het
//   bruggetje en op de oever, en het rotseiland onder de kwijlbeelden.
// - building:rivier: de kademuren langs de stroombedding (0,9 m dik) op de
//   oever van het PDOK-water van de baan: de lus om het Piraña-eiland, de
//   kloof, de bocht langs de waterval, de goot om het opslagbassin en de
//   scheidingsmuur. De bovenkant volgt het PDOK-maaiveld 1 tot 2,5 m buiten
//   de oever plus 0,3 m (minimaal +8,3 m, maximaal +12,2 m). Het water zelf
//   zit in het PDOK-terrein (NAP +6,9 m) en niet in het model.
// - building:brug: de houten brug van het station over de Karpervijver
//   (BGT-overbruggingsdeel, 51 m) met het dek van +13,7 naar +9,6 m en
//   schragen om de ~6 m.
//
// Printbaar op 1:1000 zonder steun: daken en torens staan recht op hun
// onderbouw, kantelen zijn blokken van 0,9 m, nissen zijn blinde
// trapeziumnissen van 0,35 m diep, rotsen en beelden lopen naar boven toe in;
// alleen het brugdek ligt vrij tussen de schragen (de export zet er een wig
// onder). Alle onderdelen beginnen op dezelfde vlakke onderkant op NAP +6,4 m,
// een halve meter onder het PDOK-water van de baan.
//
// Assenstelsel: oorsprong op RD (131592,1, 406524,68), het middelpunt van de
// ronde hal (cirkelboog van de BAG-contour), Z omhoog met z = 0 op het plein
// (NAP +9,97 m, PDOK-maaiveld op de groundSamplePoints). +X loopt langs de
// tunnelvleugel naar het oost-zuidoosten (RD-richting (0,77162, -0,63608),
// 39,5 graden met de klok mee vanaf de RD-X-as), +Y naar het noord-
// noordoosten, naar het plein en de Kanovijver. Het blok aan het plein staat
// 56,25 graden gedraaid op dat stelsel (stelsel B, zie hieronder).
//
// Bronnen: BAG-panden 0809100000017607 (station, 1981), 0809100000017604
// (1971) en 0809100000017605 (1978); BGT overbruggingsdeel (de brug); PDOK
// 3D-terrein (water van de baan op NAP +6,9 m, maaiveld langs de oevers);
// AHN DSM 0,5 m (PDOK WCS) als raster per 0,5 m in het lokale stelsel en in
// stelsel B: dakhoogtes per zone, torens, rotshoogtes, het brugdek; PDOK
// luchtfoto 8 cm (kunstrots, rotseiland, plaats van de krijgers via hun
// schaduw); Wikimedia Commons (Category:Piraña) voor de opstand; nl.wikipedia
// en Eftepedia (ritverloop, draaischijf van 18 m, tunnel van 65 m, baan
// 600 m, verval 3,5 m, themahuisjes, krijgers, kwijlbeelden).
// Geschat uit foto's: de kantelvorm, de lisenen en nissen (aantal en maat),
// de vorm en maat van de krijgers en kwijlbeelden, de rotsvormen (vlakken op
// de luchtfotocontour, top uit het DSM), de schragen van de brug en de
// hoogte van de kademuren (er is geen bron voor; ze volgen het PDOK-maaiveld).
import { CrossSection, Manifold, ccw, circle, downFaces, hull, prism, rect, ring3, union, writeLandmark } from "./efteling-kit.mjs";

// ---------- maten ----------
const ORIGIN = [131592.1, 406524.68];
const X_AXIS = [0.771625, -0.636078];
const GROUND_NAP = 9.97;
const Z = (nap) => nap - GROUND_NAP;
const BASE = Z(6.4);
const deg = Math.PI / 180;

// RD → lokaal stelsel.
const ANG = Math.atan2(X_AXIS[1], X_AXIS[0]);
const local = ([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [dx * Math.cos(ANG) + dy * Math.sin(ANG), -dx * Math.sin(ANG) + dy * Math.cos(ANG)];
};
// Stelsel B: het blok aan het plein (lift, poortgebouw, noordwesthoek) staat
// haaks op de westgevel aan de kloof. Oorsprong op de BAG-hoek RD
// (131570,18, 406536,16), a langs RD-richting 16,75 graden, b 90 graden linksom.
const B0 = local([131570.18, 406536.16]);
const BANG = (16.75 + 39.5) * deg;
const B = ([a, b]) => [B0[0] + a * Math.cos(BANG) - b * Math.sin(BANG), B0[1] + a * Math.sin(BANG) + b * Math.cos(BANG)];
const rectB = (a0, b0, a1, b1) => [B([a0, b0]), B([a1, b0]), B([a1, b1]), B([a0, b1])];

// BAG-pand 0809100000017607 (RD, boog vereenvoudigd op 4 cm).
const BAG_STATION_RD = [
  [131649.56, 406522.21], [131650.70, 406523.70], [131636.09, 406536.39], [131634.62, 406534.63],
  [131632.05, 406536.76], [131625.95, 406541.46], [131624.13, 406542.54], [131623.43, 406542.86],
  [131624.27, 406544.81], [131617.91, 406547.67], [131617.13, 406545.91], [131615.15, 406546.61],
  [131612.93, 406547.14], [131610.39, 406547.63], [131607.57, 406547.78], [131606.77, 406550.78],
  [131592.18, 406546.40], [131592.84, 406544.18], [131590.92, 406543.61], [131588.03, 406542.60],
  [131586.76, 406542.22], [131586.87, 406541.84], [131582.81, 406540.61], [131578.74, 406553.41],
  [131568.05, 406549.58], [131566.38, 406549.07], [131575.21, 406519.45], [131576.93, 406519.96],
  [131579.42, 406516.08], [131581.39, 406514.37], [131579.58, 406511.75], [131583.97, 406508.74],
  [131586.57, 406512.76], [131587.41, 406512.40], [131588.70, 406511.98], [131590.48, 406511.64],
  [131592.30, 406511.54], [131593.20, 406511.58], [131594.55, 406511.77], [131595.43, 406511.97],
  [131596.73, 406512.38], [131598.38, 406513.14], [131599.91, 406514.11], [131600.96, 406514.98],
  [131601.61, 406515.61], [131602.21, 406516.29], [131603.03, 406517.38], [131603.72, 406518.55],
  [131604.12, 406519.37], [131604.46, 406520.21], [131604.85, 406521.51], [131605.11, 406522.85],
  [131605.20, 406523.75], [131605.23, 406525.11], [131605.17, 406526.02], [131604.96, 406527.36],
  [131604.74, 406528.25], [131604.31, 406529.53], [131603.94, 406530.37], [131603.52, 406531.17],
  [131602.79, 406532.32], [131613.81, 406539.74], [131619.57, 406536.87], [131623.26, 406534.56],
  [131627.10, 406531.87], [131643.07, 406518.72], [131641.99, 406516.93], [131644.18, 406515.05],
  [131645.68, 406516.62], [131651.24, 406512.00], [131655.30, 406517.44],
];

// Oeverlijn van het PDOK-water van de baan (lokaal stelsel, vereenvoudigd op
// 0,35 m) met per punt het hoogste PDOK-maaiveld (NAP) 1 tot 2,5 m buiten de oever.
const RIVER = [
  [117.31, 9.64, 9.29], [110.05, 4.30, 9.51], [106.71, 2.85, 9.49], [102.35, 1.84, 9.46],
  [87.62, 0.07, 9.42], [86.14, -0.50, 9.67], [81.15, -0.73, 10.42], [79.67, -1.30, 10.67],
  [72.88, -1.71, 10.45], [65.64, -3.15, 10.41], [46.68, -4.52, 9.41], [42.26, -6.22, 9.58],
  [38.08, -9.02, 10.79], [37.38, -8.95, 10.17], [22.72, -21.03, 10.36], [22.01, -20.97, 9.92],
  [17.07, -24.40, 9.17], [14.89, -24.90, 9.29], [9.22, -24.71, 9.35], [7.18, -23.80, 9.13],
  [4.01, -23.49, 8.81], [3.17, -24.83, 9.38], [0.00, -24.53, 9.27], [-0.11, -22.03, 8.98],
  [-8.35, -19.11, 10.17], [-8.99, -18.34, 10.24], [-12.76, -16.91, 10.29], [-16.08, -14.46, 10.13],
  [-18.82, -13.48, 10.10], [-20.48, -12.26, 9.93], [-29.11, -9.65, 8.59], [-39.00, -9.05, 9.13],
  [-45.54, -10.55, 9.14], [-48.87, -12.01, 9.47], [-51.19, -13.92, 9.58], [-51.89, -13.85, 9.60],
  [-59.61, -20.21, 9.94], [-59.68, -20.91, 10.10], [-64.37, -25.43, 8.83], [-68.50, -31.43, 8.59],
  [-76.29, -38.50, 7.53], [-76.35, -39.20, 8.17], [-77.06, -39.13, 7.64], [-80.53, -41.99, 8.50],
  [-84.18, -43.06, 8.09], [-89.08, -42.24, 8.09], [-93.17, -40.42, 8.03], [-94.44, -38.88, 8.01],
  [-95.14, -38.81, 8.24], [-99.91, -33.02, 8.73], [-99.84, -32.32, 8.68], [-101.12, -30.78, 8.93],
  [-103.71, -24.49, 8.70], [-104.71, -20.13, 8.79], [-104.59, -15.17, 8.82], [-102.00, -10.45, 8.00],
  [-100.03, -1.05, 8.18], [-97.42, 7.58, 8.28], [-94.70, 13.71, 8.35], [-93.14, 18.89, 8.46],
  [-92.37, 19.53, 8.56], [-91.00, 22.59, 8.53], [-87.46, 26.16, 8.63], [-87.40, 26.86, 8.61],
  [-81.68, 30.93, 8.69], [-78.02, 32.00, 8.69], [-71.94, 32.48, 8.58], [-68.07, 32.11, 8.93],
  [-62.54, 30.51, 8.95], [-61.18, 33.57, 8.99], [-58.71, 33.34, 9.03], [-58.40, 32.95, 8.99],
  [-59.12, 29.11, 8.93], [-55.49, 26.28, 9.01], [-44.56, 21.67, 8.92], [-29.82, 12.44, 9.12],
  [-33.60, 6.41, 6.35], [-34.12, 4.69, 7.52], [-38.18, 6.85, 6.80], [-41.81, 9.69, 6.91],
  [-43.25, 9.47, 6.92], [-44.25, 2.82, 7.97], [-47.83, 2.45, 8.01], [-52.58, 1.13, 8.13],
  [-59.91, -4.91, 7.80], [-62.50, -9.63, 7.62], [-63.15, -12.77, 7.60], [-64.97, -16.85, 7.85],
  [-67.49, -20.87, 7.85], [-74.95, -28.32, 7.48], [-78.61, -29.39, 7.49], [-84.91, -28.43, 7.42],
  [-86.88, -26.82, 7.49], [-90.68, -18.28, 7.32], [-92.50, -11.36, 7.42], [-94.66, -7.96, 7.38],
  [-94.60, -3.70, 7.25], [-93.49, 0.46, 7.23], [-88.71, 9.59, 7.12], [-81.76, 15.31, 7.08],
  [-76.95, 17.33, 7.08], [-75.41, 18.61, 7.08], [-68.80, 20.81, 7.05], [-67.01, 20.99, 6.91],
  [-62.11, 20.17, 6.96], [-59.05, 18.81, 6.98], [-55.41, 15.97, 6.91], [-52.67, 15.00, 6.89],
  [-52.03, 14.22, 6.97], [-48.93, 13.21, 6.90], [-48.83, 14.27, 6.89], [-55.85, 18.85, 6.90],
  [-61.27, 21.51, 6.97], [-64.41, 22.16, 6.96], [-65.75, 23.00, 6.98], [-69.62, 23.38, 7.04],
  [-74.75, 21.74, 7.04], [-80.40, 18.38, 7.06], [-81.10, 18.44, 7.11], [-88.75, 12.79, 7.03],
  [-90.23, 12.22, 7.05], [-91.91, 9.54, 7.05], [-95.22, 0.98, 7.14], [-97.04, -10.57, 7.43],
  [-96.40, -11.34, 7.43], [-94.68, -11.86, 7.20], [-93.72, -13.02, 7.17], [-90.83, -23.60, 7.29],
  [-88.99, -26.62, 7.28], [-89.06, -27.32, 7.41], [-86.20, -30.79, 7.42], [-83.20, -32.86, 7.57],
  [-78.94, -32.91, 7.51], [-75.61, -31.46, 7.46], [-70.66, -28.03, 7.69], [-70.59, -27.32, 7.57],
  [-63.51, -20.19, 7.72], [-58.46, -8.25, 7.22], [-57.30, -7.29, 7.99], [-57.23, -6.59, 7.79],
  [-49.97, -1.25, 8.16], [-43.75, 0.64, 7.88], [-38.08, 0.45, 7.83], [-33.93, -0.66, 7.95],
  [-28.82, -2.93, 8.72], [-25.18, -5.77, 8.78], [-23.14, -6.67, 8.74], [-22.19, -7.83, 8.55],
  [-20.14, -8.74, 8.97], [-19.19, -9.89, 9.14], [-11.15, -14.93, 9.84], [-5.72, -17.59, 8.96],
  [-0.51, -18.80, 9.11], [-0.37, -17.39, 8.82], [0.40, -16.75, 10.36], [2.86, -16.99, 10.74],
  [3.04, -18.78, 10.05], [3.68, -19.56, 10.19], [10.05, -19.81, 10.01], [15.11, -18.88, 9.38],
  [18.58, -16.02, 9.45], [22.66, -6.82, 10.41], [26.86, -0.12, 10.56], [31.95, 4.72, 10.38],
  [32.01, 5.42, 10.37], [38.44, 9.42, 10.45], [42.79, 10.42, 10.01], [48.85, 10.55, 10.54],
  [62.52, 4.97, 10.19], [69.10, 3.27, 10.37], [73.68, 2.83, 10.47], [91.93, 4.27, 10.79],
  [103.92, 7.02, 10.79], [105.84, 8.61, 10.77], [108.50, 14.04, 11.17], [109.61, 18.19, 11.03],
  [110.12, 23.47, 11.10], [109.37, 26.74, 11.10], [106.19, 30.60, 10.75], [103.82, 31.89, 10.63],
  [101.39, 32.48, 10.60], [95.73, 32.67, 10.92], [94.25, 32.10, 11.19], [76.32, 30.28, 10.23],
  [65.49, 28.48, 10.40], [63.38, 28.68, 10.54], [55.11, 27.70, 11.71], [54.13, 28.51, 9.79],
  [53.93, 33.86, 9.25], [62.13, 34.13, 9.36], [74.36, 35.80, 9.46], [81.99, 37.55, 9.27],
  [99.70, 44.37, 9.55], [105.08, 44.92, 9.36], [110.36, 44.41, 9.59], [113.81, 43.36, 10.17],
  [116.81, 41.30, 9.94], [121.83, 34.42, 9.62], [124.53, 25.64, 9.66], [124.02, 20.36, 9.51],
  [122.21, 16.27, 9.44], [119.31, 11.93, 9.37], [117.38, 10.34, 9.30],
];

// Kunstrots: contour van de roodbruine rots op de luchtfoto (lokaal), per blok
// het 85e percentiel van het AHN-DSM (top) en het PDOK-maaiveld (ground), NAP.
const ROCKS = [
  { name: "waterval", top: 11.1, ground: 8.06, poly: [[-82.63, -47.23], [-85.91, -46.84], [-84.63, -42.15], [-82.73, -42.60], [-81.66, -43.55], [-82.07, -46.69]] },
  { name: "waterval", top: 14.8, ground: 7.96, poly: [[-87.95, -45.79], [-90.30, -45.86], [-91.79, -44.76], [-92.03, -43.62], [-90.72, -41.45], [-88.05, -41.75]] },
  { name: "waterval", top: 14.3, ground: 7.93, poly: [[-95.22, -41.49], [-95.97, -41.57], [-97.95, -39.17], [-97.41, -37.38], [-95.80, -36.92], [-93.88, -37.52]] },
  { name: "waterval", top: 16.6, ground: 7.86, poly: [[-87.52, -46.27], [-88.38, -45.69], [-88.40, -41.63], [-84.48, -42.02], [-85.42, -45.63]] },
  { name: "waterval", top: 14.7, ground: 7.93, poly: [[-91.83, -43.92], [-94.28, -43.30], [-95.66, -41.95], [-95.57, -41.05], [-92.85, -40.47], [-90.65, -41.44]] },
  { name: "zuidgeul", top: 12.4, ground: 7.44, poly: [[-43.37, 0.77], [-44.76, 1.71], [-43.67, 5.10], [-40.15, 4.84], [-40.00, 1.14]] },
  { name: "zuidgeul", top: 12.0, ground: 7.49, poly: [[-36.97, 0.52], [-40.35, 1.00], [-40.24, 4.83], [-37.83, 5.09], [-36.54, 3.60], [-36.25, 1.23]] },
  { name: "kloof", top: 14.8, ground: 9.78, poly: [[-8.55, -14.89], [-10.91, -14.85], [-12.11, -13.40], [-9.60, -10.14], [-7.41, -11.97]] },
  { name: "kloof", top: 14.4, ground: 8.69, poly: [[-22.70, -6.62], [-25.44, -4.82], [-25.44, -2.42], [-21.87, -5.08]] },
  { name: "kloof", top: 12.6, ground: 9.69, poly: [[-5.27, -25.44], [-6.46, -24.70], [-7.45, -22.43], [-7.26, -21.38], [-4.81, -20.25], [-2.98, -22.15], [-4.13, -24.75]] },
  { name: "kloof", top: 10.6, ground: 9.47, poly: [[-21.11, -14.91], [-23.57, -14.91], [-25.28, -13.82], [-25.71, -12.89], [-25.30, -11.11], [-23.03, -10.68], [-20.57, -11.99], [-20.19, -13.34]] },
  { name: "kloof", top: 15.3, ground: 9.11, poly: [[-6.39, -16.77], [-7.59, -16.71], [-8.99, -14.98], [-7.49, -11.76], [-4.37, -12.84]] },
  { name: "kloof", top: 12.7, ground: 10.09, poly: [[-18.31, -17.79], [-19.64, -16.56], [-19.51, -13.88], [-16.19, -14.50], [-16.08, -16.20]] },
  { name: "kloof", top: 14.1, ground: 8.66, poly: [[-19.51, -8.41], [-23.04, -6.79], [-22.15, -4.88], [-20.32, -5.42], [-18.64, -6.79]] },
  { name: "kloof", top: 14.5, ground: 9.16, poly: [[-17.96, -11.20], [-19.87, -8.37], [-18.81, -6.84], [-15.74, -8.47], [-16.58, -10.92]] },
  { name: "kloof", top: 14.4, ground: 9.87, poly: [[-11.57, -13.01], [-13.26, -12.63], [-13.93, -11.83], [-12.87, -8.41], [-9.38, -10.20]] },
  { name: "kloof", top: 14.5, ground: 9.27, poly: [[-15.50, -12.29], [-16.98, -10.94], [-16.16, -8.51], [-14.45, -7.96], [-12.89, -8.43], [-13.56, -12.04]] },
  { name: "kloof", top: 12.9, ground: 6.91, poly: [[-6.92, -21.61], [-8.63, -20.82], [-9.22, -18.74], [-6.73, -16.37], [-4.42, -17.86], [-4.71, -20.56]] },
  { name: "kloof", top: 9.7, ground: 6.9, poly: [[-16.18, -14.44], [-19.66, -14.29], [-20.60, -13.51], [-20.69, -12.54], [-18.25, -10.75], [-16.73, -10.73], [-15.78, -11.90]] },
  { name: "kloof", top: 13.0, ground: 10.16, poly: [[-10.86, -21.96], [-12.35, -21.34], [-13.14, -19.77], [-9.07, -18.44], [-8.15, -21.05]] },
  { name: "kloof", top: 13.1, ground: 10.23, poly: [[-15.62, -19.72], [-17.13, -19.61], [-18.48, -17.59], [-16.26, -15.89], [-15.41, -16.05], [-14.51, -17.83]] },
  { name: "kloof", top: 16.6, ground: 8.94, poly: [[-4.25, -18.12], [-6.60, -16.57], [-4.38, -12.62], [-3.12, -12.76], [-2.39, -13.61], [-2.08, -15.66], [-2.20, -16.42]] },
  { name: "kloof", top: 13.2, ground: 9.86, poly: [[-12.33, -19.82], [-12.99, -19.48], [-12.10, -16.05], [-8.89, -18.00], [-8.90, -18.84]] },
  { name: "brug", top: 10.9, ground: 8.88, poly: [[11.33, -26.77], [7.21, -26.51], [7.08, -24.08], [11.21, -25.40]] },
  { name: "brug", top: 11.4, ground: 8.86, poly: [[5.21, -27.91], [3.73, -27.62], [3.64, -24.09], [7.16, -23.98], [7.21, -26.78]] },
  { name: "eilandoever", top: 12.7, ground: 9.47, poly: [[42.53, 10.12], [41.13, 10.97], [41.57, 12.14], [42.88, 13.20], [47.94, 14.95], [47.90, 11.39]] },
];

// Themahuisjes (BAG, RD) met vloer en bovenkant (AHN-DSM).
const HUTS = [
  { id: "0809100000017604", floor: 10.0, top: 12.4, rd: [[131599.28, 406567.21], [131594.87, 406565.73], [131596.34, 406561.2], [131601.31, 406562.84], [131599.81, 406567.38]] },
  {
    id: "0809100000017605",
    floor: 9.1,
    top: 11.8,
    rd: [[131601.65, 406576.74], [131602.28, 406585.74], [131599.26, 406586.02], [131599.1, 406584.27], [131595.86, 406584.47], [131595.74, 406582.19], [131597.01, 406582.06], [131596.66, 406577.09]],
  },
];
// Brug over de Karpervijver (BGT-overbruggingsdeel, RD): hartlijn van de
// stationszijde naar de zuidoever, breedte 2,6 m; dek (AHN-DSM) van +13,7 naar +9,6 m.
const BRIDGE = { a: [131581.4, 406509.5], b: [131552.6, 406467.8], width: 2.6, topA: 13.7, topB: 9.6, thick: 1.0 };
// Tolteekse krijgers (RD, uit de schaduw op de luchtfoto) op het plein (NAP +9,9 m).
const WARRIORS = [[131585.1, 406561.2], [131590.1, 406561.2]];
// Rotseiland met de kwijlbeelden in het brede deel van de lus (luchtfoto).
const ISLAND = { c: [131618.0, 406500.6], len: 10.4, wid: 3.4, axisRd: 10, top: 10.7 };
// Maaiveld: punten op het bovenplein voor de poort en de noordwesthoek en op
// het terras ten zuiden van de hal (PDOK NAP +9,97 tot +10,13 m).
const GROUND_SAMPLES = [[-20, 22], [-25, 16], [-12, 26], [10, -16]];

// ---------- hulpfuncties ----------
const cs = (pts) => new CrossSection([ccw(pts)]);
const extrudeCs = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const FOOT_PTS = BAG_STATION_RD.map(local);
const FOOT = cs(FOOT_PTS);
const lrect = (u0, v0, u1, v1) => rect(u0, v0, u1, v1);

// Getrapte Chan Chan-kantelen langs de buitenrand van een doorsnede: per
// kanteel een onderblok van 1,6 m en een bovenblok van 0,9 m, elk 0,45 m hoog,
// `thick` naar binnen, om de ~`pitch` m.
function steppedMerlons(section, z0, { thick = 0.9, pitch = 3.0, step = 0.45 } = {}) {
  const out = [];
  for (const poly of section.toPolygons()) {
    const pts = poly.map((p) => [p[0], p[1]]);
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 2.0) continue;
      const d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
      const n = [-d[1], d[0]];
      const count = Math.max(1, Math.floor((len - 1.6) / pitch) + 1);
      const free = len - 1.6 - (count - 1) * pitch;
      for (let k = 0; k < count; k++) {
        const s = free / 2 + k * pitch;
        const blk = (s0, w, zb, zt) => {
          const p0 = [a[0] + d[0] * s0, a[1] + d[1] * s0];
          const p1 = [p0[0] + d[0] * w, p0[1] + d[1] * w];
          return prism([p0, p1, [p1[0] + n[0] * thick, p1[1] + n[1] * thick], [p0[0] + n[0] * thick, p0[1] + n[1] * thick]], zb, zt);
        };
        out.push(blk(s, 1.6, z0 - 0.05, z0 + step));
        out.push(blk(s + 0.35, 0.9, z0 + step - 0.05, z0 + 2 * step));
      }
    }
  }
  return out;
}
// Dakzone: doorsnede (lokaal) afgesneden op het BAG-pand, van de onderkant tot
// de dakhoogte (NAP), met een borstwering van 0,9 m dik en `parapet` m hoog en
// getrapte kantelen.
function roofZone(poly, top, { parapet = 0.6, merlons = true, foot = FOOT } = {}) {
  const section = cs(poly).intersect(foot);
  if (section.isEmpty()) return null;
  const t = Z(top);
  const inner = section.offset(-0.9, "Miter", 2);
  const parts = [extrudeCs(section, BASE, t)];
  if (parapet > 0) parts.push(extrudeCs(section.subtract(inner), t - 0.05, t + parapet));
  if (merlons && parapet > 0) {
    parts.push(union(steppedMerlons(section, t + parapet - 0.02)).intersect(extrudeCs(section, t + parapet - 0.1, t + parapet + 1.0)));
  }
  return union(parts);
}
// Blok zonder borstwering (torens, muren), afgesneden op het pand.
const block = (poly, top, foot = FOOT) => {
  const section = cs(poly).intersect(foot);
  return section.isEmpty() ? null : extrudeCs(section, BASE, Z(top));
};
// Blinde trapeziumnis (Inca-venster/-deur): (u, v) op het gevelvlak,
// buitennormaal in graden (lokaal), onderkant z0 (NAP), breedte onder wb en
// boven wt, hoogte h, diepte d.
function trapNiche([u, v], normal, z0, wb, wt, h, d = 0.35) {
  const prof = [[-wb / 2, 0], [wb / 2, 0], [wt / 2, h], [-wt / 2, h]];
  const pts = [];
  for (const depth of [-d, 0.4]) for (const [t, z] of prof) pts.push([t, depth, Z(z0) + z]);
  return hull(pts).rotate([0, 0, normal - 90]).translate([u, v, 0]);
}
// Rij nissen langs een gevel van p naar q (lokaal), buitennormaal links of rechts.
function nicheRow(p, q, normal, n, z0, wb, wt, h, d) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    out.push(trapNiche([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t], normal, z0, wb, wt, h, d));
  }
  return out;
}
const angleOf = (p, q) => (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180) / Math.PI;
// Reliëfpaneel dat 0,3 m uit de gevel steekt met een schuine onderkant van 45 graden.
function reliefPanel([u, v], normal, z0, z1, w, proud = 0.3) {
  const pts = [];
  for (const t of [-w / 2, w / 2]) {
    pts.push([t, -0.2, Z(z0)], [t, proud, Z(z0) + proud + 0.2], [t, proud, Z(z1)], [t, -0.2, Z(z1)]);
  }
  return hull(pts).rotate([0, 0, normal - 90]).translate([u, v, 0]);
}

// ---------- station ----------
const station = (() => {
  const parts = [];
  const cuts = [];
  const add = (m) => m && parts.push(m);
  // Ronde hal met de draaischijf en het aansluitende blok (+17,4 m).
  const HALL_R = 13.14;
  const hallCs = cs(circle([0, 0], HALL_R, 72));
  // Hal en blok vormen één dak; de borstwering loopt alleen langs de buitenrand.
  const hallRoof = hallCs.add(cs(rectB(13.5, -13, 31.8, 0.6)).intersect(FOOT));
  add(extrudeCs(hallRoof, BASE, Z(17.4)));
  add(extrudeCs(hallRoof.subtract(hallRoof.offset(-0.9, "Miter", 2)), Z(17.4) - 0.05, Z(17.4) + 0.6));
  // Getrapte kantelen op de trommel (de BAG-boog, oostzijde), lisenen en vensters.
  {
    for (let a = -66; a <= 66; a += 11) {
      const c = [Math.cos(a * deg), Math.sin(a * deg)];
      const t = [-c[1], c[0]];
      const P = (r, s) => [c[0] * r + t[0] * s, c[1] * r + t[1] * s];
      add(prism([P(HALL_R - 0.9, -0.8), P(HALL_R, -0.8), P(HALL_R, 0.8), P(HALL_R - 0.9, 0.8)], Z(17.4) + 0.55, Z(17.4) + 1.05));
      add(prism([P(HALL_R - 0.9, -0.45), P(HALL_R, -0.45), P(HALL_R, 0.45), P(HALL_R - 0.9, 0.45)], Z(17.4) + 1.0, Z(17.4) + 1.5));
    }
    // Lisenen (1,2 m breed, 0,4 m uit de gevel) en trapeziumvensters ertussen.
    for (let a = -60; a <= 60; a += 15) {
      const c = [Math.cos(a * deg), Math.sin(a * deg)];
      const t = [-c[1], c[0]];
      const P = (r, s) => [c[0] * r + t[0] * s, c[1] * r + t[1] * s];
      add(prism([P(HALL_R - 0.3, -0.6), P(HALL_R + 0.4, -0.6), P(HALL_R + 0.4, 0.6), P(HALL_R - 0.3, 0.6)], BASE, Z(17.4) + 0.6));
      if (a < 60) {
        const m = (a + 7.5) * deg;
        cuts.push(trapNiche([HALL_R * Math.cos(m), HALL_R * Math.sin(m)], a + 7.5, 13.2, 1.1, 0.8, 1.5));
      }
    }
  }
  // Liftblok (+15,2 m) met borstweringen tot +17,7 m en twee torens (+18,6 m).
  add(block(rectB(2.5, -9.6, 13.6, 9.6), 15.2));
  add(block(rectB(2.5, -9.6, 13.8, -8.7), 17.7));
  add(block(rectB(12.8, -9.6, 13.8, 0.9), 17.7));
  add(block(rectB(2.5, 0, 13.6, 0.9), 17.7));
  add(block(rectB(5.0, 8.7, 10.4, 9.6), 16.7));
  for (const [a0, a1] of [[2.5, 5.4], [10.0, 13.6]]) {
    add(block(rectB(a0, 6.3, a1, 9.6), 18.6));
    add(union(steppedMerlons(cs(rectB(a0, 6.3, a1, 9.6)).intersect(FOOT), Z(18.6) - 0.02, { pitch: 2.2 })));
  }
  // Strook langs de kloof (+14,3 m) en de noordwesthoek (+12,2 m).
  add(roofZone(rectB(0, -22, 2.6, 9.6), 14.3, { parapet: 0.4 }));
  add(roofZone(rectB(-0.5, 9.5, 15.7, 15), 12.2, { parapet: 0.5 }));
  // Poortgebouw aan het plein (+19,3 m) met de zijmuren (+17,7 / +18,5 / +16,7 m).
  add(roofZone(rectB(24, 0.4, 34, 3.75), 19.3, { parapet: 0, merlons: false }));
  add(union(steppedMerlons(cs(rectB(24, 0.4, 34, 3.75)).intersect(FOOT), Z(19.3) - 0.02, { pitch: 2.6 })));
  add(block(rectB(13.6, 0, 19, 1.5), 17.7));
  add(block(rectB(19, 0, 24.1, 1.6), 18.5));
  add(roofZone(rectB(33.9, -0.2, 37.6, 3.75), 16.7, { parapet: 0.4 }));
  // Grote uitgang (trapezium) met het Quetzalcoatl-paneel erboven, en nissen in de poortgevel.
  {
    const face = (a) => B([a, 3.5]);
    const nrm = (BANG / deg) + 90;
    cuts.push(trapNiche(face(29), nrm, 9.97, 3.6, 2.4, 4.6, 0.8));
    parts.push(reliefPanel(face(29), nrm, 15.4, 17.9, 3.4));
    cuts.push(trapNiche(face(25.6), nrm, 13.0, 1.0, 0.7, 1.6), trapNiche(face(32.4), nrm, 13.0, 1.0, 0.7, 1.6));
    cuts.push(...nicheRow(B([34.5, 3.5]), B([37.2, 3.5]), nrm, 1, 10.6, 1.1, 0.8, 1.8));
  }
  // Noordoostblok (+14,0 m) en zuidelijke uitbouw naar de brug (+14,0 m).
  add(roofZone(lrect(-10, 10, 7, 30), 14.0));
  add(roofZone(lrect(-12, -19, 4.6, -11), 14.0, { parapet: 0.5 }));
  // Tunnelvleugel langs de Kanovijver (+13,8 m) met borstwering en kantelen.
  add(roofZone(lrect(3, 24, 43.4, 38), 13.8, { parapet: 0.8 }));
  // Toren A (+18,4 m) met getrapte hoeken (+16,6 m).
  add(block(lrect(6.5, 26.6, 16.5, 31.3), 16.6));
  add(block(lrect(7.6, 26.6, 15.4, 31.3), 18.4));
  add(union(steppedMerlons(cs(lrect(7.6, 26.6, 15.4, 31.3)).intersect(FOOT), Z(18.4) - 0.02, { pitch: 2.4 })));
  // Binnenplaatsblok: twee torens (+17,5 m) met muren (+16,4 / +16,5 / +15,5 / +14,7 m).
  for (const r of [lrect(26.4, 27.6, 30.6, 30.6), lrect(26.0, 34.3, 31.0, 37.4)]) {
    add(block(r, 17.5));
    add(union(steppedMerlons(cs(r).intersect(FOOT), Z(17.5) - 0.02, { pitch: 2.2 })));
  }
  add(block(lrect(30.6, 34.9, 37.4, 37.4), 16.4));
  add(block(lrect(34.9, 27.6, 36.0, 35.2), 16.5));
  add(block(lrect(37.9, 27.6, 39.0, 35.6), 15.5));
  add(block(lrect(37.2, 35.4, 43.6, 37.4), 14.7));
  // Tunnelmond: twee torens (+17,3 m) en het kijkbalkon ertussen.
  add(block(lrect(43.5, 25.7, 46.6, 29.3), 17.3));
  add(block(lrect(43.3, 34.3, 46.1, 36.8), 17.3));
  for (const r of [lrect(43.5, 25.7, 46.6, 29.3), lrect(43.3, 34.3, 46.1, 36.8)]) {
    add(union(steppedMerlons(cs(r).intersect(FOOT), Z(17.3) - 0.02, { pitch: 2.0 })));
  }
  add(block(lrect(43.3, 28.9, 46.6, 34.5), 13.8));
  add(block(lrect(45.7, 28.9, 46.6, 34.5), 14.6));
  // Muren langs de eerste stroomversnelling achter de tunnelmond (BAG).
  add(block(lrect(46.4, 27.9, 53.9, 28.9), 12.9));
  add(block(lrect(46.0, 33.8, 53.6, 34.8), 11.4));
  // Tunnelopening (trapezium, blind 1 m diep) vanaf het water (+9,6 m).
  cuts.push(trapNiche([46.6, 31.35], 0, 9.6, 4.4, 3.4, 3.2, 1.0));
  // Trapeziumnissen langs de noordgevel van de vleugel (aan het pad en de vijver).
  {
    const fp = ccw(FOOT_PTS);
    for (let i = 0; i < fp.length; i++) {
      const p = fp[i];
      const q = fp[(i + 1) % fp.length];
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      // Noordgevel: lange randen boven v = 32 tussen u = 5 en 44, buitennormaal naar +v.
      if (len > 4 && mid[1] > 32 && mid[0] > 5 && mid[0] < 44) {
        const a = angleOf(p, q);
        const n = Math.max(1, Math.floor(len / 3.2));
        cuts.push(...nicheRow(p, q, a - 90, n, 10.4, 1.0, 0.7, 1.9));
      }
    }
  }
  // Ramen in de westgevel van het liftblok aan de kloof (stelsel B, a = 0).
  cuts.push(...nicheRow(B([0, -20]), B([0, 8]), BANG / deg + 180, 7, 11.4, 1.0, 0.7, 1.6));
  const solid = union(parts).subtract(union(cuts));
  return solid;
})();

// ---------- themahuisjes ----------
const huisjes = (() => {
  const out = [];
  const cuts = [];
  for (const h of HUTS) {
    const pts = ccw(h.rd.map(local));
    const section = cs(pts);
    out.push(extrudeCs(section, BASE, Z(h.top)));
    out.push(extrudeCs(section.subtract(section.offset(-0.9, "Miter", 2)), Z(h.top) - 0.05, Z(h.top) + 0.4));
    out.push(union(steppedMerlons(section, Z(h.top) + 0.38, { pitch: 2.2 })).intersect(extrudeCs(section, Z(h.top), Z(h.top) + 1.5)));
    // Deur in de langste gevel naar het plein (trapezium).
    let best = null;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length];
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      if (!best || len > best.len) best = { p, q, len };
    }
    const { p, q } = best;
    cuts.push(trapNiche([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], angleOf(p, q) - 90, h.floor, 1.2, 0.9, 2.0, 0.35));
  }
  return union(out).subtract(union(cuts));
})();

// ---------- beelden ----------
// Tolteekse krijger (atlant): voetstuk, vierkante romp, hoofd en vederkroon;
// de bovendelen lopen met kragen van 45 graden uit. Kijkt naar het plein (+b in stelsel B).
function warrior(rdPos) {
  const [u, v] = local(rdPos);
  const f = 9.9;
  const parts = [
    Manifold.cube([1.8, 1.8, Z(f) + 0.5 - BASE]).translate([-0.9, -0.9, BASE]),
    Manifold.cube([1.3, 1.1, 3.6]).translate([-0.65, -0.55, Z(f) + 0.45]),
    // Borstplaat en gordel als reliëf voor op de romp.
    hull([[-0.6, 0.5, Z(f) + 2.3], [0.6, 0.5, Z(f) + 2.3], [-0.6, 0.75, Z(f) + 2.55], [0.6, 0.75, Z(f) + 2.55], [-0.6, 0.75, Z(f) + 3.4], [0.6, 0.75, Z(f) + 3.4], [-0.6, 0.5, Z(f) + 3.4], [0.6, 0.5, Z(f) + 3.4]]),
    Manifold.cube([1.0, 0.95, 0.9]).translate([-0.5, -0.475, Z(f) + 4.0]),
    hull([[-0.5, -0.475, Z(f) + 4.85], [0.5, -0.475, Z(f) + 4.85], [-0.5, 0.475, Z(f) + 4.85], [0.5, 0.475, Z(f) + 4.85], [-0.6, -0.55, Z(f) + 4.95], [0.6, -0.55, Z(f) + 4.95], [-0.6, 0.55, Z(f) + 4.95], [0.6, 0.55, Z(f) + 4.95]]),
    Manifold.cube([1.2, 1.1, 0.95]).translate([-0.6, -0.55, Z(f) + 4.93]),
  ];
  return union(parts).rotate([0, 0, BANG / deg]).translate([u, v, 0]);
}
// Kwijlbeeld (Dios Gárgola): voet, gezichtsplaat met neus en een halfronde
// zonnekroon; 0,9 m dik, kijkt in richting `face` (graden, lokaal).
function idol([u, v], face, z0) {
  const d = 0.9;
  const parts = [
    Manifold.cube([2.3, 1.3, Z(z0) + 1.0 - BASE]).translate([-1.15, -0.65, BASE]),
    Manifold.cube([2.2, d, 2.0]).translate([-1.1, -d / 2, Z(z0) + 0.95]),
    // Zonnekroon: halve schijf met straal 1,1 m staand op de plaat.
    Manifold.cylinder(d, 1.1, 1.1, 24).rotate([90, 0, 0]).translate([0, d / 2, Z(z0) + 2.9]).intersect(Manifold.cube([3, d, 1.4]).translate([-1.5, -d / 2, Z(z0) + 2.9])),
    // Neus en mond als reliëf met een schuine onderkant.
    hull([[-0.25, d / 2 - 0.05, Z(z0) + 1.7], [0.25, d / 2 - 0.05, Z(z0) + 1.7], [-0.25, d / 2 + 0.3, Z(z0) + 2.0], [0.25, d / 2 + 0.3, Z(z0) + 2.0], [-0.2, d / 2 - 0.05, Z(z0) + 2.5], [0.2, d / 2 - 0.05, Z(z0) + 2.5]]),
  ];
  return union(parts).rotate([0, 0, face - 90]).translate([u, v, 0]);
}
const islandC = local(ISLAND.c);
const islandAxis = (ISLAND.axisRd + 39.5) * deg;
const beelden = (() => {
  const out = WARRIORS.map(warrior);
  const t = [Math.cos(islandAxis), Math.sin(islandAxis)];
  // De beelden kijken naar de kijkplek op het terras ten zuiden van de hal (noordwest).
  const face = islandAxis / deg + 90;
  for (const s of [-1.5, 1.5]) out.push(idol([islandC[0] + t[0] * s, islandC[1] + t[1] * s], face, ISLAND.top - 0.05));
  return union(out);
})();

// ---------- rotsen ----------
// Kunstrots als facetblok: de luchtfotocontour recht omhoog tot een derde van
// de hoogte, dan via een kleinere ring naar een scheve kop. Alles loopt naar
// boven toe in, dus geen overhang.
let seed = 7;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
function rockBlock(poly, ground, top) {
  const c = poly.reduce((s, p) => [s[0] + p[0] / poly.length, s[1] + p[1] / poly.length], [0, 0]);
  const scaled = (f, jit) => poly.map(([x, y]) => [c[0] + (x - c[0]) * (f + (rnd() - 0.5) * jit), c[1] + (y - c[1]) * (f + (rnd() - 0.5) * jit)]);
  const z1 = Z(ground + (top - ground) * 0.35);
  const z2 = Z(ground + (top - ground) * 0.75);
  const pts = [...ring3(poly, BASE), ...ring3(poly, z1)];
  for (const p of scaled(0.82, 0.12)) pts.push([p[0], p[1], z2 + (rnd() - 0.5) * 0.6]);
  for (const p of scaled(0.45, 0.2)) pts.push([p[0], p[1], Z(top) - rnd() * 0.7]);
  return hull(pts);
}
const rotsen = (() => {
  const out = [];
  for (const r of ROCKS) {
    const top = Math.min(17.0, Math.max(r.top, Math.max(r.ground, 8.7) + 1.8));
    out.push(rockBlock(r.poly, Math.max(r.ground, 8.0), top));
  }
  // Rotseiland onder de kwijlbeelden (10,4 × 3,4 m, kop op +10,7 m).
  const t = [Math.cos(islandAxis), Math.sin(islandAxis)];
  const n = [-t[1], t[0]];
  const isl = [];
  for (let k = 0; k < 10; k++) {
    const a = (2 * Math.PI * k) / 10;
    const s = (ISLAND.len / 2) * Math.cos(a) * (0.9 + 0.15 * rnd());
    const w = (ISLAND.wid / 2) * Math.sin(a) * (0.9 + 0.15 * rnd());
    isl.push([islandC[0] + t[0] * s + n[0] * w, islandC[1] + t[1] * s + n[1] * w]);
  }
  out.push(rockBlock(isl, 8.7, ISLAND.top));
  // Niet in het station (de rotsen liggen tegen de gevel aan de kloof).
  return union(out).subtract(extrudeCs(FOOT, BASE - 1, 40));
})();

// ---------- rivier ----------
// Kademuren van 0,9 m dik op de oeverlijn van het PDOK-water van de baan:
// per oeverstuk een blok met een schuine bovenkant die het maaiveld volgt en
// per hoekpunt een achtkante kolom, zodat de muur doorloopt.
const wallTop = (bank) => Math.min(12.2, Math.max(8.3, bank + 0.3));
const rivier = (() => {
  const out = [];
  const n = RIVER.length;
  for (let i = 0; i < n; i++) {
    const [u0, v0, b0] = RIVER[i];
    const [u1, v1, b1] = RIVER[(i + 1) % n];
    const len = Math.hypot(u1 - u0, v1 - v0);
    if (len < 1e-3) continue;
    const nx = (-(v1 - v0) / len) * 0.45;
    const ny = ((u1 - u0) / len) * 0.45;
    const t0 = Z(wallTop(b0));
    const t1 = Z(wallTop(b1));
    out.push(
      hull([
        [u0 + nx, v0 + ny, BASE], [u0 - nx, v0 - ny, BASE], [u1 + nx, v1 + ny, BASE], [u1 - nx, v1 - ny, BASE],
        [u0 + nx, v0 + ny, t0], [u0 - nx, v0 - ny, t0], [u1 + nx, v1 + ny, t1], [u1 - nx, v1 - ny, t1],
      ]),
    );
    out.push(prism(circle([u0, v0], 0.48, 8, Math.PI / 8), BASE, t0));
  }
  // Niet in of tegen het station (daar is de gevel de kademuur, en bij de
  // tunnelmond en de lift sluit het PDOK-water op het pand aan).
  return union(out).subtract(extrudeCs(FOOT.offset(0.7, "Miter", 2), BASE - 1, 40));
})();

// ---------- brug ----------
// Dek van 2,6 m breed en 1 m dik (dek met dichte borstwering), schragen van
// 0,9 m dik die naar onderen tot 4,4 m uitwaaieren, om de ~6 m buiten de goot,
// met schoren onder 45 graden naar het dek.
const brug = (() => {
  const a = local(BRIDGE.a);
  const b = local(BRIDGE.b);
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
  const n = [-t[1], t[0]];
  const at = (s, w) => [a[0] + t[0] * s + n[0] * w, a[1] + t[1] * s + n[1] * w];
  const top = (s) => Z(BRIDGE.topA + ((BRIDGE.topB - BRIDGE.topA) * s) / L);
  const out = [];
  const W = BRIDGE.width / 2;
  out.push(hull([at(0, -W), at(0, W), at(L, -W), at(L, W)].flatMap((p, k) => {
    const s = k < 2 ? 0 : L;
    return [[p[0], p[1], top(s)], [p[0], p[1], top(s) - BRIDGE.thick]];
  })));
  // Landhoofd aan de zuidoever.
  out.push(prism([at(L - 2.0, -W), at(L + 0.3, -W), at(L + 0.3, W), at(L - 2.0, W)], BASE, top(L) - 0.5));
  for (const s of [8.5, 14.5, 20.5, 26.5, 32.5, 38.5, 44.5]) {
    const zt = top(s) - BRIDGE.thick + 0.05;
    out.push(
      hull([
        [...at(s - 0.45, -2.2), BASE], [...at(s + 0.45, -2.2), BASE], [...at(s - 0.45, 2.2), BASE], [...at(s + 0.45, 2.2), BASE],
        [...at(s - 0.45, -W), zt], [...at(s + 0.45, -W), zt], [...at(s - 0.45, W), zt], [...at(s + 0.45, W), zt],
      ]),
    );
    // Schoren onder 45 graden van de schraag naar het dek (2 m hoog).
    out.push(
      hull([
        [...at(s - 0.45, -W), zt - 2.0], [...at(s + 0.45, -W), zt - 2.0], [...at(s - 0.45, W), zt - 2.0], [...at(s + 0.45, W), zt - 2.0],
        [...at(s - 2.45, -W), top(s - 2.45) - BRIDGE.thick + 0.05], [...at(s + 2.45, -W), top(s + 2.45) - BRIDGE.thick + 0.05],
        [...at(s - 2.45, W), top(s - 2.45) - BRIDGE.thick + 0.05], [...at(s + 2.45, W), top(s + 2.45) - BRIDGE.thick + 0.05],
      ]),
    );
  }
  // Kraag tegen de uitbouw van het station.
  {
    const zt = top(0) - BRIDGE.thick + 0.05;
    out.push(hull([[...at(-1, -W), zt - 2.0], [...at(0.5, -W), zt - 2.0], [...at(-1, W), zt - 2.0], [...at(0.5, W), zt - 2.0], [...at(-1, -W), zt], [...at(2.5, -W), zt], [...at(-1, W), zt], [...at(2.5, W), zt]]));
  }
  // Niet in het station.
  return union(out).subtract(extrudeCs(FOOT, BASE - 1, 40));
})();

// ---------- controle en wegschrijven ----------
const nodes = [
  ["building:station", station],
  ["building:huisjes", huisjes],
  ["building:beelden", beelden],
  ["building:rotsen", rotsen],
  ["building:rivier", rivier],
  ["building:brug", brug],
];
for (const [name, solid] of nodes) {
  const df = downFaces(solid, BASE).filter((g) => g.area > 0.5);
  console.log(name, "ondervlakken boven de onderkant (> 0,5 m2):", JSON.stringify(df));
}
const all = Manifold.union(nodes.map(([, s]) => s));
const bb = all.boundingBox();
await writeLandmark({
  slug: "efteling-pirana",
  nodes,
  base: BASE,
  catalog: {
    name: "Piraña (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: GROUND_SAMPLES,
    replacesBuildings: ["NL.IMBAG.Pand.0809100000017607", "NL.IMBAG.Pand.0809100000017604", "NL.IMBAG.Pand.0809100000017605"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (131592,1, 406524,68), het middelpunt van de ronde hal van het station, met z = 0 op het plein (NAP +9,97 m); +X loopt langs de tunnelvleugel naar het oost-zuidoosten (39,5 graden met de klok mee vanaf de RD-X-as), +Y naar het plein en de Kanovijver. Node building:station: BAG-pand 0809100000017607 met daken per zone uit het AHN (ronde hal en aansluitend blok +17,4 m, poortgebouw +19,3 m met de trapeziumvormige uitgang, liftblok +15,2 m met borstweringen +17,7 m en torens +18,6 m, kloofstrook +14,3 m, noordwesthoek +12,2 m, noordoostblok +14,0 m, tunnelvleugel +13,8 m met toren +18,4 m, binnenplaatsblok met torens +17,5 m, tunnelmond met torens +17,3 m), getrapte kantelen, lisenen en trapeziumnissen. Node building:huisjes: de twee themahuisjes op het plein. Node building:beelden: de Tolteekse krijgers en de kwijlbeelden op het rotseiland. Node building:rotsen: de kunstrots met de hoge waterval, de kloof en het rotseiland. Node building:rivier: kademuren van 0,9 m langs de stroombedding (bovenkant +8,3 tot +12,2 m, volgt het maaiveld). Node building:brug: de houten brug over de Karpervijver. Onderkant op NAP +6,4 m, onder het water van de baan; het water zit in het PDOK-terrein. Vervangt de PDOK-reconstructie van de drie BAG-panden.",
    realWorld: {
      lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
      widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
      highestPointNapM: +(bb.max[2] + GROUND_NAP).toFixed(2),
      hallRadiusM: 13.14,
      turntableDiameterM: 18,
      roofHeightsNapM: { hal: 17.4, poortgebouw: 19.3, liftblok: 15.2, liftblokTorens: 18.6, kloofstrook: 14.3, noordwesthoek: 12.2, noordoostblok: 14.0, tunnelvleugel: 13.8, torenVleugel: 18.4, binnenplaatsTorens: 17.5, tunnelmondTorens: 17.3 },
      waterfallRockTopNapM: 16.6,
      riverWallTopNapM: [8.3, 12.2],
      bridgeDeckNapM: [BRIDGE.topA, BRIDGE.topB],
      groundNapM: GROUND_NAP,
      pdokRiverWaterNapM: 6.9,
      baseNapM: +(GROUND_NAP + BASE).toFixed(2),
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Pira%C3%B1a_(Efteling)",
      "https://www.eftepedia.nl/lemma/Pira%C3%B1a",
      "https://commons.wikimedia.org/wiki/Category:Pira%C3%B1a",
      "PDOK BAG panden 0809100000017607 (station), 0809100000017604 en 0809100000017605 (themahuisjes), EPSG:28992",
      "PDOK BGT overbruggingsdeel (de brug over de Karpervijver)",
      "PDOK 3D-basisvoorziening terrein: water van de baan (NAP +6,9 m) en maaiveld langs de oevers",
      "PDOK AHN DSM 0,5 m via WCS: dakhoogtes per zone, torens, rotshoogtes en het brugdek",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR): kunstrots, rotseiland, krijgers (schaduw), gevels",
    ],
  },
});

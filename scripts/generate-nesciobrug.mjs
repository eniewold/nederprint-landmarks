// Genereert een vereenvoudigd, gesloten 3D-model van de Nesciobrug in Amsterdam:
// de hangbrug voor fietsers en voetgangers van WilkinsonEyre (2006) over het
// Amsterdam-Rijnkanaal tussen het Diemerpark
// (zuidwesten) en Zeeburgereiland/IJburg (noordoosten). De brug heeft een
// hoofdoverspanning van circa 167 m tussen twee slanke witte pylonen op de
// oevers, één hoofdkabel boven de zuidoostrand van het dek met hangers naar de
// rand van het fietsdek, en tuien van de pylontoppen naar het dek; het fietsdek
// slingert in plattegrond en loopt aan de zuidkant in een lus van 270 graden op
// kolommen naar het maaiveld en aan de noordkant in een lange helling langs de
// oever. Het voetpad ligt in het midden naast het fietspad op hetzelfde dek,
// splitst zich 53 m uit het midden af en eindigt bij elke pylon in een ovale
// trap. Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB
// in meters (Y omhoog, de constructie en de wegdelen met de BGT-attributen als
// eigen nodes, de materiaalklasse in de nodenaam) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal> met een
// printvoet onder het dek. De brug is 514 m lang en past op 1:1000 niet in
// 400 mm, vandaar standaard 1:2500 (206 mm).
//
//   node scripts/generate-nesciobrug.mjs              # STL op 1:2500 (standaard)
//   node scripts/generate-nesciobrug.mjs --scale 2000
//
// Assenstelsel: oorsprong midden tussen de voeten van de twee pylonen (RD
// 126542,98, 485475,68), Z omhoog, z = 0 op de waterspiegel van het
// Amsterdam-Rijnkanaal (NAP -0,5 m; het PDOK-terrein legt het kanaal op
// ellipsoïdisch 42,46 tot 42,55 m). +X loopt van pylon naar pylon naar het
// noordoosten (RD-richting 42,8 graden vanaf het oosten), +Y naar het
// noordwesten. De pylonen staan op x = -83,56 en 83,56 (y = 0); de lus ligt
// ten zuidwesten (x = -229 tot -152), de noordelijke helling eindigt op
// x = 285 (y = -212). Het fietsdek ligt in het midden op y = 1 tot 5, het
// voetpad aan de noordwestkant ernaast (y = 5 tot 7,6).
//
// Bronnen: BGT wegdeel (fietspad, voetpad en voetpad op trap op de brug, met
// relatieve hoogteligging 1 en 2) voor de plattegrond van het dek en de trappen;
// BGT overbruggingsdeel (pijlers) voor de pylon aan de zuidkant (2,6 m2), de 36
// kolommen onder de lus en de noordelijke helling (0,65 m2) en de vier
// zwaardere steunpunten waar de tuien het dek en de trappen raken; AHN DSM en
// DTM 0,5 m (PDOK WCS) voor het lengteprofiel van fiets- en voetdek (NAP +1,9 m
// aan het begin van de lus, +12,0 m in het midden, +3,6 m aan het eind van de
// noordelijke helling), de hoofdkabel (NAP +16,0 m in het midden, 4 m boven het
// dek, oplopend tot +35,2 m bij de pylonen, in plattegrond van y = 0,95 in het
// midden naar 0 bij de pylonen) en de pylontoppen (NAP +34,5 tot +34,8 m in het
// DSM); PDOK-luchtfoto voor de pylonvoeten, de richting van de tuien en de
// ovale trappen; Wikipedia en Wikimedia Commons-foto's voor de opbouw (één
// kabelvlak, hangers aan de buitenrand van het fietsdek, de splitsing van het
// voetpad, de trappen, het kokerdek met afgeronde onderkant).
// Geschat: de pylondiameter (1,8 m aan de voet uit de BGT, 1,0 m in de top),
// de pylonhoogte (NAP +35,8 m, net boven het hoogste kabelpunt), de
// hangerafstand (twaalf velden van 7,0 m per helft, foto's), de dekhoogte
// (kokerdek 1,2 m met een rand van 0,6 m), de ovale trappen (10,4 × 8,4 m rond
// de BGT-trapdelen, steekhoogte 33 graden) en het dekprofiel waar het AHN onder
// het dek door het open hekwerk en de bomen een onrustig beeld geeft (lus na
// x = -224 en de helling na de noordelijke pylon: rechte hellingen van 3,6 tot
// 3,9 % en 2 % door de bovenste DSM-cellen).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "nesciobrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- BGT en AHN in het lokale stelsel (meters) ----------
// Assen van de fietspad- en voetpadstrook (skelet van de BGT-wegdelen),
// vereenvoudigd tot 3 cm.
const CYCLE_AXIS = [
  [-153.36, 22.11], [-153.87, 22.97], [-154.5, 23.74], [-155.31, 24.32], [-156.24, 24.7], [-182.17, 32.2], [-185.09, 32.88], [-186.08, 33.06],
  [-188.06, 33.31], [-189.06, 33.39], [-191.06, 33.46], [-194.05, 33.34], [-197.03, 32.95], [-199.96, 32.34], [-201.89, 31.79], [-202.83, 31.47],
  [-205.62, 30.36], [-207.43, 29.51], [-210.03, 28.02], [-211.69, 26.91], [-213.3, 25.72], [-214.85, 24.45], [-216.32, 23.1], [-217.69, 21.64],
  [-218.34, 20.88], [-220.15, 18.49], [-221.25, 16.82], [-222.26, 15.09], [-223.58, 12.4], [-223.98, 11.48], [-224.68, 9.61], [-225.28, 7.7],
  [-225.76, 5.76], [-226.27, 2.81], [-226.48, 0.82], [-226.58, -1.18], [-226.51, -4.18], [-226.33, -6.17], [-226.19, -7.16], [-225.82, -9.12],
  [-225.33, -11.06], [-224.4, -13.92], [-223.66, -15.77], [-222.82, -17.58], [-221.87, -19.35], [-221.36, -20.2], [-220.26, -21.88], [-219.07, -23.49],
  [-217.8, -25.02], [-217.12, -25.76], [-214.3, -28.59], [-211.27, -31.2], [-209.7, -32.45], [-208.09, -33.63], [-204.76, -35.85], [-202.15, -37.33],
  [-199.47, -38.67], [-196.71, -39.84], [-194.83, -40.53], [-192.93, -41.15], [-191.01, -41.7], [-189.06, -42.17], [-186.12, -42.75], [-184.15, -43.06],
  [-182.16, -43.31], [-179.17, -43.54], [-177.17, -43.6], [-175.17, -43.59], [-173.17, -43.51], [-171.18, -43.35], [-169.19, -43.12], [-167.22, -42.82],
  [-164.28, -42.21], [-162.34, -41.71], [-160.43, -41.13], [-158.54, -40.49], [-156.67, -39.78], [-153.91, -38.59], [-151.22, -37.26], [-149.46, -36.32],
  [-144.24, -33.36], [-139.85, -30.97], [-135.42, -28.65], [-131.84, -26.86], [-128.25, -25.1], [-124.63, -23.41], [-115.48, -19.36], [-106.23, -15.58],
  [-99.68, -13.11], [-94.0, -11.17], [-90.2, -9.93], [-83.51, -7.86], [-78.7, -6.5], [-72.9, -4.98], [-69.01, -4.03], [-62.18, -2.48],
  [-57.29, -1.47], [-52.37, -0.58], [-47.4, -0.04], [-36.5, 1.46], [-28.55, 2.35], [-23.57, 2.74], [-18.58, 3.06], [-13.58, 3.3],
  [-6.59, 3.49], [1.41, 3.57], [5.41, 3.51], [10.41, 3.38], [16.4, 3.12], [23.39, 2.67], [31.35, 1.93], [38.31, 1.18],
  [47.2, -0.22], [48.2, -0.34], [49.19, -0.44], [52.19, -0.59], [53.18, -0.7], [54.17, -0.84], [57.12, -1.41], [62.01, -2.42],
  [68.85, -3.93], [76.61, -5.87], [83.35, -7.76], [89.09, -9.51], [92.89, -10.74], [97.63, -12.35], [103.27, -14.37], [110.75, -17.23],
  [113.51, -18.4], [115.32, -19.24], [120.68, -21.94], [125.04, -24.39], [130.99, -28.06], [133.48, -29.75], [137.52, -32.68], [139.11, -33.91],
  [142.19, -36.45], [145.23, -39.05], [148.16, -41.77], [152.35, -46.07], [155.01, -49.05], [158.87, -53.65], [161.29, -56.84], [164.76, -61.73],
  [166.39, -64.24], [167.43, -65.95], [168.96, -68.53], [170.89, -72.03], [178.99, -88.11], [182.75, -95.17], [185.21, -99.52], [188.74, -105.56],
  [192.92, -112.38], [197.79, -119.95], [204.54, -129.87], [209.22, -136.36], [213.49, -141.9], [220.35, -150.5], [222.89, -153.59], [226.13, -157.4],
  [229.44, -161.15], [235.5, -167.8], [241.7, -174.32], [249.53, -182.05], [251.73, -184.09], [253.86, -186.2], [256.86, -188.85], [258.33, -190.21],
  [265.1, -196.13], [268.91, -199.37], [274.34, -203.79], [279.83, -208.12], [281.38, -209.39], [282.12, -210.06], [282.65, -210.9], [283.01, -211.83],
  [283.1, -212.35],
];

const FOOT_AXIS = [
  [-104.02, 10.96], [-103.32, 10.25], [-102.46, 9.74], [-101.51, 9.44], [-92.78, 7.25], [-89.85, 6.59], [-86.91, 5.99], [-81.99, 5.14],
  [-76.05, 4.3], [-70.08, 3.67], [-65.09, 3.31], [-62.1, 3.16], [-57.1, 3.04], [-51.1, 2.98], [-48.1, 3.07], [-42.13, 3.61],
  [-30.2, 4.94], [-21.23, 5.71], [-15.25, 6.07], [-13.25, 6.14], [-5.25, 6.33], [-2.25, 6.35], [5.75, 6.29], [11.75, 6.16],
  [22.73, 5.52], [29.7, 4.89], [34.67, 4.34], [39.63, 3.72], [44.6, 3.19], [47.59, 2.92], [49.59, 2.86], [54.59, 3.04],
  [61.58, 3.14], [67.58, 3.48], [73.55, 4.01], [76.53, 4.37], [80.49, 4.92], [85.42, 5.72], [89.35, 6.49], [93.26, 7.33],
  [99.09, 8.74], [101.99, 9.52], [102.91, 9.9], [103.73, 10.47], [104.2, 10.99],
];

const BGT_ROADS = {
  fietspad: [
    // G0363.c92a17218bbb4651826088d83823545d: fietspad, gesloten verharding, relatieve hoogteligging 2
    [
      [-90.4, -12.11], [-91.71, -8.23], [-101.12, -11.45], [-109.06, -14.47], [-107.57, -18.25], [-100.07, -15.37],
    ],
    // G0363.22cee56329b74430b9bfe89df3082bdd: fietspad, gesloten verharding, relatieve hoogteligging 2
    [
      [92.15, -12.6], [101.29, -15.77], [110.48, -19.29], [113.25, -20.48], [115.97, -21.77], [121.8, -24.86],
      [125.12, -26.77], [128.38, -28.77], [131.36, -30.73], [134.34, -32.83], [137.25, -35.02], [140.09, -37.3],
      [142.71, -39.56], [145.78, -42.33], [148.27, -44.75], [150.6, -47.17], [153.49, -50.37], [155.85, -53.15],
      [158.13, -56.0], [160.21, -58.76], [162.2, -61.59], [164.36, -64.85], [166.72, -68.71], [168.86, -72.56],
      [177.3, -89.33], [179.48, -93.42], [183.06, -99.85], [186.9, -106.44], [190.43, -104.33], [185.88, -96.49],
      [182.1, -89.62], [173.59, -72.76], [170.82, -67.59], [168.73, -64.07], [166.43, -60.51], [164.08, -57.11],
      [161.73, -53.93], [158.19, -49.53], [154.25, -45.06], [150.93, -41.59], [147.36, -38.2], [142.84, -34.25],
      [138.41, -30.74], [133.82, -27.44], [128.97, -24.29], [124.34, -21.57], [118.79, -18.58], [114.42, -16.5],
      [109.95, -14.65], [100.5, -11.12], [91.07, -7.93], [81.99, -5.17], [73.19, -2.82], [68.77, -1.73],
      [63.49, -0.55], [53.32, 1.44], [53.16, 1.65], [48.63, 1.19], [32.84, 3.31], [24.2, 4.26],
      [12.9, 4.94], [12.73, 1.83], [21.75, 1.34], [38.21, -0.05], [44.55, -1.23], [52.97, -2.64],
      [63.64, -4.79], [72.98, -7.01], [82.49, -9.59],
    ],
    // G0363.293837356f464d01a489f7c71035c6e8: fietspad, gesloten verharding, relatieve hoogteligging 2
    [
      [-83.97, -10.1], [-78.36, -8.46], [-72.58, -6.92], [-66.07, -5.37], [-59.39, -3.91], [-53.35, -2.76],
      [-45.31, -1.38], [-35.72, -0.03], [-30.17, 0.6], [-23.91, 1.17], [-17.79, 1.6], [-12.14, 1.87],
      [-5.59, 2.06], [0.81, 2.12], [6.25, 2.05], [12.73, 1.83], [12.9, 4.94], [11.59, 5.02],
      [-3.77, 5.19], [-14.71, 4.93], [-22.2, 4.51], [-28.59, 4.04], [-35.42, 3.28], [-47.28, 1.75],
      [-53.1, 1.63], [-53.26, 1.43], [-59.04, 0.3], [-65.01, -0.96], [-75.23, -3.42], [-82.88, -5.51],
      [-91.71, -8.23], [-90.4, -12.11],
    ],
    // G0363.5f2a1d53d8984df49d22231296ae9912: fietspad, gesloten verharding, relatieve hoogteligging 2
    [
      [-151.96, 25.66], [-153.38, 26.07], [-154.65, 22.16], [-153.1, 21.71],
    ],
    // G0363.db10d2efe3a1472ebffe565c6b2e81da: fietspad, gesloten verharding, relatieve hoogteligging 2
    [
      [-223.53, -9.85], [-224.13, -7.12], [-224.48, -4.23], [-224.56, -1.43], [-224.38, 1.49], [-223.99, 4.28],
      [-223.31, 7.19], [-222.38, 10.03], [-221.28, 12.61], [-219.86, 15.25], [-218.21, 17.78], [-216.55, 19.91],
      [-214.79, 21.8], [-212.61, 23.75], [-210.15, 25.57], [-207.77, 27.06], [-205.28, 28.34], [-203.18, 29.23],
      [-201.02, 29.98], [-198.82, 30.57], [-196.58, 31.02], [-194.0, 31.34], [-191.88, 31.47], [-189.64, 31.45],
      [-187.41, 31.25], [-185.53, 30.96], [-183.67, 30.55], [-154.65, 22.16], [-153.38, 26.07], [-182.59, 34.52],
      [-185.58, 35.14], [-188.63, 35.5], [-191.94, 35.58], [-195.32, 35.34], [-198.62, 34.82], [-201.85, 34.02],
      [-205.01, 32.93], [-207.88, 31.66], [-210.8, 30.04], [-213.6, 28.16], [-216.1, 26.19], [-218.31, 24.09],
      [-220.32, 21.8], [-222.25, 19.16], [-223.9, 16.48], [-225.32, 13.67], [-226.5, 10.74], [-227.43, 7.73],
      [-228.13, 4.46], [-228.53, 1.28], [-228.68, -1.75], [-228.56, -4.79], [-228.16, -7.92], [-227.46, -11.08],
      [-226.54, -14.1], [-225.36, -17.04], [-224.04, -19.69], [-222.41, -22.4], [-220.67, -24.81], [-218.76, -27.07],
      [-216.28, -29.56], [-213.55, -32.0], [-210.68, -34.28], [-207.62, -36.44], [-205.49, -37.78], [-203.13, -39.12],
      [-200.88, -40.25], [-198.4, -41.34], [-195.86, -42.31], [-193.47, -43.09], [-191.01, -43.77], [-188.28, -44.38],
      [-185.52, -44.88], [-182.74, -45.26], [-179.83, -45.52], [-177.39, -45.62], [-174.68, -45.6], [-171.98, -45.45],
      [-169.29, -45.16], [-166.61, -44.75], [-163.4, -44.06], [-160.31, -43.21], [-156.83, -42.0], [-153.42, -40.59],
      [-149.56, -38.7], [-143.96, -35.5], [-138.3, -32.44], [-128.53, -27.48], [-123.57, -25.13], [-118.6, -22.89],
      [-107.57, -18.25], [-109.06, -14.47], [-114.03, -16.47], [-119.11, -18.62], [-124.29, -20.93], [-129.04, -23.16],
      [-134.04, -25.63], [-140.86, -29.14], [-145.75, -31.8], [-152.27, -35.48], [-155.25, -36.9], [-158.31, -38.16],
      [-160.99, -39.11], [-163.35, -39.81], [-166.13, -40.47], [-168.76, -40.94], [-171.42, -41.27], [-174.27, -41.47],
      [-177.13, -41.51], [-179.79, -41.4], [-183.64, -41.0], [-187.46, -40.35], [-191.09, -39.5], [-194.5, -38.43],
      [-198.0, -37.05], [-201.21, -35.48], [-204.31, -33.69], [-207.38, -31.61], [-210.53, -29.17], [-213.43, -26.6],
      [-215.97, -24.02], [-217.98, -21.56], [-219.83, -18.78], [-221.33, -15.98], [-222.55, -13.05],
    ],
    // G0363.97c496fd01034b5892ec0694e0a37dd1: fietspad, gesloten verharding, relatieve hoogteligging 2
    [
      [285.44, -210.29], [280.09, -205.72], [273.27, -200.24], [268.44, -196.24], [263.82, -192.28], [259.27, -188.25],
      [254.17, -183.57], [248.52, -178.17], [243.69, -173.37], [238.93, -168.41], [231.85, -160.75], [225.93, -153.95],
      [219.98, -146.77], [212.85, -137.72], [206.87, -129.57], [200.82, -120.78], [195.51, -112.61], [190.43, -104.33],
      [186.9, -106.44], [192.03, -114.8], [197.41, -123.07], [203.53, -131.96], [209.58, -140.22], [216.79, -149.36],
      [222.8, -156.61], [228.79, -163.49], [235.94, -171.23], [240.63, -176.11], [245.24, -180.72], [250.59, -185.84],
      [255.38, -190.27], [260.28, -194.65], [265.51, -199.14], [270.38, -203.18], [276.6, -208.19], [283.21, -213.27],
    ],
  ],
  voetpad: [
    // G0363.6bd66cf0451f48bb8f97459403714dc5: voetpad, gesloten verharding, relatieve hoogteligging 2
    [
      [-64.11, 2.04], [-58.66, 1.86], [-53.3, 1.84], [-53.16, 1.77], [-53.1, 1.63], [-47.28, 1.75],
      [-35.42, 3.28], [-28.59, 4.04], [-22.2, 4.51], [-14.71, 4.93], [-3.77, 5.19], [11.59, 5.02],
      [12.9, 4.94], [13.04, 7.46], [7.17, 7.64], [-0.06, 7.69], [-7.38, 7.6], [-13.19, 7.41],
      [-20.33, 7.02], [-25.66, 6.59], [-31.33, 6.06], [-39.15, 5.21], [-44.42, 4.78], [-51.34, 4.45],
      [-57.54, 4.41], [-63.45, 4.59], [-68.97, 4.93], [-75.14, 5.55], [-81.28, 6.38], [-86.63, 7.31],
      [-91.94, 8.43], [-97.98, 9.91], [-104.41, 11.65], [-105.12, 9.1], [-91.68, 5.7], [-84.34, 4.29],
      [-79.05, 3.46], [-74.31, 2.86], [-69.28, 2.38],
    ],
    // G0363.f5857352a3584beba30b8dbff75a4609: voetpad, gesloten verharding, relatieve hoogteligging 2
    [
      [53.16, 1.65], [53.22, 1.78], [53.35, 1.84], [60.6, 1.91], [67.66, 2.27], [73.78, 2.82],
      [79.84, 3.58], [86.1, 4.61], [92.16, 5.83], [98.67, 7.37], [105.18, 9.15], [104.52, 11.59],
      [97.76, 9.79], [92.51, 8.54], [86.46, 7.28], [81.75, 6.48], [76.01, 5.67], [70.79, 5.11],
      [64.8, 4.68], [58.82, 4.45], [51.59, 4.47], [44.49, 4.79], [38.74, 5.26], [31.35, 6.09],
      [25.89, 6.6], [17.97, 7.18], [13.04, 7.46], [12.9, 4.94], [24.2, 4.26], [32.84, 3.31],
      [48.63, 1.19],
    ],
  ],
  trapZuid: [
    // G0363.b1cf75f04eb84fa6ac4668157c41b8c2: voetpad op trap, open verharding, relatieve hoogteligging 1
    [
      [-99.36, 6.23], [-99.38, 7.29], [-101.12, 7.36], [-102.86, 7.72], [-103.14, 6.65], [-101.25, 6.29],
    ],
    // G0363.d579833168d6434caf84540f71523788: voetpad op trap, open verharding, relatieve hoogteligging 1
    [
      [-96.74, 10.19], [-97.81, 11.01], [-98.95, 11.72], [-100.15, 12.31], [-101.38, 12.79], [-101.74, 11.73],
      [-100.58, 11.29], [-99.47, 10.75], [-98.41, 10.1], [-97.46, 9.38],
    ],
  ],
  trapNoord: [
    // G0363.d944871e1996401e9a71f1c036f795eb: voetpad op trap, gesloten verharding, relatieve hoogteligging 1
    [
      [101.93, 11.72], [101.56, 12.77], [100.36, 12.3], [99.15, 11.69], [98.01, 10.97], [96.95, 10.14],
      [97.67, 9.33], [98.66, 10.09], [99.71, 10.74], [100.82, 11.29],
    ],
    // G0363.5e219ae571ce4fb9aef8662655689ca0: voetpad op trap, gesloten verharding, relatieve hoogteligging 1
    [
      [103.43, 6.62], [103.08, 7.71], [101.93, 7.41], [100.77, 7.26], [99.6, 7.26], [98.43, 7.41],
      [98.25, 6.17], [99.56, 6.09], [100.86, 6.13], [102.13, 6.3],
    ],
  ],
};

const BGT_PIERS = [
  { id: "G0363.cd2ecf1005b84bb684ad9ca016493d61", x: -226.23, y: 3.05, area: 0.67 },
  { id: "G0363.b1964ca7f2c640a8a0eac901ce2a745e", x: -225.07, y: -11.94, area: 0.67 },
  { id: "G0363.504497df0cff4586a64377e71ba20be4", x: -221.1, y: 17.12, area: 0.67 },
  { id: "G0363.001465cd53b94a489481cee6ac124f70", x: -217.77, y: -25.0, area: 0.67 },
  { id: "G0363.2c960a992cff4f96ba309aa86dea2016", x: -210.51, y: 27.72, area: 0.67 },
  { id: "G0363.d4b4fd65d4524542be3da0692d2cec45", x: -206.37, y: -34.82, area: 0.67 },
  { id: "G0363.37bf4eb23ed0489cafbd8ee95f6c8770", x: -196.51, y: 33.05, area: 0.67 },
  { id: "G0363.5cdf529faf3948d5aa85751042b0ce2f", x: -192.72, y: -41.15, area: 0.67 },
  { id: "G0363.10f75ce2cbd140a3b047dc22ac0a0c25", x: -181.57, y: 32.1, area: 0.67 },
  { id: "G0363.237fcae2550f4aaf91b26357f6a85940", x: -177.92, y: -43.53, area: 0.67 },
  { id: "G0363.bc0634529367447390b2ad5c1e74609e", x: -167.17, y: 27.95, area: 0.67 },
  { id: "G0363.8b2ab5bca1bb4d08a1717a2463bc0493", x: -163.02, y: -41.8, area: 0.67 },
  { id: "G0363.cf57e8ccd5e146a18d7ce050d6e9bb78", x: -149.15, y: -36.13, area: 0.67 },
  { id: "G0363.55d56508661e4d7387af03e1e5c3cdbe", x: -136.01, y: -28.92, area: 0.67 },
  { id: "G0363.6c3f8272d2754e3789b90a5af35f7067", x: -122.51, y: -22.37, area: 0.67 },
  { id: "G0363.22a0906d2106497cb158a71710c3ef78", x: -109.9, y: -16.99, area: 0.67 },
  { id: "G0363.a4f1ef46866a47aeb302f86ed902cfd6", x: -107.62, y: -15.94, area: 1.27 },
  { id: "G0363.d1923d38bdae4e7caa4a13e0a6332815", x: -102.61, y: 9.81, area: 1.56 },
  { id: "G0363.722c6ada26de4af1af53beaa520e5a02", x: -83.56, y: -0.0, area: 2.64 },
  { id: "G0363.d7672277215747909a618d68ffd7b806", x: 102.71, y: 9.78, area: 1.5 },
  { id: "G0363.4fb00b1252ca4d56a1c96d2f45f453f9", x: 107.68, y: -16.04, area: 1.55 },
  { id: "G0363.3dc0968470dd4d18af86739d40e3fb9f", x: 110.01, y: -16.96, area: 0.67 },
  { id: "G0363.72a3eecfb0134486a36ef2aa32bac5c6", x: 119.39, y: -21.27, area: 0.65 },
  { id: "G0363.8216cf9e1c1140029ff7e83665ad36e6", x: 132.32, y: -28.91, area: 0.66 },
  { id: "G0363.d84c6e68714e4da9b2c3dc33e9f72231", x: 144.16, y: -38.12, area: 0.65 },
  { id: "G0363.e14e8d3572ec4beeb75b8d4cd85f5a6c", x: 154.77, y: -48.72, area: 0.65 },
  { id: "G0363.5f86a852d42e4b0dbfbc71027e3b30a7", x: 163.97, y: -60.55, area: 0.65 },
  { id: "G0363.050e991955a646c3ae5d827bfef317ce", x: 171.64, y: -73.44, area: 0.65 },
  { id: "G0363.044336b719144ed89f690253e6de62de", x: 178.35, y: -86.87, area: 0.65 },
  { id: "G0363.88aaf9c4bd6b4c38bf41f48544dd8048", x: 185.52, y: -100.02, area: 0.65 },
  { id: "G0363.5d9df2ac947046dd885b5eb50c201cdc", x: 193.22, y: -112.89, area: 0.65 },
  { id: "G0363.6b22928ba0d64fdc8a9819b779b4ce6e", x: 201.44, y: -125.4, area: 0.65 },
  { id: "G0363.475fd1f150f24a9bae12b96b852f73b2", x: 210.19, y: -137.67, area: 0.65 },
  { id: "G0363.9e40d4f096ca4c4990576b2ed7b6a614", x: 229.17, y: -160.86, area: 0.65 },
  { id: "G0363.70c854c999344fc48018e26c61241370", x: 239.34, y: -171.88, area: 0.65 },
  { id: "G0363.65d819b9aa6b4c06a9aa0d0bc716fe47", x: 249.96, y: -182.48, area: 0.65 },
  { id: "G0363.9da102702c664f79bdd5353d9617d23d", x: 261.03, y: -192.62, area: 0.65 },
  { id: "G0363.cb8c08373f6544a6aa6620f07ea57aa9", x: 272.46, y: -202.29, area: 0.65 },
];

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const signedArea = (pts) => {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  }
  return a / 2;
};
const ccw = (pts) => (signedArea(pts) > 0 ? pts : [...pts].reverse());
const cs = (polys) => new CrossSection(polys.map(ccw), "Positive");
const csUnion = (list) => CrossSection.union(list);
const prism = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);

// Loft langs een polylijn in plattegrond: per station een doorsnede [l, z]
// (l naar links van de looprichting), tegen de klok in met l naar rechts.
function loftPath(stations) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { x, y, dx, dy, section } of stations) {
    const len = Math.hypot(dx, dy);
    const nx = -dy / len;
    const ny = dx / len;
    for (const [l, z] of section) verts.push(x + l * nx, y + l * ny, z);
  }
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < stations.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = stations.length - 1;
  for (let j = 1; j + 1 < n; j++) {
    tris.push(id(0, 0), id(0, j + 1), id(0, j));
    tris.push(id(last, 0), id(last, j), id(last, j + 1));
  }
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  if (solid.volume() < 0) throw new Error("loft binnenstebuiten");
  return solid;
}
const loftX = (stations) => loftPath(stations.map(({ x, section }) => ({ x, y: 0, dx: 1, dy: 0, section })));

// Polylijn met booglengte; dichtstbijzijnde punt en punt op booglengte s.
function polyline(pts) {
  const s = [0];
  for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, s, length: s[s.length - 1] };
}
function nearest(line, x, y) {
  const { pts, s } = line;
  let best = { d2: Infinity };
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const ex = bx - ax;
    const ey = by - ay;
    const L2 = ex * ex + ey * ey;
    const t = Math.min(1, Math.max(0, ((x - ax) * ex + (y - ay) * ey) / L2));
    const px = ax + t * ex;
    const py = ay + t * ey;
    const d2 = (x - px) ** 2 + (y - py) ** 2;
    if (d2 < best.d2) {
      const L = Math.sqrt(L2);
      // Positief links van de looprichting.
      const side = Math.sign(ex * (y - ay) - ey * (x - ax)) || 1;
      best = { d2, s: s[i] + t * L, x: px, y: py, dx: ex / L, dy: ey / L, d: side * Math.sqrt(d2) };
    }
  }
  return best;
}
function pointAt(line, at) {
  const { pts, s } = line;
  let i = 0;
  while (i + 2 < pts.length && s[i + 1] < at) i++;
  const t = (at - s[i]) / (s[i + 1] - s[i]);
  const dx = pts[i + 1][0] - pts[i][0];
  const dy = pts[i + 1][1] - pts[i][1];
  const L = Math.hypot(dx, dy);
  return { x: pts[i][0] + t * dx, y: pts[i][1] + t * dy, dx: dx / L, dy: dy / L };
}
const cycle = polyline(CYCLE_AXIS);
const foot = polyline(FOOT_AXIS);
const sAtX = (line, x) => {
  for (let i = 0; i + 1 < line.pts.length; i++) {
    const [x0] = line.pts[i];
    const [x1] = line.pts[i + 1];
    if ((x0 - x) * (x1 - x) <= 0 && x0 !== x1) return line.s[i] + ((x - x0) / (x1 - x0)) * (line.s[i + 1] - line.s[i]);
  }
  throw new Error(`x ${x} niet op de as`);
};

// ---------- hoogtes (NAP) ----------
const WATER_NAP = -0.5; // Amsterdam-Rijnkanaal; PDOK-water 42,46 tot 42,55 m ellipsoïdisch
const Z = (nap) => nap - WATER_NAP;
const BASE = -1.0; // gemeenschappelijke onderkant van pylonen, kolommen, trappen en landhoofden

// Hoofdoverspanning: het dek volgt een parabool met de top op NAP +11,95 m in
// het midden (AHN: 10,50 m op x = -71,9 en 9,89 m op x = 86,3), voor fiets- en
// voetdek gelijk zolang ze één dek vormen.
const MAIN = { crestNap: 11.95, k: 2.83e-4 };
const mainNap = (x) => MAIN.crestNap - MAIN.k * x * x;
// Het voetdek ligt na de splitsing iets hoger (verkanting naar het
// noordwesten): 0,15 m op x = ±77 en 0,43 m bij de trappen (AHN).
const footNap = (x) => mainNap(x) + 0.43 * Math.max(0, (Math.abs(x) - 55) / 45) ** 1.6;
// Fietsdek buiten de hoofdoverspanning: knopen in booglengte s langs de
// fietsas (s = 0 aan het begin van de lus op het maaiveld, 730,4 aan het eind
// van de noordelijke helling). De lus stijgt 4,1 % tot een bordes op +4,9 m,
// dan 3,6 % tot een tweede bordes op +7,2 m en 3,7 % tot de pylon; aan de
// noordkant daalt de helling 3,2 % en daarna 2,0 % tot +3,55 m. Tussen
// S_MAIN[0] en S_MAIN[1] (x = -75 tot 86) geldt de parabool.
const S_MAIN = [sAtX(cycle, -75), sAtX(cycle, 86)];
const RAMP_KNOTS = [
  [0, 1.86],
  [75, 4.92],
  [105, 4.92],
  [170, 7.22],
  [195, 7.25],
  [S_MAIN[0], mainNap(-75)],
  [S_MAIN[1], mainNap(86)],
  [500, 7.88],
  [600, 5.94],
  [700, 3.94],
  [cycle.length, 3.55],
];
const rampLinear = (s) => {
  if (s >= S_MAIN[0] && s <= S_MAIN[1]) return mainNap(pointAt(cycle, s).x);
  const k = RAMP_KNOTS;
  if (s <= 0) return k[0][1];
  if (s >= cycle.length) return k[k.length - 1][1];
  let i = 0;
  while (k[i + 1][0] < s) i++;
  return k[i][1] + ((s - k[i][0]) / (k[i + 1][0] - k[i][0])) * (k[i + 1][1] - k[i][1]);
};
// Afgerond met een glijdend gemiddelde over 12 m (overgangsbogen).
const RAMP_STEP = 0.25;
const rampTable = [];
for (let s = 0; s <= cycle.length + 1e-9; s += RAMP_STEP) {
  let sum = 0;
  let n = 0;
  for (let d = -6; d <= 6 + 1e-9; d += RAMP_STEP) {
    sum += rampLinear(Math.min(cycle.length, Math.max(0, s + d)));
    n++;
  }
  rampTable.push(sum / n);
}
const rampNap = (s) => {
  const i = Math.min(rampTable.length - 2, Math.max(0, Math.floor(s / RAMP_STEP)));
  const t = Math.min(1, Math.max(0, s / RAMP_STEP - i));
  return rampTable[i] + t * (rampTable[i + 1] - rampTable[i]);
};
// Hoogte van het wegdek op een willekeurig punt van het dek. Het voetdek na de
// splitsing (|x| > 53) en de trappen volgen footNap; het fietsdek in de
// hoofdoverspanning de parabool op x, daarbuiten de knopen langs de as (met
// een overgang van 10 m, zodat het gezamenlijke dek in het midden voor fiets-
// en voetpad precies even hoog ligt).
function deckNap(x, y) {
  const c = nearest(cycle, x, y);
  if (Math.abs(x) > 53) {
    const f = nearest(foot, x, y);
    if (Math.abs(f.d) < Math.abs(c.d)) return footNap(x);
  }
  const w =
    c.s < S_MAIN[0] ? Math.max(0, 1 - (S_MAIN[0] - c.s) / 10) : c.s > S_MAIN[1] ? Math.max(0, 1 - (c.s - S_MAIN[1]) / 10) : 1;
  return w * mainNap(x) + (1 - w) * rampNap(c.s);
}

// Uitgerekt prisma: een plattegrond, verfijnd tot 1,5 m, waarvan onder- en
// bovenkant een functie van (x, y) volgen.
function draped(section, bottom, top, refine = 1.5) {
  return Manifold.extrude(section, 1)
    .refineToLength(refine)
    .warp((v) => {
      const b = bottom(v[0], v[1]);
      const t = top(v[0], v[1]);
      v[2] = b + v[2] * (t - b);
    });
}
const deckTop = (x, y) => Z(deckNap(x, y));

// ---------- plattegrond van het dek ----------
const fietsSection = csUnion(BGT_ROADS.fietspad.map((p) => cs([p])));
const voetSection = csUnion(BGT_ROADS.voetpad.map((p) => cs([p]))).subtract(fietsSection);
// Zuidoostrand van het fietsdek in de hoofdoverspanning (|x| <= 84): de
// laagste y van het BGT-fietspad op elke x.
const fietsRings = fietsSection.toPolygons();
function fietsEdge(x) {
  let m = Infinity;
  for (const ring of fietsRings) {
    for (let i = 0; i < ring.length; i++) {
      const [x0, y0] = ring[i];
      const [x1, y1] = ring[(i + 1) % ring.length];
      if ((x0 - x) * (x1 - x) <= 0 && x0 !== x1) {
        const y = y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
        if (Math.abs(y) < 16) m = Math.min(m, y);
      }
    }
  }
  return m;
}
// Hangerstrook: in de hoofdoverspanning steekt het dek 1,0 m buiten het
// fietspad uit (AHN: dekrand op y = 1,0 in het midden, fietspad vanaf 2,06),
// daar staan de hangers. Elders is de rand 0,4 m.
const EDGE = { side: 0.4, hanger: 1.0, span: 84 };
const HANGER_X = [];
for (let x = -EDGE.span; x <= EDGE.span + 1e-9; x += 0.5) HANGER_X.push(+x.toFixed(2));
const hangerStrip = cs([
  [
    ...HANGER_X.map((x) => [x, fietsEdge(x) + 0.1]),
    ...[...HANGER_X].reverse().map((x) => [x, fietsEdge(x) - EDGE.hanger]),
  ],
]);
const deckPlan = csUnion([fietsSection, voetSection]).offset(EDGE.side, "Round", 2, 24).add(hangerStrip).simplify(0.01);
// Kokerdek: een rand van 0,6 m dik en een kern van 1,2 m, 0,8 m binnen de rand.
const DECK = { edge: 0.6, core: 1.2, inset: 0.8 };
const corePlan = deckPlan.offset(-DECK.inset, "Round", 2, 24).simplify(0.01);
const deck = union([
  draped(deckPlan, (x, y) => deckTop(x, y) - DECK.edge, deckTop),
  draped(corePlan, (x, y) => deckTop(x, y) - DECK.core, (x, y) => deckTop(x, y) - 0.3),
]);

// ---------- pylonen, hoofdkabel met hangers, tuien ----------
// Pylon: ronde witte buis op de oever, 1,8 m aan de voet (BGT 2,64 m2), 1,0 m
// in de top op NAP +35,8 m, met een bolle kap.
const PYLON = { x: 83.56, rBase: 0.9, rTop: 0.5, topNap: 35.8 };
const pylon = (side) =>
  union([
    Manifold.cylinder(Z(PYLON.topNap) - BASE, PYLON.rBase, PYLON.rTop, 32, false).translate([side * PYLON.x, 0, BASE]),
    Manifold.sphere(PYLON.rTop, 32).translate([side * PYLON.x, 0, Z(PYLON.topNap)]),
  ]);
// Hoofdkabel (AHN): in het midden NAP +16,0 m, 4 m boven het dek, oplopend
// tot +35,2 m bij de pylonen; in plattegrond van y = 0,95 in het midden (net
// buiten de dekrand op y = 1,0) naar y = 0 bij de pylonen, zodat het fietsdek
// eronder van de zuidoost- naar de noordwestkant zwaait.
const CABLE = { midNap: 16.0, a: 3.144e-3, b: -5.6e-8, midY: 0.95, half: 0.45 };
const cableNap = (x) => CABLE.midNap + CABLE.a * x * x + CABLE.b * x ** 4;
const cableY = (x) => CABLE.midY * Math.cos((Math.PI * x) / (2 * PYLON.x)) ** 2;
// Hangerscherm: de kabel (0,9 m) met daaronder een scherm van 0,95 m dik dat
// als regelvlak naar de buitenrand van het fietsdek loopt (de hangers hangen
// aan de dekrand en staan daardoor tot 21 graden schuin), met spitse openingen
// tussen de hangers. Op 1:1000 zijn kabel (circa 0,15 m) en hangers (circa
// 0,05 m) niet te printen; het scherm draagt de kabel zonder steun.
const SCREEN = { thick: 0.95, sink: 0.3, base: 0.4, gap: 0.3, end: 83.3, step: 0.5 };
const edgeY = (x) => fietsEdge(x) - EDGE.hanger + SCREEN.thick / 2;
const screenFrame = (x) => {
  const e = edgeY(x);
  return { e, ze: deckTop(x, e), yc: cableY(x), zc: Z(cableNap(x)) };
};
const screenStations = [];
for (let x = -SCREEN.end; x <= SCREEN.end + 1e-9; x += SCREEN.step) screenStations.push(+x.toFixed(3));
if (screenStations[screenStations.length - 1] < SCREEN.end) screenStations.push(SCREEN.end);
const screenLoft = (grow) =>
  loftX(
    screenStations.map((x) => {
      const { e, ze, yc, zc } = screenFrame(x);
      const h = SCREEN.thick / 2 + grow;
      return {
        x,
        section: [
          [e - h, ze - SCREEN.sink - grow],
          [e + h, ze - SCREEN.sink - grow],
          [yc + h, zc + CABLE.half + grow],
          [yc - h, zc + CABLE.half + grow],
        ],
      };
    }),
  );
// Hangers om de 6,96 m (twaalf velden per helft, foto's), staanders van
// 0,9 m. Elke opening heeft een vlakke onderkant 0,4 m boven het dek, staande
// zijden en een spitse top (55 graden) 0,3 m onder de kabel; waar het scherm
// laag is (midden) wordt de opening een driehoek.
const HANGERS = { perHalf: 12, post: 0.9, apex: 55 };
const hangerStep = PYLON.x / HANGERS.perHalf;
const tanApex = Math.tan((HANGERS.apex * Math.PI) / 180);
const screenCenterY = (x, z) => {
  const { e, ze, yc, zc } = screenFrame(x);
  return e + ((yc - e) * (z - ze)) / (zc - ze);
};
const slots = [];
for (let k = -HANGERS.perHalf; k < HANGERS.perHalf; k++) {
  let x0 = k * hangerStep + HANGERS.post / 2;
  let x1 = (k + 1) * hangerStep - HANGERS.post / 2;
  // Naast de pylon (straal tot 0,9 m) blijft 1,0 m scherm staan.
  if (k === -HANGERS.perHalf) x0 = -PYLON.x + 1.9;
  if (k === HANGERS.perHalf - 1) x1 = PYLON.x - 1.9;
  const xm = (x0 + x1) / 2;
  const zb0 = screenFrame(x0).ze + SCREEN.base;
  const zb1 = screenFrame(x1).ze + SCREEN.base;
  const za = screenFrame(xm).zc - CABLE.half - SCREEN.gap;
  const zbm = (zb0 + zb1) / 2;
  let w = (x1 - x0) / 2;
  if (za - w * tanApex < Math.max(zb0, zb1) + 0.1) w = (za - zbm - 0.1) / tanApex;
  if (w < 0.6) continue;
  x0 = xm - w;
  x1 = xm + w;
  const zbAt = (x) => zb0 + ((x - x0) / (x1 - x0)) * (zb1 - zb0);
  const sh = za - w * tanApex;
  const outline = [[x0, zbAt(x0)], [x1, zbAt(x1)]];
  if (sh > Math.max(zbAt(x0), zbAt(x1)) + 0.05) outline.push([x1, sh]);
  outline.push([xm, za]);
  if (sh > Math.max(zbAt(x0), zbAt(x1)) + 0.05) outline.push([x0, sh]);
  // Punten langs de omtrek om de 1 m, elk 1,5 m voor en achter het (licht
  // getordeerde) scherm; de convexe romp is de snijder.
  const pts = [];
  for (let i = 0; i < outline.length; i++) {
    const [ax, az] = outline[i];
    const [bx, bz] = outline[(i + 1) % outline.length];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az)));
    for (let j = 0; j < n; j++) {
      const x = ax + ((bx - ax) * j) / n;
      const z = az + ((bz - az) * j) / n;
      const y = screenCenterY(x, z);
      pts.push([x, y - 1.5, z], [x, y + 1.5, z]);
    }
  }
  slots.push({ x0, x1, top: za, hull: Manifold.hull(pts) });
}
const screen = screenLoft(0).subtract(union(slots.map((s) => s.hull)));
// Tuien (0,9 m) van de pylontop naar het dek: één naar de noordwestrand van
// het fietsdek bij het zware steunpunt op de lus/helling (verschoven naar
// x = ±103, zodat hij onder 47,7 graden loopt en zonder steun print;
// werkelijk circa 44 graden naar x = ±107,6) en één naar het eind van het
// voetdek boven de trap (steunpunt in de BGT op x = ±102,6, 50,4 graden).
const STAY = { r: 0.45, topNap: 35.3, cycleX: 103, cycleOffset: 1.9, stair: [102.61, 9.81] };
const capsule = (p, q, r) => Manifold.hull([Manifold.sphere(r, 16).translate(p), Manifold.sphere(r, 16).translate(q)]);
const stayEnds = (side) => {
  const top = [side * PYLON.x, 0, Z(STAY.topNap)];
  const at = pointAt(cycle, sAtX(cycle, side * STAY.cycleX));
  const cx = at.x - at.dy * STAY.cycleOffset;
  const cy = at.y + at.dx * STAY.cycleOffset;
  const sx = side * STAY.stair[0];
  const sy = STAY.stair[1];
  return [
    [top, [cx, cy, deckTop(cx, cy)]],
    [top, [sx, sy, deckTop(sx, sy)]],
  ];
};
const stayAngles = [];
const stays = (side, grow = 0) =>
  union(
    stayEnds(side).map(([p, q]) => {
      if (!grow) stayAngles.push(+((Math.atan2(p[2] - q[2], Math.hypot(p[0] - q[0], p[1] - q[1])) * 180) / Math.PI).toFixed(1));
      return capsule(p, q, STAY.r + grow);
    }),
  );

// ---------- kolommen, landhoofden, trappen ----------
// Ronde kolommen onder de lus en de noordelijke helling (BGT, 0,65 m2, dus
// 0,91 m) en de twee zware steunpunten onder het fietsdek waar de tuien
// aankomen (1,27 en 1,55 m2), van de onderkant tot 0,3 m in de kern van het
// dek. De steunpunten in de trappen zitten in het trapblok.
const COLUMN_PIERS = BGT_PIERS.filter((p) => p.area < 2 && Math.abs(Math.abs(p.x) - 102.66) > 0.5);
const columns = COLUMN_PIERS.map(({ x, y, area }) => {
  const r = Math.sqrt(area / Math.PI);
  return Manifold.cylinder(deckTop(x, y) - DECK.core + 0.3 - BASE, r, r, 24, false).translate([x, y, BASE]);
});
// Landhoofden aan de twee einden van het fietsdek: het dek binnen 3,5 m van
// het eind dicht tot de onderkant.
const abutments = [0, cycle.length].map((s) => {
  const p = pointAt(cycle, s);
  const inward = s === 0 ? 1 : -1;
  const c = [p.x + inward * p.dx * 1.5, p.y + inward * p.dy * 1.5];
  const disc = CrossSection.circle(3.5, 32).translate(c);
  return draped(deckPlan.intersect(disc), () => BASE, (x, y) => deckTop(x, y) - 0.3, 1.0);
});
// Ovale trappen aan het eind van het voetdek, om het steunpunt van de tui
// heen (luchtfoto, BGT): 10,4 × 8,4 m, lange as langs het voetdek. Het
// voetdek loopt over de rug tot de landwaartse punt; aan weerszijden daalt
// een trapgoot van 1,55 m breed onder 33 graden naar de kanaalkant, met een
// rand van 0,9 m. De trappen zelf (treden van 0,17 m) zijn een helling.
const STAIR = { cx: 100.6, cy: 9.4, a: 5.2, b: 4.2, dir: [0.97, 0.243], rim: 0.9, wang: 1.1, inner: 1.75, outer: 3.3, slope: 33 };
function stairFrame(side) {
  const L = Math.hypot(...STAIR.dir);
  const u = [(side * STAIR.dir[0]) / L, STAIR.dir[1] / L]; // landwaarts
  const n = [-u[1], u[0]];
  const c = [side * STAIR.cx, STAIR.cy];
  const tip = [c[0] + STAIR.a * u[0], c[1] + STAIR.a * u[1]];
  const k = Math.tan((STAIR.slope * Math.PI) / 180);
  const zTip = Z(footNap(tip[0])) - 0.25;
  // Vloer van de trapgoot: z = zTip - k (a - (p - c)·u).
  const floor = (x, y) => zTip - k * (STAIR.a - ((x - c[0]) * u[0] + (y - c[1]) * u[1]));
  const local = (pts) => pts.map(([s, t]) => [c[0] + s * u[0] + t * n[0], c[1] + s * u[1] + t * n[1]]);
  const ellipse = [];
  for (let i = 0; i < 64; i++) {
    const t = (2 * Math.PI * i) / 64;
    ellipse.push([STAIR.a * Math.cos(t), STAIR.b * Math.sin(t)]);
  }
  const oval = cs([local(ellipse)]);
  const bands = [1, -1].map((sgn) =>
    cs([local([[-STAIR.a - 1, sgn * STAIR.inner], [STAIR.a + 1, sgn * STAIR.inner], [STAIR.a + 1, sgn * STAIR.outer], [-STAIR.a - 1, sgn * STAIR.outer]])]),
  );
  const trough = oval.offset(-STAIR.rim, "Round", 2, 24).intersect(csUnion(bands));
  // Buiten de rug daalt de rand mee met de trap (wang van 1,1 m boven de
  // tredelijn), zodat de trap van opzij als trap leest en niet als toren.
  const flanks = oval.subtract(cs([local([[-STAIR.a - 1, -STAIR.inner], [STAIR.a + 1, -STAIR.inner], [STAIR.a + 1, STAIR.inner], [-STAIR.a - 1, STAIR.inner]])]));
  // Halfvlak boven de vloer: normaal (-k u, 1).
  const nz = Math.hypot(k * u[0], k * u[1], 1);
  const normal = [(-k * u[0]) / nz, (-k * u[1]) / nz, 1 / nz];
  const offsetAt = (dz) => (zTip + dz - k * (STAIR.a - (-c[0] * u[0] - c[1] * u[1]))) / nz;
  // trimByPlane houdt het deel waar normal·p >= offset.
  const aboveFloor = (section, dz, z1) => prism(section, BASE - 1, z1).trimByPlane(normal, offsetAt(dz));
  return { oval, trough, flanks, floor, aboveFloor, normal, offsetAt, zTip };
}
const stairs = [-1, 1].map((side) => {
  const f = stairFrame(side);
  const block = draped(f.oval, () => BASE, (x) => Z(footNap(x)), 1.0);
  return block.subtract(f.aboveFloor(f.trough, 0, Z(40))).subtract(f.aboveFloor(f.flanks, STAIR.wang, Z(40)));
});

const parts0 = [deck, pylon(-1), pylon(1), screen, stays(-1), stays(1), ...columns, ...abutments, ...stairs];
const bridge = union(parts0);
if (bridge.status() !== "NoError") throw new Error(`brug: ${bridge.status()}`);
{
  const bb = bridge.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-4) throw new Error(`onderkant op ${bb.min[2]}`);
}

// ---------- printvoet (alleen in de STL) ----------
// Onder het dek een wig van 50 graden vanaf de randen van de kern die
// uitloopt in een scherm van 0,9 m tot de onderplaat, langs de fietsas en
// langs de losse delen van het voetdek; hangerscherm, tuien en pylonen staan
// zonder steun.
const coreRings = corePlan.toPolygons();
function rayToRing(px, py, nx, ny) {
  let best = Infinity;
  for (const ring of coreRings) {
    for (let i = 0; i < ring.length; i++) {
      const [ax, ay] = ring[i];
      const [bx, by] = ring[(i + 1) % ring.length];
      const ex = bx - ax;
      const ey = by - ay;
      const den = nx * ey - ny * ex;
      if (Math.abs(den) < 1e-12) continue;
      const t = ((ax - px) * ey - (ay - py) * ex) / den;
      const u = ((ax - px) * ny - (ay - py) * nx) / den;
      if (t > 0 && u >= 0 && u <= 1) best = Math.min(best, t);
    }
  }
  return best;
}
const FOOT = { wall: 0.45, slope: 1.2 };
function footLoft(line, s0, s1) {
  const stations = [];
  for (let s = s0; s <= s1 + 1e-9; s += 1) {
    const p = pointAt(line, Math.min(s, s1));
    const nx = -p.dy;
    const ny = p.dx;
    const left = Math.max(FOOT.wall + 0.05, Math.min(4, rayToRing(p.x, p.y, nx, ny)) - 0.05);
    const right = Math.max(FOOT.wall + 0.05, Math.min(4, rayToRing(p.x, p.y, -nx, -ny)) - 0.05);
    const zu = deckTop(p.x, p.y) - DECK.core + 0.05;
    const zl = Math.max(BASE + 0.05, zu - FOOT.slope * (left - FOOT.wall));
    const zr = Math.max(BASE + 0.05, zu - FOOT.slope * (right - FOOT.wall));
    stations.push({
      x: p.x,
      y: p.y,
      dx: p.dx,
      dy: p.dy,
      section: [[-FOOT.wall, BASE], [FOOT.wall, BASE], [FOOT.wall, zl], [left, zu], [-right, zu], [-FOOT.wall, zr]],
    });
  }
  return loftPath(stations);
}
const footS0 = sAtX(foot, -97);
const footS1 = sAtX(foot, -53);
const footS2 = sAtX(foot, 53);
const footS3 = sAtX(foot, 97);
const printFoot = union([footLoft(cycle, 3, cycle.length - 3), footLoft(foot, footS0, footS1), footLoft(foot, footS2, footS3)]);
const printModel = union([bridge, printFoot]);
if (printModel.status() !== "NoError") throw new Error(`print: ${printModel.status()}`);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  const where = {};
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    const key = Math.round((p[0][0] + p[1][0] + p[2][0]) / 3 / 50) * 50;
    where[key] = (where[key] ?? 0) + len / 2;
  }
  return { area, where };
}
const pieceOverhang = {};
for (const [name, solid] of [
  ["dek", deck],
  ["hangerscherm", screen],
  ["tuien", union([stays(-1), stays(1)])],
  ["pylonen", union([pylon(-1), pylon(1)])],
  ["trappen", union(stairs)],
]) {
  pieceOverhang[name] = +overhangs(solid).area.toFixed(1);
}
const printOverhang = overhangs(printModel);
console.log("overhang per onderdeel (m2):", pieceOverhang);
console.log("overhang in de printversie (m2):", +printOverhang.area.toFixed(1), printOverhang.where);
for (const a of stayAngles) if (a < 46) throw new Error(`tui onder ${a} graden`);

// ---------- wegdelen als eigen onderdelen ----------
// Per BGT-functie de bovenste 0,5 m van het dek binnen de BGT-contouren
// (relatieve hoogteligging 2 op het dek, 1 op de trappen), met de attributen
// in glTF `extras.attributes`. Pas na het printmodel gebouwd, zodat de STL
// ongewijzigd blijft. De snijstrook loopt van 0,5 m onder tot 1 m boven het
// wegdek; hangerscherm, tuien en pylonen blijven met 2 cm marge constructie,
// de trapstrook blijft 2 cm binnen de wanden van de trapgoot.
const LAYER = 0.5;
const ABOVE = 1.0;
const ATTR = {
  fietspad: { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" },
  voetpad: { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "gesloten verharding" },
  trapZuid: { bgt_functie: "voetpad op trap", bgt_fysiekvoorkomen: "open verharding" },
  trapNoord: { bgt_functie: "voetpad op trap", bgt_fysiekvoorkomen: "gesloten verharding" },
};
const guards = union([screenLoft(0.02), stays(-1, 0.02), stays(1, 0.02),
  ...[-1, 1].map((side) => Manifold.cylinder(Z(PYLON.topNap) - BASE + 1, PYLON.rBase + 0.02, PYLON.rTop + 0.02, 32, false).translate([side * PYLON.x, 0, BASE - 0.5]))]);
const deckStrip = (section) =>
  draped(section, (x, y) => deckTop(x, y) - LAYER, (x, y) => deckTop(x, y) + ABOVE).subtract(guards);
const trapStrip = (side, polys) => {
  const f = stairFrame(side);
  const section = cs(polys).intersect(f.trough.offset(-0.02, "Miter", 2));
  return f.aboveFloor(section, -LAYER, Z(40)).trimByPlane(f.normal.map((c) => -c), -f.offsetAt(ABOVE));
};
const strips = [
  ["road:fietspad", deckStrip(fietsSection), ATTR.fietspad],
  ["road:voetpad", deckStrip(voetSection), ATTR.voetpad],
  ["road:voetpad-op-trap-zuid", trapStrip(-1, BGT_ROADS.trapZuid), ATTR.trapZuid],
  ["road:voetpad-op-trap-noord", trapStrip(1, BGT_ROADS.trapNoord), ATTR.trapNoord],
];
const roads = strips.map(([name, strip, attributes]) => [name, strip.intersect(bridge), attributes]);
const structure = bridge.subtract(union(strips.map(([, strip]) => strip)));
const parts = [["building:nesciobrug", structure], ...roads];
{
  const whole = bridge.volume();
  const sum = parts.reduce((a, [, solid]) => a + solid.volume(), 0);
  console.log("volume brug, onderdelen (m3):", +whole.toFixed(2), +sum.toFixed(2));
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) {
    if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
    if (solid.isEmpty()) throw new Error(`${name}: leeg`);
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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
    meshes.push({ name, primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }] });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "nesciobrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-nesciobrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `nesciobrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Nesciobrug Amsterdam 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
{
  const bb = printSolid.boundingBox();
  report.stl = {
    file: path.join(outDir, stlName),
    status: printSolid.status(),
    genus: printSolid.genus(),
    triangles,
    printFootM3: Math.round(printFoot.volume()),
    volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
    sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
  };
}
report.stays = stayAngles;
report.slots = slots.map((s) => [+s.x0.toFixed(2), +s.x1.toFixed(2), +(s.top + WATER_NAP).toFixed(2)]);
report.heights = {
  crestNap: MAIN.crestNap,
  cableMidNap: CABLE.midNap,
  cableAtPylonNap: +cableNap(PYLON.x).toFixed(2),
  pylonTopNap: PYLON.topNap,
  sMain: S_MAIN.map((s) => +s.toFixed(1)),
};
const bbAll = bridge.boundingBox();
report.bridge = {
  sizeM: [0, 1, 2].map((i) => +(bbAll.max[i] - bbAll.min[i]).toFixed(1)),
  min: bbAll.min.map((v) => +v.toFixed(2)),
  max: bbAll.max.map((v) => +v.toFixed(2)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveld op het kanaal naast de hoofdoverspanning; elders (een uitsnede van
// alleen de lus of de helling) de vaste terugval op het PDOK-water.
const SAMPLE_POINTS = [-40, 0, 40].flatMap((x) => [
  [x, -22],
  [x, 28],
]);
await writeFile(
  path.join(outDir, "nesciobrug.json"),
  JSON.stringify(
    {
      name: "Nesciobrug",
      file: "nesciobrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [126542.98, 485475.68],
      xAxis: [0.73349, 0.6797],
      groundOffsetMetres: 0,
      groundSamplePoints: SAMPLE_POINTS,
      groundHeight: 42.46,
      replacesTerrain: [
        "G0363.5552e918978b48a3aabc86b751e9a892",
        "G0363.8b58b86af27d4700a84dd85dae092e6b",
        "G0363.a389545c956c41c392304e05fe967c30",
        "G0363.a77d9da9651d4dea89809ed637fbe7ef",
        "G0363.d0a19fbf19cf4357a54f61feec456f35",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het midden tussen de voeten van de twee pylonen in de oorsprong op de waterspiegel van het Amsterdam-Rijnkanaal (z = 0, NAP -0,5 m), +X van pylon naar pylon naar het noordoosten (RD-richting 42,8 graden vanaf het oosten) en +Y naar het noordwesten. Vijf nodes: road:fietspad, road:voetpad, road:voetpad-op-trap-zuid en road:voetpad-op-trap-noord, de bovenste 0,5 m van dek en trappen binnen de BGT-wegdelen met hun attributen in extras.attributes, en building:nesciobrug met de rest: het slingerende kokerdek (fietsdek met in het midden het voetpad ernaast, 53 m uit het midden gesplitst) met de parabool van NAP +10,5 m bij de pylonen naar +11,95 m in het midden, de lus van 270 graden op kolommen aan de zuidkant (begin op NAP +1,9 m) en de helling langs de noordoever (eind op +3,55 m), de twee pylonen (x = ±83,56, top NAP +35,8 m), de hoofdkabel boven de zuidoostrand van het dek met een hangerscherm met spitse openingen naar de buitenrand van het fietsdek, de vier tuien, de ovale trappen aan het eind van het voetdek, 36 kolommen, twee zware steunpunten en de landhoofden. Kabel en hangers zijn een scherm van 0,95 m, de tuien staven van 0,9 m; het hekwerk en de lantaarns zijn weggelaten. Het maaiveld wordt op het kanaal naast de hoofdoverspanning bemonsterd; groundHeight (ellipsoïdisch, PDOK-water) is de terugval voor een uitsnede zonder kanaal. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        mainSpanM: +(2 * PYLON.x).toFixed(2),
        lengthAlongCycleAxisM: +cycle.length.toFixed(1),
        deckCrestNapM: MAIN.crestNap,
        deckAtPylonsNapM: +mainNap(PYLON.x).toFixed(2),
        cableMidNapM: CABLE.midNap,
        pylonTopNapM: PYLON.topNap,
        pylonDiameterM: [2 * PYLON.rBase, 2 * PYLON.rTop],
        hangerSpacingM: +hangerStep.toFixed(2),
        loopStartNapM: RAMP_KNOTS[0][1],
        northEndNapM: RAMP_KNOTS[RAMP_KNOTS.length - 1][1],
        stairOvalM: [2 * STAIR.a, 2 * STAIR.b],
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Nesciobrug",
        "PDOK BGT wegdeel op de brug (relatieve hoogteligging 2: fietspad G0363.293837356f464d01a489f7c71035c6e8, G0363.22cee56329b74430b9bfe89df3082bdd, G0363.c92a17218bbb4651826088d83823545d, G0363.db10d2efe3a1472ebffe565c6b2e81da, G0363.5f2a1d53d8984df49d22231296ae9912, G0363.97c496fd01034b5892ec0694e0a37dd1; voetpad G0363.6bd66cf0451f48bb8f97459403714dc5, G0363.f5857352a3584beba30b8dbff75a4609; relatieve hoogteligging 1: voetpad op trap G0363.b1cf75f04eb84fa6ac4668157c41b8c2, G0363.d579833168d6434caf84540f71523788, G0363.d944871e1996401e9a71f1c036f795eb, G0363.5e219ae571ce4fb9aef8662655689ca0), EPSG:28992",
        "PDOK BGT overbruggingsdeel (pijlers: pylon, kolommen, steunpunten)",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het lengteprofiel van fiets- en voetdek, de hoofdkabel en de pylonen",
        "PDOK luchtfoto (Actueel_orthoHR) voor de pylonvoeten, de tuien en de trappen",
        "Wikimedia Commons: Nesciobrug 2.jpg, Nesciobrug 3.jpg, Nesciobrug 4.jpg, Nesciobrug Amsterdam 2017 1.jpg, Nesciobrug - panoramio.jpg en andere (opbouw, hangers, trappen)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

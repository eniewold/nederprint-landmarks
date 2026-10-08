// Genereert een vereenvoudigd, gesloten 3D-model van de Van Brienenoordbrug
// over de Nieuwe Maas aan de oostkant van Rotterdam (A16): twee stalen
// boogbruggen met trekband naast elkaar (de oostboog van 1965, de westboog van
// 1990, elk met twee verticale boogribben en een netwerk van schuine, elkaar
// kruisende hangers), ten noorden daarvan de basculebruggen in gesloten stand
// met de basculekelder en de bedieningstoren met de ronde kanzel, en de
// betonnen aanbruggen: aan de zuidkant (IJsselmonde) negen velden van circa
// 51 m over het Eiland van Brienenoord en de oever, met een bocht naar het
// zuidoosten; aan de noordkant (Kralingen) negen velden over de oever. Buiten
// de oostelijke boog loopt het fietspad. Alle maten in het script zijn meters
// op ware grootte. Uitvoer: een GLB in meters (Y omhoog, drie nodes: de
// constructie en de bovenste 0,5 m van het dek als rijbaan en fietspad met de
// BGT-attributen) als catalogusbron voor de export en de kaart, plus een
// binaire STL in millimeters op 1:<schaal> met een printvoet onder het dek. De
// brug is 1353 m lang en past op 1:1000 niet in 400 mm, vandaar standaard
// 1:3500 (387 mm).
//
//   node scripts/generate-van-brienenoordbrug.mjs              # 1:3500 (standaard)
//   node scripts/generate-van-brienenoordbrug.mjs --scale 4000
//
// Assenstelsel: oorsprong midden onder de bogen op de voeg tussen de twee
// bruggen (RD 96917,61, 435328,02), op NAP 0 (het PDOK-terrein legt de Nieuwe
// Maas op ellipsoïdisch 43,67 m), Z omhoog, z = NAP-hoogte. +X loopt langs de
// brug naar het noorden (Kralingen, RD-richting 112,81 graden vanaf het
// oosten), +Y naar het westen-zuidwesten (stroomafwaarts). De westboog (1990)
// ligt op y = 0 tot 30,9, de oostboog (1965) met het fietspad op y = 0 tot
// -33,6. De rivierpijlers van de bogen staan op x = -156,1 tot -141,8 en 140,7
// tot 154,7; de basculekleppen liggen van x = 152 tot 206, de basculekelder
// van 206,1 tot 241,1; het zuidelijke landhoofd begint op x = -636 (schuin, in
// de bocht), het noordelijke eindigt op x = 716,7.
//
// Bronnen: BGT overbruggingsdeel (de dekrand van de hele brug met de bocht in
// het zuiden; de landhoofden; de sloven van de zuidelijke aanbrug op velden van
// circa 51 m, per pijlerlijn één onder elke brug; de wandkolommen van 1,7 × 6 m
// van de noordelijke aanbrug op velden van 50,75 m; de rivierpijlers met ronde
// koppen); BGT wegdeel (vier rijbanen autosnelweg en het fietspad op het dek,
// voor de middenbermen en de road-nodes); BGT scheiding (muren op de kelder,
// x = 206,1 tot 241,1); BAG-pand 0599100000670512 (bouwjaar 1965) en BGT-pand
// voor de bedieningstoren; AHN DSM 0,5 m (PDOK WCS) voor het wegdek (een vlak
// per station met dwarshelling, NAP +12,3 tot +14,6 m in het zuiden, +28,6 m onder de
// bogen, +10,8 m in het noorden), de bovenrand van de boogribben (parabool met
// de top op NAP +68,0 m die het wegdek op de pijlerharten raakt), hun ligging
// (2,6 en 29,6 m ten westen, 3,4 en 27,4 m ten oosten van de voeg, 2,0 m
// breed), de toren (NAP +49,6 m), de trapkoker aan de kelder (NAP +31,1 m)
// en de ronde pijlerkop aan de westkant; PDOK-terrein voor de waterspiegel;
// Wikipedia (nl) voor bouwjaren, lengte (1320 m) en overspanning (287,5 m voor
// de westboog); Wikimedia Commons-foto's voor de ribben en de hangers (twintig
// velden, van elke dekknoop twee hangers die een veld verder de boog raken),
// de kelder met de raambanden en de trapkoker, de toren met de kanzel, de
// ronde koppen van de rivierpijlers, de ronde kolommen op de sloven van de
// zuidelijke aanbrug en de kleppen.
// Geschat: de constructiehoogtes (aanbruggen 3,2 m met twee kokers per brug,
// boogdek 3,0 m met trekbanden van 4,5 m, kleppen 2,5 m, dekplaat 0,8 m), de
// ribhoogte (2,8 m), het aantal hangervelden (twintig, op foto's geteld), de
// kolommen op de sloven (Ø 2,6 m om de circa 6 m, sloven tot NAP +2,5 m), de
// pijlerlijn op de noordoever (x = 290,1, uit de BGT-muur en de steek), de
// maten van de kanzel (Ø 11,4 m van NAP +41,0 tot +46,4 m) en de raambanden
// van de kelder.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "3500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "van-brienenoordbrug");
const mmPerMetre = 1000 / scale;
const SLUG = "van-brienenoordbrug";

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts.filter(Boolean));
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const area2 = (pts) => {
  let a = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  });
  return a / 2;
};
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Doorsnede in het XZ-vlak (polygoon of CrossSection), uitgetrokken langs Y van y0 tot y1.
const extrudeY = (shape, y0, y1) =>
  Manifold.extrude(shape, y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const profileY = (points, y0, y1) => extrudeY([ccw(points)], y0, y1);
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in, y naar rechts en z omhoog, steeds evenveel punten).
function loftX(stations) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { x, section } of stations) for (const [y, z] of section) verts.push(x, y, z);
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
  if (solid.volume() <= 0) throw new Error("loft: omgekeerde doorsnede");
  return solid;
}
const lerp = (a, b, t) => a + (b - a) * t;
// Lineaire interpolatie in kolom k van een tabel [[x, ...waarden]] met vaste
// stap, buiten de tabel lineair doorgetrokken.
function column(rows, k) {
  const x0 = rows[0][0];
  const step = rows[1][0] - rows[0][0];
  return (x) => {
    const f = (x - x0) / step;
    const i = Math.min(Math.max(Math.floor(f), 0), rows.length - 2);
    return lerp(rows[i][k], rows[i + 1][k], f - i);
  };
}

// ---------- hoofdmaten ----------
// z = NAP-hoogte. Het PDOK-terrein legt de Nieuwe Maas op ellipsoïdisch 43,67 m.
const BASE = -2.0; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
const GROUND_HEIGHT = 43.67; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten

const X_SOUTH = -640; // voorbij het schuine zuidelijke landhoofd (BGT tot -636)
const X_NORTH = 720; // voorbij het noordelijke landhoofd (BGT tot 716,7)
const ARCH_END = 151.8; // einde van het boogdek (BGT-dekrand), beide kanten
const LEAF = { x0: 152.0, x1: 206.0, depth: 2.5 }; // basculekleppen, gesloten (luchtfoto: voegen)
const KELDER = { x0: 206.1, x1: 241.1, y0: -34.2, y1: 31.6 }; // basculekelder (BGT-muren, foto's)

// Dekranden en middenbermen (BGT, om de 5 m): [x, west, oost, g1, g2, g3, g4].
// g1 tussen de twee rijbanen van de westboog, g2 tussen de bruggen, g3 tussen
// de rijbanen van de oostboog, g4 tussen de oostelijke rijbaan en het fietspad.
const EDGES = [
  [-610, -27.02, -94.14, -41.93, -57.76, -72.85, -85.35], [-605, -25.34, -92.26, -40.25, -56.07, -71.1, -83.67], [-600, -23.68, -90.42, -38.62, -54.4, -69.36, -81.99],
  [-595, -22.08, -88.66, -36.98, -52.74, -67.69, -80.31], [-590, -20.49, -86.94, -35.37, -51.11, -66.04, -78.63], [-585, -18.89, -85.25, -33.79, -49.53, -64.43, -76.96],
  [-580, -17.36, -83.62, -32.25, -47.99, -62.84, -75.36], [-575, -15.87, -82.04, -30.74, -46.46, -61.27, -73.77], [-570, -14.39, -80.51, -29.28, -44.94, -59.74, -72.21],
  [-565, -12.97, -78.98, -27.82, -43.45, -58.24, -70.69], [-560, -11.58, -77.45, -26.37, -42.01, -56.77, -69.21], [-555, -10.18, -75.92, -24.96, -40.6, -55.32, -67.76],
  [-550, -8.83, -74.42, -23.6, -39.2, -53.89, -66.34], [-545, -7.51, -73.02, -22.28, -37.82, -52.53, -64.93], [-540, -6.19, -71.63, -20.95, -36.46, -51.17, -63.52],
  [-535, -4.9, -70.23, -19.63, -35.14, -49.84, -62.16], [-530, -3.68, -68.86, -18.35, -33.83, -48.53, -60.85], [-525, -2.46, -67.6, -17.1, -32.59, -47.25, -59.57],
  [-520, -1.25, -66.34, -15.9, -31.35, -45.97, -58.29], [-515, -0.07, -65.08, -14.73, -30.13, -44.75, -57.02], [-510, 1.08, -63.87, -13.59, -28.92, -43.56, -55.83],
  [-505, 2.23, -62.66, -12.42, -27.78, -42.38, -54.63], [-500, 3.3, -61.49, -11.3, -26.65, -41.22, -53.49], [-495, 4.37, -60.35, -10.23, -25.56, -40.08, -52.35],
  [-490, 5.43, -59.2, -9.18, -24.5, -39.01, -51.23], [-485, 6.46, -58.08, -8.16, -23.47, -37.94, -50.18], [-480, 7.37, -57.06, -7.15, -22.46, -36.92, -49.15],
  [-475, 8.29, -56.04, -6.17, -21.45, -35.9, -48.18], [-470, 9.21, -55.04, -5.23, -20.45, -34.92, -47.2], [-465, 10.12, -54.08, -4.31, -19.49, -33.97, -46.21],
  [-460, 11.04, -53.11, -3.42, -18.58, -33.04, -45.23], [-455, 11.95, -52.14, -2.53, -17.72, -32.13, -44.25], [-450, 12.82, -51.3, -1.67, -16.86, -31.26, -43.36],
  [-445, 13.62, -50.48, -0.85, -16.01, -30.4, -42.5], [-440, 14.43, -49.65, -0.04, -15.2, -29.58, -41.68], [-435, 15.23, -48.82, 0.75, -14.43, -28.76, -40.88],
  [-430, 15.97, -47.99, 1.51, -13.68, -28.01, -40.1], [-425, 16.65, -47.23, 2.22, -12.93, -27.27, -39.38], [-420, 17.33, -46.53, 2.91, -12.22, -26.56, -38.65],
  [-415, 18, -45.83, 3.58, -11.52, -25.88, -37.96], [-410, 18.65, -45.12, 4.23, -10.85, -25.21, -37.27], [-405, 19.28, -44.43, 4.86, -10.2, -24.54, -36.59],
  [-400, 19.86, -43.82, 5.47, -9.59, -23.9, -35.95], [-395, 20.42, -43.22, 6.05, -9.02, -23.32, -35.35], [-390, 20.98, -42.62, 6.62, -8.45, -22.77, -34.76],
  [-385, 21.54, -42.04, 7.14, -7.91, -22.23, -34.23], [-380, 22.04, -41.54, 7.65, -7.39, -21.7, -33.71], [-375, 22.49, -41.04, 8.16, -6.91, -21.19, -33.2],
  [-370, 22.94, -40.55, 8.63, -6.45, -20.71, -32.74], [-365, 23.39, -40.12, 9.06, -6, -20.27, -32.3], [-360, 23.83, -39.71, 9.49, -5.56, -19.85, -31.91],
  [-355, 24.18, -39.31, 9.87, -5.19, -19.45, -31.53], [-350, 24.54, -38.95, 10.24, -4.82, -19.1, -31.18], [-345, 24.89, -38.6, 10.59, -4.47, -18.77, -30.82],
  [-340, 25.2, -38.24, 10.92, -4.14, -18.46, -30.46], [-335, 25.51, -37.93, 11.24, -3.86, -18.19, -30.18], [-330, 25.81, -37.66, 11.52, -3.59, -17.93, -29.91],
  [-325, 26.1, -37.39, 11.8, -3.32, -17.69, -29.64], [-320, 26.34, -37.18, 12.06, -3.07, -17.48, -29.43], [-315, 26.59, -37, 12.31, -2.84, -17.29, -29.23],
  [-310, 26.83, -36.81, 12.54, -2.61, -17.1, -29.07], [-305, 27.05, -36.64, 12.76, -2.43, -16.94, -28.9], [-300, 27.24, -36.52, 12.99, -2.26, -16.8, -28.77],
  [-295, 27.44, -36.41, 13.19, -2.1, -16.68, -28.66], [-290, 27.63, -36.3, 13.36, -1.97, -16.58, -28.55], [-285, 27.83, -36.23, 13.53, -1.85, -16.5, -28.46],
  [-280, 27.97, -36.17, 13.7, -1.73, -16.41, -28.37], [-275, 28.11, -36.1, 13.85, -1.61, -16.34, -28.31], [-270, 28.24, -36.03, 13.97, -1.51, -16.3, -28.25],
  [-265, 28.38, -35.97, 14.09, -1.41, -16.26, -28.22], [-260, 28.52, -35.9, 14.21, -1.34, -16.21, -28.19], [-255, 28.64, -35.85, 14.33, -1.27, -16.18, -28.16],
  [-250, 28.74, -35.86, 14.45, -1.22, -16.16, -28.13], [-245, 28.83, -35.86, 14.56, -1.17, -16.15, -28.11], [-240, 28.92, -35.87, 14.65, -1.12, -16.12, -28.09],
  [-235, 29.02, -35.86, 14.73, -1.07, -16.1, -28.08], [-230, 29.09, -35.85, 14.81, -1.02, -16.06, -28.07], [-225, 29.16, -35.83, 14.89, -0.96, -16.03, -28.07],
  [-220, 29.23, -35.82, 14.96, -0.92, -16.01, -28.06], [-215, 29.3, -35.8, 15.04, -0.87, -15.99, -28.06], [-210, 29.37, -35.79, 15.1, -0.82, -15.98, -28.04],
  [-205, 29.44, -35.77, 15.16, -0.78, -15.97, -28.03], [-200, 29.51, -35.76, 15.24, -0.74, -15.96, -28.02], [-195, 29.58, -35.74, 15.28, -0.7, -15.95, -28],
  [-190, 29.65, -35.73, 15.33, -0.67, -15.94, -27.99], [-185, 29.72, -35.72, 15.37, -0.66, -15.92, -27.97], [-180, 29.77, -35.7, 15.4, -0.65, -15.9, -27.99],
  [-175, 29.8, -35.69, 15.44, -0.61, -15.88, -28], [-170, 29.84, -35.67, 15.49, -0.57, -15.86, -28.02], [-165, 29.87, -35.66, 15.53, -0.56, -15.84, -28.02],
  [-160, 29.91, -35.64, 15.54, -0.54, -15.83, -28.02], [-155, 29.95, -35.64, 15.55, -0.53, -15.81, -27.94], [-150, 30.6, -35.59, 15.6, -0.6, -15.77, -27.95],
  [-145, 30.63, -35.21, 15.67, -0.55, -15.76, -27.93], [-140, 30.66, -34.83, 15.72, -0.5, -15.75, -27.92], [-135, 30.09, -34.46, 15.72, -0.49, -15.78, -27.92],
  [-130, 30.14, -34.08, 15.74, -0.48, -15.79, -27.91], [-125, 30.18, -33.93, 15.77, -0.47, -15.76, -27.89], [-120, 30.22, -33.92, 15.78, -0.47, -15.72, -27.87],
  [-115, 30.26, -33.9, 15.79, -0.45, -15.71, -27.87], [-110, 30.31, -33.89, 15.8, -0.42, -15.72, -27.87], [-105, 30.35, -33.88, 15.83, -0.42, -15.72, -27.87],
  [-100, 30.39, -33.86, 15.86, -0.41, -15.69, -27.84], [-95, 30.43, -33.85, 15.88, -0.39, -15.65, -27.81], [-90, 30.48, -33.84, 15.9, -0.37, -15.63, -27.8],
  [-85, 30.52, -33.82, 15.92, -0.35, -15.6, -27.79], [-80, 30.54, -33.81, 15.95, -0.33, -15.58, -27.77], [-75, 30.55, -33.79, 15.97, -0.33, -15.57, -27.75],
  [-70, 30.55, -33.78, 15.98, -0.32, -15.56, -27.73], [-65, 30.56, -33.77, 15.99, -0.31, -15.56, -27.71], [-60, 30.57, -33.75, 16.02, -0.3, -15.57, -27.7],
  [-55, 30.58, -33.74, 16.08, -0.28, -15.56, -27.69], [-50, 30.59, -33.73, 16.09, -0.26, -15.53, -27.69], [-45, 30.6, -33.71, 16.1, -0.24, -15.51, -27.69],
  [-40, 30.61, -33.7, 16.11, -0.22, -15.51, -27.69], [-35, 30.62, -33.68, 16.12, -0.2, -15.51, -27.68], [-30, 30.64, -33.67, 16.15, -0.19, -15.48, -27.65],
  [-25, 30.66, -33.66, 16.17, -0.18, -15.43, -27.61], [-20, 30.68, -33.64, 16.18, -0.16, -15.41, -27.59], [-15, 30.69, -33.63, 16.19, -0.14, -15.42, -27.57],
  [-10, 30.71, -33.62, 16.2, -0.12, -15.42, -27.55], [-5, 30.73, -33.6, 16.22, -0.1, -15.37, -27.54], [0, 30.75, -33.59, 16.24, -0.08, -15.32, -27.52],
  [5, 30.77, -33.56, 16.27, -0.06, -15.34, -27.51], [10, 30.79, -33.54, 16.28, -0.05, -15.41, -27.5], [15, 30.81, -33.51, 16.31, -0.04, -15.41, -27.5],
  [20, 30.83, -33.49, 16.33, -0.02, -15.33, -27.5], [25, 30.85, -33.46, 16.35, 0.01, -15.25, -27.5], [30, 30.87, -33.44, 16.35, 0.04, -15.22, -27.47],
  [35, 30.88, -33.41, 16.37, 0.05, -15.21, -27.44], [40, 30.88, -33.39, 16.4, 0.07, -15.2, -27.41], [45, 30.89, -33.36, 16.45, 0.08, -15.19, -27.39],
  [50, 30.9, -33.34, 16.39, 0.09, -15.18, -27.36], [55, 30.9, -33.32, 16.34, 0.1, -15.17, -27.35], [60, 30.91, -33.31, 16.36, 0.1, -15.16, -27.34],
  [65, 30.92, -33.3, 16.37, 0.11, -15.15, -27.32], [70, 30.93, -33.29, 16.36, 0.14, -15.13, -27.29], [75, 30.93, -33.28, 16.37, 0.17, -15.12, -27.27],
  [80, 30.94, -33.27, 16.4, 0.19, -15.12, -27.24], [85, 30.95, -33.26, 16.44, 0.21, -15.13, -27.22], [90, 30.96, -33.25, 16.48, 0.22, -15.09, -27.21],
  [95, 30.96, -33.24, 16.48, 0.23, -15.04, -27.2], [100, 30.97, -33.23, 16.47, 0.23, -15.01, -27.19], [105, 30.98, -33.22, 16.5, 0.25, -14.99, -27.17],
  [110, 30.98, -33.21, 16.52, 0.27, -14.98, -27.15], [115, 30.99, -33.2, 16.54, 0.29, -14.98, -27.12], [120, 31, -33.18, 16.55, 0.29, -14.98, -27.09],
  [125, 31.01, -33.17, 16.55, 0.3, -14.96, -27.07], [130, 31.01, -33.16, 16.55, 0.31, -14.93, -27.05], [135, 31.71, -33.15, 16.62, 0.32, -14.91, -27.03],
  [140, 31.76, -33.14, 16.69, 0.34, -14.91, -27], [145, 31.81, -33.13, 16.68, 0.38, -14.87, -26.97], [150, 31.86, -33.12, 16.68, 0.43, -14.81, -26.94],
  [155, 30.2, -33.11, 16.75, 0.65, -14.77, -26.93], [160, 30.21, -33.1, 16.81, 0.67, -14.75, -26.93], [165, 30.22, -33.09, 16.88, 0.68, -14.72, -26.93],
  [170, 30.24, -33.08, 16.88, 0.69, -14.7, -26.93], [175, 30.25, -33.07, 16.87, 0.7, -14.68, -26.93], [180, 30.26, -33.06, 16.83, 0.71, -14.67, -26.93],
  [185, 30.28, -33.05, 16.78, 0.72, -14.65, -26.93], [190, 30.29, -33.04, 16.79, 0.72, -14.64, -26.93], [195, 30.3, -33.03, 16.8, 0.73, -14.63, -26.93],
  [200, 30.31, -33.01, 16.81, 0.74, -14.61, -26.93], [205, 30.33, -33, 16.81, 0.76, -14.59, -26.93], [210, 31.47, -32.99, 16.84, 0.78, -14.59, -26.79],
  [215, 31.48, -32.98, 16.88, 0.79, -14.58, -26.79], [220, 31.49, -33.06, 16.89, 0.81, -14.57, -26.93], [225, 31.5, -33.38, 16.87, 0.83, -14.55, -26.89],
  [230, 31.52, -33.7, 16.86, 0.85, -14.53, -26.83], [235, 31.53, -34.01, 16.85, 0.86, -14.51, -26.76], [240, 31.5, -34.28, 16.86, 0.88, -14.49, -26.7],
  [245, 30.69, -34.26, 16.89, 0.9, -14.5, -26.68], [250, 30.68, -34.24, 16.92, 0.92, -14.5, -26.66], [255, 30.68, -34.23, 16.95, 0.95, -14.49, -26.62],
  [260, 30.68, -34.21, 16.99, 0.97, -14.46, -26.58], [265, 30.68, -34.19, 17, 0.99, -14.43, -26.54], [270, 30.67, -34.18, 16.98, 1.02, -14.43, -26.35],
  [275, 30.67, -34.16, 16.96, 1.04, -14.41, -26.34], [280, 30.67, -34.14, 16.95, 1.05, -14.39, -26.33], [285, 30.66, -34.12, 16.98, 1.07, -14.38, -26.32],
  [290, 30.66, -34.11, 17.01, 1.08, -14.36, -26.31], [295, 30.67, -34.09, 17.01, 1.09, -14.35, -26.3], [300, 30.68, -34.07, 17.02, 1.1, -14.34, -26.29],
  [305, 30.69, -34.06, 17.03, 1.14, -14.33, -26.27], [310, 30.7, -34.04, 17.04, 1.16, -14.31, -26.26], [315, 30.71, -34.02, 17.03, 1.17, -14.29, -26.25],
  [320, 30.72, -34.01, 17.03, 1.18, -14.27, -26.23], [325, 30.74, -33.99, 17.06, 1.19, -14.25, -26.22], [330, 30.75, -33.97, 17.08, 1.21, -14.24, -26.2],
  [335, 30.76, -33.95, 17.06, 1.22, -14.23, -26.18], [340, 30.77, -33.94, 17.04, 1.22, -14.21, -26.15], [345, 30.78, -33.92, 17.08, 1.23, -14.2, -26.14],
  [350, 30.79, -33.9, 17.1, 1.23, -14.17, -26.12], [355, 30.8, -33.89, 17.1, 1.25, -14.15, -26.1], [360, 30.81, -33.87, 17.09, 1.26, -14.14, -26.09],
  [365, 30.82, -33.85, 17.1, 1.27, -14.14, -26.06], [370, 30.83, -33.83, 17.1, 1.28, -14.13, -26.04], [375, 30.84, -33.82, 17.11, 1.29, -14.11, -26.03],
  [380, 30.85, -33.8, 17.12, 1.3, -14.09, -26.02], [385, 30.87, -33.78, 17.14, 1.32, -14.07, -26.01], [390, 30.88, -33.77, 17.17, 1.34, -14.04, -25.99],
  [395, 30.88, -33.75, 17.17, 1.35, -14.02, -25.98], [400, 30.88, -33.74, 17.14, 1.33, -14.01, -25.97], [405, 30.88, -33.73, 17.13, 1.34, -13.99, -25.96],
  [410, 30.88, -33.72, 17.13, 1.34, -13.98, -25.94], [415, 30.88, -33.71, 17.13, 1.35, -13.97, -25.93], [420, 30.89, -33.7, 17.12, 1.36, -13.96, -25.92],
  [425, 30.89, -33.69, 17.11, 1.36, -13.95, -25.91], [430, 30.89, -33.67, 17.11, 1.36, -13.94, -25.9], [435, 30.89, -33.66, 17.11, 1.36, -13.93, -25.89],
  [440, 30.89, -33.65, 17.12, 1.37, -13.92, -25.87], [445, 30.89, -33.64, 17.12, 1.39, -13.9, -25.85], [450, 30.88, -33.63, 17.13, 1.39, -13.89, -25.83],
  [455, 30.87, -33.62, 17.13, 1.41, -13.87, -25.81], [460, 30.86, -33.61, 17.11, 1.41, -13.86, -25.79], [465, 30.85, -33.59, 17.11, 1.43, -13.85, -25.78],
  [470, 30.84, -33.58, 17.13, 1.46, -13.83, -25.76], [475, 30.83, -33.57, 17.14, 1.48, -13.82, -25.75], [480, 30.82, -33.56, 17.14, 1.48, -13.81, -25.73],
  [485, 30.81, -33.55, 17.15, 1.49, -13.8, -25.71], [490, 30.8, -33.54, 17.14, 1.49, -13.78, -25.69], [495, 30.79, -33.52, 17.12, 1.49, -13.75, -25.67],
  [500, 30.78, -33.51, 17.12, 1.46, -13.73, -25.66], [505, 30.77, -33.49, 17.1, 1.46, -13.71, -25.64], [510, 30.76, -33.47, 17.08, 1.48, -13.7, -25.63],
  [515, 30.75, -33.46, 17.07, 1.49, -13.69, -25.62], [520, 30.74, -33.44, 17.07, 1.51, -13.68, -25.6], [525, 30.73, -33.42, 17.05, 1.52, -13.66, -25.59],
  [530, 30.72, -33.41, 17.03, 1.51, -13.64, -25.58], [535, 30.71, -33.39, 17.02, 1.51, -13.63, -25.57], [540, 30.7, -33.37, 17.01, 1.52, -13.61, -25.56],
  [545, 30.69, -33.35, 16.99, 1.52, -13.59, -25.55], [550, 30.67, -33.34, 16.99, 1.5, -13.58, -25.53], [555, 30.65, -33.32, 16.97, 1.5, -13.56, -25.52],
  [560, 30.63, -33.3, 16.95, 1.5, -13.54, -25.5], [565, 30.61, -33.29, 16.92, 1.5, -13.53, -25.48], [570, 30.59, -33.27, 16.91, 1.5, -13.51, -25.47],
  [575, 30.57, -33.25, 16.9, 1.5, -13.5, -25.45], [580, 30.56, -33.24, 16.88, 1.5, -13.48, -25.43], [585, 30.54, -33.22, 16.87, 1.51, -13.47, -25.41],
  [590, 30.52, -33.2, 16.82, 1.5, -13.45, -25.39], [595, 30.5, -33.18, 16.79, 1.49, -13.44, -25.37], [600, 30.47, -33.17, 16.78, 1.49, -13.42, -25.36],
  [605, 30.43, -33.15, 16.78, 1.49, -13.41, -25.34], [610, 30.4, -33.13, 16.77, 1.48, -13.39, -25.32], [615, 30.36, -33.12, 16.74, 1.48, -13.37, -25.3],
  [620, 30.33, -33.1, 16.71, 1.49, -13.35, -25.28], [625, 30.3, -33.08, 16.68, 1.48, -13.33, -25.26], [630, 30.26, -33.07, 16.64, 1.48, -13.31, -25.24],
  [635, 30.23, -33.05, 16.61, 1.47, -13.29, -25.22], [640, 30.2, -33.03, 16.61, 1.48, -13.29, -25.2], [645, 30.16, -33.01, 16.61, 1.48, -13.28, -25.19],
  [650, 30.15, -33, 16.59, 1.47, -13.26, -25.18], [655, 30.14, -32.98, 16.57, 1.46, -13.24, -25.16], [660, 30.13, -32.96, 16.55, 1.45, -13.23, -25.16],
  [665, 30.12, -32.95, 16.54, 1.45, -13.21, -25.15], [670, 30.11, -32.93, 16.52, 1.45, -13.2, -25.14], [675, 30.1, -32.91, 16.5, 1.45, -13.18, -25.13],
  [680, 30.09, -32.9, 16.47, 1.45, -13.16, -25.11], [685, 30.1, -32.88, 16.45, 1.45, -13.15, -25.09], [690, 30.12, -32.86, 16.42, 1.43, -13.13, -25.06],
  [695, 30.14, -32.85, 16.39, 1.41, -13.11, -25.04], [700, 30.16, -32.84, 16.36, 1.44, -13.1, -25.02], [705, 30.18, -32.85, 16.33, 1.49, -13.11, -25.02],
];
const edgeW = column(EDGES, 1);
const edgeE = column(EDGES, 2);
const gap = [3, 4, 5, 6].map((k) => column(EDGES, k));

// Wegdek (AHN DSM, om de 8 m): [x, a, b] met z = a + b * y; de dwarshelling
// in de bocht van de zuidelijke aanbrug is 4 %, onder de bogen 0,5 %.
// Per station het vlak door de mediaan van het DSM op drie plekken per rijbaan,
// zonder uitschieters (lantaarns, verkeer, het geluidsscherm langs het fietspad).
const PLANE = [
  [-616, 16.17, 0.0398], [-608, 16.4, 0.0427], [-600, 16.58, 0.0428], [-592, 16.75, 0.0426], [-584, 16.9, 0.0424], [-576, 17.06, 0.0421],
  [-568, 17.22, 0.0419], [-560, 17.39, 0.0418], [-552, 17.57, 0.0417], [-544, 17.75, 0.0415], [-536, 17.92, 0.0414], [-528, 18.1, 0.0411],
  [-520, 18.27, 0.0409], [-512, 18.46, 0.0408], [-504, 18.65, 0.0406], [-496, 18.85, 0.0405], [-488, 19.04, 0.0402], [-480, 19.24, 0.0398],
  [-472, 19.43, 0.0395], [-464, 19.63, 0.0392], [-456, 19.85, 0.0397], [-448, 20.07, 0.0403], [-440, 20.29, 0.0408], [-432, 20.51, 0.0414],
  [-424, 20.73, 0.042], [-416, 20.95, 0.0425], [-408, 21.17, 0.0431], [-400, 21.39, 0.0437], [-392, 21.61, 0.0442], [-384, 21.82, 0.0448],
  [-376, 22.04, 0.0454], [-368, 22.26, 0.0459], [-360, 22.48, 0.0465], [-352, 22.7, 0.0471], [-344, 22.92, 0.0476], [-336, 23.2, 0.0369],
  [-328, 23.44, 0.0306], [-320, 23.66, 0.0296], [-312, 23.89, 0.0283], [-304, 24.12, 0.0271], [-296, 24.34, 0.0259], [-288, 24.55, 0.0251],
  [-280, 24.71, 0.0242], [-272, 24.86, 0.0227], [-264, 25.11, 0.0202], [-256, 25.39, 0.0177], [-248, 25.64, 0.015], [-240, 25.84, 0.0131],
  [-232, 26.01, 0.0117], [-224, 26.17, 0.0103], [-216, 26.37, 0.0091], [-208, 26.58, 0.0077], [-200, 26.75, 0.0067], [-192, 26.86, 0.0106],
  [-184, 26.98, 0.0107], [-176, 27.11, 0.0092], [-168, 27.23, 0.0078], [-160, 27.36, 0.0063], [-152, 27.48, 0.0048], [-144, 27.61, 0.0033],
  [-136, 27.96, 0.0023], [-128, 28.7, 0.0025], [-120, 28.75, 0.0029], [-112, 28.69, 0.0033], [-104, 28.2, 0.0036], [-96, 28.18, 0.0038],
  [-88, 28.25, 0.004], [-80, 28.31, 0.0042], [-72, 28.38, 0.0043], [-64, 28.43, 0.0044], [-56, 28.48, 0.0045], [-48, 28.52, 0.0046],
  [-40, 28.55, 0.0047], [-32, 28.57, 0.0047], [-24, 28.59, 0.0049], [-16, 28.61, 0.0051], [-8, 28.61, 0.0052], [0, 28.62, 0.0053],
  [8, 28.61, 0.0053], [16, 28.61, 0.0052], [24, 28.6, 0.005], [32, 28.58, 0.0049], [40, 28.56, 0.0047], [48, 28.53, 0.0047],
  [56, 28.49, 0.0046], [64, 28.45, 0.0046], [72, 28.4, 0.0045], [80, 28.34, 0.0043], [88, 28.26, 0.004], [96, 28.2, 0.0048],
  [104, 28.11, 0.0048], [112, 28.01, 0.0044], [120, 27.9, 0.004], [128, 27.8, 0.0036], [136, 27.7, 0.0032], [144, 27.6, 0.0029],
  [152, 27.5, 0.0025], [160, 27.4, 0.0021], [168, 27.21, 0.002], [176, 27.07, 0.0019], [184, 26.94, 0.0018], [192, 26.8, 0.0019],
  [200, 26.65, 0.002], [208, 26.5, 0.0021], [216, 26.35, 0.0021], [224, 26.18, 0.0022], [232, 26.01, 0.0023], [240, 25.83, 0.0024],
  [248, 25.64, 0.0025], [256, 25.44, 0.0025], [264, 25.24, 0.0025], [272, 25.03, 0.0024], [280, 24.81, 0.0022], [288, 24.57, 0.002],
  [296, 24.33, 0.0019], [304, 24.08, 0.002], [312, 23.83, 0.0021], [320, 23.59, 0.0023], [328, 23.38, 0.0025], [336, 23.12, 0.0027],
  [344, 22.8, 0.003], [352, 22.5, 0.0032], [360, 22.23, 0.0033], [368, 21.96, 0.0034], [376, 21.7, 0.0034], [384, 21.43, 0.0034],
  [392, 21.15, 0.0035], [400, 20.9, 0.0034], [408, 20.63, 0.0032], [416, 20.37, 0.003], [424, 20.1, 0.0029], [432, 19.84, 0.0028],
  [440, 19.58, 0.0028], [448, 19.32, 0.0027], [456, 19.05, 0.0027], [464, 18.79, 0.0026], [472, 18.52, 0.0026], [480, 18.25, 0.0026],
  [488, 17.98, 0.0026], [496, 17.71, 0.0026], [504, 17.45, 0.0025], [512, 17.18, 0.0025], [520, 16.92, 0.0025], [528, 16.65, 0.0026],
  [536, 16.38, 0.0026], [544, 16.11, 0.0026], [552, 15.85, 0.0026], [560, 15.58, 0.0026], [568, 15.31, 0.0026], [576, 15.04, 0.0025],
  [584, 14.77, 0.0025], [592, 14.5, 0.0025], [600, 14.24, 0.0026], [608, 13.97, 0.0026], [616, 13.71, 0.0027], [624, 13.44, 0.0028],
  [632, 13.18, 0.0028], [640, 12.92, 0.0028], [648, 12.65, 0.0028], [656, 12.37, 0.0027], [664, 12.11, 0.0026], [672, 11.85, 0.0025],
  [680, 11.58, 0.0024], [688, 11.32, 0.0023], [696, 11.09, 0.0038], [704, 10.94, 0.0078],
];
const planeA = column(PLANE, 1);
const planeB = column(PLANE, 2);
const top = (x, y) => planeA(x) + planeB(x) * y;
const road = (x) => top(x, 0);

// Dekrand (BGT overbruggingsdeel, vereenvoudigd tot 5 cm) met de landhoofden.
const OUTLINE = [
  [696.49, -32.84], [716.74, -32.86], [716.75, -32.64], [715.1, -32.66], [715, -25.53], [706.91, -25.38],
  [706.69, 28.81], [709.56, 28.81], [709.58, 30.2], [682.2, 30.09], [645.51, 30.16], [594.78, 30.5],
  [543.98, 30.69], [442.48, 30.89], [391.79, 30.88], [290.22, 30.66], [241.09, 30.69], [240.9, 31.07],
  [240.56, 31.32], [240.13, 31.49], [239.63, 31.54], [207.28, 31.46], [206.79, 31.39], [206.38, 31.19],
  [206.16, 30.84], [206.02, 30.33], [151.82, 30.19], [151.85, 31.88], [134.52, 31.71], [134.52, 31.02],
  [31.09, 30.87], [-34.52, 30.62], [-83.54, 30.53], [-135.59, 30.09], [-135.56, 30.68], [-154.57, 30.58],
  [-154.58, 29.95], [-183.58, 29.74], [-234.79, 29.02], [-256.76, 28.61], [-284.94, 27.83], [-308.04, 26.93],
  [-325.82, 26.06], [-344.2, 24.95], [-360.94, 23.76], [-382.82, 21.78], [-403.72, 19.44], [-413.54, 18.2],
  [-432.1, 15.69], [-451.9, 12.52], [-486.41, 6.2], [-504.87, 2.26], [-517.67, -0.68], [-536.45, -5.25],
  [-552.62, -9.52], [-568.49, -13.94], [-582.96, -18.24], [-600.42, -23.81], [-614.18, -28.42], [-636.01, -35.58],
  [-635.92, -36.11], [-628.67, -33.74], [-611.19, -86.29], [-619.03, -89.61], [-616.07, -96.49], [-617.64, -97.18],
  [-617.58, -97.41], [-610.5, -94.33], [-606.14, -92.68], [-598.6, -89.9], [-586.69, -85.8], [-577.57, -82.83],
  [-551.34, -74.8], [-531.41, -69.22], [-514.55, -64.97], [-503.05, -62.19], [-485.84, -58.25], [-472.33, -55.49],
  [-454.51, -52.05], [-427.74, -47.62], [-405.36, -44.47], [-386.29, -42.17], [-369.23, -40.47], [-355.83, -39.37],
  [-337.88, -38.09], [-323.76, -37.32], [-306.11, -36.67], [-290.98, -36.31], [-255.98, -35.85], [-237.76, -35.87],
  [-155.74, -35.63], [-151.34, -35.69], [-128.16, -33.94], [-0.7, -33.59], [51.68, -33.33], [216.26, -32.98],
  [216.23, -34.02], [216.76, -33.74], [217.28, -33.75], [217.55, -33.86], [217.57, -32.91], [239.25, -34.28],
  [391.96, -33.76], [493.45, -33.53],
];
const ABUTMENT_SOUTH = [
  [-597.39, -89.49], [-617.62, -29.55], [-636.01, -35.58], [-635.92, -36.11], [-628.67, -33.74], [-611.19, -86.29],
  [-619.03, -89.61], [-616.07, -96.49], [-617.64, -97.18], [-617.58, -97.41], [-610.5, -94.33],
];
const ABUTMENT_NORTH = [
  [715.1, -32.66], [715, -25.53], [706.91, -25.38], [706.69, 28.81], [709.56, 28.81], [709.58, 30.26],
  [705.61, 30.21], [705.9, -25.88], [711.93, -25.98], [711.96, -32.92], [716.74, -32.91], [716.75, -32.64],
];

// Constructiehoogtes (geschat op foto's): dekplaat 0,8 m over de hele brug; de
// aanbruggen met twee betonnen kokers per brug (3,2 m diep, op een kwart en
// driekwart van de brugbreedte); het boogdek met trekbanden onder de ribben
// (4,5 m) en dwarsdragers ertussen (3,0 m), het fietspad als uitkraging; de
// kleppen een stalen koker van 2,5 m.
const SLAB = 0.8;
const BOX = { depth: 3.2, topWidth: 0.34, bottomWidth: 0.26 };
const TIE_DEPTH = 4.5;
const CROSS_DEPTH = 3.0;
// Schampkanten en geleiderails in de middenbermen: 0,9 m breed, 0,6 m hoog.
const KERB = { width: 0.9, height: 0.6 };

// Bogen: per brug twee verticale ribben van 2,0 m breed (AHN). Bovenrand een
// parabool met de top op NAP +68,0 m die het wegdek op de pijlerharten
// (x = ±148,3) raakt; de rib is 2,8 m hoog (foto's).
const ARCH = { crown: 68.0, k: 0.00182, depth: 2.8, ribEnd: 148.3 };
const RIBS = [
  [28.6, 30.6], // westboog, westrib
  [1.6, 3.6], // westboog, oostrib
  [-4.4, -2.4], // oostboog, westrib
  [-28.4, -26.4], // oostboog, oostrib (het fietspad ligt erbuiten)
];
const archTop = (x) => ARCH.crown - ARCH.k * x * x;
const archBottom = (x) => archTop(x) - ARCH.depth * Math.hypot(1, 2 * ARCH.k * x);
// Hangers: twintig velden van 14,83 m (foto's), van elke dekknoop een hanger
// naar de boog een veld naar links en een veld naar rechts; de hangers van
// buurknopen kruisen elkaar halverwege (de kenmerkende X-en). Op 1:1000 is een
// kabel niet te printen: het vlak tussen dek en rib is een scherm met de
// hangers als stroken van 1,0 m; tussen de stroken blijven openingen over
// waarvan elke bovenkant minstens 50 graden helt, of die onder een spitse top
// van 55 graden blijven. Openingen kleiner dan 2 m2 blijven dicht.
const PANEL = (2 * ARCH.ribEnd) / 20;
const DECK_NODES = Array.from({ length: 19 }, (_, k) => -ARCH.ribEnd + PANEL * (k + 1));
const HANGER = { width: 1.0, steep: 50, pointed: 55, minArea: 2.0, minHeight: 1.2 };

// Rivierpijlers (BGT-sloven met ronde koppen): een wand van onder het water tot
// 0,3 m onder het wegdek, met de ronde koppen naast het dek; aan de lange
// zijden blinde nissen van 0,35 m tussen de kolommen (foto's).
const ARCH_PIERS = [
  { x0: -156.1, x1: -141.8, y0: -41.95, y1: 44.84, top: { y0: -41.95, y1: 44.84 } },
  // Noordpijler: de sloof loopt onder de bedieningstoren door tot y = -55,6;
  // het hoge deel houdt aan de oostrand van het dek op.
  { x0: 140.7, x1: 154.7, y0: -55.6, y1: 44.6, top: { y0: -33.6, y1: 44.6 } },
];
const PIER_CAP_NAP = 3.0;
const PIER_NICHE = { width: 3.0, depth: 0.35, z0: 3.5, below: 6.0, y: [-20, -10, 0, 10, 20, 30] };
// Bedieningstoren (BAG 0599100000670512, BGT-pand 5,4 m): schacht Ø 5,4 m,
// kanzel van zestien vlakken die naar buiten helt (Ø 10,8 tot 11,4 m) op een
// kraag van 50 graden, raamband als nis, en een dakkoker tot NAP +49,6 m (AHN).
const TOWER = {
  c: [147.7, -37.7],
  shaft: 2.7,
  collar: [37.8, 41.0],
  cabin: { r0: 5.4, r1: 5.7, z0: 41.0, z1: 45.6 },
  roof: { r: 5.0, z: 46.4 },
  stack: { r: 2.45, z: 49.6 },
  windows: { z0: 42.4, z1: 45.0, inner: 5.2 },
};
// Basculekelder: blok onder het dek met een plint tot NAP +2,0 m en aan beide
// lange gevels drie raambanden als nis van 0,35 m (foto's); aan de oostgevel
// de ronde trapkoker tot NAP +31,1 m (AHN).
const KELDER_WINDOWS = { x: [216.6, 235.6], z: [[5.9, 11.1], [11.8, 17.0], [18.2, 23.1]], depth: 0.35 };
const STAIR = { c: [216.2, -35.6], r: 1.7, topNap: 31.1 };
const JOINT = { width: 0.4, depth: 0.3 };

// Zuidelijke aanbrug: per pijlerlijn twee sloven (BGT, met ronde einden; tot
// NAP +2,5 m) met ronde kolommen van Ø 2,6 m om de circa 6 m (foto's).
const SOUTH_PIERS = [
  { c: [-564.99, -27.24], dir: [0.2769, -0.9609], len: 20.44, thick: 3.51 },
  { c: [-556.42, -56.63], dir: [0.2755, -0.9613], len: 33.41, thick: 3.51 },
  { c: [-514.42, -14.05], dir: [-0.228, 0.9737], len: 20.42, thick: 3.5 },
  { c: [-507.37, -43.83], dir: [-0.2267, 0.974], len: 33.42, thick: 3.49 },
  { c: [-463.29, -3.41], dir: [0.1787, -0.9839], len: 20.42, thick: 3.52 },
  { c: [-457.76, -33.55], dir: [-0.1779, 0.984], len: 33.38, thick: 3.52 },
  { c: [-411.65, 4.57], dir: [0.1291, -0.9916], len: 20.43, thick: 3.51 },
  { c: [-407.67, -25.73], dir: [0.1279, -0.9918], len: 33.4, thick: 3.5 },
  { c: [-359.68, 10.01], dir: [0.0759, -0.9971], len: 19.45, thick: 5 },
  { c: [-357.31, -19.87], dir: [0.0771, -0.997], len: 35.33, thick: 4.98 },
  { c: [-307.74, 13], dir: [-0.0309, 0.9995], len: 22.09, thick: 5 },
  { c: [-306.81, -17.14], dir: [0.0309, -0.9995], len: 33.43, thick: 5 },
  { c: [-256.37, 14.92], dir: [0.0097, -1], len: 22.93, thick: 5 },
  { c: [-256.07, -16.38], dir: [0.0097, -1], len: 34.7, thick: 5 },
  { c: [-205.45, 16.47], dir: [0.0042, -1], len: 22.53, thick: 5 },
  { c: [-205.32, -15.65], dir: [0.0042, -1], len: 36.89, thick: 5 },
];
const SLOOF_NAP = 2.5;
const SOUTH_COLUMN = { r: 1.3, spacing: 6.0, margin: 1.8 };
// Noordelijke aanbrug: wandkolommen van 1,7 × 6,0 m (BGT) op x = 340,9 tot
// 645,4; de lijn op de noordoever (x = 290,1) op dezelfde steek geschat.
const NORTH_BLADES = [
  [340.41, 341.53, -32.64, -31.52], [340.08, 341.81, -28.01, -22.03], [340.05, 341.78, -17.21, -11.24], [340.03, 341.76, -6.41, -0.45],
  [340, 341.73, 8, 13.95], [339.98, 341.7, 20.19, 26.15], [391.16, 392.28, -32.44, -31.31], [390.79, 392.51, -27.85, -21.89],
  [390.77, 392.5, -17.06, -11.09], [390.76, 392.48, -6.25, -0.3], [390.73, 392.47, 7.96, 13.93], [390.71, 392.45, 20.15, 26.12],
  [441.87, 443, -32.3, -31.17], [441.53, 443.26, -27.67, -21.68], [441.53, 443.25, -16.85, -10.9], [441.51, 443.24, -6.06, -0.11],
  [441.5, 443.23, 8.03, 13.99], [441.49, 443.22, 20.19, 26.14], [492.61, 493.73, -32.13, -31.02], [492.26, 494, -27.51, -21.51],
  [492.26, 493.98, -16.67, -10.73], [492.24, 493.96, -5.89, 0.08], [492.22, 493.95, 7.99, 13.94], [492.21, 493.93, 20.14, 26.08],
  [543.36, 544.48, -31.95, -30.83], [543.02, 544.75, -27.33, -21.35], [543, 544.74, -16.52, -10.57], [542.99, 544.71, -5.73, 0.22],
  [542.97, 544.69, 7.92, 13.87], [542.95, 544.68, 20.1, 26.06], [594.15, 595.27, -31.81, -30.69], [593.8, 595.53, -27.19, -21.25],
  [593.78, 595.51, -16.41, -10.46], [593.76, 595.48, -5.61, 0.35], [593.73, 595.46, 7.86, 13.82], [593.71, 595.43, 20.04, 26],
  [644.84, 645.97, -31.65, -30.53], [644.5, 646.26, -27.07, -21.08], [644.52, 646.25, -16.25, -10.3], [644.5, 646.23, -5.45, 0.5],
  [644.48, 646.21, 7.79, 13.74], [644.46, 646.19, 19.97, 25.92],
];
const SHORE_LINE_SHIFT = -50.75;

// ---------- stations ----------
// Alle lofts langs de brug gebruiken hetzelfde stationsraster (om de 2,5 m
// plus de zonegrenzen), zodat dek, schampkanten en wegdeklaag dezelfde
// doorsneden hebben.
const BREAKS = [-ARCH_END, -ARCH.ribEnd, ARCH.ribEnd, ARCH_END, LEAF.x0, LEAF.x1, KELDER.x0, KELDER.x1];
const GRID = [...Array.from({ length: Math.round((X_NORTH - X_SOUTH) / 2.5) + 1 }, (_, i) => X_SOUTH + 2.5 * i), ...BREAKS]
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-6);
const stations = (x0, x1) => [x0, ...GRID.filter((x) => x > x0 + 1e-6 && x < x1 - 1e-6), x1];
// Doorsnede tussen y = lo en hi met de bovenkant op het wegdekvlak plus dz1
// en de onderkant op het wegdekvlak plus dz0.
function band(x0, x1, edges, dz0, dz1) {
  return loftX(
    stations(x0, x1).map((x) => {
      const [lo, hi] = edges(x);
      return {
        x,
        section: [
          [lo, top(x, lo) + dz0],
          [hi, top(x, hi) + dz0],
          [hi, top(x, hi) + dz1],
          [lo, top(x, lo) + dz1],
        ],
      };
    }),
  );
}
const wide = (x) => [edgeE(x) - 1.0, edgeW(x) + 1.0];
const outlinePrism = prism(OUTLINE, BASE - 1, 120);

// ---------- dek ----------
const slab = band(X_SOUTH, X_NORTH, wide, -SLAB, 0);
// Twee kokers per brug op de aanbruggen.
const halves = [(x) => [gap[1](x), edgeW(x)], (x) => [edgeE(x), gap[1](x)]];
function boxes(x0, x1) {
  return halves.flatMap((half) =>
    [0.25, 0.75].map((f) =>
      loftX(
        stations(x0, x1).map((x) => {
          const [lo, hi] = half(x);
          const w = hi - lo;
          const c = lo + w * f;
          const zt = top(x, c);
          const bb = (BOX.bottomWidth * w) / 2;
          const bt = (BOX.topWidth * w) / 2;
          return { x, section: [[c - bb, zt - BOX.depth], [c + bb, zt - BOX.depth], [c + bt, top(x, c + bt) - SLAB + 0.1], [c - bt, top(x, c - bt) - SLAB + 0.1]] };
        }),
      ),
    ),
  );
}
const southBoxes = boxes(X_SOUTH, -ARCH_END + 0.01);
const northBoxes = boxes(KELDER.x1 - 0.01, X_NORTH);
// Boogdek: dwarsdragers tussen de buitenste ribben, trekbanden onder de ribben
// (onder de westrib tot de dekrand) en het fietspad als uitkraging.
const archDeck = union([
  band(-ARCH_END, ARCH_END, () => [RIBS[3][0], RIBS[0][1]], -CROSS_DEPTH, -SLAB + 0.1),
  ...RIBS.map(([y0, y1], i) =>
    band(-ARCH_END, ARCH_END, (x) => [y0 - 0.1, i === 0 ? edgeW(x) + 1.0 : y1 + 0.1], -TIE_DEPTH, -SLAB + 0.1),
  ),
  loftX(
    stations(-ARCH_END, ARCH_END).map((x) => {
      const e0 = edgeE(x) - 1.0;
      return {
        x,
        section: [[e0, top(x, e0) - SLAB], [RIBS[3][0], top(x, RIBS[3][0]) - 1.6], [RIBS[3][0], top(x, RIBS[3][0]) - SLAB + 0.1], [e0, top(x, e0) - SLAB + 0.1]],
      };
    }),
  ),
]);
const leafDeck = band(LEAF.x0, LEAF.x1, (x) => [edgeE(x) + 1.5, edgeW(x) - 1.5], -LEAF.depth, -SLAB + 0.1);

// Schampkanten langs de dekranden en geleiderails in de middenbermen; `margin`
// maakt ze rondom groter (de vrije ruimte die de wegdeklaag eromheen houdt).
function kerb(x0, x1, lohi, margin = 0) {
  return loftX(
    stations(x0, x1).map((x) => {
      const [lo, hi] = lohi(x);
      const a = lo - margin;
      const b = hi + margin;
      const zt = top(x, (lo + hi) / 2);
      return { x, section: [[a, zt - 0.3 - margin], [b, zt - 0.3 - margin], [b, zt + KERB.height + margin], [a, zt + KERB.height + margin]] };
    }),
  );
}
const halfKerb = KERB.width / 2;
const KERBS = [
  [X_SOUTH, X_NORTH, (x) => [edgeW(x) - KERB.width, edgeW(x) + 0.5]],
  [X_SOUTH, X_NORTH, (x) => [edgeE(x) - 0.5, edgeE(x) + KERB.width]],
  [X_SOUTH, X_NORTH, (x) => [gap[0](x) - halfKerb, gap[0](x) + halfKerb]],
  [X_SOUTH, X_NORTH, (x) => [gap[2](x) - halfKerb, gap[2](x) + halfKerb]],
  // Tussen de bruggen en langs het fietspad alleen buiten de bogen; onder de
  // bogen scheiden de ribben.
  [X_SOUTH, -ARCH_END, (x) => [gap[1](x) - halfKerb, gap[1](x) + halfKerb]],
  [ARCH_END, X_NORTH, (x) => [gap[1](x) - halfKerb, gap[1](x) + halfKerb]],
  [X_SOUTH, -ARCH_END, (x) => [gap[3](x) - halfKerb, gap[3](x) + halfKerb]],
  [ARCH_END, X_NORTH, (x) => [gap[3](x) - halfKerb, gap[3](x) + halfKerb]],
];
const kerbs = KERBS.map(([x0, x1, lohi]) => kerb(x0, x1, lohi));
// Voegen van de kleppen: sleuven over het wegdek bij de punt en het draaipunt.
const joints = [LEAF.x0, LEAF.x1].map((x) =>
  boxFromTo(x - JOINT.width / 2, x + JOINT.width / 2, edgeE(x) + KERB.width + 0.05, edgeW(x) - KERB.width - 0.05, road(x) - JOINT.depth, road(x) + 2),
);
const deck = union([slab, ...southBoxes, ...northBoxes, archDeck, leafDeck, ...kerbs]).intersect(outlinePrism);

// ---------- pijlers, kelder en toren ----------
// Ruimte onder het dek (voor de landhoofden).
const underDeck = band(X_SOUTH, X_NORTH, (x) => [edgeE(x) - 2, edgeW(x) + 2], BASE - 60, -0.05).intersect(
  boxFromTo(X_SOUTH - 1, X_NORTH + 1, -200, 200, BASE, 200),
);
const abutments = [ABUTMENT_SOUTH, ABUTMENT_NORTH].map((poly) => prism(poly, BASE, 100).intersect(underDeck));

// Rivierpijlers.
function roundedWall(x0, x1, y0, y1, z0, z1) {
  const r = (x1 - x0) / 2;
  const xc = (x0 + x1) / 2;
  return Manifold.hull([
    Manifold.cylinder(z1 - z0, r, r, 48, false).translate([xc, y0 + r, z0]),
    Manifold.cylinder(z1 - z0, r, r, 48, false).translate([xc, y1 - r, z0]),
  ]);
}
const archPiers = ARCH_PIERS.map(({ x0, x1, y0, y1, top: t }) => {
  const xc = (x0 + x1) / 2;
  const zTop = road(xc) - 0.3;
  const cap = roundedWall(x0, x1, y0, y1, BASE, PIER_CAP_NAP);
  const wall = roundedWall(x0, x1, t.y0, t.y1, BASE, zTop);
  const niches = union(
    PIER_NICHE.y.flatMap((y) =>
      [x0, x1].map((xf) =>
        boxFromTo(xf - (xf < xc ? 0.5 : -0.5), xf + (xf < xc ? PIER_NICHE.depth : -PIER_NICHE.depth), y - PIER_NICHE.width / 2, y + PIER_NICHE.width / 2, PIER_NICHE.z0, zTop - PIER_NICHE.below),
      ),
    ),
  );
  return union([cap, wall]).subtract(niches);
});

// Bedieningstoren.
const [tx, ty] = TOWER.c;
const tower = (() => {
  const shaft = Manifold.cylinder(TOWER.collar[1] - BASE, TOWER.shaft, TOWER.shaft, 32, false).translate([tx, ty, BASE]);
  const collar = Manifold.cylinder(TOWER.collar[1] - TOWER.collar[0], TOWER.shaft, TOWER.cabin.r0, 16, false).translate([tx, ty, TOWER.collar[0]]);
  const cabin = Manifold.cylinder(TOWER.cabin.z1 - TOWER.cabin.z0, TOWER.cabin.r0, TOWER.cabin.r1, 16, false).translate([tx, ty, TOWER.cabin.z0]);
  const roof = Manifold.cylinder(TOWER.roof.z - TOWER.cabin.z1, TOWER.cabin.r1, TOWER.roof.r, 16, false).translate([tx, ty, TOWER.cabin.z1]);
  const stack = Manifold.cylinder(TOWER.stack.z - TOWER.roof.z + 0.1, TOWER.stack.r, TOWER.stack.r, 32, false).translate([tx, ty, TOWER.roof.z - 0.1]);
  const band_ = Manifold.cylinder(TOWER.windows.z1 - TOWER.windows.z0, 7, 7, 16, false)
    .subtract(Manifold.cylinder(TOWER.windows.z1 - TOWER.windows.z0 + 0.2, TOWER.windows.inner, TOWER.windows.inner, 16, false).translate([0, 0, -0.1]))
    .translate([tx, ty, TOWER.windows.z0]);
  return union([shaft, collar, cabin, roof, stack]).subtract(band_);
})();

// Basculekelder met de trapkoker.
const kelder = (() => {
  const block = loftX(
    stations(KELDER.x0, KELDER.x1).map((x) => ({
      x,
      section: [[KELDER.y0, BASE], [KELDER.y1, BASE], [KELDER.y1, top(x, KELDER.y1) - SLAB + 0.1], [KELDER.y0, top(x, KELDER.y0) - SLAB + 0.1]],
    })),
  );
  const plinth = boxFromTo(KELDER.x0 - 0.6, KELDER.x1 + 0.6, KELDER.y0 - 0.6, KELDER.y1 + 0.6, BASE, 2.0);
  const windows = union(
    KELDER_WINDOWS.z.flatMap(([z0, z1]) => [
      boxFromTo(KELDER_WINDOWS.x[0], KELDER_WINDOWS.x[1], KELDER.y0 - 0.5, KELDER.y0 + KELDER_WINDOWS.depth, z0, z1),
      boxFromTo(KELDER_WINDOWS.x[0], KELDER_WINDOWS.x[1], KELDER.y1 - KELDER_WINDOWS.depth, KELDER.y1 + 0.5, z0, z1),
    ]),
  );
  const stair = Manifold.cylinder(STAIR.topNap - BASE, STAIR.r, STAIR.r, 32, false).translate([STAIR.c[0], STAIR.c[1], BASE]);
  return union([union([block, plinth]).subtract(windows), stair]);
})();

// Zuidelijke aanbrug: sloven met kolommen.
const southPiers = SOUTH_PIERS.flatMap(({ c, dir, len, thick }) => {
  const r = thick / 2;
  const a = (len / 2 - r);
  const ends = [-a, a].map((s) => [c[0] + dir[0] * s, c[1] + dir[1] * s]);
  const sloof = Manifold.hull(ends.map(([x, y]) => Manifold.cylinder(SLOOF_NAP - BASE, r, r, 32, false).translate([x, y, BASE])));
  const span = len / 2 - SOUTH_COLUMN.margin;
  const n = Math.max(2, Math.round((2 * span) / SOUTH_COLUMN.spacing) + 1);
  const cols = Array.from({ length: n }, (_, i) => {
    const s = -span + (2 * span * i) / (n - 1);
    const x = c[0] + dir[0] * s;
    const y = c[1] + dir[1] * s;
    const zTop = top(x, y) - SLAB + 0.2;
    return Manifold.cylinder(zTop - SLOOF_NAP + 0.1, SOUTH_COLUMN.r, SOUTH_COLUMN.r, 24, false).translate([x, y, SLOOF_NAP - 0.1]);
  });
  return [sloof, ...cols];
});
// Noordelijke aanbrug: wandkolommen.
const shoreLine = NORTH_BLADES.filter(([x0]) => x0 < 345).map(([x0, x1, y0, y1]) => [x0 + SHORE_LINE_SHIFT, x1 + SHORE_LINE_SHIFT, y0, y1]);
const northPiers = [...shoreLine, ...NORTH_BLADES].map(([x0, x1, y0, y1]) => {
  const zTop = top((x0 + x1) / 2, (y0 + y1) / 2) - SLAB + 0.2;
  return boxFromTo(x0, x1, y0, y1, BASE, zTop);
});

// ---------- bogen: ribben met het hangerscherm ----------
const ribXs = Array.from({ length: Math.round((2 * ARCH.ribEnd) / 0.5) + 1 }, (_, i) => -ARCH.ribEnd + 0.5 * i);
const ribBand = [...ribXs.map((x) => [x, road(x) - TIE_DEPTH + 0.2]), ...[...ribXs].reverse().map((x) => [x, archTop(x)])];
// Het vlak tussen het wegdek en de onderkant van de rib (wegdek op de voeg
// tussen de bruggen; de dwarshelling onder de bogen is hooguit 0,15 m).
const screenXs = ribXs.filter((x) => archBottom(x) > road(x) + 0.05);
const screenRegion = new CrossSection([
  ccw([...screenXs.map((x) => [x, road(x) - 0.05]), ...[...screenXs].reverse().map((x) => [x, archBottom(x)])]),
]);
const cables = DECK_NODES.flatMap((xd) =>
  [-1, 1]
    .map((s) => xd + s * PANEL)
    .filter((x2) => Math.abs(x2) < ARCH.ribEnd - 1 && archBottom(x2) - road(x2) > 3)
    .map((x2) => [[xd, road(xd)], [x2, archBottom(x2)]]),
);
const strips = cables.map(([[x0, z0], [x1, z1]]) => {
  const len = Math.hypot(x1 - x0, z1 - z0);
  const d = [(x1 - x0) / len, (z1 - z0) / len];
  const n = [-d[1] * (HANGER.width / 2), d[0] * (HANGER.width / 2)];
  const a = [x0 - d[0] * 1.5, z0 - d[1] * 1.5];
  const b = [x1 + d[0] * 1.5, z1 + d[1] * 1.5];
  return ccw([
    [a[0] + n[0], a[1] + n[1]],
    [b[0] + n[0], b[1] + n[1]],
    [b[0] - n[0], b[1] - n[1]],
    [a[0] - n[0], a[1] - n[1]],
  ]);
});
const cells = screenRegion.subtract(new CrossSection(strips)).decompose();
const TAN_POINTED = Math.tan((HANGER.pointed * Math.PI) / 180);
const openingReport = [];
const openings = [];
// Punten op de plafonds van een polygoon (randen waar de opening onder ligt:
// de rand loopt naar links) die flauwer hellen dan 50 graden.
function flatCeilings(poly) {
  const flat = [];
  poly.forEach(([x0, z0], i) => {
    const [x1, z1] = poly[(i + 1) % poly.length];
    if (x1 >= x0 - 1e-9) return;
    const angle = (Math.atan2(Math.abs(z1 - z0), Math.abs(x1 - x0)) * 180) / Math.PI;
    if (angle >= HANGER.steep) return;
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, z1 - z0) / 0.2));
    for (let k = 0; k <= n; k++) flat.push([lerp(x0, x1, k / n), lerp(z0, z1, k / n)]);
  });
  return flat;
}
const rangeOf = (values) => values.reduce(([lo, hi], v) => [Math.min(lo, v), Math.max(hi, v)], [Infinity, -Infinity]);
for (const cell of cells) {
  const poly = ccw(cell.toPolygons()[0]);
  const flat = flatCeilings(poly);
  let shape = cell;
  if (flat.length) {
    // Spitse top van 55 graden onder alle flauwe plafonds; kies de top zo dat
    // de opening zo groot mogelijk is.
    const [lo, hi] = rangeOf(poly.map(([x]) => x));
    let best = null;
    for (let xc = lo; xc <= hi; xc += 0.25) {
      let h = Infinity;
      for (const [qx, qz] of flat) h = Math.min(h, qz + TAN_POINTED * Math.abs(qx - xc));
      h -= 0.05;
      let cut = null;
      for (let k = 0; k < 40; k++, h -= 0.05) {
        const gable = new CrossSection([[[xc - 100, h - TAN_POINTED * 100], [xc + 100, h - TAN_POINTED * 100], [xc, h]]]);
        cut = cell.intersect(gable);
        if (cut.isEmpty() || cut.toPolygons().every((q) => flatCeilings(ccw(q)).length === 0)) break;
      }
      const a = cut.area();
      if (!best || a > best.area) best = { area: a, cut };
    }
    shape = best.cut;
  }
  const area = shape.area();
  if (area < HANGER.minArea) continue;
  const pts = shape.toPolygons().flat();
  const [zLo, zHi] = rangeOf(pts.map(([, z]) => z));
  if (zHi - zLo < HANGER.minHeight) continue;
  openings.push(shape);
  const [xLo, xHi] = rangeOf(pts.map(([x]) => x));
  openingReport.push([+((xLo + xHi) / 2).toFixed(1), +zHi.toFixed(2), +area.toFixed(1)]);
}
const openingSection = CrossSection.union(openings);
// De westrib staat op de dekrand; waar de BGT-dekrand iets binnen de rib
// ligt (bij de zuidpijler tot 0,5 m), volgt de rib de dekrand.
const ribs = RIBS.map(([y0, y1]) =>
  profileY(ribBand, y0, y1).subtract(extrudeY(openingSection, y0 - 0.5, y1 + 0.5)).intersect(outlinePrism),
);

const bridge = union([deck, ...abutments, ...archPiers, tower, kelder, ...southPiers, ...northPiers, ...ribs]).subtract(union(joints));

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij. Net als de overhangopvulling van de
// export krijgt de STL daaronder een wig van 50 graden vanaf de onderkant van
// de dekranden (onder de bogen aan de westrand vanaf de trekband) tot de
// onderplaat; het dek is overal breder dan twee keer de hoogte, zodat de wiggen
// elkaar boven de onderplaat niet raken.
const KNEE = Math.tan((50 * Math.PI) / 180);
const footStations = stations(X_SOUTH, X_NORTH).map((x) => {
  const e0 = edgeE(x) - 1.0;
  const e1 = edgeW(x) + 1.0;
  const inArch = x > -ARCH_END - 0.005 && x < ARCH_END + 0.005;
  const zb0 = top(x, e0) - SLAB - 0.02;
  const zb1 = top(x, e1) - (inArch ? TIE_DEPTH : SLAB) - 0.02;
  const b0 = e0 + (zb0 - BASE) / KNEE;
  const b1 = e1 - (zb1 - BASE) / KNEE;
  if (b1 - b0 < 1) throw new Error(`printvoet: wiggen raken elkaar op x = ${x}`);
  return {
    x,
    section: [[b0, BASE], [b1, BASE], [b1 + 1e-3, BASE + 1e-3], [e1, zb1], [e1, top(x, e1) - 0.3], [e0, top(x, e0) - 0.3], [e0, zb0], [b0 - 1e-3, BASE + 1e-3]],
  };
});
const printFoot = loftX(footStations).intersect(outlinePrism);
const printModel = union([bridge, printFoot]);

// ---------- wegdeklaag: rijbaan en fietspad als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is een eigen node met de attributen van het
// BGT-wegdeel eronder (glTF `extras.attributes`), zodat de kleurregels van een
// thema (bijvoorbeeld fietspaden rood) op het brugdek werken zoals op de
// PDOK-wegdelen. Rijbaan: het dek tussen de schampkanten en geleiderails;
// fietspad: het actuele BGT-vlak met functie fietspad (lokale coördinaten,
// vereenvoudigd tot 5 cm). De ribben, de schampkanten, de geleiderails, de
// voegen en de looppaden tussen de bogen blijven constructie. De laag wordt
// pas na het printmodel gebouwd, zodat de STL de brug als geheel bevat.
// Fietspad (BGT wegdeel L0002.dfb4dfec873448459663830966ac8b29, functie
// fietspad, gesloten verharding; lokale coördinaten, vereenvoudigd tot 5 cm).
const BIKE_PATH = [
  [-611.19, -86.29], [-619.03, -89.61], [-616.07, -96.49], [-612.91, -95.06], [-608.02, -93.13], [-597.5, -89.2],
  [-578.82, -83.14], [-551.35, -74.72], [-532.13, -69.28], [-517.05, -65.5], [-503.18, -62.13], [-488.49, -58.78],
  [-471.96, -55.35], [-454.58, -52], [-440.21, -49.53], [-421.71, -46.68], [-405.35, -44.38], [-388.02, -42.28],
  [-371.36, -40.6], [-355.78, -39.29], [-339.56, -38.11], [-324.42, -37.25], [-306.2, -36.61], [-276.24, -35.97],
  [-256.06, -35.82], [-151.4, -35.6], [-128.21, -33.86], [-34.06, -33.64], [103.02, -33.12], [206.13, -32.93],
  [216.47, -32.82], [216.41, -33.69], [217.45, -33.62], [217.48, -32.75], [239.35, -34.09], [391.99, -33.62],
  [493.41, -33.41], [715.1, -32.66], [715, -25.53], [706.91, -25.38], [686.24, -25.51], [640.57, -25.61],
  [442.67, -26.32], [268.55, -26.77], [268.58, -27.1], [216.24, -27.66], [216.22, -27.31], [206.89, -27.27],
  [206, -27.55], [152.75, -27.74], [96.98, -28.1], [-8.2, -28.52], [-101.01, -28.79], [-150.7, -28.8],
  [-184.52, -28.48], [-256, -28.62], [-270.35, -28.69], [-285.25, -28.91], [-300.46, -29.23], [-314.47, -29.64],
  [-322.2, -29.97], [-339.79, -30.91], [-363.89, -32.73], [-372.34, -33.44], [-389.64, -35.17], [-406.14, -37.17],
  [-431.46, -40.8], [-447.56, -43.42], [-455.72, -44.87], [-480.15, -49.67], [-490, -51.68], [-515.14, -57.51],
  [-536.11, -62.96], [-556.39, -68.64], [-567.66, -71.97], [-586.57, -77.96],
];
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan autosnelweg", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
// De strook loopt van 0,5 m onder tot 1 m boven het wegdek: zo snijdt hij het
// hele bovenvlak uit de constructie en houdt die daar geen vlak zonder dikte
// over dat met de bovenkant van het wegdek vecht (z-fighting).
const strip = band(X_SOUTH, X_NORTH, wide, -LAYER, ABOVE).intersect(outlinePrism);
// Rond de schampkanten, geleiderails en ribben 2 cm vrij; de hele strook van
// elke rib blijft constructie, ook onder de openingen van het hangerscherm.
const kerbGuards = KERBS.map(([x0, x1, lohi]) => kerb(x0, x1, lohi, 0.02));
// Bij de opleggingen ligt de bovenkant van de rib op de hoogte van het
// wegdek; daar houdt de strook de hele hoogte boven de rib vrij.
const ribGuards = RIBS.map(([y0, y1]) =>
  union([
    profileY(ribBand, y0 - 0.02, y1 + 0.02),
    band(-ARCH.ribEnd - 0.02, ARCH.ribEnd + 0.02, () => [y0 - 0.02, y1 + 0.02], -LAYER - 0.1, ABOVE + 0.1),
  ]),
);
// Tussen de twee bogen liggen looppaden naast de ribben, geen rijbaan.
const between = band(-ARCH_END - 0.01, ARCH_END + 0.01, () => [RIBS[2][1] - 0.02, RIBS[1][0] + 0.02], -LAYER - 0.1, ABOVE + 0.1);
const notLayer = union([...kerbGuards, ...ribGuards, ...joints, between]);
const bikePrism = prism(BIKE_PATH, BASE - 1, 120);
const open = strip.subtract(notLayer);
const roadCut = open.subtract(bikePrism);
const bikeCut = open.intersect(bikePrism);
const roadway = roadCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const structure = bridge.subtract(union([roadCut, bikeCut]));
const parts = [
  [`building:${SLUG}`, structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const m = [0, 1, 2].map((a) => (p[0][a] + p[1][a] + p[2][a]) / 3);
    found.push({ m, area: len / 2 });
  }
  return found;
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
// Blinde nissen: de raambanden van de kelder en de kanzel, de nissen in de
// rivierpijlers.
const inNiche = ([x, y, z]) =>
  (Math.hypot(x - tx, y - ty) < 6.2 && z > TOWER.windows.z0 - 0.1 && z < TOWER.windows.z1 + 0.1) ||
  (x > KELDER_WINDOWS.x[0] - 0.1 && x < KELDER_WINDOWS.x[1] + 0.1 && (y < KELDER.y0 + 0.5 || y > KELDER.y1 - 0.5) && z > 5 && z < 24) ||
  ARCH_PIERS.some(({ x0, x1 }) => x > x0 - 0.1 && x < x1 + 0.1 && Math.abs(z - (road((x0 + x1) / 2) - 0.3 - PIER_NICHE.below)) < 0.1);
{
  // In het model hangen alleen de onderkant van de dekken, de kraag onder de
  // kanzel en de bovenkant van de nissen vrij; boven het wegdek niets (de
  // hangeropeningen hebben een spitse top).
  const buckets = {};
  for (const { m, area } of overhangs(bridge)) {
    const key = inNiche(m) ? "nissen" : m[2] > top(m[0], m[1]) + 0.05 ? "boven het dek" : "onder het dek";
    buckets[key] = (buckets[key] ?? 0) + area;
    if (key === "boven het dek" && area > 0.01) console.log("boven het dek:", m.map((c) => +c.toFixed(2)), +area.toFixed(3));
  }
  console.log("vrij hangend (m2):", Object.fromEntries(Object.entries(buckets).map(([k, a]) => [k, +a.toFixed(2)])));
  if ((buckets["boven het dek"] ?? 0) > 0.5) throw new Error("overhang boven het dek");
  const rest = overhangs(printModel).filter(({ m }) => !inNiche(m) && m[2] > BASE + 0.5);
  const restArea = rest.reduce((sum, { area }) => sum + area, 0);
  console.log("overhang in de printversie buiten de nissen (m2):", +restArea.toFixed(2));
  if (restArea > 2) {
    const byX = {};
    for (const { m, area } of rest) {
      const k = Math.floor(m[0] / 50) * 50;
      byX[k] = (byX[k] ?? 0) + area;
    }
    console.log("overhang per 50 m:", Object.fromEntries(Object.entries(byX).map(([k, a]) => [k, +a.toFixed(1)])));
    for (const { m, area } of rest.slice(0, 12)) console.log(m.map((c) => +c.toFixed(1)), +area.toFixed(2));
    throw new Error("printversie heeft overhang");
  }
}
{
  // De onderdelen tellen op tot de brug als geheel (geen overlap).
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  const whole = bridge.volume();
  console.log("volume onderdelen / geheel (m3):", Math.round(sum), Math.round(whole));
  if (Math.abs(sum - whole) > 1e-4 * whole) throw new Error("onderdelen tellen niet op tot de brug");
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
    meshes.push({
      name,
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
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
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}
report.arch = {
  crownNap: ARCH.crown,
  riseAboveDeckM: +(ARCH.crown - road(0)).toFixed(2),
  deckNodes: DECK_NODES.map((x) => +x.toFixed(2)),
  hangers: cables.length,
  openings: openingReport.length,
  openingsXTopArea: openingReport,
};
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `${SLUG}-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Van Brienenoordbrug 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const pb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((pb.max[i] - pb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveldpunten alleen op het water (PDOK ellipsoïdisch 43,67 tot 43,85 m):
// de geul ten zuiden van het Eiland van Brienenoord en de Nieuwe Maas aan
// beide zijden van de bogen. Over land ligt het maaiveld tot 5 m hoger; een
// uitsnede die alleen een aanbrug raakt, valt terug op groundHeight.
const samplePoints = [-330, -80, 60, 200].flatMap((x) => [
  [x, +(edgeW(x) + 15).toFixed(1)],
  [x, +(edgeE(x) - 15).toFixed(1)],
]);
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: "Van Brienenoordbrug",
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [96917.61, 435328.02],
      xAxis: [-0.38774, 0.92177],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0599100000670512"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het midden onder de bogen op de voeg tussen de twee bruggen op NAP 0 (z = NAP-hoogte, het water van de Nieuwe Maas) in de oorsprong, +X langs de brug naar het noorden (Kralingen, RD-richting 112,81 graden vanaf het oosten) en +Y naar het westen-zuidwesten. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan autosnelweg of fietspad, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk van het schuine zuidelijke landhoofd in IJsselmonde (x = -636) tot het noordelijke in Kralingen (x = 716,7). Twee boogbruggen met trekband naast elkaar (westboog 1990 op y = 0 tot 30,9, oostboog 1965 met het fietspad op y = 0 tot -33,6), elk met twee verticale ribben van 2,0 m breed met de top op NAP +68,0 m en het netwerk van kruisende schuine hangers (twintig velden, van elke dekknoop twee hangers naar de boog) als scherm met stroken van 1,0 m en spitse openingen; de rivierpijlers met ronde koppen; de basculekleppen van 54 m in gesloten stand met voegen; de basculekelder met plint, raambanden als nissen en de ronde trapkoker; de bedieningstoren met de kanzel tot NAP +49,6 m (BAG-pand); de zuidelijke aanbrug met de bocht naar het zuidoosten op sloven met ronde kolommen, de noordelijke op wandkolommen, beide met twee kokers per brug. Het wegdek ligt op NAP +12,3 tot +14,6 m (zuid, dwarshelling) tot +28,6 m (bogen) en +10,8 m (noord), met 4 % dwarshelling in de bocht. Schampkanten en geleiderails in de middenbermen in plaats van leuningen. Het windverband tussen de ribben (vrije horizontale overspanningen van 24 tot 27 m), de portaalborden boven de rijbanen, lantaarns, slagbomen, het geluidsscherm langs het fietspad en de open stand van de kleppen zijn weggelaten; de export vult onder de dekken een wig met een smal scherm tot de onderplaat op, de STL heeft een printvoet. Het maaiveld wordt op het water bemonsterd; groundHeight is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(716.7 - -636.0).toFixed(1),
        archSpanM: +(2 * ARCH.ribEnd).toFixed(1),
        archCrownNapM: ARCH.crown,
        archRiseAboveDeckM: report.arch.riseAboveDeckM,
        archRibsFromJointM: { westArch: [2.6, 29.6], eastArch: [-3.4, -27.4] },
        hangerDeckNodesX: report.arch.deckNodes,
        basculeLeavesM: +(LEAF.x1 - LEAF.x0).toFixed(1),
        basculeCellarM: +(KELDER.x1 - KELDER.x0).toFixed(1),
        deckWidthM: { arch: +(edgeW(0) - edgeE(0)).toFixed(2), northApproach: +(edgeW(500) - edgeE(500)).toFixed(2) },
        southPierX: SOUTH_PIERS.filter((_, i) => i % 2 === 0).map(({ c }) => +c[0].toFixed(1)),
        northPierX: [...new Set([...shoreLine, ...NORTH_BLADES].map(([x0, x1]) => +((x0 + x1) / 2).toFixed(1)))].filter((x, i, xs) => i === 0 || x - xs[i - 1] > 5),
        deckNapM: { south: +top(-600, (edgeW(-600) + edgeE(-600)) / 2).toFixed(2), crest: +road(10).toFixed(2), north: +road(705).toFixed(2) },
        towerTopNapM: TOWER.stack.z,
        waterNapM: 0,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Van_Brienenoordbrug",
        "PDOK BGT overbruggingsdeel (dekrand, landhoofden, sloven van de zuidelijke aanbrug, wandkolommen van de noordelijke aanbrug, rivierpijlers), wegdeel (rijbanen en fietspad), scheiding (muren op de kelder) en pand, EPSG:28992",
        "PDOK BAG pand 0599100000670512 (bedieningstoren)",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de boogribben, de toren, de trapkoker en de pijlerkoppen",
        "PDOK luchtfoto (Actueel_orthoHR) voor de voegen van de kleppen, de rijbanen en de middenbermen",
        "Wikimedia Commons: Rotterdam - Oud-IJsselmonde - Eiland van Brienenoord - View of Van Brienenoordbrug from southeast.jpg en from southwest.jpg, Rotterdam Van Brienenoordbrug seen from Capelle ad IJssel Rivium ferry terminal.jpg, Van Brienenoordbrug - Rotterdam - Basement for bascule from the east.jpg, Bridge operator's house from the east.jpg, Open bascule bridge - View from the bridge towards the west.jpg, Van Brienenoordbrug Rotterdam 2018 1 en 2.jpg, Van Brienenoordbrug (2025)-1 en -2.jpg, Van Brienenoordbrug dubbele boog.jpg, Van Brienenoordbrug Rotterdam 2020.jpg, Van brienenoordbrug - Kralingen - Rotterdam - Bonn-Mees' Sheerlegs Matador IMO 8639364 passing opened bascule bridge.jpg, Vessel traffic service Rotterdam nr 24 - Van Brienenoordbrug-West - 2024 - pic1.jpg, Van Brienenoordbrug.jpg, 1e Eiland van Brienoordbrug - View of the bridge from the northeast.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

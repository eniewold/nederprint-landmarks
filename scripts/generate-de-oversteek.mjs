// Genereert een vereenvoudigd, gesloten 3D-model van De Oversteek in Nijmegen:
// de stadsbrug uit 2013 (Ney & Poulissen) over de Waal tussen Nijmegen-West en
// Lent, met de stalen netwerkboog van 285 m over de rivier (één kokerboog boven
// het midden van het dek die zich bij de pijlers als een omgekeerde Y in twee
// poten splitst, met schuine kruisende hangers naar de randen van de rijbaan),
// de twee rivierpijlers en de aanbruggen met spitse betonnen bogen op
// kegelvormige kolommen: vijf overspanningen aan de zuidkant (Waalfront,
// Weurtseweg) en zestien aan de noordkant over de uiterwaard en de Spiegelwaal
// tot de dijk bij Lent. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, nodes met de materiaalklasse in de
// nodenaam: de constructie en rijbaan en fietspad met BGT-attributen) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal> met een printvoet onder het dek.
//
//   node scripts/generate-de-oversteek.mjs              # STL op 1:3500 (standaard)
//   node scripts/generate-de-oversteek.mjs --scale 2500
//
// Assenstelsel: oorsprong op de as van het dek midden tussen de twee
// rivierpijlers (RD 186278,14, 430048,05), op de waterspiegel van de Waal
// zoals het PDOK-terrein die legt (NAP +7,2 m), Z omhoog. +X loopt langs de
// rechte hoofdoverspanning naar het noorden (Lent, RD-richting 66,9 graden
// vanaf het oosten), +Y stroomafwaarts naar het westnoordwesten. Het dek is
// alleen tussen x = -296 en x = 333 recht; daarbuiten buigt het naar het
// zuiden (bij de Weurtseweg) en naar het noorden (over de Spiegelwaal naar de
// dijk) met een flauwe bocht naar rechts. De aanbruggen worden daarom gebouwd
// in een stelsel (u, v) langs de as van het dek (u = booglengte vanaf de
// oorsprong, v = afstand links van de as) en pas bij het schrijven van de
// hoekpunten naar (x, y) omgezet.
//
// Bronnen: BGT overbruggingsdeel (dek 25,1 m breed met verbredingen van het
// fietspad aan de oostkant, de rivierpijlers als gebogen lenzen van 37 m, de
// kolomparen van de zuidelijke aanbrug en de eerste twee van de noordelijke,
// de scheve uiteinden van het dek); AHN DSM 0,5 m (PDOK WCS) voor de as van het
// dek, het lengteprofiel van het wegdek (NAP +19,5 tot +26,4 m), de boog (top
// NAP +81 m), het splitsen van de boog in twee poten, de landing van de poten,
// de trappen in de verbredingen en de lifttoren; PDOK luchtfoto voor de
// kolommen in de uiterwaard en de trappen; PDOK-terrein voor de waterspiegel;
// Wikipedia (overspanning 285 m, lengte 1195 m, twintig bogen van 42,5 m,
// zuidelijke aanbrug 230 m, noordelijke 680 m, doorvaarthoogte 14,5 m) en
// Wikimedia Commons-foto's voor de vorm van de boog, de hangers, de spitse
// bogen en de kegelvormige kolommen. Geschat zijn de doorsnede van de boog
// (4,4 m breed, 4,2 m hoog), de constructiehoogte van het dek over de rivier
// (3,5 m), de diepte van de aanbrugbogen (kruin 1,8 m en aanzet 8,0 m onder het
// wegdek), de maten van de kolommen, de plaats van de kolommen ten noorden van
// x = 230 (gelijke velden van 42,3 m tot het noordelijke landhoofd), de
// hangerlijnen op het dek en de hoogte van de trappen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "3500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "de-oversteek");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const rad = (deg) => (deg * Math.PI) / 180;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.min(Math.max(x, a), b);
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const fromMesh = (verts, tris, label) => {
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`${label}: ${solid.status()}`);
  if (solid.volume() <= 0) throw new Error(`${label}: binnenstebuiten`);
  return solid;
};
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in gezien vanaf +X, steeds evenveel punten).
function loftX(stations, label) {
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
  return fromMesh(verts, tris, label);
}

// ---------- hoofdmaten ----------
const WATER_NAP = 7.2; // waterspiegel van de Waal en de Spiegelwaal in het PDOK-terrein
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;

// As van het dek: richting (graden linksom vanaf +X) als functie van de
// booglengte u, stuksgewijs lineair (BGT-westrand van het dek, 12,55 m naar
// binnen; recht van u = -296 tot 333, dan een overgangsboog en een bocht naar
// rechts met een straal van circa 800 m tot de dijk bij Lent).
const AXIS_BREAKS = [
  [-440, -14.35], [-380, -7.14], [-370, -5.93], [-360, -4.78], [-350, -3.65], [-340, -2.58],
  [-330, -1.66], [-320, -0.94], [-310, -0.42], [-296, 0], [333, 0], [610, -8.04], [720, -14.6],
  [840, -23.0], [880, -25.5],
];
const heading = (u) => {
  if (u <= AXIS_BREAKS[0][0]) return rad(AXIS_BREAKS[0][1]);
  for (let i = 1; i < AXIS_BREAKS.length; i++) {
    const [u1, a1] = AXIS_BREAKS[i];
    if (u <= u1) {
      const [u0, a0] = AXIS_BREAKS[i - 1];
      return rad(lerp(a0, a1, (u - u0) / (u1 - u0)));
    }
  }
  return rad(AXIS_BREAKS[AXIS_BREAKS.length - 1][1]);
};
// Geïntegreerde as om de 0,25 m.
const AXIS_U0 = -440;
const AXIS_STEP = 0.25;
const AXIS_N = Math.round((880 - AXIS_U0) / AXIS_STEP) + 1;
const axisX = new Float64Array(AXIS_N);
const axisY = new Float64Array(AXIS_N);
{
  const i0 = Math.round(-AXIS_U0 / AXIS_STEP);
  for (let i = i0 + 1; i < AXIS_N; i++) {
    const a = heading(AXIS_U0 + (i - 0.5) * AXIS_STEP);
    axisX[i] = axisX[i - 1] + AXIS_STEP * Math.cos(a);
    axisY[i] = axisY[i - 1] + AXIS_STEP * Math.sin(a);
  }
  for (let i = i0 - 1; i >= 0; i--) {
    const a = heading(AXIS_U0 + (i + 0.5) * AXIS_STEP);
    axisX[i] = axisX[i + 1] - AXIS_STEP * Math.cos(a);
    axisY[i] = axisY[i + 1] - AXIS_STEP * Math.sin(a);
  }
}
// (u, v) langs de as naar modelcoördinaten (x, y).
function uvToXY(u, v) {
  const f = clamp((u - AXIS_U0) / AXIS_STEP, 0, AXIS_N - 1);
  const i = Math.min(Math.floor(f), AXIS_N - 2);
  const t = f - i;
  const x = lerp(axisX[i], axisX[i + 1], t);
  const y = lerp(axisY[i], axisY[i + 1], t);
  const a = heading(u);
  return [x - v * Math.sin(a), y + v * Math.cos(a)];
}

// Wegdek in NAP-meters om de 4 m vanaf u = -428: 25e percentiel van het
// AHN-DSM over 18 m rond de as, mediaan over 5 waarden en licht gladgestreken
// (auto's, lantaarns en de poten van de boog vallen zo weg). Na u = 822 en
// voor u = -413 ligt het wegdek op het landhoofd en de toerit.
const DECK_U0 = -428;
const DECK_STEP = 4;
const DECK_NAP = [
  19.52, 19.61, 19.72, 19.83, 19.94, 20.06, 20.18, 20.29, 20.39, 20.49, 20.59, 20.71, 20.82, 20.93,
  21.04, 21.14, 21.24, 21.35, 21.47, 21.58, 21.69, 21.80, 21.89, 22.00, 22.10, 22.22, 22.36, 22.49,
  22.61, 22.71, 22.81, 22.90, 22.99, 23.10, 23.22, 23.34, 23.45, 23.57, 23.69, 23.79, 23.90, 24.01,
  24.11, 24.20, 24.29, 24.37, 24.46, 24.56, 24.65, 24.75, 24.82, 24.88, 24.93, 24.98, 25.05, 25.13,
  25.20, 25.25, 25.31, 25.36, 25.42, 25.48, 25.51, 25.53, 25.55, 25.57, 25.60, 25.63, 25.65, 25.67,
  25.70, 25.73, 25.78, 25.82, 25.87, 25.91, 25.93, 25.95, 25.96, 25.97, 25.98, 25.98, 26.00, 26.04,
  26.07, 26.09, 26.10, 26.12, 26.14, 26.17, 26.19, 26.20, 26.22, 26.24, 26.27, 26.29, 26.30, 26.31,
  26.31, 26.31, 26.31, 26.32, 26.33, 26.33, 26.34, 26.35, 26.36, 26.36, 26.36, 26.35, 26.35, 26.34,
  26.33, 26.33, 26.32, 26.31, 26.30, 26.29, 26.28, 26.27, 26.27, 26.26, 26.25, 26.24, 26.22, 26.20,
  26.18, 26.17, 26.15, 26.13, 26.11, 26.09, 26.06, 26.04, 26.03, 26.02, 26.00, 25.99, 25.95, 25.90,
  25.85, 25.82, 25.79, 25.76, 25.73, 25.70, 25.67, 25.65, 25.63, 25.61, 25.60, 25.59, 25.57, 25.54,
  25.52, 25.49, 25.46, 25.42, 25.38, 25.35, 25.32, 25.30, 25.28, 25.26, 25.22, 25.18, 25.13, 25.09,
  25.05, 25.01, 24.97, 24.94, 24.94, 24.94, 24.94, 24.94, 24.94, 24.92, 24.89, 24.86, 24.84, 24.82,
  24.79, 24.77, 24.75, 24.74, 24.73, 24.70, 24.66, 24.61, 24.58, 24.56, 24.54, 24.52, 24.51, 24.50,
  24.49, 24.48, 24.47, 24.44, 24.41, 24.37, 24.34, 24.32, 24.31, 24.30, 24.29, 24.27, 24.25, 24.22,
  24.18, 24.15, 24.13, 24.11, 24.10, 24.10, 24.08, 24.06, 24.03, 24.00, 23.97, 23.95, 23.93, 23.91,
  23.89, 23.87, 23.85, 23.81, 23.79, 23.77, 23.75, 23.73, 23.70, 23.67, 23.64, 23.62, 23.59, 23.56,
  23.54, 23.52, 23.50, 23.47, 23.45, 23.43, 23.40, 23.37, 23.35, 23.32, 23.31, 23.29, 23.27, 23.24,
  23.21, 23.19, 23.18, 23.16, 23.14, 23.12, 23.09, 23.07, 23.05, 23.03, 22.99, 22.95, 22.89, 22.84,
  22.80, 22.78, 22.78, 22.78, 22.77, 22.75, 22.72, 22.70, 22.66, 22.62, 22.58, 22.56, 22.54, 22.51,
  22.49, 22.48, 22.46, 22.44, 22.41, 22.37, 22.35, 22.32, 22.30, 22.27, 22.26, 22.25, 22.25, 22.23,
  22.19, 22.16, 22.14, 22.12, 22.10, 22.08, 22.06, 22.04, 22.02, 21.97, 21.89, 21.79, 21.68, 21.58,
  21.48, 21.38, 21.27, 21.16, 21.06, 20.95, 20.82, 20.70, 20.60, 20.50, 20.37, 20.24, 20.11, 19.99,
  19.87, 19.76, 19.66,
];
function deckZ(u) {
  const f = clamp((u - DECK_U0) / DECK_STEP, 0, DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  return Z(lerp(DECK_NAP[i], DECK_NAP[i + 1], f - i));
}

// Dek (BGT): 25,1 m breed, de as midden tussen de randen.
const HALF = 12.55;
const DECK_MAIN = 3.5; // stalen kokerdek over de rivier (geschat op foto's)
// Aanbrugbogen: spitse ellipsbogen met de kruin 1,6 m en de aanzet op de
// kolom 7,0 m onder het wegdek (foto's: 6,3 tot 7,9 m).
const ARCH_CROWN = 1.6;
const ARCH_RISE = 5.4;

// Steunlijnen dwars over het dek. Alle kolomparen en de rivierpijlers staan
// evenwijdig aan de stroming, 13 graden scheef ten opzichte van de rechte as
// (BGT); in de bochten draait die scheefstand mee met de as. Zuidelijke
// aanbrug en eerste twee noordelijke paren uit de BGT, verder gelijke velden
// van 42,3 m tot het noordelijke landhoofd (luchtfoto, Wikipedia: aanbrug
// 680 m vanaf de rivierpijler).
const SKEW = 13;
const MAIN_PIER_U = 142.5;
const SOUTH_SUPPORTS = [-360.25, -316.99, -273.4, -229.77, -184.97];
const NORTH_SPAN = 42.3;
const NORTH_SUPPORTS = [186.05, ...Array.from({ length: 14 }, (_, k) => 229.72 + k * NORTH_SPAN)];
const NORTH_FACE_U = 229.72 + 14 * NORTH_SPAN; // voorzijde van het noordelijke landhoofd
const skewLine = (U) => ({ U, m: Math.tan(rad(SKEW) + heading(U)) });
// Uiteinden van het dek (BGT) en de landhoofden: het zuidelijke landhoofd
// loopt evenwijdig aan het scheve einde van het dek langs de Weurtseweg, 8 m
// daarvoor; het noordelijke staat op de laatste steunlijn.
const SOUTH_END = { U: -412.1 - 0.7149 * 12.7, m: -0.7149 }; // door (-412,1, -12,7) en (-429,9, 12,2)
const SOUTH_FACE = { U: SOUTH_END.U + 8, m: SOUTH_END.m };
const NORTH_FACE = skewLine(NORTH_FACE_U);
const NORTH_END = { U: 847.0 + 0.5339 * 12.8, m: 0.5339 }; // door (847,0, -12,8) en (860,4, 12,3)
const lineU = (L, v) => L.U + L.m * v;
const MAIN_S = skewLine(-MAIN_PIER_U);
const MAIN_N = skewLine(MAIN_PIER_U);
const SUPPORT_LINES = [
  SOUTH_FACE,
  ...SOUTH_SUPPORTS.map(skewLine),
  MAIN_S,
  MAIN_N,
  ...NORTH_SUPPORTS.map(skewLine),
  NORTH_FACE,
];
const MAIN_INDEX = 1 + SOUTH_SUPPORTS.length; // index van MAIN_S

// Onderkant van het dek: kokerdek over de rivier, spitse bogen over de
// aanbruggen, landhoofden massief.
function deckBottom(u, v) {
  if (u <= lineU(SOUTH_FACE, v) || u >= lineU(NORTH_FACE, v)) return deckZ(u) - ARCH_CROWN - ARCH_RISE;
  let k = 0;
  while (k + 2 < SUPPORT_LINES.length && lineU(SUPPORT_LINES[k + 1], v) <= u) k++;
  if (k === MAIN_INDEX) return deckZ(u) - DECK_MAIN;
  const a = lineU(SUPPORT_LINES[k], v);
  const b = lineU(SUPPORT_LINES[k + 1], v);
  const xi = clamp((2 * u - a - b) / (b - a), -1, 1);
  return deckZ(u) - ARCH_CROWN - ARCH_RISE * (1 - Math.sqrt(Math.max(0, 1 - xi * xi)));
}

// Plaat tussen een boven- en onderfunctie over een rooster van (u, v)-punten:
// rijen i, kolommen j; uvAt(i, j) geeft het punt, de rand is gesloten.
function sheet(rows, cols, uvAt, top, bottom, label, minThick = 0.05) {
  const verts = [];
  const nTop = rows * cols;
  const tops = [];
  const bots = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const [u, v] = uvAt(i, j);
      const zt = top(u, v);
      const zb = Math.min(bottom(u, v), zt - minThick);
      const [x, y] = uvToXY(u, v);
      tops.push(x, y, zt);
      bots.push(x, y, zb);
    }
  }
  for (const a of tops) verts.push(a);
  for (const a of bots) verts.push(a);
  const T = (i, j) => i * cols + j;
  const B = (i, j) => nTop + i * cols + j;
  const tris = [];
  for (let i = 0; i + 1 < rows; i++) {
    for (let j = 0; j + 1 < cols; j++) {
      tris.push(T(i, j), T(i + 1, j), T(i + 1, j + 1), T(i, j), T(i + 1, j + 1), T(i, j + 1));
      tris.push(B(i, j), B(i + 1, j + 1), B(i + 1, j), B(i, j), B(i, j + 1), B(i + 1, j + 1));
    }
    const J = cols - 1;
    tris.push(B(i, 0), B(i + 1, 0), T(i + 1, 0), B(i, 0), T(i + 1, 0), T(i, 0));
    tris.push(B(i, J), T(i + 1, J), B(i + 1, J), B(i, J), T(i, J), T(i + 1, J));
  }
  const I = rows - 1;
  for (let j = 0; j + 1 < cols; j++) {
    tris.push(B(0, j + 1), B(0, j), T(0, j), B(0, j + 1), T(0, j), T(0, j + 1));
    tris.push(B(I, j), B(I, j + 1), T(I, j + 1), B(I, j), T(I, j + 1), T(I, j));
  }
  return fromMesh(verts, tris, label);
}

// ---------- dek, aanbruggen en landhoofden ----------
// Rijen evenwijdig aan steunlijnen: van het zuidelijke einde naar het
// zuidelijke landhoofd, over de brug (rijen om de circa 0,5 m, de scheefstand
// gaat geleidelijk over) en van het noordelijke landhoofd naar het einde.
// Langs een rij is de vorm van de boog gelijk (de rijen lopen evenredig
// tussen de twee steunlijnen), dus dwars zijn weinig kolommen nodig.
const DECK_V = [-HALF, -10.5, -6, -2, 2, 6, 10.5, HALF];
const DECK_COLS = DECK_V.length;
const deckV = (j) => DECK_V[j];
const rowKeys = [];
// Rijen per veld: dichter bij de steunlijnen, waar de boog steil wordt.
const pushRows = (L0, L1, n, skipFirst, dense = false) => {
  for (let k = skipFirst ? 1 : 0; k <= n; k++) {
    const t = dense ? (1 - Math.cos((Math.PI * k) / n)) / 2 : k / n;
    rowKeys.push({ U: lerp(L0.U, L1.U, t), m: lerp(L0.m, L1.m, t) });
  }
};
const shift = (L, du) => ({ U: L.U + du, m: L.m });
// Tussen twee steunlijnen draaien de rijen geleidelijk van de ene
// scheefstand naar de andere, zodat de aanzetten van de bogen precies op een
// rij liggen.
const ROW_KEYS = [
  SOUTH_END,
  SOUTH_FACE,
  shift(SOUTH_FACE, 0.05),
  ...SUPPORT_LINES.slice(1, -1),
  shift(NORTH_FACE, -0.05),
  NORTH_FACE,
  NORTH_END,
];
ROW_KEYS.forEach((L, k) => {
  if (k === 0) return pushRows(L, L, 1, false);
  const P = ROW_KEYS[k - 1];
  const span = L.U - P.U;
  if (span < 1) return pushRows(P, L, 1, true);
  if (P === MAIN_S) return pushRows(P, L, Math.round(span / 4), true); // vlak kokerdek
  const arch = k >= 3 && k <= ROW_KEYS.length - 3;
  pushRows(P, L, arch ? 28 : Math.max(2, Math.round(span / 4)), true, arch);
});
rowKeys.splice(1, 1); // dubbele eerste rij
const southAbutment = (u, v) => u < lineU(SOUTH_FACE, v) + 0.01;
const northAbutment = (u, v) => u > lineU(NORTH_FACE, v) - 0.01;
const deck = sheet(
  rowKeys.length,
  DECK_COLS,
  (i, j) => [lineU(rowKeys[i], deckV(j)), deckV(j)],
  (u) => deckZ(u),
  (u, v) => (southAbutment(u, v) || northAbutment(u, v) ? BASE : deckBottom(u, v)),
  "dek",
);

// Verbredingen van het fietspad aan de oostkant (BGT): balkons op dekhoogte
// met een console van 50 graden eronder. In de twee grootste (bij de Waalkade
// met de lifttoren, en naar de uiterwaard) liggen trappen naar het maaiveld;
// die zijn hier ook een balkon op dekhoogte. Buitenrand als (u, v)-punten.
const BULGES = [
  { out: [[-274.0, -12.55], [-267.8, -13.2], [-256.9, -15.2], [-248.0, -16.4], [-241.5, -16.9], [-233.7, -17.1], [-228.0, -17.0], [-217.5, -16.2], [-209.7, -15.2], [-195.9, -12.9], [-190.2, -12.55]] },
  { out: [[-185.5, -12.55], [-174.5, -12.9], [-166.0, -13.4], [-157.2, -14.3], [-147.6, -15.5], [-143.0, -14.0], [-141.7, -12.55]] },
  { out: [[135.9, -12.55], [137.5, -14.2], [140.5, -16.5], [141.2, -15.3], [155.5, -13.7], [175.4, -12.55]] },
  { out: [[186.6, -12.55], [190.3, -12.9], [197.5, -14.1], [203.1, -14.6], [209.2, -14.4], [223.0, -12.55]] },
  { out: [[230.0, -12.55], [235.8, -13.2], [242.6, -14.7], [248.5, -15.1], [254.2, -14.6], [259.3, -13.5], [266.8, -12.55]] },
  { out: [[274.2, -12.55], [280.4, -13.2], [289.8, -15.1], [297.3, -16.1], [306.8, -16.9], [313.7, -17.0], [321.5, -16.7], [329.5, -16.0], [354.6, -12.55]] },
  { out: [[361.0, -12.55], [367.2, -13.3], [375.6, -14.9], [379.2, -15.1], [382.7, -15.0], [392.4, -13.2], [398.2, -12.55]] },
  { out: [[404.9, -12.55], [409.4, -13.0], [418.2, -14.4], [423.2, -14.7], [427.4, -14.4], [438.2, -12.8], [442.0, -12.55]] },
  { out: [[821.0, -12.55], [833.3, -15.7], [847.0, -13.4], [847.4, -12.55]] },
];
const SLAB = 1.2;
const bulges = BULGES.map(({ out }, n) => {
  const u0 = out[0][0];
  const u1 = out[out.length - 1][0];
  const vOut = (u) => {
    for (let i = 1; i < out.length; i++) {
      if (u <= out[i][0]) return lerp(out[i - 1][1], out[i][1], (u - out[i - 1][0]) / (out[i][0] - out[i - 1][0]));
    }
    return out[out.length - 1][1];
  };
  const inner = -11.8;
  const rows = Math.max(4, Math.round((u1 - u0) / 1.0));
  return sheet(
    rows + 1,
    5,
    (i, j) => {
      const u = lerp(u0, u1, i / rows);
      // Kolommen tot de rand van het dek en één erbinnen, zodat de console
      // precies bij de rand begint.
      const vo = Math.min(vOut(u), -HALF - 0.3);
      return [u, j < 4 ? lerp(vo, -HALF, j / 3) : inner];
    },
    (u) => deckZ(u) - 0.01,
    (u, v) => deckZ(u) - 0.01 - SLAB - Math.tan(rad(50)) * Math.max(0, -HALF - v),
    `verbreding ${n}`,
  );
});

// Lifttoren bij de zuidelijke trap (DSM: 3,2 m in het vierkant, top NAP +30,0 m).
const LIFT = { u: -234.5, v: -18.9, size: 3.4, topNap: 30.0 };
const lift = (() => {
  const h = LIFT.size / 2;
  const pts = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([a, b]) => uvToXY(LIFT.u + a, LIFT.v + b));
  return prism(pts, BASE, Z(LIFT.topNap));
})();

// Kolommen: per steunlijn twee afgeknotte elliptische kegels 10,1 m naast de
// as, met de lange as langs de steunlijn (BGT op maaiveld 2,0 × 5,6 m, op de
// foto's naar boven toe smaller). Onder de kruin van de bogen 1,4 × 3,8 m,
// per meter lager 0,12 m breder en 0,36 m langer; de bovenkant zit in de boog.
const COLUMN = { v: 10.1, topW: 1.4, topL: 3.8, dW: 0.12, dL: 0.36 };
function ellipse(rx, ry, n = 32) {
  return Array.from({ length: n }, (_, k) => {
    const a = (2 * Math.PI * k) / n;
    return [rx * Math.cos(a), ry * Math.sin(a)];
  });
}
const columns = [];
for (const U of [...SOUTH_SUPPORTS, ...NORTH_SUPPORTS]) {
  const L = skewLine(U);
  for (const side of [-1, 1]) {
    const v = side * COLUMN.v;
    const u = lineU(L, v);
    const cusp = deckZ(u) - ARCH_CROWN - ARCH_RISE;
    const top = deckZ(u) - 5.0;
    const below = cusp - BASE;
    const w0 = COLUMN.topW + COLUMN.dW * below;
    const l0 = COLUMN.topL + COLUMN.dL * below;
    const wT = COLUMN.topW - COLUMN.dW * (top - cusp);
    const lT = COLUMN.topL - COLUMN.dL * (top - cusp);
    const [x, y] = uvToXY(u, v);
    columns.push(
      Manifold.extrude(new CrossSection([ellipse(w0 / 2, l0 / 2)]), top - BASE, 0, 0, [wT / w0, lT / l0])
        .rotate([0, 0, -SKEW])
        .translate([x, y, BASE]),
    );
  }
}

// Rivierpijlers (BGT): gebogen lenzen van 37 m dwars op de brug, tot onder
// het kokerdek, naar boven iets smaller (foto's).
const MAIN_PIERS = [
  [[-139.11, 18.55], [-141.37, 15.17], [-143.25, 10.63], [-145.52, 3.14], [-147.19, -4.48], [-148.19, -12.01], [-148.14, -16.76], [-147.82, -18.37], [-145.86, -19.0], [-143.74, -15.79], [-141.31, -9.67], [-138.85, -0.94], [-137.51, 5.84], [-136.75, 13.13], [-136.98, 17.13], [-137.22, 18.16]],
  [[145.72, 18.53], [143.72, 15.46], [141.69, 10.7], [138.98, 1.41], [137.75, -4.38], [136.88, -10.75], [136.74, -15.89], [137.19, -18.48], [139.0, -18.9], [140.83, -16.32], [143.55, -9.86], [146.07, -0.93], [147.1, 4.05], [147.98, 11.02], [148.09, 16.21], [147.67, 18.2]],
];
const piers = MAIN_PIERS.map((poly) => {
  const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
  const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
  const top = deckZ(cx) - DECK_MAIN + 0.3;
  return Manifold.extrude(new CrossSection([ccw(poly.map(([x, y]) => [x - cx, y - cy]))]), top - BASE, 0, 0, [0.9, 0.97])
    .translate([cx, cy, BASE]);
});

// ---------- boog ----------
// Eén stalen koker boven de as van het dek; de bovenkant is een parabool met
// de top op NAP +81,0 m (AHN, bovenste DSM-cellen) die bij x = ±110 op
// NAP +52,5 m ligt. Doorsnede 4,4 m breed, zijwanden van 1,6 m en een
// onderkant als V van 50 graden (4,2 m hoog in het midden), zodat de
// onderkant ook in de top niet vrij hangt. Bij x = ±108 (NAP +53,5 m) splitst
// de boog in twee poten die schuin naar de randen van het dek lopen (AHN:
// landing 10,7 m naast de as, 6 m binnen de steunlijn van de rivierpijler, dus
// ook 13 graden scheef) en daar op het dek staan; de poten worden naar beneden
// smaller (3,4 m) en lopen met een gebogen bovenkant naar het dek.
const ARCH = { crownNap: 81.0, k: 0.00236, width: 4.4, side: 1.6, vee: 50, split: 108 };
const LEG = { t: 10.7, width: 3.4, side: 1.4, inward: 6.0 };
const archTop = (x) => Z(ARCH.crownNap - ARCH.k * x * x);
const vDepth = (w, side) => side + (w / 2) * Math.tan(rad(ARCH.vee));
const boxSection = (yc, top, w, side) => [
  [yc, top - vDepth(w, side)],
  [yc + w / 2, top - side],
  [yc + w / 2, top],
  [yc - w / 2, top],
  [yc - w / 2, top - side],
];
const archBox = loftX(
  Array.from({ length: 2 * ARCH.split + 1 }, (_, i) => {
    const x = -ARCH.split + i;
    return { x, section: boxSection(0, archTop(x), ARCH.width, ARCH.side) };
  }),
  "boog",
);
// Landing van elke poot (end = -1 zuid, +1 noord; side = +1 west, -1 oost).
const landingX = (end, side) => end * MAIN_PIER_U + Math.tan(rad(SKEW)) * side * LEG.t - end * LEG.inward;
// Bovenkant van een poot: kwadratisch, aan de splitsing even steil als de
// boog, bij de landing 1 m boven het wegdek.
function legTop(end, side, ax) {
  const xL = Math.abs(landingX(end, side));
  const X = xL - ARCH.split;
  const zJ = archTop(ARCH.split);
  const m = -2 * ARCH.k * ARCH.split;
  const zL = deckZ(end * xL) + 1.0;
  const c = (zL - zJ - m * X) / (X * X);
  const d = ax - ARCH.split;
  return zJ + m * d + c * d * d;
}
const legFrac = (end, side, ax) => (ax - ARCH.split) / (Math.abs(landingX(end, side)) - ARCH.split);
const legs = [];
for (const end of [-1, 1]) {
  for (const side of [-1, 1]) {
    const xL = Math.abs(landingX(end, side));
    const stations = [];
    const n = Math.round((xL - ARCH.split) / 1.0);
    // Begint 0,5 m in de boog, 2 cm binnen zijn doorsnede, zodat geen vlakken
    // samenvallen.
    stations.push({
      x: end * (ARCH.split - 0.5),
      section: boxSection(0, archTop(ARCH.split - 0.5) - 0.02, ARCH.width - 0.04, ARCH.side - 0.02),
    });
    for (let i = 1; i <= n + 4; i++) {
      const ax = i <= n ? ARCH.split + ((xL - ARCH.split) * i) / n : xL + (i - n) * 0.5;
      const f = Math.min(legFrac(end, side, ax), 1);
      const w = lerp(ARCH.width, LEG.width, f);
      const s = lerp(ARCH.side, LEG.side, f);
      const top = i <= n ? legTop(end, side, ax) : deckZ(end * xL) - 0.3;
      stations.push({ x: end * ax, section: boxSection(side * LEG.t * f, top, w, s) });
    }
    if (end < 0) stations.reverse();
    legs.push(loftX(stations, `poot ${end} ${side}`));
  }
}

// ---------- hangers ----------
// De echte kruisende hangers (netwerkboog, kabels van circa 0,1 m) lopen
// vanaf de onderkant van de boog naar beide randen van de rijbaan, als twee
// schuine vlakken. Op 1:1000 zijn ze één staand scherm op de as onder de
// boog, zoals bij de Waalbrug: 1,1 m dik, met stijlen van 1 m langs de hangers
// (twee families onder 68 graden, ankers om de 18 m, circa dertig hangers)
// en doorgaande ruitvormige openingen daartussen met zijden van 68 graden,
// tot 0,3 m onder de zichtbare onderkant van de boog. Twee schuine schermen
// met openingen maakten de overhangopvulling van de export te zwaar (het
// geheugen van de WASM-module liep vol bij een uitsnede van 400 m op 1:1000),
// en dichte schuine schermen lazen op de kaart als een massieve tent; het
// staande scherm houdt de brug open. Waar een ruit niet meer onder de boog
// past, wordt hij vanuit zijn onderste punt verkleind of weggelaten. Het
// scherm loopt tot x = ±110, waar de twee poten nog boven de as liggen;
// daarbuiten is de ruimte tussen de poten open.
const HANGER = { pitch: 18, angle: 68, strut: 1.0, plate: 1.1, end: 110, margin: 0.3 };
const hangerScreen = (() => {
  const half = HANGER.plate / 2;
  // Bovenrand 1 m onder de bovenkant van de boog (in de koker); de zichtbare
  // onderkant van de koker naast het scherm ligt lager, waar de V het scherm raakt.
  const topZ = (x) => {
    const ax = Math.abs(x);
    const top = ax <= ARCH.split ? archTop(x) : Math.min(legTop(-1, 1, ax), legTop(-1, -1, ax), legTop(1, 1, ax), legTop(1, -1, ax));
    return top - 1.0;
  };
  const visible = (x) => topZ(x) + 1.0 - ARCH.side - (ARCH.width / 2 - half) * Math.tan(rad(ARCH.vee));
  const H = (x) => visible(x) - deckZ(x);
  const x0 = -HANGER.end;
  const x1 = HANGER.end;
  const outline = [];
  for (let x = x0; x < x1; x += 1) outline.push([x, topZ(x)]);
  outline.push([x1, topZ(x1)]);
  for (let x = x1; x > x0; x -= 1) outline.push([x, deckZ(x) - 0.5]);
  outline.push([x0, deckZ(x0) - 0.5]);
  // Ruiten in (x, h boven het wegdek): middens op (x_k + (d + 1) p / 2, d T p / 2).
  const p = HANGER.pitch;
  const T = Math.tan(rad(HANGER.angle));
  const shrink = 1 - HANGER.strut / (p * Math.sin(rad(HANGER.angle)));
  const fits = (pts) => pts.every(([x, h]) => x > x0 + 1 && x < x1 - 1 && h <= H(x) - HANGER.margin);
  const clipBottom = (pts, hMin) => {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      if (a[1] >= hMin) out.push(a);
      if ((a[1] - hMin) * (b[1] - hMin) < 0) {
        const t = (hMin - a[1]) / (b[1] - a[1]);
        out.push([lerp(a[0], b[0], t), hMin]);
      }
    }
    return out;
  };
  const holes = [];
  for (let d = 0; d < 12; d++) {
    for (let k = -20; k <= 20; k++) {
      const xc = (k + 0.5 + d / 2) * p;
      const hc = (d * T * p) / 2;
      const a = (shrink * p) / 2;
      const b = (shrink * T * p) / 2;
      const base = [xc, Math.max(hc - b, 0.4)];
      const diamond = [[xc, hc - b], [xc + a, hc], [xc, hc + b], [xc - a, hc]];
      let poly = null;
      for (let g = 1; g >= 0.5; g -= 0.05) {
        const scaled = diamond.map(([x, h]) => [base[0] + g * (x - base[0]), base[1] + g * (h - base[1])]);
        const probe = [...scaled];
        for (const [i, j] of [[1, 2], [2, 3]]) {
          for (let t = 0.25; t < 1; t += 0.25) probe.push([lerp(scaled[i][0], scaled[j][0], t), lerp(scaled[i][1], scaled[j][1], t)]);
        }
        if (fits(probe)) {
          poly = scaled;
          break;
        }
      }
      if (!poly) continue;
      poly = clipBottom(poly, 0.4);
      if (poly.length >= 3) holes.push(poly.map(([x, h]) => [x, deckZ(x) + h]));
    }
  }
  // Doorsnede in het XZ-vlak, uitgetrokken langs Y over de dikte van het scherm.
  const solid = Manifold.extrude(new CrossSection([ccw(outline), ...holes], "EvenOdd"), HANGER.plate)
    .rotate([90, 0, 0])
    .translate([0, half, 0]);
  return { solid, holes: holes.length };
})();

const bridge = union([deck, ...bulges, lift, ...columns, ...piers, archBox, ...legs, hangerScreen.solid]);

// ---------- printvoet (alleen in de STL) ----------
// Onder het dek en de bogen van de aanbruggen: een wig van 50 graden vanaf de
// randen van het dek die uitloopt in een scherm van 0,9 m tot de onderplaat,
// tussen de twee landhoofden. De bovenkant volgt de onderkant van het dek.
const SCREEN = 0.45;
const footRows = rowKeys.filter((L) => L.U > SOUTH_FACE.U - 1 && L.U < NORTH_FACE.U + 1);
const FOOT_V = [...Array.from({ length: DECK_COLS }, (_, j) => deckV(j)), -SCREEN - 0.01, -SCREEN, SCREEN, SCREEN + 0.01].sort((a, b) => a - b);
const printFoot = sheet(
  footRows.length,
  FOOT_V.length,
  (i, j) => [lineU(footRows[i], FOOT_V[j]), FOOT_V[j]],
  (u, v) => deckBottom(u, v) + 0.03,
  (u, v) => {
    // Wig en scherm lopen door tot onder de onderplaat en worden daar
    // afgesneden, zodat er bij de onderplaat geen bijna vlakke randen ontstaan.
    if (Math.abs(v) <= SCREEN + 1e-6) return BASE - 20;
    // Langs een rij is de onderkant van het dek gelijk, dus de rand van de wig
    // ligt op dezelfde hoogte als de onderkant boven dit punt.
    return deckBottom(u, v) - Math.tan(rad(50)) * (HALF - Math.abs(v));
  },
  "printvoet",
).trimByPlane([0, 0, 1], BASE);
const printModel = union([bridge, printFoot]);

// ---------- rijbaan en fietspad als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is een eigen node met de attributen van het
// BGT-wegdeel eronder (glTF `extras.attributes`), zodat de kleurregels van een
// thema (bijvoorbeeld fietspaden rood) op het brugdek werken zoals op de
// PDOK-wegdelen ernaast. Fietspad: de actuele BGT-vlakken met functie fietspad
// op het dek (relatieve hoogteligging 1, lokale coördinaten, vereenvoudigd tot
// 5 cm), aan de oostkant met de verbredingen; rijbaan: de rest van het dek.
// Rijbaan op de brug in de BGT: G0268.492db63d5e3f4433b063ea03df154333,
// G0268.2ba309144941480c963844a194e08395, G0268.233bb3d93c35480081dceb3a596f028a
// en G0268.7da79ca211e7476aa48510d74f933409 (rijbaan regionale weg). Het dek
// heeft geen schampkanten; boven het wegdek blijven de vier poten van de boog,
// het hangerscherm op de as en de lifttoren constructie. Gebouwd ná het
// printmodel, zodat de STL gelijk blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const ROAD_ATTRIBUTES = {
  bgt_functie: "rijbaan regionale weg",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_ATTRIBUTES = {
  bgt_functie: "fietspad",
  bgt_fysiekvoorkomen: "gesloten verharding",
  plus_fysiekvoorkomen: "asfalt",
};
const BIKE_PATHS = [
  // G0268.d3a98e379bb54be18db26f791919f440: het zuidelijke landhoofd aan de Weurtseweg (x = -416 tot -382).
  [
    [-403.03, -5.27], [-394.8, -6.58], [-382.78, -8.26], [-381.98, -4.57], [-402.03, -1.59], [-415.87, 1.09],
    [-413.96, -3.32]
  ],
  // G0268.52fd9ca17a62413d8d4638a8ed068cbc: de zuidelijke aanbrug met de verbredingen en de zuidhelft van de boog (x = -383 tot 114).
  [
    [-230.77, -8.6], [-263.67, -8.61], [-327.07, -8.45], [-346.19, -7.7], [-368.72, -6.14], [-381.98, -4.57],
    [-382.78, -8.26], [-372.73, -9.42], [-362.72, -10.39], [-352.65, -11.17], [-345.92, -11.58],
    [-326.79, -12.28], [-311.76, -12.55], [-274.01, -12.61], [-271.72, -12.74], [-267.84, -13.16],
    [-256.87, -15.18], [-254.12, -15.63], [-247.95, -16.41], [-241.47, -16.92], [-237.45, -17.09],
    [-233.74, -17.13], [-228.04, -17.02], [-222.03, -16.64], [-217.5, -16.2], [-209.7, -15.22],
    [-205.28, -14.52], [-200.03, -13.57], [-195.85, -12.94], [-191.75, -12.62], [-189.02, -12.52],
    [-178.16, -12.73], [-169.17, -13.2], [-163.29, -13.66], [-157.2, -14.26], [-147.59, -15.48],
    [-141.69, -12.57], [112.92, -12.5], [113.8, -8.46], [32.7, -8.36], [-47.34, -9.06], [-162.34, -9.05],
    [-183.6, -8.54]
  ],
  // G0268.339b8df6578e48dd85e3c89120a056df: de noordhelft van de boog en de noordelijke aanbrug met de verbredingen (x = 113 tot 621).
  [
    [140.38, -15.36], [140.13, -16.44], [140.53, -16.53], [141.21, -15.13], [141.21, -15.29], [148.34, -14.41],
    [155.49, -13.68], [163.18, -13.09], [171.07, -12.69], [178.66, -12.48], [183.4, -12.45], [186.5, -12.54],
    [190.28, -12.87], [194.23, -13.47], [197.46, -14.08], [200.38, -14.44], [203.06, -14.61], [206.17, -14.6],
    [209.2, -14.39], [211.54, -14.08], [217.8, -13.03], [221.38, -12.66], [225.24, -12.46], [228.86, -12.48],
    [231.79, -12.68], [234.36, -13], [237.73, -13.63], [240.51, -14.29], [242.6, -14.69], [245.81, -15.04],
    [248.53, -15.11], [251.32, -14.96], [254.25, -14.55], [259.33, -13.47], [264.75, -12.7], [267.19, -12.52],
    [270.36, -12.43], [272.94, -12.48], [277.56, -12.84], [280.41, -13.24], [289.81, -15.05], [297.29, -16.11],
    [303.7, -16.69], [306.77, -16.86], [313.7, -16.99], [318.07, -16.91], [321.54, -16.74], [329.52, -16.04],
    [335.25, -15.35], [339.5, -14.72], [348.73, -13.16], [353.11, -12.71], [357.18, -12.58], [360.11, -12.68],
    [363.38, -12.99], [367.02, -13.6], [370.73, -14.52], [375.29, -15.4], [378.82, -15.67], [382.35, -15.58],
    [385.09, -15.26], [390.15, -14.31], [394.18, -13.81], [397.19, -13.63], [401.38, -13.64], [405.14, -13.91],
    [407.14, -14.16], [411.16, -14.88], [415.93, -15.96], [417.53, -16.23], [421.11, -16.63], [424.66, -16.74],
    [426.69, -16.68], [428.89, -16.51], [434.97, -15.76], [437.51, -15.59], [442.05, -15.53], [444.5, -15.62],
    [463.06, -16.77], [480.21, -17.98], [494.5, -19.1], [514.23, -20.82], [525.3, -21.88], [543.39, -23.73],
    [567.74, -26.5], [593.78, -29.79], [609.42, -31.92], [620, -33.47], [620.74, -30.07], [614.89, -29.05],
    [596.19, -26.06], [562.26, -21.63], [543.28, -19.33], [520.63, -17.11], [472.52, -13.39], [393.15, -9.22],
    [360.54, -8.74], [326.32, -8.12], [308.43, -8.45], [236.92, -8.85], [226.27, -8.6], [113.8, -8.46],
    [112.92, -12.5], [135.82, -12.5]
  ],
  // G0268.10a412a369314a168d1d5c8c6b8623f8: de bocht naar het noordelijke landhoofd bij Lent (x = 620 tot 836).
  [
    [732.63, -54.44], [713.09, -49.01], [686.52, -42.53], [675.06, -39.91], [661.41, -37.16], [620.74, -30.07],
    [620, -33.47], [636.24, -36.13], [644.57, -37.6], [653.05, -39.19], [663.67, -41.29], [673.21, -43.3],
    [689.37, -46.96], [702.72, -50.21], [715.87, -53.64], [732.72, -58.34], [747.82, -62.87], [761.83, -67.33],
    [776.71, -72.35], [791.53, -77.65], [805.31, -82.85], [819.49, -88.47], [818.23, -91.49], [831.65, -94.69],
    [831.71, -94.09], [835.88, -90.83], [816.42, -82.73], [807.54, -79.41], [800.57, -77], [780.07, -69.5],
    [766.72, -65.06], [749.05, -59.34]
  ],
];
// Snijstrook over dezelfde rijen en kolommen als het dek (dus evenwijdig aan
// het wegdek), van 0,5 m onder tot 1 m boven het wegdek; aan beide uiteinden
// 1 m en aan de randen voorbij het dek, aan de oostkant tot over de
// verbredingen. De strook loopt tot boven het wegdek door, zodat de
// constructie daar geen vlak zonder dikte overhoudt.
const STRIP_V = [-20, ...DECK_V, HALF + 1];
const stripRows = [shift(SOUTH_END, -1), ...rowKeys, shift(NORTH_END, 1)];
const deckSheet = (lo, hi, label) =>
  sheet(
    stripRows.length,
    STRIP_V.length,
    (i, j) => [lineU(stripRows[i], STRIP_V[j]), STRIP_V[j]],
    (u) => deckZ(u) + hi,
    (u) => deckZ(u) + lo,
    label,
  );
const strip = deckSheet(-LAYER, ABOVE, "wegdekstrook");
// Wat boven het wegdek uitsteekt blijft constructie, met 2 cm vrij: de poten
// van de boog (hun voetafdruk boven het wegdek), het hele hangerscherm (ook
// onder de openingen) en de lifttoren.
const legZone = deckSheet(-0.01, ABOVE + 0.05, "potenzone");
const legGuards = legs.map((leg) =>
  Manifold.extrude(leg.intersect(legZone).project().offset(0.02, "Round"), 200).translate([0, 0, BASE - 50]),
);
const screenGuard = prism(
  [[-HANGER.end - 0.02, -HANGER.plate / 2 - 0.02], [HANGER.end + 0.02, -HANGER.plate / 2 - 0.02],
    [HANGER.end + 0.02, HANGER.plate / 2 + 0.02], [-HANGER.end - 0.02, HANGER.plate / 2 + 0.02]],
  BASE - 50,
  150,
);
const liftGuard = Manifold.extrude(lift.project().offset(0.02, "Round"), 200).translate([0, 0, BASE - 50]);
const notLayer = union([...legGuards, screenGuard, liftGuard]);
// De BGT-rand van het fietspad valt niet precies op de rand van het dek en de
// verbredingen in het model (die komen uit het overbruggingsdeel); waar het
// fietspad langs de oostrand loopt, hoort alles buiten 12,2 m van de as bij
// het fietspad, zodat er geen smalle reepjes rijbaan langs de rand overblijven.
const inPolygon = ([x, y], poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const EDGE_V = -12.2;
const edgeU = [];
for (let u = -440; u <= 880; u += 0.5) {
  if (BIKE_PATHS.some((poly) => inPolygon(uvToXY(u, -11), poly))) edgeU.push(u);
}
const edgeRuns = [];
for (const u of edgeU) {
  const run = edgeRuns[edgeRuns.length - 1];
  if (run && u - run[1] < 0.75) run[1] = u;
  else edgeRuns.push([u, u]);
}
const edgeBands = edgeRuns
  .filter(([u0, u1]) => u1 - u0 > 2)
  .map(([u0, u1]) => {
    const n = Math.round(u1 - u0) + 1;
    return sheet(n + 1, 2, (i, j) => [lerp(u0, u1, i / n), j ? EDGE_V : -21], () => 150, () => BASE - 50, "fietspadrand");
  });
// De vereenvoudigde vlakken sluiten waar twee BGT-vlakken aan elkaar grenzen
// niet helemaal op elkaar aan: dicht naden tot 5 cm (sluiting met een offset).
const bikeOutline = CrossSection.union(BIKE_PATHS.map((poly) => new CrossSection([ccw(poly)])))
  .offset(0.05, "Miter", 4)
  .offset(-0.05, "Miter", 4);
const bikePaths = union([Manifold.extrude(bikeOutline, 200).translate([0, 0, BASE - 50]), ...edgeBands]);
const layer = strip.subtract(notLayer);
const roadCut = layer.subtract(bikePaths);
const bikeCut = layer.intersect(bikePaths);
// Snippers rijbaan die los van de rest liggen (aan het schuine einde van het
// BGT-fietspad bij Lent) horen bij het fietspad.
// Booleans laten soms een los, plat brokje zonder volume achter; dat valt weg.
const solidOnly = (m) => union(m.decompose().filter((piece) => piece.volume() > 1e-6));
const roadPieces = roadCut.intersect(bridge).decompose();
const roadway = union(roadPieces.filter((piece) => piece.volume() > 1));
const bikeway = solidOnly(union([bikeCut.intersect(bridge), ...roadPieces.filter((piece) => piece.volume() <= 1)]));
const structure = bridge.subtract(layer);
const parts = [
  ["building:de-oversteek", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];
// De onderdelen vullen samen precies de brug.
const partition = {
  edgeRuns,
  bridgeM3: +bridge.volume().toFixed(2),
  partsM3: +parts.reduce((s, [, solid]) => s + solid.volume(), 0).toFixed(2),
};
if (Math.abs(partition.bridgeM3 - partition.partsM3) > 0.5) throw new Error(`onderdelen ${partition.partsM3} m3, brug ${partition.bridgeM3} m3`);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  const where = [];
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    where.push([(p[0][0] + p[1][0] + p[2][0]) / 3, (p[0][1] + p[1][1] + p[2][1]) / 3, (p[0][2] + p[1][2] + p[2][2]) / 3, len / 2]);
  }
  return { area, where };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-4) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
const overhangReport = {};
{
  const { area } = overhangs(bridge);
  const print = overhangs(printModel);
  // Restoverhang in de printversie per 50 m langs X.
  const bins = {};
  for (const [x, , , a] of print.where) {
    const k = Math.round(x / 50) * 50;
    bins[k] = (bins[k] ?? 0) + a;
  }
  overhangReport.modelM2 = Math.round(area);
  overhangReport.printM2 = +print.area.toFixed(1);
  overhangReport.printByX = Object.fromEntries(Object.entries(bins).filter(([, a]) => a > 1).map(([k, a]) => [k, +a.toFixed(1)]));
  // Wat overblijft zijn kleine schuine facetten waar de printvoet het
  // landhoofd en de kolommen raakt.
  if (print.area > 20) throw new Error(`printversie heeft ${print.area.toFixed(0)} m2 overhang`);
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
report.arch = {
  crownNap: ARCH.crownNap,
  splitNap: +(archTop(ARCH.split) + WATER_NAP).toFixed(2),
  landingsX: [-1, 1].flatMap((end) => [1, -1].map((side) => +landingX(end, side).toFixed(2))),
  screenOpenings: hangerScreen.holes,
};
report.supports = {
  south: SOUTH_SUPPORTS,
  north: NORTH_SUPPORTS.map((u) => +u.toFixed(2)),
  faces: { south: +SOUTH_FACE.U.toFixed(2), north: +NORTH_FACE.U.toFixed(2) },
  columns: columns.length,
};
report.overhang = overhangReport;
report.partition = partition;
const glbFile = path.join(outDir, "de-oversteek.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-de-oversteek.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `de-oversteek-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint De Oversteek Nijmegen 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveld op het water van de Waal naast de hoofdoverspanning en van de
// Spiegelwaal naast de noordelijke aanbrug, ruim naast de pijlers.
const samplePoints = [
  ...[-60, 0, 60].flatMap((u) => [[u, 32], [u, -32]]),
  ...[500, 560].flatMap((u) => [[u, 35], [u, -35]]),
].map(([u, v]) => uvToXY(u, v).map((c) => +c.toFixed(2)));
await writeFile(
  path.join(outDir, "de-oversteek.json"),
  JSON.stringify(
    {
      name: "De Oversteek",
      file: "de-oversteek.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [186278.14, 430048.05],
      xAxis: [0.39227, 0.91985],
      groundOffsetMetres: GROUND_OFFSET,
      // Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten: de
      // Spiegelwaal; terugval voor een uitsnede die geen van de punten raakt.
      groundHeight: 50.81,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "G0268.0179db2672a1487486c6ae4d02c27b05",
        "G0268.1b3a2720ecb24332a8777f9461e56293",
        "G0268.42ff08b6881d5775e0530100007f0cc2",
        "G0268.b06da65018a24b3d996383677dfb09b4",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden tussen de twee rivierpijlers op de waterspiegel van de Waal (z = 0, NAP +7,2 m zoals het PDOK-terrein) in de oorsprong, +X langs de rechte hoofdoverspanning naar het noorden (Lent, RD-richting 66,9 graden vanaf het oosten) en +Y stroomafwaarts naar het westnoordwesten. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan regionale weg of fietspad, bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt; het fietspad aan de oostkant met de verbredingen), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, met de poten van de boog, het hangerscherm en de lifttoren boven het wegdek. Het dek van 25,1 m breed (BGT) van het zuidelijke landhoofd aan de Weurtseweg (op de as x = -420 tot -413) tot het noordelijke landhoofd aan de dijk bij Lent (op de as x = 814 tot 843, 73 tot 85 m rechts van de rechte as), 1275 m langs de as, alleen tussen x = -296 en 333 recht en daarbuiten in een flauwe bocht naar rechts, met het wegdek op NAP +19,5 tot +26,4 m (AHN); de stalen netwerkboog van 285 m tussen de rivierpijlers als één koker van 4,4 m breed met de top op NAP +81,0 m, die bij x = ±108 splitst in twee poten naar de randen van het dek; de kruisende hangers (in werkelijkheid twee schuine kabelvlakken naar de randen van de rijbaan) als één staand scherm van 1,1 m op de as onder de boog met doorgaande ruitvormige openingen, tot x = ±110; de twee rivierpijlers als gebogen lenzen van 37 m (BGT); vijf aanbrugoverspanningen aan de zuidkant en zestien aan de noordkant met spitse bogen onder het dek op afgeknotte elliptische kolommen (twee per steunlijn, 13 graden scheef langs de stroming); negen verbredingen van het fietspad aan de oostkant als balkons op dekhoogte met een console (in de twee grootste liggen trappen naar het maaiveld) en de lifttoren aan de Waalkade. Leuningen, glazen windschermen, de 48 lichtmasten en de hangerankers zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water van de Waal en de Spiegelwaal bemonsterd; groundHeight is de ellipsoïdische PDOK-hoogte van dat water. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: 1275,
        deckWidthM: 2 * HALF,
        mainSpanPierCentresM: 2 * MAIN_PIER_U,
        archCrownNapM: ARCH.crownNap,
        archSplitNapM: report.arch.splitNap,
        archBoxM: [ARCH.width, +vDepth(ARCH.width, ARCH.side).toFixed(2)],
        deckNapM: { south: DECK_NAP[0], crest: Math.max(...DECK_NAP), north: DECK_NAP[DECK_NAP.length - 1] },
        approachSpans: { south: SOUTH_SUPPORTS.length, north: NORTH_SUPPORTS.length + 1, northSpanM: NORTH_SPAN },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/De_Oversteek_(brug)",
        "PDOK BGT overbruggingsdeel (dek, verbredingen, rivierpijlers, kolomparen) en wegdeel (rijbaan en fietspad op het dek), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor de as en het lengteprofiel van het dek, de boog, de poten, de trappen en de lifttoren",
        "PDOK luchtfoto (Actueel_orthoHR) voor de kolommen in de uiterwaard en de verbredingen",
        "Wikimedia Commons: Nijmegen, de Oversteek IMG 3245 2020-03-17 10.58.jpg; De Oversteek 01.jpg; De Oversteek 02.jpg; Waal river crossing bridge \"de oversteek\" at Nijmegen, as seen from the North-East/North-West - panoramio.jpg; Nijmegen - Waal - De Oversteek (26223244138).jpg; Spiegelwaal 05 met brug De Oversteek.JPG",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

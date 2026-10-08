// Genereert een vereenvoudigd, gesloten 3D-model van het Vredespaleis aan het
// Carnegieplein in Den Haag: het neorenaissancepaleis van Louis Cordonnier en
// Johan van der Steur (1907-1913) als vierkant van vier vleugels rond de
// binnenplaats, met de voorvleugel aan het Carnegieplein onder het hoge
// zadeldak met de dakruiter en twee schoorstenen, de hogere hoekblokken aan
// de voorkant met het paviljoen met de topgevel op de noordhoek, de
// vleugels aan de noord-, zuid- en achterkant onder gebroken daken, de twee
// uitbouwen in de binnenplaats en de vloer van de binnenplaats, de hoge
// klokkentoren op de zuidhoek van de voorgevel (vierkante schacht, de
// klokkenverdieping die 0,3 m uitkraagt met vier hoektorentjes, de smallere
// bovengeleding, de spits en de windvaan tot NAP +83 m) en de kleinere
// achtkantige toren met spits aan de noordkant. Binnen hetzelfde BAG-pand
// liggen ook de latere uitbreidingen: de bibliotheekvleugel met de ovale zaal
// aan de zuidwestkant en het Academiegebouw aan de noordwestkant; die staan
// er als blokken op hun AHN-hoogte in. Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node met
// de materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-vredespaleis.mjs              # 1:1000 (standaard)
//   node scripts/generate-vredespaleis.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: de gevels staan recht op, de daken lopen
// schuin omhoog (de vleugels onder 50 tot 60 graden), de torens worden per
// geleding smaller, de spitsen en de dakruiter zijn kegels of piramides, de
// schoorstenen en torentjes zijn minstens 1,4 m dik en de uitbreidingen zijn
// blokken met een vlak dak of een lessenaarsdak.
// Alleen de klokkenverdieping van de hoge toren kraagt 0,3 m vlak uit; die
// vlakke onderkant laat de export het model als gesloten solid opvullen (zie
// de controle onderaan).
//
// Assenstelsel: oorsprong op RD (80201,12, 455937,92), midden op de voorgevel
// in de as van de ingang en de dakruiter, op het maaiveld (NAP +3,4 m), Z
// omhoog. +X loopt van de achtergevel naar de voorgevel (RD-richting 16,87
// graden, naar het oostnoordoosten, de richting van de BAG-gevels), +Y naar
// het noordnoordwesten; de voorgevel kijkt naar het Carnegieplein (+X), de
// hoge klokkentoren staat op de zuidhoek (-Y), de kleine toren aan de
// noordgevel (+Y), de bibliotheek en het Academiegebouw achter het paleis
// (-X).
//
// Bronnen: BAG-pand 0518100000210611 (contour van paleis, binnenplaats en
// uitbreidingen); AHN DSM/DTM 0,5 m (PDOK WCS) in een stelsel langs de
// gevels: de dwarsprofielen van de vleugels (goten en nokken), de omhullende
// van beide torens per hoogte, de dakruiter, de schoorstenen, de daken van de
// uitbreidingen en het maaiveld; Wikipedia (toren 80 m, 1907-1913),
// Rijksmonumentenregister 333074; foto's op Wikimedia Commons (Den Haag Peace
// Palace.jpg, Friedenspalast Den Haag.jpg frontaal, Peace Palace (side
// view).JPG, Peace Palace back side 04152014.JPG) voor de geledingen van de
// torens en de dakvormen; PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "vredespaleis");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 3,4 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [80201.12, 455937.92];
const ANGLE = (16.87 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 3.4;
const NAP = (h) => h - GROUND_NAP;
// Onderkant 2 m onder het maaiveld: aan de vijver aan de noordkant en naast
// het Academiegebouw ligt het maaiveld op NAP +2,1 m.
const BASE = -2;

// BAG-contour van het pand (lokaal, tot 10 cm vereenvoudigd): paleis,
// bibliotheekvleugel met de ovale zaal en het Academiegebouw.
const OUTLINE = [
  [0.03, 34.91], [0.03, 35.85], [0.03, 38.89], [-26.73, 39.03], [-29.71, 39.05], [-30.76, 39.05], [-30.81, 32.65],
  [-37.11, 32.73], [-37.17, 33.21], [-38.14, 34.15], [-39.98, 34.26], [-40.95, 33.17], [-40.98, 32.65], [-47.49, 32.78],
  [-47.52, 33.35], [-48.38, 34.31], [-50.56, 34.30], [-51.77, 33.09], [-51.75, 32.69], [-58.04, 32.72], [-57.97, 36.00],
  [-60.26, 36.01], [-62.22, 36.02], [-74.84, 36.11], [-76.66, 36.12], [-79.41, 36.14], [-79.36, 33.08], [-79.83, 33.05],
  [-81.42, 31.64], [-81.40, 29.16], [-80.17, 27.88], [-79.42, 27.89], [-79.45, 21.59], [-83.91, 21.57], [-94.81, 21.54],
  [-96.07, 23.72], [-94.27, 25.02], [-94.09, 29.08], [-94.87, 30.66], [-90.20, 30.31], [-90.11, 47.78], [-98.32, 47.90],
  [-98.48, 46.45], [-102.95, 46.44], [-103.01, 47.95], [-118.00, 47.98], [-117.98, 46.22], [-126.56, 46.37], [-126.56, 46.64],
  [-126.54, 48.51], [-126.46, 57.03], [-126.44, 59.07], [-125.05, 59.62], [-125.15, 68.21], [-125.17, 69.61], [-125.30, 79.84],
  [-126.69, 79.58], [-126.81, 83.67], [-123.55, 83.95], [-124.50, 91.28], [-143.13, 88.18], [-142.35, 83.33], [-145.32, 81.80],
  [-149.16, 82.49], [-151.36, 82.89], [-152.98, 83.18], [-154.90, 71.45], [-155.25, 69.29], [-156.01, 64.68], [-152.13, 63.94],
  [-151.49, 59.89], [-151.40, 59.30], [-155.26, 58.79], [-152.55, 41.76], [-144.46, 42.93], [-140.52, 40.38], [-143.18, 35.27],
  [-132.62, 29.36], [-129.35, 27.53], [-128.06, 26.82], [-122.51, 36.78], [-106.65, 36.61], [-106.52, 36.41], [-97.49, 22.75],
  [-96.05, 19.73], [-94.10, 19.69], [-83.91, 19.53], [-79.45, 19.45], [-79.50, 7.02], [-79.55, -5.21], [-79.62, -25.92],
  [-79.98, -25.87], [-81.65, -27.49], [-81.67, -29.78], [-80.33, -31.23], [-79.61, -31.20], [-79.67, -34.65], [-71.06, -34.71],
  [-71.08, -35.51], [-71.11, -37.04], [-69.47, -37.05], [-85.00, -55.98], [-104.83, -56.04], [-104.83, -55.71], [-102.74, -54.62],
  [-100.11, -52.51], [-99.32, -51.18], [-98.86, -50.17], [-98.69, -48.96], [-98.70, -47.37], [-99.01, -46.37], [-99.21, -46.01],
  [-99.50, -45.48], [-100.24, -44.45], [-101.50, -43.04], [-102.34, -42.31], [-104.55, -40.94], [-106.96, -40.01], [-108.23, -39.58],
  [-111.16, -38.92], [-114.52, -38.56], [-117.55, -38.70], [-119.44, -39.02], [-121.05, -39.41], [-121.51, -39.60], [-124.68, -40.93],
  [-126.54, -41.92], [-127.67, -42.84], [-128.82, -43.98], [-129.42, -44.75], [-130.04, -46.39], [-130.29, -47.88], [-130.25, -49.38],
  [-129.83, -50.63], [-128.45, -52.46], [-126.47, -54.19], [-124.30, -55.50], [-124.30, -56.21], [-127.59, -56.21], [-127.51, -70.35],
  [-38.42, -70.05], [-38.53, -56.05], [-62.72, -56.47], [-63.20, -34.68], [-61.69, -34.69], [-59.86, -34.69], [-58.21, -34.70],
  [-58.18, -31.30], [-52.10, -31.37], [-52.08, -31.65], [-50.77, -33.04], [-48.74, -32.96], [-47.60, -31.73], [-47.64, -31.34],
  [-41.51, -31.38], [-41.45, -31.79], [-40.28, -33.03], [-38.38, -33.00], [-37.17, -31.71], [-37.17, -31.35], [-31.14, -31.25],
  [-31.10, -35.62], [-31.08, -37.57], [-30.30, -37.57], [-29.78, -37.57], [-27.36, -37.58], [-26.77, -37.58], [-3.51, -37.66],
  [-3.47, -23.84], [0.00, -23.86], [0.01, -3.35], [0.01, -2.92], [0.02, 3.73], [0.02, 4.17],
];
// De binnenplaats (gat in de BAG-contour).
const COURT = [
  [-22.52, 17.64], [-22.46, 10.26], [-27.87, 10.15], [-27.94, 5.88], [-31.08, 5.80], [-32.17, 4.84], [-34.31, 2.98],
  [-34.34, -1.52], [-32.26, -3.68], [-31.64, -4.33], [-27.99, -4.42], [-28.00, -8.76], [-22.63, -8.87], [-22.50, -16.28],
  [-54.77, -16.21], [-57.88, -16.20], [-63.71, -16.19], [-66.05, -13.89], [-66.13, -6.50], [-62.67, -6.60], [-62.55, -5.36],
  [-59.59, -5.47], [-59.59, -4.67], [-59.60, 6.66], [-59.60, 7.00], [-62.66, 6.94], [-62.66, 8.19], [-65.96, 8.21],
  [-65.98, 15.16], [-63.37, 17.71], [-57.91, 17.70], [-54.88, 17.69],
];
// Alles binnen de paleiscontour tot de lage galerijen langs de binnenplaats
// (NAP +13 tot +15 m).
const PALACE = [[-83, -34.65], [-31.1, -34.65], [-31.1, -38], [1, -38], [1, 40], [-83, 40]];
const LOW = 14.0;
// Lagere delen binnen de contour, van boven afgesneden: het bordes voor het
// noordelijke paviljoen (AHN NAP +5 tot +7 m).
const TERRACES = [{ x: [-3.5, 2], y: [27.5, 41], top: 6.5 }];
// Binnenplaats: vloer 0,45 m boven het AHN-maaiveld langs de randen (NAP
// +3,45 m) en het verhoogde middendeel (NAP +5,7 tot +6 m).
const COURT_FLOOR = 3.9;
const COURT_PLATFORM = { x: [-60, -30], y: [-13.5, 13], top: 5.9 };
// Vleugels met een gebroken dak: dwarsprofiel uit het AHN met de goten aan
// beide zijden (`eave`, in de volgorde van `c`) en een vlakke of smalle
// bovenkant (`tc` dwars, `ta` langs). `along` is de as waarlangs de vleugel
// loopt; `a` en `c` zijn de uitersten langs en dwars. De goten liggen 1 m
// binnen de gevels; daarbuiten staan de galerijen tot `LOW`.
const WINGS = [
  // Noordvleugel, westelijk deel tot de uitbouw aan de noordgevel; de nok
  // loopt tot de nok van de achtervleugel.
  { along: "x", a: [-79.5, -56], c: [19, 35.6], eave: [20, 20.6], top: 30.5, ta: [-73, -56], tc: [25.5, 26.5] },
  // Noordvleugel, midden.
  { along: "x", a: [-58, -29], c: [19, 32.6], eave: [20, 20.6], top: 30.5, ta: [-58, -29], tc: [25.5, 26.5] },
  // Hoger blok op de noordhoek achter de voorvleugel.
  { along: "x", a: [-30.8, -9], c: [18, 27], eave: [20, 30.4], top: 32.8, ta: [-30.8, -10], tc: [25.5, 25.5] },
  // Zuidvleugel, westelijk deel.
  { along: "x", a: [-79.5, -56], c: [-33.8, -18.3], eave: [20.5, 21.5], top: 30, ta: [-73, -56], tc: [-25, -23] },
  // Zuidvleugel, midden.
  { along: "x", a: [-58.2, -29], c: [-31, -18.3], eave: [20.7, 22], top: 30, ta: [-58.2, -29], tc: [-25, -23] },
  // Hoger blok op de zuidhoek achter de voorvleugel, tot de klokkentoren.
  { along: "x", a: [-31.1, -3.5], c: [-37.6, -17], eave: [22, 21], top: 33.3, ta: [-31.1, -12], tc: [-31.5, -26] },
  // Achtervleugel, over de volle breedte van het paleis met schilden op de
  // hoeken.
  { along: "y", a: [-35, 36], c: [-78.7, -67.5], eave: [20.7, 19.7], top: 29.4, ta: [-29, 30], tc: [-73.5, -73.5] },
  // Voorvleugel aan het Carnegieplein: zadeldak met schilden, nok op +35,8 m.
  { along: "y", a: [-23.9, 27.5], c: [-18.5, -1], eave: [20, 21.5], top: 35.8, ta: [-16, 16], tc: [-9, -9] },
  // Uitbouw van de achtervleugel in de binnenplaats, met een vlak dak.
  { along: "x", a: [-67, -59.6], c: [-5.5, 7], eave: [21, 21], top: 23.8, ta: [-66, -61], tc: [-4.5, 6] },
];
// Uitbouw van de voorvleugel in de binnenplaats: nok +30 m aan de
// binnenplaatskant, vlakke bovenkant +33 m tegen de voorvleugel.
const PROJECTION = { x: [-34.3, -12], y: [-9, 10.1], eave: 22.5, ridge: { x: -30, y: 0.5, top: 30 }, flat: { x: [-24, -12], y: [-3, 3], top: 33 } };
// Paviljoen op de noordhoek van de voorgevel: zadeldak met de nok loodrecht
// op de voorgevel (+33,7 m) dat naar de voorkant afloopt, tegen de
// noordvleugel aan op +30,4 m.
const PAVILION = { x: [-30.8, -3.5], y: [27, 39], inner: 30.4, eave: 22.6, ridgeY: 32, ridge: 33.7, ridgeFrom: -22, ridgeTo: -11, back: 28, front: 28 };
// Ronde erkers op de hoeken van de achtergevel.
const BAYS = [{ x: [-82, -79.3], y: [25, 34] }, { x: [-82, -79.3], y: [-32, -25] }];
const BAY_TOP = 19;
// Lage uitbouwen aan de noordgevel.
const PORCHES = { x: [-52, -36], y: [32.7, 35], top: 18 };
// Klokkentoren op de zuidhoek van de voorgevel (AHN-omhullende per hoogte,
// geledingen uit de frontale foto): vierkante schacht van 10,6 m tot de
// kroonlijst onder de klokkenverdieping, die 0,3 m vlak uitkraagt, vier
// hoektorentjes met kegeldaken, de bovengeleding van 6,2 m, een achtkantige
// spits en de windvaan.
const TOWER = {
  c: [-8.8, -32.4],
  shaft: { half: 5.3, top: 42.3 },
  belfry: { half: 5.6, top: 50.5 },
  turrets: { offset: 4.7, apothem: 0.9, top: 55, tip: 58.5 },
  upper: { half: 3.1, top: 63 },
  spire: { apothem: 2.9, tip: 80 },
  needle: { apothem: 0.45, tip: 83.0 },
};
// Kleine toren aan de noordgevel: een bredere voet tot in de daken,
// daarboven achtkantig met spits en naald.
const SMALL = {
  c: [-28.5, 37.2],
  foot: { x: [-31.5, -25.8], y: [34.9, 39.1], top: 34 },
  apothem: 2.1,
  top: 40,
  tip: 50.5,
  needle: { apothem: 0.45, tip: 52.4 },
};
// Dakruiter op de nok van de voorvleugel, in de as van de ingang.
const FLECHE = { c: [-9.2, 0], apothem: 1.1, from: 30, top: 41, tip: 48.5 };
// Torentje op de uitbouw van de achtervleugel (AHN +31 m).
const LANTERN = { c: [-67.2, 0], apothem: 1.5, from: 14, top: 29, tip: 33 };
// Schoorstenen: twee naast de dakruiter, twee op de achterhoeken.
const CHIMNEYS = [
  { c: [-9.2, -8.5], half: 0.7, from: 30, top: 40 },
  { c: [-9.2, 9], half: 0.7, from: 30, top: 40 },
  { c: [-70, 26.5], half: 0.8, from: 27, top: 38 },
  { c: [-70, -24.5], half: 0.8, from: 27, top: 38 },
];
// Latere uitbreidingen binnen hetzelfde BAG-pand als vlakke blokken (daken
// als AHN-mediaan per deel): de bibliotheekvleugel, de ovale zaal, het
// driehoekige tussenlid naar het paleis, de verbinding naar het noorden, het
// lage tussenblok en het Academiegebouw met zijn schuine dakvlakken in
// vlakke delen en één lessenaarsdak (`slope`: hoogte aan beide X-zijden).
const ANNEXES = [
  { label: "bibliotheekvleugel", x: [-130, -36], y: [-75, -56], top: 19.9 },
  { label: "tussenlid", x: [-91, -60], y: [-57, -33], top: 12.8 },
  { label: "ovale zaal", x: [-140, -90], y: [-57, -30], top: 13.8 },
  { label: "verbinding", x: [-98, -79.4], y: [18, 25], top: 9.5 },
  { label: "tussenblok", x: [-122.5, -86], y: [25, 50], top: 14.4 },
  { label: "Academiegebouw zuid", x: [-143.5, -121], y: [20, 47], slope: [15, 22] },
  { label: "Academiegebouw zuidwest", x: [-160, -143], y: [20, 47], top: 14.5 },
  { label: "Academiegebouw oost", x: [-132, -124], y: [47, 120], top: 14.4 },
  { label: "Academiegebouw midden", x: [-147, -132], y: [47, 120], top: 18.8 },
  { label: "Academiegebouw west", x: [-151, -147], y: [47, 80], top: 18.2 },
  { label: "Academiegebouw westrand", x: [-180, -151], y: [47, 80], top: 14.4 },
  { label: "Academiegebouw noord", x: [-180, -147], y: [80, 120], top: 16 },
];
// Maaiveld rondom (NAP +3,4 tot +3,5 m): aan de zuidgevel, in de tuin achter
// het paleis en aan de zuidkant van de bibliotheek. Niet aan de vijver aan de
// noordkant (NAP +2,1 m) en niet op het terras voor de ingang (NAP +5,3 m).
const GROUND_SAMPLES = [[-46, -37], [-84, 0], [-86, -72]];

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
const box = ([x0, x1], [y0, y1], z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
const outline = prism(OUTLINE, BASE - 1, 200).subtract(prism(COURT, BASE - 2, 201));
const clip = (solid) => Manifold.intersection(outline, solid);
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const square = ([cx, cy], h) => rect([cx - h, cx + h], [cy - h, cy + h]);
// Regelmatige achthoek met de vlakken op de assen (apothema a).
const octagon = ([cx, cy], a) =>
  [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => polar([cx, cy], a / Math.cos(Math.PI / 8), deg));
// Achtkantige spits van z0 tot tip (NAP), eventueel met een naald die diep
// genoeg in de spits begint om er nergens onderuit te steken.
const spire = (c, a, z0, tip, needle) => {
  const parts = [Manifold.hull([...at(octagon(c, a), NAP(z0) - 0.01), [c[0], c[1], NAP(tip)]])];
  if (needle) {
    const start = NAP(tip) - (0.6 * (tip - z0)) / a - 0.1;
    parts.push(
      Manifold.hull([
        ...at(octagon(c, needle.apothem), start),
        ...at(octagon(c, needle.apothem), NAP(needle.tip) - 0.6),
        [c[0], c[1], NAP(needle.tip)],
      ]),
    );
  }
  return parts;
};
// Vleugel met gebroken dak (zie WINGS); `along: "y"` verwisselt de assen.
const wing = ({ along, a, c, eave, top, ta, tc }) => {
  const P = along === "x" ? (u, v, z) => [u, v, z] : (u, v, z) => [v, u, z];
  const pts = [];
  for (const u of a) {
    pts.push(P(u, c[0], BASE), P(u, c[1], BASE), P(u, c[0], NAP(eave[0])), P(u, c[1], NAP(eave[1])));
  }
  for (const u of ta) for (const v of tc) pts.push(P(u, v, NAP(top)));
  return Manifold.hull(pts);
};

// ---------- opbouw: paleis ----------
const parts = [
  clip(prism(PALACE, BASE, NAP(LOW))),
  prism(COURT, BASE, NAP(COURT_FLOOR)),
  Manifold.intersection(prism(COURT, BASE - 1, 100), box(COURT_PLATFORM.x, COURT_PLATFORM.y, BASE, NAP(COURT_PLATFORM.top))),
  ...WINGS.map((W) => clip(wing(W))),
];
{
  const P = PROJECTION;
  parts.push(
    clip(
      Manifold.hull([
        ...at(rect(P.x, P.y), BASE),
        ...at(rect(P.x, P.y), NAP(P.eave)),
        [P.ridge.x, P.ridge.y, NAP(P.ridge.top)],
        ...at(rect(P.flat.x, P.flat.y), NAP(P.flat.top)),
      ]),
    ),
  );
}
{
  const P = PAVILION;
  const r = rect(P.x, P.y);
  parts.push(
    clip(
      Manifold.hull([
        ...at(r, BASE),
        ...at([[P.x[0], P.y[0]], [P.x[1], P.y[0]]], NAP(P.inner)),
        ...at([[P.x[0], P.y[1]], [P.x[1], P.y[1]]], NAP(P.eave)),
        [P.x[0], P.ridgeY, NAP(P.back)],
        [P.ridgeFrom, P.ridgeY, NAP(P.ridge)],
        [P.ridgeTo, P.ridgeY, NAP(P.ridge)],
        [P.x[1], P.ridgeY, NAP(P.front)],
      ]),
    ),
  );
}
for (const B of BAYS) parts.push(clip(box(B.x, B.y, BASE, NAP(BAY_TOP))));
parts.push(clip(box(PORCHES.x, PORCHES.y, BASE, NAP(PORCHES.top))));
for (const C of CHIMNEYS) parts.push(prism(square(C.c, C.half), NAP(C.from), NAP(C.top)));
for (const F of [FLECHE, LANTERN]) {
  parts.push(prism(octagon(F.c, F.apothem), NAP(F.from), NAP(F.top)), ...spire(F.c, F.apothem, F.top, F.tip));
}

// ---------- opbouw: torens ----------
{
  const T = TOWER;
  parts.push(
    prism(square(T.c, T.shaft.half), BASE, NAP(T.shaft.top)),
    // Klokkenverdieping die 0,3 m vlak uitkraagt.
    prism(square(T.c, T.belfry.half), NAP(T.shaft.top), NAP(T.belfry.top)),
    prism(square(T.c, T.upper.half), NAP(T.belfry.top) - 0.01, NAP(T.upper.top)),
    ...spire(T.c, T.spire.apothem, T.upper.top, T.spire.tip, T.needle),
  );
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      const c = [T.c[0] + sx * T.turrets.offset, T.c[1] + sy * T.turrets.offset];
      parts.push(
        prism(octagon(c, T.turrets.apothem), NAP(T.belfry.top) - 0.01, NAP(T.turrets.top)),
        ...spire(c, T.turrets.apothem, T.turrets.top, T.turrets.tip),
      );
    }
  }
}
{
  const S = SMALL;
  parts.push(
    box(S.foot.x, S.foot.y, BASE, NAP(S.foot.top)),
    prism(octagon(S.c, S.apothem), BASE, NAP(S.top)),
    ...spire(S.c, S.apothem, S.top, S.tip, S.needle),
  );
}

// ---------- opbouw: uitbreidingen ----------
for (const A of ANNEXES) {
  if (A.slope) {
    const r = rect(A.x, A.y);
    parts.push(clip(Manifold.hull([...at(r, BASE), ...r.map(([x, y]) => [x, y, NAP(x === A.x[0] ? A.slope[0] : A.slope[1])])])));
  } else {
    parts.push(clip(box(A.x, A.y, BASE, NAP(A.top))));
  }
}

const palace = Manifold.union(parts).subtract(
  Manifold.union(TERRACES.map((T) => box(T.x, T.y, NAP(T.top), 200))),
);
const nodes = [["building:vredespaleis", palace]];

// ---------- controles ----------
if (palace.status() !== "NoError") throw new Error(palace.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // alleen de uitkragende klokkenverdieping van de toren hoort erbij.
  const mesh = palace.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const levels = new Map();
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const z = Math.min(...p.map((q) => q[2])).toFixed(2);
    levels.set(z, (levels.get(z) ?? 0) + len / 2);
  }
  console.log("ondervlakken (lokale z: m2):", Object.fromEntries(levels));
  const allowed = NAP(TOWER.shaft.top).toFixed(2);
  for (const [z, area] of levels) if (z !== allowed && area > 0.01) throw new Error(`overhang op z ${z}`);
  if (!levels.has(allowed)) throw new Error("uitkraging van de klokkenverdieping ontbreekt");
  const bb = palace.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
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
  const nodes = [];
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
    nodes.push({ name, mesh: meshes.length - 1 });
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
for (const [name, solid] of nodes) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "vredespaleis.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-vredespaleis.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `vredespaleis-1-${scale}.stl`);
const printSolid = palace.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Vredespaleis Den Haag 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

await writeFile(
  path.join(outDir, "vredespaleis.json"),
  JSON.stringify(
    {
      name: "Vredespaleis",
      file: "vredespaleis.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +3,4 tot +3,5 m): aan de zuidgevel, in de
      // tuin achter het paleis en aan de zuidkant van de bibliotheek, niet aan
      // de vijver (NAP +2,1 m) of op het terras voor de ingang (NAP +5,3 m).
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0518100000210611"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (80201,12, 455937,92), midden op de voorgevel van het Vredespaleis in de as van de ingang en de dakruiter, op het maaiveld (NAP +3,4 m), +X van de achtergevel naar de voorgevel (RD-richting 16,87 graden, naar het oostnoordoosten) en +Y naar het noordnoordwesten; de voorgevel kijkt naar het Carnegieplein, de hoge klokkentoren staat op de zuidhoek (-Y), de kleine toren aan de noordgevel (+Y), de bibliotheek en het Academiegebouw liggen achter het paleis (-X). Eén node building: het paleis van circa 80 bij 77 m binnen de BAG-contour met de vloer van de binnenplaats op +3,9 m en het verhoogde middendeel op +5,9 m, de voorvleugel onder een zadeldak met schilden (goot +20 tot +21,5 m, nok +35,8 m) met de dakruiter tot +48,5 m en twee schoorstenen, de hogere blokken op de noord- en zuidhoek (+32,8 en +33,3 m) met het paviljoen op de noordhoek (nok +33,7 m), de noord-, zuid- en achtervleugel onder gebroken daken (goot +19,7 tot +22 m, bovenkant +29,4 tot +30,5 m), de twee uitbouwen in de binnenplaats, de klokkentoren (schacht 10,6 m tot +42,3 m, klokkenverdieping die 0,3 m uitkraagt tot +50,5 m met vier hoektorentjes tot +58,5 m, bovengeleding van 6,2 m tot +63 m, achtkantige spits tot +80 m en windvaan tot NAP +83 m) en de kleine achtkantige toren aan de noordgevel (4,2 m, tot +40 m, spits en naald tot +52,4 m); daarachter binnen hetzelfde BAG-pand de bibliotheekvleugel (+19,9 m), de ovale zaal (+13,8 m), het tussenlid (+12,8 m) en het Academiegebouw (+14,4 tot +22 m) als blokken met een vlak dak of een lessenaarsdak. Alles staat recht op of loopt schuin omhoog, behalve de klokkenverdieping die 0,3 m uitkraagt, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0518100000210611. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`vredespaleis-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        palaceLengthM: 79.5,
        palaceWidthM: 76.6,
        frontRidgeNapM: 35.8,
        flecheTipNapM: FLECHE.tip,
        clockTowerShaftM: 2 * TOWER.shaft.half,
        clockTowerBelfryNapM: TOWER.belfry.top,
        clockTowerTipNapM: TOWER.needle.tip,
        smallTowerTipNapM: SMALL.needle.tip,
        libraryRoofNapM: ANNEXES[0].top,
        courtyardFloorNapM: COURT_FLOOR,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Vredespaleis",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/333074",
        "PDOK BAG pand 0518100000210611 (contour van paleis, binnenplaats en uitbreidingen), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dwarsprofielen van de vleugels, omhullende van de torens per hoogte, dakruiter, schoorstenen, daken van de uitbreidingen, maaiveld",
        "Wikimedia Commons: Friedenspalast Den Haag.jpg (frontaal), Den Haag Peace Palace.jpg, Peace Palace (side view).JPG, Peace Palace back side 04152014.JPG",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

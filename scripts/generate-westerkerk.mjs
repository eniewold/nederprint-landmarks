// Genereert een gesloten 3D-model van de Westerkerk in Amsterdam: de
// protestantse kruiskerk van Hendrick de Keyser met het middenschip onder een
// zadeldak (nok NAP +37,1 m), de zijbeuken onder een vlak dak, de twee
// gelijke dwarsbeuken onder dwarse zadeldaken met topgevels aan de noord- en
// zuidkant, de steunberen en de lage aanbouwen binnen de BAG-contour, en de
// Westertoren aan de Prinsengracht: de bakstenen romp met een uitkragende
// kroonlijst en balustrade, de zandstenen geleding met het wapen van
// Amsterdam, de twee met lood beklede houten geledingen, de voet met
// voluten, de keizerskroon, de bol en de windvaan tot 85 m boven het
// maaiveld. Daarnaast het pand Prinsengracht 281 (1772) tegen de zuidgevel
// van de toren als blok met een schilddak, omdat PDOK het met de AHN-punten
// van de toren tot een kolom van circa 67 m reconstrueert, en de lage aanbouw
// voor de oostgevel en de twee onder de oostelijke dwarsbeuk als blokken met
// een plat dak. Alle maten in het
// script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog,
// één node per pand met de materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart, plus een binaire
// STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-westerkerk.mjs              # 1:1000 (standaard)
//   node scripts/generate-westerkerk.mjs --scale 2000
//
// Printbaar op 1:1000 zonder steun: alle onderdelen zijn minstens 0,9 m dik en
// staan recht op of lopen schuin omhoog, elke geleding van de toren is smaller
// dan de vorige, de kroonlijsten van de bovenste geledingen en de band van de
// kroon kragen onder een helling van 40 graden uit, de naald is 0,9 m dik en
// de nissen hebben een spitse bovenkant van 60 graden. Alleen de kroonlijst
// met balustrade boven de bakstenen romp kraagt 0,3 m vlak uit; die vlakke
// onderkant laat de export de nissen behouden (zie de controle onderaan).
//
// Assenstelsel: oorsprong op RD (120701,34, 487525,44), in het hart van de
// toren, op het maaiveld (NAP +1,6 m), Z omhoog. +X loopt langs de as van de
// kerk van de toren naar de oostgevel (RD-richting -3,3 graden, net ten
// zuiden van oost), +Y naar het noorden; de toren staat aan de -X-kant, aan
// de Prinsengracht, de oostgevel aan de Westermarkt.
//
// Bronnen: BAG-panden 0363100012174221, 0363100012174220, 0363100012164998,
// 0363100012174224 en 0363100012174406 (contouren); AHN DSM/DTM 0,5 m (PDOK WCS)
// in een stelsel langs de as: dwarsprofielen van middenschip, zijbeuken en
// beide dwarsbeuken, de omhullende van de toren per hoogte en per afstand tot
// het hart (romp tot circa +46 m, zandstenen geleding tot +53,6 m, eerste
// houten geleding tot +63 m, tweede tot +71,5 m, kroon tot circa +78 m,
// hoogste AHN-punt +83 m) en het maaiveld; Wikipedia (58 × 29 m, toren 85 à
// 87 m, keizerskroon); Rijksmonumentenregister 4298; foto's op Wikimedia
// Commons (de bovenbouw frontaal en vanaf de Westermarkt); PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "westerkerk");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 1,6 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [120701.34, 487525.44];
const ANGLE = (-3.3 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 1.6;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour van de kerk (lokaal), met de toren, de steunberen en de lage
// aanbouwen tegen de noordgevel.
const OUTLINE = [
  [-5.39, -5.56], [-4.88, -5.56], [4.33, -5.56], [4.32, -16.44], [4.32, -16.76], [6.32, -16.75], [6.32, -15.1],
  [12.26, -15.09], [12.27, -16.74], [14.26, -16.74], [14.26, -15.09], [20.2, -15.07], [20.2, -16.72], [22.2, -16.72],
  [22.2, -15.07], [28.14, -15.05], [28.14, -16.71], [30.14, -16.7], [30.14, -15.05], [36.08, -15.04], [36.08, -16.69],
  [38.08, -16.69], [38.07, -15.03], [43.99, -15.01], [44.02, -16.67], [46.01, -16.67], [46.02, -15.02], [52.01, -15.01],
  [52.01, -16.66], [54.01, -16.65], [54.01, -14.95], [55.75, -14.95], [55.75, -12.94], [54.03, -12.95], [54.05, -6.99],
  [55.8, -6.98], [55.82, -4.95], [54.07, -4.94], [54.06, 5.23], [55.86, 5.24], [55.87, 6.91], [54.09, 6.92],
  [54.11, 12.9], [55.87, 12.89], [55.87, 14.87], [54.1, 14.88], [54.11, 16.63], [51.87, 16.63], [51.89, 14.99],
  [45.95, 14.98], [45.94, 16.62], [43.95, 16.62], [43.93, 14.96], [38.01, 14.96], [38.01, 16.61], [37.09, 16.61],
  [2.11, 16.85], [2.08, 5.53], [-4.83, 5.56], [-5.38, 5.53], [-5.38, 1.27], [-5.15, 1.27], [-5.15, -1.3],
  [-5.38, -1.3],
];
// Alles binnen de contour tot de lage aanbouwen tussen de steunberen aan de
// noordkant.
const LOW = 6.0;
// Steunberen (pilasters) langs de zuid-, oost- en noordgevel tot +12 m.
const BUTTRESS_TOP = 12.0;
// Kerk: de westgevel op x = 4,3 m, de oostgevel op x = 54,1 m.
const WEST = 4.3;
const EAST = 54.1;
// Middenschip: muren tot de goot, zadeldak met de nok op de as.
const NAVE = { half: 6.6, eave: 27.0, ridge: 37.1 };
// Zijbeuken: vlak dak tussen het middenschip en de buitenmuren (BAG).
const AISLE = { north: 14.97, south: -15.05, top: 18.1, edge: 13.5, outer: 16.5 };
// Twee gelijke dwarsbeuken: dwars zadeldak van de noord- tot de zuidgevel.
const TRANSEPTS = [17.4, 41.05].map((x) => ({ x, half: 5.0, eave: 26.0, ridge: 33.8 }));
// Lage aanbouw in de noordwesthoek, naast de toren.
const ANNEX = { x: [2.0, WEST], y: [5.5, 17.0], top: 10.0 };
// Toren rond de oorsprong: bakstenen voet binnen de BAG-contour tot +20 m, de
// romp tot +44,5 m met een kroonlijst en balustrade die 0,3 m uitkragen, de
// zandstenen geleding, twee houten geledingen met kroonlijsten (onder 40
// graden), een balustrade, de voet met voluten, de keizerskroon, de bol en
// de naald met de windvaan.
const TOWER = {
  foot: { x: [-5.6, WEST], y: [-5.6, 5.6], top: 20.0 },
  body: { half: 4.9, top: 44.5 },
  balustrade: { half: 5.2, top: 46.2 },
  stone: { half: 4.0, top: 52.4, cornice: 4.5, corniceTop: 53.0, capTop: 53.6 },
  first: { half: 3.2, top: 61.0, cornice: 3.7, corniceTop: 61.6, capTop: 62.1, balustrade: 3.4, balustradeTop: 63.2 },
  second: { half: 2.7, top: 70.4, cornice: 3.05, corniceTop: 71.0, capTop: 71.5 },
  pedestal: { radius: 1.5, top: 74.0 },
  crown: { band: 1.8, bandAt: 74.5, bandTop: 75.3, dome: [[1.65, 76.5], [1.2, 77.6], [0.6, 78.3]] },
  ball: { apothem: 0.55, top: 80.3, tip: 81.0 },
  needle: { apothem: 0.45, top: 85.0, tip: GROUND_NAP + 85 },
};
// Prinsengracht 281 (BAG-pand 0363100012174220, 1772) tussen de toren, de
// zuidelijke zijbeuk en de Westermarkt: twee bouwlagen onder een schilddak
// met de nok langs de Prinsengracht en langs de Westermarkt (AHN-DSM binnen
// de contour, zonder de cellen tegen de toren en de kerk: goot +11 m, nok
// +15,5 m, dakhelling 53 graden) en een plat dak (+12,8 m) aan de binnenkant
// in de hoek tegen de toren en de kerk.
const HOUSE = {
  outline: [
    [4.33, -5.56], [-4.88, -5.56], [-4.91, -9.96], [-4.91, -11.46], [-4.94, -16.45], [-1.19, -16.44], [0.56, -16.44],
    [4.32, -16.44],
  ],
  eave: 11.0,
  ridge: 15.5,
  // Nok langs de Prinsengracht op x = -1,5 m (van de toren tot de hoek), nok
  // langs de Westermarkt op y = -12,9 m (van de hoek tot de kerk).
  westRidge: -1.5,
  southRidge: -12.9,
  flat: { x: [0.3, 4.33], y: [-11.2, -5.56], top: 12.8 },
};
// Lage aanbouw (BAG-pand 0363100012164998, 1990) van 1,8 m diep tegen de
// oostgevel tussen de middelste steunberen: plat dak op NAP +5,2 m (mediaan
// van het AHN-DSM binnen de contour zonder de cellen tegen de gevel; de
// luchtfoto toont een plat dak, deels glas).
const EAST_ANNEX = {
  outline: [[55.86, 5.24], [54.06, 5.23], [54.07, -4.74], [54.07, -4.94], [55.82, -4.95]],
  top: 5.2,
};
// Lage aanbouwen (BAG-panden 0363100012174224 en 0363100012174406, 1990) van
// 1,65 m diep tussen de steunberen onder de oostelijke dwarsbeuk, aan de
// noord- en zuidkant. PDOK reconstrueert ze met de gevelpunten van de
// dwarsbeuk tot NAP +16,9 m; het AHN-DSM in de buitenste cellen en de vier
// gelijke aanbouwen in de andere travees (NAP +5,0 tot +5,4 m) geven een plat
// dak op NAP +5,2 m. `inward` is de richting naar de kerkmuur (voor de las in
// de STL).
const NICHE_ANNEXES = [
  { outline: [[43.95, 16.62], [38.01, 16.61], [38.01, 14.96], [43.93, 14.96]], inward: -1 },
  { outline: [[38.08, -16.69], [44.02, -16.67], [43.99, -15.01], [38.07, -15.03]], inward: 1 },
].map((a) => ({ ...a, top: 5.2 }));
// Vensters als spitsboognissen.
const WINDOW = { depth: 0.5 };
// Maaiveld rondom (NAP +1,6 tot +1,7 m): de kade aan de Prinsengracht voor
// de toren en de straat langs de noord- en zuidkant, niet het water van de
// gracht.
const GROUND_SAMPLES = [[-8, 0], [30, 19], [30, -19]];

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
const outline = prism(OUTLINE, BASE - 1, 200);
const clip = (solid) => Manifold.intersection(outline, solid);
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const square = (h) => rect([-h, h], [-h, h]);
const circle = (c, r, n = 24) => Array.from({ length: n }, (_, k) => polar(c, r, (360 * k) / n));
// Regelmatige achthoek met de vlakken op de assen (apothema a).
const octagon = ([cx, cy], a) =>
  [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => polar([cx, cy], a / Math.cos(Math.PI / 8), deg));
// Spitsboognis in een gevel: breedte w, van z0 tot z1 (NAP), bovenkant onder 60
// graden. `at` is het midden onderaan op het gevelvlak, `normal` de richting
// naar buiten (eenheidsvector in het grondvlak); `out` is hoe ver de nis naar
// buiten doorloopt.
const niche = ([cx, cy], [nx, ny], w, z0, z1, depth, out = 1.5) => {
  const rise = (w / 2) * Math.tan(Math.PI / 3);
  const profile = [[-w / 2, NAP(z0)], [w / 2, NAP(z0)], [w / 2, NAP(z1) - rise], [0, NAP(z1)], [-w / 2, NAP(z1) - rise]];
  const pts = [];
  for (const d of [-depth, out]) {
    for (const [u, z] of profile) pts.push([cx + nx * d - ny * u, cy + ny * d + nx * u, z]);
  }
  return Manifold.hull(pts);
};
// Geleding met een kroonlijst die onder 40 graden uitkraagt: schacht met
// halve breedte `half` tot `top`, schuin naar `cornice` op `corniceTop`, dan
// recht tot `capTop`.
const stage = (s, z0) =>
  Manifold.union([
    prism(square(s.half), z0, NAP(s.capTop)),
    Manifold.hull([
      ...at(square(s.half), NAP(s.top)),
      ...at(square(s.cornice), NAP(s.corniceTop)),
      ...at(square(s.cornice), NAP(s.capTop)),
    ]),
  ]);

// ---------- opbouw: kerk ----------
const parts = [clip(box([-100, 100], [-100, 100], BASE, NAP(LOW)))];
// Steunberen: alles buiten de muren binnen de BAG-contour, behalve de lage
// aanbouwen aan de noordkant ten westen van x = 37 m.
parts.push(
  clip(box([WEST, 60], [-20, AISLE.south], BASE, NAP(BUTTRESS_TOP))),
  clip(box([EAST - 0.05, 60], [-20, 20], BASE, NAP(BUTTRESS_TOP))),
  clip(box([37.5, 60], [AISLE.north, 20], BASE, NAP(BUTTRESS_TOP))),
  clip(box(ANNEX.x, ANNEX.y, BASE, NAP(ANNEX.top))),
);
// Zijbeuken: vlak dak met een afgeronde rand naar de buitenmuur.
for (const [outer, sign] of [[AISLE.north, 1], [-AISLE.south, -1]]) {
  const profile = [[0, BASE], [0, NAP(AISLE.top)], [AISLE.edge, NAP(AISLE.top)], [outer, NAP(AISLE.outer)], [outer, BASE]];
  parts.push(clip(Manifold.hull([WEST, EAST].flatMap((x) => profile.map(([y, z]) => [x, sign * y, z])))));
}
// Middenschip.
{
  const r = rect([WEST, EAST], [-NAVE.half, NAVE.half]);
  parts.push(Manifold.hull([...at(r, BASE), ...at(r, NAP(NAVE.eave)), [WEST, 0, NAP(NAVE.ridge)], [EAST, 0, NAP(NAVE.ridge)]]));
}
// Dwarsbeuken met topgevels in de noord- en zuidgevel.
for (const t of TRANSEPTS) {
  const r = rect([t.x - t.half, t.x + t.half], [AISLE.south, AISLE.north]);
  parts.push(
    clip(Manifold.hull([...at(r, BASE), ...at(r, NAP(t.eave)), [t.x, AISLE.south, NAP(t.ridge)], [t.x, AISLE.north, NAP(t.ridge)]])),
  );
}

// Vensters als nissen: het grote venster in elke topgevel van de dwarsbeuken,
// één venster per travee in de zijbeuken en drie in de oostgevel.
const windows = [];
for (const t of TRANSEPTS) {
  windows.push(niche([t.x, AISLE.north], [0, 1], 4.0, 8.0, 24.5, WINDOW.depth));
  windows.push(niche([t.x, AISLE.south], [0, -1], 4.0, 8.0, 24.5, WINDOW.depth));
}
for (const x of [9.3, 25.2, 33.1, 49.0]) {
  windows.push(niche([x, AISLE.north], [0, 1], 3.0, 7.5, 15.5, WINDOW.depth, 2.5));
  windows.push(niche([x, AISLE.south], [0, -1], 3.0, 7.5, 15.5, WINDOW.depth, 2.5));
}
windows.push(niche([EAST, 0], [1, 0], 4.0, 8.0, 25.0, WINDOW.depth, 2.5));
for (const y of [-10, 10]) windows.push(niche([EAST, y], [1, 0], 3.0, 7.5, 15.5, WINDOW.depth, 2.5));

// ---------- opbouw: toren ----------
const T = TOWER;
const towerParts = [
  clip(box(T.foot.x, T.foot.y, BASE, NAP(T.foot.top))),
  prism(square(T.body.half), BASE, NAP(T.body.top)),
  // Kroonlijst en balustrade boven de romp: kragen 0,3 m vlak uit; die
  // onderkant laat de export de nissen behouden.
  prism(square(T.balustrade.half), NAP(T.body.top), NAP(T.balustrade.top)),
  stage(T.stone, BASE),
  stage(T.first, BASE),
  prism(square(T.first.balustrade), NAP(T.first.capTop) - 0.01, NAP(T.first.balustradeTop)),
  stage(T.second, BASE),
];
// Voet met voluten, keizerskroon, bol en naald.
{
  const C = T.crown;
  towerParts.push(
    Manifold.hull([...at(square(T.second.cornice), NAP(T.second.capTop) - 0.01), ...at(circle([0, 0], T.pedestal.radius), NAP(T.pedestal.top))]),
    Manifold.hull([
      ...at(circle([0, 0], T.pedestal.radius), NAP(T.pedestal.top) - 0.01),
      ...at(circle([0, 0], C.band), NAP(C.bandAt)),
      ...at(circle([0, 0], C.band), NAP(C.bandTop)),
      ...C.dome.flatMap(([r, z]) => at(circle([0, 0], r), NAP(z))),
    ]),
  );
  const ball = octagon([0, 0], T.ball.apothem);
  const needle = octagon([0, 0], T.needle.apothem);
  const domeTop = C.dome[C.dome.length - 1][1];
  towerParts.push(
    Manifold.hull([...at(ball, NAP(domeTop) - 0.3), ...at(ball, NAP(T.ball.top)), ...at(needle, NAP(T.ball.tip))]),
    Manifold.hull([...at(needle, NAP(T.ball.tip) - 0.3), ...at(needle, NAP(T.needle.top)), [0, 0, NAP(T.needle.tip)]]),
  );
}
let tower = Manifold.union(towerParts);
// Nissen: het portaal in de westgevel, twee rijen van twee nissen (de
// galmgaten) in de west-, noord- en zuidgevel van de romp, de grote nis met
// het wapen in elke gevel van de zandstenen geleding, en een galmgat in elke
// gevel van beide houten geledingen.
const faces = (h) => [
  [[-h, 0], [-1, 0], "w"],
  [[0, h], [0, 1], "n"],
  [[0, -h], [0, -1], "z"],
  [[h, 0], [1, 0], "o"],
];
const towerNiches = [niche([T.foot.x[0], 0], [-1, 0], 2.8, GROUND_NAP, 8.5, 0.8)];
for (const [[fx, fy], [nx, ny], side] of faces(T.body.half)) {
  if (side === "o") continue;
  for (const k of [-1.8, 1.8]) {
    const p = [fx - ny * k, fy + nx * k];
    towerNiches.push(niche(p, [nx, ny], 1.6, 24.0, 32.0, 0.5), niche(p, [nx, ny], 1.6, 35.5, 43.0, 0.5));
  }
}
for (const [[fx, fy], [nx, ny]] of faces(T.stone.half)) towerNiches.push(niche([fx, fy], [nx, ny], 3.0, 47.5, 52.0, 0.4));
for (const [[fx, fy], [nx, ny]] of faces(T.first.half)) towerNiches.push(niche([fx, fy], [nx, ny], 2.4, 56.5, 60.6, 0.4));
for (const [[fx, fy], [nx, ny]] of faces(T.second.half)) towerNiches.push(niche([fx, fy], [nx, ny], 1.8, 65.0, 70.0, 0.4));
tower = tower.subtract(Manifold.union(towerNiches));
parts.push(tower);

const church = Manifold.union(parts).subtract(Manifold.union(windows));

// ---------- opbouw: Prinsengracht 281 ----------
let house;
{
  const H = HOUSE;
  const houseOutline = prism(H.outline, BASE - 1, 200);
  const g = NAP(H.eave);
  const r = NAP(H.ridge);
  const xs = H.outline.map(([x]) => x);
  const ys = H.outline.map(([, y]) => y);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  // Beide dakvlakken even steil: de halve breedte van elke vleugel is de
  // afstand van de nok tot de buitengevel.
  const westHalf = H.westRidge - x0;
  const southHalf = H.southRidge - y0;
  house = Manifold.intersection(
    houseOutline,
    Manifold.union([
      prism(H.outline, BASE, g),
      // Vleugel langs de Prinsengracht: zadeldak tegen de toren, schild naar
      // de hoek met de Westermarkt.
      Manifold.hull([
        ...at(rect([x0 - 0.1, H.westRidge + westHalf], [y0 - 0.1, y1]), g),
        [H.westRidge, H.southRidge, r],
        [H.westRidge, y1, r],
      ]),
      // Vleugel langs de Westermarkt: schild naar de hoek, zadeldak tegen de
      // zuidelijke zijbeuk van de kerk.
      Manifold.hull([
        ...at(rect([x0 - 0.1, x1], [y0 - 0.1, H.southRidge + southHalf]), g),
        [H.westRidge, H.southRidge, r],
        [x1, H.southRidge, r],
      ]),
      box(H.flat.x, H.flat.y, BASE, NAP(H.flat.top)),
    ]),
  );
}
// ---------- opbouw: aanbouw voor de oostgevel ----------
const eastAnnex = prism(EAST_ANNEX.outline, BASE, NAP(EAST_ANNEX.top));
if (eastAnnex.status() !== "NoError") throw new Error(eastAnnex.status());
const nicheAnnexes = Manifold.union(NICHE_ANNEXES.map((a) => prism(a.outline, BASE, NAP(a.top))));
if (nicheAnnexes.status() !== "NoError") throw new Error(nicheAnnexes.status());

const nodes = [
  ["building:westerkerk", church],
  ["building:prinsengracht-281", house],
  ["building:oostaanbouw", eastAnnex],
  ["building:aanbouwen-dwarsbeuk", nicheAnnexes],
];

// ---------- controles ----------
if (church.status() !== "NoError") throw new Error(church.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // alleen de uitkragende kroonlijst boven de bakstenen romp hoort erbij.
  const mesh = church.getMesh();
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
  const allowed = NAP(TOWER.body.top).toFixed(2);
  for (const [z, area] of levels) if (z !== allowed && area > 0.01) throw new Error(`overhang op z ${z}`);
  if (!levels.has(allowed)) throw new Error("uitkraging van de kroonlijst ontbreekt");
  const bb = church.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
}
{
  // Het pand naast de toren: geen enkel vlak boven de onderkant wijst naar
  // beneden, dezelfde onderkant als de kerk.
  if (house.status() !== "NoError") throw new Error(house.status());
  const mesh = house.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    if (n[2] < -1e-6 * Math.hypot(...n)) throw new Error(`overhang in het pand op z ${Math.min(...p.map((q) => q[2])).toFixed(2)}`);
  }
  const bb = house.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant van het pand op ${bb.min[2]}`);
  if (Math.abs(bb.max[2] - NAP(HOUSE.ridge)) > 1e-6) throw new Error(`nok van het pand op ${bb.max[2]}`);
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
const glbFile = path.join(outDir, "westerkerk.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-westerkerk.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `westerkerk-1-${scale}.stl`);
// De westmuur van de zuidelijke zijbeuk staat in de BAG iets scheef (x = 4,32
// tot 4,33 m) en het middenschip begint op x = 4,3 m; zonder een las van 5 cm
// in de kerkmuur houdt de vereniging met het pand daar een paar dunne
// tunneltjes over (genus 2).
const weld = Manifold.intersection(house.translate([0.05, 0, 0]), box([WEST - 0.05, HOUSE.outline[0][0] + 0.05], [-20, 0], BASE - 1, 100));
// Idem voor de aanbouw tegen de oostgevel en de steunberen ernaast.
const eastWeld = Manifold.union([[-0.05, 0], [0, 0.05], [0, -0.05]].map(([dx, dy]) => eastAnnex.translate([dx, dy, 0])));
const nicheWelds = NICHE_ANNEXES.flatMap((a) =>
  [[0, 0.05 * a.inward]].map(([dx, dy]) => prism(a.outline, BASE, NAP(a.top)).translate([dx, dy, 0])),
);
const printSolid = Manifold.union([church, house, weld, eastAnnex, eastWeld, nicheAnnexes, ...nicheWelds]).translate([0, 0, -BASE]);
if (printSolid.genus() !== 0) throw new Error(`genus ${printSolid.genus()} in de printversie`);
const { buffer, triangles } = toStl(printSolid, `NederPrint Westerkerk Amsterdam 1:${scale} mm Z-up`);
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
  path.join(outDir, "westerkerk.json"),
  JSON.stringify(
    {
      name: "Westerkerk",
      file: "westerkerk.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +1,6 tot +1,7 m): de kade aan de
      // Prinsengracht voor de toren en de straat langs de noord- en zuidkant;
      // niet het water van de gracht.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: [
        "NL.IMBAG.Pand.0363100012164998",
        "NL.IMBAG.Pand.0363100012174220",
        "NL.IMBAG.Pand.0363100012174221",
        "NL.IMBAG.Pand.0363100012174224",
        "NL.IMBAG.Pand.0363100012174406",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (120701,34, 487525,44), in het hart van de Westertoren, op het maaiveld (NAP +1,6 m), +X langs de as van de toren naar de oostgevel (RD-richting -3,3 graden, net ten zuiden van oost) en +Y naar het noorden; de toren staat aan de -X-kant, aan de Prinsengracht, de oostgevel aan de Westermarkt. Eén node building: alles binnen de BAG-contour tot NAP +6 m (de lage aanbouwen tussen de steunberen aan de noordkant), de steunberen tot +12 m, een aanbouw naast de toren tot +10 m, de zijbeuken onder een vlak dak (+18,1 m) met vensternissen, het middenschip van 13,2 m breed onder een zadeldak (goot +27 m, nok +37,1 m), de twee gelijke dwarsbeuken van 10 m breed onder dwarse zadeldaken (goot +26 m, nok +33,8 m) met topgevels en een groot venster als nis aan de noord- en zuidkant, drie vensternissen in de oostgevel, en de Westertoren met de bakstenen voet en romp van 9,8 m tot +44,5 m met portaal en galmgaten, de kroonlijst en balustrade tot +46,2 m die 0,3 m uitkragen, de zandstenen geleding van 8 m tot +53,6 m met de nis van het wapen, de houten geledingen van 6,4 m tot +63,2 m en van 5,4 m tot +71,5 m met kroonlijsten onder 40 graden, de voet met voluten, de keizerskroon tot +78,3 m, de bol en de naald met de windvaan tot 85 m boven het maaiveld (NAP +86,6 m). Een tweede node building is het pand Prinsengracht 281 (1772) tegen de zuidgevel van de toren: een blok binnen zijn BAG-contour met een schilddak langs de Prinsengracht en de Westermarkt (goot +11 m, nok +15,5 m) en een plat dak op +12,8 m in de hoek tegen de toren en de kerk. Een derde node building is de lage aanbouw (1990) van 1,8 m diep voor de oostgevel tussen de middelste steunberen, met een plat dak op NAP +5,2 m. Een vierde node building zijn de twee lage aanbouwen (1990) tussen de steunberen onder de oostelijke dwarsbeuk aan de noord- en zuidkant, met een plat dak op NAP +5,2 m. Alles staat recht op of loopt schuin omhoog, behalve de kroonlijst boven de romp die 0,3 m uitkraagt, zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-panden 0363100012174221 (de kerk) en 0363100012174220 (Prinsengracht 281, die PDOK met de AHN-punten van de toren tot een kolom van circa NAP +67 m reconstrueert) en 0363100012164998 (de aanbouw voor de oostgevel, die PDOK met de gevelpunten tot circa NAP +28 m reconstrueert), 0363100012174224 en 0363100012174406 (de aanbouwen onder de oostelijke dwarsbeuk, door PDOK tot NAP +16,9 m gereconstrueerd). Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`westerkerk-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        naveRidgeNapM: NAVE.ridge,
        aisleRoofNapM: AISLE.top,
        transeptRidgeNapM: TRANSEPTS[0].ridge,
        towerBodyNapM: TOWER.balustrade.top,
        towerStoneNapM: TOWER.stone.capTop,
        towerFirstNapM: TOWER.first.balustradeTop,
        towerSecondNapM: TOWER.second.capTop,
        towerCrownNapM: TOWER.crown.dome[TOWER.crown.dome.length - 1][1],
        towerTipNapM: TOWER.needle.tip,
        houseEaveNapM: HOUSE.eave,
        houseRidgeNapM: HOUSE.ridge,
        houseFlatRoofNapM: HOUSE.flat.top,
        eastAnnexRoofNapM: EAST_ANNEX.top,
        transeptAnnexRoofNapM: NICHE_ANNEXES[0].top,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Westerkerk_(Amsterdam)",
        "https://nl.wikipedia.org/wiki/Westertoren_(Amsterdam)",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/4298",
        "PDOK BAG pand 0363100012174221 (contour), EPSG:28992",
        "PDOK BAG pand 0363100012174220 (Prinsengracht 281, contour), EPSG:28992",
        "PDOK BAG pand 0363100012164998 (aanbouw voor de oostgevel, contour), EPSG:28992",
        "PDOK BAG panden 0363100012174224 en 0363100012174406 (aanbouwen onder de oostelijke dwarsbeuk, contouren), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dwarsprofielen van middenschip, zijbeuken en dwarsbeuken, omhullende van de toren per hoogte, maaiveld",
        "Wikimedia Commons: foto's van de toren (WestertorenAmsterdam.jpg; .00 3014 Westerkerk (West Church) of Amsterdam.jpg; Amsterdam - Prinsengracht 281.JPG)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

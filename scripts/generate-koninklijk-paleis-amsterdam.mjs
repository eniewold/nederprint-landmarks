// Genereert een vereenvoudigd, gesloten 3D-model van het Koninklijk Paleis
// (Paleis op de Dam) in Amsterdam: het classicistische stadhuis van Jacob van
// Campen (1648-1665) als blok van 80 bij 57 m binnen de BAG-contour, met de
// hoekpaviljoens en de middenrisalieten aan de Dam en aan de Nieuwezijds
// Voorburgwal, de uitkragende kroonlijst, het rondgaande schilddak met de
// schoorstenen, het gebroken zadeldak van de Burgerzaal tussen de twee
// binnenplaatsen met de galerijen ernaast, de lessenaarsdaken rond de open
// binnenplaatsen, de frontons met het beeld van de Vrede aan de voorzijde en
// Atlas met de hemelbol aan de achterzijde, het gevelreliëf met pilasters,
// tussenlijst en vensternissen, de zeven poortbogen aan de Dam en de koepeltoren met de
// vierkante voet, de achtkantige omgang, de achtkantige trommel met
// klokkenspelbogen, de koepel, de lantaarn en de windvaan met de kogge. Alle
// maten in het script zijn meters op ware grootte. Uitvoer: een GLB in meters
// (Y omhoog, één node met de materiaalklasse in de nodenaam) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-koninklijk-paleis-amsterdam.mjs              # 1:1000 (standaard)
//   node scripts/generate-koninklijk-paleis-amsterdam.mjs --scale 2000
//
// De gevels hebben reliëf: pilasters op de gevellijn met de velden ertussen
// 0,3 m terug, een tussenlijst die 0,3 m uitspringt, per travee vijf
// vensters als blinde nissen van 0,35 m (kelderraam, en per orde een hoog
// venster en een mezzaninevenster) en de oeils-de-boeuf in de zijgevels.
//
// Printbaar op 1:1000 zonder steun: de gevels staan recht op, de daken lopen
// onder 33 tot 50 graden omhoog, elke geleding van de toren is smaller dan de
// vorige, de schoorstenen en beelden zijn minstens 1 m dik en de poortbogen en
// de bogen in de trommel zijn nissen met een spitse bovenkant van 60 graden;
// de bovenkant van de velden en de onderkant van de tussenlijst lopen onder
// 53 graden. Alleen de kroonlijst kraagt rondom 0,3 m vlak uit en de
// vensternissen hebben een vlakke bovenkant van 0,35 m diep; de controle
// onderaan staat geen andere ondervlakken toe.
//
// Assenstelsel: oorsprong op RD (121232,11, 487368,47), in het midden van de
// BAG-contour (midden in de Burgerzaal), op het maaiveld (NAP +1,8 m), Z
// omhoog. +X loopt naar de voorgevel aan de Dam (RD-richting -2,0 graden, net
// ten zuiden van oost, de richting van de BAG-gevels), +Y naar het noorden
// (de Nieuwe Kerk); de koepeltoren staat aan de +X-kant boven de voorgevel,
// de achtergevel met Atlas aan de Nieuwezijds Voorburgwal.
//
// Bronnen: BAG-pand 0363100012167579 (contour met de twee binnenplaatsen); AHN
// DSM/DTM 0,5 m (PDOK WCS) in een stelsel langs de gevels: de goot (+28,3 m)
// en de nokken (+33,7 m) van het rondgaande dak, de nok van de Burgerzaal
// (+35,8 m), de lessenaarsdaken rond de binnenplaatsen, de frontons, de
// beelden, de schoorstenen, de omhullende van de koepeltoren per hoogte (voet
// tot +36,2 m, omgang tot circa +42 m, trommel tot +50 m, koepel tot +53,4 m,
// hoogste punt +61,4 m) en het maaiveld; Wikipedia en het Rijksmonumentenregister (5941); een
// frontale foto van de voorgevel op Wikimedia Commons (Royal Palace of
// Amsterdam.jpg) en foto's van de achtergevel en de zijgevels (RCE);
// PDOK luchtfoto.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "koninklijk-paleis-amsterdam");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;

// ---------- maten (lokaal stelsel, z = NAP - 1,8 m; hoogtes hieronder in NAP) ----------
const ORIGIN = [121232.11, 487368.47];
const ANGLE = (-2.0 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const GROUND_NAP = 1.8;
const NAP = (h) => h - GROUND_NAP;
const BASE = -1;

// BAG-contour van het paleis (lokaal): het blok met de hoekpaviljoens (1,1 m
// voor de gevel) en de middenrisalieten aan de Dam (+X) en de Nieuwezijds
// Voorburgwal (-X).
const OUTLINE = [
  [27.59, 14.03], [27.58, 27.96], [28.68, 27.96], [28.69, 40.09], [16.63, 40.08], [16.63, 38.63], [12.83, 38.63],
  [11.33, 38.63], [11.33, 39.04], [-11.39, 39.03], [-11.39, 38.73], [-12.81, 38.72], [-16.68, 38.72], [-16.68, 40.08],
  [-28.76, 40.08], [-28.76, 28.03], [-27.53, 28.03], [-27.53, 12.68], [-32.54, 12.68], [-32.54, -12.69],
  [-27.54, -12.69], [-27.54, -28.03], [-28.76, -28.03], [-28.75, -40.09], [-16.68, -40.09], [-16.67, -38.73],
  [-11.38, -38.73], [-11.38, -39.03], [11.34, -39.03], [11.34, -38.62], [16.64, -38.62], [16.63, -40.08],
  [28.69, -40.08], [28.69, -28.04], [27.58, -28.03], [27.58, -12.69], [32.53, -12.69], [32.54, 12.6], [27.58, 12.6],
];
// De twee binnenplaatsen (gaten in de BAG-contour), ten noorden en ten zuiden
// van de Burgerzaal. Ze zijn open tot op het maaiveld (AHN NAP +2,0 m); de
// vloer ligt op +2,75 m in het model, na de verschuiving van -0,3 m
// (`groundOffsetMetres`) 0,45 m boven het AHN, zodat het PDOK-terrein er niet
// doorheen steekt.
const COURTS = [
  { x: [-9.88, 10.59], y: [9.04, 21.03] },
  { x: [-9.88, 10.59], y: [-21.83, -9.83] },
];
// Gevels tot de kroonlijst (NAP +27,8 tot +28,3 m) die 0,3 m uitkraagt.
const CORNICE = { bottom: 27.8, top: 28.3, out: 0.3 };
// Rondgaand schilddak: goot op de kroonlijst langs de gevel (zonder de
// risalieten en de 1,1 m uitspringende hoekpaviljoens), nokken 4,8 m (oost
// en west) en 6,1 m (noord en zuid) achter de gevel, binnengoot op de
// kroonlijsthoogte 5,7 m daarachter.
const RING = {
  outer: { x: 27.58, y: 40.08 },
  ridge: { x: 22.8, y: 33.95, top: 33.7 },
  inner: { x: 17.1, y: 28.25 },
};
// Lessenaarsdaken rond de binnenplaatsen: van +22 m bij de binnengoot naar
// +17,5 m aan de binnenplaats, 7 m breed; de vloer van de binnenplaatsen
// op +2,75 m.
const LEAN = { top: 22.0, low: 17.5, width: 7.0, floor: 2.75 };
// Burgerzaal tussen de binnenplaatsen: muren tot +30 m, gebroken zadeldak
// (steil tot +33,7 m op 6 m uit de as, dan flauw naar de nok op +35,8 m)
// langs de as van de achtergevel tot de koepeltoren.
const HALL = {
  x: [-RING.inner.x - 0.4, RING.inner.x + 0.4],
  y: [-9.83, 9.04],
  eave: 30.0,
  ridge: 35.8,
  ridgeY: -0.4,
  breaks: [[6.0, 33.7], [4.0, 34.9]],
};
// Galerijen langs de Burgerzaal aan weerszijden van de binnenplaatsen: plat
// op +28,3 m, 3,8 m breed.
const GALLERY = { width: 3.8, top: 28.3 };
// Dwarsvleugel achter de Burgerzaal naar de achtergevel: plat met afgeschuinde
// randen tot net boven de nok van het rondgaande dak (+33,75 m).
const BACK = { x: [-RING.outer.x, -RING.inner.x + 0.1], half: 8.6, eave: 30.0, top: 33.75, topHalf: 6.0 };
// Middenrisalieten met fronton: risaliet tot +28,9 m, fronton met de top op
// +33,3 m op de as, van de gevel 5,5 m het dak in.
const RISALIT = { half: 12.6, front: 32.54, back: 27.0, top: 28.9, peak: 33.3 };
// Beelden: de Vrede op het voorste fronton tot +37 m, Atlas met de hemelbol
// op het achterste tot +41,4 m, twee beelden op de hoeken van elk fronton tot
// +31,8 m.
const STATUES = {
  peace: { x: 31.8, top: 37.0 },
  atlas: { x: -31.0, top: 38.3, globe: 1.5, globeTop: 41.4 },
  corner: { x: 31.4, y: 11.9, half: 0.5, top: 31.8 },
};
// Schoorstenen op de nokken (+37,4 m) en de kroonornamenten op de
// hoekpaviljoens (+39 m).
const CHIMNEYS = {
  top: 37.4,
  ns: [-17.6, -10.5, 0, 10.6, 17.6],
  ew: [-28.7, -11.8, 11.8, 28.7],
  crownTop: 39.0,
};
// Koepeltoren boven de voorgevel, hart op x = 22,9 m: vierkante voet (11,5
// bij 11 m) tot +36,2 m, net boven de nok van de Burgerzaal, achtkantige
// onderbouw met de omgang tot +41 m, achtkantige trommel met de bogen van het
// klokkenspel tot +49,6 m, kroonlijst tot +50,4 m, koepel tot +53,2 m,
// lantaarn tot +56,2 m en de naald met de windvaan tot +61,2 m.
const TOWER = {
  c: [22.9, 0],
  foot: { x: [17.1, 28.6], y: [-5.5, 5.5], top: 36.2 },
  gallery: { apothem: 5.5, top: 41.0 },
  drum: { apothem: 4.9, top: 49.6, cornice: 4.5, corniceTop: 50.4, arch: [2.2, 42.0, 48.8] },
  dome: [[4.1, 50.4], [3.6, 51.3], [2.8, 52.1], [1.8, 52.8], [1.1, 53.2]],
  lantern: { apothem: 1.1, top: 55.6, cap: 0.6, capTop: 56.2 },
  needle: { apothem: 0.45, top: 60.4, tip: 61.2 },
};
// Poortbogen in de middenrisaliet aan de Dam: zeven bogen van 1,7 m breed
// en 0,6 m diep met een spitse bovenkant van 60 graden, midden in de zeven
// traveeën van de risaliet.
const GATES = { width: 1.7, bottom: 2.4, top: 6.4, depth: 0.6 };
// Gevelreliëf (uit de frontale foto's van de Damgevel, de achtergevel en de
// zijgevels, geschaald op de kroonlijst op +28,3 m en de BAG-gevellengtes):
// pilasters van 1 m (0,9 m in de smallere delen) staan op de gevellijn van de
// BAG-contour; de velden ertussen liggen 0,3 m terug, in twee ordes boven de
// plint (+7,6 m) gescheiden door de tussenlijst, met een schuine bovenkant
// van 53 graden. De vensters zijn blinde nissen van 0,35 m diep in die
// velden (in de plint 0,35 m in de gevel) met een vlakke bovenkant: per
// travee een kelderraam, een hoog venster en een mezzaninevenster per orde.
// De tussenlijst (+17,3 tot +18,6 m) springt 0,3 m voor de gevel uit met een
// schuine onderkant van 53 graden die doorloopt in de bovenkant van de
// onderste velden.
const RELIEF = {
  pilaster: 1.0,
  panelDepth: 0.3,
  windowDepth: 0.35,
  chamfer: 0.4,
  orders: [[7.6, 17.3], [18.6, 26.6]],
  band: { wall: 17.3, front: 17.7, top: 18.6, out: 0.3 },
  // [onderkant, bovenkant, breedte] in NAP; null = breedte uit de travee.
  rows: {
    basement: [4.4, 6.6, 1.5],
    lowerTall: [8.7, 12.0, null],
    lowerMezz: [13.9, 15.4, 1.6],
    upperTall: [19.3, 22.4, null],
    upperMezz: [24.0, 25.4, 1.6],
  },
  // Rond venster (oeil-de-boeuf) in de smalle tussenstukken van de zijgevels,
  // tussen het hoge venster en het mezzaninevenster van elke orde, met een
  // spitse bovenkant (raaklijnen onder 50 graden).
  oculus: { r: 0.6, z: [12.95, 23.2] },
  narrow: 1.0,
};
// Gevelvlakken: as van de gevellijn ("x" = vlak x = c, "y" = vlak y = c),
// richting naar buiten, bereik langs de gevel en aantal traveeën. Dam en
// achtergevel: hoekpaviljoen 3, gevel 5, risaliet 7, gevel 5, hoekpaviljoen
// 3 (23 traveeën); zijgevels: hoekpaviljoen 3, tussenstuk 1 (smal venster
// met oeil-de-boeuf), middendeel 7, tussenstuk 1, hoekpaviljoen 3.
const FACADES = [
  // Damgevel (+X).
  { axis: "x", c: 28.69, n: 1, u: [-40.08, -28.04], bays: 3 },
  { axis: "x", c: 27.58, n: 1, u: [-28.03, -12.69], bays: 5, pilaster: 0.9 },
  { axis: "x", c: 32.54, n: 1, u: [-12.69, 12.6], bays: 7, gates: true },
  { axis: "x", c: 27.58, n: 1, u: [12.6, 27.96], bays: 5, pilaster: 0.9 },
  { axis: "x", c: 28.69, n: 1, u: [27.96, 40.09], bays: 3 },
  // Achtergevel aan de Nieuwezijds Voorburgwal (-X).
  { axis: "x", c: -28.76, n: -1, u: [-40.09, -28.03], bays: 3 },
  { axis: "x", c: -27.54, n: -1, u: [-28.03, -12.69], bays: 5, pilaster: 0.9 },
  { axis: "x", c: -32.54, n: -1, u: [-12.69, 12.68], bays: 7 },
  { axis: "x", c: -27.53, n: -1, u: [12.68, 28.03], bays: 5, pilaster: 0.9 },
  { axis: "x", c: -28.76, n: -1, u: [28.03, 40.08], bays: 3 },
  // Noordgevel (+Y, naar de Nieuwe Kerk).
  { axis: "y", c: 40.08, n: 1, u: [-28.76, -16.68], bays: 3 },
  { axis: "y", c: 38.72, n: 1, u: [-16.68, -11.39], bays: 1, segment: true },
  { axis: "y", c: 39.03, n: 1, u: [-11.39, 11.33], bays: 7 },
  { axis: "y", c: 38.63, n: 1, u: [11.33, 16.63], bays: 1, segment: true },
  { axis: "y", c: 40.08, n: 1, u: [16.63, 28.69], bays: 3 },
  // Zuidgevel (-Y, aan de Paleisstraat).
  { axis: "y", c: -40.09, n: -1, u: [-28.75, -16.68], bays: 3 },
  { axis: "y", c: -38.73, n: -1, u: [-16.67, -11.38], bays: 1, segment: true },
  { axis: "y", c: -39.03, n: -1, u: [-11.38, 11.34], bays: 7 },
  { axis: "y", c: -38.62, n: -1, u: [11.34, 16.64], bays: 1, segment: true },
  { axis: "y", c: -40.08, n: -1, u: [16.64, 28.69], bays: 3 },
];
// Maaiveld rondom: de Dam voor het paleis (NAP +2,4 m), de Nieuwezijds
// Voorburgwal (+1,8 m) en de straten langs de noord- en zuidgevel (+1,8 en
// +1,9 m).
const GROUND_SAMPLES = [[38, 0], [-37, 0], [0, 44], [0, -44]];

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
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const polar = ([cx, cy], r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const rect = ([x0, x1], [y0, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const circle = (c, r, n = 32) => Array.from({ length: n }, (_, k) => polar(c, r, (360 * k) / n));
// Regelmatige achthoek met de vlakken op de assen (apothema a).
const octagon = ([cx, cy], a) =>
  [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => polar([cx, cy], a / Math.cos(Math.PI / 8), deg));
const grow = ({ x: [x0, x1], y: [y0, y1] }, d) => rect([x0 - d, x1 + d], [y0 - d, y1 + d]);
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

// ---------- opbouw: blok, kroonlijst en daken ----------
const outlineSection = new CrossSection([ccw(OUTLINE)]);
const outline = Manifold.extrude(outlineSection, 300).translate([0, 0, BASE - 1]);
const clip = (solid) => Manifold.intersection(outline, solid);
const inner = rect([-RING.inner.x, RING.inner.x], [-RING.inner.y, RING.inner.y]);
// Het blok tot de kroonlijst; binnen de binnengoot tot de lessenaarsdaken.
let body = prism(OUTLINE, BASE, NAP(CORNICE.top)).subtract(prism(inner, NAP(LEAN.top), 100));
// Lessenaarsdaken: een trechter per binnenplaats, dan de open binnenplaats
// tot de vloer.
for (const court of COURTS) {
  body = body.subtract(
    Manifold.hull([
      ...at(grow(court, 0), NAP(LEAN.low)),
      ...at(grow(court, LEAN.width), NAP(LEAN.top)),
      ...at(grow(court, LEAN.width + 2), NAP(LEAN.top) + 2),
    ]).intersect(prism(inner, BASE, 100)),
  );
  body = body.subtract(prism(grow(court, 0), NAP(LEAN.floor), 100));
}
const parts = [body];
// Kroonlijst rondom, 0,3 m buiten de gevel.
parts.push(
  Manifold.extrude(outlineSection.offset(CORNICE.out, "Miter").subtract(outlineSection.offset(-1, "Miter")), CORNICE.top - CORNICE.bottom)
    .translate([0, 0, NAP(CORNICE.bottom)]),
);
// Rondgaand schilddak: buitenschild van de goot naar de nokken, binnen de
// binnengoot weggesneden door een omgekeerde trechter onder dezelfde helling.
{
  const R = RING;
  const outer = rect([-R.outer.x, R.outer.x], [-R.outer.y, R.outer.y]);
  const ridge = rect([-R.ridge.x, R.ridge.x], [-R.ridge.y, R.ridge.y]);
  const rise = NAP(R.ridge.top) - NAP(CORNICE.top);
  const k = 3;
  const funnel = Manifold.hull([
    ...at(inner, NAP(CORNICE.top)),
    ...at(rect([-R.inner.x - k * (R.ridge.x - R.inner.x), R.inner.x + k * (R.ridge.x - R.inner.x)],
      [-R.inner.y - k * (R.ridge.y - R.inner.y), R.inner.y + k * (R.ridge.y - R.inner.y)]), NAP(CORNICE.top) + k * rise),
  ]);
  parts.push(clip(Manifold.hull([...at(outer, NAP(CORNICE.top) - 0.01), ...at(ridge, NAP(R.ridge.top))]).subtract(funnel).subtract(prism(inner, NAP(CORNICE.top) - 0.05, NAP(CORNICE.top) + 0.01))));
}
// Burgerzaal: muren tot de goot en het zadeldak met de nok op de as.
{
  const H = HALL;
  parts.push(
    Manifold.hull([
      ...at(rect(H.x, H.y), BASE),
      ...at(rect(H.x, H.y), NAP(H.eave)),
      ...H.breaks.flatMap(([d, z]) => at(rect(H.x, [H.ridgeY - d, H.ridgeY + d]), NAP(z))),
      [H.x[0], H.ridgeY, NAP(H.ridge)],
      [H.x[1], H.ridgeY, NAP(H.ridge)],
    ]),
  );
  // Galerijen tussen de Burgerzaal en de binnengoot, naast de binnenplaatsen.
  for (const court of COURTS) {
    const ys = court.y[0] > 0 ? [H.y[1] - 0.1, H.y[1] + GALLERY.width] : [H.y[0] - GALLERY.width, H.y[0] + 0.1];
    for (const xs of [[H.x[0], court.x[0]], [court.x[1], H.x[1]]]) parts.push(box(xs, ys, BASE, NAP(GALLERY.top)));
  }
}
// Dwarsvleugel naar de achtergevel.
{
  const B = BACK;
  parts.push(
    Manifold.hull([
      ...at(rect(B.x, [-B.half, B.half]), NAP(CORNICE.top) - 0.3),
      ...at(rect(B.x, [-B.half, B.half]), NAP(B.eave)),
      ...at(rect(B.x, [-B.topHalf, B.topHalf]), NAP(B.top)),
    ]),
  );
}
// Middenrisalieten met fronton aan de Dam (+X) en de achtergevel (-X).
for (const sign of [1, -1]) {
  const R = RISALIT;
  const xs = [sign * R.back, sign * R.front].sort((a, b) => a - b);
  parts.push(
    clip(prism(rect(xs, [-R.half, R.half]), BASE, NAP(R.top))),
    clip(
      Manifold.hull([
        ...at(rect(xs, [-R.half, R.half]), NAP(R.top) - 0.3),
        [xs[0], 0, NAP(R.peak)],
        [xs[1], 0, NAP(R.peak)],
      ]),
    ),
  );
}
// Beelden: de Vrede, Atlas met de hemelbol en de hoekbeelden van de frontons.
{
  const S = STATUES;
  parts.push(
    Manifold.hull([...at(rect([S.peace.x - 0.7, S.peace.x + 0.7], [-0.7, 0.7]), NAP(32.6)), ...at(rect([S.peace.x - 0.5, S.peace.x + 0.5], [-0.5, 0.5]), NAP(S.peace.top))]),
  );
  const g = S.atlas.globe;
  parts.push(
    Manifold.hull([
      ...at(rect([S.atlas.x - 0.8, S.atlas.x + 0.8], [-0.8, 0.8]), NAP(32.6)),
      ...at(rect([S.atlas.x - 0.6, S.atlas.x + 0.6], [-0.6, 0.6]), NAP(S.atlas.top)),
    ]),
    Manifold.hull([
      ...at(rect([S.atlas.x - 0.6, S.atlas.x + 0.6], [-0.6, 0.6]), NAP(S.atlas.top) - 0.01),
      ...Manifold.sphere(g, 32).translate([S.atlas.x, 0, NAP(S.atlas.globeTop) - g]).getMesh().vertProperties.reduce((acc, value, i, all) => {
        if (i % 3 === 0) acc.push([all[i], all[i + 1], all[i + 2]]);
        return acc;
      }, []),
    ]),
  );
  for (const sx of [1, -1]) {
    for (const sy of [1, -1]) {
      const [cx, cy] = [sx * S.corner.x, sy * S.corner.y];
      parts.push(box([cx - S.corner.half, cx + S.corner.half], [cy - S.corner.half, cy + S.corner.half], NAP(RISALIT.top) - 0.05, NAP(S.corner.top)));
    }
  }
}
// Schoorstenen op de nokken en de kroonornamenten op de hoeken.
{
  const C = CHIMNEYS;
  const R = RING.ridge;
  const z0 = NAP(R.top) - 2.2;
  for (const x of C.ns) for (const y of [-R.y, R.y]) parts.push(box([x - 0.9, x + 0.9], [y - 0.7, y + 0.7], z0, NAP(C.top)));
  for (const y of C.ew) for (const x of [-R.x, R.x]) parts.push(box([x - 0.7, x + 0.7], [y - 0.9, y + 0.9], z0, NAP(C.top)));
  for (const x of [-R.x, R.x]) for (const y of [-R.y, R.y]) parts.push(box([x - 0.8, x + 0.8], [y - 0.8, y + 0.8], z0, NAP(C.crownTop)));
}

// ---------- opbouw: koepeltoren ----------
const T = TOWER;
const towerParts = [
  box(T.foot.x, T.foot.y, BASE, NAP(T.foot.top)),
  prism(octagon(T.c, T.gallery.apothem), BASE, NAP(T.gallery.top)),
  prism(octagon(T.c, T.drum.apothem), BASE, NAP(T.drum.top)),
  Manifold.hull([...at(octagon(T.c, T.drum.apothem), NAP(T.drum.top) - 0.01), ...at(octagon(T.c, T.drum.cornice), NAP(T.drum.corniceTop))]),
  Manifold.hull(T.dome.flatMap(([r, z], i) => at(circle(T.c, r), NAP(z) - (i === 0 ? 0.01 : 0)))),
  Manifold.hull([
    ...at(octagon(T.c, T.lantern.apothem), NAP(T.dome[T.dome.length - 1][1]) - 0.3),
    ...at(octagon(T.c, T.lantern.apothem), NAP(T.lantern.top)),
    ...at(octagon(T.c, T.lantern.cap), NAP(T.lantern.capTop)),
  ]),
  Manifold.hull([
    ...at(octagon(T.c, T.needle.apothem), NAP(T.lantern.capTop) - 0.3),
    ...at(octagon(T.c, T.needle.apothem), NAP(T.needle.top)),
    [T.c[0], T.c[1], NAP(T.needle.tip)],
  ]),
];
// Bogen van het klokkenspel in de acht zijden van de trommel.
const towerNiches = [];
for (let k = 0; k < 8; k++) {
  const deg = 45 * k;
  const n = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
  towerNiches.push(niche(polar(T.c, T.drum.apothem, deg), n, ...T.drum.arch, 0.4));
}
parts.push(Manifold.union(towerParts).subtract(Manifold.union(towerNiches)));

// ---------- gevelreliëf ----------
// Tussenlijst rondom: per gevelzijde een prisma met het profiel (afstand voor
// de gevel, hoogte), op de hoeken in verstek.
{
  const P = ccw(OUTLINE);
  const n = P.length;
  const normal = (i) => {
    const [x0, y0] = P[i];
    const [x1, y1] = P[(i + 1) % n];
    const l = Math.hypot(x1 - x0, y1 - y0);
    return [(y1 - y0) / l, -(x1 - x0) / l];
  };
  const miter = P.map((_, i) => {
    const a = normal((i - 1 + n) % n);
    const b = normal(i);
    const s = 1 + a[0] * b[0] + a[1] * b[1];
    return [(a[0] + b[0]) / s, (a[1] + b[1]) / s];
  });
  const B = RELIEF.band;
  const profile = [[-0.5, NAP(B.wall)], [0, NAP(B.wall)], [B.out, NAP(B.front)], [B.out, NAP(B.top)], [-0.5, NAP(B.top)]];
  for (let i = 0; i < n; i++) {
    const pts = [];
    for (const k of [i, (i + 1) % n]) {
      for (const [d, z] of profile) pts.push([P[k][0] + miter[k][0] * d, P[k][1] + miter[k][1] * d, z]);
    }
    parts.push(Manifold.hull(pts));
  }
}
// Uitsparingen: velden tussen de pilasters, vensternissen, ronde vensters en
// de poortbogen. Elke uitsparing is de omhullende van een profiel in het
// gevelvlak (u langs de gevel, z) tussen `-depth` achter de gevellijn en
// 1,5 m ervoor.
const cutters = [];
// Vlakke bovenkanten van de vensternissen per hoogte (NAP): oppervlak
// hooguit breedte maal 0,4 m, voor de controle hieronder.
const nicheTops = new Map();
const facadePoint = (F, u, d, z) => (F.axis === "x" ? [F.c + F.n * d, u, z] : [u, F.c + F.n * d, z]);
const cut = (F, profile, depth) => {
  const pts = [];
  for (const d of [-depth, 1.5]) for (const [u, z] of profile) pts.push(facadePoint(F, u, d, z));
  return Manifold.hull(pts);
};
const rectProfile = (u0, u1, z0, z1) => [[u0, NAP(z0)], [u1, NAP(z0)], [u1, NAP(z1)], [u0, NAP(z1)]];
const windowNiche = (F, uc, w, [z0, z1], inPanel) => {
  const depth = (inPanel ? RELIEF.panelDepth : 0) + RELIEF.windowDepth;
  cutters.push(cut(F, rectProfile(uc - w / 2, uc + w / 2, z0, z1), depth));
  nicheTops.set(z1, (nicheTops.get(z1) ?? 0) + w * 0.4);
};
// Rond venster met een spitse bovenkant: onderste deel van de cirkel tot 40
// graden boven het midden, dan de raaklijnen naar de top.
const oculusNiche = (F, uc, zc) => {
  const { r } = RELIEF.oculus;
  const profile = [];
  for (let deg = -180; deg <= 0; deg += 15) profile.push([uc + r * Math.cos((deg * Math.PI) / 180), NAP(zc) + r * Math.sin((deg * Math.PI) / 180)]);
  for (const deg of [40, 140]) profile.push([uc + r * Math.cos((deg * Math.PI) / 180), NAP(zc) + r * Math.sin((deg * Math.PI) / 180)]);
  profile.push([uc, NAP(zc) + r / Math.sin((40 * Math.PI) / 180)]);
  cutters.push(cut(F, profile, RELIEF.panelDepth + RELIEF.windowDepth));
};
const counts = {};
for (const F of FACADES) {
  const w = F.pilaster ?? (F.segment ? 0.9 : RELIEF.pilaster);
  const [a, b] = F.u;
  const pitch = (b - a - w) / F.bays;
  const side = F.axis === "x" ? (F.n > 0 ? "dam" : "achter") : F.n > 0 ? "noord" : "zuid";
  counts[side] ??= { traveeen: 0, nissen: 0, poorten: 0, ronde: 0 };
  for (let k = 0; k < F.bays; k++) {
    const u0 = a + w + k * pitch;
    const u1 = a + (k + 1) * pitch;
    const uc = (u0 + u1) / 2;
    counts[side].traveeen++;
    // Velden in beide ordes, met een schuine bovenkant.
    for (const [z0, z1] of RELIEF.orders) {
      const top = NAP(z1);
      // De schuine bovenkant loopt 5 cm voor de gevellijn door, zodat er bij
      // een gevel die een centimeter van de BAG-lijn afwijkt geen vlak
      // reepje overblijft; daar ligt de tussenlijst nog boven.
      const section = [[-RELIEF.panelDepth, NAP(z0)], [1.5, NAP(z0)], [1.5, top + 0.05], [0.05, top + 0.05], [-RELIEF.panelDepth, top - RELIEF.chamfer]];
      cutters.push(Manifold.hull(section.flatMap(([d, z]) => [facadePoint(F, u0, d, z), facadePoint(F, u1, d, z)])));
    }
    const R = RELIEF.rows;
    if (F.segment) {
      // Smal venster aan de kant van het hoekpaviljoen, rond venster aan de
      // kant van het middendeel.
      const outward = Math.sign(uc) || 1;
      const un = uc + outward * (u1 - u0 - 2 * 0.3 - RELIEF.narrow) / 2;
      const uo = uc - outward * (u1 - u0 - 2 * 0.3 - 2 * RELIEF.oculus.r) / 2;
      windowNiche(F, un, RELIEF.narrow, R.basement, false);
      for (const row of [R.lowerTall, R.lowerMezz, R.upperTall, R.upperMezz]) windowNiche(F, un, RELIEF.narrow, row, true);
      for (const zc of RELIEF.oculus.z) oculusNiche(F, uo, zc);
      counts[side].nissen += 5;
      counts[side].ronde += 2;
      continue;
    }
    const wide = Math.min(1.7, u1 - u0 - 0.4);
    if (F.gates) {
      cutters.push(niche(facadePoint(F, uc, 0, 0).slice(0, 2), F.axis === "x" ? [F.n, 0] : [0, F.n], GATES.width, GATES.bottom, GATES.top, GATES.depth));
      counts[side].poorten++;
    } else {
      windowNiche(F, uc, Math.min(R.basement[2], wide), R.basement, false);
      counts[side].nissen++;
    }
    for (const row of [R.lowerTall, R.lowerMezz, R.upperTall, R.upperMezz]) {
      windowNiche(F, uc, Math.min(row[2] ?? wide, wide), row, true);
      counts[side].nissen++;
    }
  }
}
console.log("gevelreliëf per gevel:", counts);

const palace = Manifold.union(parts).subtract(Manifold.union(cutters));
const nodes = [["building:paleis", palace]];

// ---------- controles ----------
if (palace.status() !== "NoError") throw new Error(palace.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // alleen de uitkragende kroonlijst hoort erbij.
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
  const total = [...levels.values()].reduce((sum, area) => sum + area, 0);
  console.log(`ondervlakken totaal: ${total.toFixed(1)} m2`);
  // Toegestaan: de kroonlijst en de vlakke bovenkanten van de vensternissen
  // (hooguit breedte maal 0,4 m per nis; de nissen zijn 0,35 m diep).
  const allowed = NAP(CORNICE.bottom).toFixed(2);
  const tops = new Map([...nicheTops].map(([z, area]) => [NAP(z).toFixed(2), area]));
  for (const [z, area] of levels) {
    if (z === allowed || area <= 0.01) continue;
    if (!tops.has(z)) throw new Error(`overhang op z ${z}`);
    if (area > tops.get(z) + 0.05) throw new Error(`nisbovenkanten op z ${z}: ${area.toFixed(2)} > ${tops.get(z).toFixed(2)} m2`);
  }
  if (!levels.has(allowed)) throw new Error("uitkraging van de kroonlijst ontbreekt");
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
const glbFile = path.join(outDir, "koninklijk-paleis-amsterdam.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-koninklijk-paleis-amsterdam.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `koninklijk-paleis-amsterdam-1-${scale}.stl`);
const printSolid = palace.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Koninklijk Paleis Amsterdam 1:${scale} mm Z-up`);
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
  path.join(outDir, "koninklijk-paleis-amsterdam.json"),
  JSON.stringify(
    {
      name: "Koninklijk Paleis",
      file: "koninklijk-paleis-amsterdam.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Op het maaiveld rondom (NAP +1,8 tot +2,4 m): de Dam voor het
      // paleis, de Nieuwezijds Voorburgwal en de straten langs de noord- en
      // zuidgevel.
      groundSamplePoints: GROUND_SAMPLES,
      replacesBuildings: ["NL.IMBAG.Pand.0363100012167579"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (121232,11, 487368,47), in het midden van de BAG-contour (midden in de Burgerzaal), op het maaiveld (NAP +1,8 m), +X naar de voorgevel aan de Dam (RD-richting -2,0 graden, net ten zuiden van oost) en +Y naar het noorden; de koepeltoren staat aan de +X-kant boven de voorgevel, de achtergevel met Atlas aan de Nieuwezijds Voorburgwal. Eén node building: het blok van 80 bij 57 m binnen de BAG-contour met de hoekpaviljoens en de middenrisalieten tot de kroonlijst (NAP +28,3 m) die 0,3 m uitkraagt, het rondgaande schilddak met de nokken op +33,7 m, schoorstenen tot +37,4 m en kroonornamenten op de hoeken tot +39 m, het gebroken zadeldak van de Burgerzaal (goot +30 m, knik +33,7 m, nok +35,8 m) met de galerijen ernaast tot +28,3 m, de dwarsvleugel naar de achtergevel tot +33,75 m, de lessenaarsdaken (van +22 m naar +17,5 m) rond de twee open binnenplaatsen (vloer op +2,75 m), de frontons op beide risalieten (top +33,3 m) met de Vrede tot +37 m aan de Dam, Atlas met de hemelbol tot +41,4 m aan de achterzijde en de hoekbeelden, gevelreliëf rondom (pilasters op de gevellijn met de velden ertussen 0,3 m terug, de tussenlijst op +17,3 tot +18,6 m die 0,3 m uitspringt, per travee een kelderraam en per orde een hoog venster en een mezzaninevenster als blinde nis van 0,35 m in de velden, 23 traveeën aan de Dam en de achtergevel, 15 aan de zijgevels met oeils-de-boeuf in de tussenstukken) en zeven spitse poortbogen van 0,6 m diep in de risaliet aan de Dam, en de koepeltoren met de vierkante voet tot +36,2 m, de achtkantige omgang tot +41 m, de achtkantige trommel met de bogen van het klokkenspel tot +50,4 m, de koepel tot +53,2 m, de lantaarn tot +56,2 m en de naald met de windvaan tot NAP +61,2 m. Alles staat recht op of loopt schuin omhoog, behalve de kroonlijst die rondom 0,3 m uitkraagt en de vlakke bovenkanten van de vensternissen (0,35 m), zodat het model op 1:1000 zonder steun print. Vervangt de PDOK-reconstructie van BAG-pand 0363100012167579. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [`koninklijk-paleis-amsterdam-1-${scale}.stl`],
      realWorld: {
        lengthM: +(bb.max[0] - bb.min[0]).toFixed(2),
        widthM: +(bb.max[1] - bb.min[1]).toFixed(2),
        corniceNapM: CORNICE.top,
        roofRidgeNapM: RING.ridge.top,
        hallRidgeNapM: HALL.ridge,
        pedimentNapM: RISALIT.peak,
        atlasNapM: STATUES.atlas.globeTop,
        towerFootNapM: TOWER.foot.top,
        towerGalleryNapM: TOWER.gallery.top,
        towerDrumNapM: TOWER.drum.corniceTop,
        domeNapM: TOWER.dome[TOWER.dome.length - 1][1],
        towerTipNapM: TOWER.needle.tip,
        groundNapM: GROUND_NAP,
        intermediateCorniceNapM: [RELIEF.band.wall, RELIEF.band.top],
        windowNicheDepthM: RELIEF.windowDepth,
        panelRecessM: RELIEF.panelDepth,
        baysDamFacade: 23,
        baysSideFacade: 15,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Paleis_op_de_Dam",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/5941",
        "PDOK BAG pand 0363100012167579 (contour met de twee binnenplaatsen), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: goot en nokken van de daken, frontons, beelden, schoorstenen, omhullende van de koepeltoren per hoogte, maaiveld",
        "Wikimedia Commons: frontale foto van de voorgevel (Royal Palace of Amsterdam.jpg)",
        "Wikimedia Commons: achtergevel (Overzicht Koninklijk Paleis Amsterdam, zijde Nieuwezijds Voorburgwal - Amsterdam - 20528557 - RCE.jpg) en zijgevels (Voor- en zijgevel - Amsterdam - 20011607 - RCE.jpg, Zijgevel - Amsterdam - 20011608 - RCE.jpg)",
        "PDOK luchtfoto (Actueel_orthoHR)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

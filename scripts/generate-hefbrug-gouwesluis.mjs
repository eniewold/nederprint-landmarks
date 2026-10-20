// Genereert een vereenvoudigd, gesloten 3D-model van de Hefbrug Gouwesluis in
// Alphen aan den Rijn (rijksmonument 516141): de geklonken stalen hefbrug uit
// 1937-1938 van de firma Kloos en Zn. (Kinderdijk) over de Gouwe bij de
// buurtschap Gouwsluis, met de weg Goudse Schouw (vroeger de rijksweg Leiden -
// Bodegraven). Twee konisch toelopende heftorens van open geklonken vakwerk
// staan op betonnen landhoofden; daartussen het val (het hefdeel, hier in de
// laagste, gesloten stand) met twee vakwerkhoofdliggers en een rijvloer, en op
// het oostelijke landhoofd aan de noordkant het veelhoekige brugwachtershuisje
// onder een koperen dak. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam: de constructie en de wegdelen met
// BGT-attributen) als catalogusbron voor de export en de kaart, plus een
// binaire STL in millimeters op 1:<schaal> met printvormen en een printvoet.
// Het model is 55 m lang en 43 m hoog en past op 1:1000 in 56 × 19 × 44 mm.
//
//   node scripts/generate-hefbrug-gouwesluis.mjs              # 1:1000 (standaard)
//   node scripts/generate-hefbrug-gouwesluis.mjs --scale 500
//
// Assenstelsel: oorsprong in het midden van het BGT-brugdek (RD 106134,89,
// 459048,07), op het water van de Gouwe zoals het PDOK-terrein het legt
// (43,00 m ellipsoïdisch; het PDOK-terrein ligt hier 43,39 m boven het AHN, dus
// NAP -0,39 m), Z omhoog. +X loopt langs de weg naar het oostzuidoosten (de
// oostelijke oever met het brugwachtershuisje, RD-richting -17,08 graden vanaf
// het oosten), +Y naar het noordnoordoosten (de keersluis en de Oude Rijn). De
// as van de constructie (de hoofdliggers en de torens) ligt 0,25 m ten noorden
// van het midden van het BGT-dek.
//
// Bronnen: Rijksmonumentenregister 516141 (opbouw: konische heftorens van open
// vakwerk, het val met twee vakwerkhoofdliggers en een bovenwindverband,
// betonnen ballastblokken die via kabelwielen boven in de torens aan het val
// hangen, doorvaartwijdte 25 m, breedte tussen de leuningen 15 m,
// doorvaarthoogte 4,5 m gesloten en 35 m open, betonnen landhoofden, het
// veelhoekige brugwachtershuisje met koperen dak aan de noordkant op de
// oostelijke oever); Wikipedia (rijweg 8,5 m, fietspad 2,5 m, voetpad 2,0 m,
// hoogste punt 37 m); PDOK BGT (overbruggingsdeel: dek en landhoofden;
// wegdeel: rijbaan en fietspaden op het dek en de wegdelen op de landhoofden;
// de spleten tussen de wegdelen op het dek geven de hoofdliggers); BAG-pand
// 0484100000003746 (brugwachtershuisje, 1938); AHN DSM 0,5 m (PDOK WCS) voor
// de hoogte van het wegdek (NAP +4,77 m), de bovenrand van de hoofdliggers
// (NAP +9,1 m), de torens (top NAP +43,0 m, voet 10,5 m en top 3,1 m breed langs
// de weg, 13,5 m breed dwars op de weg) en het dak van het brugwachtershuisje
// (NAP +8,9 m); PDOK-luchtfoto (plattegrond, windverband) en Wikimedia
// Commons-foto's (vakwerkpatroon van het val en de torens, kabelwielen,
// ballastblokken, portaal, brugwachtershuisje).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const SLUG = "hefbrug-gouwesluis";
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), SLUG);
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const rect = (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => prism(rect(x0, x1, y0, y1), z0, z1);
// Doorsnede in het XZ-vlak (CrossSection of polygonen), uitgetrokken langs Y
// van y0 tot y1.
const profileY = (section, y0, y1) =>
  Manifold.extrude(section, y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Staaf van p naar q met breedte w als polygoon in het vlak.
function bar([x0, y0], [x1, y1], w) {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const nx = (-(y1 - y0) / len) * (w / 2);
  const ny = ((x1 - x0) / len) * (w / 2);
  return ccw([[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]]);
}
// Vakwerk als vlak: de vereniging van de staven, bijgesneden op de omtrek.
const frame = (bars, outline) => CrossSection.union(bars.map((p) => new CrossSection([p]))).intersect(new CrossSection([ccw(outline)]));
// Openingen van een vakwerk (omtrek min staven), voor de blinde nissen van de
// printversie; alleen openingen van minstens 0,5 m².
const openings = (bars, outline) =>
  new CrossSection([ccw(outline)])
    .subtract(CrossSection.union(bars.map((p) => new CrossSection([p]))))
    .toPolygons()
    .filter((p) => Math.abs(new CrossSection([p]).area()) >= 0.5);
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
  return solid;
}
const interp = (table, x) => {
  if (x <= table[0][0]) return table[0][1];
  for (let i = 0; i + 1 < table.length; i++) {
    const [x0, v0] = table[i];
    const [x1, v1] = table[i + 1];
    if (x <= x1) return v0 + ((v1 - v0) * (x - x0)) / (x1 - x0);
  }
  return table[table.length - 1][1];
};

// ---------- hoogtes ----------
// Het PDOK-terrein legt de Gouwe hier op 43,00 m ellipsoïdisch en ligt op het
// land 43,39 m boven het AHN (mediaan over 10 000 hoekpunten), dus het water
// van het model (z = 0) ligt op NAP -0,39 m (het boezempeil van Rijnland is
// NAP -0,61 m; de doorvaarthoogte hieronder rekent daarmee).
const WATER_NAP = -0.39;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder het water
const GROUND_OFFSET = 0;
const GROUND_HEIGHT = 43.0; // PDOK-water op de maaiveldpunten (ellipsoïdisch)

// Wegdek in NAP (AHN DSM, 30e percentiel per 2 m langs de as, zodat auto's en
// staven wegvallen): de rijbaan tussen de hoofdliggers en op de landhoofden,
// en de fiets- en voetpaden erbuiten. Tussen de torens is het wegdek vlak; de
// waarden onder de torens zijn geïnterpoleerd.
const ROAD_NAP = [
  [-28.0, 4.73],
  [-13.5, 4.76],
  [0, 4.77],
  [13.5, 4.76],
  [22.0, 4.69],
  [28.0, 4.65],
];
const WALK_NAP = [
  [-28.0, 4.7],
  [-13.5, 4.83],
  [-12.0, 4.85],
  [12.0, 4.85],
  [13.5, 4.83],
  [28.0, 4.71],
];
const roadZ = (x) => Z(interp(ROAD_NAP, x));
const walkZ = (x) => Z(interp(WALK_NAP, x));

// ---------- indeling (BGT, lokale coördinaten) ----------
// Het BGT-dek loopt van x = -13,5 tot 13,5 tussen de waterkanten van de
// landhoofden en van y = -7,76 tot 7,76 (15,5 m: register 15 m tussen de
// leuningen). De landhoofden lopen tot x = ±27,5 (BGT).
const DECK_X = 13.5;
const ABUT_X = 27.5;
const EDGE_S = -7.78;
const EDGE_N = 7.72;
// De hoofdliggers staan in de spleten tussen de BGT-wegdelen op het dek
// (y = -4,88 tot -4,58 en 5,09 tot 5,42): hartlijnen op y = -4,73 en 5,25,
// 10 m uit elkaar. Zuid ligt het fietspad (2,55 m), noord het voetpad
// (2,05 m; register en Wikipedia: fietspad 2,5 m, voetpad 2,0 m).
const TRUSS_Y = [-4.73, 5.25];
const TRUSS_HALF = 0.45;
const AXIS_Y = (TRUSS_Y[0] + TRUSS_Y[1]) / 2; // 0,26
// Onderkant van het val: doorvaarthoogte 4,5 m gesloten (register) boven het
// boezempeil NAP -0,61 m.
const DECK_BOTTOM = Z(3.89);

// Stations langs X: om de 1,5 m plus de knikpunten.
function stationsX(x0, x1, step = 1.5) {
  const set = new Set([x0, x1]);
  for (let x = Math.ceil(x0 / step) * step; x < x1; x += step) set.add(+x.toFixed(3));
  for (const t of [ROAD_NAP, WALK_NAP]) for (const [x] of t) if (x > x0 && x < x1) set.add(x);
  return [...set].filter((x) => x >= x0 && x <= x1).sort((a, b) => a - b);
}
// Blok tussen y0 en y1 van z0 (vast of functie van x) tot top(x).
const slab = (x0, x1, y0, y1, z0, top) =>
  loftX(
    stationsX(x0, x1).map((x) => {
      const zb = typeof z0 === "function" ? z0(x) : z0;
      return { x, section: [[y0, zb], [y1, zb], [y1, top(x)], [y0, top(x)]] };
    }),
  );

// ---------- het val (hefdeel, gesloten stand) ----------
// Rijvloer tussen de hoofdliggers tot de rijbaan, fiets- en voetpad buiten de
// liggers tot hun eigen hoogte; alles van de onderkant van het val.
const DECK_ZONES = {
  south: [EDGE_S, TRUSS_Y[0] - TRUSS_HALF + 0.01],
  centre: [TRUSS_Y[0] + TRUSS_HALF - 0.01, TRUSS_Y[1] - TRUSS_HALF + 0.01],
  north: [TRUSS_Y[1] + TRUSS_HALF - 0.01, EDGE_N + 0.04],
};
const deck = union([
  slab(-DECK_X, DECK_X, DECK_ZONES.south[0], DECK_ZONES.south[1], DECK_BOTTOM, walkZ),
  slab(-DECK_X, DECK_X, DECK_ZONES.centre[0], DECK_ZONES.centre[1], DECK_BOTTOM, roadZ),
  slab(-DECK_X, DECK_X, DECK_ZONES.north[0], DECK_ZONES.north[1], DECK_BOTTOM, walkZ),
]);

// Hoofdliggers: evenwijdige randen met de bovenkant op NAP +9,10 m (AHN 8,8 tot
// 9,2 m), 29,2 m lang (de einden liggen in de uitsparingen van de landhoofden,
// BGT x = ±13,5 tot ±15,8), eindstijlen op x = ±14,15 en daartussen een
// Warren-vakwerk met stijlen in elke knoop (foto's): onderknopen op ±13,8 en
// ±4,6, bovenknopen op 0 en ±9,2, zes diagonalen onder circa 39 graden. Staven
// van 0,9 m (de echte staven zijn circa 0,5 m), de onderrand loopt als
// plaatligger tot de onderkant van het val.
const TRUSS = { x: 14.6, endPost: 14.15, top: Z(9.1), bar: 0.9 };
const TRUSS_ZB = Z(4.95); // hartlijn onderrand (bovenkant NAP +5,40 m)
const TRUSS_ZT = TRUSS.top - TRUSS.bar / 2; // hartlijn bovenrand
const BOTTOM_NODES = [-13.8, -4.6, 4.6, 13.8];
const TOP_NODES = [-9.2, 0, 9.2];
const trussOutline = rect(-TRUSS.x, TRUSS.x, DECK_BOTTOM, TRUSS.top);
const trussBars = [
  rect(-TRUSS.x, TRUSS.x, DECK_BOTTOM, TRUSS_ZB + TRUSS.bar / 2),
  rect(-TRUSS.x, TRUSS.x, TRUSS_ZT - TRUSS.bar / 2, TRUSS.top),
  ...[-TRUSS.endPost, ...BOTTOM_NODES.slice(1, 3), ...TOP_NODES, TRUSS.endPost].map((x) =>
    rect(x - TRUSS.bar / 2, x + TRUSS.bar / 2, DECK_BOTTOM, TRUSS.top),
  ),
  ...[
    [-13.8, -9.2],
    [-4.6, -9.2],
    [-4.6, 0],
    [4.6, 0],
    [4.6, 9.2],
    [13.8, 9.2],
  ].map(([xb, xt]) => bar([xb, TRUSS_ZB], [xt, TRUSS_ZT], TRUSS.bar)),
];
const trussFrame = frame(trussBars, trussOutline);
const trussHoles = openings(trussBars, trussOutline);
const trusses = TRUSS_Y.map((y) => profileY(trussFrame, y - TRUSS_HALF, y + TRUSS_HALF));
// Eindportalen tussen de liggers boven de eindstijlen (hier hangt het val aan
// de kabels), 0,9 × 0,9 m.
const portals = [-TRUSS.endPost, TRUSS.endPost].map((x) =>
  box(x - 0.45, x + 0.45, TRUSS_Y[0], TRUSS_Y[1], TRUSS.top - 0.9, TRUSS.top),
);

// ---------- landhoofden ----------
// Betonnen landhoofden van de waterkant (x = ±13,5) tot x = ±27,5 over de
// hele breedte van het dek (BGT), van onder het water tot het wegdek: het
// PDOK-terrein zakt hier tot op het water weg, want het AHN-maaiveld kent het
// landhoofd niet. De rijbaanzone ligt tussen y = -4,2 en 4,6, de paden erbuiten
// op hun eigen hoogte.
const ABUT_ZONES = { south: [EDGE_S, -4.2], centre: [-4.2, 4.6], north: [4.6, EDGE_N] };
function abutment(x0, x1) {
  return union([
    slab(x0, x1, ABUT_ZONES.south[0], ABUT_ZONES.south[1] + 0.005, BASE, walkZ),
    slab(x0, x1, ABUT_ZONES.centre[0], ABUT_ZONES.centre[1], BASE, roadZ),
    slab(x0, x1, ABUT_ZONES.north[0] - 0.005, ABUT_ZONES.north[1], BASE, walkZ),
  ]);
}
const abutments = [abutment(-ABUT_X, -DECK_X + 0.01), abutment(DECK_X - 0.01, ABUT_X)];

// ---------- heftorens (oostelijke toren, de westelijke is het spiegelbeeld) ----------
// Elke toren heeft twee zijvlakken van open vakwerk, aan weerszijden van de
// weg (AHN: van y = -6,5 tot 7,0), elk met een verticale binnenstijl aan de
// kant van het val (x = 12,9 tot 13,8; AHN-binnenkant 12,5 tot 12,9) en een
// schuine buitenstijl (AHN: buitenkant van x = 23,4 bij het wegdek tot 16,0
// onder het topplatform), acht velden van 4,46 m met regels en kruisen.
// Staven 0,9 m, zijvlakken 0,9 m dik. Aan de buitenkant (het schuine vlak
// boven de weg) een portaal op 4,5 m boven het wegdek en daarboven regels met
// kruisen over twee velden; aan de kant van het val is de toren open tot onder
// het topplatform (daar beweegt het val).
const TOWER = {
  inner: [12.9, 13.8],
  sides: [
    [-6.5, -5.6],
    [6.1, 7.0],
  ],
  footNap: 4.3,
  topNap: 40.5, // onderkant topplatform
  outerFoot: 23.4, // buitenkant schuine stijl op NAP +4,3 m
  outerTop: 16.0, // idem onder het topplatform
  bar: 0.9,
  panels: 8,
};
const towerZ0 = Z(TOWER.footNap);
const towerZ1 = Z(TOWER.topNap);
const roadAtTower = Z(4.8);
const outerAt = (z) => TOWER.outerFoot + ((TOWER.outerTop - TOWER.outerFoot) * (z - towerZ0)) / (towerZ1 - towerZ0);
const levels = Array.from({ length: TOWER.panels + 1 }, (_, k) => roadAtTower + (k * (towerZ1 - roadAtTower)) / TOWER.panels);
const innerC = (TOWER.inner[0] + TOWER.inner[1]) / 2;
const outerC = (z) => outerAt(z) - TOWER.bar / 2;
// Zijvlak in (x, z).
const sideOutline = [
  [TOWER.inner[0], towerZ0],
  [outerAt(towerZ0), towerZ0],
  [outerAt(towerZ1), towerZ1],
  [TOWER.inner[0], towerZ1],
];
const sideBars = [
  rect(TOWER.inner[0], TOWER.inner[1], towerZ0, towerZ1),
  [
    [outerAt(towerZ0) - TOWER.bar, towerZ0],
    [outerAt(towerZ0), towerZ0],
    [outerAt(towerZ1), towerZ1],
    [outerAt(towerZ1) - TOWER.bar, towerZ1],
  ],
  // regels; de onderste is de voet op het landhoofd, de bovenste ligt onder het
  // topplatform
  rect(TOWER.inner[0], outerAt(towerZ0), towerZ0, roadAtTower + TOWER.bar / 2),
  ...levels.slice(1, -1).map((z) => bar([innerC, z], [outerC(z), z], TOWER.bar)),
  rect(TOWER.inner[0], outerAt(towerZ1 - TOWER.bar), towerZ1 - TOWER.bar, towerZ1),
  // kruisen per veld
  ...levels.slice(0, -1).flatMap((z, k) => {
    const z1 = levels[k + 1];
    return [bar([innerC, z], [outerC(z1), z1], TOWER.bar), bar([outerC(z), z], [innerC, z1], TOWER.bar)];
  }),
];
const sideFrame = frame(sideBars, sideOutline);
const sideHoles = openings(sideBars, sideOutline);
// Schuin buitenvlak in (y, z), 0,9 m dik in x, met de buitenkant op de schuine
// stijlen.
const OUTER = { z0: levels[1] - TOWER.bar / 2, legs: TOWER.sides.map(([a, b]) => (a + b) / 2) };
const outerOutline = rect(TOWER.sides[0][0], TOWER.sides[1][1], OUTER.z0, towerZ1);
const [yS, yN] = OUTER.legs;
const outerBars = [
  rect(TOWER.sides[0][0], TOWER.sides[0][1], OUTER.z0, towerZ1),
  rect(TOWER.sides[1][0], TOWER.sides[1][1], OUTER.z0, towerZ1),
  ...levels.slice(1).map((z, k, a) =>
    k === a.length - 1
      ? rect(TOWER.sides[0][0], TOWER.sides[1][1], towerZ1 - TOWER.bar, towerZ1)
      : bar([yS, z], [yN, z], TOWER.bar),
  ),
  ...[
    [1, 3],
    [3, 5],
    [5, 7],
    [7, 8],
  ].flatMap(([a, b]) => {
    const za = levels[a];
    const zb = b === 8 ? towerZ1 - TOWER.bar / 2 : levels[b];
    return [bar([yS, za], [yN, zb], TOWER.bar), bar([yN, za], [yS, zb], TOWER.bar)];
  }),
];
const outerFrame = frame(outerBars, outerOutline);
const outerHoles = openings(outerBars, outerOutline);
// Doorsnede in (y, z) uittrekken over 0,9 m en scheef zetten: x = buitenkant
// van de schuine stijl op hoogte z min 0,9 plus de dikte.
const shearOuter = (solid) =>
  solid.warp((v) => {
    const [y, z, t] = v;
    v[0] = outerAt(z) - TOWER.bar + t;
    v[1] = y;
    v[2] = z;
  });
const outerFace = (section) => shearOuter(Manifold.extrude(section, TOWER.bar));
// Topplatform met de kabelwielen: per zijvlak een groot wiel bovenop
// (Ø 2,6 m, top NAP +43,0 m = het hoogste AHN-punt) en een kleiner wiel aan de
// kant van het val (Ø 2,0 m), foto's. Wielen als schijven van 0,9 m.
const PLATFORM = { x0: 12.5, x1: 16.6, y0: -6.7, y1: 7.2, z0: towerZ1, z1: Z(41.4) };
const SHEAVE_TOP = { x: 14.8, r: 1.3, zc: Z(43.0) - 1.3 };
const SHEAVE_LOW = { x: 12.9, r: 1.0, zc: Z(38.4) };
const sheave = ({ x, r, zc }, [y0, y1]) =>
  Manifold.cylinder(y1 - y0, r, r, 32, false)
    .rotate([-90, 0, 0])
    .translate([x, y0, zc]);
// Ballastblok (beton) in de stand met het val beneden: boven in de toren
// tegen de binnenstijlen, over de hele breedte van de toren (foto's: 4 m hoog,
// 1,3 m dik, top 3 m onder het platform).
const BALLAST = { x0: 13.75, x1: 15.05, z0: Z(33.6), z1: Z(37.6) };
// Voetblokken onder de binnenstijlen die boven het water uitsteken (x = 12,9
// tot 13,5, voor de waterkant van het landhoofd).
function tower(print) {
  const sides = TOWER.sides.map(([y0, y1]) => {
    if (!print) return profileY(sideFrame, y0, y1);
    // printversie: dicht vlak met blinde nissen van 0,35 m aan de buitenkant
    const plate = profileY(new CrossSection([ccw(sideOutline)]), y0, y1);
    const outside = y0 < 0 ? [y0 - 0.3, y0 + 0.35] : [y1 - 0.35, y1 + 0.3];
    return plate.subtract(union(sideHoles.map((h) => profileY(new CrossSection([h]), outside[0], outside[1]))));
  });
  let outer;
  if (!print) outer = outerFace(outerFrame);
  else {
    const plate = Manifold.extrude(new CrossSection([ccw(outerOutline)]), TOWER.bar);
    const niches = union(outerHoles.map((h) => Manifold.extrude(new CrossSection([h]), 0.65).translate([0, 0, TOWER.bar - 0.35])));
    outer = shearOuter(plate.subtract(niches));
  }
  return union([
    ...sides,
    outer,
    // bovenregel aan de kant van het val, onder het platform
    box(TOWER.inner[0], TOWER.inner[1], TOWER.sides[0][0], TOWER.sides[1][1], towerZ1 - TOWER.bar, towerZ1),
    box(PLATFORM.x0, PLATFORM.x1, PLATFORM.y0, PLATFORM.y1, PLATFORM.z0 - 0.01, PLATFORM.z1),
    ...TOWER.sides.flatMap((ys) => [sheave(SHEAVE_TOP, ys), sheave(SHEAVE_LOW, ys)]),
    box(BALLAST.x0, BALLAST.x1, TOWER.sides[0][0], TOWER.sides[1][1], BALLAST.z0, BALLAST.z1),
    ...TOWER.sides.map(([y0, y1]) => box(TOWER.inner[0], DECK_X + 0.05, y0, y1, BASE, towerZ0 + 0.01)),
  ]);
}
const towerEast = tower(false);
const towerWest = towerEast.mirror([1, 0, 0]);
const printTowerEast = tower(true);
const printTowerWest = printTowerEast.mirror([1, 0, 0]);

// ---------- brugwachtershuisje ----------
// BAG-pand 0484100000003746 (1938, 17 m²): x = 13,54 tot 18,55, y = 7,45 tot
// 11,05 op het noordelijke deel van het oostelijke landhoofd. Betonnen onderbouw
// van het water (de kade) tot het looppad, daarop een veelhoekig huisje
// (afgeschuinde hoeken, foto's) met een plint, een terugliggende band met
// ramen (nis van 0,3 m), een koperen boeiboord en een laag schilddak tot NAP
// +8,9 m (AHN).
const HOUSE = { x0: 13.54, x1: 18.55, y0: 7.45, y1: 11.05, chamfer: 0.8 };
const octagon = (inset, c = HOUSE.chamfer) => {
  const [x0, x1, y0, y1] = [HOUSE.x0 + inset, HOUSE.x1 - inset, HOUSE.y0 + inset, HOUSE.y1 - inset];
  return [
    [x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c],
  ];
};
const HOUSE_Z = { floor: Z(4.8), plinth: Z(5.95), band: Z(7.55), eaves: Z(8.25), ridge: Z(8.9) };
const house = union([
  prism(rect(HOUSE.x0, HOUSE.x1, HOUSE.y0, HOUSE.y1), BASE, HOUSE_Z.floor),
  prism(octagon(0), HOUSE_Z.floor - 0.01, HOUSE_Z.plinth),
  prism(octagon(0.3, HOUSE.chamfer - 0.12), HOUSE_Z.plinth - 0.01, HOUSE_Z.band + 0.01),
  prism(octagon(-0.2, HOUSE.chamfer + 0.08), HOUSE_Z.band, HOUSE_Z.eaves),
  Manifold.hull([
    prism(octagon(-0.2, HOUSE.chamfer + 0.08), HOUSE_Z.eaves - 0.01, HOUSE_Z.eaves),
    box(HOUSE.x0 + 1.9, HOUSE.x1 - 1.9, (HOUSE.y0 + HOUSE.y1) / 2 - 0.05, (HOUSE.y0 + HOUSE.y1) / 2 + 0.05, HOUSE_Z.ridge - 0.01, HOUSE_Z.ridge),
  ]),
]);

const common = [deck, ...portals, ...abutments, house];
const bridge = union([...common, ...trusses, towerEast, towerWest]);

// ---------- printversie (alleen de STL) ----------
// Vakwerkopeningen als blinde nissen van 0,35 m aan de buitenkant, en onder
// het val een printvoet: een wig van 50 graden die uitloopt op een trapezium
// tot de onderplaat (het val hangt 4,3 m boven het water), zoals de opvulling
// van de export.
const printTrusses = TRUSS_Y.map((y, i) => {
  const plate = profileY(new CrossSection([ccw(trussOutline)]), y - TRUSS_HALF, y + TRUSS_HALF);
  const outside = i === 0 ? [y - TRUSS_HALF - 0.3, y - TRUSS_HALF + 0.35] : [y + TRUSS_HALF - 0.35, y + TRUSS_HALF + 0.3];
  return plate.subtract(union(trussHoles.map((h) => profileY(new CrossSection([h]), outside[0], outside[1]))));
});
const KNEE = (50 * Math.PI) / 180;
const footYc = (EDGE_S + EDGE_N) / 2;
const footW = (EDGE_N - EDGE_S) / 2 + 0.02;
const footA = Math.max(0.45, footW - (DECK_BOTTOM + 0.02 - BASE) / Math.tan(KNEE));
const printFoot = loftX(
  [-DECK_X - 0.01, DECK_X + 0.01].map((x) => ({
    x,
    section: [[-footA, BASE], [footA, BASE], [footW, DECK_BOTTOM + 0.02], [-footW, DECK_BOTTOM + 0.02]].map(([y, z]) => [y + footYc, z]),
  })),
);
const printModel = union([...common, ...printTrusses, printTowerEast, printTowerWest, printFoot]);

// ---------- controles ----------
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  const pieces = solid.decompose();
  if (pieces.length !== 1) throw new Error(`${name}: ${pieces.length} losse delen`);
}
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant (ter
// informatie: dek, plafonds van vakwerkopeningen, portalen, platform, wielen,
// ballastblok, dak).
function overhangArea(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len > 1e-9 && n[2] < -Math.SQRT1_2 * len) area += len / 2;
  }
  return +area.toFixed(1);
}
console.log("vrij hangend (m2): model", overhangArea(bridge), "print", overhangArea(printModel));

// ---------- wegdelen als eigen onderdelen ----------
// Pas na de brug en de printversie als geheel: de bovenste 0,5 m van het dek
// en van de landhoofden binnen de actuele BGT-wegdelen is per combinatie van
// attributen een eigen node met de waarden van dat wegdeel (glTF
// `extras.attributes`), zodat de kleurregels van een thema op de brug werken
// zoals op de PDOK-wegdelen ernaast. Op het dek liggen vijf BGT-wegdelen met
// relatieve hoogteligging 1 (x = -13,5 tot 13,5): de rijbaan
// P0028.610ae080a9024dad9d1a9fbab85964c5 (rijbaan regionale weg, gesloten
// verharding, asfalt) tussen y = -4,01 en 4,49, twee smalle stroken fietspad
// tussen de rijbaan en de hoofdliggers (P0028.03fa6ca26150481d827e86dbfc7b2629
// en P0028.22d8bc4df8bf4e488e24ee1618e1ff19) en buiten de liggers het fietspad
// P0028.415a49959f2e4097b86838c592082911 (zuid) en
// P0028.78922c9ac3aa48fc91b2d9a31ec62d65 (noord, in werkelijkheid het voetpad),
// alle vier fietspad met gesloten verharding zonder plus-fysiek voorkomen. De
// smalle stroken vallen in het model voor het grootste deel onder de
// hoofdliggers; wat ervan over is (0,25 en 0,3 m) hoort hier bij de rijbaan.
// Op de landhoofden liggen wegdelen met hoogteligging 0 (de PDOK-versies
// zakken met het terrein weg tot het water en liggen onder het model): de
// rijbaan lokale weg (gesloten verharding, asfalt), het fietspad aan de
// zuidkant (gesloten verharding, asfalt) en voetpaden van tegels (open
// verharding); ze lopen in het model door tot de waterkant (x = ±13,5), over de
// BGT-randstrook van het landhoofd. De bermen van betonstraatstenen (onder de
// torens) en de kleine stukken voetpad van cementbeton en trap (samen 8 m²)
// blijven constructie.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const ATTR = {
  rijbaan: { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" },
  fietspad: { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" },
  lokaleWeg: { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" },
  fietspadAsfalt: { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" },
  voetpadTegels: { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "open verharding", plus_fysiekvoorkomen: "tegels" },
};
// Actuele BGT-wegdelen in lokale coördinaten, vereenvoudigd tot 5 cm en
// bijgesneden op het model (de landhoofden tot x = ±27,5).
const ROAD_AREAS = {
  // dek
  rijbaan: [rect(-DECK_X, DECK_X, TRUSS_Y[0], TRUSS_Y[1])],
  fietspad: [rect(-DECK_X, DECK_X, EDGE_S - 0.5, TRUSS_Y[0]), rect(-DECK_X, DECK_X, TRUSS_Y[1], EDGE_N + 0.5)],
  // G0484.3794f416feb66ea8e05370f9200ac4e9 (west) en
  // G0484.3794f416fed16ea8e05370f9200ac4e9 (oost)
  lokaleWeg: [
    [[-ABUT_X - 0.5, 4.41], [-DECK_X, 4.44], [-DECK_X, -4.02], [-ABUT_X - 0.5, -4.09]],
    [[ABUT_X + 0.5, -4.07], [26.88, -4.01], [DECK_X, -4.01], [DECK_X, 4.49], [ABUT_X + 0.5, 4.46]],
  ],
  // G0484.3794f41c46446ea8e05370f9200ac4e9 (west), G0484.69a49eb9c78e7eede05370f9200a9e2f
  // en G0484.3794f416fed26ea8e05370f9200ac4e9 (oost)
  fietspadAsfalt: [
    [[-ABUT_X - 0.5, -5.42], [-14.94, -5.4], [-14.92, -5.57], [-DECK_X, -5.57], [-DECK_X, -7.49], [-ABUT_X - 0.5, -7.5]],
    [[DECK_X, -5.52], [24.84, -5.38], [ABUT_X + 0.5, -5.36], [ABUT_X + 0.5, -7.46], [DECK_X, -7.49]],
  ],
  // G0484.3794f416feb16ea8e05370f9200ac4e9 (west, noord),
  // G0484.3794f41a0cdd6ea8e05370f9200ac4e9 (oost, noord) en
  // G0484.69a49eb9c79e7eede05370f9200a9e2f en G0484.69a49eb9c7ae7eede05370f9200a9e2f
  // (oost, langs de rijbaan)
  voetpadTegels: [
    [[-ABUT_X - 0.5, 7.4], [-DECK_X, 7.43], [-DECK_X, 5.96], [-ABUT_X - 0.5, 5.98]],
    [[ABUT_X + 0.5, 5.89], [26.97, 5.85], [26.97, 5.78], [24.77, 5.78], [24.77, 5.87], [DECK_X, 5.95], [DECK_X, 7.45], [ABUT_X + 0.5, 7.46]],
    [[15.79, 4.47], [15.79, 5.96], [24.77, 5.87], [24.78, 4.67], [26.97, 4.67], [26.97, 4.45]],
    [[25.53, -4.21], [25.54, -5.38], [15.8, -5.52], [15.79, -4.01], [26.88, -4.01], [ABUT_X + 0.5, -4.07], [ABUT_X + 0.5, -4.21]],
  ],
};
// Snijstroken over dezelfde stations als dek en landhoofden, van 0,5 m onder
// tot 1 m boven het wegdek; per zone de eigen hoogte, de zones grenzen op de
// hartlijnen van de hoofdliggers (dek) en op y = -4,2 en 4,6 (landhoofden).
const strip = (x0, x1, y0, y1, top) =>
  loftX(stationsX(x0, x1).map((x) => ({ x, section: [[y0, top(x) - LAYER], [y1, top(x) - LAYER], [y1, top(x) + ABOVE], [y0, top(x) + ABOVE]] })));
const spanStrips = [
  strip(-DECK_X, DECK_X, EDGE_S - 0.5, TRUSS_Y[0], walkZ),
  strip(-DECK_X, DECK_X, TRUSS_Y[0], TRUSS_Y[1], roadZ),
  strip(-DECK_X, DECK_X, TRUSS_Y[1], EDGE_N + 0.5, walkZ),
];
const abutStrips = [
  [-ABUT_X - 0.5, -DECK_X],
  [DECK_X, ABUT_X + 0.5],
].flatMap(([x0, x1]) => [
  strip(x0, x1, EDGE_S - 0.5, ABUT_ZONES.south[1], walkZ),
  strip(x0, x1, ABUT_ZONES.centre[0], ABUT_ZONES.centre[1], roadZ),
  strip(x0, x1, ABUT_ZONES.north[0], EDGE_N + 0.5, walkZ),
]);
// Wat boven het wegdek uitsteekt blijft constructie, 2 cm groter: de
// hoofdliggers over hun hele lengte, de zijvlakken van de torens over hun
// hele voet (met de binnenstijlen en hun voetblokken) en het
// brugwachtershuisje.
const tall = (poly) => prism(poly, BASE - 1, 60);
const grown = (x0, x1, y0, y1) => box(x0 - GUARD, x1 + GUARD, y0 - GUARD, y1 + GUARD, BASE - 1, 60);
const guards = union([
  ...TRUSS_Y.map((y) => grown(-TRUSS.x, TRUSS.x, y - TRUSS_HALF, y + TRUSS_HALF)),
  ...[-1, 1].flatMap((s) =>
    TOWER.sides.map(([y0, y1]) => grown(s > 0 ? TOWER.inner[0] : -TOWER.outerFoot, s > 0 ? TOWER.outerFoot : -TOWER.inner[0], y0, y1)),
  ),
  grown(HOUSE.x0, HOUSE.x1, HOUSE.y0, HOUSE.y1),
]);
const spanCut = union(spanStrips).subtract(guards);
const abutCut = union(abutStrips).subtract(guards);
const NODES = [
  ["rijbaan", spanCut, ROAD_AREAS.rijbaan, ATTR.rijbaan],
  ["fietspad", spanCut, ROAD_AREAS.fietspad, ATTR.fietspad],
  ["rijbaan-landhoofden", abutCut, ROAD_AREAS.lokaleWeg, ATTR.lokaleWeg],
  ["fietspad-landhoofden", abutCut, ROAD_AREAS.fietspadAsfalt, ATTR.fietspadAsfalt],
  ["voetpad-landhoofden", abutCut, ROAD_AREAS.voetpadTegels, ATTR.voetpadTegels],
];
// Op volgorde, zodat elk stuk wegdek maar bij één node hoort (de BGT-vlakken
// overlappen elkaar hier en daar enkele centimeters).
let taken = null;
const cuts = NODES.map(([, cut, areas]) => {
  const area = union(areas.map(tall));
  const own = taken ? area.subtract(taken) : area;
  taken = taken ? union([taken, area]) : area;
  return cut.intersect(own);
});
const roads = cuts.map((c) => c.intersect(bridge));
const structure = bridge.subtract(union(cuts));
const parts = [
  [`building:${SLUG}`, structure],
  ...NODES.map(([label, , , attributes], i) => [`road:${label}`, roads[i], attributes]),
];
{
  const whole = bridge.volume();
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  console.log(
    "volumes (m3): brug",
    +whole.toFixed(2),
    ...parts.flatMap(([name, solid]) => [name, +solid.volume().toFixed(2)]),
    "som - brug",
    +(sum - whole).toFixed(4),
  );
  if (Math.abs(sum - whole) > 1e-4 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) {
    if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
    if (solid.isEmpty()) throw new Error(`${name}: leeg`);
  }
}

// Stralencontrole: verticale stralen over dek en landhoofden; per straal de
// hits binnen 1 m onder en 1,5 m boven het wegdek:
// bovenvlakken (normaal omhoog) en ondervlakken van elk onderdeel. Twee
// bovenvlakken van verschillende onderdelen binnen 1 cm, of een boven- en
// ondervlak van hetzelfde onderdeel op dezelfde hoogte (een vlak zonder
// dikte), geven z-fighting op de kaart.
function rayCheck(named) {
  // Driehoeken per cel van 1 m in bovenaanzicht.
  const meshes = named.map(([name, solid]) => {
    const m = solid.getMesh();
    const grid = new Map();
    for (let t = 0; t < m.triVerts.length; t += 3) {
      const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => m.vertProperties[m.triVerts[t + k] * m.numProp + a]));
      const [x0, x1] = [Math.min(p[0][0], p[1][0], p[2][0]), Math.max(p[0][0], p[1][0], p[2][0])].map(Math.floor);
      const [y0, y1] = [Math.min(p[0][1], p[1][1], p[2][1]), Math.max(p[0][1], p[1][1], p[2][1])].map(Math.floor);
      for (let i = x0; i <= x1; i++)
        for (let j = y0; j <= y1; j++) {
          const key = `${i},${j}`;
          if (!grid.has(key)) grid.set(key, []);
          grid.get(key).push(p);
        }
    }
    return { name, grid };
  });
  const hitsAt = (tris, x, y) => {
    const out = [];
    for (const [a, b, c] of tris) {
      const d = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
      if (Math.abs(d) < 1e-12) continue;
      const l1 = ((b[1] - c[1]) * (x - c[0]) + (c[0] - b[0]) * (y - c[1])) / d;
      const l2 = ((c[1] - a[1]) * (x - c[0]) + (a[0] - c[0]) * (y - c[1])) / d;
      const l3 = 1 - l1 - l2;
      if (l1 < 0 || l2 < 0 || l3 < 0) continue;
      out.push({ z: l1 * a[2] + l2 * b[2] + l3 * c[2], up: d > 0 });
    }
    return out;
  };
  let rays = 0;
  const problems = [];
  for (let x = -ABUT_X + 0.137; x < ABUT_X; x += 0.41) {
    for (let y = EDGE_S + 0.053; y < EDGE_N; y += 0.29) {
      rays++;
      const tops = [];
      // alleen rond het wegdek (de torens hoger op tellen niet mee)
      const near = (z) => z > roadZ(x) - 1 && z < walkZ(x) + 1.5;
      for (const { name, grid } of meshes) {
        const hits = hitsAt(grid.get(`${Math.floor(x)},${Math.floor(y)}`) ?? [], x, y).filter((h) => near(h.z));
        for (const h of hits) if (h.up) tops.push({ name, z: h.z });
        for (const u of hits.filter((h) => h.up))
          for (const d of hits.filter((h) => !h.up)) if (Math.abs(u.z - d.z) < 0.01) problems.push(`${name} vlak zonder dikte op ${[x, y, u.z].map((c) => c.toFixed(2))}`);
      }
      for (let i = 0; i < tops.length; i++)
        for (let j = i + 1; j < tops.length; j++)
          if (tops[i].name !== tops[j].name && Math.abs(tops[i].z - tops[j].z) < 0.01)
            problems.push(`${tops[i].name} / ${tops[j].name} op ${[x, y, tops[i].z].map((c) => c.toFixed(2))}`);
    }
  }
  return { rays, problems };
}
{
  const { rays, problems } = rayCheck(parts);
  console.log("stralen", rays, "samenvallende vlakken", problems.length, problems.slice(0, 5));
  if (problems.length) throw new Error("samenvallende vlakken op het wegdek");
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
    // Vertexnormalen met scherpe randen boven 40 graden.
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
    // PDOK-attributen (zoals bij de BGT-wegdelen) voor de kleurregels.
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
for (const [name, solid, attributes] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    ...(attributes ? { attributes } : {}),
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
report.truss = { openings: trussHoles.length, towerSideOpenings: sideHoles.length, towerOuterOpenings: outerHoles.length };
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van landhoofden, voetblokken en printvoet op
// het printbed.
const stlName = `${SLUG}-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Hefbrug Gouwesluis 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
const samplePoints = [-6, 0, 6].flatMap((x) => [
  [x, 16],
  [x, -16],
]);
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: "Hefbrug Gouwesluis",
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [106134.89, 459048.07],
      xAxis: [0.95589, -0.29372],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      // Op het water van de Gouwe, 16 m naast de as aan beide kanten (noord in
      // de keersluis).
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0484100000003746"],
      replacesTerrain: [
        "P0028.80717001cf8d43f9b56f60dbd2decdc0",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het midden van het BGT-brugdek op het water van de Gouwe (z = 0, NAP -0,39 m zoals het PDOK-terrein het water legt) in de oorsprong, +X langs de weg naar het oostzuidoosten (de oostelijke oever met het brugwachtershuisje, RD-richting -17,08 graden vanaf het oosten) en +Y naar het noordnoordoosten (de keersluis). Zes nodes: building, het kunstwerk zonder de bovenste 0,5 m van het wegdek: de twee betonnen landhoofden (x = ±13,5 tot ±27,5), het val in de laagste stand (x = -13,5 tot 13,5, onderkant NAP +3,89 m, wegdek NAP +4,77 m) met twee vakwerkhoofdliggers van 29,2 m (bovenkant NAP +9,1 m, Warren-vakwerk met stijlen, alle velden open) en eindportalen, de twee heftorens van open vakwerk (zijvlakken met een verticale binnenstijl en een schuine buitenstijl, acht velden met kruisen, het schuine buitenvlak met portaal en kruisen, open aan de kant van het val) met topplatform, kabelwielen (top NAP +43,0 m) en ballastblok, en het brugwachtershuisje (BAG-pand) op het oostelijke landhoofd; en vijf road-nodes, de bovenste 0,5 m van dek en landhoofden binnen de actuele BGT-wegdelen met hun attributen in extras.attributes (op het dek rijbaan regionale weg en fietspad, op de landhoofden rijbaan lokale weg, fietspad en voetpad), zodat de kleurregels van een thema erop werken. Het bovenwindverband, de kabels, leuningen, ladders, bordessen in de torens, slagbomen, seinen, het remmingwerk en de keersluis zijn weggelaten; wat zonder steun niet print (de vlakke plafonds van de vakwerkopeningen, de portalen, het dek) vult de export op. De STL heeft blinde nissen in plaats van de vakwerkopeningen en onder het val een printvoet. Het maaiveld wordt op het water naast de brug bemonsterd; groundHeight is de PDOK-hoogte van het water (ellipsoïdisch). Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: 2 * ABUT_X,
        deckM: { length: 2 * DECK_X, width: +(EDGE_N - EDGE_S).toFixed(2), roadNap: 4.77, undersideNap: 3.89 },
        trussM: { length: 2 * TRUSS.x, topNap: 9.1, linesY: TRUSS_Y, spacing: +(TRUSS_Y[1] - TRUSS_Y[0]).toFixed(2) },
        towersM: { topNap: 43.0, platformNap: TOWER.topNap, footAlongRoad: +(TOWER.outerFoot - TOWER.inner[0]).toFixed(1), topAlongRoad: +(TOWER.outerTop - TOWER.inner[0]).toFixed(1), acrossRoad: +(TOWER.sides[1][1] - TOWER.sides[0][0]).toFixed(1), clearOpening: 2 * TOWER.inner[0] },
        houseRoofNap: 8.9,
        waterNap: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Hefbrug_Gouwesluis",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/516141",
        "PDOK BGT overbruggingsdeel en wegdeel (dek, landhoofden, wegdelen op dek en landhoofden), EPSG:28992",
        "PDOK BAG pand 0484100000003746 (brugwachtershuisje)",
        "PDOK AHN DSM 0,5 m via WCS voor wegdek, hoofdliggers, torens en brugwachtershuisje",
        "PDOK luchtfoto (Actueel_orthoHR) en PDOK 3D-terrein (waterhoogte)",
        "Wikimedia Commons: 200407 Hefbrug Gouwesluis.jpg, Gouwsluis-hefbrug nrd..JPG, Gouwsluis-hefbrug zd..JPG, Hefbrug Gouwesluis - Het beweegbare deel.jpg, - Oostelijk landhoofd.jpg, - Westelijk landhoofd.jpg, - Vanaf de Steekterweg.jpg, - Brugwachtershuisje.jpg, Overzicht hefbrug over de Gouwe - Alphen aan den Rijn - 20396221 - RCE.jpg, Alphen aan den Rijn - hefbrug.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

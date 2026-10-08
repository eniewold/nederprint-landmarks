// Genereert een gesloten 3D-model van De Grolsch Veste in Enschede (thuisstadion
// van FC Twente): de hoefijzervormige kom met het hoge, naar buiten oplopende dak
// over de zuidwestkant en beide koppen (met de waaiervormige hoeken van de
// zuidkant), daaronder de tribunes met hun zitrangen (onderring, gang en
// bovenring tegen een achterwand), de noordoosttribune met één ring onder haar
// V-dak, de twee hoektribunes onder een schilddak op kolommen, de twee
// loopbruggen rond de noordhoeken en de zes trappen- en lichttorens aan de
// buitenrand van het dak. De daken zijn dakplaten van 1,6 tot 2 m dik op de
// AHN-maten (geen hoogteveld), die over de rangen uitkragen, met de dakspanten
// als brede ribben erbovenop; de rangen eronder zijn getrapt (een trede per drie
// rijen) en blijven van opzij en bovenaf zichtbaar. Het Mapbox-model is niet
// gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-grolsch-veste.mjs              # 1:1000 (standaard)
//   node scripts/generate-grolsch-veste.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening op maaiveldniveau
// (NAP +27,5 m), Z omhoog. +X loopt langs de lengteas van het veld naar het
// zuidoosten (RD-richting (0,7150, -0,6992), -44,36 graden), +Y dwars daarop
// naar het noordoosten, naar de lage tribune; het dak open aan de +Y-kant.
//
// Bronnen: PDOK BAG-pand 0153100000257703 (het stadion; contour en vervangen
// pand); AHN DSM/DTM 0,5 en 0,25 m (PDOK WCS): de veldopening (121 bij 83 m), het
// dak van het hoefijzer (+30,8 m aan de veldkant, +33,8 m aan de buitenrand, op
// 0,5 m afgelezen), de rand met de waaiers (straal 37 tot 39 m rond de binnenhoek),
// de plaats en hoogte van de spanten (elke 10,8 tot 11 m, tot 4 m boven het dak,
// en de langsligger op 29 tot 31,5 m van de veldkant), het V-profiel van de
// noordoosttribune (+19,45, +17,27 en +18,83 m), het schilddak van de hoektribunes
// (+17,5 tot +14 m), de loopbruggen en de zes torens; PDOK luchtfoto (dakspanten,
// bogen van de loopbruggen); Wikipedia en stadiumdb (30.205 plaatsen; in 2008 en
// 2011 is een tweede ring boven de eerste gebouwd langs west-, noord- en zuidkant,
// de oostkant is de oorspronkelijke tribune met één ring; zes trappenhuizen naar de
// promenade van de tweede ring) en het TNO-rapport over de instorting van 2011 (de
// spanten, circa 10 m h.o.h., rusten op de betonnen tribune en kragen naar het
// veld uit). Geschat, want voor het AHN onzichtbaar onder het dak: de zitrangen
// (onderring van 21 rijen van +2,6 tot +9,8 m, gang op +10,8 m, bovenring van
// 15 rijen van +12,6 tot +19 m, helling 27 en 33 graden), de achterwand, de
// dikte van de dakplaten, de rang van de noordoosttribune (negen treden tot
// +11,8 m) en de hoektribunes (zeven treden tot +8,6 m), en de pijlers van de
// loopbruggen. Weggelaten: de diagonale windverbanden, de spanten als vakwerk
// (hier massieve ribben), de kabels en masten van de noordoosttribune, de goot
// langs de dakrand en de lichtbakken aan de buitenrand.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grolsch-veste");
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
const regionPrism = (region, z0, z1) => Manifold.extrude(region, z1 - z0).translate([0, 0, z0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);
const rect = (u0, u1, v0, v1) => new CrossSection([[[u0, v0], [u1, v0], [u1, v1], [u0, v1]]]);

const SLUG = "grolsch-veste";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +27,5 m) ----------
const GROUND_NAP = 27.5;
const ORIGIN = [254087.7, 473044.7];
const X_AXIS = [0.714961, -0.699164]; // RD-richting -44,36 graden, langs het veld
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// De DSM-hoogtes zijn gemeten boven NAP +27,5 m, het maaiveld rond het stadion
// (het veld ligt op +1,7 m, NAP +29,2 m).

// Hoefijzer: hoog dak over de westkop, de zuidkant en de oostkop. Het dak
// loopt van de veldkant (+30,8 m) over 39 m naar buiten op tot +33,8 m. De
// binnenrand is de veldopening (u -60,5 tot 60,5 m, v tot -42,5 m), de buitenrand
// de kopgevels (u -99,7 en 99,2 m) en de zuidgevel (v -81,7 m) met afgeronde
// hoeken (straal 39 m rond de binnenhoeken van de kom, waaiervormig).
const Z_IN = 30.8;
const Z_OUT = 33.8;
const U_IN = 60.5;
const V_IN = -42.5;
const U_WEST = -99.7;
const U_EAST = 99.2;
const V_SOUTH = -81.7;
const S_OUT = V_IN - V_SOUTH; // diepte van het hoefijzer, 39,2 m
const RX_WEST = -U_WEST - U_IN;
const RX_EAST = U_EAST - U_IN;
// De koppen eindigen aan de noordkant in een schuine rand: [u aan de veldkant, v], [u aan de buitenrand, v].
const WEST_TOP = [[-60.5, 34], [U_WEST, 40.3]];
const EAST_TOP = [[60.5, 33.2], [U_EAST, 39.4]];
const FAN_STEPS = 8;
// Straal van de buitenrand van de waaiers per stap van 11,25 graden, van de kop naar de zuidkant
// (west) en van de zuidkant naar de kop (oost): op het DSM loopt de rand in de hoeken 1,5 m binnen
// de cirkel van 39 m (de dakrand knikt naar binnen tussen de spanten).
const FAN_R_WEST = [39.2, 38.8, 38.4, 37.8, 37.6, 37.5, 37.8, 38.2, 39.2];
const FAN_R_EAST = [39.2, 38.3, 37.8, 37.2, 37.0, 37.1, 37.9, 38.3, 38.7];
// Dakhoogte van het hoefijzer: loopt lineair op met de afstand tot de veldopening
// (elliptisch rond de binnenhoeken van de kom).
const roofTop = (x, y) => {
  const du = Math.max(0, Math.abs(x) - U_IN) / (x < 0 ? RX_WEST : RX_EAST);
  const dv = Math.max(0, V_IN - y) / S_OUT;
  return Z_IN + (Z_OUT - Z_IN) * Math.hypot(du, dv);
};
const T_ROOF = 2.0; // dikte dakplaat hoefijzer (spanthoogte onder de dakbeplating, geschat)
// Noordoosttribune (de oorspronkelijke tribune met één ring): V-dak met dwarsprofiel [v, z]
// langs u -60,5 tot 61 m, boven de rang. De dakrand aan de veldkant ligt op v = 40,6 m.
const NE = { u0: -60.5, u1: 61, v0: 40.6, v1: 70.6 };
const NE_TOP = [[40.6, 19.45], [58, 17.27], [70.6, 18.83]];
const T_NE = 2.0;
// Hoektribunes tussen de noordoosttribune en de koppen: een schilddak van twee vlakken
// z = a u + b v + c (AHN: het ene vlak daalt naar de achterkant, het andere naar buiten;
// het dak ligt op de laagste van de twee, +17,5 tot +14 m), met een rechthoek en een strook langs
// de schuine rand van de koppen in plan [u, v]. De oostelijke heeft een afgeschuinde hoek.
const CORNERS = [
  {
    planes: [[0.0242, -0.1049, 23.148], [0.127, 0, 25.633]],
    plan: [
      [[-80, 57], [-60.5, 57], [-60.5, 42], [-80, 42]],
      [[-80, 42], [-65, 42], [-65, 34.65], [-80, 37.05]],
    ],
    columns: [[-79.2, 38.4], [-79.2, 45], [-79.2, 51.5], [-79.2, 56.2], [-72.6, 56.2], [-66.1, 56.2], [-61.4, 56.2]],
  },
  {
    planes: [[-0.0242, -0.1049, 23.148], [-0.127, 0, 25.633]],
    plan: [
      [[60.5, 57], [69.5, 57], [79.7, 48.8], [79.7, 42], [60.5, 42]],
      [[65, 42], [79.7, 42], [79.7, 36.25], [65, 33.85]],
    ],
    columns: [[78.9, 38.0], [78.9, 44.5], [77.4, 48.8], [73.2, 52.2], [68.4, 56.2], [64.8, 56.2], [61.4, 56.2]],
  },
];
const T_CORNER = 1.6;
// Zes torens aan de buitenrand van het dak (trappenhuizen naar de gang tussen de ringen en lichtbakken): [u0, u1, v0, v1, top].
// De torens staan 0,7 m in het dak, zodat ze er één geheel mee vormen.
const TOWERS = [
  [-109.2, -99.0, 4.0, 15.6, 22.4],
  [-109.2, -99.0, -42.7, -27.6, 22.3],
  [98.5, 109.2, 2.6, 15.4, 22.3],
  [98.5, 109.2, -43.7, -28.6, 22.3],
  [-61.5, -49.1, -88.9, -81.0, 22.3],
  [48.0, 62.1, -90.2, -81.0, 22.3],
];
// Loopbruggen (rond de hoek van de veldopening van het einde van de bovenring naar de achterkant van de
// noordoosttribune): een dek van 2,6 m breed en 1,4 m dik langs de bogen uit het DSM, van +11 m aan de kop tot +12,6 m
// bij de noordoosttribune, op twee pijlers (puntenlijst [u, v], pijlers op de gegeven punten).
const BRIDGE_W = 2.6;
const BRIDGE_T = 1.4;
const BRIDGE_Z = [11.0, 12.6];
const BRIDGES = [
  { path: [[-91.5, 38.2], [-90.4, 45], [-88.8, 50], [-86.2, 55], [-82.6, 59.2], [-77, 63], [-70, 65.5], [-60, 65.6]], piers: [3, 5] },
  { path: [[92.6, 37.8], [91.6, 43], [89.5, 48.8], [83, 58.7], [78, 62.5], [72.6, 65.8], [66, 66], [60, 66]], piers: [2, 4] },
];
// Maaiveld (AHN NAP +27,3 tot +27,5 m) op het parkeerterrein rond het stadion.
const GROUND_SAMPLES = [[0, 85], [-90, 80], [-120, -70], [120, 60]];

// Zitrangen onder het hoefijzerdak: [afstand s tot de dakrand aan de veldkant, hoogte z]
// per trede (drie rijen van 0,8 m per trede). Onderring van de eerste 21 rijen (+2,6 tot
// +9,8 m), de gang (promenade en skyboxen) op +10,8 m, de bovenring van 15 rijen (+12,6 tot +19 m)
// en de achterwand (s 37 tot 39,2 m) die het dak draagt.
const HORSESHOE_STEPS = [
  [1.5, 2.6], [3.9, 3.8], [6.3, 5.0], [8.7, 6.2], [11.1, 7.4], [13.5, 8.6], [15.9, 9.8],
  [18.3, 10.8],
  [24.3, 12.6], [26.7, 14.2], [29.1, 15.8], [31.5, 17.4], [33.9, 19.0],
];
const WALL_THICK = 2.2;
// Noordoosttribune: één ring van negen treden (+2,6 tot +11,8 m), daarachter de gang op +11,8 m
// (waar de loopbruggen naar de koppen aansluiten) en de achterwand (v 69 tot 70,6 m).
const NE_STEPS = [[1.0, 2.6], [3.4, 3.75], [5.8, 4.9], [8.2, 6.05], [10.6, 7.2], [13.0, 8.35], [15.4, 9.5], [17.8, 10.65], [20.2, 11.8]];
const NE_WALL_V = 69.0;
// Hoektribunes: rang rond de hoek van de veldopening, treden tot +8,6 m, daarachter een vlakke gang.
const CORNER_STEPS = [[1.0, 2.6], [3.4, 3.6], [5.8, 4.6], [8.2, 5.6], [10.6, 6.6], [13.0, 7.6], [15.4, 8.6]];
// Spanten van het hoefijzer: breed 1,1 m, hoogte boven de dakbeplating op een fractie van de
// diepte (0 aan de veldkant, 1 aan de buitenrand), uit het DSM (mediaan van tien spanten).
const RIB_W = 1.1;
const RIB_PROFILE = [[0, 0], [0.18, 0.5], [0.36, 2.0], [0.56, 3.6], [0.78, 4.2], [0.92, 2.8], [1, 1.2]];
const RIB_ALONG_H = 3.6; // de langsligger die de spanten verbindt
const RIB_ALONG_W = 1.0;
// Plaats van de spanten (de coordinaat langs de rand): zuidkant u, koppen v (symmetrisch).
const SOUTH_RIBS = [5.2, 16.2, 27.2, 38.0, 49.0];
const HEAD_RIBS = [-29.0, -17.8, -7.0, 3.8, 14.8, 25.2];
const FAN_RIB_ANGLES = [18.8, 41.9, 65.0, 88.1];

// ---------- gebouwen ----------
const centroid = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
// Een convex stuk is de romp van zijn hoekpunten [x, y, z], 2 cm uitgeschoven
// (rakende vlakken laten in de vereniging een spleet zonder dikte achter).
const grow = (pts) => {
  const [cx, cy] = centroid(pts);
  return pts.map(([x, y, z]) => {
    const l = Math.hypot(x - cx, y - cy) || 1;
    return [x + ((x - cx) / l) * 0.02, y + ((y - cy) / l) * 0.02, z];
  });
};
// Dakplaat: de bovenkant op de gegeven hoogte, de onderkant `dikte` lager.
const slab = (pts, thickness) => Manifold.hull(grow(pts).flatMap(([x, y, z]) => [[x, y, z], [x, y, z - thickness]]));
// Kolom of wand: van de onderkant tot de gegeven hoogte.
const column = (pts) => Manifold.hull(grow(pts).flatMap(([x, y, z]) => [[x, y, z], [x, y, BASE]]));
const lift = (xy, fn) => xy.map(([x, y]) => [x, y, fn(x, y)]);
const arcPts = (cx, cy, rx, ry, a0, a1) =>
  Array.from({ length: FAN_STEPS + 1 }, (_, i) => {
    const a = ((a0 + ((a1 - a0) * i) / FAN_STEPS) * Math.PI) / 180;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
// Buitenrand van een waaier rond de binnenhoek (cx, cy): negen punten van a0 tot a0 + 90 graden.
const fanRim = (cx, cy, radii, a0) =>
  radii.map((r, i) => {
    const a = ((a0 + (90 * i) / FAN_STEPS) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });

// Plattegrond van het hoefijzerdak: drie stroken en twee waaiers van acht driehoeken
// rond de binnenhoeken van de kom.
const fanPlan = (cx, cy, radii, a0) => {
  const pts = fanRim(cx, cy, radii, a0);
  return pts.slice(0, -1).map((p, i) => [[cx, cy], p, pts[i + 1]]);
};
const roofPlan = [
  [[-U_IN, V_IN], WEST_TOP[0], WEST_TOP[1], [U_WEST, V_IN]],
  [[-U_IN, V_IN], [U_IN, V_IN], [U_IN, V_SOUTH], [-U_IN, V_SOUTH]],
  [[U_IN, V_IN], EAST_TOP[0], EAST_TOP[1], [U_EAST, V_IN]],
  ...fanPlan(-U_IN, V_IN, FAN_R_WEST, 180),
  ...fanPlan(U_IN, V_IN, FAN_R_EAST, 270),
];
const roofPlates = roofPlan.map((xy) => slab(lift(xy, roofTop), T_ROOF));
// De omtrek van het hoefijzer, `inset` m naar binnen; door de veldopening dicht (en met inset ruim naar
// het noorden), zodat de rangen en de achterwand er als verschil met de veldrand en de binnenomtrek
// uitkomen.
const footprint = (inset) =>
  new CrossSection([
    ccw([
      inset ? [-U_IN, 60] : WEST_TOP[0],
      inset ? [U_WEST + inset, 60] : WEST_TOP[1],
      ...fanRim(-U_IN, V_IN, FAN_R_WEST.map((r) => r - inset), 180),
      ...fanRim(U_IN, V_IN, FAN_R_EAST.map((r) => r - inset), 270),
      inset ? [U_EAST - inset, 60] : EAST_TOP[1],
      inset ? [U_IN, 60] : EAST_TOP[0],
    ]),
  ]);
const FOOTPRINT = footprint(0);
const FIELD = rect(-U_IN, U_IN, V_IN, NE.v0);
const around = (core, s) => core.offset(s, "Round", 2, 96);
// Rangen: trede voor trede, elke trede een prisma over het deel van de omtrek dat s of
// verder van de veldrand ligt.
const stand = (region, core, steps) =>
  Manifold.union(steps.map(([s, z]) => regionPrism(region.subtract(around(core, s)), BASE, z)));
const horseshoeStand = stand(FOOTPRINT, FIELD, HORSESHOE_STEPS);
// Achterwand, afgesneden onder de dakplaat.
const wallEnvelope = Manifold.union(roofPlan.map((xy) => column(lift(xy, (x, y) => roofTop(x, y) - T_ROOF + 0.3))));
const horseshoeWall = regionPrism(FOOTPRINT.subtract(footprint(WALL_THICK)), BASE, Z_OUT + 1).intersect(wallEnvelope);

// Spanten: breed 1,1 m, van de dakrand naar buiten, met de hoogte boven de dakbeplating uit RIB_PROFILE.
const fin = (path, width) => {
  const parts = [];
  for (let i = 0; i < path.length - 1; i++) {
    const [x0, y0, t0, b0] = path[i];
    const [x1, y1, t1, b1] = path[i + 1];
    const len = Math.hypot(x1 - x0, y1 - y0);
    const dx = (x1 - x0) / len;
    const dy = (y1 - y0) / len;
    const [px, py, qx, qy] = [x0 - dx * 0.03, y0 - dy * 0.03, x1 + dx * 0.03, y1 + dy * 0.03];
    const [nx, ny] = [(-dy * width) / 2, (dx * width) / 2];
    parts.push(
      Manifold.hull([
        [px + nx, py + ny, b0], [px - nx, py - ny, b0], [px + nx, py + ny, t0], [px - nx, py - ny, t0],
        [qx + nx, qy + ny, b1], [qx - nx, qy - ny, b1], [qx + nx, qy + ny, t1], [qx - nx, qy - ny, t1],
      ]),
    );
  }
  return parts;
};
const ribAt = (p0, p1) =>
  fin(
    RIB_PROFILE.map(([f, h]) => {
      const x = p0[0] + (p1[0] - p0[0]) * f;
      const y = p0[1] + (p1[1] - p0[1]) * f;
      const t = roofTop(x, y);
      return [x, y, t + h, t - 0.5];
    }),
    RIB_W,
  );
const ribs = [];
for (const u of [...SOUTH_RIBS, ...SOUTH_RIBS.map((x) => -x)]) ribs.push(...ribAt([u, V_IN], [u, V_SOUTH]));
for (const v of HEAD_RIBS) {
  ribs.push(...ribAt([-U_IN, v], [U_WEST, v]), ...ribAt([U_IN, v], [U_EAST, v]));
}
// Het eerste spant van elke kop loopt schuin (van v -36,8 m aan de veldkant naar v -42,4 m aan de buitenrand).
ribs.push(...ribAt([-U_IN, -36.8], [U_WEST, -42.4]), ...ribAt([U_IN, -36.8], [U_EAST, -42.4]));
// Waaiervormige hoeken: vier spanten vanaf de binnenhoek (hoeken vanaf de kop, uit het DSM).
const rimPoint = (cx, cy, radii, a0, deg) => {
  const f = deg / (90 / FAN_STEPS);
  const i = Math.min(FAN_STEPS - 1, Math.floor(f));
  const r = radii[i] + (radii[i + 1] - radii[i]) * (f - i);
  const a = ((a0 + deg) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
for (const alpha of FAN_RIB_ANGLES) {
  ribs.push(
    ...ribAt([-U_IN, V_IN], rimPoint(-U_IN, V_IN, FAN_R_WEST, 180, alpha)),
    ...ribAt([U_IN, V_IN], rimPoint(U_IN, V_IN, FAN_R_EAST, 270, 90 - alpha)),
  );
}
// De langsligger die de spanten verbindt, op 29 tot 31,5 m van de dakrand: langs de koppen, door de
// knooppunten van de waaiers (hoek vanaf de kop, afstand tot de binnenhoek) en langs de zuidkant.
const alongWest = [[-92.0, 38.0], [-92.0, -40.8], ...[[18.8, 29.4], [41.9, 27.7], [65.0, 28.1], [88.1, 29.0]].map(([deg, r]) => [-U_IN - r * Math.cos((deg * Math.PI) / 180), V_IN - r * Math.sin((deg * Math.PI) / 180)])];
const alongEast = [[91.4, 37.2], [91.4, -40.8], ...[[18.8, 29.4], [41.9, 27.7], [65.0, 28.1], [88.1, 29.0]].map(([deg, r]) => [U_IN + r * Math.cos((deg * Math.PI) / 180), V_IN - r * Math.sin((deg * Math.PI) / 180)])];
const along = [...alongWest, ...alongEast.reverse()];
const alongPath = along.map(([x, y]) => [x, y, roofTop(x, y) + RIB_ALONG_H, roofTop(x, y) - 0.5]);
ribs.push(...fin(alongPath, RIB_ALONG_W));

// Noordoosttribune: één ring, V-dak op een achterwand.
const neStand = Manifold.union(
  NE_STEPS.map(([s, z]) => box(NE.u0 - 0.05, NE.u1, NE.v0 + s, NE.v1, BASE, z)),
);
const NE_PLATE = [...NE_TOP, ...[...NE_TOP].reverse().map(([v, z]) => [v, z - T_NE])];
const nePlate = profileX(NE_PLATE, NE.u0, NE.u1);
const neEnvelope = profileX(
  [...NE_TOP.map(([v, z]) => [v, z - T_NE + 0.3]), [NE.v1, BASE], [NE.v0, BASE]],
  NE.u0 - 0.05,
  NE.u1,
);
const neWall = box(NE.u0 - 0.05, NE.u1, NE_WALL_V, NE.v1, BASE, 20).intersect(neEnvelope);

// Hoektribunes: rang rond de hoek van de veldopening, dak op kolommen langs de achterkant.
const cornerParts = CORNERS.flatMap(({ planes, plan, columns }) => {
  const top = (x, y) => Math.min(...planes.map(([a, b, c]) => a * x + b * y + c));
  const region = CrossSection.union(plan.map((xy) => new CrossSection([ccw(xy)])));
  // Dakplaat: de laagste van de twee vlakken, T_CORNER dik.
  const under = Manifold.intersection(planes.map(([a, b, c]) => Manifold.union(plan.map((xy) => column(lift(xy, (x, y) => a * x + b * y + c))))));
  const roof = under.subtract(under.translate([0, 0, -T_CORNER]));
  const posts = columns.map(([x, y]) =>
    column(lift([[x - 0.8, y - 0.8], [x + 0.8, y - 0.8], [x + 0.8, y + 0.8], [x - 0.8, y + 0.8]], (px, py) => top(px, py) - T_CORNER + 0.3)),
  );
  return [stand(region, FIELD, CORNER_STEPS), roof, ...posts];
});
// Loopbruggen: het dek volgt de boog, de pijlers staan onder de aangegeven knikken.
const bridgeParts = BRIDGES.flatMap(({ path, piers }) => {
  const lengths = path.map((p, i) => (i ? Math.hypot(p[0] - path[i - 1][0], p[1] - path[i - 1][1]) : 0));
  const total = lengths.reduce((a, b) => a + b, 0);
  let run = 0;
  const deck = path.map(([x, y], i) => {
    run += lengths[i];
    const top = BRIDGE_Z[0] + (BRIDGE_Z[1] - BRIDGE_Z[0]) * (run / total);
    return [x, y, top, top - BRIDGE_T];
  });
  return [
    ...fin(deck, BRIDGE_W),
    ...piers.map((i) => box(deck[i][0] - 0.7, deck[i][0] + 0.7, deck[i][1] - 0.7, deck[i][1] + 0.7, BASE, deck[i][2] - 0.8)),
  ];
});
const towers = TOWERS.map(([u0, u1, v0, v1, top]) => box(u0, u1, v0, v1, BASE, top));

const stadium = Manifold.union([
  horseshoeStand,
  horseshoeWall,
  ...roofPlates,
  ...ribs,
  neStand,
  neWall,
  nePlate,
  ...cornerParts,
  ...bridgeParts,
  ...towers,
]);
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "De Grolsch Veste",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0153100000257703"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (254087,70, 473044,70) in het hart van de veldopening op het maaiveld (NAP +27,5 m), +X langs het veld naar het zuidoosten (-44,36 graden) en +Y naar het noordoosten. Eén node building:stadion: het hoefijzer met het hoge dak over de westkop, de zuidkant en de oostkop (dakplaat van +30,8 m aan de veldkant tot +33,8 m aan de buitenrand, met waaiervormige hoeken en de dakspanten als ribben tot circa +37 m), daaronder de tribunes met onderring (+2,6 tot +9,8 m), gang (+10,8 m) en bovenring (+12,6 tot +19 m) tegen een achterwand die het dak draagt; de noordoosttribune met één ring en een V-dak (+19,5, +17,3 en +18,8 m); twee lagere hoektribunes op kolommen onder een aflopend schilddak (+17,5 tot +14 m), twee loopbruggen rond de noordhoeken (+11 tot +12,6 m) en zes torens aan de buitenrand (+22 m). Onderkant op 0,5 m onder het maaiveld; de daken kragen over de rangen uit. Vervangt de PDOK-reconstructie van het stadionpand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 30205,
    fieldOpeningM: [121, 83.8],
    horseshoeRoofM: [Z_IN, Z_OUT],
    northEastStandM: [19.45, 17.27, 18.83],
    lowerRingM: [2.6, 9.8],
    promenadeM: 10.8,
    upperRingM: [12.6, 19.0],
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/De_Grolsch_Veste",
    "PDOK BAG pand 0153100000257703, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 en 0,25 m via WCS: het dak van het hoefijzer en de spanten, de noordoosttribune, de hoektribunes en de torens",
    "PDOK luchtfoto (Actueel_orthoHR)",
  ],
};

// Onderkanten boven het dak van de tribunes (z vanaf 13,3 m) zijn dakplaten die over de rangen
// uitkragen, en de onderkant van het dek van de loopbruggen (binnen 2,5 m van hun as) is een uitkraging
// tussen de pijlers; verder mag geen vlak onder 45 graden naar beneden wijzen.
const nearBridge = ([x, y]) =>
  BRIDGES.some(({ path }) =>
    path.slice(1).some(([x1, y1], i) => {
      const [x0, y0] = path[i];
      const t = Math.max(0, Math.min(1, ((x - x0) * (x1 - x0) + (y - y0) * (y1 - y0)) / ((x1 - x0) ** 2 + (y1 - y0) ** 2)));
      return Math.hypot(x - (x0 + t * (x1 - x0)), y - (y0 + t * (y1 - y0))) < 2.5;
    }),
  );
const OVERHANG_OK = (z, p) => z >= 13.3 || (z > 9 && z < 12 && p.every(nearBridge));

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

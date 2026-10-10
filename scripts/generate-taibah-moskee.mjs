// Genereert een gesloten 3D-model van de Taibah-moskee (Djame Masjid Taibah) in
// Amsterdam-Zuidoost (Paul Haffmans, 1985; in 1998 verbouwd met extra koepels en
// verbouwde minaretten), aan de Karspeldreef bij metrostation Kraaiennest: de
// vierkante gebedszaal van 30,5 m met een vlak dak op +9,3 m, de grote koepel op
// een zestienhoekige trommel (top +17,7 m), het verhoogde middenrisaliet aan de
// voorgevel met de kleine koepel op een achthoekige trommel (top +14,4 m), de
// lagere achterbouw (Tooba Islamic Centre) met dezelfde dakhoogte en een
// glazen kiosk op de zuidhoek, de ronde trapopbouw aan de metrozijde en vier
// achtkante minaretten op de hoeken van de zaal: twee aan de voorgevel van
// +29,2 m met drie balkons en twee aan de achterkant van +21,9 m met twee
// balkons, elk met een lantaarn en een achtkante uivormige bekroning. Alle delen
// zijn vlakken, prisma's, rompen (hull) van achthoeken en omwentelingen; de maten
// staan in meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-taibah-moskee.mjs              # 1:1000 (standaard)
//   node scripts/generate-taibah-moskee.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (127218,36, 480944,60), het hart van de grote
// koepel, op maaiveldniveau (NAP -3,05 m), Z omhoog. +X loopt langs de voorgevel
// naar het noordoosten (46,3 graden tegen de klok in vanaf de RD-X-as, de
// richting van de voor- en achtergevel in de BAG) en +Y loodrecht daarop naar
// het noordwesten; de voorgevel aan de Karspeldreef staat aan de +Y-kant
// (v = 20,33 m), de achterbouw aan de -Y-kant. De zaal is symmetrisch om u = 0;
// de noordoostgevel loopt langs de metrobaan schuin weg (17,7 graden).
//
// Bronnen: PDOK BAG-pand 0363100012125533 (de hele moskee: de contour, de
// achtkante voeten van de vier minaretten en de hoekkiosk, de ronde trapopbouw
// en de schuine noordoostgevel); AHN DSM/DTM 0,5 m (PDOK WCS): het dak (+9,3 m),
// het middenrisaliet (+10,65 m), de opstand tussen zaal en achterbouw
// (+10,45 m), de radiale profielen van de grote koepel (trommel tot +11,5 m,
// top +17,7 m) en de kleine koepel (top +14,3 m), de omhullende per hoogte van
// de minaretten (balkon van 4,4 m op +12,8 m, toppen +29,4/+28,4 m en
// +22,4/+21,9 m), de installatie en daklichten op de achterbouw, de trapopbouw
// (+8,5 m) en het maaiveld; Wikipedia; PDOK luchtfoto (achtkante trommels en
// minaretten, geribde koepels); Commons-foto's van de voorgevel, de zuidwest- en
// de zuidoostgevel (verhoudingen van de minaretten, de vensters en de ingang).
// Geschat zijn de hoogtes van het tweede en derde balkon, de lantaarns en de
// uivormige bekroningen (uit foto's, op de AHN-toppen geschaald), de doorsnede
// van de schachten (2,0 en 1,6 m), de vensternissen en de kiosk. Weggelaten: de
// halvemaantjes en pinakels op de koepels en minaretten (dunner dan 0,9 m), de
// open balkonhekken, de ribben van de koepels, de zonnepanelen, de groene
// raampjes in de minaretten en de kleuren.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "taibah-moskee");
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
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
const rad = (d) => (d * Math.PI) / 180;

const SLUG = "taibah-moskee";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP -3,05 m) ----------
const GROUND_NAP = -3.05;
const ORIGIN = [127218.36, 480944.6];
const X_AXIS = [0.69088, 0.72297]; // RD-richting 46,3 graden, langs de voor- en achtergevel
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// Contour van zaal en achterbouw (BAG, zonder de minaretvoeten): voorgevel v = 20,33, zuidwestgevel
// u = -15,3, achtergevel v = -23,5 en de noordoostgevel die vanaf (15,9; 4,03) schuin langs de metro loopt.
const FRONT_V = 20.33;
const SW_U = -15.3;
const BACK_V = -23.5;
const NE_KINK = [15.9, 4.03];
const NE_END = [7.12, BACK_V];
const OUTLINE = [[SW_U, FRONT_V], [15.33, FRONT_V], [15.34, 18.65], [15.39, 9.91], NE_KINK, NE_END, [SW_U, BACK_V]];
// Dak: vlak op +9,3 m (AHN 9,29 tot 9,34), afdekker van 0,45 m breed tot +9,6 m.
const ROOF_Z = 9.3;
const COPING = { width: 0.45, top: 9.6 };
// Opstand tussen zaal en achterbouw (AHN +10,4 tot +10,5 m, 1 m breed).
const UPSTAND = { v0: -8.2, v1: -7.2, top: 10.45 };
// Middenrisaliet aan de voorgevel: verhoogd tot +10,65 m, achterhoeken afgeschuind.
const RISALIT = { u: 3.6, v0: 13.9, top: 10.65, chamfer: 1.2 };
// Grote koepel: zestienhoekige trommel (vlakken op 5,75 m) tot +11,5 m, gemeten radiaal profiel [straal, hoogte].
const BIG_DOME = {
  c: [0, 0],
  drum: { flat: 5.75, top: 11.5 },
  profile: [[5.6, 11.5], [5.45, 12.8], [5.0, 14.0], [4.5, 14.8], [4.0, 15.4], [3.0, 16.25], [2.0, 16.85], [1.0, 17.3], [0, 17.7]],
};
// Kleine koepel op het risaliet: achthoekige trommel (vlakken op 2,75 m) van +10,65 tot +11,5 m, koepel 5,2 m doorsnee, top +14,4 m.
const FRONT_DOME = { c: [0, 17.2], drum: { flat: 2.75, top: 11.5 }, r: 2.6, top: 14.4 };
// Ronde trapopbouw aan de metrozijde (BAG-boog, AHN +8,5 m).
const STAIR = { c: [17.78, 6.23], r: 2.55, top: 8.5 };
// Installatie en twee piramidevormige daklichten op de achterbouw (AHN +1,2 tot +1,5 m boven het dak).
const ROOF_UNIT = { u: [-4.3, -1.2], v: [-19.0, -16.6], top: 10.8 };
const SKYLIGHTS = [[1.6, -18.5], [6.0, -21.0]];
const SKYLIGHT = { base: 2.0, h: 1.1 };

// Minaretten: achtkant met de vlakken langs de gevels (BAG-voeten van 3,15 m). Profiel van onder naar boven:
// voet, schuin uitkragende kraag tot het eerste balkon, schachten met kraag en balkon, lantaarn, uivormige bekroning.
// Elk deel: [vlakafstand onder, vlakafstand boven, z0, z1] (vlakafstand = breedte tussen twee evenwijdige vlakken).
const TALL_MINARET = [
  [3.15, 3.15, BASE, 11.3], // voet tot 2 m boven het dak
  [3.15, 4.4, 11.3, 12.5], // kraag met de groene raampjes (63 graden)
  [4.4, 4.4, 12.5, 12.8], // eerste balkon
  [2.0, 2.0, 12.8, 18.9], // schacht
  [2.0, 3.3, 18.9, 19.7], // kraag
  [3.3, 3.3, 19.7, 19.95], // tweede balkon
  [1.6, 1.6, 19.95, 23.6], // bovenschacht
  [1.6, 2.7, 23.6, 24.3], // kraag
  [2.7, 2.7, 24.3, 24.55], // derde balkon
  [1.7, 1.7, 24.55, 26.5], // lantaarn
  [1.7, 2.1, 26.5, 26.75], // lijst onder de koepel
  [2.1, 2.1, 26.75, 26.9],
];
const LOW_MINARET = [
  [3.15, 3.15, BASE, 11.3],
  [3.15, 4.4, 11.3, 12.5],
  [4.4, 4.4, 12.5, 12.8],
  [1.8, 1.8, 12.8, 16.5],
  [1.8, 3.0, 16.5, 17.2],
  [3.0, 3.0, 17.2, 17.45],
  [1.6, 1.6, 17.45, 19.3],
  [1.6, 2.0, 19.3, 19.55],
  [2.0, 2.0, 19.55, 19.7],
];
// Uivormige achtkante bekroning: [vlakafstand / 2, hoogte boven de voet]; top op +29,2 m (AHN +29,4 en +28,4) en +21,9 m (AHN +22,4 en +21,9).
const BULB = [[0.82, 0], [0.88, 0.25], [0.88, 1.0], [0.78, 1.4], [0.56, 1.8], [0.26, 2.1], [0, 2.3]];
const BULB_LOW = BULB.map(([r, h]) => [r * 0.95, h * 0.95]);
const MINARETS = [
  { name: "noord", c: [15.25, 20.22], profile: TALL_MINARET, bulb: BULB, outward: [0, 45, 90] },
  { name: "west", c: [-15.25, 20.22], profile: TALL_MINARET, bulb: BULB, outward: [90, 135, 180] },
  { name: "zuid", c: [-15.19, -10.3], profile: LOW_MINARET, bulb: BULB_LOW, outward: [135, 180, 225] },
  { name: "oost", c: [10.23, -10.28], profile: LOW_MINARET, bulb: BULB_LOW, outward: [-45, 0] },
];
// Hoekkiosk op de zuidhoek: achtkante hoekpijler (BAG 2,82 m) tot de afdekker, glazen lantaarn en koepeltje.
const KIOSK = { c: [-14.68, -22.95], flat: 2.82, lantern: 1.8, lanternTop: 11.0, domeTop: 11.85 };

// Vensters als nissen van 0,35 m diep met een spitsboog van 50 graden: [breedte, onderkant, top van het rechte deel].
const NICHE_DEPTH = 0.35;
const UPPER = [2.0, 3.6, 6.7];
const LOWER = [1.9, 0.4, 1.5];
const BIG_ARCH = [4.4, 0.2, 5.7]; // het grote venster in het risaliet
const ENTRANCE = [4.4, 0.1, 2.0]; // ingang van de achterbouw
const RECT = [2.0, 4.6, 7.4]; // rechthoekige vensters van de achterbouw (schuine bovenkant in de nis)
const MID_RECT = [1.8, 3.9, 5.6];
// Lichte gevelvlakken rond elk paar vensters, 0,15 m terug tussen bakstenen penanten: [breedte, onderkant, bovenkant].
const PANEL_DEPTH = 0.15;
const panel = (w) => [w, 0.2, 8.7];

// Maaiveld (AHN-DTM NAP -3,1 tot -2,95 m): straat voor de voorgevel, plein aan de zuidwestkant, stoep achter.
const GROUND_SAMPLES = [[0, 25.5], [-20, 2], [-4, -27]];
// Terugval als een uitsnede de bemonsteringspunten mist: de laagste PDOK-terreinhoogte op die punten (ellipsoïdisch).
const GROUND_HEIGHT_ELLIPSOIDAL = 39.85;

// ---------- bouwstenen ----------
// Achthoek met vlakken loodrecht op de assen (hoekpunten op 22,5 + k * 45 graden).
const octagon = ([cx, cy], flat, n = 8) => {
  const R = flat / 2 / Math.cos(Math.PI / n);
  return Array.from({ length: n }, (_, k) => {
    const a = Math.PI / n + (2 * Math.PI * k) / n;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
};
// Romp tussen twee evenwijdige veelhoeken (prisma of afgeknotte piramide).
const frustum = (c, flat0, flat1, z0, z1, n = 8) =>
  Manifold.hull([...octagon(c, flat0, n).map(([x, y]) => [x, y, z0]), ...octagon(c, flat1, n).map(([x, y]) => [x, y, z1])]);
// Achtkante omwenteling uit [halve vlakafstand, hoogte]-paren vanaf z0.
const octRevolve = (c, profile, z0) =>
  Manifold.union(profile.slice(1).map(([r1, h1], i) => {
    const [r0, h0] = profile[i];
    const ring = (r, h) => (r > 1e-6 ? octagon(c, 2 * r).map(([x, y]) => [x, y, z0 + h]) : [[c[0], c[1], z0 + h]]);
    return Manifold.hull([...ring(r0, h0), ...ring(r1, h1)]);
  }));
// Nis met een spitsboog van 50 graden (breedte w, recht deel van z0 tot z1) die naar -Y de muur in gaat.
const ARCH_RISE = Math.tan(rad(50));
const archCutter = ([w, z0, z1], depth = NICHE_DEPTH) =>
  profileY([[-w / 2, z0], [w / 2, z0], [w / 2, z1], [0, z1 + (w / 2) * ARCH_RISE], [-w / 2, z1]], -depth, 0.6);
// Rechthoekige nis waarvan het plafond onder 50 graden naar buiten oploopt (printbaar zonder steun).
const rectCutter = ([w, z0, z1], depth = NICHE_DEPTH) => {
  const slope = depth * ARCH_RISE;
  return Manifold.hull([
    box(-w / 2, w / 2, -depth, 0.6, z0, z1 - slope),
    box(-w / 2, w / 2, 0, 0.6, z0, z1),
  ]);
};
// Zet een snijder die naar +Y uit de muur kijkt op punt [x, y] in een muur met buitennormaal `normalDeg` (0 = +X).
const place = (cutter, [x, y], normalDeg) => cutter.rotate([0, 0, normalDeg - 90]).translate([x, y, 0]);

// ---------- zaal en achterbouw ----------
const outline = new CrossSection([ccw(OUTLINE)]);
let body = prism(OUTLINE, BASE, ROOF_Z);
const coping = Manifold.extrude(outline.subtract(outline.offset(-COPING.width, "Miter")), COPING.top - ROOF_Z + 0.05).translate([0, 0, ROOF_Z - 0.05]);
const upstand = Manifold.intersection([
  box(SW_U, 20, UPSTAND.v0, UPSTAND.v1, ROOF_Z - 0.05, UPSTAND.top),
  prism(OUTLINE, ROOF_Z - 1, UPSTAND.top + 1),
]);
const risalit = prism(
  [[-RISALIT.u, FRONT_V], [-RISALIT.u, RISALIT.v0 + RISALIT.chamfer], [-RISALIT.u + RISALIT.chamfer, RISALIT.v0], [RISALIT.u - RISALIT.chamfer, RISALIT.v0], [RISALIT.u, RISALIT.v0 + RISALIT.chamfer], [RISALIT.u, FRONT_V]],
  ROOF_Z - 0.05,
  RISALIT.top,
);

// Vensternissen per gevel. Noordwest (voorgevel): drie traveeën aan weerszijden van het risaliet, het grote venster in het midden.
const cutters = [];
const frontBays = [5.28, 8.63, 11.98];
for (const s of [-1, 1]) {
  for (const b of frontBays) {
    cutters.push(place(archCutter(UPPER), [s * b, FRONT_V], 90), place(archCutter(LOWER), [s * b, FRONT_V], 90));
    cutters.push(place(rectCutter(panel(2.6), PANEL_DEPTH), [s * b, FRONT_V], 90));
  }
}
cutters.push(place(archCutter(BIG_ARCH), [0, FRONT_V], 90));
// Zuidwest: zeven traveeën in de zaal, drie in de achterbouw (rechthoekige bovenvensters).
for (let k = 0; k < 7; k++) {
  const v = -6.6 + k * 3.9;
  cutters.push(place(archCutter(UPPER), [SW_U, v], 180), place(archCutter(LOWER), [SW_U, v], 180));
  cutters.push(place(rectCutter(panel(2.8), PANEL_DEPTH), [SW_U, v], 180));
}
for (const v of [-13.7, -16.9, -20.1]) {
  cutters.push(place(rectCutter(RECT), [SW_U, v], 180), place(archCutter(LOWER), [SW_U, v], 180));
  cutters.push(place(rectCutter(panel(2.6), PANEL_DEPTH), [SW_U, v], 180));
}
// Zuidoost (achterbouw, Tooba Islamic Centre): zes spitsboogvensters boven, rechthoekige vensters in het midden,
// spitsbogen onder en de grote ingang onder het vierde en vijfde venster.
const backBays = [-11.95, -8.8, -5.65, -2.5, 0.65, 3.8];
for (const u of backBays) {
  cutters.push(place(archCutter([1.8, 6.1, 7.2]), [u, BACK_V], -90), place(rectCutter(panel(2.5), PANEL_DEPTH), [u, BACK_V], -90));
}
for (const u of [-11.95, -8.8, -5.65, 3.8]) {
  cutters.push(place(rectCutter(MID_RECT), [u, BACK_V], -90), place(archCutter(LOWER), [u, BACK_V], -90));
}
cutters.push(place(archCutter(ENTRANCE), [-0.95, BACK_V], -90));
// Noordoost (schuin langs de metro): vier traveeën in de zaal en drie in de achterbouw, plus één op het rechte stuk bij de noordhoek.
const neDir = [NE_END[0] - NE_KINK[0], NE_END[1] - NE_KINK[1]];
const neLen = Math.hypot(...neDir);
const neNormal = (Math.atan2(neDir[0], -neDir[1]) * 180) / Math.PI; // buitennormaal (naar +X)
for (const s of [3.0, 6.2, 9.4, 12.6, 18.8, 21.9, 25.0]) {
  const p = [NE_KINK[0] + (neDir[0] * s) / neLen, NE_KINK[1] + (neDir[1] * s) / neLen];
  cutters.push(place(archCutter(UPPER), p, neNormal), place(archCutter(LOWER), p, neNormal));
  cutters.push(place(rectCutter(panel(2.5), PANEL_DEPTH), p, neNormal));
}
cutters.push(place(archCutter(UPPER), [15.35, 14.3], 0), place(archCutter(LOWER), [15.35, 14.3], 0));
body = body.subtract(Manifold.union(cutters));

// ---------- koepels ----------
const bigDrum = frustum(BIG_DOME.c, BIG_DOME.drum.flat * 2, BIG_DOME.drum.flat * 2, ROOF_Z - 0.05, BIG_DOME.drum.top, 16);
const bigDome = Manifold.revolve(new CrossSection([ccw([[0, BIG_DOME.drum.top - 0.01], ...BIG_DOME.profile])]), 64).translate([BIG_DOME.c[0], BIG_DOME.c[1], 0]);
const frontDrum = frustum(FRONT_DOME.c, FRONT_DOME.drum.flat * 2, FRONT_DOME.drum.flat * 2, RISALIT.top - 0.05, FRONT_DOME.drum.top);
// Kleine koepel: halve ellips (straal 2,6 m, opgang 2,9 m).
const frontProfile = [[0, FRONT_DOME.drum.top - 0.01]];
for (let k = 0; k <= 12; k++) {
  const t = (k / 12) * (Math.PI / 2);
  frontProfile.push([k === 12 ? 0 : FRONT_DOME.r * Math.cos(t), FRONT_DOME.drum.top + (FRONT_DOME.top - FRONT_DOME.drum.top) * Math.sin(t)]);
}
const frontDome = Manifold.revolve(new CrossSection([ccw(frontProfile)]), 48).translate([FRONT_DOME.c[0], FRONT_DOME.c[1], 0]);

// ---------- trapopbouw, installatie en daklichten ----------
const stair = Manifold.union([
  Manifold.cylinder(STAIR.top - BASE, STAIR.r, STAIR.r, 48).translate([STAIR.c[0], STAIR.c[1], BASE]),
  prism([[15.39, 9.91], [18.57, 8.85], [18.0, 3.66], [15.9, 4.03]], BASE, STAIR.top),
]);
const roofUnit = box(ROOF_UNIT.u[0], ROOF_UNIT.u[1], ROOF_UNIT.v[0], ROOF_UNIT.v[1], ROOF_Z - 0.05, ROOF_UNIT.top);
const skylights = SKYLIGHTS.map(([u, v]) =>
  Manifold.hull([
    ...[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [u + (a * SKYLIGHT.base) / 2, v + (b * SKYLIGHT.base) / 2, ROOF_Z - 0.05]),
    [u, v, ROOF_Z + SKYLIGHT.h],
  ]),
);

// ---------- minaretten ----------
const minaret = ({ c, profile, bulb, outward }) => {
  let m = Manifold.union(profile.map(([f0, f1, z0, z1]) => frustum(c, f0, f1, z0, z1)));
  const top = profile[profile.length - 1][3];
  m = Manifold.union([m, octRevolve(c, bulb, top - 0.01)]);
  // Smalle spitsboognissen (0,9 m) in de buitenste vlakken van de voet, onder en boven de dakrand.
  const half = profile[0][0] / 2;
  const slits = [];
  for (const a of outward) {
    const p = [c[0] + half * Math.cos(rad(a)), c[1] + half * Math.sin(rad(a))];
    slits.push(place(archCutter([0.9, 3.6, 5.6], 0.3), p, a), place(archCutter([0.9, 7.0, 8.6], 0.3), p, a));
  }
  return m.subtract(Manifold.union(slits));
};

// ---------- hoekkiosk ----------
const kiosk = Manifold.union([
  frustum(KIOSK.c, KIOSK.flat, KIOSK.flat, BASE, COPING.top),
  frustum(KIOSK.c, KIOSK.lantern, KIOSK.lantern, COPING.top - 0.01, KIOSK.lanternTop),
  octRevolve(KIOSK.c, [[0.88, 0], [0.85, 0.3], [0.62, 0.6], [0.3, 0.8], [0, KIOSK.domeTop - KIOSK.lanternTop]], KIOSK.lanternTop - 0.01),
]);

const complex = Manifold.union([
  body,
  coping,
  upstand,
  risalit,
  bigDrum,
  bigDome,
  frontDrum,
  frontDome,
  stair,
  roofUnit,
  ...skylights,
  kiosk,
  ...MINARETS.map(minaret),
]);
const nodes = [["building:moskee", complex]];
const all = complex;

const META = {
  name: "Taibah-moskee",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT_ELLIPSOIDAL,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0363100012125533"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (127218,36, 480944,60), het hart van de grote koepel, op het maaiveld (NAP -3,05 m), +X langs de voorgevel naar het noordoosten (46,3 graden vanaf de RD-X-as) en +Y loodrecht daarop naar de voorgevel aan de Karspeldreef. Eén node building:moskee: de vierkante gebedszaal en de achterbouw met een vlak dak op +9,3 m en een afdekker, vensternissen met spitsbogen in alle gevels, het verhoogde middenrisaliet met het grote spitsboogvenster en de kleine koepel (top +14,4 m), de grote koepel op een zestienhoekige trommel (top +17,7 m), de opstand tussen zaal en achterbouw, de ronde trapopbouw aan de metrozijde, de hoekkiosk en vier achtkante minaretten met uivormige bekroning: twee aan de voorgevel van +29,2 m met drie balkons en twee achter van +21,9 m met twee balkons. Onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog, staan verticaal of hellen onder 45 graden. Vervangt de PDOK-reconstructie van het pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    roofM: ROOF_Z,
    risalitM: RISALIT.top,
    bigDomeTopM: BIG_DOME.profile[BIG_DOME.profile.length - 1][1],
    bigDomeDiameterM: BIG_DOME.profile[0][0] * 2,
    frontDomeTopM: FRONT_DOME.top,
    tallMinaretTopM: +(TALL_MINARET[TALL_MINARET.length - 1][3] + BULB[BULB.length - 1][1] - 0.01).toFixed(2),
    lowMinaretTopM: +(LOW_MINARET[LOW_MINARET.length - 1][3] + BULB_LOW[BULB_LOW.length - 1][1] - 0.01).toFixed(2),
    minaretBalconiesM: [12.8, 19.95, 24.55],
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Moskee_Taibah",
    "PDOK BAG pand 0363100012125533, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: het dak, het risaliet, de koepels, de minaretten, de trapopbouw en het maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons: foto's van de voorgevel (Karspeldreef), de zuidwestgevel en de achterbouw",
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

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
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
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
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

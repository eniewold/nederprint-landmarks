// Genereert een gesloten 3D-model van Kasteel Helmond uit dakvlakken en
// bouwdelen: de vierkante waterburcht van circa 35 bij 35 m met vier ronde
// hoektorens (een boogfries op een kraag, een flauwe rok en een achtkantige
// leien spits tot +21,4 tot +23,8 m), de zuidvleugel onder één nok (+15,8 m)
// met trapgevels aan beide kopse kanten, drie gevelkapellen en twee
// schoorstenen, de west- en oostvleugel met zadeldaken en trapgevels aan de
// noordkant, de lage noordvleugel met het poortgebouw (trapgevels aan de brug en
// aan de binnenplaats, spitse poortnissen) tussen twee vierkante torens met
// tentdaken, aan de binnenplaats de galerij met een dwarskap, de gang langs de
// oostvleugel, het ronde traptorentje met een schacht en een portaal, en als
// tweede node de gemetselde dam met borstweringen van de voorhof naar de poort.
// Elk dak is een vlak z = a u + b v + c uit het AHN en de LoD2.2-vlakken van de
// 3D BAG. Het Mapbox-model is niet gebruikt. Alle maten in het script zijn
// meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-kasteel-helmond.mjs              # 1:1000 (standaard)
//   node scripts/generate-kasteel-helmond.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (173473,5, 387595), midden in het kasteel, op
// het maaiveld van de binnenplaats (NAP +18,2 m), Z omhoog. +X loopt langs de
// noord- en zuidgevel naar het oosten (6,2 graden linksom vanaf de RD-X-as,
// gemeten aan de nokken en de normalen van de LoD2.2-dakvlakken) en +Y
// loodrecht daarop naar het noorden, waar de poort en de dam liggen. Het kasteel
// staat rondom in de slotgracht (PDOK-water 1,55 m onder de binnenplaats); het
// model begint 2,8 m onder de binnenplaats.
//
// Bronnen: PDOK BAG-pand 0794100000389999; AHN DSM/DTM 0,5 m (PDOK WCS) voor de
// nokken, goten, torens, schoorstenen, binnenplaats en dam; 3D BAG LoD2.2
// (api.3dbag.nl); BGT (overbruggingsdeel en waterdeel: de dam); Wikipedia;
// PDOK luchtfoto; foto's op Wikimedia Commons van alle vier de kanten en de
// binnenplaats. Geschat zijn de goothoogte en de kraag van de hoektorens, de
// hoogte van de spits van de zuidwesttoren (het AHN mist de punt), de
// trapgevels, de gevelkapellen, het portaal en de schacht bij het traptorentje
// en de vensternissen. Weggelaten: de doorgang onder de dam (minder dan 0,9 m
// boven het water), de muren langs de voorhof, de dakkapellen aan de
// binnenplaatszijde en de dakkapelletjes in de tentdaken (kleiner dan 0,9 m),
// de overstekende goten (vrije overhang) en de pinakels op de spitsen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-helmond");
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
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, BASE, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
// Vlak door de gevellijn p0-p1, stijgend naar binnen (kant van 'inside') met helling t vanaf z0.
const facet = ([x0, y0], [x1, y1], z0, t, [ix, iy]) => {
  const len = Math.hypot(x1 - x0, y1 - y0);
  let nx = -(y1 - y0) / len;
  let ny = (x1 - x0) / len;
  if (nx * (ix - x0) + ny * (iy - y0) < 0) {
    nx = -nx;
    ny = -ny;
  }
  return [t * nx, t * ny, z0 - t * (nx * x0 + ny * y0)];
};
// Doorsneden in plan voor de tussenstukken van een geleding (convexe veelhoeken).
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const diamond = ([cx, cy], r) => [[cx + r, cy], [cx, cy + r], [cx - r, cy], [cx, cy - r]];
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek]; verspringingen en spitsen.
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel: vierkante schacht met een piramide erop.
const pinnacle = (c, half, z0, shaft, point) =>
  loft([[z0, sq(c, half)], [z0 + shaft, sq(c, half)], [z0 + shaft + point, tip(c)]]);
// Steunbeer tegen een gevel die naar -v kijkt (zuid): breedte w, diepte d, bovenkant zw tegen de muur en zo aan de buitenkant.
// angle draait de gevel: 0 zuid, 90 oost, 180 noord, 270 west; [x, y] is het punt in de gevel.
const buttress = ([x, y], angle, w, d, zw, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 59 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +u) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.9) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.4,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Regelmatige veelhoek: hoekpunten op de hoeken angs (graden) rond c, voor een veelhoek met apothema apo en zijdehoek step.
const ngon = (c, apo, angs, step) =>
  angs.map((a) => {
    const r = apo / Math.cos(((step / 2) * Math.PI) / 180);
    return [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  });
// Dakvlak boven een gevel met de normaal naar phi (graden) op apothema apo rond c: goot z0, helling t naar binnen.
const facetPhi = (c, phi, apo, z0, t) => {
  const cp = Math.cos((phi * Math.PI) / 180);
  const sp = Math.sin((phi * Math.PI) / 180);
  return [-t * cp, -t * sp, z0 + t * apo + t * (c[0] * cp + c[1] * sp)];
};
// Doorsnede van een of meer veelhoeken en een rand (borstwering) van breedte w langs de omtrek, van z0 tot z1.
const section = (...polys) => CrossSection.union(polys.map((p) => new CrossSection([ccw(p)])));
const band = (cs, w, z0, z1) => Manifold.extrude(cs.subtract(cs.offset(-w, "Miter")), z1 - z0).translate([0, 0, z0]);
// Pinakel op een steunbeer die tot de onderkant doorloopt: vierkante schacht tot z1 en een piramide.
const pier = (c, half, z1, point) => loft([[BASE, sq(c, half)], [z1, sq(c, half)], [z1 + point, tip(c)]]);

const SLUG = "kasteel-helmond";

// ---------- maten (lokaal stelsel, z = hoogte boven de binnenplaats op NAP +18,2 m) ----------
const GROUND_NAP = 18.2;
const ORIGIN = [173473.5, 387595.0];
const X_AXIS = [0.994151, 0.108002]; // RD-richting 6,2 graden, langs de noord- en zuidgevel
// De gevels staan rondom in de slotgracht (PDOK-water 1,55 m onder de binnenplaats); het model begint 1,25 m daaronder.
const BASE = -2.8;

// Buitengevels (BAG): west u = -17,42, oost u = 17,19, zuid v = -17,22, noord v = 17,76.
const W = -17.42;
const E = 17.19;
const S = -17.22;
const N = 17.76;
// Binnengevels aan de binnenplaats: westvleugel u = -8,9, oostvleugel u = 10,3, gang langs de oostvleugel u = 8,3,
// zuidvleugel v = -7,0, galerij v = 0,4, noordvleugel v = 13,0.
const IW = -8.9;
const IE = 10.3;

// Dakvlakken z = a u + b v + c, gefit op het AHN-DSM (0,5 m) en de 3D BAG.
const RIDGE = 15.8; // nok van de zuid- en westvleugel (NAP +34,0 m)
const SOUTH_S = [0, 1.088, RIDGE + 1.088 * 12.0]; // zuidhelling, nok op v = -12 m (47 graden)
const SOUTH_N = [0, -1.136, RIDGE - 1.136 * 12.0]; // noordhelling naar de binnenplaats (49 graden)
const SOUTH_GUTTER = 12.1; // vlakke goot langs de binnenplaats (v -8,8 tot -7,0 m)
const WEST = ridgeU(-13.2, RIDGE, 1.27); // westvleugel, nok op u = -13,2 m (52 graden)
const EAST = ridgeU(13.8, 15.0, 1.42); // oostvleugel, nok op u = 13,8 m (+15 m, 55 graden)
const NORTH = ridgeV(15.35, 11.9, 1.27); // noordvleugel, nok op v = 15,35 m (+11,9 m)

// Vier ronde hoektorens: middelpunt en straal uit de BAG-contour, spits uit het AHN (NAP +39,6 tot +42 m).
const TOWERS = [
  { name: "NW", c: [-17.58, 17.63], r: 3.8, apex: 23.3, win: [115, 155] },
  { name: "NE", c: [17.2, 17.84], r: 4.1, apex: 23.8, win: [25, 65] },
  { name: "SW", c: [-17.71, -17.33], r: 4.4, apex: 22.6, win: [205, 245] },
  { name: "SE", c: [17.19, -17.12], r: 4.0, apex: 21.4, win: [295, 335] },
];
const FRIEZE = 11.1; // boogfries op een kraag van 0,3 m
const TOWER_EAVE = 12.7; // goot van de torens (NAP +30,9 m)
const SPIRE_FOOT = { r: 2.1, z: 14.6 }; // voet van de spits boven de rok

// Poortgebouw midden in de noordvleugel (BAG: u -2,6 tot 1,9 m).
const GATE = { c: -0.35, u0: -2.8, u1: 2.1 };

// Maaiveld: de binnenplaats (NAP +18,2 m), niet de gracht.
const GROUND_SAMPLES = [[-5, 9], [4, 9], [0, 5]];

// ---------- hulpvormen ----------
const circle = ([cx, cy], r, n = 48) =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)]);
// Achthoek met de hoekpunten op straal r (binnen de cirkel, dus zonder overhang op een ronde muur).
const octR = ([cx, cy], r) =>
  Array.from({ length: 8 }, (_, k) => [cx + r * Math.cos(Math.PI / 8 + (k * Math.PI) / 4), cy + r * Math.sin(Math.PI / 8 + (k * Math.PI) / 4)]);
// Trapgevel in een gevel: 'axis' u (gevel op v = face, de treden lopen langs u) of v (gevel op u = face);
// 'into' is de richting het gebouw in, t de dikte. Treden van de nok uit: halve breedtes hw[k] met bovenkant top[k].
const steps = (axis, face, into, t, c, s0, s1, hw, top) =>
  hw.map((h, k) => {
    const a0 = Math.max(s0, c - h);
    const a1 = Math.min(s1, c + h);
    const b0 = Math.min(face, face + into * t);
    const b1 = Math.max(face, face + into * t);
    return prism(axis === "u" ? rect(a0, a1, b0, b1) : rect(b0, b1, a0, a1), BASE, top[k]);
  });
// Trapgevel langs een dakprofiel: n treden per zijde over halve breedte H, tredes 'rise' boven de dakrand.
const stepGable = (axis, face, into, c, s0, s1, H, ridgeZ, slope, n, rise = 1.0) => {
  const hw = Array.from({ length: n }, (_, k) => H * (1 - k / n));
  const top = hw.map((_, k) => ridgeZ - slope * (k + 1 < n ? hw[k + 1] : 0) + (k + 1 < n ? rise : rise + 0.4));
  return steps(axis, face, into, 0.6, c, s0, s1, hw, top);
};

// ---------- kasteel ----------
const solids = [];

// Zuidvleugel over de hele breedte onder één nok, met een vlakke goot aan de binnenplaats.
solids.push(roofed(rect(W, E, S, -8.8), [SOUTH_S, SOUTH_N]));
solids.push(prism(rect(IW, IE, -8.8, -7.0), BASE, SOUTH_GUTTER));
// West- en oostvleugel van de nok van de zuidvleugel tot de noordgevel (kilgoten met de zuidvleugel).
solids.push(roofed(rect(W, IW, -12.0, N), WEST));
solids.push(roofed(rect(IE, E, -12.0, N), EAST));
// Noordvleugel tussen de west- en oostvleugel, tot waar de nok in hun dakvlakken verdwijnt.
solids.push(roofed(rect(-10.3, 11.7, 13.0, N), NORTH));
// Aan de binnenplaats: de vlakke gang langs de zuidvleugel (+10,2 m), de galerij met de nok op v = -2,2 m (+12,7 m)
// en een dwarskap naar de binnenplaats (nok +12,9 m), en de gang langs de oostvleugel (+9,5 m).
solids.push(prism(rect(IW, IE + 0.2, -7.0, -3.4), BASE, 10.2));
solids.push(roofed(rect(-10.9, 12.3, -3.6, 0.4), ridgeV(-2.2, 12.7, 2.0)));
solids.push(roofed(rect(-3.2, 3.2, -2.2, 1.5), ridgeU(0, 12.9, 0.84)));
solids.push(prism(rect(8.3, IE, 0.0, 13.2), BASE, 9.5));
// Portaal in de zuidwesthoek van de binnenplaats (twee bouwlagen, plat dak).
solids.push(prism(rect(IW - 0.2, -5.8, 0.2, 3.4), BASE, 7.5));

// Trapgevels: zuidvleugel aan beide kopse kanten, west- en oostvleugel aan de noordkant.
solids.push(...stepGable("v", W, 1, -12.0, S, -7.0, 5.2, RIDGE, 1.09, 5));
solids.push(...stepGable("v", E, -1, -12.0, S, -7.0, 5.2, RIDGE, 1.09, 5));
solids.push(...stepGable("u", N, -1, -13.2, W, IW, 4.3, RIDGE, 1.27, 4));
solids.push(...stepGable("u", N, -1, 13.8, IE, E, 3.45, 15.0, 1.42, 3));

// Drie gevelkapellen in de zuidgevel (2,8 m breed, nokken tot +12,3 m).
for (const u of [-2.11, 0.67, 3.46]) solids.push(roofed(rect(u - 1.39, u + 1.39, S, -14.9), ridgeU(u, 12.3, 1.0)));

// Poortgebouw: een risaliet van 0,3 m aan beide kanten met een trapgevel (vier treden en twee pinakels) en een kapje naar de nok.
const gateGable = (face, into) => {
  const b0 = Math.min(face, face + into * 0.9);
  const b1 = Math.max(face, face + into * 0.9);
  const out = [];
  for (const [h, z] of [[2.45, 9.9], [1.75, 10.9], [1.05, 11.9], [0.45, 13.1]]) out.push(prism(rect(GATE.c - h, GATE.c + h, b0, b1), BASE, z));
  for (const s of [-1, 1]) out.push(prism(rect(GATE.c + s * 2.0 - 0.45, GATE.c + s * 2.0 + 0.45, b0, b1), BASE, 11.3));
  return out;
};
solids.push(prism(rect(GATE.u0, GATE.u1, N - 0.1, N + 0.3), BASE, 8.9));
solids.push(prism(rect(GATE.u0, GATE.u1, 12.7, 13.1), BASE, 8.9));
solids.push(...gateGable(N + 0.3, -1), ...gateGable(12.7, 1));
solids.push(roofed(rect(GATE.c - 2.0, GATE.c + 2.0, 12.7, N + 0.3), ridgeU(GATE.c, 11.6, 1.2)));

// Twee vierkante torens (4 m) met een tentdak tot +15,6 m aan weerszijden van de poort.
for (const c of [[-9.3, 15.5], [8.8, 15.5]]) solids.push(loft([[BASE, sq(c, 2.0)], [12.1, sq(c, 2.0)], [15.6, tip(c)]]));

// Rond traptorentje in de zuidwesthoek van de binnenplaats met een boogfries, een achtkant dak en een vierkante schacht.
{
  const c = [-10.0, -0.6];
  solids.push(loft([[BASE, circle(c, 1.6, 32)], [15.6, circle(c, 1.6, 32)], [15.9, circle(c, 1.85, 32)], [17.1, circle(c, 1.85, 32)]]));
  solids.push(loft([[17.1, octR(c, 1.85)], [20.0, tip(c)]]));
  solids.push(prism(sq([-10.5, -2.6], 0.6), BASE, 19.0));
}

// Schoorstenen: twee op de nok van de zuidvleugel (+18,9 m), een op de westvleugel.
for (const u of [-6.9, 7.6]) solids.push(prism(rect(u - 0.7, u + 0.7, -12.5, -11.5), BASE, 18.9));
solids.push(prism(sq([-13.2, 0.75], 0.45), BASE, 16.8));

// De vier hoektorens: muur tot de boogfries, kraag van 0,3 m, goot op +12,7 m, een flauwe rok en een achtkantige spits.
for (const T of TOWERS) {
  const { c, r, apex } = T;
  solids.push(loft([[BASE, circle(c, r)], [FRIEZE, circle(c, r)], [FRIEZE + 0.35, circle(c, r + 0.3)], [TOWER_EAVE, circle(c, r + 0.3)]]));
  solids.push(loft([[TOWER_EAVE, octR(c, r + 0.3)], [SPIRE_FOOT.z, octR(c, SPIRE_FOOT.r)], [apex, tip(c)]]));
}

let castle = Manifold.union(solids);

// Vensternissen in de buitengevels en de torens, en de spitse poortnissen aan beide kanten.
const cuts = [];
const rows = [[4.0, 6.0], [7.4, 8.6]];
for (const u of [-10.8, -8.1, -5.4, -2.7, 0, 2.7, 5.4, 8.1, 10.8]) for (const [z0, z1] of rows) cuts.push(niche([u, 0], 270, -S, 0, 1.3, z0, z1, 0.4));
for (const v of [-10.5, -7.5, -4.5, -1.5, 1.5, 4.5, 7.5, 10.5]) {
  for (const [z0, z1] of rows) cuts.push(niche([0, v], 180, -W, 0, 1.3, z0, z1, 0.4), niche([0, v], 0, E, 0, 1.3, z0, z1, 0.4));
}
for (const u of [-6.0, -4.0, 3.6, 5.8]) for (const [z0, z1] of [[3.4, 5.2], [6.4, 7.4]]) cuts.push(niche([u, 0], 90, N, 0, 1.2, z0, z1, 0.4));
for (const u of [-12.3, -10.2, 11.7]) for (const [z0, z1] of rows) cuts.push(niche([u, 0], 90, N, 0, 1.2, z0, z1, 0.4));
for (const T of TOWERS) for (const a of T.win) for (const z of [3.6, 7.6]) cuts.push(niche(T.c, a, T.r, 0, 1.0, z, z + 1.6, 0.4));
// Poort aan de brug: een spitse blinde boog en daarin de poortnis; aan de binnenplaats een poortnis.
cuts.push(niche([GATE.c, 0], 90, N + 0.3, 0, 3.8, 0.4, 4.0, 0.3), niche([GATE.c, 0], 90, N + 0.3, 0, 2.8, -0.1, 3.0, 0.9));
cuts.push(niche([GATE.c, 0], 270, -12.7, 0, 3.0, -0.1, 3.0, 0.9));
castle = castle.subtract(Manifold.union(cuts));

// ---------- dam naar de voorhof ----------
// BGT: tussen de waterdelen loopt een gemetselde dam van 5 m breed (u -2,85 tot 2,0 m) van de poort tot de voorhof
// (v 34,8 m), met een overbrugging bij de poort; het dek daalt van NAP +18,15 naar +17,7 m. Borstweringen van 0,9 m breed
// en 1 m hoog aan beide zijden, aan het eind schuin naar de oevers.
const deck = (v) => -0.05 - 0.0293 * (v - N);
const DECK = [0, -0.0293, -0.05 + 0.0293 * N];
const RAIL = [0, -0.0293, -0.05 + 0.0293 * N + 1.0];
const bridge = (() => {
  const parts = [cutBelow(prism([[-2.85, N], [2.0, N], [2.0, 32.3], [4.3, 34.5], [4.3, 34.8], [-5.3, 34.8], [-2.85, 32.4]], BASE, 2), DECK)];
  // Borstwering als strook van 0,9 m aan de binnenkant van een lijn langs de oever.
  const rail = (pts, side) => {
    for (let i = 0; i + 1 < pts.length; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const len = Math.hypot(x1 - x0, y1 - y0);
      const nx = (side * -(y1 - y0)) / len;
      const ny = (side * (x1 - x0)) / len;
      parts.push(cutBelow(prism([[x0, y0], [x1, y1], [x1 + 0.9 * nx, y1 + 0.9 * ny], [x0 + 0.9 * nx, y0 + 0.9 * ny]], BASE, 3), RAIL));
    }
  };
  rail([[-2.85, N + 0.3], [-2.85, 32.4], [-5.3, 34.8]], -1);
  rail([[2.0, N + 0.3], [2.0, 32.3], [4.3, 34.5]], 1);
  return Manifold.union(parts);
})();

const nodes = [
  ["building:kasteel", castle],
  ["road:dam", bridge],
];
const all = Manifold.union([castle, bridge]);

const META = {
  name: "Kasteel Helmond",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 62.0,
  replacesBuildings: ["0794100000389999"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (173473,5, 387595), midden in het kasteel, op het maaiveld van de binnenplaats (NAP +18,2 m), +X langs de noord- en zuidgevel (6,2 graden linksom vanaf de RD-X-as) en +Y loodrecht daarop naar de poort. Node building:kasteel uit dakvlakken en bouwdelen: de zuidvleugel onder één nok met trapgevels, gevelkapellen en schoorstenen, de west- en oostvleugel met zadeldaken en trapgevels, de noordvleugel met het poortgebouw (trapgevels en spitse poortnissen) tussen twee vierkante torens met tentdaken, de galerij met een dwarskap, de gangen en het ronde traptorentje aan de binnenplaats, vier ronde hoektorens met een kraag, een rok en een achtkantige spits, en vensternissen. Node road:dam: de dam met borstweringen van de voorhof naar de poort. Onderkant 2,8 m onder de binnenplaats, in de slotgracht; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van het kasteel. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { southRidgeM: RIDGE, eastRidgeM: 15.0, northRidgeM: 11.9, towerEaveM: TOWER_EAVE, northEastSpireM: 23.8, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Kasteel_Helmond",
    "PDOK BAG pand 0794100000389999 (het kasteel), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, goten, torens, schoorstenen, binnenplaats en dam",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken",
    "PDOK BGT (overbruggingsdeel, waterdeel): de dam naar de voorhof",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's van de noord-, west-, zuid- en oostkant en de binnenplaats",
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
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
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

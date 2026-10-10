// Genereert een gesloten 3D-model van het Centraal Museum in Utrecht: het
// voormalige Agnietenklooster aan de Agnietenstraat en het Nicolaaskerkhof
// (verbouwd tot museum in 1917-1921), met de straatvleugel, het hoekpaviljoen
// met twee topgevels, de westvleugel met twee evenwijdige daken (in het
// noorden sinds kort een plat dak ertussen, in het zuiden een kilgoot), de
// middenvleugel tussen de kloostertuin en de oostelijke binnenplaats met
// lisenen en dakkapellen, de kloosterkapel langs de straat met de veelhoekige
// sluiting, de ronde traptoren met lantaarn, de glazen trapschijf en het lage
// glazen entreegebouw van 1999 aan de zuidkant; het hoge mansardehuis
// Agnietenstraat 3 met het achterhuis, de achtkante glazen paviljoenkap en
// het lage glazen gebouw aan de binnenplaats; en het lange stallencomplex van
// 1835 (sinds 1987 tentoonstellingszalen) onder schilddaken. Elk dak is een
// vlak z = a u + b v + c in het eigen stelsel van de vleugel, met nok- en
// goothoogtes uit het AHN en de LoD2.2-vlakken van de 3D BAG; de muren staan
// op de BAG-contouren. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, drie nodes met de materiaalklasse in
// de nodenaam) als catalogusbron voor de export en de kaart, plus een binaire
// STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-centraal-museum.mjs              # 1:1000 (standaard)
//   node scripts/generate-centraal-museum.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (137085, 455070), in de kloostertuin, op het
// maaiveld (NAP +3,1 m aan de Agnietenstraat en in de tuin), Z omhoog. +X
// (u) loopt langs de Agnietenstraat naar het noordoosten (33 graden tegen de
// klok in vanaf de RD-X-as), +Y (v) loodrecht daarop naar de straat
// (noordwest). Eigen stelsels: de westvleugel staat 4,38 graden met de klok
// mee gedraaid, de middenvleugel 6,76 graden tegen de klok in en de stallen
// 20,9 graden tegen de klok in (alle om dezelfde oorsprong).
//
// Panden: BAG 0344100000029906 (Agnietenstraat 1, het klooster met kapel,
// traptoren en de glazen aanbouwen), 0344100000081865 (Agnietenstraat 3 en de
// glazen gebouwen erachter) en 0344100000081866 (de stallen, Nicolaasdwars-
// straat 20). Niet meegenomen: het nijntje museum (Agnietenstraat 2, het
// voormalige Willem Arntsz Huis, BAG 0344100000154560) aan de overkant van de
// straat, de Fundatie van Renswoude (Agnietenstraat 5, BAG 0344100000004952)
// en de Nicolaikerk (BAG 0344100000014155): dat zijn aparte gebouwen.
//
// Bronnen: PDOK BAG (contouren hieronder in bagOutlines(), lokale meters); AHN
// DSM/DTM 0,5 m (PDOK WCS) voor nokken, goten, dakkapellen, schoorstenen en
// het maaiveld; 3D BAG LoD2.2 (api.3dbag.nl, opname 2023) voor de hellingen,
// het platte dak dat in de noordelijke westvleugel de kilgoot vervangt, de
// glazen schijf, de lage glazen gebouwen en de paviljoenkap; PDOK luchtfoto
// (Actueel_orthoHR) voor de indeling van de daken en de dakkapellen; foto's
// op Wikimedia Commons (straatgevel, kapel, tuingevels, traptoren) en
// Wikipedia. Geschat: de vensternissen (ritme en maten van foto's), de
// borstweringen van de topgevels (0,5 m boven het dak), de traptoren boven de
// kroonlijst (lantaarn en spits; het AHN geeft +25,5 m op de as), de
// schoorsteen op de zuidgevel van de middenvleugel en de vensters van de
// stallen. Weggelaten: maaswerk, regenpijpen, de lichtstraten (minder dan
// 0,9 m hoog), het verdiepte glazen terras tussen de westvleugel en de
// glazen schijf (in het AHN op maaiveldhoogte) en de kunstwerken in de tuin.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const SLUG = "centraal-museum";
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), SLUG);
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- maten (lokaal stelsel; hoogtes in NAP, z = NAP - GROUND_NAP) ----------
const ORIGIN = [137085, 455070];
const AXIS_DEG = 33;
const X_AXIS = [Math.cos((AXIS_DEG * Math.PI) / 180), Math.sin((AXIS_DEG * Math.PI) / 180)];
const GROUND_NAP = 3.1;
const z = (nap) => nap - GROUND_NAP;
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// Maaiveld op straat, op het Nicolaaskerkhof en in de kloostertuin (AHN NAP +3,1 tot +3,2 m).
const GROUND_SAMPLES = [[0, 21], [-10, 21], [-23, 0], [5, -5]];
// Ellipsoïdische terugval voor het maaiveld: de laagste PDOK-terreinhoogte op die punten.
const GROUND_HEIGHT = 46.36;

// Straatvleugel tussen het hoekpaviljoen en de middenvleugel: zadeldak met de nok op v = 12,75 (57 graden).
const STREET = { ridgeV: 12.75, ridge: 20.0, eave: 13.25, t: 1.53 };
// Westvleugel (stelsel WW, x' oostwaarts): twee evenwijdige zadeldaken met steile buitenvlakken
// (61 graden) en een kilgoot op +17,1 m; in het noorden (y' > -5,5) sinds 2023 een plat dak op +20,0 m.
const WW_DEG = -4.38;
const WEST = { wallW: -16.87, wallE: -2.87, ridgeW: -13.17, ridgeE: -6.57, valleyX: -9.87, ridge: 20.0, eave: 13.4, valley: 17.1, tOut: 1.79, tIn: 0.87 };
const WEST_FLAT_FROM = -5.5; // y' waar het platte dak begint
const WEST_SOUTH_GABLE = -13.8; // y' van de zuidgevel van het westelijke dak
const WEST_TAIL = { x0: -11.6, y0: -16.6, t: 1.35, eave: 13.2 }; // oostelijk dak loopt door tot de glazen schijf
// Middenvleugel (stelsel MW, x' oostwaarts): zadeldak, nok +20,65 m, ten noorden van y' = 6,47 +20,0 m.
const MW_DEG = 6.76;
const MID = { wallW: 12.93, wallE: 22.03, ridgeX: 17.48, ridge: 20.65, ridgeNorth: 20.0, split: 6.47, south: -22.9, t: 1.44 };
// Kloosterkapel langs de straat: zadeldak (59 graden), goot +15,2 m, nok +23,6 m, veelhoekige sluiting in het oosten.
const CHAPEL = { v0: 7.05, v1: 17.24, eave: 15.2, ridge: 23.6, t: 1.65, tEnd: 1.8, westHipFrom: 16.0, tWest: 2.3 };
// Traptoren met lantaarn (AHN: kroonlijst rond +20 m, top +25,5 m).
const TURRET = { c: [-4.28, -15.39], r: 2.23, wall: 20.0, cornice: 20.4, roofTop: 22.6, lantern: [22.4, 24.3], spire: 26.3 };
// Glazen trapschijf en het lage glazen entreegebouw (1999) ten zuiden van de westvleugel.
const GLASS_SLAB = { v: [-20.0, -16.2], top: 17.0 };
const ANNEX_TOP = 8.5;
// Agnietenstraat 3: mansardehuis, onderste vlak 63 graden tot de knik op 1,4 m van de gevel (+19,3 m),
// bovenste vlak 54 graden tot het platte dak (+21,2 m achter, +21,4 m aan de straat).
const HOUSE = { eave: 16.5, tLow: 2.0, knee: 1.4, kneeZ: 19.3, tUp: 1.4, flat: 21.2, flatFront: 21.4, southEave: 15.6, tSouth: 1.22 };
const HOUSE_BACK_TOP = 12.75; // laag achterhuis
const ENTRANCE_TOP = 7.3; // glazen gebouw aan de binnenplaats (3D BAG)
const PAVILION = { c: [43.0, -15.6], r: 2.38, wall: 18.6, top: 20.9 };
// Stallen (stelsel ST, p langs de stallen naar het noordoosten, q dwars naar het noordwesten).
const ST_DEG = 20.9;
const STABLE = { ridge: 13.72, t: 0.7, tHip: 0.75 };
const STABLE_BLOCKS = [
  // [naam, p0, p1, q0, q1, nok langs p (true) of q, eindtypes]
  { name: "A", p: [-11.4, 22.2], q: [-41.6, -31.7], ridgeQ: -36.75, hipP0: true, hipP1: false, band: true },
  { name: "B", p: [-70.6, -11.25], q: [-47.9, -38.0], ridgeQ: -42.9, hipP0: true, hipP1: true },
  { name: "C", p: [-104.9, -70.6], q: [-41.9, -32.2], ridgeQ: -37.05, hipP0: true, hipP1: true },
];
const STABLE_WING_D = { p: [-104.6, -94.6], q: [-41.9, -4.5], ridgeP: -99.6, tEnd: 0.65 };
// Glazen strook onderaan het noordwestelijke dakvlak van blok A (3D BAG: 58 graden van +9,6 tot +11,1 m).
const BAND = { eave: 9.6, t: 1.6 };

// Dakkapellen (zadeldakje): positie langs de gevel, breedte, voorkant en achterkant vanaf de gevel, muur- en nokhoogte.
const DORMERS_STREET_N = [-3.7, -1.2, 4.2, 6.7];
const DORMERS_STREET_S = [-1.3, 4.1, 6.6, 11.3];
const DORMER_STREET = { w: 1.5, front: 0.5, back: 2.8, wall: 15.8, ridge: 16.6 };
const DORMERS_WEST = [3.7, -1.5, -4.1, -9.5]; // y' in WW, beide dakvlakken
const DORMER_WEST = { w: 1.5, front: 0.4, back: 2.4, wall: 15.8, ridge: 16.6 };
const DORMERS_MID = [2.65, -2.67, -7.98, -13.29, -18.61]; // y' in MW, beide dakvlakken, steek 5,3 m
const DORMER_MID = { w: 1.6, front: 0.5, back: 3.0, wall: 16.6, ridge: 17.45 };
const DORMERS_CHAPEL = [27.0, 35.0]; // u, beide dakvlakken, hoog op het dak
const DORMER_CHAPEL = { w: 1.2, front: 2.6, back: 4.4, wall: 21.0, ridge: 21.7 };
// Dakkapellen met plat dak op het mansardehuis (3D BAG +19,25 m).
const HOUSE_DORMERS = [[43.4, 4.3, "W"], [42.0, -6.1, "W"], [52.5, -6.2, "E"], [52.2, 4.6, "E"], [48.7, 16.8, "N"]];
const HOUSE_DORMER = { w: 1.8, top: 19.6 };
// Schoorstenen (AHN- en 3D BAG-toppen): [u, v, top NAP].
const CHIMNEYS = [
  [-11.9, 17.0, 21.3], // op de topgevel van het hoekpaviljoen aan de straat
  [-16.0, 12.85, 21.3], // op de westgevel aan het Nicolaaskerkhof (foto)
  [-14.3, -12.1, 21.3], // op de zuidgevel van het westelijke dak
  [-8.8, 12.6, 21.46],
  [-10.6, 9.0, 21.46],
  [-5.9, 8.9, 21.38],
  [8.6, 12.0, 21.42],
  [43.9, 14.0, 23.6], // Agnietenstraat 3
  [42.4, -13.2, 22.9],
  [46.8, -0.9, 22.8],
];
const MID_GABLE_CHIMNEY_TOP = 21.9; // op de zuidgevel van de middenvleugel (foto, geschat)
const CHIMNEY_W = 1.0;
// Borstwering van de topgevels: 0,5 m boven het dakvlak, 0,9 m dik.
const PARAPET = { rise: 0.5, thick: 0.9 };
// Plint rondom het klooster en het huis.
const PLINTH = { out: 0.25, top: 1.0 };

// ---------- hulpfuncties ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const cs = (pts) => new CrossSection([ccw(pts)]);
const extrudeCs = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const prism = (pts, z0, z1) => extrudeCs(cs(pts), z0, z1);
// Stelsel gedraaid om de oorsprong: pt zet (x', y') om naar lokaal (u, v); plane zet een vlak
// z = A x' + B y' + C (C in NAP) om naar lokaal [a, b, c].
function frame(deg) {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const pt = ([x, y]) => [x * c - y * s, x * s + y * c];
  return {
    pt,
    inv: ([u, v]) => [u * c + v * s, -u * s + v * c],
    dir: ([x, y]) => [x * c - y * s, x * s + y * c],
    plane: ([A, B, C]) => [A * c - B * s, A * s + B * c, C],
    rect: (x0, x1, y0, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(pt),
    poly: (pts) => pts.map(pt),
    // Vlak dat vanaf x' = at (hoogte zAt) met helling t stijgt in de richting dir (+1 of -1).
    upX: (at, zAt, t, dir) => [t * dir, 0, zAt - t * dir * at],
    upY: (at, zAt, t, dir) => [0, t * dir, zAt - t * dir * at],
  };
}
const LOC = frame(0);
const WW = frame(WW_DEG);
const MW = frame(MW_DEG);
const ST = frame(ST_DEG);
const toLocalPlane = (f, p) => f.plane(p);
// Vlak door de lijn p0-p1 (lokaal) op hoogte z0, stijgend met helling t naar de kant van 'inside'.
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
const flat = (nap) => [0, 0, nap];
// Laat het deel onder het vlak z = a u + b v + c (c in NAP) over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -z(c) / n);
};
// Bouwdeel: veelhoek (lokaal), begrensd door de BAG-contour, van de onderkant tot onder alle dakvlakken.
const roofed = (pts, planes, clip) => {
  let section = cs(pts);
  if (clip) section = section.intersect(clip);
  return planes.reduce((solid, p) => cutBelow(solid, p), extrudeCs(section, BASE, 60));
};
const ngon = ([cx, cy], r, n, rot = 0) =>
  Array.from({ length: n }, (_, k) => {
    const a = rot + (2 * Math.PI * k) / n;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
const hullOf = (rings) => Manifold.hull(rings.flatMap(([pts, h]) => pts.map(([x, y]) => [x, y, h])));
// Dakkapel met zadeldakje (of schilddakje): p = punt op de gevel (lokaal), d = eenheidsvector langs de
// gevel, n = eenheidsvector naar binnen; voor- en achterkant op afstand front/back van de gevel.
function dormer(p, d, n, { w, front, back, wall, ridge }, sill, hip = false) {
  const at = (a, dist, h) => [p[0] + d[0] * a + n[0] * dist, p[1] + d[1] * a + n[1] * dist, z(h)];
  const pts = [];
  for (const dist of [front, back]) {
    for (const a of [-w / 2, w / 2]) pts.push(at(a, dist, sill), at(a, dist, wall));
  }
  pts.push(at(0, hip ? front + w / 2 : front, ridge), at(0, back, ridge));
  return Manifold.hull(pts);
}
// Spitsboognis (breedte w, van z0 tot z1 boven het maaiveld en een punt van 54 graden) in de gevel
// p0-p1 (lokaal) op afstand s van p0; 'inside' is een punt binnen het gebouw.
function niche(p0, p1, inside, s, w, z0, z1, depth = 0.35) {
  let a = p0;
  let b = p1;
  let len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  let d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
  // Buitenwaarts = rechts van de looprichting (dan is de transformatie een draaiing).
  let out = [d[1], -d[0]];
  if (out[0] * (inside[0] - a[0]) + out[1] * (inside[1] - a[1]) > 0) {
    [a, b] = [b, a];
    d = [-d[0], -d[1]];
    out = [d[1], -d[0]];
    s = len - s;
  }
  const rise = (w / 2) * 1.4;
  const profile = [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + rise], [s - w / 2, z1]];
  const solid = Manifold.extrude(new CrossSection([ccw(profile)]), depth + 0.6);
  // x -> langs de gevel, y -> omhoog, z -> buitenwaarts (vanaf 'depth' binnen de gevel).
  return solid.transform([
    d[0], d[1], 0, 0,
    0, 0, 1, 0,
    out[0], out[1], 0, 0,
    a[0] - depth * out[0], a[1] - depth * out[1], 0, 1,
  ]);
}
// Nissen op regelmatige afstand langs een gevel.
const nicheRow = (p0, p1, inside, centres, w, z0, z1, depth) =>
  centres.map((s) => niche(p0, p1, inside, s, w, z0, z1, depth));
const chimney = ([u, v], top, f = LOC) => {
  const [x, y] = f.inv([u, v]);
  return prism(f.rect(x - CHIMNEY_W / 2, x + CHIMNEY_W / 2, y - CHIMNEY_W / 2, y + CHIMNEY_W / 2), z(12), z(top));
};
// Borstwering: de laatste 0,9 m van een bouwdeel aan de gevelkant, 0,5 m opgetild.
const parapet = (piece, slabPts) => piece.intersect(prism(slabPts, BASE - 1, 60)).translate([0, 0, PARAPET.rise]);

const OUT = bagOutlines();
const OUTLINE_K = cs(OUT.P029906);
const OUTLINE_H = cs(OUT.P081865);
const OUTLINE_S = cs(OUT.P081866);

// =====================================================================
// Klooster (BAG 0344100000029906)
// =====================================================================
const klooster = [];
const kCut = [];

// Straatvleugel met de westelijke topgevel aan het Nicolaaskerkhof.
const streetPlanes = [
  [0, STREET.t, STREET.ridge - STREET.t * STREET.ridgeV],
  [0, -STREET.t, STREET.ridge + STREET.t * STREET.ridgeV],
];
const streetWing = roofed(LOC.rect(-17.5, 14.0, 8.29, 17.8), streetPlanes, OUTLINE_K);
klooster.push(streetWing, parapet(streetWing, LOC.rect(-17.5, -16.89 + PARAPET.thick, 8.0, 18.0)));

// Westvleugel.
const W = WEST;
const westOuterW = WW.plane(WW.upX(W.wallW, W.eave, W.tOut, 1));
const westOuterE = WW.plane(WW.upX(W.wallE, W.eave, W.tOut, -1));
const westInnerW = WW.plane(WW.upX(W.ridgeW, W.ridge, W.tIn, -1)); // daalt van de westnok naar de goot
const westInnerE = WW.plane(WW.upX(W.ridgeE, W.ridge, W.tIn, 1)); // daalt van de oostnok naar de goot
// Hoekpaviljoen: het westelijke dak loopt als dwarsdak met een topgevel door tot de straat.
const westCrossE = WW.plane(WW.upX(W.ridgeW, W.ridge, W.tOut, -1));
const cornerGable = roofed(WW.rect(-17.6, W.ridgeW + (W.ridge - W.eave) / W.tOut, 7.5, 18.6), [westOuterW, westCrossE], OUTLINE_K);
klooster.push(cornerGable, parapet(cornerGable, LOC.rect(-17, -8, 17.48 - PARAPET.thick, 18)));
// Noordelijk deel: buitenvlakken met het platte dak ertussen.
klooster.push(roofed(WW.rect(-17.6, -2.0, WEST_FLAT_FROM, 12.0), [westOuterW, westOuterE, flat(W.ridge)], OUTLINE_K));
// Zuidelijk deel: twee zadeldaken met de kilgoot ertussen.
const westSouthW = roofed(WW.rect(-17.6, W.valleyX + 0.05, WEST_SOUTH_GABLE, WEST_FLAT_FROM), [westOuterW, westInnerW], OUTLINE_K);
klooster.push(westSouthW, parapet(westSouthW, WW.rect(-17.6, W.valleyX, WEST_SOUTH_GABLE - 1, WEST_SOUTH_GABLE + PARAPET.thick)));
klooster.push(roofed(WW.rect(W.valleyX - 0.05, -2.0, WEST_SOUTH_GABLE, WEST_FLAT_FROM), [westOuterE, westInnerE], OUTLINE_K));
// Het oostelijke dak loopt door tot de glazen schijf, met een flauwer westvlak.
const westTailW = WW.plane(WW.upX(W.ridgeE, W.ridge, WEST_TAIL.t, 1));
klooster.push(roofed(WW.rect(WEST_TAIL.x0, -2.0, WEST_TAIL.y0, WEST_SOUTH_GABLE + 0.01), [westOuterE, westTailW], OUTLINE_K));

// Middenvleugel.
const M = MID;
// Zadeldak: het westvlak stijgt naar de nok, het oostvlak daalt ervan af.
const midPlanes = (ridge) => [
  MW.plane([M.t, 0, ridge - M.t * M.ridgeX]),
  MW.plane([-M.t, 0, ridge + M.t * M.ridgeX]),
];
const midSouth = roofed(MW.rect(12.4, 22.6, M.south, M.split), midPlanes(M.ridge), OUTLINE_K);
klooster.push(midSouth, parapet(midSouth, MW.rect(12.0, 23.0, M.south - 1, M.south + PARAPET.thick)));
const midNorth = roofed(MW.rect(12.4, 22.6, M.split, 18.0), midPlanes(M.ridgeNorth), OUTLINE_K);
klooster.push(midNorth, parapet(midNorth, LOC.rect(10, 24, 17.0, 18.0)));

// Kloosterkapel met de veelhoekige sluiting.
const C = CHAPEL;
const chapelPoly = [[17.0, C.v0], [41.55, 7.08], [41.18, 15.24], [37.6, C.v1], [17.0, C.v1]];
const chapelInside = [30, 12];
const chapel = roofed(
  chapelPoly,
  [
    [0, C.t, C.eave - C.t * C.v0],
    [0, -C.t, C.eave + C.t * C.v1],
    facet([41.55, 7.08], [41.18, 15.24], C.eave, C.tEnd, chapelInside),
    facet([41.18, 15.24], [37.6, C.v1], C.eave, C.tEnd, chapelInside),
    [C.tWest, 0, C.eave - C.tWest * C.westHipFrom],
    flat(C.ridge),
  ],
  OUTLINE_K,
);
klooster.push(chapel);

// Traptoren: ronde schacht, kroonlijst op een kraag, achtkante kap, lantaarn en spits.
{
  const T = TURRET;
  klooster.push(Manifold.cylinder(z(T.wall) - BASE, T.r, T.r, 48).translate([...T.c, BASE]));
  const rc = T.r + 0.3;
  klooster.push(
    hullOf([
      [ngon(T.c, T.r - 0.05, 32), z(T.wall) - 0.65],
      [ngon(T.c, rc, 32), z(T.wall) - 0.3],
      [ngon(T.c, rc, 32), z(T.cornice)],
    ]),
  );
  klooster.push(hullOf([[ngon(T.c, rc, 8, Math.PI / 8), z(T.cornice) - 0.01], [ngon(T.c, 1.0, 8, Math.PI / 8), z(T.roofTop)]]));
  klooster.push(prism(ngon(T.c, 1.0, 8, Math.PI / 8), z(T.lantern[0]), z(T.lantern[1])));
  klooster.push(hullOf([[ngon(T.c, 1.0, 8, Math.PI / 8), z(T.lantern[1]) - 0.01], [[T.c], z(T.spire)]]));
}

// Glazen trapschijf en het lage glazen entreegebouw.
klooster.push(roofed(LOC.rect(-20, -3.5, GLASS_SLAB.v[0], GLASS_SLAB.v[1]), [flat(GLASS_SLAB.top)], OUTLINE_K));
klooster.push(roofed(LOC.rect(-20, -3.5, -31, GLASS_SLAB.v[0] + 0.01), [flat(ANNEX_TOP)], OUTLINE_K));

// Plint.
klooster.push(extrudeCs(OUTLINE_K.offset(PLINTH.out, "Miter", 2).subtract(cs(LOC.rect(-20, -3, -31, -16.2))), BASE, PLINTH.top));

// Dakkapellen.
{
  const sillS = STREET.eave - 0.5;
  for (const u of DORMERS_STREET_N) klooster.push(dormer([u, 17.16], [1, 0], [0, -1], DORMER_STREET, sillS));
  for (const u of DORMERS_STREET_S) klooster.push(dormer([u, 8.29], [1, 0], [0, 1], DORMER_STREET, sillS));
  const along = WW.dir([0, 1]);
  for (const y of DORMERS_WEST) {
    klooster.push(dormer(WW.pt([W.wallW, y]), along, WW.dir([1, 0]), DORMER_WEST, W.eave - 0.5));
    klooster.push(dormer(WW.pt([W.wallE, y]), along, WW.dir([-1, 0]), DORMER_WEST, W.eave - 0.5));
  }
  const alongM = MW.dir([0, 1]);
  const midEave = M.ridge - M.t * (M.ridgeX - M.wallW);
  for (const y of DORMERS_MID) {
    klooster.push(dormer(MW.pt([M.wallW, y]), alongM, MW.dir([1, 0]), DORMER_MID, midEave - 0.5));
    klooster.push(dormer(MW.pt([M.wallE, y]), alongM, MW.dir([-1, 0]), DORMER_MID, midEave - 0.5));
  }
  for (const u of DORMERS_CHAPEL) {
    klooster.push(dormer([u, C.v1], [1, 0], [0, -1], DORMER_CHAPEL, 19.0, true));
    klooster.push(dormer([u, C.v0], [1, 0], [0, 1], DORMER_CHAPEL, 19.0, true));
  }
}

// Schoorstenen.
for (const [u, v, top] of CHIMNEYS.slice(0, 7)) klooster.push(chimney([u, v], top));
klooster.push(chimney(MW.pt([M.ridgeX, M.south + 0.5]), MID_GABLE_CHIMNEY_TOP, MW));

// Vensternissen (spitse bovenkant; ritme en maten van foto's).
{
  const inK = [5, 12];
  // Straatgevel van de straatvleugel: zes traveeën in twee rijen.
  const bays = [-6.5, -3.3, -0.1, 3.1, 6.3, 9.5];
  const p0 = [-8.21, 17.16];
  const p1 = [11.11, 17.15];
  kCut.push(...nicheRow(p0, p1, inK, bays.map((u) => u + 8.21), 1.3, 1.6, 4.4));
  kCut.push(...nicheRow(p0, p1, inK, bays.map((u) => u + 8.21), 1.3, 5.6, 8.2));
  // Topgevel van het hoekpaviljoen aan de straat en de westgevel aan het plein.
  const g0 = [-15.57, 17.6];
  const g1 = [-8.22, 17.48];
  kCut.push(...nicheRow(g0, g1, [-12, 12], [1.6, 5.6], 1.3, 1.6, 4.4));
  kCut.push(...nicheRow(g0, g1, [-12, 12], [1.6, 5.6], 1.3, 5.6, 8.2));
  kCut.push(niche(g0, g1, [-12, 12], 3.6, 1.2, 10.4, 11.6));
  const w0 = [-16.89, 9.76];
  const w1 = [-16.33, 16.9];
  kCut.push(...nicheRow(w0, w1, [-12, 12], [1.6, 5.6], 1.3, 1.6, 4.4));
  kCut.push(...nicheRow(w0, w1, [-12, 12], [1.6, 5.6], 1.3, 5.6, 8.2));
  kCut.push(niche(w0, w1, [-12, 12], 3.6, 1.2, 10.4, 11.6));
  // Westgevel van de westvleugel: zeven traveeën.
  const ww0 = [-16.2, 9.72];
  const ww1 = [-17.9, -12.48];
  const westBays = [1.6, 4.55, 7.5, 10.45, 13.4, 16.35, 19.3];
  kCut.push(...nicheRow(ww0, ww1, inK, westBays, 1.3, 1.6, 4.4));
  kCut.push(...nicheRow(ww0, ww1, inK, westBays, 1.3, 5.6, 8.6));
  // Kapel: vier hoge spitsboogvensters aan de straat en een in de schuine sluiting.
  const c0 = [17.32, 17.32];
  const c1 = [37.6, 17.24];
  kCut.push(...nicheRow(c0, c1, chapelInside, [6.2, 10.2, 14.2, 18.2], 2.0, 4.4, 9.4, 0.4));
  kCut.push(...nicheRow(c0, c1, chapelInside, [6.2, 10.2, 14.2, 18.2], 0.9, 1.4, 2.6));
  kCut.push(niche([37.6, 17.24], [41.18, 15.24], chapelInside, 2.05, 1.8, 4.4, 9.4, 0.4));
  // Ingang onder de topgevel van de middenvleugel aan de straat.
  kCut.push(niche([13.26, 17.37], [19.38, 17.29], [16, 12], 3.06, 2.4, 0, 3.6, 0.4));
  kCut.push(...nicheRow([13.26, 17.37], [19.38, 17.29], [16, 12], [1.3, 4.8], 1.1, 5.6, 8.2));
  // Middenvleugel: een venster tussen elk paar lisenen (de teruggelegde stukken van de BAG-contour).
  const pts = OUT.P029906;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < 1.15 || len > 1.6) continue;
    const [xa, ya] = MW.inv(a);
    const [xb, yb] = MW.inv(b);
    const recessW = Math.abs(xa - 13.27) < 0.15 && Math.abs(xb - 13.27) < 0.15;
    const recessE = Math.abs(xa - 21.69) < 0.15 && Math.abs(xb - 21.69) < 0.15;
    if (!(recessW || recessE) || Math.min(ya, yb) < M.south + 0.5 || Math.max(ya, yb) > 6.5) continue;
    const inside = MW.pt([M.ridgeX, (ya + yb) / 2]);
    kCut.push(niche(a, b, inside, len / 2, 0.95, 6.2, 9.0, 0.3));
    kCut.push(niche(a, b, inside, len / 2, 0.95, 1.6, 4.2, 0.3));
  }
}
const kloosterSolid = Manifold.union(klooster).subtract(Manifold.union(kCut));

// =====================================================================
// Agnietenstraat 3 (BAG 0344100000081865)
// =====================================================================
const huis = [];
const hCut = [];
{
  const H = HOUSE;
  const inside = [47, 2];
  // Mansardevlakken: onderste deel steil vanaf de goot, bovenste flauwer vanaf de knik.
  const mansard = (p0, p1, inPt = inside) => [
    facet(p0, p1, H.eave, H.tLow, inPt),
    facet(p0, p1, H.kneeZ - H.tUp * H.knee, H.tUp, inPt),
  ];
  const insideFront = [47, 13];
  const westMain = [[40.87, 0.27], [41.41, -12.66]];
  const westFront = [[42.5, 0.9], [42.5, 7.1]];
  const east = [[53.34, -9.15], [52.74, 7.09]];
  const southHip = [0, H.tSouth, H.southEave + H.tSouth * 14.7];
  huis.push(roofed(LOC.rect(40.0, 54.0, -14.8, 0.6), [...mansard(...westMain), ...mansard(...east), southHip, flat(H.flat)], OUTLINE_H));
  huis.push(roofed(LOC.rect(40.0, 54.0, 0.6, 14.3), [...mansard(...westFront), ...mansard(...east), flat(H.flat)], OUTLINE_H));
  // Voorhuis aan de straat (T), met een schild naar de kapel.
  const north = [[40.07, 17.51], [54.47, 18.05]];
  const eastF = [[54.64, 11.27], [54.47, 18.05]];
  const southF = [[52.85, 9.07], [55.01, 9.09]];
  const westF = [[40.1, 9.0], [40.1, 18.0]];
  huis.push(
    roofed(
      LOC.rect(40.0, 55.2, 9.0, 18.2),
      [...mansard(...north, insideFront), ...mansard(...eastF, insideFront), ...mansard(...southF, insideFront), facet(...westF, 16.9, 1.6, insideFront), flat(H.flatFront)],
      OUTLINE_H,
    ),
  );
  // Dakkapellen met plat dak.
  for (const [u, v, side] of HOUSE_DORMERS) {
    const w = HOUSE_DORMER.w / 2;
    const r =
      side === "W" ? [u - 0.8, u + 1.0, v - w, v + w] : side === "E" ? [u - 1.1, u + 0.5, v - w, v + w] : [u - w, u + w, v - 0.9, v + 0.8];
    huis.push(prism(LOC.rect(...r), z(H.eave), z(HOUSE_DORMER.top)));
  }
  for (const [u, v, top] of CHIMNEYS.slice(7)) huis.push(chimney([u, v], top));
  // Laag achterhuis, glazen gebouw aan de binnenplaats en de achtkante paviljoenkap.
  huis.push(roofed(LOC.rect(43.3, 52.6, -22.4, -14.5), [flat(HOUSE_BACK_TOP)], OUTLINE_H));
  huis.push(roofed(entrancePoly(), [flat(ENTRANCE_TOP)], OUTLINE_H));
  const P = PAVILION;
  huis.push(prism(ngon(P.c, P.r, 8, Math.PI / 8), BASE, z(P.wall)));
  huis.push(hullOf([[ngon(P.c, P.r, 8, Math.PI / 8), z(P.wall) - 0.01], [[P.c], z(P.top)]]));
  huis.push(extrudeCs(OUTLINE_H.offset(PLINTH.out, "Miter", 2).intersect(cs(LOC.rect(39, 56, -13, 19))), BASE, PLINTH.top));
  // Straatgevel: drie traveeën, vier verdiepingen.
  const f0 = [40.1, 17.51];
  const f1 = [52.88, 17.78];
  for (const [z0, z1] of [[1.6, 3.6], [4.8, 7.0], [8.0, 10.0], [11.0, 12.6]]) {
    hCut.push(...nicheRow(f0, f1, inside, [4.4, 7.4, 10.4], 1.2, z0, z1));
  }
  // Zijgevels van het achterhuis naar de binnenplaats en de tuin.
  for (const [p0, p1] of [westMain, east]) {
    const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const centres = [];
    for (let s = 1.8; s < L - 1.2; s += 3.0) centres.push(s);
    for (const [z0, z1] of [[1.6, 3.6], [4.8, 7.0], [8.0, 10.0]]) hCut.push(...nicheRow(p0, p1, inside, centres, 1.1, z0, z1));
  }
}
const huisSolid = Manifold.union(huis).subtract(Manifold.union(hCut));

// =====================================================================
// Stallen (BAG 0344100000081866)
// =====================================================================
const stal = [];
const sCut = [];
{
  const S = STABLE;
  for (const B of STABLE_BLOCKS) {
    // Noordwestvlak daalt naar +q, zuidoostvlak naar -q.
    const planes = [ST.plane([0, -S.t, S.ridge + S.t * B.ridgeQ]), ST.plane([0, S.t, S.ridge - S.t * B.ridgeQ])];
    const eaveZ = S.ridge - S.t * ((B.q[1] - B.q[0]) / 2);
    if (B.hipP0) planes.push(ST.plane([S.tHip, 0, eaveZ - S.tHip * B.p[0]]));
    if (B.hipP1) planes.push(ST.plane([-S.tHip, 0, eaveZ + S.tHip * B.p[1]]));
    if (B.band) planes.push(ST.plane([0, -BAND.t, BAND.eave + BAND.t * B.q[1]]));
    stal.push(roofed(ST.rect(B.p[0] - 0.6, B.p[1] + 0.6, B.q[0] - 0.6, B.q[1] + 0.6), planes, OUTLINE_S));
    // Vensters (rondboog als spitse nis) om de 3,6 m in beide lange gevels.
    for (const q of B.q) {
      const p0 = ST.pt([B.p[0], q]);
      const p1 = ST.pt([B.p[1], q]);
      const inside = ST.pt([(B.p[0] + B.p[1]) / 2, B.ridgeQ]);
      const L = B.p[1] - B.p[0];
      const centres = [];
      for (let s = 2.4; s < L - 2.0; s += 3.6) {
        // Niet in de gevel die tegen de dwarsvleugel D aan ligt.
        const pAt = B.p[0] + s;
        if (q === B.q[1] && pAt < STABLE_WING_D.p[1] + 1.0) continue;
        centres.push(s);
      }
      sCut.push(...nicheRow(p0, p1, inside, centres, 1.4, 1.4, 4.4, 0.3));
    }
  }
  const D = STABLE_WING_D;
  const eaveD = S.ridge - S.t * ((D.p[1] - D.p[0]) / 2);
  const planesD = [
    ST.plane([S.t, 0, S.ridge - S.t * D.ridgeP]),
    ST.plane([-S.t, 0, S.ridge + S.t * D.ridgeP]),
    ST.plane([0, -D.tEnd, eaveD + D.tEnd * D.q[1]]),
    ST.plane([0, S.tHip, eaveD - S.tHip * D.q[0]]),
  ];
  stal.push(roofed(ST.rect(D.p[0] - 0.6, D.p[1] + 0.6, D.q[0] - 0.6, D.q[1] + 0.6), planesD, OUTLINE_S));
  for (const p of D.p) {
    const p0 = ST.pt([p, -31.5]);
    const p1 = ST.pt([p, D.q[1]]);
    const inside = ST.pt([D.ridgeP, -18]);
    const centres = [];
    for (let s = 2.0; s < 27 - 1.0; s += 3.6) centres.push(s);
    sCut.push(...nicheRow(p0, p1, inside, centres, 1.4, 1.4, 4.4, 0.3));
  }
  stal.push(extrudeCs(OUTLINE_S.offset(PLINTH.out, "Miter", 2), BASE, PLINTH.top - 0.4));
}
const stalSolid = Manifold.union(stal).subtract(Manifold.union(sCut));

const nodes = [
  ["building:agnietenklooster", kloosterSolid],
  ["building:agnietenstraat-3", huisSolid],
  ["building:stallen", stalSolid],
];
const all = Manifold.union(nodes.map(([, s]) => s));

const META = {
  name: "Centraal Museum",
  origin: ORIGIN,
  xAxis: X_AXIS.map((c) => +c.toFixed(6)),
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0344100000029906", "0344100000081865", "0344100000081866"],
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (137085, 455070) in de kloostertuin op het maaiveld (NAP +3,1 m), +X langs de Agnietenstraat naar het noordoosten (33 graden vanaf de RD-X-as) en +Y loodrecht daarop naar de straat. Drie nodes: building:agnietenklooster (het voormalige Agnietenklooster, BAG 0344100000029906: straatvleugel met zadeldak, nok +20,0 m NAP; hoekpaviljoen met topgevels aan straat en plein; westvleugel met twee evenwijdige daken van 61 graden, in het noorden met een plat dak op +20,0 m en in het zuiden met een kilgoot op +17,1 m; middenvleugel met lisenen, nok +20,65 m en tien dakkapellen; kloosterkapel met nok +23,6 m en veelhoekige sluiting; ronde traptoren met lantaarn en spits tot +26,3 m; glazen trapschijf +17,0 m en glazen entreegebouw +8,5 m), building:agnietenstraat-3 (mansardehuis met plat dak +21,2 tot +21,4 m, dakkapellen en schoorstenen, laag achterhuis +12,75 m, glazen gebouw +7,3 m en achtkante paviljoenkap +20,9 m) en building:stallen (de stallen van 1835 onder schilddaken, nok +13,72 m, goot ongeveer +10,2 m, met een steilere glazen strook aan de tuinkant). Vensters als spitse nissen van 0,3 tot 0,4 m. Onderkant 0,5 m onder het maaiveld; het maaiveld wordt op straat, op het Nicolaaskerkhof en in de tuin bemonsterd. Vervangt de PDOK-reconstructie van de drie panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    groundNapM: GROUND_NAP,
    streetRidgeNapM: STREET.ridge,
    chapelRidgeNapM: CHAPEL.ridge,
    midRidgeNapM: MID.ridge,
    westRidgeNapM: WEST.ridge,
    westValleyNapM: WEST.valley,
    turretTopNapM: TURRET.spire,
    houseFlatNapM: HOUSE.flat,
    stableRidgeNapM: STABLE.ridge,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Centraal_Museum",
    "PDOK BAG panden 0344100000029906, 0344100000081865 en 0344100000081866, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, goten, dakkapellen, schoorstenen, traptoren en maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl, opname 2023): dakhellingen, platte dak van de westvleugel, glazen gebouwen en paviljoenkap",
    "PDOK luchtfoto (Actueel_orthoHR): indeling van de daken en dakkapellen",
    "Wikimedia Commons: foto's van de straatgevel, de kapel, de tuingevels en de traptoren",
  ],
};

// ---------- controles ----------
if (argv.includes("--components")) {
  for (const [name, solid] of nodes) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
  }
}
for (const [name, solid] of nodes) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of nodes) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      if (!steep || argv.includes("--verbose")) console.warn(`${name}: ondervlak op z ${Math.min(p[0][2], p[1][2], p[2][2]).toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(3)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(3)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  const count = v.length / s;
  const flat32 = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat32[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat32, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
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
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze als properties 3..5.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    const v = mesh.vertProperties;
    for (let i = 0; i < count; i++) {
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of nodes) {
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
await writeFile(glbFile, toGlb(nodes, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} Utrecht 1:${scale} mm Z-up`);
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
      groundOffsetMetres: META.groundOffsetMetres,
      ...(GROUND_HEIGHT != null ? { groundHeight: GROUND_HEIGHT } : {}),
      groundSamplePoints: META.groundSamplePoints,
      replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`),
      description: META.description,
      printFiles: [`${SLUG}-1-${scale}.stl`],
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

// ---------- vaste invoer ----------
// Glazen gebouw aan de binnenplaats achter Agnietenstraat 3 (3D BAG, plat dak +7,3 m), lokaal.
function entrancePoly() {
  return [
    [40.8, -15.7], [32.5, -21.1], [34.6, -24.3], [33.3, -25.0], [34.2, -27.2], [35.8, -26.3], [37.9, -29.4],
    [46.3, -23.7], [45.5, -22.6], [46.2, -22.1], [45.1, -21.3], [44.7, -19.7], [43.5, -18.0], [42.9, -17.2],
  ];
}

// BAG-contouren (PDOK BAG, pand-geometrie), omgerekend naar het lokale stelsel (u, v) in meters.
function bagOutlines() {
  return {
    // BAG-pand 0344100000029906
    P029906: [
      [41.55, 7.08], [41.18, 15.24], [37.60, 17.24], [30.37, 17.23], [19.38, 17.29], [17.32, 17.32], [13.26, 17.37], [11.10, 17.41],
      [11.11, 17.15], [-8.21, 17.16], [-8.22, 17.48], [-15.57, 17.60], [-15.66, 16.86], [-16.33, 16.90], [-16.89, 9.76], [-16.20, 9.72],
      [-17.90, -12.48], [-17.51, -12.51], [-15.75, -12.65], [-15.55, -12.66], [-11.23, -12.98], [-11.60, -16.57], [-15.80, -16.28], [-15.99, -16.27],
      [-17.76, -16.15], [-18.64, -25.05], [-18.99, -28.74], [-5.38, -30.02], [-4.79, -23.72], [-4.17, -17.56], [-3.74, -17.48], [-3.34, -17.32],
      [-2.97, -17.09], [-2.65, -16.79], [-2.39, -16.44], [-2.19, -16.05], [-2.08, -15.63], [-2.07, -15.58], [-2.05, -15.17], [-2.12, -14.76],
      [-2.26, -14.38], [-2.47, -14.02], [-2.75, -13.72], [-2.84, -13.66], [-3.08, -13.48], [-3.46, -13.31], [-3.82, -13.21], [-2.29, 8.27],
      [10.66, 8.28], [11.17, 8.29], [12.04, 8.29], [12.11, 7.68], [12.46, 7.72], [12.62, 6.38], [12.27, 6.34], [12.28, 6.22],
      [12.42, 5.10], [12.76, 5.15], [12.94, 3.70], [12.59, 3.66], [12.74, 2.41], [13.08, 2.45], [13.26, 0.95], [12.91, 0.91],
      [13.06, -0.35], [13.41, -0.31], [13.58, -1.78], [13.24, -1.82], [13.38, -2.99], [13.72, -2.95], [13.89, -4.35], [13.54, -4.39],
      [13.68, -5.52], [14.02, -5.48], [14.20, -6.96], [13.85, -7.00], [13.98, -8.09], [14.33, -8.05], [14.49, -9.48], [14.15, -9.52],
      [14.30, -10.76], [14.64, -10.72], [14.83, -12.27], [14.48, -12.31], [14.61, -13.42], [14.96, -13.38], [15.15, -15.04], [14.81, -15.08],
      [14.94, -16.20], [15.29, -16.16], [15.46, -17.67], [15.12, -17.71], [15.25, -18.81], [15.60, -18.77], [15.77, -20.23], [15.42, -20.27],
      [15.43, -20.40], [15.53, -21.18], [24.51, -20.21], [24.46, -19.79], [24.40, -19.23], [24.05, -19.27], [23.87, -17.76], [24.22, -17.72],
      [24.09, -16.52], [23.74, -16.56], [23.56, -15.06], [23.91, -15.02], [23.77, -13.85], [23.42, -13.89], [23.25, -12.42], [23.60, -12.38],
      [23.46, -11.17], [23.11, -11.21], [22.95, -9.83], [23.30, -9.79], [23.19, -8.82], [22.84, -8.86], [22.66, -7.30], [23.01, -7.26],
      [22.88, -6.12], [22.53, -6.17], [22.35, -4.65], [22.70, -4.61], [22.56, -3.38], [22.21, -3.42], [22.04, -1.93], [22.38, -1.89],
      [22.24, -0.69], [21.90, -0.73], [21.73, 0.72], [22.08, 0.76], [21.93, 2.00], [21.58, 1.95], [21.43, 3.32], [21.77, 3.37],
      [21.63, 4.59], [21.28, 4.55], [21.11, 6.04], [21.46, 6.08], [21.33, 7.16], [37.32, 7.03], [37.33, 6.61], [37.80, 6.64],
      [37.82, 6.78],
    ],
    // BAG-pand 0344100000081865
    P081865: [
      [33.30, -25.00], [34.18, -27.20], [35.85, -26.26], [37.88, -29.41], [46.29, -23.72], [45.50, -22.56], [48.33, -20.64], [48.27, -20.55],
      [50.61, -18.83], [50.71, -18.88], [52.19, -16.21], [52.10, -16.16], [51.85, -12.90], [53.49, -12.45], [53.45, -11.52], [53.34, -9.15],
      [52.90, 0.37], [53.09, 0.38], [53.03, 1.36], [52.86, 1.37], [52.74, 7.09], [52.72, 8.05], [52.88, 8.03], [52.85, 9.07],
      [55.01, 9.09], [55.05, 11.25], [54.64, 11.27], [54.47, 18.05], [53.78, 18.06], [53.78, 17.95], [52.89, 17.91], [52.88, 17.78],
      [47.34, 17.66], [40.10, 17.51], [40.07, 16.92], [41.09, 16.96], [41.18, 15.24], [41.55, 7.08], [42.46, 7.15], [42.58, 0.90],
      [42.42, 0.91], [42.45, 0.39], [40.87, 0.27], [40.87, 0.21], [40.91, -0.57], [41.41, -12.66], [41.72, -12.87], [41.77, -13.50],
      [41.54, -13.81], [40.95, -15.34], [41.06, -15.53], [40.78, -15.72], [40.69, -15.59], [32.54, -21.12], [34.57, -24.28],
    ],
    // BAG-pand 0344100000081866
    P081866: [
      [33.30, -25.00], [31.96, -21.62], [29.82, -22.46], [19.47, -26.55], [18.40, -26.97], [18.87, -28.16], [14.64, -29.83], [14.17, -28.64],
      [0.58, -34.00], [1.98, -37.66], [2.23, -37.57], [3.00, -39.57], [2.75, -39.67], [-9.50, -44.29], [-21.63, -48.90], [-21.68, -48.73],
      [-22.73, -49.14], [-22.77, -49.03], [-23.48, -49.30], [-23.54, -49.33], [-23.83, -49.02], [-24.75, -49.40], [-26.07, -49.95], [-26.64, -50.19],
      [-26.55, -50.49], [-27.25, -50.76], [-27.21, -50.86], [-28.25, -51.26], [-28.15, -51.46], [-41.48, -56.53], [-52.42, -60.72], [-54.45, -55.17],
      [-77.26, -63.98], [-79.59, -57.58], [-81.08, -53.47], [-86.69, -38.04], [-95.43, -41.21], [-95.84, -41.36], [-94.34, -45.44], [-83.04, -76.57],
      [-51.45, -64.44], [-49.40, -70.02], [-49.30, -69.97], [-49.25, -70.07], [-48.51, -69.77], [-48.55, -69.68], [-31.40, -63.08], [-29.60, -62.41],
      [-24.73, -60.55], [-24.70, -60.65], [-23.62, -60.26], [-23.59, -60.36], [-22.88, -60.10], [-19.86, -59.00], [-19.12, -58.73], [-19.15, -58.63],
      [-18.09, -58.26], [-18.13, -58.16], [-8.58, -54.46], [4.23, -49.64], [5.82, -48.95], [5.85, -49.07], [6.53, -48.81], [6.45, -48.66],
      [6.59, -48.63], [4.46, -43.18], [17.79, -37.79], [17.31, -36.60], [21.56, -34.88], [22.03, -36.07], [31.93, -32.06], [35.53, -30.61],
      [34.18, -27.20],
    ],
  };
}

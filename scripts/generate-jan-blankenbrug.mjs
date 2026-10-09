// Genereert een vereenvoudigd, gesloten 3D-model van de Jan Blankenbrug over
// de Lek tussen Vianen en Nieuwegein (A2): twee gelijke betonnen
// uitbouwbruggen (kokerliggers in vrije uitbouw, ontwerp Zwarts & Jansma)
// naast elkaar, de oostelijke uit 1999 (rijrichting Utrecht), de westelijke
// uit 2004 (rijrichting 's-Hertogenbosch), elk 532,9 m lang en 29 m breed met
// een spleet van 0,5 tot 0,9 m ertussen. Elke brug is één koker onder het
// midden van het dek met aan beide kanten een rij schuine schoren van
// hogesterktebeton onder de uitkragende dekplaat, op twee rivierpijlers van
// drie kegelvormige kolommen (hoofdoverspanning 165 m) en vier landpijlers van
// twee kolommen. De koker wordt naar de rivierpijlers toe dieper (voute), en
// de schoren worden daar steiler. Alle maten in het script zijn meters op
// ware grootte. Uitvoer: een GLB in meters (Y omhoog, de materiaalklasse in de
// nodenaam: de constructie als building, de rijbanen op het dek als road met
// de BGT-attributen) als catalogusbron voor de export en de kaart, plus een
// binaire STL in millimeters op 1:<schaal> met een printvoet onder de dekken.
// Met 546 m past de brug op 1:1000 niet in 400 mm, vandaar standaard 1:1500
// (364 mm).
//
//   node scripts/generate-jan-blankenbrug.mjs              # STL op 1:1500 (standaard)
//   node scripts/generate-jan-blankenbrug.mjs --scale 2000
//
// Assenstelsel: oorsprong op de spleet tussen de twee dekken midden in de
// hoofdoverspanning (RD 133752,26, 445509,28), op de waterspiegel van de Lek
// zoals het PDOK-terrein die legt (43,13 m ellipsoïdisch, NAP -0,27 m;
// PDOK = NAP + 43,40 m op de uiterwaarden), Z omhoog, z = NAP + 0,27 m. +X
// loopt langs de brug naar het noordnoordwesten (Nieuwegein, RD-richting
// 108,79 graden vanaf het oosten, uit de BGT-dekranden), +Y naar het
// westzuidwesten (stroomafwaarts): de westelijke brug ligt op +Y, de
// oostelijke op -Y. De rivierpijlers staan op x = -82,7 en 82,7 (BGT), de
// landpijlers op ±182,7 en ±224,5 (geschat), de BGT-einden van de dekken op
// -266,54 en 266,39, de landhoofden lopen tot ±272,8.
//
// Bronnen: BGT overbruggingsdeel (dekken L0002.2fa7ca7db0104aab9393b5deb0e26f83
// (oost) en L0002.022e7942000f4293bb6c6d51e8ad026d (west), 29,0 m breed, de
// spleet 0,94 m aan de zuidkant en 0,48 m aan de noordkant; de poeren van de
// rivierpijlers van 21,1 × 3,3 m: L0002.03b63d82a4784120a20e23aa9b2ce3e8,
// L0002.837950b55290464c8146efd3113f7cfc, L0002.eab6317ae15b440ebbbb5cd00e6cca6e,
// L0002.ee8efc23227e4b72a87e4e7f9f65796c; de landhoofden), BGT wegdeel (op het
// dek alleen rijbaan autosnelweg, gesloten verharding:
// L0002.5ce649185a5443b6afc575bd14beca14, L0002.777196270e7b47b69db04831ccb6e083
// en de smalle strook L0002.de11c0d4ea1f44a99e74c949ed8afd25); AHN DSM/DTM
// 0,5 m (PDOK WCS) voor het lengteprofiel van het wegdek (top NAP +21,16 m
// midden boven de Lek, NAP +17,6 m aan de dekeinden, restfout 5 cm), het
// dwarsverval (2,5 % van de spleet naar de buitenrand: de bruggen zijn
// elkaars spiegelbeeld) en de uiterwaarden onder de landpijlers; PDOK-terrein
// voor de waterspiegel; Wikipedia (lengte 532 m, breedte ~60 m, Zwarts &
// Jansma, opening 1999 en 2004, doorvaarthoogte NAP +14,2 m aan de randen van
// de vaargeul); Structurae (hoofdoverspanning 165 m, 532,4 m, kokerligger in
// vrije uitbouw); Bouwdienst Magazine maart 2003 ("Spiegelbeeld": 532 m, 29 m
// breed, spleet 94 cm, één koker met schoren in plaats van drie kokers, vier
// landpijlers van twee en twee rivierpijlers van drie kegelvormige kolommen);
// Nederlandse Bruggenstichting, Bruggen 2021 nr. 4; zja.nl (de middelste
// kolom van de rivierpijler loopt omgekeerd taps toe); Wikimedia
// Commons-foto's voor de voutes, de schoren, de kolommen en de poeren.
// Geschat (foto's, verhoudingen tegen de hoofdoverspanning en de bekende
// hoogtes van wegdek en water): de constructiehoogte (4,0 m in het midden van
// de hoofdoverspanning en over de aanbruggen, 7,2 m boven de rivierpijlers,
// 5,0 m boven de eerste landpijler), de plaats van de landpijlers (een
// zijoverspanning van 100 m en twee velden van 41,8 m: niet in de BGT en onder
// het dek niet in het AHN), de breedte van de koker (13 m), de schoren (om de
// 3,6 m, 1,0 × 1,0 m, van de onderkant van de koker tot 1,5 m van de
// dekrand), de dekplaat (1,0 m), de kolommen (landpijlers 3,5 m onder en
// 2,5 m boven, 9 m hart op hart op een plint; rivierpijlers 3,2/2,4 m buiten
// en 2,2/3,2 m in het midden, 7 m hart op hart), de bovenkant van de poeren
// (NAP +1,0 m) en de schampkanten.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1500"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "jan-blankenbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const lerp = (a, b, t) => a + (b - a) * t;
const area2 = (pts) =>
  pts.reduce((a, [x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    return a + x0 * y1 - x1 * y0;
  }, 0);
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
const box = (x0, x1, y0, y1, z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
// Doorsnede in het YZ-vlak (convex), uitgetrokken langs X van x0 tot x1.
const extrudeX = (section, x0, x1) =>
  Manifold.extrude([ccw(section)], x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, 0]);

// Loft langs X: per station een convexe doorsnede (y, z), steeds evenveel
// punten in dezelfde volgorde; de oriëntatie wordt zo nodig omgedraaid.
function loft(xs, section) {
  const sections = xs.map((x) => section(x));
  const n = sections[0].length;
  const build = (flip) => {
    const verts = [];
    xs.forEach((x, i) => {
      const s = flip ? [...sections[i]].reverse() : sections[i];
      for (const [y, z] of s) verts.push(x, y, z);
    });
    const tris = [];
    const id = (i, j) => i * n + (j % n);
    for (let i = 0; i + 1 < xs.length; i++) {
      for (let j = 0; j < n; j++) {
        tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
        tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
      }
    }
    const last = xs.length - 1;
    for (let j = 1; j + 1 < n; j++) {
      tris.push(id(0, 0), id(0, j + 1), id(0, j));
      tris.push(id(last, 0), id(last, j), id(last, j + 1));
    }
    return new Manifold(new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }));
  };
  let solid = build(false);
  if (solid.status() !== "NoError" || solid.volume() < 0) solid = build(true);
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  if (solid.volume() <= 0) throw new Error("loft: omgekeerde doorsnede");
  return solid;
}
// Stations van x0 tot x1 om de `step` m, plus de opgegeven tussenpunten.
function stations(x0, x1, step, extra = []) {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return [...Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n), ...extra.filter((x) => x > x0 && x < x1)]
    .sort((a, b) => a - b)
    .filter((x, i, a) => i === 0 || x - a[i - 1] > 1e-3);
}

// ---------- hoofdmaten (z = NAP + 0,27 m, de waterspiegel van de Lek op 0) ----------
const WATER_NAP = -0.27;
const Z = (nap) => nap - WATER_NAP;
const BASE = -1.0; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
// PDOK-waterspiegel (ellipsoïdisch) op de maaiveldpunten, als vaste terugval
// voor een uitsnede die alleen een uiteinde raakt.
const GROUND_HEIGHT = 43.13;

// Wegdek op de as van elk dek (AHN DSM, 30e percentiel over de rijstroken,
// dwarsverval eruit gerekend): symmetrisch om het midden, restfout 5 cm.
const PROFILE = { a: 21.164, b: -5.454e-5, c: 6.043e-11 };
const centreNap = (x) => PROFILE.a + PROFILE.b * x * x + PROFILE.c * x ** 4;
// Dwarsverval: elk dek loopt van de spleet naar de buitenrand 2,5 % af (de
// bruggen zijn elkaars spiegelbeeld).
const CROSSFALL = 0.025;

// Indeling langs de as.
const RIVER = 82.7; // rivierpijlers (BGT-poeren op ±82,5 tot ±82,9)
const LAND = [182.7, 224.5]; // landpijlers (geschat: zijoverspanning 100 m, velden van 41,8 m)
const DECK_END = { south: -266.54, north: 266.39 }; // BGT-einden van de dekken
const ABUT_END = 272.8; // achterkant landhoofden (BGT)

// Dekranden (BGT, lineair van zuid naar noord): [binnen, buiten] per brug.
const EDGES = {
  east: { inner: [-0.47, -0.24], outer: [-29.24, -29.67] },
  west: { inner: [0.47, 0.24], outer: [29.46, 29.15] },
};
const edgeAt = ([s, n], x) => lerp(s, n, (x - DECK_END.south) / (DECK_END.north - DECK_END.south));
function deck(side, x) {
  const e = EDGES[side];
  const inner = edgeAt(e.inner, x);
  const outer = edgeAt(e.outer, x);
  return { inner, outer, centre: (inner + outer) / 2, dir: Math.sign(outer) };
}
// Wegdek (z) op dwarsafstand y bij station x.
function road(x, y, side) {
  const { centre } = deck(side, x);
  return Z(centreNap(x)) + CROSSFALL * (Math.abs(centre) - Math.abs(y));
}
const roadC = (x) => Z(centreNap(x));

// Constructiehoogte (wegdek op de as tot de onderkant van de koker), geschat
// op foto's: 4,0 m in het midden van de hoofdoverspanning en over de
// aanbruggen, 7,2 m boven de rivierpijlers (parabolische voute; de uitbouw
// loopt 80 m de zijoverspanning in), 5,0 m boven de eerste landpijler.
const DEPTH = { mid: 4.0, river: 7.2, land: 5.0, cantilever: 80, landHaunch: 16 };
function depth(x) {
  const u = Math.abs(x);
  if (u <= RIVER) return DEPTH.mid + (DEPTH.river - DEPTH.mid) * (u / RIVER) ** 2;
  const a = u - RIVER;
  let d = DEPTH.mid + (DEPTH.river - DEPTH.mid) * Math.max(0, 1 - a / DEPTH.cantilever) ** 2;
  const v = Math.abs(u - LAND[0]);
  if (v < DEPTH.landHaunch) d = Math.max(d, DEPTH.mid + (DEPTH.land - DEPTH.mid) * (1 - v / DEPTH.landHaunch) ** 2);
  return d;
}
const soffit = (x) => roadC(x) - depth(x);

// Dwarsdoorsnede: koker van 13 m breed onder het midden van elk dek, dekplaat
// van 1,0 m; schoren van 1,0 × 1,0 m om de 3,6 m van 1,0 m boven de
// onderkant van de koker tot 1,5 m van de dekrand.
const BOX_HALF = 6.5;
const SLAB = 1.0;
const STRUT = { step: 3.6, size: 1.0, foot: 1.0, fromEdge: 1.5, first: -263.0 };
// Schampkanten: buiten 1,0 m breed en 0,6 m hoog (in plaats van de
// aluminium leuning), binnen langs de spleet 1,2 m breed en 0,8 m hoog (de
// geleiderail op de middenberm). Op de landhoofden de koppen van de
// leuningen: 6,3 m lang en 1,5 m boven het wegdek (foto).
const KERB = { outer: { width: 1.0, height: 0.6 }, inner: { width: 1.2, height: 0.8 } };
const END_BLOCK = { height: 1.5 };

// Kolommen. Landpijlers: twee kolommen per brug, 9 m hart op hart, onder
// 3,5 m en boven 2,5 m dik, op een plint van 0,8 m boven het maaiveld van de
// uiterwaard (AHN DTM, NAP). Rivierpijlers: drie kolommen per brug, 7 m hart
// op hart; de buitenste lopen naar boven toe taps toe, de middelste omgekeerd;
// op een poer volgens de BGT (21,1 × 3,3 m, bovenkant NAP +1,0 m).
const LAND_COLUMN = { spacing: 4.5, rBottom: 1.75, rTop: 1.25, plinth: 0.8 };
const LAND_GROUND_NAP = { "-182.7": 3.6, "-224.5": 3.4, "182.7": 2.3, "224.5": 1.7 };
const RIVER_COLUMN = { spacing: 7.0, outer: [1.6, 1.2], middle: [1.1, 1.6] };
const CAP = { length: 21.1, width: 3.3, topNap: 1.0 };

const SIDES = ["east", "west"];
const keyXs = [-RIVER, RIVER, ...LAND.flatMap((x) => [-x, x, -x - DEPTH.landHaunch, -x + DEPTH.landHaunch, x - DEPTH.landHaunch, x + DEPTH.landHaunch])];
keyXs.push(-RIVER - DEPTH.cantilever, RIVER + DEPTH.cantilever, DECK_END.south, DECK_END.north);

// ---------- dekken ----------
const slabXs = stations(-ABUT_END, ABUT_END, 2, keyXs);
const boxXs = stations(DECK_END.south - 0.5, DECK_END.north + 0.5, 2, keyXs);
const deckParts = [];
for (const side of SIDES) {
  deckParts.push(
    loft(slabXs, (x) => {
      const { inner, outer } = deck(side, x);
      const lo = Math.min(inner, outer);
      const hi = Math.max(inner, outer);
      return [[lo, road(x, lo, side) - SLAB], [hi, road(x, hi, side) - SLAB], [hi, road(x, hi, side)], [lo, road(x, lo, side)]];
    }),
    loft(boxXs, (x) => {
      const { centre } = deck(side, x);
      const top = roadC(x) - SLAB + 0.3;
      return [[centre - BOX_HALF, soffit(x)], [centre + BOX_HALF, soffit(x)], [centre + BOX_HALF, top], [centre - BOX_HALF, top]];
    }),
  );
}
// Schoren: per brug aan beide kanten van de koker.
const strutXs = [];
for (let x = STRUT.first; x <= -STRUT.first + 1e-6; x += STRUT.step) strutXs.push(+x.toFixed(3));
function strut(side, x, outward) {
  const { inner, outer, centre, dir } = deck(side, x);
  const d = outward ? dir : -dir; // richting van de koker naar de dekrand
  const edge = outward ? outer : inner;
  // Hart van de schoor van 1,0 m boven de onderkant van de koker tot de
  // onderkant van de dekplaat, 1,5 m van de dekrand.
  const p0 = [centre + d * BOX_HALF, soffit(x) + STRUT.foot];
  const te = edge - d * STRUT.fromEdge;
  const zSlab = road(x, te, side) - SLAB;
  const p1 = [te, zSlab];
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const u = [(p1[0] - p0[0]) / len, (p1[1] - p0[1]) / len];
  const half = STRUT.size / 2 / Math.abs(u[0]); // verticale halve dikte
  const a = p0[0] - d * 0.3; // 0,3 m in de koker
  const zc = (t) => p0[1] + ((t - p0[0]) * u[1]) / u[0];
  // De schoor eindigt in een kop met verticale zijden die 0,3 m in de
  // dekplaat steekt: zo maakt zijn bovenkant geen spitse spleet met de
  // onderkant van de dekplaat (een vlak zonder dikte voor de kaart).
  const tHead = p0[0] + ((zSlab - 0.6 - half - p0[1]) * u[0]) / u[1]; // bovenkant 0,6 m onder de dekplaat
  const tEnd = tHead + d * STRUT.size;
  const section = [
    [a, zc(a) - half],
    [a, zc(a) + half],
    [tHead, zc(tHead) + half],
    [tHead, zSlab + 0.3],
    [tEnd, zSlab + 0.3],
    [tEnd, zc(tEnd) - half],
  ];
  return extrudeX(section, x - STRUT.size / 2, x + STRUT.size / 2);
}
const struts = SIDES.flatMap((side) => strutXs.flatMap((x) => [strut(side, x, true), strut(side, x, false)]));

// Schampkant langs een rand; `margin` maakt hem rondom groter (de vrije
// ruimte van het wegdek).
function kerbSection(side, x, which, height, margin) {
  const { inner, outer, dir } = deck(side, x);
  const edge = which === "outer" ? outer : inner;
  const w = KERB[which].width;
  const inward = which === "outer" ? -dir : dir;
  const e2 = edge + inward * w;
  const lo = Math.min(edge, e2) - margin;
  const hi = Math.max(edge, e2) + margin;
  return [
    [lo, road(x, lo, side) - 0.6 - margin],
    [hi, road(x, hi, side) - 0.6 - margin],
    [hi, road(x, hi, side) + height + margin],
    [lo, road(x, lo, side) + height + margin],
  ];
}
const kerbXs = stations(-ABUT_END, ABUT_END, 2, keyXs);
const kerb = (side, which, margin = 0, xs = kerbXs, height = KERB[which].height) =>
  loft(xs, (x) => kerbSection(side, x, which, height, margin));
const kerbs = SIDES.flatMap((side) => [kerb(side, "outer"), kerb(side, "inner")]);
const endXs = (sgn, margin = 0) =>
  sgn < 0 ? stations(-ABUT_END - margin, DECK_END.south + margin, 1) : stations(DECK_END.north - margin, ABUT_END + margin, 1);
const endBlocks = SIDES.flatMap((side) => [-1, 1].map((sgn) => kerb(side, "outer", 0, endXs(sgn), END_BLOCK.height)));

// ---------- pijlers en landhoofden ----------
const frustum = (cx, cy, z0, z1, r0, r1) => Manifold.cylinder(z1 - z0, r0, r1, 32, false).translate([cx, cy, z0]);
const landPiers = SIDES.flatMap((side) =>
  LAND.flatMap((l) =>
    [-l, l].flatMap((x) => {
      const { centre } = deck(side, x);
      const top = Z(LAND_GROUND_NAP[String(x)] + LAND_COLUMN.plinth);
      const s = LAND_COLUMN.spacing;
      const r = LAND_COLUMN.rBottom + 0.5;
      return [
        box(x - r, x + r, centre - s - r, centre + s + r, BASE, top),
        ...[-s, s].map((dy) => frustum(x, centre + dy, top - 0.1, soffit(x) + 0.3, LAND_COLUMN.rBottom, LAND_COLUMN.rTop)),
      ];
    }),
  ),
);
function stadium(cx, cy, length, width, z0, z1) {
  const r = width / 2;
  return Manifold.hull([
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([cx, cy - length / 2 + r, z0]),
    Manifold.cylinder(z1 - z0, r, r, 32, false).translate([cx, cy + length / 2 - r, z0]),
  ]);
}
const capTop = Z(CAP.topNap);
const riverPiers = SIDES.flatMap((side) =>
  [-RIVER, RIVER].flatMap((x) => {
    const { centre } = deck(side, x);
    const s = RIVER_COLUMN.spacing;
    return [
      stadium(x, centre, CAP.length, CAP.width, BASE, capTop),
      frustum(x, centre - s, capTop - 0.1, soffit(x) + 0.3, ...RIVER_COLUMN.outer),
      frustum(x, centre, capTop - 0.1, soffit(x) + 0.3, ...RIVER_COLUMN.middle),
      frustum(x, centre + s, capTop - 0.1, soffit(x) + 0.3, ...RIVER_COLUMN.outer),
    ];
  }),
);
// Landhoofden: massief onder het dekeinde in het dijktalud, tot onder de dekplaat.
const abutments = SIDES.flatMap((side) =>
  [-1, 1].map((sgn) =>
    loft(sgn < 0 ? stations(-ABUT_END, DECK_END.south + 0.01, 1) : stations(DECK_END.north - 0.01, ABUT_END, 1), (x) => {
      const { inner, outer } = deck(side, x);
      const lo = Math.min(inner, outer);
      const hi = Math.max(inner, outer);
      return [[lo, BASE], [hi, BASE], [hi, road(x, hi, side) - SLAB + 0.2], [lo, road(x, lo, side) - SLAB + 0.2]];
    }),
  ),
);

const bridge = union([...deckParts, ...struts, ...kerbs, ...endBlocks, ...landPiers, ...riverPiers, ...abutments]);

// ---------- printvoet (alleen in de STL) ----------
// De dekken hangen tussen de pijlers vrij en de dekplaat kraagt 8 m uit. Net
// als de overhangopvulling van de export krijgt de STL onder elk dek een wig
// van 50 graden vanaf beide dekranden (over de schoren heen) die uitloopt in
// een scherm van minstens 0,9 m onder het midden van de koker tot de
// onderplaat.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.45 * scale) / 1000);
const footXs = stations(DECK_END.south, DECK_END.north, 1, keyXs);
const printFoot = union(
  SIDES.flatMap((side) => {
    const stem = loft(footXs, (x) => {
      const { centre } = deck(side, x);
      return [[centre - SCREEN, BASE], [centre + SCREEN, BASE], [centre + SCREEN, soffit(x) + 0.3], [centre - SCREEN, soffit(x) + 0.3]];
    });
    const wings = ["inner", "outer"].map((which) =>
      loft(footXs, (x) => {
        const d = deck(side, x);
        const edge = (which === "outer" ? d.outer : d.inner) + Math.sign((which === "outer" ? d.outer : d.inner) - d.centre) * 0.02;
        const out = Math.sign(edge - d.centre);
        const zs = road(x, edge, side) - SLAB + 0.02;
        const ys = d.centre + out * SCREEN;
        const zLow = zs - KNEE * Math.abs(edge - ys);
        const zTop = zs + 0.3;
        if (zLow > BASE + 0.05) return [[ys, zLow], [ys, zTop], [edge, zTop], [edge, zs], [edge - out * 1e-3, zs - KNEE * 1e-3]];
        const yb = edge - out * ((zs - BASE) / KNEE);
        return [[ys, BASE], [ys, zTop], [edge, zTop], [edge, zs], [yb, BASE]];
      }),
    );
    return [stem, ...wings];
  }),
);
const printModel = union([bridge, printFoot]);

// ---------- rijbanen als eigen onderdeel ----------
// De bovenste 0,5 m van het wegdek is een eigen node met de attributen van de
// actuele BGT-wegdelen op het dek (relatieve hoogteligging 1, glTF
// `extras.attributes`), zodat de kleurregels van een thema op het brugdek
// werken zoals op de PDOK-wegdelen ernaast. De BGT legt op beide dekken
// alleen rijbaan autosnelweg (gesloten verharding, zonder
// plus_fysiekvoorkomen): L0002.5ce649185a5443b6afc575bd14beca14 (oost, y = -28,1
// tot -1,8), L0002.777196270e7b47b69db04831ccb6e083 (west, 1,6 tot 28,6) en de
// strook L0002.de11c0d4ea1f44a99e74c949ed8afd25 langs de westrand. De
// schampkanten en de leuningkoppen blijven constructie. Pas na het printmodel
// opgebouwd, zodat de STL het hele brugmodel ongewijzigd bevat.
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan autosnelweg", bgt_fysiekvoorkomen: "gesloten verharding" };
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
// Snijstrook per brug van de spleet tot 0,5 m buiten de dekrand, van 0,5 m
// onder tot 1 m boven het wegdek, 0,5 m voorbij de landhoofden.
const layerXs = stations(-ABUT_END - 0.5, ABUT_END + 0.5, 2, keyXs);
const layerStrip = union(
  SIDES.map((side) =>
    loft(layerXs, (x) => {
      const { outer, dir } = deck(side, x);
      const lo = Math.min(0, outer + dir * 0.5);
      const hi = Math.max(0, outer + dir * 0.5);
      return [[lo, road(x, lo, side) - LAYER], [hi, road(x, hi, side) - LAYER], [hi, road(x, hi, side) + ABOVE], [lo, road(x, lo, side) + ABOVE]];
    }),
  ),
);
const guardXs = stations(-ABUT_END - 1, ABUT_END + 1, 2, keyXs);
const notLayer = union(
  SIDES.flatMap((side) => [
    kerb(side, "outer", GUARD, guardXs),
    kerb(side, "inner", GUARD, guardXs),
    ...[-1, 1].map((sgn) => kerb(side, "outer", GUARD, endXs(sgn, 1), END_BLOCK.height)),
  ]),
);
const roadCut = layerStrip.subtract(notLayer);
const roadway = roadCut.intersect(bridge);
const structure = bridge.subtract(roadCut);
const parts = [
  ["building:jan-blankenbrug", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
];
// De onderdelen tellen op tot de brug als geheel (geen overlap, niets kwijt).
const partition = {
  bridgeM3: +bridge.volume().toFixed(1),
  partsM3: Object.fromEntries(parts.map(([name, solid]) => [name, +solid.volume().toFixed(1)])),
};
partition.sumM3 = +parts.reduce((sum, [, solid]) => sum + solid.volume(), 0).toFixed(1);
partition.overlapM3 = +roadway.intersect(structure).volume().toFixed(3);
if (Math.abs(partition.sumM3 - partition.bridgeM3) > 0.5 || partition.overlapM3 > 0.01) {
  throw new Error(`onderdelen tellen niet op: ${JSON.stringify(partition)}`);
}
console.log("partitie (m3):", JSON.stringify(partition));

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    found.push(p);
  }
  return { area, found };
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-4) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  console.log("vrij hangend in het model (m2):", Math.round(overhangs(bridge).area));
  const print = overhangs(printModel);
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2));
  if (print.area > 2) {
    for (const p of print.found.slice(0, 12)) console.log(p.map((q) => q.map((c) => +c.toFixed(2))));
    throw new Error("printversie heeft overhang");
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
    components: solid.decompose().length,
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
report.partition = partition;
const nap = (z) => +(z + WATER_NAP).toFixed(2);
report.profile = {
  roadNap: { end: +centreNap(DECK_END.north).toFixed(2), river: +centreNap(RIVER).toFixed(2), crest: +centreNap(0).toFixed(2) },
  soffitNap: { mid: nap(soffit(0)), river: nap(soffit(RIVER)), channelEdge: nap(soffit(73.5)), land1: nap(soffit(LAND[0])), approach: nap(soffit(LAND[1])) },
  struts: strutXs.length * 4,
};
const glbFile = path.join(outDir, "jan-blankenbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-jan-blankenbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `jan-blankenbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Jan Blankenbrug 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  components: printSolid.decompose().length,
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten alleen
// op de Lek in de hoofdoverspanning, 38 tot 40 m naast de spleet (buiten de
// dekken en vóór de oude pijlers van de gesloopte boogbrug).
const samplePoints = [-50, 0, 50].flatMap((x) => [
  [x, 40],
  [x, -38],
]);
await writeFile(
  path.join(outDir, "jan-blankenbrug.json"),
  JSON.stringify(
    {
      name: "Jan Blankenbrug",
      file: "jan-blankenbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [133752.26, 445509.28],
      xAxis: [-0.32215, 0.94669],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de spleet tussen de twee dekken midden in de hoofdoverspanning op de waterspiegel van de Lek (z = 0, NAP -0,27 m) in de oorsprong, +X langs de brug naar het noordnoordwesten (Nieuwegein, RD-richting 108,79 graden vanaf het oosten) en +Y naar het westzuidwesten (stroomafwaarts; de westelijke brug van 2004 op +Y, de oostelijke van 1999 op -Y). Twee nodes: road:rijbaan, de bovenste 0,5 m van beide wegdekken met de attributen van het BGT-wegdeel erop in extras.attributes (bgt_functie rijbaan autosnelweg, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, twee gelijke betonnen uitbouwbruggen van 532,9 m en 29 m breed met een spleet van 0,5 tot 0,9 m ertussen (wegdek NAP +17,6 m aan de dekeinden en +21,2 m in het midden, elk dek 2,5 % aflopend naar de buitenrand), elk met één koker van 13 m breed onder het midden van het dek, aan beide kanten een rij schoren om de 3,6 m onder de uitkragende dekplaat, schampkanten en de koppen van de leuningen op de landhoofden; de hoofdoverspanning van 165 m op twee rivierpijlers met per brug drie kegelvormige kolommen (de middelste omgekeerd taps) op een poer, met een voute van 4,0 m in het midden naar 7,2 m boven de pijlers; zijoverspanningen van 100 m en aan elke kant twee velden van 41,8 m op landpijlers van twee kolommen op een plint; de landhoofden in de dijken. Lantaarnpalen, de aluminium leuningen, de seinportalen, het looprooster in de spleet en de pijlerresten van de gesloopte boogbrug zijn weggelaten; de export vult onder de dekken een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de Lek naast de hoofdoverspanning bemonsterd; groundHeight is de PDOK-waterspiegel daar. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(DECK_END.north - DECK_END.south).toFixed(2),
        lengthWithAbutmentsM: 2 * ABUT_END,
        deckWidthM: 29.0,
        gapM: { south: 0.94, north: 0.48 },
        mainSpanM: 2 * RIVER,
        sideSpanM: LAND[0] - RIVER,
        approachSpansM: [+(LAND[1] - LAND[0]).toFixed(1), +(DECK_END.north - LAND[1]).toFixed(1)],
        riverPierX: [-RIVER, RIVER],
        landPierX: LAND.flatMap((x) => [-x, x]),
        profileNap: PROFILE,
        crossfall: CROSSFALL,
        depthM: DEPTH,
        boxWidthM: 2 * BOX_HALF,
        strutStepM: STRUT.step,
        soffitNapM: report.profile.soffitNap,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Jan_Blankenbrug_(Vianen)",
        "https://structurae.net/en/structures/vianen-bridge",
        "Bouwdienst Magazine maart 2003, 'Spiegelbeeld: bouw van de tweede nieuwe Lekbrug Vianen' (open.rijkswaterstaat.nl)",
        "Nederlandse Bruggenstichting, Bruggen 2021 nr. 4, 'Geschiedenis van de overbrugging van de Lek tussen Vreeswijk en Vianen'",
        "https://www.zja.nl/en/page/995/bridges-over-the-river-lek-vianen",
        "PDOK BGT overbruggingsdeel (dekken L0002.2fa7ca7db0104aab9393b5deb0e26f83 en L0002.022e7942000f4293bb6c6d51e8ad026d, poeren van de rivierpijlers, landhoofden) en wegdeel, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het lengteprofiel en het dwarsverval van het wegdek en de uiterwaarden; PDOK-terrein voor de waterspiegel",
        "Wikimedia Commons: Nice shaped 2 new (1999 and 2006) concrete river bridges, with the old 153 m span steel archbridge (1936) left - panoramio.jpg, Old steelbridge over the Lekriver with the 2 new concrete ones in front - panoramio.jpg, VianenBrug01.JPG, VianenBrug02.JPG, De Lek IJsselstein 01.JPG, A2 - Jan Blankenbrug, Lekbrug - RWS 421287.jpg en 421290.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

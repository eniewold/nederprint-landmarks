// Genereert een vereenvoudigd, gesloten 3D-model van de Andrej Sacharovbrug
// (Pleijbrug) over de Nederrijn bij Arnhem (N325, Pleijroute, BVN, in gebruik
// sinds 3 november 1987): een betonnen kokerliggerbrug van 764 m tussen de
// landhoofden op de dijkopritten, met een hoofdoverspanning van 133 m op twee
// V-pijlers aan de oevers, zijoverspanningen van 80 m en aan elke kant vijf
// aanbrugvelden van 49 m op schijfpijlers. Het dek bestaat uit twee kokerliggers
// naast elkaar (de noordwestelijke met het fietspad, 16,5 m breed, en de
// zuidoostelijke, 11,9 m), elk met een eigen schijf per pijler en een eigen V.
// Alle maten in het script zijn meters op ware grootte. Uitvoer: een GLB in
// meters (Y omhoog, de materiaalklasse in de nodenaam: de constructie als
// building, rijbaan en fietspad op het dek als road met de BGT-attributen) als
// catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal> met een printvoet onder het dek.
//
//   node scripts/generate-andrej-sacharovbrug.mjs              # STL op 1:2000 (standaard, 384 mm)
//   node scripts/generate-andrej-sacharovbrug.mjs --scale 2500
//
// Assenstelsel: oorsprong op de as van het dek midden in de hoofdoverspanning
// (RD 192809,19, 441243,80), op de waterspiegel van de Nederrijn zoals het
// PDOK-terrein die legt (NAP +8,17 m), Z omhoog. +X loopt langs het rechte
// middendeel van de brug naar het oostnoordoosten (Huissen/Velperbroek,
// RD-richting 27,39 graden vanaf het oosten), +Y naar het noordnoordwesten
// (stroomopwaarts, de kant van het fietspad). Het dek is recht tussen
// x = -122 en 122 en buigt daarbuiten aan beide kanten in een boog met een
// straal van 2447 m naar +Y af (aan de uiteinden 13,7 m naast de rechte as);
// lofts en pijlers volgen die boog. De V-pijlers staan op x = -66,4 en 66,4,
// de schijfpijlers op 146,9, 195,9, 245,0, 293,7 en 342,7 aan beide kanten,
// de landhoofden beginnen op 380,2.
//
// Bronnen: BGT overbruggingsdeel (twee dekdelen van samen 28,36 m breed van
// x = -382,0 tot 382,1, de landhoofden, de voet van de zuidwestelijke V-pijler
// van 4,8 × 27,1 m en vier schijfpijlers van 1,4 m dik en 23 m lang op 49 m
// hart op hart aan de zuidwestkant), BGT wegdeel en ondersteunend wegdeel
// (dwarsprofiel: schampkanten, fietspad, scheiding, vluchtstrook, vier
// rijstroken, middenberm; de grens tussen de twee dekdelen midden in de
// middenberm); AHN DSM 0,5 m (PDOK WCS) voor het lengteprofiel van het wegdek
// (NAP +21,98 m bij de landhoofden, top NAP +28,22 m in het midden, hellingen
// van 2,0 % en een topboog met een straal van 7000 m; restfout 9 cm); AHN DTM
// en PDOK-terrein voor de uiterwaarden (NAP +8,3 tot +11,2 m) en de waterspiegel
// (51,83 m ellipsoïdisch = NAP +8,17 m; PDOK = NAP + 43,66 m); Wikipedia voor
// lengte (760 m), hoofd- en zijoverspanningen (133 en 80 m) en het type;
// Wikimedia Commons-foto's (Apdency, Erik Wannee, panoramio) voor de V-pijlers,
// de toog van de hoofdoverspanning, de schijfpijlers per ligger en de
// landhoofden. Geschat (foto's, verhoudingen tegen bekende hoogtes): de
// constructiehoogte (3,8 m over de aanbruggen, 4,6 m boven de V-pijlers,
// 2,6 m midden in de hoofdoverspanning), de V-vorm (18 m breed onder het dek,
// 4,2 m aan de voet, poten van 4 m, bovenkant voet op NAP +11,5 m), de
// kokerbreedtes (gelijk aan de schijven), de vijfde schijfpijler bij elk
// landhoofd (in het dijktalud, niet in de BGT) en de schampkant- en
// geleiderhoogtes.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "andrej-sacharovbrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const area2 = (pts) => pts.reduce((a, [x0, y0], i) => {
  const [x1, y1] = pts[(i + 1) % pts.length];
  return a + x0 * y1 - x1 * y0;
}, 0);
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);

// ---------- tracé ----------
// Recht tussen x = -122 en 122, daarbuiten een boog met straal 2447 m naar +Y
// (fit op de BGT-dekranden, restfout 8 cm). `at(x, s)` geeft het punt op
// afstand s loodrecht naast de as bij station x.
const ALIGN = { straight: 122.0, radius: 2447.0 };
const curveY = (x) => {
  const u = Math.max(0, Math.abs(x) - ALIGN.straight);
  return (u * u) / (2 * ALIGN.radius);
};
const heading = (x) => (Math.sign(x) * Math.max(0, Math.abs(x) - ALIGN.straight)) / ALIGN.radius;
const at = (x, s) => {
  const t = heading(x);
  return [x - s * Math.sin(t), curveY(x) + s * Math.cos(t)];
};
// Onderdeel in een eigen stelsel (u langs de as, s dwars) neerzetten bij station x.
const place = (solid, x) => solid.rotate([0, 0, (heading(x) * 180) / Math.PI]).translate([...at(x, 0), 0]);

// Loft langs de as: per station een convexe doorsnede (s, z), tegen de klok in
// gezien vanaf +X, steeds evenveel punten.
function loft(xs, section) {
  const sections = xs.map((x) => section(x));
  const n = sections[0].length;
  const verts = [];
  xs.forEach((x, i) => {
    for (const [s, z] of sections[i]) {
      const [px, py] = at(x, s);
      verts.push(px, py, z);
    }
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
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  return solid;
}
// Stations van x0 tot x1 om de `step` m, plus de opgegeven tussenpunten.
function stations(x0, x1, step, extra = []) {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return [...Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n), ...extra.filter((x) => x > x0 && x < x1)]
    .sort((a, b) => a - b)
    .filter((x, i, a) => i === 0 || x - a[i - 1] > 1e-3);
}

// ---------- hoofdmaten (boven de waterspiegel, NAP +8,17 m) ----------
const WATER_NAP = 8.17;
const Z = (nap) => nap - WATER_NAP;
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
// Het PDOK-terrein legt de rivier op de waterspiegel van het model.
const GROUND_OFFSET = 0;
// PDOK-waterspiegel (ellipsoïdisch) op de maaiveldpunten, als vaste terugval
// voor een uitsnede die alleen een aanbrug raakt.
const GROUND_HEIGHT = 51.83;

// Wegdek (AHN DSM, rijstroken zonder geleiders): top NAP +28,22 m op x = 0,
// topboog met straal 7000 m tot x = ±140, daarbuiten 2,0 % naar beneden.
const PROFILE = { crestNap: 28.22, radius: 7000, grade: 0.02 };
function road(x) {
  const u = Math.abs(x);
  const xt = PROFILE.grade * PROFILE.radius;
  const drop = u < xt ? (u * u) / (2 * PROFILE.radius) : (xt * xt) / (2 * PROFILE.radius) + PROFILE.grade * (u - xt);
  return Z(PROFILE.crestNap - drop);
}

// Indeling langs de as (BGT; de vijfde schijf bij elk landhoofd geschat).
const V_PIER = 66.4; // harten van de V-pijlers (BGT-voet zuidwest, gespiegeld)
const COLUMNS = [146.9, 195.9, 245.0, 293.7, 342.7]; // schijfpijlers, aan beide kanten
const ABUT = { face: 380.2, end: 384.5 }; // voorkant en achterkant landhoofd
const DECK_END = 384.5; // dekplaat en wegdek lopen over het landhoofd door

// Dwarsprofiel (s naar +Y, BGT): dekrand op ±14,18; de grens tussen de twee
// kokerliggers midden in de middenberm (s = -2,3).
const HALF = 14.18;
const SPLIT = -2.3;
const GIRDERS = [
  // zuidoostelijke ligger (twee rijstroken richting Nijmegen)
  { edge: [-HALF, SPLIT], bottom: [-11.46, -3.6] },
  // noordwestelijke ligger (twee rijstroken richting Velperbroek en het fietspad)
  { edge: [SPLIT, HALF], bottom: [-1.0, 11.5] },
];
const WEB_FLARE = 0.5; // de lijven staan bovenaan 0,5 m verder naar buiten
const SLAB = { edge: 0.6, web: 1.0 }; // dikte van de dekplaat aan de rand en bij het lijf
// Constructiehoogte onder het wegdek (geschat op foto's): aanbruggen 3,8 m,
// boven de V-pijlers 4,6 m, midden in de hoofdoverspanning 2,6 m (parabolische
// toog tussen de V-koppen); in de zijoverspanningen loopt de toog in 22 m terug
// naar 3,8 m.
const DEPTH = { approach: 3.8, pier: 4.6, mid: 2.6, haunch: 22 };
// V-pijlers: per ligger een V in het vlak van de ligger, 18 m breed onder het
// dek, 4,2 m aan de voet, poten van 4 m breed (horizontaal) en een
// V-vormige opening tussen de poten tot 2,2 m boven de voet; de voet staat op
// een poer volgens de BGT (bovenkant NAP +11,5 m).
const V = { topHalf: 9.0, tipHalf: 2.1, leg: 4.0, apex: 2.2, baseTopNap: 11.47 };
const V_TOP_IN = V_PIER - V.topHalf; // 57,4: begin van de toog in de hoofdoverspanning
const V_TOP_OUT = V_PIER + V.topHalf; // 75,4
function depth(x) {
  const u = Math.abs(x);
  if (u <= V_TOP_IN) return DEPTH.mid + (DEPTH.pier - DEPTH.mid) * (u / V_TOP_IN) ** 2;
  if (u <= V_TOP_OUT) return DEPTH.pier;
  if (u <= V_TOP_OUT + DEPTH.haunch) {
    const t = (u - V_TOP_OUT) / DEPTH.haunch;
    return DEPTH.approach + (DEPTH.pier - DEPTH.approach) * (1 - t) ** 2;
  }
  return DEPTH.approach;
}
const soffit = (x) => road(x) - depth(x);
// Poer van de V-pijler (BGT L0002.ae1b308a8fc64eab8572a9f8560f4ea5, zuidwest).
const V_FOOT = [
  [-65.55, -0.37], [-64.62, 0.32], [-64.19, 1.24], [-64.14, 7.27], [-64.1, 12.62], [-64.0, 24.6], [-65.15, 26.01],
  [-66.79, 26.54], [-66.88, 26.51], [-67.83, 26.2], [-68.79, 24.31], [-68.73, 2.76], [-68.54, 0.77], [-67.57, -0.4],
  [-66.58, -0.56],
].map(([x, y]) => [x, y - 13.81]);
const COLUMN_THICK = 1.4; // schijfdikte langs de as (BGT)

// Op het dek (BGT ondersteunend wegdeel cementbeton): schampkanten aan beide
// randen, de geleider tussen fietspad en rijbaan (BGT 0,55 m, in het model
// 0,9 m) en de geleiderrail in de middenberm. Hoogtes geschat.
const KERBS = [
  { s: [13.1, HALF], h: 0.6 }, // noordwestelijke schampkant (BGT 13,1–14,2)
  { s: [-HALF, -12.7], h: 0.6 }, // zuidoostelijke schampkant (BGT -14,2 tot -12,7)
  { s: [8.48, 9.38], h: 0.8 }, // scheiding fietspad-rijbaan (BGT 8,65–9,2)
  { s: [-2.8, -1.8], h: 0.8 }, // geleiderrail op de middenberm (BGT -3,7 tot -0,9)
];
// Koppen van de vleugelwanden op de landhoofden (foto), op de schampkanten.
const END_BLOCK = { from: 381.0, to: ABUT.end, h: 1.6 };

// ---------- dek ----------
const keyXs = [-V_TOP_OUT - DEPTH.haunch, -V_TOP_OUT, -V_TOP_IN, V_TOP_IN, V_TOP_OUT, V_TOP_OUT + DEPTH.haunch, -ALIGN.straight, ALIGN.straight];
const deckXs = stations(-ABUT.face - 0.5, ABUT.face + 0.5, 2, keyXs); // 0,5 m in het landhoofd
const slabXs = stations(-DECK_END, DECK_END, 2, [...keyXs, -ABUT.face, ABUT.face]);
const deckParts = [];
for (const { edge: [e0, e1], bottom: [b0, b1] } of GIRDERS) {
  const t0 = b0 - WEB_FLARE;
  const t1 = b1 + WEB_FLARE;
  deckParts.push(
    loft(slabXs, (x) => {
      const zt = road(x);
      return [[e0, zt - SLAB.edge], [t0, zt - SLAB.web], [t1, zt - SLAB.web], [e1, zt - SLAB.edge], [e1, zt], [e0, zt]];
    }),
    loft(deckXs, (x) => {
      const zt = road(x);
      return [[b0, soffit(x)], [b1, soffit(x)], [t1, zt - SLAB.web + 0.05], [t0, zt - SLAB.web + 0.05]];
    }),
  );
}
const deck = union(deckParts);
const kerbXs = stations(-DECK_END, DECK_END, 2, keyXs);
// Schampkant of geleider, van onder de wegdeklaag tot h boven het wegdek;
// `margin` maakt hem rondom groter (de vrije ruimte van het wegdek).
const kerb = ({ s: [s0, s1], h }, margin = 0, xs = kerbXs) =>
  loft(xs, (x) => {
    const zt = road(x);
    return [[s0 - margin, zt - 0.6 - margin], [s1 + margin, zt - 0.6 - margin], [s1 + margin, zt + h + margin], [s0 - margin, zt + h + margin]];
  });
const kerbs = KERBS.map((k) => kerb(k));
const endBlocks = [-1, 1].flatMap((side) => {
  const xs = side < 0 ? stations(-END_BLOCK.to, -END_BLOCK.from, 1) : stations(END_BLOCK.from, END_BLOCK.to, 1);
  return KERBS.slice(0, 2).map(({ s }) => kerb({ s, h: END_BLOCK.h }, 0, xs));
});

// ---------- pijlers en landhoofden ----------
// Schijfpijlers: per ligger een schijf van 1,4 m dik onder de koker, van de
// onderkant tot 0,1 m in de koker.
const columns = [-1, 1].flatMap((side) =>
  COLUMNS.flatMap((c) => {
    const x = side * c;
    return GIRDERS.map(({ bottom: [b0, b1] }) =>
      place(box(-COLUMN_THICK / 2, COLUMN_THICK / 2, b0, b1, BASE, soffit(x) + 0.3), x),
    );
  }),
);
// V-pijlers: per ligger een V (poten met een V-vormige opening ertussen) op de
// gezamenlijke poer.
const vZb = Z(V.baseTopNap);
function vPier(cx) {
  const zt = soffit(cx);
  // Onderaan 0,4 m recht op de poer, zodat de schuine poot niet in een
  // spits hoekje op de bovenkant van de poer uitkomt.
  const outer = [
    [cx - V.tipHalf, vZb - 0.05], [cx + V.tipHalf, vZb - 0.05], [cx + V.tipHalf, vZb + 0.4],
    [cx + V.topHalf, zt + 0.15], [cx - V.topHalf, zt + 0.15], [cx - V.tipHalf, vZb + 0.4],
  ];
  const inner = V.topHalf - V.leg;
  const hole = [[cx, vZb + V.apex], [cx + inner, zt], [cx + inner, zt + 1], [cx - inner, zt + 1], [cx - inner, zt]];
  return GIRDERS.map(({ bottom: [b0, b1] }) => profileY(outer, b0, b1).subtract(profileY(hole, b0 - 1, b1 + 1)));
}
const vOpenings = [-V_PIER, V_PIER].flatMap((cx) => {
  const zt = soffit(cx);
  const inner = V.topHalf - V.leg;
  return GIRDERS.map(({ bottom: [b0, b1] }) => profileY([[cx, vZb + V.apex], [cx + inner, zt + 0.15], [cx - inner, zt + 0.15]], b0, b1));
});
const vFeet = [V_FOOT, V_FOOT.map(([x, y]) => [-x, y])].map((poly) => prism(poly, BASE, vZb));
const vPiers = [-V_PIER, V_PIER].flatMap(vPier);
// Landhoofden: massief onder het dek tot 0,4 m onder het wegdek, van de
// voorkant tot de achterkant in het dijktalud.
const abutments = [-1, 1].map((side) =>
  loft(side < 0 ? stations(-ABUT.end, -ABUT.face, 1) : stations(ABUT.face, ABUT.end, 1), (x) => {
    const zt = road(x);
    return [[-HALF, BASE], [HALF, BASE], [HALF, zt - SLAB.edge + 0.2], [-HALF, zt - SLAB.edge + 0.2]];
  }),
);

const bridge = union([deck, ...kerbs, ...endBlocks, ...columns, ...vFeet, ...vPiers, ...abutments]);

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij en de dekplaat kraagt uit. Net als de
// overhangopvulling van de export krijgt de STL daaronder een wig van
// minstens 50 graden vanaf de randen van de dekplaat, onder de hoeken van de
// kokers door, die uitloopt in een scherm van minstens 0,9 m (0,45 mm op
// 1:2000) in de spleet tussen de schijven; de openingen van de V's worden
// dichtgezet.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.45 * scale) / 1000);
const ym = (GIRDERS[0].bottom[1] + GIRDERS[1].bottom[0]) / 2;
const footXs = stations(-ABUT.face - 0.5, ABUT.face + 0.5, 1, keyXs);
const printFoot = union([
  loft(footXs, (x) => {
    const zt = road(x);
    const zb = zt - SLAB.edge + 0.02;
    const zg = soffit(x) - 0.05;
    const yL = -HALF - 0.02;
    const yR = HALF + 0.02;
    const kL = Math.max(KNEE, (zb - zg) / (GIRDERS[0].bottom[0] - 0.02 - yL));
    const kR = Math.max(KNEE, (zb - zg) / (yR - GIRDERS[1].bottom[1] - 0.02));
    const zsL = zb - kL * (ym - SCREEN - yL);
    const zsR = zb - kR * (yR - ym - SCREEN);
    const left = zsL > BASE + 0.05 ? [[ym - SCREEN, BASE], [ym - SCREEN, zsL]] : (() => {
      const a = yL + (zb - BASE) / kL;
      return [[a, BASE], [a - 1e-3, BASE + 1e-3]];
    })();
    const right = zsR > BASE + 0.05 ? [[ym + SCREEN, BASE], [ym + SCREEN, zsR]] : (() => {
      const a = yR - (zb - BASE) / kR;
      return [[a, BASE], [a + 1e-3, BASE + 1e-3]];
    })();
    return [left[0], right[0], right[1], [yR, zb], [yL, zb], left[1]];
  }),
  ...vOpenings,
]);
const printModel = union([bridge, printFoot]);

// ---------- rijbaan en fietspad als eigen onderdelen ----------
// De bovenste 0,5 m van het wegdek is per BGT-functie een eigen node met de
// attributen van de actuele BGT-wegdelen erop (relatieve hoogteligging 1,
// glTF `extras.attributes`), zodat de kleurregels van een thema (fietspaden
// rood) op het brugdek werken zoals op de PDOK-wegdelen ernaast. Pas na het
// printmodel opgebouwd, zodat de STL het hele brugmodel ongewijzigd bevat.
//
// De BGT legt op het dek per 100 m vier rijstroken rijbaan regionale weg
// (gesloten verharding, asfalt; bijvoorbeeld P0025.1e5d4f27df2c4413bb5afa46ecc68594,
// P0025.544096d6531340ef9cf6b0993c097cc1, P0025.7af509baa3384949817531452266385b,
// P0025.7e4c15861a614b0ca187a5f35c9c2586 boven de rivier) en aan de
// noordwestkant een fietspad (gesloten verharding, asfalt;
// P0025.3d3a78b1426a4875a942a63f091f5376 boven de rivier, s = 9,1 tot 13,1),
// met bermen (ondersteunend wegdeel): asfalt naast de rijstroken (horen bij de
// rijbaan) en cementbeton voor de schampkanten, de scheiding en de middenberm.
// De schampkanten, de scheiding en de geleiderrail blijven constructie; de
// rest van de middenberm hoort bij de rijbaan.
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const BIKE_EDGE = (KERBS[2].s[0] + KERBS[2].s[1]) / 2; // midden van de scheiding
const outXs = stations(-DECK_END - 4, DECK_END + 4, 4);
const bikeRegion = prism(
  [...outXs.map((x) => at(x, BIKE_EDGE)), ...[...outXs].reverse().map((x) => at(x, 40))],
  BASE - 1,
  100,
);
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek over de stations van het
// dek, over de volle breedte en 0,5 m voorbij de einden van de landhoofden.
const layerXs = stations(-DECK_END - 0.5, DECK_END + 0.5, 2, [...keyXs, -ABUT.face, ABUT.face, -DECK_END, DECK_END]);
const layerStrip = loft(layerXs, (x) => {
  const zt = road(x);
  return [[-40, zt - LAYER], [40, zt - LAYER], [40, zt + ABOVE], [-40, zt + ABOVE]];
});
// Wat boven het dek uitsteekt, blijft met 2 cm vrij constructie: de hele
// strook van de schampkanten, de scheiding en de geleiderrail, en de koppen op
// de landhoofden.
const guardXs = stations(-DECK_END - 1, DECK_END + 1, 2, keyXs);
const notLayer = union([
  ...KERBS.map((k) => kerb(k, GUARD, guardXs)),
  ...[-1, 1].flatMap((side) => {
    const xs = side < 0 ? stations(-END_BLOCK.to - 1, -END_BLOCK.from + GUARD, 1) : stations(END_BLOCK.from - GUARD, END_BLOCK.to + 1, 1);
    return KERBS.slice(0, 2).map(({ s }) => kerb({ s, h: END_BLOCK.h }, GUARD, xs));
  }),
]);
const layer = layerStrip.subtract(notLayer);
const roadCut = layer.subtract(bikeRegion);
const bikeCut = layer.intersect(bikeRegion);
const roadway = roadCut.intersect(bridge);
const bikeway = bikeCut.intersect(bridge);
const structure = bridge.subtract(layer);
const parts = [
  ["building:andrej-sacharovbrug", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];
// De onderdelen tellen op tot de brug als geheel (geen overlap, niets kwijt).
const partition = {
  bridgeM3: +bridge.volume().toFixed(1),
  partsM3: Object.fromEntries(parts.map(([name, solid]) => [name, +solid.volume().toFixed(1)])),
};
partition.sumM3 = +parts.reduce((sum, [, solid]) => sum + solid.volume(), 0).toFixed(1);
partition.overlapM3 = +union(parts.slice(1).map(([, solid]) => solid)).intersect(structure).volume().toFixed(3);
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
  if (print.area > 1) {
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
    components: solid.decompose().map((c) => {
      const b = c.boundingBox();
      return `${c.volume().toFixed(3)} m3 x ${b.min[0].toFixed(2)}..${b.max[0].toFixed(2)} y ${b.min[1].toFixed(2)}..${b.max[1].toFixed(2)} z ${b.min[2].toFixed(2)}..${b.max[2].toFixed(2)}`;
    }),
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
report.partition = partition;
report.profile = {
  roadNap: { end: +(road(DECK_END) + WATER_NAP).toFixed(2), vPier: +(road(V_PIER) + WATER_NAP).toFixed(2), crest: +(road(0) + WATER_NAP).toFixed(2) },
  soffitNap: { mid: +(soffit(0) + WATER_NAP).toFixed(2), vTop: +(soffit(V_PIER) + WATER_NAP).toFixed(2), approach: +(soffit(COLUMNS[0]) + WATER_NAP).toFixed(2) },
  vHeightM: +(soffit(V_PIER) - vZb).toFixed(2),
};
const glbFile = path.join(outDir, "andrej-sacharovbrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-andrej-sacharovbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed.
const stlName = `andrej-sacharovbrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Andrej Sacharovbrug 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  components: printSolid.decompose().map((c) => {
    const b = c.boundingBox();
    return { genus: c.genus(), xMm: [+(b.min[0] * mmPerMetre).toFixed(1), +(b.max[0] * mmPerMetre).toFixed(1)] };
  }),
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten alleen
// op de Nederrijn onder de hoofdoverspanning, 25 m naast de as.
const samplePoints = [-40, 0, 40].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "andrej-sacharovbrug.json"),
  JSON.stringify(
    {
      name: "Andrej Sacharovbrug",
      file: "andrej-sacharovbrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [192809.19, 441243.8],
      xAxis: [0.88788, 0.46007],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden in de hoofdoverspanning op de waterspiegel van de Nederrijn (z = 0, NAP +8,17 m) in de oorsprong, +X langs het rechte middendeel naar het oostnoordoosten (Huissen, RD-richting 27,39 graden vanaf het oosten) en +Y naar het noordnoordwesten (de kant van het fietspad); buiten x = ±122 buigt het dek in een boog met een straal van 2447 m naar +Y af. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van het wegdek met de attributen van het BGT-wegdeel erop in extras.attributes (bgt_functie rijbaan regionale weg of fietspad, bgt_fysiekvoorkomen gesloten verharding, plus_fysiekvoorkomen asfalt; het fietspad aan de noordwestrand achter de scheiding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, twee kokerliggers naast elkaar (samen 28,36 m breed) van landhoofd tot landhoofd (764 m, wegdek NAP +22,0 m aan de einden en +28,2 m in het midden), met schampkanten, de scheiding tussen fietspad en rijbaan en de geleiderrail in de middenberm; de hoofdoverspanning van 133 m op twee V-pijlers aan de oevers (per ligger een V van 18 m breed op een gezamenlijke poer) met een toog van 4,6 m boven de V's naar 2,6 m in het midden; zijoverspanningen van 80 m en aan elke kant vijf aanbrugvelden van 49 m op schijfpijlers (per ligger een schijf van 1,4 m dik); de landhoofden met de koppen van de vleugelwanden. Lantaarnpalen, leuningen, het seinportaal en de dilatatievoegen zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de rivier naast de hoofdoverspanning bemonsterd; groundHeight is de PDOK-waterspiegel daar. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(2 * ABUT.end).toFixed(1),
        deckLengthBgtM: 764.1,
        deckWidthM: 2 * HALF,
        girderWidthsM: GIRDERS.map(({ edge: [a, b] }) => +(b - a).toFixed(2)),
        mainSpanM: 2 * V_PIER,
        sideSpanM: +(COLUMNS[0] - V_PIER).toFixed(1),
        approachSpanM: 49,
        vPierCentresM: [-V_PIER, V_PIER],
        columnCentresM: COLUMNS,
        alignment: ALIGN,
        profile: PROFILE,
        depthM: DEPTH,
        vPier: V,
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Andrej_Sacharovbrug",
        "PDOK BGT overbruggingsdeel (dekdelen P0025.98afc1c078bc4528b6090e4430c65a6e en P0025.533a27f4388b44bfb501ea5188bc4e5d, landhoofden, pijlers), wegdeel en ondersteunend wegdeel, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het lengteprofiel van het wegdek en de uiterwaarden; PDOK-luchtfoto voor de indeling van het dek",
        "Wikimedia Commons: Andrej Sacharovbrug.jpg, Andrej Sacharovbrug 2015-1.jpg, Andrej Sacharovbrug 2015-2.jpg (Apdency, CC0), Andrej Sacharovbrug (Arnhem).jpg (Erik Wannee, CC0), Arnhem 27 Januari 2014 Andrej Sacharov bridge at sumdawn - panoramio.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

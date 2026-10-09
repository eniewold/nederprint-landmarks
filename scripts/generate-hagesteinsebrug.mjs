// Genereert een vereenvoudigd, gesloten 3D-model van de Hagesteinsebrug
// (Lekbrug bij Hagestein) over de Lek tussen Vianen/Hagestein en Nieuwegein
// (A27, geopend op 24 juni 1981): een stalen liggerbrug met een betonnen dek
// van 746 m tussen de landhoofden in de Lekdijken. Het middendeel is een
// doorgaande ligger over drie overspanningen (95, 162 en 95 m) met voutes
// (dieper wordende liggers) boven de twee rivierpijlers; aan de zuidkant
// (Hagestein) sluit een aanbrug van zes velden van circa 52,6 m aan, aan de
// noordkant (Nieuwegein) één veld van 64,8 m. Elke rijrichting heeft een
// eigen ligger met dek; op de aanbruggen ligt er een open voeg van 2 m tussen,
// op het middendeel is de middenberm dicht. Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, de
// materiaalklasse in de nodenaam: de constructie als building, de rijbanen op
// het dek als road met de BGT-attributen) als catalogusbron voor de export en
// de kaart, plus een binaire STL in millimeters op 1:<schaal> met een
// printvoet onder het dek. Met 746 m past de brug op 1:1000 niet in 400 mm,
// vandaar standaard 1:2000 (373 mm).
//
//   node scripts/generate-hagesteinsebrug.mjs              # STL op 1:2000 (standaard)
//   node scripts/generate-hagesteinsebrug.mjs --scale 2500
//
// Assenstelsel: oorsprong op de as van het dek midden in de hoofdoverspanning
// boven de Lek (RD 136272,20, 445943,97), op de waterspiegel van de Lek zoals
// het PDOK-terrein die legt (43,69 m ellipsoïdisch, NAP +0,22 m), Z omhoog.
// +X loopt langs de brug naar het noordnoordoosten (Nieuwegein, RD-richting
// 76,71 graden vanaf het oosten, uit de BGT-dekranden), +Y naar het
// westnoordwesten (stroomafwaarts). De rivierpijlers staan op x = -81,0
// (BGT) en 81,0, de voegpijlers aan de einden van het middendeel op -175,7
// en 175,5, de pijlers van de zuidelijke aanbrug op -438,1, -385,4, -333,2,
// -280,6 en -227,7; de dekvoegen bij de landhoofden liggen op -491,9 en
// 240,3, de BGT-einden van het dek op -496,4 en 249,8.
//
// Bronnen: BGT overbruggingsdeel (dek L0002.467068b379c34ad18d312cab62092ab1,
// 30,98 m breed en recht, restfout 0,5 m; landhoofden
// L0002.e165a1ce0d5b4f989263ce9ae1c07491 en
// L0002.b29c608fe05240148017abb0f919d851; de rivierpijler
// L0002.e53beb12ca3e41b2a6d9633d337954c3 van 3,7 × 34,4 m), BGT scheiding
// (muur: de voorwanden van de landhoofden met vleugels tot 3 m buiten het
// dek) en BGT wegdeel (twee rijbanen autosnelweg op het dek); AHN DSM/DTM
// 0,5 m (PDOK WCS) voor het lengteprofiel van het wegdek (NAP +14,46 m bij het
// zuidelijke landhoofd, 1,42 % omhoog, een topboog van 439 m met de top
// NAP +19,53 m boven de Lek, -1,00 % naar NAP +17,76 m bij het noordelijke
// landhoofd; restfout 3 cm), de open middenvoeg op de aanbruggen (de DTM ziet
// de uiterwaard erdoorheen en de jukken van de pijlers in de voeg: daaruit de
// pijlerposities op de aanbrug) en de pijlers naast het dek; PDOK-luchtfoto
// voor de dekvoegen (x = -175,7 en 175,5: daar gaat de open middenvoeg over in
// een dichte middenberm) en het dwarsprofiel; PDOK-terrein voor de
// waterspiegel; Wikipedia voor lengte (740 m), breedte (31 m), bouwperiode en
// type; foto's van Wikimedia Commons (Nationaal Archief 1981, Frans
// Berkelaar, Hans Erren, panoramio) voor de liggers met de konsoles onder de
// uitkraging en de verstijvingen, de voutes, de pijlers met drie taps
// toelopende kolommen op een poer (rivierpijlers) en de pijlerjukken.
// Geschat (foto's, verhoudingen tegen de bekende hoogtes van wegdek, water
// en uiterwaard): de constructiehoogte (3,4 m, 6,8 m boven de rivierpijlers,
// voutes van 38 m in de hoofd- en 28 m in de zijoverspanningen), de ligging
// van de liggerlijven (2,8 m achter de dekrand, 1,85 m van de middenvoeg), de
// dekplaat (0,8 m), de konsoles (om de circa 5 m, 2,0 m hoog), de kolommen
// (aanbrug 2,6 × 2,6 m onder een juk van 2,4 × 2,0 m; voeg- en rivierpijlers
// 3,0 m dik, onder 5,4 en boven 3,6 m breed), de bovenkant van de poeren
// (NAP +5,0 m), de schampkanten (0,7 m) en de middengeleiders (0,8 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "2000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hagesteinsebrug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const box = (x0, x1, y0, y1, z0, z1) =>
  Manifold.cube([x1 - x0, y1 - y0, z1 - z0], false).translate([x0, y0, z0]);
const area2 = (pts) =>
  pts.reduce((a, [x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    return a + x0 * y1 - x1 * y0;
  }, 0);
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
const lerp = (a, b, t) => a + (b - a) * t;
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
  if (solid.volume() <= 0) throw new Error("loft: omgekeerde doorsnede");
  return solid;
}
const loft = (xs, section) => loftX(xs.map((x) => ({ x, section: section(x) })));

// ---------- hoogtes ----------
// Het PDOK-terrein legt de Lek op 43,69 tot 43,72 m ellipsoïdisch op de
// maaiveldpunten; PDOK ligt in de uiterwaarden 43,47 m boven het AHN (mediaan
// over 18.500 terreinpunten). De waterspiegel is dus NAP +0,22 m = z 0.
const GROUND_HEIGHT = 43.69;
const PDOK_ABOVE_NAP = 43.47;
const WATER_NAP = +(GROUND_HEIGHT - PDOK_ABOVE_NAP).toFixed(2);
const Z = (nap) => nap - WATER_NAP;
const GROUND_OFFSET = 0;
const BASE = -1.0; // gemeenschappelijke onderkant, 1 m onder de waterspiegel

// Wegdek (AHN DSM, 30e percentiel over de rijstroken, voortschrijdende
// mediaan over 22 m): 1,42 % omhoog vanaf Hagestein, een topboog van
// 438,8 m met het snijpunt van de raaklijnen op x = -39,62 (NAP +20,758 m),
// -1,00 % naar Nieuwegein. Restfout 3,4 cm (max. 11 cm).
const PROFILE = { g1: 0.0141854, g2: -0.0099815, xi: -39.615, zi: 20.758, L: 438.85 };
function roadNap(x) {
  const { g1, g2, xi, zi, L } = PROFILE;
  const a = xi - L / 2;
  if (x <= a) return zi + g1 * (x - xi);
  if (x >= xi + L / 2) return zi + g2 * (x - xi);
  const t = x - a;
  return zi + g1 * (a - xi) + g1 * t + ((g2 - g1) * t * t) / (2 * L);
}

// ---------- indeling langs de as (x) ----------
const DECK_S = -496.4; // BGT-einde van het dek in het zuidelijke landhoofd
const DECK_N = 249.8; // idem noord
const ABUT_S = { back: DECK_S, face: -489.9, joint: -491.9 }; // BGT landhoofd, voeg (luchtfoto)
const ABUT_N = { back: DECK_N, face: 238.5, joint: 240.3 };
const APPROACH_PIERS = [-438.1, -385.4, -333.2, -280.6, -227.7]; // jukken in de middenvoeg (AHN DTM)
const JOINT_PIERS = [-175.7, 175.5]; // dekvoegen tussen aanbrug en middendeel (luchtfoto, AHN)
const MAIN_PIERS = [-81.0, 81.0]; // rivierpijlers (BGT x = -80,98; noord AHN)
const SUPPORTS = [ABUT_S.joint, ...APPROACH_PIERS, JOINT_PIERS[0], ...MAIN_PIERS, JOINT_PIERS[1], ABUT_N.joint];

// Constructiehoogte onder het wegdek: 3,4 m, boven de rivierpijlers 6,8 m
// (foto's: de ligger is daar twee keer zo hoog) met een vlak stuk van 6 m
// boven de oplegging en rechte voutes van 38 m in de hoofdoverspanning en
// 28 m in de zijoverspanningen.
const DEPTH = { base: 3.4, pier: 6.8, flat: 3.0, mainHaunch: 38, sideHaunch: 28 };
function depth(x) {
  for (const c of MAIN_PIERS) {
    const u = (x - c) * Math.sign(c); // > 0 naar de zijoverspanning
    const len = u > 0 ? DEPTH.sideHaunch : DEPTH.mainHaunch;
    const d = Math.abs(u);
    if (d <= DEPTH.flat) return DEPTH.pier;
    if (d < DEPTH.flat + len) return lerp(DEPTH.pier, DEPTH.base, (d - DEPTH.flat) / len);
  }
  return DEPTH.base;
}
const haunchKeys = MAIN_PIERS.flatMap((c) => {
  const s = Math.sign(c);
  return [
    c - s * (DEPTH.flat + DEPTH.mainHaunch),
    c - s * DEPTH.flat,
    c + s * DEPTH.flat,
    c + s * (DEPTH.flat + DEPTH.sideHaunch),
  ];
});

// Eén stationsraster voor alle lofts (om de 2 m plus de knikken), zodat het
// dek, de schampkanten en de snijstrook van het wegdek precies dezelfde
// vlakken hebben. Het wegdek is lineair tussen deze stations.
const KEYS = [DECK_S, DECK_N, ABUT_S.face, ABUT_S.joint, ABUT_N.face, ABUT_N.joint, ...JOINT_PIERS, ...haunchKeys, -500, 254];
const GRID = [
  ...Array.from({ length: Math.round((254 + 500) / 2) + 1 }, (_, i) => -500 + 2 * i),
  ...KEYS,
]
  .sort((a, b) => a - b)
  .filter((x, i, a) => i === 0 || x - a[i - 1] > 0.05);
const GRID_Z = GRID.map((x) => Z(roadNap(x)));
function road(x) {
  let i = GRID.findIndex((g) => g > x) - 1;
  if (i < 0) i = x < GRID[0] ? 0 : GRID.length - 2;
  i = Math.min(Math.max(i, 0), GRID.length - 2);
  return lerp(GRID_Z[i], GRID_Z[i + 1], (x - GRID[i]) / (GRID[i + 1] - GRID[i]));
}
const stations = (x0, x1) => {
  const inner = GRID.filter((g) => g > x0 + 0.02 && g < x1 - 0.02);
  return [x0, ...inner, x1];
};
const soffit = (x) => road(x) - depth(x);

// ---------- dwarsprofiel (y, +Y naar het westen) ----------
// Dekranden op ±15,49 m (BGT 30,98 m). Tussen de rijrichtingen ligt een voeg
// van 2,0 m (luchtfoto, y = -0,85 tot 1,15); op het middendeel is die dicht.
const EDGE = 15.49;
const GAP = [-0.85, 1.15];
const DECKS = [
  { name: "oost", y: [-EDGE, GAP[0]], webs: [-EDGE + 2.8, GAP[0] - 1.85] },
  { name: "west", y: [GAP[1], EDGE], webs: [GAP[1] + 1.85, EDGE - 2.8] },
];
const SLAB = 0.8; // dekplaat (beton op staal, met asfalt)
// Schampkanten en middengeleiders (BGT: de rijbanen lopen van -14,4 tot -1,9
// en van 2,2 tot 14,6 m).
const KERB_LIST = [
  { y: [-EDGE, -14.4], h: 0.7 },
  { y: [14.6, EDGE], h: 0.7 },
  { y: [-1.9, GAP[0]], h: 0.8 },
  { y: [GAP[1], 2.2], h: 0.8 },
];
const LANES = [
  [-14.4, -1.9],
  [2.2, 14.6],
];
// Afdekking van de middenberm op het middendeel, 0,3 m onder het wegdek.
const COVER = { y: [GAP[0] - 0.1, GAP[1] + 0.1], drop: 0.3 };

// ---------- dek ----------
const deckParts = [];
for (const { y: [e0, e1], webs: [w0, w1] } of DECKS) {
  // Dekplaat over de hele lengte, ook boven de landhoofden.
  deckParts.push(loft(stations(DECK_S, DECK_N), (x) => [[e0, road(x) - SLAB], [e1, road(x) - SLAB], [e1, road(x)], [e0, road(x)]]));
  // Stalen ligger tussen de lijven, van voeg tot voeg, met de voutes.
  deckParts.push(
    loft(stations(ABUT_S.joint, ABUT_N.joint), (x) => [
      [w0, soffit(x)],
      [w1, soffit(x)],
      [w1, road(x) - SLAB + 0.05],
      [w0, road(x) - SLAB + 0.05],
    ]),
  );
}
const cover = loft(stations(JOINT_PIERS[0], JOINT_PIERS[1]), (x) => [
  [COVER.y[0], road(x) - SLAB],
  [COVER.y[1], road(x) - SLAB],
  [COVER.y[1], road(x) - COVER.drop],
  [COVER.y[0], road(x) - COVER.drop],
]);
// Schampkant of geleider, van onder de wegdeklaag tot h boven het wegdek;
// `margin` maakt hem rondom groter (de vrije ruimte van het wegdek).
const kerb = ({ y: [y0, y1], h }, margin = 0, x0 = DECK_S, x1 = DECK_N) =>
  loft(stations(x0, x1), (x) => [
    [y0 - margin, road(x) - 0.6 - margin],
    [y1 + margin, road(x) - 0.6 - margin],
    [y1 + margin, road(x) + h + margin],
    [y0 - margin, road(x) + h + margin],
  ]);
const kerbs = KERB_LIST.map((k) => kerb(k));
// Dekvoegen: sleuven van 0,4 × 0,3 m over de rijbanen.
const JOINT = { width: 0.4, depth: 0.3 };
const jointSlots = (grow = 0) =>
  [ABUT_S.joint, JOINT_PIERS[0], JOINT_PIERS[1], ABUT_N.joint].flatMap((x) =>
    LANES.map(([y0, y1]) =>
      box(x - JOINT.width / 2 - grow, x + JOINT.width / 2 + grow, y0 + 0.01 - grow, y1 - 0.01 + grow, road(x) - JOINT.depth - grow, road(x) + 1.5),
    ),
  );

// ---------- konsoles en verstijvingen aan de buitenlijven ----------
// Onder de uitkraging staat om de circa 5 m een driehoekige konsole van
// 1,0 m dik, 2,0 m hoog aan het lijf en 1,6 m breed onder de dekplaat
// (onderkant 51 graden); daaronder loopt een verticale verstijving van
// 0,9 m breed en 0,3 m dik tot de onderkant van de ligger. Boven de pijlers
// een bredere drukverstijving (2,4 m).
const BRACKET = { thick: 1.0, drop: 2.0, reach: 1.6, step: 5.0 };
const RIB = { width: 0.9, proud: 0.3, pier: 2.4 };
const bracketXs = [];
for (let i = 0; i + 1 < SUPPORTS.length; i++) {
  const [a, b] = [SUPPORTS[i], SUPPORTS[i + 1]];
  const n = Math.max(2, Math.round((b - a) / BRACKET.step));
  for (let k = 1; k < n; k++) bracketXs.push(a + ((b - a) * k) / n);
}
const outerWebs = [
  { y: DECKS[0].webs[0], s: -1 },
  { y: DECKS[1].webs[1], s: 1 },
];
const consoles = [];
for (const xc of bracketXs) {
  const x0 = xc - BRACKET.thick / 2;
  const x1 = xc + BRACKET.thick / 2;
  for (const { y: yw, s } of outerWebs) {
    const top = (x) => road(x) - SLAB + 0.1;
    // Driehoek: 0,1 m in het lijf, 2,0 m langs het lijf omlaag, 1,6 m onder
    // de dekplaat naar buiten.
    consoles.push(
      loft([x0, x1], (x) =>
        ccw([
          [yw - s * 0.1, top(x)],
          [yw - s * 0.1, top(x) - 0.1 - BRACKET.drop],
          [yw + s * BRACKET.reach, top(x)],
        ]),
      ),
    );
    // Verstijving onder de konsole tot de onderkant van de ligger.
    const a = Math.min(yw - s * 0.1, yw + s * RIB.proud);
    const b = Math.max(yw - s * 0.1, yw + s * RIB.proud);
    consoles.push(
      loft([xc - RIB.width / 2, xc + RIB.width / 2], (x) => [
        [a, soffit(x)],
        [b, soffit(x)],
        [b, top(x) - 1.0],
        [a, top(x) - 1.0],
      ]),
    );
  }
}
// Drukverstijvingen boven de pijlers (alleen de buitenlijven).
const pierRibs = [...APPROACH_PIERS, ...JOINT_PIERS, ...MAIN_PIERS].flatMap((xc) =>
  outerWebs.map(({ y: yw, s }) => {
    const a = Math.min(yw - s * 0.1, yw + s * RIB.proud);
    const b = Math.max(yw - s * 0.1, yw + s * RIB.proud);
    return loft([xc - RIB.pier / 2, xc, xc + RIB.pier / 2], (x) => [
      [a, soffit(x)],
      [b, soffit(x)],
      [b, road(x) - SLAB + 0.05],
      [a, road(x) - SLAB + 0.05],
    ]);
  }),
);

// ---------- pijlers ----------
const COL_Y = [-10.2, 0.15, 10.5]; // drie kolommen per pijler (foto's)
// Aanbrug: kolommen van 2,6 × 2,6 m onder een juk van 2,4 m dik en 2,0 m
// hoog met schuine koppen (57 graden: bovenkant 13,0 m, onderkant 11,7 m uit
// het midden), dat onder beide liggers en de open voeg doorloopt (de DTM
// ziet het juk in de voeg).
const CAP = { along: 2.4, height: 2.0, topHalf: 13.0, bottomHalf: 11.7 };
const SQUARE = 2.6;
const approachPiers = APPROACH_PIERS.flatMap((xc) => {
  const zt = soffit(xc) + 0.3;
  const zb = soffit(xc) - CAP.height;
  const c = COL_Y[1];
  const cap = loft([xc - CAP.along / 2, xc + CAP.along / 2], () => [
    [c - CAP.bottomHalf, zb],
    [c + CAP.bottomHalf, zb],
    [c + CAP.topHalf, soffit(xc)],
    [c + CAP.topHalf, zt],
    [c - CAP.topHalf, zt],
    [c - CAP.topHalf, soffit(xc)],
  ]);
  return [cap, ...COL_Y.map((y) => box(xc - SQUARE / 2, xc + SQUARE / 2, y - SQUARE / 2, y + SQUARE / 2, BASE, zb + 0.1))];
});
// Voeg- en rivierpijlers: drie taps toelopende kolommen (3,0 m dik, onder
// 5,4 m en boven 3,6 m breed) direct onder de liggers, met een stalen
// dwarsdrager tussen de liggers boven de middelste kolom (bij de voegpijlers
// 5,5 m lang: beide dekeinden; de DTM ziet hem in de voeg).
const TAPER = { along: 3.0, bottom: 5.4, top: 3.6 };
function taperedColumn(xc, y, z0, z1) {
  const h = z1 - z0;
  const rect = [
    [-TAPER.along / 2, -TAPER.bottom / 2],
    [TAPER.along / 2, -TAPER.bottom / 2],
    [TAPER.along / 2, TAPER.bottom / 2],
    [-TAPER.along / 2, TAPER.bottom / 2],
  ];
  return Manifold.extrude([rect], h, 0, 0, [1, TAPER.top / TAPER.bottom]).translate([xc, y, z0]);
}
const diaphragm = (xc, len) =>
  loft([xc - len / 2, xc + len / 2], (x) => [
    [DECKS[0].webs[1] - 0.1, Math.min(soffit(xc - len / 2), soffit(xc), soffit(xc + len / 2))],
    [DECKS[1].webs[0] + 0.1, Math.min(soffit(xc - len / 2), soffit(xc), soffit(xc + len / 2))],
    [DECKS[1].webs[0] + 0.1, road(x) - SLAB + 0.05],
    [DECKS[0].webs[1] - 0.1, road(x) - SLAB + 0.05],
  ]);
// Poeren van de rivierpijlers: de BGT-pijler (3,7 × 34,4 m) tot NAP +5,0 m.
const FOOT = { along: 3.7, y: [-17.11, 17.28], topNap: 5.0 };
const mainPiers = MAIN_PIERS.flatMap((xc) => {
  const zTop = Math.min(soffit(xc - TAPER.along / 2), soffit(xc + TAPER.along / 2)) + 0.3;
  return [
    box(xc - FOOT.along / 2, xc + FOOT.along / 2, FOOT.y[0], FOOT.y[1], BASE, Z(FOOT.topNap)),
    ...COL_Y.map((y) => taperedColumn(xc, y, Z(FOOT.topNap) - 0.05, zTop)),
    diaphragm(xc, 3.0),
  ];
});
const jointPiers = JOINT_PIERS.flatMap((xc) => [
  ...COL_Y.map((y) => taperedColumn(xc, y, BASE, soffit(xc) + 0.3)),
  diaphragm(xc, 5.5),
]);

// ---------- landhoofden ----------
// Massief onder het dekeinde tot onder de dekplaat, met de voorwand over de
// volle breedte van de BGT-muur (y = -19,6 tot 18,2 zuid, -19,3 tot 18,7
// noord, 1,0 m dik) als aanzet van de vleugels.
const abutment = ({ back, face }, wall, sign) => {
  const [x0, x1] = [Math.min(back, face), Math.max(back, face)];
  const block = loft(stations(x0, x1), (x) => [[-EDGE, BASE], [EDGE, BASE], [EDGE, road(x) - SLAB + 0.05], [-EDGE, road(x) - SLAB + 0.05]]);
  const wx0 = sign < 0 ? face - 1.0 : face;
  const wx1 = sign < 0 ? face : face + 1.0;
  const front = loft([wx0, wx1], (x) => [[wall[0], BASE], [wall[1], BASE], [wall[1], road(x) - SLAB - 0.4], [wall[0], road(x) - SLAB - 0.4]]);
  return union([block, front]);
};
const abutments = [abutment(ABUT_S, [-19.6, 18.2], -1), abutment(ABUT_N, [-19.3, 18.7], 1)];

const bridge = union([
  ...deckParts,
  cover,
  ...kerbs,
  ...consoles,
  ...pierRibs,
  ...approachPiers,
  ...mainPiers,
  ...jointPiers,
  ...abutments,
]).subtract(union(jointSlots()));

// ---------- printvoet (alleen in de STL) ----------
// Het dek hangt tussen de pijlers vrij en kraagt uit. Net als de
// overhangopvulling van de export krijgt de STL daaronder een wig van
// minstens 50 graden vanaf de dekrand, onder de liggerhoek door, die uitloopt
// in een scherm van minstens 0,8 mm op printschaal onder het midden.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const CENTRE = (GAP[0] + GAP[1]) / 2;
const footXs = stations(ABUT_S.face, ABUT_N.face);
const printFoot = loft(footXs, (x) => {
  const zt = road(x);
  const zb = zt - SLAB + 0.02;
  const zg = soffit(x) - 0.05;
  const yL = -EDGE - 0.02;
  const yR = EDGE + 0.02;
  const kL = Math.max(KNEE, (zb - zg) / (DECKS[0].webs[0] - RIB.proud - 0.05 - yL));
  const kR = Math.max(KNEE, (zb - zg) / (yR - DECKS[1].webs[1] - RIB.proud - 0.05));
  const zsL = zb - kL * (CENTRE - SCREEN - yL);
  const zsR = zb - kR * (yR - CENTRE - SCREEN);
  const left = zsL > BASE + 0.05 ? [[CENTRE - SCREEN, BASE], [CENTRE - SCREEN, zsL]] : (() => {
    const a = yL + (zb - BASE) / kL;
    return [[a, BASE], [a - 1e-3, BASE + 1e-3]];
  })();
  const right = zsR > BASE + 0.05 ? [[CENTRE + SCREEN, BASE], [CENTRE + SCREEN, zsR]] : (() => {
    const a = yR - (zb - BASE) / kR;
    return [[a, BASE], [a + 1e-3, BASE + 1e-3]];
  })();
  return [left[0], right[0], right[1], [yR, zb], [yR, zt - 0.3], [yL, zt - 0.3], [yL, zb], left[1]];
});
const printModel = union([bridge, printFoot]);

// ---------- rijbanen als eigen onderdeel ----------
// De bovenste 0,5 m van het dek tussen de schampkanten en de
// middengeleiders is een eigen node met de attributen van de actuele
// BGT-wegdelen erop (relatieve hoogteligging 1, glTF `extras.attributes`):
// L0002.0dca8817e62249809a1d55c0b43482cb (west, richting Utrecht) en
// L0002.15a961ae64fb406baeb484e8c4f9f361 (oost, richting Gorinchem), beide
// rijbaan autosnelweg, gesloten verharding, zonder plus_fysiek_voorkomen.
// De BGT legt op het dek geen ondersteunend wegdeel; de schampkanten, de
// middengeleiders, de afdekking van de middenberm en de dekvoegen blijven
// constructie.
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan autosnelweg", bgt_fysiekvoorkomen: "gesloten verharding" };
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const layerStrip = union(
  LANES.map(([y0, y1]) =>
    loft(stations(DECK_S, DECK_N), (x) => [[y0, road(x) - LAYER], [y1, road(x) - LAYER], [y1, road(x) + ABOVE], [y0, road(x) + ABOVE]]),
  ),
);
const notLayer = union([...KERB_LIST.map((k) => kerb(k, GUARD, DECK_S - 1, DECK_N + 1)), ...jointSlots(GUARD)]);
const roadCut = layerStrip.subtract(notLayer);
const roadway = roadCut.intersect(bridge);
const structure = bridge.subtract(roadCut);
const parts = [
  ["building:hagesteinsebrug", structure],
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
    found.push({ p, area: len / 2 });
  }
  return { area, found };
}
for (const [name, solid] of [["model", bridge], ["print", printModel], ...parts]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
}
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-4) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
{
  // Boven het wegdek hangt niets vrij; in het model alleen de onderkant van
  // dek, liggers, juk en dwarsdragers en de bovenkant van de dekvoegen.
  let above = 0;
  for (const { p, area: a } of overhangs(bridge).found) {
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    if (zm > road(xm) + 0.05) above += a;
  }
  console.log("vrij hangend in het model (m2):", Math.round(overhangs(bridge).area), "waarvan boven het wegdek:", +above.toFixed(2));
  if (above > 0.5) throw new Error("overhang boven het wegdek");
  const print = overhangs(printModel);
  const rest = print.found;
  const restArea = rest.reduce((sum, { area: a }) => sum + a, 0);
  console.log("overhang in de printversie (m2):", +restArea.toFixed(2));
  if (restArea > 2) {
    for (const { p, area: a } of rest.slice(0, 12)) console.log(p.map((q) => q.map((c) => +c.toFixed(2))), +a.toFixed(2));
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
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5.
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
    triangles: solid.numTri(),
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const nap = (z) => +(z + WATER_NAP).toFixed(2);
report.profile = {
  roadNapSouth: nap(road(DECK_S)),
  roadNapCrest: nap(Math.max(...GRID_Z)),
  roadNapMainSpan: nap(road(0)),
  roadNapNorth: nap(road(DECK_N)),
  soffitNapMainPier: [nap(soffit(MAIN_PIERS[0])), nap(soffit(MAIN_PIERS[1]))],
  soffitNapMid: nap(soffit(0)),
};
report.spans = SUPPORTS.slice(1).map((x, i) => +(x - SUPPORTS[i]).toFixed(1));
report.consoles = bracketXs.length * 2;
const glbFile = path.join(outDir, "hagesteinsebrug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-hagesteinsebrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofden en printvoet op het
// printbed: het hele brugmodel in één stuk.
const stlName = `hagesteinsebrug-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Hagesteinsebrug 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  printFootM3: Math.round(printFoot.volume()),
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
// Maaiveldpunten op de Lek, 25 m naast de as aan beide kanten, verspreid over
// de rivier tussen de rivierpijlers.
const samplePoints = [-60, -30, 0, 30].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "hagesteinsebrug.json"),
  JSON.stringify(
    {
      name: "Hagesteinsebrug",
      file: "hagesteinsebrug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [136272.2, 445943.97],
      xAxis: [0.22985, 0.97323],
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesTerrain: [
        "L0002.467068b379c34ad18d312cab62092ab1",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van het dek midden in de hoofdoverspanning boven de Lek op de waterspiegel (NAP +0,22 m, PDOK 43,69 m ellipsoïdisch) in de oorsprong, +X langs de brug naar het noordnoordoosten (Nieuwegein, RD-richting 76,71 graden vanaf het oosten) en +Y naar het westnoordwesten (stroomafwaarts). Twee nodes: road:rijbaan, de bovenste 0,5 m van beide rijbanen van de A27 met de attributen van de BGT-wegdelen erop in extras.attributes (bgt_functie rijbaan autosnelweg, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk van het zuidelijke landhoofd bij Hagestein (x = -496,4) tot het noordelijke bij Nieuwegein (x = 249,8). Per rijrichting een stalen ligger (3,4 m constructiehoogte, 6,8 m boven de rivierpijlers met rechte voutes) met betonnen dekplaat, op de aanbruggen gescheiden door een open voeg van 2 m, op het middendeel met een dichte middenberm; konsoles onder de uitkraging om de circa 5 m met verstijvingen tot de onderkant van de ligger; het middendeel over drie overspanningen (95,3, 162,0 en 94,5 m) op twee rivierpijlers met elk drie taps toelopende kolommen op een poer (BGT, tot NAP +5,0 m) en twee voegpijlers; de zuidelijke aanbrug van zes velden van circa 52,6 m op pijlers met een juk op drie kolommen; aan de noordkant één veld van 64,8 m; landhoofden met voorwand; dekvoegen als sleuven. Het wegdek ligt op NAP +14,5 m (Hagestein) tot +19,5 m (boven de Lek) en +17,8 m (Nieuwegein). Schampkanten en middengeleiders in plaats van leiderails en leuningen; lantaarnpalen weggelaten. De export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op de Lek bemonsterd; groundHeight is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(DECK_N - DECK_S).toFixed(1),
        widthM: +(2 * EDGE).toFixed(2),
        spansM: report.spans,
        mainSpanM: +(MAIN_PIERS[1] - MAIN_PIERS[0]).toFixed(1),
        girderDepthM: { base: DEPTH.base, mainPiers: DEPTH.pier },
        roadNapM: { south: report.profile.roadNapSouth, crest: report.profile.roadNapCrest, north: report.profile.roadNapNorth },
        medianGapM: +(GAP[1] - GAP[0]).toFixed(2),
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Hagesteinsebrug",
        "PDOK BGT overbruggingsdeel (dek, landhoofden, rivierpijler), scheiding (voorwanden landhoofden) en wegdeel (rijbanen op het dek), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor het wegdek, de middenvoeg met de pijlerjukken en de pijlers naast het dek",
        "PDOK luchtfoto (Actueel_orthoHR) voor de dekvoegen, de middenvoeg en het dwarsprofiel",
        "Wikimedia Commons: Hagesteinsebrug A27.jpg, Hagesteinsebrug gezien vanaf de Lekdijk oost in Nieuwegein- Vreeswijk.jpg, Hagesteinsebrug - Rijksweg A27 - Flickr - Frans Berkelaar.jpg, We zien de Hagesteinsebrug in de A27. Over de Lek.jpg, Lekbrug in de A27 bij Hagestein.jpg, Steelgirder with concrete deck over the Lek river at Hagestein in the A27 motorway - panoramio.jpg, Morgen opent gedeelte snelweg A27 tussen Vianen en nieuwe verkeersplein Lunetten de nieuwe brug over de Lek, Bestanddeelnr 931-5578.jpg en 931-5579.jpg (Nationaal Archief)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

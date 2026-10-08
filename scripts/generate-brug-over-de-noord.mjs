// Genereert een vereenvoudigd, gesloten 3D-model van de Brug over de Noord bij
// Alblasserdam (Alblasserdamsebrug, rijksmonument 516075): de stalen
// verkeersbrug uit 1939 over de Noord tussen Hendrik-Ido-Ambacht (west) en
// Alblasserdam (oost), nu de N915. De overbrugging bestaat uit een boogbrug met
// trekband (twee vakwerkbogen van 33 m hoog waarvan boven- en onderrand bij de
// opleggingen samenkomen, met hangers), aan de westkant een aanbrug en aan de
// oostkant een rolbasculebrug, beide met evenwijdige V-liggers met verticalen
// onder het wegdek; twee gemetselde rivierpijlers, het westelijke landhoofd en
// de betonnen basculekelder met de brugwachterspost op een kolom. Alle maten in
// het script zijn meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog,
// per onderdeel een node met de materiaalklasse in de nodenaam: de constructie
// en de rijbaan en de fietspaden met BGT-attributen) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal> met een
// printvoet onder het dek. De brug is 319 m lang en past op 1:1000 in 400 mm.
//
//   node scripts/generate-brug-over-de-noord.mjs              # 1:1000 (standaard)
//   node scripts/generate-brug-over-de-noord.mjs --scale 2000
//
// Assenstelsel: oorsprong op de as van de brug midden tussen de twee
// rivierpijlers (RD 104498,00, 430004,50), op de waterspiegel van de Noord zoals
// het PDOK-terrein die legt (ellipsoïdisch 43,49 m, met het verschil
// NAP-ellipsoïde van circa 43,45 m dus NAP +0,05 m), Z omhoog. +X loopt langs de
// brug naar het oosten (Alblasserdam, RD-richting 22,30 graden vanaf het
// oosten), +Y naar het noordnoordwesten, stroomafwaarts.
//
// Bronnen: BGT overbruggingsdeel (dek 18,0 tot 20,5 m breed, westelijk landhoofd
// x = -157,7 tot -143,9, rivierpijlers van 6,4 × 25 m met ronde koppen op
// x = ±93,3, basculekelder x = 140,0 tot 160,9 van 20,6 m breed met een bordes
// aan de zuidkant); BGT/BAG-pand 0482100001254422 voor de brugwachterspost;
// AHN DSM 0,5 m (PDOK WCS) voor het lengteprofiel van het wegdek (NAP +13,8 tot
// +15,1 m), de bovenrand van de bogen (top NAP +49,0 m, bijna parabolisch), de
// ligging van de bogen (7 m naast de as) en het dak van de brugwachterspost
// (NAP +21,2 m); Rijksmonumentenregister (516075) voor de opbouw, de
// overspanning (178 m tussen de pijlers), de boog van 33 m hoog, het rijdek van
// 12 m met zijpaden van 2,5 m, de doorvaartwijdte van de basculebrug (42 m) en
// de opening van de aanbrug (45 m); Wikimedia Commons-foto's voor de
// vakwerkhoogte, het aantal velden en hangers, de V-liggers, de pijlervorm, de
// basculekelder en de brugwachterspost.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "brug-over-de-noord");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude([ccw(points)], y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Polygoon in het YZ-vlak (dwarsdoorsnede), uitgetrokken langs X van x0 tot x1.
const profileX = (points, x0, x1) =>
  Manifold.extrude([ccw(points)], x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, 0]);
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
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};
// Driehoek naar binnen verschoven over d (schalen rond het middelpunt van de
// ingeschreven cirkel); null als er dan minder dan `min` straal overblijft.
function insetTriangle(tri, d, min) {
  const [a, b, c] = tri;
  const len = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const la = len(b, c);
  const lb = len(c, a);
  const lc = len(a, b);
  const per = la + lb + lc;
  const inc = [(la * a[0] + lb * b[0] + lc * c[0]) / per, (la * a[1] + lb * b[1] + lc * c[1]) / per];
  const area = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1])) / 2;
  const r = (2 * area) / per;
  if (r - d < min) return null;
  const k = (r - d) / r;
  return tri.map(([x, z]) => [inc[0] + (x - inc[0]) * k, inc[1] + (z - inc[1]) * k]);
}
// Pijler met ronde koppen (BGT): rechthoek in x, koppen aan beide kanten in y.
function pier(x0, x1, y0, y1, z0, z1) {
  const r = (x1 - x0) / 2;
  const xc = (x0 + x1) / 2;
  const h = z1 - z0;
  return Manifold.hull([
    Manifold.cylinder(h, r, r, 32, false).translate([xc, y0 + r, z0]),
    Manifold.cylinder(h, r, r, 32, false).translate([xc, y1 - r, z0]),
  ]);
}

// ---------- hoofdmaten ----------
// Het PDOK-terrein legt de Noord op ellipsoïdisch 43,49 m; met het verschil
// NAP-ellipsoïde van 43,45 m (dijk en uiterwaard, AHN tegen PDOK) is dat
// NAP +0,05 m. Dat is z = 0 in het model.
const WATER_NAP = 0.05;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const BASE = -0.8; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;

// Langs de as (BGT): westelijk landhoofd, rivierpijlers, basculekelder.
const WEST_END = -157.7; // achterkant westelijk landhoofd (dijk Hendrik-Ido-Ambacht)
const WEST_FACE = -143.9; // voorzijde westelijk landhoofd
const PIERS = [
  { x0: -96.4, x1: -90.0, y0: -12.75, y1: 12.75 },
  { x0: 90.1, x1: 96.6, y0: -12.4, y1: 12.2 },
];
const BEARING = 93.3; // hart van de pijlers: opleggingen van de boog
const CELLAR = { x0: 140.0, x1: 160.9, half: 10.3 }; // basculekelder (BGT)
const EAST_END = CELLAR.x1;
// Bordes aan de zuidkant van de kelder (BGT), op dekhoogte.
const CELLAR_SOUTH = { x0: 140.0, x1: 146.0, y0: -13.5 };

// Wegdek in NAP-meters om de 4 m vanaf x = -160: 30e percentiel van het
// AHN-DSM over 11 m rond de as, licht gladgestreken; in het midden een auto
// weggefilterd.
const DECK_NAP = [
  13.76, 13.79, 13.84, 13.89, 13.94, 13.99, 14.04, 14.08, 14.12, 14.16, 14.21, 14.26, 14.29, 14.33,
  14.37, 14.42, 14.47, 14.52, 14.57, 14.62, 14.66, 14.69, 14.72, 14.75, 14.79, 14.82, 14.85, 14.88,
  14.9, 14.93, 14.96, 14.98, 15.01, 15.02, 15.03, 15.04, 15.06, 15.07, 15.08, 15.09, 15.1, 15.09,
  15.08, 15.07, 15.06, 15.05, 15.03, 15.02, 15.02, 15.0, 14.98, 14.95, 14.92, 14.89, 14.86, 14.83,
  14.8, 14.76, 14.73, 14.7, 14.67, 14.63, 14.58, 14.53, 14.48, 14.43, 14.39, 14.34, 14.3, 14.26,
  14.22, 14.17, 14.13, 14.1, 14.06, 14.01, 13.96, 13.91, 13.86, 13.82, 13.79, 13.76,
];
const deckNap = (x) => {
  const f = Math.min(Math.max((x + 160) / 4, 0), DECK_NAP.length - 1);
  const i = Math.min(Math.floor(f), DECK_NAP.length - 2);
  const t = f - i;
  return DECK_NAP[i] * (1 - t) + DECK_NAP[i + 1] * t;
};
const top = (x) => Z(deckNap(x)); // wegdek in modelhoogte op lokale x

// Dek. Boogbrug (BGT 20,5 m): rijdek van 12 m met schampkanten tussen de
// hoofdliggers en zijpaden van 2,5 m daarbuiten; doorsnede met een
// constructiehoogte van 2,4 m tussen de hoofdliggers (foto's) en een rand van
// 0,8 m onder de zijpaden. Aanbrug (BGT 18,5 m) en basculebrug (BGT 18,0 m):
// een dicht kokerdek tot de onderrand van de V-liggers, 6,5 m onder het wegdek
// (foto's), met het vakwerk als blinde nissen. Langs de randen een schampkant
// van 0,9 m breed en 0,5 m hoog in plaats van de leuningen.
const DECK = { archHalf: 10.3, approachHalf: 9.25, leafHalf: 9.1, edge: 0.8, depth: 2.4, girder: 7.6 };
const TRUSS_DEPTH = 6.5;
const KERB = { width: 0.9, height: 0.5 };
const halfAt = (x) => (x < -BEARING ? DECK.approachHalf : x > BEARING ? DECK.leafHalf : DECK.archHalf);
// V-liggers (foto's): velden van 5,9 m (aanbrug, 8 velden) en 6,2 m
// (basculebrug, 7 velden), bovenrand 1,4 m en onderrand 6,0 m onder het
// wegdek (hartlijnen), staven 0,9 m breed; nissen 0,35 m diep.
const SPANS = [
  { name: "aanbrug", x0: WEST_FACE, x1: PIERS[0].x0, panels: 8, half: DECK.approachHalf },
  { name: "basculebrug", x0: PIERS[1].x1, x1: CELLAR.x0, panels: 7, half: DECK.leafHalf },
];
const VTRUSS = { topChord: 1.4, bottomChord: 6.0, member: 0.9, niche: 0.35 };

// Pijlers (foto's): gemetselde voet tot NAP +3,0 m op de BGT-omtrek, daarboven
// een schacht die 0,5 m terugspringt, met een betonnen dekplaat van 0,6 m die
// weer uitkraagt tot de omtrek van de voet (onder 50 graden).
const PIER_PLINTH_NAP = 3.0;
const PIER_STEP = 0.5;
const PIER_CAP = 0.6;

// Boog: twee vakwerkbogen 7,0 m naast de as (AHN). De bovenrand volgt het
// AHN-DSM (top NAP +49,0 m, 34 m boven het wegdek): z = 49,0 - 0,00461 x² +
// 1,07e-7 x⁴ (NAP), en komt bij de opleggingen op het hart van de pijlers
// (x = ±93,3) uit op NAP +17,0 m. Het vakwerk is in de top 7,0 m hoog
// (foto's) en loopt naar de opleggingen dicht: 7,0 √(1 - t³) met t = |x| / 93,3.
// 21 velden van 8,886 m (foto's: 20 hangers, geen hanger in het midden), met
// per veld een verticaal en een diagonaal die naar het midden toe daalt; in het
// middelste veld een V. Op 1:1000 is elke boog een band van 1,3 m dik met de
// vakwerkdriehoeken als blinde nissen van 0,3 m aan beide kanten, en de ruimte
// tussen dek en onderrand een scherm met de hangers als stijlen van 1,0 m en
// spitse openingen (zijden van 55 graden).
const ARCH = { crown: 49.0, a: 0.00461, b: 1.07e-7, depth: 7.0, ribY: 7.0, rib: 1.3, niche: 0.3, member: 0.9 };
const PANELS = 21;
const PANEL = (2 * BEARING) / PANELS;
const HANGER = 1.0;
const POINTED = (55 * Math.PI) / 180;
const LOW_POINTED = (50 * Math.PI) / 180;
const upper = (x) => {
  const ax = Math.min(Math.abs(x), BEARING);
  return Z(ARCH.crown - ARCH.a * ax ** 2 + ARCH.b * ax ** 4);
};
const lower = (x) => {
  const t = Math.min(Math.abs(x) / BEARING, 1);
  return upper(x) - ARCH.depth * Math.sqrt(1 - t ** 3);
};

// Basculekelder (BGT, foto's): betonnen blok tot het wegdek met een borstwering
// van 1,0 m hoog en 0,9 m breed langs de randen, aan beide lange zijden een rij
// van zes smalle vensters onder het dek en twee hoge vensters lager (blinde
// nissen van 0,35 m). Aan de noordkant een bordes op dekhoogte.
const PARAPET = { width: 0.9, height: 1.0 };
const LANDING = { x0: 142.3, x1: 152.0, y1: 13.3, depth: 1.0 };
// Brugwachterspost (BAG-pand 0482100001254422, foto's): een kantoortje van
// 6,0 × 4,5 m met het dak op NAP +21,2 m (AHN) en 3,2 m hoog, op een ronde
// kolom van 1,1 m; onder het kantoortje een kraag van 50 graden naar de kolom.
const CABIN = { x0: 139.9, x1: 145.9, y0: 9.9, y1: 14.4, roofNap: 21.2, height: 3.2, column: 0.55 };
const cabinCx = (CABIN.x0 + CABIN.x1) / 2;
const cabinCy = (CABIN.y0 + CABIN.y1) / 2;

// ---------- dek ----------
// Boogbrugdek van pijlerhart tot pijlerhart.
const archDeck = loftX(
  stationsX(-BEARING, BEARING, 2).map((x) => {
    const zt = top(x);
    const h = DECK.archHalf;
    return {
      x,
      section: [
        [-DECK.girder, zt - DECK.depth],
        [DECK.girder, zt - DECK.depth],
        [h, zt - DECK.edge],
        [h, zt],
        [-h, zt],
        [-h, zt - DECK.edge],
      ],
    };
  }),
);
// Kokerdekken van aanbrug en basculebrug, tot de onderrand van de V-liggers.
const boxDecks = SPANS.map(({ x0, x1, half }) =>
  loftX(
    stationsX(x0 - 0.01, x1 + 0.01, 2).map((x) => ({
      x,
      section: [[-half, top(x) - TRUSS_DEPTH], [half, top(x) - TRUSS_DEPTH], [half, top(x)], [-half, top(x)]],
    })),
  ),
);
// Overgang van de kokerdekken naar het boogbrugdek op de pijlers: het smallere
// dek loopt tot het pijlerhart door.
const pierDecks = [
  [PIERS[0].x0 - 0.01, -BEARING, DECK.approachHalf],
  [BEARING, PIERS[1].x1 + 0.01, DECK.leafHalf],
].map(([x0, x1, half]) =>
  loftX(
    stationsX(x0, x1, 1).map((x) => ({
      x,
      section: [[-half, top(x) - DECK.depth], [half, top(x) - DECK.depth], [half, top(x)], [-half, top(x)]],
    })),
  ),
);
// Schampkanten langs het hele dek; op de kelder de borstwering.
const kerbs = [-1, 1].flatMap((side) =>
  [
    [WEST_END, -BEARING],
    [-BEARING, BEARING],
    [BEARING, CELLAR.x0 + 0.5],
  ].map(([x0, x1]) =>
    loftX(
      stationsX(x0, x1, 2).map((x) => {
        const h = halfAt((x0 + x1) / 2);
        const a = side * (h - KERB.width);
        const b = side * h;
        return { x, section: [[Math.min(a, b), top(x) - 0.1], [Math.max(a, b), top(x) - 0.1], [Math.max(a, b), top(x) + KERB.height], [Math.min(a, b), top(x) + KERB.height]] };
      }),
    ),
  ),
);
// Voegen van de basculeklep: sleuven van 0,5 m breed en 0,3 m diep over het
// wegdek bij de punt (pijler) en de hiel (kelder).
const joints = [PIERS[1].x1 + 0.3, CELLAR.x0 - 0.3].map((x) =>
  boxFromTo(x - 0.25, x + 0.25, -DECK.leafHalf + KERB.width + 0.05, DECK.leafHalf - KERB.width - 0.05, top(x) - 0.3, top(x) + 1),
);

// V-liggers als blinde nissen in de zijwanden van de kokerdekken.
const vNiches = SPANS.flatMap(({ x0, x1, panels, half }) => {
  const p = (x1 - x0) / panels;
  const nodes = Array.from({ length: panels + 1 }, (_, i) => x0 + i * p);
  const T = (x) => [x, top(x) - VTRUSS.topChord];
  const B = (x) => [x, top(x) - VTRUSS.bottomChord];
  const tris = [];
  for (let i = 0; i < panels; i++) {
    const a = nodes[i];
    const b = nodes[i + 1];
    if (i % 2 === 0) {
      // diagonaal van boven links naar onder rechts
      tris.push([T(a), B(a), B(b)], [T(a), B(b), T(b)]);
    } else {
      tris.push([B(a), B(b), T(b)], [T(a), B(a), T(b)]);
    }
  }
  const holes = tris.map((t) => insetTriangle(t, VTRUSS.member / 2, 0.3)).filter(Boolean);
  return [-1, 1].flatMap((side) =>
    holes.map((t) =>
      side > 0
        ? profileY(t, half - VTRUSS.niche, half + 0.5)
        : profileY(t, -half - 0.5, -half + VTRUSS.niche),
    ),
  );
});

// ---------- landhoofd, pijlers, kelder ----------
const westAbutment = loftX(
  stationsX(WEST_END, WEST_FACE + 0.01, 2).map((x) => ({
    x,
    section: [[-9.3, BASE], [9.8, BASE], [9.8, top(x) - 0.01], [-9.3, top(x) - 0.01]],
  })),
);
const piers = PIERS.map(({ x0, x1, y0, y1 }) => {
  const xc = (x0 + x1) / 2;
  const capTop = top(xc) - DECK.depth + 0.05;
  const plinthTop = Z(PIER_PLINTH_NAP);
  const flare = PIER_STEP * Math.tan((50 * Math.PI) / 180);
  const s = PIER_STEP;
  return union([
    pier(x0, x1, y0, y1, BASE, plinthTop),
    pier(x0 + s, x1 - s, y0 + s, y1 - s, plinthTop - 0.01, capTop - PIER_CAP - flare + 0.01),
    Manifold.hull([
      pier(x0 + s, x1 - s, y0 + s, y1 - s, capTop - PIER_CAP - flare, capTop - PIER_CAP - flare + 0.01),
      pier(x0, x1, y0, y1, capTop - PIER_CAP, capTop),
    ]),
  ]);
});
const cellarCore = loftX(
  stationsX(CELLAR.x0 - 0.01, CELLAR.x1, 2).map((x) => ({
    x,
    section: [[-CELLAR.half, BASE], [CELLAR.half, BASE], [CELLAR.half, top(x)], [-CELLAR.half, top(x)]],
  })),
);
const cellarSouth = loftX(
  stationsX(CELLAR_SOUTH.x0, CELLAR_SOUTH.x1, 2).map((x) => ({
    x,
    section: [[CELLAR_SOUTH.y0, BASE], [-CELLAR.half + 0.01, BASE], [-CELLAR.half + 0.01, top(x)], [CELLAR_SOUTH.y0, top(x)]],
  })),
);
const parapets = [-1, 1].map((side) =>
  loftX(
    stationsX(CELLAR.x0 + 0.5, CELLAR.x1, 2).map((x) => {
      const a = side * (CELLAR.half - PARAPET.width);
      const b = side * CELLAR.half;
      return { x, section: [[Math.min(a, b), top(x) - 0.1], [Math.max(a, b), top(x) - 0.1], [Math.max(a, b), top(x) + PARAPET.height], [Math.min(a, b), top(x) + PARAPET.height]] };
    }),
  ),
);
// Bordes aan de noordkant op dekhoogte, met een console van 50 graden naar de
// kelderwand.
const landingTop = top(LANDING.x0);
const landing = profileX(
  [
    [CELLAR.half - 0.01, landingTop - LANDING.depth - (LANDING.y1 - CELLAR.half) * Math.tan((50 * Math.PI) / 180)],
    [LANDING.y1, landingTop - LANDING.depth],
    [LANDING.y1, landingTop],
    [CELLAR.half - 0.01, landingTop],
  ],
  LANDING.x0,
  LANDING.x1,
);
// Vensters van de kelder: zes smalle onder het dek, twee hoge lager.
const cellarWindows = [-1, 1].flatMap((side) => {
  const face = side * CELLAR.half;
  const y0 = side > 0 ? face - 0.35 : face - 0.5;
  const y1 = side > 0 ? face + 0.5 : face + 0.35;
  const zt = top(150);
  // Aan de zuidkant zit het bordes voor de westelijke vensters, aan de
  // noordkant de console van het bordes voor de smalle vensters.
  const free = (x) => side > 0 || x > CELLAR_SOUTH.x1 + 0.5;
  const freeSmall = (x) => (side > 0 ? x > LANDING.x1 + 0.5 : free(x));
  const small = [143.5, 146.5, 149.5, 152.5, 155.5, 158.5].filter(freeSmall).map((x) => boxFromTo(x - 0.45, x + 0.45, y0, y1, zt - 4.4, zt - 2.0));
  const tall = [147.0, 151.0].filter(free).map((x) => boxFromTo(x - 0.45, x + 0.45, y0, y1, zt - 11.5, zt - 6.0));
  return [...small, ...tall];
});

// ---------- brugwachterspost ----------
const cabinBottom = Z(CABIN.roofNap - CABIN.height);
const kraagDepth = (Math.max(CABIN.x1 - cabinCx, cabinCy - CABIN.y0) - CABIN.column) * Math.tan((50 * Math.PI) / 180);
const cabin = union([
  boxFromTo(CABIN.x0, CABIN.x1, CABIN.y0, CABIN.y1, cabinBottom, Z(CABIN.roofNap)),
  Manifold.hull([
    boxFromTo(CABIN.x0, CABIN.x1, CABIN.y0, CABIN.y1, cabinBottom, cabinBottom + 0.01),
    boxFromTo(cabinCx - CABIN.column, cabinCx + CABIN.column, cabinCy - CABIN.column, cabinCy + CABIN.column, cabinBottom - kraagDepth, cabinBottom - kraagDepth + 0.01),
  ]),
  Manifold.cylinder(cabinBottom - kraagDepth + 0.3 - BASE, CABIN.column, CABIN.column, 24, false).translate([cabinCx, cabinCy, BASE]),
]);

// ---------- boog ----------
const nodeX = Array.from({ length: PANELS + 1 }, (_, i) => -BEARING + i * PANEL);
const hangerX = nodeX.slice(1, -1);
// Band van elke boog: van 0,3 m onder het wegdek tot de bovenrand.
const ribXs = stationsX(-BEARING, BEARING, 0.5);
const ribBottom = (x) => top(x) - 0.3;
// Spitse openingen tussen de hangers (en tussen de laatste hanger en de
// oplegging), alleen waar onder de onderrand ruimte genoeg is. Waar de
// onderrand voor zijden van 55 graden te laag ligt, een driehoekige opening
// met zijden van 50 graden (het minimum voor printen zonder steun).
const openings = [];
{
  const posts = [-BEARING, ...hangerX, BEARING];
  for (let i = 0; i + 1 < posts.length; i++) {
    const a = posts[i] + HANGER / 2;
    const b = posts[i + 1] - HANGER / 2;
    const floor = Math.min(top(a), top(b), top((a + b) / 2)) - 0.05;
    for (const [angle, rise] of [[POINTED, 1.0], [LOW_POINTED, 0.2]]) {
      let shoulder = Infinity;
      for (let k = 0; k <= 200; k++) {
        const x = a + ((b - a) * k) / 200;
        shoulder = Math.min(shoulder, lower(x) - 0.05 - Math.tan(angle) * Math.min(x - a, b - x));
      }
      if (shoulder < Math.max(top(a), top(b)) + rise) continue;
      const apex = shoulder + (Math.tan(angle) * (b - a)) / 2;
      openings.push({ a, b, floor, shoulder, apex });
      break;
    }
  }
}
// Vakwerkdriehoeken tussen onder- en bovenrand.
const archTris = [];
{
  const U = (x) => [x, upper(x)];
  const L = (x) => [x, lower(x)];
  const mid = PANELS >> 1; // middelste veld
  for (let i = 0; i < PANELS; i++) {
    const a = nodeX[i];
    const b = nodeX[i + 1];
    if (i < mid) {
      archTris.push([L(a), L(b), U(a)], [L(b), U(b), U(a)]);
    } else if (i > mid) {
      archTris.push([L(a), L(b), U(b)], [L(a), U(b), U(a)]);
    } else {
      const m = (a + b) / 2;
      archTris.push([L(a), L(m), U(a)], [L(m), U(b), U(a)], [L(m), L(b), U(b)]);
    }
  }
}
const archNicheHoles = archTris.map((t) => insetTriangle(t, ARCH.member / 2, 0.35)).filter(Boolean);
const ribs = [-1, 1].map((side) => {
  const yc = side * ARCH.ribY;
  const y0 = yc - ARCH.rib / 2;
  const y1 = yc + ARCH.rib / 2;
  const band = profileY(
    [...ribXs.map((x) => [x, ribBottom(x)]), ...[...ribXs].reverse().map((x) => [x, upper(x)])],
    y0,
    y1,
  );
  const holes = openings.map(({ a, b, floor, shoulder, apex }) =>
    profileY([[a, floor], [b, floor], [b, shoulder], [(a + b) / 2, apex], [a, shoulder]], y0 - 0.5, y1 + 0.5),
  );
  const niches = archNicheHoles.flatMap((t) => [
    profileY(t, y1 - ARCH.niche, y1 + 0.5),
    profileY(t, y0 - 0.5, y0 + ARCH.niche),
  ]);
  return band.subtract(union([...holes, ...niches]));
});

const bridge = union([
  archDeck,
  ...boxDecks,
  ...pierDecks,
  ...kerbs,
  westAbutment,
  ...piers,
  cellarCore,
  cellarSouth,
  ...parapets,
  landing,
  cabin,
  ...ribs,
]).subtract(union([...joints, ...vNiches, ...cellarWindows]));

// ---------- printvoet (alleen in de STL) ----------
// Het dek van de boogbrug en de kokerdekken hangen tussen pijlers, landhoofd en
// kelder vrij. Net als de overhangopvulling van de export krijgt de STL
// daaronder een wig van 50 graden vanaf de dekrand die uitloopt in een scherm
// van 0,9 m tot de onderplaat (of, waar het dek daarvoor te laag ligt, een
// trapezium tot de onderplaat).
const SCREEN = 0.45;
const KNEE = (50 * Math.PI) / 180;
const footXs = [
  ...stationsX(WEST_FACE, CELLAR.x0, 1),
  ...SPANS.flatMap(({ x0, x1 }) => [x0 - 1e-3, x0, x1, x1 + 1e-3]),
  -BEARING,
  -BEARING + 1e-3,
  BEARING - 1e-3,
  BEARING,
]
  .filter((x) => x >= WEST_FACE && x <= CELLAR.x0)
  .sort((a, b) => a - b)
  .filter((x, i, xs) => i === 0 || x - xs[i - 1] > 1e-4);
const inBox = (x) => SPANS.some(({ x0, x1 }) => x >= x0 - 1e-6 && x <= x1 + 1e-6);
const footStations = footXs.map((x) => {
  const box = inBox(x);
  const w = halfAt(x) + 0.02;
  // Bovenkant 0,3 m in het dek; de wig begint onder de dekrand.
  const zb = box ? top(x) - TRUSS_DEPTH - 0.02 : top(x) - (Math.abs(x) <= BEARING ? DECK.edge : DECK.depth) - 0.02;
  const zIn = box ? top(x) - TRUSS_DEPTH + 0.3 : top(x) - 0.3;
  const zs = zb - Math.tan(KNEE) * (w - SCREEN);
  const section =
    zs > BASE + 0.05
      ? [[-SCREEN, BASE], [SCREEN, BASE], [SCREEN, zs], [w, zb], [w, zIn], [-w, zIn], [-w, zb], [-SCREEN, zs]]
      : (() => {
          const a = w - (zb - BASE) / Math.tan(KNEE);
          return [[-a, BASE], [a, BASE], [a + 1e-3, BASE + 1e-3], [w, zb], [w, zIn], [-w, zIn], [-w, zb], [-a - 1e-3, BASE + 1e-3]];
        })();
  return { x, section };
});
const printFoot = loftX(footStations);
const printModel = union([bridge, printFoot]);

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
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
const classify = ({ p }) => {
  const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
  const ym = (p[0][1] + p[1][1] + p[2][1]) / 3;
  const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
  const zt = top(xm);
  if (Math.abs(Math.abs(ym) - ARCH.ribY) <= ARCH.rib / 2 + 0.01 && zm > zt + 0.5) return "boognissen";
  if (zm < zt + 0.01 && zm > zt - TRUSS_DEPTH - 0.05 && Math.abs(ym) <= DECK.archHalf + 0.01 && xm < CELLAR.x0 + 0.01 && xm > WEST_FACE - 0.01) {
    return Math.abs(ym) > halfAt(xm) - VTRUSS.niche - 0.01 ? "nissen V-liggers" : "dek";
  }
  if (xm > CELLAR.x0 - 0.5 && Math.abs(ym) > CELLAR.half - 0.5) return "kelder (vensters, bordes)";
  if (zm > zt + 0.01) return `boven het dek x ${xm.toFixed(0)} y ${ym.toFixed(0)} z ${zm.toFixed(0)}`;
  return `onder het dek x ${xm.toFixed(0)} y ${ym.toFixed(0)} z ${zm.toFixed(0)}`;
};
{
  const { area, found } = overhangs(bridge);
  const buckets = {};
  for (const f of found) buckets[classify(f)] = (buckets[classify(f)] ?? 0) + f.area;
  console.log("vrij hangend (m2):", Math.round(area), Object.fromEntries(Object.entries(buckets).map(([k, a]) => [k, +a.toFixed(1)])));
  const print = overhangs(printModel);
  const pb = {};
  for (const f of print.found) pb[classify(f)] = (pb[classify(f)] ?? 0) + f.area;
  console.log("overhang in de printversie (m2):", +print.area.toFixed(2), Object.fromEntries(Object.entries(pb).map(([k, a]) => [k, +a.toFixed(2)])));
  // In de printversie mogen alleen de bovenkanten van blinde nissen (0,3 tot
  // 0,4 m diep) en splinters vlak hangen.
  const bad = Object.entries(pb).filter(([k, a]) => (k.startsWith("boven") || k.startsWith("onder") || k === "dek") && a > 0.5);
  if (bad.length) throw new Error(`printversie heeft overhang: ${bad.map(([k, a]) => `${k} (${a.toFixed(2)} m2)`).join(", ")}`);
}

// ---------- rijbaan en fietspaden als eigen onderdelen ----------
// Pas na de brug en de printversie als geheel (hierboven uitgerekend): zo
// blijven hun driehoeken (en die van de STL) dezelfde als voordat het wegdek
// eigen onderdelen kreeg. De bovenste 0,5 m van het dek tussen de schampkanten
// (op de kelder tussen de borstweringen) is per BGT-functie een eigen node met
// de attributen van het BGT-wegdeel eronder (glTF `extras.attributes`), zodat
// de kleurregels van een thema (bijvoorbeeld fietspaden rood) op het brugdek
// werken zoals op de PDOK-wegdelen ernaast. Op het dek liggen drie actuele
// BGT-wegdelen met relatieve hoogteligging 1, alle drie van x = -144,2 (het
// westelijke landhoofd) tot 160,9 (de oostkant van de kelder): de rijbaan
// L0002.e5e275a5ac5840229d45c31ae13c0102 (rijbaan regionale weg, gesloten
// verharding) tussen y = -6,1 en 6,3 en aan weerszijden een fietspad (gesloten
// verharding, geen plus-fysiek voorkomen). Het landhoofd zelf ligt op de dijk
// (BGT-wegdelen met hoogteligging 0) en blijft constructie, net als het bordes
// aan de zuidkant van de kelder buiten de borstwering.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan regionale weg", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
// De actuele BGT-fietspaden op het dek in lokale coördinaten, vereenvoudigd
// tot 5 cm.
const BIKE_PATHS = [
  // L0002.2ad2a960307a4673966b760fa408bad6: zuidkant (stroomopwaarts), met
  // het bordes aan de zuidkant van de kelder.
  [[-144.15, -5.7], [-144.15, -8.9], [-109.07, -8.82], [-93.83, -10.02], [-37.61, -9.89], [94, -9.99], [110.98, -9.06],
    [140.37, -9.05], [140.37, -13.21], [145.25, -13.28], [145.26, -12.28], [147.2, -12.35], [147.33, -11.6], [147.9, -11],
    [148.58, -10.64], [148.99, -10.6], [149, -10.19], [160.68, -10.08], [160.82, -9.55], [160.88, -9.55], [160.89, -6.1],
    [89.02, -5.99], [35.34, -5.77], [-20.03, -5.94]],
  // L0002.7d9eda94570945d1a9b75da4e452e8cf: noordkant (stroomafwaarts).
  [[-144.16, 9.45], [-144.16, 6.33], [-92.75, 6.25], [-49.57, 6.08], [91.53, 5.97], [154.68, 6.1], [160.86, 6.19],
    [160.85, 8.73], [160.76, 8.73], [160.8, 10.16], [140.12, 9.95], [140.13, 8.79], [109.85, 8.83], [94.19, 9.9],
    [70.24, 9.88], [7.51, 10.01], [-4.15, 9.95], [-57.69, 10.11], [-93.89, 10.35], [-110.65, 9.4]],
];
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, over dezelfde
// stations als de dekken: zo snijdt hij het hele bovenvlak uit de constructie
// en houdt die daar geen vlak zonder dikte over dat met de bovenkant van het
// wegdek vecht (z-fighting op de kaart). Het wegdek zelf is de strook binnen
// de brug. Aan de oostkant loopt hij 0,5 m voorbij de kelder, zodat zijn
// kopvlak niet op dat van de kelder valt.
function topLayer(x0, x1, half) {
  return loftX(
    stationsX(x0, x1, 2).map((x) => {
      const zt = top(x);
      return { x, section: [[-half, zt - LAYER], [half, zt - LAYER], [half, zt + ABOVE], [-half, zt + ABOVE]] };
    }),
  );
}
const strip = union([
  topLayer(WEST_FACE, -BEARING + 0.01, DECK.approachHalf - KERB.width),
  topLayer(-BEARING, BEARING + 0.01, DECK.archHalf - KERB.width),
  topLayer(BEARING, CELLAR.x0 + 0.5 + 0.01, DECK.leafHalf - KERB.width),
  topLayer(CELLAR.x0 + 0.5, CELLAR.x1 + 0.5, CELLAR.half - PARAPET.width),
]);
// Wat boven het dek uitsteekt blijft constructie, met 2 cm vrij: de
// schampkanten en de borstweringen (rondom 2 cm groter), de hele strook van
// elke boog (ook onder de openingen van het hangerscherm en tot onder de
// strook) en de voegen van de klep (tot de schampkanten en tot onder de
// strook). Tegen zo'n onderdeel aan afgetrokken hield het wegdek op de
// bovenkant ervan een vlak zonder dikte over.
const kerbGuards = [-1, 1].flatMap((side) =>
  [
    [WEST_END, -BEARING],
    [-BEARING, BEARING],
    [BEARING, CELLAR.x0 + 0.5],
  ].map(([x0, x1]) =>
    loftX(
      stationsX(x0, x1, 2).map((x) => {
        const h = halfAt((x0 + x1) / 2);
        const a = Math.min(side * (h - KERB.width), side * h) - GUARD;
        const b = Math.max(side * (h - KERB.width), side * h) + GUARD;
        const z0 = top(x) - 0.1 - GUARD;
        const z1 = top(x) + KERB.height + GUARD;
        return { x, section: [[a, z0], [b, z0], [b, z1], [a, z1]] };
      }),
    ),
  ),
);
const parapetGuards = [-1, 1].map((side) =>
  loftX(
    stationsX(CELLAR.x0 + 0.5, CELLAR.x1, 2).map((x) => {
      const a = Math.min(side * (CELLAR.half - PARAPET.width), side * CELLAR.half) - GUARD;
      const b = Math.max(side * (CELLAR.half - PARAPET.width), side * CELLAR.half) + GUARD;
      const z0 = top(x) - 0.1 - GUARD;
      const z1 = top(x) + PARAPET.height + GUARD;
      return { x, section: [[a, z0], [b, z0], [b, z1], [a, z1]] };
    }),
  ),
);
const ribGuards = [-1, 1].map((side) =>
  profileY(
    [...ribXs.map((x) => [x, top(x) - LAYER - GUARD]), ...[...ribXs].reverse().map((x) => [x, upper(x) + GUARD])],
    side * ARCH.ribY - ARCH.rib / 2 - GUARD,
    side * ARCH.ribY + ARCH.rib / 2 + GUARD,
  ),
);
const jointGuards = [PIERS[1].x1 + 0.3, CELLAR.x0 - 0.3].map((x) =>
  boxFromTo(
    x - 0.25 - GUARD,
    x + 0.25 + GUARD,
    -DECK.leafHalf + KERB.width,
    DECK.leafHalf - KERB.width,
    top(x) - LAYER - GUARD,
    top(x) + ABOVE + GUARD,
  ),
);
const cut = strip.subtract(union([...kerbGuards, ...parapetGuards, ...ribGuards, ...jointGuards]));
// Fietspad = strook ∩ BGT-fietspaden, rijbaan = de rest. Op de boogbrug
// begint het fietspad volgens de BGT 0,3 m binnen de boog (y = 6,0, de rand
// van de rijbaan); in het model staat de boog daar, dus binnen de bogen is het
// rijbaan en ligt het fietspad buiten de bogen, tot de schampkant. Aan de
// oostkant eindigen de BGT-vlakken met kleine inhammen 0 tot 14 cm voor de
// kopse kant van de kelder (daar beginnen de fietspaden van de aanbrug
// erachter); daar lopen de fietspaden vanaf de rand van de rijbaan
// (y = -6,1 en 6,19) door tot voorbij de kelder, zodat er geen strookjes
// rijbaan van een paar centimeter dwars over het fietspad overblijven.
const bikePaths = union([
  ...BIKE_PATHS.map((poly) => Manifold.extrude([ccw(poly)], 100 - BASE).translate([0, 0, BASE])),
  boxFromTo(160.5, CELLAR.x1 + 1, -CELLAR.half, -6.1, BASE, 100),
  boxFromTo(160.5, CELLAR.x1 + 1, 6.19, CELLAR.half, BASE, 100),
]).subtract(boxFromTo(-BEARING, BEARING, -ARCH.ribY, ARCH.ribY, BASE - 1, 101));
// Zonder de vlakken zonder inhoud die op de grens van boog en aanbrug
// (x = ±93,3, waar de strook van de boog en het vlak binnen de bogen allebei
// ophouden) achterblijven.
const solidOnly = (solid) => Manifold.compose(solid.decompose().filter((part) => part.volume() > 1e-6));
const roadCut = cut.subtract(bikePaths);
const bikeCut = cut.intersect(bikePaths);
const roadway = solidOnly(roadCut.intersect(bridge));
const bikeway = solidOnly(bikeCut.intersect(bridge));
const structure = bridge.subtract(cut);
{
  // De onderdelen samen zijn de brug: de volumes tellen op, zonder overlap.
  const whole = bridge.volume();
  const vols = { constructie: structure.volume(), rijbaan: roadway.volume(), fietspad: bikeway.volume() };
  const sum = vols.constructie + vols.rijbaan + vols.fietspad;
  console.log("partitie (m3):", {
    brug: +whole.toFixed(2),
    ...Object.fromEntries(Object.entries(vols).map(([k, v]) => [k, +v.toFixed(2)])),
    verschil: +(sum - whole).toFixed(4),
  });
  if (Math.abs(sum - whole) > 1e-4 * whole) throw new Error(`partitie: ${sum} tegen ${whole}`);
  for (const [a, b] of [[structure, roadway], [structure, bikeway], [roadway, bikeway]]) {
    if (a.intersect(b).volume() > 1e-3) throw new Error("onderdelen overlappen");
  }
}
const parts = [
  ["building:brug-over-de-noord", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];

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
    meshes.push({
      name,
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
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
report.arch = {
  crownNap: ARCH.crown,
  bearingNap: +(upper(BEARING) + WATER_NAP).toFixed(2),
  lowerCrownNap: +(lower(0) + WATER_NAP).toFixed(2),
  panelM: +PANEL.toFixed(3),
  hangers: hangerX.length,
  openings: openings.length,
  trussNiches: archNicheHoles.length,
  openingApexNap: openings.map(({ apex }) => +(apex + WATER_NAP).toFixed(1)),
};
const glbFile = path.join(outDir, "brug-over-de-noord.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-brug-over-de-noord.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers, landhoofd, kelder en printvoet op
// het printbed.
const stlName = `brug-over-de-noord-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Brug over de Noord Alblasserdam 1:${scale} mm Z-up`);
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
// Maaiveldpunten op de Noord 25 m naast de brug, aan beide zijden: in de
// westelijke helft, midden en oostelijke helft van de boog en naast de
// basculebrug.
const samplePoints = [-60, 0, 60, 118].flatMap((x) => [
  [x, 25],
  [x, -25],
]);
await writeFile(
  path.join(outDir, "brug-over-de-noord.json"),
  JSON.stringify(
    {
      name: "Brug over de Noord",
      file: "brug-over-de-noord.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [104498.0, 430004.5],
      xAxis: [0.92519, 0.37951],
      groundOffsetMetres: GROUND_OFFSET,
      // Laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten: de
      // Noord. Terugval als een uitsnede alleen een uiteinde van de brug raakt.
      groundHeight: 43.48,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0482100001254422"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de as van de brug midden tussen de twee rivierpijlers op de waterspiegel van de Noord (z = 0, NAP +0,05 m zoals het PDOK-terrein het water legt) in de oorsprong, +X langs de brug naar het oosten (Alblasserdam, RD-richting 22,30 graden vanaf het oosten) en +Y naar het noordnoordwesten, stroomafwaarts. Drie nodes: road:rijbaan en road:fietspad, de bovenste 0,5 m van het dek tussen de schampkanten en op de kelder tussen de borstweringen met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie rijbaan regionale weg of fietspad, bgt_fysiekvoorkomen gesloten verharding; de fietspaden aan weerszijden, op de boogbrug buiten de bogen), zodat de kleurregels van een thema erop werken; en building: de rest van het kunstwerk, het westelijke landhoofd op de dijk van Hendrik-Ido-Ambacht (x = -157,7 tot -143,9); de aanbrug van 47,5 m en de rolbasculebrug van 43,4 m in gesloten stand als kokerdek tot de onderrand van de V-liggers, 6,5 m onder het wegdek, met het vakwerk als blinde nissen; de twee gemetselde rivierpijlers van 6,4 × 25 m met ronde koppen, voet, schacht en dekplaat; de boogbrug met trekband van pijlerhart tot pijlerhart (186,6 m) met een dek van 20,5 m breed en twee vakwerkbogen van 1,3 m dik, 7 m naast de as, met de top op NAP +49,0 m, vakwerk van 7 m hoog in de top dat bij de opleggingen dichtloopt, 21 velden met de vakwerkdriehoeken als blinde nissen, en de 20 hangers als scherm met spitse openingen tussen dek en onderrand; de betonnen basculekelder (x = 140 tot 160,9) met borstwering, vensters, bordes en de brugwachterspost op een kolom met het dak op NAP +21,2 m. Het wegdek ligt op NAP +13,8 tot +15,1 m met een schampkant langs de randen. Het stabiliteitsverband tussen de bogen, leuningen, lantaarns, slagbomen, trappen, het remmingwerk en de betonnen aanbrug op kolommen ten oosten van de kelder zijn weggelaten; de export vult onder het dek een wig met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Het maaiveld wordt op het water naast de brug bemonsterd; groundHeight is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten. Vervangt het BAG-pand van de brugwachterspost. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthM: +(EAST_END - WEST_END).toFixed(1),
        deckWidthM: { approach: 2 * DECK.approachHalf, arch: 2 * DECK.archHalf, bascule: 2 * DECK.leafHalf },
        archBearingsM: 2 * BEARING,
        archCrownNapM: ARCH.crown,
        archTrussDepthM: ARCH.depth,
        archRibsFromAxisM: ARCH.ribY,
        archPanels: PANELS,
        hangers: hangerX.length,
        approachSpanM: +(SPANS[0].x1 - SPANS[0].x0).toFixed(1),
        basculeSpanM: +(SPANS[1].x1 - SPANS[1].x0).toFixed(1),
        vTrussDepthM: TRUSS_DEPTH,
        cabinRoofNapM: CABIN.roofNap,
        deckNapM: { west: DECK_NAP[0], crest: Math.max(...DECK_NAP), east: DECK_NAP[DECK_NAP.length - 1] },
        waterNapM: WATER_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Brug_over_de_Noord",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/516075",
        "PDOK BGT overbruggingsdeel (dek, landhoofd, rivierpijlers, basculekelder) en pand (brugwachterspost), EPSG:28992",
        "PDOK AHN DSM 0,5 m via WCS voor het wegdek, de bogen en de brugwachterspost",
        "PDOK luchtfoto (Actueel_orthoHR) voor de bogen, de kelder en de pijlers",
        "Wikimedia Commons: Brug over de Noord Alblasserdam 2018 1, 2, 3 en 4.jpg, Alblasserdam Brug over de Noord (open) seen from the southeast.jpg, Geopende Alblasserdamse brug (01).jpg, Monument id 516075 alblasserdam (29).jpg, Alblasserdam (28) - Flickr - bertknot (1).jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

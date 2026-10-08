// Genereert een vereenvoudigd, gesloten 3D-model van de Stadsbrug over de Oude
// Maas tussen Zwijndrecht en Dordrecht (Rijkswaterstaat: Verkeersbrug
// Dordrecht; in Zwijndrecht de "Dordtse brug", in Dordrecht de "Zwijndrechtse
// brug"), in 1939 geopend en tot 1977 deel van de A16. Een stalen vakwerkbrug
// met evenwijdige randen (Warren-vakwerk met verticalen) over twee velden van
// 90 en 77 m, aan de Dordtse kant een dubbele basculebrug van circa 47 m
// doorvaartwijdte tussen een pijler met halfronde kop (Zwijndrechtse kant) en
// de basculekelder op de Dordtse kade, en aan de Zwijndrechtse kant het eerste
// stuk van de aanbrug over de Veerplein-kade. Direct ten noordoosten ligt de
// Spoorbrug Dordrecht ("Het Hemelbed"); die heeft een eigen model en zit hier
// niet in, net als het ronde bedieningsgebouw tussen beide bruggen ("de
// koffiefilter", BAG-pand 0505100000067669). Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node per
// onderdeel met de materiaalklasse in de nodenaam) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal> met een
// printvoet onder het dek. De brug is in het model 308 m lang en past op 1:1000
// in 400 mm.
//
//   node scripts/generate-stadsbrug-zwijndrecht.mjs              # 1:1000 (standaard)
//   node scripts/generate-stadsbrug-zwijndrecht.mjs --scale 1250
//
// Assenstelsel: oorsprong midden in de basculebrug, waar de twee kleppen elkaar
// raken, op de as tussen de twee vakwerkliggers (RD 104264,74, 424905,05), z =
// NAP-hoogte (het PDOK-terrein legt de Oude Maas op ellipsoïdisch circa
// 43,66 m, NAP + 43,63 m, dus op NAP 0), Z omhoog. +X loopt langs de brug naar
// het zuidoosten (Dordrecht, RD-richting -36,41 graden vanaf het oosten, uit de
// vakwerklijnen in het AHN), +Y naar het noordoosten (stroomopwaarts, naar de
// spoorbrug). De vakwerkliggers staan op y = ±6,45; het dek loopt van
// y = -11,8 tot 11,4. Het model loopt van x = -263,35 (voeg in de aanbrug bij
// Zwijndrecht) tot 44,8 (einde van het BGT-brugdek bij Dordrecht, daarna begint
// de gebogen fly-over over het spoor).
//
// Bronnen: BGT overbruggingsdeel (het dek en zijn randen, de basculepijler met
// de halfronde kop en het bordes aan de zuidwestkant, het bordes onder de
// koffiefilter), BGT scheiding (muren onder het dek: de pijlers op x = -239,
// -204,6 en -115 met ronde koppen, de wanden van de basculepijler, de kademuur
// rond de pijlerkop en de Dordtse kademuur op x = 23,75; de liggers van de
// basculekleppen op y = ±6,45); BGT wegdeel en ondersteunend wegdeel (rijbaan,
// fietspaden, voetpaden en de stroken waarin de liggers staan); BAG-pand
// 0505100000013841 (bouwjaar 1932) op het bordes van de basculepijler; AHN DSM
// 0,5 m (PDOK WCS) voor het wegdek (NAP +13,5 m aan het westeinde, +13,8 tot
// +13,9 m over de rivier), de trottoirs (0,17 m hoger), de vakwerklijnen en
// hun bovenrand (NAP +21,4 m), de uiteinden van de liggers (onder x = -204,5 en
// -40,5, boven x = -199 en -46), het profiel van de klepliggers (tot 2,0 m
// boven het wegdek bij de draaipunten, 1,4 m in het midden van de klep, een
// verhoging tot 2,45 m waar de kleppen elkaar raken), de geleiders op de
// aanbrug (0,8 m), de pijlerneuzen (NAP +3,4 m), het huisje op het bordes (NAP
// +17,7 m) en het machinehuis op de Dordtse kelder (NAP +20,7 m);
// PDOK-luchtfoto (Actueel_orthoHR) voor het windverband (vakken van 15,3 m),
// de voegen in de aanbrug en de kleppen, de pijlerneuzen en de bordessen;
// Wikipedia (nl) voor naam, bouwjaar en de dubbele basculebrug; Wikimedia
// Commons-foto's (Brugweg in Dordrecht rijbaan.jpg, Autobrug over de Oude Maas,
// Zwijndrechtsebrug, Dordtsebrug, Dordrecht (12171579566).jpg, Brug in A16
// tussen Zwijndrecht en Dordrecht - luchtfoto.jpg, Brugwachter Oude Maas
// (Koffiefilter) , Zwijndrechtsebrug, Dordtsebrug bij Dordrecht
// (12171172804).jpg, Dordrecht Maas.JPG, Dordrecht View Spoorbrug 017
// 9686.jpg) voor het vakwerk met verticalen, de eindportalen, de blauwe
// plaatliggers van de kleppen met schuine uiteinden en de trottoirs buiten de
// liggers.
// Geschat: de vakverdeling (tien vakken van 15,3 m met een verticaal in elk
// half vak), de constructiehoogte van het dek (1,6 m, aan de rand 0,7 m), de
// vorm van de pijlerneuzen aan de zuidwestkant (driehoekig tot NAP +3,4 m; de
// noordoostkant ligt achter de remmingwerken van de spoorbrug), de
// pijlerschachten tot onder het dek, de eindpijler op x = -263,35, de diepte
// van de basculekelders en de draaipunten (x = -30,5 en 31,5), en de kraag om
// de pijlerkop (NAP +5,5 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "stadsbrug-zwijndrecht");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, Mesh, CrossSection } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const area2 = (pts) => {
  let a = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  });
  return a / 2;
};
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const extrudeY = (shape, y0, y1) =>
  Manifold.extrude(shape, y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const profileY = (points, y0, y1) => extrudeY([ccw(points)], y0, y1);
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in gezien vanaf +X, steeds evenveel punten).
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
const lerp = (a, b, t) => a + (b - a) * t;
// Driehoek naar binnen verschoven over d (de halve breedte van de staven
// eromheen); null als er te weinig opening overblijft.
function insetTriangle(tri, d, minArea = 1.5) {
  const polys = new CrossSection([ccw(tri)]).offset(-d, "Miter").toPolygons();
  if (polys.length !== 1 || polys[0].length < 3) return null;
  const pts = polys[0].map(([a, b]) => [a, b]);
  return Math.abs(area2(pts)) >= minArea ? pts : null;
}

// ---------- hoofdmaten ----------
// z = NAP-hoogte; de Oude Maas ligt in het PDOK-terrein op NAP 0.
const BASE = -1.0; // gemeenschappelijke onderkant, onder de waterspiegel
const GROUND_OFFSET = 0;
const GROUND_HEIGHT = 43.66; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de maaiveldpunten
const ORIGIN = [104264.74, 424905.05];
const X_AXIS = [0.80479021, -0.59355936];

const X_WEST = -263.35; // voeg in de aanbrug bij Zwijndrecht (luchtfoto): westeinde van het model
const X_EAST = 44.8; // einde van het BGT-brugdek bij Dordrecht (daarna de fly-over)

// Wegdek (rijbaan) in NAP: mediaan van het AHN-DSM over de rijbaan per 10 m.
const ROAD_NAP = [
  [-265, 13.51], [-255, 13.61], [-245, 13.7], [-235, 13.76], [-225, 13.78], [-215, 13.79], [-205, 13.77],
  [-195, 13.77], [-185, 13.78], [-175, 13.78], [-165, 13.79], [-155, 13.81], [-145, 13.82], [-135, 13.84],
  [-125, 13.88], [-115, 13.89], [-105, 13.87], [-95, 13.86], [-85, 13.82], [-75, 13.8], [-65, 13.79],
  [-55, 13.78], [-45, 13.75], [-35, 13.74], [-25, 13.75], [-15, 13.77], [-5, 13.79], [5, 13.78], [15, 13.77],
  [25, 13.78], [35, 13.8], [45, 13.85],
];
function road(x) {
  const pts = ROAD_NAP;
  if (x <= pts[0][0]) return pts[0][1];
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, z0] = pts[i];
    const [x1, z1] = pts[i + 1];
    if (x <= x1) return z0 + ((z1 - z0) * (x - x0)) / (x1 - x0);
  }
  return pts[pts.length - 1][1];
}
// Dwarsprofiel (BGT, AHN): tussen de buitenkanten van de liggers (|y| <= 6,95)
// de rijbaan en de stroken waarin de liggers staan op wegdekhoogte; daarbuiten
// fietspad en voetpad 0,17 m hoger; langs de rand een schampkant in plaats van
// de leuning.
const DECK = { sw: -11.8, ne: 11.4, inner: 6.95, curb: 0.17, depth: 1.6, edgeDepth: 0.7 };
const KERB = { width: 0.9, height: 0.6 };
const walk = (x) => road(x) + DECK.curb;
const deckBottom = (x) => road(x) - DECK.depth;
// Pijlers en kelders lopen tot 0,6 m onder het wegdek in het dek door (boven
// het schuine ondervlak van de trottoirs, onder de wegdeklaag).
const PIER_INTO = 1.0;

// Vakwerkliggers: twee lijnen van 1,0 m dik op y = ±6,45 (AHN), onderrand van
// x = -204,5 tot -40,5, bovenrand van -199 tot -46 op NAP +21,4 m (AHN, 99e
// percentiel), schuine eindstijlen. Tien vakken van 15,3 m (windverband op de
// luchtfoto) met een verticaal op elke knoop en in het midden van elk vak; de
// diagonalen vormen een W met de onderknopen midden in de vakken (Warren met
// verticalen). Het middelste steunpunt (x = -114,85) valt op een onderknoop.
const TRUSS = { offset: 6.45, half: 0.5, x0: -204.5, x1: -40.5, t0: -199.0, t1: -46.0, panels: 10, top: 21.4 };
const BAR = 0.9; // staven en randen
const CHORD_TOP = 0.9; // onderrand tot 0,9 m boven het wegdek
const NICHE = 0.35; // blinde nissen
const GABLE_DEG = 52; // plafond van de doorgaande openingen
// Klepliggers van de dubbele basculebrug (BGT: y = ±6,45, x = -34,5 tot 35,3;
// AHN: profiel), hoogtes boven het wegdek.
const GIRDER = {
  x0: -34.5,
  x1: 35.3,
  profile: [[-34.5, 0.45], [-30.5, 2.05], [-4.0, 1.4], [-4.0, 2.45], [4.0, 2.45], [4.0, 1.4], [31.5, 2.05], [35.3, 0.45]],
};
// Geleiders op de aanbrug in het verlengde van de liggers (AHN: 0,8 m).
const BARRIER = { height: 0.8 };

// Pijlers (BGT scheiding, muur: schachten met ronde koppen onder het dek) en de
// neuzen aan de zuidwestkant (AHN: NAP +3,4 m, punt op de luchtfoto).
const NOSE_TOP = 3.4;
const PIER_WEST = [
  [-241.06, -9.21], [-240.59, -9.88], [-240.01, -10.19], [-238.92, -10.41], [-238.62, -10.37], [-237.42, -9.82],
  [-237.04, -9.46], [-236.95, -6.29], [-237.0, 5.14], [-236.98, 9.1], [-236.95, 9.74], [-237.05, 10.13],
  [-237.25, 10.49], [-237.57, 10.82], [-237.99, 11.05], [-238.55, 11.2], [-239.23, 11.27], [-239.8, 11.22],
  [-240.31, 11.08], [-240.69, 10.88], [-241.03, 10.46], [-241.11, 9.1], [-241.14, 5.14], [-241.09, -6.27],
];
const PIER_SHORE = [
  [-206.95, -9.43], [-206.67, -9.81], [-205.93, -10.26], [-204.79, -10.49], [-203.37, -10.25], [-202.52, -9.71],
  [-202.17, -9.01], [-202.07, -8.49], [-202.27, 5.22], [-202.31, 8.43], [-202.49, 9.23], [-202.71, 9.94],
  [-203.27, 10.46], [-204.23, 10.85], [-204.67, 10.89], [-205.94, 10.77], [-206.6, 10.41], [-207.03, 9.86],
  [-207.24, 8.36], [-207.2, 5.21], [-207.01, -9.0],
];
const PIER_MID = [
  [-116.77, -9.76], [-116.42, -10.31], [-115.92, -10.58], [-115.0, -10.72], [-114.36, -10.66], [-113.46, -10.31],
  [-112.99, -9.55], [-112.84, -6.63], [-113.06, 5.3], [-113.09, 9.31], [-113.7, 10.32], [-114.24, 10.81],
  [-114.7, 10.97], [-115.5, 10.93], [-116.32, 10.59], [-116.67, 10.08], [-116.96, 9.31], [-117.15, 7.51],
  [-116.89, -6.63],
];
const NOSES = [
  [[-206.3, -10.0], [-198.3, -10.0], [-202.3, -17.6]],
  [[-121.9, -10.0], [-107.9, -10.0], [-114.9, -18.6]],
];
const END_PIER = { x0: X_WEST, x1: X_WEST + 1.5, y0: -11.0, y1: 10.6 }; // geschat

// Basculepijler aan de Zwijndrechtse kant (BGT muur 5ee1d37d09): rechthoek
// x = -37,79 tot -25,12 over de hele dekbreedte met halfronde koppen; de
// noordoostkop (onder de koffiefilter) is afgesneden op y = 12,8, zodat het
// model het BAG-pand 0505100000067669 niet raakt.
const BASCULE_PIER = [
  [-25.22, -10.94], [-25.12, 11.81], [-26.8, 11.81], [-27.03, 12.8], [-37.66, 12.8], [-37.72, 11.26], [-37.79, -10.95],
  [-37.62, -13.02], [-36.8, -15.06], [-35.24, -16.48], [-33.11, -17.26], [-31.21, -17.2], [-29.01, -16.28],
  [-27.52, -14.69], [-23.67, -14.63], [-23.68, -11.12],
];
const NE_CUT = 12.8;
// Bordes op trottoirhoogte aan de zuidwestkant (BGT overbruggingsdeel
// f6bb0c78fd) en aan de noordoostkant tot y = 12,8.
const SW_LANDING = [
  [-37.6, -11.0], [-37.3, -12.94], [-36.52, -14.88], [-35.06, -16.22], [-33.06, -16.97], [-31.23, -16.93],
  [-29.17, -16.06], [-27.79, -14.56], [-23.76, -14.53], [-23.76, -11.0],
];
const NE_LANDING = { x0: -37.66, x1: -25.17, y0: 11.0, y1: NE_CUT };
// Kraag om de pijlerkop (BGT kademuur 26dbe1e87a, AHN NAP +5,5 m).
const COLLAR = [
  [-37.79, -10.95], [-41.71, -10.94], [-40.97, -14.75], [-39.07, -17.83], [-36.67, -19.74], [-33.95, -19.48],
  [-31.68, -19.44], [-30.25, -19.21], [-28.71, -18.75], [-27.79, -19.62], [-26.2, -18.92], [-24.76, -17.33],
  [-23.91, -15.74], [-23.12, -13.58], [-23.01, -10.95],
];
const COLLAR_TOP = 5.5;
// Huisje op het bordes (BAG 0505100000013841, AHN dak NAP +17,7 m), tot de
// dekrand.
const HOUSE = { x0: -28.3, x1: -23.76, y0: -14.56, y1: DECK.sw, top: 17.7 };
// Basculekelder aan de Dordtse kant (op de kade, BGT kademuur x = 23,75) tot
// het einde van het model, met het machinehuis aan de noordoostkant (AHN:
// x = 25,5 tot 32,6, y = 11,2 tot 16,2, dak NAP +20,7 m).
const KELDER = { x0: 23.75, x1: X_EAST };
const MACHINE = { x0: 25.5, x1: 32.6, y0: 11.2, y1: 16.2, top: 20.7 };
// Voegen tussen de vaste brug en de kleppen (luchtfoto); de kleppen draaien om
// x = -30,5 en 31,5 en raken elkaar in x = 0.
const HEEL = { west: -37.25, east: 39.45 };

// ---------- dek, schampkanten, geleiders ----------
const deckXs = stationsX(X_WEST, X_EAST, 2);
const deckCentre = loftX(
  deckXs.map((x) => {
    const zt = road(x);
    return { x, section: [[-DECK.inner - 0.01, zt - DECK.depth], [DECK.inner + 0.01, zt - DECK.depth], [DECK.inner + 0.01, zt], [-DECK.inner - 0.01, zt]] };
  }),
);
const deckSW = loftX(
  deckXs.map((x) => {
    const zt = road(x);
    return { x, section: [[DECK.sw, zt - DECK.edgeDepth], [-DECK.inner, zt - DECK.depth], [-DECK.inner, zt + DECK.curb], [DECK.sw, zt + DECK.curb]] };
  }),
);
const deckNE = loftX(
  deckXs.map((x) => {
    const zt = road(x);
    return { x, section: [[DECK.inner, zt - DECK.depth], [DECK.ne, zt - DECK.edgeDepth], [DECK.ne, zt + DECK.curb], [DECK.inner, zt + DECK.curb]] };
  }),
);
// Strook langs x van y0 tot y1 van zb(x) tot zt(x), met `margin` rondom groter.
function band(x0, x1, y0, y1, zb, zt, margin = 0, step = 2) {
  return loftX(
    stationsX(x0 - margin, x1 + margin, step).map((x) => ({
      x,
      section: [[y0 - margin, zb(x) - margin], [y1 + margin, zb(x) - margin], [y1 + margin, zt(x) + margin], [y0 - margin, zt(x) + margin]],
    })),
  );
}
// Schampkanten (0,9 × 0,6 m op het trottoir) langs beide randen, behalve langs
// de bordessen en het machinehuis.
const KERBS = [
  [X_WEST, -37.75, DECK.sw, DECK.sw + KERB.width],
  [-23.7, X_EAST, DECK.sw, DECK.sw + KERB.width],
  [X_WEST, -37.7, DECK.ne - KERB.width, DECK.ne],
  [-25.2, MACHINE.x0, DECK.ne - KERB.width, DECK.ne],
  [MACHINE.x1, X_EAST, DECK.ne - KERB.width, DECK.ne],
];
const kerbSolid = ([x0, x1, y0, y1], margin = 0) => band(x0, x1, y0, y1, (x) => walk(x) - 0.3, (x) => walk(x) + KERB.height, margin);
const kerbs = KERBS.map((k) => kerbSolid(k));
// Geleiders op de aanbrug, tot het begin van het vakwerk.
const BARRIERS = [-1, 1].map((s) => [X_WEST, TRUSS.x0 + 0.5, s * TRUSS.offset - TRUSS.half, s * TRUSS.offset + TRUSS.half]);
const barrierSolid = ([x0, x1, y0, y1], margin = 0) => band(x0, x1, y0, y1, (x) => road(x) - 0.3, (x) => road(x) + BARRIER.height, margin);
const barriers = BARRIERS.map((b) => barrierSolid(b));

// ---------- vakwerkliggers ----------
// Plaat van de onderkant van het dek tot de bovenrand; de driehoeken met een
// verticaal en de diagonaal als plafond zijn doorgaande openingen, met een
// spitse top van 52 graden onder de diagonaal (de diagonaal wordt naar onderen
// breder); de driehoeken met een vlakke bovenkant zijn blinde nissen van
// 0,35 m aan de buitenkant.
const TAN_GABLE = Math.tan((GABLE_DEG * Math.PI) / 180);
const openingAngles = [];
let throughOpenings = 0;
let blindNiches = 0;
function apexOf(poly) {
  return poly.reduce((p, q) => (q[1] > p[1] ? q : p));
}
function gableCut(hole) {
  const [ax, az] = apexOf(hole);
  const gable = new CrossSection([[[ax - 100, az - 100 * TAN_GABLE], [ax + 100, az - 100 * TAN_GABLE], [ax, az]]]);
  const cut = new CrossSection([ccw(hole)]).intersect(gable);
  const polys = cut.toPolygons();
  if (polys.length !== 1 || cut.area() < 1.5) return null;
  return polys[0].map(([a, b]) => [a, b]);
}
const zt = TRUSS.top - BAR / 2;
const zb = (x) => road(x) + CHORD_TOP - BAR / 2;
const panel = (TRUSS.t1 - TRUSS.t0) / TRUSS.panels;
// Knopen: bovenknopen T op de vakgrenzen, onderknopen M midden in de vakken.
const nodes = [];
for (let k = 0; k <= TRUSS.panels; k++) {
  nodes.push({ x: TRUSS.t0 + k * panel, top: true });
  if (k < TRUSS.panels) nodes.push({ x: TRUSS.t0 + (k + 0.5) * panel, top: false });
}
const holes = [];
const niches = [];
// Eindvelden onder de schuine eindstijlen: doorgaande openingen.
for (const [xa, xb, xApex] of [
  [TRUSS.x0 + 0.6, TRUSS.t0, TRUSS.t0],
  [TRUSS.t1, TRUSS.x1 - 0.6, TRUSS.t1],
]) {
  const tri = [[xa, zb(xa)], [xb, zb(xb)], [xApex, zt]];
  const hole = insetTriangle(tri, BAR / 2);
  if (hole) holes.push(hole);
}
for (let i = 0; i + 1 < nodes.length; i++) {
  const a = nodes[i];
  const b = nodes[i + 1];
  const opening = a.top
    ? [[a.x, zb(a.x)], [b.x, zb(b.x)], [a.x, zt]]
    : [[a.x, zb(a.x)], [b.x, zb(b.x)], [b.x, zt]];
  const niche = a.top
    ? [[a.x, zt], [b.x, zt], [b.x, zb(b.x)]]
    : [[a.x, zt], [b.x, zt], [a.x, zb(a.x)]];
  const inset = insetTriangle(opening, BAR / 2);
  const hole = inset && gableCut(inset);
  if (hole) holes.push(hole);
  const n = insetTriangle(niche, BAR / 2);
  if (n) niches.push(n);
}
for (const hole of holes) {
  const apex = apexOf(hole);
  for (const q of hole) {
    if (q === apex || Math.abs(q[0] - apex[0]) < 1e-6) continue;
    // alleen de plafonds: randen vanaf de top naar beneden
    openingAngles.push((Math.atan2(apex[1] - q[1], Math.abs(apex[0] - q[0])) * 180) / Math.PI);
  }
}
const trussOutline = (() => {
  const { x0, x1 } = TRUSS;
  const steps = Math.max(1, Math.round((x1 - x0) / 2));
  return [
    ...Array.from({ length: steps + 1 }, (_, i) => {
      const x = x0 + ((x1 - x0) * i) / steps;
      return [x, deckBottom(x)];
    }),
    [x1, road(x1) + BAR],
    [TRUSS.t1, TRUSS.top],
    [TRUSS.t0, TRUSS.top],
    [x0, road(x0) + BAR],
  ];
})();
// Lijnen: zuidwest (nis aan de lage kant) en noordoost (nis aan de hoge kant).
const TRUSS_LINES = [
  { y0: -TRUSS.offset - TRUSS.half, y1: -TRUSS.offset + TRUSS.half, niche: "low" },
  { y0: TRUSS.offset - TRUSS.half, y1: TRUSS.offset + TRUSS.half, niche: "high" },
];
const trusses = TRUSS_LINES.map(({ y0, y1, niche }) => {
  const plate = profileY(trussOutline, y0, y1);
  const cut = [
    ...holes.map((h) => profileY(h, y0 - 0.3, y1 + 0.3)),
    ...niches.map((h) => (niche === "low" ? profileY(h, y0 - 0.3, y0 + NICHE) : profileY(h, y1 - NICHE, y1 + 0.3))),
  ];
  throughOpenings += holes.length;
  blindNiches += niches.length;
  return plate.subtract(union(cut));
});

// ---------- klepliggers ----------
function girderProfile() {
  const top = GIRDER.profile.map(([x, h]) => [x, road(x) + h]);
  const bottom = stationsX(GIRDER.x0, GIRDER.x1, 2)
    .reverse()
    .map((x) => [x, road(x) - 0.3]);
  return [...top, ...bottom];
}
const GIRDER_LINES = [-1, 1].map((s) => [s * TRUSS.offset - TRUSS.half, s * TRUSS.offset + TRUSS.half]);
const girders = GIRDER_LINES.map(([y0, y1]) => profileY(girderProfile(), y0, y1));

// ---------- pijlers, kelders, bordessen ----------
const pierShaft = (poly) => {
  const xs = poly.map(([x]) => x);
  const xMin = xs.reduce((m, v) => Math.min(m, v), Infinity);
  const xMax = xs.reduce((m, v) => Math.max(m, v), -Infinity);
  return prism(poly, BASE, Math.min(deckBottom(xMin), deckBottom(xMax)) + PIER_INTO);
};
const piers = [
  pierShaft(PIER_WEST),
  pierShaft(PIER_SHORE),
  pierShaft(PIER_MID),
  ...NOSES.map((tri) => prism(tri, BASE, NOSE_TOP)),
  boxFromTo(END_PIER.x0, END_PIER.x1, END_PIER.y0, END_PIER.y1, BASE, deckBottom(END_PIER.x0) + PIER_INTO),
];
// Basculepijler: de schacht tot onder het dek; buiten het dek (de bordessen)
// tot trottoirhoogte.
const bpXMin = -37.79;
const bpXMax = -23.67;
const basculePier = union([
  prism(BASCULE_PIER, BASE, Math.min(deckBottom(bpXMin), deckBottom(bpXMax)) + PIER_INTO),
  prism(SW_LANDING, BASE, walk(-30.7)),
  boxFromTo(NE_LANDING.x0, NE_LANDING.x1, NE_LANDING.y0, NE_LANDING.y1, BASE, walk(-31.4)),
  prism(COLLAR, BASE, COLLAR_TOP),
]);
const house = boxFromTo(HOUSE.x0, HOUSE.x1, HOUSE.y0, HOUSE.y1, walk(-26) - 0.3, HOUSE.top);
const kelder = union([
  boxFromTo(KELDER.x0, KELDER.x1, DECK.sw, DECK.ne, BASE, Math.min(deckBottom(KELDER.x0), deckBottom(KELDER.x1)) + PIER_INTO),
  boxFromTo(MACHINE.x0, MACHINE.x1, MACHINE.y0, MACHINE.y1, BASE, MACHINE.top),
]);

// ---------- de brug als geheel ----------
const bridge = union([
  deckCentre,
  deckSW,
  deckNE,
  ...kerbs,
  ...barriers,
  ...trusses,
  ...girders,
  ...piers,
  basculePier,
  house,
  kelder,
]);

// ---------- printvoet (alleen in de STL) ----------
// Onder het dek een wig van 50 graden vanaf de dekrand die uitloopt in een
// scherm van minstens 0,8 mm op printschaal tot de onderplaat, net als de
// overhangopvulling van de export.
const KNEE = Math.tan((50 * Math.PI) / 180);
const SCREEN = Math.max(0.45, (0.4 * scale) / 1000);
const printFoot = loftX(
  stationsX(END_PIER.x1, KELDER.x0, 1).map((x) => {
    const c = (DECK.sw + DECK.ne) / 2;
    const w = (DECK.ne - DECK.sw) / 2;
    const zt0 = road(x);
    const zbE = zt0 - DECK.edgeDepth - 0.02;
    const zIn = zt0 - 0.3;
    const zs = zbE - KNEE * (w - SCREEN);
    if (zs > BASE + 0.05) {
      return {
        x,
        section: [[c - SCREEN, BASE], [c + SCREEN, BASE], [c + SCREEN, zs], [c + w, zbE], [c + w, zIn], [c - w, zIn], [c - w, zbE], [c - SCREEN, zs]],
      };
    }
    // Laag dek: de wig komt al op de onderplaat uit.
    const a = w - (zbE - BASE) / KNEE;
    return {
      x,
      section: [[c - a, BASE], [c + a, BASE], [c + a + 1e-3, BASE + 1e-3], [c + w, zbE], [c + w, zIn], [c - w, zIn], [c - w, zbE], [c - a - 1e-3, BASE + 1e-3]],
    };
  }),
);
const printModel = union([bridge, printFoot]);

// ---------- controles ----------
for (const [name, solid] of [["model", bridge], ["print", printModel]]) {
  if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
}
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant, per soort.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const buckets = {};
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const zm = (p[0][2] + p[1][2] + p[2][2]) / 3;
    const xm = (p[0][0] + p[1][0] + p[2][0]) / 3;
    const key = zm < road(xm) + 0.05 ? "dek en bordessen" : zm > road(xm) + CHORD_TOP + 0.05 ? "nissen en daken" : "overig";
    buckets[key] = (buckets[key] ?? 0) + len / 2;
  }
  return Object.fromEntries(Object.entries(buckets).map(([k, a]) => [k, +a.toFixed(1)]));
}
const minAngle = openingAngles.reduce((m, a) => Math.min(m, a), Infinity);
console.log("vrij hangend in het model (m2):", overhangs(bridge));
console.log("vrij hangend in de printversie (m2):", overhangs(printModel));
console.log("doorgaande openingen", throughOpenings, "blinde nissen", blindNiches, "steilste plafond min (graden)", +minAngle.toFixed(1));
if (minAngle < 50) throw new Error("opening met een te vlak plafond");

// ---------- wegdek als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is per wegdeel een eigen node met de
// attributen van het BGT-wegdeel eronder (glTF `extras.attributes`), zodat de
// kleurregels van een thema (fietspaden rood) op de brug werken zoals op de
// PDOK-wegdelen ernaast. Actuele BGT-wegdelen met relatieve hoogteligging 2 op
// het dek (lokale coördinaten, vereenvoudigd tot 5 cm): rijbaan lokale weg
// (asfalt), fietspad (asfalt op het Zwijndrechtse deel tot x = -109,5,
// cementbeton op het Dordtse deel), voetpad (cementbeton, alleen op het Dordtse
// deel; op het Zwijndrechtse deel is het trottoir één fietspad). De stroken
// waarin de liggers en geleiders staan (BGT ondersteunend wegdeel
// verkeerseiland en berm) zijn geen wegdeel en blijven constructie, net als de
// schampkanten, de bordessen en het machinehuis. Het wegdek is de strook van
// 0,5 m onder tot 1 m boven het dek (rijbaan en trottoirs elk op hun eigen
// hoogte) binnen de BGT-contouren, min de vakwerkliggers, klepliggers,
// geleiders, schampkanten, het huisje en het machinehuis met 2 cm vrij; wordt
// pas hier gebouwd, nadat het printmodel is doorgerekend, zodat de STL gelijk
// blijft.
const LAYER = 0.5;
const ABOVE = 1.0;
const GUARD = 0.02;
const ROAD_ATTRIBUTES = { bgt_functie: "rijbaan lokale weg", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_ASPHALT_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "asfalt" };
const BIKE_CONCRETE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "cementbeton" };
const FOOT_ATTRIBUTES = { bgt_functie: "voetpad", bgt_fysiekvoorkomen: "gesloten verharding", plus_fysiekvoorkomen: "cementbeton" };
const ROADWAY = [
  // G0642.f117d148cef947ec93c908610bb790fa (Zwijndrecht)
  [[-264.5, 5.15], [-109.22, 5.31], [-109.43, -4.64], [-264.5, -4.71]],
  // G0505.047fc0f62877c003e0532b00500a66e1
  [[-37.62, -4.6], [-109.43, -4.64], [-109.32, 0.77], [-91.29, 0.36], [-37.61, 0.25]],
  // G0505.047fc0f62878c003e0532b00500a66e1
  [[-37.61, 0.25], [-91.29, 0.36], [-109.32, 0.77], [-109.22, 5.31], [-76.92, 5.33], [-37.6, 5.22]],
  // G0505.c9b9c5d1e7ba4349a12593e88efb2231
  [[-10.0, 0.18], [38.58, -0.61], [38.57, -5.64], [32.13, -5.43], [23.77, -5.42], [-16.26, -4.59], [-37.62, -4.6], [-37.61, 0.25]],
  // G0505.069eafafe89a40a39de0f883bde29907
  [[23.78, 5.53], [34.75, 5.53], [38.6, 5.37], [38.58, -0.61], [-10.0, 0.18], [-37.61, 0.25], [-37.6, 5.22], [-6.41, 5.13]],
  // G0505.25c064a2f82c46d09d75c93ee7fddbc7
  [[46.0, -6.51], [42.54, -6.01], [38.57, -5.64], [38.58, -0.61], [41.96, -0.67], [46.0, -1.22]],
  // G0505.047fc0f626b2c003e0532b00500a66e1
  [[41.96, -0.67], [38.58, -0.61], [38.6, 5.37], [40.48, 5.25], [46.0, 4.67], [46.0, -1.22]],
];
const BIKE_ASPHALT = [
  // G0642.6c00d94a9f0d45368e6c1bc3b66448a9 (zuidwest)
  [[-264.5, -6.19], [-205.36, -6.4], [-203.27, -6.6], [-109.5, -6.63], [-109.64, -10.86], [-146.03, -10.71], [-264.5, -10.83]],
  // G0642.f3f1c51f39dd40b48f0a5ada60e61b15 (noordoost)
  [[-264.5, 11.35], [-171.7, 11.58], [-123.37, 11.39], [-109.13, 11.41], [-109.19, 7.52], [-203.43, 7.39], [-205.84, 6.86],
    [-242.65, 6.72], [-245.04, 6.6], [-250.18, 6.69], [-264.5, 6.64]],
];
const BIKE_CONCRETE = [
  // G0505.047fc0f63419c003e0532b00500a66e1
  [[-37.62, -8.82], [-90.16, -8.9], [-109.57, -8.97], [-109.5, -6.63], [-37.62, -6.62]],
  // G0505.dd0348e58dd1497c972be97733b65368
  [[23.78, -6.89], [35.3, -6.88], [38.83, -6.71], [38.9, -9.82], [23.8, -8.81], [-13.54, -8.76], [-37.62, -8.82], [-37.62, -6.62], [-24.39, -6.56]],
  // G0505.e0a15fa6cc9b44858eb866f5b4119b7a
  [[44.83, -10.23], [38.9, -9.82], [38.83, -6.71], [41.43, -6.97], [46.0, -7.58], [46.0, -10.38]],
  // G0505.047fc0f63418c003e0532b00500a66e1
  [[-37.6, 7.59], [-38.88, 7.62], [-109.19, 7.52], [-109.16, 9.32], [-96.71, 9.33], [-49.59, 9.26], [-37.6, 9.36]],
  // G0505.bec7b6b890c94403b1d51d39ec321821
  [[23.79, 9.41], [39.08, 8.95], [41.31, 8.96], [41.34, 6.16], [38.59, 6.39], [33.81, 7.21], [23.78, 7.08], [-37.6, 7.59], [-37.6, 9.36], [-14.0, 9.55]],
  // G0505.047fc0f6341ac003e0532b00500a66e1
  [[41.34, 6.16], [41.31, 8.96], [43.25, 8.98], [43.24, 9.63], [46.0, 9.3], [46.0, 5.65]],
];
const FOOTWAY = [
  // G0505.047fc0f674fcc003e0532b00500a66e1
  [[-109.57, -8.97], [-37.62, -8.82], [-37.62, -10.77], [-96.26, -10.92], [-109.64, -10.86]],
  // G0505.47a89cd511fc491ab46fc24009ec1f75
  [[23.8, -8.81], [44.2, -10.15], [44.83, -10.23], [44.82, -10.46], [40.65, -11.44], [39.14, -11.41], [39.14, -11.53], [34.64, -11.54],
    [34.62, -13.43], [33.0, -13.43], [32.82, -13.37], [32.63, -13.17], [32.56, -12.89], [32.58, -11.11], [26.16, -11.04], [26.17, -10.84],
    [23.81, -10.88], [23.81, -10.43], [-26.83, -10.41], [-37.62, -10.77], [-37.62, -8.82], [-13.54, -8.76]],
  // G0505.047fc0f674fbc003e0532b00500a66e1
  [[-109.13, 11.41], [-37.41, 11.57], [-37.6, 9.36], [-49.59, 9.26], [-109.16, 9.32]],
  // G0505.942dae92c35947dfb49e5d558261b9e7
  [[-24.33, 11.51], [23.79, 11.57], [23.8, 11.14], [25.41, 11.07], [25.44, 11.4], [29.0, 11.46], [28.99, 11.98], [31.28, 12.04],
    [31.25, 12.32], [28.99, 12.3], [28.98, 13.67], [33.83, 13.68], [33.82, 11.67], [39.08, 11.66], [39.08, 10.11], [41.57, 9.89],
    [43.24, 9.63], [43.25, 8.98], [39.08, 8.95], [23.79, 9.41], [-14.0, 9.55], [-37.6, 9.36], [-37.41, 11.57]],
];
// De strook: over de rijbaan tussen de buitenkanten van de liggers van 0,5 m
// onder tot 1 m boven het wegdek, over de trottoirs hetzelfde boven het
// trottoir; beide iets breder dan het dek.
const stripXs = [X_WEST - 0.5, ...deckXs, X_EAST + 0.5];
const strips = union([
  loftX(stripXs.map((x) => ({ x, section: [[-DECK.inner, road(x) - LAYER], [DECK.inner, road(x) - LAYER], [DECK.inner, road(x) + ABOVE], [-DECK.inner, road(x) + ABOVE]] }))),
  loftX(stripXs.map((x) => ({ x, section: [[-14, walk(x) - LAYER], [-DECK.inner, walk(x) - LAYER], [-DECK.inner, walk(x) + ABOVE], [-14, walk(x) + ABOVE]] }))),
  loftX(stripXs.map((x) => ({ x, section: [[DECK.inner, walk(x) - LAYER], [14, walk(x) - LAYER], [14, walk(x) + ABOVE], [DECK.inner, walk(x) + ABOVE]] }))),
]);
// Wat constructie blijft, met 2 cm vrij: de hele strook van de vakwerk- en
// klepliggers (ook onder de openingen), de geleiders, de schampkanten, het
// huisje en het machinehuis.
const notLayer = union([
  ...TRUSS_LINES.map(({ y0, y1 }) => band(TRUSS.x0, TRUSS.x1, y0, y1, (x) => road(x) - LAYER - 0.1, (x) => walk(x) + ABOVE + 0.1, GUARD)),
  ...GIRDER_LINES.map(([y0, y1]) => band(GIRDER.x0, GIRDER.x1, y0, y1, (x) => road(x) - LAYER - 0.1, (x) => walk(x) + ABOVE + 0.1, GUARD)),
  // geleiders en schampkanten: de hele strook tot onder de wegdeklaag, anders
  // blijft er onder hun voet een laagje van 1 cm wegdek over
  ...BARRIERS.map(([x0, x1, y0, y1]) => band(x0, x1, y0, y1, (x) => road(x) - LAYER - 0.1, (x) => road(x) + BARRIER.height, GUARD)),
  ...KERBS.map(([x0, x1, y0, y1]) => band(x0, x1, y0, y1, (x) => road(x) - LAYER - 0.1, (x) => walk(x) + KERB.height, GUARD)),
  boxFromTo(HOUSE.x0 - GUARD, HOUSE.x1 + GUARD, HOUSE.y0 - GUARD, HOUSE.y1 + GUARD, BASE, HOUSE.top + 1),
  boxFromTo(MACHINE.x0 - GUARD, MACHINE.x1 + GUARD, MACHINE.y0 - GUARD, MACHINE.y1 + GUARD, BASE, MACHINE.top + 1),
]);
const layer = strips.subtract(notLayer);
const area = (polys) => union(polys.map((poly) => prism(poly, BASE - 1, 100)));
// Volgorde: voetpad, fietspaden, rijbaan; elk deel zonder wat al vergeven is.
const footCut = layer.intersect(area(FOOTWAY));
const bikeConcreteCut = layer.intersect(area(BIKE_CONCRETE)).subtract(footCut);
const bikeAsphaltCut = layer.intersect(area(BIKE_ASPHALT)).subtract(union([footCut, bikeConcreteCut]));
const roadCut = layer.intersect(area(ROADWAY)).subtract(union([footCut, bikeConcreteCut, bikeAsphaltCut]));
const cuts = union([footCut, bikeConcreteCut, bikeAsphaltCut, roadCut]);
const roadway = roadCut.intersect(bridge);
const bikeAsphalt = bikeAsphaltCut.intersect(bridge);
const bikeConcrete = bikeConcreteCut.intersect(bridge);
const footway = footCut.intersect(bridge);
const structure = bridge.subtract(cuts);
const parts = [
  ["building:stadsbrug-zwijndrecht", structure],
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:fietspad", bikeAsphalt, BIKE_ASPHALT_ATTRIBUTES],
  ["road:fietspad-cementbeton", bikeConcrete, BIKE_CONCRETE_ATTRIBUTES],
  ["road:voetpad", footway, FOOT_ATTRIBUTES],
];
{
  const whole = bridge.volume();
  const sum = parts.reduce((s, [, solid]) => s + solid.volume(), 0);
  console.log(
    "volumes (m3): brug",
    +whole.toFixed(1),
    ...parts.flatMap(([name, solid]) => [name, +solid.volume().toFixed(1)]),
    "som - brug",
    +(sum - whole).toFixed(4),
  );
  if (Math.abs(sum - whole) > 1e-3 * whole) throw new Error("onderdelen tellen niet op tot de brug");
  for (const [name, solid] of parts) {
    if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
    if (solid.isEmpty()) throw new Error(`${name}: leeg`);
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
    meshes.push({
      name,
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
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
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "stadsbrug-zwijndrecht.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-stadsbrug-zwijndrecht.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlName = `stadsbrug-zwijndrecht-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Stadsbrug Zwijndrecht 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Maaiveldpunten op het
// water van de Oude Maas aan beide kanten van de brug (22 m ten zuidwesten en
// 17 m ten noordoosten van de as, tussen de twee bruggen), in de twee
// vakwerkvelden en in de doorvaart van de basculebrug.
const samplePoints = [-160, -80, -5].flatMap((x) => [
  [x, -22],
  [x, 17],
]);
await writeFile(
  path.join(outDir, "stadsbrug-zwijndrecht.json"),
  JSON.stringify(
    {
      name: "Stadsbrug Zwijndrecht",
      file: "stadsbrug-zwijndrecht.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: GROUND_OFFSET,
      groundHeight: GROUND_HEIGHT,
      groundSamplePoints: samplePoints,
      replacesBuildings: ["NL.IMBAG.Pand.0505100000013841"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het midden van de basculebrug (waar de twee kleppen elkaar raken) op de as tussen de vakwerkliggers in de oorsprong, z = NAP-hoogte (de Oude Maas op NAP 0), +X langs de brug naar het zuidoosten (Dordrecht, RD-richting -36,41 graden vanaf het oosten) en +Y naar het noordoosten (stroomopwaarts, naar de spoorbrug). Vijf nodes. road:rijbaan, road:fietspad, road:fietspad-cementbeton en road:voetpad: de bovenste 0,5 m van het dek binnen de actuele BGT-wegdelen op de brug (rijbaan lokale weg in asfalt; fietspad in asfalt op het Zwijndrechtse deel en in cementbeton op het Dordtse deel; voetpad in cementbeton), buiten de liggers, geleiders, schampkanten en gebouwtjes, met de BGT-attributen in extras.attributes, zodat de kleurregels van een thema erop werken. building:stadsbrug-zwijndrecht: de rest van de verkeersbrug van 1939: het dek van 23,2 m breed (rijbaan op NAP +13,5 tot +13,9 m, trottoirs 0,17 m hoger, schampkanten langs de rand); twee vakwerkliggers met evenwijdige randen op y = ±6,45 (bovenrand NAP +21,4 m, schuine eindstijlen, tien vakken van 15,3 m met verticalen, Warren-diagonalen) over twee velden tussen de pijlers op x = -204,6, -115 en de basculepijler, als dichte platen van 1,0 m met doorgaande driehoekige openingen met een spitse top van 52 graden en blinde nissen voor de driehoeken met een vlakke bovenkant; de dubbele basculebrug in gesloten stand met twee blauwe plaatliggers van 1,0 m (tot 2,0 m boven het wegdek bij de draaipunten, 1,4 m midden op de klep, 2,45 m waar de kleppen elkaar raken, schuine uiteinden); de basculepijler met halfronde kop, bordes op trottoirhoogte, kraag tot NAP +5,5 m en het huisje op het bordes (BAG-pand 0505100000013841, tot NAP +17,7 m); de basculekelder op de Dordtse kade met het machinehuis (tot NAP +20,7 m); de pijlers met ronde koppen en driehoekige neuzen aan de zuidwestkant (NAP +3,4 m) en de aanbrug met geleiders tot de voeg op x = -263,35. Leuningen, lantaarns, het windverband en de eindportalen boven de rijbaan (horizontaal vrij over 12,9 m, op 1:1000 niet zonder steun dwars over de rijbaan te printen), de trappen naast de Dordtse kelder en de rest van de aanbruggen en de fly-over zijn weggelaten; de Spoorbrug Dordrecht en de koffiefilter (BAG-pand 0505100000067669) zijn eigen modellen of blijven de PDOK-reconstructie. De export vult onder het dek op, de STL heeft een printvoet. Het maaiveld wordt op het water naast de brug bemonsterd; groundHeight is de laagste PDOK-hoogte daar. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        lengthInModelM: +(X_EAST - X_WEST).toFixed(2),
        deckWidthM: +(DECK.ne - DECK.sw).toFixed(2),
        trussLinesM: [-TRUSS.offset, TRUSS.offset],
        trussTopNapM: TRUSS.top,
        trussPanels: TRUSS.panels,
        trussPanelM: +panel.toFixed(2),
        spansM: { river: [+(PIER_MID_X() - PIER_SHORE_X()).toFixed(1), +(bpXMin - PIER_MID_X()).toFixed(1)], basculeClearWidth: +(KELDER.x0 - (-25.22)).toFixed(1) },
        roadNapM: { west: road(X_WEST), river: road(-115), bascule: road(0), east: road(X_EAST) },
        girderAboveRoadM: { pivots: 2.05, mid: 1.4, tips: 2.45 },
        houseNapM: HOUSE.top,
        machineHouseNapM: MACHINE.top,
        waterNapM: 0,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Stadsbrug_Zwijndrecht",
        "PDOK BGT overbruggingsdeel (dek, basculepijler en bordessen), scheiding (pijlers, kademuren, klepliggers), wegdeel en ondersteunend wegdeel (rijbaan, fietspaden, voetpaden, stroken van de liggers), EPSG:28992",
        "PDOK BAG pand 0505100000013841 (huisje op het bordes) en 0505100000067669 (koffiefilter, niet gemodelleerd)",
        "PDOK AHN DSM 0,5 m via WCS voor wegdek, trottoirs, vakwerkliggers, klepliggers, geleiders, pijlerneuzen, huisje en machinehuis",
        "PDOK luchtfoto (Actueel_orthoHR) voor het windverband, de voegen, de pijlerneuzen en de bordessen",
        "Wikimedia Commons: Brugweg in Dordrecht rijbaan.jpg, Autobrug over de Oude Maas, Zwijndrechtsebrug, Dordtsebrug, Dordrecht (12171579566).jpg, Brug in A16 tussen Zwijndrecht en Dordrecht - luchtfoto.jpg, Brugwachter Oude Maas (Koffiefilter) , Zwijndrechtsebrug, Dordtsebrug bij Dordrecht (12171172804).jpg, Dordrecht Maas.JPG, Dordrecht View Spoorbrug 017 9686.jpg",
      ],
    },
    null,
    2,
  ),
);
function PIER_SHORE_X() {
  return (PIER_SHORE.reduce((m, [x]) => Math.min(m, x), Infinity) + PIER_SHORE.reduce((m, [x]) => Math.max(m, x), -Infinity)) / 2;
}
function PIER_MID_X() {
  return (PIER_MID.reduce((m, [x]) => Math.min(m, x), Infinity) + PIER_MID.reduce((m, [x]) => Math.max(m, x), -Infinity)) / 2;
}
console.log(JSON.stringify(report, null, 2));

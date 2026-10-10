// Genereert een gesloten 3D-model van het Nationaal Militair Museum (NMM) op de
// voormalige vliegbasis Soesterberg (Felix Claus Dick van Wageningen Architecten,
// 2014): een glazen doos van 195,5 bij 85,5 m en 13 m hoog onder een vlak dak van
// 250,2 bij 110,3 m op een stalen ruimtevakwerk van 4,9 m diep. Het dak steekt
// ongelijk over: 45 m aan de noordwestkop (daaronder staan vliegtuigen, het dak
// rust daar op een rij slanke kolommen), 14,8 m aan de zuidwestkant (het platform),
// 10 m aan de noordoostkant en 9,8 m aan de zuidoostkop. Aan de dakrand is het
// vakwerk zichtbaar (Warren-ligger met verticalen); dat is in het model een
// dakrand van 4,9 m met driehoekige blinde nissen van 0,4 m diep. De glasgevel
// heeft zware stalen gevelstijlen op een raster van 5 m (39 vakken in de lange,
// 17 in de korte gevels), als lisenen van 1 m breed en 0,45 m diep voor het glas.
// Door het dak steekt boven de zwarte doos een toren van 15,3 bij 20 m tot +32,7 m
// met een teruggezette glazen band onder de kap. Aan de noordoostkant ligt het
// entreeterras (+5 m) met de brug naar het hoger gelegen wandelpad in het park.
// Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-nationaal-militair-museum.mjs              # 1:1000 (standaard)
//   node scripts/generate-nationaal-militair-museum.mjs --scale 2000
//
// Assenstelsel: oorsprong in het midden van het dak (RD 147385,76, 460368,97) op
// het maaiveld van het platform aan de zuidwestkant (NAP +15,85 m), Z omhoog. +X
// loopt langs de lange gevels naar het zuidoosten (38,65 graden met de klok mee
// vanaf de RD-X-as, de richting van de BAG-gevels en de dakranden in het AHN) en
// +Y loodrecht daarop naar het noordoosten (de entreekant).
//
// Bronnen: PDOK BAG-pand 0342100000026223 (de glazen doos en het entreeblok onder
// het terras); AHN DSM/DTM 0,5 m (PDOK WCS): de dakranden (u = -125,08 tot 125,08,
// v = -55,13 tot 55,13 m), het dakvlak (NAP +33,785 m, mediaan), de toren (NAP
// +48,59 m, u = -45 tot -29,75, v = 19,75 tot 39,75 m), het terras en de brug (NAP
// +20,9 tot +20,4 m) en het maaiveld (NAP +15,85 tot +16,7 m); PDOK luchtfoto;
// Wikipedia (dak 110 bij 250 m, glazen pui van 13 m) en Commons-foto's van alle
// kanten. Geschat: de diepte van het dakvakwerk (13 m glas tot het dak), de
// indeling van de vakwerkrand (40 en 18 vakken), de maat en het raster van de
// gevelstijlen (5 m, geteld op foto's), de kap en de glazen band van de toren,
// de plaats van de kolommen onder de noordwestkop (vier, op een derde van de
// kopgevel) en de dikte van het terras- en brugdek (1,2 m) met twee pijlers.
// Weggelaten: de buitententoonstelling (vliegtuigen, tanks, de tank op het terras,
// vlaggenmast), het park met de schanskorven, drakentanden en paden, de
// zonnepanelen en installaties op het dak en op de toren (lager dan 0,9 m),
// de zwarte doos binnen het glas (alleen de toren steekt uit) en de leuningen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "nationaal-militair-museum");
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
// Convexe veelhoek in plan met een vlak z = a x + b y + c als bovenkant, vanaf z0.
const planeRoof = (pts, z0, [a, b, c]) =>
  Manifold.hull([...pts.map(([x, y]) => [x, y, z0]), ...pts.map(([x, y]) => [x, y, a * x + b * y + c])]);

const SLUG = "nationaal-militair-museum";

// ---------- maten (lokaal stelsel, z = hoogte boven het platform op NAP +15,85 m) ----------
const GROUND_NAP = 15.85;
const ORIGIN = [147385.76, 460368.97];
const X_AXIS = [0.780976, -0.624561]; // RD-richting -38,65 graden, langs de lange gevels
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// Het dak: buitenranden uit het AHN-DSM, bovenkant NAP +33,785 m (mediaan over het hele dakvlak, binnen
// 0,15 m vlak), onderkant van het vakwerk op +13,05 m (de glazen pui van 13 m op de vloer van het platform).
const ROOF = { u0: -125.08, u1: 125.08, v0: -55.13, v1: 55.13, top: 33.785 - GROUND_NAP, under: 13.05 };
// Zichtbare vakwerkrand: Warren-ligger met verticalen; de staven zijn 0,9 m (printbaar), de vakken tussen de
// staven blinde nissen van 0,4 m diep. 40 vakken langs de lange randen (6,25 m), 18 langs de korte (6,13 m).
const TRUSS = { member: 0.9, depth: 0.4, panelsLong: 40, panelsShort: 18 };
// De glazen doos: BAG-contour (rechthoek) met het glas 0,45 m achter de gevelstijlen.
const HALL = { u0: -80.14, u1: 115.32, v0: -40.35, v1: 45.13, inset: 0.45, baysLong: 39, baysShort: 17, mullion: 1.0 };
// Toren boven de zwarte doos (AHN): bovenkant NAP +48,59 m; een donkere kap van 3 m boven een glazen band
// van 2,5 m die 0,4 m terugligt (foto's vanaf het noordwesten en het noorden).
const TOWER = { u0: -45.0, u1: -29.75, v0: 19.75, v1: 39.75, top: 48.59 - GROUND_NAP, cap: 3.0, band: 2.5, recess: 0.4 };
// Daklicht (lantaarn) midden op het dak: in het AHN een gat (glas) met een rand op NAP +34,6 tot +35,0 m,
// u 40 tot 55, v 10 tot 14,75 m; als blok van 1 m boven het dakvlak.
const SKYLIGHT = { u0: 40.0, u1: 55.0, v0: 10.0, v1: 14.75, top: 34.8 - GROUND_NAP };
// Slanke kolommen onder de noordwestkop (op foto's drie tot vier zichtbaar, maat en plaats geschat): een rij
// halverwege de overstek, in de lijnen van de lange gevels en op een derde van de kopgevel; 1 m vierkant.
const COLUMN = { u: -102.6, vs: [-40.35, -11.86, 16.64, 45.13], size: 1.0 };
// Entreeterras en brug (AHN): bovenkant van het dek NAP +20,9 m aan de gevel, aflopend naar +20,4 m waar de
// brug op het wandelpad in het park landt (v = 104 m); dek 1,2 m dik.
const DECK = { slope: -0.0094, top0: 21.4 - GROUND_NAP, thick: 1.2 };
const TERRACE = { u0: -29.5, u1: -4.75, v0: HALL.v1, v1: 75 };
const BRIDGE = { u0: -29.25, u1: -19.5, v0: 75, v1: 106, piers: [85, 95], pier: 1.0 };
// Het blok onder het terras is het BAG-deel buiten de doos (u -25,05 tot -9,79, v tot 70,03).
const ENTRY_BLOCK = { u0: -25.05, u1: -9.79, v0: HALL.v1 - 0.5, v1: 70.03 };
// Maaiveld: het platform (NAP +15,85 tot +15,9 m), de koppen en de noordoostkant (NAP +16,0 tot +16,5 m),
// 6 tot 10 m buiten de dakrand.
const GROUND_SAMPLES = [[-60, -63], [60, -63], [-135, 0], [133, 0], [-60, 63], [60, 63]];
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten, als vaste terugval.
const GROUND_HEIGHT = 59.08;

// ---------- het dak ----------
// Dakplaat over de volle maat; de vakwerkrand krijgt per vak twee driehoekige nissen aan weerszijden van de
// diagonaal (de diagonalen wisselen per vak van richting, symmetrisch rond het midden van elke rand).
const roofSlab = box(ROOF.u0, ROOF.u1, ROOF.v0, ROOF.v1, ROOF.under, ROOF.top);
// Nissen in een rand: s loopt langs de rand van s0 tot s1, n panelen; terug als lijst van driehoeken [s, z].
const trussTriangles = (s0, s1, n) => {
  const tris = [];
  const w = (s1 - s0) / n;
  const h = TRUSS.member / 2;
  const zb = ROOF.under + TRUSS.member;
  const zt = ROOF.top - TRUSS.member;
  for (let k = 0; k < n; k++) {
    const a = s0 + k * w + h;
    const b = s0 + (k + 1) * w - h;
    const L = b - a;
    const H = zt - zb;
    const sin = H / Math.hypot(L, H);
    const cos = L / Math.hypot(L, H);
    const dx = h / sin;
    const dz = h / cos;
    // Diagonaal stijgt in de linkerhelft naar het midden, daalt in de rechterhelft (V-patroon).
    const rising = k < n / 2;
    if (rising) {
      tris.push([[a + dx, zb], [b, zb], [b, zt - dz]]);
      tris.push([[a, zb + dz], [a, zt], [b - dx, zt]]);
    } else {
      tris.push([[a, zb], [b - dx, zb], [a, zt - dz]]);
      tris.push([[a + dx, zt], [b, zt], [b, zb + dz]]);
    }
  }
  return tris;
};
// Een driehoek [s, z] als prisma van "depth" diep, de rand in: face = welke rand.
const nicheSolid = (tri, face) => {
  const d = TRUSS.depth;
  const pts = [];
  for (const [s, z] of tri) {
    if (face === "S") pts.push([s, ROOF.v0 - 0.1, z], [s, ROOF.v0 + d, z]);
    if (face === "N") pts.push([s, ROOF.v1 + 0.1, z], [s, ROOF.v1 - d, z]);
    if (face === "W") pts.push([ROOF.u0 - 0.1, s, z], [ROOF.u0 + d, s, z]);
    if (face === "E") pts.push([ROOF.u1 + 0.1, s, z], [ROOF.u1 - d, s, z]);
  }
  return Manifold.hull(pts);
};
const niches = [
  ...trussTriangles(ROOF.u0, ROOF.u1, TRUSS.panelsLong).flatMap((t) => [nicheSolid(t, "S"), nicheSolid(t, "N")]),
  ...trussTriangles(ROOF.v0, ROOF.v1, TRUSS.panelsShort).flatMap((t) => [nicheSolid(t, "W"), nicheSolid(t, "E")]),
];
const roof = Manifold.difference(roofSlab, Manifold.union(niches));

// ---------- de glazen doos ----------
const glass = box(HALL.u0 + HALL.inset, HALL.u1 - HALL.inset, HALL.v0 + HALL.inset, HALL.v1 - HALL.inset, BASE, ROOF.under + 0.2);
const mullions = [];
const clampBox = (a0, a1, lo, hi) => [Math.max(a0, lo), Math.min(a1, hi)];
for (let k = 0; k <= HALL.baysLong; k++) {
  const u = HALL.u0 + (k * (HALL.u1 - HALL.u0)) / HALL.baysLong;
  const [a, b] = clampBox(u - HALL.mullion / 2, u + HALL.mullion / 2, HALL.u0, HALL.u1);
  mullions.push(box(a, b, HALL.v0, HALL.v0 + HALL.inset + 0.05, BASE, ROOF.under + 0.2));
  mullions.push(box(a, b, HALL.v1 - HALL.inset - 0.05, HALL.v1, BASE, ROOF.under + 0.2));
}
for (let k = 0; k <= HALL.baysShort; k++) {
  const v = HALL.v0 + (k * (HALL.v1 - HALL.v0)) / HALL.baysShort;
  const [a, b] = clampBox(v - HALL.mullion / 2, v + HALL.mullion / 2, HALL.v0, HALL.v1);
  mullions.push(box(HALL.u0, HALL.u0 + HALL.inset + 0.05, a, b, BASE, ROOF.under + 0.2));
  mullions.push(box(HALL.u1 - HALL.inset - 0.05, HALL.u1, a, b, BASE, ROOF.under + 0.2));
}
const hall = Manifold.union([glass, ...mullions]);

// ---------- toren ----------
const tBandTop = TOWER.top - TOWER.cap;
const tBandBottom = tBandTop - TOWER.band;
const tower = Manifold.difference(
  box(TOWER.u0, TOWER.u1, TOWER.v0, TOWER.v1, ROOF.top - 0.3, TOWER.top),
  Manifold.difference(
    box(TOWER.u0 - 1, TOWER.u1 + 1, TOWER.v0 - 1, TOWER.v1 + 1, tBandBottom, tBandTop),
    box(TOWER.u0 + TOWER.recess, TOWER.u1 - TOWER.recess, TOWER.v0 + TOWER.recess, TOWER.v1 - TOWER.recess, tBandBottom - 1, tBandTop + 1),
  ),
);

const skylight = box(SKYLIGHT.u0, SKYLIGHT.u1, SKYLIGHT.v0, SKYLIGHT.v1, ROOF.top - 0.3, SKYLIGHT.top);

// ---------- kolommen onder de noordwestkop ----------
const columns = COLUMN.vs.map((v) => {
  const c = Math.min(Math.max(v, HALL.v0 + COLUMN.size / 2), HALL.v1 - COLUMN.size / 2);
  return box(COLUMN.u - COLUMN.size / 2, COLUMN.u + COLUMN.size / 2, c - COLUMN.size / 2, c + COLUMN.size / 2, BASE, ROOF.under + 0.2);
});

// ---------- entreeblok, terras en brug ----------
const deckTop = (v) => DECK.top0 + DECK.slope * v;
const deckPlane = [0, DECK.slope, DECK.top0];
const deckSlab = (u0, u1, v0, v1) =>
  Manifold.intersection(
    planeRoof([[u0, v0], [u1, v0], [u1, v1], [u0, v1]], BASE, deckPlane),
    box(u0, u1, v0, v1, deckTop(v1) - DECK.thick, 40),
  );
const entryBlock = box(ENTRY_BLOCK.u0, ENTRY_BLOCK.u1, ENTRY_BLOCK.v0, ENTRY_BLOCK.v1, BASE, deckTop(ENTRY_BLOCK.v1) - DECK.thick + 0.1);
const deck = Manifold.union([
  deckSlab(TERRACE.u0, TERRACE.u1, TERRACE.v0, TERRACE.v1),
  deckSlab(BRIDGE.u0, BRIDGE.u1, BRIDGE.v0 - 0.5, BRIDGE.v1),
  ...BRIDGE.piers.map((v) => box(BRIDGE.u0 + 0.5, BRIDGE.u1 - 0.5, v - BRIDGE.pier / 2, v + BRIDGE.pier / 2, BASE, deckTop(v) - DECK.thick + 0.1)),
]);

const museum = Manifold.union([roof, hall, tower, skylight, ...columns, entryBlock]);
const nodes = [
  ["building:museum", museum],
  ["road:entreeterras en brug", deck],
];
const all = Manifold.union([museum, deck]);

// Overhang: het vlakke ondervlak van het dakvakwerk (de overstekken), de plafonds van de nissen in de
// vakwerkrand en de glazen band van de toren (0,4 m) en de onderkant van het terras- en brugdek hangen echt
// over; de export vult dat bij het printen op.
const near = (a, b) => Math.abs(a - b) < 0.02;
const OVERHANG_OK = (z, p) => {
  const zs = p.map((q) => q[2]);
  const flatAt = (h) => zs.every((c) => near(c, h));
  if (flatAt(ROOF.under)) return true;
  if (zs.every((c) => c >= ROOF.under + TRUSS.member - 0.02 && c <= ROOF.top - TRUSS.member + 0.02)) return true;
  if (flatAt(tBandTop)) return true;
  if (zs.every((c) => c < 6 && c > 2.5)) return true;
  return false;
};

const META = {
  name: "Nationaal Militair Museum",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: GROUND_HEIGHT,
  replacesBuildings: ["0342100000026223"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (147385,76, 460368,97), het midden van het dak, op het maaiveld van het platform (NAP +15,85 m), +X langs de lange gevels naar het zuidoosten (-38,65 graden vanaf de RD-X-as) en +Y naar het noordoosten (de entreekant). Node building:museum: het vlakke dak van 250,2 bij 110,3 m (bovenkant +17,94 m, NAP +33,785 m) op een vakwerk van 4,9 m diep met een zichtbare vakwerkrand (driehoekige nissen van 0,4 m), overstekken van 45 m (noordwestkop, met vier kolommen), 14,8, 10 en 9,8 m; de glazen doos van 195,5 bij 85,5 m en 13 m hoog met gevelstijlen op 5 m; de toren boven de zwarte doos (15,3 bij 20 m, +32,7 m) met een teruggezette glazen band onder de kap; het daklicht (15 bij 4,75 m, +18,95 m); het entreeblok onder het terras. Node road:entreeterras en brug: het terras (+5 m) aan de noordoostgevel en de brug naar het wandelpad in het park (+4,6 m). Onderkant op 0,5 m onder het maaiveld. Vervangt de PDOK-reconstructie van BAG-pand 0342100000026223. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    roofM: [250.16, 110.26],
    roofTopNapM: 33.785,
    trussDepthM: +(ROOF.top - ROOF.under).toFixed(2),
    hallM: [195.46, 85.48, 13.05],
    overhangM: { northwest: 44.94, southwest: 14.78, northeast: 10.0, southeast: 9.76 },
    towerTopNapM: 48.59,
    terraceNapM: 20.9,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Nationaal_Militair_Museum",
    "PDOK BAG pand 0342100000026223, EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: dakranden, dakvlak, toren, terras en brug, maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons, categorie Buildings of the Nationaal Militair Museum (foto's van alle kanten, alleen ter controle)",
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

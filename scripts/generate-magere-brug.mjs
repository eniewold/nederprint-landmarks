// Genereert een vereenvoudigd, gesloten 3D-model van de Magere Brug (brug 242)
// over de Amstel in Amsterdam: de dubbele ophaalbrug uit 1934 met negen
// doorvaarten, de twee witte portalen (galgen) met de balansen en
// ballastkisten, de smalle kleppen en de vaste overspanningen met hun platte
// bogen, vereenvoudigd tot een vorm die op 1:1000 zonder losse
// steunconstructie print. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-magere-brug.mjs              # 1:300 (standaard)
//   node scripts/generate-magere-brug.mjs --scale 500
//
// Op 1:300 is de brug 247 mm lang en past hij op een gangbaar printbed; op
// 1:100 zou hij 74 cm worden.
//
// Assenstelsel: oorsprong in het hart van de brug (tussen de kleppen) op de
// waterspiegel van de Amstel (NAP -0,4 m), Z omhoog. +X loopt langs de brug naar
// de oostoever (Nieuwe Kerkstraat, RD-richting 16,75 graden boven het oosten),
// +Y stroomafwaarts naar het noordnoordwesten.
//
// Bronnen: BGT overbruggingsdeel (dek van 74 × 10 m met de 4,9 m brede kleppen
// tussen x = ±5, acht pijlers van 1,5 m op x = ±5,75, ±13,75, ±21,75 en
// ±29,75); AHN DSM 0,5 m (PDOK WCS) voor het hoogteverloop van het dek, de
// portalen, de balansen en de ballastkisten; Wikipedia en het
// Rijksmonumentenregister (518383) voor de geschiedenis; Wikimedia
// Commons-foto's voor de bogen en de portalen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "300"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "magere-brug");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(32);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
// Blok tussen twee hoekpunten; de volgorde van de grenzen maakt niet uit.
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
// Polygoon in het YZ-vlak, uitgetrokken langs X van x0 tot x1.
const profileX = (points, x0, x1) =>
  Manifold.extrude([ccw(points)], x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, 0]);
// Band tussen twee functies van x (onder en boven), uitgetrokken langs Y.
function bandY(x0, x1, bottom, top, y0, y1, steps = 24) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    pts.push([x, bottom(x)]);
  }
  for (let i = steps; i >= 0; i--) {
    const x = x0 + ((x1 - x0) * i) / steps;
    pts.push([x, top(x)]);
  }
  return profileY(pts, y0, y1);
}

// ---------- hoofdmaten (boven de waterspiegel, NAP -0,4 m) ----------
const BRIDGE = { halfLength: 37, halfWidth: 5, leafHalfWidth: 2.45, leafHalfLength: 5 };
const BOTTOM = -0.8; // onderkant van pijlers en landhoofden, onder water
// Pijlers volgens de BGT (1,5 m dik); de binnenste dragen de portalen.
const PIERS = [5.75, 13.75, 21.75, 29.75];
const PIER_HALF = 0.75;
const ABUTMENT = 0.5; // eindwand tegen de kade

// Dekhoogte uit het AHN: 3,8 m in het midden van de kleppen, 3,4 m aan hun
// voet, 3,3 m op de middenpijlers en lineair aflopend tot 2,2 m aan de kades
// (NAP +1,8 m; de kades liggen op NAP +1,6 m).
function deckZ(x) {
  const ax = Math.abs(x);
  if (ax < BRIDGE.leafHalfLength) return 3.8 - 0.4 * (ax / BRIDGE.leafHalfLength);
  if (ax <= 6.5) return 3.3;
  return 3.3 - ((3.3 - 2.2) * (ax - 6.5)) / (BRIDGE.halfLength - 6.5);
}
const DECK_LIFT = 0.1; // net boven de PDOK-reconstructie van het dek
const top = (x) => deckZ(x) + DECK_LIFT;
const ROAD = 0.25; // dikte van de loop- en fietslaag
const LEAF_THICKNESS = 0.6;

// Printbaarheid op 1:1000 (laag 0,2 mm, overhang 45 graden, steunbreedte
// 0,8 mm in lib/server/overhang-support.ts): de export vult alles op wat
// vlakker hangt dan 45 graden en laat delen smaller dan 0,8 m op ware grootte
// niet dragen. Daarom is de onderbouw dicht met blinde bogen, ontbreken de
// leuningen, zijn staanders en hangstangen minstens 0,9 m dik en is elk paar
// balansen één dichte plaat. Alleen de opening in de portalen blijft open: die
// heeft een spitse top van 50 graden en draagt zichzelf.

// Blinde bogen in elke vaste overspanning: platte segmentboog met de kruin
// 0,9 m onder het dek en pijl 0,6 m (foto's), 0,4 m diep in beide gevels.
const ARCH = { belowDeck: 0.9, rise: 0.6, recess: 0.4 };
// Onder de kleppen springt de onderbouw 0,6 m terug, als schaduwlijn van de
// doorvaart (minder dan drie lagen op 1:1000, dus vrijwel zonder opvulling).
const PASSAGE_INSET = 0.6;

// Portalen op de middenpijlers: twee staanders van 1 × 1 m naast de klep, een
// rondboog met spitse top over het looppad en een kap tot 9,8 m (AHN:
// NAP +9,4 m).
const PORTAL = { x: 5.6, depth: 1.0, post: 1.0, capTop: 9.8, capBottom: 8.9 };
// Balansen (wippen) op de portalen: per portaal één dichte plaat van 0,6 m
// over de breedte van beide balken, die naar het midden oploopt (1:6,7
// volgens AHN en foto's), van x = ±0,3 tot ±12,3, met achteraan de ballastkist.
const BEAM = { halfWidth: 3.05, depth: 0.6, slope: 0.15, front: 0.3, rear: 12.3 };
const BALLAST = { from: 9.5, to: 12.3, halfWidth: 3.1, height: 1.1 };
// Hangstangen van de plaat naar de voorkant van elke klep, 0,9 m dik.
const ROD = { x: 1.0, size: 0.9, y: BRIDGE.leafHalfWidth - 0.5 };
// Steunen onder het achtereinde: in werkelijkheid hangt de balans daar vrij,
// maar zonder steun vult de export de 6,7 m lange uitkraging tot het dek op.
const REAR_LEG = { x: 11.85, size: 0.9, y: BEAM.halfWidth - 0.45 };

// ---------- brug ----------
// Onderbouw: dicht van de bodem tot onder de looplaag, over de vaste delen
// 10 m breed en onder de kleppen 0,6 m smaller dan de klep.
const leafX = BRIDGE.leafHalfLength;
const fixedBody = [-1, 1].map((s) => {
  const band = bandY(
    leafX - 0.01,
    BRIDGE.halfLength,
    () => BOTTOM,
    (x) => top(x) - ROAD + 0.01,
    -BRIDGE.halfWidth,
    BRIDGE.halfWidth,
    64,
  );
  return s > 0 ? band : band.mirror([1, 0, 0]);
});
const passageBody = bandY(
  -leafX,
  leafX,
  () => BOTTOM,
  (x) => top(x) - LEAF_THICKNESS + 0.01,
  -(BRIDGE.leafHalfWidth - PASSAGE_INSET),
  BRIDGE.leafHalfWidth - PASSAGE_INSET,
  20,
);
const recesses = [];
const spans = [];
for (let i = 0; i < PIERS.length; i++) {
  const from = PIERS[i] + PIER_HALF;
  const to = i + 1 < PIERS.length ? PIERS[i + 1] - PIER_HALF : BRIDGE.halfLength - ABUTMENT;
  spans.push([from, to]);
}
for (const [from, to] of spans) {
  const mid = (from + to) / 2;
  const half = (to - from) / 2;
  const crown = deckZ(mid) - ARCH.belowDeck;
  const spring = crown - ARCH.rise;
  const r = (half * half + ARCH.rise * ARCH.rise) / (2 * ARCH.rise);
  const centreZ = crown - r;
  // Vanaf de waterspiegel: daaronder is de onderbouw onzichtbaar.
  const pts = [[mid - half, 0], [mid + half, 0], [mid + half, spring]];
  const a0 = Math.asin(half / r);
  for (let i = 1; i < 16; i++) {
    const t = a0 - (2 * a0 * i) / 16;
    pts.push([mid + r * Math.sin(t), centreZ + r * Math.cos(t)]);
  }
  pts.push([mid - half, spring]);
  for (const s of [-1, 1]) {
    for (const t of [-1, 1]) {
      const y0 = t * (BRIDGE.halfWidth - ARCH.recess);
      const y1 = t * (BRIDGE.halfWidth + 1);
      const recess = profileY(pts, Math.min(y0, y1), Math.max(y0, y1));
      recesses.push(s > 0 ? recess : recess.mirror([1, 0, 0]));
    }
  }
}
const body = union([...fixedBody, passageBody]).subtract(union(recesses));

// Looplaag: over de vaste delen 10 m breed, over de kleppen 4,9 m.
const fixedDeck = [-1, 1].map((s) => {
  const band = bandY(leafX, BRIDGE.halfLength, (x) => top(x) - ROAD, top, -BRIDGE.halfWidth, BRIDGE.halfWidth, 64);
  return s > 0 ? band : band.mirror([1, 0, 0]);
});
const leaves = bandY(
  -leafX - 0.01,
  leafX + 0.01,
  (x) => top(x) - LEAF_THICKNESS,
  top,
  -BRIDGE.leafHalfWidth,
  BRIDGE.leafHalfWidth,
  40,
);
const deck = union([...fixedDeck, leaves]);
const bridge = body;

// ---------- ophaalbrug: portalen, balansen met ballastkist, hangstangen ----------
const mechanism = [];
const beamBottom = (ax) => PORTAL.capTop + BEAM.slope * (PORTAL.x - ax);
for (const s of [-1, 1]) {
  // Portaal: blok over de volle breedte met de opening over het looppad:
  // rondboog tot 40 graden, daarboven rechte zijden van 50 graden naar de top
  // onder de kap.
  const outer = BRIDGE.leafHalfWidth + PORTAL.post;
  const r = BRIDGE.leafHalfWidth;
  const phi = (40 * Math.PI) / 180;
  const apexAboveSpring = r * Math.sin(phi) + r * Math.cos(phi) * Math.tan((50 * Math.PI) / 180);
  const spring = PORTAL.capBottom - apexAboveSpring;
  const portalBlock = boxFromTo(
    s * (PORTAL.x - PORTAL.depth / 2),
    s * (PORTAL.x + PORTAL.depth / 2),
    -outer,
    outer,
    deckZ(PORTAL.x),
    PORTAL.capTop,
  );
  const openingPts = [[-r, deckZ(PORTAL.x) - 1], [r, deckZ(PORTAL.x) - 1]];
  for (let i = 0; i <= 8; i++) {
    const t = (phi * i) / 8;
    openingPts.push([r * Math.cos(t), spring + r * Math.sin(t)]);
  }
  openingPts.push([0, PORTAL.capBottom]);
  for (let i = 8; i >= 0; i--) {
    const t = (phi * i) / 8;
    openingPts.push([-r * Math.cos(t), spring + r * Math.sin(t)]);
  }
  const opening = profileX(openingPts, s * PORTAL.x - PORTAL.depth, s * PORTAL.x + PORTAL.depth);
  mechanism.push(portalBlock.subtract(opening));

  // Balansplaat, schuin, met de onderkant op de kap boven het portaal.
  const plate = bandY(
    BEAM.front,
    BEAM.rear,
    (x) => beamBottom(x),
    (x) => beamBottom(x) + BEAM.depth,
    -BEAM.halfWidth,
    BEAM.halfWidth,
    4,
  );
  const ballast = boxFromTo(
    BALLAST.from,
    BALLAST.to,
    -BALLAST.halfWidth,
    BALLAST.halfWidth,
    beamBottom(BALLAST.from) - BALLAST.height,
    beamBottom(BALLAST.from) + 0.05,
  );
  const rods = [-1, 1].map((t) =>
    boxFromTo(
      ROD.x - ROD.size / 2,
      ROD.x + ROD.size / 2,
      t * (ROD.y - ROD.size / 2),
      t * (ROD.y + ROD.size / 2),
      top(ROD.x) - 0.05,
      beamBottom(ROD.x) + 0.05,
    ),
  );
  const legs = [-1, 1].map((t) =>
    boxFromTo(
      REAR_LEG.x - REAR_LEG.size / 2,
      REAR_LEG.x + REAR_LEG.size / 2,
      t * (REAR_LEG.y - REAR_LEG.size / 2),
      t * (REAR_LEG.y + REAR_LEG.size / 2),
      top(REAR_LEG.x) - 0.05,
      beamBottom(BALLAST.from) - BALLAST.height + 0.05,
    ),
  );
  const balance = union([plate, ballast, ...rods, ...legs]);
  mechanism.push(s > 0 ? balance : balance.mirror([1, 0, 0]));
}
const lift = union(mechanism);

// Het printmodel (de STL) is de brug als geheel; de wegdeklaag hieronder wordt
// er pas daarna uitgesneden, zodat de STL niet verandert.
const printModel = union([deck, bridge, lift]);

// ---------- fietspad als eigen onderdelen ----------
// De bovenste 0,5 m van het dek is een eigen node met de attributen van het
// BGT-wegdeel eronder (glTF `extras.attributes`), zodat de kleurregels van een
// thema (bijvoorbeeld fietspaden rood) op de brug werken zoals op de
// PDOK-wegdelen ernaast. De BGT heeft op de brug alleen fietspad
// (relatieve_hoogteligging 1): de vaste delen in open verharding
// (G0363.2e7d4263001c4b0f99f56542d0f264fb ten westen,
// G0363.4f373ba742624507a7fc7c680027d98f ten oosten) en de kleppen met de
// doorgang door de portalen in gesloten verharding
// (G0363.dc5ccd30dd254a56b67b708b8f9bfbba). Ook de kleppen krijgen zo hun
// wegdek: dezelfde strook loopt over de kleppen door en het deel binnen het
// BGT-vlak van de klep wordt road:fietspad-klep; wat van de klep onder de
// strook overblijft, hoort bij building:ophaalbrug. Buiten de BGT-vlakken
// (de dekranden van 0,5 m, waar de leuningen staan) is de strook fietspad.
const LAYER = 0.5;
const ABOVE = 1.0;
const GAP = 0.02;
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "open verharding" };
const LEAF_BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
// G0363.dc5ccd30dd254a56b67b708b8f9bfbba in lokale coördinaten (5 cm). De
// lange randen (y = -2,43 .. 2,47) vallen op de rand van de klep (±2,45) en
// lopen hier tot voorbij de klep door en de dwarsranden (x = -5,01 .. 4,98)
// liggen symmetrisch op x = ±4,98, net vóór de vaste onderbouw (x = ±4,99;
// precies daarop liet de doorsnede vlakken zonder dikte staan): anders
// bleven er strookjes fietspad van 2 tot 5 cm op de klep staan. Door de portalen loopt het vlak tot x = ±5,6 (|y| < 2).
const LEAF_PATH = [
  [5.61, 1.99], [4.98, 2.0], [4.98, 3.0], [-4.98, 3.0], [-4.98, 2.03], [-5.62, 2.03],
  [-5.64, -1.96], [-4.98, -1.96], [-4.98, -3.0], [4.98, -3.0], [4.98, -1.99], [5.59, -1.99],
];
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, over dezelfde
// loftstations als de looplaag (kleppen en vaste delen apart) en breder dan
// het dek, zodat hij de dekranden en de kopse kanten helemaal doorsnijdt.
function layerBand(xs, zAt, halfWidth) {
  const pts = [
    ...xs.map((x) => [x, zAt(x) - LAYER]),
    ...[...xs].reverse().map((x) => [x, zAt(x) + ABOVE]),
  ];
  return profileY(pts, -halfWidth, halfWidth);
}
const LAYER_HALF_WIDTH = BRIDGE.halfWidth + 1;
const leafStations = [];
for (let i = 0; i <= 40; i++) {
  const x0 = -leafX - 0.01;
  const x1 = leafX + 0.01;
  leafStations.push(x0 + ((x1 - x0) * i) / 40);
}
const fixedStations = [];
for (let i = 0; i <= 64; i++) fixedStations.push(leafX + ((BRIDGE.halfLength - leafX) * i) / 64);
const endZ = top(BRIDGE.halfLength);
const fixedLayer = layerBand(
  [...fixedStations, BRIDGE.halfLength + 0.6],
  (x) => (x > BRIDGE.halfLength ? endZ : top(x)),
  LAYER_HALF_WIDTH,
);
const strip = union([
  layerBand(leafStations, top, LAYER_HALF_WIDTH),
  fixedLayer,
  fixedLayer.mirror([1, 0, 0]),
]);
// Wat door het wegdek steekt, blijft constructie, met 2 cm vrij: de staanders
// van de portalen, de hangstangen op de kleppen (tot voorbij de klep, zodat
// er geen strookje fietspad naast blijft) en de steunen onder de balansen.
const guards = [];
for (const s of [-1, 1]) {
  for (const t of [-1, 1]) {
    guards.push(
      boxFromTo(
        s * (PORTAL.x - PORTAL.depth / 2 - GAP),
        s * (PORTAL.x + PORTAL.depth / 2 + GAP),
        t * (BRIDGE.leafHalfWidth - GAP),
        t * (BRIDGE.leafHalfWidth + PORTAL.post + GAP),
        0,
        PORTAL.capBottom,
      ),
      boxFromTo(
        s * (ROD.x - ROD.size / 2 - GAP),
        s * (ROD.x + ROD.size / 2 + GAP),
        t * (ROD.y - ROD.size / 2 - GAP),
        t * (BRIDGE.leafHalfWidth + 0.5),
        0,
        PORTAL.capBottom,
      ),
      boxFromTo(
        s * (REAR_LEG.x - REAR_LEG.size / 2 - GAP),
        s * (REAR_LEG.x + REAR_LEG.size / 2 + GAP),
        t * (REAR_LEG.y - REAR_LEG.size / 2 - GAP),
        t * (REAR_LEG.y + REAR_LEG.size / 2 + GAP),
        0,
        PORTAL.capBottom,
      ),
    );
  }
}
const roadLayer = strip.subtract(union(guards));
const leafArea = Manifold.extrude([ccw(LEAF_PATH)], 20).translate([0, 0, BOTTOM - 1]);
const leafBikeway = roadLayer.intersect(leafArea).intersect(printModel);
const bikeway = roadLayer.subtract(leafArea).intersect(printModel);
// De kleppen (onder het wegdek) en het mechanisme zijn de ophaalbrug, de rest
// van brug − strook is de vaste brug. Opgebouwd uit de losse onderdelen in
// plaats van printModel − strook − ophaalbrug: dat aftrekken over precies
// samenvallende vlakken (de onderkant van de kleppen) liet in de vaste brug een
// vlak zonder dikte staan.
const liftPart = union([lift, leaves.subtract(roadLayer)]);
const fixedPart = union([...fixedDeck, body]).subtract(roadLayer).subtract(leaves).subtract(lift);

const parts = [
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
  ["road:fietspad-klep", leafBikeway, LEAF_BIKE_ATTRIBUTES],
  ["building:brug", fixedPart],
  ["building:ophaalbrug", liftPart],
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
  const nodes = [];
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
    volumeM3: +solid.volume().toFixed(3),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
// De onderdelen vormen samen precies de brug als geheel (geen overlap).
const partsVolume = parts.reduce((sum, [, solid]) => sum + solid.volume(), 0);
report.partition = {
  partsM3: +partsVolume.toFixed(3),
  wholeM3: +printModel.volume().toFixed(3),
  differenceM3: +(partsVolume - printModel.volume()).toFixed(4),
  overlapM3: +union(parts.slice(0, 2).map(([, solid]) => solid))
    .intersect(union(parts.slice(2).map(([, solid]) => solid)))
    .volume()
    .toFixed(4),
};
const glbFile = path.join(outDir, "magere-brug.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-magere-brug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pijlers en landhoofden op het printbed.
const stlFile = path.join(outDir, `magere-brug-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BOTTOM]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Magere Brug Amsterdam 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. Oorsprong: hart van het
// BGT-dek, op de waterspiegel; X langs de brug naar de oostoever.
await writeFile(
  path.join(outDir, "magere-brug.json"),
  JSON.stringify(
    {
      name: "Magere Brug",
      file: "magere-brug.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [121976.08, 486298.51],
      xAxis: [0.95732, 0.28903],
      groundOffsetMetres: 0,
      // Op het water van de Amstel naast de brug: de doorvaart en de
      // tweede en derde overspanning aan beide zijden.
      groundSamplePoints: [
        [0, 9],
        [0, -9],
        [17.75, 9],
        [-17.75, -9],
        [25.75, -9],
        [-25.75, 9],
      ],
      replacesTerrain: [
        "G0363.874043cee9314281a048ff1aa45f82c8",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de brug (tussen de kleppen) op de waterspiegel van de Amstel (z = 0, NAP -0,4 m) in de oorsprong, +X langs de brug naar de oostoever (RD-richting 16,75 graden) en +Y stroomafwaarts. Het maaiveld wordt op het water naast de brug bemonsterd, vandaar geen verzinking. Nodenaam klasse:label bepaalt de materiaalklasse: road:fietspad en road:fietspad-klep zijn de bovenste 0,5 m van het dek met de attributen van het BGT-wegdeel eronder in extras.attributes (bgt_functie fietspad; bgt_fysiekvoorkomen open verharding op de vaste delen, gesloten verharding op de kleppen en de doorgang door de portalen), zodat de kleurregels van een thema erop werken; building:brug is de vaste brug (dichte onderbouw met blinde bogen en het dek onder het wegdek), building:ophaalbrug de kleppen onder het wegdek, de portalen, balansplaten met ballastkisten, hangstangen en steunen; het model is vereenvoudigd om op 1:1000 zonder losse steunconstructie te printen.",
      printFiles: [`magere-brug-1-${scale}.stl`],
      realWorld: {
        lengthM: BRIDGE.halfLength * 2,
        widthM: BRIDGE.halfWidth * 2,
        leafWidthM: BRIDGE.leafHalfWidth * 2,
        passageWidthM: (PIERS[0] - PIER_HALF) * 2,
        openings: 1 + spans.length * 2,
        deckAboveWaterM: { centre: deckZ(0), piers: deckZ(PIERS[0]), ends: deckZ(BRIDGE.halfLength) },
        portalTopAboveWaterM: PORTAL.capTop,
        beamTipAboveWaterM: +(beamBottom(BEAM.front) + BEAM.depth).toFixed(2),
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Magere_Brug",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/518383",
        "PDOK BGT overbruggingsdeel (dek 74 x 10 m, kleppen 4,9 m, acht pijlers van 1,5 m), EPSG:28992",
        "PDOK BGT wegdeel (OGC API), fietspaden op het dek: G0363.2e7d4263001c4b0f99f56542d0f264fb, G0363.4f373ba742624507a7fc7c680027d98f (open verharding), G0363.dc5ccd30dd254a56b67b708b8f9bfbba (gesloten verharding, kleppen)",
        "PDOK AHN DSM 0,5 m via WCS voor het dek, de portalen, de balansen en de ballastkisten",
        "Wikimedia Commons: Magere Brug.jpg, Amsterdam, brug 242, Magere Brug 2007.jpg, Magere brug 2010 08 28.jpg",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

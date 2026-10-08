// Genereert een vereenvoudigd, gesloten 3D-model van de Hovenring in
// Eindhoven: de zwevende fietsrotonde uit 2012 (ipv Delft) boven het verdiepte
// kruispunt Heerbaan/Meerenakkerweg met de Noord-Brabantlaan, met het ringvormige
// dek van 72 m, de vier aanbruggen naar de landhoofden, de pyloon van 70 m en
// de 24 tuien. Alle maten in het script zijn meters op ware grootte. Uitvoer:
// een GLB in meters (Y omhoog, één node per onderdeel met de materiaalklasse in
// de nodenaam) als catalogusbron voor de export en de kaart, plus een binaire
// STL in millimeters op 1:<schaal> met een printvoet onder het dek.
//
//   node scripts/generate-hovenring.mjs              # 1:1000 (standaard)
//   node scripts/generate-hovenring.mjs --scale 500
//
// Assenstelsel: oorsprong in het hart van de ring (de voet van de pyloon) op het
// verdiepte wegdek onder de ring (NAP +18,9 m), Z omhoog, +X naar het oosten en
// +Y naar het noorden (de assen van RD; geen draaiing).
//
// Bronnen: BGT overbruggingsdeel (dek: ring met binnenstraal 27,1 m en
// buitenstraal 36,0 m, vier aanbruggen van 5,45 m breed tot 50 m uit het hart,
// richtingen 10,7 + k·90 graden); AHN DSM/DTM 0,5 m (PDOK WCS) voor de
// dekhoogte (NAP +24,65 m), het wegdek eronder, de landhoofden en de pyloon;
// de dwarsdoorsnede van het dek en het overzicht in Staalbouwwedstrijd 2012
// (Infosteel, laureaat categorie E) voor de vorm van het dek, de pyloon en de
// tuiaansluitingen; PDOK luchtfoto voor de richtingen van de tuien.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "hovenring");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(96);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
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
// Polygoon in het XY-vlak, uitgetrokken langs Z van z0 tot z1.
const plan = (points, z0, z1) =>
  Manifold.extrude([ccw(points)], z1 - z0).translate([0, 0, z0]);
// Omwentelingslichaam rond de Z-as uit een profiel van [straal, z]-punten.
const revolve = (points, segments = 192) => Manifold.revolve([ccw(points)], segments);

// ---------- hoofdmaten (boven het wegdek onder de ring, NAP +18,9 m) ----------
const GROUND_NAP = 18.9;
const NAP = (h) => +(h - GROUND_NAP).toFixed(3);
const BASE = -0.5; // gemeenschappelijke onderkant van pyloon en landhoofden
const DECK_TOP = NAP(24.65); // fietspad op de ring volgens het AHN

// Dek volgens de BGT (binnenstraal 27,1 m, buitenstraal 36,0 m) en de
// dwarsdoorsnede (8,85 m breed): aan de buitenrand 0,2 m dik, de onderplaat
// loopt schuin naar 0,7 m bij de tuiaansluiting en 1,33 m onder het
// contragewicht, en de binnenrand is 0,13 m hoog. De leuningen en het
// lamellenvlak met verlichting zijn weggelaten.
const RING = { inner: 27.15, outer: 36.0, anchor: 30.5 };
const ringProfile = [
  [RING.inner, DECK_TOP],
  [RING.outer, DECK_TOP],
  [RING.outer, DECK_TOP - 0.2],
  [35.5, DECK_TOP - 0.28],
  [31.0, DECK_TOP - 0.7],
  [28.25, DECK_TOP - 1.33],
  [RING.inner, DECK_TOP - 0.13],
];
const ring = revolve(ringProfile);

// Aanbruggen: vier rechte armen van 5,45 m breed in de richtingen 10,7 +
// k·90 graden (BGT), met afrondingen van 3 m tegen de ring en een landhoofd
// van 1,5 m onder het eind op 50 m uit het hart. Het dek daalt van 24,65 naar
// NAP +24,45 m (AHN) en is 0,6 m dik.
const ARM = { angles: [10.7, 100.7, 190.7, 280.7], halfWidth: 2.725, fillet: 3, end: 50, landhoofd: 48.5, depth: 0.6 };
const armTop = (u) => (u <= 36 ? DECK_TOP : DECK_TOP - (0.2 * (u - 36)) / (ARM.end - 36));
function armHalfWidth(u) {
  const root = 39;
  if (u >= root) return ARM.halfWidth;
  const d = root - u;
  const fillet = d >= ARM.fillet ? Infinity : ARM.halfWidth + ARM.fillet - Math.sqrt(ARM.fillet ** 2 - d * d);
  return Math.min(5.0, fillet);
}
function armPlan(from = 33, to = ARM.end) {
  const us = [from];
  for (let u = 36; u < 39; u += 0.25) us.push(u);
  us.push(39, to);
  return [...us.map((u) => [u, -armHalfWidth(u)]), ...[...us].reverse().map((u) => [u, armHalfWidth(u)])];
}
const armProfile = [
  [33, DECK_TOP - ARM.depth],
  [36, DECK_TOP - ARM.depth],
  [ARM.end, armTop(ARM.end) - ARM.depth],
  [ARM.end, armTop(ARM.end)],
  [36, DECK_TOP],
  [33, DECK_TOP],
];
const armLocal = plan(armPlan(), BASE, 10).intersect(profileY(armProfile, -6, 6));
const landhoofdLocal = plan(
  [
    [ARM.landhoofd, -ARM.halfWidth],
    [ARM.end, -ARM.halfWidth],
    [ARM.end, ARM.halfWidth],
    [ARM.landhoofd, ARM.halfWidth],
  ],
  BASE,
  armTop(ARM.end) - 0.1,
);
const arms = union(ARM.angles.map((a) => union([armLocal, landhoofdLocal]).rotate([0, 0, a])));

// Pyloon: ronde schacht van 2,2 m die tot 2,5 m aanzwelt, de tuiaansluitingen
// op 54 en 57 m en daarboven een naald tot 70 m (bron: 70 m; het AHN ziet de
// naald tot NAP +81,4 m, 62,5 m boven het wegdek, met nog 1 m breedte). Op de
// voet een ronde barrière van 4,8 m tot 2 m hoog (luchtfoto en overzicht).
const PYLON = { top: 70, foot: 1.1, waist: 1.25, anchors: [54, 57], tip: 0.3 };
const pylon = revolve([
  [0, BASE],
  [2.4, BASE],
  [2.4, 2.0],
  [PYLON.foot, 2.0],
  [PYLON.waist, 25],
  [PYLON.waist, 45],
  [1.15, 57.5],
  [PYLON.tip, PYLON.top],
  [0, PYLON.top],
], 64);

// Tuien: 24 stuks van 50 mm, op 1:1000 als staven van 1,0 m (dwars op de
// staaf) zodat de printer ze als dragende delen maakt; ze lopen van de
// tuiaansluiting in het dek (straal 30,5 m) naar de pyloon op 54 en 57 m, om
// en om, in de richtingen 3 + k·15 graden (luchtfoto). De staven helpen
// 58 tot 60 graden en printen zonder steun vanaf het dek naar de pyloon.
const CABLE = { count: 24, phase: 3, size: 1.0, footZ: DECK_TOP - 0.5, topR: 0.5 };
const cables = [];
for (let k = 0; k < CABLE.count; k++) {
  const angle = CABLE.phase + (360 * k) / CABLE.count;
  const topZ = PYLON.anchors[k % 2];
  const slope = Math.atan2(topZ - CABLE.footZ, RING.anchor - CABLE.topR);
  const radial = CABLE.size / Math.sin(slope) / 2;
  const t = CABLE.size / 2;
  const square = (r, z) => [
    [r - radial, -t, z],
    [r + radial, -t, z],
    [r + radial, t, z],
    [r - radial, t, z],
  ];
  cables.push(
    Manifold.hull([
      ...square(RING.anchor, CABLE.footZ),
      ...square(RING.anchor, CABLE.footZ + 0.05),
      ...square(CABLE.topR, topZ),
      ...square(CABLE.topR, topZ - 0.05),
    ]).rotate([0, 0, angle]),
  );
}

const hovenring = union([ring, arms, pylon, ...cables]);

// ---------- controles ----------
if (hovenring.status() !== "NoError") throw new Error(hovenring.status());
{
  // Vlakken die vlakker dan 45 graden naar beneden wijzen, boven de onderkant:
  // alleen de onderkant van het zwevende dek en de aanbruggen hoort erbij.
  const mesh = hovenring.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let deckArea = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    const minZ = Math.min(...p.map((q) => q[2]));
    const radii = p.map(([x, y]) => Math.hypot(x, y));
    if (minZ < DECK_TOP - 1.4 || Math.min(...radii) < RING.inner - 0.01 || Math.max(...radii) > ARM.end + 0.5) {
      throw new Error(`overhang buiten het dek op z ${minZ.toFixed(2)}, r ${radii[0].toFixed(2)}`);
    }
    deckArea += len / 2;
  }
  console.log("onderkant van dek en aanbruggen (m2):", Math.round(deckArea));
  const bb = hovenring.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`onderkant op ${bb.min[2]}`);
}

// ---------- printvoet (alleen in de STL) ----------
// Het dek zweeft 4,4 m boven het wegdek en hangt aan de tuien, die er pas
// boven beginnen: zonder steun is het niet te printen. Net als de
// overhangopvulling van de export (lib/server/overhang-support.ts) krijgt de
// STL daarom onder het dek een wig van 45 graden die uitloopt in een scherm van
// 1 m tot de onderplaat, onder de ring en onder elke aanbrug.
const footRing = revolve([
  [RING.inner, DECK_TOP - 0.1],
  [31.05, DECK_TOP - 0.1 - (31.05 - RING.inner)],
  [31.05, BASE],
  [32.05, BASE],
  [32.05, DECK_TOP - 0.15 - (RING.outer - 32.05)],
  [RING.outer, DECK_TOP - 0.15],
]);
const armFootLocal = (() => {
  const bottom = (u) => armTop(u) - ARM.depth + 0.05;
  const wedge = Manifold.hull([
    ...armPlan(35.5, ARM.landhoofd).map(([u, w]) => [u, w, bottom(u)]),
    ...[35.5, ARM.landhoofd].flatMap((u) => [
      [u, -0.5, bottom(u) - 4.5],
      [u, 0.5, bottom(u) - 4.5],
    ]),
  ]).intersect(plan(armPlan(35.5, ARM.landhoofd), BASE, 10));
  const screen = plan(
    [
      [35.5, -0.5],
      [ARM.landhoofd + 0.1, -0.5],
      [ARM.landhoofd + 0.1, 0.5],
      [35.5, 0.5],
    ],
    BASE,
    bottom(ARM.landhoofd) - 4.4,
  );
  return union([wedge, screen]);
})();
const printFoot = union([footRing, ...ARM.angles.map((a) => armFootLocal.rotate([0, 0, a]))]);
const printModel = union([hovenring, printFoot]);

// ---------- fietspad als eigen onderdeel ----------
// De bovenste 0,5 m van het dek op het fietspad is een eigen node met de
// attributen van het BGT-wegdeel (glTF `extras.attributes`), zodat de
// kleurregels van een thema (bijvoorbeeld fietspaden rood) op de ring werken
// zoals op de PDOK-wegdelen ernaast. Op het dek ligt één actueel wegdeel met
// relatieve hoogteligging 1: G0772.f20f10c2f74e400291c2f96edb926c62, functie
// fietspad, gesloten verharding (plus_fysiek_voorkomen leeg), de ring van
// straal 31,0 tot 35,45 m en de vier aanbruggen tussen de randstroken (4,45 m
// breed). De binnenrand van het dek (27,15 tot 31,0 m, met de
// tuiaansluitingen; BGT onbegroeid terreindeel) en de randstroken langs de
// buitenrand en de aanbruggen (BGT ondersteunend wegdeel verkeerseiland, met
// het hek) zijn geen wegdeel en blijven constructie; een rijbaan is er niet.
// Contouren in lokale coördinaten (RD min de oorsprong), vereenvoudigd tot
// 5 cm (Douglas-Peucker, elke ring in twee helften). Deze laag wordt pas na de
// printvoet gebouwd: de STL bevat de brug als geheel, zoals voorheen.
const LAYER = 0.5;
const ABOVE = 1.0;
const BIKE_ATTRIBUTES = { bgt_functie: "fietspad", bgt_fysiekvoorkomen: "gesloten verharding" };
const BIKE_PATH = {
  // G0772.f20f10c2f74e400291c2f96edb926c62: buitencontour en het gat binnen de ring.
  outer: [
    [-49.55, -7.14], [-48.76, -11.53], [-37.92, -9.45], [-37.27, -9.39], [-36.6, -9.43], [-35.94, -9.58], [-35.32, -9.84], [-34.78, -10.17],
    [-34.13, -10.78], [-33.62, -11.51], [-32.54, -14.17], [-31.01, -17.26], [-30.4, -18.31], [-28.86, -20.65], [-27.11, -22.9], [-24.93, -25.26],
    [-22.49, -27.45], [-19.84, -29.42], [-17.08, -31.1], [-15.09, -32.11], [-13.16, -32.95], [-11.18, -33.67], [-9.03, -34.31], [-6.49, -34.87],
    [-3.93, -35.25], [-1.63, -35.43], [1.68, -35.5], [2.67, -35.8], [3.59, -36.35], [4.1, -36.83], [4.52, -37.4], [4.83, -38.02],
    [5.04, -38.7], [7.08, -49.48], [7.14, -50.21], [7.08, -50.93], [6.89, -51.63], [6.59, -52.27], [12.92, -51.11], [12.41, -50.62],
    [11.99, -50.05], [11.67, -49.42], [11.48, -48.74], [9.4, -37.93], [9.33, -37.23], [9.38, -36.56], [9.54, -35.9], [9.8, -35.28],
    [10.44, -34.4], [11.26, -33.74], [14.66, -32.32], [17.04, -31.13], [19.55, -29.61], [21.86, -27.95], [23.92, -26.2], [25.82, -24.32],
    [27.59, -22.28], [29.2, -20.09], [30.64, -17.78], [31.96, -15.27], [33.07, -12.66], [33.99, -9.97], [34.72, -7.08], [35.19, -4.38],
    [35.43, -1.63], [35.46, 1.41], [35.76, 2.63], [36.21, 3.45], [36.71, 4.03], [37.32, 4.5], [38, 4.85], [38.71, 5.06],
    [49.45, 7.1], [48.69, 11.5], [37.82, 9.41], [37.22, 9.35], [36.55, 9.39], [35.89, 9.54], [35.31, 9.78], [34.73, 10.14],
    [34.09, 10.73], [33.59, 11.46], [32.49, 14.15], [31.02, 17.11], [30.38, 18.23], [28.83, 20.58], [27.05, 22.86], [24.82, 25.26],
    [22.37, 27.45], [19.71, 29.42], [16.97, 31.08], [14.9, 32.12], [12.93, 32.96], [10.75, 33.74], [8.52, 34.38], [6.08, 34.89],
    [3.67, 35.23], [1.24, 35.41], [-1.77, 35.46], [-2.72, 35.73], [-3.57, 36.22], [-4.4, 37.05], [-4.94, 38.06], [-7.17, 49.54],
    [-11.54, 48.71], [-9.44, 37.78], [-9.39, 36.99], [-9.51, 36.19], [-9.77, 35.46], [-10.18, 34.77], [-10.64, 34.24], [-11.67, 33.53],
    [-15.14, 32.08], [-18.31, 30.38], [-20.5, 28.94], [-22.92, 27.06], [-24.98, 25.17], [-26.89, 23.13], [-29.16, 20.18], [-31.12, 17.01],
    [-32.16, 14.96], [-33.06, 12.84], [-33.79, 10.82], [-34.42, 8.61], [-34.95, 6.14], [-35.3, 3.68], [-35.47, 1.26], [-35.48, -1.43],
    [-35.8, -2.67], [-36.28, -3.51], [-36.77, -4.05], [-37.32, -4.49], [-37.96, -4.84], [-38.63, -5.07],
  ],
  hole: [
    [-31.01, -0.09], [-30.87, 2.96], [-30.45, 5.89], [-29.72, 8.86], [-28.7, 11.74], [-27.48, 14.38], [-25.93, 17.01], [-24.15, 19.45],
    [-22.14, 21.71], [-19.94, 23.75], [-17.55, 25.56], [-14.77, 27.26], [-12.26, 28.48], [-9.47, 29.53], [-6.46, 30.33], [-3.52, 30.81],
    [-0.51, 31], [2.59, 30.9], [5.59, 30.5], [8.53, 29.81], [11.57, 28.77], [14.32, 27.5], [16.93, 25.98], [19.45, 24.14],
    [21.77, 22.08], [23.86, 19.8], [25.7, 17.35], [27.28, 14.73], [28.63, 11.91], [29.64, 9.1], [30.41, 6.05], [30.87, 2.94],
    [31.01, -0.04], [30.86, -3.02], [30.41, -6.04], [29.68, -8.98], [28.66, -11.84], [27.37, -14.59], [25.79, -17.23], [23.96, -19.68],
    [21.95, -21.91], [19.72, -23.93], [17.31, -25.73], [14.59, -27.37], [11.94, -28.62], [9.18, -29.62], [6.11, -30.41], [2.97, -30.87],
    [0.04, -31.01], [-3.13, -30.86], [-6.05, -30.42], [-8.95, -29.7], [-11.89, -28.65], [-14.71, -27.3], [-17.26, -25.76], [-19.67, -23.98],
    [-21.9, -21.96], [-23.92, -19.74], [-25.74, -17.31], [-27.31, -14.7], [-28.6, -11.99], [-29.64, -9.12], [-30.4, -6.16], [-30.85, -3.14],
  ],
};
// Snijstrook van 0,5 m onder tot 1 m boven het wegdek, over het hele dek:
// de ring als omwentelingslichaam, de aanbruggen langs hun dalende wegdek.
// Zo snijdt hij het hele bovenvlak uit de constructie en houdt die op het
// fietspad geen vlak zonder dikte over dat met het wegdek vecht.
const ringBand = revolve([
  [RING.inner - 0.2, DECK_TOP - LAYER],
  [RING.outer + 0.2, DECK_TOP - LAYER],
  [RING.outer + 0.2, DECK_TOP + ABOVE],
  [RING.inner - 0.2, DECK_TOP + ABOVE],
]);
const armBandLocal = plan(
  [
    [33, -5.5],
    [ARM.end + 0.5, -5.5],
    [ARM.end + 0.5, 5.5],
    [33, 5.5],
  ],
  BASE,
  DECK_TOP + ABOVE + 1,
).intersect(
  profileY(
    [
      [33, DECK_TOP - LAYER],
      [36, DECK_TOP - LAYER],
      [ARM.end + 0.5, armTop(ARM.end + 0.5) - LAYER],
      [ARM.end + 0.5, armTop(ARM.end + 0.5) + ABOVE],
      [36, DECK_TOP + ABOVE],
      [33, DECK_TOP + ABOVE],
    ],
    -6,
    6,
  ),
);
// Naar de buitenrand wordt het dek dunner dan 0,5 m (de onderplaat loopt van
// 0,7 m bij straal 31 m naar 0,28 m bij 35,5 m). Een strook die daar op 0,5 m
// onder het wegdek ophield, liet van de constructie een wig zonder dikte over
// waar hij de onderplaat kruist (straal 33,14 m). Vanaf straal 32,6 m, waar de
// constructie onder de strook nog 5 cm dik is, gaat de strook daarom door het
// hele dek: het fietspad is daar het dek zelf. Niet onder de aanbruggen, die
// 0,6 m dik zijn.
const ringDeep = revolve([
  [32.6, DECK_TOP - 2 * ABOVE],
  [RING.outer + 0.2, DECK_TOP - 2 * ABOVE],
  [RING.outer + 0.2, DECK_TOP + ABOVE],
  [32.6, DECK_TOP + ABOVE],
]).subtract(union(ARM.angles.map((a) => plan(armPlan(), BASE, 10).rotate([0, 0, a]))));
const deckBand = union([ringBand, ringDeep, ...ARM.angles.map((a) => armBandLocal.rotate([0, 0, a]))]);
// De tuien steken door het dek en blijven constructie, met 2 cm vrij.
const GUARD = 0.02;
const cableGuards = [];
for (let k = 0; k < CABLE.count; k++) {
  const angle = CABLE.phase + (360 * k) / CABLE.count;
  const topZ = PYLON.anchors[k % 2];
  const slope = Math.atan2(topZ - CABLE.footZ, RING.anchor - CABLE.topR);
  const radial = (CABLE.size / 2 + GUARD) / Math.sin(slope);
  const t = CABLE.size / 2 + GUARD;
  const square = (r, z) => [
    [r - radial, -t, z],
    [r + radial, -t, z],
    [r + radial, t, z],
    [r - radial, t, z],
  ];
  cableGuards.push(
    Manifold.hull([...square(RING.anchor, CABLE.footZ - GUARD), ...square(CABLE.topR, topZ + GUARD)]).rotate([0, 0, angle]),
  );
}
const bikePath = plan(BIKE_PATH.outer, BASE, 100).subtract(plan(BIKE_PATH.hole, BASE - 1, 101));
const bikeCut = deckBand.subtract(union(cableGuards)).intersect(bikePath);
const bikeway = bikeCut.intersect(hovenring);
const structure = hovenring.subtract(bikeCut);
const parts = [
  ["building:hovenring", structure],
  ["road:fietspad", bikeway, BIKE_ATTRIBUTES],
];
{
  // De onderdelen vormen samen precies de brug: geen overlap en niets kwijt.
  const whole = hovenring.volume();
  const sum = parts.reduce((total, [, solid]) => total + solid.volume(), 0);
  console.log(
    "volumes (m3):",
    parts.map(([name, solid]) => `${name} ${solid.volume().toFixed(3)}`).join(", "),
    `som ${sum.toFixed(3)}, brug ${whole.toFixed(3)}`,
  );
  if (Math.abs(sum - whole) > 1e-6 * whole + 1e-3) throw new Error(`volumes tellen niet op: ${sum} tegen ${whole}`);
  for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
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
    volumeM3: Math.round(solid.volume()),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "hovenring.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-hovenring.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL staat met de onderkant van pyloon, landhoofden en printvoet op het
// printbed.
const stlName = `hovenring-1-${scale}.stl`;
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint Hovenring Eindhoven 1:${scale} mm Z-up`);
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

// Catalogusitem voor lib/server/landmark-catalog.ts. Oorsprong: hart van de
// ring (BGT) op het verdiepte wegdek; assen van RD.
const sampleAngles = [55.7, 145.7, 235.7, 325.7];
await writeFile(
  path.join(outDir, "hovenring.json"),
  JSON.stringify(
    {
      name: "Hovenring",
      file: "hovenring.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [157232.38, 382695.58],
      xAxis: [1, 0],
      groundOffsetMetres: 0,
      // Op het verdiepte kruispunt onder de ring, tussen de aanbruggen; niet
      // op de taluds en hellingbanen rond de landhoofden (tot 5,5 m hoger).
      groundSamplePoints: sampleAngles.map((a) => [
        +(20 * Math.cos((a * Math.PI) / 180)).toFixed(2),
        +(20 * Math.sin((a * Math.PI) / 180)).toFixed(2),
      ]),
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (157232,38, 382695,58), in het hart van de ring aan de voet van de pyloon, op het verdiepte wegdek onder de ring (NAP +18,9 m), +X naar het oosten en +Y naar het noorden. Twee nodes: road:fietspad, de bovenste 0,5 m van het dek op het BGT-fietspad (ring van straal 31,0 tot 35,45 m en de vier aanbruggen, buiten straal 32,6 m het hele dek waar dat dunner is dan 0,5 m) met de attributen van het BGT-wegdeel in extras.attributes (bgt_functie fietspad, bgt_fysiekvoorkomen gesloten verharding), zodat de kleurregels van een thema erop werken; en building: de rest, met de binnenrand van het dek en de randstroken die geen wegdeel zijn. Samen: het ringvormige dek (binnenstraal 27,15 m, buitenstraal 36 m, fietspad op +5,75 m, NAP +24,65 m) met een onderkant die naar binnen toe van 0,2 tot 1,33 m dik wordt, vier aanbruggen van 5,45 m breed naar de landhoofden op 50 m uit het hart in de richtingen 10,7 + k·90 graden, de pyloon van 70 m met een ronde barrière aan de voet, en 24 tuien als staven van 1 m naar de pyloon op 54 en 57 m. Het dek zweeft 4,4 m boven het wegdek; de export vult daaronder een wig van 45 graden met een smal scherm tot de onderplaat op, de STL heeft dezelfde printvoet. Leuningen, het lamellenvlak, de M-vormige steunpunten en de trillingsdempers zijn weggelaten. Geen BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        ringOuterDiameterM: RING.outer * 2,
        ringInnerDiameterM: RING.inner * 2,
        deckWidthM: +(RING.outer - RING.inner).toFixed(2),
        deckNapM: 24.65,
        clearanceM: +(DECK_TOP - 1.33).toFixed(2),
        armWidthM: ARM.halfWidth * 2,
        armEndRadiusM: ARM.end,
        pylonHeightM: PYLON.top,
        cableAnchorHeightsM: PYLON.anchors,
        cables: CABLE.count,
        groundNapM: GROUND_NAP,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Hovenring",
        "https://en.wikipedia.org/wiki/Hovenring",
        "Infosteel, Staalbouwwedstrijd 2012, laureaat categorie E: Fietsrotonde Hovenring in Eindhoven (dwarsdoorsnede van het dek, overzicht met pyloon, tuien, aanbruggen en landhoofden)",
        "PDOK BGT overbruggingsdeel (dek: ring en vier aanbruggen), EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dek, aanbruggen, wegdek onder de ring, pyloon",
        "PDOK luchtfoto (Actueel_orthoHR) voor de richtingen van de tuien en de barrière rond de pyloon",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

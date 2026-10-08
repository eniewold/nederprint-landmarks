// Genereert een gesloten 3D-model van de Cunerakerk in Rhenen uit dakvlakken en
// bouwdelen: een laatgotische hallenkerk met een middenschip onder een
// langsdak (nok +21,1 m, 60 graden), zijbeuken onder dwarsdaken per travee
// (goot +14,7 m, 55 graden, schilden tegen de gevels), een dwarsschip met
// topgevels, een koor met driezijdige sluiting, steunberen met pinakels, een
// dakruiter op de viering, kleine aanbouwen en de Cuneratoren in het westen
// (81,8 m): twee vierkante geledingen met hoekpinakels en diagonale steunberen,
// een achtkantige lantaarn en een naaldspits. Elk dak is een vlak z = a u + b v
// + c uit het AHN en de LoD2.2-vlakken van de 3D BAG; de bouwdelen staan
// op de BAG-contouren van de kerk en de toren. Het Mapbox-model is niet
// gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-cunerakerk.mjs              # 1:1000 (standaard)
//   node scripts/generate-cunerakerk.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (167186,79, 440957,91), het gezamenlijke
// zwaartepunt van kerk en toren, op het maaiveld aan de zuidzijde (NAP +11,5
// m), Z omhoog. +X loopt langs de as van het schip naar het oosten (5,75 graden
// met de klok mee vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden.
// De toren staat aan de westkant (u -29,4 tot -16,9 m, v -5,5 tot +7,2 m).
//
// Bronnen: PDOK BAG-panden 0340100000331050 (de kerk) en 0340100000332237 (de
// toren); AHN DSM/DTM 0,5 m (PDOK WCS) voor nokken, goten en het maaiveld
// (NAP +11,5 m aan de zuidzijde, +13,5 m aan de noordzijde); 3D BAG LoD2.2
// (api.3dbag.nl) voor de hellingen en de dakvlakken op de leien daken, waar het
// DSM gaten heeft; Wikipedia; PDOK luchtfoto. Geschat zijn de aanbouwen, de
// steunberen en pinakels, de vensternissen en de profielen van de toren
// boven +45 m (het AHN geeft de naaldspits te laag omdat die dun is). Weggelaten:
// vensters onder 0,9 m, maaswerk en alle gevelreliëf.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "cunerakerk");
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

const SLUG = "cunerakerk";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP 11,5 m) ----------
const GROUND_NAP = 11.5;
const ORIGIN = [167186.79, 440957.91];
const X_AXIS = [0.994969, -0.100188]; // RD-richting -5,75 graden, langs de as van het schip
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;

// Hoogten boven het maaiveld (NAP -11,5 m) en hellingen.
const T60 = Math.tan((60 * Math.PI) / 180); // schip, dwarsschip en koor (LoD2.2: 59,6 tot 60,1 graden)
const T55 = 1.44; // zijbeuken (LoD2.2: 54,7 tot 55,5 graden)
const RIDGE = 21.1; // nok van schip, dwarsschip en koor (NAP +32,6 m)
const GUT = 14.7; // dalgoot tussen de dwarsdaken van de zijbeuken (NAP +26,2 m)
const GUTTER = 0.8; // breedte van de goot langs de buitengevel van de zijbeuken
const SOUTH = -16.4; // zuidgevel van de zijbeuk
const NORTH = 13.4; // noordgevel van de zijbeuk
const AX = 0.26; // as van het schip en het koor (nok)

// Dwarsdaken van de zijbeuken: [u van de nok, nokhoogte]. De nok loopt langs v, de beide
// zijden dalen met T55 naar de goot; tegen de buitengevel een schild. De nokken liggen aan
// beide kanten van het schip op dezelfde u.
const BAYS = [[-13.2, 18.4], [-6.28, 19.9], [2.6, RIDGE]];
const AISLE_U0 = -17.1;
const AISLE_U1 = 7.84;
// Dwarsschip: nok langs v op u = 11,5, topgevels op v = -16,4 en +17,3.
const TRANSEPT = { u0: 7.6, u1: 16.15, ridge: 11.5, v0: SOUTH, v1: 17.3 };
// Koor: de dakvlakken van het schip lopen door; driezijdige sluiting in het oosten.
const CHOIR_S = AX - 4.61;
const CHOIR_N = AX + 4.61;
const APSE_EAVE = 14.2; // goot van de sluiting (NAP +25,7 m)
const APSE = [[27.3, CHOIR_S], [29.8, AX - 1.4], [29.8, AX + 1.4], [27.3, CHOIR_N]];
// De toren: onderbouw en tweede geleding; de lantaarn en de spits liggen op de torenas TC.
const TOWER = { u0: -29.35, u1: -16.9, v0: -5.5, v1: 7.2 };
const TC = [-23.1, 0.75];

// Maaiveld (AHN NAP +11,5 tot +11,8 m aan de zuidzijde; de noordzijde ligt 2 m hoger) rond het gebouw.
const GROUND_SAMPLES = [[-10, -20], [5, -20], [20, -20], [-30, -12]];

// ---------- gebouw ----------
const solids = [];

// Zijbeuken: de voet met een dalgoot op GUT en dwarsdaken met schilden tegen de buitengevel.
for (const side of [-1, 1]) {
  const wall = side < 0 ? SOUTH : NORTH;
  const inner = side < 0 ? -3.3 : 3.3;
  // Voet: de muren tot de goot op GUT; langs de gevel en tussen de dwarsdaken ligt een vlakke goot.
  solids.push(prism(rect(AISLE_U0, AISLE_U1, Math.min(wall, inner), Math.max(wall, inner)), BASE, GUT));
  for (const [ur, zr] of BAYS) {
    const h = (zr - GUT) / T55 + 0.3;
    // Schild tegen de buitengevel: het vlak rijst vanaf de rand van de goot.
    const hip = side < 0 ? [0, T55, GUT - T55 * (SOUTH + GUTTER)] : [0, -T55, GUT + T55 * (NORTH - GUTTER)];
    const v0 = side < 0 ? SOUTH : AX;
    const v1 = side < 0 ? AX : NORTH;
    solids.push(roofed(rect(ur - h, ur + h, v0, v1), [...ridgeU(ur, zr, T55), hip]));
  }
  // Steunberen op de dalgoten van de dwarsdaken en op de hoeken.
  const angle = side < 0 ? 0 : 180;
  for (const u of [-10.25, -2.25, 7.25]) {
    const bx = buttress([u, wall], angle, 1.1, 1.8, 14.2, 12.7);
    solids.push(bx, pinnacle([u, wall + side * 0.55], 0.5, 14.0, 1.6, 1.8));
  }
}
// Hoeksteunberen van de zuidwesthoek en van het dwarsschip.
solids.push(buttress([-16.3, SOUTH], 0, 1.2, 1.8, 14.2, 12.7));
solids.push(buttress([15.5, SOUTH], 0, 1.2, 1.6, 13.8, 12.4));
// Steunberen tegen de westgevel van de zuidbeuk.
solids.push(buttress([AISLE_U0, -9.85], 270, 1.1, 1.7, 14.2, 12.7), buttress([AISLE_U0, -15.5], 270, 1.1, 1.7, 14.2, 12.7));

// Zuidportaal: een portaal met een zadeldak langs v (nok +7,8 m) tegen de eerste travee.
solids.push(roofed(rect(-15.7, -10.9, -18.8, SOUTH + 0.2), ridgeU(-13.3, 7.8, T60)));

// Middenschip en koor: een langsdak met nok op v = 0,26 (60 graden) van de toren tot de sluiting.
const longRoof = roofed(
  [[-18.0, CHOIR_S], ...APSE, [-18.0, CHOIR_N]],
  [
    ...ridgeV(AX, RIDGE, T60),
    facet(APSE[0], APSE[1], APSE_EAVE, T60, [20, AX]),
    facet(APSE[1], APSE[2], APSE_EAVE, T60, [20, AX]),
    facet(APSE[2], APSE[3], APSE_EAVE, T60, [20, AX]),
  ],
);
solids.push(longRoof);

// Dwarsschip met topgevels.
solids.push(roofed(rect(TRANSEPT.u0, TRANSEPT.u1, TRANSEPT.v0, TRANSEPT.v1), ridgeU(TRANSEPT.ridge, RIDGE, T60)));
// De oostzijde van het dwarsschip loopt langs het koor tot 17,4 m door (dakvlak tot de goot op +10,9 m).
solids.push(roofed(rect(TRANSEPT.u1 - 0.15, 17.4, -12.0, CHOIR_S + 0.2), ridgeU(TRANSEPT.ridge, RIDGE, T60)));

// Dakruiter op de viering: achtkant met een naaldspits.
solids.push(
  loft([
    [18.0, oct([TRANSEPT.ridge, AX], 4.0)],
    [22.5, oct([TRANSEPT.ridge, AX], 3.0)],
    [24.0, oct([TRANSEPT.ridge, AX], 2.4)],
    [29.0, tip([TRANSEPT.ridge, AX])],
  ]),
);

// Steunberen van het koor en van de sluiting.
solids.push(buttress([23.65, CHOIR_S], 0, 1.1, 0.9, 11.8, 10.9));
solids.push(buttress([27.5, CHOIR_S], 0, 1.0, 1.0, 11.8, 10.9));
solids.push(buttress([27.5, CHOIR_N], 180, 1.0, 1.3, 11.8, 10.9));
solids.push(buttress([29.8, AX - 1.4], 90, 1.1, 1.1, 11.8, 10.9), buttress([29.8, AX + 1.4], 90, 1.1, 1.1, 11.8, 10.9));

// Zuidoostaanbouw (sacristie): zadeldak langs u, nok +6,8 m, en een bijgebouwtje ervoor.
solids.push(roofed(rect(16.0, 23.1, -9.7, CHOIR_S + 0.2), ridgeV(-7.15, 6.8, 1.4)));
solids.push(roofed(rect(16.0, 20.5, -12.0, -9.5), ridgeU(18.25, 5.2, 1.4)));
// Noordoostaanbouw met een zadeldak langs u (nok +13,4 m) en een trapspil met een achtkantig spitsdak.
solids.push(
  roofed(
    [[16.0, CHOIR_N - 0.2], [22.9, CHOIR_N - 0.2], [22.9, 10.4], [19.8, 10.4], [19.6, 11.8], [18.3, 13.1], [16.0, 13.3]],
    ridgeV(6.85, 13.4, T60),
  ),
);
solids.push(
  loft([
    [BASE, oct([23.7, 5.9], 3.2)],
    [13.0, oct([23.7, 5.9], 3.2)],
    [17.7, tip([23.7, 5.9])],
  ]),
);
// Trapspil in de noordwesthoek tegen de toren: lessenaarsdak naar het noorden.
solids.push(roofed(rect(-18.9, AISLE_U0 + 0.6, 10.2, NORTH), [[0, -T55, GUT + T55 * (NORTH - GUTTER)]]));

// De Cuneratoren.
const towerBody = prism(rect(TOWER.u0, TOWER.u1, TOWER.v0, TOWER.v1), BASE, 22.5);
const stage2 = prism(rect(-28.9, -17.3, -4.8, 6.3), 22.4, 44.7);
solids.push(towerBody, stage2);
// Diagonale hoeksteunberen, op de geledingen teruggetrapt.
for (const [cx, cy] of [
  [TOWER.u0, TOWER.v0],
  [TOWER.u0, TOWER.v1],
  [TOWER.u1, TOWER.v0],
  [TOWER.u1, TOWER.v1],
]) {
  solids.push(
    loft([
      [BASE, diamond([cx, cy], 1.55)],
      [4.0, diamond([cx, cy], 1.55)],
      [4.8, diamond([cx, cy], 1.35)],
      [10.0, diamond([cx, cy], 1.35)],
      [10.8, diamond([cx, cy], 1.1)],
      [18.0, diamond([cx, cy], 1.1)],
      [18.8, diamond([cx, cy], 0.9)],
      [24.0, diamond([cx, cy], 0.9)],
      [29.5, tip([cx, cy])],
    ]),
  );
}
// Hoekpinakels op de tweede geleding.
for (const [cx, cy] of [
  [-28.15, -4.05],
  [-28.15, 5.55],
  [-18.05, -4.05],
  [-18.05, 5.55],
]) {
  solids.push(pinnacle([cx, cy], 0.75, 44.6, 3.8, 3.8));
}
// Achtkantige lantaarn (twee geledingen) en de naaldspits.
solids.push(
  loft([
    [44.6, oct(TC, 10.0)],
    [54.0, oct(TC, 10.0)],
    [54.9, oct(TC, 9.0)],
    [62.0, oct(TC, 9.0)],
    [62.8, oct(TC, 8.5)],
    [68.0, oct(TC, 5.0)],
    [72.0, oct(TC, 2.8)],
    [76.0, oct(TC, 1.5)],
    [81.8, oct(TC, 0.9)],
  ]),
);

let complex = Manifold.union(solids);
// Vensternissen: spitsbogen in de torengeleding, de lantaarn en de gevels van de kerk.
const cuts = [];
const T2 = TC;
for (const s of [-3.4, 0, 3.4]) {
  cuts.push(niche(T2, 270, 5.55, s, 1.4, 27, 38.5), niche(T2, 90, 5.55, s, 1.4, 27, 38.5));
}
for (const s of [-3.6, 0, 3.6]) {
  cuts.push(niche(T2, 180, 5.8, s, 1.4, 27, 38.5), niche(T2, 0, 5.8, s, 1.4, 27, 38.5));
}
cuts.push(niche([TC[0], 0.85], 270, 6.35, 0, 3.0, 9.0, 15.0), niche([TC[0], 0.85], 90, 6.35, 0, 3.0, 9.0, 15.0));
for (let k = 0; k < 8; k += 2) cuts.push(niche(TC, 45 * k, 5.0, 0, 2.6, 46.5, 51.5));
for (let k = 0; k < 8; k++) cuts.push(niche(TC, 45 * k, 4.5, 0, 1.4, 56.0, 59.5));
// Gevels van de kerk: een venster per travee en in de topgevels van het dwarsschip.
for (const u of [-6.28, 2.6]) cuts.push(niche([u, 0], 270, 16.4, 0, 2.2, 4.5, 10.0), niche([u, 0], 90, 13.4, 0, 2.2, 4.5, 10.0));
cuts.push(niche([TRANSEPT.ridge, 0], 270, 16.4, 0, 2.4, 5.0, 11.5), niche([TRANSEPT.ridge, 0], 90, 17.3, 0, 2.4, 5.0, 11.5));
// Koor en sluiting: een venster in de zuidmuur en in elk van de drie zijden van de sluiting.
cuts.push(niche([25.5, 0], 270, -CHOIR_S, 0, 1.6, 3.5, 9.0));
cuts.push(niche([APSE[1][0], AX], 0, 0, 0, 1.4, 3.5, 9.0, 0.9));
cuts.push(
  niche([(APSE[0][0] + APSE[1][0]) / 2, (APSE[0][1] + APSE[1][1]) / 2], -37.9, 0, 0, 1.4, 3.5, 9.0),
  niche([(APSE[2][0] + APSE[3][0]) / 2, (APSE[2][1] + APSE[3][1]) / 2], 37.9, 0, 0, 1.4, 3.5, 9.0),
);
complex = complex.subtract(Manifold.union(cuts));

const nodes = [["building:kerk", complex]];
const all = complex;

const META = {
  name: "Cunerakerk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: ["0340100000331050", "0340100000332237"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (167186,79, 440957,91), het gezamenlijke zwaartepunt van de kerk en de toren, op het maaiveld aan de zuidzijde (NAP +11,5 m), +X langs de as van het schip naar het oosten (-5,75 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden. Een node building:kerk uit dakvlakken en bouwdelen: een middenschip met nok op +21,1 m (60 graden), zijbeuken met dwarsdaken per travee (goot +14,7 m, 55 graden), een dwarsschip met topgevels, een koor met driezijdige sluiting, steunberen met pinakels, een dakruiter, aanbouwen en de Cuneratoren in het westen (twee vierkante geledingen met diagonale steunberen en hoekpinakels, een achtkantige lantaarn en een naaldspits tot +81,8 m). Onderkant op 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van de kerk en de toren. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { naveRidgeM: RIDGE, aisleGutterM: GUT, towerTopM: 81.8, groundNapM: 11.5, baseM: -0.5 },
  sources: [
    "https://nl.wikipedia.org/wiki/Cunerakerk_%28Rhenen%29",
    "PDOK BAG panden 0340100000331050 (kerk) en 0340100000332237 (toren), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, goten en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en dakvlakken",
    "PDOK luchtfoto (Actueel_orthoHR)",
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

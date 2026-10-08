// Genereert een gesloten 3D-model van de Peperbus (Onze-Lieve-Vrouwetoren) in
// Zwolle met de Onze-Lieve-Vrouwebasiliek die in hetzelfde BAG-pand ligt, uit
// dakvlakken en bouwdelen. De toren: een vierkante onderbouw van 12,7 m in drie
// geledingen met telkens een teruggezette waterlijst en blinde spitsbogen, de
// eerste omgang op +52 m met een borstwering en hoekpinakels, een achtkant met
// galmgaten tot de tweede omgang op +65 m, en de koepel (de peperbus) met een
// lantaarn en een bol tot +75 m. De kerk: schip, dwarsschip en koor onder één nok
// (+28,5 m, 55 graden) met kilgoten in een kruis, topgevels aan het dwarsschip,
// een koor met een 3/8-sluiting, steunberen en lage kapellen naast het koor.
// Elk dak is een vlak z = a u + b v + c uit het AHN en de LoD2.2-vlakken van de
// 3D BAG; de toren is een omhullende per hoogte uit het AHN. Het Mapbox-model is
// niet gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-peperbus.mjs              # 1:1000 (standaard)
//   node scripts/generate-peperbus.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (202696, 502952), het midden van de toren, op
// het maaiveld (NAP +2,9 m), Z omhoog. +X loopt van de toren langs de nok van de
// kerk naar het koor (20 graden rechtsom vanaf de RD-X-as) en +Y loodrecht
// daarop; het koor eindigt op u = 66,5 m.
//
// Bronnen: PDOK BAG-pand 0193100000000171 (toren en basiliek); AHN DSM/DTM 0,5 m
// (PDOK WCS) voor de geledingen en de koepel van de toren, de nokken en het
// maaiveld; 3D BAG LoD2.2 (api.3dbag.nl) voor hellingen en richting; Wikipedia
// (75 m, omgangen op 51 en 65 m); PDOK luchtfoto; foto's op Wikimedia Commons.
// Geschat zijn de hoogtes van de waterlijsten, het profiel van de koepel tussen
// de AHN-punten, de lantaarn en de bol, de steunberen, de kapellen en de nissen.
// Weggelaten: de balustrades (dicht), de wijzerplaten, het maaswerk en de
// banden van witte natuursteen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "peperbus");
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
// Regelmatige veelhoek: hoekpunten op de hoeken angs (graden) rond c, voor een veelhoek met apothema apo en zijdehoek step.
const ngon = (c, apo, angs, step) =>
  angs.map((a) => {
    const r = apo / Math.cos(((step / 2) * Math.PI) / 180);
    return [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  });
// Dakvlak boven een gevel met de normaal naar phi (graden) op apothema apo rond c: goot z0, helling t naar binnen.
const facetPhi = (c, phi, apo, z0, t) => {
  const cp = Math.cos((phi * Math.PI) / 180);
  const sp = Math.sin((phi * Math.PI) / 180);
  return [-t * cp, -t * sp, z0 + t * apo + t * (c[0] * cp + c[1] * sp)];
};
// Doorsnede van een of meer veelhoeken en een rand (borstwering) van breedte w langs de omtrek, van z0 tot z1.
const section = (...polys) => CrossSection.union(polys.map((p) => new CrossSection([ccw(p)])));
const band = (cs, w, z0, z1) => Manifold.extrude(cs.subtract(cs.offset(-w, "Miter")), z1 - z0).translate([0, 0, z0]);
// Pinakel op een steunbeer die tot de onderkant doorloopt: vierkante schacht tot z1 en een piramide.
const pier = (c, half, z1, point) => loft([[BASE, sq(c, half)], [z1, sq(c, half)], [z1 + point, tip(c)]]);

const SLUG = "peperbus";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +2,9 m) ----------
const GROUND_NAP = 2.93;
const ORIGIN = [202696.0, 502952.0];
const X_AXIS = [0.939693, -0.34202]; // RD-richting -20 graden, van de toren langs de nok naar het koor
const BASE = -0.5;

// Kerk: schip, dwarsschip en koor onder één nok (+28,5 m, 55 graden).
const T = 1.45;
const RIDGE = 28.5;
const RV = 0.4; // as van schip en koor
const NAVE = { u0: 5.9, u1: 39.4, v0: -5.8, v1: 6.6 };
const NAVE_HW = (NAVE.v1 - NAVE.v0) / 2;
const TR = { u0: 39.2, u1: 50.0, v0: -12.7, v1: 13.8, ridge: 44.6 };
// Koor met een 3/8-sluiting rond AC.
const CHOIR_HW = 5.4;
const AC = [60.4, 0.5];
const PHIS = [-90, -45, 0, 45, 90];
const apsePoly = (c, apo, phis) =>
  phis.slice(1).map((p, i) => {
    const a = ((p + phis[i]) / 2) * (Math.PI / 180);
    const r = apo / Math.cos(((p - phis[i]) / 2) * (Math.PI / 180));
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  });

// De Peperbus: vierkante onderbouw van 12,4 m tot de eerste omgang (+52 m), een achtkant met de tweede
// omgang (+65 m), een koepel en een lantaarn tot +75 m.
const TC = [-0.1, 0.4];
const TOWER_HALF = 6.05;
const GALLERY1 = 52.0;
const OCT = 9.8; // achtkant over de vlakke zijden
const GALLERY2 = 65.0;

// Maaiveld (AHN NAP +2,9 tot +3,2 m) rond toren en kerk.
const GROUND_SAMPLES = [[-12, 0], [0, -12], [30, -12], [72, 0]];

// ---------- kerk ----------
const solids = [];
const eaveAt = (hw) => RIDGE - T * hw;
// Schip met de nok op v = 0,4 m, door de viering tot het koor (kilgoten in een kruis met het dwarsschip).
solids.push(roofed(rect(NAVE.u0, TR.u1, NAVE.v0, NAVE.v1), ridgeV(RV, RIDGE, T)));
// Dwarsschip met de nok langs v op u = 44,6 m en topgevels naar noord en zuid.
solids.push(roofed(rect(TR.u0, TR.u1, TR.v0, TR.v1), ridgeU(TR.ridge, RIDGE, T)));
for (const [v0, v1] of [[TR.v0, TR.v0 + 0.9], [TR.v1 - 0.9, TR.v1]]) {
  solids.push(roofed(rect(TR.u0, TR.u1, v0, v1), ridgeU(TR.ridge, RIDGE + 0.8, T)));
}
// Koor met de 3/8-sluiting.
const choir = [[TR.u1 - 0.1, AC[1] - CHOIR_HW], ...apsePoly(AC, CHOIR_HW, PHIS), [TR.u1 - 0.1, AC[1] + CHOIR_HW]];
solids.push(roofed(choir, PHIS.map((p) => facetPhi(AC, p, CHOIR_HW, eaveAt(CHOIR_HW), T))));
// Steunberen: langs het schip, op de hoeken van het dwarsschip (diagonaal) en rond de sluiting.
for (const u of [12.95, 19.6, 26.35, 33.05]) {
  solids.push(buttress([u, NAVE.v0], 0, 1.1, 1.5, 14.0, 12.4));
  solids.push(buttress([u, NAVE.v1], 180, 1.1, 1.5, 14.0, 12.4));
}
for (const [u, v] of [[TR.u0, TR.v0], [TR.u1, TR.v0], [TR.u0, TR.v1], [TR.u1, TR.v1]]) {
  solids.push(loft([[BASE, diamond([u, v], 1.3)], [12.0, diamond([u, v], 1.3)], [13.0, diamond([u, v], 1.0)], [18.5, diamond([u, v], 1.0)], [21.0, tip([u, v])]]));
}
for (const c of apsePoly(AC, CHOIR_HW + 0.2, PHIS)) solids.push(pier(c, 0.55, 15.5, 1.5));
// Lage kapellen naast het koor met een zadeldak langs het koor.
solids.push(roofed(rect(TR.u1 - 0.1, 60.1, AC[1] + CHOIR_HW - 0.1, 13.0), ridgeV(9.2, 9.5, 1.0)));
solids.push(roofed(rect(TR.u1 - 0.1, 60.1, -12.2, AC[1] - CHOIR_HW + 0.1), ridgeV(-9.0, 8.8, 1.0)));

// ---------- de Peperbus ----------
// Onderbouw in drie geledingen, telkens 0,15 m teruggezet op een schuine waterlijst.
const STAGES = [[BASE, 18.6, 6.35], [18.9, 34.8, 6.2], [35.1, GALLERY1, TOWER_HALF]];
solids.push(
  loft([
    [BASE, sq(TC, 6.35)],
    [18.6, sq(TC, 6.35)],
    [18.9, sq(TC, 6.2)],
    [34.8, sq(TC, 6.2)],
    [35.1, sq(TC, TOWER_HALF)],
    [GALLERY1, sq(TC, TOWER_HALF)],
  ]),
);
// Eerste omgang: borstwering van 0,8 m met witte hoekpinakels.
solids.push(band(section(sq(TC, TOWER_HALF)), 0.8, GALLERY1 - 1, GALLERY1 + 1.3));
for (const [du, dv] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
  solids.push(pinnacle([TC[0] + du * (TOWER_HALF - 0.4), TC[1] + dv * (TOWER_HALF - 0.4)], 0.4, GALLERY1 + 1.2, 1.0, 1.4));
}
// Achtkant tot de tweede omgang, met een kroonlijst op een kraag en een borstwering.
solids.push(
  loft([
    [GALLERY1 - 0.5, oct(TC, OCT)],
    [GALLERY2 - 0.6, oct(TC, OCT)],
    [GALLERY2 - 0.2, oct(TC, OCT + 0.6)],
    [GALLERY2, oct(TC, OCT + 0.6)],
  ]),
);
{
  const ring = Manifold.extrude(new CrossSection([oct(TC, OCT + 0.6)]).subtract(new CrossSection([oct(TC, OCT - 1.0)])), 1.2).translate([0, 0, GALLERY2 - 0.1]);
  solids.push(ring);
}
// Koepel (de peperbus) met een lantaarn en een bol tot +75 m.
solids.push(
  loft([
    [GALLERY2 - 0.5, oct(TC, 9.6)],
    [66.2, oct(TC, 9.4)],
    [67.4, oct(TC, 8.2)],
    [68.8, oct(TC, 6.4)],
    [70.0, oct(TC, 4.8)],
    [70.9, oct(TC, 2.8)],
    [71.2, oct(TC, 1.8)],
    [73.0, oct(TC, 1.8)],
    [73.3, oct(TC, 1.2)],
    [74.2, oct(TC, 1.2)],
    [75.0, oct(TC, 0.9)],
  ]),
);

let church = Manifold.union(solids);

// Vensternissen, blinde spitsbogen en galmgaten.
const cuts = [];
for (const u of [9.4, 16.3, 23.0, 29.7, 36.2]) {
  cuts.push(niche([u, 0], 270, -NAVE.v0, 0, 2.8, 3.0, 13.5, 0.5), niche([u, 0], 90, NAVE.v1, 0, 2.8, 3.0, 13.5, 0.5));
}
for (const u of [41.9, 47.3]) {
  cuts.push(niche([u, 0], 270, -TR.v0, 0, 2.6, 4.0, 15.5, 0.5), niche([u, 0], 90, TR.v1, 0, 2.6, 4.0, 15.5, 0.5));
}
cuts.push(niche([TR.ridge, 0], 270, -TR.v0, 0, 2.2, 19.0, 23.0, 0.5), niche([TR.ridge, 0], 90, TR.v1, 0, 2.2, 19.0, 23.0, 0.5));
for (const phi of [-45, 0, 45]) cuts.push(niche(AC, phi, CHOIR_HW, 0, 2.4, 10.0, 18.0, 0.5));
// Toren: drie blinde spitsbogen per zijde in elke geleding, galmgaten in de bovenste, waterlijsten.
for (const ang of [0, 90, 180, 270]) {
  for (const s of [-3.6, 0, 3.6]) {
    if (ang !== 0) {
      cuts.push(niche(TC, ang, STAGES[0][2], s, 1.6, 3.0, 15.5, 0.4));
      cuts.push(niche(TC, ang, STAGES[1][2], s, 1.6, 21.0, 31.5, 0.4));
    }
    cuts.push(niche(TC, ang, STAGES[2][2], s, 1.6, 37.0, 47.5, s === 0 ? 0.4 : 0.8));
  }
}
// Achtkant: galmgaten op de vier hoofdzijden.
for (const ang of [0, 90, 180, 270]) cuts.push(niche(TC, ang, OCT / 2, 0, 1.8, 54.0, 60.0, 0.5));
church = church.subtract(Manifold.union(cuts));

const nodes = [["building:kerk", church]];
const all = church;

const META = {
  name: "Peperbus",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 45.58,
  replacesBuildings: ["0193100000000171"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (202696, 502952), het midden van de toren, op het maaiveld (NAP +2,9 m), +X van de toren langs de nok van de kerk naar het koor (-20 graden vanaf de RD-X-as) en +Y loodrecht daarop. Een node building:kerk: de Peperbus (vierkante onderbouw in drie geledingen tot de eerste omgang op +52 m, achtkant tot de tweede omgang op +65 m, koepel met lantaarn en bol tot +75 m) en de Onze-Lieve-Vrouwebasiliek (schip, dwarsschip en koor onder één nok op +28,5 m, 3/8-sluiting, steunberen en kapellen). Onderkant 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van het pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { towerTopM: 75.0, gallery1M: GALLERY1, gallery2M: GALLERY2, churchRidgeM: RIDGE, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Peperbus_%28Zwolle%29",
    "PDOK BAG pand 0193100000000171 (toren en Onze-Lieve-Vrouwebasiliek), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: geledingen en koepel van de toren, nokken en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's",
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

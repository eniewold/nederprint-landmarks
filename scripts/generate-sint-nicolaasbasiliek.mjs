// Genereert een gesloten 3D-model van de Sint-Nicolaasbasiliek aan de Prins
// Hendrikkade in Amsterdam (tegenover Amsterdam Centraal) uit dakvlakken en
// bouwdelen: een driebeukige kruiskerk met schip, dwarsschip en koor onder één
// nok (+31,1 m, 51 graden), dakkapellen op het schip, zijbeuken en kapellen met
// eigen zadeldaken en steunmuren, een smallere 3/8-sluiting, de achtkantige
// vieringtoren met kroonlijst, vazen, een barokke koepel, lantaarn en kruis tot
// +58,5 m, en het front met twee westtorens (de zuidtoren 2,3 m verder naar voren,
// zoals de schuin lopende straat), een topgevel met het roosvenster en een
// portaal. Het buurpand aan de zuidkant (een eigen BAG-pand waarvan de
// PDOK-reconstructie punten van de zuidtoren meeneemt) is een tweede onderdeel.
// Elk dak is een vlak z = a u + b v + c uit het AHN en de LoD2.2-vlakken van de
// 3D BAG; koepel en torens volgen de AHN-omhullende per hoogte. Het Mapbox-model
// is niet gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-sint-nicolaasbasiliek.mjs              # 1:1000 (standaard)
//   node scripts/generate-sint-nicolaasbasiliek.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (121907,25, 487722,25), het midden van de
// vieringtoren, op het maaiveld (NAP +2,25 m), Z omhoog. +X loopt van het front
// aan de Prins Hendrikkade naar het koor (60,6 graden rechtsom vanaf de RD-X-as)
// en +Y loodrecht daarop; de torens staan op u = -31,2 en -28,9 m.
//
// Bronnen: PDOK BAG-panden 0363100012165691 (basiliek) en 0363100012182894
// (buurpand); AHN DSM/DTM 0,5 m (PDOK WCS) voor nokken, koepel, torens en het
// maaiveld; 3D BAG LoD2.2 (api.3dbag.nl) voor hellingen en richting; Wikipedia;
// PDOK luchtfoto. Geschat zijn de geledingen en koepeltjes van de westtorens
// tussen de AHN-punten, de vazen, de dakkapellen, de steunmuren, het portaal en
// de vensternissen. Weggelaten: beelden, balustrades, maaswerk en de
// wijzerplaten.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-nicolaasbasiliek");
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

const SLUG = "sint-nicolaasbasiliek";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +2,25 m) ----------
const GROUND_NAP = 2.25;
const ORIGIN = [121907.25, 487722.25];
const X_AXIS = [0.490904, -0.871214]; // RD-richting -60,6 graden: van de torenfront aan de Prins Hendrikkade naar het koor
const BASE = -0.6;

// Schip, dwarsschip en koor onder één nok (+31,1 m, 51 graden).
const T = 1.23;
const RIDGE = 31.1;
const HW = 6.9; // halve breedte tot de buitenkant van de muur
const EAVE = RIDGE - T * HW;
const NAVE_U0 = -29.6;
const TR_HALF = 11.3; // dwarsschip tot de zijgevels
// Koor: smallere 3/8-sluiting rond AC.
const AC = [12.0, 0];
const APSE_HW = 4.6;
const PHIS = [-90, -45, 0, 45, 90];
const apsePoly = (c, apo, phis) =>
  phis.slice(1).map((p, i) => {
    const a = ((p + phis[i]) / 2) * (Math.PI / 180);
    const r = apo / Math.cos(((p - phis[i]) / 2) * (Math.PI / 180));
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  });
// Zijbeuken en kapellen: eigen zadeldaken met de nok langs het schip op v = ±8,8 m (+13,4 m).
const AISLE = { inner: HW - 0.05, outer: 11.3, ridgeV: 8.8, ridge: 13.4, t: 1.0 };
// Vieringtoren: achtkant van 13,6 m tot +38,5 m, een koepel, de lantaarn en een kruis tot +58,5 m.
const DOME = [0, 0];
// Twee westtorens van 6,2 m; de zuidtoren (aan de schuin lopende straat) staat 2,3 m verder naar voren.
const TOWERS = [[-31.2, -8.3], [-28.9, 8.0]];

// Maaiveld op de Prins Hendrikkade voor de torens (NAP +2,2 m).
const GROUND_SAMPLES = [[-40, 0], [-38, -10], [-38, 10]];

// ---------- kerk ----------
const solids = [];

// Schip en koor.
solids.push(roofed(rect(NAVE_U0, AC[0] + 0.05, -HW, HW), ridgeV(0, RIDGE, T)));
solids.push(roofed([[AC[0] - 0.1, -APSE_HW], ...apsePoly(AC, APSE_HW, PHIS), [AC[0] - 0.1, APSE_HW]], PHIS.map((p) => facetPhi(AC, p, APSE_HW, RIDGE - T * APSE_HW, T))));
// Dwarsschip met de nok langs v door de viering en topgevels.
solids.push(roofed(rect(-HW, HW, -TR_HALF, TR_HALF), ridgeU(0, RIDGE, T)));
for (const s of [-1, 1]) solids.push(roofed(rect(-HW, HW, s * (TR_HALF - 0.9), s * TR_HALF), ridgeU(0, RIDGE + 0.8, T)));
// Dakkapellen op het schip.
for (const u of [-24.0, -17.0, -10.5]) {
  for (const s of [-1, 1]) solids.push(roofed(rect(u - 0.8, u + 0.8, s * 2.6, s * 4.4), ridgeU(u, 29.0, 2.0)));
}
// Zijbeuken (van de torens tot het dwarsschip) en kapellen naast het koor, met steunmuren met een punt op de traveegrenzen.
for (const s of [-1, 1]) {
  for (const [u0, u1] of [[NAVE_U0 + 0.5, -HW + 0.05], [HW - 0.05, 16.4]]) {
    solids.push(roofed(rect(u0, u1, s * AISLE.inner, s * AISLE.outer), ridgeV(s * AISLE.ridgeV, AISLE.ridge, AISLE.t)));
  }
  for (const u of [-21.0, -16.0, -11.0, 11.0]) {
    solids.push(roofed(rect(u - 0.5, u + 0.5, s * AISLE.inner, s * (AISLE.outer + 0.6)), ridgeV(s * 9.5, 15.6, 2.0)));
  }
}

// Vieringtoren: achtkantige trommel, kroonlijst, koepel in vier stappen, lantaarn en kruis.
solids.push(
  loft([
    [20.0, oct(DOME, 13.6)],
    [38.2, oct(DOME, 13.6)],
    [38.6, oct(DOME, 14.2)],
    [39.2, oct(DOME, 14.2)],
    [40.0, oct(DOME, 13.6)],
    [42.4, oct(DOME, 12.0)],
    [44.8, oct(DOME, 10.8)],
    [46.3, oct(DOME, 9.8)],
    [47.4, oct(DOME, 8.0)],
    [48.2, oct(DOME, 6.0)],
    [48.5, oct(DOME, 3.6)],
    [53.4, oct(DOME, 3.6)],
    [53.8, oct(DOME, 3.9)],
    [54.2, oct(DOME, 3.9)],
    [56.4, oct(DOME, 1.4)],
    [58.5, oct(DOME, 0.9)],
  ]),
);
// Pinakels (vazen) op de hoeken van de kroonlijst.
for (let k = 0; k < 8; k++) {
  const a = (Math.PI / 8) * (2 * k + 1);
  const r = 13.6 / 2 / Math.cos(Math.PI / 8) - 0.6;
  solids.push(pinnacle([DOME[0] + r * Math.cos(a), DOME[1] + r * Math.sin(a)], 0.45, 38.9, 1.0, 1.4));
}

// Westtorens: vierkante romp tot +35,5 m met een borstwering, een achtkantige klokkenverdieping, een koepel en een lantaarn.
for (const c of TOWERS) {
  solids.push(prism(sq(c, 3.1), BASE, 35.5));
  solids.push(band(section(sq(c, 3.1)), 0.7, 34.8, 36.4));
  solids.push(
    loft([
      [35.0, oct(c, 5.0)],
      [39.0, oct(c, 5.0)],
      [39.3, oct(c, 5.4)],
      [39.8, oct(c, 5.4)],
      [41.5, oct(c, 4.4)],
      [43.4, oct(c, 2.8)],
      [44.2, oct(c, 1.8)],
      [46.3, oct(c, 1.8)],
      [46.6, oct(c, 2.0)],
      [48.2, oct(c, 0.9)],
    ]),
  );
}
// Front tussen de torens met een topgevel (+31 m) voor het roosvenster.
solids.push(roofed(rect(NAVE_U0 - 0.8, NAVE_U0 + 0.4, -5.0, 5.0), ridgeV(0, RIDGE + 0.6, T)));
// Portaal voor de middeningang.
solids.push(roofed(rect(-34.2, NAVE_U0 - 0.6, -2.6, 2.6), ridgeV(0, 9.5, 1.3)));

const churchMass = Manifold.union(solids);
let church = churchMass;

// Vensternissen (spitse nissen), het roosvenster in de frontgevel en de ingangen.
const cuts = [];
for (const u of [-24.0, -18.5, -13.5]) for (const ang of [90, 270]) cuts.push(niche([u, 0], ang, AISLE.outer, 0, 2.2, 3.5, 9.0, 0.5));
for (const u of [-24.0, -18.5, -13.5]) for (const ang of [90, 270]) cuts.push(niche([u, 0], ang, HW, 0, 2.0, 16.0, 20.0, 0.5));
for (const ang of [90, 270]) cuts.push(niche([0, 0], ang, TR_HALF, 0, 4.0, 10.0, 19.5, 0.5));
for (const phi of [-45, 0, 45]) cuts.push(niche(AC, phi, APSE_HW, 0, 1.8, 15.0, 20.5, 0.5));
for (const k of [0, 2, 4, 6]) cuts.push(niche(DOME, k * 45, 6.8, 0, 2.2, 26.0, 33.5, 0.5));
cuts.push(niche([0, 0], 180, -(NAVE_U0 - 0.8), 0, 4.6, 18.5, 21.5, 0.5));
cuts.push(niche([0, 0], 180, -(NAVE_U0 - 0.8), 0, 3.0, 9.0, 14.5, 0.5));
for (const c of TOWERS) {
  for (const ang of [180, 90, 270]) cuts.push(niche(c, ang, 3.1, 0, 1.8, 27.0, 32.0, 0.5));
  for (const k of [0, 2, 4, 6]) cuts.push(niche(c, k * 45, 2.5, 0, 1.2, 36.0, 38.0, 0.4));
  cuts.push(niche(c, 180, 3.1, 0, 2.2, BASE - 0.1, 4.5, 0.8));
}
church = church.subtract(Manifold.union(cuts));

// ---------- buurpand aan de zuidkant (eigen BAG-pand) ----------
// De PDOK-reconstructie van dit pand neemt punten van de zuidtoren mee (tot NAP +25,8 m tegenover +21,5 m in het AHN);
// daarom zit het hier als eenvoudig gebouw met twee zadeldaken.
const annex = [
  roofed(rect(-38.0, -29.4, -18.4, -11.1), [...ridgeV(-14.6, 20.6, 1.2), [1.5, 0, 16.8 + 1.5 * 37.7]]),
  roofed(rect(-29.6, -12.3, -17.6, -11.1), ridgeV(-14.5, 15.6, 0.9)),
];
const buurpand = Manifold.union(annex).subtract(churchMass);

const nodes = [
  ["building:kerk", church],
  ["building:buurpand", buurpand],
];
const all = Manifold.union([church, buurpand]);

const META = {
  name: "Sint-Nicolaasbasiliek",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 45.23,
  replacesBuildings: ["0363100012165691", "0363100012182894"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (121907,25, 487722,25), het midden van de vieringtoren, op het maaiveld (NAP +2,25 m), +X van het front aan de Prins Hendrikkade naar het koor (-60,6 graden vanaf de RD-X-as) en +Y loodrecht daarop. Node building:kerk: driebeukige kruiskerk onder één nok op +31,1 m met dakkapellen, zijbeuken en kapellen met eigen zadeldaken, een 3/8-sluiting, de achtkantige vieringtoren met koepel, lantaarn en kruis tot +58,5 m, en twee westtorens met klokkenverdieping, koepel en lantaarn tot +48,2 m. Node building:buurpand: het pand aan de zuidkant met twee zadeldaken. Onderkant 0,6 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van beide panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { domeTopM: 58.5, towerTopM: 48.2, ridgeM: RIDGE, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Co-kathedrale_basiliek_van_de_Heilige_Nicolaas",
    "PDOK BAG panden 0363100012165691 (basiliek) en 0363100012182894 (buurpand aan de zuidkant), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, koepel, torens en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken",
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

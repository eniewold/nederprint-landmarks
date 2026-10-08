// Genereert een gesloten 3D-model van de Sint-Janskerk aan het Vrijthof in
// Maastricht uit dakvlakken en bouwdelen: een basilicaal schip met lichtbeuk
// (nok +19,3 m, 39 graden) en zijbeuken onder lessenaarsdaken, een hoger koor
// (nok +25,8 m, 58 graden) met een 3/8-sluiting, steunberen tot onder de goot en
// een stenen plint, en de rode toren: een onderbouw van 10,1 bij 10,7 m met
// getrapte hoeksteunberen, een hoge blinde boog met galmgaten, de eerste omgang
// op +41 m met vier hoekspitsen, een bovenbouw van 8 m met twee galmgaten per
// zijde, de tweede omgang op +58 m met hoekpinakels en wimbergen, en een
// achtkantige spits tot +71,8 m. Elk dak is een vlak z = a u + b v + c uit het
// AHN en de LoD2.2-vlakken van de 3D BAG; de geledingen van de toren volgen de
// AHN-omhullende per hoogte. Het Mapbox-model is niet gebruikt. Alle maten in het
// script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-sint-janskerk-maastricht.mjs              # 1:1000 (standaard)
//   node scripts/generate-sint-janskerk-maastricht.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (176160, 317660), in het schip, op het maaiveld
// (NAP +52,3 m), Z omhoog. +X loopt langs de nokken naar het koor (14,3 graden
// linksom vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden. De toren
// staat in het westen aan het Vrijthof (hart u = -25,45 m), het koor eindigt op
// u = 23,5 m; de Sint-Servaasbasiliek (eigen landmarkmodel) ligt ten noorden.
//
// Bronnen: PDOK BAG-pand 0935100000017447; AHN DSM/DTM 0,5 m (PDOK WCS) voor de
// geledingen van de toren, nokken en het maaiveld (van NAP +54,3 m aan de
// westkant naar +51,1 m achter het koor); 3D BAG LoD2.2 (api.3dbag.nl);
// Wikipedia; PDOK luchtfoto; foto's op Wikimedia Commons. Geschat zijn de
// hoogtes van de steunberen, de hoekspitsen en wimbergen, de vensternissen en
// galmgaten. Weggelaten: maaswerk, de wijzerplaten, de open balustrades (dicht)
// en de doopkapel als apart bouwdeel.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "sint-janskerk-maastricht");
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

const SLUG = "sint-janskerk-maastricht";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +52,3 m) ----------
const GROUND_NAP = 52.3;
const ORIGIN = [176160.0, 317660.0];
const X_AXIS = [0.969016, 0.246999]; // RD-richting 14,3 graden, langs de nokken
// Het maaiveld loopt van NAP +54,3 m aan de westkant naar +51,1 m achter het koor.
const BASE = -1.8;

// Schip: nok +19,3 m (39 graden) tussen lichtbeukmuren op v = -4,4 en +6,2 m.
const NAVE = { u0: -20.5, u1: 8.4, v0: -4.4, v1: 6.2, ridge: 19.3, t: 0.8 };
const NAVE_C = (NAVE.v0 + NAVE.v1) / 2;
// Koor: hoger dan het schip, nok +25,8 m (58 graden), 3/8-sluiting rond AC.
const CHOIR = { hw: 5.1, ridge: 25.8, t: 1.6 };
const AC = [16.5, 0.85];
const CHOIR_EAVE = CHOIR.ridge - CHOIR.t * CHOIR.hw;
const PHIS = [-90, -45, 0, 45, 90];
const apsePoly = (c, apo, phis) =>
  phis.slice(1).map((p, i) => {
    const a = ((p + phis[i]) / 2) * (Math.PI / 180);
    const r = apo / Math.cos(((p - phis[i]) / 2) * (Math.PI / 180));
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  });
// De rode toren: onderbouw van 10,1 bij 10,7 m tot de eerste omgang (+41 m), een bovenbouw van 8 m tot de
// tweede omgang (+58 m) en een achtkantige spits tot +71,8 m (NAP +124,1 m, het hoogste AHN-punt).
const TC = [-25.45, 0.55];
const TB = { hu: 5.05, hv: 5.35, top: 41.0 };
const UPPER = { half: 4.0, top: 58.0 };

// Maaiveld aan de zuid- en noordkant van het schip (NAP +52,3 tot +53,3 m).
const GROUND_SAMPLES = [[-10, -11], [10, 13], [-15, 13]];

// ---------- kerk ----------
const solids = [];

// Schip met de lichtbeuk.
solids.push(roofed(rect(NAVE.u0, NAVE.u1 + 0.5, NAVE.v0, NAVE.v1), ridgeV(NAVE_C, NAVE.ridge, NAVE.t)));
// Zijbeuken met lessenaarsdaken (zuid +11,9 naar +9,7 m, noord +12,2 naar +9,6 m).
solids.push(roofed(rect(NAVE.u0, 12.8, -9.3, NAVE.v0 + 0.05), [[0, 0.46, 11.9 - 0.46 * NAVE.v0]]));
solids.push(roofed(rect(-30.5, 16.8, NAVE.v1 - 0.05, 11.0), [[0, -0.55, 12.2 + 0.55 * NAVE.v1]]));
// Koor met de sluiting; het westeinde loopt met een schild over de nok van het schip.
const choir = [[8.3, AC[1] - CHOIR.hw], ...apsePoly(AC, CHOIR.hw, PHIS), [8.3, AC[1] + CHOIR.hw]];
solids.push(roofed(choir, [...PHIS.map((p) => facetPhi(AC, p, CHOIR.hw, CHOIR_EAVE, CHOIR.t)), [2.1, 0, 19.0 - 2.1 * 8.3]]));
// Steunberen rond de sluiting en langs het koor, tot onder de goot, op een stenen plint (+4,5 m) achter het koor.
for (const c of apsePoly(AC, CHOIR.hw + 0.4, PHIS)) solids.push(pier(c, 0.6, 16.5, 1.8));
for (const u of [10.6, 13.6]) for (const s of [-1, 1]) solids.push(pier([u, AC[1] + s * (CHOIR.hw + 0.3)], 0.55, 16.5, 1.8));
solids.push(prism([[12.8, -8.7], [15.2, -6.8], [18.8, -5.8], [21.6, -3.9], [23.5, -1.2], [23.5, 2.2], [21.9, 5.1], [19.0, 6.8], [16.8, 6.9], [16.8, 8.9], [15.0, 10.8], [12.0, 10.8], [12.0, -8.7]], BASE, 4.5));
// Steunberen langs de zuidbeuk.
for (const u of [-14.0, -7.5, -1.0, 5.5]) solids.push(buttress([u, -9.3], 0, 1.0, 1.0, 9.0, 8.0));

// De toren.
const towerBody = rect(TC[0] - TB.hu, TC[0] + TB.hu, TC[1] - TB.hv, TC[1] + TB.hv);
solids.push(prism(towerBody, BASE, TB.top));
// Hoeksteunberen tot de eerste omgang, twee keer teruggezet.
for (const [su, sv] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
  const c = [TC[0] + su * (TB.hu - 0.2), TC[1] + sv * (TB.hv - 0.2)];
  solids.push(loft([[BASE, sq(c, 1.1)], [18.0, sq(c, 1.1)], [18.4, sq(c, 0.85)], [34.0, sq(c, 0.85)], [34.4, sq(c, 0.6)], [TB.top, sq(c, 0.6)]]));
}
// Eerste omgang met borstwering en vier hoekspitsen tot +49 m.
solids.push(band(section(towerBody), 0.8, TB.top - 1.0, TB.top + 1.2));
for (const [su, sv] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
  const c = [TC[0] + su * (TB.hu - 0.6), TC[1] + sv * (TB.hv - 0.6)];
  solids.push(loft([[TB.top - 0.2, oct(c, 1.2)], [43.5, oct(c, 1.2)], [49.0, tip(c)]]));
}
// Bovenbouw met hoeksteunbeertjes, galmgaten en een tweede omgang.
solids.push(prism(sq(TC, UPPER.half), TB.top - 0.5, UPPER.top));
for (const [su, sv] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
  solids.push(prism(sq([TC[0] + su * (UPPER.half - 0.1), TC[1] + sv * (UPPER.half - 0.1)], 0.55), TB.top - 0.5, UPPER.top));
}
solids.push(band(section(sq(TC, UPPER.half)), 0.75, UPPER.top - 0.6, UPPER.top + 1.0));
for (const [su, sv] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
  solids.push(pinnacle([TC[0] + su * (UPPER.half - 0.05), TC[1] + sv * (UPPER.half - 0.05)], 0.4, UPPER.top - 0.2, 2.5, 2.4));
}
// Achtkantige spits met vier wimbergen aan de voet.
solids.push(loft([[UPPER.top - 0.5, oct(TC, 6.6)], [UPPER.top + 1.2, oct(TC, 6.6)], [62.0, oct(TC, 4.6)], [71.8, oct(TC, 0.9)]]));
for (const ang of [0, 90, 180, 270]) {
  const d = 3.1;
  const c = [TC[0] + d * Math.cos((ang * Math.PI) / 180), TC[1] + d * Math.sin((ang * Math.PI) / 180)];
  solids.push(roofed(sq(c, 0.9), ang % 180 === 0 ? ridgeV(c[1], 63.0, 2.4) : ridgeU(c[0], 63.0, 2.4)).intersect(prism(sq(c, 0.9), UPPER.top, 64)));
}

let church = Manifold.union(solids);

// Vensternissen en galmgaten (spitsbogen).
const cuts = [];
for (const phi of [-45, 0, 45]) cuts.push(niche(AC, phi, CHOIR.hw, 0, 2.2, 5.5, 15.0, 0.5));
for (const u of [10.6 + 1.5]) for (const ang of [90, 270]) cuts.push(niche([u, AC[1]], ang, CHOIR.hw, 0, 2.0, 12.0, 16.0, 0.5));
for (const u of [-17.2, -10.7, -4.2, 2.3, 9.0]) cuts.push(niche([u, 0], 270, 9.3, 0, 2.4, 2.5, 7.0, 0.5), niche([u, 0], 90, 11.0, 0, 2.4, 2.5, 7.0, 0.5));
for (const u of [-17.2, -10.7, -4.2, 2.3]) cuts.push(niche([u, 0], 270, -NAVE.v0, 0, 2.0, 12.6, 13.6, 0.4), niche([u, 0], 90, NAVE.v1, 0, 2.0, 12.9, 13.6, 0.4));
// Toren: hoge blinde boog met galmgaten in de onderbouw, galmgaten in de bovenbouw.
for (const ang of [90, 180, 270]) {
  const a = ang === 180 ? TB.hu : TB.hv;
  cuts.push(niche(TC, ang, a, 0, 3.6, 22.0, 33.0, 0.6));
  cuts.push(niche(TC, ang, a, 0, 2.6, 10.0, 18.0, 0.5));
}
for (const ang of [0, 90, 180, 270]) for (const s of [-1.6, 1.6]) cuts.push(niche(TC, ang, UPPER.half, s, 1.3, 44.0, 54.0, 0.6));
church = church.subtract(Manifold.union(cuts));

const nodes = [["building:kerk", church]];
const all = church;

const META = {
  name: "Sint-Janskerk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 97.91,
  replacesBuildings: ["0935100000017447"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (176160, 317660), in het schip, op het maaiveld (NAP +52,3 m), +X langs de nokken naar het koor (14,3 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden. Een node building:kerk uit dakvlakken en bouwdelen: basilicaal schip (nok +19,3 m) met zijbeuken, een hoger koor (nok +25,8 m) met 3/8-sluiting en steunberen, en de rode toren met getrapte hoeksteunberen, omgangen op +41 en +58 m, hoekspitsen, galmgaten en een achtkantige spits tot +71,8 m. Onderkant 1,8 m onder het maaiveld omdat het terrein van west naar oost 3 m daalt; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van de kerk. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { towerTopM: 71.8, gallery1M: TB.top, gallery2M: UPPER.top, naveRidgeM: NAVE.ridge, choirRidgeM: CHOIR.ridge, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Sint-Janskerk_%28Maastricht%29",
    "PDOK BAG pand 0935100000017447 (kerk met toren), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: geledingen van de toren, nokken en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's vanaf het Vrijthof en het Henric van Veldekeplein",
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

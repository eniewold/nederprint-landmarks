// Genereert een gesloten 3D-model van de Bovenkerk (Sint-Nicolaaskerk) in Kampen uit
// dakvlakken en bouwdelen: het hoge schip en koor onder één nok (+33,9 m, 59 graden) met
// een omgang op +26,7 m achter de dakvoet, een koorsluiting van zeven zijden van een
// twaalfhoek, het dwarsschip (nok +34,05 m) met afgewolfde kopgevels, grote vensters en
// een dakruiter op de viering, de dubbele zijbeuken van het schip met per travee een dwars
// zadeldak (nok +17,25 tot +17,5 m) met een schild naar de buitenmuur boven een kilgoot die
// van de schipmuur afloopt, het noord- en zuidportaal, de kooromgang met kapellenkrans: drie
// dwarse kappen per kant langs het rechte koor, vijf straalsgewijze kappen rond de sluiting, een
// borstwering op de buitenmuur en steunberen met pinakels tegen de lage en de hoge muren,
// en de westtoren: een vierkante schacht met drie rijen spitsboognissen, een waterlijst,
// een schilddak met dakkapellen dat overgaat in een achtzijdige naaldspits (tot +72 m),
// met aan weerszijden van de toren de lage aanbouwen onder een schilddak.
// Elk dakvlak is een planvergelijking z = a u + b v + c, afgelezen uit de nokken, goten en
// kilgoten van het AHN-DSM (0,5 m) en de LoD2.2-vlakken van de 3D BAG; de plattegrond komt
// uit de BAG-contouren. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de nodenaam)
// als catalogusbron voor de export en de kaart, plus een binaire STL in millimeters op
// 1:<schaal>.
//
//   node scripts/generate-bovenkerk-kampen.mjs              # 1:1000 (standaard)
//   node scripts/generate-bovenkerk-kampen.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (191155,25, 507617,46), de viering (snijpunt van de nok van
// het schip en die van het dwarsschip), op het maaiveld (NAP +2,57 m), Z omhoog. +X loopt
// langs de nok van schip en koor naar het oostnoordoosten (7,8 graden linksom vanaf de
// RD-X-as, gemeten aan de nok in het AHN; de BAG-muren geven 7,1 tot 7,9) en +Y loodrecht
// daarop naar het noordnoordwesten. De toren staat in het westen (u -47,8 tot -38,0 m), de
// koorsluiting en de kapellenkrans liggen rond (19,5, 0) en eindigen op u = 33,7 m.
//
// Bronnen: PDOK BAG-panden 0166100000016074 (kerk) en 0166100000016070 (toren); AHN
// DSM/DTM 0,5 m (PDOK WCS) voor nokken, goten, kilgoten, de toren en het maaiveld; 3D BAG
// LoD2.2 (api.3dbag.nl) voor hellingen en de ligging van de dwarse kappen; PDOK luchtfoto;
// foto's op Wikimedia Commons (toren met schilddak en naaldspits, koor met borstweringen,
// dakruiter, portalen). Geschat zijn de hoogtes van de torennissen en de waterlijst, de
// dakkapellen op het torendak, de dakruiter boven het AHN-punt, de steunberen en pinakels,
// de vensternissen en de diagonale steunberen. Weggelaten: maaswerk, uurwerken, het kruis en
// de bol op de spits, de opengewerkte balustrades (als dichte borstwering) en kleine pinakels
// onder 0,9 m.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "bovenkerk-kampen");
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
// Vlak door de gevellijn p0-p1 op hoogte z0, stijgend naar binnen (kant van 'inside') met helling t.
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
// Dakvlak boven een gevel met de normaal naar phi (graden) op apothema apo rond c: hoogte z0 daar, helling t naar binnen.
const facetPhi = (c, phi, apo, z0, t) => {
  const cp = Math.cos((phi * Math.PI) / 180);
  const sp = Math.sin((phi * Math.PI) / 180);
  return [-t * cp, -t * sp, z0 + t * apo + t * (c[0] * cp + c[1] * sp)];
};
// Regelmatige veelhoek: hoekpunten op de hoeken angs (graden) rond c, voor apothema apo en zijdehoek step.
const ngon = (c, apo, angs, step) =>
  angs.map((a) => {
    const r = apo / Math.cos(((step / 2) * Math.PI) / 180);
    return [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  });
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const box = ([cx, cy], hu, hv) => [[cx - hu, cy - hv], [cx + hu, cy - hv], [cx + hu, cy + hv], [cx - hu, cy + hv]];
const oct = ([cx, cy], across) => {
  const r = across / 2 / Math.cos(Math.PI / 8);
  return Array.from({ length: 8 }, (_, k) => {
    const a = Math.PI / 8 + (k * Math.PI) / 4;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
};
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek].
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Pinakel op een steunbeer die tot de onderkant doorloopt: vierkante schacht tot z1 en een piramide.
const pier = (c, half, z1, point) => loft([[BASE, sq(c, half)], [z1, sq(c, half)], [z1 + point, tip(c)]]);
// Steunbeer tegen een gevel die naar -v kijkt; angle draait hem (0 zuid, 180 noord); [x, y] ligt in de gevel.
const buttress = ([x, y], angle, w, d, zw, zo) =>
  profileX([[0.1, BASE], [-d, BASE], [-d, zo], [-0.6 * d, zw], [0.1, zw]], -w / 2, w / 2)
    .rotate([0, 0, angle])
    .translate([x, y, 0]);
// Diagonale steunbeer uit de BAG-contour [binnen1, buiten1, buiten2, binnen2]: vlakke top op zTop,
// daarna met helling s naar buiten aflopend.
function buttressQuad([i1, o1, o2, i2], zTop, s) {
  const w = [(i1[0] + i2[0]) / 2, (i1[1] + i2[1]) / 2];
  const out = [(o1[0] + o2[0]) / 2 - w[0], (o1[1] + o2[1]) / 2 - w[1]];
  const len = Math.hypot(...out);
  const d = [out[0] / len, out[1] / len];
  const ref = [w[0] + d[0] * 0.3, w[1] + d[1] * 0.3];
  return roofed([i1, o1, o2, i2], [[-s * d[0], -s * d[1], zTop + s * (ref[0] * d[0] + ref[1] * d[1])], [0, 0, zTop]]);
}
// Spitsboogvormige nis (breedte w, van z0 tot z1 en dan een punt van 58 graden) in een gevel met de
// normaal naar 'angle' (graden, 0 = +u) op afstand a van het punt [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.4) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.6,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);

const SLUG = "bovenkerk-kampen";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +2,57 m) ----------
const GROUND_NAP = 2.57;
const ORIGIN = [191155.25, 507617.46];
const X_AXIS = [0.990748, 0.135716]; // RD-richting 7,8 graden, langs de nok van schip en koor
const BASE = -0.5;
// Maaiveld (AHN NAP +2,54 tot +2,95 m): naast de aanbouwen bij de toren, langs beide zijbeuken en bij het koor.
const GROUND_SAMPLES = [[-52, -12], [-52, 12], [-20, -24], [-20, 25], [26, -21], [26, 21]];

// Schip en koor onder één nok; muren op v = ±5,6, omgang achter de borstwering op +26,7 m.
const NAVE = { u0: -38.3, wall: 5.6, ridge: 33.9, t: 1.65, walk: 26.7 };
// Koorsluiting: zeven zijden van een twaalfhoek rond HUB (apothema 5,6 m); de dakvlakken komen samen boven HUB.
const HUB = [19.2, 0];
const APSE_PHIS = [-90, -60, -30, 0, 30, 60, 90];
// Dwarsschip (BAG u -4,6 tot 5,05), nok langs v op u = 0,22, kopgevels afgewolfd vanaf |v| = 13,5 m.
const TR = { u0: -4.6, u1: 5.05, uc: 0.22, v0: -17.1, v1: 17.2, ridge: 34.05, t: 1.45, hipFrom: 13.5, hipT: 1.85 };
// Zijbeuken van het schip: per travee een dwars zadeldak met een schild naar de buitenmuur boven een kilgoot.
const AISLE = {
  u0: -38.3, u1: TR.u0, wallN: 17.55, wallS: -17.19, gutter: 12.7, valleyZ: { N: 17.4, S: 17.15 }, valleyT: 0.9,
  ridge: { N: 17.5, S: 17.25 }, t: 1.45, half: 3.3, hipT: 1.8, hipIn: 3.45,
  gables: [-34.15, -27.65, -21.15, -14.65, -8.1],
};
// Steunberen langs de buitenmuren van de zijbeuken (BAG).
const AISLE_BUTTRESS = { N: [-37.26, -30.8, -24.28, -17.75], S: [-37.27, -30.76, -24.15, -17.6] };
// Kooromgang: goot +12,6 m, kilgoot van +15,8 m aan de koormuur (0,9 m per m), lessenaarsdak tegen het
// dwarsschip, dwarse kappen langs het rechte koor en straalsgewijze kappen rond de sluiting (nok +15,85 m).
const AMB = {
  gutter: 12.6, parapet: 13.3, valleyZ: 15.8, valleyT: 0.9, leanZ: 16.3, leanT: 1.0,
  ridge: 15.85, crossT: 1.55, crossHalf: 2.12, crossU: [11.75, 16.0, 20.25], hipFrom: 10.65, hipT: 2.2,
  radialPhis: [-60, -30, 0, 30, 60], radialT: 1.4, radialHalf: 2.3, radialHipFrom: 10.7,
};
// Buitenmuur van de kooromgang (BAG, zonder de stompjes van de steunberen).
const AMB_RING = [
  [5.05, -13.38], [17.74, -13.38], [17.74, -14.1], [23.66, -14.06], [25.25, -12.75], [28.94, -9.75],
  [30.3, -8.5], [32.52, -3.8], [32.95, -2.05], [32.85, 3.1], [32.36, 4.91], [29.85, 9.33],
  [28.54, 10.72], [24.26, 13.46], [22.53, 14.05], [7.23, 13.98], [7.23, 15.67], [5.05, 15.67],
];
// Steunberen van de kooromgang (BAG): rond de kapellenkrans en langs het rechte koor.
const AMB_PIERS = [[25.15, -13.3], [30.2, -9.55], [33.5, -3.15], [33.4, 4.2], [29.85, 10.6], [23.6, 14.5]];
const CHOIR_PIERS = [[8.95, 14.35], [13.3, 14.38], [17.6, 14.4], [9.39, -13.8], [13.86, -13.75], [17.9, -13.9]];
// Toren: schacht (BAG/AHN) tot de goot op +41,5 m, schilddak tot de voet van de spits op +44,8 m
// (apothema 2,75 m), achtzijdige naaldspits tot +72 m (AHN +72,7 m met bol en kruis); de spits staat
// 0,4 m westelijker dan het hart van de schacht (de toren helt).
const TOWER = { u0: -47.8, u1: -37.98, v0: -4.95, v1: 5.25, eave: 41.5, spireBase: 44.8, spireApo: 2.75, top: 72.0 };
const TC = [(TOWER.u0 + TOWER.u1) / 2, (TOWER.v0 + TOWER.v1) / 2];
const SPIRE_C = [-43.3, 0.0];
const SPIRE_TOP = [-43.45, -0.35];
// Lage aanbouwen aan weerszijden van de toren: schilddak (goot +4,2 m, 40 graden) en een plat deel op +4,3 m.
const ANNEX = { eave: 4.2, t: 0.85, flatU: -39.6, flat: 4.3 };
const ANNEX_N = [[-46.48, 5.25], [-38.3, 5.25], [-38.3, 16.61], [-43.48, 16.61], [-46.48, 13.59]];
const ANNEX_S = [[-46.43, -4.95], [-38.3, -4.95], [-38.3, -16.16], [-43.4, -16.2], [-46.4, -13.2]];

// ---------- kerk ----------
const solids = [];

// Schip en koor met de sluiting: dakvlakken door de nok en de top boven HUB, omgang op +26,7 m.
const naveChoir = [[NAVE.u0, -NAVE.wall], ...ngon(HUB, NAVE.wall, [-75, -45, -15, 15, 45, 75], 30), [NAVE.u0, NAVE.wall]];
solids.push(roofed(naveChoir, APSE_PHIS.map((p) => facetPhi(HUB, p, 0, NAVE.ridge, NAVE.t))));
solids.push(prism(naveChoir, BASE, NAVE.walk));

// Dwarsschip met afgewolfde kopgevels.
solids.push(
  roofed(rect(TR.u0, TR.u1, TR.v0, TR.v1), [
    ...ridgeU(TR.uc, TR.ridge, TR.t),
    [0, -TR.hipT, TR.ridge + TR.hipT * TR.hipFrom],
    [0, TR.hipT, TR.ridge + TR.hipT * TR.hipFrom],
  ]),
);
solids.push(prism(rect(TR.u0, TR.u1, TR.v0, TR.v1), BASE, NAVE.walk));
// Dakruiter op de viering: achtkantige lantaarn met een kap en een slanke spits.
{
  const c = [TR.uc, 0];
  solids.push(loft([[31.5, oct(c, 1.8)], [36.2, oct(c, 1.8)], [36.5, oct(c, 2.2)], [36.8, oct(c, 2.2)], [39.8, oct(c, 0.9)]]));
}
// Diagonale steunbeer met pinakel op de oostelijke hoeken van de kopgevels.
for (const quad of [
  [[4.57, -17.06], [5.36, -17.87], [6.07, -17.19], [5.16, -16.23]],
  [[4.02, 17.14], [4.91, 18.17], [5.68, 17.59], [4.71, 16.42]],
]) {
  solids.push(buttressQuad(quad, 26.0, 2.5));
  const c = [quad.reduce((s, p) => s + p[0], 0) / 4, quad.reduce((s, p) => s + p[1], 0) / 4];
  solids.push(pier(c, 0.45, 27.3, 2.7));
}

// Zijbeuken van het schip.
for (const [s, wall] of [[1, AISLE.wallN], [-1, AISLE.wallS]]) {
  const vIn = s * NAVE.wall;
  const span = s > 0 ? [vIn, wall] : [wall, vIn];
  // Goot en kilgoot die van de schipmuur naar buiten afloopt.
  solids.push(prism(rect(AISLE.u0, AISLE.u1, ...span), BASE, AISLE.gutter));
  // De kilgoot loopt van de eerste dwarse kap tot het dwarsschip; ten westen ervan ligt alleen de goot.
  const side = s > 0 ? "N" : "S";
  const ridge = AISLE.ridge[side];
  solids.push(roofed(rect(AISLE.gables[0], AISLE.u1, ...span), [[0, -s * AISLE.valleyT, AISLE.valleyZ[side] + AISLE.valleyT * NAVE.wall]]));
  // Dwarse zadeldaken per travee met een schild naar de buitenmuur.
  const hipFrom = Math.abs(wall) - AISLE.hipIn;
  AISLE.gables.forEach((u, i) => {
    const half = i === AISLE.gables.length - 1 ? 3.6 : AISLE.half;
    const u0 = Math.max(AISLE.u0, u - half);
    const u1 = Math.min(AISLE.u1, u + half);
    solids.push(roofed(rect(u0, u1, ...span), [...ridgeU(u, ridge, AISLE.t), [0, -s * AISLE.hipT, ridge + AISLE.hipT * hipFrom]]));
  });
  // Steunberen tussen de traveeën.
  for (const u of s > 0 ? AISLE_BUTTRESS.N : AISLE_BUTTRESS.S) solids.push(buttress([u, wall], s > 0 ? 180 : 0, 0.9, 1.15, 11.8, 10.2));
}
// Noordportaal: de dwarse kap van de laatste travee loopt door en eindigt in een schild.
solids.push(roofed(rect(-11.71, -4.61, AISLE.wallN - 0.1, 23.1), [...ridgeU(-8.16, 17.3, 1.7), [0, -1.7, 17.3 + 1.7 * 21.4]]));
// Zuidportaal: tentdak.
solids.push(roofed(rect(-11.5, -4.1, -22.4, AISLE.wallS + 0.1), [...ridgeU(-7.8, 16.4, 1.35), ...ridgeV(-19.75, 16.4, 1.35)]));
// Diagonale steunberen op de hoeken van de portalen (BAG).
for (const quad of [
  [[-11.16, 23.1], [-11.85, 23.78], [-12.35, 23.33], [-11.8, 22.72]],
  [[-5.07, 23.11], [-4.44, 23.78], [-4.0, 23.28], [-4.61, 22.65]],
  [[-11.51, -21.87], [-12.19, -22.4], [-11.77, -22.94], [-11.1, -22.3]],
  [[-4.61, -22.39], [-3.97, -23.03], [-3.47, -22.54], [-4.08, -21.96]],
]) solids.push(buttressQuad(quad, 9.5, 2.5));

// Kooromgang met kapellenkrans, begrensd door de buitenmuur.
{
  const amb = [];
  amb.push(prism(AMB_RING, BASE, AMB.gutter));
  // Kilgoot rond het koor (vlakken evenwijdig aan de zijden van de sluiting).
  amb.push(roofed(AMB_RING, APSE_PHIS.map((p) => facetPhi(HUB, p, NAVE.wall, AMB.valleyZ, AMB.valleyT))));
  // Lessenaarsdak tegen de oostmuur van het dwarsschip.
  amb.push(roofed(rect(TR.u1, 9.4, -14.2, 15.7), [[-AMB.leanT, 0, AMB.leanZ + AMB.leanT * TR.u1]]));
  // Dwarse kappen langs het rechte koor, met een schild naar de buitenmuur.
  for (const u of AMB.crossU) {
    for (const s of [1, -1]) {
      const span = s > 0 ? [NAVE.wall, 15] : [-15, -NAVE.wall];
      amb.push(roofed(rect(u - AMB.crossHalf, u + AMB.crossHalf, ...span), [...ridgeU(u, AMB.ridge, AMB.crossT), [0, -s * AMB.hipT, AMB.ridge + AMB.hipT * AMB.hipFrom]]));
    }
  }
  // Straalsgewijze kappen rond de sluiting.
  for (const phi of AMB.radialPhis) {
    const g = roofed(rect(NAVE.wall - 0.6, 15, -AMB.radialHalf, AMB.radialHalf), [
      [0, -AMB.radialT, AMB.ridge],
      [0, AMB.radialT, AMB.ridge],
      [-AMB.hipT, 0, AMB.ridge + AMB.hipT * AMB.radialHipFrom],
    ]);
    amb.push(g.rotate([0, 0, phi]).translate([HUB[0], HUB[1], 0]));
  }
  // Borstwering (in werkelijkheid een opengewerkte balustrade) op de buitenmuur.
  const ring = new CrossSection([ccw(AMB_RING)]);
  amb.push(Manifold.extrude(ring.subtract(ring.offset(-0.9, "Miter")), AMB.parapet - 11).translate([0, 0, 11]));
  solids.push(Manifold.union(amb).intersect(prism(AMB_RING, BASE - 1, 40)));
  // Traptorentje in de hoek met het noordelijke dwarsschip.
  solids.push(prism(rect(TR.u1 - 0.05, 7.0, 13.94, 15.6), BASE, 15.4));
}
// Steunberen met pinakels op de buitenmuur van de kooromgang (het AHN toont geen luchtbogen).
// De BAG-stompjes rond de kapellenkrans liggen buiten de vereenvoudigde muurlijn: 0,5 m naar binnen geschoven.
const inward = ([x, y]) => {
  const d = Math.hypot(x - HUB[0], y - HUB[1]);
  return [x - (0.5 * (x - HUB[0])) / d, y - (0.5 * (y - HUB[1])) / d];
};
for (const c of [...AMB_PIERS.map(inward), ...CHOIR_PIERS]) solids.push(pier(c, 0.5, 14.2, 2.4));
// Steunberen tegen de hoge muren van schip, koor en sluiting, met een pinakel boven de omgang.
{
  const strip = (c, ang) => {
    const a = (ang * Math.PI) / 180;
    const d = [Math.cos(a), Math.sin(a)];
    const at = (r, t) => [c[0] + d[0] * r - d[1] * t, c[1] + d[1] * r + d[0] * t];
    const foot = [at(-0.3, -0.45), at(0.6, -0.45), at(0.6, 0.45), at(-0.3, 0.45)];
    const top = at(0.15, 0);
    return loft([[BASE, foot], [NAVE.walk + 0.6, foot], [NAVE.walk + 2.6, tip(top)]]);
  };
  for (const u of [-30.9, -24.4, -17.9, -11.4, 9.6, 13.9]) {
    solids.push(strip([u, NAVE.wall], 90), strip([u, -NAVE.wall], 270));
  }
  // Op de hoeken van de sluiting (twaalfhoek, hoekpunten op ±15, ±45 en ±75 graden).
  const rv = NAVE.wall / Math.cos(Math.PI / 12);
  for (const ang of [-75, -45, -15, 15, 45, 75]) {
    const a = (ang * Math.PI) / 180;
    solids.push(strip([HUB[0] + rv * Math.cos(a), HUB[1] + rv * Math.sin(a)], ang));
  }
}

// Lage aanbouwen naast de toren: schilddak en een plat deel tegen de zijbeuk.
for (const [poly, s] of [[ANNEX_N, 1], [ANNEX_S, -1]]) {
  const inside = [-43.0, 10.5 * s];
  const planes = [];
  for (let i = 0; i < poly.length; i++) {
    const p0 = poly[i];
    const p1 = poly[(i + 1) % poly.length];
    // De zijden tegen de toren (v = 5,25 of -4,95) en de zijbeuk (u = -38,3) krijgen geen dakschild.
    if (Math.abs(p0[1] - p1[1]) < 1e-6 && Math.abs(Math.abs(p0[1]) - 5.1) < 0.3) continue;
    if (Math.abs(p0[0] - p1[0]) < 1e-6 && Math.abs(p0[0] + 38.3) < 1e-6) continue;
    planes.push(facet(p0, p1, ANNEX.eave, ANNEX.t, inside));
  }
  planes.push(facet([ANNEX.flatU, 0], [ANNEX.flatU, 1], ANNEX.eave, ANNEX.t, inside));
  solids.push(roofed(poly, planes));
  solids.push(prism(poly.map(([u, v]) => [Math.max(u, ANNEX.flatU), v]), BASE, ANNEX.flat));
}

// De toren: schacht met een waterlijst, schilddak met dakkapellen en de naaldspits.
{
  const hu = (TOWER.u1 - TOWER.u0) / 2;
  const hv = (TOWER.v1 - TOWER.v0) / 2;
  solids.push(prism(box(TC, hu, hv), BASE, TOWER.eave));
  solids.push(loft([[26.4, box(TC, hu, hv)], [26.75, box(TC, hu + 0.3, hv + 0.3)], [27.1, box(TC, hu + 0.3, hv + 0.3)], [27.45, box(TC, hu, hv)]]));
  solids.push(Manifold.hull([...box(TC, hu, hv).map(([x, y]) => [x, y, TOWER.eave]), ...oct(SPIRE_C, 2 * TOWER.spireApo).map(([x, y]) => [x, y, TOWER.spireBase])]));
  solids.push(loft([[TOWER.spireBase - 0.1, oct(SPIRE_C, 2 * TOWER.spireApo)], [TOWER.top, oct(SPIRE_TOP, 0.9)]]));
  // Dakkapel op elk dakschild: een kapje met de nok naar buiten.
  for (const ang of [0, 90, 180, 270]) {
    const h = ang % 180 === 0 ? hu : hv;
    const g = roofed(rect(h - 2.2, h - 0.45, -0.7, 0.7), ridgeV(0, 43.9, 1.5));
    solids.push(g.intersect(prism(rect(h - 2.2, h - 0.45, -0.7, 0.7), 41.0, 50)).rotate([0, 0, ang]).translate([TC[0], TC[1], 0]));
  }
}

let church = Manifold.union(solids);

// ---------- nissen: vensters, portalen en torennissen (spitsbogen) ----------
const cuts = [];
// Zijbeuken: één venster per travee in de buitenmuur; lichtbeuk van het schip erboven.
for (const u of AISLE.gables.slice(0, 4)) {
  cuts.push(niche([u, 0], 90, AISLE.wallN, 0, 3.2, 3.0, 9.0));
  cuts.push(niche([u, 0], 270, -AISLE.wallS, 0, 3.2, 3.0, 9.0));
}
for (const u of AISLE.gables) {
  cuts.push(niche([u, 0], 90, NAVE.wall, 0, 3.0, 18.2, 22.8));
  cuts.push(niche([u, 0], 270, NAVE.wall, 0, 3.0, 18.2, 22.8));
}
// Lichtbeuk van het koor en de sluiting.
for (const u of [11.1, 15.45]) for (const ang of [90, 270]) cuts.push(niche([u, 0], ang, NAVE.wall, 0, 2.4, 16.8, 22.5));
for (const phi of [-60, -30, 0, 30, 60]) cuts.push(niche(HUB, phi, NAVE.wall, 0, 2.0, 16.8, 22.8));
// Kopgevels van het dwarsschip: groot venster en een portaal.
cuts.push(niche([TR.uc, 0], 90, TR.v1, 0, 5.0, 6.5, 19.0, 0.5), niche([TR.uc, 0], 270, -TR.v0, 0, 5.0, 6.5, 19.0, 0.5));
cuts.push(niche([TR.uc, 0], 90, TR.v1, 0, 2.4, 0, 3.6, 0.5), niche([TR.uc, 0], 270, -TR.v0, 0, 2.4, 0, 3.6, 0.5));
// Portalen: toegang in de kopse kant.
cuts.push(niche([-8.16, 0], 90, 23.1, 0, 3.0, 0, 5.6, 0.5), niche([-7.8, 0], 270, 22.4, 0, 3.0, 0, 5.6, 0.5));
// Rechte koordeel: een venster per travee; kapellen: een venster per zijde van de buitenmuur.
for (const u of [11.75, 16.0]) {
  cuts.push(niche([u, 0], 90, 13.98, 0, 2.2, 3.0, 8.8));
  cuts.push(niche([u, 0], 270, 13.38, 0, 2.2, 3.0, 8.8));
}
for (let i = 3; i < 14; i++) {
  const [p0, p1] = [AMB_RING[i], AMB_RING[i + 1]];
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  if (len < 3.2) continue;
  const ang = (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI - 90; // naar buiten (ring linksom)
  cuts.push(niche([(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], ang, 0, 0, Math.min(2.4, len - 1.4), 3.0, 8.8));
}
// Toren: drie rijen van drie spitsboognissen op de vrije gevels, de bovenste rij met galmgaten; westportaal.
{
  const hu = (TOWER.u1 - TOWER.u0) / 2;
  const hv = (TOWER.v1 - TOWER.v0) / 2;
  const tiers = [[8.5, 14.6], [17.6, 24.2], [28.4, 35.6]];
  for (const [ang, a] of [[180, hu], [90, hv], [270, hv], [0, hu]]) {
    for (const [z0, z1] of tiers) {
      if (ang === 0 && z0 < 34) continue;
      for (const s of [-3.0, 0, 3.0]) cuts.push(niche(TC, ang, a, s, 2.0, z0, z1));
    }
  }
  cuts.push(niche(TC, 180, hu, 0, 2.2, 0, 3.6, 0.5));
}
// Aanbouwen bij de toren: vensters in de westgevel.
for (const v of [10.5, -10.5]) cuts.push(niche([-46.45, v], 180, 0, 0, 1.6, 1.0, 2.6, 0.3));
church = church.subtract(Manifold.union(cuts));

const nodes = [["building:kerk", church]];
const all = church;

const META = {
  name: "Bovenkerk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  // Ellipsoïdische PDOK-terreinhoogte op het laagste bemonsteringspunt, als terugval buiten de uitsnede.
  groundHeight: 45.11,
  replacesBuildings: ["0166100000016074", "0166100000016070"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (191155,25, 507617,46), de viering, op het maaiveld (NAP +2,57 m), +X langs de nok van schip en koor naar het oostnoordoosten (7,8 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noordnoordwesten. Eén node building:kerk uit dakvlakken en bouwdelen: schip en koor onder één nok op +33,9 m met een zevenzijdige sluiting, dwarsschip (+34,05 m) met afgewolfde kopgevels en dakruiter, zijbeuken met vijf dwarse kappen per kant, noord- en zuidportaal, kooromgang met dwarse en straalsgewijze kappen, borstwering, steunberen, pinakels, en de westtoren met schilddak en achtzijdige naaldspits tot +72 m. Onderkant 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal, op de spitsbogen na. Vervangt de PDOK-reconstructie van de kerk en de toren. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { towerTopM: TOWER.top, towerEaveM: TOWER.eave, naveRidgeM: NAVE.ridge, transeptRidgeM: TR.ridge, aisleRidgeM: AISLE.ridge.N, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Bovenkerk_(Kampen)",
    "PDOK BAG panden 0166100000016074 (kerk) en 0166100000016070 (toren), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, goten, kilgoten, toren en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en ligging van de dwarse kappen",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons: foto's van de toren, het koor, de dakruiter en de portalen",
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

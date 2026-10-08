// Genereert een gesloten 3D-model van de Grote of Sint-Stevenskerk in Nijmegen
// uit dakvlakken en bouwdelen: een hallenkerk met schip, dwarsschip en koor onder
// één nok (+24,6 m, 56 graden), een dakruiter op de viering, de noordbeuk en de
// beuken langs het koor onder eigen zadeldaken (nok +22 m), de zuidbeuk met zes
// dwarse kappen met een schild naar de buitenmuur, dwarse kappen in de eerste
// koortravee, een koorsluiting van vijf zijden van een twaalfhoek met een
// kooromgang en zeven straalkapellen met tentdaken, kapellen, portalen en
// aanbouwen, en de westtoren: een onderbouw van 10,2 m met getrapte
// hoeksteunberen tot de omgang op +38 m, een achtkant met galmgaten, twee
// lantaarns met kappen en een spits tot +65,2 m. Elk dak is een vlak
// z = a u + b v + c uit het AHN en de LoD2.2-vlakken van de 3D BAG; de toren volgt
// de AHN-omhullende per hoogte. Het Mapbox-model is niet gebruikt. Alle maten in
// het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-stevenskerk.mjs              # 1:1000 (standaard)
//   node scripts/generate-stevenskerk.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (187768, 428930), de viering, op het maaiveld
// (NAP +28,5 m), Z omhoog. +X loopt langs de nok van schip en koor naar het
// oosten (3 graden linksom vanaf de RD-X-as) en +Y loodrecht daarop naar het
// noorden. De toren staat in het westen (hart u = -32,1 m), de straalkapellen
// eindigen op u = 41,3 m.
//
// Bronnen: PDOK BAG-pand 0268100000009359; AHN DSM/DTM 0,5 m (PDOK WCS) voor
// nokken, kappen, de toren en het maaiveld; 3D BAG LoD2.2 (api.3dbag.nl);
// Wikipedia (hallenkerk, kooromgang met zeven straalkapellen, torenspits naar
// voorbeeld van de Oude Kerk in Amsterdam); PDOK luchtfoto. Geschat zijn de
// lantaarns en kappen van de toren tussen de AHN-punten, de dakruiter, de
// straalkapellen, de kapellen en aanbouwen, de steunberen en de vensternissen.
// Weggelaten: maaswerk, de wijzerplaten, de omgangen van de lantaarns en kleine
// dakkapellen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "stevenskerk");
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

const SLUG = "stevenskerk";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +28,5 m) ----------
const GROUND_NAP = 28.5;
const ORIGIN = [187768.0, 428930.0];
const X_AXIS = [0.99863, 0.052336]; // RD-richting 3 graden, langs de nok van schip en koor
// Het maaiveld zakt naar de Grote Markt (zuidwest) tot 1,8 m onder het niveau van de bemonsteringspunten.
const BASE = -2.2;

// Schip, dwarsschip en koor van de hallenkerk onder één nok (+24,6 m, 56 graden), 11 m breed.
const T = 1.5;
const RIDGE = 24.6;
const HW = 5.5;
const EAVE = RIDGE - T * HW;
const NAVE_U0 = -27.0; // oostkant van de toren
const TR = { u0: -HW, u1: HW, v0: -24.2, v1: 24.8 };
// Koor: sluiting met vijf zijden van een twaalfhoek rond AC, kooromgang en zeven straalkapellen.
const AC = [30.0, 0];
const PHIS = [-90, -60, -30, 0, 30, 60, 90];
const AMB = { apo: 8.5, zIn: 18.0, zOut: 15.5 };
const AMB_T = (AMB.zIn - AMB.zOut) / (AMB.apo - HW);
// Noordbeuk en de beuken langs het koor: eigen zadeldak met de nok langs het schip (+22 m, 55 graden).
const NA = { v0: HW - 0.05, v1: 15.5, ridgeV: 9.75, ridge: 22.0, t: 1.45 };
// Zuidbeuk: dwarse kappen (nok +19,7 m) met een schild naar de buitenmuur.
const SA = { wall: -HW + 0.05, ridgeEnd: -12.2, out: -15.5, ridge: 19.7, t: 1.5 };
// Toren: onderbouw van 10,2 m tot de omgang op +38 m, een achtkant en twee lantaarns met een spits tot +65,2 m.
const TC = [-32.1, 0.3];

// Maaiveld (AHN NAP +28,5 tot +29 m) ten westen, oosten en zuidoosten.
const GROUND_SAMPLES = [[-42, 0], [45, 0], [25, -25]];

// ---------- kerk ----------
const solids = [];

// Schip en koor met de sluiting.
const naveChoir = [[NAVE_U0, -HW], ...ngon(AC, HW, [-75, -45, -15, 15, 45, 75], 30), [NAVE_U0, HW]];
solids.push(roofed(naveChoir, PHIS.map((p) => facetPhi(AC, p, HW, EAVE, T))));
// Dwarsschip met topgevels en portalen aan beide kopse kanten.
solids.push(roofed(rect(TR.u0, TR.u1, TR.v0, TR.v1), ridgeU(0, RIDGE - 0.2, T)));
for (const [v0, v1] of [[TR.v0, TR.v0 + 0.9], [TR.v1 - 0.9, TR.v1]]) solids.push(roofed(rect(TR.u0, TR.u1, v0, v1), ridgeU(0, RIDGE + 0.6, T)));
solids.push(roofed(rect(-4.0, 4.0, -26.8, TR.v0 + 0.1), ridgeU(0, 12.5, 1.6)));
solids.push(prism(rect(-3.5, 5.5, TR.v1 - 0.1, 28.3), BASE, 6.5));
// Dakruiter op de viering.
solids.push(loft([[21.0, oct([0, 0], 2.6)], [27.5, oct([0, 0], 2.6)], [33.0, oct([0, 0], 0.9)]]));

// Noordbeuk (van de toren tot het dwarsschip) en de beuken langs het koor, met topgevels aan het westeinde.
solids.push(roofed(rect(-37.4, TR.u0 + 0.05, NA.v0, NA.v1), ridgeV(NA.ridgeV, NA.ridge, NA.t)));
solids.push(roofed(rect(-37.6, -36.6, NA.v0, NA.v1), ridgeV(NA.ridgeV, NA.ridge + 0.6, NA.t)));
solids.push(roofed(rect(11.5, 28.0, NA.v0, NA.v1), ridgeV(10.25, 22.4, NA.t)));
solids.push(roofed(rect(11.5, 28.0, -NA.v1 + 2.4, -NA.v0), ridgeV(-9.75, 22.4, NA.t)));
// De eerste travee naast het dwarsschip heeft aan beide kanten een dwarse kap (nok +20,5 m).
for (const [w, o] of [[NA.v0, NA.v1], [-NA.v0, -NA.v1 + 2.4]]) {
  const s = Math.sign(o);
  solids.push(roofed(rect(TR.u1 - 0.05, 11.6, w - s * 0.05, o), [...ridgeU(8.5, 20.5, SA.t), [0, -s * SA.t, 15.0 + s * SA.t * o]]));
}
// Zuidbeuk: zes dwarse kappen van de toren tot het dwarsschip.
for (const [u0, u1] of [[-37.8, -33.5], [-33.5, -28.0], [-28.0, -22.3], [-22.3, -16.7], [-16.7, -11.1], [-11.1, TR.u0 + 0.05]]) {
  const um = (u0 + u1) / 2;
  solids.push(roofed(rect(u0, u1, SA.out, SA.wall), [...ridgeU(um, SA.ridge, SA.t), [0, SA.t, 15.0 - SA.t * SA.out]]));
}
// Steunberen langs de zuidbeuk.
for (const u of [-33.5, -28.0, -22.3, -16.7, -11.1]) solids.push(buttress([u, SA.out], 0, 1.0, 1.3, 11.0, 9.8));
// Kapellen en aanbouwen: ten westen van het zuidelijke dwarsschip, ten zuiden en noorden van het koor, ten noorden van het schip.
solids.push(roofed(rect(-12.8, TR.u0 + 0.05, -23.7, SA.out + 0.1), ridgeU(-9.1, 19.5, T)));
solids.push(roofed(rect(TR.u1 - 0.05, 22.5, -21.0, -13.0), ridgeV(-16.8, 17.0, 1.2)));
solids.push(prism(rect(10.0, 22.0, NA.v1 - 0.05, 19.5), BASE, 15.5));
solids.push(prism(rect(-18.6, -8.0, NA.v1 - 0.05, 25.4), BASE, 7.0));

// Kooromgang en zeven straalkapellen met tentdaken.
const amb = [[28.0, -AMB.apo], ...ngon(AC, AMB.apo, [-75, -45, -15, 15, 45, 75], 30), [28.0, AMB.apo]];
solids.push(roofed(amb, PHIS.map((p) => facetPhi(AC, p, AMB.apo, AMB.zOut, AMB_T))));
for (const phi of [-90, -60, -30, 0, 30, 60, 90]) {
  const cp = Math.cos((phi * Math.PI) / 180);
  const sp = Math.sin((phi * Math.PI) / 180);
  const at = (r, t) => [AC[0] + r * cp - t * sp, AC[1] + r * sp + t * cp];
  const half = 2.2;
  const rEnd = 11.3;
  const rc = rEnd - half;
  const k = half * Math.tan(Math.PI / 8);
  const poly = [[8.0, -half], [rc + k, -half], [rEnd, -k], [rEnd, k], [rc + k, half], [8.0, half]].map(([r, t]) => at(r, t));
  const eave = 13.5;
  const slope = 2.0;
  solids.push(
    roofed(poly, [
      facetPhi(at(rc, 0), phi, half, eave, slope),
      facetPhi(at(rc, 0), phi + 45, half, eave, slope),
      facetPhi(at(rc, 0), phi - 45, half, eave, slope),
      facetPhi(at(rc, 0), phi + 90, half, eave, slope),
      facetPhi(at(rc, 0), phi - 90, half, eave, slope),
      facetPhi(at(rc, 0), phi + 180, half, eave, slope),
    ]),
  );
}
// Steunberen tussen de kapellen.
for (const c of ngon(AC, AMB.apo + 0.3, [-75, -45, -15, 15, 45, 75], 30)) solids.push(pier(c, 0.5, 15.5, 1.6));

// De toren.
solids.push(prism(sq(TC, 5.1), BASE, 38.0));
for (const [su, sv] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
  const c = [TC[0] + su * 4.9, TC[1] + sv * 4.9];
  solids.push(loft([[BASE, sq(c, 1.0)], [20.0, sq(c, 1.0)], [20.4, sq(c, 0.75)], [33.0, sq(c, 0.75)], [33.4, sq(c, 0.5)], [38.0, sq(c, 0.5)]]));
}
solids.push(band(section(sq(TC, 5.1)), 0.8, 37.2, 39.2));
for (const [su, sv] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) solids.push(pinnacle([TC[0] + su * 4.7, TC[1] + sv * 4.7], 0.4, 39.1, 1.2, 1.8));
solids.push(
  loft([
    [37.5, oct(TC, 8.6)],
    [45.0, oct(TC, 8.6)],
    [45.4, oct(TC, 9.0)],
    [45.8, oct(TC, 9.0)],
    [48.0, oct(TC, 6.6)],
    [48.3, oct(TC, 5.4)],
    [51.0, oct(TC, 5.4)],
    [51.3, oct(TC, 5.8)],
    [51.6, oct(TC, 5.8)],
    [52.6, oct(TC, 4.2)],
    [56.8, oct(TC, 4.2)],
    [57.1, oct(TC, 4.5)],
    [57.4, oct(TC, 4.5)],
    [58.8, oct(TC, 2.6)],
    [65.2, oct(TC, 0.9)],
  ]),
);

let church = Manifold.union(solids);

// Vensternissen en galmgaten (spitsbogen).
const cuts = [];
for (const u of [-30.9, -25.2, -19.5, -13.9]) cuts.push(niche([u, 0], 270, -SA.out, 0, 2.4, 3.0, 9.5, 0.5));
for (const u of [-30.0, -24.0, -18.0, -12.0]) cuts.push(niche([u, 0], 90, NA.v1, 0, 2.6, 3.5, 11.0, 0.5));
for (const u of [24.5]) cuts.push(niche([u, 0], 90, NA.v1, 0, 2.2, 3.5, 11.0, 0.5));
cuts.push(niche([0, 0], 270, -TR.v0, 0, 4.4, 13.0, 19.0, 0.5), niche([0, 0], 90, TR.v1, 0, 4.4, 8.0, 19.0, 0.5));
for (const phi of [-60, -30, 0, 30, 60]) cuts.push(niche(AC, phi, HW, 0, 2.0, 15.6, 18.5, 0.4));
for (const phi of [-60, -30, 0, 30, 60]) cuts.push(niche(AC, phi, 11.3, 0, 1.4, 4.0, 10.0, 0.4));
for (const ang of [90, 180, 270]) {
  cuts.push(niche(TC, ang, 5.1, 0, 2.6, 26.0, 34.0, 0.5));
  cuts.push(niche(TC, ang, 5.1, 0, 2.8, 10.0, 20.0, 0.5));
}
for (const k of [0, 2, 4, 6]) cuts.push(niche(TC, k * 45, 4.3, 0, 1.8, 39.5, 43.5, 0.5));
for (const k of [0, 2, 4, 6]) cuts.push(niche(TC, k * 45, 2.7, 0, 1.2, 48.6, 50.2, 0.4));
church = church.subtract(Manifold.union(cuts));

const nodes = [["building:kerk", church]];
const all = church;

const META = {
  name: "Stevenskerk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 72.2,
  replacesBuildings: ["0268100000009359"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (187768, 428930), de viering, op het maaiveld (NAP +28,5 m), +X langs de nok van schip en koor naar het oosten (3 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden. Een node building:kerk uit dakvlakken en bouwdelen: hallenkerk onder één nok op +24,6 m met dakruiter, beuken met eigen zadeldaken en dwarse kappen, een vijfzijdige koorsluiting met kooromgang en zeven straalkapellen, kapellen en portalen, en de westtoren met omgang op +38 m, achtkant, twee lantaarns en spits tot +65,2 m. Onderkant 2,2 m onder het maaiveld omdat het terrein naar de Grote Markt daalt; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van de kerk. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { towerTopM: 65.2, galleryM: 38.0, ridgeM: RIDGE, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_of_Sint-Stevenskerk",
    "PDOK BAG pand 0268100000009359 (kerk met toren), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, kappen, toren en het maaiveld",
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

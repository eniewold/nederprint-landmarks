// Genereert een gesloten 3D-model van de Oude Kerk (Oude Jan) in Delft uit
// dakvlakken en bouwdelen: een schip en koor onder één nok (+31,8 m, 56 graden)
// met een borstwering, een koorsluiting van vijf zijden van een tienhoek met
// steunberen, een dwarsdak over de viering met een dakruiter, twee zijbeuken met
// elk een eigen zadeldak en een topgevel naar de Oude Delft, de noorderzijbeuk
// van het koor met een driezijdige sluiting, de zuiderzijbeuk van het koor met
// een schuine buitenmuur, het onvoltooide noordelijke dwarsschip met een plat
// dak, kapellen en portalen, en de scheve toren: een onderbouw van 14,8 m die tot
// de knik (+33 m) 0,8 m naar het westen helt en daarboven recht is doorgebouwd,
// galmgaten, vier achtkantige hoektorentjes en een gemetselde achtkantige spits
// tot +76,1 m, waarvan de top 2,1 m ten westen van het hart van de voet staat.
// Elk dak is een vlak z = a u + b v + c uit het AHN en de LoD2.2-vlakken van de
// 3D BAG. Het Mapbox-model is niet gebruikt. Alle maten in het script zijn
// meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-oude-kerk-delft.mjs              # 1:1000 (standaard)
//   node scripts/generate-oude-kerk-delft.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (84192,5, 447635,2), in het schip, op het
// maaiveld (NAP +1,7 m), Z omhoog. +X loopt langs de nok van schip en koor naar
// het oosten (8,3 graden linksom vanaf de RD-X-as) en +Y loodrecht daarop naar
// het noorden. De toren staat in het westen aan de Oude Delft (hart van de voet
// u = -24,8 m), de koorsluiting eindigt op u = 49,75 m.
//
// Bronnen: PDOK BAG-pand 0503100000022523 (kerk met toren); AHN DSM/DTM 0,5 m
// (PDOK WCS) voor nokken, goten, de toren en het maaiveld; 3D BAG LoD2.2
// (api.3dbag.nl) voor hellingen en richting; Wikipedia (75 m, 1,96 m uit het
// lood, knik); PDOK luchtfoto; foto's op Wikimedia Commons. Geschat zijn de
// hoogte van de knik, de geledingen van de toren en de hoektorentjes, de
// dakruiter, de steunberen, de portalen en de vensternissen en galmgaten.
// Weggelaten: maaswerk, de wijzerplaten, kruisbloemen, de klokkenstoel en de
// dakramen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "oude-kerk-delft");
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

const SLUG = "oude-kerk-delft";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +1,7 m) ----------
const GROUND_NAP = 1.7;
const ORIGIN = [84192.5, 447635.2];
const X_AXIS = [0.989526, 0.144356]; // RD-richting 8,3 graden, langs de nok van schip en koor
const BASE = -0.5;

// Schip en koor onder één zadeldak (AHN: nok +31,8 m, 56 graden).
const T = 1.5;
const RIDGE = 31.8;
const RV = 0.15; // as van schip en koor
const HW = 7.75; // halve breedte tot de buitenkant van de muur (zuidmuur v = -7,6, noordmuur v = +7,9)
const EAVE = RIDGE - T * HW;
const PARAPET = 22.0;
const NAVE_U0 = -19.6; // oostkant van de toren
// Koor: sluiting met vijf zijden van een tienhoek rond AC.
const AC = [42.0, RV];
const PHIS = [-90, -72, -36, 0, 36, 72, 90];
const apsePoly = (c, apo, phis) =>
  phis.slice(1).map((p, i) => {
    const a = ((p + phis[i]) / 2) * (Math.PI / 180);
    const r = apo / Math.cos(((p - phis[i]) / 2) * (Math.PI / 180));
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  });
// Toren: onderbouw van 14,8 m in het vierkant, tot +33 m scheef naar het westen (de gedempte Oude Delft),
// daarboven recht doorgebouwd (de knik); de spits staat 2,1 m ten westen van het hart van de voet.
const TB = [-24.8, RV]; // hart van de voet
const KNIK = 33.0;
const LEAN = -0.8; // verschuiving langs u op de knik
const TU = [TB[0] + LEAN, RV]; // hart boven de knik
const TOWER_TOP = 46.0;

// Maaiveld (AHN NAP +1,6 tot +1,7 m) aan de Oude Delft, de noordzijde en achter het koor.
const GROUND_SAMPLES = [[-38, 0], [-10, 26], [52, 0]];

// ---------- kerk ----------
const solids = [];

// Schip en koor met de sluiting en een borstwering langs de goot.
const naveChoir = [[NAVE_U0, RV - HW], ...apsePoly(AC, HW, PHIS), [NAVE_U0, RV + HW]];
solids.push(roofed(naveChoir, PHIS.map((p) => facetPhi(AC, p, HW, EAVE, T))));
solids.push(band(section(naveChoir), 0.8, EAVE - 1, PARAPET));
// Steunberen op de hoeken van de sluiting, tot onder de goot.
for (const [u, v] of apsePoly(AC, HW, PHIS).slice(1, -1)) solids.push(pier([u, v], 0.6, 18.5, 1.6));

// Viering: een dwarsdak met de nok langs v op u = 16,7 m (+31,8 m) over het schip, met een topgevel aan de zuidkant,
// en een dakruiter met een spits tot +39,8 m.
solids.push(roofed(rect(9.9, 23.5, RV - HW, RV + HW), ridgeU(16.7, RIDGE, T)));
solids.push(roofed(rect(9.9, 23.5, RV - HW, RV - HW + 1.0), ridgeU(16.7, RIDGE + 0.8, T)));
solids.push(loft([[29.0, oct([16.9, 0.5], 2.6)], [34.8, oct([16.9, 0.5], 2.6)], [39.8, oct([16.9, 0.5], 0.9)]]));
// Noordelijk dwarsschip (natuursteen, onvoltooid): plat dak op +27 m, steunberen met pinakels aan de noordgevel.
solids.push(prism(rect(9.8, 23.6, RV + HW - 0.1, 33.7), BASE, 27.0));
for (const u of [10.6, 22.75]) {
  solids.push(prism(rect(u - 0.6, u + 0.6, 33.6, 35.8), BASE, 21.0));
  solids.push(pinnacle([u, 35.2], 0.55, 20.9, 4.0, 2.4));
}
solids.push(prism(rect(9.8, 23.6, 33.0, 33.7), BASE, 27.8));

// Noorderzijbeuk van het schip: eigen zadeldak (nok +21,5 m op v = 13,5 m) met een topgevel naar de Oude Delft.
const NA = { v0: RV + HW - 0.1, v1: 21.1, ridgeV: 13.5, ridge: 21.5, t: 1.6 };
solids.push(roofed(rect(-31.0, 9.85, NA.v0, NA.v1), ridgeV(NA.ridgeV, NA.ridge, NA.t)));
solids.push(roofed(rect(-31.5, -30.4, NA.v0, NA.v1), ridgeV(NA.ridgeV, NA.ridge + 0.8, NA.t)));
// Zuiderzijbeuk van het schip: nok +18,8 m op v = -11,75 m, topgevel naar het westen.
const SA = { v0: -16.9, v1: RV - HW + 0.1, ridgeV: -11.75, ridge: 18.8, t: 1.7 };
solids.push(roofed(rect(-29.4, 18.4, SA.v0, SA.v1), ridgeV(SA.ridgeV, SA.ridge, SA.t)));
solids.push(roofed(rect(-30.3, -29.3, SA.v0, SA.v1), ridgeV(SA.ridgeV, SA.ridge + 0.8, SA.t)));
// Steunberen langs beide zijbeuken.
for (const u of [-25.3, -19.8, -14.1, -8.8, -3.8]) solids.push(buttress([u, NA.v1], 180, 1.0, 1.2, 8.8, 7.6));
for (const u of [-15.05, -9.9, -5.45, -0.2, 5.6, 11.5, 17.75]) solids.push(buttress([u, SA.v0], 0, 1.0, 1.1, 8.2, 7.0));

// Noorderzijbeuk van het koor met een driezijdige sluiting (nok +22 m op v = 12,3 m).
{
  const p = [[23.55, RV + HW - 0.1], [43.0, RV + HW - 0.1], [46.5, 9.9], [46.9, 13.6], [44.9, 16.9], [41.3, 18.3], [23.55, 18.4]];
  const eave = 22.0 - 1.6 * (18.4 - 12.3);
  const inside = [40, 12.3];
  solids.push(
    roofed(p, [
      ...ridgeV(12.3, 22.0, 1.6),
      facet(p[2], p[3], eave, 1.6, inside),
      facet(p[3], p[4], eave, 1.6, inside),
      facet(p[4], p[5], eave, 1.6, inside),
    ]),
  );
}
// Kapel ten noordoosten: zadeldak met de nok op +19 m, een hoge noordmuur (+17,7 m).
solids.push(roofed(rect(23.55, 34.2, 18.3, 26.2), [[0, 1.6, 19.0 - 1.6 * 21.6], [0, -0.3, 19.0 + 0.3 * 21.6]]));
// Zuiderzijbeuk van het koor: nok +17,2 m op v = -9,6 m, de buitenmuur loopt schuin naar de sluiting.
{
  const p = [[18.4, RV - HW + 0.1], [18.4, -13.3], [23.6, -13.5], [34.7, -12.4], [44.7, -9.6], [43.4, -7.3]];
  const inside = [30, -9.6];
  solids.push(roofed(p, [[0, -1.5, 17.2 - 1.5 * 9.6], facet(p[1], p[4], 12.0, 1.5, inside), facet(p[4], p[5], 12.0, 1.5, inside)]));
}
// Lage aanbouw ten zuiden van het koor (+6 m) en de noordkapel tegen het dwarsschip.
solids.push(prism(rect(18.3, 23.4, -16.9, -13.2), BASE, 6.0));
solids.push(roofed(rect(0.0, 6.2, NA.v1 - 0.1, 25.8), ridgeU(3.1, 12.4, 1.4)));
solids.push(roofed(rect(6.0, 9.85, NA.v1 - 0.1, 25.8), [[1.6, 0, 9.4 - 1.6 * 6.0]]));
// Achtkantig portaal tegen de zuidwesthoek met een tentdak tot +9,7 m.
{
  const p = [[-29.2, -16.5], [-28.0, -21.0], [-26.9, -24.4], [-25.0, -25.9], [-22.6, -25.6], [-21.3, -23.6], [-21.9, -20.0], [-21.5, -16.5]];
  solids.push(Manifold.hull([...p.map(([x, y]) => [x, y, BASE]), ...p.map(([x, y]) => [x, y, 4.5]), [-24.7, -21.4, 9.7]]));
}

// De toren. Onderbouw tot de knik (scheef), daarboven recht tot +46 m.
const shear = (m, k) => m.transform([1, 0, 0, 0, 0, 1, 0, 0, k, 0, 1, 0, 0, 0, 0, 1]);
const k = LEAN / KNIK;
const lower = [
  prism(sq(TB, 7.4), BASE, KNIK),
  // Steunberen op de westhoeken, in drie stappen teruggezet.
  ...[-1, 1].map((s) =>
    loft([
      [BASE, sq([TB[0] - 7.4, TB[1] + s * 7.4], 1.1)],
      [12.0, sq([TB[0] - 7.4, TB[1] + s * 7.4], 1.1)],
      [12.6, sq([TB[0] - 7.4, TB[1] + s * 7.4], 0.85)],
      [24.0, sq([TB[0] - 7.4, TB[1] + s * 7.4], 0.85)],
      [24.6, sq([TB[0] - 7.4, TB[1] + s * 7.4], 0.6)],
      [KNIK, sq([TB[0] - 7.4, TB[1] + s * 7.4], 0.6)],
    ]),
  ),
  // Westportaal van de toren.
  roofed(rect(-34.0, TB[0] - 7.0, -3.3, 2.8), [[0, -2.0, 9.0 + 2.0 * RV], [0, 2.0, 9.0 - 2.0 * RV]]),
];
solids.push(shear(Manifold.union(lower), k));
solids.push(prism(sq(TU, 7.35), KNIK - 0.3, TOWER_TOP));
// Bovenste geleding (12,8 m) met de klokkenstoel.
solids.push(prism(sq(TU, 6.4), TOWER_TOP - 0.3, 51.5));
// Vier achtkantige hoektorentjes met spitsen tot +61 m.
for (const [du, dv] of [[-4.4, -4.4], [-4.4, 4.4], [4.4, -4.4], [4.4, 4.4]]) {
  const c = [TU[0] + du, TU[1] + dv];
  solids.push(loft([[TOWER_TOP - 1.0, oct(c, 3.0)], [53.0, oct(c, 3.0)], [61.0, oct(c, 0.9)]]));
}
// Gemetselde achtkantige spits tot +76,1 m, met de top iets verder naar het westen.
const APEX = [TB[0] - 2.1, RV];
solids.push(
  loft([
    [51.2, oct(TU, 9.0)],
    [53.5, oct([TU[0] - 0.1, RV], 8.0)],
    [76.1, oct(APEX, 0.9)],
  ]),
);
for (const [du, dv] of [[0, -4.6], [0, 4.6], [-4.6, 0], [4.6, 0]]) solids.push(pinnacle([TU[0] + du, TU[1] + dv], 0.5, 51.2, 1.4, 2.0));

let church = Manifold.union(solids);

// Vensternissen en galmgaten (spitsbogen).
const cuts = [];
// Zijbeuken: een venster per travee.
for (const u of [-28.0, -22.5, -17.0, -11.4, -6.3, -1.0]) cuts.push(niche([u, 0], 90, NA.v1, 0, 2.6, 3.0, 9.5, 0.5));
for (const u of [-12.5, -7.7, -2.8, 2.7, 8.5, 14.6]) cuts.push(niche([u, 0], 270, -SA.v0, 0, 2.8, 3.0, 9.0, 0.5));
// Westgevels van de zijbeuken en de noordgevel van het dwarsschip.
cuts.push(niche([0, NA.ridgeV], 180, 31.5, 0, 3.6, 4.0, 13.5, 0.5));
cuts.push(niche([0, SA.ridgeV], 180, 30.3, 0, 3.0, 3.5, 11.5, 0.5));
cuts.push(niche([16.7, 0], 90, 33.7, 0, 5.6, 7.0, 19.0, 0.5));
// Koorsluiting: hoge vensters in elke zijde.
for (const phi of [-72, -36, 0, 36, 72]) cuts.push(niche(AC, phi, HW, 0, 2.6, 7.0, 16.5, 0.5));
// Toren: twee galmgaten per zijde in de bovenste geleding van de onderbouw.
for (const [ang, a] of [[0, 7.35], [90, 7.35], [180, 7.35], [270, 7.35]]) {
  for (const s of [-3.0, 3.0]) {
    cuts.push(niche(TU, ang, a, s, 2.4, 36.0, 42.6, 0.6));
  }
}
// Dwarsschip: twee vensters in de oost- en westgevel boven de zijbeuken.
for (const v of [24.5, 30.0]) cuts.push(niche([0, v], 180, -9.8, 0, 2.6, 13.0, 21.0, 0.5), niche([0, v], 0, 23.6, 0, 2.6, 13.0, 21.0, 0.5));
// Onderbouw van de toren: twee hoge blinde bogen per zijde (het hart schuift met de scheefstand mee).
for (const [ang, a] of [[180, 7.4], [90, 7.4], [270, 7.4]]) {
  for (const s of [-3.2, 3.2]) cuts.push(niche([TB[0] + k * 20, RV], ang, a, s, 2.8, 15.0, 25.0, 0.5));
}
church = church.subtract(Manifold.union(cuts));

const nodes = [["building:kerk", church]];
const all = church;

const META = {
  name: "Oude Kerk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 45.19,
  replacesBuildings: ["0503100000022523"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (84192,5, 447635,2), in het schip, op het maaiveld (NAP +1,7 m), +X langs de nok van schip en koor naar het oosten (8,3 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noorden. Een node building:kerk uit dakvlakken en bouwdelen: schip en koor onder één nok op +31,8 m met een borstwering en een vijfzijdige sluiting, een dwarsdak met dakruiter over de viering, zijbeuken met eigen zadeldaken en topgevels, het onvoltooide noordelijke dwarsschip met een plat dak op +27 m, kapellen en portalen, en de scheve toren: tot de knik op +33 m 0,8 m naar het westen hellend, daarboven recht, met galmgaten, vier hoektorentjes en een achtkantige spits tot +76,1 m, 2,1 m ten westen van het hart van de voet. Onderkant 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan (bijna) verticaal. Vervangt de PDOK-reconstructie van de kerk en de toren. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { naveRidgeM: RIDGE, towerTopM: 76.1, towerOutOfPlumbM: 2.1, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Oude_Kerk_%28Delft%29",
    "PDOK BAG pand 0503100000022523 (kerk met toren), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, goten, de toren en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's van alle zijden",
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

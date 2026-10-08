// Genereert een gesloten 3D-model van Kasteel Hoensbroek uit dakvlakken en
// bouwdelen, in twee nodes. De hoofdburcht (building:kasteel): de hoge ronde
// toren met een klokvormige spits, lantaarn en uitje, de vierkante zuidtoren met
// een geknikte spits, de twee gedrongen poorttorens met een koepel en lantaarn
// aan weerszijden van de ingang, het westpaviljoen en de oostvleugel met
// schilddaken, de lagere noordoost- en zuidwestvleugel met zadeldaken, het lage
// ronde torentje aan de zuidwestgevel, de binnenplaats, het ingangsportaal met
// fronton en de brug naar de voorhof. De voorburcht (building:voorburcht): de
// west-, noord-, midden- en oostvleugel om de twee pleinen met zadeldaken,
// schilden en topgevels, de lage doorgang in de noordvleugel, de poorttoren met
// lantaarn en uitje in de middenvleugel, de zuidvleugel van de buitenste
// voorburcht (8,3 graden gedraaid), de poorttoren met geknikte tentspits op de
// zuidwesthoek en de buitenste brug. Elk dak is een vlak z = a u + b v + c uit
// het AHN en de LoD2.2-vlakken van de 3D BAG. Het Mapbox-model is niet gebruikt.
// Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, nodes met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal> (los en met grondplaat).
//
//   node scripts/generate-kasteel-hoensbroek.mjs              # 1:1000 (standaard)
//   node scripts/generate-kasteel-hoensbroek.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (192348, 325340), midden in de hoofdburcht (de
// binnenplaats ligt op u -12 tot 3 m, v -4 tot 5 m), op het water van de
// slotgracht (NAP +69,2 m), Z omhoog. +X loopt langs de noordoostgevel van de
// hoofdburcht naar het oostzuidoosten (38,8 graden rechtsom vanaf de RD-X-as,
// gemeten aan de nokken en de LoD2.2-dakvlakken) en +Y loodrecht daarop naar de
// voorburcht (noordnoordoost). De hoofdburcht staat rondom in de gracht; het
// model begint 1 m onder het water. De pleinen van de voorburcht liggen op +2 m,
// de binnenplaats van de hoofdburcht op +3 m.
//
// Bronnen: PDOK BAG-panden 0917100000006365 (hoofdburcht), 0917100000006362 en
// 0917100000006363 (voorburcht); AHN DSM/DTM 0,5 m (PDOK WCS) voor de nokken,
// goten, torens, binnenplaats, bruggen en het water (de BAG-contour van de
// hoofdburcht ligt tot 2 m naast het AHN; de maten volgen het AHN); 3D BAG
// LoD2.2 (api.3dbag.nl); Wikipedia; PDOK luchtfoto; foto's op Wikimedia Commons
// vanaf de zuidwest-, zuid-, oost-, noordoost- en noordkant en van de pleinen.
// Geschat zijn de vormen van de spitsen, koepels, lantaarns en uitjes (het AHN
// ziet de steile leien slecht: hoogtes uit het AHN, profiel van foto's), de
// dakkapellen, schoorstenen, vensternissen, poortbogen en de bogen onder de
// bruggen. Weggelaten: de losse wachttoren aan de westkant (eigen pand
// 0917100000006361, blijft PDOK-model), de kademuren en borstweringen langs de
// pleinen (lager dan 0,9 m boven het terrein), de luiken, de vensterkruisen en
// de windvanen (dunner dan 0,9 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-hoensbroek");
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

const SLUG = "kasteel-hoensbroek";

// ---------- maten (lokaal stelsel, z = hoogte boven het water van de slotgracht op NAP +69,2 m) ----------
const GROUND_NAP = 69.2;
const ORIGIN = [192348.0, 325340.0];
const X_AXIS = [0.779338, -0.626604]; // RD-richting -38,8 graden, langs de noordoostgevel van de hoofdburcht
// De hoofdburcht staat rondom in de gracht; het model begint 1 m onder het water.
const BASE = -1.0;
const COURT = 3.0; // binnenplaats van de hoofdburcht en bruggendek (NAP +72,2 m)
const YARD = 2.0; // pleinen van de voorburcht (NAP +71,2 m)

// Ronde veelhoek en vensternis in een gevelpunt [u, v] met de normaal naar 'angle' (0 = +u, 90 = +v).
const circ = ([cx, cy], r, n = 32) =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)]);
const win = (p, angle, w, z0, z1, d = 0.4) => niche(p, angle, 0, 0, w, z0, z1, d);
// Schilddak: rechthoek met goot zE en hellingen tU (lange zijden langs v, dus vlakken naar +-u) en tV.
const hipped = (u0, u1, v0, v1, zE, tU, tV) =>
  roofed(rect(u0, u1, v0, v1), [[tU, 0, zE - tU * u0], [-tU, 0, zE + tU * u1], [0, tV, zE - tV * v0], [0, -tV, zE + tV * v1]]);
// Dakkapel met een zadeldakje: front op de dakhelling, nok zr, breedte w; naar -u/+u (alongU) of -v/+v.
const dormerU = (uA, uB, v, w, zr) => roofed(rect(Math.min(uA, uB), Math.max(uA, uB), v - w / 2, v + w / 2), ridgeV(v, zr, 1.6));
const dormerV = (u, vA, vB, w, zr) => roofed(rect(u - w / 2, u + w / 2, Math.min(vA, vB), Math.max(vA, vB)), ridgeU(u, zr, 1.6));
const chimney = (c, z, h = 0.5) => prism(sq(c, h), BASE, z);
// Uitje met lantaarn op een torendak: lantaarn (achtkant, breedte lw) van z0 tot z1, peer en spits.
const lantern = (c, z0, lw, z1, bulb) =>
  loft([[z0, oct(c, lw)], [z1, oct(c, lw)], [z1 + 0.5, oct(c, bulb)], [z1 + 1.2, oct(c, bulb)], [z1 + 1.9, oct(c, 0.9)], [z1 + 3.0, tip(c)]]);

// ---------- hoofdburcht ----------
// Westpaviljoen met schilddak (nok langs v op u = -19 m, +21,8 m), oostvleugel met schilddak (nok op u = 11,55 m, +22,2 m).
const WPAV = { u0: -25.7, u1: -12.3, v0: -10.7, v1: 9.2, eave: 14.77, t: 1.05 };
const EWING = { u0: 3.3, u1: 19.8, v0: -10.7, v1: 10.0, ridgeU: 11.55, ridge: 22.2, t: 1.0, tEnd: 1.45 };
// Noordoostvleugel tussen de poorttorens (nok langs u op v = 8,4 m, +16,2 m) en zuidwestvleugel (nok op v = -7,4 m, +15,3 m).
const NEWING = { u0: -8.0, u1: 3.0, v0: 5.0, v1: 11.8, ridgeV: 8.4, ridge: 16.2, t: 1.3 };
const SWWING = { u0: -13.0, u1: 3.6, v0: -10.6, v1: -4.2, ridgeV: -7.4, ridge: 15.3, t: 1.1 };
// Torens: de twee poorttorens (8,6 m, muren tot +17,6 m), de zuidtoren (muren tot +22 m), de ronde toren (straal 5,3 m, tot +26,3 m)
// en het lage ronde torentje aan de zuidwestgevel.
const DOMES = [[-11.8, 10.2], [6.3, 10.1]];
const DOME_HALF = 4.3;
const DOME_WALL = 17.6;
const STOWER = { c: [18.1, -13.2], hu: 4.8, hv: 4.5, wall: 22.0 };
const ROUND = { c: [-26.7, -10.4], r: 5.3, wall: 26.3 };
const SMALL = { c: [-5.0, -13.4], r: 3.9, wall: 7.9, top: 11.6 };
// Brug van de voorhof naar het portaal (dek +3 m) met borstweringen.
const BRIDGE = { u0: -6.0, u1: -0.5, v0: 11.8, v1: 27.6 };
const PORTAL_U = -3.25;

// Maaiveld: het water van de slotgracht ten zuiden, westen en oosten van de hoofdburcht (NAP +69,2 m).
const GROUND_SAMPLES = [[0, -22], [-40, -10], [30, 0]];

const castle = [];
castle.push(hipped(WPAV.u0, WPAV.u1, WPAV.v0, WPAV.v1, WPAV.eave, WPAV.t, WPAV.t));
castle.push(
  roofed(rect(EWING.u0, EWING.u1, EWING.v0, EWING.v1), [
    ...ridgeU(EWING.ridgeU, EWING.ridge, EWING.t),
    [0, EWING.tEnd, EWING.ridge - EWING.t * (EWING.u1 - EWING.ridgeU) - EWING.tEnd * EWING.v0],
    [0, -EWING.tEnd, EWING.ridge - EWING.t * (EWING.u1 - EWING.ridgeU) + EWING.tEnd * EWING.v1],
  ]),
);
castle.push(roofed(rect(NEWING.u0, NEWING.u1, NEWING.v0, NEWING.v1), ridgeV(NEWING.ridgeV, NEWING.ridge, NEWING.t)));
castle.push(roofed(rect(SWWING.u0, SWWING.u1, SWWING.v0, SWWING.v1), ridgeV(SWWING.ridgeV, SWWING.ridge, SWWING.t)));
// Binnenplaats.
castle.push(prism(rect(-12.3, 3.3, -4.2, 5.0), BASE, COURT));

// Poorttorens: een laag tentdak, een klokvormige koepel, een lantaarn en een uitje.
for (const c of DOMES) {
  castle.push(prism(sq(c, DOME_HALF), BASE, DOME_WALL));
  castle.push(loft([[DOME_WALL, sq(c, DOME_HALF)], [19.0, sq(c, 2.95)]]));
  castle.push(
    loft([
      [18.9, circ(c, 2.8, 24)],
      [19.8, circ(c, 2.95, 24)],
      [21.0, circ(c, 2.7, 24)],
      [22.3, circ(c, 2.0, 24)],
      [23.2, circ(c, 1.1, 24)],
      [23.5, circ(c, 0.75, 24)],
    ]),
  );
  castle.push(lantern(c, 23.2, 1.5, 25.0, 1.9));
}
// Zuidtoren: muren tot +22 m, een geknikte spits tot +35,6 m en een lantaarn met een uitje.
{
  const { c, hu, hv, wall } = STOWER;
  const box = (du, dv) => rect(c[0] - du, c[0] + du, c[1] - dv, c[1] + dv);
  castle.push(prism(box(hu, hv), BASE, wall));
  castle.push(loft([[wall, box(hu, hv)], [23.4, box(hu - 1.2, hv - 1.2)], [26.6, box(2.3, 2.1)], [35.6, box(0.6, 0.6)]]));
  castle.push(lantern(c, 34.6, 1.3, 36.6, 1.7));
}
// Ronde toren: muren tot +26,3 m, een klokvormige spits tot +40,8 m, lantaarn en uitje tot +44,5 m.
{
  const { c, r, wall } = ROUND;
  castle.push(loft([[BASE, circ(c, r, 48)], [wall, circ(c, r, 48)], [28.4, circ(c, 3.0, 48)], [34.5, circ(c, 2.0, 32)], [40.8, circ(c, 0.8, 16)]]));
  castle.push(lantern(c, 40.0, 1.6, 41.5, 2.0));
  // Vier dakkapelletjes in de knik van de spits.
  for (const a of [45, 135, 225, 315]) {
    castle.push(dormerU(2.6, 4.7, 0, 1.0, 29.0).rotate([0, 0, a]).translate([c[0], c[1], 0]));
  }
}
// Laag rond torentje met een kegeldak.
{
  const { c, r, wall, top } = SMALL;
  castle.push(loft([[BASE, circ(c, r, 40)], [wall, circ(c, r, 40)], [top, circ(c, 0.35, 12)]]));
}

// Dakkapellen: westpaviljoen (west en noord), noordoostvleugel (naar de brug), zuidwestvleugel en oostvleugel (oost).
for (const v of [-4.0, 2.0]) castle.push(dormerU(-23.4, -20.6, v, 1.2, 19.0));
for (const u of [-21.0, -17.6]) castle.push(dormerV(u, 6.6, 3.8, 1.2, 19.1));
for (const u of [-6.2, -3.25, -0.3]) castle.push(dormerV(u, 10.9, 9.0, 1.2, 14.4));
for (const u of [-10.4, -0.9, 1.9]) castle.push(dormerV(u, -9.7, -7.9, 1.2, 14.2));
for (const v of [-4.0, 0.0, 4.0]) castle.push(dormerU(17.1, 14.4, v, 1.2, 18.3));
// Schoorstenen.
for (const [c, z] of [[[13.0, 2.0], 24.2], [[13.0, -4.5], 24.2], [[-1.0, 8.4], 17.8], [[-11.8, 13.6], 22.6], [[9.6, 12.8], 22.6], [[-19.0, 2.0], 23.4], [[21.8, -9.6], 29.5]]) {
  castle.push(chimney(c, z));
}
// Portaal met een stenen omlijsting en een fronton, en de brug met borstweringen.
castle.push(roofed(rect(PORTAL_U - 2.0, PORTAL_U + 2.0, 11.0, 12.3), ridgeU(PORTAL_U, 9.6, 0.5)));
castle.push(prism(rect(BRIDGE.u0, BRIDGE.u1, BRIDGE.v0, BRIDGE.v1), BASE, COURT));
for (const [u0, u1] of [[BRIDGE.u0, BRIDGE.u0 + 0.9], [BRIDGE.u1 - 0.9, BRIDGE.u1]]) castle.push(prism(rect(u0, u1, BRIDGE.v0, BRIDGE.v1), BASE, COURT + 1.0));

let hoofdburcht = Manifold.union(castle);

// Vensternissen in de buitengevels en de torens, de poort en blinde bogen onder de brug.
const castleCuts = [];
const rowsMain = [[3.6, 5.8], [7.6, 9.8], [11.4, 12.8]];
for (const v of [-2.5, 1.5, 5.5]) for (const [z0, z1] of rowsMain) castleCuts.push(win([WPAV.u0, v], 180, 1.2, z0, z1));
for (const u of [-23.8, -20.6]) for (const [z0, z1] of rowsMain) castleCuts.push(win([u, WPAV.v1], 90, 1.2, z0, z1));
for (const u of [-19.2, -15.6]) for (const [z0, z1] of rowsMain) castleCuts.push(win([u, WPAV.v0], 270, 1.2, z0, z1));
for (const v of [-6.0, -2.0, 2.0, 6.0]) for (const [z0, z1] of rowsMain) castleCuts.push(win([EWING.u1, v], 0, 1.2, z0, z1));
for (const u of [13.0, 16.6]) for (const [z0, z1] of rowsMain) castleCuts.push(win([u, EWING.v1], 90, 1.2, z0, z1));
for (const u of [-11.0, 0.5, 2.6]) for (const [z0, z1] of [[3.6, 5.6], [7.4, 9.4]]) castleCuts.push(win([u, SWWING.v0], 270, 1.1, z0, z1));
for (const u of [-6.4, -0.1]) for (const [z0, z1] of [[5.0, 6.6], [8.0, 9.6]]) castleCuts.push(win([u, NEWING.v1], 90, 1.1, z0, z1));
// Zuidtoren: twee rijen van vier vensters op de zuid- en oostgevel, een op de westgevel.
{
  const { c, hu, hv } = STOWER;
  for (const [z0, z1] of [[5.0, 7.0], [9.0, 11.0], [13.0, 15.0], [17.0, 19.0]]) {
    for (const s of [-2.0, 2.0]) {
      castleCuts.push(win([c[0] + s, c[1] - hv], 270, 1.2, z0, z1), win([c[0] + hu, c[1] + s], 0, 1.2, z0, z1));
    }
    castleCuts.push(win([c[0] - hu, c[1] - 2.3], 180, 1.2, z0, z1));
  }
}
// Poorttorens: twee kolommen op de noordgevel en een op de vrije zijgevel.
for (const [c, side] of [[DOMES[0], 180], [DOMES[1], 0]]) {
  for (const [z0, z1] of [[4.6, 6.6], [8.6, 10.6], [12.6, 14.6]]) {
    for (const s of [-1.8, 1.8]) castleCuts.push(win([c[0] + s, c[1] + DOME_HALF], 90, 1.1, z0, z1));
    castleCuts.push(win([c[0] + (side === 0 ? DOME_HALF : -DOME_HALF), c[1] + 2.0], side, 1.1, z0, z1));
  }
}
// Ronde toren en het lage torentje: vensters naar buiten.
for (const a of [165, 215, 265]) for (const z of [6.0, 11.0, 16.0, 21.0]) castleCuts.push(niche(ROUND.c, a, ROUND.r, 0, 1.0, z, z + 1.6, 0.4));
for (const a of [230, 270, 310]) castleCuts.push(niche(SMALL.c, a, SMALL.r, 0, 1.0, 3.4, 5.2, 0.4));
// Poort in het portaal en blinde bogen in beide flanken van de brug.
castleCuts.push(win([PORTAL_U, 12.3], 90, 2.4, COURT, 6.0, 0.8));
for (const v of [15.5, 19.7, 23.9]) {
  castleCuts.push(win([BRIDGE.u1, v], 0, 2.2, -0.4, 0.8), win([BRIDGE.u0, v], 180, 2.2, -0.4, 0.8));
}
hoofdburcht = hoofdburcht.subtract(Manifold.union(castleCuts));

// ---------- voorburcht ----------
// Westvleugel (nok langs v op u = -86,7 m, +15,4 m) en noordvleugel van de buitenste voorburcht (nok op v = 56,35 m, +17,4 m).
const WWING = { u0: -90.8, u1: -82.6, v0: 2.5, v1: 52.0, ridgeU: -86.7, ridge: 15.4, t: 1.4 };
const NWW = { u0: -90.8, u1: -54.5, v0: 49.5, v1: 63.2, ridgeV: 56.35, ridge: 17.4, t: 1.16, tHip: 1.4 };
// Lage doorgang in de noordvleugel (nok +10,3 m, 32 graden).
const PASS = { u0: -55.0, u1: -46.0, v0: 49.5, v1: 63.2, ridgeV: 56.35, ridge: 10.3, t: 0.62 };
// Noordvleugel van de binnenste voorburcht (nok op v = 57,1 m, +18,4 m) met schilden aan beide kanten.
const NWE = { u0: -46.5, u1: 13.4, v0: 51.3, v1: 62.9, ridgeV: 57.1, ridge: 18.4, t: 1.3, tWest: 1.6 };
// Middenvleugel tussen de pleinen (nok op u = -42,05 m, +15,9 m) met een topgevel aan de gracht en een poorttoren.
const MWING = { u0: -46.5, u1: -37.6, v0: 26.2, v1: 52.0, ridgeU: -42.05, ridge: 15.9, t: 1.3 };
const MTOWER = { u0: -46.7, u1: -37.4, v0: 35.5, v1: 41.5, wall: 17.0, t: 1.6 };
// Oostvleugel van de binnenste voorburcht (nok op u = 9,15 m, +15,6 m) met schilden.
const EVB = { u0: 4.9, u1: 13.4, v0: 26.8, v1: 67.3, ridgeU: 9.15, ridge: 15.6, t: 1.25, tS: 1.4, tN: 1.3 };
// Zuidvleugel van de buitenste voorburcht: 8,3 graden gedraaid rond P, nok +10,9 m, schild aan de oostkant.
const SVB = { p: [-74.0, 1.5], ang: 8.3, s0: -15.6, s1: 14.6, hw: 3.3, ridge: 10.9, t: 1.12 };
// Poorttoren op de zuidwesthoek: muren tot +11,6 m, geknikte tentspits tot +17,9 m; buitenste brug (dek +3 m).
const GATE = { c: [-87.4, 5.85], hu: 3.8, hv: 3.55, wall: 11.6 };
const OBRIDGE = { u0: -104.0, u1: -91.0, v0: 3.6, v1: 8.1 };

const outer = [];
const eaveOf = (w) => w.ridge - w.t * (w.u1 - w.ridgeU);
outer.push(roofed(rect(WWING.u0, WWING.u1, WWING.v0, WWING.v1), ridgeU(WWING.ridgeU, WWING.ridge, WWING.t)));
{
  const e = NWW.ridge - NWW.t * (NWW.v1 - NWW.ridgeV);
  outer.push(roofed(rect(NWW.u0, NWW.u1, NWW.v0, NWW.v1), [...ridgeV(NWW.ridgeV, NWW.ridge, NWW.t), [NWW.tHip, 0, e - NWW.tHip * NWW.u0]]));
}
outer.push(roofed(rect(PASS.u0, PASS.u1, PASS.v0, PASS.v1), ridgeV(PASS.ridgeV, PASS.ridge, PASS.t)));
{
  const e = NWE.ridge - NWE.t * (NWE.v1 - NWE.ridgeV);
  outer.push(roofed(rect(NWE.u0, NWE.u1, NWE.v0, NWE.v1), [...ridgeV(NWE.ridgeV, NWE.ridge, NWE.t), [NWE.tWest, 0, e - NWE.tWest * NWE.u0], [-NWE.t, 0, e + NWE.t * NWE.u1]]));
}
outer.push(roofed(rect(MWING.u0, MWING.u1, MWING.v0, MWING.v1), ridgeU(MWING.ridgeU, MWING.ridge, MWING.t)));
{
  const e = eaveOf(EVB);
  outer.push(roofed(rect(EVB.u0, EVB.u1, EVB.v0, EVB.v1), [...ridgeU(EVB.ridgeU, EVB.ridge, EVB.t), [0, EVB.tS, e - EVB.tS * EVB.v0], [0, -EVB.tN, e + EVB.tN * EVB.v1]]));
}
// Poorttoren in de middenvleugel: schilddak, lantaarn en uitje.
{
  const { u0, u1, v0, v1, wall, t } = MTOWER;
  const c = [(u0 + u1) / 2, (v0 + v1) / 2];
  outer.push(hipped(u0, u1, v0, v1, wall, t, t));
  outer.push(prism(sq(c, 0.8), BASE, 23.0));
  outer.push(loft([[23.0, circ(c, 0.8, 16)], [23.5, circ(c, 1.2, 16)], [24.3, circ(c, 1.25, 16)], [25.1, circ(c, 0.8, 16)], [25.5, circ(c, 0.4, 16)], [26.8, tip(c)]]));
}
// Zuidvleugel in het eigen (s, t)-stelsel, dan gedraaid; dakkapellen aan de tuinkant (zuid).
{
  const { p, ang, s0, s1, hw, ridge, t } = SVB;
  const e = ridge - t * hw;
  const parts = [roofed(rect(s0, s1, -hw, hw), [...ridgeV(0, ridge, t), [-t, 0, e + t * s1]])];
  for (const s of [-10.0, -5.0, 0.0, 5.0, 10.0]) parts.push(dormerV(s, -2.5, -0.9, 1.1, 9.7));
  parts.push(chimney([-6.0, 0], 12.2, 0.45), chimney([7.0, 0], 12.2, 0.45));
  let wing = Manifold.union(parts);
  const cuts = [];
  for (const s of [-12.0, -8.0, -4.0, 0.0, 4.0, 8.0, 11.5]) cuts.push(win([s, -hw], 270, 1.1, 3.2, 5.0));
  wing = wing.subtract(Manifold.union(cuts));
  outer.push(wing.rotate([0, 0, ang]).translate([p[0], p[1], 0]));
}
// Poorttoren op de zuidwesthoek met een geknikte tentspits.
{
  const { c, hu, hv, wall } = GATE;
  const box = (du, dv) => rect(c[0] - du, c[0] + du, c[1] - dv, c[1] + dv);
  outer.push(prism(box(hu, hv), BASE, wall));
  outer.push(loft([[wall, box(hu, hv)], [12.6, box(hu - 0.9, hv - 0.9)], [17.9, box(0.35, 0.35)]]));
  outer.push(dormerU(-90.9, -89.2, c[1], 1.0, 14.6));
}
// Buitenste brug met borstweringen.
outer.push(prism(rect(OBRIDGE.u0, OBRIDGE.u1, OBRIDGE.v0, OBRIDGE.v1), BASE, COURT));
for (const [v0, v1] of [[OBRIDGE.v0, OBRIDGE.v0 + 0.9], [OBRIDGE.v1 - 0.9, OBRIDGE.v1]]) outer.push(prism(rect(OBRIDGE.u0, OBRIDGE.u1, v0, v1), BASE, COURT + 1.0));

// Dakkapellen aan de pleinkant (de luchtfoto toont ze als donkere stippen) en schoorstenen op de nokken.
for (const v of [14.0, 22.0, 30.0, 38.0, 46.0]) outer.push(dormerU(-83.4, -85.4, v, 1.1, 12.4));
for (const u of [-80.0, -74.5, -69.0, -63.5, -58.0]) outer.push(dormerV(u, 50.3, 52.3, 1.1, 12.4));
for (const u of [-30.0, -21.0, -12.0, -3.0]) outer.push(dormerV(u, 52.1, 54.0, 1.1, 13.4));
for (const v of [31.0, 38.0, 45.0, 64.0]) outer.push(dormerU(12.6, 10.8, v, 1.1, 12.6));
for (const v of [30.5, 44.5, 48.0]) outer.push(dormerU(-45.7, -43.9, v, 1.1, 12.8));
for (const v of [30.5, 45.5]) outer.push(dormerU(-38.4, -40.2, v, 1.1, 12.8));
for (const [c, z] of [[[-86.7, 20.0], 16.6], [[-86.7, 40.0], 16.6], [[-75.0, 56.35], 18.6], [[-62.0, 56.35], 18.6], [[-30.0, 57.1], 19.6], [[-10.0, 57.1], 19.6], [[-42.05, 27.0], 17.2], [[9.15, 40.0], 16.8], [[9.15, 58.0], 19.6]]) {
  outer.push(chimney(c, z, 0.45));
}

let voorburcht = Manifold.union(outer);

// Vensternissen aan de pleinen en de gracht, poortbogen en blinde bogen onder de buitenste brug.
const outerCuts = [];
const rowsOuter = [[3.8, 5.4], [6.8, 8.4]];
const rows = (list, p, angle, w = 1.0) => {
  for (const q of list) for (const [z0, z1] of rowsOuter) outerCuts.push(win(p(q), angle, w, z0, z1));
};
rows([11.5, 16.0, 20.5, 25.0, 29.5, 34.0, 38.5, 43.0, 47.5], (v) => [WWING.u1, v], 0);
rows([13.0, 19.0, 25.0, 31.0, 37.0, 43.0], (v) => [WWING.u0, v], 180);
rows([-80.0, -75.5, -71.0, -66.5, -62.0, -57.5], (u) => [u, NWW.v0], 270);
rows([-86.0, -80.0, -74.0, -68.0, -62.0, -57.0], (u) => [u, NWW.v1], 90);
rows([-35.0, -31.0, -27.0, -23.0, -19.0, -15.0, -11.0, -7.0, -3.0, 1.0], (u) => [u, NWE.v0], 270);
rows([-42.0, -36.0, -30.0, -24.0, -18.0, -12.0, -6.0, 0.0], (u) => [u, NWE.v1], 90);
rows([29.0, 32.5, 44.5, 48.0], (v) => [MWING.u0, v], 180);
rows([29.0, 32.5, 44.5, 48.0], (v) => [MWING.u1, v], 0);
rows([30.0, 34.5, 39.0, 43.5, 48.0], (v) => [EVB.u0, v], 180);
rows([30.0, 35.0, 40.0, 45.0, 50.0, 55.0, 60.0, 64.5], (v) => [EVB.u1, v], 0);
// Doorgang onder de poorttoren van de middenvleugel en de poort van de buitenste poorttoren.
for (const [u, a] of [[MTOWER.u0, 180], [MTOWER.u1, 0]]) outerCuts.push(win([u, 38.5], a, 3.0, YARD, 5.2, 0.8));
outerCuts.push(win([GATE.c[0] - GATE.hu, GATE.c[1]], 180, 2.8, COURT, 5.8, 0.8));
// Twee bogen in de zuidgevel van de lage doorgang (galerij naar de buitenste voorburcht).
for (const u of [-52.5, -48.9]) outerCuts.push(win([u, PASS.v0], 270, 2.4, YARD, 3.6, 0.6));
for (const u of [-100.0, -95.0]) {
  outerCuts.push(win([u, OBRIDGE.v0], 270, 2.2, -0.4, 0.8), win([u, OBRIDGE.v1], 90, 2.2, -0.4, 0.8));
}
voorburcht = voorburcht.subtract(Manifold.union(outerCuts));

const nodes = [
  ["building:kasteel", hoofdburcht],
  ["building:voorburcht", voorburcht],
];
const all = Manifold.union([hoofdburcht, voorburcht]);

const META = {
  name: "Kasteel Hoensbroek",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 114.7,
  replacesBuildings: ["0917100000006365", "0917100000006362", "0917100000006363"],
  plate: true,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (192348, 325340), midden in de hoofdburcht, op het water van de slotgracht (NAP +69,2 m), +X langs de noordoostgevel van de hoofdburcht (38,8 graden rechtsom vanaf de RD-X-as) en +Y loodrecht daarop naar de voorburcht. Node building:kasteel: de hoofdburcht uit dakvlakken en bouwdelen met de ronde toren (klokvormige spits, lantaarn en uitje tot +44,5 m), de vierkante zuidtoren, de twee poorttorens met een koepel en lantaarn, het westpaviljoen en de oostvleugel met schilddaken, de noordoost- en zuidwestvleugel, het lage ronde torentje, de binnenplaats, het portaal en de brug. Node building:voorburcht: de vleugels om de twee pleinen met zadeldaken, schilden en een topgevel, de lage doorgang, de poorttoren met uitje in de middenvleugel, de gedraaide zuidvleugel, de poorttoren op de zuidwesthoek en de buitenste brug, met dakkapellen, schoorstenen, vensternissen en poortbogen. Onderkant 1 m onder het water; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van de hoofdburcht en de voorburcht. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    roundTowerTopM: 44.5,
    southTowerTopM: 39.6,
    eastWingRidgeM: EWING.ridge,
    westPavilionRidgeM: 21.8,
    forecourtNorthRidgeM: NWE.ridge,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Kasteel_Hoensbroek",
    "PDOK BAG panden 0917100000006365 (hoofdburcht), 0917100000006362 en 0917100000006363 (voorburcht), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, goten, torens, binnenplaats, bruggen en het water van de gracht",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's vanaf de zuidwest-, zuid-, oost-, noordoost- en noordkant en van de pleinen",
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

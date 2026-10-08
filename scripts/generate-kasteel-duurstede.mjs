// Genereert een gesloten 3D-model van Kasteel Duurstede in Wijk bij Duurstede
// uit bouwdelen en dakvlakken: de ronde Bourgondische toren (1459-1496) met de
// mezekouwen op een kraag, het ringdak, de bovenste trommel met een kroonlijst,
// een kegeldak met een uitlopende voet, een achtkantige lantaarn en spits tot
// +43 m, een traptorentje met een kegeldak, twee schoorstenen, een dakkapel en
// de aanbouw aan de zuidoostkant; de vierkante donjon (13e eeuw) met een
// borstwering, een laag tentdak binnen de borstwering, een schoorsteen en een
// lage aanbouw met een lessenaarsdak; de muren in de slotgracht (de lage
// kademuur, de hoge westmuur, de ronde hoektoren met een holle bovenkant, de zuidmuur met een
// bres) en de muur naast de poort, plus de brug van de poort naar de zuidoever.
// Elk dak is een vlak of een omwentelingsvorm uit het AHN. Het Mapbox-model is
// niet gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus binaire STL's in millimeters op 1:<schaal> (los en met een
// grondplaat, want de toren, de donjon en de muren staan los van elkaar).
//
//   node scripts/generate-kasteel-duurstede.mjs              # 1:1000 (standaard)
//   node scripts/generate-kasteel-duurstede.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (151995, 442345), midden op de binnenplaats, op
// het maaiveld (NAP +4,6 m), Z omhoog. +X loopt langs de zuidmuur en de gevels
// van de donjon naar het oostnoordoosten (29 graden linksom vanaf de RD-X-as,
// gemeten aan de dakrand van de donjon en de BAG-zuidmuur) en +Y loodrecht
// daarop. De toren staat op (-12,3, 14,8), de donjon op (14,7, -5,8). De toren,
// de muren en de hoektoren staan in de slotgracht (water NAP +3,3 m), daarom
// begint het model 1 m onder het water.
//
// Bronnen: PDOK BAG-panden 0352100000000780 (toren, aanbouw en muren) en
// 0352100000015442 (donjon met aanbouw); AHN DSM/DTM 0,5 m (PDOK WCS): het
// stralenprofiel van het kegeldak, de lantaarn, het traptorentje, de
// schoorstenen, de dakkapel, de donjon, de muren, het brugdek en het water;
// PDOK BGT (brug en muur naast de poort); Wikipedia; PDOK luchtfoto; foto's op
// Wikimedia Commons vanaf de zuid-, zuidwest-, zuidoost- en oostkant. Geschat
// zijn de hoogte van de kraag en de mezekouwen (foto), de helling van het
// ringdak (leien, gat in het AHN), de vorm van de dakkapel, de lantaarn (AHN
// alleen de spits) en alle vensternissen en deuren. Weggelaten: de windvaan,
// de houten leuningen en het galgje van de ophaalbrug, de stalen trappen en
// bordessen aan de oostkant van de toren, de terrastenten en de tot circa een
// meter opgemetselde funderingsresten op de binnenplaats.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-duurstede");
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

const SLUG = "kasteel-duurstede";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld van de binnenplaats op NAP +4,6 m) ----------
const GROUND_NAP = 4.6;
const ORIGIN = [151995.0, 442345.0];
const X_AXIS = [0.87462, 0.48481]; // RD-richting 29 graden, langs de zuidmuur en de gevels van de donjon
// De Bourgondische toren, de muren en de ronde hoektoren staan in de slotgracht (water NAP +3,3 m);
// het model begint 1 m onder het water.
const WATER = -1.3;
const BASE = -2.3;

// Bourgondische toren (AHN: dakvoet van de ringdak op +17,6 m, kroonlijst van de bovenste trommel op +25,3 m,
// kegeldak met een uitlopende voet tot +33,4 m, lantaarn en spits tot +43 m).
const TOWER = {
  c: [-12.26, 14.8],
  r: 7.3, // onderste trommel (BAG)
  corbelR: 7.9, // mezekouwen en de muur erboven
  corbel0: 12.7,
  corbel1: 13.4,
  eave: 17.6, // dakvoet van het ringdak
  drumR: 6.0, // bovenste trommel
  ringTop: 20.0, // ringdak tegen de bovenste trommel
  cornice0: 24.6,
  corniceR: 6.25,
  top: 25.3,
};
// Kegeldak: [hoogte, straal] van de kroonlijst tot de lantaarn (DSM-profiel per 0,5 m straal).
const CONE = [[25.3, 6.25], [26.0, 5.0], [27.3, 3.9], [33.4, 1.4]];
const LANTERN = { across: 2.2, z0: 33.4, z1: 35.9, capAcross: 2.6, cap: 36.4, apex: 43.0 };
// Traptorentje in de bovenste trommel aan de oostzuidoostkant met een eigen kegeldak.
const TURRET = { c: [-8.86, 10.63], r: 1.8, z0: 15.0, wall: 29.5, roofR: 2.0, eave: 30.0, apex: 33.8 };
// Twee schoorstenen naast het kegeldak (u, v, bovenkant), 1 m in het vierkant.
const CHIMNEYS = [[-12.4, 19.91, 32.5], [-11.14, 10.63, 32.9]];
// Dakkapel met een topgevel op het ringdak aan de westzuidwestkant (richting in graden vanaf +X).
const DORMER = { az: 169.7, r0: 5.6, r1: 7.8, w: 2.2, wall: 20.2, ridge: 21.8, finial: 22.3 };
// Aanbouw tegen de zuidoostkant van de toren (plat dak +15,4 m).
const ANNEX = { u0: -14.0, u1: -5.5, v0: 7.6, v1: 11.6, top: 15.4 };

// Donjon: vierkante woontoren van 10,8 bij 11 m, muren tot +21,6 m met een laag tentdak binnen de borstwering.
const DONJON = { u0: 9.32, u1: 20.12, v0: -11.27, v1: -0.27, top: 21.6, inset: 1.0, roofEdge: 21.0, apex: 22.2 };
const DONJON_C = [(DONJON.u0 + DONJON.u1) / 2, (DONJON.v0 + DONJON.v1) / 2];
// Lage aanbouw met een lessenaarsdak tegen de noordgevel van de donjon (+5,8 m aan de muur, 37 graden).
const LEAN_TO = [[11.0, -0.27], [20.0, -0.27], [20.0, 2.3], [17.7, 2.3], [17.7, 3.5], [13.6, 3.5], [13.6, 2.3], [11.0, 2.3]];
const LEAN_TO_ROOF = [0, -0.75, 5.6];

// Ruïnemuren in de gracht (AHN): de hoge westmuur, de ronde hoektoren en de zuidmuur met een bres.
const WEST_WALL = [[-15.49, -9.59], [-13.52, -9.54], [-14.59, -15.81], [-16.56, -14.83]];
const WALL_TOP = 5.4;
// Lage kademuur langs de westkant van de binnenplaats, van de toren tot de hoge westmuur (+0,3 m, 1,6 m boven het water).
const QUAY = [[-12.14, 7.19], [-12.34, 5.58], [-15.49, -9.59], [-13.52, -9.54], [-13.3, -8.52], [-10.65, 4.3], [-10.08, 6.16]];
const QUAY_TOP = 0.3;
const CORNER = { c: [-17.35, -18.51], r: 3.5, top: 5.2, innerR: 2.0, floor: 4.4 };
const SOUTH_WALL = { u0: -15.0, u1: -0.8, v0: -18.66, v1: -16.73, breach: [-10.6, -8.8], breachTop: 3.4 };
// Muur oostelijk van de poort (BGT scheiding, muur), +3,2 m.
const GATE_WALL = [
  [0.96, -18.62], [0.76, -21.78], [1.45, -22.63], [2.17, -21.92], [6.36, -21.93], [7.15, -22.84], [8.13, -21.99],
  [8.83, -21.39], [8.04, -20.48], [8.05, -18.93], [9.24, -18.97], [9.6, -18.99], [9.64, -18.49], [9.66, -18.19],
  [8.26, -18.11], [7.24, -17.32], [6.5, -16.94], [6.13, -20.24], [2.71, -20.06], [3.13, -17.77], [1.25, -17.39],
];
const GATE_WALL_TOP = 3.2;
// Brug van de poort naar de zuidoever (BGT overbruggingsdeel), dek op +0,3 m (AHN).
const BRIDGE = [
  [-3.33, -28.79], [-4.16, -32.07], [-5.41, -37.44], [-7.18, -42.71], [-4.11, -43.74], [-4.07, -43.45], [-3.27, -38.03],
  [-1.94, -32.62], [-1.16, -29.31], [0.59, -21.97], [0.64, -21.78], [0.76, -21.78], [0.96, -18.62], [-0.69, -18.65],
];
const BRIDGE_DECK = 0.3;

// Maaiveld op de binnenplaats (NAP +4,6 m), niet in de gracht.
const GROUND_SAMPLES = [[0, 0], [2, -8], [-6, 2]];

const circle = ([cx, cy], r, n = 48) =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)]);
const polar = ([cx, cy], r, az) => [cx + r * Math.cos((az * Math.PI) / 180), cy + r * Math.sin((az * Math.PI) / 180)];

// ---------- Bourgondische toren ----------
const tower = [];
{
  const { c } = TOWER;
  // Onderste trommel met de kraag onder de mezekouwen, het ringdak en de bovenste trommel met kroonlijst en kegeldak.
  tower.push(
    loft([
      [BASE, circle(c, TOWER.r)],
      [TOWER.corbel0, circle(c, TOWER.r)],
      [TOWER.corbel1, circle(c, TOWER.corbelR)],
      [TOWER.eave, circle(c, TOWER.corbelR)],
      [TOWER.ringTop, circle(c, TOWER.drumR)],
    ]),
  );
  tower.push(
    loft([
      [TOWER.eave, circle(c, TOWER.drumR)],
      [TOWER.cornice0, circle(c, TOWER.drumR)],
      [TOWER.cornice0 + 0.25, circle(c, TOWER.corniceR)],
      ...CONE.map(([z, r]) => [z, circle(c, r)]),
    ]),
  );
  // Achtkantige lantaarn met een kraag en een achtkantige spits.
  tower.push(
    loft([
      [LANTERN.z0, oct(c, LANTERN.across)],
      [LANTERN.z1, oct(c, LANTERN.across)],
      [LANTERN.z1 + 0.25, oct(c, LANTERN.capAcross)],
      [LANTERN.cap, oct(c, LANTERN.capAcross)],
      [LANTERN.apex, tip(c)],
    ]),
  );
}
// Traptorentje met een kraag en een kegeldak.
tower.push(
  loft([
    [TURRET.z0, circle(TURRET.c, TURRET.r, 32)],
    [TURRET.wall, circle(TURRET.c, TURRET.r, 32)],
    [TURRET.wall + 0.25, circle(TURRET.c, TURRET.roofR, 32)],
    [TURRET.eave, circle(TURRET.c, TURRET.roofR, 32)],
    [TURRET.apex, tip(TURRET.c)],
  ]),
);
// Schoorstenen.
for (const [u, v, z] of CHIMNEYS) tower.push(prism(sq([u, v], 0.5), 22.0, z));
// Dakkapel op het ringdak: zadeldak naar buiten gericht en een topgevel met een pinakel.
{
  const h = DORMER.w / 2;
  const t = (DORMER.ridge - DORMER.wall) / h;
  const body = roofed(rect(DORMER.r0, DORMER.r1, -h, h), [[0, -t, DORMER.ridge], [0, t, DORMER.ridge]]).trimByPlane([0, 0, 1], 17.0);
  const finial = prism(sq([DORMER.r1 - 0.45, 0], 0.45), 17.0, DORMER.finial);
  tower.push(
    Manifold.union([body, finial])
      .rotate([0, 0, DORMER.az])
      .translate([TOWER.c[0], TOWER.c[1], 0]),
  );
}
// Aanbouw tegen de zuidoostkant.
tower.push(prism(rect(ANNEX.u0, ANNEX.u1, ANNEX.v0, ANNEX.v1), BASE, ANNEX.top));

let towerSolid = Manifold.union(tower);
{
  const cuts = [];
  const { c } = TOWER;
  // Vensters in de onderste trommel, onder het ringdak en in de bovenste trommel.
  for (const az of [120, 160, 200, 235]) for (const z of [4.5, 8.5]) cuts.push(niche(c, az, TOWER.r, 0, 1.0, z, z + 1.8, 0.4));
  for (const az of [100, 150, 190, 230]) cuts.push(niche(c, az, TOWER.corbelR, 0, 0.9, 15.7, 16.6, 0.4));
  for (const az of [10, 50, 130, 205, 245]) cuts.push(niche(c, az, TOWER.drumR, 0, 1.2, 21.0, 22.8, 0.4));
  for (const az of [-30, -80]) cuts.push(niche(TURRET.c, az, TURRET.r, 0, 0.9, 25.0, 26.2, 0.4));
  // Spitse deur en vensters in de zuidgevel van de aanbouw.
  cuts.push(niche([-9.0, 0], 270, -ANNEX.v0, 0, 1.6, 0, 2.4, 0.4));
  for (const u of [-11.5, -7.5]) for (const z of [6.0, 10.5]) cuts.push(niche([u, 0], 270, -ANNEX.v0, 0, 1.0, z, z + 1.8, 0.4));
  towerSolid = towerSolid.subtract(Manifold.union(cuts));
}

// ---------- donjon ----------
const donjonParts = [];
{
  const outer = rect(DONJON.u0, DONJON.u1, DONJON.v0, DONJON.v1);
  const i = DONJON.inset;
  const inner = rect(DONJON.u0 + i, DONJON.u1 - i, DONJON.v0 + i, DONJON.v1 - i);
  // Muren tot de borstwering, binnen de borstwering een laag tentdak.
  donjonParts.push(prism(outer, BASE, DONJON.top).subtract(prism(inner, DONJON.roofEdge, DONJON.top + 1)));
  donjonParts.push(loft([[DONJON.roofEdge - 0.5, inner], [DONJON.roofEdge, inner], [DONJON.apex, tip(DONJON_C)]]));
  // Schoorsteen op het dak bij de westmuur.
  donjonParts.push(prism(sq([11.8, -5.8], 0.5), 20.0, 23.2));
  // Lage aanbouw met een lessenaarsdak tegen de noordgevel.
  donjonParts.push(roofed(LEAN_TO, [LEAN_TO_ROOF]));
}
let donjon = Manifold.union(donjonParts);
{
  const cuts = [];
  const hu = (DONJON.u1 - DONJON.u0) / 2;
  const hv = (DONJON.v1 - DONJON.v0) / 2;
  // Per gevel twee vensters bovenin en een venster halverwege, in de westgevel de deur op de verdieping.
  for (const [ang, a] of [[0, hu], [90, hv], [180, hu], [270, hv]]) {
    for (const s of [-2.6, 2.6]) cuts.push(niche(DONJON_C, ang, a, s, 1.2, 16.6, 18.4, 0.4));
    cuts.push(niche(DONJON_C, ang, a, ang === 90 ? -1.5 : 1.5, 1.2, 10.5, 12.3, 0.4));
  }
  cuts.push(niche(DONJON_C, 180, hu, 0, 1.4, 3.0, 5.2, 0.4));
  donjon = donjon.subtract(Manifold.union(cuts));
}

// ---------- ruïnemuren ----------
const walls = [];
walls.push(prism(WEST_WALL, BASE, WALL_TOP));
walls.push(prism(QUAY, BASE, QUAY_TOP));
// Ronde hoektoren met een holle bovenkant.
walls.push(prism(circle(CORNER.c, CORNER.r), BASE, CORNER.top).subtract(prism(circle(CORNER.c, CORNER.innerR, 32), CORNER.floor, CORNER.top + 1)));
// Zuidmuur: hoog aan de westkant, een bres, en naar de poort aflopend van +5 naar +3,7 m.
{
  const { u0, u1, v0, v1, breach, breachTop } = SOUTH_WALL;
  walls.push(prism(rect(u0, breach[0], v0, v1), BASE, WALL_TOP));
  walls.push(prism(rect(breach[0], breach[1], v0, v1), BASE, breachTop));
  walls.push(roofed(rect(breach[1], u1, v0, v1), [[-0.1625, 0, 3.57]]));
}
walls.push(prism(GATE_WALL, BASE, GATE_WALL_TOP));
let wallSolid = Manifold.union(walls);
{
  const cuts = [];
  for (const u of [-12.5, -6.5, -4.3, -2.3]) cuts.push(niche([u, 0], 270, -SOUTH_WALL.v0, 0, 1.0, 0.9, 2.1, 0.4));
  wallSolid = wallSolid.subtract(Manifold.union(cuts));
}

const castle = Manifold.union([towerSolid, donjon, wallSolid]);
const bridge = prism(BRIDGE, BASE, BRIDGE_DECK);

const nodes = [
  ["building:kasteel", castle],
  ["road:brug", bridge],
];
const all = Manifold.union(nodes.map(([, solid]) => solid));

const META = {
  name: "Kasteel Duurstede",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 48.0,
  replacesBuildings: ["0352100000000780", "0352100000015442"],
  plate: true,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (151995, 442345), midden op de binnenplaats, op het maaiveld (NAP +4,6 m), +X langs de zuidmuur en de gevels van de donjon (29 graden vanaf de RD-X-as) en +Y loodrecht daarop. Node building:kasteel uit bouwdelen en dakvlakken: de ronde Bourgondische toren met een kraag onder de mezekouwen, het ringdak, de bovenste trommel met kroonlijst, een kegeldak met uitlopende voet, een achtkantige lantaarn en spits (+43 m), een traptorentje met kegeldak, twee schoorstenen, een dakkapel en de aanbouw aan de zuidoostkant; de vierkante donjon met een borstwering, een laag tentdak, een schoorsteen en een aanbouw met lessenaarsdak; de ruïnemuren in de gracht (lage kademuur, hoge westmuur, ronde hoektoren met holle bovenkant, zuidmuur met bres) en de muur naast de poort, met vensternissen. Node road:brug: de brug van de poort naar de zuidoever (dek +0,3 m). Onderkant 1 m onder het water van de slotgracht; alle vlakken wijzen omhoog of staan verticaal, op de kragen (49 tot 51 graden) en de nissen na. Vervangt de PDOK-reconstructie van de toren met de muren en van de donjon. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    spireTopM: LANTERN.apex,
    coneEaveM: TOWER.top,
    ringRoofEaveM: TOWER.eave,
    turretTopM: TURRET.apex,
    donjonTopM: DONJON.top,
    groundNapM: GROUND_NAP,
    waterNapM: GROUND_NAP + WATER,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Kasteel_Duurstede",
    "PDOK BAG panden 0352100000000780 (Bourgondische toren met de muren) en 0352100000015442 (donjon), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: toren, kegeldak, donjon, muren, brugdek, water en maaiveld",
    "PDOK BGT overbruggingsdeel (de brug) en scheiding muur (de muur naast de poort)",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's vanaf de zuid-, zuidwest-, zuidoost- en oostkant",
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

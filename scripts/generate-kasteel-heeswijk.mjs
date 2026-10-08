// Genereert een gesloten 3D-model van Kasteel Heeswijk in Heeswijk uit
// dakvlakken en bouwdelen: het hoofdgebouw met twee evenwijdige schilddaken
// (nokken NAP +27,0 en +30,5 m) en een arm naar de noordoosttoren langs de
// schuine noordoostgevel, de oostvleugel met schilden en een erker, de galerij
// met acht topgeveltjes op de zuidmuur van de binnenplaats, de zeskante
// IJzertoren met een kraag, een zeskante spits en een traptorentje, de ronde
// noordwest- en noordoosttoren met kegelspitsen, vijf torentjes (twee op een
// kraag), dakkapellen, schoorstenen, het kasteeleiland met borstweringen en de
// gemetselde boogbrug naar het voorplein. De voorburcht met het poortgebouw en
// de trapgevel is een eigen BAG-pand en blijft PDOK-model. Elk dak is een vlak
// z = a u + b v + c uit het AHN en de LoD2.2-vlakken van de 3D BAG. Het
// Mapbox-model is niet gebruikt. Alle maten in het script zijn meters op ware
// grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-kasteel-heeswijk.mjs              # 1:1000 (standaard)
//   node scripts/generate-kasteel-heeswijk.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (158752, 407454), midden in het hoofdgebouw, op
// het water van de slotgracht (NAP +5,6 m), Z omhoog. +X loopt langs de nokken
// van het hoofdgebouw naar het oostnoordoosten (13 graden linksom vanaf de
// RD-X-as) en +Y loodrecht daarop; de binnenplaats ligt op u -14 tot 6 m, v -17
// tot 2 m (NAP +11,2 m), de brug op u -37 tot -20 m. Het kasteel staat rondom in
// de gracht; het model begint 1 m onder het water.
//
// Bronnen: PDOK BAG-pand 1721100000001582; AHN DSM/DTM 0,5 m (PDOK WCS) voor de
// daken, de torens, de binnenplaats, de brug en het water; 3D BAG LoD2.2
// (api.3dbag.nl); Wikipedia; PDOK luchtfoto; foto's op Wikimedia Commons vanaf
// de zuid-, zuidwest-, zuidoost-, west- en noordwestkant. Geschat zijn de
// spitsen van de torens en torentjes (het AHN mist de punten), de plaats van de
// torentjes op de hoeken van het voorste deel en de oostvleugel, de erker, de
// dakkapellen, de galerij (traveeën en geveltjes), de bogen van de brug en de
// vensternissen. Weggelaten: de houten loopbrug aan de oostkant en het houten
// balkon aan de brug (dunne planken op palen), de zuilen en pinakels van de
// galerij (kleiner dan 0,9 m), de windvanen en de luiken.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-heeswijk");
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

const SLUG = "kasteel-heeswijk";
const circle = ([cx, cy], r, n = 32) =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)]);
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1 (voor bogen dwars door de brug).
const profileY = (pts, y0, y1) => profileX(pts, -y1, -y0).rotate([0, 0, -90]);
// Dakkapel: voorkant op [cx, cy] met de normaal naar dir (graden), breedte w, lengte l het dak in, nok op z.
const dormer = ([cx, cy], dir, w, l, z) =>
  roofed(rect(-l, 0.3, -w / 2, w / 2), ridgeV(0, z, 1.6)).rotate([0, 0, dir]).translate([cx, cy, 0]);
// Torentje: ronde schacht (straal r) tot zTop en een kegelspits tot apex; met corbel > 0 begint de schacht op zStart
// boven een kraag die in corbel meter vanuit een punt naar r uitloopt, anders loopt hij door tot de onderkant.
const turret = (c, r, zStart, zTop, apex, corbel = 0) =>
  Manifold.union([
    corbel > 0
      ? loft([[zStart - corbel, tip(c)], [zStart, circle(c, r, 16)], [zTop, circle(c, r, 16)]])
      : prism(circle(c, r, 16), BASE, zTop),
    loft([[zTop, circle(c, r, 16)], [apex, tip(c)]]),
  ]);

// ---------- maten (lokaal stelsel, z = hoogte boven het water van de slotgracht op NAP +5,6 m) ----------
const WATER_NAP = 5.6;
const Z = (nap) => +(nap - WATER_NAP).toFixed(3);
const ORIGIN = [158752.0, 407454.0];
const X_AXIS = [0.97437, 0.224951]; // RD-richting 13 graden, langs de nokken van het hoofdgebouw
// Het kasteel staat rondom in de gracht; het model begint 1 m onder het water.
const BASE = -1.0;
// Dakvlak z = a u + b v + c met c in NAP (gemeten in het AHN en de 3D BAG), omgezet naar het modelstelsel.
const pl = (a, b, cNap) => [a, b, cNap - WATER_NAP];

// Hoofdgebouw, voorste deel (aan de binnenplaats): nok langs u op v = 5,4 m (NAP +27,0 m), schilden aan beide kanten.
const FRONT = { u0: -13.0, u1: 9.9, v0: 2.0, v1: 8.6 };
const FRONT_S = pl(0, 1.53, 18.738);
const FRONT_N = pl(0, -1.3, 34.02);
const FRONT_W = pl(1.6, 0, 43.2);
const FRONT_E = pl(-1.6, 0, 38.24);
// Achterste deel: nok langs u op v = 15,15 m (NAP +30,5 m), schild aan de westkant, de schuine noordoostgevel
// met een vlak van 62 graden en een dwarsnok naar de noordoosttoren (de arm).
const REAR_S = pl(0, 1.33, 10.35);
const REAR_N = pl(0, -1.34, 50.8);
const REAR_W = pl(1.55, 0, 42.85);
const REAR_NE = pl(-1.41525, -1.1914, 55.904); // vlak boven de gevel (5,9; 20,7)-(14,4; 10,6), goot NAP +22,9 m
const ARM_SW = pl(1.41525, 1.1914, 5.1995);
const ARM_SE = pl(0, 3.0, -5.7); // steil schild van de arm boven de hof bij de noordoosttoren
// Oostvleugel: nok langs v op u = 10,5 m (NAP +20,7 m), schilden aan beide einden en een lager dwarsdak aan de noordkant.
const EAST = { u0: 6.3, u1: 14.8, v0: -17.0, v1: -3.0 };
// IJzertoren (hart, straal van de ronde voet, apothema van de zeskante schacht en de dakvoet).
const IJ = { c: [-12.2, -14.7], r: 3.8, apo: 3.25, eaveApo: 4.05 };
// Ronde torens met een kegelspits.
const NW = { c: [-11.0, 19.6], r: 2.6 };
const NE = { c: [13.7, 10.0], r: 2.3 };

// Maaiveld: het water van de gracht rondom (zuid, west, oost en noord), NAP +5,6 m.
const GROUND_SAMPLES = [[0, -21], [-20, -10], [22, -8], [0, 25]];

// ---------- kasteel ----------
const solids = [];

// Kasteeleiland: de binnenplaats (NAP +11,2 m), het terras aan de brug en de hof bij de noordoosttoren, met borstweringen.
solids.push(prism([[-14.2, -11.8], [-9.1, -16.6], [6.3, -16.6], [6.3, 0.4], [10.4, 0.4], [10.4, 2.0], [-13.0, 2.0], [-13.0, -4.6], [-14.2, -4.6]], BASE, Z(11.2)));
solids.push(prism([[-20.6, -4.4], [-13.0, -4.6], [-13.0, 5.8], [-20.4, 5.9]], BASE, Z(11.1)));
solids.push(prism([[9.9, 0.4], [14.8, 0.4], [16.8, 2.5], [15.9, 7.5], [13.0, 7.7], [11.2, 8.4], [9.9, 8.4]], BASE, Z(11.3)));
for (const p of [
  rect(-20.4, -13.0, 5.0, 5.9),
  rect(-20.6, -13.0, -4.5, -3.6),
  rect(-20.6, -19.7, -4.5, 0.3),
  rect(-20.5, -19.6, 2.7, 5.9),
  rect(-14.2, -13.3, -11.8, -4.6),
  [[15.0, 7.5], [15.9, 2.6], [16.8, 2.6], [15.9, 7.6]],
]) solids.push(prism(p, BASE, Z(12.1)));
// Lage weergang langs de oost- en zuidoostgevel (NAP +7,2 m).
solids.push(prism([[6.6, -17.8], [13.0, -17.9], [16.3, -14.7], [16.9, -7.4], [17.3, 0.4], [14.8, 0.4], [14.8, -17.0], [6.6, -17.0]], BASE, Z(7.2)));

// Hoofdgebouw: voorste en achterste deel, de arm naar de noordoosttoren en de vlakke goot ertussen.
solids.push(roofed(rect(FRONT.u0, FRONT.u1, FRONT.v0, FRONT.v1), [FRONT_S, FRONT_N, FRONT_W, FRONT_E]));
const rearPoly = [[-13.0, 8.6], [9.9, 8.6], [11.3, 9.3], [14.4, 10.6], [5.9, 20.7], [-10.0, 21.0], [-13.0, 21.0]];
solids.push(roofed(rearPoly, [REAR_S, REAR_N, REAR_W, REAR_NE]));
solids.push(roofed([[2.0, 8.6], [9.9, 8.6], [11.3, 9.3], [14.4, 10.6], [5.9, 20.7], [2.0, 16.0]], [REAR_NE, ARM_SW, ARM_SE]));
solids.push(prism(rect(-12.6, 9.5, 8.3, 9.5), BASE, Z(23.0)));

// Oostvleugel met schilden, het lagere dwarsdak aan de noordkant (nok NAP +18,4 m) en een erker aan de zuidgevel.
solids.push(roofed(rect(EAST.u0, EAST.u1, EAST.v0, EAST.v1), [pl(1.35, 0, 6.525), pl(-1.35, 0, 34.875), pl(0, 1.74, 44.58), pl(0, -1.9, 11.2)]));
solids.push(roofed(rect(EAST.u0, EAST.u1, -3.0, 0.4), [pl(0, 1.33, 20.13), pl(0, -1.33, 16.67), pl(1.6, 0, 16.1 - 1.6 * 6.3), pl(-1.6, 0, 16.1 + 1.6 * 14.8)]));
solids.push(profileX([[-16.8, Z(8.9)], [-16.8, Z(14.0)], [-18.0, Z(13.3)], [-18.0, Z(10.2)]], 10.9, 13.6));

// Galerij op de zuidmuur van de binnenplaats: acht traveeën met spitsboognissen en een topgeveltje per travee (NAP +17 m).
solids.push(prism(rect(-8.8, EAST.u0, -16.6, -14.4), BASE, Z(14.6)));
const BAYS = 8;
const bayW = (EAST.u0 - -8.0) / BAYS;
for (let k = 0; k < BAYS; k++) {
  const u = -8.0 + (k + 0.5) * bayW;
  solids.push(roofed(rect(u - bayW / 2, u + bayW / 2, -16.6, -14.4), ridgeU(u, Z(17.0), 2.4 / (bayW / 2))));
}

// IJzertoren: ronde voet tot NAP +12,6 m, zeskante schacht, een kraag onder de dakvoet en een zeskante spits (NAP +35,4 m),
// met een rond traptorentje op de noordwesthoek tot NAP +30 m en een kegelspits.
{
  const corners = [5, 65, 125, 185, 245, 305];
  const hex = (apo) => ngon(IJ.c, apo, corners, 60);
  solids.push(prism(circle(IJ.c, IJ.r, 48), BASE, Z(12.6)));
  solids.push(loft([[Z(12.0), hex(IJ.apo)], [Z(24.0), hex(IJ.apo)], [Z(25.2), hex(IJ.eaveApo)], [Z(35.4), tip(IJ.c)]]));
  solids.push(turret([IJ.c[0] + 3.4 * Math.cos((125 * Math.PI) / 180), IJ.c[1] + 3.4 * Math.sin((125 * Math.PI) / 180)], 1.0, BASE, Z(30.0), Z(34.0)));
}
// Noordwesttoren en noordoosttoren: ronde schacht, een kraag van 0,3 m en een kegelspits van 70 graden.
solids.push(loft([[BASE, circle(NW.c, NW.r)], [Z(28.2), circle(NW.c, NW.r)], [Z(28.7), circle(NW.c, NW.r + 0.3)], [Z(37.0), tip(NW.c)]]));
solids.push(loft([[BASE, circle(NE.c, NE.r)], [Z(27.2), circle(NE.c, NE.r)], [Z(27.6), circle(NE.c, NE.r + 0.3)], [Z(35.0), tip(NE.c)]]));
// Torentjes: op de hoeken van het voorste deel (op een kraag), op de noordgevel, aan de oostkant en op de hoek van de oostvleugel.
solids.push(turret([-13.1, 2.3], 1.0, Z(16.5), Z(24.5), Z(29.5), 1.4));
solids.push(turret([9.4, 2.6], 1.0, Z(16.5), Z(24.5), Z(29.5), 1.4));
solids.push(turret([5.6, 21.0], 1.0, BASE, Z(25.0), Z(29.5)));
solids.push(loft([[BASE, circle([16.0, 2.3], 1.2, 16)], [Z(12.5), circle([16.0, 2.3], 1.2, 16)], [Z(13.0), circle([16.0, 2.3], 1.45, 16)], [Z(19.5), circle([16.0, 2.3], 1.45, 16)], [Z(24.0), tip([16.0, 2.3])]]));
solids.push(turret([6.5, -17.0], 0.95, Z(12.8), Z(17.0), Z(21.5), 1.4));

// Dakkapellen: twee op het zuidvlak en een op het noordvlak van het achterste deel, een op de schuine noordoostzijde,
// twee op het zuidvlak en een op het westschild van het voorste deel.
solids.push(dormer([-6.9, 8.9], 270, 1.8, 2.6, Z(25.2)));
solids.push(dormer([6.5, 8.9], 270, 1.8, 2.6, Z(25.0)));
solids.push(dormer([-3.0, 20.8], 90, 2.0, 2.6, Z(25.6)));
solids.push(dormer([9.1, 16.5], 40.1, 1.8, 2.6, Z(25.4)));
solids.push(dormer([-4.0, 2.6], 270, 1.6, 2.2, Z(24.6)));
solids.push(dormer([3.0, 2.6], 270, 1.6, 2.2, Z(24.6)));
solids.push(dormer([-12.3, 5.4], 180, 1.6, 2.2, Z(25.0)));
// Schoorstenen.
for (const [u, v, top] of [[3.9, 15.3, 33.9], [-8.1, 14.8, 33.8], [-10.6, 5.2, 28.8], [7.3, 5.5, 29.0]]) solids.push(prism(sq([u, v], 0.5), BASE, Z(top)));

// Toegangsbrug naar het voorplein: drie bogen, een dek dat oploopt van NAP +9,6 tot +11,0 m, borstweringen van 1 m,
// en het smallere laatste stuk (de vroegere ophaalbrug) aan de kasteelkant.
const DECK = [0.1, 0, Z(9.6) + 0.1 * 36.5];
const PARAPET = [0.1, 0, DECK[2] + 1.0];
const bridge = Manifold.union([
  roofed(rect(-37.0, -24.6, 0.9, 3.0), [DECK]),
  roofed(rect(-37.0, -24.6, 0.0, 0.9), [PARAPET]),
  roofed(rect(-37.0, -24.6, 3.0, 3.9), [PARAPET]),
  roofed(rect(-24.8, -20.4, 0.3, 2.7), [DECK]),
]);
const arches = Manifold.union(
  [[-34.0, 1.0], [-30.4, 1.3], [-26.8, 1.6]].map(([u, z1]) =>
    profileY([[u - 1.3, BASE - 1], [u + 1.3, BASE - 1], [u + 1.3, z1], [u, z1 + 1.6 * 1.3], [u - 1.3, z1]], -1, 5),
  ),
);
solids.push(bridge.subtract(arches));

let castle = Manifold.union(solids);

// Vensternissen (spitsboog, 0,4 m diep) in de buitengevels, de torens en de galerij.
const cuts = [];
const rows = [[Z(12.0), Z(14.2)], [Z(15.6), Z(17.8)], [Z(19.2), Z(20.8)]];
for (const v of [4.0, 7.0, 11.5, 15.0]) for (const [z0, z1] of v === 4.0 ? rows.slice(1) : rows) cuts.push(niche([0, v], 180, 13.0, 0, 1.4, z0, z1, 0.4));
for (const u of [-6.0, -2.5, 1.0]) for (const [z0, z1] of rows) cuts.push(niche([u, 0], 90, 21.0, 0, 1.4, z0, z1, 0.4));
for (const s of [5.0, 8.5]) for (const [z0, z1] of rows) cuts.push(niche([0, 0], 40.1, 17.84, s, 1.4, z0, z1, 0.4));
for (const u of [-9.0, -5.0, -1.0, 3.0, 7.0]) for (const [z0, z1] of rows) cuts.push(niche([u, 0], 270, -FRONT.v0, 0, 1.4, z0, z1, 0.4));
for (const v of [-14.0, -10.0, -6.0]) {
  cuts.push(niche([0, v], 0, EAST.u1, 0, 1.4, Z(8.0), Z(10.0), 0.4), niche([0, v], 0, EAST.u1, 0, 1.4, Z(11.4), Z(13.0), 0.4));
  cuts.push(niche([0, v - 1.0], 180, -EAST.u0, 0, 1.4, Z(12.2), Z(13.6), 0.4));
}
for (const u of [7.6, 9.6]) cuts.push(niche([u, 0], 270, -EAST.v0, 0, 1.4, Z(7.6), Z(9.6), 0.4));
for (let k = 0; k < BAYS; k++) {
  const u = -8.0 + (k + 0.5) * bayW;
  cuts.push(niche([u, 0], 270, 16.6, 0, 1.2, Z(12.2), Z(13.4), 0.5), niche([u, 0], 90, -14.4, 0, 1.2, Z(12.2), Z(13.4), 0.5));
}
for (const phi of [215, 275, 335, 35]) cuts.push(niche(IJ.c, phi, IJ.apo, 0, 1.2, Z(18.4), Z(20.6), 0.4), niche(IJ.c, phi, IJ.apo, 0, 1.0, Z(14.0), Z(15.6), 0.4));
for (const a of [120, 180, 240]) for (const [z0, z1] of [[Z(17.5), Z(19.3)], [Z(22.5), Z(24.2)]]) cuts.push(niche(NW.c, a, NW.r, 0, 1.0, z0, z1, 0.4));
for (const a of [0, 40, 80]) for (const [z0, z1] of [[Z(17.5), Z(19.3)], [Z(22.0), Z(23.8)]]) cuts.push(niche(NE.c, a, NE.r, 0, 1.0, z0, z1, 0.4));
// Deur van het terras in de westgevel.
cuts.push(niche([0, 4.0], 180, 13.0, 0, 1.6, Z(11.1), Z(13.0), 0.6));
castle = castle.subtract(Manifold.union(cuts));

const nodes = [["building:kasteel", castle]];
const all = castle;

const META = {
  name: "Kasteel Heeswijk",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 49.59,
  replacesBuildings: ["1721100000001582"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (158752, 407454), midden in het hoofdgebouw, op het water van de slotgracht (NAP +5,6 m), +X langs de nokken van het hoofdgebouw (13 graden linksom vanaf de RD-X-as) en +Y loodrecht daarop. Een node building:kasteel uit dakvlakken en bouwdelen: het hoofdgebouw met twee evenwijdige schilddaken en een arm naar de noordoosttoren, de oostvleugel, de galerij met topgeveltjes, de zeskante IJzertoren met traptorentje, de ronde noordwest- en noordoosttoren met kegelspitsen, vijf torentjes, dakkapellen, schoorstenen, de erker, het kasteeleiland met borstweringen en de gemetselde boogbrug naar het voorplein. Onderkant 1 m onder het water; alle vlakken wijzen omhoog of staan verticaal. Vervangt de PDOK-reconstructie van het kasteel; de voorburcht blijft PDOK-model. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { frontRidgeNapM: 27.0, rearRidgeNapM: 30.5, eastRidgeNapM: 20.7, ijzertorenTopNapM: 35.4, northWestTowerTopNapM: 37.0, waterNapM: WATER_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Kasteel_Heeswijk",
    "PDOK BAG pand 1721100000001582 (het kasteel), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: dakvlakken, torens, binnenplaats, brug en het water van de gracht",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken, de zeskante spits van de IJzertoren",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's vanaf de zuid-, zuidwest-, zuidoost-, west- en noordwestkant",
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

// Genereert een gesloten 3D-model van de hoofdburcht van Kasteel Doornenburg uit
// dakvlakken en bouwdelen: het rechthoekige woonblok met muren tot de weergang
// (+17,4 m boven het eiland), borstweringen met kantelen aan de zuid-, noord- en
// oostkant (noord en oost op een kraag van de rondboogfries), de zuidelijke
// dwarsvleugel onder één nok (+25,2 m) met een trapgevel en schoorsteen aan de
// westkant en een schild aan de oostkant, de twee noordelijke schilddaken naast
// elkaar met een kilgoot ertussen, de rechthoekige toren in de westgevel met een
// steil schilddak tot +32,9 m, drie ronde hoektorentjes met achtkantige spitsen
// (noordwest vanaf het eiland, noordoost en zuidoost op een kraag), dakkapellen
// met spitsjes, vier schoorstenen, erkers en een privaatschacht, vensternissen,
// de toegangsdeur aan de noordkant met de houten brug op jukken naar de voorburcht
// en de lagere oostbrug naar het park. De voorburcht met de kapel en de boerderij
// is een eigen BAG-pand en blijft PDOK-model. Elk dak is een vlak z = a u + b v + c
// uit het AHN en de LoD2.2-vlakken van de 3D BAG. Het Mapbox-model is niet
// gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-kasteel-doornenburg.mjs              # 1:1000 (standaard)
//   node scripts/generate-kasteel-doornenburg.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (197103,2, 434088,0), midden in de hoofdburcht, op
// het maaiveld van het kasteeleiland (NAP +9,1 m, vrijwel op het water van de
// gracht), Z omhoog. +X loopt langs de zuidgevel naar het oosten (16 graden
// rechtsom vanaf de RD-X-as, gemeten aan de nokken) en +Y loodrecht daarop naar
// de voorburcht; de buitenmuren staan op u -9,25 tot 9,0 m en v -11,0 tot 11,1 m.
// Het model begint 1 m onder het eiland.
//
// Bronnen: PDOK BAG-pand 1705100000019617; AHN DSM/DTM 0,5 m (PDOK WCS) voor de
// daken, de weergang, de torens, de bruggen en het maaiveld; 3D BAG LoD2.2
// (api.3dbag.nl); Wikipedia; PDOK luchtfoto; foto's op Wikimedia Commons vanaf
// de west-, zuidoost-, oost- en noordkant. Geschat zijn de hoogte van de
// torenschacht en de spitsen van de hoektorentjes (het AHN mist de punten), de
// trapgevel, de kantelen, de kraag onder de borstwering, de dakkapellen, de
// schoorstenen, erkers en vensternissen, en de jukken onder de bruggen (geen
// meting, op foto's houten bokken). Weggelaten: de houten leuningen van de
// bruggen en de luiken (dunner dan 0,9 m), de windvanen en makelaars op de
// spitsen en het torentje (kleiner dan 0,9 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-doornenburg");
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

const SLUG = "kasteel-doornenburg";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld van het kasteeleiland op NAP +9,1 m) ----------
const GROUND_NAP = 9.1;
const ORIGIN = [197103.2, 434088.0];
const X_AXIS = [0.961262, -0.275637]; // RD-richting -16 graden, langs de zuidgevel
// Het eiland ligt vrijwel op het water van de gracht; het model begint 1 m eronder.
const BASE = -1.0;

// Buitenmuren (BAG en AHN) en de hoogtes van weergang, borstwering en kantelen.
const WALL = { u0: -9.25, u1: 9.0, v0: -11.0, v1: 11.1 };
const WALK = 17.4; // weergang achter de borstwering (NAP +26,5 m)
const CREN = 18.5; // bovenkant borstwering, onderkant van de tussenruimtes
const MERLON = 19.5; // bovenkant van de kantelen
const WEST_TOP = 18.3; // westgevel zonder kantelen, de daken lopen tot op de muur
const FRIEZE = 15.3; // onderkant van de kraag onder de uitkragende borstwering (noord en oost)
const OUT = 0.4; // uitkraging van die borstwering

// Zuidelijke dwarsvleugel: nok langs u op v = -5,85 m (+25,2 m, 62 graden), schild aan de oostkant.
const SOUTH = { ridgeV: -5.85, ridge: 25.2, t: 1.85, hipU: 4.3, hipT: 2.0 };
// Twee noordelijke schilddaken (nokken +24,1 m langs v); hellingen per vlak uit het AHN.
const NW_ROOF = { ridgeU: -4.87, v0: 2.9, v1: 6.2, ridge: 24.1, tw: 1.57, te: 1.53, tn: 1.7, ts: 1.93 };
const NE_ROOF = { ridgeU: 4.1, v0: 2.85, v1: 6.3, ridge: 24.1, tw: 1.77, te: 1.75, tn: 1.75, ts: 1.95 };
// Rechthoekige toren in de westgevel met een steil schilddak (68 graden).
const TOWER = { u0: -9.25, u1: -5.25, v0: -2.6, v1: 0.3, eave: 28.3, ridge: 32.9 };
// Ronde hoektorentjes: middelpunt, straal, kraag (onder, boven; null = vanaf het eiland), goot en spits.
const TURRETS = [
  { name: "zuidoost", c: [7.9, -10.0], r: 1.7, corbel: [14.2, 15.3], eave: 23.1, tip: 27.5 },
  { name: "noordoost", c: [7.9, 9.8], r: 1.75, corbel: [14.2, 15.3], eave: 20.7, tip: 26.1 },
  { name: "noordwest", c: [-7.9, 9.7], r: 1.75, corbel: null, eave: 20.9, tip: 26.3 },
];
// Bruggen: de noordbrug naar de voorburcht (dek +5,9 m) en de oostbrug naar het park (dek +3,8 tot +2,8 m).
const NORTH_BRIDGE = { u0: -2.1, u1: -0.1, v0: WALL.v1, v1: 27.0, top: 5.9, piers: [14.6, 18.2, 21.8], abutment: [25.2, 27.0] };
const EAST_BRIDGE = { u0: WALL.u1, u1: 21.0, v0: 7.6, v1: 8.8, top0: 3.8, top1: 2.8, piers: [12.5, 16.0, 19.5], abutment: [20.2, 21.0] };
const DECK = 0.9; // dikte van het brugdek

// Maaiveld op het kasteeleiland rond de muren (NAP +9,0 tot +9,4 m), niet in de gracht.
const GROUND_SAMPLES = [[0, -13], [-11, -12.5], [-11.5, 0], [5, 12.5]];

// Het brugdek hangt tussen de jukken; de export vult het op (wig tot de onderplaat).
const inRect = ([x, y], u0, u1, v0, v1) => x > u0 - 0.06 && x < u1 + 0.06 && y > v0 - 0.06 && y < v1 + 0.06;
const OVERHANG_OK = (z, p) =>
  p.every((q) => inRect(q, NORTH_BRIDGE.u0, NORTH_BRIDGE.u1, NORTH_BRIDGE.v0, NORTH_BRIDGE.v1)) ||
  p.every((q) => inRect(q, EAST_BRIDGE.u0, EAST_BRIDGE.u1, EAST_BRIDGE.v0, EAST_BRIDGE.v1));

// ---------- hoofdburcht ----------
const solids = [];
const circle = ([cx, cy], r, n = 16) =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)]);
// Achtkant met de hoeken op straal r (past binnen de ronde schacht).
const octIn = (c, r) => oct(c, 2 * r * Math.cos(Math.PI / 8));

// Muren tot de weergang.
solids.push(prism(rect(WALL.u0, WALL.u1, WALL.v0, WALL.v1), BASE, WALK));

// Zuidelijke dwarsvleugel met de nok langs u en een schild aan de oostkant; de westkant eindigt in de trapgevel.
{
  const { ridgeV, ridge, t, hipU, hipT } = SOUTH;
  solids.push(roofed(rect(WALL.u0, 8.6, -10.3, -1.5), [[0, t, ridge - t * ridgeV], [0, -t, ridge + t * ridgeV], [-hipT, 0, ridge + hipT * hipU]]));
}
// Twee schilddaken op het noordelijke deel met een kilgoot ertussen (u -0,5 tot 0,3 m).
for (const [R, u0, u1] of [[NW_ROOF, WALL.u0, 0.0], [NE_ROOF, 0.0, 8.6]]) {
  solids.push(
    roofed(rect(u0, u1, -1.5, 10.5), [
      [R.tw, 0, R.ridge - R.tw * R.ridgeU], // westhelling
      [-R.te, 0, R.ridge + R.te * R.ridgeU], // oosthelling
      [0, -R.tn, R.ridge + R.tn * R.v1], // noordschild
      [0, R.ts, R.ridge - R.ts * R.v0], // zuidschild
    ]),
  );
}

// Borstweringen: zuid (0,9 m dik) en west (zonder kantelen) op de muur, noord en oost op een kraag.
solids.push(prism(rect(WALL.u0, WALL.u1, WALL.v0, WALL.v0 + 0.9), BASE, CREN));
solids.push(prism(rect(WALL.u0, WALL.u0 + 0.7, WALL.v0, WALL.v1), BASE, WEST_TOP));
solids.push(prism(rect(WALL.u0, WALL.u1, WALL.v1 - 0.9, WALL.v1), BASE, CREN));
solids.push(prism(rect(WALL.u1 - 0.9, WALL.u1, WALL.v0, WALL.v1), BASE, CREN));
// Kraag (rondboogfries) onder de uitkragende borstwering: 0,4 m uit de gevel over 0,5 m hoogte.
solids.push(
  Manifold.hull([
    [WALL.u0, WALL.v1 - 0.2, FRIEZE], [WALL.u1, WALL.v1 - 0.2, FRIEZE],
    [WALL.u0, WALL.v1 - 0.2, CREN], [WALL.u1, WALL.v1 - 0.2, CREN],
    [WALL.u0, WALL.v1, FRIEZE], [WALL.u1, WALL.v1, FRIEZE],
    [WALL.u0, WALL.v1 + OUT, FRIEZE + 0.5], [WALL.u1, WALL.v1 + OUT, FRIEZE + 0.5],
    [WALL.u0, WALL.v1 + OUT, CREN], [WALL.u1, WALL.v1 + OUT, CREN],
  ]),
);
solids.push(
  Manifold.hull([
    [WALL.u1 - 0.2, WALL.v0, FRIEZE], [WALL.u1 - 0.2, WALL.v1, FRIEZE],
    [WALL.u1 - 0.2, WALL.v0, CREN], [WALL.u1 - 0.2, WALL.v1, CREN],
    [WALL.u1, WALL.v0, FRIEZE], [WALL.u1, WALL.v1, FRIEZE],
    [WALL.u1 + OUT, WALL.v0, FRIEZE + 0.5], [WALL.u1 + OUT, WALL.v1, FRIEZE + 0.5],
    [WALL.u1 + OUT, WALL.v0, CREN], [WALL.u1 + OUT, WALL.v1, CREN],
  ]),
);
// De hoek tussen beide kragen (noordoost), zodat de borstwering daar dicht is.
solids.push(
  Manifold.hull([
    [WALL.u1, WALL.v1, FRIEZE], [WALL.u1 + OUT, WALL.v1, FRIEZE + 0.5], [WALL.u1 + OUT, WALL.v1 + OUT, FRIEZE + 0.5], [WALL.u1, WALL.v1 + OUT, FRIEZE + 0.5],
    [WALL.u1, WALL.v1, CREN], [WALL.u1 + OUT, WALL.v1, CREN], [WALL.u1 + OUT, WALL.v1 + OUT, CREN], [WALL.u1, WALL.v1 + OUT, CREN],
  ]),
);
// Kantelen van 2 m met tussenruimtes van 0,9 m.
const merlons = (a0, a1, make) => {
  const n = Math.round((a1 - a0 + 0.9) / 2.9);
  const w = (a1 - a0 - (n - 1) * 0.9) / n;
  for (let k = 0; k < n; k++) solids.push(make(a0 + k * (w + 0.9), a0 + k * (w + 0.9) + w));
};
merlons(WALL.u0, WALL.u1, (a, b) => prism(rect(a, b, WALL.v0, WALL.v0 + 0.9), CREN - 0.1, MERLON));
merlons(WALL.u0 + 0.7, WALL.u1, (a, b) => prism(rect(a, b, WALL.v1 - 0.9, WALL.v1 + OUT), CREN - 0.1, MERLON));
merlons(WALL.v0 + 0.9, WALL.v1 - 0.9, (a, b) => prism(rect(WALL.u1 - 0.9, WALL.u1 + OUT, a, b), CREN - 0.1, MERLON));

// Trapgevel aan de westkant van de dwarsvleugel: vijf treden naar het zuiden, drie naar de toren, en een schoorsteen.
{
  const roofAt = (v) => SOUTH.ridge - SOUTH.t * Math.abs(v - SOUTH.ridgeV);
  const g0 = WALL.u0;
  const g1 = WALL.u0 + 0.85;
  const top = [SOUTH.ridgeV - 0.5, SOUTH.ridgeV + 0.5];
  solids.push(prism(rect(g0, g1, top[0], top[1]), BASE, SOUTH.ridge + 0.6));
  const south = (top[0] - WALL.v0) / 5;
  for (let k = 0; k < 5; k++) {
    const a = WALL.v0 + k * south;
    solids.push(prism(rect(g0, g1, a, a + south), BASE, Math.max(MERLON, roofAt(a + south) + 0.5)));
  }
  const north = (TOWER.v0 - top[1]) / 3;
  for (let k = 0; k < 3; k++) {
    const a = top[1] + k * north;
    solids.push(prism(rect(g0, g1, a, a + north), BASE, roofAt(a) + 0.5));
  }
}

// Toren in de westgevel: schacht tot +28,3 m, een uitzwenkende voet en een schilddak met een korte nok langs u.
{
  const { u0, u1, v0, v1, eave, ridge } = TOWER;
  const vc = (v0 + v1) / 2;
  const half = (v1 - v0) / 2 + 0.25;
  const ridgeHalf = (u1 - u0) / 2 + 0.25 - half;
  const uc = (u0 + u1) / 2;
  solids.push(prism(rect(u0, u1, v0, v1), BASE, eave));
  solids.push(
    loft([
      [eave, rect(u0, u1, v0, v1)],
      [eave + 0.3, rect(u0 - 0.25, u1 + 0.25, v0 - 0.25, v1 + 0.25)],
      [ridge, [[uc - ridgeHalf, vc], [uc + ridgeHalf, vc]]],
    ]),
  );
}

// Hoektorentjes: ronde schacht (op een kraag of vanaf het eiland) met een achtkantige spits.
for (const { c, r, corbel, eave, tip: top } of TURRETS) {
  const sections = corbel
    ? [[corbel[0], circle(c, r - 0.8)], [corbel[1], circle(c, r)]]
    : [[BASE, circle(c, r)]];
  solids.push(loft([...sections, [eave, circle(c, r)]]));
  solids.push(loft([[eave - 0.01, octIn(c, r)], [top, tip(c)]]));
}

// Schoorstenen: op de trapgevel, op de oostgevel (twee) en op de westgevel.
for (const [u, v, w, d, z] of [[-8.85, SOUTH.ridgeV, 0.85, 1.0, 26.5], [8.55, -5.6, 0.9, 1.2, 24.7], [8.55, 6.5, 0.9, 1.0, 23.7], [-8.8, 3.7, 0.9, 1.0, 22.9]]) {
  solids.push(prism(rect(u - w / 2, u + w / 2, v - d / 2, v + d / 2), BASE, z));
}

// Dakkapellen met een spitsje: twee op de zuidhelling van de dwarsvleugel, twee op de noordschilden, een op de oost- en een op de westhelling.
const dormer = (pts, z, spire) => {
  solids.push(prism(pts, BASE, z));
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  solids.push(loft([[z - 0.01, pts], [z + spire, tip([cx, cy])]]));
};
for (const u of [-3.0, 3.0]) dormer(rect(u - 0.7, u + 0.7, -9.6, -8.0), 20.3, 1.6);
for (const u of [NW_ROOF.ridgeU, NE_ROOF.ridgeU]) dormer(rect(u - 0.7, u + 0.7, 8.4, 9.9), 20.0, 1.6);
dormer(rect(6.4, 7.9, 3.6, 5.0), 20.0, 1.6);
dormer(rect(-8.4, -6.9, 5.8, 7.2), 20.0, 1.6);

// Erkers (privaten) op een kraag met een lessenaarsdak, en de privaatschacht in de oostgevel.
// [u of v langs de gevel, gevel, breedte, diepte, onderkant, bovenkant]
const bay = (s, side, w, d, z0, z1) => {
  const pts = [];
  for (const [o, z] of [[0, z0 - d - 0.1], [d, z0], [d, z1], [0, z1 + d + 0.1]]) {
    for (const t of [s - w / 2, s + w / 2]) {
      for (const back of [0, -0.3]) {
        const depth = o + back;
        if (side === "south") pts.push([t, WALL.v0 - depth, z]);
        else pts.push([WALL.u1 + depth, t, z]);
      }
    }
  }
  solids.push(Manifold.hull(pts));
};
bay(-7.6, "south", 1.4, 0.8, 9.2, 12.3);
bay(6.0, "south", 1.4, 0.8, 5.0, 9.0);
bay(-8.0, "east", 1.4, 0.8, 9.5, 12.5);
bay(1.5, "east", 1.6, 0.6, 6.0, 14.6);

// Bruggen: dek van 0,9 m op houten jukken (als wandjes van 0,9 m) en een landhoofd aan de overkant.
{
  const B = NORTH_BRIDGE;
  solids.push(prism(rect(B.u0, B.u1, B.v0 - 0.3, B.v1), B.top - DECK, B.top));
  for (const v of B.piers) solids.push(prism(rect(B.u0, B.u1, v - 0.45, v + 0.45), BASE, B.top - DECK + 0.01));
  solids.push(prism(rect(B.u0, B.u1, B.abutment[0], B.abutment[1]), BASE, B.top - DECK + 0.01));
}
{
  const B = EAST_BRIDGE;
  const slope = (B.top1 - B.top0) / (B.u1 - B.u0);
  const deckTop = [slope, 0, B.top0 - slope * B.u0];
  const deck = cutBelow(prism(rect(B.u0 - 0.3, B.u1, B.v0, B.v1), BASE, 10), deckTop);
  const under = cutBelow(prism(rect(B.u0 - 0.3, B.u1, B.v0, B.v1), BASE, 10), [deckTop[0], 0, deckTop[2] - DECK]);
  solids.push(deck.subtract(under));
  for (const u of B.piers) solids.push(cutBelow(prism(rect(u - 0.45, u + 0.45, B.v0, B.v1), BASE, 10), [deckTop[0], 0, deckTop[2] - DECK + 0.01]));
  solids.push(cutBelow(prism(rect(B.abutment[0], B.abutment[1], B.v0, B.v1), BASE, 10), [deckTop[0], 0, deckTop[2] - DECK + 0.01]));
}

let castle = Manifold.union(solids);

// Vensternissen in vier gevels en de deuren aan de bruggen.
const cuts = [];
const win = (c, ang, a, z0, z1, w = 1.1) => cuts.push(niche(c, ang, a, 0, w, z0, z1, 0.4));
for (const u of [-4.8, -0.25, 4.8]) win([u, 0], 270, -WALL.v0, 11.6, 13.2);
for (const u of [-3.7, 2.5]) win([u, 0], 270, -WALL.v0, 6.4, 8.4);
for (const u of [4.3, -1.1, -5.6]) win([u, 0], 90, WALL.v1, 12.8, 14.4);
for (const u of [4.3, -6.0]) win([u, 0], 90, WALL.v1, 8.7, 10.6);
for (const v of [-2.5, 5.4]) win([0, v], 0, WALL.u1, 11.6, 13.0), win([0, v], 0, WALL.u1, 6.0, 8.2);
for (const v of [6.6, 1.2, -7.6]) win([0, v], 180, -WALL.u0, 14.6, 15.8);
for (const v of [7.0, 0.7, -8.1]) win([0, v], 180, -WALL.u0, 10.6, 12.0);
// Torenvenster (west) en de vensters in de hoektorentjes.
win([0, (TOWER.v0 + TOWER.v1) / 2], 180, -TOWER.u0, 22.0, 23.4, 1.0);
for (const [{ c, r }, angs] of [[TURRETS[0], [0, 270]], [TURRETS[1], [0, 90]], [TURRETS[2], [90, 180]]]) {
  for (const a of angs) cuts.push(niche(c, a, r, 0, 0.9, 16.5, 17.8, 0.4));
}
// Toegangsdeur aan de noordbrug en de deur aan de oostbrug.
cuts.push(niche([(NORTH_BRIDGE.u0 + NORTH_BRIDGE.u1) / 2, 0], 90, WALL.v1, 0, 1.6, NORTH_BRIDGE.top, NORTH_BRIDGE.top + 2.4, 0.6));
cuts.push(niche([0, (EAST_BRIDGE.v0 + EAST_BRIDGE.v1) / 2], 0, WALL.u1, 0, 1.1, EAST_BRIDGE.top0, EAST_BRIDGE.top0 + 2.2, 0.6));
castle = castle.subtract(Manifold.union(cuts));

const nodes = [["building:kasteel", castle]];
const all = castle;

const META = {
  name: "Kasteel Doornenburg",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 52.9,
  replacesBuildings: ["1705100000019617"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (197103,2, 434088,0), midden in de hoofdburcht, op het maaiveld van het kasteeleiland (NAP +9,1 m), +X langs de zuidgevel (16 graden rechtsom vanaf de RD-X-as) en +Y loodrecht daarop naar de voorburcht. Een node building:kasteel uit dakvlakken en bouwdelen: muren tot de weergang met borstweringen en kantelen (noord en oost op een kraag), de zuidelijke dwarsvleugel met een trapgevel en een schild, twee noordelijke schilddaken, de toren in de westgevel met een steil schilddak, drie ronde hoektorentjes met achtkantige spitsen, dakkapellen, schoorstenen, erkers, vensternissen en de houten noord- en oostbrug op jukken. Onderkant 1 m onder het eiland; alle vlakken wijzen omhoog of staan verticaal, op het brugdek na. Vervangt de PDOK-reconstructie van de hoofdburcht. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { walkM: WALK, southRidgeM: SOUTH.ridge, northRidgesM: NW_ROOF.ridge, towerRidgeM: TOWER.ridge, southEastSpireM: TURRETS[0].tip, northBridgeDeckM: NORTH_BRIDGE.top, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Kasteel_Doornenburg",
    "PDOK BAG pand 1705100000019617 (de hoofdburcht), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: daken, weergang, torens, bruggen en het maaiveld van het eiland",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken, toren en spitsen",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's vanaf de west-, zuidoost-, oost- en noordkant",
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

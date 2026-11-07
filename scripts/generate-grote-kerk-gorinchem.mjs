// Grote Kerk (Sint-Janskerk) met de Grote of Sint-Janstoren, Gorinchem: generator uit de BAG-contour, het AHN-DSM
// en foto's. Basiliek van Warnsinck (1849-1851): middenschip met zadeldak en lichtbeuk, zijbeuken met lessenaarsdaken,
// zeven traveeën met lisenen, kroonlijsten op een schuine kraag, rondboogvensters als nissen met een spitse top,
// oost- en westgevel met topgevel en halve topgevels, een vooruitstekend oostportaal met fronton, en het tussenlid
// (consistorie) naar de laatgotische toren (circa 1450-1517) met paarsgewijze hoeksteunberen, drie geledingen met
// spitsboognissen, omgang, borstwering met hoekpinakels, wijzerplaten, traptorentje en achtkante spits. De toren helt
// (AHN-DSM) op de borstwering circa 1,3 m naar het zuiden en 0,6 m naar het westen: een lineaire afschuiving.
// Maten in meters, oorsprong RD (126460,88; 426854,41) midden in het kerkgebouw, +X langs de nok naar het oosten
// onder 1,0 graad; z = 0 op het laagste maaiveld bij de toren (NAP +1,88 m). Onderkant op -0,4 m.
// node scripts/generate-grote-kerk-gorinchem.mjs [--scale 1000] [--out map] [--components]
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "grote-kerk-gorinchem");
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

// Doorsnede-as langs Y (profiel [x, z]) uitgetrokken van y0 tot y1.
const profileY = (pts, y0, y1) => profileX(pts, -y1, -y0).rotate([0, 0, -90]);
// Rechthoek rond een middelpunt met halve maten.
const box = ([cu, cv], hu, hv) => rect(cu - hu, cu + hu, cv - hv, cv + hv);
// Ruitvormige oculus (breedte w, hoogte 1,25 w) als nis in een gevel; bovenranden onder 51 graden.
const oculus = ([cx, cy], angle, a, s, w, zc, d = 0.4) =>
  profileX([[s, zc - 0.625 * w], [s + w / 2, zc], [s, zc + 0.625 * w], [s - w / 2, zc]], a - d, a + 0.4)
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Roosvenster als ronde, afgeschuinde verhoging (zestienhoek) op de gevel: de rand loopt onder 50 graden terug,
// zodat de onderkant zonder steun print; het middelste rondje steekt nog iets verder uit.
const rose = ([fu, fv], out, r, zc, d = 0.3) => {
  const ring = (rr) => Array.from({ length: 16 }, (_, k) => [fv + rr * Math.cos((k * Math.PI) / 8), zc + rr * Math.sin((k * Math.PI) / 8)]);
  // Afgeknotte kegel langs ±u: straal r op de gevel, r - 1,2 d aan de voorkant.
  const pts = [...ring(r + 0.12).map(([v, z]) => [fu - out * 0.1, v, z]), ...ring(r - 1.2 * d).map(([v, z]) => [fu + out * d, v, z])];
  const ri = Math.min(0.9, 0.45 * r);
  const inner = [...ring(ri).map(([v, z]) => [fu + out * (d - 0.05), v, z]), ...ring(ri - 1.2 * 0.2).map(([v, z]) => [fu + out * (d + 0.15), v, z])];
  return Manifold.union(Manifold.hull(pts), Manifold.hull(inner));
};

const SLUG = "grote-kerk-gorinchem";
const BASE = -0.4;
const ORIGIN = [126460.88, 426854.41];
const X_AXIS = [0.999848, 0.017452];
const GROUND_SAMPLES = [[-46.5, 0], [-38, 9], [-38, -10.5], [-10, 17], [10, 17], [-10, -17], [10, -17], [27, 0]];

// ---------- kerk (Warnsinck, 1849-1851) ----------
// BAG: kerkgebouw u -21,8..21,8 en v -15,17..15,17; AHN-DSM: lichtbeukmuren op v = ±8,0.
const W = -21.8, E = 21.8, HALF = 15.17, NAVE = 8.0;
const AISLE_SLOPE = 0.4, AISLE_C = 17.62; // lessenaarsdak z = 17,62 - 0,4 |v|: goot 11,55 aan de buitenmuur
const NAVE_RIDGE = 24.92, NAVE_SLOPE = 0.39; // nok +24,92, goot +21,80 op de lichtbeukmuur
const BAY = (E - W) / 7;
const church = [];
const churchCuts = [];
const aisleRoof = (side, lift = 0) => [0, -side * AISLE_SLOPE, AISLE_C + lift];
// Zijbeuken met lessenaarsdaken en het middenschip met zadeldak.
for (const side of [-1, 1]) {
  const [lo, hi] = side < 0 ? [-HALF, -NAVE + 0.2] : [NAVE - 0.2, HALF];
  church.push(roofed(rect(W, E, lo, hi), [aisleRoof(side)]));
}
church.push(roofed(rect(W, E, -NAVE, NAVE), ridgeV(0, NAVE_RIDGE, NAVE_SLOPE)));
// Natuurstenen plint tot +3,0 met een afgeschuinde bovenkant.
church.push(loft([[BASE, rect(W - 0.2, E + 0.2, -HALF - 0.2, HALF + 0.2)], [2.8, rect(W - 0.2, E + 0.2, -HALF - 0.2, HALF + 0.2)], [3.0, rect(W, E, -HALF, HALF)]]));
// Kroonlijsten op een schuine kraag (rondboogfriezen): zijbeuken en lichtbeuk, langs beide lange gevels.
for (const side of [-1, 1]) {
  const f = side * HALF, n = side * NAVE;
  church.push(profileX([[f - side * 0.1, 10.8], [f + side * 0.4, 11.3], [f + side * 0.4, 11.75], [f - side * 0.1, 11.75]], W - 0.4, E + 0.4));
  church.push(profileX([[n - side * 0.1, 20.85], [n + side * 0.35, 21.35], [n + side * 0.35, 22.0], [n - side * 0.1, 22.0]], W, E));
}
// Lisenen tussen de zeven traveeën: op de zijbeukmuur tot de kroonlijst, op de lichtbeuk vanaf het lessenaarsdak.
for (let k = 1; k < 7; k++) {
  const u = W + k * BAY;
  for (const side of [-1, 1]) {
    church.push(prism(side < 0 ? rect(u - 0.5, u + 0.5, -HALF - 0.4, -HALF + 0.1) : rect(u - 0.5, u + 0.5, HALF - 0.1, HALF + 0.4), BASE, 11.75));
    church.push(prism(side < 0 ? rect(u - 0.4, u + 0.4, -NAVE - 0.3, -NAVE + 0.1) : rect(u - 0.4, u + 0.4, NAVE - 0.1, NAVE + 0.3), 13.0, 22.0));
  }
}
// Oost- en westgevel: hoeklisenen (1,2 m) tot boven de kroonlijst, lisenen op de hoeken van het middenschip tot +23,0,
// verhoogde gevelranden op de topgevel en de halve topgevels, kroonlijst op een kraag over de hele gevel en een
// topstuk op de top.
for (const [face, out] of [[E, 1], [W, -1]]) {
  for (const side of [-1, 1]) {
    church.push(prism(box([face - out * 0.2, side * (HALF - 0.2)], 0.6, 0.6), BASE, 12.3));
    church.push(prism(box([face - out * 0.2, side * NAVE], 0.6, 0.7), BASE, 23.0));
    const [lo, hi] = side < 0 ? [-HALF, -NAVE] : [NAVE, HALF];
    church.push(roofed(rect(Math.min(face, face - out * 0.6), Math.max(face, face - out * 0.6), lo, hi), [aisleRoof(side, 0.35)]));
  }
  church.push(roofed(rect(Math.min(face, face - out * 0.6), Math.max(face, face - out * 0.6), -NAVE, NAVE), ridgeV(0, NAVE_RIDGE + 0.38, NAVE_SLOPE)));
  church.push(prism(box([face - out * 0.45, 0], 0.45, 0.6), 23.5, 25.9));
  church.push(profileY([[face - out * 0.1, 10.85], [face + out * 0.35, 11.35], [face + out * 0.35, 11.75], [face - out * 0.1, 11.75]].map(([x, z]) => [x, z]), -HALF, HALF));
}
// Oostportaal (BAG 3,0 m diep, 7,0 m breed) met fronton (nok +10,9 langs de as), hoeklisenen, deur, oculus en zijdeuren.
const PV = -0.12;
church.push(roofed(rect(E - 0.3, E + 3.0, PV - 3.5, PV + 3.5), ridgeV(PV, 10.9, 0.57)));
church.push(roofed(rect(E + 2.5, E + 3.0, PV - 3.5, PV + 3.5), ridgeV(PV, 11.2, 0.57)));
for (const s of [-1, 1]) church.push(prism(box([E + 2.85, PV + s * 3.1], 0.45, 0.45), BASE, 9.3));
churchCuts.push(niche([0, 0], 0, E + 3.0, PV, 2.2, 0.4, 4.4, 0.4));
churchCuts.push(oculus([0, 0], 0, E + 3.0, PV, 1.2, 7.25));
churchCuts.push(niche([E + 1.5, PV], 90, 3.5, 0, 1.0, 0.4, 2.8, 0.3));
churchCuts.push(niche([E + 1.5, PV], 270, 3.5, 0, 1.0, 0.4, 2.8, 0.3));
// Roosvenster in de oostelijke topgevel, vensters in de zijbeukgevels.
church.push(rose([E, 0], 1, 2.3, 17.2));
for (const s of [-1, 1]) churchCuts.push(niche([0, 0], 0, E, s * 11.6, 2.6, 3.6, 8.7, 0.4));
// Lange gevels: grote rondboogvensters per travee, in de middelste travee een oculus boven de zijingang; lichtbeukvensters.
for (let k = 0; k < 7; k++) {
  const u = W + (k + 0.5) * BAY;
  for (const [angle, s] of [[270, u], [90, -u]]) {
    if (k === 3) {
      churchCuts.push(oculus([0, 0], angle, HALF, s, 2.0, 8.6));
      churchCuts.push(niche([0, 0], angle, HALF, s, 1.8, 0.4, 3.6, 0.4));
    } else churchCuts.push(niche([0, 0], angle, HALF, s, 2.6, 3.6, 8.7, 0.4));
    churchCuts.push(niche([0, 0], angle, NAVE, s, 1.6, 15.6, 19.0, 0.4));
  }
}

// ---------- tussenlid (consistorie) tussen kerk en toren ----------
// BAG u -30,7..-21,8, v -4,9..4,58; AHN: nok +23,8 langs de as, goot +22,3. Twee bouwlagen.
const LV = -0.16;
church.push(roofed(rect(-33.0, W + 0.3, -4.9, 4.58), ridgeV(LV, 23.8, 0.32)));
for (const side of [-1, 1]) {
  const f = side < 0 ? -4.9 : 4.58;
  church.push(profileX([[f - side * 0.1, 21.35], [f + side * 0.35, 21.85], [f + side * 0.35, 22.45], [f - side * 0.1, 22.45]], -32.6, W + 0.3));
  for (const u of [-28.4, -25.0]) {
    churchCuts.push(niche([0, LV], side < 0 ? 270 : 90, side < 0 ? 4.74 : 4.74, side < 0 ? u : -u, 1.6, 15.2, 19.2, 0.35));
    for (const du of [-0.9, 0.9]) churchCuts.push(niche([0, LV], side < 0 ? 270 : 90, 4.74, side < 0 ? u + du : -(u + du), 0.9, 1.0, 3.2, 0.3));
  }
}

// ---------- toren (circa 1450, spits 1517) ----------
// BAG: romp u -43,12..-31,95 en v -6,38..5,34 met twee steunberen per hoek (1,55 m breed, 1,6 tot 1,75 m diep).
// AHN-DSM: bovenste geleding circa 10,5 x 9,2 m rond (-38,1; -1,85), borstwering +45,1, traptorentje +50,1, top van de
// spits +59,3. De toren springt per geleding terug (0,15 en 0,33 m op de oost- en westgevel, 0,6 en 1,25 m op de noord-
// en zuidgevel) en helt over: de rest van het verschil.
const TC = [-37.535, -0.52], TU = 5.585, TV = 5.86;
const tower = [];
const towerCuts = [];
// Geledingen [z0, z1, terugsprong u, terugsprong v, diepte steunbeer].
const stages = [[BASE, 19.5, 0, 0, 1.7], [19.5, 31.5, 0.15, 0.6, 1.1], [31.5, 45.1, 0.33, 1.25, 0.55]];
const hu = (i) => TU - stages[i][2], hv = (i) => TV - stages[i][3];
stages.forEach(([z0, z1], i) => tower.push(prism(box(TC, hu(i), hv(i)), z0, z1)));
// Plint tot +6,5; waterlijst op +19,5 en de omgang op +31,5 als banden op een kraag van 45 graden.
tower.push(loft([[BASE, box(TC, TU + 0.25, TV + 0.25)], [6.25, box(TC, TU + 0.25, TV + 0.25)], [6.5, box(TC, TU, TV)]]));
tower.push(loft([[19.25, box(TC, hu(0), hv(0))], [19.5, box(TC, hu(0) + 0.2, hv(0) + 0.2)], [19.9, box(TC, hu(0) + 0.2, hv(0) + 0.2)]]));
tower.push(loft([[31.15, box(TC, hu(1), hv(1))], [31.45, box(TC, hu(1) + 0.25, hv(1) + 0.25)], [32.7, box(TC, hu(1) + 0.25, hv(1) + 0.25)]]));
// Twee steunberen per hoek die met de geledingen terugspringen (1,7 / 1,1 / 0,55 m diep), met schuine bovenkanten.
const buttressLoft = (make) => {
  const secs = [];
  stages.forEach(([z0, z1, iu, iv, d], i) => {
    if (i) {
      const [, , pu, pv, pd] = stages[i - 1];
      secs.push([z0 + Math.max(pd - d + iu - pu, pd - d + iv - pv) + 0.05, make(i, d)]);
    } else secs.push([z0, make(i, d)]);
    secs.push([i === 2 ? 43.0 : z1, make(i, d)]);
  });
  secs.push([43.6, make(2, 0.05)]);
  return loft(secs);
};
for (const su of [-1, 1]) for (const sv of [-1, 1]) {
  if (su > 0 && sv > 0) continue; // noordoosthoek: het traptorentje
  const cu = (i) => TC[0] + su * hu(i), cv = (i) => TC[1] + sv * hv(i);
  const span = (c, s, a, b) => [Math.min(c - s * a, c + s * b), Math.max(c - s * a, c + s * b)];
  // Steunbeer op de gevel naar ±u (west/oost) en op de gevel naar ±v (noord/zuid), vlak met de andere gevel.
  tower.push(buttressLoft((i, d) => { const [u0, u1] = span(cu(i), su, 0.5, d), [v0, v1] = span(cv(i), sv, 1.55, 0); return rect(u0, u1, v0, v1); }));
  tower.push(buttressLoft((i, d) => { const [u0, u1] = span(cu(i), su, 1.55, 0), [v0, v1] = span(cv(i), sv, 0.5, d); return rect(u0, u1, v0, v1); }));
  // Hoekpinakels op de borstwering.
  tower.push(pinnacle([cu(2) - su * 0.6, cv(2) - sv * 0.6], 0.5, 45.0, 2.1, 1.6));
}
// Borstwering rond het torendak (+45,1 tot +46,3).
tower.push(Manifold.difference(prism(box(TC, hu(2), hv(2)), 44.9, 46.3), prism(box(TC, hu(2) - 0.55, hv(2) - 0.55), 45.4, 47)));
// Achtkante leien spits met een geknikte voet, tot +59,3.
tower.push(loft([[45.2, oct(TC, 7.6)], [46.0, oct(TC, 7.6)], [47.0, oct(TC, 6.8)], [59.3, tip(TC)]]));
// Achtkant traptorentje op de noordoosthoek, een verdieping boven de borstwering, met een kraag en een spitsje
// (AHN-top +50,1 op 0,5 m; de dunne punt tot +51,0).
const ST = [-34.2, 4.7];
const turret = loft([[BASE, oct(ST, 2.8)], [47.6, oct(ST, 2.8)], [47.9, oct(ST, 3.2)], [48.3, oct(ST, 3.2)], [51.0, tip(ST)]]);
// Spitsboognissen: twee per gevel in elke geleding; de galmgaten in de bovenste geleding dieper. De oostgevel
// alleen boven het tussenlid.
for (const [angle, h] of [[0, hu], [90, hv], [180, hu], [270, hv]]) {
  for (const s of [-1.95, 1.95]) {
    if (angle !== 0) {
      towerCuts.push(niche(TC, angle, h(0), s, 2.1, 8.0, 17.0, 0.4));
      towerCuts.push(niche(TC, angle, h(1), s, 2.0, 20.8, 29.0, 0.4));
    }
    towerCuts.push(niche(TC, angle, h(2), s, 1.8, 34.0, 41.5, 0.45));
  }
  // Wijzerplaat (1,0 m straal) midden boven de galmgaten, als ronde verhoging zoals het roosvenster.
  tower.push(rose([h(2), 0], 1, 1.0, 43.6, 0.3).rotate([0, 0, angle]).translate([TC[0], TC[1], 0]));
}
// Westingang onder de vensters.
towerCuts.push(niche(TC, 180, TU, 0, 1.8, 0.4, 3.4, 0.4));
// Scheefstand: lineaire afschuiving, 0,0126 m per m naar -u en 0,0295 m per m naar -v (op de borstwering 0,57 en 1,33 m;
// samen met de terugsprongen ligt het midden van de bovenste geleding dan op het AHN-midden).
const LEAN = [-0.0126, -0.0295];
const towerSolid = Manifold.union(Manifold.difference(Manifold.union(tower), Manifold.union(towerCuts)), turret).transform([1, 0, 0, 0, 0, 1, 0, 0, LEAN[0], LEAN[1], 1, 0, 0, 0, 0, 1]);
const churchSolid = Manifold.difference(Manifold.union(church), Manifold.union(churchCuts));
const complex = Manifold.union([churchSolid, towerSolid]).trimByPlane([0, 0, 1], BASE);
const nodes = [["building:kerk", complex]];
const all = complex;
const META = {
  name: "Grote Kerk Gorinchem",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: -0.1,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 45.46,
  replacesBuildings: ["0512100000038532"],
  plate: false,
  description:
    "Grote Kerk (Warnsinck, 1849-1851) met de laatgotische Grote of Sint-Janstoren in één BAG-pand: basiliek met middenschip (nok +24,9 m) en lichtbeuk, zijbeuken met lessenaarsdaken, zeven traveeën met lisenen, kroonlijsten, rondboogvensters en oculi als nissen, oost- en westgevel met topgevel, roosvenster en oostportaal met fronton, het tussenlid (consistorie), en de toren met paarsgewijze hoeksteunberen, drie geledingen met spitsboognissen, omgang, borstwering met hoekpinakels, traptorentje en achtkante spits tot +59,3 m, scheef zoals in het AHN (circa 1,4 m op de borstwering). Oorsprong RD (126460,88; 426854,41) midden in de kerk op het laagste maaiveld (NAP +1,88 m), X-as langs de nok naar het oosten onder 1,0 graad.",
  realWorld: {
    built: "toren circa 1450, spits 1517 (scheef door verzakking tijdens de bouw); kerk 1849-1851 naar ontwerp van I. Warnsinck",
    monument: [381885, 16634],
    groundNapM: 1.88,
    aisleEaveM: 11.55,
    naveEaveM: 21.8,
    naveRidgeM: 24.92,
    porticoRidgeM: 10.9,
    linkRidgeM: 23.8,
    towerParapetM: 45.1,
    stairTurretTopM: 50.1,
    towerTopM: 59.3,
    towerLeanM: [-0.57, -1.33],
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Grote_Kerk_(Gorinchem)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/381885 (kerk)",
    "https://monumentenregister.cultureelerfgoed.nl/monumenten/16634 (toren)",
    "https://commons.wikimedia.org/wiki/Category:Grote_Kerk,_Gorinchem (RCE 20299979, 20268339, 20080445, 20276775, 20268336, 20415511; P1170836, P1170840, P1170848; rijksmonument 381885 en 16634 20120311; IMG 3578 2018)",
    "BAG pand 0512100000038532 (voetafdruk van kerk, tussenlid en toren)",
    "PDOK AHN dsm_05m/dtm_05m en actuele luchtfoto",
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
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
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

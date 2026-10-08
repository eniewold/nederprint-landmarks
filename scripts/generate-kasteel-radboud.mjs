// Genereert een gesloten 3D-model van Kasteel Radboud in Medemblik uit
// dakvlakken en bouwdelen: het overgebleven deel van de dwangburcht van Floris V
// (1288), een L van twee vleugels in de slotgracht. De westvleugel (met de
// Ridderzaal) heeft een zadeldak van 56 graden met de nok op +16,2 m NAP, een
// trapgevel met een schoorsteen aan de binnenplaats en een steil schild aan de
// zuidkant tegen de ronde zuidwesttoren. De oostvleugel heeft twee delen: het
// westelijke achter gekanteelde borstweringen (nok +14,9 m) en het hogere
// oostelijke (nok +15,9 m) met een trapgevel aan de oostkant, een trapgevel als
// tussengevel en een noordhelling die knikt en over de lage noordaanbouw
// doorloopt tot een goot op +6,85 m. Verder de vierkante noordwesttoren en de
// zuidtoren met een tentdak, de ronde zuidwesttoren met een borstwering op een
// kraag, kantelen en een achtkante spits, het hoekblok aan de noordoostkant met
// een hoge schoorsteen, schoorstenen, dakkapellen en vensternissen, en als
// tweede onderdeel de brug over de slotgracht naar de Oosterdijk. Elk dak is een
// vlak z = a u + b v + c uit het AHN. Het Mapbox-model is niet gebruikt. Alle
// maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus binaire STL's in millimeters op 1:<schaal> (los en met een grondplaat).
//
//   node scripts/generate-kasteel-radboud.mjs              # 1:1000 (standaard)
//   node scripts/generate-kasteel-radboud.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (136500, 531715), in de binnenhoek van het
// kasteel, op het maaiveld van het kasteeleiland (NAP +2,1 m), Z omhoog. +X loopt
// langs de nokken van de oostvleugel naar het oostnoordoosten (26 graden linksom
// vanaf de RD-X-as, gemeten aan de dakvlakken in het AHN) en +Y loodrecht daarop,
// naar de binnenplaats. De westvleugel ligt op u -11,6 tot 0,3 m, de oostvleugel
// op v -7 tot 3,5 m (5,5 m met de noordaanbouw). De west- en zuidgevel en de
// torens staan in de slotgracht (water NAP 0,0 m), daarom begint het model 1 m
// onder het water. De brug ligt 22 m ten noorden van het kasteel, op v 35,9 tot
// 50,8 m.
//
// Bronnen: PDOK BAG-pand 0420100000015201; AHN DSM/DTM 0,5 m (PDOK WCS) voor de
// dakvlakken, nokken, torens, borstweringen, schoorstenen en het maaiveld; BGT
// overbruggingsdeel voor de brug; Wikipedia; PDOK luchtfoto; foto's op Wikimedia
// Commons vanaf de noord-, noordoost-, oost-, zuid- en westkant. Geschat zijn de
// kantelen (1,6 m breed, 1 m tussenruimte; in het echt smaller), de kragen onder
// de borstweringen en de tentdaken, de treden van de trapgevels (0,94 tot 1,08 m
// in plaats van circa 0,5 m), de hoogte van de schoorsteen op de westgevel, de
// dakkapellen en vensternissen, de vleugelmuren en poortpijlers van de brug en de
// bogen (spits in plaats van rond). Weggelaten: het klokkentorentje met windvaan
// in de binnenhoek, de trappen aan de binnenplaats, de luiken, de houten
// leuningen van de brug en de lage muurresten van de verdwenen vleugels op het
// eiland (alle kleiner dan 0,9 m of lager dan 1 m).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-radboud");
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

const SLUG = "kasteel-radboud";

// ---------- maten (lokaal stelsel, z = NAP - 2,1 m: het maaiveld van het kasteeleiland; hoogtes hieronder in NAP) ----------
const GROUND_NAP = 2.1;
const NAP = (h) => h - GROUND_NAP;
const ORIGIN = [136500.0, 531715.0];
const X_AXIS = [0.898794, 0.438371]; // RD-richting 26 graden, langs de nokken van de oostvleugel
// De west- en zuidgevel en de torens staan in de slotgracht (water NAP 0,0 m); het model begint 1 m daaronder.
const BASE = NAP(-1.0);

// Westvleugel (Ridderzaal) van de zuidwesttoren tot de trapgevel aan de binnenplaats: nok langs v op u = -5,6 m.
const WEST = { u0: -11.6, u1: 0.3, v0: -7.0, v1: 12.9, ridgeU: -5.6, ridge: 16.2, t: 1.46 };
// Schild aan de zuidkant: goot op v = -6,1 m (+9,3 m), helling 69 graden tot aan de nok.
const WEST_HIP = { v: -6.1, eave: 9.3, t: 2.56 };
// Oostvleugel, westelijk deel achter de kantelen: nok langs u op v = -1,63 m (+14,9 m), 52 graden.
const MID = { u0: -5.0, u1: 9.1, v0: -7.0, v1: 3.5, ridgeV: -1.63, ridge: 14.9, t: 1.29 };
// Oostvleugel, oostelijk deel: hogere nok op v = -2,75 m (+15,9 m), 55 graden; aan de noordkant knikt het dak
// op v = 0,6 m naar 39 graden en loopt het over de lage noordaanbouw door tot de goot op v = 5,5 m (+6,85 m).
const EAST = { u0: 9.1, u1: 18.9, v0: -7.0, v1: 5.5, ridgeV: -2.75, ridge: 15.9, t: 1.45, lower: [0, -0.8, 11.25] };
// Hoekblok aan de noordoostkant met een hoge schoorsteen.
const ANNEX = { u0: 18.6, u1: 20.0, v0: 0.7, v1: 5.5, top: 10.0 };
// Torens: de vierkante noordwesttoren en zuidtoren met een tentdak, de ronde zuidwesttoren met kantelen en een achtkante spits.
const NW_TOWER = { u0: -15.2, u1: -10.4, v0: 9.9, v1: 14.3, wall: 11.0, eave: 11.6, apex: 16.5 };
const S_TOWER = { u0: 6.9, u1: 11.7, v0: -11.0, v1: -6.0, wall: 10.3, eave: 10.9, apex: 16.2 };
const ROUND = { c: [-10.9, -7.05], r: 4.75, rPar: 5.05, kraag: 8.7, walk: 9.9, merlon: 10.9, spire: 3.7, apex: 18.2 };
// Borstweringen (bovenkant) en kantelen (bovenkant), kantelen 1,6 m breed met 1 m tussenruimte.
const PARAPETS = {
  west: { top: 9.2, merlon: 10.3 },
  south: { top: 9.3, merlon: 10.4 },
  north: { top: 9.4, merlon: 10.5 },
};
// Trapgevels: treden met de bovenkant 0,5 m boven het dak aan de binnenkant.
const STEP_OVER = 0.5;

// Brug over de slotgracht naar de Oosterdijk (BGT overbruggingsdeel): dek +2,2 m, gemetselde borstweringen op het noordelijke deel.
const BRIDGE = { u0: 7.4, u1: 11.15, v0: 35.9, v1: 50.8, deck: 2.2, gate: 44.1, rail: 3.1, pillar: 3.6 };

// Maaiveld op het kasteeleiland ten noorden van het kasteel (NAP +2,05 tot +2,1 m).
const GROUND_SAMPLES = [[4, 15], [-7, 24], [16, 17]];

// ---------- hulpfuncties voor dit kasteel ----------
const circle = ([cx, cy], r, n = 48) =>
  Array.from({ length: n }, (_, k) => [cx + r * Math.cos((2 * Math.PI * k) / n), cy + r * Math.sin((2 * Math.PI * k) / n)]);
const grow = ([u0, u1, v0, v1], d) => rect(u0 - d, u1 + d, v0 - d, v1 + d);
// Gevelstelsel: s langs de gevel, n naar buiten; de gevel ligt op u = f (along "v") of v = f (along "u").
const segFrame = (along, f, dir) => (s, n) => (along === "u" ? [s, f + dir * n] : [f + dir * n, s]);
// Borstwering op de gevel: 0,9 m muur, 0,25 m uitkragend op een kraag van 50 graden, met kantelen van mw breed.
const parapet = (along, f, dir, s0, s1, zTop, zMerlon, mw = 1.6, gap = 1.0) => {
  const P = segFrame(along, f, dir);
  const box = (a0, a1, n0, n1, z0, z1) => prism([P(a0, n0), P(a1, n0), P(a1, n1), P(a0, n1)], z0, z1);
  const zK = zTop - 1.0;
  const parts = [box(s0, s1, -0.9, 0, BASE, zTop)];
  parts.push(
    Manifold.hull(
      [[0, zK], [-0.1, zK], [0.25, zK + 0.3], [0.25, zTop], [-0.1, zTop]].flatMap(([n, z]) => [s0, s1].map((s) => [...P(s, n), z])),
    ),
  );
  const L = s1 - s0;
  const k = Math.floor((L - gap) / (mw + gap));
  const start = s0 + (L - (k * mw + (k - 1) * gap)) / 2;
  for (let i = 0; i < k; i++) {
    const a = start + i * (mw + gap);
    parts.push(box(a, a + mw, -0.65, 0.25, zTop - 0.01, zMerlon));
  }
  return Manifold.union(parts);
};
// Trapgevel: muur van t0 tot t1 dwars op de gevel, langs s van s0 tot s1, met de top op sr; f(s) is de dakhoogte
// (lokaal). Treden van w breed, een rest smaller dan 0,9 m gaat op in de laatste trede.
const stepGable = (along, s0, s1, sr, f, w, t0, t1, crown = 0.2) => {
  const box = (a0, a1, z) => prism(along === "u" ? rect(a0, a1, t0, t1) : rect(t0, t1, a0, a1), BASE, z);
  const parts = [box(Math.max(sr - w / 2, s0), Math.min(sr + w / 2, s1), f(sr) + STEP_OVER + crown)];
  for (let x = sr - w / 2; x > s0 + 1e-6; x -= w) {
    const lo = x - w - s0 < 0.9 ? s0 : x - w;
    parts.push(box(lo, x, f(x) + STEP_OVER));
    if (lo === s0) break;
  }
  for (let x = sr + w / 2; x < s1 - 1e-6; x += w) {
    const hi = s1 - (x + w) < 0.9 ? s1 : x + w;
    parts.push(box(x, hi, f(x) + STEP_OVER));
    if (hi === s1) break;
  }
  return Manifold.union(parts);
};
// Dakkapel met een eigen zadeldak (1,8 m breed, 58 graden): voorkant op 'front', loopt door tot 'back' in het dak.
const dormerV = (u, front, back, ridgeNap) => roofed(rect(u - 0.9, u + 0.9, Math.min(front, back), Math.max(front, back)), ridgeU(u, NAP(ridgeNap), 1.6));
const dormerU = (v, front, back, ridgeNap) => roofed(rect(Math.min(front, back), Math.max(front, back), v - 0.9, v + 0.9), ridgeV(v, NAP(ridgeNap), 1.6));

// Dakhoogte (lokaal) van het oostelijke deel van de oostvleugel langs v, voor de trapgevels.
const eastRoof = (v) =>
  v < EAST.ridgeV
    ? NAP(EAST.ridge) - EAST.t * (EAST.ridgeV - v)
    : Math.max(NAP(EAST.ridge) - EAST.t * (v - EAST.ridgeV), NAP(EAST.lower[2]) + EAST.lower[1] * v);
const westRoof = (u) => NAP(WEST.ridge) - WEST.t * Math.abs(u - WEST.ridgeU);

// ---------- kasteel ----------
const solids = [];

// Westvleugel met een schild aan de zuidkant tegen de ronde toren.
solids.push(
  roofed(rect(WEST.u0, WEST.u1, WEST.v0, WEST.v1), [
    ...ridgeU(WEST.ridgeU, NAP(WEST.ridge), WEST.t),
    [0, WEST_HIP.t, NAP(WEST_HIP.eave) - WEST_HIP.t * WEST_HIP.v],
  ]),
);
// Oostvleugel: het westelijke deel loopt met een kilgoot in het dak van de westvleugel.
solids.push(roofed(rect(MID.u0, MID.u1, MID.v0, MID.v1), ridgeV(MID.ridgeV, NAP(MID.ridge), MID.t)));
// Het oostelijke deel met de geknikte noordhelling over de lage noordaanbouw.
solids.push(roofed(rect(EAST.u0, EAST.u1, EAST.v0, EAST.v1), ridgeV(EAST.ridgeV, NAP(EAST.ridge), EAST.t)));
solids.push(roofed(rect(EAST.u0, 18.6, 0.3, EAST.v1), [[EAST.lower[0], EAST.lower[1], NAP(EAST.lower[2])]]));
// Hoekblok aan de noordoostkant.
solids.push(prism(rect(ANNEX.u0, ANNEX.u1, ANNEX.v0, ANNEX.v1), BASE, NAP(ANNEX.top)));

// Trapgevels: de noordgevel van de westvleugel (met de schoorsteen op de top), de oostgevel en de
// tussengevel tussen het lage en het hoge deel van de oostvleugel.
solids.push(stepGable("u", WEST.u0, WEST.u1, WEST.ridgeU, westRoof, 1.08, 12.0, WEST.v1));
solids.push(prism(rect(WEST.ridgeU - 0.5, WEST.ridgeU + 0.5, 12.0, WEST.v1), BASE, NAP(19.0)));
solids.push(stepGable("v", EAST.v0, ANNEX.v0, EAST.ridgeV, eastRoof, 0.944, 18.0, EAST.u1));
solids.push(stepGable("v", EAST.v0, EAST.v1, EAST.ridgeV, eastRoof, 0.944, EAST.u0, EAST.u0 + 0.9));

// Borstweringen met kantelen: westgevel, zuidgevel, noordgevel en de oostgevel van de westvleugel aan de binnenplaats.
solids.push(parapet("v", WEST.u0, -1, -2.4, NW_TOWER.v0 + 0.5, NAP(PARAPETS.west.top), NAP(PARAPETS.west.merlon)));
solids.push(parapet("u", MID.v0, -1, -6.4, S_TOWER.u0 + 0.5, NAP(PARAPETS.south.top), NAP(PARAPETS.south.merlon)));
solids.push(parapet("u", MID.v1, 1, WEST.u1 - 0.9, EAST.u0, NAP(PARAPETS.north.top), NAP(PARAPETS.north.merlon)));
solids.push(parapet("v", WEST.u1, 1, MID.v1, 12.0, NAP(PARAPETS.north.top), NAP(PARAPETS.north.merlon)));

// Noordwesttoren en zuidtoren: muren, een kraag onder de goot en een tentdak.
for (const T of [NW_TOWER, S_TOWER]) {
  const box = [T.u0, T.u1, T.v0, T.v1];
  const c = [(T.u0 + T.u1) / 2, (T.v0 + T.v1) / 2];
  solids.push(loft([[BASE, grow(box, 0)], [NAP(T.wall), grow(box, 0)], [NAP(T.wall) + 0.35, grow(box, 0.3)], [NAP(T.eave), grow(box, 0.3)], [NAP(T.apex), tip(c)]]));
}
// Ronde zuidwesttoren: muur, kraag, borstwering met kantelen en een achtkante spits.
{
  const { c } = ROUND;
  solids.push(loft([[BASE, circle(c, ROUND.r)], [NAP(ROUND.kraag), circle(c, ROUND.r)], [NAP(ROUND.kraag) + 0.35, circle(c, ROUND.rPar)], [NAP(ROUND.walk), circle(c, ROUND.rPar)]]));
  solids.push(loft([[NAP(ROUND.walk) - 0.01, oct(c, 2 * ROUND.spire)], [NAP(ROUND.apex), tip(c)]]));
  // Kantelen op de buitenkant van de ring (van de westgevel rond tot de zuidgevel), 1,4 m breed.
  for (let a = 115; a < 360; a += 30) {
    const pts = [];
    for (const [r, h] of [[ROUND.rPar - 0.9, 0.7], [ROUND.rPar - 0.03, 0.7]]) {
      const d = h / r;
      const t = (a * Math.PI) / 180;
      pts.push([c[0] + r * Math.cos(t - d), c[1] + r * Math.sin(t - d)], [c[0] + r * Math.cos(t + d), c[1] + r * Math.sin(t + d)]);
    }
    solids.push(prism([pts[0], pts[2], pts[3], pts[1]], NAP(ROUND.walk) - 0.01, NAP(ROUND.merlon)));
  }
}

// Schoorstenen: op de noordhelling van het oostelijke deel, aan de voet van de tussengevel, de schoorsteenlisene
// in de noordgevel, de schoorsteen met een kap naast de ronde toren en die op het noordoostelijke hoekblok.
solids.push(prism(sq([14.2, 0.5], 0.6), BASE, NAP(18.6)));
solids.push(prism(rect(9.0, 10.1, 2.4, 3.6), BASE, NAP(13.6)));
solids.push(prism(rect(4.4, 5.6, 2.6, 3.9), BASE, NAP(13.4)));
solids.push(pinnacle([-5.9, -6.4], 0.6, BASE, NAP(15.7) - BASE, 0.6));
solids.push(prism(rect(18.8, 20.0, 4.1, 5.3), BASE, NAP(13.4)));

// Dakkapellen: westvleugel (beide hellingen), oostvleugel (zuid- en noordhelling, het lage dak aan de noordkant).
for (const v of [-1.0, 8.6]) solids.push(dormerU(v, -9.6, -7.6, 12.0));
solids.push(dormerU(8.6, -1.6, -3.6, 12.0));
for (const u of [0.4, 4.6]) solids.push(dormerV(u, -4.7, -2.6, 12.6));
for (const u of [1.2, 7.2]) solids.push(dormerV(u, 1.4, -0.6, 12.4));
solids.push(dormerV(13.8, -5.0, -3.3, 14.2));
for (const u of [10.8, 16.4]) solids.push(dormerV(u, 4.0, 2.0, 9.8));

let castle = Manifold.union(solids);

// Vensternissen (spits, 0,4 m diep), de ingang aan de binnenplaats en de grote vensters van de Ridderzaal.
const cuts = [];
for (const u of [-3.5, -9.4]) cuts.push(niche([u, 0], 90, WEST.v1, 0, 1.5, 1.8, 5.2, 0.4));
for (const v of [5.6, 8.0, 10.4]) cuts.push(niche([0, v], 0, WEST.u1, 0, 1.4, 1.8, 5.0, 0.4));
cuts.push(niche([1.6, 0], 90, MID.v1, 0, 1.4, 0.8, 3.2, 0.4), niche([7.3, 0], 90, MID.v1, 0, 1.4, 1.8, 5.0, 0.4));
for (const u of [11.5, 15.8]) for (const z of [0.6, 2.6]) cuts.push(niche([u, 0], 90, EAST.v1, 0, 1.2, z, z + 1.2, 0.4));
cuts.push(niche([0, EAST.ridgeV], 0, EAST.u1, 0, 1.6, 2.5, 5.8, 0.4), niche([0, EAST.ridgeV], 0, EAST.u1, 0, 0.9, 8.2, 9.2, 0.4));
for (const u of [-3.0, 2.0, 15.0]) cuts.push(niche([u, 0], 270, -MID.v0, 0, 1.2, 3.5, 5.2, 0.4));
cuts.push(niche([0, 3.0], 180, -WEST.u0, 0, 1.2, 3.5, 5.2, 0.4));
for (const a of [200, 250]) cuts.push(niche(ROUND.c, a, ROUND.r, 0, 0.9, 3.0, 5.0, 0.4));
cuts.push(niche([-12.8, 12.1], 90, 2.2, 0, 0.9, 6.0, 7.6, 0.4), niche([-12.8, 12.1], 180, 2.4, 0, 0.9, 6.0, 7.6, 0.4));
cuts.push(niche([9.3, -8.5], 270, 2.5, 0, 0.9, 4.0, 5.6, 0.4), niche([9.3, -8.5], 0, 2.4, 0, 0.9, 4.0, 5.6, 0.4));
castle = castle.subtract(Manifold.union(cuts));

// ---------- brug ----------
const bridgeParts = [prism(rect(BRIDGE.u0, BRIDGE.u1, BRIDGE.v0, BRIDGE.v1), BASE, NAP(BRIDGE.deck))];
// Gemetselde borstweringen (0,9 m) op het noordelijke deel, poortpijlers in het midden en vleugelmuren op het eiland.
for (const [a, b] of [[BRIDGE.u0, BRIDGE.u0 + 0.9], [BRIDGE.u1 - 0.9, BRIDGE.u1]]) {
  bridgeParts.push(prism(rect(a, b, BRIDGE.gate, BRIDGE.v1), BASE, NAP(BRIDGE.rail)));
  bridgeParts.push(prism(rect(a - 0.05, b + 0.05, BRIDGE.gate - 0.5, BRIDGE.gate + 0.5), BASE, NAP(BRIDGE.pillar)));
}
bridgeParts.push(prism([[BRIDGE.u0, BRIDGE.v0], [BRIDGE.u0 + 0.9, BRIDGE.v0], [BRIDGE.u0 - 0.9, BRIDGE.v0 - 2.6], [BRIDGE.u0 - 1.8, BRIDGE.v0 - 2.6]], BASE, NAP(3.0)));
bridgeParts.push(prism([[BRIDGE.u1 - 0.9, BRIDGE.v0], [BRIDGE.u1, BRIDGE.v0], [BRIDGE.u1 + 1.8, BRIDGE.v0 - 2.6], [BRIDGE.u1 + 0.9, BRIDGE.v0 - 2.6]], BASE, NAP(3.0)));
let bridge = Manifold.union(bridgeParts);
// Drie bogen aan weerszijden van het gemetselde deel als spitse nissen boven het water.
const arches = [];
for (const v of [45.6, 47.7, 49.8]) {
  arches.push(niche([0, v], 0, BRIDGE.u1, 0, 1.6, NAP(-0.5), NAP(0.5), 0.4), niche([0, v], 180, -BRIDGE.u0, 0, 1.6, NAP(-0.5), NAP(0.5), 0.4));
}
bridge = bridge.subtract(Manifold.union(arches));

const nodes = [["building:kasteel", castle], ["road:brug", bridge]];
const all = Manifold.union([castle, bridge]);

const META = {
  name: "Kasteel Radboud",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 44.4,
  replacesBuildings: ["0420100000015201"],
  plate: true,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (136500, 531715), in de binnenhoek van het kasteel, op het maaiveld van het kasteeleiland (NAP +2,1 m), +X langs de nokken van de oostvleugel (26 graden linksom vanaf de RD-X-as) en +Y loodrecht daarop. Twee nodes: building:kasteel uit dakvlakken en bouwdelen (de westvleugel met de Ridderzaal, een trapgevel met schoorsteen aan de binnenplaats en een schild aan de zuidkant, de oostvleugel in twee delen met een tussengevel, een trapgevel aan de oostkant en een geknikte noordhelling over de lage aanbouw, gekanteelde borstweringen op een kraag aan de west-, zuid- en noordkant, de vierkante noordwesttoren en zuidtoren met tentdaken, de ronde zuidwesttoren met kantelen en een achtkante spits, schoorstenen, dakkapellen en vensternissen) en road:brug, de brug over de slotgracht naar de Oosterdijk met borstweringen, poortpijlers en spitse nissen voor de bogen. Onderkant 1 m onder het water van de slotgracht; alle vlakken wijzen omhoog of staan verticaal op de nissen en kragen na. Vervangt de PDOK-reconstructie van het kasteel. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    westRidgeNapM: WEST.ridge,
    eastRidgeNapM: EAST.ridge,
    midRidgeNapM: MID.ridge,
    roundTowerApexNapM: ROUND.apex,
    groundNapM: GROUND_NAP,
    baseNapM: -1.0,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Kasteel_Radboud",
    "PDOK BAG pand 0420100000015201 (het kasteel), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: dakvlakken, nokken, torens, borstweringen, schoorstenen en het maaiveld",
    "PDOK BGT overbruggingsdeel: de brug over de slotgracht",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's vanaf de noord-, noordoost-, oost-, zuid- en westkant",
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

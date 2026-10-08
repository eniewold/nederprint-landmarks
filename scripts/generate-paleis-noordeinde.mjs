// Genereert een gesloten 3D-model van Paleis Noordeinde in Den Haag (werkpaleis
// van de koning; het hoofdgebouw van Jacob van Campen uit 1640, uitgebreid in
// 1814-1817) uit dakvlakken en bouwdelen: het hoofdgebouw aan het voorplein met
// een groot schilddak (nok NAP +23,3 m, 55 graden, schilden van 59 graden), een
// fronton over de middelste drie traveeën, pilasters, vensternissen, het portiek
// met balkon en twee schoorstenen; de twee vleugels om het voorplein met lage
// zadeldaken, arcadebogen en een fronton aan de kop op het Noordeinde (rechts met
// een breder deel met plat dak en een schilddakje); daarachter het platte dak,
// het middenblok met een afgeknot schilddak (plat vlak NAP +25,75 m) en twee
// schoorstenen; de achterbouw van vier bouwlagen met kroonlijst, afgeknotte
// schilddaken (42,6 graden, plat bovenvlak NAP +22,45 m), de middenrisaliet aan
// de binnenplaats met reuzenpilasters en attiek, de achtervleugels, de aanbouwen
// langs de binnenplaats en de tuinpaviljoens; los daarvan de zes pijlers van het
// hek langs het Noordeinde. Elk dak is een vlak z = a u + b v + c of een
// afgeknotte piramide uit de AHN-vlakken en de LoD2.2-vlakken van de 3D BAG. Het
// Mapbox-model is niet gebruikt. Alle maten in het script zijn meters op ware
// grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-paleis-noordeinde.mjs              # 1:1000 (standaard)
//   node scripts/generate-paleis-noordeinde.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (80913,2, 455283,4), het zwaartepunt van het
// BAG-pand, midden in het paleis achter het hoofdgebouw, op het maaiveld van de
// binnenplaats aan de tuinzijde (NAP +1,5 m), Z omhoog. +X loopt langs de
// voorgevel naar het zuidoosten (-54,36 graden vanaf de RD-X-as, de richting van
// de BAG-gevels en de nokken van de achtervleugels; evenwijdig aan het
// Noordeinde) en +Y loodrecht daarop naar het Noordeinde. Het voorplein ligt op
// NAP +2,4 m, de tuin ten westen van de linker achtervleugel op NAP +0,5 m:
// daarom begint het model op NAP 0 m.
//
// Bronnen: PDOK BAG-panden 0518100000279145 (het paleis) en 0518100001640004
// (het rechter tuinpaviljoen); AHN DSM/DTM 0,5 m (PDOK WCS) voor de dakvlakken,
// nokken, kroonlijsten, schoorstenen, het portiek, de hekpijlers en het
// maaiveld; 3D BAG LoD2.2 (api.3dbag.nl); Wikipedia; PDOK luchtfoto; foto's op
// Wikimedia Commons van het voorplein (vanaf het Noordeinde en schuin vanuit de
// noordhoek) en van de binnenplaats aan de tuinzijde. Geschat zijn de pilasters,
// vensternissen en arcadebogen (ritme van 3,3 m van de foto's en de BAG-gevel),
// de reuzenpilasters en de velden van de attiek, de doorgangen van het portiek,
// de frontons aan de koppen van de vleugels en de vorm van de hekpijlers.
// Weggelaten: het ruiterstandbeeld van Willem van Oranje (staat op de straat,
// niet bij het paleis), de hekken en de poort met de kroon tussen de pijlers en
// de vazen op de pijlers en balustrades (dunner dan 0,9 m), de schilderhuisjes
// (los straatmeubilair van circa 1 m), de vlaggenmast, de luiken en de
// antennes en dakramen op de platte daken; de Koninklijke Stallen, de Koepel van
// Fagel en de overige bijgebouwen zijn eigen panden en blijven PDOK.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "paleis-noordeinde");
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

const SLUG = "paleis-noordeinde";

// ---------- maten (lokaal stelsel; hoogtes hieronder in NAP, z = NAP - 1,5 m) ----------
const GROUND_NAP = 1.5; // binnenplaats aan de tuinzijde
const Z = (nap) => nap - GROUND_NAP;
const ORIGIN = [80913.2, 455283.4];
const X_AXIS = [0.58269, -0.812694]; // RD-richting -54,36 graden, langs de voorgevel (evenwijdig aan het Noordeinde)
// De tuin ten westen van de linker achtervleugel ligt op NAP +0,5 m: de onderkant op NAP 0.
const BASE = -1.5;

// Achterbouw (vier bouwlagen): kroonlijst NAP +19,45 m, afgeknotte schilddaken onder 42,6 graden
// (AHN: 41 tot 44 graden) met een plat bovenvlak op NAP +22,45 m.
const REAR = { cornice: 19.45, top: 22.45, t: 0.92, out: 0.5 };
// Voorbouw en vleugels om het voorplein (twee bouwlagen): kroonlijst NAP +14,8 m.
const FRONT = { cornice: 14.8, out: 0.7 };
// Schilddak van het hoofdgebouw aan het voorplein: nok NAP +23,3 m op v = 20,95, 55 graden voor en
// achter, 59 graden op de schilden; nok van u -18,75 tot 17,85 (AHN-vlakken, rms 0,03 tot 0,09 m).
const MAIN_ROOF = { eave: [-23.8, 22.9, 15.0, 26.9], tSide: 1.68, tFront: 1.43 };
// Middenblok achter het platte dak: afgeknot schilddak tot een plat vlak op NAP +25,75 m.
const MIDDLE = { base: [-14.6, 14.6, -0.55, 12.8], top: 25.75, t: 1.325, tRight: 1.317, left: { u: -11.0, z: 22.5, t: 2.7 } };
// Voorgevel tussen de vleugels (v = 26,2), negen traveeën van 3,3 m rond de as u = -1,0.
const FACADE = { v: 26.2, u0: -16.7, u1: 13.9, axis: -1.0, bay: 3.3, pilaster: 0.7, proud: 0.3 };
// Fronton over de middelste drie traveeën: basis op de kroonlijst, top NAP +16,9 m.
const FRONTON = { u0: -5.95, u1: 3.95, peak: 16.9 };
// Portiek met balkon voor de middelste drie traveeën: dek NAP +7,5 m, balustrade tot +8,6 m.
const PORTICO = { u0: -5.9, u1: 3.9, v1: 30.9, deck: 7.5, rail: 8.6 };
// Vleugels om het voorplein: lage zadeldaken (20 tot 21 graden) langs v.
const WING_L = { u0: -25.0, u1: -16.7, v0: 17.0, v1: 52.0, ridgeU: -20.85, ridge: 16.43 };
const WING_A = { u0: 13.9, u1: 22.2, v0: 26.0, v1: 49.5, ridgeU: 18.05, ridge: 16.5 };
// Rechts naast vleugel A: plat deel (NAP +16,7 m) en een blok met een schilddak (goot 15,0, nok 16,85).
const WING_B = { u0: 22.2, u1: 31.7, u1Hip: 30.6, v0: 18.25, vFlat: 32.5, v1: 47.4, flat: 16.7, eave: 15.0, t: 0.42 };
// Pijlers van het hek langs het Noordeinde (AHN: zes verhogingen van 1,2 m op 4,3 tot 4,7 m afstand).
const PIERS = [[-12.3, 51.1], [-7.75, 50.9], [-3.5, 50.5], [0.75, 50.0], [5.25, 49.7], [9.9, 49.4]];
const FORECOURT_NAP = 2.4;

// Maaiveld (AHN NAP +1,5 m, PDOK 44,9 tot 45,0 m) op de binnenplaats aan de tuinzijde.
const GROUND_SAMPLES = [[0, -30], [-8, -25], [8, -40]];

// ---------- hulpvormen ----------
const box = (u0, u1, v0, v1, z0, z1) => Manifold.cube([u1 - u0, v1 - v0, z1 - z0]).translate([u0, v0, z0]);
const rectPts = ([u0, u1, v0, v1], z) => [[u0, v0, z], [u1, v0, z], [u1, v1, z], [u0, v1, z]];
// Rechthoek [u0, u1, v0, v1] die alleen aan de gekozen zijden (w, e, s, n) d groter wordt.
const grow = ([u0, u1, v0, v1], sides, d) => [
  sides.includes("w") ? u0 - d : u0,
  sides.includes("e") ? u1 + d : u1,
  sides.includes("s") ? v0 - d : v0,
  sides.includes("n") ? v1 + d : v1,
];
// Bouwdeel: muren tot de kroonlijst, met een kroonlijst die aan de gekozen zijden onder 53 graden
// uitkraagt (van de muur op zc - 0,8 m naar 'out' buiten de muur op zc).
const block = (r, zc, sides, out, zBottom = BASE) => {
  const k = Math.max(0.8, out * 1.2);
  const wall = box(...r, zBottom, zc - k + 0.01);
  if (!sides) return box(...r, zBottom, zc + 0.02);
  const g = grow(r, sides, out);
  return Manifold.union([wall, Manifold.hull([...rectPts(r, zc - k), ...rectPts(g, zc), ...rectPts(g, zc + 0.02)])]);
};
// Afgeknot schilddak: van de goot (rechthoek r op zEave) onder helling t naar een plat vlak op zTop.
const truncHip = (r, zEave, zTop, t) => {
  const d = (zTop - zEave) / t;
  const top = [r[0] + d, r[1] - d, r[2] + d, r[3] - d];
  if (top[0] > top[1]) top[0] = top[1] = (r[0] + r[1]) / 2;
  if (top[2] > top[3]) top[2] = top[3] = (r[2] + r[3]) / 2;
  return Manifold.hull([...rectPts(r, zEave), ...rectPts(top, zTop)]);
};
// Dak boven een rechthoek uit vlakken z = a u + b v + c, vanaf z0 (het laagste vlak telt).
const roofOn = (r, planes, z0, zMax = 60) => planes.reduce((s, p) => cutBelow(s, p), box(...r, z0, zMax));
// Vlak dat vanaf de gootlijn op zijde side van rechthoek r onder helling t naar binnen stijgt.
const slopeFrom = (r, side, zE, t) => {
  const [u0, u1, v0, v1] = r;
  if (side === "w") return [t, 0, zE - t * u0];
  if (side === "e") return [-t, 0, zE + t * u1];
  if (side === "s") return [0, t, zE - t * v0];
  return [0, -t, zE + t * v1];
};
// Nis in een gevel: p ligt op het gevelvlak, n is de normaal naar buiten (eenheidsvector); breedte w,
// van z0 tot z1 en dan een spitse bovenkant (helling k, 1,4 = 54 graden), diepte d achter de gevel.
const facadeNiche = ([px, py], [nx, ny], w, z0, z1, d, k = 1.4) => {
  const [tx, ty] = [-ny, nx];
  const prof = [[-w / 2, z0], [w / 2, z0], [w / 2, z1], [0, z1 + (w / 2) * k], [-w / 2, z1]];
  const pts = [];
  for (const dd of [-d, 0.6]) for (const [s, z] of prof) pts.push([px + tx * s + nx * dd, py + ty * s + ny * dd, z]);
  return Manifold.hull(pts);
};
// Rij nissen langs een gevel van a naar b (punten op het gevelvlak) met normaal n: per travee van
// ongeveer 'bay' meter één nis per bouwlaag; skip(k, row) laat een nis weg.
const NICHES = { count: 0 };
const nicheRows = (a, b, n, bay, w, rows, d, skip = () => false, k = 1.4) => {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const bays = Math.max(1, Math.round(len / bay));
  const out = [];
  for (let i = 0; i < bays; i++) {
    const f = (i + 0.5) / bays;
    const p = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
    rows.forEach(([z0, z1], row) => {
      if (skip(p, row)) return;
      out.push(facadeNiche(p, n, w, z0, z1, d, k));
      NICHES.count++;
    });
  }
  return out;
};
const N_ = { w: [-1, 0], e: [1, 0], s: [0, -1], n: [0, 1] };

const solids = [];
const cutters = [];

// ---------- achterbouw: vier bouwlagen met kroonlijst ----------
const RC = Z(REAR.cornice);
const rearBlocks = [
  // linker tuinpaviljoen, linker achtervleugel en de aanbouw langs de binnenplaats
  [[-50.5, -18.9, -50.9, -36.7], "wsen"],
  [[-29.5, -18.9, -50.9, 0.2], "we"],
  [[-18.9, -14.6, -38.2, -20.8], "sen"],
  // dwarsvleugel met de achtergevel aan de binnenplaats en het linkerdeel tot v = 11
  [[-19.5, 24.4, -9.1, 6.5], "s"],
  [[-32.6, -19.5, 0.2, 11.0], "wsn"],
  // het platte deel achter het voorste schilddak en de rechter achtervleugel
  [[-19.5, 25.9, 6.5, 18.25], "e"],
  [[24.4, 37.0, -50.9, 6.5], "wesn"],
  [[20.4, 24.4, -38.2, -20.9], "wsn"],
  // middenrisaliet aan de binnenplaats (plat dak op NAP +19,5 m) en het rechter tuinpaviljoen
  [[-5.8, 11.6, -17.2, -9.1], "wse"],
  [[37.0, 55.7, -50.9, -39.8], "esn"],
];
for (const [r, sides] of rearBlocks) solids.push(block(r, RC, sides, REAR.out));
// Afgeknotte schilddaken op de achterbouw (gootlijnen uit de AHN-vlakken).
const rearRoofs = [
  [-50.4, -20.0, -51.4, -37.2], // linker tuinpaviljoen
  [-29.3, -20.0, -51.4, -8.1], // linker achtervleugel
  [-29.3, 9.0, -8.1, 10.5], // dwarsvleugel, linkerdeel
  [-32.4, -20.0, 0.6, 10.5], // kop van de dwarsvleugel aan de tuinzijde
  [5.0, 36.0, -8.1, 0.14], // dwarsvleugel, rechterdeel
  [24.6, 36.0, -51.4, -8.1], // rechter achtervleugel
];
for (const r of rearRoofs) solids.push(truncHip(r, RC, Z(REAR.top), REAR.t));
// Rechter tuinpaviljoen: zuidelijke helft met een zadeldak langs u (nok NAP +22,4 m op v = -47,6).
solids.push(truncHip([24.6, 55.4, -51.4, -43.9], RC, Z(22.4), 0.81));
// Middenblok: afgeknot schilddak van 53 graden (links 70 graden) tot het platte vlak op NAP +25,75 m.
{
  const M = MIDDLE;
  const r = M.base;
  solids.push(
    roofOn(r, [
      slopeFrom(r, "n", RC, M.t),
      slopeFrom(r, "s", RC, M.t),
      slopeFrom(r, "e", RC, M.tRight),
      [M.left.t, 0, Z(M.left.z) - M.left.t * M.left.u],
    ], RC, Z(M.top)),
  );
}
// Attiek met balustrade op de middenrisaliet aan de binnenplaats (NAP +22,0 m) en de zijstukken.
solids.push(box(-5.6, 11.4, -17.0, -13.4, RC - 0.5, Z(22.0)));
solids.push(box(-5.6, -4.6, -13.5, -9.6, RC - 0.5, Z(21.7)), box(10.4, 11.4, -13.5, -9.6, RC - 0.5, Z(21.7)));
for (const u0 of [-3.6, 1.0, 5.6]) cutters.push(profileX([[-17.4, Z(20.3)], [-16.7, Z(20.3)], [-16.7, Z(21.6) - 0.8], [-17.4, Z(21.6) + 0.1]], u0, u0 + 3.4));
// Reuzenpilasters op de middenrisaliet (vier, 1,2 m breed, 0,4 m voor de gevel).
for (const u of [-5.2, 0.5, 5.3, 11.0]) solids.push(box(u - 0.6, u + 0.6, -17.6, -17.1, BASE, RC - 0.85));
// Lage delen naast de rechter achtervleugel: strook op NAP +14,4 m, aanbouw op +8,8 en +7,5 m,
// de lichthof op +3,2 m en een erker op +14,3 m aan de tuinzijde van het linkerdeel.
solids.push(box(25.9, 33.0, 6.4, 8.8, BASE, Z(14.4)));
solids.push(box(36.9, 44.4, -0.5, 5.5, BASE, Z(8.8)));
solids.push(box(33.0, 44.4, 5.4, 8.8, BASE, Z(7.5)));
solids.push(box(25.8, 31.7, 8.7, 18.5, BASE, Z(3.2)));
solids.push(box(-33.6, -32.5, 1.0, 10.4, BASE, Z(14.3)));

// ---------- voorbouw en vleugels om het voorplein: twee bouwlagen ----------
const FC = Z(FRONT.cornice);
// Hoofdgebouw: muren tot de kroonlijst, alleen aan de voorplein-zijde een uitkragende kroonlijst.
solids.push(block([-25.0, 22.9, 15.0, FACADE.v], FC, "n", FRONT.out));
// Schilddak van het hoofdgebouw.
{
  const r = MAIN_ROOF.eave;
  solids.push(
    roofOn(r, [
      slopeFrom(r, "w", FC, MAIN_ROOF.tSide),
      slopeFrom(r, "e", FC, MAIN_ROOF.tSide),
      slopeFrom(r, "s", FC, MAIN_ROOF.tFront),
      slopeFrom(r, "n", FC, MAIN_ROOF.tFront),
    ], FC),
  );
}
// Fronton over de middelste drie traveeën.
{
  const F = FRONTON;
  const mid = (F.u0 + F.u1) / 2;
  solids.push(
    Manifold.hull([
      [F.u0, 22.0, FC], [F.u1, 22.0, FC], [F.u0, 26.9, FC], [F.u1, 26.9, FC],
      [mid, 22.0, Z(F.peak)], [mid, 26.9, Z(F.peak)],
    ]),
  );
}
// Pilasters op de voorgevel (0,7 m breed, 0,3 m voor de gevel) tussen de traveeën.
const facadeBays = [];
for (let k = -4; k <= 4; k++) facadeBays.push(FACADE.axis + k * FACADE.bay);
for (let k = -4; k <= 5; k++) {
  const u = FACADE.axis + (k - 0.5) * FACADE.bay;
  if (u < FACADE.u0 + 0.3 || u > FACADE.u1 - 0.3) continue;
  solids.push(box(u - FACADE.pilaster / 2, u + FACADE.pilaster / 2, FACADE.v - 0.1, FACADE.v + FACADE.proud, BASE, FC - 0.8));
}
// Portiek met balkon: dicht blok met drie spitse doorgangen aan de voorkant en een balustrade.
{
  const P = PORTICO;
  solids.push(box(P.u0, P.u1, FACADE.v - 0.1, P.v1, BASE, Z(P.deck)));
  const ring = Manifold.difference(box(P.u0, P.u1, FACADE.v - 0.1, P.v1, Z(P.deck) - 0.01, Z(P.rail)), box(P.u0 + 0.9, P.u1 - 0.9, FACADE.v - 1, P.v1 - 0.9, Z(P.deck), Z(P.rail) + 1));
  solids.push(ring);
  const w = (P.u1 - P.u0 - 4 * 1.0) / 3;
  for (let i = 0; i < 3; i++) {
    const uc = P.u0 + 1.0 + w / 2 + i * (w + 1.0);
    cutters.push(facadeNiche([uc, P.v1], N_.n, w, Z(FORECOURT_NAP) + 0.2, Z(FORECOURT_NAP) + 3.3, 1.2, 1.5));
  }
  for (const [u, n] of [[P.u0, N_.w], [P.u1, N_.e]]) cutters.push(facadeNiche([u, (FACADE.v + P.v1) / 2 + 0.3], n, 2.0, Z(FORECOURT_NAP) + 0.2, Z(FORECOURT_NAP) + 3.0, 0.8, 1.5));
}

// Linkervleugel: zadeldak langs v met een fronton aan de kop op het Noordeinde.
const wingRoof = (W, [e0, e1]) => {
  const r = [W.u0 - e0, W.u1 + e1, W.v0, W.v1 + 0.5];
  const t = (Z(W.ridge) - FC) / (W.ridgeU - r[0]);
  const t2 = (Z(W.ridge) - FC) / (r[1] - W.ridgeU);
  return roofOn(r, [[t, 0, FC - t * r[0]], [-t2, 0, FC + t2 * r[1]]], FC);
};
const headPediment = (W, zPeak, [e0, e1]) => {
  const eaveOut = 0.5;
  const r0 = W.u0 - e0;
  const r1 = W.u1 + e1;
  return Manifold.hull([
    [r0, W.v1 - 1.2, FC], [r1, W.v1 - 1.2, FC], [r0, W.v1 + eaveOut, FC], [r1, W.v1 + eaveOut, FC],
    [W.ridgeU, W.v1 - 1.2, Z(zPeak)], [W.ridgeU, W.v1 + eaveOut, Z(zPeak)],
  ]);
};
solids.push(block([WING_L.u0, WING_L.u1, WING_L.v0, WING_L.v1], FC, "en", 0.5));
solids.push(wingRoof(WING_L, [0, 0.5]), headPediment(WING_L, 16.9, [0, 0.5]));
// Platte delen achter de linkervleugel (NAP +15,0 en +13,0 m).
solids.push(box(-25.0, -19.5, 11.0, 17.5, BASE, Z(15.0)));
solids.push(box(-28.0, -24.9, 11.0, 16.7, BASE, Z(13.0)));
// Vleugel A rechts van het voorplein, gespiegeld aan de linkervleugel.
solids.push(block([WING_A.u0, WING_A.u1, WING_A.v0, WING_A.v1], FC, "wn", 0.5));
solids.push(wingRoof(WING_A, [0.5, 0]), headPediment(WING_A, 17.1, [0.5, 0]));
// Deel B: plat tot v = 32,5 en een blok met een schilddak tot de kop op v = 47,4.
{
  const B = WING_B;
  solids.push(box(B.u0, B.u1, B.v0, B.vFlat, BASE, Z(B.flat)));
  solids.push(block([B.u0, B.u1Hip, B.vFlat - 0.5, B.v1], Z(B.eave), "n", 0.4));
  const r = [B.u0, B.u1Hip, B.vFlat, B.v1 + 0.4];
  solids.push(roofOn(r, ["w", "e", "s", "n"].map((s) => slopeFrom(r, s, Z(B.eave), B.t)), Z(B.eave)));
}

// ---------- schoorstenen en installaties ----------
const chimney = ([u, v], [w, d], top, z0) => box(u - w / 2, u + w / 2, v - d / 2, v + d / 2, z0, Z(top));
solids.push(chimney([-16.7, 21.0], [1.4, 1.8], 26.2, FC), chimney([15.3, 21.3], [1.4, 1.8], 26.0, FC));
solids.push(chimney([10.8, 5.8], [1.6, 2.4], 29.3, RC - 0.5), chimney([-9.0, 6.0], [1.4, 1.4], 28.6, RC - 0.5));
for (const p of [[-24.7, -8.0], [31.7, -8.0], [-41.8, -41.3], [-41.8, -46.3], [-27.8, -46.0], [32.0, -36.8], [32.0, -43.8], [36.7, -46.7], [44.5, -46.7]]) {
  solids.push(chimney(p, [1.0, 1.2], 23.9, RC - 0.5));
}
// Opbouw met schilddakje op het platte dak (NAP +24,4 m) en de luchtbehandelingskasten (+21,2 m).
{
  const r = [10.2, 15.8, 12.2, 15.8];
  solids.push(box(...r, RC - 0.5, Z(22.8) + 0.02));
  solids.push(roofOn(r, ["w", "e", "s", "n"].map((s) => slopeFrom(r, s, Z(22.8), 0.9)), Z(22.8), Z(24.4)));
  solids.push(box(2.6, 8.4, 13.6, 15.4, RC - 0.5, Z(21.2)));
}

// ---------- hekpijlers langs het Noordeinde ----------
const piers = Manifold.union(
  PIERS.map(([u, v]) =>
    Manifold.union([
      box(u - 0.6, u + 0.6, v - 0.6, v + 0.6, BASE, Z(FORECOURT_NAP) + 3.4),
      loft([[Z(FORECOURT_NAP) + 3.39, sq([u, v], 0.45)], [Z(FORECOURT_NAP) + 4.3, sq([u, v], 0.45)], [Z(FORECOURT_NAP) + 4.8, tip([u, v])]]),
    ]),
  ),
);

// ---------- gevelreliëf: vensternissen en arcadebogen ----------
// Achterbouw: vier bouwlagen, vensters 1,2 m breed, 0,35 m diep, met een spitse bovenkant.
const rearRows = [[1.0, 3.4], [5.4, 7.8], [9.6, 12.0], [13.6, 15.6]];
const R = (a, b, n, skip) => cutters.push(...nicheRows(a, b, n, 3.3, 1.2, rearRows, 0.35, skip));
R([-29.5, -36.2], [-29.5, -0.3], N_.w); // linker achtervleugel, tuinzijde
R([-50.5, -50.4], [-50.5, -37.2], N_.w); // linker paviljoen, west
R([-50.0, -50.9], [-19.4, -50.9], N_.s); // linker paviljoen, zuid
R([-50.0, -36.7], [-30.0, -36.7], N_.n); // linker paviljoen, noord
R([-18.9, -50.4], [-18.9, -38.7], N_.e); // linker paviljoen, binnenplaats
R([-18.9, -20.3], [-18.9, -9.6], N_.e); // linker achtervleugel, binnenplaats
R([-14.6, -37.7], [-14.6, -21.3], N_.e); // aanbouw links
R([-18.4, -9.1], [-6.3, -9.1], N_.s); // achtergevel links van de risaliet
R([12.1, -9.1], [23.9, -9.1], N_.s); // achtergevel rechts van de risaliet
R([24.4, -20.4], [24.4, -9.6], N_.w); // rechter achtervleugel, binnenplaats
R([24.4, -50.4], [24.4, -38.7], N_.w);
R([20.4, -37.7], [20.4, -21.4], N_.w); // aanbouw rechts
R([37.0, -39.3], [37.0, -1.0], N_.e); // rechter achtervleugel, buitenzijde
R([24.9, -50.9], [55.2, -50.9], N_.s); // rechter paviljoen, zuid
R([-32.6, 0.7], [-32.6, 10.5], N_.w, (p, row) => row < 3); // kop van de dwarsvleugel, boven de erker
// Middenrisaliet aan de binnenplaats: drie traveeën tussen de reuzenpilasters.
for (const u of [-2.35, 2.9, 8.15]) for (const [z0, z1] of rearRows) cutters.push(facadeNiche([u, -17.2], N_.s, 1.4, z0, z1, 0.35));
// Voorgevel van het hoofdgebouw: twee bouwlagen, achter het portiek geen vensters beneden.
const zF = Z(FORECOURT_NAP);
const frontRows = [[zF + 1.0, zF + 4.4], [zF + 6.3, zF + 9.2]];
for (const u of facadeBays) {
  frontRows.forEach(([z0, z1], row) => {
    if (row === 0 && u > PORTICO.u0 && u < PORTICO.u1) return;
    cutters.push(facadeNiche([u, FACADE.v], N_.n, 1.6, z0, z1, 0.35));
  });
}
// Vleugels aan het voorplein: arcadebogen beneden (0,6 m diep, spits van 60 graden), vensters boven.
const arcade = (a, b, n) => {
  cutters.push(...nicheRows(a, b, n, 3.3, 2.0, [[zF + 0.1, zF + 3.4]], 0.6, () => false, 1.75));
  cutters.push(...nicheRows(a, b, n, 3.3, 1.4, [[zF + 6.0, zF + 9.0]], 0.35));
};
arcade([WING_L.u1, 27.0], [WING_L.u1, 51.5], N_.e);
arcade([WING_A.u0, 27.0], [WING_A.u0, 49.0], N_.w);
// Koppen van de vleugels aan het Noordeinde.
const twoRows = [[zF + 1.0, zF + 4.4], [zF + 6.0, zF + 9.2]];
cutters.push(...nicheRows([WING_L.u0 + 0.5, WING_L.v1], [WING_L.u1 - 0.5, WING_L.v1], N_.n, 3.6, 1.5, twoRows, 0.35));
cutters.push(...nicheRows([WING_A.u0 + 0.5, WING_A.v1], [WING_A.u1 - 0.5, WING_A.v1], N_.n, 3.6, 1.5, twoRows, 0.35));
cutters.push(...nicheRows([WING_B.u0 + 0.5, WING_B.v1], [WING_B.u1Hip - 0.5, WING_B.v1], N_.n, 3.3, 1.4, twoRows, 0.35));

let palace = Manifold.union(solids).subtract(Manifold.union(cutters));
console.log(`gevelreliëf: ${cutters.length} uitsparingen`);

const nodes = [["building:paleis", palace], ["building:hekpijlers", piers]];
const all = Manifold.union([palace, piers]);

const META = {
  name: "Paleis Noordeinde",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 44.9,
  replacesBuildings: ["0518100000279145", "0518100001640004"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (80913,2, 455283,4), midden in het paleis achter het hoofdgebouw, op het maaiveld van de binnenplaats aan de tuinzijde (NAP +1,5 m), +X langs de voorgevel naar het zuidoosten (-54,36 graden vanaf de RD-X-as, evenwijdig aan het Noordeinde) en +Y loodrecht daarop naar het Noordeinde. Node building:paleis uit dakvlakken en bouwdelen: het hoofdgebouw aan het voorplein met het schilddak (nok NAP +23,3 m), fronton, pilasters, portiek met balkon en schoorstenen; de twee vleugels om het voorplein met lage zadeldaken, arcadebogen en frontons aan de koppen; daarachter het platte dak en het middenblok met een afgeknot schilddak (NAP +25,75 m); de achterbouw van vier bouwlagen met kroonlijst en afgeknotte schilddaken (NAP +22,45 m), de middenrisaliet met reuzenpilasters en attiek, de achtervleugels en tuinpaviljoens. Node building:hekpijlers: de zes pijlers van het hek langs het Noordeinde. Onderkant op NAP 0 m, 1,5 m onder de binnenplaats; alle vlakken wijzen omhoog, staan verticaal of hangen niet vlakker dan 53 graden. Vervangt de PDOK-reconstructie van het paleis en het rechter tuinpaviljoen. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    mainRidgeNapM: 23.3,
    middleTopNapM: MIDDLE.top,
    rearCorniceNapM: REAR.cornice,
    frontCorniceNapM: FRONT.cornice,
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Paleis_Noordeinde",
    "PDOK BAG panden 0518100000279145 (het paleis) en 0518100001640004 (het rechter tuinpaviljoen), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: dakvlakken, nokken, kroonlijsten, schoorstenen, hekpijlers en maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en hoogtes van de dakvlakken",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons: foto's van het voorplein, de voorgevel en de binnenplaats aan de tuinzijde",
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

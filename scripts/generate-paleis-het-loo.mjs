// Genereert een gesloten 3D-model van Paleis Het Loo in Apeldoorn (Jacobus Roman en
// Daniël Marot, 1684-1694, verbouwd 1911-1914 en 2018-2023) uit dakvlakken en
// bouwdelen: het vierkante hoofdgebouw (corps de logis) met het schilddak tot het
// platte dak met balustrade, de dakopbouw en zes schoorstenen, de middenrisalieten
// met driehoekige frontons aan voorplein en tuin, dakkapellen en een bordes met
// treden; aan weerszijden een binnenpaviljoen (schilddak met plat bovenvlak en
// doorlopende dakkapellen) en een buitenpaviljoen (schilddak met nok, gebogen
// frontons aan voorplein en tuin); de twee zijvleugels om het voorplein met
// schilddaken, negen dakkapellen naar het voorplein, schoorstenen en een kopse
// paviljoen met tentdak aan de straat; en het oostelijke complex rond een binnenhof
// (vleugels met schilddaken en dakkapellen, twee hoekpaviljoens met tentdaken, een
// middenvleugel met topgevels en een lage verbinding met installaties); en de lage
// vleugel langs de straat ten westen van de westvleugel (zadeldak met schilden, zes
// dakkapellen naar de straat, schoorstenen, een paviljoen met tentdak en een laag
// entreegebouw aan het westeinde). Gevels met
// een kroonlijst en vensternissen. Alle maten in het script zijn meters op ware
// grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-paleis-het-loo.mjs              # 1:1000 (standaard)
//   node scripts/generate-paleis-het-loo.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (193174,6, 471890,07), op de symmetrieas midden op
// het voorplein, op het maaiveld van het voorplein (NAP +17,7 m), Z omhoog. +X loopt
// langs de gevels naar het oosten (0,9 graden linksom vanaf de RD-X-as, gemeten aan
// de nokken en goten) en +Y naar het noorden, naar de tuin; het hoofdgebouw staat op
// v 37 tot 62,5 m, de vleugels op u -42,4 tot -33,4 en 33,4 tot 42,4 m. Het complex
// is symmetrisch in u = 0, op het oostelijke complex na.
//
// Bronnen: PDOK BAG-panden 0200100000085665 (paleis, vleugels, oostelijk complex en
// de ondergrondse uitbreiding onder het voorplein), 0200100000800424 en
// 0200100000800425 (de lage vleugel langs de straat); AHN DSM/DTM 0,5 m (PDOK WCS, ook
// op 0,25 m) voor goten, nokken, platte daken, schoorstenen, dakkapellen en het
// maaiveld; 3D BAG LoD2.2 (api.3dbag.nl) voor de hellingen en de contouren van de
// paviljoens (de 3D BAG toont nog de tijdelijke overkapping van de verbouwing achter
// het hoofdgebouw; die is genegeerd); Wikipedia; PDOK luchtfoto; foto's op Wikimedia
// Commons van het voorplein, de tuinzijde en de vleugels. Het Mapbox-model is niet
// gebruikt. Geschat zijn de kroonlijsten, de vensternissen (ritme van de foto's),
// de vorm van de gebogen frontons (pijl 2 m), de hoogte van de dakkapellen van de
// vleugels en het oostelijke complex en de schoorsteenhoogtes (het AHN vlakt ze af).
// Weggelaten: de glazen daken van de ondergrondse uitbreiding (liggen gelijk met het
// voorplein, met water erop), het hek met de pijlers aan het voorplein en de
// lantaarns (dunner dan 0,9 m), de colonnades (staan in de tuin, niet aan het
// paleis), de vlaggenmast, de balusters (als dichte borstwering) en het lage aanbouwtje
// ten noorden van de verbinding (geen deel van het BAG-pand), de windvaan op de
// schoorsteen van het westpaviljoen en de lichtkoepels op het entreegebouw. De tuinen
// blijven PDOK. De buitengevels van de vleugels om het voorplein hebben lisenen en
// een rij kleine vensters (foto van de westgevel).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "paleis-het-loo");
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

const SLUG = "paleis-het-loo";

// ---------- maten (lokaal stelsel, z = hoogte boven het voorplein op NAP +17,7 m) ----------
const GROUND_NAP = 17.7;
const ORIGIN = [193174.6, 471890.07];
const X_AXIS = [0.999877, 0.015707]; // RD-richting 0,9 graden, langs de gevels aan het voorplein
// Onderkant 0,5 m onder het voorplein; het tuinterras achter het paleis ligt 2 m hoger.
const BASE = -0.5;

// Hoofdgebouw (corps de logis): goot +15,6 m, dakvlakken van 46,6 graden tot het platte dak op +21,3 m.
const MAIN = { u: 14.1, v0: 37.0, v1: 62.5, eave: 15.6, t: 1.06, top: 21.3 };
// Middenrisaliet met driehoekig fronton aan het voorplein (top +20,9 m) en aan de tuin (top +18,3 m).
const MAIN_FRONT = { u: 6.1, v: 35.8, pedU: 6.3, peak: 20.9 };
const MAIN_BACK = { u: 4.8, v: 63.7, pedU: 5.0, peak: 18.3 };
// Dakopbouw midden op het platte dak (+24 m) en schoorstenen op de randen ervan (+23,8 m).
const MAIN_ROOFTOP = { u: 2.5, v0: 46.0, v1: 53.8, top: 24.0 };
const MAIN_CHIMNEYS = { u: 8.6, v: [42.8, 49.9, 57.0], top: 23.8 };
// Binnenpaviljoens (u 12,8 tot 27,0 m aan beide kanten): goot +12,2 m, 45 graden, plat bovenvlak +17,4 m,
// langs de lange zijden een doorlopende dakkapel tot +14,6 m.
const INNER = { u0: -27.0, u1: -12.8, v0: 18.5, v1: 42.0, eave: 12.2, t: 1.0, top: 17.4, band: 14.6 };
// Buitenpaviljoens (u 26,4 tot 42,4 m): goot +12,3 m, schilddak van 49,6 graden met de nok op +17,7 m,
// gebogen frontons aan voorplein en tuin (top +14,3 m).
const OUTER = { u0: -42.4, u1: -26.4, v0: 16.0, v1: 25.2, eave: 12.3, t: 1.17 };
const SEGMENT = { c: -34.7, half: 5.0, rise: 2.0 };
// Zijvleugels om het voorplein (u 33,4 tot 42,4 m): goot +8 m, nok +13,1 m (48,5 graden), schilden aan
// beide einden, met negen dakkapellen naar het voorplein en vier schoorstenen op de nok.
const WING = { u0: -42.4, u1: -33.4, v0: -47.0, v1: 15.8, eave: 8.0, ridge: 13.1 };
const WING_DORMERS = Array.from({ length: 9 }, (_, k) => -42.0 + 6.5 * k);
const WING_CHIMNEYS = [7.0, -6.0, -25.5, -39.0];
// Kopse paviljoens van de vleugels aan de straat: goot +10 m, tentdak tot +15,2 m met een schoorsteen.
const HEAD = { u0: -42.4, u1: -33.4, v0: -57.7, v1: -47.0, eave: 10.0, t: 1.14 };
// Oostelijk complex (de uitbreiding van 1911-1914 rond een binnenhof): vleugels met goot +8 m en nok +13 m,
// twee hoekpaviljoens met tentdaken, een middenvleugel met topgevels en een lage verbinding.
const EAST = {
  south: { u0: 42.6, u1: 92.9, v0: -57.7, v1: -47.1, eave: 7.8, t: 0.96 },
  north: { u0: 49.6, u1: 92.4, v0: -20.7, v1: -11.8, eave: 8.2, t: 1.12 },
  west: { u0: 48.9, u1: 59.0, v0: -47.5, v1: -11.8, eave: 8.2, t: 0.99 },
  east: { u0: 93.5, u1: 102.0, v0: -47.6, v1: -21.3, eave: 8.3, t: 1.15 },
  middle: { u0: 61.5, u1: 85.4, v0: -47.1, v1: -39.5, eave: 8.2, ridge: 13.4 },
  ne: { u0: 92.4, u1: 102.0, v0: -21.3, v1: -11.8, eave: 10.0, t: 1.42 },
  se: { u0: 92.9, u1: 102.1, v0: -57.7, v1: -47.6, eave: 10.0, t: 1.15 },
  link: { u0: 42.4, u1: 49.0, v0: -46.8, v1: -17.2, top: 4.7 },
};
// Lage vleugel langs de straat ten westen van de westvleugel (BAG 0200100000800424 en 0200100000800425):
// goot +7,8 m, nok +12,8 m (45 graden), schilden aan beide einden, zes dakkapellen naar de straat; aan het
// westeinde een paviljoen met tentdak (goot +9,9 m, top +15,2 m, schoorsteen) en een laag entreegebouw (+4,2 m).
const STREET = {
  range: { u0: -93.0, u1: -42.2, v0: -57.7, v1: -47.4, eave: 7.8, t: 0.97 },
  pavilion: { u0: -103.2, u1: -93.0, v0: -57.7, v1: -47.5, eave: 9.9, t: 1.07 },
  annex: { u0: -112.1, u1: -103.2, v0: -57.7, v1: -47.5, top: 4.2 },
  dormers: [-80.6, -74.2, -67.7, -61.2, -54.7, -48.2],
  chimneys: [-83.9, -51.9],
};

// Maaiveld op het voorplein (NAP +17,7 m) tussen de vleugels.
const GROUND_SAMPLES = [[-20, -25], [20, -25], [0, 20]];

// ---------- hulpvormen ----------
// Veelhoek met punten [x, z] uitgetrokken langs Y van y0 tot y1.
const profileY = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, y1, 0, 1]);
const box = (u0, u1, v0, v1, z0, z1) => prism(rect(u0, u1, v0, v1), z0, z1);
// Bouwdeel met dakvlakken met helling t vanaf de goot langs elke gevel (schilddak), afgevlakt op 'top'.
const hip = ({ u0, u1, v0, v1, eave, t }, top = 100, ends = true) =>
  roofed(rect(u0, u1, v0, v1), [
    [0, t, eave - t * v0],
    [0, -t, eave + t * v1],
    ...(ends ? [[t, 0, eave - t * u0], [-t, 0, eave + t * u1]] : []),
    [0, 0, top],
  ]);
// Zadeldak met de nok langs u (op v = (v0 + v1) / 2) en topgevels aan de kopse kanten.
const gableU = ({ u0, u1, v0, v1, eave, ridge }) => {
  const vc = (v0 + v1) / 2;
  return roofed(rect(u0, u1, v0, v1), ridgeV(vc, ridge, (ridge - eave) / ((v1 - v0) / 2)));
};
// Kroonlijst: een plaat die 'out' voor de gevel uitsteekt met een schuine onderkant van 48 graden.
const cornice = ({ u0, u1, v0, v1 }, z, out = 0.4) =>
  Manifold.hull([
    ...rect(u0 + 0.05, u1 - 0.05, v0 + 0.05, v1 - 0.05).map(([x, y]) => [x, y, z - 0.25 - (out + 0.05) * 1.25]),
    ...rect(u0 - out, u1 + out, v0 - out, v1 + out).map(([x, y]) => [x, y, z - 0.25]),
    ...rect(u0 - out, u1 + out, v0 - out, v1 + out).map(([x, y]) => [x, y, z]),
  ]);
const chimney = (u, v, hu, hv, z0, z1) => box(u - hu, u + hu, v - hv, v + hv, z0, z1);
// Gebogen fronton (segmentboog) in een gevel v = vf: koorde 2*half op hoogte z0, pijl 'rise', het dak in tot vIn.
const segment = (c, half, z0, rise, vf, vIn) => {
  const r = (half * half + rise * rise) / (2 * rise);
  const pts = [[c - half, z0 - 0.6]];
  for (let k = 0; k <= 16; k++) {
    const x = -half + (2 * half * k) / 16;
    pts.push([c + x, z0 - (r - rise) + Math.sqrt(r * r - x * x)]);
  }
  pts.push([c + half, z0 - 0.6]);
  return profileY(pts, Math.min(vf, vIn), Math.max(vf, vIn));
};
// Driehoekig fronton: basis 2*half op z0, top op peak, van vf het dak in tot vIn.
const pediment = (half, z0, peak, vf, vIn) =>
  profileY([[-half, z0 - 0.6], [half, z0 - 0.6], [half, z0], [0, peak], [-half, z0]], Math.min(vf, vIn), Math.max(vf, vIn));
// Vensternissen (0,35 m diep, spitse bovenkant van 58 graden): een rij posities langs een gevel.
// side: "E" (gevel u = c, naar +u), "W" (u = c, naar -u), "N" (v = c, naar +v), "S" (v = c, naar -v).
const windows = (side, c, positions, rows, w = 1.3) => {
  const out = [];
  const ang = { E: 0, N: 90, W: 180, S: 270 }[side];
  const a = side === "E" || side === "N" ? c : -c;
  for (const p of positions) {
    const centre = side === "E" || side === "W" ? [0, p] : [p, 0];
    // Bij W en N draait de positie langs de gevel om; de nis staat op het midden (s = 0) en schuift via 'centre'.
    for (const [z0, z1] of rows) out.push(niche(centre, ang, a, 0, w, z0, z1, 0.35));
  }
  return out;
};
const range = (a, b, n) => Array.from({ length: n }, (_, k) => (n === 1 ? (a + b) / 2 : a + ((b - a) * k) / (n - 1)));

// ---------- westhelft (vleugel, kopse paviljoen, buiten- en binnenpaviljoen); de oosthelft is het spiegelbeeld ----------
const half = [];
const halfCuts = [];
{
  // Zijvleugel met schilden en kroonlijst.
  const wt = (WING.ridge - WING.eave) / ((WING.u1 - WING.u0) / 2);
  half.push(hip({ ...WING, t: wt }), cornice(WING, WING.eave));
  // Dakkapellen naar het voorplein: front in de gevel, puntdakje tot +10,6 m.
  for (const v of WING_DORMERS) half.push(roofed(rect(WING.u1 - 2.4, WING.u1, v - 0.8, v + 0.8), ridgeV(v, 10.6, 1.0)));
  const wc = (WING.u0 + WING.u1) / 2;
  for (const v of WING_CHIMNEYS) half.push(chimney(wc, v, 0.6, 0.9, 11.0, 15.0));
  // Kopse paviljoen aan de straat met tentdak en schoorsteen.
  half.push(hip(HEAD), cornice(HEAD, HEAD.eave));
  half.push(chimney((HEAD.u0 + HEAD.u1) / 2, (HEAD.v0 + HEAD.v1) / 2, 0.7, 0.7, 13.0, 17.3));
  // Buitenpaviljoen met schilddak, schoorstenen op de nok, gebogen frontons en een dakkapel aan de buitenkant.
  half.push(hip(OUTER), cornice(OUTER, OUTER.eave));
  for (const u of [-37.9, -31.4]) half.push(chimney(u, 20.6, 0.7, 0.7, 16.0, 19.0));
  half.push(segment(SEGMENT.c, SEGMENT.half, OUTER.eave, SEGMENT.rise, OUTER.v0, OUTER.v0 + 2.6));
  half.push(segment(SEGMENT.c, SEGMENT.half, OUTER.eave, SEGMENT.rise, OUTER.v1, OUTER.v1 - 2.6));
  half.push(box(OUTER.u0, OUTER.u0 + 2.2, 19.9, 21.3, BASE, 14.4));
  // Binnenpaviljoen: schilddak met plat bovenvlak, doorlopende dakkapellen langs de lange zijden,
  // een dakkapel in het midden van de korte zijden en vier schoorstenen.
  half.push(hip(INNER, INNER.top), cornice(INNER, INNER.eave));
  half.push(box(INNER.u1 - 2.5, INNER.u1, 22.4, 37.0, BASE, INNER.band), box(INNER.u0, INNER.u0 + 2.5, 22.4, 37.0, BASE, INNER.band));
  const ic = (INNER.u0 + INNER.u1) / 2;
  half.push(box(ic - 1.5, ic + 1.5, INNER.v0, INNER.v0 + 2.4, BASE, INNER.band), box(ic - 1.5, ic + 1.5, INNER.v1 - 2.4, INNER.v1, BASE, INNER.band));
  for (const u of [ic - 1.6, ic + 1.6]) for (const v of [24.1, 35.3]) half.push(chimney(u, v, 0.6, 0.6, 16.0, 19.4));

  // Vensters: twee rijen in de vleugel, drie in de paviljoens.
  const wingRows = [[1.0, 3.4], [4.3, 6.1]];
  const wingBays = range(-45.4, 14.0, 19);
  halfCuts.push(...windows("E", WING.u1, wingBays, wingRows));
  // De buitengevel heeft lisenen met velden ertussen (0,25 m terug) en hoog in elk tweede veld een klein venster.
  for (const v of wingBays) halfCuts.push(niche([0, v], 180, -WING.u0, 0, 2.0, 0.3, 5.2, 0.25));
  halfCuts.push(...wingBays.filter((_, k) => k % 2 === 1).flatMap((v) => [niche([0, v], 180, -WING.u0, 0, 1.2, 4.2, 5.4, 0.6)]));
  const headRows = [[1.0, 3.6], [5.0, 7.6]];
  halfCuts.push(...windows("S", HEAD.v0, range(-40.4, -35.4, 3), headRows), ...windows("E", HEAD.u1, range(-55.4, -49.3, 2), headRows));
  const pavRows = [[1.2, 4.0], [5.2, 8.0], [9.1, 10.3]];
  halfCuts.push(...windows("S", OUTER.v0, range(-31.8, -28.4, 2), pavRows), ...windows("N", OUTER.v1, range(-40.4, -28.6, 5), pavRows), ...windows("W", OUTER.u0, range(18.2, 23.0, 2), pavRows));
  halfCuts.push(...windows("S", INNER.v0, range(-23.6, -16.2, 3), pavRows), ...windows("N", INNER.v1, range(-23.6, -16.2, 3), pavRows));
  halfCuts.push(...windows("E", INNER.u1, range(21.0, 34.5, 5), pavRows), ...windows("W", INNER.u0, range(28.0, 39.5, 4), pavRows));
}
const westHalf = Manifold.union(half).subtract(Manifold.union(halfCuts));
const palaceHalves = Manifold.union([westHalf, westHalf.mirror([1, 0, 0])]);

// ---------- hoofdgebouw ----------
const main = [];
const mainCuts = [];
{
  const M = MAIN;
  const r = { u0: -M.u, u1: M.u, v0: M.v0, v1: M.v1, eave: M.eave, t: M.t };
  main.push(hip(r, M.top), cornice(r, M.eave, 0.5));
  // Middenrisalieten met frontons.
  const F = MAIN_FRONT;
  main.push(box(-F.u, F.u, F.v, M.v0 + 0.2, BASE, M.eave), cornice({ u0: -F.u, u1: F.u, v0: F.v, v1: M.v0 + 1 }, M.eave, 0.5));
  main.push(pediment(F.pedU, M.eave, F.peak, F.v, F.v + 6.0));
  const B = MAIN_BACK;
  main.push(box(-B.u, B.u, M.v1 - 0.2, B.v, BASE, M.eave), cornice({ u0: -B.u, u1: B.u, v0: M.v1 - 1, v1: B.v }, M.eave, 0.5));
  main.push(pediment(B.pedU, M.eave, B.peak, B.v, B.v - 4.0));
  // Balustrade rond het platte dak, de dakopbouw en de schoorstenen.
  const flatU = M.u - (M.top - M.eave) / M.t;
  const flat = rect(-flatU, flatU, M.v0 + (M.top - M.eave) / M.t, M.v1 - (M.top - M.eave) / M.t);
  main.push(band(section(flat), 0.9, M.top - 0.2, M.top + 1.1));
  const T = MAIN_ROOFTOP;
  main.push(box(-T.u, T.u, T.v0, T.v1, M.top - 0.2, T.top));
  for (const s of [-1, 1]) for (const v of MAIN_CHIMNEYS.v) main.push(chimney(s * MAIN_CHIMNEYS.u, v, 0.7, 0.7, M.top - 2, MAIN_CHIMNEYS.top));
  // Dakkapellen met plat dak (+17,9 m): vier op elke zijhelling en twee op de tuinhelling.
  for (const s of [-1, 1]) {
    for (const v of [43.85, 48.0, 51.5, 55.65]) main.push(box(s > 0 ? M.u - 2.2 : -M.u, s > 0 ? M.u : -M.u + 2.2, v - 0.8, v + 0.8, BASE, 17.9));
    main.push(box(s * 8.4 - 0.8, s * 8.4 + 0.8, M.v1 - 2.2, M.v1, BASE, 17.9));
  }
  // Bordes met vier treden voor de ingang aan het voorplein.
  main.push(profileX([[30.8, BASE], [F.v + 0.1, BASE], [F.v + 0.1, 1.8], [34.0, 1.8], [34.0, 1.35], [33.0, 1.35], [33.0, 0.9], [32.0, 0.9], [32.0, 0.45], [30.8, 0.45]], -4.5, 4.5));
  // Vensters: zeven assen in drie rijen aan voorplein en tuin, vijf assen in de zijgevels; de ingang in het midden.
  const rows = [[1.9, 4.6], [6.2, 9.4], [11.0, 13.3]];
  const bays = [-12.3, -8.2, 8.2, 12.3];
  mainCuts.push(...windows("S", M.v0, bays, rows), ...windows("S", F.v, [-4.1, 4.1], rows), ...windows("S", F.v, [0], rows.slice(1)));
  mainCuts.push(niche([0, 0], 270, -F.v, 0, 2.2, 1.8, 4.6, 0.5));
  mainCuts.push(...windows("N", M.v1, bays, rows), ...windows("N", B.v, [-2.6, 2.6], rows), ...windows("N", B.v, [0], rows.slice(1)));
  for (const side of ["E", "W"]) mainCuts.push(...windows(side, side === "E" ? M.u : -M.u, range(44.6, 60.6, 5), rows));
}
const mainBlock = Manifold.union(main).subtract(Manifold.union(mainCuts));

// ---------- oostelijk complex ----------
const east = [];
const eastCuts = [];
{
  const E = EAST;
  for (const k of ["south", "north", "west", "east"]) east.push(hip(E[k]), cornice(E[k], E[k].eave, 0.3));
  for (const k of ["ne", "se"]) east.push(hip(E[k]), cornice(E[k], E[k].eave, 0.3));
  east.push(gableU(E.middle), cornice(E.middle, E.middle.eave, 0.3));
  // Lage verbinding met de oostvleugel (+4,7 m) met installaties en een gang op +7,3 m.
  const L = E.link;
  east.push(box(L.u0, L.u1, L.v0, L.v1, BASE, L.top));
  east.push(box(L.u0, L.u1, -19.6, -17.2, BASE, 7.3), box(43.5, 45.5, -31.0, -21.0, BASE, 7.3), box(45.6, 47.6, -43.0, -34.0, BASE, 7.6));
  // Schoorstenen (+14,6 m, op de hoekpaviljoens hoger).
  const ch = [[54.0, -16.25], [64.6, -16.25], [75.1, -16.25], [89.1, -16.25], [54.0, -24.1], [54.0, -32.4], [54.0, -43.1], [97.7, -24.6], [97.7, -30.1], [97.7, -39.4], [62.2, -43.35], [84.7, -43.35], [51.6, -52.4], [84.1, -52.4]];
  for (const [u, v] of ch) east.push(chimney(u, v, 0.6, 0.6, 10.0, 14.6));
  east.push(chimney(97.2, -16.5, 0.6, 0.6, 14.0, 18.2), chimney(97.5, -52.6, 0.6, 0.6, 13.0, 16.8));
  // Dakkapellen met een puntdakje (op de luchtfoto): aan de straat, in de binnenhof en aan de oostkant.
  const dormer = (side, c, p, eave) => {
    const d = side === "S" || side === "W" ? 2.2 : -2.2;
    const r = side === "S" || side === "N" ? rect(p - 0.75, p + 0.75, Math.min(c, c + d), Math.max(c, c + d)) : rect(Math.min(c, c + d), Math.max(c, c + d), p - 0.75, p + 0.75);
    return roofed(r, side === "S" || side === "N" ? ridgeU(p, eave + 2.3, 1.0) : ridgeV(p, eave + 2.3, 1.0));
  };
  for (const u of [55, 61, 68, 75, 81]) east.push(dormer("S", E.south.v0, u, E.south.eave));
  for (const u of [63, 72, 81, 89]) east.push(dormer("S", E.north.v0, u, E.north.eave));
  for (const v of [-31.5, -39.5]) east.push(dormer("E", E.west.u1, v, E.west.eave), dormer("E", E.east.u1, v - 0.3, E.east.eave));
  east.push(dormer("W", E.east.u0, -35.0, E.east.eave));
  // Vensters in twee rijen aan de buitenkant en in de binnenhof.
  const rows = [[1.0, 3.4], [4.3, 6.1]];
  const pav = [[1.0, 3.6], [5.0, 7.6]];
  eastCuts.push(...windows("N", E.north.v1, range(52.0, 89.8, 12), rows), ...windows("S", E.north.v0, range(62.0, 89.8, 9), rows));
  eastCuts.push(...windows("S", E.south.v0, range(45.6, 89.9, 14), rows), ...windows("E", E.east.u1, range(-44.6, -24.3, 7), rows), ...windows("W", E.east.u0, range(-37.0, -24.3, 4), rows));
  eastCuts.push(...windows("E", E.west.u1, range(-37.0, -24.0, 4), rows), ...windows("N", E.middle.v1, range(64.0, 83.0, 6), rows));
  eastCuts.push(...windows("N", E.ne.v1, range(95.2, 99.2, 2), pav), ...windows("E", E.ne.u1, range(-19.0, -14.1, 2), pav));
  eastCuts.push(...windows("S", E.se.v0, range(95.5, 99.5, 2), pav), ...windows("E", E.se.u1, range(-55.4, -50.0, 2), pav));
}
const eastBlock = Manifold.union(east).subtract(Manifold.union(eastCuts));

// ---------- lage vleugel langs de straat (west) ----------
const street = [];
const streetCuts = [];
{
  const S = STREET;
  street.push(hip(S.range), cornice(S.range, S.range.eave, 0.3));
  for (const u of S.dormers) street.push(roofed(rect(u - 0.8, u + 0.8, S.range.v0, S.range.v0 + 2.4), ridgeU(u, S.range.eave + 2.6, 1.0)));
  const rc = (S.range.v0 + S.range.v1) / 2;
  for (const u of S.chimneys) street.push(chimney(u, rc, 0.7, 0.7, 10.5, 14.6));
  street.push(hip(S.pavilion), cornice(S.pavilion, S.pavilion.eave, 0.3));
  const pc = (S.pavilion.u0 + S.pavilion.u1) / 2;
  street.push(chimney(pc + 0.2, (S.pavilion.v0 + S.pavilion.v1) / 2, 0.7, 0.7, 13.0, 17.0));
  street.push(roofed(rect(pc - 0.8, pc + 0.8, S.pavilion.v0, S.pavilion.v0 + 2.4), ridgeU(pc, S.pavilion.eave + 2.5, 1.0)));
  street.push(roofed(rect(pc - 0.8, pc + 0.8, S.pavilion.v1 - 2.4, S.pavilion.v1), ridgeU(pc, S.pavilion.eave + 2.5, 1.0)));
  street.push(box(S.annex.u0, S.annex.u1 + 0.2, S.annex.v0, S.annex.v1, BASE, S.annex.top));
  // Vensters in twee rijen aan straat en terras; drie assen in de gevels van het paviljoen.
  const rows = [[1.0, 3.4], [4.3, 6.1]];
  const bays = range(-90.6, -44.6, 15);
  streetCuts.push(...windows("S", S.range.v0, bays, rows), ...windows("N", S.range.v1, bays, rows));
  const pav = [[1.0, 3.6], [5.0, 7.6]];
  streetCuts.push(...windows("S", S.pavilion.v0, range(pc - 3.2, pc + 3.2, 3), pav), ...windows("N", S.pavilion.v1, range(pc - 3.2, pc + 3.2, 3), pav));
  streetCuts.push(...windows("W", S.pavilion.u0, range(-55.2, -50.0, 2), [pav[1]]));
}
const streetBlock = Manifold.union(street).subtract(Manifold.union(streetCuts));

const palace = Manifold.union([palaceHalves, mainBlock, eastBlock, streetBlock]);
const nodes = [["building:paleis", palace]];
const all = palace;

const META = {
  name: "Paleis Het Loo",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 61.44,
  replacesBuildings: ["0200100000085665", "0200100000800424", "0200100000800425"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (193174,6, 471890,07), op de symmetrieas midden op het voorplein, op het maaiveld van het voorplein (NAP +17,7 m), +X langs de gevels naar het oosten (0,9 graden vanaf de RD-X-as) en +Y naar de tuin. Een node building:paleis uit dakvlakken en bouwdelen: het hoofdgebouw (goot +15,6 m, schilddak tot het platte dak op +21,3 m met balustrade, dakopbouw tot +24 m en zes schoorstenen tot +23,8 m, frontons aan voorplein en tuin, dakkapellen, bordes), twee binnenpaviljoens (goot +12,2 m, plat bovenvlak +17,4 m), twee buitenpaviljoens (nok +17,7 m, gebogen frontons), de zijvleugels om het voorplein (goot +8 m, nok +13,1 m, negen dakkapellen naar het voorplein) met kopse paviljoens (tentdak tot +15,2 m) het oostelijke complex rond een binnenhof met twee hoekpaviljoens en de lage vleugel langs de straat ten westen (goot +7,8 m, nok +12,8 m, zes dakkapellen, paviljoen met tentdak tot +15,2 m, entreegebouw +4,2 m); kroonlijsten en vensternissen in de gevels. Onderkant 0,5 m onder het voorplein; alle vlakken wijzen omhoog, staan verticaal of hangen niet vlakker dan 48 graden. Vervangt de PDOK-reconstructie van de drie panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { mainEaveM: MAIN.eave, mainFlatRoofM: MAIN.top, mainChimneyTopM: MAIN_CHIMNEYS.top, wingRidgeM: WING.ridge, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Paleis_Het_Loo",
    "PDOK BAG pand 0200100000085665 (paleis, vleugels, oostelijk complex en de ondergrondse uitbreiding onder het voorplein), EPSG:28992",
    "PDOK BAG panden 0200100000800424 en 0200100000800425 (de lage vleugel langs de straat met het westpaviljoen en het entreegebouw)",
    "PDOK AHN DSM/DTM 0,5 m via WCS (ook op 0,25 m): goten, nokken, platte daken, schoorstenen, dakkapellen en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): dakvlakken, hellingen en de contouren van de paviljoens",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's van het voorplein, de tuinzijde en de vleugels",
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

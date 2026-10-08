// Genereert een gesloten 3D-model van het Kasteel van Breda (sinds 1826 de
// Koninklijke Militaire Academie) uit dakvlakken en bouwdelen. Drie onderdelen:
// het renaissancepaleis van Hendrik III rond de binnenplaats (vier vleugels met
// schilddaken van 45 graden en een opgewipte dakvoet, de noord- en zuidvleugel
// 21 m doorlopend naar het westen met een schild, de westvleugel iets breder en
// vlakker, een kroonlijst op een kraag, een plint, de twee achtkantige
// hoektorentjes met spits en bol aan de Parade, de Henricuspoort midden in de
// oostgevel, schoorstenen op de nokken, drie vensterrijen en arcaden op de
// binnenplaats); het voorgebouw langs de zuidelijke gracht met de
// Stadhouderspoort (stenen poortpartij met pilasters, fronton en dakkapel), de
// vierkante toren met tentdak, de schuine vleugel met een steil zadeldak en het
// hoekpaviljoen in de gracht met een dak rond een lichthof; en het achtkantige
// torentje op de hoek van de Parade. Elk dak is een vlak z = a u + b v + c uit
// het AHN. Het Mapbox-model is niet gebruikt. Alle maten in het script zijn
// meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-kasteel-van-breda.mjs              # 1:1000 (standaard)
//   node scripts/generate-kasteel-van-breda.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (112576, 400456), midden op de binnenplaats, op
// het maaiveld van het voorplein tussen de westvleugels (NAP +2,3 m), Z omhoog.
// +X loopt langs de noord- en zuidvleugel naar het oostnoordoosten (11,5 graden
// linksom vanaf de RD-X-as, gemeten aan de nokken en goten) en +Y loodrecht
// daarop. De binnenplaats ligt op NAP +3,75 m, de Parade op +2,7 m, het pad ten
// zuiden op +1,8 m en het water van de gracht op +0,3 m; het voorgebouw en het
// paviljoen staan in de gracht, daarom begint het hele model op NAP -0,5 m.
// Het voorgebouw is gebouwd in een eigen stelsel langs de gracht (10,7 graden),
// het paviljoen in zijn eigen stelsel (-3,1 graden); beide worden aan het eind
// in het modelstelsel gedraaid.
//
// Bronnen: PDOK BAG-panden 0758100000023912 (paleis), ...23913 (voorgebouw),
// ...23914 (toren en schuine vleugel), ...24029 (hoekpaviljoen) en ...24027
// (achtkantig torentje); AHN DSM/DTM 0,5 m (PDOK WCS) voor de dakvlakken,
// nokken, goten, torentjes, schoorstenen en het maaiveld; Wikipedia; PDOK
// luchtfoto; foto's op Wikimedia Commons vanaf de Parade (oostgevel met de
// hoektorentjes), de binnenplaats, het Kasteelplein (Stadhouderspoort en brug)
// en de westelijke gracht (toren en schuine vleugel). Geschat zijn de spitsen en
// bollen van de hoektorentjes boven +26,6 m (het AHN mist de top), de
// vensternissen en arcaden (traveemaat van foto's), de poortpartijen, de
// dakkapellen, de lantaarn op het paviljoen en het dak van het achtkantige
// torentje. Weggelaten: de brug naar de Stadhouderspoort (zit als dek op NAP
// +3,4 m in het PDOK-terrein), het Spanjaardsgat (de watertoegang met twee
// zevenhoekige torens, 130 m naar het westzuidwesten, los van het
// kasteel), de latere KMA-gebouwen eromheen en het pand uit 1790 tegen de
// schuine vleugel (blijven PDOK), een strook op +14,5 m langs de noordwestvleugel die
// alleen in het AHN staat (steiger, niet op luchtfoto of foto's), de trap voor
// de Henricuspoort, kleine schoorsteenpotten en de luiken.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "kasteel-van-breda");
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

const SLUG = "kasteel-van-breda";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld van het voorplein aan de westkant op NAP +2,3 m) ----------
const GROUND_NAP = 2.3;
const ORIGIN = [112576.0, 400456.0];
const X_AXIS = [0.979925, 0.199368]; // RD-richting 11,5 graden, langs de noord- en zuidvleugel
// De voorgebouwen aan de zuidkant staan in de slotgracht (water NAP +0,3 m); alles begint op NAP -0,5 m.
const BASE = -2.8;
const nap = (h) => +(h - GROUND_NAP).toFixed(3);

// Paleis: vier vleugels van 13 tot 15 m breed rond de binnenplaats, de noord- en zuidvleugel lopen 21 m
// door naar het westen. Daklijnen (goot, buitenkant van de kroonlijst) uit het AHN-DSM.
const EAVE_OUT = nap(18.45); // goot aan de buitengevels (knik van de dakvoet)
const EAVE_IN = nap(18.0); // goot aan de binnenplaats
const KICK = 0.58; // helling van de opgewipte dakvoet (30 graden)
const CORNICE = 0.5; // kroonlijst: de gevel staat 0,5 m binnen de goot, kraag van 42 graden
const NORTH = { u0: -54.8, u1: 32.3, v0: 13.3, v1: 26.6, ridge: 20.35, h: nap(24.25), t: 1.0 };
const SOUTH = { u0: -54.8, u1: 32.3, v0: -27.6, v1: -13.6, ridge: -20.55, h: nap(24.15), t: 1.0 };
const EAST = { u0: 19.0, u1: 32.3, v0: -27.6, v1: 26.6, ridge: 25.95, h: nap(24.25), t: 1.0 };
const WEST = { u0: -34.3, u1: -19.1, v0: SOUTH.ridge, v1: NORTH.ridge, ridge: -26.7, h: nap(24.1), t: 0.86 };
// Hoogte van het hoofddakvlak op de gootlijn van een schild (aan de uiteinden en de hoeken).
const HIP_EAVE = nap(17.95);
// Achtkantige hoektorentjes aan de oostgevel (Parade), met een spits en een bol.
const TURRETS = [[32.2, 26.4], [32.2, -26.8]];
const TURRET = { across: 4.4, wall: nap(22.1), tip: nap(27.3) };
// Schoorstenen op de nokken (AHN: 1,5 tot 3 m boven de nok).
const CHIMNEYS = [
  [-34.1, 20.5, 1.4, 2.4, nap(27.4)], [-33.4, -20.5, 1.4, 2.4, nap(27.4)], [-26.7, -0.1, 2.4, 1.4, nap(26.6)],
  [-20.9, 20.35, 1.0, 1.4, nap(26.0)], [5.0, 20.35, 1.0, 1.4, nap(26.0)], [-8.4, -20.55, 1.0, 1.4, nap(26.0)],
  [11.8, -20.55, 1.0, 1.4, nap(26.0)], [25.95, 5.0, 1.4, 1.0, nap(26.0)], [25.95, -6.5, 1.4, 1.0, nap(26.0)],
];
// Vensterrijen in de buitengevels (drie bouwlagen) en de binnenplaats (arcaden op de begane grond).
const ROWS = [[nap(5.0), nap(7.4)], [nap(8.9), nap(11.3)], [nap(12.7), nap(15.0)]];
const COURT = nap(3.75); // binnenplaats
const BAY = 2.97; // vensterafstand in de buitengevels
const ARCH = 3.96; // traveemaat van de arcaden

// Voorgebouw met de Stadhouderspoort langs de zuidelijke gracht, in een eigen stelsel (s, t) langs de gracht
// (10,7 graden vanaf de RD-X-as, oorsprong RD (112658,3, 400399,8) aan de brug).
const VG_ROT = -0.8;
const VG_POS = [69.443, -71.48];
const VG = { s0: -38.0, s1: 17.0, t0: 0.0, t1: 10.15, eave: nap(11.95), ridgeT: 5.08, ridge: nap(15.75), slope: 0.95, ledge: 1.0 };
const GATE = { s: -1.3, deck: nap(3.4) };
// Vierkante toren op de westhoek van het voorgebouw en de schuine vleugel naar het noordwesten.
const TOWER = { s0: -42.0, s1: -36.5, t0: 0.8, t1: 6.3, wall: nap(19.8), tip: nap(24.0) };
// Lage aansluiting met een plat dak tussen de toren en de schuine vleugel (BAG, AHN NAP +12,1 m).
const LINK = { s0: -46.2, s1: -38.0, t0: 0.0, t1: 6.1, top: nap(12.1) };
const WING = { o: [-43.3, 5.55], angle: 110.89, len: 21.0, half: 4.6, ridge: nap(20.3), eave: nap(12.7) };
// Hoekpaviljoen in de gracht (22 bij 21 m, 3,1 graden rechtsom vanaf de RD-X-as), dak rond een lichthof.
const PAV_ROT = -14.6;
const PAV_POS = [92.548, -76.283];
const PAV = { u0: -10.0, u1: 12.0, v0: -11.0, v1: 10.0, eave: nap(12.6), crest: nap(15.7), inset: 4.4, court: [-2.4, 4.4, -3.9, 2.9], courtZ: nap(12.7) };
// Achtkantig torentje op de zuidoosthoek van de Parade.
const OCT = { c: [106.98, -36.85], rot: 15.4, across: 5.06, wall: nap(6.1), tip: nap(12.7) };

// Maaiveld van het voorplein tussen de westvleugels (NAP +2,3 m) en ten zuiden van het paleis.
const GROUND_SAMPLES = [[-45, 0], [-45, -8], [0, -36]];

// ---------- hulpfuncties voor dit model ----------
const trimmed = (solid, planes) => planes.reduce((s, p) => cutBelow(s, p), solid);
const expand = ([u0, u1, v0, v1], d) => rect(u0 - d, u1 + d, v0 - d, v1 + d);
// Vlak dat vanaf een lijn coord = c0 (hoogte z0) met helling t naar binnen oploopt; dir +1 = naar +coord.
const riseU = (c0, z0, t, dir) => [dir * t, 0, z0 - dir * t * c0];
const riseV = (c0, z0, t, dir) => [0, dir * t, z0 - dir * t * c0];
const span = (a, b, step) => {
  const n = Math.round((b - a) / step);
  return Array.from({ length: n + 1 }, (_, k) => a + (k * (b - a)) / n);
};

// Vleugel: gevel binnen de gootlijn met een kroonlijst op een kraag, een plint, het hoofddak (twee vlakken tot de
// nok plus schilden) en de opgewipte dakvoet langs de goten (de hoogste van beide telt).
function wing(w, axis, eaves, hips) {
  const eaveRect = [w.u0, w.u1, w.v0, w.v1];
  const wall = expand(eaveRect, -CORNICE);
  const body = loft([[BASE, wall], [EAVE_IN - 0.55, wall], [EAVE_IN, rect(...eaveRect)], [40, rect(...eaveRect)]]);
  const plinth = loft([[BASE, expand(eaveRect, 0.3 - CORNICE)], [1.6, expand(eaveRect, 0.3 - CORNICE)], [1.95, wall]]);
  // Hoofdvlakken: z = h - t |x - nok|, als twee vlakken die naar de nok oplopen.
  const mainPlanes = axis === "u"
    ? [[0, w.t, w.h - w.t * w.ridge], [0, -w.t, w.h + w.t * w.ridge]]
    : [[w.t, 0, w.h - w.t * w.ridge], [-w.t, 0, w.h + w.t * w.ridge]];
  const hipMain = [];
  const hipKick = [];
  for (const side of hips) {
    if (side === "u0") hipMain.push(riseU(w.u0, HIP_EAVE, 1.0, 1)), hipKick.push(riseU(w.u0, EAVE_OUT, KICK, 1));
    if (side === "u1") hipMain.push(riseU(w.u1, HIP_EAVE, 1.0, -1)), hipKick.push(riseU(w.u1, EAVE_OUT, KICK, -1));
    if (side === "v0") hipMain.push(riseV(w.v0, HIP_EAVE, 1.0, 1)), hipKick.push(riseV(w.v0, EAVE_OUT, KICK, 1));
    if (side === "v1") hipMain.push(riseV(w.v1, HIP_EAVE, 1.0, -1)), hipKick.push(riseV(w.v1, EAVE_OUT, KICK, -1));
  }
  // Dakvoet: goothoogte per zijde (eaves = [kant met lage coördinaat, kant met hoge coördinaat]).
  const kick = axis === "u"
    ? [riseV(w.v0, eaves[0], KICK, 1), riseV(w.v1, eaves[1], KICK, -1)]
    : [riseU(w.u0, eaves[0], KICK, 1), riseU(w.u1, eaves[1], KICK, -1)];
  return Manifold.union([trimmed(body, [...mainPlanes, ...hipMain]), trimmed(body, [...kick, ...hipKick]), plinth]);
}

// ---------- paleis ----------
const solids = [];
solids.push(wing(NORTH, "u", [EAVE_IN, EAVE_OUT], ["u0", "u1"]));
solids.push(wing(SOUTH, "u", [EAVE_OUT, EAVE_IN], ["u0", "u1"]));
solids.push(wing(EAST, "v", [EAVE_IN, EAVE_OUT], ["v0", "v1"]));
solids.push(wing(WEST, "v", [EAVE_OUT, EAVE_IN], []));
// Hoektorentjes: achtkantige schacht tot boven de goot, een lijst op een kraag, een spits met een bol en een pinakel.
for (const c of TURRETS) {
  const a = TURRET.across;
  solids.push(
    loft([
      [BASE, oct(c, a)], [TURRET.wall, oct(c, a)], [TURRET.wall + 0.3, oct(c, a + 0.4)], [TURRET.wall + 0.6, oct(c, a + 0.4)],
      [TURRET.tip - 1.9, oct(c, 0.8)], [TURRET.tip - 1.7, oct(c, 1.1)], [TURRET.tip - 1.1, oct(c, 1.1)], [TURRET.tip - 0.8, oct(c, 0.5)], [TURRET.tip, tip(c)],
    ]),
  );
}
// Schoorstenen.
for (const [u, v, du, dv, top] of CHIMNEYS) solids.push(prism(rect(u - du / 2, u + du / 2, v - dv / 2, v + dv / 2), BASE, top));
// Henricuspoort midden in de oostgevel: een stenen poortpartij van 6 m breed die 0,6 m voor de gevel staat.
const EAST_WALL = EAST.u1 - CORNICE;
solids.push(loft([[BASE, rect(EAST_WALL - 0.2, EAST_WALL + 0.6, -3.0, 3.0)], [nap(8.3), rect(EAST_WALL - 0.2, EAST_WALL + 0.6, -3.0, 3.0)], [nap(8.9), rect(EAST_WALL - 0.2, EAST_WALL + 0.1, -2.5, 2.5)]]));

let palace = Manifold.union(solids);

// Vensternissen (0,35 m diep, spitse bovenkant), de arcaden op de binnenplaats en de poortdoorgangen.
const cuts = [];
const win = (c, ang, a, w, [z0, z1], d = 0.35) => cuts.push(niche(c, ang, a, 0, w, z0, z1 - 0.5 * w * 1.6 + 0.3, d));
const NW = NORTH.v1 - CORNICE;
const SW = SOUTH.v0 + CORNICE;
const WW = WEST.u0 + CORNICE;
const WEND = NORTH.u0 + CORNICE;
for (const u of span(-52.0, 28.4, BAY)) for (const r of ROWS) win([u, 0], 90, NW, 1.3, r), win([u, 0], 270, -SW, 1.3, r);
for (const v of span(-23.76, 23.76, BAY)) for (const [i, r] of ROWS.entries()) if (!(i === 0 && Math.abs(v) < 4.5)) win([0, v], 0, EAST_WALL, 1.3, r);
for (const v of span(-11.88, 11.88, BAY)) for (const r of ROWS) win([0, v], 180, -WW, 1.3, r);
for (const v of [16.4, 20.2, 24.0, -17.0, -20.8, -24.6]) for (const r of ROWS) win([0, v], 180, -WEND, 1.3, r);
for (const u of span(-51.5, -37.0, 2.9)) for (const r of ROWS) win([u, 0], 270, -(NORTH.v0 + CORNICE), 1.3, r), win([u, 0], 90, SOUTH.v1 - CORNICE, 1.3, r);
// Binnenplaats: arcaden met spitse bogen op de begane grond aan de noord-, zuid- en westkant, vensters erboven.
const CN = NORTH.v0 + CORNICE;
const CS = SOUTH.v1 - CORNICE;
const CW = WEST.u1 - CORNICE;
const CE = EAST.u0 + CORNICE;
for (const u of span(-17.82, 17.82, ARCH)) {
  cuts.push(niche([u, 0], 270, -CN, 0, 2.6, COURT, COURT + 2.8, 0.4), niche([u, 0], 90, CS, 0, 2.6, COURT, COURT + 2.8, 0.4));
  for (const r of ROWS.slice(1)) win([u, 0], 270, -CN, 1.3, r), win([u, 0], 90, CS, 1.3, r);
}
for (const v of span(-11.88, 11.88, ARCH)) {
  cuts.push(niche([0, v], 0, CW, 0, 2.6, COURT, COURT + 2.8, 0.4));
  for (const r of ROWS.slice(1)) win([0, v], 0, CW, 1.3, r);
  for (const [i, r] of ROWS.entries()) if (!(i === 0 && Math.abs(v) < 1)) win([0, v], 180, -CE, 1.3, r);
}
// De poortdoorgang van de Henricuspoort: een diepe spitse nis aan de Parade en aan de binnenplaats.
cuts.push(niche([0, 0], 0, EAST_WALL + 0.6, 0, 3.0, nap(2.7), nap(5.6), 1.4));
cuts.push(niche([0, 0], 180, -CE, 0, 3.0, COURT, COURT + 3.2, 1.0));
// Vensters in de hoektorentjes.
for (const c of TURRETS) for (const ang of [0, c[1] > 0 ? 45 : -45, c[1] > 0 ? 90 : -90]) for (const r of [...ROWS, [nap(18.8), nap(21.2)]]) win(c, ang, TURRET.across / 2, 1.0, r, 0.3);
palace = palace.subtract(Manifold.union(cuts));

// ---------- voorgebouw met de Stadhouderspoort (stelsel s langs de gracht, t naar het kasteel) ----------
const vg = [];
const vgCuts = [];
const vgWin = (c, ang, a, w, [z0, z1], d = 0.35) => vgCuts.push(niche(c, ang, a, 0, w, z0, z1 - 0.5 * w * 1.6 + 0.3, d));
// Langgerekt voorgebouw: gevels tot de goot (+11,95 m NAP) met een looprand van 1 m, zadeldak (43 graden) tot de nok.
vg.push(prism(rect(VG.s0, VG.s1, VG.t0, VG.t1), BASE, VG.eave));
vg.push(roofed(rect(VG.s0, VG.s1, VG.t0 + VG.ledge, VG.t1 - VG.ledge), [[0, VG.slope, VG.ridge - VG.slope * VG.ridgeT], [0, -VG.slope, VG.ridge + VG.slope * VG.ridgeT]]));
// Stadhouderspoort: een stenen poortpartij van 7,4 m voor de gevel aan de brug, met twee pilasterbundels en een fronton.
{
  const s = GATE.s;
  vg.push(prism(rect(s - 3.7, s + 3.7, -0.7, 0.2), BASE, nap(9.7)));
  // Fronton (27 graden) over de volle breedte van de poortpartij.
  vg.push(Manifold.extrude(new CrossSection([ccw([[s - 3.7, nap(9.7)], [s + 3.7, nap(9.7)], [s, nap(11.6)]])]), 0.9).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0.2, 0, 1]));
  for (const p of [s - 2.95, s + 2.95]) vg.push(prism(rect(p - 0.5, p + 0.5, -1.0, -0.6), BASE, nap(9.7)));
  // Dakkapel boven de poort.
  vg.push(roofed(rect(s - 1.0, s + 1.0, 0.6, 3.6), ridgeU(s, nap(14.6), 1.6)));
}
// Vensters aan de grachtzijde en aan de kasteelzijde, de poortopening en de doorgang aan de achterkant.
for (const s of span(-35.6, 14.4, 2.5)) {
  if (Math.abs(s - GATE.s) > 4.6) vgWin([s, 0], 270, -VG.t0, 1.4, [nap(8.6), nap(10.9)]);
  if (Math.abs(s - GATE.s) > 2.4) vgWin([s, 0], 90, VG.t1, 1.4, [nap(7.6), nap(10.9)]);
}
vgCuts.push(niche([GATE.s, 0], 270, 1.0, 0, 3.4, GATE.deck, nap(7.0), 2.0));
vgCuts.push(niche([GATE.s, 0], 90, VG.t1, 0, 3.4, GATE.deck, nap(7.0), 1.0));
// Vierkante toren met een tentdak en vensters met luiken, en de lage aansluiting ten westen ervan.
vg.push(prism(rect(LINK.s0, LINK.s1, LINK.t0, LINK.t1), BASE, LINK.top));
vg.push(loft([[BASE, rect(TOWER.s0, TOWER.s1, TOWER.t0, TOWER.t1)], [TOWER.wall, rect(TOWER.s0, TOWER.s1, TOWER.t0, TOWER.t1)], [TOWER.tip, tip([(TOWER.s0 + TOWER.s1) / 2, (TOWER.t0 + TOWER.t1) / 2])]]));
for (const r of [[nap(9.0), nap(11.2)], [nap(13.0), nap(15.2)], [nap(16.4), nap(18.6)]]) {
  if (r[0] > LINK.top) vgWin([(TOWER.s0 + TOWER.s1) / 2, 0], 270, -TOWER.t0, 1.2, r);
  if (r[0] > LINK.top) vgWin([0, (TOWER.t0 + TOWER.t1) / 2], 180, -TOWER.s0, 1.2, r);
}
let voor = Manifold.union(vg).subtract(Manifold.union(vgCuts));
// Schuine vleugel naar het noordwesten (stelsel p langs de vleugel, q dwars): steil zadeldak (59 graden) en een topgevel.
{
  const t = (WING.ridge - WING.eave) / WING.half;
  let w = roofed(rect(-1.0, WING.len, -WING.half, WING.half), ridgeV(0, WING.ridge, t));
  const wc = [];
  for (const p of span(2.5, 18.5, 3.2)) for (const r of [[nap(5.2), nap(7.6)], [nap(8.8), nap(11.2)]]) {
    wc.push(niche([p, 0], 90, WING.half, 0, 1.3, r[0], r[1] - 0.74, 0.35), niche([p, 0], 270, WING.half, 0, 1.3, r[0], r[1] - 0.74, 0.35));
  }
  for (const r of [[nap(5.2), nap(7.6)], [nap(8.8), nap(11.2)], [nap(13.0), nap(15.0)]]) wc.push(niche([0, 0], 0, WING.len, 0, 1.3, r[0], r[1] - 0.74, 0.35));
  w = w.subtract(Manifold.union(wc));
  voor = voor.add(w.rotate([0, 0, WING.angle]).translate([...WING.o, 0]));
}
voor = voor.rotate([0, 0, VG_ROT]).translate([...VG_POS, 0]);

// ---------- hoekpaviljoen in de gracht (eigen stelsel) ----------
{
  const eave = [PAV.u0, PAV.u1, PAV.v0, PAV.v1];
  const wall = expand(eave, -0.3);
  const body = loft([[BASE, wall], [PAV.eave - 0.35, wall], [PAV.eave, rect(...eave)], [40, rect(...eave)]]);
  const t = 0.85;
  const z0 = PAV.crest - t * PAV.inset;
  const outer = [riseU(PAV.u0, z0, t, 1), riseU(PAV.u1, z0, t, -1), riseV(PAV.v0, z0, t, 1), riseV(PAV.v1, z0, t, -1)];
  const kick = [riseU(PAV.u0, PAV.eave, 0.5, 1), riseU(PAV.u1, PAV.eave, 0.5, -1), riseV(PAV.v0, PAV.eave, 0.5, 1), riseV(PAV.v1, PAV.eave, 0.5, -1)];
  const [cu0, cu1, cv0, cv1] = PAV.court;
  const ti = 0.94;
  const inner = [riseU(cu0, PAV.courtZ, ti, -1), riseU(cu1, PAV.courtZ, ti, 1), riseV(cv0, PAV.courtZ, ti, -1), riseV(cv1, PAV.courtZ, ti, 1)];
  // Ring rond de lichthof: per binnenvlak het hoofddak en de dakvoet (de hoogste telt, kilgoten in de hoeken).
  const ps = inner.flatMap((p) => [trimmed(body, [...outer, p]), trimmed(body, [...kick, p])]);
  // Lichthof met een glazen lantaarn.
  ps.push(prism(rect(cu0, cu1, cv0, cv1), BASE, PAV.courtZ));
  ps.push(roofed(rect(-0.2, 2.2, -2.5, 1.5), ridgeU(1.0, nap(14.2), 0.6)));
  // Twee dakkapellen per zijde en twee schoorstenen op de omgang.
  const cx = (PAV.u0 + PAV.u1) / 2;
  const cy = (PAV.v0 + PAV.v1) / 2;
  for (const d of [-4.5, 4.5]) {
    ps.push(roofed(rect(cx + d - 0.8, cx + d + 0.8, PAV.v0 + 0.4, PAV.v0 + 3.0), ridgeU(cx + d, nap(14.3), 1.6)));
    ps.push(roofed(rect(cx + d - 0.8, cx + d + 0.8, PAV.v1 - 3.0, PAV.v1 - 0.4), ridgeU(cx + d, nap(14.3), 1.6)));
    ps.push(roofed(rect(PAV.u1 - 3.0, PAV.u1 - 0.4, cy + d - 0.8, cy + d + 0.8), ridgeV(cy + d, nap(14.3), 1.6)));
  }
  ps.push(prism(sq([4.5, 5.6], 0.5), BASE, nap(17.1)), prism(sq([-5.6, -3.0], 0.5), BASE, nap(16.4)));
  let pav = Manifold.union(ps);
  const pc = [];
  for (const d of [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5]) {
    for (const r of [[nap(4.5), nap(7.0)], [nap(8.3), nap(10.8)]]) {
      pc.push(niche([cx + d, 0], 270, -(PAV.v0 + 0.3), 0, 1.3, r[0], r[1] - 0.74, 0.35));
      pc.push(niche([cx + d, 0], 90, PAV.v1 - 0.3, 0, 1.3, r[0], r[1] - 0.74, 0.35));
      pc.push(niche([0, cy + d], 0, PAV.u1 - 0.3, 0, 1.3, r[0], r[1] - 0.74, 0.35));
    }
  }
  pav = pav.subtract(Manifold.union(pc));
  voor = voor.add(pav.rotate([0, 0, PAV_ROT]).translate([...PAV_POS, 0]));
}

// ---------- achtkantig torentje op de hoek van de Parade ----------
let tower;
{
  const c = [0, 0];
  const a = OCT.across;
  tower = loft([
    [BASE, oct(c, a)], [OCT.wall, oct(c, a)], [OCT.wall + 0.3, oct(c, a + 0.45)], [OCT.wall + 0.5, oct(c, a + 0.45)],
    [OCT.wall + 1.9, oct(c, 3.9)], [OCT.wall + 2.9, oct(c, 2.4)], [OCT.wall + 3.3, oct(c, 1.5)],
    [OCT.tip - 2.4, oct(c, 1.0)], [OCT.tip - 2.1, oct(c, 1.3)], [OCT.tip - 1.6, oct(c, 1.3)], [OCT.tip - 1.0, oct(c, 0.5)], [OCT.tip, tip(c)],
  ]);
  const tc = [];
  for (let k = 0; k < 8; k++) tc.push(niche(c, 22.5 + 45 * k - 22.5, a / 2, 0, 1.0, nap(3.4), nap(5.0), 0.3));
  tower = tower.subtract(Manifold.union(tc)).rotate([0, 0, OCT.rot]).translate([...OCT.c, 0]);
}

const nodes = [["building:paleis", palace], ["building:voorgebouw", voor], ["building:torentje", tower]];
const all = Manifold.union([palace, voor, tower]);

const META = {
  name: "Kasteel van Breda",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 46.2,
  replacesBuildings: ["0758100000023912", "0758100000023913", "0758100000023914", "0758100000024029", "0758100000024027"],
  plate: true, // drie losse delen: ook een STL met grondplaat
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (112576, 400456), midden op de binnenplaats, op het maaiveld van het voorplein tussen de westvleugels (NAP +2,3 m), +X langs de noord- en zuidvleugel (11,5 graden vanaf de RD-X-as) en +Y loodrecht daarop. Drie nodes uit dakvlakken en bouwdelen: building:paleis, het renaissancepaleis van Hendrik III rond de binnenplaats (vier vleugels met schilddaken van 45 graden en een opgewipte dakvoet, kroonlijst op een kraag, plint, de twee achtkantige hoektorentjes met spits en bol aan de Parade, de Henricuspoort, schoorstenen, drie vensterrijen en arcaden op de binnenplaats); building:voorgebouw, het voorgebouw aan de zuidelijke gracht met de Stadhouderspoort (fronton, pilasters, dakkapel), de vierkante toren met tentdak, de schuine vleugel met een steil zadeldak en het hoekpaviljoen in de gracht met een dak rond een lichthof; building:torentje, het achtkantige torentje op de hoek van de Parade. Onderkant op NAP -0,5 m, onder het water van de slotgracht; alle vlakken wijzen omhoog of staan verticaal, op de kraag onder de kroonlijst na. Vervangt de PDOK-reconstructie van vijf BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { ridgeNapM: 24.25, eaveNapM: EAVE_OUT + GROUND_NAP, turretTopNapM: TURRET.tip + GROUND_NAP, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Kasteel_van_Breda",
    "PDOK BAG panden 0758100000023912 (paleis), 0758100000023913 (voorgebouw), 0758100000023914 (toren en schuine vleugel), 0758100000024029 (hoekpaviljoen), 0758100000024027 (achtkantig torentje), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: dakvlakken, nokken, goten, torentjes, schoorstenen en het maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR) en Wikimedia Commons-foto's vanaf de oostkant (Parade), de binnenplaats, het Kasteelplein en de westelijke gracht",
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

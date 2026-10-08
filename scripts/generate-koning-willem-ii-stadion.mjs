// Genereert een gedetailleerd, gesloten 3D-model van het Koning Willem II Stadion
// in Tilburg (Goirleseweg, thuisstadion van Willem II, geopend 1995, ontwerp Buro
// Bollen, hoofdgebouw uitgebreid in 2000). Het model vervangt de PDOK-reconstructie
// van de vier BAG-panden van het stadion (de hoofdtribune met het hoofdgebouw, de
// noordwesthoek met de westhelft van de KingSide, de zuidwesthoek en een aanbouw in
// de Goirlese kant); de rest van de ring is geen BAG-pand en staat in PDOK niet.
//
// Opbouw, alles uit vlakken en convexe rompen van doorsneden (geen hoogteveld):
// - de ring van de KingSide (noord), de lange zijde (oost), de Goirlese kant (zuid)
//   en de vier hoeken: één doorsnede (ρ, z) die langs een afgeronde rechthoek wordt
//   uitgetrokken, met de zitrang in acht treden die onder het dak open blijft, de
//   achterwand met de glazen pui onder de luifel, en de dakplaat (fascia van 2 m aan
//   de veldkant, plaat van 1,6 m, luifel die achter de gevel omlaag buigt). Het dak
//   golft langs de ring: tussen hoge, vlakke vakken van één travee (8,7 m) hangt het
//   dak in holle bogen van twee of drie traveeën 1,4 m door (AHN);
// - 54 betonnen pylonen langs de achtergevel die 3,5 m boven het dak uitsteken, met
//   op elke pylon een tuivin (de blauwe stalen trekstangen) schuin naar de voorrand;
// - de hoofdtribune (west) met de onderste rang in zes treden, de glazen gevel van de
//   businessboxen in twee rijen raamnissen, het licht gebogen dak met schuine neus
//   (+14,4 m in het midden, +13,6 m aan de einden) en een kilgoot op de pylonlijn,
//   14 pylonen met tuivinnen naar voren en naar achteren, en daarachter het bakstenen
//   hoofdgebouw (+12,8 m) met drie rijen raamnissen, een verdiepte pui op de begane
//   grond en twee installaties op het dak;
// - de twee schermen aan de voorrand van de KingSide en de Goirlese kant;
// - vier vakwerk-lichtmasten van +44,4 m op de hoeken met een lampenbank naar het
//   veld;
// - de overdekte loopbrug met trappenhuis aan de noordoosthoek, de toegangspoorten
//   achter de KingSide en de Goirlese kant, de lage aanbouwen achter de westhelft van
//   de KingSide en de kiosken achter de lange zijde.
// Alle maten zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL in
// millimeters op 1:<schaal>.
//
//   node scripts/generate-koning-willem-ii-stadion.mjs              # 1:1000 (standaard)
//   node scripts/generate-koning-willem-ii-stadion.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van het veld (RD 132774,37, 394904,76), z = 0
// op het maaiveld rond het stadion (NAP circa +15,7 m), Z omhoog. +X (u) loopt langs
// de lengteas van het veld naar het noordnoordwesten, naar de KingSide (RD-richting
// 95,75 graden, uit de randen van de veldopening in het AHN), +Y (v) dwars daarop
// naar het westzuidwesten, naar de hoofdtribune.
//
// Onderkant: het veld ligt 0,6 m en de droge gracht rond het veld 2,1 m onder het
// maaiveld (AHN; ook het PDOK-terrein zakt daar 2,1 m weg). Daarom staan alle
// onderdelen op een vlakke onderkant van 2,5 m onder het maaiveld (BASE = -2,5),
// zodat de voorkant van de tribunes in de gracht doorloopt en nergens boven het
// PDOK-terrein zweeft; rondom zit de voet dan in het terrein.
//
// Overhang: de dakplaten, de luifels, de neus van de hoofdtribune, de schermen en de
// lampenbanken hangen uit (ondervlakken onder 45 graden boven OVERHANG_MIN_Z); onder
// die hoogte blijft elk ondervlak steiler dan 45 graden (de bovenkant van de nissen
// ligt erboven). De export vult de uitkragingen op bij het printen.
//
// Bronnen: BAG (vervangen panden 0855100000283413, 0855100000196810,
// 0855100000705438 en 0855100000818422; contouren voor de hoofdtribune u -57,4 tot
// 57,4 m en v 46,4 tot 81,4 m); AHN DSM/DTM 0,5 m (PDOK WCS) voor de veldopening
// (voorrand van het dak op u = ±63,4 en v = ±46,0 m, hoekstraal 7 m), de gracht, de
// buitenrand van het dak (u = ±84,2, v = -66,6 m, hoekstraal circa 27 m), de
// achtergevel (pylonen op u = ±80,5 en v = -64 m), het dakprofiel (voorrand +13,65 m,
// helling 1:16 naar achteren, holle bogen van 1,4 m), de pylontoppen (+15,5 tot
// +17,6 m), de hoofdtribune (dak +14,4/+13,6 m vóór, kilgoot +12,6 m op v = 63,5 m,
// achterrand +14,0 m op v = 73,3 m, hoofdgebouw +12,8 m), de lichtmasten (+44,4 m),
// de loopbrug (+8 naar +6 m, trappenhuis +10 m), de poorten en aanbouwen; PDOK
// luchtfoto (8 cm) voor de pylonen, de tuien, de hoekwaaiers en de dakopbouwen;
// foto's (Wikimedia Commons: Willem II stadion.jpg, Willem II Stadion - tribunes.jpg;
// stadiumguide.com en stadiumdb.com; de fotoserie van Marco Magielse op eredivisie.nl
// uit 2018) voor de pylonen met de stalen tuien, de golvende fascia voor en achter,
// de zitrang onder het dak, de glazen gevel van de businessboxen, de bakstenen gevel
// van het hoofdgebouw, de schermen en de vakwerkmasten; Wikipedia (15.220 plaatsen).
// Geschat: de treden van de zitrang (8 treden van +1,0 tot +7,6 m, de hoofdtribune 6
// treden tot +5,6 m), de onderkant en dikte van de dakplaat, de doorsnede van de
// pylonen en tuivinnen, de afmetingen van de schermen, de doorsnede en lampenbank van
// de masten, en de raamnissen. Weggelaten: de reclameborden, de stoelen, hekken en
// trappen op de rang, de doorzichtige strook aan de voorrand van het noord- en
// zuiddak (die als dak is gemodelleerd), de dakgoten, de afzonderlijke staven van de
// tuien (als dichte vin van 0,9 m), de luidsprekers en camera's onder het dak, het
// logo op het hoofdgebouw en het standbeeld voor de ingang (te fijn voor 1:1000).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "koning-willem-ii-stadion");
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
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
const hull = (pts) => Manifold.hull(pts);
// Lineaire interpolatie van een polylijn (xs stijgend) op positie x.
const lerpAt = (xs, zs, x) => {
  if (x <= xs[0]) return zs[0];
  for (let i = 1; i < xs.length; i++) {
    if (x <= xs[i]) return zs[i - 1] + ((zs[i] - zs[i - 1]) * (x - xs[i - 1])) / (xs[i] - xs[i - 1]);
  }
  return zs[zs.length - 1];
};
const deg = Math.PI / 180;

const SLUG = "koning-willem-ii-stadion";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP circa +15,7 m) ----------
const ORIGIN = [132774.37, 394904.76];
const X_AXIS = [-0.100188, 0.994969]; // RD-richting 95,75 graden, langs het veld naar de KingSide
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de bemonsteringspunten (de Goirleseweg-kant, zuid).
const GROUND_HEIGHT = 59.44;
// Gemeenschappelijke vlakke onderkant, 2,5 m onder het maaiveld (de gracht ligt op -2,1 m).
const BASE = -2.5;
// Overlap tussen aangrenzende stukken (rakende vlakken laten spleten achter).
const OVERLAP = 0.02;

// De ring (noord, oost, zuid en de vier hoeken) is één doorsnede in ρ, de afstand tot de
// kernrechthoek u ±57,0 bij v ±39,5 m: langs de rechte zijden loodrecht op de zijde, in de
// hoeken radiaal vanuit het hoekpunt van de kernrechthoek. Zo liggen de voorrand van de
// tribune (ρ = 5,2: u = ±62,2, v = -44,7), de voorrand van het dak (6,45: ±63,45 en -45,95),
// de achtergevel (24,0: ±81,0 en -63,5) en de buitenrand van de luifel (27,15: ±84,15 en
// -66,65) op afgeronde rechthoeken, zoals in het AHN.
const CORE = { u: 57.0, v: 39.5 };
const RHO = { stand: 5.2, wall: 23.0, facade: 24.0, edge: 27.15 };
// Zitrang: acht treden van de voorrand tot de achterwand, van +1,0 tot +7,6 m (de eerste trede boven het PDOK-terrein, dat onder de lange zijde tot +0,6 m oploopt).
const RAKE = { steps: 8, z0: 1.0, z1: 7.6 };
// Dakplaat per stuk [ρ0, ρ1, boven0, boven1, onder0, onder1]: de fascia (2,0 m) aan de
// veldkant, de plaat (1,6 m, helling 1:16 naar achteren), de luifel achter de gevel en de
// omgebogen achterrand (AHN: voorrand +13,65 m, gevel +12,6 m, rand +10,4 m).
const ROOF = [
  [6.45, 7.45, 13.65, 13.59, 11.65, 11.59],
  [7.45, 24.0, 13.59, 12.6, 11.99, 11.0],
  [24.0, 25.6, 12.6, 12.0, 11.0, 10.5],
  [25.6, 27.15, 12.0, 10.4, 10.5, 9.4],
];
const roofTop = (rho) => lerpAt([6.45, 24.0, 25.6, 27.15], [13.65, 12.6, 12.0, 10.4], rho);
// Golvend dak: hoge vlakke vakken (per zijde in u of v, in de hoeken in graden vanaf de
// noord- of zuidzijde) en daartussen holle bogen die SAG m doorhangen (AHN, 0,5 m).
const SAG = 1.4;
const HIGH = {
  corner: [[36, 54]],
  north: [[21.75, 30.45], [-4.35, 4.35], [-30.45, -21.75]],
  east: [[39.15, 47.85], [13.05, 21.75], [-21.75, -13.05], [-47.85, -39.15]],
};
// Pylonen (betonnen kolommen langs de achtergevel, 1,2 m breed): per rechte zijde de
// langscoördinaat, in de hoeken de hoek; de top loopt schuin op van +15,2 m aan de
// binnenkant naar +16,2 m aan de buitenkant (AHN +15,5 tot +17,6 m).
const BAY = 8.7;
const PYLON_N = [-39.15, -30.45, -21.75, -13.05, -4.35, 4.35, 13.05, 21.75, 30.45, 39.15];
const PYLON_E = [-56.55, -47.85, -39.15, -30.45, -21.75, -13.05, -4.35, 4.35, 13.05, 21.75, 30.45, 39.15, 47.85, 56.55];
const PYLON_CORNER = [18, 36, 54, 72];
const PYLON = { width: 1.2, base: [23.6, 25.8], top: [23.8, 25.2], zIn: 15.2, zOut: 16.2 };
// Tuivin op elke pylon: van de pylon schuin omlaag naar het dak, 14,5 m naar voren.
const FIN = { width: 0.9, front: 9.5, back: 24.2, top: 15.7 };
// Glazen pui in de achtergevel onder de luifel, tussen de pylonen.
const PUI = { z: [0.5, 3.5], depth: 0.45 };

// Hoofdtribune (west): langs u van -57,6 tot 57,6 m.
const MAIN = {
  u: [-57.6, 57.6],
  front: 44.6, // voorrand van de onderste rang (gracht tot v = 44,5 m)
  rake: { steps: 6, z0: 1.0, z1: 5.6 },
  boxes: 57.5, // glazen gevel van de businessboxen
  nose: [46.2, 10.2], // onderkant van de schuine dakneus
  roofFront: 47.7, // voorrand van het dakvlak
  frontEnd: 13.6, // dakrand aan de einden
  frontMid: 14.4, // dakrand in het midden
  valley: [63.5, 12.6], // kilgoot op de pylonlijn
  roofBack: [73.3, 14.0], // achterrand van het tribunedak
  back: 81.4, // westgevel van het hoofdgebouw (BAG)
  building: 12.8, // plat dak van het hoofdgebouw
};
const MAIN_PYLONS = PYLON_E; // 14 pylonen op v = 63,5 m, zelfde steek als de lange zijde
const MAIN_PYLON = { v: [62.4, 64.6], vTop: [62.8, 64.2], zFront: 16.8, zBack: 17.4 };
// Raamnissen (0,35 m diep): de gevel van de businessboxen (twee rijen, 2,0 m breed op 2,9 m)
// en de westgevel van het hoofdgebouw (drie verdiepingen, 1,0 m breed op 2,7 m).
const BOX_WINDOWS = { rows: [[6.3, 8.1], [8.9, 10.7]], width: 2.0, step: 2.9, depth: 0.35 };
const MAIN_WINDOWS = { rows: [[4.2, 6.0], [7.2, 9.0], [10.0, 11.6]], width: 1.0, step: 2.7, depth: 0.35 };
const MAIN_PUI = { u: [-45, 45], z: [-0.3, 3.2], depth: 0.8 };
const MAIN_INSTALLATIONS = [[-50, -46, 76.5, 79.5], [43, 48, 76.5, 79.5]];

// Schermen aan de voorrand (KingSide midden, Goirlese kant bij de zuidwesthoek).
const SCREENS = [
  { side: "north", v: [-5, 4], z: [9.0, 14.3] },
  { side: "south", v: [21, 30], z: [9.0, 14.3] },
];
// Lichtmasten: hart van de lampenbank uit het AHN, top +44,4 m.
const MASTS = [[79.75, -55.75], [-80.35, -55.75], [82.1, 49.25], [-80.2, 48.4]];
const MAST_TOP = 44.4;
// Loopbrug met trappenhuis aan de noordoosthoek: as vanaf (75,6, -59,6) onder -40 graden.
const BRIDGE = { start: [75.6, -59.6], angle: -40, narrow: { s: [-4, 13.5], half: 1.75, z: [8.0, 6.0] }, tower: { s: [13.5, 18.75], t: [-9, 1.5], z: 10.0 } };
// Toegangspoorten, aanbouwen en kiosken tegen de achtergevel onder de luifel: [u0, u1, v0, v1, top].
const ANNEXES = [
  ...[-26, 0, 26].map((v) => [80.9, 86.8, v - 2, v + 2, 4.2]),
  ...[-26, 0, 26].map((v) => [-86.8, -80.9, v - 2, v + 2, 2.6]),
  [80.9, 86.3, 4.5, 21.8, 5.0],
  [80.9, 86.3, 30.7, 39.3, 5.0],
  ...[[16, 19.5], [42, 46], [-19.5, -16], [-46, -42]].map(([u0, u1]) => [u0, u1, -68.5, -63.4, 3.0]),
];
// Maaiveld op de straten en pleinen rond het stadion (PDOK 59,44 tot 60,10 m ellipsoïdisch).
const GROUND_SAMPLES = [[100, 0], [95, -80], [0, -76], [-95, -70], [-98, 0], [0, 92]];
// Naar beneden gerichte vlakken boven deze hoogte zijn bedoelde uitkragingen.
const OVERHANG_MIN_Z = 3.0;

// ---------- de ring ----------
// Stations langs de ring, van het westeinde van de noordwesthoek via noord, oost en zuid
// naar het westeinde van de zuidwesthoek: o = punt op de kernrechthoek, d = richting
// naar buiten, part en c = zijde en coördinaat (u, v of hoek in graden).
const stations = [];
const cornerStations = (part, center, dirOf, from, to) => {
  const n = Math.round(Math.abs(to - from) / 4.5);
  for (let i = 0; i <= n; i++) {
    const a = from + ((to - from) * i) / n;
    stations.push({ part, c: a, o: center, d: dirOf(a * deg) });
  }
};
const sideGrid = (end) => {
  // Langscoördinaten van +end naar -end: het einde, dan elke kwart travee vanaf de buitenste pylon.
  const first = end > 39.5 ? 56.55 : 39.15;
  const list = [end];
  for (let x = first; x >= -first - 1e-6; x -= BAY / 4) list.push(+x.toFixed(4));
  list.push(-end);
  return list;
};
cornerStations("nw", [CORE.u, CORE.v], (a) => [Math.cos(a), Math.sin(a)], 90, 0);
for (const v of sideGrid(CORE.v)) stations.push({ part: "north", c: v, o: [CORE.u, v], d: [1, 0] });
cornerStations("ne", [CORE.u, -CORE.v], (a) => [Math.cos(a), -Math.sin(a)], 0, 90);
for (const u of sideGrid(CORE.u)) stations.push({ part: "east", c: u, o: [u, -CORE.v], d: [0, -1] });
cornerStations("se", [-CORE.u, -CORE.v], (a) => [-Math.sin(a), -Math.cos(a)], 0, 90);
for (const v of sideGrid(CORE.v).reverse()) stations.push({ part: "south", c: v, o: [-CORE.u, v], d: [-1, 0] });
cornerStations("sw", [-CORE.u, CORE.v], (a) => [-Math.cos(a), Math.sin(a)], 0, 90);
// Dubbele stations op de overgangen weg.
for (let i = stations.length - 1; i > 0; i--) {
  const a = stations[i];
  const b = stations[i - 1];
  if (Math.hypot(a.o[0] + a.d[0] - b.o[0] - b.d[0], a.o[1] + a.d[1] - b.o[1] - b.d[1]) < 1e-6) stations.splice(i, 1);
}
// Ringcoördinaat t: booglengte langs de middellijn op ρ = 15.
const at = (st, rho) => [st.o[0] + st.d[0] * rho, st.o[1] + st.d[1] * rho];
stations.forEach((st, i) => {
  st.t = i === 0 ? 0 : stations[i - 1].t + Math.hypot(...at(st, 15).map((c, k) => c - at(stations[i - 1], 15)[k]));
});
const T_END = stations[stations.length - 1].t;
const tOf = (part, c) => {
  const st = stations.find((s) => s.part === part && Math.abs(s.c - c) < 1e-3);
  if (!st) throw new Error(`geen station ${part} ${c}`);
  return st.t;
};
// Hoge vakken in t, plus gespiegelde vakken voorbij beide westeinden (daar hangt het dak het diepst).
const highs = [];
for (const part of ["nw", "north", "ne", "east", "se", "south", "sw"]) {
  const list = part.length === 2 ? HIGH.corner : part === "east" ? HIGH.east : HIGH.north;
  for (const [a, b] of list) {
    const ta = tOf(part, a);
    const tb = tOf(part, b);
    highs.push([Math.min(ta, tb), Math.max(ta, tb)]);
  }
}
highs.sort((a, b) => a[0] - b[0]);
highs.unshift([-highs[0][1], -highs[0][0]]);
const lastHigh = highs[highs.length - 1];
highs.push([2 * T_END - lastHigh[1], 2 * T_END - lastHigh[0]]);
const sagAt = (t) => {
  for (let i = 0; i + 1 < highs.length; i++) {
    const [a, b] = highs[i];
    if (t >= a - 1e-6 && t <= b + 1e-6) return 0;
    const q = highs[i + 1][0];
    if (t > b && t < q) return (SAG * 4 * (t - b) * (q - t)) / (q - b) ** 2;
  }
  return 0;
};
stations.forEach((st) => (st.sag = sagAt(st.t)));

// De convexe stukken van de doorsnede (ρ, z): de treden, de achterwand en de vier delen van
// de dakplaat (met de doorhang van het station). Elk stuk loopt 2 cm over in zijn buur.
const profileQuads = (sag) => {
  const e = OVERLAP;
  const quads = [];
  const { steps, z0, z1 } = RAKE;
  for (let j = 0; j < steps; j++) {
    const a = RHO.stand + ((RHO.wall - RHO.stand) * j) / steps - (j > 0 ? e : 0);
    const b = RHO.stand + ((RHO.wall - RHO.stand) * (j + 1)) / steps + e;
    const z = z0 + ((z1 - z0) * j) / (steps - 1);
    quads.push([[a, BASE], [b, BASE], [b, z], [a, z]]);
  }
  const u0 = lerpAt([7.45, 24.0], [11.99, 11.0], RHO.wall) - sag;
  quads.push([[RHO.wall - e, BASE], [RHO.facade, BASE], [RHO.facade, 11.0 - sag + 0.3], [RHO.wall - e, u0 + 0.3]]);
  ROOF.forEach(([r0, r1, t0, t1, b0, b1], i) => {
    const a = r0 - (i > 0 ? e : 0);
    const b = r1 + (i < ROOF.length - 1 ? e : 0);
    quads.push([[a, b0 - sag], [b, b1 - sag], [b, t1 - sag], [a, t0 - sag]]);
  });
  return quads;
};
const ringPieces = [];
for (let k = 0; k + 1 < stations.length; k++) {
  const A = stations[k];
  const B = stations[k + 1];
  const ma = at(A, 15);
  const mb = at(B, 15);
  const l = Math.hypot(mb[0] - ma[0], mb[1] - ma[1]) || 1;
  const tx = (mb[0] - ma[0]) / l;
  const ty = (mb[1] - ma[1]) / l;
  const qa = profileQuads(A.sag);
  const qb = profileQuads(B.sag);
  qa.forEach((q, i) => {
    const pts = [];
    for (const [r, z] of q) {
      const [x, y] = at(A, r);
      pts.push([x - tx * OVERLAP, y - ty * OVERLAP, z]);
    }
    for (const [r, z] of qb[i]) {
      const [x, y] = at(B, r);
      pts.push([x + tx * OVERLAP, y + ty * OVERLAP, z]);
    }
    ringPieces.push(hull(pts));
  });
}

// Pylonen en tuivinnen: per pylon een kader (o, d) zoals een station, met de doorhang ter plaatse.
const frames = [];
const sideFrame = (part, c) => {
  const t = tOf(part, c);
  const st = stations.find((s) => s.part === part && Math.abs(s.c - c) < 1e-3);
  return { o: st.o, d: st.d, sag: sagAt(t) };
};
for (const v of PYLON_N) frames.push(sideFrame("north", v), sideFrame("south", v));
for (const u of PYLON_E) frames.push(sideFrame("east", u));
for (const part of ["nw", "ne", "se", "sw"]) for (const a of PYLON_CORNER) frames.push(sideFrame(part, a));
const framePoint = (f, rho, w, z) => [f.o[0] + f.d[0] * rho - f.d[1] * w, f.o[1] + f.d[1] * rho + f.d[0] * w, z];
const pylons = [];
for (const f of frames) {
  const h = PYLON.width / 2;
  pylons.push(
    hull([
      ...[-h, h].flatMap((w) => [framePoint(f, PYLON.base[0], w, BASE), framePoint(f, PYLON.base[1], w, BASE)]),
      ...[-h, h].flatMap((w) => [framePoint(f, PYLON.top[0], w, PYLON.zIn), framePoint(f, PYLON.top[1], w, PYLON.zOut)]),
    ]),
  );
  const fw = FIN.width / 2;
  const zf = roofTop(FIN.front) - f.sag;
  const zb = roofTop(FIN.back) - f.sag;
  pylons.push(
    hull(
      [-fw, fw].flatMap((w) => [
        framePoint(f, FIN.front, w, zf - 0.3),
        framePoint(f, FIN.front, w, zf + 0.6),
        framePoint(f, FIN.back, w, zb - 0.3),
        framePoint(f, FIN.back, w, FIN.top),
      ]),
    ),
  );
}
// Glazen pui in de achtergevel tussen de pylonen (rechte zijden).
const puiCuts = [];
const puiBays = (part, list) => {
  for (let i = 0; i + 1 < list.length; i++) {
    const a = list[i] + PYLON.width / 2 + 0.9;
    const b = list[i + 1] - PYLON.width / 2 - 0.9;
    const st = stations.find((s) => s.part === part);
    // Geen pui achter een aanbouw die het hele vak afdekt (dan bleef een holte ingesloten).
    const sideOf = part === "north" ? 1 : part === "south" ? -1 : 0;
    const covered = ANNEXES.some(([u0, u1, v0, v1]) =>
      sideOf ? Math.sign(u0 + u1) === sideOf && v0 <= a && v1 >= b : v1 < 0 && u0 <= a && u1 >= b,
    );
    if (covered) continue;
    const corners = [];
    for (const c of [a, b]) {
      for (const r of [RHO.facade - PUI.depth, RHO.facade + 0.5]) {
        const base = part === "east" ? [c, -CORE.v] : [st.o[0], c];
        for (const z of PUI.z) corners.push([base[0] + st.d[0] * r, base[1] + st.d[1] * r, z]);
      }
    }
    puiCuts.push(hull(corners));
  }
};
puiBays("north", PYLON_N);
puiBays("south", PYLON_N);
puiBays("east", PYLON_E);

// Schermen aan de voorrand.
const screens = SCREENS.map(({ side, v, z }) => {
  const s = side === "north" ? 1 : -1;
  const u0 = s * (CORE.u + 5.95);
  const u1 = s * (CORE.u + 7.45);
  return box(Math.min(u0, u1), Math.max(u0, u1), v[0], v[1], z[0], z[1]);
});

const ring = Manifold.union([...ringPieces, ...pylons, ...screens]).subtract(Manifold.union(puiCuts));

// ---------- de hoofdtribune ----------
const mainFront = (u) => MAIN.frontEnd + (MAIN.frontMid - MAIN.frontEnd) * (1 - (u / MAIN.u[1]) ** 2);
// Bovenkant van het tribunedak op (u, v): van de voorrand naar de kilgoot, dan op naar de achterrand.
const mainTop = (u, v) =>
  v <= MAIN.valley[0]
    ? mainFront(u) + ((MAIN.valley[1] - mainFront(u)) * (v - MAIN.roofFront)) / (MAIN.valley[0] - MAIN.roofFront)
    : MAIN.valley[1] + ((MAIN.roofBack[1] - MAIN.valley[1]) * (v - MAIN.valley[0])) / (MAIN.roofBack[0] - MAIN.valley[0]);
const mainQuads = (u) => {
  const e = OVERLAP;
  const quads = [];
  const { steps, z0, z1 } = MAIN.rake;
  for (let j = 0; j < steps; j++) {
    const a = MAIN.front + ((MAIN.boxes - MAIN.front) * j) / steps - (j > 0 ? e : 0);
    const b = MAIN.front + ((MAIN.boxes - MAIN.front) * (j + 1)) / steps + e;
    const z = z0 + ((z1 - z0) * j) / (steps - 1);
    quads.push([[a, BASE], [b, BASE], [b, z], [a, z]]);
  }
  const vb = MAIN.boxes - e;
  // Businessboxen en tribunegebouw onder het dak tot de kilgoot, en van de kilgoot tot de achterrand.
  quads.push([[vb, BASE], [MAIN.valley[0] + e, BASE], [MAIN.valley[0] + e, mainTop(u, MAIN.valley[0] + e)], [vb, mainTop(u, vb)]]);
  quads.push([[MAIN.valley[0] - e, BASE], [MAIN.roofBack[0] + e, BASE], [MAIN.roofBack[0] + e, MAIN.roofBack[1]], [MAIN.valley[0] - e, mainTop(u, MAIN.valley[0] - e)]]);
  // Uitkragend dak met schuine neus (1,6 m dik bij de gevel van de boxen).
  quads.push([MAIN.nose, [MAIN.boxes + e, mainTop(u, MAIN.boxes) - 1.6], [MAIN.boxes + e, mainTop(u, MAIN.boxes + e)], [MAIN.roofFront, mainFront(u)]]);
  // Hoofdgebouw.
  quads.push([[MAIN.roofBack[0] - e, BASE], [MAIN.back, BASE], [MAIN.back, MAIN.building], [MAIN.roofBack[0] - e, MAIN.building]]);
  return quads;
};
const mainStations = [MAIN.u[0], ...PYLON_E, MAIN.u[1]].flatMap((u, i, list) => (i + 1 < list.length ? [u, (u + list[i + 1]) / 2] : [u]));
const mainPieces = [];
for (let k = 0; k + 1 < mainStations.length; k++) {
  const ua = mainStations[k] - (k > 0 ? OVERLAP : 0);
  const ub = mainStations[k + 1] + (k + 2 < mainStations.length ? OVERLAP : 0);
  const qa = mainQuads(mainStations[k]);
  const qb = mainQuads(mainStations[k + 1]);
  qa.forEach((q, i) => mainPieces.push(hull([...q.map(([v, z]) => [ua, v, z]), ...qb[i].map(([v, z]) => [ub, v, z])])));
}
// Pylonen op de kilgoot met tuivinnen naar voren (tot v = 50) en naar achteren (tot v = 71).
for (const u of MAIN_PYLONS) {
  const h = PYLON.width / 2;
  mainPieces.push(
    hull([
      ...[-h, h].flatMap((du) => [[u + du, MAIN_PYLON.v[0], 10], [u + du, MAIN_PYLON.v[1], 10]]),
      ...[-h, h].flatMap((du) => [[u + du, MAIN_PYLON.vTop[0], MAIN_PYLON.zFront], [u + du, MAIN_PYLON.vTop[1], MAIN_PYLON.zBack]]),
    ]),
  );
  const fw = FIN.width / 2;
  for (const [v0, v1] of [[50.0, 62.6], [71.0, 64.4]]) {
    mainPieces.push(
      hull(
        [-fw, fw].flatMap((du) => [
          [u + du, v0, mainTop(u, v0) - 0.3],
          [u + du, v0, mainTop(u, v0) + 0.6],
          [u + du, v1, mainTop(u, v1) - 0.3],
          [u + du, v1, MAIN_PYLON.zFront - 0.3],
        ]),
      ),
    );
  }
}
for (const [u0, u1, v0, v1] of MAIN_INSTALLATIONS) mainPieces.push(box(u0, u1, v0, v1, MAIN.building - OVERLAP, MAIN.building + 1.8));
const mainCuts = [];
for (let u = -55.1; u <= 55.1 + 1e-6; u += BOX_WINDOWS.step) {
  for (const [z0, z1] of BOX_WINDOWS.rows) {
    mainCuts.push(box(u - BOX_WINDOWS.width / 2, u + BOX_WINDOWS.width / 2, MAIN.boxes - 1, MAIN.boxes + BOX_WINDOWS.depth, z0, z1));
  }
}
for (let u = -54; u <= 54 + 1e-6; u += MAIN_WINDOWS.step) {
  for (const [z0, z1] of MAIN_WINDOWS.rows) {
    mainCuts.push(box(u - MAIN_WINDOWS.width / 2, u + MAIN_WINDOWS.width / 2, MAIN.back - MAIN_WINDOWS.depth, MAIN.back + 1, z0, z1));
  }
}
mainCuts.push(box(MAIN_PUI.u[0], MAIN_PUI.u[1], MAIN.back - MAIN_PUI.depth, MAIN.back + 1, MAIN_PUI.z[0], MAIN_PUI.z[1]));
const mainStand = Manifold.union(mainPieces).subtract(Manifold.union(mainCuts));

// ---------- de lichtmasten ----------
// Vakwerktoren: vier poten van 0,9 m, die van 3,2 naar 2,0 m versmallen, ringbalken om de 6 m
// en kruisdiagonalen, bovenaan een lampenbank van 5,2 bij 1,6 m die naar het veld wijst.
const mast = ([cx, cy], top) => {
  const leg = 0.9;
  const baseW = 3.2;
  const topW = 2.0;
  const zHead = top - 6.0;
  const levels = [BASE, 6.0, 12.0, 18.0, 24.0, 30.0, zHead - 1.0];
  const off = (z) => (baseW + ((topW - baseW) * (z - BASE)) / (zHead - BASE)) / 2 - leg / 2;
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const cube = (x, y, z, s) => corners.flatMap(([dx, dy]) => [[x + dx * s, y + dy * s, z - s], [x + dx * s, y + dy * s, z + s]]);
  const parts = [];
  for (const [sx, sy] of corners) {
    const pts = [];
    for (const z of [BASE, zHead]) for (const [dx, dy] of corners) pts.push([cx + sx * off(z) + (dx * leg) / 2, cy + sy * off(z) + (dy * leg) / 2, z]);
    parts.push(hull(pts));
  }
  for (const z of levels) {
    const o = off(z);
    const z0 = z === BASE ? BASE : z - 0.45;
    const outer = box(cx - o - 0.45, cx + o + 0.45, cy - o - 0.45, cy + o + 0.45, z0, z0 + 0.9);
    parts.push(outer.subtract(box(cx - o + 0.45, cx + o - 0.45, cy - o + 0.45, cy + o - 0.45, z0 - 1, z0 + 2)));
  }
  for (let i = 0; i + 1 < levels.length; i++) {
    const zA = levels[i] + (i === 0 ? 0.9 : 0.45);
    const zB = levels[i + 1] - 0.45;
    for (let c = 0; c < 4; c++) {
      const a = corners[c];
      const b = corners[(c + 1) % 4];
      for (const [from, to] of [[a, b], [b, a]]) {
        const oa = off(zA);
        const ob = off(zB);
        parts.push(hull([...cube(cx + from[0] * oa, cy + from[1] * oa, zA, 0.45), ...cube(cx + to[0] * ob, cy + to[1] * ob, zB, 0.45)]));
      }
    }
  }
  // Lampenbank: een romp van de torenkop naar een brede kast die naar het veld wijst.
  const facing = (Math.atan2(-cy, -cx) * 180) / Math.PI;
  const half = [0.8, 2.6];
  const oh = off(zHead) + leg / 2;
  const flare = hull([
    ...corners.map(([dx, dy]) => [dx * oh, dy * oh, zHead]),
    ...corners.map(([dx, dy]) => [0.4 + dx * half[0], dy * half[1], zHead + 2.2]),
  ]);
  const bank = Manifold.union([flare, box(0.4 - half[0], 0.4 + half[0], -half[1], half[1], zHead + 2.15, top)]).rotate([0, 0, facing]).translate([cx, cy, 0]);
  parts.push(bank);
  return Manifold.union(parts);
};
const masts = MASTS.map((p) => mast(p, MAST_TOP));

// ---------- loopbrug, poorten, aanbouwen en kiosken ----------
const extras = [];
{
  const a = BRIDGE.angle * deg;
  const d = [Math.cos(a), Math.sin(a)];
  const n = [-d[1], d[0]];
  const P = (s, t, z) => [BRIDGE.start[0] + d[0] * s + n[0] * t, BRIDGE.start[1] + d[1] * s + n[1] * t, z];
  const { narrow, tower } = BRIDGE;
  extras.push(
    hull([
      ...[-narrow.half, narrow.half].flatMap((t) => [P(narrow.s[0], t, BASE), P(narrow.s[1] + OVERLAP, t, BASE), P(narrow.s[0], t, narrow.z[0]), P(narrow.s[1] + OVERLAP, t, narrow.z[1])]),
    ]),
  );
  extras.push(hull(tower.s.flatMap((s) => tower.t.flatMap((t) => [P(s, t, BASE), P(s, t, tower.z)]))));
}
for (const [u0, u1, v0, v1, top] of ANNEXES) extras.push(box(u0, u1, v0, v1, BASE, top));

// Naar beneden gerichte vlakken: de dakplaten, luifels, neus, schermen en lampenbanken mogen hoger
// dan OVERHANG_MIN_Z vlakker dan 45 graden hangen; daaronder blijft elk ondervlak steil.
const OVERHANG_OK = (z) => z >= OVERHANG_MIN_Z;
const stadium = Manifold.union([ring, mainStand, ...masts, ...extras]);
// BAG-panden van het stadion: de hoofdtribune met het hoofdgebouw, de noordwesthoek met de westhelft
// van de KingSide, de zuidwesthoek en de aanbouw in de Goirlese kant (2019).
const REPLACED_BUILDINGS = ["0855100000283413", "0855100000196810", "0855100000705438", "0855100000818422"];
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "Koning Willem II Stadion",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: REPLACED_BUILDINGS,
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (132774,37, 394904,76) in het hart van het veld op het maaiveld rond het stadion (NAP circa +15,7 m), +X langs het veld naar het noordnoordwesten (KingSide, RD-richting 95,75 graden) en +Y naar het westzuidwesten (hoofdtribune). Eén node building:stadion: de ring van de KingSide, de lange zijde, de Goirlese kant en de vier hoeken als één doorsnede langs een afgeronde rechthoek (dakvoorrand u ±63,45 en v -45,95 m, buitenrand van de luifel u ±84,15 en v -66,65 m), met een zitrang van acht treden (+1,0 tot +7,6 m) die onder het dak open blijft, de achterwand met een glazen pui onder de luifel en een golvend dak (voorrand +13,65 m, hoge vakken van 8,7 m en holle bogen die 1,4 m doorhangen) op 54 betonnen pylonen met tuivinnen tot +16,2 m; de hoofdtribune met zes treden, de glazen gevel van de businessboxen, een licht gebogen dak (+14,4 m in het midden) met kilgoot en 14 pylonen tot +17,4 m, en het bakstenen hoofdgebouw (+12,8 m) met raamnissen en installaties; twee schermen aan de voorrand; vier vakwerk-lichtmasten van +44,4 m op de hoeken; de overdekte loopbrug met trappenhuis aan de noordoosthoek, de poorten, aanbouwen en kiosken achter de tribunes. Onderkant op 2,5 m onder het maaiveld, omdat het veld en de gracht ervoor tot 2,1 m lager liggen; de daken, luifels en schermen hangen uit (de export vult ze op). Vervangt de PDOK-reconstructie van de vier BAG-panden van het stadion. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 15220,
    fieldOpeningM: [126.9, 91.9],
    roofFrontM: ROOF[0][2],
    roofSagM: SAG,
    mainStandRoofM: [MAIN.frontEnd, MAIN.frontMid, MAIN.valley[1], MAIN.roofBack[1]],
    mainBuildingM: MAIN.building,
    pylonTopM: [PYLON.zOut, MAIN_PYLON.zBack],
    mastTopM: MAST_TOP,
    groundHeightEllipsoidM: GROUND_HEIGHT,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Koning_Willem_II_Stadion",
    "PDOK BAG panden van het stadion (zie replacesBuildings), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: veldopening, gracht, dakprofiel en golf, achtergevel, pylonen, hoofdtribune, hoofdgebouw, lichtmasten, loopbrug en aanbouwen",
    "PDOK luchtfoto (Actueel_orthoHR, 8 cm): pylonen, tuien, hoekwaaiers, dakopbouwen",
    "Wikimedia Commons: Willem II stadion.jpg en Willem II Stadion - tribunes.jpg; foto's op stadiumguide.com, stadiumdb.com en eredivisie.nl (Marco Magielse, 2018): pylonen met stalen tuien, golvende fascia, zitrang onder het dak, businessboxen, hoofdgebouw, schermen en lichtmasten",
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
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(p[0][2], p[1][2], p[2][2]);
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

// Losse delen van het model (genus onder 0 betekent meer dan één stuk).
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
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
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

// Genereert een gedetailleerd, gesloten 3D-model van Stadion Woudestein in Rotterdam
// (thuisstadion van Excelsior, Kralingen; van 2017 tot 2025 Van Donge & De Roo
// Stadion, sinds het seizoen 2025/26 weer Stadion Woudestein). Het model
// vervangt de PDOK-reconstructie van de hoofdtribune en van de kleine panden
// onder de zuidtribune en bestaat uit: de hoofdtribune (Henk Zon-tribune) aan de
// westkant met een zitrang van zes treden onder een dakplaat, de glazen band
// van de lounges achter de bovenste trede, het bakstenen achtergebouw met het
// zwarte glazen volume boven de ingang, raamnissen en een installatie op het dak;
// de zuidtribune en de oosttribune als één L met de overkapte zuidoosthoek (2016),
// elk met een zitrang van vijf treden onder het dak, de lage aanbouw achter de
// zuidtribune met binnenplaatsen, de zuilengang en de dichte noordelijke gevel
// van de oosttribune met de buitentrap naar het park; de noordtribune met het
// scorebord op de dakrand en de lage aanbouw in de noordwesthoek; de betonnen
// pylonen achter elk dak met twee tuidraden
// naar de dakplaat; de dug-outs langs het veld en vier vakwerk-lichtmasten op de
// hoeken. Alles is opgebouwd uit blokken, prisma's en convexe rompen van vlakken
// (geen hoogteveld). Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus binaire STL's
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-stadion-woudestein.mjs              # 1:1000 (standaard)
//   node scripts/generate-stadion-woudestein.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening, Z omhoog, z = 0 op het
// maaiveld van het park ten oosten van het stadion (NAP -1,2 m, het laagste
// bemonsterde maaiveld); het veld en de parkeerplaats aan de westkant liggen
// 2,2 tot 2,3 m hoger (NAP +1,0 tot +1,1 m). +X loopt langs de lengteas van het
// veld naar het noordnoordoosten (RD-richting (0,3883, 0,9215), 67,15 graden),
// +Y dwars daarop naar het westnoordwesten, naar de hoofdtribune.
//
// Overhang: de dakplaten, de tuidraden, het glazen volume van het achtergebouw,
// het scorebord en de lampenbanken hangen uit (ondervlakken onder 45 graden
// boven OVERHANG_MIN_Z); daaronder blijft elk ondervlak steiler dan 45 graden.
// De export vult de uitkragingen op bij het printen.
//
// Bronnen: BAG-panden 0599100010029704 (hoofdtribune met achtergebouw, 2000),
// 0599100100015795 (zuidelijke kop van de hoofdtribune, 2020), 0599100010033787 en
// 0599100010014268 (onder de zuidtribune) en 0599100100015796 (achter de
// zuidtribune, 2018); AHN DSM/DTM 0,5 m (PDOK WCS) voor de hoofdas (de voorranden
// van de vier tribunes, 67,15 graden), de voorranden (hoofdtribune v = 40,6 m,
// oost -40,8 m, zuid u = -57,4 m, noord 57,6 m), de dakhoogtes (hoofdtribune NAP
// +9,80 m aan de voorrand tot +9,55 m aan de achterrand op v = 51,0 m, de andere
// drie tribunes NAP +8,45 tot +8,2 m), het achtergebouw (NAP +8,3 m, gevel op
// v = 59,3 m, het glazen volume tot 61,0 en 62,6 m), de aanbouw achter de
// zuidtribune (NAP +5,7 tot +6,9 m), de pylonen (steek 8,7 m) en de lichtmasten
// (NAP +32,3 tot +34,2 m); PDOK luchtfoto (Actueel_orthoHR) voor de plaats van de
// pylonen, de dug-outs, het scorebord op de noordtribune en de vorm van de
// zuidoosthoek; Wikimedia Commons-foto's (Rotterdam stadion woudestein, Van Dongen
// de Roo Stadion, KNVB finale vrouwen 18-19) en foto's op stadiumdb.com voor de
// zitrang onder de daken, de lounges, de betonnen pylonen met tuidraden, de
// bakstenen gevel met het zwarte glazen volume, de zuilengang en de buitentrap van
// de oosttribune en de vakwerkmasten; Wikipedia (4.700 plaatsen; twee hoeken
// gedicht in 2016). Geschat: de treden van de zitrang (plaats en hoogte), de
// onderkant van de dakplaten (dikte 1,5 tot 1,65 m), de hoogte van de pylonen boven
// het dak (2,2 tot 2,65 m), de doorsnede van de masten en hun lampenbanken, het
// scorebord, de lengte van de zuilengang van de oosttribune en de buitentrap.
// Weggelaten: de reclameborden langs het veld en op de dakranden, de stoelen, de
// leuningen en trappen op de zitrang, de letters en het clublogo op het
// achtergebouw (dunner dan 0,9 m), de hekken rond het veld en de ballenvangers, de
// haag achter de noordtribune (vegetatie) en de losse panden naast het stadion
// (het clubgebouw uit 1905 achter de zuidwesthoek en het gebouwtje in de
// noordoosthoek blijven de PDOK-reconstructie).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "stadion-woudestein");
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
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const hull = (pts) => Manifold.hull(pts);
// Dakvlak z = a x + b y + c boven een veelhoek (planvergelijking).
const roofPlane = (poly, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, 60).trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Lineaire interpolatie van een polylijn (ns stijgend) op positie n.
const lerpAt = (ns, zs, n) => {
  if (n <= ns[0]) return zs[0];
  for (let i = 1; i < ns.length; i++) {
    if (n <= ns[i]) return zs[i - 1] + ((zs[i] - zs[i - 1]) * (n - ns[i - 1])) / (ns[i] - ns[i - 1]);
  }
  return zs[zs.length - 1];
};
// Balk van 0,9 bij 0,9 m tussen twee punten (romp van twee kubusjes).
const bar = (a, b, half = 0.45) => {
  const cube = ([x, y, z]) => [-1, 1].flatMap((dx) => [-1, 1].flatMap((dy) => [-1, 1].map((dz) => [x + dx * half, y + dy * half, z + dz * half])));
  return hull([...cube(a), ...cube(b)]);
};

const SLUG = "stadion-woudestein";

// ---------- maten (lokaal stelsel, z = hoogte boven NAP -1,2 m) ----------
const GROUND_NAP = -1.2;
const ORIGIN = [95375.87, 436864.47];
const X_AXIS = [0.38832, 0.921525]; // RD-richting 67,15 graden, langs het veld
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het laagste maaiveld.
const BASE = -0.5;
// Overlap tussen aangrenzende stukken (rakende vlakken laten spleten achter).
const OVERLAP = 0.02;
// Het veld ligt op NAP +1,0 m.
const FIELD = 2.2;

// Dwarsdoorsnede per tribune, afstanden n in meters vanaf de voorrand van de
// zitrang (de lijn langs het veld) naar buiten: `w` tot de achterkant van de
// achterwand en de dakrand, de dakplaat (roofN, roofTop: bovenkant, roofUnder:
// onderkant) en de zitrang `rake` = [n begin, n einde (voorvlak van de
// achterwand), z eerste trede, z laatste trede, aantal treden]. Dakhoogtes uit
// het AHN (NAP + 1,2), de zitrang en de onderkant geschat uit foto's.
const SIDE = {
  // Hoofdtribune (Henk Zon-tribune), voorrand v = 40,6 m, dakrand v = 51,0 m.
  main: { w: 10.4, roofN: [0.6, 10.4], roofTop: [11.0, 10.75], roofUnder: [9.35, 9.25], rake: [0.2, 8.6, 3.0, 7.0, 6] },
  // Oosttribune, voorrand v = -40,8 m, dakrand v = -49,3 m.
  east: { w: 8.5, roofN: [0.4, 8.5], roofTop: [9.65, 9.4], roofUnder: [8.1, 7.9], rake: [0.2, 6.4, 2.9, 5.6, 5] },
  // Zuidtribune, voorrand u = -57,4 m, dakrand u = -65,8 m.
  south: { w: 8.4, roofN: [0.6, 8.4], roofTop: [9.65, 9.43], roofUnder: [8.1, 7.93], rake: [0.2, 6.3, 2.9, 5.6, 5] },
  // Noordtribune, voorrand u = 57,6 m (de voorste rij buiten het dak), dakrand u = 66,0 m.
  north: { w: 8.4, roofN: [1.2, 8.4], roofTop: [9.6, 9.45], roofUnder: [8.05, 7.95], rake: [0.2, 6.2, 2.9, 5.6, 5] },
};
// Kader per rechte tribune: (langs a, n vanaf de voorrand) naar (u, v).
const FRAME = {
  main: (a, n) => [a, 40.6 + n],
  east: (a, n) => [a, -40.8 - n],
  south: (a, n) => [-57.4 - n, a],
  north: (a, n) => [57.6 + n, a],
};
// Lengte van de tribunes langs de voorrand (a van ... tot ...).
const SPAN = {
  main: [-49.5, 44.5],
  east: [-52.5, 43.5], // vanaf het eind van de overkapte zuidoosthoek
  south: [-35.9, 46.5], // tot het begin van de zuidoosthoek
  north: [-27.5, 25.5],
};
// De zuidoosthoek: de voorrand loopt in een boog (middelpunt, straal) van de
// zuidtribune naar de oosttribune; de achterkant is afgeschuind (AHN) van
// (-65,8, -38,5) naar (-55,0, -49,3).
const CORNER = { c: [-52.5, -35.9], r: 4.9, back: [[-65.8, -35.9], [-65.8, -38.5], [-55.0, -49.3], [-52.5, -49.3]], segments: 6 };
// De noordwestkop van de zuidtribune is schuin afgesneden langs de lichtmast (AHN).
const SOUTH_CUT = [[-65.9, 39.0], [-60.6, 46.6]];
// Betonnen pylonen achter de daken (luchtfoto en AHN, steek 8,7 m), met twee
// tuidraden naar de dakplaat; hoogte boven de dakrand geschat uit foto's.
const PYLONS = {
  main: { at: [-49.0, ...Array.from({ length: 11 }, (_, k) => -43.6 + 8.78 * k)], n: 10.2, top: 13.4, from: 8.0 },
  east: { at: Array.from({ length: 11 }, (_, k) => 43.5 - 8.7 * k), n: 8.2, top: 11.6, from: BASE },
  south: { at: Array.from({ length: 8 }, (_, k) => -27.0 + 8.65 * k), n: 8.25, top: 11.65, from: BASE },
  north: { at: Array.from({ length: 7 }, (_, k) => Math.min(-27.0 + 8.75 * k, 25.0)), n: 8.25, top: 11.65, from: BASE },
};
const PYLON_HALF = 0.45;
// Waar de tuidraden op het dak landen (deel van de dakdiepte vanaf de voorrand).
const STAY_LANDING = [0.35, 0.65];
// De glazen band van de lounges achter de bovenste trede van de hoofdtribune.
const LOUNGE = { z: [7.4, 8.9], depth: 0.45 };
// De zuilengang aan de parkzijde van de oosttribune (foto): de achterwand ligt 0,7 m
// terug tussen de pylonen, onder een dakrand van 1,8 m; het noordelijke deel is dicht.
const COLONNADE = { a: [-48.0, 15.0], z: [1.8, 7.6], depth: 0.7 };
// Deur en buitentrap naar het park in de dichte gevel van de oosttribune.
const DOOR = { a: [27.0, 29.0], z: [2.2, 4.6], depth: 0.4 };
const STAIR = { a: [26.6, 29.4], landing: 1.4, treads: [[0.95, 1.5], [0.95, 0.8]] };
// Lage aanbouw achter de zuidtribune (u -65,8 tot -69,8 m, lessenaarsdak van +7,4 naar
// +6,2 m) met twee binnenplaatsen; achter de noordwestkop een dieper blok onder het dak.
const ANNEX = { v: [-30.0, 18.0], n: [8.3, 12.4], top: [7.4, 6.2], courts: [[-8.5, -1.5], [9.5, 12.5]] };
const SOUTH_BLOCK = { u: [-68.8, -65.6], v: [25.0, 34.0], top: 9.4 };
// Achtergebouw van de hoofdtribune (BAG 0599100010029704): baksteen tot +5,4 m met
// het zwarte glazen volume erboven, dak op +9,5 m (AHN NAP +8,3 m).
const BUILDING = {
  u: [-39.5, 42.5],
  v: [50.9, 59.3],
  top: 9.5,
  ground: 2.3,
  glass: { u: [-17.0, 19.0], front: 61.0, bottom: 5.4 },
  canopy: { u: [-6.0, 7.0], front: 62.6, top: 9.4 },
  entrance: { u: [-3.0, 4.0], top: 4.9, depth: 0.4 },
  windows: { at: [-37, -34, -31, -28, -25, -22, -15, -12, -9, 9, 12, 15, 22, 25, 28, 31, 34, 37, 40], width: 1.4, z: [3.0, 4.6], depth: 0.35 },
  plant: { u: [-9.0, 1.0], v: [53.0, 55.5], top: 12.0 },
  raised: { u: [1.0, 20.0], v: [51.2, 55.0], top: 10.2 },
};
// De zuidelijke kop van de hoofdtribune (BAG 0599100100015795, 2020): het dak loopt
// door tot v = 54,0 m.
const MAIN_SOUTH_HEAD = { u: [-49.5, -39.4], v: [50.9, 54.0], top: 10.75 };
// Dug-outs langs de hoofdtribune (luchtfoto).
const DUGOUTS = [[-16.0, -2.5], [3.0, 16.0]];
const DUGOUT = { v: [37.4, 39.4], z: [3.3, 3.8] };
// Scorebord op de dakrand van de noordtribune (luchtfoto: schaduw op het dak; foto's).
const SCOREBOARD = { u: [58.7, 59.6], v: [1.0, 8.0], z: [8.3, 12.3] };
// Lage aanbouw in de noordwesthoek tegen de kop van de noordtribune (luchtfoto: grijs dak;
// AHN NAP +3,7 m in het deel dat toen al stond).
const NW_ANNEX = { u: [59.5, 66.3], v: [25.0, 41.0], top: 4.9 };
// Vakwerk-lichtmasten op de hoeken (AHN: kop tot NAP +34,2, +33,2, +32,3 en +32,3 m).
const MASTS = [
  { at: [-65.2, 42.8], top: 35.4 },
  { at: [-65.5, -41.3], top: 34.4 },
  { at: [59.6, 47.6], top: 33.5 },
  { at: [60.2, -44.8], top: 33.5 },
];
// Maaiveld rondom: park (oost, laagste punt), noordkant, parkeerplaats (west), straat (zuid).
const GROUND_SAMPLES = [[30, -55], [85, 0], [0, 68], [-76, 0]];
// PDOK-maaiveld (ellipsoïdisch) op het laagste bemonsteringspunt, als vaste terugval.
const GROUND_HEIGHT = 42.38;
// Naar beneden gerichte vlakken boven deze hoogte zijn bedoelde uitkragingen
// (dakplaten, tuidraden, glazen volume, scorebord, lampen); daaronder blijft elk
// ondervlak steiler dan 45 graden.
const OVERHANG_MIN_Z = 4.0;

const underAt = (p, n) => lerpAt(p.roofN, p.roofUnder, n);
const topAt = (p, n) => lerpAt(p.roofN, p.roofTop, n);
// De convexe stukken van de doorsnede [n, z]: de treden van de zitrang, de
// achterwand en de dakplaat. Elk stuk loopt 2 cm over in zijn buur.
const profileQuads = (p) => {
  const e = OVERLAP;
  const quads = [];
  const [rn0, rn1, rz0, rz1, steps] = p.rake;
  for (let j = 0; j < steps; j++) {
    const a = rn0 + ((rn1 - rn0) * j) / steps - (j > 0 ? e : 0);
    const b = rn0 + ((rn1 - rn0) * (j + 1)) / steps + e;
    const z = rz0 + ((rz1 - rz0) * j) / (steps - 1);
    quads.push([[a, BASE], [b, BASE], [b, z], [a, z]]);
  }
  const nb = rn1 - e;
  quads.push([[nb, BASE], [p.w, BASE], [p.w, underAt(p, p.w) + 0.3], [nb, underAt(p, nb) + 0.3]]);
  for (let i = 0; i + 1 < p.roofN.length; i++) {
    const a = p.roofN[i] - (i > 0 ? e : 0);
    const b = p.roofN[i + 1] + (i + 2 < p.roofN.length ? e : 0);
    quads.push([[a, underAt(p, a)], [b, underAt(p, b)], [b, topAt(p, b)], [a, topAt(p, a)]]);
  }
  return quads;
};

// Een tribune langs een open polylijn: voorrand front[k], achterkant back[k] (op n = w)
// en de doorsnede params[k]; elk stuk tussen twee punten is de romp van beide doorsneden.
const sweepStand = (front, back, params) => {
  const pieces = [];
  const at = (k, n, p) => {
    const f = n / p.w;
    return [front[k][0] + (back[k][0] - front[k][0]) * f, front[k][1] + (back[k][1] - front[k][1]) * f];
  };
  for (let k = 0; k + 1 < front.length; k++) {
    const dx = front[k + 1][0] - front[k][0];
    const dy = front[k + 1][1] - front[k][1];
    const l = Math.hypot(dx, dy) || 1;
    const qk = profileQuads(params[k]);
    const qn = profileQuads(params[k + 1]);
    qk.forEach((q, i) => {
      const pts = [];
      for (const [n, z] of q) {
        const [x, y] = at(k, n, params[k]);
        pts.push([x - (dx / l) * OVERLAP, y - (dy / l) * OVERLAP, z]);
      }
      for (const [n, z] of qn[i]) {
        const [x, y] = at(k + 1, n, params[k + 1]);
        pts.push([x + (dx / l) * OVERLAP, y + (dy / l) * OVERLAP, z]);
      }
      pieces.push(hull(pts));
    });
  }
  return pieces;
};
const straightStand = (side) => {
  const [a0, a1] = SPAN[side];
  const p = SIDE[side];
  return sweepStand([FRAME[side](a0, 0), FRAME[side](a1, 0)], [FRAME[side](a0, p.w), FRAME[side](a1, p.w)], [p, p]);
};
const sideHull = (side, pts) => hull(pts.map(([a, n, z]) => [...FRAME[side](a, n), z]));
// Kopgevel (0,9 m dik) die de tribune aan het eind sluit, van de voorrand van het dak tot de achterwand.
const endWall = (side, a, dir) => {
  const p = SIDE[side];
  const n0 = Math.max(p.rake[0], p.roofN[0]);
  const a0 = dir > 0 ? a - 0.9 : a;
  const a1 = dir > 0 ? a : a + 0.9;
  return sideHull(side, [a0, a1].flatMap((s) => [[s, n0, BASE], [s, p.w, BASE], [s, p.w, underAt(p, p.w) + 0.3], [s, n0, underAt(p, n0) + 0.3]]));
};
// Pylon (0,9 m) achter de dakrand en twee tuidraden naar de dakplaat.
const pylonParts = (side) => {
  const p = SIDE[side];
  const { at, n, top, from } = PYLONS[side];
  const parts = [];
  for (const a of at) {
    parts.push(sideHull(side, [a - PYLON_HALF, a + PYLON_HALF].flatMap((s) => [[s, n - PYLON_HALF, from], [s, n + PYLON_HALF, from], [s, n - PYLON_HALF, top], [s, n + PYLON_HALF, top]])));
    const head = [...FRAME[side](a, n), top - PYLON_HALF];
    const depth = p.roofN[p.roofN.length - 1] - p.roofN[0];
    for (const f of STAY_LANDING) {
      const nl = p.roofN[0] + depth * f;
      parts.push(bar(head, [...FRAME[side](a, nl), topAt(p, nl) + 0.2]));
    }
  }
  return parts;
};

// ---------- de hoofdtribune ----------
const mainParts = [...straightStand("main"), endWall("main", SPAN.main[0], -1), endWall("main", SPAN.main[1], 1), ...pylonParts("main")];
{
  const b = BUILDING;
  mainParts.push(box(b.u[0], b.u[1], b.v[0], b.v[1], BASE, b.top));
  mainParts.push(box(MAIN_SOUTH_HEAD.u[0], MAIN_SOUTH_HEAD.u[1], MAIN_SOUTH_HEAD.v[0], MAIN_SOUTH_HEAD.v[1], BASE, MAIN_SOUTH_HEAD.top));
  // Het zwarte glazen volume boven de ingang hangt uit boven de bakstenen onderbouw.
  mainParts.push(box(b.glass.u[0], b.glass.u[1], b.v[1] - 0.1, b.glass.front, b.glass.bottom, b.top));
  mainParts.push(box(b.canopy.u[0], b.canopy.u[1], b.glass.front - 0.1, b.canopy.front, b.glass.bottom, b.canopy.top));
  // Installaties en het verhoogde dakdeel.
  mainParts.push(box(b.plant.u[0], b.plant.u[1], b.plant.v[0], b.plant.v[1], b.top - OVERLAP, b.plant.top));
  mainParts.push(box(b.raised.u[0], b.raised.u[1], b.raised.v[0], b.raised.v[1], b.top - OVERLAP, b.raised.top));
}
// Dug-outs: een blok met een schuin dak dat naar het veld afloopt.
for (const [u0, u1] of DUGOUTS) {
  mainParts.push(profileX([[DUGOUT.v[0], BASE], [DUGOUT.v[1], BASE], [DUGOUT.v[1], DUGOUT.z[1]], [DUGOUT.v[0], DUGOUT.z[0]]], u0, u1));
}
const mainCuts = [];
{
  // De glazen band van de lounges tussen de pylonen (0,45 m diep in het voorvlak van de achterwand).
  const p = SIDE.main;
  const nb = p.rake[1];
  const lines = PYLONS.main.at;
  for (let i = 0; i + 1 < lines.length; i++) {
    const a0 = lines[i] + PYLON_HALF + 0.3;
    const a1 = lines[i + 1] - PYLON_HALF - 0.3;
    mainCuts.push(sideHull("main", [a0, a1].flatMap((a) => [[a, nb - 0.05, LOUNGE.z[0]], [a, nb - 0.05, LOUNGE.z[1]], [a, nb + LOUNGE.depth, LOUNGE.z[0]], [a, nb + LOUNGE.depth, LOUNGE.z[1]]])));
  }
  const b = BUILDING;
  // De ingang onder het glazen volume en de raamnissen in de bakstenen gevel.
  mainCuts.push(box(b.entrance.u[0], b.entrance.u[1], b.v[1] - b.entrance.depth, b.v[1] + 1, b.ground, b.entrance.top));
  for (const u of b.windows.at) {
    mainCuts.push(box(u - b.windows.width / 2, u + b.windows.width / 2, b.v[1] - b.windows.depth, b.v[1] + 1, b.windows.z[0], b.windows.z[1]));
  }
}
const mainStand = Manifold.union(mainParts).subtract(Manifold.union(mainCuts));

// ---------- de zuid- en oosttribune met de overkapte zuidoosthoek ----------
// Punten langs de achterkant van de hoek op een deel t van de lengte.
const alongPolyline = (pts, t) => {
  const seg = pts.slice(1).map((q, i) => Math.hypot(q[0] - pts[i][0], q[1] - pts[i][1]));
  let d = t * seg.reduce((s, x) => s + x, 0);
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const f = Math.min(1, d / seg[i]);
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
    }
    d -= seg[i];
  }
  return pts[pts.length - 1];
};
const mixSide = (A, B, t) => {
  const mix = (x, y) => x + (y - x) * t;
  return {
    w: mix(A.w, B.w),
    roofN: A.roofN.map((x, i) => mix(x, B.roofN[i])),
    roofTop: A.roofTop.map((x, i) => mix(x, B.roofTop[i])),
    roofUnder: A.roofUnder.map((x, i) => mix(x, B.roofUnder[i])),
    rake: A.rake.map((x, i) => (i === 4 ? x : mix(x, B.rake[i]))),
  };
};
const lFront = [FRAME.south(SPAN.south[1], 0)];
const lBack = [FRAME.south(SPAN.south[1], SIDE.south.w)];
const lParams = [SIDE.south];
for (let s = 0; s <= CORNER.segments; s++) {
  const t = s / CORNER.segments;
  const a = Math.PI * (1 + 0.5 * t);
  lFront.push([CORNER.c[0] + CORNER.r * Math.cos(a), CORNER.c[1] + CORNER.r * Math.sin(a)]);
  lBack.push(alongPolyline(CORNER.back, t));
  lParams.push(mixSide(SIDE.south, SIDE.east, t));
}
lFront.push(FRAME.east(SPAN.east[1], 0));
lBack.push(FRAME.east(SPAN.east[1], SIDE.east.w));
lParams.push(SIDE.east);
const lParts = [...sweepStand(lFront, lBack, lParams), endWall("east", SPAN.east[1], 1), ...pylonParts("east"), ...pylonParts("south")];
{
  // De lage aanbouw achter de zuidtribune: lessenaarsdak van de achterwand naar buiten.
  const [n0, n1] = ANNEX.n;
  const poly = [FRAME.south(ANNEX.v[0], n0), FRAME.south(ANNEX.v[1], n0), FRAME.south(ANNEX.v[1], n1), FRAME.south(ANNEX.v[0], n1)];
  // z = top0 + (top1 - top0) * (n - n0) / (n1 - n0), met n = -57,4 - u.
  const slope = (ANNEX.top[1] - ANNEX.top[0]) / (n1 - n0);
  lParts.push(roofPlane(poly, -slope, 0, ANNEX.top[0] + slope * (-57.4 - n0)));
  const sb = SOUTH_BLOCK;
  lParts.push(box(sb.u[0], sb.u[1], sb.v[0], sb.v[1], BASE, sb.top));
  // Bordes en treden van de buitentrap naar het park.
  const [a0, a1] = STAIR.a;
  const w = SIDE.east.w;
  lParts.push(sideHull("east", [a0, a1].flatMap((a) => [[a, w - 0.1, BASE], [a, w + STAIR.landing, BASE], [a, w - 0.1, DOOR.z[0]], [a, w + STAIR.landing, DOOR.z[0]]])));
  let n = w + STAIR.landing;
  for (const [depth, z] of STAIR.treads) {
    lParts.push(sideHull("east", [a0, a1].flatMap((a) => [[a, n - OVERLAP, BASE], [a, n + depth, BASE], [a, n - OVERLAP, z], [a, n + depth, z]])));
    n += depth;
  }
}
const lCuts = [];
{
  // De noordwestkop van de zuidtribune: schuin afgesneden langs de lichtmast.
  const [[x0, y0], [x1, y1]] = SOUTH_CUT;
  const d = [x1 - x0, y1 - y0];
  const l = Math.hypot(...d);
  const t = [d[0] / l, d[1] / l];
  const o = [-t[1], t[0]]; // naar buiten (-u, +v)
  const far = 30;
  lCuts.push(prism([[x0 - t[0] * far, y0 - t[1] * far], [x1 + t[0] * far, y1 + t[1] * far], [x1 + t[0] * far + o[0] * far, y1 + t[1] * far + o[1] * far], [x0 - t[0] * far + o[0] * far, y0 - t[1] * far + o[1] * far]], BASE - 1, 40));
  // Binnenplaatsen in de aanbouw (open tot het maaiveld van de straat, NAP +1,7 m).
  for (const [v0, v1] of ANNEX.courts) lCuts.push(box(-69.0, -66.6, v0, v1, 2.9, 20));
  // De zuilengang: de achterwand van de oosttribune ligt tussen de pylonen 0,7 m terug.
  const w = SIDE.east.w;
  lCuts.push(sideHull("east", COLONNADE.a.flatMap((a) => [[a, w - COLONNADE.depth, COLONNADE.z[0]], [a, w + 1, COLONNADE.z[0]], [a, w - COLONNADE.depth, COLONNADE.z[1]], [a, w + 1, COLONNADE.z[1]]])));
  // De deur boven het bordes.
  lCuts.push(sideHull("east", DOOR.a.flatMap((a) => [[a, w - DOOR.depth, DOOR.z[0]], [a, w + 0.5, DOOR.z[0]], [a, w - DOOR.depth, DOOR.z[1]], [a, w + 0.5, DOOR.z[1]]])));
}
// De pylonen van de oosttribune staan als zuilen in de zuilengang: na het uitsparen weer toevoegen.
const lStand = Manifold.union([Manifold.union(lParts).subtract(Manifold.union(lCuts)), ...pylonParts("east")]);

// ---------- de noordtribune ----------
const northStand = Manifold.union([
  ...straightStand("north"),
  endWall("north", SPAN.north[0], -1),
  endWall("north", SPAN.north[1], 1),
  ...pylonParts("north"),
  box(SCOREBOARD.u[0], SCOREBOARD.u[1], SCOREBOARD.v[0], SCOREBOARD.v[1], SCOREBOARD.z[0], SCOREBOARD.z[1]),
  box(NW_ANNEX.u[0], NW_ANNEX.u[1], NW_ANNEX.v[0], NW_ANNEX.v[1], BASE, NW_ANNEX.top),
]);

// ---------- de lichtmasten ----------
// Vakwerkpilaar: vier poten van 0,9 m die van 2,8 naar 2,0 m versmallen, ringbalken
// en kruisdiagonalen (steiler dan 45 graden), bovenaan een lampenbank naar het veld.
const mast = ([cx, cy], top) => {
  const leg = 0.9;
  const baseW = 2.8;
  const topW = 2.0;
  const zHead = top - 5.6;
  const levels = [BASE, 8.0, 16.0, 24.0, zHead - 1.0];
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
  // Lampenbank (4,4 m breed, 3,6 m hoog) op een uitwaaierende kop, gericht naar het hart van het veld.
  const facing = (Math.atan2(-cy, -cx) * 180) / Math.PI;
  const half = [0.6, 2.2];
  const oh = off(zHead) + leg / 2;
  const flare = hull([
    ...corners.map(([dx, dy]) => [dx * oh, dy * oh, zHead]),
    ...corners.map(([dx, dy]) => [dx * half[0], dy * half[1], zHead + 2.05]),
  ]);
  parts.push(Manifold.union([flare, box(-half[0], half[0], -half[1], half[1], zHead + 2.0, top)]).rotate([0, 0, facing]).translate([cx, cy, 0]));
  return Manifold.union(parts);
};
const masts = MASTS.map(({ at: p, top }) => mast(p, top));

const OVERHANG_OK = (z) => z >= OVERHANG_MIN_Z;
const stadium = Manifold.union([mainStand, lStand, northStand, ...masts]);
// BAG-panden: de hoofdtribune met achtergebouw, de zuidelijke kop ervan en drie panden onder en achter de zuidtribune.
const REPLACED_BUILDINGS = ["0599100010029704", "0599100100015795", "0599100010033787", "0599100010014268", "0599100100015796"];
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "Stadion Woudestein",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: REPLACED_BUILDINGS,
  plate: true,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (95375,87, 436864,47) in het hart van de veldopening, op het maaiveld van het park ten oosten van het stadion (NAP -1,2 m; het veld ligt 2,2 m hoger), +X langs het veld naar het noordnoordoosten (67,15 graden) en +Y naar het westnoordwesten, naar de hoofdtribune. Eén node building:stadion: de hoofdtribune (Henk Zon-tribune) met een zitrang van zes treden onder een dakplaat van +11,0 naar +10,75 m, de glazen band van de lounges, het bakstenen achtergebouw (+9,5 m) met het zwarte glazen volume boven de ingang, raamnissen en installaties; de zuid- en oosttribune als één L met de overkapte zuidoosthoek, elk met vijf treden onder een dak op +9,65 m, de aanbouw met binnenplaatsen achter de zuidtribune, de zuilengang en buitentrap van de oosttribune; de noordtribune met scorebord en de lage aanbouw in de noordwesthoek; betonnen pylonen met twee tuidraden achter elk dak; dug-outs en vier vakwerk-lichtmasten (+33,5 tot +35,4 m) op de hoeken. Onderkant op 0,5 m onder het parkmaaiveld; de dakplaten en uitkragingen hangen uit (de export vult ze op). Vervangt de PDOK-reconstructie van de hoofdtribune en de panden onder de zuidtribune. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 4700,
    fieldLevelM: FIELD,
    roofM: Object.fromEntries(Object.entries(SIDE).map(([s, p]) => [s, [p.roofTop[0], p.roofTop[p.roofTop.length - 1]]])),
    rearBuildingM: BUILDING.top,
    pylonTopM: Object.fromEntries(Object.entries(PYLONS).map(([s, p]) => [s, p.top])),
    mastTopM: MASTS.map((m) => m.top),
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Stadion_Woudestein",
    "PDOK BAG panden van het stadion (zie replacesBuildings), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: de hoofdas, de voorranden en dakhoogtes per tribune, het achtergebouw, de aanbouw, de pylonen en de lichtmasten",
    "PDOK luchtfoto (Actueel_orthoHR): pylonen, dug-outs, scorebord en de zuidoosthoek",
    "Wikimedia Commons: Rotterdam stadion woudestein, Van Dongen de Roo Stadion en KNVB finale vrouwen 18-19 (gevel, zitrang, pylonen met tuidraden, masten); foto's op stadiumdb.com (zuilengang en buitentrap van de oosttribune)",
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
      if (OVERHANG_OK(z, p)) continue;
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

// Losse delen van het model.
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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze als properties 3..5.
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
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
    meshes.push({ name, primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }] });
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
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

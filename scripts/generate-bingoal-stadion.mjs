// Genereert een gedetailleerd, gesloten 3D-model van het voetbalstadion van ADO Den Haag in het Forepark
// (Den Haag, Haags Kwartier 55; geopend 2007, 15.000 plaatsen). Het stadion heeft vaak van naam gewisseld
// (ADO Den Haag Stadion, Kyocera Stadion, Cars Jeans Stadion, Bingoal Stadion 2022-2025); sinds 2025 heet het
// WerkTalent Stadion. Het model vervangt de PDOK-reconstructie van het ene BAG-pand van het stadion en bestaat uit:
// - de ring van de oost-, noord- en zuidtribune met afgeronde, dichte en overdekte hoeken: per zijde een eigen
//   doorsnede die langs de zijde is uitgetrokken (de opgetrokken zitrang in zeven treden die onder het dak open
//   blijft, de achterwand, een dakplaat van 2,2 m dik die over de rang uitkraagt, de flauw oplopende dakvlakken
//   met de goot en de nok, en de afgeronde dakrol die 2 m buiten de gevel uitbolt), met een plint, raamstroken,
//   kleine vensters en ingangen als nissen in de gevel van gefelste aluminiumplaten;
// - de hoofdtribune (Eretribune) aan de westkant: hoger en dieper, met een dak dat als vlak van +17,65 m aan de
//   veldkant oploopt en dan als cirkelboog (straal 17,9 m) over de nok op +24,5 m naar de dakrol aan de gebogen
//   westgevel gaat; eronder een zitrang in negen treden met de skyboxen als glazen band erachter, de zwarte
//   kopgevels (schuin, 15 graden) met raamstroken, de glazen entreehal met de clubnaam en de losse letters van
//   de stadionnaam op het dak;
// - de vier schuine lichtmasten op de hoeken van de ring (66 graden, naar het veld gekanteld) met lampenbanken.
// Alles is opgebouwd uit prisma's, blokken en convexe rompen van vlakken (geen hoogteveld, geen lagen).
// Alle maten zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de nodenaam) als catalogusbron voor
// de export en de kaart, plus een binaire STL in millimeters op 1:<schaal> (het model is één aaneengesloten stuk,
// dus zonder grondplaat).
//
//   node scripts/generate-bingoal-stadion.mjs              # 1:1000 (standaard)
//   node scripts/generate-bingoal-stadion.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening op het maaiveld rond het stadion (NAP -2,4 m; het veld
// zelf ligt 1,9 m hoger, in het PDOK-terrein), Z omhoog. +X loopt langs de lengteas van het veld naar het noorden
// (RD-richting (-0,0598, 0,9982), 93,43 graden, uit de rechte voorranden van de vier daken in het AHN),
// +Y dwars daarop naar het westen, naar de hoofdtribune.
//
// Overhang: de dakplaten, de dakrol en de bovenkant van de nissen hangen uit (ondervlakken onder 45 graden
// boven OVERHANG_MIN_Z); daaronder blijft elk ondervlak steiler dan 45 graden. De export vult de uitkragingen op
// bij het printen. De lampenbanken staan op een trechter met zijden steiler dan 45 graden en hoeven geen opvulling.
//
// Bronnen: BAG-pand 0518100000273015 (contour van de gevel, bouwjaar 2007; vervangen pand); AHN DSM/DTM 0,5 m
// (PDOK WCS) voor de voorrand van de daken (oost v = -46,0, noord u = 65,0, zuid u = -67,25, west v = 45,5), de
// dakprofielen per zijde (binnenrand +15,1 tot +15,5 m NAP, goot, nok +16,25 m NAP, dakrol tot 2 m buiten de
// gevel), het dak van de hoofdtribune (vlak met helling 0,33, boog met nok +22,13 m NAP op v = 69,3), de schuine
// kopgevels, de letters op het dak (u -23,5 tot 25, tot +26,2 m NAP), de lichtmasten (lampen tot +39,4 m NAP,
// voet op het dak op u = 68,6, v = 48,5) en het maaiveld (NAP -2,2 tot -2,5 m rond het stadion, het veld op
// NAP -0,5 m met een sleuf van NAP -2,5 m langs de tribunes); PDOK luchtfoto (Actueel_orthoHR) voor de hoeken,
// de goot en de entreehal; Wikimedia Commons-foto's (Cars Jeans Stadion, Den Haag (NED); Cars Jeans Stadion
// (36995264265); ADO Den Haag Stadion, Forepark; Stadium at The Hague, Forepark, img.nr. 01 tot 30; Panorama
// ADO Den Haag Stadium 15-8-2019; ADO Den Haag v Vitesse 2019) voor de dakrol, de gevel met vensters, de zwarte
// kopgevels, de entreehal, de letters, de masten en de zitrang onder het dak; Wikipedia (15.000 plaatsen,
// verhoogd veld, de Passage onder de tribunes).
// Geschat: de treden van de zitrang (eerste trede +2,5 m, bovenste +11,5 m in de ring en +14,6 m in de
// hoofdtribune), de dikte van de dakplaten (2,2 m), de onderkant van de dakrol (+11 m in de ring, +13 m aan de
// hoofdtribune), de glazen band van de skyboxen, de plaats en maat van de vensters en ingangen (het patroon is
// regelmatig vereenvoudigd, de echte gevel heeft een speels verspreid patroon), de doorsnede van de masten en de
// lampenbanken, en de letters (schematisch als blokken; het AHN toont de letters van Cars Jeans Stadion, de
// huidige naam WerkTalent Stadion staat op hetzelfde frame). Weggelaten: de zonnepanelen (vlak op het dak,
// < 0,9 m), de dakgoten als goot (alleen als knik), de stoelen, trappen, hekken en reclameborden, de
// spelersbanken, het videoscherm in de hoek, de lampen langs de dakrand, de leuningen en het stalen frame onder de
// letters (te fijn voor 1:1000), en de parkeergarage en de looproutes ten noorden van het stadion (geen deel van
// het stadionpand).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "bingoal-stadion");
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
const lerp = (a, b, t) => a + (b - a) * t;
// Lineaire interpolatie van een polylijn (xs stijgend) op positie x.
const lerpAt = (xs, ys, x) => {
  if (x <= xs[0]) return ys[0];
  for (let i = 1; i < xs.length; i++) {
    if (x <= xs[i]) return ys[i - 1] + ((ys[i] - ys[i - 1]) * (x - xs[i - 1])) / (xs[i] - xs[i - 1]);
  }
  return ys[ys.length - 1];
};
// Vaste pseudo-willekeur (LCG) voor het vensterpatroon, zodat het script reproduceerbaar is.
let seed = 20070728;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

const SLUG = "bingoal-stadion";
const NAME = "WerkTalent Stadion";

// ---------- maten (lokaal stelsel: u = X naar het noorden, v = Y naar het westen; z boven het maaiveld) ----------
const GROUND_NAP = -2.4;
const nap = (h) => +(h - GROUND_NAP).toFixed(3); // NAP-hoogte naar modelhoogte
const ORIGIN = [86139.5, 453195.1];
const X_AXIS = [-0.059829, 0.998209]; // RD-richting 93,43 graden, langs het veld naar het noorden
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de bemonsteringspunten, als terugval.
const GROUND_HEIGHT = 41.04;
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// Overlap tussen aangrenzende stukken (rakende vlakken laten spleten achter).
const OVERLAP = 0.02;
// Naar beneden gerichte vlakken boven deze hoogte zijn bedoelde uitkragingen.
const OVERHANG_MIN_Z = 2.9;

// De voorrand van de tribunes (de rand van de sleuf langs het veld, AHN): een rechthoek met afgeronde hoeken.
const INNER = { n: 62.75, s: -63.25, e: -44.25, w: 44.25, r: 7.0 };
// De gevel (BAG-contour): rechte zijden op u = 81,3 (noord), -79,95 (zuid) en v = -61,1 (oost), de hoeken als
// kwart-ellipsen om (51,9 | -50,0, ±37,4) met halve assen 29,4 | 29,95 langs u en 23,7 langs v (passen binnen
// 0,5 tot 1,5 m op de BAG-hoekpunten). De westzijde ligt onder de hoofdtribune.
const BACK = { n: 81.3, s: -79.95, e: -61.1, w: 61.1, cn: 51.9, cs: -50.0, cv: 37.4, aN: 29.4, aS: 29.95, av: 23.7 };
const ARC = 6; // stappen per hoek

// Doorsnede per zijde van de ring, afstanden n vanaf de voorrand naar buiten:
// w = gevel, nb = voorkant van de achterwand (einde van de zitrang), top = dakvlakken [n, z] van de voorrand
// van het dak via de goot naar de nok, T = dikte van de dakplaat boven de rang, rake = [n0, n1, z eerste trede,
// z bovenste trede], roll = dakrol tot `out` buiten de gevel op hoogte zOut, onderkant tegen de gevel op zFoot.
const ROLL = { out: 2.0, zOut: 13.0, zFoot: 11.0, exp: 2.5 };
const SIDE = {
  east: { w: 16.85, nb: 13.5, top: [[1.75, nap(15.3)], [9.0, nap(15.76)], [13.75, nap(16.25)]], T: 2.2, rake: [0, 13.5, 2.5, 11.5] },
  north: { w: 18.55, nb: 15.0, top: [[2.25, nap(15.1)], [10.0, nap(15.75)], [15.25, nap(16.24)]], T: 2.2, rake: [0, 15.0, 2.5, 11.5] },
  south: { w: 16.7, nb: 13.0, top: [[4.0, nap(15.48)], [8.5, nap(15.79)], [13.5, nap(16.25)]], T: 2.2, rake: [0, 13.0, 2.5, 11.5] },
};
SIDE.west = SIDE.east; // ligt onder de hoofdtribune en wordt weggesneden
const RAKE_STEPS = 7;

// Hoofdtribune (west): voorrand op v = 44,25, dakrand op v = 45,5 (+15,25 m NAP), dakvlak met helling 0,329
// tot v = 64,5, dan een cirkelboog (straal 17,9 m, nok +22,13 m NAP op v = 69,3) tot de dakrol aan de gevel.
const MAIN = {
  front: 44.25,
  edge: 45.5,
  edgeZ: nap(15.25),
  kneeV: 64.5,
  kneeZ: nap(21.5),
  arc: { v: 69.3, z: nap(22.13), r: 17.9 },
  T: 2.2,
  back: 63.0, // voorkant van de skyboxen
  rake: [2.6, 14.6],
  steps: 9,
  roll: { out: 2.6, zOut: 14.0, zFoot: 12.5, exp: 2.2, start: 0.9 },
  skybox: [15.4, 20.0],
};
// Westgevel (BAG): v als functie van |u| (licht gebogen, 76,0 m in het midden, 72,85 m bij de kopgevels).
const WEST_FACADE = { u: [0, 9, 20, 29.5, 38.7, 48.6, 57.8, 64.3, 70], v: [76.0, 75.98, 75.8, 75.45, 75.14, 74.62, 73.99, 72.85, 71.3] };
const westFacade = (u) => lerpAt(WEST_FACADE.u, WEST_FACADE.v, Math.abs(u));
// De kopgevels van de hoofdtribune staan schuin: |u| = 59,2 + 0,275 (v - 54) (AHN en BAG, beide kanten gelijk).
const gable = (v) => 59.2 + 0.275 * (v - 54);
// Glazen entreehal (BAG: u -8,06 tot 9,23, tot v = 80,35) tot vlak onder de top van de dakrol.
const ATRIUM = { u: [-8.06, 9.23], v: 80.35, top: 21.0, door: { u: [-3.0, 4.2], top: 4.2 } };
// Letters van de stadionnaam op het dak (AHN: u -23,5 tot 25, v 73,5 tot 74,5, tot +26,2 m NAP).
const LETTERS = { u: [-23.5, 25.0], v: 74.0, depth: 0.9, width: 2.6, gap: 0.9, top: nap(26.2) };
// Lichtmasten: voet op het dak boven de hoek, lampenbank boven de binnenhoek (AHN: tot +39,4 m NAP).
const MAST = { foot: [68.6, 48.5], head: [61.3, 41.6], footZ: 16.8, headZ: 38.4, r0: 0.75, r1: 0.5, lamp: [6.0, 1.2, 3.4], funnel: 3.4 };
// Maaiveld (AHN NAP -2,0 tot -2,5 m) op de straten en pleinen rond het stadion, 10 tot 15 m buiten de gevel.
const GROUND_SAMPLES = [[0, -75], [88, 0], [-94, 0], [0, 92]];

// ---------- de ring: voorrand en gevel met evenveel punten per hoek ----------
const CORNERS = [
  { a: "north", b: "west", inC: [INNER.n - INNER.r, INNER.w - INNER.r], bkC: [BACK.cn, BACK.cv], ax: [BACK.aN, BACK.av], th0: 0 },
  { a: "west", b: "south", inC: [INNER.s + INNER.r, INNER.w - INNER.r], bkC: [BACK.cs, BACK.cv], ax: [BACK.aS, BACK.av], th0: 90 },
  { a: "south", b: "east", inC: [INNER.s + INNER.r, INNER.e + INNER.r], bkC: [BACK.cs, -BACK.cv], ax: [BACK.aS, BACK.av], th0: 180 },
  { a: "east", b: "north", inC: [INNER.n - INNER.r, INNER.e + INNER.r], bkC: [BACK.cn, -BACK.cv], ax: [BACK.aN, BACK.av], th0: 270 },
];
const inner = [];
const back = [];
for (const c of CORNERS) {
  for (let s = 0; s <= ARC; s++) {
    const th = ((c.th0 + (90 * s) / ARC) * Math.PI) / 180;
    inner.push([c.inC[0] + INNER.r * Math.cos(th), c.inC[1] + INNER.r * Math.sin(th)]);
    back.push([c.bkC[0] + c.ax[0] * Math.cos(th), c.bkC[1] + c.ax[1] * Math.sin(th)]);
  }
}
const mixSide = (A, B, t) => ({
  w: lerp(A.w, B.w, t),
  nb: lerp(A.nb, B.nb, t),
  top: A.top.map(([n, z], i) => [lerp(n, B.top[i][0], t), lerp(z, B.top[i][1], t)]),
  T: lerp(A.T, B.T, t),
  rake: A.rake.map((x, i) => lerp(x, B.rake[i], t)),
});
const params = inner.map((_, k) => {
  const c = CORNERS[Math.floor(k / (ARC + 1))];
  return mixSide(SIDE[c.a], SIDE[c.b], (k % (ARC + 1)) / ARC);
});

// De convexe stukken van een doorsnede [n, z]: treden, dakplaat boven de rang, achterwand tot het dak, gevelblok
// en dakrol. Elk stuk loopt 2 cm over in zijn buur.
const profilePieces = (p, rollSpec, steps) => {
  const e = OVERLAP;
  const pieces = [];
  const [rn0, rn1, rz0, rz1] = p.rake;
  for (let j = 0; j < steps; j++) {
    const a = rn0 + ((rn1 - rn0) * j) / steps - (j > 0 ? e : 0);
    const b = rn0 + ((rn1 - rn0) * (j + 1)) / steps + e;
    const z = rz0 + ((rz1 - rz0) * j) / (steps - 1);
    pieces.push([[a, BASE], [b, BASE], [b, z], [a, z]]);
  }
  // Dakvlakken: boven de rang een plaat van dikte T, achter de rang tot de grond (achterwand en gangen).
  const pts = [...p.top];
  const ns = pts.map(([n]) => n);
  const zs = pts.map(([, z]) => z);
  const topAt = (n) => lerpAt(ns, zs, n);
  const breaks = [...new Set([...ns, p.nb].filter((n) => n >= ns[0] && n <= ns[ns.length - 1]))].sort((a, b) => a - b);
  for (let i = 0; i + 1 < breaks.length; i++) {
    const a = breaks[i] - (i > 0 ? e : 0);
    const b = breaks[i + 1] + e;
    if (breaks[i + 1] <= p.nb + 1e-9) {
      pieces.push([[a, topAt(a) - p.T], [b, topAt(b) - p.T], [b, topAt(b)], [a, topAt(a)]]);
    } else {
      pieces.push([[a, BASE], [b, BASE], [b, topAt(b)], [a, topAt(a)]]);
    }
  }
  // De achterwand (van nb tot de nok) zit in de stukken hierboven; de nok ligt altijd achter nb.
  const np = ns[ns.length - 1];
  const zp = zs[zs.length - 1];
  if (p.nb >= np) throw new Error("achterwand achter de nok");
  // Gevelblok van de achterwand tot de gevel, tot boven de voet van de dakrol.
  pieces.push([[Math.min(p.nb, np) - e, BASE], [p.w, BASE], [p.w, rollSpec.zFoot + 0.5], [Math.min(p.nb, np) - e, rollSpec.zFoot + 0.5]]);
  // Dakrol: superellips van de nok naar het verste punt (w + out, zOut), dan een kwartellips terug tegen de
  // gevel (w, zFoot), dicht via de achterkant.
  const A = p.w + rollSpec.out - np;
  const B = zp - rollSpec.zOut;
  const roll = [[np - e, zp]];
  for (let s = 1; s <= 6; s++) {
    const phi = (Math.PI / 2) * (1 - s / 6);
    const c = Math.cos(phi) ** (2 / rollSpec.exp);
    const sn = Math.sin(phi) ** (2 / rollSpec.exp);
    roll.push([np + A * c, rollSpec.zOut + B * sn]);
  }
  const lowA = rollSpec.out + 0.3;
  const lowB = rollSpec.zOut - rollSpec.zFoot;
  for (let s = 1; s <= 3; s++) {
    const phi = (Math.PI / 2) * (s / 3);
    roll.push([p.w - 0.3 + lowA * Math.cos(phi), rollSpec.zOut - lowB * Math.sin(phi)]);
  }
  roll.push([np - e, rollSpec.zFoot]);
  pieces.push(roll);
  return pieces;
};

// Punt op afstand n van de voorrand op de straal door ringpunt k.
const ringAt = (k, n, p) => {
  const f = n / p.w;
  return [inner[k][0] + (back[k][0] - inner[k][0]) * f, inner[k][1] + (back[k][1] - inner[k][1]) * f];
};
// Het stuk van ringpunt k naar het volgende punt nx: de romp van beide doorsneden, 2 cm langer.
const ringSweep = (k, nx, pk, pn, polyK, polyN) => {
  const dx = inner[nx][0] - inner[k][0];
  const dy = inner[nx][1] - inner[k][1];
  const l = Math.hypot(dx, dy) || 1;
  const pts = [];
  for (const [n, z] of polyK) {
    const [x, y] = ringAt(k, n, pk);
    pts.push([x - (dx / l) * OVERLAP, y - (dy / l) * OVERLAP, z]);
  }
  for (const [n, z] of polyN) {
    const [x, y] = ringAt(nx, n, pn);
    pts.push([x + (dx / l) * OVERLAP, y + (dy / l) * OVERLAP, z]);
  }
  return hull(pts);
};
const SIDE_AFTER = ["west", "south", "east", "north"];
const ringPieces = [];
for (let k = 0; k < inner.length; k++) {
  const nx = (k + 1) % inner.length;
  const straight = k % (ARC + 1) === ARC;
  const pk = straight ? SIDE[SIDE_AFTER[Math.floor(k / (ARC + 1))]] : params[k];
  const pn = straight ? pk : params[nx];
  if (straight && SIDE_AFTER[Math.floor(k / (ARC + 1))] === "west") continue; // onder de hoofdtribune
  const qk = profilePieces(pk, ROLL, RAKE_STEPS);
  const qn = profilePieces(pn, ROLL, RAKE_STEPS);
  qk.forEach((q, i) => ringPieces.push(ringSweep(k, nx, pk, pn, q, qn[i])));
}

// ---------- gevelreliëf: nissen langs een polylijn (buitennormaal links van de looprichting tegen de klok in) ----------
// Een nis in segment p0-p1: van t0 tot t1 langs het segment, `depth` de gevel in, van z0 tot z1.
const facadeBox = (p0, p1, t0, t1, z0, z1, depth) => {
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const l = Math.hypot(dx, dy);
  const d = [dx / l, dy / l];
  const nrm = [d[1], -d[0]]; // naar buiten bij een veelhoek tegen de klok in
  const pts = [];
  for (const t of [t0, t1]) {
    for (const n of [-depth, 1.0]) {
      for (const z of [z0, z1]) pts.push([p0[0] + d[0] * t + nrm[0] * n, p0[1] + d[1] * t + nrm[1] * n, z]);
    }
  }
  return hull(pts);
};
// Plint: 0,3 m terug tot +3,3 m, met een schuine kraag (50 graden) naar het gevelvlak op +3,65 m.
const plinthCut = (p0, p1, ext) => {
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const l = Math.hypot(dx, dy);
  const d = [dx / l, dy / l];
  const nrm = [d[1], -d[0]];
  const quad = [[-1.0, BASE - 1], [0.3, BASE - 1], [0.3, 3.3], [0.0, 3.65], [-1.0, 3.65]];
  const pts = [];
  for (const t of [-ext, l + ext]) for (const [n, z] of quad) pts.push([p0[0] + d[0] * t - nrm[0] * n, p0[1] + d[1] * t - nrm[1] * n, z]);
  return hull(pts);
};
// Vensterpatroon langs een polylijn: raamstroken, kleine vensters in twee rijen en ingangen in de plint.
const windowRows = (poly, spec) => {
  const cuts = [];
  for (let i = 0; i + 1 < poly.length; i++) {
    const p0 = poly[i];
    const p1 = poly[i + 1];
    const l = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    for (const row of spec.rows) {
      let t = row.margin;
      while (t + row.width + row.margin <= l) {
        if (rand() < row.fill) cuts.push(facadeBox(p0, p1, t, t + row.width, row.z[0], row.z[1], row.depth));
        t += row.width + row.gap * (0.7 + 0.6 * rand());
      }
    }
  }
  return cuts;
};
const RING_WINDOWS = {
  rows: [
    { z: [4.6, 6.4], width: 5.6, gap: 4.5, margin: 1.5, fill: 0.7, depth: 0.4 },
    { z: [7.6, 8.9], width: 1.3, gap: 2.6, margin: 1.0, fill: 0.55, depth: 0.4 },
    { z: [9.4, 10.4], width: 1.3, gap: 3.0, margin: 1.0, fill: 0.45, depth: 0.4 },
  ],
};
const DOORS = { z: [BASE, 3.0], width: 3.6, depth: 0.5 };
const ringCuts = [];
{
  // Alle segmenten van de gevel behalve de westzijde (die is onder de hoofdtribune).
  for (let k = 0; k < back.length; k++) {
    const nx = (k + 1) % back.length;
    const straight = k % (ARC + 1) === ARC;
    if (straight && SIDE_AFTER[Math.floor(k / (ARC + 1))] === "west") continue;
    const seg = [back[k], back[nx]];
    ringCuts.push(plinthCut(seg[0], seg[1], 0.3));
    ringCuts.push(...windowRows(seg, RING_WINDOWS));
    // Ingangen op de rechte zijden, om de 20 m (de genummerde ingangen in de plint).
    if (straight) {
      const l = Math.hypot(seg[1][0] - seg[0][0], seg[1][1] - seg[0][1]);
      for (let t = 8; t + DOORS.width < l - 4; t += 20) ringCuts.push(facadeBox(seg[0], seg[1], t, t + DOORS.width, DOORS.z[0], DOORS.z[1], DOORS.depth));
    }
  }
}

// ---------- de hoofdtribune ----------
// Bovenkant van het dak op v (absolute v).
const mainTop = (v) => {
  if (v <= MAIN.kneeV) return MAIN.edgeZ + ((MAIN.kneeZ - MAIN.edgeZ) * (v - MAIN.edge)) / (MAIN.kneeV - MAIN.edge);
  const { v: cv, z: cz, r } = MAIN.arc;
  return cz - r + Math.sqrt(Math.max(0, r * r - (v - cv) ** 2));
};
// Doorsnede op station u: dezelfde stukken als de ring, met n = v - voorrand.
const ARC_POINTS = 5;
const mainParams = (u) => {
  const vf = westFacade(u);
  const rollStart = vf - MAIN.roll.start;
  const top = [[MAIN.edge - MAIN.front, MAIN.edgeZ], [MAIN.back - MAIN.front, mainTop(MAIN.back)], [MAIN.kneeV - MAIN.front, MAIN.kneeZ]];
  for (let i = 1; i <= ARC_POINTS; i++) {
    const v = MAIN.kneeV + ((rollStart - MAIN.kneeV) * i) / ARC_POINTS;
    top.push([v - MAIN.front, mainTop(v)]);
  }
  return { w: vf - MAIN.front, nb: MAIN.back - MAIN.front, top, T: MAIN.T, rake: [0, MAIN.back - MAIN.front, ...MAIN.rake] };
};
// Stations langs u; tussen twee stations de romp van de stukken met dezelfde index. De stukken die niet van de
// gevel afhangen (treden, dakplaat, achterwand tot de knik) zijn op alle stations gelijk en worden in één keer
// over de hele lengte uitgetrokken.
const MAIN_STATIONS = [-70, -64.3, -60, -57.8, -53, -48.6, -38.7, -29.5, -20, -9, 0];
const mainStations = [...MAIN_STATIONS, ...MAIN_STATIONS.slice(0, -1).reverse().map((u) => -u)];
const mainProfiles = mainStations.map((u) => profilePieces(mainParams(u), MAIN.roll, MAIN.steps));
const sameEverywhere = mainProfiles[0].map((q, i) => mainProfiles.every((p) => JSON.stringify(p[i]) === JSON.stringify(q)));
const mainPieces = [];
const extrudeU = (q, u0, u1) => hull([...q.map(([n, z]) => [u0, MAIN.front + n, z]), ...q.map(([n, z]) => [u1, MAIN.front + n, z])]);
mainProfiles[0].forEach((q, i) => {
  if (sameEverywhere[i]) mainPieces.push(extrudeU(q, mainStations[0], mainStations[mainStations.length - 1]));
});
for (let j = 0; j + 1 < mainStations.length; j++) {
  const u0 = mainStations[j] - OVERLAP;
  const u1 = mainStations[j + 1] + OVERLAP;
  mainProfiles[j].forEach((q, i) => {
    if (sameEverywhere[i]) return;
    mainPieces.push(hull([...q.map(([n, z]) => [u0, MAIN.front + n, z]), ...mainProfiles[j + 1][i].map(([n, z]) => [u1, MAIN.front + n, z])]));
  });
}
// Het gebied van de hoofdtribune tussen de schuine kopgevels.
const MAIN_V = [44.0, 95];
const mainArea = [[-gable(MAIN_V[0]), MAIN_V[0]], [gable(MAIN_V[0]), MAIN_V[0]], [gable(MAIN_V[1]), MAIN_V[1]], [-gable(MAIN_V[1]), MAIN_V[1]]];
const mainCutter = prism(mainArea, BASE - 1, 60);
// De hoofdtribune zelf loopt 5 cm over de snede van de ring heen (samenvallende vlakken laten spleten achter).
const mainOuter = prism(
  [[-gable(MAIN_V[0]) - 0.05, MAIN_V[0] - 0.05], [gable(MAIN_V[0]) + 0.05, MAIN_V[0] - 0.05], [gable(MAIN_V[1]) + 0.05, MAIN_V[1]], [-gable(MAIN_V[1]) - 0.05, MAIN_V[1]]],
  BASE - 1,
  60,
);
// De skyboxen: een glazen band (0,6 m diep) in de achterwand achter de rang, met penanten van 1,0 m om de 6 m.
const skyboxes = [];
for (let u = -54; u + 5 <= 54; u += 6) skyboxes.push(box(u + 0.5, u + 5.5, MAIN.back - 0.05, MAIN.back + 0.6, MAIN.skybox[0], MAIN.skybox[1]));
// Westgevel: plint en vensters langs de gebogen gevel (van zuid naar noord, buitennormaal naar +v).
const westPoly = [];
for (let u = -62; u <= 62.01; u += 4) westPoly.push([u, westFacade(u)]);
westPoly.reverse(); // tegen de klok in: van noord (+u) naar zuid (-u) heeft de buitennormaal +v
const westCuts = [];
for (let i = 0; i + 1 < westPoly.length; i++) {
  westCuts.push(plinthCut(westPoly[i], westPoly[i + 1], 0.3));
}
westCuts.push(
  ...windowRows(westPoly, {
    rows: [
      { z: [5.2, 7.4], width: 6.2, gap: 6.0, margin: 0.2, fill: 0.6, depth: 0.4 },
      { z: [9.6, 10.9], width: 1.3, gap: 2.4, margin: 0.4, fill: 0.6, depth: 0.4 },
    ],
  }),
);
// Kopgevels (zwart, schuin): twee rijen raamstroken van 7 m tussen v = 63 en 73.
const gableCuts = [];
for (const sgn of [1, -1]) {
  // Punten op de kopgevel; buitennormaal naar +u (noord) of -u (zuid).
  const a = [sgn * gable(62), 62];
  const b = [sgn * gable(74), 74];
  const [p0, p1] = sgn > 0 ? [a, b] : [b, a];
  const l = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  for (const [z0, z1] of [[7.8, 9.4], [12.4, 14.0]]) gableCuts.push(facadeBox(p0, p1, l / 2 - 5.2, l / 2 + 1.8, z0, z1, 0.4));
  gableCuts.push(facadeBox(p0, p1, l / 2 - 5.2, l / 2 - 1.6, BASE, 3.0, 0.5));
}
// Glazen entreehal met de ingang, en de letters op het dak.
const atrium = box(ATRIUM.u[0], ATRIUM.u[1], 74.5, ATRIUM.v, BASE, ATRIUM.top);
const atriumCuts = [
  box(ATRIUM.door.u[0], ATRIUM.door.u[1], ATRIUM.v - 0.6, ATRIUM.v + 1, BASE - 1, ATRIUM.door.top),
  // de glazen gevel als nis met een dikke rand (stijlen van 1,0 m), in drie velden
  ...[[-7.06, -1.9], [-0.9, 3.9], [4.9, 8.23]].map(([u0, u1]) => box(u0, u1, ATRIUM.v - 0.35, ATRIUM.v + 1, ATRIUM.door.top + 1.0, ATRIUM.top - 1.0)),
];
const letters = [];
{
  const n = Math.floor((LETTERS.u[1] - LETTERS.u[0] + LETTERS.gap) / (LETTERS.width + LETTERS.gap));
  const span = n * LETTERS.width + (n - 1) * LETTERS.gap;
  const u0 = (LETTERS.u[0] + LETTERS.u[1]) / 2 - span / 2;
  const base = mainTop(LETTERS.v + LETTERS.depth / 2) - 0.6;
  for (let i = 0; i < n; i++) {
    const a = u0 + i * (LETTERS.width + LETTERS.gap);
    letters.push(box(a, a + LETTERS.width, LETTERS.v - LETTERS.depth / 2, LETTERS.v + LETTERS.depth / 2, base, LETTERS.top));
  }
}
const mainStand = Manifold.union([...mainPieces, atrium])
  .subtract(Manifold.union([...skyboxes, ...atriumCuts]))
  .subtract(Manifold.union(westCuts).subtract(box(ATRIUM.u[0] - 0.6, ATRIUM.u[1] + 0.6, 70, 85, BASE - 2, 30)))
  .intersect(mainOuter)
  .subtract(Manifold.union(gableCuts))
  .add(Manifold.union(letters));

// ---------- de lichtmasten ----------
// Een schuine buis (0,75 naar 0,5 m straal, achthoekig) van het dak naar de lampenbank, met een kraag op het dak.
const mast = (su, sv) => {
  const foot = [su * MAST.foot[0], sv * MAST.foot[1], MAST.footZ];
  const head = [su * MAST.head[0], sv * MAST.head[1], MAST.headZ];
  const ring = (c, r, n = 8) => Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n;
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a), c[2]];
  });
  const pole = hull([...ring(foot, MAST.r0), ...ring(head, MAST.r1)]);
  // Kraag op het dak (de voet zit in de dakplaat van +16,1 tot +18,3 m).
  const collar = hull([...ring([foot[0], foot[1], MAST.footZ + 0.6], 1.4), ...ring([foot[0], foot[1], MAST.footZ + 3.0], 0.8)]);
  // Lampenbank (6,0 × 1,2 × 3,4 m), haaks op de diagonaal naar het veld, op een trechter van de buis naar de
  // onderkant van de bank (zijden steiler dan 45 graden, zodat de export er niets onder hoeft op te vullen).
  const [lw, ld, lh] = MAST.lamp;
  const facing = Math.atan2(-head[1], -head[0]);
  const ca = Math.cos(facing);
  const sa = Math.sin(facing);
  const at = (x, y, z) => [head[0] + x * ca - y * sa, head[1] + x * sa + y * ca, head[2] + z];
  const lampPts = [];
  for (const x of [-ld / 2, ld / 2]) for (const y of [-lw / 2, lw / 2]) for (const z of [0, lh]) lampPts.push(at(x, y, z));
  const lamp = hull(lampPts);
  const t = (MAST.funnel) / (head[2] - foot[2]);
  const neck = [head[0] + (foot[0] - head[0]) * t, head[1] + (foot[1] - head[1]) * t, head[2] - MAST.funnel];
  const funnel = hull([...ring(neck, MAST.r1), ...lampPts.filter((q) => Math.abs(q[2] - head[2]) < 1e-9)]);
  return Manifold.union([pole, collar, funnel, lamp]);
};
const masts = [mast(1, -1), mast(1, 1), mast(-1, -1), mast(-1, 1)];

// ---------- samenvoegen ----------
const ring = Manifold.union(ringPieces).subtract(Manifold.union(ringCuts)).subtract(mainCutter);
const OVERHANG_OK = (z) => z >= OVERHANG_MIN_Z;
const stadium = Manifold.union([ring, mainStand, ...masts]);
const REPLACED_BUILDINGS = ["0518100000273015"];
const nodes = [["building:stadion", stadium]];
const all = stadium;

const sideRoof = (s) => [SIDE[s].top[0][1], SIDE[s].top[2][1]];
const META = {
  name: NAME,
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: REPLACED_BUILDINGS,
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (86139,50, 453195,10) in het hart van de veldopening op het maaiveld rond het stadion (NAP -2,4 m; het veld ligt 1,9 m hoger in het PDOK-terrein), +X langs het veld naar het noorden (93,43 graden) en +Y naar het westen, naar de hoofdtribune. Eén node building:stadion: het stadion van ADO Den Haag in het Forepark (sinds 2025 WerkTalent Stadion, eerder onder meer Kyocera, Cars Jeans en Bingoal Stadion). De ring van de oost-, noord- en zuidtribune (voorrand 126 bij 88,5 m, gevel 161 bij 122 m) met afgeronde, dichte hoeken en per zijde een eigen doorsnede: een zitrang van zeven treden (+2,5 tot +11,5 m) die onder het dak open blijft, een dakplaat van 2,2 m die over de rang uitkraagt (voorrand +17,5 tot +17,9 m, nok +18,65 m) en de afgeronde dakrol die 2 m buiten de gevel uitbolt, een terugliggende plint, raamstroken, kleine vensters en ingangen; de hoofdtribune aan de westkant met een dak dat als vlak oploopt van +17,65 m en als boog over de nok (+24,5 m) naar de dakrol aan de licht gebogen westgevel gaat, een zitrang van negen treden (+2,6 tot +14,6 m) met de skyboxen erachter, schuine zwarte kopgevels met raamstroken, de glazen entreehal en de letters van de stadionnaam op het dak; vier schuine lichtmasten (66 graden) met lampenbanken op een trechter tot +41,8 m op de hoeken. Onderkant op 0,5 m onder het maaiveld; de dakplaten en de dakrol hangen uit (de export vult ze op). Vervangt de PDOK-reconstructie van het BAG-pand van het stadion. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 15000,
    fieldOpeningM: [INNER.n - INNER.s, INNER.w - INNER.e],
    roofEdgeAndRidgeM: { east: sideRoof("east"), north: sideRoof("north"), south: sideRoof("south"), west: [MAIN.edgeZ, MAIN.arc.z] },
    mastTopM: +(MAST.headZ + MAST.lamp[2]).toFixed(1),
    groundNapM: GROUND_NAP,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/WerkTalent_Stadion",
    "PDOK BAG pand 0518100000273015 (contour van de gevel), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: voorranden en dakprofielen per zijde, dak van de hoofdtribune, kopgevels, letters, lichtmasten en maaiveld",
    "PDOK luchtfoto (Actueel_orthoHR): hoeken, goten, entreehal en lichtmasten",
    "Wikimedia Commons: Cars Jeans Stadion, Den Haag (NED); Cars Jeans Stadion (36995264265); ADO Den Haag Stadion, Forepark; Stadium at The Hague, Forepark, the Netherlands img.nr. 01 tot 30; Panorama ADO Den Haag Stadium 15-8-2019; ADO Den Haag v Vitesse 2019 (dakrol, gevel, kopgevels, entreehal, letters, masten, zitrang onder het dak)",
  ],
};

// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen (behalve de bedoelde uitkragingen).
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
      groundHeight: META.groundHeight,
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

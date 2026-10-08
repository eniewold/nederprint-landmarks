// Genereert vereenvoudigde, gesloten 3D-modellen van de zes molens van de
// Zaanse Schans langs de Zaan aan de Kalverringdijk in Zaandam: de
// specerijmolen De Huisman (1786), de paltrok De Gekroonde Poelenburg
// (1867), de verfmolen De Kat (1646), de oliemolen De Zoeker (1672), de
// houtzaagmolen Het Jonge Schaap (2007) en de oliemolen De Bonte Hen (1693).
// De vijf stellingmolens hebben een onderbouw met een stelling als dichte
// omloopplaat op een kraag van 50 graden, een achtkant (Het Jonge Schaap een
// zeskant), een kap, een staart naar de stelling, een wiekenkruis als dikke
// plaat in X-stand en de schuur die in hetzelfde BAG-pand ligt met een
// zadeldak uit het AHN; de paltrok heeft een voet, de brede onderkast met
// zijn ‘rokken’ en het smalle bovenhuis met de kap. Alle maten in het script
// zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node per molen met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de
// kaart, plus een binaire STL in millimeters op 1:<schaal> met de zes molens
// naast elkaar en een printsteun onder de onderste wiekpunten.
//
//   node scripts/generate-zaanse-schans.mjs              # 1:1000 (standaard)
//   node scripts/generate-zaanse-schans.mjs --scale 500
//
// Assenstelsel: oorsprong op RD (116160, 498810), op de Zaan midden voor de
// rij, Z omhoog, +X naar het oosten en +Y naar het noorden (de assen van RD;
// geen draaiing). z = 0 ligt op het maaiveld bij de molens (NAP circa 0,0 m
// volgens het AHN-maaiveld; het PDOK-terrein wordt naast elke molen
// bemonsterd).
//
// Bronnen: BAG (pand-id, bouwjaar en contour per molen, met de schuur); AHN
// DSM 0,5 m (PDOK WCS) voor de hoogte van de stelling, de schuur en de kap,
// de straal van de stelling, de richting van de as (het wiekenvlak ligt als
// een lijn in het DSM) en de afstand van het wiekenvlak tot de romp; AHN DTM
// voor het maaiveld; de PDOK-luchtfoto voor de stelling en de asrichting van
// De Huisman (het DSM toont daar geen wieken); molendatabase.nl en Wikipedia
// voor type, vlucht en stellinghoogte.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "zaanse-schans");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const union = (parts) => Manifold.union(parts);
const hull = (points) => Manifold.hull(points);
const deg = Math.PI / 180;
// Regelmatige veelhoek (straal tot de hoekpunten) in het XY-vlak.
const ring = (n, r, rot = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot * deg + (2 * Math.PI * i) / n;
    return [r * Math.cos(a), r * Math.sin(a)];
  });
const at = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Afgeknotte piramide tussen twee veelhoeken op z0 en z1.
const frustum = (bottom, z0, top, z1) => hull([...at(bottom, z0), ...at(top, z1)]);
// Doos in lokale coördinaten (u langs de as, v dwars, z omhoog).
const box = (u0, u1, v0, v1, z0, z1) => {
  const pts = [];
  for (const u of [u0, u1]) for (const v of [v0, v1]) for (const z of [z0, z1]) pts.push([u, v, z]);
  return pts;
};
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
// Prisma op een (niet per se convexe) contour van z0 tot z1.
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);

// ---------- algemene maten ----------
// Onderkant: elke molen loopt 1,0 m onder het maaiveld door, zodat hij op een
// iets afwijkend maaiveld niet zweeft. Dat is de vlakke onderkant van alle
// molens.
const BASE = -1.0;
// PDOK-terreinhoogte (ellipsoïdisch) van het maaiveld bij de molens.
const GROUND_HEIGHT = 42.7;
// Stelling: dichte plaat van 0,6 m dik op een kraag van 50 graden vanaf de
// onderbouw (de echte stelling is een open houten omloop op schoren).
const STELLING = { plaat: 0.6, kraag: 50 };
// Wiekenkruis in X-stand onder 50 graden met de horizontaal (zo hangen de
// ondervlakken van de schuine wieken onder 50 graden en niet vlakker dan 45).
const WIEK_HOEK = 50;
// Staart: balk van 0,9 m van de achterkant van de kap naar de stelling.
const STAART = 0.9;
// Kraag: hellingshoek onder de stellingplaat.
const tanKraag = Math.tan(STELLING.kraag * deg);

// ---------- de molens ----------
// Per molen: het hart van de romp (lokale x, y; hart van de kap in het DSM),
// de richting van de as naar de wieken (graden linksom vanaf het oosten; AHN,
// bij De Huisman de luchtfoto), het wiekenvlak (midden van de plaat voor de
// rompas) en de BAG-contour (lokale x, y). Stellingmolens: hoogte en straal
// van de stelling (apothema), apothema van de onderbouw, romp (aantal zijden,
// apothema onder en boven, bovenkant), kap en as, vlucht en wiekplaat, en de
// schuur: richting van de nok, een punt op de as van de BAG-rechthoek, de
// nok (verschuiving dwars op de as en hoogte) en de dakhelling links en
// rechts (m per m), alles uit het DSM.
const MILLS = [
  {
    label: "De Huisman",
    pand: "0479100000003293",
    type: "stelling",
    c: [74.61, -265.67],
    as: 65,
    vlak: 2.9,
    stelling: { z: 7.5, r: 4.8 },
    onderbouw: 4.0,
    romp: { n: 8, aBottom: 2.6, aTop: 1.8, top: 11.9 },
    kapTop: 13.9,
    asZ: 12.9,
    vlucht: 11.4,
    wiek: { breedte: 1.4, dikte: 0.9 },
    schuur: { as: 62.2, c: [71.46, -271.15], t0: 0.3, nok: 7.1, kL: 1.05, kR: 1.05 },
    bag: [[69.68, -265.76], [62.65, -277.74], [70.32, -282.12], [77.38, -270.02], [79.71, -263.92], [71.61, -260.77]],
    sample: [82.3, -259.2],
  },
  {
    label: "De Gekroonde Poelenburg",
    pand: "0479100000004691",
    type: "paltrok",
    c: [140.71, -159.89],
    as: 57.6,
    vlak: 2.9,
    // Paltrok: onderkast (u van achter naar voor, halve breedte, hoogte aan de
    // zijkant en midden), rokken tot de halve breedte op hoogte, bovenhuis
    // (halve breedte, goot, nok).
    kast: { u0: -5.0, u1: 2.3, half: 5.5, zZij: 6.0, zMid: 7.0 },
    rok: { u0: -3.5, half: 7.5, z: 2.5 },
    huis: { u0: -3.5, half: 2.5, goot: 12.5, nok: 15.2 },
    asZ: 13.6,
    vlucht: 20.36,
    wiek: { breedte: 2.2, dikte: 1.0 },
    bag: [[139.96, -152.07], [134.12, -154.66], [134.78, -155.99], [134.06, -156.22], [135.34, -159.67], [132.33, -161.14], [134.58, -166.91], [136.81, -165.84], [138.27, -168.25], [145.87, -164.45], [144.99, -162.58], [146.74, -161.91], [143.82, -155.59], [142.2, -155.97]],
    sample: [150.2, -165.4],
  },
  {
    label: "De Kat",
    pand: "0479100000002702",
    type: "stelling",
    c: [153.15, -68.85],
    as: 85.4,
    vlak: 4.3,
    stelling: { z: 7.2, r: 8.0 },
    onderbouw: 5.5,
    romp: { n: 8, aBottom: 4.3, aTop: 3.1, top: 16.1 },
    kapTop: 19.0,
    asZ: 17.0,
    vlucht: 21.8,
    wiek: { breedte: 2.2, dikte: 1.0 },
    schuur: { as: -66.4, c: [157.13, -73.86], t0: -1.0, nok: 8.3, kL: 0.76, kR: 0.67 },
    bag: [[154.42, -86.67], [168.39, -80.56], [159.85, -61.05], [145.98, -67.38]],
    sample: [148.2, -77.5],
  },
  {
    label: "De Zoeker",
    pand: "0479100000002971",
    type: "stelling",
    c: [137.21, 39.51],
    as: 54.5,
    vlak: 4.2,
    stelling: { z: 4.3, r: 8.5 },
    onderbouw: 5.6,
    romp: { n: 8, aBottom: 4.3, aTop: 3.0, top: 14.0 },
    kapTop: 16.9,
    asZ: 14.9,
    vlucht: 22.5,
    wiek: { breedte: 2.2, dikte: 1.0 },
    schuur: { as: 125.4, c: [144.67, 28.28], t0: 0, nok: 6.6, kL: 0.63, kR: 0.65 },
    bag: [[159.56, 16.31], [142.22, 40.72], [143.05, 41.31], [140.53, 44.86], [139.47, 44.1], [138.04, 46.12], [130.01, 40.42], [131.45, 38.39], [130.39, 37.64], [132.91, 34.09], [133.67, 34.63], [151.0, 10.23]],
    sample: [130.1, 31.1],
  },
  {
    label: "Het Jonge Schaap",
    pand: "0479100000002959",
    type: "stelling",
    c: [69.01, 55.69],
    as: 76.0,
    vlak: 4.1,
    stelling: { z: 5.9, r: 7.5 },
    onderbouw: 4.6,
    romp: { n: 6, aBottom: 4.2, aTop: 2.9, top: 14.5 },
    kapTop: 17.4,
    asZ: 15.4,
    vlucht: 20.6,
    wiek: { breedte: 2.2, dikte: 1.0 },
    schuur: { as: 110.0, c: [71.08, 56.14], t0: 1.5, nok: 5.6, kL: 0.35, kR: 0.35 },
    bag: [[75.29, 63.0], [70.93, 61.43], [68.93, 67.0], [61.42, 64.3], [68.9, 43.69], [76.38, 46.47], [74.3, 52.07], [78.66, 53.64]],
    sample: [80.8, 53.6],
  },
  {
    label: "De Bonte Hen",
    pand: "0479100000003084",
    type: "stelling",
    c: [-150.34, 268.03],
    as: 33.0,
    vlak: 4.2,
    stelling: { z: 4.9, r: 7.8 },
    onderbouw: 4.8,
    romp: { n: 8, aBottom: 4.3, aTop: 3.0, top: 14.4 },
    kapTop: 17.3,
    asZ: 15.3,
    vlucht: 23.0,
    wiek: { breedte: 2.2, dikte: 1.0 },
    schuur: { as: 116.8, c: [-145.45, 260.46], t0: 2.5, nok: 6.4, kL: 0.48, kR: 0.75 },
    bag: [[-154.94, 263.17], [-153.75, 263.68], [-146.09, 245.67], [-133.56, 251.0], [-138.88, 263.52], [-142.76, 261.87], [-146.94, 271.7], [-150.58, 273.05], [-154.1, 271.56], [-155.51, 268.09], [-156.8, 267.54]],
    sample: [-154.8, 255.8],
  },
];

// ---------- onderdelen in lokale coördinaten ----------
// u langs de as naar de wieken, v 90 graden linksom, z boven het maaiveld;
// daarna gedraaid naar de asrichting en verschoven naar het hart.
function wieken(m) {
  const R = m.vlucht / 2;
  const u0 = m.vlak - m.wiek.dikte / 2;
  const u1 = m.vlak + m.wiek.dikte / 2;
  const half = m.wiek.breedte / 2;
  const arms = [];
  const tips = [];
  for (const a of [WIEK_HOEK, 180 - WIEK_HOEK, 180 + WIEK_HOEK, 360 - WIEK_HOEK]) {
    const d = [Math.cos(a * deg), Math.sin(a * deg)];
    const n = [-d[1], d[0]];
    const corners = [
      [-half * n[0], -half * n[1]],
      [half * n[0], half * n[1]],
      [R * d[0] + half * n[0], R * d[1] + half * n[1]],
      [R * d[0] - half * n[0], R * d[1] - half * n[1]],
    ].map(([v, z]) => [v, z + m.asZ]);
    arms.push(hull(corners.flatMap(([v, z]) => [[u0, v, z], [u1, v, z]])));
    if (d[1] < 0) tips.push({ corners: corners.slice(2), d });
  }
  return { cross: union(arms), tips, u0, u1 };
}

// As: van binnen de kap of het bovenhuis naar de wiekenplaat, met een schuine
// onderkant van 51 graden (helling 1,25).
function asBlok(m, uIn, u1) {
  const h = m.wiek.breedte > 2 ? 0.7 : 0.5;
  const drop = h + 1.25 * (u1 - uIn - 0.1);
  return hull([...box(uIn, uIn + 0.1, -h, h, m.asZ - drop, m.asZ + h), ...box(u1 - 0.6, u1, -h, h, m.asZ - h, m.asZ + h)]);
}

// Kap: van de bovenkant van de romp met een steile onderrand naar een
// langwerpige onderkant en dan als gebogen rieten kap naar de nok.
function kap(m, top, rTop) {
  const z0 = m.romp.top;
  const z1 = z0 + 0.9;
  const zn = m.kapTop;
  const w = rTop + 0.15;
  const k = rTop + 0.25;
  const stadium = [];
  for (let i = 0; i <= 8; i++) {
    const a = -90 + (180 * i) / 8;
    stadium.push([k - w + w * Math.cos(a * deg), w * Math.sin(a * deg)]);
    stadium.push([-k + w - w * Math.cos(a * deg), w * Math.sin(a * deg)]);
  }
  const mid = stadium.map(([u, v]) => [u * 0.92, v * 0.78]);
  const nok = Math.max(0.4, k - 1.6);
  return hull([
    ...at(top, z0),
    ...at(stadium, z1),
    ...at(mid, z0 + 0.55 * (zn - z0)),
    ...box(-nok, nok, -0.4, 0.4, zn - 0.01, zn),
  ]);
}

// Stellingmolen: onderbouw, kraag en stellingplaat, romp, kap, staart naar de
// stelling, as en wiekenkruis (lokaal).
function stellingMolen(m) {
  const s = m.stelling;
  const n = m.romp.n;
  const toR = (a, sides = 8) => a / Math.cos(Math.PI / sides);
  // Achtkant van onderbouw en stelling met platte zijden naar de as.
  const oct = (a) => ring(8, toR(a), 22.5);
  const zPlaat = s.z - STELLING.plaat;
  const zKraag = zPlaat - (s.r - m.onderbouw) * tanKraag;
  if (zKraag < 0.2) throw new Error(`${m.label}: kraag begint te laag (${zKraag.toFixed(2)})`);
  // Zeskant met een hoek naar de as, achtkant met een platte zijde.
  const rompRing = (a) => ring(n, toR(a, n), n === 8 ? 22.5 : 0);
  const parts = [
    frustum(oct(m.onderbouw), BASE, oct(m.onderbouw), zKraag),
    frustum(oct(m.onderbouw), zKraag - 0.01, oct(s.r + 0.01 / tanKraag), zPlaat + 0.01),
    frustum(oct(s.r), zPlaat, oct(s.r), s.z),
    frustum(rompRing(m.romp.aBottom), s.z - 0.01, rompRing(m.romp.aTop), m.romp.top),
  ];
  const rTop = toR(m.romp.aTop, n);
  parts.push(kap(m, rompRing(m.romp.aTop), rTop));
  const w = wieken(m);
  parts.push(w.cross, asBlok(m, m.romp.aTop - 1.2, w.u0 + 0.3));
  // Staart van de achterkant van de kap naar de rand van de stelling.
  const h = STAART / 2;
  const uTop = -(rTop + 0.25) + 0.8;
  const zTop = m.romp.top + 0.6;
  const uFoot = -(s.r - 0.6);
  parts.push(hull([...box(uTop - h, uTop + h, -h, h, zTop - h, zTop + h), ...box(uFoot - h, uFoot + h, -h, h, s.z - 0.3, s.z + STAART)]));
  return { local: union(parts), w, staartHoek: Math.atan2(zTop - (s.z + h), uTop - uFoot) / deg };
}

// Paltrok: de onderkast met de zaagvloer over de hele breedte, de rokken aan
// beide zijden, het smalle bovenhuis met een kap over de lengte, de as en het
// wiekenkruis (lokaal). De voet (de BAG-contour) komt erbij in wereldcoördinaten.
function paltrok(m) {
  const { kast, rok, huis } = m;
  const parts = [
    // Onderkast: dak van de zijkant naar het midden.
    hull([...box(kast.u0, kast.u1, -kast.half, kast.half, BASE, kast.zZij), ...box(kast.u0, kast.u1, -huis.half, huis.half, kast.zMid - 0.01, kast.zMid)]),
    // Rokken: van de zijkant van de onderkast schuin naar buiten.
    hull([...box(rok.u0, kast.u1, -kast.half, kast.half, BASE, kast.zZij), ...box(rok.u0, kast.u1, -rok.half, rok.half, BASE, rok.z)]),
    // Bovenhuis met zadeldak.
    hull([...box(huis.u0, kast.u1, -huis.half, huis.half, BASE, huis.goot), ...box(huis.u0 + 0.3, kast.u1 - 0.3, -0.3, 0.3, huis.nok - 0.01, huis.nok)]),
  ];
  const w = wieken(m);
  parts.push(w.cross, asBlok(m, kast.u1 - 0.6, w.u0 + 0.3));
  return { local: union(parts), w };
}

// Schuur in wereldcoördinaten: de BAG-contour tot een zadeldak met de nok
// langs de lange as, zonder het deel binnen de stelling.
function schuur(m) {
  const { as, c, t0, nok, kL, kR } = m.schuur;
  const d = [Math.cos(as * deg), Math.sin(as * deg)];
  const n = [-d[1], d[0]];
  const W = 12;
  const hAt = (t) => Math.max(2, nok - (t < t0 ? kL : kR) * Math.abs(t - t0));
  const profile = [
    [-W, BASE - 1],
    [W, BASE - 1],
    [W, hAt(W)],
    [t0, nok],
    [-W, hAt(-W)],
  ];
  const pts = [];
  for (const s of [-40, 40]) {
    for (const [t, z] of profile) pts.push([c[0] + s * d[0] + t * n[0], c[1] + s * d[1] + t * n[1], z]);
  }
  const wedge = hull(pts);
  const toR = (a) => a / Math.cos(Math.PI / 8);
  // Onder de kraag blijft de schuur staan; daarboven neemt de stelling het over.
  const zKraag = m.stelling.z - STELLING.plaat - (m.stelling.r - m.onderbouw) * tanKraag;
  const stelling = prism(ring(8, toR(m.stelling.r), 22.5 + m.as), zKraag, 40).translate([m.c[0], m.c[1], 0]);
  return Manifold.intersection(prism(m.bag, BASE, 30), wedge).subtract(stelling);
}

function buildMill(m) {
  const built = m.type === "paltrok" ? paltrok(m) : stellingMolen(m);
  const place = (s) => s.rotate([0, 0, m.as]).translate([m.c[0], m.c[1], 0]);
  // Printsteun onder de punten van de onderste wieken (alleen in de STL):
  // de punt recht naar beneden doorgetrokken tot de onderkant.
  const w = built.w;
  const steun = union(
    w.tips.map(({ corners, d }) => {
      const pts = corners.flatMap(([v, z]) => [-0.3, 0.05].map((k) => [v + k * d[0], z + k * d[1]]));
      return hull(pts.flatMap(([v, z]) => [[w.u0, v, z], [w.u1, v, z], [w.u0, v, BASE], [w.u1, v, BASE]]));
    }),
  );
  const extra = m.type === "paltrok" ? prism(m.bag, BASE, 1.0) : schuur(m);
  const solid = union([place(built.local), extra]);
  const a = m.as * deg;
  const tipPoints = w.tips.flatMap(({ corners }) =>
    corners.map(([v, z]) => [m.c[0] + m.vlak * Math.cos(a) - v * Math.sin(a), m.c[1] + m.vlak * Math.sin(a) + v * Math.cos(a), z]),
  );
  return {
    m,
    solid,
    print: union([solid, place(steun)]),
    tipPoints,
    lowTipZ: Math.min(...w.tips.flatMap(({ corners }) => corners.map(([, z]) => z))),
    staartHoek: built.staartHoek,
  };
}

const built = MILLS.map(buildMill);
const parts = built.map((b) => [`building:${b.m.label}`, b.solid]);

// ---------- controles ----------
// Ondervlakken die vlakker dan 45 graden hangen, boven de onderkant: in het
// model alleen de punten van de onderste wieken (op 1:1000 vult de export
// daaronder een paaltje op), in de printversie geen.
function overhangs(solid) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  const found = [];
  let area = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((a) => v[mesh.triVerts[t + k] * s + a]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-4) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...n);
    if (len < 1e-9 || n[2] > -Math.SQRT1_2 * len) continue;
    area += len / 2;
    // Naden van een paar millimeter breed (waar twee vlakken op dezelfde
    // hoogte samenkomen) tellen mee in de oppervlakte maar niet als plek.
    if (len / 2 > 0.01) found.push(p);
  }
  return { area, found };
}
for (const b of built) {
  for (const [name, solid] of [["model", b.solid], ["print", b.print]]) {
    if (solid.status() !== "NoError") throw new Error(`${b.m.label} ${name}: ${solid.status()}`);
    const bb = solid.boundingBox();
    if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${b.m.label} ${name}: onderkant op ${bb.min[2]}`);
  }
  const { area, found } = overhangs(b.solid);
  for (const p of found) {
    const mid = [0, 1, 2].map((i) => (p[0][i] + p[1][i] + p[2][i]) / 3);
    if (Math.min(...b.tipPoints.map((q) => Math.hypot(q[0] - mid[0], q[1] - mid[1], q[2] - mid[2]))) > 2.0) {
      throw new Error(`${b.m.label}: overhang buiten de wiekpunten op z ${mid[2].toFixed(2)}: ${JSON.stringify(p.map((q) => q.map((c) => +c.toFixed(2))))}`);
    }
  }
  if (area > 6) throw new Error(`${b.m.label}: te veel overhang (${area.toFixed(1)} m2)`);
  const print = overhangs(b.print);
  if (print.area > 0.05) {
    throw new Error(`${b.m.label}: printversie heeft overhang (${print.area.toFixed(2)} m2): ${JSON.stringify(print.found.slice(0, 3).map((p) => p.map((q) => q.map((c) => +c.toFixed(2)))))}`);
  }
  b.tipOverhang = +area.toFixed(2);
  const floor = b.m.type === "paltrok" ? 1 : b.m.stelling.z;
  if (b.lowTipZ < floor + 0.3) throw new Error(`${b.m.label}: onderste wiek te dicht bij de stelling of het maaiveld`);
  if (b.staartHoek !== undefined && b.staartHoek < 50) throw new Error(`${b.m.label}: staart te vlak (${b.staartHoek.toFixed(1)} graden)`);
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
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
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
    meshes.push({
      name,
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
    nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
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
const report = { molens: {} };
for (const b of built) {
  const bb = b.solid.boundingBox();
  report.molens[b.m.label] = {
    status: b.solid.status(),
    genus: b.solid.genus(),
    triangles: b.solid.numTri(),
    volumeM3: Math.round(b.solid.volume()),
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
    asBovenVoet: b.m.asZ,
    wiekpuntBovenVoet: +b.lowTipZ.toFixed(2),
    wiekpuntOverhangM2: b.tipOverhang,
    staartGraden: b.staartHoek === undefined ? undefined : +b.staartHoek.toFixed(1),
  };
}
const glbFile = path.join(outDir, "zaanse-schans.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-zaanse-schans.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

// De STL zet de zes molens naast elkaar op het printbed (drie per rij, de as
// naar +Y, het wiekenvlak langs X), elk met zijn onderkant op z = 0 en een
// printsteun onder de onderste wiekpunten.
const GAP = 3;
const placed = built.map((b) => b.print.translate([-b.m.c[0], -b.m.c[1], 0]).rotate([0, 0, 90 - b.m.as]));
const rows = [placed.slice(0, 3), placed.slice(3)];
const printParts = [];
let y = 0;
for (const row of rows) {
  let x = 0;
  let depth = 0;
  for (const solid of row) {
    const bb = solid.boundingBox();
    printParts.push(solid.translate([x - bb.min[0], y - bb.max[1], -BASE]));
    x += bb.max[0] - bb.min[0] + GAP;
    depth = Math.max(depth, bb.max[1] - bb.min[1]);
  }
  y -= depth + GAP;
}
const printSolid = union(printParts);
const stlName = `zaanse-schans-1-${scale}.stl`;
const { buffer, triangles } = toStl(printSolid, `NederPrint Zaanse Schans 1:${scale} mm Z-up`);
await writeFile(path.join(outDir, stlName), buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: path.join(outDir, stlName),
  status: printSolid.status(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts.
const stellingMolens = MILLS.filter((m) => m.type === "stelling");
await writeFile(
  path.join(outDir, "zaanse-schans.json"),
  JSON.stringify(
    {
      name: "Zaanse Schans",
      file: "zaanse-schans.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [116160, 498810],
      xAxis: [1, 0],
      groundOffsetMetres: 0,
      // Op het maaiveld naast elke molen, buiten de stelling en de schuur.
      groundSamplePoints: MILLS.map((m) => m.sample),
      // PDOK-hoogte van dat maaiveld, voor een uitsnede zonder een van die punten.
      groundHeight: GROUND_HEIGHT,
      replacesBuildings: MILLS.map((m) => `NL.IMBAG.Pand.${m.pand}`),
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op de Zaan voor de molenrij van de Zaanse Schans (RD 116160, 498810) op maaiveldhoogte bij de molens (z = 0, circa NAP 0,0 m), +X naar het oosten en +Y naar het noorden. Zes nodes building:<molen>, één per molen langs de Kalverringdijk van zuid naar noord: De Huisman, de paltrok De Gekroonde Poelenburg, De Kat, De Zoeker, Het Jonge Schaap en, 330 m noordwestelijker, De Bonte Hen. Elke stellingmolen heeft een onderbouw, een stelling als dichte plaat op een kraag van 50 graden, een achtkant (Het Jonge Schaap een zeskant), een rietgedekte kap, een staart naar de stelling, een wiekenkruis als plaat van 1,0 m dik in X-stand onder 50 graden voor de kap in de asrichting uit het AHN, en de schuur uit hetzelfde BAG-pand met een zadeldak; de paltrok heeft een voet op de BAG-contour, de onderkast met rokken en het bovenhuis. Alles begint op z = -1,0 m. Nodenaam klasse:label bepaalt de materiaalklasse.",
      printFiles: [stlName],
      realWorld: {
        molens: MILLS.length,
        vluchtM: Object.fromEntries(MILLS.map((m) => [m.label, m.vlucht])),
        stellingBovenMaaiveldM: Object.fromEntries(stellingMolens.map((m) => [m.label, m.stelling.z])),
        kapBovenMaaiveldM: Object.fromEntries(MILLS.map((m) => [m.label, m.kapTop ?? m.huis.nok])),
        asBovenMaaiveldM: Object.fromEntries(MILLS.map((m) => [m.label, m.asZ])),
        wiekStandGraden: WIEK_HOEK,
        stellingKraagGraden: STELLING.kraag,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Zaanse_Schans",
        "https://www.molendatabase.nl (De Huisman, De Gekroonde Poelenburg, De Kat, De Zoeker, Het Jonge Schaap, De Bonte Hen: type, vlucht, stellinghoogte)",
        "https://www.zaanschemolen.nl (adressen en bouwjaren)",
        "PDOK BAG (panden en adressen van de zes molens), EPSG:28992",
        "PDOK AHN DSM en DTM 0,5 m via WCS voor stelling, schuur, kap, asrichting, wiekenvlak en maaiveld",
        "PDOK luchtfoto (stelling en asrichting van De Huisman)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

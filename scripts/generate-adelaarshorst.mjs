// Genereert een gedetailleerd, gesloten 3D-model van De Adelaarshorst in
// Deventer (thuisstadion van Go Ahead Eagles sinds 1920, aan de Vetkampstraat).
// Het model vervangt de PDOK-reconstructie van de hoofdtribune, de tribune aan
// de Vetkampstraat en het lage gebouw in de westhoek, en voegt de twee oude
// overdekte staantribunes toe die geen BAG-pand zijn (PDOK heeft ze niet). Het
// bestaat uit: de hoofdtribune (zuidwest) met een vakwerkdak als dakplaat van
// 1,5 tot 3,3 m dik boven een zitrang van tien treden, getrapte eindwanden met
// een bakstenen kopblok en raamnissen, het driehoekige frontje midden op de
// dakrand, de open dakspanten boven het achterste middendeel en het lage
// achtergebouw met de entree; de tribune aan de Vetkampstraat (zuidoost, 2015)
// met een hoger vakwerkdak (+16,1 m) boven een steile zitrang van twaalf
// treden, een achterblok met een schuin onderstek boven de straat en getrapte
// eindwanden; de IJsseltribune (noordoost) en de Brinkgreverwegtribune
// (noordwest), lage lessenaarsdaken op een rij kolommen boven een staanrang van
// tien treden tegen de aarden wal, met de gesloten noordhoek waar beide daken
// samenkomen; de vier vakwerk-lichtmasten (oude hoogspanningsmasten met de
// lampkop van 2015); het lage gebouw met de tent in de westhoek, de wand van
// containers in de oosthoek en de bakstenen muur aan de Vetkampstraat met de
// kiosken en de poort. Alles is opgebouwd uit dwarsprofielen die langs de
// tribune zijn uitgetrokken, blokken, prisma's en convexe rompen van vlakken
// (geen hoogteveld); het Mapbox-model is niet gebruikt. Alle maten in het
// script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-adelaarshorst.mjs              # 1:1000 (standaard)
//   node scripts/generate-adelaarshorst.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van de veldopening op maaiveldniveau
// (NAP +6,4 m), Z omhoog. +X loopt langs de lengteas van het veld naar het
// zuidoosten, naar de Vetkampstraat (RD-richting (0,711045, -0,703147),
// -44,68 graden), +Y dwars daarop naar het noordoosten (de IJsseltribune); de
// hoofdtribune ligt aan de -Y-kant, de Brinkgreverwegtribune aan de -X-kant.
//
// Overhang: de dakplaten, het frontje, de dakspanten en de lampkoppen hangen
// uit (ondervlakken onder 45 graden boven OVERHANG_MIN_Z); onder die hoogte
// blijft elk ondervlak steiler dan 45 graden. De export vult ze op bij het printen.
//
// Bronnen: BAG-panden 0150100000056207 (hoofdtribune met achtergebouw),
// 0150100000062379 (tribune aan de Vetkampstraat, 2015) en 0150100000056456
// (gebouw in de westhoek; PDOK reconstrueert het tot +12,3 m, het AHN ziet
// +3 m), vervangen; AHN DSM/DTM 0,5 m (PDOK WCS) voor de voorranden van de
// tribunes (veldopening van x = -58,2 tot 57,95 en y = -38,8 tot 38,65 m), de
// dakprofielen (hoofdtribune +11,25 m aan de veldkant, nok +12,45 m op 8,7 m,
// +10,95 m achter; Vetkampstraat +13,2, +14,6 en +16,1 m op 1,6 en 6,65 m,
// +14,9 m achter; IJssel- en Brinkgreverwegtribune +8,3 m naar +7,0 m), de
// uiteinden van de daken, het frontje (+13,3 m), de open dakspanten, het
// achtergebouw (+8,45 m), de aarden wal achter de noordtribunes (tot +4,4 m,
// DTM), de westhoek (+3,0 m met een tent tot +5,2 m), de containerwand
// (+5,7 m) en de drie masten in het AHN (+41,6, +42,1 en +40,3 m); PDOK
// luchtfoto (Actueel_orthoHR) voor de plattegrond, de schuine noordhoek, de
// dakspanten (zes op 7,5 m), de vierde mast in de noordhoek (ontbreekt in het
// AHN, staat op de luchtfoto en op foto's) en de muur aan de Vetkampstraat met
// drie kiosken en de poort; Wikimedia Commons: De Adelaarshorst, Deventer
// (2019) 01, 02 en 05, Stadion de Adelaarshorst, Adelaarshorst-uitvak en De
// Adelaarshorst in Deventer (Detail) (vakwerkdaken met open kopse kanten,
// getrapte bakstenen eindwanden, glazen windschermen, kolommen onder de
// noordtribunes, masten met lampkop, muur met kiosken en poort, rode gevel met
// entree); Wikipedia (10.400 plaatsen, verbouwing 2015 door I'M Architecten).
// Geschat: de treden van de rangen (het AHN ziet alleen de daken), de
// onderkant van de dakplaten, de plaats van de kolommen, de doorsnede van de
// masten en de lampkoppen, de hoogte van de vierde mast (+41,5 m), het
// onderstek aan de Vetkampstraat, de raamnissen en de plaats van de entree.
// Weggelaten: de glazen windschermen op de eindwanden (glas; de rang blijft van
// opzij zichtbaar), de stoeltjes, hekken, leuningen en reclameborden, de
// zonnepanelen, de tijdelijke tent en unit in de oosthoek, losse containers en
// schuurtjes, de antennes op de zuidmast, het hekwerk van de poort en het beeld
// van Han Hollander (kleiner dan 0,9 m of tijdelijk).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "adelaarshorst");
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
// Convexe romp van twee rechthoeken (x0, x1, y0, y1) op de hoogtes z0 en z1.
const frustum = (r0, z0, r1, z1) =>
  hull([
    ...[[r0[0], r0[2]], [r0[1], r0[2]], [r0[1], r0[3]], [r0[0], r0[3]]].map(([x, y]) => [x, y, z0]),
    ...[[r1[0], r1[2]], [r1[1], r1[2]], [r1[1], r1[3]], [r1[0], r1[3]]].map(([x, y]) => [x, y, z1]),
  ]);
// Lineaire interpolatie van een polylijn (ns stijgend) op positie n.
const lerpAt = (ns, zs, n) => {
  if (n <= ns[0]) return zs[0];
  for (let i = 1; i < ns.length; i++) {
    if (n <= ns[i]) return zs[i - 1] + ((zs[i] - zs[i - 1]) * (n - ns[i - 1])) / (ns[i] - ns[i - 1]);
  }
  return zs[zs.length - 1];
};

const SLUG = "adelaarshorst";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +6,4 m) ----------
const ORIGIN = [208622.1, 474998.6];
const X_AXIS = [0.711045, -0.703147]; // RD-richting -44,68 graden, langs het veld naar de Vetkampstraat
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// Overlap tussen aangrenzende stukken (rakende vlakken laten spleten achter).
const OVERLAP = 0.02;
// Naar beneden gerichte vlakken boven deze hoogte zijn bedoelde uitkragingen
// (dakplaten, frontje, dakspanten, onderstek, lampkoppen); daaronder blijft elk ondervlak steiler dan 45 graden.
const OVERHANG_MIN_Z = 4.0;

// Elke tribune heeft een eigen kader: `a` loopt langs de tribune, `n` vanaf de
// voorrand (de veldkant, uit het AHN) naar achteren. Een doorsnede [n, z] wordt
// langs `a` uitgetrokken.
const FRONT = { sw: -38.8, se: 57.95, ne: 38.65, nw: -58.2 };
const FRAMES = {
  sw: (a, n) => [a, FRONT.sw - n],
  se: (a, n) => [FRONT.se + n, a],
  ne: (a, n) => [a, FRONT.ne + n],
  nw: (a, n) => [FRONT.nw - n, a],
};
// Convexe doorsnede (punten [n, z]) uitgetrokken van a0 tot a1 in kader f.
const sweep = (f, quad, a0, a1) =>
  hull([...quad.map(([n, z]) => [...FRAMES[f](a0, n), z]), ...quad.map(([n, z]) => [...FRAMES[f](a1, n), z])]);
// Blok in kader f: a0..a1, n0..n1, z0..z1.
const fbox = (f, a0, a1, n0, n1, z0, z1) => sweep(f, [[n0, z0], [n1, z0], [n1, z1], [n0, z1]], a0, a1);

// Dakplaat: bovenkant `top` en onderkant `under` op de stations `n`, per vak een convex stuk.
const roofSlab = (f, roof, a0, a1) => {
  const parts = [];
  for (let i = 0; i + 1 < roof.n.length; i++) {
    const n0 = roof.n[i] - (i > 0 ? OVERLAP : 0);
    const n1 = roof.n[i + 1] + (i + 2 < roof.n.length ? OVERLAP : 0);
    const u = (n) => lerpAt(roof.n, roof.under, n);
    const t = (n) => lerpAt(roof.n, roof.top, n);
    parts.push(sweep(f, [[n0, u(n0)], [n1, u(n1)], [n1, t(n1)], [n0, t(n0)]], a0, a1));
  }
  return Manifold.union(parts);
};
// Rang van `steps` treden van n0 tot n1, eerste trede op z0, laatste op z1 (of de hoogtes `zs`), massief tot de onderkant.
const rakeSteps = ({ n0, n1, z0, z1, steps, zs }) =>
  Array.from({ length: steps }, (_, j) => {
    const a = n0 + ((n1 - n0) * j) / steps - (j > 0 ? OVERLAP : 0);
    const b = n0 + ((n1 - n0) * (j + 1)) / steps + OVERLAP;
    const z = zs ? zs[j] : z0 + ((z1 - z0) * j) / (steps - 1);
    return { a, b, z };
  });
const rake = (f, r, a0, a1) => Manifold.union(rakeSteps(r).map(({ a, b, z }) => fbox(f, a0, a1, a, b, BASE, z)));
// Getrapte eindwand van a0 tot a1 die de rang `r` volgt, `rise` boven elke trede.
const steppedWall = (f, r, a0, a1, rise) => Manifold.union(rakeSteps(r).map(({ a, b, z }) => fbox(f, a0, a1, a, b, BASE, z + rise)));
// Blinde driehoeken (0,4 m diep) in de kopse kant van een dakplaat op a = aEnd (dir +1: de kant ligt aan de
// +a-zijde), afwisselend met de punt omhoog en omlaag, als het vakwerk van de spanten.
const trussNiches = (f, roof, aEnd, dir, n0, n1, width) => {
  const cuts = [];
  const depth = 0.4;
  const aIn = aEnd - dir * depth;
  const aOut = aEnd + dir * 1.0;
  const under = (n) => lerpAt(roof.n, roof.under, n);
  const top = (n) => lerpAt(roof.n, roof.top, n);
  const gap = 1.4;
  for (let n = n0, k = 0; n + width <= n1 + 1e-6; n += width / 2 + gap / 2, k++) {
    const m = n + width / 2;
    const zb = Math.max(under(n), under(n + width)) + 0.35;
    const zt = Math.min(top(n), top(n + width)) - 0.35;
    if (zt - zb < 1.0) continue;
    const tri = k % 2 === 0 ? [[n, zb], [n + width, zb], [m, zt]] : [[n, zt], [n + width, zt], [m, zb]];
    cuts.push(hull([...tri.map(([nn, z]) => [...FRAMES[f](aIn, nn), z]), ...tri.map(([nn, z]) => [...FRAMES[f](aOut, nn), z])]));
  }
  return cuts;
};

// ---------- de hoofdtribune (zuidwest, kader sw: a = x, n vanaf y = -38,8 naar -y) ----------
// Vakwerkdak van x = -48,5 tot 49,25 (AHN), bovenkant +11,25 m aan de veldkant, nok +12,45 m op 8,7 m,
// +10,95 m aan de achterrand (n = 22,95, y = -61,75). De onderkant (geschat) loopt van +9,75 naar +8,75 m.
const MAIN = {
  roofA: [-48.5, 49.25],
  roof: { n: [0, 8.7, 22.95], top: [11.25, 12.45, 10.95], under: [9.75, 9.15, 8.75] },
  // BAG-contour: de tribune zelf van x = -43,7 tot 44,4; eindwanden van 1,0 m.
  ends: [[-43.7, -42.7], [43.4, 44.4]],
  // Zitrang van tien treden (geschat): eerste rijen aan het veld op +0,9 m, achterste op +6,9 m bij n = 18,2.
  rake: { n0: 0.0, n1: 18.2, z0: 0.9, z1: 6.9, steps: 10 },
  backN: [18.2, 22.95],
  // Kopblok in de eindwanden (baksteen met ramen) vanaf n = 12,5.
  endBlockN: 12.5,
  windows: { n: [14.2, 17.0, 19.8], z: [5.4, 7.0], width: 2.0, depth: 0.35 },
  // Het frontje midden op de dakrand (luchtfoto: x -3,3 tot 3,3 m, punt 7,7 m achter de rand; AHN +13,3 m).
  gable: { half: 3.3, apex: 13.3, back: 7.7 },
  // Achter het midden ontbreekt de dakhuid (luchtfoto: zwarte spanten boven het achtergebouw): x -20 tot 17,5,
  // n 18,2 tot 22,95, met zes spanten op 7,5 m.
  notch: { a: [-20, 17.5], n: [18.2, 22.95] },
  trusses: [-20, -12.5, -5, 2.5, 10, 17.5],
  // Kolommen onder de uitkragende dakeinden (foto 2019 02 en 05).
  posts: [-47.6, 48.35],
};
// Achtergebouw (AHN +8,45 m, rode gevel) met schuine zijkanten.
const BACK_BUILDING = {
  pts: [[-48.5, -61.5], [49.25, -61.5], [49.0, -62.5], [24.2, -72.25], [-23.4, -72.25], [-47.5, -62.5]],
  top: 8.45,
  // Entree met grijze omlijsting in het midden van de achtergevel (foto Detail; plaats geschat).
  entrance: { x: [-7, 7], out: 0.6, top: 9.4, door: [-5.5, 5.5], doorTop: 3.4, band: [5.0, 6.8] },
};
const mainParts = [];
const mainCuts = [];
{
  const { roofA, roof, ends, rake: r, backN, endBlockN, windows, gable, notch, trusses, posts } = MAIN;
  const under = (n) => lerpAt(roof.n, roof.under, n);
  const top = (n) => lerpAt(roof.n, roof.top, n);
  // Dakplaat met de uitsparing boven het achterste middendeel.
  const slab = roofSlab("sw", roof, roofA[0], roofA[1]).subtract(fbox("sw", notch.a[0], notch.a[1], notch.n[0], notch.n[1] + 1, 8.0, 20));
  mainParts.push(slab);
  // Het frontje: een driehoekige gevel aan de dakrand met een nok die naar achteren in het dak verdwijnt.
  mainParts.push(
    hull([
      [-gable.half, FRONT.sw, roof.under[0] + 0.45],
      [gable.half, FRONT.sw, roof.under[0] + 0.45],
      [-gable.half, FRONT.sw, roof.top[0]],
      [gable.half, FRONT.sw, roof.top[0]],
      [0, FRONT.sw, gable.apex],
      [0, FRONT.sw - gable.back, top(gable.back) - 0.15],
      [0, FRONT.sw - gable.back, roof.under[0] + 0.45],
    ]),
  );
  // Zitrang tussen de eindwanden, achterwand (baksteen) tot in de dakplaat; onder de uitsparing tot het achtergebouw.
  mainParts.push(rake("sw", r, ends[0][1] - OVERLAP, ends[1][0] + OVERLAP));
  mainParts.push(sweep("sw", [[backN[0] - OVERLAP, BASE], [backN[1], BASE], [backN[1], under(backN[1]) + 0.3], [backN[0] - OVERLAP, under(backN[0]) + 0.3]], ends[0][0], notch.a[0] + OVERLAP));
  mainParts.push(sweep("sw", [[backN[0] - OVERLAP, BASE], [backN[1], BASE], [backN[1], under(backN[1]) + 0.3], [backN[0] - OVERLAP, under(backN[0]) + 0.3]], notch.a[1] - OVERLAP, ends[1][1]));
  mainParts.push(fbox("sw", notch.a[0], notch.a[1], backN[0] - OVERLAP, backN[1], BASE, BACK_BUILDING.top));
  // Getrapte eindwanden (1,1 m boven de treden) met een kopblok tot de dakplaat.
  for (const [a0, a1] of ends) {
    mainParts.push(steppedWall("sw", r, a0, a1, 1.1));
    mainParts.push(sweep("sw", [[endBlockN, BASE], [backN[1], BASE], [backN[1], under(backN[1]) + 0.3], [endBlockN, under(endBlockN) + 0.3]], a0, a1));
    // Raamnissen in de buitenkant van het kopblok.
    const outside = a0 < 0 ? a0 : a1;
    const dir = a0 < 0 ? -1 : 1;
    for (const n of windows.n) {
      mainCuts.push(fbox("sw", outside - dir * windows.depth, outside + dir * 1.0, n - windows.width / 2, n + windows.width / 2, windows.z[0], windows.z[1]));
    }
  }
  // Open dakspanten boven het achtergebouw: platen van 0,9 m met een driehoekige opening (zijden 52 graden),
  // en een randligger langs de achterkant.
  for (const a of trusses) {
    const n0 = notch.n[0] - OVERLAP;
    const n1 = notch.n[1];
    mainParts.push(sweep("sw", [[n0, BACK_BUILDING.top - 0.3], [n1, BACK_BUILDING.top - 0.3], [n1, top(n1)], [n0, top(n0)]], a - 0.45, a + 0.45));
    const m = (n0 + n1) / 2;
    mainCuts.push(sweep("sw", [[m - 1.3, BACK_BUILDING.top + 0.5], [m + 1.3, BACK_BUILDING.top + 0.5], [m, BACK_BUILDING.top + 2.15]], a - 1, a + 1));
  }
  mainParts.push(sweep("sw", [[notch.n[1] - 0.9, top(notch.n[1] - 0.9) - 0.9], [notch.n[1], top(notch.n[1]) - 0.9], [notch.n[1], top(notch.n[1])], [notch.n[1] - 0.9, top(notch.n[1] - 0.9)]], notch.a[0], notch.a[1]));
  // Kolommen onder de dakeinden.
  for (const a of posts) mainParts.push(fbox("sw", a - 0.45, a + 0.45, 0.6, 1.5, BASE, under(1.5) + 0.3));
  // Vakwerk in de kopse kanten van de dakplaat.
  mainCuts.push(...trussNiches("sw", roof, roofA[0], -1, 1.0, 22.0, 3.0), ...trussNiches("sw", roof, roofA[1], 1, 1.0, 22.0, 3.0));
}
// Achtergebouw met de entree.
{
  const { pts, top, entrance: e } = BACK_BUILDING;
  const back = -72.25;
  mainParts.push(prism(pts, BASE, top));
  mainParts.push(box(e.x[0], e.x[1], back - e.out, back + OVERLAP, BASE, e.top));
  // Deurnis van 0,4 m met een plafond onder 45 graden (printbaar zonder steun).
  const yo = back - e.out;
  mainCuts.push(
    hull([e.door[0], e.door[1]].flatMap((x) => [[x, yo - 1, BASE - 1], [x, yo + 0.4, BASE - 1], [x, yo + 0.4, e.doorTop - 0.55], [x, yo, e.doorTop], [x, yo - 1, e.doorTop]])),
  );
  mainCuts.push(box(e.x[0] + 1.0, e.x[1] - 1.0, back - e.out - 1, back - e.out + 0.35, e.band[0], e.band[1]));
}
const mainStand = Manifold.union(mainParts).subtract(Manifold.union(mainCuts));

// ---------- de tribune aan de Vetkampstraat (zuidoost, kader se: a = y, n vanaf x = 57,95 naar +x) ----------
// Vakwerkdak (2015) van y = -36,0 tot 37,5 en tot n = 23,4 (x = 81,35), AHN: +13,2 m aan de veldkant, +14,6 m
// op 1,6 m, nok +16,1 m op 6,65 m, +14,9 m achter. Onderkant (geschat) +11,7 tot +12,5 m.
const SE = {
  roofA: [-36.0, 37.5],
  roof: { n: [0, 1.6, 6.65, 23.4], top: [13.2, 14.6, 16.1, 14.9], under: [11.7, 11.9, 12.4, 12.5] },
  // BAG-contour y -34,93 tot 37,31, eindwanden van 1,0 m.
  ends: [[-34.93, -33.93], [36.31, 37.31]],
  // Steile zitrang van twaalf treden (geschat uit de getrapte eindwand op de foto's): +0,8 tot +9,8 m.
  rake: { n0: 0.0, n1: 17.0, z0: 0.8, z1: 9.8, steps: 12 },
  // Achterblok vanaf de BAG-achtergevel (x = 73,65, n = 15,7) tot de dakrand, met een schuin onderstek boven
  // de stoep: 3,8 m diep, van +4,0 m tegen de onderbouw naar +6,0 m aan de gevel.
  back: { n0: 15.7, soffit: [[19.6, 4.0], [23.4, 6.0]] },
  // Stijlen van de glazen windschermen op de eindwanden (foto 2019 02 en 05; plaats geschat).
  screenPosts: [3.5, 7.5, 11.5],
};
const seParts = [];
const seCuts = [];
{
  const { roofA, roof, ends, rake: r, back } = SE;
  const under = (n) => lerpAt(roof.n, roof.under, n);
  const nEnd = roof.n[roof.n.length - 1];
  seParts.push(roofSlab("se", roof, roofA[0], roofA[1]));
  seParts.push(rake("se", r, ends[0][1] - OVERLAP, ends[1][0] + OVERLAP));
  seParts.push(sweep("se", [[back.n0, BASE], [nEnd, BASE], [nEnd, under(nEnd) + 0.3], [back.n0, under(back.n0) + 0.3]], ends[0][0], ends[1][1]));
  for (const [a0, a1] of ends) {
    seParts.push(steppedWall("se", r, a0, a1, 1.1));
    // Stijlen van het glazen windscherm op de eindwand (0,9 m; het glas zelf is weggelaten).
    for (const n of SE.screenPosts) {
      const j = rakeSteps(r).findIndex(({ a, b }) => n >= a && n <= b);
      const z0 = rakeSteps(r)[j].z + 1.0;
      seParts.push(fbox("se", a0, a1, n - 0.45, n + 0.45, z0, under(n + 0.45) + 0.3));
    }
  }
  const [[s0, z0], [s1, z1]] = back.soffit;
  seCuts.push(sweep("se", [[s0, BASE - 1], [s1 + 1, BASE - 1], [s1 + 1, z1 + (z1 - z0) / (s1 - s0)], [s0, z0]], roofA[0] - 1, roofA[1] + 1));
  seCuts.push(...trussNiches("se", roof, roofA[0], -1, 1.2, 22.4, 3.2), ...trussNiches("se", roof, roofA[1], 1, 1.2, 22.4, 3.2));
}
const seStand = Manifold.union(seParts).subtract(Manifold.union(seCuts));

// ---------- de IJsseltribune (noordoost) en de Brinkgreverwegtribune (noordwest) ----------
// Lessenaarsdaken (AHN): +8,3 m aan de veldkant naar +7,0 m achter, 1,5 m dik, op een rij kolommen van
// 0,9 m aan de voorrand; daaronder een staanrang van tien treden tegen de aarden wal en een achterwand van
// 0,9 m. De wal zelf zit in het PDOK-terrein (tot +4,4 m achter de tribunes, onder het dak geïnterpoleerd);
// de treden lopen naar achteren steiler op (+1,15 tot +5,2 m) zodat ze overal minstens 0,25 m boven dat
// terrein blijven (gemeten in de PDOK-tegel).
const NORTH = {
  ne: { roofA: [-61.0, 60.1], depth: 15.65, rakeA: [-58.2, 59.2], end: [59.2, 60.1], posts: Array.from({ length: 13 }, (_, k) => -55.2 + 9.2 * k) },
  nw: { roofA: [-36.0, 40.0], depth: 15.6, rakeA: [-35.1, 38.65], end: [-36.0, -35.1], posts: Array.from({ length: 9 }, (_, k) => -31.6 + 8.4 * k) },
  top: [8.3, 7.0],
  thick: 1.5,
  rake: { n0: 0.0, steps: 10, zs: [1.15, 1.6, 2.05, 2.5, 3.3, 3.85, 4.5, 4.75, 5.0, 5.2] },
};
// De gesloten noordhoek: de daken komen samen boven een dichte hoek met een schuine achterkant (luchtfoto).
const NORTH_CORNER = {
  mass: [[-73.8, 38.65], [-73.8, 40.0], [-68.0, 40.5], [-61.0, 48.0], [-61.0, 53.4], [-58.2, 53.4], [-58.2, 38.65]],
  roof: [[-73.8, 39.9], [-68.0, 40.5], [-61.0, 48.0], [-61.0, 39.9]],
  roofZ: [6.1, 7.6],
  massTop: 6.4,
};
const northParts = [];
const northCuts = [];
for (const f of ["ne", "nw"]) {
  const s = NORTH[f];
  const roof = { n: [0, s.depth], top: NORTH.top, under: NORTH.top.map((z) => z - NORTH.thick) };
  const under = (n) => lerpAt(roof.n, roof.under, n);
  const r = { ...NORTH.rake, n1: s.depth - 0.9 };
  northParts.push(roofSlab(f, roof, s.roofA[0], s.roofA[1]));
  northParts.push(rake(f, r, s.rakeA[0] - (f === "ne" ? OVERLAP : 0), s.rakeA[1] + (f === "nw" ? OVERLAP : 0)));
  northParts.push(sweep(f, [[s.depth - 0.9 - OVERLAP, BASE], [s.depth, BASE], [s.depth, under(s.depth) + 0.3], [s.depth - 0.9 - OVERLAP, under(s.depth - 0.9) + 0.3]], s.roofA[0], s.roofA[1]));
  northParts.push(steppedWall(f, r, s.end[0], s.end[1], 1.1));
  for (const a of s.posts) northParts.push(fbox(f, a - 0.45, a + 0.45, 0.35, 1.25, BASE, under(1.25) + 0.3));
  // Bord met reclame langs de voorrand: de dakrand 0,5 m verlaagd over de eerste 0,9 m.
  northParts.push(fbox(f, s.roofA[0], s.roofA[1], 0, 0.9, roof.under[0] - 0.5, roof.under[0] + 0.3));
}
northParts.push(prism(NORTH_CORNER.mass, BASE, NORTH_CORNER.massTop));
northParts.push(prism(NORTH_CORNER.roof, NORTH_CORNER.roofZ[0], NORTH_CORNER.roofZ[1]));
const northStands = Manifold.union(northParts);

// ---------- de westhoek: laag gebouw (BAG 0150100000056456, +3,0 m) met een tent (tot +5,2 m) ----------
const WEST_CORNER = {
  building: [-64.3, -57.2, -55.2, -46.0],
  top: 3.0,
  tent: { x: [-57.2, -49.6], y: [-54.0, -46.2], eave: 3.0, apex: 5.2 },
};
const westCorner = (() => {
  const { building: b, top, tent: t } = WEST_CORNER;
  const cx = (t.x[0] + t.x[1]) / 2;
  const cy = (t.y[0] + t.y[1]) / 2;
  return Manifold.union([
    box(b[0], b[1] + OVERLAP, b[2], b[3], BASE, top),
    box(t.x[0], t.x[1], t.y[0], t.y[1], BASE, t.eave),
    frustum([t.x[0], t.x[1], t.y[0], t.y[1]], t.eave - OVERLAP, [cx - 0.5, cx + 0.5, cy - 0.5, cy + 0.5], t.apex),
  ]);
})();

// ---------- de oosthoek: langwerpige wand (vermoedelijk gestapelde containers, AHN +5,7 m, 1,8 m breed) ----------
const EAST_WALL = { x: [62.3, 64.1], y: [37.4, 69.4], top: 5.7 };
const eastWall = box(EAST_WALL.x[0], EAST_WALL.x[1], EAST_WALL.y[0], EAST_WALL.y[1], BASE, EAST_WALL.top);

// ---------- de muur aan de Vetkampstraat met drie kiosken en de poort (luchtfoto, foto's 2019 01 en 02) ----------
const STREET_WALL = {
  x: 80.0,
  y: [-80.0, -36.0],
  thick: 0.9,
  top: 2.6,
  kiosks: [-37.4, -55.5, -70.0],
  kioskHalf: 1.2,
  kioskTop: 3.0,
  gate: [-65.2, -59.8],
  gatePost: 0.6,
  gatePostTop: 3.4,
};
const streetWall = (() => {
  const w = STREET_WALL;
  const x0 = w.x - w.thick / 2;
  const x1 = w.x + w.thick / 2;
  const parts = [box(x0, x1, w.y[0], w.gate[0], BASE, w.top), box(x0, x1, w.gate[1], w.y[1], BASE, w.top)];
  for (const y of w.kiosks) {
    const h = w.kioskHalf;
    parts.push(box(w.x - h, w.x + h, y - h, y + h, BASE, w.kioskTop));
    // Kap: eerst steil uitlopend (onder 45 graden), dan een plaat.
    const sq = (r, z) => [[w.x - r, y - r, z], [w.x + r, y - r, z], [w.x + r, y + r, z], [w.x - r, y + r, z]];
    parts.push(hull([...sq(h, w.kioskTop - OVERLAP), ...sq(h + 0.2, w.kioskTop + 0.22), ...sq(h + 0.2, w.kioskTop + 0.6)]));
  }
  // Poortpijlers aan weerszijden van de poort (1,2 × 1,2 m).
  for (const [y0, y1] of [[w.gate[0] - 2 * w.gatePost, w.gate[0] + OVERLAP], [w.gate[1] - OVERLAP, w.gate[1] + 2 * w.gatePost]]) {
    parts.push(box(w.x - w.gatePost, w.x + w.gatePost, y0, y1, BASE, w.gatePostTop));
  }
  return Manifold.union(parts);
})();

// ---------- de lichtmasten ----------
// Vakwerkmasten (oude hoogspanningsmasten): vier poten van 0,9 m die van 4,4 naar 2,0 m versmallen,
// ringbalken op vijf niveaus en kruisdiagonalen, bovenaan de lampkop van 2015 die naar het veld wijst.
// Plaats en top uit het AHN (de noordmast uit de luchtfoto, top geschat).
const MASTS = [
  { at: [-68.8, -44.2], top: 41.6 },
  { at: [67.7, -44.6], top: 40.3 },
  { at: [69.2, 46.1], top: 42.1 },
  { at: [-72.0, 46.0], top: 41.5 },
];
const mast = ([cx, cy], top) => {
  const leg = 0.9;
  const baseW = 4.4;
  const topW = 2.0;
  const zHead = top - 6.0;
  const levels = [BASE, 9.0, 18.0, 27.0, zHead - 1.0];
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
    // De onderste ring is de dichte voet van de mast.
    parts.push(z === BASE ? outer : outer.subtract(box(cx - o + 0.45, cx + o - 0.45, cy - o + 0.45, cy + o - 0.45, z0 - 1, z0 + 2)));
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
  // Lampkop: een romp van de mastkop naar een plaat van 5,2 bij 2,0 m (naar het veld gericht) met de lampen.
  const facing = (Math.atan2(-cy, -cx) * 180) / Math.PI;
  const half = [1.0, 2.6];
  const oh = off(zHead) + leg / 2;
  const flare = hull([
    ...corners.map(([dx, dy]) => [dx * oh, dy * oh, zHead]),
    ...corners.map(([dx, dy]) => [dx * half[0], dy * half[1], zHead + 1.6]),
  ]);
  const head = Manifold.union([flare, box(-half[0], half[0], -half[1], half[1], zHead + 1.55, top)])
    .subtract(box(half[0] - 0.35, half[0] + 1, -half[1] + 0.5, half[1] - 0.5, zHead + 2.1, top - 0.5))
    .rotate([0, 0, facing])
    .translate([cx, cy, 0]);
  parts.push(head);
  return Manifold.union(parts);
};
const masts = MASTS.map(({ at, top }) => mast(at, top));

// Maaiveld (PDOK-terrein, ellipsoïdisch) op het plein achter de hoofdtribune, het plein binnen de muur aan de
// Vetkampstraat, het pad achter de Brinkgreverwegtribune en het pad achter de wal van de IJsseltribune.
const GROUND_SAMPLES = [[0, -82], [74, -62], [-84, -8], [-30, 66]];
const GROUND_HEIGHT = 49.34;

const OVERHANG_OK = (z) => z >= OVERHANG_MIN_Z;
const stadium = Manifold.union([mainStand, seStand, northStands, westCorner, eastWall, streetWall, ...masts]);
// BAG-panden: de hoofdtribune met achtergebouw, de tribune aan de Vetkampstraat en het gebouw in de westhoek.
const REPLACED_BUILDINGS = ["0150100000056207", "0150100000062379", "0150100000056456"];
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "De Adelaarshorst",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: REPLACED_BUILDINGS,
  plate: true,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (208622,10, 474998,60) in het hart van de veldopening op het maaiveld (NAP +6,4 m), +X langs het veld naar het zuidoosten (de Vetkampstraat, -44,68 graden) en +Y naar het noordoosten (de IJsseltribune). Eén node building:stadion: de hoofdtribune (zuidwest) met een vakwerkdak van +11,25 m aan de veldkant via de nok op +12,45 m naar +10,95 m boven een zitrang van tien treden, getrapte eindwanden met bakstenen kopblok en raamnissen, het frontje (+13,3 m), open dakspanten boven het achtergebouw (+8,45 m) met de entree; de tribune aan de Vetkampstraat (zuidoost) met een vakwerkdak tot +16,1 m boven twaalf treden tot +9,8 m, een achterblok met schuin onderstek en getrapte eindwanden; de IJssel- en Brinkgreverwegtribune met lessenaarsdaken van +8,3 naar +7,0 m op kolommen boven een staanrang van tien treden tegen de aarden wal (die in het PDOK-terrein zit), samen met de gesloten noordhoek; vier vakwerk-lichtmasten met lampkop (+40,3 tot +42,1 m); het lage gebouw met tent in de westhoek, de containerwand in de oosthoek en de muur aan de Vetkampstraat met kiosken en poort. In de kopse kanten van de vakwerkdaken zitten blinde driehoeken. Onderkant op 0,5 m onder het maaiveld; de dakplaten hangen uit (de export vult ze op). Het maaiveld wordt op vier punten rond het stadion bemonsterd; groundHeight is de laagste PDOK-terreinhoogte daar (ellipsoïdisch). Vervangt de PDOK-reconstructie van de drie BAG-panden. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 10400,
    fieldOpeningM: [+(FRONT.se - FRONT.nw).toFixed(2), +(FRONT.ne - FRONT.sw).toFixed(2)],
    mainStandRoofM: MAIN.roof.top,
    vetkampstraatRoofM: SE.roof.top,
    northStandRoofM: NORTH.top,
    mastTopM: MASTS.map((m) => m.top),
    groundNapM: 6.4,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/De_Adelaarshorst",
    "PDOK BAG-panden van het stadion (zie replacesBuildings), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: voorranden, dakprofielen, frontje, achtergebouw, aarden wal, westhoek, containerwand en drie lichtmasten",
    "PDOK luchtfoto (Actueel_orthoHR): plattegrond, noordhoek, dakspanten, de noordmast en de muur aan de Vetkampstraat",
    "Wikimedia Commons: De Adelaarshorst, Deventer (2019) 01, 02 en 05, Stadion de Adelaarshorst, Adelaarshorst-uitvak, De Adelaarshorst in Deventer (Detail)",
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

// Genereert een gedetailleerd, gesloten 3D-model van Stadion De Vijverberg in
// Doetinchem (thuisstadion van De Graafschap, verbouwd 1998-2000, 12.600 plaatsen).
// Het model vervangt de PDOK-reconstructie van het BAG-pand van het stadion en
// bestaat uit: de vier tribunes rond het veld met dezelfde doorsnede (een
// lessenaarsdak dat van +12,45 m aan de veldkant naar +11,0 m aan de achterrand
// afloopt, een dakplaat van 1,6 m met een boeiboord van 2,6 m aan de voorkant,
// boven een zitrang van acht treden die onder het dak open blijft, een
// achterwand met de gevelbekleding die aan de buitenkant 1,9 m uitkraagt boven
// een teruggelegen onderbouw met steunposten), de vier dichte hoeken met een
// waaiervormig dak rond de binnenhoek van het veld (kegelvlak in vlakken) en een
// schuin afgesneden buitenhoek, de kolommen aan de voorrand van de noord-, oost-
// en westtribune, de twee lichtstraten op het dak van de westtribune
// (Spinnekop) en het lage gebouw erachter, de hoofdtribune (Vijverberg, zuid)
// met een dakrand die in het midden 2,1 m verder over het veld steekt, tien
// witte dakspanten op het dak en een rij skyboxen bovenaan de zitrang, het
// hoofdgebouw erachter (een strook van 80 m en een driehoekige vleugel met
// glazen gevel, afgeronde punt en raamnissen, twee ronde trappenhuizen, twee
// dakopbouwen en het zonnepaneelrek) en de vier vakwerk-lichtmasten op de
// buitenhoeken. Alles is opgebouwd uit blokken, prisma's en convexe rompen van
// vlakken (geen hoogteveld). Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-stadion-de-vijverberg.mjs              # 1:1000 (standaard)
//   node scripts/generate-stadion-de-vijverberg.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van het veld op het maaiveld (veld op
// NAP +13,0 m), Z omhoog. +X loopt langs de lengteas van het veld naar het
// noordoosten (RD-richting (0,6561, 0,7547), 49,0 graden, uit de voorranden van
// de vier daken in het AHN), +Y dwars daarop naar het noordwesten (de
// Roodbergentribune); de hoofdtribune ligt aan de -Y-kant.
//
// Overhang: de dakplaten, de boeiboorden, de dakspanten, de skyboxen en de
// lampenbanken hangen uit (ondervlakken onder 45 graden boven OVERHANG_MIN_Z);
// onder die hoogte blijft elk ondervlak steiler dan 45 graden. De export vult
// de uitkragingen op bij het printen.
//
// Bronnen: BAG-pand 0222100000574507 (contour van het stadion met de
// schuine buitenhoeken, het lage gebouw achter de westtribune, de strook, de
// ronde trappenhuizen en de driehoekige vleugel van het hoofdgebouw; vervangen
// pand); AHN DSM/DTM 0,5 m (PDOK WCS) voor de voorranden van de daken (oost en
// west op u = ±55,65 m, noord op v = 37,0 m, zuid op v = -37,0 m in het midden en
// -39,1 m bij de hoeken), de dakhelling (noord, oost en west +12,45 m - 0,078 per
// m vanaf de voorrand, zuid +12,30 m - 0,070 per m vanaf v = -39,1 m; de hoeken
// zijn een kegelvlak rond de binnenhoek met dezelfde helling), de lichtstraten op
// de westtribune (+1,0 m), het lage gebouw (+4,0 m), het hoofdgebouw (+10,8 m, de
// glazen rand +10,25 m, dakopbouwen +13,6 m, trappenhuizen +12,2 m) en de masten
// (+38,6 tot +40,8 m); PDOK luchtfoto (0,08 m) voor de tien dakspanten op de
// hoofdtribune (8,8 m uit elkaar), de lichtstraten en de waaiervormige hoekdaken;
// Wikimedia Commons-foto's (De Vijverberg Doetinchem, De Vijverberg 2017,
// De Vijverberg.JPG, Vijverberg.JPG, Vijverberg in het donker, De Graafschap
// sfeeractie, Doetinchem Abandoned Station Stadion JUN16, Station Doetinchem
// Stadion 2016) voor de zitrang onder het dak, de kolommen aan de voorrand, het
// boeiboord, de skyboxen, de uitkragende achterwand met steunen en het
// hoofdgebouw; Wikipedia (12.600 plaatsen). Geschat: de treden van de zitrang
// (+1,0 tot +8,0 m), de onderkant van de dakplaten (1,6 m dik), de plaats van de
// kolommen, de hoogte van de dakspanten (tot +13,6 m), de onderkant van de
// gevelbekleding (+4,5 m), de skyboxen, de raamnissen van het hoofdgebouw en
// de doorsnede van de masten. Weggelaten: de reclameborden, de stoelen, de
// trappen en hekken op de zitrang, de spelerstunnel, de tuidraden van de
// dakspanten, het scorebord, de luifel boven de hoofdingang (dunner dan 0,9 m),
// de zonnepanelen zelf, het veldhek en de dug-outs (te klein voor 1:1000).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "stadion-de-vijverberg");
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
const cylinder = ([cx, cy], r, z0, z1, segments = 48) =>
  Manifold.cylinder(z1 - z0, r, r, segments).translate([cx, cy, z0]);

// Gesloten lichaam door ringen van vier punten (gelijke volgorde per ring), met eindvlakken.
const loft = (rings) => {
  const K = rings.length;
  const verts = new Float32Array(K * 12);
  rings.forEach((ring, k) => ring.forEach((p, m) => verts.set(p, (4 * k + m) * 3)));
  const build = (flipCaps) => {
    const tris = [];
    for (let k = 0; k + 1 < K; k++) {
      for (let m = 0; m < 4; m++) {
        const a = 4 * k + m;
        const b = 4 * k + ((m + 1) % 4);
        const c2 = 4 * (k + 1) + ((m + 1) % 4);
        const d = 4 * (k + 1) + m;
        tris.push([a, b, c2], [a, c2, d]);
      }
    }
    const L = 4 * (K - 1);
    const caps = [[0, 2, 1], [0, 3, 2], [L, L + 1, L + 2], [L, L + 2, L + 3]];
    tris.push(...(flipCaps ? caps.map(([x, y, z]) => [x, z, y]) : caps));
    return tris;
  };
  for (const flipCaps of [false, true]) {
    for (const flipAll of [false, true]) {
      const tris = build(flipCaps).map(([x, y, z]) => (flipAll ? [x, z, y] : [x, y, z]));
      const solid = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: verts, triVerts: Uint32Array.from(tris.flat()) }));
      if (solid.status() === "NoError" && solid.volume() > 0) return solid;
    }
  }
  throw new Error("loft: geen gesloten lichaam");
};

const SLUG = "stadion-de-vijverberg";

// ---------- maten (lokaal stelsel, z = hoogte boven het veld op NAP +13,0 m) ----------
const ORIGIN = [218419.27, 441211.01];
const X_AXIS = [0.656059, 0.75471]; // RD-richting 49,0 graden, langs het veld
// PDOK-terrein (ellipsoïdisch) op de bemonsteringspunten: 56,74 (parkeerterrein), 56,72 (west),
// 57,24 (noord) en 56,71 m (zuidwest); de laagste is de terugval.
const GROUND_HEIGHT = 56.71;
// Maaiveld op het parkeerterrein, het pad achter het lage gebouw, het bospad achter de
// noordtribune en het pad bij de zuidwesthoek (AHN NAP +12,9 tot +13,5 m).
const GROUND_SAMPLES = [[50, -72], [-97, 0], [0, 70], [-72, -68]];
// Alle onderdelen beginnen op dezelfde onderkant, 0,5 m onder het maaiveld.
const BASE = -0.5;
// Overlap tussen aangrenzende stukken (rakende vlakken laten spleten achter).
const OVERLAP = 0.02;

// Voorranden van de daken (AHN-DSM): de binnenrechthoek van het veld. De hoofdtribune (zuid) steekt
// tussen u = -40 en 40 m tot v = -37,0 m uit; bij de hoeken ligt de voorrand op -39,1 m.
const IN = { e: 55.65, w: -55.65, n: 37.0, s: -39.1, sMid: -37.0 };
// Buitenomtrek (BAG-contour, de achterwanden en de schuine buitenhoeken).
const OUTLINE = [[74.1, -45.9], [74.1, 44.1], [61.7, 55.65], [-62.2, 55.65], [-74.2, 43.6], [-74.2, -45.9], [-62.3, -57.7], [62.2, -57.7]];
// Voorrand van de zuidtribune (plattegrond) met de schuine overgangen naar de hoeken.
const SOUTH_FRONT = [[-50, IN.s], [-40, IN.sMid], [40, IN.sMid], [50, IN.s]];
// Dakhelling per zijde: bovenkant top0 - slope * n met n de afstand tot de voorrand (AHN).
const SIDE = {
  north: { top0: 12.45, slope: 0.078, n0: 0, w: 55.65 - IN.n },
  east: { top0: 12.45, slope: 0.078, n0: 0, w: 74.1 - IN.e },
  west: { top0: 12.45, slope: 0.078, n0: 0, w: 74.2 + IN.w },
  south: { top0: 12.3, slope: 0.0703, n0: IN.s - IN.sMid, w: 57.7 + IN.s },
};
// Dakplaat 1,6 m dik, boeiboord aan de voorrand 0,9 m breed en 2,6 m hoog (foto's).
const PLATE = 1.6;
const FASCIA = { depth: 0.9, height: 2.6 };
// Zitrang: acht treden van n = 0,3 tot 16,8 m, van +1,0 tot +8,0 m; voor de eerste trede een
// borstwering tot +1,2 m. Daarachter de achterwand tot onder het dak.
const RAKE = { n0: 0.3, n1: 16.8, z0: 1.0, z1: 8.0, steps: 8, front: 1.2 };
// Gevelbekleding aan de buitenkant: onderkant op +4,5 m, de onderbouw ligt terug tot de
// achterkant van de zitrang (schuine onderkant iets steiler dan 45 graden).
const CLAD_Z = 4.5;
const CLAD_SLOPE = 1.05;
// Steunposten (0,9 m) onder de uitkragende gevel: [zijde, langscoördinaat].
const POSTS = {
  north: [-46.25, -37, -27.75, -18.5, -9.25, 0, 9.25, 18.5, 27.75, 37, 46.25],
  east: [-34, -25, -16, -7, 2, 11, 20, 29],
  west: [-34, -25, 25, 29],
  south: [-53, -47, 47, 53],
};
// Kolommen (0,9 m) aan de voorrand van de daken; de hoofdtribune hangt aan de dakspanten.
const COLUMNS = { north: [-37, -18.5, 0, 18.5, 37], east: [-20, -1, 18], west: [-20, -1, 18] };
// Lichtstraten op het dak van de westtribune (AHN +1,0 m boven het dak, luchtfoto).
const ROOF_LIGHTS = { n: [[5.7, 7.7], [11.1, 13.1]], a: [-18.5, 17.5], rise: 1.0 };
// Laag gebouw achter de westtribune (BAG, AHN +4,0 m).
const ANNEX = { u: [-86.1, -72.4], v: [-23.3, 21.2], top: 4.0 };
// Hoofdtribune: tien dakspanten (u, luchtfoto, 8,8 m uit elkaar) als buis van 0,9 m over het dak,
// met de voet op het hoofdgebouw; [v, z] langs de spant.
const BOOM_U = [-39.6, -30.8, -22.0, -13.2, -4.4, 4.4, 13.2, 22.0, 30.8, 39.6];
const BOOM = [[-59.3, 10.4], [-56.6, 13.6], [-51.5, 13.2], [-46.0, 12.0]];
// Skyboxen bovenaan de zitrang van de hoofdtribune (u -30 tot 30 m, foto) met glazen nissen.
const SKYBOX = { a: [-30, 30], n: 13.6, z0: 6.9, glass: [7.5, 9.2], bay: 4.0, pier: 1.0 };
// Hoofdgebouw: strook achter de hoofdtribune, ronde trappenhuizen op de uiteinden en de
// driehoekige vleugel (BAG); dak +10,8 m, de glazen rand langs de oostgevel +10,25 m (3 m breed).
const MAIN = {
  strip: { u: [-39.8, 39.8], v: [-64.0, -57.6], top: 10.8 },
  towers: [{ c: [-42.5, -62.2], r: 1.8, box: [-42.5, -39.7] }, { c: [42.3, -62.2], r: 1.8, box: [39.7, 42.3] }],
  towerTop: 12.2,
  wedge: [[-21.9, -63.9], [-3.3, -88.9], [-1.4, -88.0], [-1.4, -85.7], [28.1, -63.9]],
  tip: { c: [-2.4, -87.0], r: 1.9 },
  ledge: { from: [28.1, -63.9], to: [-1.4, -85.7], width: 3.0, top: 10.25 },
  boxes: [[-9.5, -6.5, -65.5, -56.5], [0.5, 3.0, -65.0, -56.5]],
  boxTop: 13.6,
  solar: { u: [22, 28], v: [-61.0, -58.4], top: 12.5 },
};
// Raamnissen: drie verdiepingen, 1,6 m breed om de 3,2 m, 0,35 m diep, met een schuin plafond.
const WINDOW = { rows: [[1.0, 2.6], [4.4, 6.0], [7.8, 9.4]], width: 1.6, pitch: 3.2, depth: 0.35 };
// Lichtmasten op de buitenhoeken (AHN: top van de lampenbank).
const MASTS = [
  { at: [69.2, 50.2], top: 40.7 },
  { at: [68.9, -52.0], top: 40.8 },
  { at: [-68.8, -53.0], top: 39.8 },
  { at: [-69.3, 50.6], top: 38.6 },
];
// Naar beneden gerichte vlakken boven deze hoogte zijn bedoelde uitkragingen
// (dakplaten, boeiboorden, spanten, lampenbanken); daaronder blijft elk ondervlak steiler dan 45 graden.
const OVERHANG_MIN_Z = 4.0;

// ---------- de doorsnede van een tribune ----------
// Kaders per zijde: (langs a, afstand n vanaf de voorrand naar buiten) naar (x, y).
const FRAME = {
  north: (a, n) => [a, IN.n + n],
  south: (a, n) => [a, IN.s - n],
  east: (a, n) => [IN.e + n, a],
  west: (a, n) => [IN.w - n, a],
};
const sideHull = (side, pts) => hull(pts.map(([a, n, z]) => [...FRAME[side](a, n), z]));
const topAt = (p, n) => p.top0 - p.slope * n;
const underAt = (p, n) => topAt(p, n) - PLATE;
// De convexe stukken van de doorsnede [n, z] tot de achterrand w: borstwering, treden, achterwand
// met uitkragende bekleding, boeiboord en dakplaat. Elk stuk loopt 2 cm over in zijn buur.
const profileQuads = (p, w) => {
  const e = OVERLAP;
  const quads = [];
  quads.push([[0, BASE], [RAKE.n0 + e, BASE], [RAKE.n0 + e, RAKE.front], [0, RAKE.front]]);
  const d = (RAKE.n1 - RAKE.n0) / RAKE.steps;
  for (let j = 0; j < RAKE.steps; j++) {
    const a = RAKE.n0 + d * j - e;
    const b = RAKE.n0 + d * (j + 1) + e;
    const z = RAKE.z0 + ((RAKE.z1 - RAKE.z0) * j) / (RAKE.steps - 1);
    quads.push([[a, BASE], [b, BASE], [b, z], [a, z]]);
  }
  const t = w - RAKE.n1;
  quads.push([[RAKE.n1 - e, CLAD_Z - CLAD_SLOPE * (t + e)], [w, CLAD_Z], [w, underAt(p, w) + 0.3], [RAKE.n1 - e, underAt(p, RAKE.n1) + 0.3]]);
  const f0 = p.n0;
  const f1 = p.n0 + FASCIA.depth;
  quads.push([[f0, topAt(p, f0) - FASCIA.height], [f1, topAt(p, f1) - FASCIA.height], [f1, topAt(p, f1)], [f0, topAt(p, f0)]]);
  quads.push([[f1 - e, underAt(p, f1 - e)], [w, underAt(p, w)], [w, topAt(p, w)], [f1 - e, topAt(p, f1 - e)]]);
  return quads;
};

// ---------- de vier tribunes ----------
const SIDE_RANGE = { north: [IN.w, IN.e], south: [IN.w, IN.e], east: [IN.s, IN.n], west: [IN.s, IN.n] };
const sidePieces = {};
for (const side of Object.keys(SIDE)) {
  const p = SIDE[side];
  const [a0, a1] = SIDE_RANGE[side];
  sidePieces[side] = profileQuads(p, p.w).map((q) =>
    sideHull(side, [...q.map(([n, z]) => [a0 - OVERLAP, n, z]), ...q.map(([n, z]) => [a1 + OVERLAP, n, z])]),
  );
}
// De dakrand van de hoofdtribune volgt de voorrand met de schuine overgangen; het boeiboord loopt mee.
const southPlan = [[IN.w - 1, IN.s], ...SOUTH_FRONT, [IN.e + 1, IN.s], [IN.e + 1, -70], [IN.w - 1, -70]];
const southStand = Manifold.union(sidePieces.south).intersect(prism(southPlan, BASE - 1, 40));
const southFascia = [];
{
  const p = SIDE.south;
  const top = (v) => topAt(p, IN.s - v);
  const pts = [[IN.w - OVERLAP, IN.s], ...SOUTH_FRONT.slice(0, 2)];
  const right = [...SOUTH_FRONT.slice(2), [IN.e + OVERLAP, IN.s]];
  for (const line of [pts, right]) {
    for (let i = 0; i + 1 < line.length; i++) {
      const [ax, ay] = line[i];
      const [bx, by] = line[i + 1];
      const quad = [[ax, ay], [bx, by], [bx, by - FASCIA.depth], [ax, ay - FASCIA.depth]];
      southFascia.push(hull(quad.flatMap(([x, y]) => [[x, y, top(y) - FASCIA.height], [x, y, top(y) + 0.001]])));
    }
  }
}

// ---------- de vier hoeken: waaier rond de binnenhoek ----------
// Afstand vanaf c in richting d tot de buitenomtrek.
const rayHit = ([cx, cy], [dx, dy]) => {
  let best = Infinity;
  for (let i = 0; i < OUTLINE.length; i++) {
    const [x0, y0] = OUTLINE[i];
    const [x1, y1] = OUTLINE[(i + 1) % OUTLINE.length];
    const ex = x1 - x0;
    const ey = y1 - y0;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-12) continue;
    const t = ((x0 - cx) * ey - (y0 - cy) * ex) / den;
    const s = ((x0 - cx) * dy - (y0 - cy) * dx) / den;
    if (t > 1e-9 && s >= -1e-9 && s <= 1 + 1e-9) best = Math.min(best, t);
  }
  return best;
};
// Hoek: binnenhoek c, eA de richting naar buiten van zijde A (bij 0 graden), eB die van zijde B (90 graden).
const CORNERS = [
  { c: [IN.e, IN.n], a: "east", b: "north", eA: [1, 0], eB: [0, 1] },
  { c: [IN.w, IN.n], a: "north", b: "west", eA: [0, 1], eB: [-1, 0] },
  { c: [IN.w, IN.s], a: "west", b: "south", eA: [-1, 0], eB: [0, -1] },
  { c: [IN.e, IN.s], a: "south", b: "east", eA: [0, -1], eB: [1, 0] },
];
const MAX_FAN = 18; // graden per vak van de waaier
const cornerPieces = [];
for (const { c, a, b, eA, eB } of CORNERS) {
  // Stralen: langs beide zijden, door de twee hoekpunten van de schuine buitenhoek, en ertussen.
  const kinks = OUTLINE.map(([x, y]) => {
    const rx = x - c[0];
    const ry = y - c[1];
    const ra = rx * eA[0] + ry * eA[1];
    const rb = rx * eB[0] + ry * eB[1];
    return ra > 0 && rb > 0 ? (Math.atan2(rb, ra) * 180) / Math.PI : null;
  }).filter((x) => x !== null);
  const marks = [0, ...kinks.sort((x, y) => x - y), 90];
  const angles = [0];
  for (let i = 0; i + 1 < marks.length; i++) {
    const k = Math.max(1, Math.ceil((marks[i + 1] - marks[i]) / MAX_FAN));
    for (let j = 1; j <= k; j++) angles.push(marks[i] + ((marks[i + 1] - marks[i]) * j) / k);
  }
  // Doorsnede op een straal onder hoek deg (de helling loopt lineair van zijde A naar zijde B).
  const ray = (deg) => {
    const f = Math.min(1, Math.max(0, deg / 90));
    const r = (deg * Math.PI) / 180;
    const dir = [Math.cos(r) * eA[0] + Math.sin(r) * eB[0], Math.cos(r) * eA[1] + Math.sin(r) * eB[1]];
    const A = SIDE[a];
    const B = SIDE[b];
    const p = { top0: A.top0 + (B.top0 - A.top0) * f, slope: A.slope + (B.slope - A.slope) * f, n0: 0 };
    const w = rayHit(c, dir);
    return { dir, p, w, quads: profileQuads(p, w) };
  };
  // Per stuk van de doorsnede één gesloten lichaam langs alle stralen (een gebogen prisma);
  // de stukken tegen de binnenhoek (r = 0) zijn een kwartcirkel en dus convex: daar een romp.
  const rays = angles.map(ray);
  rays[0].quads.forEach((_, i) => {
    const rings = rays.map((R) => R.quads[i].map(([n, z]) => [c[0] + R.dir[0] * n, c[1] + R.dir[1] * n, z]));
    if (Math.min(...rays[0].quads[i].map(([n]) => n)) < 0.05) cornerPieces.push(hull(rings.flat()));
    else cornerPieces.push(loft(rings));
  });
}

// ---------- details aan de tribunes ----------
const details = [];
// Kolommen aan de voorrand (0,9 m) tot in het boeiboord, ook op de vier binnenhoeken.
for (const [side, list] of Object.entries(COLUMNS)) {
  const p = SIDE[side];
  for (const a of list) {
    details.push(sideHull(side, [a - 0.45, a + 0.45].flatMap((x) => [0.05, 0.95].flatMap((n) => [[x, n, BASE], [x, n, topAt(p, n) - FASCIA.height + 0.3]]))));
  }
}
for (const { c, eA, eB } of CORNERS) {
  const m = [c[0] + 0.5 * (eA[0] + eB[0]), c[1] + 0.5 * (eA[1] + eB[1])];
  details.push(box(m[0] - 0.45, m[0] + 0.45, m[1] - 0.45, m[1] + 0.45, BASE, 12.45 - FASCIA.height + 0.3));
}
// Steunposten onder de uitkragende gevelbekleding.
for (const [side, list] of Object.entries(POSTS)) {
  const p = SIDE[side];
  for (const a of list) {
    details.push(sideHull(side, [a - 0.45, a + 0.45].flatMap((x) => [RAKE.n1 - 0.1, p.w - 0.15].flatMap((n) => [[x, n, BASE], [x, n, CLAD_Z + 0.3]]))));
  }
}
// Lichtstraten op de westtribune.
for (const [n0, n1] of ROOF_LIGHTS.n) {
  const p = SIDE.west;
  details.push(
    sideHull("west", ROOF_LIGHTS.a.flatMap((a) => [n0, n1].flatMap((n) => [[a, n, topAt(p, n) - 0.4], [a, n, topAt(p, n) + ROOF_LIGHTS.rise]]))),
  );
}
// Het lage gebouw achter de westtribune, met deuren in de westgevel.
const annex = box(ANNEX.u[0], ANNEX.u[1], ANNEX.v[0], ANNEX.v[1], BASE, ANNEX.top);
// Dakspanten van de hoofdtribune: buizen van 0,9 m langs [v, z], met de voet op het hoofdgebouw.
const cube = (x, y, z, s) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].flatMap(([dx, dy]) => [[x + dx * s, y + dy * s, z - s], [x + dx * s, y + dy * s, z + s]]);
for (const u of BOOM_U) {
  for (let i = 0; i + 1 < BOOM.length; i++) {
    details.push(hull([...cube(u, BOOM[i][0], BOOM[i][1], 0.45), ...cube(u, BOOM[i + 1][0], BOOM[i + 1][1], 0.45)]));
  }
}
// Skyboxen bovenaan de zitrang van de hoofdtribune.
let skybox;
{
  const p = SIDE.south;
  const { a, n, z0 } = SKYBOX;
  skybox = sideHull("south", a.flatMap((x) => [[x, n, z0], [x, RAKE.n1 + OVERLAP, z0], [x, n, underAt(p, n) + 0.3], [x, RAKE.n1 + OVERLAP, underAt(p, RAKE.n1) + 0.3]]));
  const cuts = [];
  for (let x = a[0] + SKYBOX.pier; x + SKYBOX.bay - SKYBOX.pier <= a[1] + 1e-6; x += SKYBOX.bay) {
    const x1 = x + SKYBOX.bay - SKYBOX.pier;
    cuts.push(sideHull("south", [x, x1].flatMap((xx) => [[xx, n - 1, SKYBOX.glass[0]], [xx, n + 0.4, SKYBOX.glass[0]], [xx, n - 1, SKYBOX.glass[1] - 1.15], [xx, n + 0.4, SKYBOX.glass[1] + 0.46]])));
  }
  skybox = skybox.subtract(Manifold.union(cuts));
}

// ---------- het hoofdgebouw ----------
// Raamnis langs een gevel van P naar Q (buitennormaal nrm) op afstand t0..t1, met een plafond dat
// naar binnen oploopt (steiler dan 45 graden, printbaar zonder steun).
const facadeCut = (P, Q, t0, t1, z0, z1, depth) => {
  const L = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
  const d = [(Q[0] - P[0]) / L, (Q[1] - P[1]) / L];
  const nrm = [d[1], -d[0]];
  const at = (t, s) => [P[0] + d[0] * t + nrm[0] * s, P[1] + d[1] * t + nrm[1] * s];
  return hull([t0, t1].flatMap((t) => [
    [...at(t, 1), z0], [...at(t, -depth), z0],
    [...at(t, 1), z1 - 1.15], [...at(t, -depth), z1 + 1.15 * depth],
  ]));
};
const windowsAlong = (P, Q, from, to) => {
  const cuts = [];
  for (let t = from; t + WINDOW.width <= to + 1e-6; t += WINDOW.pitch) {
    for (const [z0, z1] of WINDOW.rows) cuts.push(facadeCut(P, Q, t, t + WINDOW.width, z0, z1, WINDOW.depth));
  }
  return cuts;
};
const mainParts = [];
const mainCuts = [];
{
  const { strip, towers, towerTop, wedge, tip, ledge, boxes, boxTop, solar } = MAIN;
  mainParts.push(box(strip.u[0], strip.u[1], strip.v[0], strip.v[1], BASE, strip.top));
  for (const t of towers) {
    mainParts.push(cylinder(t.c, t.r, BASE, towerTop));
    mainParts.push(box(t.box[0], t.box[1], t.c[1] - t.r, t.c[1] + t.r, BASE, towerTop));
  }
  mainParts.push(prism(wedge, BASE, strip.top));
  mainParts.push(cylinder(tip.c, tip.r, BASE, strip.top));
  for (const [u0, u1, v0, v1] of boxes) mainParts.push(box(u0, u1, v0, v1, strip.top - 0.3, boxTop));
  mainParts.push(hull([
    [solar.u[0], solar.v[1], strip.top - 0.1], [solar.u[1], solar.v[1], strip.top - 0.1],
    [solar.u[0], solar.v[0], strip.top - 0.1], [solar.u[1], solar.v[0], strip.top - 0.1],
    [solar.u[0], solar.v[0], solar.top], [solar.u[1], solar.v[0], solar.top],
    [solar.u[0], solar.v[1], solar.top - 1.0], [solar.u[1], solar.v[1], solar.top - 1.0],
  ]));
  // De lagere glazen rand langs de oostgevel van de vleugel.
  {
    const [P, Q] = [ledge.from, ledge.to];
    const L = Math.hypot(Q[0] - P[0], Q[1] - P[1]);
    const d = [(Q[0] - P[0]) / L, (Q[1] - P[1]) / L];
    const inward = [-d[1], d[0]];
    const pts = [
      [P[0] - d[0] * 2 - inward[0] * 2, P[1] - d[1] * 2 - inward[1] * 2],
      [Q[0] + d[0] * 2 - inward[0] * 2, Q[1] + d[1] * 2 - inward[1] * 2],
      [Q[0] + d[0] * 2 + inward[0] * ledge.width, Q[1] + d[1] * 2 + inward[1] * ledge.width],
      [P[0] - d[0] * 2 + inward[0] * ledge.width, P[1] - d[1] * 2 + inward[1] * ledge.width],
    ];
    mainCuts.push(prism(pts, ledge.top, strip.top + 0.5).intersect(box(-60, 60, -200, strip.v[0], BASE - 1, 40)));
  }
  // Oostgevel van de vleugel (vanaf de punt): donkere baksteen met de ingang, glazen pui, lichte baksteen met ramen.
  const east = [[-1.4, -85.7], [28.1, -63.9]];
  mainCuts.push(facadeCut(east[0], east[1], 3.5, 9.5, 0, 3.4, 0.4));
  mainCuts.push(facadeCut(east[0], east[1], 12.0, 25.5, 0.6, 9.6, 0.4));
  mainCuts.push(...windowsAlong(east[0], east[1], 27.0, 35.5));
  // Westgevel van de vleugel (lichte baksteen, ramen) en de zuidgevels van de strook.
  mainCuts.push(...windowsAlong([-21.9, -63.9], [-3.3, -88.9], 2.0, 28.5));
  mainCuts.push(...windowsAlong([-39.7, -64.0], [-21.9, -64.0], 1.2, 17.0));
  mainCuts.push(...windowsAlong([28.1, -64.0], [39.7, -64.0], 1.0, 11.0));
}
const mainBuilding = Manifold.union(mainParts).subtract(Manifold.union(mainCuts));
// Deuren in de westgevel van het lage gebouw.
const annexCuts = [];
for (let t = 3; t + 2.2 <= ANNEX.v[1] - ANNEX.v[0] - 2; t += 7) {
  annexCuts.push(facadeCut([ANNEX.u[0], ANNEX.v[1]], [ANNEX.u[0], ANNEX.v[0]], t, t + 2.2, 0, 2.6, 0.35));
}
const annexBuilt = annex.subtract(Manifold.union(annexCuts));

// ---------- de lichtmasten ----------
// Vakwerkmast: vier poten van 0,9 m, die van 2,8 naar 1,9 m versmallen, ringbalken om de
// circa 10 m en kruisdiagonalen (steiler dan 45 graden), bovenaan een lampenbank die naar het veld wijst.
const mast = ([cx, cy], top) => {
  const leg = 0.9;
  const baseW = 2.8;
  const topW = 1.9;
  const zHead = top - 4.5;
  const levels = [BASE, 9.5, 19.5, 29.0, zHead - 1.0];
  const off = (z) => (baseW + ((topW - baseW) * (z - BASE)) / (zHead - BASE)) / 2 - leg / 2;
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
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
  const facing = (Math.atan2(-cy, -cx) * 180) / Math.PI;
  const half = [1.1, 2.6];
  const oh = off(zHead) + leg / 2;
  const flare = hull([
    ...corners.map(([dx, dy]) => [dx * oh, dy * oh, zHead]),
    ...corners.map(([dx, dy]) => [dx * half[0], dy * half[1], zHead + 2.6]),
  ]);
  const bank = Manifold.union([flare, box(-half[0], half[0], -half[1], half[1], zHead + 2.55, top)]).rotate([0, 0, facing]).translate([cx, cy, 0]);
  parts.push(bank);
  return Manifold.union(parts);
};
const masts = MASTS.map(({ at: p, top }) => mast(p, top));

const OVERHANG_OK = (z) => z >= OVERHANG_MIN_Z;
const stadium = Manifold.union([
  ...sidePieces.north, ...sidePieces.east, ...sidePieces.west, southStand, ...southFascia,
  ...cornerPieces, ...details, skybox, annexBuilt, mainBuilding, ...masts,
]);
// BAG-pand van het stadion (tribunes, hoeken, laag gebouw en hoofdgebouw).
const REPLACED_BUILDINGS = ["0222100000574507"];
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "Stadion De Vijverberg",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: REPLACED_BUILDINGS,
  plate: true,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (218419,27, 441211,01) in het hart van het veld op het maaiveld (NAP +13,0 m), +X langs het veld naar het noordoosten (49,0 graden) en +Y naar het noordwesten (Roodbergentribune). Eén node building:stadion: vier tribunes met dezelfde doorsnede (lessenaarsdak van +12,45 m aan de veldkant naar +11,0 m aan de achterrand, dakplaat van 1,6 m met boeiboord, zitrang van acht treden van +1,0 tot +8,0 m die onder het dak open blijft, achterwand met uitkragende gevelbekleding boven een teruggelegen onderbouw met steunposten), vier dichte hoeken met een waaiervormig dak rond de binnenhoek en een schuin afgesneden buitenhoek, kolommen aan de voorrand van de noord-, oost- en westtribune, twee lichtstraten op de westtribune en het lage gebouw erachter (+4,0 m), de hoofdtribune met een dakrand die in het midden 2,1 m verder over het veld steekt, tien dakspanten tot +13,6 m en een rij skyboxen, het hoofdgebouw (+10,8 m: strook, driehoekige vleugel met glazen pui, afgeronde punt en raamnissen, twee ronde trappenhuizen tot +12,2 m, dakopbouwen tot +13,6 m, zonnepaneelrek) en vier vakwerk-lichtmasten op de buitenhoeken (+38,6 tot +40,8 m). Onderkant op 0,5 m onder het maaiveld; de dakplaten hangen uit (de export vult ze op). Het maaiveld wordt op vier punten rond het stadion bemonsterd; groundHeight is de laagste PDOK-terreinhoogte daar (ellipsoïdisch). Vervangt de PDOK-reconstructie van het BAG-pand. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 12600,
    roofEdgeM: Object.fromEntries(Object.entries(SIDE).map(([s, p]) => [s, [+topAt(p, p.n0).toFixed(2), +topAt(p, p.w).toFixed(2)]])),
    rakeM: [RAKE.z0, RAKE.z1],
    mainBuildingM: [MAIN.strip.top, MAIN.boxTop],
    mastTopM: MASTS.map((m) => m.top),
    fieldNapM: 13.0,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/Stadion_De_Vijverberg",
    "PDOK BAG pand 0222100000574507 (contour van het stadion en het hoofdgebouw), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: voorranden en hellingen van de daken, hoekdaken, lichtstraten, laag gebouw, hoofdgebouw en lichtmasten",
    "PDOK luchtfoto (Actueel_orthoHR, 0,08 m): dakspanten van de hoofdtribune, lichtstraten, waaiervormige hoekdaken",
    "Wikimedia Commons: De Vijverberg Doetinchem, De Vijverberg 2017, De Vijverberg.JPG, Vijverberg.JPG, Vijverberg in het donker, De Graafschap sfeeractie, Doetinchem Abandoned Station Stadion JUN16, Station Doetinchem Stadion 2016 (zitrang onder het dak, kolommen, boeiboord, skyboxen, achterwand, hoofdgebouw)",
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

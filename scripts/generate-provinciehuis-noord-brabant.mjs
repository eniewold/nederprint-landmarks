// Provinciehuis Noord-Brabant (Brabantlaan 1, 's-Hertogenbosch; Hugh Maaskant,
// geopend 1971): een laagbouw van twee lagen (150 x 64 m) op kolommen boven een
// open parkeerlaag, met in het midden de statenzaal met haar vleugelvormige
// koperen daken, en daarnaast de hoogbouw van 23 lagen met een kroon tot NAP
// +103,3. De toren heeft diepe horizontale banden (borstweringen en
// zonweringen per laag, het glas ver terug) tussen vier massieve
// hoekpijlers; de middelste 26 m van de lange gevels steekt 1,7 m buiten de
// pijlers uit. Bovenop een dichte borstweringsband en een kroon met een
// donkere glasstrook onder een zware dakplaat. De laagbouw heeft rondom een
// galerij op de eerste verdieping, een overstekende dakplaat en hoge
// gevelkolommen; aan de noordzijde de oprit naar de entree met een luifel, aan
// de oostzijde een terras en een loopbrug naar Brabantlaan 3. Vlakken en
// benoemde bouwdelen in een eigen gebouwstelsel, geen gestapelde DSM-lagen.
// Voorbeelden per rij: generate-evoluon.mjs (aanpak primitieven) en
// generate-pontsteiger.mjs (gevelnissen per laag op efteling-kit.mjs).
//
//   node scripts/generate-provinciehuis-noord-brabant.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het hart van de toren op RD (151052,11,
// 409901,26), z = 0 op NAP +2,65 m (parkeerterrein rondom: AHN-DTM +2,6 tot
// +2,7), Z omhoog. +X loopt op 1,674 graden in RD langs de lange gevels (BAG,
// haaks op 0,03 m), +Y naar het noorden (de Brabantlaan en de oprit). De
// statenzaal ligt op -X, het oostterras op +X.
//
// Bronnen: BAG-pand 0796100000239857 (laagbouw, toren, oprit en oostvleugel in
// één pand); BGT-pand van dat pand op het maaiveld (de dichte kern onder de
// laagbouw); AHN5 DSM 0,5 m (opname 2023, ImageServer Hoogtebestand/AHN5_DSM_50cm
// van ahn.arcgisonline.nl) en AHN4 DSM/DTM 0,5 m (PDOK WCS) ter controle: de
// omtrek van de toren en de kroon, borstwering +95,5 (west) tot +97,15 (oost),
// dak +94,4, kroon +103,3, dakopbouw +104,2, laagbouwdak +15,5, de drie
// dakvlakken van de statenzaal, galerij +7,1, oprit +5,1 tot +7,2, luifel
// +11,3, terras +6,6, loopbrug +10,0; daklichten, patio en zonnepanelen op
// de laagbouw. Lagen, galerij, kolommen en dakplaat uit Commons-foto's (RCE).
// Wikipedia: 103,50 m, 23 verdiepingen, laagbouw van twee lagen met de
// statenzaal, parkeerruimte voor 500 auto's onder het gebouw.
import { CrossSection, Manifold, prism, union, ccw, rect, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "provinciehuis-noord-brabant";
const ORIGIN = [151052.11, 409901.26];
const AXIS_DEG = 1.674;
const RAD = (AXIS_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 2.65;
// Onder het waterpeil van de vijver (PDOK-water NAP +1,7): de westkop staat
// met de galerij boven het water.
const BASE = -1.5;
const z = (nap) => +(nap - GROUND_NAP).toFixed(3);

// ---------- hoogtes (NAP) ----------
const H = {
  ground: GROUND_NAP,
  deckLow: 5.6, // onderkant galerij (foto's: parkeerlaag van ca. 3 m)
  deck: 7.1, // galerij op de eerste verdieping (AHN5 7,1-7,2 aan de westkop)
  storey: 3.45, // twee kantoorlagen in de laagbouw
  roofLow: 14.0, // onderkant dakplaat laagbouw (foto's: dakrand van 1,5 m)
  roof: 15.5, // dak laagbouw (AHN5-mediaan 15,50)
  skylight: 16.45, // daklichten en zonnepanelen (AHN5 16,05-16,3; 0,95 m voor de print)
  lightwell: 11.3, // vloer van de lichthoven in de laagbouw (AHN5 11,2-11,3)
  towerFloor0: 16.2, // vloer van de eerste torenlaag: 23 lagen van 3,4 m tot het dak
  towerStorey: 3.4,
  towerRoof: 94.4, // dak binnen de borstwering (AHN5 94,39-94,43)
  parapetWest: 95.5, // borstweringsband westhelft (AHN5 95,47-95,52)
  parapetEast: 97.15, // oosthelft (AHN5 97,12-97,25), vanaf het midden in 5 m oplopend
  plantStrip: 96.2, // strook langs de oostzijde van de kroon (AHN5 96,2)
  crownGlass: 98.8, // onderkant van de donkere glasstrook onder de dakplaat (foto's)
  capLow: 101.3, // onderkant dakplaat van de kroon (foto's: plaat van ca. 2 m)
  crown: 103.3, // dak van de kroon (AHN5 103,2-103,4)
  crownPlant: 104.2, // installatiekast op de kroon (AHN5-mediaan 104,2)
  crownHatch: 104.3, // klein opbouwtje (AHN5 104,27)
  rampNorth: 5.1, // oprit aan het voorplein (AHN-DTM 5,1)
  rampSouth: 7.2, // oprit bij de entree op galerijhoogte (AHN-DTM 7,2)
  porch: 11.3, // luifel boven de entree (AHN5 11,2-11,4)
  terrace: 6.6, // terras oostzijde (AHN5 6,5-6,6)
  bridgeLow: 7.0,
  bridge: 10.0, // loopbrug naar Brabantlaan 3 (AHN5 10,0)
  annexStrip: 10.2, // strook ventilatie/daklicht langs de oostgevel (AHN5 10,2)
  annexParapet: 7.7, // borstwering terras oostvleugel (AHN5 7,7)
};

// ---------- plattegrond (m, gebouwstelsel) ----------
// Laagbouw (BAG 0796100000239857, hoeken haaks): 149,9 x 64,05 m.
const MAIN = rect(-117.04, -32.14, 32.9, 31.91);
// Galerij steekt aan de westkop 3,4 m verder uit (AHN5 +7,2 boven het water).
const DECK_WEST = rect(-120.4, -17.0, -116.9, 9.5);
const BODY = rect(-114.04, -29.14, 29.9, 28.91); // gevel 3,0 m achter de dakrand (foto's)
const CORE = rect(-42.37, -23.48, 30.22, 23.21); // BGT-pand op het maaiveld: dichte kern van de parkeerlaag
const ANNEX = rect(32.9, -17.48, 48.17, 17.2); // oostvleugel (BAG): terras op galerijhoogte
const TERRACE = rect(48.17, -17.48, 54.5, 13.0); // terras buiten het pand (AHN5 +6,6), deels boven de waterloop
const BRIDGE = rect(32.9, 13.6, 64.6, 16.6); // loopbrug tot de gevel van Brabantlaan 3
const RAMP = rect(-53.05, 31.91, -31.08, 70.92); // oprit (BAG)
const RAMP_HOLE = rect(-45.5, 41.87, -38.6, 54.78); // vide in de oprit (BAG-gat, AHN maaiveld)
const PORCH = rect(-50.5, 31.91, -34.0, 51.0); // luifel boven de entree (AHN5 +11,3)

// Statenzaal: drie daken naast elkaar (AHN5-randen), elk een vlak z = a u + b.
const HALL_V = 18.9;
const HALL_EAVE = 1.5; // overstek aan de kopgevels (foto's)
const HALL = [
  // west: vrijwel vlak, van +19,31 naar +20,31 oplopend naar het oosten
  { name: "west", u0: -89.75, u1: -69.25, planes: [{ u0: -89.75, u1: -69.25, z0: 19.31, z1: 20.31 }] },
  // midden: vlinderdak, hoge westrand +30,0, kiel +23,55, oostrand +25,9
  {
    name: "midden",
    u0: -69.25,
    u1: -50.75,
    planes: [
      { u0: -69.25, u1: -60.25, z0: 30.0, z1: 23.55 },
      { u0: -60.25, u1: -50.75, z0: 23.55, z1: 25.9 },
    ],
  },
  // oost: oplopend naar de toren, licht gebogen (twee vlakken)
  {
    name: "oost",
    u0: -50.75,
    u1: -27.75,
    planes: [
      { u0: -50.75, u1: -47.0, z0: 20.3, z1: 20.45 },
      { u0: -47.0, u1: -27.75, z0: 20.45, z1: 23.95 },
    ],
  },
];

// Toren (AHN5-omtrek): middendeel van de lange gevels u ±13,45 over v ±13,0,
// kopeinden u ±11,75 tot v ±20,45 met afgeschuinde hoeken van 1,2 m.
const T = { midU: 13.45, midV: 13.0, endU: 11.75, endV: 20.45, chamfer: 1.2, pierU: 5.75 };
const CROWN = { u0: -9.15, u1: 8.45, v0: -15.8, v1: 15.7, glassIn: 1.0 };
const RING_IN = rect(-10.1, -16.9, 10.3, 16.6); // binnenrand van de borstwering (dak +94,4)

// ---------- hulpfuncties ----------
const cs = (poly) => new CrossSection([ccw(poly)]);
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
const chamferRect = (x0, y0, x1, y1, c) => [
  [x0 + c, y0], [x1 - c, y0], [x1, y0 + c], [x1, y1 - c], [x1 - c, y1], [x0 + c, y1], [x0, y1 - c], [x0, y0 + c],
];
// Deel van m onder (keep="below") of boven het vlak z = a u + b v + c (model-z).
const cut = (m, a, b, c, keep = "below") => {
  const n = Math.hypot(a, b, 1);
  return keep === "below" ? m.trimByPlane([a / n, b / n, -1 / n], -c / n) : m.trimByPlane([-a / n, -b / n, 1 / n], c / n);
};
// Vlak door (u0, nap0) en (u1, nap1), onafhankelijk van v, als [a, b, c] in model-z.
const planeU = ({ u0, u1, z0, z1 }) => {
  const a = (z1 - z0) / (u1 - u0);
  return [a, 0, z(z0) - a * u0];
};
// Punt op de gevel a→b (buitenkant rechts bij een veelhoek tegen de klok in):
// s langs de gevel, n de gevel in, NAP-hoogte h.
const facePoint = (a, b, s, n, h) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const t = [dx / len, dy / len];
  const out = [t[1], -t[0]];
  return [a[0] + t[0] * s - out[0] * n, a[1] + t[1] * s - out[1] * n, z(h)];
};
// Blinde nis van s0..s1, NAP h0..h1, diepte d (0,9 m naar buiten verlengd).
const niche = (a, b, s0, s1, h0, h1, d = 0.35) =>
  Manifold.hull([s0, s1].flatMap((s) => [[-0.9, h0], [d, h0], [d, h1], [-0.9, h1]].map(([n, h]) => facePoint(a, b, s, n, h))));
// Diepe band: het glas d terug, het plafond loopt onder 45 graden op naar de
// voorkant van de band erboven (printbaar zonder steun).
const band = (a, b, s0, s1, h0, h1, d) =>
  Manifold.hull([s0, s1].flatMap((s) => [[-0.9, h0], [d, h0], [d, h1 - d], [0, h1], [-0.9, h1]].map(([n, h]) => facePoint(a, b, s, n, h))));
const edgesOf = (poly) => ccw(poly).map((p, i, arr) => [p, arr[(i + 1) % arr.length]]);
const len = ([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]);
// Raamstroken per laag langs alle gevels van een veelhoek, met een penant per vak.
function bays(poly, rows, { pitch, width, margin = 0.6, depth = 0.35, minLen = 3 }) {
  const out = [];
  for (const e of edgesOf(poly)) {
    const L = len(e);
    if (L < minLen) continue;
    const n = Math.max(1, Math.round((L - 2 * margin) / pitch));
    const step = (L - 2 * margin) / n;
    const w = Math.min(width, step - 0.9);
    if (w < 0.6) continue;
    for (let k = 0; k < n; k++) {
      const c = margin + step * (k + 0.5);
      for (const [h0, h1] of rows) out.push(niche(e[0], e[1], c - w / 2, c + w / 2, h0, h1, depth));
    }
  }
  return out;
}

// ---------- laagbouw ----------
// Dakplaat over de hele BAG-omtrek, galerij eronder (rondom, aan de westkop
// verder), en de twee kantoorlagen 3,0 m terug met raamstroken per laag.
const roofSlab = prism(MAIN, z(H.roofLow), z(H.roof));
const deck = union([prism(MAIN, z(H.deckLow), z(H.deck)), prism(DECK_WEST, z(H.deckLow), z(H.deck))]);
const storeyRows = [0, 1].map((k) => [H.deck + H.storey * k + 0.9, H.deck + H.storey * (k + 1) - 0.4]);
let body = prism(BODY, z(H.deck) - 0.05, z(H.roofLow) + 0.05);
body = body.subtract(union(bays(BODY, storeyRows, { pitch: 7.2, width: 6.0 })));
// Hoge gevelkolommen van 1,2 m op ca. 7,2 m, 1,6 m binnen de dakrand, van de
// onderkant tot de dakplaat (door de galerij heen).
const COL_IN = 1.6;
const colRing = rect(-117.04 + COL_IN, -32.14 + COL_IN, 32.9 - COL_IN, 31.91 - COL_IN);
const colPoints = [];
for (const [a, b] of edgesOf(colRing)) {
  const L = len([a, b]);
  const n = Math.max(1, Math.round(L / 7.2));
  for (let k = 0; k < n; k++) colPoints.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
}
const columns = union(colPoints.map(([u, v]) => prism(rect(u - 0.6, v - 0.6, u + 0.6, v + 0.6), BASE, z(H.roofLow) + 0.05)));
// Dichte kern van de parkeerlaag (BGT) met glasstroken; de rest is open.
let core = prism(CORE, BASE, z(H.deckLow) + 0.05);
core = core.subtract(union(bays(CORE, [[H.ground + 0.4, H.deckLow - 0.5]], { pitch: 7.2, width: 5.0 })));

// ---------- daklichten, lichthoven en zonnepanelen op de laagbouw (AHN5) ----------
const roofBoxes = union([
  prism(rect(-21.0, 0.9, -14.0, 11.4), z(H.roof) - 0.05, z(H.skylight)), // glazen daklicht west van de toren
  prism(rect(14.0, -12.1, 21.0, -1.1), z(H.roof) - 0.05, z(H.skylight)), // zonnepanelen oost van de toren
  prism(rect(-91.5, -18.1, -90.5, 18.4), z(H.roof) - 0.05, z(H.skylight)), // lichtstrook langs de statenzaal
  ...[[-104.3, 15.6], [-106.8, -13.8], [-113.0, -17.1], [28.7, -19.8], [28.2, 27.6]].map(([u, v]) =>
    prism(rect(u - 0.7, v - 1.2, u + 0.7, v + 1.2), z(H.roof) - 0.05, z(H.skylight)),
  ),
]);
const lightwells = union([
  prism(rect(-19.0, -11.1, -14.0, -2.1), z(H.lightwell), z(H.roof) + 1), // lichthof west van de toren
  prism(rect(14.0, 1.9, 20.0, 10.4), z(H.lightwell), z(H.roof) + 1), // patio met beplanting oost van de toren
]);

// ---------- statenzaal ----------
// Per dak: de zaal onder het dak (aan de kopgevels 1,5 m terug onder het
// overstek), een dakplaat van 1,0 m die het dakvlak volgt, raamsleuven in de
// kopgevels en, bij het middelste dak, vier witte schijven per kopgevel die
// het overstek dragen (foto's).
const hallParts = [];
const hallCuts = [];
for (const h of HALL) {
  for (const p of h.planes) {
    const [a, , c] = planeU(p);
    const full = rect(p.u0, -HALL_V, p.u1, HALL_V);
    const inner = rect(p.u0, -HALL_V + HALL_EAVE, p.u1, HALL_V - HALL_EAVE);
    const top = Math.max(p.z0, p.z1);
    hallParts.push(cut(prism(full, z(H.roof) - 0.1, z(top) + 1), a, 0, c)); // dak (bovenkant = dakvlak)
    hallParts.push(cut(prism(inner, z(H.roof) - 0.1, z(top) + 1), a, 0, c - 0.95)); // zaal tot onder de dakplaat
    // Onderkant van het overstek loopt onder 45 graden naar de gevel (de blauwe
    // onderzijde op de foto's): aan de rand 1,0 m dik, tegen de gevel 2,5 m.
    for (const sg of [-1, 1]) {
      const strip = sg > 0 ? rect(p.u0, HALL_V - HALL_EAVE - 0.05, p.u1, HALL_V) : rect(p.u0, -HALL_V, p.u1, -HALL_V + HALL_EAVE + 0.05);
      const soffit = cut(prism(strip, z(H.roof), z(top) + 1), a, sg, c - 1.0 - HALL_V, "above");
      hallParts.push(cut(soffit, a, 0, c - 0.95));
    }
    // Raamsleuven van 1,2 m op ca. 2,4 m in beide kopgevels, tot 1,6 m onder het dakvlak.
    const W = p.u1 - p.u0;
    const n = Math.max(1, Math.round((W - 1.2) / 2.4));
    const vF = HALL_V - HALL_EAVE;
    const zAt = (u) => p.z0 + ((p.z1 - p.z0) * (u - p.u0)) / W;
    for (let k = 0; k < n; k++) {
      const uc = p.u0 + 0.6 + ((W - 1.2) * (k + 0.5)) / n;
      const top = Math.min(zAt(uc - 0.6), zAt(uc + 0.6)) - 2.7;
      if (top - (H.roof + 1.0) < 1.5) continue;
      hallCuts.push(niche([p.u1, vF], [p.u0, vF], p.u1 - uc - 0.6, p.u1 - uc + 0.6, H.roof + 1.0, top));
      hallCuts.push(niche([p.u0, -vF], [p.u1, -vF], uc - p.u0 - 0.6, uc - p.u0 + 0.6, H.roof + 1.0, top));
    }
  }
}
// Hoge westwand van het middelste dak boven het westelijke dak: raamsleuven.
for (let k = 0; k < 6; k++) {
  const vc = -12.5 + k * 5.0;
  hallCuts.push(niche([-69.25, HALL_V - HALL_EAVE], [-69.25, -HALL_V + HALL_EAVE], HALL_V - HALL_EAVE - vc - 0.6, HALL_V - HALL_EAVE - vc + 0.6, 21.4, 27.5));
}
// Schijven onder het overstek van het middelste dak.
const finU = [0.12, 0.2, 0.8, 0.88].map((f) => -69.25 + 18.5 * f);
const fins = [];
for (const uc of finU) {
  const pl = uc < -60.25 ? HALL[1].planes[0] : HALL[1].planes[1];
  const [a, , c] = planeU(pl);
  for (const sgn of [-1, 1]) {
    const v0 = sgn > 0 ? HALL_V - HALL_EAVE - 0.1 : -HALL_V;
    const v1 = sgn > 0 ? HALL_V : -HALL_V + HALL_EAVE + 0.1;
    fins.push(cut(prism(rect(uc - 0.45, v0, uc + 0.45, v1), z(H.roof) - 0.1, z(31)), a, 0, c - 0.9));
  }
}
let hall = union([...hallParts, ...fins]);
hall = hall.subtract(union(hallCuts));

// ---------- toren ----------
const TOWER = cs(rect(-T.midU, -T.midV, T.midU, T.midV)).add(cs(chamferRect(-T.endU, -T.endV, T.endU, T.endV, T.chamfer)));
const towerPoly = TOWER.toPolygons()[0].map(([x, y]) => [+x.toFixed(3), +y.toFixed(3)]);
// Borstwering: west +95,5, vanaf het midden in 5 m oplopend tot +97,15 (AHN5).
const BIG = 40;
const zTopTower = z(H.parapetEast) + 0.01;
let shaft = Manifold.extrude(TOWER, zTopTower - z(H.roofLow)).translate([0, 0, z(H.roofLow)]);
const slopeA = (H.parapetEast - H.parapetWest) / 5.0;
const topShape = union([
  prism(rect(-BIG, -BIG, 0, BIG), z(H.roofLow) - 1, z(H.parapetWest)),
  cut(prism(rect(0, -BIG, 5, BIG), z(H.roofLow) - 1, zTopTower + 1), slopeA, 0, z(H.parapetWest)),
  prism(rect(5, -BIG, BIG, BIG), z(H.roofLow) - 1, z(H.parapetEast)),
]);
shaft = shaft.intersect(topShape);
// Dak binnen de borstwering op +94,4 en een installatiestrook langs de oostzijde (+96,2).
shaft = shaft.subtract(prism(RING_IN, z(H.towerRoof), zTopTower + 2));
const plantStrip = prism(rect(CROWN.u1 - 0.2, RING_IN[0][1], RING_IN[1][0] + 0.05, RING_IN[2][1]), z(H.towerRoof) - 0.05, z(H.plantStrip));
// Banden: 22 lagen met het glas 1,0 m terug, de bovenste laag dicht (borstwering).
const floors = range(22, (k) => +(H.towerFloor0 + H.towerStorey * k).toFixed(3));
const BAND_D = 1.0;
const bandRows = floors.map((f) => [f + 0.45, f + H.towerStorey - 0.45]);
const faces = {
  west: [[-T.midU, T.midV], [-T.midU, -T.midV]],
  east: [[T.midU, -T.midV], [T.midU, T.midV]],
  north: [[T.pierU, T.endV], [-T.pierU, T.endV]],
  south: [[-T.pierU, -T.endV], [T.pierU, -T.endV]],
};
const bandCuts = [];
for (const [k, [a, b]] of Object.entries(faces)) {
  const L = len([a, b]);
  const m = k === "west" || k === "east" ? 0.5 : 0.0;
  for (const [h0, h1] of bandRows) bandCuts.push(band(a, b, m, L - m, h0, h1, BAND_D));
}
// Verticale voegen (0,6 m breed, 0,35 m diep) midden op elke hoekpijler, op de
// kopgevels en op de zijkanten langs de lange gevels.
const grooves = [];
const gH = [H.roof + 0.6, H.parapetWest - 0.6];
const pierUc = (T.pierU + T.endU - T.chamfer) / 2;
const pierVc = (T.midV + T.endV - T.chamfer) / 2;
for (const sg of [-1, 1]) {
  const uc = sg * pierUc;
  grooves.push(niche([T.endU, T.endV], [-T.endU, T.endV], T.endU - uc - 0.3, T.endU - uc + 0.3, ...gH));
  grooves.push(niche([-T.endU, -T.endV], [T.endU, -T.endV], uc + T.endU - 0.3, uc + T.endU + 0.3, ...gH));
  const vc = sg * pierVc;
  grooves.push(niche([-T.endU, T.endV], [-T.endU, -T.endV], T.endV - vc - 0.3, T.endV - vc + 0.3, ...gH));
  grooves.push(niche([T.endU, -T.endV], [T.endU, T.endV], vc + T.endV - 0.3, vc + T.endV + 0.3, ...gH));
}
shaft = shaft.subtract(union([...bandCuts, ...grooves]));
// Kroon: dichte wand tot +98,8, donkere glasstrook 1,0 m terug tot +101,3,
// dakplaat tot +103,3 met een installatiekast en een opbouwtje.
const CROWN_R = rect(CROWN.u0, CROWN.v0, CROWN.u1, CROWN.v1);
const crownWall = prism(CROWN_R, z(H.towerRoof) - 0.1, z(H.crownGlass));
const crownGlass = prism(rect(CROWN.u0 + CROWN.glassIn, CROWN.v0 + CROWN.glassIn, CROWN.u1 - CROWN.glassIn, CROWN.v1 - CROWN.glassIn), z(H.crownGlass) - 0.05, z(H.capLow) + 0.05);
// Penanten in de glasstrook op de hoeken en op ca. 6 m.
const crownPiers = union(
  [
    ...[CROWN.u0, CROWN.u1].flatMap((u) => [CROWN.v0, -5.0, 5.0, CROWN.v1].map((v) => [u, v])),
    ...[-3.0, 3.0].flatMap((u) => [CROWN.v0, CROWN.v1].map((v) => [u, v])),
  ].map(([u, v]) => {
    const u0 = Math.min(Math.max(u - 0.6, CROWN.u0), CROWN.u1 - 1.2);
    const v0 = Math.min(Math.max(v - 0.6, CROWN.v0), CROWN.v1 - 1.2);
    return prism(rect(u0, v0, u0 + 1.2, v0 + 1.2), z(H.crownGlass) - 0.05, z(H.capLow) + 0.05);
  }),
);
const cap = prism(CROWN_R, z(H.capLow), z(H.crown));
const crownPlant = union([
  prism(rect(-2.5, 9.5, 3.0, 12.5), z(H.crown) - 0.05, z(H.crownPlant)),
  prism(rect(-0.5, -7.5, 0.5, -6.5), z(H.crown) - 0.05, z(H.crownHatch)),
]);

// ---------- oostvleugel, terras en loopbrug ----------
const annex = union([
  prism(ANNEX, z(H.deckLow), z(H.deck)),
  prism(rect(47.27, -17.48, 48.17, 13.6), z(H.deck) - 0.05, z(H.annexParapet)),
  prism(rect(32.9, -17.48, 48.17, -16.58), z(H.deck) - 0.05, z(H.annexParapet)),
  prism(rect(32.9, -13.0, 35.0, 13.0), z(H.deck) - 0.05, z(H.annexStrip)),
  prism(TERRACE, z(H.deckLow), z(H.terrace)),
  ...[[47.5, -16.8], [47.5, 0], [40.0, -16.8], [53.8, -16.8], [53.8, 0], [53.8, 12.3]].map(([u, v]) =>
    prism(rect(u - 0.45, v - 0.45, u + 0.45, v + 0.45), BASE, z(H.deckLow) + 0.05),
  ),
]);
let bridge = prism(BRIDGE, z(H.bridgeLow), z(H.bridge));
bridge = bridge.subtract(union([niche(...edgesOf(BRIDGE)[0], 16.2, 31.2, 7.6, 9.4), niche(...edgesOf(BRIDGE)[2], 0.5, 15.5, 7.6, 9.4)]));

// ---------- oprit en luifel aan de noordzijde ----------
// Oprit van het voorplein (+5,1) naar de galerij (+7,2), met borstweringen
// van 0,6 m en de vide naar de parkeerlaag; luifel op vier kolommen.
const rampA = -(H.rampSouth - H.rampNorth) / (70.92 - 33.0);
const rampC = z(H.rampSouth) - rampA * 33.0;
let ramp = cut(prism(RAMP, BASE, z(H.rampSouth) + 2), 0, rampA, rampC);
ramp = union([ramp, cut(prism(rect(-53.05, 31.91, -52.05, 70.92), BASE, z(H.rampSouth) + 3), 0, rampA, rampC + 0.6), cut(prism(rect(-32.08, 31.91, -31.08, 70.92), BASE, z(H.rampSouth) + 3), 0, rampA, rampC + 0.6)]);
ramp = ramp.subtract(prism(RAMP_HOLE, BASE - 1, z(H.porch) - 1.5));
const porch = union([
  prism(PORCH, z(H.porch) - 1.0, z(H.porch)),
  ...[[-50.0, 50.5], [-34.5, 50.5], [-50.0, 41.0], [-34.5, 41.0]].map(([u, v]) => prism(rect(u - 0.45, v - 0.45, u + 0.45, v + 0.45), z(5.0), z(H.porch) - 0.95)),
]);

const parts = {
  roofSlab, deck, body, columns, core, roofBoxes, hall, shaft, plantStrip, crownWall, crownGlass, crownPiers, cap, crownPlant, annex, bridge, ramp, porch,
};
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts)).subtract(lightwells);
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));
console.log("toren:", JSON.stringify(towerPoly));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Provinciehuis Noord-Brabant met toren laagbouw op kolommen statenzaal oprit en loopbrug", model]],
  catalog: {
    name: "Provinciehuis Noord-Brabant",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Parkeerterrein ten zuiden en oosten van de laagbouw (PDOK-terrein
    // ellipsoïdisch 46,19-46,22); de vijver (45,24) en het hogere voorplein
    // aan de noordzijde (48,6) blijven erbuiten.
    groundSamplePoints: [[-90, -38], [-40, -38], [10, -38], [40, -25]],
    groundHeight: 46.19,
    replacesBuildings: ["NL.IMBAG.Pand.0796100000239857"],
    description:
      "Oorsprong in het hart van de toren op parkeerniveau NAP +2,65 m, +X op 1,674 graden in RD langs de lange gevels, +Y naar het noorden (oprit en Brabantlaan); laagbouw van 149,9 x 64,05 m (dak +15,5) met twee kantoorlagen achter hoge gevelkolommen, een rondlopende galerij (+7,1) boven een open parkeerlaag met dichte kern, de statenzaal met drie koperen daken (west +19,3 tot +20,3, vlinderdak midden +30,0/+23,55/+25,9 met schijven onder het overstek, oost +20,3 tot +23,95), daklichten, lichthoven en zonnepanelen; toren van 26,9 x 40,9 m met 22 diepe banden tussen vier hoekpijlers, borstwering +95,5 tot +97,15, kroon met glasstrook en dakplaat tot +103,3 en een installatiekast (+104,2); aan de noordzijde de oprit (+5,1 tot +7,2) met luifel (+11,3), aan de oostzijde een terras (+6,6/+7,1) en een loopbrug (+10,0) naar Brabantlaan 3. Galerij, kolommen, laaghoogtes en de kroonopbouw uit foto's.",
    realWorld: {
      groundNapM: GROUND_NAP,
      axisDegrees: AXIS_DEG,
      lowRiseM: [149.94, 64.05],
      lowRiseNapM: { deck: H.deck, deckSoffit: H.deckLow, roofSoffit: H.roofLow, roof: H.roof },
      hallRoofNapM: { west: [19.31, 20.31], middle: [30.0, 23.55, 25.9], east: [20.3, 23.95] },
      towerM: [2 * T.midU, 2 * T.endV],
      towerNapM: { firstFloor: H.towerFloor0, roof: H.towerRoof, parapet: [H.parapetWest, H.parapetEast], crown: H.crown, crownPlant: H.crownPlant },
      crownM: [+(CROWN.u1 - CROWN.u0).toFixed(2), +(CROWN.v1 - CROWN.v0).toFixed(2)],
      storeys: { tower: 23, lowRise: 2, parking: 1 },
      rampNapM: [H.rampNorth, H.rampSouth],
      porchNapM: H.porch,
      bridgeNapM: H.bridge,
      estimates: [
        "galerij (+5,6 tot +7,1), dakplaat van de laagbouw (+14,0 tot +15,5), de gevel 3,0 m achter de dakrand en de kolommen van 1,2 m op ca. 7,2 m uit foto's (RCE); de bovenkant van de galerij uit het AHN aan de westkop",
        "torenlagen: 23 lagen van 3,4 m vanaf +16,2 tot het dak +94,4 (Wikipedia: 23 verdiepingen); de bovenste laag als dichte borstwering, de banden met het glas 1,0 m terug en een plafond onder 45 graden (de echte banden zijn dunner en dieper)",
        "hoekpijlers 6,0 m breed op de kopgevels en 7,45 m langs de lange gevels (AHN-omtrek, foto's); de holle overgang naar de banden is weggelaten",
        "kroon: dichte wand tot +98,8, glasstrook 1,0 m terug tot +101,3 en dakplaat tot +103,3 uit foto's; alleen de dakhoogte komt uit het AHN",
        "statenzaal: dakvlakken uit het AHN, overstek van 1,5 m aan de kopgevels, dakplaat 1,0 m en de vier schijven per kopgevel van het middelste dak uit foto's; de zaal zelf als dicht volume onder de daken",
        "dichte kern van de parkeerlaag op de BGT-omtrek; de open parkeerlaag zonder binnenkolommen",
        "luifel op vier kolommen, terras en loopbrug: onderkanten en kolommen geschat",
      ],
    },
    sources: [
      "PDOK BAG pand 0796100000239857, BGT-pand van dat pand op het maaiveld, Actueel_orthoHR; 2026-10-12",
      "AHN5 DSM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; AHN4 DSM/DTM 0,5 m (PDOK WCS)",
      "https://nl.wikipedia.org/wiki/Provinciehuis_(Noord-Brabant)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_-_%27s-Hertogenbosch_-_20413415_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Overzicht,_vijver_op_de_voorgrond_-_%27s-Hertogenbosch_-_20413416_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Overzicht,_vijver_op_de_voorgrond_-_%27s-Hertogenbosch_-_20413397_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Overzicht,_vijver_op_de_voorgrond_-_%27s-Hertogenbosch_-_20413398_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Overzicht,_vijver_met_kunstwerk_op_de_voorgrond_-_%27s-Hertogenbosch_-_20413414_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Overzicht_-_%27s-Hertogenbosch_-_20348592_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Provinciehuis_Noord-Brabant_vanaf_de_Guido_Gezellelaan.jpg",
      "https://commons.wikimedia.org/wiki/File:%27s-Hertogenbosch_-_Provinciehuis_Noord-Brabant.jpg",
    ],
  },
});

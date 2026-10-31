// The Muse (Wijnhaven, Rotterdam; BARCODE Architects, 2019): woontoren van 23 lagen, NAP +75,75 m.
// Een onderbouw van vijf lagen op de hele BAG-contour, daarboven een "rok" van vier lagen (5e t/m 8e)
// die naar de toren toe versmalt: aan de Wijnhaven (zuid) en de Wijnstraat (noord) getrapte terrassen,
// aan de oostkant een donker dakvlak met dakramen en een uitsparing naar het dakterras van CasaNova, aan
// de westkant twee schuine, naar buiten hellende wanden ("de knik naar het noordwesten"). De toren zelf:
// een antraciet kader met gesloten oost- en westgevels (verspringende ramen) en glazen noord- en
// zuidgevels met per laag een witte balkonband en drie diepere balkons die per laag verspringen.
// Contour uit de BAG, hoogtes uit de 3D BAG-dakvlakken (AHN5 2023) en het AHN4-DSM, opbouw van de rok
// uit de plattegronden van de 5e en 15e verdieping en foto's van BARCODE (alleen visuele referentie) en
// Commons; maten van verdiepingen, balkons en ramen geschat.
import { Manifold, CrossSection, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "the-muse";
// Gebouwstelsel: u langs de lange gevels naar het oost-noordoosten (17,6° op RD-oost), v naar het
// noord-noordwesten; oorsprong in het hart van de BAG-contour. Alle hoogtes hieronder in NAP.
const ORIGIN = [93041.4, 436981.5];
const DEG = 17.6;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(6), +Math.sin((DEG * Math.PI) / 180).toFixed(6)];
const GROUND = 2.55; // NAP, Wijnhaven-kade voor de zuidgevel (AHN-DTM 2,45–2,69; 3D BAG-maaiveld 2,50)
const BASE = -0.8;
const BOTTOM = GROUND + BASE;

// ---------- Hoogtes (NAP) ----------
const PODIUM_ROOF = 18.9; // dak onderbouw = vloer 5 (3D BAG 18,73–18,95; DSM 19)
const STOREY = 2.954; // vloer 5 t/m 23: terrassen 21,9 / 24,9 / 27,8 en dakpatio's 72,17 (3D BAG)
const L = (k) => PODIUM_ROOF + (k - 5) * STOREY; // vloerpeil van verdieping k (k ≥ 5)
const PODIUM_FLOORS = [GROUND, 8.0, 10.725, 13.45, 16.175, PODIUM_ROOF]; // begane grond 5,45 m (geschat)
const ROOF = 75.75; // hoofddak (3D BAG 75,75–75,76, 597 m²)
const PARAPET = 76.55; // dakrand van het kader (3D BAG-randjes 76,49–76,57)
const PATIO = 72.17; // twee verdiepte dakterrassen van de penthouses (3D BAG 72,14–72,19)
const PLANT = 77.55; // installatie-/liftopbouw (3D BAG 77,49–77,57)
const NOTCH = 21.5; // vloer van de uitsparing in het oostelijke dakvlak (3D BAG 21,2–21,85)

// ---------- Plattegronden (lokaal stelsel) ----------
// BAG-contour 0599100100015965 (de hoekjes van 1,1 × 0,8 m aan de zuidkant zijn hoekpenanten).
const CONTOUR = [[-20.64, 21.68], [-20.75, 2.78], [-20.72, -16.23], [-19.59, -16.23], [-19.59, -15.45], [22.18, -15.4], [22.18, -16.25], [23.26, -16.24], [23.26, 19.89], [22.12, 19.92], [22.1, 19.57], [-19.54, 21.26], [-19.52, 21.63]];
const NORTH_EDGE = [[22.1, 19.57], [-19.54, 21.26]];
const northV = (u) => 19.57 + ((22.1 - u) * (21.26 - 19.57)) / (22.1 + 19.54);
// Toren: kader op de 3D BAG-dakrand (u −14,8…13,6, v −5,3…15,2).
const T = { u0: -14.8, u1: 13.6, v0: -5.3, v1: 15.2 };
const EAST = 23.25; // oostgrens = westgevel CasaNova (die staat op dezelfde BAG-lijn)
// Rok op vloer 5: aan de westkant een afgeknotte punt (plattegrond 5e verdieping), met de voeten van de
// schuine wanden op de gevellijnen van de onderbouw.
const FOOT_SW = [-5.1, -15.4], APEX_S = [-14.8, -0.2], APEX_N = [-14.8, 9.2], FOOT_NW = [-5.2, northV(-5.2)];
const SKIRT_FOOT = [APEX_S, FOOT_SW, [EAST, -15.4], [EAST, northV(EAST)], FOOT_NW, APEX_N];
// Gevels van de terrassen per verdieping (5 t/m 8) aan de zuid- en noordkant.
const SOUTH_FRONT = { 5: -13.5, 6: -10.9, 7: -8.3, 8: T.v0 };
const NORTH_FRONT = { 5: 19.2, 6: 17.9, 7: 16.55, 8: T.v1 };
// Uitsparing in het oostelijke dakvlak (3D BAG en AHN4 verschillen; middenweg).
const NOTCH_PLAN = rect(19.0, 0.0, 30, 12.0);
const PATIOS = [rect(-11.4, 1.8, -7.8, 8.9), rect(6.7, 2.1, 10.4, 8.6)];
const PLANT_PLAN = rect(-5.0, 2.6, 3.7, 9.3);

// ---------- Hulpjes ----------
const sub = (a, b) => a.map((x, i) => x - b[i]);
const add = (a, b) => a.map((x, i) => x + b[i]);
const mul = (a, s) => a.map((x) => x * s);
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => mul(a, 1 / Math.hypot(...a));
const INSIDE = [0, 5, 25];
// Vlak door drie punten met de normaal naar binnen; keep() houdt het deel binnen het vlak (verschoven).
function plane(a, b, c) {
  let n = unit(cross(sub(b, a), sub(c, a)));
  if (dot(n, INSIDE) < dot(n, a)) n = mul(n, -1);
  return { n, d: dot(n, a), a };
}
const keep = (m, p, shift = 0) => m.trimByPlane(p.n, p.d + shift);
const planeU = (p, v, z) => (p.d - p.n[1] * v - p.n[2] * z) / p.n[0];
const P_SW = plane([...APEX_S, PODIUM_ROOF], [...FOOT_SW, PODIUM_ROOF], [T.u0, T.v0, L(9)]);
const P_NW = plane([...APEX_N, PODIUM_ROOF], [...FOOT_NW, PODIUM_ROOF], [T.u0, T.v1, L(9)]);
const P_E = plane([EAST, 0, PODIUM_ROOF], [EAST, 10, PODIUM_ROOF], [T.u1, 0, L(9)]);
const P_W = { n: [1, 0, 0], d: T.u0 };
const P_EV = { n: [-1, 0, 0], d: -EAST };
const clip = (m) => [P_W, P_SW, P_NW, P_E, P_EV].reduce((acc, p) => keep(acc, p), m);

// Blinde nis of verzonken glaszone in een (schuin) gevelvlak: rechthoek [a0,a1] × [b0,b1] in het vlak
// (e1 horizontaal, e2 omhoog in het vlak), D diep langs de normaal; het plafond loopt altijd steiler dan
// 47° (onder de printhoek), ook in een naar buiten hellende wand of een dakvlak.
function nicheCut({ Q, e1, e2, nO }, a0, a1, b0, b1, D, out = 0.25) {
  const h = Math.hypot(nO[0], nO[1]);
  const extra = Math.max(0, 1.1 * (out + D) * h - (out + D) * nO[2]);
  const S = (a, b) => add(Q, add(mul(e1, a), mul(e2, b)));
  const pts = [];
  for (const a of [a0, a1]) {
    pts.push(add(S(a, b0), mul(nO, out)), add(S(a, b1), mul(nO, out)), add(S(a, b0), mul(nO, -D)));
    pts.push(sub(add(S(a, b1), mul(nO, -D)), [0, 0, extra]));
  }
  return Manifold.hull(pts);
}
// Ligt de rechthoek helemaal op het vrije gevelvlak? (stralen van buiten raken het vlak op de verwachte plek)
function exposed(body, { Q, e1, e2, nO }, a0, a1, b0, b1) {
  const S = (a, b) => add(Q, add(mul(e1, a), mul(e2, b)));
  return [a0 + 0.1, a1 - 0.1].every((a) => [b0 + 0.1, b1 - 0.1].every((b) => {
    const p = S(a, b), from = add(p, mul(nO, 3)), hit = body.rayCast(from, add(p, mul(nO, -1)))[0];
    return hit && Math.abs(Math.hypot(...sub(hit.position, from)) - 3) < 0.05;
  }));
}
const frame = (Q, nO) => {
  const e1 = unit([-nO[1], nO[0], 0]);
  let e2 = unit(cross(nO, e1));
  if (e2[2] < 0) e2 = mul(e2, -1);
  return { Q, e1, e2, nO };
};

// ---------- Onderbouw (begane grond + 4 lagen) ----------
// Noord- en zuidgevel: per laag een witte band (vloerrand + borstwering, 1,25 m) en daartussen de glazen
// pui 0,9 m terug (begane grond 1,3 m, met een donkere penant midden in de zuidgevel); west- en oostgevel
// zijn gemene muren met het buurpand en CasaNova.
const podium = prism(CONTOUR, BOTTOM, PODIUM_ROOF);
const southFace = frame([0, -15.41, 0], [0, -1, 0]);
const nDir = unit(sub([...NORTH_EDGE[1], 0], [...NORTH_EDGE[0], 0]));
const northFace = { Q: [...NORTH_EDGE[0], 0], e1: nDir, e2: [0, 0, 1], nO: [nDir[1], -nDir[0], 0] };
const northLen = Math.hypot(NORTH_EDGE[1][0] - NORTH_EDGE[0][0], NORTH_EDGE[1][1] - NORTH_EDGE[0][1]);
const podiumCuts = [];
for (let j = 0; j < 5; j++) {
  const lo = j === 0 ? BOTTOM + 0.05 : PODIUM_FLOORS[j] + 0.95, hi = PODIUM_FLOORS[j + 1] - 0.3, D = j === 0 ? 1.3 : 0.9;
  // zuid: tussen de hoekpenanten; de penant onder de entree blijft staan in de begane grond
  if (j === 0) podiumCuts.push(nicheCut(southFace, -19.0, -0.6, lo, hi, D), nicheCut(southFace, 1.9, 21.6, lo, hi, D));
  else podiumCuts.push(nicheCut(southFace, -19.0, 21.6, lo, hi, D));
  podiumCuts.push(nicheCut(northFace, 0.6, northLen - 0.6, lo, hi, D));
}
const podiumBody = podium.subtract(union(podiumCuts));

// ---------- Rok (verdieping 5 t/m 8) ----------
// Omhullende: van de voet op het dak van de onderbouw naar de torenplattegrond op vloer 9.
const tower2 = rect(T.u0, T.v0, T.u1, T.v1);
const H = Manifold.hull([
  ...SKIRT_FOOT.map(([u, v]) => [u, v, PODIUM_ROOF - 0.1]),
  ...SKIRT_FOOT.map(([u, v]) => [u, v, PODIUM_ROOF]),
  ...tower2.map(([u, v]) => [u, v, L(9)]),
]);
// Terrassen: per verdieping een blok tussen de zuid- en noordgevel van die laag, afgesneden door de
// schuine westwanden en het oostelijke dakvlak.
const boxes = [5, 6, 7, 8].map((k) => prism(rect(-30, SOUTH_FRONT[k], 40, NORTH_FRONT[k]), L(k) - (k === 5 ? 0.1 : 0.02), L(k + 1)));
const terraces = clip(union(boxes));
// Donkere randen: de bovenkant van de schuine westwanden (2 m) en het oostelijke dakvlak (1 m) liggen als
// gladde schuine vlakken over de uiteinden van de terrassen (de "hoekkepers" op de foto's).
const rims = union([
  H.subtract(keep(H, P_SW, 2.0)),
  H.subtract(keep(H, P_NW, 2.0)),
  H.subtract(keep(H, P_E, 1.0)),
]);
const notchFill = prism(rect(19.0, 0.0, EAST, 12.0), PODIUM_ROOF - 0.1, NOTCH);

// ---------- Toren (verdieping 9 t/m 23) ----------
const towerBody = prism(tower2, L(9) - 0.05, ROOF);

let body = union([podiumBody, terraces, rims, notchFill, towerBody]);
body = body.subtract(prism(NOTCH_PLAN, NOTCH, 60));

// Glazen noord- en zuidgevel van de toren 0,8 m achter het antraciet kader (hoekpenanten 0,9 m, kaderband
// boven 0,9 m); onder vloer 9 alleen tussen de donkere randen van de rok.
const towerSouth = frame([0, T.v0, 0], [0, -1, 0]);
const towerNorth = frame([0, T.v1, 0], [0, 1, 0]);
const sU = (face, u) => (face.e1[0] > 0 ? u : -u); // u → a langs e1
const recess = (face, u0, u1, b0, b1) => nicheCut(face, Math.min(sU(face, u0), sU(face, u1)), Math.max(sU(face, u0), sU(face, u1)), b0, b1, 0.8, 0.3);
const cuts = [];
for (const face of [towerSouth, towerNorth]) {
  cuts.push(recess(face, T.u0 + 0.9, T.u1 - 0.9, L(9) - 0.3, ROOF - 0.9));
  cuts.push(recess(face, -11.5, 11.0, L(8) + 0.05, L(9) - 0.3 + 0.9));
}
// Glazen gevels van de terrasblokken 5 t/m 7, 0,5 m terug, tussen de donkere randen.
for (const k of [5, 6, 7]) {
  const lo = L(k) + 0.05, hi = L(k + 1) - 0.35;
  for (const [face, v, side] of [[frame([0, SOUTH_FRONT[k], 0], [0, -1, 0]), SOUTH_FRONT[k], P_SW], [frame([0, NORTH_FRONT[k], 0], [0, 1, 0]), NORTH_FRONT[k], P_NW]]) {
    const uW = Math.max(planeU(side, v, lo), planeU(side, v, hi + 0.5), T.u0) + 2.6;
    const uE = Math.min(planeU(P_E, v, hi + 0.5), k === 5 && face.nO[1] > 0 ? 40 : 40) - 1.6;
    if (uE - uW > 2) cuts.push(nicheCut(face, Math.min(sU(face, uW), sU(face, uE)), Math.max(sU(face, uW), sU(face, uE)), lo, hi, 0.5));
  }
}
for (const p of PATIOS) cuts.push(prism(p, PATIO, ROOF + 2));
body = body.subtract(union(cuts));

// Ramen als blinde nissen (0,35 m, plafond steiler dan 47°): de gesloten oost- en westgevel van de toren
// (verspringend per laag), de schuine westwanden van de rok en dakramen in het oostelijke dakvlak.
const windows = [];
const tryNiche = (face, a0, a1, b0, b1, D = 0.35) => {
  if (exposed(body, face, a0, a1, b0, b1)) windows.push(nicheCut(face, a0, a1, b0, b1, D));
};
const towerWest = frame([T.u0, 0, 0], [-1, 0, 0]), towerEast = frame([T.u1, 0, 0], [1, 0, 0]);
for (let k = 5; k <= 23; k++) {
  const centres = k % 2 ? [-0.85, 3.25, 7.35, 11.45] : [-2.9, 1.2, 5.3, 9.4, 13.5];
  for (const face of [towerWest, towerEast]) {
    for (const c of centres) {
      const a = face.e1[1] > 0 ? c : -c;
      tryNiche(face, a - 0.5, a + 0.5, L(k) + 0.85, L(k) + 2.55);
    }
  }
}
for (const p of [P_SW, P_NW]) {
  const face = frame(p.a, mul(p.n, -1));
  for (let k = 5; k <= 8; k++) {
    const b0 = (L(k) + 0.85 - p.a[2]) / face.e2[2], b1 = (L(k) + 2.45 - p.a[2]) / face.e2[2];
    for (let a = -24; a <= 24; a += 3.0) tryNiche(face, a, a + 1.0, b0, b1);
  }
}
{
  const face = frame(P_E.a, mul(P_E.n, -1));
  for (let k = 5; k <= 8; k++) {
    const b0 = (L(k) + 0.5 - P_E.a[2]) / face.e2[2], b1 = (L(k) + 2.1 - P_E.a[2]) / face.e2[2];
    for (let v = -13.6; v <= 18; v += 2.7) {
      const a = face.e1[1] > 0 ? v : -v;
      tryNiche(face, a - 0.6, a + 0.6, b0, b1);
    }
  }
}
body = body.subtract(union(windows));

// ---------- Opbouw: borstweringen, balkons, dakrand, installaties ----------
const adds = [];
// Borstwering (0,9 m dik, 1,0 m hoog) langs de dakrand van de onderbouw en langs de terrassen.
adds.push(prism(rect(-19.59, -15.42, 22.18, -14.52), PODIUM_ROOF - 0.02, PODIUM_ROOF + 1.0));
{
  const cs = new CrossSection([CONTOUR]);
  const ringN = cs.subtract(cs.offset(-0.9, "Miter")).intersect(new CrossSection([rect(-20.0, 19.0, -5.2, 22)]));
  adds.push(ringN.extrude(1.02).translate([0, 0, PODIUM_ROOF - 0.02]));
}
for (const k of [5, 6, 7]) {
  adds.push(clip(prism(rect(-30, SOUTH_FRONT[k], 40, SOUTH_FRONT[k] + 0.9), L(k + 1) - 0.02, L(k + 1) + 1.0)));
  // noord, 8e verdieping: het terras is maar 1,35 m diep en ligt onder de balkons van de 9e; geen borstwering
  if (k < 7) adds.push(clip(prism(rect(-30, NORTH_FRONT[k] - 0.9, 40, NORTH_FRONT[k]), L(k + 1) - 0.02, L(k + 1) + 1.0)));
}
// Balkons noord en zuid, verdieping 9 t/m 23: een doorlopende witte band (vloerrand + borstwering 1,25 m,
// 1,3 m buiten het glas) en per laag drie diepe balkons (2,9 m buiten het glas) die per laag een vak
// opschuiven, met een open balkonvloer achter een borstwering van 0,9 m dik en 0,95 m hoog; onder elk
// balkon een kraag van 47° naar de gevel.
const SLOT0 = T.u0 + 0.9, SLOT1 = T.u1 - 0.9, SLOTS = 6, SLOT_W = (SLOT1 - SLOT0) / SLOTS;
const SHALLOW = 0.5, DEEP = 2.1; // uitsteek buiten de kaderlijn
const balcony = (side, u0, u1, f, tOut) => {
  const V = (t) => (side < 0 ? T.v0 - t : T.v1 + t);
  const pts = [];
  for (const u of [u0, u1]) {
    pts.push([u, V(-0.85), f + 0.95], [u, V(tOut), f + 0.95], [u, V(tOut), f - 0.3], [u, V(-0.85), f - 0.3 - (tOut + 0.85) * 1.1]);
  }
  return Manifold.hull(pts);
};
// Open balkonvloer: achter de borstwering tot aan het glas, tussen zijwangen van 0,9 m.
const pocket = (side, u0, u1, f) => {
  const V = (t) => (side < 0 ? T.v0 - t : T.v1 + t);
  return prism([[u0 + 0.9, V(-0.8)], [u1 - 0.9, V(-0.8)], [u1 - 0.9, V(DEEP - 0.9)], [u0 + 0.9, V(DEEP - 0.9)]], f, f + 0.97);
};
const balconies = [], pockets = [];
for (let k = 9; k <= 23; k++) {
  for (const side of [-1, 1]) {
    balconies.push(balcony(side, SLOT0, SLOT1, L(k), SHALLOW));
    for (let s = k % 2; s < SLOTS; s += 2) {
      const u0 = SLOT0 + s * SLOT_W + 0.05, u1 = SLOT0 + (s + 1) * SLOT_W - 0.05;
      balconies.push(balcony(side, u0, u1, L(k), DEEP));
      pockets.push(pocket(side, u0, u1, L(k)));
    }
  }
}
adds.push(union(balconies).subtract(union(pockets)));
// Dakrand van het kader en de installatie-/liftopbouw.
{
  const cs = new CrossSection([tower2]);
  adds.push(cs.subtract(cs.offset(-0.9, "Miter")).extrude(PARAPET - ROOF + 0.05).translate([0, 0, ROOF - 0.05]));
}
adds.push(prism(PLANT_PLAN, ROOF - 0.05, PLANT));
body = union([body, ...adds]).translate([0, 0, -GROUND]);

const parts = body.decompose();
if (parts.length !== 1) throw new Error(`${parts.length} losse delen`);
console.log("the-muse", body.status(), "genus", body.genus(), "driehoeken", body.numTri(), "nissen", windows.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:the-muse", body]],
  catalog: {
    name: "The Muse",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 46.08, // NAP 2,55 + 43,53 (geoïde NLGEO2018 hier 43,60; geijkt op blaak-10 en stedin-blaak, 43,53)
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-12, -18.5], [12, -18.5]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100100015965"],
    description:
      "The Muse (BARCODE Architects, 2019) aan de Wijnhaven: onderbouw van vijf lagen op de BAG-contour tot NAP +18,9 m met per laag witte banden en een verdiepte pui aan de Wijnhaven en de Wijnstraat; daarboven een rok van vier lagen die naar de toren versmalt, met getrapte terrassen en borstweringen aan de noord- en zuidkant, een donker dakvlak met dakramen en een uitsparing tot +21,5 m aan de oostkant en twee naar buiten hellende wanden met ramen aan de westkant; en de toren van 28,4 × 20,5 m tot +75,75 m (dakrand +76,55 m, opbouw +77,55 m, twee verdiepte dakterrassen op +72,17 m) in een antraciet kader met gesloten oost- en westgevels (verspringende ramen) en glazen noord- en zuidgevels met per laag een witte balkonband en drie diepe balkons die per laag een vak verspringen, alle met een kraag onder 47°. Hoogtes uit de 3D BAG-dakvlakken (AHN5 2023) en het AHN-DSM, contour uit de BAG, opbouw van de rok uit de plattegronden van BARCODE. Oorsprong in het hart van de contour, X-as langs de lange gevels naar het oost-noordoosten (17,6° op RD-oost). Verdiepingshoogtes, gevels van de terrassen, balkondiepte en -indeling, de ramen en de uitsparing zijn geschat uit foto's; CasaNova sluit aan de oostkant aan (eigen model).",
    realWorld: {
      groundNapM: GROUND,
      podiumRoofNapM: PODIUM_ROOF,
      skirtFloorsNapM: [5, 6, 7, 8, 9].map((k) => +L(k).toFixed(2)),
      storeyHeightM: STOREY,
      roofNapM: ROOF,
      parapetNapM: PARAPET,
      patioNapM: PATIO,
      plantNapM: PLANT,
      notchNapM: NOTCH,
      towerPlanM: [+(T.u1 - T.u0).toFixed(2), +(T.v1 - T.v0).toFixed(2)],
      floors: 23,
      balconyDepthBeyondFrameM: { band: SHALLOW, deep: DEEP },
      glassSetbackM: 0.8,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0599100100015965 (bouwjaar 2019), actuele orthoHR, AHN-DSM en -DTM 0,5 m",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100100015965 (LoD2.2, AHN5 2023)",
      "https://nl.wikipedia.org/wiki/The_Muse",
      "https://barcodearchitects.com/projects/the-muse/ (plattegronden 5e en 15e verdieping en foto's, alleen visuele referentie; maten uit open data)",
      "https://commons.wikimedia.org/wiki/Category:The_Muse_(Rotterdam)",
    ],
  },
});

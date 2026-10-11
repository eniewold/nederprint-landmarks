// De Kroon (Turfmarkt/Lage Zand, Den Haag; Rapp+Rapp, 2011): woontoren van
// 131,5 m in het Wijnhavenkwartier, naast de twee torens van JuBi. Eén BAG-pand
// omvat het hele bouwblok: een onderbouw van acht lagen tot +24,3 met een
// glazen binnenhof, een lage vleugel tot +36,2 aan de noordwestkant, een brede
// schijf tot +54,1 en daarboven de toren van 35 x 21 m. Elke lange gevel van de
// toren heeft drie erkers met schuine zijkanten (twee ramen voor, één per
// zijkant); de vakken tussen en naast de erkers springen boven +54,1 in drie
// trappen terug (+54,1, +87,1 en +105,1), zodat de erkers naar boven steeds verder
// uitsteken. De bovenste laag (+123,1 tot +126,1) volgt een zaagtand: van elke
// erker lopen twee schuine wanden terug, met terrassen op +123,1 in de inkepingen
// ertussen. Op die wanden staan de drie "kronen": gevelstijlen die als lamellen
// boven het dak doorlopen en naar het midden van de erker oplopen tot +132,0.
// Op het dak ligt een verhoogde installatiestrook (+129,1). Gesloten gevels van
// natuursteen met een regelmatig vensterritme, hier als blinde nissen.
// Vlakken en benoemde bouwdelen, geen gestapelde DSM-lagen. Voorbeelden per rij:
// generate-evoluon.mjs (aanpak primitieven), generate-haagse-toren.mjs,
// generate-castalia.mjs en generate-hoftoren.mjs (skylinetorens op
// efteling-kit.mjs).
//
//   node scripts/generate-de-kroon-den-haag.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong midden onder de toren op RD (81919,85, 455016,24),
// z = 0 op NAP +0,75 m (straten rondom: AHN-DTM +0,65 tot +0,81), Z omhoog. +X
// loopt langs de lange gevels naar het zuidoosten (-52,6 graden in RD, de
// BAG-gevel aan de zuidwestkant), +Y wijst naar het noordoosten, naar de
// binnenhof en JuBi. -Y is de zuidwestgevel aan de straat.
//
// Bronnen: BAG-pand 0518100000299585 (contour van het hele blok), AHN DSM/DTM
// 0,5 m (PDOK WCS, in dit stelsel uitgelezen: torencontour, erkers, trappen in
// de inspringende vakken, dakhoogtes, binnenhof), 3D BAG LoD2.2 (TU Delft/3D
// geoinformatie, CC BY 4.0: dakhoogtes 24,3 / 27,7 / 36,15 / 54,1 / 123,13 /
// 126,06 / 129,07, nok 132,0 en de zaagtand van de bovenste laag),
// Actueel_orthoHR, Wikipedia (131,5 m, 41 lagen, Rapp+Rapp, 2011) en
// Commons-foto's van alle kanten (erkers, kronen, vensterritme, onderbouw).
import { Manifold, CrossSection, box, prism, hull, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "de-kroon-den-haag";
const AXIS_DEG = -52.6;
const RAD = (AXIS_DEG * Math.PI) / 180;
const ORIGIN = [81919.85, 455016.24];
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 0.75;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  podium: 24.3, // onderbouw (3D BAG 24,33, AHN 24-25)
  podiumHigh: 27.7, // twee hogere stroken op de onderbouw (3D BAG 27,7)
  wing: 36.15, // noordwestvleugel (3D BAG 36,15, AHN 36-37)
  wingBox: 37.3, // opbouw op de vleugel (3D BAG 37,32)
  slab: 54.1, // brede schijf onder de toren (3D BAG 54,1, AHN 54)
  step2: 87.13, // tweede terugsprong van de inspringende vakken (AHN-richel 85-90), op een vloer
  step3: 105.13, // derde terugsprong (AHN 93-106, foto's), op een vloer
  terrace: 123.13, // terrassen in de zaagtand (3D BAG 123,13)
  roof: 126.06, // dak van de bovenste laag (3D BAG 126,06, AHN 126)
  plant: 129.07, // installatiestrook (3D BAG 129,07, AHN 128-130)
  crownTop: 132.0, // top van de kronen (3D BAG-nok 132,0; Wikipedia 131,5 m boven maaiveld)
  crownCorner: 130.2, // kroonlamellen op de hoeken van de erker (foto: Λ met een steilere middenpiek)
  crownLow: 126.6, // laagste lamellen in de inkeping, net boven het dak (AHN 126,5-128)
};

// ---------- plattegrond (m, gebouwstelsel) ----------
// BAG-contour van het hele blok (-Y: zuidwestgevel; de noordoostrand grenst aan JuBi).
const PAND = [[-46.31, -10.45], [22.96, -10.45], [22.97, 10.44], [25.5, 10.46], [25.48, 36.88], [-46.31, 36.79]];
// Toren: kopgevels op x = ±17,5 (AHN-rand op 0,25 m), lange gevels op y = ±10,45
// (BAG-gevel en de dakrand van de schijf in de 3D BAG).
const TW = { half: 17.5, depth: 10.45 };
// Erkers: middens op x = -11,5, 0 en 11,5 (AHN: -11,9 / -0,4 / 11,1 aan de
// zuidwestkant, -10,9 / -1,4 / 10,6 aan de noordoostkant), voorkant 3,1 m (twee
// ramen op 1,55 m), schuine zijkanten van 45 graden.
const BAYS = [-11.5, 0, 11.5];
const BAY_HALF = 1.55;
// Diepte van de inspringende vakken per trap (AHN-richels: 54 tot 0,7 m diep,
// 85-90 tot 1,4 m, 105-123 tot 2,0 m achter de gevel).
const STEPS = [
  [H.slab, H.step2, 0.6],
  [H.step2, H.step3, 1.2],
  [H.step3, H.terrace, 1.8],
];
// Zaagtand van de bovenste laag: van de erkervoorkant schuin terug naar een
// inkeping midden tussen twee erkers, 6,0 m diep aan de zuidwestkant (3D BAG
// 5,3, AHN-lamellen tot 7,9) en 4,3 m aan de noordoostkant (AHN 3,1; minimaal
// 45 graden zodat de laag niet over de trap eronder hangt). Kopgevels 1,4 m
// terug (3D BAG-terrassen aan beide koppen).
const NOTCH = { sw: 6.0, ne: 4.3 };
const TOP_END = 16.1;
// Vleugel en schijf.
const WING = { x0: -29.3, x1: -TW.half };
const SLAB = { x0: -TW.half, x1: 22.97 };
// Installatiestrook (3D BAG v -4,4..-0,5, AHN tot x 16,5).
const PLANT = { x0: -15.5, x1: 16.5, y0: -2.0, y1: 1.9 };

// ---------- gevelritme ----------
// 41 lagen: een hoge begane grond (winkels) tot +6,13 en 40 lagen van 3,0 m
// tot de vloer van de bovenste laag op het terras (+123,13; Wikipedia 41
// lagen). Zo vallen de daken op +24,3, +36,15 en +54,1 en de trappen in een
// borstwering. Ramen 1,9 m hoog vanaf 0,7 m boven de vloer, nissen 0,35 m
// diep; de stijlen ertussen blijven als lisenen staan.
const FLOOR1 = 6.13;
const STOREY = 3.0;
const NICHE = 0.35;
const floors = Array.from({ length: 40 }, (_, k) => +(FLOOR1 + STOREY * k).toFixed(3));
const windowRows = (lo, hi) => floors.map((f) => [f + 0.7, f + 2.6]).filter(([a, b]) => a >= lo + 0.3 && b <= hi - 0.3);

// ---------- hulpfuncties ----------
// Blinde nis in de rand a→b van een tegen de klok in lopende veelhoek (buitenkant
// rechts): s0..s1 vanaf a, NAP-hoogtes, `out` net buiten de gevel (klein, zodat
// een nis bij een binnenhoek de schuine buurgevel niet raakt).
const niche = (a, b, s0, s1, nap0, nap1, depth = NICHE, out = 0.2) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return Manifold.cube([depth + out, s1 - s0, nap1 - nap0])
    .translate([-depth, s0, z(nap0)])
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
// Vensters per travee (pitch) en per rij langs de randen van een veelhoek;
// `keep(a, b)` kiest de randen (null = overslaan), `span(a, b, len)` beperkt het
// stuk van de rand.
function windows(poly, rows, { pitch, width, keep = () => true, span = (a, b, len) => [0, len], minLen = 1.3 }) {
  const P = ccw(poly);
  const out = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i];
    const b = P[(i + 1) % P.length];
    if (!keep(a, b)) continue;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [t0, t1] = span(a, b, len);
    const L = t1 - t0;
    if (L < minLen) continue;
    const n = Math.max(1, Math.floor(L / pitch + 0.25));
    // minstens 0,45 m stijl naast elke hoek, zodat nissen van twee gevels elkaar
    // op de hoek niet raken (anders blijft daar een losse hoekstijl staan)
    const w = Math.min(width, L / n - 0.9);
    if (w < 0.6) continue;
    for (let k = 0; k < n; k++) {
      const s = t0 + (L * (k + 0.5)) / n;
      for (const [r0, r1] of rows) out.push(niche(a, b, s - w / 2, s + w / 2, r0, r1));
    }
  }
  return out;
}
const onLine = (p, axis, value) => Math.abs(p[axis] - value) < 0.01;

// Gevellijn van de toren bij een terugsprong d: drie erkers op de gevel, de
// vakken ertussen en naast de erkers d naar binnen, schuine zijkanten van 45 graden.
function towerPoly(d) {
  const side = (s) => {
    // s = -1: zuidwestgevel (y = -10,45), s = +1: noordoostgevel.
    const y0 = s * TW.depth;
    const yi = s * (TW.depth - d);
    const pts = [[-TW.half, yi]];
    for (const c of BAYS) pts.push([c - BAY_HALF - d, yi], [c - BAY_HALF, y0], [c + BAY_HALF, y0], [c + BAY_HALF + d, yi]);
    pts.push([TW.half, yi]);
    return pts;
  };
  return [...side(-1), ...side(1).reverse()];
}
// Zaagtand van de bovenste laag.
function topPoly() {
  const side = (s, notch) => {
    const y0 = s * TW.depth;
    const yi = s * (TW.depth - notch);
    const pts = [[-TOP_END, yi]];
    BAYS.forEach((c, i) => {
      pts.push([c - BAY_HALF, y0], [c + BAY_HALF, y0]);
      if (i < BAYS.length - 1) pts.push([(c + BAYS[i + 1]) / 2, yi]);
    });
    pts.push([TOP_END, yi]);
    return pts;
  };
  return [...side(-1, NOTCH.sw), ...side(1, NOTCH.ne).reverse()];
}

const parts = [];
const cuts = []; // gevelnissen van het hele model, na de vereniging

// ---------- onderbouw (BAG-contour, +24,3) ----------
let podium = prism(PAND, BASE, z(H.podium));
// Glazen kap van de binnenhof: in het AHN een gat (glas), in de 3D BAG +24-25;
// hier 0,6 m verdiept zodat hij als apart dakvlak leest.
const COURT = [[-14.9, 12.4], [-0.9, 12.4], [-0.9, 24.4], [-14.9, 24.4]];
podium = podium.subtract(prism(COURT, z(H.podium - 0.6), z(H.podium + 1)));
parts.push(podium);
// Hogere stroken en opbouwen op de onderbouw (3D BAG).
parts.push(box(-40.7, 11.9, BASE, -32.5, 35.2, z(H.podiumHigh)));
parts.push(box(10.0, 19.9, BASE, 21.5, 35.3, z(H.podiumHigh)));
parts.push(box(-40.5, -5.6, z(H.podium) - 0.01, -37.9, 5.8, z(25.05)));
parts.push(box(-14.0, 31.1, z(H.podium) - 0.01, -8.7, 34.3, z(25.42)));

// ---------- noordwestvleugel en schijf ----------
parts.push(box(WING.x0, -TW.depth, BASE, WING.x1 + 0.01, TW.depth, z(H.wing)));
parts.push(box(-24.4, -8.1, z(H.wing) - 0.01, -21.8, 8.1, z(H.wingBox)));
parts.push(box(SLAB.x0, -TW.depth, BASE, SLAB.x1, TW.depth, z(H.slab)));

// ---------- toren met trappen ----------
const tower = [];
for (const [lo, hi, d] of STEPS) tower.push(prism(towerPoly(d), z(lo) - 0.01, z(hi)));
const TOP = topPoly();
tower.push(prism(TOP, z(H.terrace) - 0.01, z(H.roof)));
// Installatiestrook op het dak.
tower.push(box(PLANT.x0, PLANT.y0, z(H.roof) - 0.01, PLANT.x1, PLANT.y1, z(H.plant)));

// ---------- kronen ----------
// Lamellenwanden van 1,2 m dik op de randen van de zaagtand, aan de binnenkant
// van de rand, met een bovenkant die van de inkeping (+126,6) naar de erkerhoek
// (+130,2) oploopt; de erkervoorkant loopt op tot +132,0 in het midden.
const CROWN_T = 1.2;
const wall = ([ax, ay], [bx, by], ha, hb) => {
  const len = Math.hypot(bx - ax, by - ay);
  // binnennormaal (links van a→b in een tegen de klok in lopende veelhoek)
  const n = [-(by - ay) / len, (bx - ax) / len];
  const a2 = [ax + n[0] * CROWN_T, ay + n[1] * CROWN_T];
  const b2 = [bx + n[0] * CROWN_T, by + n[1] * CROWN_T];
  const z0 = z(H.terrace);
  return hull([
    [ax, ay, z0], [bx, by, z0], [...a2, z0], [...b2, z0],
    [ax, ay, z(ha)], [bx, by, z(hb)], [...a2, z(ha)], [...b2, z(hb)],
  ]);
};
const crownWalls = [];
const crownEdges = []; // [a, b] van de buitenkant, voor de lamelgroeven
{
  const P = ccw(TOP);
  for (let i = 0; i < P.length; i++) {
    const a = P[i];
    const b = P[(i + 1) % P.length];
    const isFront = Math.abs(Math.abs(a[1]) - TW.depth) < 0.01 && Math.abs(Math.abs(b[1]) - TW.depth) < 0.01;
    const isEnd = Math.abs(Math.abs(a[0]) - TOP_END) < 0.01 && Math.abs(Math.abs(b[0]) - TOP_END) < 0.01;
    if (isEnd) continue;
    if (isFront) {
      const m = [(a[0] + b[0]) / 2, a[1]];
      crownWalls.push(wall(a, m, H.crownCorner, H.crownTop), wall(m, b, H.crownTop, H.crownCorner));
    } else {
      // schuine rand: hoog bij de erker (|y| = 10,45), laag in de inkeping
      const ha = Math.abs(Math.abs(a[1]) - TW.depth) < 0.01 ? H.crownCorner : H.crownLow;
      const hb = Math.abs(Math.abs(b[1]) - TW.depth) < 0.01 ? H.crownCorner : H.crownLow;
      crownWalls.push(wall(a, b, ha, hb));
    }
    crownEdges.push([a, b]);
  }
}
tower.push(...crownWalls);

// ---------- gevelreliëf ----------
// Toren: per trap de ramen in alle gevelvlakken van die trap (erkervoorkant
// twee ramen, schuine zijkant één, vakken op 1,55 m), kopgevels op 1,6 m.
for (const [lo, hi, d] of STEPS) {
  const poly = towerPoly(d);
  const rows = windowRows(lo, hi);
  cuts.push(...windows(poly, rows, { pitch: 1.55, width: 1.0, minLen: 1.15 }));
}
// Bovenste laag: één rij ramen (+123,7 tot +125,6) in de zaagtand en de koppen.
cuts.push(...windows(TOP, [[123.7, 125.6]], { pitch: 1.55, width: 1.0 }));
// Kroonlamellen: verticale groeven van 0,3 m in de buitenkant van de
// kroonwanden, tot boven de bovenkant, zodat de wanden als losse stijlen met
// een getande bovenrand lezen.
for (const [a, b] of crownEdges) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  // niet binnen 0,8 m van de hoeken: daar staat de buurwand
  const n = Math.max(1, Math.round((len - 1.6) / 1.1));
  for (let k = 0; k <= n; k++) {
    const s = 0.8 + ((len - 1.6) * k) / n;
    cuts.push(niche(a, b, s - 0.22, s + 0.22, H.roof + 0.4, H.crownTop + 1.0, 0.3, 0.2));
  }
}
// Schijf (+54,1) en vleugel (+36,2): grotere ramen op 1,9 m; aan de
// noordoostkant pas boven de onderbouw, aan de kopkant van de schijf (x = -17,5)
// boven de vleugel.
const SLAB_POLY = [[SLAB.x0, -TW.depth], [SLAB.x1, -TW.depth], [SLAB.x1, TW.depth], [SLAB.x0, TW.depth]];
const WING_POLY = [[WING.x0, -TW.depth], [WING.x1, -TW.depth], [WING.x1, TW.depth], [WING.x0, TW.depth]];
const slabRows = (lo) => windowRows(lo, H.slab);
const slabCuts = [];
slabCuts.push(...windows(SLAB_POLY, slabRows(0.75), { pitch: 1.9, width: 1.3, keep: (a, b) => onLine(a, 1, -TW.depth) && onLine(b, 1, -TW.depth) }));
slabCuts.push(...windows(SLAB_POLY, slabRows(0.75), { pitch: 1.9, width: 1.3, keep: (a, b) => onLine(a, 0, SLAB.x1) && onLine(b, 0, SLAB.x1), span: (a, b, len) => [0, len] }));
slabCuts.push(...windows(SLAB_POLY, slabRows(H.podium), { pitch: 1.9, width: 1.3, keep: (a, b) => onLine(a, 1, TW.depth) && onLine(b, 1, TW.depth) }));
slabCuts.push(...windows(SLAB_POLY, slabRows(H.wing), { pitch: 1.9, width: 1.3, keep: (a, b) => onLine(a, 0, SLAB.x0) && onLine(b, 0, SLAB.x0) }));
const wingRows = (lo) => windowRows(lo, H.wing);
slabCuts.push(...windows(WING_POLY, wingRows(0.75), { pitch: 1.9, width: 1.3, keep: (a, b) => onLine(a, 1, -TW.depth) && onLine(b, 1, -TW.depth) }));
slabCuts.push(...windows(WING_POLY, wingRows(H.podium), { pitch: 1.9, width: 1.3, keep: (a, b) => (onLine(a, 1, TW.depth) && onLine(b, 1, TW.depth)) || (onLine(a, 0, WING.x0) && onLine(b, 0, WING.x0)) }));
cuts.push(...slabCuts);
// Onderbouw: één venster per 2,7 m per laag, winkelpuien op de begane grond
// (+1,05 tot +5,3). Niet in de gevel tegen JuBi (noordoost) en niet waar de
// vleugel of schijf op de gevel staat.
const podiumRows = [[1.05, 5.3], ...windowRows(0.75, H.podium)];
cuts.push(
  ...windows(PAND, podiumRows, {
    pitch: 2.7,
    width: 1.5,
    keep: (a, b) => !(a[1] > 36 && b[1] > 36) && !(onLine(a, 0, 22.96) || onLine(a, 0, 22.97)),
    span: (a, b, len) => (onLine(a, 1, -10.45) && onLine(b, 1, -10.45) ? [0, Math.max(0, WING.x0 - a[0] - 0.3)] : [0, len]),
  }),
);

// ---------- samenstellen ----------
let model = union([...parts, ...tower]);
model = model.subtract(union(cuts));
// Nissen die een ander bouwdeel afdekt, worden ingesloten holtes: die vallen weg.
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));
console.log("nissen:", cuts.length, "verdiepingen:", floors.length + 1);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:De Kroon met getrapte erkers zaagtand kronen schijf vleugel en onderbouw", model]],
  catalog: {
    name: "De Kroon",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straten rondom liggen vlak op NAP +0,65 tot +0,81 (AHN-DTM): punten op de
    // zuidwest-, noordwest- en zuidoostkant.
    groundSamplePoints: [[-30, -13], [0, -13], [20, -13], [-49, 12], [28, 25]],
    replacesBuildings: ["NL.IMBAG.Pand.0518100000299585"],
    description:
      "Oorsprong midden onder de toren op straatniveau NAP +0,75 m, +X langs de lange gevels (-52,6 graden in RD) naar het zuidoosten, +Y naar de binnenhof en JuBi; onderbouw tot NAP +24,3 m met glazen binnenhof, vleugel tot +36,2 en schijf tot +54,1, toren van 35 x 21 m met per lange gevel drie erkers waarvan de vakken ertussen in drie trappen terugspringen (+54,1/+87,1/+105,1), een zaagtandvormige bovenste laag tot +126,1 met terrassen op +123,1 en drie lamellenkronen per gevel tot +132,0; vensterritme, trap-hoogtes en kroonlamellen uit foto's en AHN geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      podiumNapM: H.podium,
      wingNapM: H.wing,
      slabNapM: H.slab,
      stepNapM: STEPS.map(([lo, , d]) => ({ fromNap: lo, recessM: d })),
      terraceNapM: H.terrace,
      roofNapM: H.roof,
      plantNapM: H.plant,
      crownTopNapM: H.crownTop,
      towerM: [2 * TW.half, 2 * TW.depth],
      baysX: BAYS,
      bayFrontM: 2 * BAY_HALF,
      notchDepthM: NOTCH,
      storeyPitchM: STOREY,
      axisDegrees: AXIS_DEG,
      estimates: [
        "trappen van de inspringende vakken: richels in het AHN op +54, circa +85-90 en +93-106 m, op de vloeren +87,13 en +105,13 gelegd, dieptes 0,6/1,2/1,8 m afgerond (AHN-pixels 0,5 m); erkerzijkanten op 45 graden",
        "erkers twee ramen breed (3,1 m) met één raam per schuine zijkant, vakken op 1,55 m, uit frontale foto's",
        "kronen als 1,2 m dikke lamellenwanden op de zaagtand met groeven van 0,3 m; werkelijk losse natuurstenen stijlen met open tussenruimtes",
        "zaagtand van de bovenste laag: inkeping 6,0 m (zuidwest) en 4,3 m (noordoost, minimaal 45 graden; AHN 3,1 m)",
        "40 lagen van 3,0 m boven een begane grond tot +6,13 (bovenste vloer op het terras +123,13); ramen 1,0 x 1,9 m als nissen van 0,35 m",
        "glazen kap van de binnenhof 0,6 m verdiept: het AHN heeft daar geen punten",
      ],
    },
    sources: [
      "PDOK BAG pand 0518100000299585, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000299585 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes, terrassen en de zaagtand van de bovenste laag",
      "https://en.wikipedia.org/wiki/De_Kroon_(The_Hague)",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_-_De_Kroon_(24952721807).jpg",
      "https://commons.wikimedia.org/wiki/File:De_Kroon_The_Hague_2019.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag,_de_kantoorgebouwen_aan_de_Turfmarkt_vanaf_de_Nieuwe_Haven_101IMG_8919_2019-03-24_15.35.jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_De_Kroon_in_het_Haagse_Wijnhavenkwartier.jpg",
      "https://commons.wikimedia.org/wiki/File:De_Kroon_-_Den_Haag.JPG",
      "https://commons.wikimedia.org/wiki/File:TheHague-LE-part-deux_(8044146720).jpg",
      "https://commons.wikimedia.org/wiki/File:Uilebomen,_Den_Haag,_Netherlands_-_panoramio_(36).jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_-_BZK,_J%26V_and_De_Kroon_(24951610687).jpg",
    ],
  },
});

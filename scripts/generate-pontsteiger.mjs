// Pontsteigergebouw (Pontsteiger, Houthavens, Amsterdam; Arons en Gelauff
// Architecten, ontwerp 2007, gebouwd 2015-2019): woongebouw van 92 m op de kop
// van de pier aan het IJ. Een vierkant blok van 87 x 85 m: een lage ring van
// zes woonlagen (dak NAP +27,3) om een open binnenhof, en aan de IJ-zijde twee
// torens van 21,8 x 21,9 m die bovenin met een brug van tien lagen zijn
// verbonden. Daaronder een poort van 43,5 m breed en 59 m hoog, open van het
// maaiveld tot de onderkant van de brug, waar je door de binnenhof heen naar
// het IJ kijkt. In de onderste drie lagen van de brug zit aan beide langsgevels
// een stalen vakwerk (V-diagonalen achter glas) dat van de binnenzijde van de
// zuidoosttoren tot het einde van de noordwesttoren loopt. Ring en torens
// staan op een open onderbouw van 7,3 m met kolommen en golvende glazen
// paviljoens met een plat dak van 4,2 m (de "vloeiende lijn" van de plint).
// Op het dak van de brug zonnepanelen, twee installatiehuizen en twee verdiepte
// patio's; op de ring zonnepanelen en trappenhuizen. Vlakken en benoemde
// bouwdelen in een eigen gebouwstelsel, geen gestapelde DSM-lagen. Voorbeelden
// per rij: generate-evoluon.mjs (aanpak primitieven) en
// generate-nhow-amsterdam-rai.mjs (gevelnissen per laag op efteling-kit.mjs).
//
//   node scripts/generate-pontsteiger.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het hart van het vierkant (BAG-pand
// 0363100012244556) op RD (120896,405, 489606,24), z = 0 op NAP +1,7 m (pier en
// binnenhof: AHN-DTM +1,6 tot +1,7), Z omhoog. +X loopt op 129,84 graden in RD
// langs de IJ-gevel naar het noordwesten; -Y wijst naar het IJ (de poort), +Y
// naar de pier. De zuidoosttoren staat op -X, de noordwesttoren op +X.
//
// Bronnen: BAG-panden 0363100012244556 (het gebouw), 0363100012244579 (de
// parkeergarage onder de pier), 0363100012253421/-422/-423 (de drie
// paviljoens); BGT-panden op het maaiveld (paviljoens, de ronde lobby en 38
// kolommen); AHN5 DSM 0,5 m (opname 2023, ImageServer
// Hoogtebestand/AHN5_DSM_50cm van ahn.arcgisonline.nl; het PDOK-AHN4 heeft
// ruis op het glazen brugdak): ring +27,3, dak van de brug +91,0 met
// zonnepanelen tot +91,7, installatiehuizen +94,0, patio's +86,75, paviljoens
// +5,93, binnenhof +1,7, de randen van ring, binnenhof en brug. De onderkant van
// de brug, de lagen en het vakwerk komen uit een frontale foto vanaf het IJ
// (17 lagen van 3,05 m onder de brug, vakwerk drie lagen, brug erboven zeven
// lagen; de onderkant van de brug +60,85, met de perspectief van de onderzijde
// verrekend). Wikipedia: 92 m, opgeleverd 2019.
import { CrossSection, Manifold, prism, union, ccw, rect, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "pontsteiger";
const ORIGIN = [120896.405, 489606.24];
const AXIS_DEG = 129.84;
const RAD = (AXIS_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 1.7;
// Onder het waterpeil (PDOK-water NAP -0,4 in dit stelsel): de gevels aan de
// kademuren zweven dan nergens boven het water.
const BASE = -2.3;
const z = (nap) => +(nap - GROUND_NAP).toFixed(3);
// RD naar gebouwstelsel.
const local = ([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [+(dx * Math.cos(RAD) + dy * Math.sin(RAD)).toFixed(3), +(-dx * Math.sin(RAD) + dy * Math.cos(RAD)).toFixed(3)];
};

// ---------- hoogtes (NAP) ----------
const H = {
  pavilion: 5.93, // platte daken van de paviljoens (AHN5 5,90-5,95 waar ze buiten de bovenbouw uitsteken)
  podium: 9.0, // onderkant van ring en torens: open onderbouw van 7,3 m (foto: eerste vensterrij 7,5 m boven het maaiveld)
  storey: 3.05, // lagen van ring en torens (17 lagen tot de brug, zes in de ring)
  ring: 27.3, // dak van de ring (AHN5-mediaan 27,27-27,33): zes lagen
  ringSolar: 28.3, // zonnepanelen op de zuidwestvleugel (AHN5 28,28)
  ringStair: 30.2, // trappenhuizen op de ring (AHN5 30,15-30,23)
  ringHatch: 28.9, // kleine opbouwen op de zijvleugels (AHN5 28,93)
  soffit: 60.85, // onderkant van de brug (foto: 59,2 m boven het maaiveld; 9,0 + 17 x 3,05)
  trussTop: 70.0, // bovenkant van het vakwerk: drie lagen van 3,05 m
  roof: 91.0, // dak van de brug (AHN5 91,0 tussen de panelen, rand 91,2)
  solar: 91.7, // zonnepanelen op het brugdak (AHN5 91,68)
  plant: 94.0, // twee installatiehuizen (AHN5 93,96-93,97)
  patio: 86.75, // vloer van de twee verdiepte patio's (AHN5 86,73 en 86,81)
};
const TOP_STOREY = (H.roof - H.trussTop) / 7; // 3,0 m

// ---------- plattegrond (m, gebouwstelsel) ----------
// Vierkant (BAG 0363100012244556, hoeken haaks op 0,01 graden): 87,1 m langs het
// IJ, 85,0 m diep. Binnenhof en poort uit de AHN5-randen.
const UO = 43.55; // buitengevels noordwest (+) en zuidoost (-)
const VO = 42.5; // IJ-gevel (-) en pier (+)
const UI = 21.75; // binnengevels van de zijvleugels en de torens (binnenhof 43,5 m breed)
const VI = 21.25; // binnengevel van de zuidwestvleugel
const VS = -20.6; // achtergevel van brug en torens (brug 21,9 m diep)
const SQUARE = rect(-UO, -VO, UO, VO);
const RING = [[-UO, VS - 0.4], [-UI, VS - 0.4], [-UI, VI], [UI, VI], [UI, VS - 0.4], [UO, VS - 0.4], [UO, VO], [-UO, VO]];
const TOWER_SE = rect(-UO, -VO, -UI, VS);
const TOWER_NW = rect(UI, -VO, UO, VS);
const SLAB = rect(-UO, -VO, UO, VS);
// Voetafdruk van de bovenbouw (ring en torens), voor de binnenkern van de paviljoens.
const UPPER = new CrossSection([ccw(SQUARE)]).subtract(new CrossSection([ccw(rect(-UI, -VO - 1, UI, VI))]));

// Onderbouw: BGT-panden op het maaiveld (RD, Douglas-Peucker 0,25 m) en de
// kolommen (BGT-vlakjes van 0,29 en 0,65 m², hier 0,9 m in het vierkant).
const PAV_SE = pavSeRd().map(local); // BAG 0363100012253423
const PAV_NW = pavNwRd().map(local); // BAG 0363100012253421
const PAV_SW = pavSwRd().map(local); // BAG 0363100012253422
const LOBBY = lobbyRd().map(local); // ronde lobby onder de zuidwestvleugel (BGT-pand van 0363100012244556)
const COLUMNS = columnsRd().map(local);

// ---------- gevelritme (foto's) ----------
// Blinde nis in de gevel a→b (buitenkant rechts bij een veelhoek tegen de klok
// in): s0..s1 vanaf a, NAP-hoogtes, diepte in de gevel en `out` naar buiten.
const niche = (a, b, s0, s1, nap0, nap1, depth, out = 1.0) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return Manifold.cube([depth + out, s1 - s0, z(nap1) - z(nap0)])
    .translate([-depth, s0, z(nap0)])
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
const storeys = (nap0, count, h) => range(count, (k) => +(nap0 + h * k).toFixed(3));
// Vensters per laag langs a→b tussen s0 en s1: breedte w op steek p, om de
// laag een halve steek verspringend (het onregelmatige ritme van de gevels).
// sill/head: borstwering en latei binnen de laag.
function windows(a, b, s0, s1, floors, h, { w, p, depth = 0.35, sill = 0.7, head = 0.45, margin = 0.9, stagger = true }) {
  const out = [];
  floors.forEach((f, k) => {
    const shift = stagger && k % 2 ? p / 2 : 0;
    for (let c = s0 + margin + shift + w / 2; c + w / 2 <= s1 - margin + 1e-9; c += p) {
      out.push(niche(a, b, c - w / 2, c + w / 2, f + sill, f + h - head, depth));
    }
  });
  return out;
}
const LOGGIA = { w: 5.6, p: 7.0, depth: 0.4, sill: 0.6, head: 0.4 }; // ring en noordwestgevel: brede loggia's met glazen balustrade
const WIN_SE = { w: 1.9, p: 3.5, sill: 0.5, head: 0.35 }; // zuidoosttoren: ponsvensters (foto vanaf het IJ: 1,9 m op 3,5 m)
const WIN_NW = { w: 1.3, p: 2.3, sill: 0.5, head: 0.35 }; // noordwesttoren: smalle hoge vensters (1,3 m op 2,3 m)
const WIN_TOP = { w: 3.0, p: 4.4, sill: 0.6, head: 0.4 }; // brug boven het vakwerk: brede vensters (3,0 m op 4,4 m)
const RING_FLOORS = storeys(H.podium, 6, H.storey);
const TOWER_FLOORS = storeys(H.podium, 17, H.storey);
const TOWER_HIGH = TOWER_FLOORS.slice(6); // boven het ringdak
const TRUSS_FLOORS = storeys(H.soffit, 3, H.storey);
const TOP_FLOORS = storeys(H.trussTop, 7, TOP_STOREY);

// Gevels als a→b met de buitenkant rechts.
const F = {
  ij: [[-UO, -VO], [UO, -VO]], // IJ-gevel (poortzijde)
  nw: [[UO, -VO], [UO, VO]],
  pier: [[UO, VO], [-UO, VO]],
  se: [[-UO, VO], [-UO, -VO]],
  hofNw: [[UI, VI], [UI, -VO]], // binnengevel noordwestvleugel en -toren (poort)
  hofSw: [[-UI, VI], [UI, VI]],
  hofSe: [[-UI, -VO], [-UI, VI]],
  back: [[UO, VS], [-UO, VS]], // achtergevel van torens en brug (binnenhofzijde)
};
const L = (k) => Math.hypot(F[k][1][0] - F[k][0][0], F[k][1][1] - F[k][0][1]);

// ---------- ring en torens ----------
let ring = prism(RING, z(H.podium), z(H.ring));
ring = ring.subtract(
  union([
    ...windows(...F.pier, 0, L("pier"), RING_FLOORS, H.storey, LOGGIA),
    ...windows(...F.nw, VO + VS, L("nw"), RING_FLOORS, H.storey, LOGGIA),
    ...windows(...F.se, 0, VO - VS, RING_FLOORS, H.storey, LOGGIA),
    ...windows(...F.hofSw, 0, L("hofSw"), RING_FLOORS, H.storey, LOGGIA),
    ...windows(...F.hofNw, 0, VI - VS, RING_FLOORS, H.storey, LOGGIA),
    ...windows(...F.hofSe, VO + VS, L("hofSe"), RING_FLOORS, H.storey, LOGGIA),
  ]),
);
// Zuidoosttoren: ponsvensters op de IJ-, zuidoost- en poortgevel, op de
// binnenhofgevel boven het ringdak.
let towerSe = prism(TOWER_SE, z(H.podium), z(H.soffit));
towerSe = towerSe.subtract(
  union([
    ...windows(...F.ij, 0, UO - UI, TOWER_FLOORS, H.storey, WIN_SE),
    ...windows(...F.se, VO - VS, L("se"), TOWER_FLOORS, H.storey, WIN_SE),
    ...windows(...F.hofSe, 0, VO + VS, TOWER_FLOORS, H.storey, WIN_SE),
    ...windows(...F.back, UO + UI, 2 * UO, TOWER_HIGH, H.storey, WIN_SE),
  ]),
);
// Noordwesttoren: smalle vensters op IJ-, poort- en binnenhofgevel, loggia's
// op de noordwestgevel (zoals de ring eronder).
let towerNw = prism(TOWER_NW, z(H.podium), z(H.soffit));
towerNw = towerNw.subtract(
  union([
    ...windows(...F.ij, UO + UI, 2 * UO, TOWER_FLOORS, H.storey, WIN_NW),
    ...windows(...F.nw, 0, VO + VS, TOWER_FLOORS, H.storey, LOGGIA),
    ...windows(...F.hofNw, VI - VS, L("hofNw"), TOWER_FLOORS, H.storey, WIN_NW),
    ...windows(...F.back, 0, UO - UI, TOWER_HIGH, H.storey, WIN_NW),
  ]),
);

// ---------- brug ----------
// Vakwerk: glas 0,45 m terug tussen onder- en bovenrand, met V-diagonalen van
// 1,0 m (Warren-vakwerk, acht velden van 8,16 m) van de binnenzijde van de
// zuidoosttoren tot het einde van de noordwesttoren, op beide langsgevels.
const TRUSS = { s0: -UI, s1: UO, panels: 8, bar: 1.0, depth: 0.45, chordLow: 0.5, chordHigh: 0.55 };
function trussCutter(face) {
  const [a, b] = F[face];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  // s langs de gevel vanaf a; de IJ-gevel loopt van -X naar +X, de achtergevel andersom.
  const sOf = (u) => (dx > 0 ? u - a[0] : a[0] - u);
  const s0 = Math.min(sOf(TRUSS.s0), sOf(TRUSS.s1)) + 0.5;
  const s1 = Math.max(sOf(TRUSS.s0), sOf(TRUSS.s1)) - 0.5;
  const h0 = z(H.soffit) + TRUSS.chordLow;
  const h1 = z(H.trussTop) - TRUSS.chordHigh;
  const P = (s1 - s0) / TRUSS.panels;
  let cs = new CrossSection([ccw(rect(s0, h0, s1, h1))]);
  const bars = [];
  const bar = (p, q) => {
    const ex = q[0] - p[0];
    const ey = q[1] - p[1];
    const el = Math.hypot(ex, ey);
    const nx = (-ey / el) * (TRUSS.bar / 2);
    const ny = (ex / el) * (TRUSS.bar / 2);
    // Verlengd tot voorbij de randen, zodat de knopen dicht zijn.
    const k = 1.0 / el;
    const p2 = [p[0] - ex * k, p[1] - ey * k];
    const q2 = [q[0] + ex * k, q[1] + ey * k];
    bars.push(new CrossSection([ccw([[p2[0] + nx, p2[1] + ny], [q2[0] + nx, q2[1] + ny], [q2[0] - nx, q2[1] - ny], [p2[0] - nx, p2[1] - ny]])]));
  };
  for (let k = 0; k < TRUSS.panels; k++) {
    const sa = s0 + k * P;
    bar([sa, h0], [sa + P / 2, h1]);
    bar([sa + P / 2, h1], [sa + P, h0]);
  }
  cs = cs.subtract(CrossSection.union(bars));
  const t = TRUSS.depth + 1.0;
  // (s, h, w) → (normaal = w - diepte, langs = s, z = h), dan naar de gevel.
  return Manifold.extrude(cs, t)
    .warp((v) => {
      const [s, h, w] = v;
      v[0] = w - TRUSS.depth;
      v[1] = s;
      v[2] = h;
    })
    .rotate([0, 0, (Math.atan2(-dx / len, dy / len) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
}
let bridge = prism(SLAB, z(H.soffit), z(H.roof));
bridge = bridge.subtract(
  union([
    trussCutter("ij"),
    trussCutter("back"),
    // Op het vakwerkniveau van de zuidoosttoren gewone ponsvensters.
    ...windows(...F.ij, 0, UO - UI, TRUSS_FLOORS, H.storey, WIN_SE),
    ...windows(...F.back, UO + UI, 2 * UO, TRUSS_FLOORS, H.storey, WIN_SE),
    ...windows(...F.se, VO - VS, L("se"), TRUSS_FLOORS, H.storey, WIN_SE),
    // Noordwestgevel: hoge glazen hoek op het vakwerkniveau (foto's), loggia's erboven.
    niche(...F.nw, 1.2, VO + VS - 1.2, H.soffit + 0.6, H.trussTop - 0.6, 0.45),
    // Zeven lagen boven het vakwerk.
    ...windows(...F.ij, 0, L("ij"), TOP_FLOORS, TOP_STOREY, WIN_TOP),
    ...windows(...F.back, 0, L("back"), TOP_FLOORS, TOP_STOREY, WIN_TOP),
    ...windows(...F.nw, 0, VO + VS, TOP_FLOORS, TOP_STOREY, LOGGIA),
    ...windows(...F.se, VO - VS, L("se"), TOP_FLOORS, TOP_STOREY, WIN_TOP),
  ]),
);

// ---------- daken ----------
// Brug: twee installatiehuizen boven de torenkernen, twee verdiepte patio's
// en velden zonnepanelen (0,7 m) met looppaden (AHN5, luchtfoto).
const PLANT_W = rect(-28.0, -37.5, -22.5, -28.0);
const PLANT_E = rect(22.5, -37.5, 28.0, -28.0);
const PATIO_W = rect(-11.75, -35.25, -6.25, -29.75);
const PATIO_E = rect(7.25, -35.25, 12.75, -29.75);
bridge = bridge.subtract(union([prism(PATIO_W, z(H.patio), z(H.roof) + 1), prism(PATIO_E, z(H.patio), z(H.roof) + 1)]));
const cs = (poly) => new CrossSection([ccw(poly)]);
let solarField = cs(rect(-UO + 2.2, -VO + 2.2, UO - 2.2, VS - 2.0));
for (const p of [PLANT_W, PLANT_E, PATIO_W, PATIO_E]) solarField = solarField.subtract(cs(p).offset(1.2, "Miter"));
for (const u of [-35, -17.5, 0, 17.5, 35]) solarField = solarField.subtract(cs(rect(u - 0.5, -VO, u + 0.5, VS)));
const solar = Manifold.extrude(solarField, z(H.solar) - z(H.roof) + 0.05).translate([0, 0, z(H.roof) - 0.05]);
let plant = union([prism(PLANT_W, z(H.roof) - 0.1, z(H.plant)), prism(PLANT_E, z(H.roof) - 0.1, z(H.plant))]);
// Louvres rondom de installatiehuizen.
plant = plant.subtract(
  union(
    [PLANT_W, PLANT_E].flatMap((poly) =>
      ccw(poly).map((p, i, arr) => {
        const q = arr[(i + 1) % arr.length];
        const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
        return niche(p, q, 0.9, len - 0.9, H.roof + 0.6, H.plant - 0.6, 0.3);
      }),
    ),
  ),
);
// Ring: zonnepanelen op de zuidwestvleugel, twee trappenhuizen en vier kleine opbouwen.
const ringSolar = union(
  [rect(-39, 30.5, -24, 39.5), rect(-20.5, 25, -1, 39.5), rect(1, 25, 20.5, 39.5), rect(24, 30.5, 39, 39.5)].map((r) => prism(r, z(H.ring) - 0.05, z(H.ringSolar))),
);
const ringStairs = union([prism(rect(-31.0, 24.0, -24.5, 31.5), z(H.ring) - 0.1, z(H.ringStair)), prism(rect(24.5, 24.0, 31.0, 31.5), z(H.ring) - 0.1, z(H.ringStair))]);
const ringHatches = union([[-30.5, 10], [-30.5, -10], [30.5, 10], [30.5, -10]].map(([u, v]) => prism(rect(u - 1.1, v - 1.1, u + 1.1, v + 1.1), z(H.ring) - 0.1, z(H.ringHatch))));

// ---------- onderbouw ----------
// Paviljoens tot +5,93 met glasvakken; daarboven tot de onderkant van de
// bovenbouw een teruggelegen glazen kern (2,0 m binnen de paviljoenrand,
// binnen de voetafdruk van ring en torens), die ring en torens draagt.
const glazing = (poly, nap1) =>
  ccw(poly).flatMap((p, i, arr) => {
    const q = arr[(i + 1) % arr.length];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (len < 2.6) return [];
    const n = Math.max(1, Math.round((len - 1.0) / 2.4));
    const step = (len - 1.0) / n;
    const w = Math.min(1.6, step - 0.9);
    if (w < 0.8) return [];
    return range(n, (k) => {
      const c = 0.5 + step * (k + 0.5);
      return niche(p, q, c - w / 2, c + w / 2, GROUND_NAP + 0.3, nap1 - 0.6, 0.3);
    });
  });
const pavilions = [PAV_SE, PAV_NW, PAV_SW].map((poly) => prism(poly, BASE, z(H.pavilion)).subtract(union(glazing(poly, H.pavilion))));
const cores = [PAV_SE, PAV_NW, PAV_SW].map((poly) => {
  const inner = cs(poly).offset(-2.0, "Round", 2, 16).intersect(UPPER.offset(-1.5, "Miter"));
  return Manifold.extrude(inner, z(H.podium) - z(H.pavilion) + 0.2).translate([0, 0, z(H.pavilion) - 0.1]);
});
let lobby = prism(LOBBY, BASE, z(H.podium) + 0.1);
lobby = lobby.subtract(union(glazing(LOBBY, H.podium - 0.8)));
const columns = union(COLUMNS.map(([x, y]) => prism(rect(x - 0.45, y - 0.45, x + 0.45, y + 0.45), BASE, z(H.podium) + 0.1)));

const parts = { ring, towerSe, towerNw, bridge, solar, plant, ringSolar, ringStairs, ringHatches, lobby, columns, ...Object.fromEntries(pavilions.map((p, i) => [`pav${i}`, p])), ...Object.fromEntries(cores.map((p, i) => [`core${i}`, p])) };
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts));
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Pontsteigergebouw met ring twee torens brug met vakwerk en open poort", model]],
  catalog: {
    name: "Pontsteigergebouw",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Pier ten zuidwesten van het gebouw en de binnenhof en poort (PDOK-terrein
    // ellipsoïdisch 44,59-44,67); het water rondom (42,48) blijft erbuiten.
    groundSamplePoints: [[-30, 47], [-15, 50], [0, 46], [0, 0], [0, -30]],
    groundHeight: 44.59,
    replacesBuildings: ["0363100012244556", "0363100012244579", "0363100012253421", "0363100012253422", "0363100012253423"].map((id) => `NL.IMBAG.Pand.${id}`),
    description:
      "Oorsprong in het hart van het vierkant op pier- en hofniveau NAP +1,7 m, +X op 129,84 graden in RD langs de IJ-gevel naar het noordwesten, -Y naar het IJ; een vierkant blok van 87,1 x 85,0 m: een ring van zes lagen (+9,0 tot +27,3) om een open binnenhof en aan de IJ-zijde twee torens van 21,8 x 21,9 m, bovenin verbonden door een brug (+60,85 tot +91,0) met in de onderste drie lagen aan beide langsgevels een V-vakwerk, zodat een poort van 43,5 m breed open blijft van het maaiveld tot +60,85; op een open onderbouw met kolommen, golvende glazen paviljoens (+5,93) en een ronde lobby; op de brug zonnepanelen (+91,7), twee installatiehuizen (+94,0) en twee verdiepte patio's, op de ring zonnepanelen en trappenhuizen; gevels met loggia's, ponsvensters en brede vensters per laag. Onderkant van de brug, lagen en vakwerk uit foto's; de kern van de onderbouw geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      footprintM: [87.1, 85.0],
      axisDegrees: AXIS_DEG,
      courtyardM: [2 * UI, +(VI - VS).toFixed(2)],
      towerM: [+(UO - UI).toFixed(2), +(VO + VS).toFixed(2)],
      gateM: { width: 2 * UI, clearHeight: +(H.soffit - GROUND_NAP).toFixed(2) },
      podiumNapM: H.podium,
      pavilionRoofNapM: H.pavilion,
      ringRoofNapM: H.ring,
      ringRoofObjectsNapM: [H.ringSolar, H.ringHatch, H.ringStair],
      bridgeNapM: [H.soffit, H.roof],
      trussNapM: [H.soffit, H.trussTop],
      bridgeRoofObjectsNapM: { solar: H.solar, plant: H.plant, patioFloor: H.patio },
      storeys: { podium: 1, ring: 6, towersBelowBridge: 17, truss: 3, bridgeAbove: 7 },
      estimates: [
        "onderkant van de brug (+60,85), het vakwerk (drie lagen tot +70,0) en de laaghoogtes uit een frontale foto vanaf het IJ, met de schuin geziene onderzijde verrekend; 17 lagen van 3,05 m onder de brug",
        "onderkant van ring en torens (+9,0, open onderbouw van 7,3 m) uit foto's",
        "vakwerk: acht velden met V-diagonalen van 1,0 m, van de binnenzijde van de zuidoosttoren tot het einde van de noordwesttoren, op beide langsgevels (foto's)",
        "teruggelegen glazen kern boven de paviljoens tot +9,0 (2,0 m binnen de paviljoenrand) en de ronde lobby tot +9,0: niet te zien in AHN of BGT, geschat",
        "gevelritme vereenvoudigd: loggia's van 5,6 m op 7,0 m in de ring en de noordwestgevel, ponsvensters van 1,5 m (zuidoosttoren) en 1,0 m (noordwesttoren), brede vensters van 2,6 m in de brug, per laag een halve steek verspringend",
        "kolommen 0,9 m in het vierkant in plaats van 0,54 en 0,8 m (BGT), voor de print",
      ],
    },
    sources: [
      "PDOK BAG panden 0363100012244556, 0363100012244579, 0363100012253421, 0363100012253422 en 0363100012253423; BGT-panden op het maaiveld (paviljoens, ronde lobby en kolommen); Actueel_orthoHR; 2026-10-12",
      "AHN5 DSM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; AHN4 DSM/DTM 0,5 m (PDOK WCS) ter controle",
      "https://nl.wikipedia.org/wiki/Pontsteigergebouw",
      "https://commons.wikimedia.org/wiki/File:Gebouw_aan_het_IJ.jpg",
      "https://commons.wikimedia.org/wiki/File:Pontsteiger_in_2022.jpg",
      "https://commons.wikimedia.org/wiki/File:Pontsteigergebouw;_juli_2018.jpg",
      "https://commons.wikimedia.org/wiki/File:Pontsteigergebouw,_Houthavens_(Amsterdam);_2020-07-24_(09).jpg",
      "https://commons.wikimedia.org/wiki/File:Pontsteiger_foto_2.JPG",
      "https://commons.wikimedia.org/wiki/File:Pontsteigergebouw_2018.08.26_(2).jpg",
      "https://commons.wikimedia.org/wiki/File:2020_Gebouw_Pontsteiger_mei_2020_(10).jpg",
    ],
  },
});

// ---------- vaste invoer ----------
// BGT-panden op het maaiveld (RD), vereenvoudigd met Douglas-Peucker op 0,25 m.
function pavSeRd() {
  return [
    [120954.79, 489596.97], [120953.77, 489605.29], [120952.59, 489606.84], [120950.26, 489607.45], [120947.24, 489606.26], [120944.16, 489609.95],
    [120945.74, 489613.56], [120945.53, 489614.9], [120944.7, 489615.99], [120937.67, 489620.19], [120936.36, 489620.42], [120935.08, 489620.06],
    [120933.96, 489619.06], [120932.02, 489615.61], [120932.63, 489612.74], [120930.38, 489612.56], [120923.99, 489600.92], [120924.97, 489599.08],
    [120921.36, 489595.08], [120919.06, 489596.16], [120908.81, 489589.74], [120909.13, 489586.53], [120905.94, 489584.68], [120903.48, 489586.43],
    [120901.37, 489584.78], [120900.76, 489583.38], [120900.77, 489581.85], [120903.34, 489575.74], [120914.87, 489566.86], [120916.74, 489566.31],
    [120918.61, 489566.75], [120919.91, 489567.86], [120938.13, 489591.83], [120939.02, 489592.32], [120952.26, 489593.98], [120953.93, 489594.87],
  ];
}
function pavNwRd() {
  return [
    [120909.63, 489638.92], [120913.94, 489640.56], [120915.07, 489642.58], [120914.92, 489644.01], [120912.57, 489649.6], [120902.28, 489659.13],
    [120899.83, 489660.19], [120897.08, 489660.24], [120894.58, 489659.25], [120892.59, 489657.31], [120886.71, 489645.15], [120885.91, 489644.15],
    [120862.89, 489633.96], [120861.6, 489632.61], [120861.37, 489630.84], [120867.31, 489618.82], [120873.14, 489615.02], [120875.33, 489614.69],
    [120876.77, 489615.29], [120878.16, 489616.72], [120876.89, 489619.41], [120879.26, 489622.29], [120882.38, 489621.38], [120890.48, 489630.35],
    [120889.89, 489632.54], [120894.44, 489635.65], [120896.1, 489634.35], [120906.4, 489637.84], [120906.83, 489639.71],
  ];
}
function pavSwRd() {
  return [
    [120866.69, 489604.27], [120864.37, 489612.16], [120863.41, 489613.09], [120852.88, 489619.24], [120851.24, 489619.6], [120849.95, 489619.24],
    [120848.91, 489618.34], [120844.19, 489609.83], [120844.95, 489607.92], [120851.54, 489603.95], [120854.19, 489601.07], [120855.3, 489598.65],
    [120859.58, 489582.76], [120860.63, 489581.41], [120862.34, 489580.77], [120864.21, 489581.18], [120865.53, 489582.62], [120869.07, 489595.09],
    [120868.33, 489598.24], [120865.91, 489598.73], [120864.88, 489602.78],
  ];
}
function lobbyRd() {
  return [
    [120901.49, 489567.04], [120900.6, 489570.03], [120898.55, 489572.48], [120895.71, 489573.96], [120892.6, 489574.23], [120889.53, 489573.23],
    [120887.15, 489571.2], [120885.74, 489568.41], [120885.49, 489565.28], [120886.13, 489562.95], [120887.47, 489563.49], [120889.71, 489560.78],
    [120888.96, 489559.6], [120891.52, 489558.43], [120894.35, 489558.23], [120897.34, 489559.17], [120899.73, 489561.16], [120901.23, 489563.96],
  ];
}
// Zwaartepunten van de BGT-kolomvlakjes van pand 0363100012244556.
function columnsRd() {
  return [
    [120892.05, 489549.53], [120900.88, 489556.91], [120908.41, 489563.19], [120938.8, 489588.36], [120942.55, 489591.47], [120949.41, 489608.29],
    [120946.34, 489612.01], [120903.48, 489569.09], [120898.56, 489574.99], [120881.31, 489562.38], [120875.16, 489569.75], [120885.4, 489572.03],
    [120889.55, 489575.51], [120869.0, 489577.12], [120873.92, 489581.21], [120879.24, 489579.42], [120883.39, 489582.88], [120873.09, 489586.79],
    [120877.25, 489590.26], [120867.76, 489588.58], [120856.7, 489591.87], [120871.1, 489597.62], [120850.56, 489599.24], [120844.39, 489606.61],
    [120839.82, 489612.1], [120848.66, 489619.48], [120856.18, 489625.76], [120861.15, 489619.82], [120866.02, 489613.96], [120878.75, 489644.61],
    [120886.37, 489651.17], [120890.11, 489654.3], [120898.7, 489661.51], [120902.45, 489664.59], [120905.37, 489661.11], [120907.9, 489658.07],
    [120910.98, 489654.38], [120913.47, 489650.94],
  ];
}

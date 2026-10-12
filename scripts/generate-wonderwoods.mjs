// Wonderwoods (Jaarbeursboulevard/Croeselaan, Utrecht, Beurskwartier; 2020 tot
// 2025): twee torens op een gezamenlijk BAG-pand, gescheiden door een smalle
// doorgang die op parkniveau (+27) overkapt is.
// - Oost: "Introvert" van Stefano Boeri Architetti, het verticale bos van ca.
//   105 m aan de hoek met de Croeselaan. Een onderbouw van zes lagen met diepe
//   plantenbakken rondom draagt het parkdak (+27); daarboven een toren op een
//   trapeziumvormige plattegrond met een schuine zuidoostgevel. Tot +45,5 is
//   de toren aan de zuidoostkant 7,8 m dieper (terras met plantenbakken);
//   daarboven loopt hij recht door tot het dak (+105,7) met een rand van +107,2
//   en installaties. Op de zuidwest-, noordoost- en noordwestgevel verspringen
//   de balkons met plantenbakken per laag (dambordpatroon), de zuidoostgevel is
//   vlak met losse ramen. Aan de westzijde staat een lagere vleugel (+46).
// - West: "Extrovert" van MVSA Architects, ca. 73 m: een donkere woontoren met
//   afgeronde hoeken (+75,2) in een witte kantoorvleugel van elf lagen
//   (+50) die in afgeronde terrassen afloopt naar de Jaarbeursboulevard
//   (+39,5, +33, +28, +23, +20, +15), en het parkdak (+27) aan de noordzijde.
// Groen (bomen en struiken) is weggelaten; de bakken zijn als dichte platen
// gemodelleerd. Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen
// gestapelde DSM-lagen. Voorbeelden per rij: generate-evoluon.mjs (aanpak
// primitieven) en generate-rabobank-bestuurscentrum.mjs (gevelbanden op
// efteling-kit.mjs).
//
//   node scripts/generate-wonderwoods.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong op RD (135700, 455440) in de doorgang tussen de
// twee gebouwen, z = 0 op NAP +2,2 m (stoep rondom, AHN5-DTM +2,0..+2,4),
// Z omhoog. +X loopt op 49,9 graden in RD langs de Jaarbeursboulevard (BAG-
// gevels op 49,7..50,1 graden) naar de Croeselaan, +Y op 139,9 graden naar het
// Jaarbeursplein (noordwest).
//
// Bronnen en ouderdom: het AHN4 toont een leeg terrein en het AHN5 (opname
// 2023) de bouwfase: de onderbouw, het parkdak, de terrassen van de
// kantoorvleugel en de westvleugel staan erin, de torens pas tot ca. +48. De
// plattegronden en terrashoogtes komen daarom uit het AHN5 waar het af was en
// uit de PDOK-luchtfoto's 2025 en 2026 (Actueel_orthoHR) voor de torens. De
// luchtfoto's laten de daken scheef staan: 2026 ca. 0,065 m per m hoogte naar
// +X en 0,02 naar +Y, 2025 ca. 0,07 naar -X en 0,09 naar -Y (afgeleid uit de
// twee jaren samen en de AHN5-randen van de torenschachten; in 2026 staat de
// toren ernaast, BAG 0344100000148526, ook vrijwel recht). De hoogtes van de
// torens (ca. 105 en 73 m) zijn gepubliceerd (Stefano Boeri Architetti, MVSA);
// de trede op +45,5 en de lagen uit Commons-foto's en het AHN5.
import { CrossSection, Manifold, prism, ccw, rect, writeLandmark, downFaces } from "./efteling-kit.mjs";

// Vereniging die lege lijsten en ontbrekende delen overslaat (null bij niets).
const union = (parts) => {
  const p = parts.filter(Boolean);
  return p.length ? Manifold.union(p) : null;
};

const slug = "wonderwoods";
const ORIGIN = [135700.0, 455440.0];
const AXIS_DEG = 49.9;
const RAD = (AXIS_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 2.2;
const BASE = -0.8; // NAP +1,4, onder de stoep rondom (+2,0..+2,6)
const z = (nap) => +(nap - GROUND_NAP).toFixed(3);

// ---------- hoogtes (NAP) ----------
const H = {
  park: 27.0, // parkdak op beide onderbouwen en de overkapping (AHN5 26,4..27,4; "dakpark op 25 m")
  bridgeSoffit: 23.5, // onderkant overkapping van de doorgang (geschat: een laag)
  // Introvert (Boeri)
  introRim: 107.2, // dakrand: ca. 105 m boven maaiveld (Stefano Boeri Architetti)
  introRoof: 105.7, // dak binnen de rand (geschat 1,5 m lager)
  introStep: 45.5, // terras op de zuidoostkant van de toren (AHN5 45..46; foto's ca. 43 m boven maaiveld)
  introWing: 46.0, // westvleugel (AHN5 45..47)
  introPlant: [107.6, 108.2, 109.0], // installaties (luchtfoto 2026; hoogtes geschat)
  // Extrovert (MVSA)
  extroRim: 75.2, // dakrand donkere toren: ca. 73 m boven maaiveld (MVSA)
  extroRoof: 74.0, // groen dak binnen de rand (geschat)
  extroPlant: [76.5, 77.0], // dakopbouwen (luchtfoto 2026; hoogtes geschat)
  office: 50.0, // bovenkant witte kantoorvleugel (AHN5 48..52; foto 2024: ca. 69 % van de toren)
};

// ---------- hulpfuncties ----------
const cs = (poly) => new CrossSection([ccw(poly)]);
const ext = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
// Afgeronde rechthoek (straal r, 6 segmenten per hoek).
const rrect = (u0, v0, u1, v1, r, n = 6) => {
  const pts = [];
  const corners = [[u1 - r, v0 + r, -90], [u1 - r, v1 - r, 0], [u0 + r, v1 - r, 90], [u0 + r, v0 + r, 180]];
  for (const [cu, cv, a0] of corners) {
    for (let k = 0; k <= n; k++) {
      const a = ((a0 + (90 * k) / n) * Math.PI) / 180;
      pts.push([cu + r * Math.cos(a), cv + r * Math.sin(a)]);
    }
  }
  return pts;
};
// Gevelbanden: per rij [h0, h1] (NAP) een ring van d diep langs de buitenrand
// van alles wat op die hoogte nog doorloopt (blokken met top >= h1 + 0,9), zodat
// alleen buitengevels een band krijgen en er geen holtes tussen blokken ontstaan.
const facadeBands = (blocks, rows, d = 0.35, mask = null) =>
  union(
    rows.map(([h0, h1]) => {
      const live = blocks.filter((b) => b.top >= h1 + 0.9).map((b) => b.sec);
      if (!live.length) return null;
      const s = CrossSection.union(live);
      let ring = s.subtract(s.offset(-d, "Miter", 2));
      if (mask) ring = ring.intersect(mask);
      return ring.isEmpty() ? null : ext(ring, z(h0), z(h1));
    }),
  );

// =====================================================================
// Extrovert (MVSA): witte kantoorvleugel in terrassen en donkere toren
// =====================================================================
// Buitenrand op het AHN5 en de luchtfoto (afgeronde witte randen, r = 3 m).
const W_OUT = cs(rrect(-58.5, -27.4, 1.0, 32.8, 3.0));
// Terrassen: vak (met 2 m marge waar het de buitenrand raakt) en bovenkant.
const W_TIERS = [
  { name: "boulevard-oost", box: [-35, -30, 3, -16], top: 15.0 },
  { name: "boulevard-west", box: [-61, -30, -35, -20.5], top: 20.0 },
  { name: "doorgang-zuid", box: [-11.5, -16, 3, -9.5], top: 19.0 },
  { name: "atrium", box: [-35, -16, -11.5, -5], top: 23.0 }, // glazen dak boven het atrium
  { name: "west", box: [-61, -20.5, -52.5, 6], top: 23.5 },
  { name: "terras-28", box: [-52.5, -20.5, -35, -17], top: 28.0 },
  { name: "terras-33", box: [-52.5, -17, -35, -14.5], top: 33.0 },
  { name: "terras-39", box: [-52.5, -14.5, -35, -12], top: 39.5 },
  { name: "kantoor", box: [-52.5, -12, -44.5, 26.5], top: H.office },
  { name: "kantoor-zuid", box: [-44.5, -12, -35, -5], top: H.office },
  { name: "kantoor-noord", box: [-44.5, 23, -35, 26.5], top: H.office },
  { name: "trappenhuis", box: [-61, 8, -52.5, 12.5], top: 39.0 }, // opbouw aan de westgevel (AHN5 38..41)
];
const DT_SEC = cs(rrect(-44.5, -5.0, -11.5, 23.0, 4.0, 8)); // donkere toren (luchtfoto 2026, scheefstand gecorrigeerd)
let west = ext(W_OUT, BASE, z(H.park));
const tierSec = (t) => W_OUT.intersect(cs(rect(...t.box)));
for (const t of W_TIERS.filter((t) => t.top < H.park)) {
  const [u0, v0, u1, v1] = t.box;
  west = west.subtract(prism(rect(u0, v0, u1, v1), z(t.top), z(H.park) + 1));
}
const westHigh = W_TIERS.filter((t) => t.top > H.park).map((t) => ext(tierSec(t), z(H.park) - 0.05, z(t.top)));
const darkTower = ext(DT_SEC, BASE, z(H.extroRim));
// Gevelbanden: kantoorlagen van 3,6 m vanaf +7,2 (glas 2,7 m, borstwering 0,9 m),
// begane grond glas tot +6,3; de donkere toren lagen van 3,15 m vanaf +5,0.
const parkBlocks = [{ sec: W_OUT, top: H.park }];
const westBlocks = [
  ...W_TIERS.map((t) => ({ sec: tierSec(t), top: t.top })),
  { sec: W_OUT.subtract(CrossSection.union(W_TIERS.filter((t) => t.top < H.park).map((t) => cs(rect(...t.box))))), top: H.park },
  { sec: DT_SEC, top: H.extroRim },
];
const officeRows = [[2.6, 6.3], ...range(12, (k) => [7.2 + 3.6 * k + 0.9, 7.2 + 3.6 * k + 3.6])];
const dtRows = range(22, (k) => [5.0 + 3.15 * k + 0.9, 5.0 + 3.15 * k + 3.15]).filter(([, h1]) => h1 <= H.extroRim - 1.2);
const dtMask = DT_SEC.offset(0.6, "Miter", 2);
// Bruine stijlen van 0,9 m op een raster van 3,0 m (foto's): de glasbanden van
// de donkere toren worden zo ramen tussen stijlen en vloerbanden.
// Alleen op de rechte gevels; de afgeronde hoeken houden doorlopende banden.
const dtPiers = union([
  ...range(9, (k) => -40.5 + 2.65 + 3.0 * k).map((u) => prism(rect(u - 0.45, -12, u + 0.45, 30), BASE - 1, z(H.extroRim) + 1)),
  ...range(7, (k) => -1.0 + 2.5 + 3.0 * k).map((v) => prism(rect(-50, v - 0.45, -5, v + 0.45), BASE - 1, z(H.extroRim) + 1)),
]);
const westBands = union([
  null,
  facadeBands(westBlocks.filter((b) => b.sec !== DT_SEC), officeRows, 0.35, null)?.subtract(ext(dtMask, BASE, z(H.extroRim) + 1)),
  facadeBands(westBlocks, dtRows, 0.4, dtMask)?.subtract(dtPiers),
]);
// Dak van de donkere toren: rand 0,9 m, groen dak lager, twee opbouwen.
const dtRoofCut = ext(DT_SEC.offset(-0.9, "Round", 2), z(H.extroRoof), z(H.extroRim) + 1);
const dtPlant = union([
  prism(rect(-23.7, 6.5, -13.7, 15.5), z(H.extroRoof) - 0.05, z(H.extroPlant[1])),
  prism(rect(-30.2, 8.0, -26.7, 10.5), z(H.extroRoof) - 0.05, z(H.extroPlant[0])),
]);
let extrovert = union([west, ...westHigh, darkTower]);
if (westBands) extrovert = extrovert.subtract(westBands);
extrovert = extrovert.subtract(dtRoofCut);
extrovert = union([extrovert, dtPlant]);

// =====================================================================
// Introvert (Boeri): onderbouw met plantenbakken, toren met trede en balkons
// =====================================================================
// Onderbouw: buitenrand van de bakken uit het AHN5 (ca. 4 m buiten de BAG-
// gevels), de gevel zelf 3 m daarbinnen.
const E_OUT_PTS = [[8.0, -28.3], [48.25, -42.9], [76.55, 34.2], [8.0, 34.2]];
const E_OUT = cs(E_OUT_PTS);
const E_CORE = E_OUT.offset(-3.0, "Miter", 2);
const podiumFloors = [7.2, 10.5, 13.8, 17.1, 20.4, 23.7]; // lagen van 3,3 m (begane grond 5 m)
let podium = ext(E_CORE, BASE, z(H.park) - 0.05);
podium = podium.subtract(facadeBands([{ sec: E_CORE, top: H.park + 1 }], [[2.6, 6.3], ...podiumFloors.map((f) => [f + 0.9, f + 3.0])]));
const E_RING = E_OUT.subtract(E_CORE.offset(-0.3, "Miter", 2));
const planters = union([
  ...podiumFloors.slice(0, -1).map((f) => ext(E_RING, z(f) - 0.3, z(f) + 0.9)),
  ext(E_OUT, z(podiumFloors.at(-1)) - 0.3, z(H.park)),
]);

// Toren: trapezium met de schuine zuidoostgevel op 18,2 graden van +X.
// E1 (boven +45,5): door (26,0, -13,1) en (51,5, -21,5); E2 (tot +45,5) 7,8 m
// zuidelijker, op de AHN5-rand van 2023.
const SE_SLOPE = -0.3294;
const e1 = (u) => -13.1 + SE_SLOPE * (u - 26.0);
const e2 = (u) => e1(u) - 7.8;
const T_SW = 27.5; // gevel zuidwest
const T_NE = 50.0; // gevel noordoost
const T_NW = 24.0; // gevel noordwest
const BAL = 2.6; // diepte balkons met plantenbak
const UPPER = [[T_SW, e1(T_SW)], [T_NE, e1(T_NE)], [T_NE, T_NW], [T_SW, T_NW]];
const MIDDLE = [[T_SW, e2(T_SW)], [T_NE, e2(T_NE)], [T_NE, T_NW], [T_SW, T_NW]];
const midFloors = range(6, (k) => H.park + ((H.introStep - H.park) * k) / 6); // 3,08 m
const upFloors = range(19, (k) => H.introStep + ((H.introRoof - H.introStep) * k) / 19); // 3,17 m
let middle = prism(MIDDLE, z(H.park) - 0.05, z(H.introStep));
let upper = prism(UPPER, z(H.introStep) - 0.05, z(H.introRim));
// Dak binnen een rand van 1,0 m.
upper = upper.subtract(ext(cs(UPPER).offset(-1.0, "Miter", 2), z(H.introRoof), z(H.introRim) + 1));
// Terras op de trede: plantenbak van 1,0 m langs de schuine rand.
const stepRim = Manifold.hull([
  ...[[T_SW, e2(T_SW)], [T_NE, e2(T_NE)], [T_NE, e2(T_NE) + 1.0], [T_SW, e2(T_SW) + 1.0]].flatMap(([u, v]) => [[u, v, z(H.introStep) - 0.05], [u, v, z(H.introStep) + 1.0]]),
]);
// Balkons: platen van 1,2 m (vloer met plantenbak) die 2,0 m uitsteken, per
// laag verspringend in een dambordpatroon (traveeën van 6,4 m, 5,4 m breed).
const balconies = [];
const BAY = 6.4;
const BW = 5.4;
const allFloors = [...midFloors.slice(1), ...upFloors.slice(1)];
allFloors.forEach((f, k) => {
  const z0 = z(f) - 0.3;
  const z1 = z(f) + 0.9;
  const top = f < H.introStep ? "mid" : "up";
  // zuidwestgevel (u = T_SW) en noordoostgevel (u = T_NE): langs v
  for (const [u0, u1, vMin] of [[T_SW - BAL, T_SW + 0.05, top === "mid" ? e2(T_SW) : e1(T_SW)], [T_NE - 0.05, T_NE + BAL, top === "mid" ? e2(T_NE) : e1(T_NE)]]) {
    for (let j = 0; (vMin + 0.6 + BAY * j) < T_NW - 0.6; j++) {
      if ((j + k) % 2) continue;
      const a = vMin + 0.6 + BAY * j;
      const b = Math.min(a + BW, T_NW + (u0 < T_SW ? BAL : BAL));
      balconies.push(prism(rect(u0, a, u1, b), z0, z1));
    }
  }
  // noordwestgevel (v = T_NW): langs u
  for (let j = 0; T_SW - BAL + BAY * j < T_NE - 2; j++) {
    if ((j + k + 1) % 2) continue;
    const a = T_SW - BAL + BAY * j;
    balconies.push(prism(rect(a, T_NW - 0.05, Math.min(a + BW, T_NE), T_NW + BAL), z0, z1));
  }
});
// Zuidoostgevel: losse ramen als nissen van 0,35 m (1,6 x 1,8 m), per laag
// verspringend; op de middenmoot en de toren.
const windows = [];
const seNiche = (line, s, f) => {
  const u0 = T_SW + s;
  const u1 = u0 + 1.6;
  const pts = [[u0, line(u0) - 0.5], [u1, line(u1) - 0.5], [u1, line(u1) + 0.35], [u0, line(u0) + 0.35]];
  return prism(pts, z(f) + 0.7, z(f) + 2.5);
};
[H.park, ...allFloors].forEach((f, k) => {
  const line = f < H.introStep ? e2 : e1;
  const n = k % 2 ? 4 : 5;
  for (let j = 0; j < n; j++) windows.push(seNiche(line, (k % 2 ? 3.2 : 1.0) + 4.4 * j, f));
});
// Middenmoot en toren: glasbanden achter de balkons op de drie andere gevels
// (de schuine zuidoostgevel heeft ramen); masker boven de eigen schuine rand.
const aboveLine = (line) => cs([[T_SW - 5, line(T_SW - 5) + 1.0], [T_NE + 5, line(T_NE + 5) + 1.0], [T_NE + 5, T_NW + 5], [T_SW - 5, T_NW + 5]]);
const towerBands = union([
  facadeBands([{ sec: cs(MIDDLE), top: H.introRim }], midFloors.slice(1).map((f) => [f + 1.0, f + 2.8]), 0.35, aboveLine(e2)),
  facadeBands([{ sec: cs(UPPER), top: H.introRim }], upFloors.map((f) => [f + 1.0, f + 2.8]), 0.35, aboveLine(e1)),
  facadeBands([{ sec: cs(MIDDLE), top: H.introRim }], [[H.park + 1.0, H.park + 2.8]], 0.35, aboveLine(e2)),
]);
// Westvleugel (+46) met balkonplaten op de zuidwest- en noordwestgevel.
const WING = [14.5, 6.0, T_SW + 0.05, T_NW];
let wing = prism(rect(...WING), z(H.park) - 0.05, z(H.introWing));
const wingFloors = range(6, (k) => H.park + 3.08 * (k + 1)).filter((f) => f < H.introWing - 1);
wing = wing.subtract(facadeBands([{ sec: cs(rect(...WING)), top: H.introWing }], wingFloors.map((f) => [f + 1.0, f + 2.8])));
const wingBalc = union(
  wingFloors.flatMap((f, k) => [
    prism(rect(14.5 - BAL, 7.0 + (k % 2 ? 4.5 : 0), 14.55, 11.0 + (k % 2 ? 4.5 : 0)), z(f) - 0.3, z(f) + 0.9),
    prism(rect(14.5 - BAL, 16.0 + (k % 2 ? 4.5 : 0), 14.55, 20.0 + (k % 2 ? 4.5 : 0)), z(f) - 0.3, z(f) + 0.9),
    prism(rect(15.0 + (k % 2 ? 5 : 0), T_NW - 0.05, 19.5 + (k % 2 ? 5 : 0), T_NW + BAL), z(f) - 0.3, z(f) + 0.9),
  ]),
);
// Dakinstallaties (luchtfoto 2026; hoogtes geschat).
const introPlant = union([
  prism(rect(31.5, 9.0, 45.0, 20.0), z(H.introRoof) - 0.05, z(H.introPlant[0])),
  prism(rect(33.0, -1.0, 42.0, 9.05), z(H.introRoof) - 0.05, z(H.introPlant[1])),
  prism(rect(38.5, 13.5, 43.0, 18.0), z(H.introPlant[0]) - 0.05, z(H.introPlant[2])),
]);
const towerCut = union([...windows, towerBands]);
let introvert = union([podium, planters, middle.subtract(towerCut), upper.subtract(towerCut), stepRim, wing, wingBalc, union(balconies), introPlant]);

// ---------- overkapping van de doorgang op parkniveau ----------
const bridge = prism(rect(0.5, 15.0, 8.5, 31.0), z(H.bridgeSoffit), z(H.park));

const parts = { extrovert, introvert, bridge };
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts));
model = model.trimByPlane([0, 0, 1], BASE);
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 20);
console.log("ondervlakken > 20 m2:", JSON.stringify(down));
console.log("lagen:", { mid: +((H.introStep - H.park) / 6).toFixed(3), up: +((H.introRoof - H.introStep) / 19).toFixed(3), balconies: balconies.length, windows: windows.length });

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Wonderwoods met de Introvert onderbouw plantenbakken en trede de Extrovert in terrassen en de overkapte doorgang", model]],
  catalog: {
    name: "Wonderwoods",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Stoep langs de Jaarbeursboulevard, het Jaarbeursplein en de westgevel
    // (PDOK ellipsoïdisch 45,43..45,61); de hogere Croeselaan (45,8..45,9)
    // blijft erbuiten.
    groundSamplePoints: [[-40, -33], [-10, -33], [-64, -20], [-64, 10], [-40, 37], [30, 38]],
    groundHeight: 45.45,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000151919"],
    description:
      "Oorsprong RD (135700, 455440) in de doorgang tussen de twee gebouwen op stoepniveau NAP +2,2 m, +X op 49,9 graden in RD langs de Jaarbeursboulevard naar de Croeselaan, +Y naar het Jaarbeursplein; oost de Introvert (Boeri): onderbouw met plantenbakken tot het parkdak +27, toren op een trapezium van 22,5 m breed met een schuine zuidoostgevel, tot +45,5 aan de zuidoostkant 7,8 m dieper, dak +105,7 met rand +107,2 en installaties, verspringende balkons met bakken op drie gevels, ramen in de vlakke zuidoostgevel en een westvleugel tot +46; west de Extrovert (MVSA): donkere toren met afgeronde hoeken tot +75,2 in een witte kantoorvleugel (+50) die in afgeronde terrassen (+39,5, +33, +28, +23, +20, +15) afloopt naar de boulevard; de doorgang is op parkniveau overkapt. Torenhoogtes gepubliceerd (ca. 105 en 73 m), plattegronden uit AHN5 (bouwfase 2023) en de luchtfoto's 2025-2026; lagen, trede, balkons en dakopbouwen uit foto's of geschat; groen weggelaten.",
    realWorld: {
      groundNapM: GROUND_NAP,
      axisDegrees: AXIS_DEG,
      introvert: {
        architect: "Stefano Boeri Architetti",
        publishedHeightM: 105,
        napM: { rim: H.introRim, roof: H.introRoof, step: H.introStep, wing: H.introWing, park: H.park, plant: H.introPlant },
        upperPlanM: { sw: T_SW, ne: T_NE, nw: T_NW, seEdge: [[26.0, -13.1], [51.5, -21.5]], seSlopeDegrees: +((Math.atan(-SE_SLOPE) * 180) / Math.PI).toFixed(1) },
        stepDepthM: 7.8,
        storeys: { podium: 6, middle: 6, upper: 19, middleM: +((H.introStep - H.park) / 6).toFixed(3), upperM: +((H.introRoof - H.introStep) / 19).toFixed(3) },
        balconyDepthM: BAL,
        podiumOuter: E_OUT_PTS,
        podiumPlanterDepthM: 3.0,
      },
      extrovert: {
        architect: "MVSA Architects",
        publishedHeightM: 73,
        napM: { rim: H.extroRim, roof: H.extroRoof, office: H.office, terraces: [...new Set(W_TIERS.map((t) => t.top))].sort((a, b) => b - a), park: H.park },
        towerPlanM: { u: [-44.5, -11.5], v: [-5.0, 23.0], cornerRadius: 4.0 },
        officeOuter: { u: [-58.5, 1.0], v: [-27.4, 32.8], cornerRadius: 3.0 },
        officeStoreyM: 3.6,
        towerStoreyM: 3.15,
      },
      passage: { u: [1.0, 8.0], coveredV: [15.0, 31.0], soffitNapM: H.bridgeSoffit },
      orthoLeanPerMetre: { "2026": [0.065, 0.02], "2025": [-0.072, -0.093] },
      estimates: [
        "torenhoogtes uit gepubliceerde ronde maten (ca. 105 en 73 m); het AHN5 (2023) toont de torens pas tot ca. +48, het AHN4 een leeg terrein",
        "plattegrond van de Introvert-toren en de donkere toren uit de daken op de luchtfoto's 2025 en 2026, gecorrigeerd voor de scheefstand van de foto's (ca. +-2 m); de schuine zuidoostrand en de westvleugel uit het AHN5",
        "trede van de Introvert op +45,5 (AHN5 en de verhouding op de foto van 2024); lagen 6 + 6 + 19 (31 lagen in de vakpers), de verspringende balkons als dambord van 4,2 m brede, 1,2 m dikke platen die 2,0 m uitsteken",
        "plantenbakken van de onderbouw 3,0 m diep rondom (het AHN5 en de luchtfoto liggen 3,5 tot 5 m buiten de BAG-gevels), per laag als dichte plaat",
        "terrassen van de kantoorvleugel uit het AHN5; glasbanden per laag van 3,6 m (kantoor) en 3,15 m (donkere toren) geschat",
        "overkapping van de doorgang een laag dik (onderkant +23,5) geschat; de doorgang eronder open",
        "dakopbouwen op beide torens uit de luchtfoto 2026, hoogtes geschat",
      ],
    },
    sources: [
      "PDOK BAG pand 0344100000151919 (bouwjaar 2025), Actueel_orthoHR, 2025_orthoHR en 2024_orthoHR; PDOK-gebouwtegels en terrein; 2026-10-12",
      "AHN5 DSM/DTM 0,5 m (opname 2023, bouwfase), ahn.arcgisonline.nl Hoogtebestand; AHN4 DSM/DTM 0,5 m (PDOK WCS, leeg terrein); 3D BAG (AHN5, bouwfase)",
      "https://nl.wikipedia.org/wiki/Wonderwoods",
      "https://stefanoboeriarchitetti.net/en/?p=62973",
      "https://mvsa-architects.com/project/wonderwoods/",
      "https://commons.wikimedia.org/wiki/File:Wonderwoods_Utrecht_in_2024.jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Introvert_September_2024.jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Introvert_Utrecht_2026.jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Introvert_Utrecht.jpg",
      "https://commons.wikimedia.org/wiki/File:Woontoren_Extrovert.jpg",
      "https://commons.wikimedia.org/wiki/File:Wonderwoods_Utrecht.jpg",
      "https://commons.wikimedia.org/wiki/File:Balkons_van_woontoren_Introvert_Utrecht.jpg",
    ],
  },
});

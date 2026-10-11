// Hoftoren (Rijnstraat 50, Den Haag; Kohn Pedersen Fox, 2003), "de Vulpen":
// kantoortoren van 142 m naast Den Haag Centraal, met het ministerie van OCW.
// Plattegrond als een druppel: een rechte zuidwestgevel van natuursteen, een
// licht schuine noordoostgevel die met een ronde hoek naar een smalle
// noordwestkop draait, en een ronde glazen kop aan de zuidoostkant. Boven de
// laatste verdieping (+95,5) loopt de gevel door als open stalen kroon tot een
// schuin dakvlak van circa 30 graden dat naar het noordwesten oploopt. Langs de
// zuidwestgevel staat een steiler oplopend scherm (38 graden) dat bij de
// noordwesthoek uitloopt in de witte punt van +142,4: de penpunt. Een tweede,
// lagere witte vin staat op de andere hoek van de noordwestkop. Aan de toren
// hangt in hetzelfde BAG-pand een lagere vleugel van 57 tot 66 m in de vorm van
// een boemerang, met een licht hellend en getordeerd dak, en een lage strook
// langs het stationsgebouw. Vlakken en benoemde bouwdelen in een eigen
// gebouwstelsel, geen gestapelde DSM-lagen. Voorbeeld per rij:
// generate-evoluon.mjs (aanpak primitieven), generate-haagse-toren.mjs,
// generate-castalia.mjs en generate-delftse-poort.mjs (skylinetorens op
// efteling-kit.mjs).
//
//   node scripts/generate-hoftoren.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong midden in de toren op RD (81975, 455237), z = 0 op
// NAP +0,6 m (straten rondom: AHN-DTM +0,55 tot +0,75), Z omhoog. +X loopt op
// 37,3 graden in RD, haaks op de rechte zuidwestgevel (BAG 127,3 graden) en
// langs de zuidrand van het pand aan het stationsgebouw (BAG 37,4 graden); +Y
// wijst naar het noordwesten (127,3 graden), naar de noordwestkop met de punt.
// De vleugel ligt aan +X, het stationsgebouw aan -Y.
//
// Bronnen: BAG-pand 0518100001749878 (toren, vleugel en lage strook in één
// pand), AHN DSM/DTM 0,5 m (PDOK WCS, in dit stelsel uitgelezen: contour van de
// torenkop, dakvlakfit, schermlijn, putten, vleugeldak), 3D BAG LoD2.2 (TU
// Delft/3D geoinformatie, CC BY 4.0: dakhelling 32,5 graden, terrassen
// 104,4-109,7, platte delen 94,3/101/56,8/62,8 en de lage strook +9,2),
// Actueel_orthoHR, Wikipedia (141,86 m, 29 lagen, KPF) en Commons-foto's van
// alle kanten (gevels, kroon, vinnen).
import { CrossSection, Manifold, prism, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "hoftoren";
const ORIGIN = [81975.0, 455237.0];
const AXIS_DEG = 37.3;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.6;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes en vlakken (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  facadeTop: 95.5, // laatste verdieping; daarboven de open kroon (glazen kop: 3D BAG 94,3)
  crown0: 96.6, // onderkant van de kroonsleuven
  lobby: 5.1, // bovenkant van de entreeverdieping
  storey: 3.3, // verdiepingshoogte: 27 lagen tussen +5,1 en +94,2 boven de entree (Wikipedia: 29 lagen)
  tip: 142.4, // witte punt op de noordwesthoek (Wikipedia 141,86 m boven maaiveld +0,6)
  fin2: 133.0, // tweede vin (AHN 132,6)
  well: 104.5, // terras achter de noordwestkop (3D BAG 104,4-104,8)
};
// Dakvlak van de toren: z = c + a u + b v, kleinste-kwadratenfit op 2370
// AHN-punten (rms 1,4 m; glas en staalwerk geven ruis): 30 graden, oplopend naar
// het noordwesten en licht aflopend naar de noordoostgevel. De 3D BAG geeft
// 32,5 graden (765 m2).
const ROOF = { a: -0.187, b: 0.5445, c: 111.55 };
// Schermlijn langs de zuidwestgevel (AHN-maxima op de gevel: 112,7 op v = -12,
// 122,3 op v = 0, 132,2 op v = 12, 137,7 op v = 20, 141,2 op v = 24): 0,8 per m,
// tot de punt op v = 25,6.
const BLADE = { c: H.tip - 0.8 * 25.6, b: 0.8 };
// Dakvlakken van de vleugel (AHN-fit, rms 0,16-0,18 m): P1 over de noordarm en
// de oostkant, P2 over de diagonale arm naar de toren; ze snijden elkaar in een
// flauwe nok. Bij de toren ligt het dak vlak op +56,8 (3D BAG).
const WP1 = { a: -0.0548, b: 0.1525, c: 63.97 };
const WP2 = { a: 0.1002, b: 0.0898, c: 56.37 };
const WING_FLAT = 56.8;
const WING_RIM = 58.6; // verhoogde rand langs het stationsgebouw (AHN 58,6)
const WING_BOX = 62.8; // installatieopbouw (3D BAG 62,8)
const STRIP_LOW = 9.2; // lage strook langs het stationsgebouw (3D BAG; AHN heeft hier geen punten)
const STRIP_EAST = 52.4; // oostelijk deel van die strook (AHN 50,0-52,8)

// ---------- plattegrond (m, gebouwstelsel) ----------
// Toren tegen de klok in, vanaf de westhoek van de noordwestkop: rechte
// zuidwestgevel (BAG u = -11,4), glazen zuidoostkop (AHN-contour van de kop,
// 0,25 m naar binnen; hij steekt boven de lage strook uit), schuine
// noordoostgevel (BAG), ronde noordhoek (BAG) en de noordwestkop.
const SE_HEAD = [
  [-11.45, -9.0], [-11.2, -11.0], [-10.85, -12.6], [-10.45, -14.1], [-9.9, -15.6], [-9.35, -17.0], [-8.6, -18.4],
  [-7.9, -19.6], [-7.1, -20.9], [-6.3, -22.2], [-5.6, -23.6], [-4.7, -25.0], [-3.6, -26.4], [-1.9, -27.5], [0.0, -28.2],
  [1.7, -28.6], [3.5, -28.8], [5.4, -28.6], [7.2, -28.0], [8.9, -27.0], [10.1, -25.5], [11.0, -23.7], [11.7, -21.8],
  [12.4, -20.0], [13.0, -18.3], [13.45, -16.5], [13.9, -14.5], [14.6, -12.5],
];
const NE_CORNER = [[8.81, 13.44], [8.45, 14.5], [7.9, 15.59], [7.17, 16.58], [6.46, 17.29], [5.22, 18.24], [4.46, 18.72]];
const NW_FACE = 23.7; // noordwestkop (BAG)
const TOWER = [
  [-11.45, NW_FACE],
  ...resample(SE_HEAD, 1.8),
  ...resample([[14.6, -12.5], [8.81, 13.44]], 1.8).slice(1),
  ...NE_CORNER.slice(1),
  [-1.65, 22.95], [-4.07, NW_FACE],
];
// Scherm en punt langs de zuidwestgevel (1,45 m dik), met de punt 1,9 m voor de
// noordwestkop uit (BAG-voet van de vin: u -11,64..-10,96, v 23,3..25,6).
const BLADE_POLY = [[-11.45, -11.0], [-10.0, -11.0], [-10.0, NW_FACE], [-10.25, NW_FACE], [-10.25, 25.6], [-11.45, 25.6]];
// Tweede vin op de noordhoek van de kop (BAG-voet u -5,7..-3,1, v 23,7..25,3;
// top in het AHN op u -3, v 26,5), 1,1 m breed.
const FIN2 = [[-4.4, 23.45], [-3.3, 23.45], [-2.6, 26.7], [-3.7, 26.9]];
// Goot tussen scherm en dakvlak (AHN u -9,5..-8,6, 3D BAG-terrassen) en het
// terras achter de noordwestkop: de kroon is daar open.
const CHANNEL = { u0: -10.0, u1: -8.6, steps: [[-11.0, -5.0, 106.8], [-5.0, 2.5, 107.3], [2.5, 13.8, 109.7], [13.8, 21.0, H.well]] };
const WELL_REGION = [[-10.0, 20.3], [0.0, 19.7], [5.6, 13.8], [20, 13.8], [20, 22.3], [-10.0, 22.3]];

// Vleugel (BAG-contour, v >= -27,5) met de aansluiting langs de torenkop.
const WING = [
  [50.49, -27.5], [52.09, -24.94], [56.16, -18.44], [57.3, -8.4], [58.01, -2.08], [59.03, 6.18], [59.73, 13.46], [61.12, 24.5],
  [62.0, 31.61], [61.85, 35.2], [61.5, 38.3], [58.12, 41.45], [52.35, 34.9], [50.11, 31.92], [48.3, 28.47], [47.35, 25.41],
  [44.37, 2.38], [43.65, 0.26], [41.86, -2.45], [40.06, -4.04], [37.32, -5.46], [18.48, -11.69], [17.28, -12.87], [16.3, -14.37],
  [13.6, -14.5], [13.2, -18.3], [12.2, -21.8], [10.6, -25.5], [9.0, -27.5],
];
const WING_JOINT = [22, 27]; // randen 22..27 liggen tegen of in de toren: geen gevelreliëf
// Lage strook langs het stationsgebouw (BAG, v -34,1..-27,4), zonder de inham van
// het buurpand (u 21,2-33,2, v < -30,2), en het oostelijke deel op +52,4.
const STRIP_LOW_POLY = [[-17.3, -34.1], [21.1, -34.1], [21.1, -30.3], [33.3, -30.3], [33.3, -34.1], [38.0, -34.1], [38.0, -27.4], [-12.2, -27.4], [-12.2, -25.2], [-17.3, -25.2]];
const STRIP_EAST_POLY = [[38.0, -34.1], [46.3, -34.1], [50.5, -27.4], [38.0, -27.4]];
const WING_BOX_POLY = [[35.3, -23.0], [44.5, -22.7], [44.3, -12.2], [35.4, -14.9]];

// Luifel langs de Rijnstraat voor de oostgevel van de vleugel (AHN +8,0 op
// u 60-64, v -10..24; ortho: glazen luifel), 4 m diep en 0,9 m dik.
const CANOPY_TOP = 8.0;
const CANOPY = [[56.6, -12], [57.0, -8.4], [57.71, -2.08], [58.73, 6.18], [59.43, 13.46], [60.76, 24.0], [65.0, 24.0], [63.7, 13.46], [63.0, 6.18], [62.0, -2.08], [61.3, -8.4], [60.9, -12]];

// Gevelritme (foto's): toren met natuurstenen penanten en één venster per
// travee van 1,8 m per verdieping, de glazen kop met bredere ruiten; vleugel met
// smalle vensters van 1,1 m per travee van 1,8 m en 18 verdiepingen van 3,3 m
// boven een glazen entreeverdieping.
const NICHE = 0.35;
const WING_STOREY = 3.3;
const WING_FLOOR0 = 5.0;

// ---------- hulpfuncties ----------
// Catmull-Rom door de punten, herbemonsterd op ongeveer `step` m (facetten van
// de gebogen gevels).
function resample(pts, step) {
  if (pts.length === 2) {
    const [a, b] = pts;
    const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    return Array.from({ length: n + 1 }, (_, k) => [+(a[0] + ((b[0] - a[0]) * k) / n).toFixed(3), +(a[1] + ((b[1] - a[1]) * k) / n).toFixed(3)]);
  }
  const dense = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let t = 0; t < 1; t += 0.05) {
      const t2 = t * t, t3 = t2 * t;
      dense.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
    }
  }
  dense.push(pts[pts.length - 1]);
  const len = [0];
  for (let i = 1; i < dense.length; i++) len.push(len[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const total = len[len.length - 1];
  const n = Math.max(1, Math.round(total / step));
  const out = [];
  for (let k = 0, j = 0; k <= n; k++) {
    const s = (total * k) / n;
    while (j < dense.length - 2 && len[j + 1] < s) j++;
    const f = (s - len[j]) / (len[j + 1] - len[j] || 1);
    out.push([+(dense[j][0] + (dense[j + 1][0] - dense[j][0]) * f).toFixed(3), +(dense[j][1] + (dense[j + 1][1] - dense[j][1]) * f).toFixed(3)]);
  }
  return out;
}
// Houd alles onder het vlak z = c + a u + b v (NAP), of erboven.
const below = (solid, { a, b, c }) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -z(c) / n);
};
const above = (solid, { a, b, c }) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([-a / n, -b / n, 1 / n], z(c) / n);
};
const planeAt = ({ a, b, c }, u, v) => c + a * u + b * v;
const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
// Blinde nis in de gevel a→b (buitenkant rechts, tegen de klok in rond de
// veelhoek): s0..s1 vanaf a, NAP-hoogtes, diepte in de gevel en `out` naar buiten.
const niche = (a, b, s0, s1, nap0, nap1, depth = NICHE, out = 1.0) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return Manifold.cube([depth + out, s1 - s0, nap1 - nap0])
    .translate([-depth, s0, z(nap0)])
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
// Gevelreliëf langs de randen van een veelhoek: per travee (pitch) een venster
// per verdieping, tot `topAt(u, v) - margin`; `kind(i, a, b)` geeft per rand
// {width, rows} of null.
function facade(poly, { pitch, kind, topAt, margin = 1.0, crown = null }) {
  const P = ccw(poly);
  const out = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i];
    const b = P[(i + 1) % P.length];
    const spec = kind(i, a, b);
    if (!spec) continue;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < spec.width + 0.6) continue;
    const n = Math.max(1, Math.round(len / pitch));
    for (let k = 0; k < n; k++) {
      const s = (len * (k + 0.5)) / n;
      const p = [a[0] + ((b[0] - a[0]) * s) / len, a[1] + ((b[1] - a[1]) * s) / len];
      const top = topAt(p[0], p[1]) - margin;
      const w = Math.min(spec.width, len / n - 0.7);
      for (const [r0, r1] of spec.rows) if (r1 <= top) out.push(niche(a, b, s - w / 2, s + w / 2, r0, r1));
      // Kroon: open staalwerk boven de laatste verdieping als sleuven.
      if (crown && top - 0.2 - crown.from > 2.0) out.push(niche(a, b, s - crown.width / 2, s + crown.width / 2, crown.from, top - 0.2, crown.depth));
    }
  }
  return out;
}

// ---------- toren ----------
const towerCs = cs(TOWER);
let tower = below(prismCs(towerCs, BASE, z(160)), ROOF);
// Scherm met de punt langs de zuidwestgevel en de tweede vin.
const blade = below(prism(BLADE_POLY, BASE, z(160)), { a: 0, b: BLADE.b, c: BLADE.c });
const fin2 = below(prism(FIN2, BASE, z(160)), { a: 0, b: (H.fin2 - 127.0) / (26.8 - 23.45), c: 127.0 - ((H.fin2 - 127.0) / (26.8 - 23.45)) * 23.45 });
tower = union([tower, blade, fin2]);
// Open kroon: goot tussen scherm en dakvlak en het terras achter de noordwestkop
// (wanden van 1,4 m blijven staan langs de noordoostgevel en de kop, ook na de
// kroonsleuven van 0,45 m nog 0,95 m).
{
  const pits = CHANNEL.steps.map(([v0, v1, nap]) => prism([[CHANNEL.u0, v0], [CHANNEL.u1, v0], [CHANNEL.u1, v1], [CHANNEL.u0, v1]], z(nap), z(160)));
  const well = towerCs.offset(-1.4, "Miter").intersect(cs(WELL_REGION));
  pits.push(prismCs(well, z(H.well), z(160)));
  tower = tower.subtract(union(pits));
}
// Gevelreliëf: vensters per verdieping, glazen kop met bredere ruiten, kroon.
const towerRows = [[0.9, 4.4]];
for (let f = H.lobby; f + H.storey <= H.facadeTop + 0.01; f += H.storey) towerRows.push([+(f + 0.6).toFixed(2), +(f + 2.8).toFixed(2)]);
const towerTop = (u, v) => {
  const roof = planeAt(ROOF, u, v);
  if (u < -10.0) return Math.max(roof, BLADE.c + BLADE.b * v);
  return roof;
};
const towerCuts = facade(TOWER, {
  pitch: 1.8,
  topAt: (u, v) => Math.min(towerTop(u, v), H.facadeTop + 1.0),
  margin: 0.5,
  kind: (i, a, b) => {
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    if (Math.abs(a[1] - NW_FACE) < 0.01 && Math.abs(b[1] - NW_FACE) < 0.01) return { width: 1.6, rows: towerRows }; // noordwestkop
    if (mid[1] < -19) return { width: 1.4, rows: towerRows }; // glazen zuidoostkop
    return { width: 1.0, rows: towerRows };
  },
});
towerCuts.push(
  ...facade(TOWER, {
    pitch: 1.8,
    topAt: towerTop,
    margin: 1.2,
    kind: () => ({ width: 0.9, rows: [] }),
    crown: { from: H.crown0, width: 0.9, depth: 0.45 },
  }),
);
// Nissen en sleuven uit de toren halen vóór de vereniging met de vleugel: waar
// de vleugel tegen de toren staat, vult die de nissen weer op.
tower = tower.subtract(union(towerCuts));

// ---------- vleugel ----------
const wingCs = cs(WING);
// Gebied van P1 (noordarm en oostkant) en P2 (diagonale arm), gescheiden door de
// snijlijn u = 49,03 + 0,4045 v (P1 = P2) ten zuiden van v = -3.
const crease = (v) => 49.03 + 0.4045 * v;
const regionB = cs([[-20, -40], [crease(-40), -40], [crease(-3), -3], [-20, -3]]);
const wingA = below(prismCs(wingCs.subtract(regionB), BASE, z(80)), WP1);
const wingBcs = wingCs.intersect(regionB);
const wingB = union([below(prismCs(wingBcs, BASE, z(80)), WP2), prismCs(wingBcs, BASE, z(WING_FLAT))]);
let wing = union([wingA, wingB]);
const wingTop = (u, v) => (v < -3 && u < crease(v) ? Math.max(planeAt(WP2, u, v), WING_FLAT) : planeAt(WP1, u, v));
// Dakrand: het dak ligt 0,8 m onder een rand van 0,9 m (AHN: rand 1,2 m boven het dak aan de westkant).
{
  const inset = wingCs.offset(-0.9, "Miter").subtract(towerCs.offset(0.9, "Miter"));
  const lower = (p) => ({ ...p, c: p.c - 0.8 });
  const cutA = above(prismCs(inset.subtract(regionB), BASE, z(80)), lower(WP1));
  const insetB = inset.intersect(regionB);
  const cutB = above(above(prismCs(insetB, BASE, z(80)), lower(WP2)), { a: 0, b: 0, c: WING_FLAT - 0.8 });
  wing = wing.subtract(union([cutA, cutB]));
}
// Verhoogde rand langs het stationsgebouw en de installatieopbouw.
wing = union([wing, prism([[12.5, -27.5], [50.49, -27.5], [51.55, -25.8], [12.5, -25.8]], BASE, z(WING_RIM)), prism(WING_BOX_POLY, BASE, z(WING_BOX))]);
const wingRows = [[1.3, 4.3]];
for (let f = WING_FLOOR0; f + WING_STOREY <= 66; f += WING_STOREY) wingRows.push([+(f + 0.7).toFixed(2), +(f + 2.9).toFixed(2)]);
const wingCuts = facade(WING, {
  pitch: 1.8,
  topAt: wingTop,
  margin: 1.3,
  kind: (i) => (i >= WING_JOINT[0] && i <= WING_JOINT[1] ? null : { width: 1.1, rows: wingRows }),
});
wing = wing.subtract(union(wingCuts));

// ---------- lage strook langs het stationsgebouw ----------
const strip = union([prism(STRIP_LOW_POLY, BASE, z(STRIP_LOW)), prism(STRIP_EAST_POLY, BASE, z(STRIP_EAST)), prism(CANOPY, z(CANOPY_TOP - 0.9), z(CANOPY_TOP))]);

// Nissen van het ene bouwdeel die het andere afdekt (toren tegen vleugel,
// vleugel tegen de lage strook), worden ingesloten holtes: die vallen weg.
let model = union([tower, wing, strip]);
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));
console.log("torenpunten:", TOWER.length, "verdiepingen toren:", towerRows.length, "vleugel:", wingRows.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Hoftoren met schuine kroon punt vinnen vleugel en lage strook", model]],
  catalog: {
    name: "Hoftoren",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straten aan de oost- (Rijnstraat, AHN-DTM +0,55..+0,6) en westzijde
    // (+0,7); de lader neemt de laagste. Het binnenterrein ten noorden van de
    // toren ligt op +3,7..+4,2 en dekt daar de voet.
    groundSamplePoints: [[66, 0], [66, 20], [-16, 12], [-16, 25]],
    replacesBuildings: ["NL.IMBAG.Pand.0518100001749878"],
    description:
      "Oorsprong midden in de toren op straatniveau NAP +0,6 m, +X op 37,3 graden in RD (haaks op de rechte zuidwestgevel), +Y naar de noordwestkop; druppelvormige toren van 26 x 55 m met glazen zuidoostkop, laatste verdieping op NAP +95,5 m en een open kroon onder een dakvlak van 30 graden (+94,7 tot +124 m), een steiler scherm langs de zuidwestgevel dat uitloopt in de punt van +142,4 m en een tweede vin tot +133 m; boemerangvormige vleugel tot +57..+66 m met twee dakvlakken, en een lage strook (+9,2) langs het stationsgebouw; gevelritme en kroonsleuven uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      tipNapM: H.tip,
      fin2NapM: H.fin2,
      lastFloorNapM: H.facadeTop,
      roofPlane: { nap: "c + a*x + b*y", ...ROOF, degrees: +((Math.atan(Math.hypot(ROOF.a, ROOF.b)) * 180) / Math.PI).toFixed(1) },
      bladeSlopePerM: BLADE.b,
      crownTerraceNapM: H.well,
      wingRoofPlanes: { north: WP1, diagonal: WP2, flatNapM: WING_FLAT },
      wingRimNapM: WING_RIM,
      wingPlantNapM: WING_BOX,
      canopyNapM: CANOPY_TOP,
      lowStripNapM: [STRIP_LOW, STRIP_EAST],
      towerPlanM: [26.1, 55.5],
      storeyPitchM: H.storey,
      axisDegrees: AXIS_DEG,
      estimates: [
        "vensters per verdieping van 3,3 m (27 lagen boven een entree van 4,5 m, Wikipedia 29 lagen) in travees van 1,8 m uit foto's; de glazen kop en de noordwestkop met bredere ruiten",
        "open stalen kroon boven +95,5 als verticale sleuven van 0,9 m op 1,8 m (foto's)",
        "tweede vin: 1,1 m breed, top +133 (AHN 132,6) met een schuine bovenkant uit foto's",
        "lage strook langs het stationsgebouw op +9,2 m uit de 3D BAG: het AHN heeft in die smalle strook tussen de hoge gebouwen geen punten",
        "vleugelgevels: vensters van 1,1 m per travee van 1,8 m en 18 verdiepingen van 3,3 m uit een frontale foto van de oostgevel",
        "luifel langs de Rijnstraat: 4 m diep, bovenkant +8,0 (AHN), 0,9 m dik",
      ],
    },
    sources: [
      "PDOK BAG pand 0518100001749878, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100001749878 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhelling, terrassen in de kroon, platte delen en de lage strook",
      "https://nl.wikipedia.org/wiki/Hoftoren",
      "https://en.wikipedia.org/wiki/Hoftoren",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Hoftoren_4.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Hoftoren_6.jpg",
      "https://commons.wikimedia.org/wiki/File:Ministerie_OCW.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag,_Hoftoren_vanaf_Laan_van_Reagan_en_Gorbatsjov_IMG_8945_2019-03-24_17.46_(cropped).jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Hoftoren_2.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Hoftoren_3.jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_-_De_Hoftoren_(25949001308).jpg",
      "https://commons.wikimedia.org/wiki/File:Den_Haag_Hoftoren_%26_Zurichtoren_3.jpg",
    ],
  },
});

// Watertoren Stork 1917 in Hengelo (Lansinkesweg 59), ontworpen door A.G. Beltman, reservoir 125 m³, rijksmonument 511480.
// Tot begin jaren negentig de drinkwatertoren van het Stork-terrein, sinds 2000 met de aangebouwde voormalige modelmakerij
// de brandweerkazerne. De toren staat in de zuidgevel van de modelmakerij en is met die fabriekshal één BAG-pand
// (0164100000013444, 3023 m², met een lage oost- en westvleugel). De PDOK-reconstructie van dat pand bevat de toren al
// (tot NAP +54); een model van alleen de toren zou erin steken, en het pand vervangen zonder de hal liet een gat van
// 140 m. Daarom bevat het model het hele pand: de toren in detail, de hal en de vleugels als blokken met platte daken op
// hun AHN-hoogte en een raster van blinde vensters.
//
// Toren: vierkante schacht (9,3 × 10,2 m) met aan de zuidkant twee kolommen vensters boven de ingang en aan de andere
// kanten boven het dak van de hal blinde velden en drie grote vensters; daarop een iets bredere bovenverdieping op een
// schuine kraag (de consoles), in plattegrond een achthoek met afgeschuinde hoeken en licht bolle gevels, met een
// vensterband; dan een kroonlijst, een schilddak met acht vlakken en een vierkante lantaarn met een rij kleine vensters.
//
// Oorsprong op het hart van de toren (AHN-DSM boven NAP +45, BAG-zuidgevel), op maaiveld NAP +18,2 (AHN-DTM ten zuiden van
// de toren 18,18 tot 18,33). +X langs de zuidgevel van toren en hal (BAG-gevels onder -10,5 graden), +Y naar het
// noordnoordoosten; de voorzijde (ingang, zuidzuidwest) ligt aan -Y.
// Hoogtes uit het AHN-DSM 0,5 m (zie de maten hieronder); geledingen van de toren uit "Hengelo Watertoren 8745.JPG"
// (Commons, oostgevel, circa 46 px/m) en "Hengelo-nl-stork-04 (9437555889).jpg" (zuid- en oostgevel).
import { hull, union, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [250579.41, 475713.82];
const ANGLE = -10.5; // graden, de gevels van toren en hal (BAG)
const AXIS = [+Math.cos((ANGLE * Math.PI) / 180).toFixed(5), +Math.sin((ANGLE * Math.PI) / 180).toFixed(5)];
const BASE = -0.9; // het maaiveld zakt 0,6 m van de toren naar het oosteinde van de oostvleugel
const GROUND_NAP = 18.2;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints voor de zuidgevel, gemeten 2026-11-06 met de
// terreintegels van de export (0,-6,5: 61,767; -3,-6,5: 61,780; 3,-6,5: 61,756; -15,-3,5: 61,738).
const GROUND_ELLIPSOID = 61.74;

// RD → modelstelsel.
const toLocal = ([x, y]) => {
  const dx = x - ORIGIN[0], dy = y - ORIGIN[1];
  return [+(dx * AXIS[0] + dy * AXIS[1]).toFixed(3), +(-dx * AXIS[1] + dy * AXIS[0]).toFixed(3)];
};

// ---------- BAG-pand 0164100000013444 ----------
// Contour vereenvoudigd (Douglas-Peucker 0,25 m, 1011 → 40 punten), RD, BAG-WFS 2026-11-06.
const BAG = [
  [250542.67, 475725.45], [250542.11, 475723.17], [250549.09, 475721.43], [250549.35, 475722.32], [250555.76, 475719.2],
  [250555.57, 475718.81], [250559.78, 475716.77], [250559.97, 475717.16], [250575.42, 475709.65], [250575.37, 475709.34],
  [250582.99, 475707.93], [250583.17, 475708.71], [250587.45, 475707.94], [250587.52, 475708.33], [250588.8, 475708.41],
  [250589.9, 475709.18], [250590.44, 475710.32], [250590.82, 475710.25], [250592.21, 475718.05], [250601.45, 475714.41],
  [250613.48, 475708.93], [250647.04, 475690.88], [250655.53, 475706.83], [250655.4, 475707.23], [250617.51, 475727.18],
  [250603.24, 475733.58], [250595.64, 475736.15], [250596.9, 475743.08], [250546.27, 475752.45], [250545.36, 475746.97],
  [250541.78, 475747.24], [250527.34, 475746.38], [250520.29, 475745.55], [250519.17, 475744.29], [250519.41, 475743.22],
  [250520.28, 475742.59], [250534.2, 475740.02], [250534.49, 475741.67], [250544.02, 475739.89], [250541.36, 475726.09],
].map(toLocal);
const pick = (ids) => ids.map((i) => BAG[i]);
// Hal (modelmakerij) met de torenvoet; oost- en westvleugel; een lage strook voor de zuidwesthoek.
const HALL = pick([39, 0, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 26, 27, 28, 29, 38]);
const WING_E = pick([18, 19, 20, 21, 22, 23, 24, 25, 26]);
const WING_W = pick([29, 30, 31, 32, 33, 34, 35, 36, 37, 38]);
const PORCH = pick([0, 1, 2, 3]);
// Bovenbouw van de hal (AHN-DSM NAP +35,73): 3,5 m achter de zuidgevel, 4 m achter de west- en 3,4 m achter de noordgevel,
// aan de oostkant tot 4,7 m achter de gevel; bij de toren loopt hij tot de zuidgevel van de oostelijke strook.
const UPPER = [[-35.35, 7.3], [-4.65, -0.7], [-4.65, -3.7], [7.15, -3.7], [7.15, 28.5], [-35.35, 28.5]];
// Lichtstraat op de bovenbouw (AHN-DSM NAP +36,7 over de nok, het glas daarnaast zonder echo).
const ROOFLIGHT = { x: [-21.4, 3.6], y: [13.8, 16.8], ridge: 18.5 };

// ---------- maten (meters boven maaiveld NAP +18,2) ----------
const H = {
  porch: 2.3, // AHN NAP +20,45
  wingE: 6.1, // AHN NAP +24,28
  wingW: 6.3, // AHN NAP +24,49
  hall: 11.45, // rand van de hal, AHN NAP +29,65
  upper: 17.55, // bovenbouw, AHN NAP +35,73
  shaftTop: 27.95, // kraag onder de bovenverdieping (foto: consoles 3,6 tot 4,3 m onder de kroonlijst)
  storey: 28.9,
  corniceFoot: 31.8, // kroonlijst 0,3 m uit over 0,45 m (op de schuine hoeken 0,42 m: 47 graden)
  corniceEdge: 32.25,
  eave: 32.5, // AHN-DSM NAP +50,5 tot 51 langs de dakrand
  lanternFoot: 34.7, // AHN-DSM NAP +52,9 op 2,1 m van het hart
  lanternTop: 35.6,
  capEdge: 35.75,
  top: 35.95, // AHN-DSM NAP +54,1 tot 54,4 (3D BAG h_nok 54,38); de antennemast erboven is weggelaten
};
// Toren in plattegrond: hart van de schacht iets west van de oorsprong zodat de oostgevel op de BAG-hoek valt.
const CX = -0.05, CY = -0.04;
const SHAFT = [4.65, 5.1]; // halve breedte langs X en Y: 9,3 × 10,2 m (zuidgevel BAG op Y = -5,14)
const STOREY = [4.85, 5.3]; // bovenverdieping tussen de hoeken, met 1,0 m afgeschuinde hoeken en 0,3 m bolle gevels
const CHAMFER = 1.0, BOW = 0.3;
const LANTERN = 2.1;

const deg = (a) => (a * Math.PI) / 180;
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const sq = (h, cx = CX, cy = CY) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];

// Achthoek met afgeschuinde hoeken en bolle gevels (convex), om het hart van de toren; grow schuift alles naar buiten.
const bowOutline = ([hx, hy], grow = 0) => {
  const ax = hx + grow, ay = hy + grow, c = CHAMFER;
  const pts = [];
  // Per gevel: van hoek tot hoek in het eigen stelsel (normaal n, raaklijn t), boog door de gevelmidden op BOW.
  const faces = [[[1, 0], [0, 1], ax, ay], [[0, 1], [-1, 0], ay, ax], [[-1, 0], [0, -1], ax, ay], [[0, -1], [1, 0], ay, ax]];
  for (const [n, t, d, half] of faces) {
    const L = half - c; // halve lengte van het bolle deel
    const R = (L * L + BOW * BOW) / (2 * BOW);
    for (let k = 0; k <= 8; k++) {
      const s = -L + (2 * L * k) / 8;
      const o = d + Math.sqrt(R * R - s * s) - (R - BOW);
      pts.push([CX + n[0] * o + t[0] * s, CY + n[1] * o + t[1] * s]);
    }
  }
  return pts;
};
const bowAt = (half, s) => {
  const L = half - CHAMFER, R = (L * L + BOW * BOW) / (2 * BOW);
  return Math.sqrt(R * R - s * s) - (R - BOW);
};

// Blinde nis in een gevel: p een punt op het gevelvlak, n de normaal naar buiten, w breed, van z0 tot z1, depth diep;
// het plafond loopt onder 56 graden de muur in, buiten de gevel snijdt de nis nog 0,2 m vrij (zoals watertoren-goor).
const niche = (p, n, w, z0, z1, depth) => {
  const t = [-n[1], n[0]];
  const at = (o, s, z) => [p[0] + n[0] * o + t[0] * s, p[1] + n[1] * o + t[1] * s, z];
  const out = Math.min(0.2, (z1 - z0) / 1.5);
  return hull([-w / 2, w / 2].flatMap((s) => [
    at(-depth, s, z0), at(out, s, z0), at(-depth, s, z1 + 1.5 * depth), at(0, s, z1), at(out, s, z1 - 1.5 * out),
  ]));
};
// Vensters per gevelvak: langs elke rand van een veelhoek (linksom) een rij nissen per verdieping op een vaste steek.
const ccwPts = (pts) => {
  let a = 0;
  pts.forEach(([x0, y0], i) => { const [x1, y1] = pts[(i + 1) % pts.length]; a += x0 * y1 - x1 * y0; });
  return a > 0 ? pts : [...pts].reverse();
};
const facadeNiches = (poly, rows, { pitch = 4.2, width = 2.6, depth = 0.3, minLen = 4, skip = () => false } = {}) => {
  const pts = ccwPts(poly), out = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (L < minLen) return;
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const edgeRows = rows.filter(([z0]) => !skip(mid, z0));
    const count = Math.floor((L - 1.2) / pitch);
    if (count < 1 || !edgeRows.length) return;
    const start = (L - (count - 1) * pitch) / 2;
    for (let k = 0; k < count; k++) {
      const s = start + k * pitch;
      for (const [z0, z1] of edgeRows) out.push(niche([a[0] + d[0] * s, a[1] + d[1] * s], n, width, z0, z1, depth));
    }
  });
  return out;
};
// Gedeelde gevels: hal–oostvleugel op X ≈ 11,8, hal–westvleugel op X ≈ -39,6, hal–strook langs de zuidwesthoek.
const onLine = (p, q, m, tol = 0.3) => {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const dist = Math.abs((q[0] - p[0]) * (p[1] - m[1]) - (p[0] - m[0]) * (q[1] - p[1])) / L;
  const s = ((m[0] - p[0]) * (q[0] - p[0]) + (m[1] - p[1]) * (q[1] - p[1])) / (L * L);
  return dist < tol && s > 0 && s < 1;
};
const shared = (mid, z0) =>
  (onLine(BAG[18], BAG[26], mid) && z0 < H.wingE + 0.5) ||
  (onLine(BAG[29], BAG[38], mid) && z0 < H.wingW + 0.5) ||
  (onLine(BAG[0], BAG[3], mid) && z0 < H.porch + 0.5) ||
  onLine(BAG[9], BAG[10], mid); // de zuidgevel van de toren krijgt eigen vensters

// ---------- hal en vleugels ----------
const hall = prism(HALL, BASE, H.hall);
const upper = prism(UPPER, BASE, H.upper + 0.01);
const rooflight = hull([
  ...ring([[ROOFLIGHT.x[0], ROOFLIGHT.y[0]], [ROOFLIGHT.x[1], ROOFLIGHT.y[0]], [ROOFLIGHT.x[1], ROOFLIGHT.y[1]], [ROOFLIGHT.x[0], ROOFLIGHT.y[1]]], H.upper),
  [ROOFLIGHT.x[0], (ROOFLIGHT.y[0] + ROOFLIGHT.y[1]) / 2, ROOFLIGHT.ridge], [ROOFLIGHT.x[1], (ROOFLIGHT.y[0] + ROOFLIGHT.y[1]) / 2, ROOFLIGHT.ridge],
]);
const wingE = prism(WING_E, BASE, H.wingE);
const wingW = prism(WING_W, BASE, H.wingW);
const porch = prism(PORCH, BASE, H.porch);

// ---------- toren ----------
const [sx, sy] = SHAFT;
const shaftPoly = [[CX - sx, CY - sy], [CX + sx, CY - sy], [CX + sx, CY + sy], [CX - sx, CY + sy]];
const shaft = prism(shaftPoly, BASE, H.shaftTop + 0.01);
// Kraag (consoles) van de schacht naar de bredere bovenverdieping: hoogstens 0,55 m uit over 0,95 m (30 graden).
const collar = hull([...ring(shaftPoly, H.shaftTop), ...ring(bowOutline(STOREY), H.storey)]);
const storey = prism(bowOutline(STOREY), H.storey - 0.01, H.corniceFoot + 0.01);
const cornice = hull([...ring(bowOutline(STOREY), H.corniceFoot), ...ring(bowOutline(STOREY, 0.3), H.corniceEdge), ...ring(bowOutline(STOREY, 0.3), H.eave)]);
const roof = hull([...ring(bowOutline(STOREY, 0.25), H.eave - 0.01), ...ring(sq(LANTERN), H.lanternFoot)]);
const lantern = prism(sq(LANTERN), H.lanternFoot - 0.3, H.lanternTop + 0.01);
const cap = hull([...ring(sq(LANTERN), H.lanternTop), ...ring(sq(LANTERN + 0.15), H.capEdge), ...ring(sq(LANTERN + 0.15), H.top)]);

// ---------- vensters ----------
const face = { S: [[0, -1], sy], N: [[0, 1], sy], E: [[1, 0], sx], W: [[-1, 0], sx] };
const onFace = (f, s) => {
  const [n, d] = face[f];
  const t = [-n[1], n[0]];
  return [[CX + n[0] * d + t[0] * s, CY + n[1] * d + t[1] * s], n];
};
// Zuidgevel: twee kolommen vensters (2,9 m breed, middenpijler 1,0 m) in zes rijen; links onder de ingang.
const SOUTH_ROWS = [[3.6, 6.4], [7.4, 10.6], [11.6, 14.8], [15.8, 19.0], [20.0, 23.2], [24.4, 27.4]];
const southWindows = [-1.95, 1.95].flatMap((s) => SOUTH_ROWS.map(([z0, z1]) => niche(...onFace("S", s), 2.9, z0, z1, 0.35)));
const door = niche(...onFace("S", -1.95), 2.2, 0, 3.0, 0.5); // ingang onder de westelijke kolom (foto)
// Oost-, noord- en westgevel boven de hal: drie blinde velden (18,2 tot 23,6) en drie grote vensters (24,4 tot 27,4).
const sideWindows = ["E", "N", "W"].flatMap((f) => {
  const w = f === "N" ? 2.2 : 2.35, step = f === "N" ? 2.85 : 3.1;
  return [-step, 0, step].flatMap((s) => [niche(...onFace(f, s), w, 18.2, 23.6, 0.2), niche(...onFace(f, s), w, 24.4, 27.4, 0.35)]);
});
// Bovenverdieping: vijf vensters per bolle gevel (1,1 m breed, 29,6 tot 31,2) en één smal venster per schuine hoek.
const storeyWindows = [];
for (const [n, half] of [[[1, 0], STOREY[0]], [[-1, 0], STOREY[0]], [[0, 1], STOREY[1]], [[0, -1], STOREY[1]]]) {
  const t = [-n[1], n[0]], L = half - CHAMFER;
  for (let k = -2; k <= 2; k++) {
    const s = (k * (2 * L - 1.1)) / 4;
    const o = (n[0] ? STOREY[0] : STOREY[1]) + bowAt(half, s);
    storeyWindows.push(niche([CX + n[0] * o + t[0] * s, CY + n[1] * o + t[1] * s], n, 1.1, 29.6, 31.2, 0.3));
  }
}
for (const [ix, iy] of [[1, 1], [-1, 1], [-1, -1], [1, -1]]) {
  const n = [ix * Math.SQRT1_2, iy * Math.SQRT1_2];
  const p = [CX + ix * (STOREY[0] - CHAMFER / 2), CY + iy * (STOREY[1] - CHAMFER / 2)];
  storeyWindows.push(niche(p, n, 0.6, 29.6, 31.2, 0.3));
}
// Lantaarn: per kant een band van kleine vensters (34,95 tot 35,4).
const lanternWindows = [[1, 0], [-1, 0], [0, 1], [0, -1]].map((n) =>
  niche([CX + n[0] * LANTERN, CY + n[1] * LANTERN], n, 3.0, 34.95, 35.4, 0.2));
// Hal: per verdieping een rij vensters op 4,2 m steek in de rand (drie lagen) en in de bovenbouw (twee lagen); vleugels één
// hoge rij per vak.
const hallWindows = facadeNiches(HALL, [[1.2, 3.4], [4.6, 6.8], [8.0, 10.4]], { skip: shared });
const upperWindows = facadeNiches(UPPER, [[12.4, 14.4], [15.2, 16.9]], { skip: (mid) => mid[1] < -3 });
const wingWindows = [
  ...facadeNiches(WING_E, [[1.0, 5.2]], { skip: shared }),
  ...facadeNiches(WING_W, [[1.0, 5.4]], { skip: shared }),
];

const body = union([hall, upper, rooflight, wingE, wingW, porch, shaft, collar, storey, cornice, roof, lantern, cap])
  .subtract(union([...southWindows, door, ...sideWindows, ...storeyWindows, ...lanternWindows, ...hallWindows, ...upperWindows, ...wingWindows]));

await writeLandmark({
  slug: "watertoren-hengelo-stork-1917",
  base: BASE,
  nodes: [["building:watertoren-stork-met-modelmakerij-en-vleugels", body]],
  catalog: {
    name: "Watertoren Stork 1917",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, -6.5], [-3, -6.5], [3, -6.5], [-15, -3.5]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0164100000013444"],
    description:
      "Oorsprong op het hart van de toren op maaiveld NAP +18,2 m, +X langs de zuidgevel (-10,5 graden), +Y naar het noordnoordoosten, ingang aan -Y. Het model bevat het hele BAG-pand 0164100000013444: de toren in detail (schacht 9,3 × 10,2 m met twee kolommen vensters in de zuidgevel, blinde velden en drie grote vensters op de andere gevels, kraag naar een achtkantige bovenverdieping met bolle gevels en vensterband, kroonlijst op 32,5 m, achtvlaks schilddak en lantaarn tot 35,95 m, NAP +54,15) en de modelmakerij (rand 11,45 m, bovenbouw 17,55 m met lichtstraat) met de oost- en westvleugel (6,1 en 6,3 m) als blokken met vensternissen. Hoogtes uit AHN, geledingen van de toren uit twee foto's; onderkant 0,9 m onder het maaiveld omdat dat naar het oosten 0,6 m daalt.",
    realWorld: {
      built: 1917,
      architect: "A.G. Beltman",
      reservoirM3: 125,
      rijksmonument: 511480,
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 50.7,
      ahnLanternNapM: 54.15,
      bag3dRidgeNapM: 54.38,
      ahnHallEdgeNapM: 29.65,
      ahnHallUpperNapM: 35.73,
      ahnWingNapM: [24.28, 24.49],
      shaftM: [SHAFT[0] * 2, SHAFT[1] * 2],
      storeyM: [STOREY[0] * 2 + 2 * BOW, STOREY[1] * 2 + 2 * BOW],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Hengelo_Stork,_1917) (1917, A.G. Beltman, 125 m³, rijksmonument 511480, brandweerkazerne sinds 2000)",
      "https://commons.wikimedia.org/wiki/File:Hengelo_Watertoren_8745.JPG (oostgevel: blinde velden, drie grote vensters, consoles, bovenverdieping met vensterband, kroonlijst, dak en lantaarn; circa 46 px/m)",
      "https://commons.wikimedia.org/wiki/File:Hengelo-nl-stork-04_(9437555889).jpg (zuid- en oostgevel: twee kolommen vensters, ingang, aansluiting op de hal)",
      "https://commons.wikimedia.org/wiki/File:Hengelo-Lansinkesweg_59.jpg en File:P1090510_(4276094215).jpg (vanuit het zuidwesten en oosten: hal en vleugels)",
      "PDOK BAG-pand 0164100000013444 (toren met modelmakerij en vleugels), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0164100000013444: h_nok 54,38, maaiveld 17,72, opgehaald 2026-11-06",
    ],
  },
});

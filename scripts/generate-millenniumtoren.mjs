// Millenniumtoren (Weena 686, Rotterdam; WZMH Architects met AGS Architekten &
// Planners, 2000): kantoor- en hoteltoren (Marriott) van 34 lagen tegenover
// Delftse Poort, dak NAP +126,5 en antennemast tot 149,1 m boven de straat.
// De romp is een rechthoek van 28,6 bij 37,2 m met granieten lisenen en
// blauwe glasvelden. Midden op beide smalle gevels (noord aan het Weena, zuid
// naar De Doelen) loopt een gebogen glazen erker van 8 m breed tot NAP +116,8,
// met stenen ringen. De top is geen puntige spits (backlog-hint): de vier
// hoeken stoppen op NAP +103,1, de lange gevels lopen door tot +113,3 en
// daarboven ligt aan beide lange zijden een glazen mansardevlak van circa 67
// graden tot het platte dak. Op de smalle gevels geeft dat een trapezium met
// steile schuine zijkanten (circa 82 graden) tussen de hoekblokken. Op elke
// smalle gevel staan boven het dak twee pylonen naast de erkeras, daartussen
// installaties en aan de noordkant de vakwerkmast. Aan de voet: een gebogen
// glazen entreepaviljoen aan het Weena, een lage vleugel aan de oostkant en
// de loopbrug naar De Doelen aan de zuidkant. Vlakken en benoemde bouwdelen
// in een eigen gebouwstelsel, geen gestapelde DSM-lagen. Voorbeeld per rij:
// generate-evoluon.mjs (aanpak primitieven), generate-haagse-toren.mjs,
// generate-rembrandttoren.mjs en generate-cooltoren.mjs (skylinetorens op
// efteling-kit.mjs).
//
//   node scripts/generate-millenniumtoren.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het hart van de romp op RD (92015,10,
// 437507,06), z = 0 op NAP -0,7 m (straat aan de west- en noordzijde, AHN-DTM
// -0,5 tot -0,75; aan de zuidkant -1,0), Z omhoog. +X loopt op 17,5 graden in
// RD, langs de smalle gevels (BAG-gevels 17,5 en 107,5 graden), dus naar het
// oostnoordoosten; +Y wijst naar het noordnoordwesten, naar het Weena en
// Rotterdam Centraal. De oostvleugel ligt aan +X, de loopbrug aan -Y.
//
// Bronnen: BAG-pand 0599100000689030 (romp, entreepaviljoen, oostvleugel en
// loopbrug), AHN DSM/DTM 0,5 m (PDOK WCS, AHN4, in dit stelsel uitgelezen:
// hoekblokken, gevelstroken, dak, overgang naar het dak), 3D BAG LoD2.2 (TU
// Delft/3D geoinformatie, CC BY 4.0: hoekblokken 103,1, stroken 113,3, dak
// 125,6-127, pylonen 130,3, erkertop 116,8, paviljoen 13,0, vleugel 16,7-18,3,
// loopbrug 10,7), Actueel_orthoHR, Wikipedia (149,1 m, dak 131 m boven de
// straat, 34 lagen) en Commons-foto's van alle kanten (gevelritme, erker,
// mansarde, pylonen, mast).
import { CrossSection, box, prism, hull, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "millenniumtoren";
const ORIGIN = [92015.1, 437507.06];
const AXIS_DEG = 17.5;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = -0.7;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  corner: 103.1, // hoekblokken (3D BAG 102,5-103,5, AHN 103)
  strip: 113.3, // lange gevels, voet van de mansarde (AHN en 3D BAG 113,1-113,4)
  roof: 126.5, // plat dak (AHN 126-127, 3D BAG 125,6-127,1)
  bayTop: 116.8, // bovenkant van de erkers (3D BAG 116,8)
  pylon: 130.3, // pylonen op de smalle gevels (3D BAG 130,2-130,4)
  plant: 128.1, // installatieopbouwen (3D BAG 127,9-128,2)
  rail: 129.2, // twee langsschermen tussen de pylonen (AHN-ruggen 128-130)
  mastLow: 135.5, // brede onderste vakwerkdeel van de mast (foto's)
  mastMid: 141.0, // smaller middendeel (foto's)
  mastTop: 148.4, // Wikipedia 149,1 m boven de straat (NAP -0,7)
  pavilion: 13.0, // entreepaviljoen aan het Weena (3D BAG 12,9-13,0)
  wing: 17.5, // oostvleugel (AHN 17-18, 3D BAG 16,7-18,3)
  wingNorth: 8.2, // lager noordelijk deel van de oostvleugel (3D BAG 8,2)
  bridgeTop: 11.0, // loopbrug naar De Doelen (AHN 10-11, 3D BAG 10,7)
  bridgeBottom: 6.5, // onderkant loopbrug op de eerste verdieping (geschat)
  lobby: 11.3, // bovenkant van de dubbelhoge onderbouw
};
// Verdiepingen: 30 lagen van 3,4 m tussen de onderbouw (+11,3) en de voet van
// de mansarde (+113,3); de hoekblokken (+103,1) vallen dan op laag 27. Elke
// vierde laag een bredere stenen band (foto's: banden op circa +106,5 en +92,9).
const P = 3.4;
const f = (j) => H.lobby + P * j;
const STOREYS = 30;
const isBand = (j) => j % 4 === 0;

// ---------- plattegrond (m, gebouwstelsel) ----------
const HX = 14.32; // halve breedte: west- en oostgevel (BAG u -17,41; AHN 11,2)
const HY = 18.6; // halve lengte: zuid- en noordgevel (BAG v -15,47 / 21,75)
const CD = 5.7; // diepte van de hoekblokken (3D BAG 16,1-21,8; AHN 16,5)
const YM = HY - CD; // lange gevels tot +113,3 tussen |y| < YM
const TX0 = 12.0; // breedte van het trapezium op de hoekblokken (AHN-rand 103 → helling)
const RX = 8.8; // dakrand: halve breedte van het platte dak (AHN 125-126 bij u -12,2 en 5,0)
// Gebogen erker (BAG-boog van het paviljoen niet; foto's en 3D BAG: koorde
// 8 m, 1,7 m voor de gevel).
const BAY = { half: 4.0, out: 1.7 };
const BAY_R = (BAY.half ** 2 + BAY.out ** 2) / (2 * BAY.out);
// Pylonen naast de erkeras (3D BAG u -7,1..-5,1 en -2,0..0,4; foto's).
const PYLON = { x0: 1.75, x1: 3.75, depth: 3.6 };
const MAST = { y: HY - 2.6, base: 1.8, low: 1.3, mid: 1.0, needle: 0.9 };
// Entreepaviljoen aan het Weena (BAG-contour, vereenvoudigd tot circa 5 cm):
// twee bogen met een kleine ronde neus in het midden.
const PAVILION = [
  [7.37, 18.1], [7.37, 18.6], [6.85, 19.59], [6.03, 20.73], [5.02, 21.7], [3.86, 22.5], [2.59, 23.08], [1.51, 23.38],
  [1.36, 24.02], [1.03, 24.51], [0.56, 24.86], [-0.01, 25.02], [-0.6, 24.99], [-1.14, 24.75], [-1.57, 24.34], [-1.83, 23.81],
  [-1.89, 23.46], [-2.71, 23.18], [-4.01, 22.64], [-5.2, 21.89], [-6.24, 20.95], [-7.1, 19.84], [-7.77, 18.6], [-7.77, 18.1],
];
// Oostvleugel (BAG-contour, rechte stukken).
const WING = [[14.0, -18.61], [23.68, -18.61], [23.68, 7.48], [21.68, 7.48], [21.68, 8.23], [14.0, 8.23]];
const WING_NORTH = [[14.0, 8.0], [18.08, 8.0], [18.08, 17.98], [14.0, 18.4]];
// Loopbrug naar De Doelen (BAG-deel -1: u 5,1-8,0, tot v -25,84).
const BRIDGE = { x0: 8.2, x1: 11.13, y1: -28.98 };

// ---------- hulpfuncties ----------
const NICHE = 0.35;
// Blinde nis in een gevel: vlak door `o` met buitennormaal `n`; `t` langs de
// gevel (n 90 graden linksom gedraaid), breedte w, NAP-hoogtes nap0..nap1.
const niche = (o, n, t, w, nap0, nap1, depth = NICHE, out = 1.2) =>
  box(-depth, t - w / 2, z(nap0), out, t + w / 2, z(nap1))
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([o[0], o[1], 0]);
const S = [0, -1];
const N = [0, 1];
const E = [1, 0];
const W = [-1, 0];
// Erker als boogsegment (9 facetten) voor de gevel op y = side * HY.
const bayPoly = (side, grow = 0, inset = 0.6) => {
  const r = BAY_R + grow;
  const cy = HY + BAY.out - BAY_R; // middelpunt binnen de romp
  const a = Math.asin(Math.min(1, (BAY.half + grow) / r));
  const pts = [];
  const n = 9;
  for (let k = 0; k <= n; k++) {
    const t = -a + (2 * a * k) / n;
    pts.push([r * Math.sin(t), cy + r * Math.cos(t)]);
  }
  // sluit binnen de romp
  pts.push([pts[n][0], HY - inset], [pts[0][0], HY - inset]);
  return pts.map(([x, y]) => [x, side * y]);
};

// ---------- romp ----------
const parts = [];
const cuts = [];
// Onderbouw en hoekblokken: de volle rechthoek tot +103,1.
parts.push(box(-HX, -HY, BASE, HX, HY, z(H.corner)));
// Lange gevels tot +113,3 tussen de hoekzones.
parts.push(box(-HX, -YM, z(H.corner) - 0.01, HX, YM, z(H.strip)));
// Glazen mansarde: vlakken van de lange gevels (op +113,3) naar de dakrand.
parts.push(hull([
  [-HX, -YM, z(H.strip) - 0.01], [HX, -YM, z(H.strip) - 0.01], [HX, YM, z(H.strip) - 0.01], [-HX, YM, z(H.strip) - 0.01],
  [-RX, -YM, z(H.roof)], [RX, -YM, z(H.roof)], [RX, YM, z(H.roof)], [-RX, YM, z(H.roof)],
]));
// Trapezium van de smalle gevels tussen de hoekblokken: steile schuine
// zijkanten van ±12,0 op +103,1 naar ±8,8 op het dak.
for (const s of [-1, 1]) {
  const y0 = s * (YM - 0.01);
  const y1 = s * HY;
  parts.push(hull([
    [-TX0, y0, z(H.corner) - 0.01], [TX0, y0, z(H.corner) - 0.01], [TX0, y1, z(H.corner) - 0.01], [-TX0, y1, z(H.corner) - 0.01],
    [-RX, y0, z(H.roof)], [RX, y0, z(H.roof)], [RX, y1, z(H.roof)], [-RX, y1, z(H.roof)],
  ]));
}

// ---------- gevelreliëf van de romp ----------
// Smalle gevels (per kant vanaf de erker): pijler 4,0-5,2, vensterkolom
// 5,2-8,2, pijler, vensterkolom 9,3-12,3, hoekpijler 12,3-14,3 (foto's).
const NARROW_COLS = [[5.2, 8.2], [9.3, 12.3]];
// Lange gevels: 7 vensterkolommen van 2,6 m op 3,66 m in het middendeel en
// per hoekzone één kolom (13,3-16,0) naast de hoekpijler van 2 m.
const LONG_COLS = [-3, -2, -1, 0, 1, 2, 3].map((k) => [k * 3.66 - 1.3, k * 3.66 + 1.3]).concat([[13.3, 16.0], [-16.0, -13.3]]);
const storeyNiche = (j) => [f(j) + (isBand(j) ? 1.3 : 0.5), f(j + 1)];
for (const s of [-1, 1]) {
  const face = [0, s * HY];
  const n = s > 0 ? N : S;
  for (const [a, b] of NARROW_COLS) {
    for (const sx of [-1, 1]) {
      // t loopt langs de gevel: voor de noordgevel (n = +y) is t = -x.
      const t = -s * sx * ((a + b) / 2);
      const outer = a > 9;
      const top = outer ? 27 : 34; // buitenkolom tot het hoekblok, binnenkolom tot onder het dak
      for (let j = 0; j < top; j++) {
        // Noordgevel: onderste laag achter het entreepaviljoen (x -7,8..7,4) blijft dicht.
        if (s > 0 && j === 0 && (a + b) / 2 < 8) continue;
        const [n0, n1] = j < STOREYS ? storeyNiche(j) : [f(j) + 0.5, Math.min(f(j + 1), H.roof - 0.8)];
        cuts.push(niche(face, n, t, b - a, n0, n1));
      }
      // Dubbelhoge onderbouw: pui en eerste verdieping.
      if (!(s > 0 && (a + b) / 2 < 8)) {
        cuts.push(niche(face, n, t, b - a, -0.2, 5.0, 0.4), niche(face, n, t, b - a, 6.0, 10.6, 0.4));
      }
    }
  }
}
for (const s of [-1, 1]) {
  const face = [s * HX, 0];
  const n = s > 0 ? E : W;
  for (const [a, b] of LONG_COLS) {
    const corner = Math.abs(a) > 13;
    const t = s * ((a + b) / 2); // oostgevel (n = +x): t = +y
    const last = corner ? 27 : STOREYS;
    // Oostgevel: de vleugel bedekt de onderste lagen tot +17,5.
    const first = s > 0 ? 2 : 0;
    for (let j = first; j < last; j++) {
      const [n0, n1] = storeyNiche(j);
      cuts.push(niche(face, n, t, b - a, n0, n1));
    }
    if (s < 0) cuts.push(niche(face, n, t, b - a, -0.2, 5.0, 0.4), niche(face, n, t, b - a, 6.0, 10.6, 0.4));
  }
}
// Glasvelden in de mansarde: per laag en per kolom 0,3 m loodrecht op het vlak.
{
  const zs = z(H.strip);
  const zr = z(H.roof);
  const run = HX - RX;
  const len = Math.hypot(run, zr - zs);
  const nrm = [(zr - zs) / len, run / len]; // buitennormaal in (x, z) voor +x
  const xAt = (zz) => HX - ((zz - zs) * run) / (zr - zs);
  const panel = (sx, y0, y1, nap0, nap1, depth = 0.3) => {
    const pts = [];
    for (const nap of [nap0, nap1]) {
      const zz = z(nap);
      const x = xAt(zz);
      for (const d of [-depth, 1.0]) for (const y of [y0, y1]) pts.push([sx * (x + nrm[0] * d), y, zz + nrm[1] * d]);
    }
    return hull(pts);
  };
  for (const sx of [-1, 1]) {
    for (const [a, b] of LONG_COLS.slice(0, 7)) {
      for (const [n0, n1] of [[113.8, 116.7], [117.2, 120.1], [120.6, 123.5], [124.0, 125.8]]) cuts.push(panel(sx, a, b, n0, n1));
    }
  }
}
let shaft = union(parts).subtract(union(cuts));

// ---------- erkers ----------
const bays = [];
for (const s of [-1, 1]) {
  let bay = prism(bayPoly(s), z(H.lobby), z(H.bayTop));
  // Glasregels per laag: groef van 0,3 m, alleen buiten het gevelvlak.
  const outside = box(-BAY.half - 1, s > 0 ? HY + 0.001 : -HY - 3, z(H.lobby), BAY.half + 1, s > 0 ? HY + 3 : -HY - 0.001, z(H.bayTop));
  const grooves = [];
  const ring = (nap0, nap1, depth) => prism(bayPoly(s, 2), z(nap0), z(nap1)).subtract(prism(bayPoly(s, -depth, 2), z(nap0) - 1, z(nap1) + 1));
  for (let j = 1; j < 31; j++) if (!isBand(j) && f(j) < H.bayTop - 0.6) grooves.push(ring(f(j) - 0.2, f(j) + 0.2, 0.3));
  // Verticale stijlen tussen de facetten: smalle groeven op de facetranden.
  bay = bay.subtract(union(grooves).intersect(outside));
  // Stenen ringen op de banden en een kap bovenop: 0,4 m uitkragend met een
  // schuine onderkant van 45 graden.
  const rings = [];
  for (let j = 4; j <= 28; j += 4) {
    const z0 = z(f(j));
    rings.push(hull([...bayPoly(s, 0).map(([x, y]) => [x, y, z0 - 0.4]), ...bayPoly(s, 0.4).map(([x, y]) => [x, y, z0]), ...bayPoly(s, 0.4).map(([x, y]) => [x, y, z0 + 0.8])]));
  }
  {
    const z0 = z(H.bayTop) - 1.0;
    rings.push(hull([...bayPoly(s, 0).map(([x, y]) => [x, y, z0 - 0.4]), ...bayPoly(s, 0.4).map(([x, y]) => [x, y, z0]), ...bayPoly(s, 0.4).map(([x, y]) => [x, y, z(H.bayTop)])]));
  }
  bays.push(bay, union(rings));
}

// ---------- dakopbouwen ----------
const roofParts = [];
for (const s of [-1, 1]) {
  for (const sx of [-1, 1]) {
    const [x0, x1] = sx > 0 ? [PYLON.x0, PYLON.x1] : [-PYLON.x1, -PYLON.x0];
    const [y0, y1] = s > 0 ? [HY - PYLON.depth, HY] : [-HY, -HY + PYLON.depth];
    let p = box(x0, y0, z(H.roof) - 0.01, x1, y1, z(H.pylon));
    // Glasstrook in de pylon aan de gevelkant.
    p = p.subtract(box(x0 + 0.45, s > 0 ? HY - 0.3 : -HY - 1, z(H.roof) + 0.5, x1 - 0.45, s > 0 ? HY + 1 : -HY + 0.3, z(H.pylon) - 0.6));
    roofParts.push(p);
  }
}
// Langsschermen tussen de pylonen en twee installatieblokken daartussen.
for (const sx of [-1, 1]) roofParts.push(box(sx * 3.2 - 0.45, -HY + PYLON.depth - 0.01, z(H.roof) - 0.01, sx * 3.2 + 0.45, HY - PYLON.depth + 0.01, z(H.rail)));
for (const s of [-1, 1]) roofParts.push(box(-2.8, s > 0 ? 4.5 : -13.5, z(H.roof) - 0.01, 2.8, s > 0 ? 13.5 : -4.5, z(H.plant)));
// Vakwerkmast aan de noordkant tussen de pylonen: brede voet, smaller
// middendeel en de antenne.
{
  const sq = (h, nap) => [[-h, MAST.y - h, z(nap)], [h, MAST.y - h, z(nap)], [h, MAST.y + h, z(nap)], [-h, MAST.y + h, z(nap)]];
  roofParts.push(hull([...sq(MAST.base / 2, H.roof - 0.01), ...sq(MAST.low / 2, H.mastLow)]));
  roofParts.push(hull([...sq(MAST.mid / 2, H.mastLow - 0.01), ...sq(MAST.needle / 2 + 0.05, H.mastMid)]));
  roofParts.push(box(-MAST.needle / 2, MAST.y - MAST.needle / 2, z(H.mastMid) - 0.01, MAST.needle / 2, MAST.y + MAST.needle / 2, z(H.mastTop)));
}

// ---------- voet: paviljoen, oostvleugel, loopbrug ----------
const foot = [];
{
  let pav = prism(PAVILION, BASE, z(H.pavilion));
  // Glazen pui: drie lagen glas tussen een stenen dakrand.
  const glass = prism(new CrossSection([ccw(PAVILION)]).offset(2, "Miter").toPolygons()[0], z(0.3), z(H.pavilion - 1.4)).subtract(
    prism(new CrossSection([ccw(PAVILION)]).offset(-0.35, "Miter").toPolygons()[0], z(0), z(H.pavilion)),
  );
  pav = pav.subtract(glass.intersect(box(-20, HY + 0.01, BASE, 20, HY + 10, z(20))));
  foot.push(pav);
}
{
  let wing = prism(WING, BASE, z(H.wing));
  const q = [];
  // Ramen in de oost- en zuidgevel van de vleugel: vier lagen.
  for (const [n0, n1] of [[0.0, 3.6], [4.9, 7.6], [8.9, 11.6], [12.9, 15.6]]) {
    for (let y = -16.3; y < 6.5; y += 3.3) q.push(niche([23.68, 0], E, y, 2.2, n0, n1));
    for (let x = 16.2; x < 22.8; x += 3.3) q.push(niche([0, -18.61], S, x, 2.2, n0, n1));
  }
  wing = wing.subtract(union(q));
  foot.push(wing, prism(WING_NORTH, BASE, z(H.wingNorth)));
}
{
  let bridge = box(BRIDGE.x0, BRIDGE.y1, z(H.bridgeBottom), BRIDGE.x1, -HY + 0.5, z(H.bridgeTop));
  // Glasband over de lengte van beide zijgevels van de brug.
  bridge = bridge.subtract(box(BRIDGE.x0 - 1, BRIDGE.y1 + 0.6, z(7.6), BRIDGE.x0 + 0.3, -HY - 0.3, z(10.2)));
  bridge = bridge.subtract(box(BRIDGE.x1 - 0.3, BRIDGE.y1 + 0.6, z(7.6), BRIDGE.x1 + 1, -HY - 0.3, z(10.2)));
  foot.push(bridge);
}

let model = union([shaft, ...bays, ...roofParts, ...foot]);
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Millenniumtoren met erkers mansarde pylonen mast paviljoen vleugel en loopbrug", model]],
  catalog: {
    name: "Millenniumtoren",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straat aan de westkant en aan het Weena (AHN-DTM NAP -0,5 tot -0,75).
    groundSamplePoints: [[-18, -10], [-18, 10], [-12, 22], [12, 22]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000689030"],
    description:
      "Oorsprong in het hart van de romp op straatniveau NAP -0,7 m, +X op 17,5 graden in RD langs de smalle gevels, +Y naar het noordnoordwesten (Weena); romp 28,6 x 37,2 m met hoekblokken tot NAP +103,1, lange gevels tot +113,3 en een glazen mansarde van 67 graden tot het platte dak op +126,5, gebogen glazen erkers tot +116,8 op beide smalle gevels, pylonen tot +130,3 en vakwerkmast tot +148,4; entreepaviljoen +13,0, oostvleugel +17,5 en loopbrug naar De Doelen; gevelritme en mastgeleding uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      cornerNapM: H.corner,
      stripNapM: H.strip,
      roofNapM: H.roof,
      bayTopNapM: H.bayTop,
      pylonNapM: H.pylon,
      mastTopNapM: H.mastTop,
      pavilionNapM: H.pavilion,
      wingNapM: H.wing,
      shaftM: [+(2 * HX).toFixed(2), +(2 * HY).toFixed(2)],
      storeyPitchM: P,
      mansardDegrees: +((Math.atan2(H.roof - H.strip, HX - RX) * 180) / Math.PI).toFixed(1),
      axisDegrees: AXIS_DEG,
      estimates: [
        "mansarde als glasvlak van de gevel op +113,3 naar de dakrand: het AHN ziet onder het glas een vlak op +113,3 en het dak vanaf 5,5 m binnen de gevel; de helling volgt uit de foto's",
        "zijkanten van het trapezium op de smalle gevels (82 graden) uit de AHN-overgang bij de noordgevel en een frontale foto; zuidkant gespiegeld (AHN daar verstoord)",
        "verdiepingsteek 3,4 m (30 lagen tussen +11,3 en +113,3), bredere band elke vierde laag, vensterkolommen en pijlers uit frontale foto's",
        "erker: koorde 8 m, 1,7 m voor de gevel, onderkant op +11,3, ringen op de banden",
        "mast: voet 1,8 m tot +135,5, middendeel 1,0 m tot +141, antenne 0,9 m tot de Wikipedia-hoogte; het AHN ziet het vakwerk niet",
        "loopbrug: onderkant +6,5 (eerste verdieping) geschat; installaties en langsschermen op het dak uit 3D BAG en AHN-ruggen",
      ],
    },
    sources: [
      "PDOK BAG pand 0599100000689030, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000689030 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): hoogtes van hoekblokken, stroken, dak, pylonen, erkertop, paviljoen, vleugel en loopbrug",
      "https://nl.wikipedia.org/wiki/Millenniumtoren_(Rotterdam)",
      "https://en.wikipedia.org/wiki/Millennium_Tower_(Rotterdam)",
      "https://commons.wikimedia.org/wiki/File:Millennium_Tower_aan_het_Weena_in_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Millenniumtoren_in_Rotterdam,_2005_01.jpg",
      "https://commons.wikimedia.org/wiki/File:Millenniumtoren_in_Rotterdam,_2005_02.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_Millenium_Tower_3.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_toren_millenniumtoren2.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_Weena_-_View_SSE_on_Milleniumtower_2000_Webb,_Zerafa,_Menkes,_Housden_Partnership_-_131,85_m_high_(141_with_Pylon).jpg",
    ],
  },
});

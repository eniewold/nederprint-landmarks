// Delftse Poort (Weena 505, Rotterdam; Abe Bonnema, 1991): het kantoorcomplex
// van Nationale-Nederlanden naast Rotterdam Centraal. Twee schijven van
// spiegelglas op een plint van vier lagen: toren I (41 lagen, dak NAP +149,3 m,
// tot 2009 het hoogste gebouw van Nederland) met ervoor een verspringende
// lagere schijf tot +69,4 m, en toren II (25 lagen, +91,75 m) met aan de
// Weenakant een L-vormig blok tot +44,3 m op een zuilengalerij en voor de
// zuidwesthoek een taps toelopende wig van zwart graniet; een slankere tweede
// wig staat op de plint voor de zuidoosthoek van toren I. Op de plint staan een
// glazen blok tot +35,25 m en een koepel. Vlakken en benoemde bouwdelen in een
// eigen gebouwstelsel, geen gestapelde DSM-lagen. Voorbeeld per rij:
// generate-evoluon.mjs (aanpak primitieven), generate-haagse-toren.mjs en
// generate-zalmhaven.mjs (skylinetorens op efteling-kit.mjs).
//
//   node scripts/generate-delftse-poort.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong midden op de plint (tussen koepel en glazen blok) op
// RD (92050, 437680), z = 0 op NAP -0,7 m (het Weena, AHN-DTM -0,75 tot -0,65;
// Stationsplein -0,4, noordzijde -0,3), Z omhoog. +X loopt langs de gevels op
// 17,5 graden in RD (BAG-gevels 17,495 graden), +Y naar het noordnoordwesten
// (spoorzijde). Het Weena ligt aan -Y, het Stationsplein aan -X, het
// Delftseplein aan +X.
//
// Bronnen: BAG-pand 0599100000701251 (het hele complex: beide torens, plint en
// koepel), AHN DSM/DTM 0,5 m (PDOK WCS, per 0,5 m in dit stelsel uitgelezen:
// dakhoogtes, gevellijnen, koepelfit), 3D BAG LoD2.2 (TU Delft/3D
// geoinformatie, CC BY 4.0: dakhoogtes 149,3/150,4, 91,75/92,9, 69,4/70,0,
// 44,3/44,9, 35,25/35,9, 15,95 en 10,85 en de dakopbouwen), Actueel_orthoHR en
// de jaarorthofoto's 2021-2024, Wikipedia (151,35 m, 41 en 25 lagen, plint van
// vier lagen) en Commons-foto's van alle kanten (gevelraster, roosterbanden,
// granieten wig, zuilengalerij). De daken zijn plat (AHN binnen 0,1 m, 3D BAG
// helling 0,0 graden): de "afgeschuinde koppen" uit de opdracht zijn het
// verspringen van de schijven, geen schuine dakvlakken.
import { CrossSection, Manifold, box, prism, hull, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "delftse-poort";
const ORIGIN = [92050.0, 437680.0];
const AXIS_DEG = 17.5;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = -0.7;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  low: 10.9, // lage randstroken van de plint (west, noord, oost)
  plinth: 15.95, // plint van vier lagen
  office0: 16.6, // eerste kantoorvloer boven de plint
  towerI: 149.3, // dak toren I
  towerIRim: 150.4, // dakrand toren I (noord, oost en west; AHN 150,3-150,8)
  slabI: 69.4, // lagere schijf voor toren I
  slabIRim: 70.0,
  towerII: 91.75, // dak toren II
  towerIIRim: 92.9, // verhoogde dakrand toren II (zuid en west)
  weena: 44.3, // L-blok aan het Weena
  weenaRim: 44.9,
  glass: 35.25, // glazen blok op de plint
  glassRim: 35.9,
  wedge: 58.0, // top van de granieten wig van toren II (foto's, geschat)
  wedgeI: 55.0, // top van de slanke wig van toren I (foto's, geschat)
  arcade: 9.0, // plafond van de zuilengalerij aan het Weena (foto's, geschat)
  entrance: 4.4, // plafond van de terugliggende entree onder toren II
};
const GRID = 3.6; // gevelraster: stijlen en verdiepingsbanden per 3,6 m (het spiegelglas heeft vakken van 1,8 m;
// een raster van 1,8 m gaf 240.000 driehoeken en een GLB van 11 MB)
const NICHE = 0.3;

// ---------- plattegrond (m, gebouwstelsel) ----------
// BAG-contour van pand 0599100000701251 (buitenrand van de plint op maaiveld).
const BAG = [
  [-56.92, -32.67], [-54.27, -31.28], [-54.28, -34.07], [-55.28, -34.07], [-55.29, -42.83], [-51.88, -42.78],
  [-51.86, -41.81], [-50.45, -41.77], [-32.66, -41.96], [-32.66, -49.17], [-13.03, -49.16], [-13.22, -50.27],
  [46.19, -50.28], [46.25, 39.6], [-48.87, 39.65],
];
// Plint van vier lagen (+15,95). De westgevel is een boog (AHN-rand: middelpunt
// (12,8, -4,5), straal 63,9 m) om de koepel heen; daarbuiten de lage strook.
const ARC = { c: [12.8, -4.5], r: 63.9, v0: 25, v1: -26.6 };
const arcPts = [];
for (let v = ARC.v0; v >= ARC.v1 - 1e-9; v -= 2.6) arcPts.push([+(ARC.c[0] - Math.sqrt(ARC.r ** 2 - (v - ARC.c[1]) ** 2)).toFixed(2), +v.toFixed(2)]);
const PLINTH = [[-44.6, -29.0], [2.0, -29.0], [2.0, -35.2], [43.4, -35.2], [43.4, 36.1], [-36.2, 36.1], [-40.6, 30.8], [-43.8, 29.6], ...arcPts];
// Toren I (AHN-dakrand) en de lagere schijf ervoor, 32 m naar het westen en
// 8 m naar het zuiden verschoven.
const TOWER_I = [-11.0, 23.5, 45.5, 39.6];
const SLAB_I = [-43.5, 15.3, 12.2, 31.1];
// Toren II: het westelijke deel van de zuidgevel ligt 1,3 m terug (AHN -43,1
// en -44,4), een verspringing boven het L-blok.
const TOWER_II = [[-55.3, -28.2], [-55.3, -43.1], [-32.7, -43.1], [-32.7, -44.4], [2.9, -44.4], [2.9, -28.2]];
// L-blok aan het Weena: strook langs de straat (met een verspringing van 1,1 m
// op u = -13, BAG) en het oostdeel tegen toren II; loopt 1,0 m toren II in (meer dan twee groefdiepten, anders sluiten de groeven van beide een holte in).
const WEENA = [[-32.7, -43.4], [-32.7, -49.2], [-13.0, -49.2], [-13.0, -50.3], [44.4, -50.3], [44.4, -34.5], [2.8, -34.5], [2.8, -43.4]];
// Glazen blok op de plint (oostrand 0,4 m binnen de plintgevel).
const GLASS = [11.5, -20.5, 43.0, 8.9];
// Koepel: bolfit op 1355 AHN-punten boven de plint.
const DOME = { c: [-32.7, -5.45], zc: 11.17, r: 11.7, oculus: 2.6 };
// Granieten wig voor de zuidwesthoek van toren II, vlak met de westgevel; aan
// de voet 7,0 m breed en 5,1 m voor de gevel (begrensd door de AHN-punten op het
// Weena), boven 4,5 m breed en 1,9 m diep (foto's).
const WEDGE = { u0: -55.3, foot: [-48.3, -48.2], top: [-50.8, -45.0] };
// Tweede, slankere granieten wig voor de zuidoosthoek van toren I, vlak met de
// oostgevel (u = 45,5) en op de plint. Het AHN heeft daar een gat van
// 2,5 x 3,5 m (u 42,5-45, v 19-22,5, geen punten van het zwarte graniet); op
// plinthoogte (+15,95) 3,2 m breed en 4,6 m voor de zuidgevel, boven 1,5 m
// breed en 1,7 m diep (foto's vanaf het Weena en het Stationsplein).
const WEDGE_I = { u1: 45.5, face: 23.5, plinth: { u0: 42.3, v0: 18.9 }, top: { u0: 44.0, v0: 21.8 } };
// Zuilengalerij onder het L-blok aan het Weena: 3 m diep, zuilen van 1,2 m.
const ARCADE = { depth: 3.0, col: 0.6, u0: -31.9, u1: 45.4, n: 11 };
// Roosterbanden (installatieroosters) in de zuidgevels, 0,6 m diep.
const LOUVRE_I = { u: [15.4, 40.7], nap: [139.4, 145.7] };
const LOUVRE_II = [
  { u: [-50.3, -33.7], v: -43.1, nap: [81.0, 88.1] },
  { u: [-31.7, -23.3], v: -44.4, nap: [81.0, 88.1] },
];
// Glazen driehoek in het plintdak (ortho), als ondiepe nis.
const SKYLIGHT = [[-5.6, -6.4], [-21.6, -15.2], [-9.2, -24.4]];

// ---------- hulpfuncties ----------
const boxR = ([x0, y0, x1, y1], zz0, zz1) => box(x0, y0, zz0, x1, y1, zz1);
const rectPoly = ([x0, y0, x1, y1]) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
// Blinde groef in de gevel a->b (buitenkant rechts van de looprichting, dus
// tegen de klok in rond een veelhoek): s0..s1 vanaf a, NAP-hoogtes, diepte in
// de gevel en `out` naar buiten.
const groove = (a, b, s0, s1, nap0, nap1, depth = NICHE, out = 1.2) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  const n = [dy / len, -dx / len];
  return box(-depth, s0, z(nap0), out, s1, z(nap1))
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([a[0], a[1], 0]);
};
// Gevelraster rond een veelhoek: verticale stijlen (0,4 m breed) en
// verdiepingsbanden (0,5 m hoog) per GRID, groeven van 0,3 m diep. De hoeken
// blijven `margin` vrij (lisenen).
function facadeGrid(poly, nap0, nap1, { margin = 1.0, minLen = 4, floor0 = H.office0 } = {}) {
  const P = ccw(poly);
  const out = [];
  for (let i = 0; i < P.length; i++) {
    const a = P[i];
    const b = P[(i + 1) % P.length];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (len < minLen) continue;
    const n = Math.floor((len - 2 * margin) / GRID);
    const s0 = (len - n * GRID) / 2;
    for (let k = 0; k <= n; k++) {
      const s = s0 + k * GRID;
      out.push(groove(a, b, s - 0.2, s + 0.2, nap0 + 0.4, nap1 - 0.7));
    }
    const kMin = Math.ceil((nap0 + 0.5 - floor0) / GRID);
    for (let k = kMin; floor0 + k * GRID < nap1 - 0.9; k++) {
      const f = floor0 + k * GRID;
      out.push(groove(a, b, margin, len - margin, f - 0.25, f + 0.25));
    }
  }
  return out;
}
// Volume met zijn eigen gevelraster; de groeven die in een buurvolume vallen,
// vult de vereniging later weer op.
const withGrid = (solid, poly, nap0, nap1, opts) => solid.subtract(union(facadeGrid(poly, nap0, nap1, opts)));

const parts = [];
const cuts = [];

// ---------- plint ----------
// Lage plint op de BAG-contour, 0,45 m ingesprongen zodat de torengevels die op
// de BAG-rand staan vrij blijven; drie lagen (+10,9).
{
  const inset = new CrossSection([ccw(BAG)]).offset(-0.45, "Miter").toPolygons()[0];
  parts.push(withGrid(prism(inset, BASE, z(H.low)), inset, GROUND_NAP + 0.6, H.low, { margin: 0.6, floor0: H.low - 2 * GRID }));
}
// Plint van vier lagen met de boogvormige glasgevel om de koepel.
parts.push(withGrid(prism(PLINTH, BASE, z(H.plinth)), PLINTH, H.low, H.plinth, { margin: 0.2, minLen: 2 }));

// ---------- toren I en de lagere schijf ----------
parts.push(withGrid(boxR(TOWER_I, BASE, z(H.towerI)), rectPoly(TOWER_I), GROUND_NAP + 0.6, H.towerI));
{
  const [u0, v0, u1, v1] = TOWER_I;
  // Dakrand op de noord-, oost- en westzijde (1 m breed).
  parts.push(box(u0, v1 - 1.0, z(H.towerI) - 0.01, u1, v1, z(H.towerIRim)));
  parts.push(box(u1 - 1.0, v0, z(H.towerI) - 0.01, u1, v1, z(H.towerIRim)));
  parts.push(box(u0, v0, z(H.towerI) - 0.01, u0 + 1.0, v1, z(H.towerIRim)));
  // Dakopbouwen (3D BAG en AHN): voet van de in 2012 verwijderde mast met een
  // paal, twee rails van de gevelonderhoudsinstallatie, koelunits.
  parts.push(box(-8.6, 28.8, z(H.towerI) - 0.01, -5.0, 31.2, z(151.6)));
  parts.push(box(-7.6, 29.4, z(151.6) - 0.01, -6.4, 30.6, z(154.0)));
  parts.push(box(-2.6, 29.1, z(H.towerI) - 0.01, 1.0, 32.6, z(150.8)));
  parts.push(box(15.0, 26.7, z(H.towerI) - 0.01, 16.6, 34.4, z(150.6)));
  parts.push(box(28.0, 27.1, z(H.towerI) - 0.01, 29.6, 34.8, z(150.6)));
  parts.push(box(20.5, 27.8, z(H.towerI) - 0.01, 27.0, 34.2, z(150.6)));
  parts.push(box(31.1, 29.1, z(H.towerI) - 0.01, 36.3, 33.2, z(150.7)));
  parts.push(box(39.4, 32.8, z(H.towerI) - 0.01, 40.6, 34.2, z(152.8)));
}
parts.push(withGrid(boxR(SLAB_I, BASE, z(H.slabI)), rectPoly(SLAB_I), H.plinth, H.slabI));
{
  const [u0, v0, , v1] = SLAB_I;
  const u1 = SLAB_I[2];
  // Dakrand op de zuid- en westzijde (3D BAG 70,0) en een trappenhuiskop.
  parts.push(box(u0, v0, z(H.slabI) - 0.01, u1, v0 + 1.2, z(H.slabIRim)));
  parts.push(box(u0, v0, z(H.slabI) - 0.01, u0 + 1.2, v1, z(H.slabIRim)));
  parts.push(box(-15.6, 22.0, z(H.slabI) - 0.01, -13.0, 26.2, z(72.3)));
}

// ---------- toren II, het L-blok en de wig ----------
parts.push(withGrid(prism(TOWER_II, BASE, z(H.towerII)), TOWER_II, H.plinth, H.towerII));
{
  // Verhoogde dakrand: zuidzijde (tot v = -41) en westzijde 1 m.
  const rim = prism([[-55.3, -41.0], [-55.3, -43.1], [-32.7, -43.1], [-32.7, -44.4], [2.9, -44.4], [2.9, -41.0]], z(H.towerII) - 0.01, z(H.towerIIRim));
  parts.push(rim, box(-55.3, -43.1, z(H.towerII) - 0.01, -54.3, -28.2, z(H.towerIIRim)));
  // Dakopbouwen (AHN 93-94): koelunits, twee rails, technische ruimte.
  parts.push(box(-47.5, -38.3, z(H.towerII) - 0.01, -43.0, -32.5, z(93.6)));
  parts.push(box(-39.2, -38.0, z(H.towerII) - 0.01, -38.0, -30.5, z(93.3)));
  parts.push(box(-25.2, -38.0, z(H.towerII) - 0.01, -24.0, -30.5, z(93.3)));
  parts.push(box(-12.0, -36.0, z(H.towerII) - 0.01, -6.5, -32.0, z(93.8)));
}
parts.push(withGrid(prism(WEENA, BASE, z(H.weena)), WEENA, GROUND_NAP + 0.6, H.weena));
{
  // Verhoogde strook langs het Weena (3D BAG 44,9) en een dakopbouw (45,2).
  parts.push(prism([[-32.7, -48.4], [-32.7, -49.2], [-13.0, -49.2], [-13.0, -50.3], [44.4, -50.3], [44.4, -48.4]], z(H.weena) - 0.01, z(H.weenaRim)));
  parts.push(box(33.5, -45.9, z(H.weena) - 0.01, 41.2, -39.6, z(45.4)));
}

// ---------- glazen blok en koepel op de plint ----------
parts.push(withGrid(boxR(GLASS, BASE, z(H.glass)), rectPoly(GLASS), H.plinth, H.glass, { floor0: H.plinth }));
{
  const [u0, v0, u1, v1] = GLASS;
  parts.push(boxR(GLASS, z(H.glass) - 0.01, z(H.glassRim)).subtract(box(u0 + 1.2, v0 + 1.2, z(H.glass), u1 - 1.2, v1 - 1.2, z(H.glassRim) + 1)));
}
{
  const sphere = Manifold.sphere(DOME.r, 96).translate([DOME.c[0], DOME.c[1], z(DOME.zc)]);
  const cap = sphere.intersect(box(DOME.c[0] - 20, DOME.c[1] - 20, z(H.plinth) - 0.4, DOME.c[0] + 20, DOME.c[1] + 20, z(40)));
  parts.push(cap);
  // Glazen oculus in de top, 0,4 m verdiept.
  cuts.push(Manifold.cylinder(2, DOME.oculus, DOME.oculus, 48).translate([DOME.c[0], DOME.c[1], z(DOME.zc + DOME.r) - 0.4]));
}

// ---------- uitsparingen ----------
// Roosterbanden in de zuidgevels.
cuts.push(box(LOUVRE_I.u[0], TOWER_I[1] - 1.0, z(LOUVRE_I.nap[0]), LOUVRE_I.u[1], TOWER_I[1] + 0.6, z(LOUVRE_I.nap[1])));
for (const L of LOUVRE_II) cuts.push(box(L.u[0], L.v - 1.0, z(L.nap[0]), L.u[1], L.v + 0.6, z(L.nap[1])));
// Zuilengalerij langs het Weena (open aan beide koppen) en de terugliggende
// entree onder toren II naast de wig.
cuts.push(box(-33.7, -51.5, BASE - 1, -13.0, -49.2 + ARCADE.depth, z(H.arcade)));
cuts.push(box(-13.0, -51.5, BASE - 1, 47.5, -50.3 + ARCADE.depth, z(H.arcade)));
cuts.push(box(-48.0, -44.0, BASE - 1, -32.7, -41.8, z(H.entrance)));
// Glazen driehoek in het plintdak.
cuts.push(prism(SKYLIGHT, z(H.plinth) - 0.3, z(H.plinth) + 1));

let model = union(parts).subtract(union(cuts));
// Zuilen van de galerij.
{
  const cols = [];
  const pitch = (ARCADE.u1 - ARCADE.u0) / ARCADE.n;
  for (let k = 0; k <= ARCADE.n; k++) {
    const u = ARCADE.u0 + k * pitch;
    const v = (u < -13.0 ? -49.2 : -50.3) + 0.8;
    cols.push(Manifold.cylinder(z(H.arcade) - BASE + 0.02, ARCADE.col, ARCADE.col, 32).translate([u, v, BASE]));
  }
  model = union([model, ...cols]);
}
// Granieten wiggen: taps naar boven, vlak met de westgevel van toren II en de
// oostgevel van toren I. De slanke wig loopt lineair door tot de lage strook
// (+10,9) en daaronder recht naar beneden in de plint.
{
  const t = (z(H.plinth) - z(H.low)) / (z(H.wedgeI) - z(H.plinth));
  const lu = WEDGE_I.plinth.u0 - t * (WEDGE_I.top.u0 - WEDGE_I.plinth.u0);
  const lv = WEDGE_I.plinth.v0 - t * (WEDGE_I.top.v0 - WEDGE_I.plinth.v0);
  const back = WEDGE_I.face + 1.0;
  model = union([
    model,
    box(lu, lv, BASE, WEDGE_I.u1, back, z(H.low) + 0.01),
    hull([
      [lu, lv, z(H.low)], [WEDGE_I.u1, lv, z(H.low)], [WEDGE_I.u1, back, z(H.low)], [lu, back, z(H.low)],
      [WEDGE_I.top.u0, WEDGE_I.top.v0, z(H.wedgeI)], [WEDGE_I.u1, WEDGE_I.top.v0, z(H.wedgeI)], [WEDGE_I.u1, back, z(H.wedgeI)], [WEDGE_I.top.u0, back, z(H.wedgeI)],
    ]),
  ]);
}
model = union([
  model,
  hull([
    [WEDGE.u0, -42.0, BASE], [WEDGE.foot[0], -42.0, BASE], [WEDGE.foot[0], WEDGE.foot[1], BASE], [WEDGE.u0, WEDGE.foot[1], BASE],
    [WEDGE.u0, -42.0, z(H.wedge)], [WEDGE.top[0], -42.0, z(H.wedge)], [WEDGE.top[0], WEDGE.top[1], z(H.wedge)], [WEDGE.u0, WEDGE.top[1], z(H.wedge)],
  ]),
]);

if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 5);
console.log("ondervlakken > 5 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Delftse Poort met twee torens plint glazen blok koepel en granieten wiggen", model]],
  catalog: {
    name: "Delftse Poort",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Weena (zuid, AHN-DTM -0,75 tot -0,65), Stationsplein (west, -0,4),
    // spoorzijde (noord, -0,3) en Delftseplein (oost, -0,5); de lader neemt de
    // laagste, het Weena.
    groundSamplePoints: [[-20, -54], [20, -54], [-62, 0], [0, 43], [50, 0]],
    replacesBuildings: ["NL.IMBAG.Pand.0599100000701251"],
    description:
      "Oorsprong midden op de plint op straatniveau NAP -0,7 m (Weena), +X langs de gevels op 17,5 graden in RD, +Y naar de spoorzijde, het Weena aan -Y; toren I van 56,5 x 16,1 m tot NAP +149,3 m (rand +150,4) met de lagere schijf tot +69,4 m, toren II van 58,2 x 15-16 m tot +91,75 m (rand +92,9) met het L-blok aan het Weena tot +44,3 m op een zuilengalerij, plint van vier lagen (+15,95) met lage randstroken (+10,9), boogvormige westgevel, glazen blok (+35,25) en koepel, granieten wig voor de zuidwesthoek van toren II (tot +58 m) en een slankere voor de zuidoosthoek van toren I (tot +55 m); hoogtes uit AHN en 3D BAG, gevelraster, roosterbanden, wig en galerij uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      plinthNapM: H.plinth,
      lowStripNapM: H.low,
      towerINapM: H.towerI,
      towerIRimNapM: H.towerIRim,
      slabINapM: H.slabI,
      towerIINapM: H.towerII,
      towerIIRimNapM: H.towerIIRim,
      weenaBlockNapM: H.weena,
      glassBlockNapM: H.glass,
      domeTopNapM: +(DOME.zc + DOME.r).toFixed(2),
      wedgeTopNapM: H.wedge,
      wedgeITopNapM: H.wedgeI,
      towerIM: [+(TOWER_I[2] - TOWER_I[0]).toFixed(1), +(TOWER_I[3] - TOWER_I[1]).toFixed(1)],
      towerIIM: [58.2, 15.2],
      footprintM: [103.2, 89.9],
      facadeGridM: GRID,
      storeyPitchM: 3.6,
      axisDegrees: AXIS_DEG,
      estimates: [
        "gevelraster van 1,8 m (vierkante vakken, twee per laag van 3,6 m) uit foto's; verdiepingen uit Wikipedia (41 en 25 lagen, plint van vier)",
        "granieten wig van toren II: top NAP +58 m, voet 7,0 x 5,1 m, top 4,5 x 1,9 m uit foto's (het gepolijste graniet geeft geen AHN-punten)",
        "slanke granieten wig van toren I: top NAP +55 m, op plinthoogte 3,2 x 4,6 m (AHN-gat 2,5 x 3,5 m), top 1,5 x 1,7 m uit foto's vanaf het Weena en het Stationsplein",
        "roosterbanden in de zuidgevels (toren I u 15,4-40,7, +139,4..+145,7; toren II +81,0..+88,1) uit foto's",
        "zuilengalerij aan het Weena: 3 m diep tot NAP +9,0 m met 12 zuilen van 1,2 m uit foto's",
        "terugliggende entree onder toren II (BAG-contour 1,2 m achter de gevel) tot NAP +4,4 m",
      ],
    },
    sources: [
      "PDOK BAG pand 0599100000701251, AHN DSM/DTM 0,5 m (WCS), Actueel_orthoHR en 2021-2024_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000701251 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes en dakopbouwen",
      "https://nl.wikipedia.org/wiki/Delftse_Poort_(gebouw)",
      "https://en.wikipedia.org/wiki/Delftse_Poort",
      "https://commons.wikimedia.org/wiki/File:Kantorencomplex_Delftse_Poort.jpg",
      "https://commons.wikimedia.org/wiki/File:Delftse_Poort_October_2016.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_Weena_-_View_ENE_on_De_Delftse_Poort_1991_Abe_Bonnema_-_151.35_m_(164_with_Pylon).jpg",
      "https://commons.wikimedia.org/wiki/File:Centraal_Station_en_gebouw_Delftse_Poort_-_City_of_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Delftse_Poort_Skyscraper_Rotterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_-_Delftse_Poort.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_Delftse_Poort_Tower_1.jpg",
      "https://commons.wikimedia.org/wiki/File:Gebouw_Delftse_Poort,_Rotterdam.jpg",
    ],
  },
});

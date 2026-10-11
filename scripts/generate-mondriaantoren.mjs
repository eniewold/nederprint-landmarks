// Mondriaantoren (Amstelplein 6, Amsterdam; ZZ+P Architecten, ontwerp Peter
// Ellis, 2002): stenen kantoortoren van 31 lagen op de Omval, naast de
// Rembrandttoren. Een vierkante schacht met glazen hoeken tot NAP +106,5 m; op
// de noord- en zuidgevel een uitgebouwde stenen erker met het vierkante
// "Mondriaan"-raster tot +101; een middenschijf oost-west die aan de oostkant
// 5,6 m uit de schacht steekt (met een gelede glazen erker) en tot +117,35
// doorloopt met een stenen kroon met twee grote vensters; een glazen opbouw
// tot +120,6 aan de westkant van het dak met de gevelonderhoudsinstallatie;
// een westvleugel tot +92,3 met een trappenhuiskern tot +94,8 en een lage
// onderbouw tot +11,3. Vlakken en benoemde bouwdelen, geen gestapelde
// DSM-lagen. Voorbeeld per rij: generate-evoluon.mjs (aanpak primitieven),
// generate-rembrandttoren.mjs en generate-haagse-toren.mjs.
//
//   node scripts/generate-mondriaantoren.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het hart van de schacht op RD (122993,62,
// 484117,13), z = 0 op NAP +0,5 m (straat aan de oost- en zuidoostzijde), Z
// omhoog. +X loopt langs de lange as van de middenschijf naar het
// oostnoordoosten op 20,1 graden in RD (BAG-gevels 20,1/110,1 graden, dezelfde
// as als de Rembrandttoren), +Y naar het noordnoordwesten (Amstelplein). Het
// dek rond de toren ligt op NAP +1,9 tot +2,0 m, de straat aan de oostzijde op
// +0,5 tot +1,9 m.
//
// Bronnen: BAG-pand 0363100012097541 (voetafdruk, erker en ronde aanbouw aan
// de noordzijde), AHN DSM/DTM 0,5 m (PDOK WCS, in dit stelsel per 0,5-1 m
// uitgelezen: schacht, schijf, westvleugel, glazen opbouw, maaiveld), 3D BAG
// LoD2.2 (TU Delft/3D geoinformatie, CC BY 4.0, AHN-opname 2023: dakhoogtes
// 11,3/92,3/94,8/106,5/117,35/120,6/121,9/122,95 m en de omtrek van elk
// dakvlak), Actueel_orthoHR (zuidgevel, erker, dakopbouw, installatie),
// Wikipedia (31 lagen, 120 m) en Commons-foto's van alle kanten (gevelritme,
// raster, glazen erker, kroonvensters).
import { Manifold, box, hull, union, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "mondriaantoren";
const ORIGIN = [122993.62, 484117.13];
const AXIS_DEG = 20.1;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.5;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  deck: 2.0, // dek van het Amstelplein rond de toren (AHN-DTM 1,9-2,0)
  podium: 11.3, // lage onderbouw aan de westkant
  strip: 9.0, // smalle strook tegen het buurpand
  wing: 92.3, // westvleugel
  core: 94.8, // trappenhuiskern in de westvleugel
  bay: 101.0, // stenen rastererkers noord en zuid (3D BAG 97,3-101,9)
  shaft: 106.5, // schacht
  slab: 117.35, // middenschijf met kroon
  glass: 120.6, // glazen opbouw aan de westkant van het dak
  car: 121.9, // wagen van de gevelonderhoudsinstallatie
  carTop: 122.95, // bovenkant installatie (AHN 123)
};

// ---------- plattegrond (m, gebouwstelsel) ----------
const SHAFT = { x: 13.82, y: 13.1 }; // BAG: 27,6 x 26,2 m
const BAY = { x0: -8.4, x1: 8.78, depth: 1.84 }; // BAG-erker noordzijde, gespiegeld naar het zuiden
const SLAB = { x0: -7.75, x1: 19.41, y: 7.0, yLow: 7.5 }; // middenschijf; onder +106,5 is de oostkop 15 m breed (BAG)
const GLASS = { x0: -12.25, x1: -2.75, y0: -2.6, y1: 2.4 };
const WING = { x0: -24.4, x1: SHAFT.x * -1, y0: -7.55, y1: 7.45 };
const CORE = { x0: -26.6, x1: -18.05, y0: -5.0, y1: 4.75 };
const PODIUM = { x0: -37.81, x1: -26.6, y0: -7.45, y1: 7.32 };
const STRIP = { x0: -39.83, x1: -37.81, y0: -4.9, y1: 4.8 };
const DRUM = { c: [-5.25, 14.3], r: 1.9, top: 12.5 }; // ronde aanbouw aan de erker (BAG, AHN 12-19)
const ERKER = { half: 3.75, out: 1.2, segs: [[20.0, 41.0], [41.6, 62.0], [62.6, 83.0], [83.6, 104.0]] };

// Laagindeling: hal tot +6,2, daarna lagen van 3,55 m (28 lagen tot de
// schacht, nog drie in de schijf; Wikipedia 31 lagen).
const LOBBY = 6.2;
const FLOOR = 3.55;
const floorNap = (k) => LOBBY + FLOOR * k;
const NICHE = 0.35;

// ---------- hulpfuncties ----------
// Blinde nis in een gevel: p is het midden op het gevelvlak, n de buitennormaal;
// breedte w langs de gevel, hoogte nap0..nap1, diepte d. `out` is hoe ver de
// snijdoos voor de gevel uitsteekt.
const niche = (p, n, w, nap0, nap1, d = NICHE, out = 1.0) =>
  box(-d, -w / 2, z(nap0), out, w / 2, z(nap1))
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([p[0], p[1], 0]);
const N = [0, 1];
const S = [0, -1];
const E = [1, 0];
const W = [-1, 0];
// Punt op een gevel: as 'x' (gevel loodrecht op y) of 'y'.
const onY = (yFace, x) => [x, yFace];
const onX = (xFace, y) => [xFace, y];

const parts = [];
const cuts = [];

// ---------- massa ----------
// Schacht met glazen hoeken.
parts.push(box(-SHAFT.x, -SHAFT.y, BASE, SHAFT.x, SHAFT.y, z(H.shaft)));
// Rastererker noord: vanaf het maaiveld (BAG); zuid: vanaf de eerste laag
// met een ondervlak van 45 graden (de hal ligt terug, BAG zonder erker).
parts.push(box(BAY.x0, SHAFT.y - 0.05, BASE, BAY.x1, SHAFT.y + BAY.depth, z(H.bay)));
{
  const y0 = -SHAFT.y + 0.05;
  const y1 = -SHAFT.y - BAY.depth;
  const b = z(LOBBY);
  parts.push(
    hull([
      [BAY.x0, y0, b - BAY.depth - 0.05], [BAY.x1, y0, b - BAY.depth - 0.05],
      [BAY.x0, y1, b], [BAY.x1, y1, b],
      [BAY.x0, y0, z(H.bay)], [BAY.x1, y0, z(H.bay)], [BAY.x0, y1, z(H.bay)], [BAY.x1, y1, z(H.bay)],
    ]),
  );
}
// Ronde aanbouw tegen de noorderker.
parts.push(Manifold.cylinder(z(DRUM.top) - BASE, DRUM.r, DRUM.r, 32).translate([DRUM.c[0], DRUM.c[1], BASE]));
// Middenschijf: oostkop vanaf het maaiveld, 15 m breed tot de schachthoogte,
// daarboven 14 m breed tot de kroon.
parts.push(box(SHAFT.x - 0.05, -SLAB.yLow, BASE, SLAB.x1, SLAB.yLow, z(H.shaft)));
parts.push(box(SLAB.x0, -SLAB.y, z(H.shaft) - 0.05, SLAB.x1, SLAB.y, z(H.slab)));
// Gelede glazen erker in de oostkop: vier delen van zes lagen, elk met een
// ondervlak van 45 graden.
for (const [b, t] of ERKER.segs) {
  const x0 = SLAB.x1 - 0.05;
  const x1 = SLAB.x1 + ERKER.out;
  const h = ERKER.half;
  parts.push(
    hull([
      [x0, -h, z(b) - ERKER.out - 0.05], [x0, h, z(b) - ERKER.out - 0.05],
      [x1, -h, z(b)], [x1, h, z(b)],
      [x0, -h, z(t)], [x0, h, z(t)], [x1, -h, z(t)], [x1, h, z(t)],
    ]),
  );
}
// Glazen opbouw aan de westkant van het dak.
parts.push(box(GLASS.x0, GLASS.y0, z(H.shaft) - 0.05, GLASS.x1, GLASS.y1, z(H.glass)));
// Gevelonderhoudsinstallatie: wagen met kop (3D BAG 121,9 en 122,95) en de
// giek oost-west tot boven de glazen opbouw (foto's van het zuiden, 3D BAG
// 122,95 bij x = -8,6). De giek is een gesloten schot van 1 m op de opbouw en
// de wagen, zoals de giek van de Rembrandttoren: geen vrije overspanning.
parts.push(box(-3.3, -1.3, z(H.slab) - 0.05, 1.0, 1.5, z(H.car)));
parts.push(box(-1.3, -1.2, z(H.car) - 0.05, 1.0, 0.4, z(H.carTop)));
parts.push(box(-9.0, -0.5, z(H.glass) - 0.05, 1.0, 0.5, z(H.carTop)));
// Westvleugel met trappenhuiskern, lage onderbouw en strook.
parts.push(box(WING.x0, WING.y0, BASE, WING.x1 + 0.05, WING.y1, z(H.wing)));
parts.push(box(CORE.x0, CORE.y0, BASE, CORE.x1, CORE.y1, z(H.core)));
parts.push(box(PODIUM.x0, PODIUM.y0, BASE, PODIUM.x1 + 0.05, PODIUM.y1, z(H.podium)));
parts.push(box(STRIP.x0, STRIP.y0, BASE, STRIP.x1 + 0.05, STRIP.y1, z(H.strip)));

// ---------- gevelreliëf ----------
const rows = (kMax, kMin = 0) => Array.from({ length: kMax - kMin + 1 }, (_, i) => floorNap(kMin + i));

// Glazen hoeken van de schacht: per laag één glasvak tussen stenen penanten
// van 0,9 m (28 lagen) en een hoge hal.
const cornerFaces = [];
for (const s of [-1, 1]) {
  // noord- en zuidgevel naast de erker
  const yF = s * SHAFT.y;
  cornerFaces.push([onY(yF, (-SHAFT.x + BAY.x0) / 2), [0, s], BAY.x0 + SHAFT.x]);
  cornerFaces.push([onY(yF, (SHAFT.x + BAY.x1) / 2), [0, s], SHAFT.x - BAY.x1]);
  // oost- en westgevel naast de schijf en de westvleugel
  const xF = s * SHAFT.x;
  const inner = s > 0 ? SLAB.yLow : 7.5;
  cornerFaces.push([onX(xF, (-SHAFT.y - inner) / 2), [s, 0], SHAFT.y - inner]);
  cornerFaces.push([onX(xF, (SHAFT.y + inner) / 2), [s, 0], SHAFT.y - inner]);
}
for (const [p, n, width] of cornerFaces) {
  for (const f of rows(27)) cuts.push(niche(p, n, width - 1.8, f + 0.7, f + 3.25));
  // Op het dek ligt de hal; aan de oostkant loopt de straat tot NAP +0,5.
  cuts.push(niche(p, n, width - 1.8, H.deck + 0.3, LOBBY - 0.4));
}
// Rastererkers: het vierkante Mondriaan-raster, vier vakken per laag.
const bayCols = [-6.45, -2.15, 2.15, 6.45].map((t) => t + (BAY.x0 + BAY.x1) / 2);
for (const s of [-1, 1]) {
  const yF = s * (SHAFT.y + BAY.depth);
  // Achter de ronde aanbouw (noord, tot NAP +12,5) geen vensters.
  const hidden = (x, nap0) => s > 0 && nap0 < DRUM.top + 0.3 && Math.abs(x - DRUM.c[0]) < DRUM.r + 1.6;
  for (const f of rows(24)) for (const x of bayCols) if (!hidden(x, f)) cuts.push(niche(onY(yF, x), [0, s], 2.8, f + 0.75, f + 3.25));
  // Kopse kanten van de erker: smalle glasstrook per laag.
  for (const x of [BAY.x0, BAY.x1]) {
    const n = [Math.sign(x), 0];
    const minK = s > 0 ? 0 : 1;
    for (const f of rows(24, minK)) cuts.push(niche(onX(x, s * (SHAFT.y + BAY.depth / 2)), n, 0.9, f + 0.75, f + 3.25, 0.3, 0.4));
  }
  // Boven de erker nog één laag in het schachtvlak.
  for (const x of bayCols) cuts.push(niche(onY(s * SHAFT.y, x), [0, s], 2.8, floorNap(27) + 0.75, floorNap(27) + 3.1));
}
// Noordentree onder het raster: hoge glazen pui in de hal; zuid: hal onder
// het schuine ondervlak van de erker.
for (const x of bayCols) {
  if (Math.abs(x - DRUM.c[0]) > DRUM.r + 1.8) cuts.push(niche(onY(SHAFT.y + BAY.depth, x), N, 3.4, H.deck + 0.3, LOBBY - 0.4, 0.45));
  cuts.push(niche(onY(-SHAFT.y, x), S, 3.4, H.deck + 0.3, LOBBY - 2.3, 0.4, 0.6));
}
// Oostkop: stenen penanten met één venster per laag naast de glazen erker,
// en de zijgevels van de kop met een breed venster per laag.
for (const f of rows(27)) {
  for (const s of [-1, 1]) {
    cuts.push(niche(onX(SLAB.x1, s * 5.62), E, 1.6, f + 0.75, f + 3.0));
    cuts.push(niche(onY(s * SLAB.yLow, (SHAFT.x + SLAB.x1) / 2), [0, s], 3.0, f + 0.75, f + 3.0));
  }
}
for (const s of [-1, 1]) cuts.push(niche(onX(SLAB.x1, s * 5.62), E, 1.6, H.deck - 0.6, LOBBY - 0.4));
// Glazen erker: lagen als horizontale voegen en twee stijlen.
for (const [b, t] of ERKER.segs) {
  const xF = SLAB.x1 + ERKER.out;
  for (let f = b + 3.5; f < t - 0.5; f += 3.5) cuts.push(niche(onX(xF, 0), E, 2 * ERKER.half + 1, f, f + 0.3, 0.25, 0.4));
  for (const y of [-1.25, 1.25]) cuts.push(niche(onX(xF, y), E, 0.3, b + 0.3, t - 0.3, 0.25, 0.4));
}
// Kroon van de schijf: twee grote vierkante vensters in de oostgevel en aan
// het oosteinde van de noord- en zuidgevel, en een kroonlijst als voeg.
for (const s of [-1, 1]) {
  cuts.push(niche(onX(SLAB.x1, s * 2.6), E, 3.8, 109.6, 115.6, 0.45));
  for (const x of [12.2, 16.4]) cuts.push(niche(onY(s * SLAB.y, x), [0, s], 2.8, 109.6, 115.6, 0.45));
  // Venster boven het schachtdak aan de westkant van de schijf.
  cuts.push(niche(onX(SLAB.x0, s * 4.8), W, 3.0, 107.6, 115.6, 0.4));
}
// Glazen opbouw: stijlen op 1,5 m.
for (let t = GLASS.y0 + 0.9; t < GLASS.y1 - 0.5; t += 1.5) cuts.push(niche(onX(GLASS.x0, t + 0.0), W, 0.8, H.shaft + 0.6, H.glass - 0.5, 0.3));
for (const s of [-1, 1]) {
  const yF = s > 0 ? GLASS.y1 : GLASS.y0;
  for (let x = GLASS.x0 + 0.9; x < SLAB.x0 - 0.5; x += 1.5) cuts.push(niche(onY(yF, x), [0, s], 0.8, H.shaft + 0.6, H.glass - 0.5, 0.3));
}
// Schacht boven de westvleugel: drie vensters per laag.
for (const f of rows(27, 25)) for (const y of [-4.5, 0, 4.5]) cuts.push(niche(onX(-SHAFT.x, y), W, 2.0, f + 0.75, f + 3.0));
// Westvleugel: drie vensters per laag in de noord- en zuidgevel, glasvak in
// de hoeken naast de kern en drie vensters in de kern boven de onderbouw.
for (const f of rows(23)) {
  for (const s of [-1, 1]) {
    const yF = s > 0 ? WING.y1 : WING.y0;
    for (const x of [-21.6, -19.1, -16.6]) cuts.push(niche(onY(yF, x), [0, s], 1.6, f + 0.75, f + 3.0));
    if (f > H.podium) cuts.push(niche(onX(WING.x0, s * 6.2), W, 1.4, f + 0.75, f + 3.0, 0.3, 0.5));
  }
  if (f > H.podium) for (const y of [-2.95, -0.12, 2.7]) cuts.push(niche(onX(CORE.x0, y), W, 1.6, f + 0.75, f + 3.0));
}
// Onderbouw: twee rijen ramen aan noord, zuid en west.
for (const nap of [H.deck + 0.6, H.deck + 4.9]) {
  for (const s of [-1, 1]) {
    const yF = s > 0 ? PODIUM.y1 : PODIUM.y0;
    for (let x = PODIUM.x0 + 1.6; x < PODIUM.x1 - 1.0; x += 2.8) cuts.push(niche(onY(yF, x), [0, s], 2.0, nap, nap + 2.9));
  }
}

let model = union(parts).subtract(union(cuts));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 2);
console.log("ondervlakken > 2 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Mondriaantoren met rastererkers glazen erker kroon westvleugel en onderbouw", model]],
  catalog: {
    name: "Mondriaantoren",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straat aan de oost- en zuidoostzijde (AHN-DTM NAP +0,5 tot +0,8 m);
    // het dek rond de rest van de toren ligt 1,5 m hoger en bedekt de voet.
    groundSamplePoints: [[22, -14], [25, -10], [12, -18], [20, -18]],
    replacesBuildings: ["NL.IMBAG.Pand.0363100012097541"],
    description:
      "Oorsprong in het hart van de schacht op straatniveau NAP +0,5 m, +X langs de middenschijf naar het oostnoordoosten (20,1 graden in RD), +Y naar het noordnoordwesten; schacht met glazen hoeken tot NAP +106,5 m, stenen rastererkers noord en zuid tot +101, middenschijf met gelede glazen erker in de oostkop en stenen kroon tot +117,35, glazen opbouw tot +120,6 met gevelonderhoudsinstallatie tot +122,95, westvleugel tot +92,3 met kern tot +94,8 en onderbouw tot +11,3; gevelritme, erkerdelen en kroonvensters uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      deckNapM: H.deck,
      podiumNapM: H.podium,
      wingNapM: H.wing,
      coreNapM: H.core,
      bayNapM: H.bay,
      shaftNapM: H.shaft,
      slabNapM: H.slab,
      glassNapM: H.glass,
      topNapM: H.carTop,
      shaftM: [2 * SHAFT.x, 2 * SHAFT.y],
      footprintM: [+(SLAB.x1 - STRIP.x0).toFixed(2), +(2 * SHAFT.y + BAY.depth + DRUM.r).toFixed(2)],
      storeyPitchM: FLOOR,
      axisDegrees: AXIS_DEG,
      estimates: [
        "laaghoogte 3,55 m boven een hal tot NAP +6,2 m en 28 lagen in de schacht, uit foto's en de 31 lagen van Wikipedia",
        "Mondriaan-raster van vier vakken per laag (2,8 x 2,5 m) op de erkers en één glasvak per laag in de hoeken, uit foto's",
        "glazen erker in de oostkop: vier delen van zes lagen (NAP +20 tot +104), 7,5 m breed en 1,2 m uit de gevel, uit foto's",
        "zuidelijke rastererker gespiegeld van de noorderker (BAG), bevestigd door AHN-wandpunten en de luchtfoto; begint boven de hal",
        "kroonvensters, glazen opbouw en de giek van de gevelonderhoudsinstallatie uit foto's en luchtfoto, hoogtes uit AHN/3D BAG",
      ],
    },
    sources: [
      "PDOK BAG pand 0363100012097541, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012097541 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes en dakomtrekken",
      "https://nl.wikipedia.org/wiki/Mondriaantoren",
      "https://commons.wikimedia.org/wiki/File:Mondriaantoren.jpg",
      "https://commons.wikimedia.org/wiki/File:Mondriaantoren2.jpg",
      "https://commons.wikimedia.org/wiki/File:Mondriaantoren_in_2019_(1).jpg",
      "https://commons.wikimedia.org/wiki/File:Mondriaantoren_in_2019_(2).jpg",
      "https://commons.wikimedia.org/wiki/File:Mondriaan_Tower_-_panoramio.jpg",
      "https://commons.wikimedia.org/wiki/File:Amsterdam_omval_rembrandt_breitner_mondriaan_toren.jpg",
      "https://commons.wikimedia.org/wiki/File:Amstelplein.jpg",
    ],
  },
});

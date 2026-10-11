// Castalia (Parnassusplein, Den Haag; Michael Graves, 1998): kantoortoren van
// het ministerie van VWS. Het skelet van het Transitorium (Jan Lucas, 1967,
// 73 m) is in de jaren negentig herbouwd met een bakstenen gevel met
// dubbelhoge vensters en twee steile zadeldaken van 35 m (de "Haagse Tieten")
// die het gebouw op een groot grachtenpand moesten laten lijken. Tussen de twee
// kappen ligt een smal middendeel met blauwe glazen erkers; in het midden van
// beide kopgevels loopt ook zo'n erker tot boven de goot door als dakkapel.
// Vlakken en benoemde bouwdelen, geen gestapelde DSM-lagen. Voorbeeld per rij:
// generate-evoluon.mjs (aanpak primitieven), generate-rembrandttoren.mjs en
// generate-haagse-toren.mjs (skylinetoren op efteling-kit.mjs).
//
//   node scripts/generate-castalia.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong midden tussen de twee nokken en midden tussen de
// twee topgevels, op RD (81895,72, 455178,52), z = 0 op NAP +0,5 m (de straat
// aan de oostzijde, AHN-DTM +0,35 tot +0,66), Z omhoog. +X loopt langs de
// lange gevels op 36,1 graden in RD (BAG-gevels 36,1/126,1 graden), +Y naar het
// noordwesten (de straat langs de noordwestgevel, NAP +1,3 m); -Y is de
// zuidoostgevel aan het overdekte Parnassusplein.
//
// Bronnen: BAG-pand 0518100000234102 (contour van toren en onderbouw), AHN
// DSM/DTM 0,5 m (PDOK WCS, per 0,25 m in dit stelsel uitgelezen: dakvlakken
// met een kleinste-kwadratenfit per vlak, nokken, goten, topgevels,
// dakkapellen, middendeel en onderbouw), 3D BAG LoD2.2 (TU Delft/3D
// geoinformatie, CC BY 4.0: dakhelling 70,7 graden, nok 101,4-102, topgevels
// 104,0, platte delen 70,5/76,5/79,35, onderbouw 22,7-24,2), Actueel_orthoHR,
// Wikipedia (104 m, puntdaken van 35 m) en Commons-foto's van alle kanten
// (gevelritme, erkers, topgevelsleuven, dakkapellen).
import { Manifold, box, prism, hull, union, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "castalia";
const AXIS_DEG = 36.1;
const RAD = (AXIS_DEG * Math.PI) / 180;
// Hart in het lokale meetstelsel (RD 81905/455183, 36,1 graden): u -10,14, v 1,85.
const ORIGIN = [+(81905 - 10.14 * Math.cos(RAD) - 1.85 * Math.sin(RAD)).toFixed(2), +(455183 - 10.14 * Math.sin(RAD) + 1.85 * Math.cos(RAD)).toFixed(2)];
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 0.5;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  eave: 70.4, // goot en bovenkant van de gevels (3D BAG 70,4-70,7, AHN-richel 69,6-70,6)
  ridge: 101.8, // snijlijn van de dakvlakken (fit: 101,67 en 101,94)
  coping: 2.2, // topgevelkap boven het dakvlak: top 104,0 (AHN 103,5-104,0, 3D BAG-nok 104,01)
  middle: 76.5, // plat dak van het middendeel en van de kopgevelerkers
  bayTop: 77.0, // kap van de erkers tussen de topgevels (AHN 77,0)
  dormer: 74.8, // kleine dakkapellen naast de kopgevelerker (AHN 74,5-75,4)
  inner: 79.35, // dakkapellen aan de binnenkant van de kappen, naar het middendeel (3D BAG 79,3-79,4)
  wingEast: 22.9, // oostvleugel van de onderbouw (AHN 22,8-22,9)
  wingSE: 22.8, // strook langs het Parnassusplein (AHN 22,8)
  wingNW: 17.0, // lage strook langs de noordwestgevel (AHN-mediaan 17-20 tussen gevelpunten; geschat)
  wingWest: 23.3, // smalle westvleugel met ronde aanbouw (AHN 22,8-23,9, 3D BAG 23,5-24,2)
};

// ---------- plattegrond (m, gebouwstelsel) ----------
// Toren: kopgevels op x -27,5 en 26,2 (AHN-rand; het BAG-vlak loopt op de grond
// tot -27,73), topgevels op y = ±11,75 (AHN: -9,9 en 13,6 in het meetstelsel).
const TW = { W: -27.5, E: 26.2, half: 11.75 };
// Dakvlakken: helling 2,86 (70,7 graden; fit per vlak 70,4-71,2), nokken
// evenwijdig aan Y op x = ±14,43 (fit: -14,42 en 14,43).
const SLOPE = 2.86;
const RIDGES = [-14.42, 14.43];
const HS = (H.ridge - H.eave) / SLOPE; // halve kapbreedte op de goot: 10,98 m
const COPING_DEPTH = 1.5; // topgevelkap 1,5 m diep (AHN 104-strook 1,0-1,5 m)
// Middendeel tussen de goten (x ±3,44) en de glazen erkers erin (5,3 m breed,
// 1,2 m voor de topgevels; AHN u -12,9..-7,6, v -11,3..14,6).
const MID = { half: +(RIDGES[1] - HS).toFixed(2), bayHalf: 2.65, bayOut: 12.95 };
// Kopgevelerkers: 5,6 m breed, 0,76 m voor de gevel (AHN v -1,5..4,5 en tot
// u -38,4 / 17,1), tot +76,5 en het dak in.
const ENDBAY = { half: 2.8, out: 0.76 };
// Kleine dakkapellen naast de kopgevelerker (foto's, ortho): 4,0 m breed op
// y = ±7,4, voorkant net achter de goot.
const DORMER = { half: 2.0, y: 7.4, depth: 2.2 };
// Binnenste dakkapellen (3D BAG 414/430): voorkant op x = ±5,4 boven het
// middendeel, 1,2 m diep, y -5,65..4,45.
const INNER = { x0: 5.4, x1: 6.6, y0: -5.65, y1: 4.45 };

// Gevelritme (frontale foto's van kop- en topgevel): vensters over twee lagen
// (4 ruiten hoog, verdiepingshoogte 3,4 m), rijen op 6,8 m, bovenkant van de
// bovenste rij 1,5 m onder de goot; lange gevels 6 kolommen op 3,6 m rond de
// nok, kopgevels 2 + 2 kolommen naast de erker op y = ±5,4 en ±9,0.
const ROW = { top: 68.9, pitch: 6.8, height: 5.2 };
const NICHE = 0.35;
const STOREY = 3.4;

// ---------- hulpfuncties ----------
// Blinde nis in een gevel met buitennormaal ±X of ±Y: `face` is de gevelcoördinaat,
// `t` het midden langs de gevel, breedte w, NAP-hoogtes nap0..nap1.
const nicheX = (face, s, t, w, nap0, nap1, depth = NICHE, out = 1.0) =>
  box(s > 0 ? face - depth : face - out, t - w / 2, z(nap0), s > 0 ? face + out : face + depth, t + w / 2, z(nap1));
const nicheY = (face, s, t, w, nap0, nap1, depth = NICHE, out = 1.0) =>
  box(t - w / 2, s > 0 ? face - depth : face - out, z(nap0), t + w / 2, s > 0 ? face + out : face + depth, z(nap1));
// Rijen dubbelhoge vensters boven een onderbouw met bovenkant `floorNap`.
const windowRows = (floorNap) => {
  const rows = [];
  for (let i = 0; ; i++) {
    const top = ROW.top - ROW.pitch * i;
    const bottom = Math.max(top - ROW.height, floorNap + 0.7);
    if (top - bottom < 2.0) break;
    rows.push([bottom, top]);
  }
  return rows;
};
// Verdiepingen van de glazen erkers tussen floorNap en topNap.
const storeyRows = (floorNap, topNap) => {
  const rows = [];
  for (let top = topNap - 0.5; top - 2.6 >= floorNap + 0.5; top -= STOREY) rows.push([top - 2.6, top]);
  return rows;
};
// Vensters van de onderbouw: één per laag (3,4 m), 1,8 m breed op 3,6 m.
const lowRows = (topNap) => {
  const rows = [];
  for (let b = 1.6; b + 2.2 <= topNap - 0.8; b += STOREY) rows.push([b, b + 2.2]);
  return rows;
};
const spread = (t0, t1, pitch = 3.6, margin = 1.4) => {
  const n = Math.floor((t1 - t0 - 2 * margin) / pitch) + 1;
  const start = (t0 + t1) / 2 - ((n - 1) * pitch) / 2;
  return Array.from({ length: Math.max(n, 0) }, (_, i) => +(start + i * pitch).toFixed(3));
};
const gable = (xr, top, half) =>
  hull([
    [xr - half, -TW.half, z(H.eave) - 0.01], [xr + half, -TW.half, z(H.eave) - 0.01],
    [xr - half, TW.half, z(H.eave) - 0.01], [xr + half, TW.half, z(H.eave) - 0.01],
    [xr, -TW.half, z(top)], [xr, TW.half, z(top)],
  ]);

const parts = [];
const cuts = [];

// ---------- onderbouw (BAG-contour, hoogtes uit het AHN) ----------
// Strook langs het overdekte Parnassusplein (zuidoost).
parts.push(box(-27.7, -13.88, BASE, 29.66, -TW.half + 0.01, z(H.wingSE)));
// Lage strook langs de noordwestgevel.
parts.push(box(-27.73, TW.half - 0.01, BASE, TW.E, 14.52, z(H.wingNW)));
// Oostvleugel tot aan de straat, met de uitbouw naar het zuiden.
const eastWing = [
  [TW.E - 0.01, -13.88], [29.66, -13.88], [29.82, -27.96], [30.91, -27.94], [30.91, -28.64], [32.57, -28.6], [32.6, -29.58],
  [38.96, -29.44], [38.94, -28.45], [40.61, -28.43], [40.6, -27.81], [41.68, -27.8], [41.52, -13.86], [42.5, -13.84],
  [42.5, 14.52], [TW.E - 0.01, 14.52],
];
parts.push(prism(eastWing, BASE, z(H.wingEast)));
// Smalle westvleugel (4 m) en de ronde aanbouw die hem met de toren verbindt.
parts.push(box(-37.02, -31.15, BASE, -33.01, -8.04, z(H.wingWest)));
parts.push(box(-33.03, -12.89, BASE, TW.W + 0.01, -11.36, z(H.wingWest)));
parts.push(Manifold.cylinder(z(H.wingWest) - BASE, 2.45, 2.45, 40).translate([-30.31, -12.17, BASE]));

// ---------- toren ----------
parts.push(box(TW.W, -TW.half, BASE, TW.E, TW.half, z(H.eave)));
// Twee zadeldaken van 70,7 graden met de nok evenwijdig aan Y.
for (const xr of RIDGES) parts.push(gable(xr, H.ridge, HS));
// Topgevelkappen: de topgevels steken 2,2 m boven het dakvlak uit (oranje
// natuursteen, "iets hogere zijkanten"), 1,5 m diep vanaf de gevel.
for (const xr of RIDGES) {
  const half = HS + H.coping / SLOPE;
  for (const s of [-1, 1]) {
    const y0 = s * TW.half;
    const y1 = s * (TW.half - COPING_DEPTH);
    parts.push(
      hull([
        [xr - half, y0, z(H.eave) - 0.01], [xr + half, y0, z(H.eave) - 0.01], [xr, y0, z(H.ridge + H.coping)],
        [xr - half, y1, z(H.eave) - 0.01], [xr + half, y1, z(H.eave) - 0.01], [xr, y1, z(H.ridge + H.coping)],
      ]),
    );
  }
}
// Middendeel tussen de twee kappen, plat op +76,5.
parts.push(box(-MID.half - 0.01, -TW.half, BASE, MID.half + 0.01, TW.half, z(H.middle)));
// Glazen erkers tussen de topgevels, 1,2 m voor de gevel, met kap tot +77,0.
for (const s of [-1, 1]) {
  parts.push(box(-MID.bayHalf, s > 0 ? 10.5 : -MID.bayOut, BASE, MID.bayHalf, s > 0 ? MID.bayOut : -10.5, z(H.bayTop)));
}
// Kopgevelerkers, doorlopend tot +76,5 als grote dakkapel.
parts.push(box(TW.W - ENDBAY.out, -ENDBAY.half, BASE, RIDGES[0] - 8.6, ENDBAY.half, z(H.middle)));
parts.push(box(RIDGES[1] + 8.6, -ENDBAY.half, BASE, TW.E + ENDBAY.out, ENDBAY.half, z(H.middle)));
// Kleine dakkapellen naast de kopgevelerkers, op de goot.
for (const s of [-1, 1]) {
  for (const [x0, x1] of [[RIDGES[0] - HS - 0.3, RIDGES[0] - HS - 0.3 + DORMER.depth], [RIDGES[1] + HS + 0.3 - DORMER.depth, RIDGES[1] + HS + 0.3]]) {
    parts.push(box(x0, s * DORMER.y - DORMER.half, z(H.eave) - 0.01, x1, s * DORMER.y + DORMER.half, z(H.dormer)));
  }
}
// Binnenste dakkapellen, met de voorkant naar het middendeel.
for (const s of [-1, 1]) {
  parts.push(box(s > 0 ? INNER.x0 : -INNER.x1, INNER.y0, z(H.middle) - 0.01, s > 0 ? INNER.x1 : -INNER.x0, INNER.y1, z(H.inner)));
}

// ---------- gevelreliëf ----------
// Lange gevels (topgevelzijden): 6 kolommen dubbelhoge vensters onder elke topgevel.
for (const s of [-1, 1]) {
  const floor = s > 0 ? H.wingNW : H.wingSE;
  for (const xr of RIDGES) {
    for (let k = 0; k < 6; k++) {
      const t = xr + (k - 2.5) * 3.6;
      for (const [b, tp] of windowRows(floor)) cuts.push(nicheY(s * TW.half, s, t, 2.3, b, tp));
    }
    // Sleuven in de topgevel: zes verspringende rijen van 6, 5, 4, 3, 2 en 1
    // op 5 m (foto frontaal op de zuidoostgevel); werkelijk circa 0,5 x 1,5 m,
    // hier 0,9 x 2,0 m zodat ze op 1:1000 te zien zijn.
    for (let j = 0; j < 6; j++) {
      const n = 6 - j;
      const zc = 72.3 + 5.0 * j;
      for (let i = 0; i < n; i++) cuts.push(nicheY(s * TW.half, s, xr + (i - (n - 1) / 2) * 3.6, 0.9, zc - 1.0, zc + 1.0, 0.3));
    }
  }
  // Kroonband: groef onder de goot over de hele topgevelzijde (naast de erker).
  cuts.push(box(TW.W - 1, s > 0 ? TW.half - 0.3 : -TW.half - 1, z(69.45), -MID.half - 0.15, s > 0 ? TW.half + 1 : -TW.half + 0.3, z(69.95)));
  cuts.push(box(MID.half + 0.15, s > 0 ? TW.half - 0.3 : -TW.half - 1, z(69.45), TW.E + 1, s > 0 ? TW.half + 1 : -TW.half + 0.3, z(69.95)));
  // Glazen erker tussen de topgevels: twee ruitvakken per laag boven de onderbouw.
  for (const [b, tp] of storeyRows(floor, H.bayTop)) for (const t of [-1.2, 1.2]) cuts.push(nicheY(s * MID.bayOut, s, t, 1.9, b, tp, 0.3));
}
// Kopgevels: 2 + 2 kolommen naast de erker, west tot op de straat, oost boven de oostvleugel.
for (const [face, s, floor] of [[TW.W, -1, 0.8], [TW.E, 1, H.wingEast]]) {
  for (const t of [-9.0, -5.4, 5.4, 9.0]) for (const [b, tp] of windowRows(floor)) cuts.push(nicheX(face, s, t, 2.4, b, tp));
  for (const [y0, y1] of [[-TW.half - 1, -ENDBAY.half - 0.1], [ENDBAY.half + 0.1, TW.half + 1]]) {
    cuts.push(box(s > 0 ? face - 0.3 : face - 1, y0, z(69.45), s > 0 ? face + 1 : face + 0.3, y1, z(69.95)));
  }
  const bayFace = face + s * ENDBAY.out;
  for (const [b, tp] of storeyRows(floor, H.middle)) for (const t of [-1.25, 1.25]) cuts.push(nicheX(bayFace, s, t, 1.9, b, tp, 0.3));
  // Kleine dakkapellen: één venster in de voorkant.
  const dFace = s > 0 ? RIDGES[1] + HS + 0.3 : RIDGES[0] - HS - 0.3;
  for (const yc of [-DORMER.y, DORMER.y]) cuts.push(nicheX(dFace, s, yc, 3.0, H.eave + 0.6, H.dormer - 0.8, 0.3, 0.6));
}
// Binnenste dakkapellen: twee vensters naar het middendeel.
for (const s of [-1, 1]) for (const t of [-3.0, 1.8]) cuts.push(nicheX(s * INNER.x0, -s, t, 3.4, H.middle + 0.5, H.inner - 0.7, 0.3, 0.6));

// Onderbouw: één venster per laag.
const lowFaces = [
  // [as, gevel, normaal, van, tot, bovenkant]
  ["x", 42.5, 1, -12.5, 13.2, H.wingEast], // oostvleugel aan de straat
  ["y", 14.52, 1, TW.E, 42.5, H.wingEast], // oostvleugel, noordwest
  ["y", 14.52, 1, -27.73, -MID.bayHalf - 0.2, H.wingNW], // lage strook noordwest, west van de erker
  ["y", 14.52, 1, MID.bayHalf + 0.2, TW.E, H.wingNW], // idem, oost van de erker
  ["y", -13.88, -1, -27.7, -MID.bayHalf - 0.2, H.wingSE], // strook aan het Parnassusplein
  ["y", -13.88, -1, MID.bayHalf + 0.2, 29.66, H.wingSE],
  ["x", 29.74, -1, -27.9, -14.0, H.wingEast], // uitbouw oostvleugel, naar het plein
  ["y", -29.5, -1, 32.6, 38.96, H.wingEast], // uitbouw oostvleugel, zuidkop
  ["x", -37.02, -1, -31.15, -8.04, H.wingWest], // westvleugel
  ["x", -33.01, 1, -31.15, -14.7, H.wingWest],
];
for (const [axis, face, s, t0, t1, top] of lowFaces) {
  for (const t of spread(t0, t1)) for (const [b, tp] of lowRows(top)) cuts.push(axis === "x" ? nicheX(face, s, t, 1.8, b, tp) : nicheY(face, s, t, 1.8, b, tp));
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
  nodes: [["building:Castalia met twee puntdaken topgevels erkers dakkapellen en onderbouw", model]],
  catalog: {
    name: "Castalia",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straat aan de oostzijde (AHN-DTM NAP +0,35 tot +0,66 m); de straten aan de
    // west- (+1,1) en noordwestzijde (+1,3) liggen hoger en bedekken de voet.
    groundSamplePoints: [[45, -20], [45, 0], [45, 13]],
    replacesBuildings: ["NL.IMBAG.Pand.0518100000234102"],
    description:
      "Oorsprong midden tussen de twee nokken en de twee topgevels op straatniveau NAP +0,5 m, +X langs de lange gevels (36,1 graden in RD), +Y naar het noordwesten; bakstenen toren van 53,7 x 23,5 m tot NAP +70,4 m met twee zadeldaken van 70,7 graden (nok +101,8 m, topgevelkappen tot +104,0 m), glazen erkers en dakkapellen tot +76,5/+79,35 m en een onderbouw van +17 tot +23,3 m; gevelritme, topgevelsleuven en dakkapellen uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      eaveNapM: H.eave,
      ridgeNapM: H.ridge,
      gableTopNapM: +(H.ridge + H.coping).toFixed(2),
      roofPitchDegrees: +((Math.atan(SLOPE) * 180) / Math.PI).toFixed(1),
      middleNapM: H.middle,
      innerDormerNapM: H.inner,
      podiumNapM: [H.wingNW, H.wingSE, H.wingEast, H.wingWest],
      towerM: [+(TW.E - TW.W).toFixed(2), 2 * TW.half],
      ridgeSpacingM: +(RIDGES[1] - RIDGES[0]).toFixed(2),
      storeyPitchM: STOREY,
      axisDegrees: AXIS_DEG,
      estimates: [
        "vensters over twee lagen (6,8 m), 6 kolommen op 3,6 m per topgevel en 2 + 2 per kopgevel uit frontale foto's",
        "topgevelsleuven (6/5/4/3/2/1 op 5 m) uit een frontale foto, vergroot tot 0,9 x 2,0 m",
        "kleine dakkapellen (4 m breed, +74,8) en ruitvakken van de erkers uit foto's",
        "lage strook langs de noordwestgevel op +17,0 m: het AHN geeft daar alleen gevelpunten (mediaan 17-20)",
      ],
    },
    sources: [
      "PDOK BAG pand 0518100000234102, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000234102 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhelling, nokken, platte delen",
      "https://nl.wikipedia.org/wiki/Castalia_(gebouw)",
      "https://commons.wikimedia.org/wiki/File:De_Castaliatorens_(de_Puntmutsen).jpg",
      "https://commons.wikimedia.org/wiki/File:Castalia_The_Hague.JPG",
      "https://commons.wikimedia.org/wiki/File:MinVWS.jpg",
      "https://commons.wikimedia.org/wiki/File:Castalia_en_Hoftoren.jpg",
      "https://commons.wikimedia.org/wiki/File:DeResident1.jpg",
      "https://commons.wikimedia.org/wiki/File:The_Hague_Government_and_business_buildings_4.JPG",
    ],
  },
});

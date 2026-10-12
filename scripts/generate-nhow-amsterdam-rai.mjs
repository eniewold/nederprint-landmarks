// nhow Amsterdam RAI (Europaboulevard 2B, Amsterdam; OMA, Reinier de Graaf en
// Rem Koolhaas, 2016-2020): hotel van 91 m met 650 kamers. Drie gestapelde
// driehoekige volumes met glazen gevels achter verticale aluminium lamellen,
// alle drie om dezelfde kern: het onderste en het bovenste volume hebben
// dezelfde plattegrond, het middelste staat 30 graden gedraaid, zodat zijn
// punten tot 15 m buiten het volume eronder en erboven uitkragen (vlakke
// donkere onderkanten). Tussen de volumes ligt telkens een terugliggende
// glazen verdieping op de zeshoekige doorsnede van de twee driehoeken (de
// "as" van het gebouw), op de daken van het onderste en het middelste volume
// terrassen. Het geheel staat op een ronde glazen voet van twee lagen met
// vijf losse kolommen eronder. Op het bovenste dak een installatieopbouw en
// een verdiept dakterras. Vlakken en benoemde bouwdelen in een eigen
// gebouwstelsel, geen gestapelde DSM-lagen. Voorbeelden per rij:
// generate-evoluon.mjs (aanpak primitieven) en generate-montevideo.mjs
// (skylinetoren op efteling-kit.mjs, stapeling van volumes met gevelnissen).
//
//   node scripts/generate-nhow-amsterdam-rai.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het gemeenschappelijke zwaartepunt van de drie
// driehoeken op RD (121178,6, 483505,55), z = 0 op NAP +0,4 m (plein rondom:
// AHN-DTM +0,3 tot +1,0), Z omhoog. +X loopt op 3,6 graden in RD, langs de
// noordgevel van het onderste en het bovenste volume (naar de RAI-hallen);
// hun derde punt wijst naar -Y (de A10). Het middelste volume heeft punten
// naar het westen, het noordnoordoosten en het zuidoosten.
//
// Bronnen: BAG-pand 0363100012247941 (de BAG-contour omvat ook de
// ondergrondse garage); BGT-pand G0363.2b6cc0b35634488284232e7570eafed0 (de
// glazen voet op het maaiveld en vijf kolommen); AHN5 DSM 0,5 m (opname
// 2023, ImageServer Hoogtebestand/AHN5_DSM_50cm van ahn.arcgisonline.nl;
// het PDOK-AHN4 heeft aan de noordkant ruis van de bouw): de randen van de
// driehoeken (lijnfit per gevel: zijden 59,7 en 59,3 m, hoeken 3,6 en 33,6
// graden, dezelfde hartlijn), het bovenste dak +87,9, de installatieopbouw
// +90,7, het verdiepte terras +83,75 en de punten van het middelste dak +59,8
// met een rand tot +61,0. De onderkanten van de volumes en de tussenlagen zijn
// in het DSM onzichtbaar. Die komen uit de slagschaduw op de luchtfoto
// (Actueel_orthoHR, 8 cm): een schaduwmodel van de drie driehoeken en de
// tussenlagen op het AHN-maaiveld, gefit op het donkere vlak ten noorden van
// het hotel (zonvector 0,077/1,325 m per m hoogte, 9 % afwijking): dak van het
// onderste volume +36,2, onderkant van het middelste +39,5 (zwak bepaald) en
// van het bovenste +64,7. Dat klopt met het aantal lagen op Commons-foto's en
// de constructietekening van OMA: onderste volume 8 lagen, middelste 6,
// bovenste 7, twee glazen tussenlagen en een voet van twee lagen (Schüco en
// ENR: 24-25 lagen, 91 m).
import { CrossSection, Manifold, prism, union, ccw, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "nhow-amsterdam-rai";
const ORIGIN = [121178.6, 483505.55];
const AXIS_DEG = 3.6;
const RAD = (AXIS_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 0.4;
const BASE = -1.0;
const z = (nap) => nap - GROUND_NAP;
// RD naar gebouwstelsel.
const local = ([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [+(dx * Math.cos(RAD) + dy * Math.sin(RAD)).toFixed(3), +(-dx * Math.sin(RAD) + dy * Math.cos(RAD)).toFixed(3)];
};

// ---------- hoogtes (NAP) ----------
const H = {
  baseTop: 9.0, // onderkant van het onderste volume, bovenkant van de voet van twee lagen (foto's: 2 lagen van ca. 4,3 m; niet in de schaduw te zien)
  lowRoof: 36.2, // dak van het onderste volume (schaduwfit 36,0-36,5): 8 lagen van 3,4 m
  midSoffit: 39.5, // onderkant van het middelste volume (schaduwfit 38-41): één glazen tussenlaag van 3,3 m
  midRoof: 59.8, // dak van het middelste volume (AHN5 59,74-59,78 op de punten): 6 lagen van 3,38 m
  midRim: 61.0, // rand van lamellen en glas om de dakterrassen (AHN5 90e percentiel 61,0)
  topSoffit: 64.7, // onderkant van het bovenste volume (schaduwfit 64,5-65,0): tweede glazen tussenlaag van 4,9 m
  topRoof: 87.9, // dak van het bovenste volume (AHN5-mediaan 87,89): 7 lagen van 3,31 m
  plant: 90.7, // installatieopbouw (AHN5 90,3-90,8)
  plantSouth: 90.2, // lager zuidelijk deel van de opbouw (AHN5 90,15-90,34)
  plantGutter: 89.0, // goot tussen westelijke strook en hoofdblok (AHN5 88,4-89,9)
  terrace: 83.75, // verdiept dakterras aan de noordgevel (AHN5-mediaan 83,75)
  storeyLow: 3.4,
  storeyMid: 3.383,
  storeyTop: 3.314,
  letterTop: 64.3, // roze letter n van het nhow-logo op de zuidoostpunt van het middelste dak (foto's: ca. 4,5 m hoog)
};

// ---------- plattegrond (m, gebouwstelsel) ----------
// Gelijkzijdige driehoeken om de oorsprong (lijnfit op de AHN5-randen, zie boven):
// onder en boven zijde 59,72 m met een punt naar -Y, midden zijde 59,33 m en 30
// graden gedraaid (punten op -60, 60 en 180 graden).
const tri = (side, deg0) => {
  const r = side / Math.sqrt(3);
  return [0, 1, 2].map((k) => {
    const a = ((deg0 + 120 * k) * Math.PI) / 180;
    return [+(r * Math.cos(a)).toFixed(3), +(r * Math.sin(a)).toFixed(3)];
  });
};
const TOP = tri(59.72, -90);
const MID = tri(59.33, -60);
const LOW = TOP;
const cs = (poly) => new CrossSection([ccw(poly)]);
const polys = (section) => section.toPolygons().map((p) => p.map(([x, y]) => [+x.toFixed(3), +y.toFixed(3)]));
// Glazen tussenlagen: de zeshoekige doorsnede van twee driehoeken, 2,0 m
// terugliggend (terras met glazen balustrade op het dak eronder; foto's).
const HEX_LOW = polys(cs(LOW).intersect(cs(MID)).offset(-2.0, "Miter"))[0];
const HEX_TOP = polys(cs(MID).intersect(cs(TOP)).offset(-2.0, "Miter"))[0];
// Ronde glazen voet (BGT-pand op het maaiveld, vereenvoudigd tot 0,25 m) en de
// vijf kolommen eronder (BGT-vlakjes van 0,6-0,9 m²; hier 1,0 m rond).
const BASE_RD = baseRd();
const PLINTH = BASE_RD.map(local);
const COLUMNS = [
  [121160.0, 483519.4],
  [121162.98, 483508.88],
  [121161.95, 483503.91],
  [121194.95, 483514.46],
  [121178.22, 483487.8],
].map(local);
// Installatieopbouw (AHN5 > 89,6 m, convex omhulsel vereenvoudigd) en het
// verdiepte terras aan de noordgevel van het bovenste volume.
const PLANT = [
  [121162.2, 483506.5], [121166.9, 483498.6], [121183.5, 483489.8], [121191.2, 483500.2], [121187.1, 483514.0], [121170.8, 483514.8],
].map(local);
const TERRACE = { x0: 0.65, x1: 11.0, y0: 11.93, wall: 0.9 }; // tot de noordgevel (y = 17,24) min een borstwering

// ---------- gevelritme (foto's) ----------
// Verticale V-lamellen op ca. 1 m met verdiepingsregels: in het model per laag
// een glasvak van 1,2 m breed en 0,35 m diep tussen penanten van ca. 0,75 m.
const NICHE = 0.35;
const PITCH = 1.95;
const BAY = 1.2;
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
const lenOf = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const edges = (poly) => ccw(poly).map((p, i, a) => [p, a[(i + 1) % a.length]]);
// Blinde nis in de gevel a→b (buitenkant rechts bij een veelhoek tegen de
// klok in): s0..s1 vanaf a, NAP-hoogtes, diepte in de gevel en `out` naar buiten.
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
// Glasvakken langs alle gevels van een veelhoek, per rij [nap0, nap1].
function bays(poly, rows, { margin = 1.2, pitch = PITCH, width = BAY, minLen = 2.4 } = {}) {
  const out = [];
  for (const [a, b] of edges(poly)) {
    const len = lenOf(a, b);
    if (len < minLen) continue;
    const n = Math.max(1, Math.round((len - 2 * margin) / pitch));
    const step = (len - 2 * margin) / n;
    const w = Math.min(width, step - 0.7);
    if (w < 0.6) continue;
    for (let k = 0; k < n; k++) {
      const c = margin + step * (k + 0.5);
      for (const [r0, r1] of rows) out.push(niche(a, b, c - w / 2, c + w / 2, r0, r1));
    }
  }
  return out;
}
const storeys = (soffit, count, h, sill = 0.45, head = 0.35) => range(count, (k) => [+(soffit + h * k + sill).toFixed(3), +(soffit + h * (k + 1) - head).toFixed(3)]);

// ---------- voet en kolommen ----------
// Twee glazen lagen met stijlen: per gevelvak een glasnis op de begane grond
// en op de eerste verdieping (lobby, lounge en bar).
let plinth = prism(PLINTH, BASE, z(H.baseTop) + 0.1);
plinth = plinth.subtract(union(bays(PLINTH, [[GROUND_NAP + 0.1, 4.6], [5.2, H.baseTop - 0.6]], { margin: 0.5, pitch: 2.0, width: 1.4, minLen: 2.2 })));
const columns = union(COLUMNS.map(([x, y]) => Manifold.cylinder(z(H.baseTop) + 0.1 - BASE, 0.5, 0.5, 20).translate([x, y, BASE])));

// ---------- drie driehoekige volumes ----------
// Onderste volume: 8 lagen boven de voet; onderkant vlak en donker.
let lower = prism(LOW, z(H.baseTop), z(H.lowRoof));
lower = lower.subtract(union(bays(LOW, storeys(H.baseTop, 8, H.storeyLow))));
// Middelste volume: 6 lagen, met een rand van 0,9 m tot +61,0 om de dakterrassen.
let middle = prism(MID, z(H.midSoffit), z(H.midRim));
middle = middle.subtract(prism(polys(cs(MID).offset(-0.9, "Miter"))[0], z(H.midRoof), z(H.midRim) + 1));
middle = middle.subtract(union(bays(MID, storeys(H.midSoffit, 6, H.storeyMid))));
// Bovenste volume: 7 lagen (de bovenste twee met vergaderzalen en studio).
let upper = prism(TOP, z(H.topSoffit), z(H.topRoof));
upper = upper.subtract(prism([[TERRACE.x0, TERRACE.y0], [TERRACE.x1, TERRACE.y0], [TERRACE.x1, TOP[1][1] - TERRACE.wall], [TERRACE.x0, TOP[1][1] - TERRACE.wall]], z(H.terrace), z(H.topRoof) + 1));
upper = upper.subtract(union(bays(TOP, storeys(H.topSoffit, 7, H.storeyTop))));

// ---------- glazen tussenlagen ----------
let hexLow = prism(HEX_LOW, z(H.lowRoof) - 0.1, z(H.midSoffit) + 0.1);
hexLow = hexLow.subtract(union(bays(HEX_LOW, [[H.lowRoof + 0.4, H.midSoffit - 0.4]], { margin: 0.8, minLen: 2.0 })));
let hexTop = prism(HEX_TOP, z(H.midRoof) - 0.1, z(H.topSoffit) + 0.1);
hexTop = hexTop.subtract(union(bays(HEX_TOP, [[H.midRim + 0.3, H.topSoffit - 0.4]], { margin: 0.8, minLen: 2.0 })));

// ---------- dak ----------
let plant = prism(PLANT, z(H.topRoof) - 0.1, z(H.plant));
plant = plant.subtract(union(bays(PLANT, [[H.topRoof + 0.6, H.plant - 0.6]], { margin: 0.9, pitch: 2.6, width: 1.6, minLen: 3.0 })));
// Goot van 1,2 m tot +89,0 tussen de westelijke installatiestrook en het
// hoofdblok, en het lagere zuidelijke deel (+90,2) (AHN5).
plant = plant.subtract(
  union([
    prism([[121162.4, 483515.6], [121163.6, 483515.6], [121165.1, 483503.8], [121163.9, 483503.8]].map(local), z(H.plantGutter), z(H.plant) + 1),
    prism([[121174.2, 483490.7], [121185.8, 483490.7], [121185.8, 483496.3], [121174.2, 483496.3]].map(local), z(H.plantSouth), z(H.plant) + 1),
  ]),
);

// Roze letter n van het nhow-logo op het dakterras in de zuidoostpunt van het
// middelste volume, evenwijdig aan de zuidzuidwestgevel (W-ZO), 3 m achter de
// gevel (foto's van het zuidwesten: de letter staat op de punt, ca. 4 x 4,5 m).
// Benen van 1,1 m, opening met een spitse top van 51 graden (print zonder steun).
const N_OUTLINE = [
  [-2.0, 0], [-0.9, 0], [-0.9, 2.5], [0, 3.6], [0.9, 2.5], [0.9, 0], [2.0, 0], [2.0, 3.5], [1.0, 4.5], [-1.0, 4.5], [-2.0, 3.5],
];
const N_AT = [+(MID[0][0] - 3.0).toFixed(3), +(MID[0][1] + 5.2).toFixed(3)]; // 6 m van de punt langs de bissectrice
const nScale = (H.letterTop - H.midRoof + 0.05) / 4.5; // 0,05 m in het dak
const letterN = Manifold.extrude(new CrossSection([ccw(N_OUTLINE.map(([u, w]) => [u, w * nScale]))]), 0.9)
  .translate([0, 0, -0.45])
  .rotate([90, 0, 0])
  .rotate([0, 0, -30])
  .translate([N_AT[0], N_AT[1], z(H.midRoof) - 0.05]);

const parts = { plinth, columns, lower, hexLow, middle, hexTop, upper, plant, letterN };
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
  nodes: [["building:nhow Amsterdam RAI met drie gedraaide driehoekige volumes glazen tussenlagen ronde voet en dakopbouw", model]],
  catalog: {
    name: "nhow Amsterdam RAI",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Plein rondom de voet (PDOK-terrein ellipsoïdisch 43,37-43,65); het lage
    // fietspad aan de zuidkant (A10) blijft buiten de bemonstering.
    groundSamplePoints: [[0, 21], [19, 8], [-19, 8], [14, -14], [-14, -14]],
    groundHeight: 43.37,
    replacesBuildings: ["NL.IMBAG.Pand.0363100012247941"],
    description:
      "Oorsprong in het gemeenschappelijke hart van de drie driehoeken op pleinniveau NAP +0,4 m, +X op 3,6 graden in RD langs de noordgevel van het onderste en bovenste volume, hun derde punt naar -Y (de A10); drie gelijkzijdige driehoekige volumes van 59,7 en 59,3 m zijde om één kern: onder (+9,0 tot +36,2) en boven (+64,7 tot +87,9) met dezelfde plattegrond, het middelste (+39,5 tot +59,8, rand +61,0) 30 graden gedraaid met punten die tot 15 m uitkragen en de roze letter n op de zuidoostpunt; daartussen terugliggende zeshoekige glazen tussenlagen, eronder een ronde glazen voet van twee lagen met vijf kolommen, op het dak een installatieopbouw (+90,7) en een verdiept terras (+83,75); gevels met glasvakken per laag. Onderkanten van de volumes en de tussenlagen uit de slagschaduw op de luchtfoto en het aantal lagen op foto's; de voet geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      sideLowerUpperM: 59.72,
      sideMiddleM: 59.33,
      middleRotationDegrees: 30,
      axisDegrees: AXIS_DEG,
      plinthTopNapM: H.baseTop,
      lowerVolumeNapM: [H.baseTop, H.lowRoof],
      middleVolumeNapM: [H.midSoffit, H.midRoof],
      middleRimNapM: H.midRim,
      upperVolumeNapM: [H.topSoffit, H.topRoof],
      roofPlantNapM: [H.plantGutter, H.plantSouth, H.plant],
      roofTerraceNapM: H.terrace,
      letterNTopNapM: H.letterTop,
      storeys: { plinth: 2, lower: 8, glassLow: 1, middle: 6, glassTop: 1, upper: 7 },
      estimates: [
        "dak van het onderste volume (+36,2) en onderkanten van het middelste (+39,5) en bovenste volume (+64,7) uit een fit van de slagschaduw op de luchtfoto (het DSM ziet alleen de daken; de onderkant van het middelste volume is daarin zwak bepaald, 38-41), gecontroleerd met het aantal lagen op foto's en de constructietekening van OMA",
        "bovenkant van de glazen voet (+9,0, twee lagen) uit foto's geschat",
        "letter n: plaats, stand en maat (4 x 4,5 m, 0,9 m dik) uit foto's geschat; de spitse opening en de schuine hoeken zijn vereenvoudigd",
        "het onderste volume heeft dezelfde plattegrond als het bovenste (Wikipedia, foto's; in het DSM steekt het nergens buiten het bovenste uit)",
        "zeshoekige tussenlagen 2,0 m terugliggend binnen de doorsnede van de driehoeken (foto's)",
        "gevelritme vereenvoudigd: per laag glasvakken van 1,2 m op 1,95 m in plaats van de V-lamellen op ca. 1 m",
        "ronde voet uit de BGT op 0,25 m vereenvoudigd; kolommen 1,0 m rond",
      ],
    },
    sources: [
      "PDOK BAG pand 0363100012247941 en BGT-pand G0363.2b6cc0b35634488284232e7570eafed0, Actueel_orthoHR; 2026-10-12",
      "AHN5 DSM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; AHN4 DSM/DTM 0,5 m (PDOK WCS) ter controle",
      "https://nl.wikipedia.org/wiki/Nhow_Amsterdam_RAI",
      "https://www.schueco.com/eg/architects/magazine/dynamically-stacked (24 lagen, voet van twee lagen, twee glazen tussenlagen met zeshoekige plattegrond)",
      "https://www.metalocus.es/en/news/three-shifted-volumes-nhow-amsterdam-rai-hotel-oma (constructietekening van OMA: lagen per volume)",
      "https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_(1).jpg",
      "https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_-_Q64040941.jpg",
      "https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_(3).jpg",
      "https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_(4).jpg",
      "https://commons.wikimedia.org/wiki/File:NHOW_Hotel_Amsterdam_RAI_(5).jpg",
      "https://commons.wikimedia.org/wiki/File:Nhow_Amsterdam_RAI.jpg",
      "https://commons.wikimedia.org/wiki/File:NhowRAI.jpg",
    ],
  },
});

// ---------- vaste invoer ----------
// BGT-pand G0363.2b6cc0b35634488284232e7570eafed0 (voet op het maaiveld), RD,
// vereenvoudigd met Douglas-Peucker op 0,25 m.
function baseRd() {
  return [
    [121165.21, 483515.6], [121164.96, 483515.25], [121166.94, 483510.62], [121167.17, 483506.37], [121166.05, 483502.32], [121163.55, 483498.74],
    [121165.77, 483495.18], [121168.69, 483492.4], [121171.51, 483490.72], [121174.61, 483489.62], [121177.85, 483489.15], [121181.12, 483489.33],
    [121184.29, 483490.14], [121187.24, 483491.55], [121189.82, 483493.48], [121191.98, 483495.88], [121193.75, 483498.92], [121194.84, 483502.2],
    [121195.2, 483505.85], [121194.78, 483509.45], [121193.78, 483512.45], [121192.18, 483515.28], [121190.32, 483517.51], [121188.09, 483519.38],
    [121185.43, 483520.87], [121186.28, 483522.29], [121185.58, 483523.74], [121184.57, 483524.05], [121183.57, 483523.68], [121182.99, 483522.8],
    [121183.07, 483521.72], [121179.8, 483522.29], [121180.24, 483523.32], [121179.95, 483524.37], [121179.05, 483525.04], [121177.95, 483525.0],
    [121176.93, 483523.8], [121177.34, 483522.31], [121173.81, 483521.65], [121170.49, 483520.25], [121167.63, 483518.24],
  ];
}

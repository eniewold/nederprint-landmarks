// Vestedatoren (Vestdijk/Smalle Haven, Eindhoven; Jo Coenen & Co, 2005-2006,
// Gebouw van het Jaar 2007), de woontoren van Vesteda: 90 m hoog, 27 lagen,
// met een ruitvormige plattegrond (Wikipedia: "ruitvorm", naar het Flatiron
// Building) met twee scherpe, afgeronde punten van 30 graden: de ene naar het
// centrum (noordwest), de andere naar het zuidoosten; de stompe hoeken zijn
// afgerond. Het gebouw bestaat uit:
// - de stenen plint (begane grond en drie lagen) met hoge vensters, die aan
//   de zuidoostpunt terugligt onder een uitkragende stenen kop met een luifel
//   boven de ingang;
// - 22 woonlagen van 3,15 m en een hogere bovenste laag: op de vier lange
//   gevels een raster van loggia's tussen lisenen en vloerbanden, in de punten
//   ronde balkons voor een teruggelegen glazen gevel, en op de stompe hoeken een
//   gesloten stenen band over de volle hoogte (aan de pleinzijde met een kolom
//   ventilatieroosters);
// - de stenen kroonrand rondom op +106,88 met daarbinnen het dak op +105,32 en
//   de installaties.
// Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen gestapelde
// DSM-lagen. Voorbeelden per rij: generate-evoluon.mjs (aanpak primitieven)
// en generate-toren-op-zuid.mjs (gevelnissen op efteling-kit.mjs).
//
//   node scripts/generate-vestedatoren.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het hart van de ruit op RD (161620,19,
// 383171,39), z = 0 op NAP +16,8 m (plein aan de zuidwestzijde en de stoep
// rond de punten, AHN-DTM +16,76..+16,84), Z omhoog. +X loopt op 128,0 graden
// in RD over de lange diagonaal naar de punt richting het centrum
// (noordwest), +Y op 218 graden naar het plein (zuidwest); de Vestdijk ligt
// aan -Y.
//
// Bronnen: BAG-pand 0772100000284714 (bouwjaar 2006): de plattegrond, met
// gevels op 15,08 graden van de diagonaal (-36,9 en -67,1 graden in RD);
// AHN5 DSM 0,5 m (opname 2023, ImageServer Hoogtebestand/AHN5_DSM_50cm van
// ahn.arcgisonline.nl): kroonrand +106,88 rondom, dak +105,32, installaties
// +106,4..+108,3 en een schoorsteen tot +110,3, de luifel bij de zuidoostpunt
// op +20,4; AHN4 DTM 0,5 m (PDOK WCS) voor het maaiveld; 3D BAG LoD2.2
// (dak 105,34, max 107,38) ter controle. Lagen, loggia's, balkons, plint en
// de uitkragende kop uit Commons-foto's.
import { CrossSection, Manifold, prism, union, ccw, rect, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "vestedatoren";
const ORIGIN = [161620.19, 383171.39];
const AXIS_DEG = 128.0;
const RAD = (AXIS_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 16.8;
const BASE = -1.0; // NAP +15,8, onder de stoep aan de Vestdijk (+16,05..+16,5)
const z = (nap) => +(nap - GROUND_NAP).toFixed(3);

// ---------- hoogtes (NAP) ----------
const H = {
  rim: 106.88, // kroonrand rondom (AHN5 106,84..106,95)
  roof: 105.32, // dak binnen de kroonrand (AHN5 105,29..105,35; 3D BAG 105,34)
  capBottom: 104.9, // onderkant van de stenen kroonband (foto's: ca. 2 m)
  penthouse: 99.5, // vloer van de hogere bovenste laag (foto's: 1,7 x een gewone laag)
  firstFloor: 30.2, // eerste woonlaag met balkon (foto's: plint van vier lagen)
  plinthSoffit: 28.2, // onderkant van de uitkragende kop aan de zuidoostpunt (foto's)
  canopy: 20.4, // luifel bij de zuidoostpunt (AHN5 20,3..20,5)
  canopyBottom: 19.8,
  plantA: 107.45, // installatieblok midden (AHN5 107,4..107,5)
  plantLow: 106.45, // lagere installaties (AHN5 106,2..106,6)
  plantDome: 107.1, // ketel/bol op het dak (AHN5 107,0..107,2)
  plantB: 108.3, // installatieblok noordwest (AHN5 108,1..108,4)
  flue: 110.3, // schoorsteen (AHN5 110,2..110,4)
};
const STOREYS = 22; // gewone woonlagen van 3,15 m vanaf +30,2 (27 lagen in totaal, de.wikipedia)
const STOREY = (H.penthouse - H.firstFloor) / STOREYS; // 3,15 m
const SLAB = 0.9; // vloerband/balkonplaat (dikker dan in het echt, printbaar op 1:1000)

// ---------- plattegrond: afgeronde ruit ----------
// Scherpe ruit met halve korte diagonaal 7,87 m en gevels op 15,08 graden van
// de lange diagonaal (BAG); punten afgerond met r = 2,5 m (BAG-punt op u =
// ±22,13), stompe hoeken met R = 13,66 m (raakpunten op u = ±3,55).
const HALF = (15.08 * Math.PI) / 180;
const W0 = 7.87;
const TIP = W0 / Math.tan(HALF); // 29,21: scherpe punt
const R_TIP = 2.5;
const R_CORNER = 13.66;
const EDGE = Math.hypot(TIP, W0); // 30,25: zijde van de scherpe ruit
const E_DIR = [Math.cos(HALF), -Math.sin(HALF)]; // langs de gevel u>0, v>0 (van stompe hoek naar punt)
const N_OUT = [Math.sin(HALF), Math.cos(HALF)]; // naar buiten op die gevel
const S_CORNER = R_CORNER * Math.tan(HALF); // 3,68: raaklengte stompe hoek
const S_TIP = EDGE - R_TIP / Math.tan(HALF); // 20,97: raakpunt punt

const arc = (c, r, a0, a1, n) => Array.from({ length: n + 1 }, (_, k) => {
  const a = a0 + ((a1 - a0) * k) / n;
  return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
});
// Afgeronde ruit, linksom vanaf de noordwestpunt (+X). `inset` legt alle
// gevels evenwijdig naar binnen (de stralen krimpen mee).
function lozenge(inset = 0) {
  const rt = R_TIP - inset;
  const rc = R_CORNER - inset;
  const cTip = TIP - R_TIP / Math.sin(HALF); // middelpunt puntboog op de as
  const cCor = W0 - R_CORNER / Math.cos(HALF); // middelpunt hoekboog op de korte as
  const pts = [];
  // punt +X: van de onderzijde (v<0) naar de bovenzijde, normaalhoeken -(90-15,08)..+(90-15,08)
  const aT = Math.PI / 2 - HALF;
  pts.push(...arc([cTip, 0], rt, -aT, aT, 24));
  // stompe hoek +Y: normaalhoeken 90-15,08 .. 90+15,08
  pts.push(...arc([0, cCor], rc, aT, Math.PI - aT, 16));
  pts.push(...arc([-cTip, 0], rt, Math.PI - aT, Math.PI + aT, 24));
  pts.push(...arc([0, -cCor], rc, Math.PI + aT, 2 * Math.PI - aT, 16));
  return pts;
}
const FOOT = lozenge();
const cs = (poly) => new CrossSection([ccw(poly)]);
const ext = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));

// Punt op een lange gevel: s langs de gevel vanaf de stompe hoek (scherpe
// ruit), t naar buiten; (su, sv) = kwadrant.
const facePt = (su, sv, s, t) => [su * (s * E_DIR[0] + t * N_OUT[0]), sv * (W0 + s * E_DIR[1] + t * N_OUT[1])];
// Nis in een lange gevel: s0..s1, diepte d, z0..z1 (model-z).
const faceNiche = (su, sv, s0, s1, d, z0, z1) =>
  Manifold.hull([z0, z1].flatMap((zz) => [[s0, -d], [s1, -d], [s1, 0.5], [s0, 0.5]].map(([s, t]) => [...facePt(su, sv, s, t), zz])));
const QUADS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

// ---------- lagen ----------
const floors = [...range(STOREYS, (k) => H.firstFloor + STOREY * k), H.penthouse]; // vloerniveaus met balkonplaat
const cellTop = (k) => (k < STOREYS ? floors[k + 1] : H.capBottom);

// ---------- toren ----------
let tower = ext(cs(FOOT), BASE, z(H.roof));
// Loggia's: op elke lange gevel vier traveeën van 2,7 m tussen lisenen van
// 0,9 m, vanaf 0,9 m na de stompe hoek tot 0,9 m voor de puntzone; 0,8 m diep.
const BAYS = 4;
const S0 = S_CORNER + 0.9; // 4,58
const S_TIPZONE = 19.0; // begin van de ronde balkons (u = 18,35)
const PITCH = (S_TIPZONE - 0.9 - S0 + 0.9) / BAYS; // 3,6
const LOGGIA_D = 0.8;
const cells = [];
for (const [su, sv] of QUADS) {
  for (let k = 0; k < floors.length; k++) {
    for (let j = 0; j < BAYS; j++) {
      const s0 = S0 + PITCH * j;
      cells.push(faceNiche(su, sv, s0, s0 + PITCH - 0.9, LOGGIA_D, z(floors[k] + SLAB), z(cellTop(k))));
    }
  }
}
// Punten: ronde balkons voor een glazen gevel die 1,1 m terugligt, per laag
// tussen de balkonplaten, vanaf s = 19,0 rond de punt.
const U_TIPZONE = S_TIPZONE * E_DIR[0]; // 18,35
const TIP_RING = cs(FOOT).subtract(cs(lozenge(1.1)));
const tipZone = (sgn) => cs(sgn > 0 ? rect(U_TIPZONE, -10, 40, 10) : rect(-40, -10, -U_TIPZONE, 10));
const tipRecess = [];
for (const sgn of [1, -1]) {
  const ring = TIP_RING.intersect(tipZone(sgn));
  for (let k = 0; k < floors.length; k++) tipRecess.push(ext(ring, z(floors[k] + SLAB), z(cellTop(k))));
}
// Stenen band op de stompe hoeken; aan de pleinzijde (+Y) een kolom
// ventilatieroosters van 1,0 x 1,4 m per laag, 0,35 m diep (foto's).
const louvres = floors.slice(0, STOREYS).map((f) => {
  const zz = [z(f + 1.0), z(f + 2.4)];
  return Manifold.hull(zz.flatMap((h) => [[-1.6, 6.9], [-0.6, 6.9], [-0.6, 7.6], [-1.6, 7.6]].map(([u, v]) => [u, v, h])));
}).map((m) => m.subtract(ext(cs(lozenge(0.35)), BASE, z(H.rim))));
// Plint: hoge vensters (2,6 m breed, tot 0,8 m onder de plinttop), twee per
// lange gevel bij de stompe hoek, 0,35 m diep (foto's).
const plinthWindows = [];
for (const [su, sv] of QUADS) for (const s0 of [S_CORNER + 1.2, S_CORNER + 5.2]) plinthWindows.push(faceNiche(su, sv, s0, s0 + 2.6, 0.35, BASE, z(H.plinthSoffit - 0.8)));
// Zuidoostpunt: de plint ligt terug op u = -17,5 onder de uitkragende kop
// (onderkant +28,2, stenen borstwering tot de eerste woonlaag op +30,2).
const U_PLINTH_SE = -17.5;
const seUnder = prism(rect(-40, -10, U_PLINTH_SE, 10), BASE - 1, z(H.plinthSoffit));
// Gevel van de teruggelegen plint: drie glasstroken als nissen van 0,35 m.
const seGlass = union([-2.2, 0, 2.2].map((v) => prism(rect(U_PLINTH_SE - 1, v - 0.75, U_PLINTH_SE + 0.35, v + 0.75), 0.6, z(H.plinthSoffit - 0.9))));
tower = tower.subtract(union([...cells, ...tipRecess, ...louvres, ...plinthWindows, seUnder, seGlass]));
// Kroonrand: 0,7 m brede rand van het dak tot +106,88.
const parapet = ext(cs(FOOT).subtract(cs(lozenge(0.7))), z(H.roof) - 0.05, z(H.rim));
// Luifel boven de ingang aan de zuidoostpunt (AHN5 +20,4, u -29..-17,5),
// 0,6 m dik, aan het eind op twee kolommen van 0,9 m (geschat).
const canopy = union([
  prism(rect(-29.0, -1.75, U_PLINTH_SE + 0.3, 2.0), z(H.canopyBottom), z(H.canopy)),
  prism(rect(-28.9, -1.65, -28.0, -0.75), BASE, z(H.canopyBottom) + 0.05),
  prism(rect(-28.9, 1.0, -28.0, 1.9), BASE, z(H.canopyBottom) + 0.05),
]);

// ---------- dakinstallaties (AHN5) ----------
const roofZ = z(H.roof) - 0.05;
const plant = union([
  prism(rect(-2.75, 1.75, 2.75, 3.75), roofZ, z(H.plantA)),
  prism(rect(-6.25, 2.75, -2.7, 3.75), roofZ, z(H.plantLow)),
  prism(rect(-3.0, -3.5, 3.25, -1.0), roofZ, z(H.plantLow)),
  prism(rect(-0.5, -1.5, 1.5, 1.0), roofZ, z(H.plantDome)),
  prism(rect(5.5, -0.75, 7.25, 1.25), roofZ, z(H.plantB)),
  prism(rect(7.2, -0.25, 8.25, 0.85), roofZ, z(H.flue)),
]);

const parts = { tower, parapet, canopy, plant };
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts));
model = model.trimByPlane([0, 0, 1], BASE);
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 10);
console.log("ondervlakken > 10 m2:", JSON.stringify(down));
console.log("plattegrond:", { tipU: +(TIP - R_TIP / Math.sin(HALF) + R_TIP).toFixed(2), sCorner: +S_CORNER.toFixed(2), sTip: +S_TIP.toFixed(2), pitch: +PITCH.toFixed(3), storey: +STOREY.toFixed(3) });

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Vestedatoren met loggia's ronde balkons in de punten stenen hoekbanden kroonrand en plint", model]],
  catalog: {
    name: "Vestedatoren",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Plein aan de zuidwestzijde en de stoep bij de zuidoostpunt (PDOK
    // ellipsoïdisch 60,69..60,75); de lagere stoep aan de Vestdijk (60,0..60,4)
    // blijft erbuiten.
    groundSamplePoints: [[-12, 9], [0, 11], [12, 9], [-24, 5]],
    groundHeight: 60.7,
    replacesBuildings: ["NL.IMBAG.Pand.0772100000284714", "NL.IMBAG.Pand.0772100001047014"],
    description:
      "Oorsprong RD (161620,19, 383171,39) in het hart van de ruit op pleinniveau NAP +16,8 m, +X op 128 graden in RD over de lange diagonaal naar de punt richting het centrum, +Y naar het plein; afgeronde ruit van 44,2 x 14,8 m met punten van 30 graden (r 2,5 m) en afgeronde stompe hoeken (BAG), kroonrand +106,88 rondom en dak +105,32 met installaties tot +108,3 en een schoorsteen tot +110,3 (AHN5); stenen plint met hoge vensters, aan de zuidoostpunt teruggelegen onder een uitkragende kop met een luifel op +20,4; 22 woonlagen van 3,15 m en een hogere bovenste laag met op de lange gevels vier loggia's per laag tussen lisenen en vloerbanden, ronde balkons in de punten en stenen banden op de stompe hoeken. Lagen, loggia's, balkons, plinthoogte en de kop uit foto's of geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      axisDegrees: AXIS_DEG,
      plan: { lengthM: +(2 * (TIP - R_TIP / Math.sin(HALF) + R_TIP)).toFixed(2), widthM: +(2 * (W0 - R_CORNER / Math.cos(HALF) + R_CORNER)).toFixed(2), tipAngleDegrees: 30.16, tipRadiusM: R_TIP, cornerRadiusM: R_CORNER },
      napM: { rim: H.rim, roof: H.roof, capBottom: H.capBottom, penthouseFloor: H.penthouse, firstResidentialFloor: H.firstFloor, plinthSoffitSE: H.plinthSoffit, canopy: H.canopy, plant: [H.plantLow, H.plantDome, H.plantA, H.plantB], flue: H.flue },
      storeys: { total: 27, residentialRegular: STOREYS, storeyM: +STOREY.toFixed(3), penthouseM: +(H.capBottom - H.penthouse).toFixed(2), plinthStoreys: 4 },
      facade: { baysPerFace: BAYS, bayPitchM: +PITCH.toFixed(2), loggiaDepthM: LOGGIA_D, slabM: SLAB, tipGlassSetbackM: 1.1 },
      estimates: [
        "plinthoogte (+30,2) en laaghoogte 3,15 m uit foto's: 22 balkonplaten in de punt tussen de plint en de bovenste laag, die ca. 1,7 keer zo hoog is",
        "loggia's als nissen van 0,8 m in vier traveeën per gevel; in het echt per travee wisselend glas, panelen en loggia met hekwerk",
        "balkonplaten en vloerbanden 0,9 m dik in plaats van ca. 0,3 m, zodat ze op 1:1000 printen",
        "zuidoostpunt: plint 4,6 m teruggelegen (u = -17,5) onder een stenen kop van +28,2 tot +30,2 (foto's); de luifel op +20,4 uit het AHN5, de twee kolommen geschat",
        "ventilatieroosters op de stompe hoek aan de pleinzijde en de hoge plintvensters: plaats en maat uit foto's",
        "de noordwestpunt staat tegen het lagere buurpand 0772100001003302 (Smalle Haven) en heeft in het model geen teruggelegen plint",
      ],
    },
    sources: [
      "PDOK BAG panden 0772100000284714 en 0772100001047014, Actueel_orthoHR; PDOK-gebouwtegels en terrein; 2026-10-12",
      "AHN5 DSM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; AHN4 DTM 0,5 m (PDOK WCS); 3D BAG LoD2.2",
      "https://nl.wikipedia.org/wiki/Vestedatoren",
      "https://de.wikipedia.org/wiki/Vesteda-Turm",
      "https://commons.wikimedia.org/wiki/File:Vestedatoren,_Eindhoven.jpg",
      "https://commons.wikimedia.org/wiki/File:Eindhoven,_de_Vestedatoren_IMG_8577_2019-01-20_10.34.jpg",
      "https://commons.wikimedia.org/wiki/File:Vestedatoren_2015.jpg",
      "https://commons.wikimedia.org/wiki/File:Vestedatoren,_Eindhoven_-_zijkant.jpg",
      "https://commons.wikimedia.org/wiki/File:Vestedatoren.jpg",
      "https://commons.wikimedia.org/wiki/File:Binnenstad,_5611_Eindhoven,_Netherlands_-_panoramio_(30).jpg",
      "https://commons.wikimedia.org/wiki/File:2007-09-16_09.34_Eindhoven,_modern_bedrijfspand.JPG",
      "https://commons.wikimedia.org/wiki/File:Strijkijzer_Look_a_Like_(2250918602).jpg",
    ],
  },
});

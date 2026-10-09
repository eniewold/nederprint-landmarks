// Genereert een vereenvoudigd, gesloten 3D-model van de Koornbrug in Leiden:
// de stenen boogbrug uit 1642 over de Nieuwe Rijn met de twee neoclassicistische
// galerijen van Salomon van der Paauw (1825). Alle maten in het script zijn
// meters op ware grootte. Uitvoer: een GLB in meters (Y omhoog, één node per
// onderdeel met de materiaalklasse in de nodenaam) als catalogusbron voor de
// export en de kaart, plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-koornbrug.mjs            # 1:100 (standaard)
//   node scripts/generate-koornbrug.mjs --scale 1000
//
// Assenstelsel: oorsprong in het hart van het brugdek op de waterspiegel van de
// Nieuwe Rijn (circa -0,6 m NAP), Z omhoog. +X loopt in de richting van de
// overspanning naar de Burgsteeg (noordoost), +Y langs het water naar het
// noordwesten. De galerijen liggen aan weerszijden van de rijweg (|y| > 2,6)
// en lopen door tot op beide kades (|x| tot 12,4).
//
// Bronnen: BGT overbruggingsdeel (dek, landhoofden, pijlers) voor de plattegrond
// van de brug, AHN DSM/DTM (PDOK WCS) voor dek-, kade-, kroonlijst- en
// nokhoogten, PDOK luchtfoto voor de dakplattegrond van de galerijen en
// Wikimedia Commons-foto's voor de opstand (zuilen, hoofdgestel, frontons).
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "100"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "koornbrug-leiden");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const box = (sx, sy, sz, x = 0, y = 0, z = 0) =>
  Manifold.cube([sx, sy, sz], false).translate([x - sx / 2, y - sy / 2, z]);
// Blok tussen twee hoekpunten; de volgorde van de grenzen maakt niet uit.
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const cyl = (h, r0, r1 = r0, x = 0, y = 0, z = 0, segs = 0) =>
  Manifold.cylinder(h, r0, r1, segs, false).translate([x, y, z]);
// Polygoon in het XZ-vlak, uitgetrokken langs Y van y0 tot y1.
const profileY = (points, y0, y1) =>
  Manifold.extrude(points, y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Cilinder met de as langs Y (voor de gewelven), gecentreerd op (x, z).
const cylY = (r, y0, y1, x, z, segs = 64) =>
  Manifold.cylinder(Math.abs(y1 - y0), r, r, segs, false)
    .rotate([-90, 0, 0])
    .translate([x, Math.min(y0, y1), z]);
const union = (parts) => Manifold.union(parts);

// ---------- hoofdmaten ----------
// Brugdek volgens de BGT: 16,7 m overspanning (x) bij 18,9 m breed (y).
const DECK = { halfX: 8.35, halfY: 9.45 };
const WATER_BOTTOM = -0.8; // onderkant van de pijlers, onder de waterspiegel
const QUAY = 2.45; // kadeniveau (circa 1,85 m NAP) boven de waterspiegel
const CROWN = 3.4; // kruin van het wegdek (2,8 m NAP volgens AHN)
const ABUTMENT_TOP = 2.9; // wegdek boven de landhoofden
const RAMP_END = 12.5; // einde van de hellingen op de kades
const ROAD_THICKNESS = 0.25;

// Wegdekprofiel: parabool over de brug, daarna lineair naar de kade.
function roadZ(x) {
  const ax = Math.abs(x);
  if (ax <= DECK.halfX) {
    return CROWN - (CROWN - ABUTMENT_TOP) * (ax / DECK.halfX) ** 2;
  }
  const t = Math.min(1, (ax - DECK.halfX) / (RAMP_END - DECK.halfX));
  return ABUTMENT_TOP - (ABUTMENT_TOP - QUAY) * t;
}
// Tegen de klok in (manifold eist dat voor buitencontouren): eerst de bodem,
// dan het wegdek van rechts naar links.
const roadProfile = (from, to, zBottom, offset = 0, steps = 24) => {
  const points = [
    [from, zBottom],
    [to, zBottom],
  ];
  for (let i = steps; i >= 0; i--) {
    const x = from + ((to - from) * i) / steps;
    points.push([x, roadZ(x) + offset]);
  }
  return points;
};

// Bogen: landhoofden circa 1,1 m, pijlers circa 1,4 m (BGT), middenboog groter.
const ARCHES = [
  { x: -5.5, span: 3.2, rise: 1.6 },
  { x: 0.05, span: 5.3, rise: 2.2 },
  { x: 5.75, span: 3.1, rise: 1.55 },
];
const SPRING = 0.3; // aanzet van de bogen boven de waterspiegel

// Galerijen (per zijde, gespiegeld in y): dakplattegrond uit de luchtfoto en AHN.
const GALLERY = {
  innerAxis: 3.2, // as van de binnenste zuilenrij (weg)
  outerAxis: 8.8, // as van de buitenste zuilenrij (water)
  cornerX: 10.8, // as van de hoekzuilen
  singleX: 7.0, // enkele tussenzuil
  pairX: [2.4, 3.2], // gekoppelde zuilen aan het middenrisaliet
  risalitHalfX: 3.7, // breedte van het risaliet en de frontons
  risalitDepth: 0.5, // hoe ver het risaliet uitspringt
  entablatureEndX: 11.3,
  entablatureInset: 0.45, // hoofdgestel buiten de zuilenassen
  entablatureBottom: 6.1, // 5,5 m NAP
  entablatureTop: 7.1, // kroonlijst 6,5 m NAP (AHN)
  eaveX: 12.0,
  eaveInset: 0.6, // dakrand buiten de zuilenassen
  ridgeZ: 9.5, // nok 8,9 m NAP (AHN)
  ridgeEndX: 8.6, // schilddak: nok eindigt waar de hoekkepers beginnen
  platformX: 11.6, // verhoogd bordes op de kade
  platformZ: 2.9,
  wallHalfWidth: 0.45, // borstwering onder de buitenste zuilenrij
  wallHeight: 0.35,
};
const COLUMN = { r0: 0.25, r1: 0.21, pedestal: 0.7, pedestalH: 0.3, capital: 0.25 };

// ---------- stenen brug ----------
// Massief lichaam van de waterbodem tot net onder het wegdek, met drie gewelven.
let bridgeBody = profileY(
  roadProfile(-DECK.halfX, DECK.halfX, WATER_BOTTOM, -ROAD_THICKNESS + 0.02),
  -DECK.halfY,
  DECK.halfY,
);
const vaults = ARCHES.map(({ x, span, rise }) => {
  const half = span / 2;
  // Cirkelboog door de aanzetten en de kruin; halfrond als rise == half.
  const r = (half * half + rise * rise) / (2 * rise);
  const centreZ = SPRING + rise - r;
  return union([
    cylY(r, -DECK.halfY - 1, DECK.halfY + 1, x, centreZ, 96),
    boxFromTo(x - half, x + half, -DECK.halfY - 1, DECK.halfY + 1, WATER_BOTTOM - 1, SPRING + 0.05),
  ]);
});
bridgeBody = bridgeBody.subtract(union(vaults));

// Wegdek: dunne laag over de brug (één bandpolygoon, zodat er geen holtes
// tussen twee verschillend bemonsterde profielen ontstaan) en de hellingen
// tussen de galerijen, die 0,3 m over het dek doorlopen zodat alles aansluit.
const bandProfile = (from, to, thickness, steps = 24) => {
  const xs = Array.from({ length: steps + 1 }, (_, i) => from + ((to - from) * i) / steps);
  return [
    ...xs.map((x) => [x, roadZ(x) - thickness]),
    ...xs.reverse().map((x) => [x, roadZ(x)]),
  ];
};
const OVERLAP = 0.3;
const roadDeck = union([
  profileY(bandProfile(-DECK.halfX, DECK.halfX, ROAD_THICKNESS), -DECK.halfY, DECK.halfY),
  profileY(roadProfile(-RAMP_END, -DECK.halfX + OVERLAP, 1.6), -GALLERY.innerAxis + 0.6, GALLERY.innerAxis - 0.6),
  profileY(roadProfile(DECK.halfX - OVERLAP, RAMP_END, 1.6), -GALLERY.innerAxis + 0.6, GALLERY.innerAxis - 0.6),
]);

// ---------- galerijen ----------
function column(x, y, baseZ, topZ) {
  const { r0, r1, pedestal, pedestalH, capital } = COLUMN;
  const shaftTop = topZ - capital;
  return union([
    // De sokkel zakt 5 cm in de vloer, zodat hij ook op de helling aansluit.
    box(pedestal, pedestal, pedestalH + 0.05, x, y, baseZ - 0.05),
    cyl(shaftTop - baseZ - pedestalH, r0, r1, x, y, baseZ + pedestalH, 24),
    cyl(0.12, r1 + 0.07, r1 + 0.07, x, y, shaftTop, 24),
    box(0.55, 0.55, capital - 0.12, x, y, shaftTop + 0.12),
  ]);
}

function gallery(side) {
  // side = +1 (noordwest, +Y) of -1 (zuidoost, -Y); alles wordt in y gespiegeld.
  const s = side;
  const g = GALLERY;
  const centreY = (g.innerAxis + g.outerAxis) / 2; // 6,0 m
  const parts = [];

  // Bordessen op beide kades met twee treden aan het uiteinde.
  for (const dir of [-1, 1]) {
    const x0 = dir * (DECK.halfX - 0.3); // overlapt het bruglichaam
    const x1 = dir * g.platformX;
    parts.push(
      boxFromTo(Math.min(x0, x1), Math.max(x0, x1), s * (g.innerAxis - 0.6), s * (g.outerAxis + 0.6), 1.6, g.platformZ),
      boxFromTo(Math.min(x1, x1 + dir * 0.4), Math.max(x1, x1 + dir * 0.4), s * (g.innerAxis - 0.6), s * (g.outerAxis + 0.6), 1.6, g.platformZ - 0.17),
      boxFromTo(Math.min(x1 + dir * 0.4, x1 + dir * 0.8), Math.max(x1 + dir * 0.4, x1 + dir * 0.8), s * (g.innerAxis - 0.6), s * (g.outerAxis + 0.6), 1.6, g.platformZ - 0.34),
    );
  }
  const floorZ = (x) => (Math.abs(x) > DECK.halfX ? g.platformZ : roadZ(x));

  // Lage borstwering onder de buitenste zuilenrij, volgt het wegdek.
  parts.push(
    profileY(
      roadProfile(-g.entablatureEndX, g.entablatureEndX, 1.6, g.wallHeight).map(([x, z]) => [
        x,
        Math.abs(x) > DECK.halfX && z > 1.6 ? Math.max(z, g.platformZ + g.wallHeight) : z,
      ]),
      Math.min(s * (g.outerAxis - g.wallHalfWidth), s * (g.outerAxis + g.wallHalfWidth)),
      Math.max(s * (g.outerAxis - g.wallHalfWidth), s * (g.outerAxis + g.wallHalfWidth)),
    ),
  );

  // Zuilen: hoek, enkel, paar (in het risalietvlak), kopse middenzuil.
  const columns = [];
  for (const dir of [-1, 1]) {
    for (const y of [g.innerAxis, g.outerAxis]) {
      const outer = y === g.outerAxis;
      const risalitY = outer ? y + g.risalitDepth : y - g.risalitDepth;
      columns.push([dir * g.cornerX, y], [dir * g.singleX, y]);
      for (const px of g.pairX) columns.push([dir * px, risalitY]);
    }
    columns.push([dir * g.cornerX, centreY]);
  }
  for (const [x, y] of columns) {
    const onWall = Math.abs(y - g.outerAxis) < 0.01;
    const base = floorZ(x) + (onWall ? g.wallHeight : 0);
    parts.push(column(x, s * y, base, g.entablatureBottom));
  }

  // Hoofdgestel met uitspringend middenrisaliet en kroonlijst.
  const yIn = g.innerAxis - g.entablatureInset;
  const yOut = g.outerAxis + g.entablatureInset;
  const ent = (y0, y1, x0, x1, z0, z1) =>
    boxFromTo(x0, x1, Math.min(s * y0, s * y1), Math.max(s * y0, s * y1), z0, z1);
  parts.push(
    ent(yIn, yOut, -g.entablatureEndX, g.entablatureEndX, g.entablatureBottom, g.entablatureTop),
    ent(yIn - g.risalitDepth, yOut + g.risalitDepth, -g.risalitHalfX, g.risalitHalfX, g.entablatureBottom, g.entablatureTop),
    ent(yIn - 0.2, yOut + 0.2, -g.entablatureEndX - 0.2, g.entablatureEndX + 0.2, g.entablatureTop - 0.25, g.entablatureTop),
  );

  // Schilddak: convex omhulsel van de dakrand en de nok.
  const eaveIn = s * (g.innerAxis - g.eaveInset);
  const eaveOut = s * (g.outerAxis + g.eaveInset);
  const roofBase = g.entablatureTop;
  const hip = Manifold.hull([
    boxFromTo(-g.eaveX, g.eaveX, Math.min(eaveIn, eaveOut), Math.max(eaveIn, eaveOut), roofBase, roofBase + 0.05),
    boxFromTo(-g.ridgeEndX, g.ridgeEndX, s * centreY - 0.05, s * centreY + 0.05, g.ridgeZ - 0.05, g.ridgeZ),
  ]);
  // Dwarskap met frontons aan de weg- en de waterzijde.
  const gableY0 = s * (g.innerAxis - g.entablatureInset - g.risalitDepth - 0.15);
  const gableY1 = s * (g.outerAxis + g.entablatureInset + g.risalitDepth + 0.15);
  const gable = profileY(
    [
      [-g.risalitHalfX - 0.15, roofBase],
      [g.risalitHalfX + 0.15, roofBase],
      [0, g.ridgeZ],
    ],
    Math.min(gableY0, gableY1),
    Math.max(gableY0, gableY1),
  );
  let roof = union([hip, gable]);
  // Oculus (krans) in het fronton aan de waterzijde, stadswapen aan de wegzijde.
  const tympanumZ = roofBase + 1.0;
  roof = roof.subtract(cylY(0.45, gableY1 - s * 0.12, gableY1 + s * 0.12, 0, tympanumZ, 32));
  parts.push(roof);
  parts.push(box(1.0, 0.12, 1.1, 0, gableY0 - s * 0.05, tympanumZ - 0.55));

  return union(parts);
}

const galleries = union([gallery(1), gallery(-1)]);

// Voor de print krijgen de delen op de kades een massieve onderbouw tot de
// vlakke onderkant van de brug, zodat het geheel op de printplaat staat.
const quayBlocks = union(
  [-1, 1].map((dir) =>
    boxFromTo(
      Math.min(dir * DECK.halfX, dir * (RAMP_END + 0.2)),
      Math.max(dir * DECK.halfX, dir * (RAMP_END + 0.2)),
      -GALLERY.outerAxis - 0.6,
      GALLERY.outerAxis + 0.6,
      WATER_BOTTOM,
      1.7,
    ),
  ),
);
const printModel = union([roadDeck, bridgeBody, galleries, quayBlocks]);
// Het printmodel eerst doorrekenen: de wegdeklagen hieronder veranderen de STL
// zo niet (die bevat de brug als geheel, zoals voorheen).
printModel.numTri();

// ---------- rijweg en voetpaden als eigen onderdelen ----------
// De bovenste 0,5 m van het wegdek is per BGT-functie een eigen node met de
// attributen van het BGT-wegdeel (glTF `extras.attributes`), zodat de
// kleurregels van een thema op de brug werken zoals op de PDOK-wegdelen
// ernaast. Contouren: de actuele BGT-wegdelen in het lokale stelsel,
// vereenvoudigd tot 5 cm. Op het dek (relatieve hoogteligging 1) liggen de
// rijweg tussen de galerijen en de voetpaden onder de galerijen; op de
// hellingen naar de kades (hoogteligging 0) dezelfde rijweg.
const LAYER = 0.5;
const ABOVE = 1.0;
// Rijweg in sierbestrating: G0546.55afdee0 (dek, midden), G0546.20d2fd1b (dek,
// strook langs de noordwestelijke galerij), G0546.d3209d0d en G0546.e05d0edd
// (hellingen, midden).
const ROAD_ATTRIBUTES = {
  bgt_functie: "rijbaan lokale weg",
  bgt_fysiekvoorkomen: "open verharding",
  plus_fysiekvoorkomen: "sierbestrating",
};
const DECORATIVE = [
  [[9.43, -2.15], [9.43, -1.45], [8.87, -1.47], [8.85, 1.15], [9.4, 1.16], [9.39, 2.28], [-9.11, 2.2], [-9.13, 1.31],
    [-8.58, 1.31], [-8.56, -1.23], [-9.07, -1.22], [-9.08, -2.19]],
  [[9.39, 2.28], [9.39, 2.38], [8.86, 2.42], [8.8, 3.22], [8.08, 3.22], [8.08, 3.08], [7.54, 3.08], [7.54, 3.22],
    [4.14, 3.21], [4.14, 2.89], [3.6, 2.88], [3.59, 3.03], [3.15, 3.03], [3.15, 2.89], [2.61, 2.89], [2.61, 3.02],
    [-2.41, 3], [-2.41, 2.84], [-2.96, 2.84], [-2.96, 3.01], [-3.39, 3.01], [-3.39, 2.84], [-3.98, 2.85], [-3.99, 3.19],
    [-7.37, 3.16], [-7.37, 3.03], [-7.91, 3.03], [-7.91, 3.16], [-8.54, 3.15], [-8.55, 2.54], [-9.1, 2.53], [-9.11, 2.2]],
  [[-9.11, 2.2], [-11.9, 2.19], [-11.89, -2.2], [-9.08, -2.19], [-9.07, -1.22], [-8.56, -1.23], [-8.58, 1.31], [-9.13, 1.31]],
  [[12.03, 2.3], [9.39, 2.28], [9.4, 1.16], [8.85, 1.15], [8.87, -1.47], [9.43, -1.45], [9.43, -2.15], [12.06, -2.15]],
];
// Rijweg in gebakken klinkers: G0546.ef356bbf (dek, strook langs de
// zuidoostelijke galerij), G0546.992a05b8, G0546.47c938d5, G0546.dc1d0a30 en
// G0546.2f90c016 (hellingen, randen) en voorbij x = ±11,8 de kadestraten
// (G0546.4598eddb, G0546.cd445e68), waar de hellingen eindigen.
const PAVER_ATTRIBUTES = {
  bgt_functie: "rijbaan lokale weg",
  bgt_fysiekvoorkomen: "open verharding",
  plus_fysiekvoorkomen: "gebakken klinkers",
};
const PAVERS = [
  [[2.62, -2.97], [2.62, -2.83], [3.16, -2.82], [3.17, -2.97], [3.6, -2.97], [3.61, -2.8], [4.15, -2.82], [4.14, -3.13],
    [7.56, -3.12], [7.55, -2.99], [8.11, -2.98], [8.11, -3.11], [8.83, -3.11], [8.85, -2.72], [9.44, -2.73], [9.43, -2.15],
    [-9.08, -2.19], [-9.08, -2.42], [-8.54, -2.42], [-8.5, -3.18], [-7.9, -3.18], [-7.9, -3.04], [-7.35, -3.04],
    [-7.35, -3.17], [-3.94, -3.16], [-3.95, -2.84], [-3.39, -2.84], [-3.39, -3], [-2.95, -3], [-2.95, -2.84], [-2.4, -2.84],
    [-2.4, -3]],
  [[-8.5, -3.18], [-8.54, -2.42], [-9.08, -2.42], [-9.08, -2.19], [-11.89, -2.2], [-11.89, -3.06], [-11.34, -3.03], [-11.33, -3.19]],
  [[-8.54, 3.15], [-11.36, 3.13], [-11.37, 3], [-11.9, 3.03], [-11.9, 2.26], [-11.9, 2.19], [-9.11, 2.2], [-9.1, 2.53], [-8.55, 2.54]],
  [[11.53, -3.1], [11.53, -2.99], [12.06, -2.99], [12.06, -2.15], [9.43, -2.15], [9.44, -2.73], [8.85, -2.72], [8.83, -3.11]],
  [[12.03, 2.3], [12.02, 3.12], [11.44, 3.11], [11.44, 3.22], [11.16, 3.22], [8.8, 3.22], [8.86, 2.42], [9.39, 2.38], [9.39, 2.28]],
];
const QUAY_STREET_X = 11.8;
// Voetpaden onder de galerijen: G0546.fede8693 (zuidoost) en G0546.500a897d
// (noordwest). Waar de BGT tussen voetpad en rijweg een zuil uitspaart
// (|y| < 3,7), staat in het model geen zuil (die staan iets anders); daar
// loopt het voetpad door.
const FOOTPATH_HALF_Y = 3.7;
const FOOTPATH_ATTRIBUTES = {
  bgt_functie: "voetpad",
  bgt_fysiekvoorkomen: "open verharding",
  plus_fysiekvoorkomen: "gebakken klinkers",
};
const FOOTPATHS = [
  [[4.15, -8.74], [4.16, -9.01], [7.57, -8.93], [7.56, -8.55], [8.1, -8.53], [8.11, -8.95], [8.46, -8.95], [8.83, -3.11],
    [8.11, -3.11], [8.12, -3.54], [7.56, -3.55], [7.56, -3.12], [4.14, -3.13], [4.13, -3.36], [3.59, -3.34], [3.6, -2.97],
    [3.17, -2.97], [3.17, -3.37], [2.62, -3.38], [2.62, -2.97], [-2.4, -3], [-2.41, -3.39], [-2.96, -3.39], [-2.95, -3],
    [-3.39, -3], [-3.39, -3.39], [-3.94, -3.39], [-3.94, -3.16], [-7.35, -3.17], [-7.34, -3.6], [-7.9, -3.59], [-7.9, -3.18],
    [-8.5, -3.18], [-8.14, -9.03], [-7.85, -9.01], [-7.85, -8.58], [-7.32, -8.58], [-7.32, -9.01], [-3.91, -8.99],
    [-3.91, -8.77], [-3.37, -8.77], [-3.37, -9.17], [-2.93, -9.17], [-2.93, -8.77], [-2.37, -8.77], [-2.37, -9.17],
    [2.63, -9.16], [2.62, -8.74], [3.16, -8.73], [3.17, -9.15], [3.61, -9.15], [3.6, -8.74]],
  [[7.54, 3.22], [7.54, 3.62], [8.08, 3.62], [8.08, 3.22], [8.8, 3.22], [8.42, 9.06], [8.08, 9.05], [8.09, 8.62],
    [7.54, 8.61], [7.52, 9.04], [4.13, 9.01], [4.13, 8.85], [3.58, 8.81], [3.58, 9.21], [3.16, 9.21], [3.16, 8.8],
    [2.6, 8.8], [2.61, 9.22], [-2.42, 9.21], [-2.42, 8.78], [-2.97, 8.78], [-2.97, 9.21], [-3.4, 9.2], [-3.4, 8.78],
    [-3.96, 8.78], [-3.96, 8.99], [-7.39, 9.01], [-7.39, 8.59], [-7.9, 8.57], [-7.91, 9.01], [-8.43, 9.01], [-8.54, 3.15],
    [-7.91, 3.16], [-7.92, 3.58], [-7.37, 3.59], [-7.37, 3.16], [-3.99, 3.19], [-3.99, 3.4], [-3.39, 3.4], [-3.39, 3.01],
    [-2.96, 3.01], [-2.96, 3.4], [-2.4, 3.39], [-2.41, 3], [2.61, 3.02], [2.61, 3.43], [3.15, 3.43], [3.15, 3.03],
    [3.59, 3.03], [3.59, 3.43], [4.13, 3.44], [4.14, 3.21]],
];
// Prisma van een contour (tegen de klok in of niet) over de hele hoogte.
const prism = (poly) => {
  let area = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % poly.length];
    area += x0 * y1 - x1 * y0;
  }
  return Manifold.extrude([area > 0 ? poly : [...poly].reverse()], 20).translate([0, 0, -5]);
};
// De brug als geheel: stenen lichaam en wegdek. De bordessen van de galerijen
// stonden tot 0,3 m over het dek met hun bovenvlak (2,9 m) op de hoogte van
// het wegdek bij het landhoofd; daar vochten ze met het dek (z-fighting). In
// de GLB houden de galerijen daarom op waar de brug begint (alleen in de strook
// x = ±7,9 tot ±8,4); de vorm van het geheel verandert niet.
const bridge = union([roadDeck, bridgeBody]);
const abutmentZone = union(
  [-1, 1].map((dir) => boxFromTo(dir * 7.9, dir * 8.4, -10, 10, 1.5, 3.0)),
);
const galleriesGlb = galleries.subtract(bridge.intersect(abutmentZone));
// Snijstrook over dezelfde profielen als het wegdek (dek en hellingen, met
// dezelfde stations), van 0,5 m onder tot 1 m boven het wegdek; zo houdt de
// constructie binnen de strook geen eigen vlak op het wegdek over.
const layerProfile = (from, to, steps = 24) => {
  const xs = Array.from({ length: steps + 1 }, (_, i) => from + ((to - from) * i) / steps);
  return [
    ...xs.map((x) => [x, roadZ(x) - LAYER]),
    ...xs.reverse().map((x) => [x, roadZ(x) + ABOVE]),
  ];
};
const strip = union([
  profileY(layerProfile(-DECK.halfX, DECK.halfX), -DECK.halfY - 0.1, DECK.halfY + 0.1),
  profileY(layerProfile(-RAMP_END, -DECK.halfX + OVERLAP), -3.4, 3.4),
  profileY(layerProfile(DECK.halfX - OVERLAP, RAMP_END), -3.4, 3.4),
]);
// Wat op het dek staat en bouwwerk blijft: zuilen met sokkels, borstweringen
// en bordessen van de galerijen, als verticaal prisma van hun voetafdruk in de
// hoogte van de strook, 2 cm groter.
const guard = Manifold.extrude(
  galleriesGlb.intersect(boxFromTo(-14, 14, -11, 11, 1.4, 4.6)).project().offset(0.02, "Round"),
  20,
).translate([0, 0, -5]);
const layer = strip.subtract(guard);
const decorativeZone = union(DECORATIVE.map(prism));
const paverZone = union([
  ...PAVERS.map(prism),
  boxFromTo(-14, -QUAY_STREET_X, -5, 5, -5, 15),
  boxFromTo(QUAY_STREET_X, 14, -5, 5, -5, 15),
]).subtract(decorativeZone);
const footpathZone = union([
  ...FOOTPATHS.map(prism),
  boxFromTo(-14, 14, -FOOTPATH_HALF_Y, FOOTPATH_HALF_Y, -5, 15),
])
  .subtract(decorativeZone)
  .subtract(paverZone);
const roadCut = layer.intersect(decorativeZone);
const paverCut = layer.intersect(paverZone);
const footpathCut = layer.intersect(footpathZone);
const roadway = roadCut.intersect(bridge);
const paving = paverCut.intersect(bridge);
const footpath = footpathCut.intersect(bridge);
// Constructie = brug − de hele wegdeklaag (de zones samen, zonder de naden
// tussen de wegdelen, die anders als vlakjes zonder volume achterblijven).
const structure = bridge.subtract(
  layer.intersect(union([decorativeZone, paverZone, ...FOOTPATHS.map(prism), boxFromTo(-14, 14, -FOOTPATH_HALF_Y, FOOTPATH_HALF_Y, -5, 15)])),
);

// Onderdelen per materiaalklasse: de wegdelen als weg, de stenen brug en de
// houten galerijen als bouwwerk. De nodenaam `klasse:label` stuurt de catalogus.
const parts = [
  ["road:rijbaan", roadway, ROAD_ATTRIBUTES],
  ["road:rijbaan-klinkers", paving, PAVER_ATTRIBUTES],
  ["road:voetpad", footpath, FOOTPATH_ATTRIBUTES],
  ["building:boogbrug", structure],
  ["building:galerijen", galleriesGlb],
];

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(3),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
// Partitiecontrole: de wegdelen en de constructie vullen samen precies de
// brug, en de wegdelen raken de galerijen niet.
const bridgeParts = parts.filter(([name]) => name !== "building:galerijen");
const partsVolume = bridgeParts.reduce((sum, [, solid]) => sum + solid.volume(), 0);
report.partition = {
  bridgeM3: +bridge.volume().toFixed(3),
  sumOfPartsM3: +partsVolume.toFixed(3),
  differenceM3: +(partsVolume - bridge.volume()).toFixed(4),
  roadsInGalleriesM3: +union([roadway, paving, footpath]).intersect(galleriesGlb).volume().toFixed(4),
  galleriesClippedM3: +(galleries.volume() - galleriesGlb.volume()).toFixed(3),
};
const glbFile = path.join(outDir, "koornbrug-leiden.glb");
await writeFile(glbFile, toGlb(parts, "NederPrint generate-koornbrug.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `koornbrug-leiden-1-${scale}.stl`);
const { buffer, triangles } = toStl(printModel, `NederPrint Koornbrug Leiden 1:${scale} mm Z-up +X=NO`);
await writeFile(stlFile, buffer);
const bb = printModel.boundingBox();
report.stl = {
  file: stlFile,
  status: printModel.status(),
  genus: printModel.genus(),
  triangles,
  volumeCm3: +((printModel.volume() * mmPerMetre ** 3) / 1000).toFixed(1),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

// Catalogusitem voor lib/server/landmark-catalog.ts. Het maaiveld dat de lader
// rond de voetafdruk bemonstert is hier het water van de Nieuwe Rijn; daarom
// ligt z = 0 van het model op de waterspiegel en zakken de pijlers 0,8 m
// daaronder. Geen extra verzinking nodig.
await writeFile(
  path.join(outDir, "koornbrug-leiden.json"),
  JSON.stringify(
    {
      name: "Koornbrug",
      file: "koornbrug-leiden.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: [93741.6, 463689.5],
      xAxis: [0.842, 0.539],
      groundOffsetMetres: 0,
      replacesTerrain: [
        "G0546.1ce41d19bf124d7a8a6ab7e3209c7c23",
      ],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van het brugdek op de waterspiegel van de Nieuwe Rijn (z = 0, circa -0,6 m NAP), +X loopt langs de overspanning naar de Burgsteeg (noordoost) en +Y langs het water naar het noordwesten. De lader bemonstert het laagste maaiveld rond de voetafdruk en vindt hier het water, vandaar geen verzinking. Vijf nodes: road:rijbaan, road:rijbaan-klinkers en road:voetpad, de bovenste 0,5 m van het wegdek op het dek en de hellingen met de attributen van de BGT-wegdelen in extras.attributes (bgt_functie rijbaan lokale weg of voetpad, bgt_fysiekvoorkomen open verharding, plus_fysiekvoorkomen sierbestrating voor het midden van de rijweg en gebakken klinkers voor de randstrook in het zuidoosten, de randen van de hellingen en de voetpaden onder de galerijen), zodat de kleurregels van een thema erop werken; building:boogbrug, de rest van de stenen brug met de drie gewelven; en building:galerijen, de twee galerijen met zuilen, borstweringen, bordessen en daken (de zuilen, borstweringen en bordessen blijven met 2 cm rondom buiten de wegdelen). Nodenamen klasse:label bepalen de materiaalklasse.",
      printFiles: [`koornbrug-leiden-1-${scale}.stl`],
      realWorld: {
        deckLengthM: DECK.halfX * 2,
        deckWidthM: DECK.halfY * 2,
        archSpansM: ARCHES.map((arch) => arch.span),
        crownAboveWaterM: CROWN,
        quayAboveWaterM: QUAY,
        galleryLengthM: GALLERY.eaveX * 2,
        galleryWidthM: GALLERY.outerAxis - GALLERY.innerAxis + 2 * GALLERY.eaveInset,
        entablatureTopAboveWaterM: GALLERY.entablatureTop,
        ridgeAboveWaterM: GALLERY.ridgeZ,
        columnsPerGallery: 18,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/Koornbrug",
        "https://monumentenregister.cultureelerfgoed.nl/monumenten/25673",
        "PDOK BGT overbruggingsdeel (dek, landhoofd, pijler), EPSG:28992",
        "PDOK BGT wegdeel (OGC API): rijweg en voetpaden op het dek en de hellingen, met functie en fysiek voorkomen",
        "PDOK AHN DSM/DTM 0,5 m via WCS voor dek-, kade-, kroonlijst- en nokhoogte",
        "PDOK luchtfoto (Actueel_orthoHR) voor de dakplattegrond van de galerijen",
        "Wikimedia Commons: Leiden Koornbrug.jpg, Leiden - Koornbrug2.JPG, Aanzicht - Leiden - 20137477 - RCE.jpg, Overzicht exterieur - Leiden - 20134856 - RCE.jpg, Leiden - Koornbrug1.JPG",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

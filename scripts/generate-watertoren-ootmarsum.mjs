// Watertoren van Ootmarsum op de Kuiperberg (Almelosestraat 65), gebouwd in 1934 (rijksmonument 513204; Wikipedia en het
// register: 9,05 m hoog, de laagste watertoren van Nederland, reservoir 216 m³). Twee geometrische volumes in rode
// machinale baksteen: een cilinder met het betonnen vlakbodemreservoir op een bakstenen plint, met een betonnen dakrand,
// en een vierkante traptoren die er gedeeltelijk in staat. De traptoren heeft drie zeer hoge smalle spleetvensters in de
// westgevel en de ingang (deur onder een rondboog, vijf treden op het talud) in de noordgevel.
//
// Oorsprong op het hart van de cilinder: cirkelfit op de 21 boogpunten van BAG-pand 1774100000252343 (RD [256855.32,
// 492037.03], straal 4,32 m, restfout 0,06 m). Lokale +X loopt van de westgevel van de traptoren naar het hart van de
// cilinder (RD 15,8 graden: de zijgevels van de traptoren in de BAG liggen op 15,75 en 16,19 graden, de westgevel op
// 15,79 + 90); +Y wijst dan naar het noordnoordwesten (de noordgevel met de ingang). De traptoren is in de BAG 4,11 m
// breed en steekt 2,43 m buiten de cilinder uit; het register noemt hem vierkant, dus 4,11 × 4,11 m (x van -6,24 tot
// -2,13). Het AHN-DSM ziet het dak van de traptoren tot circa RD-x 256853, dus tot x ≈ -2,2: dat klopt.
//
// Maaiveld: de toren staat op een eigen kop van de Kuiperberg die in het PDOK-terrein zit (AHN-DTM op 5 m van het hart
// NAP +66,2 tot 66,5, op 9 m 65,0 tot 66,3; 3D BAG-maaiveld 65,25 is het laagste punt). Het model staat op z = 0 = de
// laagste PDOK-terreinhoogte op de groundSamplePoints (oost, op 5 m van het hart; ellipsoïdisch 109,26, NAP circa 66,26),
// de rest van de voet zit tot 0,3 m in de heuvel. De heuvel zelf staat niet in het model.
// Hoogtes uit het AHN-DSM 0,5 m (2026-11-06): dak cilinder NAP +73,15 (3D BAG 50e percentiel 73,17), dakrand 74,0 tot
// 74,1, dak traptoren 75,85 tot 75,93 (3D BAG h_dak_max 75,93, PDOK-pand tot ellipsoïdisch 118,88).
// Opstand uit "Ootmarsum Watertoren 8948.JPG" (Commons, 10 december 2006 12:38 uur: zon in het zuiden, dus vanuit het
// zuidwesten: links de westgevel met de spleten, rechts de zuidgevel van de traptoren en de zonnige zuidkant van de
// cilinder met plint en dakrand; schaal circa 150 px/m uit de hoogte van de traptoren).
const argv = process.argv;
if (!argv.includes("--scale")) argv.push("--scale", "100"); // los printen op 1:100 (het model is kleiner dan 20 m)
const { hull, union, prism, circle, box, place, writeLandmark } = await import("./efteling-kit.mjs");

const ORIGIN = [256855.32, 492037.03];
const DEG = 15.8;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const NAP0 = 66.26; // NAP-hoogte van z = 0 (PDOK-terrein aan de oostkant, ellipsoïdisch 109,26 min 43,0)
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: oost 109,26, noord 109,40,
// zuid 109,46, west (voor de traptoren) 109,52.
const GROUND_ELLIPSOID = 109.26;
const N = 96; // segmenten van de cilinder

// Hoogtes boven z = 0.
const H = {
  plinth: 1.2, // bovenkant van de bakstenen plint (foto: circa 1,2 m boven het maaiveld aan de zuidkant), afzaat 45 graden
  roof: 73.15 - NAP0, // dak van de cilinder binnen de dakrand
  copingFoot: 7.15, // onderkant van de betonnen dakrand (45 graden)
  coping: 7.28,
  rim: 74.05 - NAP0, // bovenkant van de dakrand
  stairCapFoot: 9.37,
  stairCap: 9.45,
  stair: 75.88 - NAP0, // dak van de traptoren
  slits: [3.7, 8.8], // spleetvensters in de westgevel (foto)
  door: [0, 2.25, 2.95], // deur: onderkant, aanzet van de boog, top
};

// Cilinder (straal uit de BAG), plint en dakrand.
const R = 4.32;
const R_PLINTH = 4.42;
const R_COPING = 4.45;
const PARAPET = 0.9; // de dakrand met borstwering als ring van 0,9 m (in het echt circa 0,5 m), printbaar op 1:1000

// Traptoren: vierkant van 4,11 m, westgevel op x = -6,24, y van -2,055 tot 2,055.
const SX0 = -6.24;
const SX1 = SX0 + 4.11;
const SY = 2.055;
const CAP = 0.08; // overstek van de betonnen daklijst

const ring = (r, z) => circle([0, 0], r, N).map(([x, y]) => [x, y, z]);

// ---------- cilinder ----------
const plinth = union([
  prism(circle([0, 0], R_PLINTH, N), BASE, H.plinth),
  hull([...ring(R_PLINTH, H.plinth - 0.01), ...ring(R, H.plinth + (R_PLINTH - R))]),
]);
const drumWall = prism(circle([0, 0], R, N), BASE, H.copingFoot);
const coping = hull([...ring(R, H.copingFoot - 0.01), ...ring(R_COPING, H.coping), ...ring(R_COPING, H.rim)]);
// Dak binnen de dakrand, verdiept tot het dak van het reservoir.
const roofWell = prism(circle([0, 0], R_COPING - PARAPET, N), H.roof, H.rim + 1);
const drum = union([plinth, drumWall, coping]).subtract(roofWell);

// ---------- traptoren ----------
const stairBody = box(SX0, -SY, BASE, SX1, SY, H.stairCapFoot);
const stairCap = hull([
  [SX0, -SY, H.stairCapFoot - 0.01], [SX1, -SY, H.stairCapFoot - 0.01], [SX1, SY, H.stairCapFoot - 0.01], [SX0, SY, H.stairCapFoot - 0.01],
  ...[H.stairCap, H.stair].flatMap((z) => [[SX0 - CAP, -SY - CAP, z], [SX1 + CAP, -SY - CAP, z], [SX1 + CAP, SY + CAP, z], [SX0 - CAP, SY + CAP, z]]),
]);

// Nis in het vlak met normaal +X (vlak op x = f), breedte wd rond y, plafond onder 56 graden naar binnen oplopend.
const niche = (f, wd, z0, z1, depth, y = 0) => {
  const y0 = y - wd / 2, y1 = y + wd / 2, za = z1 + 1.5 * depth, out = Math.min(1, (z1 - z0) / 1.5);
  return hull([
    [f - depth, y0, z0], [f + out, y0, z0], [f - depth, y1, z0], [f + out, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + out, y0, z1 - 1.5 * out], [f + out, y1, z1 - 1.5 * out],
  ]);
};
// Nis met een spitse top (zijden van 52 graden) in het vlak met normaal +X: de deur onder de rondboog.
const archNiche = (f, wd, z0, zs, zt, depth, y = 0) => {
  const prof = [[y - wd / 2, z0], [y + wd / 2, z0], [y + wd / 2, zs], [y, zt], [y - wd / 2, zs]];
  return hull([...prof.map(([v, z]) => [f - depth, v, z]), ...prof.map(([v, z]) => [f + 0.5, v, z])]);
};

// Drie spleetvensters van 0,3 m (in het echt circa 0,15 m) om de 0,48 m in het midden van de westgevel (normaal -X).
const slits = [-0.48, 0, 0.48].map((y) => place(niche(-SX0, 0.3, H.slits[0], H.slits[1], 0.3, -y), { deg: 180 }));
// Deur in de noordgevel (normaal +Y) midden in het deel buiten de cilinder (x van -6,24 tot -3,79): 1,1 m breed.
const doorX = (SX0 + -Math.sqrt(R * R - SY * SY)) / 2;
const door = place(archNiche(SY, 1.1, BASE - 0.1, H.door[1], H.door[2], 0.35, -doorX), { deg: 90 });

const stair = union([stairBody, stairCap]).subtract(union([...slits, door]));

const building = union([drum, stair]);

await writeLandmark({
  slug: "watertoren-ootmarsum",
  base: BASE,
  nodes: [["building:reservoircilinder-met-plint-en-dakrand-en-vierkante-traptoren", building]],
  catalog: {
    name: "Watertoren Ootmarsum",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: [[5, 0], [0, 5], [0, -5], [-7, 0]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1774100000252343"],
    description:
      "Oorsprong op het hart van de reservoircilinder (BAG-cirkelfit, straal 4,32 m) op het maaiveld van de Kuiperberg (NAP circa +66,3 m), +X van de westgevel van de traptoren naar het hart (RD 15,8 graden), +Y naar het noordnoordwesten. Bakstenen cilinder op een plint met betonnen dakrand tot 7,8 m en een verdiept dak op 6,9 m; vierkante traptoren van 4,11 m die half in de cilinder staat, met drie hoge spleetvensters in de westgevel, de deur onder een boog in de noordgevel en een betonnen daklijst tot 9,6 m (NAP +75,9). Maten uit BAG, AHN, 3D BAG, het register en één foto.",
    realWorld: {
      built: 1934,
      registerHeightM: 9.05,
      reservoirM3: 216,
      rijksmonument: 513204,
      groundNapM: NAP0,
      ahnDrumRoofNapM: 73.15,
      ahnRimNapM: 74.05,
      ahnStairRoofNapM: 75.88,
      drumDiameterM: 2 * R,
      stairTowerM: 4.11,
      rimM: +H.rim.toFixed(2),
      stairM: +H.stair.toFixed(2),
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Ootmarsum) (1934, 9,05 m, 216 m³, Kuiperberg)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/513204 (cilinder met vlakbodemreservoir op bakstenen plint, betonnen dakranden, vierkante traptoren deels in de cilinder, drie spleetvensters in de westgevel, deur onder rondboog in de noordgevel, vijf treden op het talud)",
      "https://commons.wikimedia.org/wiki/File:Ootmarsum_Watertoren_8948.JPG (2006, vanuit het zuidwesten: westgevel met spleetvensters, plint en dakrand van de cilinder, daklijst van de traptoren)",
      "PDOK BAG-pand 1774100000252343 (bouwjaar 1935), AHN DSM/DTM 0,5 m, luchtfoto en PDOK-terrein, 2026-11-06",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.1774100000252343: dakhoogtes en maaiveld, opgehaald 2026-11-06",
    ],
  },
});

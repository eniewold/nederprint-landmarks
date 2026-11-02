// Watertoren aan de Brandestraat (9) in Hooge Zwaluwe, net buiten Made, bij
// de rotonde met de Zuideindsestraat: 1948, ontwerp B. Oomen, volgens
// Wikipedia 43,9 m hoog met een reservoir van 600 m³, gemeentelijk monument
// van Drimmelen. Hij verving de watertoren van H. Sangster uit 1925, die op
// 29 oktober 1944 werd opgeblazen. Een ronde bakstenen schacht die licht naar
// boven toe versmalt, zonder zichtbaar reservoir: het reservoir zit binnen de
// schacht. Bovenaan een ring van twaalf kleine rondboogvensters, daaronder
// kleine vierkante trapvensters in verticale rijen, aan de straatkant een hoge
// rondboognis met de deur. De koperen dakrand kraagt uit boven de schacht;
// daarop een kegeldak van 36 graden met acht kleine dakkapellen met een
// rondboogdak en een makelaar met bol en windvaan.
//
// Oorsprong op het zwaartepunt van de BAG-contour (pand 1719100000009568, 1948,
// een cirkel met straal 6,52 m: de dakrand van bovenaf) op het maaiveld
// (AHN-DTM NAP +1,90; 3D BAG 1,58). +X wijst naar RD-oost: een ronde toren
// heeft geen hoofdas. Hoogtes uit het AHN-DSM 0,5 m: het dak is een rechte
// kegel (helling 0,733 tussen r 0,5 en 5,5 m, NAP +44,9 tot +41,2), met de top
// van de kegel op NAP +45,46 (43,56 m) en de makelaar tot NAP +46,2 (44,3 m).
// De rand op het DSM boven NAP +32 ligt op 6,0 tot 6,5 m (luchtfoto: rand
// 13,2 tot 13,5 m, door de perspectief iets vergroot). Vormen en verhoudingen
// uit de luchtfoto (acht dakkapellen op 15 + 45k graden, de toegangsstrook aan
// de zuidzuidoostkant) en Commons-foto's: rand/schacht bovenaan 1,10, de
// schacht wordt naar beneden circa 0,02 m per m breder.
import { hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [112632.6, 409602.8];
const AXIS = [1, 0]; // +X = RD-oost
const BASE = -0.3;
const GROUND_NAP = 1.9; // AHN-DTM in een ring van 8 tot 14 m (1,66 tot 1,97; per kwadrant 1,71 tot 1,94)
const GEOID_N = 43.83; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 72;

const R = {
  foot: 6.3, // schacht op het maaiveld
  top: 5.9, // schacht onder de dakrand (rand/schacht 1,10 op de foto's)
  eave: 6.5, // koperen dakrand (BAG-cirkel 6,52)
  dormer: 5.3, // voorkant van de dakkapellen (luchtfoto: hart op 4,65 m)
  finial: 0.45, // makelaar
};
const H = {
  corbel: 37.5, // begin van de kraag onder de dakrand
  eaveFoot: 38.1, // onderkant van de rechte dakrand
  eave: 38.8, // bovenkant van de dakrand = voet van het kegeldak
  apex: 43.56, // top van de kegel (AHN: NAP +45,46)
  finialTop: 44.3, // makelaar met bol (AHN-maximum NAP +46,2)
};
const SLOPE = (H.apex - H.eave) / R.eave; // 0,732: 36 graden
const roofZ = (r) => H.apex - SLOPE * r;
const shaftR = (z) => R.foot + ((R.top - R.foot) * z) / H.corbel;

const ring = (r, z, n = SEG) => ring3(circle([0, 0], r, n), z);

// ---------- schacht, dakrand en kegeldak ----------
const shaft = hull([...ring(R.foot, BASE), ...ring(R.top, H.corbel + 0.05)]);
// Dakrand: kraag van 45 graden naar de koperen rand, recht tot de voet van het dak, dan de kegel tot de top.
const roof = hull([...ring(R.top, H.corbel), ...ring(R.eave, H.eaveFoot), ...ring(R.eave, H.eave), [0, 0, H.apex]]);

// ---------- acht dakkapellen met een rondboogdak ----------
// Voorkant op 5,3 m uit het hart, 1,2 m breed, zijwanden tot 40,4 m, halfrond dak tot 41,0 m;
// naar achteren tot waar het dak de top van de boog bereikt.
const DORMER_W = 1.2, DORMER_SILL = 39.2, DORMER_SPRING = 40.4;
const arch = (w, z0, zs, n = 8) => [
  [-w / 2, z0], [w / 2, z0],
  ...Array.from({ length: n + 1 }, (_, i) => {
    const a = (Math.PI * i) / n;
    return [(w / 2) * Math.cos(a), zs + (w / 2) * Math.sin(a)];
  }),
];
const dormerBack = (H.apex - (DORMER_SPRING + DORMER_W / 2)) / SLOPE - 0.3;
const dormer = hull(arch(DORMER_W, DORMER_SILL, DORMER_SPRING).flatMap(([y, z]) => [[R.dormer, y, z], [dormerBack, y, z]]));
const DORMERS = Array.from({ length: 8 }, (_, k) => 15 + 45 * k);
const dormers = DORMERS.map((d) => place(dormer, { deg: d }));

// ---------- makelaar met bol ----------
const finial = hull([
  ...ring(R.finial, H.apex - 0.6, 16),
  ...ring(R.finial, 43.8, 16),
  ...ring(0.5, 44.0, 16),
  ...ring(0.3, 44.22, 16),
  [0, 0, H.finialTop],
]);

// ---------- vensters en deur als nissen ----------
// Rechthoekige nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = -w / 2, y1 = w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
// Rondboognis: de boog in het vlak (x = f), naar binnen 1,5 maal de diepte omhoog (plafond 56 graden).
const archNiche = (f, w, z0, zs, depth = 0.3) => {
  const prof = arch(w, z0, zs);
  return hull([
    ...prof.map(([y, z]) => [f, y, z]),
    ...prof.map(([y, z]) => [f - depth, y, z === z0 ? z0 : z + 1.5 * depth]),
    [f + 1.0, -w / 2, z0], [f + 1.0, w / 2, z0], [f + 1.0, -w / 2, zs - 1.0], [f + 1.0, w / 2, zs - 1.0],
  ]);
};

const DOOR_DEG = -75; // RD: zuidzuidoost, naar de inrit (BGT) en de Brandestraat
const ARCHED = Array.from({ length: 12 }, (_, k) => DOOR_DEG + 30 * k); // twaalf rondboogvensters
const STAIR_COLUMNS = [DOOR_DEG, DOOR_DEG + 60]; // twee rijen trapvensters, boven de deur en aan de oostkant
const STAIR_Z = [7.0, 13.5, 19.8, 25.5]; // middens van de trapvensters

const cuts = [
  // Rondboogvensters: 0,9 m breed, van 29,8 m tot de boog op 31,0 m (top 31,45 m).
  ...ARCHED.map((d) => place(archNiche(shaftR(30.5), 0.9, 29.8, 31.0), { deg: d })),
  // Trapvensters: 0,9 × 0,9 m.
  ...STAIR_COLUMNS.flatMap((d) => STAIR_Z.map((z) => place(niche(shaftR(z), 0.9, z - 0.45, z + 0.45), { deg: d }))),
  // Hoge rondboognis van 2,3 m breed tot 5,8 m, met daarin de deur van 1,4 × 3,0 m, 0,3 m dieper.
  place(archNiche(shaftR(3), 2.3, 0, 4.65), { deg: DOOR_DEG }),
  place(niche(shaftR(1.5) - 0.3, 1.4, 0, 3.0, 0.3), { deg: DOOR_DEG }),
];

const tower = union([shaft, roof, ...dormers, finial]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-hooge-zwaluwe",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-dakrand-en-kegeldak", tower]],
  catalog: {
    name: "Watertoren Hooge Zwaluwe",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8], [0, -8]],
    // Ellipsoïdisch: NAP +1,90 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.1719100000009568"],
    description:
      "Oorsprong op het zwaartepunt van de ronde BAG-contour op maaiveld (NAP +1,90 m), +X naar RD-oost. Ronde bakstenen schacht van 12,6 m doorsnede op het maaiveld tot 11,8 m bovenaan, een kraag van 45 graden naar de koperen dakrand van 13,0 m van 38,1 tot 38,8 m, een kegeldak van 36 graden tot 43,56 m met acht dakkapellen met een rondboogdak en een makelaar tot 44,3 m. Twaalf rondboogvensters op 30 m, twee rijen trapvensters en een hoge rondboognis met de deur (zuidzuidoost) als nissen. Maten uit BAG, AHN, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 43.9,
      reservoirM3: 600,
      built: 1948,
      architect: "B. Oomen",
      monument: "gemeentelijk monument Drimmelen",
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: [41.2, 44.9],
      ahnConeApexNapM: 45.46,
      ahnMaxNapM: 46.23,
      geoidNlgeo2018M: GEOID_N,
      bagRadiusM: 6.52,
      shaftDiameterFootM: R.foot * 2,
      shaftDiameterTopM: R.top * 2,
      eaveDiameterM: R.eave * 2,
      eaveM: [H.eaveFoot, H.eave],
      roofPitchDeg: +((Math.atan(SLOPE) * 180) / Math.PI).toFixed(1),
      dormers: DORMERS.length,
      archedWindows: ARCHED.length,
      coneApexM: H.apex,
      modelTopM: H.finialTop,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Hooge_Zwaluwe) (B. Oomen, 1948, 43,9 m, 600 m³; de coördinaten daar liggen 165 m westzuidwest van de toren)",
      "https://commons.wikimedia.org/wiki/File:Drimmelen-Made,_watertoren_IMG_0804_2022-03-28_15.29.jpg (schacht, vensters, dakkapellen)",
      "https://commons.wikimedia.org/wiki/File:Made_Watertoren_5924.JPG (deur, rondboognis, trapvensters boven de deur, dakrand)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Made_-_20335208_-_RCE.jpg (rand/schacht, versmalling, rondboogvensters, dakkapellen, makelaar)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_met_graafwerkzaamheden_op_de_voorgrond_-_Made_-_20335209_-_RCE.jpg (silhouet)",
      "PDOK BAG-pand 1719100000009568, BGT (pand, inrit), AHN DSM/DTM 0,5 m en luchtfoto 8 cm (acht dakkapellen), 2026-11-02",
      "3D BAG (LoD2.2) van pand 1719100000009568: maaiveld en dak ter controle",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,83 m) voor groundHeight",
    ],
  },
});

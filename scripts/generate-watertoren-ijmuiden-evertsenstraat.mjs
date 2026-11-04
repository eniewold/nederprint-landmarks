// Watertoren van het waterleidingcomplex Evertsenstraat in IJmuiden (Velsen), 1914-1915, naar ontwerp van W. de Vrind
// en D. Drost (rijksmonument 520689; sinds 2009 appartementen). Volgens het register 42,60 m hoog, op een vierkant
// grondplan: een gewapend betonskelet van twaalf buitenkolommen, in 1953 bepleisterd. Het onderste deel (tot circa
// 7,5 m) is een gesloten blok met plint, aan de oostkant de ingang met dubbele deur, bovenlicht en een omlijsting met
// fronton en jaartal 1915, aan de andere drie kanten een opliggend middenvlak met een dubbel venster. Daarboven, na een
// ver uitstekende lijst, de taps toelopende schacht met per zijde vier kolommen en drie terugliggende vlakken (onder een
// liggend vlak, daarboven trapsgewijs verdiepte staande vlakken met vensters), en bovenaan een band met twee vensters.
// Het reservoirdeel kraagt uit op een schuine kraag; midden op elke zijde een uitbouw (hier een halve regelmatige
// achthoek) op een console, aan de ene kant een terugliggend vlak met een venster, aan de andere (naast de zuidwest- of
// noordoosthoek) een groot uurwerk. De uitbouw aan de oostkant (wenteltrap) loopt boven de daklijst door als torentje
// met een achtzijdig tentdak. Het vierkante tentdak heeft een overstek en betonnen dakkapellen op de noord-, west- en
// zuidzijde.
//
// Oorsprong op het hart van BAG-pand 0453100000012284 (RD [102294.62, 497326.29]; de top van de AHN-piramide ligt
// 0,05 m ernaast) op het maaiveld van de heuvel, AHN-DTM NAP +13,1 (ring van 6,5 tot 7 m: +13,06 tot +13,17). De
// gevels staan op RD 13,3 graden (gemiddelde van de vier BAG-randen, 13,2 tot 13,4; de piramidefit op het AHN-DSM
// geeft 13,2); lokale +X is de normaal van de oostgevel met de ingang, +Y de noordgevel.
// Maten: BAG-pand (12,3 m); AHN-DSM 0,5 m (tentdak als vier vlakken: z = NAP 55,8 - 1,21 x afstand tot het hart, rms
// 0,14 m, dus 50,4 graden en de top op 42,7 m; daklijst op ±6,25 m en 35,1 m; dakkapellen 1,1 tot 1,4 m boven het
// dakvlak op 4 tot 5 m van het hart; torentje tot NAP +53,5); geledingen en breedtes uit de frontale foto "Watertoren
// IJmuiden 2019.jpg" (Commons, oostgevel, verticale beeldvlak; schaal op de daklijst uit het AHN) en de schuine foto's.
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [102294.62, 497326.29];
const DEG = 13.3;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
// De voet loopt 2,8 m door: aan de zuidkant daalt een smalle trap langs de gevel naar de kelder (PDOK-terrein
// NAP +10,4 tegen de gevel, de heuvel +12,8 tot +13,5), zodat de gevel daar tot op de bodem van de trap staat.
const BASE = -2.8;
const GROUND_NAP = 13.1;
const GROUND_ELLIPSOID = 56.29; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04 (56,29 tot 56,40)

// Alle maten als halve breedte (hart tot gevelvlak) en hoogte boven het maaiveld.
const A = {
  plinth: 6.15, // BAG-pand 12,3 m
  lower: 6.0, // onderste deel
  ledge: 6.25, // ver uitstekende lijst boven het onderste deel
  shaft0: 5.59, // schacht onderaan (foto: 0,93 x het onderste deel)
  shaft1: 4.99, // schacht onder de kraag (foto: 0,84 x op 23,6 m)
  res: 5.68, // reservoirdeel (foto: 0,946 x het onderste deel)
  eave: 6.25, // daklijst (AHN)
};
const H = {
  plinth: 0.8,
  lower: 6.75, // onderkant van de lijst
  ledge: [7.0, 7.7],
  panels: [8.4, 22.4], // terugliggende vlakken van de schacht
  panelBar: [10.1, 10.4], // tussen het liggende ondervlak en de staande vlakken
  shaftTop: 24.9, // aanzet van de kraag op de schacht
  res: 26.4, // onderkant reservoirdeel
  resPanels: [27.6, 33.9],
  cornice: [34.6, 35.1],
  apex: 42.7, // AHN: NAP 55,8
};
const ROOF_K = (H.apex - H.cornice[1]) / A.eave; // 1,216: 50,6 graden
const aShaft = (z) => A.shaft0 + ((A.shaft1 - A.shaft0) * (z - H.ledge[1])) / (H.shaftTop - H.ledge[1]);
const sq = (a, z) => [[a, a, z], [-a, a, z], [-a, -a, z], [a, -a, z]];
const four = (m, ks = [0, 1, 2, 3]) => ks.map((k) => place(m, { deg: 90 * k }));

// Nis in een verticaal vlak met normaal +X op x = f: breedte wd rond y, van z0 tot z1, diepte d, plafond onder 56 graden.
const niche = (f, wd, z0, z1, d, y = 0) => {
  const y0 = y - wd / 2, y1 = y + wd / 2, za = z1 + 1.5 * d;
  return hull([
    [f - d, y0, z0], [f + 1.0, y0, z0], [f - d, y1, z0], [f + 1.0, y1, z0],
    [f - d, y0, za], [f, y0, z1], [f - d, y1, za], [f, y1, z1], [f + 1.0, y0, z1 - 1.5], [f + 1.0, y1, z1 - 1.5],
  ]);
};
// Terugliggend vlak in de taps toelopende schachtgevel (normaal +X): tussen de fracties fa en fb van de halve breedte,
// van z0 tot z1, diepte d, plafond onder 45 graden. De zijkanten lopen mee met de verjonging.
const panel = (fa, fb, z0, z1, d, extra = 0, out = 0.8) => {
  const a0 = aShaft(z0) - extra, a1 = aShaft(z1) - extra;
  const s0 = aShaft(z0), s1 = aShaft(z1);
  return hull([
    [a0 - d, fa * s0, z0], [a0 - d, fb * s0, z0], [a0 + 0.8, fa * s0, z0], [a0 + 0.8, fb * s0, z0],
    [a1 - d, fa * s1, z1 - d], [a1 - d, fb * s1, z1 - d], [a1 + out, fa * s1, z1 + out], [a1 + out, fb * s1, z1 + out],
  ]);
};

// ---------- onderste deel, lijst en schacht ----------
const plinth = hull([...sq(A.plinth, BASE), ...sq(A.plinth, H.plinth), ...sq(A.lower, H.plinth + 0.15)]);
const lower = union([
  prism([[A.lower, A.lower], [-A.lower, A.lower], [-A.lower, -A.lower], [A.lower, -A.lower]], BASE, H.ledge[1]),
  plinth,
  hull([...sq(A.lower, H.lower), ...sq(A.ledge, H.ledge[0]), ...sq(A.ledge, H.ledge[1])]),
]);
const shaft = hull([...sq(A.shaft0, H.ledge[1] - 0.01), ...sq(A.shaft1, H.shaftTop)]);
// Schuine kraag onder het reservoirdeel (1,5 m hoog, 0,7 m uit; 24 graden).
const corbel = hull([...sq(A.shaft1, H.shaftTop - 0.01), ...sq(A.res, H.res)]);
const reservoir = prism([[A.res, A.res], [-A.res, A.res], [-A.res, -A.res], [A.res, -A.res]], H.res, H.cornice[0]);
const cornice = hull([...sq(A.res, H.cornice[0] - (A.eave - A.res)), ...sq(A.eave, H.cornice[0]), ...sq(A.eave, H.cornice[1])]);
// Vierkant tentdak: vier vlakken van 50,6 graden van de daklijst (±6,25 m, 35,1 m) naar de top op 42,7 m.
const roof = hull([...sq(A.eave, H.cornice[1] - 0.01), [0, 0, H.apex]]);
const roofZ = (d) => H.cornice[1] + (A.eave - d) * ROOF_K; // dakvlak op afstand d van het hart (normaal van een zijde)

// ---------- uitbouwen (halve regelmatige achthoek, apothema 1,69, hart 0,69 m binnen de gevel) ----------
const BAY_A = 1.69, BAY_C = A.res - 0.69;
const oct = (a, cx, z) => Array.from({ length: 8 }, (_, k) => {
  const t = (Math.PI / 8) * (2 * k + 1), r = a / Math.cos(Math.PI / 8);
  return [cx + r * Math.cos(t), r * Math.sin(t), z];
});
const bayPrism = (z0, z1) => hull([...oct(BAY_A, BAY_C, z0), ...oct(BAY_A, BAY_C, z1)]);
// Console onder de uitbouw: van de achthoek op de onderkant van het reservoirdeel schuin naar een hangende console van
// 0,9 m breed en 0,5 m diep op de schacht, die tot 23,2 m doorloopt met een onderkant onder 45 graden.
const sTop = aShaft(H.shaftTop);
const bayCorbel = hull([...oct(BAY_A, BAY_C, H.res), [sTop - 0.05, -0.45, 24.6], [sTop - 0.05, 0.45, 24.6], [sTop + 0.5, -0.45, 24.6], [sTop + 0.5, 0.45, 24.6]]);
const pendant = hull([
  [aShaft(23.2) - 0.05, -0.45, 23.2], [aShaft(23.2) - 0.05, 0.45, 23.2], [aShaft(23.8) + 0.5, -0.45, 23.8], [aShaft(23.8) + 0.5, 0.45, 23.8],
  [sTop - 0.05, -0.45, 24.7], [sTop - 0.05, 0.45, 24.7], [sTop + 0.5, -0.45, 24.7], [sTop + 0.5, 0.45, 24.7],
]);
// Vensters in de drie buitenste vlakken van de uitbouw: twee boven elkaar (27,7 tot 30,3) en een rij onder de daklijst.
const bayWindows = (zTop) => union([0, -1, 1].flatMap((k) => {
  const t = (Math.PI / 4) * k;
  const w = (m) => m.rotate([0, 0, (t * 180) / Math.PI]).translate([BAY_C, 0, 0]);
  return [w(niche(BAY_A, 0.6, 27.7, 30.3, 0.3)), w(niche(BAY_A, 0.6, 32.0, zTop, 0.3))];
}));
// Noord-, west- en zuiduitbouw: tot in het dak, bovenkant in het verlengde van het dakvlak.
const bayCut = hull([[0, -3, 20], [9, -3, 20], [0, 3, 20], [9, 3, 20], [0, -3, roofZ(0)], [9, -3, roofZ(9)], [0, 3, roofZ(0)], [9, 3, roofZ(9)]]);
const bay = union([bayPrism(H.res, 37).intersect(bayCut), bayCorbel, pendant]).subtract(bayWindows(33.4));
// Oostuitbouw met de wenteltrap: als torentje boven de daklijst tot 38,2 m, lijst met een onderkant van 45 graden tot
// 38,55 m en een achtzijdig tentdak tot 40,6 m (AHN: NAP +53,5 op de top); vensters onder de lijst.
const TUR = { wall: 38.2, corn: 38.55, apex: 40.6, out: 0.2 };
const turret = union([
  bayPrism(H.res, TUR.wall),
  hull([...oct(BAY_A, BAY_C, TUR.wall - TUR.out), ...oct(BAY_A + TUR.out, BAY_C, TUR.wall), ...oct(BAY_A + TUR.out, BAY_C, TUR.corn)]),
  hull([...oct(BAY_A + TUR.out, BAY_C, TUR.corn - 0.01), [BAY_C, 0, TUR.apex]]),
  bayCorbel,
  pendant,
]).subtract(union([bayWindows(33.4), ...[0, -1, 1].map((k) => niche(BAY_A, 0.5, 36.6, 37.4, 0.25).rotate([0, 0, 45 * k]).translate([BAY_C, 0, 0]))]));

// ---------- dakkapellen (noord, west, zuid) ----------
// Voorvlak op 4,9 m van het hart, 1,8 m breed, bovenkant 38,5 m met een klein schilddak tot 38,8 m; liggend venster.
const DORMER = { front: 4.9, half: 0.9, top: 38.5, ridge: 38.8 };
const dBack = (H.apex - DORMER.ridge) / ROOF_K;
const dormer = union([
  box(dBack, -DORMER.half, roofZ(DORMER.front) - 0.5, DORMER.front, DORMER.half, DORMER.top),
  hull([
    [DORMER.front, -DORMER.half, DORMER.top - 0.01], [DORMER.front, DORMER.half, DORMER.top - 0.01],
    [dBack, -DORMER.half, DORMER.top - 0.01], [dBack, DORMER.half, DORMER.top - 0.01],
    [DORMER.front - 0.3, 0, DORMER.ridge], [dBack, 0, DORMER.ridge],
  ]),
]).subtract(niche(DORMER.front, 1.0, roofZ(DORMER.front) + 0.45, DORMER.top - 0.35, 0.3));

// ---------- gevels van de schacht en het reservoirdeel (gebouwd voor de zijde met normaal +X) ----------
// Schacht: per zijde twee hoekkolommen (1,05 m), twee middenkolommen (0,8 m) en drie terugliggende vlakken; fracties
// van de halve breedte. Onder een liggend vlak (8,4 tot 10,1), daarboven de staande vlakken, die in de zijvlakken
// trapsgewijs verder verdiept zijn rond twee vensterstroken; in het middenvlak één doorlopende verdieping.
const F = { corner: 0.8125, side: 0.348, mid: 0.205 };
const P = 0.25, P2 = 0.15;
const shaftPanels = union([
  ...[1, -1].flatMap((s) => {
    const [fa, fb] = s > 0 ? [F.side, F.corner] : [-F.corner, -F.side];
    const inA = fa + 0.06, inB = fb - 0.06;
    return [
      panel(fa, fb, H.panels[0], H.panelBar[0], P),
      panel(fa, fb, H.panelBar[1], H.panels[1], P),
      panel(inA, inB, 8.8, 9.75, P + 0.15, P), // venster in het liggende vlak
      panel(inA, inB, 10.8, 15.9, P2, P),
      panel(inA, inB, 16.3, 21.9, P2, P),
    ];
  }),
  panel(-F.mid, F.mid, H.panels[0], H.panelBar[0], P),
  panel(-F.mid, F.mid, H.panelBar[1], H.panels[1], P),
  panel(-F.mid + 0.06, F.mid - 0.06, 10.8, 21.9, P2, P),
  // Band onder de kraag: twee vensters naast de console.
  panel(0.33, 0.7, 23.95, 24.65, 0.3, 0, 0.02),
  panel(-0.7, -0.33, 23.95, 24.65, 0.3, 0, 0.02),
]);
// Reservoirdeel: naast de uitbouw aan weerszijden een terugliggend vlak van 2,45 m (hart 3,55 m uit het midden).
const resPanels = union([1, -1].map((s) => niche(A.res, 2.45, H.resPanels[0], H.resPanels[1], 0.3, 3.55 * s)));
// Uurwerk: een vierkante plaat van 2,3 m in het terugliggende vlak, 0,15 m voor de achterwand, onderkant onder 45 graden.
const clock = (s) => {
  const x0 = A.res - 0.3, x1 = A.res - 0.15, y0 = 3.55 * s - 1.15, y1 = 3.55 * s + 1.15, z0 = 31.0, z1 = 33.3;
  return hull([
    [x0, y0, z0], [x0, y1, z0], [x1, y0, z0 + 0.15], [x1, y1, z0 + 0.15],
    [x0, y0, z1], [x0, y1, z1], [x1, y0, z1], [x1, y1, z1],
  ]);
};
// Onderste deel: opliggend middenvlak (3,4 m breed, 0,2 m uit, tot 5,6 m) met twee vensterparen (oost: de ingang).
const raisedPanel = union([
  box(A.lower - 0.05, -1.7, BASE, A.lower + 0.2, 1.7, 5.4),
  hull([[A.lower - 0.05, -1.7, 5.4], [A.lower - 0.05, 1.7, 5.4], [A.lower + 0.2, -1.7, 5.4], [A.lower + 0.2, 1.7, 5.4], [A.lower - 0.05, -1.7, 5.65], [A.lower - 0.05, 1.7, 5.65]]),
]).subtract(union([niche(A.lower + 0.2, 2.0, 2.2, 3.25, 0.35), niche(A.lower + 0.2, 2.0, 3.9, 5.0, 0.35)]));

// Ingang (oost): omlijsting 3,5 m breed en 0,3 m uit met fronton (onderkant onder 45 graden) tot 5,8 m, dubbele deur met bovenlicht (1,8 x 3,7 m)
// als nis, bordes van 0,5 m (het voorplein ligt in het PDOK-terrein 0,3 tot 0,4 m boven de heuvel).
const entrance = union([
  box(A.lower - 0.05, -1.75, BASE, A.lower + 0.3, 1.75, 4.8),
  hull([
    [A.lower - 0.05, -1.75, 4.8], [A.lower - 0.05, 1.75, 4.8], [A.lower + 0.3, -1.75, 4.8], [A.lower + 0.3, 1.75, 4.8],
    [A.lower - 0.05, -1.95, 5.0], [A.lower - 0.05, 1.95, 5.0], [A.lower + 0.35, -1.95, 5.0], [A.lower + 0.35, 1.95, 5.0],
    [A.lower - 0.05, 0, 5.8], [A.lower + 0.35, 0, 5.8],
  ]),
  box(A.lower + 0.2, -1.8, BASE, A.lower + 1.5, 1.8, 0.5),
]).subtract(niche(A.lower + 0.3, 1.8, 0.5, 3.7, 0.6));

// Uurwerk naast de noordoost- en zuidwesthoek: oost en west aan de +Y-kant van de gevel, noord en zuid aan de -Y-kant.
const CLOCK_SIDE = [1, -1, 1, -1];
const faces = [0, 1, 2, 3].map((k) => place(union([
  k === 0 ? turret : union([bay, dormer, raisedPanel]),
  k === 0 ? entrance : null,
  clock(CLOCK_SIDE[k]),
].filter(Boolean)), { deg: 90 * k }));
const cuts = union(four(union([shaftPanels, resPanels])));

const building = union([
  union([lower, shaft, corbel, reservoir, cornice, roof]).subtract(cuts),
  ...faces,
]);

await writeLandmark({
  slug: "watertoren-ijmuiden-evertsenstraat",
  base: BASE,
  nodes: [["building:vierkante-schacht-reservoir-uitbouwen-en-tentdak", building]],
  catalog: {
    name: "Watertoren Evertsenstraat",
    origin: ORIGIN,
    xAxis: AXIS,
    // Op het voorplein voor de ingang (PDOK NAP +13,4 tot +13,5); 0,3 m lager komt de vloer op NAP +13,1 (AHN-heuvel).
    groundOffsetMetres: -0.3,
    groundSamplePoints: [[7.5, 0], [7.5, -2.5], [6.25, -3.75]],
    // Ellipsoïdisch: de PDOK-terreinhoogte op het voorplein.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0453100000012284"],
    description:
      "Oorsprong op het hart van het vierkante BAG-pand op de heuvel (NAP +13,1 m), +X de normaal van de oostgevel met de ingang (RD 13,3 graden), +Y noord. Onderste deel met plint, ingang met fronton (oost) en opliggende middenvlakken, ver uitstekende lijst, taps toelopende schacht met drie terugliggende vlakken per zijde, schuine kraag, reservoirdeel met achtkante uitbouwen op consoles, terugliggende vlakken en uurwerken, daklijst op 35,1 m, tentdak van 50,6 graden tot 42,7 m met drie dakkapellen en het torentje van de wenteltrap tot 40,6 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      publishedHeightM: 42.6,
      reservoirM3: 550,
      reservoirDiameterM: 9.0,
      built: 1915,
      architects: "W. de Vrind en D. Drost",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 55.8,
      lowerWidthM: A.lower * 2,
      shaftWidthM: [A.shaft0 * 2, A.shaft1 * 2],
      reservoirWidthM: A.res * 2,
      eaveWidthM: A.eave * 2,
      ledgeM: H.ledge,
      reservoirM: [H.res, H.cornice[0]],
      eaveM: H.cornice[1],
      roofPitchDeg: +((Math.atan(ROOF_K) * 180) / Math.PI).toFixed(1),
      roofTopM: H.apex,
      turretTopM: TUR.apex,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/520689 (1914-1915, vierkant grondplan, 42,60 m, betonskelet, geleding, uitbouwen, uurwerken, tentdak met dakkapellen)",
      "https://nl.wikipedia.org/wiki/Waterleidingcomplex_Evertsenstraat",
      "https://commons.wikimedia.org/wiki/File:Watertoren_IJmuiden_2019.jpg (frontaal op de oostgevel: breedtes en hoogtes)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_IJmuiden_JUL_2020_02.jpg en File:Watertoren_IJmuiden_JUL_2020_03.jpg (schacht, onderste deel, ingang)",
      "https://commons.wikimedia.org/wiki/File:IJmuiden,_Wasserturm_Evertsenstraat_01.JPG, File:Watertoren.JPG en File:Watertoren_IJmuiden_(2024).jpg (uitbouwen, uurwerken, dak)",
      "PDOK BAG-pand 0453100000012284, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});

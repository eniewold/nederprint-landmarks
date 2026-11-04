// Watertoren van de voormalige buskruitfabriek De Oude Molen aan de Amstel bij Ouderkerk aan de Amstel (De Oude Molen 1,
// gemeente Amstelveen), gebouwd in 1895 (rijksmonument 511967, onderdeel van complex 511966). Volgens het register een
// ronde bakstenen romp in koppenverband van circa twintig meter met gevelopeningen op verschillende hoogtes en op twee
// niveaus hardstenen consoles; de bovenbouw is een hoogreservoir in een achthoekige houten ombouwing onder een achtzijdig
// puntdak met flauw hellende dakvlakken dat over de ombouwing uitkraagt. Aan de noordzijde loopt een doorgang naar het
// laboratoriumgebouw, aan de zuidzijde naar de glazen corridor van de jaren negentig.
//
// De toren hoort in de BAG bij pand 0362100001108621, samen met de aanbouw ten zuiden van de toren en de zuidelijke
// werkplaats met zadeldak; die vervangt het model dus mee. De noordkap van de toren valt in pand 0362100001108623 (de
// glazen gang en de noordvleugel met zadeldak), en de PDOK-reconstructie van dat pand heeft daardoor een wand tot 17,5 m
// net ten noorden van de toren. Dat pand staat daarom ook in replacesBuildings en is als eenvoudig blok met zadeldak op de
// AHN-hoogtes gemodelleerd.
//
// Oorsprong op het hart van de ronde toren (cirkelfit op de boog van het BAG-pand, straal 2,365 m, RD [121076.93,
// 478595.80]) op maaiveld (AHN-DTM NAP -0,85 rond de toren). Lokale +X is de lengteas van de zuidelijke werkplaats en de
// aanbouw (BAG-gevels op RD -6,29 graden, alle vier binnen 0,03 graden); de achthoekige ombouwing en het dak staan met
// hun vlakken langs dezelfde assen (graten van het dak op de luchtfoto). +Y wijst ongeveer naar het noorden.
// Maten: BAG (romp, plattegronden), AHN-DSM 0,5 m (dak van de toren: rand NAP +16,4 op 3,25 m, +17,05 op 2 m, top
// +18,05; zadeldak werkplaats nok NAP +8,0, helling 1,2; noordvleugel nok NAP +6,9, helling 0,87; glazen gang NAP +4,35),
// foto's op Wikimedia Commons (geledingen van de toren, gevels van de werkplaats).
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [121076.93, 478595.8];
const DEG = -6.29;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = -0.85;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04 (42,13 tot 42,36).
const GROUND_ELLIPSOID = 42.13;
const C8 = Math.cos(Math.PI / 8);
// Van RD-lokaal (t.o.v. ORIGIN) naar het modelstelsel en van het stelsel van de noordvleugel (RD +4,2 graden) erheen.
const FROM_RD = -DEG;
const FROM_NORTH = 4.2 - DEG;

// Achthoek met apothema a, vlakken langs de modelassen (hoekpunten op 22,5 + 45k graden).
const oct = (a, z) => Array.from({ length: 8 }, (_, k) => {
  const t = (Math.PI / 8) * (2 * k + 1);
  return [(a / C8) * Math.cos(t), (a / C8) * Math.sin(t), z];
});
const octPrism = (a, z0, z1) => prism(oct(a, 0).map(([x, y]) => [x, y]), z0, z1);
const ring = (r, z, n = 48) => Array.from({ length: n }, (_, k) => {
  const t = (2 * Math.PI * (k + 0.5)) / n;
  return [(r / Math.cos(Math.PI / n)) * Math.cos(t), (r / Math.cos(Math.PI / n)) * Math.sin(t), z];
});
// Nis in een vlak met normaal +X op x = 0: breedte wd rond y = 0, van z0 tot z1, diepte d, plafond standaard onder 56 graden (rise = 1,5 x diepte).
const niche0 = (wd, z0, z1, d, rise = 1.5) => {
  const y0 = -wd / 2, y1 = wd / 2, za = z1 + rise * d;
  return hull([
    [-d, y0, z0], [1.0, y0, z0], [-d, y1, z0], [1.0, y1, z0],
    [-d, y0, za], [0, y0, z1], [-d, y1, za], [0, y1, z1], [1.0, y0, z1 - 1.5], [1.0, y1, z1 - 1.5],
  ]);
};
// Nis in een gevel met buitennormaal onder `deg` graden, op het punt (u, v) van die gevel.
const niche = (deg, u, v, wd, z0, z1, d = 0.3) => place(niche0(wd, z0, z1, d), { deg, at: [u, v, 0] });

// ---------- toren ----------
// Hoogtes boven maaiveld. Romp en geledingen uit de foto's "Exterieur DETAIL WATERTOREN" (RCE 20301549, telelens),
// "Salpeter- en Katoenmagazijn en watertoren" en "Ouderkerk aan de Amstel - Kruitfabriek De Oude Molen" (schaal uit de
// rompbreedte van 4,73 m en de dakrand in het AHN).
const T = {
  r0: 2.365, // romp aan de voet (BAG)
  r1: 2.29, // romp onder de uitkraging (licht verjongend op de foto's)
  corbel: [12.1, 12.6], // uitgekraagde baksteenlagen, van rond naar achtkant
  ringA: 2.52, // achtkante bakstenen rand onder de ombouwing
  ringTop: 13.2,
  casingA: 2.4, // houten ombouwing om het reservoir
  louvre: [14.85, 15.5], // lamellen bovenin elk vlak van de ombouwing (plafond van de nis onder de overstek)
  soffit: 15.95, // begin van de schuine onderkant van de overstek
  eaveA: 3.25, // dakrand (AHN: 6,5 m over de vlakken)
  fascia: [16.9, 17.27], // boeiboord
  apex: 18.9, // top van het dak (AHN-profiel: helling 0,5; de makelaar met windvaan staat erboven)
};
const rAt = (z) => T.r0 + ((T.r1 - T.r0) * (z - BASE)) / (T.corbel[0] - BASE);
const shaft = hull([...ring(T.r0, BASE), ...ring(T.r1, T.corbel[0])]);
const corbel = hull([...ring(T.r1, T.corbel[0]), ...oct(T.ringA, T.corbel[1])]);
const brickRing = octPrism(T.ringA, T.corbel[1] - 0.01, T.ringTop);
const casing = octPrism(T.casingA, T.ringTop - 0.01, T.soffit + 0.01);
const soffit = hull([...oct(T.casingA, T.soffit), ...oct(T.eaveA, T.fascia[0])]);
const fascia = octPrism(T.eaveA, T.fascia[0] - 0.01, T.fascia[1]);
const roof = hull([...oct(T.eaveA, T.fascia[1] - 0.01), [0, 0, T.apex]]);
const louvres = union(Array.from({ length: 8 }, (_, k) =>
  place(niche0(1.3, T.louvre[0], T.louvre[1], 0.2, 2.5).translate([T.casingA, 0, 0]), { deg: 45 * k })));
// Gevelopeningen in de romp als nissen (hoek van de buitennormaal in het modelstelsel; 0 = oost, 90 = noord).
const shaftOpening = (deg, wd, z0, z1) => place(niche0(wd, z0, z1, 0.3).translate([rAt(z0), 0, 0]), { deg });
const towerOpenings = union([
  shaftOpening(180, 1.1, 0.9, 3.1), // venster op de begane grond, west
  shaftOpening(180, 0.8, 9.7, 11.0), // west, boven
  shaftOpening(0, 0.8, 9.7, 11.0), // oost
  shaftOpening(225, 0.8, 5.5, 6.9), // zuidwest, midden
  shaftOpening(225, 0.9, 9.8, 11.5), // deur naar het voormalige bordes onder de uitkraging
  shaftOpening(300, 0.8, 9.3, 10.6), // zuidoost, met latei op de detailfoto
  shaftOpening(120, 0.8, 7.4, 8.7), // noordwest, boven de glazen gang
]);
const tower = union([shaft, corbel, brickRing, casing, soffit, fascia, roof]).subtract(union([louvres, towerOpenings]));

// ---------- zuidvleugel: werkplaats met zadeldak, aanbouw en hals naar de toren (rest van BAG-pand ...8621) ----------
// Plattegrond in het modelstelsel (BAG): werkplaats u -10,52 tot 4,62, v -15,867 tot -9,519; aanbouw u -4,007 tot 4,62,
// v -9,519 tot -5,397; hals u -1,838 tot 1,722 vanaf v -5,39 tot de toren.
const W = { u: [-10.52, 4.62], v: [-15.867, -9.519], ridge: 8.85, slope: 1.2, eave: 0.4 };
const vc = (W.v[0] + W.v[1]) / 2;
const zWall = W.ridge - W.slope * (vc - W.v[0]); // goot op de gevel, 5,04 m
// Dwarsprofiel (v, z): gevels tot de goot, overstek van 0,4 m met een onderkant onder 45 graden, dakvlakken onder
// 50,2 graden (AHN: helling 1,2 tussen de goten) tot de nok op 8,85 m (NAP +8,0).
const zEave = W.ridge - W.slope * (vc - W.v[0] + W.eave);
const profile = [
  [W.v[0], BASE], [W.v[1], BASE], [W.v[1], zEave - W.eave], [W.v[1] + W.eave, zEave], [vc, W.ridge],
  [W.v[0] - W.eave, zEave], [W.v[0], zEave - W.eave],
];
// Extrudeer een (v, z)-profiel langs u.
const alongU = (pts, u0, u1) => prism(pts, u0, u1).warp((p) => { const [a, b, c] = p; p[0] = c; p[1] = a; p[2] = b; });
const workshop = union([
  alongU(profile, W.u[0], W.u[1]),
  box(3.15, vc - 0.45, 7.0, 4.05, vc + 0.45, 9.8), // schoorsteen op de nok bij de oostgevel
]).subtract(union([
  // Zuidgevel: drie smalle vensters, deur en drie brede vensters.
  ...[-9.0, -7.4, -5.8].map((u) => niche(270, u, W.v[0], 0.8, 0.9, 2.9)),
  niche(270, -3.6, W.v[0], 0.9, BASE, 2.2),
  ...[-1.6, 0.6, 2.8].map((u) => niche(270, u, W.v[0], 1.2, 1.0, 2.6)),
  // Oostgevel (foto "Laboratorium en watertoren KNSF", stalen trap weggelaten): deur, vensters aan weerszijden, deur
  // met bovenlicht op de verdieping.
  niche(0, W.u[1], vc, 0.9, BASE, 2.2),
  niche(0, W.u[1], -14.5, 1.2, 0.9, 2.6),
  niche(0, W.u[1], -10.7, 1.2, 0.9, 2.6),
  niche(0, W.u[1], vc, 1.0, 4.1, 6.3),
  // Westgevel (geschat).
  niche(180, W.u[0], -14.3, 1.0, 1.0, 2.6),
  niche(180, W.u[0], -11.0, 1.0, 1.0, 2.6),
  niche(180, W.u[0], vc, 0.9, 4.6, 5.9),
  // Noordgevel naast de aanbouw.
  ...[-8.6, -6.2].map((u) => niche(90, u, W.v[1], 1.0, 1.0, 2.6)),
]));
// Aanbouw met plat dak (AHN NAP +3,0) en een koelinstallatie erop (AHN tot NAP +5,05); hals naar de toren (NAP +3,4).
const annex = box(-4.007, -9.75, BASE, 4.62, -5.397, 3.85).subtract(union([
  niche(180, -4.007, -7.5, 1.0, 1.1, 2.6),
  niche(0, 4.62, -7.5, 1.0, BASE, 2.2),
  ...[-3.0, 2.9].map((u) => niche(90, u, -5.397, 1.0, 1.1, 2.6)),
]));
const cooler = box(-2.6, -8.3, 3.8, 3.2, -6.9, 5.9);
const neck = box(-1.838, -5.6, BASE, 1.722, -1.2, 4.25);
const south = union([workshop, annex, cooler, neck]).subtract(tower);

// ---------- noordvleugel en glazen gang (BAG-pand ...8623) ----------
// In het stelsel van de noordvleugel (RD +4,2 graden): glazen gang u -10,21 tot 26,95, v 3,95 tot 6,5, plat dak op
// NAP +4,35; lagere strook langs de zuidrand (v 3,3 tot 4,0) op NAP +3,15; westelijke uitbouw tot v 7,8 op NAP +2,75;
// noordvleugel met zadeldak, nok op v 10,35 op NAP +6,9, helling 0,87 (41 graden), twee schoorstenen op het zuidvlak.
const hallPoly = [[-0.82, 6.3], [27.24, 6.3], [27.25, 11.81], [27.49, 14.22], [0.58, 14.23]];
const H = { ridgeV: 10.35, ridge: 7.75, slope: 0.87 };
const roofPlane = (m, b, c) => { const n = Math.hypot(b, 1); return m.trimByPlane([0, b / n, -1 / n], -c / n); };
const hall = roofPlane(roofPlane(prism(hallPoly, BASE, 9), H.slope, H.ridge - H.slope * H.ridgeV), -H.slope, H.ridge + H.slope * H.ridgeV);
// Lisenen op de noordgevel van de noordvleugel: de uitsprongen van 0,43 x 0,22 m in de BAG-contour (RD-lokaal, begin en
// eind langs de gevel), tot onder de goot.
const PILASTERS_RD = [
  [0.94, 1.384], [3.205, 3.649], [5.469, 5.913], [7.744, 8.178], [9.889, 10.333], [12.154, 12.598],
  [14.299, 14.743], [16.564, 17.008], [18.699, 19.143], [20.974, 21.417], [23.228, 23.672], [25.513, 25.957],
];
const toNorth = ([x, y]) => {
  const t = (-4.2 * Math.PI) / 180;
  return [x * Math.cos(t) - y * Math.sin(t), x * Math.sin(t) + y * Math.cos(t)];
};
const pilasters = PILASTERS_RD.map(([x0, x1]) => {
  // Op de gevellijn tussen (-0,462, 14,235) en (26,376, 16,193).
  const yAt = (x) => 14.235 + ((x + 0.462) * (16.193 - 14.235)) / (26.376 + 0.462);
  const u0 = toNorth([x0, yAt(x0)])[0], u1 = toNorth([x1, yAt(x1)])[0];
  return box(u0, 14.0, BASE, u1, 14.45, 4.2);
});
// Glazen gang: tussen stijlen van 0,4 m verdiepte glasvlakken in de zuid- en westgevel van het westelijke deel.
const corridorGlass = union([
  ...[-9.2, -7.2, -5.2, -3.2].map((u) => place(niche0(1.6, 0.1, 4.4, 0.3), { deg: 270, at: [u, 3.95, 0] })),
  place(niche0(1.6, 0.1, 4.4, 0.3), { deg: 180, at: [-10.21, 5.2, 0] }),
]);
const northParts = union([
  box(-10.21, 3.95, BASE, 26.95, 6.5, 5.2).subtract(corridorGlass), // glazen gang
  ...pilasters,
  box(8.89, 3.3, BASE, 24.62, 4.0, 4.0),
  prism([[-5.76, 6.3], [-0.72, 6.3], [-0.72, 6.89], [-5.75, 7.79]], BASE, 3.6),
  hall,
  box(7.55, 7.55, 4.0, 8.45, 8.45, 6.3),
  box(21.55, 7.05, 4.0, 22.45, 7.95, 6.0),
]);
// Doorgang van de gang naar de toren (RD-lokaal x -1,0 tot 1,35, y 1,6 tot 4,2).
const northNeck = place(box(-1.0, 1.6, BASE, 1.35, 4.2, 5.2), { deg: FROM_RD });
const north = union([place(northParts, { deg: FROM_NORTH }), northNeck]).subtract(tower);

// Maaiveldpunten in het modelstelsel (RD-lokaal rond de gebouwen, op open terrein).
const groundSamplePoints = [[-6, 0], [4, -2], [-15, -12], [-4, -19], [10, 19]].map(([x, y]) => {
  const t = (FROM_RD * Math.PI) / 180;
  return [+(x * Math.cos(t) - y * Math.sin(t)).toFixed(2), +(x * Math.sin(t) + y * Math.cos(t)).toFixed(2)];
});

await writeLandmark({
  slug: "watertoren-ouderkerk-aan-de-amstel",
  base: BASE,
  nodes: [
    ["building:ronde-toren-achtkante-ombouwing-en-dak", tower],
    ["building:werkplaats-aanbouw-en-hals", south],
    ["building:glazen-gang-en-noordvleugel", north],
  ],
  catalog: {
    name: "Watertoren Ouderkerk aan de Amstel",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints,
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0362100001108621", "NL.IMBAG.Pand.0362100001108623"],
    description:
      "Oorsprong op het hart van de ronde toren op maaiveld (NAP -0,85 m), +X langs de werkplaats (RD -6,29 graden). Ronde bakstenen romp met nissen voor vensters en deuren, uitgekraagde achtkante rand op 12,1 tot 13,2 m, houten achtkante ombouwing met lamellen, overstekend achtzijdig dak tot 18,9 m; de zuidelijke werkplaats met zadeldak (nok 8,85 m), schoorsteen en vensternissen, de aanbouw met koelinstallatie en de hals naar de toren (BAG-pand ...8621), en de glazen gang met de noordvleugel (BAG-pand ...8623) als eenvoudige blokken met zadeldak. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1895,
      monument: 511967,
      registerHeightM: "circa 20",
      ahnGroundNapM: GROUND_NAP,
      ahnRoofTopNapM: 18.05,
      shaftDiameterM: [T.r0 * 2, T.r1 * 2],
      corbelM: T.corbel,
      brickRingAcrossFlatsM: T.ringA * 2,
      casingAcrossFlatsM: T.casingA * 2,
      casingM: [T.ringTop, T.soffit],
      eaveAcrossFlatsM: T.eaveA * 2,
      fasciaM: T.fascia,
      apexM: T.apex,
      workshopRidgeM: W.ridge,
      workshopGutterM: +zWall.toFixed(2),
      northWingRidgeM: H.ridge,
      corridorM: 5.2,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/511967 (1895, ronde bakstenen romp, consoles op twee niveaus, achthoekige houten ombouwing, achtzijdig uitkragend dak, doorgangen naar het noorden en zuiden)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Ouderkerk_aan_de_Amstel)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_DETAIL_WATERTOREN_-_Ouderkerk_aan_de_Amstel_-_20301549_-_RCE.jpg (uitkraging, ombouwing, dak, vensters, deur)",
      "https://commons.wikimedia.org/wiki/File:Salpeter-_en_Katoenmagazijn_en_watertoren_-_WLM_2011_-_Shirley_de_Jong.jpg, File:Laboratorium_en_watertoren_KNSF_-_WLM_2011_-_Shirley_de_Jong.jpg, File:Ouderkerk_aan_de_Amstel_-_Kruitfabriek_De_Oude_Molen.jpg en File:Ouderkerk_aan_de_Amstel_-_Watertoren_Kruitfabriek_De_Oude_Molen.jpg (geledingen, lamellen, werkplaats, glazen gang)",
      "PDOK BAG-panden 0362100001108621 en 0362100001108623, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});

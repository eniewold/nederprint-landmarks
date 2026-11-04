// Watertoren van Wieringerwaard, teruggerooid ten westen van de Molenweg, gebouwd in 1927-1928 voor het Provinciaal
// Waterleidingbedrijf van Noord-Holland naar ontwerp van ir. B.F. van Nievelt en ir. W. Mensert (rijksmonument 512096;
// Wikipedia schrijft "Van Nieveld"), uitgevoerd door de N.V. Bredasche Beton Maatschappij. Volgens het register 49,30 m
// hoog (Wikipedia 51,3 m), Amsterdamse School en art deco. Twaalfhoekige schacht met een betonskelet van twaalf binnen- en
// twaalf buitenkolommen, deels in het zicht, deels in rode baksteen; het muurwerk tussen de kolommen is teruggemetseld. Tot
// 3,81 m een extra zware voet (gebatterde hoekpenanten met granieten banden, dubbele ingangsdeur, vensters naast de deur). In
// vier vlakken van de schacht een smalle lichtopening van circa 16 m. Daarop een iets uitkragende reservoirommanteling
// (dubbel reservoir van 600 + 400 m³, diameter 12,00 m) op consoles, met een zware granieten lijst onderaan, een laag deel
// met twee smalle spleten per vlak, een granieten band, en daarboven 24 kolommen, twee aan weerszijden van de circa 9,50 m
// hoge lichtopeningen op de hoeken. Kroonlijst met hoekblokken, een twaalfzijdige kap met een steile betonnen voet en een
// leien bovendeel, en een art-deco-makelaar.
//
// Oorsprong op het hart van BAG-pand 0366100000001644 (cirkelfit op de twaalf hoekpunten, RD [119502.76, 539373.85]; straal
// 7,34 m, apothema uit het oppervlak 7,09 m; de top in het AHN-DSM ligt 0,1 m ernaast) op maaiveld, AHN-DTM NAP -0,9 (ring
// van 7,5 tot 9 m: -1,2 tot -0,8, mediaan -0,96; aan de oostkant voor de ingang -0,9). De hoekpunten van het BAG-pand staan
// op RD 5,26 + 30k graden (gemiddelde van de twaalf). Lokale +X is de normaal van een gevelvlak (RD 80,26 graden); de
// ingang zit in het vlak met normaal -Y (RD -9,74 graden, naar het pad en het erf aan de oostkant; luchtfoto en
// "Wieringerwaard - Watertoren.JPG", met het pompgebouw uit 1950 rechts). Alle twaalfhoeken staan met hun hoekpunten op
// 15 + 30k graden in het lokale stelsel.
// Maten: BAG (voet), AHN-DSM 0,5 m (kap: apothema 5,9 tot 6,3 op NAP +38, 5,3 op +40, 4,5 op +41, 3,7 op +42, 2,9 op +43,
// 2,1 op +44, 1,2 op +45; top van de kap +45,8, makelaar +47,8), geledingen uit "Watertoren van Wieringerwaard vanaf
// Veerweg.jpg" (Commons, telelens van circa 2 km, vrijwel orthografisch; schaal 39,5 px/m uit de kap op het AHN; de
// lichtopeningen van het reservoirdeel meten er 9,6 m, het register zegt circa 9,50 m), "2024 Wieringerwaard,
// wettertoer.jpg" (telelens: kap met steile voet), "Wieringerwaard - Watertoren.JPG" (frontaal op de ingang: voet, deur,
// vensters, consoles, lijsten, spleten en hoekopeningen) en "Watertoren Wieringerwaard.jpg".
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [119502.76, 539373.85];
const DEG = 80.26;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = -0.9;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (noord 41,34, west 41,22, oost voor de ingang 41,34),
// gemeten 2026-11-04. Aan de zuidkant (lokaal -X) zakt het terrein naar de vijver (41,11 op 8,5 m); dat punt telt niet mee,
// anders verdwijnen de treden voor de ingang in het terrein.
const GROUND_ELLIPSOID = 41.22;
const T15 = Math.tan(Math.PI / 12);
const C15 = Math.cos(Math.PI / 12);

// Twaalfhoek met apothema a (afstand hart-gevelvlak), hoekpunten op 15 + 30k graden.
const dod = (a, z) => Array.from({ length: 12 }, (_, k) => {
  const t = (Math.PI / 12) * (2 * k + 1);
  return [(a / C15) * Math.cos(t), (a / C15) * Math.sin(t), z];
});
const dodPrism = (a, z0, z1) => prism(dod(a, 0).map(([x, y]) => [x, y]), z0, z1);
const twelve = (m, skip = []) => Array.from({ length: 12 }, (_, k) => k).filter((k) => !skip.includes(k)).map((k) => place(m, { deg: 30 * k }));
const only = (m, ks) => ks.map((k) => place(m, { deg: 30 * k }));
// Lijst: twaalfhoek a van z0 tot z1 met een onderkant onder 45 graden vanaf het vlak aIn.
const ledge = (aIn, a, z0, z1) => hull([...dod(aIn, z0 - (a - aIn)), ...dod(a, z0), ...dod(a, z1)]);
// Punten [d, p, z] in een stelsel langs de straal naar de hoek op 15 graden (d langs de straal, p dwars).
const vertexDir = (pts) => pts.map(([d, p, z]) => [d * C15 - p * Math.sin(Math.PI / 12), d * Math.sin(Math.PI / 12) + p * C15, z]);
// Strook om de straal naar een hoek, s langs het vlak aan weerszijden van die hoek (halve breedte s cos 15).
const sector = (s, z0, z1) => hull(vertexDir([
  [0, -s * C15, z0], [12, -s * C15, z0], [0, s * C15, z0], [12, s * C15, z0],
  [0, -s * C15, z1], [12, -s * C15, z1], [0, s * C15, z1], [12, s * C15, z1],
]));
// Nis in het vlak met normaal +X (vlak op apothema f), breedte wd rond y, plafond onder 56 graden naar binnen oplopend.
const niche = (f, wd, z0, z1, depth, y = 0) => {
  const y0 = y - wd / 2, y1 = y + wd / 2, za = z1 + 1.5 * depth;
  return hull([
    [f - depth, y0, z0], [f + 1.0, y0, z0], [f - depth, y1, z0], [f + 1.0, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + 1.0, y0, z1 - 1.5], [f + 1.0, y1, z1 - 1.5],
  ]);
};
// Verdiept vlak tussen twee hoekkolommen (normaal +X): kolomvlak a, kolom col langs het vlak vanaf elke hoek, diepte d,
// plafond onder 45 graden.
const recess = (a, col, z0, z1, d) => {
  const h = a * T15 - col;
  return hull([
    [a - d, -h, z0], [a - d, h, z0], [a + 0.8, -h, z0], [a + 0.8, h, z0],
    [a - d, -h, z1 - d], [a - d, h, z1 - d], [a + 0.8, -h, z1 + 0.8], [a + 0.8, h, z1 + 0.8],
  ]);
};

// Apothema's en hoogtes boven maaiveld.
const A = {
  pierFoot: 7.3, // gebatterde hoekpenanten aan de voet (BAG-pand: apothema 7,09 gemiddeld)
  pierTop: 7.05, // en op 2,6 m
  foot: 6.85, // muurwerk van de voet tussen de penanten
  band: 7.0, // granieten banden van de voet
  colBase: 6.95, // granieten blokken aan de voet van de schachtkolommen
  shaft: 6.75, // kolommen van de schacht (Veerweg: 13,7 m breed)
  console: 6.95, // consoles onder de reservoirlijst
  ledge: 7.35, // zware granieten lijst onder het reservoirdeel
  res: 7.1, // reservoirommanteling (Veerweg: 14,7 m breed; AHN-DSM tot 7,15)
  resBand: 7.25, // granieten band tussen laag en hoog reservoirdeel
  cornice: 7.25, // kroonlijst
};
const H = {
  pier: 2.6, // bovenkant van de gebatterde penanten
  sill: [1.25, 1.55], // band onder de vensters
  lintel: [2.6, 2.9], // band boven de vensters
  top: [3.45, 3.85], // bovenste band van de voet (register: zware voet tot 3,81 m)
  colBase: 4.6, // blokken aan de voet van de kolommen
  window: [1.65, 2.35],
  door: [0.5, 2.95],
  slit: [7.0, 23.0], // vier lichtopeningen van circa 16 m
  console: [23.4, 24.4],
  ledge: [24.4, 25.5],
  lowSlit: [26.0, 27.5],
  resBand: [28.0, 28.5],
  colBlock: 29.0, // blokjes aan de voet van de reservoirkolommen
  corner: [29.0, 37.0], // lichtopeningen op de hoeken (circa 9,50 m in het register)
  cornice: [37.6, 38.3],
  cornerBlock: 38.8,
};

// ---------- voet ----------
const footCore = dodPrism(A.foot, BASE, H.top[1]);
const piers = hull([...dod(A.pierFoot, BASE), ...dod(A.pierTop, H.pier), ...dod(A.foot - 0.05, H.pier + 0.25)])
  .intersect(union(twelve(sector(0.8, BASE - 0.1, H.pier + 0.5))));
const foot = union([
  footCore,
  piers,
  ledge(A.foot, A.band, H.sill[0], H.sill[1]),
  ledge(A.foot, A.band, H.lintel[0], H.lintel[1]),
  ledge(A.foot, A.band, H.top[0], H.top[1]),
]);

// ---------- schacht ----------
const COL = 0.7; // kolombreedte langs het vlak aan weerszijden van de hoek
const DEPTH = 0.3; // teruggemetseld muurwerk tussen de kolommen
const shaftTop = H.console[1];
const shaft = dodPrism(A.shaft, H.top[1] - 0.01, H.ledge[0] + 0.1)
  .subtract(union(twelve(recess(A.shaft, COL, H.colBase, H.console[0] - 0.2, DEPTH))));
const colBases = hull([...dod(A.colBase, H.top[1] - 0.01), ...dod(A.colBase, H.colBase - 0.15), ...dod(A.shaft - 0.05, H.colBase + 0.05)])
  .intersect(union(twelve(sector(0.8, H.top[1] - 0.1, H.colBase + 0.3))));
const consoles = hull([...dod(A.shaft - 0.05, H.console[0] - (A.console - A.shaft) - 0.05), ...dod(A.console, H.console[0]), ...dod(A.console, shaftTop)])
  .intersect(union(twelve(sector(0.75, H.console[0] - 1, shaftTop + 0.1))));

// ---------- reservoirommanteling ----------
const resLedge = ledge(A.shaft, A.ledge, H.ledge[0], H.ledge[1]);
const resBody = dodPrism(A.res, H.ledge[1] - 0.01, H.cornice[0] + 0.05);
const resBand = ledge(A.res, A.resBand, H.resBand[0], H.resBand[1]);
const colBlocks = hull([...dod(A.resBand, H.resBand[1] - 0.01), ...dod(A.resBand, H.colBlock - 0.15), ...dod(A.res - 0.05, H.colBlock + 0.05)])
  .intersect(union(twelve(sector(0.8, H.resBand[1] - 0.1, H.colBlock + 0.3))));
const cornice = ledge(A.res, A.cornice, H.cornice[0], H.cornice[1]);
const cornerBlocks = dodPrism(A.cornice - 0.05, H.cornice[1] - 0.01, H.cornerBlock)
  .intersect(union(twelve(sector(0.6, H.cornice[1] - 0.1, H.cornerBlock + 0.1))));
// Bovenste deel: kolommen 0,8 m langs het vlak vanaf elke hoek, het vlak ertussen 0,2 m teruggemetseld.
const resRecess = recess(A.res, 0.8, H.colBlock, H.cornice[0] - 0.3, 0.2);
// Lichtopening op elke hoek tussen de twee kolommen: nis van 0,4 m breed en 0,45 m diep langs de straal, plafond 56 graden.
const rv = A.res / C15;
const cornerSlot = hull(vertexDir([
  [rv - 0.45, -0.2, H.corner[0]], [rv + 1, -0.2, H.corner[0]], [rv - 0.45, 0.2, H.corner[0]], [rv + 1, 0.2, H.corner[0]],
  [rv - 0.45, -0.2, H.corner[1] + 0.7], [rv - 0.45, 0.2, H.corner[1] + 0.7], [rv, -0.2, H.corner[1]], [rv, 0.2, H.corner[1]],
  [rv + 1, -0.2, H.corner[1] - 1.5], [rv + 1, 0.2, H.corner[1] - 1.5],
]));

// ---------- kap en makelaar ----------
// Twaalfzijdig, graten op de hoeken: steile betonnen voet (circa 64 graden) tot 41,2 m, daarboven leien onder circa 47 graden
// tot 46,4 m (AHN-profiel en telelensfoto's).
const KAP = [[H.cornice[1] - 0.01, 6.6], [39.0, 6.3], [41.2, 5.3], [46.4, 0.35]];
const kap = hull(KAP.flatMap(([z, a]) => dod(a, z)));
// Art-deco-makelaar in treden tot 49,3 m (register 49,30 m; AHN-DSM ziet de top tot NAP +47,8).
const finial = union([
  dodPrism(0.55, 46.0, 47.3),
  dodPrism(0.45, 47.29, 48.3),
  hull([...dod(0.45, 48.29), [0, 0, 49.3]]),
]);

// ---------- openingen ----------
const ENTRANCE = 9; // vlak met normaal -Y (270 graden)
const openings = union([
  // Vensters in de twee vlakken naast de ingang.
  ...only(niche(A.foot, 1.0, H.window[0], H.window[1], 0.3), [ENTRANCE - 1, ENTRANCE + 1]),
  // Lichtopeningen van circa 16 m in vier vlakken (in het echt circa 0,25 m, hier 0,4 m), een boven de ingang.
  ...only(niche(A.shaft - DEPTH, 0.4, H.slit[0], H.slit[1], 0.3), [0, 3, 6, 9]),
  // Twee smalle spleten per vlak in het lage reservoirdeel (in het echt circa 0,15 m, hier 0,35 m).
  ...twelve(niche(A.res, 0.35, H.lowSlit[0], H.lowSlit[1], 0.25, -0.95)),
  ...twelve(niche(A.res, 0.35, H.lowSlit[0], H.lowSlit[1], 0.25, 0.95)),
  ...twelve(resRecess),
  ...twelve(cornerSlot),
]);
const tower = union([foot, shaft, colBases, consoles, resLedge, resBody, resBand, colBlocks, cornice, cornerBlocks, kap, finial])
  .subtract(openings);

// ---------- ingang (gebouwd in het vlak met normaal +X, daarna naar -Y gedraaid) ----------
// Granieten omlijsting 0,15 m voor het vlak, 2,3 m breed tot 3,3 m; dubbele deur 1,5 x 2,45 m als nis; twee treden.
const frame = box(A.foot - 0.1, -1.15, BASE, A.foot + 0.15, 1.15, 3.3);
// Twee treden tot 0,5 m: het PDOK-terrein voor de ingang ligt 0,1 tot 0,2 m boven de oorsprong.
const steps = union([box(A.foot, -1.2, BASE, A.foot + 0.6, 1.2, 0.5), box(A.foot, -1.2, BASE, A.foot + 1.1, 1.2, 0.25)]);
const doorNiche = niche(A.foot + 0.15, 1.5, H.door[0], H.door[1], 0.5);
const entrance = place(union([frame, steps]), { deg: 30 * ENTRANCE });

// De deurnis gaat door omlijsting, banden en penanten heen.
const building = union([tower, entrance]).subtract(place(doorNiche, { deg: 30 * ENTRANCE }));

await writeLandmark({
  slug: "watertoren-wieringerwaard",
  base: BASE,
  nodes: [["building:twaalfkante-schacht-reservoir-kap-en-ingang", building]],
  catalog: {
    name: "Watertoren Wieringerwaard",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8.5, 0], [0, 8.5], [0, -8.5]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0366100000001644"],
    description:
      "Oorsprong op het hart van het twaalfhoekige BAG-pand op maaiveld (NAP -0,9 m), +X de normaal van een gevelvlak (RD 80,26 graden), ingang naar -Y (RD -9,74 graden). Zware voet met gebatterde hoekpenanten, granieten banden, dubbele deur en twee vensters; schacht met hoekkolommen, verdiepte vlakken en vier lichtopeningen van 16 m; consoles en een zware granieten lijst onder de reservoirommanteling, laag deel met spleten, granieten band, hoog deel met kolommen en lichtopeningen op de hoeken; kroonlijst met hoekblokken tot 38,8 m, twaalfzijdige kap met steile voet tot 46,4 m en makelaar tot 49,3 m. Maten uit BAG, AHN, het register en foto's.",
    realWorld: {
      publishedHeightM: 49.3,
      wikipediaHeightM: 51.3,
      reservoirsM3: [600, 400],
      reservoirDiameterM: 12.0,
      built: "1927-1928",
      architects: "B.F. van Nievelt en W. Mensert (PWN)",
      ahnGroundNapM: GROUND_NAP,
      ahnRoofTopNapM: 45.8,
      ahnFinialNapM: 47.8,
      footAcrossFacesM: A.foot * 2,
      shaftAcrossFacesM: A.shaft * 2,
      reservoirAcrossFacesM: A.res * 2,
      ledgeM: H.ledge,
      corniceM: H.cornice,
      roofM: [H.cornice[1], 46.4],
      finialM: 49.3,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/512096 (1927-1928, B.F. van Nievelt en W. Mensert, 49,30 m, twaalfhoekig, kolommen, voet tot 3,81 m, vier lichtopeningen van circa 16 m, reservoir 12,00 m met 24 kolommen en lichtopeningen van circa 9,50 m, kap)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Wieringerwaard)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_van_Wieringerwaard_vanaf_Veerweg.jpg (telelens: geledingen, breedtes en kap)",
      "https://commons.wikimedia.org/wiki/File:2024_Wieringerwaard,_wettertoer.jpg (telelens: kap en reservoirdeel)",
      "https://commons.wikimedia.org/wiki/File:Wieringerwaard_-_Watertoren.JPG en File:Watertoren_Wieringerwaard.jpg (voet, ingang, consoles, spleten)",
      "PDOK BAG-pand 0366100000001644, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});

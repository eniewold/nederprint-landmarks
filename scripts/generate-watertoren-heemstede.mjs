// Watertoren van Heemstede aan de Nijverheidsweg (bij de noordelijke haven), gebouwd in 1910-1911 naar ontwerp van
// A. Holmberg de Beckfelt; volgens Wikipedia 41,35 m hoog met één reservoir van 460 m³, nog in gebruik voor de
// drinkwatervoorziening en in 2006 gerestaureerd. Een achtkante, wit gepleisterde schacht met lisenen op de hoeken, vier
// horizontale banden en per gevelvlak smalle vensterspleten draagt een bredere achtkante reservoirkop: onder elke hoek
// een schuine console van de lisene naar de hoek van de kop, een gelede onderlijst, verdiepte gevelvlakken met een
// vensterspleet en een kroonlijst met een lage borstwering rond het platte dak (luik in het midden, vier lichtkoepels).
// Tegen de zuidwestgevel staat het lage pomphuis met een zadeldak langs de as en een witte voorgevel met hoekpijlers,
// een verhoogd middenrisaliet met getrapte top, een deur en twee vensters.
//
// Oorsprong op het hart van de achtkante kop: kleinste omsluitende achthoek om het AHN-DSM boven 20 m (stand -122 tot
// -125 graden, hart RD [103192,4, 484498,55]), samen met de BGT-contour van het pand (lisenen op de hoeken, hart
// 0,2 m noordelijker). Maaiveld AHN-DTM in een ring van 7 tot 13 m NAP +0,69 tot +0,96 (mediaan +0,80). Lokale +X is de
// normaal van de gevel met het pomphuis, langs de lange as van het pomphuis uit de BGT (RD -122 graden, naar het
// zuidwesten); de acht gevelvlakken staan op 0, 45, ..., 315 graden.
// Hoogtes boven maaiveld uit het AHN-DSM 0,5 m (NAP): dak in de borstwering 40,5 m (NAP +41,3), luik 41,4 m (NAP +42,2,
// 3D BAG dak_max 42,22); pomphuis nok 6,35 m (NAP +7,15) en goot 4,5 m met helling 0,5. De kop is in het DSM 10,5 m
// over de vlakken (omsluitende achthoek). De geledingen (banden, consoles, onderlijst, kroonlijst, vensterspleten)
// uit de foto "Nijverheidsweg 5, heemstede" (Commons, van circa 80 m: vrijwel lineair), geschaald tussen maaiveld en
// kroonlijst; breedtes van schacht en kop uit dezelfde foto en de BGT.
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [103192.4, 484498.55];
const DEG = -122;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 0.8; // AHN-DTM in een ring van 7 tot 13 m: mediaan 0,80
const GROUND_ELLIPSOID = 43.69; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04 (43,69 tot 43,94)
const T22 = Math.tan(Math.PI / 8);

// Afstanden van het hart tot het gevelvlak (apothema van de achthoek).
const A = {
  plinth: 4.15, // plint aan de voet (BGT: lisenen tot 4,6 m in de hoeken)
  pilaster: 4.0, // lisenen en banden van de schacht (foto: 7,8 m zichtbaar over de schacht)
  panel: 3.75, // verdiepte gevelvlakken tussen de lisenen
  head: 5.1, // gevelvlak van de kop
  headPanel: 4.95, // verdiepte vlakken in de kop
  ledge: 5.3, // onderlijst en kroonlijst (AHN: omsluitende achthoek 5,25 tot 5,3)
  roof: 4.4, // binnenkant van de borstwering (0,9 m dik)
};
const H = {
  plinth: 0.6,
  bands: [5.6, 12.9, 20.4, 27.5], // onderkant van de banden (foto)
  band: 0.45, // banddikte
  bracketFoot: 27.4, // voet van de consoles op de hoek van de schacht (foto)
  soffit: 28.75, // onderzijde van de kop begint hier op het verdiepte vlak (45 graden naar de kop)
  head: 30.1, // onderkant van de kop op het gevelvlak (foto 29,6 tot 30,5)
  ledge: [31.3, 32.5], // onderlijst (foto)
  cornice: 39.1, // onderkant kroonlijst (foto 39,3)
  parapet: 40.95, // borstwering
  roof: 40.5, // dak (AHN NAP +41,3)
  hatch: 41.4, // luik (AHN NAP +42,2)
  skylight: 40.85,
  windows: [[7.5, 10.6], [15.3, 18.2], [22.2, 25.0]], // vensterspleten in de schacht (foto)
  headWindow: [33.9, 37.4],
  door: 2.6,
};
// Pomphuis (lokaal stelsel van de toren; lange as langs +X, BGT).
const P = {
  x0: 3.7, // in de schacht
  front: 13.4, // voorgevel (BGT)
  y0: -3.7,
  y1: 3.4, // zijgevels (BGT, 7,1 m breed)
  ridge: 6.35, // nok (AHN NAP +7,15)
  slope: 0.5, // dakhelling (AHN 0,5)
};
const ridgeY = (P.y0 + P.y1) / 2;
P.eave = +(P.ridge - P.slope * (P.y1 - ridgeY)).toFixed(3); // goot op de zijgevels: 4,575 (AHN 4,5 tot 4,6)

const oct = (a, z) => Array.from({ length: 8 }, (_, k) => {
  const t = (Math.PI / 8) * (2 * k + 1);
  const r = a / Math.cos(Math.PI / 8);
  return [r * Math.cos(t), r * Math.sin(t), z];
});
const octPrism = (a, z0, z1) => prism(oct(a, 0).map(([x, y]) => [x, y]), z0, z1);
const eight = (m) => [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => place(m, { deg }));

// Nis in het vlak met normaal +X op afstand f, plafond onder 56 graden naar binnen oplopend.
const niche = (f, wd, z0, z1, depth, y = 0) => {
  const a = f - depth, b = f + 1.5, za = z1 + 1.5 * depth, y0 = y - wd / 2, y1 = y + wd / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 2.25], [b, y1, z1 - 2.25]]);
};

// ---------- schacht ----------
// Lisenen: 0,45 m langs het gevelvlak aan weerszijden van elke hoek; daartussen het vlak 0,25 m terug. De vier banden
// liggen in het vlak van de lisenen; onder elke band (en onder de kop) loopt het verdiepte vlak onder 45 graden op.
const panelHalf = A.pilaster * T22 - 0.45;
const recess = (z0, z1) => hull([
  [A.panel, -panelHalf, z0], [A.panel, panelHalf, z0], [A.panel, -panelHalf, z1 - (A.pilaster - A.panel)], [A.panel, panelHalf, z1 - (A.pilaster - A.panel)],
  [A.pilaster + 0.6, -panelHalf, z0], [A.pilaster + 0.6, panelHalf, z0], [A.pilaster + 0.6, -panelHalf, z1 + 0.6], [A.pilaster + 0.6, panelHalf, z1 + 0.6],
]);
const panelZ = [H.plinth + 0.15, ...H.bands.map((z) => z + H.band)];
const recesses = union(eight(union(panelZ.map((z0, i) => recess(z0, i < H.bands.length ? H.bands[i] : H.head + 1)))));
const plinth = hull([...oct(A.plinth, BASE), ...oct(A.plinth, H.plinth), ...oct(A.pilaster, H.plinth + 0.15)]);
const shaft = union([octPrism(A.panel, BASE, H.head + 0.5), octPrism(A.pilaster, BASE, H.soffit + 0.4).subtract(recesses), plinth]);

// Consoles: onder elke hoek van 1,0 m breed, van de hoek van de lisene op 27,4 m naar de hoek van de kop op 30,1 m
// (onderzijde 66 graden uit het horizontale vlak; foto 58 tot 66).
const cornerShaft = A.pilaster / Math.cos(Math.PI / 8);
const cornerHead = A.head / Math.cos(Math.PI / 8) + 0.05;
const diag = (pts) => pts.map(([d, p, z]) => [d * Math.cos(Math.PI / 8) - p * Math.sin(Math.PI / 8), d * Math.sin(Math.PI / 8) + p * Math.cos(Math.PI / 8), z]);
const bracket = hull(diag([
  [cornerShaft - 0.9, -0.5, H.bracketFoot - 1.2], [cornerShaft - 0.9, 0.5, H.bracketFoot - 1.2],
  [cornerShaft, -0.5, H.bracketFoot], [cornerShaft, 0.5, H.bracketFoot],
  [cornerHead, -0.5, H.head], [cornerHead, 0.5, H.head], [cornerShaft - 0.9, -0.5, H.head], [cornerShaft - 0.9, 0.5, H.head],
]));
const brackets = union(eight(bracket));

// ---------- reservoirkop ----------
// Onderzijde onder 45 graden van het verdiepte vlak van de schacht naar het gevelvlak van de kop; onderlijst met een
// schuine onderkant; verdiepte vlakken tussen onderlijst en kroonlijst; kroonlijst met borstwering rond het dak.
const soffit = hull([...oct(A.panel, H.soffit), ...oct(A.head, H.soffit + (A.head - A.panel)), ...oct(A.head, H.head + 0.3)]);
const headPanelHalf = A.head * T22 - 0.5;
const headRecess = place(hull([
  [A.headPanel, -headPanelHalf, H.ledge[1]], [A.headPanel, headPanelHalf, H.ledge[1]], [A.headPanel, -headPanelHalf, H.cornice - 0.15], [A.headPanel, headPanelHalf, H.cornice - 0.15],
  [A.head + 0.6, -headPanelHalf, H.ledge[1]], [A.head + 0.6, headPanelHalf, H.ledge[1]], [A.head + 0.6, -headPanelHalf, H.cornice + 0.6], [A.head + 0.6, headPanelHalf, H.cornice + 0.6],
]), {});
const headBody = octPrism(A.head, H.head, H.cornice + 0.1).subtract(union(eight(headRecess)));
const ledge = hull([...oct(A.head, H.ledge[0] - (A.ledge - A.head)), ...oct(A.ledge, H.ledge[0]), ...oct(A.ledge, H.ledge[1])]);
const cornice = hull([...oct(A.headPanel, H.cornice - (A.ledge - A.headPanel)), ...oct(A.ledge, H.cornice), ...oct(A.ledge, H.parapet)]);
const roofWell = octPrism(A.roof, H.roof, H.parapet + 1);
const hatch = box(-0.9, -0.9, H.roof - 0.1, 0.9, 0.9, H.hatch);
const skylights = [[2.7, 0], [0, 2.7], [-2.7, 0], [0, -2.7]].map(([x, y]) => box(x - 0.55, y - 0.55, H.roof - 0.1, x + 0.55, y + 0.55, H.skylight));
const head = union([soffit, headBody, ledge, cornice]).subtract(roofWell);

// ---------- vensters en deur in de toren ----------
const towerOpenings = union([
  // Vensterspleten (in het echt 0,3 tot 0,4 m breed, hier 0,6 m) in het midden van elk vlak, drie boven elkaar.
  ...eight(union(H.windows.map(([z0, z1]) => niche(A.panel, 0.6, z0, z1, 0.3)))),
  ...eight(niche(A.headPanel, 0.6, H.headWindow[0], H.headWindow[1], 0.3)),
  // Deur in de zuidoostgevel (lokale +Y).
  place(niche(A.pilaster, 1.2, 0, H.door, 0.6), { deg: 90 }),
]);
const tower = union([shaft, brackets, head, hatch, ...skylights]).subtract(towerOpenings);

// ---------- pomphuis ----------
const walls = box(P.x0, P.y0, BASE, P.front, P.y1, P.eave);
const annexPlinth = hull([
  [P.x0, P.y0 - 0.15, BASE], [P.front + 0.15, P.y0 - 0.15, BASE], [P.front + 0.15, P.y1 + 0.15, BASE], [P.x0, P.y1 + 0.15, BASE],
  [P.x0, P.y0 - 0.15, 0.5], [P.front + 0.15, P.y0 - 0.15, 0.5], [P.front + 0.15, P.y1 + 0.15, 0.5], [P.x0, P.y1 + 0.15, 0.5],
  [P.x0, P.y0, 0.65], [P.front, P.y0, 0.65], [P.front, P.y1, 0.65], [P.x0, P.y1, 0.65],
]);
// Zadeldak: twee vlakken z = nok - helling * |y - nok-y| tot de nok, van de schacht tot de voorgevel.
const roofHalf = (ya, yb) => hull([
  [P.x0, ya, P.eave - 0.01], [P.front - 0.2, ya, P.eave - 0.01], [P.x0, yb, P.eave - 0.01], [P.front - 0.2, yb, P.eave - 0.01],
  [P.x0, ya, P.eave], [P.front - 0.2, ya, P.eave], [P.x0, yb, P.ridge], [P.front - 0.2, yb, P.ridge],
]);
const annexRoof = union([roofHalf(P.y0, ridgeY), roofHalf(P.y1, ridgeY)]);
// Voorgevel als topgevel: dekstenen 0,2 m boven het dak, hoekpijlers, middenrisaliet van 2,0 m met getrapte top.
const rake = 0.2;
const gableProfile = [
  [P.y0, BASE], [P.y1, BASE], [P.y1, P.eave + rake],
  [ridgeY + 1.6, P.ridge + rake - P.slope * 1.6], [ridgeY + 1.6, 6.05], [ridgeY + 1.0, 6.05], [ridgeY + 1.0, 6.55],
  [ridgeY - 1.0, 6.55], [ridgeY - 1.0, 6.05], [ridgeY - 1.6, 6.05], [ridgeY - 1.6, P.ridge + rake - P.slope * 1.6], [P.y0, P.eave + rake],
];
// Profiel in (y, z), uitgezet langs x van 13,0 tot de voorgevel.
const gable = prism(gableProfile, 0, 0.4).rotate([90, 0, 0]).rotate([0, 0, 90]).translate([P.front - 0.4, 0, 0]);
const risalit = box(P.front - 0.1, ridgeY - 1.0, BASE, P.front + 0.15, ridgeY + 1.0, 6.55);
const piers = [P.y0, P.y1].map((y) => box(P.front - 0.65, y - 0.4, BASE, P.front + 0.15, y + 0.4, P.eave + 0.45));
const annexOpenings = union([
  niche(P.front + 0.15, 1.4, 0, 3.0, 0.5, ridgeY), // deur in het risaliet
  ...[-2.3, 2.3].map((dy) => niche(P.front, 0.9, 1.0, 2.9, 0.3, ridgeY + dy)), // vensters in de voorgevel
  ...[6.6, 9.1, 11.6].flatMap((x) => [
    place(niche(-P.y0, 0.9, 1.0, 2.9, 0.3, x), { deg: -90 }),
    place(niche(P.y1, 0.9, 1.0, 2.9, 0.3, -x), { deg: 90 }),
  ]),
]);
const annex = union([walls, annexPlinth, annexRoof, gable, risalit, ...piers]).subtract(annexOpenings);

const building = union([tower, annex]);

await writeLandmark({
  slug: "watertoren-heemstede",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:achtkante-schacht-reservoirkop-en-pomphuis", building]],
  catalog: {
    name: "Watertoren Heemstede",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-8, 0], [0, 8], [0, -8], [15, 0]],
    // Ellipsoïdisch: de PDOK-terreinhoogte rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0397100000001556"],
    description:
      "Oorsprong op het hart van de achtkante reservoirkop op maaiveld (NAP +0,8 m), +X de normaal van de gevel met het pomphuis (RD -122 graden, zuidwest). Achtkante schacht (8 m over de lisenen) met hoeklisenen, vier banden en vensterspleten, acht schuine consoles onder een kop van 10,2 m met onderlijst, verdiepte vlakken en kroonlijst tot 40,95 m, dak op 40,5 m met luik tot 41,4 m, en het pomphuis met zadeldak (nok 6,35 m) en een topgevel met middenrisaliet. Maten uit AHN, BGT en foto's.",
    realWorld: {
      publishedHeightM: 41.35,
      reservoirM3: 460,
      built: "1910-1911",
      architect: "A. Holmberg de Beckfelt",
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 41.3,
      ahnTopNapM: 42.2,
      shaftAcrossFacesM: A.pilaster * 2,
      headAcrossFacesM: A.head * 2,
      corniceAcrossFacesM: A.ledge * 2,
      bandsM: H.bands,
      bracketFootM: H.bracketFoot,
      headBottomM: H.head,
      roofM: H.roof,
      parapetM: H.parapet,
      hatchM: H.hatch,
      pumpHouse: { lengthM: +(P.front - A.panel).toFixed(2), widthM: +(P.y1 - P.y0).toFixed(2), eaveM: P.eave, ridgeM: P.ridge },
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Heemstede) (1910-1911, A. Holmberg de Beckfelt, 41,35 m, reservoir 460 m³)",
      "https://commons.wikimedia.org/wiki/File:Nijverheidsweg_5,_heemstede.jpg (van circa 80 m: geledingen en breedtes)",
      "https://commons.wikimedia.org/wiki/File:Heemstede,_watertoren_foto5_2011-06-12_10.41.JPG, File:Watertower_Heemstede_Nijverheidsweg_5.jpg en File:Watertoren_Heemstede.jpg (consoles, kop, voorgevel van het pomphuis)",
      "PDOK BGT-pand G0397.9ff7f15494ed4cd8990029715aa6e4b8 (BAG-pand 0397100000001556), AHN DSM/DTM 0,5 m, luchtfoto en 3D BAG, 2026-11-04",
    ],
  },
});

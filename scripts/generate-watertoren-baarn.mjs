// Watertoren van Baarn aan de Sophialaan 31 in de Transvaalwijk, op een hoog punt in de gemeente. Gebouwd in 1903 naar
// ontwerp en in opdracht van de Utrechtsche Waterleiding Maatschappij, in neorenaissancestijl, verwant aan de UWM-torens
// van Utrecht (Lauwerhof, Heuveloord) en Zeist; rijksmonument 511733, 29 m hoog, voet circa 10 m doorsnede, ijzeren
// Intze I-reservoir van 500 m³ (register en Wikipedia); sinds 2014 een woning met een dakterras. Een ronde, zich
// verjongende toren in drie geledingen: de voet met een donkere plint, een natuurstenen band op de hoogte van het
// bovenlicht en een siermetselband tussen cordonlijsten, met de ingang in een licht vooruitstekend portaal met een
// timpaan en een pinakel; de schacht met smalle vensters en bovenaan een boogfries; de uitkraging van siermetselwerk
// tussen profielijzers, het reservoir met veertien smalle vensters en een boogfries, een cordonlijst en kantelen, waarvan
// die boven de ingang (straatzijde) iets hoger is en de windvaan met 1903 draagt.
//
// Oorsprong op het hart van de top in het AHN-DSM 0,5 m (cirkel door 42 randcellen van het dakterras, straal 5,40 m,
// mediaan afwijking 0,2 m) op het maaiveld: AHN-DTM NAP +14,3 (ring van 6,5 tot 11 m: 14,22 tot 14,32). Het ronde
// BAG-pand 0308100000021663 (straal 4,82 m met het portaal) ligt 1,2 m naar het zuidwesten ernaast: aan die kant eindigt
// de top in het DSM al op 4,4 m van het BAG-hart en ziet het AHN-DTM maaiveld binnen 4,9 m, wat bij een concentrische
// Intze-toren niet kan; de buurpanden liggen binnen 0,25 à 0,5 m van het AHN. De vorm van de BAG-voetafdruk is daarom
// overgenomen, verschoven naar het AHN-hart. +Y wijst naar RD-richting 114 graden (noordwest): het portaal (BAG: 2,95 m
// breed, 0,65 m voor de gevel), de straatzijde en de hogere kanteel (DSM-piek NAP +44,18 op 123 graden). +X wijst naar
// 24 graden.
// Maten: hoogtes van de top en de kantelen uit het AHN-DSM (dakterras NAP +42,86, kantelen +43,4 à +43,7, hoge kanteel
// +44,18); geledingen, vensters, portaal en uitkraging uit de foto "Baarn Watertoren 9170.JPG" (Commons, vanaf de straat
// recht op de ingang, sterk schuin omhoog) met een perspectieffit op het maaiveld, de top en de breedtes van voet en
// reservoir; breedteverhoudingen schacht/reservoir uit dezelfde foto. Kantelen en dakterras uit de luchtfoto.
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [147674.27, 469299.61];
const AXIS_DEG = 24;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 14.3;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 57,57, west 57,51, noord 57,51, zuid 57,49),
// gemeten 2026-11-06; rondom op 6 tot 8 m 57,41 tot 57,62, het terrein is vlak.
const GROUND_ELLIPSOID = 57.49;

// Omwenteling van een gesloten profiel [[r, z], ...].
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Massief onder een profiel van onder naar boven, gesloten langs de as.
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Schijf tot r1 tussen z0 en z1, met een onderkant van 50 graden vanaf de straal rIn (massief tot de as).
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
// Straal van een rechte kegel van (ra, za) tot (rb, zb) op hoogte z.
const coneR = (ra, za, rb, zb) => (z) => ra + ((rb - ra) * (z - za)) / (zb - za);
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 56 graden op.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Rondboognis: als niche, met een halfrond bovenop; het boogplafond loopt naar binnen onder 63 graden op.
const archNiche = (f, w, z0, zSpring, depth = 0.3) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([y, z]) => [a, y, z + 2 * depth]),
    ...arc.map(([y, z]) => [f, y, z]),
    ...arc.map(([y, z]) => [f + 1, y, Math.max(z0, z - 1.5)]),
    [a, -r, z0], [a, r, z0], [f + 1, -r, z0], [f + 1, r, z0],
  ]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
const FRONT = 90; // portaal, straatzijde en hoge kanteel (lokaal +Y)

// ---------- hoogtes boven het maaiveld (NAP +14,3) ----------
const H = {
  plinth: 0.9, // donkere plint
  stoneBand: [2.8, 3.0], // natuurstenen band op de hoogte van het bovenlicht
  lowerCordon: [4.25, 4.4],
  upperCornice: [5.3, 5.65], // cordonlijst boven de siermetselband
  frieze: [15.7, 17.0], // boogfries van de schacht (bogen tot 16,7)
  shaftTop: [17.0, 17.25], // witte lijst onder de uitkraging
  lip: [18.9, 19.15], // waterlijst aan de buitenkant van de uitkraging
  resWindows: [20.0, 24.1],
  resFrieze: [24.7, 25.8],
  cordon: [26.2, 26.6],
  terrace: 28.45, // dakterras en onderkant van de kantelen (AHN NAP +42,86 met vlonder en meubels)
  merlon: 29.35, // kantelen (AHN NAP +43,4 à +43,7)
  highMerlon: 29.9, // kanteel boven de ingang (AHN-piek NAP +44,18)
};
// Stralen.
const R = {
  plinth: 4.95,
  foot: 4.85, // BAG 4,82; register: circa 10 m doorsnede
  footTop: 4.75,
  cordon: 0.12, // uitsteek van band en cordonlijst
  cornice: 5.0,
  shaftFoot: 4.7,
  shaftTop: 4.25,
  frieze: 4.45,
  shaftMolding: 4.55,
  reservoir: 5.4, // AHN-DSM: top 10,8 m doorsnede
  lip: 5.5,
  resFrieze: 5.55,
  cordonRes: 5.6,
  parapetOut: 5.45,
  parapetIn: 4.55, // kantelen 0,9 m dik
};
const footR = coneR(R.foot, H.plinth, R.footTop, H.upperCornice[0]);
const shaftR = coneR(R.shaftFoot, H.upperCornice[1], R.shaftTop, H.frieze[0]);

// ---------- voet ----------
const plinth = solidRev([[R.plinth, BASE], [R.plinth, H.plinth - 0.1], [R.foot - 0.01, H.plinth]]);
const footWall = solidRev([[R.foot, H.plinth - 0.11], [R.footTop, H.upperCornice[0] + 0.01]]);
const footBands = union([
  ledge(footR(H.stoneBand[0]), footR(H.stoneBand[0]) + R.cordon, ...H.stoneBand),
  ledge(footR(H.lowerCordon[0]), footR(H.lowerCordon[0]) + R.cordon, ...H.lowerCordon),
  ledge(R.footTop, R.cornice, ...H.upperCornice),
  // Afzaat van de cordonlijst naar de schacht.
  rev([[R.shaftFoot - 0.3, H.upperCornice[1] - 0.01], [R.cornice, H.upperCornice[1] - 0.01], [R.cornice - 0.05, H.upperCornice[1] + 0.05], [R.shaftFoot - 0.3, H.upperCornice[1] + 0.35]]),
]);

// Portaal voor de ingang (+Y): 2,95 m breed, voorgevel 0,65 m voor de voet (BAG), kroonlijst op 3,9 m, timpaan tot 4,55 m
// en een pinakel tot 5,4 m. Gebouwd met de voorkant naar +X en daarna naar +Y gedraaid.
const PORTAL = { front: R.foot + 0.65, half: 1.475, cornice: 3.9, peak: 4.55, pinnacle: 5.4 };
const portalBody = hull([
  ...[R.foot - 1.0, PORTAL.front].flatMap((x) => [
    [x, -PORTAL.half, BASE], [x, PORTAL.half, BASE],
    [x, -PORTAL.half, PORTAL.cornice], [x, PORTAL.half, PORTAL.cornice],
    [x, 0, PORTAL.peak],
  ]),
]);
// Kroonlijst van het portaal: 0,12 m voor en naast het portaal, onderkant 51 graden (0,15 m over 0,12 m).
const portalCornice = hull([
  [PORTAL.front - 0.6, -PORTAL.half, PORTAL.cornice - 0.6], [PORTAL.front - 0.6, PORTAL.half, PORTAL.cornice - 0.6],
  [PORTAL.front, -PORTAL.half, PORTAL.cornice - 0.6], [PORTAL.front, PORTAL.half, PORTAL.cornice - 0.6],
  [PORTAL.front + 0.12, -PORTAL.half - 0.12, PORTAL.cornice - 0.45], [PORTAL.front + 0.12, PORTAL.half + 0.12, PORTAL.cornice - 0.45],
  [PORTAL.front - 0.6, -PORTAL.half - 0.12, PORTAL.cornice - 0.45], [PORTAL.front - 0.6, PORTAL.half + 0.12, PORTAL.cornice - 0.45],
  [PORTAL.front + 0.12, -PORTAL.half - 0.12, PORTAL.cornice + 0.02], [PORTAL.front + 0.12, PORTAL.half + 0.12, PORTAL.cornice + 0.02],
  [PORTAL.front, -PORTAL.half - 0.12, PORTAL.cornice + 0.02], [PORTAL.front, PORTAL.half + 0.12, PORTAL.cornice + 0.02],
  [PORTAL.front - 0.6, 0, PORTAL.peak + 0.1], [PORTAL.front + 0.12, 0, PORTAL.peak + 0.12],
]);
const pinnacle = hull([
  [PORTAL.front - 0.9, -0.45, PORTAL.peak - 0.2], [PORTAL.front, -0.45, PORTAL.peak - 0.2],
  [PORTAL.front - 0.9, 0.45, PORTAL.peak - 0.2], [PORTAL.front, 0.45, PORTAL.peak - 0.2],
  [PORTAL.front - 0.45, 0, PORTAL.pinnacle],
]);
// Deur met halfrond bovenlicht: 1,5 m breed, aanzet 2,45 m, kruin 3,2 m.
const door = archNiche(PORTAL.front, 1.5, BASE + 0.25, 2.45, 0.4);
const portal = union([portalBody, portalCornice, pinnacle]).subtract(door);

// ---------- schacht ----------
const shaft = solidRev([[R.shaftFoot, H.upperCornice[1] - 0.01], [R.shaftTop, H.frieze[0]], [R.shaftTop, 16.5]]);
// Smalle vensters met natuurstenen dorpels, als nis van 0,9 m: vier op 6,2 tot 7,9 m (45 graden naast de ingang en
// rondom), vier op 10,4 tot 12,2 m (boven de ingang en rondom), vier kleine op 13,3 tot 14,5 m.
const shaftWin = (z0, z1, degs) => around(niche(shaftR(z1), 0.9, z0, z1, 0.3), degs);
const shaftOpenings = union([
  ...shaftWin(6.2, 7.9, every(4, FRONT + 45)),
  ...shaftWin(10.4, 12.2, every(4, FRONT)),
  ...shaftWin(13.3, 14.5, every(4, FRONT + 45)),
]);
// Boogfries: uitgekraagde band (16,4 tot 17,0 m, onderkant 50 graden) op zestien consoles van 0,9 m breed met een
// onderkant van 48 graden vanaf 15,5 m; de bogen zelf zijn de schuine onderkant van de band tussen de consoles (een
// rondboognis in de band liet de export opvullen).
const frieze = ledge(R.shaftTop, R.frieze, 16.4, H.frieze[1]);
const friezeConsole = hull([
  [R.shaftTop - 0.2, -0.45, 15.5], [R.shaftTop - 0.2, 0.45, 15.5], [R.shaftTop - 0.2, -0.45, 16.5], [R.shaftTop - 0.2, 0.45, 16.5],
  [R.frieze, -0.45, 15.95], [R.frieze, 0.45, 15.95], [R.frieze, -0.45, 16.5], [R.frieze, 0.45, 16.5],
]);
const friezeConsoles = union(around(friezeConsole, every(16, FRONT)));
const shaftMolding = ledge(R.frieze, R.shaftMolding, ...H.shaftTop);
const shaftAll = union([shaft.subtract(shaftOpenings), frieze, friezeConsoles, shaftMolding]);

// ---------- uitkraging en reservoir ----------
// Siermetselwerk tussen profielijzers: kegel van 4,55 m op 17,25 m tot 5,4 m op 18,9 m (63 graden).
const corbel = rev([[0, H.shaftTop[1] - 0.01], [R.shaftMolding, H.shaftTop[1] - 0.01], [R.reservoir, H.lip[0]], [R.reservoir, H.lip[0] + 0.3], [0, H.lip[0] + 0.3]]);
const lip = ledge(R.reservoir, R.lip, ...H.lip);
const drum = solidRev([[R.reservoir, H.lip[0]], [R.reservoir, H.cordon[0] + 0.01]]);
// Veertien smalle vensters (lokaal 90 ± 12,9 + 25,7k graden), boogfries met veertien bogen boven de penanten.
const RES_WIN = every(14, FRONT + 360 / 28);
const resWindows = union(around(niche(R.reservoir, 0.9, ...H.resWindows, 0.3), RES_WIN));
const resFrieze = ledge(R.reservoir, R.resFrieze, ...H.resFrieze);
const resArches = union(around(archNiche(R.resFrieze, 1.6, H.resFrieze[0] - 0.4, 25.0, 0.3), RES_WIN));
const cordon = ledge(R.reservoir, R.cordonRes, ...H.cordon);
const reservoir = union([corbel, lip, drum.subtract(resWindows), resFrieze.subtract(resArches), cordon]);

// ---------- kantelen en dakterras ----------
// Borstwering van 0,9 m dik tot het dakterras, daarop achttien kantelen van 0,95 m breed (tussenruimte 0,93 m op de
// buitenkant); die boven de ingang tot 29,9 m.
const parapet = solidRev([[R.parapetOut, H.cordon[1] - 0.01], [R.parapetOut, H.terrace]]);
const MERLON_DEG = 360 / 18;
const merlon = (top) => {
  const a = (MERLON_DEG / 4) * (Math.PI / 180) * 1.01;
  const pts = [[R.parapetIn * Math.cos(-a), R.parapetIn * Math.sin(-a)], [R.parapetOut * Math.cos(-a), R.parapetOut * Math.sin(-a)], [R.parapetOut * Math.cos(a), R.parapetOut * Math.sin(a)], [R.parapetIn * Math.cos(a), R.parapetIn * Math.sin(a)]];
  return hull([...pts.map(([x, y]) => [x, y, H.terrace - 0.01]), ...pts.map(([x, y]) => [x, y, top])]);
};
const merlons = union(every(18, FRONT).map((deg) => place(merlon(deg === FRONT ? H.highMerlon : H.merlon), { deg })));
const top = union([parapet, merlons]);

const tower = union([plinth, footWall, footBands, place(portal, { deg: FRONT }), shaftAll, reservoir, top]);

await writeLandmark({
  slug: "watertoren-baarn",
  base: BASE,
  nodes: [["building:watertoren-voet-portaal-schacht-reservoir-en-kantelen", tower]],
  catalog: {
    name: "Watertoren Baarn",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, 7], [0, -7]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0308100000021663"],
    description:
      "Oorsprong op het hart van de top in het AHN-DSM op het maaiveld (NAP +14,3 m; het BAG-pand ligt 1,2 m zuidwestelijker), +X naar RD-richting 24 graden, +Y naar 114 graden (noordwest): portaal, straatzijde en hoge kanteel. Verjongende voet met plint, natuurstenen band en cordonlijsten, portaal met timpaan en pinakel; schacht met smalle vensters en boogfries; uitkraging naar het Intze-reservoir van 10,8 m met veertien vensters, boogfries en cordonlijst; achttien kantelen rond het dakterras op 28,45 m tot 29,35 m, boven de ingang tot 29,9 m. Maten uit BAG, AHN en een foto.",
    realWorld: {
      built: 1903,
      architect: "Utrechtsche Waterleiding Maatschappij",
      publishedHeightM: 29,
      publishedFootDiameterM: 10,
      reservoirM3: 500,
      monument: 511733,
      ahnGroundNapM: GROUND_NAP,
      ahnTerraceNapM: 42.86,
      ahnMerlonNapM: [43.4, 43.7],
      ahnTopNapM: 44.18,
      footDiameterM: [R.foot * 2, R.footTop * 2],
      shaftDiameterM: [R.shaftFoot * 2, R.shaftTop * 2],
      reservoirDiameterM: R.reservoir * 2,
      terraceM: H.terrace,
      merlonM: H.merlon,
      topM: H.highMerlon,
      bagOffsetM: 1.2,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/511733 (1903, Utrechtse Waterleiding Maatschappij, 29 m, voet 10 m, drie geledingen, portaal met timpaan en pinakel, schacht met smalle vensters en boogfries, uitkraging tussen profielijzers, reservoir met smalle vensters en boogfries, cordonlijst met kantelen, hogere kanteel met windvaan, Intze I-reservoir 500 m³)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Baarn) (Sophialaan 31, 29 m, 500 m³, woning sinds 2014)",
      "https://commons.wikimedia.org/wiki/File:Baarn_Watertoren_9170.JPG (recht op de ingang: geledingen, portaal, vensters, uitkraging, reservoir, kantelen)",
      "PDOK BAG-pand 0308100000021663, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

// Watertoren van Deventer aan de Ceintuurbaan (bij nr. 401), in het Nieuwe Plantsoen op een van de hoogste plekken van
// de stad. Gebouwd in 1892 (gedenksteen 31 mei 1892; BAG-bouwjaar 1893) naar ontwerp van stadsarchitect J.A. Mulock
// Houwer, in neorenaissancestijl; rijksmonument 12706, 53 m tot de windvaan (Wikipedia en register), reservoir van
// 500 m³ (Intze-type), sinds eind jaren 1990 van Vitens en nog in gebruik. Een ronde toren van paarsrode baksteen met
// lichte natuurstenen banden, op een ronde voet van basaltblokken met een trap naar de ingang. De onderbouw is gebatterd
// en heeft acht velden tussen lisenen, elk met twee vensters boven elkaar onder een ontlastingsboog (in het veld aan de
// noordkant de deur). Daarboven een kroonlijst en een taps toelopende schacht in vier geledingen met banden en vensters.
// Op zestien consoles kraagt het Intze-reservoir uit: een zware stenen lijst, een tegelband, zestien rondboogvensters
// tussen lisenen onder bogen, en een overstekende kroonlijst. Daarop een kegelvormig leien dak met vier dakkapellen
// (gebogen topgevels met pinakels), een rood lantaarnvoetstuk met een omgang (smeedijzeren hek), een lantaarn met een
// leien uikoepel en een windvaan met een zeemeermin.
//
// Oorsprong op het hart van BAG-pand 0150100000017040 (cirkel van 72 punten, straal 7,10 m; de top in het AHN-DSM ligt
// 0,3 m ernaast) op het maaiveld rond de basaltvoet: AHN-DTM NAP +10,9 (ring van 8,5 tot 10 m: 10,7 tot 11,0; de
// heuvel zakt naar NAP +9,8 op 17 m). +X wijst naar RD-richting -4 graden (oost), +Y naar 86 graden (noord): daar zit
// de trap in de basaltvoet (AHN-DSM: een helling van NAP +11,0 tot +12,2 tussen 7,8 en 9,4 m, 3,5 m breed) en, net als
// in het westen, oosten en zuiden, een dakkapel (luchtfoto; in het DSM staat alleen de westelijke kapel, op 176 graden).
// Maten: basaltvoet en dak uit het AHN-DSM 0,5 m (voet NAP +12,2 tot 8,05 m; kroonlijst +45,6 op 7,0 tot 7,35 m; dak
// p90 per halve meter straal: 6,75 m +45,56, 5,25 m +47,44, 3,25 m +49,77, rechte kegel van circa 50 graden; omgang
// +52,08 tot 3,0 m; koepel tot +58,2, piek +59,6); geledingen uit de foto "DvntrWatertorenWest.jpg" (Commons, vanaf het
// westen; 36,6 px/m tussen de kroonlijst van de onderbouw en de tegelfries onder de consoles, verankerd op de kroonlijst
// van het reservoir uit het AHN) en "Overzicht - Deventer - 20054378 - RCE.jpg" (vanaf de trap, ingang); breedtes
// uit de RCE-foto's 20054380 en 20054379 en "Deventer Watertoren.JPG" (lantaarn, koepel, dakkapellen).
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [206913.5, 475726.94];
const AXIS_DEG = -4;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 10.9;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 54,15, west 54,10, zuidoost 54,07, zuidwest
// 54,05), gemeten 2026-11-05. Recht ten zuiden (lokaal -Y) ligt op 9 m een smal verdiept pad (PDOK 53,43, AHN NAP
// +10,2); daar staat geen punt, anders zakt de toren 0,6 m weg. Bij de trap (noord) 54,21.
const GROUND_ELLIPSOID = 54.05;

// Omwenteling van een gesloten profiel [[r, z], ...] (r > 0 voor een ring, r = 0 op de as voor een massief).
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Massief onder een profiel van onder naar boven, gesloten langs de as.
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Schijf tot r1 tussen z0 en z1, met een onderkant van 50 graden vanaf de straal rIn (massief tot de as); precies 45
// graden vult de export in lagen van 0,1 mm nog net op.
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
// Straal van een rechte kegel van (ra, za) tot (rb, zb) op hoogte z.
const coneR = (ra, za, rb, zb) => (z) => ra + ((rb - ra) * (z - za)) / (zb - za);
// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder
// 56 graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Rondboognis: als niche, met een halfrond (veelhoek van 7 punten) bovenop; het boogplafond loopt naar binnen onder 63
// graden op (56 graden liet de export onder de kruin van de reservoirvelden nog een randje opvullen).
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

// ---------- hoogtes boven het maaiveld (NAP +10,9) ----------
const H = {
  plinth: 1.3, // basaltvoet (AHN NAP +12,2)
  socle: [1.3, 2.0], // gemetselde plint van de onderbouw, schuin tot 2,2
  baseTop: 12.9, // onderkant van de kroonlijst van de onderbouw
  baseCornice: [12.9, 13.5],
  bands: [17.4, 20.7, 24.0], // natuurstenen banden van de schacht (0,35 m hoog)
  shaftTop: 26.6, // tegelfries, onderkant van de consoles
  soffit: 29.2, // bovenkant van de consoles (tot 29,45 aan de buitenkant)
  ledge: [29.2, 30.2], // zware stenen lijst onder het reservoir; de bodem loopt tot 29,43 door, daarboven is de lijst te zien
  resBays: [31.2, 32.5], // verdiepte velden met rondboog (aanzet 32,5, kruin 33,4)
  resWindows: [31.4, 32.0], // vensters (aanzet 32,0, kruin 32,45)
  cornice: [34.3, 34.75], // kroonlijst van het reservoir (AHN NAP +45,6)
  deck: 41.2, // omgang (AHN NAP +52,08)
};
// Stralen.
const R = {
  plinth: 8.05,
  socle: 7.05,
  baseFoot: 6.85, // gebatterde onderbouw: 6,85 op 2,2 m tot 6,35 op 12,9 m (BAG-cirkel 7,10 met de plint)
  baseTop: 6.35,
  recess: 0.25, // velden tussen de lisenen
  baseCornice: 6.6,
  shaftFoot: 5.35, // taps: 5,35 op 13,5 m tot 4,85 op 26,6 m
  shaftTop: 4.85,
  band: 0.12, // uitsteek van de banden
  console: 7.0,
  reservoir: 6.95,
  ledge: 7.1,
  cornice: 7.35, // AHN-DSM: kroonlijst tot 7,0 à 7,4 m
  drum: 2.6, // lantaarnvoetstuk
  deck: 3.0,
  lantern: 1.15,
};
const baseR = coneR(R.baseFoot, 2.2, R.baseTop, H.baseTop);
const shaftR = coneR(R.shaftFoot, H.baseCornice[1], R.shaftTop, H.shaftTop);

// ---------- basaltvoet en trap (ingang naar +Y) ----------
const STAIR = { half: 1.4, wall: 0.45, foot: 9.7, top: 7.6, steps: 6 };
const plinth = solidRev([[R.plinth, BASE], [R.plinth, H.plinth]]).subtract(box(-STAIR.half, 7.3, BASE + 0.2, STAIR.half, 9, H.plinth + 1));
const tread = (STAIR.foot - STAIR.top) / STAIR.steps;
const steps = union(
  Array.from({ length: STAIR.steps }, (_, k) =>
    box(-STAIR.half - 0.01, 7.25, BASE, STAIR.half + 0.01, STAIR.foot - k * tread, ((k + 1) * H.plinth) / STAIR.steps)),
);
// Wangen naast de trap: bovenkant van 0,35 m boven de voet tot 0,3 m bij de onderste trede.
const cheek = (s) => hull([
  [s * STAIR.half, 7.3, BASE], [s * (STAIR.half + STAIR.wall), 7.3, BASE],
  [s * STAIR.half, 9.9, BASE], [s * (STAIR.half + STAIR.wall), 9.9, BASE],
  [s * STAIR.half, 7.3, H.plinth + 0.35], [s * (STAIR.half + STAIR.wall), 7.3, H.plinth + 0.35],
  [s * STAIR.half, 8.0, H.plinth + 0.35], [s * (STAIR.half + STAIR.wall), 8.0, H.plinth + 0.35],
  [s * STAIR.half, 9.9, 0.3], [s * (STAIR.half + STAIR.wall), 9.9, 0.3],
]);
// Drie treden voor de deur op het terras van de basaltvoet.
const doorSteps = union([0, 1, 2].map((k) => box(-1.25, 6.4, H.plinth - 0.05, 1.25, 7.75 - 0.3 * k, H.plinth + 0.25 * (k + 1))));
const foot = union([plinth, steps, cheek(1), cheek(-1), doorSteps]);

// ---------- onderbouw ----------
// Acht velden van 0,25 m diep tussen lisenen van circa 1,3 m, met een rondboog (kruin 12,05 m, binnen 12,5 m onder de kroonlijst) als ontlastingsboog;
// het veld aan de noordkant (90 graden) heeft de deur. Per veld twee vensters boven elkaar.
const BASE_BAYS = every(8, 90);
const socle = rev([[0, H.socle[0] - 0.01], [R.socle, H.socle[0] - 0.01], [R.socle, H.socle[1]], [R.baseFoot, H.socle[1] + 0.2], [0, H.socle[1] + 0.2]]);
const baseWall = solidRev([[R.baseFoot, H.socle[1]], [R.baseTop, H.baseTop + 0.01]]);
const baseInner = solidRev([[R.baseFoot - R.recess, H.socle[1] - 1], [R.baseTop - R.recess, H.baseTop + 1]]);
const bayW = 3.9; // breedte van een veld langs de gevel (omtrek 41,5 m / 8 min een lisene van 1,3 m)
const bayArch = (() => {
  const r = bayW / 2, spring = 10.1, f = baseR(spring);
  const arc = Array.from({ length: 9 }, (_, k) => {
    const t = (Math.PI * k) / 8;
    return [-r * Math.cos(t), spring + r * Math.sin(t)];
  });
  // Binnenkant 0,4 hoger (58 graden over de 0,25 m diepte), buitenkant ongewijzigd; onderaan tot in de plint.
  return hull([
    ...arc.map(([y, z]) => [f - R.recess - 0.05, y, z + 0.45]),
    ...arc.map(([y, z]) => [f + 0.02, y, z]),
    ...arc.map(([y, z]) => [f + 1.5, y, z]),
    [f - 1, -r, H.socle[1] + 0.2], [f - 1, r, H.socle[1] + 0.2], [f + 1.5, -r, H.socle[1] + 0.2], [f + 1.5, r, H.socle[1] + 0.2],
  ]);
})();
const bays = union(around(bayArch, BASE_BAYS)).subtract(baseInner);
const baseCornice = union([
  ledge(baseR(12.5), R.baseCornice, ...H.baseCornice),
  // Afzaat van de kroonlijst naar de schacht.
  rev([[R.shaftFoot - 0.3, H.baseCornice[1] - 0.01], [R.baseCornice, H.baseCornice[1] - 0.01], [R.baseCornice - 0.05, H.baseCornice[1] + 0.05], [R.shaftFoot - 0.3, H.baseCornice[1] + 0.5]]),
]);
// Vensters in de velden: onder 3,0 tot 6,4 m (in het noordelijke veld de deur van 2,05 tot 4,7 m), boven 7,4 tot 10,0 m.
const winInBay = (z0, z1, w) => niche(baseR(z1) - R.recess, w, z0, z1, 0.3);
const baseOpenings = union([
  ...around(winInBay(3.0, 6.4, 1.3), BASE_BAYS.filter((d) => d !== 90)),
  ...around(winInBay(7.4, 10.0, 1.3), BASE_BAYS),
  place(niche(baseR(4.7) - R.recess, 1.6, H.plinth + 0.75, 4.7, 0.4), { deg: 90 }),
]);
// De velden snijden ook in de onderkant van de kroonlijst, zodat hun boogplafond schuin blijft.
const base = union([socle, baseWall, baseCornice]).subtract(union([bays, baseOpenings]));

// ---------- schacht ----------
const shaft = solidRev([[R.shaftFoot, H.baseCornice[1] - 0.01], [R.shaftTop, H.shaftTop + 0.01]]);
const shaftBands = union(H.bands.map((z) => ledge(shaftR(z), shaftR(z) + R.band, z, z + 0.35)));
// Vensters per geleding (rondboog, 0,9 m breed als nis): vier op 45 + 90k, vier hoge op 90k, vier op 45 + 90k, acht
// kleine bovenaan.
const shaftWin = (z0, z1, degs) => around(archNiche(shaftR(z1 + 0.45), 0.9, z0, z1, 0.3), degs);
const shaftOpenings = union([
  ...shaftWin(14.6, 16.0, every(4, 45)),
  ...shaftWin(18.2, 19.8, every(4, 0)),
  ...shaftWin(21.6, 23.0, every(4, 45)),
  ...shaftWin(24.8, 25.6, every(8, 22.5)),
]);
const shaftAll = union([shaft, shaftBands]).subtract(shaftOpenings);

// ---------- consoles en reservoir ----------
// Schuine Intze-bodem onder 49 graden tussen zestien consoles (onder 49 graden, 0,9 m breed, onder de lisenen).
// De bodem loopt door tot de buitenkant van de lijst (7,1 m op 29,43), zodat de lijst er zonder ondervlak op staat.
const soffitTop = H.shaftTop + 0.15 + ((R.ledge - R.shaftTop) * 2.5) / 2.1;
const soffit = rev([[R.shaftTop - 0.3, H.shaftTop + 0.15], [R.shaftTop, H.shaftTop + 0.15], [R.ledge, soffitTop], [R.ledge, soffitTop + 0.05], [R.shaftTop - 0.3, soffitTop + 0.05]]);
const consoleOne = hull([
  [R.shaftTop - 0.2, -0.45, H.shaftTop - 0.2], [R.shaftTop - 0.2, 0.45, H.shaftTop - 0.2],
  [R.shaftTop - 0.2, -0.45, H.soffit + 0.05], [R.shaftTop - 0.2, 0.45, H.soffit + 0.05],
  [R.console, -0.45, H.soffit - 0.1], [R.console, 0.45, H.soffit - 0.1],
  [R.console, -0.45, H.soffit + 0.25], [R.console, 0.45, H.soffit + 0.25],
]);
const RES_PIERS = every(16, 11.25);
const RES_BAYS = every(16, 0);
const consoles = union(around(consoleOne, RES_PIERS));
const resLedge = solidRev([[R.ledge, soffitTop - 0.01], [R.ledge, H.ledge[1]]]);
// Kern van de schacht tot in het reservoir, zodat er onder de bodem geen holte overblijft.
const core = solidRev([[R.shaftTop, H.shaftTop - 0.01], [R.shaftTop, H.soffit + 0.1]]);
const drum = solidRev([[R.reservoir, H.soffit], [R.reservoir, H.cornice[1]]]);
const cornice = ledge(R.reservoir, R.cornice, ...H.cornice);
// Zestien verdiepte velden (1,8 m breed, 0,25 m diep) met een rondboog tussen lisenen van 0,9 m, en in elk veld een
// rondboogvenster van 0,9 m.
const resOpenings = union([
  ...around(archNiche(R.reservoir, 1.8, ...H.resBays, 0.25), RES_BAYS),
  ...around(archNiche(R.reservoir - 0.25, 0.9, ...H.resWindows, 0.3), RES_BAYS),
]);
const reservoir = union([core, soffit, consoles, resLedge, union([drum, cornice]).subtract(resOpenings)]);

// ---------- dak, dakkapellen, lantaarn ----------
// Rechte kegel uit het AHN: z = 34,66 + 1,17 (6,75 - r), van de kroonlijst tot het lantaarnvoetstuk.
const roofZ = (r) => 34.66 + 1.17 * (6.75 - r);
const roof = solidRev([[R.reservoir, H.cornice[1] - 0.3], [R.reservoir - 0.05, roofZ(R.reservoir - 0.05)], [R.drum, roofZ(R.drum)]]);
// Lantaarnvoetstuk (rood) met een schuin uitlopende rand onder de omgang.
const drumTop = 40.8;
const lanternBase = solidRev([[R.drum, roofZ(R.drum) - 1], [R.drum, drumTop], [R.deck, drumTop + (R.deck - R.drum)], [R.deck, H.deck]]);
// Lantaarn, kraag onder 45 graden en uikoepel (leien), met een makelaar tot NAP +59,6.
const lantern = union([
  solidRev([[R.lantern, H.deck - 0.01], [R.lantern, 43.5]]),
  ledge(R.lantern, 1.5, 43.5, 43.85),
  solidRev([[1.35, 43.84], [1.45, 44.3], [1.45, 44.8], [1.3, 45.4], [1.0, 46.0], [0.6, 46.6], [0.35, 47.0]]),
  solidRev([[0.45, 46.8], [0.45, 47.9], [0.3, 48.7]]),
]);
// Dakkapel (gebouwd met de voorgevel naar +X): topgevel met gebogen schouders tot 38,2 m en een pinakel tot 38,8 m,
// zadeldakje erachter tot 37,9 m (0,6 m dikke topgevel), rondboogvenster van 0,9 m als nis.
const DORMER = { face: 6.6, half: 1.1, eaves: 36.9, top: 38.2 };
const gable = hull([
  ...[DORMER.face - 0.6, DORMER.face].flatMap((x) => [
    [x, -DORMER.half, H.cornice[1] - 0.4], [x, DORMER.half, H.cornice[1] - 0.4],
    [x, -DORMER.half, DORMER.eaves], [x, DORMER.half, DORMER.eaves],
    [x, -0.75, 37.6], [x, 0.75, 37.6], [x, -0.4, DORMER.top], [x, 0.4, DORMER.top],
  ]),
]);
const dormerBody = hull([
  [3.9, -DORMER.half, H.cornice[1] - 0.4], [DORMER.face - 0.2, -DORMER.half, H.cornice[1] - 0.4],
  [3.9, DORMER.half, H.cornice[1] - 0.4], [DORMER.face - 0.2, DORMER.half, H.cornice[1] - 0.4],
  [3.9, -DORMER.half, DORMER.eaves], [DORMER.face - 0.2, -DORMER.half, DORMER.eaves],
  [3.9, DORMER.half, DORMER.eaves], [DORMER.face - 0.2, DORMER.half, DORMER.eaves],
  [3.9, 0, 37.9], [DORMER.face - 0.2, 0, 37.9],
]);
const pinnacle = hull([
  [DORMER.face - 0.6, -0.45, DORMER.top - 0.05], [DORMER.face, -0.45, DORMER.top - 0.05],
  [DORMER.face - 0.6, 0.45, DORMER.top - 0.05], [DORMER.face, 0.45, DORMER.top - 0.05],
  [DORMER.face - 0.3, 0, 38.8],
]);
const dormer = union([gable, dormerBody, pinnacle]).subtract(archNiche(DORMER.face, 0.9, 35.3, 36.15, 0.3));
const DORMERS = every(4, 0);
const top = union([roof, lanternBase, lantern, ...around(dormer, DORMERS)]);

const tower = union([foot, base, shaftAll, reservoir, top]);

await writeLandmark({
  slug: "watertoren-deventer",
  base: BASE,
  nodes: [["building:watertoren-voet-schacht-reservoir-dak-en-lantaarn", tower]],
  catalog: {
    name: "Watertoren Deventer",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-9, 0], [6.4, -6.4], [-6.4, -6.4]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0150100000017040"],
    description:
      "Oorsprong op het hart van het ronde BAG-pand op het maaiveld rond de basaltvoet (NAP +10,9 m), +X naar RD-richting -4 graden, +Y naar het noorden (86 graden): trap en ingang. Basaltvoet van 16,1 m met trap; gebatterde onderbouw met acht verdiepte velden onder rondbogen, twee vensters per veld en de deur; kroonlijst; taps toelopende schacht met drie banden en vensters; zestien consoles onder een schuine Intze-bodem, zware lijst, reservoir met zestien rondboogvelden en vensters, kroonlijst van 14,7 m tot 34,75 m; kegeldak met vier dakkapellen, rood lantaarnvoetstuk met omgang op 41,2 m, lantaarn en uikoepel met makelaar tot 48,7 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1892,
      architect: "J.A. Mulock Houwer (stadsarchitect)",
      publishedHeightM: 53,
      reservoirM3: 500,
      monument: 12706,
      ahnGroundNapM: GROUND_NAP,
      ahnPlinthNapM: 12.2,
      ahnCorniceNapM: 45.6,
      ahnDeckNapM: 52.08,
      ahnTopNapM: 59.6,
      plinthDiameterM: R.plinth * 2,
      baseDiameterM: [R.baseFoot * 2, R.baseTop * 2],
      shaftDiameterM: [R.shaftFoot * 2, R.shaftTop * 2],
      reservoirDiameterM: R.reservoir * 2,
      corniceDiameterM: R.cornice * 2,
      corniceM: H.cornice,
      deckM: H.deck,
      topM: 48.7,
      photoScalePxPerM: 36.6,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/12706 (1892, J.A. Mulock Houwer, 53 m, basaltvoet, Intze-reservoir, natuursteen banden en consoles, spits dak met dakkapellen, koepellantaarn, balustrade, windvaan met zeemeermin)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Deventer) (53 m, 500 m³, Ceintuurbaan, Vitens)",
      "https://commons.wikimedia.org/wiki/File:DvntrWatertorenWest.jpg (vanaf het westen: geledingen, schaal 36,6 px/m)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_-_Deventer_-_20054378_-_RCE.jpg (ingang, trap en basaltvoet)",
      "https://commons.wikimedia.org/wiki/File:Aanzicht_-_Deventer_-_20054380_-_RCE.jpg, File:Aanzicht_-_Deventer_-_20054379_-_RCE.jpg, File:Reservoir_gedeelte_-_Deventer_-_20054381_-_RCE.jpg (onderbouw, consoles, reservoir, dakkapellen)",
      "https://commons.wikimedia.org/wiki/File:Deventer_Watertoren.JPG en File:Watertoren_Deventer_uit_1892.jpg (dak, dakkapellen, lantaarn, koepel)",
      "PDOK BAG-pand 0150100000017040, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-05",
    ],
  },
});

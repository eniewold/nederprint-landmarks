// Watertoren van Lochem (1924, H. Wessel), 18,6 m hoog met een reservoir van
// 250 m³, op de beboste heuveltop aan de oostkant van Lochem. Achtkante
// bakstenen toren met een plat dak achter een borstwering; tegen de
// noordgevel staat een achtkant trappentorentje dat tot boven de borstwering
// doorloopt en een laag koperen dak heeft. Elk vlak van de hoofdtoren heeft
// een middenveld (van de tandlijst op circa 7 m tot een natuurstenen kap op
// 12,3 m), witte natuurstenen banden en kleine ventilatieroosters; de
// hoofdingang met een puntige omlijsting staat in het noordoostvlak, het
// torentje heeft een eigen deur aan de noordkant. Op het dak staan een
// vakwerkmast en installatiekasten.
// Oorsprong op het hart van de achthoek (BAG-contour, binnen 0,1 m gelijk aan
// het AHN) op maaiveld (NAP +35,98 m). +X staat loodrecht op de oostgevel,
// 14,4 graden linksom van RD-oost (BAG-gevels en AHN-randen); +Y wijst naar het
// trappentorentje (noord). Hoogtes uit het AHN (dak 13,7 m, borstwering 14,7 m,
// top van het torentje 18,7 m); banden, middenvelden, deuren en roosters van
// de Commons-foto (2006, noordoostvlak) geschaald op de borstwering in het AHN.
import { hull, ring3, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [225180.92, 463264.8];
const AXIS = [0.96858, 0.24869]; // 14,4 graden
const BASE = -0.3;
const H = {
  plinth: 1.0, // gemetselde plint, 0,15 m uit, met een schuine bovenkant
  plinthTop: 1.25,
  panel: [7.0, 12.3], // middenveld per vlak, van de tandlijst tot de natuurstenen kap
  band1: [10.9, 11.2], // witte band halverwege de bovenste geleding
  band2: [13.35, 13.65], // witte band op dakhoogte, onder de borstwering
  roof: 13.7, // plat dak (AHN)
  coping: [14.45, 14.7], // afdeklijst van de borstwering (AHN 14,7)
  turretCornice: [17.4, 17.75], // kroonlijst van het torentje
  turretApex: 18.7, // top van het lage koperen dak (AHN 18,7; Wikipedia 18,6)
  equipment: 15.4, // installatiekasten bij de voet van de mast (AHN)
};
const A = 5.4; // apothema van de achthoek (BAG 5,34 tot 5,43, AHN 5,25 tot 5,5)
const T = { c: [0.1, 5.9], a: 1.6 }; // trappentorentje: hart en apothema (BAG/AHN, voorkant op 7,5)
const PARAPET = 1.2; // dikte van de borstwering: achter de nissen blijft 1,0 m (dunner wordt in de export verdikt)

const oct = (c, a) => circle(c, a / Math.cos(Math.PI / 8), 8, Math.PI / 8); // vlakken met normaal op k·45 graden
const prismOct = (c, a, z0, z1) => hull([...ring3(oct(c, a), z0), ...ring3(oct(c, a), z1)]);
// Band van z0 tot z1 die p m uitsteekt, op een schuine onderkant onder 56 graden.
const band = (c, a, [z0, z1], p) =>
  hull([...ring3(oct(c, a), z0 - 1.5 * p), ...ring3(oct(c, a + p), z0), ...ring3(oct(c, a + p), z1), ...ring3(oct(c, a), z1)]);

// ---------- hoofdtoren: achthoek, plint, banden, borstwering met afdeklijst ----------
const shaft = prismOct([0, 0], A, BASE, H.roof);
// De band() is een volle schijf: de afdeklijst wordt samen met de borstwering uitgehold tot het dak.
const parapet = union([prismOct([0, 0], A, H.roof - 0.01, H.coping[1]), band([0, 0], A, H.coping, 0.1)]).subtract(prismOct([0, 0], A - PARAPET, H.roof, H.coping[1] + 1));
const plinth = hull([...ring3(oct([0, 0], A + 0.15), BASE), ...ring3(oct([0, 0], A + 0.15), H.plinth), ...ring3(oct([0, 0], A), H.plinthTop)]);
const bands = union([band([0, 0], A, H.band1, 0.12), band([0, 0], A, H.band2, 0.12)]);

// ---------- trappentorentje met banden, kroonlijst en laag achtkant dak ----------
const turret = union([
  prismOct(T.c, T.a, BASE, H.turretCornice[0] + 0.01),
  hull([...ring3(oct(T.c, T.a + 0.15), BASE), ...ring3(oct(T.c, T.a + 0.15), H.plinth), ...ring3(oct(T.c, T.a), H.plinthTop)]),
  band(T.c, T.a, H.band1, 0.1),
  band(T.c, T.a, H.band2, 0.1),
  band(T.c, T.a, H.coping, 0.1),
  band(T.c, T.a, H.turretCornice, 0.15),
  hull([...ring3(oct(T.c, T.a + 0.15), H.turretCornice[1] - 0.01), [...T.c, H.turretApex]]),
]);

// ---------- ingang: puntige omlijsting en twee treden voor het noordoostvlak ----------
// In het stelsel van het vlak (normaal +X, vlak op x = A); daarna gedraaid naar 45 graden.
const surround = hull([
  ...[A - 0.1, A + 0.2].flatMap((x) => [[x, -1.4, BASE], [x, 1.4, BASE], [x, -1.4, 3.0], [x, 1.4, 3.0], [x, 0, 4.3]]),
]);
const steps = union([prism([[A, -1.1], [A + 0.7, -1.1], [A + 0.7, 1.1], [A, 1.1]], BASE, 0.3), prism([[A + 0.7, -1.1], [A + 1.1, -1.1], [A + 1.1, 1.1], [A + 0.7, 1.1]], BASE, 0.15)]);

// Equipment op het dak: installatiekasten naast de voet van de vakwerkmast (AHN 1,2 tot 2,3 m boven het dak).
const equipment = prism([[-3.0, -0.8], [-0.8, -0.8], [-0.8, 2.4], [-3.0, 2.4]], H.roof - 0.01, H.equipment);

// ---------- nissen (vlak met normaal +X op afstand f) ----------
// Vlakke bodem en een plafond dat naar binnen onder 56 graden oploopt (de export vult hem niet op).
const niche = (f, w, z0, z1, depth = 0.25, y = 0) => {
  const a = f - depth, b = f + Math.min(0.6, (z1 - z0) / 1.5 - 0.01), zb = z1 - 1.5 * (b - f), za = z1 + 1.5 * depth;
  const y0 = y - w / 2, y1 = y + w / 2;
  return hull([
    [a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0],
    [a, y0, za], [a, y1, za], [f, y0, z1], [f, y1, z1], [b, y0, zb], [b, y1, zb],
  ]);
};
const MAIN_FACES = [0, 45, 135, 180, 225, 270, 315]; // het noordvlak (90) zit achter het torentje
const DOOR = 45;
const cuts = union([
  // Middenveld per vlak, 2,4 m breed en 0,2 m diep; de band op 10,9 m loopt er niet door.
  ...MAIN_FACES.map((deg) => place(niche(A, 2.4, ...H.panel, 0.2), { deg })),
  // Ventilatieroosters (0,9 × 0,5 m): in het middenveld, eronder en (behalve onder de deur) laag in het vlak.
  ...MAIN_FACES.flatMap((deg) => [
    place(niche(A - 0.2, 0.9, 9.35, 9.85, 0.25), { deg }),
    place(niche(A, 0.9, 5.75, 6.25, 0.25), { deg }),
    ...(deg === DOOR ? [] : [place(niche(A, 0.9, 2.6, 3.1, 0.25), { deg })]),
  ]),
  // Borstwering: drie openingen in de schuine vlakken, drie spleten in de rechte vlakken (als nis).
  ...MAIN_FACES.flatMap((deg) =>
    [-1.2, 0, 1.2].map((y) => place(niche(A, deg % 90 ? 0.55 : 0.3, 13.85, 14.25, 0.2, y), { deg })),
  ),
  // Hoofdingang (1,4 × 2,7 m) in de omlijsting.
  place(niche(A + 0.2, 1.4, 0.3, 2.7, 0.5), { deg: DOOR }),
  // Torentje: deur naar het noorden, spleetvensters, kleine vensters onder het dak.
  ...[[90, 1.0, 0.15, 2.4], [45, 0.45, 5.6, 6.6], [90, 0.45, 5.6, 6.6], [135, 0.45, 5.6, 6.6], [45, 0.45, 8.8, 9.8], [90, 0.45, 8.8, 9.8], [135, 0.45, 8.8, 9.8], [0, 0.5, 12.3, 12.8], [90, 0.5, 12.3, 12.8], [180, 0.5, 12.3, 12.8]].map(
    ([deg, w, z0, z1]) => place(niche(T.a, w, z0, z1, 0.25), { deg, at: [...T.c, 0] }),
  ),
  ...[0, 45, 90, 135, 180].map((deg) => place(niche(T.a, 0.5, 15.9, 16.4, 0.25), { deg, at: [...T.c, 0] })),
]);

const tower = union([shaft, parapet, plinth, bands, turret, place(union([surround, steps]), { deg: DOOR }), equipment]).subtract(cuts);

await writeLandmark({
  slug: "watertoren-lochem",
  base: BASE,
  // Eén node: de export vult elke node apart op; torentje, omlijsting en installaties staan tegen of op de toren.
  nodes: [["building:achtkante-toren-met-trappentorentje", tower]],
  catalog: {
    name: "Watertoren Lochem",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [-7, 0], [0, -7], [0, 9]],
    replacesBuildings: ["NL.IMBAG.Pand.0262100000008034"],
    description:
      "Oorsprong op het hart van de achthoek op maaiveld (NAP +35,98 m), +X loodrecht op de oostgevel (14,4 graden), +Y naar het trappentorentje (noord). Achtkante bakstenen toren van 10,8 m over de vlakken op een plint, met per vlak een verdiept middenveld van 7 tot 12,3 m, witte banden op 10,9 en 13,35 m, plat dak op 13,7 m achter een borstwering met openingen tot 14,7 m, installatiekasten op het dak, de hoofdingang met puntige omlijsting en treden in het noordoostvlak; tegen de noordgevel een achtkant trappentorentje van 3,2 m met eigen deur, spleetvensters, kroonlijst en laag koperen dak tot 18,7 m. Maten uit BAG, AHN en een foto.",
    realWorld: {
      publishedHeightM: 18.6,
      reservoirM3: 250,
      built: 1924,
      architect: "H. Wessel",
      ahnGroundNapM: 35.98,
      ahnRoofM: 13.7,
      ahnParapetM: 14.7,
      ahnTurretTopM: 18.7,
      acrossFlatsM: 10.8,
      turretAcrossFlatsM: 3.2,
      axisDeg: 14.4,
      modelTopM: 18.7,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Lochem)",
      "https://commons.wikimedia.org/wiki/File:Lochem_Watertoren_2006.JPG (noordoostvlak met ingang en torentje, maten)",
      "PDOK BAG-pand 0262100000008034, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

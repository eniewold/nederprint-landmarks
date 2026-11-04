// Watertoren van Overveen (gemeente Bloemendaal) op een duintop bij de Zeeweg/Tetterodeweg, gebouwd in 1897-1898 voor het
// Haarlemse waterleidingbedrijf naar ontwerp van J. Schotel, neo-renaissance (rijksmonument 511099). Volgens het register
// 26,70 m hoog (Wikipedia: 30,95 m), reservoir type Intze II van 1200 m³ en 15,00 m diameter. Een verjongende schacht van
// tien kolommen (aan de buitenkant tien lisenen en tien vlakke traveeën) in twee delen: onder een gebosseerde natuurstenen
// plint, in negen traveeën een groot getoogd venster (twee lichten met een oculus) en in één travee de getoogde ingang met
// trap, ANNO 1898 en het Haarlemse wapen; krachtig geprofileerde lijsten; boven in elke travee een smal hoog getoogd
// venster; bovenaan een boogfries waaruit twintig gietijzeren consoles het sterk uitkragende reservoir dragen. De
// ommanteling van het reservoir heeft twintig pilasters met kapitelen, een fries en een krachtig geprofileerde kroonlijst;
// daarboven kantelen, onderbroken door hoger opgemetselde kantelen (een pijler met piramidekap tussen twee lagere
// schouders, met een stenen schild eronder). Midden op het dak een klein vierkant torentje met kantelen boven de spiltrap.
//
// Oorsprong op het hart van het dak in het AHN-DSM (cirkelfit op de dakrand; RD [101238.38, 489776.13], 0,58 m van het
// zwaartepunt van BAG-pand 0377100000011913, dat de omtrek van het reservoir is: straal 8,5 m) op het maaiveld van de
// duintop, AHN-DTM NAP +22,05 (ring van 9 tot 12 m: +21,9 tot +22,2; de duin loopt daarbuiten af tot +18,6 op 25 m).
// Lokale +X is RD -16 graden; de ingang kijkt naar -Y (RD -106 graden, zuid-zuidwest). De kolommen staan op 36k graden,
// de traveeën met hun vensters op 18 + 36k; de hoger opgemetselde kantelen staan boven de kolommen op 0, 72, 144, 216 en
// 288 graden (AHN-piek NAP +48,3 op RD -160 graden = lokaal -144; Commons-foto's). Het register spreekt van vier punten;
// de foto's tonen er vijf, 72 graden uit elkaar (twee naast elkaar op de telefoto "Watertoren-511099", 71 graden uit
// elkaar), en die volgen hier.
// Maten: BAG (omtrek reservoir), AHN-DSM 0,5 m (dak NAP +45,6; kanteel +46,1 tot +46,8; hoge kanteel +48,3; torentje
// +48,5 tot +49,6, gemeten door de dennen heen), register (tien traveeën, twintig consoles en pilasters, diameter van het
// reservoir), foto's: "Watertoren-511099.jpg" (telelens, vrijwel orthografisch: schaal 56 px/m op het reservoir; breedte
// van de schacht uit twee lisenen en een venster, geledingen van reservoir en borstwering), "Exterieur OVERZICHT -
// Overveen - 20284847 - RCE.jpg" (van ver: reservoir, kroonlijst, kantelen, hoge kantelen) en "Watertoren - Haarlem -
// 20099261 - RCE.jpg" / "20099260" (van onder, voor de ingang: plint, vensters, lijsten, boogfries en consoles).
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [101238.38, 489776.13];
const DEG = -16;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.5;
const GROUND_NAP = 22.05;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier groundSamplePoints op 9,5 m van het hart, gemeten 2026-11-04
// (65,02 tot 65,18).
const GROUND_ELLIPSOID = 65.02;
const C18 = Math.cos(Math.PI / 10);
const RAD = Math.PI / 180;

// Tienhoek met apothema a (hart tot travee), hoekpunten (kolommen) op 36k graden, traveeën met hun normaal op 18 + 36k.
const dec = (a, z) => Array.from({ length: 10 }, (_, k) => [(a / C18) * Math.cos(k * 36 * RAD), (a / C18) * Math.sin(k * 36 * RAD), z]);
const decPrism = (a, z0, z1) => prism(dec(a, 0).map(([x, y]) => [x, y]), z0, z1);
const decFrustum = (a0, z0, a1, z1) => hull([...dec(a0, z0), ...dec(a1, z1)]);
// Cirkel van 80 punten (elke 4,5 graden, dus ook op de pilasters op 18k).
const circ = (r, z, n = 80) => Array.from({ length: n }, (_, k) => [r * Math.cos((2 * Math.PI * k) / n), r * Math.sin((2 * Math.PI * k) / n), z]);
const cyl = (r, z0, z1) => hull([...circ(r, z0), ...circ(r, z1)]);
const bays = (m, skip = []) => Array.from({ length: 10 }, (_, k) => k).filter((k) => !skip.includes(k)).map((k) => place(m, { deg: 18 + 36 * k }));
const cols = (m) => Array.from({ length: 10 }, (_, k) => place(m, { deg: 36 * k }));
const n20 = (m, offset = 0) => Array.from({ length: 20 }, (_, k) => place(m, { deg: offset + 18 * k }));

// ---------- maten (hoogtes boven het maaiveld van de duintop) ----------
// Schacht: muurvlak verjongt van apothema 7,15 op de plint tot 6,70 op 12,0 m (telefoto: lisenen op 7,4 m van het hart
// rond 9 m hoogte); lisenen 1,0 m breed (0,5 m aan weerszijden van de kolom), 0,25 m voor het muurvlak.
const wallA = (z) => 7.15 - (0.45 * (z - 1.8)) / 10.2;
const PIL = { half: 0.5, proud: 0.25, top: 11.0 };
const H = {
  plinth: 1.8,
  colBase: 2.15, // natuurstenen voet onder elke lisene
  lowWin: [2.0, 4.4, 5.4], // onderkant, aanzet en top van de boog
  ledge: [5.9, 6.4, 7.0, 7.25], // schuine onderkant, lijst, schuine bovenkant
  upWin: [7.9, 10.1, 10.6],
  frieze: [10.75, 11.0, 11.5], // boogfries: twee boogjes per travee (top 11,5)
  console: [11.0, 13.6], // twintig consoles van het muurvlak naar de onderkant van het reservoir
  soffit: [12.0, 13.6], // schuine onderkant van het uitkragende reservoir
  sill: [15.05, 15.3, 15.6], // lekdorpellijst onder de vensters van het reservoir
  resWin: [16.2, 19.25, 19.7],
  pilaster: [15.6, 19.8], // pilasters van het reservoir
  capital: [19.9, 20.7],
  cornice: [20.7, 21.2, 22.3],
  roof: 23.45, // plat dak binnen de borstwering (AHN NAP +45,6)
  crenel: 23.6, // onderkant van de kantelopeningen
  merlon: 24.5, // bovenkant van de kantelen (AHN +46,1 tot +46,8)
  shoulder: 25.3,
  pier: 26.1, // hoge kanteel; piramidekap tot 26,7 (AHN-piek NAP +48,3; register 26,70 m)
  pierCap: 26.7,
};
const R = { body: 8.2, sill: 8.4, pilaster: 8.4, capital: 8.5, cornice: 8.65, parapet: 8.3, parapetIn: 7.6 };

// Nis met een getoogde (halfronde) bovenkant in een vlak met normaal +X: voorvlak f(z), breedte wd rond y, onderkant z0,
// aanzet zs, diepte d. Het plafond loopt onder 63 graden het muurwerk in (achterkant 2 d hoger), zodat de export er niets
// onder opvult; aan de buitenkant loopt de snede 1 m door met een top die 1,5 m zakt.
const archNiche = (f, wd, z0, zs, d, y = 0) => {
  const r = wd / 2;
  const outline = [[y - r, z0], [y + r, z0], ...Array.from({ length: 9 }, (_, k) => {
    const t = (Math.PI * k) / 8;
    return [y + r * Math.cos(t), zs + r * Math.sin(t)];
  })];
  return hull(outline.flatMap(([v, z]) => {
    const up = z > z0 + 1e-6 ? 1 : 0;
    return [[f(z) - d, v, z + up * 2 * d], [f(z), v, z], [f(z) + 1.0, v, z - up * 1.5]];
  }));
};
// Puntboog (spits, 60 graden) voor de nissen in het torentje.
const pointedNiche = (f, wd, z0, zs, d, y = 0) => {
  const r = wd / 2;
  const outline = [[y - r, z0], [y + r, z0], [y - r, zs], [y + r, zs], [y, zs + r * Math.sqrt(3)]];
  return hull(outline.flatMap(([v, z]) => {
    const up = z > z0 + 1e-6 ? 1 : 0;
    return [[f - d, v, z + up * 2 * d], [f, v, z], [f + 1.0, v, z - up * 1.5]];
  }));
};
// Strook rond een kolom (richting +X): halve breedte w langs het vlak aan weerszijden; de afstand loodrecht op de straal
// is w cos 18 voor een punt op het vlak op w van de hoek.
const sector = (w, z0, z1) => box(0, -w * C18, z0, 10, w * C18, z1);

// ---------- schacht ----------
const zTop = H.soffit[0];
const shaft = decFrustum(wallA(BASE), BASE, wallA(zTop), zTop);
// Gebosseerde plint: 0,25 m voor het muurvlak, bovenkant onder 45 graden.
const plinth = hull([...dec(wallA(0) + 0.3, BASE), ...dec(wallA(H.plinth) + 0.25, H.plinth), ...dec(wallA(H.plinth + 0.25), H.plinth + 0.25)]);
// Lisenen (kolommen) van de plint tot de boogfries, met een natuurstenen voet die 0,2 m voor de plint uitsteekt.
const pilasterBand = (z0, z1, extra) => hull([...dec(wallA(z0) + extra, z0), ...dec(wallA(z1) + extra, z1)]);
const lisenen = pilasterBand(H.plinth, PIL.top, PIL.proud).intersect(union(cols(sector(PIL.half, H.plinth - 0.1, PIL.top + 0.1))));
const colBases = hull([...dec(wallA(0) + 0.5, BASE), ...dec(wallA(H.colBase) + 0.5, H.colBase), ...dec(wallA(H.colBase) + 0.25, H.colBase + 0.25)])
  .intersect(union(cols(sector(0.75, BASE - 0.1, H.colBase + 0.5))));
// Krachtig geprofileerde lijst tussen het onderste en het bovenste deel: 0,5 m voor het muurvlak (voor de lisenen
// langs), onder- en bovenkant onder 45 graden.
const [l0, l1, l2, l3] = H.ledge;
const ledge = hull([...dec(wallA(l0), l0), ...dec(wallA(l1) + 0.5, l1), ...dec(wallA(l2) + 0.5, l2), ...dec(wallA(l3), l3)]);
// Schuine onderkant van het reservoir (43 graden uit het lood) en de twintig consoles op de kolommen en de vensterassen.
const soffit = hull([...dec(wallA(H.soffit[0]), H.soffit[0]), ...circ(R.body, H.soffit[1])]);
const c0 = H.console[0], aC = wallA(c0);
// Console in de richting +X vanaf het vlak a0 (op c0) naar de onderkant van het reservoir; voorkant 31 graden uit het lood.
const consoleFin = (a0) => hull([
  [a0 - 0.6, -0.3, c0], [a0, -0.3, c0], [a0 - 0.6, 0.3, c0], [a0, 0.3, c0],
  [a0 - 0.6, -0.3, H.console[1]], [R.body + 0.1, -0.3, H.console[1]], [a0 - 0.6, 0.3, H.console[1]], [R.body + 0.1, 0.3, H.console[1]],
]);
// Een console op een kolom staat voor de lisene (hoek van de lisene op (a + 0,25) / cos 18), die op een vensteras midden
// in de travee.
const consoles = union([...cols(consoleFin((aC + PIL.proud) / C18)), ...bays(consoleFin(aC))]);

// ---------- reservoir ----------
const body = cyl(R.body, H.soffit[1] - 0.01, H.cornice[1]);
const sill = hull([...circ(R.body, H.sill[0]), ...circ(R.sill, H.sill[1]), ...circ(R.sill, H.sill[2])]);
const pilaster = box(R.body - 0.2, -0.4, H.pilaster[0], R.pilaster, 0.4, H.capital[0]);
const capital = hull([
  [R.body - 0.2, -0.4, H.pilaster[1]], [R.pilaster, -0.4, H.pilaster[1]], [R.body - 0.2, 0.4, H.pilaster[1]], [R.pilaster, 0.4, H.pilaster[1]],
  [R.capital, -0.4, H.capital[0]], [R.capital, 0.4, H.capital[0]],
  [R.body - 0.2, -0.4, H.capital[1]], [R.capital, -0.4, H.capital[1]], [R.body - 0.2, 0.4, H.capital[1]], [R.capital, 0.4, H.capital[1]],
]);
const cornice = hull([...circ(R.body, H.cornice[0]), ...circ(R.cornice, H.cornice[1]), ...circ(R.cornice, H.cornice[2])]);

// ---------- borstwering met kantelen ----------
// Per sector van 72 graden: een hoge kanteel boven de kolom (pijler 1,2 m breed, schouders van 0,6 m), dan vier
// kantelopeningen en drie kantelen van elk 1,15 m op de buitenkant (1,05 m aan de binnenkant), zo grof als printbaar.
const parapetRing = cyl(R.parapet, H.cornice[2] - 0.01, H.merlon);
const roofCut = cyl(R.parapetIn, H.roof, H.pier + 1);
const pieSlice = (deg0, deg1, z0, z1) => prism([
  [6.8 * Math.cos(deg0 * RAD), 6.8 * Math.sin(deg0 * RAD)], [9.5 * Math.cos(deg0 * RAD), 9.5 * Math.sin(deg0 * RAD)],
  [9.5 * Math.cos(deg1 * RAD), 9.5 * Math.sin(deg1 * RAD)], [6.8 * Math.cos(deg1 * RAD), 6.8 * Math.sin(deg1 * RAD)],
], z0, z1);
const g0 = (1.2 / R.parapet) / RAD; // rand van de schouders, graden vanaf de pijler
const step = (72 - 2 * g0) / 7;
const crenels = union([0, 2, 4, 6].flatMap((i) => [0, 72, 144, 216, 288].map((deg) => pieSlice(deg + g0 + i * step, deg + g0 + (i + 1) * step, H.crenel, H.merlon + 1))));
const parapet = parapetRing.subtract(crenels);
// Hoge kanteel (gebouwd boven de kolom op +X): pijler met piramidekap, twee schouders met een schuine bovenkant, stenen schild.
const pier = union([
  box(R.parapetIn - 0.1, -0.6, H.cornice[2] - 0.01, R.parapet, 0.6, H.pier),
  hull([
    [R.parapetIn - 0.1, -0.6, H.pier - 0.01], [R.parapet, -0.6, H.pier - 0.01], [R.parapetIn - 0.1, 0.6, H.pier - 0.01], [R.parapet, 0.6, H.pier - 0.01],
    [(R.parapetIn + R.parapet) / 2 - 0.05, 0, H.pierCap],
  ]),
  ...[-1, 1].map((s) => hull([
    [R.parapetIn - 0.05, s * 0.55, H.cornice[2]], [R.parapet, s * 0.55, H.cornice[2]], [R.parapetIn - 0.05, s * 1.2, H.cornice[2]], [R.parapet, s * 1.2, H.cornice[2]],
    [R.parapetIn - 0.05, s * 0.55, H.shoulder + 0.25], [R.parapet, s * 0.55, H.shoulder + 0.25],
    [R.parapetIn - 0.05, s * 1.2, H.shoulder], [R.parapet, s * 1.2, H.shoulder],
  ])),
  hull([
    [R.parapet - 0.1, -0.45, H.cornice[2] + 0.1], [R.parapet - 0.1, 0.45, H.cornice[2] + 0.1],
    [R.parapet + 0.25, -0.45, H.cornice[2] + 0.55], [R.parapet + 0.25, 0.45, H.cornice[2] + 0.55],
    [R.parapet + 0.25, -0.45, H.crenel - 0.1], [R.parapet + 0.25, 0.45, H.crenel - 0.1], [R.parapet + 0.25, 0, H.crenel + 0.25],
    [R.parapet - 0.1, -0.45, H.crenel - 0.1], [R.parapet - 0.1, 0.45, H.crenel - 0.1], [R.parapet - 0.1, 0, H.crenel + 0.25],
  ]),
]);
const piers = union([0, 72, 144, 216, 288].map((deg) => place(pier, { deg })));

// ---------- torentje op het dak ----------
// Vierkant van 3,2 m (luchtfoto: zijden op RD 45 en -45 graden, lokaal 61 en -29), muren tot 26,8 m, op elke hoek een
// pinakel van 0,9 m tot 27,6 m met een piramidekap tot 28,1 m (AHN +48,5 tot +49,6 NAP over het torentje, gemeten door
// de antennes heen); in elke zijde een blinde spitsboog.
const T = { half: 1.6, wall: 26.8, pin: 27.6, cap: 28.1, rot: 61 };
const turretBody = box(-T.half, -T.half, H.roof - 0.01, T.half, T.half, T.wall);
const pinnacle = (sx, sy) => {
  const x0 = sx > 0 ? T.half - 0.9 : -T.half, y0 = sy > 0 ? T.half - 0.9 : -T.half;
  return union([
    box(x0, y0, T.wall - 0.01, x0 + 0.9, y0 + 0.9, T.pin),
    hull([[x0, y0, T.pin - 0.01], [x0 + 0.9, y0, T.pin - 0.01], [x0, y0 + 0.9, T.pin - 0.01], [x0 + 0.9, y0 + 0.9, T.pin - 0.01], [x0 + 0.45, y0 + 0.45, T.cap]]),
  ]);
};
const turretNiches = union([0, 90, 180, 270].map((deg) => place(pointedNiche(T.half, 1.0, 24.4, 25.3, 0.25), { deg })));
const turret = place(
  union([turretBody, pinnacle(1, 1), pinnacle(1, -1), pinnacle(-1, 1), pinnacle(-1, -1)]).subtract(turretNiches),
  { deg: T.rot },
);

// ---------- ingang (travee met normaal -Y, index 7 op 18 + 36 x 7 = 270 graden) ----------
const DOOR = 7;
// Getoogde deur 1,7 m breed, drempel op 0,3 m, aanzet 3,4 m, top 4,25 m (met kalf en wapen in het boogveld); trap van
// 2,6 x 1,1 m voor de plint.
const doorNiche = archNiche(wallA, 1.7, 0.3, 3.4, 0.45);
const steps = union([
  box(wallA(0) + 0.1, -1.3, BASE, wallA(0) + 0.75, 1.3, 0.3),
  box(wallA(0) + 0.1, -1.3, BASE, wallA(0) + 1.2, 1.3, 0.12),
]);

// ---------- openingen ----------
const openings = union([
  // Onderste deel: in negen traveeën een groot getoogd venster (twee lichten en een oculus) als één nis van 2,0 m.
  ...bays(archNiche(wallA, 2.0, H.lowWin[0], H.lowWin[1], 0.35), [DOOR]),
  // Bovenste deel: in elke travee een smal hoog getoogd venster.
  ...bays(archNiche(wallA, 1.0, H.upWin[0], H.upWin[1], 0.35)),
  // Boogfries: twee boogjes per travee, tussen de kolom en de vensteras.
  ...bays(union([-1, 1].map((s) => archNiche(wallA, 1.0, H.frieze[0], H.frieze[1], 0.2, s * 1.08)))),
  // Reservoir: een getoogd venster tussen elk paar pilasters.
  ...n20(archNiche(() => R.body, 0.9, H.resWin[0], H.resWin[1], 0.35), 9),
  place(doorNiche, { deg: 18 + 36 * DOOR }),
]);

const building = union([
  union([
    shaft, plinth, lisenen, colBases, ledge, soffit, consoles,
    body, sill, ...n20(union([pilaster, capital])), cornice,
    parapet,
    place(steps, { deg: 18 + 36 * DOOR }),
  ]).subtract(union([openings, roofCut])),
  piers,
  turret,
]);

await writeLandmark({
  slug: "watertoren-overveen",
  base: BASE,
  nodes: [["building:tienzijdige-schacht-reservoir-kantelen-en-torentje", building]],
  catalog: {
    name: "Watertoren Overveen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9.5, 0], [-9.5, 0], [0, 9.5], [0, -9.5]],
    // Ellipsoïdisch: de PDOK-terreinhoogte op de duintop rond de voet.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0377100000011913"],
    description:
      "Oorsprong op het hart van het dak (AHN) op de duintop (NAP +22,05 m), +X op RD -16 graden, ingang naar -Y (RD -106 graden, zuid-zuidwest). Verjongende tienzijdige schacht met lisenen op de kolommen, gebosseerde plint, negen grote getoogde vensters en de ingang met trap, lijst, tien smalle vensters en een boogfries; twintig consoles onder een schuine onderkant dragen het uitkragende reservoir (straal 8,2 m) met lekdorpellijst, twintig pilasters met kapitelen, getoogde vensters en kroonlijst; borstwering met kantelen tot 24,5 m en vijf hoge kantelen tot 26,7 m; vierkant torentje met pinakels tot 28,1 m. Maten uit BAG, AHN, register en foto's.",
    realWorld: {
      registerHeightM: 26.7,
      wikipediaHeightM: 30.95,
      reservoirM3: 1200,
      reservoirTankDiameterM: 15,
      built: "1897-1898",
      architect: "J. Schotel",
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 45.6,
      ahnHighMerlonNapM: 48.3,
      shaftAcrossFacesM: [+(2 * wallA(0)).toFixed(2), +(2 * wallA(zTop)).toFixed(2)],
      reservoirDiameterM: 2 * R.body,
      corniceDiameterM: 2 * R.cornice,
      reservoirBottomM: H.soffit[1],
      corniceM: [H.cornice[1], H.cornice[2]],
      roofM: H.roof,
      merlonM: H.merlon,
      highMerlonM: H.pierCap,
      turretM: [T.wall, T.cap],
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/511099 (1897-1898, J. Schotel, 26,70 m, tien kolommen en traveeën, plint, vensters, lijsten, boogfries, twintig consoles, reservoir met twintig pilasters, kroonlijst, kantelen, torentje, Intze II 15,00 m)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Overveen)",
      "https://commons.wikimedia.org/wiki/File:Watertoren-511099.jpg (telelens: reservoir, borstwering, hoge kantelen, torentje, breedte van de schacht)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Overveen_-_20284847_-_RCE.jpg (van ver: geledingen van het reservoir)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_-_Haarlem_-_20099261_-_RCE.jpg, File:Watertoren_-_Haarlem_-_20099260_-_RCE.jpg, File:Exterieur_OVERZICHT_-_Overveen_-_20284900_-_RCE.jpg en File:Watertoren-overveen.jpg (schacht, ingang, consoles)",
      "PDOK BAG-pand 0377100000011913, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});

// Watertoren aan de Bredaseweg in Tilburg: 1897 voor de Tilburgsche Waterleiding Maatschappij, ontwerp H.P.N.
// Halbertsma, rijksmonument 521153. Een ronde bakstenen toren: een brede onderbouw met banden, een poort met een
// natuurstenen portiek (jaartal 1896-97) en hoge rondboogvensters, een fries en een schuine waterlijst; een licht
// taps toelopende schacht met twee rijen rondboogvensters en een rij vierkante vensters; een rondgaande
// consolelijst (boogfries op consoles) onder een kroonlijst; daarboven het ronde reservoir van 1000 m³ met
// gekoppelde rondboogvensters, een band, een rij vierkante venstertjes, een daklijst en een borstwering (na de
// oorlogsschade van 1944 vereenvoudigd herbouwd met een hekwerk in plaats van kantelen). Aan de oostkant hangt een
// rond traptorentje op een console met een koperen kegeldak.
//
// Oorsprong op het hart van de ronde BAG-contour (pand 0855100000293803, 167 m², straal 7,33 m) op maaiveld (AHN-DTM
// 9 tot 11 m uit het hart NAP +15,6 tot +16,0; aan de straatkant in het zuiden zakt het naar +15,0). +X is RD-oost.
// De posities rond de toren staan als azimut in graden linksom van oost: traptorentje op -10,5 (AHN-DSM en
// luchtfoto), de poort op -126 (zuidwest, naar de Bredaseweg), de vensters van onderbouw op stappen van 45 graden
// vanaf de poort, de vensterassen van schacht en reservoir op 228 + 60k (uit drie foto's, geschat).
//
// Hoogtes: het AHN-DSM ziet het platte dak op NAP +54,0 (38,1 m boven maaiveld) binnen 6,0 m uit het hart, de
// borstwering op +39,1 tot +39,3 m, het traptorentje tot +44 m (de kegeltop valt tussen de pixels) en een
// installatieblok op het dak tot +39,6 m. De geledingen (onderbouw, consolelijst, reservoir) uit de RCE-foto met
// evenwijdige verticalen (20343564, 27,7 px/m aan de silhouetrand), de stralen uit de BAG, de luchtfoto (dakrand
// 13,6 m, onderbouw 14,2 m) en dezelfde foto (onderbouw : reservoir : schacht = 194 : 173 : 158 px).
import { hull, ring3, circle, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [132912.67, 396410.06];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 15.9; // AHN-DTM 9 tot 11 m uit het hart
const GEOID_N = 43.87; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 72;
const TURRET_DEG = -10.5, TURRET_R = 7.0; // traptorentje: azimut en afstand van het hart (AHN-DSM en luchtfoto)

// Stralen.
const R = {
  plinth: 7.33, // BAG-contour
  base: 7.2, // onderbouw (luchtfoto 14,2 m)
  frieze: 7.32, // fries met band boven de onderbouw
  shaftFoot: 6.1,
  shaftTop: 5.95,
  gallery: 6.6, // boogfries op de consoles
  console: 6.62,
  cornice: 6.75, // kroonlijst onder het reservoir
  tank: 6.5, // reservoirwand (DSM: borstwering tot 6,5 m)
  tankBand: 6.62,
  roofCornice: 6.68, // daklijst
  parapet: 6.55,
  roofInner: 6.0, // binnenkant van de borstwering (DSM: plat dak tot 6,0 m)
};
const H = {
  plinth: 0.9,
  base: 6.9,
  frieze: 7.8,
  shaftFoot: 8.7, // bovenkant van de waterlijst
  consoleWall: 24.6, // onderkant van de consoles tegen de schacht
  consoleFoot: 25.6, // onderkant van de consoles aan de voorkant
  gallery: [26.9, 27.8],
  cornice: 29.1,
  tankBand: [36.0, 36.35],
  roofCornice: [37.9, 38.6],
  roof: 38.1, // AHN: NAP +54,0
  parapet: 39.3, // AHN: NAP +55,1 tot +55,3
};
const shaftR = (z) => R.shaftFoot + ((R.shaftTop - R.shaftFoot) * (z - H.shaftFoot)) / (H.consoleWall - H.shaftFoot);
const ring = (r, z, n = SEG) => ring3(circle([0, 0], r, n), z);
const cyl = (r, z0, z1, n = SEG) => hull([...ring(r, z0, n), ...ring(r, z1, n)]);

// ---------- onderbouw: plint, wand, fries en schuine waterlijst ----------
const base = union([
  hull([...ring(R.plinth, BASE), ...ring(R.plinth, H.plinth), ...ring(R.base, H.plinth + (R.plinth - R.base))]),
  cyl(R.base, BASE, H.base + 0.05),
  // Fries op een kraag van 45 graden, daarboven de waterlijst schuin naar de schacht.
  hull([...ring(R.base, H.base - (R.frieze - R.base)), ...ring(R.frieze, H.base), ...ring(R.frieze, H.frieze), ...ring(R.shaftFoot, H.shaftFoot)]),
]);

// ---------- schacht ----------
const shaft = hull([...ring(R.shaftFoot, H.frieze), ...ring(R.shaftFoot, H.shaftFoot), ...ring(R.shaftTop, H.consoleWall), ...ring(R.shaftTop, H.gallery[1] + 0.05)]);

// ---------- consolelijst: boogfries met schuine onderkant, twintig consoles en de kroonlijst ----------
const gallery = hull([...ring(R.shaftTop - 0.05, H.gallery[0] - (R.gallery - R.shaftTop + 0.05)), ...ring(R.gallery, H.gallery[0]), ...ring(R.gallery, H.gallery[1] + 0.05)]);
const CONSOLES = 20;
const consoleBlock = hull([
  [R.shaftTop - 0.1, -0.45, H.consoleWall], [R.shaftTop - 0.1, 0.45, H.consoleWall],
  [R.console, -0.45, H.consoleFoot], [R.console, 0.45, H.consoleFoot],
  [R.console, -0.45, H.gallery[1]], [R.console, 0.45, H.gallery[1]],
  [R.shaftTop - 0.1, -0.45, H.gallery[1]], [R.shaftTop - 0.1, 0.45, H.gallery[1]],
]);
// Eén console staat in de as van het traptorentje, zodat er tussen console en kelk geen holte ontstaat.
const consoles = Array.from({ length: CONSOLES }, (_, k) => place(consoleBlock, { deg: TURRET_DEG + (360 * k) / CONSOLES }));
const cornice = hull([...ring(R.gallery, H.gallery[1]), ...ring(R.cornice, H.gallery[1] + (R.cornice - R.gallery)), ...ring(R.cornice, H.cornice), ...ring(R.tank, H.cornice + (R.cornice - R.tank))]);

// ---------- reservoir, band, daklijst en borstwering om het platte dak ----------
const tank = cyl(R.tank, H.cornice - 0.05, H.roof);
const tankBand = hull([...ring(R.tank, H.tankBand[0] - (R.tankBand - R.tank)), ...ring(R.tankBand, H.tankBand[0]), ...ring(R.tankBand, H.tankBand[1])]);
const roofCornice = hull([...ring(R.tank, H.roofCornice[0] - (R.roofCornice - R.tank)), ...ring(R.roofCornice, H.roofCornice[0]), ...ring(R.roofCornice, H.roofCornice[1]), ...ring(R.parapet, H.roofCornice[1] + 0.1)]);
// Daklijst en borstwering samen uithollen tot het dak, anders vult de daklijst het dak tot 38,7 m.
const parapet = union([roofCornice, cyl(R.parapet, H.roofCornice[1], H.parapet)]).subtract(cyl(R.roofInner, H.roof, H.parapet + 1));
// Installatieblok op het dak (DSM tot +39,6 m, 2,6 × 1,0 m schuin op 53 graden).
const roofBox = place(box(-1.3, -0.5, H.roof - 0.1, 1.3, 0.5, 39.6), { at: [3.2, 2.7, 0], deg: 53 });

// ---------- traptorentje op een console aan de oostkant ----------

const T = { r: 1.1, cup: 1.4, cupFoot: 23.8, cupTop: 24.9, consoleFoot: 19.9, capFoot: 41.3, capTop: 42.8, capR: 1.4, apex: 45.3 };
const tring = (r, z, n = 32) => ring3(circle([TURRET_R, 0], r, n), z);
const turret = place(union([
  // Console: van een strook van 0,9 m tegen de schacht schuin (27 graden) naar de kelk onder het torentje.
  hull([[shaftR(T.consoleFoot) - 0.2, -0.45, T.consoleFoot], [shaftR(T.consoleFoot) - 0.2, 0.45, T.consoleFoot], [shaftR(T.consoleFoot) + 0.3, -0.45, T.consoleFoot], [shaftR(T.consoleFoot) + 0.3, 0.45, T.consoleFoot], ...tring(T.cup, T.cupFoot)]),
  hull([...tring(T.cup, T.cupFoot), ...tring(T.cup, T.cupTop), ...tring(T.r, T.cupTop + (T.cup - T.r))]),
  hull([...tring(T.r, T.cupTop), ...tring(T.r, T.capFoot - (T.capR - T.r) + 0.05)]),
  // Kraag onder de omgang, omgang en koperen kegel.
  hull([...tring(T.r, T.capFoot - (T.capR - T.r)), ...tring(T.capR, T.capFoot), ...tring(T.capR, T.capTop)]),
  hull([...tring(T.capR - 0.05, T.capTop - 0.05), [TURRET_R, 0, T.apex]]),
]), { deg: TURRET_DEG });

// ---------- poort met portiek en trap ----------
const DOOR_DEG = -126;
const arch = (w, z0, zs, n = 10) => [
  [-w / 2, z0], [w / 2, z0],
  ...Array.from({ length: n + 1 }, (_, i) => {
    const a = (Math.PI * i) / n;
    return [(w / 2) * Math.cos(a), zs + (w / 2) * Math.sin(a)];
  }),
];
// Natuurstenen boogomlijsting 0,15 m voor de wand, 3,4 m breed tot 6,0 m.
const doorFrame = place(hull(arch(3.4, BASE, 4.3).flatMap(([y, z]) => [[R.base - 0.3, y, z], [R.base + 0.15, y, z]])), { deg: DOOR_DEG });
// Portiek in de poortnis: 1,9 m breed, puntgevel tot 4,8 m, 0,1 m achter de wand.
const portico = place(hull([[-0.95, BASE], [0.95, BASE], [0.95, 4.0], [0, 4.8], [-0.95, 4.0]].flatMap(([y, z]) => [[R.base - 0.6, y, z], [R.base - 0.1, y, z]])), { deg: DOOR_DEG });
const stairs = [0.15, 0.3, 0.45].map((z, i) => place(box(R.base - 0.5, -1.5, BASE, R.base + 0.35 * (3 - i), 1.5, z), { deg: DOOR_DEG }));

// ---------- nissen: poort, vensters en deur ----------
// Nis in het vlak met normaal +X op afstand faceR; het plafond loopt naar binnen onder 56 graden op (1,5 maal de
// diepte), buiten de gevel zakt de omtrek met dezelfde helling. Omtrek als lijst (y, z).
const faceNiche = (faceR, outline, depth = 0.35) => {
  const zBot = Math.min(...outline.map(([, z]) => z));
  return hull(outline.flatMap(([y, z]) => [
    [faceR(z) - depth, y, z === zBot ? z : z + 1.5 * depth],
    [faceR(z), y, z],
    [faceR(z) + 1.0, y, z === zBot ? z : Math.max(zBot, z - 1.5)],
  ]));
};
const rectOutline = (w, z0, z1) => [[-w / 2, z0], [w / 2, z0], [w / 2, z1], [-w / 2, z1]];
const at = (r) => () => r;
const cuts = [];
// Poortnis 2,6 m breed tot 5,6 m, 0,45 m diep; deur 1,3 × 2,7 m in de portiek.
cuts.push(place(faceNiche(at(R.base + 0.15), arch(2.6, 0.45, 4.3), 0.6), { deg: DOOR_DEG }));
const doorCut = place(faceNiche(at(R.base - 0.1), rectOutline(1.3, 0.45, 3.15), 0.3), { deg: DOOR_DEG });
// Zeven rondboogvensters in de onderbouw, 1,6 m breed van 0,9 tot 5,1 m.
for (let k = 1; k < 8; k++) cuts.push(place(faceNiche(at(R.base), arch(1.6, 0.9, 4.3)), { deg: DOOR_DEG + 45 * k }));
// Vensterassen van schacht en reservoir; op 348 graden hangt het traptorentje.
const AXES = [228, 288, 348, 48, 108, 168];
for (const deg of AXES) {
  cuts.push(place(faceNiche(shaftR, arch(0.9, 10.2, 12.05)), { deg }));
  if (deg !== 348) {
    cuts.push(place(faceNiche(shaftR, arch(0.9, 18.2, 19.85)), { deg }));
    for (const y of [-0.6, 0.6]) cuts.push(place(faceNiche(at(R.tank), arch(0.85, 31.4, 33.8).map(([u, z]) => [u + y, z])), { deg }));
  }
  cuts.push(place(faceNiche(shaftR, rectOutline(0.9, 23.5, 24.3)), { deg: deg + 30 }));
}
// Rij vierkante venstertjes onder de daklijst.
for (let k = 0; k < 12; k++) {
  const deg = 18 + 30 * k;
  if (Math.abs(((deg - TURRET_DEG + 540) % 360) - 180) < 14) continue;
  cuts.push(place(faceNiche(at(R.tank), rectOutline(0.9, 36.55, 37.3), 0.3), { deg }));
}

// De portiek en de trap staan in en voor de poortnis; die komen er na het uitsnijden bij.
const tower = union([
  union([base, shaft, gallery, ...consoles, cornice, tank, tankBand, parapet, roofBox, turret, doorFrame]).subtract(union(cuts)),
  portico.subtract(doorCut),
  ...stairs,
]);

await writeLandmark({
  slug: "watertoren-tilburg",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:ronde-schacht-reservoir-en-traptorentje", tower]],
  catalog: {
    name: "Watertoren Tilburg",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Op het grasveld rond de toren; aan de straatkant in het zuiden ligt het maaiveld lager.
    groundSamplePoints: [[9.5, 0], [0, 9.5], [-9.5, 0], [6.7, -6.7]],
    // Ellipsoïdisch: NAP +15,90 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0855100000293803"],
    description:
      "Oorsprong op het hart van de ronde BAG-contour op maaiveld (NAP +15,90 m), +X is RD-oost. Ronde onderbouw van 14,4 m met plint, poort met natuurstenen omlijsting, portiek en trap op het zuidwesten, zeven rondboogvensters, fries en schuine waterlijst tot 8,7 m; licht tapse schacht van 12,2 tot 11,9 m met twee rijen rondboogvensters en vierkante vensters; consolelijst met twintig consoles en kroonlijst tot 29,1 m; rond reservoir van 13,0 m met gekoppelde rondboogvensters, band, venstertjes, daklijst en borstwering tot 39,3 m om een plat dak op 38,1 m; traptorentje op een console aan de oostkant met koperen kegel tot 45,3 m. Maten uit BAG, AHN, luchtfoto en foto's.",
    realWorld: {
      wikipediaHeightM: 50.5,
      reservoirM3: 1000,
      built: 1897,
      architect: "H.P.N. Halbertsma",
      rijksmonument: 521153,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 54.0,
      ahnParapetNapM: [55.0, 55.2],
      ahnTurretNapM: 60.0,
      geoidNlgeo2018M: GEOID_N,
      baseDiameterM: 2 * R.plinth,
      shaftDiameterM: [2 * R.shaftFoot, 2 * R.shaftTop],
      tankDiameterM: 2 * R.tank,
      corniceDiameterM: 2 * R.cornice,
      roofM: H.roof,
      parapetM: H.parapet,
      turretApexM: T.apex,
      consoles: CONSOLES,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Tilburg) (1897, H.P.N. Halbertsma, 50,50 m, 1000 m³, bovenbouw na 1944 vereenvoudigd met hekwerk)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/521153",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_met_dienstgebouw_-_Tilburg_-_20343564_-_RCE.jpg (evenwijdige verticalen: geledingen, stralen, posities van poort, vensters en traptorentje)",
      "https://commons.wikimedia.org/wiki/File:Tilburg_watertoren.jpg, File:Tilburg_-_Watertoren.jpg, File:Tilburg_-_Watertoren_(2).jpg, File:Watertoren,_detail_beeld_en_ingangspartij_-_Tilburg_-_20343567_-_RCE.jpg (consolelijst, gekoppelde vensters, traptorentje met console, poort met portiek en trap)",
      "PDOK BAG-pand 0855100000293803, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-03",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,87 m) voor groundHeight",
    ],
  },
});

// Watertoren Barendrecht (Torenstraat, achter de Dorpskerk), gebouwd in 1912 naar ontwerp van architect Roelof Kuipers in
// overgangsstijl met elementen uit de Italiaanse renaissance; 36 m hoog, reservoir van 120 m³ (Wikipedia), rijksmonument
// 520878, sinds 1981 buiten gebruik en nu trouwlocatie. De toren van Heerenveen was vrijwel gelijk.
// Opbouw (register en foto's van alle kanten): een vierkante schacht van donkere baksteen met witte betonnen hoekblokken; de
// witte onderbouw heeft aan drie zijden een driezijdige erker met een segmentboogvenster, met erboven een getoogd venster, en
// aan de zuidkant de symmetrische dubbele bordestrap met een deur eronder en de rondboogdeur op het bordes. Per gevel drie
// smalle vensters. Bovenaan op elke gevel een balkon op consoles van uitgemetselde baksteen, met een terugliggende
// rondboogdeur onder een fronton. Daarboven het witte reservoir: convex gewelfde gevels die samen een door de hoeken
// onderbroken cirkel vormen (een cilinder tussen vier hoekpijlers die als hoekaccenten boven de profielrand uitsteken), met
// een kegeldak (AHN). Aan de noordkant de ronde bakstenen filtertoren met een achtkant kegeldak en een plat tussenlid naar
// de schacht; aan de oostkant de later aangebouwde trouwzaal: een cirkelsegment met een lage gemetselde rand en een glazen
// plat dak (AHN, luchtfoto, BAG).
//
// Oorsprong op het hart van de schacht (AHN-DSM: dakrand van x 96198,4 tot 96203,55 en y 430311,85 tot 430317,3; BAG-erkers
// x 96197,13 tot 96204,59, dus hart x 96200,9). BAG-pand 0489100000194910 (bouwjaar 1912) omvat schacht, erkers, bordes,
// filtertoren en trouwzaal; zijn zijden lopen noord-zuid en oost-west, dus +X = oost, +Y = noord, de ingang ligt op -Y (zuid).
//
// Hoogtes: z = 0 ligt op NAP -0,59 (PDOK-terrein op de groundSamplePoints ellipsoïdisch 43,06 tot 43,23, PDOK min AHN-DTM
// 43,63 tot 43,67 hier; AHN-DTM rond de voet NAP -0,4 tot -0,8). AHN-DSM 0,5 m (2026-11-06): kroonlijst van het reservoir
// NAP +33,0 tot +33,2, top van het kegeldak NAP +35,8 (de cel met 37,3 is de antennemast), filtertoren rand NAP +10,2 en top
// +12,8, tussenlid +10,05, dak trouwzaal +3,2 tot +3,3 en rand +3,7 tot +4,1.
// Breedte van de schacht: de AHN-dakrand meet 5,2 tot 5,45 m, maar het AHN-raster verzacht de rand; de frontale foto
// "Overzicht watertoren - Barendrecht - 20341693 - RCE.jpg", geschaald op de kroonlijst uit het AHN, geeft 5,8 m voor de
// schacht en 7,25 m over de erkers (BAG 7,46 m), dus 5,8 m. Erkers, balkons, consoles, dakkapellen, pijlers, vensters,
// deuren en het bordes zijn geschat van die foto en van "Barendrecht, de Watertoren RM520878 IMG 0738 2022-03-28 10.43.jpg"
// en "Overzicht watertoren - Barendrecht - 20341694 - RCE.jpg".
//
// Printbaar op 1:1000 zonder steun: balkons op een onderkant van 45 graden met consoles van 48 graden, kroonlijst van het
// reservoir en filtertoren onder 45 graden, nissen met een plafond van 56 graden.
import { Manifold, hull, union, prism, place, box, circle, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [96200.9, 430314.6];
const AXIS = [1, 0];
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: west (-6, 0) 43,173,
// zuid (0, -6,5) 43,226, oost (13, 0) 43,232, noord (0, 11,5) 43,06.
const GROUND_ELLIPSOID = 43.06;
const GEOID = 43.65; // ellipsoïdisch min NAP hier (PDOK-terrein min AHN-DTM: 43,63 tot 43,67)
const NAP0 = +(GROUND_ELLIPSOID - GEOID).toFixed(2); // NAP-hoogte van z = 0: -0,59
const nap = (h) => +(h - NAP0).toFixed(2);

const rad = (deg) => (deg * Math.PI) / 180;
const T56 = Math.tan(rad(56));

// ---------- maten ----------
const S = 2.9; // halve schacht (5,8 m)
// Driezijdige erkers op oost, west en noord (BAG west: voorvlak 2,75 m, 0,85 m uit de schacht, zijden onder 45 graden),
// met balustrade tot 4,2 m (foto).
const ERKER = { front: 2.75, out: 0.85, top: 4.2 };
const H = {
  tankBottom: 27.0, // overgang baksteen naar het witte reservoir (foto)
  cornice: nap(33.15), // kroonlijst van het reservoir (AHN NAP +33,0 tot +33,2)
  pier: 34.5, // pinakels op de hoekpijlers (foto)
  apex: nap(35.8), // top van het kegeldak (AHN)
  balconyFoot: 24.4, // onderkant balkon tegen de gevel (foto)
  balconyTop: 27.3, // bovenkant balkonborstwering (foto)
  dormerEave: 29.0,
  dormerApex: 29.8, // top fronton dakkapel (foto; AHN-randcellen tot NAP +30)
  windows: [12.8, 17.5, 21.5], // harten van de smalle vensters (foto)
};
const BALCONY = { w: 3.5, out: 0.7 };
const PIER = 0.9; // hoekpijlers van het reservoir
const TURRET = { c: [-0.1, 7.8], r: 2.45, eave: nap(10.2), apex: nap(12.8) }; // filtertoren: BAG-boog en AHN
const LINK = { x0: -1.2, x1: 1.0, top: nap(10.05) }; // tussenlid schacht-filtertoren (AHN)
const HALL = { c: [1.4, 3.61], r: 10.34, roof: nap(3.25), rim: nap(3.9), wall: 0.9 }; // trouwzaal: cirkelfit op de BAG-boog
// BAG-contour van de trouwzaal in het lokale stelsel (de korte stompjes aan de uiteinden van de boog weggelaten); aan de
// westkant tot in de schacht en de filtertoren.
const HALL_POLY = [
  [0.5, -0.69], [6.8, -0.69], [8.58, -3.81], [10.2, -1.88], [11.24, 0.42], [11.73, 3.23], [11.44, 6.07], [10.38, 8.72],
  [8.65, 10.98], [6.88, 7.88], [0.5, 7.8],
];
const PODIUM = { hx: 3.25, front: -4.53, back: -2.8, edge: 1.0, landing: 3.2, landingHx: 1.1, rail: 4.0, railDepth: 0.9 };

// Nis in een gevel met normaal +X op afstand f, van z0 tot z1, `depth` diep, plafond naar binnen onder 56 graden.
const niche = (f, yc, w, z0, z1, depth = 0.3) => {
  const za = z1 + depth * T56, a = f - depth, b = f + 0.3;
  return hull([[a, yc - w / 2, z0], [b, yc - w / 2, z0], [a, yc + w / 2, z0], [b, yc + w / 2, z0], [a, yc - w / 2, za], [a, yc + w / 2, za], [f, yc - w / 2, z1], [f, yc + w / 2, z1], [b, yc - w / 2, z1 - 0.3 * T56], [b, yc + w / 2, z1 - 0.3 * T56]]);
};

// ---------- schacht, erkers, reservoir en dak ----------
// Erker voor de gevel +X: voorvlak ERKER.front breed, zijden onder 45 graden naar de schacht; segmentboogvenster als nis en
// een getoogd venster in de schacht erboven (de oosterker zit in de trouwzaal: daar alleen het venster erboven).
const erker = () => {
  const a = ERKER.front / 2, b = a + ERKER.out;
  return prism([[S - 0.05, -b], [S + ERKER.out, -a], [S + ERKER.out, a], [S - 0.05, b]], BASE, ERKER.top);
};
const erkerCuts = () => [niche(S + ERKER.out, 0, 1.0, 1.2, 2.5, 0.3), niche(S, 0, 0.8, 5.0, 6.4, 0.3)];
const erkers = [0, 90, 180].map((deg) => place(erker(), { deg }));
const shaft = box(-S, -S, BASE, S, S, H.tankBottom + 0.01);
const tank = prism(circle([0, 0], S, 64), H.tankBottom - 0.01, H.cornice - 0.2);
// Kroonlijst: 0,15 m uit de cilinder, onderkant van 45 graden.
const cornice = hull([
  ...circle([0, 0], S, 64).map(([x, y]) => [x, y, H.cornice - 0.35]),
  ...circle([0, 0], S + 0.15, 64).map(([x, y]) => [x, y, H.cornice - 0.2]),
  ...circle([0, 0], S + 0.15, 64).map(([x, y]) => [x, y, H.cornice]),
]);
const roof = hull([...circle([0, 0], S + 0.15, 64).map(([x, y]) => [x, y, H.cornice - 0.01]), [0, 0, H.apex]]);
const piers = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([sx, sy]) => {
  const xs = [sx * S, sx * (S - PIER)].sort((a, b) => a - b), ys = [sy * S, sy * (S - PIER)].sort((a, b) => a - b);
  return box(xs[0], ys[0], H.tankBottom - 0.01, xs[1], ys[1], H.pier);
});

// ---------- per gevel: balkon met consoles, dakkapel, vensters (getekend voor de gevel +X, rond gedraaid) ----------
const faceParts = () => {
  const { w, out } = BALCONY;
  const balcony = hull([
    [S - 0.05, -w / 2, H.balconyFoot - 0.05], [S - 0.05, w / 2, H.balconyFoot - 0.05],
    [S + out, -w / 2, H.balconyFoot + out], [S + out, w / 2, H.balconyFoot + out],
    [S + out, -w / 2, H.balconyTop], [S + out, w / 2, H.balconyTop], [S - 0.05, -w / 2, H.balconyTop], [S - 0.05, w / 2, H.balconyTop],
  ]);
  // Getrapte consoles onder het balkon als wiggen van 0,45 m breed, onderkant van 48 graden.
  const consoles = [-1.4, -0.5, 0.5, 1.4].map((y) => hull([
    [S - 0.05, y - 0.225, H.balconyFoot - 1.4], [S - 0.05, y + 0.225, H.balconyFoot - 1.4],
    [S + 0.45, y - 0.225, H.balconyFoot - 0.85], [S + 0.45, y + 0.225, H.balconyFoot - 0.85],
    [S + 0.45, y - 0.225, H.balconyFoot + 0.5], [S + 0.45, y + 0.225, H.balconyFoot + 0.5],
    [S - 0.05, y - 0.225, H.balconyFoot + 0.5], [S - 0.05, y + 0.225, H.balconyFoot + 0.5],
  ]));
  // Dakkapel op het balkon: 1,6 m breed, tot 0,5 m voor de gevel, fronton tot 29,8 m.
  const dormer = hull([
    [S - 0.6, -0.8, H.balconyTop - 0.5], [S - 0.6, 0.8, H.balconyTop - 0.5], [S + 0.5, -0.8, H.balconyTop - 0.5], [S + 0.5, 0.8, H.balconyTop - 0.5],
    [S - 0.6, -0.8, H.dormerEave], [S - 0.6, 0.8, H.dormerEave], [S + 0.5, -0.8, H.dormerEave], [S + 0.5, 0.8, H.dormerEave],
    [S - 0.6, 0, H.dormerApex], [S + 0.5, 0, H.dormerApex],
  ]);
  const cuts = [
    niche(S + 0.5, 0, 0.7, H.balconyTop + 0.15, H.dormerEave - 0.6, 0.3), // rondboogopening dakkapel
    ...H.windows.map((z) => niche(S, 0, 0.5, z - 0.8, z + 0.6, 0.3)), // smalle vensters
  ];
  return { adds: [balcony, ...consoles, dormer], cuts };
};
const adds = [], cuts = [];
for (const deg of [0, 90, 180, 270]) {
  const p = faceParts();
  adds.push(...p.adds.map((m) => place(m, { deg })));
  cuts.push(...p.cuts.map((m) => place(m, { deg })));
}

// ---------- ingang: bordes met twee trappen (zuid, -Y) ----------
const P = PODIUM;
const podium = hull([P.front, P.back].flatMap((y) => [
  [-P.hx, y, BASE], [P.hx, y, BASE], [P.hx, y, P.edge], [P.landingHx, y, P.landing], [-P.landingHx, y, P.landing], [-P.hx, y, P.edge],
]));
const rail = box(-P.landingHx, P.front, P.landing - 0.1, P.landingHx, P.front + P.railDepth, P.rail);
const doorBelow = place(niche(-P.front, 0, 1.0, BASE, 2.0, 0.4), { deg: 270 }); // deur onder het bordes
const doorUpper = place(niche(S, 0, 1.2, P.landing, 5.4, 0.4), { deg: 270 }); // deur op het bordes in de schacht

// ---------- filtertoren met tussenlid (noord) ----------
const link = box(LINK.x0, S - 0.05, BASE, LINK.x1, TURRET.c[1], LINK.top);
const turret = prism(circle(TURRET.c, TURRET.r, 48), BASE, TURRET.eave - 0.14);
const turretCornice = hull([
  ...circle(TURRET.c, TURRET.r, 48).map(([x, y]) => [x, y, TURRET.eave - 0.15]),
  ...circle(TURRET.c, TURRET.r + 0.15, 48).map(([x, y]) => [x, y, TURRET.eave]),
]);
// Achtkant kegeldak (register), binnen de ronde kroonlijst.
const turretRoof = hull([...circle(TURRET.c, TURRET.r + 0.15, 8, Math.PI / 8).map(([x, y]) => [x, y, TURRET.eave - 0.01]), [...TURRET.c, TURRET.apex]]);
const turretWindows = [60, 120, 180].flatMap((deg) => [[3.4, 4.6], [6.6, 7.8]].map(([z0, z1]) =>
  place(niche(TURRET.r, 0, 0.5, z0, z1, 0.3), { deg, at: [...TURRET.c, 0] })));

// ---------- trouwzaal (oost) ----------
const hallBody = prism(HALL_POLY, BASE, HALL.roof);
const hallRim = prism(HALL_POLY, HALL.roof - 0.05, HALL.rim).subtract(prism(circle(HALL.c, HALL.r - HALL.wall, 96), HALL.roof - 0.1, HALL.rim + 0.1));
const hallWindows = [-32, -16, 0, 16, 32].map((deg) => place(niche(HALL.r, 0, 0.6, 2.0, 2.6, 0.3), { deg, at: [...HALL.c, 0] }));

const solid = union([
  ...erkers, shaft, tank, cornice, roof, ...piers, ...adds, podium, rail, link, turret, turretCornice, turretRoof, hallBody, hallRim,
]).subtract(union([...cuts, ...erkerCuts().map((m) => place(m, { deg: 180 })), place(erkerCuts()[1], { deg: 0 }), doorBelow, doorUpper, ...turretWindows, ...hallWindows]));

await writeLandmark({
  slug: "watertoren-barendrecht",
  base: BASE,
  nodes: [["building:watertoren-erkers-schacht-balkons-reservoir-dak-filtertoren-en-trouwzaal", solid]],
  catalog: {
    name: "Watertoren Barendrecht",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-6, 0], [0, -6.5], [13, 0], [0, 11.5]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0489100000194910"],
    description:
      "Oorsprong op het hart van de schacht op het maaiveld (NAP circa -0,6 m), +X oost, ingang met bordes op -Y (zuid). Vierkante bakstenen schacht van 5,8 m met witte onderbouw, drie erkers en een dubbele bordestrap, per gevel drie vensters en een balkon op consoles met een dakkapel; wit cilindrisch reservoir tussen vier hoekpijlers tot de kroonlijst op 33,74 m (AHN) met een kegeldak tot 36,39 m (AHN); ronde filtertoren met achtkant kegeldak op het noorden en de trouwzaal als cirkelsegment op het oosten (BAG, AHN). Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1912,
      architect: "Roelof Kuipers",
      rijksmonument: 520878,
      publishedHeightM: 36,
      reservoirM3: 120,
      groundNapM: NAP0,
      ahnCorniceNapM: 33.15,
      ahnRoofApexNapM: 35.8,
      shaftM: 2 * S,
      erkerM: [ERKER.front, ERKER.out, ERKER.top],
      tankM: [H.tankBottom, H.cornice],
      pierTopM: H.pier,
      roofApexM: H.apex,
      balconyM: [BALCONY.w, BALCONY.out, H.balconyFoot, H.balconyTop],
      dormerApexM: H.dormerApex,
      turretM: { radius: TURRET.r, eave: TURRET.eave, apex: TURRET.apex },
      weddingHallM: { radius: HALL.r, roof: HALL.roof, rim: HALL.rim },
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Barendrecht) (1912, Roelof Kuipers, overgangsstijl met Italiaanse renaissance, 36 m, 120 m³, trouwzaal later aangebouwd, buiten gebruik sinds 1981)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/520878 (36 m, betonskelet met baksteen; onderbouw met driezijdige erkers op drie zijden en dubbele bordestrap; hoeken van betonblokken; smalle vensters; vier balkons op consoles met rondboogdeuren onder een fronton; reservoirgeleding met convex gewelfde gevels die een door de hoeken onderbroken cirkel vormen; profielrand met hoger opgaande hoekaccenten; ronde filtertoren met achtkant kegeldak en plat tussenlid)",
      "https://commons.wikimedia.org/wiki/Category:Watertower,_Barendrecht (Overzicht watertoren - Barendrecht - 20341692/20341693/20341694 - RCE.jpg, Barendrecht, de Watertoren RM520878 IMG 0738 2022-03-28 10.43.jpg, 2008-06-29 17.16 Barendrecht, de watertoren.JPG)",
      "PDOK BAG-pand 0489100000194910, AHN DSM/DTM 0,5 m, luchtfoto Actueel_orthoHR en PDOK-terrein, 2026-11-06",
    ],
  },
});

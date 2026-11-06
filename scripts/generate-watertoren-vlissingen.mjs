// Watertoren van Vlissingen aan de Badhuisstraat 187, op de hoek met de Coosje Buskenstraat. Gebouwd in 1894 voor de
// N.V. Vlissingsche Duinwaterleiding in neorenaissancestijl; 35 m hoog, reservoir van 300 m³ (ijzeren Intze-bak),
// rijksmonument 508765. Nu een woning (de begane grond en eerste verdieping waren al dienstwoning). Een conische ronde
// schacht van roodbruine baksteen op een gerustikeerde plint van grijszwarte steen, met natuurstenen banden; een
// natuurstenen ingangspartij met pilasters, fronton en obelisk; vensters onder rondbogen op de begane grond, rechthoekige
// vensters op de eerste verdieping, een overkragende rollaag, een rij gekoppelde halfronde vensters en een boogfries.
// Daarboven kraagt op gietijzeren consoles een achtkante reservoirommanteling uit, met per zijde twee verdiepte
// rondboogvelden met een rechthoekig venster, een boogfries en een kroonlijst. Achtkante leien spits met vier
// chaletachtige dakkapellen, een open achtkante lantaarn en een zinken uikoepel met windvaan.
//
// Oorsprong op het hart van BAG-pand 0718100000001780 (18-hoek, straal 5,36 m; de top in het AHN-DSM ligt erop) op het
// maaiveld: AHN-DTM NAP +1,15 (ring van 6 tot 9 m). Lokale X-as = RD-oost, Y = RD-noord; hoeken hieronder in graden
// linksom vanaf oost. De achthoek heeft zijn hoeken op 0, 45, 90 ... graden (luchtfoto Actueel_orthoHR en de best
// passende achthoek op het AHN-DSM van het dak), de zijden dus op 22,5 + 45k. De ingang staat midden onder de zijde op
// 112,5 graden (noordnoordwest, naar de kruising; foto "Watertoren Vlissingen.JPG"), de dakkapellen op die zijde en elke
// tweede zijde verder.
// Maten: de kroonlijst (NAP +25,7, buitenkant op 6,1 tot 6,35 m in het zuiden), het dakvlak (AHN-DSM: z = 33,12 - 1,6 d
// NAP, d = afstand tot het hart loodrecht op de zijde, 58 graden) en de top van de uikoepel (NAP +35,99) uit het AHN; in
// het noorden en oosten mist het DSM de rand van de ommanteling (alleen gevelpunten), de toren is daar gespiegeld. De
// breedtes van ommanteling, lantaarn en koepel en de hoogtes boven de rollaag uit de telelensfoto "Watertoren,
// Badhuisstraat 187, Vlissingen.jpg" (39,4 px/m op de kroonlijst van 11,46 m breed), de hoogtes eronder uit de frontale
// foto "Watertoren Vlissingen.JPG" (43 px/m tussen maaiveld en de halfronde vensters).
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [28410.05, 385837.09];
const AXIS = [1, 0];
const GROUND_NAP = 1.15;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 45,539, west 45,501, zuid 45,580,
// noordoost 45,512), gemeten 2026-11-06. Voor de ingang (noordnoordwest, 7,5 m) ligt het terrein lager (45,31): daar
// staan de treden, die 0,2 m in het terrein doorlopen. Het PDOK-pand staat op 45,14.
const GROUND_ELLIPSOID = 45.5;

const rad = (deg) => (deg * Math.PI) / 180;
const C8 = Math.cos(rad(22.5));
// Omwenteling van een gesloten profiel [[r, z], ...]; `n` = 8 geeft een achthoek met hoeken op 0, 45, ... graden.
const rev = (pts, n = SEG) => Manifold.revolve(new CrossSection([ccw(pts)]), n);
const solidRev = (profile, n = SEG) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]], n);
// Achtkant massief onder een profiel [[d, z], ...] met d de afstand tot een zijde (apothema).
const octRev = (profile) => solidRev(profile.map(([d, z]) => [d / C8, z]), 8);
// Ronde schijf tot r1 tussen z0 en z1, met een onderkant van 50 graden vanaf straal rIn.
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);

// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar
// binnen onder 56 graden op, buiten de gevel loopt de snede schuin af.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Rondboognis: als niche met een halfrond (7 punten) vanaf zSpring; het boogplafond loopt naar binnen onder 63 graden op.
// Buiten de gevel loopt de snede tot `out` voor de gevel onder 56 graden af (niet onder z0); bij een lage aanzet houdt
// een kleine `out` het plafond bij de aanzet steiler dan 45 graden.
const archNiche = (f, w, z0, zSpring, depth = 0.3, y = 0, out = 1) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([v, z]) => [a, v, z + 2 * depth]),
    ...arc.map(([v, z]) => [f, v, z]),
    ...arc.map(([v, z]) => [f + out, v, Math.max(z0, z - 1.5 * out)]),
    [a, -r, z0], [a, r, z0], [f + out, -r, z0], [f + out, r, z0],
  ]).translate([0, y, 0]);
};

// ---------- hoogtes boven het maaiveld (NAP +1,15) ----------
const H = {
  plinth: 1.4, // grijszwarte plint
  band1: [5.85, 6.1], // natuurstenen band boven de begane grond
  band2: [9.9, 10.1], // band boven de vensters van de eerste verdieping
  corbel: [12.1, 12.5], // overkragende rollaag
  band3: [14.0, 14.15], // band onder de halfronde vensters
  soffit: 15.1, // voet van de schuine onderkant van de ommanteling (50 graden tot 17,27 m)
  casing: 17.27, // onderkant van de achtkante ommanteling (telelensfoto)
  corniceFoot: 24.0, // voet van de kroonlijst
  eaves: 24.55, // bovenkant van de kroonlijst (AHN NAP +25,7)
  lanternBase: 29.79, // dakvlak op d = 1,36 (AHN-dakvlak en foto)
  lantern: [30.6, 32.1],
  collar: 32.75,
  top: 34.84, // top van de uikoepel (AHN NAP +35,99)
  finial: 35.6, // makelaar (windvaan zelf weggelaten)
};
// Stralen (rond) en apothema's (achtkant, d).
const R = {
  plinth: 5.36, // BAG
  shaftFoot: 5.2,
  shaftTop: 3.95, // onder de consoles (telelensfoto: 4,0 op 14,5 m)
  band: 0.12,
  corbel: 0.25,
};
const D = {
  soffit: 3.55, // achthoek binnen de schacht (hoeken op 3,84 m, de schacht is daar 3,95 m)
  casing: 5.37, // gevel van de ommanteling (telelensfoto 423 px)
  cornice: 5.73, // kroonlijst (foto 452 px; AHN: buitenkant op 6,1 tot 6,35 m in de hoeken)
  roofFoot: 4.64, // dakvlak op de kroonlijst: (33,12 - 25,7) / 1,6
  lanternBase: 1.36,
  lantern: 1.05,
  collar: 1.45,
};
const shaftR = (z) => R.shaftFoot + ((R.shaftTop - R.shaftFoot) * (z - H.plinth)) / (H.soffit - H.plinth);
const roofZ = (d) => H.eaves + 1.6 * (D.roofFoot - d); // AHN-dakvlak, 58 graden
const ENTRY = 112.5;
const FACES = every(8, 22.5);

// ---------- plint, schacht en banden ----------
const plinth = rev([[0, BASE], [R.plinth, BASE], [R.plinth, H.plinth - 0.16], [R.shaftFoot, H.plinth], [0, H.plinth]]);
// De schacht loopt door tot hij in de schuine onderkant van de ommanteling verdwijnt (op de zijden op 15,58 m).
const shaft = solidRev([[R.shaftFoot, H.plinth - 0.01], [shaftR(15.65), 15.65]]);
const bands = union([
  ledge(shaftR(H.band1[0]), shaftR(H.band1[0]) + R.band, ...H.band1),
  ledge(shaftR(H.band2[0]), shaftR(H.band2[0]) + R.band, ...H.band2),
  ledge(shaftR(H.corbel[0]), shaftR(H.corbel[0]) + R.corbel, ...H.corbel),
  ledge(shaftR(H.band3[0]), shaftR(H.band3[0]) + R.band, ...H.band3),
]);

// ---------- vensters van de schacht (blinde nissen van 0,9 m) ----------
const shaftOpenings = union([
  // begane grond: rondboogvensters (1,6 tot 4,3 m) naast en tegenover de ingang
  ...around(archNiche(shaftR(3), 0.9, 1.6, 3.85), [ENTRY + 50, ENTRY - 50, ENTRY + 130, ENTRY - 130, ENTRY + 180]),
  // eerste verdieping: acht rechthoekige vensters (6,7 tot 9,5 m), boven de ingang en elke 45 graden verder
  ...around(niche(shaftR(8.1), 1.0, 6.7, 9.5), every(8, ENTRY)),
  // halfronde vensters onder de consoles: acht paren (14,2 tot 14,8 m); de gevel ligt 0,95 m naast de as verder terug
  ...every(8, ENTRY).flatMap((deg) => [-0.95, 0.95].map((y) => place(archNiche(Math.sqrt(shaftR(14.5) ** 2 - y * y), 0.9, 14.2, 14.35, 0.3, y, 0.3), { deg }))),
]);

// ---------- ingangspartij (naar 112,5 graden) ----------
// Natuurstenen portiek van 3,9 m breed, 0,75 m voor de schacht, met hoofdgestel tot 6,0 m en een fronton tot 7,0 m; de
// deur als rondboognis van 1,8 m (0,7 tot 4,6 m). Twee treden ervoor.
const PORTAL = { half: 1.95, face: 5.95, top: 6.0, apex: 7.0 };
const portalBody = hull([
  [4.6, -PORTAL.half, BASE], [PORTAL.face, -PORTAL.half, BASE], [4.6, PORTAL.half, BASE], [PORTAL.face, PORTAL.half, BASE],
  [4.6, -PORTAL.half, PORTAL.top], [PORTAL.face, -PORTAL.half, PORTAL.top], [4.6, PORTAL.half, PORTAL.top], [PORTAL.face, PORTAL.half, PORTAL.top],
  [4.6, 0, PORTAL.apex], [PORTAL.face, 0, PORTAL.apex],
]);
const steps = union([
  box(4.8, -2.6, BASE, 6.95, 2.6, 0.3),
  box(4.8, -2.3, BASE, 6.45, 2.3, 0.6),
]);
const door = archNiche(PORTAL.face, 1.8, 0.6, 3.7, 0.5);
// De Ionische pilasters, het fries en de obelisk zijn te fijn (onder 0,9 m) en weggelaten.
const portal = place(union([portalBody, steps]).subtract(door), { deg: ENTRY });

// ---------- consoles en ommanteling ----------
// Schuine achtkante onderkant van 50 graden (zijden) van de schacht tot de ommanteling; zestien consoles van 0,9 m
// breed op de hoeken en de zijden als ribben eronder, met een onderkant van 46 graden die net boven de halfronde
// vensters begint (zo snijden de vensternissen niet in de consoles) en een kop van 0,7 m onder de ommanteling.
const soffit = octRev([[D.soffit, H.soffit], [D.casing, H.casing], [D.casing, H.casing + 0.05]]);
const consoleOne = hull([
  [3.9, -0.45, 15.1], [3.9, 0.45, 15.1],
  [3.6, -0.45, H.casing], [3.6, 0.45, H.casing],
  [5.3, -0.45, 16.55], [5.3, 0.45, 16.55], [5.3, -0.45, H.casing], [5.3, 0.45, H.casing],
]);
const consoles = union(around(consoleOne, every(16, ENTRY)));
// Ommanteling met kroonlijst (onderkant 50 graden).
const corniceUnder = H.corniceFoot - 1.2 * (D.cornice - D.casing);
const casing = octRev([[D.casing, H.casing], [D.casing, corniceUnder], [D.cornice, H.corniceFoot], [D.cornice, H.eaves]]);
// Per zijde twee verdiepte rondboogvelden (1,3 m breed, 0,25 m diep, 19,0 m tot de kruin op 23,0 m) met een venster
// van 0,9 m (19,7 tot 21,7 m); daaronder een fries van verdiepte veldjes (18,4 tot 18,9 m).
const casingOpenings = union(FACES.flatMap((deg) => [-1.0, 1.0].flatMap((y) => [
  place(archNiche(D.casing, 1.3, 19.0, 22.35, 0.25, y), { deg }),
  place(niche(D.casing - 0.25, 0.9, 19.7, 21.7, 0.3, y), { deg }),
  place(niche(D.casing, 1.3, 18.4, 18.9, 0.2, y), { deg }),
])));
const reservoir = union([soffit, consoles, casing.subtract(casingOpenings)]);

// ---------- dak, dakkapellen, lantaarn en uikoepel ----------
const roof = octRev([[D.cornice - 0.05, H.eaves - 0.3], [D.roofFoot, H.eaves - 0.01], [D.roofFoot, H.eaves], [D.lanternBase, H.lanternBase]]);
// Dakkapel (voorgevel naar +X): topgevel van 1,2 m breed op d = 3,7 m, goot 27,2, top 27,9 m, met een zadeldakje dat
// in het dakvlak verdwijnt. Het venster (0,4 m) is te klein.
const DORMER = { face: 3.7, half: 0.6, eaves: 27.2, top: 27.9 };
const dormer = hull([
  ...[2.6, DORMER.face].flatMap((x) => [
    [x, -DORMER.half, roofZ(DORMER.face) - 0.3], [x, DORMER.half, roofZ(DORMER.face) - 0.3],
    [x, -DORMER.half, DORMER.eaves], [x, DORMER.half, DORMER.eaves], [x, 0, DORMER.top],
  ]),
]);
const dormers = union(around(dormer, [ENTRY, ENTRY + 90, ENTRY + 180, ENTRY + 270]));
const lanternBase = octRev([[D.lanternBase, H.lanternBase - 1], [D.lanternBase, H.lantern[0]]]);
const lantern = octRev([[D.lantern, H.lantern[0] - 0.01], [D.lantern, H.lantern[1]]]);
const collar = octRev([[D.lantern, H.lantern[1] - 1.2 * (D.collar - D.lantern)], [D.collar, H.lantern[1]], [D.collar, H.collar], [0.5, H.collar + 0.01]]);
// Uikoepel: hals 1,1, buik 1,3 op 33,45 m, punt naar de knop op 34,84 m (foto en AHN), achtkant zoals de lantaarn.
const onion = octRev([[1.15, H.collar - 0.01], [1.3, 33.2], [1.3, 33.55], [1.0, 34.05], [0.65, 34.45], [0.46, H.top]]);
const finial = solidRev([[0.45, H.top - 0.05], [0.2, H.finial]], 16);
const top = union([roof, dormers, lanternBase, lantern, collar, onion, finial]);

const tower = union([plinth, union([shaft, bands]).subtract(shaftOpenings), portal, reservoir, top]);

await writeLandmark({
  slug: "watertoren-vlissingen",
  base: BASE,
  nodes: [["building:watertoren-schacht-ingang-ommanteling-dak-en-lantaarn", tower]],
  catalog: {
    name: "Watertoren Vlissingen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [0, -7.5], [5.3, 5.3]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0718100000001780"],
    description:
      "Oorsprong op het hart van het ronde BAG-pand op het maaiveld (NAP +1,15 m), X-as naar RD-oost; de achthoek heeft zijn hoeken op 0, 45, ... graden en de ingang onder de zijde op 112,5 graden (noordnoordwest). Plint, conische schacht (straal 5,2 tot 3,95 m) met banden, rondboogvensters, vensters, overkragende rollaag en acht paren halfronde vensters; natuurstenen ingangspartij met fronton en treden; zestien consoles onder een schuine onderkant; achtkante ommanteling (apothema 5,37 m) van 17,27 tot 24,55 m met twee rondboogvelden en vensters per zijde en een kroonlijst; leien spits van 58 graden met vier dakkapellen, lantaarnvoetstuk, lantaarn, kraag en uikoepel tot 34,84 m, makelaar tot 35,6 m. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1894,
      client: "N.V. Vlissingsche Duinwaterleiding",
      rijksmonument: 508765,
      publishedHeightM: 35,
      reservoirM3: 300,
      ahnGroundNapM: GROUND_NAP,
      ahnEavesNapM: 25.7,
      ahnRoofPlaneNap: "33,12 - 1,6 d",
      ahnTopNapM: 35.99,
      plinthRadiusM: R.plinth,
      shaftRadiusM: [R.shaftFoot, R.shaftTop],
      casingApothemM: D.casing,
      corniceApothemM: D.cornice,
      casingM: [H.casing, H.eaves],
      roofDegrees: 58,
      lanternBaseM: H.lanternBase,
      topM: H.top,
      finialM: H.finial,
      entranceDegrees: ENTRY,
      octagonVertexDegrees: [0, 45, 90, 135, 180, 225, 270, 315],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Vlissingen) (1894, N.V. Vlissingsche Duinwaterleiding, neorenaissance, 35 m, 300 m³, Badhuisstraat 187)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/508765 (conische schacht, uitkragende achtkante reservoirommanteling op gietijzeren consoles, gerustikeerde plint, vensters onder rondbogen, rij halfronde vensters, boogfries, verdiepte rondboogvelden met vensters, kroonlijst, achtkante leien spits met chaletachtige dakkapellen, open achtkante lantaarn, zinken uivormige helm; natuurstenen ingangspartij met Ionische pilasters, fronton en obelisk)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_Vlissingen (Watertoren Vlissingen.JPG, Watertoren, Badhuisstraat 187, Vlissingen.jpg, Vlissingen Watertoren 2010.JPG, Vlissingen, de watertoren RM508765 foto6 2015-09-29 14.22.jpg, Vlissingen-Badhuisstraat 187-watertoren-ro3162 tot ro3179.jpg)",
      "PDOK BAG-pand 0718100000001780, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

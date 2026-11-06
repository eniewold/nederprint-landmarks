// Watertoren Krimpen aan de Lek (Krimpenerwaard, Zuid-Holland), gebouwd in 1909-1910 naar een ontwerp van Visser & Smit uit
// Papendrecht; volgens Wikipedia en het register 47,2 m hoog met een ijzeren reservoir van 250 m³, rijksmonument 512470 (deel
// van complex 512469, de dienstgebouwen van het waterleidingbedrijf aan de Lekdijk). Volgens het register een toren in
// rode baksteen in traditioneel-ambachtelijke stijl met neorenaissancemotieven: een met steunberen verstevigde onderbouw met
// een trasraam onder een gepleisterde waterlijst en een gepleisterde sierband bovenaan, de vernieuwde entree in de noordzijde
// (met een gedenksteen erboven), een conische schacht geleed door iets uitkragende gepleisterde sierbanden met staande
// vensters onder rondbogen, een uitgemetseld rondboogfries onder het iets uitkragende reservoir met lange staande vensters,
// en een opengewerkte bakstenen borstwering met kantelen rond een plat dak.
//
// BAG-pand 0643100002039539 (bouwjaar 1909, 74,9 m²) is de toren: een cirkel met straal 4,68 m (kleinste-kwadratenfit op de
// 57 hoekpunten van de schacht) met acht steunberen van 1,0 m breed die tot r 5,47 reiken, op RD 13,5 + k·45 graden.
// Oorsprong op het hart van die cirkel [103622.71, 434374.19]; +X op RD 13,5 graden, zodat de steunberen op 0, 45, ... 315
// graden in het modelstelsel staan. De ingang ligt tussen de steunberen het dichtst bij het noorden (model 67,5 graden, RD 81).
//
// De toren staat buitendijks naast de Lekdijk (kruin NAP +4,6, 20 tot 30 m ten noorden en westen) op een terrein dat van
// NAP +3,6 aan de noordkant naar +2,75 aan de zuidkant (rivierzijde) afloopt (AHN-DTM). Zoals bij een toren in een talud ligt
// z = 0 op het laagste maaiveld rond de voet; het hogere terrein aan de noordkant laat het model aan het PDOK-terrein over.
// PDOK-terrein (ellipsoïdisch) op de groundSamplePoints (r 6 m, tussen de steunberen), gemeten 2026-11-06: 47,217, 47,164,
// 47,206, 46,881, 46,418, 46,556, 46,554, 46,692; het verschil met het AHN-DTM is 43,55 tot 43,76, dus z = 0 ligt op circa
// NAP +2,77. Het PDOK-pand staat op 46,26 en reikt tot 92,39 (NAP circa 48,7, het dak).
//
// Hoogtes: dak binnen de borstwering NAP +48,7 (AHN-DSM, vlak over 7,5 m; PDOK 92,39 - 43,65), borstwering en kantelen tot
// NAP +50,0 à 50,5 (AHN-DSM op de zuidrand). De mast met tuidraden op het dak (DSM 52,2) is weggelaten. De geledingen eronder
// komen uit de bijna frontale telefoto "Krimpen aan de Lek - Watertoren vanaf NW.jpg" (24,8 px/m met de reservoirbreedte van
// 8,4 m uit het AHN) en de RCE-opname 20302607 van verre (24,4 px/m, hele toren boven de daken): ringbodem 12,2 m onder de
// kanteelkop, rondboogfries tot 14,5 m, sierbanden op 19,5 en 27,5 m, een gordel van 33 tot 35,1 m en de gepleisterde
// sierband van de onderbouw tot 35,8 m eronder. De schachtbreedte (7,0 m onder het fries, 7,7 m boven de gordel) en de
// reservoirbreedte (8,4 m; 1,2 maal de schachtkop) uit dezelfde foto's. Printbaar op 1:1000 zonder steun: banden, fries en
// kraag onder de borstwering hebben een onderkant van 47 graden, de witte ringbodem loopt onder 28 graden uit, de consoles
// onder de kantelen onder 17 graden, deur, vensters en nissen hebben een spitse top van 55 graden.
import { Manifold, CrossSection, ccw, hull, union, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [103622.71, 434374.19];
const DEG = 13.5;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const SEG = 72;
const T47 = Math.tan((47 * Math.PI) / 180); // ondervlakken onder 47 graden: net steiler dan de printhoek
const T55 = Math.tan((55 * Math.PI) / 180); // spitse tops van vensters en bogen
const GEOID = 43.65; // ellipsoïdisch min NAP hier (PDOK-terrein min AHN-DTM: 43,55 tot 43,76)
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06 (zuidwestkant, naar de rivier).
const GROUND_ELLIPSOID = 46.418;
const c22 = +(6 * Math.cos(Math.PI / 8)).toFixed(2), s22 = +(6 * Math.sin(Math.PI / 8)).toFixed(2);
const GROUND_SAMPLES = [[c22, s22], [s22, c22], [-s22, c22], [-c22, s22], [-c22, -s22], [-s22, -c22], [s22, -c22], [c22, -s22]];
const NAP0 = +(GROUND_ELLIPSOID - GEOID).toFixed(2); // NAP-hoogte van z = 0: 2,77
const z = (nap) => +(nap - NAP0).toFixed(2); // NAP → modelhoogte

// ---------- maten ----------
const R = {
  plinth: 4.68, // trasraam (BAG-cirkel)
  wall: 4.53, // onderbouw boven de waterlijst, verjongt tot wallTop
  wallTop: 4.12,
  sierband: 4.2, // gepleisterde sierband boven de onderbouw
  belt: 3.98, // gordel onder de schacht (foto: 7,7 m over de banden)
  beltBand: 4.06,
  shaftFoot: 3.85, // conische schacht
  shaftTop: 3.52, // onder het fries (foto: 7,0 m)
  band: 0.12, // uitkraging van de sierbanden
  frieze: 3.67, // rondboogfries
  ring: 4.27, // witte ringbodem van het reservoir
  drum: 4.15, // reservoir (AHN: 8,3 à 8,6 m over de borstwering)
  corbel: 4.28, // kraag onder de borstwering
  parapet: 4.25,
  parapetInner: 3.35, // binnenkant van de borstwering (0,9 m dik; in het echt dunner)
  merlon: 4.45, // kantelen steken 0,2 m voor de borstwering
  buttress: 5.47, // steunberen aan de voet (BAG)
  buttressTop: 4.45,
};
const H = {
  plinth: 1.0, // trasraam tot NAP +3,77 (aan de noordkant bijna in het terrein)
  wallTop: z(14.6), // bovenkant onderbouw
  sierband: z(15.3),
  beltBand: [z(17.1), z(17.4)],
  bands: [z(22.9), z(30.9)], // sierbanden in de schacht, 0,3 m hoog
  shaftTop: z(35.95), // onderkant rondboogfries
  ring: z(38.25), // onderkant witte ringbodem
  ringTop: z(40.4), // bovenkant ring, begin reservoirwand
  drumTop: z(48.35), // onderkant kraag
  roof: z(48.7), // plat dak (AHN)
  corbelTop: z(49.15), // bovenkant kraag = voet van de borstwering
  parapet: z(49.95), // bovenkant borstwering
  merlonFoot: z(48.6),
  merlonConsole: z(47.45), // punt van de console onder elke kanteel
  merlon: z(50.45), // kop van de kantelen (AHN 50,0 à 50,5)
  buttress: 11.0, // steunbeer vol tot hier, dan onder 60 graden terug in de muur
  drumWindows: [z(41.65), z(46.15)],
};

// ---------- omwentelingslichaam ----------
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Schachtstraal op hoogte zz (lineair tussen gordel en fries).
const shaftR = (zz) => R.shaftFoot + ((R.shaftTop - R.shaftFoot) * (zz - H.beltBand[1])) / (H.shaftTop - H.beltBand[1]);
// Sierband in de schacht: 0,3 m hoog, 0,12 m uitkragend met een onderkant van 47 graden.
const band = (z0) => {
  const r = shaftR(z0);
  return [[r, z0 - R.band * T47], [r + R.band, z0], [r + R.band, z0 + 0.3], [shaftR(z0 + 0.3), z0 + 0.3]];
};
const core = rev([
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.wall, H.plinth + (R.plinth - R.wall)], // trasraam en waterlijst
  [R.wallTop, H.wallTop],
  [R.sierband, H.wallTop + (R.sierband - R.wallTop) * T47], [R.sierband, H.sierband], // gepleisterde sierband
  [R.belt, H.sierband], [R.belt, H.beltBand[0]],
  [R.beltBand, H.beltBand[0] + (R.beltBand - R.belt) * T47], [R.beltBand, H.beltBand[1]], // gordel met band
  [R.shaftFoot, H.beltBand[1]],
  ...band(H.bands[0]), ...band(H.bands[1]),
  [R.shaftTop, H.shaftTop],
  [R.frieze, H.shaftTop + (R.frieze - R.shaftTop) * T47], [R.frieze, H.ring], // rondboogfries
  [R.ring, H.ring + 1.15], [R.ring, H.ringTop], [R.drum, H.ringTop], // witte ringbodem
  [R.drum, H.drumTop], [R.corbel, H.drumTop + (R.corbel - R.drum) * T47], [R.corbel, H.corbelTop], // kraag
  [R.parapet, H.corbelTop], [R.parapet, H.parapet], [R.parapetInner, H.parapet], [R.parapetInner, H.roof], [0, H.roof],
]);

// ---------- delen in het stelsel van een gevelrichting ----------
// Punt in het stelsel met normaal onder hoek a (graden, linksom vanaf +X): o langs de normaal, s langs de gevel.
const frame = (a) => {
  const n = [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)];
  return (o, s, zz) => [n[0] * o - n[1] * s, n[1] * o + n[0] * s, zz];
};
// Venster of nis met normaal a, van o = rw - depth tot rw + 0.8, breedte w, van z0 tot de aanzet zs, met een spitse top van
// 55 graden (voor de rondbogen).
const niche = (a, rw, w, z0, zs, depth) => {
  const at = frame(a);
  return hull([
    ...[-w / 2, w / 2].flatMap((s) => [at(rw - depth, s, z0), at(rw + 0.8, s, z0), at(rw - depth, s, zs), at(rw + 0.8, s, zs)]),
    at(rw - depth, 0, zs + (w / 2) * T55), at(rw + 0.8, 0, zs + (w / 2) * T55),
  ]);
};

// Steunberen: 1,0 m breed, aan de voet tot r 5,47 (BAG), voorkant verjongend tot r 4,45 op 11,0 m en dan onder 60 graden
// terug in de muur, net onder de sierband.
const buttresses = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
  const at = frame(a);
  const rIn = R.wallTop - 0.15;
  return hull([-0.5, 0.5].flatMap((s) => [
    at(rIn, s, BASE), at(R.buttress, s, BASE), at(R.buttressTop, s, H.buttress),
    at(rIn, s, H.buttress + (R.buttressTop - rIn) * Math.tan(Math.PI / 3)),
  ]));
});

// Kantelen: twaalf, 0,9 m breed (in het echt circa 0,6), van de binnenkant van de borstwering tot 0,2 m ervoor, met een
// console die onder 17 graden naar een punt op de reservoirwand loopt. Ze staan tussen de reservoirvensters in.
const MERLONS = Array.from({ length: 12 }, (_, k) => 15 + 30 * k);
const merlons = MERLONS.map((a) => {
  const at = frame(a);
  return union([
    hull([-0.45, 0.45].flatMap((s) => [at(R.parapetInner, s, H.merlonFoot), at(R.merlon, s, H.merlonFoot), at(R.parapetInner, s, H.merlon), at(R.merlon, s, H.merlon)])),
    hull([
      ...[-0.45, 0.45].flatMap((s) => [at(R.drum - 0.15, s, H.merlonFoot), at(R.merlon, s, H.merlonFoot)]),
      at(R.drum - 0.05, -0.3, H.merlonConsole), at(R.drum - 0.05, 0.3, H.merlonConsole), at(R.drum - 0.15, 0, H.merlonConsole - 0.3),
    ]),
  ]);
});

// ---------- openingen ----------
const WINDOWS = Array.from({ length: 12 }, (_, k) => 30 * k);
const DOOR = 67.5; // tussen de steunberen het dichtst bij het noorden (RD 81 graden)
// Schachtvensters: per geleding vier staande vensters onder een rondboog, per geleding 45 graden verdraaid (trappenhuis).
const shaftWindow = (a, z0, zs) => niche(a, shaftR(zs), 0.9, z0, zs, 0.3);
const openings = union([
  // Ingang in de noordzijde: deur onder een rondboog, sill op het hogere maaiveld aan de noordkant (NAP +3,6).
  niche(DOOR, R.wall - 0.05, 1.3, z(3.6), z(6.0), 0.4),
  // Schacht: drie geledingen.
  ...[0, 90, 180, 270].map((a) => shaftWindow(a + 22.5, z(19.0), z(20.9))),
  ...[0, 90, 180, 270].map((a) => shaftWindow(a + 67.5, z(25.8), z(27.7))),
  ...[0, 90, 180, 270].map((a) => shaftWindow(a + 22.5, z(32.3), z(34.2))),
  // Rondboogfries: twintig blinde bogen.
  ...Array.from({ length: 20 }, (_, k) => niche(9 + 18 * k, R.frieze, 0.72, z(36.25), z(37.55), 0.15)),
  // Reservoir: twaalf lange staande vensters (in het echt recht gesloten; een vlak plafond van 63 graden liet de export in de
  // smalle nis nog een wig opvullen, dus een spitse top van 55 graden).
  ...WINDOWS.map((a) => niche(a, R.drum, 0.5, H.drumWindows[0], H.drumWindows[1] - 0.36, 0.3)),
  // Opengewerkte borstwering: twee spitsboogopeningen van 0,36 m per vak tussen de kantelen (in het echt vier kleinere), 0,28 m
  // naast het midden van het vak, zodat ze de kantelen niet raken.
  ...WINDOWS.flatMap((a) => [-1, 1].map((d) => niche(a + (d * 0.28 * 180) / (Math.PI * R.parapet), R.parapet, 0.36, H.corbelTop + 0.1, H.corbelTop + 0.45, 0.3))),
]);

const all = union([core, ...buttresses, ...merlons]).subtract(openings).trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-krimpen-aan-de-lek",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-steunberen-schacht-fries-reservoir-en-borstwering", all]],
  catalog: {
    name: "Watertoren Krimpen aan de Lek",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: GROUND_SAMPLES,
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0643100002039539"],
    description:
      "Oorsprong op het hart van de ronde toren (BAG-cirkel 9,36 m) op het laagste maaiveld rond de voet (NAP circa +2,77 m, rivierzijde; aan de dijkzijde ligt het terrein tot 0,8 m hoger), +X op RD 13,5 graden, zodat de acht steunberen op veelvouden van 45 graden staan. Onderbouw met trasraam, acht steunberen, de ingang aan de noordkant en een gepleisterde sierband op 12,5 m; gordel, conische schacht met twee sierbanden en staande rondboogvensters; rondboogfries, witte ringbodem en reservoir van 8,3 m met twaalf lange vensters; kraag, opengewerkte borstwering met twaalf kantelen tot 47,7 m rond het platte dak op 45,9 m. Maten uit AHN, BAG en foto's.",
    realWorld: {
      built: 1909,
      architect: "Visser & Smit",
      publishedHeightM: 47.2,
      reservoirM3: 250,
      rijksmonument: 512470,
      groundNapM: NAP0,
      ahnRoofNapM: 48.7,
      ahnParapetNapM: 50.45,
      baseDiameterM: 2 * R.plinth,
      buttressDiameterM: 2 * R.buttress,
      shaftDiameterM: [2 * R.shaftFoot, 2 * R.shaftTop],
      drumDiameterM: 2 * R.drum,
      roofM: H.roof,
      topM: H.merlon,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Krimpen_aan_de_Lek) (1909, Visser & Smit, 47,2 m, 250 m³)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/512470 (steunberen, trasraam, entree noordzijde, conische schacht met sierbanden en rondboogvensters, rondboogfries, reservoirvensters, borstwering met kantelen, plat dak)",
      "https://commons.wikimedia.org/wiki/File:Krimpen_aan_de_Lek_-_Watertoren_vanaf_NW.jpg (telefoto van het reservoir, de borstwering en de schacht)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_WATERLEIDINGBEDRIJF_MET_WATERTOREN_-_Krimpen_aan_de_Lek_-_20302607_-_RCE.jpg (RCE, hele toren: geledingen)",
      "https://commons.wikimedia.org/wiki/File:Krimpen_ad_Lek,_watertoren_foto2_2010-07-04_11.27.JPG (2010, onderbouw met steunberen, gordel en sierbanden)",
      "https://commons.wikimedia.org/wiki/File:Kinderdijk_Watertoren_(Krimpen_aan_de_Lek).jpg en File:Watertoren_(Krimpen_aan_de_Lek).JPG (vanaf de rivier)",
      "PDOK BAG-pand 0643100002039539, AHN DSM/DTM 0,5 m, luchtfoto Actueel_orthoHR en PDOK-terrein, 2026-11-06",
    ],
  },
});

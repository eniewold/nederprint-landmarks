// Watertoren van Twickel in Delden (gemeente Hof van Twente), bij de Watertorenstraat 5. Gebouwd in 1894 naar ontwerp
// van H.P.N. Halbertsma in opdracht van R.F. baron van Heeckeren van Wassenaer van landgoed Twickel, uitgevoerd door
// Scholten & Westenberg uit Almelo, beeldhouwwerk van Gerard Muller; neorenaissance, rijksmonument 507505 (complex Twickel
// 507545). Volgens het register 37,5 m hoog, met een vroeg ijzeren Intze-reservoir van 200 m³. De toren staat op een lage
// heuvel; ten noorden ervan liggen de gebouwen van het pompstation (eigen BAG-panden, blijven staan).
//
// Vorm (register, Commons-foto's "Delden, de watertoren RM507505 foto7" van het zuidoosten, "Watertoren Delden", "Water
// tower in Delden" en de RCE-opnamen 20297443-20297445, luchtfoto, AHN en 3D BAG): een hardstenen plint; een ronde bakstenen
// onderbouw met de ingangspartij (deur onder een rondboog tussen Ionische zuilen, kroonlijst en een gebroken halfrond
// fronton met wapen), twee rondboogvensters en vierkante omlijste oculi; een zware cordonlijst; een slankere ronde schacht met
// kijkspleten; consoles met engelenkopjes, riviergoden en waternimfen op de acht hoeken, een rondboogfries waarop de
// uitkragende achtkante reservoirommanteling rust; per zijde een blind venster met timpaan tussen hoekblokken; een
// kroonlijst, een gekanteelde borstwering en op het dak een klein achtkant torentje met vensters en kantelen.
//
// Oorsprong op het hart van BAG-pand 1735100000056870 (cirkel met straal 4,14 m, de bakstenen onderbouw), op maaiveld
// NAP +22,0 (AHN-DTM op de heuvel rond de toren 21,9 tot 22,05; 3D BAG-maaiveld 21,82). +X naar het oosten, +Y naar het
// noorden: de achtkant staat met zijn zijden naar de windstreken (luchtfoto: noord-, oost- en westzijde van de borstwering
// liggen evenwijdig aan het RD-raster).
// Hoogtes: dak binnen de borstwering NAP +57,84 (3D BAG, AHN-DSM 57,5 tot 58,0), kantelen van het torentje NAP +62,0
// (AHN-DSM, PDOK 61,9). Geledingen eronder uit de foto van het zuidoosten (29,85 px/m uit de BAG-diameter van de
// onderbouw; met die schaal komt het torentje op 40,0 m zoals in het AHN).
import { hull, union, prism, circle, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [245218.97, 476162.32];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 22.0;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints op 5 m van het hart aan de noord-, west-, zuid- en
// zuidoostkant (65,45, 65,35, 65,47 en 65,48), gemeten 2026-11-05. Aan de noordoostkant ligt het PDOK-terrein tot 0,8 m hoger
// (de stoep voor de ingang); daar staat geen punt.
const GROUND_ELLIPSOID = 65.35;

const deg = (a) => (a * Math.PI) / 180;
const N = 64; // segmenten van de ronde delen
// Regelmatige achthoek met de zijden naar de windstreken; flat = afstand van het hart tot een zijde.
const oct = (flat) => circle([0, 0], flat / Math.cos(Math.PI / 8), 8, Math.PI / 8);
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const disc = (r, z) => ring(circle([0, 0], r, N), z);

// Punt in het stelsel van een gevel: normaal onder hoek a (graden, linksom vanaf oost), o langs de normaal vanaf het hart,
// s langs de gevel (linksom positief).
const frame = (a) => {
  const n = [Math.cos(deg(a)), Math.sin(deg(a))];
  const t = [-n[1], n[0]];
  return (o, s, z) => [n[0] * o + t[0] * s, n[1] * o + t[1] * s, z];
};
// Blinde nis of venster in de gevel met normaal a op afstand rw van het hart, s = u langs de gevel, breedte w, van z0 tot z1,
// diepte depth. Het plafond loopt onder 56 graden de muur in; met gable een spitse top van 50 graden (rondboog, timpaan).
// Buiten de gevel loopt de snede schuin omlaag, zodat lijsten en consoles erboven heel blijven.
const niche = (a, rw, u, w, z0, z1, depth, gable = 0) => {
  const at0 = frame(a);
  const at = (o, s, z) => at0(rw + o, u + s, z);
  const zb = Math.max(z0, z1 - 1.5);
  const pts = [-w / 2, w / 2].flatMap((s) => [
    at(-depth, s, z0), at(1.0, s, z0), at(-depth, s, z1 + 1.5 * depth), at(0, s, z1), at(1.0, s, zb),
  ]);
  if (gable > 0) pts.push(at(0, 0, z1 + gable), at(-depth, 0, z1 + gable + 1.5 * depth));
  return hull(pts);
};
// Rechthoek in het gevelstelsel, als prisma.
const block = (a, o0, o1, s0, s1, z0, z1) => {
  const at = frame(a);
  return prism([[o0, s0], [o1, s0], [o1, s1], [o0, s1]].map(([o, s]) => at(o, s, 0).slice(0, 2)), z0, z1);
};
const FACES = [0, 45, 90, 135, 180, 225, 270, 315]; // normalen van de acht zijden
const CORNERS = FACES.map((a) => a + 22.5);

// ---------- maten (meters, hoogtes boven maaiveld NAP +22,0) ----------
const R = {
  plinth: 4.45, // hardstenen plint, 8,9 m (foto: 262 px)
  plinthTop: 4.3,
  base: 4.14, // bakstenen onderbouw, BAG-cirkel 8,28 m
  cordon: 4.42, // cordonlijst, 8,85 m (foto: 264 px)
  shaft: 3.89, // schacht, 7,78 m (foto: 232 px)
};
const F = {
  arcade: 4.85, // rondboogfries, 9,7 m over de zijden (foto: 292 px)
  moulding: 4.95, // profiellijst onder de ommanteling
  casing: 4.7, // ommanteling, 9,4 m (foto: 280 px; luchtfoto borstwering 9,25 m)
  cornice: 5.05, // kroonlijst, 10,1 m (foto: 300 px)
  parapet: 4.62, // borstwering, 9,25 m (luchtfoto)
  parapetInner: 3.72, // binnenkant van de borstwering (0,9 m dik)
  lantern: 1.4, // torentje, 2,8 m (foto: 83 px; AHN-DSM 2,5 tot 3,0 m)
  lanternBand: 1.55,
  lanternTop: 1.5,
};
const H = {
  plinth: 1.25,
  base: [1.2, 8.5], // onderbouw tot de onderkant van de cordonlijst
  cordon: [8.78, 9.2, 10.05], // cordonlijst: voorkant van 8,78 tot 9,2, schuin terug tot de schacht op 10,05
  corbel: 24.6, // de schacht gaat over in de consoles
  console: 23.8, // onderkant van de hoekconsoles
  arcade: [26.5, 28.1], // rondboogfries
  moulding: [28.1, 28.2, 28.4],
  panels: [30.25, 34.05], // verdiepte vlakken tussen de hoekblokken, boven de knoppenband
  windows: [30.5, 33.0], // blinde vensters, timpaan tot 33,45
  cornice: [34.55, 34.9, 35.85], // kroonlijst; bovenkant = dak NAP +57,85
  crenel: 37.05, // onderkant van de kantelen (vergroot tot 0,9 m)
  parapet: 37.95, // bovenkant van de borstwering (foto 37,9; register 37,5 tot de kantelen)
  lantern: [35.8, 38.95], // torentje tot de lijst
  lanternBand: [38.85, 39.0, 39.2],
  lanternCrenel: 39.5,
  lanternTop: 40.0, // NAP +62,0
};
// Ingangspartij aan de noordoostkant (hoek 35 graden): de stoep in het PDOK-terrein ligt tussen 15 en 65 graden, de trap
// met vazen loopt vanaf de ingang naar het noordoosten en op de foto's staat de partij net op de rand van het silhouet.
const ENTRANCE = 35;

// ---------- plint, onderbouw, cordonlijst en schacht ----------
const plinth = hull([...disc(R.plinth, BASE), ...disc(R.plinth, 0.3), ...disc(R.plinthTop, H.plinth)]);
const base = prism(circle([0, 0], R.base, N), H.plinth - 0.05, H.base[1] + 0.01);
const cordon = hull([
  ...disc(R.base, H.base[1]),
  ...disc(R.cordon, H.cordon[0]),
  ...disc(R.cordon, H.cordon[1]),
  ...disc(R.shaft, H.cordon[2]),
]);
const shaft = prism(circle([0, 0], R.shaft, N), H.cordon[2] - 0.05, H.corbel + 0.01);

// ---------- consoles, rondboogfries en ommanteling ----------
// Overgang van de ronde schacht naar de achtkant: convexe omhullende, zijden 54 graden; op de acht hoeken een zwaardere
// console van 0,9 m breed vanaf 23,8 m (de engelenkopjes, riviergoden en nimfen).
const corbel = hull([...disc(R.shaft, H.corbel), ...ring(oct(F.arcade), H.arcade[0])]);
const consoles = CORNERS.map((a) => {
  const at = frame(a);
  const rc = F.arcade / Math.cos(Math.PI / 8) - 0.1;
  return hull([-0.45, 0.45].flatMap((s) => [
    at(R.shaft - 0.3, s, H.console), at(R.shaft - 0.3, s, H.arcade[0]), at(rc, s, H.arcade[0]),
  ]));
});
const arcade = prism(oct(F.arcade), H.arcade[0] - 0.01, H.arcade[1] + 0.01);
const moulding = hull([
  ...ring(oct(F.arcade), H.moulding[0]),
  ...ring(oct(F.moulding), H.moulding[1]),
  ...ring(oct(F.moulding), H.moulding[2]),
]);
const casing = prism(oct(F.casing), H.moulding[2] - 0.01, H.cornice[0] + 0.01);
const cornice = hull([
  ...ring(oct(F.casing), H.cornice[0]),
  ...ring(oct(F.cornice), H.cornice[1]),
  ...ring(oct(F.cornice), H.cornice[2]),
]);
// Borstwering van 0,9 m dik met twee kantelen van 0,9 × 0,9 m per zijde (in het echt circa 0,5 m; grover voor 1:1000).
const parapet = prism(oct(F.parapet), H.cornice[2] - 0.01, H.parapet)
  .subtract(prism(oct(F.parapetInner), H.cornice[2], H.parapet + 1));
const crenels = FACES.flatMap((a) => [-0.95, 0.95].map((u) => block(a, F.parapetInner - 0.5, F.parapet + 1, u - 0.45, u + 0.45, H.crenel, H.parapet + 1)));

// ---------- torentje ----------
const lantern = union([
  prism(oct(F.lantern), H.lantern[0], H.lantern[1] + 0.01),
  hull([
    ...ring(oct(F.lantern), H.lanternBand[0]),
    ...ring(oct(F.lanternBand), H.lanternBand[1]),
    ...ring(oct(F.lanternBand), H.lanternBand[2]),
  ]),
  prism(oct(F.lanternTop), H.lanternBand[2] - 0.01, H.lanternTop),
]);
// Kantelen van het torentje: inkepingen van 0,9 m in de noord-, oost-, zuid- en westzijde; de hoeken blijven staan.
const lanternCrenels = [0, 90, 180, 270].map((a) => block(a, 0.7, F.lanternTop + 1, -0.45, 0.45, H.lanternCrenel, H.lanternTop + 1));

// ---------- ingangspartij ----------
const L = { back: 3.4, front: 4.95, half: 1.2 };
const landing = union([
  block(ENTRANCE, L.back, 5.3, -1.8, 1.8, BASE, 1.15), // stoep, bovenkant boven het PDOK-terrein (tot 1,0 m)
  block(ENTRANCE, L.back, 5.8, -1.8, 1.8, BASE, 0.8),
  block(ENTRANCE, L.back, 6.3, -1.8, 1.8, BASE, 0.45),
]);
const porchAt = frame(ENTRANCE);
const porch = union([
  block(ENTRANCE, L.back, L.front, -L.half, L.half, 1.1, 5.91),
  // Kroonlijst met een onderkant van 45 graden.
  hull([
    ...[[L.back, -L.half], [L.front, -L.half], [L.front, L.half], [L.back, L.half]].map(([o, s]) => porchAt(o, s, 5.7)),
    ...[5.9, 6.3].flatMap((z) => [[L.back, -1.4], [L.front + 0.2, -1.4], [L.front + 0.2, 1.4], [L.back, 1.4]].map(([o, s]) => porchAt(o, s, z))),
  ]),
  // Halfrond fronton met het wapen, tot 7,5 m.
  hull(Array.from({ length: 13 }, (_, k) => Math.PI * (k / 12)).flatMap((t) =>
    [L.back, L.front].map((o) => porchAt(o, 1.2 * Math.cos(t), 6.29 + 1.2 * Math.sin(t))))),
]);

// ---------- openingen ----------
const openings = union([
  // Deur onder een rondboog in de ingangspartij.
  niche(ENTRANCE, L.front, 0, 1.2, 1.15, 3.5, 0.4, 0.72),
  // Twee rondboogvensters in de onderbouw, 76 graden naast de ingang.
  ...[-76, 76].map((d) => niche(ENTRANCE + d, R.base, 0, 1.0, 2.5, 5.3, 0.35, 0.6)),
  // Vierkante omlijste oculi boven de vensters.
  ...[-106, -43, 43, 106].map((d) => niche(ENTRANCE + d, R.base, 0, 0.9, 6.95, 7.85, 0.3)),
  // Kijkspleten in de schacht, acht per rij, drie rijen.
  ...[[10.7, 12.1], [17.4, 18.9], [22.6, 23.7]].flatMap(([z0, z1]) =>
    FACES.map((a) => niche(a + 10, R.shaft, 0, 0.45, z0, z1, 0.3))),
  // Rondboogfries: drie bogen per zijde.
  ...FACES.flatMap((a) => [-1.05, 0, 1.05].map((u) => niche(a, F.arcade, u, 0.7, 26.65, 27.6, 0.3, 0.42))),
  // Ommanteling: verdiepte vlakken tussen de hoekblokken en per zijde een blind venster met timpaan.
  ...FACES.map((a) => niche(a, F.casing, 0, 2.9, ...H.panels, 0.12)),
  ...FACES.map((a) => niche(a, F.casing, 0, 0.75, ...H.windows, 0.3, 0.45)),
  // Vensters van het torentje in de schuine zijden.
  ...[45, 135, 225, 315].map((a) => niche(a, F.lantern, 0, 0.55, 36.4, 37.9, 0.25)),
  ...crenels,
  ...lanternCrenels,
]);

const tower = union([
  plinth, base, cordon, shaft, corbel, ...consoles, arcade, moulding, casing, cornice, parapet, lantern, landing, porch,
]).subtract(openings);

await writeLandmark({
  slug: "watertoren-delden",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-reservoirommanteling-en-torentje", tower]],
  catalog: {
    name: "Watertoren Delden (Twickel)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, 5], [-5, 0], [0, -5], [3.54, -3.54]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1735100000056870"],
    description:
      "Oorsprong op het hart van het BAG-pand (de ronde onderbouw, 8,28 m) op maaiveld van de heuvel (NAP +22,0 m), +X naar het oosten, +Y naar het noorden; de achtkant staat met de zijden naar de windstreken. Hardstenen plint, ronde onderbouw met ingangspartij (deur, kroonlijst, halfrond fronton) en stoep aan de noordoostkant, twee rondboogvensters en vier oculi, cordonlijst op 8,8 tot 10 m, schacht van 7,8 m met drie rijen kijkspleten, hoekconsoles en een rondboogfries waarop de achtkante reservoirommanteling (9,4 m) uitkraagt, blinde vensters met timpaan tussen hoekblokken, kroonlijst en dak op 35,85 m (NAP +57,85), borstwering met kantelen tot 37,95 m en een achtkant torentje met kantelen tot 40,0 m (NAP +62,0). Maten uit BAG, AHN, 3D BAG, luchtfoto en foto's.",
    realWorld: {
      built: 1894,
      architect: "H.P.N. Halbertsma",
      reservoirM3: 200,
      registerHeightM: 37.5,
      rijksmonument: 507505,
      ahnGroundNapM: GROUND_NAP,
      bag3dRoofNapM: 57.84,
      ahnLanternNapM: 62.0,
      baseDiameterM: R.base * 2,
      shaftDiameterM: R.shaft * 2,
      casingAcrossFlatsM: F.casing * 2,
      corniceAcrossFlatsM: F.cornice * 2,
      roofM: H.cornice[2],
      parapetM: H.parapet,
      lanternM: H.lanternTop,
      entranceBearingDeg: 90 - ENTRANCE,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Delden) (1894, H.P.N. Halbertsma, 37,5 m, 200 m³, landgoed Twickel)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/507505 (opbouw, ingang, rondboogfries, blinde vensters met timpaan, kantelen, torentje)",
      "https://commons.wikimedia.org/wiki/File:Delden,_de_watertoren_RM507505_foto7_2013-04-22_13.58.jpg (2013, vanaf het zuidoosten: geledingen en breedtes, 29,85 px/m)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Delden.jpg en File:Water_tower_in_Delden.JPG (ingangspartij, vensters, oculi, kijkspleten)",
      "Commons: RCE-opnamen 20297443, 20297444 en 20297445 (overzicht en reservoirommanteling)",
      "PDOK BAG-pand 1735100000056870 (bouwjaar 1893), AHN DSM/DTM 0,5 m, luchtfoto en PDOK-terrein, 2026-11-05",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.1735100000056870: dakhoogte en maaiveld, opgehaald 2026-11-05",
    ],
  },
});

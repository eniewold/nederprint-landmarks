// Watertoren van de Verkadefabriek aan de Westzijde in Zaandam (Wikipedia: 1880; het rijksmonumentenregister geeft geen
// bouwjaar). De toren staat tegen de noordoosthoek van het fabrieksgebouw uit 1904 aan de Zaan, naast een insteek in de
// kade, en bevat het reservoir van de sprinklerinstallatie. Het register beschrijft hem onder monument 518046
// (Westzijde 168, fabrieksgebouw van het complex Verkade): rechthoekig, vijf bouwlagen, vlakke bakstenen gevels met
// hoeklisenen op zware gebosseerde blokken natuursteen, op de hoeken ronde arkelachtige bekroningen, de letters
// BESCHUIT / VERKADE / KOEKFABRIEK op de attiek (zuid, oost, noord), in de bovenste laag smalle lichtspleten tussen
// hangende lisenen, en een steil schilddak met rode kruispannen, een korte nok haaks op de Zaan, op elk dakvlak een
// dakkapelletje met een steekkap, en een smeedijzeren bekroning met een windvaan (ruiter). Aan de Zaanzijde (oost) de
// laaddeuren: begane grond, een deur in een grote rondboog op de derde laag, een laaddeur met halfrond bovenlicht op de
// vierde en daarboven een oculus. (Monument 518048, dat de Kanzo-taak en Wikidata noemen, is de nieuw-zakelijke
// watertoren van de biscuitfabriek uit 1931 aan het Hollandse Pad; die staat elders op het terrein.)
//
// De toren is geen eigen BAG-pand: hij hoort bij pand 0479100000000085 (bouwjaar 1920), het hele fabriekscomplex tussen
// Westzijde en Zaan. De kaart en de export kunnen alleen hele panden verbergen; daarom vervangt het model het hele pand en
// neemt de GLB de rest ervan over als tweede node: de dakvlakken van de 3D BAG (LoD2.2, CC BY 4.0, verkadeBag3d() onderaan)
// als prisma's onder hun eigen dakvlak, zonder de toren (zoals generate-watertoren-wormer-hollandia.mjs).
//
// Oorsprong op het midden van de torenplattegrond op maaiveld (NAP +0,3: AHN-DTM op de kade 0,3 tot 0,4, 3D BAG 0,14).
// De plattegrond is geen rechthoek: de noordgevel (7,44 m) en de zuidgevel (7,91 m) lopen op RD 3,2 en 2,3 graden, de
// oostgevel volgt de kadelijn (8 graden uit het noorden), de westgevel loopt vrijwel noord-zuid. Hoekpunten uit het
// BAG-pand (noord- en oostgevel) en de dakvlakken van de 3D BAG (zuid- en westgevel), gecontroleerd op de rand van het
// AHN-DSM. Lokale +X op RD 3 graden (langs de noord- en zuidgevel), +Y naar het noorden (de insteek).
// Hoogtes: nok (korte vlakke nok van 1,8 m) en bovenkant van de hoekbekroningen uit AHN-DSM en 3D BAG (NAP +28,55 en
// +23,9); de geledingen uit de foto "WLM - Minke Wagenaar - 09-09-04 De Zaan 132" (Commons, telelens vanaf de Oostzijde,
// vrijwel orthografisch; 30 px/m uit de afstand nok-bekroning in het AHN), de lagere vensters uit "De Zaan 137" (vanaf de
// kade op de noordoosthoek, met een projectieve fit door maaiveld, lisene-einden, rollagenfries en lijst), de oostgevel uit
// "De Zaan 139" en de RCE-opnamen 20425100 (zuidgevel), 20425103 (zuid- en westgevel) en 20425107 (gebosseerde hoek).
import { Manifold, CrossSection, ccw, hull, union, prism, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [116435.09, 495575.94];
const AXIS_DEG = 3.0;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 0.3;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-05 met de terreintegels van de
// export: 43,13 oost, 43,28 noord, 43,17 zuidoost (geoïde circa 42,83; aan de Westzijde 42,95).
const GROUND_ELLIPSOID = 43.13;
// Op de kade ten oosten en zuidoosten van de toren en op de insteek ten noorden ervan (AHN-DTM 0,3 tot 0,4).
const GROUND_SAMPLES = [[8, 0], [0, 6.5], [9, -16]];
// Torenplattegrond (buitenwerk van het muurwerk) linksom: zuidoost, noordoost, noordwest, zuidwest. Gevels: 0 oost
// (Zaan), 1 noord (insteek), 2 west, 3 zuid.
const Q = [[4.1, -3.16], [3.57, 3.12], [-3.87, 3.09], [-3.81, -3.07]];
const EAST = 0, NORTH = 1, WEST = 2, SOUTH = 3;
// Hoogtes boven maaiveld (NAP +0,3).
const H = {
  plinth: 2.5, // gebosseerde hoekblokken
  band: [2.4, 2.6], // natuurstenen band
  panels: [16.3, 19.0], // verdiepte vakken tussen de hangende lisenen
  slits: [17.1, 18.7], // lichtspleten
  turretBase: [19.6, 20.0], // kraag onder de hoekbekroningen
  corbel: [20.0, 20.35], // rollagenfries onder de attiek
  cornice: [22.7, 22.95], // houten lijst boven de letters
  turretTop: 23.6, // AHN-DSM NAP +23,8 tot +24,0
  kick: 23.55, // knik in het dak (opgelicht dakvoet)
  ridge: 28.25, // nok, NAP +28,55 (3D BAG), DSM +28,4 tot +28,7
  dormer: [22.95, 24.3, 25.9], // dakkapel: voet, goot, top van de steekkap
};
const LISENE = 0.12; // uitsprong van de hoeklisenen en de bekroningen
const TURRET_R = 0.65;
const RIDGE = [-0.9, 0.92]; // nok langs x (3D BAG)

// ---------- plattegrond ----------
const edge = (i) => [Q[i], Q[(i + 1) % 4]];
const unit = ([x, y]) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
const dir = (i) => { const [a, b] = edge(i); return unit([b[0] - a[0], b[1] - a[1]]); };
const normal = (i) => { const [dx, dy] = dir(i); return [dy, -dx]; };
const faceLength = (i) => { const [a, b] = edge(i); return Math.hypot(b[0] - a[0], b[1] - a[1]); };
// Plattegrond met elke gevel d evenwijdig naar buiten verschoven (negatief: naar binnen).
const offsetQuad = (d) => Q.map((P, i) => {
  const j = (i + 3) % 4; // gevel die in hoekpunt i eindigt, gevel i begint er
  const [ni, nj, di, dj] = [normal(i), normal(j), dir(i), dir(j)];
  const pi = [P[0] + ni[0] * d, P[1] + ni[1] * d], pj = [P[0] + nj[0] * d, P[1] + nj[1] * d];
  // pj + t dj = pi + u di
  const det = -dj[0] * di[1] + dj[1] * di[0];
  const t = (-(pi[0] - pj[0]) * di[1] + (pi[1] - pj[1]) * di[0]) / det;
  return [pj[0] + t * dj[0], pj[1] + t * dj[1]];
});
const ringAt = (d, z) => offsetQuad(d).map(([x, y]) => [x, y, z]);
// Lijst rondom: d uit, van z0 tot z1, met een onderkant onder 45 graden.
const ledge = (d, z0, z1) => hull([...ringAt(0, z0 - d), ...ringAt(d, z0), ...ringAt(d, z1)]);
// Stuk op de hoek tussen gevel i-1 en gevel i: w langs beide gevels en tot 1 m naar buiten.
const cornerZone = (i, w, z0, z1) => {
  const P = Q[i], a = dir((i + 3) % 4), b = dir(i), na = normal((i + 3) % 4), nb = normal(i);
  return prism([
    [P[0] - a[0] * w, P[1] - a[1] * w], [P[0] - a[0] * w + na[0], P[1] - a[1] * w + na[1]],
    [P[0] + na[0] + nb[0], P[1] + na[1] + nb[1]], [P[0] + b[0] * w + nb[0], P[1] + b[1] * w + nb[1]],
    [P[0] + b[0] * w, P[1] + b[1] * w], [P[0] - a[0] * w + b[0] * w, P[1] - a[1] * w + b[1] * w],
  ], z0, z1);
};
const corners = (w, z0, z1) => union([0, 1, 2, 3].map((i) => cornerZone(i, w, z0, z1)));
// Onderdeel gebouwd in een gevelstelsel (gevelvlak op x = 0, +X naar buiten, +Y naar rechts gezien van buiten, z omhoog)
// op gevel i zetten.
const onFace = (i, m) => {
  const [a, b] = edge(i), n = normal(i);
  return m.rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI]).translate([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0]);
};
// Opening als blinde nis: convexe omtrek [[s, z]] in het gevelvlak, depth diep, met een plafond dat naar binnen onder
// 56 graden oploopt (de achterkant is vanaf de dorpel verticaal opgerekt); buiten de gevel loopt de snede 1 m door.
const opening = (outline, depth) => {
  const zs = outline.map(([, z]) => z), z0 = Math.min(...zs), z1 = Math.max(...zs);
  return hull([
    ...outline.map(([s, z]) => [0, s, z]),
    ...outline.map(([s, z]) => [1, s, z]),
    ...outline.map(([s, z]) => [-depth, s, z + (1.5 * depth * (z - z0)) / (z1 - z0)]),
  ]);
};
const rectOutline = (s, w, z0, z1) => [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s - w / 2, z1]];
// Rondboog: rechthoek tot de aanzet, daarop een halve cirkel.
const archOutline = (s, w, z0, spring, n = 12) => [
  [s - w / 2, z0], [s + w / 2, z0],
  ...Array.from({ length: n + 1 }, (_, k) => [s + (w / 2) * Math.cos((Math.PI * k) / n), spring + (w / 2) * Math.sin((Math.PI * k) / n)]),
];
const circleOutline = (s, zc, r, n = 12) => Array.from({ length: n }, (_, k) => [s + r * Math.cos((2 * Math.PI * k) / n), zc + r * Math.sin((2 * Math.PI * k) / n)]);
const cutsOn = (i, outlines, depth) => outlines.map((o) => onFace(i, opening(o, depth)));
const spread = (n, step) => Array.from({ length: n }, (_, k) => (k - (n - 1) / 2) * step);

// ---------- schacht ----------
const shaft = prism(Q, BASE, H.cornice[1]);
// Gebosseerde blokken natuursteen op de hoeken (0,75 m langs elke gevel), bovenkant onder 45 graden.
const plinths = hull([...ringAt(LISENE, BASE), ...ringAt(LISENE, H.plinth), ...ringAt(0, H.plinth + LISENE)])
  .intersect(corners(0.75, BASE - 0.1, H.plinth + 0.3));
// Hoeklisenen (0,6 m langs elke gevel) tot onder het fries; de bekroningen staan erop.
const lisenes = prism(offsetQuad(LISENE), H.plinth, H.corbel[0] + 0.01).intersect(corners(0.6, H.plinth - 0.1, H.corbel[0] + 0.1));
// Middenlisene op de noord- en zuidgevel (0,5 m, 0,1 m uit), van de band tot het fries.
const midLisene = (i) => onFace(i, box(-0.01, -0.25, H.band[0], 0.1, 0.25, H.corbel[0] + 0.01));
const bands = union([
  ledge(0.1, H.band[0], H.band[1]),
  ledge(0.15, H.corbel[0], H.corbel[1]),
  ledge(0.2, H.cornice[0], H.cornice[1]),
]);

// ---------- hoekbekroningen ----------
// Rond, 1,3 m, 0,12 m buiten beide gevels (op de hoeklisenen), met een kraag van 45 graden.
const disc = (c, r, z, n = 24) => Array.from({ length: n }, (_, k) => [c[0] + r * Math.cos((2 * Math.PI * k) / n), c[1] + r * Math.sin((2 * Math.PI * k) / n), z]);
const turrets = union(offsetQuad(-(TURRET_R - LISENE)).map((c) => union([
  hull([...disc(c, TURRET_R - 0.4, H.turretBase[0]), ...disc(c, TURRET_R, H.turretBase[1])]),
  hull([...disc(c, TURRET_R, H.turretBase[1] - 0.01), ...disc(c, TURRET_R, H.turretTop)]),
])));

// ---------- dak ----------
// Dakvoet licht opgelicht (circa 47 graden) vanaf de lijst, daarboven het steile schilddak (circa 60 graden) tot een
// korte vlakke nok van 1,8 × 0,4 m.
const kick = hull([...ringAt(0.2, H.cornice[1] - 0.01), ...ringAt(-0.35, H.cornice[1] - 0.01), ...ringAt(-0.35, H.kick)]);
const roof = hull([
  ...ringAt(-0.35, H.kick - 0.01),
  ...[RIDGE[0], RIDGE[1]].flatMap((x) => [[x, -0.2, H.ridge], [x, 0.2, H.ridge]]),
]);
// Dakkapel midden op elk dakvlak: 1,15 m breed, voorvlak boven het gevelvlak, steekkap tot 25,9 m.
const dormer = union([
  box(-2.0, -0.575, H.dormer[0] - 0.01, 0, 0.575, H.dormer[1]),
  hull([
    [0.1, -0.65, H.dormer[1]], [0.1, 0.65, H.dormer[1]], [-2.0, -0.65, H.dormer[1]], [-2.0, 0.65, H.dormer[1]],
    [0.1, 0, H.dormer[2]], [-2.0, 0, H.dormer[2]],
    [0, -0.575, H.dormer[1] - 0.075], [0, 0.575, H.dormer[1] - 0.075],
  ]),
]);
const dormers = union([EAST, NORTH, WEST, SOUTH].map((i) => onFace(i, dormer)));

// ---------- openingen ----------
// Bovenste laag: verdiepte vakken (0,15 m) tussen de hangende lisenen, met in elk vak een lichtspleet (in het echt circa
// 0,15 m, hier 0,35 m en 0,4 m diep). Zes vakken op de noord- en zuidgevel (drie aan weerszijden van de middenpijler),
// vijf op de oost- en westgevel.
const panelCuts = (i) => {
  const L = faceLength(i);
  const pos = i === NORTH || i === SOUTH
    ? (() => { const w = ((L - 1.8) / 2 - 0.6) / 3; return [-1, 1].flatMap((sg) => [0, 1, 2].map((k) => sg * (0.3 + w / 2 + k * (w + 0.3)))).map((s) => [s, w]); })()
    : (() => { const w = (L - 1.2 - 4 * 0.3) / 5; return spread(5, w + 0.3).map((s) => [s, w]); })();
  return [
    ...cutsOn(i, pos.map(([s, w]) => rectOutline(s, w, ...H.panels)), 0.15),
    ...cutsOn(i, pos.map(([s]) => rectOutline(s, 0.35, ...H.slits)), 0.4),
  ];
};
// Dakkapelvenster.
const dormerWindows = [EAST, NORTH, WEST, SOUTH].flatMap((i) => cutsOn(i, [rectOutline(0, 0.6, 23.6, 24.15)], 0.2));
// Noordgevel (insteek): begane grond een breed venster (oost) en een deur (west), daarboven rondboogvensters, twee
// rechthoekige vensters, twee paarsgewijze vensters en twee kleine rondboogvensters, alle 1,7 m uit het midden.
const north = cutsOn(NORTH, [
  rectOutline(-1.7, 1.9, 0.3, 2.2),
  rectOutline(1.7, 1.0, 0, 2.2),
  ...[-1.7, 1.7].flatMap((s) => [
    archOutline(s, 1.7, 2.75, 3.25),
    rectOutline(s, 1.3, 5.6, 7.5),
    rectOutline(s, 1.75, 9.4, 11.0),
    archOutline(s, 0.6, 13.6, 14.4, 6),
  ]),
], 0.3);
// Oostgevel (Zaan): laaddeur op de begane grond, deur in een grote rondboog (4,4 m), laaddeur met halfrond bovenlicht en
// een oculus, alle op het midden.
const east = cutsOn(EAST, [
  archOutline(0, 1.5, 1.45, 3.05),
  archOutline(0, 4.4, 7.3, 7.9, 16),
  archOutline(0, 1.1, 11.7, 13.35),
  circleOutline(0, 15.05, 0.4),
], 0.3);

const tower = union([shaft, plinths, lisenes, midLisene(NORTH), midLisene(SOUTH), bands, turrets, kick, roof, dormers])
  .subtract(union([...[EAST, NORTH, WEST, SOUTH].flatMap(panelCuts), ...dormerWindows, ...north, ...east]));

// ---------- rest van het fabriekspand (3D BAG) ----------
// Elk dakvlak als prisma vanaf de onderkant, afgesneden door het vlak z = a x + b y + c (kleinste kwadraten door de
// hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen; binnenringen blijven open. De vier dakvlakken
// van de toren zelf staan niet in de tabel, en de toren is eruit gesneden.
const xyz = (flat) => Array.from({ length: flat.length / 3 }, (_, i) => flat.slice(i * 3, i * 3 + 3));
const fitPlane = (pts) => {
  const n = pts.length;
  const [mx, my, mz] = [0, 1, 2].map((k) => pts.reduce((s, p) => s + p[k], 0) / n);
  let sxx = 0, sxy = 0, syy = 0, sxz = 0, syz = 0;
  for (const [x, y, z] of pts) {
    const [u, v, w] = [x - mx, y - my, z - mz];
    sxx += u * u; sxy += u * v; syy += v * v; sxz += u * w; syz += v * w;
  }
  const det = sxx * syy - sxy * sxy;
  const a = Math.abs(det) < 1e-9 ? 0 : (sxz * syy - syz * sxy) / det;
  const b = Math.abs(det) < 1e-9 ? 0 : (syz * sxx - sxz * sxy) / det;
  return [a, b, mz - a * mx - b * my];
};
const roofPrism = (rings) => {
  const pts = xyz(rings[0]);
  const [a, b, c] = fitPlane(pts);
  const outer = ccw(pts.map(([x, y]) => [x, y]));
  const holes = rings.slice(1).map((r) => ccw(xyz(r).map(([x, y]) => [x, y])).reverse());
  const top = Math.max(...pts.map(([x, y]) => a * x + b * y + c)) + 1;
  const len = Math.hypot(a, b, 1);
  const section = new CrossSection([outer, ...holes], "EvenOdd").offset(0.02, "Miter");
  return Manifold.extrude(section, top - BASE).translate([0, 0, BASE]).trimByPlane([a / len, b / len, -1 / len], -c / len);
};
const factory = union(verkadeBag3d().map(roofPrism)).subtract(tower).subtract(prism(Q, BASE - 1, H.ridge + 2));

await writeLandmark({
  slug: "watertoren-zaandam",
  base: BASE,
  nodes: [
    ["building:watertoren-schacht-bekroningen-en-schilddak", tower],
    ["building:fabriek-verkade", factory],
  ],
  catalog: {
    name: "Watertoren Zaandam",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: GROUND_SAMPLES,
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0479100000000085"],
    description:
      "Oorsprong op het midden van de torenplattegrond op het maaiveld (NAP +0,3 m), +X langs de noord- en zuidgevel (RD-richting 3 graden), +Y naar het noorden (de insteek), oostgevel aan de Zaan. Bakstenen toren van circa 7,4 tot 7,9 bij 6,2 m op een scheve plattegrond, met gebosseerde hoekblokken, een natuurstenen band, hoeklisenen en middenlisenen, vensters en laaddeuren (noord en oost: rondbogen, een grote rondboog van 4,4 m en een oculus), verdiepte vakken met lichtspleten in de bovenste laag, een rollagenfries, de attiek en een lijst tot 22,95 m, ronde hoekbekroningen tot 23,6 m, een opgelichte dakvoet en een steil schilddak met vier dakkapellen tot 28,25 m. De toren hoort bij BAG-pand 0479100000000085 (het hele fabriekscomplex); dat pand wordt vervangen en building:fabriek-verkade is de 3D BAG-reconstructie (CC BY 4.0) van de rest ervan, zonder de toren.",
    realWorld: {
      built: "1880 (Wikipedia)",
      purpose: "reservoir van de sprinklerinstallatie van de Verkadefabriek",
      register: "rijksmonument 518046 (fabrieksgebouw met watertoren, Westzijde 168)",
      ahnGroundNapM: GROUND_NAP,
      bag3dRidgeNapM: 28.55,
      ahnTurretTopNapM: 23.9,
      northFaceM: +faceLength(NORTH).toFixed(2),
      southFaceM: +faceLength(SOUTH).toFixed(2),
      eastFaceM: +faceLength(EAST).toFixed(2),
      westFaceM: +faceLength(WEST).toFixed(2),
      slitPanelsM: H.panels,
      corbelM: H.corbel,
      corniceM: H.cornice,
      turretTopM: H.turretTop,
      ridgeM: H.ridge,
      photoScalePxPerM: 30,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Zaandam) (1880, in het fabrieksgebouw van Verkade)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/518046 (watertoren tegen de noordoosthoek van het fabrieksgebouw uit 1904: vijf bouwlagen, hoeklisenen op gebosseerde blokken, ronde hoekbekroningen, letters, lichtspleten tussen hangende lisenen, steil schilddak met dakkapellen en windvaan, laaddeuren, grote rondboog en oculus aan de voorzijde)",
      "https://commons.wikimedia.org/wiki/File:WLM_-_Minke_Wagenaar_-_09-09-04_De_Zaan_132.jpg (telelens: geledingen boven het fabrieksdak)",
      "https://commons.wikimedia.org/wiki/File:WLM_-_Minke_Wagenaar_-_09-09-04_De_Zaan_137.jpg en File:WLM_-_Minke_Wagenaar_-_09-09-04_De_Zaan_139.jpg (noord- en oostgevel: vensters, laaddeuren, rondboog, oculus)",
      "https://commons.wikimedia.org/wiki/File:Zicht_op_de_zuidzijde_van_de_watertoren_met_uitgemetseld_muurwerk_en_de_letters-_Beschuit,_binnenterrein_op_de_voorgrond,_gezien_vanaf_de_vierde_verdieping_noordwaarts,voor_herbestemming_-_Zaandam_-_20425100_-_RCE.jpg (zuidgevel, bekroningen, dak en dakkapel)",
      "PDOK BAG-pand 0479100000000085, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-05",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0479100000000085, LoD2.2-dakvlakken, opgehaald 2026-11-05",
    ],
  },
});

// ---------- data: dakvlakken van het fabriekspand ----------
// Dakvlakken (RoofSurface, LoD2.2) van 3D BAG-pand NL.IMBAG.Pand.0479100000000085 in het modelstelsel: x langs
// RD-richting 3 graden, y haaks daarop (linksom), beide in meters vanaf ORIGIN, z in meters boven NAP +0,3, afgerond op
// 1 cm. Per vlak de buitenring en eventuele binnenringen, elk als vlakke lijst x, y, z. Zonder de vier dakvlakken van de
// toren. Bron: https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0479100000000085, opgehaald 2026-11-05.
// Licentie: CC BY 4.0, 3D BAG door de 3D geoinformation-groep van de TU Delft en 3DGI.
function verkadeBag3d() {
  return [
    [[0.25, -13.4, 15.4, 0.29, -11.42, 16.11, -11.01, -11.48, 16.12, -11.14, -13.43, 15.41]],
    [[8.24, -76.32, -0.01, 8.24, -76.4, -0.02, 8.39, -76.39, -0.05, 8.38, -76.32, -0.04]],
    [[-45.57, -2.22, 10.31, -45.53, -2.46, 10.2, -36.22, -2.08, 10.22, -40.7, 1.38, 11.96]],
    [[-4.06, -49.96, 18.57, -0.35, -49.97, 18.55, -0.55, -46.71, 18.56, -4.11, -46.61, 18.58]],
    [[-20.39, 1.55, 2.65, -18.17, -0.71, 3.9, -17.69, 0.74, 4.13, -18.68, 1.33, 3.57, -19.04, 1.91, 3.37, -19.65, 1.91, 3.03, -19.98, 2.1, 2.85]],
    [[0.29, -11.42, 16.2, 0.62, -11.41, 16.2, 0.3, -10.61, 15.85, 0.32, -9.48, 15.38, -10.88, -9.57, 15.35, -11.01, -11.48, 16.17]],
    [[-56.62, -27.9, 20.32, -55.45, -27.94, 18.66, -55.5, -19.0, 18.68, -56.31, -18.46, 19.82, -57.0, -19.19, 20.8, -56.68, -19.62, 20.36, -56.62, -19.73, 20.27]],
    [[-48.61, -40.44, 5.89, -48.89, -38.2, 5.73, -49.18, -35.89, 5.57, -49.82, -34.57, 5.39, -50.01, -34.17, 5.34, -51.67, -34.18, 5.05, -51.56, -36.96, 5.21, -51.43, -40.14, 5.39]],
    [[-35.56, -61.01, 22.39, -33.68, -60.71, 22.42, -34.18, -56.93, 22.37, -36.42, -57.43, 22.34]],
    [[-39.02, 28.99, 9.98, -31.85, 29.12, 10.39, -31.91, 28.92, 10.77, -30.21, 28.94, 10.89, -27.65, 29.03, 10.96, -27.6, 29.22, 10.62, -27.32, 30.14, 8.9, -35.78, 30.1, 8.18, -38.84, 30.09, 7.93, -39.09, 29.99, 8.08, -39.07, 29.8, 8.44]],
    [[-11.01, -11.48, 14.96, -13.11, -11.5, 14.96, -15.31, -11.13, 15.12, -15.54, -11.17, 15.11, -15.51, -16.97, 12.65, -15.15, -16.97, 12.65, -15.13, -20.28, 11.24, 5.59, -19.94, 11.31, 4.81, -11.39, 14.95, 0.62, -11.41, 14.95, 0.29, -11.42, 14.95, 0.25, -13.4, 14.11, -11.14, -13.43, 14.13]],
    [[-48.02, -48.88, 5.62, -47.96, -49.24, 5.37, -31.53, -49.09, 5.39, -30.66, -49.07, 5.39, -7.07, -48.85, 5.41, -6.18, -47.3, 6.46, -6.49, -45.19, 7.91, -49.25, -45.45, 7.97, -49.6, -46.47, 7.27, -48.5, -46.45, 7.29, -48.65, -48.87, 5.63]],
    [[-39.13, 47.94, 7.72, -27.5, 48.07, 7.7, -27.52, 51.05, 7.75, -35.37, 51.01, 7.76, -35.38, 48.06, 7.72, -39.13, 48.05, 7.72]],
    [[-29.93, 35.64, 10.63, -35.71, 35.54, 10.63, -37.99, 34.05, 10.63, -27.9, 34.08, 10.63, -27.48, 33.76, 10.63, -27.14, 30.81, 10.62, -27.06, 30.14, 10.62, -27.32, 30.14, 10.62, -27.6, 29.22, 10.62, -27.65, 29.03, 10.62, -27.28, 28.98, 10.62, -25.43, 29.0, 10.62, -25.43, 34.91, 10.63, -29.36, 35.2, 10.63]],
    [[-51.43, -40.14, 6.65, -51.22, -45.46, 6.75, -49.25, -45.45, 6.59, -48.55, -43.43, 6.49, -48.32, -42.75, 6.45, -48.42, -41.93, 6.44, -48.61, -40.44, 6.42]],
    [[-53.35, -49.81, 18.59, -47.88, -49.71, 18.65, -47.96, -49.24, 18.64, -48.02, -48.88, 18.64, -48.65, -48.87, 18.64, -48.5, -46.45, 18.63, -49.6, -46.47, 18.62, -53.35, -46.56, 18.59]],
    [[-36.15, -63.07, 22.35, -35.84, -64.62, 22.37, -36.14, -66.74, 22.37, -33.45, -66.61, 22.44, -33.74, -63.02, 22.42]],
    [[-6.41, -35.12, 4.7, -13.28, -35.13, 4.82, -6.48, -37.54, 3.81]],
    [[-4.01, -39.46, 5.39, -3.8, -35.12, 5.34, -6.41, -35.12, 6.05, -6.48, -37.54, 6.07, -6.49, -37.69, 6.07, -6.4, -37.93, 6.05, -5.81, -39.65, 5.88]],
    [[-34.4, 6.25, 5.24, -35.0, -1.69, 4.8, -34.13, -1.75, 5.32, -30.4, 1.91, 7.61, -33.17, 4.5, 5.97, -33.3, 5.58, 5.9]],
    [[-37.18, -18.25, 20.8, -44.21, -20.14, 20.96, -39.15, -21.77, 20.71, -39.16, -20.65, 20.76, -37.96, -20.66, 20.72]],
    [[-16.89, -59.88, 20.47, -15.93, -57.61, 20.41, -17.47, -57.06, 20.45, -19.02, -58.04, 20.52, -18.43, -58.61, 20.5, -18.76, -59.56, 20.53]],
    [[-41.81, 6.14, 11.59, -43.2, 6.53, 11.69, -47.13, 6.61, 11.99, -47.14, 4.63, 12.0, -42.75, 4.88, 11.67, -41.79, 5.13, 11.6]],
    [[0.33, -57.67, 18.03, -14.01, -57.61, 17.94, -14.25, -59.98, 17.92, 3.24, -59.72, 18.03, 3.39, -46.82, 18.15, -0.55, -46.71, 18.13, -0.35, -49.97, 18.1, 1.71, -49.97, 18.11]],
    [[-55.05, -15.57, 15.09, -34.99, -15.43, 15.05, -35.01, -12.62, 15.04, -35.31, -12.62, 15.04, -35.36, -3.34, 15.01, -34.92, -3.34, 15.01, -34.79, -3.18, 15.01, -35.24, -2.83, 15.01, -36.22, -2.08, 15.01, -45.53, -2.46, 15.03, -45.57, -2.22, 15.03, -45.9, -2.47, 15.03, -46.17, -2.48, 15.03, -46.17, -2.54, 15.03, -53.18, -2.5, 15.05, -54.81, -4.11, 15.05, -54.81, -9.69, 15.07, -55.03, -9.68, 15.07]],
    [[-39.63, 10.79, 12.33, -38.96, 10.78, 12.33, -38.96, 10.64, 12.37, -38.72, 10.78, 12.33, -38.17, 10.77, 12.33, -37.57, 13.1, 11.66, -37.46, 13.55, 11.53, -38.86, 13.54, 11.54, -38.93, 11.48, 12.13, -39.59, 11.43, 12.14]],
    [[-10.77, -3.08, 11.41, -10.66, -5.09, 12.26, -13.87, -5.08, 12.25, -15.23, -3.7, 11.67, -15.23, -4.61, 12.05, -15.58, -4.61, 12.05, -15.54, -11.1, 14.79, -15.31, -11.13, 14.81, -13.11, -11.5, 14.96, -11.01, -11.48, 14.96, -10.88, -9.57, 14.15, 0.32, -9.48, 14.13, 0.3, -10.61, 14.61, 0.62, -11.41, 14.95, 4.81, -11.39, 14.95, 4.07, -3.26, 11.51, -1.83, -3.26, 11.51, -1.61, -3.06, 11.42, -3.81, -3.06, 11.42, -6.99, -3.07, 11.42]],
    [[-10.66, -5.09, 14.07, -10.77, -3.08, 14.05, -15.73, -3.08, 14.05, -15.73, -3.23, 14.05, -15.24, -3.23, 14.05, -15.23, -3.7, 14.05, -13.87, -5.08, 14.07]],
    [[-2.85, -28.06, 13.36, -2.62, -25.52, 13.36, -2.6, -25.4, 13.37, -2.43, -23.72, 13.37, -4.21, -23.53, 13.31, -4.28, -25.36, 13.31, -5.33, -26.61, 13.27]],
    [[-16.16, -2.7, 4.78, -16.18, -1.91, 5.27, -17.89, -0.99, 5.83, -18.17, -0.71, 6.01, -20.39, 1.55, 7.41, -20.74, 1.91, 7.63, -30.4, 1.91, 7.61, -34.13, -1.75, 5.32, -35.0, -1.69, 5.35, -35.08, -2.68, 4.74, -35.24, -2.83, 4.64, -34.79, -3.18, 4.43, -34.92, -3.34, 4.33, -19.42, -3.26, 4.42, -19.41, -3.7, 4.14, -18.96, -3.7, 4.15, -18.97, -3.15, 4.49, -17.07, -3.14, 4.5, -17.06, -3.69, 4.16, -16.61, -3.69, 4.16, -16.62, -3.24, 4.44, -15.73, -3.23, 4.45, -15.73, -3.08, 4.54, -15.84, -3.08, 4.54, -16.07, -2.85, 4.68]],
    [[-18.48, 4.12, 6.24, -16.4, 6.21, 4.92, -16.42, 6.82, 4.53, -33.45, 6.88, 4.47, -33.3, 5.58, 5.29, -33.17, 4.5, 5.97, -30.4, 1.91, 7.61, -20.74, 1.91, 7.63, -20.39, 1.55, 7.86, -19.98, 2.1, 7.51]],
    [[-6.87, -0.2, 12.28, -3.83, -0.11, 12.31, -3.87, 2.86, 10.31, -6.74, 2.85, 10.23, -6.79, 1.66, 11.03]],
    [[-6.74, 2.85, 14.24, -7.04, 2.85, 14.24, -7.06, 6.79, 11.45, -15.79, 6.82, 11.48, -16.4, 6.21, 11.92, -16.28, 1.71, 15.1, -6.79, 1.66, 15.07]],
    [[-3.83, -0.11, 12.31, -6.87, -0.2, 12.28, -6.99, -3.07, 11.42, -3.81, -3.06, 11.42]],
    [[-17.29, 13.45, 10.23, -8.26, 13.51, 10.23, -8.1, 13.51, 10.23, -4.24, 13.53, 10.24, -4.23, 11.53, 9.23, -2.23, 11.53, 9.23, -1.76, 12.0, 9.46, -1.78, 18.76, 12.85, -45.52, 18.62, 12.88, -46.31, 13.83, 10.49, -46.04, 13.79, 10.47, -46.04, 13.1, 10.13, -45.03, 13.1, 10.12, -44.63, 12.84, 9.99, -43.86, 13.5, 10.32, -38.86, 13.54, 10.32, -37.46, 13.55, 10.33, -37.57, 13.1, 10.1, -18.51, 13.09, 10.05, -18.31, 13.87, 10.44]],
    [[-8.29, 9.78, 12.04, -9.42, 9.78, 12.04, -19.35, 9.8, 12.05, -38.99, 9.85, 12.09, -39.01, 9.11, 11.62, -37.89, 8.36, 11.14, -34.4, 6.25, 9.81, -33.3, 5.58, 9.39, -33.45, 6.88, 10.21, -16.42, 6.82, 10.17, -16.4, 6.21, 9.78, -15.79, 6.82, 10.17, -7.06, 6.79, 10.15, -7.07, 10.16, 12.27, -7.63, 10.19, 12.3, -8.27, 10.2, 12.3]],
    [[-38.96, 10.64, 11.6, -38.99, 9.85, 12.09, -19.35, 9.8, 12.05, -19.22, 10.32, 11.74, -19.06, 10.92, 11.37, -19.36, 10.94, 11.36, -18.73, 12.23, 10.57, -18.51, 13.09, 10.05, -37.57, 13.1, 10.1, -38.17, 10.77, 11.53, -38.72, 10.78, 11.52]],
    [[-40.33, 10.56, 12.1, -40.35, 10.0, 12.09, -40.7, 1.38, 11.96, -36.22, -2.08, 10.22, -35.24, -2.83, 9.84, -35.08, -2.68, 9.79, -35.0, -1.69, 9.79, -34.4, 6.25, 9.81, -37.89, 8.36, 11.14, -39.01, 9.11, 11.58, -38.99, 9.85, 11.59, -38.96, 10.64, 11.6, -38.96, 10.78, 11.61, -39.63, 10.79, 11.85, -39.86, 10.8, 11.94]],
    [[-35.71, 35.54, 8.51, -38.76, 35.49, 8.5, -38.74, 35.39, 8.56, -38.49, 34.05, 9.37, -37.99, 34.05, 9.38]],
    [[-19.82, -61.67, 18.55, -14.41, -61.47, 18.56, -14.25, -59.98, 18.56, -14.01, -57.61, 18.56, -13.96, -57.07, 18.56, -14.61, -56.74, 18.56, -14.61, -55.54, 18.56, -16.97, -55.54, 18.55, -17.58, -55.23, 18.55, -18.35, -55.54, 18.55, -20.66, -56.47, 18.55, -19.48, -57.61, 18.55, -19.64, -59.49, 18.55, -20.64, -60.35, 18.54, -19.73, -60.61, 18.55], [-15.93, -57.61, 18.55, -16.89, -59.88, 18.55, -18.76, -59.56, 18.55, -18.43, -58.61, 18.55, -19.02, -58.04, 18.55, -17.47, -57.06, 18.55]],
    [[-38.9, 36.21, 8.43, -39.52, 36.2, 8.43, -39.42, 34.74, 8.43, -38.74, 35.39, 8.43, -38.76, 35.49, 8.43]],
    [[-27.54, 41.65, 8.26, -27.53, 41.89, 8.4, -27.49, 42.74, 8.92, -26.81, 45.65, 10.68, -26.9, 46.03, 10.91, -39.08, 45.97, 10.9, -38.97, 41.87, 8.42, -38.95, 41.36, 8.11, -37.41, 41.37, 8.11, -37.73, 41.62, 8.26]],
    [[-39.37, 34.05, 10.63, -39.12, 30.5, 8.44, -39.09, 29.99, 8.12, -38.84, 30.09, 8.18, -35.78, 30.1, 8.18, -27.32, 30.14, 8.19, -27.06, 30.14, 8.19, -27.14, 30.81, 8.6, -27.48, 33.76, 10.43, -27.9, 34.08, 10.63, -37.99, 34.05, 10.63, -38.49, 34.05, 10.63]],
    [[-38.66, 28.48, 10.62, -40.81, 24.68, 8.45, -27.81, 24.62, 8.44, -25.42, 25.13, 8.73, -25.43, 29.0, 10.93, -27.28, 28.98, 10.92, -27.65, 29.03, 10.95, -30.21, 28.94, 10.89, -31.91, 28.92, 10.88, -31.85, 29.12, 10.99, -39.02, 28.99, 10.91, -38.98, 28.48, 10.62]],
    [[-37.97, -55.53, 21.14, -37.73, -68.63, 21.13, -35.04, -68.58, 21.13, -35.06, -68.53, 21.13, -34.78, -68.58, 21.13, -14.59, -68.22, 21.15, -14.6, -62.07, 21.16, -14.47, -62.11, 21.16, -14.41, -61.47, 21.16, -19.82, -61.67, 21.15, -19.73, -60.61, 21.15, -20.64, -60.35, 21.15, -19.64, -59.49, 21.15, -19.48, -57.61, 21.16, -20.66, -56.47, 21.16, -18.35, -55.54, 21.16], [-33.68, -60.71, 21.14, -35.56, -61.01, 21.14, -36.42, -57.43, 21.14, -34.18, -56.93, 21.14], [-35.84, -64.62, 21.14, -36.15, -63.07, 21.14, -33.74, -63.02, 21.14, -33.45, -66.61, 21.14, -36.14, -66.74, 21.13]],
    [[-6.04, -41.68, 5.33, -5.74, -39.84, 6.6, -5.81, -39.65, 6.74, -6.4, -37.93, 7.94, -48.89, -38.2, 7.98, -48.61, -40.44, 6.42, -48.42, -41.93, 5.39]],
    [[-8.27, 10.2, 11.84, -8.1, 13.51, 10.23, -8.26, 13.51, 10.23, -10.29, 11.93, 10.99, -13.86, 10.8, 11.53, -15.35, 12.66, 10.62, -15.94, 12.9, 10.5, -17.81, 10.84, 11.49, -19.06, 10.92, 11.45, -19.22, 10.32, 11.74, -19.35, 9.8, 11.99, -9.42, 9.78, 12.04, -8.29, 9.78, 12.04]],
    [[-8.1, 13.51, 14.12, -8.27, 10.2, 14.08, -7.63, 10.19, 14.08, -7.07, 10.16, 14.08, -7.08, 10.39, 14.08, -4.73, 10.4, 14.08, -4.73, 11.53, 14.1, -4.23, 11.53, 14.1, -4.24, 13.53, 14.12]],
    [[-16.01, -34.16, 5.22, -16.52, -33.98, 5.09, -50.01, -34.17, 5.11, -49.82, -34.57, 5.39, -49.18, -35.89, 6.33, -48.89, -38.2, 7.98, -6.4, -37.93, 7.94, -6.49, -37.69, 7.76, -6.48, -37.54, 7.66, -13.28, -35.13, 5.92, -14.28, -34.78, 5.66, -14.7, -34.14, 5.21, -15.06, -34.14, 5.21]],
    [[-15.1, -32.29, 11.34, -15.09, -32.96, 11.35, -15.28, -32.96, 11.35, -15.06, -34.14, 11.36, -14.7, -34.14, 11.36, -14.28, -34.78, 11.37, -13.28, -35.13, 11.37, -6.41, -35.12, 11.4, -3.8, -35.12, 11.41, -4.01, -39.46, 11.44, -4.03, -39.9, 11.45, -4.22, -40.17, 11.45, -4.21, -40.87, 11.46, -4.08, -40.99, 11.46, -4.11, -41.73, 11.46, -3.59, -41.74, 11.47, -3.07, -41.93, 11.47, -1.9, -42.98, 11.48, -1.77, -41.65, 11.47, -0.85, -41.65, 11.47, -0.69, -41.8, 11.48, 6.16, -42.01, 11.5, 6.12, -34.02, 11.43, 6.82, -34.01, 11.44, 5.57, -20.32, 11.32, 5.63, -20.32, 11.32, 5.59, -19.94, 11.31, -15.13, -20.28, 11.24, -15.13, -20.71, 11.24, -15.43, -20.71, 11.24, -15.43, -21.46, 11.25, -15.13, -21.46, 11.25, -15.12, -22.69, 11.26, -15.45, -22.69, 11.26, -15.4, -32.29, 11.34], [-2.6, -25.4, 11.33, -2.62, -25.52, 11.33, -2.85, -28.06, 11.35, -5.33, -26.61, 11.33, -4.28, -25.36, 11.32, -4.21, -23.53, 11.31, -2.43, -23.72, 11.32]],
    [[-35.57, 39.97, 10.79, -35.98, 39.75, 10.66, -36.04, 39.71, 10.64, -39.56, 39.66, 10.64, -38.9, 36.21, 8.43, -38.76, 35.49, 7.97, -35.71, 35.54, 7.97, -29.93, 35.64, 7.98, -29.13, 35.66, 7.99, -28.85, 36.33, 8.41, -27.08, 36.35, 8.41, -26.89, 39.85, 10.64, -27.63, 39.84, 10.64, -35.26, 39.73, 10.64]],
    [[-43.2, 6.53, 11.12, -41.81, 6.14, 11.59, -41.79, 5.13, 11.6, -42.75, 4.88, 11.27, -47.14, 4.63, 9.79, -47.15, 3.1, 9.78, -46.14, 3.1, 10.12, -46.17, -2.48, 10.1, -45.9, -2.47, 10.2, -45.57, -2.22, 10.31, -40.7, 1.38, 11.96, -40.35, 10.0, 12.09, -44.63, 12.84, 10.65, -45.03, 13.1, 10.51, -46.04, 13.1, 10.17, -46.07, 8.28, 10.15, -47.12, 8.29, 9.8, -47.13, 6.61, 9.79]],
    [[-16.18, -1.91, 4.76, -16.28, 1.71, 4.81, -16.4, 6.21, 4.88, -18.48, 4.12, 6.19, -19.98, 2.1, 7.15, -19.65, 1.91, 6.94, -19.04, 1.91, 6.55, -18.68, 1.33, 6.33, -17.69, 0.74, 5.7, -18.17, -0.71, 6.01, -17.89, -0.99, 5.83]],
    [[-16.28, 1.71, 15.1, -16.18, -1.91, 12.47, -16.16, -2.7, 11.91, -16.07, -2.85, 11.8, -15.84, -3.08, 11.63, -15.73, -3.08, 11.63, -10.77, -3.08, 11.64, -6.99, -3.07, 11.64, -6.87, -0.2, 13.72, -6.79, 1.66, 15.07]],
    [[-57.41, -19.64, 19.18, -59.66, -19.68, 16.05, -60.25, -19.7, 15.23, -60.22, -26.73, 15.3, -60.0, -26.73, 15.61, -60.0, -26.95, 15.61, -59.34, -26.95, 16.53, -59.34, -26.73, 16.53, -58.49, -26.73, 17.71, -58.48, -27.84, 17.73, -57.81, -27.86, 18.67, -56.62, -27.9, 20.32, -56.62, -19.73, 20.27, -56.68, -19.62, 20.19, -57.0, -19.19, 19.75]],
    [[-58.19, -15.77, 21.87, -58.96, -15.93, 22.19, -59.26, -16.13, 22.4, -58.2, -17.56, 22.94, -56.34, -17.69, 22.48, -56.34, -17.26, 22.22, -57.12, -15.97, 21.68, -56.97, -15.76, 21.51]],
    [[-60.25, -19.7, 21.57, -59.66, -19.68, 21.92, -58.2, -17.56, 22.94, -59.26, -16.13, 22.4, -59.62, -16.36, 22.16, -60.07, -17.01, 21.85, -60.25, -17.77, 21.69]],
    [[-59.66, -19.68, 21.92, -57.41, -19.64, 21.48, -57.0, -19.19, 21.67, -56.31, -18.46, 21.99, -56.36, -18.42, 22.02, -56.34, -17.69, 22.48, -58.2, -17.56, 22.94]],
    [[-2.29, 24.58, 9.99, -23.38, 24.52, 10.01, -23.38, 24.59, 9.97, -25.42, 24.6, 9.96, -25.42, 25.13, 9.71, -27.81, 24.62, 9.96, -40.81, 24.68, 9.91, -44.41, 24.7, 9.9, -44.44, 24.5, 10.0, -44.55, 24.51, 9.99, -45.52, 18.62, 12.88, -1.78, 18.76, 12.85, -1.79, 24.69, 9.94, -2.29, 24.69, 9.94]],
    [[-6.49, -45.19, 7.91, -6.54, -44.87, 7.68, -6.04, -41.68, 5.33, -48.42, -41.93, 5.39, -48.32, -42.75, 5.99, -48.55, -43.43, 6.49, -49.25, -45.45, 7.97]],
    [[-40.35, 10.0, 12.09, -40.33, 10.56, 11.81, -39.86, 10.8, 11.69, -39.63, 10.79, 11.7, -39.59, 11.43, 11.38, -38.93, 11.48, 11.35, -38.86, 13.54, 10.32, -43.86, 13.5, 10.32, -44.63, 12.84, 10.65]],
    [[-58.2, -79.39, 19.09, -58.19, -79.84, 19.1, -55.07, -79.81, 19.12, -55.07, -79.4, 19.12, -55.09, -75.42, 19.09, -57.72, -75.92, 19.07, -57.44, -79.39, 19.1]],
    [[-35.57, 39.97, 9.29, -35.26, 39.73, 9.44, -27.63, 39.84, 9.38, -27.55, 41.42, 8.4, -27.54, 41.65, 8.26, -37.73, 41.62, 8.26, -37.41, 41.37, 8.41]],
    [[-36.04, 39.71, 10.66, -35.98, 39.75, 10.66, -35.57, 39.97, 10.65, -37.41, 41.37, 10.64, -38.95, 41.36, 10.63, -39.83, 41.36, 10.63, -40.01, 41.87, 10.62, -41.69, 41.86, 10.62, -41.74, 41.59, 10.62, -41.58, 41.54, 10.62, -42.96, 33.64, 10.68, -43.08, 33.66, 10.68, -43.25, 32.63, 10.69, -43.15, 32.6, 10.69, -43.43, 30.87, 10.7, -39.95, 34.23, 10.69, -39.38, 34.13, 10.69, -39.37, 34.05, 10.69, -38.49, 34.05, 10.69, -38.74, 35.39, 10.68, -39.42, 34.74, 10.69, -39.52, 36.2, 10.67, -38.9, 36.21, 10.67, -39.56, 39.66, 10.64]],
    [[-8.26, 13.51, 12.32, -17.29, 13.45, 12.43, -18.31, 13.87, 12.44, -18.51, 13.09, 12.44, -18.73, 12.23, 12.44, -19.36, 10.94, 12.44, -19.06, 10.92, 12.44, -17.81, 10.84, 12.42, -15.94, 12.9, 12.41, -15.35, 12.66, 12.4, -13.86, 10.8, 12.37, -10.29, 11.93, 12.34]],
    [[-40.81, 24.68, 8.45, -38.66, 28.48, 8.44, -38.98, 28.48, 8.44, -39.02, 28.99, 8.44, -39.07, 29.8, 8.44, -39.09, 29.99, 8.44, -39.12, 30.5, 8.44, -39.37, 34.05, 8.43, -39.38, 34.13, 8.43, -39.95, 34.23, 8.43, -43.43, 30.87, 8.45, -44.41, 24.7, 8.46]],
    [[-37.18, -18.25, 18.65, -36.33, -18.02, 18.65, -34.97, -18.23, 18.64, -34.99, -15.43, 18.65, -55.05, -15.57, 18.69, -55.05, -15.74, 18.69, -56.97, -15.76, 18.69, -57.12, -15.97, 18.69, -56.34, -17.26, 18.69, -56.34, -17.69, 18.69, -56.36, -18.42, 18.68, -56.31, -18.46, 18.68, -55.5, -19.0, 18.68, -55.45, -27.94, 18.66, -56.62, -27.9, 18.66, -57.81, -27.86, 18.67, -58.48, -27.84, 18.67, -58.47, -33.2, 18.66, -58.55, -36.54, 18.65, -51.56, -36.96, 18.63, -51.67, -34.18, 18.64, -50.01, -34.17, 18.64, -50.49, -33.15, 18.64, -51.64, -33.16, 18.64, -51.68, -26.7, 18.66, -39.1, -26.63, 18.63, -39.15, -21.77, 18.64, -44.21, -20.14, 18.66]],
    [[-36.33, -18.02, 21.32, -37.18, -18.25, 21.32, -37.96, -20.66, 21.34, -39.16, -20.65, 21.34, -39.15, -21.77, 21.34, -39.1, -26.63, 21.38, -35.23, -26.61, 21.37, -35.27, -19.42, 21.33, -34.97, -19.42, 21.33, -34.97, -18.23, 21.32]],
    [[-54.52, -79.6, 16.85, -54.53, -76.73, 16.85, 0.99, -76.43, 16.81, 0.99, -76.5, 16.81, 1.39, -76.5, 16.81, 1.39, -76.43, 16.81, 4.89, -76.41, 16.81, 4.89, -76.61, 16.81, 5.26, -76.61, 16.81, 5.26, -76.41, 16.81, 8.24, -76.4, 16.8, 8.24, -76.32, 16.8, 8.38, -76.32, 16.8, 8.25, -43.21, 16.78, 6.16, -43.22, 16.78, 6.16, -42.01, 16.78, -0.69, -41.8, 16.78, -0.85, -41.65, 16.78, -1.77, -41.65, 16.78, -1.9, -42.98, 16.79, -3.07, -41.93, 16.79, -3.59, -41.74, 16.79, -4.11, -41.73, 16.79, -4.13, -42.11, 16.79, -4.19, -42.1, 16.79, -4.17, -42.94, 16.79, -4.22, -43.92, 16.79, -4.95, -45.18, 16.79, -4.28, -45.18, 16.79, -4.34, -46.54, 16.79, -4.47, -46.6, 16.79, -4.35, -46.61, 16.79, -4.45, -48.84, 16.79, -5.93, -48.92, 16.79, -7.13, -48.96, 16.79, -7.07, -48.85, 16.79, -30.66, -49.07, 16.81, -31.53, -49.09, 16.81, -47.96, -49.24, 16.82, -47.88, -49.71, 16.82, -53.35, -49.81, 16.83, -53.35, -46.56, 16.83, -49.6, -46.47, 16.82, -49.25, -45.45, 16.82, -51.22, -45.46, 16.82, -51.43, -40.14, 16.82, -51.56, -36.96, 16.82, -58.55, -36.54, 16.82, -58.47, -33.2, 16.82, -58.58, -33.2, 16.82, -58.56, -36.39, 16.82, -61.05, -36.4, 16.82, -60.83, -76.77, 16.85, -58.21, -76.75, 16.85, -58.2, -79.39, 16.85, -57.44, -79.39, 16.85, -57.72, -75.92, 16.85, -55.09, -75.42, 16.85, -55.07, -79.4, 16.85, -54.87, -79.61, 16.85], [-14.61, -56.74, 16.8, -13.96, -57.07, 16.8, -14.01, -57.61, 16.81, 0.33, -57.67, 16.79, 1.71, -49.97, 16.79, -0.35, -49.97, 16.79, -4.06, -49.96, 16.79, -4.11, -46.61, 16.79, -0.55, -46.71, 16.79, 3.39, -46.82, 16.78, 3.24, -59.72, 16.79, -14.25, -59.98, 16.81, -14.41, -61.47, 16.81, -14.47, -62.11, 16.81, -14.6, -62.07, 16.81, -14.59, -68.22, 16.81, -34.78, -68.58, 16.83, -35.06, -68.53, 16.83, -35.04, -68.58, 16.83, -37.73, -68.63, 16.83, -37.97, -55.53, 16.82, -18.35, -55.54, 16.81, -17.58, -55.23, 16.81, -16.97, -55.54, 16.81, -14.61, -55.54, 16.8]],
    [[-6.54, -44.87, 5.33, -6.49, -45.19, 5.34, -6.18, -47.3, 5.36, -7.07, -48.85, 5.35, -7.13, -48.96, 5.35, -5.93, -48.92, 5.37, -4.45, -48.84, 5.41, -4.35, -46.61, 5.4, -4.47, -46.6, 5.39, -4.34, -46.54, 5.4, -4.28, -45.18, 5.39, -4.95, -45.18, 5.37, -4.22, -43.92, 5.38, -4.17, -42.94, 5.38, -4.19, -42.1, 5.37, -4.13, -42.11, 5.37, -4.11, -41.73, 5.37, -4.08, -40.99, 5.36, -4.21, -40.87, 5.36, -4.22, -40.17, 5.36, -4.03, -39.9, 5.36, -4.01, -39.46, 5.36, -5.81, -39.65, 5.32, -5.74, -39.84, 5.32, -6.04, -41.68, 5.32]],
    [[-16.52, -33.98, 4.11, -16.01, -34.16, 4.12, -15.06, -34.14, 4.12, -15.28, -32.96, 4.08, -16.09, -32.97, 4.08, -16.1, -32.56, 4.07, -16.56, -32.56, 4.07, -16.55, -33.07, 4.08, -18.13, -33.08, 4.08, -18.37, -33.33, 4.09, -19.33, -32.98, 4.08, -50.49, -33.15, 4.05, -50.01, -34.17, 4.08]],
    [[-27.49, 42.74, 8.4, -27.53, 41.89, 8.4, -27.54, 41.65, 8.4, -27.55, 41.42, 8.4, -27.63, 39.84, 8.4, -26.89, 39.85, 8.4, -27.08, 36.35, 8.41, -28.85, 36.33, 8.41, -29.13, 35.66, 8.41, -29.93, 35.64, 8.42, -29.36, 35.2, 8.42, -25.43, 34.91, 8.41, -25.43, 29.0, 8.42, -25.42, 25.13, 8.43, -25.42, 24.6, 8.43, -23.38, 24.59, 8.43, -23.43, 48.08, 8.38, -27.5, 48.07, 8.39, -39.13, 47.94, 8.4, -39.13, 48.05, 8.4, -40.51, 48.04, 8.41, -41.46, 42.59, 8.42, -41.57, 42.61, 8.42, -41.69, 41.86, 8.42, -40.01, 41.87, 8.42, -39.83, 41.36, 8.42, -38.95, 41.36, 8.42, -38.97, 41.87, 8.42, -39.08, 45.97, 8.41, -26.9, 46.03, 8.39, -26.81, 45.65, 8.39]],
  ];
}

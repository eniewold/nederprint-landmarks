// Watertoren aan de Dokweg 35 in IJmuiden, gebouwd in 1914-1915 door Rijkswaterstaat voor de haven en de
// vissersschepen (rijksmonument 520707). Volgens het register 24,50 m hoog (Wikipedia 24,25 m): een open achthoekige
// onderbouw van acht gewapend betonnen pijlers rond een buizenkoker, op vier hoogtes met koppelbalken verbonden. Onderaan
// is de ruimte tot circa 3 m afgesloten (dienstlokalen; vierruits raam in het noordwesten, liggende tweeruits ramen in
// de overige zijden, deuren in de noordoost- en zuidmuur); het bovenste deel van de onderbouw (de lekvloer) is ook
// afgesloten, met een stolpraam in het midden van elke zijde, en aan de oostzijde uitgebouwd. Daarop een uitkragend
// cilindrisch reservoir van 11,25 m doorsnede en 600 m³ met een plat dak; de pijlers lopen er als lisenen langs omhoog,
// met een schuine console van de pijler naar de reservoirrand; tussen de lisenen rode baksteen met smalle vierruits
// ramen en bovenin kleine vierkante ramen.
//
// Oorsprong op het hart van het BAG-pand (cirkelfit op de zestien hoekpunten waar de pijlers de muren raken, RD
// [101145.46, 496882.48]) op het maaiveld, AHN-DTM NAP +4,45 (ring van 7 tot 12 m: +4,34 tot +4,58). De pijlers staan
// op RD 15,75 + 45k graden; lokale +X is de normaal van een gevelvlak (RD -6,75 graden, de oostgevel met de uitbouw).
// De achthoeken staan met hun hoekpunten (de pijlers) op 22,5 + 45k graden in het lokale stelsel.
// Maten: BAG-pand (muren op straal 4,8 m van het hart bij de pijlers, pijlervoeten 0,55 m breed tot 6,05 m); AHN-DSM
// 0,5 m (dak NAP +28,3, rand tot +29,4 op 5,5 tot 6,3 m); het register (reservoir 11,25 m); geledingen uit de foto's
// "Exterieur OVERZICHT - IJmuiden - 20284889 - RCE" (1993, waterpas, schaal op de breedte van het reservoir) en
// "Watertoren IJmuiden Dokweg" (pijlers, consoles, lekvloer, uitbouw en ramen).
import { hull, union, prism, box, place, circle, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [101145.46, 496882.48];
const DEG = -6.75;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 4.45;
const GROUND_ELLIPSOID = 47.32; // laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04 (47,32 tot 47,38)
const T22 = Math.tan(Math.PI / 8);
const C22 = Math.cos(Math.PI / 8);

// Achthoek met apothema a, hoekpunten (pijlers) op 22,5 + 45k graden.
const oct = (a, z) => Array.from({ length: 8 }, (_, k) => {
  const t = (Math.PI / 8) * (2 * k + 1);
  return [(a / C22) * Math.cos(t), (a / C22) * Math.sin(t), z];
});
const octPrism = (a, z0, z1) => prism(oct(a, 0).map(([x, y]) => [x, y]), z0, z1);
const ring = (r, z, n = 96) => circle([0, 0], r, n).map(([x, y]) => [x, y, z]);
const cyl = (r, z0, z1) => prism(circle([0, 0], r, 96), z0, z1);
const eight = (m, only) => Array.from({ length: 8 }, (_, k) => k).filter((k) => !only || only.includes(k)).map((k) => place(m, { deg: 45 * k }));
const atPillars = (m) => Array.from({ length: 8 }, (_, k) => place(m, { deg: 22.5 + 45 * k }));

const WALL = 4.45; // apothema van de muren van de dienstlokalen, de koppelbalken en de lekvloer (BAG: straal 4,8 bij de pijlers)
const R = {
  pillar: 4.9, // buitenvlak van de pijlers (radiaal), foto: silhouet 0,77 tot 0,82 van het reservoir
  pillarFoot: 6.05, // pijlervoeten in het BAG-pand
  reservoir: 5.625, // register: 11,25 m
  band: 5.75, // onder- en bovenrand van het reservoir
  pilaster: 6.1, // lisenen op het reservoir (AHN: rand tot 6,3 m)
  roof: 4.75, // binnenkant van de dakrand (AHN 5,2 tot 5,5; hier 0,9 m dik zodat de export de rand niet verdikt)
};
const H = {
  ground: 3.2, // dienstlokalen ("tot ongeveer drie meter")
  footTop: 2.6, // pijlervoet, daarboven 45 graden naar de pijler
  beams: [[7.95, 8.6], [11.3, 12.1]], // koppelbalken (foto 1993)
  storeyBand: [14.1, 14.8], // vloerbalk van de lekvloer
  storeyWin: [15.0, 15.8], // stolpramen (nis tot onder de schuine onderkant van het reservoir)
  soffit: 16.3, // begin van de schuine onderkant van het reservoir (51 graden midden op een vlak)
  reservoir: 17.9, // onderkant reservoir (foto 1993: 7,0 m onder de rand)
  bracket: 16.25, // console van de pijler naar de lisene, 50 graden
  bottomBand: 18.4,
  tallWin: [20.0, 21.5],
  smallWin: [22.6, 23.25], // foto circa 23,0 tot 23,6; lager zodat de nis onder het dak blijft en de rand niet verdikt wordt
  topBand: [24.2, 24.35],
  roof: 23.85, // AHN: NAP +28,3
  top: 24.9, // AHN: rand NAP +29,35
};
const PILLAR_HALF = 0.45; // pijlers 0,9 m breed (BAG-voeten 0,55 m, foto circa 0,8 m; 0,9 m om te printen)
const PILASTER_HALF = 0.55; // lisenen 1,1 m breed (foto 1993)
const RECESS = 1.3; // diepte van de open vakken tussen pijlers en balken

// Nis in het vlak met normaal +X op afstand f: breedte wd, z0 tot z1, diepte d, plafond onder 63 graden naar binnen.
const niche = (f, wd, z0, z1, depth, y = 0) => {
  const y0 = y - wd / 2, y1 = y + wd / 2, za = z1 + 2 * depth;
  return hull([
    [f - depth, y0, z0], [f + 1.0, y0, z0], [f - depth, y1, z0], [f + 1.0, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + 1.0, y0, z1 - 1.5], [f + 1.0, y1, z1 - 1.5],
  ]);
};
// Open vak tussen twee pijlers (vlak met normaal +X) van z0 tot z1: voorvlak op WALL, achterwand RECESS dieper, plafond
// onder 50 graden; zijkanten blijven een halve pijlerbreedte van de stralen naar de pijlers.
const halfAt = (a) => a * T22 - PILLAR_HALF / C22;
const recess = (z0, z1) => {
  const ab = WALL - RECESS, ao = WALL + 1.2;
  return hull([
    [ab, -halfAt(ab), z0], [ab, halfAt(ab), z0], [ab, -halfAt(ab), z1 - 1.2 * RECESS], [ab, halfAt(ab), z1 - 1.2 * RECESS],
    [WALL, -halfAt(WALL), z0], [WALL, halfAt(WALL), z0], [WALL, -halfAt(WALL), z1], [WALL, halfAt(WALL), z1],
    [ao, -halfAt(ao), z0], [ao, halfAt(ao), z0], [ao, -halfAt(ao), z1], [ao, halfAt(ao), z1],
  ]);
};
// Profiel (r, z) als prisma langs de straal +X met halve breedte w.
const radial = (pts, w) => hull(pts.flatMap(([r, z]) => [[r, -w, z], [r, w, z]]));

// ---------- onderbouw: dienstlokalen, koppelbalken, open vakken en lekvloer ----------
const core = octPrism(WALL, BASE, H.soffit + 0.01);
const storeyBand = hull([...oct(WALL, H.storeyBand[0] - 0.25), ...oct(WALL + 0.15, H.storeyBand[0]), ...oct(WALL + 0.15, H.storeyBand[1])]);
const BAY = 0; // uitbouw aan de oostzijde (lokale +X)
const OPEN = [[H.ground, H.beams[0][0]], [H.beams[0][1], H.beams[1][0]], [H.beams[1][1], H.storeyBand[0] - 0.25]];
const openings = union([
  ...eight(recess(...OPEN[0])),
  ...eight(recess(...OPEN[1])),
  ...eight(recess(...OPEN[2]), [1, 2, 3, 4, 5, 6, 7]),
]);
// Dienstlokalen: deuren in de noordoost- (k=1) en zuidmuur (k=6), vierruits raam in het noordwesten (k=3), liggende
// tweeruits ramen in de overige muren (in het echt circa 0,7 m hoog, hier 0,9 m).
const groundNiches = union([
  ...eight(niche(WALL, 1.1, 0, 2.3, 0.35), [1, 6]),
  ...eight(niche(WALL, 1.6, 1.0, 2.3, 0.3), [3]),
  ...eight(niche(WALL, 1.4, 1.3, 2.2, 0.3), [0, 2, 4, 5, 7]),
]);
// Lekvloer: een stolpraam per zijde (de uitbouw heeft er een aan de voorkant).
const storeyNiches = union(eight(niche(WALL, 0.9, H.storeyWin[0], H.storeyWin[1], 0.25), [1, 2, 3, 4, 5, 6, 7]));
const understructure = union([core, storeyBand]).subtract(union([openings, groundNiches, storeyNiches]));

// Uitbouw aan de oostzijde van de lekvloer: tussen de pijlers tot 5,5 m, onderkant onder 50 graden.
const BAY_OUT = 5.5, BAY_HALF = 1.35, BAY_LOW = 13.3;
const bay = hull([
  [WALL - 0.2, -BAY_HALF, BAY_LOW - 1.2 * (BAY_OUT - WALL + 0.2)], [WALL - 0.2, BAY_HALF, BAY_LOW - 1.2 * (BAY_OUT - WALL + 0.2)],
  [BAY_OUT, -BAY_HALF, BAY_LOW], [BAY_OUT, BAY_HALF, BAY_LOW],
  [BAY_OUT, -BAY_HALF, H.reservoir + 0.05], [BAY_OUT, BAY_HALF, H.reservoir + 0.05],
  [WALL - 0.2, -BAY_HALF, H.reservoir + 0.05], [WALL - 0.2, BAY_HALF, H.reservoir + 0.05],
]).subtract(niche(BAY_OUT, 0.9, H.storeyWin[0], H.storeyWin[1], 0.25));

// ---------- pijlers met voeten, consoles en lisenen ----------
// Pijler: van 3,0 m (in de kern) tot 4,9 m; voet tot 6,05 m (BAG) met een bovenkant van 45 graden; console onder 50
// graden van de pijler naar de lisene; lisene 1,1 m breed tot de rand, onderkant schuin naar de console.
const pillar = union([
  radial([[3.0, BASE], [R.pillar, BASE], [R.pillar, H.bracket], [R.pilaster, H.bracket + 1.2 * (R.pilaster - R.pillar)], [R.pilaster, H.reservoir + 0.1], [3.0, H.reservoir + 0.1]], PILLAR_HALF),
  radial([[4.4, BASE], [R.pillarFoot, BASE], [R.pillarFoot, H.footTop], [R.pillar - 0.05, H.footTop + (R.pillarFoot - R.pillar + 0.05)], [4.4, H.footTop + (R.pillarFoot - R.pillar + 0.05)]], PILLAR_HALF),
  hull([
    ...[[R.reservoir - 0.3, H.reservoir - 0.15], [R.pilaster, H.reservoir - 0.15]].flatMap(([r, z]) => [[r, -PILLAR_HALF, z], [r, PILLAR_HALF, z]]),
    ...[[R.reservoir - 0.3, H.reservoir], [R.pilaster, H.reservoir], [R.reservoir - 0.3, H.top], [R.pilaster, H.top]].flatMap(([r, z]) => [[r, -PILASTER_HALF, z], [r, PILASTER_HALF, z]]),
  ]),
]);
const pillars = union(atPillars(pillar));

// ---------- reservoir ----------
// Schuine onderkant van de lekvloermuren (achthoek 4,45 op 16,3 m) naar de onderrand (5,75 op 17,9 m): 51 graden midden
// op een vlak, steiler bij de pijlers. Onderrand tot 18,4 m, mantel 5,625 m, bovenrand 5,75 m vanaf 24,35 m (onderkant
// 45 graden), dak verdiept tot 23,85 m binnen een rand van 0,9 m.
const soffit = hull([...oct(WALL, H.soffit), ...ring(R.band, H.reservoir)]);
const shell = union([
  soffit,
  cyl(R.band, H.reservoir - 0.01, H.bottomBand),
  cyl(R.reservoir, H.bottomBand - 0.01, H.topBand[0] + 0.01),
  hull([...ring(R.reservoir, H.topBand[0]), ...ring(R.band, H.topBand[1]), ...ring(R.band, H.top)]),
]);
// Ramen per vak tussen de lisenen (op 0 + 45k graden): smal vierruits (in het echt circa 0,5 m breed, hier 0,7 m) en
// bovenin een klein vierkant raam.
const reservoirNiches = union([
  ...eight(niche(R.reservoir, 0.7, H.tallWin[0], H.tallWin[1], 0.3)),
  ...eight(niche(R.reservoir, 0.7, H.smallWin[0], H.smallWin[1], 0.25)),
]);
const roofPool = cyl(R.roof, H.roof, H.top + 1);

const building = union([understructure, place(bay, { deg: 45 * BAY }), pillars, shell])
  .subtract(union([reservoirNiches, roofPool]));

await writeLandmark({
  slug: "watertoren-ijmuiden-dokweg",
  base: BASE,
  nodes: [["building:achtkante-onderbouw-pijlers-en-reservoir", building]],
  catalog: {
    name: "Watertoren Dokweg IJmuiden",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7.5, 0], [0, 7.5], [5.3, 5.3], [5.3, -5.3]],
    // Ellipsoïdisch: de PDOK-terreinhoogte rond de voet (aan de zuidwestkant staat een bedrijfspand tegen de toren).
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0453100000003509"],
    description:
      "Oorsprong op het hart van het achthoekige BAG-pand op het maaiveld (NAP +4,45 m), +X de normaal van de oostgevel (RD -6,75 graden), pijlers op 22,5 + 45k graden. Dienstlokalen tot 3,2 m met deuren en ramen als nissen, acht pijlers met voeten, koppelbalken op 8 en 11,3 m met diepe vakken (in het echt open), lekvloer met stolpramen en een uitbouw aan de oostzijde, schuine onderkant en consoles naar het reservoir van 11,25 m met acht lisenen, ramen, onder- en bovenrand tot 24,9 m en een verdiept plat dak. Maten uit BAG, AHN, register en foto's.",
    realWorld: {
      publishedHeightM: [24.25, 24.5],
      reservoirM3: 600,
      reservoirDiameterM: 11.25,
      built: 1915,
      architect: "Rijkswaterstaat",
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 28.3,
      ahnRimNapM: 29.35,
      wallAcrossFacesM: WALL * 2,
      pillarOuterRadiusM: R.pillar,
      pillarFootRadiusM: R.pillarFoot,
      servicesTopM: H.ground,
      beamsM: H.beams,
      storeyM: [H.storeyBand[0], H.reservoir],
      reservoirM: [H.reservoir, H.top],
      roofM: H.roof,
      minimumPartM: 0.8,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/520707 (1914-1915, 24,50 m, acht pijlers, koppelbalken, dienstlokalen, lekvloer met uitbouw, reservoir 11,25 m, ramen, plat dak)",
      "https://nl.wikipedia.org/wiki/Watertoren_(IJmuiden_Dokweg)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_IJmuiden_-_20284889_-_RCE.jpg (1993, waterpas: hoogtes van reservoir, lekvloer en koppelbalken, verhouding pijlers/reservoir)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_IJmuiden_Dokweg.jpg (pijlers, consoles, lekvloer, uitbouw en ramen)",
      "PDOK BAG-pand 0453100000003509, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
    ],
  },
});

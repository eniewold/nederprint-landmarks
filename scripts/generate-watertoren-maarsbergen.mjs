// Watertoren van Maarsbergen op het terrein van Valkenheide (jeugdinrichting, nu deels museum), aan de rand van de
// Maarsbergse bossen. Gebouwd in 1960 naar ontwerp van N.B. Goudzwaard, volgens Wikipedia 30 m hoog met één reservoir
// van 40 m³; gemeentelijk monument. Een slanke vierkante bakstenen schacht van 5,4 m zonder uitkragend reservoir, met
// op elke gevel een blauwe klok, bovenaan een kroon met zeven lichte (wit-geblokte) velden per gevel tussen bakstenen
// penanten, twee lichte lijnen eronder en een dekzerk; op het dak achter de borstwering een achtkante glazen lantaarn
// met rood kozijnwerk en een koperen kapje (met antennes).
//
// De toren is geen eigen BAG-pand: hij staat in pand 1581100000011158 (bouwjaar 1912), samen met het museumgebouw
// (wit gepleisterd, mansardedak met dakkapellen), een verbindingsgang, een laag blok van circa 5 m rond de voet van de
// toren en een lange lage vleugel naar het oosten. Het model vervangt daarom het hele pand: de toren gedetailleerd,
// de rest als eenvoudige blokken en dakvlakken op AHN-hoogtes.
//
// Oorsprong op het hart van de toren op het maaiveld: AHN-DTM NAP +8,33 (vlak terrein, 8,31 tot 8,51 rond het pand).
// +X wijst naar RD-richting 17,47 graden (evenwijdig aan de BAG-gevels), +Y naar 107,47 graden. Maten: gevels uit de
// BAG; torenbreedte uit BAG (west- en zuidgevel van de toren zijn hoeken van het pand), AHN-DSM 0,5 m en luchtfoto
// (5,4 m); borstwering NAP +38,65 (30,3 m), dak binnen de borstwering NAP +37,65, lantaarn tot NAP +41,85 (33,5 m);
// lage delen en museumdak uit het AHN-DSM en de 3D BAG (dakvlakken van dit pand). Kroon, klok, deur en lantaarn uit de
// foto's "Maarsbergen Watertoren 9588.JPG" (2006, 52 px/m in de kroon) en "Maarsbergen Valkenheide Watertoren.jpg"
// (2016, vanaf het binnenterrein in het noorden); museum uit "Maarsbergen Valkenheide Museum.jpg" (2016).
import { hull, union, box, prism, place, rect, circle, Manifold, CrossSection, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [157151.89, 450247.48];
const AXIS_DEG = 17.47;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 8.33;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: zuidwest van de toren
// 51,59, zuid van het museum 51,60, zuid van de toren 51,78, zuid van het lage blok 51,84 (het erf loopt iets op naar
// het oosten; AHN-DTM 8,31 tot 8,51).
const GROUND_ELLIPSOID = 51.59;

// BAG-pand 1581100000011158 in het lokale stelsel (PDOK BAG-WFS, 2026-11-06).
const BAG = [[-14.27, 22.5], [-15.67, 22.5], [-15.68, 23.93], [-31.31, 23.93], [-31.31, 4.78], [-15.67, 4.78], [-15.67, 9.44], [-8.96, 9.44], [-8.96, -0.27], [-2.7, -0.27], [-2.71, -2.71], [9.3, -2.7], [9.3, 1.77], [26.01, 1.77], [26.01, 8.14], [6.24, 8.14], [6.24, 7.06], [4.52, 7.06], [4.52, 10.05], [-5.82, 10.05], [-5.82, 13.16], [-8.73, 13.16], [-8.73, 22.5]];

// ---------- hulpvormen ----------
// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar
// binnen onder 63 graden op, buiten de gevel loopt de snede schuin af (zoals bij Bunnik).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [f + 1, -w / 2, z0], [a, w / 2, z0], [f + 1, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [f + 1, -w / 2, zb], [f + 1, w / 2, zb]]).translate([0, y, 0]);
};
// Gevelrichtingen: draaihoek; s is de modelcoördinaat langs de gevel (Y bij +X/-X, X bij +Y/-Y).
const DIRS = { "+x": { deg: 0, s: (s) => s }, "+y": { deg: 90, s: (s) => -s }, "-x": { deg: 180, s: (s) => -s }, "-y": { deg: -90, s: (s) => s } };
// f is de afstand van de gevel tot de oorsprong langs de normaal (bij -x en -y dus de positieve waarde).
const win = (dir, f, s, w, z0, z1, depth = 0.3) => place(niche(f, w, z0, z1, depth, DIRS[dir].s(s)), { deg: DIRS[dir].deg });
// Klok: schijf van straal r rond (s, zc) die 0,1 m voor de gevel staat, met een rand van 52 graden (printbaar zonder steun).
const clock = (dir, f, s, zc, r) => {
  const ring = (x, rr) => Array.from({ length: 24 }, (_, k) => {
    const t = (2 * Math.PI * k) / 24;
    return [x, DIRS[dir].s(s) + rr * Math.cos(t), zc + rr * Math.sin(t)];
  });
  return place(hull([...ring(f - 0.05, r), ...ring(f, r), ...ring(f + 0.1, r - 0.13)]), { deg: DIRS[dir].deg });
};
// Rand rond een rechthoek [-h, h]² op hoogte z, d uit de gevel.
const sq = (h, d, z) => [[-h - d, -h - d, z], [h + d, -h - d, z], [h + d, h + d, z], [-h - d, h + d, z]];
// Plat dak met een opstaande rand: de veelhoek tot top, daarin 0,3 m van de rand een 0,2 m diepe verlaging.
const flatBlock = (poly, top) => {
  const cs = new CrossSection([poly]);
  const inner = cs.offset(-0.3, "Miter");
  return extrudeCs(cs, BASE, top).subtract(extrudeCs(inner, top - 0.2, top + 1));
};
const extrudeCs = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
// Dakvlak z = a u + b v + c boven een veelhoek, vanaf BASE.
const planeBlock = (poly, a, b, c) => {
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, 20).trimByPlane([a / n, b / n, -1 / n], -c / n);
};

// ---------- toren ----------
const T = 2.7; // halve gevelbreedte (5,4 m)
const H = {
  roof: 29.3, // dak binnen de borstwering (AHN NAP +37,65)
  band: [28.65, 28.9], // lichte lijn onder de kroon
  panels: [29.05, 29.95], // lichte velden in de kroon
  coping: [30.02, 30.1, 30.3], // dekzerk: aanzet (onderkant 53 graden), uitsprong, bovenkant (AHN NAP +38,65)
  clock: 23.3, // hart van de klok
  lantern: [29.3, 33.0, 33.5], // lantaarn: voet, kroonlijst, top van het kapje (AHN NAP +41,85)
};
const shaft = box(-T, -T, BASE, T, T, H.coping[0] + 0.01);
const coping = hull([...sq(T, 0, H.coping[0]), ...sq(T, 0.06, H.coping[1]), ...sq(T, 0.06, H.coping[2])]);
const band = hull([...sq(T, 0, H.band[0] - 0.08), ...sq(T, 0.06, H.band[0]), ...sq(T, 0.06, H.band[1]), ...sq(T, 0, H.band[1] + 0.06)]);
// Dak binnen de borstwering. De borstwering is hier 0,95 m dik (in het echt dunner), zodat ze achter de velden nog
// 0,8 m breed is en de export haar niet verdikt.
const roofWell = box(-T + 0.95, -T + 0.95, H.roof, T - 0.95, T - 0.95, H.coping[2] + 1);
// Kroon: zeven velden van 0,4 m per gevel op 0,72 m steek, 0,12 m diep.
const crownPanels = Object.keys(DIRS).flatMap((dir) => [-3, -2, -1, 0, 1, 2, 3].map((k) => win(dir, T, k * 0.72, 0.4, ...H.panels, 0.12)));
// Deur in de zuidgevel (-Y), iets west van het midden; naast de deur van het lage blok.
const towerDoor = win("-y", T, -0.6, 1.0, 0, 2.2, 0.3);
const clocks = Object.keys(DIRS).map((dir) => clock(dir, T, 0, H.clock, 0.85));
const tower = union([shaft, coping, band, ...clocks]).subtract(roofWell);
const towerOpenings = union([towerDoor, ...crownPanels]);

// Lantaarn: achtkant (omgeschreven straal 1,55 m, zijden evenwijdig aan de gevels) met glasvlakken als nissen tussen
// de stijlen, een kroonlijst van 0,1 m en een laag kapje.
const oct = (r, z) => circle([0, 0], r, 8, Math.PI / 8).map(([x, y]) => [x, y, z]);
const LR = 1.55;
const lanternBody = hull([...oct(LR, H.lantern[0]), ...oct(LR, H.lantern[1])]);
const lanternCornice = hull([...oct(LR, H.lantern[1] - 0.13), ...oct(LR + 0.1, H.lantern[1]), ...oct(LR + 0.1, H.lantern[1] + 0.1)]);
const lanternCap = hull([...oct(LR + 0.1, H.lantern[1] + 0.1), [0, 0, H.lantern[2]]]);
const apothem = LR * Math.cos(Math.PI / 8);
const lanternGlass = union(Array.from({ length: 8 }, (_, k) => niche(apothem, 0.8, 30.45, 32.75, 0.12).rotate([0, 0, k * 45])));
const lantern = union([lanternBody, lanternCornice, lanternCap]).subtract(lanternGlass);

// ---------- laag blok rond de voet van de toren (AHN NAP +13,30 = 4,97 m) ----------
const LOW = 4.97;
const lowPoly = [[-8.96, -0.27], [-2.7, -0.27], [-2.7, -2.7], [9.3, -2.7], [9.3, 1.77], [5.45, 1.77], [5.45, 7.06], [4.52, 7.06], [4.52, 10.05], [-8.96, 10.05]];
const chimney = box(-0.5, 9.0, BASE, 0.4, 9.9, 5.9);
const lowOpenings = union([
  // noordgevel naar het binnenterrein: vier vensters (met gele panelen) en de deur onder de luifel
  ...[-4.8, -2.6, -0.4, 1.8].map((s) => win("+y", 10.05, s, 1.4, 1.1, 3.1, 0.25)),
  win("+y", 10.05, 3.6, 1.0, 0, 2.3, 0.3),
  // zuidgevel van het oostelijke deel (wit): deur en venster
  win("-y", 2.7, 7.6, 1.0, 0, 2.2, 0.3), win("-y", 2.7, 4.6, 1.4, 1.1, 3.1, 0.25),
  // zuidgevel west van de toren: twee vensters
  win("-y", 0.27, -7.0, 1.4, 1.1, 3.1, 0.25), win("-y", 0.27, -4.6, 1.4, 1.1, 3.1, 0.25),
  // oostgevel van het oostelijke deel
  win("+x", 9.3, -0.5, 1.4, 1.1, 3.1, 0.25),
]);
const low = union([flatBlock(lowPoly, LOW), chimney]);

// Klein blok tussen het lage blok en de gang (NAP +11,20 = 2,87 m).
const small = flatBlock(rect(-8.73, 10.05, -5.82, 13.16), 2.87);
// Verbindingsgang naar het museum: plat dak dat van 3,37 m (zuid) naar 2,37 m (noord) afloopt (3D BAG).
const gang = planeBlock(rect(-15.67, 9.44, -8.73, 22.5), 0, -0.0794, 3.37 + 9.85 * 0.0794);
const gangOpenings = union([15.0, 18.0, 21.0].map((s) => win("+x", -8.73, s, 1.4, 0.9, 2.0, 0.2)));
// Lange lage oostvleugel: plat dak van 2,88 m (zuid) naar 3,28 m (noord) (3D BAG NAP +11,2 tot +11,6).
const eastPoly = [[5.45, 1.77], [26.01, 1.77], [26.01, 8.14], [6.24, 8.14], [6.24, 7.06], [5.45, 7.06]];
const eastWing = planeBlock(eastPoly, 0, 0.063, 2.88 - 1.77 * 0.063);
const eastOpenings = union([
    ...[11.5, 14.5, 17.5, 20.5, 23.5].map((s) => win("-y", -1.77, s, 1.2, 0.9, 2.2, 0.2)),
    win("+x", 26.01, 5.0, 1.0, 0, 2.2, 0.3),
  ]);

// ---------- museum (mansardedak) ----------
const M = { u0: -31.31, u1: -15.67, v0: 4.78, v1: 23.93 };
const MC = [(M.u0 + M.u1) / 2, (M.v0 + M.v1) / 2];
const MH = { wall: 4.23, eave: [4.75, 5.0], brk: 9.9, ridge: 14.15, east: 8.2 };
const IN = 1.0; // knik van het mansardedak, binnen de gevel
const OV = 0.4; // overstek van de goot
const mRect = (d, z) => [[M.u0 - d, M.v0 - d, z], [M.u1 + d, M.v0 - d, z], [M.u1 + d, M.v1 + d, z], [M.u0 - d, M.v1 + d, z]];
const mWalls = box(M.u0, M.v0, BASE, M.u1, M.v1, MH.wall + 0.01);
// Goot: onderkant van de overstek onder 52 graden naar de gevel, boeiboord van 0,25 m.
const mEave = hull([...mRect(0, MH.wall), ...mRect(OV, MH.eave[0]), ...mRect(OV, MH.eave[1])]);
// Onderste, steile dakvlakken van de goot naar de knik.
const mLower = hull([...mRect(OV, MH.eave[1]), ...mRect(-IN, MH.brk)]);
// Bovenste schilddak: zijvlakken 32 graden, eindschilden 55 graden.
const ridgeHalf = (M.v1 - M.v0) / 2 - IN - 3.0;
const mUpper = hull([...mRect(-IN, MH.brk), [MC[0], MC[1] - ridgeHalf, MH.ridge], [MC[0], MC[1] + ridgeHalf, MH.ridge]]);
// Oostzijde: opbouw van twee lagen over bijna de hele lengte (DSM NAP +16,3 à +16,8, in de 3D BAG tot 1 m buiten de
// BAG-gevel), plat afgedekt, tot de buitenkant van de goot zodat de vensters de overstek niet ondersnijden; aan de
// zuidkant de erker van twee lagen.
const mEast = box(M.u1 - 1.25, M.v0 - OV, BASE, M.u1 + OV, M.v1 - 1.1, MH.east);
// Brede dakkapel in het westen (vier vensters) en een kleine op het zuidschild.
const dormerW = box(M.u0 + 0.1, 10.9, 5.0, M.u0 + 2.4, 17.9, 9.4);
const dormerS = box(-26.0, M.v0 + 1.1, 9.0, -21.0, M.v0 + 4.5, 11.3);
const mOpenings = union([
  // westgevel: twee deuren bij de noordhoek (ingang van het museum), vensters
  win("-x", -M.u0, 20.2, 1.0, 0, 2.2, 0.3), win("-x", -M.u0, 22.0, 1.0, 0, 2.2, 0.3),
  ...[7.5, 10.5, 13.5, 16.8].map((s) => win("-x", -M.u0, s, 1.4, 1.0, 2.9, 0.25)),
  // dakkapel west: vier vensters
  ...[11.9, 13.6, 15.3, 17.0].map((s) => win("-x", -(M.u0 + 0.1), s, 1.2, 7.2, 8.8, 0.2)),
  // zuidgevel: twee brede vensters en een smal
  win("-y", -M.v0, -28.0, 2.0, 1.0, 3.2, 0.25), win("-y", -M.v0, -23.5, 2.0, 1.0, 3.2, 0.25), win("-y", -M.v0, -19.5, 1.4, 1.0, 3.2, 0.25),
  win("-y", -(M.v0 + 1.1), -23.5, 2.4, 10.3, 10.9, 0.15),
  // noordgevel
  ...[-28.5, -25.0, -21.5, -18.0].map((s) => win("+y", M.v1, s, 1.4, 1.0, 2.9, 0.25)),
  // oostelijke opbouw: bovenvensters boven de gang, en de erker aan de zuidkant
  ...[11.0, 14.0, 17.0, 20.0].map((s) => win("+x", M.u1 + OV, s, 1.2, 5.0, 7.2, 0.25)),
  win("+x", M.u1 + OV, 6.9, 1.2, 1.0, 3.2, 0.25), win("+x", M.u1 + OV, 6.9, 1.2, 5.0, 7.2, 0.25),
  win("-y", -(M.v0 - OV), -16.3, 0.8, 1.0, 3.2, 0.25), win("-y", -(M.v0 - OV), -16.3, 0.8, 5.2, 7.4, 0.25),
]);
const museum = union([mWalls, mEave, mLower, mUpper, mEast, dormerW, dormerS]);

// Vensters en deuren pas na het samenvoegen, zodat aangrenzende blokken ze niet weer dichten.
const all = union([tower, lantern, low, small, gang, eastWing, museum])
  .subtract(union([towerOpenings, lowOpenings, gangOpenings, eastOpenings, mOpenings]));

await writeLandmark({
  slug: "watertoren-maarsbergen",
  base: BASE,
  nodes: [["building:watertoren-met-museum-en-laagbouw", all]],
  catalog: {
    name: "Watertoren Maarsbergen",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, -5], [9, -5], [-6, -3], [-23.5, 2.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1581100000011158"],
    description:
      "Oorsprong op het hart van de toren op het maaiveld (NAP +8,33 m), +X naar RD-richting 17,47 graden, +Y naar 107,47 graden, evenwijdig aan de BAG-gevels. Vierkante bakstenen toren van 5,4 m tot 30,3 m met een klok op elke gevel, een kroon met zeven lichte velden per gevel, een lichte lijn en een dekzerk, en een achtkante glazen lantaarn tot 33,5 m; het hele BAG-pand eromheen als eenvoudige bouwdelen: laag blok van 4,97 m rond de voet, verbindingsgang, lage oostvleugel en het museumgebouw met mansardedak (knik 9,9 m, nok 14,15 m) en dakkapellen. Maten uit BAG, AHN, 3D BAG en foto's.",
    realWorld: {
      built: 1960,
      architect: "N.B. Goudzwaard",
      publishedHeightM: 30,
      reservoirM3: 40,
      bagPandBouwjaar: 1912,
      ahnGroundNapM: GROUND_NAP,
      ahnParapetNapM: 38.65,
      ahnLanternTopNapM: 41.85,
      towerM: [T * 2, T * 2],
      parapetM: H.coping[2],
      lanternTopM: H.lantern[2],
      lowBlockM: LOW,
      museumM: { eaveM: MH.eave[1], breakM: MH.brk, ridgeM: MH.ridge, eastM: MH.east },
      photoScalePxPerM: 52,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Maarsbergen) (1960, N.B. Goudzwaard, 30 m, 40 m³)",
      "https://commons.wikimedia.org/wiki/File:Maarsbergen_Watertoren_9588.JPG (2006, kroon, klok, lantaarn, deur, wit laag blok)",
      "https://commons.wikimedia.org/wiki/File:Maarsbergen_Valkenheide_Watertoren.jpg (2016, vanaf het binnenterrein: lage vleugel met vensters, klok, kroon)",
      "https://commons.wikimedia.org/wiki/File:Maarsbergen_Valkenheide_Museum.jpg (2016, museumgebouw: mansardedak, dakkapel, ingang)",
      "3D BAG NL.IMBAG.Pand.1581100000011158 (dakvlakken en hoogtes van de lage delen en het museum)",
      "PDOK BAG-pand 1581100000011158, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

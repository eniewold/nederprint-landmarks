// Drogenapstoren in Zutphen, rijksmonument 41393: de Saltpoort, een stadspoort
// uit 1444-1446 die al in 1465 werd dichtgemetseld; van 1888 tot 1927 watertoren
// (reservoir van 180 m³) en sinds 1983 een woning. Een vierkant bakstenen
// poortgebouw met een spitsboogpoort aan de zuidzijde (de Martinetsingel), een
// witte boogfries onder een gekanteelde borstwering met weergang, vier
// achtkante hoektorentjes die op kraagstenen uit de hoeken springen, en daarboven
// een achtkante bovenbouw met spitsboogfries en een hoge achtkante leien spits
// met een knik aan de voet (in de jaren zestig herbouwd, zonder de dakkapelletjes
// van de oude spits). Ten westen en oosten van de toren staan in het BAG-pand
// twee lage aanbouwen.
// Oorsprong op het hart van het vierkante BAG-pand 0301100000013716 op het
// maaiveld van de poort (NAP +9,1 m). Gebouwd in een torenstelsel u (oost) en
// v (noord), 4,67 graden linksom van RD gedraaid (de zuid- en westgevel van het
// BAG-pand); aan het eind een kwartslag gedraaid zodat +X naar de zuidgevel met
// de poort wijst. De spits staat in het AHN 0,45 m zuidelijker dan het hart.
// Hoogtes uit het AHN (borstwering, torentjes, dakvoet en top van de spits) en
// uit de frontale foto "Zutphen, de Drogenapstoren RM41393 IMG 7993", geschaald
// op de borstwering in het AHN (29,8 px/m); breedtes uit BAG, AHN en die foto.
import { Manifold, hull, ring3, circle, rect, prism, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [210481.76, 461524.11];
const AXIS = [0.0814, -0.9967]; // zuid in het torenstelsel (4,67 graden gedraaid)
const BASE = -1.3; // de tuin ten westen ligt 1 m lager dan de poort
const B = { e: 5.74, w: -5.7, n: 5.75, s: -5.53 }; // gevels van het poortgebouw (BAG)
const H = {
  frieze: 11.9, // voet van de witte boogfries
  ledge: 12.25, // borstwering op de fries
  walk: 12.2, // weergang
  crenel: 13.0, // onderkant van de kantelen
  merlon: 13.75,
  octCornice: 20.9, // voet van de spitsboogfries van de bovenbouw
  octLedge: 21.4,
  eaveFoot: 21.9,
  eave: 22.35, // dakvoet van de spits
  kick: 24.0, // knik in de spits
  apex: 45.0,
};
const C = 1 / Math.cos(Math.PI / 8); // apothema -> hoekstraal
const oct = (c, a, z) => ring3(circle(c, a * C, 8, Math.PI / 8), z);

// ---------- poortgebouw met boogfries, borstwering en kantelen ----------
const body = prism(rect(B.w, B.s, B.e, B.n), BASE, H.frieze);
const out = 0.25, wall = 0.6;
const R = (d) => rect(B.w - d, B.s - d, B.e + d, B.n + d);
const ledge = hull([...ring3(R(0), H.frieze - 0.01), ...ring3(R(out), H.ledge)]); // 54 graden
const floor = prism(R(0), H.frieze - 0.01, H.walk);
const parapet = prism(R(out), H.ledge - 0.01, H.crenel).subtract(prism(R(out - wall), H.walk, H.crenel + 1));
// Vier kantelen van 0,93 m per zijde tussen de torentjes, kantelgaten van 0,9 m.
const MERLONS = [-2.76, -0.92, 0.92, 2.76];
const cu = (B.e + B.w) / 2, cv = (B.n + B.s) / 2;
const merlons = [];
for (const m of MERLONS) {
  for (const v of [B.s - out, B.n + out - wall]) merlons.push(prism(rect(cu + m - 0.465, v, cu + m + 0.465, v + wall), H.crenel - 0.01, H.merlon));
  for (const u of [B.w - out, B.e + out - wall]) merlons.push(prism(rect(u, cv + m - 0.465, u + wall, cv + m + 0.465), H.crenel - 0.01, H.merlon));
}

// ---------- hoektorentjes op kraagstenen ----------
// Achtkant van 3,3 m (hoekstraal 1,65), hart 0,8 m buiten elke gevel; kraag als
// omgekeerde achtkante kegel (60 graden), blokjesfries (56 graden) en een
// achtkante leien spits (69 graden).
const T = { r: 1.65, corbel: 10.0, foot: 11.9, cornice: 16.15, eave: 16.45, apex: 21.0 };
const ta = T.r / C;
const turret = (c) =>
  union([
    hull([...oct(c, 0.45, T.corbel), ...oct(c, ta, T.foot)]),
    hull([...oct(c, ta, T.foot - 0.01), ...oct(c, ta, T.cornice)]),
    hull([...oct(c, ta, T.cornice - 0.01), ...oct(c, ta + 0.2, T.eave)]),
    hull([...oct(c, ta + 0.2, T.eave - 0.01), [c[0], c[1], T.apex]]),
  ]);
const TU = 4.92, TV = 4.85;
const turrets = [[cu + TU, cv + TV], [cu - TU, cv + TV], [cu - TU, cv - TV], [cu + TU, cv - TV]].map(turret);

// ---------- achtkante bovenbouw en spits ----------
const O = [-0.1, -0.45]; // hart van de spits (AHN)
const OA = 4.0; // apothema van de bovenbouw (8,0 m over de vlakken)
const upper = union([
  hull([...oct(O, OA, H.walk - 0.2), ...oct(O, OA, H.octCornice)]),
  hull([...oct(O, OA, H.octCornice - 0.01), ...oct(O, OA + 0.25, H.octLedge)]), // spitsboogfries, 63 graden
  hull([...oct(O, OA + 0.25, H.octLedge - 0.01), ...oct(O, OA + 0.25, H.eaveFoot)]),
  hull([...oct(O, OA + 0.25, H.eaveFoot - 0.01), ...oct(O, 4.6, H.eave)]), // onderkant van de dakvoet, 52 graden
  hull([...oct(O, 4.6, H.eave - 0.01), ...oct(O, 4.15, H.kick)]), // knik aan de voet van de spits
  hull([...oct(O, 4.15, H.kick - 0.01), [O[0], O[1], H.apex]]),
]);

// ---------- aanbouwen in het BAG-pand ----------
// Lessenaarsdaken tegen de toren, hoogtes uit de AHN-mediaan binnen de BAG-contour.
const leanTo = (u0, u1, v0, v1, zLow, zHigh, lowSide) => {
  const pts = [];
  for (const [u, v] of [[u0, v0], [u1, v0], [u1, v1], [u0, v1]]) {
    pts.push([u, v, BASE]);
    const low = lowSide === "w" ? u === u0 : u === u1;
    pts.push([u, v, low ? zLow : zHigh]);
  }
  return hull(pts);
};
const westAnnex = leanTo(-8.2, B.w + 0.3, 2.85, 5.9, 6.2, 8.6, "w");
const eastAnnex = leanTo(B.e - 0.3, 9.0, 0.5, 3.48, 7.0, 8.4, "e");

// ---------- poort, vensters ----------
// Spitsboog in het vlak met normaal +X op afstand f: van de dorpel tot de
// aanzet recht, daarna 61 en 50 graden naar de top (de export vult hem niet).
const arch = (f, hw, zs, zTop, depth, z0 = 0) => {
  const zm = zs + (zTop - zs) * 0.43;
  const pts = [];
  for (const x of [f - depth, f + 1]) pts.push([x, -hw, z0], [x, hw, z0], [x, -hw, zs], [x, hw, zs], [x, -hw * 0.66, zm], [x, hw * 0.66, zm], [x, 0, zTop]);
  return hull(pts);
};
// Nis met een plafond dat naar binnen onder 56 graden oploopt.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const S = -90, N = 90, E = 0, W = 180; // richting van de gevelnormaal
const cuts = [
  // Poort in de zuidgevel: opening 3,0 m tot 4,1 m, 3 m diep (de doorgang is
  // dichtgezet), in een terugliggend spitsboogkader van 4,2 m tot 5,0 m.
  place(arch(-B.s, 1.5, 2.0, 4.1, 3.0), { deg: S }),
  place(arch(-B.s, 2.1, 2.0, 5.0, 0.3), { deg: S }),
  // Vensters in het poortgebouw (zuid: getralied venster boven de poort).
  place(niche(-B.s, 1.3, 7.2, 9.8, 0.35), { deg: S, at: [-0.4, 0, 0] }),
  ...[[N, B.n, 0], [E, B.e, 0], [W, -B.w, 0]].map(([deg, f]) => place(niche(f, 1.2, 7.2, 9.6, 0.3), { deg })),
  // Vensters in de bovenbouw: een hoog venster en een klein venster boven de weergang op de vier hoofdvlakken.
  ...[S, N, E, W].flatMap((deg) => [
    place(niche(OA, 1.0, 17.0, 19.0, 0.3), { deg, at: [O[0], O[1], 0] }),
    place(niche(OA, 0.9, 13.9, 14.8, 0.3), { deg, at: [O[0], O[1], 0] }),
  ]),
];

const tower = union([body, ledge, floor, parapet, ...merlons, ...turrets, upper, westAnnex, eastAnnex]).subtract(union(cuts));

await writeLandmark({
  slug: "drogenapstoren",
  base: BASE,
  // Eén node: de export vult elke node apart op; aanbouwen en torentjes horen bij de toren.
  nodes: [["building:poortgebouw-hoektorentjes-en-spits", tower.rotate([0, 0, 90])]],
  catalog: {
    name: "Drogenapstoren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Op de poortweg (zuid), de Drogenapsteeg (noord) en het pad ten zuidoosten
    // en oosten (NAP +9,0..9,3); niet in de tuin ten westen (NAP +8,1), anders
    // zakt de poort een meter weg.
    groundSamplePoints: [[7.5, 0], [-7.5, 0], [7, 7], [0, 10]],
    // Terugval als geen bemonsteringspunt in de uitsnede valt: NAP +9,0 (poortweg)
    // + 43,4 m NAP-ellipsoïde (PDOK-terrein bij de Walburgiskerk, 150 m verderop).
    groundHeight: 52.4,
    replacesBuildings: ["NL.IMBAG.Pand.0301100000013716"],
    description:
      "Oorsprong op het hart van het vierkante BAG-pand op het maaiveld van de poort (NAP +9,1 m), +X naar de zuidgevel met de poort (274,67 graden van RD-oost). Poortgebouw van 11,4 × 11,3 m met spitsboogpoort, vensters, witte boogfries op 11,9 m, borstwering met vier kantelen per zijde tot 13,75 m, vier achtkante hoektorentjes op kraagstenen tot 21,0 m, achtkante bovenbouw van 8,0 m met spitsboogfries en dakvoet op 22,35 m en een achtkante spits met knik tot 45,0 m; twee lage aanbouwen in het BAG-pand. Maten uit AHN, BAG en foto's.",
    realWorld: {
      publishedHeightM: 50,
      reservoirM3: 180,
      ahnGroundNapM: 9.1,
      ahnTopNapM: 53.49,
      coneFitApexM: 45.46,
      bodyM: [11.44, 11.28],
      friezeM: 11.9,
      merlonTopM: 13.75,
      turretAcrossCornersM: 3.3,
      turretEaveM: 16.45,
      turretApexM: 21.0,
      upperAcrossFlatsM: 8.0,
      eaveM: 22.35,
      modelTopM: 45.0,
      photoScalePxPerM: 29.8,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Drogenapstoren",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/41393",
      "https://commons.wikimedia.org/wiki/File:Zutphen,_de_Drogenapstoren_RM41393_IMG_7993_2021-02-12_11.31.jpg (frontale foto zuidgevel, maten)",
      "https://commons.wikimedia.org/wiki/File:Zutphen,_de_Drogenapstoren_positie2_RM41393_foto3_2014-03-10_15.23.jpg (kantelen, torentjes, bovenbouw)",
      "https://commons.wikimedia.org/wiki/File:20160917_Drogenapsteeg_Drogenapstoren_Zutphen.jpg (noordgevel)",
      "https://commons.wikimedia.org/wiki/File:Monumentendag_010.JPG (westzijde, torentjes)",
      "PDOK BAG-pand 0301100000013716, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-01",
    ],
  },
});

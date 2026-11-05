// Watertoren uit 1926 aan de Reggestraat 9 in Almelo (rijksmonument 507700), gebouwd voor de Algemene Waterleiding
// Maatschappij Almelo naar ontwerp van architect G. Halbertsma en ingenieur J. Buining, een kopie van een (afgebroken)
// toren uit 1916 in Velsen. Een functionalistische toren van gewapend beton, 38,1 m hoog met een reservoir van 750 m³,
// midden in een woonwijk; sinds 2015 is er een plan om hem tot woning te verbouwen.
//
// Vorm (register, Commons-foto's "Watertoren Reggestraat Almelo 1926" van het noorden, "2009 Watertoren Reggestraat
// Almelo" van het noordwesten van dichtbij en RCE-foto 20351175 van het zuidoosten, luchtfoto, AHN en BAG): vierkante
// plattegrond; een hoge sokkel met aan de straatkant (oost) een dubbele deur boven een hardstenen trap van vijf treden;
// een taps toelopende schacht met hoekpenanten en twee lisenen per gevel rond verdiepte velden (de vensters in de schacht
// zijn in 1973 dichtgezet); de lisenen eindigen in kraagstukken onder het overstekende reservoir, dat een schuine
// onderkant heeft. Het reservoir heeft per gevel een driezijdig middenrisaliet; dat aan de voorgevel (oost) is hoger en
// heeft een eigen klein schilddak (het trappenhuis naar de zolder). Per gevel twee verdiepte velden met drie smalle
// vensters boven en één hoog venster eronder, en een hoog venster in elk risaliet. Een overstekende lijst en een
// tentdak met leien.
//
// Oorsprong op het hart van BAG-pand 0141100000008007 (12,0 × 12,0 m met de vier risalieten, de omtrek van het reservoir)
// op maaiveld NAP +11,4 (AHN-DTM rond de toren 11,24 tot 11,68, mediaan 11,38; 3D BAG-maaiveld 11,38). +X wijst naar de
// voorgevel aan de Reggestraat (oost-zuidoost, RD-richting -21,16 graden uit de BAG-gevels), +Y naar het noord-
// noordoosten.
// Hoogtes uit het AHN-DSM in dit stelsel: top NAP +50,15 (3D BAG 49,81), dakhelling 51 graden, goot op NAP +42,75; de
// risalieten van noord, zuid en west zijn vlak op gootshoogte (DSM 31,3 m boven maaiveld); het hoge risaliet heeft een
// nok op NAP +47,5 van 2,3 tot 5,4 m uit het hart en goten op circa NAP +45,8 (3D BAG 45,5 tot 46,0).
// Geledingen eronder uit de noordfoto (vrijwel frontaal, 32 px/m uit de breedte van het reservoir) en de RCE-foto.
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [242286.79, 485606.61];
const AXIS_DEG = -21.16;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 11.4;
// Terugval: NAP +11,4 plus een geoïdehoogte van circa 43,1 m (zoals bij de watertoren uit 1924 in Almelo).
const GROUND_ELLIPSOID = 54.5;

// Halve breedtes (vierkant) en hoogtes boven maaiveld.
const PLINTH = 5.9; // sokkel 11,8 m
const CORE = [5.4, 4.9]; // schacht tussen de lisenen onder (3,3 m) en boven (20,1 m): taps, 1,7 graden
const PIER = 0.3; // lisenen en hoekpenanten steken 0,3 m uit de schacht
const TANK = 6.0; // reservoir 12,0 m (BAG)
const EAVES = 0.25; // overstek van de lijst
// Driezijdig risaliet: 2,9 m breed aan de gevel, 1,2 m aan de voorkant, 0,87 m uit de gevel (BAG).
const RIS = { back: 1.45, front: 0.6, out: 0.87 };
const H = {
  door: [0.9, 3.0], // dubbele deur boven de trap van vijf treden (0,9 m)
  plinth: 3.1, // sokkel, met een schuine bovenkant tot de lisenen op 3,3
  shaft: 3.3,
  soffit: 20.1, // schuine onderkant van het reservoir (45 graden) van de schacht tot de gevel op 21,2
  tank: 21.2,
  panels: [22.0, 30.6], // verdiepte velden in het reservoir
  low: [24.2, 27.0], // hoge vensters (noordfoto 24,2 tot 27,0)
  high: [29.05, 30.5], // drie smalle vensters boven in elk veld
  eaves: 31.35, // bovenkant van de lijst (NAP +42,75)
  stairWindow: [32.5, 33.2], // venstertje boven in het hoge risaliet
  stairEaves: 34.35, // lijst van het hoge risaliet (NAP +45,75)
  apex: 38.75, // top van het tentdak (NAP +50,15)
};
const ROOF_SLOPE = (H.apex - H.eaves) / (TANK + EAVES); // 1,18 (50 graden); AHN 1,24
const STAIR_SLOPE = 1.05; // dakje van het hoge risaliet; nok op 36,1 (AHN 36,1)

const sq = (a, z) => [[-a, -a, z], [a, -a, z], [a, a, z], [-a, a, z]];
// Evenwijdige verschuiving van een convexe linksom lopende veelhoek over d (positief = naar buiten).
const offset = (pts, d) => {
  const n = pts.length;
  const lines = pts.map((p, i) => {
    const q = pts[(i + 1) % n];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const t = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
    const nn = [t[1], -t[0]];
    return { p: [p[0] + nn[0] * d, p[1] + nn[1] * d], t };
  });
  return pts.map((_, i) => {
    const a = lines[(i + n - 1) % n], b = lines[i];
    const det = a.t[0] * -b.t[1] - a.t[1] * -b.t[0];
    const dx = b.p[0] - a.p[0], dy = b.p[1] - a.p[1];
    const s = (dx * -b.t[1] - dy * -b.t[0]) / det;
    return [a.p[0] + a.t[0] * s, a.p[1] + a.t[1] * s];
  });
};
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Risaliet op de oostgevel (+X), linksom, met een staart van 0,5 m in het reservoir; `back` = hoe ver hij naar binnen loopt.
const risalit = (back = TANK - 0.5) => [
  [back, -RIS.back], [TANK, -RIS.back], [TANK + RIS.out, -RIS.front], [TANK + RIS.out, RIS.front], [TANK, RIS.back], [back, RIS.back],
];
// place draait om Z: 0 = oostgevel (+X, voorgevel), 90 = noord, 180 = west, 270 = zuid.
const EAST = 0, NORTH = 90, WEST = 180, SOUTH = 270;
const FACES = [EAST, NORTH, WEST, SOUTH];

// Nis in het vlak met normaal +X op afstand f; w breed, van z0 tot z1, op positie y langs de gevel; plafond dat naar
// binnen onder 63 graden oploopt, buiten de gevel een schuine snede die de lijst erboven niet raakt.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Lijst met een onderkant van 45 graden rond een convexe veelhoek, bovenkant op z.
const cornice = (pts, z) => hull([...ring(pts, z - 0.55), ...ring(offset(pts, EAVES), z - 0.3), ...ring(offset(pts, EAVES), z)]);
// Schilddak boven een convexe veelhoek: per rand (behalve de randen in `skip`) een dakvlak dat vanaf de goot op z met
// helling k naar binnen oploopt.
const hipRoof = (pts, z, k, skip = []) => {
  let m = prism(pts, z - 0.01, z + 10);
  pts.forEach((p, i) => {
    if (skip.includes(i)) return;
    const q = pts[(i + 1) % pts.length];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const n = [(q[1] - p[1]) / len, -(q[0] - p[0]) / len]; // buitennormaal (linksom)
    const c = n[0] * p[0] + n[1] * p[1];
    // Houd z <= z + k (c - n·p): (-k n, -1)·p >= -(z + k c).
    const l = Math.hypot(k, 1);
    m = m.trimByPlane([(-k * n[0]) / l, (-k * n[1]) / l, -1 / l], -(z + k * c) / l);
  });
  return m;
};

// ---------- sokkel en schacht ----------
const plinth = union([
  box(-PLINTH, -PLINTH, BASE, PLINTH, PLINTH, H.plinth),
  hull([...sq(PLINTH, H.plinth - 0.01), ...sq(CORE[0] + PIER, H.shaft)]),
]);
const shaftCore = hull([...sq(CORE[0], H.plinth - 0.01), ...sq(CORE[1], H.soffit + 0.01)]);
// Waar de schacht op hoogte z zit (lineair taps).
const coreAt = (z) => CORE[0] + ((CORE[1] - CORE[0]) * (z - H.shaft)) / (H.soffit - H.shaft);
const zTop = H.soffit + PIER; // de lisenen lopen door tot in de schuine onderkant
// Lisene op de oostgevel tussen y0 en y1 (taps mee met de schacht).
const lisene = (y0, y1) => hull([H.plinth, zTop].flatMap((z) => {
  const c = coreAt(z);
  return [[c - 0.2, y0, z], [c + PIER, y0, z], [c - 0.2, y1, z], [c + PIER, y1, z]];
}));
// Hoekpenant: 0,75 m breed op beide gevels, 0,3 m uit.
const cornerPier = hull([H.plinth, zTop].flatMap((z) => {
  const c = coreAt(z), i = c - 0.75, o = c + PIER;
  return [[i, i, z], [o, i, z], [o, o, z], [i, o, z]];
}));
const LISENE = [1.45, 2.05]; // twee lisenen van 0,6 m per gevel, midden op 1,75 m (onder de rand van het risaliet)
// Kraagstuk boven een lisene: onderkant 45 graden van de lisene (20,1 m) tot de gevel van het reservoir (20,9 m).
const corbel = (y0, y1) => {
  const c = CORE[1] + PIER, z1 = H.soffit + (TANK - c);
  return hull([y0, y1].flatMap((y) => [[CORE[1] - 0.3, y, H.soffit], [c, y, H.soffit], [TANK, y, z1], [TANK, y, H.tank + 0.3], [CORE[1] - 0.3, y, H.tank + 0.3]]));
};
const cornerCorbel = (() => {
  const c = CORE[1] + PIER, i = CORE[1] - 0.75, z1 = H.soffit + (TANK - c);
  return hull([
    ...[[i, i], [c, i], [c, c], [i, c]].map(([x, y]) => [x, y, H.soffit]),
    ...[[i, i], [TANK, i], [TANK, TANK], [i, TANK]].flatMap(([x, y]) => [[x, y, z1], [x, y, H.tank + 0.3]]),
  ]);
})();
const shaft = union([
  shaftCore,
  ...FACES.flatMap((deg) => [
    place(lisene(LISENE[0], LISENE[1]), { deg }),
    place(lisene(-LISENE[1], -LISENE[0]), { deg }),
    place(cornerPier, { deg }),
    place(corbel(LISENE[0], LISENE[1]), { deg }),
    place(corbel(-LISENE[1], -LISENE[0]), { deg }),
    place(cornerCorbel, { deg }),
  ]),
]);

// ---------- reservoir, risalieten, lijst en dak ----------
// Schuine onderkant (45 graden) van de schacht (20,1 m) tot de gevel (21,2 m).
const soffit = hull([...sq(CORE[1], H.soffit), ...sq(TANK, H.tank)]);
const tank = box(-TANK, -TANK, H.tank - 0.01, TANK, TANK, H.eaves);
// Risaliet met een onderkant van 45 graden: de voorkant (6,87 m) zakt tot 19,3 m bij de schacht.
const risalitBody = (top, back) => {
  const pts = risalit(back), drop = TANK + RIS.out - CORE[1] + 0.1;
  return union([
    prism(pts, H.tank - 0.01, top),
    hull([...ring(pts, H.tank), ...ring(pts.map(([x, y]) => [x - drop, y]), H.tank - drop)]),
  ]);
};
const sideRisalit = union([risalitBody(H.eaves, TANK - 0.5), cornice(risalit(), H.eaves)]);
// Hoog risaliet aan de voorgevel: loopt tot 1 m van het hart het dak in, zodat de nok van zijn schilddakje (36,1 m) op
// 2,3 m van het hart in het grote dak verdwijnt (AHN: nok van 2,3 tot 5,4 m).
const STAIR_BACK = 1.0;
const stairPlan = risalit(STAIR_BACK);
const stairRisalit = union([
  risalitBody(H.stairEaves, STAIR_BACK),
  cornice(stairPlan, H.stairEaves),
  hipRoof(offset(stairPlan, EAVES), H.stairEaves, STAIR_SLOPE, [5]), // rand 5 (achterkant) ligt in het grote dak
]);
const mainCornice = hull([...sq(TANK, H.eaves - 0.55), ...sq(TANK + EAVES, H.eaves - 0.3), ...sq(TANK + EAVES, H.eaves)]);
const roof = hull([...sq(TANK + EAVES, H.eaves - 0.01), [0, 0, H.apex]]);

// ---------- openingen ----------
const PANEL = [1.75, 4.85]; // verdiepte velden tussen het risaliet en de hoekpenant (0,3 m breed hart 3,3)
const panelMid = (PANEL[0] + PANEL[1]) / 2;
const openings = union([
  ...FACES.flatMap((deg) => [-1, 1].flatMap((side) => [
    // Verdiept veld van 0,2 m met drie smalle vensters boven en een hoog venster eronder (0,5 m breed, 0,3 m diep).
    place(niche(TANK, PANEL[1] - PANEL[0], ...H.panels, 0.2, side * panelMid), { deg }),
    ...[-1.1, 0, 1.1].map((d) => place(niche(TANK - 0.2, 0.5, ...H.high, 0.3, side * (panelMid + d)), { deg })),
    place(niche(TANK - 0.2, 0.5, ...H.low, 0.3, side * panelMid), { deg }),
  ])),
  // Hoog venster in de voorkant van elk risaliet; het hoge risaliet heeft daarboven nog een venstertje.
  ...FACES.map((deg) => place(niche(TANK + RIS.out, 0.5, ...H.low, 0.3), { deg })),
  niche(TANK + RIS.out, 0.6, ...H.stairWindow, 0.3),
  // Dubbele deur in de sokkel van de voorgevel.
  niche(PLINTH, 1.6, ...H.door, 0.3),
]);
const tower = union([
  plinth,
  shaft,
  soffit,
  tank,
  mainCornice,
  roof,
  place(stairRisalit, { deg: EAST }),
  ...[NORTH, WEST, SOUTH].map((deg) => place(sideRisalit, { deg })),
]).subtract(openings);

// ---------- trap ----------
// Hardstenen trap van vijf treden voor de deur, als drie treden van 0,3 m (0,5 m diep, 2,4 m breed).
const stairs = union([0, 1, 2].map((i) => box(PLINTH, -1.2, BASE, PLINTH + 1.5 - i * 0.5, 1.2, 0.3 * (i + 1))));

await writeLandmark({
  slug: "watertoren-almelo-1926",
  base: BASE,
  nodes: [
    ["building:sokkel-schacht-reservoir-risalieten-en-tentdak", tower],
    ["road:hardstenen-trap", stairs],
  ],
  catalog: {
    name: "Watertoren Reggestraat Almelo",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch: NAP +11,4 plus de geoïdehoogte (circa 43,1 m).
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0141100000008007"],
    description:
      "Oorsprong op het hart van het BAG-pand op maaiveld (NAP +11,4 m), +X naar de voorgevel aan de Reggestraat (RD-richting -21,16 graden), +Y naar het noordnoordoosten. Vierkante betonnen toren uit 1926: sokkel van 11,8 m met deur en trap aan de oostkant, taps toelopende schacht met hoekpenanten en lisenen die in kraagstukken onder de schuine onderkant van het reservoir eindigen, reservoir van 12,0 m met per gevel een driezijdig middenrisaliet, verdiepte velden en vensters als nis, lijst op 31,35 m, het hoge risaliet aan de voorgevel met een schilddakje tot 36,1 m en een tentdak tot 38,75 m. Maten uit BAG, AHN en drie foto's.",
    realWorld: {
      built: 1926,
      architect: "G. Halbertsma (ingenieur J. Buining)",
      rijksmonument: 507700,
      heightM: 38.1,
      reservoirM3: 750,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 50.15,
      bag3dTopNapM: 49.81,
      tankM: TANK * 2,
      plinthM: [PLINTH * 2, H.plinth],
      shaftM: [(CORE[0] + PIER) * 2, (CORE[1] + PIER) * 2],
      risalitM: [RIS.back * 2, RIS.front * 2, RIS.out],
      tankBottomM: H.tank,
      eavesM: H.eaves,
      stairRisalitEavesM: H.stairEaves,
      stairRisalitRidgeM: +(H.stairEaves + STAIR_SLOPE * (RIS.back + EAVES)).toFixed(2),
      apexM: H.apex,
      roofDeg: +((Math.atan(ROOF_SLOPE) * 180) / Math.PI).toFixed(1),
      photoScalePxPerM: 32,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Almelo_Reggestraat) (1926, 38,10 m, 750 m³, rijksmonument 507700)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/507700 (vierkant, gewapend beton, hoge sokkel, taps toelopende schacht, lisenen met kraagstukken, driezijdige middenrisalieten, hoog risaliet met schilddakje aan de voorgevel, trap van vijf treden en dubbele deur aan de oostkant, tentdak met leien)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Reggestraat_Almelo_1926.jpg (van het noorden: geledingen, vensters, lisenen)",
      "https://commons.wikimedia.org/wiki/File:2009_Watertoren_Reggestraat_Almelo.jpg (van dichtbij: sokkel, schacht, verdiepte velden)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Almelo_-_20351175_-_RCE.jpg (van het zuidoosten: kraagstukken, schuine onderkant, risalieten, hoog risaliet)",
      "PDOK BAG-pand 0141100000008007, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-05",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0141100000008007: maaiveld en hoogte van het hoge risaliet als controle, opgehaald 2026-11-05",
    ],
  },
});

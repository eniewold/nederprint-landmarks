// Watertoren van Lutten (gemeente Hardenberg), gebouwd in 1932 in de typische jarendertigstijl; gemeentelijk monument.
// Volgens Wikipedia 49,2 m hoog met een reservoir van 578 m³, de hoogste als watertoren gebouwde toren van Overijssel en
// een van de twee Nederlandse watertorens met een zadeldak (de andere staat in Mijdrecht). In 2006 buiten gebruik, sinds
// een verbouwing in 2014 een accommodatie met tien slaapkamers. Een vierkante bakstenen schacht die licht taps toeloopt,
// met een steil zadeldak tussen twee topgevels (noord en zuid) en goten achter een borstwering aan de oost- en westzijde.
// Elke gevel heeft dezelfde opbouw: onderaan een licht vooruitspringend blok, daarboven een hoge, verdiepte nis met een
// rondboog (met spleetvensters en een rond venster bovenin), dan een rij consoles met in het midden een hangende console
// op de kruin van de boog, en daarop een vooruitspringend paneel ter hoogte van het reservoir. Op de topgevels loopt het
// paneel bovenaan uit in een lage punt, met daarboven een hoog venster in de top. Tegen de zuidgevel staat een portaal met
// een zadeldakje en de deur.
//
// Oorsprong op het hart van de top in het AHN-DSM (nok en borstweringen): 0,35 m oostelijk en 0,3 m noordelijk van het
// hart van BAG-pand 0160100001371261 (vierkant van 12,75 m), op maaiveld NAP +8,6 (AHN-DSM rondom 8,6; 3D BAG 8,41).
// +X wijst naar RD-richting 4,72 graden (oost, de normaal van de BAG-gevels), +Y naar het noorden; de nok loopt langs Y.
// Hoogtes uit het AHN-DSM 0,5 m: borstwering NAP +51,05 (42,45 m), goot +50,7 (42,1 m), dakvlakken van 53,3 graden
// (vlakfit, rms 0,07 à 0,11 m), nok +57,44 (48,84 m), top van de noordelijke topgevel +57,81 (49,2 m, gelijk aan
// Wikipedia). Breedte van de top in het DSM 12,0 à 12,1 m, de BAG-voet 12,75 m: de schacht loopt 0,375 m per zijde taps
// toe (op de RCE-foto 6 à 9 px per zijde over de hoogte). Geledingen, nissen, consoles, vensters en portaal uit de twee
// foto's op Commons (zie sources), geschaald op de breedte van de gevel en de AHN-hoogte van de borstwering.
import { hull, union, prism, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [233386.79, 514143.46];
const DEG = 4.72;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 8.6;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06 met de terreintegels van de
// export (oost 51,00, west 51,03, noord 51,09, zuid 51,01).
const GROUND_ELLIPSOID = 51.0;

// ---------- maten (meters, boven maaiveld) ----------
const T = 6.0; // halve breedte van de schacht bovenaan (op de borstwering)
const FOOT = 6.375; // halve breedte op maaiveld (BAG 12,75 m)
const H = {
  eave: 42.45, // borstwering oost en west (AHN NAP +51,05)
  gutter: 42.1, // goot achter de borstwering (AHN NAP +50,7)
  ridge: 48.84, // nok (AHN NAP +57,44)
  coping: 0.36, // de topgevels steken boven het dakvlak uit (AHN NAP +57,81 op de noordgevel)
  plinth: 7.6, // bovenkant van het vooruitspringende onderblok, voet van de nis
  spring: 26.8, // aanzet van de rondboog van de nis (kruin 28,5)
  corbel: [30.4, 32.5], // consoles onder het paneel
  panelSoffit: 31.8, // onderzijde van het paneel aan de gevel (schuin naar 32,5 aan de voorkant)
  panelTop: 42.1, // bovenkant van het paneel (op de topgevels de uiteinden)
  panelPeak: 42.9, // lage punt van het paneel op de topgevels
};
const SLOPE = (H.ridge - H.gutter) / 5.0; // 1,348: dakvlak van 53,4 graden, van de nok tot de goot op 5,0 m
const PANEL = { half: 3.8, out: 0.5 };
const NICHE_W = 3.4;
const PLINTH = { half: 2.3, out: 0.2 };

// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder 56
// graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const y0 = y - w / 2, y1 = y + w / 2, za = z1 + 1.5 * depth, out = Math.min(1, (z1 - z0) / 1.5);
  return hull([
    [f - depth, y0, z0], [f + out, y0, z0], [f - depth, y1, z0], [f + out, y1, z0],
    [f - depth, y0, za], [f, y0, z1], [f - depth, y1, za], [f, y1, z1], [f + out, y0, z1 - 1.5 * out], [f + out, y1, z1 - 1.5 * out],
  ]);
};
// Rondboognis: als niche, met een halfrond (veelhoek van 9 punten) bovenop; het boogplafond loopt naar binnen onder 72
// graden op (bij 63 graden, met de boog van 3,4 m, zette de export onder de kruin nog een dun randje steun), buiten de
// gevel zakt de snede 3 m per meter zodat de boog op het gevelvlak blijft liggen.
const archNiche = (f, w, z0, zSpring, depth = 0.3) => {
  const r = w / 2;
  const arc = Array.from({ length: 9 }, (_, k) => {
    const t = (Math.PI * k) / 8;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([y, z]) => [a, y, z + 3 * depth]),
    ...arc.map(([y, z]) => [f, y, z]),
    ...arc.map(([y, z]) => [f + 1, y, Math.max(z0, z - 3)]),
    [a, -r, z0], [a, r, z0], [f + 1, -r, z0], [f + 1, r, z0],
  ]);
};

// ---------- schacht, borstwering, goot, dak en topgevels (recht; de tapsheid komt aan het eind) ----------
const shaft = box(-T, -T, BASE, T, T, H.eave);
// Goot tussen de borstwering (0,5 m dik) en het dakvlak, tussen de topgevels.
const GABLE_IN = T - 0.6;
const gutters = union([1, -1].map((s) => box(s * 5.0 - (s > 0 ? 0 : 0.5), -GABLE_IN, H.gutter, s * 5.0 + (s > 0 ? 0.5 : 0), GABLE_IN, H.eave + 1)));
// Zadeldak: prisma van de driehoek (goot op ±5,0, nok op 0) langs Y, van gevel tot gevel.
const alongY = (pts, y0, y1) => prism(pts.map(([x, z]) => [x, z]), 0, y1 - y0).rotate([90, 0, 0]).translate([0, y1, 0]);
const roof = alongY(
  [[-5.0, H.gutter - 1], [5.0, H.gutter - 1], [5.0, H.gutter], [0, H.ridge], [-5.0, H.gutter]],
  -T, T,
);
// Topgevels: 0,6 m dik, 0,36 m boven het dakvlak, van de borstwering tot de top op 49,2 m.
const gableTop = H.ridge + H.coping;
const xKnee = (gableTop - H.eave) / SLOPE;
const gableSection = [[-T, H.eave - 1], [T, H.eave - 1], [T, H.eave], [xKnee, H.eave], [0, gableTop], [-xKnee, H.eave], [-T, H.eave]];
const gables = union([alongY(gableSection, GABLE_IN, T), alongY(gableSection, -T, -GABLE_IN)]);

// ---------- gevelopbouw (gebouwd met de gevel naar +X op x = T, langs de gevel y) ----------
const facade = ({ gable }) => {
  const F = T;
  // Vooruitspringend paneel ter hoogte van het reservoir, met een schuine onderzijde (49 graden) boven de consoles; op
  // de topgevels loopt de bovenkant uit in een lage punt.
  const topAt = (y) => (gable ? H.panelPeak - ((H.panelPeak - H.panelTop) * Math.abs(y)) / PANEL.half : H.panelTop);
  const panel = hull([
    ...[-PANEL.half, PANEL.half].flatMap((y) => [
      [F - 0.1, y, H.panelSoffit], [F + PANEL.out, y, H.corbel[1]],
      [F - 0.1, y, topAt(y)], [F + PANEL.out, y, topAt(y)],
    ]),
    ...(gable ? [[F - 0.1, 0, H.panelPeak], [F + PANEL.out, 0, H.panelPeak]] : []),
  ]);
  // Zes consoles van 0,5 m (onderzijde 63 graden) en in het midden een hangende console van 0,9 m tot op de boog.
  const corbel = (y) => hull([
    [F - 0.1, y - 0.25, H.corbel[0]], [F - 0.1, y + 0.25, H.corbel[0]],
    [F + PANEL.out, y - 0.25, H.corbel[0] + 1.2], [F + PANEL.out, y + 0.25, H.corbel[0] + 1.2],
    [F - 0.1, y - 0.25, H.corbel[1] + 0.05], [F - 0.1, y + 0.25, H.corbel[1] + 0.05],
    [F + PANEL.out, y - 0.25, H.corbel[1] + 0.05], [F + PANEL.out, y + 0.25, H.corbel[1] + 0.05],
  ]);
  const pendant = hull([
    [F - 0.1, -0.45, 28.8], [F - 0.1, 0.45, 28.8], [F + 0.4, -0.45, 29.5], [F + 0.4, 0.45, 29.5],
    [F - 0.1, -0.45, H.corbel[1] + 0.05], [F - 0.1, 0.45, H.corbel[1] + 0.05],
    [F + 0.4, -0.45, H.corbel[1] + 0.05], [F + 0.4, 0.45, H.corbel[1] + 0.05],
  ]);
  const corbels = union([-3.3, -2.2, -1.1, 1.1, 2.2, 3.3].map(corbel));
  // Licht vooruitspringend onderblok onder de nis.
  const plinth = box(F - 0.1, -PLINTH.half, BASE, F + PLINTH.out, PLINTH.half, H.plinth);
  const add = union([panel, corbels, pendant, plinth]);
  // Hoge rondboognis (3,4 m breed, 0,3 m diep) met drie spleetvensters en een rond venster (als vierkante nis) bovenin;
  // vensters naast het paneel en naast het onderblok; op de topgevels een hoog venster in de top.
  const back = F - 0.3;
  const cut = union([
    archNiche(F, NICHE_W, H.plinth, H.spring, 0.3),
    ...[[10.1, 11.5], [16.5, 17.9], [22.8, 24.2]].map(([z0, z1]) => niche(back, 0.5, z0, z1, 0.3)),
    niche(back, 0.8, 26.4, 27.2, 0.3),
    ...[-4.45, 4.45].flatMap((y) => [niche(F, 0.5, 34.6, 36.0, 0.3, y), niche(F, 0.5, 39.6, 41.0, 0.3, y)]),
    ...[-3.3, 3.3].map((y) => niche(F, 0.5, 5.85, 7.15, 0.3, y)),
    ...(gable ? [niche(F, 0.5, 43.2, 45.4, 0.3)] : []),
  ]);
  return { add, cut };
};
// Portaal tegen de zuidgevel (gebouwd naar +X): 4,1 m breed, 1,3 m diep, zadeldakje van 52 graden (goot 3,5, nok 6,1),
// de nok haaks op de gevel, 1,2 m links (west) van het midden; deur van 1,4 × 2,3 m.
const PORCH = { y: -1.2, half: 2.05, out: 1.3, eave: 3.5, ridge: 6.1 };
const porch = (() => {
  const F = T;
  const sec = [[PORCH.y - PORCH.half, BASE], [PORCH.y + PORCH.half, BASE], [PORCH.y + PORCH.half, PORCH.eave], [PORCH.y, PORCH.ridge], [PORCH.y - PORCH.half, PORCH.eave]];
  // Doorsnede in (y, z), geëxtrudeerd langs x van in de gevel tot de voorkant.
  const body = prism(sec, 0, PORCH.out + 0.3).rotate([90, 0, 90]).translate([F - 0.3, 0, 0]);
  return body.subtract(niche(F + PORCH.out, 1.4, 0, 2.3, 0.4, PORCH.y));
})();

// Gevels: oost (0), noord (90), west (180), zuid (270); de topgevels zijn noord en zuid.
const faces = [[0, false], [90, true], [180, false], [270, true]].map(([deg, gable]) => {
  const { add, cut } = facade({ gable });
  return { deg, add: place(add, { deg }), cut: place(cut, { deg }) };
});
const straight = union([shaft, roof, gables, ...faces.map((f) => f.add), place(porch, { deg: 270 })])
  .subtract(union([gutters, ...faces.map((f) => f.cut)]));

// Tapsheid: van 12,75 m op maaiveld naar 12,0 m op de borstwering; daarboven ongewijzigd.
const taper = (z) => 1 + (FOOT / T - 1) * Math.max(0, (H.eave - z) / H.eave);
const tower = straight.warp((v) => {
  const s = taper(v[2]);
  v[0] *= s;
  v[1] *= s;
});

await writeLandmark({
  slug: "watertoren-lutten",
  base: BASE,
  nodes: [["building:bakstenen-schacht-met-nissen-consoles-panelen-portaal-en-zadeldak", tower]],
  catalog: {
    name: "Watertoren Lutten",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 8], [0, -9]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0160100001371261"],
    description:
      "Oorsprong op het hart van de top in het AHN (0,35 m oost en 0,3 m noord van het hart van het BAG-pand) op maaiveld (NAP +8,6 m), +X naar RD-richting 4,72 graden (oost), +Y naar het noorden (nok). Vierkante bakstenen schacht van 12,75 m op maaiveld, taps tot 12,0 m op de borstwering (42,45 m); elke gevel met een vooruitspringend onderblok, een hoge rondboognis met vensters, consoles met een hangende console en een vooruitspringend paneel; zadeldak van 53 graden tussen topgevels noord en zuid, nok op 48,84 m, topgevels tot 49,2 m; portaal met zadeldakje en deur tegen de zuidgevel. Maten uit BAG, AHN en twee foto's.",
    realWorld: {
      wikipediaHeightM: 49.2,
      reservoirM3: 578,
      built: 1932,
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 51.05,
      ahnGutterNapM: 50.7,
      ahnRidgeNapM: 57.44,
      ahnGableTopNapM: 57.81,
      footWidthM: FOOT * 2,
      eaveWidthM: T * 2,
      eaveM: H.eave,
      ridgeM: H.ridge,
      gableTopM: +gableTop.toFixed(2),
      roofPitchDeg: +((Math.atan(SLOPE) * 180) / Math.PI).toFixed(1),
      minimumPartM: 0.5,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Lutten) (1932, jarendertigstijl, gemeentelijk monument, 49,2 m, 578 m³, zadeldak, verbouwd in 2014)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Lutten_-_20350822_-_RCE.jpg (RCE, 1997, vanuit het zuidoosten: zuid- en oostgevel, geledingen, nissen, consoles, panelen, portaal)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Lutten.jpg (2003, vanuit het zuidoosten: topgevel, paneel met lage punt, vensters)",
      "PDOK BAG-pand 0160100001371261 en 3D BAG, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

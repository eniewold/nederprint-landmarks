// Watertoren Den Haag (Pompstationsweg, Oostduinen bij Scheveningen). Gebouwd in 1874 voor de Haagsche
// Duinwaterleiding (nu Dunea), ontwerp architect L.A. (Bert) Brouwer en ingenieur Th. Stang; eclectisch, met
// romaanse en renaissancemotieven; 48,74 m hoog volgens Wikipedia, twee reservoirs van 1000 en 1200 m³, het eerste
// in een bakstenen ommanteling in Nederland. Rijksmonument 477404.
//
// Achtkante bakstenen toren (zijde 7,08 m, BAG-pand 0518100000229416) op een plint met een kroonlijst op 7,3 m. Aan
// de zuidzijde (de voorzijde, -Y) een risaliet over de hele hoogte met hardstenen, geschoorde pijlers rond de
// ingang, gele hoekpilasters met korinthische kapitelen en bovenaan een rondgebogen frontonlukarne met een tongewelf
// tot in de koepel. Op de schuine gevels hoge blinde nissen met een boog (de "verticale nissen"), onder de omloop een
// rondboogfries, daarboven de licht uitkragende gestreepte reservoirzone tot de kroonlijst op 30,8 m. Op de kroonlijst
// een balustrade rond een omloop; daarbinnen een achtkante koperen koepel met een lantaarn.
//
// Oorsprong op het hart van de achthoek uit de BAG-voetafdruk (kleinste kwadraten over de zeven volle zijden,
// apothema 8,546 m); lokale X-as langs de voorgevel, 14,33 graden rechtsom van RD-oost; de voorzijde wijst naar -Y
// (RD-richting -104,3 graden). Maaiveld AHN-DTM NAP +6,85 (vlak duinplateau, binnen 25 m van de toren 6,7 tot 7,1).
// Hoogtes uit het AHN-DSM (0,5 m): top van de lantaarn NAP +50,2 (43,35 m boven het maaiveld; de 48,74 m van Wikipedia
// is daarmee niet terug te vinden), koepelprofiel (apothema 6,25 m: 35,6; 5,25: 37,4; 4,25: 38,7; 3,25: 39,7 m),
// rand van de balustrade circa 33 m, tongewelf van de lukarne 35,2 m in het midden en 33 m op 3 m uit het midden.
// Breedte van de risaliet (7,8 m) en de voorkant (10,3 m voor het hart) uit het DSM, de plint van de risaliet uit
// de BAG (8,5 m breed, 11,6 m voor het hart). Hoogtes van plint, kapitelen, friezen en nissen uit de RCE-foto
// 20396134 (bijna frontaal) en de koepel en lantaarn uit "Water tower The Hague 2020.jpg" (telelens), geschaald op
// het AHN.
import { hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [80991.852, 459331.937];
const AXIS_DEG = -14.33;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 6.85;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (west 50,200; zuid 50,232; noordwest 50,266;
// noord 50,277; noordoost 50,353; oost 50,363), gemeten 2026-11-06. Het PDOK-pand staat op 50,19 met de top op 93,57.
const GROUND_ELLIPSOID = 50.2;

// ---------- maten (meters boven het maaiveld; apothema = afstand hart tot gevelvlak) ----------
const A = {
  plinth: 8.546, // plint (BAG)
  plinthCornice: 8.7,
  shaft: 8.35, // schacht boven de plint
  tank: 8.75, // gestreepte reservoirzone, kraagt 0,4 m uit
  cornice: 9.25,
  balOut: 9.15,
  balIn: 7.95,
  domeFoot: 7.25,
  dome: 7.1,
  lantern: 2.25,
  lanternCap: 2.45,
};
const H = {
  plinthCornice0: 6.85,
  plinthCornice: 7.3,
  shaft: 7.65, // bovenkant van het waterlijstje boven de plint
  bayTop: 19.4, // top van de bogen van de hoge nissen
  frieze0: 23.3, // rondboogfries
  frieze1: 24.3,
  step0: 24.6, // kraag onder de reservoirzone
  step1: 25.05,
  cornice0: 30.3, // kroonlijst
  cornice1: 30.8,
  walk: 31.0, // omloop
  balTop: 33.0,
  domeFoot: 31.6,
  domeRise: 9.0, // elliptisch profiel: z = 31,6 + 9,0 * sqrt(1 - (r / 7,1)^2)
  lantern: 42.4,
  lanternCap: 42.65,
  top: 43.35,
};
// Risaliet aan de voorzijde (-Y): halve breedte en voorkant (negatieve v).
const R = {
  plinthHalf: 4.26, // plint met pijlers (BAG)
  plinthFront: -11.59,
  plinthTopHalf: 4.1,
  plinthTopFront: -11.2,
  half: 3.9, // risaliet boven de plint (DSM)
  front: -10.3,
  upperHalf: 4.05, // boven de kraag op 25 m
  upperFront: -10.55,
  pilaster: 2.85, // binnenkant van de hoekpilasters
  pilasterFront: -10.5,
  capital0: 18.7,
  capital1: 19.9,
  gableHalf: 3.95, // frontonlukarne
  gableRise: 4.25,
  vaultHalf: 3.75, // tongewelf erachter
  vaultRise: 4.1,
};

const DEG = Math.PI / 180;
// Achthoek met vlakken naar -90 + 45k graden (voorgevel naar -Y), apothema a, op hoogte z.
const oct = (a, z) => {
  const rc = a / Math.cos(22.5 * DEG);
  return Array.from({ length: 8 }, (_, k) => {
    const t = (22.5 + 45 * k) * DEG;
    return [rc * Math.cos(t), rc * Math.sin(t), z];
  });
};
const octPrism = (a, z0, z1) => hull([...oct(a, z0), ...oct(a, z1)]);
const box3 = (x0, y0, z0, x1, y1, z1) => prism([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], z0, z1);

// Nis in een gevel met normaal +X op afstand f, midden op y = c, breedte w, van z0 tot z1, diepte d. Met spits > 0
// krijgt de nis een spitse top van die hoogte boven z1 (boog als spitsboog van ten minste 50 graden). Het plafond
// loopt naar binnen onder 56 graden op, zodat niets vrij hangt.
const niche = (f, c, w, z0, z1, d = 0.3, spits = 0) => {
  const a = f - d, b = f + 1.0, y0 = c - w / 2, y1 = c + w / 2, up = 1.5 * d;
  const pts = [[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [f, y0, z1], [f, y1, z1], [a, y0, z1 + up], [a, y1, z1 + up], [b, y0, Math.max(z0, z1 - 1.5)], [b, y1, Math.max(z0, z1 - 1.5)]];
  if (spits > 0) pts.push([f, c, z1 + spits], [a, c, z1 + spits + up], [b, c, z1 + spits - 1.0]);
  return hull(pts);
};
// Nis op het achthoekvlak met normaalhoek deg (graden, -90 = voorgevel).
const onFace = (deg, ...args) => place(niche(...args), { deg });

// ---------- plint, schacht, reservoirzone, kroonlijst, omloop met balustrade ----------
const plinth = union([
  octPrism(A.plinth, BASE, H.plinthCornice0),
  hull([...oct(A.plinth, H.plinthCornice0 - 0.18), ...oct(A.plinthCornice, H.plinthCornice0), ...oct(A.plinthCornice, H.plinthCornice), ...oct(A.shaft, H.shaft)]),
]);
const shaft = octPrism(A.shaft, H.plinthCornice, H.step1);
const tank = union([
  hull([...oct(A.shaft, H.step0), ...oct(A.tank, H.step1), ...oct(A.tank, H.cornice0)]),
  hull([...oct(A.tank, H.cornice0), ...oct(A.cornice, H.cornice0 + 1.1 * (A.cornice - A.tank)), ...oct(A.cornice, H.walk), ...oct(A.tank, H.walk)]),
]);
// Boven de risaliet geen balustrade: daar staat de lukarne.
const balustrade = octPrism(A.balOut, H.walk - 0.1, H.balTop).subtract(octPrism(A.balIn, H.walk, H.balTop + 1)).subtract(box3(-4.6, -12, H.walk - 1, 4.6, -7.4, H.balTop + 1));

// ---------- koepel (achtkant, elliptisch profiel) en lantaarn ----------
const domeZ = (r) => H.domeFoot + H.domeRise * Math.sqrt(Math.max(0, 1 - (r / A.dome) ** 2));
const domeRings = [];
for (const r of [7.1, 7.0, 6.8, 6.5, 6.1, 5.6, 5.0, 4.3, 3.5, 2.7, A.lantern - 0.05]) domeRings.push(...oct(r, domeZ(r)));
const dome = union([octPrism(A.domeFoot, H.walk - 0.1, H.domeFoot), hull([...oct(A.dome, H.domeFoot - 0.05), ...domeRings])]);
const lanternBase = domeZ(A.lantern) - 0.3;
const lantern = union([
  octPrism(A.lantern, lanternBase, H.lantern),
  hull([...oct(A.lantern, H.lantern), ...oct(A.lanternCap, H.lanternCap), ...oct(A.lanternCap, H.lanternCap + 0.15), [0, 0, H.top]]),
]);

// ---------- risaliet met plint, pijlers, pilasters, kroonlijst en frontonlukarne ----------
const risalitPlinth = union([
  // Geschoorde plint met de twee hardstenen pijlers (BAG 8,5 m breed), kroonlijst en waterlijst tot de risaliet.
  hull([
    [-R.plinthHalf, R.plinthFront, BASE], [R.plinthHalf, R.plinthFront, BASE], [-R.plinthHalf, -8.0, BASE], [R.plinthHalf, -8.0, BASE],
    [-R.plinthTopHalf, R.plinthTopFront, H.plinthCornice0], [R.plinthTopHalf, R.plinthTopFront, H.plinthCornice0], [-R.plinthTopHalf, -8.0, H.plinthCornice0], [R.plinthTopHalf, -8.0, H.plinthCornice0],
  ]),
  hull([
    [-R.plinthTopHalf, R.plinthTopFront, H.plinthCornice0 - 0.18], [R.plinthTopHalf, R.plinthTopFront, H.plinthCornice0 - 0.18],
    [-R.plinthTopHalf - 0.15, R.plinthTopFront - 0.15, H.plinthCornice0], [R.plinthTopHalf + 0.15, R.plinthTopFront - 0.15, H.plinthCornice0],
    [-R.plinthTopHalf - 0.15, R.plinthTopFront - 0.15, H.plinthCornice], [R.plinthTopHalf + 0.15, R.plinthTopFront - 0.15, H.plinthCornice],
    [-R.half, R.front, H.plinthCornice + 1.0], [R.half, R.front, H.plinthCornice + 1.0],
    [-R.plinthTopHalf - 0.15, -8.0, H.plinthCornice0], [R.plinthTopHalf + 0.15, -8.0, H.plinthCornice0], [-R.plinthTopHalf, -8.0, H.plinthCornice0 - 0.18], [R.plinthTopHalf, -8.0, H.plinthCornice0 - 0.18],
    [-R.plinthTopHalf - 0.15, -8.0, H.plinthCornice], [R.plinthTopHalf + 0.15, -8.0, H.plinthCornice],
  ]),
]);
const risalit = union([
  box3(-R.half, R.front, H.plinthCornice, R.half, -6.0, H.step0),
  // kraag op 24,6 tot 25 m en de bovenste, gestreepte zone tot de kroonlijst
  hull([[-R.half, R.front, H.step0], [R.half, R.front, H.step0], [-R.upperHalf, R.upperFront, H.step0 + 0.3], [R.upperHalf, R.upperFront, H.step0 + 0.3], [-R.upperHalf, R.upperFront, H.cornice0], [R.upperHalf, R.upperFront, H.cornice0], [-R.upperHalf, -6.0, H.step0 + 0.3], [R.upperHalf, -6.0, H.step0 + 0.3], [-R.upperHalf, -6.0, H.cornice0], [R.upperHalf, -6.0, H.cornice0], [-R.half, -6.0, H.step0], [R.half, -6.0, H.step0]]),
  hull([[-R.upperHalf, R.upperFront, H.cornice0], [R.upperHalf, R.upperFront, H.cornice0], [-R.upperHalf - 0.45, R.upperFront - 0.45, H.cornice0 + 0.5], [R.upperHalf + 0.45, R.upperFront - 0.45, H.cornice0 + 0.5], [-R.upperHalf - 0.45, R.upperFront - 0.45, H.walk], [R.upperHalf + 0.45, R.upperFront - 0.45, H.walk], [-R.upperHalf - 0.45, -6.0, H.walk], [R.upperHalf + 0.45, -6.0, H.walk], [-R.upperHalf - 0.45, -6.0, H.cornice0 + 0.5], [R.upperHalf + 0.45, -6.0, H.cornice0 + 0.5], [-R.upperHalf, -6.0, H.cornice0], [R.upperHalf, -6.0, H.cornice0]]),
  // gele hoekpilasters met kapitelen (kraag van 45 graden)
  ...[-1, 1].map((s) => {
    const x0 = s < 0 ? -R.half - 0.2 : R.pilaster, x1 = s < 0 ? -R.pilaster : R.half + 0.2;
    const sx0 = s < 0 ? x0 : x0, sx1 = s < 0 ? x1 : x1;
    return union([
      box3(x0, R.pilasterFront, H.plinthCornice, x1, -7.5, R.capital0),
      hull([[sx0, R.pilasterFront, R.capital0], [sx1, R.pilasterFront, R.capital0], [sx0 - 0.3 * (s < 0 ? 1 : 0), R.pilasterFront - 0.3, R.capital0 + 0.35], [sx1 + 0.3 * (s > 0 ? 1 : 0), R.pilasterFront - 0.3, R.capital0 + 0.35], [sx0 - 0.3 * (s < 0 ? 1 : 0), R.pilasterFront - 0.3, R.capital1], [sx1 + 0.3 * (s > 0 ? 1 : 0), R.pilasterFront - 0.3, R.capital1], [sx0, -7.5, R.capital0], [sx1, -7.5, R.capital0], [sx0 - 0.3 * (s < 0 ? 1 : 0), -7.5, R.capital1], [sx1 + 0.3 * (s > 0 ? 1 : 0), -7.5, R.capital1]]),
    ]);
  }),
]);
// Frontonlukarne: elliptische boog op de kroonlijst met een tongewelf erachter tot in de koepel.
const arch = (half, rise, v0, v1, n = 16) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = (Math.PI * i) / n, u = half * Math.cos(t), z = H.walk + rise * Math.sin(t);
    pts.push([u, v0, z], [u, v1, z]);
  }
  return hull(pts);
};
const gable = union([arch(R.gableHalf, R.gableRise, R.upperFront - 0.15, R.upperFront + 0.4), arch(R.vaultHalf, R.vaultRise, R.upperFront, -4.5)]);

// ---------- nissen ----------
const cuts = [];
// Hoge blinde nissen met boog op de schuine gevels: één in het midden op de twee gevels naast de risaliet, twee per
// gevel op de vijf andere (breedte 1,9 m; de zuiltjes in de bogen zijn smaller dan 0,9 m en weggelaten).
for (const deg of [-45, -135]) cuts.push(onFace(deg, A.shaft, 0, 2.0, H.shaft, H.bayTop - 1.0, 0.35, 1.2));
for (const deg of [0, 45, 90, 135, 180]) for (const c of [-1.75, 1.75]) cuts.push(onFace(deg, A.shaft, c, 1.9, H.shaft, H.bayTop - 1.0, 0.35, 1.13));
// Rondboogfries onder de reservoirzone: vijf boogjes per gevel (0,9 m breed), behalve achter de risaliet.
for (const deg of [-45, 0, 45, 90, 135, 180, -135]) for (const c of [-2.7, -1.35, 0, 1.35, 2.7]) if (!(deg === -45 && c < -2) && !(deg === -135 && c > 2)) cuts.push(onFace(deg, A.shaft, c, 0.9, H.frieze0, H.frieze1 - 0.55, 0.2, 0.55));
// Balustrade (1,2 m dik, zodat er achter de nissen 1 m blijft en de export niets verdikt): per gevel twee vlakken
// tussen de posten als ondiepe nis (de balusters zelf zijn te dun).
const balCuts = [];
for (let k = 0; k < 8; k++) for (const c of [-1.9, 1.9]) balCuts.push(onFace(-90 + 45 * k, A.balOut, c, 2.3, H.walk + 0.45, H.balTop - 0.45, 0.2));
// Risaliet: dubbel venster op 11,1 tot 13,8 m, rondboogfries, ingang tussen de pijlers.
const risCuts = [
  ...[-0.65, 0.65].map((c) => onFace(-90, -R.front, c, 0.9, 11.1, 13.8 - 0.55, 0.3, 0.55)),
  ...[-2.7, -1.35, 0, 1.35, 2.7].map((c) => onFace(-90, -R.front, c, 0.9, H.frieze0 - 0.3, H.frieze1 - 0.85, 0.2, 0.55)),
];
const plinthCuts = [
  onFace(-90, 11.4, 0, 3.0, 0, 5.6, 0.5), // inham tussen de pijlers
  onFace(-90, 10.9, 0, 1.4, 0, 2.0, 0.3, 0.7), // deur met boog
  onFace(-90, 10.9, 0, 1.0, 3.4, 4.5, 0.25, 0.5), // venster in de omlijsting boven de deur
];

const tower = union([
  plinth.subtract(union(plinthCuts)),
  shaft.subtract(union(cuts)),
  tank,
  balustrade.subtract(union(balCuts)),
  dome,
  lantern,
  risalitPlinth.subtract(union(plinthCuts)),
  risalit.subtract(union(risCuts)),
  gable,
]);

await writeLandmark({
  slug: "watertoren-den-haag",
  base: BASE,
  nodes: [["building:watertoren-schacht-risaliet-koepel-en-lantaarn", tower]],
  catalog: {
    name: "Watertoren Den Haag",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, -13.5], [10.5, 0], [-10.5, 0], [0, 10.5], [7.5, 7.5], [-7.5, 7.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0518100000229416"],
    description:
      "Oorsprong op het hart van de achtkante BAG-voetafdruk (apothema 8,55 m) op het maaiveld (NAP +6,85 m), X-as langs de voorgevel, 14,33 graden rechtsom van RD-oost, voorzijde met de ingang naar -Y. Achtkante bakstenen toren op een plint met kroonlijst op 7,3 m; op de schuine gevels hoge blinde nissen met boog, rondboogfries op 23,3 m, uitkragende reservoirzone van 25 tot 30,3 m, kroonlijst op 30,8 m met balustrade tot 33 m; achtkante koepel tot 40,1 m met lantaarn tot 43,35 m (AHN). Risaliet aan de voorzijde met geschoorde plint en ingang, gele hoekpilasters met kapitelen en een frontonlukarne tot 35,25 m. Balusters, zuiltjes en kleine vensters weggelaten. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1874,
      architects: "L.A. Brouwer (architect), Th. Stang (ingenieur)",
      rijksmonument: 477404,
      publishedHeightM: 48.74,
      reservoirsM3: [1000, 1200],
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 50.2,
      octagonApothemM: A.plinth,
      octagonSideM: 7.08,
      corniceM: H.cornice1,
      balustradeM: H.balTop,
      gableTopM: +(H.walk + R.gableRise).toFixed(2),
      domeTopM: +domeZ(A.lantern).toFixed(2),
      topM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Den_Haag) (1874, L.A. Brouwer en Th. Stang, 48,74 m, 1000 + 1200 m³, rijksmonument 477404)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Den_Haag) (Overzicht watertoren met ingangspartij - 's-Gravenhage - 20396134 - RCE.jpg; Water tower The Hague 2020.jpg; Den Haag-Scheveningen, de watertoren RM477404 IMG 0122 2021-08-04 11.11.jpg; Watertoren Den Haag P1290158/P1290159.jpg; Exterieur WATERTOREN, BOVENSTE GEDEELTE - 20308612 - RCE.jpg)",
      "PDOK BAG-pand 0518100000229416, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

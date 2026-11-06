// Watertoren van Amersfoort aan de Utrechtseweg 174, op het hoogste punt van de Amersfoortse Berg (NAP +44,75). Gebouwd
// in 1912 voor het Gemeente Waterleiding Bedrijf naar een ontwerp van Gemeentewerken (gemeentearchitect C.G. Beltman),
// uitgevoerd door T. van Hoogevest; rijksmonument 517738, 17 m hoog, stalen Intze-reservoir van 700 m³ in een niet
// dragende bakstenen schil (Wikipedia en register). Door de hoge ligging is de toren laag en breed: een cilinder in
// overgangsarchitectuur met neoromaanse motieven. Volgens het register: een voet van één bouwlaag op een lage plint met
// in elk van de acht traveeën een dubbel rondboogvenster, behalve de twee ingangspartijen (deur onder een grote
// rondboog met een klein rondboogvenster aan weerszijden; boven de noordelijke ingang een natuurstenen reliëf
// "Gemeente-Waterleiding"); een cordonlijst op de hoogte van het reservoir; daarboven acht spaarvelden tussen lisenen,
// elk bekroond door een rondboogfries, met twee kleine vierruitsvensters en daarboven twee dichtgezette
// rondboogvensters, en in het midden van elke lisene een zeer langwerpig rondboogvenster; bovenaan een door klossen
// gedragen gootlijst met kleine smalle vensters en een bakstenen balustrade die verspringt, met de hoogste delen boven
// de lisenen. Plat dak.
//
// Oorsprong op het hart van BAG-pand 0307100000343441 (cirkel van 50 punten, straal 7,40 m; het platte dak ligt in het
// AHN-DSM concentrisch) op het maaiveld: AHN-DTM NAP +44,75 (ring van 8 tot 12 m: 44,74 à 44,85). +Y wijst naar
// RD-richting 135 graden (noordwest): de hoofdingang aan de Utrechtseweg (de weg loopt op 43 graden; de inrit ligt op
// 140 graden), +X naar 45 graden (noordoost). De tweede ingang is aangenomen tegenover de eerste, naar het erf (-Y).
// Maten: dak en balustrade uit het AHN-DSM 0,5 m (dak NAP +60,1 aan de rand tot +60,35 in het midden, balustrade op 7,0
// tot 7,5 m van het hart NAP +60,8 à +61,35); straal van de top (gootlijst) uit de BAG en de luchtfoto (15 m over de
// balustrade); geledingen uit de RCE-foto "Overzicht van de watertoren - Amersfoort - 20536320 - RCE.jpg" (50,9 px/m op
// de voorkant, verankerd op de AHN-balustrade) en de frontale foto's "Amersfoort - Watertoren 2.JPG" en
// "Amersfoort4840.jpg"; deur en ingang uit "Amersfoort4839.jpg".
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [153551.1, 461702.53];
const AXIS_DEG = 45;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 44.75;
const BASE = -0.3;
const SEG = 128;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints op 9 m, gemeten 2026-11-06: noordwest (ingang,
// +Y) 87,92, noordoost 88,03, zuidoost 88,09, zuidwest 88,17. Het PDOK-pand begint op 87,84.
const GROUND_ELLIPSOID = 87.92;

// Omwenteling van een gesloten profiel [[r, z], ...].
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Massief onder een profiel van onder naar boven, gesloten langs de as.
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Schijf tot r1 tussen z0 en z1 met een onderkant van 50 graden vanaf de straal rIn.
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
// Rondboognis in het vlak met normaal +X op afstand f, breedte w, van z0 tot de aanzet zSpring, op y langs de gevel;
// het boogplafond loopt naar binnen onder circa 63 graden op, buiten de gevel loopt de snede schuin af.
const archNiche = (f, w, z0, zSpring, depth = 0.3, y = 0) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([v, z]) => [a, v, z + 2 * depth]),
    ...arc.map(([v, z]) => [f, v, z]),
    ...arc.map(([v, z]) => [f + 1, v, Math.max(z0, z - 1.5)]),
    [a, -r, z0], [a, r, z0], [f + 1, -r, z0], [f + 1, r, z0],
  ]).translate([0, y, 0]);
};
// Rechthoekige nis met een plafond van 63 graden naar binnen.
const niche = (f, w, z0, z1, depth = 0.25, y = 0) => {
  const a = f - depth, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [f + 1, -w / 2, z0], [a, w / 2, z0], [f + 1, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [f + 1, -w / 2, zb], [f + 1, w / 2, zb]]).translate([0, y, 0]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
// Booglengte s langs een cirkel met straal r als hoek in graden.
const arcDeg = (s, r) => (s / r) * (180 / Math.PI);

// ---------- hoogtes boven het maaiveld (NAP +44,75) ----------
const H = {
  plinth: 0.45, // lage plint, schuin afgezet tot 0,55
  cordon: [5.6, 6.1], // cordonlijst op de voet (natuursteen)
  fieldFoot: 6.5, // onderkant van de spaarvelden (afzaat boven de cordonlijst)
  fieldSpring: 13.2, // aanzet van de rondboogfries (vijf boogjes per veld, kruin 13,65)
  smallWin: [7.0, 7.7], // kleine vierruitsvensters
  blindWin: [9.2, 11.5], // dichtgezette rondboogvensters (aanzet 11,5, kruin 11,8)
  longWin: [7.2, 11.95], // langwerpige vensters in de lisenen (aanzet 11,95, kruin 12,2)
  consoles: [14.0, 15.0], // klossen onder de gootlijst
  gutter: [15.0, 15.35], // gootlijst
  roofEdge: 15.4, // dak binnen de balustrade (AHN NAP +60,1)
  roofTop: 15.6, // midden van het dak (AHN NAP +60,35)
  parapet: 16.05, // bovenkant van de balustrade (AHN NAP +60,8)
  pier: 16.6, // hoge delen boven de lisenen (AHN NAP +61,35)
};
// Stralen.
const R = {
  plinth: 7.2,
  base: 7.1, // voet (een bouwlaag)
  cordon: 7.28,
  shell: 7.0, // schil rond het reservoir, lisenen
  field: 6.8, // spaarvelden 0,2 m terug
  console: 7.4,
  gutter: 7.45, // gootlijst; de BAG-cirkel (7,40) is de dakrand
  parapet: 7.35,
  parapetIn: 6.45, // balustrade 0,9 m dik (in het echt circa 0,4 m)
};

// Traveeën: velden met het midden op 90 + 45k graden (de ingang +Y in het midden van een veld), lisenen ertussen.
const FIELDS = every(8, 90);
const LISENES = every(8, 112.5);
const FIELD_W = 4.5; // van de 5,5 m per travee op de schil; lisene 1,0 m

// ---------- voet ----------
const plinth = solidRev([[R.plinth, BASE], [R.plinth, H.plinth], [R.base, H.plinth + 0.12]]);
const baseWall = solidRev([[R.base, BASE], [R.base, H.cordon[0] + 0.01]]);
const cordon = ledge(R.base, R.cordon, ...H.cordon);
// Per travee een dubbel rondboogvenster (1,2 m breed, borstwering 1,1 m, aanzet 3,1 m, kruin 3,7 m); in de ingangen
// een deur onder een grote rondboog (1,6 m, bovenlicht tot 3,4 m) tussen twee kleine rondboogvensters (0,55 m).
const ENTRANCES = [90, 270];
const winPair = [-0.8, 0.8].map((y) => archNiche(R.base, 1.2, 1.1, 3.1, 0.3, y));
const doorway = [
  archNiche(R.base, 1.6, 0.0, 2.6, 0.35),
  ...[-1.45, 1.45].map((y) => archNiche(R.base, 0.55, 0.95, 2.5, 0.25, y)),
];
const baseOpenings = union([
  ...FIELDS.filter((d) => !ENTRANCES.includes(d)).flatMap((deg) => around(union(winPair), [deg])),
  ...ENTRANCES.flatMap((deg) => around(union(doorway), [deg])),
]);
// Stoep van één trede voor de hoofdingang (+Y).
const doorStep = box(-1.2, R.base - 0.4, BASE, 1.2, R.base + 0.6, 0.2);
const foot = union([plinth, baseWall, cordon, doorStep]).subtract(baseOpenings);

// ---------- schil rond het reservoir ----------
const shell = solidRev([[R.shell, H.cordon[1] - 0.01], [R.shell, H.gutter[0] + 0.01]]);
// Spaarveld: vijf kolommen van 0,9 m, elk radiaal geplaatst, met een rondboogje bovenaan (rondboogfries); het
// boogplafond loopt naar binnen op. De snede wordt beperkt tot de schil buiten R.field.
const fieldInner = solidRev([[R.field, H.fieldFoot - 1], [R.field, H.gutter[1] + 1]]);
const fieldColumn = archNiche(R.shell + 0.02, FIELD_W / 5, H.fieldFoot, H.fieldSpring, R.shell - R.field + 0.1);
const fieldCut = union(FIELDS.flatMap((deg) => [-2, -1, 0, 1, 2].map((k) => place(fieldColumn, { deg: deg + k * arcDeg(FIELD_W / 5, R.shell) }))))
  .subtract(fieldInner);
// In elk veld twee kleine vierruitsvensters en daarboven twee dichtgezette rondboogvensters (0,6 m), op ±0,9 m.
const fieldWins = FIELDS.flatMap((deg) => [-1, 1].flatMap((s) => {
  const d = deg + s * arcDeg(0.9, R.field);
  return [
    place(niche(R.field, 0.6, ...H.smallWin, 0.25), { deg: d }),
    place(archNiche(R.field, 0.6, H.blindWin[0], H.blindWin[1], 0.25), { deg: d }),
  ];
}));
// Langwerpig rondboogvenster (0,45 m) in het midden van elke lisene.
const longWins = around(archNiche(R.shell, 0.45, H.longWin[0], H.longWin[1], 0.3), LISENES);
// De kleine smalle vensters in de fries onder de gootlijst (circa 0,45 × 0,4 m) zijn weggelaten: tussen de kruinen
// van de rondboogfries en de 50-gradenonderkant van de gootlijst blijft geen ruimte voor een nis met een schuin plafond
// (een vlak plafond liet de export opvullen, een kleinere nis liet losse snippers achter).
const shellAll = shell.subtract(union([fieldCut, ...fieldWins, ...longWins]));

// ---------- klossen, gootlijst, balustrade en dak ----------
// Zestien klossen (0,5 m breed) boven de lisenen en de veldmiddens, onderkant onder 50 graden.
const consoleOne = hull([
  [R.shell - 0.2, -0.25, H.consoles[0]], [R.shell - 0.2, 0.25, H.consoles[0]],
  [R.console, -0.25, H.consoles[0] + 1.2 * (R.console - R.shell + 0.2)], [R.console, 0.25, H.consoles[0] + 1.2 * (R.console - R.shell + 0.2)],
  [R.console, -0.25, H.consoles[1]], [R.console, 0.25, H.consoles[1]],
  [R.shell - 0.2, -0.25, H.consoles[1]], [R.shell - 0.2, 0.25, H.consoles[1]],
]);
const consoles = union(around(consoleOne, [...FIELDS, ...LISENES]));
const gutter = ledge(R.shell, R.gutter, ...H.gutter);
// Balustrade: ring van 0,9 m dik tot 16,05 m, met hoge delen van 1,2 m breed boven de lisenen tot 16,6 m.
const parapet = rev([[R.parapetIn, H.gutter[1] - 0.01], [R.parapet, H.gutter[1] - 0.01], [R.parapet, H.parapet], [R.parapetIn, H.parapet]]);
const pierOne = hull([
  [R.parapetIn + 0.05, -0.6, H.parapet - 0.01], [R.parapet - 0.02, -0.6, H.parapet - 0.01],
  [R.parapetIn + 0.05, 0.6, H.parapet - 0.01], [R.parapet - 0.02, 0.6, H.parapet - 0.01],
  [R.parapetIn + 0.05, -0.6, H.pier], [R.parapet - 0.02, -0.6, H.pier],
  [R.parapetIn + 0.05, 0.6, H.pier], [R.parapet - 0.02, 0.6, H.pier],
]);
const piers = union(around(pierOne, LISENES));
// Plat dak, licht oplopend naar het midden (AHN 60,1 tot 60,35).
const roof = solidRev([[R.parapetIn + 0.02, H.gutter[1] - 0.01], [R.parapetIn + 0.02, H.roofEdge], [0.01, H.roofTop]]);
// Dakopbouw (nieuwer dan het AHN-DSM, wel in de luchtfoto, de 3D BAG en de PDOK-reconstructie): een vierkant hokje van
// 3,6 m langs de assen van het model met een tentdak (top 17,2 m; 3D BAG max NAP +61,94), en ten noordoosten ervan een
// installatieblok van 1,4 × 3,0 m tot 16,5 m. De zonnepanelen (lager dan 0,9 m) zijn weggelaten.
const HUT = { half: 1.8, eaves: 16.2, top: 17.2 };
const hut = hull([
  ...[[-1, -1], [1, -1], [1, 1], [-1, 1]].flatMap(([a, b]) => [[a * HUT.half, b * HUT.half, H.roofEdge], [a * HUT.half, b * HUT.half, HUT.eaves]]),
  [0, 0, HUT.top],
]);
const plant = box(HUT.half - 0.05, -1.5, H.roofEdge, HUT.half + 1.4, 1.5, 16.5);
const crown = union([consoles, gutter, parapet, piers, roof, hut, plant]);

const tower = union([foot, shellAll, crown]);

await writeLandmark({
  slug: "watertoren-amersfoort",
  base: BASE,
  nodes: [["building:watertoren-voet-spaarvelden-lisenen-gootlijst-en-balustrade", tower]],
  catalog: {
    name: "Watertoren Amersfoort",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-9, 0], [0, 9], [0, -9]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0307100000343441"],
    description:
      "Oorsprong op het hart van het ronde BAG-pand op het maaiveld (NAP +44,75 m), +X naar RD-richting 45 graden, +Y naar 135 graden (noordwest): de hoofdingang aan de Utrechtseweg. Lage brede cilinder van 14,2 m: voet van een bouwlaag op een plint met dubbele rondboogvensters en twee ingangen (deur onder een grote rondboog tussen twee kleine rondboogvensters), cordonlijst op 6,1 m; schil met acht spaarvelden onder een rondboogfries, kleine en dichtgezette vensters, lisenen met langwerpige vensters; zestien klossen onder de gootlijst, balustrade tot 16,05 m met hoge delen boven de lisenen tot 16,6 m; plat dak met een hokje onder een tentdak tot 17,2 m en een installatieblok. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1912,
      architect: "Gemeentewerken Amersfoort (C.G. Beltman)",
      publishedHeightM: 17,
      registerDiameterM: 12,
      reservoirM3: 700,
      monument: 517738,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: [60.1, 60.35],
      ahnParapetNapM: [60.8, 61.35],
      baseDiameterM: R.base * 2,
      shellDiameterM: R.shell * 2,
      gutterDiameterM: R.gutter * 2,
      cordonM: H.cordon,
      gutterM: H.gutter,
      parapetM: H.parapet,
      parapetPierM: H.pier,
      roofHutTopM: HUT.top,
      photoScalePxPerM: 50.9,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/517738 (1912, Gemeentewerken/C.G. Beltman, cilinder van 12 m doorsnede en 17 m hoog, Intze-reservoir, voet, cordonlijst, spaarvelden met rondboogfries, lisenen met langwerpige vensters, klossen, gootlijst met kleine vensters, verspringende balustrade, twee ingangspartijen)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Amersfoort) (Utrechtseweg 174, 17 m, 700 m³)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Amersfoort_-_20536320_-_RCE.jpg (geledingen, schaal 50,9 px/m)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Amersfoort_-_20536319_-_RCE.jpg, File:Amersfoort_-_Watertoren_1.JPG, File:Amersfoort_-_Watertoren_2.JPG, File:Amersfoort4840.jpg (voet, vensters, spaarvelden, klossen, balustrade)",
      "https://commons.wikimedia.org/wiki/File:Amersfoort4839.jpg en File:Amersfoort4830.jpg (ingang)",
      "PDOK BAG-pand 0307100000343441, BGT, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

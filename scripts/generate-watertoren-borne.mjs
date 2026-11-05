// Watertoren van Borne aan de Watertorenstraat (1932), ontwerp J.H.J. Kording, gebouwd door aannemer Groothengel uit
// Borne; volgens Wikipedia 36,5 m hoog met een reservoir van 240 m³ (gemeentelijk monument). Een ronde bakstenen toren
// van 10,1 m doorsnede (BAG-pand 0147100000011259: 38 hoekpunten, binnen 5 cm op een cirkel met straal 5,05 m). Een
// lage plint, een gladde schacht met op vier assen een smalle lichtstrook van circa 19 m, een sluitsteen onder een
// uitkragende band op circa 23 m, en daarboven het reservoirdeel: op elk van de vier assen een groep van drie
// lisenen met twee hoge vensters ertussen die boven de borstwering uitsteekt, geflankeerd door twee bredere lisenen;
// tussen de groepen blokvormige consoles langs de bovenrand (in het echt kleiner en dichter dan hier). Een zestienzijdig
// koperen tentdak binnen de borstwering met een makelaar. Aan de zuidzuidwestkant de ingang met een luifel.
//
// Oorsprong op het hart van het BAG-pand (cirkelfit, RD [248908.68, 479836.94]) op het maaiveld, AHN-DTM NAP +15,7
// (ring van 6 tot 9,5 m: 15,66 tot 15,97, mediaan 15,77; 3D BAG-maaiveld 15,65). Lokale +X wijst naar RD -24 graden:
// dat is een van de vier assen met een lisenengroep. De assen staan op RD -24, 66, 156 en 246 graden: twee foto's met
// bekende standplaats (Commons "Watertoren Borne.jpg" vanuit het oosten, "Watertoren aan de Watertorenstraat te
// Borne.jpg" vanuit het noordnoordwesten) tonen de lichtstroken op 45 graden links en rechts van de kijkrichting, en het
// AHN-DSM heeft de hoogste randpunten (de groepen boven de borstwering) op 330-345 en 60-75 graden. De ingang zit op de
// as naar -Y (RD 246 graden), aan de kant van het pad naar het pompgebouw in het zuiden (luchtfoto); geschat.
// Hoogtes: borstwering en dak uit het AHN-DSM 0,5 m (rand NAP +47,7 = 32,0 m, dak verloopt 40 graden van 32,0 m op
// apothema 4,3 m tot de top op 35,65 m; 3D BAG h_dak_max NAP +51,24), de top van de makelaar uit Wikipedia (36,5 m);
// geledingen (band, vensters, consoles, luifel) uit de RCE-foto's 20297461 en 20297462 (1987) en 20427884 (1983), met
// de schaal uit de doorsnede van de toren; onzekerheid circa een halve meter.
import { hull, union, prism, box, place, circle, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [248908.68, 479836.94];
const DEG = -24;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 15.7;
// Terugval: NAP +15,7 plus de geoïdehoogte (circa 43,1 m; Watertoren Almelo 1924, 7 km noordwest, mat PDOK 54,23 op
// NAP +11,15).
const GROUND_ELLIPSOID = 58.8;
const N = 64; // segmenten van de ronde delen

// Stralen (m) en hoogtes boven maaiveld.
const R = {
  plinth: 5.05, // plint = BAG-contour
  shaft: 4.9, // schacht boven de plint
  band: 5.2, // uitkragende band onder het reservoirdeel
  stage: 5.0, // reservoirdeel (AHN-DSM: rand tot 5,0 m)
  roof: 4.3, // apothema van het zestienzijdige dak aan de voet (AHN-DSM)
};
const H = {
  plinth: 1.2,
  canopy: [2.9, 4.2], // luifel boven de ingang: onderkant aan de gevel, bovenkant
  door: 2.3,
  slit: [3.6, 22.2], // lichtstroken in de schacht
  keystone: 22.2, // sluitsteen boven elke lichtstrook, tot de band
  band: [23.0, 24.0],
  windows: [25.2, 31.2], // twee hoge vensters per groep
  consoles: [31.3, 32.3],
  parapet: 32.0, // bovenkant borstwering (AHN-DSM NAP +47,7)
  lisene: 32.4, // flankerende lisenen
  group: 33.0, // lisenengroep boven de borstwering
  roofTop: 35.65, // top van het dak (AHN-DSM NAP +51,3)
  finial: 36.5, // makelaar (Wikipedia: 36,5 m)
};

const cyl = (r, z0, z1) => prism(circle([0, 0], r, N), z0, z1);
// Nis in een vlak met normaal +X op afstand f: w breed rond y, van z0 tot z1, plafond onder 63 graden naar binnen.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]).translate([0, y, 0]);
};
// Blok op de +X-as van x0 tot x1, w breed, van z0 tot z1, met een onderkant die vanaf xw (de gevel, op z0) k meter
// stijgt per meter naar buiten (k = 1: 45 graden).
const corbelBlock = (xw, x0, x1, w, z0, z1, k = 1) => hull([
  [x0, -w / 2, z0 - k * (xw - x0)], [x0, w / 2, z0 - k * (xw - x0)], [xw, -w / 2, z0], [xw, w / 2, z0],
  [x1, -w / 2, z0 + k * (x1 - xw)], [x1, w / 2, z0 + k * (x1 - xw)],
  [x0, -w / 2, z1], [x0, w / 2, z1], [x1, -w / 2, z1], [x1, w / 2, z1],
]);
const AXES = [0, 90, 180, 270];
const ENTRANCE = 270; // -Y, RD 246 graden
const onAxes = (m, degs = AXES) => degs.map((deg) => place(m, { deg }));

// ---------- plint, schacht, band ----------
const plinth = union([cyl(R.plinth, BASE, H.plinth), hull([...circle([0, 0], R.plinth, N).map(([x, y]) => [x, y, H.plinth - 0.01]), ...circle([0, 0], R.shaft, N).map(([x, y]) => [x, y, H.plinth + 0.15])])]);
const shaft = cyl(R.shaft, H.plinth, H.band[0] + 0.01);
// Band: 0,3 m uit over de schacht met een onderkant van 45 graden.
const band = union([
  hull([...circle([0, 0], R.shaft, N).map(([x, y]) => [x, y, H.band[0] - (R.band - R.shaft)]), ...circle([0, 0], R.band, N).map(([x, y]) => [x, y, H.band[0]]), ...circle([0, 0], R.band, N).map(([x, y]) => [x, y, H.band[1]])]),
]);
// Sluitsteen 1,0 m breed, 0,25 m voor de schacht, onder de band; onderkant 50 graden (45 gaf een sliver opvulling).
const keystones = onAxes(corbelBlock(R.shaft, R.shaft - 0.3, R.shaft + 0.25, 1.0, H.keystone + 0.25, H.band[0] + 0.05, 1.2));

// ---------- reservoirdeel ----------
const stage = cyl(R.stage, H.band[1] - 0.01, H.parapet);
// Lisenengroep: 2,6 m breed, voorvlak 0,25 m voor de gevel, 0,95 m dik zodat het deel boven de borstwering stevig is. Hij
// begint in de band met een onderkant onder 45 graden (de hoeken steken buiten de band uit).
const groupBlock = corbelBlock(R.shaft, R.roof, R.stage + 0.25, 2.6, H.band[0] + 0.3, H.group);
// Twee vensters van 0,45 m tussen de drie lisenen (0,55 m breed), als nis van 0,35 m.
const groupWindows = [-0.5, 0.5].map((y) => niche(R.stage + 0.25, 0.45, ...H.windows, 0.35, y));
// Inkeping van 0,45 m tussen de lisenen boven de borstwering, tot 0,6 m onder de top (blind, 0,3 m diep).
const groupNotches = [-0.5, 0.5].map((y) => box(R.stage - 0.05, y - 0.225, H.group - 0.6, R.stage + 0.5, y + 0.225, H.group + 1));
const group = groupBlock.subtract(union([...groupWindows, ...groupNotches]));
// Flankerende lisenen: 0,9 m breed, 0,15 m voor de gevel en 0,9 m dik, op 20 graden naast de as, tot 32,4 m.
const LISENE_DEG = 20;
const lisene = box(R.stage - 0.75, -0.45, H.band[1] - 0.01, R.stage + 0.15, 0.45, H.lisene);
const lisenes = AXES.flatMap((deg) => [place(lisene, { deg: deg - LISENE_DEG }), place(lisene, { deg: deg + LISENE_DEG })]);
// Consoles tussen de groepen: twee per kwadrant op 35 en 55 graden van de as, 0,9 m breed en 0,25 m uit, onderkant 45 graden.
const consoleBlock = corbelBlock(R.stage, R.stage - 0.4, R.stage + 0.25, 0.9, H.consoles[0], H.consoles[1]);
const consoles = AXES.flatMap((deg) => [35, 55].map((d) => place(consoleBlock, { deg: deg + d })));

// ---------- dak en makelaar ----------
const C16 = Math.cos(Math.PI / 16);
const roof = hull([...circle([0, 0], R.roof / C16, 16, Math.PI / 16).map(([x, y]) => [x, y, H.parapet - 0.01]), [0, 0, H.roofTop]]);
const finial = union([
  prism(circle([0, 0], 0.5, 16), H.roofTop - 0.6, H.roofTop + 0.15),
  hull([...circle([0, 0], 0.5, 16).map(([x, y]) => [x, y, H.roofTop + 0.14]), [0, 0, H.finial]]),
]);

// ---------- ingang (gebouwd op +X, gedraaid naar -Y) ----------
// Luifel 3,0 m breed, 0,7 m voor de plint, onderkant onder 56 graden van 2,9 m aan de gevel naar 3,95 m aan de voorkant,
// 0,6 m boven de deur: begint de luifel direct op de bovendorpel, dan hangt hij boven de deurnis en vult de export hem op.
const canopy = corbelBlock(R.plinth, R.shaft - 0.3, R.plinth + 0.7, 3.0, H.canopy[0], H.canopy[1], 1.5);
const door = niche(R.plinth, 2.0, BASE - 0.1, H.door, 0.4);

// ---------- openingen ----------
const slits = onAxes(niche(R.shaft, 0.5, H.slit[0], H.slit[1], 0.3));

const tower = union([plinth, shaft, band, ...keystones, stage, ...onAxes(group), ...lisenes, ...consoles, roof, finial, place(canopy, { deg: ENTRANCE })])
  .subtract(union([...slits, place(door, { deg: ENTRANCE })]));

await writeLandmark({
  slug: "watertoren-borne",
  base: BASE,
  nodes: [["building:ronde-schacht-reservoirdeel-lisenen-dak-en-ingang", tower]],
  catalog: {
    name: "Watertoren Borne",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Ellipsoïdisch: NAP +15,7 plus de geoïdehoogte (circa 43,1 m).
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0147100000011259"],
    description:
      "Oorsprong op het hart van het ronde BAG-pand op maaiveld (NAP +15,7 m), +X naar RD -24 graden langs een van de vier assen met een lisenengroep, ingang met luifel naar -Y (RD 246 graden). Plint van 10,1 m, schacht van 9,8 m met vier lichtstroken en sluitstenen, een uitkragende band op 23-24 m, reservoirdeel van 10,0 m met vier groepen van drie lisenen en twee hoge vensters tot 33,0 m, flankerende lisenen, consoles langs de borstwering op 32,0 m, zestienzijdig tentdak tot 35,65 m en makelaar tot 36,5 m. Maten uit BAG, AHN, Wikipedia en foto's.",
    realWorld: {
      built: 1932,
      architect: "J.H.J. Kording",
      publishedHeightM: 36.5,
      reservoirM3: 240,
      ahnGroundNapM: GROUND_NAP,
      ahnParapetNapM: 47.7,
      ahnRoofTopNapM: 51.3,
      bag3dRoofMaxNapM: 51.24,
      plinthDiameterM: R.plinth * 2,
      shaftDiameterM: R.shaft * 2,
      stageDiameterM: R.stage * 2,
      bandM: H.band,
      slitsM: H.slit,
      windowsM: H.windows,
      parapetM: H.parapet,
      groupTopM: H.group,
      roofM: [H.parapet, H.roofTop],
      finialM: H.finial,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Borne) (1932, J.H.J. Kording, aannemer Groothengel, 36,5 m, 240 m³)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_OVERZICHT_-_Borne_-_20297461_-_RCE.jpg en File:Exterieur_BOVENSTUK_-_Borne_-_20297462_-_RCE.jpg (1987: lichtstrook, ingang met luifel, band, sluitsteen, lisenengroep met vensters, consoles, makelaar)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_van_de_watertoren_-_Borne_-_20427884_-_RCE.jpg (1983, van afstand: geledingen, tentdak, groepen op 45 graden)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Borne.jpg en File:Watertoren_aan_de_Watertorenstraat_te_Borne.jpg (standplaats bekend: richting van de assen)",
      "PDOK BAG-pand 0147100000011259, AHN DSM/DTM 0,5 m en luchtfoto (actueel, 2021-2023), 2026-11-05",
      "3D BAG pand NL.IMBAG.Pand.0147100000011259 (maaiveld NAP +15,65, h_dak_max +51,24)",
    ],
  },
});

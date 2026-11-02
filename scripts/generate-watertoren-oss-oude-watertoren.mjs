// Oude watertoren aan de Watertorenstraat (1) in Oss: 1935, in opdracht van
// het Rijksbureau voor Drinkwatervoorziening, ontwerp (waarschijnlijk)
// J.H.J. Kording, rijksmonument 516605, 48 tot 48,5 m hoog met een dubbel
// reservoir van 2 × 300 m³. Sinds 1978/1985 van de Turkse moskeevereniging:
// de ISN Ulu Moskee staat in de eenlaagse aanbouwen aan de west- en noordkant
// (een eigen BAG-pand, buiten de bescherming); op de begane grond van de toren
// zit een winkel. Late Amsterdamse School in verstrakte vormen: een ronde
// bakstenen schacht om een betonskelet, met op de plaats van het skelet zes
// brede bakstenen pilasters tot boven de tussenverdieping. Die smalle
// tussenverdieping (de lekvloer onder het reservoir) is per travee een
// uitspringend gebogen paneel met vier lage vensters tussen betonnen randen,
// onder met een schuine kraag. Daarboven een gladde ronde reservoirmantel,
// iets smaller dan de pilasters, met per travee een hoog smal venster van
// glasstenen en bovenaan een kleine console onder de dakrand; een ronde
// koperen spits met flauwe helling. Per travee in de schacht een smal hoog
// venster in stalen kozijnen; de rondboogingang met een kleine trap aan de
// zuidkant, naar de parkeerplaats.
//
// Oorsprong op het zwaartepunt van de BAG-contour (pand 0828100001593611,
// 138,7 m²: de cirkel van de schacht, r 6,4 m, met de zes pilasters tot 7,0 m)
// op maaiveld (3D BAG NAP +6,76 m; AHN-DTM 6,8). De pilasters staan in de
// BAG-contour op -1 + 60k graden van RD-oost (gemeten: -2,2, 0,7, -2,3, 0,1,
// -1,2): lokale +X is de oostelijke pilaster, de travees staan op 30 + 60k
// graden. Hoogtes uit het AHN-DSM 0,5 m en de 3D BAG: dakrand NAP +49,4
// (42,7 m), spits NAP +55,2 (48,4 m; Wikipedia 48,5, register 48,0), helling
// van de spits 0,95 (AHN, mediaan per straal). Het AHN ziet de bovenkant tot
// circa 6,7 m uit het hart; de mantel staat er tot 0,4 m zuidelijker dan de
// BAG-contour (binnen de meetfout, de BAG is aangehouden). Breedtes en de
// hoogtes van paneel, pilasterkoppen, vensters en consoles uit de Commons-foto
// "Oss, watertoren foto3" (telelens van de Watertorenstraat in het westen,
// 28,3 px/m op de mantel): reservoirmantel 0,94 maal de pilasters.
import { hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [163834.11, 419681.4];
const ROT = -1; // pilasters in graden linksom van RD-oost
const AXIS = [+Math.cos((ROT * Math.PI) / 180).toFixed(4), +Math.sin((ROT * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 6.76; // 3D BAG maaiveld (AHN-DTM in een ring van 7 tot 8 m: 6,8 tot 7,3 op de parkeerplaats)
const GEOID_N = 43.65; // NLGEO2018-geoïdehoogte op de oorsprong

const R = {
  wall: 6.4, // bakstenen schacht tussen de pilasters (BAG: koorden op 6,24 tot 6,6)
  pierIn: 6.0, // pilasters beginnen in de wand
  pier: 7.0, // buitenkant van de pilasters (BAG: 6,93 tot 7,05)
  panel: 6.8, // uitspringend paneel van de tussenverdieping
  coping: 6.9, // betonnen rand op het paneel
  mantle: 6.6, // reservoirmantel (foto: 0,94 maal de pilasters; AHN tot circa 6,7)
  rim: 6.75, // dakrand
  cone: 6.1, // voet van de koperen spits binnen de dakrand
};
const H = {
  panelFoot: 27.0, // kraag van 45 graden van de wand naar het paneel
  panel: 27.4,
  copingFoot: 31.3,
  copingTop: 31.6,
  mantleFoot: 32.2, // schuine betonrand van het paneel naar de mantel
  pierTop: 33.2, // pilasterkop, 1 m boven de rand van het paneel
  rimFoot: 41.55,
  rim: 41.7,
  rimTop: 42.7, // dakrand (AHN NAP +49,4)
  apex: 48.4, // spits (AHN NAP +55,15 tot +55,2)
};
const SEG = 96;
const rad = (deg) => (deg * Math.PI) / 180;
const PIERS = Array.from({ length: 6 }, (_, k) => k * 60);
const BAYS = Array.from({ length: 6 }, (_, k) => 30 + k * 60);
const DOOR_BAY = 270; // RD 269 graden: zuid, naar de parkeerplaats (foto "Oss Watertoren 1")
const cyl = (r, z0, z1) => hull([...ring3(circle([0, 0], r, SEG), z0), ...ring3(circle([0, 0], r, SEG), z1)]);
// Kraag: van straal r0 op z0 naar r1 op z1 (afgeknotte kegel).
const flare = (r0, z0, r1, z1) => hull([...ring3(circle([0, 0], r0, SEG), z0), ...ring3(circle([0, 0], r1, SEG), z1)]);
// Rechthoek in het straalstelsel (x radiaal, y tangentiaal) als hull-punten.
const slab = (x0, x1, w, z0, z1) => hull([[x0, -w / 2, z0], [x1, -w / 2, z0], [x0, w / 2, z0], [x1, w / 2, z0], [x0, -w / 2, z1], [x1, -w / 2, z1], [x0, w / 2, z1], [x1, w / 2, z1]]);

// ---------- schacht, tussenverdieping en reservoirmantel ----------
const shaft = union([
  cyl(R.wall, BASE, H.panelFoot + 0.05),
  // Paneel van de tussenverdieping: 0,4 m uit met een kraag van 45 graden, betonrand 0,1 m verder uit (45 graden),
  // bovenkant schuin terug naar de mantel.
  flare(R.wall, H.panelFoot, R.panel, H.panel),
  cyl(R.panel, H.panel - 0.05, H.copingFoot + 0.05),
  flare(R.panel, H.copingFoot, R.coping, H.copingFoot + 0.1),
  cyl(R.coping, H.copingFoot + 0.05, H.copingTop),
  flare(R.coping, H.copingTop - 0.05, R.mantle, H.mantleFoot),
  cyl(R.mantle, H.copingTop, H.rimFoot + 0.05),
  // Dakrand 0,15 m uit (45 graden) en de koperen spits binnen de rand.
  flare(R.mantle, H.rimFoot, R.rim, H.rim),
  cyl(R.rim, H.rim - 0.05, H.rimTop),
  hull([...ring3(circle([0, 0], R.cone, SEG), H.rimTop - 0.05), [0, 0, H.apex]]),
]);

// Pilaster: 2,0 m breed, van de wand tot 7,0 m uit het hart, kop met een afschuining van 45 graden.
const PIER_W = 2.0;
const pier = hull([
  [R.pierIn, -PIER_W / 2, BASE], [R.pier, -PIER_W / 2, BASE], [R.pierIn, PIER_W / 2, BASE], [R.pier, PIER_W / 2, BASE],
  [R.pierIn, -PIER_W / 2, H.pierTop - 0.3], [R.pier, -PIER_W / 2, H.pierTop - 0.3], [R.pierIn, PIER_W / 2, H.pierTop - 0.3], [R.pier, PIER_W / 2, H.pierTop - 0.3],
  [R.pierIn, -PIER_W / 2, H.pierTop], [R.pier - 0.3, -PIER_W / 2, H.pierTop], [R.pierIn, PIER_W / 2, H.pierTop], [R.pier - 0.3, PIER_W / 2, H.pierTop],
]);
const piers = PIERS.map((d) => place(pier, { deg: d }));

// Per travee: sluitsteen onder het paneel (1,0 m breed, 0,25 m uit, kraag 45 graden) en een console onder de dakrand
// (1,2 m breed, 0,3 m uit de mantel, puntig onder 45 graden).
const keystone = hull([
  [R.wall - 0.3, -0.5, 26.0], [R.wall - 0.3, 0.5, 26.0], [R.wall, -0.5, 26.0], [R.wall, 0.5, 26.0],
  [R.wall - 0.3, -0.5, H.panel], [R.wall - 0.3, 0.5, H.panel], [R.wall + 0.25, -0.5, 26.25], [R.wall + 0.25, 0.5, 26.25],
  [R.wall + 0.25, -0.5, H.panel], [R.wall + 0.25, 0.5, H.panel],
]);
const console_ = hull([
  [R.mantle - 0.3, -0.6, 39.6], [R.mantle - 0.3, 0.6, 39.6], [R.mantle, -0.6, 39.6], [R.mantle, 0.6, 39.6],
  [R.mantle + 0.3, -0.6, 39.9], [R.mantle + 0.3, 0.6, 39.9], [R.mantle + 0.3, -0.6, H.rim], [R.mantle + 0.3, 0.6, H.rim],
  [R.mantle - 0.3, -0.6, H.rim], [R.mantle - 0.3, 0.6, H.rim],
]);
const bayParts = BAYS.flatMap((d) => [place(keystone, { deg: d }), place(console_, { deg: d })]);

// ---------- vensters en ingang als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f, midden op y = c.
const niche = (f, w, z0, z1, depth = 0.3, c = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = c - w / 2, y1 = c + w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
const cutsPerBay = (bay) => [
  // Schacht: één smal hoog venster per travee (boven de ingang vanaf 5,6 m).
  niche(R.wall, 0.6, bay === DOOR_BAY ? 5.6 : 6.0, 25.6),
  // Tussenverdieping: vier lage smalle vensters in het paneel.
  ...[-1.2, -0.4, 0.4, 1.2].map((c) => niche(R.panel, 0.4, 29.2, 30.8, 0.3, c)),
  // Reservoirmantel: hoog smal venster met glasstenen.
  niche(R.mantle, 0.5, 34.8, 39.2),
];
// Rondboogingang als nis met een spitse top (56 graden): 1,6 m breed tot 2,6 m, top op 3,4 m.
const door = hull([[0, 0], [0.8, 0], [0.8, 2.6], [0, 3.4], [-0.8, 2.6], [-0.8, 0]].flatMap(([y, z]) => [[R.wall - 0.4, y, z === 0 ? BASE + 0.3 : z], [R.wall + 1, y, z === 0 ? BASE + 0.3 : z]]));
const cuts = [...BAYS.flatMap((d) => cutsPerBay(d).map((n) => place(n, { deg: d }))), place(door, { deg: DOOR_BAY })];

const all = union([shaft, ...piers, ...bayParts]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-oss-oude-watertoren",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-pilasters-reservoir-en-spits", all]],
  catalog: {
    name: "Oude watertoren Oss",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Alleen de vrije zuid- en oostkant: west en noord staan de aanbouwen van de moskee.
    groundSamplePoints: [[7.6, 0], [0, -7.6], [5.4, -5.4], [-5.4, -5.4]],
    // Ellipsoïdisch: NAP +6,76 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0828100001593611"],
    description:
      "Oorsprong op het zwaartepunt van de BAG-contour op maaiveld (NAP +6,76 m), +X langs de oostelijke pilaster (1 graad rechtsom van RD-oost). Ronde bakstenen schacht van 12,8 m met zes pilasters van 2 m breed tot 14 m over de pilasters, tot 33,2 m; daartussen de uitspringende panelen van de tussenverdieping (27–32 m) met vier lage vensters en een betonrand; daarboven de ronde reservoirmantel van 13,2 m met per travee een hoog smal venster en een console onder de dakrand op 42,7 m; ronde koperen spits tot 48,4 m. Smalle hoge vensters per travee en de rondboogingang (zuid) als nissen. Maten uit BAG, AHN, 3D BAG en foto's.",
    realWorld: {
      publishedHeightM: 48.5,
      registerHeightM: 48.0,
      reservoirM3: [300, 300],
      built: 1935,
      architect: "J.H.J. Kording (register: waarschijnlijk)",
      rijksmonument: 516605,
      groundNapM: GROUND_NAP,
      ahnRimNapM: 49.4,
      ahnApexNapM: 55.15,
      ahnSpireSlope: 0.95,
      geoidNlgeo2018M: GEOID_N,
      piersDeg: ROT,
      shaftDiameterM: R.wall * 2,
      acrossPiersM: R.pier * 2,
      mantleDiameterM: R.mantle * 2,
      mezzanineM: [H.panelFoot, H.mantleFoot],
      pierTopM: H.pierTop,
      rimTopM: H.rimTop,
      modelTopM: H.apex,
      photoScalePxPerM: 28.3,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Oude_watertoren_(Oss)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/516605 (1935, waarschijnlijk Kording, Late Amsterdamse School, 48,0 m, ronde schacht met pilasters, tussenverdieping met vier vensters per travee, hoge vensters met glasstenen naast het reservoir, ronde koperen spits, rondboogingang)",
      "https://commons.wikimedia.org/wiki/File:Oss,_watertoren_foto3_2016-04-20_13.58.jpg (telelens vanuit het westen, maten)",
      "https://commons.wikimedia.org/wiki/File:Oss_Watertoren_1.jpg, Watertoren_Oss.jpg, Watertorenstraat_Oss_ri_oost_va_Bermakker.jpg (zuidkant met de ingang, westkant)",
      "PDOK BAG-pand 0828100001593611, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "3D BAG (LoD2.2) van pand 0828100001593611: maaiveld, dakrand en spits ter controle",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,65 m) voor groundHeight",
    ],
  },
});

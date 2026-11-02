// Watertoren op het terrein van textielfabriek Raymakers in Helmond, aan de
// Kanaaldijk N.W. ten noorden van het oude fabrieksgebouw (rijksmonument 21445).
// Gebouwd in 1948 naar ontwerp van S.L.A. Orie, met twee reservoirs van 150 en
// 35 m³ (Wikipedia). Een vierkante schacht van 5,1 m met grijze hoekpenanten,
// wit gepleisterde panelen met een ruitpatroon en een vensterband onder een
// overstekende dakplaat; daarop een uurwerklantaarn met vier wijzerplaten,
// een kap, een lage koepel en een nest met een groene adelaar.
//
// De toren staat in de zuidgevel van het fabriekscomplex, op de hoek van de
// sheddakhal (west) en het blok van vier lagen (oost), en hoort bij hetzelfde
// BAG-pand (0794100000396381, 1926). PDOK reconstrueert de toren als een blok
// tot NAP +48,9 met een piramide tot 55,5 m; om dat te verbergen vervangt dit
// model het hele pand: de toren gedetailleerd, de fabriek als blokken en
// dakvlakken op de BAG-contour met de hoogtes uit het AHN en de 3D BAG.
//
// Oorsprong op het hart van de schacht (BAG-uitsprong 173289,0 tot 173294,1 en
// de noordwand van de 3D BAG op 388056,0) op maaiveld (AHN-DTM NAP +17,12);
// +X naar RD-oost.
import { Manifold, CrossSection, prism, box, rect, union, hull, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [173291.55, 388053.45];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 17.12; // AHN-DTM op het fabrieksplein rond de toren (17,09 tot 17,15)
const GEOID_N = 43.94; // NLGEO2018-geoïdehoogte op de oorsprong
const z = (nap) => +(nap - GROUND_NAP).toFixed(3);
const L = ([x, y]) => [+(x - ORIGIN[0]).toFixed(3), +(y - ORIGIN[1]).toFixed(3)];

// ---------- toren ----------
const T = {
  half: 2.55, // schacht 5,1 m (BAG)
  pier: 0.8, // hoekpenanten
  recessLow: 0.2, // bakstenen vlakken tussen de penanten onder het fabrieksdak
  recess: 0.3, // gepleisterde panelen en baksteenband
  recessGlass: 0.45, // vensterband
  panelFrom: 18.0, // witte panelen vanaf de dakrand van het oostblok (foto)
  glassFrom: 28.9,
  slabBot: 31.2,
  slabTop: z(48.92), // AHN 48,9 tot 49,1; 3D BAG 48,87 tot 48,93
  slabHalf: 3.4, // dakplaat 6,8 m (AHN 6,2 tot 7,0; foto 6,7)
  lantHalf: 1.7, // uurwerklantaarn 3,4 m (foto)
  lantPier: 0.6,
  clockFrom: 0.6, // wijzerplaatnis 0,6 m boven de dakplaat
  clockRecess: 0.2,
  capBot: z(52.62),
  capTop: z(53.15), // AHN-rand 53,1 tot 53,4; 3D BAG 53,05
  capHalf: 1.95, // kap 3,9 m (foto, AHN 3,6 tot 4,0)
  domeR: 1.8, // lage koepel bijna zo breed als de lantaarn (foto)
  domeTop: z(54.45), // AHN 54,5 tot 54,6 rond het nest
  nestR0: 0.65, // nest van baksteen, iets uitlopend (foto: 1,3 tot 1,6 m breed)
  nestR1: 0.8,
  nestTop: z(55.25), // foto: nest circa 1 m hoog; het hoogste AHN-punt (NAP 55,55) is het lijf van de adelaar
  eagleTop: z(56.8), // foto: vleugelpunten circa 1,5 m boven het nest
};

const towerParts = [];
{
  const h = T.half;
  const p = T.pier;
  // Hoekpenanten over de hele hoogte tot onder de dakplaat.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x0 = sx < 0 ? -h : h - p, y0 = sy < 0 ? -h : h - p;
    towerParts.push(box(x0, y0, BASE, x0 + p, y0 + p, T.slabBot));
  }
  // Vlakken tussen de penanten, per hoogteband dieper.
  const core = (d, z0, z1) => box(-h + d, -h + d, z0, h - d, h - d, z1);
  towerParts.push(core(T.recessLow, BASE, T.panelFrom));
  towerParts.push(core(T.recess, T.panelFrom, T.glassFrom));
  towerParts.push(core(T.recessGlass, T.glassFrom, T.slabBot));
  // Overstekende dakplaat.
  towerParts.push(box(-T.slabHalf, -T.slabHalf, T.slabBot, T.slabHalf, T.slabHalf, T.slabTop));
  // Uurwerklantaarn: penanten op de hoeken, wijzerplaten 0,2 m terug, kap met overstek.
  const a = T.lantHalf, q = T.lantPier, c0 = T.slabTop + T.clockFrom, c1 = T.capBot - 0.5;
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
    const x0 = sx < 0 ? -a : a - q, y0 = sy < 0 ? -a : a - q;
    towerParts.push(box(x0, y0, T.slabTop - 0.1, x0 + q, y0 + q, T.capBot));
  }
  towerParts.push(box(-a, -a, T.slabTop - 0.1, a, a, c0));
  towerParts.push(box(-a + T.clockRecess, -a + T.clockRecess, c0, a - T.clockRecess, a - T.clockRecess, c1));
  towerParts.push(box(-a, -a, c1, a, a, T.capBot));
  towerParts.push(box(-T.capHalf, -T.capHalf, T.capBot, T.capHalf, T.capHalf, T.capTop));
  // Lage koepel: bolkap met voet r 1,8 op de kap.
  const rise = T.domeTop - T.capTop;
  const R = (T.domeR ** 2 + rise ** 2) / (2 * rise);
  towerParts.push(
    Manifold.sphere(R, 96).translate([0, 0, T.domeTop - R]).trimByPlane([0, 0, 1], T.capTop - 0.05),
  );
  // Nest, iets uitlopend, en de adelaar met gespreide vleugels (schematisch, 0,9 m dik).
  const nest = Manifold.extrude(new CrossSection([circleSeg(T.nestR0, 32)]), T.nestTop - (T.domeTop - 0.2), 32, 0, [T.nestR1 / T.nestR0, T.nestR1 / T.nestR0]).translate([0, 0, T.domeTop - 0.2]);
  towerParts.push(nest);
  const wing = (s) => hull([
    [-0.45, -0.45, T.nestTop - 0.1], [0.45, -0.45, T.nestTop - 0.1], [-0.45, 0.45, T.nestTop - 0.1], [0.45, 0.45, T.nestTop - 0.1],
    [s * 0.25, -0.45, T.eagleTop], [s * 1.2, -0.45, T.eagleTop], [s * 0.25, 0.45, T.eagleTop], [s * 1.2, 0.45, T.eagleTop],
  ]);
  towerParts.push(wing(-1), wing(1));
}
function circleSeg(r, n) {
  return Array.from({ length: n }, (_, i) => [r * Math.cos((2 * Math.PI * i) / n), r * Math.sin((2 * Math.PI * i) / n)]);
}
const tower = union(towerParts);

// ---------- fabriek (rest van BAG-pand 0794100000396381) ----------
// BAG-contour (PDOK WFS, 2026-11-02), RD.
const BAG_RD = [[173305.8,388027.2],[173301.4,388027.2],[173301.4,388022.0],[173284.3,388021.9],[173284.5,387995.1],[173319.7,387995.5],[173319.3,388014.2],[173319.3,388015.4],[173319.2,388022.1],[173319.1,388027.3],[173323.4,388027.4],[173323.4,388022.2],[173323.5,388015.4],[173338.4,388015.5],[173338.4,388016.0],[173339.4,388016.0],[173339.4,388022.4],[173339.4,388022.6],[173339.3,388027.4],[173339.3,388027.7],[173338.8,388079.8],[173338.8,388080.2],[173338.8,388084.4],[173338.7,388085.2],[173333.8,388085.1],[173297.9,388084.9],[173266.5,388084.6],[173266.5,388084.2],[173241.3,388083.5],[173241.3,388079.3],[173246.3,388079.3],[173297.6,388080.1],[173297.5,388082.2],[173301.1,388082.3],[173304.9,388079.6],[173305.0,388074.3],[173292.9,388074.5],[173237.9,388073.6],[173232.9,388073.6],[173233.0,388051.6],[173289.0,388052.2],[173289.0,388050.9],[173294.1,388050.9],[173294.1,388052.4],[173305.5,388052.5]];
const footprint = prism(BAG_RD.map(L), BASE, 60);
const zone = (polyRd, top) => prism(polyRd.map(L), BASE, top).intersect(footprint);
const rectRd = (x0, y0, x1, y1) => rect(x0, y0, x1, y1);

// Sheddakhal: drie tanden met het steile (glazen) vlak op het noorden, rug 33,2, kiel 30,15 (AHN-profiel op x 245, 265 en 285).
// De tanden lopen 0,65 graad linksom, zoals de gevels.
const SHED = { valley: z(30.15), ridge: z(33.2), teeth: [[388052.5, 388058.0, 388060.0], [388060.0, 388065.2, 388067.2], [388067.2, 388072.4, 388074.5]] };
const SHED_ROT = 0.65;
const SHED_PIVOT = 173265 - ORIGIN[0];
const shedFrame = (m) => m.translate([-SHED_PIVOT, 0, 0]).rotate([0, 0, SHED_ROT]).translate([SHED_PIVOT, 0, 0]);
const plane = (poly, a, b, c) => {
  // z = a*u + b*v + c boven poly (lokaal)
  const n = Math.hypot(a, b, 1);
  return prism(poly, BASE, 60).trimByPlane([a / n, b / n, -1 / n], -c / n);
};
const shedParts = [];
{
  const [x0, x1] = [173225, 173300].map((x) => x - ORIGIN[0]);
  SHED.teeth.forEach(([ys, yp, yn], i) => {
    const s = (i === 0 ? 388040 : ys) - ORIGIN[1], p = yp - ORIGIN[1], n = (i === 2 ? 388090 : yn) - ORIGIN[1];
    const lo = ys - ORIGIN[1], hi = yn - ORIGIN[1];
    const rise = (SHED.ridge - SHED.valley) / (p - lo), fall = (SHED.ridge - SHED.valley) / (hi - p);
    // Zuidstuk: vlak tot de kiel, dan oplopend tot de rug; noordstuk: steil aflopend.
    const south = plane(rect(x0, s, x1, p), 0, rise, SHED.valley - rise * lo).intersect(prism(rect(x0, s, x1, p), BASE, SHED.ridge));
    const flat = lo > s ? box(x0, s, BASE, x1, lo, SHED.valley) : null;
    const north = plane(rect(x0, p, x1, n), 0, -fall, SHED.ridge + fall * p).intersect(prism(rect(x0, p, x1, n), BASE, SHED.ridge));
    shedParts.push(south, flat, north, box(x0, p, BASE, x1, n, SHED.valley));
  });
}
const shedRoof = shedFrame(union(shedParts));
const shedHall = shedRoof.intersect(zone([[173236.9, 388040], [173293.3, 388040], [173293.3, 388077], [173236.9, 388077]], 60));

// Zuidvleugel: zadeldak met de nok noord-zuid op x 173292,7 (goot 32,5 tot 32,75, nok 37,19); het noordeinde is plat op 35,15.
const SADDLE = { ridgeX: 173292.7, ridge: z(37.19), eaveW: z(32.51), eaveE: z(32.75), west: 173284.3, east: 173300.9, flatNorth: 388014.5 };
const saddleZone = [[173280, 387990], [173301.4, 387990], [173301.4, 388022.0], [173280, 388022.0]];
const sw = (SADDLE.ridge - SADDLE.eaveW) / (SADDLE.ridgeX - SADDLE.west), se = (SADDLE.ridge - SADDLE.eaveE) / (SADDLE.east - SADDLE.ridgeX);
const rx = SADDLE.ridgeX - ORIGIN[0];
const saddlePoly = saddleZone.map(L);
const saddle = plane(saddlePoly, sw, 0, SADDLE.ridge - sw * rx)
  .intersect(plane(saddlePoly, -se, 0, SADDLE.ridge + se * rx))
  .intersect(footprint);
const saddleNorth = saddle.intersect(prism(rectRd(173280, SADDLE.flatNorth, 173301.4, 388022.0).map(L), BASE, z(35.15)));
const saddleSouth = saddle.intersect(prism(rectRd(173280, 387990, 173301.4, SADDLE.flatNorth).map(L), BASE, 60));

const ROOF = { east: z(35.15), low: z(27.13), lean: z(22.29) };
const factory = union([
  shedHall,
  // Lessenaar langs de westgevel, 5,2 m.
  zone([[173225, 388040], [173236.9, 388040], [173236.9, 388077], [173225, 388077]], ROOF.lean),
  // Noordstrook (3D BAG-dakvlakken): 7,5 / 6,6 / 7,65 / 5,2 m.
  zone(rectRd(173230, 388077, 173270.1, 388090), z(24.65)),
  zone(rectRd(173270.1, 388077, 173287.7, 388090), z(23.75)),
  zone(rectRd(173287.7, 388077, 173295.1, 388090), z(24.77)),
  zone(rectRd(173295.1, 388077, 173297.6, 388090), ROOF.lean),
  // Oostblok van vier lagen, plat op 18,0 m, met trappenhuis en een dakopbouw.
  zone([[173293.3, 388027.35], [173345, 388027.35], [173345, 388090], [173297.6, 388090], [173297.6, 388077], [173293.3, 388077]], ROOF.east),
  zone(rectRd(173301.4, 387990, 173319.8, 388027.35), ROOF.east),
  zone(rectRd(173319.8, 387990, 173345, 388027.35), ROOF.low),
  saddleNorth,
  saddleSouth,
  box(...L([173318.8, 388070.3]), BASE, ...L([173322.7, 388075.3]), z(43.15)),
  box(...L([173326.6, 388029.7]), BASE, ...L([173330.2, 388033.5]), z(37.5)),
]);

// De fabriek om de schacht heen uitsparen, zodat de toren zijn eigen gevels houdt.
const all = union([factory.subtract(box(-T.half, -T.half, BASE - 1, T.half, T.half, 60)), tower]).trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-helmond-raymakers",
  base: BASE,
  nodes: [["building:watertoren-en-fabriek", all]],
  catalog: {
    name: "Watertoren Raymakers Helmond",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Op het fabrieksplein ten zuiden van de toren (AHN-DTM 17,09 tot 17,24).
    groundSamplePoints: [[-6, -4], [6, -4], [-15, -10], [-30, -20]],
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0794100000396381"],
    description:
      "Oorsprong op het hart van de vierkante schacht (5,1 m, BAG) op maaiveld (NAP +17,12 m), +X naar RD-oost. Toren met hoekpenanten, verdiepte panelen en vensterband tot een dakplaat van 6,8 m op 31,8 m, uurwerklantaarn met kap tot 36,03 m, lage koepel, nest en adelaar tot 39,68 m. De toren hoort bij BAG-pand 0794100000396381; het model vervangt dat hele pand: sheddakhal met drie tanden, lessenaar, noordstrook, oostblok van 18 m met trappenhuis, lager zuidoostblok en zuidvleugel met zadeldak, op de BAG-contour met hoogtes uit het AHN en de 3D BAG.",
    realWorld: {
      built: 1948,
      designer: "S.L.A. Orie",
      reservoirM3: [150, 35],
      shaftM: T.half * 2,
      roofSlabM: T.slabHalf * 2,
      roofSlabTopM: T.slabTop,
      lanternM: T.lantHalf * 2,
      capTopM: T.capTop,
      domeTopM: T.domeTop,
      nestTopM: T.nestTop,
      eagleTopM: T.eagleTop,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofSlabNapM: 48.92,
      ahnHighestNapM: 55.55,
      geoidNlgeo2018M: GEOID_N,
      factory: {
        bagPand: "0794100000396381",
        shedRidgeNapM: 33.2,
        shedValleyNapM: 30.15,
        eastBlockNapM: 35.15,
        southEastBlockNapM: 27.13,
        southWingRidgeNapM: 37.19,
      },
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Helmond_Raymakers) (1948, S.L.A. Orie, 150 + 35 m³; hoogte onbekend)",
      "https://commons.wikimedia.org/wiki/File:Helmond_Watertoren_2485.JPG (Willemjans, 2007, CC BY-SA 3.0: schacht, penanten, panelen, vensterband, dakplaat, lantaarn, koepel, nest en adelaar)",
      "https://web.archive.org/web/20070929083555/http://afrit13.tweakdsl.nl/watertorens/Nederland/Noord-Brabant/Helmond2.jpg (zelfde aanzicht)",
      "https://www.openstreetmap.org/way/1565252045 (water_tower zonder naam; hoogte 25 m klopt niet)",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0794100000396381 (3D BAG, CC BY 4.0: dakhoogtes van de fabriek en de PDOK-vorm van de toren)",
      "PDOK BAG (pand 0794100000396381, 1926), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,94 m) voor groundHeight",
    ],
  },
});

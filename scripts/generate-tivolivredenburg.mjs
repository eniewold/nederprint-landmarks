// Genereert een vereenvoudigd, gesloten 3D-model van TivoliVredenburg in
// Utrecht (Vredenburgkade 11), het muziekcentrum van Architectuurstudio HH
// (Herman Hertzberger en Patrick Fransen) met zalen van Jo Coenen, NL
// Architects en Thijs Asselbergs (2014): de grote doos van 45 m hoog met de
// gestapelde zalen, met de twee noppengevels (schijven met ronde schotels) aan
// de Catharijnesingel en aan de oostkant op een terugliggende glazen plint, de
// glazen noordgevel onder een dakrand met schuine onderkant, het overstekende
// dak aan de zuidkant (rode onderkant, hier schuin afgeschuind) met daaronder
// het hangende witte zaalvolume, de groene cilinderzaal en een buitentrap, de
// twee witte zalen die aan de noordgevel uitkragen, de Ronda aan het
// Vredenburg met een naar buiten hellende gevel boven de terugliggende glazen
// pui, en de installaties en kanalen op het dak; daaronder en ernaast de
// bewaarde onderbouw van Muziekcentrum Vredenburg (Hertzberger, 1979) met de
// Grote Zaal onder het getrapte piramidedak met de glazen lantaarn, de lage
// strook aan de Catharijnesingel met de lichtsleuf, het terras en de lage
// vleugel aan de zuidoostkant. Alle maten in het script zijn meters op ware
// grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-tivolivredenburg.mjs              # 1:1000 (standaard)
//   node scripts/generate-tivolivredenburg.mjs --scale 2000
//
// Alles staat op dezelfde onderkant (1 m onder het maaiveld). Er hangt niets
// vrij over: de onderkant van het dakoverstek, het witte zaalvolume, de
// uitkragende zalen, de cilinderzaal, de buitentrap, de Ronda en de plint
// onder de doos lopen onder 45 graden of steiler schuin terug naar de gevel
// eronder, en de rand van elke schotel helt 41 graden.
//
// Assenstelsel: oorsprong in het hart van de BAG-contour (bbox langs de as) op
// het maaiveld (NAP +3,7 m), Z omhoog. +X loopt langs de westgevel aan de
// Catharijnesingel van het Vredenburg (noord) naar Hoog Catharijne (zuid),
// RD-richting (0,494, -0,869), -60,4 graden; +Y 90 graden linksom, naar het
// Vredenburgplein aan de oostkant.
//
// Bronnen: BAG-pand 0344100000047923 (contour; het hele complex inclusief de
// oude onderbouw is één pand); AHN DSM/DTM 0,5 m (PDOK WCS) in een stelsel
// langs de as: de dakhoogte van de doos (NAP +48,7 m), de schuine noord- en
// zuidrand van het dak (evenwijdig, 19,7 graden op de as), de installaties en
// kanalen op het dak, de Ronda (bovenrand op de BAG-boog, 21 m), de hoogtes en
// ringen van het piramidedak van de onderbouw, de lantaarn, de lichtsleuf, het
// terras, de lage vleugel en het maaiveld; PDOK luchtfoto; Wikipedia (47 m,
// negen verdiepingen, vijf gestapelde zalen, zijgevels als noppenstructuur,
// Grote Zaal van het oude Vredenburg bewaard) en Wikimedia Commons-foto's.
// Geschat uit foto's: het raster en de maat van de schotels, de hoogte en
// diepte van de terugliggende plint (west 14,4 m, oost 18,4 m, noord 7,4 m, 2
// tot 2,5 m diep), de terugligging van de glazen noordgevel, de hellende
// Ronda-gevel, de ligging van de glazen zuidgevel onder het dakoverstek, het
// witte zaalvolume, de buitentrap, de cilinderzaal (straal 7 m, 25 tot 39 m,
// op een kern) en de twee witte zalen aan de noordgevel.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "tivolivredenburg");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const section = (pts) => new CrossSection([ccw(pts)]);
const prism = (cs, z0, z1) => Manifold.extrude(cs, z1 - z0).translate([0, 0, z0]);
const box = (u0, u1, v0, v1, z0, z1) =>
  Manifold.cube([u1 - u0, v1 - v0, z1 - z0], false).translate([u0, v0, z0]);
// Profiel in het (v, z)-vlak, uitgetrokken langs X over u0..u1.
const alongX = (profile, u0, u1) =>
  Manifold.extrude([ccw(profile)], u1 - u0)
    .rotate([90, 0, 90])
    .translate([u0, 0, 0]);

// ---------- maten (hoogte boven het maaiveld, NAP +3,7 m) ----------
const ORIGIN = [136218.306, 456063.155];
const X_AXIS = [0.49394, -0.86949];
const BASE = -1;
// BAG-contour van pand 0344100000047923 (vereenvoudigd op 0,25 m) in RD.
const BAG_RD = [
  [136236.95, 456099.22], [136236.13, 456099.13], [136236.75, 456098.04], [136228.91, 456099.58],
  [136220.64, 456099.24], [136212.68, 456096.93], [136205.50, 456092.79], [136200.32, 456091.91],
  [136199.54, 456092.59], [136198.52, 456092.77], [136197.36, 456092.22], [136196.85, 456091.32],
  [136168.68, 456086.54], [136168.10, 456087.56], [136167.25, 456087.44], [136191.39, 456045.00],
  [136192.83, 456045.25], [136198.11, 456035.91], [136197.68, 456035.66], [136200.77, 456030.22],
  [136199.46, 456029.32], [136199.39, 456027.52], [136200.83, 456026.48], [136202.52, 456027.15],
  [136213.96, 456007.43], [136252.66, 456029.44], [136253.43, 456029.89], [136253.38, 456030.42],
  [136254.04, 456030.79], [136254.71, 456030.66], [136257.36, 456032.16], [136257.56, 456032.84],
  [136259.20, 456033.78], [136259.94, 456033.60], [136262.58, 456035.12], [136262.77, 456035.80],
  [136264.69, 456036.87], [136265.88, 456037.04], [136266.43, 456037.84], [136266.35, 456038.70],
  [136266.82, 456038.97], [136266.55, 456039.46], [136267.05, 456039.77], [136266.77, 456040.26],
  [136267.25, 456040.53], [136266.96, 456041.04], [136267.53, 456041.82], [136267.43, 456042.77],
  [136266.47, 456043.49], [136265.39, 456045.38], [136265.56, 456046.06], [136264.06, 456048.73],
  [136263.39, 456048.92], [136262.43, 456050.59], [136262.61, 456051.28], [136261.11, 456053.91],
  [136260.46, 456054.13], [136260.08, 456054.82], [136260.40, 456055.27], [136259.63, 456056.63],
  [136260.92, 456057.07],
];
const BAG = BAG_RD.map(([x, y]) => {
  const dx = x - ORIGIN[0];
  const dy = y - ORIGIN[1];
  return [dx * X_AXIS[0] + dy * X_AXIS[1], -dx * X_AXIS[1] + dy * X_AXIS[0]];
});
const outline = section(BAG);

// De doos (AHN en BAG): een parallellogram tussen de westgevel (v = -32,4 m)
// en de oostgevel (v = 34,05 m); de noordgevel en de dakrand aan de zuidkant
// lopen evenwijdig onder 0,358 m per meter op de as (19,7 graden). Dak op 45 m
// (NAP +48,7 m), mediaan over het hele dak.
const SLOPE = 0.358;
const WEST = -32.4;
const EAST = 34.05;
const uNorth = (v) => -44.84 + SLOPE * (v + 31.6);
const uSouth = (v) => 14.69 + SLOPE * v;
const ROOF = 45;
// Dakoverstek aan de zuidkant: de glazen gevel ligt 6 m achter de dakrand
// (geschat), de dakrand is 1,5 m dik en de onderkant loopt 1,2 m per meter
// schuin terug naar de gevel (50 graden; in werkelijkheid een vlakke rode
// onderkant boven de foyers).
const OVERHANG = { depth: 6, edge: 1.5, slope: 1.2 };
const uGlass = (v) => uSouth(v) - OVERHANG.depth;
// De zijgevels aan de Catharijnesingel en aan de oostkant zijn de
// noppengevels: schijven van 1,5 m dik van de noordgevel tot de dakrand aan
// de zuidkant (foto's: beide schijven lopen tot de dakhoek door), met ronde
// schotels in een vierkant raster (foto's: 28 kolommen over 48,2 m, dus
// 1,72 m; rijen 1,7 m), schotels van 1,3 m doorsnede en 0,35 m diep met een
// schuine rand.
const PANEL = 1.5;
const DIMPLE = { pitchU: 1.72, pitchZ: 1.7, r: 0.65, bottom: 0.25, depth: 0.35, segments: 12 };
// Terugliggende glazen plint onder de doos (foto's): west tot 12 m en 2 m
// diep met een schuine kraag tot de onderkant van de noppengevel op 14,4 m;
// oost tot 16 m en 2 m diep (noppengevel vanaf 18,4 m); noord (café aan het
// Vredenburg) tot 5 m en 2,5 m diep met een kraag tot 7,4 m. De west- en
// oostplint lopen tot 1,5 m voor de dakrand; de hoek daar is een pijler.
const PLINTH = {
  west: { top: 12, depth: 2, rise: 2.4 },
  east: { top: 16, depth: 2, rise: 2.4 },
  north: { top: 5, depth: 2.5, rise: 3, v1: 3.5 },
};
// De glazen noordgevel tussen de noppengevels ligt 1 m terug onder een
// dakrand van 1,5 m met een schuine (rode) onderkant van 45 graden (foto's).
const NORTH_GLASS = { depth: 1, rim: 1.5, bottom: PLINTH.north.top + PLINTH.north.rise };
// Wit zaalvolume onder het dakoverstek aan de zuidwestkant (foto's): van de
// westelijke noppengevel tot v = -19 m, 1,5 m achter de dakrand, onderkant op
// 29,5 m en 1,2 m per meter schuin terug naar de glazen gevel.
const WHITE = { v1: -19, setback: 1.5, bottom: 29.5 };
// Buitentrap voor de glazen zuidgevel (foto's): van het dak van de oude
// onderbouw (v = -4 m, 15,3 m) schuin omhoog naar de westkant (v = -28,5 m,
// 28 m), 1,5 m voor de gevel, met een schuine onderkant naar de gevel.
const STAIR = { v0: -4, z0: 15.3, v1: -28.5, z1: 28, depth: 1.5, thick: 0.9 };
// Installaties en kanalen op het dak (AHN-raster per 0,5 m, opgeschoond tot
// rechthoeken van minstens 0,9 m): [u0, u1, v0, v1, hoogte boven het dak].
const PLANT = [
  // 46.3 m
  [-19.25, -12.25, 28.25, 29.25, 1.3], [-6.25, -1.75, 27.75, 28.75, 1.3], [-0.25, 2.25, 27.75, 28.75, 1.3], [-12.75, 2.25, 24.75, 25.75, 1.3],
  [-3.25, -1.75, 23.75, 24.75, 1.3], [-14.25, -1.75, 22.25, 23.75, 1.3], [-2.75, -1.75, 21.25, 22.25, 1.3], [-14.25, -4.25, 20.75, 22.25, 1.3],
  [0.25, 2.25, 20.75, 22.75, 1.3], [-14.75, -3.75, 19.75, 20.75, 1.3], [-22.75, -16.25, 18.25, 19.25, 1.3], [-20.25, -19.25, 12.75, 13.75, 1.3],
  [-13.75, 2.25, 12.75, 13.75, 1.3], [-12.75, -11.75, 10.75, 12.75, 1.3], [-20.75, -19.75, 10.25, 12.25, 1.3], [-20.75, -19.25, 8.75, 10.25, 1.3],
  [-10.25, -7.75, 8.75, 11.25, 1.3], [-20.75, -19.75, 7.25, 8.75, 1.3], [-10.75, -7.75, 7.25, 8.75, 1.3], [-10.25, -7.75, 2.75, 7.25, 1.3],
  [-10.25, -8.25, 1.25, 2.75, 1.3], [-12.75, -11.75, 0.75, 9.25, 1.3], [-17.75, -16.25, -0.75, 0.25, 1.3], [-25.75, -21.25, -4.25, -2.25, 1.3],
  [-13.75, -4.25, -4.75, -3.75, 1.3], [-14.25, -4.25, -7.75, -4.75, 1.3], [-25.75, -23.25, -8.25, -7.25, 1.3], [-25.75, -23.75, -9.25, -8.25, 1.3],
  [-16.25, -4.25, -10.25, -8.25, 1.3], [-16.75, -14.75, -12.75, -10.75, 1.3], [-16.25, -14.75, -15.25, -12.75, 1.3], [-16.75, -14.75, -16.75, -15.25, 1.3],
  [-16.75, -15.25, -18.25, -16.75, 1.3], [-16.75, -14.75, -19.25, -18.25, 1.3], [-3.25, -2.25, -19.75, -14.75, 1.3], [-26.25, -24.25, -20.75, -18.75, 1.3],
  [-3.25, -1.75, -21.25, -19.75, 1.3], [-16.75, -4.25, -21.75, -19.75, 1.3], [-16.75, -14.75, -23.75, -21.75, 1.3], [-8.25, -5.75, -23.75, -22.75, 1.3],
  [-26.75, -24.25, -24.25, -20.75, 1.3], [-16.75, -15.25, -25.25, -23.75, 1.3],
  // 47.2 m
  [-2.75, -1.75, 25.75, 26.75, 2.2], [-3.25, -1.75, 23.75, 25.75, 2.2], [-14.25, -1.75, 22.25, 23.75, 2.2], [-14.25, -4.25, 20.75, 22.25, 2.2],
  [-14.25, -3.75, 19.75, 20.75, 2.2], [-9.75, -7.75, 10.25, 11.25, 2.2], [-10.25, -8.25, 8.25, 9.75, 2.2], [-10.25, -7.75, 6.75, 8.25, 2.2],
  [-10.25, -8.25, 5.25, 6.75, 2.2], [-10.25, -7.75, 2.75, 5.25, 2.2], [-10.25, -8.25, 1.25, 2.75, 2.2], [-25.25, -21.75, -3.75, -2.25, 2.2],
  [-13.75, -4.75, -4.75, -3.75, 2.2], [-14.25, -4.75, -5.75, -4.75, 2.2], [-14.25, -4.25, -7.25, -5.75, 2.2], [-14.25, -4.75, -8.25, -7.25, 2.2],
  [-16.25, -4.75, -10.25, -8.75, 2.2], [-16.25, -14.75, -11.75, -10.75, 2.2], [-16.25, -15.25, -18.25, -11.75, 2.2], [-16.25, -14.75, -19.25, -18.25, 2.2],
  [-16.25, -4.75, -21.25, -19.25, 2.2], [-16.75, -15.25, -23.75, -21.75, 2.2], [-16.25, -15.25, -25.25, -23.75, 2.2],
  // 47.8 m
  [-3.25, -2.25, 23.75, 25.75, 2.8], [-3.75, -2.25, 22.25, 23.75, 2.8], [-14.25, -4.75, 21.75, 23.75, 2.8], [-14.25, -4.25, 19.75, 21.75, 2.8],
  [-13.75, -4.75, -4.75, -3.75, 2.8], [-14.25, -4.75, -6.25, -4.75, 2.8], [-13.75, -4.75, -7.75, -6.25, 2.8], [-14.25, -4.75, -10.25, -7.75, 2.8],
  [-14.25, -4.75, -21.25, -19.75, 2.8],
];
// Twee witte zalen die aan de noordgevel uitkragen (foto's, AHN-rand tot
// 43 m): 2,5 m voor de gevel, onderkant 1,3 m per meter schuin terug.
const BAYS = [
  { v: [27, 33.5], top: 43, bottom: 32, depth: 2.5 },
  { v: [19.5, 26], top: 42, bottom: 31, depth: 2.5 },
];
// De Ronda aan het Vredenburg (BAG-boog, cirkel om (2,11, 7,88) met straal
// 34,48 m; AHN 21 m hoog), tussen de noordgevel en de boog van v = 3,5 tot
// 33,27 m. De BAG-boog is de bovenrand; de gevel helt naar buiten (foto's):
// de glazen pui ligt 3 m binnen de boog tot 5 m hoog, de onderkant loopt
// onder 50 graden naar 1,5 m binnen de boog op 6,8 m en de gevel helt van
// daar naar de boog op 21 m.
const RONDA = { cu: 2.11, cv: 7.88, r: 34.48, v0: 3.5, v1: 33.27, top: 21, glass: 5, inset: 3, soffit: 6.8, foot: 1.5 };
// Cilinderzaal onder het dakoverstek (foto's): straal 7 m, van 25 tot 39 m,
// onderkant als kegel onder 50 graden naar een kern met straal 4 m.
const DRUM = { cu: 11.5, cv: 12, r: 7, bottom: 25, top: 39, core: 4 };
// Onderbouw van het oude Vredenburg (AHN): strook langs de Catharijnesingel tot
// 14 m (v < -18,25 m), lichtsleuf tot 7 m (v -18,25 tot -16,25 m), daarachter
// het blok van de Grote Zaal tot 15,3 m met een piramidedak (0,26 m per meter)
// tot 18,5 m, een glazen lantaarn (vierkant op de punt, halve diagonaal 6,5 m,
// tot 22 m met een lage piramide tot 23,2 m), de lage vleugel aan de
// zuidoostkant (u + v > 61 m) tot 7,2 m en het terras voor de strook tot
// 4,5 m. De onderbouw begint op u = 11,5 m (westkant) of tegen de glazen
// zuidgevel van de doos (v > -4 m).
const OLD = { u0: 11.5, vSplit: -4, strip: 14, slotV: [-18.25, -16.25], slot: 7, main: 15.3, wing: 7.2, wingSum: 61, deck: 4.5 };
const PYRAMID = { base: 15.2, top: 18.5, low: { u: [0, 40], v: [-11, 25.5] }, high: { u: [0, 28], v: [1, 13.5] } };
const LANTERN = { cu: 22, cv: 8, half: 6.5, wall: 22, tip: 23.2 };

// ---------- opbouw ----------
const BIG = 200;
const halfPlane = (pts) => section(pts);
// De doos tot de glazen zuidgevel, de twee noppengevels tot de dakrand en het
// dakoverstek.
const boxPlan = section([
  [uNorth(WEST), WEST],
  [uGlass(WEST), WEST],
  [uGlass(EAST), EAST],
  [uNorth(EAST), EAST],
]);
const slab = (va, vb) =>
  prism(section([[uNorth(va), va], [uSouth(va), va], [uSouth(vb), vb], [uNorth(vb), vb]]), BASE, ROOF);
let doos = prism(boxPlan, BASE, ROOF).add(slab(WEST, WEST + PANEL)).add(slab(EAST - PANEL, EAST));
const overhangBottom = ROOF - OVERHANG.edge - OVERHANG.slope * OVERHANG.depth;
doos = doos.add(
  Manifold.hull(
    [WEST, EAST].flatMap((v) => [
      [uSouth(v), v, ROOF],
      [uSouth(v), v, ROOF - OVERHANG.edge],
      [uGlass(v) - 0.5, v, ROOF],
      [uGlass(v) - 0.5, v, overhangBottom - OVERHANG.slope * 0.5],
    ]),
  ),
);
// Terugliggende plint: west, oost en noord, elk met een schuine kraag, en de
// glazen noordgevel tussen de noppengevels.
const cuts = [];
{
  const { top, depth, rise } = PLINTH.west;
  cuts.push(
    alongX(
      [[WEST - 3, 0], [WEST + depth, 0], [WEST + depth, top], [WEST, top + rise], [WEST - 3, top + rise + 3.6]],
      -BIG / 2,
      uSouth(WEST) - WHITE.setback,
    ),
  );
}
{
  const { top, depth, rise } = PLINTH.east;
  cuts.push(
    alongX(
      [[EAST + 3, 0], [EAST - depth, 0], [EAST - depth, top], [EAST, top + rise], [EAST + 3, top + rise + 3.6]],
      -BIG / 2,
      uSouth(EAST) - WHITE.setback,
    ),
  );
}
{
  // Noordplint, evenwijdig aan de schuine noordgevel, van de westgevel tot de
  // Ronda.
  const { top, depth, rise, v1 } = PLINTH.north;
  cuts.push(
    Manifold.hull(
      [WEST - 3, v1].flatMap((v) => [
        [uNorth(v) - 3, v, 0],
        [uNorth(v) + depth, v, 0],
        [uNorth(v) + depth, v, top],
        [uNorth(v), v, top + rise],
        [uNorth(v) - 3, v, top + rise + 3.6],
      ]),
    ),
  );
}
{
  const { depth, rim, bottom } = NORTH_GLASS;
  cuts.push(
    Manifold.hull(
      [WEST + PANEL, EAST - PANEL].flatMap((v) => [
        [uNorth(v) - 3, v, bottom],
        [uNorth(v) + depth, v, bottom],
        [uNorth(v) + depth, v, ROOF - rim - depth],
        [uNorth(v), v, ROOF - rim],
        [uNorth(v) - 3, v, ROOF - rim],
      ]),
    ),
  );
}
doos = doos.subtract(Manifold.union(cuts));

const parts = [doos];
// Wit zaalvolume aan de zuidwestkant onder het dakoverstek.
parts.push(
  Manifold.hull(
    [WEST + PANEL - 0.5, WHITE.v1].flatMap((v) => {
      const front = uSouth(v) - WHITE.setback;
      const back = uGlass(v) - 1;
      return [
        [back, v, ROOF - 1],
        [front, v, ROOF - 1],
        [front, v, WHITE.bottom],
        [back, v, WHITE.bottom - OVERHANG.slope * (front - back)],
      ];
    }),
  ),
);
// Buitentrap voor de glazen zuidgevel.
{
  const { v0, z0, v1, z1, depth, thick } = STAIR;
  parts.push(
    Manifold.hull(
      [
        [v0, z0],
        [v1, z1],
      ].flatMap(([v, z]) => {
        const g = uGlass(v);
        return [
          [g - 0.5, v, z],
          [g + depth, v, z],
          [g + depth, v, z - thick],
          [g - 0.5, v, z - thick - OVERHANG.slope * (depth + 0.5)],
        ];
      }),
    ),
  );
}
// Installaties en kanalen op het dak.
for (const [u0, u1, v0, v1, h] of PLANT) parts.push(box(u0, u1, v0, v1, ROOF - 0.5, ROOF + h));
// Uitkragende witte zalen aan de noordgevel.
for (const b of BAYS) {
  parts.push(
    Manifold.hull(
      b.v.flatMap((v) => [
        [uNorth(v) + 2, v, b.bottom - 2.6],
        [uNorth(v) + 2, v, b.top],
        [uNorth(v) - b.depth, v, b.top],
        [uNorth(v) - b.depth, v, b.bottom + 1.3 * b.depth],
      ]),
    ),
  );
}
// De Ronda: glazen pui, schuine onderkant en een naar buiten hellende gevel
// tussen de noordgevel en de BAG-boog.
{
  const a0 = Math.asin((RONDA.v0 - RONDA.cv) / RONDA.r);
  const a1 = Math.asin((RONDA.v1 - RONDA.cv) / RONDA.r);
  const arc = (r, z) => {
    const pts = [];
    for (let i = 0; i <= 32; i++) {
      const a = a0 + ((a1 - a0) * i) / 32;
      pts.push([RONDA.cu - r * Math.cos(a), RONDA.cv + r * Math.sin(a), z]);
    }
    return pts;
  };
  const back = (z) => [
    [uNorth(RONDA.v1) + 2, RONDA.v1, z],
    [uNorth(RONDA.v0) + 2, RONDA.v0, z],
  ];
  const inner = RONDA.r - RONDA.inset;
  parts.push(
    Manifold.hull([...arc(inner, BASE), ...back(BASE), ...arc(inner, RONDA.glass), ...back(RONDA.glass)]),
    Manifold.hull([
      ...arc(inner, RONDA.glass),
      ...arc(RONDA.r - RONDA.foot, RONDA.soffit),
      ...arc(RONDA.r, RONDA.top),
      ...back(RONDA.glass),
      ...back(RONDA.top),
    ]),
  );
}
// Cilinderzaal op een kern, met een kegelvormige onderkant.
{
  const coneHeight = OVERHANG.slope * (DRUM.r - DRUM.core);
  parts.push(
    Manifold.cylinder(DRUM.top - DRUM.bottom, DRUM.r, DRUM.r, 96, false).translate([DRUM.cu, DRUM.cv, DRUM.bottom]),
    Manifold.cylinder(coneHeight, DRUM.core, DRUM.r, 96, false).translate([DRUM.cu, DRUM.cv, DRUM.bottom - coneHeight]),
    Manifold.cylinder(DRUM.bottom - BASE, DRUM.core, DRUM.core, 96, false).translate([DRUM.cu, DRUM.cv, BASE]),
  );
}

// Onderbouw van het oude Vredenburg.
const south = halfPlane([
  [OLD.u0, -BIG],
  [BIG, -BIG],
  [BIG, BIG],
  [uGlass(BIG), BIG],
  [uGlass(OLD.vSplit), OLD.vSplit],
  [OLD.u0, OLD.vSplit],
]);
const wingPlane = halfPlane([
  [OLD.wingSum + BIG, -BIG],
  [BIG, BIG],
  [OLD.wingSum - BIG, BIG],
]);
const band = (v0, v1) => halfPlane([[-BIG, v0], [BIG, v0], [BIG, v1], [-BIG, v1]]);
const oldArea = outline.intersect(south);
const strip = oldArea.intersect(band(-BIG, OLD.slotV[0]));
const slot = oldArea.intersect(band(OLD.slotV[0], OLD.slotV[1]));
const main = oldArea.intersect(band(OLD.slotV[1], BIG)).subtract(wingPlane);
const wing = oldArea.intersect(band(OLD.slotV[1], BIG)).intersect(wingPlane);
parts.push(prism(strip, BASE, OLD.strip), prism(slot, BASE, OLD.slot), prism(main, BASE, OLD.main), prism(wing, BASE, OLD.wing));
// Piramidedak boven de Grote Zaal, binnen het blok.
const { low, high } = PYRAMID;
parts.push(
  Manifold.hull([
    [low.u[0], low.v[0], PYRAMID.base],
    [low.u[1], low.v[0], PYRAMID.base],
    [low.u[1], low.v[1], PYRAMID.base],
    [low.u[0], low.v[1], PYRAMID.base],
    [high.u[0], high.v[0], PYRAMID.top],
    [high.u[1], high.v[0], PYRAMID.top],
    [high.u[1], high.v[1], PYRAMID.top],
    [high.u[0], high.v[1], PYRAMID.top],
  ]).intersect(prism(main, PYRAMID.base - 1, PYRAMID.top + 1)),
);
// Glazen lantaarn boven de Grote Zaal.
const diamond = [
  [LANTERN.cu - LANTERN.half, LANTERN.cv],
  [LANTERN.cu, LANTERN.cv - LANTERN.half],
  [LANTERN.cu + LANTERN.half, LANTERN.cv],
  [LANTERN.cu, LANTERN.cv + LANTERN.half],
];
parts.push(prism(section(diamond), PYRAMID.top - 1, LANTERN.wall));
parts.push(Manifold.hull([...diamond.map(([u, v]) => [u, v, LANTERN.wall - 0.01]), [LANTERN.cu, LANTERN.cv, LANTERN.tip]]));
// Terras voor de strook aan de Catharijnesingel, onder het dakoverstek.
const deck = outline
  .intersect(halfPlane([[uGlass(-BIG) - 1, -BIG], [OLD.u0 + 0.5, -BIG], [OLD.u0 + 0.5, OLD.vSplit], [uGlass(OLD.vSplit) - 1, OLD.vSplit]]))
  .subtract(halfPlane([[-BIG, -BIG], [uSouth(WEST) - WHITE.setback, -BIG], [uSouth(WEST) - WHITE.setback, WEST + PLINTH.west.depth], [-BIG, WEST + PLINTH.west.depth]]));
parts.push(prism(deck, BASE, OLD.deck));

// Noppen: ronde schotels in de twee zijgevels, in een vierkant raster van de
// noordgevel tot de dakrand en van het dak tot de onderkant van de schijf.
const dimples = [];
{
  // Een schotel: een afgeknotte kegel van de gevel (straal 1,3 m / 2) naar een
  // bodem met straal 0,25 m op 0,35 m diepte; de bovenkant van de rand helt
  // daardoor 41 graden en print zonder steun. Hij steekt 0,3 m buiten de gevel
  // uit om een schone snede te geven.
  const { pitchU, pitchZ, r, bottom, depth, segments } = DIMPLE;
  const flare = (r - bottom) / depth;
  const cone = Manifold.cylinder(depth + 0.3, bottom, bottom + flare * (depth + 0.3), segments, false);
  const cupWest = cone.rotate([90, 0, 0]);
  const cupEast = cone.rotate([-90, 0, 0]);
  for (const [v, zMin, west] of [
    [WEST, PLINTH.west.top + PLINTH.west.rise, true],
    [EAST, PLINTH.east.top + PLINTH.east.rise, false],
  ]) {
    const u0 = uNorth(v);
    const length = uSouth(v) - u0;
    const cols = Math.floor(length / pitchU);
    const margin = (length - cols * pitchU) / 2;
    for (let i = 0; i < cols; i++) {
      const u = u0 + margin + pitchU * (i + 0.5);
      for (let z = ROOF - pitchZ / 2; z - r >= zMin + 0.1; z -= pitchZ) {
        dimples.push(west ? cupWest.translate([u, v + depth, z]) : cupEast.translate([u, v - depth, z]));
      }
    }
  }
}

const tivoli = Manifold.union(parts).subtract(Manifold.union(dimples));
const nodes = [["building:tivolivredenburg", tivoli]];
const printModel = tivoli;


// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    nodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of nodes) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, "tivolivredenburg.glb");
await writeFile(glbFile, toGlb(nodes, "NederPrint generate-tivolivredenburg.mjs (manifold-3d)"));
report.glb = { file: glbFile, parts: nodes.map(([name]) => name) };

const stlFile = path.join(outDir, `tivolivredenburg-1-${scale}.stl`);
const printSolid = printModel.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint TivoliVredenburg 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const bb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((bb.max[i] - bb.min[i]) * mmPerMetre).toFixed(1)),
};

const modelBox = tivoli.boundingBox();
await writeFile(
  path.join(outDir, "tivolivredenburg.json"),
  JSON.stringify(
    {
      name: "TivoliVredenburg",
      file: "tivolivredenburg.glb",
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: ORIGIN,
      xAxis: X_AXIS,
      groundOffsetMetres: -0.3,
      // Vredenburg voor de noordgevel, het terras aan de Catharijnesingel, het
      // Vredenburgplein en de straat naar Hoog Catharijne (NAP +3,7 tot +3,9 m);
      // niet de trappen naar het water en de Catharijnesingel zelf, 10 m ten
      // westen van de westgevel.
      groundSamplePoints: [
        [-50, -28],
        [0, -38],
        [0, 38],
        [49, 0],
      ],
      replacesBuildings: ["NL.IMBAG.Pand.0344100000047923"],
      description:
        "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt het hart van de BAG-contour op het maaiveld (NAP +3,7 m) in de oorsprong, +X langs de westgevel aan de Catharijnesingel van het Vredenburg naar Hoog Catharijne (RD-richting -60,4 graden) en +Y naar het Vredenburgplein. Eén node zonder vrije overhang: de doos met de gestapelde zalen tot 45 m met de twee noppengevels (ronde schotels van 1,3 m in een raster van 1,72 bij 1,7 m) op een terugliggende plint, de terugliggende glazen noordgevel, het overstekende dak aan de zuidkant met een schuine onderkant en daaronder het witte zaalvolume, de cilinderzaal en een buitentrap, de uitkragende zalen, de Ronda met een naar buiten hellende gevel, de installaties en kanalen op het dak, en de bewaarde onderbouw van het oude Vredenburg met de Grote Zaal. Vervangt de PDOK-reconstructie van BAG-pand 0344100000047923, dat het hele complex omvat.",
      printFiles: [`tivolivredenburg-1-${scale}.stl`],
      realWorld: {
        lengthM: +(modelBox.max[0] - modelBox.min[0]).toFixed(2),
        widthM: +(modelBox.max[1] - modelBox.min[1]).toFixed(2),
        boxWidthM: +(EAST - WEST).toFixed(2),
        boxDepthM: +(uSouth(0) - uNorth(0)).toFixed(2),
        roofM: ROOF,
        plantTopM: Math.max(...PLANT.map((p) => ROOF + p[4])),
        dimpleDiameterM: 2 * DIMPLE.r,
        dimpleDepthM: DIMPLE.depth,
        dimplePitchM: [DIMPLE.pitchU, DIMPLE.pitchZ],
        dimples: dimples.length,
        northGlassSetbackM: NORTH_GLASS.depth,
        whiteHallBottomM: WHITE.bottom,
        overhangM: OVERHANG.depth,
        rondaM: RONDA.top,
        drumTopM: DRUM.top,
        oldStripM: OLD.strip,
        oldMainM: OLD.main,
        pyramidM: PYRAMID.top,
        lanternM: LANTERN.tip,
        groundNapM: 3.7,
      },
      sources: [
        "https://nl.wikipedia.org/wiki/TivoliVredenburg",
        "PDOK BAG pand 0344100000047923, EPSG:28992",
        "PDOK AHN DSM/DTM 0,5 m via WCS: dakhoogte en dakranden van de doos, installaties en kanalen op het dak, Ronda-volume, piramidedak, lantaarn, lichtsleuf, terras, lage vleugel en maaiveld",
        "PDOK luchtfoto (Actueel_orthoHR)",
        "Wikimedia Commons: TivoliVredenburg-2014-08.JPG, TivoliVredenburg.jpg, TivoliVredenburg-20160810.jpg, TivoliVredenburg-westzijde.jpg, TivoliVredenburg from Utrecht Dom Tower.JPG, TivoliVredenburg in Utrecht (34278259525).jpg, TivoliVredenburg in Utrecht (33894441310).jpg, Utrecht (08.08.2025) 10.jpg en 11.jpg (schotels en plint van onderen)",
      ],
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

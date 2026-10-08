// Genereert een vereenvoudigd, gesloten 3D-model van Villa Volta in de
// Efteling (Kaatsheuvel, Marerijk, 1996): de crèmekleurige villa "Hugo van den
// Loonsche Duynen" in Franse stijl met het gebroken schilddak (mansarde met een
// plat bovenvlak), het vooruitspringende middenrisaliet met de portiek en het
// balkon, de grote dakkapel met het gebogen fronton en het beeld van Vrouwe
// Goeds erop, de twee kleine dakkapellen op de zijtraveeën, de hoeklisenen,
// kroonlijst, cordonlijst, plint en vensters met frontonnetjes; het bordes met
// de trappen en de borstwering met vazen; de lage, platte hal achter de villa
// en de overkapping van de ingang aan de oostkant. Alle maten in het script
// zijn meters op ware grootte. Uitvoer via scripts/efteling-kit.mjs: een GLB in
// meters (Y omhoog, nodes `klasse:label`), de catalogus-JSON en een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-efteling-villa-volta.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-villa-volta.mjs --scale 500
//
// Het draaiende "madhouse"-zaal zit in de villa zelf (het hoge blok van
// 13,4 × 18 m tot NAP +19,3 m); de hal erachter (NAP +13,4 m) en de
// ingangsoverkapping (NAP +12,2 m) zijn laag en plat. Alles hoort bij één
// BAG-pand (0809100000017595); de overkapping staat niet in de BAG. Het pand
// 0809100000017567 ten noorden (bouwjaar 2009) ligt aan de overkant van de
// Europalaan, buiten het park, en hoort er niet bij.
//
// Printbaar op 1:1000 zonder steun: muren en daken staan recht op of lopen
// schuin omhoog; kroonlijst, cordonlijst, plint en de frontonnetjes boven de
// vensters rusten op een kraag van 45 graden; de voluten naast de grote
// dakkapel lopen onder 61 graden af, de armen van het beeld onder 47 graden
// omhoog. Vensters, deuren, de portiek onder het balkon en de bogen van de
// ingangsoverkapping zijn blinde nissen van 0,3–0,5 m met een vlakke bovenkant.
// Het smeedijzeren hek, de lantaarns en de balusters zijn weggelaten (te dun);
// het balkon en het bordes hebben een dichte borstwering.
//
// Assenstelsel: oorsprong op RD (131477,90, 407200,02), op de middenas van de
// villa ter hoogte van het midden van het hoge blok, op het maaiveld (NAP +8,4
// m), Z omhoog. +X loopt langs de voorgevel naar het oost-zuidoosten (11,5
// graden rechtsom gedraaid ten opzichte van de RD-x-as), +Y naar achteren
// (noord-noordoost); de voorgevel met het bordes kijkt naar -Y (zuid-
// zuidwest), naar het parterre met de zonnewijzer.
//
// Bronnen: BAG-pand 0809100000017595 (contour, bouwjaar 1996); AHN DSM/DTM
// 0,5 m (PDOK WCS, als raster per 0,5 m in het stelsel van de villa): de
// voetafdruk van villa, risaliet, balkon, hal en overkapping, de goot (NAP
// +17,2), het platte dakvlak (+19,3), de dakkapel met fronton (+20,7), het
// balkon (+14,5), de hal (+13,4), de overkapping (+12,2) en het bordes (+9,2);
// PDOK-luchtfoto 8 cm; Wikimedia Commons (Category:Villa Volta, frontale foto's
// en een foto van het zuidoosten) voor gevelindeling en ornamenten.
// Geschat uit foto's: de knik in het mansardedak, de vensters (0,9 × 1,6 m),
// de lijsten, de vorm van fronton, voluten, vazen en beeld, en de bogen van de
// overkapping.
import {
  Manifold,
  CrossSection,
  box,
  dome,
  spire,
  union,
  downFaces,
  writeLandmark,
} from "./efteling-kit.mjs";

// ---------- maten (lokaal stelsel, z = 0 op NAP +8,4 m) ----------
const ORIGIN = [131477.9, 407200.02];
const ANGLE = (-11.5 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const BASE = -0.5;

// Hoog blok van de villa (de zaal), aan de voorkant het risaliet en de portiek.
const W = 6.7; // halve breedte van het hoge blok
const YF = -9.5; // voorgevel van de zijtraveeën
const YB = 8.6; // achtergevel
const RW = 4.1; // halve breedte van het risaliet
const YR = -12.6; // voorgevel van het risaliet
const PW = 3.9; // halve breedte van portiek en balkon
const YP = -14.6; // voorkant van het balkon
const EAVE = 8.8; // goot (NAP +17,2)
const TOP = 10.9; // plat dakvlak (NAP +19,3)
const BALCONY = 5.0; // balkonvloer (NAP +13,4)

// Rechthoek als ring op hoogte z, met een marge (positief = naar buiten).
const ring = ([x0, y0, x1, y1], z, m = 0) => [
  [x0 - m, y0 - m, z],
  [x1 + m, y0 - m, z],
  [x1 + m, y1 + m, z],
  [x0 - m, y1 + m, z],
];
const hullRings = (...rings) => Manifold.hull(rings.flat());
// Lijst rond een rechthoek: van de muur onder een kraag van 45 graden naar
// buiten tot `out`, daarboven recht op tot z1.
const ledge = (r, z0, out, z1) => hullRings(ring(r, z0 - out - 0.06, -0.02), ring(r, z0, out), ring(r, z1, out));
// Mansardedak: steil van de muur tot de knik, daarna flauw tot het platte vlak.
const mansard = (r) => hullRings(ring(r, EAVE - 0.05), ring(r, 10.4, -0.8), ring(r, TOP, -1.8));

// Nis in een gevel. face: "-y"/"+y" (gevel op y = at) of "-x"/"+x" (gevel op x = at).
const niche = (face, at, c, w, z0, z1, d = 0.3) => {
  const [s0, s1] = [c - w / 2, c + w / 2];
  if (face === "-y") return box(s0, at - 1, z0, s1, at + d, z1);
  if (face === "+y") return box(s0, at - d, z0, s1, at + 1, z1);
  if (face === "-x") return box(at - 1, s0, z0, at + d, s1, z1);
  return box(at - d, s0, z0, at + 1, s1, z1);
};
// Frontonnetje boven een venster: driehoekig, 0,25 m voor de gevel, met een
// onderkant van 45 graden.
const hood = (face, at, c, zt, w = 1.3) => {
  const pts = [];
  for (const [o, dz] of [[-0.05, 0], [0.25, 0.36]]) {
    const off = face === "-y" || face === "-x" ? -o : o;
    for (const [s, z] of [[-w / 2, zt + dz], [w / 2, zt + dz], [0, zt + 0.55 + dz * 0.4]]) {
      if (face.endsWith("y")) pts.push([c + s, at + off, z]);
      else pts.push([at + off, c + s, z]);
    }
  }
  return Manifold.hull(pts);
};
// Vaas op een sokkel (balustradevaas), 0,95 m hoog.
const urn = ([x, y], z0) =>
  dome([x, y], [[0.3, z0], [0.3, z0 + 0.2], [0.18, z0 + 0.3], [0.35, z0 + 0.6], [0.3, z0 + 0.85], [0.2, z0 + 0.95]], 16);

// ---------- villa ----------
const MAIN = [-W, YF, W, YB];
const RIS = [-RW, YR, RW, YF + 0.05];
const villaParts = [];
// Hoog blok en risaliet tot de goot.
villaParts.push(box(-W, YF, BASE, W, YB, EAVE));
villaParts.push(box(-RW, YR, BASE, RW, YF + 0.05, EAVE));
// Plint met afgeschuinde bovenkant, cordonlijst en kroonlijst.
for (const r of [MAIN, RIS]) {
  villaParts.push(hullRings(ring(r, BASE, 0.2), ring(r, 0.9, 0.2), ring(r, 1.1, -0.02)));
  villaParts.push(ledge(r, 4.95, 0.2, 5.2));
  villaParts.push(ledge(r, 8.2, 0.35, EAVE));
}
// Hoeklisenen (blokken van 1,2 m, 0,3 m voor beide gevels).
for (const sx of [-1, 1]) {
  for (const [cx, cy, dy] of [[W, YF, 1], [W, YB, -1], [RW, YR, 1]]) {
    const x0 = sx > 0 ? cx - 0.9 : -cx - 0.3;
    const x1 = sx > 0 ? cx + 0.3 : -cx + 0.9;
    const [y0, y1] = dy > 0 ? [cy - 0.3, cy + 0.9] : [cy - 0.9, cy + 0.3];
    villaParts.push(box(x0, y0, BASE, x1, y1, 8.2));
  }
}
// Mansardedak over het hoge blok en over het risaliet (dat met een eigen
// schild naar voren uitsteekt).
villaParts.push(mansard(MAIN));
villaParts.push(mansard([-RW, YR, RW, -5]));
// Grote dakkapel op het risaliet: kast met een gebogen fronton (segmentdak)
// dat 4 m diep het dak in loopt, voluten opzij, vazen en het beeld erop.
{
  // Segmentboog van x = ±1,75 op z 11,4 tot de top op z 12,3.
  const prof = [[-1.75, EAVE - 0.05], [1.75, EAVE - 0.05], [1.75, 11.4]];
  for (let k = 1; k < 12; k++) {
    const x = 1.75 - (3.5 * k) / 12;
    prof.push([x, 11.4 + 0.9 * (1 - (x / 1.75) ** 2)]);
  }
  prof.push([-1.75, 11.4]);
  const depth = -8.4 - (YR - 0.1);
  const dormer = Manifold.extrude(new CrossSection([prof]), depth).rotate([90, 0, 0]).translate([0, -8.4, 0]);
  villaParts.push(dormer);
  for (const s of [-1, 1]) {
    // Voluut: wig van de dakkapel naar de hoek van het risaliet.
    villaParts.push(
      Manifold.hull([
        [s * 1.7, YR + 0.1, EAVE - 0.05], [s * 1.7, YR + 0.7, EAVE - 0.05], [s * 1.7, YR + 0.1, 11.0], [s * 1.7, YR + 0.7, 11.0],
        [s * 2.7, YR + 0.1, EAVE - 0.05], [s * 2.7, YR + 0.7, EAVE - 0.05], [s * 2.7, YR + 0.1, 9.25], [s * 2.7, YR + 0.7, 9.25],
      ]),
    );
    villaParts.push(urn([s * 3.25, YR + 0.25], EAVE - 0.05));
  }
  // Beeld van Vrouwe Goeds: sokkel, gewaad, hoofd en armen schuin omhoog.
  const sy = YR + 0.55;
  villaParts.push(box(-0.4, sy - 0.4, 12.0, 0.4, sy + 0.4, 12.6));
  villaParts.push(dome([0, sy], [[0.38, 12.55], [0.3, 13.3], [0.24, 13.75], [0.3, 13.85], [0.12, 14.0]], 16));
  villaParts.push(dome([0, sy], [[0.12, 13.95], [0.22, 14.1], [0.2, 14.25], [0.08, 14.38]], 16));
  for (const s of [-1, 1]) {
    villaParts.push(
      Manifold.hull([
        [s * 0.1, sy - 0.15, 13.55], [s * 0.1, sy + 0.15, 13.55], [s * 0.1, sy - 0.15, 13.85], [s * 0.1, sy + 0.15, 13.85],
        [s * 0.8, sy - 0.15, 14.3], [s * 0.8, sy + 0.15, 14.3], [s * 0.8, sy - 0.15, 14.6], [s * 0.8, sy + 0.15, 14.6],
      ]),
    );
  }
}
// Kleine dakkapellen (oeil-de-boeuf) op de voorkant van de zijtraveeën, met een
// pinakel erop.
for (const s of [-1, 1]) {
  const cx = s * 5.35;
  villaParts.push(box(cx - 0.65, YF + 0.15, EAVE - 0.05, cx + 0.65, YF + 1.9, 9.9));
  villaParts.push(
    Manifold.hull([
      [cx - 0.65, YF + 0.15, 9.85], [cx + 0.65, YF + 0.15, 9.85], [cx - 0.65, YF + 1.9, 9.85], [cx + 0.65, YF + 1.9, 9.85],
      [cx, YF + 0.15, 10.5], [cx, YF + 1.9, 10.5],
    ]),
  );
  villaParts.push(spire([cx, YF + 0.45], 0.28, 10.05, 11.3, 8));
}
// Portiek met het balkon erop: dicht blok met de zuilen aan de voorhoeken en
// een nis van 0,4 m tussen en naast de zuilen; borstwering met vazen.
villaParts.push(box(-PW, YP, BASE, PW, YR + 0.05, BALCONY));
villaParts.push(box(-PW, YP, BALCONY - 0.05, PW, YP + 0.5, 6.0));
for (const s of [-1, 1]) {
  villaParts.push(box(s > 0 ? PW - 0.5 : -PW, YP, BALCONY - 0.05, s > 0 ? PW : -PW + 0.5, YR + 0.05, 6.0));
  villaParts.push(box(s * 3.5 - 0.35, YP, BALCONY - 0.05, s * 3.5 + 0.35, YP + 0.7, 6.1));
  villaParts.push(urn([s * 3.5, YP + 0.35], 6.05));
  // Kapiteel op de zuil: een lijst onder het balkon, met een kraag.
  villaParts.push(
    Manifold.hull([
      [s * 3.0, YP + 0.05, 4.3], [s * PW, YP + 0.05, 4.3], [s * 3.0, YP - 0.2, 4.6], [s * PW, YP - 0.2, 4.6],
      [s * 3.0, YP - 0.2, 4.8], [s * PW, YP - 0.2, 4.8], [s * 3.0, YP + 0.05, 4.8], [s * PW, YP + 0.05, 4.8],
    ]),
  );
}
// Balkonplaat: lijst over de volle breedte onder de borstwering.
villaParts.push(
  Manifold.hull([
    [-PW + 0.05, YP + 0.05, 4.45], [PW - 0.05, YP + 0.05, 4.45],
    [-PW - 0.25, YP - 0.25, 4.85], [PW + 0.25, YP - 0.25, 4.85],
    [-PW - 0.25, YP - 0.25, 5.1], [PW + 0.25, YP - 0.25, 5.1],
    [-PW - 0.05, YP + 0.05, 5.1], [PW + 0.05, YP + 0.05, 5.1],
  ]),
);
// Bordes: borstwering langs de voorrand naast de trap en langs de zijkanten,
// met vazen op de borstwering.
const T = { x: 8.6, y0: -15.3, top: 0.8 };
const PAR = 1.7; // bovenkant borstwering
for (const s of [-1, 1]) {
  const [a, b] = s > 0 ? [5.6, T.x] : [-T.x, -5.6];
  villaParts.push(box(a, T.y0, BASE, b, T.y0 + 0.5, PAR));
  villaParts.push(box(s > 0 ? T.x - 0.5 : -T.x, T.y0, BASE, s > 0 ? T.x : -T.x + 0.5, YF + 0.5, PAR));
  villaParts.push(box(s > 0 ? W - 0.05 : -T.x, YF, BASE, s > 0 ? T.x : -W + 0.05, YF + 0.5, PAR));
  for (const x of [5.95, 7.15, 8.35]) {
    villaParts.push(box(s * x - 0.3, T.y0 - 0.05, BASE, s * x + 0.3, T.y0 + 0.55, PAR + 0.1));
    villaParts.push(urn([s * x, T.y0 + 0.25], PAR + 0.05));
  }
  // Plantenvazen naast de deur, op het bordes voor de zuilen.
  villaParts.push(box(s * 2.6 - 0.3, YP - 0.6, BASE, s * 2.6 + 0.3, YP + 0.05, T.top + 0.1));
  villaParts.push(urn([s * 2.6, YP - 0.3], T.top + 0.05));
}
let villa = union(villaParts);
// Gevelnissen.
const cuts = [];
for (const s of [-1, 1]) {
  // Voorgevel zijtraveeën: venster beneden en boven.
  cuts.push(niche("-y", YF, s * 5.4, 0.9, 1.9, 3.5));
  cuts.push(niche("-y", YF, s * 5.4, 0.9, 5.7, 7.3));
  // Zijgevels: vijf vensters boven; beneden alleen waar de overkapping niet staat.
  for (const y of [-7, -3.5, 0, 3.5, 7]) {
    cuts.push(niche(s > 0 ? "+x" : "-x", s * W, y, 0.9, 5.7, 7.3));
    if (s < 0 || y < -3) cuts.push(niche(s > 0 ? "+x" : "-x", s * W, y, 0.9, 1.9, 3.5));
  }
  // Achtergevel boven de hal.
  cuts.push(niche("+y", YB, s * 3.5, 0.9, 5.8, 7.3));
  // Portiek: nissen in de zijkanten van het blok onder het balkon.
  cuts.push(niche(s > 0 ? "+x" : "-x", s * PW, (YP + YR) / 2 + 0.2, 0.9, T.top, 4.3, 0.4));
}
cuts.push(niche("+y", YB, 0, 0.9, 5.8, 7.3));
// Portiek tussen de zuilen (0,4 m) met de dubbele deur (nog 0,3 m dieper).
cuts.push(niche("-y", YP, 0, 6.0, T.top, 4.3, 0.4));
cuts.push(niche("-y", YP + 0.4, 0, 2.4, T.top, 3.9, 0.3));
// Balkondeuren in het risaliet en het venster in de grote dakkapel.
cuts.push(niche("-y", YR, 0, 1.8, BALCONY + 0.6, 8.0));
cuts.push(niche("-y", YR - 0.1, 0, 1.0, 9.5, 11.0));
villa = villa.subtract(union(cuts));
const hoods = [];
for (const s of [-1, 1]) {
  hoods.push(hood("-y", YF, s * 5.4, 3.6), hood("-y", YF, s * 5.4, 7.4));
  for (const y of [-7, -3.5, 0, 3.5, 7]) {
    hoods.push(hood(s > 0 ? "+x" : "-x", s * W, y, 7.4));
    if (s < 0 || y < -3) hoods.push(hood(s > 0 ? "+x" : "-x", s * W, y, 3.6));
  }
}
villa = villa.add(union(hoods));

// ---------- hal en ingangsoverkapping ----------
const HALL = [-9.5, YB - 0.05, W, 20.3];
let hall = box(HALL[0], HALL[1], BASE, HALL[2], HALL[3], 5.0);
// Dakrand van 0,4 m breed, 0,25 m hoger dan het dak.
hall = hall.add(
  box(HALL[0], HALL[1] + 0.05, 4.95, HALL[2], HALL[3], 5.25).subtract(box(HALL[0] + 0.4, HALL[1] - 1, 4.9, HALL[2] - 0.4, HALL[3] - 0.4, 5.3)),
);
// Overkapping van de ingang aan de oostkant: plat dak op pijlers, de open
// zijden als nissen van 0,5 m.
const CAN = [W - 0.05, -2.8, 12.0, 20.3];
let canopy = box(CAN[0], CAN[1], BASE, CAN[2], CAN[3], 3.8);
const canCuts = [];
const piers = [-2.8, 1.8, 6.4, 11.0, 15.6, 19.4];
for (let i = 0; i + 1 < piers.length; i++) {
  const y0 = piers[i] + (i === 0 ? 0.9 : 0.45);
  const y1 = piers[i + 1] - (i + 1 === piers.length - 1 ? 0 : 0.45);
  canCuts.push(niche("+x", CAN[2], (y0 + y1) / 2, y1 - y0, 0, 3.0, 0.5));
}
canCuts.push(niche("-y", CAN[1], (CAN[0] + CAN[2]) / 2 + 0.2, CAN[2] - CAN[0] - 2.2, 0, 3.0, 0.5));
canopy = canopy.subtract(union(canCuts));
hall = hall.add(canopy);

// ---------- bordes en trappen ----------
let bordes = box(-T.x, T.y0, BASE, T.x, YF + 0.05, T.top);
for (const k of [1, 2]) {
  const hw = 5.6 + 0.4 * k;
  bordes = bordes.add(box(-hw, T.y0 - 0.6 * k, BASE, hw, T.y0 + 0.05, T.top - 0.27 * k));
}
bordes = bordes.subtract(villa);

const nodes = [
  ["building:villa", villa],
  ["building:hal", hall],
  ["road:bordes", bordes],
];
for (const [name, solid] of nodes) {
  const down = downFaces(solid, BASE + 0.01).filter((g) => g.area > 0.05);
  console.log(name, "ondervlakken:", JSON.stringify(down));
}

await writeLandmark({
  slug: "efteling-villa-volta",
  nodes,
  base: BASE,
  catalog: {
    name: "Villa Volta (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: [
      [0, -20],
      [-11, -12],
      [11, -12],
      [-12, 4],
      [14, 8],
      [0, 23],
    ],
    replacesBuildings: ["NL.IMBAG.Pand.0809100000017595"],
    description:
      "Villa Volta in de Efteling (1996): oorsprong op de middenas van de villa, midden in het hoge blok, op het maaiveld (NAP +8,4 m); +X langs de voorgevel naar het oost-zuidoosten, de voorgevel met het bordes kijkt naar -Y (zuid-zuidwest). Villa met mansardedak tot NAP +19,3 m, risaliet met portiek en balkon, dakkapel met fronton en beeld tot circa NAP +22,8 m, platte hal erachter (+13,4 m) en ingangsoverkapping aan de oostkant (+12,2 m); vensters als nissen, hek en balusters weggelaten.",
    realWorld: {
      villaWidthMetres: 13.4,
      villaDepthMetres: 18.1,
      risalitWidthMetres: 8.2,
      balconyProjectionMetres: 5.1,
      eaveHeightMetres: 8.8,
      roofTopHeightMetres: 10.9,
      dormerPedimentHeightMetres: 12.3,
      statueTopHeightMetres: 14.6,
      hallFootprintMetres: [16.2, 11.7],
      hallHeightMetres: 5.0,
      entranceCanopyFootprintMetres: [5.4, 23.1],
      entranceCanopyHeightMetres: 3.8,
      terraceHeightMetres: 0.8,
      groundNapMetres: 8.4,
    },
    sources: [
      "BAG-pand 0809100000017595 (contour, bouwjaar 1996)",
      "AHN DSM/DTM 0,5 m (PDOK WCS): goot NAP +17,2 m, dakvlak +19,3 m, fronton +20,7 m, balkon +14,5 m, hal +13,4 m, overkapping +12,2 m, bordes +9,2 m, maaiveld +8,4 m",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR)",
      "Wikimedia Commons, Category:Villa Volta (frontale foto's en een foto van het zuidoosten)",
    ],
  },
});

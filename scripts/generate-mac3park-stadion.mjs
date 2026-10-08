// Genereert een gedetailleerd, gesloten 3D-model van het MAC³PARK Stadion in
// Zwolle (thuisstadion van PEC Zwolle, geopend in 2009 als IJsseldelta Stadion,
// 14.000 plaatsen). Het complex is één BAG-pand: een gesloten ring van
// kantoren, winkels en hoekgebouwen op +11,9 m rond vier tribunes, met een
// hotel in de zuidwesthoek. Het model bestaat uit:
// - per tribune een eigen doorsnede die langs de zijde is uitgetrokken: de
//   opgetrokken zitrang in treden (aan de veldkant deels buiten het dak), de
//   achterwand met (west) de glazen band van de skyboxen, en een dakplaat van
//   1,6 m dik met een voorlip van 2,2 m, licht aflopend naar achteren;
// - de stalen dakspanten (ribben van 0,9 m) op de dakplaten, die over de
//   achterliggende daken doorlopen, en aan de noordgevel de consoles waarop ze
//   rusten;
// - de verhoogde, gebogen dakkap boven het midden van de hoofdtribune (west,
//   Henk Timmer-tribune) met de glazen perskoker eronder, de ronde glazen
//   toren (rotonde) aan de westgevel met kroonlijst, het witte koepeltje en de
//   entree;
// - de dichte hoekgebouwen en de ring van kantoren rond de tribunes met
//   raamnissen, winkelpuien aan de westgevel, dakranden en de
//   installatieblokken op de daken;
// - het hotel (Hotel Lumen) in de zuidwesthoek tot +23,0 m met
//   raamnissen, de zuilengang op de begane grond, de glazen lichtkap en de
//   dakopbouwen, plus de lage tussenbouw naar het zuidgebouw;
// - vier vakwerk-lichtmasten op de binnenhoeken (tot +36,4 m) met
//   reclamebord, bordes en lampenbank.
// Alles is opgebouwd uit blokken, prisma's, uitgetrokken doorsneden en
// convexe rompen van vlakken (geen hoogteveld). Alle maten zijn meters op ware
// grootte.
// Uitvoer: een GLB in meters (Y omhoog, één node met de materiaalklasse in de
// nodenaam) als catalogusbron voor de export en de kaart, plus een binaire STL
// in millimeters op 1:<schaal>.
//
//   node scripts/generate-mac3park-stadion.mjs              # 1:1000 (standaard)
//   node scripts/generate-mac3park-stadion.mjs --scale 2000
//
// Assenstelsel: oorsprong in het hart van het veld (middenstip) op
// straatniveau (NAP +1,3 m; het veld ligt op NAP +2,05 m, +0,75 m), Z omhoog.
// +X loopt dwars over het veld naar het oostnoordoosten (RD-richting
// (0,9789, 0,2045), 11,8 graden, uit de voorranden van de west- en zuiddaken in
// het AHN), +Y langs het veld naar het noordnoordwesten.
//
// Overhang: de dakplaten, de gebogen dakkap, de perskoker, de kroonlijst van de
// rotonde, de luifel aan de oostgevel, de zuilengang van het hotel en de
// lampenbanken hangen uit (ondervlakken onder 45 graden boven OVERHANG_MIN_Z);
// raamnissen hebben een schuine bovenkant van 45 graden.
//
// Bronnen: BAG-pand 0193100000060760 (het hele complex, bouwjaar 2008);
// AHN DSM/DTM 0,5 m (PDOK WCS) voor de buitengevels (u ±74,3 m, v -113,6 tot
// 79,0 m, hotel tot -128,5 m), de voorranden van de dakplaten (west u -47,3 m,
// oost 46,45 m, noord v 64,75 m, zuid -64,25 m), de daken (west +12,6 m aan de
// veldkant, +12,33 m achter; oost +12,65/+12,37; noord +12,57/+12,37; zuid
// +12,63/+12,37), de ring op +11,9 m, de dakkap (vlak +15,4 m voor |v| < 5,5 m,
// tot +12,5 m op |v| = 15,5 m), de rotonde (straal 9,2 m, +15,5 m, koepel tot
// +17,4 m), het hotel (+23,0 m, opbouwen tot +25,6 m), de tussenbouw (+8,7 en
// +5,2 m), de verdiepte daken, de installatieblokken, de open voorste rijen
// (noord van +1,0 tot +3,4 m, oost van +1,2 tot +3,6 m, west +2,4 tot +3,3 m)
// en de lichtmasten (koppen tot +34,2 tot +36,5 m); PDOK luchtfoto (8 cm) voor
// de plaats van de dakspanten (oost/west 10,9 m, noord/zuid 11 m met een middenvak
// van 7 m), de zitvakken en de installaties; Wikimedia Commons-foto's (PEC
// Zwolle 2022 (drone), MAC³PARK stadion, IJsseldelta Stadion PEC Zwolle, PEC
// Zwolle - PSV 29-09-2019, Panorama IJsseldeltastadion, Zwolle
// IJsseldeltastadion) voor de spanten op de daken, de gebogen dakkap met de
// perskoker, de rotonde met koepel, de gevels met raamrijen, het hotel, de
// masten met reclamebord en lampenbank en de dichte hoeken; Wikipedia
// (14.000 plaatsen, tribunenamen). Geschat: de hoogte en diepte van de treden
// onder het dak, de dikte van de dakplaten, de achterwand en de skyboxband, de
// maat en het aantal raamnissen (oost- en zuidgevel naar het patroon van de
// west- en noordgevel), de spanten (hoogte boven het dak), de doorsnede van de
// masten (allemaal +36,4 m, de hoogste AHN-waarde) en de luifel aan de
// oostgevel. Weggelaten: de reclameborden langs het veld, hekken, stoelen,
// trappen en leuningen op de zitrang, de vakwerkdiagonalen in de spanten (te
// fijn voor 1:1000), de letters op de gevel en de zonnepanelen.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "mac3park-stadion");
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
const box = (x0, x1, y0, y1, z0, z1) => Manifold.cube([x1 - x0, y1 - y0, z1 - z0]).translate([x0, y0, z0]);
const hull = (pts) => Manifold.hull(pts);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 1, 1, 0, 0, x0, 0, 0]);
const lerp = (a, b, t) => a + (b - a) * t;

const SLUG = "mac3park-stadion";

// ---------- maten (lokaal stelsel, z = hoogte boven straatniveau op NAP +1,3 m) ----------
const ORIGIN = [204799.11, 503530.84];
const X_AXIS = [0.978867, 0.204496]; // RD-richting 11,8 graden, dwars over het veld
const BASE = -0.5;
const OVERLAP = 0.02;
const FIELD_Z = 0.75; // het veld, NAP +2,05 m (niet gemodelleerd)

// Buitengevels van de ring (AHN) en het dak van de ring.
const RING = { u: [-74.35, 74.35], v: [-113.6, 79.0], top: 11.9, rim: 0.4 };
// Veldopening tussen de voorranden van de dakplaten (AHN).
const FIELD = { u: [-47.3, 46.45], v: [-64.25, 64.75] };

// Per tribune: de voorrand van het dak (`front`), de richting naar buiten, het bereik langs de zijde (`span`),
// de zitrang als lijst treden [n begin, z begin, n einde, z einde, aantal] (n = afstand vanaf de voorrand van
// het dak naar buiten, negatief = voor het dak, open), de achterwand (n begin, n einde), de dakplaat
// (n einde, bovenkant voor en achter), het bereik van de open voorste rijen langs de zijde, de spanten
// (posities langs de zijde) en hoe ver ze over het achterliggende dak doorlopen.
const STANDS = {
  west: {
    front: FIELD.u[0],
    span: [-64.0, 48.5],
    rake: [
      [-3.5, 2.4, -2.0, 2.4, 1], // dug-outs en businessplaatsen aan het veld (uitbouw 2013)
      [-2.0, 3.3, 9.5, 8.4, 8],
    ],
    wall: [9.5, 12.5],
    roof: { end: 12.0, top: [12.6, 12.33] },
    frontSpan: null,
    trusses: [-59.7, -48.8, -38.0, -27.1, -16.3, 16.3, 27.1, 38.0],
    trussEnd: 19.0,
    band: [8.9, 10.3], // glazen band van de skyboxen in de achterwand
  },
  east: {
    front: FIELD.u[1],
    span: [-64.0, 64.0],
    rake: [[-5.25, 1.2, 9.75, 8.2, 10]],
    wall: [9.75, 12.95],
    roof: { end: 12.45, top: [12.65, 12.37] },
    frontSpan: [-57.0, 64.0],
    frontCut: -0.75,
    trusses: [-59.7, -48.8, -38.0, -27.1, -16.3, -5.4, 5.4, 16.3, 27.1, 38.0, 48.8, 59.7],
    trussEnd: 20.5,
  },
  north: {
    front: FIELD.v[1],
    span: [-46.5, 47.2],
    rake: [[-6.25, 1.0, 11.5, 8.1, 11]],
    wall: [11.5, 14.25],
    roof: { end: 14.25, top: [12.57, 12.37] },
    frontSpan: [-31.5, 47.2],
    frontCut: -0.25,
    trusses: [-36.0, -25.4, -14.4, -3.4, 3.4, 14.4, 25.4, 36.0],
    trussEnd: 15.05,
  },
  south: {
    front: FIELD.v[0],
    span: [-46.5, 46.45],
    roofSpan: [-46.5, 52.5],
    rake: [[-1.5, 1.4, 11.0, 7.6, 8]],
    wall: [11.0, 13.75],
    roof: { end: 13.25, top: [12.63, 12.37] },
    frontSpan: null,
    trusses: [-36.2, -25.4, -14.5, -3.5, 3.5, 14.5, 25.4, 36.2],
    trussEnd: 21.0,
    podium: { span: [-30, 20], n: [-5.25, -1.4], top: 1.6 }, // verhoogd platform voor de zuidtribune
  },
};
const ROOF_THICK = 1.6;
const LIP = { depth: 1.5, thick: 2.2 };
const TRUSS = { width: 0.9, front: 0.9, back: 2.2 };
// De verhoogde dakkap boven het midden van de hoofdtribune (west): vlak op +15,4 m voor |v| < 5,5 m, gebogen
// naar +12,5 m op |v| = 15,5 m (AHN), 2,0 m dik, en achter de tribune tot aan de rotonde.
const HUMP = { flat: 5.5, edge: 15.5, top: 15.4, low: 12.5, thick: 2.0, back: -61.0 };
const PRESS_BOX = { u: [-57.0, -48.6], v: [-5.0, 5.0], z: [10.6, 13.4] };
// Rotonde aan de westgevel (glas, straal 9,2 m, +15,5 m), kroonlijst, koepel (straal 2,0 m, top +17,4 m) en entree.
const ROTUNDA = { c: [-67.2, 0.0], r: 9.2, top: 15.5, cornice: [14.6, 0.5], dome: { c: [-66.3, 0.0], r: 2.0, top: 17.4 } };
const ENTRANCE = { u: [-78.6, -75.0], v: [-2.2, 2.2], top: 3.8 };
// Dug-outs en de overkapte strook langs de westkant van het veld (AHN +2,7 m en +1,8 m): [v0, v1, bovenkant].
const DUGOUTS = { u: [-43.8, -40.3], parts: [[-6.0, -1.5, 2.7], [2.5, 7.0, 2.7], [22.0, 48.5, 2.7], [-16.0, -6.0, 1.8], [7.0, 17.0, 1.8]] };
// Hoekgebouw noordwest: lagere voorkant aan de veldkant (AHN +7,3 m).
const NW_FRONT = { u: [-47.3, -46.0], v: [48.5, 64.75], top: 7.3 };
// Hotel in de zuidwesthoek (BAG-contour, AHN +23,0 m).
const HOTEL = {
  u: [-74.35, -44.8],
  v: [-128.5, -77.6],
  top: 23.0,
  arcade: { depth: 2.0, top: 4.6, pitch: 6.0, column: 0.9 },
  skylight: { u: [-63.3, -55.3], v: [-109.0, -95.0], ridge: 24.6 },
  boxes: [
    [-63.3, -55.3, -122.0, -111.0, 25.6],
    [-49.3, -47.3, -123.0, -111.0, 25.2],
    [-61.3, -47.3, -86.5, -84.5, 25.3],
    [-53.3, -49.3, -113.0, -87.0, 24.0],
  ],
};
// Tussenbouw tussen hotel en zuidgebouw: +8,7 m met een lager middendeel op +5,2 m (AHN).
const LINK = { u: [-44.8, -36.3], v: [-113.6, -77.6], top: 8.7, low: { v: [-101.0, -86.0], top: 5.2 } };
// Verdiept dak in het zuidoosten (+8,4 m) en de luifel boven de oostentree.
const SE_RECESS = { u: [47.0, 58.0], v: [-84.0, -78.5], top: 8.4 };
const EAST_CANOPY = { u: [74.35, 76.4], v: [-5.0, 5.0], z: [3.4, 4.4] };
// Installatieblokken en dakopbouwen op de ring (AHN: [u0, u1, v0, v1, bovenkant]).
const ROOF_BOXES = [
  [-69.5, -61.0, 34.0, 47.0, 13.6],
  [-70.5, -63.0, 47.0, 60.0, 13.4],
  [-66.0, -60.0, 65.0, 72.5, 13.2],
  [-68.5, -61.0, -47.5, -27.5, 13.5],
  [-68.5, -60.0, -71.0, -51.0, 13.7],
  [60.0, 68.5, 9.0, 12.5, 15.3],
  [64.5, 71.0, -1.5, 1.5, 13.2],
  [71.0, 73.2, -5.0, 63.0, 13.3],
  [61.5, 65.0, 20.5, 23.0, 14.3],
  [62.5, 65.0, 31.0, 33.5, 14.0],
  [60.0, 64.0, -83.0, -77.8, 15.1],
  [60.5, 63.0, -89.0, -85.5, 13.6],
  [-11.0, -4.0, -98.5, -85.5, 14.1],
  [1.0, 7.5, -99.5, -86.0, 14.2],
  [11.5, 17.5, -97.0, -86.0, 13.8],
  [-27.5, -15.5, -100.5, -97.5, 13.9],
  [19.0, 22.5, -88.5, -85.5, 13.2],
  [23.0, 25.5, -105.0, -101.0, 13.9],
];
// Raamnissen: 1,3 m breed, 0,35 m diep, twee rijen in de ring (+5,0 en +8,8 m), zes in het hotel; winkelpuien
// (4,6 m breed, tot +3,4 m) aan de westgevel.
const WINDOW = { width: 1.3, depth: 0.35, pitch: 2.6, ringRows: [[5.0, 6.8], [8.8, 10.6]], groundRow: [1.2, 3.0] };
const SHOP = { width: 4.6, pitch: 7.8, z: [0.3, 3.4] };
const HOTEL_ROWS = [0, 1, 2, 3, 4, 5].map((k) => [5.6 + 2.95 * k, 7.3 + 2.95 * k]);
// Consoles aan de noordgevel onder de spanten.
const FIN = { out: 0.7, bottom: 3.5 };
// Lichtmasten op de binnenhoeken (plaats van de lampenbank uit het AHN), allemaal +36,4 m.
const MASTS = [
  { at: [-49.6, 68.2], top: 36.4 },
  { at: [49.9, 68.2], top: 36.4 },
  { at: [-49.6, -67.6], top: 36.4 },
  { at: [49.9, -67.6], top: 36.4 },
];
const MAST_FOOT = 11.0;
// Maaiveld (AHN NAP +1,26 tot +1,40 m) op de straten, het plein en de parkeerterreinen rond het complex.
const GROUND_SAMPLES = [[-82, 30], [-84, -50], [0, 90], [86, 0], [0, -124], [-60, -140]];
// Laagste PDOK-terreinhoogte op die punten (ellipsoïdisch, noord- en zuidstraat, NAP +1,27 m): terugval als er
// geen maaiveld bemonsterd kan worden.
const GROUND_HEIGHT = 43.97;
const OVERHANG_MIN_Z = 3.0;

// ---------- tribunes ----------
// Kader per zijde: (langs a, n naar buiten, z) naar (u, v, z).
const FRAME = {
  west: (a, n, z) => [STANDS.west.front - n, a, z],
  east: (a, n, z) => [STANDS.east.front + n, a, z],
  north: (a, n, z) => [a, STANDS.north.front + n, z],
  south: (a, n, z) => [a, STANDS.south.front - n, z],
};
// Doorsnede [n, z] uittrekken langs de zijde van a0 tot a1 (als romp van de convexe stukken).
const sweepConvex = (side, quad, a0, a1) => hull([...quad.map(([n, z]) => FRAME[side](a0, n, z)), ...quad.map(([n, z]) => FRAME[side](a1, n, z))]);
// Niet-convexe doorsnede: per stuk een rechthoek of vierhoek.
const roofTopAt = (s, n) => lerp(s.roof.top[0], s.roof.top[1], Math.min(Math.max(n / s.roof.end, 0), 1.2));
const roofUnderAt = (s, n) => roofTopAt(s, n) - (n < LIP.depth ? LIP.thick : ROOF_THICK);
const treads = (s) => {
  const out = [];
  for (const [n0, z0, n1, z1, count] of s.rake) {
    for (let i = 0; i < count; i++) {
      const a = n0 + ((n1 - n0) * i) / count;
      const b = n0 + ((n1 - n0) * (i + 1)) / count;
      const z = count === 1 ? z0 : z0 + ((z1 - z0) * i) / (count - 1);
      out.push([a, b, z]);
    }
  }
  return out;
};
const standParts = (side) => {
  const s = STANDS[side];
  const [a0, a1] = s.span;
  const parts = [];
  // Treden: elk een blok van de onderkant tot de trede, 2 cm overlap met de buren.
  const ts = treads(s);
  ts.forEach(([n0, n1, z], i) => {
    const e0 = i > 0 ? OVERLAP : 0;
    parts.push(sweepConvex(side, [[n0 - e0, BASE], [n1 + OVERLAP, BASE], [n1 + OVERLAP, z], [n0 - e0, z]], a0, a1));
  });
  // Achterwand tot in de dakplaat.
  const [w0, w1] = s.wall;
  parts.push(sweepConvex(side, [[w0 - OVERLAP, BASE], [w1, BASE], [w1, roofUnderAt(s, w1) + 0.3], [w0 - OVERLAP, roofUnderAt(s, w0) + 0.3]], a0, a1));
  // De dakplaat: voorlip van 2,2 m en daarachter 1,6 m dik.
  const [r0, r1] = s.roofSpan ?? s.span;
  const lipEnd = LIP.depth;
  parts.push(
    sweepConvex(side, [[0, roofTopAt(s, 0) - LIP.thick], [lipEnd + OVERLAP, roofTopAt(s, lipEnd) - LIP.thick], [lipEnd + OVERLAP, roofTopAt(s, lipEnd)], [0, roofTopAt(s, 0)]], r0, r1),
  );
  parts.push(
    sweepConvex(side, [[lipEnd, roofTopAt(s, lipEnd) - ROOF_THICK], [s.roof.end, roofTopAt(s, s.roof.end) - ROOF_THICK], [s.roof.end, roofTopAt(s, s.roof.end)], [lipEnd, roofTopAt(s, lipEnd)]], r0, r1),
  );
  let stand = Manifold.union(parts);
  // De open voorste rijen alleen waar ze staan (luchtfoto en AHN).
  if (s.frontSpan) {
    const cut = [];
    if (s.frontSpan[0] > a0) cut.push([a0 - 1, s.frontSpan[0]]);
    if (s.frontSpan[1] < a1) cut.push([s.frontSpan[1], a1 + 1]);
    for (const [c0, c1] of cut) {
      stand = stand.subtract(sweepConvex(side, [[-20, BASE - 1], [s.frontCut, BASE - 1], [s.frontCut, 30], [-20, 30]], c0, c1));
    }
  }
  if (s.podium) {
    const { span, n, top } = s.podium;
    stand = stand.add(sweepConvex(side, [[n[0], BASE], [n[1] + OVERLAP, BASE], [n[1] + OVERLAP, top], [n[0], top]], span[0], span[1]));
  }
  return stand;
};
// Spanten op de dakplaat: een rib van 0,9 m die van 0,9 m boven het dak aan de veldkant oploopt tot 2,2 m boven de
// achterrand en daarna afloopt tot op het achterliggende dak (noord: tot over de gevel).
const trussesFor = (side) => {
  const s = STANDS[side];
  const out = [];
  const nR = s.roof.end;
  const nT = s.trussEnd;
  const tailBottom = side === "north" ? roofTopAt(s, nR) - 0.9 : RING.top - 0.05;
  const tailTop = side === "north" ? roofTopAt(s, nR) + 1.2 : RING.top + 0.9;
  const poly = [
    [0.3, roofTopAt(s, 0.3) - 0.05],
    [nR, roofTopAt(s, nR) - 0.05],
    [nT, tailBottom],
    [nT, tailTop],
    [nR, roofTopAt(s, nR) + TRUSS.back],
    [0.3, roofTopAt(s, 0.3) + TRUSS.front],
  ];
  for (const a of s.trusses) {
    // Twee convexe helften: boven de dakplaat en het stuk over het achterliggende dak.
    const h = TRUSS.width / 2;
    out.push(sweepConvex(side, [poly[0], poly[1], poly[4], poly[5]], a - h, a + h));
    out.push(sweepConvex(side, [[nR - 0.5, roofTopAt(s, nR) - 0.05], poly[2], poly[3], [nR - 0.5, roofTopAt(s, nR) + TRUSS.back]], a - h, a + h));
    if (side === "north") {
      // Console aan de gevel onder het einde van het spant, met een schuine voet van 45 graden.
      const n0 = s.wall[1];
      out.push(
        hull([
          ...[a - h, a + h].flatMap((aa) => [
            FRAME.north(aa, n0 - 0.1, FIN.bottom),
            FRAME.north(aa, n0 - 0.1, tailBottom + 0.5),
            FRAME.north(aa, n0 + FIN.out, FIN.bottom + FIN.out + 0.1),
            FRAME.north(aa, n0 + FIN.out + 0.1, tailBottom + 0.5),
          ]),
        ]),
      );
    }
  }
  return out;
};

const stands = Object.keys(STANDS).map(standParts);
const trusses = Object.keys(STANDS).flatMap(trussesFor);

// ---------- de dakkap boven de hoofdtribune ----------
// Bovenkant als functie van v: vlak, dan gebogen naar de rand (vier facetten per kant).
const humpTop = (v) => {
  const d = Math.abs(v);
  if (d <= HUMP.flat) return HUMP.top;
  const t = Math.min((d - HUMP.flat) / (HUMP.edge - HUMP.flat), 1);
  // Bolle boog: eerst flauw, dan steiler (cirkelachtig), van +15,4 naar +12,5 m.
  return HUMP.low + (HUMP.top - HUMP.low) * Math.sqrt(1 - t * t * 0.96);
};
const humpVs = [-HUMP.edge, -13.0, -10.5, -8.0, -HUMP.flat, HUMP.flat, 8.0, 10.5, 13.0, HUMP.edge];
const humpProfile = (thick, bottomFlat) => {
  const top = humpVs.map((v) => [v, humpTop(v)]);
  const bottom = [...humpVs].reverse().map((v) => [v, bottomFlat ?? humpTop(v) - thick]);
  return [...top, ...bottom];
};
const westFront = STANDS.west.front;
const westRoofBack = westFront - STANDS.west.roof.end;
// Over de tribune: een gebogen plaat van 2,0 m dik; achter de tribune tot op het dak van de ring.
const humpParts = [];
for (let i = 0; i + 1 < humpVs.length; i++) {
  const [va, vb] = [humpVs[i], humpVs[i + 1]];
  const quad = [[va, humpTop(va) - HUMP.thick], [vb, humpTop(vb) - HUMP.thick], [vb, humpTop(vb)], [va, humpTop(va)]];
  const pts = [];
  for (const u of [westRoofBack - OVERLAP, westFront]) for (const [v, z] of quad) pts.push([u, v + (v === va ? -OVERLAP : OVERLAP), z]);
  humpParts.push(hull(pts));
  const back = [[va, RING.top - 0.3], [vb, RING.top - 0.3], [vb, humpTop(vb)], [va, humpTop(va)]];
  const bpts = [];
  for (const u of [HUMP.back, westRoofBack]) for (const [v, z] of back) bpts.push([u, v, z]);
  humpParts.push(hull(bpts));
}
const pressBox = box(PRESS_BOX.u[0], PRESS_BOX.u[1], PRESS_BOX.v[0], PRESS_BOX.v[1], PRESS_BOX.z[0], PRESS_BOX.z[1]);

// ---------- de ring van kantoren en hoekgebouwen ----------
const ringBox = box(RING.u[0], RING.u[1], RING.v[0], RING.v[1], BASE, RING.top);
// De kom: veld plus de voetafdruk van elke tribune (die zijn eigen achterwand meebrengt).
const bowl = Manifold.union([
  box(FIELD.u[0], FIELD.u[1], FIELD.v[0], FIELD.v[1], BASE - 1, 40),
  box(westFront - STANDS.west.wall[1] + 0.01, FIELD.u[0] + 0.01, STANDS.west.span[0], STANDS.west.span[1], BASE - 1, 40),
  box(FIELD.u[1] - 0.01, STANDS.east.front + STANDS.east.wall[0] + 0.5, STANDS.east.span[0], STANDS.east.span[1], BASE - 1, 40),
  box(STANDS.north.span[0], STANDS.north.span[1], FIELD.v[1] - 0.01, RING.v[1] + 1, BASE - 1, 40),
  box(STANDS.south.span[0], STANDS.south.span[1], STANDS.south.front - STANDS.south.wall[0] - 0.5, FIELD.v[0] + 0.01, BASE - 1, 40),
]);
let ring = ringBox.subtract(bowl);
// Dakrand langs de buitengevels (0,9 m breed, 0,4 m hoog).
const rimW = 0.9;
const rims = [
  box(RING.u[0], RING.u[0] + rimW, HOTEL.v[1], RING.v[1], RING.top - OVERLAP, RING.top + RING.rim),
  box(RING.u[1] - rimW, RING.u[1], RING.v[0], RING.v[1], RING.top - OVERLAP, RING.top + RING.rim),
  box(LINK.u[1], RING.u[1], RING.v[0], RING.v[0] + rimW, RING.top - OVERLAP, RING.top + RING.rim),
];
// Lagere delen: de tussenbouw en het verdiepte dak in het zuidoosten.
ring = ring
  .subtract(box(LINK.u[0], LINK.u[1], LINK.v[0] - 1, LINK.v[1], LINK.top, 40))
  .subtract(box(LINK.u[0], LINK.u[1], LINK.low.v[0], LINK.low.v[1], LINK.low.top, 40))
  .subtract(box(SE_RECESS.u[0], SE_RECESS.u[1], SE_RECESS.v[0], SE_RECESS.v[1], SE_RECESS.top, 40));
const dugouts = DUGOUTS.parts.map(([v0, v1, top]) => box(DUGOUTS.u[0] - OVERLAP, DUGOUTS.u[1], v0, v1, BASE, top));
const nwFront = box(NW_FRONT.u[0], NW_FRONT.u[1] + OVERLAP, NW_FRONT.v[0], NW_FRONT.v[1], BASE, NW_FRONT.top);
const roofBoxes = ROOF_BOXES.map(([u0, u1, v0, v1, top]) => box(u0, u1, v0, v1, RING.top - OVERLAP, top));
const canopy = box(EAST_CANOPY.u[0] - 0.3, EAST_CANOPY.u[1], EAST_CANOPY.v[0], EAST_CANOPY.v[1], EAST_CANOPY.z[0], EAST_CANOPY.z[1]);

// ---------- de rotonde ----------
const rotunda = Manifold.union([
  Manifold.cylinder(ROTUNDA.top - BASE, ROTUNDA.r, ROTUNDA.r, 48).translate([ROTUNDA.c[0], ROTUNDA.c[1], BASE]),
  Manifold.cylinder(ROTUNDA.top - ROTUNDA.cornice[0], ROTUNDA.r + ROTUNDA.cornice[1], ROTUNDA.r + ROTUNDA.cornice[1], 48).translate([ROTUNDA.c[0], ROTUNDA.c[1], ROTUNDA.cornice[0]]),
  Manifold.sphere(ROTUNDA.dome.r, 32).translate([ROTUNDA.dome.c[0], ROTUNDA.dome.c[1], ROTUNDA.dome.top - ROTUNDA.dome.r]),
  box(ENTRANCE.u[0], ENTRANCE.u[1], ENTRANCE.v[0], ENTRANCE.v[1], BASE, ENTRANCE.top),
]).intersect(box(-200, 200, -200, 200, BASE, 100));

// ---------- het hotel ----------
const hotelParts = [box(HOTEL.u[0], HOTEL.u[1], HOTEL.v[0], HOTEL.v[1], BASE, HOTEL.top)];
hotelParts.push(box(HOTEL.u[0], HOTEL.u[0] + rimW, HOTEL.v[0], HOTEL.v[1], HOTEL.top - OVERLAP, HOTEL.top + 0.5));
hotelParts.push(box(HOTEL.u[1] - rimW, HOTEL.u[1], HOTEL.v[0], HOTEL.v[1], HOTEL.top - OVERLAP, HOTEL.top + 0.5));
hotelParts.push(box(HOTEL.u[0], HOTEL.u[1], HOTEL.v[0], HOTEL.v[0] + rimW, HOTEL.top - OVERLAP, HOTEL.top + 0.5));
hotelParts.push(box(HOTEL.u[0], HOTEL.u[1], HOTEL.v[1] - rimW, HOTEL.v[1], HOTEL.top - OVERLAP, HOTEL.top + 0.5));
for (const [u0, u1, v0, v1, top] of HOTEL.boxes) hotelParts.push(box(u0, u1, v0, v1, HOTEL.top - OVERLAP, top));
{
  // Glazen lichtkap: zadeldak met de nok langs v.
  const { u, v, ridge } = HOTEL.skylight;
  const um = (u[0] + u[1]) / 2;
  hotelParts.push(hull([
    [u[0], v[0], HOTEL.top - OVERLAP], [u[1], v[0], HOTEL.top - OVERLAP], [um, v[0], ridge],
    [u[0], v[1], HOTEL.top - OVERLAP], [u[1], v[1], HOTEL.top - OVERLAP], [um, v[1], ridge],
  ]));
}
let hotel = Manifold.union(hotelParts);
// Zuilengang aan de westgevel: 2,0 m diep tot +4,6 m, zuilen van 0,9 m om de 6 m.
{
  const { depth, top, pitch, column } = HOTEL.arcade;
  const cut = box(HOTEL.u[0] - 1, HOTEL.u[0] + depth, HOTEL.v[0] + 1.0, HOTEL.v[1] - 1.0, 0, top);
  const cols = [];
  for (let v = HOTEL.v[1] - 1.0; v >= HOTEL.v[0] + 1.0 - 1e-6; v -= pitch) cols.push(box(HOTEL.u[0], HOTEL.u[0] + column, v - column, v, -1, top + 1));
  hotel = hotel.subtract(cut.subtract(Manifold.union(cols)));
}

// ---------- raamnissen ----------
// Nis in een gevelvlak: face = { axis: "u" | "v", at, inward: +1 | -1 }, langs a, van z0 tot z1, breedte w.
// De bovenkant loopt onder 45 graden naar binnen, zodat er geen overhang ontstaat.
const niche = (face, a, z0, z1, w, d = WINDOW.depth) => {
  const pts = [];
  for (const aa of [a - w / 2, a + w / 2]) {
    for (const [off, zt] of [[-0.15, z1], [d, z1 - d - 0.3]]) {
      const c = face.at + face.inward * off;
      for (const z of [z0, zt]) pts.push(face.axis === "u" ? [c, aa, z] : [aa, c, z]);
    }
  }
  return hull(pts);
};
const nicheRow = (face, a0, a1, pitch, rows, w, skip = () => false) => {
  const out = [];
  const n = Math.floor((a1 - a0) / pitch);
  const start = (a0 + a1) / 2 - (n * pitch) / 2;
  for (let i = 0; i <= n; i++) {
    const a = start + i * pitch;
    if (a - w / 2 < a0 || a + w / 2 > a1 || skip(a)) continue;
    for (const [z0, z1] of rows) out.push(niche(face, a, z0, z1, w));
  }
  return out;
};
const WEST = { axis: "u", at: RING.u[0], inward: 1 };
const EAST = { axis: "u", at: RING.u[1], inward: -1 };
const NORTH = { axis: "v", at: RING.v[1], inward: -1 };
const SOUTH = { axis: "v", at: RING.v[0], inward: 1 };
const nearFin = (a) => STANDS.north.trusses.some((t) => Math.abs(t - a) < 1.5);
const ringNiches = [
  // Westgevel: twee raamrijen en winkelpuien, onderbroken door de rotonde.
  ...nicheRow(WEST, HOTEL.v[1] + 1.0, -10.5, WINDOW.pitch, WINDOW.ringRows, WINDOW.width),
  ...nicheRow(WEST, 10.5, RING.v[1] - 1.0, WINDOW.pitch, WINDOW.ringRows, WINDOW.width),
  ...nicheRow(WEST, HOTEL.v[1] + 1.0, -11.0, SHOP.pitch, [SHOP.z], SHOP.width),
  ...nicheRow(WEST, 11.0, RING.v[1] - 1.0, SHOP.pitch, [SHOP.z], SHOP.width),
  // Noordgevel: drie rijen, onderbroken door de consoles.
  ...nicheRow(NORTH, RING.u[0] + 1.0, RING.u[1] - 1.0, WINDOW.pitch, [WINDOW.groundRow, ...WINDOW.ringRows], WINDOW.width, nearFin),
  // Oostgevel (patroon geschat), onderbroken door de luifel.
  ...nicheRow(EAST, RING.v[0] + 1.0, RING.v[1] - 1.0, WINDOW.pitch, WINDOW.ringRows, WINDOW.width),
  ...nicheRow(EAST, RING.v[0] + 1.0, -6.0, WINDOW.pitch, [WINDOW.groundRow], WINDOW.width),
  ...nicheRow(EAST, 6.0, RING.v[1] - 1.0, WINDOW.pitch, [WINDOW.groundRow], WINDOW.width),
  // Zuidgevel (patroon geschat).
  ...nicheRow(SOUTH, LINK.u[1] + 1.0, RING.u[1] - 1.0, WINDOW.pitch, [WINDOW.groundRow, ...WINDOW.ringRows], WINDOW.width),
];
const HW = { axis: "u", at: HOTEL.u[0], inward: 1 };
const HS = { axis: "v", at: HOTEL.v[0], inward: 1 };
const HE = { axis: "u", at: HOTEL.u[1], inward: -1 };
const HN = { axis: "v", at: HOTEL.v[1], inward: -1 };
const hotelNiches = [
  ...nicheRow(HW, HOTEL.v[0] + 1.0, HOTEL.v[1] - 1.0, WINDOW.pitch, HOTEL_ROWS, WINDOW.width),
  ...nicheRow(HS, HOTEL.u[0] + 1.0, HOTEL.u[1] - 1.0, WINDOW.pitch, [[1.2, 3.4], ...HOTEL_ROWS], WINDOW.width),
  ...nicheRow(HE, HOTEL.v[0] + 1.0, RING.v[0] - 0.5, WINDOW.pitch, [[1.2, 3.4], ...HOTEL_ROWS], WINDOW.width),
  ...nicheRow(HE, RING.v[0] + 0.5, HOTEL.v[1] - 1.0, WINDOW.pitch, HOTEL_ROWS.filter(([z0]) => z0 > LINK.top + 0.3), WINDOW.width),
  ...nicheRow(HN, HOTEL.u[0] + 1.0, HOTEL.u[1] - 1.0, WINDOW.pitch, HOTEL_ROWS.filter(([z0]) => z0 > RING.top + 0.6), WINDOW.width),
];
// Glazen band van de skyboxen in de achterwand van de hoofdtribune.
const skyboxBand = (() => {
  const s = STANDS.west;
  const n = s.wall[0];
  const out = [];
  for (const [a0, a1] of [[s.span[0] + 1.0, -HUMP.edge], [HUMP.edge, s.span[1] - 1.0]]) {
    out.push(hull([a0, a1].flatMap((a) => [FRAME.west(a, n - 0.1, s.band[0]), FRAME.west(a, n - 0.1, s.band[1]), FRAME.west(a, n + 0.6, s.band[0]), FRAME.west(a, n + 0.6, s.band[1] - 0.7)])));
  }
  return out;
})();

// ---------- de lichtmasten ----------
// Vakwerkpilaar op het dak van het hoekgebouw: vier poten van 0,9 m (3,0 m breed onderaan, 2,4 m bovenaan),
// ringbalken en kruisdiagonalen van 0,9 m, een reclamebord aan de buitenkant, een bordes en de lampenbank die
// naar het veld wijst.
const mast = ([cx, cy], top) => {
  const leg = 0.9;
  const baseW = 3.0;
  const topW = 2.4;
  const zHead = top - 5.6;
  const levels = [MAST_FOOT + 1.4, 17.0, 22.5, zHead - 0.6];
  const off = (z) => (baseW + ((topW - baseW) * (z - MAST_FOOT)) / (zHead - MAST_FOOT)) / 2 - leg / 2;
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const cube = (x, y, z, s) => corners.flatMap(([dx, dy]) => [[x + dx * s, y + dy * s, z - s], [x + dx * s, y + dy * s, z + s]]);
  const parts = [];
  for (const [sx, sy] of corners) {
    const pts = [];
    for (const z of [MAST_FOOT, zHead]) for (const [dx, dy] of corners) pts.push([cx + sx * off(z) + (dx * leg) / 2, cy + sy * off(z) + (dy * leg) / 2, z]);
    parts.push(hull(pts));
  }
  for (const z of levels) {
    const o = off(z);
    const z0 = z - 0.45;
    const outer = box(cx - o - 0.45, cx + o + 0.45, cy - o - 0.45, cy + o + 0.45, z0, z0 + 0.9);
    parts.push(outer.subtract(box(cx - o + 0.45, cx + o - 0.45, cy - o + 0.45, cy + o - 0.45, z0 - 1, z0 + 2)));
  }
  for (let i = 0; i + 1 < levels.length; i++) {
    const zA = levels[i] + 0.45;
    const zB = levels[i + 1] - 0.45;
    for (let c = 0; c < 4; c++) {
      const a = corners[c];
      const b = corners[(c + 1) % 4];
      const oa = off(zA);
      const ob = off(zB);
      parts.push(hull([...cube(cx + a[0] * oa, cy + a[1] * oa, zA, 0.45), ...cube(cx + b[0] * ob, cy + b[1] * ob, zB, 0.45)]));
    }
  }
  // Kop: een romp van de pilaarkop naar het bordes, daarop de lampenbank (7,0 × 1,4 m, 4,8 m hoog).
  const facing = (Math.atan2(-cy, -cx) * 180) / Math.PI; // +X van de kop wijst naar het veld
  const oh = off(zHead) + leg / 2;
  const head = Manifold.union([
    hull([...corners.map(([dx, dy]) => [dx * oh, dy * oh, zHead - 0.05]), ...[[-1.3, -3.7], [1.3, -3.7], [1.3, 3.7], [-1.3, 3.7]].map(([x, y]) => [x + 0.4, y, zHead + 1.5])]),
    box(-0.9, 1.7, -3.7, 3.7, zHead + 1.45, zHead + 2.1),
    box(0.3, 1.7, -3.5, 3.5, zHead + 2.05, top),
  ]);
  parts.push(head.rotate([0, 0, facing]).translate([cx, cy, 0]));
  // Reclamebord aan de buitenkant (5,0 × 4,5 m, 0,9 m dik).
  const board = box(-off(17) - 0.45 - 0.9, -off(17) - 0.45 + 0.02, -2.5, 2.5, 18.0, 22.5);
  parts.push(board.rotate([0, 0, facing]).translate([cx, cy, 0]));
  return Manifold.union(parts);
};
const masts = MASTS.map(({ at: p, top }) => mast(p, top));

// ---------- samenvoegen ----------
const OVERHANG_OK = (z) => z >= OVERHANG_MIN_Z;
const body = Manifold.union([ring, ...rims, nwFront, ...dugouts, ...roofBoxes, canopy, ...stands, ...trusses, ...humpParts, pressBox, rotunda, hotel, ...masts]);
const stadium = body.subtract(Manifold.union([...ringNiches, ...hotelNiches, ...skyboxBand]));
// Het complex is één BAG-pand (tribunes, kantoren, hoekgebouwen en hotel).
const REPLACED_BUILDINGS = ["0193100000060760"];
const nodes = [["building:stadion", stadium]];
const all = stadium;

const META = {
  name: "MAC³PARK Stadion",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundHeight: GROUND_HEIGHT,
  groundSamplePoints: GROUND_SAMPLES,
  replacesBuildings: REPLACED_BUILDINGS,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (204799,11, 503530,84) op de middenstip op straatniveau (NAP +1,3 m; het veld ligt 0,75 m hoger), +X dwars over het veld naar het oostnoordoosten (11,8 graden) en +Y langs het veld naar het noordnoordwesten. Eén node building:stadion: de gesloten ring van kantoren en hoekgebouwen (148,7 bij 192,6 m, dak +11,9 m, raamnissen, winkelpuien, dakranden en installaties) rond vier tribunes, elk met een eigen doorsnede (zitrang in treden, deels open voor het dak, achterwand en een dakplaat van 1,6 m met een voorlip van 2,2 m op +12,4 tot +12,65 m) en stalen spanten op de daken, de gebogen dakkap (+15,4 m) met perskoker boven de hoofdtribune, de glazen rotonde met koepel aan de westgevel, het hotel in de zuidwesthoek (+23,0 m, zuilengang, lichtkap, opbouwen) en vier vakwerk-lichtmasten met reclamebord en lampenbank (+36,4 m) op de binnenhoeken. Onderkant op 0,5 m onder het maaiveld; dakplaten, dakkap en lampenbanken hangen uit (de export vult ze op). Vervangt de PDOK-reconstructie van het BAG-pand van het complex. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: {
    capacity: 14000,
    fieldOpeningM: [+(FIELD.u[1] - FIELD.u[0]).toFixed(2), +(FIELD.v[1] - FIELD.v[0]).toFixed(2)],
    fieldM: FIELD_Z,
    ringRoofM: RING.top,
    standRoofM: Object.fromEntries(Object.entries(STANDS).map(([k, s]) => [k, s.roof.top])),
    mainStandCrownM: HUMP.top,
    rotundaM: [ROTUNDA.top, ROTUNDA.dome.top],
    hotelM: HOTEL.top,
    mastTopM: MASTS.map((m) => m.top),
    groundNapM: 1.3,
    baseM: BASE,
  },
  sources: [
    "https://nl.wikipedia.org/wiki/MAC%C2%B3PARK_stadion",
    "PDOK BAG pand 0193100000060760 (het hele complex), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: buitengevels, voorranden en hoogtes van de dakplaten, ring, dakkap, rotonde, hotel, tussenbouw, installaties, open voorste rijen en lichtmasten",
    "PDOK luchtfoto (Actueel_orthoHR): dakspanten, zitvakken en dakopbouwen",
    "Wikimedia Commons: PEC Zwolle 2022 (drone), MAC³PARK stadion, IJsseldelta Stadion PEC Zwolle, PEC Zwolle - PSV 29-09-2019, Panorama IJsseldeltastadion, Zwolle IJsseldeltastadion (spanten, dakkap met perskoker, rotonde met koepel, gevels, hotel, masten, dichte hoeken)",
  ],
};

// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(p[0][2], p[1][2], p[2][2]) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(p[0][2], p[1][2], p[2][2]);
      if (OVERHANG_OK(z)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}
const pieces = all.decompose();
if (argv.includes("--components")) {
  for (const piece of pieces) {
    const b = piece.boundingBox();
    console.log("stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
  }
}

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
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
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
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    const v = mesh.vertProperties;
    for (let i = 0; i < count; i++) {
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
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
    meshes.push({ name, primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }] });
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
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
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    pieces: pieces.length,
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint MAC3PARK Stadion 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (pieces.length > 1) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint MAC3PARK Stadion grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundHeight != null ? { groundHeight: META.groundHeight } : {}),
      groundSamplePoints: META.groundSamplePoints,
      replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

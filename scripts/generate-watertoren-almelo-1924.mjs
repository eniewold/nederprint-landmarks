// Watertoren uit 1924 aan de Sluiskade Noordzijde in Almelo, op het voormalige fabrieksterrein van Ten Cate (Indië-
// terrein). De toren leverde bluswater voor de textielfabriek (in de buurt "stoftoren" genoemd) en bleef als enige over
// toen de sheds werden gesloopt; sinds 2023-2024 wordt hij verbouwd tot woning (BAG-status "Verbouwing pand", zaak
// Z/23/138121) en ernaast komen nieuwe woningen. Wikipedia noemt drie reservoirs; hoogte en inhoud zijn onbekend.
//
// Vorm (Commons-foto's "Watertoren Sluiskade Almelo 1924" van het zuiden en "Indieterrein Almelo" van het zuidwesten,
// luchtfoto, AHN en 3D BAG): alles is een langgerekte achthoek, langer oost-west dan noord-zuid, met korte noord- en
// zuidgevels, iets langere oost- en westgevels en vier schuine gevels. Een bakstenen schacht met per gevel twee hoge smalle
// vensters; een betonnen balkon (de leuning van dunne stijlen en buizen is weggelaten) met een schuine onderkant; een
// witgepleisterde reservoirverdieping met hoekpenanten en verdiepte vlakken; een witte lijst op consoles; een bakstenen
// bovenkamer met twee vensters per gevel; een overstekende witte goot en een achtzijdig schilddak met pannen en een korte
// nok oost-west.
//
// Oorsprong op het hart van BAG-pand 0141100000089114 (de schacht: 6,3 × 4,8 m, afgeschuinde hoeken) en van de
// dakomhullende in het AHN-DSM (8,5 × 7,25 m boven NAP +27), op maaiveld NAP +11,15 (AHN-DTM rond de toren 11,0 tot
// 11,4; 3D BAG-maaiveld 11,03). +X naar het oosten langs de nok, RD-richting -1,5 graden (gemiddelde van de BAG-gevels
// en de 3D BAG-nok: -1,2, -0,2, -2,5 en -1,9 graden), +Y naar het noorden.
// Hoogtes: nok NAP +29,75 (AHN-DSM 29,72, 3D BAG 29,77), zuiddakvlak in de 3D BAG 35,6 graden, goot dus op NAP +27,2.
// Geledingen eronder uit de twee foto's: de zuidfoto (57 m van de toren, vrijwel frontaal op de zuidgevel, 115 px/m uit
// de breedte van de goot) en de foto van het zuidwesten (55 px/m uit de hoogte tot de nok).
import { hull, union, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [241402.4, 486687.6];
const AXIS_DEG = -1.5;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 11.15;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints aan de oost-, zuid- en westkant (54,28, 54,23,
// 54,54 en 54,53), gemeten 2026-11-05. Ten noorden van de toren ligt het PDOK-terrein tot 2 m lager (bouwput van de
// nieuwe aanbouw, BAG-pand 0141100000097393 "Bouw gestart"); daar staat geen bemonsteringspunt, anders zakt de toren mee.
const GROUND_ELLIPSOID = 54.23;

// ---------- achthoeken ----------
// De bovenkamer: 8,0 × 6,4 m, zuid- en noordgevel 2,8 m, oost- en westgevel 3,2 m, schuine gevels 3,05 m (zuidfoto:
// zuidgevel 2,8 m, schuine gevels 2,55 m in projectie). Alle andere achthoeken zijn er evenwijdige verschuivingen van.
const ROOM = { hx: 4.0, hy: 3.2, fx: 1.4, fy: 1.6 };
const octagon = ({ hx, hy, fx, fy }) => [
  [fx, -hy], [hx, -fy], [hx, fy], [fx, hy], [-fx, hy], [-hx, fy], [-hx, -fy], [-fx, -hy],
];
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
const room = octagon(ROOM);
const OFF = {
  eaves: 0.4, // goot, 8,8 × 7,2 m (luchtfoto 8,8 × 7,1; AHN-DSM 8,5 × 7,25)
  cornice: 0.1, // witte lijst onder de bovenkamer
  balcony: -0.05, // balkonplaat, 7,9 m breed (zuidfoto)
  tank: -0.75, // reservoirverdieping tussen de penanten, 6,5 m breed (zuidfoto)
  panel: -0.95, // verdiepte vlakken tussen de penanten
  shaft: -0.85, // schacht 6,3 × 4,8 m (BAG)
};
const ring = (d, z) => offset(room, d).map(([x, y]) => [x, y, z]);
const octPrism = (d, z0, z1) => prism(offset(room, d), z0, z1);

// Hoogtes boven het maaiveld (NAP +11,15).
const H = {
  door: [0, 2.1], // deur in de zuidgevel (foto van het zuidwesten: 1,1 × 2,0 m)
  shaftWindows: [4.6, 7.8], // twee hoge smalle vensters per gevel
  balconyCorbel: 8.2, // schuine onderkant van de balkonband vanaf de schacht
  balcony: [9.0, 9.6], // band en plaat van het balkon
  panels: [9.9, 11.3], // verdiepte vlakken van de reservoirverdieping
  corniceCorbel: 11.65, // consoles en lijst, onderkant 45 graden
  cornice: [12.5, 12.9],
  windows: [14.1, 15.3], // vensters van de bovenkamer (zuidfoto: 0,6 × 1,2 m, twee per gevel)
  roomTop: 15.45, // onderkant van de goot onder 45 graden tot de gootlijst
  eaves: [15.85, 16.05], // gootlijst; het zuiddakvlak van de 3D BAG komt op 16,05
  ridge: 18.6, // nok NAP +29,75
};
const RIDGE_HALF = 1.5; // nok 3,0 m oost-west (3D BAG 3,1 m; zuidfoto: zo lang als de zuidgevel)

// Nis in gevel i (rand i → i+1 van de achthoek met verschuiving d), u langs de gevel vanaf het midden, breedte w, van z0
// tot z1, diepte depth; plafond onder 56 graden naar binnen, buiten de gevel een schuine snede die de lijsten niet raakt.
const niche = (d, i, u, w, z0, z1, depth) => {
  const pts = offset(room, d);
  const p = pts[i], q = pts[(i + 1) % pts.length];
  const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
  const t = [(q[0] - p[0]) / len, (q[1] - p[1]) / len];
  const n = [t[1], -t[0]];
  const m = [(p[0] + q[0]) / 2 + t[0] * u, (p[1] + q[1]) / 2 + t[1] * u];
  const at = (o, s, z) => [m[0] + n[0] * o + t[0] * s, m[1] + n[1] * o + t[1] * s, z];
  const za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([-w / 2, w / 2].flatMap((s) => [
    at(-depth, s, z0), at(1.0, s, z0), at(-depth, s, za), at(0, s, z1), at(1.0, s, zb),
  ]));
};
const faceLength = (d, i) => {
  const pts = offset(room, d);
  const p = pts[i], q = pts[(i + 1) % pts.length];
  return Math.hypot(q[0] - p[0], q[1] - p[1]);
};
const FACES = [0, 1, 2, 3, 4, 5, 6, 7]; // 7 = zuidgevel, 3 = noordgevel, 1 = oost, 5 = west
const SOUTH = 7;

// ---------- schacht en balkon ----------
const shaft = octPrism(OFF.shaft, BASE, H.balconyCorbel + 0.01);
const balcony = hull([...ring(OFF.shaft, H.balconyCorbel), ...ring(OFF.balcony, H.balcony[0]), ...ring(OFF.balcony, H.balcony[1])]);

// ---------- reservoirverdieping, lijst en bovenkamer ----------
const tank = octPrism(OFF.tank, H.balcony[1] - 0.01, H.cornice[0]);
const cornice = hull([...ring(OFF.tank, H.corniceCorbel), ...ring(OFF.cornice, H.cornice[0]), ...ring(OFF.cornice, H.cornice[1])]);
const upper = octPrism(0, H.cornice[1] - 0.01, H.roomTop + 0.01);

// ---------- goot en dak ----------
// Achtzijdig schilddak: convexe omhullende van de gootlijst en de nok. Zuid- en noordvlak 35 graden (3D BAG 35,6), oost-
// en westvlak 41 graden; de onderkant van de goot loopt onder 45 graden van de gevel naar de gootlijst.
const roof = hull([
  ...ring(0, H.roomTop),
  ...ring(OFF.eaves, H.eaves[0]),
  ...ring(OFF.eaves, H.eaves[1]),
  [-RIDGE_HALF, 0, H.ridge],
  [RIDGE_HALF, 0, H.ridge],
]);

// ---------- openingen ----------
const openings = union([
  // Schacht: twee hoge smalle vensters per gevel (0,45 m, hart op hart 1,0 m) als nis.
  ...FACES.flatMap((i) => [-0.5, 0.5].map((u) => niche(OFF.shaft, i, u, 0.45, ...H.shaftWindows, 0.3))),
  // Deur in de zuidgevel.
  niche(OFF.shaft, SOUTH, 0, 1.1, ...H.door, 0.35),
  // Reservoirverdieping: per gevel een verdiept vlak tussen hoekpenanten van 0,45 m.
  ...FACES.map((i) => niche(OFF.tank, i, 0, faceLength(OFF.tank, i) - 0.9, ...H.panels, 0.2)),
  // Bovenkamer: twee vensters per gevel (0,6 m, hart op hart 0,95 m).
  ...FACES.flatMap((i) => [-0.475, 0.475].map((u) => niche(0, i, u, 0.6, ...H.windows, 0.3))),
]);
const tower = union([shaft, balcony, tank, cornice, upper, roof]).subtract(openings);

await writeLandmark({
  slug: "watertoren-almelo-1924",
  base: BASE,
  nodes: [["building:achtkante-schacht-balkon-reservoir-bovenkamer-en-dak", tower]],
  catalog: {
    name: "Watertoren Almelo (1924)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6.5, 0], [-5, -5], [4, -5.5], [0, -6]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0141100000089114"],
    description:
      "Oorsprong op het hart van het BAG-pand (de schacht) op maaiveld (NAP +11,15 m), +X naar het oosten langs de nok (RD-richting -1,5 graden), +Y naar het noorden. Langgerekte achthoek: bakstenen schacht van 6,3 × 4,8 m met twee hoge vensters per gevel en een deur in het zuiden, balkon op 9,6 m met schuine onderkant (leuning weggelaten), witte reservoirverdieping met hoekpenanten en verdiepte vlakken, lijst op 12,9 m, bakstenen bovenkamer van 8,0 × 6,4 m met twee vensters per gevel, overstekende goot op 16,05 m en een achtzijdig schilddak met een nok van 3 m tot 18,6 m. Maten uit BAG, AHN, 3D BAG en twee foto's.",
    realWorld: {
      built: 1924,
      reservoirs: 3,
      purpose: "bluswater voor de textielfabriek van Ten Cate (Indië-terrein)",
      ahnGroundNapM: GROUND_NAP,
      ahnRidgeNapM: 29.72,
      bag3dRidgeNapM: 29.77,
      bag3dSouthRoofDeg: 35.6,
      shaftM: [6.3, 4.8],
      upperRoomM: [ROOM.hx * 2, ROOM.hy * 2],
      eavesM: [8.8, 7.2],
      balconyM: H.balcony[1],
      corniceM: H.cornice,
      eavesHeightM: H.eaves[1],
      ridgeM: H.ridge,
      ridgeLengthM: RIDGE_HALF * 2,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Almelo_Sluiskade) (1924, drie reservoirs, Sluiskade Noordzijde)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Sluiskade_Almelo_1924.jpg (2007, vanaf het zuiden: bovenkamer, lijst, reservoirverdieping, balkon, schacht; breedtes)",
      "https://commons.wikimedia.org/wiki/File:Indieterrein_Almelo.jpg (vanaf het zuidwesten: hele toren, geledingen, deur)",
      "PDOK BAG-pand 0141100000089114 (bouwjaar 1900 in de BAG, status Verbouwing pand 2024), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-05",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0141100000089114: nok, dakhelling, maaiveld, opgehaald 2026-11-05",
    ],
  },
});

// Watertoren van Nieuwegein (ook "watertoren van IJsselstein") aan het Hooglandse Jaagpad in De Hoge Landen. Gebouwd
// in 1911 naar ontwerp van Roelof Kuipers voor het gemeentelijke waterleidingbedrijf van IJsselstein; 28,5 m hoog volgens
// Wikipedia, reservoir van 150 m³, rijksmonument 526781. Sinds de grenswijziging van 1990 ligt hij in Nieuwegein.
// Een witgepleisterde betonnen toren op een lage achthoekige onderbouw: een licht verjongende ronde schacht met 24
// halfronde ribben, een band op circa 15 m, daarboven een kort stuk schacht met twaalf schuin uitlopende consoles en
// kleine rondboogvensters, het cilindrische reservoir met 24 ribben tussen een onderrand en een band, een fries van korte
// ribben onder de kroonlijst en een plat dak. De onderbouw heeft gladde wanden met verdiepte velden, een brede
// overstekende boeiboord en een flauw hellend leien dak tot de schacht. Aan het BAG-pand horen ook een lage aanbouw in het
// noordoosten, een gang naar het zuidoosten en een vierkant bijgebouw met plat dak.
//
// Oorsprong op het hart van de achthoek uit BAG-pand 0356100000074678 (het hart van het dakvlak van het reservoir in het
// AHN-DSM ligt er 0,1 m naast) op het maaiveld: AHN-DTM NAP +1,35 (ring van 7 tot 12 m: 1,3 tot 1,4). Assen gelijk aan RD
// (+X oost, +Y noord); hoeken in graden linksom vanaf oost.
// Maten: achthoek uit de BAG (regelmatig, hoekpunten op 6,33 m van het hart, eerste hoekpunt op 27,5 graden);
// aanbouw, gang en bijgebouw uit de BAG-hoekpunten. Hoogtes uit het AHN-DSM 0,5 m: dak van het reservoir NAP +27,25
// (25,9 m), straal van het reservoir 4,95 à 5,0 m (oppervlak boven 12 m), dakrand van de onderbouw NAP +4,5 à +4,7,
// dak tegen de schacht circa NAP +5,6, aanbouw NAP +3,45, gang NAP +4,1, bijgebouw NAP +5,87. Geledingen (banden, ribben,
// consoles, vensters, boeiboord) en de stralen van de schacht uit de foto "Watertoren Nieuwegein in 2020.jpg" (Commons,
// vanuit het zuidwesten), geschaald op de reservoirdoorsnede en de dakhoogte uit het AHN.
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [133436.5, 447560.4];
const AXIS = [1, 0];
const GROUND_NAP = 1.35;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: west (-8, 0) 44,81,
// noord (0, 8) 44,73, zuid (-3, -8) 45,00, oost (9, 3) 44,99. Het PDOK-pand staat op 44,71.
const GROUND_ELLIPSOID = 44.73;

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const local = (pts) => pts.map(([x, y]) => [+(x - ORIGIN[0]).toFixed(3), +(y - ORIGIN[1]).toFixed(3)]);
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder
// 63 graden op, buiten de gevel loopt de snede schuin af (over `out` m, steiler dan 50 graden).
const niche = (f, w, z0, z1, depth = 0.3, out = 1) => {
  const a = f - depth, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [f + out, -w / 2, z0], [a, w / 2, z0], [f + out, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [f + out, -w / 2, zb], [f + out, w / 2, zb]]);
};
// Rondboognis: als niche, met een halfrond (7 punten) vanaf de aanzet zSpring; buiten de gevel loopt de snede 0,3 m
// recht door, zodat hij de schuine reservoirbodem erboven niet raakt.
const archNiche = (f, w, z0, zSpring, depth = 0.3) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([v, z]) => [a, v, z + 2 * depth]),
    ...arc.map(([v, z]) => [f, v, z]),
    ...arc.map(([v, z]) => [f + 0.3, v, z]),
    [a, -r, z0], [a, r, z0], [f + 0.3, -r, z0], [f + 0.3, r, z0],
  ]);
};
// Halfronde rib langs +X: achthoek met straal w van (r0, z0) tot (r1, z1).
const rib = (r0, z0, r1, z1, w) => {
  const oct = (r, z) => Array.from({ length: 8 }, (_, k) => [r + w * Math.cos(rad(22.5 + 45 * k)), w * Math.sin(rad(22.5 + 45 * k)), z]);
  return hull([...oct(r0, z0), ...oct(r1, z1)]);
};

// ---------- hoogtes boven het maaiveld (NAP +1,35) ----------
const H = {
  panel: [0.5, 2.0], // verdiepte velden in de wanden van de onderbouw
  fasciaSoffit: 2.3, // onderkant van de schuine overstek tegen de wand
  fascia: [2.8, 3.25], // boeiboord (AHN-dakrand NAP +4,5 à +4,7)
  roofAtShaft: 4.3, // leien dak tegen de schacht (AHN NAP +5,6)
  shaftRibTop: 15.4,
  band: [14.75, 15.2, 15.7], // band op de schacht: onderkant schuin, bovenkant
  flareWindows: [15.8, 16.3], // kleine rondboogvensters tussen de consoles (aanzet van de boog; op de foto circa 0,5 m
  // hoger, verlaagd zodat de kruin 0,4 m onder de schuine bodem blijft: anders vult de export de smalle penant naast de
  // console op)
  cone: 17.0, // begin van de schuine reservoirbodem
  ledge: [19.03, 19.55], // onderrand van het reservoir
  resWindows: [23.3, 24.2], // twee vensters onder de band aan de zuidwestkant
  resBand: [24.3, 24.6, 24.85], // band onder het fries
  cornice: [25.1, 25.46], // kroonlijst: onderkant schuin
  roof: 25.9, // plat dak (AHN NAP +27,25)
  annex: 2.15, // aanbouw in het noordoosten (AHN NAP +3,45)
  corridor: 2.75, // gang (AHN NAP +4,1)
  block: 4.55, // vierkant bijgebouw (AHN NAP +5,87)
};
const R = {
  oct: 6.33, // hoekpunten van de achthoek (BAG)
  octPhase: 27.5,
  fasciaOut: 0.4, // overstek van het boeiboord (foto)
  shaftFoot: 3.68, // schacht boven het dak (foto: verjongt naar de band)
  shaftTop: 3.38,
  band: 3.73,
  neck: 3.5, // schacht tussen de consoles
  ledge: 5.2,
  reservoir: 4.95, // AHN
  cornice: 5.25,
  rib: 0.24, // halve breedte van de ribben (0,48 m breed)
};
const RIBS = every(24, 225); // ribben van schacht en reservoir, één op het zuidwesten (tussen de vensters)
const CONSOLES = every(12, 225); // consoles onder het reservoir, één op het zuidwesten

// ---------- onderbouw ----------
const octagon = (r) => Array.from({ length: 8 }, (_, k) => polar(r, R.octPhase + 45 * k));
const apothem = R.oct * Math.cos(rad(22.5));
const octOut = octagon(R.oct + R.fasciaOut / Math.cos(rad(22.5)));
const base = prism(octagon(R.oct), BASE, H.fascia[0]);
// Boeiboord met een schuine onderkant van 51 graden en het leien dak tot de schacht (25 graden).
const roofDisk = Array.from({ length: 48 }, (_, k) => [...polar(R.shaftFoot - 0.05, 7.5 * k), H.roofAtShaft]);
const fasciaRoof = hull([
  ...octagon(R.oct).map(([x, y]) => [x, y, H.fasciaSoffit]),
  ...octOut.map(([x, y]) => [x, y, H.fascia[0]]),
  ...octOut.map(([x, y]) => [x, y, H.fascia[1]]),
  ...roofDisk,
]);
// Verdiepte velden op de zes vrije wanden (de wand in het noordoosten draagt de aanbouw, die in het zuidoosten de gang).
const faceNormals = every(8, R.octPhase + 22.5).filter((deg) => ![50, 320].includes(Math.round(deg)));
const panels = union(around(niche(apothem, 3.2, ...H.panel, 0.3), faceNormals));

// Aanbouw in het noordoosten, gang en bijgebouw in het zuidoosten (BAG-hoekpunten).
const ANNEX = local([[133442.09, 447563.25], [133445.319, 447567.199], [133441.239, 447570.53], [133438.089, 447566.669]]);
const CORRIDOR = local([[133440.33, 447555.729], [133444.779, 447552.01], [133446.33, 447554.279], [133441.84, 447557.94]]);
const BLOCK = local([[133442.809, 447549.669], [133449.01, 447544.7], [133453.799, 447550.569], [133447.629, 447555.859]]);
const annex = prism(ANNEX, BASE, H.annex);
const corridor = prism(CORRIDOR, BASE, H.corridor);
const block = prism(BLOCK, BASE, H.block);

// ---------- toren ----------
// Schacht van het maaiveld tot het reservoir als omwentelingsprofiel: verjongende schacht, band met een onderkant van
// 50 graden, hals met vensters, schuine bodem van 50 graden tot de onderrand, reservoir, band, fries en kroonlijst.
const shaftR = (z) => R.shaftFoot - ((R.shaftFoot - R.shaftTop) * (z - H.roofAtShaft)) / (H.band[0] - H.roofAtShaft);
const tower = rev([
  [0, BASE], [R.shaftFoot + 0.02, BASE], [R.shaftFoot, H.roofAtShaft], [R.shaftTop, H.band[0]], [R.band, H.band[1]], [R.band, H.band[2]],
  [R.neck, H.band[2]], [R.neck, H.cone], [R.ledge, H.ledge[0]], [R.ledge, H.ledge[1]], [R.reservoir, H.ledge[1]],
  [R.reservoir, H.resBand[0]], [R.ledge, H.resBand[1]], [R.ledge, H.resBand[2]], [R.reservoir, H.resBand[2]],
  [R.reservoir, H.cornice[0]], [R.cornice, H.cornice[1]], [R.cornice, H.roof], [0, H.roof],
]);
// Ribben op de schacht (vanaf onder het leien dak tot in de band), op het reservoir (van de onderrand tot in de band) en
// in het fries (van de band tot in de kroonlijst).
const shaftRib = rib(shaftR(3.8) + 0.02, 3.8, shaftR(H.band[0]) + 0.02, H.shaftRibTop, R.rib);
const resRib = rib(R.reservoir, H.ledge[1] - 0.15, R.reservoir, H.resBand[1] + 0.05, R.rib);
const friezeRib = rib(R.reservoir, H.resBand[2] - 0.1, R.reservoir, H.cornice[1] + 0.05, R.rib);
const ribs = union([...around(shaftRib, RIBS), ...around(resRib, RIBS), ...around(friezeRib, RIBS)]);
// Consoles: 0,9 m brede schijven van de band schuin naar buiten tot in de onderrand (buitenkant 67 graden).
const console0 = hull([
  [R.neck - 0.2, -0.45, H.band[2]], [R.neck - 0.2, 0.45, H.band[2]], [3.6, -0.45, H.band[2]], [3.6, 0.45, H.band[2]],
  [R.neck - 0.2, -0.45, H.ledge[0] + 0.3], [R.neck - 0.2, 0.45, H.ledge[0] + 0.3], [5.1, -0.45, H.ledge[0] + 0.3], [5.1, 0.45, H.ledge[0] + 0.3],
]);
const consoles = union(around(console0, CONSOLES));
// Vensters: kleine rondboogvensters in paren tussen de consoles (vier paren), twee vensters in het reservoir aan de
// zuidwestkant (op de foto tussen twee ribben onder de band).
const windows = union([
  ...around(archNiche(R.neck, 0.6, H.flareWindows[0], H.flareWindows[1], 0.3), [210, 240, 120, 150, 30, 60, 300, 330]),
  ...around(niche(R.reservoir, 0.6, ...H.resWindows, 0.3, 0.5), [217.5, 232.5]),
]);

const all = union([base, fasciaRoof, annex, corridor, block, tower, ribs, consoles]).subtract(union([panels, windows]));

await writeLandmark({
  slug: "watertoren-nieuwegein",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-reservoir-en-bijgebouwen", all]],
  catalog: {
    name: "Watertoren Nieuwegein",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-8, 0], [0, 8], [-3, -8], [9, 3]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0356100000074678"],
    description:
      "Oorsprong op het hart van de achthoekige onderbouw uit het BAG-pand op het maaiveld (NAP +1,35 m), assen gelijk aan RD. Achthoekige onderbouw (hoekpunten op 6,33 m) met verdiepte velden, overstekend boeiboord op 3,25 m en leien dak tot de schacht; verjongende ronde schacht met 24 ribben en een band op 15,7 m; hals met twaalf consoles en vier paren rondboogvensters; reservoir (straal 4,95 m) op een schuine bodem met onderrand, 24 ribben, twee vensters, band, fries en kroonlijst tot het platte dak op 25,9 m; lage aanbouw, gang en vierkant bijgebouw uit hetzelfde pand. Maten uit BAG, AHN en een foto.",
    realWorld: {
      built: 1911,
      architect: "Roelof Kuipers",
      rijksmonument: 526781,
      publishedHeightM: 28.5,
      reservoirM3: 150,
      ahnGroundNapM: GROUND_NAP,
      ahnRoofNapM: 27.25,
      ahnBaseEaveNapM: 4.6,
      ahnBlockNapM: 5.87,
      octagonVertexRadiusM: R.oct,
      shaftRadiusM: [R.shaftFoot, R.shaftTop],
      reservoirRadiusM: R.reservoir,
      bandM: [H.band[1], H.band[2]],
      ledgeM: H.ledge,
      reservoirBandM: [H.resBand[1], H.resBand[2]],
      roofM: H.roof,
      annexM: H.annex,
      corridorM: H.corridor,
      blockM: H.block,
      ribs: RIBS.length,
      consoles: CONSOLES.length,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Nieuwegein) (1911, Roelof Kuipers, 28,5 m, 150 m³, Hooglandse Jaagpad, rijksmonument 526781)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Nieuwegein_in_2020.jpg (2020, vanuit het zuidwesten: onderbouw, schacht, consoles, reservoir, vensters)",
      "PDOK BAG-pand 0356100000074678, AHN DSM/DTM 0,5 m, 3D BAG en luchtfoto, 2026-11-06",
    ],
  },
});

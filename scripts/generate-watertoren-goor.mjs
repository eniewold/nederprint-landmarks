// Watertoren van Goor (gemeente Hof van Twente) aan de Markeloseweg, gebouwd in 1915 (Wikipedia: 29 m hoog, reservoir
// 125 m³; gemeentelijk monument). Ronde bakstenen toren: een lage onderbouw met rondboogvensters onder een gepleisterde
// band, een licht verjongende schacht met vier kolommen vensters, een dunne band en een kort stuk metselwerk onder een
// holle, gepleisterde overgang naar de bredere ronde reservoirommanteling met smalle vensters; bovenaan een gepleisterde
// kroonlijst en een gekanteelde borstwering. Aan de zuidkant staat een laag aanbouwtje met een plat dak (hetzelfde BAG-pand).
//
// Oorsprong op het hart van BAG-pand 1735100000057191 (cirkelpassing op de 26 boogpunten van de contour: straal 3,73 m,
// de reservoirommanteling van bovenaf), op maaiveld NAP +12,1 (3D BAG-maaiveld 12,10; AHN-DTM in een ring van 6 tot 12 m
// 12,04 tot 12,9, mediaan 12,24). +X naar het oosten, +Y naar het noorden.
// Hoogtes: AHN-DSM 0,5 m en 3D BAG. Kantelen NAP +40,6 tot +40,87 (3D BAG h_dak_max 40,71), dakluik +41,17; binnen de
// borstwering ligt een rond dak op +40,55 met daaromheen een ring waar het DSM tot NAP +19 à +26 naar binnen kijkt (een
// spleet tussen reservoir en ommanteling; op de luchtfoto zwarte sikkels langs de binnenrand). Aanbouw: dak NAP +15,6.
// Geledingen eronder en breedtes uit "Goor Watertoren 8803.JPG" (Commons, 2006, vanuit het westen; 70,2 px/m verticaal tussen
// het aanbouwdak op 3,5 m en de kantelen op 28,7 m, horizontaal circa 66 px/m uit de reservoirdiameter van 7,46 m) en
// gecontroleerd op "Goor-markeloseweg-208095.jpg" (Commons, 2020, vanuit het westnoordwesten).
import { hull, union, prism, circle, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [235743.6, 472420.48];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 12.1;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06 met de terreintegels van de export
// (noord 55,60, west 56,12, oost 55,59, oost van de aanbouw 55,56, west van de aanbouw 55,80).
const GROUND_ELLIPSOID = 55.56;

const deg = (a) => (a * Math.PI) / 180;
const N = 64; // segmenten van de ronde delen
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const disc = (r, z) => ring(circle([0, 0], r, N), z);
// Omwentelingslichaam als convexe omhullende van schijven [r, z] (alleen voor convexe profielen).
const lathe = (profile) => hull(profile.flatMap(([r, z]) => disc(r, z)));

// Punt in het stelsel van een gevel: normaal onder hoek a (graden, linksom vanaf oost), o langs de normaal, s langs de gevel.
const frame = (a) => {
  const n = [Math.cos(deg(a)), Math.sin(deg(a))];
  const t = [-n[1], n[0]];
  return (o, s, z) => [n[0] * o + t[0] * s, n[1] * o + t[1] * s, z];
};
// Blinde nis met normaal a op afstand rw van het hart, breedte w, van z0 tot z1, diepte depth; plafond onder 56 graden de muur
// in, met gable een spitse top van 50 graden (rondboog). Buiten de gevel loopt de snede onder 56 graden omlaag en reikt niet
// verder dan het plafond boven z0 blijft (zie watertoren-daarle): de schacht verjongt, dus een vlakkere snede zou er onder de
// bovenkant van een laag venster een plafond in snijden.
const niche = (a, rw, w, z0, z1, depth, gable = 0, u = 0) => {
  const at0 = frame(a);
  const at = (o, s, z) => at0(rw + o, u + s, z);
  const out = Math.min(1, (z1 - z0) / 1.5);
  const pts = [-w / 2, w / 2].flatMap((s) => [
    at(-depth, s, z0), at(out, s, z0), at(-depth, s, z1 + 1.5 * depth), at(0, s, z1), at(out, s, z1 - 1.5 * out),
  ]);
  if (gable > 0) pts.push(at(0, 0, z1 + gable), at(-depth, 0, z1 + gable + 1.5 * depth));
  return hull(pts);
};

// ---------- maten (meters, hoogtes boven maaiveld NAP +12,1) ----------
const R = {
  base: 2.9, // onderbouw, 5,8 m (foto: 402 px)
  lowerBand: 3.05, // gepleisterde band boven de onderbouw, 6,1 m (foto: 420 px)
  shaftFoot: 2.85, // schacht boven de band, 5,7 m (foto: 395 px)
  shaftTop: 2.45, // schacht onder de dunne band, 4,9 m
  thinBand: 2.55,
  stub: 2.42, // metselwerk onder de overgang, 4,85 m (foto: 323 px)
  flare: 2.77, // knik in de holle overgang
  reservoir: 3.73, // ommanteling, BAG-cirkel 7,46 m
  reservoirBand: 3.82, // gepleisterde band onder de ommanteling (foto: 492 px)
  cornice: 3.84, // kroonlijst (foto: 502 px)
  parapet: 3.78, // borstwering
  parapetInner: 2.85, // binnenkant van de borstwering (0,93 m dik)
  tankRoof: 2.1, // rond dak binnen de borstwering (AHN-DSM: plateau op NAP +40,55)
};
const H = {
  lowerBand: [3.8, 3.95, 4.6], // band: onderkant 45 graden van 3,8 tot 3,95, bovenkant 4,6 (foto 3,79 tot 4,57)
  thinBand: [18.4, 18.5, 18.75], // dunne band (foto 18,5 tot 18,7)
  flare: [19.4, 19.95, 21.0], // holle overgang: 32 graden, daarna 45 graden tot de band (foto 19,7 tot 20,9)
  reservoirBand: 21.7, // bovenkant band, ommanteling begint (foto 21,7)
  cornice: [27.1, 27.21, 27.8], // kroonlijst (foto 27,2 tot 28,0)
  crenel: 27.8, // onderkant van de kantelen (vergroot tot 0,92 m; in het echt circa 0,5 m)
  parapet: 28.72, // bovenkant van de kantelen, NAP +40,82
  trough: 26.95, // bodem van de ring tussen reservoirdak en borstwering (blind, 1,5 m diep)
  tankRoof: 28.45, // NAP +40,55
  hatch: 29.07, // dakluik, NAP +41,17
  annexWall: 3.15,
  annexEave: 3.45,
  annexRoof: 3.5, // AHN-DSM NAP +15,6
};
const COLUMNS = [15, 105, 195, 285]; // vier kolommen vensters in schacht en ommanteling (foto: de westkolom iets naar het zuiden)
const MERLONS = 12;

const shaftR = (z) => R.shaftFoot + ((R.shaftTop - R.shaftFoot) * (z - H.lowerBand[2])) / (H.thinBand[0] - H.lowerBand[2]);

// ---------- toren ----------
const base = prism(circle([0, 0], R.base, N), BASE, H.lowerBand[0] + 0.01);
const lowerBand = lathe([[R.base, H.lowerBand[0]], [R.lowerBand, H.lowerBand[1]], [R.lowerBand, H.lowerBand[2]]]);
const shaft = lathe([[R.shaftFoot, H.lowerBand[2] - 0.01], [R.shaftTop, H.thinBand[0] + 0.01]]);
const thinBand = lathe([[R.shaftTop, H.thinBand[0]], [R.thinBand, H.thinBand[1]], [R.thinBand, H.thinBand[2]]]);
const stub = prism(circle([0, 0], R.stub, N), H.thinBand[2] - 0.01, H.flare[0] + 0.01);
// Holle overgang benaderd met twee kegelstukken (32 en 45 graden uit het lood), samen niet convex: twee omhullenden.
const flare = union([
  lathe([[R.stub, H.flare[0]], [R.flare, H.flare[1]]]),
  lathe([[R.flare, H.flare[1] - 0.01], [R.flare, H.flare[1]], [R.reservoirBand, H.flare[2]], [R.reservoirBand, H.reservoirBand]]),
]);
const reservoir = prism(circle([0, 0], R.reservoir, N), H.reservoirBand - 0.01, H.cornice[0] + 0.01);
const cornice = lathe([[R.reservoir, H.cornice[0]], [R.cornice, H.cornice[1]], [R.cornice, H.cornice[2]]]);
const parapet = prism(circle([0, 0], R.parapet, N), H.cornice[2] - 0.01, H.parapet);
// Binnen de borstwering: een rond reservoirdak in het midden tot 28,45 m, met daaromheen een ring van 0,75 m breed tot 26,95 m.
const cavity = prism(circle([0, 0], R.parapetInner, N), H.trough, H.parapet + 1)
  .subtract(prism(circle([0, 0], R.tankRoof, N), H.trough - 1, H.tankRoof));
// Dakluik aan de zuidrand van het reservoirdak (luchtfoto; AHN-DSM NAP +41,17), 1,0 × 1,0 m.
const hatch = prism([[-0.5, -1.95], [0.5, -1.95], [0.5, -0.95], [-0.5, -0.95]], H.tankRoof - 0.01, H.hatch);
// Kantelen: twaalf kantelen van 1,03 m met inkepingen van 0,95 m (foto: circa twaalf, inkepingen circa 0,55 m).
const crenels = Array.from({ length: MERLONS }, (_, k) => {
  const a = (360 / MERLONS) * (k + 0.5) + 15;
  const at = frame(a);
  return hull([0.475, -0.475].flatMap((s) => [2.5, 4.5].flatMap((o) => [at(o, s, H.crenel), at(o, s, H.parapet + 1)])));
});

// ---------- aanbouw (BAG-contour, 3,7 graden gedraaid; dak NAP +15,6) ----------
// Twee convexe delen: het brede deel in het zuiden en de hals naar de toren (de hals loopt tot in de onderbouw).
const ANNEX = [
  [[-5.43, -10.81], [3.68, -11.4], [4.05, -5.89], [-5.05, -5.23]],
  [[-3.27, -5.6], [2.34, -6.0], [2.62, -1.5], [-2.93, -1.2]],
];
const inset = (poly, d) => {
  const c = poly.reduce(([sx, sy], [x, y]) => [sx + x / poly.length, sy + y / poly.length], [0, 0]);
  // Rechthoekig genoeg om per hoek langs de bissectrice in te zetten.
  return poly.map((p, i) => {
    const prev = poly[(i + poly.length - 1) % poly.length], next = poly[(i + 1) % poly.length];
    const e1 = [p[0] - prev[0], p[1] - prev[1]], e2 = [next[0] - p[0], next[1] - p[1]];
    const n1 = [e1[1], -e1[0]].map((v) => v / Math.hypot(...e1)), n2 = [e2[1], -e2[0]].map((v) => v / Math.hypot(...e2));
    const b = [n1[0] + n2[0], n1[1] + n2[1]], dot = (b[0] * n1[0] + b[1] * n1[1]);
    const inward = Math.sign((c[0] - p[0]) * b[0] + (c[1] - p[1]) * b[1]) || 1;
    return [p[0] + (inward * d * b[0]) / dot, p[1] + (inward * d * b[1]) / dot];
  });
};
const annex = union(ANNEX.flatMap((poly) => [
  prism(inset(poly, 0.3), BASE, H.annexWall + 0.01),
  // Dakrand: 0,3 m overstek met een onderkant van 45 graden, daarboven het platte dak.
  hull([...ring(inset(poly, 0.3), H.annexWall), ...ring(poly, H.annexEave), ...ring(poly, H.annexRoof)]),
]));

// ---------- openingen ----------
const openings = union([
  // Rondboogvensters in de onderbouw (westnoordwest en noordoost; het zuiden zit achter de aanbouw).
  ...[165, 75].map((a) => niche(a, R.base, 0.9, 1.45, 2.75, 0.35, 0.5)),
  // Schacht: vier rijen vensters per kolom, het onderste rijtje klein (foto 4,7 tot 5,6, 8,7 tot 10,0, 12,2 tot 13,5,
  // 16,0 tot 17,2); 0,6 m breed in plaats van circa 0,5 m.
  ...COLUMNS.flatMap((a) => [[4.75, 5.55], [8.7, 10.0], [12.2, 13.5], [16.0, 17.2]].map(([z0, z1]) =>
    niche(a, shaftR(z1), 0.6, z0, z1, 0.3))),
  // Kleine vensters in het metselwerk onder de overgang (foto 18,8 tot 19,5), verschoven ten opzichte van de kolommen.
  ...[60, 150, 240, 330].map((a) => niche(a, R.stub, 0.6, 18.85, 19.4, 0.3)),
  // Smalle vensters in de ommanteling (foto 0,55 × 2,0 m, 22,9 tot 24,9).
  ...COLUMNS.map((a) => niche(a, R.reservoir, 0.6, 22.9, 24.9, 0.3)),
  ...crenels,
  // Venster met rondboog in de oostgevel van de hals van de aanbouw.
  // (gevel op 2,41 m van het hart onder -3,56 graden, venster 3,85 m zuidelijk van het hart).
  niche(-3.56, 2.41, 0.9, 0.9, 2.3, 0.3, 0.45, -3.85),
]);
const tower = union([base, lowerBand, shaft, thinBand, stub, flare, reservoir, cornice, parapet])
  .subtract(cavity)
  .add(hatch)
  .add(annex)
  .subtract(openings);

await writeLandmark({
  slug: "watertoren-goor",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-reservoirommanteling-kantelen-en-aanbouw", tower]],
  catalog: {
    name: "Watertoren Goor",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, 6], [-6, 0], [6, 0], [6, -9], [-7, -9]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1735100000057191"],
    description:
      "Oorsprong op het hart van het BAG-pand (cirkel van de reservoirommanteling, 7,46 m) op maaiveld NAP +12,1 m, +X naar het oosten, +Y naar het noorden. Ronde onderbouw (5,8 m) met twee rondboogvensters en een gepleisterde band tot 4,6 m, verjongende schacht (5,7 tot 4,9 m) met vier kolommen vensters, dunne band op 18,5 m, kort metselwerk met kleine vensters, holle overgang naar de ommanteling (7,46 m) vanaf 19,4 m, band onder de ommanteling, smalle vensters, kroonlijst op 27,1 tot 27,8 m, gekanteelde borstwering tot 28,72 m (NAP +40,82) met binnen een rond reservoirdak op 28,45 m en een dakluik tot 29,07 m; aan de zuidkant een platte aanbouw tot 3,5 m. Maten uit BAG, AHN, 3D BAG, luchtfoto en twee foto's.",
    realWorld: {
      built: 1915,
      wikipediaHeightM: 29,
      reservoirM3: 125,
      ahnGroundNapM: GROUND_NAP,
      ahnCrenelNapM: 40.82,
      bag3dMaxNapM: 40.71,
      ahnTankRoofNapM: 40.55,
      ahnHatchNapM: 41.17,
      ahnAnnexRoofNapM: 15.6,
      baseDiameterM: R.base * 2,
      shaftDiameterM: [R.shaftFoot * 2, R.shaftTop * 2],
      reservoirDiameterM: R.reservoir * 2,
      parapetM: H.parapet,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Goor) (1915, 29 m, 125 m³)",
      "https://commons.wikimedia.org/wiki/File:Goor_Watertoren_8803.JPG (2006, vanuit het westen: geledingen, banden, vensters, kantelen en aanbouw; schaal 70,2 px/m)",
      "https://commons.wikimedia.org/wiki/File:Goor-markeloseweg-208095.jpg (2020, vanuit het westnoordwesten: ommanteling met smalle vensters, schacht met vensterkolommen)",
      "PDOK BAG-pand 1735100000057191 (toren met aanbouw), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.1735100000057191: maaiveld 12,10 en h_dak_max 40,71, opgehaald 2026-11-06",
    ],
  },
});

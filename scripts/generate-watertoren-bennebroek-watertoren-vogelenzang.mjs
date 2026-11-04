// Watertoren Vogelenzang in Bennebroek, op het terrein van de voormalige psychiatrische inrichting Vogelenzang (nu
// GGZ inGeest), gebouwd in 1927 naar ontwerp van A.T. Kraan (sr) in een vorm van de Amsterdamse School; reservoir van
// 70 m³, gemeentelijk monument van Bloemendaal. Een vierkante bakstenen schacht met per gevel twee verdiepte
// vensterstroken, bovenaan betonnen consoles boven die stroken en uitgebouwde hoekconsoles onder een rondom
// overstekende betonnen dakplaat met hekwerk, en daarop een tentdak met een steile, geknikte voet en een lange lage
// dakkapel per zijde; bovenop een antennemast. De toren staat midden in het complex van de Centrale Keuken met de
// brandweergarage, dat in één BAG-pand ligt.
//
// De toren is geen eigen BAG-pand: hij hoort bij pand 0377100000002980, het hele complex (1500 m²: de keukenvleugels
// met rode pannendaken en de brandweergarage aan de voorkant, platte tussenleden en de hal ten oosten van de toren).
// Omdat de kaart en de export alleen hele panden kunnen verbergen, vervangt het model het hele pand en neemt de GLB
// de rest ervan over als tweede node: de dakvlakken van de 3D BAG (LoD2.2, CC BY 4.0, vogelenzangBag3d() onderaan)
// als prisma's onder hun eigen dakvlak, zonder de toren (zoals bij generate-watertoren-kweekschool-maastricht.mjs).
//
// Oorsprong op het hart van de schacht op NAP +1,95: het maaiveld van de 3D BAG voor dit pand en de vloer van de
// PDOK-reconstructie (ellipsoïdisch 45,07; het dak van PDOK ligt 43,12 m boven de NAP-hoogte van de 3D BAG). Het
// AHN-DTM loopt rond het complex van NAP +1,2 (oostkant) via +2,3 (voor de noordgevel van de toren) tot +3,9
// (voorplein); het model staat dus net als het PDOK-pand op de vloer van 1,95 en zakt aan de hogere kanten in het
// terrein. Het complex en de toren staan 7 graden linksom op RD (BAG-gevels 6,9 tot 7,7
// graden): lokale +X is de normaal van de oostgevel van de toren (xAxis [cos 7°, sin 7°]), +Y die van de noordgevel.
// Schacht 6,6 m (BAG: de vrije noordgevel van 6,61 m tussen de westgevel en de hal), centrum tussen de BAG-gevels en
// het midden van de dakplaat en de mast in het AHN-DSM. Hoogtes uit het AHN-DSM 0,5 m (boven maaiveld): dakplaat
// NAP +25,0, tentdak 45 graden in het DSM tot de top NAP +29,7 (mast tot +33,3), de knik in de dakvoet uit het DSM
// (+27,2 op 0,5 m binnen de gevel) en de foto's. Geledingen (consoles, hoekconsoles, dakplaat 1,24 keer de schacht,
// dakkapellen, vensterstroken) uit de frontale RCE-foto 20407250 en de schuine foto Watertoren-bennebroek.jpg,
// geschaald op de schacht van 6,6 m.
import { Manifold, CrossSection, ccw, hull, union, place, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [100474.5, 481774.45];
const DEG = 7;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
// De onderkant ligt 1 m onder de vloer, zodat het model ook boven de laagste PDOK-terreinpunten (44,4) niet zweeft.
const BASE = -1.0;
const GROUND_NAP = 1.95; // 3D BAG b3_h_maaiveld; vloer van het PDOK-pand
const ELLIPSOID_N = 43.12; // PDOK-ellipsoïdische hoogte min NAP (dak 73,23 tegen 3D BAG 30,11; vloer 45,07 tegen 1,95)

const S = 3.3; // halve schacht (BAG 6,61 m)
const P = {
  slab: 4.15, // halve dakplaat (foto: 1,24 keer de schacht; AHN-DSM 8,3 tot 8,4 m)
  bracketIn: 0.45, // hoekconsole loopt 0,45 m langs de gevel vanaf de hoek
  console: 0.35, // consoles 0,35 m uit de gevel
  consoleHalf: 0.85, // consoles 1,7 m breed boven elke vensterstrook
  band: 1.3, // hart van de vensterstroken uit het hart van de gevel
  bandHalf: 0.5, // vensterstrook 1,0 m breed
  bandDepth: 0.3,
  kink: 2.55, // halve breedte van het tentdak op de knik (0,75 m binnen de gevel)
  dormerHalf: 1.4, // dakkapel 2,8 m breed
  dormerBack: 1.5,
};
const H = {
  band: 8.0, // vensterstroken vanaf boven de daken van het complex (hal tot 7,6 m)
  bracketFoot: 20.45, // onderkant van de hoekconsoles (2,25 m onder de dakplaat)
  consoleFoot: 21.05, // onderkant van de consoles (1,65 m onder de dakplaat)
  slabBottom: 22.7, // dakplaat 0,35 m dik
  slabTop: 23.05, // AHN NAP +25,0
  kink: 25.05, // knik in het tentdak (NAP +27,0)
  dormerTop: 25.95, // dakkapel 0,9 m hoog op de knik
  apex: 27.75, // top van het tentdak (AHN NAP +29,7)
};
const sq = (h, z) => [[-h, -h, z], [h, -h, z], [h, h, z], [-h, h, z]];

// ---------- schacht, dakplaat en tentdak ----------
const shaft = box(-S, -S, BASE, S, S, H.slabBottom + 0.01);
// Dakplaat op een kraag van 45 graden: de plaat steekt 0,85 m uit en is in het echt aan de onderkant vlak, met
// consoles; de kraag maakt hem zonder steun printbaar.
const slab = hull([...sq(S - 0.01, H.slabBottom - (P.slab - S)), ...sq(P.slab, H.slabBottom), ...sq(P.slab, H.slabTop)]);
// Tentdak: steile voet (69 graden) tot de knik, dan 46,6 graden tot de top.
const roof = hull([...sq(S, H.slabTop - 0.01), ...sq(P.kink, H.kink), [0, 0, H.apex]]);

// ---------- gevel met normaal +X: consoles, dakkapel, vensterstroken ----------
const pts = (u0, u1, v0, v1, z) => [[u0, v0, z], [u1, v0, z], [u1, v1, z], [u0, v1, z]];
// Consoles boven de vensterstroken: onderkant onder 50 graden.
const consoleAt = (t) => hull([
  ...pts(S - 0.1, S, t - P.consoleHalf, t + P.consoleHalf, H.consoleFoot - 1.2 * P.console),
  ...pts(S - 0.1, S + P.console, t - P.consoleHalf, t + P.consoleHalf, H.consoleFoot),
  ...pts(S - 0.1, S + P.console, t - P.consoleHalf, t + P.consoleHalf, H.slabBottom + 0.01),
]);
// Dakkapel: voorgevel recht boven de knik, plat dak tot in het dakvlak.
const dormer = box(P.dormerBack, -P.dormerHalf, H.kink - 0.05, P.kink, P.dormerHalf, H.dormerTop);
const face = union([consoleAt(-P.band), consoleAt(P.band), dormer]);
// Hoekconsole op de hoek (+X, +Y): verloopt van de schacht op 20,45 m tot de rand van de dakplaat (21 graden uit het lood).
const bracket = hull([
  ...pts(S - P.bracketIn, S, S - P.bracketIn, S, H.bracketFoot),
  ...pts(S - P.bracketIn, P.slab, S - P.bracketIn, P.slab, H.slabBottom + 0.01),
]);
// Verdiepte vensterstrook als nis; plafond onder 56 graden naar binnen oplopend. Ze houdt 0,6 m onder de console op, zodat
// de console op het volle gevelvlak begint (anders vult de export onder de console op).
const niche = (f, t, wd, z0, z1, depth) => {
  const a = f - depth, b = f + 1.0, y0 = t - wd / 2, y1 = t + wd / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, z1 + 1.5 * depth], [a, y1, z1 + 1.5 * depth], [f, y0, z1], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
const bands = union([-P.band, P.band].map((t) => niche(S, t, 2 * P.bandHalf, H.band, H.consoleFoot - 1.2 * P.console - 0.6, P.bandDepth)));

const sides = [0, 90, 180, 270];
const tower = union([shaft, slab, roof, ...sides.map((deg) => place(face, { deg })), ...sides.map((deg) => place(bracket, { deg }))])
  .subtract(union(sides.map((deg) => place(bands, { deg }))));

// ---------- rest van het complex (3D BAG) ----------
// Elk dakvlak als prisma vanaf de onderkant, afgesneden door het vlak z = a x + b y + c (kleinste kwadraten door de
// hoekpunten), 2 cm verbreed zodat aangrenzende vlakken één solid vormen. De vlakken van de toren (toren = 1) liggen
// als vlak op het platte dak rondom de toren (NAP +7,12, 5,17 m), zodat dat dak doorloopt tot de schacht; de schacht
// zelf is eruit gesneden.
const FLAT_ROOF = 5.17;
const xyz = (flat) => Array.from({ length: flat.length / 3 }, (_, i) => flat.slice(i * 3, i * 3 + 3));
const fitPlane = (p) => {
  const n = p.length;
  const [mx, my, mz] = [0, 1, 2].map((k) => p.reduce((s, q) => s + q[k], 0) / n);
  let sxx = 0, sxy = 0, syy = 0, sxz = 0, syz = 0;
  for (const [x, y, z] of p) {
    const [u, v, w] = [x - mx, y - my, z - mz];
    sxx += u * u; sxy += u * v; syy += v * v; sxz += u * w; syz += v * w;
  }
  const det = sxx * syy - sxy * sxy;
  const a = Math.abs(det) < 1e-9 ? 0 : (sxz * syy - syz * sxy) / det;
  const b = Math.abs(det) < 1e-9 ? 0 : (syz * sxx - sxz * sxy) / det;
  return [a, b, mz - a * mx - b * my];
};
const roofPrism = (p, [a, b, c]) => {
  const outline = ccw(p.map(([x, y]) => [x, y]));
  const top = Math.max(...p.map(([x, y]) => a * x + b * y + c)) + 1;
  const len = Math.hypot(a, b, 1);
  return Manifold.extrude(new CrossSection([outline]).offset(0.02, "Miter"), top - BASE)
    .translate([0, 0, BASE])
    .trimByPlane([a / len, b / len, -1 / len], -c / len);
};
const complex = union(vogelenzangBag3d().map(([isTower, flat]) => roofPrism(xyz(flat), isTower ? [0, 0, FLAT_ROOF] : fitPlane(xyz(flat)))))
  .subtract(box(-S, -S, BASE - 1, S, S, 40));

await writeLandmark({
  slug: "watertoren-bennebroek-watertoren-vogelenzang",
  base: BASE,
  // De toren als één node; het complex van de Centrale Keuken is een eigen bouwdeel op het maaiveld.
  nodes: [
    ["building:schacht-consoles-dakplaat-en-tentdak", tower],
    ["building:centrale-keuken", complex],
  ],
  catalog: {
    name: "Watertoren Vogelenzang",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: 0,
    // In de inham aan de oostkant, waar het PDOK-terrein op de hoogte van de PDOK-vloer ligt (45,10 tot 45,21); voor de
    // noordgevel van de toren ligt een PDOK-pad op 46,9, 1,5 m boven het AHN, en dat zou het hele complex optillen.
    groundSamplePoints: [[27, -2], [27, 2], [22, -4], [26, -6]],
    // Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04.
    groundHeight: 45.1,
    replacesBuildings: ["NL.IMBAG.Pand.0377100000002980"],
    description:
      "Oorsprong op het hart van de schacht op de vloer van het pand (NAP +1,95 m), +X de normaal van de oostgevel (RD 7 graden). Vierkante schacht van 6,6 m met twee verdiepte vensterstroken per gevel, consoles en uitgebouwde hoekconsoles onder een dakplaat van 8,3 m op een kraag van 45 graden (bovenkant 23,05 m), en een tentdak met steile voet tot de knik op 25,05 m, een dakkapel per zijde en de top op 27,75 m. De toren hoort bij BAG-pand 0377100000002980; het model vervangt dat hele pand en neemt de rest van het complex over uit de 3D BAG (LoD2.2-dakvlakken). Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1927,
      architect: "A.T. Kraan (sr)",
      reservoirM3: 70,
      ahnGroundNapM: GROUND_NAP,
      ahnSlabNapM: 25.0,
      ahnTopNapM: 29.7,
      ahnMastNapM: 33.3,
      pdokEllipsoidMinusNapM: ELLIPSOID_N,
      shaftM: 2 * S,
      slabM: 2 * P.slab,
      slabTopM: H.slabTop,
      kinkM: H.kink,
      apexM: H.apex,
      flatRoofM: FLAT_ROOF,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_Vogelenzang (1927, A.T. Kraan sr, 70 m³, gemeentelijk monument)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_en_brandweergarage_-_Bennebroek_-_20407250_-_RCE.jpg (frontaal op de zuidgevel: consoles, hoekconsoles, dakplaat, tentdak met knik en dakkapel)",
      "https://commons.wikimedia.org/wiki/File:Watertoren-bennebroek.jpg (schuin op de noord- en westgevel: vensterstroken, consoles, dakkapel)",
      "PDOK BAG-pand 0377100000002980, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-04",
      "3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0377100000002980, LoD2.2-dakvlakken, opgehaald 2026-11-04",
    ],
  },
});

// ---------- data: dakvlakken van het complex ----------
// Dakvlakken (RoofSurface, LoD2.2) van 3D BAG-pand NL.IMBAG.Pand.0377100000002980 in het modelstelsel: x langs
// RD-richting 7 graden, y haaks daarop (linksom), beide in meters vanaf ORIGIN, z in meters boven NAP +1,95, afgerond
// op 1 cm. Per vlak [toren, buitenrand] (het enige gat, in het platte dak, valt onder een hoger vlak); toren = 1 voor
// de vlakken van de watertoren zelf.
// Bron: https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0377100000002980, opgehaald 2026-11-04.
// Licentie: CC BY 4.0, 3D BAG door de 3D geoinformation-groep van de TU Delft en 3DGI.
function vogelenzangBag3d() {
  return [
    [0, [10.95, -30, 9.75, 9.79, -30.98, 8.81, 9.79, -31.4, 8.4, 9.78, -31.85, 7.98, 16.54, -31.9, 8.02, 16.54, -31.42, 8.47, 16.07, -31.42, 8.47, 12.87, -28.05, 11.63]],
    [0, [16.54, -31.42, 8, 16.59, -22.16, 8.02, 15.05, -20.96, 9.54, 12.94, -19.31, 11.62, 12.87, -28.05, 11.63, 16.07, -31.42, 8.47]],
    [0, [-17.26, -16.25, 4.11, -17.33, -12.7, 4.08, -19.86, -13.39, 4.13, -19.93, -13.41, 4.13, -19.97, -16.21, 4.16]],
    [0, [-7.43, -9.61, 6.12, -0.96, -9.88, 6.16, -2.04, -7.47, 5.65, -7.47, -7.65, 5.71]],
    [0, [-7.68, -16.71, 10.61, 8.2, -16.85, 10.59, 7.62, -15.93, 9.68, 5.81, -13.06, 6.8, 6.43, -11.81, 5.53, 6.09, -11.46, 5.18, 4.07, -11.43, 5.18, -5.23, -11.33, 5.16, -7.15, -15.54, 9.43]],
    [0, [16.79, -11.58, 8.12, 6.61, -11.46, 8.12, 6.43, -11.81, 8.46, 10.6, -16.03, 12.59, 12.4, -15.69, 12.23, 13.78, -15.64, 12.17, 17.1, -12.32, 8.85, 17.09, -11.81, 8.36, 16.79, -11.78, 8.32]],
    [0, [9.79, -30.98, 8.4, 9.98, -21.74, 8.39, 9.43, -21.73, 7.36, 8.19, -21.95, 5.05, 7.98, -31.43, 5.01, 8.63, -31.43, 6.24, 8.68, -31.84, 6.35, 9.78, -31.85, 8.4, 9.79, -31.4, 8.4]],
    [0, [9.98, -21.74, 8.72, 9.79, -30.98, 8.62, 10.95, -30, 9.75, 12.87, -28.05, 11.63, 12.94, -19.31, 11.62, 12.64, -19.07, 11.32]],
    [0, [6.11, -22.32, 5.04, 5.93, -22.35, 5.04, 5.81, -22.48, 5.04, -5.62, -22.4, 5.04, -6.25, -21.75, 5.04, -7.7, -22.35, 5.04, -8.44, -21.93, 5.04, -8.44, -22.37, 5.04, -8.44, -31.28, 5.01, -3.86, -31.41, 5.01, -3.77, -24.97, 5.03, 4.09, -24.93, 5.03, 4, -31.46, 5.01, 7.98, -31.43, 5.01, 8.19, -21.95, 5.05]],
    [0, [-8.44, -31.28, 6.34, -8.44, -22.37, 6.26, -9.69, -22.36, 7.92, -11.13, -20.39, 9.8, -12.74, -19.47, 11.94, -12.73, -27.37, 12, -9.66, -31.75, 7.97, -9.24, -31.75, 7.41, -9.18, -31.26, 7.33]],
    [0, [-11.17, -16.58, 13.31, -10.18, -15.6, 12.36, -5.81, -11.32, 8.17, -17.36, -11.19, 8.03, -17.35, -11.59, 8.42, -12.58, -16.39, 13.13, -11.93, -15.48, 12.23]],
    [0, [-10.18, -15.6, 12.36, -9.59, -16.07, 11.79, -10.52, -17.41, 12.67, -10.23, -17.7, 12.39, -10.16, -17.77, 12.32, -6.38, -21.5, 8.63, -6.18, -18.9, 8.46, -7.12, -17.96, 9.38, -7.76, -16.9, 10.01, -7.68, -16.71, 9.93, -7.15, -15.54, 9.43, -5.23, -11.33, 7.61, -5.81, -11.32, 8.17]],
    [0, [-13.16, -17.61, 12.56, -13.3, -17.41, 12.42, -12.73, -16.61, 12.98, -12.58, -16.39, 13.13, -17.35, -11.59, 8.42, -17.33, -12.7, 8.45, -17.26, -16.25, 8.52, -17.15, -16.26, 8.63, -17.23, -21.27, 8.56, -17.16, -21.24, 8.63, -17.16, -21.4, 8.63, -16.9, -21.37, 8.88]],
    [0, [7.99, 13.02, 5.86, 7.98, 12.36, 6.21, 11.84, 12.59, 6.06, 11.85, 12.87, 5.91, 11.95, 15.23, 4.64, 10.06, 15.15, 4.7, 6.91, 15.03, 4.79, 6.93, 13.83, 5.44, 7.18, 13.63, 5.54]],
    [1, [0.02, -0.36, 28.04, -1.28, -1.37, 27.08, -2.17, -2.94, 25.6, -2.01, -3.07, 25.49, -0.94, -3.87, 24.76, -0.92, -4.07, 24.57, 3.13, -4.12, 24.58, 3.13, -3.45, 25.2, 3.14, -3.24, 25.4, 3.14, -2.71, 25.89, 2.6, -2.68, 25.92, 0.29, -0.24, 28.16, 0.13, -0.24, 28.16]],
    [0, [11.46, 20.26, 6.24, 11.79, 20.18, 6.15, 10.11, 20.17, 6.62, 10.06, 15.15, 6.64, 11.95, 15.23, 6.11, 12.22, 15.24, 6.03, 13.5, 15.57, 5.68, 14.16, 20.25, 5.49]],
    [0, [-15.87, -21.97, 8.28, -14.07, -19.79, 10.38, -13.04, -19.3, 10.84, -12.74, -19.47, 10.68, -11.13, -20.39, 9.8, -9.69, -22.36, 7.92, -8.44, -22.37, 7.91, -8.44, -21.93, 8.34, -7.7, -22.35, 7.94, -6.25, -21.75, 8.51, -6.39, -21.62, 8.64, -6.38, -21.5, 8.75, -10.16, -17.77, 12.32, -10.23, -17.7, 12.39, -13.16, -17.61, 12.47, -16.9, -21.37, 8.85, -16.62, -21.35, 8.87, -16.69, -21.9, 8.34]],
    [0, [-14.07, -19.79, 10.38, -15.87, -21.97, 8.28, -16.69, -21.9, 7.31, -16.73, -22.17, 7.27, -17.14, -22.16, 6.78, -17.1, -24.28, 6.84, -16.69, -24.29, 7.33, -16.89, -31.72, 7.13, -16.24, -31.72, 7.89, -12.73, -27.37, 12, -12.74, -19.47, 11.94, -13.04, -19.3, 11.59]],
    [0, [-17.83, -7.34, 4.11, -17.01, -7.07, 4.13, -15.55, -3.51, 4.15, -19.5, -3.48, 4.07, -19.5, -7.1, 4.08]],
    [1, [3.6, -4.12, 22.99, 3.13, -3.45, 24.69, 3.13, -4.12, 22.99]],
    [0, [-16.24, -31.72, 7.89, -9.66, -31.75, 7.97, -12.73, -27.37, 12]],
    [1, [-3.22, -4.82, 21, -3.13, -5.01, 20.51, -2.31, -4.05, 22.99, -0.92, -4.07, 22.99, -0.94, -3.87, 23.49, -2.01, -3.07, 25.49, -2.17, -2.94, 25.8, -2.24, -3.06, 25.49, -3.77, -4.03, 22.98, -4.1, -4.23, 22.45, -3.77, -4.19, 22.57, -3.76, -5.72, 18.69]],
    [1, [-3.77, -4.03, 22.98, -2.24, -3.06, 25.49, -2.17, -2.94, 25.6, -1.28, -1.37, 27.09, -1.62, 1.37, 26.58, -1.68, 1.37, 26.47, -2.38, 2.44, 25.35, -2.5, 2.57, 25.16, -3.21, 2.88, 24.01, -3.22, 1.66, 23.97, -3.83, 1.67, 22.98]],
    [0, [12.96, -16.83, 14.62, 12.97, -16.45, 14.27, 13.78, -15.64, 13.5, 12.4, -15.69, 13.57, 10.6, -16.03, 13.92, 11.42, -16.87, 14.69, 11.46, -16.91, 14.73, 12.58, -16.93, 14.73, 12.68, -17.04, 14.82]],
    [0, [7.84, -7.8, 5.58, 7.84, -8.17, 5.49, 7.83, -9.37, 5.2, 14.12, -9.25, 5.12, 14.12, -9.03, 5.17, 14.12, -8.93, 5.2, 11.5, -5.02, 6.18]],
    [0, [11.5, -5.02, 7.54, 11.99, -4.65, 7.58, 11.17, -3.49, 7.5, 11.84, 12.59, 7.47, 7.98, 12.36, 7.15, 7.84, -7.8, 7.25]],
    [0, [-11.25, -16.66, 14.74, -11.3, -16.7, 14.7, -12.31, -16.71, 14.71, -12.73, -16.61, 14.81, -13.3, -17.41, 14.07, -13.16, -17.61, 13.89, -10.23, -17.7, 13.75, -10.52, -17.41, 14.03]],
    [1, [0.13, -0.24, 28.16, -1.37, 1.36, 26.48, -1.62, 1.37, 26.21, -1.28, -1.37, 26.64, 0.02, -0.36, 28.04]],
    [1, [3.19, 2.11, 25.32, 3.14, -2.71, 25.39, 3.14, -3.24, 25.4, 3.13, -3.45, 25.4, 3.6, -4.12, 24.11, 4, -4.7, 22.99, 4, -4.13, 22.99, 5.61, -4.15, 18.54, 4, -3.52, 22.99, 4.04, 2.77, 22.98]],
    [1, [3.19, 2.11, 25.32, 2.76, 1.77, 25.74, 2.57, 1.93, 25.93, 0.29, -0.24, 28.16, 2.6, -2.68, 25.92, 3.14, -2.71, 25.39]],
    [0, [10.55, -17.74, 13.93, 12.95, -18.56, 13.21, 12.96, -17.83, 13.9, 12.96, -17.33, 14.36, 12.68, -17.04, 14.63, 12.58, -16.93, 14.73, 11.46, -16.91, 14.73, 11.42, -16.87, 14.76]],
    [0, [-11.25, -16.66, 14.71, -10.52, -17.41, 14.02, -9.59, -16.07, 13.23, -10.18, -15.6, 13.77, -11.17, -16.58, 14.64]],
    [0, [-11.3, -16.7, 14.7, -11.25, -16.66, 14.66, -11.17, -16.58, 14.59, -11.93, -15.48, 13.6, -12.58, -16.39, 14.42, -12.73, -16.61, 14.61, -12.31, -16.71, 14.71]],
    [0, [7.83, -9.37, 3.7, 4.06, -9.44, 3.64, 4.07, -11.43, 2.53, 6.09, -11.46, 2.53, 6.43, -11.81, 2.33, 6.61, -11.46, 2.53, 16.79, -11.58, 2.51, 16.79, -9.2, 3.84, 14.12, -9.25, 3.8]],
    [0, [6.57, -18.78, 8.68, 6.55, -18.96, 8.66, 6.4, -19.08, 8.51, 6.46, -19.62, 8.58, 6.2, -21.69, 8.35, 6.6, -21.69, 8.74, 10.55, -17.74, 12.56, 11.42, -16.87, 13.41, 10.6, -16.03, 12.59, 6.43, -11.81, 8.46, 5.81, -13.06, 7.86, 7.62, -15.93, 9.68, 8.2, -16.85, 10.25, 8.33, -17.05, 10.39]],
    [0, [4.06, -9.44, 5.18, 7.83, -9.37, 5.18, 7.84, -8.17, 5.19, 6.09, -8.37, 5.18, 6.14, -4.36, 5.19, 6.01, -4.31, 5.19, 5.61, -4.15, 5.19, 4, -4.13, 5.18, 4, -4.7, 5.18, 3.6, -4.12, 5.18, 3.13, -4.12, 5.18, -0.92, -4.07, 5.18, -2.31, -4.05, 5.17, -3.13, -5.01, 5.17, -3.22, -4.82, 5.17, -3.76, -5.72, 5.17, -3.77, -4.19, 5.17, -4.1, -4.23, 5.17, -3.77, -4.03, 5.17, -3.83, 1.67, 5.18, -11.55, 1.7, 5.16, -11.56, 1.45, 5.16, -11.78, 1.45, 5.16, -11.72, -3.54, 5.16, -15.55, -3.51, 5.15, -17.01, -7.07, 5.15, -17.83, -7.34, 5.14, -19.5, -7.1, 5.14, -19.49, -11.17, 5.14, -19.81, -11.17, 5.14, -19.86, -13.39, 5.14, -17.33, -12.7, 5.14, -17.35, -11.59, 5.14, -17.36, -11.19, 5.14, -5.81, -11.32, 5.16, -5.23, -11.33, 5.16, 4.07, -11.43, 5.18]],
    [0, [6.55, -18.96, 8.51, 6.57, -18.78, 8.68, 8.33, -17.05, 10.39, 8.2, -16.85, 10.59, -7.68, -16.71, 10.61, -7.76, -16.9, 10.41, -7.12, -17.96, 9.38, -6.18, -18.9, 8.46, -6.38, -21.5, 5.91, -6.39, -21.62, 5.8, -6.25, -21.75, 5.67, -5.62, -22.4, 5.04, 5.81, -22.48, 5.04, 5.93, -22.35, 5.17, 6.11, -22.32, 5.2, 6.14, -22.15, 5.37, 6.6, -21.69, 5.82, 6.2, -21.69, 5.83, 6.46, -19.62, 7.86, 6.4, -19.08, 8.39]],
    [0, [16.8, 3.03, 4.16, 25.47, 3.04, 4.1, 25.47, 3.18, 4.1, 25.76, 3.18, 4.1, 25.85, 18.25, 4.1, 25.71, 18.25, 4.1, 25.71, 18.54, 4.1, 16.98, 18.53, 4.16]],
    [0, [10.11, 20.26, 6.62, 5.88, 20.27, 5.21, 5.75, 14.98, 5.21, 6.91, 15.03, 5.59, 10.06, 15.15, 6.64, 10.11, 20.17, 6.62]],
    [0, [16.89, 20.25, 4.54, 14.16, 20.25, 5.3, 13.5, 15.57, 5.47, 12.22, 15.24, 5.82, 11.95, 15.23, 5.9, 11.85, 12.87, 5.91, 11.84, 12.59, 5.91, 11.17, -3.49, 6.02, 11.99, -4.65, 5.79, 11.5, -5.02, 5.92, 14.12, -8.93, 5.17, 14.12, -9.03, 5.17, 14.12, -9.25, 5.17, 16.79, -9.2, 4.43, 16.8, 3.03, 4.49, 16.98, 18.53, 4.51, 16.97, 18.84, 4.51]],
    [0, [12.96, -17.83, 12.99, 13.9, -18.32, 12.05, 17.1, -21.69, 8.86, 17.28, -21.71, 8.68, 17.29, -12.13, 8.67, 17.1, -12.32, 8.85, 13.78, -15.64, 12.17, 12.97, -16.45, 12.98, 12.96, -16.83, 12.98, 12.68, -17.04, 13.27, 12.96, -17.33, 12.99]],
    [0, [16.59, -21.63, 8.92, 17.1, -21.69, 8.86, 13.9, -18.32, 12.05, 12.96, -17.83, 12.51, 12.95, -18.56, 11.81, 10.55, -17.74, 12.56, 6.6, -21.69, 8.74, 6.14, -22.15, 8.29, 6.11, -22.32, 8.13, 8.19, -21.95, 8.51, 9.43, -21.73, 8.74, 9.98, -21.74, 8.74, 12.64, -19.07, 11.32, 12.94, -19.31, 11.09, 15.05, -20.96, 9.54, 16.59, -22.16, 8.4]],
    [1, [3.21, 3.44, 22.98, 1.5, 3.47, 22.98, 0.63, 3.47, 23.01, 1.97, 2.4, 25.43, 2.57, 1.93, 26.5, 2.76, 1.77, 26.85, 3.19, 2.11, 26.06, 4.04, 2.77, 24.51, 4.87, 3.41, 22.98, 3.45, 3.46, 22.92]],
    [0, [3.6, 20.27, 4.47, 3.45, 3.46, 4.43, 4.87, 3.41, 4.85, 4.04, 2.77, 4.6, 4, -3.52, 4.59, 5.61, -4.15, 5.07, 6.01, -4.31, 5.19, 6.14, -4.36, 5.23, 6.09, -8.37, 5.21, 7.84, -8.17, 5.73, 7.84, -7.8, 5.73, 7.98, 12.36, 5.77, 7.99, 13.02, 5.78, 7.18, 13.63, 5.54, 6.93, 13.83, 5.46, 6.91, 15.03, 5.46, 5.75, 14.98, 5.11, 5.88, 20.27, 5.15]],
    [1, [0.63, 3.47, 24.31, -3.2, 3.47, 24.27, -3.21, 2.88, 24.89, -2.5, 2.57, 25.22, -2.38, 2.44, 25.35, -1.68, 1.37, 26.47, -1.62, 1.37, 26.47, -1.37, 1.36, 26.48, 0.13, -0.24, 28.16, 0.29, -0.24, 28.16, 2.57, 1.93, 25.93, 1.97, 2.4, 25.43]],
  ];
}

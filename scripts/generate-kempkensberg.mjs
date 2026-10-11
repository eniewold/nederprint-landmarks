// Rijkskantoor Kempkensberg (Groningen; UNStudio, opgeleverd 2011): kantoor
// van DUO en de Belastingdienst. Twee in elkaar overlopende lobben met een
// eivormige plattegrond: een hoge lob van 24 lagen boven de plint (dak NAP
// +91,3) en een lage lob van 11 lagen (dak +48,3), met per verdieping een
// doorlopende witte band die 0,4 m voor het glas uitsteekt. De koppen van
// beide lobben wijken in de bovenste lagen terug, waardoor de toren van opzij
// naar boven toe smaller wordt. Onder de hoge lob staat aan de zuidwestzijde
// een sikkelvormige uitbouw van 7 lagen (+34,3), naast de lage lob een vleugel
// van 2 lagen (+17,9), en rondom een plint van één laag (+10,45) met een
// glazen dak bij de zuidkop. Vlakken en benoemde bouwdelen, geen gestapelde
// DSM-lagen: elke verdieping is één vloerplaat met band, de plattegronden zijn
// gladde krommen (Fourierreeks) gefit op de AHN-dakranden. Voorbeeld per rij:
// generate-evoluon.mjs (aanpak primitieven), generate-haagse-toren.mjs en
// generate-cooltoren.mjs (skylinetorens op efteling-kit.mjs).
//
//   node scripts/generate-kempkensberg.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het hart van de hoge lob op RD (234655,0,
// 580548,0), z = 0 op NAP +6,2 m (maaiveld rondom, AHN-DTM +6,1 tot +6,4; aan
// de noordkop +5,1), Z omhoog. +X loopt op 124 graden in RD langs de lange as
// van beide lobben, van de hoge lob naar de lage lob (noordwest); +Y wijst
// naar het zuidwesten (bos aan de westkant), -Y naar de tuin op de
// parkeergarage (noordoost).
//
// Bronnen: BAG-pand 0014100022187068 (toren, lage lob en plint; de
// ondergrondse parkeergarage 0014100022187265 heeft geen 3D-reconstructie),
// AHN DSM/DTM 0,5 m (PDOK WCS, per 0,5 m in dit stelsel uitgelezen:
// dakranden, kopeinden, uitbouw, vleugel en installaties), 3D BAG LoD2.2
// (TU Delft/3D geoinformatie, CC BY 4.0: dakhoogtes 10,4/17,9/34,3/48,3/91,3,
// installaties tot 98,8 en de terugwijkende koppen), Actueel_orthoHR (glazen
// dak bij de zuidkop, dakopbouwen), Wikipedia (92 m, maart 2011) en
// Commons-foto's van alle kanten (verdiepingsbanden, glazen tussenlaag,
// uitbouw en plint).
import { Manifold, CrossSection, box, prism, ccw, union, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "kempkensberg";
const ORIGIN = [234655.0, 580548.0];
const AXIS_DEG = 124.0;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 6.2;
const BASE = -1.5;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  plinth: 10.45, // plintdak (AHN 10,3-10,5; 3D BAG 10,33-10,41)
  floor0: 10.35, // eerste verdiepingsvloer van de lobben, op het plintdak
  wing: 17.9, // vleugel van 2 lagen naast de lage lob (AHN 17,9-18,0)
  skirt: 34.3, // sikkelvormige uitbouw van 7 lagen (3D BAG 34,32)
  north: 48.26, // dak van de lage lob (3D BAG 48,26)
  tall: 91.27, // dak van de hoge lob (3D BAG 91,27; Wikipedia 92 m)
  installA: 94.5, // dakopbouw zuidoostelijk deel (AHN 94,2-94,7)
  installB: 98.8, // dakopbouw noordwestelijk deel (AHN 97,5-98,9)
  installB2: 95.6, // trede aan de noordwestzijde daarvan (AHN 94-96)
  rail: 93.2, // rand van de gevelonderhoudsrail rond de opbouw
};
// Verdiepingen: 24 lagen boven het plintdak tot het dak (foto's: 7 lagen in
// de uitbouw, daarboven 17; de lage lob 11 lagen). Steek (91,27 - 10,35)/24.
// Met deze steek vallen de daken van uitbouw (+33,95 + rand) en lage lob
// (+47,44 + rand) en de vleugel (+17,09 + rand) op het raster.
const FLOORS = 24;
const P = (H.tall - H.floor0) / FLOORS;
const f = (k) => H.floor0 + k * P;
const NORTH_FLOORS = 11;
const SKIRT_FLOORS = 7;
const WING_FLOORS = 2;
// De 11e laag is in beide lobben een doorlopende glazen laag met verticale
// lamellen (de "taille" van de hoge lob loopt over in de bovenste laag van de
// lage lob; foto's). Daar is de band smaller en ligt het glas dieper.
const GLASS_FLOOR = 11;
const BAND = 1.25; // witte band per verdieping (foto's: circa 37 % van de steek)
const DEPTH = 0.4; // glas achter de banden
const GLASS_BAND = 0.9;
const GLASS_DEPTH = 0.6;
const FILLET = 3.0; // afronding van de holle hoek tussen de lobben (foto's: S-bocht)

// ---------- plattegronden van de lobben ----------
// Dakrand als radiale Fourierreeks r(t) = a0 + som(a_m cos mt + b_m sin mt)
// rond het middelpunt c, gefit op de AHN-dakrand (hoge lob: DSM > 88 m,
// rms 0,27 m; lage lob: DSM 46,5-53 m, rms 0,23 m; de hoek tegen de hoge lob
// is daar aangevuld met een rechte zijde en een boog van 5 m).
// Onder het dak steken de kopeinden verder uit: de punten voorbij ucPlus en
// ucMinus schuiven naar buiten tot ePlus/eMinus op de punt, met (afstand)^1,5
// zodat de zijgevels zonder knik in de kop overgaan. Die
// uitbreiding neemt boven z0 af tot nul op het dak met macht p (AHN-randen en
// 3D BAG-vlakken op de koppen: hoge lob +32,3 op 71,7 m, +31 op 81, +28,2 op
// 88; lage lob 79,5 op 22,9 m, 77,4 op 34,4, 74,7 op 44,4, 73,4 op het dak).
const TALL = {
  c: [-1.25, -0.25],
  coef: [17.399, 0.878, 0.374, 7.657, 0.027, 0.233, 0.002, 1.885, -0.156, -0.233, -0.153, 0.29, -0.076, -0.389, -0.062, -0.191, 0.033, -0.288, 0.018, -0.191, 0.121],
  ucPlus: 8,
  ucMinus: -10,
  ePlus: 5.25, // noordwestkop tot +31,5 (AHN onder 72 m)
  eMinus: 4.65, // zuidoostkop tot -32,5
  z0: 60,
  p: 1.7,
  top: H.tall,
};
const NORTH = {
  c: [46.75, -21.25],
  coef: [16.703, -0.13, -0.177, 6.801, -0.542, 0.483, -0.005, 1.275, -0.424, 0.821, 0.097, 0.025, -0.185, 0.548, 0.074, -0.115, 0.114, 0.331, -0.021, -0.068, 0.059],
  ucPlus: 58,
  ucMinus: 36,
  ePlus: 6.15, // noordkop tot 79,6
  eMinus: 5.2, // kop tegen de hoge lob tot 18,5
  z0: 18,
  p: 1.3,
  top: H.north,
};
// Sikkelvormige uitbouw aan de zuidwestzijde van de hoge lob (AHN +34,3 bij
// v 14-19,5 van u -27 tot +3): superellips (n = 3) rond v = 8, waarvan de
// zuidoostpunt per laag 0,45 m terugwijkt (3D BAG: -31,7 op 24 m, -28,3 op 31).
const SKIRT = { v: 8, b: 11.5, uPlus: 5, uMinus: -33, step: 0.45 };
// Vleugel van 2 lagen tussen de lage lob en de plintrand (AHN +17,9).
const WING = [[29, 6], [40, 1.2], [50, -2.4], [60, -6], [70, -9.4], [76, -11.8], [80, -16], [79, -26], [40, -26], [29, -14]];
// Plint: BAG-contour 0014100022187068 in het gebouwstelsel (Douglas-Peucker
// 0,15 m). Hij omvat de lobben, de wigvormige plint ten westen van de lage
// lob, de strook langs de tuinzijde en de zuidkop.
const PLINTH = [
  [78.9, -10.16], [78.59, -8.64], [77.84, -7.3], [76.75, -6.27], [75.41, -5.6], [-49.0, 27.89], [-50.23, 28.06], [-51.46, 27.93],
  [-52.62, 27.51], [-53.64, 26.79], [-55.0, 24.78], [-55.31, 22.35], [-46.03, -0.92], [-45.27, -1.78], [-43.26, -2.88], [-3.77, -13.37],
  [1.09, -13.81], [12.49, -13.43], [13.75, -13.21], [14.94, -12.67], [15.93, -11.86], [17.0, -13.45], [17.57, -15.89], [19.34, -26.7],
  [20.27, -28.42], [21.65, -29.7], [24.76, -30.82], [31.64, -32.25], [37.5, -32.58], [43.78, -32.35], [46.11, -32.78], [48.23, -33.89],
  [54.81, -38.94], [58.45, -39.95], [80.08, -39.18],
];
// Glazen dak op de plint rond de zuidkop (ortho: staal-glasraster; AHN geen
// waarde): een veld van 0,35 m diep in het plintdak.
const GLASS_ROOF = [[-41, 6], [-38, 0], [-33, -2.5], [-28, 4], [-24, 11], [-19, 14.5], [-13, 18], [-16, 22], [-26, 21], [-36, 15.5]];
// Dakopbouwen (AHN-raster, gebouwstelsel).
const INSTALL_TALL = [
  { u: [-16, 1], v: [-5, 2.5], top: H.installA },
  { u: [1, 11], v: [-8.5, 5.5], top: H.installB },
  { u: [11, 15], v: [-7, 4.5], top: H.installB2 },
];
const INSTALL_NORTH = [
  { u: [36, 43], v: [-25, -15], top: 50.6 },
  { u: [47, 50.5], v: [-25.5, -18], top: 50.2 },
  { u: [53, 63], v: [-25.5, -18], top: 49.6 },
  { u: [64, 67.5], v: [-24.5, -21], top: 50.2 },
];

// ---------- hulpfuncties ----------
const fourier = (L, n = 180) =>
  Array.from({ length: n }, (_, k) => {
    const t = (2 * Math.PI * k) / n;
    let r = L.coef[0];
    for (let m = 1; 2 * m < L.coef.length; m++) r += L.coef[2 * m - 1] * Math.cos(m * t) + L.coef[2 * m] * Math.sin(m * t);
    return [L.c[0] + r * Math.cos(t), L.c[1] + r * Math.sin(t)];
  });
// Plattegrond van een lob op hoogte `nap` (NAP).
const lobeAt = (L, nap) => {
  const roof = fourier(L);
  const tipP = Math.max(...roof.map((p) => p[0]));
  const tipM = Math.min(...roof.map((p) => p[0]));
  const t = Math.min(1, Math.max(0, (nap - L.z0) / (L.top - L.z0)));
  const k = 1 - t ** L.p;
  const pts = roof.map(([u, v]) => {
    if (u > L.ucPlus) return [u + k * L.ePlus * ((u - L.ucPlus) / (tipP - L.ucPlus)) ** 1.5, v];
    if (u < L.ucMinus) return [u - k * L.eMinus * ((L.ucMinus - u) / (L.ucMinus - tipM)) ** 1.5, v];
    return [u, v];
  });
  // De lobben zijn bol: het convexe omhulsel haalt de rimpels van de hogere
  // harmonischen (enkele centimeters) uit de lange zijgevels.
  return convexHull(pts);
};
// Convex omhulsel (monotone ketting), tegen de klok in.
function convexHull(points) {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper = [];
  for (const q of p.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}
const skirtAt = (k, n = 96) => {
  const uM = SKIRT.uMinus + SKIRT.step * (k - 1);
  const cu = (uM + SKIRT.uPlus) / 2;
  const a = (SKIRT.uPlus - uM) / 2;
  const s = (x) => Math.sign(x) * Math.abs(x) ** (2 / 3);
  return Array.from({ length: n }, (_, i) => {
    const t = (2 * Math.PI * i) / n;
    return [cu + a * s(Math.cos(t)), SKIRT.v + SKIRT.b * s(Math.sin(t))];
  });
};
const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCS = (section, n0, n1) => Manifold.extrude(section, z(n1) - z(n0)).translate([0, 0, z(n0)]);
// Plattegrond van verdieping k (1..24): unie van de actieve bouwdelen op de
// hoogte van de band, met afgeronde holle hoeken (sluiting met FILLET).
const floorOutline = (k) => {
  const nap = f(k);
  const parts = [cs(lobeAt(TALL, nap))];
  if (k <= NORTH_FLOORS) parts.push(cs(lobeAt(NORTH, nap)));
  if (k <= SKIRT_FLOORS) parts.push(cs(skirtAt(k)));
  if (k <= WING_FLOORS) parts.push(cs(WING));
  return CrossSection.union(parts).offset(FILLET, "Round", 2, 32).offset(-FILLET, "Round", 2, 32).simplify(0.02);
};

const parts = [];

// ---------- plint ----------
// Eén laag tot +10,45 over de hele BAG-contour; rondom een glasstrook van
// 0,4 m diep onder de witte dakrand van 0,9 m, en het glazen dakveld.
{
  let plinth = prism(PLINTH, BASE, z(H.plinth));
  const outer = cs(PLINTH);
  const glassRing = prismCS(outer.offset(2, "Miter", 4), GROUND_NAP + 0.2, H.plinth - 0.9).subtract(prismCS(outer.offset(-DEPTH, "Miter", 4), GROUND_NAP, H.plinth));
  // Het glasveld loopt niet onder de lobben en de uitbouw door.
  const field = cs(GLASS_ROOF).intersect(outer.offset(-1.2, "Miter", 4)).subtract(floorOutline(1).offset(0.5, "Round", 2, 32));
  const roofField = prismCS(field, H.plinth - 0.35, H.plinth + 1);
  plinth = plinth.subtract(union([glassRing, roofField]));
  parts.push(plinth);
}

// ---------- lobben, uitbouw en vleugel: verdiepingen met banden ----------
const outlines = [];
for (let k = 1; k <= FLOORS; k++) {
  const o = floorOutline(k);
  outlines.push(o);
  const glassFloor = k === GLASS_FLOOR;
  const band = glassFloor ? GLASS_BAND : BAND;
  const depth = glassFloor ? GLASS_DEPTH : DEPTH;
  // Glas van de verdieping (achter de band) en de band erboven.
  parts.push(prismCS(o.offset(-depth, "Round", 2, 32), f(k - 1) - 0.01, f(k) - band + 0.01));
  parts.push(prismCS(o, f(k) - band, f(k)));
}
// Daken met hun dakrand: de vleugel en de uitbouw op hun eigen hoogte boven
// de bovenste verdiepingsband, de lage lob tot +48,26.
parts.push(prismCS(cs(WING).intersect(outlines[WING_FLOORS - 1]), f(WING_FLOORS) - 0.01, H.wing));
parts.push(prismCS(cs(skirtAt(SKIRT_FLOORS)).intersect(outlines[SKIRT_FLOORS - 1]), f(SKIRT_FLOORS) - 0.01, H.skirt));
const northRoof = cs(lobeAt(NORTH, H.north));
parts.push(prismCS(northRoof, f(NORTH_FLOORS) - 0.01, H.north));

// ---------- dakopbouwen ----------
for (const { u, v, top } of INSTALL_TALL) parts.push(box(u[0], v[0], z(H.tall) - 0.01, u[1], v[1], z(top)));
for (const { u, v, top } of INSTALL_NORTH) parts.push(box(u[0], v[0], z(H.north) - 0.01, u[1], v[1], z(top)));
// Gevelonderhoudsrail met hekwerk rond de opbouw van de hoge lob (ortho:
// druppelvormige ring 4 m binnen de dakrand), als dichte rand van 0,9 m.
{
  const roofTall = cs(lobeAt(TALL, H.tall));
  const ring = roofTall.offset(-4.0, "Round", 2, 32).subtract(roofTall.offset(-4.9, "Round", 2, 32));
  parts.push(prismCS(ring, H.tall - 0.01, H.rail));
}

let model = union(parts);
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 30);
console.log("ondervlakken > 30 m2:", JSON.stringify(down));

const extent = (L, nap) => {
  const pts = lobeAt(L, nap);
  return [+Math.min(...pts.map((p) => p[0])).toFixed(2), +Math.max(...pts.map((p) => p[0])).toFixed(2)];
};

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Kempkensberg met hoge en lage lob verdiepingsbanden uitbouw vleugel en plint", model]],
  catalog: {
    name: "Rijkskantoor Kempkensberg",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Maaiveld aan de tuinzijde, de westzijde en bij de zuidkop (AHN-DTM
    // +6,1 tot +6,4); niet aan de noordkop, waar het naar +5,1 zakt.
    groundSamplePoints: [[-30, -20], [0, -20], [40, -42], [10, 20], [-20, 26], [-58, 10]],
    replacesBuildings: ["NL.IMBAG.Pand.0014100022187068"],
    description:
      "Oorsprong in het hart van de hoge lob op maaiveld NAP +6,2 m, +X op 124 graden in RD langs de lange as van de hoge naar de lage lob (noordwest), +Y naar het zuidwesten; twee eivormige lobben met 24 en 11 verdiepingsbanden (dak +91,27 en +48,26) waarvan de koppen naar boven terugwijken, een glazen tussenlaag op de 11e laag, een uitbouw van 7 lagen (+34,3), een vleugel van 2 lagen (+17,9) en een plint (+10,45) met glazen dakveld; plattegronden gefit op AHN-dakranden, banden en verdiepingsteek uit foto's.",
    realWorld: {
      groundNapM: GROUND_NAP,
      plinthNapM: H.plinth,
      wingNapM: H.wing,
      skirtNapM: H.skirt,
      northRoofNapM: H.north,
      tallRoofNapM: H.tall,
      installationsTopNapM: H.installB,
      storeyPitchM: +P.toFixed(3),
      floors: { tall: FLOORS, north: NORTH_FLOORS, skirt: SKIRT_FLOORS, wing: WING_FLOORS },
      tallLobeLengthM: { roof: extent(TALL, H.tall), below60m: extent(TALL, 50) },
      northLobeLengthM: { roof: extent(NORTH, H.north), atWing: extent(NORTH, 17) },
      axisDegrees: AXIS_DEG,
      estimates: [
        "verdiepingsteek 3,37 m uit de 24 lagen op foto's en de AHN-hoogtes van plint, uitbouw, lage lob en dak",
        "witte band van 1,25 m en glas 0,4 m terug, uit foto's; op de 11e laag (glazen tussenlaag met lamellen) een band van 0,9 m en glas 0,6 m terug",
        "terugwijken van de koppen per laag als gladde functie tussen de AHN/3D BAG-randen; de zijgevels loodrecht",
        "afronding van 3 m in de holle hoek tussen de lobben, uit foto's",
        "uitbouw als superellips, vleugel als veelhoek uit het AHN; plint volgens de BAG-contour",
        "glazen dak bij de zuidkop als veld van 0,35 m diep (AHN zonder waarde, vorm uit de ortho)",
        "gevelonderhoudsrail met hekwerk als dichte rand van 0,9 m, 1,9 m hoog",
      ],
    },
    sources: [
      "PDOK BAG pand 0014100022187068 (toren, lage lob en plint) en 0014100022187265 (ondergrondse parkeergarage, geen 3D-reconstructie), BGT, AHN DSM/DTM 0,5 m en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100022187068 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes en kopvlakken",
      "https://nl.wikipedia.org/wiki/Kempkensberg_(kantoorgebouw)",
      "https://commons.wikimedia.org/wiki/File:Groningen_Kempkensberg_04.jpg",
      "https://commons.wikimedia.org/wiki/File:Groningen_Kempkensberg_07.jpg",
      "https://commons.wikimedia.org/wiki/File:Groningen_Kempkensberg_10.jpg",
      "https://commons.wikimedia.org/wiki/File:Groningen_Kempkensberg_12.jpg",
      "https://commons.wikimedia.org/wiki/File:Groningen_Kempkensberg_03.jpg",
      "https://commons.wikimedia.org/wiki/File:20120315_Kantorencomplex_Kempkensberg_Groningen_NL.jpg",
      "https://commons.wikimedia.org/wiki/File:New_Wave_-_Flickr_-_Rob_Oo.jpg",
    ],
  },
});

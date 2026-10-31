// The Minister, voorheen Winston Churchill Tower (C.T. Storklaan / Sir Winston Churchilllaan, Rijswijk): kantoortoren
// van 1971 (ministerie van CRM/VWS, in 2001 gestript en opnieuw bekleed), in 2020–2022 door ZZDP Architecten getransformeerd
// tot woontoren. Om het bestaande casco kwam een nieuwe schil van erkers en balkons: op de lange gevels drie erkerkolommen
// van twee vensters breed, afgewisseld met vier kolommen gestapelde balkons, en dunne hoekstroken. Het oude installatiedak
// is vervangen door drie nieuwe verdiepingen die rondom terugliggen; in de bovenste laag liggen de balkonkolommen als
// dakterras nog eens 2,5 m terug, zodat de erkers als tanden boven de kroon uitsteken. Op het dak een installatiekast
// met zonnepanelen en een installatieframe.
// Vormen en hoogtes uit de 3D BAG LoD2.2 (AHN5, 2023; het AHN4-DSM is van vóór de transformatie en toont het oude dak op
// +77–78 m), gevelindeling uit foto's van ZZDP en de ortho.
import { Manifold, prism, rect, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "winston-churchill-tower";
// Gebouwstelsel: x langs de lange gevels naar het oostnoordoosten (26,03° op RD-oost, BAG-randen evenwijdig binnen 0,05°),
// y haaks erop naar het noordnoordwesten. Oorsprong in het hart van de toren (binnen 2 m van het midden van de kroon).
const ORIGIN = [81366.8, 450096.0];
const ANGLE = 26.03;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 0.5; // NAP, maaiveld (AHN-DTM rondom: oost 0,52, noord 0,08, west -0,07, zuid 1,55 op de parkheuvel)
const BASE = -0.8;
const z = (nap) => nap - GROUND;

// ---------- Hoogtes (NAP), 3D BAG LoD2.2 (AHN5) ----------
const LOW_TOP = 73.55; // erkers en dakranden van het onderste deel (3D BAG 73,43–73,73)
const BALC_TOP = 70.12; // bovenste balkonplaat van de balkonkolommen in het onderste deel (3D BAG 70,04–70,22)
const TERRACE = 80.06; // dakterrassen in de bovenste laag (3D BAG 80,01–80,14)
const ROOF = 83.65; // hoofddak (3D BAG 83,65–83,66, 1109 m²)
const BOX = 87.31; // installatiekast met zonnepanelen (3D BAG 87,30–87,31, 304 m²)
const PLANT = 86.04; // installatieframe aan de westkant (3D BAG 85,3–86,25)
// Verdiepingen: de balkonkolommen eindigen één laag onder de erkers, dus laag = 73,55 − 70,12 = 3,43 m; daaronder 20
// lagen en een hoge begane grond (0,5–4,95). De drie nieuwe lagen: 73,55–76,81–80,06–83,65.
const H = LOW_TOP - BALC_TOP;
const LOW = Array.from({ length: 20 }, (_, k) => [LOW_TOP - (20 - k) * H, H]); // [onderkant NAP, hoogte]
const GF = [GROUND, LOW[0][0] - GROUND];
const UP = [[LOW_TOP, (TERRACE - LOW_TOP) / 2], [(LOW_TOP + TERRACE) / 2, (TERRACE - LOW_TOP) / 2], [TERRACE, ROOF - TERRACE]];

// ---------- Plattegronden (x, y) ----------
// Kolommen langs de lange gevels (3D BAG-dakdelen, foto 4tdk5702): hoek | balkons | erker | balkons | erker | balkons |
// erker | balkons | hoek.
const XC = [-26.7, -24.2, -18.6, -11.3, -4.45, 3.05, 9.9, 17.4, 22.8, 25.3];
const BAYS = [[XC[2], XC[3]], [XC[4], XC[5]], [XC[6], XC[7]]];
const BALCS = [[XC[1], XC[2]], [XC[3], XC[4]], [XC[5], XC[6]], [XC[7], XC[8]]];
// Onderste deel tot +73,55: zuidgevel 1,9 m voor de nieuwe lagen, noordwesthelft met een erker die 1 m voor de balkons
// steekt, noordoosthelft en oostgevel 5,0 en 2,9 m voor de nieuwe lagen, in het midden van de westgevel een balkonstapel
// (3D BAG-grondvlak; de BAG-contour is aan de west- en zuidkant 3,6 en 4,3 m ruimer, daar ligt alleen maaiveld).
const LOWER = [[-26.7, -13.4], [-24.2, -13.4], [-24.2, -15.5], [22.8, -15.5], [22.8, -13.4], [25.3, -13.4], [25.3, -5.6], [28.17, -5.6],
  [28.17, 15.18], [-4.45, 15.18], [-4.45, 11.19], [-11.3, 11.19], [-11.3, 12.24], [-18.6, 12.24], [-18.6, 11.19], [-24.2, 11.19],
  [-24.2, 10.2], [-26.7, 10.2], [-26.7, 2.3], [-28.85, 2.3], [-28.85, -5.2], [-26.7, -5.2]];
// Balkonkolommen van het onderste deel: buiten de nieuwe lagen eindigen ze op de bovenste balkonplaat.
const BALC_OPEN = [...BALCS.map(([a, b]) => rect(a, -15.6, b, -13.65)), rect(XC[1], 10.2, XC[2], 11.3), rect(XC[3], 10.2, XC[4], 11.3)];
// Drie nieuwe lagen (+73,55 tot +83,65): erkers op y = -13,65 en 10,2, hoeken en oostkop terug.
const UPPER = [[-26.7, -11.3], [-24.2, -11.3], [-24.2, -13.65], [22.8, -13.65], [22.8, -11.9], [25.3, -11.9], [25.3, 7.8], [22.2, 7.8], [22.2, 10.2], [-26.7, 10.2]];
// Dakterrassen in de bovenste laag (vanaf +80,06): balkonkolommen 2,65 en 2,2 m terug, westkop 1,3 m.
const TERRACES = [...BALCS.map(([a, b]) => rect(a, -13.75, b, -11.0)), ...BALCS.map(([a, b], i) => rect(a, i === 3 ? 7.8 : 8.0, i === 3 ? 22.2 : b, 10.3)),
  rect(-26.8, -4.85, -25.4, 2.38)];
const BOX_POLY = rect(-10.45, -7.22, 17.15, 3.8);
const PLANT_POLY = rect(-17.5, -6.1, -10.45, 1.8);

// ---------- Massa ----------
const body = union([
  prism(LOWER, BASE, z(LOW_TOP)).subtract(union(BALC_OPEN.map((p) => prism(p, z(BALC_TOP), z(LOW_TOP) + 1)))),
  prism(UPPER, z(LOW_TOP) - 0.1, z(TERRACE)),
  prism(UPPER, z(TERRACE) - 0.1, z(ROOF)).subtract(union(TERRACES.map((p) => prism(p, z(TERRACE), z(ROOF) + 1)))),
]);
const roofStuff = union([prism(BOX_POLY, z(ROOF) - 0.1, z(BOX)), prism(PLANT_POLY, z(ROOF) - 0.1, z(PLANT))]);

// ---------- Gevelreliëf ----------
// Gevelvlak: c = ligging, out = buitennormaal ("-y", "+y", "-x", "+x"); P(s, diepte, h) met s langs de gevel.
const face = (c, out) => ({
  "-y": (s, d, h) => [s, c + d, h], "+y": (s, d, h) => [s, c - d, h],
  "-x": (s, d, h) => [c + d, s, h], "+x": (s, d, h) => [c - d, s, h],
})[out];
const recess = (P, s0, s1, depth, lo, hi) => Manifold.hull([
  P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, depth, lo), P(s1, depth, lo),
  P(s0, depth, hi - depth), P(s1, depth, hi - depth), P(s0, -0.2, hi + 0.2), P(s1, -0.2, hi + 0.2),
]);
const exposed = (P, s, h) => {
  const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
  const dist = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return dist > 2.95 && dist < 3.05;
};
const cuts = [];
const tryCut = (P, s0, s1, depth, lo, hi) => {
  const ok = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => exposed(P, s, lo + 0.05) && exposed(P, s, hi - 0.05));
  if (ok) cuts.push(recess(P, s0, s1, depth, lo, hi));
};
// Erker of gesloten gevelstrook: per laag vensters van vloer tot plafond (borstwering 0,9 m, latei 0,4 m) als blinde nis van
// 0,35 m met een plafond onder 45°; kozijnen van 0,45 m aan de randen en 0,5 m tussen de vensters (twee per erker).
function windows(P, s0, s1, levels, n = null) {
  const W = s1 - s0;
  n ??= W > 11 ? Math.round(W / 3.6) : W > 5 ? 2 : 1;
  const w = (W - 0.9 - (n - 1) * 0.5) / n;
  for (const [l, h] of levels) for (let i = 0; i < n; i++) {
    const a = s0 + 0.45 + i * (w + 0.5);
    tryCut(P, a, a + w, 0.35, z(l) + (l === GROUND ? 0.3 : 0.9), z(l) + h - 0.4);
  }
}
// Balkonkolom: per laag een open balkon van 1,6 m diep tussen de zijwanden van de erkers, met een plaat en borstwering van
// 1,0 m en een plafond onder 45°; op de begane grond een terugliggende pui zonder balkon.
function balconies(P, s0, s1, levels) {
  for (const [l, h] of levels) tryCut(P, s0 + 0.35, s1 - 0.35, 1.6, l === GROUND ? 0.1 : z(l) + 1.0, z(l) + h - 0.25);
}
const LOW_GF = [GF, ...LOW];
const LOW_BALC = [GF, ...LOW.slice(0, 19)]; // de twintigste laag is in de balkonkolommen een open terras
const TOP = [LOW[19]];

// Zuidgevel (parkzijde, ingang)
const S = face(-15.5, "-y"), Sin = face(-13.65, "-y");
BAYS.forEach(([a, b], i) => windows(S, a, b, i === 1 ? LOW : LOW_GF));
BALCS.forEach(([a, b]) => { balconies(S, a, b, LOW_BALC); windows(Sin, a, b, TOP); });
for (const [a, b] of [[XC[0], XC[1]], [XC[8], XC[9]]]) windows(face(-13.4, "-y"), a, b, LOW_GF);
cuts.push(recess(S, -3.0, 1.6, 1.0, 0.05, z(LOW[0][0]) - 0.5)); // ingang met de doorgaande lobby
BAYS.forEach(([a, b]) => windows(Sin, a, b, UP));
BALCS.forEach(([a, b]) => { balconies(Sin, a, b, UP.slice(0, 2)); windows(face(-11.0, "-y"), a, b, UP.slice(2)); });
windows(face(-11.3, "-y"), XC[0], XC[1], UP);
windows(face(-11.9, "-y"), XC[8], XC[9], UP);
// Noordgevel
windows(face(12.24, "+y"), XC[2], XC[3], LOW_GF);
for (const [a, b] of [[XC[1], XC[2]], [XC[3], XC[4]]]) { balconies(face(11.19, "+y"), a, b, LOW_BALC); windows(face(10.2, "+y"), a, b, TOP); }
windows(face(10.2, "+y"), XC[0], XC[1], [...LOW_GF, ...UP]);
const NE = face(15.18, "+y");
windows(NE, XC[4], XC[5], LOW);
cuts.push(recess(NE, -3.2, 1.8, 1.0, 0.05, z(LOW[0][0]) - 0.5)); // tweede ingang van de lobby
windows(NE, XC[6], XC[7], LOW_GF);
windows(NE, XC[8], 28.17, LOW_GF);
for (const [a, b] of [[XC[5], XC[6]], [XC[7], XC[8]]]) { balconies(NE, a, b, LOW_BALC); windows(NE, a, b, TOP); }
const N = face(10.2, "+y");
BAYS.forEach(([a, b]) => windows(N, a, b, UP));
BALCS.forEach(([a, b], i) => {
  const b2 = i === 3 ? 22.2 : b;
  balconies(N, a, b2, UP.slice(0, 2));
  windows(face(i === 3 ? 7.8 : 8.0, "+y"), a, b2, UP.slice(2));
});
windows(face(7.8, "+y"), 22.2, 25.3, UP);
// Oostkop (Prinses Beatrixlaan): gesloten gevelstroken
windows(face(28.17, "+x"), -5.6, 15.18, LOW_GF);
windows(face(25.3, "+x"), -13.4, -5.6, LOW_GF);
windows(face(25.3, "+x"), -11.9, 7.8, UP);
// Westkop: balkonstapel in het midden
const W0 = face(-26.7, "-x");
windows(W0, -13.4, -5.2, LOW_GF);
windows(W0, 2.3, 10.2, LOW_GF);
balconies(face(-28.85, "-x"), -5.2, 2.3, LOW_BALC);
windows(face(-28.85, "-x"), -5.2, 2.3, TOP);
windows(W0, -11.3, -5.2, UP);
windows(W0, 2.3, 10.2, UP);
balconies(W0, -5.2, 2.3, UP.slice(0, 2));
windows(face(-25.4, "-x"), -4.85, 2.38, UP.slice(2));

const building = union([body.subtract(union(cuts)), roofStuff]);
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`The Minister: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("The Minister", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "sneden", cuts.length, "laag", H.toFixed(3));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [[`building:${slug}`, building]],
  catalog: {
    name: "The Minister (voorheen Winston Churchill Tower)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 43.9, // NAP-maaiveld + 43,4 (Rijswijk, ellipsoïdisch; geoïde NLGEO2018 43,48 zoals bij Hoogvoorde)
    groundOffsetMetres: -0.15,
    replacesBuildings: ["NL.IMBAG.Pand.0603100000005840"],
    description:
      "The Minister, tot 2020 de Winston Churchill Tower (kantoortoren van 1971 bij station Rijswijk, in 2020–2022 door ZZDP Architecten getransformeerd tot woontoren): een onderste deel tot NAP +73,55 m met op de lange gevels drie erkerkolommen van twee vensters breed tussen vier kolommen gestapelde balkons die op +70,12 m eindigen, aan de noordoost- en oostkant 5,0 en 2,9 m dieper en in het midden van de westkop een balkonstapel; daarop drie nieuwe lagen die rondom 1,9–2,9 m terugliggen tot het hoofddak op +83,65 m, met in de bovenste laag dakterrassen op +80,06 m in de balkonkolommen zodat de erkers als tanden boven de kroon uitsteken; op het dak een installatiekast met zonnepanelen tot +87,31 m en een installatieframe tot +86,04 m. Vensters per laag als blinde nissen, balkons als open nissen van 1,6 m. Vormen en hoogtes uit de 3D BAG LoD2.2 (AHN5 2023; het AHN4-DSM is van vóór de transformatie). Oorsprong in het hart van de toren, X-as langs de lange gevels (26,03° op RD-oost). Verdiepingshoogte (3,43 m uit het hoogteverschil van erkers en balkonkolommen), venster- en balkonmaten, de gevelindeling van de oostkop en noordoosthelft en de ingangen zijn geschat.",
    realWorld: {
      groundNapM: GROUND,
      lowerTopNapM: LOW_TOP,
      balconyTopNapM: BALC_TOP,
      terraceNapM: TERRACE,
      roofNapM: ROOF,
      plantBoxNapM: BOX,
      plantFrameNapM: PLANT,
      storeys: { ground: 1, lower: 20, new: 3 },
      storeyHeightM: +H.toFixed(2),
      bayColumnsLongFacade: 3,
      balconyColumnsLongFacade: 4,
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0603100000005840, actuele orthoHR, AHN-DSM en -DTM 0,5 m (AHN4), 3D BAG LoD2.2 (AHN5, 2023)",
      "https://nl.wikipedia.org/wiki/Lijst_van_hoogste_gebouwen_van_Haaglanden",
      "https://www.zzdp.nl/project/the-minister",
      "https://stedenbouw.nl/en/?p=11248",
      "https://skyscraperpage.com/b6548",
      "https://commons.wikimedia.org/wiki/File:Churchill_Tower_Rijswijk_2020.jpg",
    ],
  },
});

// "Watertoren Groenendaal" in Heemstede: de ruïne van het pomphuis van de buitenplaats Meer en Berg, sinds 1948 deel
// van het wandelbos Groenendaal (rijksmonument 529181, "BY Glipper Dreef 199", onderdeel 7 van complex 522623
// Meer en Berg/Mariënheuvel; scoutingterrein). Gebouwd in of kort na 1730 om de vijf fonteinen in de Marot-aanleg van
// waterdruk te voorzien; het register noemt het restant "de watertoren die hierbij de benodigde druk leverde", foto's
// op Commons noemen hem "Ruine van Groenendaal park". De Wikipedia-lijst van watertorens in Noord-Holland noemt
// "Groenendaal (Heemstede)" zonder plaats, jaar of maten; dit is het enige waterbouwwerk met die naam in het bos.
// Volgens het register "een rechthoekige bouwdeel van één hoge bouwlaag met een zadeldak tussen topgevels".
//
// Oorsprong in het hart van het pomphuis op maaiveld (AHN-DTM NAP +0,27 tot +0,74 rond het pand; gebruikt +0,55).
// Lokale +X loopt langs de nok naar het zuidoosten, evenwijdig aan de noordoostgevel van de BAG-contour (pand
// 0397100000001033, bouwjaar 1730; xAxis [0,71059, -0,7036], RD -44,7 graden); +Y is de normaal van de noordoostgevel.
// Plattegrond = de BAG/BGT-contour: noordwestgevel 8,86 m, noordoostgevel 7,16 m, zuidwestgevel 10,0 m en een scheve
// zuidoostgevel. Dak uit het AHN-DSM 0,5 m in het stelsel langs de nok: zadeldak met de nok in het midden op NAP
// +11,2 (10,65 m boven maaiveld), beide vlakken met helling 0,78 (38 graden), goot op 7,19 m. Scheve zuidoosttopgevel
// volgt de BAG-contour (het DSM loopt daar mee). Schoorsteen op het zuidwestvlak bij de zuidoostgevel (luchtfoto 2021 en
// 2025, foto van de zuidwestgevel). Gevelopeningen uit de Commons-foto's: grote boogpoort in de noordoostgevel bij de
// noordhoek, deur, venster en luikdeur in de noordwesttopgevel, vensters in de zuidwestgevel; alle als blinde nis van
// 0,35 m met een plafond dat naar binnen oploopt (printbaar). Ruïnemuren uit de luchtfoto's 2021, 2022 en 2025 (blad
// van de bomen af) en de gaten in het AHN-DTM: een muur van 0,9 m in het verlengde van de zuidwestgevel naar het
// noordwesten, die naast de westhoek tot net onder de goot staat en dan afloopt naar een lage muur (foto's van de
// noordwesttopgevel en van de zuidwestgevel).
import { hull, union, prism, box, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [102253.47, 483091.11];
const AXIS = [0.71059, -0.7036];
const BASE = -0.3;
const GROUND_NAP = 0.55; // AHN-DTM 0,27 tot 0,74 binnen 10 m van het pand
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-04 via de PDOK-terreintegel.
const GROUND_ELLIPSOID = 43.59; // 43,59 tot 43,79 op de punten rond het pomphuis

// BAG/BGT-contour van pand 0397100000001033 (RD), naar het lokale stelsel.
const BAG_RD = [
  [102253.395, 483097.423], // noordhoek
  [102247.147, 483091.138], // westhoek
  [102254.425, 483084.263], // zuidhoek
  [102258.479, 483092.389], // oosthoek
];
const ux = AXIS[0] / Math.hypot(...AXIS), uy = AXIS[1] / Math.hypot(...AXIS);
const local = ([x, y]) => {
  const dx = x - ORIGIN[0], dy = y - ORIGIN[1];
  return [+(dx * ux + dy * uy).toFixed(3), +(-dx * uy + dy * ux).toFixed(3)];
};
const [N, W, S, E] = BAG_RD.map(local); // N (-4.5, 4.43), W (-4.52, -4.43), S (5.49, -4.2), E (2.66, 4.43)

const H = {
  eave: 7.19, // goot (AHN-DSM NAP +7,74)
  ridge: 10.65, // nok (AHN-DSM NAP +11,1 tot +11,2)
  chimney: 11.45, // schoorsteen, ~1,5 m boven het dakvlak (foto)
  ruinTop: 7.0, // ruïnemuur naast de westhoek (foto's, tot net onder de goot)
  ruinLow: 1.8, // afgebrokkelde muur verder naar het noordwesten
};
const SLOPE = (H.ridge - H.eave) / N[1]; // 0,78

// ---------- pomphuis: muren en zadeldak in één stuk ----------
const roofPlane = (s) => {
  const n = Math.hypot(SLOPE, 1);
  return [[0, (s * SLOPE) / n, -1 / n], -H.ridge / n]; // z <= ridge - s * slope * y
};
const house = prism([N, W, S, E], BASE, H.ridge + 0.5)
  .trimByPlane(...roofPlane(-1))
  .trimByPlane(...roofPlane(+1));

// Schoorsteen op het zuidwestvlak bij de zuidoostgevel (luchtfoto: u 7,2, v 5,4 vanaf de noordhoek), 1,0 x 1,0 m.
const chimney = box(2.2, -1.5, H.eave, 3.2, -0.5, H.chimney);

// ---------- nissen ----------
// Blinde nis in een gevel van p0 naar p1 (buitenkant, gebouw links van de looprichting): van s0 tot s1 m langs de gevel,
// van z0 tot de aanzet z1, met een spitse top onder 50 graden als `pointed`; diepte 0,35 m. Het plafond loopt naar
// binnen op onder 56 graden, zodat de nis zonder steun print.
const DEPTH = 0.35;
const niche = (p0, p1, s0, s1, z0, z1, pointed) => {
  const L = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const t = [(p1[0] - p0[0]) / L, (p1[1] - p0[1]) / L];
  const n = [t[1], -t[0]]; // naar buiten
  const at = (s, d, z) => [p0[0] + t[0] * s - n[0] * d, p0[1] + t[1] * s - n[1] * d, z];
  const apex = pointed ? z1 + ((s1 - s0) / 2) * 1.2 : z1;
  const mid = (s0 + s1) / 2;
  const rise = DEPTH * 1.5;
  const profile = (d, dz) => [at(s0, d, z0), at(s1, d, z0), at(s0, d, z1 + dz), at(s1, d, z1 + dz), at(mid, d, apex + dz)];
  return hull([...profile(-1.0, -1.0 * 1.5), ...profile(0, 0), ...profile(DEPTH, rise)]);
};
// De contour N-W-S-E loopt linksom; elke gevel krijgt zijn nissen in die looprichting (s vanaf de eerste hoek).
const openings = union([
  // Noordoostgevel (E naar N): grote boogpoort, 2,5 m breed, 0,8 tot 3,3 m van de noordhoek, top op 5,0 m.
  niche(E, N, 3.86, 6.36, 0, 3.5, true),
  // Noordwesttopgevel (N naar W): deur, venster en luikdeur met balkonnetje (het balkon zelf is te dun).
  niche(N, W, 5.0, 6.1, 0, 2.0, true),
  niche(N, W, 6.4, 7.3, 3.0, 4.2, true),
  niche(N, W, 4.9, 6.1, 5.4, 6.6, false),
  // Zuidwestgevel (W naar S): groot venster hoog in het midden en een getralied venster bij de zuidhoek.
  niche(W, S, 4.6, 6.1, 4.4, 5.6, false),
  niche(W, S, 7.6, 8.5, 1.6, 2.9, false),
]);

// ---------- ruïne ----------
// Muur van 0,9 m in het verlengde van de zuidwestgevel, van de westhoek 6 m naar het noordwesten (luchtfoto 2022: lichte
// muurkruin tot 5,5 m; AHN-DTM-gat tot 5,5 à 6 m): de eerste 2 m op 7,0 m met een vlakke kruin (gepleisterde kop op de
// foto van de noordwesttopgevel), dan aflopend tot 1,8 m op 4 m en daarna laag (foto van de zuidwestgevel).
const sw = [(W[0] - S[0]) / Math.hypot(W[0] - S[0], W[1] - S[1]), (W[1] - S[1]) / Math.hypot(W[0] - S[0], W[1] - S[1])];
const inward = [sw[1], -sw[0]]; // naar het noordoosten (rechts van de looprichting Z naar W)
const wallPt = (s, d, z) => [W[0] + sw[0] * s + inward[0] * d, W[1] + sw[1] * s + inward[1] * d, z];
const ruinHigh = hull([0, 0.9].flatMap((d) => [wallPt(-0.4, d, BASE), wallPt(4.0, d, BASE), wallPt(-0.4, d, H.ruinTop), wallPt(2.0, d, H.ruinTop), wallPt(4.0, d, H.ruinLow)]));
const ruinLow = hull([0, 0.9].flatMap((d) => [wallPt(3.9, d, BASE), wallPt(6.0, d, BASE), wallPt(3.9, d, H.ruinLow), wallPt(6.0, d, H.ruinLow)]));

// Niet gemodelleerd: een object van zo'n 3 x 3 m 9 m voor de noordwestgevel (gat in het AHN-DTM, lichte vlek op de
// luchtfoto's 2021 en 2022, onder de boomkruinen). Geen foto toont er een muur; het kan een scoutingopslag zijn.

const pumpHouse = union([house, chimney, ruinHigh, ruinLow]).subtract(openings);

await writeLandmark({
  slug: "watertoren-groenendaal-heemstede",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:pomphuis-met-zadeldak-en-ruinemuur", pumpHouse]],
  catalog: {
    name: "Watertoren Groenendaal",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-3, 6], [0, 6], [3, 6], [-3, -6], [0, -6], [4, -5.5], [-7, 0], [6.5, -1]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0397100000001033"],
    description:
      "Ruïne van het pomphuis (watertoren) van Meer en Berg in het wandelbos Groenendaal, rijksmonument 529181. Oorsprong in het hart van het pand op maaiveld (NAP +0,55), +X langs de nok naar het zuidoosten (RD -44,7 graden). Pomphuis op de BAG-contour (8,86 m breed, 7,16 tot 10,0 m lang, scheve zuidoostgevel), zadeldak van 38 graden met goot op 7,19 m en nok op 10,65 m (AHN), schoorsteen, blinde nissen voor boogpoort, deuren en vensters, en een afgebrokkelde muur van 0,9 m in het verlengde van de zuidwestgevel (7,0 m naast de westhoek, aflopend tot 1,8 m).",
    realWorld: {
      built: "1730 of kort daarna",
      monument: 529181,
      complex: "522623 Meer en Berg/Mariënheuvel",
      ahnGroundNapM: GROUND_NAP,
      ahnRidgeNapM: 11.2,
      eaveM: H.eave,
      ridgeM: H.ridge,
      roofPitchDeg: +((Math.atan(SLOPE) * 180) / Math.PI).toFixed(1),
      chimneyM: H.chimney,
      ruinWallTopM: [H.ruinTop, H.ruinLow],
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/529181 (ruïne van het pomphuis, 1730 of kort daarna, rechthoekig bouwdeel van één hoge bouwlaag met zadeldak tussen topgevels)",
      "https://www.monumenten.nl/monument/522629 (Meer en Berg: de watertoren die de druk voor de fonteinen leverde is als ruïne bewaard)",
      "https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Noord-Holland (Groenendaal (Heemstede), maten onbekend)",
      "https://commons.wikimedia.org/wiki/File:Ruine_van_Groenendaal_park.jpg (noordwesttopgevel met deur, venster en luikdeur, noordoostgevel met boogpoort, kop van de ruïnemuur)",
      "https://commons.wikimedia.org/wiki/File:Newcomen_steam_engine_at_landgoed_groenedaal_(2).jpg en (3) (topgevel en zuidwestgevel met schoorsteen en aflopende ruïnemuur)",
      "PDOK BAG/BGT-pand 0397100000001033 (G0397.41cdc9b35ac6466a9258668df3ee4949), AHN DSM/DTM 0,5 m en luchtfoto 2021-2025, 2026-11-04",
    ],
  },
});

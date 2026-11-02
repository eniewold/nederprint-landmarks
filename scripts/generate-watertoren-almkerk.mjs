// Nieuwe watertoren van Almkerk, in de buurtschap Uppel aan de Provincialeweg
// Noord (gemeente Altena). Gebouwd eind jaren 1940 (BAG-bouwjaar 1948) voor de
// Waterleiding Maatschappij Noord-West-Brabant als vervanger van de oude toren
// (H. Sangster, 1935) die het Duitse leger in 1944 opblies; Wikipedia noemt
// Kees de Bever als ontwerper, 43,3 m hoog, reservoir 500 m³. Tot 2008 in
// gebruik, sinds 2014 een woning. Een ronde, rechte bakstenen schacht op een
// terp met een rij rondvensters onder een gladde, licht uitkragende band, een
// flauw kegeldak met staande naden en een bol op de top; aan de zuidkant een
// koppelvenster met daaronder vier trapvensters boven elkaar, rondom op de
// begane grond kleine vensters in paren, de deur aan de westkant (het pad
// vanaf de dijk op de luchtfoto).
//
// Oorsprong op het middelpunt van de cirkel door de BAG-contour (pand
// 0874100000001233, 13,08 m doorsnede) op het maaiveld van de terp (AHN-DTM
// NAP +2,52 m). +X wijst naar RD-oost: een ronde toren heeft geen hoofdas.
// Hoogtes uit het AHN-DSM 0,5 m: dakrand NAP +42,15 (39,6 m), kegel 23 graden
// tot NAP +45,1 (42,6 m), bol tot NAP +46,2. Band, rondvensters en vensters
// van de foto "Overzicht watertoren met tuinkabouters op de voorgrond - Uppel"
// (RCE 20335217, 24,5 px/m over de schacht, geschaald op de hoogte tot de
// dakrand) en de foto "Watertoren - Almkerk" (RCE 20007301, de top).
import { hull, ring3, circle, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [124141.32, 422420.76];
const AXIS = [1, 0]; // +X = RD-oost
const BASE = -0.3;
const GROUND_NAP = 2.52; // AHN-DTM op de terp rond de voet (2,46 tot 2,56)
const GEOID_N = 43.62; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 72;

const R = {
  shaft: 6.54, // BAG-cirkel
  band: 6.87, // de band kraagt 0,33 m uit (foto's, AHN-rand tot 6,9 m)
  knob: 0.45, // bol vergroot tot 0,9 m
};
const H = {
  corbel: 38.05, // onderkant van de schuine kraag onder de band
  band: 38.4, // onderkant van het rechte deel van de band
  eave: 39.6, // dakrand (AHN NAP +42,15)
  apex: 42.57, // top van de kegel (AHN: z = 45,12 - 0,43 r, 23 graden)
  knobFoot: 42.3,
  knobTop: 43.0,
  top: 43.35, // bol en piek (AHN tot NAP +46,22 met windvaan)
};

const ring = (r, z) => ring3(circle([0, 0], r, SEG), z);

// ---------- schacht, band en kegeldak ----------
const shaft = hull([...ring(R.shaft, BASE), ...ring(R.shaft, H.corbel + 0.05)]);
// Band: schuine kraag van 47 graden (in het echt een ronde onderkant), dan recht tot de dakrand.
const band = hull([...ring(R.shaft, H.corbel), ...ring(R.band, H.band), ...ring(R.band, H.eave)]);
const roof = hull([...ring(R.band, H.eave - 0.05), [0, 0, H.apex]]);
// Bol op de top, achtkantig met een spits zodat hij zonder steun print.
const knob = hull([...ring3(circle([0, 0], R.knob, 8, Math.PI / 8), H.knobFoot), ...ring3(circle([0, 0], R.knob, 8, Math.PI / 8), H.knobTop), [0, 0, H.top]]);

// ---------- vensters en deur als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f, midden op y = c.
const niche = (f, w, z0, z1, depth = 0.3, c = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = c - w / 2, y1 = c + w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
const SOUTH = -95; // vensterkolom (luchtfoto: de ruiten staan zuid, iets west)
const DOOR = 170; // westkant, waar het pad vanaf de dijk aankomt
// Koppelvenster: twee rondboogvensters van 0,9 × 2,7 m met een dam van 0,3 m.
const twin = [-0.6, 0.6].map((c) => niche(R.shaft, 0.9, 29.8, 32.5, 0.3, c));
// Vier smalle trapvensters boven elkaar onder het koppelvenster.
const SLITS = [[8.0, 9.4], [13.8, 15.2], [19.6, 20.9], [25.2, 26.6]];
const slits = SLITS.map(([z0, z1]) => niche(R.shaft, 0.6, z0, z1));
// Kleine vensters in paren op de begane grond, om de 45 graden (niet waar de deur zit).
const pair = [-0.4, 0.4].map((c) => niche(R.shaft, 0.5, 2.1, 3.1, 0.3, c));
const pairs = Array.from({ length: 8 }, (_, k) => SOUTH + k * 45).filter((d) => Math.abs(((d - DOOR + 540) % 360) - 180) > 20);
// Acht rondvensters van 0,7 m onder de band, tussen de assen van de vensterkolom.
const oculi = Array.from({ length: 8 }, (_, k) => SOUTH + 22.5 + k * 45);
const cuts = [
  ...[...twin, ...slits].map((n) => place(n, { deg: SOUTH })),
  ...pairs.flatMap((d) => pair.map((n) => place(n, { deg: d }))),
  ...oculi.map((d) => place(niche(R.shaft, 0.7, 37.15, 37.85), { deg: d })),
  place(niche(R.shaft, 1.2, 0, 2.4, 0.4), { deg: DOOR }),
];

const tower = union([shaft, band, roof, knob]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-almkerk",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-band-en-kegeldak", tower]],
  catalog: {
    name: "Watertoren Almkerk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Op de terp rond de voet; de zuidoostkant heeft een gat in het AHN-DTM.
    groundSamplePoints: [[7.5, 0], [0, 7.5], [-7.5, 0], [-5.3, -5.3]],
    // Ellipsoïdisch: NAP +2,52 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0874100000001233"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op het maaiveld van de terp (NAP +2,52 m), +X naar RD-oost. Ronde bakstenen schacht van 13,08 m doorsnede met een band van 13,74 m op een schuine kraag van 38,05 tot 39,6 m, een kegeldak van 23 graden tot 42,6 m en een bol tot 43,35 m; acht rondvensters onder de band, aan de zuidkant een koppelvenster op 29,8 m en vier trapvensters, vensterparen op de begane grond en de deur aan de westkant. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 43.3,
      reservoirM3: 500,
      bagBuildYear: 1948,
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 42.15,
      ahnApexNapM: 45.12,
      ahnTopNapM: 46.22,
      geoidNlgeo2018M: GEOID_N,
      shaftDiameterM: R.shaft * 2,
      bandDiameterM: R.band * 2,
      eaveM: H.eave,
      roofPitchDeg: 23,
      apexM: H.apex,
      modelTopM: H.top,
      photoScalePxPerM: 24.5,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Almkerk)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_met_tuinkabouters_op_de_voorgrond_-_Uppel_-_20335217_-_RCE.jpg (hele toren, vensters, maten)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_-_Almkerk_-_20007301_-_RCE.jpg (band, rondvensters, kegeldak en bol)",
      "https://commons.wikimedia.org/wiki/File:Uppel_met_watertoren.jpg (silhouet)",
      "PDOK BAG-pand 0874100000001233, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "3D BAG (LoD2.2) van pand 0874100000001233: dakrand en nok ter controle",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,62 m) voor groundHeight",
    ],
  },
});

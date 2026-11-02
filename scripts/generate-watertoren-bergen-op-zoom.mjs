// Watertoren van Bergen op Zoom aan de Parallelweg 127, naast het spoor en het
// John F. Kennedyviaduct. Gebouwd in 1899 naar ontwerp van D. de Leeuw in
// neorenaissancestijl, rijksmonument 517134; volgens Wikipedia 33,4 m hoog
// (het register noemt 35 m) met een vlakbodemreservoir van 290 m³, nu een
// woning. Een ronde bakstenen toren in drie geledingen: een iets bredere
// onderbouw met de ingang onder een driehoekig fronton en een schuine
// waterlijst; een schacht met gekoppelde rondboogvensters in nissen en daarboven
// smalle rondboogvensters, verspringend; een uitkragende rondboogfries met gele
// boogjes onder een lijst; de reservoirzone met korfbogen tussen lisenen en
// spleetvensters; een ver overstekend zestienzijdig tentdak op houten
// consoles, een dakkapel aan de westkant en een open achtkantig torentje met
// een koepeltje.
//
// Oorsprong op het middelpunt van de cirkel door de BAG-contour (pand
// 0748100000041750, 10,42 m doorsnede) op maaiveld (AHN-DTM NAP +10,05 m).
// +X wijst naar RD-oost: een ronde toren heeft geen hoofdas. De ingang en de
// dakkapel staan aan de westkant (180 graden), waar op de luchtfoto de
// informatieborden voor de deur liggen en het AHN de dakkapel toont.
// Hoogtes uit het AHN-DSM 0,5 m: dakrand NAP +34,9 (24,85 m), tentdak
// z = 28,24 - 0,53 r (28 graden), koepeltje tot NAP +41,0 (31,0 m). Geledingen,
// vensters en het torentje van de foto's "Bergen op Zoom water tower" (vanaf
// het viaduct uit het westen, 46 px/m over de onderbouw, 43 px/m verticaal
// geschaald op de AHN-hoogte van het torentje), "Bergen op Zoom - Watertoren -
// voorkant" (zuid), "... met bomen" (zuidoost) en "... torentje".
import { hull, ring3, circle, union, place, prism, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [79206.31, 389501.75];
const AXIS = [1, 0]; // +X = RD-oost
const BASE = -0.3;
const GROUND_NAP = 10.05; // AHN-DTM rond de voet (10,0 tot 10,1; het viaduct in het westen ligt hoger)
const GEOID_N = 44.29; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 72;
const WEST = 180; // ingang, gekoppeld venster erboven en dakkapel

const R = {
  plinth: 5.21, // BAG-cirkel
  shaft: 4.85, // foto: 0,93 keer de onderbouw, zonder zichtbare tapsheid
  frieze: 5.2, // rondboogfries, foto 1,0 keer de onderbouw
  cornice: 5.35, // lijst boven de fries
  upper: 4.95, // reservoirzone, foto 0,95 keer de onderbouw
  eave: 6.4, // hoekstraal van de zestienzijdige dakrand (AHN-rand op 6,3 tot 6,5 m)
  soffit: 4.95, // hoekstraal van de voet van de consolerij (de hoeken op de muur)
};
const H = {
  plinth: 5.6, // onderkant van de schuine waterlijst
  ledge: 6.0, // bovenkant van de waterlijst
  corbel: 17.6, // onderkant van de schuine kraag onder de rondboogfries
  frieze: 18.0,
  cornice0: 20.9, // onderkant van de lijst boven de fries
  cornice1: 21.08,
  cornice: 21.4,
  soffit: 22.35, // voet van de consolerij (51 graden naar de dakrand)
  fascia: 24.15, // onderkant van de dakrand met de consolekoppen
  eave: 24.85, // dakrand (AHN NAP +34,9)
  apex: 28.24, // denkbeeldige top van het tentdak (AHN: z = 28,24 - 0,53 r)
  lantern0: 27.4, // voet van het torentje, onder het dakvlak
  lanternBox: 28.4, // bovenkant van de schuine voet
  lanternCornice0: 29.38,
  lanternCornice1: 29.66,
  lanternCornice: 30.0,
  dome: 30.75,
  top: 31.0, // knop (AHN tot NAP +41,0); de bliksemafleider is weggelaten
};

const ring = (r, z, n = SEG, phase = 0) => ring3(circle([0, 0], r, n, phase), z);
const cyl = (r, z0, z1) => hull([...ring(r, z0), ...ring(r, z1)]);
// Zestienhoek met een vlak midden op het westen (hoeken op 180 ± 11,25 graden).
const P16 = Math.PI / 16;
const r16 = (r, z) => ring(r, z, 16, P16);
// Achthoek op de vlakken (doorsnede over de vlakken a).
const oct = (a, z) => ring(a / 2 / Math.cos(Math.PI / 8), z, 8, Math.PI / 8);

// ---------- onderbouw, schacht, fries en reservoirzone ----------
const plinth = cyl(R.plinth, BASE, H.plinth + 0.05);
// Waterlijst: schuine afzaat van 48 graden van de onderbouw naar de schacht.
const ledge = hull([...ring(R.plinth, H.plinth), ...ring(R.shaft, H.ledge)]);
const shaft = cyl(R.shaft, BASE, H.cornice);
// Rondboogfries op een schuine kraag (49 graden), daarboven de lijst op een kraag van 50 graden.
const frieze = hull([...ring(R.shaft, H.corbel), ...ring(R.frieze, H.frieze), ...ring(R.frieze, H.cornice0 + 0.05)]);
const cornice = hull([...ring(R.frieze, H.cornice0), ...ring(R.cornice, H.cornice1), ...ring(R.cornice, H.cornice)]);
const upper = cyl(R.upper, H.cornice - 0.1, H.soffit + 0.3);

// ---------- dak: consolerij, dakrand, tentdak en dakkapel ----------
// De houten consoles onder het overstek als dichte schuine rok van 51 graden, de rechte dakrand 0,7 m hoog.
const soffit = hull([...r16(R.soffit, H.soffit), ...r16(R.eave, H.fascia)]);
const fascia = hull([...r16(R.eave, H.fascia - 0.05), ...r16(R.eave, H.eave)]);
const roof = hull([...r16(R.eave, H.eave - 0.05), [0, 0, H.apex]]);
// Dakkapel midden op het westvlak: 1,5 m breed, voorkant 5,45 m uit het hart, plat dak op 27,0 (AHN).
const dormer = place(prism([[2.0, -0.75], [5.45, -0.75], [5.45, 0.75], [2.0, 0.75]], H.eave + 0.05, 27.0), { deg: WEST });

// ---------- torentje ----------
// Schuine achtkantige voet, het open deel met de zuiltjes als dichte trommel, een lijst op een
// kraag van 49 graden en een achtkantig koepeltje met knop.
const lanternBox = hull([...oct(1.45, H.lantern0), ...oct(1.3, H.lanternBox)]);
const drum = hull([...oct(1.1, H.lanternBox - 0.05), ...oct(1.1, H.lanternCornice0 + 0.05)]);
const lanternCornice = hull([...oct(1.1, H.lanternCornice0), ...oct(1.58, H.lanternCornice1), ...oct(1.58, H.lanternCornice)]);
const DOME = [[1.3, H.lanternCornice - 0.05], [1.3, 30.15], [1.18, 30.42], [0.92, 30.6], [0.5, 30.72], [0.2, H.dome]];
const cupola = hull(DOME.flatMap(([a, z]) => oct(a, z)));
const knob = hull([...oct(0.2, H.dome - 0.05), [0, 0, H.top]]);

// ---------- ingang met fronton ----------
// Fronton van 2,4 m breed boven de deur, 0,3 m voor de gevel, top op 3,8 m; de onderkant loopt
// onder 53 graden terug naar de gevel boven de deur.
const pediment = hull([
  [4.9, -1.2, 2.05], [4.9, 1.2, 2.05], [R.plinth + 0.3, -1.2, 2.85], [R.plinth + 0.3, 1.2, 2.85],
  [4.9, 0, 3.8], [R.plinth + 0.3, 0, 3.8],
]);

// ---------- vensters, fries en deur als nissen ----------
// Nis met een plafond dat naar binnen onder 56 graden oploopt, in het vlak met normaal +X op afstand f.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, z1 - 1.5], [b, w / 2, z1 - 1.5]]);
};
const around = (n, start) => Array.from({ length: n }, (_, k) => start + (k * 360) / n);
const cuts = [
  // Deur onder het fronton, twee rondboogvensters in de onderbouw en de hoge boogopening aan de straat (zuid).
  place(niche(R.plinth, 1.6, 0, 2.5, 0.35), { deg: WEST }),
  ...[125, 235].map((d) => place(niche(R.plinth, 0.9, 0.8, 2.6), { deg: d })),
  place(niche(R.plinth, 1.0, 0.3, 2.5, 0.35), { deg: 270 }),
  // Gekoppelde rondboogvensters in hun nis, acht rondom; daarboven acht smalle vensters, verspringend.
  ...around(8, WEST).map((d) => place(niche(R.shaft, 1.5, 8.3, 10.8), { deg: d })),
  ...around(8, WEST + 22.5).map((d) => place(niche(R.shaft, 0.65, 13.4, 15.7), { deg: d })),
  // Rondboogfries: 24 boogjes van 0,7 m.
  ...around(24, WEST + 7.5).map((d) => place(niche(R.frieze, 0.7, 18.5, 20.4, 0.2), { deg: d })),
];

const tower = union([
  plinth, ledge, shaft, frieze, cornice, upper,
  soffit, fascia, roof, dormer,
  lanternBox, drum, lanternCornice, cupola, knob,
  place(pediment, { deg: WEST }),
]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-bergen-op-zoom",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:onderbouw-schacht-fries-en-tentdak", tower]],
  catalog: {
    name: "Watertoren Bergen op Zoom",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Vlak maaiveld rond de voet; buiten 8 m in het westen begint de oprit van het viaduct.
    groundSamplePoints: [[6.5, 0], [0, 6.5], [-6.5, 0], [0, -6.5]],
    // Ellipsoïdisch: NAP +10,05 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0748100000041750"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-contour op maaiveld (NAP +10,05 m), +X naar RD-oost. Ronde bakstenen toren: onderbouw van 10,42 m doorsnede tot 6,0 m met een schuine waterlijst en de ingang onder een fronton aan de westkant; schacht van 9,7 m met acht gekoppelde en acht smalle vensters; rondboogfries van 10,4 m met lijst van 17,6 tot 21,4 m; gladde reservoirzone tot 22,35 m; zestienzijdig overstekend tentdak (12,8 m, dakrand 24,85 m, 28 graden) op een consolerij, dakkapel aan de westkant en een achtkantig torentje met koepeltje tot 31,0 m. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 33.4,
      registerHeightM: 35,
      reservoirM3: 290,
      buildYear: 1899,
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 34.9,
      ahnTopNapM: 41.0,
      geoidNlgeo2018M: GEOID_N,
      plinthDiameterM: R.plinth * 2,
      shaftDiameterM: R.shaft * 2,
      friezeDiameterM: R.frieze * 2,
      eaveCornerRadiusM: R.eave,
      ledgeM: H.ledge,
      friezeM: [H.corbel, H.cornice],
      eaveM: H.eave,
      roofPitchDeg: 28,
      modelTopM: H.top,
      photoScalePxPerM: 46,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Bergen_op_Zoom)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/517134",
      "https://commons.wikimedia.org/wiki/File:Bergen_op_Zoom_water_tower.jpg (westkant: ingang, fronton, vensters, fries, dakkapel, maten)",
      "https://commons.wikimedia.org/wiki/File:Bergen_op_Zoom_-_Watertoren_-_voorkant.jpg (zuidkant: onderbouw, boogopening, consoles)",
      "https://commons.wikimedia.org/wiki/File:Bergen_op_Zoom_-_Watertoren_met_bomen.jpg (zuidoost: reservoirzone, dakvlakken)",
      "https://commons.wikimedia.org/wiki/File:Bergen_op_Zoom_-_Watertoren_-_torentje.jpg (torentje, verhoudingen)",
      "PDOK BAG-pand 0748100000041750, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "NLGEO2018-geoïdehoogte op de oorsprong (44,29 m) voor groundHeight",
    ],
  },
});

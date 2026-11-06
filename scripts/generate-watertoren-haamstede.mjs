// Watertoren Haamstede (Boswachterij Westerschouwen, op een duintop ten noordwesten van Haamstede), gebouwd 1946 tot 1948
// boven het ondergrondse schoonwaterreservoir van de N.V. Waterleiding Maatschappij Schouwen-Duiveland. Geen klassieke
// watertoren: de betonnen kolom was een standpijp die drukverschillen in het net opving, het reservoir ligt onder de duin.
// Boven op de kolom ligt een rond uitzichtplatform met een stalen hekwerk, bereikbaar via een betonnen wenteltrap van losse
// blokken rond de kolom die door een gat in het platform naar boven komt (1965 tot 1984 brandwachtpost; 1989 en 2000
// gerestaureerd). Wikipedia noemt 12 m hoogte en "hoogste punt 36 m boven NAP"; het AHN meet het dek op NAP +40,52.
//
// Er is geen BAG-pand en geen BGT-object (pand, overigbouwwerk, kunstwerkdeel) voor de toren: de PDOK-gebouwtegel heeft hier
// niets, dus replacesBuildings vervalt. De toren staat ook niet als pand in de 3D BAG.
//
// Oorsprong op de as van de kolom: cirkelfit (straal 2,7 tot 2,9 m) op het platform in het AHN-DSM 0,5 m, RD
// [38567.95, 412848.95], en de luchtfoto (Actueel_orthoHR, 8 cm) met de cirkel 0,2 m oostelijker; afgerond [38568.0,
// 412848.95]. Het platform is op de luchtfoto 5,7 m breed (142 pixels van 4 cm), het DSM-gat in het dek ligt aan de
// noordnoordwestkant. De toren is rond: +X is RD-oost, +Y RD-noord (xAxis [1, 0]), hoeken linksom vanaf het oosten.
//
// Hoogtes uit het AHN (2026-11-06): dek NAP +40,52 (mediaan van 90 cellen binnen de rand; hekwerk tot 41,3), maaiveld rond
// de voet (AHN-DTM, 4 tot 7 m van de as) NAP +31,6 tot 32,1. PDOK-terrein op de groundSamplePoints ellipsoïdisch 75,84 tot
// 76,14; het AHN-DTM ligt daar 44,05 tot 44,16 lager (ellipsoïdisch = NAP + 44,1), dus z = 0 ligt op NAP +31,74.
// Opstand uit de Commons-foto's "Haamstede Watertoren 6119.JPG" en "Watertoren Haamstede.jpg" (allebei vanaf de duintrap aan
// de oostkant omhoog, naar het westen): kolom 0,24 tot 0,25 keer zo breed als het platform (1,45 m), rand van het platform
// circa 0,5 m dik, wenteltrap van circa 42 blokken rond de kolom, linksom klimmend: onderaan aan de westzuidwestkant, halverwege
// (circa 4,5 m) aan de oostkant voor de kolom, bovenaan door het gat aan de noordnoordwestkant.
//
// Printbaar op 1:1000 zonder steun: het platform is in het echt een vlakke plaat met een balk eronder; hier hangt alleen de
// rand van 0,5 m vrij en loopt de onderkant onder 50 graden als kegel naar de kolom. De treden hebben aan de onderkant een
// schuine kraag van 50 graden naar de kolom.
const argv = process.argv;
if (!argv.includes("--scale")) argv.push("--scale", "100"); // los printen op 1:100 (het model is kleiner dan 15 m)
const { Manifold, CrossSection, ccw, hull, union, prism, circle, writeLandmark } = await import("./efteling-kit.mjs");

const ORIGIN = [38568.0, 412848.95];
const BASE = -0.3;
const GEOID = 44.1; // ellipsoïdisch min NAP hier (PDOK-terrein min AHN-DTM op de groundSamplePoints: 44,05 tot 44,16)
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: oost (4 m) 75,84, noord 76,03,
// west 76,14, zuid 76,08.
const GROUND_ELLIPSOID = 75.84;
const NAP0 = +(GROUND_ELLIPSOID - GEOID).toFixed(2); // NAP-hoogte van z = 0: +31,74
const N = 96; // segmenten van kolom en platform
const DEG = Math.PI / 180;
const T50 = Math.tan(50 * DEG); // kegel en kraag onder 50 graden: marge boven de 45 graden van de export

// ---------- kolom en platform ----------
const R_COL = 0.725; // kolom 1,45 m (foto's: 0,24 tot 0,25 keer het platform)
const R_DECK = 2.85; // platform 5,7 m (luchtfoto; DSM-cirkelfit 5,4 tot 5,8)
const H = {
  deck: +(40.52 - NAP0).toFixed(2), // bovenkant van het dek (AHN-DSM NAP +40,52)
  rim: 0.5, // dikte van de rand (foto's)
};
H.rimBottom = +(H.deck - H.rim).toFixed(2);
H.coneFoot = +(H.rimBottom - (R_DECK - R_COL) * T50).toFixed(3); // kegel van 50 graden onder het platform tot de kolom

const column = prism(circle([0, 0], R_COL, N), BASE, H.deck - 0.2);
// Platform als één omwenteling: kegel van 50 graden vanaf de kolom (iets erin) naar de onderkant van de rand, rand van 0,5 m
// verticaal tot het dek.
const deckSolid = Manifold.revolve(
  new CrossSection([ccw([[0, H.coneFoot - 0.1 * T50], [R_COL - 0.1, H.coneFoot - 0.1 * T50], [R_DECK, H.rimBottom], [R_DECK, H.deck], [0, H.deck]])]),
  N,
);

// ---------- wenteltrap ----------
// Blokken van 0,21 m optrede, linksom van de westzuidwestkant (-155 graden) tot het gat in het dek (145 graden, 300 graden
// in totaal). Elk blok: bovenkant vlak, buitenkant 1,0 m verticaal (dunner wordt in de export als dun dragend deel tot de grond opgevuld), daaronder een kraag van 50 graden naar de kolom.
const STAIR = { from: -155, sweep: 300, steps: 42, rOut: 1.8, rIn: 0.5, edge: 1.0 };
const RISE = H.deck / STAIR.steps;
const stepAngle = STAIR.sweep / STAIR.steps;
const at = (r, a, z) => [r * Math.cos(a * DEG), r * Math.sin(a * DEG), z];
const steps = [];
for (let i = 0; i < STAIR.steps; i++) {
  const a0 = STAIR.from + i * stepAngle - (i > 0 ? 0.6 : 0), a1 = STAIR.from + (i + 1) * stepAngle;
  const top = (i + 1) * RISE, low = top - STAIR.edge, foot = low - (STAIR.rOut - STAIR.rIn) * T50;
  const pts = [];
  for (const a of [a0, (a0 + a1) / 2, a1]) pts.push(at(STAIR.rOut, a, top), at(STAIR.rOut, a, low), at(STAIR.rIn, a, top), at(STAIR.rIn, a, foot));
  steps.push(hull(pts));
}
const stair = union(steps).intersect(prism(circle([0, 0], 4, 16), BASE, 20));

// Gat in het dek boven het laatste stuk van de trap: van de kolom tot de buitenkant van de trap, tot de bovenste trede op
// 145 graden (op de luchtfoto aan de noordnoordwestkant). Per trede wordt alleen weggenomen wat boven die trede ligt, zodat
// de treden de bodem van het gat zijn en de kegel eronder heel blijft. Het gat begint 3 graden nadat de trap aan de
// buitenkant de kegel raakt. Twee dingen gaven in de 45-gradenopvulling anders extra materiaal over de hele kegel: een
// doorgang tussen trap en kegel naar het gat (begin te vroeg), en een gat als prisma tot onder de kegel (de kegel buiten
// het gat eindigde dan onderaan in een messcherpe rand). Alleen uit platform en kegel; trap en kolom blijven.
const HOLE = { to: STAIR.from + STAIR.sweep, rIn: 0.5, rOut: 1.77 };
const coneAtOut = H.rimBottom - (R_DECK - HOLE.rOut) * T50;
HOLE.from = Math.ceil(STAIR.from + (coneAtOut / H.deck) * STAIR.sweep) + 3;
const sector = (from, to, r0, r1) => {
  const n = Math.max(2, Math.ceil((to - from) / 2)), pts = [];
  for (let k = 0; k <= n; k++) pts.push([r1 * Math.cos((from + ((to - from) * k) / n) * DEG), r1 * Math.sin((from + ((to - from) * k) / n) * DEG)]);
  for (let k = n; k >= 0; k--) pts.push([r0 * Math.cos((from + ((to - from) * k) / n) * DEG), r0 * Math.sin((from + ((to - from) * k) / n) * DEG)]);
  return pts;
};
const holeParts = [];
for (let i = 0; i < STAIR.steps; i++) {
  const a0 = Math.max(HOLE.from, STAIR.from + i * stepAngle), a1 = Math.min(HOLE.to, STAIR.from + (i + 1) * stepAngle);
  if (a1 - a0 > 0.01) holeParts.push(prism(sector(a0, a1, HOLE.rIn, HOLE.rOut), (i + 1) * RISE, H.deck + 1));
}
const hole = union(holeParts);
const platform = deckSolid.subtract(hole);

const tower = union([column, platform, stair]);

await writeLandmark({
  slug: "watertoren-haamstede",
  base: BASE,
  nodes: [["building:watertoren-kolom-platform-en-wenteltrap", tower]],
  catalog: {
    name: "Watertoren Haamstede",
    origin: ORIGIN,
    xAxis: [1, 0],
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[4, 0], [0, 4], [-4, 0], [0, -4]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    description:
      "Oorsprong op de as van de betonnen kolom (cirkelfit op het platform in AHN en luchtfoto) op de duintop in de Boswachterij Westerschouwen (NAP circa +31,7 m), +X naar het oosten. Kolom van 1,45 m met een rond uitzichtplatform van 5,7 m, dek op 8,78 m (NAP +40,52), rand van 0,5 m en een kegel van 50 graden eronder in plaats van de vlakke onderkant, en een wenteltrap van 42 blokken die linksom van de westzuidwestkant door een gat aan de noordnoordwestkant naar het dek klimt. Geen BAG-pand; maten uit AHN, luchtfoto en foto's.",
    realWorld: {
      built: 1946,
      inUse: 1948,
      wikipediaHeightM: 12,
      wikipediaTopNapM: 36,
      reservoir: "ondergronds, onder de duin",
      groundNapM: NAP0,
      ahnDeckNapM: 40.52,
      columnDiameterM: 2 * R_COL,
      deckDiameterM: 2 * R_DECK,
      deckM: H.deck,
      stairSteps: STAIR.steps,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Haamstede) (1946, 12 m, standpijp boven een ondergronds reservoir, uitzichtplatform, brandwachtpost 1965-1984, restauraties 1989 en 2000)",
      "https://commons.wikimedia.org/wiki/File:Haamstede_Watertoren_6119.JPG (vanaf de duintrap aan de oostkant: kolom, platform met hekwerk, wenteltrap van losse blokken)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Haamstede.jpg (2024, idem van dichterbij: gat in het platform, balk onder het platform, onderste treden aan de westzuidwestkant)",
      "PDOK BAG-WFS en BGT (geen pand of bouwwerk op deze plek), AHN DSM/DTM 0,5 m, luchtfoto Actueel_orthoHR en PDOK-terrein, 2026-11-06",
    ],
  },
});

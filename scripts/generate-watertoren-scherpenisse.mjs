// Watertoren van Scherpenisse (Tholen), Langeweg 41. Gebouwd 1922 tot 1923 voor de N.V. Waterleidingmaatschappij Tholen
// naar ontwerp van N.V. MABEG (Mobeg) uit Utrecht, aannemer Z.N. Beton Mij. uit 's-Hertogenbosch; rijksmonument 496127,
// 52,4 m hoog (Wikipedia), reservoir van 350 m³, in 1993 buiten gebruik en sinds 1996 een woonhuis. Geheel van beton,
// met invloed van het classicisme (register): een achtkante, taps toelopende schacht van acht betonnen kolommen met
// verdiepte velden ertussen, in vier geledingen door drie eenvoudige banden; een geprofileerde lijst tussen de onderbouw
// en de schacht; de ingang (houten deur onder een gevelsteen met 1911 en 1923) in een klassieke omlijsting met een
// segmentvormig fronton, en dezelfde omlijsting om de vensters van de onderbouw. Boven de schacht kraagt een rond
// reservoir uit (onderste ring met ronde venstertjes, een band, de bovenste ring met smalle spleetvensters) met een brede
// overstekende kroonlijst, en daarop een spits kegeldak met dakkapellen (dezelfde omlijsting met fronton).
//
// Oorsprong op het hart van BAG-pand 0716100000106925 (regelmatige achthoek, apothema 5,63 tot 5,67 m, zijden 4,62 tot
// 4,75 m; het hart van het dak in het AHN-DSM ligt er minder dan 0,1 m naast). Het pand is in BAG en PDOK alleen de
// toren. +X wijst naar RD-richting 3,5 graden: de achthoek staat met zijn gevels op 3,5 + 45k graden (gemiddelde normaal
// van de acht BAG-zijden). De ingang zit in de zuidgevel (lokaal -Y): daar ligt in het AHN een bordes van NAP circa +1,1
// tot +1,6 tot 7,2 m van het hart, en op de luchtfoto het pad naar de Langeweg.
//
// Hoogtes (z = 0 ligt op NAP +0,01, zie GEOID; het maaiveld rond de voet is NAP -0,3 tot +0,6):
// - Dak uit het AHN-DSM 0,5 m (rechte kegel, per halve meter straal: 3,0 m +45,73, 2,0 m +47,31, 1,0 m +48,95, helling
//   1,58, ofwel 58 graden) en de 3D BAG (LoD2.2 uit AHN5, 2024: platte ring op NAP +42,9 rond de kegel, kegel tot +50,6).
//   Het DSM ziet de buitenste meter van de kroonlijst niet (koperen afdekking); de luchtfoto (Actueel_orthoHR) geeft de
//   kroonlijst 12,1 m breed. Top van het kapje NAP +52,44 (één cel, Wikipedia 52,4).
// - Geledingen uit de foto "Karakteristieke landschappen, watertorens, Bestanddeelnr 164-0197.jpg" (Nationaal Archief,
//   vanaf de Langeweg, bijna recht van opzij; 0,035 m per pixel, geschaald op de kroonlijst van 12,1 m en verankerd op de
//   bovenkant van de kroonlijst uit het AHN) en "Scherpenisse Watertoren 6921.JPG" (2008, recht voor de ingang, van
//   onderen): lijst boven de onderbouw op 6,5 tot 7,0 m, banden op 12,7, 18,6 en 24,25 m, schacht tot 29,6 m, uitkraging
//   tot 31,0 m, band van het reservoir 32,9 tot 33,5 m, kroonlijst 40,9 tot 42,9 m.
// - Breedtes uit dezelfde foto (verhouding tot de kroonlijst) en de BAG: schacht van apothema 5,4 boven de lijst naar
//   4,55 bovenaan, reservoir 10,8 m onder en 10,6 m boven de band.
//
// Printbaar op 1:1000 zonder steun: lijst, band en kroonlijst hebben een onderkant van 50 graden, de uitkraging onder het
// reservoir loopt onder 58 graden; nissen hebben een plafond dat onder 56 graden naar binnen oploopt (segmentbogen nog
// steiler); de omlijstingen staan op het bordes of hebben een schuine onderkant.
import { Manifold, CrossSection, ccw, hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [66490.16, 396239.29];
const AXIS_DEG = 3.5;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const SEG = 96;
const T22 = Math.tan(Math.PI / 8);
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: oost (8 m) 44,60, noord 44,21,
// west (9,5 m, voorbij de lage aanbouw) 44,30, zuid (8,5 m, voor het bordes) 44,75. Het laagste punt rond de toren,
// noordwest op 8 m, ligt op 43,98; dat valt nog binnen de 0,3 m die de voet onder z = 0 doorloopt.
const GROUND_ELLIPSOID = 44.209;
// Ellipsoïdisch min NAP hier: PDOK-terrein min AHN-DTM op acht punten rond de toren 43,84 tot 44,75 (mediaan 44,2);
// de 3D BAG geeft het maaiveld van het pand op NAP -0,13, PDOK de voet van het pand op 44,1.
const GEOID = 44.2;
const NAP0 = +(GROUND_ELLIPSOID - GEOID).toFixed(2); // NAP-hoogte van z = 0: +0,01

// Omwenteling van een gesloten profiel [[r, z], ...].
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
// Regelmatige achthoek met de gevels op 0 + 45k graden (normalen), apothema a, op hoogte z.
const oct = (a, z) => Array.from({ length: 8 }, (_, k) => {
  const t = ((22.5 + 45 * k) * Math.PI) / 180, r = a / Math.cos(Math.PI / 8);
  return [r * Math.cos(t), r * Math.sin(t), z];
});
const frustum = (a0, z0, a1, z1) => hull([...oct(a0, z0), ...oct(a1, z1)]);

// ---------- hoogtes boven z = 0 en apothema's ----------
const H = {
  ledge: [6.5, 7.0], // geprofileerde lijst tussen onderbouw en schacht
  tiers: [7.0, 12.7, 18.6, 24.25, 29.6], // geledingen van de schacht (banden op 12,7, 18,6 en 24,25)
  flareTop: 31.0, // uitkraging van de schacht naar het reservoir
  band: [32.9, 33.5],
  cornice: [40.9, 41.85, 42.9], // onderkant, onderkant van de rand, bovenkant (3D BAG NAP +42,9)
  capTop: 51.6, // kapje op de spits; punt 52,35
  stoop: 1.2, // bordes voor de deur (AHN NAP +1,1 tot +1,6)
};
const A = { plinth: 5.65, ledge: 5.9, shaftFoot: 5.4, shaftTop: 4.55 };
const R = { flareFoot: 4.4, lower: 5.4, band: 5.65, upper: 5.3, cornice: 6.1, cap: 0.75 };
// Kegeldak: z = 50,55 - 1,58 r (AHN-DSM), van de kroonlijst (r 4,85) tot het kapje.
const roofZ = (r) => 50.55 - 1.58 * r;
const R_ROOF = +((50.55 - H.cornice[2]) / 1.58).toFixed(3);
const shaftA = (z) => A.shaftFoot + ((A.shaftTop - A.shaftFoot) * (z - H.tiers[0])) / (H.tiers[4] - H.tiers[0]);

// Nis in een gevel met normaal +X: voorvlak op x = f0 (onderaan) en f1 (bovenaan, taps), breedte w, van z0 tot z1, met
// een segmentboog van `rise` bovenop (cirkelsegment; de aanzet moet minstens 50 graden steil zijn, anders vult de export
// de schouders op: rise ≥ 0,47 maal de halve breedte). Het plafond loopt onder 56 graden (1,5 maal de diepte) naar binnen
// op; voor de gevel loopt de snede schuin af (niet onder z0).
const niche = (f0, f1, w, z0, z1, { depth = 0.3, rise = 0, y = 0 } = {}) => {
  const c = w / 2, rho = rise > 0 ? (c * c + rise * rise) / (2 * rise) : 0, half = rise > 0 ? Math.asin(c / rho) : 0;
  const arc = rise > 0
    ? Array.from({ length: 9 }, (_, k) => {
      const t = -half + (2 * half * k) / 8;
      return [rho * Math.sin(t), z1 + rise - rho + rho * Math.cos(t)];
    })
    : [[-c, z1], [c, z1]];
  return hull([
    [f0 - depth, -w / 2, z0], [f0 - depth, w / 2, z0], [f0 + 1, -w / 2, z0], [f0 + 1, w / 2, z0],
    ...arc.map(([yy, z]) => [f1 - depth, yy, z + 1.5 * depth]),
    ...arc.map(([yy, z]) => [f1, yy, z]),
    ...arc.map(([yy, z]) => [f1 + 1, yy, Math.max(z0, z - 1.5)]),
  ]).translate([0, y, 0]);
};
// Klassieke omlijsting (gevel met normaal +X op x = f): 0,25 m uitstekend, breedte w, van z0 tot z1 met een segmentvormig
// fronton tot z1 + rise; de onderkant loopt onder 50 graden terug naar de gevel (tenzij hij op het bordes staat).
const surround = (f, w, z0, z1, rise, { out = 0.25, onFloor = false } = {}) => {
  const arc = Array.from({ length: 9 }, (_, k) => {
    const s = -1 + k / 4;
    return [(s * w) / 2, z1 + rise * (1 - s * s)];
  });
  const zb = onFloor ? z0 : z0 - 1.2 * out;
  return hull([
    ...arc.flatMap(([y, z]) => [[f - 0.3, y, z], [f + out, y, z]]),
    [f - 0.3, -w / 2, zb], [f - 0.3, w / 2, zb], [f, -w / 2, zb], [f, w / 2, zb], [f + out, -w / 2, z0], [f + out, w / 2, z0],
  ]);
};

// ---------- onderbouw, lijst en bordes ----------
const plinth = frustum(A.plinth, BASE, A.plinth, H.ledge[0] + 0.01);
// Lijst: onderkant onder 50 graden vanaf de onderbouw, verticale rand van 0,5 m, bovenkant vlak tot de schacht.
const ledge = hull([...oct(A.plinth, H.ledge[0] - 1.2 * (A.ledge - A.plinth)), ...oct(A.ledge, H.ledge[0]), ...oct(A.ledge, H.ledge[1])]);
// Bordes voor de ingang (zuid, gebouwd naar +X): bovenkant 1,2 m tot 6,4 m van het hart, drie treden tot 7,2 m.
const STOOP = { half: 1.8, landing: 6.4, foot: 7.2, steps: 3 };
const tread = (STOOP.foot - STOOP.landing) / STOOP.steps;
const stoop = union([
  box(A.plinth - 0.3, -STOOP.half, BASE, STOOP.landing, STOOP.half, H.stoop),
  ...Array.from({ length: STOOP.steps }, (_, k) =>
    box(STOOP.landing - 0.01, -STOOP.half, BASE, STOOP.landing + (k + 1) * tread, STOOP.half, (H.stoop * (STOOP.steps - k)) / (STOOP.steps + 1))),
]);
// Ingang: omlijsting van 2,6 m breed op het bordes tot 4,6 m met een segmentfronton tot 5,4 m; deur van 1,3 m tot 3,7 m
// als nis van 0,4 m in de omlijsting.
const portal = surround(A.plinth, 2.6, H.stoop, 4.6, 0.8, { out: 0.3, onFloor: true });
const door = niche(A.plinth + 0.3, A.plinth + 0.3, 1.3, H.stoop, 3.5, { depth: 0.7, rise: 0.35 });
// Vensters van de onderbouw (oost, noord, west; de plek is geschat): omlijsting van 2,0 m van 1,8 tot 4,4 m met fronton
// tot 4,9 m, venster van 1,0 m van 2,1 tot 4,0 m.
const winSurround = surround(A.plinth, 2.0, 1.8, 4.4, 0.5);
const win = niche(A.plinth + 0.25, A.plinth + 0.25, 1.0, 2.1, 3.9, { depth: 0.55, rise: 0.25 });
const GROUND_WINDOWS = [0, 90, 180];
const base = union([plinth, ledge, place(stoop, { deg: 270 }), place(portal, { deg: 270 }), ...around(winSurround, GROUND_WINDOWS)])
  .subtract(union([place(door, { deg: 270 }), ...around(win, GROUND_WINDOWS)]));

// ---------- schacht ----------
// Achtkante afgeknotte piramide; per gevel en geleding een verdiept veld van 0,3 m tussen de hoekkolommen (0,8 m per kant)
// en de banden (0,45 m boven en onder elke grens); de bovenste velden met een segmentboog. Vensters (1,0 m, als nis van
// 0,3 m in het veld) verspringen per gevel zoals op de foto's.
const shaft = frustum(A.shaftFoot, H.ledge[1] - 0.01, A.shaftTop, H.tiers[4]);
const COLUMN = 0.8;
const panels = [];
const windows = [];
// Geleding (0 = onderste) → gevels met een venster (0 = oost, 90 = noord, 180 = west, 270 = zuid boven de ingang).
const WINDOWS = { 0: [45, 135, 225, 315], 1: [0, 90, 180, 270], 2: [45, 135, 225, 315], 3: [0, 90, 180, 270] };
for (let t = 0; t < 4; t++) {
  const z0 = H.tiers[t] + (t === 0 ? 0.6 : 0.45), top = t === 3 ? H.tiers[4] - 1.3 : H.tiers[t + 1] - 0.45;
  const rise = t === 3 ? 0.55 : 0;
  const w = 2 * T22 * shaftA(top + rise) - 2 * COLUMN;
  const p = niche(shaftA(z0), shaftA(top), w, z0, top, { rise });
  panels.push(...around(p, every(8)));
  const wz0 = z0 + 0.4 * (top - z0), wz1 = Math.min(top - 0.8, wz0 + 1.6);
  const wn = niche(shaftA(wz0) - 0.3, shaftA(wz1) - 0.3, 1.0, wz0, wz1);
  windows.push(...around(wn, WINDOWS[t]));
}
const shaftAll = shaft.subtract(union([...panels, ...windows]));

// ---------- reservoir ----------
// Uitkraging (58 graden) van binnen de schacht naar de onderste ring; onderste ring met ronde venstertjes (te klein, niet
// gemodelleerd); band met een onderkant van 50 graden; bovenste ring; kroonlijst met een onderkant van 50 graden en een
// rand van 1,05 m; vlakke ring bovenop tot de dakvoet.
const reservoir = union([
  rev([[0, H.tiers[4] - 0.05], [R.flareFoot, H.tiers[4] - 0.05], [R.lower, H.flareTop], [R.lower, H.band[0] + 0.01], [0, H.band[0] + 0.01]]),
  rev([[0, H.band[0] - 1.2 * (R.band - R.lower)], [R.lower - 0.01, H.band[0] - 1.2 * (R.band - R.lower)], [R.band, H.band[0]], [R.band, H.band[1]], [0, H.band[1]]]),
  solidRev([[R.upper, H.band[1] - 0.01], [R.upper, H.cornice[0] + 0.01]]),
  rev([[0, H.cornice[0]], [R.upper, H.cornice[0]], [R.cornice, H.cornice[1]], [R.cornice, H.cornice[2]], [0, H.cornice[2]]]),
]);

// ---------- dak, dakkapellen en kapje ----------
const roof = solidRev([[R_ROOF + 0.05, H.cornice[2] - 0.3], [R_ROOF, H.cornice[2]], [R.cap, roofZ(R.cap)]]);
const cap = solidRev([[R.cap, roofZ(R.cap) - 0.5], [R.cap, H.capTop], [0.001, H.capTop + R.cap]]);
// Dakkapel (gebouwd naar +X, vier stuks op de gevelrichtingen; luchtfoto): voorgevel op 5,1 m, 1,8 m breed, van de
// kroonlijst tot 44,4 m met een segmentfronton tot 45,05 m, dak met dezelfde boog tot in de kegel; venster van 0,9 m.
const DORMER = { face: 5.1, back: 3.0, half: 0.9, eaves: 44.4, top: 45.05 };
const dormerArc = Array.from({ length: 9 }, (_, k) => {
  const s = -1 + k / 4;
  return [s * DORMER.half, DORMER.eaves + (DORMER.top - DORMER.eaves) * (1 - s * s)];
});
const dormer = hull([
  ...[DORMER.back, DORMER.face].flatMap((x) => [[x, -DORMER.half, H.cornice[2] - 0.3], [x, DORMER.half, H.cornice[2] - 0.3], ...dormerArc.map(([y, z]) => [x, y, z])]),
]).subtract(niche(DORMER.face, DORMER.face, 0.9, H.cornice[2] + 0.05, 43.75, { rise: 0.4 }));
const top = union([roof, cap, ...around(dormer, every(4))]);

const tower = union([base, shaftAll, reservoir, top]);

await writeLandmark({
  slug: "watertoren-scherpenisse",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-reservoir-dak-en-dakkapellen", tower]],
  catalog: {
    name: "Watertoren Scherpenisse",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [0, 8], [-9.5, 0], [0, -8.5]],
    // Ellipsoïdisch: de laagste PDOK-terreinhoogte op de groundSamplePoints.
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0716100000106925"],
    description:
      "Oorsprong op het hart van het achtkante BAG-pand op het maaiveld (NAP circa 0 m), +X naar RD-richting 3,5 graden (een gevel), ingang in de zuidgevel (-Y). Achtkante onderbouw van 11,3 m met bordes, ingang en vensters in een omlijsting met segmentfronton, geprofileerde lijst op 7,0 m; taps toelopende achtkante schacht in vier geledingen met verdiepte velden tussen hoekkolommen en vensters; uitkraging naar het ronde reservoir met band en kroonlijst van 12,2 m tot 42,9 m; kegeldak van 58 graden met vier dakkapellen en een kapje tot 52,35 m. Maten uit BAG, AHN, 3D BAG en foto's.",
    realWorld: {
      built: "1922-1923",
      architect: "N.V. MABEG (Mobeg), Utrecht",
      contractor: "Z.N. Beton Mij., 's-Hertogenbosch",
      publishedHeightM: 52.4,
      reservoirM3: 350,
      monument: 496127,
      groundNapM: NAP0,
      ahnCorniceNapM: 42.9,
      ahnRoofApexNapM: 50.55,
      ahnTopNapM: 52.44,
      plinthAcrossFlatsM: 2 * A.plinth,
      shaftAcrossFlatsM: [2 * A.shaftFoot, 2 * A.shaftTop],
      reservoirDiameterM: [2 * R.lower, 2 * R.upper],
      corniceDiameterM: 2 * R.cornice,
      corniceM: H.cornice[2],
      roofPitchDeg: 58,
      topM: +(H.capTop + R.cap).toFixed(2),
      photoScaleMPerPx: 0.035,
      minimumPartM: 0.9,
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/496127 (1922-1923, N.V. Mobeg Utrecht, beton, achtkant op acht kolommen met verdiepte velden, drie banden, geprofileerde lijst, ingang en vensters met segmentfronton, reservoir 350 m³ met overstekende kroonlijst, kegeldak met dakkapellen)",
      "https://nl.wikipedia.org/wiki/Watertoren_(Scherpenisse) (1922, MABEG, 52,4 m, 350 m³, woonhuis sinds 1996)",
      "https://commons.wikimedia.org/wiki/File:Karakteristieke_landschappen,_watertorens,_Bestanddeelnr_164-0197.jpg (Nationaal Archief, van opzij: geledingen, velden, reservoir, dak met dakkapellen)",
      "https://commons.wikimedia.org/wiki/File:Scherpenisse_Watertoren_6921.JPG (2008, voor de ingang: bordes, omlijsting, lijst, uitkraging, kroonlijst, kapje)",
      "https://commons.wikimedia.org/wiki/File:Scherpenisse_-_molen_De_Korenbloem_kaalgezet.jpg (silhouet met de spits van verre)",
      "PDOK BAG-pand 0716100000106925, 3D BAG (LoD2.2, AHN5), AHN DSM/DTM 0,5 m, luchtfoto Actueel_orthoHR en PDOK-terrein, 2026-11-06",
    ],
  },
});

// Watertoren aan de Amsterdamsestraatweg 380 in Utrecht. Gebouwd in 1916-1918 voor de Utrechtsche Waterleiding Maatschappij
// naar ontwerp van W.K. de Wijs, in de stijl van de Amsterdamse School; reservoir van 1000 m³, rijksmonument 514465. Sinds
// 2020-2022 appartementen met horeca op de begane grond (Zecc Architecten), met een nieuw zestienkantig dak met lantaarn.
// Een ronde toren geheel in baksteen: een plint met een stenen waterlijst, een schacht met acht pilasters en daartussen
// spaarvelden met sleufvensters, een portiekvormige stenen ingang aan de noordoostkant met daarboven een erker, een
// getrapte, licht uitkragende overgang naar het reservoir, een vensterring met korte pilasters, het reservoir met zestien
// sleufvensters, een tweede vensterring, een kroonlijst en een zestienkantig dak met een glazen band, lantaarn en spits.
//
// Oorsprong op het hart van de cirkel van BAG-pand 0344100000029262 (straal 5,82 m). Lokale X-as = RD-oost, Y = RD-noord;
// hoeken hieronder in graden linksom vanaf oost. Maaiveld AHN-DTM NAP +1,70. Maten: dak en lantaarn uit het AHN5 (via de
// 3D BAG, 2023: dakvoet NAP +37,8 op 5,8 m, lantaarn NAP +41,4 tot +43,0 op 2,0 tot 2,9 m, top NAP +45,3) en de PDOK-
// reconstructie (top 43,75 m boven het maaiveld); de dakvoet op 5,9 m en de lantaarn op 2,6 m ook uit de luchtfoto. Het
// AHN-DSM van de WCS (AHN4) is tijdens de verbouwing gevlogen (steiger rond de top, voorlopig dak) en is voor de top niet
// gebruikt. Alle hoogtes onder de kroonlijst uit de RCE-foto 20339930 (1996, recht van voren met een verschuifbaar
// objectief), lineair geschaald van het maaiveld tot de kroonlijst op 35,4 m; het dak en de vensters van de bovenste ring
// zoals na de verbouwing (foto "Watertoren Amsterdamsestraatweg Utrecht.jpg", 2021). De straal van de mantel uit de
// luchtfoto (kroonlijst 6,4 m) en de breedteverhoudingen op de RCE-foto (schacht/reservoir 0,93).
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [134984.88, 457267.3];
const AXIS = [1, 0];
const GROUND_NAP = 1.7;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 45,02, noord 45,05, west 45,21, zuid 45,20,
// noordoost voor de ingang 44,93), gemeten 2026-11-06. Het PDOK-pand staat op 44,93.
const GROUND_ELLIPSOID = 44.93;

const rad = (deg) => (deg * Math.PI) / 180;
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (start, step, n) => Array.from({ length: n }, (_, k) => start + step * k);
const ngon = (r, z, n = 16, phase = 0) => Array.from({ length: n }, (_, k) => {
  const a = rad(phase + (360 / n) * k);
  return [r * Math.cos(a), r * Math.sin(a), z];
});
// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder
// 56 graden op.
const niche = (f, w, z0, z1, depth = 0.35) => {
  const a = f - depth, b = f + 0.4, za = z1 + 1.5 * depth, zb = z1 - 0.6;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// Korte pilaster van r0 tot r1 (normaal +X), breedte w, van z0 tot z1, met een onderkant van 45 graden.
const pilaster = (r0, r1, w, z0, z1) =>
  hull([[r0, -w / 2, z0 - (r1 - r0)], [r0, w / 2, z0 - (r1 - r0)], [r1, -w / 2, z0], [r1, w / 2, z0], [r0, -w / 2, z1], [r0, w / 2, z1], [r1, -w / 2, z1], [r1, w / 2, z1]]);

// ---------- hoogtes boven het maaiveld (NAP +1,70) ----------
const H = {
  plinth: 5.5, // plint tot de stenen waterlijst (RCE-foto)
  waterTable: 5.6,
  waterTableTop: 5.85,
  shaft: 6.15, // schuine afdekking van de waterlijst naar de schacht
  corbel: 20.7, // begin van de getrapte overgang naar het reservoir
  band1: 22.6, // stenen band onder de onderste vensterring
  ring1: 22.8,
  band2: 24.4, // stenen band boven de onderste vensterring
  reservoir: 24.7,
  band3: 31.6, // stenen band onder de bovenste vensterring
  ring2: 31.8,
  band4: 33.6,
  frieze: 33.8, // gemetseld fries met tandlijst onder de kroonlijst
  cornice: 34.5,
  corniceTop: 35.4, // bovenkant kroonlijst; daarop de glazen band
  eave: 36.4, // dakvoet boven de glazen band (AHN5 NAP +37,8 op 5,8 m)
  lantern: 40.0, // voet van de lantaarn (AHN5 NAP +41,4 op 2,9 m)
  lanternTop: 41.25,
  lanternEave: 41.55, // dakrand van de lantaarn (AHN5 NAP +43,0 op 2,0 m)
  apex: 43.7, // spits (AHN5 NAP +45,3; PDOK 43,75 m boven het maaiveld)
  portal: 3.9, // stenen portiek: kroonlijst
  portalRidge: 4.4, // schuine bovenkant met het opschrift
  erker: 19.0, // onderkant van de voorkant van de erker boven de ingang (foto 2012, van opzij)
  erkerWall: 18.0, // daar loopt de onderkant van de erker in de muur (bij straal 5,4 m)
};
const R = {
  plinth: 5.9, // BAG-cirkel 5,82 m
  waterTable: 6.0,
  shaft: 5.7, // muur van de schacht
  pilaster: 5.95,
  reservoir: 6.15,
  band: 6.25,
  cornice: 6.4, // luchtfoto: buitenrand 12,8 tot 13,2 m
  glass: 5.65, // glazen band, terug achter de kroonlijst
  eave: 5.9, // luchtfoto: dakrand 11,7 m
  lantern: 2.55,
  lanternRoof: 2.75,
  lanternEave: 2.8,
};
const DOOR_DEG = 46.6; // ingang aan de noordoostkant, haaks op de rooilijn van de Amsterdamsestraatweg (BAG-gevels 136,6 graden)
const BAYS = every(DOOR_DEG + 11.25, 22.5, 16); // vensters van de ringen en het reservoir
const POSTS = every(DOOR_DEG, 22.5, 16); // korte pilasters tussen de vensters van de ringen
const PANELS = every(DOOR_DEG, 45, 8); // spaarvelden van de schacht, het eerste boven de ingang
const SHAFT_PILASTERS = every(DOOR_DEG + 22.5, 45, 8);

// ---------- toren: één omwentelingsprofiel van plint tot dakvoet ----------
const tower = rev([
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.waterTable, H.waterTable], [R.waterTable, H.waterTableTop],
  [R.shaft, H.shaft],
  // getrapte overgang: drie lagen met een onderkant van 45 graden
  [R.shaft, H.corbel], [5.85, 20.85], [5.85, 21.25], [5.97, 21.37], [5.97, 21.8], [6.09, 21.92], [6.09, 22.3], [R.reservoir, 22.36],
  [R.reservoir, H.band1 - 0.1], [R.band, H.band1], [R.band, H.ring1], [R.reservoir, H.ring1],
  [R.reservoir, H.band2 - 0.1], [R.band, H.band2], [R.band, H.reservoir], [R.reservoir, H.reservoir],
  [R.reservoir, H.band3 - 0.1], [R.band, H.band3], [R.band, H.ring2], [R.reservoir, H.ring2],
  [R.reservoir, H.band4 - 0.1], [R.band, H.band4], [R.band, H.frieze], [R.reservoir, H.frieze],
  [R.reservoir, H.cornice - 0.25], [R.cornice, H.cornice], [R.cornice, H.corniceTop],
  [R.glass, H.corniceTop], [R.glass, H.eave - 0.25], [R.eave, H.eave], [0, H.eave],
]);
// Dak: zestienkantig, onderste vlakken onder 49 graden tot de lantaarn, lantaarn, rand en spits onder 40 graden.
const roof = union([
  hull([...ngon(R.eave, H.eave - 0.01), ...ngon(R.lanternRoof, H.lantern)]),
  hull([...ngon(R.lantern, H.lantern - 0.05), ...ngon(R.lantern, H.lanternTop)]),
  hull([...ngon(R.lantern, H.lanternTop - 0.05), ...ngon(R.lanternEave, H.lanternEave)]),
  hull([...ngon(R.lanternEave, H.lanternEave - 0.01), [0, 0, H.apex]]),
]);
// Acht pilasters op de schacht, van de waterlijst tot in de getrapte overgang.
const shaftPilasters = union(around(prism([[5.5, -0.45], [R.pilaster, -0.45], [R.pilaster, 0.45], [5.5, 0.45]], 5.6, 21.3), SHAFT_PILASTERS));
// Korte pilasters tussen de vensters van beide ringen.
const posts = union([
  ...around(pilaster(6.0, 6.35, 0.9, H.ring1, H.band2 - 0.1), POSTS),
  ...around(pilaster(6.0, 6.35, 0.9, H.ring2, H.band4 - 0.1), POSTS),
]);
// Stenen portiek aan de noordoostkant (3,6 m breed, 1,1 m voor de plint) met een schuine bovenkant.
const portal = place(union([
  prism([[5.0, -1.8], [7.0, -1.8], [7.0, 1.8], [5.0, 1.8]], BASE, H.portal),
  hull([[5.0, -1.8, H.portal - 0.01], [7.0, -1.8, H.portal - 0.01], [5.0, 1.8, H.portal - 0.01], [7.0, 1.8, H.portal - 0.01], [5.0, 0, H.portalRidge], [7.0, 0, H.portalRidge]]),
]), { deg: DOOR_DEG });
// Erker boven de ingang, onder het reservoir: 4,2 m breed, tot de straal van het reservoir uit de schacht; de onderkant
// loopt onder 53 graden terug naar de muur (op de foto's een holle console).
const erker = place(hull([
  [5.4, -2.1, H.erkerWall], [5.4, 2.1, H.erkerWall], [R.reservoir, -2.1, H.erker], [R.reservoir, 2.1, H.erker],
  [5.4, -2.1, H.band1], [5.4, 2.1, H.band1], [R.reservoir, -2.1, H.band1], [R.reservoir, 2.1, H.band1],
]), { deg: DOOR_DEG });

// ---------- vensters en deur als blinde nissen ----------
// - schacht: per spaarveld een rij van zes sleufvensters (0,9 m breed), boven de ingang vijf tot onder de erker;
// - onderste ring: zestien vierkante vensters, reservoir: zestien sleufvensters, bovenste ring: zestien grote vensters
//   (na de verbouwing), alle op dezelfde hoeken, met de korte pilasters ertussen;
// - erker: één venster; portiek: de deur.
const slit = (n) => union(every(6.6, 2.2, n).map((z) => niche(R.shaft, 0.9, z, z + 1.5)));
const openings = union([
  place(slit(5), { deg: PANELS[0] }), // boven de ingang eindigt de rij onder de erker
  ...around(slit(6), PANELS.slice(1)),
  ...around(niche(R.reservoir, 0.9, 23.15, 24.05), BAYS),
  ...around(niche(R.reservoir, 0.9, 25.3, 30.9), BAYS),
  ...around(niche(R.reservoir, 1.1, 32.0, 33.3), BAYS),
  place(niche(R.reservoir, 2.0, 19.9, 21.9), { deg: DOOR_DEG }),
  place(niche(7.0, 1.6, 0, 2.7), { deg: DOOR_DEG }),
]);

const all = union([tower, roof, shaftPilasters, posts, portal, erker]).subtract(openings);

await writeLandmark({
  slug: "watertoren-utrecht-amsterdamsestraatweg-380",
  base: BASE,
  nodes: [["building:watertoren-plint-schacht-erker-reservoir-vensterringen-en-dak-met-lantaarn", all]],
  catalog: {
    name: "Watertoren Amsterdamsestraatweg",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [0, 8], [-8, 0], [0, -8], [5.5, 5.81]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000029262"],
    description:
      "Oorsprong op het hart van de ronde BAG-voetafdruk (straal 5,82 m) op het maaiveld (NAP +1,70 m), X-as naar RD-oost. Bakstenen plint tot 5,85 m met stenen waterlijst en portiek aan de noordoostkant; schacht (straal 5,7 m) met acht pilasters en spaarvelden met sleufvensters, erker boven de ingang; getrapte overgang tot 22,6 m; onderste vensterring, reservoir (straal 6,15 m) met zestien sleufvensters en bovenste vensterring met pilasters tussen stenen banden; kroonlijst tot 35,4 m; zestienkantig dak met glazen band, lantaarn en spits tot 43,7 m. Maten uit BAG, AHN5, luchtfoto en foto's.",
    realWorld: {
      built: "1916-1918",
      architect: "W.K. de Wijs (Utrechtsche Waterleiding Maatschappij)",
      rijksmonument: 514465,
      publishedHeightM: 43.5,
      reservoirM3: 1000,
      ahnGroundNapM: GROUND_NAP,
      ahn5EaveNapM: 37.8,
      ahn5TopNapM: 45.3,
      plinthRadiusM: R.plinth,
      plinthM: H.waterTableTop,
      shaftRadiusM: R.shaft,
      shaftPilasters: 8,
      corbelM: [H.corbel, H.band1],
      reservoirRadiusM: R.reservoir,
      lowerWindowRingM: [H.ring1, H.band2],
      reservoirM: [H.reservoir, H.band3],
      upperWindowRingM: [H.ring2, H.band4],
      corniceRadiusM: R.cornice,
      corniceTopM: H.corniceTop,
      eaveM: H.eave,
      lanternM: [H.lantern, H.lanternEave],
      topM: H.apex,
      roofSides: 16,
      entranceDegrees: DOOR_DEG,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Utrecht_Amsterdamsestraatweg_380) (omstreeks 1917, W.K. de Wijs, Amsterdamse School, 43,5 m, reservoir 1000 m³; nieuw dak na 2013, 2020-2022 appartementen en horeca door Zecc Architecten)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/514465 (42 m, ronde plattegrond, 16-kantig kegeldak met lantaarn; portiekvormige ingang aan de noordoostzijde met muurtjes; schacht met 8 pilasters en spaarvelden met sleufvensters; iets uitkragend reservoir met 16 sleufvensters; vensterringen met vierkante vensters tussen korte pilasters onder en boven het reservoir; erker boven de ingang)",
      "https://commons.wikimedia.org/wiki/Category:Water_tower_(Amsterdamsestraatweg_Utrecht) (Exterieur OVERZICHT WATERTOREN NAAR ONTWERP VAN W.K. DE WIJS (1916-1918) - Utrecht - 20339930 - RCE.jpg, Ingang - Utrecht - 20235334 - RCE.jpg, Watertoren Amsterdamsestraatweg Utrecht.jpg (2021), Watertoren Utrecht Amsterdamsestraatweg 380 dichtbij.jpg, ... veraf.jpg (2012), Watertoren Amsterdamsestraatweg.jpg)",
      "3D BAG NL.IMBAG.Pand.0344100000029262 (LoD2.2 uit AHN5, 2023), PDOK BAG-pand 0344100000029262, AHN DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

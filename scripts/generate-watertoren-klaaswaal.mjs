// Watertoren van Klaaswaal (gemeente Hoeksche Waard), Oranjestraat. Gebouwd in 1929 naar ontwerp van A. Visser; 38 m
// hoog, reservoir van 400 m³ (Wikipedia). Geen rijksmonument. Een zeskante, sterk verjongende bakstenen schacht met
// betonnen lisenen op de zes hoeken, een uitkragende betonband op ongeveer 4,5 m en een tweede band onder een rij kleine
// vensters onder het reservoir; het ronde reservoir kraagt in het midden van elke zijde uit boven de vlakke gevels (op de
// hoeken loopt het gelijk met de lisenen door), met een betonnen voetlijst, bakstenen velden tussen de doorlopende
// lisenen en een zware betonnen kroonlijst; daarboven een teruggezette trommel met kleine openingen, een flauw kegeldak
// met een dopje en een windvaan. Op het reservoir hangen antennes van een zendmast.
//
// Oorsprong op het middelpunt van de ronde BAG-voetafdruk van pand 0611100000614296 (cirkelfit op 36 hoekpunten,
// straal 5,64 m, alle punten tussen 5,56 en 5,72 m): de BAG-cirkel gaat door de hoeken met hun lisenen. Lokale X-as naar
// RD-oost; de hoeken van de zeskant staan op 0, 60, ..., 300 graden (de luchtfoto toont aan de noordkant een vlakke zijde
// met lisenen op ongeveer +-30 graden van het noorden). Maaiveld AHN-DTM NAP +0,7 (west- en zuidkant, ring van 6 tot
// 8 m); aan de noordoostkant ligt een verdiept stuk bestrating op NAP 0,0, vandaar de diepe onderkant.
// Hoogtes uit het AHN-DSM (0,5 m) min dat maaiveld: rand van de kroonlijst NAP +35,2 op 5 m uit het hart, kegel van
// 29 graden (NAP +36,6 op 3,5 m, +38,0 op 1 m), dopje NAP +38,3 en windvaan NAP +40,9 in de middelste pixels; 3D BAG
// (AHN5): dak min NAP +34,2, nok +38,5. Kroonlijst, reservoir, voetlijst, vensterrij en band onder het reservoir van
// "Overzicht met de watertoren en het verdeelstation - Klaaswaal - 20413818 - RCE.jpg" (19 px per m, geschaald op de
// kroonlijst van 10 m); de onderste band, de vensters in de schacht en de vensters aan de voet van "Klaaswaal -
// watertoren van dichtbij.jpg" (2009). De zeskant blijkt uit de rechte banden met een knik op de lisenen en uit het
// ondervlak van het reservoir dat midden in elke zijde zichtbaar uitkraagt.
import { Manifold, CrossSection, ccw, hull, union, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [90153.77, 420399.54];
const AXIS = [1, 0];
const GROUND_NAP = 0.7;
// Dieper dan gewoonlijk: aan de noordoostkant ligt het PDOK-terrein tot 0,6 m onder de groundHeight (verdiepte stoep).
const BASE = -0.8;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (west 44,635, zuidwest 44,602, zuid 44,542,
// noordwest 44,491, zuidoost 44,603), gemeten 2026-11-06. Het PDOK-pand staat op 44,03 met de top op 82,5.
const GROUND_ELLIPSOID = 44.491;

// ---------- maten (meters boven het maaiveld, stralen vanaf het hart) ----------
const R = {
  foot: 5.45, // hoek van de zeskante schacht (baksteenvlak) op het maaiveld; met de lisene 5,65 = BAG-cirkel
  shaftTop: 4.6, // hoek van de schacht onder het reservoir = straal van het reservoir
  pilaster: 0.2, // lisenen steken 0,2 m buiten de hoek uit
  band: 0.2, // uitkraging van de onderste band
  band2: 0.15, // band onder de vensterrij
  ledge: 4.8, // voetlijst van het reservoir
  cornice: 5.0, // kroonlijst (AHN 4,9 tot 5,0)
  drum: 4.3, // teruggezette trommel onder het kegeldak
  cap: 0.7, // dopje op de kegel
  vane: 0.45, // voet van de windvaan
};
const H = {
  band: [4.4, 5.0], // onderste band (foto 2009)
  band2: [24.5, 25.1], // band onder de vensterrij (RCE-foto 25,45 tot 26,1; iets omlaag zodat de nissen onder het reservoir vrij blijven)
  windows: [25.35, 26.25], // kleine vensters onder het reservoir; het nisplafond blijft onder het ondervlak (26,79)
  shaftTop: 27.65, // onderkant van de voetlijst van het reservoir
  ledgeTop: 28.55,
  cornice: [32.85, 34.0], // kroonlijst (3D BAG dak min NAP +34,2; AHN rand NAP +35,2)
  drumTop: 35.45, // voet van de kegel (AHN 29 graden door NAP +36,6 op 3,5 m)
  cone: 37.43, // top van de kegel op het dopje
  cap: 37.85,
  capRoof: 38.0,
  top: 40.2, // windvaan (AHN NAP +40,9)
};

const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
const cornerR = (z) => R.foot + ((R.shaftTop - R.foot) * z) / H.shaftTop; // hoekstraal van de zeskant op hoogte z
const COS30 = Math.cos(Math.PI / 6);
const hexPts = (r, z) => Array.from({ length: 6 }, (_, k) => [r * Math.cos((k * Math.PI) / 3), r * Math.sin((k * Math.PI) / 3), z]);
const circlePts = (r, z, n = SEG) => Array.from({ length: n }, (_, k) => [r * Math.cos((2 * k * Math.PI) / n), r * Math.sin((2 * k * Math.PI) / n), z]);
// Zeskante afgeknotte piramide van z0 tot z1 met de hoekstraal van de schacht plus dr loodrecht op de gevels.
const hexFrustum = (z0, z1, dr = 0) => hull([...hexPts(cornerR(z0) + dr / COS30, z0), ...hexPts(cornerR(z1) + dr / COS30, z1)]);

// Nis in een gevel met normaal +X op afstand f, breedte w, van z0 tot z1, 0,3 m diep; het plafond loopt naar binnen
// onder 56 graden op, zodat er niets vrij hangt.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
const FACES = [30, 90, 150, 210, 270, 330];
const CORNERS = [0, 60, 120, 180, 240, 300];
// Nis midden in de zeskante gevel met hart op deg, voorkant op de apothema halverwege de nis.
const faceNiche = (deg, w, z0, z1, dy = 0) => place(niche(cornerR((z0 + z1) / 2) * COS30 - 0.02, w, z0, z1).translate([0, dy, 0]), { deg });

// ---------- schacht ----------
const shaft = hexFrustum(BASE, H.shaftTop);
// Lisenen op de hoeken: 0,9 m breed, 0,2 m buiten de hoek, van de voet tot de kroonlijst (op het reservoir verticaal).
const pilasterAt = (deg) => {
  const pts = [];
  for (const z of [BASE, H.shaftTop]) for (const [rr, t] of [[cornerR(z) + R.pilaster, 0.45], [cornerR(z) - 0.8, 0.45]]) pts.push([rr, -t, z], [rr, t, z]);
  const lower = hull(pts);
  const upper = hull([[R.shaftTop + R.pilaster, -0.45, H.shaftTop], [R.shaftTop + R.pilaster, 0.45, H.shaftTop], [R.shaftTop - 0.8, -0.45, H.shaftTop], [R.shaftTop - 0.8, 0.45, H.shaftTop],
    [R.shaftTop + R.pilaster, -0.45, H.cornice[0]], [R.shaftTop + R.pilaster, 0.45, H.cornice[0]], [R.shaftTop - 0.8, -0.45, H.cornice[0]], [R.shaftTop - 0.8, 0.45, H.cornice[0]]]);
  return place(lower.add(upper), { deg });
};
const pilasters = CORNERS.map(pilasterAt);
// Banden met een ondervlak van 45 graden.
const band = (z0, z1, dr) => hull([...hexPts(cornerR(z0 - dr), z0 - dr), ...hexPts(cornerR(z0) + dr / COS30, z0), ...hexPts(cornerR(z1) + dr / COS30, z1)]);
const bands = [band(...H.band, R.band), band(...H.band2, R.band2)];

// ---------- reservoir, kroonlijst, trommel en dak ----------
// Het ronde reservoir kraagt midden in elke zijde 0,8 m uit boven de vlakke gevels: ondervlak van 44 graden van de
// zeskant naar de voetlijst.
const soffitZ = H.shaftTop - 0.86;
const soffit = hull([...hexPts(cornerR(soffitZ), soffitZ), ...circlePts(R.ledge, H.shaftTop)]);
const top = solidRev([
  [R.ledge, H.shaftTop - 0.01],
  [R.ledge, H.ledgeTop], // voetlijst
  [R.shaftTop, H.ledgeTop],
  [R.shaftTop, H.cornice[0] - (R.cornice - R.shaftTop)], // bakstenen reservoirwand
  [R.cornice, H.cornice[0]], // kraag van 45 graden onder de kroonlijst
  [R.cornice, H.cornice[1]],
  [R.drum, H.cornice[1]],
  [R.drum, H.drumTop], // trommel
  [R.cap, H.cone], // kegeldak van 29 graden
  [R.cap, H.cap], // dopje
  [R.vane, H.capRoof],
  [0.0001, H.top], // windvaan als naald
]);

// ---------- vensters en deur als blinde nissen ----------
// Deur (1,3 m) in de oost-noordoostzijde, naar de verdiepte stoep; de stand is onzeker (niet op de foto's).
const DOOR_DEG = 30;
const door = faceNiche(DOOR_DEG, 1.3, 0, 2.5);
// Vensters aan de voet (foto 2009: één per zijde, 1,2 m breed) in de vijf andere zijden.
const footWindows = FACES.filter((d) => d !== DOOR_DEG).map((d) => faceNiche(d, 1.2, 1.2, 2.4));
// Trappenhuisvensters in de schacht (foto: 0,45 m breed, hier 0,9 m), om en om op 17,5 m en op 11 en 23 m.
const shaftWindows = FACES.flatMap((d, k) => (k % 2 ? [[10.5, 12.5], [22.0, 24.0]] : [[16.5, 18.5]]).map(([z0, z1]) => faceNiche(d, 0.9, z0, z1)));
// Rij kleine vensters onder het reservoir: vier per zijde (foto zes kleinere).
const smallWindows = FACES.flatMap((d) => [-1.65, -0.55, 0.55, 1.65].map((dy) => faceNiche(d, 0.9, ...H.windows, dy)));
// Trommel: twaalf kleine openingen als nis.
const drumOpenings = Array.from({ length: 12 }, (_, k) => place(niche(R.drum, 0.9, H.cornice[1] + 0.35, H.drumTop - 0.4, 0.3), { deg: 15 + 30 * k }));

const all = union([shaft, ...pilasters, ...bands, soffit, top]).subtract(union([door, ...footWindows, ...shaftWindows, ...smallWindows, ...drumOpenings]));

await writeLandmark({
  slug: "watertoren-klaaswaal",
  base: BASE,
  nodes: [["building:watertoren-zeskante-schacht-reservoir-kroonlijst-en-kegeldak", all]],
  catalog: {
    name: "Watertoren Klaaswaal",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-6.5, 0], [-4.6, -4.6], [0, -6.5], [-4.6, 4.6], [4.6, -4.6]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0611100000614296"],
    description:
      "Oorsprong op het middelpunt van de ronde BAG-voetafdruk (straal 5,64 m, door de hoeken) op het maaiveld (NAP +0,7 m), X-as naar RD-oost, hoeken van de zeskant op 0, 60, ..., 300 graden. Zeskante bakstenen schacht die verjongt van 5,45 tot 4,6 m hoekstraal op 27,65 m, met betonnen lisenen op de hoeken, een band op 4,4 tot 5,0 m en een band op 24,5 m, een deur, vensters aan de voet, trappenhuisvensters en een rij kleine vensters onder het reservoir als nissen; rond reservoir (4,6 m) dat midden in elke zijde 0,8 m uitkraagt met een ondervlak van 44 graden, voetlijst, kroonlijst van 10 m op 32,85 tot 34,0 m, trommel met twaalf openingen, kegeldak van 29 graden tot 37,43 m, dopje en windvaan tot 40,2 m. Maten uit BAG, AHN, 3D BAG en foto's.",
    realWorld: {
      built: 1929,
      architect: "A. Visser",
      publishedHeightM: 38,
      reservoirM3: 400,
      ahnGroundNapM: GROUND_NAP,
      ahnCorniceNapM: 35.2,
      ahnConeNapM: [36.6, 38.0],
      ahnVaneNapM: 40.9,
      footCornerRadiusM: R.foot + R.pilaster,
      shaftTopCornerRadiusM: R.shaftTop,
      reservoirDiameterM: 2 * R.shaftTop,
      corniceDiameterM: 2 * R.cornice,
      corniceM: H.cornice,
      coneTopM: H.cone,
      topM: H.top,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Klaaswaal) (1929, A. Visser, 38 m, 400 m³)",
      "Wikimedia Commons: Klaaswaal - watertoren van dichtbij.jpg (2009); Overzicht met de watertoren en het verdeelstation - Klaaswaal - 20413818 - RCE.jpg; Klaaswaal - watertoren en omgeving.jpg",
      "PDOK BAG-pand 0611100000614296, AHN DSM/DTM 0,5 m, luchtfoto (Actueel_orthoHR) en 3D BAG (AHN5, 2024), 2026-11-06",
    ],
  },
});

// Watertoren aan de 's-Gravenpolderseweg in Goes, in 1912 gebouwd door de firma Carl Francke uit Bremen; volgens Wikipedia
// 63 m hoog (de hoogste van Zeeland) met een reservoir van 1250 m³, rijksmonument 16286: "de eerste stalen watertoren in
// Nederland. Open stalen constructie, waarop een stalen waterreservoir is gemonteerd." Sinds 1999 kantoren, sinds 2021 ook
// drie appartementen in het reservoir. Een open vakwerk van acht licht schuine poten met kruisverbanden en een kern met de
// trap in het midden, daarop een bolle reservoirbodem, een cilinder met vensterstroken, een brede uitlopende rand, een
// kegeldak met twee dakkapelletjes, een achtkante lantaarn en een holle koperen spits. Onder het vakwerk een glazen
// begane grond met de ingang en een luifel aan de straatkant.
//
// Oorsprong op het hart van het reservoir in het AHN-DSM (cirkelfit op de rand boven 20 en 30 m, de spits in hetzelfde
// punt) op het maaiveld: AHN-DTM NAP +1,17. BAG-pand 0664100000008428 is een cirkel van 8,0 m straal waarvan het hart
// 0,7 m noordelijker ligt. +X op RD 7 graden: daar staat een poot (poten op 7 + k·45 graden, uit de luchtfoto: de voeten
// op 52 en 97 graden zijn het duidelijkst). De ingang ligt tussen de poten op 52 en 97 graden, naar de straat.
// Maten: uit het AHN-DSM 0,5 m (ringmaxima rond het hart): rand van het dak 8,75 m op 44,2 m, kegeldak tot 49,3 m bij
// 3,2 m, lantaarn tot 52,5 m bij 2,5 à 3 m, spits tot NAP +62,32 (61,2 m). De opstand uit de foto "Watertoren - Goes -
// 20079328 - RCE.jpg" (Commons, rechte verticalen, vanaf circa 87 m van onderaf), 19,9 px/m in het vlak door de as
// (randbreedte 17,2 m; maaiveld tot de bol 61,3 m, het AHN geeft 61,2): breedtes van poten (onderaan 13,1 m), ring,
// cilinder (15,2 m), rand en spits. De hoogtes van ring, bodem, cilinder en rand uit de voorste punten van hun cirkels
// (de omtrek aan de zijkant van een onderkant die je van onderaf ziet, ligt te laag), omgerekend met de afstand die volgt
// uit de voor- en zijkant van de bovenrand: ring 30,6, cilinder 35,8 tot 42,2 à 42,5, rand tot 44,25 m. Aantallen en plaats van vensters, ronde vensters en dakkapellen, de begane grond en de luifel zijn uit
// foto's van 2008 tot 2024 en de luchtfoto geschat.
// Printbaar op 1:1000: poten, kruisen en kern van 0,9 m of meer; kruisen onder 53 tot 57 graden; bodem en trechter onder
// de bodem 46,5 graden; vensters en luiken als blinde nissen met een plafond van 56 à 63 graden; luifel met een onderkant
// van 50 graden.
import { Manifold, CrossSection, ccw, hull, union, prism, place, circle, ring3, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [52118.3, 390488.25];
const DEG = 7;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 1.17;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06 (zie GROUND_SAMPLES). Het
// PDOK-pand staat op 45,41. Op (9, 0) 45,55, (6,4, 6,4) 45,54, (0, 9) 45,50, (-6,4, 6,4) 45,51, (-9, 0) 45,56, (-6,4, -6,4)
// 45,56, (0, -9) 45,51 en (6,4, -6,4) 45,42; binnen de poten ligt een terreinvlak op 45,9.
const GROUND_ELLIPSOID = 45.421;
const GROUND_SAMPLES = [[9, 0], [6.4, 6.4], [0, 9], [-6.4, 6.4], [-9, 0], [-6.4, -6.4], [0, -9], [6.4, -6.4]];

const rad = (deg) => (deg * Math.PI) / 180;
const rev = (pts, seg = SEG) => Manifold.revolve(new CrossSection([ccw(pts)]), seg);
// Achthoek met hoekpunten op 0, 45, ... graden (zijden op 22,5 + k·45) en apothema a.
const oct = (a) => circle([0, 0], a / Math.cos(Math.PI / 8), 8, 0);

// ---------- hoogtes en stralen ----------
const H = {
  ground: 3.6, // dak van de glazen begane grond (foto 2024)
  canopy: [3.3, 4.2], // luifel: onderkant voorkant, bovenkant
  storey: 5.95, // vijf verdiepingen kruisen tot 29,75 (in werkelijkheid circa zeven ringen van 4,4 m)
  legTop: 30.9, // poten lopen in de bodem
  bottom: 30.6, // ring onder de bolle bodem (foto)
  cylinder: [35.8, 42.2], // cilinder (foto)
  rim: [43.71, 44.25], // onderkant van de rechte rand, bovenkant van de rand (AHN 44,2 à 44,3)
  roofFoot: 45.4, // knik van de rand naar het kegeldak (AHN)
  roofTop: 49.35, // kegeldak bij de lantaarn (AHN)
  lantern: [52.0, 52.4], // lantaarn: bovenkant van de wand, bovenkant van de lijst (AHN 52,3 à 52,6)
  top: 61.3, // top van de spits met de bol (foto; AHN NAP +62,32 = 61,2 m)
};
const R = {
  core: 1.4, // kern met trap en lift (foto 2024: circa 3 m breed)
  ring: 5.8, // ring onder de bodem
  cylinder: 7.62, // cilinder 15,2 m (foto)
  rim: 8.72, // rand 17,4 m (foto 8,72, AHN 8,75)
  ledge: 7.9, // binnenkant van de vlakke bovenkant van de rand (AHN)
  roofTop: 3.2,
  lantern: 2.7, // omgeschreven straal van de achtkante lantaarn (foto 5,1 m breed, AHN 2,5 à 3 m)
};
const LEG_FOOT = 6.15; // hart van de poten aan de voet (foto: buitenkant 13,1 m)
const LEG_TOP = 5.25; // hart van de poten onder de ring
const LEG = 0.45; // halve dikte van poten en kruisen (0,9 m, de printgrens)
const SLOPE = 0.95; // dr/dz van de trechter en het onderste deel van de bodem: 46,5 graden boven de horizontaal

// ---------- reservoir: één omwentelingsprofiel van de kern tot het kegeldak ----------
// Kern (r 1,4) van de voet tot de trechter; trechter onder 46,5 graden naar de ring (in werkelijkheid een vlakke bodem op
// een ringbalk en radiale liggers, die zonder steun niet te printen is); bolle bodem (foto: de omtrek loopt het snelst uit
// vlak boven de ring, hier begrensd op 46,5 graden); cilinder; holle uitlopende rand (foto: 1,1 m uit over circa 1,5 m,
// bovenaan begrensd op 47 graden); rechte rand; vlakke bovenkant van de rand; kegeldak (AHN: 43 graden).
const zFunnel = H.bottom - (R.ring - R.core) / SLOPE;
const tank = rev([
  [0, BASE], [R.core, BASE], [R.core, zFunnel], [R.ring, H.bottom], [6.75, H.bottom + 0.95 / SLOPE], [7.2, 32.45], [7.45, 33.3],
  [7.58, 34.3], [R.cylinder, H.cylinder[0]], [R.cylinder, H.cylinder[1]],
  [7.75, 42.6], [8.05, 43.0], [8.45, 43.42], [R.rim, H.rim[0]],
  [R.rim, H.rim[1]], [R.ledge, 44.35], [7.4, H.roofFoot], [R.roofTop, H.roofTop], [0, H.roofTop],
]);

// ---------- vakwerk: acht poten met kruisen ----------
const legR = (z) => LEG_FOOT + ((LEG_TOP - LEG_FOOT) * z) / H.legTop;
const legAt = (k, z) => { const a = rad(45 * k); return [legR(z) * Math.cos(a), legR(z) * Math.sin(a), z]; };
const legSquare = (k, z) => {
  const a = rad(45 * k), u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]], [x, y] = legAt(k, z);
  return [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([p, q]) => [x + LEG * (p * u[0] + q * v[0]), y + LEG * (p * u[1] + q * v[1]), z]);
};
const legs = Array.from({ length: 8 }, (_, k) => hull([...legSquare(k, BASE), ...legSquare(k, H.legTop)]));
// Kruis per vak en verdieping: van de voet van de ene poot naar de kop van de volgende, banden van 0,9 m (53 graden
// onderaan, 57 bovenaan). Het onderste vak aan de ingang (tussen de poten 1 en 2) blijft open.
const ENTRANCE = 67.5; // lokale richting van de ingang (RD 74,5 graden)
const braces = [];
for (let k = 0; k < 8; k++) {
  const mid = rad(45 * k + 22.5), n = [LEG * Math.cos(mid), LEG * Math.sin(mid)];
  for (let i = 0; i < 5; i++) {
    if (k === 1 && i === 0) continue;
    const z1 = H.storey * i + 0.45, z2 = H.storey * (i + 1) - 0.45;
    for (const [p, q] of [[legAt(k, z1), legAt(k + 1, z2)], [legAt(k + 1, z1), legAt(k, z2)]]) {
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
      const h = (LEG * Math.hypot(len, q[2] - p[2])) / len;
      const pts = [];
      for (const e of [p, q]) for (const dz of [-h, h]) for (const s of [-1, 1]) pts.push([e[0] + s * n[0], e[1] + s * n[1], e[2] + dz]);
      braces.push(hull(pts));
    }
  }
}

// ---------- begane grond, luifel, dakkapellen, lantaarn en spits ----------
// Glazen begane grond binnen de poten: achthoek met apothema 5,0 m tot 3,6 m.
const ground = prism(oct(5.0), BASE, H.ground);
// Luifel boven de ingang: 3,6 m breed, 1,0 m voor de gevel, voorkant 0,9 m dik, onderkant van 50 graden naar de gevel
// (in werkelijkheid een dunne plaat op twee schuine stempels).
const canopy = place(hull([
  [4.9, -1.8, H.canopy[0] - 1.2], [4.9, 1.8, H.canopy[0] - 1.2], [6.0, -1.8, H.canopy[0]], [6.0, 1.8, H.canopy[0]],
  [6.0, -1.8, H.canopy[1]], [6.0, 1.8, H.canopy[1]], [4.9, -1.8, H.canopy[1]], [4.9, 1.8, H.canopy[1]],
]), { deg: ENTRANCE });
// Twee dakkapelletjes op de rand (luchtfoto: aan de west- en de zuidoostkant; RD 180 en 333 graden), 1,4 m breed,
// goot 45,7 en nok 46,5 m, tot in het dak.
const dormer = (deg) => place(hull([
  ...[7.9, 5.8].flatMap((x) => [[x, -0.7, 44.3], [x, 0.7, 44.3], [x, -0.7, 45.7], [x, 0.7, 45.7], [x, 0, 46.5]]),
]), { deg });
const lanternPoly = circle([0, 0], R.lantern, 8, 0);
const lantern = union([
  prism(lanternPoly, H.roofTop - 0.2, H.lantern[0]),
  hull([...ring3(lanternPoly, H.lantern[0] - 0.01), ...ring3(circle([0, 0], R.lantern + 0.15, 8, 0), H.lantern[0] + 0.2),
    ...ring3(circle([0, 0], R.lantern + 0.15, 8, 0), H.lantern[1])]),
]);
// Holle achtzijdige spits (foto: 4,0 m breed op de lantaarn, per hoogte gemeten), van 52,3 tot de bol op 61,3 m.
const spire = rev([[0, H.lantern[1] - 0.1], [2.0, H.lantern[1] - 0.1], [1.75, 53.1], [1.5, 53.9], [1.23, 54.5], [0.88, 55.1],
  [0.38, 57.6], [0.16, 60.2], [0, H.top]], 8);

// ---------- vensters, ronde vensters, luiken en deur ----------
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1, plafond 63 graden naar binnen.
const niche = (f, w, z0, z1, depth = 0.3) => hull([
  [f - depth, -w / 2, z0], [f + 0.6, -w / 2, z0], [f - depth, w / 2, z0], [f + 0.6, w / 2, z0],
  [f - depth, -w / 2, z1 + 2 * depth], [f - depth, w / 2, z1 + 2 * depth], [f, -w / 2, z1], [f, w / 2, z1],
  [f + 0.6, -w / 2, z1 - 1.2], [f + 0.6, w / 2, z1 - 1.2],
]);
// Rond venster (achthoek van 0,9 m) schuin omhoog de cilinder in: as onder 56 graden door het punt (r, z) op het oppervlak.
const oculus = (r, z) => {
  const o = circle([0, 0], 0.45 / Math.cos(Math.PI / 8), 8, Math.PI / 8);
  return hull([...o.map(([y, dz]) => [r + 0.5, y, z - 0.75 + dz]), ...o.map(([y, dz]) => [r - 0.3, y, z + 0.45 + dz])]);
};
// Acht groepen van twee vensterkolommen (0,95 m breed, van 36,3 tot 40,7 m) op 22,5 + k·45 graden, met boven elke kolom
// een rond venster op 41,55 m (foto's 2008 en 2024: vensters in de oude panelen, de leuning ertussen is weggelaten).
const COLS = [-4.66, 4.66];
const windows = union(Array.from({ length: 8 }, (_, k) => COLS.map((d) => place(union([
  niche(R.cylinder, 0.95, 36.3, 40.7),
  oculus(R.cylinder, 41.55),
]), { deg: 22.5 + 45 * k + d }))).flat());
// Luiken in de lantaarn: 1,0 × 1,4 m op elke zijde.
const louvres = union(Array.from({ length: 8 }, (_, k) => place(niche(R.lantern * Math.cos(Math.PI / 8), 1.0, 50.0, 51.4), { deg: 22.5 + 45 * k })));
// Deur onder de luifel: 1,8 × 1,9 m.
const door = place(niche(5.0, 1.8, 0, 1.9), { deg: ENTRANCE });

const all = union([tank, ...legs, ...braces, ground, canopy, dormer(173), dormer(326), lantern, spire])
  .subtract(union([windows, louvres, door]))
  .trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-goes-s-gravenpolderseweg",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los reservoir zou een voet tot de grondplaat krijgen.
  nodes: [["building:watertoren-vakwerk-kern-reservoir-rand-dak-lantaarn-en-spits", all]],
  catalog: {
    name: "Watertoren 's-Gravenpolderseweg Goes",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: GROUND_SAMPLES,
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0664100000008428"],
    description:
      "Oorsprong op het hart van het reservoir uit het AHN op het maaiveld (NAP +1,17 m), +X op RD 7 graden naar een poot. Open stalen vakwerk van acht poten (0,9 m, hart onderaan 6,15 en bovenaan 5,25 m van het hart) met vijf verdiepingen kruisen en een kern in het midden, een glazen begane grond met ingang en luifel aan de oostnoordoostkant; trechter en bolle bodem vanaf de ring op 30,6 m, cilinder van 15,2 m (35,8 tot 42,2 m) met acht groepen vensterkolommen en ronde vensters, uitlopende rand van 17,4 m tot 44,25 m, kegeldak met twee dakkapelletjes tot 49,35 m, achtkante lantaarn met luiken tot 52,4 m en een holle achtzijdige spits tot 61,3 m. Maten uit AHN, BAG en foto's.",
    realWorld: {
      built: 1912,
      builder: "Carl Francke, Bremen",
      rijksmonument: 16286,
      publishedHeightM: 63,
      reservoirM3: 1250,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 62.32,
      legs: 8,
      legCentreRadiusM: [LEG_FOOT, LEG_TOP],
      braceStoreys: 5,
      tankBottomM: H.bottom,
      cylinderDiameterM: 2 * R.cylinder,
      cylinderM: H.cylinder,
      rimDiameterM: 2 * R.rim,
      rimTopM: H.rim[1],
      roofTopM: H.roofTop,
      lanternM: H.lantern,
      topM: H.top,
      photoScalePxPerM: 19.9,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Goes_%27s_Gravenpolderseweg) (1912, Carl Francke, 63 m, 1250 m³, sinds 1999 kantoor, sinds 2021 ook appartementen)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/16286 (eerste stalen watertoren van Nederland, open stalen constructie met stalen reservoir)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren,_Goes (Watertoren - Goes - 20079328 - RCE.jpg voor de maten; Goes, de Watertoren RM16286 IMG 3581 2024-07-14 11.31.jpg, Goes, de watertoren RM18286 foto5 2012-05-17 17.28.JPG, Watertoren van Goes.jpg, Ready for lift-off (52823742489).jpg en Watertoren, detail - Goes - 20079330 - RCE.jpg)",
      "PDOK BAG-pand 0664100000008428, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

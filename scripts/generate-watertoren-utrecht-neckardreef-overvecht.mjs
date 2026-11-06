// Watertoren aan de Neckardreef in Utrecht-Overvecht (Neckardreef 40). Gebouwd in 1934-1935 voor de Drinkwaterleiding
// Noord-West-Utrecht (D.N.W.U.) in opdracht van de toenmalige gemeente Maartensdijk, naar ontwerp van bedrijfsleider J.L. Pateer,
// in de stijl van de Amsterdamse School; 48,6 m hoog met de makelaar, vlakbodemreservoir van 500 m³ (2 x 250 m³), rijksmonument
// 514451. Een achtkante toren met een betonskelet, bekleed met baksteen: vier gevels met hoge spleetvensters (een veld van vier
// smalle vensters met spitse koppen en V-vormige onderdorpels), drie kleine vensters onder een betonnen band op ruim 27 m en een
// tweede vensterveld erboven; de vier andere gevels hebben elk een gemetselde steunbeer over de volle hoogte. Bovenop een
// betonnen kroonlijst met een omgang en een achtkante koperen koepel met makelaar. De ingang ligt verdiept in de westgevel onder
// een betonnen luifel met erboven de plaat "D.N.W.U."; de andere gevels hebben onderin dichtgemetselde dubbele vensters (register).
//
// Oorsprong op het hart van de achthoek van BAG-pand 0344100000057728 (omgeschreven straal 6,55 m, apothema 6,05 m; vier
// steunberen van 0,92 x 0,94 m op het midden van de diagonale gevels). De achthoek staat 1,25 graden met de klok mee gedraaid ten
// opzichte van RD; de lokale X-as wijst naar een hoek van de achthoek (RD-oost -1,25 graden), Y 90 graden linksom. Gevels op
// 22,5 + k x 45 graden; steunberen op 22,5, 112,5, 202,5 en 292,5; vensterveldgevels op 67,5, 157,5 (ingang, BGT-erf ervoor),
// 247,5 en 337,5. Maaiveld AHN-DTM NAP +1,36. Hoogtes: kroonlijst (+39,2 m, AHN NAP +40,6) en koepel (top +47,4 m, AHN
// NAP +48,8; profiel per 0,25 m apothema uit het DSM) uit het AHN; band, vensters, luifel en kroonlijstdikte uit de RCE-foto
// "Overzicht - Utrecht - 20235329 - RCE.jpg" (frontaal op de ingangsgevel, geschaald op de kroonlijst uit het AHN), de ingang
// uit "Ingang - Utrecht - 20235331 - RCE.jpg".
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [136725.69, 458761.485];
const ROT = -1.25; // graden; achthoek t.o.v. RD
const AXIS = [+Math.cos((ROT * Math.PI) / 180).toFixed(5), +Math.sin((ROT * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 1.36;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 44,67, west 44,86, noord 44,92, zuid 44,58),
// gemeten 2026-11-06. Het PDOK-pand staat op 44,56.
const GROUND_ELLIPSOID = 44.58;

const rad = (deg) => (deg * Math.PI) / 180;
const C8 = Math.cos(rad(22.5));
// Achthoek met apothema a, hoeken op de assen (0, 45, ... graden).
const oct = (a) => Array.from({ length: 8 }, (_, k) => [(a / C8) * Math.cos(rad(45 * k)), (a / C8) * Math.sin(rad(45 * k))]);
const ring = (a, z) => oct(a).map(([x, y]) => [x, y, z]);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
// Een gevel op apothema f met normaal +X; onderdelen worden met place() naar de gevel op `deg` gedraaid.
// Spleetvenster: tunnel van breedte w, van z0 tot z1 met een spitse kop (zijden onder 55 graden), diepte d.
const slit = (f, w, z0, z1, y = 0, d = 0.35) => {
  const apex = z1 + (w / 2) * Math.tan(rad(55));
  return hull([f - d, f + 1].flatMap((x) => [[x, y - w / 2, z0], [x, y + w / 2, z0], [x, y - w / 2, z1], [x, y + w / 2, z1], [x, y, apex]]));
};
// Rechthoekige nis van breedte w, van z0 tot z1, met een plafond dat 56 graden naar binnen oploopt.
const niche = (f, w, z0, z1, y = 0, d = 0.3) => {
  const a = f - d, b = f + 0.3, za = z1 + 1.5 * d, zb = z1 - 0.45;
  return hull([[a, y - w / 2, z0], [b, y - w / 2, z0], [a, y + w / 2, z0], [b, y + w / 2, z0], [a, y - w / 2, za], [a, y + w / 2, za], [f, y - w / 2, z1], [f, y + w / 2, z1], [b, y - w / 2, zb], [b, y + w / 2, zb]]);
};

// ---------- hoogtes boven het maaiveld ----------
const H = {
  sill: 1.1, // dichtgemetselde vensters onderin (1,0 x 1,0 m)
  sillTop: 2.1,
  door: 2.04, // bovenkant van de ingangsnis aan de achterwand; het plafond loopt onder 48 graden door in de onderkant van de luifel
  canopy: 2.92, // onderkant voorrand luifel (0,5 m uitsteek)
  canopyTop: 3.12,
  slitLow: 5.2, // onderste vensterveld: onderdorpels
  slitLowTop: 24.6, // aanzet van de spitse koppen
  windows: 25.9, // drie kleine vensters onder de band
  windowsTop: 26.9,
  band: 27.07, // betonnen band, onderkant aan de gevel
  bandTop: 28.5,
  slitHigh: 29.75, // bovenste vensterveld
  slitHighTop: 37.2,
  cornice: 38.0, // betonnen kroonlijst, onderkant aan de gevel
  corniceTop: 39.2, // AHN NAP +40,6
  top: 47.4, // koepel, AHN NAP +48,8 (makelaar tot 48,6 m weggelaten)
};
const AP = 6.05; // apothema van de schacht (BAG)
const AP_UP = 5.9; // boven de band iets terug (register: "versmalt na ruim 30 m")
const AP_BAND = 6.35; // band en kroonlijst steken 0,3 m uit
const BUT = { w: 0.92, d: 0.94 }; // steunbeer (BAG)
const BUTTRESS_DEGS = [22.5, 112.5, 202.5, 292.5];
const WINDOW_DEGS = [67.5, 157.5, 247.5, 337.5];
const DOOR_DEG = 157.5; // west-noordwest, het BGT-erf ligt ervoor
const lip = (p) => 1.1 * p; // kraag iets steiler dan 45 graden

// ---------- schacht, band en kroonlijst ----------
const shaft = union([
  prism(oct(AP), BASE, H.bandTop),
  prism(oct(AP_UP), H.bandTop - 0.1, H.corniceTop - 0.1),
  // band: schuine onderkant van de gevel naar 6,35 m, verticale voorkant tot de bovenkant
  hull([...ring(AP - 0.05, H.band - lip(0.05)), ...ring(AP_BAND, H.band + lip(AP_BAND - AP)), ...ring(AP_BAND, H.bandTop), ...ring(AP_UP, H.bandTop)]),
  // kroonlijst met omgang op de bovenkant
  hull([...ring(AP_UP - 0.05, H.cornice - lip(0.05)), ...ring(AP_BAND, H.cornice + lip(AP_BAND - AP_UP)), ...ring(AP_BAND, H.corniceTop), ...ring(AP_UP, H.corniceTop)]),
]);

// ---------- steunberen ----------
// Op het midden van de diagonale gevels, 0,94 m voor de gevel, tot de bovenkant van de kroonlijst; boven de band 0,15 m terug
// zoals de gevel; op de band een kraag van 0,15 m rondom.
const buttress = (() => {
  const w = BUT.w / 2, out = AP + BUT.d, outUp = AP_UP + BUT.d, c = 0.15, cz = 1.6 * c; // ook op de hoek steiler dan 45 graden
  const low = prism([[AP - 0.3, -w], [out, -w], [out, w], [AP - 0.3, w]], BASE, H.bandTop);
  const up = prism([[AP_UP - 0.3, -w], [outUp, -w], [outUp, w], [AP_UP - 0.3, w]], H.bandTop - 0.1, H.corniceTop);
  const collar = hull([
    [AP, -w, H.band], [out, -w, H.band], [out, w, H.band], [AP, w, H.band],
    [AP, -w - c, H.band + cz], [out + c, -w - c, H.band + cz], [out + c, w + c, H.band + cz], [AP, w + c, H.band + cz],
    [AP, -w - c, H.bandTop], [out + c, -w - c, H.bandTop], [out + c, w + c, H.bandTop], [AP, w + c, H.bandTop],
  ]);
  return union([low, up, collar]);
})();
const buttresses = union(around(buttress, BUTTRESS_DEGS));

// ---------- koepel ----------
// Achtkante koepel: omwenteling met 8 segmenten (hoeken op de graten boven de hoeken van de achthoek, vlakken boven de gevels).
// Profiel als apothema tegen hoogte, uit het AHN-DSM per 0,25 m (mediaan), zodat de koepel steil begint en bol uitloopt.
const DOME = [
  [5.45, H.corniceTop - 0.1], [5.45, 40.2], [5.3, 41.1], [5.0, 42.05], [4.5, 43.1], [4.0, 43.95], [3.5, 44.65],
  [3.0, 45.25], [2.5, 45.75], [2.0, 46.2], [1.5, 46.6], [1.0, 46.95], [0.5, 47.25], [0, H.top],
];
const dome = Manifold.revolve(new CrossSection([ccw([[0, H.corniceTop - 0.1], ...DOME.map(([a, z]) => [a / C8, z])])]), 8);

// ---------- ingang ----------
// Verdiepte ingang (3,3 m breed, 0,3 m diep) onder een luifel over de hele gevelbreedte (4,9 m) die 0,5 m uitsteekt. Het plafond
// van de nis en de onderkant van de luifel vormen één vlak dat van de achterwand (2,04 m) onder 48 graden naar de voorrand
// (2,92 m, 0,2 m dik) oploopt: zo hangt er geen V-rand onder de luifel die de export zou opvullen. Stoep van één trede.
const SIDE = 2 * AP * Math.tan(rad(22.5));
const entrance = (() => {
  const w = 1.65, d = 0.3, p = 0.5, s = SIDE / 2 - 0.05;
  const ceil = (x) => H.door + lip(x - (AP - d)); // ceil(AP + p) = 2,92
  const recess = hull([[AP - d, -w, 0.2], [AP + 1, -w, 0.2], [AP - d, w, 0.2], [AP + 1, w, 0.2], [AP - d, -w, H.door], [AP - d, w, H.door], [AP + 1, -w, ceil(AP + 1)], [AP + 1, w, ceil(AP + 1)]]);
  const canopy = hull([[AP - 0.1, -s, ceil(AP - 0.1)], [AP - 0.1, s, ceil(AP - 0.1)], [AP + p, -s, ceil(AP + p)], [AP + p, s, ceil(AP + p)], [AP + p, -s, H.canopyTop], [AP + p, s, H.canopyTop], [AP - 0.1, -s, H.canopyTop], [AP - 0.1, s, H.canopyTop]]);
  const step = prism([[AP - d, -1.8], [AP + 0.9, -1.8], [AP + 0.9, 1.8], [AP - d, 1.8]], BASE, 0.2);
  return { recess: place(recess, { deg: DOOR_DEG }), add: place(union([canopy, step]), { deg: DOOR_DEG }) };
})();

// ---------- vensters als blinde nissen ----------
// - vensterveldgevels: vier spleetvensters van 0,45 m (0,35 m penanten) onder en boven de band, met spitse koppen;
//   drie kleine vensters van 0,47 x 1,0 m (0,9 m hart op hart) vlak onder de band;
// - onderin: dubbele vensters van 1,0 x 1,0 m, naast de steunbeer op de diagonale gevels en als paar op de vensterveldgevels
//   (behalve de ingang).
const slitYs = [-1.2, -0.4, 0.4, 1.2];
const field = union([
  ...slitYs.map((y) => slit(AP, 0.45, H.slitLow, H.slitLowTop, y)),
  ...slitYs.map((y) => slit(AP_UP, 0.45, H.slitHigh, H.slitHighTop, y)),
  ...[-0.9, 0, 0.9].map((y) => niche(AP, 0.47, H.windows, H.windowsTop, y)),
]);
const lowWindowsDiag = union([-1.6, 1.6].map((y) => niche(AP, 1.0, H.sill, H.sillTop, y)));
const lowWindowsFace = union([-1.0, 1.0].map((y) => niche(AP, 1.0, H.sill, H.sillTop, y)));
const openings = union([
  ...around(field, WINDOW_DEGS),
  ...around(lowWindowsDiag, BUTTRESS_DEGS),
  ...around(lowWindowsFace, WINDOW_DEGS.filter((d) => d !== DOOR_DEG)),
  entrance.recess,
]);

const all = union([shaft, buttresses, dome, entrance.add]).subtract(openings);

await writeLandmark({
  slug: "watertoren-utrecht-neckardreef-overvecht",
  base: BASE,
  nodes: [["building:watertoren-schacht-steunberen-vensters-band-kroonlijst-en-koepel", all]],
  catalog: {
    name: "Watertoren Neckardreef",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-9, 0], [0, 9], [0, -9]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000057728"],
    description:
      "Oorsprong op het hart van de achthoekige BAG-voetafdruk (apothema 6,05 m) op het maaiveld (NAP +1,36 m), X-as naar een hoek van de achthoek (RD-oost -1,25 graden). Achtkante bakstenen schacht met vier steunberen over de volle hoogte op de diagonale gevels en op de vier andere gevels velden van vier spleetvensters onder en boven een betonnen band op 27,1-28,5 m, met drie kleine vensters eronder; verdiepte ingang onder een betonnen luifel aan de west-noordwestkant, dichtgemetselde dubbele vensters onderin; betonnen kroonlijst met omgang tot 39,2 m en een achtkante koperen koepel tot 47,4 m (makelaar weggelaten). Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1935,
      architect: "J.L. Pateer (Drinkwaterleiding Noord-West-Utrecht), Amsterdamse School",
      rijksmonument: 514451,
      publishedHeightM: 48.6,
      reservoirM3: 500,
      ahnGroundNapM: GROUND_NAP,
      ahnCorniceNapM: 40.6,
      ahnTopNapM: 48.8,
      apothemM: AP,
      upperApothemM: AP_UP,
      buttressM: [BUT.w, BUT.d],
      bandM: [H.band, H.bandTop],
      slitFieldsM: [[H.slitLow, H.slitLowTop], [H.slitHigh, H.slitHighTop]],
      corniceM: [H.cornice, H.corniceTop],
      domeApothemM: DOME[0][0],
      topM: H.top,
      entranceDegrees: DOOR_DEG,
      rotationDegrees: ROT,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Utrecht_Neckardreef) (1934-1935, J.L. Pateer, Amsterdamse School, achtzijdig, 48,6 m, vlakbodemreservoir van 500 m³; gemeente Maartensdijk tot 1954, in Park de Watertoren)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/514451 (achtzijdige toren met betonskelet en baksteen, ruim 49 m, versmalt na ruim 30 m, koperen koepeldak; spleetvensters op vier zijden, gemetselde steunberen over de volle hoogte op de andere vier; verdiepte ingang met betonnen luifel en plaat D.N.W.U.; dichtgemetselde dubbele vensters onderin)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_-_Utrecht_-_20235329_-_RCE.jpg, File:Aanzicht_-_Utrecht_-_20235330_-_RCE.jpg, File:Ingang_-_Utrecht_-_20235331_-_RCE.jpg, File:Watertoren_Utrecht_Overvecht.JPG, File:HUA-28754-Gezicht_op_de_watertoren_Overvecht_aan_de_Neckardreef_te_Utrecht_uit_het_noordwesten.jpg",
      "PDOK BAG-pand 0344100000057728, BGT (erf voor de ingang), AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

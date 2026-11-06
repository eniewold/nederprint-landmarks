// Watertoren van Gorinchem aan de Visserlaan. Gebouwd in 1886 voor de Maatschappij tot exploitatie van Waterleidingen in
// Nederland naar ontwerp van Jan Schotel; 31 m hoog, reservoir van 300 m³, in 1910 door de gemeente overgenomen en in 1985
// verbouwd tot woningen (Wikipedia). Een ronde bakstenen toren: een onderbouw op een plint met grote spitsboogvensters en een
// geprofileerde band, een licht verjongende schacht met vier verdiepingen vensters (sinds 1985), een rondboogfries van
// spitsbogen op consoles, een achtkante reservoirommanteling met per zijde een vensterstrook en twee blinde nissen, een
// zwaar overstekende goot en een achtkant tentdak met vier dakkapellen en een makelaar met windvaan. Aan de zuidzijde het
// entreegebouw met een trapgevel, een spitsboogdeur, een tweelicht en een schoorsteen op de top, aan de noordzijde een plat
// aanbouwtje uit 1985 (foto's, BAG).
//
// Oorsprong op het hart van de cirkel in BAG-pand 0512100000038785 (kleinste-kwadratencirkel door 38 boogpunten, straal 5,39 m,
// afwijking 0,01 m); de top van het tentdak in het AHN-DSM 0,5 m ligt er binnen 0,3 m op. Lokale X-as 16 graden rechtsom van
// RD-oost: de dakvlakken van het tentdak hebben hun normalen dan op k maal 45 graden (fit van acht vlakken op het DSM, 29 graden
// in RD) en de voorgevel van het entreegebouw (BAG: -17,2 graden) ligt evenwijdig aan de X-as, met de voorzijde naar -Y (zuid-
// zuidwest). Hoeken hieronder in graden linksom vanaf de lokale X-as. Maaiveld AHN-DTM NAP +3,7 (3,65 tot 3,8 rond de voet; de
// toren staat vlak, niet op een wal).
// Maten: tentdak uit het AHN-DSM (acht vlakken met helling 1,00, top NAP +34,59, goot NAP +29,0 tot een apothema van 6,25 m);
// band, fries, ommanteling en vensters uit de RCE-foto's 20080593 (vanaf het oostzuidoosten, shift-lens) en 20316645
// (vanaf het noordwesten), geschaald op de BAG-cirkel en de goot uit het AHN; het entreegebouw uit de BAG en de foto's
// 20316648 (frontaal) en 20080593.
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [127003.65, 426954.38];
const AXIS_DEG = -16;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.7;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 46,691, west 47,045, noord 46,870, zuid
// 47,010), gemeten 2026-11-06. Het PDOK-pand staat op 46,61.
const GROUND_ELLIPSOID = 46.691;

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Achthoek met de vlakken loodrecht op k maal 45 graden.
const octagon = (apothem) => Array.from({ length: 8 }, (_, k) => polar(apothem / Math.cos(rad(22.5)), 22.5 + 45 * k));
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
// Blinde nis in het vlak met normaal +X op afstand f, midden op y = t, breedte w, van z0 tot z1; met `point` een spitse top
// van 55 graden. Het plafond loopt naar binnen onder 56 graden op (0,45 m per 0,3 m diepte) en naar buiten evenveel af.
const niche = (f, w, z0, z1, { t = 0, depth = 0.3, point = false } = {}) => {
  const prof = [[t - w / 2, z0], [t + w / 2, z0], [t + w / 2, z1], ...(point ? [[t, z1 + (w / 2) * Math.tan(rad(55))]] : []), [t - w / 2, z1]];
  const lift = 1.5 * depth;
  return hull([
    ...prof.map(([y, z]) => [f - depth, y, z === z0 ? z0 : z + lift]),
    ...prof.map(([y, z]) => [f, y, z]),
    ...prof.map(([y, z]) => [f + 0.2, y, Math.max(z0, z - 0.3)]),
  ]);
};

// ---------- hoogtes boven het maaiveld (NAP +3,7) ----------
const H = {
  plinth: 0.7, // plint met schuine afzaat tot 0,8 m
  band: 6.2, // geprofileerde band boven de onderbouw (6,2 tot 6,85 m; foto's)
  bandTop: 6.85,
  friezeFoot: 16.55, // onderkant van de consoles onder het spitsboogfries (foto 20080593)
  frieze: 17.5, // voorvlak van het fries
  friezeTop: 19.45,
  casing: 19.65, // achtkante ommanteling van het reservoir
  cornice: 24.15, // overstekende goot op een kraag van 50 graden
  eave: 25.1,
  gutter: 25.3, // goot (AHN NAP +29,0 tot een apothema van 6,25 m)
  apex: 30.9, // top van het tentdak (AHN NAP +34,59; helling 1,00)
  finial: 31.6, // makelaar (AHN NAP +35,32)
};
const R = {
  plinth: 5.39, // BAG
  base: 5.29,
  band: 5.49,
  shaftFoot: 5.12, // boven de band (foto: 10,24 m)
  shaftTop: 4.95, // onder het fries (foto: 9,84 m)
  frieze: 5.75,
  casing: 5.45, // apothema van de ommanteling (hoeken 5,90 m)
  eave: 6.25, // apothema van de goot
  roof: 5.6, // apothema waar het dakvlak de goot raakt
};

// ---------- toren ----------
const tower = rev([
  [0, BASE], [R.plinth, BASE], [R.plinth, H.plinth], [R.base, H.plinth + 0.1], [R.base, H.band], [R.band, H.band + 0.25],
  [R.band, H.bandTop], [R.shaftFoot, H.bandTop], [R.shaftTop, H.friezeFoot], [R.frieze, H.frieze], [R.frieze, H.friezeTop + 0.2],
  [0, H.friezeTop + 0.2],
]);
// Ommanteling: achtkant prisma; de hoeken (5,90 m) steken 0,15 m buiten het fries uit en lopen er met een schuine kraag in.
const casing = union([
  hull([...octagon(R.casing).map(([x, y]) => [x, y, H.casing]), ...Array.from({ length: 48 }, (_, k) => [...polar(R.frieze, 7.5 * k), H.friezeTop])]),
  prism(octagon(R.casing), H.casing, H.cornice + 0.01),
]);
// Goot: kraag van 50 graden tot een apothema van 6,25 m, rechte rand tot 25,3 m.
const cornice = union([
  hull([...octagon(R.casing).map(([x, y]) => [x, y, H.cornice]), ...octagon(R.eave).map(([x, y]) => [x, y, H.eave])]),
  prism(octagon(R.eave), H.eave, H.gutter),
]);
// Tentdak: acht vlakken van 45 graden vanaf de goot (apothema 5,6 m) tot de top; makelaar als achtkante naald.
const roof = hull([...octagon(R.roof).map(([x, y]) => [x, y, H.gutter - 0.01]), [0, 0, H.apex]]);
const finial = hull([...octagon(0.45).map(([x, y]) => [x, y, H.apex - 0.6]), [0, 0, H.finial]]);
// Vier dakkapellen op de vlakken 0, 90, 180 en 270 graden: 1,6 m breed, voorvlak op een apothema van 4,1 m (dak 26,8 m),
// goot op 27,9 m, zadeldakje van 45 graden tot 28,7 m, nok terug tot in het dakvlak; een venster als nis.
const dormer = (() => {
  const w = 0.8, front = 4.1, back = 1.9, z0 = 25.6, zEave = 27.9, zRidge = 27.9 + w;
  const body = hull([front, back].flatMap((x) => [[x, -w, z0], [x, w, z0], [x, w, zEave], [x, 0, zRidge], [x, -w, zEave]]));
  return body.subtract(niche(front, 0.9, 26.95, 27.6));
})();

// ---------- entreegebouw (zuid, -Y) ----------
// BAG: 6,9 m breed (x -3,6 tot 3,3), voorgevel op y = -8,0. Nok in het midden (x -0,15), goot 4,0 m, nok 7,8 m (48 graden).
const A = { x0: -3.6, x1: 3.3, front: -8.0, back: -3.5, eave: 4.0, ridge: 7.8 };
const ridgeX = (A.x0 + A.x1) / 2;
const halfW = (A.x1 - A.x0) / 2;
const annexWalls = prism([[A.x0, A.front], [A.x1, A.front], [A.x1, A.back], [A.x0, A.back]], BASE, A.eave);
const annexRoof = hull([A.front, A.back].flatMap((y) => [[A.x0, y, A.eave - 0.01], [A.x1, y, A.eave - 0.01], [ridgeX, y, A.ridge]]));
// Trapgevel: vier treden van 0,9 m per zijde, elk 0,3 m boven het dakvlak aan de binnenkant, top op 8,3 m en een schoorsteen
// van 0,9 x 0,9 m tot 9,2 m; de gevel is 0,9 m dik.
const roofAt = (w) => A.ridge - ((A.ridge - A.eave) / halfW) * w;
const steps = [3.45, 2.55, 1.65, 0.75].map((wOut, i) => {
  const wIn = Math.max(0, wOut - 0.9);
  const top = i === 3 ? 8.3 : roofAt(wIn) + 0.3;
  return prism([[ridgeX - wOut, A.front], [ridgeX + wOut, A.front], [ridgeX + wOut, A.front + 0.9], [ridgeX - wOut, A.front + 0.9]], A.eave - 0.01, top);
});
const chimney = prism([[ridgeX - 0.45, A.front], [ridgeX + 0.45, A.front], [ridgeX + 0.45, A.front + 0.9], [ridgeX - 0.45, A.front + 0.9]], 8.0, 9.2);
// Stoep van twee treden voor de deur.
const stoop = union([
  prism([[ridgeX - 1.2, A.front - 0.9], [ridgeX + 1.2, A.front - 0.9], [ridgeX + 1.2, A.front + 0.1], [ridgeX - 1.2, A.front + 0.1]], BASE, 0.3),
  prism([[ridgeX - 1.2, A.front - 0.45], [ridgeX + 1.2, A.front - 0.45], [ridgeX + 1.2, A.front + 0.1], [ridgeX - 1.2, A.front + 0.1]], BASE, 0.6),
]);
// Openingen in het entreegebouw: de nis met normaal +X, -90 graden gedraaid, ligt in de voorgevel (normaal -Y); t wordt dan x.
const front = (w, z0, z1, x, point = false) => place(niche(-A.front, w, z0, z1, { t: x, point }), { deg: -90 });
const annexOpenings = union([
  front(1.6, 0.6, 2.6, ridgeX, true), // spitsboogdeur
  front(1.6, 4.55, 5.75, ridgeX, true), // tweelicht in de trapgevel
  front(0.9, 1.0, 2.6, -2.7), // venster links
  front(1.6, 1.0, 2.7, 2.2), // dubbel venster rechts
  // oostgevel (normaal +X): twee vensters; westgevel (normaal -X): één venster
  niche(A.x1, 0.9, 1.0, 2.6, { t: -6.9 }),
  niche(A.x1, 0.9, 1.0, 2.6, { t: -5.3 }),
  place(niche(-A.x0, 0.9, 1.0, 2.6, { t: 6.5 }), { deg: 180 }),
]);
const annex = union([annexWalls, annexRoof, ...steps, chimney, stoop]).subtract(annexOpenings);

// ---------- aanbouw uit 1985 (noord, +Y) ----------
// BAG: x -2,05 tot 1,91, tot y = 7,04; plat dak op 3,3 m (foto 20316645), een raam in de noordgevel.
const box = prism([[-2.05, 4.0], [1.91, 4.0], [1.91, 7.04], [-2.05, 7.04]], BASE, 3.3)
  .subtract(place(niche(7.04, 1.2, 0.9, 2.4, { t: 0.07 }), { deg: 90 }));

// ---------- vensters en nissen in de toren ----------
// - groot spitsboogvenster in de onderbouw op -18 graden (oostzuidoost) en deur met spitsboogvenster op 150 graden;
// - vier verdiepingen vensters (sinds 1985) in zes kolommen;
// - 24 spitsboognissen in het fries;
// - per zijde van de ommanteling een vensterstrook in het midden en twee blinde nissen.
// De vensters zijn als nis 1,2 m breed; de nissen in het fries 0,9 m.
const shaftLevels = [[7.5, 8.8], [9.7, 11.0], [12.1, 13.5], [14.6, 16.0]];
const shaftR = (z) => R.shaftFoot + ((R.shaftTop - R.shaftFoot) * (z - H.bandTop)) / (H.friezeFoot - H.bandTop);
const windows = union([
  place(niche(R.base, 1.8, 1.0, 4.4, { point: true }), { deg: -18 }),
  place(niche(R.base, 1.6, 0.0, 4.4, { point: true }), { deg: 150 }),
  ...shaftLevels.flatMap(([z0, z1]) => around(niche(shaftR(z1), 1.2, z0, z1), [0, 60, 120, 180, 240, 300])),
  ...around(niche(R.frieze, 0.9, 17.6, 18.4, { point: true }), Array.from({ length: 24 }, (_, k) => 7.5 + 15 * k)),
  ...around(niche(R.casing, 1.0, 20.3, 23.5), [0, 45, 90, 135, 180, 225, 270, 315]),
  ...[-1.4, 1.4].flatMap((t) => around(niche(R.casing, 0.9, 20.6, 22.9, { t, point: true }), [0, 45, 90, 135, 180, 225, 270, 315])),
]);

const all = union([
  union([tower, casing, cornice, roof, finial, ...around(dormer, [0, 90, 180, 270])]).subtract(windows),
  annex,
  box,
]);

await writeLandmark({
  slug: "watertoren-gorinchem",
  base: BASE,
  nodes: [["building:watertoren-schacht-fries-ommanteling-tentdak-en-entreegebouw", all]],
  catalog: {
    name: "Watertoren Gorinchem",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-8, 0], [0, 9], [0, -10]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0512100000038785"],
    description:
      "Oorsprong op het hart van de ronde BAG-voetafdruk (straal 5,39 m) op het maaiveld (NAP +3,7 m), X-as 16 graden rechtsom van RD-oost, voorgevel van het entreegebouw naar -Y. Ronde bakstenen onderbouw met plint, spitsboogvensters en band tot 6,85 m; verjongende schacht met vier verdiepingen vensters; spitsboogfries op een kraag van 50 graden van 16,55 tot 19,65 m; achtkante ommanteling met vensterstroken en blinde nissen; overstekende goot op 25,3 m (12,5 m over de vlakken); achtkant tentdak van 45 graden met vier dakkapellen tot 30,9 m en een makelaar tot 31,6 m; entreegebouw met trapgevel, spitsboogdeur en schoorsteen aan de zuidzijde en een plat aanbouwtje uit 1985 aan de noordzijde. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1886,
      architect: "Jan Schotel",
      publishedHeightM: 31,
      reservoirM3: 300,
      convertedToHomes: 1985,
      ahnGroundNapM: GROUND_NAP,
      ahnApexNapM: 34.59,
      ahnFinialNapM: 35.32,
      ahnRoofSlope: 1.0,
      ahnEaveNapM: 29.0,
      bagRadiusM: R.plinth,
      bandM: [H.band, H.bandTop],
      friezeM: [H.friezeFoot, H.casing],
      casingApothemM: R.casing,
      eaveApothemM: R.eave,
      gutterM: H.gutter,
      apexM: H.apex,
      topM: H.finial,
      annexEaveM: A.eave,
      annexRidgeM: A.ridge,
      annexGableTopM: 8.3,
      chimneyM: 9.2,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Gorinchem) (1886, Jan Schotel, 31,00 m, 300 m³, maximale breedte 10 m, sinds 1985 woningen)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Gorinchem) (Gorinchem Watertoren 8497.JPG, 2006; Overzicht - Gorinchem - 20080593 - RCE.jpg; Exterieur NA INBOUW APPARTEMENTEN - Gorinchem - 20316648 - RCE.jpg; Exterieur NA UITBOUW WOONEENHEDEN - Gorinchem - 20316645 - RCE.jpg; Watertoren Gorinchem.jpg, 1901)",
      "PDOK BAG-pand 0512100000038785, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

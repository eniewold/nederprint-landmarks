// Nieuwe watertoren van Steenbergen aan de Watertorenweg, gebouwd in 1950 naar ontwerp van J.M. (Jacques) Hurks
// als vervanging van de oude toren die op 3 november 1944 werd opgeblazen; volgens Wikipedia 40,65 m hoog met één
// reservoir van 600 m³, baksteen en beton. Sinds de verbouwing van 2000 zit er kinderopvang Toerdeloo in. Een ronde
// bakstenen schacht zonder geleding, onder het reservoir een gemetselde boogjesfries, onder de dakrand een krans van
// zestien kleine vierkante vensters, een koperen kegeldak met een zware ronde dakrand en een ronde lantaarn met
// glasband, een kap en een makelaar. Tegen de zuidkant staan de lage dienstvleugels uit dezelfde tijd (één BAG-pand
// met de toren): naar het zuidwesten een vleugel van twee bouwlagen met een zadeldak en schoorsteen op de westgevel,
// daarachter een lagere vleugel van één laag, en naar het zuidoosten een vleugel van één laag tot het buurhuis, met aan
// de noordoostkant een plat aanbouwtje tegen de toren.
//
// Oorsprong op het hart van de toren uit het AHN-DSM (cellen boven NAP +20 m, cirkel van 13,4 m over de dakrand) op
// maaiveld (AHN-DTM NAP +1,19 tot +1,27 rond de toren; gebruikt +1,23). De BAG-contour van pand 0851100000010832 heeft
// de toren als ruwe cirkel (straal 6,6 tot 7,2 m) en volgt de vleugels wel goed; de vleugels staan hier op hun
// BAG-gevellijnen. Lokale +X is RD-oost, +Y RD-noord (xAxis [1, 0]).
//
// Hoogtes uit het AHN-DSM 0,5 m (straalprofiel om het hart en dwarsprofielen per vleugel), boven maaiveld:
// dakrand op r 6,75 rond 35,55 m, kegeldak met helling 0,46 tot de lantaarn op r 2,65 (37,45 m), kap van de lantaarn
// tot 39,85 m in het hart (NAP +41,1); de makelaar steekt tot circa 40,4 m (Wikipedia 40,65) maar is te dun.
// Breedteverhoudingen van de schacht en de dakrand uit de RCE-foto 20346621 (verticalen evenwijdig: dakrand : schacht
// = 208 : 195) en de foto's van 2010 en 2015; de fries, de vensterkrans en de lantaarn uit dezelfde foto's, geschaald
// op de schachtbreedte.
import { hull, ring3, circle, union, prism, Manifold, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [81735.45, 400550.35];
const AXIS = [1, 0];
const BASE = -0.3;
const GROUND_NAP = 1.23; // AHN-DTM 1,19 tot 1,27 binnen 7 tot 14 m van het hart
const GEOID_N = 44.13; // NLGEO2018-geoïdehoogte, lineair tussen de watertorens van Bergen op Zoom, Roosendaal, Stampersgat en Etten-Leur
const SEG = 96;

// ---------- toren ----------
const R = {
  shaft: 6.3, // schacht (RCE-foto: 195/208 van de dakrand)
  tank: 6.42, // reservoirzone boven de boogjesfries, 0,12 m uit de schacht
  eave: 6.75, // ronde dakrand (AHN: cellen boven 30 m 13 tot 13,5 m breed)
  lantern: 2.4, // lantaarn (foto 2010: 5,2 m over de glasband)
  cap: 2.65, // kap van de lantaarn
};
const H = {
  frieze: 25.0, // boogjesfries onder het reservoir (foto's: 10,6 m onder de dakrand)
  eaveFoot: 34.3, // onderkant van de kraag onder de dakrand
  eaveTop: 35.55, // bovenkant van de dakrand (AHN: r 6,0 op 37,1 NAP)
  roofTop: 37.45, // kegeldak tot de lantaarn (helling 0,46, AHN r 3,5 op 38,36 NAP)
  lanternTop: 38.75, // bovenkant van de glasband
  capEdge: 39.1,
  apex: 39.85, // top van de kap (AHN NAP +41,1)
};
const ring = (r) => circle([0, 0], r, SEG);
const shaft = prism(ring(R.shaft), BASE, H.eaveFoot + 0.05);
// Reservoirzone 0,12 m uit de schacht met een onderkant onder 45 graden: de boogjesfries als lijn.
const tank = hull([...ring3(ring(R.shaft), H.frieze - 0.12), ...ring3(ring(R.tank), H.frieze), ...ring3(ring(R.tank), H.eaveFoot + 0.05)]);
// Zware ronde dakrand: kraag onder 45 graden, dan de rand recht op tot het dak.
const eave = hull([...ring3(ring(R.tank), H.eaveFoot), ...ring3(ring(R.eave), H.eaveFoot + (R.eave - R.tank)), ...ring3(ring(R.eave), H.eaveTop)]);
// Koperen kegeldak tot de lantaarn.
const roof = hull([...ring3(ring(R.eave), H.eaveTop - 0.05), ...ring3(ring(R.cap), H.roofTop)]);
// Lantaarn met een kap die 0,25 m uitsteekt (kraag onder 45 graden) en een flauwe kegel tot de top.
const lantern = union([
  prism(ring(R.lantern), H.roofTop - 0.3, H.lanternTop + 0.05),
  hull([...ring3(ring(R.lantern), H.lanternTop), ...ring3(ring(R.cap), H.lanternTop + 0.25), ...ring3(ring(R.cap), H.capEdge), ...ring3(ring(0.3), H.apex)]),
]);

// Nis in het vlak met normaal +X op afstand f, midden op y = 0, met een plafond dat onder 56 graden naar binnen oploopt.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, y0 = -w / 2, y1 = w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, z1 - 1.5], [b, y1, z1 - 1.5]]);
};
// Zestien vierkante vensters onder de dakrand (foto's: 0,8 m, hier 0,9 m breed) en twaalf vakken in de glasband.
const windows = Array.from({ length: 16 }, (_, k) => niche(R.tank - 0.02, 0.9, 32.5, 33.6).rotate([0, 0, 11.25 + 22.5 * k]));
const glazing = Array.from({ length: 12 }, (_, k) => niche(R.lantern - 0.01, 0.9, H.roofTop + 0.2, H.lanternTop - 0.25, 0.25).rotate([0, 0, 15 + 30 * k]));

// ---------- vleugels ----------
// Elke vleugel in een eigen stelsel: oorsprong op een BAG-hoekpunt (RD), u langs de nok, v haaks erop (linksom).
// Footprint in (u, v) uit de BAG-contour; de grens tussen de zuidwest- en de zuidoostvleugel loopt van hun
// gezamenlijke hoekpunt naar het hart van de toren. Dak = twee vlakken z = nok - helling * |v - vNok| (AHN-dwarsprofiel).
const WINGS = {
  // Lage vleugel van één laag in het westen; loopt 1 m door tot in de hogere vleugel.
  west: { at: [81703.16, 400527.63], deg: 9.9, ridgeV: 3.25, ridge: 5.82, slope: 0.67, poly: [[0, 0], [19.5, 0], [19.5, 6.6], [0, 6.5]] },
  // Vleugel van twee bouwlagen naar het zuidwesten, tot in de toren.
  southwest: { at: [81721.38, 400530.81], deg: 37.5, ridgeV: 3.67, ridge: 9.22, slope: 0.69, poly: [[0, 0], [18.63, 0], [23.06, 6.93], [20, 7.45], [0, 7.35]] },
  // Lage vleugel naar het zuidoosten tot het buurhuis (pand 0851100000010841).
  southeast: { at: [81736.16, 400542.16], deg: -39.2, ridgeV: 3.0, ridge: 5.84, slope: 0.7, poly: [[0, 0], [20.37, 0], [19.18, 5.69], [14.0, 5.81], [14.01, 6.2], [7.71, 6.35], [7.7, 5.96], [3.9, 6.05], [-5.73, 5.9]] },
};
const frame = ({ at, deg }) => {
  const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t), ox = at[0] - ORIGIN[0], oy = at[1] - ORIGIN[1];
  return { c, s, ox, oy, toLocal: ([u, v]) => [ox + u * c - v * s, oy + u * s + v * c] };
};
// Houd z <= A x + B y + C.
const below = (m, A, B, C) => {
  const n = Math.hypot(A, B, 1);
  return m.trimByPlane([A / n, B / n, -1 / n], -C / n);
};
const gableWing = (w) => {
  const f = frame(w);
  // v = -s (x - ox) + c (y - oy); z <= ridge - slope (v - vNok) en z <= ridge + slope (v - vNok).
  const v0 = f.s * f.ox - f.c * f.oy;
  let m = prism(w.poly.map(f.toLocal), BASE, w.ridge + 1);
  m = below(m, w.slope * f.s, -w.slope * f.c, w.ridge + w.slope * w.ridgeV - w.slope * v0);
  m = below(m, -w.slope * f.s, w.slope * f.c, w.ridge - w.slope * w.ridgeV + w.slope * v0);
  return m;
};
const wings = Object.values(WINGS).map(gableWing);
// Plat aanbouwtje tussen de zuidoostvleugel en de toren (AHN NAP +4,1), in het stelsel van de zuidoostvleugel.
const annex = prism(
  [[3.9, 5.5], [4.13, 11.78], [2.13, 11.81], [1.0, 11.62], [-0.01, 11.25], [-0.84, 10.69], [-3, 7.5], [-1, 5.5]].map(frame(WINGS.southeast).toLocal),
  BASE,
  2.87,
);
// Schoorstenen (AHN-pieken): op de westgevel van de hoge vleugel, op de westgevel van de lage vleugel en op de nok
// van de zuidoostvleugel; 0,9 bij 1,0 m.
const chimney = (w, u, v, top) => prism([[u - 0.45, v - 0.5], [u + 0.45, v - 0.5], [u + 0.45, v + 0.5], [u - 0.45, v + 0.5]].map(frame(w).toLocal), 2, top);
const chimneys = [chimney(WINGS.southwest, 0.45, 3.67, 10.75), chimney(WINGS.west, 0.45, 3.25, 6.85), chimney(WINGS.southeast, 10.25, 2.8, 7.3)];

const tower = union([shaft, tank, eave, roof, lantern, ...wings, annex, ...chimneys]).subtract(union([...windows, ...glazing]));

await writeLandmark({
  slug: "watertoren-steenbergen-nieuwe-watertoren",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:ronde-toren-met-kegeldak-en-vleugels", tower]],
  catalog: {
    name: "Nieuwe watertoren (Steenbergen)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[9, 0], [-9, 0], [0, 9], [9, -9]],
    // Ellipsoïdisch: NAP +1,23 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.0851100000010832"],
    description:
      "Oorsprong op het hart van de toren uit het AHN-DSM op maaiveld (NAP +1,23 m), +X RD-oost. Ronde bakstenen schacht van 12,6 m met een boogjesfries op 25 m, zestien vensters onder de dakrand, zware ronde dakrand van 13,5 m tot 35,55 m, koperen kegeldak tot een ronde lantaarn met glasband en kap tot 39,85 m; aan de zuidkant de dienstvleugels uit hetzelfde BAG-pand (twee bouwlagen naar het zuidwesten, één laag naar het westen en het zuidoosten, zadeldaken uit het AHN) met drie schoorstenen en een plat aanbouwtje. Maten uit AHN, BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightM: 40.65,
      reservoirM3: 600,
      built: 1950,
      architect: "J.M. Hurks",
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 41.1,
      geoidNlgeo2018M: GEOID_N,
      shaftDiameterM: R.shaft * 2,
      eaveDiameterM: R.eave * 2,
      lanternDiameterM: R.lantern * 2,
      friezeM: H.frieze,
      eaveTopM: H.eaveTop,
      roofTopM: H.roofTop,
      apexM: H.apex,
      wingRidgesM: { west: WINGS.west.ridge, southwest: WINGS.southwest.ridge, southeast: WINGS.southeast.ridge },
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Steenbergen) (1950, J.M. Hurks, 40,65 m, 600 m³, kinderopvang sinds 2000)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_watertoren_-_Steenbergen_-_20346621_-_RCE.jpg (toren en vleugels van het zuiden, verticalen evenwijdig)",
      "https://commons.wikimedia.org/wiki/File:2010-09-11_12.13_Steenbergen,_watertoren_foto1.JPG en File:Steenbergen,_watertoren_foto4_2015-05-30_16.15.jpg (vensterkrans, fries, dakrand, lantaarn)",
      "https://commons.wikimedia.org/wiki/File:WatertorenSteenbergen.jpg (2008)",
      "PDOK BAG-pand 0851100000010832, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-03",
      "NLGEO2018-geoïdehoogte voor groundHeight, lineair geïnterpoleerd tussen naburige watertorenmodellen",
    ],
  },
});

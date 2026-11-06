// Watertoren van Woudenberg aan de Stationsweg Oost 202. Gebouwd in 1937 voor de N.V. Veenendaalse
// Waterleidingmaatschappij naar ontwerp van ir. A.A. Willems; 34,5 m hoog, één betonnen reservoir van 205 m³ met vier
// verdiepingen eronder, gemeentelijk monument (Wikipedia). Een zeskante toren met een betonskelet en een gestileerde
// bakstenen ommanteling in art-decostijl: op elke hoek een bakstenen lisene die aan de voet uitloopt in een schuine
// betonnen steunbeer, tussen de lisenen terugliggende wandvlakken. In het noordoostvlak de ingang met een dubbele deur,
// daarboven twee betonnen platen met een lichtstrook ertussen, en vier vensters boven elkaar met betonnen lateien;
// naast de ingang smalle vensters onder een latei. Onder het reservoir drie betonnen banden tussen de lisenen, in het
// reservoirdeel een smalle lichtspleet per vlak, bovenaan een betonnen kroonlijst met hekwerk rond een laag zeskant
// tentdak (foto Commons, luchtfoto).
//
// Oorsprong op het hart van de regelmatige zeshoek van BAG-pand 0351100000007399 (gemiddelde van de middens van de zes
// zijden; apothema 3,82 tot 3,91, gemiddeld 3,86 m). De BAG-contour volgt ook de zes steunberen: 1,33 m uitstekend,
// 0,35 m breed, tot 5,7 m van het hart. Lokale X-as 48,27 graden linksom van RD-oost, loodrecht op het vlak met de
// ingang (de zijden van de zeshoek lopen op 18,27 + k maal 60 graden); de vlakken staan dan op k maal 60 graden, de hoeken
// op 30 + k maal 60. Hoeken hieronder in graden linksom vanaf de lokale X-as. Maaiveld AHN-DTM NAP +5,42.
// Maten: tentdak uit het AHN-DSM 0,5 m (top NAP +39,23, helling 0,76 tot 0,8 langs alle zes vlakken; 3D BAG nok
// NAP +39,41) en de luchtfoto (zes graten); de opstand uit de foto "Woudenberg watertoren 2721.png" (Commons, frontaal
// op het ingangsvlak), ontzerrd met een camerapositie die het maaiveld, de kroonlijst en de breedte van het vlak onder en
// boven laat kloppen (circa 21 m afstand). Vensters op 4,4, 9,2, 14,2 en 19,2 m: de vier verdiepingen onder het reservoir.
import { Manifold, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [159815.06, 454677.36];
const AXIS_DEG = 48.27;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 5.42;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (noordoost 48,77, zuidoost 48,83, zuidwest 48,74,
// noordwest 49,51 op de berm), gemeten 2026-11-06. Het PDOK-pand staat op 48,70.
const GROUND_ELLIPSOID = 48.74;

const rad = (deg) => (deg * Math.PI) / 180;
const hexagon = (apothem, phase = 30) => Array.from({ length: 6 }, (_, k) => {
  const r = apothem / Math.cos(rad(30));
  return [r * Math.cos(rad(phase + 60 * k)), r * Math.sin(rad(phase + 60 * k))];
});
const ring = (apothem, z) => hexagon(apothem).map(([x, y]) => [x, y, z]);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const FACES = [0, 60, 120, 180, 240, 300];
const CORNERS = [30, 90, 150, 210, 270, 330];
// Profiel (u naar buiten, z) over de breedte |v| <= w/2 in het vlak met normaal +X, verschoven over v0.
const profile = (pts, w, v0 = 0) => hull(pts.flatMap(([u, z]) => [[u, v0 - w / 2, z], [u, v0 + w / 2, z]]));
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 56 graden op.
const niche = (f, w, z0, z1, depth = 0.3, v0 = 0) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]
    .map(([u, v, z]) => [u, v + v0, z]));
};

// ---------- maten (meter boven het maaiveld, NAP +5,42) ----------
const A = {
  lisene: 3.86, // BAG: apothema van de zeshoek, voorvlak van de hoeklisenen
  panel: 3.56, // wandvlakken tussen de lisenen, 0,3 m terug
  plinth: 3.98, // betonnen plint
  coping: 4.16, // kroonlijst
  copingTop: 4.0, // bovenste rand van de kroonlijst
  roof: 3.56, // binnenkant van de borstwering, voet van het tentdak
};
const PANEL_HALF = 1.65; // wandvlak 3,3 m breed (foto); de lisenen zijn 0,58 m breed aan weerszijden van elke hoek
const H = {
  plinth: 0.4,
  panelFoot: 0.5,
  bands: 21.05, // onderkant van de betonnen banden (foto)
  bandsTop: 22.15,
  slit: [23.6, 29.4], // lichtspleten in het reservoirdeel
  panelTop: 30.4,
  wallTop: 30.9, // onderkant van de kroonlijst (foto)
  coping: 31.45,
  copingTop: 31.75, // bovenkant kroonlijst (foto; AHN-dakrand NAP +36,9 à +37,3 binnen de borstwering)
  roofFoot: 31.1,
  apex: 33.81, // AHN-DSM NAP +39,23
};

// ---------- toren ----------
const shaft = prism(hexagon(A.lisene), BASE, H.wallTop + 0.01);
const plinth = hull([...ring(A.plinth, BASE), ...ring(A.plinth, H.plinth), ...ring(A.lisene, H.plinth + 0.12)]);
const panels = union(around(niche(A.lisene, 2 * PANEL_HALF, H.panelFoot, H.panelTop, A.lisene - A.panel), FACES));
// Kroonlijst: onderkant 50 graden vanaf de muur, daarboven een terugliggende rand; binnen de borstwering het tentdak.
const coping = union([
  hull([...ring(A.lisene, H.wallTop), ...ring(A.coping, H.wallTop + 0.36), ...ring(A.coping, H.coping), ...ring(A.lisene, H.coping)]),
  prism(hexagon(A.copingTop), H.wallTop + 0.3, H.copingTop),
]).subtract(prism(hexagon(A.roof), H.roofFoot, H.copingTop + 1));
const roof = hull([...ring(A.roof + 0.02, H.roofFoot - 0.5), ...ring(A.roof + 0.02, H.roofFoot + 0.015), [0, 0, H.apex]]);
// Steunberen: op elke hoek een betonnen beer die aan de voet 1,33 m uitsteekt (BAG, tot 5,7 m van het hart) en naar de
// bovenkant op 2,36 m (foto) terugloopt tot 0,35 m voor de hoek. In het echt 0,35 m breed, hier 0,9 m.
const CORNER_R = A.lisene / Math.cos(rad(30));
const buttress = hull([-0.45, 0.45].flatMap((y) => [[CORNER_R - 0.6, y, BASE], [5.7, y, BASE], [5.7, y, 0], [CORNER_R + 0.35, y, 2.36], [CORNER_R - 0.6, y, 2.36]]));
const buttresses = union(around(buttress, CORNERS));
// Betonnen banden onder het reservoir tussen de lisenen: een smalle en een bredere, onderkant 50 graden.
const bands = union(around(union([
  profile([[A.panel - 0.05, H.bands], [A.panel + 0.25, H.bands + 0.3], [A.panel + 0.25, H.bands + 0.55], [A.panel - 0.05, H.bands + 0.55]], 2 * PANEL_HALF + 0.04),
  profile([[A.panel - 0.05, H.bands + 0.5], [A.panel + 0.25, H.bands + 0.5], [A.panel + 0.45, H.bands + 0.74], [A.panel + 0.45, H.bandsTop], [A.panel - 0.05, H.bandsTop]], 2 * PANEL_HALF + 0.04),
]), FACES));
// Ingang in het noordoostvlak: dubbele deur (1,65 m breed, tot 2,0 m), daarboven een betonnen plaat over het hele
// wandvlak met een lichtstrook en een tweede plaat tot 2,92 m (foto). Onderkant onder 50 graden.
const canopy = profile([[A.panel - 0.05, 2.0], [A.panel + 0.34, 2.42], [A.panel + 0.34, 2.92], [A.panel - 0.05, 2.92]], 2 * PANEL_HALF + 0.04);
// Lateien boven de vensters: 2,0 m breed (naast de ingang 1,3 m), 0,35 m hoog, 0,15 m voor het wandvlak.
const lintel = (z, w, v0 = 0) => profile([[A.panel - 0.05, z], [A.panel + 0.15, z + 0.2], [A.panel + 0.15, z + 0.35], [A.panel - 0.05, z + 0.35]], w, v0);
const frontWindows = [[4.4, 5.45], [9.15, 10.2], [14.15, 15.3], [19.2, 20.45]];
const SIDE_V = 1.1; // smalle vensters naast de ingang, aan de kant van de ingang (foto)
const sideLintels = [place(lintel(1.75, 1.3, -SIDE_V), { deg: 60 }), place(lintel(1.75, 1.3, SIDE_V), { deg: -60 })];
const solid = union([
  shaft.subtract(panels), plinth, coping, roof, buttresses, bands, canopy,
  ...frontWindows.map(([, z1]) => lintel(z1 + 0.05, 2.0)), ...sideLintels,
]);

// Vensters, deur en lichtspleten als blinde nissen:
// - de deur in het noordoostvlak en de lichtstrook tussen de platen erboven;
// - vier vensters boven elkaar in het noordoostvlak (1,5 m breed, 1,05 tot 1,25 m hoog);
// - naast de ingang, in de twee aangrenzende vlakken, smalle dubbele vensters van 0,55 tot 1,75 m (als één nis van 0,9 m);
// - per vlak een lichtspleet in het reservoirdeel, in het echt circa 0,25 m breed, hier 0,7 m zodat hij op 1:1000 te zien is.
const openings = union([
  niche(A.panel, 1.65, 0, 2.0),
  niche(A.panel + 0.34, 2.8, 2.48, 2.66, 0.15),
  ...frontWindows.map(([z0, z1]) => niche(A.panel, 1.5, z0, z1)),
  place(niche(A.panel, 0.9, 0.55, 1.75, 0.3, -SIDE_V), { deg: 60 }),
  place(niche(A.panel, 0.9, 0.55, 1.75, 0.3, SIDE_V), { deg: -60 }),
  ...around(niche(A.panel, 0.7, H.slit[0], H.slit[1]), FACES),
]);

const all = solid.subtract(openings).trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-woudenberg",
  base: BASE,
  nodes: [["building:watertoren-schacht-reservoir-kroonlijst-en-tentdak", all]],
  catalog: {
    name: "Watertoren Woudenberg",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[7, 0], [0, 7], [-7, 0], [0, -7]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0351100000007399"],
    description:
      "Oorsprong op het hart van de zeskante BAG-voetafdruk (apothema 3,86 m) op het maaiveld (NAP +5,42 m), X-as 48,27 graden linksom van RD-oost loodrecht op het ingangsvlak (noordoost). Zeskante bakstenen toren met hoeklisenen en terugliggende wandvlakken, zes schuine betonnen steunberen aan de voet, ingang met dubbele deur en twee betonnen platen, vier vensters met lateien boven elkaar, betonnen banden op 21 tot 22,15 m onder het reservoir, lichtspleten in het reservoirdeel, kroonlijst tot 31,75 m en zeskant tentdak tot 33,81 m. Maten uit BAG, AHN en een foto.",
    realWorld: {
      built: 1937,
      architect: "ir. A.A. Willems",
      client: "N.V. Veenendaalse Waterleidingmaatschappij",
      publishedHeightM: 34.5,
      reservoirM3: 205,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 39.23,
      ahnRoofSlope: 0.77,
      hexagonApothemM: A.lisene,
      panelSetbackM: +(A.lisene - A.panel).toFixed(2),
      buttressReachM: 5.7,
      bandsM: [H.bands, H.bandsTop],
      windowsM: frontWindows.map(([z]) => z),
      copingTopM: H.copingTop,
      topM: H.apex,
      entranceDegrees: 0,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Woudenberg) (1937, ir. A.A. Willems, 34,5 m, één reservoir van 205 m³, vier verdiepingen eronder, betonskelet met gestileerde baksteenarchitectuur, gemeentelijk monument)",
      "https://commons.wikimedia.org/wiki/File:Woudenberg_watertoren_2721.png (frontaal op het ingangsvlak: steunberen, ingang met twee platen, vier vensters met lateien, drie banden, lichtspleten, kroonlijst met hekwerk)",
      "PDOK BAG-pand 0351100000007399, AHN DSM/DTM 0,5 m, 3D BAG (nok NAP +39,41, dak 'slanted') en luchtfoto (Actueel_orthoHR: zeskant tentdak, vensters in het noordoostvlak), 2026-11-06",
    ],
  },
});

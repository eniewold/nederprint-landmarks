// Watertoren van Bunnik (ook "watertoren van Werkhoven") aan de Watertorenweg, in de polder tussen Bunnik en
// Werkhoven. Gebouwd in 1937, 43,3 m hoog volgens Wikipedia, reservoir van 306 m³; sinds 2008 gemeentelijk monument,
// nu woning, horeca en atelier. Een slanke rechthoekige betonnen toren (bijna vierkant, 10,65 × 10,30 m) zonder
// uitkragend reservoir: het reservoir zit achter de gladde bovenste gevels. Onder een roze gepleisterde onderbouw van
// circa 12 m met een smalle lijst, daarboven de grijze (sinds de verbouwing rond 2013 wit gepleisterde) schacht met
// enkele spleetvensters, een hoog venster op elke gevel vlak onder de goot en een rondboogvenster op de oostgevel. Bij
// de verbouwing kwam in de westgevel een lange vensterstrook in drie delen. Bovenop een overstekend schilddak met
// pannen (zo goed als een piramide) en een bolletje op de top. Tegen de westgevel een lage aanbouw (serre met een
// donker dak), die in hetzelfde BAG-pand zit.
//
// Oorsprong op het hart van de toren in BAG-pand 0312100000004667 (de vier hoeken van de toren; de top van het dak in
// het AHN-DSM ligt 0,04 m ernaast) op het maaiveld: AHN-DTM NAP +3,42 (ring van 6,5 tot 9 m: 3,39 tot 3,49). +X wijst
// naar RD-richting 4,63 graden (de zuid- en noordgevel van de BAG), +Y naar 94,63 graden (noord). Maten: gevels uit de
// BAG (10,65 m langs X, 10,30 m langs Y); dak uit het AHN-DSM 0,5 m: piramide met hellingen van 0,573 tot 0,576
// (29,9 graden) op alle vier de vlakken, top NAP +46,27 (42,85 m), dakrand op circa 6,05 m van het hart (overstek
// 0,7 tot 0,9 m); aanbouw uit BAG en DSM (NAP +4,8 tot +6,0, een glazen dak). Geledingen en vensters uit de foto's
// "Old watertower with nice reflections near Werkhoven - panoramio.jpg" (2014, vanuit het westzuidwesten langs de
// waterloop: west- en zuidgevel, 25,2 px/m, verankerd op de dakrand uit het AHN) en "Werkhoven, watertoren foto6
// 2012-05-29 10.54.JPG" (zelfde richting, 2012, voor de vensterstrook), oost- en zuidgevel uit "Werkhoven Watertoren
// 8896.JPG" (vanaf de weg in het zuidoosten).
import { hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [146531.42, 446175.98];
const AXIS_DEG = 4.63;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.42;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: oost 46,83, west (voorbij
// de aanbouw) 46,86, noord 46,90, zuid 46,91; het hele erf is vlak (erf, 46,74 tot 46,94).
const GROUND_ELLIPSOID = 46.83;

// ---------- maten (meters boven het maaiveld) ----------
const W = { u: 5.33, v: 5.15 }; // halve gevelbreedtes (BAG)
const H = {
  plinth: 0.9, // bakstenen plint, 0,08 m voor de gevel
  band: [11.9, 12.15], // lijst tussen de roze onderbouw en de schacht
  soffit: 37.9, // aansluiting van de schuine overstek op de gevel
  fascia: [39.08, 39.38], // boeiboord van het schilddak
  apex: 42.85, // top van de piramide (AHN NAP +46,27)
  finial: 43.3, // bovenkant van het bolletje (Wikipedia 43,30 m)
};
const ROOF = { half: 6.05, slope: 0.574 };
const ANNEX = { u0: -10.33, zWall: 2.6, zEdge: 2.0 };

// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar
// binnen onder 63 graden op, buiten de gevel loopt de snede schuin af.
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, za = z1 + 2 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [f + 1, -w / 2, z0], [a, w / 2, z0], [f + 1, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [f + 1, -w / 2, zb], [f + 1, w / 2, zb]]).translate([0, y, 0]);
};
// Rondboognis: als niche, met een halfrond (7 punten) vanaf de aanzet zSpring.
const archNiche = (f, w, z0, zSpring, depth = 0.3, y = 0) => {
  const r = w / 2;
  const arc = Array.from({ length: 7 }, (_, k) => {
    const t = (Math.PI * k) / 6;
    return [-r * Math.cos(t), zSpring + r * Math.sin(t)];
  });
  const a = f - depth;
  return hull([
    ...arc.map(([v, z]) => [a, v, z + 2 * depth]),
    ...arc.map(([v, z]) => [f, v, z]),
    ...arc.map(([v, z]) => [f + 1, v, Math.max(z0, z - 1.5)]),
    [a, -r, z0], [a, r, z0], [f + 1, -r, z0], [f + 1, r, z0],
  ]).translate([0, y, 0]);
};
// Gevels: draaihoek en afstand; s is de modelcoördinaat langs de gevel (Y bij oost en west, X bij noord en zuid).
const FACES = {
  oost: { deg: 0, f: W.u, y: (s) => s },
  noord: { deg: 90, f: W.v, y: (s) => -s },
  west: { deg: 180, f: W.u, y: (s) => -s },
  zuid: { deg: -90, f: W.v, y: (s) => s },
};
const win = (face, s, w, z0, z1, depth = 0.3) => place(niche(FACES[face].f, w, z0, z1, depth, FACES[face].y(s)), { deg: FACES[face].deg });
const arch = (face, s, w, z0, zSpring) => place(archNiche(FACES[face].f, w, z0, zSpring, 0.3, FACES[face].y(s)), { deg: FACES[face].deg });

// ---------- toren ----------
const shaft = box(-W.u, -W.v, BASE, W.u, W.v, H.soffit + 0.01);
// Plint van baksteen, 0,08 m voor de gevel met een schuine afdekking.
const plinth = hull([
  [-W.u - 0.08, -W.v - 0.08, BASE], [W.u + 0.08, -W.v - 0.08, BASE], [W.u + 0.08, W.v + 0.08, BASE], [-W.u - 0.08, W.v + 0.08, BASE],
  [-W.u - 0.08, -W.v - 0.08, H.plinth], [W.u + 0.08, -W.v - 0.08, H.plinth], [W.u + 0.08, W.v + 0.08, H.plinth], [-W.u - 0.08, W.v + 0.08, H.plinth],
  [-W.u, -W.v, H.plinth + 0.08], [W.u, -W.v, H.plinth + 0.08], [W.u, W.v, H.plinth + 0.08], [-W.u, W.v, H.plinth + 0.08],
]);
// Lijst tussen onderbouw en schacht: 0,12 m uit, onderkant onder 50 graden.
const rectAt = (d, z) => [[-W.u - d, -W.v - d, z], [W.u + d, -W.v - d, z], [W.u + d, W.v + d, z], [-W.u - d, W.v + d, z]];
const band = hull([...rectAt(0, H.band[0] - 0.15), ...rectAt(0.12, H.band[0]), ...rectAt(0.12, H.band[1]), ...rectAt(0, H.band[1] + 0.1)]);

// Vensters. Onderbouw: twee rijen (4,8–6,4 en 8,0–9,6 m), in de zuidgevel het hoge trappenhuisvenster en in de
// oostgevel de deur. Schacht: spleetvensters (als nis van 0,4 m), de vensterstrook in het westen, het
// rondboogvenster in het oosten en onder de goot op elke gevel een hoog venster.
const ROW_LO = [4.8, 6.4];
const ROW_HI = [8.0, 9.6];
const TOP = [35.3, 37.2];
const openings = union([
  // west (vensterstrook in het midden, aanbouw ervoor tot 2,6 m)
  win("west", 0, 1.2, 20.9, 24.6), win("west", 0, 1.2, 16.5, 20.0), win("west", 0, 1.2, 12.5, 15.6),
  win("west", 0, 0.4, 26.3, 28.0),
  win("west", 0, 1.4, ...ROW_HI), win("west", 3.6, 1.4, ...ROW_HI), win("west", 0, 1.2, ...ROW_LO), win("west", 3.6, 1.2, ...ROW_LO),
  // zuid
  win("zuid", -0.5, 1.0, 4.4, 9.6), win("zuid", -3.5, 1.2, ...ROW_HI), win("zuid", 3.5, 1.0, ...ROW_LO),
  win("zuid", 0, 0.4, 14.1, 15.7),
  // oost (ingang)
  win("oost", -4.1, 1.1, 0.0, 2.3, 0.35), win("oost", 1.2, 1.2, ...ROW_HI), win("oost", 3.8, 1.2, ...ROW_HI),
  win("oost", 1.2, 1.2, ...ROW_LO), win("oost", 3.8, 1.2, ...ROW_LO),
  arch("oost", 0, 1.0, 29.0, 30.6),
  // noord (achter het bijgebouw uit 2013; geschat, symmetrisch aan de zuidgevel)
  win("noord", -3.5, 1.2, ...ROW_HI), win("noord", 3.5, 1.2, ...ROW_HI), win("noord", -3.5, 1.2, ...ROW_LO), win("noord", 3.5, 1.2, ...ROW_LO),
  // hoge vensters onder de goot
  ...Object.keys(FACES).map((face) => win(face, 0, 1.2, ...TOP)),
]);
const tower = union([shaft, plinth, band]).subtract(openings);

// ---------- schilddak ----------
// Piramide z = 42,85 - 0,574 · max(|x|, |y|) tot de dakrand op 6,05 m, boeiboord van 0,3 m, en een schuine overstek
// van de onderkant van het boeiboord naar de gevel op 37,9 m (53 tot 59 graden).
const S = ROOF.half;
const eaves = H.apex - ROOF.slope * S;
const roof = hull([
  ...[[-1, -1], [1, -1], [1, 1], [-1, 1]].flatMap(([a, b]) => [[a * S, b * S, H.fascia[0]], [a * S, b * S, eaves]]),
  ...rectAt(0, H.soffit),
  [0, 0, H.apex],
]);
// Bolletje op de top (0,9 m doorsnede) op een korte hals.
const ball = (() => {
  const r = 0.45, c = H.finial - r, n = 10;
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = -Math.PI / 4 + ((Math.PI * 3) / 4) * (i / n); // van 45 graden onder tot de top
    for (let k = 0; k < 12; k++) {
      const p = (2 * Math.PI * k) / 12;
      pts.push([r * Math.cos(t) * Math.cos(p), r * Math.cos(t) * Math.sin(p), c + r * Math.sin(t)]);
    }
  }
  // De hals loopt onder 45 graden in het dak.
  pts.push([0, 0, H.apex - 0.6]);
  return hull(pts);
})();

// ---------- aanbouw tegen de westgevel ----------
// Lessenaarsdak van 2,6 m tegen de toren naar 2,0 m aan de westkant (glazen dak, DSM NAP +4,8 tot +6,0), met een
// dakrand van 0,1 m.
const annex = hull([
  [ANNEX.u0, -W.v, BASE], [ANNEX.u0, W.v, BASE], [-W.u + 0.01, -W.v, BASE], [-W.u + 0.01, W.v, BASE],
  [ANNEX.u0, -W.v, ANNEX.zEdge], [ANNEX.u0, W.v, ANNEX.zEdge], [-W.u + 0.01, -W.v, ANNEX.zWall], [-W.u + 0.01, W.v, ANNEX.zWall],
]);
const annexRim = hull([
  [ANNEX.u0, -W.v, ANNEX.zEdge - 0.3], [ANNEX.u0, W.v, ANNEX.zEdge - 0.3], [ANNEX.u0 + 0.9, -W.v, ANNEX.zEdge - 0.3], [ANNEX.u0 + 0.9, W.v, ANNEX.zEdge - 0.3],
  [ANNEX.u0, -W.v, ANNEX.zEdge + 0.1], [ANNEX.u0, W.v, ANNEX.zEdge + 0.1], [ANNEX.u0 + 0.9, -W.v, ANNEX.zEdge + 0.1], [ANNEX.u0 + 0.9, W.v, ANNEX.zEdge + 0.1],
]);
// Glazen gevels van de aanbouw als drie ondiepe nissen per zijde (0,2 m), onder de dakrand.
const annexGlass = union([
  ...[-3.3, 0, 3.3].map((y) => place(niche(-ANNEX.u0, 2.6, 0.3, 1.6, 0.2, -y), { deg: 180 })),
  ...[-9.0, -6.7].map((x) => place(niche(W.v, 1.8, 0.3, 1.5, 0.2, x), { deg: -90 })),
  ...[-9.0, -6.7].map((x) => place(niche(W.v, 1.8, 0.3, 1.5, 0.2, -x), { deg: 90 })),
]);
const aanbouw = union([annex, annexRim]).subtract(annexGlass);

const all = union([tower, roof, ball, aanbouw]);

await writeLandmark({
  slug: "watertoren-bunnik",
  base: BASE,
  nodes: [["building:watertoren-onderbouw-schacht-schilddak-en-aanbouw", all]],
  catalog: {
    name: "Watertoren Bunnik",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[8, 0], [-12, 0], [0, 7.5], [0, -7.5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0312100000004667"],
    description:
      "Oorsprong op het hart van de toren in het BAG-pand op het maaiveld (NAP +3,42 m), +X naar RD-richting 4,63 graden (oost, ingang), +Y naar 94,63 graden (noord). Rechthoekige toren van 10,65 × 10,30 m: bakstenen plint, roze onderbouw met twee rijen vensters, het trappenhuisvenster in het zuiden en de deur in het oosten, lijst op 12,15 m; gladde schacht met spleetvensters, de vensterstrook in het westen, een rondboogvenster in het oosten en een hoog venster op elke gevel onder de goot; overstekend schilddak (piramide van 30 graden, dakrand 12,1 m breed op 39,4 m, top 42,85 m) met een bolletje tot 43,3 m; lage aanbouw met lessenaarsdak tegen de westgevel. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1937,
      publishedHeightM: 43.3,
      reservoirM3: 306,
      gemeentelijkMonument: 2008,
      ahnGroundNapM: GROUND_NAP,
      ahnApexNapM: 46.27,
      ahnRoofSlope: ROOF.slope,
      wallsM: [W.u * 2, W.v * 2],
      roofEdgeM: S * 2,
      eavesM: +eaves.toFixed(2),
      bandM: H.band,
      apexM: H.apex,
      topM: H.finial,
      annexM: [-ANNEX.u0 - W.u, W.v * 2, ANNEX.zWall],
      photoScalePxPerM: 25.2,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Bunnik) (1937, 43,30 m, 306 m³, Watertorenweg, gemeentelijk monument sinds 2008)",
      "https://commons.wikimedia.org/wiki/File:Old_watertower_with_nice_reflections_near_Werkhoven_-_panoramio.jpg (2014, west- en zuidgevel, schaal 25,2 px/m)",
      "https://commons.wikimedia.org/wiki/File:Werkhoven,_watertoren_foto6_2012-05-29_10.54.JPG (2012, west- en zuidgevel voor de verbouwing)",
      "https://commons.wikimedia.org/wiki/File:Werkhoven_Watertoren_8896.JPG (zuid- en oostgevel, ingang)",
      "https://commons.wikimedia.org/wiki/File:WatertorenWerkhoven.jpg, File:Watertoren_Werkhoven_sloot.JPG, File:Watertoren_Werkhoven_landschap.JPG, File:Watertoren_Werkhoven.jpg, File:Werkhoven..jpg (silhouet, dak, bolletje, wit gepleisterd na de verbouwing)",
      "PDOK BAG-pand 0312100000004667, BGT, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

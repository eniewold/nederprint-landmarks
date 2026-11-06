// Watertoren van Lopik aan de Damweg 3, tussen Lopik en Polsbroekerdam. Gebouwd in 1936 naar ontwerp van bouwbedrijf
// MABEG, 47 m hoog (Wikipedia, met de piek), één reservoir van 400 m³. Een ronde bakstenen schacht zonder taps, met één
// lichte band op ongeveer driekwart hoogte (de vloer van het reservoir), een rij van acht kleine vensters vlak onder de
// goot en een vlakke koperen kegel met een kleine overstek en een piek. In 2022 tot 2023 verbouwd tot zes woningen, een
// bed & breakfast en een multifunctionele ruimte; aan de westkant kwam een aanbouw met lift en trappenhuis en kwamen
// balkons (Wikipedia, bestemmingsplan Watertoren Damweg).
//
// Oorsprong op het hart van de ronde BAG-voetafdruk (pand 0331100000250018, cirkel door 22 hoekpunten, straal 6,04 m,
// afwijking hooguit 0,02 m); de top in het AHN-DSM 0,5 m ligt er op 0,2 m na boven. Maaiveld AHN-DTM NAP +0,1 (ring van
// 5 tot 8 m: -0,04 tot +0,17). Lokale assen gelijk aan RD (+X oost, +Y noord); hoeken hieronder in graden linksom vanaf
// oost.
// Maten: dak en piek uit het AHN-DSM (hart NAP +44,05, op 5 m van het hart +41,04, goot +40,6); de band, de vensters en de
// overstek uit de foto's "Lopik watertoren.JPG" (2008) en "De 47 meter hoge watertoren aan de Damweg tussen Lopik en
// Polsbroerdam.jpg" (2015, Commons), geschaald op de BAG-doorsnede van 12,08 m en de goothoogte uit het AHN. Het AHN
// (2022) en de foto's zijn van vóór de verbouwing: de aanbouw komt uit de luchtfoto's van 2023, 2024 en 2025 (PDOK,
// 8 cm). Zijn witte dak en de hoeken van de koperen kegel verschuiven per jaar elk met hun hoogte maal de kantelvector
// van de opname; uit drie opnames volgt dat het dak van de aanbouw net onder de goot ligt (circa 40 m) en waar hij staat.
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [122285.43, 444148.61];
const AXIS = [1, 0];
const GROUND_NAP = 0.1;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 43,69, west 42,53, noord 43,04, zuid 42,92),
// gemeten 2026-11-06. Het PDOK-terrein loopt van west (42,4 à 42,5) naar oost (43,7 à 43,8) op; het PDOK-pand staat
// op 42,45.
const GROUND_ELLIPSOID = 42.53;

const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const solidRev = (profile) => rev([[0, profile[0][1]], ...profile, [0, profile[profile.length - 1][1]]]);
// Schijf tot r1 tussen z0 en z1, met een onderkant van 50 graden vanaf de straal rIn (massief tot de as).
const ledge = (rIn, r1, z0, z1) => rev([[0, z0 - 1.2 * (r1 - rIn)], [rIn, z0 - 1.2 * (r1 - rIn)], [r1, z0], [r1, z1], [0, z1]]);
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 56 graden op.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const every = (n, from = 0) => Array.from({ length: n }, (_, k) => from + (360 * k) / n);
const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];

// ---------- hoogtes boven het maaiveld (NAP +0,1) ----------
const H = {
  band: [31.45, 31.95], // lichte band op de vloer van het reservoir (foto's: 8,4 à 8,7 m onder de goot)
  topWindows: [37.9, 39.1], // acht kleine vensters vlak onder de goot
  soffit: 39.8, // onderkant van de overstek tegen de gevel
  fascia: [40.22, 40.47], // goot (AHN NAP +40,6 op 6 à 6,5 m)
  knee: 40.95, // dak op 5 m van het hart (AHN NAP +41,04)
  apex: 43.5, // voet van de piek (AHN NAP +43,84 op het hart, met de piek)
  finial: 45.25, // piek (op de foto's circa 1,5 m boven het dak, dunner dan 0,9 m: als kegel)
  annexDeck: 39.6, // dak van de aanbouw (luchtfoto's: circa 40 m)
  liftTop: 40.4, // liftschacht (wit dak op de luchtfoto's, net onder de goot)
};
const R = {
  wall: 6.04, // BAG: 12,08 m doorsnede, recht (geen taps op de foto's)
  band: 6.24,
  eave: 6.39, // goot 0,35 m buiten de gevel (foto's)
  knee: 5.0,
  finial: 0.45,
};

// ---------- toren ----------
const shaft = solidRev([[R.wall, BASE], [R.wall, H.soffit + 0.01]]);
const band = ledge(R.wall, R.band, ...H.band);
// Koperen dak: overstek met een onderkant van 50 graden, goot, flauwere voet (20 graden) tot 5 m, kegel van 29 graden en
// de piek.
const roof = rev([
  [0, H.soffit - 0.5], [R.wall - 0.01, H.soffit - 0.5], [R.wall - 0.01, H.soffit], [R.eave, H.fascia[0]], [R.eave, H.fascia[1]],
  [R.knee, H.knee], [R.finial, H.apex], [R.finial, H.apex + 0.25], [0, H.finial],
]);
// Vensters als blinde nissen van 0,9 m breed:
// - acht kleine vensters vlak onder de goot (op de foto's om de 45 graden);
// - de oude trappenhuisvensters aan de zuidzijde (foto 2015: van 14,3 tot 17,2 m en van circa 28,6 tot 30,6 m);
// - de nieuwe vensters aan de noordnoordwestkant (luchtfoto's 2023 en 2025: een kolom op 110 graden, op circa 5,5, 15,
//   23 en 31 m).
const windows = union([
  ...around(niche(R.wall, 0.9, ...H.topWindows, 0.3), every(8, 22.5)),
  ...around(niche(R.wall, 0.9, 14.3, 17.2, 0.3), [290]),
  ...around(niche(R.wall, 0.9, 28.6, 30.6, 0.3), [290]),
  ...[[4.8, 6.4], [14.2, 15.8], [22.2, 23.8], [29.0, 30.6]].flatMap(([z0, z1]) => around(niche(R.wall, 0.9, z0, z1, 0.3), [110])),
]);
const tower = union([shaft, band, roof]).subtract(windows);

// ---------- aanbouw aan de westkant ----------
// Lift en trappenhuis met balkons: een sikkel van 150 tot 225 graden tegen de gevel, glaslijn op 8,4 m van het hart, met
// op elke verdieping (om de 4,4 m) een balkonplaat van 0,9 m dik tot 8,8 m met een onderkant van 50 graden. Aan de
// noordkant de ronde liftschacht (wit dak op de luchtfoto's): doorsnede 3,2 m, hart op 7,6 m en 146 graden, tot 40,4 m.
const A = { from: 150, to: 225, inner: 5.5, glass: 8.4, slab: 8.8, floor: 4.4 };
const wedge = (() => {
  const pts = [[0, 0]];
  for (let k = 0; k <= 30; k++) pts.push(polar(12, A.from + ((A.to - A.from) * k) / 30));
  return prism(pts, BASE - 1, 50);
})();
const annexCore = rev([[A.inner, BASE], [A.glass, BASE], [A.glass, H.annexDeck], [A.inner, H.annexDeck]]);
const slab = (z) => rev([[A.glass - 0.1, z - 1.38], [A.glass, z - 1.38], [A.slab, z - 0.9], [A.slab, z], [A.glass - 0.1, z]]);
const slabs = union([...Array.from({ length: 8 }, (_, k) => slab(A.floor * (k + 1))), slab(H.annexDeck)]);
const annex = union([annexCore, slabs]).intersect(wedge);
const lift = Manifold.cylinder(H.liftTop - BASE, 1.6, 1.6, 48).translate([...polar(7.6, 146), BASE]);

const all = union([tower, annex, lift]);

await writeLandmark({
  slug: "watertoren-lopik",
  base: BASE,
  nodes: [["building:watertoren-schacht-band-dak-en-aanbouw", all]],
  catalog: {
    name: "Watertoren Lopik",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[11, 0], [-11, 0], [0, 11], [0, -11]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0331100000250018"],
    description:
      "Oorsprong op het hart van de ronde BAG-voetafdruk (12,08 m) op het maaiveld (NAP +0,1 m), assen gelijk aan RD. Rechte bakstenen schacht met een band op 31,5 m, acht kleine vensters onder de goot en een vensterkolom aan de zuid- en de noordnoordwestkant; koperen kegeldak met overstek van 40,5 m tot 43,5 m en een piek tot 45,25 m; aan de westkant de aanbouw van 2023 met liftschacht, trappenhuis en balkons tot circa 40 m. Maten uit BAG, AHN, foto's en luchtfoto's.",
    realWorld: {
      built: 1936,
      architect: "MABEG",
      converted: 2022,
      publishedHeightM: 47,
      reservoirM3: 400,
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 40.6,
      ahnRoofAtFiveMetresNapM: 41.04,
      ahnTopNapM: 44.05,
      diameterM: R.wall * 2,
      bandM: H.band,
      eaveM: H.fascia[1],
      apexM: H.apex,
      topM: H.finial,
      annexDeckM: H.annexDeck,
      liftTopM: H.liftTop,
      annexDegrees: [A.from, A.to],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Lopik) (Damweg, 1936, MABEG, 47 m, 400 m³; 2022 verbouwd tot zes woningen, B&B en multifunctionele ruimte, aan de westkant lift en trappenhuis en balkons)",
      "https://commons.wikimedia.org/wiki/File:Lopik_watertoren.JPG (2008: schacht, band, vensters, dak met overstek en piek)",
      "https://commons.wikimedia.org/wiki/File:De_47_meter_hoge_watertoren_aan_de_Damweg_tussen_Lopik_en_Polsbroerdam.jpg (2015: idem, zuidzijde)",
      "https://www.ruimtelijkeplannen.nl/ (bestemmingsplan NL.IMRO.0331.01WatertorenDamweg-OM02: buitentrap, lift, balkons, uitkijkpunt bovenin)",
      "PDOK BAG-pand 0331100000250018, AHN DSM/DTM 0,5 m (2022) en luchtfoto's 2022 tot 2025, 2026-11-06",
    ],
  },
});

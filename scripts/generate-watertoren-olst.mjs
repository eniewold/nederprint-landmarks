// Watertoren van Olst aan de Watertorenstraat 1, gebouwd in 1962 naar ontwerp van P.J. de Gruyter en C. Poederoyen
// (Wikipedia: 41,55 m hoog, één reservoir van 900 m³; de toren was ook klokkentoren van de katholieke kerk ernaast). In
// 2004 door Vitens verkocht en vanaf 2006 verbouwd tot vijf appartementen van twee verdiepingen; daarbij kwam aan de
// oostkant een vrijstaande liftkoker met glazen en stalen loopbruggen naar de toren. De klokken en het kruis op de top zijn
// in 2016 verwijderd. Geen betonnen toren maar een achtkante toren van rode baksteen die naar boven iets verjongt, met een
// gemetselde voet onder een natuurstenen waterlijst, drie natuurstenen banden en een vierde band onder de klokkenstoel. Per
// zijde een venster per verdieping (tien rijen). Bovenin een open natuurstenen klokkenstoel: in elke zijde twee openingen
// tussen hoekpijlers met één zuil in het midden (nu met glazen balustrades als dakterras), een hoofdgestel en een licht
// overstekend, vlak achtkant koperen dak.
//
// Oorsprong op het hart van het achtkant van BAG-pand 1773100000011750 (gemiddelde van de acht hoekpunten; omgeschreven
// straal 5,52 m, apothema 5,10 m; de top in het AHN-DSM ligt er 0,2 m naast) op maaiveld, AHN-DTM NAP +4,25 (ring van 6
// tot 8 m: 4,1 tot 4,4). Lokale +X is de normaal van de oostelijke zijde van het achtkant (RD 8,95 graden, uit de acht
// hoekpunten); daar staat de liftkoker (in het BAG-pand opgenomen als rechthoek van 2,9 × 5,0 m). +Y wijst naar 98,95
// graden (noord), de deur zit in de zuidzijde (-Y).
// Maten: plattegrond uit de BAG; dakrand NAP +44,3 (40,05 m) en top NAP +45,55 (41,3 m), liftkoker NAP +39,5 (35,3 m) en
// bovenste loopbrug NAP +36,5 (32,3 m) uit het AHN-DSM 0,5 m; banden, vensterrijen, klokkenstoel en loopbruggen uit de foto
// "Olst, de watertoren IMG 2025 2018-04-07 11.43.jpg" (Commons, telelens vanuit het zuiden: 88,8 px/m, verankerd op de
// dakrand uit het AHN; de verjonging van 0,26 m in de apothema uit de breedte onder en boven op dezelfde foto, zie ook
// "20150716 Watertoren Olst.jpg" en "Olst Watertoren.JPG"); de deur met stenen omlijsting uit "Olst Watertoren 8280.JPG"
// (2006, vóór de liftkoker).
import { hull, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [204454.35, 483752.09];
const DEG = 8.95;
const AXIS = [+Math.cos((DEG * Math.PI) / 180).toFixed(5), +Math.sin((DEG * Math.PI) / 180).toFixed(5)];
const BASE = -0.3;
const GROUND_NAP = 4.25;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (noord 47,32, zuid 47,34, noordwest 47,32,
// zuidwest 47,30), gemeten 2026-11-06. De weg ten westen ligt op 7 m op 47,17; het PDOK-pand begint op 46,94.
const GROUND_ELLIPSOID = 47.3;

const COS8 = Math.cos(Math.PI / 8);
// Achthoek met apothema a op hoogte z; de zijden staan haaks op 0, 45, ... 315 graden.
const oct = (a, z) => Array.from({ length: 8 }, (_, k) => {
  const t = (Math.PI / 8) * (2 * k + 1);
  return [(a / COS8) * Math.cos(t), (a / COS8) * Math.sin(t), z];
});
// Afgeknotte achtkante piramide door een reeks [apothema, z] van onder naar boven.
const octStack = (rings) => hull(rings.flatMap(([a, z]) => oct(a, z)));
const FACES = Array.from({ length: 8 }, (_, k) => 45 * k);
const around = (m, degs) => degs.map((deg) => place(m, { deg }));

// Nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar binnen onder 56
// graden op, buiten de gevel loopt de snede schuin af (niet onder z0).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, out = Math.min(1, (z1 - z0) / 1.5), za = z1 + 1.5 * depth, zb = z1 - 1.5 * out;
  return hull([
    [a, -w / 2, z0], [f + out, -w / 2, z0], [a, w / 2, z0], [f + out, w / 2, z0],
    [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [f + out, -w / 2, zb], [f + out, w / 2, zb],
  ]).translate([0, y, 0]);
};

// ---------- hoogtes boven het maaiveld (NAP +4,25) ----------
const H = {
  sill: [5.0, 5.36], // natuurstenen waterlijst boven de gemetselde voet
  bands: [12.2, 19.8, 27.35], // natuurstenen banden, 0,7 m hoog
  band: 0.7,
  shaftTop: 34.7, // bovenkant van het metselwerk
  belfryBand: [34.7, 35.2], // band onder de klokkenstoel
  openings: [35.5, 38.8], // openingen van de klokkenstoel
  entablature: 39.25, // onderkant van het overstekende dakrand
  eave: [39.67, 40.05], // koperen boeiboord (AHN-DSM NAP +44,3)
  apex: 41.3, // top van het dak (AHN-DSM NAP +45,55)
};
// Apothema's.
const A = {
  foot: 5.1, // gemetselde voet (BAG)
  sill: 5.18,
  shaftFoot: 4.98, // verjongend tot 4,72 onder de klokkenstoel (foto: breedte boven 0,924 × onder)
  shaftTop: 4.72,
  band: 0.12, // uitsteek van de banden
  eave: 5.05, // dakrand (AHN-DSM: dak tot circa 5,0 m uit het hart)
};
const shaftA = (z) => A.shaftFoot + ((A.shaftTop - A.shaftFoot) * (z - H.sill[1])) / (H.shaftTop - H.sill[1]);

// ---------- voet, schacht en banden ----------
const foot = octStack([[A.foot, BASE], [A.foot, H.sill[0] - 0.02]]);
// Waterlijst: 0,08 m uitsteek met een onderkant van 50 graden.
const sill = octStack([[A.foot, H.sill[0] - 0.1], [A.sill, H.sill[0]], [A.sill, H.sill[1]], [shaftA(H.sill[1]), H.sill[1]]]);
const shaft = octStack([[A.shaftFoot, H.sill[1] - 0.05], [A.shaftTop, H.shaftTop + 0.01]]);
// Band van 0,7 m, 0,12 m uitstekend met een onderkant van 50 graden.
const band = (z0, z1, a0, a1) => octStack([[a0, z0 - 1.2 * A.band], [a0 + A.band, z0], [a1 + A.band, z1], [a1, z1]]);
const bands = union([
  ...H.bands.map((z) => band(z, z + H.band, shaftA(z), shaftA(z + H.band))),
  band(H.belfryBand[0], H.belfryBand[1], A.shaftTop, A.shaftTop),
]);

// ---------- vensters (tien rijen, in alle zijden behalve de oostzijde met de loopbruggen) ----------
// Bovenkant per rij; 1,25 m breed, 1,3 m hoog (de onderste rij net boven de waterlijst 1,0 m).
const WINDOW_TOPS = [6.45, 9.0, 11.85, 14.55, 18.9, 22.0, 24.75, 27.05, 31.55, 34.25];
const window = (top) => {
  const h = top < 7 ? 1.0 : 1.3;
  return niche(shaftA(top), 1.25, top - h, top, 0.3);
};
const WINDOW_FACES = FACES.filter((d) => d !== 0);
const windows = union(WINDOW_TOPS.flatMap((t) => around(window(t), WINDOW_FACES)));

// ---------- ingang (zuidzijde, -Y) ----------
// Natuurstenen omlijsting van 2,25 m breed tot onder de waterlijst, 0,12 m voor de voet; deur van 1,6 × 2,9 m als nis.
const DOOR = 270;
const doorFrame = place(box(A.foot - 0.1, -1.125, BASE, A.foot + 0.12, 1.125, H.sill[0] - 0.02), { deg: DOOR });
const door = place(niche(A.foot + 0.12, 1.6, 0, 2.9, 0.35), { deg: DOOR });

// ---------- klokkenstoel, hoofdgestel en dak ----------
const belfry = octStack([[A.shaftTop, H.belfryBand[1] - 0.05], [A.shaftTop, H.eave[0]]]);
// Per zijde (3,9 m) één verdiepte opening van 2,7 m tussen de hoekpijlers, 0,5 m diep (in het echt open met een terras
// erachter; dieper liet de export onder het boeiboord de hele opening opvullen); de zuil in het midden staat erin.
const RECESS = { w: 2.7, depth: 0.5 };
const recess = niche(A.shaftTop, RECESS.w, H.openings[0], H.openings[1], RECESS.depth);
// Zuil van 0,5 m (in het echt circa 0,45 m rond) tegen de achterwand, met een kapiteel dat onder 27 graden uitloopt.
const column = (() => {
  const x0 = A.shaftTop - RECESS.depth - 0.05, x1 = A.shaftTop - 0.15;
  return union([
    box(x0, -0.25, H.openings[0] - 0.05, x1, 0.25, 39.95),
    hull([
      [x0, -0.25, 38.2], [x1, -0.25, 38.2], [x0, 0.25, 38.2], [x1, 0.25, 38.2],
      [x0, -0.37, 38.45], [x1, -0.37, 38.45], [x0, 0.37, 38.45], [x1, 0.37, 38.45],
      [x0, -0.37, 39.95], [x1, -0.37, 39.95], [x0, 0.37, 39.95], [x1, 0.37, 39.95],
    ]),
  ]);
})();
// Overstekend boeiboord: 0,33 m uit de gevel met een onderkant van 52 graden, daarop een vlak achtkant dak (14 graden).
const eave = octStack([[A.shaftTop, H.entablature], [A.eave, H.eave[0]], [A.eave, H.eave[1]]]);
const roof = hull([...oct(A.eave, H.eave[1] - 0.01), [0, 0, H.apex]]);
const crown = union([belfry, eave, roof]).subtract(union(around(recess, FACES)));
const columns = union(around(column, FACES));

// ---------- liftkoker en loopbruggen (2006, oostzijde) ----------
// Witte koker op de BAG-rechthoek (2,9 × 5,0 m) tot NAP +39,5 (35,3 m); aan de torenzijde een donker beklede strook van
// 0,7 m tot 34,6 m (foto en AHN-DSM: de koker begint daar al op 6,4 m uit het hart).
const LIFT = { u: [7.12, 10.0], v: [-2.22, 2.78], top: 35.3 };
const lift = union([
  box(LIFT.u[0], LIFT.v[0], BASE, LIFT.u[1], LIFT.v[1], LIFT.top),
  box(6.4, -1.9, BASE, LIFT.u[0] + 0.05, 2.5, 34.6),
]);
// Drie loopbruggen tussen toren en koker (staal en glas), 3,5 m breed (AHN-DSM: v van -1,25 tot 2,25). Ertussen is het open;
// de onderkant loopt vanaf de toren en de koker onder 50 graden op naar het midden, zodat de doorgang zonder steun print.
const GALLERY = { v: [-1.25, 2.25], u: [4.6, 6.45], levels: [[6.4, 9.3], [11.65, 18.9], [23.6, 32.5]] };
const gallery = ([z0, z1]) => {
  const uT = shaftA(z0), uL = 6.4, um = (uT + uL) / 2, drop = 1.2 * ((uL - uT) / 2);
  const body = box(GALLERY.u[0], GALLERY.v[0], z0 - drop, GALLERY.u[1], GALLERY.v[1], z1);
  const v0 = GALLERY.v[0] - 0.5, v1 = GALLERY.v[1] + 0.5;
  const under = hull([v0, v1].flatMap((v) => [[uT, v, z0 - drop - 1], [uL, v, z0 - drop - 1], [uT, v, z0 - drop], [uL, v, z0 - drop], [um, v, z0]]));
  return body.subtract(under);
};
const galleries = union(GALLERY.levels.map(gallery));

const tower = union([union([foot, sill, shaft, bands]).subtract(windows), doorFrame, crown, columns]).subtract(door);
const building = union([tower, lift, galleries]);

await writeLandmark({
  slug: "watertoren-olst",
  base: BASE,
  nodes: [["building:watertoren-schacht-klokkenstoel-dak-en-liftkoker", building]],
  catalog: {
    name: "Watertoren Olst",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[0, 7], [0, -7], [-5, 5], [-5, -5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1773100000011750"],
    description:
      "Oorsprong op het hart van het achtkante BAG-pand op maaiveld (NAP +4,25 m), +X de normaal van de oostzijde (RD 8,95 graden) met de liftkoker, +Y naar het noorden; deur in de zuidzijde. Achtkante, licht verjongende bakstenen schacht op een gemetselde voet met waterlijst, drie natuurstenen banden en tien rijen vensters; open klokkenstoel met per zijde twee openingen en een zuil, overstekend boeiboord tot 40,05 m en een vlak achtkant dak tot 41,3 m; liftkoker van 2006 tot 35,3 m met drie loopbruggen naar de toren. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1962,
      architects: "P.J. de Gruyter en C. Poederoyen",
      wikipediaHeightM: 41.55,
      reservoirM3: 900,
      converted: "2006, vijf appartementen; liftkoker en loopbruggen",
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 44.3,
      ahnTopNapM: 45.55,
      ahnLiftNapM: 39.5,
      bagApothemM: A.foot,
      shaftApothemM: [A.shaftFoot, A.shaftTop],
      bandsM: H.bands,
      eaveM: H.eave[1],
      apexM: H.apex,
      liftTopM: LIFT.top,
      photoScalePxPerM: 88.8,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Olst) (1962, P.J. de Gruyter en C. Poederoyen, 41,55 m, 900 m³, appartementen sinds 2006, klokken en kruis verwijderd in 2016)",
      "https://commons.wikimedia.org/wiki/File:Olst,_de_watertoren_IMG_2025_2018-04-07_11.43.jpg (vanuit het zuiden: banden, vensterrijen, klokkenstoel, loopbruggen; schaal 88,8 px/m)",
      "https://commons.wikimedia.org/wiki/File:20150716_Watertoren_Olst.jpg, File:Olst_Watertoren.JPG, File:Watertoren_Olst.jpg (klokkenstoel met zuilen, dak, liftkoker)",
      "https://commons.wikimedia.org/wiki/File:Olst_Watertoren_8280.JPG (2006: deur met natuurstenen omlijsting in de zuidzijde)",
      "PDOK BAG-pand 1773100000011750, AHN DSM/DTM 0,5 m, PDOK 3D-tegels (maaiveld), 2026-11-06",
    ],
  },
});

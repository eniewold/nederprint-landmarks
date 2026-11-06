// Watertoren op het terrein van Het Spoorwegmuseum in Utrecht (voormalig station Maliebaan). Een kleine stalen
// spoorwegwatertoren: een cilindrisch reservoir met een omloop, onder een breed twaalfzijdig dak met een laag achtkant
// lantaarntje en een spits, op een vakwerk van vier poten met kruisverbanden. De toren is bij de vernieuwing van het museum
// (2005) bij het seinhuis uit Hoogezand-Sappemeer neergezet, op de zuidpunt van een lage bakstenen onderbouw met blinde
// segmentboognissen (BAG-pand 0344100000126836, bouwjaar 1915, 207 m²; Wikidata Q135953949 noemt hetzelfde pand). De
// toren is geen eigen BAG-pand: het model vervangt het hele pand, onderbouw en toren samen.
//
// Oorsprong op het hart van het reservoirdak in het AHN-DSM 0,5 m (de luchtfoto toont het dak door de scheefstand 0,8 m
// noordelijker) op het maaiveld (AHN-DTM NAP +2,85). Lokale X-as langs de lange zijden van de onderbouw (BAG, 72,3 graden vanaf RD-oost,
// naar het noordnoordoosten), Y = 90 graden linksom (westnoordwest). Maten: de BAG-contour van de onderbouw; het dak van de
// onderbouw (NAP +5,2), het reservoirdak (NAP +13,5 tot +13,7) en het lantaarntje (+13,8) uit het AHN-DSM 0,5 m; de
// dakdiameter (5,25 m) uit de luchtfoto; de verhoudingen van reservoir, omloop, dak, lantaarn, spits en vakwerk (onderaan
// 4,2 m, bovenaan 2,6 m breed) uit de foto "Spoorwegmuseum water tower.JPG" (2015, bijna recht van opzij, 80 px/m geschaald
// op de dakdiameter en gecontroleerd tegen het AHN) en "Spoorwegmuseum - Watertoren.jpg" (2010, vier poten met de
// rood-wit geschilderde leiding in het midden); de nissen van de onderbouw uit "Utrecht - 2015 - panoramio (3).jpg" en
// "Spoorwegmuseum - Parte I - 15669901336.jpg".
import { Manifold, CrossSection, ccw, hull, union, prism, place, box, circle, ring3, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [137530.1, 455617.2];
const AXIS_DEG = 72.3;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(6), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(6)];
const GROUND_NAP = 2.85;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (zuid 46,36, oost 46,23, west 46,22, noord 46,21),
// gemeten 2026-11-06. Het PDOK-pand staat op 46,11.
const GROUND_ELLIPSOID = 46.21;

const rad = (deg) => (deg * Math.PI) / 180;

// ---------- hoogtes boven het maaiveld (NAP +2,85) ----------
const H = {
  plinth: 2.35, // dak van de onderbouw (AHN NAP +5,2)
  nicheFoot: 0.2,
  nicheTop: 1.6, // kämpfer van de segmentbogen; het plafond van de nis loopt naar binnen op tot 2,05
  roofBox: 4.0, // opbouw op het dak van de onderbouw (AHN NAP +6,85)
  legTop: 7.41, // bovenkant van het vakwerk (foto: 5,06 m boven de onderbouw)
  galleryRim: 7.85, // onderkant van de rand van de omloop
  gallery: 8.29, // vloer van de omloop = voet van het reservoir
  soffit: 8.6, // onderkant van het dak bij de reservoirwand (47 graden, in werkelijkheid flauwer)
  eave: 9.62, // onderkant van de dakrand
  fascia: 10.1, // bovenkant van de dakrand
  roofTop: 10.5, // dak bij het lantaarntje (AHN NAP +13,4 tot +13,5)
  lantern: 10.9, // bovenkant van het lantaarntje (AHN NAP +13,7 tot +13,8)
  spire: 12.3, // top van de spits (foto; het AHN ziet de dunne spits tot NAP +14,5)
};
const R = {
  tank: 1.73, // reservoir 3,46 m
  gallery: 2.48, // omloop 4,95 m
  eave: 2.63, // dakrand 5,25 m (luchtfoto en DSM)
  lantern: 0.7, // achtkant van 1,4 m
  pipe: 0.45, // leiding in het midden van het vakwerk
  spire: 0.45,
};
const LEG_FOOT = 1.65; // halve hart-op-hartafstand van de poten op de onderbouw (foto's: vakwerk 4,2 m breed)
const LEG_TOP = 0.85; // idem bovenaan, onder de omloop (foto's: vakwerk 2,6 m breed)
const LEG = 0.45; // halve dikte van een poot (0,9 m, de printgrens)

// ---------- onderbouw: BAG-contour in het lokale stelsel ----------
const PLINTH = [[-5.076, -3.825], [0.086, -4.496], [22.186, -4.47], [22.223, 2.393], [13.36, 3.326], [-5.028, 3.341]];
const plinth = prism(PLINTH, BASE, H.plinth);
// Opbouw op het dak (luik of installatie; AHN en luchtfoto, maten geschat).
const roofBox = box(14.3, -1.55, H.plinth - 0.05, 17.3, 0.25, H.roofBox);

// Blinde nis in een gevel: in het vlak met normaal +X door de oorsprong, breedte w, van z0 tot z1, 0,3 m diep; het plafond
// loopt naar binnen onder 56 graden op, zodat het zonder steun te printen is.
const niche = (w, z0, z1, depth = 0.3) => {
  const a = -depth, b = 0.3, za = z1 + 1.5 * depth, zb = z1 - 0.45;
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [0, -w / 2, z1], [a, w / 2, za], [0, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
// n nissen van breedte w gelijk verdeeld over de gevel p→q (contour linksom, buitennormaal rechts van de richting).
const nichesOnEdge = (p, q, n, w) => {
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]), d = [(q[0] - p[0]) / L, (q[1] - p[1]) / L];
  const deg = (Math.atan2(-d[0], d[1]) * 180) / Math.PI, gap = (L - n * w) / (n + 1);
  return Array.from({ length: n }, (_, k) => {
    const s = gap + w / 2 + k * (w + gap);
    return place(niche(w, H.nicheFoot, H.nicheTop), { deg, at: [p[0] + d[0] * s, p[1] + d[1] * s, 0] });
  });
};
// Aantal nissen per gevel, vanaf de zuidoosthoek linksom: oostgevel van het zuiddeel, lange oostgevel, noordgevel, schuine
// noordwestgevel, lange westgevel, zuidgevel onder de toren (foto's: 2,75 m breed met penanten van circa 0,55 m).
const EDGE_NICHES = [1, 6, 2, 2, 5, 2];
const niches = union(PLINTH.flatMap((p, i) => {
  const q = PLINTH[(i + 1) % PLINTH.length], n = EDGE_NICHES[i];
  const L = Math.hypot(q[0] - p[0], q[1] - p[1]);
  return nichesOnEdge(p, q, n, Math.min(2.75, (L - 0.55 * (n + 1)) / n));
}));

// ---------- vakwerk: vier poten met kruisverbanden ----------
const legS = (z) => LEG_FOOT + ((LEG_TOP - LEG_FOOT) * (z - H.plinth)) / (H.legTop - H.plinth);
const CORNERS = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
const legAt = (k, z) => [CORNERS[k % 4][0] * legS(z), CORNERS[k % 4][1] * legS(z), z];
const legSquare = (k, z) => { const [x, y] = legAt(k, z); return [[x - LEG, y - LEG, z], [x + LEG, y - LEG, z], [x + LEG, y + LEG, z], [x - LEG, y + LEG, z]]; };
const legs = [0, 1, 2, 3].map((k) => hull([...legSquare(k, H.plinth - 0.05), ...legSquare(k, H.galleryRim)]));
// Eén kruis per zijde (in werkelijkheid twee verdiepingen kruisen naar knoopplaten midden op de zijde), van de voet van de
// ene poot naar de bovenkant van de volgende: banden van 0,9 m onder 58 graden.
const braces = [];
for (let k = 0; k < 4; k++) {
  const [ax, ay] = CORNERS[k], [bx, by] = CORNERS[(k + 1) % 4];
  const nx = (ax + bx) / 2, ny = (ay + by) / 2; // buitennormaal van de zijde
  const n = [LEG * nx, LEG * ny];
  const z1 = H.plinth + 0.45, z2 = H.legTop - 0.45;
  for (const [p, q] of [[legAt(k, z1), legAt(k + 1, z2)], [legAt(k + 1, z1), legAt(k, z2)]]) {
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const h = (LEG * Math.hypot(len, q[2] - p[2])) / len;
    const pts = [];
    for (const e of [p, q]) for (const dz of [-h, h]) for (const s of [-1, 1]) pts.push([e[0] + s * n[0], e[1] + s * n[1], e[2] + dz]);
    braces.push(hull(pts));
  }
}

// ---------- leiding, omloop, reservoir en dak ----------
// Leiding in het midden (0,9 m) met daarop de omloop: in werkelijkheid een vlakke vloer op consoles, hier een kraag van
// 46 graden van de leiding naar de rand (4,95 m).
const SEG = 72;
const core = Manifold.revolve(new CrossSection([ccw([
  [0, H.plinth - 0.05], [R.pipe, H.plinth - 0.05], [R.pipe, H.galleryRim - 1.05 * (R.gallery - R.pipe)],
  [R.gallery, H.galleryRim], [R.gallery, H.gallery], [R.tank, H.gallery], [R.tank, H.soffit + 0.2], [0, H.soffit + 0.2],
])]), SEG);
// Twaalfzijdig dak: onderkant van 47 graden van de reservoirwand naar de dakrand, dakrand, flauw dak naar het lantaarntje.
const ROOF_SIDES = 12;
const SOFFIT = R.tank * Math.cos(Math.PI / ROOF_SIDES) - 0.005; // twaalfhoek binnen de reservoirwand: geen vlakke rand eronder
const poly = (apothem, n = ROOF_SIDES, phase = 0) => circle([0, 0], apothem / Math.cos(Math.PI / n), n, phase + Math.PI / n);
const roof = hull([
  ...ring3(poly(SOFFIT), H.soffit), ...ring3(poly(R.eave), H.eave), ...ring3(poly(R.eave), H.fascia),
  ...ring3(poly(R.lantern + 0.05), H.roofTop + 0.05),
]);
const lantern = hull([...ring3(poly(R.lantern, 8), H.roofTop - 0.1), ...ring3(poly(R.lantern, 8), H.lantern)]);
const spire = hull([...ring3(poly(R.spire, 8), H.lantern - 0.05), [0, 0, H.spire]]);

const all = union([plinth, roofBox, ...legs, ...braces, core, roof, lantern, spire]).subtract(niches).trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-utrecht-het-spoorwegmuseum",
  base: BASE,
  // Eén node: de export vult elke node apart op; een los reservoir zou een voet tot de grondplaat krijgen.
  nodes: [["building:onderbouw-met-nissen-vakwerk-omloop-reservoir-dak-en-spits", all]],
  catalog: {
    name: "Watertoren Het Spoorwegmuseum",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-6.5, 0], [8, -5.8], [8, 5.5], [24, 0]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0344100000126836"],
    description:
      "Oorsprong op het hart van het reservoirdak op het maaiveld (NAP +2,85 m), X-as langs de onderbouw naar het noordnoordoosten (72,3 graden vanaf RD-oost). Bakstenen onderbouw op de BAG-contour (27 bij 7 m) tot 2,35 m met blinde nissen rondom en een opbouw op het dak; op de zuidpunt een vakwerk van vier poten (0,9 m, onderaan 3,3 m en bovenaan 1,7 m hart op hart) met een kruis per zijde tot 7,4 m, een leiding in het midden, de omloop (4,95 m) op een kraag van 46 graden op 8,3 m, het reservoir (3,46 m), een twaalfzijdig dak van 5,25 m met de dakrand op 9,6 tot 10,1 m, een achtkant lantaarntje tot 10,9 m en een spits tot 12,3 m. Maten uit BAG, AHN, luchtfoto en foto's.",
    realWorld: {
      placedOnSite: "circa 2005 (vernieuwing van het museum)",
      plinthBuilt: 1915,
      ahnGroundNapM: GROUND_NAP,
      ahnPlinthNapM: 5.2,
      ahnRoofNapM: 13.6,
      ahnLanternNapM: 13.8,
      plinthM: H.plinth,
      legsCentreToCentreFootM: 2 * LEG_FOOT,
      legsCentreToCentreTopM: 2 * LEG_TOP,
      legTopM: H.legTop,
      galleryDiameterM: 2 * R.gallery,
      galleryM: H.gallery,
      tankDiameterM: 2 * R.tank,
      roofDiameterM: 2 * R.eave,
      roofSides: ROOF_SIDES,
      eaveM: [H.eave, H.fascia],
      lanternM: H.lantern,
      topM: H.spire,
      photoScalePxPerM: 80,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Spoorwegmuseum_(Utrecht) (bij de vernieuwing is nabij het seinhuis uit Hoogezand-Sappemeer een watertoren geplaatst)",
      "https://nl.wikipedia.org/wiki/Lijst_van_watertorens_in_Nederland (Utrecht, Het Spoorwegmuseum; geen bouwjaar of hoogte)",
      "https://www.wikidata.org/wiki/Q135953949 (Watertoren Spoorwegmuseum, BAG-pand 0344100000126836)",
      "https://commons.wikimedia.org/wiki/Category:Water_tower_(Spoorwegmuseum_Utrecht) (Spoorwegmuseum water tower.JPG, Utrecht - 2015 - panoramio (3).jpg, Spoorwegmuseum - Watertoren.jpg, Spoorwegmuseum - Parte I - 15669901336.jpg)",
      "PDOK BAG-pand 0344100000126836, AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

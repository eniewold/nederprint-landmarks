// Genereert een vereenvoudigd, gesloten 3D-model van Raveleijn (2011,
// parkshow-arena, restaurant en hoofdkantoor van de Efteling in het Marerijk,
// Kaatsheuvel, ontwerp Sander de Bruijn): de twee kantoorvleugels met
// mansardekap en dakkapellen aan de buitenzijde, aan de arenazijde de
// gevelrijen van de "middeleeuwse stad" (topgevels, trapgevels, een halsgevel,
// daken met dakkapellen) boven een galerij met spitsboognissen, de witte
// Belforttoren met klok, hoektorentjes, arcadegalerij en leien schilddak met
// dakkapellen en lantaarn, de vijfhoekige hoektoren aan de Europalaan, het
// overdekte halfronde tribunegebouw met open front (zitrijen onder het dak,
// kolommen, frontgevel op de as), de houten omloop met pannendak aan de
// achterkant en drie torens (vierkant met klokkenstoel en lantaarn, rond met
// uikoepel, vierkant met tentdak), de Magische Stadspoort aan het water (ronde
// toren met kegeldak en erkertorentje, poortgebouw met doorgang en torentje
// met ruiterbeeld-nis, vierkante toren met houten verdieping, dakkapel en
// slank torentje) en de brug naar het Ton van de Venplein. De arena zelf
// blijft leeg (PDOK-terrein). Alle maten zijn meters op ware grootte. Uitvoer:
// GLB in meters (Y omhoog, nodes `klasse:label`), catalogus-JSON en een
// binaire STL in millimeters op 1:<schaal> (via scripts/efteling-kit.mjs).
//
//   node scripts/generate-efteling-raveleijn.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-raveleijn.mjs --scale 500
//
// Assenstelsel: oorsprong op RD (131367,5, 407214,5), het hart van de
// Belforttoren, op het maaiveld (NAP +8,0 m), Z omhoog. +X loopt langs de
// symmetrie-as van het complex van de toren door de arena naar de middelste
// tribunetoren (48,1 graden rechtsom vanaf de RD-X-as, richting zuidoost), +Y
// loodrecht daarop naar het noordoosten. Alle onderdelen worden in hun eigen
// stelsel opgebouwd (vleugels, toren, tribune, poort), in RD-richting
// geplaatst en aan het eind 48,1 graden teruggedraaid.
//
// Maten:
// - Kantoorvleugels: BAG-contour van pand 0809100000017646. AHN-DSM (0,5 m,
//   in het stelsel van elke vleugel): vlak dak op +15,3 m, mansarde aan de
//   buitengevels van +10,5 tot +15,3 m over 1,8 m met dakkapellen om de
//   ~4,2 m (DSM-pieken van 14-15 m); het lage deel rond de hoektoren op
//   +8,5 m; het oostelijke blok (aan de Ravenring) mansarde van +8 tot +12 m.
// - Gevelrijen: huisgevels 2,5-3,5 m voor het kantoordak, topgevels tot
//   +16 à +17,5 m (DSM, pieken om de ~6-8 m), galerij 4 m diep tot +3,6 m.
//   Volgorde en vorm van de gevels uit de arenafoto's; breedtes geschat.
// - Belforttoren: 12,6 × 16,8 m, 41,9 graden gedraaid (BAG-schuine zijde
//   en DSM), goot +20,5 m, schilddak tot nok +30 m, lantaarn en spits tot
//   +32,8 m (DSM-max +32,4 m boven maaiveld). Hoektorentjes, klok, arcade en
//   dakkapellen uit de foto's.
// - Vijfhoekige hoektoren: luchtfoto (vijf hoekpunten op ~6,6 m van het hart
//   RD 131353,6 / 407230,3), DSM: goot +11 m, flauwe voet tot +13,6 m,
//   spits tot +23,4 m.
// - Tribune: BGT-overkapping; binnenrand een cirkel (straal 39,4 m, hart RD
//   131370,8 / 407211,75, fit op de BGT-punten, 0,1 m afwijking), achterwand
//   op 52,7 m, omloop tot 55,3 m. DSM per straal: voorste dakstrook +12,8 m
//   tot 43,5 m, dak +10,2 m, nok van de omloop +11 m, pannendak tot +7,6 m.
//   Torens: midden (r 53,6 m op de as) tot +17,6 m, noord (rond) tot
//   +15,9 m, zuid tot +15,3 m (DSM 17, 15-16, 15 m).
// - Stadspoort: luchtfoto (ronde toren RD 131432,8 / 407174,4, vierkante
//   toren RD 131441,1 / 407179,6), DSM tot ~10 m; opstand uit de
//   vooraanzichten (doorgang 2,9 m breed en 4,8 m hoog, muur 5,6 m, kegeldak
//   tot 9,8 m, vierkante toren tot 10,4 m).
// - Brug: luchtfoto, 3,4 tot 4,4 m breed, 22 m lang, dek op +0,35 m.
//
// Geschat: alle gevelornamenten, vensters en nissen (blinde nissen van
// 0,35-0,5 m), de volgorde en breedte van de huisgevels, de dakkapellen, de
// vorm van de torendaken (DSM grof), de zitrijen (treden 0,8 × 0,53 m) en de
// diepte van het open tribunefront (een wig onder 45 graden zodat het dak
// zonder steun te printen is), de hoogtes van de poorttorens.
// Niet gemodelleerd: de Ravenring (in aanbouw in 2026, oostelijk van de
// tribune), het nieuwe platte gebouw tussen Droomvlucht en Raveleijn, de
// decorstukken in de arena, leuningen, windwijzers, het waterrad.
//
// Printbaar op 1:1000 zonder steun: alles staat op de onderkant (0,5 m
// onder het maaiveld); daken lopen omhoog; kraagstenen, consoles en
// erkervoeten onder 45 graden; de doorgang van de poort en alle nissen hebben
// een spitse top van minstens 50 graden; het tribunedak boven de zitrijen
// loopt onder 45 graden naar voren op.
//
// Bronnen: BAG-pand 0809100000017646; BGT overigbouwwerk (overkapping
// tribune, poort); AHN DSM/DTM 0,5 m (PDOK WCS); PDOK luchtfoto 8 cm
// (Actueel_orthoHR); Wikimedia Commons, categorie Raveleijn (o.a.
// "Raveleijn.JPG", "Raveleijnpoort.jpg", "Panorama Efteling Raveleijn.JPG",
// "Raveleijn at Efteling.jpg", Efteling 067/068/070, "Ravenring
// bouwwerkzaamheden (2026)"); nl.wikipedia (Raveleijn (attractie));
// Eftepedia (Raveleijn (gebouw), Magische Stadspoort).
import {
  CrossSection,
  Manifold,
  box,
  ccw,
  circle,
  dome,
  downFaces,
  hull,
  prism,
  rect,
  ring3,
  spire,
  union,
  writeLandmark,
} from "./efteling-kit.mjs";

// ---------- stelsel ----------
const O = [131367.5, 407214.5];
const GROUND_NAP = 8.0;
const AXIS = -48.1; // graden: richting van +X in RD
const X_AXIS = [+Math.cos((AXIS * Math.PI) / 180).toFixed(6), +Math.sin((AXIS * Math.PI) / 180).toFixed(6)];
const B = -0.5;
const rad = (d) => (d * Math.PI) / 180;
// RD → RD-verschuiving t.o.v. de oorsprong.
const off = ([x, y]) => [x - O[0], y - O[1]];
// Solid in een eigen stelsel (oorsprong in RD, X-as onder deg graden) → RD-verschuiving.
const inFrame = (m, origin, deg) => m.rotate([0, 0, deg]).translate([origin[0] - O[0], origin[1] - O[1], 0]);
// Punt in RD → coördinaten in een eigen stelsel.
const toFrame = ([x, y], origin, deg) => {
  const dx = x - origin[0];
  const dy = y - origin[1];
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return [dx * c + dy * s, -dx * s + dy * c];
};
// RD → modelstelsel (na de laatste draaiing).
const toModel = (p) => {
  const [dx, dy] = off(p);
  const c = Math.cos(rad(-AXIS));
  const s = Math.sin(rad(-AXIS));
  return [+(dx * c - dy * s).toFixed(2), +(dx * s + dy * c).toFixed(2)];
};

// Prisma van een veelhoek in het (x, z)-vlak, uitgerekt langs y van y0 tot y1.
const xzPrism = (pts, y0, y1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
// Prisma van een veelhoek in het (y, z)-vlak, uitgerekt langs x van x0 tot x1.
const yzPrism = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0)
    .rotate([90, 0, 90])
    .translate([x0, 0, 0]);
{
  const a = xzPrism([[1, 2], [1.5, 2], [1.5, 2.5], [1, 2.5]], 3, 3.5).boundingBox();
  const b = yzPrism([[1, 2], [1.5, 2], [1.5, 2.5], [1, 2.5]], 3, 3.5).boundingBox();
  const ok = (bb, mn) => mn.every((v, i) => Math.abs(bb.min[i] - v) < 1e-6);
  if (!ok(a, [1, 3, 2]) || !ok(b, [3, 1, 2])) throw new Error(`prisma-assen kloppen niet: ${JSON.stringify([a, b])}`);
}
// Spitsboog in het (x, z)-vlak rond xc: stijlen tot zs, top op zs + 1,5 × de
// halve breedte (segmenten van 61 en 50 graden).
const archPts = (xc, half, z0, zs) => [
  [xc - half, z0], [xc + half, z0], [xc + half, zs], [xc + half * 0.5, zs + 0.9 * half],
  [xc, zs + 1.5 * half], [xc - half * 0.5, zs + 0.9 * half], [xc - half, zs],
];
const rectPts = (x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
// Kraag onder 45 graden rond een rechthoek: van de rechthoek op z tot o
// breder op z + o, dan nog t dik.
const cornice = (x0, y0, x1, y1, z, o, t = 0.25) =>
  hull([...ring3(rect(x0, y0, x1, y1), z), ...ring3(rect(x0 - o, y0 - o, x1 + o, y1 + o), z + o), ...ring3(rect(x0 - o, y0 - o, x1 + o, y1 + o), z + o + t)]);
// Rond torentje (n-hoek) met kraagsteen onder 45 graden.
const turret = (c, r, zFoot, zTop, roofTop, n = 12) =>
  union([
    hull([[c[0], c[1], zFoot], ...ring3(circle(c, r, n), zFoot + r)]),
    prism(circle(c, r, n), zFoot + r - 0.02, zTop),
    spire(c, r * 1.06, zTop - 0.02, roofTop, n === 12 ? 8 : n),
  ]);
// Kleine knop op een spits (≥ 0,5 m breed).
const finial = (c, z0, z1) => spire(c, 0.27, z0, z1, 8);

// ---------- kantoorvleugels ----------
// BAG-contour van pand 0809100000017646 (RD).
const BAG_RD = [
  [131340.406, 407163.441], [131356.826, 407161.578], [131356.93, 407162.413], [131358.998, 407162.211], [131360.918, 407177.792],
  [131363.452, 407177.602], [131366.861, 407207.026], [131368.246, 407205.368], [131368.141, 407204.666], [131368.962, 407204.214],
  [131369.488, 407204.619], [131369.555, 407205.309], [131377.479, 407212.408], [131378.357, 407212.482], [131378.525, 407213.166],
  [131378.158, 407213.711], [131377.425, 407213.772], [131376.295, 407215.157], [131405.441, 407215.363], [131405.473, 407218.105],
  [131421.827, 407218.275], [131421.768, 407220.253], [131422.453, 407220.261], [131422.409, 407222.054], [131436.336, 407222.492],
  [131436.277, 407225.289], [131436.965, 407225.308], [131436.955, 407235.039], [131422.36, 407234.947], [131422.318, 407236.583],
  [131373.368, 407236.053], [131373.39, 407233.986], [131358.511, 407233.84], [131357.567, 407236.615], [131349.332, 407235.736],
  [131347.61, 407227.848], [131350.434, 407226.309], [131348.626, 407211.615], [131346.442, 407211.91],
];
const BAG = BAG_RD.map(off);
const bagClip = prism(BAG, B, 40);
const OFFICE_TOP = 15.3;
const LOW_TOP = 8.5;
const MANS_FOOT = 10.5;
const MANS_DEPTH = 1.8;

// Westvleugel (stelsel W): oorsprong op het BAG-hoekpunt aan de westgevel,
// X naar het zuiden langs de gevel, Y naar het oosten de vleugel in.
const W_O = [131346.442, 407211.91];
const W_DEG = -97.1;
// Noordvleugel (stelsel N): oorsprong op het BAG-hoekpunt aan de arenazijde,
// X naar het oosten, Y naar het noorden.
const N_O = [131376.295, 407215.157];
const N_DEG = 0.4;

// Mansarde, dakkapellen, vensternissen en lisenen langs een buitengevel in
// een stelsel waarin de gevel op y = 0 ligt en het gebouw bij y > 0.
function buitengevel(x0, x1, step = 4.2, skip = () => false) {
  const slope = (OFFICE_TOP - MANS_FOOT) / MANS_DEPTH;
  const cut = yzPrism([[-0.3, MANS_FOOT - 0.3 * slope], [MANS_DEPTH, OFFICE_TOP + 0.01], [-0.3, OFFICE_TOP + 1]], x0 - 0.5, x1 + 0.5);
  const adds = [];
  const niches = [];
  for (let x = x0 + step / 2; x < x1 - 1; x += step) {
    if (skip(x)) continue;
    const yf = 0.35;
    const zf = MANS_FOOT + yf * slope;
    adds.push(box(x - 0.8, yf, zf - 0.3, x + 0.8, MANS_DEPTH + 0.3, 13.4));
    adds.push(xzPrism([[x - 0.8, 13.38], [x + 0.8, 13.38], [x, 14.4]], yf, MANS_DEPTH + 0.3));
    niches.push(xzPrism(rectPts(x - 0.4, x + 0.4, 11.9, 12.9), yf - 0.2, yf + 0.3));
    for (const [z0, z1] of [[1.0, 2.9], [4.4, 6.3], [7.8, 9.7]]) niches.push(xzPrism(rectPts(x - 0.7, x + 0.7, z0, z1), -0.3, 0.35));
  }
  const lisenen = [];
  for (let x = x0 + step; x < x1 - 0.5; x += step) {
    if (skip(x)) continue;
    lisenen.push(box(x - 0.25, -0.3, B, x + 0.25, 0.4, MANS_FOOT - 0.2));
  }
  return { cut, adds, niches, lisenen };
}

function westvleugel() {
  // Hoog deel tot +15,3 m (y 0-14,5), noordelijk deel achter de lage hoek.
  const high = union([box(-0.3, 0, B, 48.9, 14.5, OFFICE_TOP), box(-12, 5.5, B, 0.5, 14.5, OFFICE_TOP)]);
  const g = buitengevel(-0.3, 48.9, 4.2, (x) => x > 44.2);
  const body = high.subtract(g.cut).intersect(inFrameInv(bagClip, W_O, W_DEG));
  // Hoektorentje op de zuidwesthoek: vierkant 4 × 4 m, tentdak tot +20,8 m.
  const turretSW = union([
    box(44.8, 2.0, B, 48.85, 6.0, 17.0),
    cornice(44.8, 2.0, 48.85, 6.0, 16.75, 0.25),
    spire([46.82, 4.0], 2.25 * Math.SQRT2, 17.23, 21.0, 4, Math.PI / 4),
  ]);
  const nicheSW = [
    xzPrism(archPts(46.8, 0.4, 15.5, 15.9), 1.7, 2.35),
    yzPrism(archPts(4.0, 0.5, 12.0, 13.2), 48.5, 49.2),
    yzPrism(archPts(4.0, 0.4, 15.5, 15.9), 48.5, 49.2),
  ];
  return union([body, ...g.adds, ...g.lisenen, turretSW]).subtract(union([...g.niches, ...nicheSW]));
}
// Inverse plaatsing: een solid in RD-verschuiving naar een eigen stelsel.
function inFrameInv(m, origin, deg) {
  return m.translate([O[0] - origin[0], O[1] - origin[1], 0]).rotate([0, 0, -deg]);
}

function noordvleugel() {
  // Buitengevel (noord) op y = 20,97; in het stelsel G: x = -x_N, y = 20,97 - y_N.
  const NF = 20.97;
  const high = union([box(-12.5, 7.5, B, 45.5, NF + 0.3, OFFICE_TOP), box(-12.5, -1.0, B, 1.0, NF + 0.3, OFFICE_TOP)]);
  const g = buitengevel(-45.5, 12.5, 4.2, (x) => x > 2.5);
  const toN = (m) => m.rotate([0, 0, 180]).translate([0, NF, 0]);
  const body = high.subtract(toN(g.cut)).intersect(inFrameInv(bagClip, N_O, N_DEG));
  return union([body, ...g.adds.map(toN), ...g.lisenen.map(toN)]).subtract(union(g.niches.map(toN)));
}

// Oostelijk blok (aan de Ravenring): mansarde van +8 tot +12 m rondom, een
// grote topgevel op de zuidgevel en dakkapellen.
function oostblok() {
  const [x0, y0, x1, y1] = [46.2, 6.9, 60.8, 19.47];
  const walls = box(x0, y0, B, x1, y1, 8.0);
  const mans = hull([...ring3(rect(x0, y0, x1, y1), 7.98), ...ring3(rect(x0 + 1.6, y0 + 1.6, x1 - 1.6, y1 - 1.6), 12.0)]);
  const parts = [walls, mans];
  // Topgevel op de zuidgevel (x 48,5-54,5), nok loodrecht op de gevel.
  parts.push(box(48.5, y0 - 0.3, B, 54.5, y0 + 4.5, 8.0));
  parts.push(xzPrism([[48.5, 7.98], [54.5, 7.98], [51.5, 13.4]], y0 - 0.3, y0 + 4.5));
  // Dakkapellen op de noord- en oostmansarde.
  const dk = [];
  for (const x of [49.5, 53.7, 57.6]) {
    dk.push(box(x - 0.7, y1 - 1.0, 8.3, x + 0.7, y1 - 0.25, 10.0), xzPrism([[x - 0.7, 9.98], [x + 0.7, 9.98], [x, 10.8]], y1 - 1.0, y1 - 0.25));
  }
  for (const y of [10.5, 15.0]) {
    dk.push(box(x1 - 1.0, y - 0.7, 8.3, x1 - 0.25, y + 0.7, 10.0), yzPrism([[y - 0.7, 9.98], [y + 0.7, 9.98], [y, 10.8]], x1 - 1.0, x1 - 0.25));
  }
  const niches = [];
  for (const x of [49.5, 53.7, 57.6]) for (const [z0, z1] of [[1.0, 2.8], [4.3, 6.1]]) niches.push(xzPrism(rectPts(x - 0.6, x + 0.6, z0, z1), y1 - 0.35, y1 + 0.3));
  for (const x of [50.3, 52.7]) for (const [z0, z1] of [[1.0, 2.8], [4.3, 6.1]]) niches.push(xzPrism(rectPts(x - 0.55, x + 0.55, z0, z1), y0 - 0.6, y0 + 0.05));
  niches.push(xzPrism(archPts(51.5, 0.6, 8.6, 9.9), y0 - 0.6, y0 + 0.05));
  // Doorgang tussen de tribune en het blok (DSM +8 à +9 m).
  const link = box(42.5, -2.6, B, 45.8, y0 + 0.2, 8.5).subtract(xzPrism(archPts(44.15, 1.0, B, 3.2), -3.0, -2.25));
  return union([...parts, ...dk, link]).subtract(union(niches));
}

// Vijfhoekige hoektoren aan de Europalaan.
const PENT_C = off([131353.6, 407230.3]);
const pent = (R) => Array.from({ length: 5 }, (_, k) => [PENT_C[0] + R * Math.cos(rad(58.6 + 72 * k)), PENT_C[1] + R * Math.sin(rad(58.6 + 72 * k))]);
function hoektoren() {
  const R = 6.6;
  const o = 0.3 / Math.cos(rad(36));
  const parts = [
    prism(pent(R), B, 11.0),
    hull([...ring3(pent(R), 10.68), ...ring3(pent(R + o), 10.98)]),
    hull([...ring3(pent(R + o), 10.96), ...ring3(pent(3.4), 13.6)]),
    hull([...ring3(pent(3.4), 13.58), [PENT_C[0], PENT_C[1], 23.4]]),
  ];
  // Vensternissen op de drie buitenzijden (noord, west, zuidwest).
  const niches = [];
  for (const k of [0, 1, 2]) {
    const a = rad(58.6 + 36 + 72 * k);
    const ap = R * Math.cos(rad(36));
    const nrm = [Math.cos(a), Math.sin(a)];
    const tan = [-nrm[1], nrm[0]];
    for (const t of [-1.8, 1.8]) {
      for (const [z0, zs, half] of [[1.4, 3.0, 0.5], [4.8, 6.6, 0.5], [8.2, 9.3, 0.45]]) {
        const m = xzPrism(archPts(0, half, z0, zs), -0.35, 0.4);
        // Lokaal: x langs de zijde, -y naar buiten.
        const ang = Math.atan2(tan[1], tan[0]) * (180 / Math.PI);
        niches.push(m.rotate([0, 0, ang]).translate([PENT_C[0] + nrm[0] * ap + tan[0] * t, PENT_C[1] + nrm[1] * ap + tan[1] * t, 0]));
      }
    }
  }
  return union(parts).subtract(union(niches));
}

function kantoor() {
  const low = prism(BAG, B, LOW_TOP);
  const ww = inFrame(westvleugel(), W_O, W_DEG);
  const nw = inFrame(noordvleugel(), N_O, N_DEG);
  // Hoekstuk tussen de vleugels achter de toren (DSM +15 m).
  const corner = box(...off([131355.5, 407218]), B, ...off([131364, 407228]), OFFICE_TOP).intersect(prism(BAG, B, 40));
  return union([low, ww, nw, corner, inFrame(oostblok(), N_O, N_DEG), hoektoren()]);
}

// ---------- gevelrijen aan de arena ----------
// Huis in een eigen stelsel: x over de breedte (0-w), y vanaf de voorgevel
// (y = s, naar buiten -y) het gebouw in tot d, z omhoog.
function huis({ w, eave, top, type, s = 0, d = 3.6, dormers = 1 }) {
  const parts = [box(0, s, B, w, d, eave)];
  const niches = [];
  const gableWindow = top - eave > 3.2;
  if (type === "top") {
    parts.push(xzPrism([[0, eave - 0.02], [w, eave - 0.02], [w / 2, top]], s, d));
  } else if (type === "trap") {
    const tw = 1.2;
    const k = Math.max(1, Math.min(4, Math.floor((w / 2 - tw / 2) / 0.9)));
    const dx = (w / 2 - tw / 2) / k;
    const h = (top - eave) / (k + 1);
    const left = [[0, eave - 0.02]];
    for (let i = 0; i <= k; i++) {
      left.push([i * dx, eave + (i + 1) * h]);
      if (i < k) left.push([(i + 1) * dx, eave + (i + 1) * h]);
    }
    const right = left.map(([x, z]) => [w - x, z]).reverse();
    parts.push(xzPrism([...left, ...right], s, s + 0.6));
    parts.push(xzPrism([[0.3, eave - 0.02], [w - 0.3, eave - 0.02], [w / 2, top - 1.0]], s + 0.5, d));
  } else if (type === "klok") {
    const pts = [
      [0, eave - 0.02], [w, eave - 0.02], [w, eave + 0.4], [0.7 * w, eave + 0.4 + 0.3 * w], [0.7 * w, top - 0.7],
      [0.5 * w, top], [0.3 * w, top - 0.7], [0.3 * w, eave + 0.4 + 0.3 * w], [0, eave + 0.4],
    ];
    parts.push(xzPrism(pts, s, s + 0.6));
    parts.push(xzPrism([[0.3, eave - 0.02], [w - 0.3, eave - 0.02], [w / 2, top - 1.2]], s + 0.5, d));
  } else if (type === "pinakel") {
    // Gotische zaalgevel: vlakke gevel tot de goot met drie pinakels.
    for (const x of [0.5, w / 2, w - 0.5]) {
      parts.push(box(x - 0.3, s, eave - 0.5, x + 0.3, s + 0.6, eave + 0.6), spire([x, s + 0.3], 0.42, eave + 0.58, top, 4, Math.PI / 4));
    }
    parts.push(yzPrism([[s + 0.4, eave - 0.02], [d, eave - 0.02], [d, OFFICE_TOP]], 0, w));
    niches.push(xzPrism(archPts(w / 2, 1.1, 4.3, eave - 3.0), s - 0.3, s + 0.45));
  } else {
    // Dak evenwijdig aan de gevel, van de goot naar het kantoordak.
    parts.push(yzPrism([[s, eave - 0.02], [d, eave - 0.02], [d, OFFICE_TOP]], 0, w));
    const slope = (OFFICE_TOP - eave) / (d - s);
    for (let i = 0; i < dormers; i++) {
      const x = (w * (i + 0.5)) / dormers;
      const yf = s + 0.9;
      const zf = eave + 0.9 * slope;
      parts.push(box(x - 0.75, yf, eave - 0.1, x + 0.75, d, zf + 1.3));
      parts.push(xzPrism([[x - 0.75, zf + 1.28], [x + 0.75, zf + 1.28], [x, zf + 2.2]], yf, d));
      niches.push(xzPrism(rectPts(x - 0.4, x + 0.4, zf + 0.15, zf + 1.1), yf - 0.3, yf + 0.3));
    }
  }
  // Vensters per verdieping (de begane grond zit achter de galerij).
  const cols = Math.max(1, Math.floor(w / 2.1));
  for (const [z0, z1] of [[4.4, 6.0], [7.2, 8.8], [9.8, 10.9]]) {
    if (z1 > eave - 0.3) continue;
    for (let i = 0; i < cols; i++) {
      const x = (w * (i + 0.5)) / cols;
      niches.push(xzPrism(rectPts(x - 0.45, x + 0.45, z0, z1), s - 0.3, s + 0.35));
    }
  }
  if (gableWindow && type !== "pinakel" && type !== "dak") niches.push(xzPrism(archPts(w / 2, 0.45, eave + 0.5, eave + 1.5), s - 0.3, s + 0.35));
  return union(parts).subtract(union(niches));
}

// Galerij voor de gevelrij: x0-x1 langs de gevel, voorzijde op y = 0 (naar
// buiten -y), diepte 4 m tot +3,6 m, spitsboognissen om de 3 m.
function galerij(x0, x1) {
  const g = box(x0, 0, B, x1, 4.1, 3.6);
  const niches = [];
  const n = Math.max(1, Math.round((x1 - x0) / 3.0));
  for (let i = 0; i < n; i++) {
    const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
    niches.push(xzPrism(archPts(x, 1.0, 0, 1.75), -0.3, 0.45));
  }
  // Kroonlijst als borstwering op het galerijdak (0,9 m, op de voorrand).
  const rail = box(x0, 0, 3.58, x1, 0.9, 4.3);
  return union([g, rail]).subtract(union(niches));
}

// Westelijke rij (stelsel W, gevels op y = 17 naar het oosten): van noord
// (x = 2,6) naar zuid (x = 47).
const WEST_HUIZEN = [
  { w: 7.9, eave: 11.0, top: 0, type: "dak", dormers: 2, s: -0.2 },
  { w: 6.0, eave: 11.0, top: 16.6, type: "top", s: 0 },
  { w: 5.0, eave: 11.6, top: 17.4, type: "trap", s: -0.3 },
  { w: 6.5, eave: 11.0, top: 0, type: "dak", dormers: 2, s: 0.1 },
  { w: 5.5, eave: 11.4, top: 17.0, type: "klok", s: -0.25 },
  { w: 7.0, eave: 10.6, top: 17.0, type: "top", s: 0 },
  { w: 6.5, eave: 12.0, top: 0, type: "dak", dormers: 1, s: -0.2 },
];
// Noordelijke rij (stelsel N, gevels op y = 4 naar het zuiden): van west
// (x = 1, naast de toren) naar oost (x = 43).
const NOORD_HUIZEN = [
  { w: 5.0, eave: 14.4, top: 16.6, type: "pinakel", s: -0.2 },
  { w: 6.0, eave: 11.2, top: 16.6, type: "top", s: 0 },
  { w: 5.5, eave: 11.6, top: 17.2, type: "top", s: -0.3 },
  { w: 6.0, eave: 12.0, top: 17.6, type: "trap", s: -0.15 },
  { w: 6.0, eave: 12.0, top: 17.6, type: "trap", s: -0.15 },
  { w: 8.5, eave: 11.4, top: 0, type: "dak", dormers: 2, s: 0.1 },
  { w: 5.0, eave: 11.0, top: 16.2, type: "top", s: -0.2 },
];

function gevelrij() {
  const west = [];
  let x = 2.6;
  for (const h of WEST_HUIZEN) {
    // Huisstelsel 180 graden gedraaid: x_W = x + w - x_h, y_W = 17 - y_h.
    west.push(huis(h).rotate([0, 0, 180]).translate([x + h.w, 17, 0]));
    x += h.w;
  }
  west.push(galerij(-47.0, -2.6).rotate([0, 0, 180]).translate([0, 21.1, 0]));
  const noord = [];
  x = 1.0;
  for (const h of NOORD_HUIZEN) {
    noord.push(huis(h).translate([x, 4.0, 0]));
    x += h.w;
  }
  noord.push(galerij(-0.5, 35.5));
  return union([inFrame(union(west), W_O, W_DEG), inFrame(union(noord), N_O, N_DEG)]);
}

// ---------- Belforttoren (stelsel T: oorsprong O, X onder 41,9 graden) ----------
const T_DEG = 41.9;
const TA = 6.3;
const TB = 8.4;
const T_EAVE = 20.5;
const T_RIDGE = 30.0;
const T_TOP = 32.8;
const ROOF_BASE = T_EAVE + 0.08; // net onder de bovenkant van de kroonlijst (+20,6 m)
function belfort() {
  const parts = [box(-TA, -TB, B, TA, TB, T_EAVE)];
  // Middenrisaliet en hoeklisenen op de voorgevel (naar de arena, -y).
  parts.push(box(-2.3, -TB - 0.4, B, 2.3, -TB + 0.1, 18.1));
  parts.push(box(-TA, -TB - 0.3, B, -TA + 0.6, -TB + 0.1, 12.6), box(TA - 0.6, -TB - 0.3, B, TA, -TB + 0.1, 12.6));
  // Kroonlijsten onder 45 graden.
  parts.push(cornice(-TA, -TB, TA, TB, 17.8, 0.3), cornice(-TA, -TB, TA, TB, 20.2, 0.3, 0.1));
  // Hoektorentjes met kraagsteen, schacht en spits.
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) parts.push(turret([sx * TA, sy * TB], 1.0, 12.3, 21.6, 25.8));
  // Schilddak (ingesprongen 1 m), nok langs y.
  parts.push(hull([...ring3(rect(-TA + 1, -TB + 1, TA - 1, TB - 1), ROOF_BASE), [0, -1.6, T_RIDGE], [0, 1.6, T_RIDGE]]));
  // Grote topgevel midden op de voorgevel boven de arcade.
  parts.push(box(-1.6, -TB, T_EAVE - 0.1, 1.6, -TB + 3.6, 21.8), xzPrism([[-1.6, 21.78], [1.6, 21.78], [0, 23.7]], -TB, -TB + 3.6));
  // Kleine dakkapellen op voor-, achter- en zijvlakken.
  const fy = (z) => -(TB - 1) + (z - ROOF_BASE) / ((T_RIDGE - ROOF_BASE) / (TB - 1 - 1.6));
  const fx = (z) => TA - 1 - (z - ROOF_BASE) / ((T_RIDGE - ROOF_BASE) / (TA - 1));
  const dorm = [];
  for (const sx of [-2.6, 2.6]) {
    const y = fy(24.4);
    dorm.push(box(sx - 0.55, y, 24.3, sx + 0.55, -2.5, 25.4), xzPrism([[sx - 0.55, 25.38], [sx + 0.55, 25.38], [sx, 26.2]], y, -2.5));
    dorm.push(box(sx - 0.55, 2.5, 24.3, sx + 0.55, -y, 25.4), xzPrism([[sx - 0.55, 25.38], [sx + 0.55, 25.38], [sx, 26.2]], 2.5, -y));
  }
  for (const sy of [-2.6, 2.6]) {
    const x = fx(24.4);
    dorm.push(box(1.5, sy - 0.55, 24.3, x, sy + 0.55, 25.4), yzPrism([[sy - 0.55, 25.38], [sy + 0.55, 25.38], [sy, 26.2]], 1.5, x));
    dorm.push(box(-x, sy - 0.55, 24.3, -1.5, sy + 0.55, 25.4), yzPrism([[sy - 0.55, 25.38], [sy + 0.55, 25.38], [sy, 26.2]], -x, -1.5));
  }
  parts.push(...dorm);
  // Lantaarn met spits op de nok.
  parts.push(box(-0.75, -0.75, T_RIDGE - 0.6, 0.75, 0.75, 31.0), spire([0, 0], 1.06, 30.98, T_TOP, 4, Math.PI / 4));
  // Klok op het risaliet (schijf van 2,3 m, 0,25 m voor de gevel).
  parts.push(xzPrism(circle([0, 15.9], 1.15, 16), -TB - 0.65, -TB - 0.3));
  // Bordes met trap naar de arena voor de toren (tot +4 m).
  parts.push(box(-3.0, -TB - 2.6, B, 2.4, -TB - 0.3, 4.0));
  const stair = [[2.35, B], [9.0, B]];
  for (let i = 0; i < 13; i++) stair.push([9.0 - i * 0.508, 0.3 + i * 0.285], [9.0 - (i + 1) * 0.508, 0.3 + i * 0.285]);
  stair.push([2.35, 4.0]);
  parts.push(xzPrism(stair, -TB - 2.0, -TB + 0.05));
  const niches = [];
  // Ingang (spitsboog, 1,2 m diep), roosvenster, zijvensters.
  niches.push(xzPrism(archPts(0, 1.5, 4.0, 5.2), -TB - 0.6, -TB + 0.8));
  niches.push(xzPrism(archPts(0, 1.3, 8.8, 11.6), -TB - 0.6, -TB + 0.0));
  niches.push(xzPrism(archPts(-0.3, 1.4, B + 0.5, 1.6), -TB - 2.9, -TB - 2.2));
  for (const sx of [-4.05, 4.05]) for (const [z0, zs] of [[6.4, 8.0], [10.4, 12.0], [14.3, 15.6]]) niches.push(xzPrism(archPts(sx, 0.55, z0, zs), -TB - 0.3, -TB + 0.4));
  // Arcade onder de goot op alle vier de gevels.
  for (const x of [-4.5, -3.0, -1.5, 0, 1.5, 3.0, 4.5]) {
    niches.push(xzPrism(archPts(x, 0.4, 18.45, 19.45), -TB - 0.3, -TB + 0.35));
    niches.push(xzPrism(archPts(x, 0.4, 18.45, 19.45), TB - 0.35, TB + 0.3));
  }
  for (let y = -6.75; y <= 6.8; y += 1.5) {
    niches.push(yzPrism(archPts(y, 0.4, 18.45, 19.45), TA - 0.35, TA + 0.3));
    niches.push(yzPrism(archPts(y, 0.4, 18.45, 19.45), -TA - 0.3, -TA + 0.35));
  }
  // Vensters in de zijgevels boven het kantoordak.
  for (const y of [-4, 0, 4]) {
    niches.push(yzPrism(archPts(y, 0.5, 15.8, 16.8), TA - 0.35, TA + 0.3));
    niches.push(yzPrism(archPts(y, 0.5, 15.8, 16.8), -TA - 0.3, -TA + 0.35));
  }
  // Venster in de topgevel en in de dakkapellen.
  niches.push(xzPrism(archPts(0, 0.55, 20.9, 21.7), -TB - 0.3, -TB + 0.35));
  return inFrame(union(parts).subtract(union(niches)), O, T_DEG);
}

// ---------- tribune (stelsel C: RD-assen, oorsprong in het hart van de binnenrand) ----------
const C = [131370.8, 407211.75];
const R_IN = 39.4;
const SEG = 180;
const AX_T = AXIS; // de middelste toren en de frontgevel liggen op de as
const revolve = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
// Wig van de tribune: x ≥ -6,8 (zuideinde) en y ≤ 0,6 (noordeinde).
const tribClip = (inset = 0) => box(-6.8 + inset, -70, B - 1, 70, 0.6 - inset, 30);
// Solid in een radiaal stelsel (x tangentieel, y naar buiten) op hoek phi.
const atAngle = (m, phi) => m.rotate([0, 0, phi - 90]);
const T_FRONT = 12.8;
const T_ROOF = 10.2;
function tribune() {
  const body = revolve([
    [R_IN, B], [54.6, B], [54.6, 4.2], [55.3, 4.9], [55.3, 7.6], [52.3, 11.0], [51.7, T_ROOF], [43.5, T_ROOF], [43.5, T_FRONT], [R_IN, T_FRONT],
  ]).intersect(tribClip());
  // Open front: zitrijen (treden 0,8 × 0,53 m vanaf +1,2 m) onder een plafond
  // dat onder 45 graden naar voren oploopt tot +11,4 m.
  const stairs = [[39.0, 30], [39.0, 1.2]];
  for (let i = 0; i < 12; i++) stairs.push([R_IN + 0.8 * (i + 1), 1.2 + 0.53 * i], [R_IN + 0.8 * (i + 1), 1.2 + 0.53 * (i + 1)]);
  stairs.push([60, 1.2 + 0.53 * 12], [60, 30]);
  const ceiling = [[39.0, -20], [60, -20], [60, 11.4 - (60 - R_IN)], [39.0, 11.4 + (R_IN - 39.0)]];
  const voidCs = new CrossSection([ccw(stairs)]).intersect(new CrossSection([ccw(ceiling)]));
  const posts = [];
  for (let k = 0; k < 12; k++) {
    for (const sgn of [-1, 1]) {
      const phi = AX_T + sgn * (4 + 8 * k);
      if (phi < -95 || phi > -2) continue;
      posts.push(atAngle(box(-0.5, R_IN - 1, B, 0.5, 48, 13), phi));
    }
  }
  const seating = Manifold.revolve(voidCs, SEG).intersect(tribClip(1.0)).subtract(union(posts));
  // Omloop: open galerij als nissen tussen stijlen om de 4 graden.
  const galPosts = [];
  for (let phi = -100; phi <= 4; phi += 4) galPosts.push(atAngle(box(-0.3, 54, B, 0.3, 57, 9), phi));
  const gallery = revolve([[54.95, 5.2], [56, 5.2], [56, 7.2], [54.95, 7.2]]).intersect(tribClip(0.8)).subtract(union(galPosts));
  // Deuren in de stenen voet van de omloop.
  const doors = [-90, -76, -62, -34, -20, -8].map((phi) => atAngle(xzPrism(archPts(0, 1.1, B, 2.3), 54.2, 55.0), phi));
  const parts = [body.subtract(union([seating, gallery, ...doors]))];

  // Frontgevel op de as boven de middelste zitvakken.
  parts.push(
    atAngle(union([box(-2.2, R_IN - 0.2, 12.0, 2.2, R_IN + 4.0, T_FRONT), xzPrism([[-2.2, T_FRONT - 0.02], [2.2, T_FRONT - 0.02], [0, 14.6]], R_IN - 0.2, R_IN + 4.0)]), AX_T),
  );
  // Middelste toren: vierkant 4,6 m, klok, klokkenstoel, getrapt tentdak met lantaarn.
  {
    const y0 = 51.3;
    const y1 = 55.9;
    const t = union([
      box(-2.3, y0, B, 2.3, y1, 12.6),
      cornice(-2.3, y0, 2.3, y1, 12.35, 0.25),
      hull([...ring3(rect(-2.55, y0 - 0.25, 2.55, y1 + 0.25), 12.83), ...ring3(rect(-1.2, 53.6 - 1.2, 1.2, 53.6 + 1.2), 14.6)]),
      hull([...ring3(rect(-1.2, 53.6 - 1.2, 1.2, 53.6 + 1.2), 14.58), [0, 53.6, 16.6]]),
      box(-0.5, 53.1, 15.3, 0.5, 54.1, 16.7),
      spire([0, 53.6], 0.71, 16.68, 17.6, 4, Math.PI / 4),
      xzPrism(circle([0, 9.3], 0.9, 16), y1 - 0.05, y1 + 0.2),
    ]);
    const n = union([
      xzPrism(archPts(0, 0.55, 10.4, 11.0), y1 - 0.5, y1 + 0.3),
      yzPrism(archPts(53.6, 0.55, 10.4, 11.0), -2.6, -1.8),
      yzPrism(archPts(53.6, 0.55, 10.4, 11.0), 1.8, 2.6),
      xzPrism(archPts(0, 1.2, B, 2.6), y1 - 0.5, y1 + 0.3),
    ]);
    parts.push(atAngle(t.subtract(n), AX_T));
  }
  // Noordtoren: rond met uikoepel en lantaarntje.
  {
    const phi = -1.9;
    const c = [53.3 * Math.cos(rad(phi)), 53.3 * Math.sin(rad(phi))];
    const t = union([
      prism(circle(c, 2.5, 16), B, 11.4),
      hull([...ring3(circle(c, 2.5, 16), 11.38), ...ring3(circle(c, 2.8, 16), 11.68)]),
      dome(c, [[2.8, 11.66], [2.95, 12.2], [2.85, 12.9], [2.4, 13.6], [1.6, 14.2], [0.8, 14.6], [0.45, 14.78]], 16),
      prism(circle(c, 0.45, 8), 14.7, 15.4),
      dome(c, [[0.55, 15.38], [0.5, 15.6], [0.25, 15.85], [0.05, 15.95]], 8),
    ]);
    const n = union(
      [-30, 0, 30].map((d) =>
        atAngle(xzPrism(archPts(0, 0.45, 8.0, 9.2), 2.1, 2.9), phi + d).translate([c[0], c[1], 0]),
      ),
    );
    parts.push(t.subtract(n));
  }
  // Zuidtoren: vierkant 4,4 m met tentdak.
  {
    const phi = -95.7;
    const t = union([
      box(-2.2, 51.3, B, 2.2, 55.7, 11.5),
      cornice(-2.2, 51.3, 2.2, 55.7, 11.25, 0.25),
      spire([0, 53.5], 2.45 * Math.SQRT2, 11.73, 15.3, 4, Math.PI / 4),
    ]);
    const n = union([xzPrism(archPts(0, 0.5, 8.4, 9.4), 55.2, 56.0), yzPrism(archPts(53.5, 0.5, 8.4, 9.4), 1.7, 2.5), yzPrism(archPts(53.5, 0.5, 8.4, 9.4), -2.5, -1.7)]);
    parts.push(atAngle(t.subtract(n), phi));
  }
  return union(parts).translate([C[0] - O[0], C[1] - O[1], 0]);
}

// ---------- Magische Stadspoort (stelsel G: X van de ronde naar de vierkante toren) ----------
const G_O = [131436.95, 407177.0];
const G_DEG = 32;
function stadspoort() {
  const parts = [];
  // Poortgebouw met zadeldak evenwijdig aan de gevel.
  parts.push(box(-3.0, 0, B, 3.0, 3.6, 5.6), yzPrism([[0, 5.58], [3.6, 5.58], [1.8, 7.0]], -3.0, 3.0));
  // Omlijsting met naambord (0,3 m voor de gevel).
  parts.push(box(-2.35, -0.3, B, 2.35, 0.05, 5.6));
  // Torentje boven de boog met nis voor het ruiterbeeld.
  parts.push(box(-0.95, -0.45, 4.0, 0.95, 1.7, 6.6), hull([...ring3(rect(-1.05, -0.55, 1.05, 1.8), 6.58), [0, 0.2, 7.95], [0, 1.05, 7.95]]), finial([0, 0.6], 7.9, 8.6));
  // Ronde toren links met kegeldak en erkertorentje.
  const lc = [-4.9, 0.7];
  parts.push(
    prism(circle(lc, 2.1, 16), B, 4.4),
    hull([...ring3(circle(lc, 2.1, 16), 4.38), ...ring3(circle(lc, 2.4, 16), 4.68)]),
    hull([...ring3(circle(lc, 2.4, 16), 4.66), [lc[0], lc[1], 9.2]]),
    finial(lc, 9.1, 9.8),
  );
  parts.push(turret([-7.0, 0.2], 0.75, 1.6, 4.35, 6.9));
  // Vierkante toren rechts (8 graden gedraaid): stenen voet, houten
  // verdieping, steil schilddak met dakkapel, slank torentje achter.
  {
    const t = [
      box(-2.3, -2.3, B, 2.3, 2.3, 4.9),
      cornice(-2.3, -2.3, 2.3, 2.3, 4.85, 0.2, 0.05),
      box(-2.5, -2.5, 5.08, 2.5, 2.5, 6.8),
      hull([...ring3(rect(-2.5, -2.5, 2.5, 2.5), 6.78), [-0.4, 0, 10.0], [0.4, 0, 10.0]]),
      finial([0, 0], 9.9, 10.4),
    ];
    const yf = -2.5 + (7.4 - 6.78) / (3.22 / 2.5);
    t.push(box(-0.55, yf, 7.3, 0.55, -0.6, 8.4), xzPrism([[-0.55, 8.38], [0.55, 8.38], [0, 9.0]], yf, -0.6));
    t.push(turret([2.35, 2.35], 0.6, 3.6, 8.4, 10.0));
    // Erker op de voorgevel met console onder 45 graden en afdakje.
    t.push(hull([...ring3(rect(-0.9, -2.9, 0.9, -2.3), 2.6), [-0.9, -2.3, 2.0], [0.9, -2.3, 2.0]]), box(-0.9, -2.9, 2.58, 0.9, -2.3, 3.6));
    t.push(hull([...ring3(rect(-1.0, -3.0, 1.0, -2.3), 3.58), [-1.0, -2.3, 4.1], [1.0, -2.3, 4.1]]));
    const n = union([
      xzPrism(rectPts(-0.55, 0.55, 2.8, 3.4), -3.2, -2.6),
      xzPrism(archPts(0, 0.35, 0.9, 1.6), -2.65, -2.0),
      xzPrism(rectPts(-0.3, 0.3, 7.6, 8.2), yf - 0.3, yf + 0.25),
    ]);
    parts.push(union(t).subtract(n).rotate([0, 0, 8]).translate([5.0, 1.0, 0]));
  }
  const niches = union([
    // Doorgang (spitse top van 50 graden) dwars door het poortgebouw.
    xzPrism(archPts(0, 1.45, B - 0.1, 2.6), -0.8, 4.0),
    xzPrism(archPts(0, 0.4, 5.0, 5.8), -0.75, -0.1),
    xzPrism(archPts(-4.9, 0.35, 2.0, 2.6), -1.8, -1.0),
  ]);
  return inFrame(union(parts).subtract(niches), G_O, G_DEG);
}

// ---------- brug naar het Ton van de Venplein ----------
function brug() {
  // In stelsel G: van de poort (y = -0,2) naar het plein (1,5, -22,2).
  const [ax, ay] = [0, -0.2];
  const [bx, by] = [1.5, -22.2];
  const len = Math.hypot(bx - ax, by - ay);
  const d = [(bx - ax) / len, (by - ay) / len];
  const n = [-d[1], d[0]];
  const seg = (s0, s1, w) => {
    const p = (s, k) => [ax + d[0] * s + n[0] * k * (w / 2), ay + d[1] * s + n[1] * k * (w / 2)];
    return prism([p(s0, 1), p(s1, 1), p(s1, -1), p(s0, -1)], B, 0.35);
  };
  return inFrame(union([seg(0, 10.6, 3.4), seg(10.5, len, 4.4)]), G_O, G_DEG);
}

// ---------- samenstellen ----------
const rot = (m) => m.rotate([0, 0, -AXIS]);
const nodes = [
  ["building:kantoor", rot(kantoor())],
  ["building:gevelrij", rot(gevelrij())],
  ["building:belfort", rot(belfort())],
  ["building:tribune", rot(tribune())],
  ["building:stadspoort", rot(stadspoort())],
  ["road:brug", rot(brug())],
];

for (const [name, solid] of nodes) {
  const df = downFaces(solid, B).filter((g) => g.area > 0.3);
  console.log(name, "ondervlakken:", JSON.stringify(df));
}

const samples = [
  [131390, 407195], // arena, voor de toren
  [131336, 407195], // tuin ten westen van de westvleugel
  [131400, 407242], // pad langs de Europalaan
  [131432, 407205], // plein tussen tribune en oostblok
];
console.log("groundSamplePoints", JSON.stringify(samples.map(toModel)));
console.log("toFrame-controle", JSON.stringify(toFrame([131406, 407172.5], C, 0)));

await writeLandmark({
  slug: "efteling-raveleijn",
  nodes,
  base: B,
  catalog: {
    name: "Raveleijn (Efteling)",
    origin: O,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: samples.map(toModel),
    replacesBuildings: ["NL.IMBAG.Pand.0809100000017646"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (131367,5, 407214,5), het hart van de Belforttoren, op het maaiveld (NAP +8,0 m), +X langs de symmetrie-as van de toren door de arena naar de middelste tribunetoren (48,1 graden rechtsom vanaf de RD-X-as, naar het zuidoosten) en +Y naar het noordoosten. Nodes: building:kantoor (de kantoorvleugels volgens de BAG-contour met mansarde en dakkapellen, +15,3 m, het oostblok, het hoektorentje en de vijfhoekige hoektoren tot +23,4 m), building:gevelrij (de huisgevels aan de arena met galerij), building:belfort (de Belforttoren tot +32,8 m), building:tribune (het overdekte halfronde tribunegebouw met open front, omloop en drie torens), building:stadspoort (de Magische Stadspoort) en road:brug. De arena blijft PDOK-terrein. Onderkant op 0,5 m onder het maaiveld. Vervangt de PDOK-reconstructie van het BAG-pand; tribune en poort zijn geen BAG-pand.",
    realWorld: {
      officeRoofM: OFFICE_TOP,
      mansardFootM: MANS_FOOT,
      belfortPlanM: [2 * TA, 2 * TB],
      belfortEaveM: T_EAVE,
      belfortRidgeM: T_RIDGE,
      belfortTopM: T_TOP,
      cornerTowerTopM: 23.4,
      tribuneInnerRadiusM: R_IN,
      tribuneOuterRadiusM: 55.3,
      tribuneRoofM: [T_ROOF, T_FRONT],
      tribuneTowerTopsM: { midden: 17.6, noord: 15.95, zuid: 15.3 },
      gatePassageM: [2.9, 4.8],
      gateTopM: 10.4,
      bridgeLengthM: 22,
      groundNapM: GROUND_NAP,
      baseM: B,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Raveleijn_(attractie)",
      "https://www.eftepedia.nl/lemma/Raveleijn_(gebouw)",
      "https://www.eftepedia.nl/lemma/Magische_Stadspoort",
      "https://commons.wikimedia.org/wiki/Category:Raveleijn (foto's van de arena, de Belforttoren, de stadspoort en de tribune-achterzijde)",
      "PDOK BAG pand 0809100000017646, EPSG:28992",
      "PDOK BGT overigbouwwerk (overkapping van de tribune, de poort)",
      "PDOK AHN DSM/DTM 0,5 m via WCS: daken van de vleugels, de toren, de hoektoren, de tribune en de torens, het maaiveld",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR): vijfhoekige hoektoren, torendaken, poort en brug",
    ],
  },
});

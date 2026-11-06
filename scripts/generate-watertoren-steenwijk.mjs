// Watertoren van Steenwijk: geen losse watertoren, maar de toren van de Grote of Sint-Clemenskerk (rijksmonument 34576)
// aan de Kerkstraat, waarin in 1907 een reservoir van 145 m³ is geplaatst (Wikipedia "Watertoren (Steenwijk)"). Het
// BAG-pand 1708100000005816 omvat kerk en toren samen, dus het model vervangt het hele pand: de toren in detail en de
// kerk als hallenkerk met drie evenwijdige zadeldaken.
//
// Toren: vierkant, bakstenen onderbouw met het westportaal (deur onder een hoog spitsboogvenster in een spitsboognis),
// daarboven drie geledingen met elk drie hoge spitsboognissen per zijde (de middelste in de bovenste twee met galmgaten),
// gescheiden door waterlijsten; bovenaan een kraaglijst met een opengewerkte balustrade en vier hoektorentjes met
// spitsjes. Daarop een hoge achtkante leien naaldspits met vier ingesnoerde voeten (broach), vier wijzerplaten aan de
// voet, vier dakkapelletjes halverwege, een open achtkante lantaarn, een klein spitsje, een bol en het kruis met de
// haan. Kerk: noordbeuk (smal en lager), middenschip en zuidbeuk onder drie zadeldaken van leien die elkaar in kilgoten
// op goothoogte raken; middenschip en zuidbeuk eindigen in een driezijdig gesloten koor (3/8) met een veelhoekig
// schilddak, de noordbeuk en de zuidbeuk hebben een schild aan de westkant, de noordbeuk ook aan de oostkant. Steunberen
// met versnijdingen en hoge spitsboogvensters tussen de beren; kleine dakkapellen op de buitenste dakvlakken.
//
// Oorsprong op de as van de spits (top van het AHN-DSM; het hart van de torentop in het DSM ligt er 0,05 m naast) op
// het maaiveld aan de voet van de toren, AHN-DTM NAP +4,7 (west 4,5 à 4,6, rond de toren 4,6 à 4,8; de kerk loopt naar
// het oosten op tot NAP +5,6). +X wijst naar RD-richting -1,4 graden (oost, de as van het schip uit de nokken in het
// AHN-DSM en de noord- en zuidmuur in de BAG), +Y naar het noorden; het westportaal zit in de -X-zijde.
// Maten: plattegrond van de kerk uit de BAG (muren, steunberen, koorsluitingen) in dit stelsel; goot NAP +18,1 (13,4 m),
// nokken NAP +22,0 (noordbeuk, 17,3 m), +24,5 (middenschip, 19,8 m) en +24,9 (zuidbeuk, 20,2 m) en de kilgoten op
// goothoogte uit het AHN-DSM 0,5 m; dakvlakken als planvergelijkingen met één helling per dak (52 tot 57 graden).
// Toren: bovenkant balustrade NAP +50,0 (45,3 m), hoektorentjes tot circa +55 en de top van de spits NAP +85,5 (80,8 m)
// uit het AHN-DSM; de lantaarn (bovenkant circa NAP +80) eveneens. De 85 m in de Wikipedia-lijst is dus niet de hoogte
// boven maaiveld (de toren is 80,8 m tot de bol/het kruis volgens het AHN). Geledingen, nissen, portaal, hoektorentjes,
// broach, wijzerplaten, dakkapelletjes, lantaarn en spitsprofiel uit de foto "Steenwijkerland-Steenwijk, de Grote of
// Sint-Clementskerk RM34576 IMG 8488 2023-09-11 15.09.jpg" (Commons, vanuit het westen, telelens: 29,4 px/m tot de
// balustrade, daarboven 26,2 px/m verankerd op de lantaarn in het AHN); kerk, steunberen, vensters en dakkapellen uit
// "34576 Grote of Sint-Clemenskerk 2.jpg" en de RCE-foto's 20205452, 20205455 en 20205441.
import { Manifold, CrossSection, ccw, hull, union, box, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [204085.1, 533633.3];
const AXIS_DEG = -1.4;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 4.7;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: west van de toren 46,70 (op
// 7 m), noordwest 46,66, zuidwest 46,67; noord en zuid van de toren 46,78 en 46,91. Naar het oosten loopt het terrein op
// tot 47,8 achter het koor; de muren staan daar 1,1 m in het maaiveld.
const GROUND_ELLIPSOID = 46.66;

const T = Math.tan(Math.PI / 8);
const COS8 = Math.cos(Math.PI / 8);
// Achthoek met apothema a op hoogte z, zijden haaks op 0, 45, ... 315 graden.
const oct = (a, z, c = [0, 0]) => Array.from({ length: 8 }, (_, k) => {
  const t = (Math.PI / 8) * (2 * k + 1);
  return [c[0] + (a / COS8) * Math.cos(t), c[1] + (a / COS8) * Math.sin(t), z];
});
const octStack = (rings, c) => hull(rings.flatMap(([a, z]) => oct(a, z, c)));
const rectRing = (hu, hv, z) => [[-hu, -hv, z], [hu, -hv, z], [hu, hv, z], [-hu, hv, z]];

// Spitsboog (gelijkzijdig) van breedte w met de aanzet op zs, als punten [y, z] van links naar rechts.
const pointedArc = (w, zs, n = 5) => {
  const left = Array.from({ length: n + 1 }, (_, k) => {
    const t = Math.PI - (Math.PI / 3) * (k / n);
    return [w / 2 + w * Math.cos(t), zs + w * Math.sin(t)];
  });
  const right = left.slice(0, -1).reverse().map(([y, z]) => [-y, z]);
  return [...left, ...right];
};
// Spitsboognis in het vlak met normaal +X op afstand f, breedte w, van z0 tot de top (aanzet zs = top - 0,866 w). De
// achterwand ligt 'depth' dieper en de boog daar 2 × depth hoger, zodat het plafond naar binnen oploopt (de facetten bij
// de top staan circa 64 graden); buiten de gevel loopt de snede schuin af.
const lancet = (f, w, z0, top, depth = 0.35) => {
  const zs = top - 0.866 * w;
  const arc = pointedArc(w, zs);
  const a = f - depth;
  return hull([
    ...arc.map(([y, z]) => [a, y, z + 2 * depth]),
    ...arc.map(([y, z]) => [f, y, z]),
    ...arc.map(([y, z]) => [f + 1, y, Math.max(z0, z - 1.5)]),
    [a, -w / 2, z0], [a, w / 2, z0], [f + 1, -w / 2, z0], [f + 1, w / 2, z0],
  ]);
};
// Rechthoekige nis met een plafond van 56 graden naar binnen (zoals in de andere watertorens).
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, out = Math.min(1, (z1 - z0) / 1.5), za = z1 + 1.5 * depth, zb = z1 - 1.5 * out;
  return hull([
    [a, -w / 2, z0], [f + out, -w / 2, z0], [a, w / 2, z0], [f + out, w / 2, z0],
    [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [f + out, -w / 2, zb], [f + out, w / 2, zb],
  ]);
};
const at = (m, deg, u = 0, v = 0) => place(m, { deg, at: [u, v, 0] });

// ======================= TOREN =======================
// Halve breedtes (u oost-west, v noord-zuid): AHN-DSM bovenaan 10,4 × 10,4 m, BAG aan de voet 10,2 × 11,2 m.
const TU = 5.2, TV = 5.3;
const H = {
  plinth: 1.2,
  courses: [12.2, 23.6, 34.4], // waterlijsten tussen de geledingen (0,4 m hoog, 0,15 m uitstekend)
  cornice: [43.3, 44.2], // kraaglijst onder de balustrade
  walk: 44.4, // omgang achter de balustrade
  parapet: 45.3, // bovenkant balustrade (AHN-DSM NAP +50,0)
  turret: [44.2, 47.3, 51.4], // hoektorentjes: romp tot 47,3, spitsje tot 51,4 (AHN-DSM tot circa NAP +55)
  broach: 48.0, // einde van de ingesnoerde voeten van de spits
  lanternFoot: 71.6,
  lanternTop: 75.2, // AHN-DSM: lantaarn tot circa NAP +80
  top: 80.8, // AHN-DSM NAP +85,5
};
// Spitsprofiel (apothema, z) uit de foto: iets bol.
const SPIRE = [[3.52, H.walk], [3.25, H.broach], [2.23, 61.0], [1.03, H.lanternFoot]];
const spireA = (z) => {
  for (let i = 0; i < SPIRE.length - 1; i++) {
    const [a0, z0] = SPIRE[i], [a1, z1] = SPIRE[i + 1];
    if (z <= z1) return a0 + ((a1 - a0) * (z - z0)) / (z1 - z0);
  }
  return SPIRE[SPIRE.length - 1][0];
};

// Romp met plint (0,15 m, schuin afgezet) en waterlijsten (onderkant 50 graden).
const shaft = box(-TU, -TV, BASE, TU, TV, H.walk);
const slab = (o0, z0, o1, z1, extra = []) => hull([...rectRing(TU + o0, TV + o0, z0), ...rectRing(TU + o1, TV + o1, z1), ...extra]);
const plinth = slab(0.15, BASE, 0.15, 1.0, rectRing(TU, TV, H.plinth));
const course = (z) => slab(-0.3, z - 0.18, 0.15, z, rectRing(TU + 0.15, TV + 0.15, z + 0.4));
const courses = union(H.courses.map(course));
// Kraaglijst van 0,35 m (onderkant 50 graden) met daarop de balustrade (0,9 m dik, als blinde rij openingen).
const cornice = slab(-0.3, H.cornice[0] - 0.42, 0.35, H.cornice[0], rectRing(TU + 0.35, TV + 0.35, H.cornice[1]));
const parapet = box(-TU - 0.35, -TV - 0.35, H.cornice[1] - 0.01, TU + 0.35, TV + 0.35, H.parapet).subtract(
  box(-TU + 0.55, -TV + 0.55, H.walk, TU - 0.55, TV - 0.55, H.parapet + 1));
// Balustrade: per zijde zes blinde openingen van 0,9 × 0,5 m, 0,2 m diep (de echte heeft een opengewerkt vierpasmotief).
const parapetHoles = (f, len, deg) => {
  const n = 6, step = (2 * len - 2.4) / n;
  return Array.from({ length: n }, (_, k) => at(niche(f, 0.9, 44.45, 44.95, 0.2).translate([0, -len + 1.2 + step * (k + 0.5), 0]), deg));
};
// Rotatie om Z verwisselt y: bij 90 graden ligt de nis op +v en loopt y mee als -u, wat voor een symmetrische rij gelijk is.
const balustrade = parapet.subtract(union([
  ...parapetHoles(TU + 0.35, TV, 0), ...parapetHoles(TU + 0.35, TV, 180),
  ...parapetHoles(TV + 0.35, TU, 90), ...parapetHoles(TV + 0.35, TU, -90),
]));

// Nissen per zijde: drie hoge spitsboognissen van 1,6 m per geleding, op -3, 0 en +3 m langs de gevel; in de bovenste
// twee geledingen in het midden een diepere galmopening van 1,1 m.
const STAGES = [
  { z0: 12.85, top: 22.6, sides: [180, 90, -90] }, // tweede geleding (de oostzijde zit achter het dak van het schip)
  { z0: 24.25, top: 33.2, sides: [0, 180, 90, -90], louvre: [27.5, 31.6] },
  { z0: 35.05, top: 42.3, sides: [0, 180, 90, -90], louvre: [37.0, 40.8] },
];
const faceDist = (deg) => (deg === 0 || deg === 180 ? TU : TV);
const towerNiches = [];
for (const s of STAGES) {
  for (const deg of s.sides) {
    const f = faceDist(deg);
    for (const y of [-3, 0, 3]) towerNiches.push(at(lancet(f, 1.6, s.z0, s.top, 0.35).translate([0, y, 0]), deg));
    if (s.louvre) towerNiches.push(at(lancet(f - 0.35, 1.1, s.louvre[0], s.louvre[1], 0.3), deg));
  }
}
// Eerste geleding: westportaal (spitsboognis van 2,6 m tot 11,0 m met het venster van 4,9 tot 10,5 m en de deur tot
// 3,8 m), blinde spitsboognissen in de noord- en zuidzijde.
towerNiches.push(
  at(lancet(TU + 0.15, 2.6, 0, 11.0, 0.5), 180),
  at(lancet(TU - 0.35, 1.6, 4.9, 10.5, 0.3), 180),
  at(lancet(TU - 0.35, 1.6, 0, 3.8, 0.4), 180),
  at(lancet(TV, 1.6, 5.0, 11.0, 0.35), 90),
  at(lancet(TV, 1.6, 5.0, 11.0, 0.35), -90),
);

// Hoektorentjes: achtkant van 1,6 m op de hoeken van de kraaglijst, met een achtkant spitsje.
const turret = (cu, cv) => union([
  octStack([[0.8, H.turret[0]], [0.8, H.turret[1]]], [cu, cv]),
  hull([...oct(0.8, H.turret[1] - 0.01, [cu, cv]), [cu, cv, H.turret[2]]]),
]);
const turrets = union([[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([su, sv]) => turret(su * (TU - 0.5), sv * (TV - 0.5))));

// Spits: ingesnoerde voeten (vierkant van 7,7 m naar de achthoek), achtkante naald, wijzerplaten, dakkapelletjes.
const broach = hull([...rectRing(3.85, 3.85, H.walk - 0.01), ...oct(SPIRE[1][0], H.broach)]);
const needle = octStack(SPIRE.map(([a, z]) => [a, z]));
// Wijzerplaat van 2,3 m op de vier hoofdvlakken (middelpunt 49,2 m), 0,15 m voor het vlak met een rand van 50 graden.
const clock = (() => {
  const zc = 49.2, a = spireA(zc), n = 16;
  const ring = (x, r) => Array.from({ length: n }, (_, k) => [x, r * Math.cos((2 * Math.PI * k) / n), zc + r * Math.sin((2 * Math.PI * k) / n)]);
  return hull([...ring(a - 0.3, 1.15), ...ring(a + 0.15, 0.97)]);
})();
// Dakkapelletje (1,0 m breed) halverwege de spits, onderkant 48 graden, zadeldakje.
const lucarne = (() => {
  const a = spireA(61.3), b = a - 0.6, f = a + 0.55;
  return hull([
    [b, -0.5, 59.8], [b, 0.5, 59.8], [f, -0.5, 60.9], [f, 0.5, 60.9],
    [f, -0.5, 61.9], [f, 0.5, 61.9], [f, 0, 62.4], [b, -0.5, 62.6], [b, 0.5, 62.6], [b, 0, 63.1],
  ]);
})();
const spireExtras = union([0, 90, 180, -90].flatMap((deg) => [at(clock, deg), at(lucarne, deg)]));
// Lantaarn met vier spitsboognissen, kroonlijst (50 graden), spitsje, bol (dubbele kegel) en het kruis als naald.
const lantern = union([
  octStack([[1.03, H.lanternFoot - 0.3], [1.03, H.lanternTop]]).subtract(
    union([0, 90, 180, -90].map((deg) => at(lancet(1.03, 0.7, 72.2, 74.7, 0.25), deg)))),
  octStack([[1.03, H.lanternTop - 0.2], [1.2, H.lanternTop], [1.2, H.lanternTop + 0.2]]),
  hull([...oct(1.15, H.lanternTop + 0.19), ...oct(0.12, 79.0)]),
  hull([...oct(0.15, 78.9), ...oct(0.42, 79.25), [0, 0, 79.75]]),
  hull([...oct(0.22, 79.6), [0, 0, H.top]]),
]);

const tower = union([
  union([shaft, plinth, courses, cornice]).subtract(union(towerNiches)),
  balustrade, turrets, broach, needle, spireExtras, lantern,
]);

// ======================= KERK =======================
const E = 13.4; // goot (AHN-DSM NAP +18,1)
const W0 = 4.65; // westmuur van het schip en de beuken (BAG)
// Footprints (u, v): noordbeuk tussen de kilgoot op v 4,9 en de noordmuur op 10,0; middenschip tussen v -4,7 en 4,9 met
// een 3/8-koor (oostvlak op u 64,8); zuidbeuk tussen v -15,05 en -4,7 met een 3/8-koor (oostvlak op u 65,25).
const NORTH = { v0: 4.9, v1: 10.0, u1: 55.8, k: 1.53 };
const apse = (v0, v1, uEast) => {
  const a = (v1 - v0) / 2, vc = (v0 + v1) / 2, uc = uEast - a;
  return { a, vc, uc, poly: [[W0, v0], [uc + a * T, v0], [uEast, vc - a * T], [uEast, vc + a * T], [uc + a * T, v1], [W0, v1]] };
};
const MID = { ...apse(-4.7, 4.9, 64.8), k: 1.33 };
const SOUTH = { ...apse(-15.05, -4.7, 65.25), k: 1.31 };
const northPoly = [[W0, NORTH.v0], [NORTH.u1, NORTH.v0], [NORTH.u1, NORTH.v1], [W0, NORTH.v1]];

// Dak boven een veelhoek: per gootrand (punt p, binnenwaartse normaal n) het vlak z = E + k n·(x - p).
const roof = (poly, k, skip = []) => {
  let m = prism(poly, E - 0.6, E + 12);
  const P = ccw(poly);
  P.forEach(([x0, y0], i) => {
    const [x1, y1] = P[(i + 1) % P.length];
    if (skip.some(([sx, sy]) => Math.abs(sx - (x0 + x1) / 2) < 0.01 && Math.abs(sy - (y0 + y1) / 2) < 0.01)) return;
    const len = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / len, ny = (x1 - x0) / len; // links van de rand = binnen (ccw)
    const nrm = Math.hypot(k * nx, k * ny, 1);
    m = m.trimByPlane([(k * nx) / nrm, (k * ny) / nrm, -1 / nrm], (k * (nx * x0 + ny * y0) - E) / nrm);
  });
  return m;
};
// Het middenschip heeft aan de westkant geen schild (het dak loopt tegen de toren).
const roofs = union([
  roof(northPoly, NORTH.k),
  roof(MID.poly, MID.k, [[W0, (MID.poly[0][1] + MID.poly[5][1]) / 2]]),
  roof(SOUTH.poly, SOUTH.k),
]);
const walls = union([northPoly, MID.poly, SOUTH.poly].map((p) => prism(p, BASE, E)));

// Steunberen: 1,0 m breed, onder tot 6,0 m op volle diepte, daarboven 0,5 m minder diep tot 10,2 m, met schuine
// afzaten (onder 54 graden, boven tegen de muur op tot 12,6 m). Gebouwd langs +X vanaf de muur op x = 0.
const buttress = (D, w = 1.0) => union([
  hull([-0.3, D].flatMap((x) => [[x, -w / 2, BASE], [x, w / 2, BASE]]).concat(
    [[D, -w / 2, 6.0], [D, w / 2, 6.0], [D - 0.5, -w / 2, 6.7], [D - 0.5, w / 2, 6.7], [-0.3, -w / 2, 6.7], [-0.3, w / 2, 6.7]])),
  hull([[-0.3, -w / 2, 6.5], [-0.3, w / 2, 6.5], [D - 0.5, -w / 2, 6.5], [D - 0.5, w / 2, 6.5],
    [D - 0.5, -w / 2, 10.2], [D - 0.5, w / 2, 10.2], [-0.3, -w / 2, 12.6], [-0.3, w / 2, 12.6]]),
]);
const NB = [11.75, 23.5, 28.8, 34.05, 39.3, 44.6, 50.45]; // noordmuur (BAG)
const SB = [11.75, 17.8, 23.6, 28.9, 34.1, 39.4, 44.75, 50.25, 54.25, 58.2]; // zuidmuur (BAG)
const octVertex = (A, deg) => {
  const r = A.a / COS8, t = (deg * Math.PI) / 180;
  return [A.uc + r * Math.cos(t), A.vc + r * Math.sin(t)];
};
const radial = (A, deg, D = 1.2) => at(buttress(D).translate([A.a / COS8 - 0.3, 0, 0]), deg, A.uc, A.vc);
const buttresses = union([
  ...NB.map((u) => at(buttress(1.1).translate([NORTH.v1, 0, 0]), 90, u, 0)),
  ...SB.map((u) => at(buttress(1.45).translate([-SOUTH.poly[0][1], 0, 0]), -90, u, 0)),
  // Hoekberen schuin op de westhoeken van de beuken en de oosthoek van de noordbeuk.
  at(buttress(1.4), 135, W0, NORTH.v1),
  at(buttress(1.6), -135, W0, SOUTH.poly[0][1]),
  at(buttress(1.4), 45, NORTH.u1, NORTH.v1),
  // Koorberen op de hoeken van de koorsluitingen (niet in de inspringende hoek tussen beide koren).
  radial(MID, 67.5), radial(MID, 22.5), radial(MID, -22.5),
  radial(SOUTH, 22.5), radial(SOUTH, -22.5), radial(SOUTH, -67.5),
]);

// Vensters: hoge spitsboognissen (0,35 m) tussen de steunberen, onderkant 3,6 m, top 12,2 m.
const bays = (bs, from, to) => {
  const edges = [from, ...bs, to];
  return edges.slice(0, -1).map((u, i) => [(u + edges[i + 1]) / 2, edges[i + 1] - u - 1.0]);
};
const win = (f, width) => lancet(f, Math.min(2.4, width - 1.4), 3.6, 12.2, 0.35);
const windows = [
  ...bays(NB, W0 + 0.5, NORTH.u1 - 0.5).flatMap(([u, w]) => (w > 8 ? [u - w / 4 - 0.25, u + w / 4 + 0.25].map((x) => at(win(NORTH.v1, 4.5), 90, x, 0)) : [at(win(NORTH.v1, w), 90, u, 0)])),
  ...bays(SB, W0 + 0.5, SOUTH.uc + SOUTH.a * T - 0.6).map(([u, w]) => at(win(-SOUTH.poly[0][1], w), -90, u, 0)),
  // Koorvensters in de drie vlakken van beide koren.
  ...[MID, SOUTH].flatMap((A) => [-45, 0, 45].map((deg) => at(lancet(A.a, 2.0, 3.6, 12.2, 0.35), deg, A.uc, A.vc))),
  // Vensters in de oostmuur van de noordbeuk en in de westmuren van beide beuken.
  at(lancet(NORTH.u1, 2.0, 3.6, 11.6, 0.35), 0, 0, (NORTH.v0 + NORTH.v1) / 2),
  at(lancet(-W0, 2.0, 3.6, 11.6, 0.35), 180, 0, 7.7),
  at(lancet(-W0, 2.4, 3.6, 12.2, 0.35), 180, 0, -10.2),
];

// Dakkapellen op de buitenste dakvlakken: 1,0 m breed met een zadeldakje.
const dormer = (vFront, zFront, dir, k) => {
  // dir = +1: dakvlak naar +v (noordbeuk), -1: naar -v (zuidbeuk); de achterkant ligt 1,6 m hogerop in het dak.
  const vb = vFront - dir * 1.6, zb = zFront + 1.6 * k;
  return hull([
    [-0.5, vFront, zFront - 0.6], [0.5, vFront, zFront - 0.6], [-0.5, vFront, zFront + 1.2], [0.5, vFront, zFront + 1.2], [0, vFront, zFront + 1.7],
    [-0.5, vb, zFront - 0.6], [0.5, vb, zFront - 0.6], [-0.5, vb, zFront + 1.2], [0.5, vb, zFront + 1.2], [0, vb, zFront + 1.7],
  ]).intersect(box(-1, Math.min(vFront, vb), zFront - 0.6, 1, Math.max(vFront, vb), zb + 2));
};
const southRoofZ = (v) => E + SOUTH.k * (v - SOUTH.poly[0][1]);
const northRoofZ = (v) => E + NORTH.k * (NORTH.v1 - v);
const dormers = union([
  ...[12, 30, 48].map((u) => dormer(-13.6, southRoofZ(-13.6), -1, SOUTH.k).translate([u, 0, 0])),
  ...[14, 36].map((u) => dormer(9.0, northRoofZ(9.0), 1, NORTH.k).translate([u, 0, 0])),
]);

const church = union([walls, roofs, buttresses]).subtract(union(windows));
const building = union([tower, church, dormers]);

await writeLandmark({
  slug: "watertoren-steenwijk",
  base: BASE,
  nodes: [["building:kerktoren-met-watertoren-en-grote-kerk", building]],
  catalog: {
    name: "Watertoren Steenwijk (toren van de Grote of Sint-Clemenskerk)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-7, 0], [-7, 5], [-7, -5], [0, 7], [0, -7]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1708100000005816"],
    description:
      "Oorsprong op de as van de spits op het maaiveld aan de voet van de toren (NAP +4,7 m), +X naar RD-richting -1,4 graden (oost, de as van het schip), +Y naar het noorden; westportaal in de -X-zijde. Vierkante toren (10,4 × 10,6 m) met plint, westportaal, drie geledingen met drie spitsboognissen per zijde en galmgaten, waterlijsten, kraaglijst met balustrade tot 45,3 m en vier hoektorentjes; achtkante naaldspits met ingesnoerde voeten, wijzerplaten en dakkapelletjes, lantaarn, spitsje en bol tot 80,8 m. Kerk uit één BAG-pand: noordbeuk, middenschip en zuidbeuk onder drie zadeldaken (nokken 17,3, 19,8 en 20,2 m, goot 13,4 m), twee 3/8-koren met veelhoekige schilden, steunberen, spitsboogvensters en dakkapellen. Maten uit BAG, AHN en foto's.",
    realWorld: {
      waterTowerSince: 1907,
      reservoirM3: 145,
      wikipediaHeightM: 85,
      monument: 34576,
      ahnGroundNapM: GROUND_NAP,
      ahnParapetNapM: 50.0,
      ahnSpireTopNapM: 85.5,
      ahnEaveNapM: 18.1,
      ahnRidgesNapM: { noordbeuk: 22.0, middenschip: 24.5, zuidbeuk: 24.9 },
      towerM: [TU * 2, TV * 2],
      coursesM: H.courses,
      parapetM: H.parapet,
      lanternM: [H.lanternFoot, H.lanternTop],
      topM: H.top,
      eaveM: E,
      roofPitch: { noordbeuk: NORTH.k, middenschip: MID.k, zuidbeuk: SOUTH.k },
      photoScalePxPerM: [29.4, 26.2],
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Steenwijk) (reservoir van 145 m³ in 1907 in de kerktoren geplaatst; 85 m in de infobox)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/34576 (Grote of Sint-Clemenskerk)",
      "https://commons.wikimedia.org/wiki/File:Steenwijkerland-Steenwijk,_de_Grote_of_Sint-Clementskerk_RM34576_IMG_8488_2023-09-11_15.09.jpg (toren vanuit het westen: geledingen, portaal, balustrade, hoektorentjes, spits, lantaarn)",
      "https://commons.wikimedia.org/wiki/File:34576_Grote_of_Sint-Clemenskerk_2.jpg (zuidzijde: steunberen, vensters, dakkapel, toren)",
      "https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_-_Steenwijk_-_20205452_-_RCE.jpg, File:Exterieur_zuid-oost_zijde_-_Steenwijk_-_20205455_-_RCE.jpg, File:Kerk_naar_het_zuid-westen_-_Steenwijk_-_20205441_-_RCE.jpg (koren, schilddaken, noordzijde)",
      "PDOK BAG-pand 1708100000005816, AHN DSM/DTM 0,5 m, luchtfoto en PDOK 3D-tegels (maaiveld), 2026-11-06",
    ],
  },
});

// Watertoren van Dordrecht aan het Wantij (Oranjelaan), nu hotel-restaurant Villa Augustus. Gebouwd in 1882 naar ontwerp
// van stadsarchitect J.A. van der Kloes, kasteelachtig, volgens Wikipedia 33 m hoog met een reservoir van 500 m³;
// rijksmonument 526400. In 1938 zijn de hoektorentjes deels afgebroken voor een verbouwing van het reservoir; bij de
// restauratie van 2006-2007 kregen ze open spitsen van staal en glas.
//
// Opbouw van de toren: een vierkante bakstenen schacht van 14,8 m met vier hoekrisalieten van 3,45 m en daartussen een
// 0,5 m terugliggend middenveld (BAG) met een middenpilaster; een waterlijst boven de begane grond, drie verdiepingen
// vensters (enkele vensters in de risalieten, gekoppelde vensters in de middenvelden) en bogen die het middenveld
// bovenaan dichten onder een zware kroonlijst op 21,4 m. Daarop een terras met (weggelaten) hekwerk rond de
// reservoirverdieping: een zestienhoek met twee rijen kleine vensters, een kroonlijst en een kegeldak, met in de hoeken
// vier achtkante torentjes met spitsen (twee naalden, een fles en een vaas), vier schoorstenen en een achtkante glazen
// lantaarn in twee geledingen met donkere daken tot 32,85 m.
//
// De toren is geen eigen BAG-pand: hij staat in pand 0505100000025142 (bouwjaar 1882) samen met de hotelvleugel aan de
// noordoostkant: een liftschacht en een stalen trappenhuis tegen de toren, een vleugel met plat dak en een middenopbouw,
// een gebouw met zadeldak en topgevels (nok dwars op de vleugel) en een laag aanbouwtje met lessenaarsdak. Het model
// vervangt daarom het hele pand.
//
// Oorsprong op het hart van de toren op het maaiveld: AHN-DTM NAP +3,60 (vlak terrein, 3,55 tot 3,63 rond het pand).
// +X wijst naar RD-richting 45 graden (noordoost, langs de vleugel), +Y naar 135 graden (noordwest); de BAG-gevels lopen
// op 44,3 tot 45,4 graden. Maten: plattegrond uit de BAG; hoogtes uit het AHN-DSM 0,5 m: reservoirgoot NAP +29,1
// (25,5 m), dak op straal 2,5 m NAP +31,0, lantaarn NAP +36,45 (32,85 m), liftschacht NAP +30,5, trappenhuis tot circa
// NAP +26,6, vleugel NAP +10,0 met middenopbouw +11,6, zadeldak goot +9,2 en nok +12,0, aanbouw +8,1 tot +6,9.
// Gevelindeling, kroonlijsten, torentjes, spitsen en lantaarn uit de foto's "Dordrecht - watertoren vooraanzicht
// 2011-02-06.jpg" (zuidwestgevel, frontaal, 51,7 px/m) en "Watertoren aan het Wantij - WLM 2011 - ednl.jpg" (bovenbouw
// van het noordwesten), de vleugel uit "Watertower, Dordrecht (9733967598).jpg" (zuidoostzijde).
import { hull, union, box, prism, place, rect, circle, Manifold, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [106564.4, 425436.0];
const AXIS_DEG = 45;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = 3.6;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints, gemeten 2026-11-06: 47,19 bij de kop van de
// vleugel (41, 0), elders 47,21 tot 47,28 (het terrein is vlak; AHN-DTM NAP +3,55 tot +3,63).
const GROUND_ELLIPSOID = 47.19;

// BAG-pand 0505100000025142 in het lokale stelsel (PDOK BAG-WFS, 2026-11-06).
const BAG = [[-3.96, -7.47], [-3.96, -6.92], [3.85, -6.91], [3.85, -7.37], [7.35, -7.4], [21.07, -7.11], [29.91, -7.1], [38.69, -7.24], [38.76, 7.58], [21.21, 7.3], [15.36, 7.25], [14.9, 7.76], [13.42, 7.77], [12.94, 7.25], [3.82, 7.41], [3.82, 6.9], [-3.97, 6.87], [-3.99, 7.4], [-7.4, 7.38], [-7.42, 3.8], [-6.97, 3.82], [-6.91, -3.85], [-7.35, -3.87], [-7.39, -7.43]];

// ---------- hulpvormen ----------
// Rechthoekige nis in het vlak met normaal +X op afstand f, breedte w rond y, van z0 tot z1; het plafond loopt naar
// binnen onder 63 graden op, buiten de gevel loopt de snede schuin af (bij een lage nis minder ver, zodat het plafond
// ook dan steiler blijft dan 45 graden).
const niche = (f, w, z0, z1, depth = 0.3, y = 0) => {
  const a = f - depth, za = z1 + 2 * depth, e = Math.min(1, (z1 - z0) / 1.5), zb = z1 - 1.5 * e;
  return hull([[a, -w / 2, z0], [f + e, -w / 2, z0], [a, w / 2, z0], [f + e, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [f + e, -w / 2, zb], [f + e, w / 2, zb]]).translate([0, y, 0]);
};
// Gevelrichtingen: draaihoek; s is de modelcoördinaat langs de gevel (Y bij +X/-X, X bij +Y/-Y).
const DIRS = { "+x": { deg: 0, s: (s) => s }, "+y": { deg: 90, s: (s) => -s }, "-x": { deg: 180, s: (s) => -s }, "-y": { deg: -90, s: (s) => s } };
const FACES = Object.keys(DIRS);
// f is de afstand van de gevel tot de oorsprong langs de normaal (bij -x en -y dus de positieve waarde).
const win = (dir, f, s, w, z0, z1, depth = 0.3) => place(niche(f, w, z0, z1, depth, DIRS[dir].s(s)), { deg: DIRS[dir].deg });
// Uitspringend blok op een gevel (pilaster, lisene): van f tot f + d, breedte w rond s, z0 tot z1, bovenkant schuin.
const pilaster = (dir, f, s, w, d, z0, z1) =>
  place(hull([[f - 0.1, -w / 2, z0], [f + d, -w / 2, z0], [f - 0.1, w / 2, z0], [f + d, w / 2, z0], [f + d, -w / 2, z1], [f + d, w / 2, z1], [f - 0.1, -w / 2, z1 + d + 0.1], [f - 0.1, w / 2, z1 + d + 0.1]]).translate([0, DIRS[dir].s(s), 0]), { deg: DIRS[dir].deg });
// Lijst rond een (niet per se convexe) veelhoek: per zijde een prisma dat van de gevel onder 52 graden d naar buiten
// springt (z0 tot z0 + 1,28 d) en tot z1 doorloopt, plus een hoekstuk per hoekpunt.
const ledge = (poly, d, z0, z1) => {
  const pts = poly.length;
  const sign = (() => { let a = 0; poly.forEach(([x0, y0], i) => { const [x1, y1] = poly[(i + 1) % pts]; a += x0 * y1 - x1 * y0; }); return a > 0 ? 1 : -1; })();
  const zc = z0 + 1.28 * d;
  const parts = [];
  const normal = (a, b) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [(sign * (b[1] - a[1])) / l, (-sign * (b[0] - a[0])) / l]; };
  for (let i = 0; i < pts; i++) {
    const a = poly[i], b = poly[(i + 1) % pts], n = normal(a, b);
    const o = (p, k) => [p[0] + n[0] * k, p[1] + n[1] * k];
    const inner = (p) => o(p, -0.1);
    parts.push(hull([...[a, b].map((p) => [...inner(p), z0 - 0.128]), ...[a, b].map((p) => [...inner(p), z1]), ...[a, b].flatMap((p) => [[...o(p, d), zc], [...o(p, d), z1]])]));
    const c = poly[(i + 1) % pts], n2 = normal(c, poly[(i + 2) % pts]);
    parts.push(hull([[c[0] - 0.1 * (n[0] + n2[0]), c[1] - 0.1 * (n[1] + n2[1]), z0 - 0.128], [c[0], c[1], z1], [c[0] + n[0] * d, c[1] + n[1] * d, zc], [c[0] + n2[0] * d, c[1] + n2[1] * d, zc], [c[0] + (n[0] + n2[0]) * d, c[1] + (n[1] + n2[1]) * d, zc], [c[0] + n[0] * d, c[1] + n[1] * d, z1], [c[0] + n2[0] * d, c[1] + n2[1] * d, z1], [c[0] + (n[0] + n2[0]) * d, c[1] + (n[1] + n2[1]) * d, z1]]));
  }
  return union(parts);
};
// Regelmatige n-hoek met apothema a (zijden haaks op de assen bij de gekozen fase) op hoogte z rond c.
const ngon = (n, a, z, c = [0, 0], phase = Math.PI / n) => circle(c, a / Math.cos(Math.PI / n), n, phase).map(([x, y]) => [x, y, z]);

// ---------- toren ----------
const T = 7.4; // halve breedte over de risalieten (BAG 14,8 m)
const TR = 6.9; // gevel van het terugliggende middenveld (BAG 0,5 m terug)
const RS = 3.95; // halve breedte van het middenveld
const H = {
  belt: [6.3, 6.6], // waterlijst boven de begane grond
  arch: [18.95, 19.6], // bogen dichten het middenveld (aanzet tot volle gevel, 52 graden)
  cornice: [20.75, 21.4], // kroonlijst
  floors: [[7.5, 9.9], [11.3, 13.7], [15.1, 17.5]], // vensters van de drie verdiepingen
  top: 21.4, // terras
};
const towerShaft = box(-T, -T, BASE, T, T, H.cornice[0] + 0.01);
// Middenvelden: 0,5 m terug van de grond tot de bogen; bovenaan springt de gevel onder 52 graden weer naar voren.
const recess = (dir) => place(hull([[TR, -RS, BASE - 1], [T + 1, -RS, BASE - 1], [TR, RS, BASE - 1], [T + 1, RS, BASE - 1], [TR, -RS, H.arch[0]], [TR, RS, H.arch[0]], [T, -RS, H.arch[1]], [T, RS, H.arch[1]], [T + 1, -RS, H.arch[1]], [T + 1, RS, H.arch[1]]]), { deg: DIRS[dir].deg });
// Middenpilaster in elk middenveld: 0,9 m breed, 0,3 m uit de gevel, van de grond tot de bogen.
const midPilasters = FACES.map((dir) => pilaster(dir, TR, 0, 0.9, 0.3, BASE, H.arch[0] - 0.4));
// Plattegrond met middenvelden, voor de waterlijst.
const towerPlan = [[-T, -T], [-RS, -T], [-RS, -TR], [RS, -TR], [RS, -T], [T, -T], [T, -RS], [TR, -RS], [TR, RS], [T, RS], [T, T], [RS, T], [RS, TR], [-RS, TR], [-RS, T], [-T, T], [-T, RS], [-TR, RS], [-TR, -RS], [-T, -RS]];
const belt = ledge(towerPlan, 0.15, H.belt[0], H.belt[1]);
const cornice = hull([...ngon(4, T, H.cornice[0]), ...ngon(4, T + 0.3, H.cornice[0] + 0.38), ...ngon(4, T + 0.3, H.top)].map(([x, y, z]) => [x, y, z]));
const tower = union([towerShaft.subtract(union(FACES.map(recess))), ...midPilasters, belt, cornice]);
// Vensters: per verdieping één venster (0,9 m) per risaliet en twee gekoppelde vensters (samen 1,9 m) per middenveld;
// op de begane grond deuren en hoge vensters met bogen. Op de noordoostgevel staan de vleugel, de lift en het
// trappenhuis ervoor; daar alleen de vensters van de noordelijke risaliet.
const towerOpenings = union(FACES.flatMap((dir) => [
  ...H.floors.flatMap(([z0, z1]) => [win(dir, T, -5.68, 0.9, z0, z1), win(dir, T, 5.68, 0.9, z0, z1), win(dir, TR, -1.95, 1.9, z0, z1), win(dir, TR, 1.95, 1.9, z0, z1)]
    .filter((_, i) => dir !== "+x" || i === 1)),
  // oculi boven in de risalieten als vierkante nis
  ...(dir === "+x" ? [] : [win(dir, T, -5.68, 0.9, 18.15, 19.05, 0.25)]), win(dir, T, 5.68, 0.9, 18.15, 19.05, 0.25),
  ...(dir === "+x" ? [] : [win(dir, T, -5.68, 1.2, 0.3, 4.4), win(dir, T, 5.68, 1.2, 0.3, 4.4), win(dir, TR, -1.95, 1.9, 0, 4.6), win(dir, TR, 1.95, 1.9, 0, 4.6)]),
]));

// ---------- reservoirverdieping ----------
const RA = 6.1; // apothema van de zestienhoek
const RES = { wall: [H.top - 0.01, 25.12], eave: 25.5, roofTop: 27.6, roofR: 1.9 };
const drum = hull([...ngon(16, RA, RES.wall[0]), ...ngon(16, RA, RES.wall[1])]);
// Kroonlijst 0,3 m uit de gevel met een onderkant van 52 graden, daarop het kegeldak (helling 27 graden, AHN).
const drumCornice = hull([...ngon(16, RA, RES.wall[1] - 0.01), ...ngon(16, RA + 0.3, RES.eave - 0.05), ...ngon(16, RA + 0.3, RES.eave)]);
const drumRoof = hull([...ngon(16, RA + 0.3, RES.eave), ...ngon(16, RES.roofR / Math.cos(Math.PI / 16), RES.roofTop)]);
// Vensters: twee per zijde op de twaalf zijden tussen de torentjes, in twee rijen.
const drumWindows = union([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].filter((k) => k % 4 !== 2).flatMap((k) => [-0.6, 0.6].flatMap((y) => [
  niche(RA, 0.7, 21.9, 23.0, 0.25, y).rotate([0, 0, k * 22.5]),
  niche(RA, 0.7, 23.7, 24.6, 0.25, y).rotate([0, 0, k * 22.5]),
])));
// Hoektorentjes: achtkant (omgeschreven straal 1,35 m) op (±5,7, ±5,6), met een kroonlijst en een verbinding met de
// reservoirverdieping; smalle vensters op de drie buitenzijden.
const TURRETS = [[5.7, 5.6], [-5.7, 5.6], [-5.7, -5.6], [5.7, -5.6]];
const TA = 1.35 * Math.cos(Math.PI / 8);
const turret = ([x, y]) => {
  const out = (Math.round((Math.atan2(y, x) * 4) / Math.PI) * Math.PI) / 4;
  const body = hull([...ngon(8, TA, RES.wall[0], [x, y]), ...ngon(8, TA, RES.wall[1], [x, y])]);
  const cap = hull([...ngon(8, TA, RES.wall[1] - 0.01, [x, y]), ...ngon(8, TA + 0.15, RES.wall[1] + 0.19, [x, y]), ...ngon(8, TA + 0.15, RES.eave, [x, y])]);
  const link = box(-0.8, -0.8, RES.wall[0], 0.8, 0.8, RES.wall[1]).scale([1.6, 1, 1]).rotate([0, 0, (out * 180) / Math.PI]).translate([x * 0.85, y * 0.85, 0]);
  // Het oostelijke en zuidoostelijke venster van het oostelijke torentje zitten achter het trappenhuis.
  const ks = x > 0 && y < 0 ? [-1] : [-1, 0, 1];
  const windows = union(ks.map((k) => niche(TA, 0.6, 22.2, 24.2, 0.2).rotate([0, 0, (out * 180) / Math.PI + k * 45]).translate([x, y, 0])));
  return { solid: union([body, cap, link]), windows };
};
const turrets = TURRETS.map(turret);
// Spitsen van staal en glas op de torentjes (gesloten weergegeven): een opstaande rand van 0,8 m en daarboven een naald,
// een fles met hals en bol, of een vaas met een taille. De hals van de fles is 0,9 m breed (in het echt slanker), zodat de
// export hem niet verdikt; de knop op de naalden is weggelaten.
const SPIRE0 = RES.eave;
const oct = (r, z, c) => ngon(8, r * Math.cos(Math.PI / 8), z, c);
const skirt = (c) => hull([...oct(1.25, SPIRE0 - 0.01, c), ...oct(1.25, SPIRE0 + 0.8, c)]);
const needle = (c) => union([skirt(c), hull([...oct(1.05, SPIRE0 + 0.79, c), [c[0], c[1], 33.0]])]);
const bottle = (c) => union([skirt(c), hull([...oct(1.05, SPIRE0 + 0.79, c), ...oct(0.48, 30.7, c)]), hull([...oct(0.48, 30.6, c), ...oct(0.7, 31.2, c), [c[0], c[1], 33.0]])]);
const vase = (c) => union([skirt(c), hull([...oct(1.05, SPIRE0 + 0.79, c), ...oct(0.8, 28.4, c)]), hull([...oct(0.8, 28.39, c), ...oct(1.0, 30.2, c)]), hull([...oct(1.0, 30.2, c), ...oct(0.3, 31.2, c)])]);
// Toewijzing uit de foto's: zuidwestgevel links (noordwest) fles, rechts (zuidoost) naald; van het noordwesten vaas bij
// de lift (noordoost).
const spires = union([vase(TURRETS[0]), bottle(TURRETS[1]), needle(TURRETS[2]), needle(TURRETS[3])]);
// Schoorstenen op het kegeldak (1,0 m, tot 27,5 m) aan weerszijden van de lantaarn.
const chimneys = union([[-4.2, -2.6], [-4.2, 2.6], [4.2, -2.6], [4.2, 2.6]].map(([x, y]) => union([box(x - 0.5, y - 0.5, 24.5, x + 0.5, y + 0.5, 27.3), hull([...ngon(4, 0.5, 27.29, [x, y]), ...ngon(4, 0.62, 27.45, [x, y]), ...ngon(4, 0.62, 27.5, [x, y])])])));
// Lantaarn: achtkant, glazen onderste geleding (apothema 1,7 m), overstekend dak, smallere bovenste geleding en een
// spits dak tot de top (AHN NAP +36,45).
const LAN = { body: [27.0, 29.9], roof1: [29.65, 29.95, 30.05, 30.85], upper: [30.5, 31.5], roof2: [31.3, 31.6], top: 32.85 };
const lanternBody = hull([...ngon(8, 1.7, LAN.body[0]), ...ngon(8, 1.7, LAN.body[1])]);
const lanternRoof1 = hull([...ngon(8, 1.7, LAN.roof1[0]), ...ngon(8, 1.95, LAN.roof1[1]), ...ngon(8, 1.95, LAN.roof1[2]), ...ngon(8, 1.45, LAN.roof1[3])]);
const lanternUpper = hull([...ngon(8, 1.45, LAN.upper[0]), ...ngon(8, 1.45, LAN.upper[1])]);
const lanternRoof2 = hull([...ngon(8, 1.45, LAN.roof2[0]), ...ngon(8, 1.7, LAN.roof2[1]), [0, 0, LAN.top]]);
const lanternGlass = union(Array.from({ length: 8 }, (_, k) => niche(1.7, 1.1, 27.9, 29.4, 0.12).rotate([0, 0, k * 45])));
const lantern = union([lanternBody, lanternRoof1, lanternUpper, lanternRoof2]);

// ---------- lift en trappenhuis tegen de noordoostgevel ----------
// Glazen liftschacht (AHN NAP +30,5) en een stalen trappenhuis met bordessen (circa NAP +27,0), hier gesloten met
// verdiepte velden tussen de bordessen boven het dak van de vleugel.
const lift = box(TR - 0.05, -2.5, BASE, 10.3, 1.5, 26.9);
const STAIR = { u: [TR - 0.05, 11.2], v: [-7.3, -2.5], top: 23.4 };
const stair = box(STAIR.u[0], STAIR.v[0], BASE, STAIR.u[1], STAIR.v[1], STAIR.top);
const stairPanels = union([2, 3, 4, 5, 6].flatMap((k) => {
  const z0 = 0.4 + k * 3.25, z1 = z0 + 2.4;
  return [win("+x", STAIR.u[1], -4.9, 3.6, z0, z1, 0.4), win("-y", -STAIR.v[0], 9.3, 2.6, z0, z1, 0.4)];
}));

// ---------- hotelvleugel ----------
// Vleugel met plat dak (goot NAP +10,0 = 6,35 m, naar het midden 6,75 m) en een middenopbouw van 4,6 m breed tot 7,7 m
// met een flauwe nok op 8,0 m (AHN NAP +11,6).
const W = { v0: -7.25, v1: 7.55 };
const A = { u0: TR - 0.05, u1: 22.0, eave: 6.35, mid: 6.75 };
const wingA = union([
  box(A.u0, W.v0, BASE, A.u1, W.v1, A.eave + 0.01),
  hull([[A.u0, W.v0, A.eave], [A.u1, W.v0, A.eave], [A.u0, W.v1, A.eave], [A.u1, W.v1, A.eave], [A.u0, -2.3, A.mid], [A.u1, -2.3, A.mid], [A.u0, 2.3, A.mid], [A.u1, 2.3, A.mid]]),
  hull([[10.3, -2.3, A.mid - 0.1], [18.6, -2.3, A.mid - 0.1], [10.3, 2.3, A.mid - 0.1], [18.6, 2.3, A.mid - 0.1], [10.3, -2.3, 7.7], [18.6, -2.3, 7.7], [10.3, 2.3, 7.7], [18.6, 2.3, 7.7], [10.3, 0, 8.0], [18.6, 0, 8.0]]),
]);
const wingAOpenings = union([
  ...[12.6, 14.9, 17.2].map((s) => win("-y", -W.v0, s, 1.6, 0.9, 3.9, 0.25)), win("-y", -W.v0, 19.6, 1.4, 0, 2.9, 0.3),
  ...[9.5, 11.8, 14.1, 16.4, 18.7].map((s) => win("+y", W.v1, s, 1.6, 0.9, 3.9, 0.25)),
  ...[12.2, 13.9, 15.6, 17.3].flatMap((s) => [win("-y", 2.3, s, 1.0, 6.85, 7.3, 0.15), win("+y", 2.3, s, 1.0, 6.85, 7.3, 0.15)]),
]);
// Gebouw met zadeldak: nok dwars op de vleugel (goot NAP +9,2 = 5,6 m, nok NAP +12,0 = 8,4 m), topgevels die 0,35 m
// boven het dak uitsteken, een schoorsteen op de zuidoostelijke top, een rond venster (als vierkante nis) in elke topgevel.
const B = { u0: 22.0, u1: 30.4, uc: 26.2, eave: 5.6, ridge: 8.4 };
const roofB = hull([[B.u0, W.v0, B.eave], [B.u1, W.v0, B.eave], [B.u0, W.v1, B.eave], [B.u1, W.v1, B.eave], [B.uc, W.v0, B.ridge], [B.uc, W.v1, B.ridge]]);
const gableB = (v0, v1) => hull([[B.u0, v0, B.eave], [B.u1, v0, B.eave], [B.u0, v1, B.eave], [B.u1, v1, B.eave], [B.u0, v0, B.eave + 0.35], [B.u1, v0, B.eave + 0.35], [B.u0, v1, B.eave + 0.35], [B.u1, v1, B.eave + 0.35], [B.uc, v0, B.ridge + 0.35], [B.uc, v1, B.ridge + 0.35]]);
const wingB = union([
  box(B.u0 - 0.05, W.v0, BASE, B.u1, W.v1, B.eave + 0.01), roofB, gableB(W.v0, W.v0 + 0.5), gableB(W.v1 - 0.5, W.v1),
  box(B.uc - 0.5, W.v0, 7.0, B.uc + 0.5, W.v0 + 1.0, 9.6),
]);
const wingBOpenings = union([
  ...[23.6, 26.2, 28.8].flatMap((s) => [win("-y", -W.v0, s, 1.4, 0.9, 3.6, 0.25), win("+y", W.v1, s, 1.4, 0.9, 3.6, 0.25)]),
  win("-y", -W.v0, B.uc, 1.2, 6.0, 7.0, 0.2), win("+y", W.v1, B.uc, 1.2, 6.0, 7.0, 0.2),
]);
// Laag aanbouwtje met lessenaarsdak van 4,5 m (zuidwest) naar 3,3 m (kop).
const C = { u0: 30.4, u1: 38.7, z0: 4.5, z1: 3.3 };
const wingC = hull([[C.u0 - 0.05, W.v0, BASE], [C.u1, W.v0, BASE], [C.u0 - 0.05, W.v1, BASE], [C.u1, W.v1, BASE], [C.u0 - 0.05, W.v0, C.z0], [C.u0 - 0.05, W.v1, C.z0], [C.u1, W.v0, C.z1], [C.u1, W.v1, C.z1]]);
const wingCOpenings = union([
  ...[-4.0, 0, 4.0].map((s) => win("+x", C.u1, s, 1.4, 0.9, 2.5, 0.25)),
  ...[32.6, 35.6].flatMap((s) => [win("-y", -W.v0, s, 1.4, 0.9, 2.5, 0.25), win("+y", W.v1, s, 1.4, 0.9, 2.5, 0.25)]),
  win("-y", -W.v0, 37.6, 1.0, 0, 2.3, 0.3),
]);

// Vensters en deuren pas na het samenvoegen, zodat aangrenzende delen ze niet weer dichten.
const solids = union([tower, drum, drumCornice, drumRoof, ...turrets.map((t) => t.solid), spires, chimneys, lantern, lift, stair, wingA, wingB, wingC]);
const openings = union([towerOpenings, drumWindows, ...turrets.map((t) => t.windows), lanternGlass, stairPanels, wingAOpenings, wingBOpenings, wingCOpenings]);
const all = solids.subtract(openings);

await writeLandmark({
  slug: "watertoren-dordrecht-villa-augustus",
  base: BASE,
  nodes: [["building:watertoren-met-hotelvleugel", all]],
  catalog: {
    name: "Watertoren Dordrecht (Villa Augustus)",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-9, 0], [0, -9], [0, 9], [20, -9], [20, 9], [41, 0]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0505100000025142"],
    description:
      "Oorsprong op het hart van de toren op het maaiveld (NAP +3,60 m), +X naar RD-richting 45 graden (noordoost, langs de hotelvleugel), +Y naar 135 graden, evenwijdig aan de BAG-gevels. Vierkante bakstenen toren van 14,8 m met hoekrisalieten, terugliggende middenvelden met middenpilaster, waterlijst, drie verdiepingen vensters en een kroonlijst op 21,4 m; daarop de zestienhoekige reservoirverdieping met kegeldak (goot 25,5 m), vier achtkante hoektorentjes met spitsen tot 33 m, vier schoorstenen en een achtkante glazen lantaarn in twee geledingen tot 32,85 m; het hele BAG-pand eromheen: liftschacht, trappenhuis, vleugel met middenopbouw, zadeldakgebouw met topgevels en een aanbouw. Maten uit BAG, AHN en foto's.",
    realWorld: {
      built: 1882,
      architect: "J.A. van der Kloes",
      publishedHeightM: 33,
      reservoirM3: 500,
      rijksmonument: 526400,
      ahnGroundNapM: GROUND_NAP,
      ahnEaveNapM: 29.1,
      ahnLanternTopNapM: 36.45,
      towerM: [T * 2, T * 2],
      corniceM: H.top,
      reservoirEaveM: RES.eave,
      lanternTopM: LAN.top,
      spireTopM: 33.0,
      wingM: { flatEaveM: A.eave, monitorM: 8.0, gableEaveM: B.eave, gableRidgeM: B.ridge, annexM: [C.z0, C.z1] },
      photoScalePxPerM: 51.7,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Dordrecht) (1882, J.A. van der Kloes, 33 m, 500 m³, hoektorentjes deels afgebroken in 1938, hotel sinds 2007)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/526400",
      "https://commons.wikimedia.org/wiki/File:Dordrecht_-_watertoren_vooraanzicht_2011-02-06.jpg (zuidwestgevel frontaal: risalieten, middenvelden, vensters, kroonlijst, torentjes, spitsen, lantaarn, schoorstenen)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_aan_het_Wantij_-_WLM_2011_-_ednl.jpg (bovenbouw: reservoirverdieping, kegeldak, lantaarn in twee geledingen, spitsvormen)",
      "https://commons.wikimedia.org/wiki/File:Watertower,_Dordrecht_(9733967598).jpg (zuidoostzijde: trappenhuis, vleugel, zadeldakgebouw met topgevel)",
      "https://commons.wikimedia.org/wiki/File:Overzicht_met_bijgebouwen_-_Dordrecht_-_20337342_-_RCE.jpg (toestand voor de restauratie)",
      "PDOK BAG-pand 0505100000025142, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-06",
    ],
  },
});

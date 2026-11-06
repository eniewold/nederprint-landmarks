// Watertoren van Hazerswoude-Rijndijk aan de Rijndijk, langs de Oude Rijn. Gebouwd in 1915 naar ontwerp van A.D. Heederik,
// volgens Wikipedia 28,5 m hoog (tot de pinakels), reservoir van 200 m³; sinds 1985 buiten gebruik, van 1999 tot 2003
// verbouwd tot kantoor (Hoogvliet Beheer). Een achtkante betonnen schacht op acht hoekkolommen die naar boven iets
// verjongen, met drie lagen glas tussen de kolommen en een bakstenen plint met rondboogvensters; boven een ringbalk lopen de
// kolommen als consoles uit onder het ronde bakstenen reservoir, met tussen de consoles een oculus. Het reservoir heeft per
// vlak een of twee hoge vensters, een rondboogfries, lisenen die boven de borstwering in pinakels eindigen, en een borstwering
// die boven de dubbele vensters hoger is. Bij de verbouwing kwam er een glazen opbouw met een uitkragende ronde dakschijf op,
// aan de zuidkant een betonnen liftschacht met drie loopbruggen naar de toren, en aan de zuidoostkant een kantoorvleugel van
// 4 m met een groen dak en dakramen (na de AHN-opname, wel in de 3D BAG van 2023 en op de luchtfoto).
//
// Oorsprong op het hart van de cirkel van BAG-pand 1672100000002789 (kleinste-kwadratenfit op de boog, straal 4,54 m, rest
// 1 mm); de top van het DSM ligt 0,2 m ernaast. Lokale X-as = RD-oost; de vlakken van de achtkante schacht staan op k maal 45
// graden (een vlak recht naar de liftschacht op het zuiden), de kolommen op 22,5 + k maal 45. Hoeken hieronder in graden
// linksom vanaf de lokale X-as. Maaiveld AHN-DTM NAP +0,2. Het BAG-pand omvat ook de liftschacht en de vleugel; het model
// vervangt het hele pand.
// Maten: top van de dakschijf uit het AHN (NAP +30,7) en de 3D BAG; liftschacht uit het AHN (NAP +24,5) en de BAG;
// vleugel uit de 3D BAG (dak NAP +4,17, lage strook NAP +3,1). Alle hoogtes van de toren daartussen uit de foto
// "Rijnwoude 016.jpg" (Commons, 2007, vanaf het west-zuidwesten), met een lineair verlopende schaal tussen het maaiveld en
// de top van het AHN; breedtes geschaald op de BAG-cirkel.
import { Manifold, CrossSection, ccw, hull, union, prism, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [100041.57, 460315.25];
const AXIS = [1, 0];
const GROUND_NAP = 0.2;
const BASE = -0.3;
const SEG = 96;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (oost 43,628, west 43,737, noord 43,600, zuid
// 43,626, noordoost 43,599), gemeten 2026-11-06. Het PDOK-pand staat op 43,57.
const GROUND_ELLIPSOID = 43.6;

const rad = (deg) => (deg * Math.PI) / 180;
const polar = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
const rev = (pts) => Manifold.revolve(new CrossSection([ccw(pts)]), SEG);
const octagon = (apothem) => Array.from({ length: 8 }, (_, k) => polar(apothem / Math.cos(rad(22.5)), 22.5 + 45 * k));
const ring3 = (pts, z) => pts.map(([x, y]) => [x, y, z]);
// Nis in het vlak met normaal +X op afstand f, breedte w, van z0 tot z1; het plafond loopt naar binnen onder 56 graden op.
const niche = (f, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  return hull([[a, -w / 2, z0], [b, -w / 2, z0], [a, w / 2, z0], [b, w / 2, z0], [a, -w / 2, za], [f, -w / 2, z1], [a, w / 2, za], [f, w / 2, z1], [b, -w / 2, zb], [b, w / 2, zb]]);
};
const around = (m, degs) => degs.map((deg) => place(m, { deg }));
const faces = Array.from({ length: 8 }, (_, k) => 45 * k);
const corners = faces.map((d) => d + 22.5);

// ---------- hoogtes boven het maaiveld (NAP +0,2) ----------
const H = {
  plinth: 3.6, // bovenkant bakstenen plint
  ringBeam: 15.3, // onderkant ringbalk boven de schacht
  console: 16.08, // bovenkant ringbalk, voet van de consoles
  consoleTop: 18.0, // consoles en metselwerk tot hier, dan een kraag naar de onderrand van het reservoir
  band: 18.37, // onderrand van het reservoir (natuursteen)
  wall: 18.84, // reservoirmantel vanaf hier
  frieze: 24.67, // rondboogfries
  friezeTop: 25.45,
  lisene: 24.4, // onderkant van de lisenen
  low: 26.9, // lage borstwering
  high: 28.1, // hoge borstwering boven de dubbele vensters
  pinnacle: 28.94, // pinakels (Wikipedia: 28,5 m)
  discEdge: 30.0, // onderkant van de rand van de dakschijf
  disc: 30.5, // dakschijf (AHN NAP +30,7, 3D BAG +30,7)
  dome: 30.95, // lichtkoepel midden op het dak (AHN NAP +31,1)
  lift: 24.4, // liftschacht (AHN NAP +24,5; 3D BAG +23,1 tot +25,3)
  wing: 4.0, // kantoorvleugel (3D BAG NAP +4,17)
  wingRoof: 3.7, // groen dak binnen de witte rand
  wingLow: 2.9, // lage strook aan de noordoostkant (3D BAG NAP +3,1)
};
const R = {
  shaftFoot: 3.75, // apothema van de schacht aan de voet (foto: 7,5 m over de vlakken)
  shaftTop: 3.55, // apothema onder de ringbalk (7,1 m)
  ringBeam: 3.65,
  consoleTop: 4.3,
  band: 4.64,
  reservoir: 4.54, // BAG-cirkel
  frieze: 4.69,
  lisene: 4.79, // lisenen en pinakels 0,25 m voor de mantel
  penthouse: 3.6, // glazen opbouw
  disc: 4.65, // dakschijf (luchtfoto: 9,2 m doorsnede)
};
const apothem = (z) => R.shaftFoot + ((R.shaftTop - R.shaftFoot) * (z - BASE)) / (H.ringBeam - BASE);

// ---------- toren ----------
// Schacht: achtkant dat verjongt van 7,5 naar 7,1 m over de vlakken; ringbalk met een kraag van 40 graden.
const shaft = hull([...ring3(octagon(R.shaftFoot), BASE), ...ring3(octagon(R.shaftTop), H.ringBeam)]);
const ringBeam = hull([...ring3(octagon(R.shaftTop), H.ringBeam), ...ring3(octagon(R.ringBeam), H.ringBeam + 0.12), ...ring3(octagon(R.ringBeam), H.console)]);
// Consolezone: van het achtkant van de ringbalk naar een cirkel van 4,3 m; consoles van 0,9 m breed op de hoeken.
const consoleZone = hull([...ring3(octagon(3.6), H.console - 0.01), ...ring3(Array.from({ length: SEG }, (_, k) => polar(R.consoleTop, (360 * k) / SEG)), H.consoleTop)]);
const bracket = hull([-0.45, 0.45].flatMap((y) => [[3.4, y, H.console - 0.01], [3.75, y, H.console - 0.01], [3.4, y, 18.2], [4.45, y, 18.2]]));
const brackets = union(around(bracket, corners));
// Reservoir: kraag (43 graden), onderrand, mantel, rondboogfries met een onderkant van 40 graden, lage borstwering.
const reservoir = rev([
  [0, H.consoleTop - 0.05], [R.consoleTop - 0.05, H.consoleTop - 0.05], [R.band, H.band], [R.band, H.wall], [R.reservoir, H.wall],
  [R.reservoir, H.frieze], [R.frieze, H.frieze + 0.18], [R.frieze, H.friezeTop], [R.reservoir, H.friezeTop], [R.reservoir, H.low], [0, H.low],
]);
// Hoge borstwering: vier segmenten van 45 graden boven de dubbele vensters (45 + k maal 90 graden).
const sector = (deg0, deg1, r0, r1, z0, z1) => {
  const n = 12, outer = Array.from({ length: n + 1 }, (_, k) => polar(r1, deg0 + ((deg1 - deg0) * k) / n));
  const inner = Array.from({ length: n + 1 }, (_, k) => polar(r0, deg1 - ((deg1 - deg0) * k) / n));
  return prism([...outer, ...inner], z0, z1);
};
const highParapet = union([45, 135, 225, 315].map((d) => sector(d - 22.5, d + 22.5, 3.0, R.reservoir, H.low - 0.01, H.high)));
// Lisenen met pinakels op 22,5 + k maal 45 graden: 0,9 m breed, onderkant van 40 graden.
const lisene = hull([-0.45, 0.45].flatMap((y) => [[4.3, y, H.lisene], [4.5, y, H.lisene], [4.3, y, H.lisene + 0.3], [R.lisene, y, H.lisene + 0.3], [4.3, y, H.pinnacle], [R.lisene, y, H.pinnacle]]));
const lisenes = union(around(lisene, corners));
// Glazen opbouw en dakschijf met een onderkant van 48 graden; lichtkoepel in het midden.
const penthouse = Manifold.cylinder(H.disc - H.low + 0.5, R.penthouse, R.penthouse, SEG).translate([0, 0, H.low - 0.5]);
const disc = rev([[0, 28.83], [R.penthouse, 28.83], [R.disc, H.discEdge], [R.disc, H.disc], [0, H.disc]]);
const dome = Manifold.cylinder(H.dome - H.disc + 0.01, 0.7, 0.3, 32).translate([0, 0, H.disc - 0.01]);

// ---------- liftschacht en loopbruggen (zuidkant) ----------
// Liftschacht volgens de BAG (2,7 bij 2,6 m met afgeschuinde hoeken) tot 24,4 m.
const LIFT = [[-1.06, -5.28], [-1.17, -5.99], [-1.46, -6.76], [-0.8, -7.67], [0.24, -7.87], [1.15, -7.23], [1.28, -6.41], [1.25, -5.68], [0.77, -5.6]];
const lift = prism(LIFT, BASE, H.lift);
// Loopbruggen van 1,55 m breed (BAG) tussen de liftschacht en de toren, met een onderkant die vanaf beide kanten onder
// 50 graden naar het midden oploopt (foto: 3,8–7,0, 11,5–15,0 en 18,9–22,3 m; de middelste begint op de dwarsbalk van 12,0 m).
const link = (z0, z1, yTower) => {
  const ySlab = -5.62, yMid = (ySlab + yTower) / 2, rise = (yTower - ySlab) / 2 * Math.tan(rad(50));
  const half = (ya, yb) => hull([-0.6, 0.95].flatMap((x) => [[x, ya, z0], [x, ya, z1], [x, yb, z0 + rise], [x, yb, z1]]));
  return union([
    half(ySlab, yMid), half(yTower, yMid),
    prism([[-0.6, -6.0], [0.95, -6.0], [0.95, ySlab], [-0.6, ySlab]], z0, z1),
    prism([[-0.6, yTower], [0.95, yTower], [0.95, yTower + 0.5], [-0.6, yTower + 0.5]], z0, z1),
  ]);
};
const links = union([link(3.8, 7.0, -apothem(3.8) + 0.1), link(12.0, 15.0, -apothem(12.0) + 0.1), link(18.9, 22.3, -4.45)]);

// ---------- kantoorvleugel (zuidoostkant) ----------
// Contour van het dakvlak in de 3D BAG (zonder de sliver over de toren), met een driehoek tot in de schacht.
const WING = [[6.1, -13.24], [29.17, -3.19], [29.32, -2.92], [29.28, -2.59], [26.96, 2.74], [26.16, 4.3], [22.74, 2.84], [22.67, 3.2], [15.92, 1.26], [16.19, 0], [7.27, -3.87], [4.14, -1.86], [3.39, -3.01], [5.75, -4.55], [2.87, -5.82], [3.55, -7.42], [5.8, -12.83]];
const WING_LOW = [[22.42, 4.33], [15.59, 2.83], [15.92, 1.26], [22.67, 3.2]];
const wingSection = new CrossSection([ccw(WING)]);
const wing = union([
  Manifold.extrude(wingSection, H.wing - BASE).translate([0, 0, BASE]).subtract(Manifold.extrude(wingSection.offset(-0.9, "Miter"), 1).translate([0, 0, H.wingRoof])),
  prism([[4.14, -1.86], [3.39, -3.01], [0, 0]], BASE, H.wing),
  prism(WING_LOW, BASE, H.wingLow),
]);
// Dakramen: drie vierkante van 1,3 m en een rond luik (luchtfoto), 0,5 m boven het groene dak.
const WING_DEG = 23.5;
const skylights = union([
  ...[[19.8, -3.65], [22.5, -2.2], [25.6, 0.1]].map(([x, y]) => place(prism([[-0.65, -0.65], [0.65, -0.65], [0.65, 0.65], [-0.65, 0.65]], H.wingRoof - 0.01, H.wingRoof + 0.5), { deg: WING_DEG, at: [x, y, 0] })),
  Manifold.cylinder(0.51, 0.65, 0.65, 32).translate([10.0, -7.8, H.wingRoof - 0.01]),
]);

// ---------- vensters en nissen ----------
// - plint: een rondboogvenster per vlak (1,0 m breed, 0,9 tot 2,85 m);
// - schacht: per vlak drie lagen glas tussen de kolommen en de dwarsbalken (1,9 m breed, 0,25 m diep), zodat op de hoeken
//   kolommen van 1,1 m blijven staan;
// - consolezone: een oculus per vlak, als ruit van 0,9 bij 1,1 m (plafond 51 graden);
// - reservoir: dubbele vensters (als één nis van 1,7 m) op 45 + k maal 90 graden, enkele (0,9 m) op k maal 90 graden,
//   van 19,9 tot 24,0 m.
const tiers = [[3.95, 7.45], [7.95, 11.5], [12.0, 14.8]];
const oculus = hull([[3.8, 0, 16.6], [4.8, 0, 16.6], [3.8, -0.45, 17.15], [4.8, -0.45, 17.15], [3.8, 0.45, 17.15], [4.8, 0.45, 17.15], [3.8, 0, 17.7], [4.8, 0, 17.7]]);
const windows = union([
  ...around(niche(apothem(1.9), 1.0, 0.9, 2.85), faces),
  ...tiers.flatMap(([z0, z1]) => around(niche(apothem((z0 + z1) / 2), 1.9, z0, z1, 0.25), faces)),
  ...around(oculus, faces),
  ...around(niche(R.reservoir, 1.7, 19.9, 24.0), [45, 135, 225, 315]),
  ...around(niche(R.reservoir, 0.9, 19.9, 24.0), [0, 90, 180, 270]),
]);

const tower = union([shaft, ringBeam, consoleZone, brackets, reservoir, highParapet, lisenes, penthouse, disc, dome]).subtract(windows);
const all = union([tower, lift, links, wing, skylights]);

await writeLandmark({
  slug: "watertoren-hazerswoude-rijndijk",
  base: BASE,
  nodes: [["building:watertoren-schacht-reservoir-opbouw-liftschacht-en-vleugel", all]],
  catalog: {
    name: "Watertoren Hazerswoude-Rijndijk",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[6, 0], [-6, 0], [0, 6], [0, -10], [5, 5]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.1672100000002789"],
    description:
      "Oorsprong op het hart van de ronde BAG-voetafdruk (straal 4,54 m) op het maaiveld (NAP +0,2 m), X-as naar RD-oost. Achtkante betonnen schacht op hoekkolommen met drie lagen glas en een bakstenen plint met rondboogvensters, verjongend van 7,5 naar 7,1 m tot 15,3 m; ringbalk; consoles met oculi tot 18,0 m; rond bakstenen reservoir (straal 4,54 m) met dubbele en enkele vensters, rondboogfries, lisenen met pinakels tot 28,94 m en een borstwering van 26,9 en 28,1 m; glazen opbouw met een dakschijf van 9,3 m tot 30,5 m en een lichtkoepel; liftschacht van 24,4 m aan de zuidkant met drie loopbruggen; kantoorvleugel van 4 m met groen dak aan de zuidoostkant. Maten uit BAG, 3D BAG, AHN en foto's.",
    realWorld: {
      built: 1915,
      architect: "A.D. Heederik",
      converted: "1999-2003, kantoor",
      publishedHeightM: 28.5,
      reservoirM3: 200,
      ahnGroundNapM: GROUND_NAP,
      ahnTopNapM: 30.7,
      bagRadiusM: R.reservoir,
      shaftAcrossFlatsM: [R.shaftFoot * 2, R.shaftTop * 2],
      ringBeamM: H.console,
      reservoirBottomM: H.wall,
      lowParapetM: H.low,
      highParapetM: H.high,
      pinnacleM: H.pinnacle,
      discM: H.disc,
      discDiameterM: R.disc * 2,
      topM: H.dome,
      liftM: H.lift,
      wingM: H.wing,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Hazerswoude-Rijndijk) (1915, A.D. Heederik, 28,5 m, 200 m³, buiten gebruik sinds 1985, van 1999 tot 2003 verbouwd tot kantoor, eigendom van Hoogvliet Beheer)",
      "https://commons.wikimedia.org/wiki/Category:Watertoren_(Hazerswoude-Rijndijk) (Rijnwoude 016.jpg vanaf het west-zuidwesten, Rijnwoude 020.jpg vanaf het westen, Hazerswoude-Rijndijk watertoren bij nacht.jpg vanaf het noordwesten)",
      "PDOK BAG-pand 1672100000002789, 3D BAG (puntenwolk 2023), AHN DSM/DTM 0,5 m en luchtfoto (Actueel_orthoHR), 2026-11-06",
    ],
  },
});

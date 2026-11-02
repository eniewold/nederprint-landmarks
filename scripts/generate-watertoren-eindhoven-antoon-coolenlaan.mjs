// Watertoren aan de Antoon Coolenlaan in Eindhoven (Stratum), op het terrein
// van Brabant Water op de hoek met de Willem Elsschotlaan: "de ballen van
// Quist". Gebouwd in 1970 naar ontwerp van W.G. (Wim) Quist, gemeentelijk
// monument sinds 1974 en rijksmonument 532557 sinds 2026: "drie
// witgeschilderde bolvormige waterreservoirs op een staalconstructie van
// slanke torens van verschillende hoogtes met daaronder een schuilkelder".
// Drie stalen bollen van 10 m (elk 500 m³, samen de grootste watertoren van
// Nederland) op een eigen buis met vier dunne poten eromheen; de buis loopt
// boven de bol door als pijp tot 43,45 m (Wikipedia). De bollen staan in een
// gelijkzijdige driehoek van 14 m en treden elk circa 5,3 m op: noord het
// hoogst, zuidwest in het midden, oost het laagst. In het midden een
// driehoekige vakwerktoren met de trap en een korte loopbrug naar elke bol.
//
// Geen BAG-pand: de toren staat niet in de BAG en dus niet in de PDOK-
// gebouwtegels. De BGT heeft hem als zeven overigbouwwerken van type
// opslagtank: drie cirkels van 1,25 m (de voeten van de buizen) en drie van
// 0,24 m (de hoekstijlen van de trappentoren); die staan hieronder als
// constanten (BGT, PDOK OGC API, 2026-11-02).
//
// Oorsprong op het zwaartepunt van de drie buisvoeten (dat valt binnen 3 cm
// samen met het hart van de driehoek van de stijlen) op maaiveld (AHN-DTM
// NAP +18,22 m); +X naar RD-oost.
// Hoogtes: de bovenkant van de oostbol uit het AHN-DSM (31,08 m; de bol is
// daar glad gemeten, de twee andere bollen zijn in het AHN rommelig) en de top
// van de noordpijp (NAP +61,28 = 43,1 m, gepubliceerd 43,45 m). De hoogte van
// de twee andere bollen volgt uit de pijplengtes boven de bol op drie Commons-
// foto's (noord 1,7 tot 1,9 m, zuidwest 6,6 tot 7,0 m, oost circa 11 m) met
// alle pijpen tot 43,45 m, het hoogteverschil op de foto "Waterbollen
// Eindhoven-02" en de schaduwen en de scheefstand op de luchtfoto; samen
// passen ze op een gelijke stap van 5,3 m. Buis 1,25 m (BGT) en pijp 1,0 m,
// poten op 2,2 m, de loopbruggen iets onder het midden van elke bol (foto's).
import { Manifold, CrossSection, hull, circle, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [161424.54, 380818.97];
const AXIS = [1, 0]; // +X = RD-oost
const BASE = -0.3;
const GROUND_NAP = 18.22; // AHN-DTM rond de voeten (18,19 tot 18,26)
const GEOID_N = 43.99; // NLGEO2018-geoïdehoogte op de oorsprong
const BAR = 0.9; // printminimum op 1:1000 (poten, stijlen en schoren zijn in het echt 0,2 tot 0,3 m)

// BGT-overigbouwwerken (opslagtank), middelpunten in RD.
const BGT_TUBES = {
  noord: [161421.695, 380826.607],
  zuidwest: [161419.424, 380812.617],
  oost: [161432.491, 380817.697],
};
const BGT_POSTS = [
  [161426.556, 380821.452],
  [161425.642, 380815.973],
  [161421.322, 380819.47],
];
const local = ([x, y]) => [+(x - ORIGIN[0]).toFixed(3), +(y - ORIGIN[1]).toFixed(3)];

const R = {
  sphere: 5.0, // 10 m (Wikipedia; 4/3·π·5³ = 524 m³ voor 500 m³ water)
  tube: 0.625, // BGT-cirkel
  stack: 0.5, // pijp boven de bol (foto's: 1,0 m)
  legs: 0.85, // hart van de poten, 0,9 m dik: buitenmaat 2,6 m (in het echt 2,2 m)
  post: 0.49, // achtkantige stijl van 0,9 m over de vlakken
};
const H = {
  stackTop: 43.45, // Wikipedia; AHN noordpijp 43,1 m
  towerTop: 37.0, // bovenkant van de trappentoren, net boven de loopbrug naar de noordbol
  panel: 6.0, // vakhoogte van de kruisschoren (47 graden over 5,57 m)
  gusset: 2.6, // diepte van de loopbrug-console onder het dek
};
// Bovenkant van de bollen: oost uit het AHN, de andere in stappen van 5,3 m.
const TOPS = { noord: 41.65, zuidwest: 36.4, oost: 31.08 };

const deg = (r) => (r * 180) / Math.PI;

// ---------- bollen op hun buis met vier poten ----------
const tanks = Object.entries(BGT_TUBES).map(([name, rd]) => {
  const [x, y] = local(rd);
  const zc = TOPS[name] - R.sphere;
  const dir = deg(Math.atan2(y, x)); // een vlak van de pootkooi naar het hart
  const ball = Manifold.sphere(R.sphere, 96).translate([x, y, zc]);
  const tube = Manifold.cylinder(zc - BASE, R.tube, R.tube, 48).translate([x, y, BASE]);
  const stack = Manifold.cylinder(H.stackTop - zc, R.stack, R.stack, 40).translate([x, y, zc]);
  const leg = box(R.legs - BAR / 2, R.legs - BAR / 2, BASE, R.legs + BAR / 2, R.legs + BAR / 2, zc - 4.0);
  const legs = union([0, 90, 180, 270].map((d) => place(leg, { deg: d })));
  return { name, x, y, zc, solid: union([ball, tube, stack, place(legs, { at: [x, y, 0], deg: dir })]) };
});

// ---------- driehoekige trappentoren ----------
const posts = BGT_POSTS.map(local);
const postSolids = posts.map((p) => Manifold.extrude(new CrossSection([circle([0, 0], R.post, 8, Math.PI / 8)]), H.towerTop - BASE).translate([p[0], p[1], BASE]));
// Schoor van a naar b (punten [x, y, z]) in het vlak van een gevel: horizontale kopjes van 0,9/sin(helling) breed,
// zodat de schoor haaks gemeten 0,9 m dik is en de onderkant de helling van de hartlijn volgt.
const brace = (a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
  const t = [dx / len, dy / len], n = [-t[1], t[0]];
  const w = BAR / 2 / Math.sin(Math.atan2(Math.abs(b[2] - a[2]), len));
  const cap = ([px, py, pz]) => [-1, 1].flatMap((st) => [-1, 1].map((sn) => [px + t[0] * st * w + n[0] * sn * BAR / 2, py + t[1] * st * w + n[1] * sn * BAR / 2, pz]));
  return hull([...cap(a), ...cap(b)]);
};
// Per gevel kruisschoren met een kruispunt precies onder de loopbrug naar de bol voor die gevel.
const faceFor = (tank) => {
  // de gevel tussen de twee stijlen die het dichtst bij de bol staan
  const sorted = [...posts].sort((p, q) => Math.hypot(p[0] - tank.x, p[1] - tank.y) - Math.hypot(q[0] - tank.x, q[1] - tank.y));
  return [sorted[0], sorted[1]];
};
const deck = (tank) => tank.zc - 1.0; // loopbrug iets onder het midden van de bol
const bracing = [];
const gussets = [];
for (const tank of tanks) {
  const [p, q] = faceFor(tank);
  const zx = deck(tank) - H.gusset; // kruispunt van de schoren onder de console
  for (let z = zx - H.panel / 2 - 6 * H.panel; z < H.towerTop; z += H.panel) {
    if (z + H.panel < BASE) continue;
    bracing.push(brace([p[0], p[1], z], [q[0], q[1], z + H.panel]), brace([q[0], q[1], z], [p[0], p[1], z + H.panel]));
  }
  // Loopbrug als console van het kruispunt in de gevel naar de bol: dek 0,9 m breed, onderkant onder 46 graden.
  const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const D = Math.hypot(tank.x - m[0], tank.y - m[1]);
  const e = [(tank.x - m[0]) / D, (tank.y - m[1]) / D], t = [-e[1], e[0]];
  const zd = deck(tank);
  const sEnd = D - Math.sqrt(R.sphere ** 2 - 1.0) + 0.45; // 0,45 m in de bol
  const at = (s, z) => [-1, 1].map((k) => [m[0] + e[0] * s + t[0] * k * BAR / 2, m[1] + e[1] * s + t[1] * k * BAR / 2, z]);
  gussets.push(hull([...at(-BAR / 2, zx), ...at(-BAR / 2, zd), ...at(sEnd, zd)]));
}
const stairTower = union([...postSolids, ...bracing]).trimByPlane([0, 0, -1], -H.towerTop).trimByPlane([0, 0, 1], BASE);

const all = union([...tanks.map((k) => k.solid), stairTower, ...gussets]).trimByPlane([0, 0, 1], BASE);

await writeLandmark({
  slug: "watertoren-eindhoven-antoon-coolenlaan",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op; een losse bol zou een eigen voet tot de grondplaat krijgen.
  nodes: [["building:bollen-buizen-en-trappentoren", all]],
  catalog: {
    name: "Watertoren Antoon Coolenlaan Eindhoven",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Op het grasveld tussen en naast de voeten.
    groundSamplePoints: [[0, -6], [6, 6], [-8, 2], [3, -9]],
    // Ellipsoïdisch: NAP +18,22 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    description:
      "Oorsprong op het zwaartepunt van de drie buisvoeten uit de BGT op maaiveld (NAP +18,22 m), +X naar RD-oost. Drie bollen van 10 m in een driehoek van 14 m, elk op een buis van 1,25 m met vier poten, de buis als pijp tot 43,45 m; bovenkant van de bollen noord 41,65, zuidwest 36,4 en oost 31,08 m. In het midden een driehoekige trappentoren (stijlen uit de BGT, 5,57 m) met kruisschoren tot 37 m en een console-loopbrug naar elke bol. Geen BAG-pand. Maten uit BGT, AHN, luchtfoto en foto's.",
    realWorld: {
      built: 1970,
      designer: "W.G. Quist",
      publishedHeightM: 43.45,
      reservoirM3: [500, 500, 500],
      sphereDiameterM: R.sphere * 2,
      sphereTopsM: TOPS,
      tubeDiameterM: R.tube * 2,
      stackDiameterM: R.stack * 2,
      triangleSideM: 14.06,
      stairTowerSideM: 5.57,
      stairTowerTopM: H.towerTop,
      ahnGroundNapM: GROUND_NAP,
      ahnEastSphereTopNapM: 49.3,
      ahnNorthStackTopNapM: 61.28,
      geoidNlgeo2018M: GEOID_N,
      minimumPartM: BAR,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Eindhoven_Antoon_Coolenlaan) (1970, W.G. Quist, 43,45 m, 3 × 500 m³)",
      "https://en.wikipedia.org/wiki/Eindhoven_Water_Towers (bollen van 10 m)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/532557 (omschrijving)",
      "https://commons.wikimedia.org/wiki/File:Waterbollen_Eindhoven-02.jpg (drie bollen, trappentoren, hoogteverschillen)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Eindhoven.jpeg (pijpen, poten, loopbrug)",
      "https://commons.wikimedia.org/wiki/File:Watertoren_Eindhoven_1.jpeg (pijpen, loopbrug)",
      "https://commons.wikimedia.org/wiki/File:20051110_Eindhoven_Watertoren_0204.jpg (bollen en pijpen)",
      "PDOK BGT overigbouwwerk (opslagtank, 7 objecten), BAG (geen pand), AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "NLGEO2018-geoïdehoogte op de oorsprong (43,99 m) voor groundHeight",
    ],
  },
});

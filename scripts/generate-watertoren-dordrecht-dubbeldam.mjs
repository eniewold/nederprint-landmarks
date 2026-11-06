// Watertoren Dubbeldam (Dordrecht), Kromme Zandweg. Gebouwd in 1916 door Visser & Smit Hanab, een van de eerste geheel
// betonnen watertorens in Nederland, 36,40 m hoog, reservoir 200 m³ (Wikipedia); gemeentelijk monument, sinds 1973 buiten
// gebruik en nu hotel met café-restaurant. Een zeskantige betonnen schacht met lisenen op de hoeken, verdiepte velden met
// ruitvormige vensters en twee banden; op 23,8 m een stalen balkon rond vier zijden (op schoren); de bovenste verdieping met
// hoge vensters; een kraag onder de overstekende goot; een zeskantige, geknikte tentkap met een lantaarn. Aan de westzijde
// staat een stalen wenteltrap van 112 treden tot de goot; aan de voet drie lage paviljoens (café-restaurant), alle in
// hetzelfde BAG-pand 0505100000059591.
//
// Oorsprong op het hart van de kap (top van het AHN-DSM, NAP +36,47 m), maaiveld NAP -0,3 (AHN-DTM, 3D BAG -0,37). Lokale
// X-as door een hoek van de zeskant, 16 graden linksom van RD-oost (hoeken in de luchtfoto 2021 op 14 tot 19 graden plus
// een veelvoud van 60). Hoogtes = NAP + 0,3.
// - Goot NAP +29,5 op 5,6 m van het hart (3D BAG-dakvlakken; luchtfoto 2021, gecorrigeerd voor de scheefstand), kap
//   52 tot 61 graden (AHN-DSM 0,5 m), lantaarn tot NAP +36,47 (AHN).
// - Balkon NAP +23,5 (3D BAG-dakvlakken aan oost-, zuid- en zuidwestzijde) rond de vier zijden van NW via Z tot NO.
// - Schacht: apothema 3,8 m (BAG-contour, zijden op 3,63 tot 3,96 m van het hart); verhouding tot de goot van de foto.
// - Paviljoens: contouren en hoogtes van de 3D BAG (LoD2.2, NAP +5,5, +4,4 en +4,1, met lagere daklichten op +3,3 en +3,2).
// Banden, velden, vensters, deuren, de dakkapel, de trap en de lantaarn zijn van de foto "Dubbeldamwatertoren.jpg" (2006)
// en de luchtfoto's 2021 tot 2025 geschat.
import { Manifold, CrossSection, ccw, hull, union, prism, place, circle, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [108698.5, 423108.1];
const AXIS_DEG = 16;
const AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = -0.3;
const BASE = -0.3;
// Laagste PDOK-terreinhoogte (ellipsoïdisch) op de groundSamplePoints (zuid 43,443 op de Kromme Zandweg, west 43,533,
// noord 43,719, oost 43,750, noordoost 43,814), gemeten 2026-11-06. Het PDOK-pand staat op 43,34 met de top op 80,69.
const GROUND_ELLIPSOID = 43.443;
const z = (nap) => +(nap - GROUND_NAP).toFixed(2);

// ---------- maten (meters boven het maaiveld; apothema's vanaf het hart) ----------
const A = {
  shaft: 3.8, // schacht
  band: 3.95, // bovenste band
  eave: 4.85, // goot (hoekstraal 5,6 m)
  kick: 4.4, // einde van de knik aan de goot
  knee: 2.3, // knik in de kap
  lantern: 0.8,
  cap: 0.95,
  deck: 6.0, // balkon, 2,2 m uit de gevel
};
const H = {
  plinth: 0.8, // onderkant van de velden
  lowTop: 9.7, // bovenkant van de onderste velden
  midBottom: 10.4, // band van 0,7 m daartussen
  midTop: 20.5,
  balconyKraag: 20.5, // onderkant van de kraag onder het balkon (49 graden op de hoeken)
  bandKraag: 20.8, // bovenste band met een onderkant van 53 graden (hoeken 49)
  bandBottom: 21.0,
  bandTop: 21.4,
  deckBottom: 23.45,
  deck: z(23.5), // balkon (3D BAG NAP +23,5)
  upperBottom: 24.1, // hoge vensters van de bovenste verdieping
  upperTop: 28.3,
  eaveKraag: 28.45, // kraag onder de goot: 50 graden, op de hoeken 47
  eave: z(29.5), // goot (3D BAG NAP +29,4 tot 29,6)
  eaveLip: 29.95,
  kick: 30.3,
  knee: 33.2,
  lantern: 35.8,
  lanternTop: 36.45,
  capRim: 36.65,
  top: z(36.47), // bovenkant lantaarn (AHN NAP +36,47)
  stair: 29.6, // bovenste bordes van de wenteltrap
};

const R30 = Math.cos(Math.PI / 6);
// Zeskant met hoeken op 0, 60, ... graden; alleen de hoeken uit `angles` als die is opgegeven.
const hexAt = (apo, zz, angles = [0, 60, 120, 180, 240, 300]) =>
  angles.map((d) => [(apo / R30) * Math.cos((d * Math.PI) / 180), (apo / R30) * Math.sin((d * Math.PI) / 180), zz]);
const hex2 = (apo) => hexAt(apo, 0).map(([x, y]) => [x, y]);
const FACES = [30, 90, 150, 210, 270, 330]; // normalen van de zijden (lokaal); 270 = zuidzuidoost (voorzijde op de foto)

// Nis in een gevel met normaal +X op afstand f, midden op y = c, breedte w, van z0 tot z1; het plafond loopt naar binnen
// onder 56 graden op, zodat er niets vrij hangt.
const niche = (f, c, w, z0, z1, depth = 0.3) => {
  const a = f - depth, b = f + 1.0, za = z1 + 1.5 * depth, zb = Math.max(z0, z1 - 1.5);
  const y0 = c - w / 2, y1 = c + w / 2;
  return hull([[a, y0, z0], [b, y0, z0], [a, y1, z0], [b, y1, z0], [a, y0, za], [f, y0, z1], [a, y1, za], [f, y1, z1], [b, y0, zb], [b, y1, zb]]);
};
// Ruitvormig venster (1,1 x 1,5 m; op de foto circa 0,7 x 1,0 m) als nis van 0,45 m vanaf de gevel: bovenranden van 54 graden.
const diamond = (f, zc, depth = 0.45, hw = 0.55, hh = 0.75) => {
  const pts = [];
  for (const x of [f - depth, f + 1.0]) pts.push([x, -hw, zc], [x, hw, zc], [x, 0, zc - hh], [x, 0, zc + hh]);
  return hull(pts);
};

// ---------- schacht, banden, bovenste verdieping, kraag, goot, kap en lantaarn ----------
const shaft = prism(hex2(A.shaft), BASE, H.eaveKraag + 0.01);
const band = hull([...hexAt(A.shaft, H.bandKraag), ...hexAt(A.band, H.bandBottom), ...hexAt(A.band, H.bandTop)]);
// Kraag van 50 graden onder de goot, knik aan de goot, onderste kapvlak van 54 graden tot de knik, bovenste van 61 graden
// tot de lantaarn. De kap wordt naar boven steiler (hol), dus drie gestapelde afgeknotte piramides in plaats van één omhulsel.
const roof = union([
  hull([...hexAt(A.shaft, H.eaveKraag), ...hexAt(A.eave, H.eave), ...hexAt(A.eave, H.eaveLip), ...hexAt(A.kick, H.kick)]),
  hull([...hexAt(A.kick, H.kick), ...hexAt(A.knee, H.knee)]),
  hull([...hexAt(A.knee, H.knee), ...hexAt(A.lantern, H.lantern)]),
]);
const lantern = union([
  prism(hex2(A.lantern), H.lantern - 0.3, H.lanternTop),
  hull([...hexAt(A.lantern, H.lanternTop), ...hexAt(A.cap, H.capRim), ...hexAt(A.cap, H.top)]),
]);

// ---------- balkon: vier zijden van hoek 180 via 240, 300 en 0 tot hoek 60, op een kraag van 53 graden (de schoren) ----------
const BALCONY = [180, 240, 300, 360, 420];
const balcony = union(
  BALCONY.slice(0, -1).map((d, i) => {
    const ang = [d, BALCONY[i + 1]];
    return hull([...hexAt(A.shaft, H.balconyKraag, ang), ...hexAt(A.shaft, H.deck, ang), ...hexAt(A.deck, H.deckBottom, ang), ...hexAt(A.deck, H.deck, ang)]);
  }),
);

// ---------- wenteltrap aan de westzijde: trommel van 2,5 m tot het bovenste bordes, met een ligger naar de gevel ----------
const STAIR_DEG = 163;
const STAIR_R = 6.0;
const sc = [STAIR_R * Math.cos((STAIR_DEG * Math.PI) / 180), STAIR_R * Math.sin((STAIR_DEG * Math.PI) / 180)];
const stair = union([
  prism(circle(sc, 1.25, 16), BASE, H.stair),
  place(prism([[3.0, -0.5], [STAIR_R, -0.5], [STAIR_R, 0.5], [3.0, 0.5]], BASE, H.stair), { deg: STAIR_DEG }),
]);
// Dakkapel boven het bordes (uitgang naar de trap), 1,4 m breed, op de westelijke zijde van de kap.
const dormer = place(hull([[3.0, -0.7, H.eave], [4.6, -0.7, H.eave], [3.0, 0.7, H.eave], [4.6, 0.7, H.eave], [4.6, -0.7, 31.2], [4.6, 0.7, 31.2], [3.0, -0.7, 32.4], [3.0, 0.7, 32.4]]), { deg: 150 });

// ---------- paviljoens (3D BAG LoD2.2, RD) met een verbinding naar de schacht ----------
const toLocal = ([x, y]) => {
  const dx = x - ORIGIN[0], dy = y - ORIGIN[1], a = (AXIS_DEG * Math.PI) / 180;
  return [dx * Math.cos(a) + dy * Math.sin(a), -dx * Math.sin(a) + dy * Math.cos(a)];
};
// Footprint = BAG-dakvlak plus het convexe omhulsel van zijn hoekpunten dicht bij de schacht en de schacht zelf (de
// paviljoens staan tegen de schacht, de 3D BAG-contour houdt onder de goot op); alleen de buitenrand, zonder ingesloten gat.
const footprint = (polys) => {
  const near = polys.flat().filter(([x, y]) => Math.hypot(x, y) < 6.5);
  const cs = union2([...polys.map((p) => new CrossSection([ccw(p)]).offset(0.01)), new CrossSection([hull2([...near, ...hex2(A.shaft)])])]);
  const signed = (r) => r.reduce((s, [x0, y0], i) => { const [x1, y1] = r[(i + 1) % r.length]; return s + x0 * y1 - x1 * y0; }, 0);
  return new CrossSection(cs.toPolygons().filter((r) => signed(r) > 0));
};
// Convex omhulsel in 2D (monotone keten), linksom.
const hull2 = (pts) => {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const half = (list) => list.reduce((h, q) => { while (h.length >= 2 && cross(h[h.length - 2], h[h.length - 1], q) <= 0) h.pop(); h.push(q); return h; }, []);
  const lower = half(p), upper = half([...p].reverse());
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};
const union2 = (sections) => sections.reduce((a, b) => a.add(b));
const annex = (rd, top, recesses = [], extra = []) => {
  const body = Manifold.extrude(footprint([rd.map(toLocal), ...extra.map((e) => e.map(toLocal))]), top - BASE).translate([0, 0, BASE]);
  return recesses.reduce((m, [r, zz]) => m.subtract(prism(r.map(toLocal), zz, top + 1)), body);
};
// De twee noordelijke paviljoens liggen tegen elkaar: het lagere (noordoost) neemt de verbinding van beide mee.
const annexes = union([
  annex(pavilionNorthWest(), z(5.5)),
  annex(pavilionNorthEast(), z(4.4), [[skylightNorthEast(), z(3.34)]], [pavilionNorthWest()]),
  annex(wingSouthWest(), z(4.06), [[skylightSouthWest(), z(3.24)]]),
]);

// ---------- nissen: velden, ruiten, deuren en vensters ----------
const PANEL_W = 3.0; // zijde 4,39 m, lisenen van 0,7 m op de hoeken
const cuts = [];
for (const deg of FACES) {
  const f = A.shaft;
  const local = [
    niche(f, 0, PANEL_W, H.plinth, H.lowTop, 0.15),
    niche(f, 0, PANEL_W, H.midBottom, H.midTop, 0.15),
    niche(f, 0, 1.0, H.upperBottom + 0.2, H.upperTop - 0.4, 0.45), // hoog venster van de bovenste verdieping
  ];
  // Ruiten in zes rijen; aan de zuidwestzijde (210) wisselen ze af met de deuren naar de bordessen van de trap.
  const rows = deg === 210 ? [8.1, 14.6, 19.7] : [5.3, 8.1, 11.9, 14.6, 17.3, 19.7];
  for (const zc of rows) local.push(diamond(f, zc));
  if (deg === 210) for (const z0 of [4.3, 10.9, 16.3]) local.push(niche(f, -0.95, 0.9, z0, z0 + 2.2, 0.45));
  cuts.push(...local.map((m) => place(m, { deg })));
}
const openings = union(cuts);

// Trap en paviljoens na de nissen, zodat de velden achter de trapligger en de paviljoens dicht blijven.
const all = union([union([shaft, band, roof, lantern, balcony, dormer]).subtract(openings), stair, annexes]);

await writeLandmark({
  slug: "watertoren-dordrecht-dubbeldam",
  base: BASE,
  nodes: [["building:watertoren-schacht-balkon-kap-trap-en-paviljoens", all]],
  catalog: {
    name: "Watertoren Dubbeldam",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-3.3, -11.5], [8.5, -6.6], [12.2, 2.7], [0.8, 13.8], [-11.4, 0.1]],
    groundHeight: GROUND_ELLIPSOID,
    replacesBuildings: ["NL.IMBAG.Pand.0505100000059591"],
    description:
      "Oorsprong op het hart van de zeskantige kap op het maaiveld (NAP -0,3 m), X-as door een hoek van de zeskant, 16 graden linksom van RD-oost. Zeskantige schacht (apothema 3,8 m) met lisenen, verdiepte velden, ruitvensters en banden op 10 en 21 m; balkon van 2,2 m rond vier zijden op 23,8 m (kraag van 53 graden in plaats van de schoren); bovenste verdieping met hoge vensters; kraag van 50 graden onder de goot op 29,8 m (hoekstraal 5,6 m); geknikte zeskantige kap tot 35,8 m met een lantaarn tot 36,77 m; wenteltrap als trommel van 2,5 m aan de westzijde met een dakkapel; drie paviljoens aan de voet volgens de 3D BAG. Leuningen, vlaggenmast, het tegelfries en de lisenen van de bovenste verdieping weggelaten. Maten uit BAG, 3D BAG, AHN en foto's.",
    realWorld: {
      built: 1916,
      builder: "Visser & Smit Hanab",
      publishedHeightM: 36.4,
      reservoirM3: 200,
      stairSteps: 112,
      ahnGroundNapM: GROUND_NAP,
      bag3dBalconyNapM: 23.5,
      bag3dEaveNapM: 29.5,
      ahnTopNapM: 36.47,
      shaftApothemM: A.shaft,
      balconyM: H.deck,
      balconyDepthM: +(A.deck - A.shaft).toFixed(2),
      eaveM: H.eave,
      eaveCornerRadiusM: +(A.eave / R30).toFixed(2),
      kneeM: H.knee,
      lanternM: H.lantern,
      topM: H.top,
      stairTopM: H.stair,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Dubbeldam) (1916, Visser & Smit Hanab, 36,40 m, 200 m³, wenteltrap van 112 treden)",
      "https://commons.wikimedia.org/wiki/File:Dubbeldamwatertoren.jpg (2006)",
      "PDOK BAG-pand 0505100000059591, 3D BAG (LoD2.2), AHN DSM/DTM 0,5 m en luchtfoto's 2021 tot 2025 (orthoHR), 2026-11-06",
    ],
  },
});

// Dakvlakken van de paviljoens uit de 3D BAG (LoD2.2, https://3dbag.nl, CC BY 4.0), RD; kleine inkepingen van minder dan
// 0,5 m weggelaten.
function pavilionNorthWest() {
  return [[108699.75, 423113.8], [108700.29, 423116.14], [108699.91, 423118.29], [108696.47, 423120.27], [108692.04, 423116.31], [108692.81, 423112.38], [108693.59, 423111.96]];
}
function pavilionNorthEast() {
  return [[108705.42, 423109.62], [108706.31, 423109.58], [108708.52, 423111.95], [108704.44, 423118.53], [108700.12, 423118.17], [108699.91, 423118.29], [108700.29, 423116.14], [108699.75, 423113.8], [108700.94, 423112.46], [108703.56, 423110.93]];
}
function skylightNorthEast() {
  return [[108705.12, 423113.34], [108704.18, 423115.5], [108702.43, 423115.02], [108704.02, 423112.6]];
}
function wingSouthWest() {
  return [[108694.14, 423105.18], [108692.9, 423106.47], [108690.28, 423106.53], [108688.9, 423102], [108691.48, 423097.7], [108697.78, 423098.71], [108697.65, 423101.84], [108696.12, 423101.7], [108695.85, 423103.49], [108694.14, 423103.55]];
}
function skylightSouthWest() {
  return [[108692.94, 423100.65], [108694.14, 423101.05], [108694.14, 423102.5], [108693.59, 423102.74], [108693.22, 423103.39], [108692.5, 423103.26], [108692.12, 423102.03]];
}

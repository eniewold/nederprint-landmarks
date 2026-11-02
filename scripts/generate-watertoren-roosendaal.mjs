// Watertoren aan de Nispensestraat in Roosendaal: 1916 (gevelopschrift ANNO WATERTOREN 1916, register 1917),
// ontwerp H.P.N. Halbertsma, uitgevoerd door de Maatschappij tot Bouw en Exploitatie van Gemeentebedrijven,
// rijksmonument 517281, nu woningen. Volgens het register een toren van circa 52 m met een betonskelet: een
// gepleisterde achtkantige begane grond met een uitstekende plint, daarboven een achtkantige schacht van drie
// geledingen met verdiept metselwerk tussen het betonnen vakwerk (de bovenste geleding met segmentbogen), een rond
// uitkragend reservoir van 300 m³ met een schuine onderrand met kleine ronde openingen, smalle staande ramen, een
// fries met kantelen en geprofileerde randen naar het dak, en een koperen spits met vier dakkapelletjes met een
// gebogen fronton en een piron. Op de begane grond een trap naar de deur in een gepleisterde omlijsting met
// pilasters en een gebogen fronton.
//
// Oorsprong op het midden van de achtkantige BAG-contour (pand 1674100000957195, 92 m², vlakken 5,27 m uit het
// hart) op maaiveld (AHN-DTM ten zuiden en westen NAP +4,34 tot +4,45; aan de noordoostkant ligt een lager hof op
// +3,6). De BAG-vlakken staan op -15,3 graden van RD-oost plus veelvouden van 45: lokale +X loopt langs RD -15,3
// graden (oostzuidoost, de straatkant), +Y langs 74,7 graden. De deur staat in het zuidvlak op -Y (de tuinpaden op
// de luchtfoto komen daar uit), het uitgebouwde balkonhuisje onder het reservoir op 45 graden (oostnoordoost, op de
// foto's vanaf de straat).
//
// Hoogtes: het AHN-DSM ziet het koperen dak alleen binnen 3,7 m uit het hart (helling 1,59: 58 graden, top van de
// kegel NAP +49,6, piron tot +50,36); de 3D BAG (LoD2.2 uit AHN5, 2024) geeft het dak tot 5,8 m op NAP +40,5 tot
// +41,0 en de dakkapellen tot NAP +44,0 op -12, 78 en 168 graden. Doorsneden uit de luchtfoto (dakrand 11,9 m) en
// de foto met evenwijdige verticalen (RM517281 IMG 9483: dakrand : reservoir : schacht boven : schacht onder =
// 355 : 301 : 251 : 298), de hoogtes van de geledingen, banden en het reservoir uit dezelfde foto (29,8 px/m).
import { hull, ring3, circle, union, box, place, writeLandmark } from "./efteling-kit.mjs";

const ORIGIN = [90646.39, 393890.4];
const ROT = -15.3; // lokale +X in graden linksom van RD-oost (normaal van een BAG-vlak)
const AXIS = [+Math.cos((ROT * Math.PI) / 180).toFixed(4), +Math.sin((ROT * Math.PI) / 180).toFixed(4)];
const BASE = -0.3;
const GROUND_NAP = 4.4; // AHN-DTM 8 m ten zuiden en westen 4,34 tot 4,45
const GEOID_N = 44.2; // NLGEO2018-geoïdehoogte op de oorsprong
const SEG = 72;

// Achtkanten: afstand van het hart tot de vlakken (vlakken haaks op 0, 45, 90 ... graden).
const A = {
  plinth: 5.42, // uitstekende plint
  base: 5.27, // gepleisterde begane grond (BAG)
  baseCornice: 5.6, // kroonlijst van de begane grond
  shaftFoot: 5.12, // schacht op de kroonlijst (foto: 298 px)
  shaftTop: 4.21, // schacht onder het reservoir (foto: 251 px)
};
// Ronde delen: straal.
const R = {
  drumFoot: 4.75, // onderkant van de schuine onderrand
  wall: 5.05, // reservoirwand (luchtfoto 11,9 m × 301/355)
  band: 5.2, // band tussen onderrand en wand, fries
  cornice: 5.95, // dakrand (luchtfoto 11,9 m)
  eave: 5.65, // voet van de koperen kegel
};
const H = {
  plinth: 0.8,
  base: 5.3,
  baseCornice: 5.9,
  shaftTop: 24.6,
  drumFoot: 25.4,
  band: [27.9, 28.4],
  frieze: [31.9, 33.4], // fries met kantelen in het bovenste deel van de wand
  merlonFoot: 31.2,
  cornice: [35.2, 35.9],
  eave: 36.2, // voet van de kegel (3D BAG: NAP +40,5 tot +41,0 op 5,6 tot 5,8 m)
  apex: 45.2, // top van de kegel (AHN/3D BAG NAP +49,6)
  finialTop: 46.0, // piron met bol (AHN-maximum NAP +50,36)
};
const SLOPE = (H.apex - H.eave) / R.eave; // 1,59: 58 graden
const shaftA = (z) => A.shaftFoot + ((A.shaftTop - A.shaftFoot) * (z - H.baseCornice)) / (H.shaftTop - H.baseCornice);

const C8 = Math.cos(Math.PI / 8);
const oct = (a, z) => ring3(circle([0, 0], a / C8, 8, Math.PI / 8), z);
const ring = (r, z, n = SEG) => ring3(circle([0, 0], r, n), z);

// ---------- begane grond: plint, gepleisterde achtkant en kroonlijst ----------
const base = union([
  hull([...oct(A.base, BASE), ...oct(A.base, H.base + 0.05)]),
  hull([...oct(A.plinth, BASE), ...oct(A.plinth, H.plinth - 0.15), ...oct(A.base, H.plinth)]),
  // Kroonlijst met een kraag van 45 graden.
  hull([...oct(A.base, H.base - 0.05), ...oct(A.baseCornice, H.base - 0.05 + (A.baseCornice - A.base)), ...oct(A.baseCornice, H.baseCornice)]),
]);

// ---------- schacht, onderrand, band, reservoirwand, fries, dakrand en kegel ----------
const shaft = hull([...oct(A.shaftFoot, H.baseCornice - 0.05), ...oct(A.shaftTop, H.shaftTop + 0.05)]);
// Schuine onderrand: van de hoeken van de schacht (4,56 m) naar de ronde onderrand en schuin naar de wand.
const drum = hull([...oct(A.shaftTop, H.shaftTop), ...ring(R.drumFoot, H.drumFoot), ...ring(R.wall, H.band[0])]);
const band = hull([...ring(R.wall, H.band[0] - (R.band - R.wall)), ...ring(R.band, H.band[0]), ...ring(R.band, H.band[1])]);
const wall = hull([...ring(R.wall, H.band[0]), ...ring(R.wall, H.frieze[1] + 0.05)]);
const frieze = hull([...ring(R.wall, H.frieze[0] - (R.band - R.wall)), ...ring(R.band, H.frieze[0]), ...ring(R.band, H.frieze[1])]);
// Kantelen: acht tanden van 2 m breed die van de fries naar beneden steken, met een schuine onderkant.
const merlon = (deg) => {
  const half = 1.0 / R.band;
  const pts = [];
  for (const t of [-half, -half / 2, 0, half / 2, half]) {
    const c = Math.cos(t), s = Math.sin(t);
    pts.push([R.band * c, R.band * s, H.merlonFoot], [R.band * c, R.band * s, H.frieze[0] + 0.05], [(R.wall - 0.1) * c, (R.wall - 0.1) * s, H.merlonFoot - 0.25], [(R.wall - 0.1) * c, (R.wall - 0.1) * s, H.frieze[0] + 0.05]);
  }
  return place(hull(pts), { deg });
};
const merlons = Array.from({ length: 8 }, (_, k) => merlon(45 * k));
// Dakrand: holle lijst (benaderd als rechte kraag van 67 graden), rechte rand en schuine bovenkant naar de kegel.
const cornice = hull([...ring(R.band, H.frieze[1]), ...ring(R.cornice, H.cornice[0]), ...ring(R.cornice, H.cornice[1]), ...ring(R.eave, H.eave)]);
const cone = hull([...ring(R.eave, H.eave - 0.05, 48), [0, 0, H.apex]]);

// ---------- vier dakkapellen met een gebogen fronton ----------
// Voorkant op 5,3 m uit het hart (3D BAG), 1,4 m breed, zijwanden tot 38,9 m, boog tot 39,6 m (3D BAG NAP +44,0);
// naar achteren tot waar de kegel de top van de boog bereikt.
const DORMER_W = 1.4, DORMER_SILL = H.eave - 0.1, DORMER_SPRING = 38.9, DORMER_FRONT = 5.3;
const arch = (w, z0, zs, n = 8) => [
  [-w / 2, z0], [w / 2, z0],
  ...Array.from({ length: n + 1 }, (_, i) => {
    const a = (Math.PI * i) / n;
    return [(w / 2) * Math.cos(a), zs + (w / 2) * Math.sin(a)];
  }),
];
const dormerBack = (H.apex - (DORMER_SPRING + DORMER_W / 2)) / SLOPE - 0.3;
const dormer = hull(arch(DORMER_W, DORMER_SILL, DORMER_SPRING).flatMap(([y, z]) => [[DORMER_FRONT, y, z], [dormerBack, y, z]]));
const DORMERS = [0, 90, 180, 270]; // 3D BAG: RD -12, 78 en 168 graden = lokaal 3, 93 en 183
const dormers = DORMERS.map((d) => place(dormer, { deg: d }));

// ---------- piron met bol ----------
const finial = hull([...ring(0.45, H.apex - 0.7, 16), ...ring(0.45, 45.45, 16), ...ring(0.5, 45.65, 16), ...ring(0.3, 45.92, 16), [0, 0, H.finialTop]]);

// ---------- balkonhuisje onder het reservoir (oostnoordoost) ----------
// 1,8 m breed, tot 5,75 m uit het hart, van 24,6 tot de band; daaronder een console van 45 graden naar de schacht.
const porch = place(hull([
  [3.9, -0.9, 22.75], [3.9, 0.9, 22.75],
  [5.75, -0.9, 24.6], [5.75, 0.9, 24.6], [5.75, -0.9, H.band[0] - 0.15], [5.75, 0.9, H.band[0] - 0.15],
  [3.9, -0.9, H.band[0] - 0.15], [3.9, 0.9, H.band[0] - 0.15],
]), { deg: 45 });

// ---------- deurpartij met trap ----------
// Gepleisterde omlijsting 2,6 m breed, 0,25 m voor het zuidvlak, met een gebogen fronton tot 4,8 m; trap van twee
// treden van 2,6 m breed.
const doorFrame = place(hull(arch(2.6, BASE, 3.5, 10).flatMap(([y, z]) => [[A.base - 0.1, y, z], [A.base + 0.25, y, z]])), { deg: -90 });
const stairs = [
  place(box(A.base, -1.3, BASE, A.base + 1.3, 1.3, 0.4), { deg: -90 }),
  place(box(A.base, -1.3, BASE, A.base + 0.85, 1.3, 0.8), { deg: -90 }),
];

// ---------- nissen: verdiept metselwerk, segmentbogen, deur en vensters ----------
// Nis in het vlak met normaal +X: de binnenkant volgt het (schuine) vlak op `depth` erachter; het plafond loopt
// naar binnen onder 56 graden op (1,5 maal de diepte). Omtrek als lijst (y, z).
const faceNiche = (faceA, outline, depth = 0.3) => {
  // Buiten de gevel zakt de omtrek met dezelfde helling, zodat het plafond één vlak van 56 graden is.
  const zBot = Math.min(...outline.map(([, z]) => z));
  return hull(outline.flatMap(([y, z]) => [
    [faceA(z) - depth, y, z === zBot ? z : z + 1.5 * depth],
    [faceA(z), y, z],
    [faceA(z) + 1.0, y, z === zBot ? z : Math.max(zBot, z - 1.5)],
  ]));
};
const rectOutline = (w, z0, z1) => [[-w / 2, z0], [w / 2, z0], [w / 2, z1], [-w / 2, z1]];
// Segmentboog: koorde w, voet z0, aanzet zs, pijl f.
const segOutline = (w, z0, zs, f, n = 8) => {
  const rr = (f * f + (w / 2) ** 2) / (2 * f), zc = zs + f - rr, a0 = Math.asin(w / 2 / rr);
  return [[-w / 2, z0], [w / 2, z0], ...Array.from({ length: n + 1 }, (_, i) => {
    const a = -a0 + (2 * a0 * i) / n;
    return [rr * Math.sin(a), zc + rr * Math.cos(a)];
  })];
};
// Verdiepte panelen: pilasters van 0,6 m op de hoeken, betonbanden tussen de geledingen.
const PILASTER = 0.6;
const panelW = (z) => 2 * shaftA(z) * Math.tan(Math.PI / 8) - 2 * PILASTER;
const GELEDING = [[6.4, 11.7], [12.6, 18.0], [18.9, 23.4]]; // de bovenste met een segmentboog tot 24,1
const cuts = [];
for (let k = 0; k < 8; k++) {
  const deg = 45 * k;
  for (const [i, [z0, z1]] of GELEDING.entries()) {
    if (deg === 45 && i === 2) continue; // daar staat de console van het balkonhuisje op het vlak
    const w = panelW(z1 + 0.7);
    cuts.push(place(faceNiche(shaftA, i < 2 ? rectOutline(w, z0, z1) : segOutline(w, z0, z1, 0.7)), { deg }));
  }
}
const baseA = () => A.base;
// Deur in de omlijsting (1,3 × 2,6 m, 0,3 m diep) en de hoge vensters met omlijsting in de begane grond.
cuts.push(place(faceNiche(() => A.base + 0.25, rectOutline(1.3, H.plinth, 3.4)), { deg: -90 }));
for (const deg of [0, 45, -45, 180]) cuts.push(place(faceNiche(baseA, rectOutline(1.3, 1.5, 3.9), 0.3), { deg }));

const tower = union([base, shaft, drum, band, wall, frieze, ...merlons, cornice, cone, ...dormers, finial, porch, doorFrame, ...stairs]).subtract(union(cuts));

await writeLandmark({
  slug: "watertoren-roosendaal",
  base: BASE,
  // Eén node: de export vult modellen zonder attributen per node op.
  nodes: [["building:schacht-reservoir-en-koperen-spits", tower]],
  catalog: {
    name: "Watertoren Roosendaal",
    origin: ORIGIN,
    xAxis: AXIS,
    groundOffsetMetres: -0.1,
    // Op het tuinniveau ten zuiden en westen; aan de noordoostkant ligt een lager hof.
    groundSamplePoints: [[-8, 0], [0, -8], [-6.5, -6.5], [6.5, -6.5]],
    // Ellipsoïdisch: NAP +4,40 plus de NLGEO2018-geoïdehoogte op de oorsprong.
    groundHeight: +(GROUND_NAP + GEOID_N).toFixed(2),
    replacesBuildings: ["NL.IMBAG.Pand.1674100000957195"],
    description:
      "Oorsprong op het midden van de achtkantige BAG-contour op maaiveld (NAP +4,40 m), +X langs RD -15,3 graden (een BAG-vlak, oostzuidoost), deur op -Y (zuid). Gepleisterde achtkantige begane grond van 10,5 m over de vlakken met plint, kroonlijst, deuromlijsting met gebogen fronton en trap; achtkantige schacht van 10,2 tot 8,4 m met drie geledingen verdiept metselwerk tussen het betonnen vakwerk (bovenste met segmentbogen) tot 24,6 m; schuine onderrand, band en rond reservoir van 10,1 m met fries en kantelen; dakrand van 11,9 m tot 35,9 m; koperen kegel van 58 graden tot 45,2 m met vier dakkapellen met een gebogen fronton, piron tot 46,0 m; balkonhuisje onder het reservoir. Maten uit BAG, AHN, 3D BAG, luchtfoto en foto's.",
    realWorld: {
      publishedHeightNapM: 48.6,
      registerHeightM: 52,
      reservoirM3: 300,
      built: 1916,
      architect: "H.P.N. Halbertsma",
      rijksmonument: 517281,
      ahnGroundNapM: GROUND_NAP,
      ahnConeApexNapM: 49.6,
      ahnMaxNapM: 50.36,
      bag3dEaveNapM: [40.5, 41.0],
      bag3dDormerTopNapM: 44.0,
      geoidNlgeo2018M: GEOID_N,
      axisDeg: ROT,
      baseAcrossFlatsM: 2 * A.base,
      shaftAcrossFlatsM: [2 * A.shaftFoot, 2 * A.shaftTop],
      reservoirDiameterM: 2 * R.wall,
      corniceDiameterM: 2 * R.cornice,
      shaftTopM: H.shaftTop,
      corniceM: H.cornice,
      roofPitchDeg: +((Math.atan(SLOPE) * 180) / Math.PI).toFixed(1),
      dormers: DORMERS.length,
      coneApexM: H.apex,
      modelTopM: H.finialTop,
      minimumPartM: 0.9,
    },
    sources: [
      "https://nl.wikipedia.org/wiki/Watertoren_(Roosendaal) (H.P.N. Halbertsma, 1916, 48,6 m boven NAP)",
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/517281 (achtkantige schacht met vier geledingen, betonskelet, verdiept metselwerk, segmentbogen, uitkragend rond reservoir van 300 m³ met schuine onderrand, fries met kantelen, koperen spits met vier dakkapelletjes en piron, deuromlijsting met gebogen fronton, circa 52 m)",
      "https://commons.wikimedia.org/wiki/File:Roosendaal,_de_Watertoren_RM517281_IMG_9483_2021-06-14_10.57.jpg (evenwijdige verticalen: verhoudingen en hoogtes, balkonhuisje)",
      "https://commons.wikimedia.org/wiki/File:WatertorenRoosendaal.jpg, File:WatertorenRoosendaalAchterzijde.jpg, File:Watertoren_Roosendaal.jpg (reservoir, dakrand, dakkapellen, piron, deur met fronton, schacht)",
      "PDOK BAG-pand 1674100000957195, AHN DSM/DTM 0,5 m en luchtfoto, 2026-11-02",
      "3D BAG (LoD2.2, AHN5 2024) van pand 1674100000957195: maaiveld 3,84, dak 40,5 tot 49,6, dakkapellen 44,0 (NAP)",
      "NLGEO2018-geoïdehoogte op de oorsprong (44,20 m) voor groundHeight",
    ],
  },
});

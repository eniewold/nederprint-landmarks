// Genereert een vereenvoudigd, gesloten 3D-model van Carnaval Festival in de
// Efteling (Kaatsheuvel, Reizenrijk, dark ride van Joop Geesink, 1984; entree
// van 1998, vernieuwd 2012 en 2019): de grote, vlakke showhal met de afgeronde
// noordhoeken, de lagere ronde opstaphal ("station") in de zuidwesthoek, de
// entreegevel aan het plein met het grote rode theaterdoek met gele draperieën
// en franje, de reuzenkop met rode neus, hoge hoed en strik die het doek met
// twee handen vasthoudt, Jokie de Prrretneus op de linkerhoek van het doek,
// de poort onder het doek, de boog naar de toiletten en de uitgangsdeur met
// het boogbordje; de lage overdekte wachtrij met de uitsparing voor de boom
// en de luchtkanalen en lichtkoepels op het dak; en op de hoek de
// souvenirwinkel Jokies Wereld met de veelhoekige pui, de rode markies, de
// blauwe lijst en de uitgezaagde kuif met torentjes en een clownskop. Alle
// maten zijn meters op ware grootte. Uitvoer via scripts/efteling-kit.mjs:
// een GLB in meters (Y omhoog, nodes `klasse:label`), de catalogus-JSON en een
// binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-efteling-carnaval-festival.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-carnaval-festival.mjs --scale 500
//
// Het hele complex is één BAG-pand (0809100000017621, bouwjaar 1998): de hal
// van 1984 met de entree en winkel van 1998. De twee andere panden uit de
// opdracht horen er niet bij: 0809100000017626 (1991) is een groep
// dienstgebouwen met zadeldaken achter het park ten westen van de
// personeelsparkeerplaats, 0809100000017624 (1997) een werkplaats/loods ten
// noorden ervan. Vogel Rok (pand 0809100000017622) ligt ten oosten van de hal;
// de gevel met de vogel en het platte gebouwtje ertussen (buiten de BAG, op
// u 9 tot 20, v -15 tot -24) horen bij Vogel Rok en zitten niet in dit model.
//
// Printbaar op 1:1000 zonder steun: muren staan recht op; kroonlijsten,
// doek, draperieën, franje, de markies en de blauwe lijst rusten op een kraag
// van 45 graden; de kop, de neus, de hoedrand en de kraag van Jokie hebben
// een onderkant van 45 graden; vingers lopen steiler dan 45 graden omhoog.
// Poort en toiletboog zijn spitse nissen (top ≥ 50 graden), de uitgangsdeur
// en de vensters zijn blinde nissen. Beschildering (confettistippen, letters
// op het doek, gezichten) is weggelaten.
//
// Assenstelsel: oorsprong op RD (131817, 407108), in de westhoek van de
// showhal, op het maaiveld van het plein (NAP +9,45 m), Z omhoog. +X loopt
// langs de lange zuidgevel van de hal naar het oost-noordoosten (11,67 graden
// linksom vanaf de RD-x-as), +Y loodrecht daarop naar het noord-noordwesten;
// de entreegevel kijkt naar -Y (zuid-zuidoost, naar het plein met Sirocco).
// Het terrein achter de hal (personeelsparkeerplaats, noord en west) ligt
// circa 1,6 m lager (NAP +7,8 m); de onderkant ligt daarom op -1,8 m en de
// maaiveldpunten liggen op het plein.
//
// Bronnen en maten:
// - BAG-pand 0809100000017621: contour van hal, opstaphal, entree, wachtrij,
//   winkel en het lage uitgangsgebouwtje. De BAG-rand van de winkel volgt de
//   markies; de pui ligt circa 1,3 m terug (luchtfoto).
// - AHN DSM/DTM 0,5 m (PDOK WCS, als raster in het stelsel van de hal):
//   plein NAP +9,45; hal +17,55 (8,1 m), opstaphal +16,45 (7,0 m), entreegevel
//   +15,05 (5,6 m), wachtrij en winkel +14,15 (4,7 m), uitgangsgebouwtje
//   +12,25 (2,8 m), kuif van de winkel tot circa +16,5 (7 m), reuzenhoed tot
//   +18,3 (8,9 m); de rand tussen hal en opstaphal is een flauwe boog
//   (cirkel door de DSM-randpunten, straal 32,6 m).
// - PDOK-luchtfoto 8 cm (Actueel_orthoHR): lichtstraten en ventilatoren op
//   het haldak, luchtkanalen en lichtkoepels op de wachtrij, de markies, de
//   positie van de hoed (RD 131802,5, 407087,5) en van Jokie.
// - Wikimedia Commons (Category:Carnaval Festival, Category:Jokie, "Efteling
//   DSCF5845", "Carnaval Festival DSCF5845 copy 1", "Reizenrijk - Jokies
//   Wereld shop", "Jokies Wereld P1660060", "Reizenrijk (2024)") en Eftepedia
//   (lemma Carnaval Festival) voor de opbouw van gevel, winkel en hal.
// Geschat uit foto's (schaal uit de AHN-gevelhoogte en de hoedbreedte op de
// luchtfoto): het doek (6,4 m breed, 4,0 tot 6,2 m), draperieën en franje, de
// maten van kop, hoed, strik, handen en Jokie, de poort (2,4 × 3,65 m), de
// toiletboog en de uitgangsdeur, de markies (1,3 m diep), de blauwe lijst en
// de kuif van de winkel, de kroonlijsten, en de afmetingen van lichtstraten,
// ventilatoren, kanalen en koepels.
import {
  Manifold,
  CrossSection,
  prism,
  box,
  dome,
  union,
  downFaces,
  writeLandmark,
} from "./efteling-kit.mjs";

// ---------- assen en hoogtes (z = 0 op NAP +9,45 m) ----------
const ORIGIN = [131817, 407108];
const ANGLE = (11.67 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
const BASE = -1.8;
const HALL_TOP = 8.1; // dakrand hal (NAP +17,55)
const STATION_TOP = 7.0; // opstaphal (NAP +16,45)
const FRONT_TOP = 5.6; // entreegevel (NAP +15,05)
const LOW_TOP = 4.7; // wachtrij en winkel (NAP +14,15)
const EXIT_TOP = 2.8; // uitgangsgebouwtje
const FRONT = -16.2; // gevelvlak van de entree (v)

// ---------- hulpfuncties ----------
const arc = (c, r, a0, a1, n) =>
  Array.from({ length: n + 1 }, (_, k) => {
    const a = ((a0 + ((a1 - a0) * k) / n) * Math.PI) / 180;
    return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
  });
const ring = (pts, z) => pts.map(([x, y]) => [x, y, z]);
const offsetPoly = (pts, d) => new CrossSection([pts]).offset(d, "Miter", 4).toPolygons()[0];
// Convex lichaam met een kroonlijst: muur tot z1, daarop een band die `out`
// uitsteekt van zb tot zt met een kraag van 45 graden eronder.
const convexBody = (pts, z0, z1) => Manifold.hull([...ring(pts, z0), ...ring(pts, z1)]);
const cornice = (pts, zb, zt, out) => {
  const o = offsetPoly(pts, out);
  return Manifold.hull([...ring(pts, zb - out), ...ring(o, zb), ...ring(o, zt), ...ring(pts, zt)]);
};
// Dakrand: een opstaande rand van `w` breed langs de omtrek tot z1.
const parapet = (pts, z0, z1, w) => prism(pts, z0, z1).subtract(prism(offsetPoly(pts, -w), z0 - 1, z1 + 1));
// Vlak in een verticale gevel: frame { o: [u, v], t: richting langs de gevel,
// n: horizontale normaal naar buiten }. Een punt (s, z, e) ligt s langs de
// gevel, op hoogte z en e voor het gevelvlak.
const frame = (o, t) => {
  const l = Math.hypot(t[0], t[1]);
  const tt = [t[0] / l, t[1] / l];
  return { o, t: tt, n: [tt[1], -tt[0]] };
};
const at = (f, s, z, e) => [f.o[0] + f.t[0] * s + f.n[0] * e, f.o[1] + f.t[1] * s + f.n[1] * e, z];
// Reliëf: convexe veelhoek [(s, z)] in de gevel, `d` uitstekend, met een
// kraag van 45 graden naar de muur eronder (0,05 m in de muur verankerd).
const relief = (f, pts, d) =>
  Manifold.hull(pts.flatMap(([s, z]) => [at(f, s, z, d), at(f, s, z, -0.05), at(f, s, z - d, -0.05)]));
// Nis: veelhoek [(s, z)] `d` diep in de gevel gesneden.
const niche = (f, pts, d) => Manifold.hull(pts.flatMap(([s, z]) => [at(f, s, z, 1), at(f, s, z, -d)]));
// Spitse boog: breedte w, kämpfer op zs, top op zt (zijden ≥ 50 graden).
const pointed = (c, w, z0, zs, zt) => [[c - w / 2, z0], [c + w / 2, z0], [c + w / 2, zs], [c, zt], [c - w / 2, zs]];
const sphere = (p, r) => Manifold.sphere(r, 24).translate(p);
const capsule = (a, b, r) => Manifold.hull([sphere(a, r), sphere(b, r)]);
const FACADE = frame([0, FRONT], [1, 0]); // entreegevel: s = u

// ---------- showhal ----------
// Convexe omtrek (BAG): afgeronde noordhoeken (straal 5,1 en 5,15 m), een
// afgeschuinde zuidoosthoek en in het zuidwesten de koorde tussen de punten
// waar de boog van de opstaphal de west- en zuidgevel snijdt.
const HALL = [
  [2.1, -12.2],
  [40.35, -12.2],
  [41.35, -11.2],
  [42.05, 17.3],
  ...arc([36.9, 17.3], 5.15, 0, 90, 6).slice(1),
  ...arc([-3.4, 17.6], 5.1, 90, 180, 6),
  [-8.45, 0.5],
];
// Boog tussen hal en opstaphal (cirkel door de DSM-randpunten).
const SCOOP = { c: [-27.5, -26], r: 32.65 };
const STATION = [[-5.0, -12.6], [3.0, -12.6], [3.0, 3.0], [-8.6, 3.0], [-8.6, -9.0]];
let hall = union([
  convexBody(HALL, BASE, HALL_TOP - 0.25),
  cornice(HALL, 7.2, 7.5, 0.25),
  parapet(HALL, HALL_TOP - 0.3, HALL_TOP, 0.4),
]);
// Plint: 0,15 m uitstekend tot 0,5 m boven het plein, alleen langs de vrije
// gevels (niet in de opstaphal of de wachtrij).
// Lichtstraten (luchtfoto: twee rijen van zes) met een flauw zadeldakje, en
// ronde ventilatoren ernaast.
hall = hall.add(
  convexBody(offsetPoly(HALL, 0.15), BASE, 0.5)
    .subtract(prism(STATION, BASE - 1, 1))
    .subtract(prism([[-8.4, -11.3], [-8.4, 6.61], [-30, 6.61], [-30, -11.3]], BASE - 1, 1)),
);
const skylight = ([u, v], z) =>
  union([
    box(u - 0.9, v - 1.4, z - 0.1, u + 0.9, v + 1.4, z + 0.45),
    Manifold.hull([
      [u - 0.9, v - 1.4, z + 0.4], [u + 0.9, v - 1.4, z + 0.4], [u - 0.9, v + 1.4, z + 0.4], [u + 0.9, v + 1.4, z + 0.4],
      [u, v - 1.4, z + 0.8], [u, v + 1.4, z + 0.8],
    ]),
  ]);
const vent = ([u, v], z) => dome([u, v], [[0.45, z - 0.1], [0.45, z + 0.35], [0.3, z + 0.6], [0.12, z + 0.68]], 16);
const ROOF = HALL_TOP - 0.25;
const hallDetails = [];
for (const p of [[-4.4, 13.6], [3.8, 13.5], [12.0, 13.4], [20.7, 13.5], [28.9, 13.4], [37.2, 13.3], [3.7, -4.9], [11.9, -4.9], [20.4, -5.0], [28.7, -5.1], [37.0, -5.2]]) {
  hallDetails.push(skylight(p, ROOF));
}
for (const p of [[3.9, 16.2], [12.4, 15.8], [20.7, 16.0], [29.0, 15.8], [12.0, -7.2], [20.2, -7.4], [28.6, -7.4]]) {
  hallDetails.push(vent(p, ROOF));
}
hall = hall.add(union(hallDetails));
// De hal boven de opstaphal volgt de boog (de opstaphal steekt er rond in).
const scoop = Manifold.cylinder(20, SCOOP.r, SCOOP.r, 256).translate([SCOOP.c[0], SCOOP.c[1], STATION_TOP - 0.05]);
hall = hall.subtract(scoop);

// ---------- opstaphal (rond, lager) ----------
let station = union([
  convexBody(STATION, BASE, STATION_TOP - 0.2),
  cornice(STATION, 6.1, 6.4, 0.25),
  parapet(STATION, STATION_TOP - 0.3, STATION_TOP, 0.35),
  skylight([-4.4, -6.3], STATION_TOP - 0.2),
]);
station = station.subtract(hall);

// ---------- entreegevel met doek, reuzenkop en Jokie ----------
const ENTREE = [[-25.4, FRONT], [-4.6, FRONT], [-4.6, -11.4], [-25.4, -11.4]];
const EXIT = [[-4.7, FRONT], [-2.6, -17.18], [1.34, -17.19], [3.66, -15.62], [3.69, -12.0], [-4.7, -12.0]];
let entree = union([
  prism(ENTREE, BASE, FRONT_TOP),
  prism(EXIT, BASE, EXIT_TOP),
  // Afdekking van de gevel en het uitgangsgebouwtje: 0,2 m uitstekend.
  relief(FACADE, [[-25.35, FRONT_TOP - 0.3], [-4.65, FRONT_TOP - 0.3], [-4.65, FRONT_TOP], [-25.35, FRONT_TOP]], 0.2),
]);
const ent = [];
// Poort onder het doek (spits, 2,4 m breed, top 3,65 m), boog naar de
// toiletten en de uitgangsdeur met het rode boogbordje erboven.
const cuts = [
  niche(FACADE, pointed(-19.6, 2.4, 0, 2.2, 3.65), 0.6),
  niche(FACADE, pointed(-24.0, 1.6, 0, 1.9, 2.9), 0.4),
  niche(FACADE, [[-15.4, 0], [-14.0, 0], [-14.0, 2.2], [-15.4, 2.2]], 0.3),
  // Vensters in het uitgangsgebouwtje.
  niche(frame([-2.6, -17.18], [1, 0]), [[0.6, 0.9], [3.3, 0.9], [3.3, 2.0], [0.6, 2.0]], 0.3),
];
entree = entree.subtract(union(cuts));
{
  const sign = [];
  for (let k = 0; k <= 8; k++) {
    const a = (Math.PI * k) / 8;
    sign.push([-14.7 + 0.8 * Math.cos(a), 2.25 + 0.55 * Math.sin(a)]);
  }
  ent.push(relief(FACADE, sign, 0.2));
}
// Rood doek: van u -22,2 tot -16,2, onderrand 4,0 m, bovenrand met twee
// zwieren (pieken bij Jokie, de linkerhand van de clown en de rechterhand).
const TOPLINE = [[-22.2, 5.85], [-21.4, 5.5], [-20.6, 5.45], [-19.6, 6.0], [-18.8, 5.5], [-17.6, 5.45], [-16.2, 5.85]];
for (let i = 0; i + 1 < TOPLINE.length; i++) {
  const [[s0, z0], [s1, z1]] = [TOPLINE[i], TOPLINE[i + 1]];
  ent.push(relief(FACADE, [[s0, 4.0], [s1, 4.0], [s1, z1], [s0, z0]], 0.3));
  // Gele draperie langs de bovenrand: een dikke rol.
  ent.push(relief(FACADE, [[s0 - 0.05, z0 - 0.3], [s1 + 0.05, z1 - 0.3], [s1 + 0.05, z1 + 0.25], [s0 - 0.05, z0 + 0.25]], 0.55));
}
// Franje: halve schijven onder de onderrand.
for (let s = -21.9; s <= -16.4; s += 0.6) {
  const pts = [];
  for (let k = 0; k <= 6; k++) {
    const a = Math.PI + (Math.PI * k) / 6;
    pts.push([s + 0.3 * Math.cos(a), 4.05 + 0.3 * Math.sin(a)]);
  }
  ent.push(relief(FACADE, pts, 0.32));
}
// Gele zijdraperieën met een punt onderaan.
ent.push(relief(FACADE, [[-22.65, 2.85], [-22.25, 2.45], [-21.85, 2.85], [-21.85, 6.0], [-22.65, 6.0]], 0.5));
ent.push(relief(FACADE, [[-16.55, 2.55], [-16.15, 2.1], [-15.75, 2.55], [-15.75, 5.95], [-16.55, 5.95]], 0.5));
// Reuzenkop achter het doek op het dak van de gevel: hemd met strik, kop,
// oren, rode neus en hoge hoed (top 9,0 m, AHN 8,9 m).
const C = [-18.3, -15.2];
ent.push(Manifold.hull([...ring(arcPts(C, 0.95, 0.6), FRONT_TOP - 0.1), ...ring(arcPts(C, 0.95, 0.6), 6.35), ...ring(arcPts(C, 0.75, 0.5), 6.6)]));
ent.push(
  dome(C, [[0.45, 6.2], [0.8, 6.55], [0.92, 6.95], [0.9, 7.25], [0.82, 7.45], [0.97, 7.6], [0.97, 7.72], [0.62, 7.78], [0.6, 8.55], [0.68, 8.95], [0.6, 9.0]], 32),
);
for (const s of [-1, 1]) {
  // Oor: lob opzij, onderkant 45 graden.
  ent.push(
    Manifold.hull([
      [C[0] + s * 0.7, C[1] - 0.15, 6.7], [C[0] + s * 0.7, C[1] + 0.15, 6.7],
      [C[0] + s * 1.2, C[1] - 0.15, 7.0], [C[0] + s * 1.2, C[1] + 0.15, 7.0],
      [C[0] + s * 1.3, C[1] - 0.15, 7.3], [C[0] + s * 1.3, C[1] + 0.15, 7.3],
      [C[0] + s * 0.8, C[1] - 0.15, 7.55], [C[0] + s * 0.8, C[1] + 0.15, 7.55],
    ]),
  );
  // Strik: twee lobben voor het hemd.
  ent.push(
    Manifold.hull([
      [C[0] + s * 0.1, -15.75, 6.25], [C[0] + s * 0.1, -15.75, 6.55], [C[0] + s * 0.1, -16.05, 6.3], [C[0] + s * 0.1, -16.05, 6.5],
      [C[0] + s * 0.7, -15.75, 5.95], [C[0] + s * 0.7, -15.75, 6.8], [C[0] + s * 0.7, -16.05, 6.25], [C[0] + s * 0.7, -16.05, 6.75],
    ]),
  );
}
ent.push(dome([C[0], C[1] - 1.0], [[0.06, 6.62], [0.36, 6.92], [0.34, 7.12], [0.2, 7.28], [0.06, 7.32]], 24));
// Linkerhand van de clown met drie vingers omhoog (bij de middelste piek van
// het doek) en de rechterhand die de rechterhoek vasthoudt.
ent.push(Manifold.hull([sphere([-20.0, -16.25, 6.15], 0.3), sphere([-19.5, -16.25, 6.2], 0.3), sphere([-19.8, -16.2, 6.55], 0.32)]));
for (const tip of [[-20.5, 7.25], [-20.05, 7.35], [-19.55, 7.2]]) {
  ent.push(capsule([-19.85, -16.2, 6.5], [tip[0], -16.2, tip[1]], 0.22));
}
ent.push(Manifold.hull([sphere([-15.85, -16.4, 5.75], 0.3), sphere([-15.45, -16.4, 5.85], 0.3), sphere([-15.65, -16.3, 6.15], 0.3)]));
// Jokie op de linkerhoek: rood lijf, witte kraag, kop, neus en de narrenkap
// met twee punten en bellen.
const J = [-22.25, -15.75];
ent.push(
  dome(J, [[0.4, FRONT_TOP - 0.1], [0.32, 6.3], [0.52, 6.5], [0.5, 6.6], [0.28, 6.62], [0.42, 6.8], [0.43, 7.0], [0.36, 7.2], [0.22, 7.35], [0.1, 7.42]], 24),
);
ent.push(dome([J[0], J[1] - 0.45], [[0.04, 6.72], [0.2, 6.88], [0.19, 7.0], [0.04, 7.08]], 16));
for (const s of [-1, 1]) {
  ent.push(capsule([J[0] + s * 0.1, J[1], 7.25], [J[0] + s * 0.5, J[1], 7.7], 0.17));
  ent.push(sphere([J[0] + s * 0.55, J[1], 7.78], 0.2));
}
entree = entree.add(union(ent));

// ---------- wachtrij (lage hal met de toiletten) en winkel Jokies Wereld ----------
const LOW = [
  [-44.56, 0.59], [-44.14, -7.22], [-41.27, -7.17], [-41.16, -13.51], [-42.43, -13.53],
  [-41.2, -18.3], [-38.4, -20.6], [-33.9, -20.7], [-29.0, -18.6], [-27.6, -17.6], [-25.4, FRONT],
  [-25.3, -11.3], [-8.4, -11.3], [-8.4, 6.61], [-30.81, 6.57], [-31.91, 4.1], [-41.12, 3.93],
];
let low = union([prism(LOW, BASE, LOW_TOP), parapet(LOW, LOW_TOP - 0.2, LOW_TOP + 0.2, 0.3)]);
// Uitsparing in het dak voor de boom in de wachtrij (Eftepedia; DSM-kruin op
// u -24 tot -10, v -11 tot 0).
low = low.subtract(box(-20.0, -6.5, 1.5, -16.0, -2.5, 10));
// Luchtkanalen en lichtkoepels op het dak (luchtfoto).
const lowDetails = [];
const duct = (pts) => {
  for (let i = 0; i + 1 < pts.length; i++) {
    const [a, b] = [pts[i], pts[i + 1]];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [dx, dy] = [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
    const [nx, ny] = [-dy * 0.45, dx * 0.45];
    const [a2, b2] = [[a[0] - dx * 0.45, a[1] - dy * 0.45], [b[0] + dx * 0.45, b[1] + dy * 0.45]];
    lowDetails.push(prism([[a2[0] + nx, a2[1] + ny], [b2[0] + nx, b2[1] + ny], [b2[0] - nx, b2[1] - ny], [a2[0] - nx, a2[1] - ny]], LOW_TOP - 0.1, LOW_TOP + 0.75));
  }
};
duct([[-28.3, 5.4], [-30.3, -4.4], [-36.6, -4.1], [-37.5, -12.7], [-26.0, -13.5]]);
duct([[-25.7, 4.9], [-28.4, -10.1], [-31.2, -9.9]]);
for (const [u, v] of [[-30.2, 4.0], [-30.4, 1.2], [-25.8, 3.7], [-25.9, 1.1], [-30.3, -3.1], [-25.4, -3.3], [-30.1, -7.5], [-26.5, -7.6], [-30.7, -11.2], [-26.7, -11.4]]) {
  lowDetails.push(
    Manifold.hull([
      ...ring([[u - 0.65, v - 0.65], [u + 0.65, v - 0.65], [u + 0.65, v + 0.65], [u - 0.65, v + 0.65]], LOW_TOP - 0.1),
      ...ring([[u - 0.65, v - 0.65], [u + 0.65, v - 0.65], [u + 0.65, v + 0.65], [u - 0.65, v + 0.65]], LOW_TOP + 0.35),
      ...ring([[u - 0.3, v - 0.3], [u + 0.3, v - 0.3], [u + 0.3, v + 0.3], [u - 0.3, v + 0.3]], LOW_TOP + 0.65),
    ]),
  );
}
low = low.add(union(lowDetails));
// Toiletgevel op de schuine hoek tussen winkel en entree: blinde vensters.
{
  const f = frame([-27.6, -17.6], [2.2, 1.4]);
  low = low.subtract(niche(f, [[0.4, 1.6], [2.1, 1.6], [2.1, 3.2], [0.4, 3.2]], 0.3));
}
// Winkel: het deel van de lage hal achter de veelhoekige pui.
const SHOP_ZONE = prism([[-50, -30], [-27.0, -30], [-27.0, -14.6], [-50, -14.6]], BASE - 1, 20);
let shop = low.intersect(SHOP_ZONE);
low = low.subtract(SHOP_ZONE);
// Puifacetten van west naar oost (normaal naar buiten).
const PUI = [[-42.43, -13.53], [-41.2, -18.3], [-38.4, -20.6], [-33.9, -20.7], [-29.0, -18.6]];
const facets = PUI.slice(0, -1).map((a, i) => ({ a, b: PUI[i + 1], f: frame(a, [PUI[i + 1][0] - a[0], PUI[i + 1][1] - a[1]]) }));
const shopParts = [];
// Markies: rood, schuin aflopend van 3,4 m aan de pui tot 2,75 m op 1,3 m
// ervoor, met een valletje tot 2,4 m; daaronder een kraag van 45 graden.
// Blauwe lijst met gele onderrand van 3,4 tot 5,0 m, 0,35 m uitstekend.
// De hoeken zijn verstek: de facetten lopen door tot de bissectrice.
const miter = (i, e) => {
  // Punt op afstand e voor de pui op hoekpunt i (verstek tussen de facetten).
  const n0 = i > 0 ? facets[i - 1].f.n : facets[0].f.n;
  const n1 = i < facets.length ? facets[i].f.n : facets[facets.length - 1].f.n;
  const m = [n0[0] + n1[0], n0[1] + n1[1]];
  const k = e / (1 + n0[0] * n1[0] + n0[1] * n1[1]);
  return [PUI[i][0] + m[0] * k, PUI[i][1] + m[1] * k];
};
for (let i = 0; i < facets.length; i++) {
  const p = (j, e, z) => [...miter(j, e), z];
  shopParts.push(
    Manifold.hull([
      p(i, -0.05, 3.4), p(i + 1, -0.05, 3.4), p(i, 1.3, 2.75), p(i + 1, 1.3, 2.75),
      p(i, 1.3, 2.4), p(i + 1, 1.3, 2.4), p(i, -0.05, 1.1), p(i + 1, -0.05, 1.1),
    ]),
  );
  shopParts.push(
    Manifold.hull([
      p(i, -0.05, 3.05), p(i + 1, -0.05, 3.05), p(i, 0.35, 3.4), p(i + 1, 0.35, 3.4),
      p(i, 0.35, 5.0), p(i + 1, 0.35, 5.0), p(i, -0.05, 5.0), p(i + 1, -0.05, 5.0),
    ]),
  );
}
// Kuif: uitgezaagd paneel (0,5 m dik, 0,3 m achter de lijst) op de drie
// voorste facetten, met spitse torentjes; midden op het zuidoostfacet een
// ronde clownskop met rode neus (top 7,1 m, AHN circa 7 m). Paneel tot 6,0 m,
// torentjes tot 6,6 en 6,9 m.
for (let i = 1; i < facets.length; i++) {
  const { a, b, f } = facets[i];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const back = (s, z) => [at(f, s, z, 0.05), at(f, s, z, -0.45)];
  shopParts.push(Manifold.hull([[0, 4.6], [L, 4.6], [L, 6.0], [0, 6.0]].flatMap(([s, z]) => back(s, z))));
  const n = Math.max(1, Math.round(L / 1.5));
  for (let k = 0; k < n; k++) {
    const s = ((k + 0.5) * L) / n;
    if (i === 3 && Math.abs(s - L / 2) < 1.3) continue;
    const h = k % 2 ? 6.6 : 6.9;
    shopParts.push(Manifold.hull([[s - 0.45, 5.9], [s + 0.45, 5.9], [s + 0.45, 6.25], [s, h], [s - 0.45, 6.25]].flatMap(([q, z]) => back(q, z))));
  }
  if (i === 3) {
    const s = L / 2;
    const disc = [];
    for (let k = 0; k < 20; k++) {
      const a2 = (2 * Math.PI * k) / 20;
      disc.push([s + 1.0 * Math.cos(a2), 6.1 + 1.0 * Math.sin(a2)]);
    }
    shopParts.push(Manifold.hull(disc.flatMap(([q, z]) => back(q, z))));
    const [nu, nv] = at(f, s, 0, 0.25);
    shopParts.push(dome([nu, nv], [[0.05, 5.82], [0.3, 6.07], [0.28, 6.25], [0.05, 6.35]], 16));
    // Rond naambord "Jokies Wereld" op de blauwe lijst, links van het midden.
    const sign = [];
    for (let k = 0; k < 16; k++) {
      const a2 = (2 * Math.PI * k) / 16;
      sign.push([s - 1.6 + 0.6 * Math.cos(a2), 4.2 + 0.6 * Math.sin(a2)]);
    }
    shopParts.push(relief(f, sign.map(([q, z]) => [q, z]), 0.55));
  }
}
// Deur en etalages in de pui als nissen (onder de markies).
const shopCuts = [];
for (let i = 0; i < facets.length; i++) {
  const { a, b, f } = facets[i];
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  if (i === 2) shopCuts.push(niche(f, pointed(L / 2, 1.8, 0, 1.6, 2.7), 0.4));
  else shopCuts.push(niche(f, [[0.5, 0.4], [L - 0.5, 0.4], [L - 0.5, 1.05], [0.5, 1.05]], 0.3));
}
shop = shop.subtract(union(shopCuts)).add(union(shopParts));
low = low.subtract(shop);

// ---------- volgorde en overlap ----------
entree = entree.subtract(hall).subtract(station);
low = low.subtract(hall).subtract(station).subtract(entree);
shop = shop.subtract(entree);

// Booleans laten langs samenvallende randen soms lege snippers achter (volume
// 0); die vallen weg.
const clean = (m) => Manifold.union(m.decompose().filter((p) => p.volume() > 0.01));
const nodes = [
  ["building:showhal", clean(hall)],
  ["building:station", clean(station)],
  ["building:entree", clean(entree)],
  ["building:wachtrij", clean(low)],
  ["building:winkel", clean(shop)],
];
for (const [name, solid] of nodes) {
  const down = downFaces(solid, BASE + 0.01).filter((g) => g.area > 0.2);
  console.log(name, "ondervlakken:", JSON.stringify(down));
}

function arcPts(c, rx, ry, n = 16) {
  return Array.from({ length: n }, (_, k) => [c[0] + rx * Math.cos((2 * Math.PI * k) / n), c[1] + ry * Math.sin((2 * Math.PI * k) / n)]);
}

await writeLandmark({
  slug: "efteling-carnaval-festival",
  nodes,
  base: BASE,
  catalog: {
    name: "Carnaval Festival (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: [
      [-38, -26],
      [-24, -22],
      [-12, -21],
      [-2, -22],
      [-48, -14],
    ],
    replacesBuildings: ["NL.IMBAG.Pand.0809100000017621"],
    description:
      "Carnaval Festival in de Efteling (1984, entree 1998): oorsprong in de westhoek van de showhal op het maaiveld van het plein (NAP +9,45 m); +X langs de zuidgevel van de hal naar het oost-noordoosten, de entreegevel kijkt naar -Y (het plein). Vlakke showhal tot NAP +17,55 m met lichtstraten, ronde opstaphal (+16,45 m), entreegevel (+15,05 m) met het rode doek, de reuzenkop met hoge hoed tot circa NAP +18,45 m en Jokie, lage wachtrij en winkel Jokies Wereld (+14,15 m) met markies en kuif; onderkant 1,8 m onder het plein omdat het terrein achter de hal lager ligt; beschildering weggelaten.",
    realWorld: {
      hallFootprintMetres: [50.5, 35.0],
      hallHeightMetres: 8.1,
      stationHeightMetres: 7.0,
      facadeWidthMetres: 20.8,
      facadeHeightMetres: 5.6,
      curtainWidthMetres: 6.4,
      curtainHeightMetres: [4.0, 6.2],
      clownHatTopMetres: 9.0,
      queueAndShopHeightMetres: 4.7,
      shopCrestTopMetres: 7.1,
      awningDepthMetres: 1.3,
      exitBuildingHeightMetres: 2.8,
      plazaNapMetres: 9.45,
      rearGroundNapMetres: 7.8,
    },
    sources: [
      "BAG-pand 0809100000017621 (contour, bouwjaar 1998)",
      "AHN DSM/DTM 0,5 m (PDOK WCS): plein NAP +9,45 m, hal +17,55 m, opstaphal +16,45 m, entreegevel +15,05 m, wachtrij en winkel +14,15 m, uitgangsgebouwtje +12,25 m, kuif winkel circa +16,5 m, hoed +18,3 m, terrein achter de hal +7,8 m",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR): lichtstraten, ventilatoren, luchtkanalen, lichtkoepels, markies, positie van hoed en Jokie",
      "Wikimedia Commons, Category:Carnaval Festival en Category:Jokie (gevel), Reizenrijk - Jokies Wereld shop en Jokies Wereld P1660060 (winkel), Reizenrijk (2024) (hal van het zuiden)",
      "Eftepedia, lemma Carnaval Festival (opbouw entree, wachtrij met boom door het dak, ronde opstaphal)",
    ],
  },
});

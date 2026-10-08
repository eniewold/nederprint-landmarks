// Genereert een vereenvoudigd, gesloten 3D-model van De Pagode in de Efteling
// (Kaatsheuvel, 1987, Intamin "Flying Island", ontwerp Ton van de Ven): de
// Thaise tempel van 16 m doorsnede die aan een geknikte hydraulische arm tot
// circa 45 m boven het park wordt geheven. Alle maten in het script zijn
// meters op ware grootte. Uitvoer via scripts/efteling-kit.mjs: een GLB in
// meters (Y omhoog, nodes `building:pagode` en `building:machinekuil`), de
// catalogus-JSON en een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-efteling-pagode.mjs              # 1:1000 (standaard)
//   node scripts/generate-efteling-pagode.mjs --scale 500
//
// Stand: de tempel helemaal omhoog, zoals het AHN hem heeft ingemeten en zoals
// hij vanuit het hele park te zien is (de "paddenstoel" boven de bomen). In
// rust staat de tempel in de ronde landingskuil aan de Siervijver (31 m
// oostelijk) en ligt de arm in een sleuf in het maaiveld; dat is van buiten
// nauwelijks meer dan een carrousel in het groen en daarom niet gekozen.
//
// Wat erin zit:
// - De tempel: de ronde bodem (schotel) met de rand van 1,1 m, de dichte
//   borstwering van het rondom lopende dek (de leuning, 1,15 m hoog), daarboven
//   een terugliggende vensterband met een schuine (45 graden) dakvoet, het
//   ringdak met twintig radiale puntgevels (ruiten-zadeldakjes met de nok naar
//   buiten) met op elke top de omhooggebogen hoorn, en in het midden de
//   tienhoekige trommel met het eerste puntdak (klokvormig, tien hoorns op de
//   hoeken), de tweede trommel met het tweede dakje (acht hoorns), en de
//   gouden spits met drie knoppen en de piek.
// - De arm: een kokerbalk van 2,4 bij 1,6 m die vanaf het scharnier in de
//   machinekuil onder 55 graden oploopt tot een knik 4,5 m onder de
//   schotel, 2,5 m voorbij het hart, en dan onder 72 graden terugbuigt naar
//   het midden van de schotel; achter het scharnier de staart met het
//   tegengewicht.
// - De machinekuil (BAG-pand 0809100000017641): de afdekking op 1,6 m met de
//   opgaande scharnierkap, en het lage machinehuis ernaast (BAG-pand
//   0809100000017642, plat dak op 2,2 m).
// De landingskuil en de Siervijver zitten in het terrein en zijn niet
// gemodelleerd.
//
// Printbaar op 1:1000: de arm (2,4 bij 1,6 m) loopt overal steiler dan 45
// graden op, de knik is een volle knoop, hoorns en gevels leunen hooguit 35
// graden naar buiten, de dakvoeten en trommeloverstekken rusten op een kraag
// van 45 graden en de spits zwelt niet steiler dan 45 graden uit. Alleen de
// schotel onder de tempel (licht hellend, zoals in het echt) en de onderkant
// van de staart hangen vlakker; daar zet de export de kraag van 45 graden
// onder (zie het rapport bij de printcontrole).
//
// Assenstelsel: oorsprong op RD (131685,0, 406905,36), recht onder het hart van
// de geheven tempel, op het maaiveld (NAP +10,0 m), Z omhoog. +X wijst langs de
// arm van het scharnier naar de landingskuil (oost-zuidoost, -16 graden vanaf
// de RD-X-as; de BAG-contouren van de machinekuil en het machinehuis liggen
// precies langs deze as), +Y loodrecht daarop naar het noord-noordoosten.
//
// Bronnen: BAG-panden 0809100000017641 (machinekuil, 25,1 x 6,3 m, 1987) en
// 0809100000017642 (machinehuis, 7,1 x 12,4 m, 1987); AHN DSM/DTM 0,5 m (PDOK
// WCS): de geheven tempel (hart, top van de spits op NAP +59,6 m), de arm en
// de staart in de kuil, de afdekking (1,6 m) en het machinehuis (NAP +12,2 m),
// de sleuf en de landingskuil in het DTM voor de as; PDOK luchtfoto 8 cm;
// Wikipedia (nl: tempel van 16 m doorsnede, 45 m hoog, tegengewicht in een
// kuil van 10 m; en: arm 225 t, cabine 155 t, tegengewicht 340 t); efteling.com
// (blog "Wonder: opstarten Pagode", 2019); Wikimedia Commons-foto's
// (Category:Pagode (Efteling)) voor de opbouw en de verhoudingen.
// Geschat uit foto's: de hoogtes binnen de tempel (dek op 36,5 m, dakvoet
// +2,45, gevels +4,7, trommels en daken), het aantal gevels (20, ook op de
// luchtfoto) en hoorns, de doorsnede van de arm, de knik en het scharnier
// (-15,5 m, 4 m hoog, uit de AHN-punten op de arm en de staart).
import {
  Manifold,
  box,
  check,
  circle,
  dome,
  downFaces,
  hull,
  prism,
  rect,
  ring3,
  union,
  writeLandmark,
} from "./efteling-kit.mjs";

// ---------- maten (lokaal stelsel, z = 0 op NAP +10,0 m) ----------
const ORIGIN = [131685.0, 406905.36];
const ANGLE = (-16 * Math.PI) / 180;
const X_AXIS = [+Math.cos(ANGLE).toFixed(5), +Math.sin(ANGLE).toFixed(5)];
// Onderkant 1 m onder het maaiveld: het machinehuis staat aan de noordkant
// 0,5 m lager (NAP +9,5 m) dan de zuidkant waar het maaiveld bemonsterd wordt.
const BASE = -1;
const D = 36.5; // dekvloer van de tempel
const R = 8.05; // straal van de rand (16,1 m doorsnede)
const deg = Math.PI / 180;

// ---------- de tempel ----------
// Schotel, rand, borstwering, vensterband met schuine dakvoet en het ringdak
// als één omwenteling (r, z) van onder naar boven.
const body = dome(
  [0, 0],
  [
    [1.4, D - 2.5], // onderkant van de schotel bij de arm
    [R - 0.05, D - 1.15],
    [R, D - 1.1], // onderkant van de rand
    [R, D + 0.05], // bovenkant van de randlijst op dekhoogte
    [R - 0.15, D + 0.05], // borstwering 0,15 m terug
    [R - 0.15, D + 1.15],
    [R - 0.6, D + 1.15], // vensterband 0,6 m terug
    [R - 0.6, D + 1.75],
    [R + 0.1, D + 2.45], // dakvoet onder 45 graden
    [R + 0.1, D + 2.55],
    [2.6, D + 4.3], // ringdak tot tegen de trommel
  ],
  80,
);

// Twintig radiale puntgevels: ruitvormige zadeldakjes van de dakvoet tot op
// het ringdak, met de driehoekige geveltop aan de buitenkant en een hoorn op
// de top.
const NG = 20;
const gables = [];
for (let k = 0; k < NG; k++) {
  const phi = ((k + 0.5) * 2 * Math.PI) / NG;
  const c = Math.cos(phi);
  const s = Math.sin(phi);
  const at = (r, t, z) => [r * c - t * s, r * s + t * c, z];
  const ro = R + 0.15;
  const ri = 4.6;
  const wo = 1.22;
  const wi = (wo * ri) / ro;
  const zTop = D + 4.7;
  gables.push(
    hull([at(ro, -wo, D + 2.35), at(ro, wo, D + 2.35), at(ro, 0, zTop), at(ri, -wi, D + 3.6), at(ri, wi, D + 3.6), at(ri, 0, zTop)]),
  );
  // Hoorn: piramide van 0,5 m op de top, 1,1 m hoog, 0,35 m naar buiten.
  const h0 = zTop - 0.6;
  gables.push(
    hull([at(ro - 0.55, -0.25, h0), at(ro - 0.55, 0.25, h0), at(ro - 0.05, -0.25, h0), at(ro - 0.05, 0.25, h0), at(ro + 0.2, 0, zTop + 1.1)]),
  );
}

// Veelhoekige trommel met een puntdak en hoorns op de hoeken.
const horns = (n, r, z, len, out, phase) =>
  Array.from({ length: n }, (_, k) => {
    const phi = phase + (k * 2 * Math.PI) / n;
    const c = Math.cos(phi);
    const s = Math.sin(phi);
    const at = (rr, t, zz) => [rr * c - t * s, rr * s + t * c, zz];
    return hull([at(r - 0.5, -0.22, z), at(r - 0.5, 0.22, z), at(r - 0.06, -0.22, z), at(r - 0.06, 0.22, z), at(r + out, 0, z + len)]);
  });
const tieredRoof = (n, rings, phase) =>
  hull(rings.flatMap(([r, z]) => ring3(circle([0, 0], r, n, phase), z)));
const ph10 = Math.PI / 10;
const ph8 = Math.PI / 8;
const tower = union([
  // Eerste trommel (blauw mozaïek), tienhoekig, r = 2,3 m.
  prism(circle([0, 0], 2.3, 10, ph10), D + 3.6, D + 5.7),
  // Eerste puntdak: kraag van 45 graden onder de dakvoet, de korte steile
  // rok en de klokvormige roze kegel.
  tieredRoof(10, [[2.3, D + 5.6], [3.0, D + 6.3], [3.0, D + 6.45]], ph10),
  tieredRoof(10, [[3.0, D + 6.4], [2.45, D + 7.0], [1.9, D + 7.9], [1.05, D + 8.9]], ph10),
  ...horns(10, 3.05, D + 6.3, 0.9, 0.45, ph10),
  // Tweede trommel en dakje (groen), achthoekig.
  prism(circle([0, 0], 1.05, 8, ph8), D + 8.8, D + 9.3),
  tieredRoof(8, [[1.05, D + 8.85], [1.5, D + 9.3], [1.5, D + 9.42], [0.6, D + 10.05]], ph8),
  ...horns(8, 1.5, D + 9.32, 0.7, 0.3, ph8),
  // Gouden spits: drie knoppen (niet steiler dan 45 graden uitzwellend) en de
  // piek tot op NAP +59,7 m.
  dome(
    [0, 0],
    [
      [0.6, D + 9.95],
      [0.62, D + 10.2],
      [0.38, D + 10.45],
      [0.52, D + 10.62],
      [0.52, D + 10.75],
      [0.3, D + 11.0],
      [0.42, D + 11.15],
      [0.42, D + 11.28],
      [0.24, D + 11.55],
      [0.3, D + 11.65],
      [0.3, D + 11.75],
      [0.14, D + 12.4],
      [0.02, D + 13.2],
    ],
    24,
  ),
]);

// ---------- de arm ----------
// Kokerbalk met een rechthoekige doorsnede (diepte in het vlak van de arm,
// breedte dwars) tussen twee punten in het XZ-vlak.
const DEPTH = 2.4;
const WIDTH = 1.6;
const section = ([x, z], [dx, dz]) => {
  const l = Math.hypot(dx, dz);
  const n = [-dz / l, dx / l]; // normaal in het vlak
  return [-1, 1].flatMap((a) =>
    [-1, 1].map((b) => [x + (n[0] * a * DEPTH) / 2, (b * WIDTH) / 2, z + (n[1] * a * DEPTH) / 2]),
  );
};
const beam = (p, q) => {
  const d = [q[0] - p[0], q[1] - p[1]];
  return hull([...section(p, d), ...section(q, d)]);
};
const PIVOT = [-15.5, 4.0];
const BEND = [2.5, 29.5];
const TOP = [0.6, D - 1.2];
// Het onderstuk loopt door het scharnier tot onder de onderkant (afgesneden),
// zodat de arm op de onderkant staat.
const lower = beam([PIVOT[0] - 3.6, PIVOT[1] - 5.5], BEND);
const upper = beam(BEND, TOP);
const knee = hull([...section(BEND, [BEND[0] - PIVOT[0], BEND[1] - PIVOT[1]]), ...section(BEND, [TOP[0] - BEND[0], TOP[1] - BEND[1]])]);
// Staart achter het scharnier, onder 23 graden oplopend naar het westen, met
// het tegengewicht als blok tot op de afdekking van de kuil.
const TAIL = [-27.2, 9.0];
const tail = beam(PIVOT, TAIL);
const counterweight = box(-27.8, -1.1, BASE, -24.6, 1.1, 8.6);
const arm = union([lower, upper, knee, tail, counterweight]);
const armAngle = Math.atan2(BEND[1] - PIVOT[1], BEND[0] - PIVOT[0]) / deg;
const upperAngle = Math.atan2(TOP[1] - BEND[1], BEND[0] - TOP[0]) / deg;

const pagode = union([body, ...gables, tower, arm]).intersect(box(-40, -20, BASE, 20, 20, 60));

// ---------- machinekuil en machinehuis ----------
// Afdekking van de kuil binnen de BAG-contour (x -29,5..-5,4, y ±3,15) op
// 1,6 m, met de scharnierkap (tot 4,8 m) waarin de arm draait.
const pit = union([
  box(-28.6, -2.25, BASE, -6.2, 2.25, 1.6),
  hull([
    ...ring3(rect(-19.6, -2.25, -9.4, 2.25), 1.5),
    ...ring3(rect(-16.6, -2.25, -12.4, 2.25), 4.8),
  ]),
  // Machinehuis met plat dak (NAP +12,2 m).
  box(-13.25, 4.0, BASE, -6.13, 16.44, 2.2),
]);

const nodes = [
  ["building:pagode", pagode],
  ["building:machinekuil", pit],
];

const report = check(nodes, BASE);
for (const [name, solid] of nodes) {
  const faces = downFaces(solid, BASE + 0.01).filter((f) => f.area > 0.5);
  console.log(name, "ondervlakken > 0,5 m2:", JSON.stringify(faces));
}
console.log("arm:", armAngle.toFixed(1), "graden; bovenstuk:", upperAngle.toFixed(1), "graden");

await writeLandmark({
  slug: "efteling-pagode",
  nodes,
  base: BASE,
  catalog: {
    name: "Pagode (Efteling)",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    groundSamplePoints: [
      [-24, -8],
      [-12, -8],
      [0, -8],
      [6, -8],
    ],
    replacesBuildings: ["NL.IMBAG.Pand.0809100000017641", "NL.IMBAG.Pand.0809100000017642"],
    description:
      "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (131685,0, 406905,36), recht onder het hart van de geheven tempel op het maaiveld (NAP +10,0 m), +X langs de arm van het scharnier naar de landingskuil aan de Siervijver (-16 graden vanaf de RD-X-as) en +Y loodrecht daarop naar het noord-noordoosten. Node building:pagode: de Thaise tempel (16,1 m doorsnede, dek op +36,5 m, spits tot +49,7 m) met twintig puntgevels met hoorns, twee trommels met puntdaken en de gouden spits, in de hoogste stand aan de geknikte arm (2,4 x 1,6 m, 55 graden) met de staart en het tegengewicht; node building:machinekuil: de afdekking van de kuil met de scharnierkap en het machinehuis. Onderkant 1 m onder het maaiveld. Vervangt de PDOK-reconstructie van de machinekuil en het machinehuis; de landingskuil en de vijver zitten in het terrein. Nodenaam klasse:label bepaalt de materiaalklasse.",
    realWorld: {
      opening: 1987,
      type: "Intamin Flying Island (observatietoren met hydraulische arm)",
      tempelDoorsnedeM: 16.1,
      dekHoogteM: D,
      topSpitsM: +(D + 13.2).toFixed(1),
      topSpitsNapM: 59.7,
      aantalGevels: NG,
      armDoorsnedeM: [DEPTH, WIDTH],
      armHoekGraden: +armAngle.toFixed(1),
      scharnier: { x: PIVOT[0], z: PIVOT[1] },
      knik: { x: BEND[0], z: BEND[1] },
      machinekuilM: [25.1, 6.3],
      machinehuisM: [7.1, 12.4],
      maaiveldNapM: 10.0,
    },
    sources: [
      "BAG-panden 0809100000017641 en 0809100000017642 (PDOK BAG WFS)",
      "AHN DSM/DTM 0,5 m (PDOK WCS): geheven tempel, arm, staart, kuil en machinehuis",
      "PDOK luchtfoto 8 cm (Actueel_orthoHR)",
      "nl.wikipedia.org/wiki/Pagode_(Efteling) en en.wikipedia.org/wiki/Pagoda_(Efteling)",
      "efteling.com: blog 'Wonder: opstarten Pagode' (2019)",
      "Wikimedia Commons: Category:Pagode (Efteling)",
    ],
  },
});


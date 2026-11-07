// Synagoge van Emmen (Julianastraat 27): zaalsynagoge uit 1878, in 1909 met een
// travee naar de straat verlengd, met gepleisterde topgevel. Opgebouwd uit
// prisma's, dakvlakken (planvergelijkingen), hulls en spitsboognissen op de
// BAG-contour, AHN-hoogtes en de RCE-foto's; zie models/synagoge-van-emmen/README.md.
import { Manifold, CrossSection, ccw, prism, box, hull, ring3, rect, union, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "synagoge-van-emmen";
const BASE = -0.3;
// Maaiveld AHN-DTM NAP +22,45 (22,3 tot 22,6 rondom); z = NAP - 22,45.
const GROUND_NAP = 22.45;

// ---------- gebouwstelsel ----------
// u langs de nok (+u = oost, achtergevel), v dwars (+v = noord). BAG-pand
// 0114100000232970 is een rechthoek van 15,67 x 6,80 m; oorsprong in het hart.
const HL = 15.672 / 2;
const HB = 6.8 / 2;
// Dakvlakken uit het AHN-DSM: nok NAP +30,20 (7,75 m), helling 0,85 (40 graden),
// dus 4,86 m op de gevellijn; bakgoot NAP +27,3 à 27,4.
const RIDGE = 7.75;
const SLOPE = 0.85;
const roofZ = (v) => RIDGE - SLOPE * Math.abs(v);
// Gepleisterde plint tot 1,80 m (RCE-foto's: 0,38 x de goothoogte).
const PLINTH = 1.8;
const PLINTH_OUT = 0.12;
// Onderkant van de bakgoot tegen de muur en zijn uitkraging.
const CORNICE_LOW = 3.9;
const CORNICE_OUT = 0.4;
const CORNICE_TOP = 4.95;
// Opstaande topgevel: 0,35 m boven het dakvlak, 0,45 m dik.
const GABLE_RISE = 0.35;
const GABLE_THICK = 0.45;

// Doorsnede [v, z] uitgetrokken langs u van u0 tot u1.
const alongU = (pts, u0, u1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), u1 - u0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, u0, 0, 0, 1]);
// Doorsnede [u, z] uitgetrokken langs v van v0 tot v1.
const alongV = (pts, v0, v1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), v1 - v0).transform([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, v1, 0, 1]);
// Het deel van een volume onder het vlak z = a u + b v + c.
const below = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Spitsboog van breedte w met de onderkant op z0 en de top op zt, rond s = c:
// bogen met straal w vanuit de tegenoverliggende aanzet tot een helling van
// 50 graden, daarboven rechte zijden van 50 graden naar de top. Zo is het
// nisplafond nergens vlakker dan 50 graden (een zuivere gelijkzijdige boog
// loopt in de top uit op 30 graden). De top ligt 0,96 w boven de aanzet.
const ARCH_T = (40 * Math.PI) / 180;
const pointedArch = (c, w, z0, zt, n = 6) => {
  const zs = zt - w * (Math.sin(ARCH_T) + (Math.cos(ARCH_T) - 0.5) * Math.tan(Math.PI / 2 - ARCH_T));
  const right = [];
  for (let k = 0; k <= n; k++) {
    const t = (k / n) * ARCH_T;
    right.push([w * (Math.cos(t) - 0.5), zs + w * Math.sin(t)]);
  }
  const left = right.map(([x, z]) => [-x, z]).reverse();
  return [[c - w / 2, z0], [c + w / 2, z0], ...right.map(([x, z]) => [c + x, z]), [c, zt], ...left.map(([x, z]) => [c + x, z])];
};
// Rond venster als nis: de cirkel waar hij steiler is dan 50 graden, daarboven
// een spitse kap van 50 graden.
const oculus = (c, zc, r, n = 24) => {
  const pts = [];
  const a0 = ARCH_T; // straalhoek waar de raaklijn 50 graden helt
  for (let k = 0; k <= n; k++) {
    const t = a0 - (k / n) * (Math.PI + 2 * a0); // rechtsboven, via onder, naar linksboven
    pts.push([c + r * Math.cos(t), zc + r * Math.sin(t)]);
  }
  pts.push([c, zc + r * Math.sin(a0) + r * Math.cos(a0) * Math.tan(Math.PI / 2 - ARCH_T)]);
  return pts;
};

const parts = [];
const cuts = [];

// ---------- zaal met zadeldak ----------
// Muren en dak in één volume: de BAG-rechthoek tot onder de twee dakvlakken.
parts.push(
  below(below(box(-HL, -HB, BASE, HL, HB, 12), [0, SLOPE, RIDGE]), [0, -SLOPE, RIDGE]),
);
// Gepleisterde plint rondom met een afgeschuinde bovenkant.
parts.push(box(-HL - PLINTH_OUT, -HB - PLINTH_OUT, BASE, HL + PLINTH_OUT, HB + PLINTH_OUT, PLINTH));
parts.push(
  hull([
    ...ring3(rect(-HL - PLINTH_OUT, -HB - PLINTH_OUT, HL + PLINTH_OUT, HB + PLINTH_OUT), PLINTH - 0.01),
    ...ring3(rect(-HL, -HB, HL, HB), PLINTH + PLINTH_OUT),
  ]),
);
// Verkropte gietijzeren bakgoot langs beide zijgevels: onderkant onder 39 graden.
for (const s of [-1, 1]) {
  const prof = [
    [s * (HB - 0.1), CORNICE_LOW],
    [s * HB, CORNICE_LOW],
    [s * (HB + CORNICE_OUT), CORNICE_LOW + CORNICE_OUT * 1.25],
    [s * (HB + CORNICE_OUT), CORNICE_TOP],
    [s * (HB - 0.1), CORNICE_TOP],
  ];
  parts.push(alongU(prof, -HL, HL + PLINTH_OUT));
}
// Lisenen: vier traveeën per zijgevel (RCE: "door pilasters in vier traveeën
// verdeeld"), 0,5 m breed, op de plint tot onder de bakgoot.
const BAY = (2 * HL) / 4;
const PIL_TOP = CORNICE_LOW + PLINTH_OUT * 1.25;
for (const s of [-1, 1]) {
  for (const u of [-HL + BAY, -HL + 2 * BAY, -HL + 3 * BAY]) {
    parts.push(box(u - 0.25, s < 0 ? -HB - PLINTH_OUT : HB - 0.05, PLINTH, u + 0.25, s < 0 ? -HB + 0.05 : HB + PLINTH_OUT, PIL_TOP));
  }
  // Hoeklisene aan de achtergevel, om de hoek heen.
  parts.push(box(HL - 0.5, s < 0 ? -HB - PLINTH_OUT : HB - 0.5, PLINTH, HL + PLINTH_OUT, s < 0 ? -HB + 0.5 : HB + PLINTH_OUT, PIL_TOP));
}

// ---------- gepleisterde voorgevel (west, -u) ----------
// Opstaande topgevel, 0,35 m boven het dak.
parts.push(
  below(below(box(-HL, -HB, 4, -HL + GABLE_THICK, HB, 12), [0, SLOPE, RIDGE + GABLE_RISE]), [0, -SLOPE, RIDGE + GABLE_RISE]),
);
// Brede hoekpilasters (1,0 m op de voorgevel, 0,25 m voor de gevel) met een
// kroonlijstkop die onder 40 graden 0,22 m uitkraagt.
const CAP_LOW = 4.85;
for (const s of [-1, 1]) {
  const outline = rect(-HL - 0.25, s < 0 ? -HB - 0.15 : HB - 0.85, -HL + 0.75, s < 0 ? -HB + 0.85 : HB + 0.15);
  parts.push(prism(outline, BASE, CAP_LOW));
  const [x0, y0] = outline[0];
  const [x1, y1] = outline[2];
  const grow = 0.22;
  parts.push(
    hull([
      ...ring3(outline, CAP_LOW - 0.01),
      ...ring3(rect(x0 - grow, y0 - grow, x1 + grow, y1 + grow), CAP_LOW + grow * 1.2),
    ]),
  );
  parts.push(box(x0 - grow, y0 - grow, CAP_LOW + grow * 1.2, x1 + grow, y1 + grow, 5.4));
}
// Klimmend keperfries: zeven tanden per zijde onder de schuine gevelrand,
// 0,1 m voor de gevel, met een afgeschuinde onderkant.
const TOOTH = 0.4;
for (const s of [-1, 1]) {
  for (let k = 0; k < 7; k++) {
    const va = 0.45 + k * TOOTH;
    const vb = va + TOOTH;
    const zt = roofZ(vb) + GABLE_RISE;
    const zb = zt - 0.55;
    const [lo, hi] = s < 0 ? [-vb, -va] : [va, vb];
    parts.push(
      hull([
        ...ring3(rect(-HL + 0.05, lo, -HL + 0.05, hi), 0).map(([u, v]) => [u, v, zb]),
        [-HL + 0.05, lo, zt], [-HL + 0.05, hi, zt],
        [-HL - 0.1, lo, zb + 0.2], [-HL - 0.1, hi, zb + 0.2],
        [-HL - 0.1, lo, zt], [-HL - 0.1, hi, zt],
      ]),
    );
  }
}
// Nokstuk met jaartal 1909 en de obelisk erop.
const PED_LOW = 7.2;
const PED_TOP = 8.65;
parts.push(box(-HL, -0.45, PED_LOW, -HL + 0.9, 0.45, PED_TOP));
parts.push(
  hull([
    ...ring3(rect(-HL + 0.05, -0.4, -HL + 0.85, 0.4), PED_TOP - 0.01),
    [-HL + 0.45, 0, 9.65],
  ]),
);
// Twee spitsboogvensters (1,1 m, 1,95 tot 5,25 m) en het roosvenster (0,9 m op 5,8 m).
for (const c of [-1.1, 1.1]) cuts.push(alongU(pointedArch(c, 1.1, 1.95, 5.25), -HL - 1, -HL + 0.3));
cuts.push(alongU(oculus(0, 5.8, 0.45), -HL - 1, -HL + 0.25));

// ---------- zijgevels ----------
// Westelijke travee (1909): deur met spitsboogbovenlicht; de andere drie
// traveeën een spitsboogvenster (1,1 m, 2,0 tot 3,75 m). De achtergevel is blind.
const SIDE_W = 1.1;
for (const s of [-1, 1]) {
  const v0 = s < 0 ? -HB - 1 : HB - 0.3;
  const v1 = s < 0 ? -HB + 0.3 : HB + 1;
  for (let k = 0; k < 4; k++) {
    const u = -HL + BAY * (k + 0.5) + (k === 0 ? 0.35 : 0);
    if (k === 0) cuts.push(alongV(pointedArch(u, SIDE_W, 0, 3.7), v0, v1));
    else cuts.push(alongV(pointedArch(u, SIDE_W, 2.0, 3.75), v0, v1));
  }
}

const solid = union(parts).subtract(union(cuts));
const nodes = [["building:synagoge-zaal-dak-topgevel-en-obelisk", solid]];

await writeLandmark({
  slug,
  nodes,
  base: BASE,
  catalog: {
    name: "Synagoge van Emmen",
    origin: [256967.341, 533614.315],
    xAxis: [0.93441, 0.35617],
    groundOffsetMetres: -0.1,
    groundSamplePoints: [[-9.5, 0], [9.5, 0], [0, 4.8], [0, -4.8], [-6, 4.8], [6, -4.8]],
    groundHeight: 64.3,
    replacesBuildings: ["NL.IMBAG.Pand.0114100000232970"],
    description:
      "Oorsprong in het hart van BAG-pand 0114100000232970 op het maaiveld (NAP +22,45); +X langs de nok naar de blinde achtergevel (oost), de gepleisterde topgevel met spitsboogvensters, roosvenster, keperfries en obelisk staat op -X naar de Julianastraat. Hoogtes uit het AHN, gevels naar RCE-foto's.",
    realWorld: {
      groundNapM: GROUND_NAP,
      lengthM: 15.67,
      widthM: 6.8,
      ridgeNapM: 30.2,
      eaveHeightM: 4.86,
      roofPitchDeg: 40.4,
      obeliskTopM: 9.65,
      estimated: [
        "plinthoogte 1,80 m en vensterhoogtes uit verhoudingen op de RCE-foto's",
        "hoogte van nokstuk en obelisk (8,65 en 9,65 m)",
        "maten van hoekpilasters, kroonlijstkoppen en keperfries",
        "nissen 0,25 tot 0,3 m diep",
      ],
    },
    sources: [
      "https://monumentenregister.cultureelerfgoed.nl/monumenten/510950",
      "https://nl.wikipedia.org/wiki/Synagoge_(Emmen)",
      "PDOK BAG-pand 0114100000232970 en AHN DSM/DTM 0,5 m, bbox 256942,533590,256992,533640",
      "https://commons.wikimedia.org/wiki/File:Emmen-_Julianastraat_27.JPG",
      "https://commons.wikimedia.org/wiki/File:SynagogeEmmen.jpg",
      "https://commons.wikimedia.org/wiki/File:Voor-_en_zijgevel_-_Emmen_-_20069863_-_RCE.jpg",
      "https://commons.wikimedia.org/wiki/File:Zij-_en_achtergevel_-_Emmen_-_20069855_-_RCE.jpg",
    ],
  },
});
console.log("ondervlakken", JSON.stringify(downFaces(solid, BASE)));

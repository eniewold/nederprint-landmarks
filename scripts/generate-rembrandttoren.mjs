// Rembrandttoren (Amstelplein 1, Amsterdam; ZZDP Architecten met SOM, 1995):
// kantoortoren van 35 lagen met een vierkante schacht met dubbel verspringende
// hoeken, een ring van uitgebouwde blokken tot NAP +36,4 m op een kruisvormige
// plint, en een kroon van een colonnade, vier glazen hoekpaviljoens, een
// kruisvormig middenblok en de mast met de rail en giek van de
// gevelonderhoudsinstallatie. Vlakken en benoemde bouwdelen, geen gestapelde
// DSM-lagen. Voorbeeld per rij: generate-evoluon.mjs (aanpak primitieven) en
// generate-haagse-toren.mjs (skylinetoren op efteling-kit.mjs).
//
//   node scripts/generate-rembrandttoren.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong in het hart van de schacht op RD (122963,34,
// 484231,45), z = 0 op NAP -0,5 m (straat aan de noord- en oostzijde), Z
// omhoog. +X loopt langs de oostgevel-normaal op 20,1 graden in RD (BAG-gevels
// 20,10/110,10 graden), +Y naar het noordnoordwesten. De zuidgevel (-Y) is de
// entreezijde aan het Amstelplein (NAP +2,8 m), de westzijde ligt op NAP +1,9 m.
//
// Bronnen: BAG-pand 0363100012113758 (contour en plintvorm), AHN DSM/DTM 0,5 m
// (PDOK WCS, per 0,25 m in dit stelsel uitgelezen: schachtcontour, ring, kroon,
// mast), 3D BAG LoD2.2 (TU Delft/3D geoinformatie, CC BY 4.0: dakhoogtes
// 2,8/21,5/36,4/106,3/109,5/119,9/131,7 m), Actueel_orthoHR (kroon, paviljoens,
// rail en giek), Wikipedia (150 m met mast van 15 m) en Commons-foto's van alle
// kanten (gevelritme, colonnade, loggia's, mastgeleding).
import { Manifold, CrossSection, box, prism, union, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "rembrandttoren";
const ORIGIN = [122963.34, 484231.45];
const AXIS_DEG = 20.1;
const X_AXIS = [+Math.cos((AXIS_DEG * Math.PI) / 180).toFixed(5), +Math.sin((AXIS_DEG * Math.PI) / 180).toFixed(5)];
const GROUND_NAP = -0.5;
const BASE = -1.2;
const z = (nap) => nap - GROUND_NAP;

// ---------- hoogtes (NAP, AHN-DSM en 3D BAG) ----------
const H = {
  deck: 2.8, // dek van het Amstelplein en de noordhoeken van het pand
  podium: 21.5, // kruisvormige plint
  ring: 36.4, // ring van uitgebouwde blokken om de schacht
  terrace: 106.3, // vloer van de colonnade op de schacht
  frame: 109.5, // bovenkant colonnade en balken
  pavilion: 119.9, // daken van de vier glazen hoekpaviljoens
  crown: 131.7, // dak van het kruisvormige middenblok
  track: 133.2, // ronde rail van de gevelonderhoudsinstallatie (AHN 133-134)
  jib: 135.8, // giek van die installatie (AHN 134-136,5)
  crane: 121.5, // davits op de paviljoens (3D BAG 120,8-121,6)
  mastBase: 140.3, // witte voet van de mast (AHN 139-142 binnen r 1,5 m)
  mastMid: 143.6, // geringd middenstuk
  mastTop: 149.4, // top: AHN 149, Wikipedia 150 m boven straat
};

// ---------- plattegrond (m, gebouwstelsel) ----------
// Schacht 33,2 m in het vierkant; elke hoek springt twee keer 2 m terug
// (AHN: volle breedte tot |y| 12,6, dan ±14,6 tot |y| 14,6, dan ±12,6).
const SHAFT = { half: 16.6, step: 14.6, inner: 12.6 };
// Ring van uitbouwen tot NAP +36,4 m, ±19,3 m met ingesprongen hoeken (BAG-
// zigzag 14,5/14,7) en een sleuf van 5,4 m midden in elke gevel tot op de plint.
const RING = { half: 19.3, notch: 14.6, slot: 2.7 };
// Plintvleugels (BAG-contour): halve breedte 12,8 m, koppen op de BAG-gevels.
const WING = { half: 12.8, W: -24.09, E: 24.03, S: -23.81, N: 24.25 };
// Kroon: colonnade 1,0 m breed langs de gevel, glazen paviljoens in de vier
// hoeken (ortho en 3D BAG: 3,4 tot 14,6 m uit het hart), middenkruis met armen
// van 11,6 m breed tot 10,6 m uit het hart.
const FRAME = { width: 1.0 };
const PAV = { inner: 3.4, outer: 14.6 };
const CROSS = { reach: 10.6, half: 5.8 };
// Mast (foto's: witte voet met ringen, smaller middenstuk, naald); de naald is
// 1,2 m dik, dus printbaar op 1:1000 zonder verdikking.
const MAST = { base: 1.9, mid: 1.1, needle: 0.6, tip: 0.45 };
const TRACK = { r0: 4.95, r1: 5.85 };
const JIB = { x0: -9.5, x1: 10.2, half: 0.6 };
// Gevelritme (foto's, frontaal op de zuidgevel): 14 vensters per gevel op
// 1,8 m, 21 kantoorlagen tussen de ring en de colonnade.
const BAY = 1.8;
const FLOOR = (H.terrace - H.ring) / 21;
const NICHE = 0.35;

// ---------- hulpfuncties ----------
const rot4 = (m) => union([0, 90, 180, 270].map((a) => (a ? m.rotate([0, 0, a]) : m)));
const square = (h) => [[-h, -h], [h, -h], [h, h], [-h, h]];
// Schachtcontour met de dubbel verspringende hoeken (tegen de klok in).
const shaftOutline = (() => {
  const { half: a, step: b, inner: c } = SHAFT;
  const q = [[a, -c], [a, c], [b, c], [b, b], [c, b], [c, a]];
  const pts = [];
  for (let k = 0; k < 4; k++) {
    const r = (k * Math.PI) / 2;
    for (const [x, y] of q) pts.push([x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]);
  }
  return pts;
})();
const ringOutline = (() => {
  const { half: a, notch: b } = RING;
  return [[a, -b], [a, b], [b, b], [b, a], [-b, a], [-b, b], [-a, b], [-a, -b], [-b, -b], [-b, -a], [b, -a], [b, -b]];
})();
// Blinde nis in een gevel: vlak door `o` met buitennormaal `n`; `t` langs de
// gevel (n 90 graden linksom gedraaid), breedte w, hoogte z0..z1 (NAP).
// `out` is hoe ver de snijdoos buiten de gevel steekt (klein waar er iets
// voor de gevel staat, zoals de schotten van de colonnade).
const niche = (o, n, t, w, nap0, nap1, depth = NICHE, out = 1.2) =>
  box(-depth, t - w / 2, z(nap0), out, t + w / 2, z(nap1))
    .rotate([0, 0, (Math.atan2(n[1], n[0]) * 180) / Math.PI])
    .translate([o[0], o[1], 0]);
// Zuidgevel-normaal en de tangens: n = (0,-1) geeft t langs +x.
const S = [0, -1];
const E = [1, 0];
const N = [0, 1];
const W = [-1, 0];
const windowsT = (from, to) => {
  const out = [];
  for (let t = -11.7; t <= 11.71; t += BAY) if (Math.abs(t) >= from - 1e-6 && Math.abs(t) <= to + 1e-6) out.push(+t.toFixed(2));
  return out;
};

const parts = [];
const cuts = [];

// ---------- plint ----------
// Noordhoeken: dek op NAP +2,8 m (zelfde hoogte als het plein aan de zuidzijde).
parts.push(prism([[WING.W, WING.half], [-WING.half, WING.half], [-WING.half, WING.N], [WING.W, WING.N]], BASE, z(H.deck)));
parts.push(prism([[WING.half, WING.half], [WING.E, WING.half], [WING.E, WING.N], [WING.half, WING.N]], BASE, z(H.deck)));
// Vier vleugels tot NAP +21,5 m (kruis).
parts.push(box(WING.W, -WING.half, BASE, WING.E, WING.half, z(H.podium)));
parts.push(box(-WING.half, WING.S, BASE, WING.half, WING.N, z(H.podium)));

// ---------- ring van uitbouwen ----------
const ringSolid = prism(ringOutline, BASE, z(H.ring)).subtract(
  rot4(box(-RING.slot, -RING.half - 1, z(H.podium), RING.slot, -SHAFT.half + 0.01, z(H.ring) + 1)),
);
parts.push(ringSolid);

// ---------- schacht ----------
parts.push(prism(shaftOutline, BASE, z(H.terrace)));

// ---------- kroon ----------
// Colonnade: 1 m brede rand langs de hele contour tot NAP +109,5 m, met
// schotten (de balken van de pergola) op 3,6 m tussen rand en paviljoen of
// middenkruis; daartussen open putten tot op het terras.
const inner = new CrossSection([shaftOutline]).offset(-FRAME.width, "Miter").toPolygons()[0];
parts.push(prism(shaftOutline, z(H.terrace) - 0.01, z(H.frame)).subtract(prism(inner, z(H.terrace) - 0.1, z(H.frame) + 1)));
const fins = [];
for (const t of [-12.6, -9.0, -5.4, -1.8, 1.8, 5.4, 9.0, 12.6]) fins.push(box(t - 0.45, -SHAFT.half + 0.2, z(H.terrace) - 0.01, t + 0.45, -CROSS.reach + 0.2, z(H.frame)));
parts.push(rot4(union(fins)).intersect(prism(shaftOutline, BASE, z(H.frame) + 1)));
// Vier glazen hoekpaviljoens.
parts.push(rot4(box(PAV.inner, -PAV.outer, z(H.terrace) - 0.01, PAV.outer, -PAV.inner, z(H.pavilion))));
// Middenkruis.
parts.push(box(-CROSS.reach, -CROSS.half, z(H.terrace) - 0.01, CROSS.reach, CROSS.half, z(H.crown)));
parts.push(box(-CROSS.half, -CROSS.reach, z(H.terrace) - 0.01, CROSS.half, CROSS.reach, z(H.crown)));
// Davits van de gevelonderhoudsinstallatie op elk paviljoen: radiale arm met
// dwarsstuk (ortho), 1,6 m hoog.
{
  const c = (PAV.inner + PAV.outer) / 2;
  const arm = box(-4.25, -0.7, z(H.pavilion) - 0.01, 4.25, 0.7, z(H.crane)).rotate([0, 0, -45]).translate([c, -c, 0]);
  const bar = box(-0.45, -2.0, z(H.pavilion) - 0.01, 0.45, 2.0, z(H.crane) - 0.3).rotate([0, 0, -45]).translate([c + 1.2, -c - 1.2, 0]);
  parts.push(rot4(union([arm, bar])));
}
// Ronde rail en giek van de gevelonderhoudsinstallatie (ortho: rail 11 m,
// giek langs de oost-westarm; AHN 133-136 m).
parts.push(
  Manifold.cylinder(z(H.track) - z(H.crown) + 0.01, TRACK.r1, TRACK.r1, 96)
    .subtract(Manifold.cylinder(z(H.track) - z(H.crown) + 1, TRACK.r0, TRACK.r0, 96).translate([0, 0, -0.5]))
    .translate([0, 0, z(H.crown) - 0.01]),
);
parts.push(box(JIB.x0, -JIB.half, z(H.crown) - 0.01, JIB.x1, JIB.half, z(H.jib)));
// Mast: witte voet met twee ringgroeven, kegel naar het geringde middenstuk,
// kegel naar de naald.
{
  const prof = [
    [0, z(H.crown) - 0.01],
    [MAST.base, z(H.crown) - 0.01],
    [MAST.base, z(H.mastBase)],
    [MAST.mid, z(H.mastBase) + 0.8],
    [MAST.mid, z(H.mastMid)],
    [MAST.needle, z(H.mastMid) + 0.5],
    [MAST.needle, z(H.mastTop) - 0.4],
    [MAST.tip, z(H.mastTop)],
    [0, z(H.mastTop)],
  ];
  const mast = Manifold.revolve(new CrossSection([prof]), 48);
  parts.push(mast);
  for (const nap of [138.0, 139.2]) {
    cuts.push(
      Manifold.cylinder(0.4, MAST.base + 1, MAST.base + 1, 48)
        .subtract(Manifold.cylinder(0.6, MAST.base - 0.3, MAST.base - 0.3, 48).translate([0, 0, -0.1]))
        .translate([0, 0, z(nap)]),
    );
  }
}

// ---------- gevelreliëf (per kwart, daarna vier keer gedraaid) ----------
const q = []; // nissen van één kwart: zuidgevel en zuidoosthoek
// Schacht, hoofdgevel: 14 vensters x 21 lagen boven de ring.
for (let k = 0; k < 21; k++) {
  const f = H.ring + FLOOR * k;
  for (const t of windowsT(0, 12)) q.push(niche([0, -SHAFT.half], S, t, 1.0, f + 0.9, f + 2.8));
}
// Schacht in de sleuf van de ring: de gevel loopt door tot op de plint.
for (let j = 1; j <= 4; j++) {
  const f = H.ring - FLOOR * j;
  for (const t of [-0.9, 0.9]) q.push(niche([0, -SHAFT.half], S, t, 1.0, f + 0.9, f + 2.8));
}
// Verspringende hoek (zuidoost): vier gevels van 2 m met glasstroken per laag.
{
  const { half: a, step: b, inner: c } = SHAFT;
  const corner = [
    [[c, -(a + b) / 2], E],
    [[(c + b) / 2, -b], S],
    [[b, -(b + c) / 2], E],
    [[(b + a) / 2, -c], S],
  ];
  for (const [p, n] of corner) for (let k = 0; k < 21; k++) {
    const f = H.ring + FLOOR * k;
    q.push(niche(p, n, 0, 1.3, f + 0.6, f + 2.9, 0.3));
  }
}
// Colonnade: blinde loggia's van 2,7 m tussen de posten (op 3,6 m).
for (const t of [-10.8, -7.2, -3.6, 0, 3.6, 7.2, 10.8]) q.push(niche([0, -SHAFT.half], S, t, 2.7, H.terrace + 0.2, H.frame - 0.85, 0.35));
// Ring: vensters op 1,8 m naast de sleuf, drie lagen, en een loggiarij.
for (let j = 2; j <= 4; j++) {
  const f = H.ring - FLOOR * j;
  for (const t of [4.5, 6.3, 8.1, 9.9, 11.7, 13.5]) for (const s of [-1, 1]) q.push(niche([0, -RING.half], S, s * t, 1.0, f + 0.9, f + 2.8));
}
for (const t of [5.4, 9.0, 12.6]) for (const s of [-1, 1]) q.push(niche([0, -RING.half], S, s * t, 2.6, H.ring - FLOOR + 0.35, H.ring - 0.5, 0.4));
// Ingesprongen hoek van de ring (zuidoost): twee gevels van 4,7 m.
{
  const m = (RING.half + RING.notch) / 2;
  for (const [p, n] of [[[RING.notch, -m], E], [[m, -RING.notch], S]]) {
    for (let j = 2; j <= 4; j++) {
      const f = H.ring - FLOOR * j;
      for (const t of [-1.1, 1.1]) q.push(niche(p, n, t, 1.0, f + 0.9, f + 2.8));
    }
    q.push(niche(p, n, 0, 2.6, H.ring - FLOOR + 0.35, H.ring - 0.5, 0.4));
  }
}
// Middenkruis, kopgevel van de zuidarm en de zijgevels boven de paviljoens.
for (let k = 0; k < 7; k++) {
  const f = H.terrace + 0.9 + 3.43 * k;
  const top = k === 6 ? f + 2.5 : f + 1.9;
  // Naast de put staan de paviljoens tegen de kopgevel; daar pas boven hun dak.
  for (const t of [-4.5, -2.7, -0.9, 0.9, 2.7, 4.5]) if (Math.abs(t) < PAV.inner || f > H.pavilion) q.push(niche([0, -CROSS.reach], S, t, 0.8, f, top, NICHE, 0.02));
  if (f > H.pavilion) {
    q.push(niche([CROSS.half, 0], E, -7.3, 1.0, f, top), niche([CROSS.half, 0], E, -9.1, 1.0, f, top));
    q.push(niche([-CROSS.half, 0], W, 7.3, 1.0, f, top), niche([-CROSS.half, 0], W, 9.1, 1.0, f, top));
  }
}
// Paviljoen (zuidoost): glasvakken per laag met stijlen van 0,5 m.
for (let k = 0; k < 4; k++) {
  const f = H.terrace + 3.4 * k;
  // De onderste laag staat achter de colonnade en blijft dicht.
  if (k > 0) for (const t of [5.3, 9.0, 12.7]) {
    q.push(niche([0, -PAV.outer], S, t, 3.2, f + 0.3, f + 3.1, 0.3));
    q.push(niche([PAV.outer, 0], E, -t, 3.2, f + 0.3, f + 3.1, 0.3));
  }
  // Binnengevels aan de putten tussen de paviljoens.
  q.push(niche([PAV.inner, 0], W, 12.6, 3.0, f + 0.3, f + 3.1, 0.3, 0.02));
  q.push(niche([0, -PAV.inner], N, -12.6, 3.0, f + 0.3, f + 3.1, 0.3, 0.02));
}
cuts.push(rot4(union(q)));

// Plint: vensters per vleugel (koppen verschillen iets, dus niet gedraaid).
const podiumRows = [8.1, 11.7, 15.3, 18.9];
const wingFaces = [
  { o: [0, WING.S], n: S },
  { o: [WING.E, 0], n: E },
  { o: [0, WING.N], n: N },
  { o: [WING.W, 0], n: W },
];
for (const { o, n } of wingFaces) {
  for (const t of windowsT(0, 12)) {
    for (const r of podiumRows) cuts.push(niche(o, n, t, 1.2, r, r + 1.9));
    // Begane grond: op het plein (zuid) entree tussen stenen penanten.
    if (n === S) cuts.push(niche(o, n, t, Math.abs(t) < 9 ? 1.4 : 1.2, H.deck + 0.3, H.deck + 3.9, 0.4));
    else if (n === W) cuts.push(niche(o, n, t, 1.2, 3.1, 6.2));
  }
}
// Zijgevels van de vleugels voorbij de ring, en de hoekstukken van de ring
// die tot het maaiveld lopen (BAG-zigzag).
for (const s of [-1, 1]) {
  for (const r of podiumRows) {
    for (const t of [20.6, 22.4]) {
      cuts.push(niche([s * WING.half, 0], [s, 0], s * -t, 1.0, r, r + 1.9)); // zuidvleugel
      cuts.push(niche([s * WING.half, 0], [s, 0], s * t, 1.0, r, r + 1.9)); // noordvleugel
      cuts.push(niche([0, s * WING.half], [0, s], -s * -t, 1.0, r, r + 1.9)); // westvleugel
      cuts.push(niche([0, s * WING.half], [0, s], -s * t, 1.0, r, r + 1.9)); // oostvleugel
    }

  }
}

// Hoekstukken van de ring die tot het maaiveld (zuid) of het dek (noord)
// lopen: de BAG-zigzag. Vensters in de plintlagen op beide gevels.
{
  const m = (RING.half + RING.notch) / 2;
  const faces = [
    [[RING.notch, 0], E, -m], [[-RING.notch, 0], W, m], [[0, -RING.notch], S, m], [[0, -RING.notch], S, -m],
    [[RING.notch, 0], E, m], [[-RING.notch, 0], W, -m], [[0, RING.notch], N, -m], [[0, RING.notch], N, m],
  ];
  for (const [p, n, t] of faces) for (const r of podiumRows) cuts.push(niche(p, n, t, 1.0, r, r + 1.9));
}
// Begane grond aan de straat (noord en oost, NAP -0,5 m).
for (const { o, n } of wingFaces) if (n === N || n === E) for (const t of windowsT(0, 12)) cuts.push(niche(o, n, t, 1.2, 0.6, 3.6));

let model = union(parts).subtract(union(cuts));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 2);
console.log("ondervlakken > 2 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Rembrandttoren met plint ring colonnade paviljoens middenkruis en mast", model]],
  catalog: {
    name: "Rembrandttoren",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Straat aan de oost- en noordzijde (AHN-DTM NAP -0,5 tot -0,6 m); het
    // plein aan de zuidzijde ligt 3,3 m hoger en bedekt de voet daar.
    groundSamplePoints: [[27, -8], [27, 8], [12, 29], [20, 29]],
    replacesBuildings: ["NL.IMBAG.Pand.0363100012113758"],
    description:
      "Oorsprong in het hart van de schacht op straatniveau NAP -0,5 m, +X langs de oostgevel-normaal (20,1 graden in RD), +Y naar het noordnoordwesten; kruisvormige plint tot NAP +21,5 m, ring van uitbouwen tot +36,4 m met middensleuven, vierkante schacht met dubbel verspringende hoeken tot +106,3 m, colonnade tot +109,5 m, vier glazen hoekpaviljoens tot +119,9 m, kruisvormig middenblok tot +131,7 m met rail, giek en mast tot +149,4 m; gevelritme en mastgeleding uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      plazaNapM: H.deck,
      podiumNapM: H.podium,
      ringNapM: H.ring,
      terraceNapM: H.terrace,
      colonnadeNapM: H.frame,
      pavilionNapM: H.pavilion,
      crownNapM: H.crown,
      mastTopNapM: H.mastTop,
      shaftWidthM: 2 * SHAFT.half,
      footprintM: [+(WING.E - WING.W).toFixed(2), +(WING.N - WING.S).toFixed(2)],
      storeyPitchM: +FLOOR.toFixed(3),
      axisDegrees: AXIS_DEG,
      estimates: [
        "vensterritme 1,8 m, 21 kantoorlagen boven de ring en de vensterhoogtes uit frontale foto's",
        "mastdiameters (voet 3,8 m, middenstuk 2,2 m, naald 1,2 m) en hoogtes van de geledingen uit foto's met de AHN-top als maat",
        "plintvensters en entree uit foto's; plinthoogte, ring, kroon en paviljoens uit AHN/3D BAG",
        "pergolabalken van de colonnade als schotten van 0,9 m tot op het terras",
      ],
    },
    sources: [
      "PDOK BAG pand 0363100012113758, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 2026-10-11",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012113758 (3D BAG, TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes",
      "https://nl.wikipedia.org/wiki/Rembrandttoren",
      "https://commons.wikimedia.org/wiki/File:Rembrandt_toren_vanuit_het_noordwesten.jpg",
      "https://commons.wikimedia.org/wiki/File:Rembrandttoren_in_2021.jpg",
      "https://commons.wikimedia.org/wiki/File:Rembrandttoren_in_2019_(1).jpg",
      "https://commons.wikimedia.org/wiki/File:Rembrandt_Toren_in_2016.jpg",
      "https://commons.wikimedia.org/wiki/File:Rembrandttoren3.jpg",
    ],
  },
});

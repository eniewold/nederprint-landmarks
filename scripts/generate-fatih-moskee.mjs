// Genereert een gesloten 3D-model van de Fatih-moskee aan de Rozengracht in
// Amsterdam (de voormalige rooms-katholieke Sint-Ignatiuskerk, De Zaaier, H.W.
// Valk, 1929) uit dakvlakken en bouwdelen: een basilicaal schip onder één steil
// zadeldak (nok +20,8 m, 57,6 graden) met een lichtbeuk en twee lage zijbeuken
// onder lessenaarsdaken (39 graden), het front aan de Rozengracht met twee
// vierkante torens (klokkenverdieping met vijf galmgaten per zijde, goot op een
// kraag, steile vierzijdige spits met een dakkapel per zijde en een makelaar
// met halve maan tot circa +39,6 m) en daartussen een topgevel met het
// roosvenster, een arcade van vier vensters en drie ingangsbogen; achterin een
// gedrongen vierkante koortoren over de hele breedte van het schip met kantelen
// en een tentdak tot +27,0 m, twee lage vleugels aan de Bloemstraat onder een
// dwars zadeldak en platte aanbouwen. Er is geen koepel: boven het koor staat
// deze vierkante toren met tentdak (luchtfoto, 3D BAG, foto's van de
// Bloemstraat). De voormalige pastorie (Rozengracht 150, hetzelfde BAG-pand)
// is een tweede onderdeel: een huis met schilddak en dakkapel aan de straat,
// een plat dak met trappenhuis erachter en een achtervleugel met zadeldak.
// Elk dak is een vlak z = a u + b v + c uit het AHN en de LoD2.2-vlakken van de
// 3D BAG; torens en koortoren volgen het AHN en de foto's. Het Mapbox-model is
// niet gebruikt. Alle maten in het script zijn meters op ware grootte.
// Uitvoer: een GLB in meters (Y omhoog, een node per onderdeel met de
// materiaalklasse in de nodenaam) als catalogusbron voor de export en de kaart,
// plus een binaire STL in millimeters op 1:<schaal>.
//
//   node scripts/generate-fatih-moskee.mjs              # 1:1000 (standaard)
//   node scripts/generate-fatih-moskee.mjs --scale 2000
//
// Assenstelsel: oorsprong op RD (120370,99, 487361,78), het midden van de
// voorgevel aan de Rozengracht op de as van het schip, op het maaiveld (NAP
// +0,6 m), Z omhoog. +X loopt van de voorgevel naar de Bloemstraat (111,1
// graden linksom vanaf de RD-X-as, uit de normalen van de LoD2.2-dakvlakken
// van het schip en de BAG-gevels) en +Y loodrecht daarop naar het
// westzuidwesten (de kant van de pastorie). De torens staan op y = ±7,47 m,
// de koortoren op x = 39 tot 48,9 m.
//
// Bronnen: PDOK BAG-pand 0363100012167944 (kerk en pastorie samen); AHN
// DSM/DTM 0,5 m (PDOK WCS) voor nokken, goten, torens en het maaiveld; 3D BAG
// LoD2.2 (api.3dbag.nl) voor hellingen en richting; Wikipedia (dubbeltorenfront
// van 40 m); PDOK luchtfoto; foto's op Wikimedia Commons van de Rozengracht en
// de Bloemstraat. Geschat zijn de geledingen van de torens (band onder de
// klokkenverdieping, galmgaten, nis, vensters), de breedte van de torenromp
// boven de BAG-voet, de dakkapellen op de spitsen, de makelaars, de
// gevelhoogtes van de topgevel (45 graden, top +21,6 m), het roosvenster en de
// vensternissen, de kantelen van de koortoren, de dakkapel van de pastorie en
// de vensters in de lichtbeuk. Weggelaten: de halve manen en bollen op de
// makelaars (kleiner dan 0,9 m), dakgoten, luifels en reclame aan de
// winkelpuien, schoorsteentjes op de pastorie, maaswerk en de stenen banden
// in de gevels.
import Module from "manifold-3d";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};
const scale = Number(flag("--scale", "1000"));
const outDir = path.join(path.resolve(flag("--out", path.join(import.meta.dirname, "../models"))), "fatih-moskee");
const mmPerMetre = 1000 / scale;

const wasm = await Module();
wasm.setup();
const { Manifold, CrossSection } = wasm;
wasm.setCircularSegments(48);

// ---------- hulpfuncties (meters) ----------
const ccw = (pts) => {
  let area = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    area += x0 * y1 - x1 * y0;
  });
  return area > 0 ? pts : [...pts].reverse();
};
const prism = (pts, z0, z1) => Manifold.extrude(new CrossSection([ccw(pts)]), z1 - z0).translate([0, 0, z0]);
// Veelhoek met punten [y, z] uitgetrokken langs X van x0 tot x1.
const profileX = (pts, x0, x1) =>
  Manifold.extrude(new CrossSection([ccw(pts)]), x1 - x0).transform([0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, x0, 0, 0, 1]);
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// Dakvlak z = a u + b v + c: het deel van het prisma eronder blijft over.
const cutBelow = (solid, [a, b, c]) => {
  const n = Math.hypot(a, b, 1);
  return solid.trimByPlane([a / n, b / n, -1 / n], -c / n);
};
// Bouwdeel: veelhoek in plan van de onderkant tot aan de dakvlakken (het laagste vlak telt).
const roofed = (pts, planes, z0 = BASE) => planes.reduce((s, p) => cutBelow(s, p), prism(pts, z0, 100));
// Nok langs v op u = u0 met helling t (twee vlakken) en nok langs u op v = v0.
const ridgeU = (u0, z, t) => [[-t, 0, z + t * u0], [t, 0, z - t * u0]];
const ridgeV = (v0, z, t) => [[0, -t, z + t * v0], [0, t, z - t * v0]];
const sq = ([cx, cy], h) => [[cx - h, cy - h], [cx + h, cy - h], [cx + h, cy + h], [cx - h, cy + h]];
const tip = ([cx, cy]) => [[cx, cy]];
// Geleding: de convexe huls van opeenvolgende doorsneden [z, veelhoek]; verspringingen en spitsen.
const loft = (sections) =>
  Manifold.union(
    sections.slice(1).map(([z1, p1], i) => {
      const [z0, p0] = sections[i];
      return Manifold.hull([...p0.map(([x, y]) => [x, y, z0]), ...p1.map(([x, y]) => [x, y, z1])]);
    }),
  );
// Spitsboogvormige vensternis (breedte w, van z0 tot z1 en dan een punt van 58 graden) in een gevel
// met de normaal naar 'angle' (graden, 0 = +x) op afstand a van het midden [cx, cy]; s schuift langs de gevel.
const niche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.35) =>
  profileX(
    [[s - w / 2, z0], [s + w / 2, z0], [s + w / 2, z1], [s, z1 + 1.6 * (w / 2)], [s - w / 2, z1]],
    a - d,
    a + 0.4,
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Rechthoekige nis (venster, winkelpui) met een plafond onder 48 graden: diepte d, opening van z0 tot z1.
const rectNiche = ([cx, cy], angle, a, s, w, z0, z1, d = 0.35) =>
  Manifold.hull(
    [
      [a + 0.4, z0, z1],
      [a, z0, z1],
      [a - d, z0, z1 - 1.1 * d],
    ].flatMap(([x, lo, hi]) => [
      [x, s - w / 2, lo],
      [x, s + w / 2, lo],
      [x, s - w / 2, hi],
      [x, s + w / 2, hi],
    ]),
  )
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
// Ronde nis (roosvenster) met een trechter van 48 graden: straal r aan de gevel, r - 1,15 d achterin.
const roundNiche = ([cx, cy], angle, a, zc, r, d = 0.35) => {
  const ring = (x, rr) =>
    Array.from({ length: 32 }, (_, k) => {
      const t = (k * Math.PI) / 16;
      return [x, rr * Math.cos(t), zc + rr * Math.sin(t)];
    });
  return Manifold.hull([...ring(a + 0.4, r), ...ring(a, r), ...ring(a - d, r - 1.15 * d)])
    .rotate([0, 0, angle])
    .translate([cx, cy, 0]);
};

const SLUG = "fatih-moskee";

// ---------- maten (lokaal stelsel, z = hoogte boven het maaiveld op NAP +0,6 m) ----------
const GROUND_NAP = 0.6;
const ORIGIN = [120370.99, 487361.78];
const X_AXIS = [-0.359972, 0.932965]; // RD-richting 111,1 graden: van de voorgevel aan de Rozengracht naar de Bloemstraat
const BASE = -0.5;

// Schip: één zadeldak over de hele lengte (3D BAG: 57,6 graden, nok NAP +21,42 m), lichtbeuk tot de goot.
const T = 1.574;
const RIDGE = 20.82;
const HW = 5.9; // halve breedte van het schip tot de goot
const NAVE_X1 = 41.5; // het schip loopt door tot in het tentdak van de koortoren
// Zijbeuken: lessenaarsdaken van +9,1 m aan de lichtbeuk naar de buitenmuur (oost +5,3 m, west +3,9 m).
const AISLE_TOP = 9.1;
const EAST_AISLE = [0, 0.82, AISLE_TOP + 0.82 * HW]; // z = 0,82 y + 13,94 (y negatief)
const WEST_AISLE = [0, -0.829, AISLE_TOP + 0.829 * HW]; // z = -0,829 y + 13,99
const EAST_WALL = -10.52;
const WEST_WALL = 12.2;
// Torens: romp 6,2 m breed (BAG-voet) en 7,4 m diep, goot op +27,9 m, spits tot +37,0 m, makelaar tot +39,6 m.
const TOWER_Y = 7.47;
const TOWER_HALF = 3.1;
const TOWER_X1 = 7.4;
const TOWER_CX = TOWER_X1 / 2;
const TOWER_EAVE = 27.9;
const TOWER_OVER = 0.5;
const TOWER_APEX = 37.0;
const TOWERS = [-TOWER_Y, TOWER_Y];
// Topgevel tussen de torens: 45 graden, top +21,6 m, schouders +17,2 m tegen de torens.
const GABLE_TOP = 21.6;
// Achtergevel aan de Bloemstraat: BAG-hoeken x 48,52 (y -16,76) en 49,09 (y 12,10), iets scheef.
const rearX = (y) => 48.52 + (y + 16.76) * (0.57 / 28.86);
const REAR_ANG = (-Math.atan2(0.57, 28.86) * 180) / Math.PI; // normaal van de achtergevel
// Koortoren: over de breedte van het schip, muren tot +17,3 m, kantelen tot +18,6 m, tentdak tot +27,0 m.
const CT = { x0: 39.0, half: 5.3, wall: 17.3, merlon: 18.6, apex: 27.0, apexX: 43.9, base: [39.6, 48.2], baseHalf: 4.7 };
// Vleugels aan de Bloemstraat: dwars zadeldak, nok op x = 44,1 m (+13,45 m), 51 graden.
const WING_RIDGE = [44.1, 13.45, 1.25];

// Maaiveld op de Rozengracht voor het front en in de Bloemstraat achter de koortoren.
const GROUND_SAMPLES = [[-4, 0], [-4, -9], [-4, 9], [51.5, -5], [51.5, 8]];

// ---------- kerk ----------
const solids = [];

// Schip met lichtbeuk.
solids.push(roofed(rect(0, NAVE_X1, -HW, HW), ridgeV(0, RIDGE, T)));
// Zijbeuken achter de torens; de westbeuk volgt de BAG-grens langs de pastorie en de binnenplaats.
solids.push(roofed(rect(TOWER_X1, 39.0, EAST_WALL, -HW + 0.05), [EAST_AISLE]));
solids.push(
  roofed(
    [[TOWER_X1, HW - 0.05], [41.0, HW - 0.05], [41.0, WEST_WALL], [21.4, WEST_WALL], [21.4, 11.1], [14.3, 11.1], [14.3, 10.57], [TOWER_X1, 10.57]],
    [WEST_AISLE],
  ),
);
// Platte aanbouwen naast de koortoren (oost +6,3 m, west +8,36 m).
solids.push(prism(rect(34.2, 38.8, -16.76, -9.6), BASE, 6.3));
solids.push(prism(rect(37.2, 41.1, 6.9, 12.1), BASE, 8.36));
// Vleugels aan de Bloemstraat onder een dwars zadeldak, met topgevels op de kopse kanten.
const wing = (y0, y1, x0) => roofed([[x0, y0], [rearX(y0), y0], [rearX(y1), y1], [x0, y1]], ridgeU(...WING_RIDGE));
solids.push(wing(-16.76, -CT.half + 0.05, 38.7));
solids.push(wing(CT.half - 0.05, 12.1, 41.0));

// Koortoren: romp, borstwering voor en achter, kantelen op de zijmuren en het tentdak.
const ctPoly = [[CT.x0, -CT.half], [rearX(-CT.half), -CT.half], [rearX(CT.half), CT.half], [CT.x0, CT.half]];
solids.push(prism(ctPoly, BASE, CT.wall));
solids.push(prism(rect(CT.x0, CT.x0 + 0.6, -CT.half, CT.half), CT.wall - 0.1, CT.wall + 0.6));
solids.push(prism([[rearX(-CT.half) - 0.6, -CT.half], [rearX(-CT.half), -CT.half], [rearX(CT.half), CT.half], [rearX(CT.half) - 0.6, CT.half]], CT.wall - 0.1, CT.wall + 0.6));
for (const s of [-1, 1]) {
  for (const x of [40.0, 42.0, 44.0, 46.0, 48.0]) solids.push(prism(rect(x - 0.5, x + 0.5, s * (CT.half - 0.6), s * CT.half), CT.wall - 0.1, CT.merlon));
}
solids.push(
  Manifold.hull([
    ...rect(CT.base[0], CT.base[1], -CT.baseHalf, CT.baseHalf).map(([x, y]) => [x, y, CT.wall - 0.1]),
    [CT.apexX, 0, CT.apex],
  ]),
);

// Torens: romp, band onder de klokkenverdieping, goot op een kraag, spits met vier dakkapellen en een makelaar.
const towerRect = (cy, grow) => rect(-grow, TOWER_X1 + grow, cy - TOWER_HALF - grow, cy + TOWER_HALF + grow);
const towerDormer = (cy, phi, a) =>
  roofed(rect(a - 2.6, a - 0.3, -0.7, 0.7), ridgeV(0, 30.0, 1.14), TOWER_EAVE + 0.1)
    .rotate([0, 0, phi])
    .translate([TOWER_CX, cy, 0]);
for (const cy of TOWERS) {
  solids.push(prism(towerRect(cy, 0), BASE, TOWER_EAVE - 1.1 * TOWER_OVER));
  // Band op +23,6 tot +24,0 m op een kraag van 48 graden.
  solids.push(Manifold.hull([...towerRect(cy, 0).map(([x, y]) => [x, y, 23.32]), ...towerRect(cy, 0.25).map(([x, y]) => [x, y, 23.6])]));
  solids.push(prism(towerRect(cy, 0.25), 23.6, 24.0));
  // Goot: kraag van 48 graden en een gootlijst van 0,3 m.
  solids.push(Manifold.hull([...towerRect(cy, 0).map(([x, y]) => [x, y, TOWER_EAVE - 1.1 * TOWER_OVER]), ...towerRect(cy, TOWER_OVER).map(([x, y]) => [x, y, TOWER_EAVE])]));
  solids.push(prism(towerRect(cy, TOWER_OVER), TOWER_EAVE, TOWER_EAVE + 0.3));
  // Vierzijdige spits vanaf de goot.
  solids.push(Manifold.hull([...towerRect(cy, TOWER_OVER).map(([x, y]) => [x, y, TOWER_EAVE + 0.3]), [TOWER_CX, cy, TOWER_APEX]]));
  // Een dakkapel met topgeveltje midden op elke zijde van de spits.
  for (const [phi, a] of [[0, TOWER_CX + TOWER_OVER], [180, TOWER_CX + TOWER_OVER], [90, TOWER_HALF + TOWER_OVER], [270, TOWER_HALF + TOWER_OVER]]) {
    solids.push(towerDormer(cy, phi, a));
  }
  // Makelaar met een bol (de halve maan erop is kleiner dan 0,9 m).
  solids.push(
    loft([
      [35.5, sq([TOWER_CX, cy], 0.45)],
      [38.2, sq([TOWER_CX, cy], 0.45)],
      [38.7, sq([TOWER_CX, cy], 0.6)],
      [39.0, sq([TOWER_CX, cy], 0.45)],
      [39.6, tip([TOWER_CX, cy])],
    ]),
  );
}
// Topgevel tussen de torens (1 m dik) met een pinakel op de top.
solids.push(roofed(rect(0, 1.0, -TOWER_Y + TOWER_HALF + 0.03, TOWER_Y - TOWER_HALF - 0.03), ridgeV(0, GABLE_TOP, 1.0)));
solids.push(loft([[GABLE_TOP - 0.6, sq([0.5, 0], 0.5)], [GABLE_TOP + 0.8, sq([0.5, 0], 0.5)], [GABLE_TOP + 1.8, tip([0.5, 0])]]));

const churchMass = Manifold.union(solids);
let church = churchMass;

// Nissen: ingangen, arcade en roosvenster in het front, vensters en galmgaten in de torens,
// vensters in de lichtbeuk, de koortoren en de vleugels aan de Bloemstraat.
const cuts = [];
for (const s of [-2.9, 0, 2.9]) cuts.push(niche([0, 0], 180, 0, s, 2.4, BASE - 0.1, 3.4, 0.9));
for (const s of [-2.4, -0.8, 0.8, 2.4]) cuts.push(niche([0, 0], 180, 0, s, 1.0, 7.2, 9.5));
cuts.push(roundNiche([0, 0], 180, 0, 15.0, 1.6));
for (const cy of TOWERS) {
  const c = [TOWER_CX, cy];
  const outer = cy < 0 ? 270 : 90;
  // Klokkenverdieping: vijf galmgaten per zijde, daaronder een verdiepte nis.
  for (const ang of [0, 180]) {
    for (const s of [-2.4, -1.2, 0, 1.2, 2.4]) cuts.push(niche(c, ang, TOWER_CX, s, 0.75, 24.4, 25.8));
    cuts.push(rectNiche(c, ang, TOWER_CX, 0, 1.8, 20.4, 22.6, 0.3));
  }
  for (const ang of [90, 270]) {
    for (const s of [-2.8, -1.4, 0, 1.4, 2.8]) cuts.push(niche(c, ang, TOWER_HALF, s, 0.85, 24.4, 25.8));
    cuts.push(rectNiche(c, ang, TOWER_HALF, 0, 1.8, 20.4, 22.6, 0.3));
  }
  // Voorzijde: een paar rondboogvensters, twee paren rechte vensters en de winkelpui.
  for (const s of [-0.65, 0.65]) {
    cuts.push(niche(c, 180, TOWER_CX, s, 0.9, 14.8, 16.6));
    cuts.push(rectNiche(c, 180, TOWER_CX, s, 0.8, 11.0, 12.8));
    cuts.push(rectNiche(c, 180, TOWER_CX, s, 0.8, 7.6, 9.4));
    // Buitenzijde boven het buurpand en de pastorie, achterzijde boven de zijbeuk.
    cuts.push(niche(c, outer, TOWER_HALF, s, 0.9, 17.0, 18.8));
    cuts.push(niche(c, 0, TOWER_CX, s, 0.9, 14.8, 16.6));
  }
  cuts.push(rectNiche(c, 180, TOWER_CX, 0, 4.0, BASE - 0.1, 3.3, 0.4));
}
// Lichtbeuk: een spitse nis per travee van 4,4 m aan beide kanten.
for (let k = 0; k < 7; k++) for (const ang of [90, 270]) cuts.push(niche([10.2 + 4.4 * k, 0], ang, HW, 0, 1.0, 9.3, 10.1));
// Koortoren: drie hoge vensters aan de Bloemstraat.
for (const s of [-1.6, 0, 1.6]) cuts.push(niche([rearX(s), s], REAR_ANG, 0, 0, 1.0, 12.8, 15.4));
// Vleugels aan de Bloemstraat: vier vensters in de oostvleugel, twee paren, een poort en een deur in de westvleugel.
for (const y of [-13.5, -12.0, -10.5, -9.0]) cuts.push(niche([rearX(y), y], REAR_ANG, 0, 0, 0.9, 3.4, 5.4));
for (const y of [7.2, 8.2]) cuts.push(niche([rearX(y), y], REAR_ANG, 0, 0, 0.8, 3.6, 5.5));
for (const y of [10.1, 11.1]) cuts.push(niche([rearX(y), y], REAR_ANG, 0, 0, 0.8, 4.4, 6.3));
cuts.push(rectNiche([rearX(10.6), 10.6], REAR_ANG, 0, 0, 2.2, BASE - 0.1, 3.6, 0.4));
cuts.push(rectNiche([rearX(7.7), 7.7], REAR_ANG, 0, 0, 1.2, BASE - 0.1, 2.3, 0.4));
church = church.subtract(Manifold.union(cuts));

// ---------- pastorie (Rozengracht 150, hetzelfde BAG-pand) ----------
// Voorhuis met schilddak (voorschild 60 graden, zijvlakken 44 graden, nok +19,26 m) en een dakkapel aan de straat,
// daarachter een plat dak (+18,1 m) met een trappenhuis (+20,3 m) en een achtervleugel met zadeldak (nok +16,57 m).
const pastorieParts = [
  roofed(rect(-0.19, 6.2, 10.57, 19.94), [[1.76, 0, 14.11], [0, 0.976, 4.54], [0, -0.99, 34.19]]),
  prism(rect(0.5, 3.2, 13.9, 16.3), BASE, 16.7),
  prism(rect(6.2, 14.3, 10.57, 19.94), BASE, 18.1),
  prism(rect(10.6, 14.3, 14.4, 18.4), BASE, 20.3),
  roofed(rect(9.0, 21.4, 16.3, 23.0), [[0, -1.573, 45.38], [0, 1.207, -5.54]]),
  prism(rect(9.0, 21.4, 22.9, 23.9), BASE, 7.8),
];
let pastorie = Manifold.union(pastorieParts).subtract(churchMass);
const pCuts = [];
for (const s of [-1.8, 1.8]) {
  for (const [z0, z1] of [[3.8, 5.6], [6.9, 8.7], [10.0, 11.8]]) pCuts.push(rectNiche([0, 15.25], 180, 0.19, s, 1.2, z0, z1));
}
pCuts.push(rectNiche([0, 15.25], 180, 0.19, 0, 3.0, BASE - 0.1, 3.0, 0.4));
pastorie = pastorie.subtract(Manifold.union(pCuts));

const nodes = [
  ["building:kerk", church],
  ["building:pastorie", pastorie],
];
const all = Manifold.union([church, pastorie]);

const META = {
  name: "Fatih-moskee",
  origin: ORIGIN,
  xAxis: X_AXIS,
  groundOffsetMetres: 0,
  groundSamplePoints: GROUND_SAMPLES,
  groundHeight: 43.44,
  replacesBuildings: ["0363100012167944"],
  plate: false,
  description:
    "GLB in meters, Y omhoog volgens glTF; na omzetting naar Z omhoog ligt de oorsprong op RD (120370,99, 487361,78), het midden van de voorgevel aan de Rozengracht op de as van het schip, op het maaiveld (NAP +0,6 m), +X van de voorgevel naar de Bloemstraat (111,1 graden vanaf de RD-X-as) en +Y loodrecht daarop naar de pastorie. Node building:kerk: de voormalige Sint-Ignatiuskerk met schip onder één zadeldak (nok +20,8 m), lichtbeuk en zijbeuken onder lessenaarsdaken, twee vierkante torens met klokkenverdieping, vierzijdige spits met dakkapellen en makelaar tot +39,6 m, de topgevel met roosvenster, arcade en drie ingangsbogen ertussen, de vierkante koortoren met kantelen en tentdak tot +27,0 m en de vleugels aan de Bloemstraat. Node building:pastorie: de voormalige pastorie met schilddak, dakkapel, plat dak met trappenhuis en achtervleugel. Onderkant 0,5 m onder het maaiveld; alle vlakken wijzen omhoog of staan verticaal, op de nissen en de kragen na. Vervangt de PDOK-reconstructie van het BAG-pand van kerk en pastorie. Nodenaam klasse:label bepaalt de materiaalklasse.",
  realWorld: { towerTopM: 39.6, towerEaveM: TOWER_EAVE, choirTowerTopM: CT.apex, ridgeM: RIDGE, groundNapM: GROUND_NAP, baseM: BASE },
  sources: [
    "https://nl.wikipedia.org/wiki/Fatih-moskee_(Amsterdam)",
    "PDOK BAG pand 0363100012167944 (kerk en pastorie), EPSG:28992",
    "PDOK AHN DSM/DTM 0,5 m via WCS: nokken, goten, torens en het maaiveld",
    "3D BAG LoD2.2 (api.3dbag.nl): hellingen en richting van de daken",
    "PDOK luchtfoto (Actueel_orthoHR)",
    "Wikimedia Commons, categorieën Rozengracht 144-154 en Bloemstraat 147 (Amsterdam): opstand van het front, de torens, de koortoren en de vleugels",
  ],
};
// ---------- controles ----------
const parts = nodes;
for (const [name, solid] of parts) if (solid.status() !== "NoError") throw new Error(`${name}: ${solid.status()}`);
for (const [name, solid] of parts) {
  // Geen vlak boven de onderkant mag vlakker dan 45 graden naar beneden wijzen.
  const mesh = solid.getMesh();
  const v = mesh.vertProperties;
  const s = mesh.numProp;
  let worst = 0;
  let steep = 0;
  for (let t = 0; t < mesh.triVerts.length; t += 3) {
    const p = [0, 1, 2].map((k) => [0, 1, 2].map((ax) => v[mesh.triVerts[t + k] * s + ax]));
    if (Math.max(...p.map((q) => q[2])) < BASE + 1e-6) continue;
    const e1 = p[1].map((c, i) => c - p[0][i]);
    const e2 = p[2].map((c, i) => c - p[0][i]);
    const nv = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const len = Math.hypot(...nv);
    if (len > 1e-9 && nv[2] < -Math.SQRT1_2 * len - 1e-9 && len / 2 > 1e-4) {
      const z = Math.min(...p.map((q) => q[2]));
      if (typeof OVERHANG_OK === "function" && OVERHANG_OK(z, p)) continue;
      if (!steep) console.warn(`${name}: ondervlak op z ${z.toFixed(2)} bij ${p[0].map((c) => c.toFixed(1))} (${(len / 2).toFixed(2)} m2)`);
      worst = Math.max(worst, len / 2);
      steep++;
    }
  }
  if (steep) {
    console.warn(`${name}: ${steep} driehoeken hangen steiler dan 45 graden (grootste ${worst.toFixed(2)} m2)`);
    if (!argv.includes("--allow-overhang")) throw new Error(`${name}: ondervlakken onder 45 graden`);
  }
  const bb = solid.boundingBox();
  if (Math.abs(bb.min[2] - BASE) > 1e-6) throw new Error(`${name}: onderkant op ${bb.min[2]}`);
  // Rondgang via Float32 (zoals een slicer of de export de mesh inleest): moet gesloten blijven.
  const count = mesh.vertProperties.length / s;
  const flat = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) for (let a = 0; a < 3; a++) flat[i * 3 + a] = v[i * s + a];
  const round = new Manifold(new wasm.Mesh({ numProp: 3, vertProperties: flat, triVerts: mesh.triVerts }));
  const dv = Math.abs(round.volume() - solid.volume()) / solid.volume();
  if (round.status() !== "NoError" || round.genus() !== solid.genus() || dv > 0.002) {
    throw new Error(`${name}: rondgang via Float32: status ${round.status()}, genus ${round.genus()} tegenover ${solid.genus()}, volume ${(dv * 100).toFixed(2)}% anders`);
  }
}

// Losse delen van het model (genus onder 0 betekent meer dan een stuk).
if (argv.includes("--components")) {
  for (const [name, solid] of parts) {
    for (const piece of solid.decompose()) {
      const b = piece.boundingBox();
      console.log(name, "stuk", piece.volume().toFixed(1), "m3", b.min.map((c) => c.toFixed(1)), b.max.map((c) => c.toFixed(1)));
    }
  }
}

// ---------- STL-export ----------
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [
      u[1] * w[2] - u[2] * w[1],
      u[2] * w[0] - u[0] * w[2],
      u[0] * w[1] - u[1] * w[0],
    ];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const gltfNodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(
      typedArray.buffer,
      typedArray.byteOffset,
      typedArray.byteLength,
    );
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({
      buffer: 0,
      byteOffset: byteLength,
      byteLength: bytes.length,
      target,
    });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n =
        stride >= 6
          ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]]
          : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [
        { attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 },
      ],
    });
    gltfNodes.push({ name, mesh: meshes.length - 1 });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: gltfNodes.map((_, i) => i) }],
      nodes: gltfNodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([
    header,
    chunkHeader(jsonPadded.length, 0x4e4f534a),
    jsonPadded,
    chunkHeader(bin.length, 0x004e4942),
    bin,
  ]);
}

await mkdir(outDir, { recursive: true });
const report = {};
for (const [name, solid] of parts) {
  const bb = solid.boundingBox();
  report[name] = {
    status: solid.status(),
    genus: solid.genus(),
    triangles: solid.numTri(),
    volumeM3: +solid.volume().toFixed(1),
    sizeM: [0, 1, 2].map((i) => +(bb.max[i] - bb.min[i]).toFixed(2)),
    xRange: [+bb.min[0].toFixed(2), +bb.max[0].toFixed(2)],
    yRange: [+bb.min[1].toFixed(2), +bb.max[1].toFixed(2)],
    zRange: [+bb.min[2].toFixed(2), +bb.max[2].toFixed(2)],
  };
}
const glbFile = path.join(outDir, `${SLUG}.glb`);
await writeFile(glbFile, toGlb(parts, `NederPrint generate-${SLUG}.mjs (manifold-3d)`));
report.glb = { file: glbFile, parts: parts.map(([name]) => name) };

const stlFile = path.join(outDir, `${SLUG}-1-${scale}.stl`);
const printSolid = all.translate([0, 0, -BASE]);
const { buffer, triangles } = toStl(printSolid, `NederPrint ${META.name} 1:${scale} mm Z-up`);
await writeFile(stlFile, buffer);
const pbb = printSolid.boundingBox();
report.stl = {
  file: stlFile,
  status: printSolid.status(),
  genus: printSolid.genus(),
  triangles,
  volumeCm3: +((printSolid.volume() * mmPerMetre ** 3) / 1000).toFixed(2),
  sizeMm: [0, 1, 2].map((i) => +((pbb.max[i] - pbb.min[i]) * mmPerMetre).toFixed(1)),
};
const printFiles = [`${SLUG}-1-${scale}.stl`];
if (META.plate) {
  const allBox = all.boundingBox();
  const plateSolid = Manifold.union([
    all,
    Manifold.cube([allBox.max[0] - allBox.min[0] + 4, allBox.max[1] - allBox.min[1] + 4, 1.01]).translate([allBox.min[0] - 2, allBox.min[1] - 2, BASE - 1]),
  ]).translate([0, 0, -(BASE - 1)]);
  const plateFile = path.join(outDir, `${SLUG}-grondplaat-1-${scale}.stl`);
  const plate = toStl(plateSolid, `NederPrint ${META.name} grondplaat 1:${scale} mm Z-up`);
  await writeFile(plateFile, plate.buffer);
  report.grondplaat = { file: plateFile, status: plateSolid.status(), genus: plateSolid.genus(), triangles: plate.triangles };
  printFiles.push(`${SLUG}-grondplaat-1-${scale}.stl`);
}

const abb = all.boundingBox();
await writeFile(
  path.join(outDir, `${SLUG}.json`),
  JSON.stringify(
    {
      name: META.name,
      file: `${SLUG}.glb`,
      unitsPerMetre: 1,
      className: "building",
      crs: "EPSG:28992",
      origin: META.origin,
      xAxis: META.xAxis,
      groundOffsetMetres: META.groundOffsetMetres ?? 0,
      ...(META.groundSamplePoints ? { groundSamplePoints: META.groundSamplePoints } : {}),
      ...(META.groundHeight !== undefined ? { groundHeight: META.groundHeight } : {}),
      ...(META.replacesBuildings?.length ? { replacesBuildings: META.replacesBuildings.map((id) => `NL.IMBAG.Pand.${id}`) } : {}),
      description: META.description,
      printFiles,
      realWorld: {
        lengthM: +(abb.max[0] - abb.min[0]).toFixed(2),
        widthM: +(abb.max[1] - abb.min[1]).toFixed(2),
        highestPointM: +abb.max[2].toFixed(2),
        ...META.realWorld,
      },
      sources: META.sources,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(report, null, 2));

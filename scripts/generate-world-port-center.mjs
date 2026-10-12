// World Port Center (Wilhelminakade 909, Wilhelminapier, Rotterdam; Foster and
// Partners, 1998-2001), kantoortoren van 32 verdiepingen, ca. 124 m, met het
// Havenbedrijf Rotterdam als grootste gebruiker. Het gebouw bestaat uit:
// - de kop: een halfrond (straal 15,6 m) aan de westkant, naar de kop van de
//   pier, met horizontale banden van lichte borstweringen en glas, tot
//   NAP +107,5; de bovenste laag is helemaal glas;
// - het oostblok: een rechthoekig volume tot +86,1 (rand +87,1) met dezelfde
//   banden en een dichte bovenrand, op het dak twee putten met installaties;
// - tussen kop en oostblok aan de noord- en zuidgevel een terugliggende,
//   donkere glazen sleuf over de volle hoogte;
// - de donkere schijf (kern) van 11 m breed met een halfronde westkop, die
//   boven het oostblok en de kop uitsteekt tot +126,0 (rand +126,5), met een
//   installatieput en opbouwen op het dak;
// - de kroon boven de kop: een donkere trommel met een vensterband, een
//   uitkragende balkonplaat (+114,7), een glazen verdieping en een
//   uitkragende ronde dakplaat tot +121,3 (de "hoed");
// - de luifel rond de voet: een flauw aflopend dak van +14,95 aan de gevel
//   tot +13,35 aan de rand, 26 m rond het hart, op ronde kolommen, met de
//   glazen begane grond eronder;
// - aan de westkant een lager paviljoen tot +7,6 met een schuine glazen
//   westgevel, en het terras (+4,8) met een trap naar het plein.
// Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen gestapelde
// DSM-lagen. Voorbeelden: generate-evoluon.mjs (aanpak primitieven),
// generate-toren-op-zuid.mjs en generate-rabobank-bestuurscentrum.mjs
// (skylinetorens op efteling-kit.mjs).
//
//   node scripts/generate-world-port-center.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong op RD (92881,5, 435528,7), in het middelpunt van
// het halfrond van de kop, z = 0 op NAP +3,5 m (kade en plein rondom: AHN-DTM
// +3,45..+3,6), Z omhoog. +X loopt op 39,1 graden in RD (zuidwest naar
// noordoost) langs de lange gevels, naar het oostblok en de Cruise Terminal;
// +Y op 129,1 graden naar de Maas (noordwest). De halfronde kop wijst naar
// -X, naar Hotel New York en de kop van de pier.
//
// Bronnen: BAG-pand 0599100000691020 (bouwjaar 2000): voetafdruk van begane
// grond, paviljoen en terras; AHN5 DSM 0,5 m (opname 2023,
// ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm): middelpunt en stralen van
// kop (15,6), dakplaat (10,0), schijf (5,5) en luifel (26,0) uit cirkelfits,
// hoogtes van kop +107,5, oostblok +86,1/+87,1, schijf +126,0/+126,5, dakplaat
// +121,3, luifel +14,95..+13,35, paviljoen +7,6, terras +4,8, de sleuven en
// de dakputten; AHN4 DSM/DTM 0,5 m (PDOK WCS) ter controle en voor het
// maaiveld; Wikipedia (32 verdiepingen, Foster); Commons-foto's van de
// noord-, west- en oostkant voor de kroon, de banden, de sleuven en de
// kolommen onder de luifel.
import { CrossSection, Manifold, prism, union, ccw, rect, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "world-port-center";
const ORIGIN = [92881.5, 435528.7];
const AXIS_DEG = 39.1;
const RAD = (AXIS_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 3.5;
const BASE = -1.0; // NAP +2,5, onder de straat aan de zuidkant (+3,25)
const z = (nap) => +(nap - GROUND_NAP).toFixed(3);

// ---------- hoogtes (NAP) ----------
const H = {
  head: 107.5, // dak van de kop (AHN5 107,4..107,7)
  eastRoof: 86.1, // dak van het oostblok (AHN5 86,1..86,2)
  eastRim: 87.1, // dakrand oostblok (AHN5 87,0..87,1)
  eastClosed: 83.4, // onderkant van de dichte bovenrand (foto's)
  eastWell: 82.9, // dakput zuid (AHN5 82,9)
  eastPlantWell: 83.4, // installatieput noord (AHN4 83,7..86; AHN5 onbruikbaar)
  eastPlant: 85.3, // installaties in de put (luchtfoto, geschat)
  slab: 126.0, // dak van de schijf (AHN5 126,0..126,1)
  slabRim: 126.5, // dakrand schijf (AHN5 126,5)
  slabWell: 124.7, // installatieput op de schijf (AHN5 124,6..124,8)
  slabPlant: 127.1, // opbouwen op de schijf (AHN5 127,0..127,3)
  drumWindows: [111.3, 112.6], // vensterband in de trommel (foto)
  balcony: [113.8, 114.7], // balkonplaat (foto: +114,5)
  crownGlass: 120.3, // bovenkant glazen verdieping onder de dakplaat
  disc: 121.3, // ronde dakplaat (AHN5 121,2..121,3)
  canopyFace: 14.95, // luifel aan de gevel (AHN5 14,8..15,0)
  canopyEdge: 13.35, // luifel aan de rand (AHN5 13,2..13,4)
  canopyThick: 1.0,
  hallTop: 13.5, // bovenkant glazen begane grond (in de luifelplaat)
  pavilion: 7.6, // paviljoen west (AHN5 7,6)
  pavilionFoot: 4.7, // voet van de schuine glazen westgevel (AHN5 4,7..5,4)
  terrace: 4.8, // terras noordwest (AHN5 4,7..4,8)
  steps: [4.55, 4.25, 3.95], // trap naar het plein (AHN5 4,6 / 4,3 / 4,0)
};
const F0 = 14.6; // vloer van de eerste kantoorlaag boven de luifel
const ST = 3.44; // laaghoogte: 27 lagen tot het dak van de kop (+107,5)
const HEAD_FLOORS = 27; // tellingen op foto's (27 banden boven de luifel)
const EAST_FLOORS = 20; // tot de dichte bovenrand (+83,4)
const NICHE = 0.35;

// ---------- plattegrond (gebouwstelsel) ----------
const R_TOWER = 15.6; // kop en lange gevels (AHN5-fit 15,6; BAG op maaiveld 15,3)
const U_EAST = 39.0; // oostgevel van het oostblok (AHN5 42,4..42,6 in RD-raster)
const U_JOIN = 16.1; // grens kop / oostblok (AHN5: dak +107,5 tot hier)
const NOTCH = { u: [11.6, 16.1], depth: 3.3 }; // sleuven noord en zuid (AHN4/AHN5)
const R_SLAB = 5.5; // schijf met halfronde westkop (AHN5-fit 5,52)
const U_SLAB = 27.4; // oostkant van de schijf boven het oostblok (AHN5)
const R_DISC = 10.0; // dakplaat (AHN5-fit 10,03)
const R_BALCONY = 9.6;
const R_GLASS = 7.5; // glazen verdieping onder de dakplaat (foto)
const R_DRUM = 7.0; // trommel tussen kop en balkonplaat (foto)
const R_CANOPY = 26.0; // luifel (AHN5: rand op 26,0 rond het hart)
const U_CANOPY = 45.4; // oostrand van de luifel (AHN5)
// BAG-voetafdruk (begane grond, paviljoen en terras) in het gebouwstelsel,
// zonder de ronde uitstulping aan de zuidgevel (die is de ronde kolom hieronder).
const BAG = [
  [0.27, -15.29], [10.28, -15.52], [16.53, -15.51], [38.7, -15.81], [38.65, 7.22], [43.0, 7.11], [43.0, 26.34],
  [-54.8, 26.32], [-54.8, 9.73], [-35.84, 9.8], [-35.84, 8.5], [-37.03, -14.93], [-14.23, -14.93], [-13.18, -13.87],
  [-13.37, -13.89], [-13.36, -12.46], [-12.38, -12.46], [-10.84, -10.88], [-9.83, -11.79], [-8.74, -12.61],
  [-7.58, -13.33], [-6.36, -13.94], [-5.09, -14.45], [-3.78, -14.83], [-2.45, -15.11], [-1.09, -15.26],
];
const ROUND_COLUMN = { c: [13.4, -17.8], r: 1.9 }; // BAG-cirkel aan de zuidgevel
const PAVILION = { u: [-37.1, -12.4], v: [-15.0, 15.4], slopeU: -33.4 }; // AHN5: +7,6 vanaf u -33,4
const TERRACE_V = 15.4; // terras ten noorden van het paviljoen
const STEPS = { u: [-54.4, -37.9], v: [9.7, 7.9, 5.9, 3.9] };

// ---------- hulpfuncties ----------
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));
const cs = (poly) => new CrossSection([ccw(poly)]);
const ext = (section, z0, z1) => Manifold.extrude(section, z1 - z0).translate([0, 0, z0]);
// Stadion: halve cirkel met straal r om (0, 0) aan de westkant, recht door tot u1.
const stadium = (r, u1, n = 96) => [
  ...range(n + 1, (k) => {
    const a = Math.PI / 2 + (Math.PI * k) / n;
    return [r * Math.cos(a), r * Math.sin(a)];
  }),
  [u1, -r],
  [u1, r],
];
const S = (r, u1) => cs(stadium(r, u1));
const clipU = (section, u0, u1) => section.intersect(cs(rect(u0, -60, u1, 60)));
const ring = (section, d = NICHE) => section.subtract(section.offset(-d, "Miter", 2));
// Ring van een volledige omtrek, daarna afgeknipt (geen binnenranden).
const ringU = (section, u0, u1, d = NICHE) => ring(section, d).intersect(cs(rect(u0, -60, u1, 60)));
const floorAt = (k) => F0 + ST * k;

// ---------- toren: kop en oostblok ----------
const TOWER = S(R_TOWER, U_EAST);
const HEAD = clipU(TOWER, -R_TOWER - 1, U_JOIN);
const EAST = clipU(TOWER, U_JOIN, U_EAST + 1);
let head = ext(HEAD, z(H.hallTop), z(H.head));
let east = ext(EAST, z(H.hallTop), z(H.eastRim));
// Banden: glas 2,0 m hoog en 0,35 m terug tussen borstweringen van 1,44 m;
// de bovenste laag van de kop is helemaal glas (foto's).
const headRing = ringU(TOWER, -60, U_JOIN);
const eastRing = ringU(TOWER, U_JOIN, 80);
const headCuts = range(HEAD_FLOORS - 1, (k) => ext(headRing, z(floorAt(k) + 1.05), z(floorAt(k) + 3.05)));
headCuts.push(ext(headRing, z(floorAt(HEAD_FLOORS - 1) + 0.4), z(H.head - 0.5)));
// Oostgevel van de kop boven het oostblok (tussen schijf en lange gevels).
for (let k = 0; k < HEAD_FLOORS; k++) {
  const [g0, g1] = k === HEAD_FLOORS - 1 ? [floorAt(k) + 0.4, H.head - 0.5] : [floorAt(k) + 1.05, floorAt(k) + 3.05];
  if (g0 < H.eastRim + 0.3) continue;
  for (const [v0, v1] of [[R_SLAB, R_TOWER - NICHE], [-R_TOWER + NICHE, -R_SLAB]]) headCuts.push(prism(rect(U_JOIN - NICHE, v0, U_JOIN + 0.5, v1), z(g0), z(g1)));
}
const eastCuts = range(EAST_FLOORS, (k) => ext(eastRing, z(floorAt(k) + 1.05), z(floorAt(k) + 3.05)));
head = head.subtract(union(headCuts));
east = east.subtract(union(eastCuts));
// Sleuven tussen kop en oostblok, van de luifel tot het dak van de kop.
const notches = union(
  [1, -1].map((s) => prism(rect(NOTCH.u[0], s > 0 ? R_TOWER - NOTCH.depth : -R_TOWER - 1, NOTCH.u[1], s > 0 ? R_TOWER + 1 : -R_TOWER + NOTCH.depth), z(H.canopyFace), z(H.head) + 1)),
);
// Dakputten op het oostblok: zuid (+82,9) en noord met installaties (+83,4,
// twee blokken tot +85,3, luchtfoto).
const eastWells = union([
  prism(rect(19.1, -14.6, 23.1, -8.6), z(H.eastWell), z(H.eastRim) + 1),
  prism(rect(17.1, 6.4, 26.6, 11.4), z(H.eastPlantWell), z(H.eastRim) + 1),
  prism(rect(U_JOIN + 1.0, -R_TOWER + 1.0, U_EAST - 1.0, R_TOWER - 1.0), z(H.eastRoof), z(H.eastRim) + 1),
]);
const eastPlant = union([rect(18.0, 7.2, 21.4, 10.6), rect(22.4, 7.2, 25.8, 10.6)].map((r) => prism(r, z(H.eastPlantWell) - 0.05, z(H.eastPlant))));
const tower = union([head, east]).subtract(notches).subtract(eastWells);

// ---------- schijf ----------
let slab = ext(S(R_SLAB, U_SLAB), z(F0), z(H.slabRim));
slab = slab.subtract(ext(S(R_SLAB - 0.75, U_SLAB - 0.75), z(H.slab), z(H.slabRim) + 1));
slab = slab.subtract(prism(rect(23.4, -4.2, 26.4, 4.2), z(H.slabWell), z(H.slabRim) + 1));
const slabPlant = union(
  [rect(20.4, 1.6, 22.2, 4.2), rect(20.4, -4.2, 22.2, -1.6)].map((r) => prism(r, z(H.slab) - 0.05, z(H.slabPlant))).concat([prism(rect(23.8, -0.6, 25.0, 0.6), z(H.slabWell) - 0.05, z(H.slabPlant))]),
);
// Vensters in de oostgevel van de schijf: drie kolommen per laag boven het
// oostblok (foto vanuit het oosten); in de noord- en zuidgevel één kolom bij
// de oostkant (trappenhuis, foto vanaf de Maas).
const slabWindows = [];
for (let k = 0; k < 12; k++) {
  const f = H.eastRim + 1.2 + ST * k;
  if (f + 2.2 > H.slab - 1.0) break;
  for (const v0 of [-4.4, -1.0, 2.4]) slabWindows.push(prism(rect(U_SLAB - NICHE, v0, U_SLAB + 0.5, v0 + 2.0), z(f), z(f + 2.2)));
  for (const s of [1, -1]) slabWindows.push(prism(rect(U_SLAB - 2.6, s > 0 ? R_SLAB - NICHE : -R_SLAB - 0.5, U_SLAB - 1.4, s > 0 ? R_SLAB + 0.5 : -R_SLAB + NICHE), z(f + 0.4), z(f + 2.2)));
}
slab = slab.subtract(union(slabWindows));

// ---------- kroon boven de kop ----------
let drum = ext(S(R_DRUM, U_JOIN), z(H.head) - 0.05, z(H.balcony[0]) + 0.05);
drum = drum.subtract(ext(ringU(S(R_DRUM, U_JOIN), -60, U_JOIN - 1.0), z(H.drumWindows[0]), z(H.drumWindows[1])));
const balcony = ext(S(R_BALCONY, U_JOIN), z(H.balcony[0]), z(H.balcony[1]));
// Glazen verdieping: stijlen van 0,9 m om de 3 m blijven staan (foto).
let crownGlass = ext(S(R_GLASS, U_JOIN), z(H.balcony[1]) - 0.05, z(H.crownGlass) + 0.05);
const mullions = union(
  range(16, (k) => {
    const a = Math.PI / 2 + (Math.PI * (k + 0.5)) / 16;
    return prism(rect(-0.45, 0, 0.45, R_GLASS + 1), -100, 400).rotate([0, 0, (a * 180) / Math.PI - 90]);
  }).concat(range(5, (k) => prism(rect(1.5 + 3.0 * k - 0.45, -R_GLASS - 1, 1.5 + 3.0 * k + 0.45, R_GLASS + 1), -100, 400))),
);
crownGlass = crownGlass.subtract(ext(ringU(S(R_GLASS, U_JOIN), -60, U_JOIN - 1.0), z(H.balcony[1] + 0.3), z(H.crownGlass - 0.2)).subtract(mullions));
const disc = ext(S(R_DISC, U_JOIN), z(H.crownGlass), z(H.disc));

// ---------- luifel, begane grond, kolommen ----------
// Dakvlak van +14,95 aan de torengevel tot +13,35 aan de rand: omhulsel van
// de twee stadions op die hoogtes, 1,0 m dik.
const towerPts = stadium(R_TOWER, U_EAST, 64);
const canopyPts = stadium(R_CANOPY, U_CANOPY, 64);
const canopy = Manifold.hull([
  ...towerPts.map(([u, v]) => [u, v, z(H.canopyFace)]),
  ...towerPts.map(([u, v]) => [u, v, z(H.canopyFace) - H.canopyThick]),
  ...canopyPts.map(([u, v]) => [u, v, z(H.canopyEdge)]),
  ...canopyPts.map(([u, v]) => [u, v, z(H.canopyEdge) - H.canopyThick]),
]);
const CANOPY = S(R_CANOPY, U_CANOPY);
// Glazen begane grond: BAG-voetafdruk binnen 2,5 m van de luifelrand, met
// twee glasbanden 0,35 m terug.
const HALL = cs(BAG).intersect(CANOPY.offset(-2.5, "Round", 0.5)).subtract(cs(rect(-60, -60, PAVILION.u[1], 60)).subtract(S(R_TOWER, U_EAST)));
let hall = ext(HALL, BASE, z(H.hallTop));
hall = hall.subtract(union([[3.9, 8.2], [8.8, 12.0]].map(([a, b]) => ext(ring(HALL), z(a), z(b)))));
// Ronde kolommen (1,0 m) op 1,2 m binnen de luifelrand, om de ca. 8 m (foto's).
const colPts = [];
const COL_R = R_CANOPY - 1.2;
for (let k = 0; k <= 8; k++) {
  const a = Math.PI / 2 + (Math.PI * k) / 8;
  colPts.push([COL_R * Math.cos(a), COL_R * Math.sin(a)]);
}
for (let u = 8; u < U_CANOPY - 1.2; u += 8) colPts.push([u, COL_R], [u, -COL_R]);
colPts.push([U_CANOPY - 1.2, COL_R], [U_CANOPY - 1.2, -COL_R], [U_CANOPY - 1.2, 0]);
const colZ = ([u, v]) => z(H.canopyEdge) - H.canopyThick + 0.6; // in de luifelplaat
const columns = union(
  colPts.map(([u, v]) => Manifold.cylinder(colZ([u, v]) - BASE, 0.5, 0.5, 24).translate([u, v, BASE])),
);
const roundColumn = Manifold.cylinder(z(14.0) - BASE, ROUND_COLUMN.r, ROUND_COLUMN.r, 40).translate([...ROUND_COLUMN.c, BASE]);

// ---------- paviljoen, terras en trap ----------
const PAV = cs(BAG).intersect(cs(rect(PAVILION.u[0] - 1, PAVILION.v[0] - 1, PAVILION.u[1], PAVILION.v[1])));
let pavilion = ext(PAV, BASE, z(H.pavilion));
// Schuine glazen westgevel: vlak van +4,7 op de BAG-rand tot +7,6 bij u -33,4.
{
  const slope = (H.pavilion - H.pavilionFoot) / (PAVILION.slopeU - PAVILION.u[0]);
  const a = slope; // z = a u + c
  const c = z(H.pavilion) - a * PAVILION.slopeU;
  const n = Math.hypot(a, 1);
  pavilion = pavilion.trimByPlane([a / n, 0, -1 / n], -c / n);
}
pavilion = pavilion.subtract(ext(ring(PAV), z(4.3), z(6.9)).intersect(prism(rect(PAVILION.slopeU, -60, 60, 60), -10, 40)));
const TER = cs(BAG).intersect(cs(rect(-60, TERRACE_V, PAVILION.u[1] + 2, 60)).add(cs(rect(-60, 9.0, PAVILION.u[0] + 1.3, 60))));
const terrace = ext(TER, BASE, z(H.terrace));
const steps = union(H.steps.map((h, k) => prism(rect(STEPS.u[0], STEPS.v[k + 1], STEPS.u[1], STEPS.v[0] + 0.3), BASE, z(h))));

const parts = { tower, eastPlant, slab, slabPlant, drum, balcony, crownGlass, disc, canopy, hall, columns, roundColumn, pavilion, terrace, steps };
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts));
model = model.trimByPlane([0, 0, 1], BASE);
model = Manifold.compose(model.decompose().filter((p) => p.volume() > 0.5));
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 10);
console.log("ondervlakken > 10 m2:", JSON.stringify(down));

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:World Port Center met halfronde kop oostblok schijf kroon met hoed en luifel", model]],
  catalog: {
    name: "World Port Center",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Kade aan de Maas, het plein aan de oostkant en de stoep aan de
    // zuidwestkant (PDOK ellipsoïdisch 47,09..47,15); de lagere straat aan de
    // zuidkant (46,85) blijft erbuiten.
    groundSamplePoints: [[-23, 31], [7, 31], [37, 31], [52, 0], [-28, -21]],
    groundHeight: 47.1,
    replacesBuildings: ["NL.IMBAG.Pand.0599100000691020"],
    description:
      "Oorsprong RD (92881,5, 435528,7) in het middelpunt van de halfronde kop op kadeniveau NAP +3,5 m, +X op 39,1 graden in RD naar het oostblok, +Y naar de Maas; halfronde kop (straal 15,6 m) tot +107,5 met 27 lagen glasbanden 0,35 m diep en een glazen bovenste laag, oostblok tot +86,1 (rand +87,1) met 20 lagen, een dichte bovenrand en twee dakputten met installaties, terugliggende sleuven tussen kop en oostblok in beide lange gevels; donkere schijf van 11 m met halfronde westkop tot +126,0 (rand +126,5) met installatieput, opbouwen en vensters; kroon met trommel, balkonplaat (+114,7), glazen verdieping en ronde dakplaat tot +121,3 (straal 10,0 m); luifel van +14,95 aan de gevel tot +13,35 aan de rand (straal 26 m) op ronde kolommen boven de glazen begane grond; paviljoen +7,6 met een schuine glazen westgevel, terras +4,8 met trap. Laaghoogte, banden, kroon onder de dakplaat, vensters, kolommen en de diepte van de putten uit foto's of geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      axisDegrees: AXIS_DEG,
      architect: "Foster and Partners (1998-2001)",
      storeys: 32,
      radiusM: { head: R_TOWER, slab: R_SLAB, disc: R_DISC, canopy: R_CANOPY },
      lengthM: { tower: +(U_EAST + R_TOWER).toFixed(1), canopy: +(U_CANOPY + R_CANOPY).toFixed(1) },
      napM: {
        head: H.head, eastRoof: H.eastRoof, eastRim: H.eastRim, slab: H.slab, slabRim: H.slabRim, slabPlant: H.slabPlant,
        disc: H.disc, balcony: H.balcony[1], canopyFace: H.canopyFace, canopyEdge: H.canopyEdge, pavilion: H.pavilion, terrace: H.terrace,
      },
      officeStoreysHead: HEAD_FLOORS,
      storeyM: ST,
      estimates: [
        "27 lagen van 3,44 m in de kop boven de luifel (banden geteld op een frontale foto), 20 in het oostblok onder een dichte rand van 3,7 m; glas 2,0 m hoog en 0,35 m diep",
        "kroon: trommel tot +113,8 met een vensterband, balkonplaat +113,8..+114,7, glazen verdieping (straal 7,5 m) met stijlen om de 3 m en dakplaat van 1,0 m dik onder +121,3 uit foto's; alleen de bovenkant van de dakplaat staat in het AHN",
        "sleuven tussen kop en oostblok 4,5 m breed en 3,3 m diep uit AHN4/AHN5 en foto's",
        "luifel 1,0 m dik; ronde kolommen van 1,0 m om de ca. 8 m en de glazen gevel 2,5 m binnen de rand uit foto's; aan de zuidkant volgt de begane grond de BAG-gevel",
        "installatieput noord op het oostblok (+83,4) en de twee installatieblokken: AHN5 heeft daar geen bruikbare waarden, diepte uit AHN4 en de luchtfoto",
        "vensters in de schijf: drie kolommen in de oostgevel en één kolom in de lange gevels, maten geschat",
        "paviljoen: schuine glazen westgevel als één vlak (+4,7 tot +7,6) uit het AHN5, glasband 0,35 m geschat",
      ],
    },
    sources: [
      "PDOK BAG pand 0599100000691020, Actueel_orthoHR; PDOK-gebouwtegels en terrein; 2026-10-12",
      "AHN5 DSM 0,5 m (opname 2023), ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; AHN4 DSM/DTM 0,5 m (PDOK WCS)",
      "https://nl.wikipedia.org/wiki/World_Port_Center",
      "https://commons.wikimedia.org/wiki/File:(NLD-South_Holland)_Rotterdam_World_Port_Center_2025-06-04.jpg",
      "https://commons.wikimedia.org/wiki/File:Euromast_-_Scheepvaartkwartier_-_Rotterdam_-_View_of_World_Port_Center.jpg",
      "https://commons.wikimedia.org/wiki/File:Rotterdam_toren_worldportcenter.jpg",
      "https://commons.wikimedia.org/wiki/File:World_Port_Center.JPG",
      "https://commons.wikimedia.org/wiki/File:Kop_van_Zuid,_Rotterdam,_Netherlands_-_panoramio_(8).jpg",
      "https://commons.wikimedia.org/wiki/File:Kantoor_PortofRotterdam.jpg",
    ],
  },
});

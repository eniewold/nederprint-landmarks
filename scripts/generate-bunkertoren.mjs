// BunkerToren (John F. Kennedylaan / Vincent van den Heuvellaan, Eindhoven, 2019–2023; Powerhouse
// Company): woontoren van 100 m op de plek van het middendeel van studentencentrum De Bunker
// (H.A. Maaskant, 1969). Een schacht met horizontale natuurstenen banden per verdieping, een 1 m
// bredere middenzone aan de westkant tot NAP +77,5 m, en een getrapte zuidkant: de verdiepingen
// springen per laag 1,09 m terug langs één schuin vlak dat de zuidgevel diagonaal snijdt (van
// +53 m aan de westkant tot +69 m aan de oostkant). Op de begane grond een podium met een hellende
// westrand; daaromheen de bewaarde koppen van De Bunker met hun naar buiten hellende betonnen
// gevels. Contouren uit de BAG, hoogtes en vlakken uit de 3D BAG (AHN5, 2024); het AHN-DSM van de
// PDOK-WCS toont hier nog de bouwput en is niet gebruikt.
import { CrossSection, Manifold, ccw, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "bunkertoren";
// Gebouwstelsel: u loodrecht op de oostgevel van de toren (-11,85° op RD-oost), v langs die gevel
// naar het noorden (78,15°, gemeten op de BAG-hoekpunten van de oostgevel).
const ORIGIN = [161420.0, 384230.0];
const ANGLE = -11.85;
const A = (ANGLE * Math.PI) / 180;
const AXIS = [Math.cos(A), Math.sin(A)];
const GROUND = 18.78; // NAP, 3D BAG b3_h_maaiveld van de toren (18,777); plein en straat 18,2–19,0
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const local = ([x, y]) => [(x - ORIGIN[0]) * AXIS[0] + (y - ORIGIN[1]) * AXIS[1], -(x - ORIGIN[0]) * AXIS[1] + (y - ORIGIN[1]) * AXIS[0]];

// BAG-contouren (RD, bovenaanzicht).
const BAG_TOWER_RD = [[161395.402, 384212.301], [161401.021, 384209.552], [161402.446, 384212.54], [161414.333, 384206.87], [161414.588, 384200.438], [161415.583, 384200.253], [161425.758, 384198.275], [161434.318, 384239.067], [161413.151, 384243.377], [161413.262, 384241.218], [161409.897, 384241.587], [161410.074, 384241.957], [161409.705, 384242.134]];
const BAG_BUNKER_RD = [[161409.789, 384268.472], [161410.017, 384263.687], [161410.259, 384263.218], [161412.083, 384263.294], [161412.427, 384256.606], [161413.151, 384243.377], [161434.318, 384239.067], [161425.758, 384198.275], [161415.583, 384200.253], [161414.471, 384194.926], [161416.602, 384194.481], [161414.411, 384183.984], [161413.538, 384179.804], [161425.148, 384177.381], [161424.271, 384173.178], [161435.648, 384170.803], [161436.521, 384174.985], [161439.412, 384174.382], [161443.732, 384195.077], [161443.954, 384195.524], [161450.857, 384228.917], [161453.42, 384241.315], [161456.081, 384254.229], [161445.345, 384256.428], [161443.92, 384249.556], [161440.16, 384250.327], [161444.19, 384270.006]];
const BAG_TOWER = BAG_TOWER_RD.map(local);
const BAG_BUNKER = BAG_BUNKER_RD.map(local);

// ---------- Toren (pand 0772100001025376 plus het deel boven de Bunker-contour) ----------
// Hoogtes (NAP) uit de 3D BAG LoD2.2; vlakken in het gebouwstelsel uit doorsneden van de 3D BAG.
const ROOF = 118.65; // dakvlak (118,60–118,75)
const PLANT_ROOF = 121.5; // dakopbouw (121,31–121,59)
const MID_TOP = 77.5; // bovenkant van de middenzone aan de westkant (77,46–77,52)
const PODIUM_TOP = 32.5; // podiumdak (32,48–32,54)
const LOBBY_TOP = 25.6; // begane grond en dak van De Bunker (25,58–25,65)
const BAY_TOP = 113.0; // oostelijke erker, buitenrand van het dakvlak 112,9–113,2
// Verdiepingen: 25,6 / 29,05 / 32,5 en daarboven 3,0 m (terrassen op +47,47 en +77,48 vallen precies
// op dat raster); de bovenste laag van +113,5 tot het dak houdt de dakrand.
const LEVELS = [LOBBY_TOP, 29.05, ...Array.from({ length: 28 }, (_, k) => PODIUM_TOP + 3 * k), ROOF];

// Schacht: westgevel als één lijn, zuidgevel, oostgevel en het noordelijke deel boven De Bunker.
// Oostgevel op u = 12,15 (BAG-hoekpunten van de oostgevel liggen op 12,150 en 12,151).
const EAST_U = 12.15;
const SHAFT = [[-11.54, -13.68], [EAST_U, -13.33], [EAST_U, 11.81], [12.34, 20.65], [-2.61, 21.77]];
const BAY = [[12.0, -4.4], [14.3, -4.4], [14.14, 16.4], [12.0, 16.4]];
// Middenzone: westgevel 1,0 m buiten de schacht (lijn door (-13,53, -18,18) en (-6,46, 11,49)).
const MID = [[-18.73, -40], [EAST_U, -40], [EAST_U, 11.81], [-6.41, 11.71]];
// Podium tot +32,5 m; de zuidrand ligt op het schuine vlak op die hoogte.
const PODIUM = [[-16.0, -20.08], [-10.51, -21.34], [0.35, -23.84], [EAST_U, -26.56], [EAST_U, 11.81], [12.34, 20.65], [-5.7, 22.0], [-8.32, 11.7]];
// Schuin vlak van de getrapte zuidkant: v = PI_A + PI_U·u + PI_Z·z(NAP), gefit op de 3D BAG-doorsneden
// van +32,5 tot +69 m (afwijking < 0,2 m). Het snijdt de zuidgevel van de schacht van +53,0 m (west)
// tot +69,0 m (oost) en springt per laag van 3 m 1,09 m terug.
const PI_A = -35.52, PI_U = -0.23, PI_Z = 0.3625;
const SOUTH_LINE = [[-11.54, -13.68], [12.15, -13.33]];
// Hellende westrand van het podium: van +27,5 m op de BAG-rand naar +29,6–30,2 m op de podiumgevel.
const WEST_SLOPE = [[-20.44, -22.36, 27.53], [-12.56, 9.77, 28.26], [-16.0, -20.08, 29.57]];
const WEST_SLOPE_CAP = 30.3;
// Dakopbouw (3D BAG-vlakken 51 en 122).
const PLANT = [[-4.4, -5.5], [8.03, -5.6], [8.09, 13.2], [0.73, 13.3], [-0.04, 11.75]];

const cs = (poly) => new CrossSection([ccw(poly)]);
const prismCs = (sec, z0, z1) => Manifold.extrude(sec, z1 - z0).translate([0, 0, z0]);
const halfPlane = (a, b) => cs([[-200, a + b * -200], [200, a + b * 200], [200, 300], [-200, 300]]); // v ≥ a + b·u
const southLine = (() => { const [[u0, v0], [u1, v1]] = SOUTH_LINE, b = (v1 - v0) / (u1 - u0); return halfPlane(v0 - b * u0, b); })();
const piHalf = (nap) => halfPlane(PI_A + PI_Z * nap, PI_U);

function floorSection(z0, z1) {
  const mid = (z0 + z1) / 2;
  let sec = cs(SHAFT);
  if (mid < BAY_TOP) sec = sec.add(cs(BAY));
  if (z1 <= PODIUM_TOP + 1e-6) return sec.add(cs(PODIUM));
  if (z1 <= MID_TOP + 1e-6) {
    const m = cs(MID);
    sec = sec.add(m.intersect(southLine)).add(m.intersect(piHalf(mid)));
  }
  return sec;
}

const floors = [];
for (let k = 0; k + 1 < LEVELS.length; k++) floors.push({ z0: LEVELS[k], z1: LEVELS[k + 1], sec: floorSection(LEVELS[k], LEVELS[k + 1]) });

function planeRoof(poly, pts, cap) {
  // z = a u + b v + c door drie punten, afgetopt op cap.
  const [p, q, r] = pts;
  const e1 = [q[0] - p[0], q[1] - p[1], q[2] - p[2]], e2 = [r[0] - p[0], r[1] - p[1], r[2] - p[2]];
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  const a = -n[0] / n[2], b = -n[1] / n[2], c = p[2] - a * p[0] - b * p[1];
  const cz = c - GROUND, len = Math.hypot(a, b, 1);
  return prismCs(poly, BASE, z(cap)).trimByPlane([a / len, b / len, -1 / len], -cz / len);
}

const westBand = cs(BAG_TOWER).intersect(cs([[-40, -40], [0.6, -40], [0.6, 40], [-40, 40]]));
const towerSolid = union([
  prismCs(cs(BAG_TOWER).offset(0.05, "Miter"), BASE, z(LOBBY_TOP)), // 5 cm over de gedeelde muur met De Bunker, anders blijft er een vlak zonder dikte
  planeRoof(westBand, WEST_SLOPE, WEST_SLOPE_CAP),
  ...floors.map((f) => prismCs(f.sec, z(f.z0) - 0.02, z(f.z1))),
  prismCs(cs(PLANT), z(ROOF) - 0.1, z(PLANT_ROOF)),
]);

// ---------- De Bunker (pand 0772100000300142): bewaarde koppen en oostvleugel ----------
const BUNKER_ROOF = 25.6; // dak rond de toren en van de oostvleugel (25,59–25,65)
const EAST_EAVE = 22.0; // terras langs de oostgevel (21,96–22,15), 1,2 m breed
const EAST_SETBACK_U = 29.2; // gevel van de teruggezette glazen laag (29,14–29,33)
const NORTH_HEAD_ROOF = 26.6; // noordkop (26,53–26,67)
const SOUTH_HEAD_ROOF = 27.9; // zuidkop (27,90–27,93)
const SOUTH_TERRACE = 23.94; // lage strook voor de zuidkop, west (23,93–23,95)
const SOUTH_TIP = 19.95; // lage entree voor de zuidkop, oost (19,91–19,99)
// Maaskants naar buiten hellende betonnen bovengevels: dakrand op de BAG-contour, onderkant 2,0 m
// naar binnen op +21,6 m (geschat uit foto's; helling 68–72°, binnen de printhoek).
const FASCIA_BOTTOM = 21.6, FASCIA_INSET = 2.0;
// Linksom; bij elke kop de index van de zijde (vanaf die hoek) die aan De Bunker grenst en niet inspringt.
const SOUTH_HEAD = [[1.8, -30.1], [1.8, -35.45], [4.0, -40.5], [5.9, -47.7], [30.4, -47.1], [30.4, -30.9]];
const NORTH_HEAD = [[-12.62, 23.7], [15.56, 24.04], [15.46, 44.13], [-17.89, 35.56], [-16.66, 30.82]];

// Kop met hellende bovengevel: omhulsel van de dakcontour en de ingesprongen voet; zijden die aan
// de rest van De Bunker grenzen (keep: index van de eerste hoek van de zijde) springen niet in.
function head(poly, roof, keep) {
  const p = poly, n = p.length;
  if (ccw(p) !== p) throw new Error("kop niet linksom");
  const lines = p.map((a, i) => {
    const b = p[(i + 1) % n], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], inward = [-d[1], d[0]];
    const s = keep.includes(i) ? 0 : FASCIA_INSET;
    return { o: [a[0] + inward[0] * s, a[1] + inward[1] * s], d };
  });
  const foot = lines.map((l, i) => {
    const m = lines[(i + n - 1) % n];
    const den = m.d[0] * l.d[1] - m.d[1] * l.d[0];
    const t = ((l.o[0] - m.o[0]) * l.d[1] - (l.o[1] - m.o[1]) * l.d[0]) / den;
    return [m.o[0] + m.d[0] * t, m.o[1] + m.d[1] * t];
  });
  return union([
    prismCs(cs(foot), BASE, z(FASCIA_BOTTOM) + 0.01),
    Manifold.hull([...foot.map(([u, v]) => [u, v, z(FASCIA_BOTTOM)]), ...p.map(([u, v]) => [u, v, z(roof)])]),
  ]);
}

const bunkerCs = cs(BAG_BUNKER);
const southCut = cs([[-40, -47.4], [60, -47.4], [60, -80], [-40, -80]]);
// Hoofdmassa zonder de koppen: alles ten zuiden van de noordrand van de zuidkop en ten noorden van de
// zuidrand van de noordkop (west van u = 15,5) hoort bij een kop of bij de lage delen ervoor.
const lineCut = ([u0, v0], [u1, v1], above, uMax = 200) => {
  const b = (v1 - v0) / (u1 - u0), a = v0 - b * u0;
  return cs(above ? [[-200, a - 200 * b], [uMax, a + uMax * b], [uMax, 300], [-200, 300]] : [[-200, a - 200 * b], [-200, -300], [uMax, -300], [uMax, a + uMax * b]]);
};
const bunkerMain = bunkerCs.subtract(southCut).subtract(lineCut(SOUTH_HEAD[0], SOUTH_HEAD[5], false)).subtract(lineCut(NORTH_HEAD[0], NORTH_HEAD[1], true, 15.5));
const eastEave = cs([[EAST_SETBACK_U, -31.5], [40, -31.5], [40, 29.5], [EAST_SETBACK_U, 29.5]]);
const bunkerSolid = union([
  prismCs(bunkerMain, BASE, z(EAST_EAVE)),
  prismCs(bunkerMain.subtract(eastEave), BASE, z(BUNKER_ROOF)),
  // Lage delen voor de zuidkop, 2,5 m onder de kop door tot de ingesprongen voet.
  prismCs(bunkerCs.intersect(cs([[-40, -45.0], [15.5, -45.0], [15.5, -80], [-40, -80]])), BASE, z(SOUTH_TERRACE)),
  prismCs(bunkerCs.intersect(cs([[15.5, -45.0], [60, -45.0], [60, -80], [15.5, -80]])), BASE, z(SOUTH_TIP)),
  head(SOUTH_HEAD, SOUTH_HEAD_ROOF, [5]),
  head(NORTH_HEAD, NORTH_HEAD_ROOF, [0, 1]),
]);

// ---------- Gevelreliëf ----------
const DEPTH = 0.35;
const ring = (sec) => sec.offset(0.3, "Miter").subtract(sec.offset(-DEPTH, "Miter")); // 0,3 m buiten de gevel door
// Waar De Bunker tegen de toren staat, geen nis (anders een holte in het model).
const bunkerGuard = bunkerCs.offset(0.6, "Miter");
const cuts = [];
// Toren: per verdieping een natuurstenen band van 1,0 m (vloer en borstwering) en daarboven glas
// 0,35 m terug tot de volgende band; de bovenste laag houdt een dakrand van 1,0 m.
floors.forEach((f, k) => {
  const top = k === floors.length - 1 ? f.z1 - 1.0 : f.z1;
  let r = ring(f.sec);
  if (f.z0 < BUNKER_ROOF + 1.5) r = r.subtract(bunkerGuard);
  // Onderste podiumlaag: niet achter de hellende westrand; de tweede begint boven die rand.
  let lo = f.z0 + 1.0;
  if (f.z0 < LEVELS[1]) r = r.subtract(westBand.offset(0.6, "Miter"));
  else if (f.z0 < WEST_SLOPE_CAP) lo = WEST_SLOPE_CAP + 0.1;
  cuts.push(prismCs(r, z(lo), z(top)));
});
// Begane grond van de toren: glazen pui van 0,4 tot 5,8 m boven het plein, alleen vrij van De Bunker.
cuts.push(prismCs(ring(cs(BAG_TOWER)).subtract(bunkerGuard), z(GROUND + 0.4), z(GROUND + 5.8)));
// Oostvleugel: lintraam in de betonnen onderbouw en de glazen opbouw achter het terras.
const eastFace = (u0, u1, v0, v1) => cs([[u0, v0], [u1, v0], [u1, v1], [u0, v1]]);
cuts.push(prismCs(bunkerCs.intersect(eastFace(30.3 - DEPTH - 0.4, 40, -29.0, 28.5)).subtract(bunkerCs.offset(-DEPTH - 0.1, "Miter")), z(19.3), z(20.7)));
cuts.push(prismCs(eastFace(EAST_SETBACK_U - DEPTH, EAST_SETBACK_U + 1, -29.5, 28.0), z(EAST_EAVE + 0.4), z(BUNKER_ROOF - 0.6)));

const building = union([towerSolid, bunkerSolid]).subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`BunkerToren: ${parts.length} losse delen`);
console.log("BunkerToren", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "verdiepingen", floors.length);

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:bunkertoren-getrapte-toren-en-koppen-van-de-bunker", building]],
  catalog: {
    name: "BunkerToren",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 62.675, // laagste PDOK-terrein op het plein rondom (ellipsoïdisch), NAP circa +18,8
    groundOffsetMetres: -0.15,
    groundSamplePoints: [[-28, 0], [-28, -20], [0, 48], [-10, -35]],
    replacesBuildings: ["NL.IMBAG.Pand.0772100001025376", "NL.IMBAG.Pand.0772100000300142", "NL.IMBAG.Pand.0772100001047020"],
    description:
      "BunkerToren met de bewaarde delen van De Bunker: schacht tot NAP +118,65 m met dakopbouw tot +121,5 m en natuurstenen banden per verdieping, westelijke middenzone 1 m breder tot +77,5 m, oostelijke erker tot +113,0 m, getrapte zuidkant langs één schuin vlak (1,09 m terug per laag van 3 m; snijlijn met de zuidgevel van +53,0 m west tot +69,0 m oost), podium tot +32,5 m met hellende westrand (+27,5 tot +30,3 m); De Bunker tot +25,6 m met teruggezette glazen laag achter een terras op +22,0 m, noordkop tot +26,6 m en zuidkop tot +27,9 m met naar buiten hellende bovengevels, lage delen op +23,9 en +19,95 m. BAG-contouren, hoogtes en vlakken uit de 3D BAG (AHN5 2024). Oorsprong in de toren, X-as loodrecht op de oostgevel (-11,85° op RD-oost). Verdiepingshoogte, glasbanden en de helling van de Bunkergevels zijn geschat; de ondergrondse garage (pand 0772100001047020) wordt alleen verborgen.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: ROOF,
      plantRoofNapM: PLANT_ROOF,
      midZoneTopNapM: MID_TOP,
      eastBayTopNapM: BAY_TOP,
      podiumTopNapM: PODIUM_TOP,
      lobbyTopNapM: LOBBY_TOP,
      stepPlane: { vAt0: PI_A, dvPerU: PI_U, dvPerNapM: PI_Z },
      stepPlaneOnSouthFacadeNapM: [53.0, 69.0],
      storeyHeightM: 3.0,
      storeys: floors.length,
      bunker: { roofNapM: BUNKER_ROOF, eastTerraceNapM: EAST_EAVE, northHeadNapM: NORTH_HEAD_ROOF, southHeadNapM: SOUTH_HEAD_ROOF, southLowNapM: [SOUTH_TERRACE, SOUTH_TIP] },
      facadeAngleDegrees: ANGLE,
      estimatedFacadeRelief: true,
      estimatedBunkerFascia: true,
    },
    sources: [
      "PDOK BAG panden 0772100001025376 (2022), 0772100000300142 (1969), 0772100001047020 (2022, ondergronds), actuele orthoHR",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100001025376",
      "https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000300142",
      "https://nl.wikipedia.org/wiki/BunkerToren",
      "https://commons.wikimedia.org/wiki/File:Bunker_Toren_(2023).jpg",
      "https://commons.wikimedia.org/wiki/File:BunkerToren_in_Eindhoven_in_2022.jpg",
      "https://commons.wikimedia.org/wiki/File:Bunkertoren1.jpg",
      "https://commons.wikimedia.org/wiki/File:Bunkertoren2.jpg",
      "https://commons.wikimedia.org/wiki/File:Studentencentrum_De_Bunker_Eindhoven.jpg",
    ],
  },
});

// Westpoint (Hart van Brabantlaan / Ringbaan-West, Tilburg; Margriet Eugelink,
// Van Aken Architektuur, opgeleverd 2004): woontoren van ruim 140 m en 47
// verdiepingen, bij oplevering de hoogste woontoren van Nederland, met de
// lagere Westpoint Wing (elf woonlagen) en een onderbouw met winkels en een
// parkeergarage onder een daktuin, alles één BAG-pand. Het complex bestaat uit:
// - de toren: een doos van 30,0 x 27,5 m op een glazen plint van twee lagen.
//   De noord- en zuidgevel zijn donkere vlakken met een raster van kleine
//   vensters (12 per laag) tussen lichte hoekbanden over de volle hoogte; de
//   oost- en westgevel hebben een wit betonraster van vier traveeën en
//   cellen van twee lagen dat 1,6 m voor de glasgevel staat (door Herman
//   Kuijer gekleurd). Op het dak een kroonrand, een installatieopbouw in het
//   midden en een liftopbouw in de zuidwesthoek;
// - de Wing langs de Ringbaan-West: een schijf van 15,4 x 54,8 m met een
//   glazen winkelplint, elf woonlagen met raambanden en witte balkons op de
//   lange gevels, vensters in de kopgevels en installaties op het dak;
// - de onderbouw: parkeergarage met daktuin op +24,2 tussen Wing en toren,
//   aan de oostkant een rijstrook op +21,2 en aan de noord- en zuidkop van de
//   Wing lagere daken op +21,2;
// - de glazen passage tussen de toren en het oostelijke buurpand (+21,9),
//   die geen eigen BAG-pand heeft.
// Vlakken en benoemde bouwdelen in een eigen gebouwstelsel, geen gestapelde
// DSM-lagen. Voorbeelden per rij: generate-evoluon.mjs (aanpak primitieven)
// en generate-vestedatoren.mjs (gevelnissen op efteling-kit.mjs).
//
//   node scripts/generate-westpoint-tilburg.mjs              # 1:1000 (standaard)
//
// Gebouwstelsel: oorsprong op RD (132692,5, 396853,5), bij het hart van de
// toren, z = 0 op NAP +15,4 m (AHN4-DTM rond het complex +15,2..+15,5), Z
// omhoog. +X loopt op -5,27 graden in RD langs de noordgevel van de toren
// (oost), +Y op 84,73 graden naar de Hart van Brabantlaan (noord); de Wing
// ligt aan -X, -Y.
//
// Bronnen: BAG-pand 0855100000310704 (bouwjaar 2002): de voetafdruk, met de
// gevels op -5,27 graden; AHN5 DSM 0,5 m (opname 2023/2024, ImageServer
// Hoogtebestand/AHN5_DSM_50cm van ahn.arcgisonline.nl): torenrand +153,85,
// dak +152,5, raster +152,3 en 1,5..1,75 m buiten de doos, installaties
// +154,4..+157,0, liftopbouw +155,9, Wing +49,95 met rand +50,75, daktuin
// +24,2, rijstrook +21,2, passage +21,9; AHN4 DTM 0,5 m (PDOK WCS) voor het
// maaiveld; 3D BAG (dak max 156,9). Lagen, vensters, raster en plint uit
// Commons-foto's.
import { Manifold, prism, union, rect, writeLandmark, downFaces } from "./efteling-kit.mjs";

const slug = "westpoint-tilburg";
const ORIGIN = [132692.5, 396853.5];
const AXIS_DEG = -5.27;
const RAD = (AXIS_DEG * Math.PI) / 180;
const X_AXIS = [+Math.cos(RAD).toFixed(5), +Math.sin(RAD).toFixed(5)];
const GROUND_NAP = 15.4;
const BASE = -1.5; // NAP +13,9, onder de stoep aan de zuidkant (+14,3..+15,0)
const z = (nap) => +(nap - GROUND_NAP).toFixed(3);
const box = (u0, v0, z0, u1, v1, z1) => prism(rect(u0, v0, u1, v1), z0, z1);
const range = (n, f) => Array.from({ length: n }, (_, k) => f(k));

// ---------- hoogtes (NAP) ----------
const H = {
  rim: 153.85, // kroonrand van de toren (AHN5 153,8..153,9 rondom)
  roof: 152.5, // dak binnen de rand (AHN5 152,4..152,5)
  rasterTop: 152.3, // bovenkant betonraster oost en west (AHN5 152,2..152,3)
  plantDeck: 153.5, // verhoogd vlak rond de installaties (AHN5 153,4..153,5)
  plantStrip: 154.4, // strook aan de noordkant van de installaties (AHN5 154,3..154,6)
  plant: 157.0, // installatieopbouw (AHN5 156,9..157,1; 3D BAG max 156,93)
  liftCurb: 153.8, // verhoging zuidwesthoek (AHN5 153,6..153,7)
  lift: 155.9, // liftopbouw zuidwesthoek (AHN5 155,7..155,95)
  body: 24.0, // onderkant van de toren boven de glazen plint (foto's: twee lagen, gelijk met de daktuin)
  wingRim: 50.75, // rand Wing (AHN5 50,7..50,8)
  wingRoof: 49.95, // dak Wing (AHN5 49,9..50,0; 3D BAG 70p 49,92)
  wingDucts: 51.35, // luchtkanalen op het dak van de Wing (AHN5 51,3..51,4)
  stacks: [55.95, 56.5, 55.4], // drie schachten op het dak van de Wing (AHN5)
  wingPlinth: 21.2, // winkelplint Wing, gelijk met de lage daken (foto's, geschat)
  garden: 24.2, // daktuin (AHN5 24,1..24,3; 3D BAG 50p 24,22)
  gardenRim: 24.6, // rand en plantenbakken rond de daktuin (AHN5 24,4..24,6)
  lowDeck: 21.2, // rijstrook en lage daken (AHN5 21,1..21,3; 3D BAG min 21,17)
  lowRim: 22.3, // borstwering langs de rijstrook (AHN5 22,2..22,4)
  passage: 21.9, // glazen passage naar het buurpand (AHN5 21,7..22,0)
};

// ---------- toren ----------
// Doos (AHN5-rand): u -15,25..14,75, v -15,25..12,25.
const T = { u0: -15.25, u1: 14.75, v0: -15.25, v1: 12.25 };
const RASTER_D = 1.6; // betonraster buiten de oost- en westgevel (AHN5 1,5..1,75)
const CELLS = 22; // cellen van twee lagen (foto's: twee raambanden per cel)
const STOREYS = 2 * CELLS; // 44 woonlagen boven de plint (47 verdiepingen volgens Wikipedia)
const CELL = (z(H.rasterTop) - z(H.body)) / CELLS; // 5,832 m
const STOREY = CELL / 2; // 2,916 m
const FIN = 0.9; // lisenen en banden van het raster (dikker dan in het echt, printbaar op 1:1000)
const BAY = (T.v1 - T.v0 - 5 * FIN) / 4; // 5,75 m: vier traveeën
const GLASS_D = 0.6; // glasgevel achter het raster, in de doos

let tower = box(T.u0, T.v0, z(H.body) - 0.05, T.u1, T.v1, z(H.rim));
// Dak binnen een rand van 1,0 m.
tower = tower.subtract(box(T.u0 + 1.0, T.v0 + 1.0, z(H.roof), T.u1 - 1.0, T.v1 - 1.0, z(H.rim) + 1));

// Noord- en zuidgevel: donker vlak 0,3 m terug tussen lichte hoekbanden van
// 2,2 m (foto's), tot 0,7 m onder de rand; daarin 12 vensters per laag van
// 1,0 x 1,3 m, 0,35 m diep.
const BAND = 2.2;
const FIELD_D = 0.3;
const FIELD_TOP = z(H.rim) - 0.7;
const COLS = 12;
const PITCH = (T.u1 - T.u0 - 2 * BAND) / COLS; // 2,133 m
const cuts = [];
for (const [vf, s] of [[T.v0, -1], [T.v1, 1]]) {
  const vin = vf - s * FIELD_D;
  cuts.push(box(T.u0 + BAND, Math.min(vin, vf + s), z(H.body) - 1, T.u1 - BAND, Math.max(vin, vf + s), FIELD_TOP));
  for (let k = 0; k < STOREYS; k++) {
    const z0 = z(H.body) + STOREY * k + 0.8;
    for (let c = 0; c < COLS; c++) {
      const uc = T.u0 + BAND + PITCH * (c + 0.5);
      cuts.push(box(uc - 0.5, Math.min(vin - s * 0.35, vin + s), z0, uc + 0.5, Math.max(vin - s * 0.35, vin + s), z0 + 1.3));
    }
  }
}
// Oost- en westgevel: glasgevel 0,6 m terug in elke cel tussen de lisenen en
// banden van het raster.
const finV = range(5, (k) => T.v0 + k * (BAY + FIN));
const cellZ = range(CELLS + 1, (j) => z(H.body) + j * CELL);
for (const [uf, s] of [[T.u0, -1], [T.u1, 1]]) {
  for (let j = 0; j < CELLS; j++) {
    for (let b = 0; b < 4; b++) {
      const va = finV[b] + FIN;
      const zb = cellZ[j] + FIN;
      cuts.push(box(Math.min(uf - s * GLASS_D, uf + s), va, zb, Math.max(uf - s * GLASS_D, uf + s), va + BAY, cellZ[j + 1]));
    }
  }
}
tower = tower.subtract(union(cuts));
// Betonraster: vijf lisenen en een band per cel, 1,6 m diep buiten de gevel.
const raster = [];
for (const [uf, s] of [[T.u0, -1], [T.u1, 1]]) {
  const ua = Math.min(uf - s * 0.05, uf + s * RASTER_D);
  const ub = Math.max(uf - s * 0.05, uf + s * RASTER_D);
  for (const v of finV) raster.push(box(ua, v, z(H.body), ub, v + FIN, z(H.rasterTop)));
  for (let j = 0; j <= CELLS; j++) {
    const zt = j === CELLS ? z(H.rasterTop) : cellZ[j] + FIN;
    raster.push(box(ua, T.v0, zt - FIN, ub, T.v1, zt));
  }
}
// Glazen plint van twee lagen, 0,6 m terug onder de doos (BAG-voetlijn
// u -14,85..14,37, v ..12,03), met glasvakken van 2,4 m als nissen van 0,3 m.
const P = { u0: T.u0 + 0.6, u1: T.u1 - 0.6, v0: -15.0, v1: T.v1 - 0.6 };
let plinth = box(P.u0, P.v0, BASE, P.u1, P.v1, z(H.body) + 0.05);
const panes = [];
for (let k = 0; k < 9; k++) {
  const uc = P.u0 + 1.85 + k * 3.25;
  panes.push(box(uc - 1.2, P.v1 - 0.3, 0.3, uc + 1.2, P.v1 + 1, z(H.body) - 0.6));
}
for (const [uf, s] of [[P.u0, -1], [P.u1, 1]]) {
  for (let k = 0; k < 7; k++) {
    const vc = -7.6 + k * 2.75;
    panes.push(box(Math.min(uf - s * 0.3, uf + s), vc - 1.0, 0.3, Math.max(uf - s * 0.3, uf + s), vc + 1.0, z(H.body) - 0.6));
  }
}
plinth = plinth.subtract(union(panes));
// Dakopbouwen (AHN5).
const rz = z(H.roof) - 0.05;
const roofPlant = union([
  box(-6.25, -7.75, rz, 6.0, 4.75, z(H.plantDeck)),
  box(-5.25, 3.5, rz, 6.0, 4.75, z(H.plantStrip)),
  box(-5.25, -6.75, rz, 5.0, 3.5, z(H.plant)),
  box(-13.5, -12.75, rz, -11.0, -6.25, z(H.liftCurb)),
  box(-13.5, -12.75, rz, -12.5, -6.25, z(H.lift)),
]);

// ---------- Wing ----------
const Wg = { u0: -42.1, u1: -26.75, v0: -70.0, v1: -15.25 };
const WING_STOREYS = 11;
const WING_STOREY = (z(H.wingRoof) - z(H.wingPlinth)) / WING_STOREYS; // 2,61 m
let wing = box(Wg.u0, Wg.v0, BASE, Wg.u1, Wg.v1, z(H.wingRim));
wing = wing.subtract(box(Wg.u0 + 0.9, Wg.v0 + 0.9, z(H.wingRoof), Wg.u1 - 0.9, Wg.v1 - 0.9, z(H.wingRim) + 1));
const wcuts = [];
// Glazen winkelplint aan de west- en zuidgevel, 0,6 m terug.
wcuts.push(box(Wg.u0 - 1, Wg.v0 + 1.5, 0, Wg.u0 + 0.6, Wg.v1 - 1.5, z(H.wingPlinth) - 0.9));
wcuts.push(box(Wg.u0 + 1.5, Wg.v0 - 1, 0, Wg.u1 - 1.5, Wg.v0 + 0.6, z(H.wingPlinth) - 0.9));
// Raambanden op de lange gevels (west en, boven de daktuin, oost), 1,4 m hoog en 0,35 m diep.
const wingFloors = range(WING_STOREYS, (k) => z(H.wingPlinth) + WING_STOREY * k);
for (const f of wingFloors) {
  wcuts.push(box(Wg.u0 - 1, Wg.v0 + 1.5, f + 0.8, Wg.u0 + 0.35, Wg.v1 - 1.5, f + 2.2));
  if (f + 0.8 > z(H.gardenRim) + 0.3) wcuts.push(box(Wg.u1 - 0.35, Wg.v0 + 1.5, f + 0.8, Wg.u1 + 1, Wg.v1 - 1.5, f + 2.2));
}
// Kopgevels: zes vensters per laag van 1,2 x 1,4 m (foto's).
for (const [vf, s] of [[Wg.v0, -1], [Wg.v1, 1]]) {
  for (const f of wingFloors) {
    for (let c = 0; c < 6; c++) {
      const uc = Wg.u0 + 1.68 + c * 2.4;
      wcuts.push(box(uc - 0.6, Math.min(vf - s * 0.35, vf + s), f + 0.8, uc + 0.6, Math.max(vf - s * 0.35, vf + s), f + 2.2));
    }
  }
}
wing = wing.subtract(union(wcuts));
// Witte balkons op de lange gevels: per laag drie, verspringend (foto's): 2,0 m
// breed, 1,0 m diep, plaat en borstwering samen 1,2 m hoog.
const balconies = [];
wingFloors.forEach((f, k) => {
  for (const vc of [-22, -42, -62].map((v) => v + (k % 2 ? 6 : 0))) {
    balconies.push(box(Wg.u0 - 1.0, vc - 1.0, f, Wg.u0 + 0.05, vc + 1.0, f + 1.2));
    if (f > z(H.gardenRim) + 0.3) balconies.push(box(Wg.u1 - 0.05, vc - 1.0, f, Wg.u1 + 0.75, vc + 1.0, f + 1.2));
  }
});
// Installaties op het dak van de Wing (AHN5).
const wz = z(H.wingRoof) - 0.05;
const wingPlant = union([
  box(-36.5, -31.0, wz, -29.5, -27.5, z(H.wingDucts)),
  box(-36.0, -58.0, wz, -30.0, -54.5, z(H.wingDucts)),
  box(-39.5, -21.5, wz, -38.0, -20.0, z(H.stacks[0])),
  box(-30.75, -45.0, wz, -28.5, -42.5, z(H.stacks[1])),
  box(-31.5, -65.5, wz, -30.0, -63.5, z(H.stacks[2])),
]);

// ---------- onderbouw (parkeergarage, daktuin, rijstrook) ----------
// BAG-voetafdruk van de onderbouw in het gebouwstelsel (u -40,3..14,9, v -75,5..-9,8).
const PODIUM = [
  [-40.36, -15.37], [-40.28, -69.93], [-40.27, -75.4], [-28.92, -75.4], [14.97, -75.49],
  [14.89, -31.67], [14.65, -31.65], [14.65, -9.84], [-40.36, -9.92],
];
const podium = prism(PODIUM, BASE, z(H.lowDeck));
const GARDEN = { u0: -26.75, u1: 9.5, v0: -75.45, v1: -9.85 };
let garden = box(GARDEN.u0, GARDEN.v0, BASE, GARDEN.u1, GARDEN.v1, z(H.garden));
// Rand rond de daktuin (west, oost, zuid), 1,0 m breed.
const gardenRim = union([
  box(GARDEN.u0, GARDEN.v0, 0, GARDEN.u0 + 1.0, T.v0 + 0.05, z(H.gardenRim)),
  box(GARDEN.u1 - 1.0, GARDEN.v0, 0, GARDEN.u1, T.v0 + 0.05, z(H.gardenRim)),
  box(GARDEN.u0, GARDEN.v0, 0, GARDEN.u1, GARDEN.v0 + 1.0, z(H.gardenRim)),
]);
const lowRims = union([
  box(13.75, -75.45, 0, 14.65, -9.9, z(H.lowRim)), // borstwering langs de rijstrook
  box(-40.3, -75.4, 0, -39.4, -9.95, z(H.lowRim)), // rand van de lage daken aan de Ringbaan-West
]);
// Gevels van de onderbouw: hoge vensters (1,4 x 2,8 m) aan de zuid- en
// oostkant, 0,35 m diep (foto's).
const pcuts = [];
for (let k = 0; k < 18; k++) {
  const uc = -38.0 + k * 2.95;
  if (uc > 13.5) break;
  pcuts.push(box(uc - 0.7, -76.5, 0.5, uc + 0.7, -75.4 + 0.35, 3.3));
}
for (let k = 0; k < 20; k++) {
  const vc = -72.5 + k * 3.0;
  if (vc > -34) break;
  pcuts.push(box(14.6, vc - 0.7, 0.5, 16.0, vc + 0.7, 3.3));
}
const pod = union([podium, garden, gardenRim, lowRims]).subtract(union(pcuts));

// ---------- glazen passage naar het oostelijke buurpand ----------
// Glazen dak op +21,9 tussen de toren en pand 0855100000397837 (u 28,0),
// v -17,5..13,5 (AHN5, luchtfoto); gevels met glasvakken als nissen.
let passage = box(P.u1 - 0.1, -17.5, BASE, 27.9, 13.5, z(H.passage));
passage = passage.subtract(union(range(4, (k) => box(17.2 + k * 2.6, 13.2, 0.3, 19.2 + k * 2.6, 14.5, z(H.passage) - 0.6))));

const parts = { tower, raster: union(raster), plinth, roofPlant, wing, balconies: union(balconies), wingPlant, pod, passage };
for (const [k, p] of Object.entries(parts)) if (p.status() !== "NoError" || p.isEmpty()) throw Error(`${k}: ${p.status()} leeg=${p.isEmpty()}`);
let model = union(Object.values(parts));
model = model.trimByPlane([0, 0, 1], BASE);
if (model.status() !== "NoError" || model.decompose().length !== 1) {
  throw Error(`Model niet gesloten/verbonden: ${model.status()} ${model.decompose().length} delen, genus ${model.genus()}`);
}
const down = downFaces(model, BASE).filter((g) => g.area > 20);
console.log("ondervlakken > 20 m2:", JSON.stringify(down));
console.log("maten:", { cell: +CELL.toFixed(3), storey: +STOREY.toFixed(3), bay: BAY, pitch: +PITCH.toFixed(3), wingStorey: +WING_STOREY.toFixed(3) });

await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:Westpoint toren met betonraster vensterraster en kroon Wing met balkons onderbouw met daktuin en glazen passage", model]],
  catalog: {
    name: "Westpoint",
    origin: ORIGIN,
    xAxis: X_AXIS,
    groundOffsetMetres: 0,
    // Plein en stoep rond het complex (PDOK ellipsoïdisch 59,24..59,38, dat is
    // NAP +15,4 + 43,85); de lagere straat aan de zuidkant (56,9..58,5) en de
    // rijbaan aan de noordkant (59,09) blijven erbuiten.
    groundSamplePoints: [[-20, 8], [-20, -2], [20, 15], [20, -60], [-44, -65]],
    groundHeight: 59.25,
    replacesBuildings: ["NL.IMBAG.Pand.0855100000310704"],
    description:
      "Oorsprong RD (132692,5, 396853,5) bij het hart van de toren op maaiveld NAP +15,4 m, +X op -5,27 graden in RD langs de noordgevel (oost), +Y naar de Hart van Brabantlaan; toren van 30,0 x 27,5 m tot de kroonrand +153,85 (dak +152,5, installaties tot +157,0) op een glazen plint van twee lagen, noord- en zuidgevel met 12 vensters per laag tussen lichte hoekbanden, oost- en westgevel met een wit betonraster van vier traveeën en cellen van twee lagen 1,6 m voor de glasgevel; Wing van 15,4 x 54,8 m tot +50,75 met raambanden en balkons, onderbouw met daktuin op +24,2 en rijstrook op +21,2, glazen passage naar het buurpand op +21,9 (AHN5, BAG). Laaghoogtes, vensters, raster en balkons uit foto's of geschat.",
    realWorld: {
      groundNapM: GROUND_NAP,
      axisDegrees: AXIS_DEG,
      tower: { planM: [T.u1 - T.u0, T.v1 - T.v0], rasterDepthM: RASTER_D, bays: 4, bayM: BAY, cells: CELLS, cellM: +CELL.toFixed(3), storeys: STOREYS, storeyM: +STOREY.toFixed(3), windowsPerStorey: COLS, cornerBandM: BAND },
      wing: { planM: [+(Wg.u1 - Wg.u0).toFixed(2), +(Wg.v1 - Wg.v0).toFixed(2)], storeys: WING_STOREYS, storeyM: +WING_STOREY.toFixed(3) },
      napM: { rim: H.rim, roof: H.roof, rasterTop: H.rasterTop, plant: H.plant, lift: H.lift, towerSoffit: H.body, wingRim: H.wingRim, wingRoof: H.wingRoof, wingStacks: H.stacks, garden: H.garden, lowDeck: H.lowDeck, passage: H.passage },
      estimates: [
        "onderkant van de toren (+24,0, gelijk met de daktuin) en de glazen plint van twee lagen uit foto's",
        "44 woonlagen van 2,92 m in 22 rastercellen van twee lagen tussen +24,0 en de bovenkant van het raster (+152,3); 47 verdiepingen volgens Wikipedia",
        "betonraster: lisenen en banden 0,9 m in plaats van ca. 0,4 m, de gekleurde schuine wangen per laag weggelaten; glasgevel 0,6 m terug in de doos",
        "noord- en zuidgevel: 12 vensters van 1,0 x 1,3 m per laag, hoekbanden 2,2 m, vlak 0,3 m terug (foto's)",
        "Wing: winkelplint tot +21,2, elf lagen van 2,61 m, raambanden, drie balkons per laag en gevel en zes vensters per laag in de kopgevels uit foto's of geschat",
        "onderbouw: hoge vensters in de zuid- en oostgevel geschat; de glazen passage als gesloten blok tot het buurpand",
      ],
    },
    sources: [
      "PDOK BAG pand 0855100000310704, Actueel_orthoHR; PDOK-gebouwtegels en terrein; 2026-10-12",
      "AHN5 DSM 0,5 m, ahn.arcgisonline.nl Hoogtebestand/AHN5_DSM_50cm; AHN4 DTM 0,5 m (PDOK WCS); 3D BAG",
      "https://nl.wikipedia.org/wiki/Westpoint_(Tilburg)",
      "https://commons.wikimedia.org/wiki/File:Tilburg_westpoint.jpg",
      "https://commons.wikimedia.org/wiki/File:Tilburg_westpoint2.jpg",
      "https://commons.wikimedia.org/wiki/File:Tilburg_westpoint3.jpg",
      "https://commons.wikimedia.org/wiki/File:Westpoint_toren_Tilburg_2014_-_1.JPG",
      "https://commons.wikimedia.org/wiki/File:Westpoint_toren_Tilburg_2014_-_2.JPG",
      "https://commons.wikimedia.org/wiki/File:Westpoint_toren_Tilburg_2014_-_3.JPG",
      "https://commons.wikimedia.org/wiki/File:Westpoint-woontoren_-_Tilburg_-_2009_-_panoramio.jpg",
      "https://commons.wikimedia.org/wiki/File:2022RedheadDays-13.jpg",
    ],
  },
});

// Teleport Tower (Kingsfordweg 151, Teleport/Sloterdijk, Amsterdam, 2000–2001, Alberts en Van Huut): crèmekleurige
// kantoortoren van 17 lagen en circa 65 m in de 'organische' stijl van het bureau, met drie vleugels die naar
// Schiphol, station Sloterdijk en het centrum wijzen. De west- en de noordvleugel lopen in terrassen af (lagen 17,
// 14, 7, 4, 2 en 1), de zuidoostvleugel gaat tot het dak door; in de binnenhoeken zit glas over de hele hoogte en
// tegen de noordwestgevel staat een glazen entreepaviljoen. De toren staat op het dek van een ondergrondse garage
// (NAP +2,5) binnen een gemetselde muur; het BAG-pand omvat dat hele dek, het bovengrondse deel is de voetafdruk
// van de 3D BAG.
// Voetafdruk en terrashoogtes uit de 3D BAG (LoD2.2, AHN3), gecontroleerd tegen het AHN4-DSM; lagen en gevelindeling
// uit foto's.
import { CrossSection, Manifold, ccw, union, writeLandmark } from "./efteling-kit.mjs";

const slug = "teleport-tower";
// Stelsel: u naar RD-oost, v naar RD-noord (de vleugels staan onder allerlei hoeken; er is geen hoofdas die
// beter past). Oorsprong in het hart van de toren.
const ORIGIN = [117970.0, 488772.0];
const AXIS = [1, 0];
const GROUND = 2.55; // NAP, garagedek rond de toren (AHN-DTM 2,5–2,6; straat aan de Kingsfordweg 1,0–1,3)
const BASE = -0.8;
const z = (nap) => nap - GROUND;
const { FOOTPRINT, ROOFS, PAVILION } = teleportData();

// ---------- Lagen ----------
// Begane grond 4,35 m (dek +2,55 tot de eerste terrasvloer +6,9), daarboven 16 lagen van 3,6 m: de terrassen op
// +10,5, +17,7, +28,5, +53,7 en het dak op +64,4 liggen precies op die lagen.
const STOREY = 3.6;
const FLOORS = [[0, 4.35], ...Array.from({ length: 16 }, (_, k) => [4.35 + STOREY * k, STOREY])];

// ---------- Massa: terrassen als prisma's op de dakvlakken van de 3D BAG ----------
// Elk dakvlak wordt een prisma tot zijn hoogte, 0,2 m vergroot zodat buurvlakken sluiten, zonder de lagere
// dakvlakken ernaast en binnen de voetafdruk. Randjes smaller dan 0,9 m (opstaande dakranden van 0,5–1 m breed)
// vallen weg.
const F = new CrossSection([ccw(FOOTPRINT)]);
const section = (poly, holes = []) => new CrossSection([ccw(poly), ...holes.map((h) => ccw(h).reverse())]);
const sorted = [...ROOFS].sort((a, b) => a.h - b.h);
const tiers = [], dropped = [];
for (const r of sorted) {
  const lower = sorted.filter((q) => q.h < r.h - 0.05).map((q) => section(q.poly, q.holes));
  let region = section(r.poly).offset(0.2, "Miter");
  if (lower.length) region = region.subtract(CrossSection.union(lower));
  region = region.intersect(F);
  if (region.offset(-0.45, "Miter").area() < 0.05) { dropped.push(r); continue; }
  tiers.push({ h: r.h, region });
}
// Per hoogteniveau één plak: alles wat minstens zo hoog is, met spleetjes onder 0,6 m dichtgezet (sluiting), van
// het vorige niveau tot dit niveau.
const signed = (r) => r.reduce((a, p, i) => a + p[0] * r[(i + 1) % r.length][1] - r[(i + 1) % r.length][0] * p[1], 0) / 2;
const levels = [...new Set(tiers.map((t) => t.h))].sort((a, b) => a - b);
const tower = union(levels.map((h, k) => {
  const s0 = CrossSection.union(tiers.filter((t) => t.h >= h).map((t) => t.region)).offset(0.3, "Round", 2, 16).offset(-0.3, "Round", 2, 16).intersect(F).simplify(0.02);
  const z0 = k ? z(levels[k - 1]) : BASE;
  // Gaatjes kleiner dan 2 m² tussen dakvlakken (naden in de 3D BAG) dicht.
  const s = new CrossSection(s0.toPolygons().filter((r) => signed(r) > 0 || signed(r) < -2));
  return Manifold.extrude(s, z(h) - z0).translate([0, 0, z0]);
}));

// Glazen entreepaviljoen in de noordwestelijke binnenhoek: omhullende van de drie hellende glasvlakken
// (+11,8 tot +14,5) en hun voet.
const pavilion = Manifold.hull(PAVILION.flatMap(([u, v, h]) => [[u, v, z(h)], [u, v, BASE]]));
const body = union([tower, pavilion]);

// ---------- Gevelreliëf ----------
// Per laag de gevelomtrek van de toren (zonder paviljoen) op halve laaghoogte. Gevels: per travee van 3,0 m een
// venster van twee ramen (1,5 m) als blinde nis van 0,35 m met een plafond onder 45°; op een afgeschuinde hoek
// één venster. Korte facetten (2–5,5 m) aan een binnenhoek zijn de glasstroken: per laag één doorlopende nis over
// het facet met een borstwering van 0,9 m. Alleen waar de gevel buitengevel is (paviljoen en hogere terrassen
// blokkeren).
const DEPTH = 0.35;
const cuts = [];
const exposed = (P, s, h) => {
  const from = P(s, -3, h), hit = body.rayCast(from, P(s, 1, h))[0];
  const at = hit && Math.hypot(hit.position[0] - from[0], hit.position[1] - from[1]);
  return at > 2.95 && at < 3.05;
};
let bays = 0, strips = 0;
for (const [zf, fh] of FLOORS) {
  for (const ring of tower.slice(zf + fh / 2).simplify(0.05).toPolygons()) {
    if (Math.abs(signed(ring)) < 40) continue; // opstaande dakranden en opbouwen: geen vensters
    ring.forEach((a, i) => {
      const b = ring[(i + 1) % ring.length];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (L < 2.0) return;
      const d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [d[1], -d[0]];
      const P = (s, depth, h) => [a[0] + d[0] * s - n[0] * depth, a[1] + d[1] * s - n[1] * depth, h];
      // Binnenhoek: een van de twee hoekpunten is inspringend (ring linksom, dus kruisproduct negatief).
      const reflex = (j) => {
        const p = ring[(j - 1 + ring.length) % ring.length], q = ring[j], r = ring[(j + 1) % ring.length];
        return (q[0] - p[0]) * (r[1] - q[1]) - (q[1] - p[1]) * (r[0] - q[0]) < 0;
      };
      const glass = L < 5.5 && (reflex(i) || reflex((i + 1) % ring.length));
      const sill = glass ? 0.9 : 1.0, header = glass ? 0.35 : 0.55;
      const lo = zf + sill, hi = zf + fh - header - DEPTH;
      const spans = [];
      if (glass) spans.push([0.45, L - 0.45]);
      else {
        const pitch = 3.0, width = Math.min(1.5, L - 1.8), nb = Math.max(width >= 0.9 ? 1 : 0, Math.floor((L - 0.9) / pitch));
        const w = (L - nb * pitch) / 2;
        for (let k = 0; k < nb; k++) spans.push([w + k * pitch + (pitch - width) / 2, w + k * pitch + (pitch + width) / 2]);
      }
      for (const [s0, s1] of spans) {
        const ok = [s0 + 0.1, (s0 + s1) / 2, s1 - 0.1].every((s) => [lo + 0.05, hi + DEPTH - 0.05].every((h) => exposed(P, s, h)));
        if (!ok) continue;
        const cut = Manifold.hull([P(s0, -0.2, lo), P(s1, -0.2, lo), P(s0, DEPTH, lo), P(s1, DEPTH, lo), P(s0, -0.2, hi + DEPTH + 0.2), P(s1, -0.2, hi + DEPTH + 0.2), P(s0, DEPTH, hi), P(s1, DEPTH, hi)]);
        // Twee nissen die in een scherpe hoek op elkaar stoten, zouden de hoek doorboren: de tweede vervalt.
        if (cuts.some((c) => c.intersect(cut).volume() > 1e-6)) continue;
        glass ? strips++ : bays++;
        cuts.push(cut);
      }
    });
  }
}

const building = body.subtract(union(cuts));
const parts = building.decompose();
if (parts.length !== 1) throw new Error(`Teleport Tower: ${parts.length} losse delen (${parts.map((p) => p.volume().toFixed(1)).join(", ")})`);
console.log("Teleport Tower", building.status(), "genus", building.genus(), "driehoeken", building.numTri(), "vensters", bays, "glasstroken", strips, "weggelaten randen", dropped.map((r) => `${r.face}@${r.h}`).join(" "));

const H = (face) => ROOFS.find((r) => r.face === face).h;
await writeLandmark({
  slug,
  base: BASE,
  nodes: [["building:teleport-tower", building]],
  catalog: {
    name: "Teleport Tower",
    origin: ORIGIN,
    xAxis: AXIS,
    groundNap: GROUND,
    groundHeight: 45.55, // garagedek NAP +2,55 + 43,0 (geoïde NLGEO2018 hier 42,98; Radarweg 306 ijkt op 43,0)
    groundOffsetMetres: -0.15,
    // Op het garagedek rond de toren (binnenplaats zuid, strook oost, plein noordwest), niet op de lagere straat.
    groundSamplePoints: [[-5, -25], [10, -30], [22, 0], [-25, 20]],
    replacesBuildings: ["NL.IMBAG.Pand.0363100012081516"],
    description:
      "Teleport Tower aan de Kingsfordweg (Teleport, Sloterdijk): kantoortoren van 17 lagen in drie vleugels op de bovengrondse voetafdruk van de 3D BAG, met het dak op NAP +64,4 m, een middendeel tot +65,8 m en een installatieopbouw tot +67,1 m; de west- en de noordvleugel lopen in terrassen af naar +53,7, +28,5, +17,7, +10,5 en +6,9 m, de zuidoostvleugel gaat door tot +64,5 m. Per laag (begane grond 4,35 m, daarboven 3,6 m) vensters als blinde nissen op lange gevels en doorlopende glasstroken op de korte facetten in de binnenhoeken; tegen de noordwestgevel het glazen entreepaviljoen tot +14,5 m. Het BAG-pand omvat ook het garagedek (NAP +2,5) waar de toren op staat; dat dek zelf zit in het maaiveld en is niet gemodelleerd. Terrashoogtes en voetafdruk uit de 3D BAG (LoD2.2), gecontroleerd tegen het AHN4-DSM. Oorsprong in het hart van de toren, X-as naar RD-oost. Verdiepingsindeling, vensterstramien en glasstroken zijn uit foto's geschat.",
    realWorld: {
      groundNapM: GROUND,
      roofNapM: H(210),
      centralRoofNapM: H(226),
      southEastWingRoofNapM: H(223),
      plantNapM: H(198),
      terraceNapM: { west: [H(213), H(221), H(203), H(206), H(201)], north: [H(209), H(217), H(218), H(219), H(224)] },
      entrancePavilionNapM: [11.8, 14.5],
      floors: 17,
      storeyHeightM: STOREY,
      groundFloorHeightM: 4.35,
      footprintM2: +F.area().toFixed(1),
      estimatedFacadeRelief: true,
    },
    sources: [
      "PDOK BAG pand 0363100012081516 (bouwjaar 2001), actuele orthoHR, AHN4-DSM en -DTM 0,5 m",
      "3D BAG v2 (3DGI/TU Delft, CC BY 4.0), NL.IMBAG.Pand.0363100012081516, LoD2.2 (puntwolk AHN3)",
      "https://nl.wikipedia.org/wiki/Teleport_Tower",
      "https://commons.wikimedia.org/wiki/File:Teleport_Tower_Amsterdam.jpg",
      "https://commons.wikimedia.org/wiki/File:Regus_Sloterdijk_Teleport_Towers.JPG",
      "https://commons.wikimedia.org/wiki/File:Amsterdam_kantoorpand_Regus.jpg",
    ],
  },
});

function teleportData() {
  // 3D BAG v2 (3DGI/TU Delft, CC BY 4.0), pand 0363100012081516, LoD2.2: grondvlak (Douglas-Peucker 0,4 m) en
  // de dakvlakken (Douglas-Peucker 0,15 m, met gaten) in (u, v) ten opzichte van ORIGIN; h = gemiddelde dakhoogte (NAP).
  const FOOTPRINT = [[-36.88,-4.25],[-37.1,6.25],[-28.3,8.27],[-20.82,6.08],[-20.78,8.68],[-11.95,7.56],[-12.64,13.85],[-10.71,14.98],[-12.1,15.95],[-10.62,17.21],[-9.39,16.21],[-8.17,17.35],[-1.8,15.21],[-0.06,20.21],[0.58,24.7],[1.18,24.52],[3.38,27.43],[0.79,28.28],[4.79,35.51],[13.25,35.52],[14.36,29.77],[15.75,29.68],[16,23.31],[13.96,23.98],[12.44,21.12],[13.49,20.8],[11.23,17.07],[8.75,9.36],[11.42,1.05],[8.02,-0.94],[12.11,-3.27],[11.73,-4.85],[14.44,-7.7],[17.07,-12.04],[15.91,-13.47],[16.84,-16.68],[14.71,-17.87],[14.8,-19.64],[12.5,-18.34],[10.87,-19.55],[9.94,-18.28],[4.96,-17.23],[4.74,-15.18],[0.1,-7.21],[-1.8,-10.22],[-10.18,-4.36],[-18.79,-5.55],[-18.73,-5],[-24.78,-5.15],[-24.7,-6.76],[-29.3,-6.08],[-29.97,-4.21],[-31.99,-4.43],[-32.75,-5.69],[-34.97,-4.08]];
  const ROOFS = [
    { face: 197, h: 66.15, poly: [[-0.73,-8.5],[-1.03,-7.93],[-3.16,-9.27],[-1.8,-10.22]] },
    { face: 198, h: 67.13, poly: [[10.1,-8.92],[9.27,-7.91],[6.36,-10.37],[7.36,-11.29]] },
    { face: 199, h: 29.94, poly: [[-20.82,6.08],[-21.96,6.41],[-21.8,4.87],[-20.83,5.55]] },
    { face: 200, h: 8.43, poly: [[-36.88,-4.25],[-35.85,-4.15],[-36.94,6.28],[-37.1,6.25],[-37.07,-3.62],[-36.88,-3.72]] },
    { face: 201, h: 6.91, poly: [[-28.3,8.27],[-36.94,6.28],[-35.85,-4.15],[-34.97,-4.08],[-34.04,-4.65],[-31.99,-4.43],[-30.68,-2.23],[-31.71,0.66],[-29.83,3.5]] },
    { face: 202, h: 9.02, poly: [[-34.04,-4.65],[-32.75,-5.69],[-31.99,-4.43]] },
    { face: 203, h: 17.7, poly: [[-24.8,7.25],[-26.45,2.57],[-25.46,-2.1],[-26.55,-5.27],[-22.01,-4.96],[-21.94,-0.41],[-23,0.33],[-22.43,3.05],[-21.63,3.11],[-21.96,6.41]] },
    { face: 205, h: 29.96, poly: [[-21.23,-0.9],[-21.63,3.11],[-22.43,3.05],[-23,0.33]] },
    { face: 206, h: 10.5, poly: [[-24.7,-6.76],[-24.78,-5.15],[-26.55,-5.27],[-25.46,-2.1],[-26.45,2.57],[-24.8,7.25],[-28.3,8.27],[-29.83,3.5],[-31.71,0.66],[-30.68,-2.23],[-31.99,-4.43],[-29.97,-4.21],[-29.3,-6.08]] },
    { face: 209, h: 53.72, poly: [[-2.62,12.85],[3.4,14.97],[3.59,16.41],[7.08,15.47],[9.45,11.54],[11.41,17.36],[-0.04,20.4]] },
    { face: 210, h: 64.43, poly: [[-16.27,-0.09],[-12.96,-2.41],[-11.67,-4.56],[-10.18,-4.36],[-3.16,-9.27],[-1.03,-7.93],[-0.73,-8.5],[1.18,-5.41],[-3.73,-3.5],[-3.3,-2.81],[-6.35,0.96],[3.2,7.53],[5.97,0],[7.88,-1.02],[11.42,1.05],[8.75,9.36],[9.45,11.54],[7.08,15.47],[3.59,16.41],[3.4,14.97],[-2.62,12.85],[-2.38,13.55],[-3.2,12.74],[-3.84,13.16],[-4.57,11.39],[-6.04,9.95],[-6.88,11.1],[-10.93,7.43],[-9.93,7.31],[-12.48,3.86],[-15.69,2.17],[-15.06,1.11]] },
    { face: 211, h: 29.79, poly: [[-17.33,-4.94],[-18.73,-5],[-18.79,-5.55],[-17.47,-5.36]] },
    { face: 213, h: 53.71, poly: [[-18.56,-4.99],[-16.86,-4.92],[-16.75,-5.26],[-11.67,-4.56],[-12.96,-2.41],[-16.27,-0.09],[-15.06,1.11],[-15.69,2.17],[-12.48,3.86],[-9.93,7.31],[-18.09,8.34],[-17.94,6.26],[-17.55,5.91],[-18.09,0.92],[-18.71,0.59],[-17.64,-2.61],[-18.71,-3.11]] },
    { face: 214, h: 55.37, poly: [[-3.84,13.16],[-3.2,12.74],[-2.38,13.55],[-1.8,15.21],[-2.84,15.56]] },
    { face: 215, h: 55.04, poly: [[-18.5,6.75],[-17.75,4.03],[-17.55,5.91]] },
    { face: 216, h: 29.95, poly: [[5.24,21.66],[6.33,22.96],[4.55,23.5]] },
    { face: 217, h: 28.5, poly: [[-0.04,20.4],[11.41,17.36],[13.49,20.8],[6.33,22.96],[5.24,21.66],[4.55,23.5],[0.58,24.7]] },
    { face: 218, h: 17.71, poly: [[13.96,23.98],[3.38,27.43],[1.18,24.52],[12.44,21.12]] },
    { face: 219, h: 10.5, poly: [[0.79,28.28],[16,23.31],[15.75,29.68],[7.42,30.23],[6.85,31.06],[5.47,30.36],[2.07,30.59]] },
    { face: 221, h: 28.48, poly: [[-18.09,8.34],[-20.78,8.68],[-20.83,5.55],[-21.8,4.87],[-21.23,-0.9],[-21.94,-0.41],[-22.02,-5.14],[-18.56,-4.99],[-18.9,-0.67],[-18.29,-0.9],[-18.27,-0.71],[-18.71,0.59],[-18.98,0.45],[-19.08,1.72],[-18.71,0.59],[-18.09,0.92],[-17.75,4.03],[-18.5,6.75],[-17.94,6.26]] },
    { face: 222, h: 55.22, poly: [[-18.71,-3.11],[-17.64,-2.61],[-18.2,-0.93],[-18.9,-0.67]] },
    { face: 223, h: 64.49, poly: [[14.23,-7.85],[4.58,-14.91],[4.96,-17.23],[6.05,-17.1],[8.28,-17.71],[6.91,-14.57],[8.4,-14.77],[9.01,-16.35],[12.25,-18.19],[12.11,-18.33],[12.5,-18.34],[14.8,-19.64],[14.71,-17.87],[16.84,-16.68],[15.91,-13.47],[17.07,-12.04]], holes: [[[12.5,-12.72],[11.32,-12.87],[10.49,-11.95],[11.23,-10.74]]] },
    { face: 224, h: 6.91, poly: [[2.07,30.59],[5.47,30.36],[6.85,31.06],[7.42,30.23],[14.36,29.77],[13.33,35.11],[4.5,34.98]] },
    { face: 225, h: 8.31, poly: [[4.5,34.98],[13.33,35.11],[13.25,35.52],[4.79,35.51]] },
    { face: 226, h: 65.82, poly: [[14.44,-7.7],[11.73,-4.85],[12.11,-3.27],[5.97,0],[3.2,7.53],[-6.35,0.96],[-3.3,-2.81],[-3.73,-3.5],[1.18,-5.41],[0.1,-7.21],[4.58,-14.91]], holes: [[[6.36,-10.37],[9.27,-7.91],[10.1,-8.92],[7.36,-11.29]]] },
    { face: 227, h: 65.49, poly: [[6.91,-14.57],[8.52,-18.26],[9.94,-18.28],[10.87,-19.55],[12.25,-18.19],[9.01,-16.35],[8.4,-14.77]] },
    { face: 228, h: 65.49, poly: [[11.23,-10.74],[10.49,-11.95],[11.32,-12.87],[12.5,-12.72]] },
  ];
  // Glazen entreepaviljoen: hoekpunten van de drie hellende dakvlakken (u, v, NAP).
  const PAVILION = [[-9.39,16.21,8.15],[-10.62,17.21,6.22],[-12.1,15.95,6.39],[-10.71,14.98,8.42],[-10.01,15.39,8.53],[-9.05,15.94,8.68],[-4.57,11.39,13.7],[-3.84,13.16,12.91],[-2.84,15.56,11.84],[-8.17,17.35,11.82],[-9.39,16.21,12.43],[-9.05,15.94,12.49],[-10.01,15.39,12.83],[-6.88,11.1,14.12],[-6.04,9.95,14.46],[-10.71,14.98,12.55],[-12.64,13.85,11.77],[-11.95,7.56,12.06],[-10.93,7.43,12.48],[-6.88,11.1,14.12],[-10.01,15.39,12.83]];
  return { FOOTPRINT, ROOFS, PAVILION };
}